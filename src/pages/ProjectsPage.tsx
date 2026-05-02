import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
import Section from '../components/Section';
import ProjectCard from '../components/ProjectCard';
import ProjectFilter from '../components/ProjectFilter';
import { getAllProjects } from '../lib/projects';
import type { ProjectCategory } from '../types';
import { useCurrentLocale, localizedHref } from '../lib/i18n';

type FilterKey = ProjectCategory | 'all';

const ProjectsPage: React.FC = () => {
  const { t } = useTranslation();
  const locale = useCurrentLocale();
  const [filter, setFilter] = useState<FilterKey>('all');

  const all = useMemo(() => getAllProjects(), []);

  const availableFilters = useMemo<FilterKey[]>(() => {
    const set = new Set<FilterKey>(['all']);
    all.forEach((p) => set.add(p.category));
    const ordered: FilterKey[] = [
      'all',
      'chatbot',
      'mcp',
      'ml',
      'automation',
      'dashboards',
      'data-eng',
      'research',
      'side',
    ];
    return ordered.filter((k) => set.has(k));
  }, [all]);

  const filtered = useMemo(() => {
    if (filter === 'all') return all;
    return all.filter((p) => p.category === filter);
  }, [filter, all]);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <SEO title={t('projects.title')} path={localizedHref('/projects', locale)} />

      <Section tone="dark">
        <div className="max-w-3xl pt-12">
          <h1 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">
            {t('projects.title')}
          </h1>
          <p className="mt-5 text-lg text-slate-400">{t('projects.subtitle')}</p>
        </div>

        <div className="mt-10">
          <ProjectFilter
            active={filter}
            onChange={setFilter}
            available={availableFilters}
          />
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </Section>
    </div>
  );
};

export default ProjectsPage;
