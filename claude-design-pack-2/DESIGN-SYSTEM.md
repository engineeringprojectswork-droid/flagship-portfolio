# 🎨 DESIGN SYSTEM — read this before designing anything

This is the shared visual language for the whole site. Match it so your new pieces
slot in next to the ones you already shipped and the engineering team's work,
seamlessly.

---

## 1. Canvas & surfaces (dark is the default — design for dark)

| Token | Value | Use |
|---|---|---|
| Page black | `#06060a` → `#0a0a12` | the canvas (a hair of blue in the black) |
| Raised surface | `rgba(255,255,255,.05)` | cards / panels |
| Glass border | `rgba(255,255,255,.12)` | hairlines on glass |
| Ink (primary) | `#f3f4ff` | headlines |
| Ink-2 (secondary) | `#aab0d6` | body / captions |
| Ink-3 (muted) | `#6f74a0` | eyebrows / meta |

Glass panels = `background: rgba(255,255,255,.05)` + `backdrop-filter: saturate(160%)
blur(20px)` + 1px white-12% border + soft radius (`16–24px`). A light theme exists on
the site, but **design everything for dark** — that's the canonical look.

---

## 2. The colour-per-project map (one accent per story)

Each project owns one accent. Use its gradient for that project's film. Hero and
contact are **multi-accent** (the convergence of all of them — see those briefs).

| Project (this pack) | Accent name | Gradient stops | Feeling |
|---|---|---|---|
| **meta-ads** | blue | `#2997ff → #5ac8fa` | precise, cool, "paid media" |
| **al-maali** | red/pink | `#ff375f → #ff7eb6` | warm, alive, "audience" |
| **brand-system** | violet | `#a259ff → #bf5af2` | creative, studio, "brand" |
| **my-resume** | spectrum | `#2997ff → #bf5af2` (blue→violet) | meta, "the system itself" |

For reference, the other (already-done) projects use: green/teal `#30d158/#64d2ff`
(CRM), teal (software), yellow `#ffd60a` (automation), indigo `#7574ee` (web). The
hero's signature spectrum runs **pink → violet → blue → cyan**
(`#ff5e8a, #a259ff, #2997ff, #64d2ff`).

**Accent text trick** (used everywhere): gradient-clipped text —
```css
background:linear-gradient(90deg,var(--a),var(--b));
-webkit-background-clip:text;background-clip:text;
-webkit-text-fill-color:transparent;color:transparent;
```

---

## 3. Type

- **Latin:** the system uses Inter; in a self-contained file use the system stack
  `-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif`.
- **Arabic:** use a clean Arabic-capable system stack
  `"SF Arabic","Segoe UI","Noto Sans Arabic",Tahoma,sans-serif`. **Do not** embed or
  fetch a font (self-contained rule). Arabic display type should feel **larger and a
  touch more open** than Latin (Arabic letters carry more ink) — bump font-size ~8%
  and line-height in RTL.
- Display headlines: **800–900 weight**, tight tracking (`-0.03em` to `-0.05em`) for
  Latin; **0 tracking, line-height ~1.15** for Arabic (never negative-track Arabic).
- Numbers animate (count-up) and use `font-variant-numeric:tabular-nums`.

---

## 4. Motion language

- **One hero motion per beat.** Reveal: fade + 16–34px rise, `cubic-bezier(.16,1,.3,1)`,
  ~0.8–1s, gently staggered (80–140ms).
- **Count-ups** ease-out cubic over ~1.5s.
- **Ambient life at rest:** slow (6–8s) core "breathing" pulses, drifting blooms,
  a faint rotating ring — subtle, never busy.
- **Glow is the signature.** Important text and shapes carry a soft accent
  `drop-shadow`/`box-shadow` halo that intensifies at the focal moment.
- **⚠️ Always animate.** The owner deliberately runs his devices with "Reduce Motion"
  ON, but he wants the motion shown to *everyone*. So: **do not gate the experience on
  `prefers-reduced-motion`.** Let it animate regardless. (You may still provide a
  sensible static end-state for the rare non-JS case, but the default must move.) This
  is the opposite of the usual rule — it's intentional and explicitly requested.

---

## 5. ✅ The Film Contract (the 4 films must match this — `reference/FILM-FORMAT-REFERENCE.html`)

All four films are **self-playing 16:9 scene players** with identical chrome, so the
set feels like one product. Copy these mechanics:

**Frame**
- One `.film` card, `width:min(100%,1120px)`, `aspect-ratio:16/9`, black fill, soft
  radius (`16–24px`), 1px white-8% border, a deep accent drop-shadow.
- **Mobile:** `@media (max-width:640px){ .film{ aspect-ratio:3/4 } }` so it stays tall
  and readable on a phone.
- `<head>`: `<meta name="color-scheme" content="dark">` and
  `<meta name="darkreader-lock">` (stops browser dark-mode extensions from inverting it).

**Scenes**
- **4 scenes** (a tight narrative: *situation → approach → result → the number*).
- Scenes are absolutely stacked; the active one cross-fades in (`opacity .8s`); inactive
  ones are `pointer-events:none` + `aria-hidden`.
- Inside each scene, elements enter with the reveal (fade + rise), lightly staggered via
  `transition-delay`.

**Player chrome (bottom-centre)**
- A **play/pause** button + a row of **chapter dots**; the active dot widens into a pill
  with an animated fill that runs the scene's duration (**5000ms**), then auto-advances
  to the next scene (wrapping). Clicking a dot jumps to that chapter; clicking play/pause
  toggles. Pause when the tab is hidden, resume when visible.
- Keep it accessible: `role="group"` on the film, `role="tablist"`/`tab` on the dots,
  `aria-label`s per chapter, `aria-selected` synced.

**Numbers**
- Animate `[data-to]` count-ups on scene activation, honouring `data-dec` (decimals),
  `data-prefix` (e.g. `$`), `data-suffix` (e.g. `%`/`+`). Show the final value if JS is off.

**Bilingual (`?lang=ar`)**
- On load, read `?lang=ar` from the URL. If present: set `dir="rtl"`, switch every string
  to its Arabic version (provided in each brief), bump Arabic type per §3, and **mirror any
  left-to-right motion** (flow arrows, bar fills, dot order). Default (no param) = English.
- Keep the real text in the DOM for screen readers; per-**word** reveals only in Arabic.

**The look inside**
- Each film leans on its project accent (§2): soft accent glows behind the content, an
  accent gradient on the key headline word and the hero number, glassy nodes/bars where
  the story calls for them. Look at `reference/meta-ads.html` — that's the current bar;
  your job is to keep that structure and make the visuals richer and bilingual.

That's the contract. Inside it you have full creative latitude — surprise us.
