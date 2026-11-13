import React, { useCallback, useEffect, useRef } from 'react';
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import clsx from 'clsx';

/**
 * A navy band that the rest of the page slides over.
 *
 * The site alternates navy bands and paper. Scrolled normally, each band
 * leaves as a hard horizontal edge travelling up the screen: two flat blocks
 * passing each other. Here the band pins under the masthead and stays put
 * while the paper that follows rides up over it, and the band's content
 * settles back as it is covered — a little smaller, a little dimmer, drifting
 * up at a fraction of the scroll speed. It reads as one layer sliding over
 * another, which is what the navy / paper rhythm always implied.
 *
 * Nothing here runs on a timer. Every value is a function of how far the
 * next section has covered the band, so the motion is exactly as fast as the
 * scroll, stops when the scroll stops, and reverses when it reverses.
 *
 * The pinning itself is CSS (`.band` in index.css): `position: sticky`, with
 * a `top` that lets a band taller than the screen scroll to its end before it
 * pins, so nothing in it is ever covered unseen.
 */

/** The sticky masthead the band pins beneath: h-16 plus its 1px rule. */
const MASTHEAD = 65;

interface BandProps {
  as?: 'section' | 'header';
  className?: string;
  children: React.ReactNode;
}

const Band: React.FC<BandProps> = ({ as: Tag = 'section', className, children }) => {
  const ref = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const hidden = useRef(false);
  const reduce = useReducedMotion();

  /** 0 = untouched, 1 = the next section has reached the masthead. */
  const covered = useMotionValue(0);
  const { scrollY } = useScroll();

  const scale = useTransform(covered, [0, 1], [1, 0.95]);
  const opacity = useTransform(covered, [0, 1], [1, 0.3]);
  const y = useTransform(covered, [0, 1], [0, -36]);

  const measure = useCallback(() => {
    const band = ref.current;
    const next = band?.nextElementSibling;
    if (!band || !next) return;

    // While the band is pinned its box holds still and the next section's
    // top edge climbs up it. Until then the two edges coincide and this is 0.
    const box = band.getBoundingClientRect();
    const overlap = box.bottom - next.getBoundingClientRect().top;
    const span = box.bottom - MASTHEAD;
    const progress = span > 0 ? Math.min(1, Math.max(0, overlap / span)) : 0;
    covered.set(progress);

    // Fully covered: stop painting it, take its links out of the tab order,
    // and tell any canvas inside to stop drawing frames nobody can see. A
    // pinned element never stops "intersecting" the viewport, so the canvas
    // cannot work this out for itself.
    const nowHidden = progress >= 1;
    if (nowHidden !== hidden.current) {
      hidden.current = nowHidden;
      if (contentRef.current) {
        contentRef.current.style.visibility = nowHidden ? 'hidden' : '';
      }
      band.dispatchEvent(new CustomEvent<boolean>('bandcover', { detail: nowHidden }));
    }
  }, [covered]);

  useMotionValueEvent(scrollY, 'change', measure);

  useEffect(() => {
    const band = ref.current;
    if (!band || reduce) return;

    // The CSS needs the band's height to know where to pin it.
    const sync = () => {
      band.style.setProperty('--band-h', `${band.offsetHeight}px`);
      measure();
    };
    sync();

    const observer = new ResizeObserver(sync);
    observer.observe(band);
    window.addEventListener('resize', sync);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', sync);
    };
  }, [measure, reduce]);

  // Reduced motion: an ordinary band that scrolls away like any other block.
  if (reduce) {
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <Tag ref={ref} data-band className={clsx('band', className)}>
      <motion.div
        ref={contentRef}
        style={{ scale, opacity, y, transformOrigin: '50% 0%' }}
      >
        {children}
      </motion.div>
    </Tag>
  );
};

export default Band;
