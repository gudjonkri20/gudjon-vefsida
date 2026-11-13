import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';
import Hero from '../components/Hero';
import Section from '../components/Section';
import ProjectCard from '../components/ProjectCard';
import Reveal from '../components/Reveal';
import ConstellationWatermark from '../components/ConstellationWatermark';
import WorkShowcase from '../components/WorkShowcase';
import ContactBand from '../components/ContactBand';
import { useMediaQuery, WIDE } from '../lib/useMediaQuery';
import { getAllProjects, getFeaturedProjects } from '../lib/projects';
import { services } from '../data/services';
import { useCurrentLocale, localizedHref } from '../lib/i18n';

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const locale = useCurrentLocale();
  const featured = getFeaturedProjects();
  const total = getAllProjects().length;
  const wide = useMediaQuery(WIDE);

  return (
    <>
      <SEO path={localizedHref('/', locale)} />
      <Hero />

      {/* overflow-x-clip, not overflow-hidden: `hidden` would make this
          section a scroll container and the showcase's pinned panel would
          have nothing to stick against. `clip` cuts the same overflow
          without that side effect. */}
      <Section tone="paper" className="relative overflow-x-clip">
        <Reveal className="flex flex-wrap items-end justify-between gap-4 border-b border-navy-100 pb-6">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-semibold tracking-[-0.02em] md:text-4xl">
              {t('home.featuredTitle')}
            </h2>
            <p className="mt-3 font-serif text-[1.0625rem] leading-relaxed text-muted">
              {t('home.featuredSubtitle')}
            </p>
          </div>
          <Link
            to={localizedHref('/projects', locale)}
            // From sm up only. On a phone the tile that closes the row below
            // is the way on, in the place a reader actually ends up.
            className="hit group hidden items-center gap-1.5 text-sm font-medium text-brass-700 transition-colors hover:text-navy-900 sm:inline-flex"
          >
            {t('home.viewAll')}
            <ArrowRight
              size={14}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </Reveal>

        {/*
          One list, two presentations.

          With room for two columns it is a sequence: one project in focus at
          a time beside a pinned panel (see WorkShowcase).

          Without, it is a row you swipe. Five compact cards stacked ran to
          about 1,500px of scrolling past things that all look alike; a row
          puts each one a thumb-flick away with the next always peeking in at
          the edge. It is the browser's own scrolling with snap points, so the
          momentum, the rubber-band at the ends and the 1:1 tracking are the
          device's, not an imitation.

          The row rises in once (Reveal wraps the container). Cards further
          along must not wait to fade in as they are swiped on screen, which
          is what a per-card reveal would do here.
        */}
        {wide ? (
          <WorkShowcase projects={featured} total={total} />
        ) : (
        <Reveal>
          <div className="-mx-5 mt-10 flex snap-x snap-mandatory scroll-pl-5 gap-4 overflow-x-auto overscroll-x-contain px-5 pb-4 [scrollbar-width:none] sm:-mx-8 sm:scroll-pl-8 sm:px-8 [&::-webkit-scrollbar]:hidden [&>*]:w-[84%] [&>*]:flex-none [&>*]:snap-start sm:[&>*]:w-[46%]">
          {featured.map((project) => (
            <div key={project.slug} className="h-full">
              <ProjectCard project={project} compact />
            </div>
          ))}

          {/*
            The last stop in the row: the way on, where a reader ends up.
            Dashed, so it reads as "the rest" rather than as a sixth project,
            and counted the same way the projects page counts ("5 / 14"), so
            it says how much more there is.
          */}
          {featured.length < total && (
            <div className="h-full">
              <Link
                to={localizedHref('/projects', locale)}
                className="group flex h-full min-h-[11rem] flex-col justify-between rounded-lg border border-dashed border-navy-200 p-6 transition-colors duration-100 hover:border-brass-500/70 hover:bg-paper-raised active:border-brass-500/70 active:bg-paper-sunken"
              >
                <span className="font-mono text-xs text-muted">
                  {featured.length} / {total}
                </span>
                <span className="mt-8 inline-flex items-center gap-2 font-display text-lg font-semibold tracking-[-0.01em] text-navy-900">
                  {t('home.viewAll')}
                  <ArrowRight
                    size={18}
                    className="text-brass-600 transition-transform group-hover:translate-x-0.5"
                  />
                </span>
              </Link>
            </div>
          )}
          </div>
        </Reveal>
        )}
      </Section>

      <Section
        tone="raised"
        className="relative overflow-hidden border-t border-navy-100"
      >
        <ConstellationWatermark startAt={2} side="left" />
        <div className="grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <h2 className="font-display text-3xl font-semibold tracking-[-0.02em] md:text-4xl">
              {t('home.servicesTitle')}
            </h2>
            <p className="mt-3 font-serif text-[1.0625rem] leading-relaxed text-muted">
              {t('home.servicesSubtitle')}
            </p>
            <Link
              to={localizedHref('/services', locale)}
              className="hit group mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-brass-700 transition-colors hover:text-navy-900"
            >
              {t('home.servicesCta')}
              <ArrowRight
                size={14}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </Reveal>

          {/* Two parallel offerings, not a sequence — so no 01 / 02 numbering. */}
          <div className="space-y-3 lg:col-span-7">
            {services.map((service, i) => (
              <Reveal key={service.slug} delay={i * 0.08}>
                <Link
                  to={localizedHref('/services', locale)}
                  // A row this wide answers a press with colour, not scale:
                  // 3% of 600px is too much travel for a tap.
                  className="group flex items-start justify-between gap-6 rounded-lg border border-navy-100 bg-paper p-5 transition-colors duration-100 hover:border-brass-500/50 active:border-brass-500/50 active:bg-paper-sunken"
                >
                  <div className="min-w-0">
                    <div className="font-display text-lg font-semibold text-navy-900">
                      {service.title[locale]}
                    </div>
                    <div className="mt-1 font-serif text-[0.9375rem] leading-relaxed text-muted">
                      {service.tagline[locale]}
                    </div>
                    <div className="eyebrow mt-3">{service.format[locale]}</div>
                  </div>
                  <ArrowRight
                    size={18}
                    className="mt-1 flex-none text-navy-200 transition-all group-hover:translate-x-0.5 group-hover:text-brass-600 dark:text-white/25"
                  />
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* The page used to stop at the footer. It now ends on the signature
          and the ways to reach him — the thing the whole page is for. */}
      <ContactBand />
    </>
  );
};

export default HomePage;
