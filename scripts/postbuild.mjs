/**
 * Runs after `vite build`.
 *
 * The site is a single-page app: one index.html, and the right page is drawn
 * by JavaScript. That is fine for people, but the things that fetch a link
 * without running JavaScript — LinkedIn, Slack, WhatsApp, iMessage, most
 * crawlers — only ever saw the home page's title, description and share
 * image, whichever page was shared. A link to a project previewed as
 * "Guðjón Kristjánsson — AI Specialist & advisor".
 *
 * This writes one small HTML file per route. Each is the same app shell with
 * that page's own <head>: title, description, canonical URL, language,
 * share-card tags. The body is untouched, so there is no server rendering and
 * nothing to hydrate — the app boots exactly as before.
 *
 * It also writes:
 *   - 404.html, so an address that does not exist answers 404 instead of 200;
 *   - sitemap.xml and robots.txt, from the same route list and SITE_URL, so
 *     they cannot drift from the pages that exist.
 */
import { build } from 'esbuild';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const DIST = 'dist';

// The project data and SITE_URL are TypeScript; bundle them to something Node
// can import, read them, and throw the bundle away.
const bundle = resolve(DIST, '.postbuild-data.mjs');
await build({
  stdin: {
    contents:
      "export { projects } from './src/data/projects';\n" +
      "export { SITE_URL } from './src/lib/site';\n",
    resolveDir: process.cwd(),
    loader: 'ts',
  },
  bundle: true,
  format: 'esm',
  platform: 'node',
  outfile: bundle,
  logLevel: 'silent',
});
const { projects, SITE_URL } = await import(pathToFileURL(bundle).href);
await rm(bundle);

const strings = {
  en: JSON.parse(await readFile('src/i18n/locales/en.json', 'utf8')),
  is: JSON.parse(await readFile('src/i18n/locales/is.json', 'utf8')),
};
const pick = (obj, path) => path.split('.').reduce((o, k) => o?.[k], obj);

const LOCALES = ['en', 'is'];
const OG_LOCALE = { en: 'en_US', is: 'is_IS' };
const localized = (path, locale) => (locale === 'en' ? path || '/' : `/is${path}`);

// Same rule as the SEO component, so the static head and the one the app
// writes after it boots agree.
const fullTitle = (locale, title) => {
  const s = strings[locale];
  return title ? `${title} · ${s.siteTitle}` : `${s.siteTitle} — ${s.siteTagline}`;
};

/** Every page the site has, in both languages. */
const routes = [];
for (const locale of LOCALES) {
  const s = strings[locale];
  const add = (path, title, description, extra = {}) =>
    routes.push({ locale, path, url: localized(path, locale), title, description, ...extra });

  add('', undefined, s.metaDescription, { home: true });
  add('/about', pick(s, 'about.title'), pick(s, 'about.subtitle'));
  add('/services', pick(s, 'services.title'), pick(s, 'services.subtitle'));
  add('/projects', pick(s, 'projects.title'), pick(s, 'projects.subtitle'));
  add('/contact', pick(s, 'contact.title'), pick(s, 'contact.subtitle'));
  for (const p of projects) {
    add(`/projects/${p.slug}`, p.title[locale], p.tagline[locale], {
      inSitemap: p.hasDetailPage,
    });
  }
}

const esc = (v) =>
  String(v)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const shell = await readFile(join(DIST, 'index.html'), 'utf8');

// Take out whatever head tags the shell came with; each page gets its own.
const bare = shell
  .replace(/<title>[\s\S]*?<\/title>\s*/g, '')
  .replace(
    /<meta\s+(?:name|property)="(?:description|robots|og:[^"]+|twitter:[^"]+)"[\s\S]*?\/>\s*/g,
    '',
  )
  .replace(/<link\s+rel="(?:canonical|alternate)"[^>]*>\s*/g, '');

/** schema.org Person, on the home page only: who this site is about. */
const person = (locale) =>
  JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Guðjón Kristjánsson',
    jobTitle: strings[locale].siteTagline,
    url: SITE_URL + localized('', locale),
    image: `${SITE_URL}/profile.jpg`,
    worksFor: { '@type': 'Organization', name: 'Icelandia' },
    address: { '@type': 'PostalAddress', addressLocality: 'Reykjavík', addressCountry: 'IS' },
    sameAs: [
      'https://github.com/gudjonkri20',
      'https://linkedin.com/in/gu%C3%B0j%C3%B3n-kristj%C3%A1nsson-7a3b083b/',
    ],
  });

