import React from 'react';
import clsx from 'clsx';

interface SectionProps {
  id?: string;
  className?: string;
  bleed?: boolean;
  tone?: 'navy' | 'paper' | 'raised' | 'transparent';
  children: React.ReactNode;
}

const toneClasses: Record<NonNullable<SectionProps['tone']>, string> = {
  navy: 'bg-navy-900 text-navy-100',
  paper: 'bg-paper text-muted',
  raised: 'bg-paper-raised text-muted',
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
        !bleed && 'py-16 md:py-24',
        className,
      )}
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">{children}</div>
    </section>
  );
};

export default Section;
