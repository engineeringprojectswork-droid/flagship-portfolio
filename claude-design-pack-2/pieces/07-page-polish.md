# Piece 07 — Whole-page beauty passes (notes, optional but encouraged)

These are smaller, high-leverage touches that make the *whole* page feel finished — the
owner asked us to look at "the entire page" for anything to fix or make more beautiful.
You don't have to deliver separate files for these; **fold them into the relevant deliverable**
(hero/contact) or jot a short technique snippet the engineering team can port. Pick the ones
that excite you.

## A. Section-to-section transitions (the connective tissue)
Between the hero and the first biome, and between biomes, the page can feel like discrete
slides. A subtle **cross-scene continuity** would elevate it: e.g. the hero's converging core
"hands off" a spark that becomes the first biome's focal point; or a faint accent that carries
the eye downward. Anything that makes the scroll feel like **one continuous film** rather than
8 separate scenes. (Keep it cheap — transform/opacity.)

## B. A credibility / "in one person" proof beat (optional new idea)
The home goes hero → 8 skill biomes → selected work → contact. There's no single moment that
**stacks the whole story into one image** ("look how much this one person does"). If inspired,
sketch a short **convergence beat** — the 8 disciplines (paid, audience, CRM, brand, software,
automation, web, AI) as 8 labelled sparks collapsing into one — that could sit just before the
contact finale as the emotional turn. (The contact brief already hints at convergence; this is
the *setup* to that payoff. Optional.)

## C. Micro-interactions worth standardising
- **Buttons / links:** a consistent hover = lift 2–4px + accent glow + (for arrows) a 4–5px
  nudge that **mirrors in RTL**.
- **Glass cards:** consistent hover = accent border + soft accent drop-shadow.
- **Focus states:** a clean accent focus ring (keyboard users) — premium, not default-blue.
- **Scroll cue:** the hero's "Scroll" cue could breathe (slow 2.4s pulse) and fade out as the
  user leaves the hero.

## D. The "available now" liveness
The green pulsing "Available now" dot in the contact finale is a nice signal — consider echoing
that *liveness* subtly elsewhere (e.g. a tiny "live" tick on the Selected-Work "Live" label) so
the site feels **current**, not static. Keep it to one or two touches; don't overuse it.

## E. Loading / first paint
A tasteful **first-paint moment** (the hero's core igniting as the page settles, ~600–900ms)
would make arrival feel intentional. No spinner — just the hero resolving into place. Make sure
it degrades to "already visible" if JS is slow.

---

### Guardrails for all of the above
- Stay **calm and premium** — these are seasoning, not new flavours. If a touch competes with
  the headline of a scene, cut it.
- Everything **bilingual + RTL-aware** and **always-animate** (don't gate on reduced-motion).
- **Self-contained**, transform/opacity/filter only, no external assets.
- **Real data only** — none of these polish ideas should introduce a new number or claim.
