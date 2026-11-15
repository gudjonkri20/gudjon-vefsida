import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import type { ProjectSystem } from '../types';
import { useCurrentLocale } from '../lib/i18n';

/**
 * How a project fits together, drawn: what starts it, what sits at the
 * centre, and what the centre reaches out to.
 *
 * A paragraph says "a tool-using LLM with five tools"; this shows it, which
 * is the difference between being told someone builds systems and seeing
 * one. It draws itself once when it scrolls into view, then a few points of
 * light keep moving along the connections — the system at work, not a
 * spinner. With reduced motion it is simply there, still.
 *
 * Wide screens get the diagram; a phone gets the same thing as a vertical
 * tree, because five labels fanned out across 360px would not fit. Screen
 * readers get one plain sentence instead of either.
 *
 * Geometry is in a 720 × 420 box. The SVG draws the lines in that box and
 * the labels are HTML placed by percentage, so text wraps and scales like
 * text while staying on the ends of its lines.
 */

const W = 720;
const H = 420;
const INPUT = { x: 92, y: 210 };
const CORE = { x: 330, y: 210 };
const PART_X = 500;
const EASE = [0.22, 1, 0.36, 1] as const;

const pct = (v: number, of: number) => `${(v / of) * 100}%`;

/** Where each part sits, spread evenly down the right-hand side. */
const partY = (i: number, n: number) => (n === 1 ? H / 2 : 52 + (i * (H - 104)) / (n - 1));

/** A gentle S-curve from the right edge of the core to a part. */
const partPath = (y: number) =>
  `M ${CORE.x + 84} ${CORE.y} C ${CORE.x + 136} ${CORE.y}, ${PART_X - 52} ${y}, ${PART_X} ${y}`;

const INPUT_PATH = `M ${INPUT.x + 78} ${INPUT.y} L ${CORE.x - 84} ${CORE.y}`;

interface SystemDiagramProps {
  system: ProjectSystem;
}

