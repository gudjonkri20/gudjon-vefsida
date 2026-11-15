import React, { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ExternalLink, MessageCircle } from 'lucide-react';
import SEO from '../components/SEO';
import Band from '../components/Band';
import Section from '../components/Section';
import Badge from '../components/Badge';
import TechTag from '../components/TechTag';
import NotFoundPage from './NotFoundPage';
import ConstellationCanvas from '../components/ConstellationCanvas';
import { CATEGORY_SHAPE, SHAPES } from '../lib/constellationShapes';
import { getProjectBySlug } from '../lib/projects';
import { useCurrentLocale, localizedHref } from '../lib/i18n';
import { askAssistant, useAssistantOnline } from '../lib/useAssistantOnline';

const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  const locale = useCurrentLocale();

  const project = slug ? getProjectBySlug(slug) : undefined;

  // Declared before the early return below: hooks cannot run conditionally.
  const detailShapes = useMemo(
    () => [(project && CATEGORY_SHAPE[project.category]) || SHAPES[0]],
    [project],
  );
  const assistantOnline = useAssistantOnline();

  if (!project) {
    return <NotFoundPage />;
  }

  const statusLabel = t(`projects.status.${project.status}`);

  return (
    <>
      <SEO
        title={project.title[locale]}
        description={project.tagline[locale]}
        path={localizedHref(`/projects/${project.slug}`, locale)}
        image={`/og${locale === 'is' ? '/is' : ''}/${project.slug}.png`}
      />

      <Band as="header" className="bg-navy-900 text-white">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 md:py-16">
          <Link
            to={localizedHref('/projects', locale)}
            className="hit inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.1em] text-navy-200 transition-colors hover:text-brass-400"
          >
            <ArrowLeft size={14} />
            {t('projectDetail.back')}
          </Link>

          {/*
            The project's own category mark sits on the content grid, right
            of the title — the same seat the mark has on Projects, About,
            Services and Contact. It used to be pinned to the edge of the
            window instead, where a 1440px screen cut 40px off its side.
          */}
          <div className="mt-8 grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_auto]">
            <div className="max-w-3xl">
              <Badge
                status={project.status}
                label={statusLabel}
                onNavy
              />
              <h1 className="mt-5 text-balance font-display text-[clamp(2rem,4.5vw,3.25rem)] font-semibold leading-[1.06] tracking-[-0.025em] text-white">
                {project.title[locale]}
              </h1>
              <p className="mt-4 font-serif text-lg leading-relaxed text-navy-100 sm:text-xl">
                {project.tagline[locale]}
              </p>
            </div>
            <div aria-hidden="true" className="hidden lg:block">
              <ConstellationCanvas
                shapes={detailShapes}
                pointCount={160}
                linkDistance={30}
                className="h-[220px] w-[220px] cursor-crosshair"
              />
            </div>
          </div>
        </div>
      </Band>

      <Section tone="paper">
        <div className="max-w-prose">
          <p className="font-serif text-[1.0625rem] leading-relaxed text-muted">
            {project.description[locale]}
          </p>

          {(project.link || assistantOnline) && (
            <div className="mt-8 flex flex-wrap gap-3">
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="press inline-flex min-h-11 items-center gap-2 rounded-md bg-navy-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-navy-800 dark:bg-brass-500 dark:text-navy-950 dark:hover:bg-brass-400"
                >
                  {project.linkLabel?.[locale] ?? t('projects.openLink')}
                  <ExternalLink size={15} />
                </a>
              )}

              {/*
                Most of these pages are one paragraph, and the assistant
                knows more about the project than the page says. This asks
                it, about this project, in one click. Shown only when the
                assistant can answer.
              */}
              {assistantOnline && (
                <button
                  type="button"
                  onClick={() =>
                    askAssistant(t('chat.askAboutQuestion', { title: project.title[locale] }))
                  }
                  className="press inline-flex min-h-11 items-center gap-2 rounded-md border border-navy-200 bg-paper-raised px-5 py-2.5 text-sm font-medium text-navy-900 hover:border-navy-600 hover:bg-navy-50"
                >
                  <MessageCircle size={15} className="text-brass-600" />
                  {t('chat.askAbout')}
                </button>
              )}
            </div>
          )}
        </div>

        <div className="mt-14 grid max-w-3xl grid-cols-1 gap-8 border-t border-navy-100 pt-8 sm:grid-cols-[1fr_auto]">
          <div className="min-w-0">
            <div className="eyebrow">{t('projectDetail.stack')}</div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {project.tech.map((tech) => (
                <TechTag key={tech} label={tech} />
              ))}
            </div>
          </div>
          {project.year && (
            <div>
              <div className="eyebrow">{t('projectDetail.year')}</div>
              <div className="mt-3 font-mono text-xl text-navy-900">
                {project.year}
              </div>
            </div>
          )}
        </div>

        <p className="mt-12 max-w-prose border-l-2 border-brass-500 pl-4 font-serif text-sm italic text-muted">
          {t('projectDetail.comingSoon')}
        </p>
      </Section>
    </>
  );
};

export default ProjectDetailPage;
