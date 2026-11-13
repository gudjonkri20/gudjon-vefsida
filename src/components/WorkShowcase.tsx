import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, ExternalLink } from 'lucide-react';
import clsx from 'clsx';
import Badge from './Badge';
import TechTag from './TechTag';
import ConstellationCanvas from './ConstellationCanvas';
import { CATEGORY_SHAPE } from '../lib/constellationShapes';
import type { Project } from '../types';
import { useCurrentLocale, localizedHref } from '../lib/i18n';

/**
 * Selected work as a sequence rather than a grid.
 *
 * A grid of five small cards asks the visitor to compare thumbnails. This
 * walks them through the work instead: one project in focus at a time, with
 * room for its full description, while a panel pinned beside it shows the
 * site's mark re-forming into that project's shape — a speech bubble for a
 * chatbot, a network for an MCP server, a brain for the forecasting model.
 *
 * It is ordinary scrolling. Nothing is hijacked or snapped: the panel is
 * `position: sticky`, and which project is "in focus" is simply whichever one
 * is crossing a line a little below the middle of the window.
 *
 * Wide screens only. Below `lg` the home page shows the same projects as a
 * swipeable row, because a pinned panel needs a second column to live in.
 */

const CATEGORY_LABEL: Record<string, string> = {
  chatbot: 'projects.filter.chatbot',
  mcp: 'projects.filter.mcp',
  ml: 'projects.filter.ml',
  automation: 'projects.filter.automation',
  dashboards: 'projects.filter.dashboards',
  'data-eng': 'projects.filter.dataEng',
  research: 'projects.filter.research',
  side: 'projects.filter.side',
};

const pad = (n: number) => String(n).padStart(2, '0');

interface WorkShowcaseProps {
  projects: Project[];
  /** How many projects exist in all, for the "5 / 14" at the end. */
  total: number;
}

