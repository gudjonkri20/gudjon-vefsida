# gudjonkristjansson.com

Source for [gudjonkristjansson.com](https://gudjonkristjansson.com) — Guðjón Kristjánsson's personal portfolio and consulting site.

## Stack

- React 18 + TypeScript + Vite 5
- Tailwind CSS 3 with Geist (`@fontsource/geist`)
- React Router DOM 6 (with bilingual `/is/*` mirror)
- `react-i18next` for EN/IS internationalization
- `react-helmet-async` for per-page SEO
- `framer-motion` for tasteful, reduced-motion-aware animation
- Hosted on Netlify (SPA + Functions)
- "Ask Guðjón AI" chat widget powered by Netlify Functions + the Anthropic API (Claude Haiku 4.5)

## Local development

```bash
npm install
npm run dev          # Vite at http://localhost:5173
npm run netlify:dev  # Netlify Dev (functions + redirects) at http://localhost:8888
```

## Production build

```bash
npm run lint
npm run build
npm run preview      # Preview the built bundle locally
```

## Deploying

The site auto-deploys on push to `main` via Netlify. Manual deploys:

```bash
npm run deploy       # netlify deploy --prod
```

## Environment variables

Set in **Netlify UI → Site settings → Environment variables**, or with the CLI:

```bash
netlify env:set ANTHROPIC_API_KEY <key>
```

| Name | Required | Notes |
|------|----------|-------|
| `ANTHROPIC_API_KEY` | for the chat widget only | **Personal** Anthropic key from `console.anthropic.com`. Never a company key. The chat function falls back to an "AI is offline" response when this is unset, so the rest of the site works without it. |

`.env.example` documents the same.

## Project layout

```
src/
  components/      Reusable UI (Hero, ProjectCard, ChatWidget, …)
  pages/           Route components (Home, About, Services, Projects, Contact, ProjectDetail, NotFound)
  data/            Typed content data (projects.ts, services.ts)
  lib/             Pure helpers (i18n locale routing, project filters)
  i18n/            i18n init + locale JSON (en, is)
  types.ts         Shared types
netlify/functions/
  chat.ts          Anthropic proxy for "Ask Guðjón AI" — POST /api/chat
  _chatContext.ts  Sanitized system-prompt builder
public/
  favicon.svg, robots.txt, profile.jpg
```

## Confidentiality

Most of Guðjón's strongest production work was built **for Icelandia** (formerly Reykjavik Excursions) and lives in private `ReykjavikExcursions` repos. Internal projects on the public site (and inside the chat widget's system prompt) are described at a high level only — no source links, no internal URLs, no business metrics, no client identifiers. The same rules apply when adding new entries in `src/data/projects.ts`.

## Routes

| Route | Page |
|-------|------|
| `/` | Home |
| `/services` | Services |
| `/projects` | Filterable project grid |
| `/projects/:slug` | Project detail |
| `/about` | About |
| `/contact` | Contact |
| `/is/*` | Icelandic mirror of all of the above |
| `*` | 404 |
