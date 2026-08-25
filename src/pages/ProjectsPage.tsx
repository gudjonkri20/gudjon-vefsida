import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
import PageHeader from '../components/PageHeader';
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
    <>
      <SEO title={t('projects.title')} path={localizedHref('/projects', locale)} />

      <PageHeader
        eyebrow={t('siteTagline')}
        title={t('projects.title')}
        lede={t('projects.subtitle')}
      />

      <Section tone="paper">
        <div className="border-b border-navy-100 pb-3">
          <ProjectFilter
            active={filter}
            onChange={setFilter}
            available={availableFilters}
          />
        </div>

        <p className="mt-4 font-mono text-xs text-muted/70">
          {filtered.length} / {all.length}
        </p>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </Section>
    </>
  );
};

export default ProjectsPage;
