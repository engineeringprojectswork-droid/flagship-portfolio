/* ===================================================================
   Per-line statement entrances (Claude Design pack #1 "line-animations"
   technique, ported onto the real home biome headlines).

   Each `.bm-h[data-fx]` headline is real text; on init we split it into
   units (letters for LTR when data-split="letter", words otherwise; AR
   is ALWAYS per-word so cursive joins survive) and keep an aria-label of
   the full sentence for screen readers (units are aria-hidden). A single
   rAF loop reads each line's host `--p` (0→1, set by the biome engine on
   the enclosing [data-stage]) and drives a per-line entrance with its own
   character — transform/opacity only. Entrance completes by p≈0.55, then
   the line holds, fully readable.

   Defensive: the whole split is wrapped so any failure leaves the plain,
   visible headline intact (`.bm-h[data-fx]` is forced opaque in CSS).
   biome 02 (the 9.2K→1M climb) is intentionally NOT given a data-fx — its
   counter is a signature we don't touch.
   =================================================================== */

type FxName = 'lock' | 'build' | 'shape' | 'compile' | 'pipeline' | 'render' | 'unify';

interface Seed {
  ang: number;
  d: number;
  sx: number;
  sy: number;
  rot: number;
}
interface Line {
  el: HTMLElement;
  stage: HTMLElement;
  units: HTMLElement[];
  seeds: Seed[];
  fx: FxName;
  cursor?: HTMLElement;
  skels?: HTMLElement[];
}

