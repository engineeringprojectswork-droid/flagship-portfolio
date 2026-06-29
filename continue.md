# Continue — Flagship portfolio redesign (handoff)

Paste this into a new chat to continue. It is self-contained: a fresh session
with no memory of the prior conversation can pick up from here.

---

## 0. What & where

- **Project:** `C:\Users\GAMING\Claude\Projects\MY Resume\flagship-rebuild`
  — an **Astro 5** static, bilingual (EN/AR + RTL) cinematic portfolio for
  Mohamed Mahmoud ("a whole marketing team, in one person"). Dark-default with
  a light theme toggle. Live at https://flagship-rebuild.vercel.app/en (also a
  Netlify deploy exists: https://mohamed-mahmoud-kuwait.netlify.app).
- **Stack:** Astro 5 + TypeScript, hand-rolled CSS design tokens (NO Tailwind),
  self-hosted fonts. All CSS lives in ONE file: `src/styles/tokens.css`.
- **Single source of truth for numbers:** `src/data/profile.ts` + `projects.ts`.
  Do not invent figures — every number must trace to those files.

### Run / preview (IMPORTANT — path has a space)
The project path contains a space (`MY Resume`), which breaks naive dev launching.
- From the OTHER repo `C:\Users\GAMING\Downloads\website` there's a launcher:
  `run-flagship.cmd` → `cd /d "<long path>" && npm run dev -- --port %PORT%`
  (falls back to 4321 if `%PORT%` unset). `website/.claude/launch.json` has a
  `flagship` config (`"autoPort": true`) that runs it via `cmd /c`.
- With the Claude preview tool: `preview_start({name:"flagship"})`. autoPort
  picks a free port and the cmd forwards `%PORT%` to Astro (must forward, or the
  browser hits the wrong port → blank page).
- Build: `npm run build` (→ `dist/`, 20 pages). Deploy (Netlify):
  `npm run build && npx netlify deploy --prod --dir dist`.

---

## 1. What was just done (all verified in light + dark; `npm run build` passes)

The user asked to: change the hero, give each card a meaningful image, turn the
tech chips into a scroll-linked circular orbit, make the "five hires" line a
graphic, fix a story "box-in-a-box", and make every dark surface follow light
mode. Decisions taken: **keep dark as default, polish light mode**; visuals on
**all 14 cards** (6 roles + 8 projects); **in-code themeable SVG** (no image files).

1. **Light-mode theming** (`src/styles/tokens.css`):
   - Added theme tokens `--win-body` / `--win-bar` (device windows) and
     `--mesh-a` / `--mesh-b` (project-card mesh base) to `:root` and
     `[data-theme="light"]`.
   - `.device` (the macOS app-window mockups) was PINNED dark; now it follows
     the theme → crisp white window in light, dark in dark. `.device__bar` uses
     `--win-bar`, body uses `--win-body`.
   - `.pcard` / `.mesh` un-pinned → project cards adapt (pastel mesh + dark text
     in light). `.liveframe` and MedmacWebsite `.ring::after` use `--win-body`.

2. **Box-in-a-box fix** (`src/components/work/FilmEmbed.astro` + `tokens.css`):
   - `.cd-film` is now a **frameless transparent** aspect box (was a bordered
     dark card). Each embedded film (`/public/films/*.html`, `/cartoons/*.html`)
     draws its OWN rounded card, so the outer frame was a duplicate.
   - FilmEmbed has a `<script>` that, on iframe load, sets the same-origin film
     document's `html`/`body` background to transparent → kills the dark gutter
     so only the film's own card shows (one box), on any theme. The films stay
     dark by design (cinematic).

3. **6 role-card glyphs** (`src/components/Team.astro` + `tokens.css` `.role__viz`):
   inline line-art SVGs (`vizzes[]`, `currentColor` = accent) — funnel, growth
   curve, media frame, dashboard, calendar, automation graph.

4. **8 project-card emblems** (`src/components/ProjectsGrid.astro` + `tokens.css`
   `.pcard__emblem`): a frosted corner chip per project, keyed by slug in the
   `emblem` map — funnel, growth curve, CRM table, content frame, desktop+check,
   hiring funnel, browser gauge, AI-merge.

