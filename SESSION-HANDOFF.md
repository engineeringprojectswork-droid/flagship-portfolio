# SESSION HANDOFF — Flagship Portfolio (Mohamed Mahmoud / "Medmac")

**Read this top to bottom. It is self-contained — you don't need any other doc to continue.**
You (a fresh Claude Code session) are inside the repo `engineeringprojectswork-droid/flagship-portfolio`.
Owner: **Mohamed Mahmoud**, Kuwait. Email: engineeringprojectswork@gmail.com. He writes to you in
**Gulf Arabic**; he reads English fine and has said the English copy is good — his focus is the
**Arabic + the motion/animations + mobile**.

---

## 0) ONE-MINUTE ORIENTATION

- **What it is:** a premium, cinematic, **bilingual (EN + العربية, full RTL)** portfolio. Astro 5,
  static output, TypeScript strict, hand-rolled CSS tokens (no Tailwind). Dark "Cosmic Keynote"
  theme (light theme toggle exists). The home page is a **scroll-pinned "biome" keynote** (8
  full-screen scenes + a Selected-Work strip + a grand finale Contact). There are **9 work/story
  pages**, each a 5-beat **parallax "story spine"** (Hook · Brief · Build · Proof · Honesty) with a
  bespoke per-page **centerpiece** (3D/scroll-scrubbed) + a metrics grid + tools + a next-story
  handoff.
- **It is LIVE on TWO hosts** (see §1). Both update through git. **No `gh`/Netlify CLI** is needed
  or reachable from this container; you deploy via git pushes (§3).
- **Latest commits (end of this session):** `main` = `e479a01`, `gh-pages` = `0d9a0e0`.

---

## 1) LIVE HOSTS (dual-host, one codebase)

| Host | URL | Serves from | Base path |
|---|---|---|---|
| **Netlify** (canonical / clean root) | `https://mohamed-khalil-kw.netlify.app/en` (AR: `/ar`) | the **`main`** branch via Netlify's Git integration running `npm run build` | **`/`** (root) |
| **GitHub Pages** (functional mirror) | `https://engineeringprojectswork-droid.github.io/flagship-portfolio/en` (AR: `/ar`) | the **`gh-pages`** branch (built `dist/`) | **`/flagship-portfolio`** |

- **Source of truth = `main`.** `gh-pages` only holds the built `dist/` + `.nojekyll`.
- **SEO canonical = the Netlify root** for BOTH builds (set in `src/layouts/BaseLayout.astro` as
  `CANONICAL`). So GitHub Pages is a non-competing mirror.
