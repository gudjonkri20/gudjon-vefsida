import React, { useEffect, useRef, useState } from 'react';

interface Props {
  children: React.ReactNode;
  /** Stagger in ms, for revealing a list one item after another. */
  delay?: number;
  className?: string;
}

/**
 * Fades and lifts its children in the first time they enter the viewport.
 *
 * The observer disconnects after the first intersection — this is an entrance
 * flourish, not a scroll-linked effect, and re-animating on every pass up and
 * down the page is what makes scroll reveals feel cheap.
 *
 * Honours prefers-reduced-motion by rendering visible from the start.
 */
const Reveal: React.FC<Props> = ({ children, delay = 0, className = '' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShown(true);
        io.disconnect();
      },
      // threshold stays 0: a ratio-based threshold is unreachable for an
      // element taller than the viewport (a long article can never be 15%
      // visible), which would leave it stuck at opacity 0 forever. The
      // negative bottom margin is what delays the trigger instead.
      { threshold: 0, rootMargin: '0px 0px -60px 0px' },
    );
    io.observe(el);

    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out motion-reduce:transition-none ${
        shown ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default Reveal;
