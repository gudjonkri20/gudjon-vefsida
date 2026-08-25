import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import clsx from 'clsx';

type Variant = 'primary' | 'secondary' | 'ghost';

interface CallToActionProps {
  to?: string;
  href?: string;
  variant?: Variant;
  /** Set when the button sits on a navy band — inverts the palette. */
  onNavy?: boolean;
  children: React.ReactNode;
  className?: string;
  withArrow?: boolean;
  external?: boolean;
}

// Squared, not pill-shaped: this is a working site, not a signup funnel.
const variants: Record<string, string> = {
  primary: 'bg-navy-900 text-white hover:bg-navy-800',
  'primary-navy': 'bg-brass-500 text-navy-950 hover:bg-brass-400',
  secondary:
    'border border-navy-200 bg-white text-navy-900 hover:border-navy-600 hover:bg-navy-50',
  'secondary-navy':
    'border border-white/25 bg-transparent text-white hover:border-brass-400 hover:text-brass-400',
  ghost: 'text-brass-700 hover:text-navy-900',
  'ghost-navy': 'text-brass-400 hover:text-white',
};

const CallToAction: React.FC<CallToActionProps> = ({
  to,
  href,
  variant = 'primary',
  onNavy = false,
  children,
  className,
  withArrow = false,
  external = false,
}) => {
  const key = onNavy ? `${variant}-navy` : variant;
  const isGhost = variant === 'ghost';

  const classes = clsx(
    'group inline-flex items-center gap-2 rounded-md text-sm font-medium transition-colors',
    !isGhost && 'px-5 py-2.5',
    variants[key],
    className,
  );

  const content = (
    <>
      {children}
      {withArrow && (
        <ArrowRight
          size={16}
          className="transition-transform group-hover:translate-x-0.5"
        />
      )}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {content}
      </a>
    );
  }

  return (
    <Link to={to ?? '#'} className={classes}>
      {content}
    </Link>
  );
};

export default CallToAction;
