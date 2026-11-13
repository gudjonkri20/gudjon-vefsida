import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useReducedMotion } from 'framer-motion';
import CallToAction from './CallToAction';
import ConstellationCanvas from './ConstellationCanvas';
import { HERO_SHAPES } from '../lib/constellationShapes';
import { useCurrentLocale, localizedHref } from '../lib/i18n';

// Real counts, kept as one mono line rather than three oversized stat tiles.
const INDEX = [
  { value: 14, key: 'production' },
  { value: 4, key: 'mcp' },
  { value: 3, key: 'chatbots' },
] as const;

const Hero: React.FC = () => {
  const { t } = useTranslation();
  const locale = useCurrentLocale();
  const reduce = useReducedMotion();

  const item = reduce
    ? { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } }
    : {
        hidden: { opacity: 0, y: 16 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
        },
      };

  const container = reduce
    ? { hidden: {}, show: {} }
    : {
        hidden: { opacity: 1 },
        show: { opacity: 1, transition: { staggerChildren: 0.09 } },
      };

  return (
    <section className="relative bg-navy-900 text-white">
      <div className="mx-auto max-w-6xl px-5 pb-20 pt-24 sm:px-8 md:pb-28 md:pt-32">
        <motion.div initial="hidden" animate="show" variants={container}>
          <motion.p variants={item} className="eyebrow-on-navy">
            {t('hero.eyebrow')}
          </motion.p>

          <motion.h1
            variants={item}
            className="mt-6 max-w-4xl text-balance font-display text-[clamp(2.5rem,7vw,4.75rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-white"
          >
            {t('hero.headline')}
          </motion.h1>

          {/*
            The signature, now as a point cloud: his initials, then Iceland,
            then the speech waveform the mark has always been. One mark rather
            than two competing in the same view — the waveform is not lost, it
            is the resting state.
          */}
          {/*
            Kept short and wide. A tall square canvas left a hole of empty
            navy between the headline and the subline and pushed the call to
            action below the fold; the mark it replaced was a thin rule.
          */}
          {/*
            Two things make the mark read as what it is:

            linkDistance 24. At the default 52 every point in a 200px-tall
            canvas reaches most of the others, so the initials filled in to a
            solid knot. At 24 only neighbours along the stroke connect and the
            letters, the coastline and the wave each hold their outline.

            A 260px box pulled left. The shapes are fitted to the canvas
            height and centred in its width, so in the old 440px box the mark
            floated ~130px to the right of the left edge that the eyebrow,
            headline, subline and buttons all share. The narrower box and the
            negative margin put its left edge on that same line.
          */}
          <motion.div variants={item} className="mt-6 flex justify-start">
            <ConstellationCanvas
              shapes={HERO_SHAPES}
              ariaLabel="Guðjón Kristjánsson — a constellation cycling between his initials, the coastline of Iceland, and a speech waveform"
              linkDistance={24}
              className="-ml-12 h-[180px] w-[260px] cursor-crosshair sm:-ml-10 sm:h-[200px]"
            />
          </motion.div>

          <motion.p
            variants={item}
            className="mt-10 max-w-prose font-serif text-lg leading-relaxed text-navy-100 sm:text-xl"
          >
            {t('hero.subline')}
          </motion.p>

          <motion.div variants={item} className="mt-10 flex flex-wrap gap-3">
            <CallToAction
              to={localizedHref('/projects', locale)}
              variant="primary"
              onNavy
              withArrow
            >
              {t('hero.ctaPrimary')}
            </CallToAction>
            <CallToAction
              to={localizedHref('/contact', locale)}
              variant="secondary"
              onNavy
            >
              {t('hero.ctaSecondary')}
            </CallToAction>
          </motion.div>

          <motion.ul
            variants={item}
            className="rule-on-navy mt-14 flex flex-col gap-2 pt-6 font-mono text-xs text-navy-200 sm:flex-row sm:flex-wrap sm:gap-x-7"
          >
            {INDEX.map(({ value, key }) => (
              <li key={key}>
                <span className="text-brass-400">{value}</span>{' '}
                {t(`hero.stats.${key}`)}
              </li>
            ))}
          </motion.ul>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
