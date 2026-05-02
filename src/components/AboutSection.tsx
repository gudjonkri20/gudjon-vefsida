import React from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, Linkedin, Github, GraduationCap, Briefcase, Languages, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import Section from './Section';
import { useCurrentLocale, localizedHref } from '../lib/i18n';

const EDU_KEYS = ['aarhus', 'ru', 'hi'] as const;
const EXPERIENCE_KEYS = ['icelandia', 'cyberpilot', 'reykjavikurborg'] as const;
const LANG_KEYS = ['is', 'en', 'da', 'de'] as const;
const SKILL_KEYS = ['ai', 'languages', 'stack', 'ml'] as const;

const AboutSection: React.FC = () => {
  const { t } = useTranslation();
  const locale = useCurrentLocale();

  return (
    <div className="bg-slate-950 text-slate-100">
      <Section tone="dark">
        <div className="max-w-3xl pt-12">
          <h1 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">
            {t('about.title')}
          </h1>
          <p className="mt-5 text-lg text-slate-400">{t('about.subtitle')}</p>
        </div>
      </Section>

      <Section tone="dark" className="border-t border-slate-900">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-2 text-sm uppercase tracking-widest text-brand-400">
              <Sparkles size={14} />
              {t('about.now.title')}
            </div>
          </div>
          <div className="lg:col-span-8">
            <p className="font-display text-2xl text-white md:text-3xl">
              {t('about.now.body')}
            </p>
          </div>
        </div>
      </Section>

      <Section tone="dark" className="border-t border-slate-900">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="text-sm uppercase tracking-widest text-slate-500">
              {t('about.background.title')}
            </h2>
          </div>
          <div className="lg:col-span-8">
            <p className="text-lg text-slate-300">{t('about.background.body')}</p>
          </div>
        </div>
      </Section>

      <Section tone="dark" className="border-t border-slate-900">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="flex items-center gap-2 text-sm uppercase tracking-widest text-slate-500">
              <Briefcase size={14} />
              {t('about.experience.title')}
            </h2>
          </div>
          <div className="lg:col-span-8 space-y-6">
            {EXPERIENCE_KEYS.map((k) => (
              <div key={k} className="border-l border-slate-800 pl-5">
                <div className="font-display text-lg font-semibold text-white">
                  {t(`about.experience.items.${k}.title`)}
                </div>
                <div className="mt-1 text-slate-400">
                  {t(`about.experience.items.${k}.body`)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section tone="dark" className="border-t border-slate-900">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="flex items-center gap-2 text-sm uppercase tracking-widest text-slate-500">
              <GraduationCap size={14} />
              {t('about.education.title')}
            </h2>
          </div>
          <div className="lg:col-span-8 space-y-6">
            {EDU_KEYS.map((k) => (
              <div key={k} className="border-l border-slate-800 pl-5">
                <div className="font-display text-lg font-semibold text-white">
                  {t(`about.education.items.${k}.title`)}
                </div>
                <div className="mt-1 text-slate-400">
                  {t(`about.education.items.${k}.body`)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section tone="dark" className="border-t border-slate-900">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="text-sm uppercase tracking-widest text-slate-500">
              {t('about.skills.title')}
            </h2>
          </div>
          <div className="lg:col-span-8 space-y-3">
            {SKILL_KEYS.map((k) => (
              <p key={k} className="text-slate-300">
                {t(`about.skills.${k}`)}
              </p>
            ))}
          </div>
        </div>
      </Section>

      <Section tone="dark" className="border-t border-slate-900">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="flex items-center gap-2 text-sm uppercase tracking-widest text-slate-500">
              <Languages size={14} />
              {t('about.languages.title')}
            </h2>
          </div>
          <div className="lg:col-span-8 grid gap-2 sm:grid-cols-2">
            {LANG_KEYS.map((k) => (
              <p key={k} className="text-slate-300">
                {t(`about.languages.items.${k}`)}
              </p>
            ))}
          </div>
        </div>
      </Section>

      <Section tone="dark" className="border-t border-slate-900">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 md:p-12">
          <h2 className="font-display text-2xl font-semibold text-white md:text-3xl">
            {t('about.contactCta.title')}
          </h2>
          <p className="mt-3 text-slate-400">{t('about.contactCta.body')}</p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <a
              href="mailto:gudjonk6@gmail.com"
              className="inline-flex items-center gap-2 rounded-full bg-brand-400 px-4 py-2 font-medium text-slate-950 transition hover:bg-brand-300"
            >
              <Mail size={14} />
              gudjonk6@gmail.com
            </a>
            <a
              href="tel:+3548654146"
              className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-4 py-2 text-white transition hover:border-brand-400/60 hover:text-brand-300"
            >
              <Phone size={14} />
              +354 865 4146
            </a>
            <a
              href="https://linkedin.com/in/gu%C3%B0j%C3%B3n-kristj%C3%A1nsson-7a3b083b/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-4 py-2 text-white transition hover:border-brand-400/60 hover:text-brand-300"
            >
              <Linkedin size={14} />
              LinkedIn
            </a>
            <a
              href="https://github.com/gudjonkri20"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-4 py-2 text-white transition hover:border-brand-400/60 hover:text-brand-300"
            >
              <Github size={14} />
              GitHub
            </a>
            <Link
              to={localizedHref('/contact', locale)}
              className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-4 py-2 text-slate-300 transition hover:border-brand-400/60 hover:text-brand-300"
            >
              {t('nav.contact')}
            </Link>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default AboutSection;
