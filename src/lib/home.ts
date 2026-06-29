/* =====================================================================
   Home-page motion scenes (Claude Design parallax package).
   Built on the same Lenis + GSAP ScrollTrigger core as the story spine.

   Scenes (implemented in Phase 3):
     · stat receipts  — sparkline draws in sync with the count-up
     · stack rail     — tools assemble left-to-right on scroll (RTL-mirrored)
     · statements     — pinned 360vh, one ghost metric per line
     · section rail   — fixed vertical index, active item brightens (desktop)
     · film strip     — pinned, vertical scroll → horizontal scrub of 9 cards

   Each scene is guarded: no-op when its DOM marker is absent, and degrades to
   a static end-state under prefers-reduced-motion / small viewports.
   ===================================================================== */

export function initHomeMotion(): void {
  // Phase 3 — populated with the home scenes. Guarded no-op until then.
  if (!document.querySelector('[data-home-motion]')) return;
}
