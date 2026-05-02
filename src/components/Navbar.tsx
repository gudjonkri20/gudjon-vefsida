import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, Github, Linkedin, Mail } from 'lucide-react';
import clsx from 'clsx';
import LanguageSwitcher from './LanguageSwitcher';
import { useCurrentLocale, localizedHref, pathWithoutLocale } from '../lib/i18n';

const NAV_KEYS = [
  { key: 'about', path: '/about' },
  { key: 'services', path: '/services' },
  { key: 'projects', path: '/projects' },
  { key: 'contact', path: '/contact' },
] as const;

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t } = useTranslation();
  const location = useLocation();
  const locale = useCurrentLocale();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => pathWithoutLocale(location.pathname) === path;

  return (
    <nav
      className={clsx(
        'sticky top-0 z-40 w-full border-b transition-colors duration-200',
        scrolled
          ? 'border-slate-800/80 bg-slate-950/85 backdrop-blur'
          : 'border-transparent bg-transparent',
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          to={localizedHref('/', locale)}
          className="font-display text-base font-semibold tracking-tight text-white transition hover:text-brand-300"
        >
          Guðjón Kristjánsson
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          {NAV_KEYS.map(({ key, path }) => (
            <NavLink
              key={key}
              to={localizedHref(path, locale)}
              className={clsx(
                'rounded-full px-3 py-1.5 text-sm transition',
                isActive(path)
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white',
              )}
            >
              {t(`nav.${key}`)}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <LanguageSwitcher />
          <div className="ml-2 flex items-center gap-3 border-l border-slate-800 pl-4 text-slate-400">
            <a
              href="https://github.com/gudjonkri20"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="transition hover:text-white"
            >
              <Github size={18} />
            </a>
            <a
              href="https://linkedin.com/in/gu%C3%B0j%C3%B3n-kristj%C3%A1nsson-7a3b083b/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="transition hover:text-white"
            >
              <Linkedin size={18} />
            </a>
            <a
              href="mailto:gudjonk6@gmail.com"
              aria-label="Email"
              className="transition hover:text-white"
            >
              <Mail size={18} />
            </a>
          </div>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="rounded-md p-2 text-slate-300 transition hover:bg-slate-900 hover:text-white md:hidden"
          onClick={() => setIsMenuOpen((v) => !v)}
          aria-label={t('nav.menu')}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="border-t border-slate-900 bg-slate-950/95 backdrop-blur md:hidden">
          <div className="space-y-1 px-4 py-3">
            {NAV_KEYS.map(({ key, path }) => (
              <NavLink
                key={key}
                to={localizedHref(path, locale)}
                className={clsx(
                  'block rounded-md px-3 py-2 text-base',
                  isActive(path)
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white',
                )}
              >
                {t(`nav.${key}`)}
              </NavLink>
            ))}
            <div className="flex items-center justify-between border-t border-slate-800 pt-4">
              <LanguageSwitcher />
              <div className="flex items-center gap-3 text-slate-400">
                <a
                  href="https://github.com/gudjonkri20"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="transition hover:text-white"
                >
                  <Github size={18} />
                </a>
                <a
                  href="https://linkedin.com/in/gu%C3%B0j%C3%B3n-kristj%C3%A1nsson-7a3b083b/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="transition hover:text-white"
                >
                  <Linkedin size={18} />
                </a>
                <a
                  href="mailto:gudjonk6@gmail.com"
                  aria-label="Email"
                  className="transition hover:text-white"
                >
                  <Mail size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
