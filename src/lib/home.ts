/* =====================================================================
   Home-page motion scenes (Claude Design parallax package).
   Built on the same Lenis + GSAP ScrollTrigger core as the story spine.

   GSAP-driven (killed + rebuilt each page-load by initMotion):
     · film strip — pinned; vertical scroll → horizontal scrub of the 9 cards
   IntersectionObserver-driven (cleaned up here across View Transitions):
     · section rail — fixed vertical index, active item brightens (desktop ≥1180)

   The stat receipts, stack rail and ghost-metric statements are pure CSS off
   the existing reveal system — no JS needed here.

   Guarded: no-op without [data-home-motion]; degrades to static under
   prefers-reduced-motion / small viewports.
   ===================================================================== */
import { ensureGsap, prefersReduced } from './motion';

const MOBILE = 820;
const RAIL_MIN = 1180;
let railIO: IntersectionObserver | null = null;

/* ---- Signature film strip: vertical scroll → horizontal translate ---- */
function initFilmStrip(small: boolean, reduced: boolean): void {
  const sec = document.querySelector<HTMLElement>('[data-filmstrip]');
  if (!sec) return;
  const sticky = sec.querySelector<HTMLElement>('[data-filmstrip-sticky]');
  const track = sec.querySelector<HTMLElement>('[data-filmstrip-track]');
  const bar = sec.querySelector<HTMLElement>('[data-filmstrip-bar]');
  if (!sticky || !track) return;

  if (reduced || small) {
    // stacked card grid — clear any leftover scrub transform
    track.style.transform = 'none';
    if (bar) bar.style.width = '100%';
    return;
  }

  const ST = ensureGsap();
  const rtl = document.documentElement.getAttribute('dir') === 'rtl';
  const extra = Math.max(0, track.scrollWidth - window.innerWidth + 120);
  const dist = extra + window.innerHeight * 0.15;

  ST.create({
    trigger: sec,
    start: 'top top',
    end: '+=' + dist,
    pin: sticky,
    scrub: true,
    invalidateOnRefresh: true,
    onUpdate: (self) => {
      const p = self.progress;
      // RTL mirrors the horizontal direction
      track.style.transform = 'translate3d(' + ((rtl ? 1 : -1) * p * extra).toFixed(1) + 'px,0,0)';
      if (bar) bar.style.width = (p * 100).toFixed(1) + '%';
    },
  });
}

/* ---- Section progress rail: active item brightens on scroll (desktop) ---- */
function initRail(): void {
  if (railIO) {
    railIO.disconnect();
    railIO = null;
  }
  const rail = document.querySelector<HTMLElement>('[data-rail]');
  if (!rail) return;
  const items = Array.from(rail.querySelectorAll<HTMLElement>('[data-rail-item]'));

  if (window.innerWidth < RAIL_MIN || !('IntersectionObserver' in window)) {
    rail.style.display = 'none';
    return;
  }
  rail.style.display = '';

  const setActive = (id: string) => {
    items.forEach((a) => {
      if (a.getAttribute('data-rail-item') === id) a.setAttribute('data-active', '');
      else a.removeAttribute('data-active');
    });
  };

  railIO = new IntersectionObserver(
    (entries) => entries.forEach((en) => en.isIntersecting && setActive((en.target as HTMLElement).id)),
    { rootMargin: '-45% 0px -50% 0px' },
  );
  items.forEach((a) => {
    const id = a.getAttribute('data-rail-item');
    const target = id ? document.getElementById(id) : null;
    if (target) railIO!.observe(target);
  });
  // click-to-jump is handled by the items' native #anchor hrefs
}

export function initHomeMotion(): void {
  if (!document.querySelector('[data-home-motion]')) {
    if (railIO) {
      railIO.disconnect();
      railIO = null;
    }
    return;
  }
  const reduced = prefersReduced();
  const small = window.innerWidth <= MOBILE;
  initFilmStrip(small, reduced);
  initRail();
}
