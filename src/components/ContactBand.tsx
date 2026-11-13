import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useInView } from 'framer-motion';
import { Mail, Phone, Linkedin, Github } from 'lucide-react';
import Section from './Section';
import Waveform from './Waveform';
import { useCurrentLocale, localizedHref } from '../lib/i18n';

/**
 * Where each syllable's burst sits across the waveform, as a percentage.
 * These mirror SYLLABLES in Waveform.tsx: the wave is his name, said aloud.
 */
const SYLLABLES = [
  { text: 'Guð', at: 9 },
  { text: 'jón', at: 25 },
  { text: 'Krist', at: 50 },
  { text: 'jáns', at: 68 },
  { text: 'son', at: 85 },
] as const;

/**
 * The sign-off. The waveform has always been the site's mark, and it is not
 * decoration: its five bursts are the five syllables of his name, weighted
 * for Icelandic first-syllable stress, by someone whose thesis was on
 * Icelandic speech recognition. Until now nothing on the site said so.
 *
 * Here it draws itself once, when it first comes into view, with the
 * syllables written under their bursts — a signature at the bottom of the
 * page, in the one medium that is specifically his.
 */
const Signature: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.6 });

  return (
    <div ref={ref} aria-hidden="true" className="mb-10 max-w-xl">
      <div className="text-brass-400">
        {/* Mounted on first sight, so the draw-on plays then and only then. */}
        {seen ? <Waveform variant="mark" animate /> : <div className="h-16 sm:h-20" />}
      </div>
      <div className="relative mt-1 h-4 font-mono text-[0.6875rem] tracking-[0.08em] text-navy-200">
        {SYLLABLES.map(({ text, at }) => (
          <span
            key={text}
            className="absolute -translate-x-1/2"
            style={{ left: `${at}%` }}
          >
            {text}
          </span>
        ))}
      </div>
    </div>
  );
};

/** The closing band: the signature, then every way to reach him. */
const ContactBand: React.FC = () => {
  const { t } = useTranslation();
  const locale = useCurrentLocale();

  return (
    <Section tone="navy">
      <Signature />

      <h2 className="max-w-2xl font-display text-3xl font-semibold tracking-[-0.02em] text-white md:text-4xl">
        {t('about.contactCta.title')}
      </h2>
      <p className="mt-3 max-w-prose font-serif text-lg leading-relaxed text-navy-100">
        {t('about.contactCta.body')}
      </p>

      {/* Each link is a 44px row so it can be hit with a thumb. */}
      <div className="mt-5 flex flex-wrap gap-x-8 text-sm [&>a]:min-h-11">
        <a
          href="mailto:gudjonk6@gmail.com"
          className="inline-flex items-center gap-2 text-brass-400 transition-colors hover:text-white"
        >
          <Mail size={15} />
          gudjonk6@gmail.com
        </a>
        <a
          href="tel:+3548654146"
          className="inline-flex items-center gap-2 text-white transition-colors hover:text-brass-400"
        >
          <Phone size={15} />
          +354 865 4146
        </a>
        <a
          href="https://linkedin.com/in/gu%C3%B0j%C3%B3n-kristj%C3%A1nsson-7a3b083b/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-white transition-colors hover:text-brass-400"
        >
          <Linkedin size={15} />
          LinkedIn
        </a>
        <a
          href="https://github.com/gudjonkri20"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-white transition-colors hover:text-brass-400"
        >
          <Github size={15} />
          GitHub
        </a>
        <Link
          to={localizedHref('/contact', locale)}
          className="inline-flex items-center gap-2 text-navy-200 transition-colors hover:text-brass-400"
        >
          {t('nav.contact')}
        </Link>
      </div>
    </Section>
  );
};

export default ContactBand;
