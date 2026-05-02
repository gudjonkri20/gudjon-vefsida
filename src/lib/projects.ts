import { projects } from '../data/projects';
import type { Project, ProjectCategory, ProjectStatus } from '../types';

export function getAllProjects(): Project[] {
  return projects;
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.isFeatured);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function filterProjects(opts: {
  category?: ProjectCategory | 'all';
  status?: ProjectStatus | 'all';
}): Project[] {
  return projects.filter((p) => {
    if (opts.category && opts.category !== 'all' && p.category !== opts.category) {
      return false;
    }
    if (opts.status && opts.status !== 'all' && p.status !== opts.status) {
      return false;
    }
    return true;
  });
}

export const projectCategories: { key: ProjectCategory | 'all'; labelKey: string }[] = [
  { key: 'all', labelKey: 'projects.filter.all' },
  { key: 'chatbot', labelKey: 'projects.filter.chatbot' },
  { key: 'mcp', labelKey: 'projects.filter.mcp' },
  { key: 'ml', labelKey: 'projects.filter.ml' },
  { key: 'automation', labelKey: 'projects.filter.automation' },
  { key: 'dashboards', labelKey: 'projects.filter.dashboards' },
  { key: 'data-eng', labelKey: 'projects.filter.dataEng' },
  { key: 'research', labelKey: 'projects.filter.research' },
  { key: 'side', labelKey: 'projects.filter.side' },
];
