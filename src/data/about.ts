/**
 * Which entries the About page and the CV show, in order. The text for each
 * lives in the locale files under `about.*`; add a key here and its strings
 * there, and both pages pick it up.
 */
export const EDU_KEYS = ['aarhus', 'ru', 'hi'] as const;
export const EXPERIENCE_KEYS = ['icelandia', 'cyberpilot', 'reykjavikurborg'] as const;
export const LANG_KEYS = ['is', 'en', 'da', 'de'] as const;
export const SKILL_KEYS = ['ai', 'languages', 'stack', 'ml'] as const;

/** Ways to reach him, as the CV prints them. */
export const CONTACT = {
  email: 'gudjonk6@gmail.com',
  phone: '+354 865 4146',
  phoneHref: 'tel:+3548654146',
  linkedin: 'https://linkedin.com/in/gu%C3%B0j%C3%B3n-kristj%C3%A1nsson-7a3b083b/',
  linkedinLabel: 'linkedin.com/in/guðjón-kristjánsson',
  github: 'https://github.com/gudjonkri20',
  githubLabel: 'github.com/gudjonkri20',
} as const;
