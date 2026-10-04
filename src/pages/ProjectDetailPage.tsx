import React, { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import SEO from '../components/SEO';
import Section from '../components/Section';
import Badge from '../components/Badge';
import TechTag from '../components/TechTag';
import NotFoundPage from './NotFoundPage';
import ConstellationCanvas from '../components/ConstellationCanvas';
import { CATEGORY_SHAPE, SHAPES } from '../lib/constellationShapes';
import { getProjectBySlug } from '../lib/projects';
import { useCurrentLocale, localizedHref } from '../lib/i18n';

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
      />

      <header className="relative overflow-hidden bg-navy-900 text-white">
        {/* The project's own category mark, same language as the grid. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 top-1/2 hidden -translate-y-1/2 opacity-60 lg:block"
        >
          <ConstellationCanvas
            shapes={detailShapes}
            pointCount={160}
            linkDistance={34}
            className="h-[260px] w-[260px]"
          />
        </div>
        <div className="relative mx-auto max-w-6xl px-5 py-14 sm:px-8 md:py-16">
          <Link
            to={localizedHref('/projects', locale)}
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.1em] text-navy-200 transition-colors hover:text-brass-400"
          >
            <ArrowLeft size={14} />
            {t('projectDetail.back')}
          </Link>

          <div className="mt-8 max-w-3xl">
            <Badge
              status={project.status}
              label={statusLabel}
              className="border-brass-400/40 bg-brass-400/10 text-brass-400"
            />
            <h1 className="mt-5 text-balance font-display text-[clamp(2rem,4.5vw,3.25rem)] font-semibold leading-[1.06] tracking-[-0.025em] text-white">
              {project.title[locale]}
            </h1>
            <p className="mt-4 font-serif text-lg leading-relaxed text-navy-100 sm:text-xl">
              {project.tagline[locale]}
            </p>
          </div>
        </div>
      </header>

      <Section tone="paper">
        <div className="max-w-prose">
          <p className="font-serif text-[1.0625rem] leading-relaxed text-muted">
            {project.description[locale]}
          </p>

          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-md bg-navy-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-navy-800"
            >
              {project.linkLabel?.[locale] ?? t('projects.openLink')}
              <ExternalLink size={15} />
            </a>
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
