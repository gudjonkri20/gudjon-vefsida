/**
 * Draws the share cards: the image a link shows when it is pasted into
 * LinkedIn, Slack, WhatsApp or a message.
 *
 *   npm run og
 *
 * Every page used to share the same card. This makes one per project, in
 * both languages — the project's title, its tagline, and its own
 * constellation mark — plus the home card in each language:
 *
 *   public/og-image.png            home, English (also the fallback)
 *   public/og/is/default.png       home, Icelandic
 *   public/og/<slug>.png           each project, English
 *   public/og/is/<slug>.png        each project, Icelandic
 *
 * The cards are committed, not built on deploy, so the build needs no
 * browser. Run this again when a project is added or its title or tagline
 * changes. It drives the Edge or Chrome already installed on the machine
 * (playwright-core does not download one).
 *
 * The marks are not redrawn here. The script bundles the site's own shape
 * painters (src/lib/constellationShapes.ts) into the page and samples them
 * the way the site does, so a card's mark is the same mark the page shows.
 */
import { build } from 'esbuild';
import { chromium } from 'playwright-core';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = process.cwd();
const OUT = join(ROOT, 'public');

// ---- data: projects (TypeScript) and strings (JSON) -----------------------
const work = join(tmpdir(), `gk-og-${process.pid}`);
await mkdir(work, { recursive: true });
const dataFile = join(work, 'data.mjs');
await build({
  stdin: {
    contents: "export { projects } from './src/data/projects';\n",
    resolveDir: ROOT,
    loader: 'ts',
  },
  bundle: true,
  format: 'esm',
  platform: 'node',
  outfile: dataFile,
  logLevel: 'silent',
});
const { projects } = await import(pathToFileURL(dataFile).href);

const strings = {
  en: JSON.parse(await readFile(join(ROOT, 'src/i18n/locales/en.json'), 'utf8')),
  is: JSON.parse(await readFile(join(ROOT, 'src/i18n/locales/is.json'), 'utf8')),
};
const CATEGORY_KEY = {
  chatbot: 'chatbot',
  mcp: 'mcp',
  ml: 'ml',
  automation: 'automation',
  dashboards: 'dashboards',
  'data-eng': 'dataEng',
  research: 'research',
  side: 'side',
};

// ---- the site's shape painters, as a script the page can run --------------
const shapes = await build({
  stdin: {
    contents: "export * from './src/lib/constellationShapes';\n",
    resolveDir: ROOT,
    loader: 'ts',
  },
  bundle: true,
  format: 'iife',
  globalName: 'Shapes',
  write: false,
  logLevel: 'silent',
});
const shapesJs = shapes.outputFiles[0].text;

// ---- the card -------------------------------------------------------------
const font = (pkg, file) => pathToFileURL(join(ROOT, 'node_modules', pkg, file)).href;

