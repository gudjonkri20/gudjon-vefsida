import React from 'react';

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  lede?: string;
  /**
   * Optional visual for the right-hand column. When omitted the header keeps
   * its original single-column layout, so existing callers are unchanged.
   */
  aside?: React.ReactNode;
  children?: React.ReactNode;
}

/**
 * The navy band every interior page opens with. Keeps the home page's
 * navy-then-paper rhythm consistent across the site, and means the four
 * interior pages no longer each carry their own header markup.
 */
const PageHeader: React.FC<PageHeaderProps> = ({
  eyebrow,
  title,
  lede,
  aside,
  children,
}) => {
  const text = (
    <>
      {eyebrow && <p className="eyebrow-on-navy">{eyebrow}</p>}
      <h1 className="mt-4 max-w-3xl text-balance font-display text-[clamp(2rem,4.5vw,3.25rem)] font-semibold leading-[1.06] tracking-[-0.025em] text-white">
        {title}
      </h1>
      {lede && (
        <p className="mt-5 max-w-prose font-serif text-lg leading-relaxed text-navy-100">
          {lede}
        </p>
      )}
      {children}
    </>
  );

  return (
    <header className="bg-navy-900 text-white">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 md:py-20">
        {aside ? (
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_auto]">
            <div>{text}</div>
            {aside}
          </div>
        ) : (
          text
        )}
      </div>
    </header>
  );
};

export default PageHeader;
