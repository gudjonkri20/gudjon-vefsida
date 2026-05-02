import React from 'react';
import clsx from 'clsx';

interface SectionProps {
  id?: string;
  className?: string;
  bleed?: boolean;
  tone?: 'dark' | 'light' | 'transparent';
  children: React.ReactNode;
}

const toneClasses: Record<NonNullable<SectionProps['tone']>, string> = {
  dark: 'bg-slate-950 text-slate-100',
  light: 'bg-white text-slate-900',
  transparent: '',
};

const Section: React.FC<SectionProps> = ({
  id,
  className,
  bleed = false,
  tone = 'transparent',
  children,
}) => {
  return (
    <section
      id={id}
      className={clsx(
        'w-full',
        toneClasses[tone],
        !bleed && 'py-20 md:py-28',
        className,
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
};

export default Section;
