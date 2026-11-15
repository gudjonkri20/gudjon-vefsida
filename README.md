# gudjonkristjansson.com

Source for [gudjonkristjansson.com](https://gudjonkristjansson.com) — Guðjón Kristjánsson's personal portfolio and consulting site.

## Stack

- React 18 + TypeScript + Vite 5
- Tailwind CSS 3; type is Familjen Grotesk, Source Serif 4 and JetBrains Mono (`@fontsource`)
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

Deploys go out from the command line, not from git: pushing to `main` does
not change the live site.

```bash
npm run build
npm run deploy       # netlify deploy --prod
```

To try a build somewhere other than the live site first:

```bash
npx netlify deploy --dir=dist --alias=preview   # -> https://preview--gudjonkristjansson.netlify.app
```

## Adding a project

Everything about a project lives in one place, `src/data/projects.ts`. Add an
entry there and the site picks it up everywhere: the projects page and its
filters, the project's own page, the home page (if featured), the CV, the
assistant's knowledge, the sitemap and link previews.

**On a new computer, once:**

```bash
git clone https://github.com/gudjonkri20/gudjon-vefsida.git
cd gudjon-vefsida
npm install
npx netlify login
npx netlify link --id 08de3d61-623b-4096-a1bf-186407de5e72
```

**Each time:**

1. In `src/data/projects.ts`, copy an existing entry and edit it. Fields:

   | Field | What it does |
   |-------|--------------|
   | `slug` | The address: `/projects/<slug>`. Lowercase, hyphens. |
   | `title`, `tagline`, `description` | `{ en, is }` each. The tagline is the one-line summary shown on cards, link previews and the CV. |
   | `status` | `public`, `internal` (built for Icelandia), `research` or `side`. |
   | `category` | `chatbot`, `mcp`, `ml`, `automation`, `dashboards`, `data-eng`, `research` or `side`. Decides the filter and the constellation mark. |
   | `tech` | List of technologies shown as tags. |
   | `link`, `linkLabel` | Optional. A public `link` also puts the project in the hero's "Live now" line and on the CV. |
   | `isFeatured` | `true` to show it on the home page and the CV. |
   | `hasDetailPage` | `true` to give it its own page. |
   | `year` | Optional. |
   | `system` | Optional. Draws the "How it fits together" diagram on the project's page: `input` (what starts it), `core` (what sits in the middle), `parts` (three to six things it connects to) and `notes` (short facts). All `{ en, is }`. See the Icelandia chatbot entry for an example. Only what is already public. |

   Keep internal projects at the level of the existing ones (see
   *Confidentiality* below).

2. Draw its share card (the image LinkedIn and Slack show). Needs Edge or
   Chrome installed:

   ```bash
   npm run og
   ```

3. Check it, then put it live:

   ```bash
   npm run dev       # look at it at http://localhost:5173
   npm run build     # fails loudly if something is wrong
   git add -A && git commit -m "Add <project>" && git push
   npm run deploy
   ```

The counts in the hero ("14 production systems shipped", "4 MCP servers
live", …) are typed by hand in `src/components/Hero.tsx` (`INDEX`). They do
not update themselves, so change them if a new project changes them.

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
  pages/           Route components (Home, About, Services, Projects, Contact, ProjectDetail, CV, NotFound)
  data/            Typed content data (projects.ts, services.ts, about.ts)
  lib/             Pure helpers (i18n locale routing, project filters)
  i18n/            i18n init + locale JSON (en, is)
  types.ts         Shared types
netlify/functions/
  chat.ts          Anthropic proxy for "Ask Guðjón AI" — POST /api/chat
  _chatContext.ts  Sanitized system-prompt builder
scripts/
  postbuild.mjs    After `vite build`: one HTML file per route (own title and share card), 404.html, sitemap.xml, robots.txt
  og-cards.mjs     `npm run og`: draws the share cards into public/og/
public/
  favicon.svg, profile.jpg, og-image.png, og/   (share cards are generated; see above)
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
| `/cv` | One-page CV; "Download PDF" prints it to A4 |
| `/is/*` | Icelandic mirror of all of the above |
| `*` | 404 |
