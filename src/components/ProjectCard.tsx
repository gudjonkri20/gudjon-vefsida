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
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 p-7 transition hover:border-brand-400/40 hover:bg-slate-900/80">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-400/40 to-transparent opacity-0 transition group-hover:opacity-100"
      />

      <div className="flex items-center justify-between gap-3">
        <Badge status={project.status} label={statusLabel} />
        {project.year && (
          <span className="font-mono text-xs text-slate-500">{project.year}</span>
        )}
      </div>

      <h3 className="mt-5 font-display text-xl font-semibold text-white">
        <Link
          to={detailHref}
          className="transition group-hover:text-brand-300"
        >
          {project.title[locale]}
        </Link>
      </h3>

      <p className="mt-2 text-sm text-brand-300">{project.tagline[locale]}</p>

      {!compact && (
        <p className="mt-4 line-clamp-4 text-sm text-slate-400">
          {project.description[locale]}
        </p>
      )}

      <div className="mt-5 flex flex-wrap gap-1.5">
        {techShown.map((tech) => (
          <TechTag key={tech} label={tech} />
        ))}
        {compact && project.tech.length > techShown.length && (
          <span className="font-mono text-xs text-slate-500">
            +{project.tech.length - techShown.length}
          </span>
        )}
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 pt-6">
        {project.link ? (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm font-medium text-brand-300 transition hover:text-brand-200"
          >
            {project.linkLabel?.[locale] ?? t('projects.openLink')}
            <ExternalLink size={14} />
          </a>
        ) : (
          <span className="text-xs text-slate-500">
            {t('projects.availableOnRequest')}
          </span>
        )}

        {project.hasDetailPage && (
          <Link
            to={detailHref}
            className="inline-flex items-center gap-1 text-sm text-slate-400 transition hover:text-white"
          >
            {t('projects.viewProject')}
            <ArrowUpRight size={14} />
          </Link>
        )}
      </div>
    </article>
  );
};

export default ProjectCard;
