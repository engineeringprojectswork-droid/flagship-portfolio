# 🎬 Claude Design — Pack #2: finish the portfolio (read me first)

Hi Claude Design. You already designed the **first** wave of scenes for this
portfolio (the CRM / desktop-app / website / hiring / 3-AI-tools films, the
Selected-Work showcase, and the per-line statement technique) — and they were
**brilliant**. The owner loved them so much he wants you to finish the job.

This pack is **everything that first wave did NOT touch.** Nothing here overlaps
with what you already designed. Your mission: bring the **same cinematic quality**
to the pieces that are still on the old, plainer treatment — the **hero**, the
**contact finale**, the **three remaining project films**, a **new ninth film**,
and a short list of **whole-page beauty passes**.

---

## 0. TL;DR — what to deliver

Produce these **self-contained HTML files** (all CSS + JS inline, no build step,
no external network calls, no frameworks). Match by purpose; names can vary.

| # | File | What it is | Brief |
|---|---|---|---|
| 1 | `hero.html` | The **home hero** — the first thing anyone sees. Make it a showpiece. | `pieces/01-hero.md` |
| 2 | `contact.html` | The **grand-finale contact** section ("Hire one. Get a team.") | `pieces/02-contact.md` |
| 3 | `meta-ads.html` | Project film — **Paid Social** (leads under a dollar) | `pieces/03-film-meta-ads.md` |
| 4 | `al-maali.html` | Project film — **Audience Growth** (0 → 1M+ followers) | `pieces/04-film-al-maali.md` |
| 5 | `brand-system.html` | Project film — **Brand & Content** (a whole content engine) | `pieces/05-film-brand-system.md` |
| 6 | `my-resume.html` | **NEW** film — **Career OS** (one person, three AI tools — this very site) | `pieces/06-film-my-resume.md` |
| 7 | *(notes only)* | **Whole-page beauty passes** — small, high-leverage polish ideas | `pieces/07-page-polish.md` |

If you only finish some of them, that's fine — each is independent. Quality over
quantity. **Read `DESIGN-SYSTEM.md` before you start** — it has the exact look,
the colour-per-project map, the bilingual rule, and the *film contract* (the
shared player chrome every film must match).

---

## 1. What this project is (60 seconds)

A premium, **bilingual (English + العربية, full RTL)** portfolio for
**Mohamed Mahmoud — "Medmac"** — a one-person marketing **and** software team in
**Kuwait**. The pitch: *"A whole marketing team. In one person."* He runs the paid
ads, grows the audiences, builds the CRM, ships desktop/web software, and automates
the rest with AI.

The site is a dark **"cosmic keynote"**: a near-black canvas, a starfield, gradient
auroras, and a vertical sequence of full-screen **"biome" scenes** that animate on
scroll — one per skill — ending in a **Selected-Work** strip and a **Contact**
finale. Each of **9 project stories** lives on its own page as a 5-beat parallax
"spine", and each ends with an optional **interactive film** (that's what you're
making) the visitor can open and step through.

It's live, it's real, and **every number on it is true** (see §3). This is a
career-critical hiring asset — it has to feel like Apple shipped it.

---

## 2. The aesthetic, in one breath

Apple-keynote calm, not gaudy. Near-black backgrounds (`#06060a`–`#0a0a12`), soft
gradient blooms, glass panels, generous negative space, one confident motion per
beat. Big, tight-tracked display type. Colour is used as *accent and light*, never
as flat fill. When in doubt: fewer elements, more space, slower motion, deeper black.

**Full design system, colours, fonts, motion language, and the film contract are in
`DESIGN-SYSTEM.md`. Read it next.**

---

## 3. ⛔ NON-NEGOTIABLE RULES (career-critical — please honour all four)

1. **Real data only.** Every number is given to you verbatim in each brief. Use
   them **exactly**. Never invent a metric, never re-round a figure into a new
   claim, never add a number that isn't in the brief. (Example the team caught
   before: a "24% live" stat that was really 4/23 = 17% — it got removed. That's
   the bar.)
2. **Honesty framing stays.** Mohamed *generates the leads* — the company's sales
   engineer prices and closes — so the films report **leads, not revenue**. The
   software is **spec-driven and AI-assisted** (he's the architect/operator/reviewer,
   not a solo hand-coder). Business impact isn't measured, so it isn't claimed. Keep
   any "honest credit" line you're given intact.
3. **Bilingual + correct RTL.** Every piece must work in **English and Arabic**.
   Arabic reads **right-to-left** and any horizontal motion must **mirror**. The
   exact Arabic copy is in each brief — use it verbatim. **Never split Arabic into
   per-letter spans** (it breaks the cursive joins) — per-**word** only.
4. **Self-contained.** One HTML file each. All CSS/JS inline. **No external fonts,
   scripts, images, or network calls. No absolute `/asset` paths.** These get
   embedded on a host served under a `/flagship-portfolio/` sub-path, so anything
   absolute breaks. Inline everything; draw visuals with CSS/SVG/canvas.

---

## 4. How these get used (so you design for the right frame)

- **The 4 films** (`meta-ads`, `al-maali`, `brand-system`, `my-resume`) are embedded
  in a **16:9 iframe** at the end of each story page, opened from a "explore it
  yourself" toggle. They are **self-playing scene players** with chapter dots — the
  exact shared chrome is specced in `DESIGN-SYSTEM.md → The Film Contract`. Match it
  so all 9 films feel like one set. The page passes the language as **`?lang=ar`** on
  the iframe URL — your film must read that and switch.
- **The hero and contact** are **full-bleed page sections** (not iframes). Deliver
  them as standalone HTML demos anyway — the engineering session will port your
  markup + CSS into the site's components. Design them **full-viewport** (`100vh`),
  responsive, and bilingual. Assume a fixed top nav ~64px tall.

You don't need to wire anything up or match file paths — just make each file
**beautiful, correct, bilingual, and self-contained.** The engineering session
(Claude Code) integrates, verifies in headless Chromium at mobile + desktop for
EN + AR, and deploys. Hand back clean HTML and it takes it from there.

---

## 5. Where to look

- `DESIGN-SYSTEM.md` — **read this second.** Colours, type, motion, the film contract.
- `pieces/01…07` — one brief per deliverable, each with **exact copy (EN + AR),
  exact numbers, the accent colour, and a scene-by-scene story.**
- `reference/` — the **current** versions of the three films you're upgrading
  (`meta-ads`, `al-maali`, `brand-system`), plus a `FILM-FORMAT-REFERENCE.html`
  (a clean copy of the player chrome to match). Open them to feel the bar and the
  shared mechanics — then make them better.

Thank you — the owner is genuinely excited to see what you do with these. 🚀
