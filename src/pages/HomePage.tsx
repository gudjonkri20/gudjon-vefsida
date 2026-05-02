import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';
import Hero from '../components/Hero';
import Section from '../components/Section';
import ProjectCard from '../components/ProjectCard';
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

      <Section tone="dark" className="border-t border-slate-900">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-semibold text-white md:text-4xl">
              {t('home.featuredTitle')}
            </h2>
            <p className="mt-3 text-slate-400">{t('home.featuredSubtitle')}</p>
          </div>
          <Link
            to={localizedHref('/projects', locale)}
            className="inline-flex items-center gap-1 text-sm font-medium text-brand-300 transition hover:text-brand-200"
          >
            {t('home.viewAll')}
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {featured.map((project) => (
            <ProjectCard key={project.slug} project={project} compact />
          ))}
        </div>
      </Section>

      <Section tone="dark" className="border-t border-slate-900">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="font-display text-3xl font-semibold text-white md:text-4xl">
              {t('home.servicesTitle')}
            </h2>
            <p className="mt-3 text-slate-400">{t('home.servicesSubtitle')}</p>
            <Link
              to={localizedHref('/services', locale)}
              className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-brand-300 transition hover:text-brand-200"
            >
              {t('home.servicesCta')}
              <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-3 lg:col-span-7">
            {services.map((service, i) => (
              <Link
                key={service.slug}
                to={localizedHref('/services', locale)}
                className="group flex items-start justify-between gap-6 rounded-xl border border-slate-800 bg-slate-900/40 p-5 transition hover:border-brand-400/40 hover:bg-slate-900/70"
              >
                <div>
                  <div className="font-mono text-xs text-slate-500">
                    0{i + 1}
                  </div>
                  <div className="mt-1 font-display text-lg font-semibold text-white">
                    {service.title[locale]}
                  </div>
                  <div className="mt-1 text-sm text-slate-400">
                    {service.tagline[locale]}
                  </div>
                </div>
                <ArrowRight
                  size={18}
                  className="mt-2 flex-none text-slate-500 transition group-hover:translate-x-0.5 group-hover:text-brand-300"
                />
              </Link>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
};

export default HomePage;
