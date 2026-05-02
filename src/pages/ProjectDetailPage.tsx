import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import SEO from '../components/SEO';
import Section from '../components/Section';
import Badge from '../components/Badge';
import TechTag from '../components/TechTag';
import NotFoundPage from './NotFoundPage';
import { getProjectBySlug } from '../lib/projects';
import { useCurrentLocale, localizedHref } from '../lib/i18n';

const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  const locale = useCurrentLocale();

  const project = slug ? getProjectBySlug(slug) : undefined;

  if (!project) {
    return <NotFoundPage />;
  }

  const statusLabel = t(`projects.status.${project.status}`);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <SEO
        title={project.title[locale]}
        description={project.tagline[locale]}
        path={localizedHref(`/projects/${project.slug}`, locale)}
      />

      <Section tone="dark">
        <Link
          to={localizedHref('/projects', locale)}
          className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          {t('projectDetail.back')}
        </Link>

        <div className="mt-8 max-w-3xl">
          <Badge status={project.status} label={statusLabel} />
          <h1 className="mt-5 font-display text-4xl font-semibold tracking-tight text-white md:text-5xl">
            {project.title[locale]}
          </h1>
          <p className="mt-4 text-xl text-brand-300">{project.tagline[locale]}</p>
          <p className="mt-6 text-lg text-slate-300">{project.description[locale]}</p>

          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-400 px-5 py-2.5 text-sm font-medium text-slate-950 shadow-glow transition hover:bg-brand-300"
            >
              {project.linkLabel?.[locale] ?? t('projects.openLink')}
              <ExternalLink size={16} />
            </a>
          )}

          <div className="mt-12 grid grid-cols-1 gap-8 border-t border-slate-800 pt-8 sm:grid-cols-2">
            <div>
              <div className="text-xs uppercase tracking-wider text-slate-500">
                {t('projectDetail.stack')}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.tech.map((tech) => (
                  <TechTag key={tech} label={tech} />
                ))}
              </div>
            </div>
            {project.year && (
              <div>
                <div className="text-xs uppercase tracking-wider text-slate-500">
                  {t('projectDetail.year')}
                </div>
                <div className="mt-3 font-mono text-2xl text-white">
                  {project.year}
                </div>
              </div>
            )}
          </div>

          <div className="mt-12 rounded-xl border border-slate-800 bg-slate-900/40 p-6 text-sm text-slate-400">
            {t('projectDetail.comingSoon')}
          </div>
        </div>
      </Section>
    </div>
  );
};

export default ProjectDetailPage;
