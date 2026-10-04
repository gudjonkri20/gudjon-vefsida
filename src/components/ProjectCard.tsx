import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowUpRight, ExternalLink } from 'lucide-react';
import Badge from './Badge';
import TechTag from './TechTag';
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
    <article className="group relative flex h-full flex-col rounded-lg border border-navy-100 bg-paper-raised p-6 shadow-card transition-[box-shadow,transform,border-color] duration-200 ease-out hover:-translate-y-1 hover:border-brass-500/45 hover:shadow-card-hover motion-reduce:transform-none motion-reduce:transition-none">
      <div className="flex items-center justify-between gap-3">
        <Badge status={project.status} label={statusLabel} />
        {project.year && (
          <span className="font-mono text-xs text-muted/70">{project.year}</span>
        )}
      </div>

      <h3 className="mt-5 font-display text-lg font-semibold leading-snug tracking-[-0.01em]">
        <Link to={detailHref} className="transition-colors hover:text-brass-700">
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
          <span className="font-mono text-[0.6875rem] leading-6 text-muted/70">
            +{project.tech.length - techShown.length}
          </span>
        )}
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-navy-100 pt-4">
        {project.link ? (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm font-medium text-brass-700 transition-colors hover:text-navy-900"
          >
            {project.linkLabel?.[locale] ?? t('projects.openLink')}
            <ExternalLink size={13} />
          </a>
        ) : (
          <span className="font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-muted/70">
            {t('projects.availableOnRequest')}
          </span>
        )}

        {project.hasDetailPage && (
          <Link
            to={detailHref}
            className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-navy-900"
          >
            {t('projects.viewProject')}
            <ArrowUpRight
              size={14}
              className="transition-transform duration-200 ease-out group-hover:-translate-y-px group-hover:translate-x-px motion-reduce:transform-none"
            />
          </Link>
        )}
      </div>
    </article>
  );
};

export default ProjectCard;
