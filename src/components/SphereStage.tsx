import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUpRight, ChevronDown, Eye, LayoutGrid, Orbit, RotateCcw } from 'lucide-react';
import { EyewearProduct } from '../data/eyewear';
import { Lang, T } from '../data/i18n';
import { getTransparentCutoutUrl } from '../utils/cutout';

export const EYE_VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260922_195107_ed3f055a-3a13-4a71-b743-e10310454246.mp4';

// Scroll anchor multipliers relative to window.innerHeight (total spacer = 315vh)
export const EYE_PORTAL_END_VH = 1.6;
export const SCULPTURE_REST_VH = 1.65;
export const SCULPTURE_EXIT_START_VH = 1.95;
export const SCULPTURE_EXIT_END_VH = 2.95;

interface SphereStageProps {
  products: EyewearProduct[];
  lang: Lang;
  revealed: boolean;
  replayKey: number;
  focusedId: string | null;
  onRevealed: () => void;
  onSectionChange: (section: 'sphere' | 'catalog') => void;
  onPreviewProduct: (product: EyewearProduct) => void;
  onOpenCatalog: () => void;
  onReplayIntro: () => void;
}

interface GlassesSlot {
  x: number;
  y: number; // positive = UP
  z: number; // positive = FRONT
  rotY: number;
  rotX: number;
  rotZ: number;
  scale: number;
}

interface CardNodeData extends GlassesSlot {
  el: HTMLDivElement;
  product: EyewearProduct;
  lastOp: string;
}

// Lightweight quaternion math for true gimbal-lock-free 360° 3D model rotation in ALL directions
type Quat = [number, number, number, number]; // [x, y, z, w]

function normalizeQuat(q: Quat): Quat {
  const len = Math.hypot(q[0], q[1], q[2], q[3]) || 1;
  return [q[0] / len, q[1] / len, q[2] / len, q[3] / len];
}

function mulQuat(a: Quat, b: Quat): Quat {
  const [ax, ay, az, aw] = a;
  const [bx, by, bz, bw] = b;
  return [
    aw * bx + ax * bw + ay * bz - az * by,
    aw * by - ax * bz + ay * bw + az * bx,
    aw * bz + ax * by - ay * bx + az * bw,
    aw * bw - ax * bx - ay * by - az * bz,
  ];
}

function quatFromAxisAngle(ax: number, ay: number, az: number, rad: number): Quat {
  const half = rad * 0.5;
  const s = Math.sin(half);
  return [ax * s, ay * s, az * s, Math.cos(half)];
}

function slerpQuat(a: Quat, b: Quat, t: number): Quat {
  let dot = a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
  const target: Quat = dot < 0 ? [-b[0], -b[1], -b[2], -b[3]] : [...b];
  dot = Math.abs(dot);
  if (dot > 0.9995) {
    return normalizeQuat([
      a[0] + (target[0] - a[0]) * t,
      a[1] + (target[1] - a[1]) * t,
      a[2] + (target[2] - a[2]) * t,
      a[3] + (target[3] - a[3]) * t,
    ]);
  }
  const theta = Math.acos(Math.min(1, dot));
  const sinT = Math.sin(theta) || 1;
  const w1 = Math.sin((1 - t) * theta) / sinT;
  const w2 = Math.sin(t * theta) / sinT;
  return [
    a[0] * w1 + target[0] * w2,
    a[1] * w1 + target[1] * w2,
    a[2] * w1 + target[2] * w2,
    a[3] * w1 + target[3] * w2,
  ];
}

