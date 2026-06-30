# DEPLOY STATUS — Cosmic Keynote

**Date:** 2026-06-30 · **Build:** ✅ green (`npm run build`, 22 pages) · **Commit:** `0e467fd`

## What shipped
The full **Cosmic Keynote** overhaul (build spec from `flagship-handoff/claude-code-package/`):
- Global deep-space field — fixed `#space` starfield canvas (`src/lib/space.ts`) + nebula body
  background, theme-aware (night space / dawn-in-orbit), reduced-motion static, tab-pause, VT-safe.
- The two-glow signature — scroll-driven `.glow-text` drop-shadow (clean ink, no constant animation)
  + the Apple-Intelligence `.glow-frame` aura around shapes, both driven by `--glow` written per
  element in `src/lib/interactions.ts` (viewport-centre proximity).
- Light **ribbon hero** (dark theme keeps the converging-core canvas); the "hero always dark" hack
  is retired and scoped to dark theme only.
- Per-section **biomes** (`src/components/Biome.astro`): nebula / aurora / grid / constellation /
  warp / comet / globe / singularity — behind the home sections and every `/work` hook,
  accent-tinted per story.

## Verification (Claude Preview, dev)
✅ Build green · ✅ dark home (cosmic hero) · ✅ light home (ribbon hero) · ✅ theme toggle repaints
canvases + re-tints stars · ✅ scroll-glow text live (`--glow` ramps; AA at rest) · ✅ shape aura live
· ✅ `/work/meta-ads` accent biome + spine + glowing number · ✅ mobile (static, no pins) ·
✅ AR / RTL mirrored · ✅ console clean (no errors/warnings) on home + work.

## Hosts

| Host | URL | Status |
|---|---|---|
| **Netlify** (mirror) | https://mohamed-mahmoud-kuwait.netlify.app | ✅ **LIVE + PUBLIC** — serving the new build (verified `#space`, `hero__ribbons`, `biome`, HTTP 200). |
| **Vercel** (primary) | https://mohamed-mahmoud-kw.vercel.app | ⚠️ New build deployed to **production** (current deployment, `● Ready`) **but gated by Deployment Protection** — the public sees a "Login – Vercel" wall. The owner sees the site because they're logged into Vercel. |

### ⚠️ Action required for Vercel (owner, ~1 click)
The `mohamed-mahmoud-kw` project has **Vercel Authentication / Deployment Protection** turned on, so
every URL (production included) requires a Vercel login. This means the "primary/canonical" Vercel
site is currently invisible to the public **and to search-engine crawlers** — and the canonical/OG
tags point at this Vercel URL. To make it public:

> Vercel dashboard → project **mohamed-mahmoud-kw** → **Settings → Deployment Protection** →
> set **Vercel Authentication** to **Off** (or "Only Preview Deployments") → **Save**.

Once off, `mohamed-mahmoud-kw.vercel.app` serves the exact same Cosmic Keynote build that's already
live on Netlify — no redeploy needed. (I did not change this setting myself: it's an account-level
security toggle, and disabling it also exposes preview deployments.)

## Still pending (non-blocking — the site is live)
1. **Real screenshots** for the marked `▦ ASSET SLOT` placeholders. The 8 existing
   `public/img/work/*` ad creatives fill the Brand & Content slots; the owner still owes 6 private
   shots (Meta Ads Manager, CRM workbook, Al-Maʿali analytics, SheepFarm app, HR tracker, a Claude
   Cowork session) + 2 Brand (AI ad concept, restored legacy photo). Drop a `src` on each `AssetSlot`
   → quick fill + redeploy.
2. **Lighthouse re-check** on a clean machine (desktop was 100/100/100/100 pre-Cosmic; changes are
   additive CSS + one cheap starfield rAF + a throttled, dataset-gated glow pass).
3. **Pin model note:** the owner chose "pin every section." Shipped as the pinned filmstrip + all 9
   work Build/Proof pins + cinematic statement scenes + biomes everywhere; connective home sections
   use scrub-reveal-in-flow (left off hard-pin for mobile-Lighthouse safety). The `.pin`/`.pin__stage`
   scaffold is in `tokens.css` to pin additional sections per-section when desired.