const WorkShowcase: React.FC<WorkShowcaseProps> = ({ projects, total }) => {
  const { t } = useTranslation();
  const locale = useCurrentLocale();
  const [active, setActive] = useState(0);
  const items = useRef<Array<HTMLLIElement | null>>([]);

  // Memoised: a fresh array would be a new `shapes` prop on every render and
  // would rebuild the canvas each time the focus moved.
  const shapes = useMemo(
    () => projects.map((p) => CATEGORY_SHAPE[p.category] ?? CATEGORY_SHAPE.ml),
    [projects],
  );

  useEffect(() => {
    // A zero-height band 55% of the way down the window. A project is in
    // focus from the moment its top crosses that line until the next one
    // does, so by the time its first lines reach the middle of the screen it
    // is already the lit one.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(Number((entry.target as HTMLElement).dataset.index));
          }
        }
      },
      { rootMargin: '-55% 0px -45% 0px', threshold: 0 },
    );
    items.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [projects]);

  const current = projects[active] ?? projects[0];

  return (
    <div className="mt-12 grid grid-cols-[minmax(0,5fr)_minmax(0,6fr)] gap-x-16 xl:gap-x-24">
      {/*
        The pinned panel. Navy, because navy is where the mark lives on this
        site. It repeats nothing a screen reader needs — the category, the
        position in the list and the mark are all a mirror of the project in
        focus — so it is hidden from them.
      */}
      <div className="sticky top-24 self-start" aria-hidden="true">
        <div
          data-constellation-scope
          className="rounded-lg bg-navy-900 p-7 text-white shadow-card-hover xl:p-9"
        >
          <div className="flex items-baseline justify-between gap-4 font-mono text-xs">
            <span className="uppercase tracking-[0.12em] text-brass-400">
              {t(CATEGORY_LABEL[current.category] ?? 'projects.filter.all')}
            </span>
            <span className="text-navy-200">
              <span className="text-white">{pad(active + 1)}</span> / {pad(projects.length)}
            </span>
          </div>

          {/*
            Controlled: it holds the shape of the project in focus, and when
            the focus moves the points are carried to the new shape by the
            same springs that hold them in place. No timer, no cross-fade —
            one set of points that rearranges.
          */}
          <ConstellationCanvas
            shapes={shapes}
            active={active}
            pointCount={210}
            linkDistance={30}
            cursorRadius={90}
            className="mx-auto mt-5 aspect-square w-full max-w-[400px] cursor-crosshair"
          />

          {/* Where you are in the sequence. */}
          <div className="mt-5 flex gap-1.5">
            {projects.map((p, i) => (
              <span
                key={p.slug}
                className={clsx(
                  'h-0.5 flex-1 rounded-full transition-colors duration-300',
                  i === active ? 'bg-brass-400' : 'bg-white/15',
                )}
              />
            ))}
          </div>
        </div>
      </div>

      <div>
        <ol>
          {projects.map((project, i) => (
            <li
              key={project.slug}
              ref={(el) => {
                items.current[i] = el;
              }}
              data-index={i}
              className={clsx(
                // Out of focus is set back, not hidden: still readable, and
                // not dimmed at all for anyone who has asked for more contrast.
                'flex min-h-[58vh] flex-col justify-center border-t border-navy-100 py-12 transition-opacity duration-300 first:border-t-0 first:pt-2 contrast-more:opacity-100',
                i === active ? 'opacity-100' : 'opacity-50',
              )}
            >
              <div className="flex flex-wrap items-center gap-3">
                <Badge
                  status={project.status}
                  label={t(`projects.status.${project.status}`)}
                />
                {project.year && (
                  <span className="font-mono text-xs text-muted">{project.year}</span>
                )}
              </div>

              <h3 className="mt-5 font-display text-3xl font-semibold leading-tight tracking-[-0.02em] xl:text-4xl">
                <Link
                  to={localizedHref(`/projects/${project.slug}`, locale)}
                  className="transition-colors hover:text-brass-700"
                >
                  {project.title[locale]}
                </Link>
              </h3>

              <p className="mt-3 text-lg text-navy-700">{project.tagline[locale]}</p>

              <p className="mt-5 max-w-prose font-serif text-[1.0625rem] leading-relaxed text-muted">
                {project.description[locale]}
              </p>

              <div className="mt-6 flex flex-wrap gap-1.5">
                {project.tech.map((tech) => (
                  <TechTag key={tech} label={tech} />
                ))}
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-x-8">
                {project.hasDetailPage && (
                  <Link
                    to={localizedHref(`/projects/${project.slug}`, locale)}
                    // The label alone is "Read more"; name the project for
                    // anyone hearing the links out of context.
                    aria-label={`${t('projects.viewProject')}: ${project.title[locale]}`}
                    className="group inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-navy-900 transition-colors hover:text-brass-700"
                  >
                    {t('projects.viewProject')}
                    <ArrowRight
                      size={14}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </Link>
                )}
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-brass-700 transition-colors hover:text-navy-900"
                  >
                    {project.linkLabel?.[locale] ?? t('projects.openLink')}
                    <ExternalLink size={13} />
                  </a>
                )}
              </div>
            </li>
          ))}
        </ol>

        {/* The way on, counted the way the projects page counts. */}
        {projects.length < total && (
          <Link
            to={localizedHref('/projects', locale)}
            className="group mt-2 flex items-center justify-between gap-6 rounded-lg border border-dashed border-navy-200 p-6 transition-colors duration-100 hover:border-brass-500/70 hover:bg-paper-raised active:border-brass-500/70 active:bg-paper-sunken"
          >
            <span className="inline-flex items-center gap-2 font-display text-lg font-semibold tracking-[-0.01em] text-navy-900">
              {t('home.viewAll')}
              <ArrowRight
                size={18}
                className="text-brass-600 transition-transform group-hover:translate-x-0.5"
              />
            </span>
            <span className="font-mono text-xs text-muted">
              {projects.length} / {total}
            </span>
          </Link>
        )}
      </div>
    </div>
  );
};

export default WorkShowcase;
