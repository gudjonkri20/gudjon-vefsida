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

const SOCIALS = [
  { href: 'https://github.com/gudjonkri20', label: 'GitHub', Icon: Github },
  {
    href: 'https://linkedin.com/in/gu%C3%B0j%C3%B3n-kristj%C3%A1nsson-7a3b083b/',
    label: 'LinkedIn',
    Icon: Linkedin,
  },
  { href: 'mailto:gudjonk6@gmail.com', label: 'Email', Icon: Mail },
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

  const socialLinkProps = (href: string) =>
    href.startsWith('http')
      ? { target: '_blank', rel: 'noopener noreferrer' }
      : {};

  return (
    // A solid masthead on every page: legible over the navy hero band below it
    // and over paper everywhere else. No colour-shifting on scroll.
    <nav
      className={clsx(
        'sticky top-0 z-40 w-full border-b border-navy-100 bg-paper-raised/90 backdrop-blur transition-shadow duration-200',
        scrolled && 'shadow-[0_1px_12px_-4px_rgba(11,31,56,0.18)]',
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link
          to={localizedHref('/', locale)}
          className="font-display text-[0.9375rem] font-semibold tracking-[-0.01em] text-navy-900 transition-colors hover:text-brass-700"
        >
          Guðjón Kristjánsson
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {NAV_KEYS.map(({ key, path }) => (
            <NavLink
              key={key}
              to={localizedHref(path, locale)}
              className={clsx(
                // Active state is a brass rule under the word — an editorial
                // marker rather than a pill.
                'relative py-1 text-sm transition-colors',
                isActive(path)
                  ? 'text-navy-900 after:absolute after:-bottom-px after:left-0 after:h-[2px] after:w-full after:bg-brass-500'
                  : 'text-muted hover:text-navy-900',
              )}
            >
              {t(`nav.${key}`)}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-4 md:flex">
          <LanguageSwitcher />
          <div className="flex items-center gap-3 border-l border-navy-100 pl-4 text-muted">
            {SOCIALS.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                {...socialLinkProps(href)}
                aria-label={label}
                className="transition-colors hover:text-brass-700"
              >
                <Icon size={17} />
              </a>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="rounded p-2 text-navy-900 transition-colors hover:bg-paper-sunken md:hidden"
          onClick={() => setIsMenuOpen((v) => !v)}
          aria-label={t('nav.menu')}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="border-t border-navy-100 bg-paper-raised md:hidden">
          <div className="space-y-1 px-5 py-3">
            {NAV_KEYS.map(({ key, path }) => (
              <NavLink
                key={key}
                to={localizedHref(path, locale)}
                className={clsx(
                  'block border-l-2 py-2 pl-3 text-base transition-colors',
                  isActive(path)
                    ? 'border-brass-500 text-navy-900'
                    : 'border-transparent text-muted hover:text-navy-900',
                )}
              >
                {t(`nav.${key}`)}
              </NavLink>
            ))}
            <div className="flex items-center justify-between border-t border-navy-100 pt-4">
              <LanguageSwitcher />
              <div className="flex items-center gap-4 text-muted">
                {SOCIALS.map(({ href, label, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    {...socialLinkProps(href)}
                    aria-label={label}
                    className="transition-colors hover:text-brass-700"
                  >
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
