import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useReducedMotion } from 'framer-motion';
import CallToAction from './CallToAction';
import Waveform from './Waveform';
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

          {/* The signature: five syllables of his name, drawn once. */}
          <motion.div
            variants={item}
            className="mt-10 max-w-3xl text-brass-500"
            role="img"
            aria-label="Guðjón Kristjánsson"
          >
            <Waveform variant="mark" animate={!reduce} />
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
