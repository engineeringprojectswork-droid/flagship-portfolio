# DEPLOY STATUS — Cosmic Keynote (audit-fix pass)

**Date:** 2026-06-30 · **Build:** ✅ green (`npm run build`, 22 pages) · **Commit:** `c12f7e2`

## What shipped this pass
A full read-only audit (code + live site, 7 dimensions) plus a visual scroll-through
found and fixed the issues behind the "full of issues on scroll" report:

**Critical / high (visible breakage)**
- **SEO canonical** — `astro.config.mjs` `SITE` pointed at the login-walled Vercel host,
  so every public page declared an **uncrawlable** canonical/OG/hreflang/JSON-LD. Now
  points at the public **Netlify** origin (matches robots.txt + sitemap). One-line root fix.
- **Mosaic** (brand-system Proof) — a local `--q:0` on `.mosaic__wall` shadowed the engine
  scrub var, freezing the tiles **scattered + faded forever** on desktop. Removed it → tiles
  assemble on scroll again.
- **BrowserDials** (medmac Proof) — used `var(--q,0)` instead of `,1`, so the Lighthouse dials
  rendered **empty rings + a fully-tilted frame at rest**. Now show the assembled 96/100/100/100.
- **Metric sparklines** — `.metric` had no positioning context, so each `.metric__spark`
  escaped and **stretched across the whole row**. `position:relative;overflow:hidden`.
- **Biomes over text** — Team/About/Contact content sat *under* its sibling biome
  (`.section` now `position:relative;z-index:1`).
- **Light-theme AA** — accent small text (kickers/eyebrows/build numbers) was unreadable on
  the pale surface. New `--accent-ink` token (darkened on light) + handoff override; hook
  caption + railnav moved off hardcoded grays.

**Polish**
- **AssetSlot redesign** — the empty state is no longer a dashed "screenshot · 16:10"
  placeholder; it's an intentional accent **glass panel** (gradient + dot-grid + sheen). This
  lifts the home film strip (9 cards) and every centerpiece "screen". `src=` still drops a real
  image in with no layout shift.
- Glow aura collapses **fully** at rest (was a permanent tri-colour halo floor).
- Orbit AssetSlot rules needed `:global` (were dead, overlapped the hub).
- Pager prev/next arrows flip in Arabic; Lenis is torn down on mobile/reduced-motion so a
  desktop→mobile resize no longer leaves smooth-scroll hijacking; hero parallax rAF-batched;
  `theme-color` light variant; Person JSON-LD localized on `/ar`; 404 `noindex` + valid accent.

Verified in preview: EN/AR + RTL, light/dark, mobile, both fixed centerpieces, console clean.

## Hosts (both live, both serving this build)

| Host | URL | Status |
|---|---|---|
| **Netlify** (public canonical) | https://mohamed-mahmoud-kuwait.netlify.app | ✅ **LIVE + PUBLIC** — canonical/OG now self-reference this origin. Verified HTTP 200, `asset-slot__art` present, no placeholder text. |
| **Vercel** (mirror) | https://mohamed-mahmoud-kw.vercel.app | ✅ Deployed (production, READY) **but still gated by Deployment Protection** — the canonical domain returns a Vercel SSO wall to the public. The deploy's alias **https://flagship-rebuild.vercel.app is public (HTTP 200)** and serves the same build (canonical → Netlify). |

**Canonical strategy:** Netlify is now the single public canonical (SITE = Netlify). The Vercel
mirror serves the same content with a canonical that points back at Netlify, so there's no
duplicate-content conflict even while Vercel is protected.

### ⚠️ Optional owner action (1 click) — only if you want the Vercel domain public
Vercel dashboard → project **mohamed-mahmoud-kw** → **Settings → Deployment Protection** →
**Vercel Authentication → Off** (or "Only Preview Deployments") → Save. Not required: Netlify is
already the public host and the SEO canonical. (Left untouched — it's an account security toggle.)

## Deploy commands (run from the long path)
```
npm run build
npx --no-install netlify deploy --prod --dir dist
npx --no-install vercel deploy --prod --yes
```

## Known minor (non-blocking, pre-existing)
- Netlify 301s `/en` → `/en/` (trailing slash) while the canonical is slash-less; Google
  follows the 301 so it resolves fine. Not changed: flipping `trailingSlash` would ripple
  through the custom path utils (workPath/mirrorPath) across 22 routes.
- Real `AssetSlot` screenshots are still optional — the redesigned glass panels are a finished
  look, but dropping a `src` on any slot fills it with a real image (no layout shift).
