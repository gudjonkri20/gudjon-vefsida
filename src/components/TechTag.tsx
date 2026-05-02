import React from 'react';
import clsx from 'clsx';

interface TechTagProps {
  label: string;
  className?: string;
}

const TechTag: React.FC<TechTagProps> = ({ label, className }) => {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-md border border-slate-700/60 bg-slate-800/50 px-2 py-0.5 font-mono text-xs text-slate-300',
        className,
      )}
    >
      {label}
    </span>
  );
};

export default TechTag;
