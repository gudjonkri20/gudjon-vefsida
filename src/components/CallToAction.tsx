import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import clsx from 'clsx';

type Variant = 'primary' | 'secondary' | 'ghost';

interface CallToActionProps {
  to?: string;
  href?: string;
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
  withArrow?: boolean;
  external?: boolean;
}

const variants: Record<Variant, string> = {
  primary:
    'bg-brand-400 text-slate-950 hover:bg-brand-300 shadow-glow hover:shadow-[0_0_40px_8px_rgba(34,211,238,0.35)]',
  secondary:
    'border border-slate-600 bg-slate-900/40 text-white hover:border-brand-400/60 hover:text-brand-300',
  ghost: 'text-brand-300 hover:text-brand-200',
};

const CallToAction: React.FC<CallToActionProps> = ({
  to,
  href,
  variant = 'primary',
  children,
  className,
  withArrow = false,
  external = false,
}) => {
  const classes = clsx(
    'group inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all',
    variants[variant],
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
        {...(external
          ? { target: '_blank', rel: 'noopener noreferrer' }
          : {})}
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
