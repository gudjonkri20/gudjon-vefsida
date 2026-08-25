import React from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import type { ProjectCategory } from '../types';

type FilterKey = ProjectCategory | 'all';

interface ProjectFilterProps {
  active: FilterKey;
  onChange: (key: FilterKey) => void;
  available: FilterKey[];
}

const LABEL_KEYS: Record<FilterKey, string> = {
  all: 'projects.filter.all',
  chatbot: 'projects.filter.chatbot',
  mcp: 'projects.filter.mcp',
  ml: 'projects.filter.ml',
  automation: 'projects.filter.automation',
  dashboards: 'projects.filter.dashboards',
  'data-eng': 'projects.filter.dataEng',
  research: 'projects.filter.research',
  side: 'projects.filter.side',
};

const ProjectFilter: React.FC<ProjectFilterProps> = ({
  active,
  onChange,
  available,
}) => {
  const { t } = useTranslation();

  return (
    <div role="tablist" aria-label="Filter projects" className="flex flex-wrap gap-x-6 gap-y-2">
      {available.map((key) => (
        <button
          key={key}
          type="button"
          role="tab"
          aria-selected={active === key}
          onClick={() => onChange(key)}
          className={clsx(
            // Filters read as a line of labels, not a row of pills. The active
            // one is marked with the same brass rule as the nav.
            'relative py-1 font-mono text-xs uppercase tracking-[0.1em] transition-colors',
            active === key
              ? 'text-navy-900 after:absolute after:-bottom-px after:left-0 after:h-[2px] after:w-full after:bg-brass-500'
              : 'text-muted hover:text-navy-900',
          )}
        >
          {t(LABEL_KEYS[key])}
        </button>
      ))}
    </div>
  );
};

export default ProjectFilter;
