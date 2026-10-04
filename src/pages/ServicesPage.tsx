import React from 'react';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
import PageHeader from '../components/PageHeader';
import Section from '../components/Section';
import ServiceCard from '../components/ServiceCard';
import Reveal from '../components/Reveal';
import { services } from '../data/services';
import { useCurrentLocale, localizedHref } from '../lib/i18n';

const ServicesPage: React.FC = () => {
  const { t } = useTranslation();
  const locale = useCurrentLocale();

  return (
    <>
      <SEO title={t('services.title')} path={localizedHref('/services', locale)} />

      <PageHeader
        eyebrow={t('siteTagline')}
        title={t('services.title')}
        lede={t('services.subtitle')}
      />

      <Section tone="paper">
        <div className="grid gap-6 md:grid-cols-2">
          {services.map((service, i) => (
            <Reveal key={service.slug} delay={i * 0.08} className="h-full">
              <ServiceCard service={service} />
            </Reveal>
          ))}
        </div>
        <Reveal>
          <p className="mt-10 max-w-prose font-serif text-sm text-muted">
            {t('services.footnote')}
          </p>
        </Reveal>
      </Section>
    </>
  );
};

export default ServicesPage;
