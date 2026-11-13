import React from 'react';
import { useTranslation } from 'react-i18next';
import { Mail } from 'lucide-react';
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
    // No hover lift here. A project card lifts because the whole card is a
    // link; this one is not — only the button below is — and a card that
    // rises under the pointer promises a click it does not deliver.
    <article className="flex h-full flex-col rounded-lg border border-navy-100 bg-paper-raised p-8 shadow-card">
      <h3 className="font-display text-2xl font-semibold tracking-[-0.02em]">
        {service.title[locale]}
      </h3>
      <p className="mt-2 text-base text-navy-700">{service.tagline[locale]}</p>

      <p className="mt-5 font-serif text-[1.0625rem] leading-relaxed text-muted">
        {service.description[locale]}
      </p>

      <ul className="mt-6 space-y-2.5">
        {service.bullets[locale].map((item) => (
          <li
            key={item}
            className="relative pl-5 font-serif text-[0.9375rem] leading-relaxed text-muted"
          >
            {/* Brass tick: the accent doing structural work, not decoration. */}
            <span
              aria-hidden
              className="absolute left-0 top-[0.7em] h-px w-2.5 bg-brass-500"
            />
            {item}
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-8">
        <div className="border-t border-navy-100 pt-4">
          <div className="eyebrow">{t('services.format')}</div>
          <p className="mt-1.5 text-sm text-navy-700">{service.format[locale]}</p>
        </div>

        <a
          href={mailto}
          className="press mt-6 inline-flex min-h-11 w-fit items-center gap-2 rounded-md bg-navy-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-navy-800"
        >
          <Mail size={15} />
          {t('services.ctaLabel')}
        </a>
      </div>
    </article>
  );
};

export default ServiceCard;
