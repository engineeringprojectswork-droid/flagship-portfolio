# CONTINUE HERE — Flagship Portfolio (Cosmic Keynote) Handoff

**For:** a fresh Claude Code session continuing this site.
**Owner:** Mohamed Mahmoud (Kuwait). Email: engineeringprojectswork@gmail.com.
**Repo:** `engineeringprojectswork-droid/flagship-portfolio`
**Last updated:** 2026-06-30.

> Read this top to bottom, then jump to **§6 How to make changes & redeploy**.
> Re-check live state before acting — it may have moved since this timestamp.

---

## 1) TL;DR — what state we're in
The site is the **"Cosmic Keynote" biome design**: after the hero, **8 full-screen
scroll-pinned sections** scrub as you scroll (nebula, star-warp, synthwave grid,
aurora, software globe, comet, constellation, singularity) plus a horizontal
"Selected Work" card strip. This is built, committed, and **deployed live**.

- **LIVE:** https://engineeringprojectswork-droid.github.io/flagship-portfolio/en
  (Arabic, full RTL: `.../flagship-portfolio/ar`)
- Deployed via **GitHub Pages** from the **`gh-pages`** branch. Last Pages build
  succeeded (commit `d8a92aa`, 2026-06-30 08:33 UTC).
- Source of truth is the **`main`** branch of this same repo.

If the owner says "the scroll/parallax is missing," they are looking at an OLD
host or a cached page. Hard-refresh (Cmd/Ctrl+Shift+R). The biome scroll is the
home page itself now.

---

## 2) The project
- **Framework:** Astro v5.18.2, static output (SSG).
- **Bilingual:** English + Arabic with proper RTL.
- **Theme:** dark cosmic default; light theme via `data-theme` + token swap.
- **Routes:** `/en`, `/ar` (home), `/[lang]/work/[slug]` (9 case stories each),
  `/404`, plus a `/` root that JS-redirects to the saved/preferred locale.
- **Deploy target:** GitHub Pages **project site**, served from the
  **`/flagship-portfolio/` subpath** — this drives the base-path setup (§4).

---

## 3) Branches & where things live
| Branch | Contents | Role |
|---|---|---|
| `main` | full Astro source | edit here, rebuild from here |
| `gh-pages` | built `dist/` + `.nojekyll` | what GitHub Pages serves (live) |

**Key source files (on `main`):**
- `src/pages/[lang]/index.astro` — **the biome home page** (8 pinned sections +
  Selected Work strip + Contact). Bilingual via `ar ? '…' : '…'` ternaries.
- `src/lib/biome.ts` — **the scroll engine**. Pure passive rAF scroll listener,
  **no GSAP**. Sets `--p` (0→1 scene progress) on `[data-stage]`, fades/raises
  `[data-step]`, scrubs the `[data-track]` strip sideways, counts the
  `[data-climb]` number 9.2K→1M+, sets `--glow` (text halo / aura) on
  `[data-glow]`, and drives the `[data-bm-progress]` top bar. Honors
  `prefers-reduced-motion` (flattens to still frames).
- `astro.config.mjs` — `site` + **`base: '/flagship-portfolio'`** (§4).
- `src/i18n/utils.ts` — **base-aware** link helpers `homePath` / `workPath` /
  `mirrorPath` (all prepend `BASE`, and `mirrorPath` strips an incoming base).
- `src/data/projects.ts` — project metadata + slugs (meta-ads, al-maali, crm,
  brand-system, sheep-app, hr-system, medmac-website, ai-workflow, my-resume).
- `src/components/Hero.astro` — hero (converging light beams + pulsing core).
- `src/layouts/BaseLayout.astro` — `<head>` SEO/OG/JSON-LD, theme boot, Nav/Footer,
  starfield canvas, View Transitions.

**Design reference (the spec we matched):** `Cosmic Keynote.dc.html` — the Claude
Design output. It's the source of every biome's visuals + the scroll math. If you
need to re-derive a scene, lift its inline styles. (Owner has it in the
`for claude code` zip; ask if you need it re-shared.)

---

## 4) The base-path setup (READ before editing links/assets)
Because it's a Pages **project site**, everything is served under
`/flagship-portfolio/`. The build is made self-contained under that subpath:

- `astro.config.mjs`: `base: '/flagship-portfolio'`. Astro auto-prefixes all
  bundled assets → `/flagship-portfolio/_astro/…`.
- **Internal links must go through the helpers** (`homePath`, `workPath`,
  `mirrorPath`) — they prepend the base. Do **not** hardcode `href="/en/…"`.
- For one-off `public/` asset refs or hash links built by hand, prefix with
  `import.meta.env.BASE_URL.replace(/\/$/, '')` (BASE_URL has **no** trailing
  slash in this config). Examples already done: film iframes in
  `src/components/work/FilmEmbed.astro`, the `/404` buttons, the root redirect in
  `src/pages/index.astro`, the apple-touch-icon in `BaseLayout.astro`.
