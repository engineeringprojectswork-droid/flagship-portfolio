# CLAUDE.md — Project handoff for any AI agent

Read this first. It explains what this project is, the two codebases involved, what has been
done, the current live state, the active/pending work, and the non-obvious gotchas. Keep it
updated as you make progress.

---

## 1. What this is

A **premium, cinematic, bilingual (English + العربية, full RTL) portfolio** for **Mohamed Mahmoud**
(brand nickname **"Medmac"**) — a Digital Marketing Specialist in **Kuwait**. Apple-keynote
aesthetic: near-black canvas, gradient accents, an animated "aurora" hero, scroll-reveal motion,
animated proof metrics, and **8 project "story" pages** that each embed an interactive
"Claude Design" film.

**Owner is positioned as "a whole marketing team in one person"** — runs the ads, grows audiences,
builds the CRM, ships software, and automates with AI.

## 2. TWO codebases (don't confuse them)

Both live under: `C:\Users\GAMING\Claude\Projects\MY Resume\`

| Folder | What it is | Deployed? |
|---|---|---|
| `Flagship Portfolio Site/` | The **original hand-built static site** (plain HTML/CSS/JS, **no build step**). It is the **reference for the look + the vetted copy/numbers**, and it **holds the source assets**: `assets/films/*.html` (8 interactive films), `assets/cartoons/*.html` (8 auto-playing cartoon explainers), `assets/img/work/*.jpg`, `assets/js/aurora.js`, `assets/css/site.css`. | **No** |
| `flagship-rebuild/` ← **YOU ARE HERE** | A **from-scratch Astro 5 rebuild** of that static site. **This is the LIVE, deployed site.** | **Yes** |

> ⚠️ Briefs the owner pastes are sometimes written against the **static** site's structure
> (`work/*.html`, `story-film-wrap`, "no build step"). The **live** site is this **Astro** project.
> Editing the static `work/*.html` will **not** change the live site. When a brief targets the
> static structure, confirm whether the owner wants it on the **live Astro site** (almost always yes)
> and translate the change into this Astro project instead.

## 3. Live deployment

- **Live URL:** https://mohamed-mahmoud-kuwait.netlify.app
- **Host:** Netlify, site name `mohamed-mahmoud-kuwait` (Netlify account `engineeringprojectswork@gmail.com`, team `engineeringprojectswork`). The folder is `netlify link`-ed (`.netlify/` is gitignored).
- **Redeploy:** `npm run build && npx --no-install netlify deploy --prod --dir dist`
- Do **NOT** deploy unless the owner says so — they review locally, then say "deploy". (When they do say deploy, it's authorized.)

## 4. Stack & architecture (this Astro project)

- **Astro 5**, **static output** (prerendered), **TypeScript strict**.
- **Styling:** hand-rolled CSS design tokens in `src/styles/tokens.css` (NO Tailwind) + Astro
  component-scoped styles. Dark is the default theme; light is a toggle (`data-theme="light"` on
  `<html>`, no-FOUC inline script in `BaseLayout`).
- **i18n:** real routes `/en` + `/ar` via a `[lang]` dynamic param + `getStaticPaths`. Content is a
  typed dictionary (`src/i18n/ui.ts`) + co-located `{en,ar}` pairs in components (NO duplicated DOM).
  Per-page `hreflang`/canonical, `@astrojs/sitemap`. `/` redirects to saved/preferred locale.
- **Fonts:** self-hosted via Fontsource — Inter (Latin) + IBM Plex Sans Arabic.
- **Motion:** `src/lib/aurora.ts` (ported aurora canvas, re-inits across View Transitions) and
  `src/lib/interactions.ts` (reveal, count-up, parallax, scroll-progress). ClientRouter View Transitions.
- **Icons:** `simple-icons` for real brand logos + custom monogram tiles/glyphs in `src/lib/icons.ts`,
  rendered by `src/components/Tech.astro` / `TechRow.astro`.

### File map
```
src/
  data/        profile.ts   ← SINGLE SOURCE OF TRUTH for every number
               projects.ts  ← the 8 stories: slug, order, accent, card copy, prev/next
  i18n/        ui.ts (shared chrome strings) · utils.ts (pick, dir, mirrorPath, workPath, locales…)
  styles/      tokens.css   ← the whole design system + effects
  lib/         aurora.ts · interactions.ts · icons.ts (brand-icon registry)
  layouts/     BaseLayout.astro  (head/SEO/JSON-LD/hreflang/theme/nav/footer/ClientRouter)
  components/  Nav, Footer, Hero, Statements, Metrics, ProjectsGrid, Team, About, Contact, Tech, TechRow
               viz/StatRing.astro
               work/  StoryHero · FilmEmbed · Pager  +  the 8 story components
                      (MetaAds, AlMaali, Crm, BrandSystem, SheepApp, HrSystem, MedmacWebsite, AiWorkflow)
  pages/       index.astro (root redirect) · [lang]/index.astro · [lang]/work/[slug].astro · 404.astro
public/        films/*.html (8) · img/work/*.jpg (8) · og/{en,ar}.png · apple-touch-icon.png · robots.txt
scripts/       generate-og.mjs   (npm run og)
```
The story route `[lang]/work/[slug].astro` maps each slug → its work component. Each work component
renders: `<StoryHero>` → `<FilmEmbed>` (the interactive film) → bespoke content sections → metrics →
`<Pager>`. The 8 films are in `public/films/` and embedded via `FilmEmbed`'s iframe.

## 5. NON-NEGOTIABLE RULES

1. **Real data only (career-critical).** Every number on the site MUST trace to `src/data/profile.ts`
   (or the verbatim figures in `projects.ts`). **Never invent, round into a new claim, or alter a
   figure.** Example caught & fixed: an agent added a ring claiming "24% of RFQs were live" but
   4/23 = 17% and the source only used 24% as a bar width — it was removed.
2. **Honesty framing (verbatim):** the owner *generates leads* (sales closes them); software is
   *spec-driven, AI-assisted* (he's architect/operator/reviewer, not solo hand-coder); business
   impact wasn't measured, so it isn't claimed. Keep the "Honest credit" notes intact.
3. **AR/EN parity + correct RTL** everywhere. Keep both languages in sync.
4. **Don't edit the self-contained assets** (`public/films/*`, the source `assets/films|cartoons/*`).
   They're finished artifacts — embed them, don't modify them.
5. Match the existing look; keep it tasteful (Apple-calm, not gaudy).

## 6. CRITICAL gotcha — running the dev server / preview

This project's path contains a **space** (`...\MY Resume\flagship-rebuild`), which breaks the
Claude Preview launcher two different ways:
- Passing the spaced path to the runner fails (`'C:\Program' is not recognized`).
- Using the Windows 8.3 **short path** (`MYRESU~1\FLAGSH~2`) starts the server but makes Vite's dev
  cwd ≠ Node's module resolution path → Vite's `fs.allow` rejects `/@vite/client` and **the dev CSS
  is never injected** (page renders completely unstyled, `document.styleSheets.length === 0`).

**The working setup (already in place):**
- `C:\Users\GAMING\Downloads\website\run-flagship.cmd` does `cd /d "<long path>" && npm run dev -- --port 4321`.
- `website/.claude/launch.json` has a `flagship` config that runs it via `cmd /c`. Use `preview_start("flagship")`.
- `astro.config.mjs` also sets `vite.server.fs.strict:false` (dev-only belt-and-suspenders).
- The **production build is unaffected** by all of this — `npm run build` always produces correct CSS.
- Screenshots of pages with running animation (aurora canvas / embedded films) may time out — verify
  via `preview_inspect`/`preview_eval` (computed styles, DOM) instead, or screenshot static sections.

Commands: `npm run dev` (4321) · `npm run build` → `dist/` · `npm run preview` · `npm run og`.

## 7. Where I've reached (history, newest last)

1. **Built the Astro rebuild** from the static reference: aurora homepage (hero → cinematic
   statements → animated metrics → 8-card projects grid → "team you'd hire" → about → contact) and
   the 8 story pages, each embedding its interactive film. Verified EN/AR + dark/light.
2. **Deployed** to Netlify; then **renamed** the site to `mohamed-mahmoud-kuwait` (the plain
   `mohamed-mahmoud`/`-portfolio`/`-kw` subdomains were taken) and updated all URL references.
3. **Removed the brand-system ad-image gallery** (the cramped mosaic) at the owner's request —
   "to be redesigned later". The 8 images remain in `public/img/work/`.
4. **Visual upgrade ("best visual version"):** built the brand-icon system (`icons.ts` +
   `Tech`/`TechRow`) and replaced every plain text/tool chip with real brand-icon chips
   (logos via simple-icons; monogram tiles for Canva/AE/Premiere/Kling/Wan; glyphs for ComfyUI,
   Rented GPUs, Python-stdlib tools). Added `StatRing` (sheep **59/59**, medmac **96–100**),
   platform-logo rows (al-maali: Facebook/Instagram/TikTok/YouTube; hr-system: Gmail/WhatsApp),
   section accent glows, card shine-sweep, hover lifts, and a gradient **shimmer** on the hero +
   statement finale. Fixed a **light-mode hero** contrast bug (headline was dark-on-dark).
   Deployed. All green.

## 8. ~~ACTIVE / PENDING~~ → ✅ DONE in source (pending local build + deploy)

**✅ Completed (this session):** copied the 8 cartoon explainers into `public/cartoons/` (same
filenames as `public/films/`, so `/cartoons/<film>` mirrors `/films/<film>`), and extended
`src/components/work/FilmEmbed.astro` to render the **cartoon first** (`/cartoons/<film>`, caption
"Animated explainer — plays on its own") then the **interactive film** (`/films/<film>`, caption
"Prefer to explore? Step through it yourself…"), both bilingual + `loading="lazy"`. One component →
all 8 story pages now show both. Props unchanged, so the 8 work components needed no edits.
Static-verified: `pick` import resolves, `cd-film/cd-frame/story-film-wrap` exist in tokens.css,
8/8 cartoon↔film name parity.

**⚠️ NOT yet built/deployed.** The Linux agent sandbox can't build this folder (its `node_modules`
was installed on Windows → missing `@rollup/rollup-linux-x64-gnu`, plus mounted-FS `EPERM`). This is
an environment limit, **not a code issue**. **Next:** owner builds/previews on Windows (`npm run dev`
via the `flagship` launcher, or `npm run build`) to review the two-film layout, then deploys per §3.
(Saved deps were left untouched — `--no-save`; if local dev ever caches oddly, delete `node_modules/.vite`.)

---

**Original brief (reference):** on each of the 8 project story pages, **show BOTH films** — the
**auto-playing cartoon explainer first**, then that project's **interactive film below it**.

**Asset status:** the 8 cartoon explainers exist only in the **static** site at
`Flagship Portfolio Site/assets/cartoons/*.html` (meta-ads, al-maali, crm, brand-system, sheep,
hr-system, medmac-website, ai-workflow). They are **NOT yet in `flagship-rebuild/public/`**.

**Open decision (confirm with owner):** the owner's brief was written for the **static** site
(`work/*.html`, `story-film-wrap`). But the **live** site is THIS Astro project. The intended
end-state is almost certainly cartoons on the **live** site. To do it here:
1. Copy `Flagship Portfolio Site/assets/cartoons/*.html` → `flagship-rebuild/public/cartoons/`.
2. Extend `src/components/work/FilmEmbed.astro` (or add a `CartoonEmbed`) so each story renders the
   **cartoon first** (auto-play, caption "Animated explainer — plays on its own") then the
   **interactive film** (caption "Prefer to explore? Step through it yourself…"), both bilingual,
   both `loading="lazy"`.
3. Wire the per-page mapping. **Filename note:** the `sheep-app` page uses `sheep.html` for BOTH
   the cartoon and the film.
4. Build, verify each story shows exactly 2 iframes with correct `src`s, EN/AR parity holds, deploy
   only on owner's say-so.

## 9. Companion docs
- `NOTES.md` — the engineering rationale & "what I improved over the original".
- `README.md` — quickstart (preview/build/deploy).
- This `CLAUDE.md` — the living project/agent handoff (keep it current).
