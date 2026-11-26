const cutoutCache = new Map<string, Promise<string>>();

/**
 * Converts an isolated eyewear packshot (shot on pure black or pure white)
 * into a genuine transparent-background PNG blob URL via border flood-fill
 * with smooth edge anti-aliasing and halo removal.
 * Optimized to 340px max width with immediate canvas cleanup for zero main-thread lag.
 */
export function getTransparentCutoutUrl(
  src: string,
  options?: { clearWhiteLenses?: boolean }
): Promise<string> {
  const key = `${src}::${options?.clearWhiteLenses ? 'cwl' : 'std'}`;
  const existing = cutoutCache.get(key);
  if (existing) return existing;

  const task = new Promise<string>((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.decoding = 'async';

    img.onload = () => {
      // Yield a micro-slice so initial eye playback never drops frames
      window.setTimeout(() => {
        const canvas = document.createElement('canvas');
        try {
          const maxW = 340;
          const ratio = img.naturalWidth > maxW ? maxW / img.naturalWidth : 1;
          const w = Math.max(1, Math.round(img.naturalWidth * ratio));
          const h = Math.max(1, Math.round(img.naturalHeight * ratio));

          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d', { willReadFrequently: true });
          if (!ctx) {
            resolve(src);
            return;
          }

          ctx.drawImage(img, 0, 0, w, h);
          const imgData = ctx.getImageData(0, 0, w, h);
          const data = imgData.data;

          // Sample average corner background color
          const corners = [
            (2 * w + 2) * 4,
            (2 * w + Math.max(0, w - 3)) * 4,
            (Math.max(0, h - 3) * w + 2) * 4,
            (Math.max(0, h - 3) * w + Math.max(0, w - 3)) * 4,
          ];
          let bgR = 0;
          let bgG = 0;
          let bgB = 0;
          for (const idx of corners) {
            bgR += data[idx];
            bgG += data[idx + 1];
            bgB += data[idx + 2];
          }
          bgR /= corners.length;
          bgG /= corners.length;
          bgB /= corners.length;

          const bgLum = 0.299 * bgR + 0.587 * bgG + 0.114 * bgB;
          const isWhiteBg = bgLum > 200;
          const hardThreshold = isWhiteBg ? 34 : 20;
          const hardThresholdSq = hardThreshold * hardThreshold;
          const softThreshold = isWhiteBg ? 74 : 40;

          const total = w * h;
          const visited = new Uint8Array(total);
          const isBg = new Uint8Array(total);
          const queue = new Int32Array(total);
          let head = 0;
          let tail = 0;

          const distSqFromBg = (pIdx: number) => {
            const i = pIdx * 4;
            const dr = data[i] - bgR;
            const dg = data[i + 1] - bgG;
            const db = data[i + 2] - bgB;
            return dr * dr + dg * dg + db * db;
          };

          const enqueueIfBg = (x: number, y: number) => {
            const p = y * w + x;
            if (visited[p]) return;
            visited[p] = 1;
            if (distSqFromBg(p) <= hardThresholdSq) {
              isBg[p] = 1;
              queue[tail++] = p;
            }
          };

          for (let x = 0; x < w; x++) {
            enqueueIfBg(x, 0);
            enqueueIfBg(x, h - 1);
          }
          for (let y = 0; y < h; y++) {
            enqueueIfBg(0, y);
            enqueueIfBg(w - 1, y);
          }

          while (head < tail) {
            const p = queue[head++];
            const x = p % w;
            const y = (p - x) / w;

            if (x > 0) enqueueIfBg(x - 1, y);
            if (x < w - 1) enqueueIfBg(x + 1, y);
            if (y > 0) enqueueIfBg(x, y - 1);
            if (y < h - 1) enqueueIfBg(x, y + 1);
          }

          for (let p = 0; p < total; p++) {
            const i = p * 4;
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            if (isBg[p]) {
              data[i + 3] = 0;
              continue;
            }

            if (isWhiteBg) {
              if (r > 238 && g > 238 && b > 238) {
                data[i + 3] = 0;
                continue;
              }
            } else {
              if (r <= 6 && g <= 6 && b <= 6) {
                data[i + 3] = 0;
                continue;
              }
            }

            if (
              options?.clearWhiteLenses &&
              r > 230 &&
              g > 230 &&
              b > 230 &&
              Math.abs(r - g) < 10 &&
              Math.abs(g - b) < 10
            ) {
              data[i] = 215;
              data[i + 1] = 224;
              data[i + 2] = 235;
              data[i + 3] = 32;
              continue;
            }

            const x = p % w;
            const y = (p - x) / w;
            const touchesBg =
              (x > 0 && isBg[p - 1]) ||
              (x < w - 1 && isBg[p + 1]) ||
              (y > 0 && isBg[p - w]) ||
              (y < h - 1 && isBg[p + w]);

            if (touchesBg) {
              const d = Math.sqrt(distSqFromBg(p));
              if (d < softThreshold) {
                const alphaNorm = Math.max(
                  0,
                  Math.min(1, (d - hardThreshold * 0.7) / (softThreshold - hardThreshold * 0.7))
                );
                data[i + 3] = Math.round(alphaNorm * 255);
                if (isWhiteBg && alphaNorm > 0.05) {
                  data[i] = Math.max(0, Math.round((r - 255 * (1 - alphaNorm)) / alphaNorm));
                  data[i + 1] = Math.max(0, Math.round((g - 255 * (1 - alphaNorm)) / alphaNorm));
                  data[i + 2] = Math.max(0, Math.round((b - 255 * (1 - alphaNorm)) / alphaNorm));
                }
              }
            }
          }

          ctx.putImageData(imgData, 0, 0);
          canvas.toBlob(
            (blob) => {
              // Immediately release backing buffer memory
              canvas.width = 0;
              canvas.height = 0;
              if (blob) {
                resolve(URL.createObjectURL(blob));
              } else {
                resolve(src);
              }
            },
            'image/png'
          );
        } catch {
          canvas.width = 0;
          canvas.height = 0;
          resolve(src);
        }
      }, 0);
    };

    img.onerror = () => resolve(src);
    img.src = src;
  });

  cutoutCache.set(key, task);
  return task;
}