const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<link rel="stylesheet" href="${font('@fontsource-variable/familjen-grotesk', 'index.css')}">
<link rel="stylesheet" href="${font('@fontsource-variable/source-serif-4', 'index.css')}">
<link rel="stylesheet" href="${font('@fontsource/jetbrains-mono', '400.css')}">
<link rel="stylesheet" href="${font('@fontsource/jetbrains-mono', '500.css')}">
<style>
  html, body { margin: 0; background: #0B1F38; }
  #card {
    position: relative; width: 1200px; height: 630px; overflow: hidden;
    background: #0B1F38; color: #fff;
    font-family: 'Familjen Grotesk Variable', sans-serif;
    -webkit-font-smoothing: antialiased;
  }
  #field, #mark { position: absolute; }
  #field { inset: 0; width: 1200px; height: 630px; }
  #mark { right: 72px; top: 115px; width: 400px; height: 400px; }
  .text {
    position: absolute; left: 80px; top: 78px; bottom: 74px; width: 640px;
    display: flex; flex-direction: column;
  }
  .eyebrow {
    font: 500 20px 'JetBrains Mono', monospace; letter-spacing: 0.18em;
    text-transform: uppercase; color: #CCA35C;
  }
  h1 {
    margin: 30px 0 0; font-weight: 600; line-height: 1.04;
    letter-spacing: -0.03em; text-wrap: balance;
  }
  .tagline {
    margin: 26px 0 0; max-width: 600px; color: #DEE7F1;
    font: 400 30px/1.36 'Source Serif 4 Variable', serif; text-wrap: pretty;
  }
  .foot {
    margin-top: auto; padding-top: 22px; border-top: 1px solid rgba(255,255,255,0.12);
    display: flex; align-items: baseline; gap: 18px; white-space: nowrap;
  }
  .name { font-size: 25px; font-weight: 600; letter-spacing: -0.01em; }
  .role { font: 400 16px 'JetBrains Mono', monospace; letter-spacing: 0.06em; color: #C3D2E4; }
</style>
</head>
<body>
<div id="card">
  <canvas id="field" width="1200" height="630"></canvas>
  <canvas id="mark" width="800" height="800"></canvas>
  <div class="text">
    <div class="eyebrow" id="eyebrow"></div>
    <h1 id="title"></h1>
    <p class="tagline" id="tagline"></p>
    <div class="foot"><span class="name" id="name"></span><span class="role" id="role"></span></div>
  </div>
</div>
<script>${shapesJs}</script>
<script>
  // Deterministic "random", seeded by the card, so re-running the script
  // does not change images that have no reason to change.
  const seeded = (text) => {
    let h = 1779033703 ^ text.length;
    for (let i = 0; i < text.length; i++) { h = Math.imul(h ^ text.charCodeAt(i), 3432918353); h = (h << 13) | (h >>> 19); }
    return () => {
      h = Math.imul(h ^ (h >>> 16), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909);
      return ((h ^= h >>> 16) >>> 0) / 4294967296;
    };
  };

  // The same sampling the site's canvas does: rasterise the shape, keep the
  // inked pixels, order them by angle, take every nth.
  const sample = (paint, size, count) => {
    const off = document.createElement('canvas');
    off.width = size; off.height = size;
    const ctx = off.getContext('2d', { willReadFrequently: true });
    paint(ctx, size, size);
    const data = ctx.getImageData(0, 0, size, size).data;
    const cands = [];
    for (let y = 0; y < size; y += 2) for (let x = 0; x < size; x += 2) if (data[(y * size + x) * 4 + 3] > 100) cands.push({ x, y });
    if (!cands.length) return [];
    let cx = 0, cy = 0;
    for (const p of cands) { cx += p.x; cy += p.y; }
    cx /= cands.length; cy /= cands.length;
    cands.sort((a, b) => Math.atan2(a.y - cy, a.x - cx) - Math.atan2(b.y - cy, b.x - cx));
    return Array.from({ length: count }, (_, i) => cands[Math.floor((i * cands.length) / count)]);
  };

  window.render = async (card) => {
    await document.fonts.ready;
    await document.fonts.load('800 120px "Familjen Grotesk Variable"');

    document.getElementById('eyebrow').textContent = card.eyebrow;
    document.getElementById('tagline').textContent = card.tagline;
    document.getElementById('name').textContent = card.name;
    document.getElementById('role').textContent = card.role;
    // The home card is his name already; it has no byline, so no rule either.
    document.querySelector('.foot').style.display = card.name ? '' : 'none';
    const title = document.getElementById('title');
    title.textContent = card.title;
    const n = card.title.length;
    title.style.fontSize = (n <= 20 ? 78 : n <= 30 ? 66 : n <= 44 ? 56 : 48) + 'px';

    const rand = seeded(card.id);

    // A few faint stars across the card, as in the site's hero.
    const field = document.getElementById('field').getContext('2d');
    field.clearRect(0, 0, 1200, 630);
    field.fillStyle = 'rgba(204,163,92,0.30)';
    for (let i = 0; i < 46; i++) {
      field.beginPath();
      field.arc(rand() * 1200, rand() * 630, 1.5, 0, Math.PI * 2);
      field.fill();
    }

    // The mark: points on the shape, linked to their near neighbours.
    const painter = card.shape === 'initials' ? Shapes.initials : (Shapes.CATEGORY_SHAPE[card.shape] || Shapes.CATEGORY_SHAPE.ml);
    const SIZE = 400, LINK = 30;
    const pts = sample(painter, SIZE, 230).map((p) => ({ x: p.x + (rand() - 0.5) * 3, y: p.y + (rand() - 0.5) * 3 }));
    const ctx = document.getElementById('mark').getContext('2d');
    ctx.setTransform(2, 0, 0, 2, 0, 0);
    ctx.clearRect(0, 0, SIZE, SIZE);
    ctx.lineWidth = 0.7;
    for (let a = 0; a < pts.length; a++) for (let b = a + 1; b < pts.length; b++) {
      const d = Math.hypot(pts[a].x - pts[b].x, pts[a].y - pts[b].y);
      if (d > LINK) continue;
      ctx.strokeStyle = 'rgba(204,163,92,' + (1 - d / LINK) * 0.55 + ')';
      ctx.beginPath(); ctx.moveTo(pts[a].x, pts[a].y); ctx.lineTo(pts[b].x, pts[b].y); ctx.stroke();
    }
    ctx.fillStyle = '#CCA35C';
    for (const p of pts) { ctx.beginPath(); ctx.arc(p.x, p.y, 2.1, 0, Math.PI * 2); ctx.fill(); }
  };
</script>
</body>
</html>`;

const page_html = join(work, 'card.html');
await writeFile(page_html, html);

// ---- which cards to draw --------------------------------------------------
const cards = [];
for (const locale of ['en', 'is']) {
  const s = strings[locale];
  const dir = locale === 'en' ? 'og' : 'og/is';
  cards.push({
    file: locale === 'en' ? 'og-image.png' : 'og/is/default.png',
    id: `home-${locale}`,
    eyebrow: s.siteTagline,
    title: s.siteTitle,
    tagline: s.hero.headline,
    name: '',
    role: '',
    shape: 'initials',
  });
  for (const p of projects) {
    cards.push({
      file: `${dir}/${p.slug}.png`,
      id: `${p.slug}-${locale}`,
      eyebrow: s.projects.filter[CATEGORY_KEY[p.category]] ?? '',
      title: p.title[locale],
      tagline: p.tagline[locale],
      name: s.siteTitle,
      role: s.siteTagline,
      shape: p.category,
    });
  }
}

// ---- draw them ------------------------------------------------------------
let browser;
for (const channel of ['msedge', 'chrome']) {
  try {
    browser = await chromium.launch({ channel, headless: true });
    break;
  } catch {
    /* try the next installed browser */
  }
}
if (!browser) throw new Error('og-cards: needs Microsoft Edge or Google Chrome installed.');

const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(page_html).href);
for (const card of cards) {
  await page.evaluate((c) => window.render(c), card);
  const target = resolve(OUT, card.file);
  await mkdir(dirname(target), { recursive: true });
  await page.locator('#card').screenshot({ path: target });
}
await browser.close();
await rm(work, { recursive: true, force: true });

console.log(`og-cards: wrote ${cards.length} cards to public/`);