- **`.nojekyll`** must exist at the `gh-pages` root, or GitHub's Jekyll layer
  hides the `_astro/` directory and the whole site renders unstyled/dead.

**Sanity check after any build** (run from `dist/`): there should be **zero**
root-absolute refs that aren't under `/flagship-portfolio/`:
```
grep -rhoE '(href|src)="/[^"]*"' --include=*.html . \
  | grep -vE '/flagship-portfolio/' | grep -vE '="//' | sort -u
```

---

## 5) Environment constraints (why deploys go the way they do)
- **Netlify is unreachable** from the Claude build container — `api.netlify.com`
  returns `403 connect_rejected` at the proxy. So **no `netlify deploy` / CLI**
  from inside a session. (Netlify was the original target; canonical used to point
  there.) If the owner wants Netlify, the cleanest path is **connecting the repo to
  Netlify's Git integration in the Netlify UI** (Netlify builds on their servers,
  not in our container) — and that also gives a clean root domain (no base path).
- **`*.github.io` is also blocked from the container**, so a session **cannot
  curl the live page to verify**. Verify via: (a) the GitHub Pages Actions run
  conclusion = `success`, (b) byte checks on the built HTML, (c) **owner opens the
  URL in a real browser**.
- Git to GitHub works normally through the injected proxy remote.

---

## 6) How to make changes & redeploy  ← start here for new work
The source is **not** auto-present in a fresh container. Clone it:

```bash
# 1) get the source (main branch = source of truth)
git clone <flagship-portfolio remote> repo && cd repo   # main is default
npm install

# 2) edit source, then build
npm run build                # outputs dist/  (base '/flagship-portfolio' applied)

# 3) sanity-check the build (expect ZERO lines)
( cd dist && grep -rhoE '(href|src)="/[^"]*"' --include=*.html . \
  | grep -vE '/flagship-portfolio/' | grep -vE '="//' | sort -u )

# 4) publish dist/ to gh-pages (keep .nojekyll!)
git fetch origin gh-pages
git worktree add ../gh ./gh-pages 2>/dev/null || git worktree add ../gh gh-pages
rm -rf ../gh/*            # clears tracked build files (NOT .git)
cp -a dist/. ../gh/
: > ../gh/.nojekyll
( cd ../gh && git add -A && git commit -m "Deploy: <what changed>" && git push origin gh-pages )

# 5) verify: GitHub → repo → Actions → "pages build and deployment" = success
#    then OWNER hard-refreshes the live URL.
```

Notes:
- The dev preview is `npm run dev` (Astro). It serves under the base path too.
- Don't force-push. A normal commit on `gh-pages` is fully reversible via history.
- After editing source, **also commit + push `main`** so the source stays the
  source of truth and the next session can rebuild.

---

## 7) Known follow-ups / things the owner may want next
*(Owner said they have comments saved for the next session — expect a list.)*
- **SEO host:** `site` is now `engineeringprojectswork-droid.github.io`. If the
  site later moves to a custom domain or Netlify, update `site` (and possibly drop
  `base`) so canonical/sitemap/OG match the real host.
- **Hero sub-copy:** the design's hero line is "Paid, audience, brand, systems,
  software and automation — run by one operator. Scroll, and every chapter pins
  and plays." Current Hero keeps the existing lead; swap if the owner wants the
  design's exact wording.
- **Nav anchors:** `#work` lands on the Selected Work strip; `#contact` on Contact.
  `#team`/`#about` no longer exist on the home page (those sections were replaced
  by biomes). Decide whether to trim those nav items or re-add sections.
- **Arabic numerals/copy:** biome pills use Arabic-Indic digits; have a native
  reader proof the AR strings in `src/pages/[lang]/index.astro`.
- **Light theme:** verify each biome reads well in light mode (tokens re-tint via
  `--glow`/`--text-glow`/`--aura-k`, but the scene gradients are fixed colors).
- **Root-domain option:** to kill the `/flagship-portfolio/` subpath entirely,
  either rename the repo to `engineeringprojectswork-droid.github.io` (serves at
  root → remove `base`) or attach a custom domain / Netlify Git deploy.

---

## 8) Safety rules the owner cares about
- Don't delete source. Don't force-push. No `reset --hard` / `clean` on source.
- Replacing built artifacts on `gh-pages` is the normal deploy step and is fine
  (history keeps the prior deploy → reversible).
- If a tool asks for a login/token, **the owner does the login** — never enter
  credentials.
- There is a stash on the local source repo: `WIP partial strip-out before biome
  rebuild` — abandoned/incomplete; leave it unless the owner asks.

---

## 9) One-line status
**Biome design = built, on `main`, deployed to `gh-pages`, Pages build green, live
at /flagship-portfolio/. Next session: clone `main`, read §4 + §6, apply the
owner's comments, rebuild, redeploy.**
