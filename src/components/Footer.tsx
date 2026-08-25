import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Github, Linkedin, Mail } from 'lucide-react';
import Waveform from './Waveform';
import { useCurrentLocale, localizedHref } from '../lib/i18n';

const FOOTER_LINKS = [
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

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const locale = useCurrentLocale();
  const year = new Date().getFullYear();

  const socialLinkProps = (href: string) =>
    href.startsWith('http')
      ? { target: '_blank', rel: 'noopener noreferrer' }
      : {};

  return (
    <footer className="bg-navy-950 text-navy-200">
      {/* The waveform closes the page as quietly as it opened it. */}
      <div className="text-navy-800">
        <Waveform />
      </div>

      <div className="mx-auto max-w-6xl px-5 pb-12 sm:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <Link
              to={localizedHref('/', locale)}
              className="font-display text-base font-semibold text-white transition-colors hover:text-brass-400"
            >
              Guðjón Kristjánsson
            </Link>
            <p className="mt-2 max-w-xs font-serif text-sm leading-relaxed">
              {t('footer.tagline')}
            </p>
          </div>

          <nav aria-label="Footer">
            <ul className="grid grid-cols-2 gap-y-2 text-sm">
              {FOOTER_LINKS.map(({ key, path }) => (
                <li key={key}>
                  <Link
                    to={localizedHref(path, locale)}
                    className="transition-colors hover:text-brass-400"
                  >
                    {t(`nav.${key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-start gap-4 md:justify-end">
            {SOCIALS.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                {...socialLinkProps(href)}
                aria-label={label}
                className="transition-colors hover:text-brass-400"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        <div className="rule-on-navy mt-10 flex flex-col items-start justify-between gap-2 pt-6 font-mono text-xs text-navy-200/70 sm:flex-row sm:items-center">
          <span>{t('footer.copyright', { year })}</span>
          <span>Reykjavík</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
