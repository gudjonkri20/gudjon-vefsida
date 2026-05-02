import React from 'react';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
import Section from '../components/Section';
import ServiceCard from '../components/ServiceCard';
import { services } from '../data/services';
import { useCurrentLocale, localizedHref } from '../lib/i18n';

const ServicesPage: React.FC = () => {
  const { t } = useTranslation();
  const locale = useCurrentLocale();

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <SEO title={t('services.title')} path={localizedHref('/services', locale)} />

      <Section tone="dark" className="border-b border-slate-900">
        <div className="max-w-3xl pt-20">
          <p className="text-sm uppercase tracking-widest text-brand-400">
            {t('siteTagline')}
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-white md:text-5xl">
            {t('services.title')}
          </h1>
          <p className="mt-5 text-lg text-slate-300">{t('services.subtitle')}</p>
        </div>
      </Section>

      <Section tone="dark">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
        <p className="mt-10 text-center text-sm text-slate-500">
          {t('services.footnote')}
        </p>
      </Section>
    </div>
  );
};

export default ServicesPage;