const head = (route, { noindex = false } = {}) => {
  const title = fullTitle(route.locale, route.title);
  const url = SITE_URL + route.url;
  const image = `${SITE_URL}/og-image.png`;
  // data-rh marks a tag as one the app's head manager owns, so when the app
  // boots it replaces these rather than adding a second copy beside them.
  const rh = 'data-rh="true"';
  const lines = [
    `<title>${esc(title)}</title>`,
    `<meta ${rh} name="description" content="${esc(route.description)}" />`,
    noindex
      ? `<meta ${rh} name="robots" content="noindex" />`
      : `<link ${rh} rel="canonical" href="${esc(url)}" />`,
    ...(noindex
      ? []
      : [
          ...LOCALES.map(
            (l) =>
              `<link ${rh} rel="alternate" hreflang="${l}" href="${esc(SITE_URL + localized(route.path, l))}" />`,
          ),
          `<link ${rh} rel="alternate" hreflang="x-default" href="${esc(SITE_URL + localized(route.path, 'en'))}" />`,
        ]),
    `<meta ${rh} property="og:type" content="website" />`,
    `<meta ${rh} property="og:title" content="${esc(title)}" />`,
    `<meta ${rh} property="og:description" content="${esc(route.description)}" />`,
    `<meta ${rh} property="og:url" content="${esc(url)}" />`,
    `<meta ${rh} property="og:image" content="${esc(image)}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta ${rh} property="og:site_name" content="${esc(strings[route.locale].siteTitle)}" />`,
    `<meta ${rh} property="og:locale" content="${OG_LOCALE[route.locale]}" />`,
    `<meta ${rh} name="twitter:card" content="summary_large_image" />`,
    `<meta ${rh} name="twitter:title" content="${esc(title)}" />`,
    `<meta ${rh} name="twitter:description" content="${esc(route.description)}" />`,
    `<meta ${rh} name="twitter:image" content="${esc(image)}" />`,
    ...(route.home
      ? [
          `<script type="application/ld+json">${person(route.locale).replace(/</g, '\\u003c')}</script>`,
        ]
      : []),
  ];
  return lines.map((l) => `    ${l}`).join('\n');
};

const page = (route, opts) =>
  bare
    .replace(/<html lang="[^"]*">/, `<html lang="${route.locale}">`)
    .replace('</head>', `${head(route, opts)}\n  </head>`);

/** `/about` is served from about.html, `/` from index.html. */
const fileFor = (url) => join(DIST, url === '/' ? 'index.html' : `${url.slice(1)}.html`);

for (const route of routes) {
  const file = fileFor(route.url);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, page(route));
}

// Netlify serves this, with a 404 status, for any address no file matches.
// The app still boots inside it and draws the "not found" page.
await writeFile(
  join(DIST, '404.html'),
  page(
    {
      locale: 'en',
      path: '/404',
      url: '/404',
      title: strings.en.notFound.title,
      description: strings.en.notFound.subtitle,
    },
    { noindex: true },
  ),
);

const listed = routes.filter((r) => r.locale === 'en' && r.inSitemap !== false);
const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
  '        xmlns:xhtml="http://www.w3.org/1999/xhtml">',
  ...listed.map((r) =>
    [
      '  <url>',
      `    <loc>${esc(SITE_URL + r.url)}</loc>`,
      ...LOCALES.map(
        (l) =>
          `    <xhtml:link rel="alternate" hreflang="${l}" href="${esc(SITE_URL + localized(r.path, l))}" />`,
      ),
      '  </url>',
    ].join('\n'),
  ),
  '</urlset>',
  '',
].join('\n');
await writeFile(join(DIST, 'sitemap.xml'), sitemap);
await writeFile(
  join(DIST, 'robots.txt'),
  `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`,
);

console.log(
  `postbuild: ${routes.length} pages, 404.html, sitemap.xml (${listed.length} urls), robots.txt -> ${SITE_URL}`,
);
