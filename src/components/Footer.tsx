import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Github, Linkedin, Mail } from 'lucide-react';
import { useCurrentLocale, localizedHref } from '../lib/i18n';

const FOOTER_LINKS = [
  { key: 'about', path: '/about' },
  { key: 'services', path: '/services' },
  { key: 'projects', path: '/projects' },
  { key: 'contact', path: '/contact' },
] as const;

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const locale = useCurrentLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-900 bg-slate-950 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <Link
              to={localizedHref('/', locale)}
              className="font-display text-lg font-semibold text-white transition hover:text-brand-300"
            >
              Guðjón Kristjánsson
            </Link>
            <p className="mt-2 text-sm">{t('footer.tagline')}</p>
          </div>

          <nav aria-label="Footer">
            <ul className="grid grid-cols-2 gap-y-2 text-sm">
              {FOOTER_LINKS.map(({ key, path }) => (
                <li key={key}>
                  <Link
                    to={localizedHref(path, locale)}
                    className="transition hover:text-white"
                  >
                    {t(`nav.${key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-start justify-start gap-4 md:justify-end">
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

        <div className="mt-10 flex flex-col items-start justify-between gap-2 border-t border-slate-900 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center">
          <span>{t('footer.copyright', { year })}</span>
          <span className="font-mono">v0.2 · Reykjavík</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
