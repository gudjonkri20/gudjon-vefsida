import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowUpRight, ExternalLink } from 'lucide-react';
import Badge from './Badge';
import TechTag from './TechTag';
import ConstellationCanvas from './ConstellationCanvas';
import { CATEGORY_SHAPE } from '../lib/constellationShapes';
import type { Project } from '../types';
import { useCurrentLocale, localizedHref } from '../lib/i18n';

interface ProjectCardProps {
  project: Project;
  compact?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, compact = false }) => {
  const { t } = useTranslation();
  const locale = useCurrentLocale();

  const statusLabel = t(`projects.status.${project.status}`);
  const techShown = compact ? project.tech.slice(0, 4) : project.tech;
  const detailHref = localizedHref(`/projects/${project.slug}`, locale);

  return (
    // The whole card is the link (the title's ::after is stretched over it),
    // so the hover lift is an honest affordance and a thumb has ~350px to aim
    // at instead of a 20px "Read more". It answers a press by settling back
    // down, and shows the focus ring around the card rather than the title.
    <article
      data-constellation-scope
      className="group relative flex h-full flex-col rounded-lg border border-navy-100 bg-paper-raised p-6 shadow-card transition-[box-shadow,transform,border-color] duration-200 ease-out hover:-translate-y-1 hover:border-brass-500/45 hover:shadow-card-hover active:translate-y-0 active:scale-[0.99] active:border-brass-500/45 active:shadow-card active:duration-100 motion-reduce:transform-none motion-reduce:transition-none [&:has(h3>a:focus-visible)]:outline [&:has(h3>a:focus-visible)]:outline-2 [&:has(h3>a:focus-visible)]:outline-offset-[3px] [&:has(h3>a:focus-visible)]:outline-brass-600"
    >
      <div className="flex items-center justify-between gap-3">
        <Badge status={project.status} label={statusLabel} />
        <div className="flex flex-none items-center gap-2.5">
          {project.year && (
            <span className="whitespace-nowrap font-mono text-xs text-muted">
              {project.year}
            </span>
          )}
          {/*
            A small mark per category, in the same language as the hero.
            Sized at 48px: bigger reads more clearly but squeezes the status
            badge onto two lines in a three-column grid.
          */}
          <ConstellationCanvas
            shapes={[CATEGORY_SHAPE[project.category] ?? CATEGORY_SHAPE.ml]}
            pointCount={34}
            linkDistance={13}
            className="h-12 w-12 flex-none opacity-70 transition-opacity duration-300 group-hover:opacity-100"
          />
        </div>
      </div>

      <h3 className="mt-5 font-display text-lg font-semibold leading-snug tracking-[-0.01em]">
        <Link
          to={detailHref}
          className="transition-colors after:absolute after:inset-0 after:rounded-lg after:content-[''] focus-visible:outline-none group-hover:text-brass-700"
        >
          {project.title[locale]}
        </Link>
      </h3>

      <p className="mt-1.5 text-sm text-navy-700">{project.tagline[locale]}</p>

      {!compact && (
        <p className="mt-4 line-clamp-4 font-serif text-[0.9375rem] leading-relaxed text-muted">
          {project.description[locale]}
        </p>
      )}

      <div className="mt-5 flex flex-wrap gap-1.5">
        {techShown.map((tech) => (
          <TechTag key={tech} label={tech} />
        ))}
        {compact && project.tech.length > techShown.length && (
          <span className="font-mono text-[0.6875rem] leading-6 text-muted">
            +{project.tech.length - techShown.length}
          </span>
        )}
      </div>

      {/* Each label stays on one line; if both do not fit side by side (the
          narrower cards in the phone's swipe row) the second drops below,
          rather than both breaking mid-phrase. */}
      <div className="mt-auto flex flex-wrap items-center justify-between gap-x-3 gap-y-1 whitespace-nowrap border-t border-navy-100 pt-4">
        {project.link ? (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            // Sits above the stretched card link so it stays its own target.
            className="hit z-10 inline-flex items-center gap-1 text-sm font-medium text-brass-700 transition-colors hover:text-navy-900"
          >
            {project.linkLabel?.[locale] ?? t('projects.openLink')}
            <ExternalLink size={13} />
          </a>
        ) : (
          <span className="font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-muted">
            {t('projects.availableOnRequest')}
          </span>
        )}

        {project.hasDetailPage && (
          // A visual cue only: the card itself is the link to the same page,
          // so a second link here would just be read out twice.
          <span
            aria-hidden="true"
            className="inline-flex items-center gap-1 text-sm text-muted transition-colors group-hover:text-navy-900"
          >
            {t('projects.viewProject')}
            <ArrowUpRight
              size={14}
              className="transition-transform duration-200 ease-out group-hover:-translate-y-px group-hover:translate-x-px motion-reduce:transform-none"
            />
          </span>
        )}
      </div>
    </article>
  );
};

export default ProjectCard;
