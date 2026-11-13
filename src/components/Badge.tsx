import React from 'react';
import clsx from 'clsx';
import type { ProjectStatus } from '../types';

interface BadgeProps {
  status: ProjectStatus;
  label: string;
  /**
   * Set when the badge sits on a navy band. The status colours are tuned for
   * paper; on navy they all use the one brass that reads there.
   */
  onNavy?: boolean;
  className?: string;
}

const ON_NAVY = 'border-brass-400/40 bg-brass-400/10 text-brass-400';

// Status is data, so it is set in mono. Only "public" earns the accent —
// it is the only status a visitor can go and look at.
const statusClasses: Record<ProjectStatus, string> = {
  public: 'text-brass-700 border-brass-500/40 bg-brass-500/10',
  internal: 'text-navy-700 border-navy-200 bg-navy-50',
  research: 'text-navy-700 border-navy-200 bg-navy-50',
  side: 'text-muted border-navy-100 bg-paper-sunken',
};

const Badge: React.FC<BadgeProps> = ({ status, label, onNavy = false, className }) => {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded border px-2 py-0.5 font-mono text-[0.6875rem] uppercase tracking-[0.08em]',
        // One or the other, never both. Passing the navy colours in through
        // className left two text-colour classes on the element and let the
        // stylesheet's order pick: it picked brass-700, which is 3.1:1 on
        // navy at 11px.
        onNavy ? ON_NAVY : statusClasses[status],
        className,
      )}
    >
      {label}
    </span>
  );
};

export default Badge;
