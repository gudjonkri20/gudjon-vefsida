import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useReducedMotion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import CallToAction from './CallToAction';
import { useCurrentLocale } from '../lib/i18n';
import { localizedHref } from '../lib/i18n';

const STATS = [
  { value: '14+', key: 'production' },
  { value: '4', key: 'mcp' },
  { value: '3', key: 'chatbots' },
] as const;

const Hero: React.FC = () => {
  const { t } = useTranslation();
  const locale = useCurrentLocale();
  const reduce = useReducedMotion();

  const itemVariants = reduce
    ? { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } }
    : {
        hidden: { opacity: 0, y: 18 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
      };

  const containerVariants = reduce
    ? { hidden: {}, show: {} }
    : {
        hidden: { opacity: 1 },
        show: {
          opacity: 1,
          transition: { staggerChildren: 0.08, delayChildren: 0.05 },
        },
      };

  return (
    <section className="relative isolate overflow-hidden bg-slate-950 text-white">
      <div
        aria-hidden
        className="absolute inset-0 bg-hero-grid [background-size:32px_32px] opacity-50"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[680px] bg-brand-glow"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-24 h-[480px] w-[480px] rounded-full bg-accent-500/20 blur-3xl"
      />

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl flex-col justify-center px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <motion.div
          initial="hidden"
          animate="show"
          variants={containerVariants}
          className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12"
        >
          <div className="lg:col-span-7">
            <motion.div
              variants={itemVariants}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-700/60 bg-slate-900/60 px-3 py-1 text-xs font-medium text-slate-300"
            >
              <Sparkles size={14} className="text-brand-400" />
              {t('hero.eyebrow')}
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-balance font-display text-4xl font-semibold tracking-tight md:text-6xl lg:text-7xl"
            >
              <span className="bg-gradient-to-br from-white via-slate-200 to-brand-300 bg-clip-text text-transparent">
                {t('hero.headline')}
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mt-6 max-w-2xl text-pretty text-lg text-slate-300 md:text-xl"
            >
              {t('hero.subline')}
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="mt-8 flex flex-wrap gap-3"
            >
              <CallToAction
                to={localizedHref('/projects', locale)}
                variant="primary"
                withArrow
              >
                {t('hero.ctaPrimary')}
              </CallToAction>
              <CallToAction
                to={localizedHref('/services', locale)}
                variant="secondary"
              >
                {t('hero.ctaSecondary')}
              </CallToAction>
            </motion.div>

            <motion.dl
              variants={itemVariants}
              className="mt-14 grid grid-cols-3 gap-4 border-t border-slate-800 pt-8 lg:max-w-xl"
            >
              {STATS.map((stat) => (
                <div key={stat.key}>
                  <dt className="text-xs uppercase tracking-wider text-slate-500">
                    {t(`hero.stats.${stat.key}`)}
                  </dt>
                  <dd className="mt-1 font-display text-3xl font-semibold text-white md:text-4xl">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </motion.dl>
          </div>

          <motion.div
            variants={itemVariants}
            className="hidden lg:col-span-5 lg:flex lg:justify-center"
          >
            <div className="relative">
              <div className="absolute -inset-6 rounded-full bg-gradient-to-br from-brand-400/40 via-accent-500/20 to-transparent blur-3xl" />
              <div className="relative h-72 w-72 overflow-hidden rounded-full border border-slate-700 shadow-glow">
                <img
                  src="https://github.com/gudjonkri20.png?size=600"
                  alt="Guðjón Kristjánsson"
                  className="h-full w-full object-cover"
                  loading="eager"
                />
              </div>
              <div
                aria-hidden
                className="absolute -bottom-4 -right-4 h-20 w-20 rounded-full border border-brand-400/40 bg-slate-950/80 backdrop-blur"
              />
              <div
                aria-hidden
                className="absolute -top-3 -left-3 h-12 w-12 rounded-full border border-accent-400/40 bg-slate-950/80 backdrop-blur"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