const SystemDiagram: React.FC<SystemDiagramProps> = ({ system }) => {
  const { t } = useTranslation();
  const locale = useCurrentLocale();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.35 });
  const shown = reduce || seen;

  const parts = system.parts.map((p) => p[locale]);
  const n = parts.length;

  /** Fade-and-rise for a label, in order: input, core, then the parts. */
  const appear = (order: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 8 },
          animate: shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 },
          transition: { duration: 0.5, ease: EASE, delay: order * 0.08 },
        };

  /** A line that draws itself from its start. */
  const draw = (order: number) =>
    reduce
      ? {}
      : {
          initial: { pathLength: 0 },
          animate: { pathLength: shown ? 1 : 0 },
          transition: { duration: 0.7, ease: EASE, delay: 0.1 + order * 0.08 },
        };

  const sentence = t('projectDetail.systemSentence', {
    input: system.input[locale],
    core: system.core[locale],
    parts: parts.join(', '),
  });

  return (
    <section ref={ref} className="mt-14 max-w-3xl border-t border-navy-100 pt-8">
      <h2 className="eyebrow">{t('projectDetail.system')}</h2>
      <p className="sr-only">{sentence}</p>

      {/* ---- Wide: the diagram ---- */}
      <div
        aria-hidden="true"
        className="relative mt-6 hidden sm:block"
        style={{ aspectRatio: `${W} / ${H}` }}
      >
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="absolute inset-0 h-full w-full overflow-visible"
          fill="none"
        >
          {/* Solid, like the others: the draw-on animation is itself a dash
              pattern, so a dashed line here would not draw at all. */}
          <motion.path
            d={INPUT_PATH}
            stroke="rgb(var(--rule-strong))"
            strokeWidth={1.5}
            {...draw(0)}
          />
          {parts.map((_, i) => (
            <motion.path
              key={i}
              d={partPath(partY(i, n))}
              stroke="rgb(var(--rule-strong))"
              strokeWidth={1.5}
              {...draw(2 + i)}
            />
          ))}

          {/* Points of light travelling the connections: a request coming
              in, then the core reaching out to each part in turn. Only once
              the drawing has finished, and never with reduced motion. */}
          {shown && !reduce && (
            <g fill="#CCA35C">
              <circle r={3.2}>
                <animateMotion dur="2.8s" begin="1.2s" repeatCount="indefinite" path={INPUT_PATH} />
              </circle>
              {parts.map((_, i) => (
                <circle key={i} r={2.8} opacity={0.9}>
                  <animateMotion
                    dur="2.8s"
                    begin={`${1.6 + i * 0.45}s`}
                    repeatCount="indefinite"
                    keyPoints="0;1"
                    keyTimes="0;1"
                    calcMode="spline"
                    keySplines="0.4 0 0.2 1"
                    path={partPath(partY(i, n))}
                  />
                </circle>
              ))}
            </g>
          )}
        </svg>

        {/*
          Each label: an outer box that puts its centre (or, for the parts,
          its left middle) on the end of its line, and an inner box that
          animates. They have to be two elements — the animation writes its
          own transform, which would wipe out the centring one.
        */}

        {/* Input */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: pct(INPUT.x, W), top: pct(INPUT.y, H), width: pct(156, W) }}
        >
          <motion.div
            className="rounded-md border border-dashed border-navy-200 bg-paper px-3 py-2 text-center text-[0.8125rem] leading-snug text-navy-900"
            {...appear(0)}
          >
            {system.input[locale]}
          </motion.div>
        </div>

        {/* Core */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: pct(CORE.x, W), top: pct(CORE.y, H), width: pct(168, W) }}
        >
          <motion.div
            className="rounded-lg bg-navy-900 px-4 py-4 text-center shadow-card-hover dark:ring-1 dark:ring-white/10"
            {...appear(1)}
          >
            <div className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-brass-400">
              {t('projectDetail.systemCore')}
            </div>
            <div className="mt-1 font-display text-[0.9375rem] font-semibold leading-tight text-white">
              {system.core[locale]}
            </div>
          </motion.div>
        </div>

        {/* Parts */}
        {parts.map((label, i) => (
          <div
            key={label}
            className="absolute -translate-y-1/2"
            style={{ left: pct(PART_X, W), top: pct(partY(i, n), H), width: pct(W - PART_X, W) }}
          >
            <motion.div
              className="flex items-center gap-2.5 rounded-md border border-navy-100 bg-paper-raised px-3 py-2 text-[0.8125rem] leading-snug text-navy-900 shadow-card"
              {...appear(2 + i)}
            >
              <span className="h-1.5 w-1.5 flex-none rounded-full bg-brass-500" />
              {label}
            </motion.div>
          </div>
        ))}
      </div>

      {/* ---- Narrow: the same thing as a tree ---- */}
      <div aria-hidden="true" className="mt-6 sm:hidden">
        <motion.div
          className="w-fit rounded-md border border-dashed border-navy-200 bg-paper px-3 py-2 text-[0.8125rem] text-navy-900"
          {...appear(0)}
        >
          {system.input[locale]}
        </motion.div>
        <div className="ml-6 h-5 border-l border-dashed border-navy-200" />
        <motion.div
          className="w-fit rounded-lg bg-navy-900 px-4 py-3 shadow-card-hover dark:ring-1 dark:ring-white/10"
          {...appear(1)}
        >
          <div className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-brass-400">
            {t('projectDetail.systemCore')}
          </div>
          <div className="mt-0.5 font-display text-[0.9375rem] font-semibold text-white">
            {system.core[locale]}
          </div>
        </motion.div>
        <ul className="ml-6 border-l border-navy-200 pt-2">
          {parts.map((label, i) => (
            <motion.li
              key={label}
              className="relative pb-2 pl-6 before:absolute before:left-0 before:top-1/2 before:h-px before:w-4 before:bg-navy-200 before:content-[''] last:pb-0"
              {...appear(2 + i)}
            >
              <div className="flex items-center gap-2.5 rounded-md border border-navy-100 bg-paper-raised px-3 py-2 text-[0.8125rem] text-navy-900 shadow-card">
                <span className="h-1.5 w-1.5 flex-none rounded-full bg-brass-500" />
                {label}
              </div>
            </motion.li>
          ))}
        </ul>
      </div>

      {system.notes && system.notes.length > 0 && (
        <ul className="mt-6 flex flex-wrap gap-2">
          {system.notes.map((note) => (
            <li
              key={note.en}
              className="rounded border border-navy-100 bg-paper px-2 py-1 font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-muted"
            >
              {note[locale]}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default SystemDiagram;