function makeDefaultPoseQuat(): Quat {
  const qY = quatFromAxisAngle(0, 1, 0, (-14 * Math.PI) / 180);
  const qX = quatFromAxisAngle(1, 0, 0, (-7 * Math.PI) / 180);
  return normalizeQuat(mulQuat(qY, qX));
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

/**
 * Generates 62 densely packed 3D eyeglasses coordinates:
 * - 16 Left lens outer rim + 7 Left lens inner depth ring
 * - 16 Right lens outer rim + 7 Right lens inner depth ring
 * - 4 Double nose bridge & brow bar
 * - 6 Left 3D temple arm + 6 Right 3D temple arm
 */
function buildDenseGlassesSlots(): GlassesSlot[] {
  const slots: GlassesSlot[] = [];

  const lensCX = 0.63;
  const lensCY = -0.02;

  const addLensRing = (
    side: -1 | 1,
    count: number,
    rx: number,
    ry: number,
    zBase: number,
    scale: number,
    angleOffsetDeg: number
  ) => {
    for (let i = 0; i < count; i++) {
      const deg =
        side === -1
          ? angleOffsetDeg + i * (360 / count)
          : 180 - angleOffsetDeg - i * (360 / count);
      const rad = (deg * Math.PI) / 180;
      const cosA = Math.cos(rad);
      const sinA = Math.sin(rad);
      const cheekTaper = sinA < 0 ? 1 + sinA * 0.08 : 1;
      const localX = rx * cosA * cheekTaper;
      const x = side * lensCX + localX;
      const y = lensCY + ry * sinA;
      const z = zBase - 0.13 * Math.pow(Math.abs(localX) / rx, 1.35);
      const rotY = -(localX / rx) * 16;
      const rotX = (y / ry) * 7;
      slots.push({ x, y, z, rotY, rotX, rotZ: 0, scale });
    }
  };

  addLensRing(-1, 16, 0.43, 0.38, 0.28, 1.0, 11);
  addLensRing(-1, 7, 0.29, 0.25, 0.36, 0.82, 26);

  addLensRing(1, 16, 0.43, 0.38, 0.28, 1.0, 11);
  addLensRing(1, 7, 0.29, 0.25, 0.36, 0.82, 26);

  slots.push(
    { x: -0.11, y: 0.15, z: 0.32, rotY: 5, rotX: 4, rotZ: 0, scale: 0.9 },
    { x: 0.11, y: 0.15, z: 0.32, rotY: -5, rotX: 4, rotZ: 0, scale: 0.9 },
    { x: 0, y: 0.26, z: 0.34, rotY: 0, rotX: 6, rotZ: 0, scale: 0.95 },
    { x: 0, y: 0.07, z: 0.3, rotY: 0, rotX: 2, rotZ: 0, scale: 0.84 }
  );

  const templeSteps = [
    { z: 0.08, y: 0.13, rotY: 74, rotX: 0, s: 0.92 },
    { z: -0.09, y: 0.13, rotY: 84, rotX: 0, s: 0.94 },
    { z: -0.27, y: 0.12, rotY: 88, rotX: 0, s: 0.92 },
    { z: -0.45, y: 0.11, rotY: 88, rotX: 0, s: 0.9 },
    { z: -0.63, y: 0.05, rotY: 88, rotX: -12, s: 0.88 },
    { z: -0.79, y: -0.09, rotY: 88, rotX: -26, s: 0.85 },
  ];

  for (const t of templeSteps) {
    slots.push({
      x: -1.09,
      y: t.y,
      z: t.z,
      rotY: -t.rotY,
      rotX: t.rotX,
      rotZ: 0,
      scale: t.s,
    });
  }

  for (const t of templeSteps) {
    slots.push({
      x: 1.09,
      y: t.y,
      z: t.z,
      rotY: t.rotY,
      rotX: t.rotX,
      rotZ: 0,
      scale: t.s,
    });
  }

  return slots;
}

export default function SphereStage({
  products,
  lang,
  revealed,
  replayKey,
  focusedId,
  onRevealed,
  onSectionChange,
  onPreviewProduct,
  onOpenCatalog,
  onReplayIntro,
}: SphereStageProps) {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const worldRef = useRef<HTMLDivElement | null>(null);
  const orbRef = useRef<HTMLDivElement | null>(null);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const frontWireRef = useRef<HTMLDivElement | null>(null);
  const frontWireBackRef = useRef<HTMLDivElement | null>(null);
  const leftRailRef = useRef<HTMLDivElement | null>(null);
  const rightRailRef = useRef<HTMLDivElement | null>(null);

  const eyePortalRef = useRef<HTMLDivElement | null>(null);
  const eyeVideoRef = useRef<HTMLVideoElement | null>(null);
  const eyeFallbackRef = useRef<HTMLDivElement | null>(null);
  const eyeVeilRef = useRef<HTMLDivElement | null>(null);
  const vigRef = useRef<HTMLDivElement | null>(null);
  const hudRef = useRef<HTMLDivElement | null>(null);
  const hudControlsRef = useRef<HTMLElement | null>(null);
  const scrollDownBtnRef = useRef<HTMLButtonElement | null>(null);
  const hoverCardRef = useRef<HTMLDivElement | null>(null);

  const cardsDataRef = useRef<CardNodeData[]>([]);
  const scaleRef = useRef<number>(360);
  const perspRef = useRef<number>(1150);

  const focusedIdRef = useRef<string | null>(focusedId);
  const onPreviewRef = useRef(onPreviewProduct);
  const onRevealedRef = useRef(onRevealed);
  const onSectionChangeRef = useRef(onSectionChange);

  // Full 360° 3D model quaternion orientation & momentum refs
  const quatRef = useRef<Quat>(makeDefaultPoseQuat());
  const resettingPoseRef = useRef<boolean>(false);
  const autoSpinRef = useRef<boolean>(false);
  const velYawRef = useRef<number>(0);
  const velPitchRef = useRef<number>(0);
  const lastDragEndRef = useRef<number>(0);
  const lastOpenTsRef = useRef<number>(0);
  const hoveredIdxRef = useRef<number>(-1);
  const isDraggingRef = useRef<boolean>(false);

  // Portal animation engine refs
  const modeRef = useRef<'auto-dive' | 'scroll'>('auto-dive');
  const smoothEyePRef = useRef<number>(0);
  const smoothExitPRef = useRef<number>(0);
  const autoStartTimeRef = useRef<number>(performance.now());
  const videoPlayingAutoRef = useRef<boolean>(false);
  const lastSectionRef = useRef<'sphere' | 'catalog'>('sphere');

  const [eyeVideoReady, setEyeVideoReady] = useState(false);
  const [cutoutBySrc, setCutoutBySrc] = useState<Record<string, string>>({});
  const [hoveredProduct, setHoveredProduct] = useState<EyewearProduct | null>(null);
  const [autoSpin, setAutoSpin] = useState(false);

  focusedIdRef.current = focusedId;
  onPreviewRef.current = onPreviewProduct;
  onRevealedRef.current = onRevealed;
  onSectionChangeRef.current = onSectionChange;
  autoSpinRef.current = autoSpin;

  const copy = T[lang];

  // Expand all 24 catalog products across our 62 sculpted 3D eyeglasses slots
  const sculptureItems = useMemo(() => {
    const slots = buildDenseGlassesSlots();
    return slots.map((slot, idx) => ({
      slotKey: `slot-${idx}`,
      slot,
      product: products[idx % products.length],
    }));
  }, [products]);

  const positionHoverCard = (clientX: number, clientY: number) => {
    const el = hoverCardRef.current;
    if (!el) return;
    const cardW = 268;
    const cardH = 104;
    const margin = 16;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let left = clientX + 20;
    if (left + cardW + margin > vw) {
      left = clientX - cardW - 20;
    }
    left = clamp(left, margin, Math.max(margin, vw - cardW - margin));

    let top = clientY - cardH * 0.5;
    top = clamp(top, 76, Math.max(76, vh - cardH - margin));

    el.style.transform = `translate3d(${left.toFixed(0)}px, ${top.toFixed(0)}px, 0) scale(1)`;
  };

  const clearHover = () => {
    if (hoveredIdxRef.current >= 0) {
      const prevNode = cardsDataRef.current[hoveredIdxRef.current];
      prevNode?.el.classList.remove('is-hovered');
      hoveredIdxRef.current = -1;
    }
    setHoveredProduct(null);
  };

  const openPreviewSafely = (product: EyewearProduct) => {
    const now = performance.now();
    if (now - lastOpenTsRef.current < 220) return;
    lastOpenTsRef.current = now;
    clearHover();
    onPreviewRef.current(product);
  };

  const handleReset3DAngle = () => {
    setAutoSpin(false);
    autoSpinRef.current = false;
    velYawRef.current = 0;
    velPitchRef.current = 0;
    resettingPoseRef.current = true;
  };

  // Clear hover whenever any modal opens
  useEffect(() => {
    if (focusedId) {
      clearHover();
    }
  }, [focusedId]);

  // Process ONLY the 8 unique isolated eyewear packshots sequentially (zero main-thread freeze!)
  useEffect(() => {
    let alive = true;
    const uniqueTasks: { key: string; src: string; clearWhiteLenses?: boolean }[] = [];
    const seen = new Set<string>();

    for (const p of products) {
      const key = `${p.cutoutImage}::${p.clearWhiteLenses ? 'cwl' : 'std'}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueTasks.push({ key, src: p.cutoutImage, clearWhiteLenses: p.clearWhiteLenses });
      }
    }

    (async () => {
      for (const item of uniqueTasks) {
        if (!alive) return;
        const blobUrl = await getTransparentCutoutUrl(item.src, {
          clearWhiteLenses: item.clearWhiteLenses,
        });
        if (!alive) return;
        setCutoutBySrc((prev) =>
          prev[item.key] === blobUrl ? prev : { ...prev, [item.key]: blobUrl }
        );
      }
    })();

    return () => {
      alive = false;
    };
  }, [products]);

  // Trigger pure opening eye dive on initial mount and whenever replayKey increments
  useEffect(() => {
    const vid = eyeVideoRef.current;
    modeRef.current = 'auto-dive';
    smoothEyePRef.current = 0;
    smoothExitPRef.current = 0;
    quatRef.current = makeDefaultPoseQuat();
    velYawRef.current = 0;
    velPitchRef.current = 0;
    resettingPoseRef.current = false;
    autoStartTimeRef.current = performance.now();
    videoPlayingAutoRef.current = false;
    clearHover();

    window.scrollTo(0, 0);
    document.documentElement.style.setProperty('--portal-ui-opacity', '0');
    document.documentElement.style.setProperty('--portal-ui-pe', 'none');

    if (!vid) return;

    vid.muted = true;
    vid.defaultMuted = true;
    vid.playsInline = true;
    vid.setAttribute('webkit-playsinline', 'true');

    const startPlayback = () => {
      if (modeRef.current !== 'auto-dive') return;
      try {
        vid.currentTime = 0;
      } catch {
        // ignore seek before ready
      }
      vid.playbackRate = 1.85;
      const playPromise = vid.play();
      if (playPromise && typeof playPromise.then === 'function') {
        playPromise
          .then(() => {
            videoPlayingAutoRef.current = true;
            vid.playbackRate = 1.85;
          })
          .catch(() => {
            videoPlayingAutoRef.current = false;
          });
      }
    };

    const handleLoaded = () => {
      setEyeVideoReady(true);
      if (modeRef.current === 'auto-dive' && !videoPlayingAutoRef.current) {
        startPlayback();
      }
    };

    if (vid.readyState >= 2) {
      setEyeVideoReady(true);
      startPlayback();
    } else {
      vid.addEventListener('canplay', handleLoaded, { once: true });
      vid.addEventListener('loadeddata', handleLoaded, { once: true });
    }

    // Immediate scroll handoff: if user wheels/scrolls at ANY moment, unlock scroll immediately!
    const handoffToScroll = () => {
      if (modeRef.current === 'auto-dive') {
        modeRef.current = 'scroll';
        if (!vid.paused) vid.pause();
        const targetScroll = Math.round(
          smoothEyePRef.current * window.innerHeight * EYE_PORTAL_END_VH
        );
        if (window.scrollY < 4 && targetScroll > 12) {
          window.scrollTo(0, targetScroll);
        }
        onRevealedRef.current();
      }
    };

    window.addEventListener('wheel', handoffToScroll, { passive: true });
    window.addEventListener('touchmove', handoffToScroll, { passive: true });

    return () => {
      vid.removeEventListener('canplay', handleLoaded);
      vid.removeEventListener('loadeddata', handleLoaded);
      window.removeEventListener('wheel', handoffToScroll);
      window.removeEventListener('touchmove', handoffToScroll);
    };
  }, [replayKey]);

  // Build 62-glasses true 360° 3D Eyeglasses Model + zero-lag dirty-checked render engine
  useEffect(() => {
    const stage = stageRef.current;
    const world = worldRef.current;
    const orb = orbRef.current;
    const headline = headlineRef.current;
    if (!stage || !world || !orb || !headline) return;

    const cardEls = Array.from(orb.querySelectorAll<HTMLDivElement>('.sphere-card'));
    const nodes: CardNodeData[] = cardEls.map((el, i) => {
      const entry = sculptureItems[i];
      return {
        el,
        ...entry.slot,
        product: entry.product,
        lastOp: '',
      };
    });

    cardsDataRef.current = nodes;

    let lastW = 0;
    let lastH = 0;
    let forceMatrixDirty = true;

    const layout = (force = false) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (!force && Math.abs(w - lastW) < 20 && Math.abs(h - lastH) < 20) return;
      lastW = w;
      lastH = h;
      forceMatrixDirty = true;

      const wFactor = w <= 420 ? 0.36 : w <= 768 ? 0.37 : 0.35;
      const hFactor = h <= 650 ? 0.44 : 0.5;
      const S = Math.max(125, Math.min(420, w * wFactor, h * hFactor));
      scaleRef.current = S;

      const cw = Math.round(Math.max(54, S * 0.275));
      const persp = w <= 380 ? 720 : w <= 640 ? 860 : w <= 900 ? 1020 : 1220;
      perspRef.current = persp;

      document.documentElement.style.setProperty('--cw', `${cw}px`);
      document.documentElement.style.setProperty('--persp', `${persp}px`);

      for (const c of nodes) {
        c.el.style.transform = `translate3d(${(c.x * S).toFixed(2)}px, ${(-c.y * S).toFixed(
          2
        )}px, ${(c.z * S).toFixed(2)}px) rotateY(${c.rotY.toFixed(1)}deg) rotateX(${c.rotX.toFixed(
          1
        )}deg) rotateZ(${c.rotZ.toFixed(1)}deg) scale(${c.scale.toFixed(2)})`;
      }

      const positionFrontWire = (el: HTMLDivElement | null, zFactor: number) => {
        if (!el) return;
        const fwW = S * 2.34;
        const fwH = S * 0.98;
        el.style.width = `${fwW.toFixed(1)}px`;
        el.style.height = `${fwH.toFixed(1)}px`;
        el.style.marginLeft = `${(-fwW / 2).toFixed(1)}px`;
        el.style.marginTop = `${(-fwH / 2 + S * 0.02).toFixed(1)}px`;
        el.style.transform = `translateZ(${(S * zFactor).toFixed(1)}px)`;
      };

      positionFrontWire(frontWireRef.current, 0.21);
      positionFrontWire(frontWireBackRef.current, 0.16);

      const railLen = S * 1.06;
      const railH = S * 0.34;
      const leftRail = leftRailRef.current;
      if (leftRail) {
        leftRail.style.width = `${railLen.toFixed(1)}px`;
        leftRail.style.height = `${railH.toFixed(1)}px`;
        leftRail.style.marginLeft = `${(-railLen / 2).toFixed(1)}px`;
        leftRail.style.marginTop = `${(-railH / 2).toFixed(1)}px`;
        leftRail.style.transform = `translate3d(${(-1.09 * S).toFixed(1)}px, ${(-0.02 * S).toFixed(
          1
        )}px, ${(-0.35 * S).toFixed(1)}px) rotateY(-90deg)`;
      }

      const rightRail = rightRailRef.current;
      if (rightRail) {
        rightRail.style.width = `${railLen.toFixed(1)}px`;
        rightRail.style.height = `${railH.toFixed(1)}px`;
        rightRail.style.marginLeft = `${(-railLen / 2).toFixed(1)}px`;
        rightRail.style.marginTop = `${(-railH / 2).toFixed(1)}px`;
        rightRail.style.transform = `translate3d(${(1.09 * S).toFixed(1)}px, ${(-0.02 * S).toFixed(
          1
        )}px, ${(-0.35 * S).toFixed(1)}px) rotateY(90deg)`;
      }
    };

    layout(true);

    // Subtle live pointer parallax when moving across empty stage
    let hoverNX = 0;
    let hoverNY = 0;
    let smoothHoverX = 0;
    let smoothHoverY = 0;

    // Free 360° mouse + touch drag handlers (rotates in ALL directions — X, Y, diagonal, 360°!)
    let pointerActive = false;
    let pointerId = -1;
    let isTouch = false;
    let touchStartedOnModel = false;
    let dragging = false;
    let startX = 0;
    let startY = 0;
    let lastPX = 0;
    let lastPY = 0;
    let movedDist = 0;
    let downCardIdx = -1;

    const applyWorldDeltaRotation = (dx: number, dy: number) => {
      const yawRad = dx * 0.0068;
      const pitchRad = -dy * 0.0068;
      const qYaw = quatFromAxisAngle(0, 1, 0, yawRad);
      const qPitch = quatFromAxisAngle(1, 0, 0, pitchRad);
      quatRef.current = normalizeQuat(mulQuat(qYaw, mulQuat(qPitch, quatRef.current)));
    };

    const isInsideGlassesTouchZone = (clientX: number, clientY: number) => {
      const cx = window.innerWidth * 0.5;
      const cy = window.innerHeight * 0.5;
      const rx = Math.min(window.innerWidth * 0.44, scaleRef.current * 1.25);
      const ry = Math.min(window.innerHeight * 0.34, scaleRef.current * 0.65);
      return Math.abs(clientX - cx) <= rx && Math.abs(clientY - cy) <= ry;
    };

    const onPointerDown = (e: PointerEvent) => {
      if (
        focusedIdRef.current ||
        smoothEyePRef.current < 0.85 ||
        smoothExitPRef.current > 0.72
      ) {
        return;
      }
      if (e.pointerType === 'mouse' && e.button !== 0) return;

      const cardEl = (e.target as HTMLElement | null)?.closest<HTMLDivElement>('.sphere-card');
      downCardIdx = cardEl ? Number(cardEl.dataset.idx ?? -1) : -1;

      isTouch = e.pointerType === 'touch';
      touchStartedOnModel = !isTouch || Boolean(cardEl) || isInsideGlassesTouchZone(e.clientX, e.clientY);

      // If touch starts outside the glasses sculpture margins, let native touch scroll work seamlessly!
      if (isTouch && !touchStartedOnModel) return;

      pointerActive = true;
      pointerId = e.pointerId;
      dragging = false;
      startX = lastPX = e.clientX;
      startY = lastPY = e.clientY;
      movedDist = 0;
      velYawRef.current = 0;
      velPitchRef.current = 0;
      resettingPoseRef.current = false;
    };

    const onWindowPointerMove = (e: PointerEvent) => {
      if (!pointerActive) {
        if (e.pointerType === 'mouse' && !focusedIdRef.current) {
          if (hoveredIdxRef.current >= 0) {
            positionHoverCard(e.clientX, e.clientY);
          } else {
            hoverNX = (e.clientX / Math.max(1, window.innerWidth) - 0.5) * 2;
            hoverNY = (e.clientY / Math.max(1, window.innerHeight) - 0.5) * 2;
          }
        }
        return;
      }

      if (e.pointerId !== pointerId) return;

      const dxTotal = e.clientX - startX;
      const dyTotal = e.clientY - startY;
      movedDist = Math.hypot(dxTotal, dyTotal);

      const dragThreshold = isTouch ? 8 : 5;
      if (!dragging) {
        if (movedDist < dragThreshold) return;
        dragging = true;
        isDraggingRef.current = true;
        stage.classList.add('dragging');
        clearHover();
      }

      const dx = e.clientX - lastPX;
      const dy = e.clientY - lastPY;
      lastPX = e.clientX;
      lastPY = e.clientY;

      applyWorldDeltaRotation(dx, dy);
      velYawRef.current = dx * 0.85;
      velPitchRef.current = dy * 0.85;
    };

    const onWindowPointerUp = (e: PointerEvent) => {
      if (!pointerActive || e.pointerId !== pointerId) return;
      const wasDragging = dragging;
      pointerActive = false;
      dragging = false;
      isDraggingRef.current = false;
      stage.classList.remove('dragging');

      if (wasDragging) {
        lastDragEndRef.current = performance.now();
      }

      const clickSlop = isTouch ? 18 : 10;
      if (!wasDragging && movedDist <= clickSlop && downCardIdx >= 0 && nodes[downCardIdx]) {
        openPreviewSafely(nodes[downCardIdx].product);
      }
    };

    const onWindowPointerCancel = () => {
      pointerActive = false;
      dragging = false;
      isDraggingRef.current = false;
      stage.classList.remove('dragging');
    };

    // Prevent browser touch-scroll hijacking ONLY while actively rotating the 3D glasses on touch
    const onTouchMoveStage = (e: TouchEvent) => {
      if (pointerActive && touchStartedOnModel && e.touches.length === 1) {
        e.preventDefault();
      }
    };

    const onPointerLeaveStage = () => {
      if (!pointerActive) {
        clearHover();
      }
    };

    const onDoubleClick = (e: MouseEvent) => {
      if ((e.target as HTMLElement | null)?.closest('.sphere-card')) return;
      handleReset3DAngle();
    };

    stage.addEventListener('pointerdown', onPointerDown);
    stage.addEventListener('pointerleave', onPointerLeaveStage);
    stage.addEventListener('dblclick', onDoubleClick);
    stage.addEventListener('touchmove', onTouchMoveStage, { passive: false });
    window.addEventListener('pointermove', onWindowPointerMove, { passive: true });
    window.addEventListener('pointerup', onWindowPointerUp, { passive: true });
    window.addEventListener('pointercancel', onWindowPointerCancel, { passive: true });

    const onResize = () => layout(false);
    let orientTimer = 0;
    const onOrientation = () => {
      window.clearTimeout(orientTimer);
      orientTimer = window.setTimeout(() => layout(true), 220);
    };
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onOrientation);

    const reducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let lastUiOpStr = '';
    let lastUiPe = '';
    let lastWorldTransform = '';
    let lastFocusKey: string | null = null;
    let lastEyePortalOp = '';
    let lastEyeVeilOp = '';
    let lastEyeScale = '';
    let lastStageOp = '';
    let lastStagePe = '';
    let lastSeekTs = 0;
    let rafId = 0;

    const finishAutoDive = () => {
      const vid = eyeVideoRef.current;
      if (vid && !vid.paused) {
        vid.pause();
      }
      const restScroll = Math.round(window.innerHeight * SCULPTURE_REST_VH);
      smoothEyePRef.current = 1;
      smoothExitPRef.current = 0;
      modeRef.current = 'scroll';
      window.scrollTo(0, restScroll);
      onRevealedRef.current();
    };

    const defaultPose = makeDefaultPoseQuat();

    const renderFrame = (now: number) => {
      if (document.hidden) return;

      const S = scaleRef.current;
      const persp = perspRef.current;
      const focusKey = focusedIdRef.current;
      const hasFocus = Boolean(focusKey);
      const H = Math.max(1, window.innerHeight);

      const eyePortal = eyePortalRef.current;
      const eyeVid = eyeVideoRef.current;
      const eyeFallback = eyeFallbackRef.current;
      const eyeVeil = eyeVeilRef.current;
      const vig = vigRef.current;
      const hud = hudRef.current;
      const hudControls = hudControlsRef.current;
      const scrollDownBtn = scrollDownBtnRef.current;

      // 1. Compute eyeP & exitP
      let eyeP = smoothEyePRef.current;
      let exitP = smoothExitPRef.current;

      if (modeRef.current === 'auto-dive') {
        const elapsed = now - autoStartTimeRef.current;
        if (reducedMotion) {
          finishAutoDive();
          eyeP = 1;
        } else if (
          videoPlayingAutoRef.current &&
          eyeVid &&
          Number.isFinite(eyeVid.duration) &&
          eyeVid.duration > 0.2
        ) {
          const vidRatio = clamp(eyeVid.currentTime / (eyeVid.duration - 0.12), 0, 1);
          eyeP += (vidRatio - eyeP) * 0.24;
          smoothEyePRef.current = eyeP;
          if (eyeVid.ended || vidRatio >= 0.985 || elapsed > 5000) {
            finishAutoDive();
            eyeP = 1;
          }
        } else {
          const linear = clamp(elapsed / 2200, 0, 1);
          const eased =
            linear < 0.5
              ? 4 * linear * linear * linear
              : 1 - Math.pow(-2 * linear + 2, 3) / 2;
          eyeP = eased;
          smoothEyePRef.current = eyeP;
          if (linear >= 1) {
            finishAutoDive();
            eyeP = 1;
          }
        }
        exitP = 0;
        smoothExitPRef.current = 0;
      } else {
        const sy = window.scrollY;
        const eyeEndPx = H * EYE_PORTAL_END_VH;
        const exitStartPx = H * SCULPTURE_EXIT_START_VH;
        const exitEndPx = H * SCULPTURE_EXIT_END_VH;

        const rawEyeP = clamp(sy / eyeEndPx, 0, 1);
        const rawExitP = clamp((sy - exitStartPx) / Math.max(1, exitEndPx - exitStartPx), 0, 1);

        eyeP += (rawEyeP - eyeP) * 0.14;
        exitP += (rawExitP - exitP) * 0.14;
        if (Math.abs(rawEyeP - eyeP) < 0.0008) eyeP = rawEyeP;
        if (Math.abs(rawExitP - exitP) < 0.0008) exitP = rawExitP;

        smoothEyePRef.current = eyeP;
        smoothExitPRef.current = exitP;

        const nextSection: 'sphere' | 'catalog' = rawExitP > 0.55 ? 'catalog' : 'sphere';
        if (nextSection !== lastSectionRef.current) {
          lastSectionRef.current = nextSection;
          onSectionChangeRef.current(nextSection);
        }
      }

      // 2. Pure Eye Portal Layer (dirty-checked DOM writes)
      const eyeT = clamp(eyeP / 0.84, 0, 1);
      const eyeScaleVal = 1 + Math.pow(eyeT, 1.65) * 0.72;
      const pupilBlackVeil = smoothstep(0.64, 0.84, eyeP);
      const eyePortalOpacity = 1 - smoothstep(0.79, 0.92, eyeP);

      const eyePortalOpStr = eyePortalOpacity.toFixed(3);
      if (eyePortal && eyePortalOpStr !== lastEyePortalOp) {
        eyePortal.style.opacity = eyePortalOpStr;
        eyePortal.style.visibility = eyePortalOpacity > 0.002 ? 'visible' : 'hidden';
        lastEyePortalOp = eyePortalOpStr;
      }

      const eyeVeilOpStr = pupilBlackVeil.toFixed(3);
      if (eyeVeil && eyeVeilOpStr !== lastEyeVeilOp) {
        eyeVeil.style.opacity = eyeVeilOpStr;
        lastEyeVeilOp = eyeVeilOpStr;
      }

      const eyeScaleStr = eyeScaleVal.toFixed(4);
      if (eyeVid && eyePortalOpacity > 0.002) {
        if (eyeScaleStr !== lastEyeScale) {
          eyeVid.style.transform = `scale(${eyeScaleStr})`;
          lastEyeScale = eyeScaleStr;
        }

        if (
          modeRef.current === 'scroll' &&
          now - lastSeekTs > 45 &&
          eyeVid.readyState >= 2 &&
          Number.isFinite(eyeVid.duration) &&
          eyeVid.duration > 0.1 &&
          !eyeVid.seeking
        ) {
          if (!eyeVid.paused) eyeVid.pause();
          const targetTime = clamp(eyeT * (eyeVid.duration - 0.08), 0.01, eyeVid.duration - 0.05);
          if (Math.abs(eyeVid.currentTime - targetTime) > 0.035) {
            try {
              eyeVid.currentTime = targetTime;
              lastSeekTs = now;
            } catch {
              // ignore
            }
          }
        }
      }

      if (eyeFallback && eyePortalOpacity > 0.002) {
        eyeFallback.style.transform = `scale(${(1 + Math.pow(eyeT, 1.5) * 1.45).toFixed(4)})`;
      }

      // 3. Site Header & 3D Model visibility (NEVER set pointer-events:auto on fullscreen hudRef!)
      const enterEase = smoothstep(0.8, 0.99, eyeP);
      const exitFade = 1 - smoothstep(0.18, 0.92, exitP);
      const sculptureAlpha = enterEase * exitFade;

      const headerOp = hasFocus && exitP < 0.5 ? 0 : enterEase;
      const uiOpStr = headerOp.toFixed(3);
      const uiPe = headerOp > 0.65 ? 'auto' : 'none';

      if (uiOpStr !== lastUiOpStr) {
        document.documentElement.style.setProperty('--portal-ui-opacity', uiOpStr);
        lastUiOpStr = uiOpStr;
      }
      if (uiPe !== lastUiPe) {
        document.documentElement.style.setProperty('--portal-ui-pe', uiPe);
        lastUiPe = uiPe;
      }

      const stageOpStr = sculptureAlpha.toFixed(3);
      const stagePe = sculptureAlpha > 0.55 && !hasFocus ? 'auto' : 'none';
      if (stageOpStr !== lastStageOp || stagePe !== lastStagePe) {
        stage.style.opacity = stageOpStr;
        stage.style.visibility = sculptureAlpha > 0.005 ? 'visible' : 'hidden';
        stage.style.pointerEvents = stagePe;
        headline.style.opacity = hasFocus ? '0' : stageOpStr;
        if (hud) {
          const hudAlpha = hasFocus ? 0 : sculptureAlpha;
          hud.style.opacity = hudAlpha.toFixed(3);
          // CRITICAL: hudRef wrapper MUST remain pointer-events: none forever so #stage underneath stays 100% interactive!
        }
        const controlsPe = !hasFocus && sculptureAlpha > 0.55 ? 'auto' : 'none';
        if (hudControls) {
          hudControls.style.pointerEvents = controlsPe;
        }
        if (scrollDownBtn) {
          scrollDownBtn.style.pointerEvents = controlsPe;
        }
        if (vig) {
          vig.style.opacity = hasFocus ? '0' : stageOpStr;
        }
        lastStageOp = stageOpStr;
        lastStagePe = stagePe;
      }

      if (sculptureAlpha <= 0.005) {
        if (hoveredIdxRef.current >= 0) clearHover();
        return;
      }

      // 4. Full 360° Quaternion Inertia + Optional Auto-Spin + Smooth Reset + Hover Parallax
      if (!pointerActive && !hasFocus) {
        if (resettingPoseRef.current) {
          quatRef.current = slerpQuat(quatRef.current, defaultPose, 0.13);
          const dot = Math.abs(
            quatRef.current[0] * defaultPose[0] +
              quatRef.current[1] * defaultPose[1] +
              quatRef.current[2] * defaultPose[2] +
              quatRef.current[3] * defaultPose[3]
          );
          if (dot > 0.9998) {
            quatRef.current = [...defaultPose];
            resettingPoseRef.current = false;
          }
        } else if (Math.abs(velYawRef.current) > 0.04 || Math.abs(velPitchRef.current) > 0.04) {
          applyWorldDeltaRotation(velYawRef.current, velPitchRef.current);
          velYawRef.current *= 0.92;
          velPitchRef.current *= 0.92;
        } else if (autoSpinRef.current && hoveredIdxRef.current < 0) {
          // Gentle multi-axis 360° orbit showcase when Auto-Spin is enabled
          const qAutoY = quatFromAxisAngle(0, 1, 0, 0.0085);
          const qAutoX = quatFromAxisAngle(1, 0, 0, Math.sin(now * 0.0007) * 0.0022);
          quatRef.current = normalizeQuat(mulQuat(qAutoY, mulQuat(qAutoX, quatRef.current)));
        } else {
          velYawRef.current = 0;
          velPitchRef.current = 0;
        }
      }

      if (Math.abs(hoverNX - smoothHoverX) > 0.001) {
        smoothHoverX += (hoverNX - smoothHoverX) * 0.08;
      } else {
        smoothHoverX = hoverNX;
      }
      if (Math.abs(hoverNY - smoothHoverY) > 0.001) {
        smoothHoverY += (hoverNY - smoothHoverY) * 0.08;
      } else {
        smoothHoverY = hoverNY;
      }

      const qHoverY = quatFromAxisAngle(0, 1, 0, smoothHoverX * 0.1);
      const qHoverX = quatFromAxisAngle(1, 0, 0, -smoothHoverY * 0.08);
      const qScrollSpin = quatFromAxisAngle(
        0,
        1,
        0,
        ((-(1 - enterEase) * 24 + exitP * 28) * Math.PI) / 180
      );

      const qFinal = normalizeQuat(
        mulQuat(qScrollSpin, mulQuat(qHoverY, mulQuat(qHoverX, quatRef.current)))
      );

      const [qx, qy, qz, qw] = qFinal;
      const xx = qx * qx;
      const yy = qy * qy;
      const zz = qz * qz;
      const xy = qx * qy;
      const xz = qx * qz;
      const yz = qy * qz;
      const wx = qw * qx;
      const wy = qw * qy;
      const wz = qw * qz;

      const m0 = 1 - 2 * (yy + zz);
      const m1 = 2 * (xy + wz);
      const m2 = 2 * (xz - wy);

      const m4 = 2 * (xy - wz);
      const m5 = 1 - 2 * (xx + zz);
      const m6 = 2 * (yz + wx);

      const m8 = 2 * (xz + wy);
      const m9 = 2 * (yz - wx);
      const m10 = 1 - 2 * (xx + yy);

      const camZ = (1 - enterEase) * -320 + exitP * 260;

      const worldTransform = `matrix3d(${m0.toFixed(4)},${m1.toFixed(4)},${m2.toFixed(
        4
      )},0,${m4.toFixed(4)},${m5.toFixed(4)},${m6.toFixed(4)},0,${m8.toFixed(4)},${m9.toFixed(
        4
      )},${m10.toFixed(4)},0,0,0,${camZ.toFixed(1)},1)`;

      if (
        !forceMatrixDirty &&
        worldTransform === lastWorldTransform &&
        focusKey === lastFocusKey
      ) {
        return;
      }

      forceMatrixDirty = false;
      lastWorldTransform = worldTransform;
      lastFocusKey = focusKey;
      world.style.transform = worldTransform;

      const near = persp * 0.7;

      for (const c of nodes) {
        const vy = -c.y;
        const zf = m2 * c.x + m6 * vy + m10 * c.z;
        const normZ = clamp((zf / 1.2 + 1) / 2, 0, 1);

        let alpha = 0.42 + 0.58 * Math.pow(normZ, 0.78);
        const absZ = zf * S + camZ;
        if (absZ > near) {
          alpha *= Math.max(0, 1 - (absZ - near) / 190);
        }

        if (hasFocus) {
          alpha *= c.product.id === focusKey ? 0 : 0.28;
        }

        const opStr = alpha.toFixed(2);
        if (opStr !== c.lastOp) {
          c.el.style.opacity = opStr;
          c.lastOp = opStr;
        }
      }
    };

    renderFrame(performance.now());

    const loop = (now: number) => {
      renderFrame(now);
      rafId = window.requestAnimationFrame(loop);
    };
    rafId = window.requestAnimationFrame(loop);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(orientTimer);
      stage.removeEventListener('pointerdown', onPointerDown);
      stage.removeEventListener('pointerleave', onPointerLeaveStage);
      stage.removeEventListener('dblclick', onDoubleClick);
      stage.removeEventListener('touchmove', onTouchMoveStage);
      window.removeEventListener('pointermove', onWindowPointerMove);
      window.removeEventListener('pointerup', onWindowPointerUp);
      window.removeEventListener('pointercancel', onWindowPointerCancel);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onOrientation);
    };
  }, [sculptureItems]);

  const hoveredInstallment = hoveredProduct ? Math.ceil(hoveredProduct.price / 4) : 0;

  return (
    <>
      {/* 315vh scroll runway: 0 -> pure eye, 165vh -> 62-glasses 3D model, 315vh -> Shopping catalog */}
      <div id="scrolltrack" className="h-[315vh] pointer-events-none" aria-hidden="true" />

      {/* PURE MACRO EYE PORTAL — Nothing else overlaps it when visible */}
      <div id="eye-portal" ref={eyePortalRef} aria-hidden="true">
        <div
          ref={eyeFallbackRef}
          className={`eye-fallback transition-opacity duration-500 ${
            eyeVideoReady ? 'opacity-0' : 'opacity-100'
          }`}
        />
        <video
          ref={eyeVideoRef}
          src={EYE_VIDEO_URL}
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          className={eyeVideoReady ? 'opacity-100' : 'opacity-0'}
        />
        <div ref={eyeVeilRef} className="eye-pupil-veil" />
      </div>

      {/* Upright Ruq'ah Calligraphy Headline crowning the 3D glasses model */}
      <h1 id="headline" ref={headlineRef} className={revealed ? 'revealed' : ''}>
        <span className="inner">
          {copy.sphereHeadline.map((word, idx) => (
            <span key={`${lang}-${idx}`}>
              <span className="word" style={{ ['--i' as string]: idx }}>
                {word}
              </span>
              {idx < copy.sphereHeadline.length - 1 ? ' ' : ''}
            </span>
          ))}
        </span>
      </h1>

      {/* Fixed True 360° 3D Eyeglasses Model Stage (62 Hoverable & Previewable Floating Eyeglasses) */}
      <div id="stage" ref={stageRef}>
        <div id="world" ref={worldRef}>
          <div id="orb" ref={orbRef}>
            {/* Dual-Plane Brushed-Gold 3D Architectural Eyeglasses Wireframe */}
            <div ref={frontWireRef} className="glasses-wireframe" aria-hidden="true">
              <svg viewBox="0 0 1140 480" fill="none" className="w-full h-full overflow-visible">
                <path
                  d="M 85 205 C 85 95, 165 55, 275 55 C 390 55, 462 105, 462 215 C 462 340, 385 415, 272 415 C 160 415, 85 330, 85 205 Z"
                  stroke="rgba(212, 180, 131, 0.36)"
                  strokeWidth="2.2"
                />
                <path
                  d="M 1055 205 C 1055 95, 975 55, 865 55 C 750 55, 678 105, 678 215 C 678 340, 755 415, 868 415 C 980 415, 1055 330, 1055 205 Z"
                  stroke="rgba(212, 180, 131, 0.36)"
                  strokeWidth="2.2"
                />
                <path
                  d="M 452 162 Q 570 105, 688 162"
                  stroke="rgba(212, 180, 131, 0.44)"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />
                <path
                  d="M 462 195 Q 570 155, 678 195"
                  stroke="rgba(212, 180, 131, 0.24)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <line
                  x1="35"
                  y1="172"
                  x2="92"
                  y2="172"
                  stroke="rgba(212, 180, 131, 0.44)"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />
                <line
                  x1="1048"
                  y1="172"
                  x2="1105"
                  y2="172"
                  stroke="rgba(212, 180, 131, 0.44)"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div ref={frontWireBackRef} className="glasses-wireframe" aria-hidden="true">
              <svg viewBox="0 0 1140 480" fill="none" className="w-full h-full overflow-visible">
                <path
                  d="M 85 205 C 85 95, 165 55, 275 55 C 390 55, 462 105, 462 215 C 462 340, 385 415, 272 415 C 160 415, 85 330, 85 205 Z"
                  stroke="rgba(212, 180, 131, 0.2)"
                  strokeWidth="1.5"
                />
                <path
                  d="M 1055 205 C 1055 95, 975 55, 865 55 C 750 55, 678 105, 678 215 C 678 340, 755 415, 868 415 C 980 415, 1055 330, 1055 205 Z"
                  stroke="rgba(212, 180, 131, 0.2)"
                  strokeWidth="1.5"
                />
                <path
                  d="M 452 162 Q 570 105, 688 162"
                  stroke="rgba(212, 180, 131, 0.24)"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Left 3D Temple Rail */}
            <div ref={leftRailRef} className="glasses-wireframe" aria-hidden="true">
              <svg viewBox="0 0 500 170" fill="none" className="w-full h-full overflow-visible">
                <path
                  d="M 20 42 L 385 48 Q 448 52, 482 142"
                  stroke="rgba(212, 180, 131, 0.36)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Right 3D Temple Rail */}
            <div ref={rightRailRef} className="glasses-wireframe" aria-hidden="true">
              <svg viewBox="0 0 500 170" fill="none" className="w-full h-full overflow-visible">
                <path
                  d="M 480 42 L 115 48 Q 52 52, 18 142"
                  stroke="rgba(212, 180, 131, 0.36)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* 62 Hoverable & Previewable Background-Free Floating Eyeglasses */}
            {sculptureItems.map(({ slotKey, product }, idx) => {
              const cacheKey = `${product.cutoutImage}::${product.clearWhiteLenses ? 'cwl' : 'std'}`;
              const resolvedUrl = cutoutBySrc[cacheKey];
              return (
                <div
                  key={slotKey}
                  data-idx={idx}
                  className="sphere-card"
                  role="button"
                  tabIndex={0}
                  aria-label={`${product.name[lang]} — ${product.price} ${copy.sar}`}
                  onPointerEnter={(e) => {
                    if (e.pointerType !== 'mouse' || isDraggingRef.current || focusedIdRef.current) {
                      return;
                    }
                    if (hoveredIdxRef.current >= 0 && hoveredIdxRef.current !== idx) {
                      cardsDataRef.current[hoveredIdxRef.current]?.el.classList.remove('is-hovered');
                    }
                    hoveredIdxRef.current = idx;
                    e.currentTarget.classList.add('is-hovered');
                    setHoveredProduct(product);
                    positionHoverCard(e.clientX, e.clientY);
                  }}
                  onPointerLeave={(e) => {
                    if (e.pointerType !== 'mouse') return;
                    e.currentTarget.classList.remove('is-hovered');
                    if (hoveredIdxRef.current === idx) {
                      hoveredIdxRef.current = -1;
                      setHoveredProduct(null);
                    }
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (performance.now() - lastDragEndRef.current < 220) return;
                    openPreviewSafely(product);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      openPreviewSafely(product);
                    }
                  }}
                >
                  <figure>
                    <img
                      src={resolvedUrl ?? product.cutoutImage}
                      alt={product.name[lang]}
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className={resolvedUrl ? 'opacity-100' : 'opacity-0'}
                      draggable={false}
                    />
                  </figure>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Single Upright Floating Hover Preview Card (always crisp & upright at any 360° angle) */}
      <div
        ref={hoverCardRef}
        className={`hover-frame-card ${hoveredProduct && !focusedId ? 'visible' : ''}`}
        aria-hidden="true"
      >
        {hoveredProduct && (
          <div className="flex items-center gap-3">
            <img
              src={hoveredProduct.image}
              alt=""
              decoding="async"
              referrerPolicy="no-referrer"
              style={hoveredProduct.imageFilter ? { filter: hoveredProduct.imageFilter } : undefined}
              className="w-[74px] h-[74px] rounded-lg object-cover border border-[#d4b483]/35 bg-black shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="text-[10px] text-[#9b9691] truncate">
                {hoveredProduct.shape[lang]} · {hoveredProduct.sku}
              </div>
              <div className="font-editorial text-[16px] leading-snug text-[#f4f2ef] truncate mt-0.5">
                {hoveredProduct.name[lang]}
              </div>
              <div className="mt-1 flex items-baseline justify-between gap-2">
                <span className="text-sm font-semibold text-[#d4b483] tabular-nums whitespace-nowrap">
                  {hoveredProduct.price.toLocaleString(lang === 'ar' ? 'ar-SA' : 'en-US')} {copy.sar}
                </span>
                <span className="text-[10px] text-[#f4f2ef]/55 tabular-nums whitespace-nowrap">
                  4× {hoveredInstallment}
                </span>
              </div>
              <div className="mt-1 inline-flex items-center gap-1 text-[10px] text-[#f4f2ef]/85">
                <span>{lang === 'ar' ? 'اضغط للمعاينة السريعة (Preview)' : 'Click for quick preview'}</span>
                <ArrowUpRight className="w-3 h-3 text-[#d4b483]" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Soft edge vignette */}
      <div className="vig" ref={vigRef} aria-hidden="true" />

      {/* 3D Sculpture Bottom HUD — Wrapper ALWAYS stays pointer-events-none so #stage stays 100% interactive */}
      <div ref={hudRef} className="fixed inset-0 z-20 pointer-events-none">
        <aside
          ref={hudControlsRef}
          className="fixed bottom-4 sm:bottom-7 start-4 sm:start-8 max-w-[min(420px,calc(100vw-32px))]"
        >
          <div className="mb-2 flex items-center gap-3">
            <img
              src={products[0]?.image}
              alt={copy.atelierCardTitle}
              decoding="async"
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded object-cover border border-[#f4f2ef]/20 shrink-0"
            />
            <div>
              <h2 className="font-editorial text-lg sm:text-xl leading-snug text-[#f4f2ef]">
                {copy.atelierCardTitle}
              </h2>
              <p className="text-[11px] text-[#d4b483] mt-0.5">{copy.saudiPaymentsShort}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-2.5">
            <button
              type="button"
              onClick={onOpenCatalog}
              className="min-h-[38px] px-3.5 py-1.5 text-xs font-medium bg-[#f4f2ef] text-black hover:bg-[#d4b483] rounded-md transition-colors inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>{copy.browseCatalog}</span>
            </button>

            <button
              type="button"
              onClick={onReplayIntro}
              className="min-h-[38px] px-3 py-1.5 text-xs font-medium text-[#f4f2ef]/85 hover:text-white bg-black/70 backdrop-blur-sm border border-[#f4f2ef]/25 hover:border-[#d4b483] rounded-md transition-colors inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Eye className="w-3.5 h-3.5 text-[#d4b483]" />
              <span>{copy.replayEye}</span>
            </button>

            <button
              type="button"
              onClick={() => setAutoSpin((v) => !v)}
              className={`min-h-[38px] px-3 py-1.5 text-xs font-medium rounded-md transition-colors inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap border ${
                autoSpin
                  ? 'bg-[#d4b483] text-black border-[#d4b483]'
                  : 'text-[#f4f2ef]/85 hover:text-white bg-black/70 backdrop-blur-sm border-[#f4f2ef]/25 hover:border-[#d4b483]'
              }`}
            >
              <Orbit className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'دوران 360°' : 'Auto 360°'}</span>
            </button>

            <button
              type="button"
              onClick={handleReset3DAngle}
              title={lang === 'ar' ? 'إعادة ضبط زاوية المجسّم' : 'Reset 3D angle'}
              className="min-h-[38px] px-3 py-1.5 text-xs font-medium text-[#f4f2ef]/80 hover:text-white bg-black/70 backdrop-blur-sm border border-[#f4f2ef]/25 hover:border-[#d4b483] rounded-md transition-colors inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#d4b483]" />
              <span>{lang === 'ar' ? 'ضبط الزاوية' : 'Reset'}</span>
            </button>
          </div>
        </aside>

        {/* Bottom-Center Interactive Scroll Down Cue */}
        <button
          ref={scrollDownBtnRef}
          type="button"
          onClick={onOpenCatalog}
          className="hidden md:flex fixed bottom-7 left-1/2 -translate-x-1/2 items-center gap-2.5 text-[11px] tracking-[0.04em] text-[#f4f2ef]/75 hover:text-[#d4b483] transition-colors cursor-pointer whitespace-nowrap"
        >
          <span className="cue-line relative block w-8 h-[1px] bg-[#f4f2ef]/25 overflow-hidden" />
          <span>
            {lang === 'ar'
              ? 'اسحب في كل الاتجاهات 360° · مرّر أو اضغط على أي نظارة للمعاينة'
              : 'Drag 360° in all directions · Hover or click any frame to preview'}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-[#d4b483]" />
        </button>

        {/* Bottom-End Colophon */}
        <div className="hidden lg:block fixed bottom-7 end-8 text-xs text-[#f4f2ef]/65 pointer-events-none">
          {copy.vatIncluded} · KSA
        </div>
      </div>
    </>
  );
}
