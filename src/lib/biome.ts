/* ===================================================================
   Biome scroll engine — drives --p and --glow via scroll, no GSAP.
   Ported directly from the Claude Design "Cosmic Keynote" output.
   =================================================================== */

function fmt(v: number): string {
  if (v >= 1e6) return '1M+';
  if (v >= 1e3) return (v / 1000).toFixed(v < 1e5 ? 1 : 0) + 'K';
  return Math.round(v).toString();
}

export function initBiome(): () => void {
  const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
  const pins = Array.from(document.querySelectorAll<HTMLElement>('[data-pin]'));
  const glowEls = Array.from(document.querySelectorAll<HTMLElement>('[data-glow]'));

  if (reduce) {
    for (const pin of pins) {
      pin.style.height = 'auto';
      const st = pin.querySelector<HTMLElement>('[data-stage]');
      if (st) { st.style.position = 'relative'; st.style.minHeight = '86svh'; st.style.setProperty('--p', '1'); }
    }
    for (const el of document.querySelectorAll<HTMLElement>('[data-step]')) {
      el.style.opacity = '1'; el.style.transform = 'none';
    }
    for (const el of document.querySelectorAll<HTMLElement>('[data-track]')) {
      el.style.flexWrap = 'wrap'; el.style.width = '100%'; el.style.transform = 'none';
    }
  }

  function scrub() {
    const vh = innerHeight;
    for (const pin of pins) {
      const stage = pin.querySelector<HTMLElement>('[data-stage]');
      if (!stage) continue;
      let p: number;
      if (reduce) {
        p = 1;
      } else {
        const r = pin.getBoundingClientRect();
        const total = pin.offsetHeight - vh || 1;
        p = Math.min(1, Math.max(0, -r.top / total));
      }
      stage.style.setProperty('--p', p.toFixed(4));

      const steps = Array.from(pin.querySelectorAll<HTMLElement>('[data-step]'));
      const n = steps.length || 1;
      for (let i = 0; i < steps.length; i++) {
        const start = 0.10 + i * (0.62 / n);
        const a = reduce ? 1 : Math.min(1, Math.max(0, (p - start) / 0.20));
        steps[i].style.opacity = String(a);
        steps[i].style.transform = `translateY(${((1 - a) * 34).toFixed(1)}px)`;
      }

      const climb = pin.querySelector<HTMLElement>('[data-climb]');
      if (climb) {
        const v = 9200 + (1_000_000 - 9200) * Math.pow(p, 1.35);
        climb.textContent = fmt(v);
      }

      const track = pin.querySelector<HTMLElement>('[data-track]');
      if (track && !reduce && innerWidth > 820) {
        const extra = Math.max(0, track.scrollWidth - innerWidth + 40);
        track.style.transform = `translate3d(${(-p * extra).toFixed(1)}px,0,0)`;
      }
    }

    const vc = vh / 2;
    for (const el of glowEls) {
      let g: number;
      if (reduce) {
        g = 0.5;
      } else {
        const rr = el.getBoundingClientRect();
        const ctr = rr.top + rr.height / 2;
        g = Math.max(0, 1 - Math.abs(ctr - vc) / (vh * 0.62));
      }
      el.style.setProperty('--glow', g.toFixed(3));
    }

    const pb = document.querySelector<HTMLElement>('[data-bm-progress]');
    if (pb) {
      const h = document.documentElement.scrollHeight - vh;
      pb.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
    }
  }

  scrub();
  let ticking = false;
  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(() => { ticking = false; scrub(); }); }
  }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll, { passive: true });
  return () => { removeEventListener('scroll', onScroll); removeEventListener('resize', onScroll); };
}
