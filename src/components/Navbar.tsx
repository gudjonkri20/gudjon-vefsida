import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
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

const MENU_ID = 'site-menu';
const EASE = [0.22, 1, 0.36, 1] as const;

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t } = useTranslation();
  const location = useLocation();
  const locale = useCurrentLocale();
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Escape is the way out of anything that opened over the page.
  useEffect(() => {
    if (!isMenuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isMenuOpen]);

  const isActive = (path: string) => pathWithoutLocale(location.pathname) === path;

  const socialLinkProps = (href: string) =>
    href.startsWith('http')
      ? { target: '_blank', rel: 'noopener noreferrer' }
      : {};

  // The menu leaves the way it came: down from under the bar, back up into it.
  const menuOffset = reduce ? 0 : -8;

  return (
    // A translucent masthead on every page: legible over the navy hero band
    // below it and over paper everywhere else. No colour-shifting on scroll.
    <nav
      className={clsx(
        'material-bar sticky top-0 z-40 w-full border-b border-navy-100 transition-shadow duration-200',
        scrolled && 'shadow-[0_1px_12px_-4px_rgba(11,31,56,0.18)]',
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link
          to={localizedHref('/', locale)}
          className="inline-flex h-11 items-center font-display text-[0.9375rem] font-semibold tracking-[-0.01em] text-navy-900 transition-colors hover:text-brass-700"
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

        <div className="hidden items-center gap-2 md:flex">
          <LanguageSwitcher />
          {/* 17px icons in 32px boxes: the icon is what you see, the box is
              what you hit. -mr-2 puts the last icon back on the grid edge. */}
          <div className="-mr-2 flex items-center border-l border-navy-100 pl-2 text-muted">
            {SOCIALS.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                {...socialLinkProps(href)}
                aria-label={label}
                className="grid h-8 w-8 place-items-center rounded transition-colors hover:text-brass-700"
              >
                <Icon size={17} />
              </a>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="press -mr-2.5 grid h-11 w-11 place-items-center rounded text-navy-900 hover:bg-paper-sunken active:bg-paper-sunken md:hidden"
          onClick={() => setIsMenuOpen((v) => !v)}
          aria-label={t('nav.menu')}
          aria-expanded={isMenuOpen}
          aria-controls={MENU_ID}
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/*
        The menu hangs below the bar instead of growing it. Growing a sticky
        bar pushed the whole page down 235px on open and back up on close; an
        overlay moves nothing but itself, and only on the compositor.
      */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Tap anywhere outside to dismiss. Positioned from the bar, not
                the viewport: a backdrop-filter ancestor captures `fixed`. */}
            <motion.div
              key="scrim"
              aria-hidden="true"
              className="absolute inset-x-0 top-full h-screen bg-navy-950/25 md:hidden"
              onClick={() => setIsMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            />
            <motion.div
              key="menu"
              id={MENU_ID}
              className="absolute inset-x-0 top-full border-y border-navy-100 bg-paper-raised shadow-card-hover md:hidden"
              initial={{ opacity: 0, y: menuOffset }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { duration: 0.2, ease: EASE },
              }}
              exit={{
                opacity: 0,
                y: menuOffset,
                transition: { duration: 0.12, ease: 'easeOut' },
              }}
            >
              <div className="px-5 pb-2 pt-2">
                {NAV_KEYS.map(({ key, path }) => (
                  <NavLink
                    key={key}
                    to={localizedHref(path, locale)}
                    className={clsx(
                      'flex min-h-11 items-center border-l-2 pl-3 text-base transition-colors active:text-navy-900',
                      isActive(path)
                        ? 'border-brass-500 text-navy-900'
                        : 'border-transparent text-muted hover:text-navy-900',
                    )}
                  >
                    {t(`nav.${key}`)}
                  </NavLink>
                ))}
                <div className="mt-2 flex items-center justify-between border-t border-navy-100 pt-2">
                  <LanguageSwitcher className="-ml-3.5" />
                  <div className="-mr-3 flex items-center text-muted">
                    {SOCIALS.map(({ href, label, Icon }) => (
                      <a
                        key={label}
                        href={href}
                        {...socialLinkProps(href)}
                        aria-label={label}
                        className="grid h-11 w-11 place-items-center transition-colors hover:text-brass-700 active:text-brass-700"
                      >
                        <Icon size={18} />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
