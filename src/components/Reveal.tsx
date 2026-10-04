import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * Fades and lifts its children the first time they scroll into view.
 *
 * The timing deliberately matches Hero: same easing curve, same 0.55s, same
 * 16px rise. The hero animates on mount and everything below animates on
 * entry, but they should read as one gesture repeated, not two systems.
 *
 * `amount: 'some'` matters. A ratio-based threshold is unreachable for any
 * element taller than the viewport — a long article would never cross it and
 * would stay invisible permanently.
 */

const EASE = [0.22, 1, 0.36, 1] as const;
const DURATION = 0.55;
const RISE = 16;

interface RevealProps {
  children: React.ReactNode;
  /** Seconds. Use index * 0.08 to stagger a list. */
  delay?: number;
  className?: string;
}

const Reveal: React.FC<RevealProps> = ({ children, delay = 0, className }) => {
  const reduce = useReducedMotion();

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: RISE }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 'some', margin: '0px 0px -80px 0px' }}
      transition={{ duration: DURATION, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
};

export default Reveal;
