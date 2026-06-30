/* =====================================================================
   COSMIC KEYNOTE — global starfield (fixed #space canvas behind the site).
   Layered parallax stars (near layers drift faster than far) + a gentle
   twinkle, theme-aware via the --star token. Reduced-motion paints one static
   frame and never loops; pauses on tab-hidden; safe to re-init after an Astro
   View Transition (cancels the prior loop + listeners). Single rAF, DPR<=2.
   The nebula bloom lives in the CSS body background; this draws only stars.
   ===================================================================== */

type Star = { x: number; y: number; r: number; tw: number };
type LayerSpec = { n: number; sp: number; r: [number, number]; a: number };
type Layer = LayerSpec & { stars: Star[] };

let raf: number | null = null;
let cleanup: (() => void) | null = null;

export function initSpace(): void {
  // Tear down any loop/listeners from a previous page before re-binding.
  cleanup?.();

  const c = document.getElementById('space') as HTMLCanvasElement | null;
  if (!c) return;
  const x = c.getContext('2d');
  if (!x) return;

  const REDUCE =
    !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches);
  let W = 0, H = 0, DPR = 1, t0: number | null = null;
  let layers: Layer[] = [];

  const SPECS: LayerSpec[] = [
    { n: 90, sp: 0.15, r: [0.4, 1.0], a: 0.5 },
    { n: 60, sp: 0.35, r: [0.6, 1.4], a: 0.7 },
    { n: 26, sp: 0.6, r: [0.9, 2.0], a: 0.95 },
  ];

  function build(): void {
    layers = SPECS.map((L) => {
      const stars: Star[] = [];
      for (let i = 0; i < L.n; i++) {
        stars.push({
          x: Math.random(),
          y: Math.random(),
          r: L.r[0] + Math.random() * (L.r[1] - L.r[0]),
          tw: Math.random() * 6.283,
        });
      }
      return { ...L, stars };
    });
  }

  function resize(): void {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    c!.width = Math.round(W * DPR);
    c!.height = Math.round(H * DPR);
    if (REDUCE) draw(0);
  }

  function starColor(): string {
    return getComputedStyle(document.documentElement).getPropertyValue('--star').trim() || '#fff';
  }

  function draw(ms: number): void {
    const k = starColor();
    const sc = window.scrollY || 0;
    x!.setTransform(1, 0, 0, 1, 0, 0);
    x!.clearRect(0, 0, c!.width, c!.height);
    x!.fillStyle = k;
    for (const L of layers) {
      for (const s of L.stars) {
        const px = s.x * W;
        let py = (s.y * H - sc * L.sp) % H;
        if (py < 0) py += H;
        const tw = REDUCE ? 1 : 0.55 + 0.45 * Math.sin(ms / 600 + s.tw);
        x!.globalAlpha = L.a * tw;
        x!.beginPath();
        x!.arc(px * DPR, py * DPR, s.r * DPR, 0, 6.2832);
        x!.fill();
      }
    }
    x!.globalAlpha = 1;
  }

  function frame(now: number): void {
    if (t0 === null) t0 = now;
    draw(now - t0);
    raf = requestAnimationFrame(frame);
  }
  function play(): void { if (raf === null && !REDUCE) raf = requestAnimationFrame(frame); }
  function pause(): void { if (raf !== null) { cancelAnimationFrame(raf); raf = null; } t0 = null; }

  let rt: ReturnType<typeof setTimeout>;
  const onResize = () => { clearTimeout(rt); rt = setTimeout(() => { build(); resize(); draw(0); }, 150); };
  const onVisibility = () => { if (document.hidden) pause(); else play(); };
  // Repaint immediately on theme toggle so reduced-motion (static) re-tints too.
  const onTheme = () => { draw(performance.now()); };

  build();
  resize();
  draw(0);
  play();
  window.addEventListener('resize', onResize, { passive: true });
  document.addEventListener('visibilitychange', onVisibility);
  document.addEventListener('mm:themechange', onTheme);

  cleanup = () => {
    pause();
    window.removeEventListener('resize', onResize);
    document.removeEventListener('visibilitychange', onVisibility);
    document.removeEventListener('mm:themechange', onTheme);
    cleanup = null;
  };
}
