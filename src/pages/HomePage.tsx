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
import { getFeaturedProjects } from '../lib/projects';
import { services } from '../data/services';
import { useCurrentLocale, localizedHref } from '../lib/i18n';

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const locale = useCurrentLocale();
  const featured = getFeaturedProjects();

  return (
    <>
      <SEO path={localizedHref('/', locale)} />
      <Hero />

      <Section tone="paper" className="relative overflow-hidden">
        <ConstellationWatermark startAt={0} side="right" />
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
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-brass-700 transition-colors hover:text-navy-900"
          >
            {t('home.viewAll')}
            <ArrowRight
              size={14}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </Reveal>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {featured.map((project, i) => (
            <Reveal key={project.slug} delay={i * 0.08} className="h-full">
              <ProjectCard project={project} compact />
            </Reveal>
          ))}
        </div>
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
              className="group mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-brass-700 transition-colors hover:text-navy-900"
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
                  className="group flex items-start justify-between gap-6 rounded-lg border border-navy-100 bg-paper p-5 transition-colors hover:border-brass-500/50"
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
                    className="mt-1 flex-none text-navy-200 transition-all group-hover:translate-x-0.5 group-hover:text-brass-600"
                  />
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
};

export default HomePage;
