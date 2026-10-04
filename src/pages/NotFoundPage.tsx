import React from 'react';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
import CallToAction from '../components/CallToAction';
import ConstellationCanvas from '../components/ConstellationCanvas';
import { iceland } from '../lib/constellationShapes';
import { useCurrentLocale, localizedHref } from '../lib/i18n';

// Module scope, so the array identity is stable and the canvas is not
// rebuilt on every render.
const LOST_SHAPES = [iceland];

const NotFoundPage: React.FC = () => {
  const { t } = useTranslation();
  const locale = useCurrentLocale();

  return (
    <div className="grid min-h-[calc(100vh-8rem)] place-items-center bg-navy-900 px-6 py-20 text-center text-white">
      <SEO title="404" path="/404" />
      <div>
        {/* Iceland, for the page that is off the map. */}
        <div className="mb-8 flex justify-center">
          <ConstellationCanvas
            shapes={LOST_SHAPES}
            ariaLabel="A constellation in the shape of Iceland"
            className="h-[200px] w-[200px] cursor-crosshair sm:h-[240px] sm:w-[240px]"
          />
        </div>
        <p className="eyebrow-on-navy">{t('notFound.title')}</p>
        <h1 className="mt-4 font-display text-[clamp(2rem,5vw,3.5rem)] font-semibold tracking-[-0.025em] text-white">
          {t('notFound.subtitle')}
        </h1>
        <div className="mt-10">
          <CallToAction
            to={localizedHref('/', locale)}
            variant="primary"
            onNavy
            withArrow
          >
            {t('notFound.backHome')}
          </CallToAction>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
