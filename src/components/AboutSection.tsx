import React from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, Linkedin, Github } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHeader from './PageHeader';
import Section from './Section';
import { useCurrentLocale, localizedHref } from '../lib/i18n';

const EDU_KEYS = ['aarhus', 'ru', 'hi'] as const;
const EXPERIENCE_KEYS = ['icelandia', 'cyberpilot', 'reykjavikurborg'] as const;
const LANG_KEYS = ['is', 'en', 'da', 'de'] as const;
const SKILL_KEYS = ['ai', 'languages', 'stack', 'ml'] as const;

/** Label-left, content-right. One row per topic, separated by a hairline. */
const Row: React.FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <div className="grid gap-4 border-t border-navy-100 py-10 lg:grid-cols-12 lg:gap-12">
    <h2 className="eyebrow lg:col-span-3 lg:pt-1">{label}</h2>
    <div className="lg:col-span-9">{children}</div>
  </div>
);

/** A dated entry — job or degree. */
const Entry: React.FC<{ title: string; body: string }> = ({ title, body }) => (
  <div className="border-l-2 border-brass-500/40 pl-5">
    <div className="font-display text-lg font-semibold text-navy-900">{title}</div>
    <div className="mt-1 font-serif leading-relaxed text-muted">{body}</div>
  </div>
);

const AboutSection: React.FC = () => {
  const { t } = useTranslation();
  const locale = useCurrentLocale();

  return (
    <>
      <PageHeader title={t('about.title')} lede={t('about.subtitle')} />

      <Section tone="paper">
        {/* Portrait sits with the "currently" statement rather than in the
            hero — a photograph, squared off, no glow ring. */}
        <div className="grid gap-10 pb-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-3">
            <img
              src="/profile.jpg"
              alt="Guðjón Kristjánsson"
              width={460}
              height={460}
              loading="eager"
              className="w-40 rounded-lg border border-navy-100 shadow-card sm:w-48 lg:w-full"
            />
          </div>
          <div className="lg:col-span-9">
            <p className="eyebrow">{t('about.now.title')}</p>
            <p className="mt-4 max-w-prose font-display text-2xl font-medium leading-snug tracking-[-0.015em] text-navy-900 md:text-3xl">
              {t('about.now.body')}
            </p>
          </div>
        </div>

        <Row label={t('about.background.title')}>
          <p className="max-w-prose font-serif text-[1.0625rem] leading-relaxed text-muted">
            {t('about.background.body')}
          </p>
        </Row>

        <Row label={t('about.experience.title')}>
          <div className="space-y-7">
            {EXPERIENCE_KEYS.map((k) => (
              <Entry
                key={k}
                title={t(`about.experience.items.${k}.title`)}
                body={t(`about.experience.items.${k}.body`)}
              />
            ))}
          </div>
        </Row>

        <Row label={t('about.education.title')}>
          <div className="space-y-7">
            {EDU_KEYS.map((k) => (
              <Entry
                key={k}
                title={t(`about.education.items.${k}.title`)}
                body={t(`about.education.items.${k}.body`)}
              />
            ))}
          </div>
        </Row>

        <Row label={t('about.skills.title')}>
          <div className="space-y-3">
            {SKILL_KEYS.map((k) => (
              <p
                key={k}
                className="max-w-prose font-serif leading-relaxed text-muted"
              >
                {t(`about.skills.${k}`)}
              </p>
            ))}
          </div>
        </Row>

        <Row label={t('about.languages.title')}>
          <div className="grid gap-2 sm:grid-cols-2">
            {LANG_KEYS.map((k) => (
              <p key={k} className="font-serif leading-relaxed text-muted">
                {t(`about.languages.items.${k}`)}
              </p>
            ))}
          </div>
        </Row>
      </Section>

      <Section tone="navy">
        <h2 className="max-w-2xl font-display text-3xl font-semibold tracking-[-0.02em] text-white md:text-4xl">
          {t('about.contactCta.title')}
        </h2>
        <p className="mt-3 max-w-prose font-serif text-lg leading-relaxed text-navy-100">
          {t('about.contactCta.body')}
        </p>

        <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm">
          <a
            href="mailto:gudjonk6@gmail.com"
            className="inline-flex items-center gap-2 text-brass-400 transition-colors hover:text-white"
          >
            <Mail size={15} />
            gudjonk6@gmail.com
          </a>
          <a
            href="tel:+3548654146"
            className="inline-flex items-center gap-2 text-white transition-colors hover:text-brass-400"
          >
            <Phone size={15} />
            +354 865 4146
          </a>
          <a
            href="https://linkedin.com/in/gu%C3%B0j%C3%B3n-kristj%C3%A1nsson-7a3b083b/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-white transition-colors hover:text-brass-400"
          >
            <Linkedin size={15} />
            LinkedIn
          </a>
          <a
            href="https://github.com/gudjonkri20"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-white transition-colors hover:text-brass-400"
          >
            <Github size={15} />
            GitHub
          </a>
          <Link
            to={localizedHref('/contact', locale)}
            className="inline-flex items-center gap-2 text-navy-200 transition-colors hover:text-brass-400"
          >
            {t('nav.contact')}
          </Link>
        </div>
      </Section>
    </>
  );
};

export default AboutSection;
