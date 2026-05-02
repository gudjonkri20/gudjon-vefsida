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
    <div
      role="tablist"
      aria-label="Filter projects"
      className="flex flex-wrap gap-2"
    >
      {available.map((key) => (
        <button
          key={key}
          type="button"
          role="tab"
          aria-selected={active === key}
          onClick={() => onChange(key)}
          className={clsx(
            'rounded-full border px-3.5 py-1.5 text-sm transition',
            active === key
              ? 'border-brand-400/50 bg-brand-400/15 text-brand-200'
              : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700 hover:text-white',
          )}
        >
          {t(LABEL_KEYS[key])}
        </button>
      ))}
    </div>
  );
};

export default ProjectFilter;
