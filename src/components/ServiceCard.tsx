import React from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Check } from 'lucide-react';
import type { Service } from '../types';
import { useCurrentLocale } from '../lib/i18n';

interface ServiceCardProps {
  service: Service;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const { t } = useTranslation();
  const locale = useCurrentLocale();
  const subject = encodeURIComponent(service.emailSubject[locale]);
  const mailto = `mailto:gudjonk6@gmail.com?subject=${subject}`;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-8 transition hover:border-brand-400/40">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-br from-brand-400/0 via-transparent to-accent-500/0 opacity-0 transition group-hover:opacity-100"
      />
      <h3 className="font-display text-2xl font-semibold text-white">
        {service.title[locale]}
      </h3>
      <p className="mt-3 text-base text-brand-300">{service.tagline[locale]}</p>
      <p className="mt-5 text-slate-300">{service.description[locale]}</p>

      <ul className="mt-6 space-y-2">
        {service.bullets[locale].map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-slate-300">
            <Check size={16} className="mt-0.5 flex-none text-brand-400" />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6 border-t border-slate-800 pt-4 text-xs uppercase tracking-wider text-slate-500">
        {t('services.format')}
      </div>
      <p className="mt-1 text-sm text-slate-300">{service.format[locale]}</p>

      <a
        href={mailto}
        className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-slate-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-400 hover:text-slate-950"
      >
        <Mail size={16} />
        {t('services.ctaLabel')}
      </a>
    </article>
  );
};

export default ServiceCard;
