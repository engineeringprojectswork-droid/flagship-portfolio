# Piece 02 — The Contact Finale  →  `contact.html`

The last frame. After the whole scroll-keynote, this is the closing shot and the
call to action. It currently exists as a decent "converging glow + three glass cards"
finale — your job is to make it **feel like the credits of a great film**: the biggest,
calmest, most confident moment on the page. It should make hiring him feel obvious.

Deliver a **full-viewport** (`100vh`), bilingual, self-contained demo. The engineering
team ports your markup + CSS into the live `Contact.astro`.

---

## The idea: "everything converges → one offer"

This mirrors the hero (bookend). The hero scattered light **into** a person; the finale
gathers the whole story **into a single offer**: *Hire one. Get a team.* Let the
background be a grand convergence — all the project accents (blue, pink, violet, green,
cyan, gold) drawing inward into a warm white core behind the headline. Slow, cinematic,
luminous. Multi-accent (this is the one place all the colours meet).

---

## Exact copy (use verbatim)

**Kicker:** EN `Let's talk` / AR `لنتحدّث`

**Headline (two lines, huge):**
- EN: `Hire one.` / `Get a team.`
- AR: `وظِّف واحدًا.` / `واحصل على فريق.`

**Lead:**
- EN: `Open to marketing, marketing-ops, and AI-automation roles in Kuwait & the GCC.`
- AR: `متاحٌ لوظائف التسويق وعملياته وأتمتة الذكاء الاصطناعي في الكويت ودول الخليج.`

**Three contact cards** (keep all three; each is a glass panel with an icon, a label,
and a sub-line; the whole card is a link):

| Channel | Label | Sub-line (EN) | Sub-line (AR) | Link target |
|---|---|---|---|---|
| WhatsApp | `WhatsApp` | `the fastest way to reach me` | `أسرع طريقة للوصول إليّ` | `https://wa.me/96599338996` |
| Email | `Email` | `medo433447@gmail.com` | `medo433447@gmail.com` (LTR) | `mailto:medo433447@gmail.com` |
| LinkedIn | `LinkedIn` | `my professional profile` | `ملفي المهني` | `https://www.linkedin.com/in/mohamed-mahmoud-5a748b243` |

**Signature line (with a live "available" pulse dot):**
- EN: `Available now · Kuwait & the GCC`
- AR: `متاحٌ الآن · الكويت ودول الخليج`

Icons must be **inline SVG** (no icon font). Simple glyphs: WhatsApp mark, an envelope,
the LinkedIn mark. A small green pulsing dot sits before the signature line.

---

## Direction & constraints

- **Headline** is the biggest type on the entire site — `clamp(44px, 9vw, 120px)`,
  weight ~850, line-height 1. Make `Get a team.` the gradient/accent line.
- **Convergence background:** several large blurred accent blobs + a soft white core,
  scaling/intensifying as the section enters (you can drive it off a `--p` 0→1 progress
  variable; the engine sets that on scroll — at rest assume `--p:1` looks complete).
- **The three cards:** glass, equal, in a responsive row (stack to 1 column ≤820px).
  Hover = lift + accent border + accent shadow + the trailing arrow nudges. The arrow is
  `→` in EN and `←` in AR.
- **Email sub-line stays `dir="ltr"`** even in Arabic (it's an address). WhatsApp/LinkedIn
  sub-lines translate.
- **Bilingual + RTL mirroring** throughout. Bump Arabic type / open line-height.
- **Always animate**; transform/opacity/filter only; self-contained; ~64px nav clearance
  isn't needed here (this is the bottom of the page) but keep top padding generous.

**Goal:** a calm, enormous, luminous closing statement — the page exhales here.
