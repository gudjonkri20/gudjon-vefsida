import React from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, Linkedin, Github, MapPin } from 'lucide-react';
import SEO from '../components/SEO';
import PageHeader from '../components/PageHeader';
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
      value: 'linkedin.com/in/guðjón-kristjánsson',
      href: 'https://linkedin.com/in/gu%C3%B0j%C3%B3n-kristj%C3%A1nsson-7a3b083b/',
    },
    {
      icon: Github,
      label: t('contact.github'),
      value: 'github.com/gudjonkri20',
      href: 'https://github.com/gudjonkri20',
    },
    {
      icon: MapPin,
      label: t('contact.location'),
      value: 'Reykjavík, Iceland',
    },
  ];

  return (
    <>
      <SEO title={t('contact.title')} path={localizedHref('/contact', locale)} />

      <PageHeader title={t('contact.title')} lede={t('contact.subtitle')} />

      <Section tone="paper">
        {/* A plain list of ways to reach him, on hairlines. No icon bubbles. */}
        <dl className="max-w-2xl">
          {items.map(({ icon: Icon, label, value, href }) => (
            <div
              key={label}
              className="flex flex-col gap-1 border-b border-navy-100 py-5 sm:flex-row sm:items-baseline sm:gap-6"
            >
              <dt className="flex items-center gap-2 sm:w-32 sm:flex-none">
                <Icon size={14} className="text-brass-600" aria-hidden />
                <span className="eyebrow">{label}</span>
              </dt>
              <dd className="text-[1.0625rem] text-navy-900">
                {href ? (
                  <a
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="underline decoration-brass-500/50 decoration-1 underline-offset-4 transition-colors hover:text-brass-700"
                  >
                    {value}
                  </a>
                ) : (
                  value
                )}
              </dd>
            </div>
          ))}
        </dl>
      </Section>
    </>
  );
};

export default ContactPage;
