/* =====================================================================
   Motion core — Lenis smooth-scroll + GSAP ScrollTrigger.

   GSAP + Lenis are CODE-SPLIT: dynamically imported ONLY on desktop with
   motion enabled (the only place pins/scrub run). On mobile / reduced-motion
   they never load — the spine + home render their static end-states with zero
   GSAP/Lenis cost (protects mobile Lighthouse).

   · ScrollTriggers are killed + rebuilt on every astro:page-load (fresh DOM).
   · The light [data-px] depth parallax has no dependency on GSAP.
   ===================================================================== */
import { initStoryScroll, renderStoryStatic } from './storyscroll';
import { initHomeMotion, renderHomeStatic } from './home';

export const prefersReduced = (): boolean =>
  !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches);

const MOBILE = 820;
const heavyOff = (): boolean => prefersReduced() || window.innerWidth <= MOBILE;
export const clamp01 = (n: number): number => (n < 0 ? 0 : n > 1 ? 1 : n);

/* ---- lazily-loaded engine ---- */
/* eslint-disable @typescript-eslint/no-explicit-any */
let gsap: any = null;
let ST: any = null;
let lenis: any = null;
let engineReady = false;

/** The ScrollTrigger constructor, or null until the engine is loaded. */
export function getST(): any {
  return ST;
}

async function loadEngine(): Promise<void> {
  if (engineReady) return;
  const [g, s, L] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger'), import('lenis')]);
  gsap = g.gsap;
  ST = s.ScrollTrigger;
  const Lenis = L.default;
  gsap.registerPlugin(ST);
  lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true, autoRaf: false });
  lenis.on('scroll', ST.update);
  gsap.ticker.add((time: number) => {
    if (lenis) lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
  engineReady = true;
}

export function killTriggers(): void {
  if (ST) ST.getAll().forEach((t: any) => t.kill());
}

/* ---- Depth parallax ([data-px] = speed; center-of-element based) ----
   Light + transform-only. Skipped entirely under reduced-motion / mobile. */
let pxBound = false;
function applyParallax(): void {
  const els = document.querySelectorAll<HTMLElement>('[data-px]');
  if (!els.length) return;
  const vh = window.innerHeight || document.documentElement.clientHeight || 0;
  els.forEach((el) => {
    const sp = parseFloat(el.getAttribute('data-px') || '0') || 0;
    const r = el.getBoundingClientRect();
    const c = r.top + r.height / 2 - vh / 2;
    el.style.transform = 'translate3d(0,' + (-c * sp).toFixed(1) + 'px,0)';
  });
}
function initParallaxDepth(): void {
  if (heavyOff()) {
    document.querySelectorAll<HTMLElement>('[data-px]').forEach((el) => (el.style.transform = 'none'));
    return;
  }
  if (!pxBound) {
    pxBound = true;
    let ticking = false;
    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(() => {
            ticking = false;
            applyParallax();
          });
        }
      },
      { passive: true },
    );
    window.addEventListener('resize', applyParallax, { passive: true });
  }
  applyParallax();
}

/* ---- Orchestrator — called by BaseLayout boot() on load + page-load ---- */
let lifecycleBound = false;
let resizeTimer = 0;
export async function initMotion(): Promise<void> {
  initParallaxDepth();

  if (heavyOff()) {
    // mobile / reduced-motion → static end-state, no GSAP/Lenis loaded
    killTriggers();
    renderStoryStatic();
    renderHomeStatic();
  } else {
    await loadEngine();
    killTriggers();
    initStoryScroll();
    initHomeMotion();
    ST.refresh();
  }

  if (!lifecycleBound) {
    lifecycleBound = true;
    window.addEventListener('load', () => {
      if (ST) ST.refresh();
    });
    // rebuild on resize so the mobile / reduced-motion threshold re-evaluates
    window.addEventListener(
      'resize',
      () => {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(() => {
          void initMotion();
        }, 250);
      },
      { passive: true },
    );
  }
}
