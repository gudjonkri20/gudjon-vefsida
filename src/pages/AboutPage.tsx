import React from 'react';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
import AboutSection from '../components/AboutSection';
import { useCurrentLocale, localizedHref } from '../lib/i18n';

const AboutPage: React.FC = () => {
  const { t } = useTranslation();
  const locale = useCurrentLocale();
  return (
    <>
      <SEO title={t('about.title')} path={localizedHref('/about', locale)} />
      <AboutSection />
    </>
  );
};

export default AboutPage;
