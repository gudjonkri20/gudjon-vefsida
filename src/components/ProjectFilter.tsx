import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
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
    // A group of toggle buttons, not a tablist: there are no tab panels and no
    // arrow-key roving, so announcing "tab 1 of 9" promised behaviour that
    // was not there. gap-y-5 keeps wrapped rows 44px apart, which is what the
    // enlarged hit areas below need in order not to overlap.
    <div role="group" aria-label="Filter projects" className="flex flex-wrap gap-x-6 gap-y-5">
      {available.map((key) => (
        <button
          key={key}
          type="button"
          aria-pressed={active === key}
          onClick={() => onChange(key)}
          className={clsx(
            // Filters read as a line of labels, not a row of pills. The active
            // one is marked with the same brass rule as the nav. The label
            // stays 24px tall; the ::before box makes the target 44px.
            "relative py-1 font-mono text-xs uppercase tracking-[0.1em] transition-colors before:absolute before:-inset-x-3 before:-inset-y-2.5 before:content-['']",
            active === key ? 'text-navy-900' : 'text-muted hover:text-navy-900',
          )}
        >
          {t(LABEL_KEYS[key])}
          {/* The same travelling marker as the nav, a touch quicker because a
              filter is clicked more often than a page is changed. */}
          {active === key && (
            <motion.span
              layoutId="filter-marker"
              aria-hidden="true"
              className="absolute -bottom-px left-0 h-[2px] w-full bg-brass-500"
              transition={{ type: 'spring', bounce: 0, duration: 0.25 }}
            />
          )}
        </button>
      ))}
    </div>
  );
};

export default ProjectFilter;