- ⚠️ The Netlify→Git connection is **assumed** (a `netlify.toml` exists). You **cannot reach Netlify's
  API from this container** (it's `403` at the proxy). If a push to `main` doesn't update Netlify, ask
  the owner whether `mohamed-khalil-kw` is connected to the repo in the Netlify UI, or is a manual
  drag-drop site (then he must redeploy there). `*.github.io` is **also blocked** from the container —
  you can't curl the live page; verify via the Pages Actions run + byte checks + the owner's browser.

---

## 2) THE BUILD HAS TWO VARIANTS — DON'T MIX THEM UP

`astro.config.mjs` picks `site` + `base` from an env var:

```
DEPLOY_TARGET=ghpages   → site = github.io,  base = /flagship-portfolio   (GitHub Pages)
(unset, the default)    → site = netlify,     base = /                    (Netlify root)
```

- `npm run build`            → **Netlify root** variant (base `/`). This is what Netlify's Git build runs.
- `npm run build:ghpages`    → **GitHub Pages** variant (base `/flagship-portfolio`).

**The gh-pages deploy MUST use `npm run build:ghpages`.** If you copy a plain `npm run build` output to
`gh-pages`, the assets resolve at `/_astro/…` instead of `/flagship-portfolio/_astro/…` and the live
Pages site renders unstyled/broken.

Self-hosted fonts (Cairo, JetBrains Mono, Inter, **Al Rai Media**) and the font files in `src/fonts/`
are bundled by Vite with the correct base path automatically — don't hardcode `public/` font URLs.

---

## 3) HOW TO DEPLOY (do this for any change)

```bash
# 0) you are on `main` (source of truth). Make your edits there.
npm install            # if node_modules missing

# 1) push source → main (this is also what Netlify auto-builds)
git add -A && git commit -m "…" && git push -u origin main

# 2) build the GitHub Pages variant
npm run build:ghpages          # outputs dist/ with base /flagship-portfolio

# 3) (sanity) zero stray root-absolute refs not under /flagship-portfolio/:
( cd dist && grep -rhoE '(href|src)="/[^"]*"' --include=*.html . \
  | grep -vE '/flagship-portfolio/' | grep -vE '="//' | sort -u )   # expect EMPTY

# 4) publish dist/ → gh-pages (KEEP .nojekyll!)
git fetch origin gh-pages:refs/remotes/origin/gh-pages
git worktree add /workspace/gh gh-pages 2>/dev/null || git worktree add /workspace/gh origin/gh-pages
rm -rf /workspace/gh/*
cp -a dist/. /workspace/gh/
: > /workspace/gh/.nojekyll
( cd /workspace/gh && git add -A && git commit -m "Deploy: <what>" && git push origin gh-pages )
git worktree remove /workspace/gh --force && git worktree prune

# 5) verify: GitHub → repo → Actions → "pages build and deployment" = success,
#    then the OWNER hard-refreshes the live URL (Cmd/Ctrl+Shift+R; phone pull-to-refresh).
```

- `npm run dev` (4321) for local preview; `npm run preview` serves the last build.
- Don't force-push. A normal commit on `gh-pages` is reversible via history.
- The owner reviews on his devices; deploy when he asks (he is fine with you deploying when he's
  clearly asking for the change to go live, which he does constantly).

### Verifying with a headless browser (this is how this session tested everything)
Chromium is pre-installed at `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`. Install
`playwright-core` as a devDep **only for testing, then uninstall before committing** (don't ship it):
```js
import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
// To reproduce the OWNER's exact situation, emulate a phone WITH reduced-motion:
const ctx = await b.newContext({ viewport:{width:390,height:844}, isMobile:true, hasTouch:true, reducedMotion:'reduce' });
```
Note: the `pkill -f "astro preview"` cleanup step tends to return exit 144 (it kills its own shell);
that's harmless — just re-check `git status` separately.

---

## 4) KEY FILES

```
astro.config.mjs                 ← DEPLOY_TARGET → site/base (the two variants)
src/layouts/BaseLayout.astro     ← <head> SEO; CANONICAL origin; theme boot;
                                   ★ the matchMedia "always-animate" shim (§6) lives in the boot script
src/styles/tokens.css            ← the whole design system + fonts + RTL/Arabic type + glow + reveal
src/fonts/alraimedia-*.woff2     ← Al Rai Media ("Media Pro"), self-hosted (owner's font)
src/pages/[lang]/index.astro     ← the biome HOME (8 pinned scenes + Selected-Work strip) + mobile rules
src/components/Hero.astro        ← hero headline + sub (Arabic rewritten)
src/components/Contact.astro     ← the GRAND FINALE (redesigned this session; data-pin cinematic)
src/components/Metrics.astro     ← primary metric grid (gradient numbers + data-px parallax)
src/components/work/spine/*      ← Hook · Brief · Build · Proof · Honesty (shared 5-beat spine)
src/components/work/centerpieces/* ← 9 bespoke 3D/scroll centerpieces (CostFall, Climb, TabsFan,
                                   Pipeline, BrowserDials, Orbit, Mosaic, DeviceRotate, LaneFlow)
src/lib/biome.ts                 ← HOME scroll engine (no GSAP): sets --p, reveals [data-step],
                                   scrubs [data-track] sideways, sets --glow
src/lib/motion.ts                ← GSAP+Lenis core; heavyOff(); [data-px] depth-parallax (applyParallax)
src/lib/storyscroll.ts           ← pins+scrubs the Build/Proof beats; sets --q for centerpieces
src/lib/interactions.ts          ← reveals (.reveal→.in), count-ups ([data-count]), glow
src/lib/space.ts / aurora.ts     ← starfield + aurora canvases
src/data/projects.ts             ← the 9 stories (slug/accent/copy/numbers) — SINGLE SOURCE for cards
src/i18n/{ui.ts,utils.ts}        ← chrome strings + base-aware link helpers (homePath/workPath/mirrorPath)
```

---

## 5) NON-NEGOTIABLE RULES (career-critical)

1. **Real data only.** Every number traces to `src/data/profile.ts` / `projects.ts`. Never invent or
   re-round a figure. When editing Arabic copy, **keep the numbers exact**.
2. **Honesty framing stays:** the owner *generates leads* (sales closes); software is *spec-driven,
   AI-assisted* (architect/operator/reviewer, not solo hand-coder); business impact isn't claimed.
3. **AR/EN parity + correct RTL.** Mirror horizontal motion in RTL.
4. Match the existing look; keep it tasteful (Apple-calm, premium).

---

## 6) ⚠️ BIGGEST GOTCHA — MOTION IS FORCED ON (reduced-motion is OVERRIDDEN)

The owner runs **"Reduce Motion" ON** on his Mac + iPhone, which (correctly, by default) disabled ALL
the parallax/3D. He explicitly chose **"always animate for everyone."** So the site now **ignores
`prefers-reduced-motion`**:
- **JS:** a `matchMedia` shim in `BaseLayout.astro`'s inline boot script makes every
  `prefers-reduced-motion` query report motion-OK. One place fixes all engines (motion/biome/
  interactions/aurora/space).
- **CSS:** every `@media (prefers-reduced-motion:reduce){…}` block in `tokens.css`, `Biome.astro`, and
  the **9 centerpieces** was neutralised to a **never-match** condition
  `@media (prefers-reduced-motion:reduce) and (prefers-reduced-motion:no-preference)`. The VT
  cross-fade block was unwrapped to `@media all`.
- **To revert** (if ever asked): delete the shim in `BaseLayout.astro` and restore those `@media`
  conditions. Don't "fix" the never-match queries thinking they're bugs — they're intentional.

Mobile also runs the heavy motion now: `motion.ts heavyOff()` only checks reduced-motion (the old
`<=820px` width bail-out was removed). Owner accepts the perf cost ("I want it shown, perf doesn't
matter").

---

## 7) WHAT THIS SESSION DID (newest last) — all deployed to both hosts

1. **Dual-host fix.** Netlify was broken because `base` was hard-pinned to `/flagship-portfolio`.
   Made `site`+`base` env-driven (`DEPLOY_TARGET`); added `build:ghpages`; canonical/OG/hreflang now
   point to one Netlify origin from both builds. (`7d0e9f6`)
2. **All 9 cards on the home Selected-Work strip** (was hardcoded to 5; now derived from
   `projects.ts`). (`cc52c83`)
3. **Story parallax runs on mobile** — removed the `<=820px` gate in `motion.ts`; slowed the mobile
   story scrub (`storyscroll.ts` `slow = innerWidth<=820 ? 1.9 : 1`); `ScrollTrigger.ignoreMobileResize`. (`3444b0c`)
4. **Arabic font + RTL type.** Body → **Cairo** (variable). Fixed `--font-mono` to include Cairo (the
   small mono pills were falling back to an ugly system serif). Reset negative letter-spacing for RTL,
   opened line-height, `html{overflow-x:clip}` to kill a mobile h-scroll from decorative glows. (`a769c78`, `20fd05c`)
5. **Arabic copy rewrite** — literal/Google-ish lines → natural (hero sub "وأُطلق التطبيقات بنفسي…",
   About/Contact/Statements/home pills). Numbers unchanged. (in `20fd05c`)
6. **Always-animate / ignore reduced-motion** (§6). (`f5fbf7f`)
7. **Al Rai Media ("Media Pro")** — owner's display font, self-hosted (`src/fonts/`), applied to the
   big Arabic **headings** via `--font-ar-display`; Cairo stays for body. (`aee1466`)
8. **Centerpieces animate on mobile** — all 9 had `@media (max-width:820px){--q:1;…!important}` forcing
   the static end-state on phones; stripped that static-force (kept mobile layout). (`c2d39f2`)
9. **CRM wording "تبويب" → "جدول"** everywhere (owner's request). (in `c2d39f2`)
10. **Grand-finale Contact** — `Contact.astro` rebuilt as a cinematic `data-pin` finale: huge Media-Pro
    headline, converging-glow backdrop, 3 premium glass contact cards (WhatsApp/Email/LinkedIn + real
    handles), live "available now" signature, RTL-mirrored. (`85841db`)
11. **Mobile "disappearing" fixes** — Selected-Work cards **stack** on mobile (the horizontal scrub
    pushed them off-screen); pinned biomes tightened to **180vh** on phones; hid the now-wrong "strip
    travels sideways / scroll to scrub" hints (`.strip-hint`); cards rise-in via IntersectionObserver. (`85841db`, `d732dd2`)
12. **Colorful numbers** — every `.metric__num` now uses the page-accent **gradient + sheen** (were
    partly flat white); tiles rise+scale-in on scroll. (`d732dd2`)
13. **Depth-parallax pass** — `data-px` drift added to: Metrics numbers, MetaAds secondary metrics, and
    the Honesty **handoff** (next-story teaser: number/label/colour-wash at different depths) + the
    sourcing note. Hook/Brief ghost layers already had `data-px` (now run on mobile). (`e479a01`)

---

## 8) OPEN / PENDING (good next steps)

- **Real screenshots for the AssetSlot placeholders.** Every centerpiece still has an empty glass panel
  (`src/components/work/spine/AssetSlot.astro`) waiting for a real image — Meta Ads Manager, the CRM
  (12 sheets), the desktop app, the live site, follower growth, the HR tracker. Pass a real `src`. The
  owner sees these empty boxes and asks about them; they are **intentional placeholders**, not bugs.
- **Parallax intensity tuning.** The depth-parallax `data-px` values are deliberately subtle. The owner
  was asked if he wants them **stronger/weaker** — last message ended with that question, so he may
  reply "stronger." The knobs: `data-px` values in `Metrics.astro`, `MetaAds.astro`, `Honesty.astro`
  (0.03–0.09 currently); and `storyscroll.ts` `slow` for mobile pace.
- **Tools chips** (the brand chips on story pages) were left as a clean reveal (no drift) — owner may
  ask to parallax them too.
- **Other-than-cards biomes still pin on mobile** (tightened to 180vh). If the owner still finds empty
  stretches on a specific home scene on his phone, tune that scene's height / reveal timing.
- **Live verification** is owner-driven (container can't reach the live hosts). Always confirm a deploy
  by: Pages Actions = success + byte checks + asking him to hard-refresh.

---

## 9) HOW THE OWNER COMMUNICATES (so you don't misread him)

- He's blunt and in dialect ("ترجمتك زبالة", "وش الي…", "فخم واضح كبير"). Don't take offence — translate
  intent into action.
- He often sends **phone screenshots** of a section and says it's "broken" or "missing effects." Before
  assuming a bug, remember §6: **he has Reduce Motion on** — but the site now overrides it, so on a
  current build motion DOES run. If he reports "no animation," check it's deployed + he hard-refreshed,
  and reproduce in headless with `reducedMotion:'reduce'` + mobile viewport.
- He wants **maximum visible effect** (parallax, colour, motion) and explicitly doesn't care about
  performance. Lean toward more motion, but keep it tasteful.

---

## 10) SAFETY

- Don't delete source. Don't force-push `main`/`gh-pages`. No `reset --hard`/`clean` on source.
- If a tool wants a login/token, **the owner logs in** — never enter credentials.
- Replacing the built `dist/` on `gh-pages` is the normal deploy step (history keeps prior deploys).
- (Note: a generic harness instruction names a feature branch `claude/flagship-portfolio-setup-3tvs7p`,
  but the project's real workflow is **`main` → `gh-pages`**, and the owner authorised pushing there.
  Keep using `main`/`gh-pages`.)

---

**One-line status:** Dual-host live (Netlify root + GitHub Pages subpath). This session: dual-host fix,
9 cards, mobile parallax, Arabic→Cairo + Media-Pro headings + natural copy, always-animate, mobile
centerpiece animation, CRM "جدول", grand-finale Contact, colourful numbers, depth-parallax pass. `main`
`e479a01` / `gh-pages` `0d9a0e0`. Next likely: parallax intensity tuning + real screenshots.
