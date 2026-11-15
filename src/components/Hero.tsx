import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowUp, ArrowUpRight, MessageCircle } from 'lucide-react';
import clsx from 'clsx';
import Band from './Band';
import CallToAction from './CallToAction';
import ConstellationCanvas from './ConstellationCanvas';
import { HERO_SHAPES } from '../lib/constellationShapes';
import { getAllProjects } from '../lib/projects';
import { useCurrentLocale, localizedHref } from '../lib/i18n';
import { useMediaQuery, WIDE } from '../lib/useMediaQuery';
import { askAssistant, useAssistantOnline } from '../lib/useAssistantOnline';

// Real counts, kept as one mono line rather than three oversized stat tiles.
const INDEX = [
  { value: 14, key: 'production' },
  { value: 4, key: 'mcp' },
  { value: 3, key: 'chatbots' },
] as const;

const EASE = [0.22, 1, 0.36, 1] as const;

/** How long the hero mark holds a shape before moving on to the next. */
const MARK_HOLD_MS = 5000;

/**
 * The things a visitor can go and use right now: public projects with a live
 * address. Read from the project data, so it stays true as that changes.
 */
const LIVE = getAllProjects()
  .filter((p) => p.status === 'public' && p.link)
  .map((p) => ({
    slug: p.slug,
    href: p.link as string,
    host: new URL(p.link as string).hostname.replace(/^www\./, ''),
  }));

/**
 * Ask his AI, from the first screen.
 *
 * The site belongs to someone who builds assistants, and it has one running:
 * until now behind a button in the corner. This puts it where the claim is
 * made. The field shows a real question, and sending it empty asks exactly
 * that question, so trying it costs one click and no thought.
 *
 * It hands the question to ChatWidget through a window event rather than
 * shared state: the two sit in different parts of the tree and nothing else
 * needs to know.
 */
const AskBar: React.FC = () => {
  const { t } = useTranslation();
  const reduce = useReducedMotion();
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);
  const [index, setIndex] = useState(0);

  const suggestions = t('chat.suggestions', { returnObjects: true }) as unknown as string[];
  const example = suggestions[index % suggestions.length] ?? '';

  // Rotate the example while the field is idle. It stops the moment someone
  // focuses or types, so the text is never changing under a reader's cursor.
  useEffect(() => {
    if (reduce || focused || value) return;
    const id = window.setInterval(() => setIndex((i) => i + 1), 3600);
    return () => window.clearInterval(id);
  }, [reduce, focused, value]);

  // While this bar is on screen it is the way to ask, so the floating
  // launcher steps aside: two "ask" controls on one screen is one too many.
  // "On screen" needs both tests. The band pins, so the bar keeps
  // intersecting the viewport after the page has slid over it; the band's
  // own progress says when it has actually been covered.
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    const form = formRef.current;
    if (!form) return;

    let inView = false;
    let coveredBy = 0;
    const publish = () =>
      window.dispatchEvent(
        new CustomEvent<boolean>('gk:askbar', { detail: inView && coveredBy < 0.3 }),
      );

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        publish();
      },
      { threshold: 0.6 },
    );
    observer.observe(form);

    const band = form.closest('[data-band]');
    const onProgress = (e: Event) => {
      coveredBy = (e as CustomEvent<number>).detail;
      publish();
    };
    band?.addEventListener('bandprogress', onProgress);

    return () => {
      observer.disconnect();
      band?.removeEventListener('bandprogress', onProgress);
      window.dispatchEvent(new CustomEvent<boolean>('gk:askbar', { detail: false }));
    };
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const question = value.trim() || example;
    if (!question) return;
    askAssistant(question);
    setValue('');
  };

  return (
    <form
      ref={formRef}
      onSubmit={submit}
      role="search"
      className="flex h-[3.25rem] max-w-xl items-center gap-3 rounded-md border border-white/15 bg-white/[0.04] pl-4 pr-1 transition-colors duration-150 focus-within:border-brass-400/70 focus-within:bg-white/[0.07]"
    >
      <MessageCircle size={17} className="flex-none text-brass-400" aria-hidden />
      <div className="relative min-w-0 flex-1 self-stretch">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          aria-label={t('chat.title')}
          enterKeyHint="send"
          autoComplete="off"
          className="h-full w-full bg-transparent text-base text-white focus:outline-none md:text-[0.9375rem]"
        />
        {/* The example stands in for a placeholder so it can cross-fade. */}
        {!value && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex items-center overflow-hidden"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={example}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2, ease: EASE }}
                className="truncate text-base text-navy-200 md:text-[0.9375rem]"
              >
                {/* The label is dropped on a phone: at 390px it left room for
                    only half of the question it introduces. */}
                <span className="mr-2 hidden font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-brass-400 sm:inline">
                  {t('chat.title')}
                </span>
                {example}
              </motion.span>
            </AnimatePresence>
          </span>
        )}
      </div>
      <button
        type="submit"
        aria-label={t('chat.send')}
        className="press grid h-11 w-11 flex-none place-items-center rounded bg-white/10 text-white hover:bg-brass-500 hover:text-navy-950 active:bg-brass-500 active:text-navy-950"
      >
        <ArrowUp size={17} />
      </button>
    </form>
  );
};

