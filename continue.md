# Continue — Flagship parallax/3D StoryScroll rework (handoff)

Paste this into a new chat to continue. It is self-contained: a fresh session with
no memory of the prior conversation can pick up from here.

---

## 0. What & where

- **Project:** `C:\Users\GAMING\Claude\Projects\MY Resume\flagship-rebuild`
  — an **Astro 5** static, bilingual (EN/AR + RTL) cinematic portfolio for Mohamed
  Mahmoud ("a whole marketing team, in one person"). Dark-default + light toggle.
- **Two codebases (don't confuse):** this `flagship-rebuild` is the LIVE Astro site.
  `C:\Users\GAMING\Downloads\website` is a *separate, older* repo that only hosts the
  `run-flagship.cmd` launcher + `.claude/launch.json` (`flagship` preview config).
  A session may open with cwd = `Downloads\website`; **edit flagship-rebuild via
  absolute paths.**
- **Git:** this folder is now a git repo (`git init` done as a safety net). History:
  `Baseline → Phase 0 … Phase 5`, one commit per phase. **Local only — nothing pushed,
  not deployed.** Roll back any phase with `git -C "<path>" reset`/`revert`.
- **Real-data rule (career-critical):** every number must trace to `src/data/profile.ts`
  or `src/data/projects.ts`. Never invent/round/alter figures. Keep the honesty notes
  verbatim. `my-resume` uses only safe framings — no job-hunt counts.

## 1. What was just done — the parallax/3D StoryScroll rework (Claude Design package)

Implemented the full "Claude Design parallax package" (brief: replace the boxed
self-playing explainer with a page-level scroll story on every work page + home
upgrades + a 9th story). Shipped in source across 6 phase commits; build is green
(**22 pages**). Desktop Lighthouse **100/100/100/100**.

1. **Foundation** — `lenis` + `gsap` + `@fontsource-variable/jetbrains-mono` installed;
   design tokens wired once in `tokens.css` (layered surfaces, mono font, motion
   duration/easing tokens, parallax-depth scale, the **9-domain accent system**).
2. **Reusable 5-beat spine** + the 2 comp pages (meta-ads, al-maali).
3. **Spine rolled to the other 6 stories** with bespoke CSS-3D centerpieces.
4. **Home upgrades** (receipts, stack rail, ghost-metric statements, section rail, 9-card film strip).
5. **New `/en|ar/work/my-resume`** (the 9th, "Career OS / built in the open" page).
6. **Perf + a11y + Lighthouse pass** (code-split engine, AA contrast fixes).

## 2. Architecture (how it works)

### Motion stack — Lenis + GSAP ScrollTrigger, CODE-SPLIT
- `src/lib/motion.ts` — the core. **GSAP + ScrollTrigger + Lenis are dynamically
  imported only on desktop with motion enabled** (`loadEngine()`); on mobile (≤820px)
  or `prefers-reduced-motion`, they NEVER load and the spine/home render GSAP-free
  static end-states (`renderStoryStatic`/`renderHomeStatic`). This keeps ~132KB off
  the mobile path. `initMotion()` is async, called by `BaseLayout` `boot()` on load +
  every `astro:page-load`; rebuilds on debounced resize. `getST()` returns the loaded
  ScrollTrigger (or null). `[data-px]` depth-parallax is light + transform-only,
  skipped under reduced-motion/mobile.
- `src/lib/storyscroll.ts` — the spine driver: pins + scrubs the **Build** and **Proof**
  beats. `src/lib/home.ts` — the **film strip** pin/scrub + the scroll-computed
  **section rail**.
- The old `src/lib/interactions.ts` primitives (`.reveal`, `[data-count]`,
  `.nav.scrolled`, `.progress`) are unchanged and still drive reveals + count-ups.

### The reusable spine — `src/components/work/spine/`
`Spine` (marker `[data-spine]`) wraps the 5 beats a story composes:
- `Hook` — full-screen badge / headline / hero number; parallax ghost numeral (`[data-px]`),
  glow drift, staggered `.reveal`.
- `Brief` — layered context; left copy + a slotted right artifact (device/stat card).
- `Build` — **pinned + scrubbed**; items reveal one-by-one (`stepBuild`, active at `p≥i/n`)
  + a progress bar.
- `Proof` — **pinned**; holds the bespoke centerpiece slot. The engine exposes scrub
  progress as a CSS var **`--q` (0→1)** on the section; centerpieces read it in CSS.
- `Honesty` — sourcing note + a colour-wipe **hand-off** teasing the next story's accent.
- `AssetSlot` — the marked 16:10/16:11 screenshot placeholder (dashed + hatch + glow +
  `▦ ASSET SLOT`). Pass `src` to fill it with a real image.

**DOM contract (the JS keys off these):** `[data-spine]`; Build = `[data-build]`
(+ `data-mult`) › `[data-build-sticky]` › `[data-build-item]` + `[data-build-bar]`;
Proof = `[data-proof]` (+ `data-mult`, `data-center`) › `[data-proof-sticky]`; depth
parallax = `[data-px="<speed>"]`; centerpieces read `var(--q)`.

### Centerpieces — `src/components/work/centerpieces/` (CSS-3D, no WebGL)
One per story, driven by `--q` in CSS. Only **CostFall** (meta-ads) and **Climb**
(al-maali) also need JS (text/number changes) — handled in `storyscroll.ts`'s
`makeProof()` by `data-center="cost-fall"|"climb"`. The rest are pure-CSS off `--q`:
`TabsFan` (crm), `Mosaic` (brand-system), `DeviceRotate` (sheep-app), `Pipeline`
(hr-system), `BrowserDials` (medmac-website), `Orbit` (ai-workflow), `LaneFlow`
(my-resume). All RTL-aware (logical props + `<bdi>`; rotateY sign flips) and have
reduced-motion/mobile fallbacks (`--q=1` end-state).

### Each story = a thin wrapper
`MetaAds.astro` … `MyResume.astro` build a config from their **existing real `{en,ar}`
copy + numbers** and compose the beats + their centerpiece + the optional `FilmEmbed`
tail. `FilmEmbed` is now a collapsed, lazy `<details>` with just the interactive
`/films/*.html` (cartoon explainer removed).

### Design system — `src/styles/tokens.css`
9-domain accents via `body[data-accent]` (blue/red/green/violet/teal/yellow/indigo/
orange/resume); the hex palette is also exported as `accentHex` in `projects.ts` (used
for inline card colours). **Indigo lightened `#5e5ce6`→`#7574ee`** for AA small-text.
JetBrains Mono Variable + Inter Variable; IBM Plex Sans Arabic trimmed to 3 weights
(400/600/700). `--ink-3` bumped to an AA-safe shade. Decorative ghost numerals are
`::before` pseudo-elements (a11y-excluded).

### Home — `src/pages/[lang]/index.astro` + components
`Statements` (ghost metric + stat per line), `Metrics` (optional `receipt` sparkline),
`About` → `StackRail` (replaced the orbit; orbit kept in `Team`'s converge graphic),
`RailNav` (desktop section index), and `ProjectsGrid` is now the pinned **9-card film
strip** (`[data-filmstrip]`, stacked-grid fallback on mobile/reduced). `[data-home-motion]`
on the `#work` section gates the home scenes.

## 3. Verification status
- **Build:** green, 22 pages. **Desktop Lighthouse: 100/100/100/100** across pages.
- **A11y:** 98–100 (home 100) — all contrast AA after the Phase-5 fixes.
- **Mobile Lighthouse:** EN home hit **97/100/100/100** on a clean run; the dev box
  became contention-throttled after ~20 audit runs (EN dropped 97→79 on identical
  content), so the AR-mobile number couldn't be pinned down — **re-run mobile Lighthouse
  on a fresh machine.** Arabic mobile sits a few points lower purely from the Arabic
  webfont payload.
- **Verified behaviourally** (Claude Preview, dev): spine pins/scrub (build stepping,
  cost-fall spotlight + un-tilt, climb scrub), film-strip horizontal scrub + progress
  bar, section rail, EN+AR (RTL mirrors chips/rail/film-strip/3D tilt), light theme,
  and the mobile/reduced static fallback (all content visible, no pins). Console clean.

## 4. PENDING / next steps (in priority order)
1. **Real screenshots** for the marked `AssetSlot` placeholders (16:10 / 16:11). Drop a
   `src` prop on each — search `AssetSlot` usages. This is the main "fill in real media" step.
2. **Re-run mobile Lighthouse** on a clean machine to confirm mobile 96–100 (EN was 97).
3. **Review locally**, then **deploy** only on the owner's say-so (Netlify command in
   `CLAUDE.md` §3: `npm run build && npx --no-install netlify deploy --prod --dir dist`).
4. **Open decision:** indigo accent lightened `#5e5ce6`→`#7574ee` for AA — keep, or revert
   and accept the contrast flag.
5. Optional polish: richer per-centerpiece visuals once real screenshots are in; consider
   a literal GSAP-pinned Statements (currently 5 stacked screens + ghost, not pinned).

## 5. Preview / build / deploy (IMPORTANT — the path has a space)
- **Preview (Claude tool):** `preview_start({name:"flagship"})` — uses
  `Downloads\website\run-flagship.cmd` + `.claude/launch.json` (`autoPort`). The spaced
  path breaks naive launching and the Windows short-path breaks dev CSS — the launcher
  handles it. **Animated pages time out `preview_screenshot`** → verify via
  `preview_eval`/`preview_inspect` (computed styles/DOM) or screenshot static sections.
  Programmatic scroll needs a dispatched `scroll` event to nudge ScrollTrigger; real
  wheel scrolling drives it via Lenis.
- **Build:** `npm run build` → `dist/` (run from the long path). `npm run preview` serves
  `dist` for Lighthouse. Lighthouse isn't installed; `npx -y lighthouse <url> --preset=desktop`
  works (Chrome present).

## 6. Non-negotiable rules (unchanged)
Real data only · honesty notes verbatim · AR/EN parity + correct RTL · don't edit the
self-contained films (`public/films/*`) · don't move/rename files without confirming ·
match the Apple-calm look · deploy only when the owner says so.
