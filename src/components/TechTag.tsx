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
        'inline-flex items-center rounded border border-navy-100 bg-paper px-1.5 py-0.5 font-mono text-[0.6875rem] text-muted',
        className,
      )}
    >
      {label}
    </span>
  );
};

export default TechTag;
