import React, { useMemo } from 'react';
import clsx from 'clsx';

/**
 * The site's signature mark: a speech waveform.
 *
 * Guðjón works on Icelandic speech recognition — his MSc thesis measured age
 * and gender bias in Icelandic ASR systems — so the one decorative element on
 * the site is the thing he actually studies.
 *
 * The envelope is not noise. It has five bursts, one per syllable of
 * "Guð-jón Krist-jáns-son", weighted for Icelandic first-syllable stress.
 * Generated from a fixed seed so it is identical on every render and every
 * page: this is a signature, not an animation loop.
 */

const VIEW_W = 1000;
const VIEW_H = 100;
const BASELINE = VIEW_H / 2;
const SAMPLES = 420;

// Syllable centres (0–1 across the width) and relative stress.
const SYLLABLES: Array<{ at: number; stress: number }> = [
  { at: 0.09, stress: 1.0 }, // Guð  — primary stress
  { at: 0.25, stress: 0.72 }, // jón
  { at: 0.5, stress: 0.95 }, // Krist — secondary stress
  { at: 0.68, stress: 0.66 }, // jáns
  { at: 0.85, stress: 0.44 }, // son  — trails off
];

const SIGMA = 0.032;

/** Deterministic pseudo-noise in [-1, 1]. Same input, same output, forever. */
const noise = (i: number): number => {
  const s = Math.sin(i * 12.9898) * 43758.5453;
  return (s - Math.floor(s)) * 2 - 1;
};

const buildPath = (amplitude: number): string => {
  const points: string[] = [];

  for (let i = 0; i < SAMPLES; i += 1) {
    const t = i / (SAMPLES - 1);

    // Syllable envelope: overlapping Gaussian bursts.
    let envelope = 0;
    for (const { at, stress } of SYLLABLES) {
      const d = t - at;
      envelope += stress * Math.exp(-(d * d) / (2 * SIGMA * SIGMA));
    }

    // Carrier: layered pseudo-noise at low frequency, so each burst reads as
    // a syllable with real silence around it rather than a flat noise band.
    const carrier =
      noise(i * 0.5) * 0.55 + noise(i * 0.17) * 0.32 + noise(i * 1.3) * 0.13;

    const y = BASELINE - carrier * envelope * amplitude;
    points.push(`${((t * VIEW_W).toFixed(2))},${y.toFixed(2)}`);
  }

  return `M ${points.join(' L ')}`;
};

interface WaveformProps {
  /** 'mark' anchors the hero. 'rule' replaces a hairline divider. */
  variant?: 'mark' | 'rule';
  /** Draw the trace on mount. Only ever used once per page, in the hero. */
  animate?: boolean;
  className?: string;
}

const Waveform: React.FC<WaveformProps> = ({
  variant = 'rule',
  animate = false,
  className,
}) => {
  const amplitude = variant === 'mark' ? 34 : 11;
  const path = useMemo(() => buildPath(amplitude), [amplitude]);

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      className={clsx(
        'w-full',
        variant === 'mark' ? 'h-16 sm:h-20' : 'h-5',
        className,
      )}
    >
      <path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth={variant === 'mark' ? 1.6 : 1.1}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        // pathLength normalises the geometry to 1 unit, so the dash used for
        // the draw-on animation works whatever the real path length is. With a
        // hardcoded dash the tail of the wave renders as a permanent gap.
        pathLength={1}
        className={clsx(animate && 'animate-trace')}
        style={animate ? { strokeDasharray: 1 } : undefined}
      />
    </svg>
  );
};

export default Waveform;
