import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (!mq.matches) return;

    const dot = dotRef.current;
    if (!dot) return;

    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let x = tx;
    let y = ty;
    let visible = false;
    let rafId = 0;

    const tick = () => {
      x += (tx - x) * 0.24;
      y += (ty - y) * 0.24;
      dot.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;

      // Stop animation loop automatically once settled — zero idle CPU cost
      if (Math.abs(tx - x) > 0.2 || Math.abs(ty - y) > 0.2) {
        rafId = window.requestAnimationFrame(tick);
      } else {
        x = tx;
        y = ty;
        dot.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
        rafId = 0;
      }
    };

    const ensureRunning = () => {
      if (!rafId) {
        rafId = window.requestAnimationFrame(tick);
      }
    };

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!visible) {
        visible = true;
        x = tx;
        y = ty;
        dot.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
        dot.classList.add('visible');
      }
      const target = e.target as HTMLElement | null;
      const interactive = target?.closest('a, button, .sphere-card, [data-cursor="wide"]');
      dot.classList.toggle('wide', Boolean(interactive));
      ensureRunning();
    };

    const onLeave = () => {
      visible = false;
      dot.classList.remove('visible', 'wide');
      if (rafId) {
        window.cancelAnimationFrame(rafId);
        rafId = 0;
      }
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  return <div id="dot" ref={dotRef} aria-hidden="true" />;
}
