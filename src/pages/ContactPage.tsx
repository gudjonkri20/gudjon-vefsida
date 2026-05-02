import React from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, Linkedin, Github, MapPin } from 'lucide-react';
import SEO from '../components/SEO';
import Section from '../components/Section';
import { useCurrentLocale, localizedHref } from '../lib/i18n';

const ContactPage: React.FC = () => {
  const { t } = useTranslation();
  const locale = useCurrentLocale();

  const items = [
    {
      icon: Mail,
      label: t('contact.email'),
      value: 'gudjonk6@gmail.com',
      href: 'mailto:gudjonk6@gmail.com',
    },
    {
      icon: Phone,
      label: t('contact.phone'),
      value: '+354 865 4146',
      href: 'tel:+3548654146',
    },
    {
      icon: Linkedin,
      label: t('contact.linkedin'),
      value: 'gu%C3%B0j%C3%B3n-kristj%C3%A1nsson',
      display: 'linkedin.com/in/guðjón-kristjánsson',
      href: 'https://linkedin.com/in/gu%C3%B0j%C3%B3n-kristj%C3%A1nsson-7a3b083b/',
    },
    {
      icon: Github,
      label: t('contact.github'),
      value: 'gudjonkri20',
      display: 'github.com/gudjonkri20',
      href: 'https://github.com/gudjonkri20',
    },
    {
      icon: MapPin,
      label: t('contact.location'),
      value: 'Reykjavík, Iceland',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <SEO title={t('contact.title')} path={localizedHref('/contact', locale)} />

      <Section tone="dark">
        <div className="max-w-3xl pt-16">
          <h1 className="font-display text-4xl font-semibold text-white md:text-5xl">
            {t('contact.title')}
          </h1>
          <p className="mt-5 text-lg text-slate-300">{t('contact.subtitle')}</p>

          <ul className="mt-12 space-y-4">
            {items.map(({ icon: Icon, label, value, display, href }) => (
              <li
                key={label}
                className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 px-5 py-4"
              >
                <div className="flex items-center gap-4">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-slate-800 text-brand-400">
                    <Icon size={18} />
                  </span>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-slate-500">
                      {label}
                    </div>
                    {href ? (
                      <a
                        href={href}
                        target={href.startsWith('http') ? '_blank' : undefined}
                        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="font-medium text-white transition hover:text-brand-300"
                      >
                        {display ?? value}
                      </a>
                    ) : (
                      <span className="font-medium text-white">{value}</span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Section>
    </div>
  );
};

export default ContactPage;
