/* ===================================================================
   Selected-Work showcase enhancement (Claude Design pack #1).
   The horizontal scrub itself is driven by the biome engine (it
   translates [data-track] by scroll progress). This thin layer reads
   tile positions each frame and: marks the tile nearest viewport-centre
   "active" (CSS scales it up + lights its accent), parallaxes that
   tile's watermark index, and updates the progress dots + counter.
   Pure read + class toggles — no scroll math of its own. Safe to
   re-init across View Transitions (cancels the previous loop).
   =================================================================== */
export function initSelectedWork(): () => void {
  const sec = document.getElementById('work');
  if (!sec) return () => {};
  const tiles = Array.from(sec.querySelectorAll<HTMLElement>('.sw-tile'));
  const dots = Array.from(sec.querySelectorAll<HTMLElement>('.sw-dots i'));
  const countEl = document.getElementById('sw-count');
  if (!tiles.length) return () => {};

  let raf = 0;
  let lastActive = -1;

  function frame() {
    const cx = innerWidth / 2;
    let best = 0;
    let bestD = Infinity;
    for (let i = 0; i < tiles.length; i++) {
      const r = tiles[i].getBoundingClientRect();
      const c = r.left + r.width / 2;
      const d = Math.abs(c - cx);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
      const idx = tiles[i].querySelector<HTMLElement>('.sw-idx');
      if (idx) idx.style.transform = `translateX(${((c - cx) * -0.06).toFixed(1)}px)`;
    }
    if (best !== lastActive) {
      lastActive = best;
      for (let i = 0; i < tiles.length; i++) tiles[i].classList.toggle('act', i === best);
      for (let i = 0; i < dots.length; i++) dots[i].classList.toggle('on', i === best);
      if (countEl) countEl.textContent = String(best + 1).padStart(2, '0');
    }
    raf = requestAnimationFrame(frame);
  }
  raf = requestAnimationFrame(frame);

  return () => {
    if (raf) cancelAnimationFrame(raf);
  };
}
