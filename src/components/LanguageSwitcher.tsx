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
    <div
      className={clsx(
        'inline-flex items-center rounded-full border border-slate-700/60 bg-slate-900/60 p-0.5 text-xs font-medium',
        className,
      )}
      role="group"
      aria-label="Language"
    >
      {(['en', 'is'] as const).map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => switchTo(lang)}
          className={clsx(
            'rounded-full px-2.5 py-1 transition',
            current === lang
              ? 'bg-slate-700 text-white'
              : 'text-slate-400 hover:text-white',
          )}
          aria-pressed={current === lang}
        >
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
