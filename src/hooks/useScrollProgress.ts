import { useEffect, useRef, useState } from 'react';

/**
 * Tracks how far the page has scrolled through a referenced element, as 0 to 1.
 *
 * Progress is measured against the element's own scrollable extent — its
 * height minus one viewport — so a section pinned with `position: sticky`
 * completes its animation exactly as the section finishes passing. `span`
 * stretches or compresses that range if the motion needs to finish early.
 *
 * Scroll is sampled inside rAF: the listener only raises a flag, so a burst of
 * scroll events still costs at most one layout read per frame.
 */
export function useScrollProgress<T extends HTMLElement>(span = 1) {
  const ref = useRef<T>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let queued = false;

    const measure = () => {
      raf = 0;
      queued = false;
      const rect = el.getBoundingClientRect();
      const distance = Math.max(1, (rect.height - window.innerHeight) * span);
      const travelled = -rect.top;
      const next = Math.min(1, Math.max(0, travelled / distance));
      setProgress((prev) => (Math.abs(prev - next) < 0.001 ? prev : next));
    };

    const request = () => {
      if (queued) return;
      queued = true;
      raf = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', request);
    };
  }, [span]);

  return { ref, progress };
}
