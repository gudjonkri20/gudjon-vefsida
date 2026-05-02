import React from 'react';
import clsx from 'clsx';
import type { ProjectStatus } from '../types';

interface BadgeProps {
  status: ProjectStatus;
  label: string;
  className?: string;
}

const statusClasses: Record<ProjectStatus, string> = {
  public: 'bg-brand-400/15 text-brand-300 border-brand-400/30',
  internal: 'bg-accent-400/15 text-accent-400 border-accent-400/30',
  research: 'bg-amber-400/15 text-amber-300 border-amber-400/30',
  side: 'bg-slate-400/15 text-slate-300 border-slate-400/30',
};

const Badge: React.FC<BadgeProps> = ({ status, label, className }) => {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium tracking-wide',
        statusClasses[status],
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
      {label}
    </span>
  );
};

export default Badge;
