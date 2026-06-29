# Flagship rebuild — engineering notes

A from-scratch rebuild of the static **Flagship Portfolio Site** as a modern, statically-generated **Astro** app — same cinematic Apple-keynote experience, same vetted bilingual copy and numbers, better engineering underneath.

> The original static site lives untouched in `../Flagship Portfolio Site/`. This is a separate project so the two can be compared side by side.

---

## The stack I chose — and why

| Choice | Why |
| --- | --- |
| **Astro 5 (static output)** | The site is content-driven and mostly static. Astro ships **zero JS by default**, prerenders every page to HTML, and lets me keep the few interactive bits (aurora, counters, theme) as tiny island scripts. Best-in-class for a fast, SEO-strong portfolio. |
| **TypeScript, strict** | A typed content model (`profile.ts`, `projects.ts`, the i18n dictionary) makes the "every number is real" guarantee a *compiler-enforced* one — copy and metrics live in one typed place, not scattered through markup. |
| **Hand-rolled CSS design tokens (no Tailwind)** | The look is a bespoke design system (gradient text, per-project accents, mesh cards, story films). Porting it as CSS custom properties + Astro **component-scoped styles** is cleaner and more faithful than fighting a utility framework — and ships less CSS. |
| **Real i18n routes `/en` + `/ar`** | Instead of the original's render-both-languages-and-toggle-with-CSS approach, each language is a real, indexable URL with correct `hreflang`, canonical, and `og:locale`. Content comes from a typed dictionary, so there is **no duplicated DOM** and Arabic is a first-class citizen, not a hidden `<span>`. |
| **Self-hosted fonts (Fontsource)** | Inter (variable) + IBM Plex Sans Arabic are bundled, not fetched from Google — no third-party request, no layout shift, works offline. |
| **`@astrojs/sitemap`** | Generates `sitemap-index.xml` with per-locale `hreflang` automatically. |
| **Netlify static deploy** | `netlify.toml` builds to `dist/` and long-caches hashed assets. Pure static output — deploys anywhere. |

## What I reused as-is (did not regenerate)

- The **8 Claude Design "story films"** → `public/films/*.html`, embedded per project page in an isolated `<iframe>` (`FilmEmbed.astro`).
- The **aurora `<canvas>`** → ported verbatim into `src/lib/aurora.ts` (logic unchanged; wrapped as an init function with proper teardown so it survives View Transitions and doesn't leak RAF loops).
- The **real ad-creative images** → `public/img/work/*.jpg`.
- Every **figure and line of copy** — lifted verbatim (EN + Arabic) from the source site; numbers are centralised in `src/data/`.

## What I improved over the original

1. **Componentised, DRY architecture.** The homepage is composed of focused components (`Hero`, `Statements`, `Metrics`, `ProjectsGrid`, `Team`, `About`, `Contact`); each project page is a self-contained component sharing `StoryHero` / `FilmEmbed` / `Metrics` / `Pager`. The original was three 230-line HTML files with copy-pasted nav/footer/script in each.
2. **Single source of truth for data.** Every number traces to `src/data/profile.ts`; the project index (order, accents, card copy, prev/next) lives in `src/data/projects.ts`. Change a figure in one place.
3. **Proper i18n + SEO.** Real `/en` and `/ar` routes, per-page `hreflang`/canonical, `sitemap.xml`, `robots.txt`, a `404`, JSON-LD (`Person` site-wide + `CreativeWork` per story), per-locale OG images.
4. **Accessibility.** Skip link, `:focus-visible` rings, `aria-label`s on icon controls, decorative layers marked `aria-hidden`, full `prefers-reduced-motion` support, and reveal/animation states gated behind a `.js` class so **no-JS visitors and crawlers see all content** (the original hid content with opacity and relied on JS to reveal it).
5. **Resilient motion engine.** Reveal, count-up, parallax, scroll-progress and the aurora are re-initialised on every Astro View Transition with no duplicate listeners or double-counts, and torn down cleanly on navigation.
6. **No-FOUC theme.** Dark is the default; an explicit light choice is honoured and applied before first paint (no flash), and re-applied after each client-side swap.

## Project structure

```
src/
  data/        profile.ts (verified numbers)  ·  projects.ts (story index)
  i18n/        ui.ts (shared chrome strings)  ·  utils.ts (locale helpers)
  styles/      tokens.css (the whole design system)
  lib/         aurora.ts  ·  interactions.ts  (island scripts)
  layouts/     BaseLayout.astro (head/SEO/JSON-LD/theme/nav/footer)
  components/   homepage sections + work/ (StoryHero, FilmEmbed, Pager, 8 stories)
  pages/       index.astro (root redirect) · [lang]/index.astro · [lang]/work/[slug].astro · 404.astro
public/        films/  ·  img/work/  ·  og/  ·  robots.txt
```

## What I'd do next

- **Bilingual films.** The 8 embedded films are English-only; the seam is clean (`FilmEmbed` takes a `film` filename) — drop in `*-ar.html` variants and switch by `lang`.
- **Real OG renders per story** (currently the two homepage cards; could generate one per project).
- **`prefers-reduced-data`** to skip the aurora canvas entirely on metered connections.
- **A tiny visual-regression check** (Playwright screenshot per route × locale × theme) wired into CI before deploy.
- **Optional contact form** (Netlify Forms) if the brief later wants inbound messages rather than direct WhatsApp/email/LinkedIn.
