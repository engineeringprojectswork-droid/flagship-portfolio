# Mohamed Mahmoud — Flagship Portfolio (Astro rebuild)

A cinematic, bilingual (English / العربية, with full RTL) portfolio. Static Astro site — an aurora hero, scroll-driven storytelling, animated proof metrics, and 8 project "story" pages each embedding an interactive Claude Design film.

## Preview it

```bash
npm install
npm run dev
```

Then open **http://localhost:4321** — it redirects to `/en` (or `/ar` if your browser is Arabic). Use the **ع / EN** pill in the nav to switch language and **☀ / ☾** to switch theme.

Key routes:

- `/en`, `/ar` — the homepage
- `/en/work/<slug>`, `/ar/work/<slug>` — the 8 stories
  (`meta-ads`, `al-maali`, `crm`, `brand-system`, `sheep-app`, `hr-system`, `medmac-website`, `ai-workflow`)

## Build the static site

```bash
npm run build      # outputs to dist/
npm run preview    # serve the production build locally
```

`dist/` is a fully static bundle — deployable to Netlify, Vercel, Cloudflare Pages, or any static host.

## Deploy (Netlify)

`netlify.toml` is included. Either connect the repo (build command `npm run build`, publish dir `dist`) or:

```bash
npm run build
npx netlify deploy --prod --dir dist
```

Before deploying, set the production URL in **`astro.config.mjs`** (`const SITE = …`) so canonical/sitemap/OG links are correct.

## Optional: regenerate social images

```bash
npm run og         # writes public/og/en.png, public/og/ar.png, apple-touch-icon.png
```

## Where things live

See **`NOTES.md`** for the architecture, the stack rationale, and what changed from the original static site. Every displayed number traces to **`src/data/profile.ts`**.
