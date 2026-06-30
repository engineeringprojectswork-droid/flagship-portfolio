# 🎬 HANDOFF — Integrate the Claude Design output (read me first)

**You are picking up a fresh session.** The user will **upload a ZIP** containing
HTML produced by **Claude Design**. Your job: **integrate those files into this
live Astro site, verify them, and deploy to both hosts.** This doc tells you
exactly how. (General project context lives in `CLAUDE.md` / `continue.md`; this
file is the task-specific handoff.)

---

## 0. TL;DR of what to do
1. Unzip the user's upload (Claude Design output).
2. Expect up to **7 HTML deliverables** (list in §3). Drop the per-project + showcase
   scenes into `public/films/`; the line-animation one is a **technique to port**, not a file to ship.
3. Wire each scene into its place (§4).
4. **Build → verify in headless Chromium (EN + AR, mobile + desktop) → deploy to BOTH hosts** (§5–6).
5. Keep AR/EN parity and **real-data-only** (never invent numbers). See §7 gotchas.

---

## 1. What this project is (30-second version)
Premium bilingual (EN + Arabic/RTL) **Astro 5** portfolio for **Mohamed Mahmoud
("Medmac")**, a one-person marketing+software team in Kuwait. Dark "cosmic keynote"
look, scroll-driven parallax. Static output, TypeScript strict, hand-rolled CSS
tokens (`src/styles/tokens.css`), no Tailwind. Home page = a vertical sequence of
full-screen "biome" sections + a "Selected Work" showcase + Contact. Each of 9
project stories lives at `/[lang]/work/[slug]` and embeds a self-contained HTML
"film" via an iframe.

## 2. What was just done (already live on both hosts)
Last commit `a7354a5`. This session shipped: iPhone viewport fix; read-along word
highlight on project briefs; animated hero "In one person" + project hook headlines;
**4 meaningful biome backgrounds** (targeting / brand-assembling / AI-pipeline /
live-browser); and **cinematic per-accent Selected-Work poster cards**. All verified
in headless Chromium and deployed.

The Claude Design pack was created to take the work further — that's what's coming back.

