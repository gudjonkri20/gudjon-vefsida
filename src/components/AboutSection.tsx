import React from 'react';
import { useTranslation } from 'react-i18next';
import PageHeader from './PageHeader';
import Section from './Section';
import ConstellationCanvas from './ConstellationCanvas';
import ContactBand from './ContactBand';

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
    {/* Same 68ch measure as every other paragraph on the page. Unbounded,
        these ran to ~125 characters a line on a wide screen. */}
    <div className="mt-1 max-w-prose font-serif leading-relaxed text-muted">{body}</div>
  </div>
);

const AboutSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageHeader
        title={t('about.title')}
        lede={t('about.subtitle')}
        aside={
          <ConstellationCanvas
            startAt={1}
            ariaLabel="A constellation of points cycling between a neural network, a speech waveform, and a brain"
            className="hidden h-[300px] w-[300px] cursor-crosshair lg:block xl:h-[340px] xl:w-[340px]"
          />
        }
      />

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

      <ContactBand />
    </>
  );
};

export default AboutSection;
