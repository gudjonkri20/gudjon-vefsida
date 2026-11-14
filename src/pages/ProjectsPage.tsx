import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import SEO from '../components/SEO';
import PageHeader from '../components/PageHeader';
import Section from '../components/Section';
import ProjectCard from '../components/ProjectCard';
import ProjectFilter from '../components/ProjectFilter';
import ConstellationCanvas from '../components/ConstellationCanvas';
import ConstellationWatermark from '../components/ConstellationWatermark';
import { SHAPES, CATEGORY_SHAPE } from '../lib/constellationShapes';
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

  /**
   * The header mark answers the filter: pick a category and the constellation
   * settles into that category's shape instead of cycling through all three.
   *
   * Memoised deliberately — a fresh array literal would be a new `shapes`
   * reference on every render and would restart the canvas each time.
   */
  const headerShapes = useMemo(
    () => (filter === 'all' ? SHAPES : [CATEGORY_SHAPE[filter] ?? SHAPES[0]]),
    [filter],
  );

  return (
    <>
      <SEO
        title={t('projects.title')}
        description={t('projects.subtitle')}
        path={localizedHref('/projects', locale)}
      />

      <PageHeader
        eyebrow={t('siteTagline')}
        title={t('projects.title')}
        lede={t('projects.subtitle')}
        aside={
          <ConstellationCanvas
            shapes={headerShapes}
            ariaLabel="A constellation of points showing the shape of the selected project category"
            className="hidden h-[320px] w-[320px] cursor-crosshair lg:block xl:h-[380px] xl:w-[380px]"
          />
        }
      />

      <Section tone="paper" className="relative overflow-hidden">
        <ConstellationWatermark startAt={1} side="right" />
        <div className="border-b border-navy-100 pb-3">
          <ProjectFilter
            active={filter}
            onChange={setFilter}
            available={availableFilters}
          />
        </div>

        <p className="mt-4 font-mono text-xs text-muted" aria-live="polite">
          {filtered.length} / {all.length}
        </p>

        {/*
          Filtering rearranges one grid; it does not swap it for another. Each
          card is keyed by its project, so a card that survives the filter is
          the same element before and after and slides to its new cell. Cards
          that drop out are lifted out of the layout the moment they start to
          fade (popLayout), so the survivors close the gap while the others
          leave instead of waiting for them. No stagger: this is clicked
          often, and a queue would be in the way by the third click.
        */}
        <div className="relative mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {filtered.map((project) => (
              <motion.div
                key={project.slug}
                layout="position"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{
                  opacity: 0,
                  scale: 0.97,
                  transition: { duration: 0.15, ease: 'easeOut' },
                }}
                transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
                className="h-full"
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </Section>
    </>
  );
};

export default ProjectsPage;