## 3. The 7 Claude Design deliverables (what the ZIP should contain)
The brief that produced these is the pack we sent the user (PROMPT.md + projects/*.md).
Expected files (names may vary slightly — match by purpose):

| Output file | Purpose | Destination |
|---|---|---|
| `crm.html` | CRM scene (lead pipeline metaphor) | `public/films/crm.html` (replaces existing) |
| `desktop-app.html` | Desktop app (schema → 59/59 tests → CI ships) | `public/films/` → wire into `SheepApp.astro` (currently `sheep.html`) |
| `website.html` | Production website (Lighthouse 96–100) | `public/films/` → `MedmacWebsite.astro` (currently `medmac-website.html`) |
| `hiring.html` | Hiring autopilot (142→100→8 + daily clock) | `public/films/` → `HrSystem.astro` (currently `hr-system.html`) |
| `three-ai-tools.html` | One person, 3 AI tools (controller + 23→4 tenders) | `public/films/` → `AiWorkflow.astro` (currently `ai-workflow.html`) |
| `selected-work.html` | ⭐ ALL-9 showcase, replaces the home card strip | home `#work` section (see §4) |
| `line-animations.html` | Per-line statement entrances — a **technique demo** | PORT into `.bm-h` headlines (see §4) |

If the user only sends some of them, integrate what's there; don't block on the rest.

## 4. Where each piece goes

### Per-project scenes (crm / desktop-app / website / hiring / three-ai-tools)
1. Copy the HTML into `public/films/` (keep names simple). 
2. In the matching work component, point `<FilmEmbed film="…">` at the new file:
   - `src/components/work/Crm.astro` → `film="crm.html"`
   - `src/components/work/SheepApp.astro` → `film="<new>.html"` (was `sheep.html`)
   - `src/components/work/MedmacWebsite.astro` → was `medmac-website.html`
   - `src/components/work/HrSystem.astro` → was `hr-system.html`
   - `src/components/work/AiWorkflow.astro` → was `ai-workflow.html`
   `FilmEmbed` (`src/components/work/FilmEmbed.astro`) iframes `/films/<file>` and
   passes the locale so the scene can read `?lang=ar`. Confirm the scene honors it.
3. **Self-contained check:** the scene must have NO external network calls and use
   **relative** asset paths only (the GitHub Pages host serves under a
   `/flagship-portfolio/` base — absolute `/foo` paths break there). Inline everything.

### `selected-work.html` (the all-9 showcase — replaces the home strip)
- The current Selected Work lives in `src/pages/[lang]/index.astro` — the
  `<section id="work" data-pin>` block (cinematic `.wcard` poster cards + the
  `[data-track]` scrub). You will REPLACE that presentation with the new showcase.
- Two integration options depending on what Claude Design returned:
  - If it's a polished self-contained scene → embed it (iframe) full-bleed in place
    of the current `#work` inner content, OR port its markup/CSS natively.
  - Each tile exposes `data-slug="<slug>"`; map slug → real route with
    `workPath(lang, slug)` (from `src/i18n/utils`). The 9 slugs in order: meta-ads,
    al-maali, crm, brand-system, sheep-app, hr-system, medmac-website, ai-workflow, my-resume.
- **Critical behavior the user wants:** vertical scroll drives horizontal travel in
  the **reading direction** (English → left-to-right, Arabic/RTL → right-to-left), OR
  an all-9-at-once big layout. Verify the RTL direction actually flips.
- Keep the existing mobile niceties working (no horizontal page overflow; the page
  uses `overflow-x:clip`).

### `line-animations.html` (technique — do NOT ship the file)
- This is a reference demo of a unique entrance per home statement line. PORT the
  technique onto the real headlines: the 8 `.bm-h` (and the climb line) inside the
  biome sections of `src/pages/[lang]/index.astro`.
- Those headlines are driven by `src/lib/biome.ts`, which sets `--p` (0→1 scroll
  progress) on each `[data-stage]` and currently reveals `[data-step]` via opacity +
  translateY. Integrate the per-line word choreography so it's driven by `--p` (or an
  entrance trigger) WITHOUT breaking the existing reveal/glow.
- **Arabic rule (must-keep):** Arabic is cursive — never split Arabic into per-letter
  spans (it breaks the joins). Per-WORD only for `dir="rtl"`. Preserve the real text
  for screen readers. Respect `prefers-reduced-motion` (the site neutralizes it on
  purpose, but the entrance should still degrade gracefully).
- ⚠️ Do **not** disturb biome 02 "I grow the audience" — its 9.2K→1M climbing number
  is a signature the user loves. A tasteful text entrance is fine; don't fight the counter.

## 5. Build & verify (do this BEFORE deploying — the user values verified work)
```bash
npm install            # fresh clone
npm run build          # Netlify-base build (must be green, 22 pages)
npm run preview        # serves dist at http://localhost:4321  (run in background)
```
Headless Chromium is preinstalled (do NOT run `playwright install`):
```bash
cd /tmp && npm init -y && npm install playwright-core
# browser binary:
/opt/pw-browsers/chromium-1194/chrome-linux/chrome   # (or find the chrome-linux/chrome under /opt/pw-browsers)
```
Drive it with a small playwright-core script (launch with `executablePath` above).
Verify at **390×844 (mobile)** and **1280×800 (desktop)**, for **/en and /ar**:
- each new scene renders, animates on scroll, and reads its `?lang=ar` for RTL;
- the Selected Work showcase scrolls in the correct reading direction (LTR vs RTL);
- the line animations enter per-line; Arabic stays per-word (joins intact);
- no console errors; no horizontal overflow.
You **cannot fetch the live URLs from this sandbox** (the proxy returns 403 for
`*.github.io` / netlify) — that's expected. Verify locally; the user confirms live.

## 6. Deploy to BOTH hosts (the real, working procedure)
Dual host. **Netlify** auto-builds from **`main`** (git push). **GitHub Pages** serves
prebuilt output from the **`gh-pages`** branch. There are **no GitHub Actions** and no
Netlify CLI creds in the sandbox — so:

```bash
# 1) commit your work on your feature branch, then land it on main for Netlify
git push -u origin <your-branch>
git branch -f main HEAD && git push origin main          # → Netlify rebuilds

# 2) GitHub Pages: build with the ghpages base and push dist to gh-pages
npm run build:ghpages                                    # DEPLOY_TARGET=ghpages, base=/flagship-portfolio
git branch -f gh-pages origin/gh-pages
git worktree add ../gh-pages-deploy gh-pages
find ../gh-pages-deploy -mindepth 1 -maxdepth 1 ! -name '.git' -exec rm -rf {} +
cp -r dist/. ../gh-pages-deploy/ && touch ../gh-pages-deploy/.nojekyll
( cd ../gh-pages-deploy && git add -A && git commit -m "Deploy: <msg>" && git push origin gh-pages )
cd <repo> && git worktree remove ../gh-pages-deploy --force
```
- Live: **GitHub Pages** → https://engineeringprojectswork-droid.github.io/flagship-portfolio/
  · **Netlify** → the `SITE` in `astro.config.mjs` (currently `mohamed-khalil-kw.netlify.app`).
- The CSS bundle hash changes on every content change, so browsers cache-bust
  automatically — tell the user to hard-refresh.
- ⚠️ When removing the worktree, don't `cd` into it first or the shell loses its cwd.
  Push happens before removal, so a cwd error after the push is harmless.

## 7. Non-negotiable gotchas
- **Real data only (career-critical).** Every number must trace to the existing copy
  (`src/data/projects.ts`, the work components, or the pack's `projects/*.md`). Never
  invent, round into a new claim, or add an unverified metric.
- **AR/EN parity + correct RTL** everywhere you touch.
- **Self-contained films + relative paths** (the `/flagship-portfolio/` base will break
  absolute asset URLs on GitHub Pages).
- **Don't deploy unless the user is ready** — but they've been saying "publish on both",
  so confirm and go.
- Match the calm Apple-keynote aesthetic; don't make it gaudy.

## 8. Branch note
This session worked on `claude/iphone-display-issue-c5ngkj` (everything is also on
`main`). Your fresh session may be assigned a new branch — follow whatever branch
instructions you're given, develop there, then land on `main` + `gh-pages` to deploy
per §6.

---
*Created at the end of the session that shipped the iPhone fix, read-along briefs,
animated headlines, the 4 biome metaphors, and the cinematic Selected-Work cards —
and authored the Claude Design pack whose output you're now integrating.*
