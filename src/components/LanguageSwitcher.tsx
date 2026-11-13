import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { localeFromPath, pathWithLocale } from '../lib/i18n';
import type { Locale } from '../types';

interface LanguageSwitcherProps {
  className?: string;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const current = localeFromPath(location.pathname);

  const switchTo = (locale: Locale) => {
    if (locale === current) return;
    const target = pathWithLocale(location.pathname, locale);
    void i18n.changeLanguage(locale);
    navigate(target + location.search + location.hash);
  };

  return (
    // EN / IS as a mono pair with a hairline divider — a setting, not a toggle.
    <div
      className={clsx('inline-flex items-center font-mono text-xs', className)}
      role="group"
      aria-label="Language"
    >
      {(['en', 'is'] as const).map((lang, i) => (
        <React.Fragment key={lang}>
          {i > 0 && <span aria-hidden className="text-navy-200">/</span>}
          <button
            type="button"
            onClick={() => switchTo(lang)}
            className={clsx(
              // The label is 16px square. The button around it is 44px in the
              // mobile menu and 28x32 beside a pointer, so it can be hit.
              'inline-flex min-h-11 min-w-11 items-center justify-center uppercase tracking-[0.08em] transition-colors md:min-h-8 md:min-w-7',
              current === lang
                ? 'text-navy-900'
                : 'text-muted hover:text-brass-700',
            )}
            aria-pressed={current === lang}
          >
            {lang}
          </button>
        </React.Fragment>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
