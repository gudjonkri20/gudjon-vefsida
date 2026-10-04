import React from 'react';
import ConstellationCanvas from './ConstellationCanvas';
import type { ShapePainter } from '../lib/constellationShapes';

interface Props {
  shapes?: ShapePainter[];
  startAt?: number;
  /** Horizontal anchor. Defaults to the right edge. */
  side?: 'left' | 'right';
  className?: string;
}

/**
 * A large, very faint constellation sitting behind a section's content.
 *
 * Decorative only: aria-hidden, pointer-events-none, and clipped by the
 * parent's overflow so it never adds scroll. Deliberately quiet — loud
 * enough to notice on a second look, never enough to fight the text on
 * top of it.
 *
 * The parent needs `relative` and `overflow-hidden`.
 */
const ConstellationWatermark: React.FC<Props> = ({
  shapes,
  startAt = 0,
  side = 'right',
  className = '',
}) => (
  <div
    aria-hidden="true"
    className={`pointer-events-none absolute top-1/2 hidden -translate-y-1/2 opacity-[0.16] lg:block ${
      side === 'right' ? '-right-16' : '-left-16'
    } ${className}`}
  >
    <ConstellationCanvas
      shapes={shapes}
      startAt={startAt}
      className="h-[520px] w-[520px] xl:h-[620px] xl:w-[620px]"
    />
  </div>
);

export default ConstellationWatermark;
