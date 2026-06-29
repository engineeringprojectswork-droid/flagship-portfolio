/* =====================================================================
   Motion core — Lenis smooth-scroll + GSAP ScrollTrigger.
   Wired ONCE here; the StoryScroll spine (storyscroll.ts) and the home
   upgrades (home.ts) build their pinned/scrubbed scenes on top.

   · Lenis is a persistent singleton (survives Astro View Transitions);
     its RAF is driven by gsap.ticker so Lenis + ScrollTrigger share one loop.
   · prefers-reduced-motion → Lenis never starts, no pins/scrubs are created,
     and every scene renders its static end-state.
   · ScrollTriggers are killed + rebuilt on every astro:page-load (fresh DOM).
   ===================================================================== */
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initStoryScroll } from './storyscroll';
import { initHomeMotion } from './home';

export const prefersReduced = (): boolean =>
  !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches);

let gsapReady = false;
export function ensureGsap(): typeof ScrollTrigger {
  if (!gsapReady) {
    gsap.registerPlugin(ScrollTrigger);
    gsapReady = true;
  }
  return ScrollTrigger;
}

/* ---- Lenis singleton ---- */
let lenis: Lenis | null = null;
let tickerBound = false;
export function getLenis(): Lenis | null {
  return lenis;
}
export function initLenis(): Lenis | null {
  if (prefersReduced()) return null;
  if (lenis) return lenis;
  ensureGsap();
  lenis = new Lenis({
    lerp: 0.1,
    wheelMultiplier: 1,
    smoothWheel: true,
    autoRaf: false, // we drive raf from gsap.ticker
  });
  lenis.on('scroll', ScrollTrigger.update);
  if (!tickerBound) {
    tickerBound = true;
    gsap.ticker.add((time: number) => lenis && lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  return lenis;
}

/* ---- Depth parallax ([data-px] = speed; center-of-element based) ----
   translateY proportional to the element's distance from viewport centre,
   so higher data-px reads as "closer". Y-axis only → no RTL mirroring. */
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
export function initParallaxDepth(): void {
  if (prefersReduced()) {
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

/* ---- Kill our ScrollTriggers before a rebuild (DOM swap) ---- */
export function killTriggers(): void {
  ensureGsap();
  ScrollTrigger.getAll().forEach((t) => t.kill());
}

/* ---- clamp helper shared by scenes ---- */
export const clamp01 = (n: number): number => (n < 0 ? 0 : n > 1 ? 1 : n);

let lifecycleBound = false;
let resizeTimer = 0;
/* ---- Orchestrator — called by BaseLayout boot() on load + page-load ---- */
export function initMotion(): void {
  initLenis();
  killTriggers(); // remove any triggers from the previous page before re-creating
  initParallaxDepth();
  initStoryScroll();
  initHomeMotion();
  ensureGsap().refresh();
  if (!lifecycleBound) {
    lifecycleBound = true;
    // late layout shifts (fonts, lazy images) can move pin start/end points
    window.addEventListener('load', () => ScrollTrigger.refresh());
    // rebuild on resize so the mobile / reduced-motion pin guards re-evaluate
    window.addEventListener(
      'resize',
      () => {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(() => {
          killTriggers();
          initStoryScroll();
          initHomeMotion();
          ScrollTrigger.refresh();
        }, 250);
      },
      { passive: true },
    );
  }
}
