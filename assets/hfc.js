/*
 * Hamza Fitness Club – UI Interactions
 * - Reveal-on-scroll animations (accessible & reduced-motion aware)
 * - Testimonials carousel (keyboard, touch, autoplay, a11y)
 * - Ratings summary animation (bars + counters)
 *
 * Drop this file at assets/hfc.js and include with:
 *   <script src="assets/hfc.js" defer></script>
 */
(() => {
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------
   * 1) Reveal-on-scroll animations
   * ------------------------------ */
  const Reveal = (() => {
    const defaults = {
      root: null,
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.1
    };

    // Apply base pre-animate state based on flavor classes
    function prime(el) {
      el.style.willChange = 'transform, opacity';
      el.style.opacity = '0';
      el.style.transition = 'opacity 700ms cubic-bezier(.22,.61,.36,1), transform 800ms cubic-bezier(.22,.61,.36,1)';

      if (el.classList.contains('fade-up')) {
        el.style.transform = 'translate3d(0,20px,0)';
      } else if (el.classList.contains('fade-down')) {
        el.style.transform = 'translate3d(0,-20px,0)';
      } else if (el.classList.contains('slide-right')) {
        el.style.transform = 'translate3d(24px,0,0)';
      } else if (el.classList.contains('slide-left')) {
        el.style.transform = 'translate3d(-24px,0,0)';
      } else if (el.classList.contains('zoom-in')) {
        el.style.transform = 'scale(.96)';
      } else {
        el.style.transform = 'translate3d(0,12px,0)';
      }
    }

    function reveal(el) {
      el.style.opacity = '1';
      el.style.transform = 'none';
      el.classList.add('revealed');
      // remove will-change after the animation completes to save memory
      setTimeout(() => (el.style.willChange = ''), 1000);
    }

    function init() {
      const targets = $$('.reveal:not(.revealed)');
      if (!targets.length) return;

      // If user prefers reduced motion, reveal everything at once
      if (prefersReduced) {
        targets.forEach(el => reveal(el));
        return;
      }

      targets.forEach(prime);
      const io = new IntersectionObserver((entries, obs) => {
        entries.forEach(({ isIntersecting, target }) => {
          if (!isIntersecting) return;
          reveal(target);
          obs.unobserve(target);
        });
      }, defaults);

      targets.forEach(t => io.observe(t));
    }

    return { init };
  })();

  /* ------------------------------
   * 2) Testimonials carousel
   * ------------------------------ */
  const Carousel = (() => {
    const SEL = {
      root: '#reviewsCarousel',
      track: '.reel__track',
      card: '.reel__card',
      prev: '[data-reel-prev]',
      next: '[data-reel-next]'
    };

    let root, track, cards, btnPrev, btnNext, autoplayTimer, pause = false;

    function gapPx() {
      const cs = getComputedStyle(track);
      const colGap = parseFloat(cs.columnGap) || 0;
      const rowGap = parseFloat(cs.rowGap) || 0;
      return Math.max(colGap, rowGap, 24); // fallback gap
    }

    function cardsPerView() {
      return window.matchMedia('(min-width: 768px)').matches ? 3 : 1;
    }

    function stepDir(dir = 1) {
      const firstCard = cards[0];
      if (!firstCard) return;
      const delta = (firstCard.clientWidth + gapPx()) * cardsPerView();
      const maxX = track.scrollWidth - track.clientWidth - 4; // small buffer

      let target = track.scrollLeft + dir * delta;
      if (target < 0) target = 0;
      if (target > maxX) target = 0; // wrap to beginning for a simple loop

      track.scrollTo({ left: target, behavior: prefersReduced ? 'auto' : 'smooth' });
      updateSelected();
    }

    function updateSelected() {
      // Pick the card whose left is closest to track.scrollLeft
      const scrollLeft = track.scrollLeft;
      let closestIdx = 0;
      let closestDist = Infinity;
      cards.forEach((c, i) => {
        const { left } = c.getBoundingClientRect();
        const { left: tLeft } = track.getBoundingClientRect();
        const dist = Math.abs((left - tLeft) - 0);
        if (dist < closestDist) { closestDist = dist; closestIdx = i; }
      });

      cards.forEach((c, i) => {
        const selected = i >= closestIdx && i < closestIdx + cardsPerView();
        c.setAttribute('aria-selected', String(selected));
        c.tabIndex = selected ? 0 : -1;
      });
    }

    // Keyboard navigation on track
    function onKeydown(e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); stepDir(1); }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); stepDir(-1); }
      if (e.key === 'Home')       { e.preventDefault(); track.scrollTo({ left: 0, behavior: 'smooth' }); updateSelected(); }
      if (e.key === 'End')        { e.preventDefault(); track.scrollTo({ left: track.scrollWidth, behavior: 'smooth' }); updateSelected(); }
    }

    // Touch/drag support
    function enableDrag() {
      let startX = 0, startLeft = 0, dragging = false;

      track.addEventListener('pointerdown', e => {
        dragging = true; track.setPointerCapture(e.pointerId);
        startX = e.clientX; startLeft = track.scrollLeft; pause = true; // pause autoplay while dragging
      });
      track.addEventListener('pointermove', e => {
        if (!dragging) return; const dx = e.clientX - startX; track.scrollLeft = startLeft - dx;
      });
      const end = e => { dragging = false; pause = false; try { track.releasePointerCapture(e.pointerId); } catch(_){} };
      track.addEventListener('pointerup', end);
      track.addEventListener('pointercancel', end);
      track.addEventListener('mouseleave', () => dragging = false);
    }

    // Autoplay with pause on hover/focus
    function startAutoplay() {
      if (prefersReduced) return;
      stopAutoplay();
      autoplayTimer = setInterval(() => { if (!pause) stepDir(1); }, 5000);
    }
    function stopAutoplay() { if (autoplayTimer) clearInterval(autoplayTimer); }

    function init() {
      root = $(SEL.root); if (!root) return;
      track = $(SEL.track, root); cards = $$(SEL.card, root);
      btnPrev = $(SEL.prev, root.closest('section')) || $(SEL.prev);
      btnNext = $(SEL.next, root.closest('section')) || $(SEL.next);
      if (!track || !cards.length) return;

      // Buttons
      btnPrev && btnPrev.addEventListener('click', () => stepDir(-1));
      btnNext && btnNext.addEventListener('click', () => stepDir(1));

      // Keyboard
      track.addEventListener('keydown', onKeydown);

      // Hover/focus pause
      const container = root.closest('.container-x') || root;
      container.addEventListener('mouseenter', () => (pause = true));
      container.addEventListener('mouseleave', () => (pause = false));
      container.addEventListener('focusin', () => (pause = true));
      container.addEventListener('focusout', () => (pause = false));

      // Drag
      enableDrag();

      // Resize -> correct selection
      window.addEventListener('resize', () => updateSelected(), { passive: true });
      updateSelected();

      // Autoplay
      startAutoplay();
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) stopAutoplay(); else startAutoplay();
      });
    }

    return { init };
  })();

  /* ----------------------------------
   * 3) Ratings bars + counters animation
   * ---------------------------------- */
  const Ratings = (() => {
    const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

    function parseStar(label) { // expects '5★' etc
      const m = (label || '').trim().match(/^(\d)/);
      return m ? Number(m[1]) : 0;
    }

    function animateValue(el, to, dur = 900) {
      if (!el) return;
      const from = Number(el.textContent || 0);
      const start = performance.now();
      function frame(now) {
        const p = Math.min(1, (now - start) / dur);
        const v = Math.round(from + (to - from) * easeOutCubic(p));
        el.textContent = String(v);
        if (p < 1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    }

    function animateWidth(el, toPct, dur = 900) {
      if (!el) return;
      const from = parseFloat(el.style.width) || 0;
      const start = performance.now();
      function frame(now) {
        const p = Math.min(1, (now - start) / dur);
        const v = from + (toPct - from) * easeOutCubic(p);
        el.style.width = v + '%';
        if (p < 1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    }

    function computeAndAnimate() {
      const rows = $$('[data-row]');
      if (!rows.length) return;

      // Compute totals
      let total = 0; const buckets = [];
      rows.forEach(r => {
        const count = Number(r.getAttribute('data-value') || 0);
        const label = r.getAttribute('data-label') || '';
        total += count;
        buckets.push({ star: parseStar(label), count, row: r });
      });

      // Average
      const sum = buckets.reduce((acc, b) => acc + (b.star * b.count), 0);
      const avg = total ? (sum / total) : 0;
      const avgEl = $('#avg-number');
      const totalEl = $('#total-reviews');
      if (avgEl) avgEl.textContent = avg.toFixed(1);
      if (totalEl) animateValue(totalEl, total, prefersReduced ? 0 : 700);

      // Animate each row's bar + % now
      buckets.forEach(b => {
        const pct = total ? Math.round((b.count / total) * 100) : 0;
        const nowEl = $('.now', b.row);
        const barFill = $('.pg__fill', b.row);
        if (barFill) {
          barFill.style.width = '0%';
          animateWidth(barFill, pct, prefersReduced ? 0 : 900);
        }
        if (nowEl) animateValue(nowEl, pct, prefersReduced ? 0 : 900);
      });
    }

    function init() { computeAndAnimate(); }
    return { init };
  })();

  /* ------------------------------
   * 4) Minimal nav toggle (optional)
   * ------------------------------ */
  function initMobileNav() {
    const btn = $('[data-nav-toggle]');
    const panel = $('[data-nav-panel]');
    if (!btn || !panel) return;
    btn.addEventListener('click', () => panel.classList.toggle('hidden'));
  }

  /* ------------------------------
   * Boot
   * ------------------------------ */
  function init() {
    initMobileNav();
    Reveal.init();
    Carousel.init();
    Ratings.init();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