const Hero: React.FC = () => {
  const { t } = useTranslation();
  const locale = useCurrentLocale();
  const reduce = useReducedMotion();
  const wide = useMediaQuery(WIDE);
  const assistantOnline = useAssistantOnline();
  const slotRef = useRef<HTMLDivElement>(null);

  // Which shape the mark is holding. It moves on by itself every few
  // seconds; a visitor can also pick one (the dots under it) or click the
  // mark to step on. A pick restarts the timer, so a shape someone chose is
  // not swapped out from under them a moment later. With reduced motion it
  // never moves on its own — only when asked.
  const marks = t('hero.marks', { returnObjects: true }) as unknown as string[];
  const [mark, setMark] = useState(0);
  const [picks, setPicks] = useState(0);
  const pick = (i: number) => {
    setMark(((i % HERO_SHAPES.length) + HERO_SHAPES.length) % HERO_SHAPES.length);
    setPicks((n) => n + 1);
  };
  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(
      () => setMark((m) => (m + 1) % HERO_SHAPES.length),
      MARK_HOLD_MS,
    );
    return () => window.clearInterval(id);
  }, [reduce, picks]);

  const headline = t('hero.headline');

  const item = reduce
    ? { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } }
    : {
        hidden: { opacity: 0, y: 16 },
        show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
      };

  const container = reduce
    ? { hidden: {}, show: {} }
    : {
        hidden: { opacity: 1 },
        show: { opacity: 1, transition: { staggerChildren: 0.09 } },
      };

  // The headline is the lead, so it gets the one treatment nothing else has:
  // each word rises out from behind its own baseline, 70ms apart. Everything
  // after it is support and only fades up.
  const words = reduce
    ? { hidden: {}, show: {} }
    : { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
  const word = reduce
    ? { hidden: { y: 0 }, show: { y: 0 } }
    : {
        hidden: { y: '115%' },
        show: { y: 0, transition: { duration: 0.8, ease: EASE } },
      };

  return (
    <Band as="section" className="bg-navy-900 text-white">
      {/*
        A stage, not a strip: from `lg` up the band is the full height of the
        window under the masthead, so the first screen is one composed thing
        and the next section starts exactly at the fold.

        data-constellation-scope: the field sits behind the text, so the
        pointer is read here, anywhere in the hero, instead of on the canvas.
      */}
      <div
        data-constellation-scope
        className="relative lg:flex lg:min-h-[calc(100svh-65px)] lg:flex-col lg:justify-center"
      >
        {/*
          The signature, as a field. The canvas covers the whole band; the
          shape itself is drawn inside the slot in the right-hand column (see
          below). On arrival the points are scattered across the band and
          gather into his initials. As the page slides over the band they let
          go and drift back out, and re-form if you scroll back up. A few
          faint stars never join the shape and just keep the navy from being
          empty.
        */}
        <ConstellationCanvas
          shapes={HERO_SHAPES}
          shapeSlot={slotRef}
          active={mark}
          ariaLabel="Guðjón Kristjánsson — a constellation that forms his initials, the coastline of Iceland, a neural network, a speech bubble and a bar chart"
          pointCount={wide ? 260 : undefined}
          linkDistance={wide ? 34 : 24}
          cursorRadius={wide ? 130 : 90}
          className="pointer-events-none absolute inset-0"
        />

        <div className="relative mx-auto w-full max-w-6xl px-5 pb-16 pt-16 sm:px-8 md:pb-20 md:pt-20 lg:py-16">
          <motion.div initial="hidden" animate="show" variants={container}>
            <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-x-12">
              <div>
                <motion.p variants={item} className="eyebrow-on-navy">
                  {t('hero.eyebrow')}
                </motion.p>

                <motion.h1
                  variants={words}
                  aria-label={headline}
                  className="mt-6 max-w-4xl text-balance font-display text-[clamp(2.5rem,7vw,4.75rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-white"
                >
                  {headline.split(' ').map((w, i) => (
                    <React.Fragment key={`${w}-${i}`}>
                      {/* The mask. The padding and matching negative margin
                          keep descenders from being clipped without moving
                          the baseline or the line height. */}
                      <span
                        aria-hidden="true"
                        className="-mx-[0.04em] -mb-[0.14em] inline-block overflow-hidden px-[0.04em] pb-[0.14em] align-bottom"
                      >
                        <motion.span variants={word} className="inline-block">
                          {w}
                        </motion.span>
                      </span>{' '}
                    </React.Fragment>
                  ))}
                </motion.h1>

                <motion.p
                  variants={item}
                  className="mt-7 max-w-prose font-serif text-lg leading-relaxed text-navy-100 sm:text-xl"
                >
                  {t('hero.subline')}
                </motion.p>

                <motion.div variants={item} className="mt-9 flex flex-wrap gap-3">
                  <CallToAction
                    to={localizedHref('/projects', locale)}
                    variant="primary"
                    onNavy
                    withArrow
                  >
                    {t('hero.ctaPrimary')}
                  </CallToAction>
                  <CallToAction
                    to={localizedHref('/contact', locale)}
                    variant="secondary"
                    onNavy
                  >
                    {t('hero.ctaSecondary')}
                  </CallToAction>
                </motion.div>

                {/* The row keeps its height whether or not the bar is shown,
                    so the hero does not jump when the status arrives. */}
                <motion.div variants={item} className="mt-6 min-h-[3.25rem]">
                  {assistantOnline && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <AskBar />
                    </motion.div>
                  )}
                </motion.div>
              </div>

              {/*
                The slot: an empty box that only says where the shape goes.
                On a phone it is kept narrow and nudged left, because shapes
                are centred in the box and the mark should sit on the same
                edge as the text above it. The numbers are set by the widest
                shape: Iceland fills 86% of the box, so at 224px with a 16px
                pull its west coast lands on the text edge and stays on
                screen. (A wider box with a bigger pull, which suited the
                narrower shapes, ran the Westfjords off the side.)
              */}
              <motion.div variants={item} className="mt-10 lg:mt-0">
                {/* Clicking the mark steps to the next shape. Pointer only:
                    the dots below are the same control for keyboards and
                    screen readers. */}
                <div
                  ref={slotRef}
                  aria-hidden="true"
                  onClick={() => pick(mark + 1)}
                  className="-ml-4 h-[180px] w-[224px] cursor-pointer sm:h-[200px] sm:w-[248px] lg:ml-0 lg:h-[340px] lg:w-[340px] xl:h-[440px] xl:w-[440px]"
                />

                {/*
                  The caption. Without it the mark reads as a screensaver;
                  with it, as five things he chose to say about himself. It
                  is also the mark's controls: each dot jumps to its shape.
                */}
                <div className="mt-3 flex items-center gap-3 lg:justify-center">
                  {/* 44px wide on touch screens, 28px beside a pointer; the
                      negative margin puts the first visible dot on the text
                      edge either way. */}
                  <div
                    role="group"
                    aria-label={t('hero.marksLabel')}
                    className="-ml-[19px] flex lg:-ml-[11px]"
                  >
                    {HERO_SHAPES.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => pick(i)}
                        aria-label={marks[i]}
                        aria-pressed={i === mark}
                        className="group grid h-11 w-11 place-items-center lg:w-7"
                      >
                        <span
                          className={clsx(
                            'block h-1.5 rounded-full transition-[width,background-color] duration-300',
                            i === mark
                              ? 'w-4 bg-brass-400'
                              : 'w-1.5 bg-white/25 group-hover:bg-white/60',
                          )}
                        />
                      </button>
                    ))}
                  </div>
                  <p className="min-w-0 font-mono text-xs text-navy-200" aria-live="polite">
                    <span className="text-brass-400">
                      {String(mark + 1).padStart(2, '0')}
                    </span>{' '}
                    / {String(HERO_SHAPES.length).padStart(2, '0')}
                    <span className="ml-2 uppercase tracking-[0.12em] text-white/80">
                      {marks[mark]}
                    </span>
                  </p>
                </div>
              </motion.div>
            </div>

            {/*
              The proof line. Counts on the left; on the right, the systems
              a visitor can open in another tab and use this minute.
            */}
            <motion.div
              variants={item}
              className="rule-on-navy mt-10 flex flex-col gap-x-10 gap-y-4 pt-6 font-mono text-xs text-navy-200 lg:mt-14 lg:flex-row lg:items-center lg:justify-between"
            >
              <ul className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-7">
                {INDEX.map(({ value, key }) => (
                  <li key={key}>
                    <span className="text-brass-400">{value}</span>{' '}
                    {t(`hero.stats.${key}`)}
                  </li>
                ))}
              </ul>

              {LIVE.length > 0 && (
                <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
                  <span className="inline-flex basis-full items-center gap-2 uppercase tracking-[0.12em] text-brass-400 sm:basis-auto">
                    {/* A steady dot, not a pulsing one: "live" is a fact
                        about these systems, not an alert. */}
                    <span className="h-1.5 w-1.5 rounded-full bg-brass-400" aria-hidden />
                    {t('hero.live')}
                  </span>
                  {LIVE.map(({ slug, href, host }) => (
                    <a
                      key={slug}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex min-h-11 items-center gap-1 text-white transition-colors hover:text-brass-400"
                    >
                      {host}
                      <ArrowUpRight
                        size={13}
                        className="text-navy-200 transition-[color,transform] duration-200 group-hover:-translate-y-px group-hover:translate-x-px group-hover:text-brass-400"
                      />
                    </a>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </Band>
  );
};

export default Hero;
