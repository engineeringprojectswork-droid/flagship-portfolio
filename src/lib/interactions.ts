/* =====================================================================
   Progressive-enhancement interactions — ported from the flagship engine.
   · scroll reveal (.reveal -> .in)
   · animated number counters ([data-count] with format/decimals/prefix/suffix)
   · subtle hero parallax ([data-parallax])
   · nav "scrolled" state + top scroll-progress bar
   All respect prefers-reduced-motion and are safe to call after every
   Astro View Transition (no duplicate listeners, no double-count).
   ===================================================================== */

const reduce = () =>
  window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches;

/* ---- counters ---- */
function trim(x: number): string {
  return (Math.round(x * 10) / 10).toString().replace(/\.0$/, '');
}
function abbr(n: number): string {
  const a = Math.abs(n);
  if (a >= 1e6) return trim(n / 1e6) + 'M';
  if (a >= 1e3) return trim(n / 1e3) + 'K';
  return String(Math.round(n));
}
function fmt(n: number, el: HTMLElement): string {
  const dec = parseInt(el.getAttribute('data-decimals') || '0', 10);
  if (el.getAttribute('data-format') === 'abbr') return abbr(n);
  if (dec > 0) return n.toFixed(dec);
  return Math.round(n).toLocaleString('en-US');
}
function runCounter(el: HTMLElement) {
  if (el.dataset.counted === 'true') return;
  el.dataset.counted = 'true';
  const target = parseFloat(el.getAttribute('data-count') || '');
  const pre = el.getAttribute('data-prefix') || '';
  const suf = el.getAttribute('data-suffix') || '';
  if (isNaN(target)) return;
  if (reduce()) { el.textContent = pre + fmt(target, el) + suf; return; }
  const dur = parseInt(el.getAttribute('data-duration') || '1500', 10);
  let t0: number | null = null;
  function tick(t: number) {
    if (t0 === null) t0 = t;
    const p = Math.min((t - t0) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = pre + fmt(target * eased, el) + suf;
    if (p < 1) requestAnimationFrame(tick);
    else el.textContent = pre + fmt(target, el) + suf;
  }
  requestAnimationFrame(tick);
}
function initCounters() {
  const els = Array.from(document.querySelectorAll<HTMLElement>('[data-count]'));
  if (!('IntersectionObserver' in window)) { els.forEach(runCounter); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { runCounter(en.target as HTMLElement); io.unobserve(en.target); }
    });
  }, { threshold: 0.5 });
  els.forEach((el) => { if (el.dataset.counted !== 'true') io.observe(el); });
}

/* ---- reveal ---- */
function initReveal() {
  const els = Array.from(document.querySelectorAll<HTMLElement>('.reveal,.scale-in'));
  if (reduce() || !('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('in'));
    return;
  }
  // Reveal anything already in (or near) the viewport right away, so the hero
  // and other above-the-fold content never wait on a delayed observer tick.
  const vh = window.innerHeight || document.documentElement.clientHeight || 0;
  els.forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.top < vh * 0.95 && r.bottom > 0) el.classList.add('in');
  });
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });
  els.forEach((el) => { if (!el.classList.contains('in')) io.observe(el); });
  // Safety net: never leave content hidden for long on a slow cold load.
  window.setTimeout(() => {
    els.forEach((el) => el.classList.add('in'));
  }, 1200);
}

/* ---- hero parallax ---- */
let parallaxBound = false;
function initParallax() {
  if (reduce() || parallaxBound) return;
  parallaxBound = true;
  window.addEventListener('scroll', () => {
    const y = window.scrollY || 0;
    document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((l) => {
      const s = parseFloat(l.getAttribute('data-parallax') || '0.2') || 0.2;
      l.style.transform = 'translate3d(0,' + (y * s) + 'px,0)';
    });
  }, { passive: true });
}

/* ---- scroll-scrubbed sections ----
   Any [data-scrub] element gets a live `--p` custom property from 0 (just
   entering the viewport from the bottom) to 1 (just left through the top).
   CSS then maps --p to rotation / staggered reveals, so the animation is
   driven BY the scroll position itself — more scroll, more revealed. */
let scrubBound = false;
function updateScrub() {
  const els = document.querySelectorAll<HTMLElement>('[data-scrub]');
  if (!els.length) return;
  const vh = window.innerHeight || document.documentElement.clientHeight || 0;
  els.forEach((el) => {
    const r = el.getBoundingClientRect();
    const total = r.height + vh || 1;
    const p = Math.min(1, Math.max(0, (vh - r.top) / total));
    el.style.setProperty('--p', p.toFixed(4));
  });
}
function initScrub() {
  if (reduce()) {
    document
      .querySelectorAll<HTMLElement>('[data-scrub]')
      .forEach((el) => el.style.setProperty('--p', '1'));
    return;
  }
  let ticking = false;
  if (!scrubBound) {
    scrubBound = true;
    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(() => {
            ticking = false;
            updateScrub();
          });
        }
      },
      { passive: true },
    );
    window.addEventListener('resize', updateScrub, { passive: true });
  }
  updateScrub();
}

/* ---- nav scrolled state + scroll-progress bar ---- */
let chromeBound = false;
function initScrollChrome() {
  const onScroll = () => {
    const y = window.scrollY || window.pageYOffset;
    const nav = document.querySelector('.nav');
    const bar = document.querySelector<HTMLElement>('.progress');
    if (nav) nav.classList.toggle('scrolled', y > 8);
    if (bar) {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    }
  };
  if (!chromeBound) {
    chromeBound = true;
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
  }
  onScroll();
}

export function initInteractions(): void {
  initReveal();
  initCounters();
  initParallax();
  initScrub();
  initScrollChrome();
}
