import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Download } from 'lucide-react';
import SEO from '../components/SEO';
import { getAllProjects } from '../lib/projects';
import { useCurrentLocale, localizedHref } from '../lib/i18n';
import { SITE_URL } from '../lib/site';
import { CONTACT, EDU_KEYS, EXPERIENCE_KEYS, LANG_KEYS, SKILL_KEYS } from '../data/about';

/**
 * A one-page CV: the thing someone forwards after deciding they want him.
 *
 * Everything on it comes from the same strings and project data as the rest
 * of the site, so it cannot drift out of date: add a project or a job and
 * the CV has it. On screen it is an A4 sheet; "Download PDF" opens the
 * browser's print dialog, and the print styles (index.css and the `print:`
 * classes here) turn the page into the sheet alone, black on white, whatever
 * the visitor's colour scheme.
 */

/** Selected work: the featured projects, then any other public one. */
const selectedProjects = () => {
  const all = getAllProjects();
  const featured = all.filter((p) => p.isFeatured);
  const publicRest = all.filter((p) => !p.isFeatured && p.status === 'public');
  return [...featured, ...publicRest];
};

const Heading: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="eyebrow border-b border-navy-100 pb-1.5 print:border-neutral-300 print:text-black">
    {children}
  </h2>
);

/** "Title · Role · Years" split so the years can sit on the right. */
const Dated: React.FC<{ title: string; body: string }> = ({ title, body }) => {
  const parts = title.split(' · ');
  const years = parts.length > 1 ? parts.pop() : undefined;
  return (
    <div className="break-inside-avoid">
      <div className="flex items-baseline justify-between gap-4">
        <span className="font-display font-semibold text-navy-900">{parts.join(' · ')}</span>
        {years && (
          <span className="shrink-0 font-mono text-xs text-muted">{years}</span>
        )}
      </div>
      <p className="mt-0.5 font-serif text-[0.9375rem] leading-relaxed text-muted">{body}</p>
    </div>
  );
};

const CVPage: React.FC = () => {
  const { t } = useTranslation();
  const locale = useCurrentLocale();
  const projects = selectedProjects();
  const siteLabel = SITE_URL.replace(/^https:\/\//, '');

  return (
    <>
      <SEO
        title={t('cv.title')}
        description={t('cv.description')}
        path={localizedHref('/cv', locale)}
      />

      <div className="bg-paper px-5 py-10 sm:px-8 sm:py-14 print:bg-white print:p-0">
        {/* Screen only: the way back, and the way to a PDF. */}
        <div className="mx-auto mb-6 flex max-w-[210mm] flex-wrap items-center justify-between gap-4 print:hidden">
          <Link
            to={localizedHref('/about', locale)}
            className="hit inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.1em] text-muted transition-colors hover:text-navy-900"
          >
            <ArrowLeft size={14} />
            {t('about.title')}
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden text-xs text-muted sm:inline">{t('cv.hint')}</span>
            <button
              type="button"
              onClick={() => window.print()}
              className="press inline-flex min-h-11 items-center gap-2 rounded-md bg-navy-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-navy-800 dark:bg-brass-500 dark:text-navy-950 dark:hover:bg-brass-400"
            >
              <Download size={15} />
              {t('cv.download')}
            </button>
          </div>
        </div>

        <article className="mx-auto max-w-[210mm] rounded-lg border border-navy-100 bg-paper-raised p-7 shadow-card sm:p-12 print:max-w-none print:rounded-none print:border-0 print:p-0 print:shadow-none">
          <header className="border-b-2 border-brass-500 pb-5">
            <h1 className="font-display text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">
              Guðjón Kristjánsson
            </h1>
            <p className="mt-1 text-lg text-navy-700">{t('siteTagline')}</p>
            <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 font-mono text-xs text-muted">
              <li>
                <a href={`mailto:${CONTACT.email}`} className="hover:text-navy-900">
                  {CONTACT.email}
                </a>
              </li>
              <li>
                <a href={CONTACT.phoneHref} className="hover:text-navy-900">
                  {CONTACT.phone}
                </a>
              </li>
              <li>Reykjavík</li>
              <li>
                <a href={CONTACT.linkedin} className="hover:text-navy-900">
                  {CONTACT.linkedinLabel}
                </a>
              </li>
              <li>
                <a href={CONTACT.github} className="hover:text-navy-900">
                  {CONTACT.githubLabel}
                </a>
              </li>
              <li>
                <a href={SITE_URL} className="hover:text-navy-900">
                  {siteLabel}
                </a>
              </li>
            </ul>
          </header>

          <div className="mt-6 grid gap-x-10 gap-y-7 sm:grid-cols-[minmax(0,2.3fr)_minmax(0,1fr)]">
            {/* Main column: what he does and has done. */}
            <div className="space-y-7">
              <section>
                <Heading>{t('cv.profile')}</Heading>
                <p className="mt-3 font-serif text-[0.9375rem] leading-relaxed text-navy-900">
                  {t('about.now.body')} {t('about.background.body')}
                </p>
              </section>

              <section>
                <Heading>{t('about.experience.title')}</Heading>
                <div className="mt-3 space-y-4">
                  {EXPERIENCE_KEYS.map((k) => (
                    <Dated
                      key={k}
                      title={t(`about.experience.items.${k}.title`)}
                      body={t(`about.experience.items.${k}.body`)}
                    />
                  ))}
                </div>
              </section>

              <section>
                <Heading>{t('cv.projects')}</Heading>
                <ul className="mt-3 space-y-2.5">
                  {projects.map((p) => (
                    <li key={p.slug} className="break-inside-avoid">
                      <span className="font-display font-semibold text-navy-900">
                        {p.title[locale]}
                      </span>
                      {p.link && (
                        <span className="ml-2 font-mono text-xs text-brass-700">
                          {new URL(p.link).hostname.replace(/^www\./, '')}
                        </span>
                      )}
                      <p className="font-serif text-[0.9375rem] leading-snug text-muted">
                        {p.tagline[locale]}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            {/* Side column: the reference material. */}
            <div className="space-y-7">
              <section>
                <Heading>{t('about.education.title')}</Heading>
                <div className="mt-3 space-y-4">
                  {EDU_KEYS.map((k) => (
                    <Dated
                      key={k}
                      title={t(`about.education.items.${k}.title`)}
                      body={t(`about.education.items.${k}.body`)}
                    />
                  ))}
                </div>
              </section>

              <section>
                <Heading>{t('about.skills.title')}</Heading>
                <ul className="mt-3 space-y-2 text-[0.8125rem] leading-snug text-navy-900">
                  {SKILL_KEYS.map((k) => {
                    const [label, items] = t(`about.skills.${k}`).split(' — ');
                    return (
                      <li key={k} className="break-inside-avoid">
                        <span className="font-semibold">{label}</span>
                        {items && <span className="block text-muted">{items}</span>}
                      </li>
                    );
                  })}
                </ul>
              </section>

              <section>
                <Heading>{t('about.languages.title')}</Heading>
                <ul className="mt-3 space-y-1 text-[0.8125rem] text-navy-900">
                  {LANG_KEYS.map((k) => (
                    <li key={k}>{t(`about.languages.items.${k}`)}</li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        </article>
      </div>
    </>
  );
};

export default CVPage;