const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const eOut = (t: number) => 1 - Math.pow(1 - t, 3);
const eOutBack = (t: number) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};
const stag = (e: number, i: number, n: number, sp: number) => {
  const start = n <= 1 ? 0 : (i / (n - 1)) * sp;
  return clamp((e - start) / (1 - sp), 0, 1);
};
// Deterministic pseudo-random (no Math.random → stable across re-inits).
const pseudo = (i: number, salt: number) => {
  const x = Math.sin((i + 1) * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

const FX: Record<FxName, (ln: Line, p: number, e: number, t: number, rtl: boolean) => void> = {
  lock(ln, _p, e) {
    const n = ln.units.length;
    ln.units.forEach((u, i) => {
      const s = ln.seeds[i];
      const l = eOutBack(stag(e, i, n, 0.3));
      const d = s.d * (1 - l);
      u.style.opacity = clamp(e * 1.5 - (i / n) * 0.25, 0, 1).toFixed(3);
      u.style.transform = `translate(${(Math.cos(s.ang) * d).toFixed(1)}px,${(Math.sin(s.ang) * d).toFixed(1)}px) scale(${lerp(1.55, 1, l).toFixed(3)})`;
    });
  },
  build(ln, _p, e) {
    const n = ln.units.length;
    ln.units.forEach((u, i) => {
      const s = stag(e, i, n, 0.45);
      const l = eOutBack(s);
      u.style.opacity = clamp(s * 2.2, 0, 1).toFixed(3);
      u.style.transform = `translateY(${lerp(-72, 0, l).toFixed(1)}px) rotate(${lerp(-5, 0, l).toFixed(2)}deg)`;
    });
  },
  shape(ln, _p, e) {
    const n = ln.units.length;
    ln.units.forEach((u, i) => {
      const s = ln.seeds[i];
      const l = eOut(stag(e, i, n, 0.4));
      u.style.opacity = l.toFixed(3);
      u.style.transform = `translate(${lerp(s.sx, 0, l).toFixed(1)}px,${lerp(s.sy, 0, l).toFixed(1)}px) rotate(${lerp(s.rot, 0, l).toFixed(2)}deg) scale(${lerp(0.7, 1, l).toFixed(3)})`;
    });
  },
  compile(ln, _p, e, t, rtl) {
    const n = ln.units.length;
    ln.units.forEach((u, i) => {
      const idx = rtl ? n - 1 - i : i;
      const l = eOut(stag(e, idx, n, 0.6));
      u.style.opacity = l.toFixed(3);
      u.style.transform = `translate(${lerp(rtl ? 14 : -14, 0, l).toFixed(1)}px,${lerp(7, 0, l).toFixed(1)}px)`;
    });
    if (ln.cursor) {
      ln.cursor.style.opacity = (e < 0.97 ? 1 : 0.45 + 0.55 * Math.sin(t * 0.009)).toFixed(2);
      ln.cursor.style.transform = `scaleY(${lerp(0.7, 1, clamp(e * 2, 0, 1)).toFixed(2)})`;
    }
  },
  pipeline(ln, _p, e) {
    const n = ln.units.length;
    ln.units.forEach((u, i) => {
      const l = eOut(stag(e, i, n, 0.72));
      u.style.opacity = l.toFixed(3);
      u.style.transform = `translateY(${lerp(15, 0, l).toFixed(1)}px) scale(${lerp(0.9, 1, l).toFixed(3)})`;
    });
  },
  render(ln, _p, e, t) {
    const n = ln.units.length;
    ln.units.forEach((u, i) => {
      const l = eOut(stag(e, i, n, 0.55));
      u.style.opacity = l.toFixed(3);
      u.style.transform = `translateY(${lerp(7, 0, l).toFixed(1)}px)`;
      const s = ln.skels && ln.skels[i];
      if (s) {
        s.style.opacity = clamp(1 - l * 1.15, 0, 1).toFixed(3);
        s.style.transform = `scaleX(${lerp(1, 0.35, l).toFixed(3)})`;
        s.style.backgroundPositionX = `${(((t * 0.06) % 200) - 50).toFixed(0)}%`;
      }
    });
  },
  unify(ln, _p, e) {
    const n = ln.units.length;
    ln.units.forEach((u, i) => {
      const l = eOut(stag(e, i, n, 0.3));
      const spread = i - (n - 1) / 2;
      u.style.opacity = clamp(e * 1.6, 0, 1).toFixed(3);
      u.style.transform = `translateX(${lerp(spread * 48, 0, l).toFixed(1)}px) scale(${lerp(1.16, 1, l).toFixed(3)})`;
    });
  },
};

export function initLineAnim(): () => void {
  const heads = Array.from(document.querySelectorAll<HTMLElement>('.bm-h[data-fx]'));
  if (!heads.length) return () => {};
  const rtl = document.documentElement.dir === 'rtl';
  const lines: Line[] = [];

  for (const el of heads) {
    try {
      const stage = el.closest<HTMLElement>('[data-stage]');
      const fx = el.dataset.fx as FxName;
      if (!stage || !FX[fx]) continue;

      // Source from aria-label when present: a prior init (e.g. the initial
      // boot + the astro:page-load boot) splits into units whose spaces are
      // CSS-only spacers, so re-reading textContent would lose them. The
      // aria-label holds the original sentence — the durable source of truth.
      const text = (el.getAttribute('aria-label') || el.textContent || '').trim();
      if (!text) continue;
      el.setAttribute('aria-label', text);
      el.textContent = '';

      const units: HTMLElement[] = [];
      const mode = rtl ? 'word' : el.dataset.split === 'letter' ? 'letter' : 'word';
      for (const tok of text.split(/(\s+)/)) {
        if (tok === '') continue;
        if (/^\s+$/.test(tok)) {
          const sp = document.createElement('span');
          sp.className = 'u-sp';
          sp.setAttribute('aria-hidden', 'true');
          el.appendChild(sp);
          continue;
        }
        const word = document.createElement('span');
        word.className = 'u-word';
        word.setAttribute('aria-hidden', 'true');
        if (mode === 'letter') {
          for (const ch of Array.from(tok)) {
            const u = document.createElement('span');
            u.className = 'u';
            u.textContent = ch;
            word.appendChild(u);
            units.push(u);
          }
        } else {
          const u = document.createElement('span');
          u.className = 'u';
          u.textContent = tok;
          word.appendChild(u);
          units.push(u);
        }
        el.appendChild(word);
      }
      if (!units.length) continue;

      const seeds: Seed[] = units.map((_, k) => ({
        ang: k * 2.39996,
        d: 70 + pseudo(k, 1) * 120,
        sx: (pseudo(k, 2) * 2 - 1) * 180,
        sy: (pseudo(k, 3) * 2 - 1) * 120,
        rot: (pseudo(k, 4) * 2 - 1) * 32,
      }));

      const line: Line = { el, stage, units, seeds, fx };
      if (fx === 'compile') {
        const cur = document.createElement('span');
        cur.className = 'u-cursor';
        cur.setAttribute('aria-hidden', 'true');
        el.appendChild(cur);
        line.cursor = cur;
      }
      if (fx === 'render') {
        line.skels = [];
        units.forEach((u) => {
          u.classList.add('u-skelw');
          const s = document.createElement('span');
          s.className = 'u-skel';
          s.setAttribute('aria-hidden', 'true');
          u.appendChild(s);
          line.skels!.push(s);
        });
      }
      lines.push(line);
    } catch {
      /* leave this headline as plain visible text */
    }
  }
  if (!lines.length) return () => {};

  let raf = 0;
  function loop(t: number) {
    for (const ln of lines) {
      const p = parseFloat(getComputedStyle(ln.stage).getPropertyValue('--p')) || 0;
      const e = eOut(clamp(p / 0.55, 0, 1));
      FX[ln.fx](ln, p, e, t, rtl);
    }
    raf = requestAnimationFrame(loop);
  }
  raf = requestAnimationFrame(loop);

  return () => {
    if (raf) cancelAnimationFrame(raf);
  };
}
