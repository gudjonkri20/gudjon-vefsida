import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useReducedMotion } from 'framer-motion';
import Band from './Band';
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

/** Matches Tailwind's `lg`, where the hero becomes two columns. */
const WIDE_QUERY = '(min-width: 1024px)';

const useWideLayout = (): boolean => {
  const [wide, setWide] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(WIDE_QUERY).matches,
  );

  useEffect(() => {
    const query = window.matchMedia(WIDE_QUERY);
    const update = () => setWide(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return wide;
};

const Hero: React.FC = () => {
  const { t } = useTranslation();
  const locale = useCurrentLocale();
  const reduce = useReducedMotion();
  const wide = useWideLayout();

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
    <Band as="section" className="bg-navy-900 text-white">
      <div className="mx-auto max-w-6xl px-5 pb-20 pt-20 sm:px-8 md:pb-24 md:pt-24 lg:pt-28">
        <motion.div initial="hidden" animate="show" variants={container}>
          {/*
            Two columns from `lg` up: the argument on the left, the mark on
            the right.

            The mark used to sit between the headline and the subline, in a
            200px slot. That cost three things. The sentence the page exists
            to say — what he builds, then what that means, then what to do
            about it — was cut in half by a picture. The signature element
            was the smallest thing in the band, while the right half of a
            1440px hero stayed empty. And on a phone the two buttons landed
            below the first screen.

            Now the left column reads straight through to the buttons, the
            mark has the same seat it has on every interior page (right of
            the title) at more than twice the size, and on a phone it follows
            the buttons instead of standing in front of them.
          */}
          <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-x-12">
            <div>
              <motion.p variants={item} className="eyebrow-on-navy">
                {t('hero.eyebrow')}
              </motion.p>

              <motion.h1
                variants={item}
                className="mt-6 max-w-4xl text-balance font-display text-[clamp(2.5rem,7vw,4.75rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-white"
              >
                {t('hero.headline')}
              </motion.h1>

              <motion.p
                variants={item}
                className="mt-7 max-w-prose font-serif text-lg leading-relaxed text-navy-100 sm:text-xl"
              >
                {t('hero.subline')}
              </motion.p>

              <motion.div variants={item} className="mt-9 flex flex-wrap gap-3">
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
            </div>

            {/*
              The signature, as a point cloud: his initials, then Iceland,
              then the speech waveform the mark has always been.

              The link radius is set per size. Too long and every point
              reaches most of the others, which filled the initials in to a
              solid knot; short enough that only neighbours along the stroke
              connect, and the letters, the coastline and the wave each hold
              their outline.

              On a phone the shapes are fitted to the canvas height and
              centred in its width, so the box is kept narrow and pulled left
              to put the mark on the same edge as the text above it.
            */}
            <motion.div variants={item} className="mt-12 flex justify-start lg:mt-0">
              <ConstellationCanvas
                shapes={HERO_SHAPES}
                ariaLabel="Guðjón Kristjánsson — a constellation cycling between his initials, the coastline of Iceland, and a speech waveform"
                pointCount={wide ? 260 : undefined}
                linkDistance={wide ? 34 : 24}
                className="-ml-12 h-[180px] w-[260px] cursor-crosshair sm:-ml-10 sm:h-[200px] lg:ml-0 lg:h-[340px] lg:w-[340px] xl:h-[440px] xl:w-[440px]"
              />
            </motion.div>
          </div>

          <motion.ul
            variants={item}
            className="rule-on-navy mt-12 flex flex-col gap-2 pt-6 font-mono text-xs text-navy-200 sm:flex-row sm:flex-wrap sm:gap-x-7 lg:mt-16"
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
    </Band>
  );
};

export default Hero;
