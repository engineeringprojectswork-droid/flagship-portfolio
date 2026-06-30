# Piece 01 — The Hero  →  `hero.html`

The first frame of the whole experience. Right now it's a soft aurora + a few light
"ribbons" converging on a glowing core, with the headline centred over it. It's nice,
but it's the **one thing every visitor sees first**, and the owner wants it to land
like the opening shot of a keynote — a genuine *"oh."*

Deliver a **full-viewport** (`100vh`), bilingual, self-contained hero demo. The
engineering team will port your markup + CSS into the live `Hero.astro`.

---

## The idea: "a whole team, in one person — converging into light"

The headline is *"A whole marketing team. In one person."* Let the **visual say the
same thing**: many distinct coloured streams / sparks / threads (each one a discipline
— ads, audience, brand, software, automation) flowing inward and **converging into a
single radiant core** behind the name. One person; many forces; one point of light.

You have the signature spectrum to work with — **pink → violet → blue → cyan**
(`#ff5e8a, #a259ff, #2997ff, #64d2ff`). Keep the black deep so the light reads.

Ideas (pick/combine — your call):
- A refined version of the **converging ribbons** into a breathing core, but richer:
  more depth, parallax layers, a subtle bloom that pulses slowly (6–7s).
- A **constellation/particle field** where points drift and faint lines connect, with
  a few accent particles streaming toward the core.
- A slow **aurora wash** behind, with a crisp converging-core foreground.
- A tasteful **kinetic headline**: "In one person." resolves with a per-word or
  gradient-sweep entrance (you invented a lovely per-line technique in pack #1 — this is
  the place to use that energy on the hero, but keep it elegant, not flashy).

Whatever you choose: **calm, premium, deep, alive.** Not a particle explosion. Think
Apple Intelligence shimmer, not a screensaver.

---

## Exact copy (use verbatim)

**Eyebrow (name line):** `MOHAMED MAHMOUD · Kuwait`  /  AR: `محمد محمود · الكويت`

**Headline (two lines; second line is the gradient/spectrum line):**
- EN: `A whole marketing team.` / `In one person.`
- AR: `فريق تسويق كامل.` / `في شخص واحد.`

**Lead (sub-headline):**
- EN: `I run the ads, produce the content, build the CRM, and automate the rest with AI — and I ship the software too.`
- AR: `أُدير الحملات الإعلانية، وأُنتج المحتوى، وأبني نظام إدارة العملاء، وأُشغّل بقية العمل آليًا بالذكاء الاصطناعي — وأُطلق التطبيقات بنفسي أيضًا.`

**Two buttons:**
- Primary: EN `See the work →` / AR `شاهد الأعمال ←` (note the arrow flips in RTL)
- Ghost: EN `Get in touch` / AR `تواصل معي`

**Scroll cue (bottom):** EN `Scroll` / AR `مرّر للأسفل`

---

## Direction & constraints

- **Spectrum line:** style `In one person.` / `في شخص واحد.` as the gradient/animated
  line (the spectrum). The first line stays solid ink (`#f3f4ff`).
- **Centre the composition.** Headline + lead + buttons stacked, max width ~46ch (EN) /
  ~38ch (AR), centred. Visual lives behind/around it, full-bleed.
- **Buttons:** primary = accent-filled (a confident blue→violet), ghost = hairline glass.
  Hover lifts + glow.
- **Bilingual:** read `?lang=ar`, set `dir="rtl"`, swap copy, **mirror the arrow** on the
  primary button and any directional motion. Bump Arabic type ~8% / open the line-height.
- **Always animate** (see DESIGN-SYSTEM §4) — don't disable on reduced-motion.
- **Performance-friendly:** transform/opacity/filter only; one canvas or SVG is fine, but
  keep it a single cheap rAF. No external assets.
- **Top nav:** leave ~64px clear at the top (a fixed nav sits there on the live site).
- ❗ **No portrait photo.** There is no headshot to use — the hero is **typographic +
  light**, not a photo. Don't design around an image slot.

**Goal:** when the owner opens the page on his phone and his laptop, the hero alone
should make him want to show it to someone.
