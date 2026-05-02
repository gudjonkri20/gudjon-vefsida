import React from 'react';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
import CallToAction from '../components/CallToAction';
import { useCurrentLocale, localizedHref } from '../lib/i18n';

const NotFoundPage: React.FC = () => {
  const { t } = useTranslation();
  const locale = useCurrentLocale();

  return (
    <div className="grid min-h-[calc(100vh-8rem)] place-items-center bg-slate-950 px-6 py-20 text-center text-white">
      <SEO title="404" path="/404" />
      <div>
        <p className="font-mono text-sm uppercase tracking-widest text-brand-400">
          {t('notFound.title')}
        </p>
        <h1 className="mt-4 font-display text-5xl font-semibold tracking-tight md:text-6xl">
          {t('notFound.subtitle')}
        </h1>
        <div className="mt-10">
          <CallToAction to={localizedHref('/', locale)} variant="primary" withArrow>
            {t('notFound.backHome')}
          </CallToAction>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