5. **Scroll-linked tech orbit** (NEW `src/components/TechOrbit.astro`,
   wired into `src/components/About.astro`, styles `.orbit*` in `tokens.css`,
   engine in `src/lib/interactions.ts`):
   - New scroll-scrub primitive: any `[data-scrub]` element gets a live `--p`
     (0→1) from its scroll position (`initScrub`/`updateScrub`, rAF-throttled,
     re-queries each frame so View-Transition-safe; reduced-motion → `--p=1`).
   - The orbit reuses the branded `Tech.astro` pills, positions them around a
     circle (`--a` angle, `--R` radius), rotates the ring by `calc(--p*90deg)`
     and reveals pills past per-pill thresholds `--t` → "more scroll, more you
     see". Center is a gradient layers-hub. (Replaced the old flat `TechRow` in
     About; `TechRow.astro` still exists and is used on story pages.)

6. **"Five hires → one person" graphic** (`src/components/Team.astro`
   `.converge*` in `tokens.css`): replaced the plain centered tagline with a
   hub-and-spokes — the six role glyphs orbit a glowing gradient **"1"** node
   with animated dashed spokes, tagline beneath.

Also: `Downloads/website/run-flagship.cmd` made port-robust (only non-project file touched).

---

## 2. PENDING — the hero (the one thing left)

The hero (`src/components/Hero.astro`) is still the **dark aurora** in light mode
(it's `<canvas id="auroraCanvas">` driven by `src/lib/aurora.ts`, which clears to
`#000` and ignores the theme; `tokens.css` `.hero{...}` pins light text). It was
left intentionally because the user is generating a clean light hero IMAGE in
Claude Design.

**Next step:** once the user provides the generated hero image, (a) drop it into
the hero (e.g. `public/img/hero-light.*`), and (b) make the hero theme-aware so
in light mode it shows the light image/wash instead of the dark aurora — either
swap the canvas for the image in light mode, or make `aurora.ts` read theme/
accent from CSS vars. This is the last piece to make light mode finished
top-to-bottom.

### Hero image prompt (already given to the user — for Claude Design, light theme)
```text
A clean, premium abstract hero banner for a high-end personal portfolio,
light theme. Wide cinematic format, 21:9. Pure white background (#FFFFFF)
easing into the faintest cool grey (#F5F5F7). In the right two-thirds, a
soft luminous gradient aurora — smooth volumetric light blooms in Apple
blue (#2997FF), violet (#A259FF) and warm pink (#FF5E8A), blended like
gentle northern lights behind frosted glass: airy, low-opacity, so the
white clearly dominates. A delicate suggestion of five fine gradient
ribbons converging into one bright point — five roles unified into a
single person — abstract, never literal. Generous empty negative space
on the left for a headline. Apple-keynote minimalism, soft high-key
lighting, a faint film grain, ultra-clean with no harsh edges. Elegant,
expensive, breathable.
No text, no words, no logos, no people or faces, no UI elements, no dark
background.
```
Ask Claude Design for a transparent PNG, ~2800px wide (retina).

---

## 3. Key context for the next session

- **Theme system:** `[data-theme="light"]` attribute on `<html>` (no
  prefers-color-scheme). Tokens dark on `:root`, light overrides in the
  `[data-theme="light"]` block (`tokens.css` ~lines 27–63). Per-page accent via
  `body[data-accent="..."]` (blue/violet/green/orange/pink/teal). Toggle handler
  + no-FOUC script in `src/layouts/BaseLayout.astro`.
- **Palette:** accent `#2997ff` (Apple blue), accent-2 `#a259ff`, signature
  `--grad` blue→violet→pink. Light bg `#fff`, ink `#1d1d1f`. Dark bg `#000`,
  ink `#f5f5f7`.
- **Interactions** (`src/lib/interactions.ts`): `initReveal` (one-shot IO),
  `initCounters`, `initParallax`, **`initScrub` (new — `[data-scrub]`→`--p`)**,
  `initScrollChrome`. All re-run on `astro:page-load`, all respect reduced-motion.
- **There are 6 role cards** (Team.astro) AND **8 project cards** (ProjectsGrid
  from `projects.ts`). "Eight stories" = projects; the receipts = roles.
- **Verify visually:** `preview_start({name:"flagship"})`, toggle theme via the
  nav sun/moon, check: `/en` (hero, roles, converge graphic, orbit, project
  cards) and `/en/work/meta-ads` (film embeds = single box; the "Meta Ads
  Manager" device = light window in light mode).

---

## 4. Suggested next actions (in order)
1. Get the generated hero image from the user → wire it in + make hero light-aware (PENDING above).
2. Re-check RTL (`/ar`, `/ar/work/meta-ads`) for the new orbit/converge/glyph additions.
3. Optional: commit the session's work; optionally redeploy (Netlify command above).
4. Optional polish: the live theme-toggle has a brief cross-fade mismatch on the
   orbit pills (body transitions 0.5s, pills 0.25s) — cosmetic, only on manual
   toggle; harmonize transition durations if it bothers the user.
