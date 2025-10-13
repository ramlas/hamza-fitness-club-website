/* ==========================================================
   Hamza Fitness Club — Trainers page interactions
   File: assets/trainers.js
   Works alongside: assets/hfc.css (styles) + assets/hfc.js (global reveal/nav)
   ========================================================== */

   (() => {
    const $  = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
    const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  
    /* ----------------------------------------------------------
     * 1) HERO PARALLAX (very subtle, skipped for reduced-motion)
     * ---------------------------------------------------------- */
    function initHeroParallax() {
      if (prefersReduced) return;
      const hero = $('#header ~ section'); // first section after header (hero)
      if (!hero) return;
  
      const bg = hero.querySelector('img[alt*="hero"]');
      const scrim = hero.querySelector('div[aria-hidden], .bg-gradient-to-b');
  
      let ticking = false;
  
      function onScroll() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          const rect = hero.getBoundingClientRect();
          // As hero scrolls out, lightly translate/scale the background and deepen scrim
          const progress = Math.min(Math.max(-rect.top / Math.max(1, rect.height), 0), 1);
          if (bg) {
            const scale = 1 + progress * 0.04;         // up to 4% scale
            const ty = progress * 12;                   // up to 12px translate
            bg.style.transform = `translateY(${ty}px) scale(${scale})`;
            bg.style.willChange = 'transform';
          }
          if (scrim) {
            const extra = progress * 0.15;              // deepen darkness slightly
            scrim.style.opacity = `${0.55 + extra}`;
            scrim.style.willChange = 'opacity';
          }
          ticking = false;
        });
      }
  
      // Prime once and bind
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    }
  
    /* ----------------------------------------------------------
     * 2) TRAINER CARD TILT (mouse/touch), with gentle snap-back
     * ---------------------------------------------------------- */
    function initCardTilt() {
      if (prefersReduced) return;
  
      const cards = $$('#trainers article');
  
      const state = new WeakMap(); // per-card state
  
      function setTransform(card, rx = 0, ry = 0, z = 1) {
        // Keep transforms additive but simple: we control transform fully here.
        card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0) scale(${z})`;
        card.style.transition = 'transform 90ms ease';
        card.style.willChange = 'transform';
      }
  
      function reset(card) {
        card.style.transition = 'transform 240ms cubic-bezier(.22,.72,.24,.99)';
        setTransform(card, 0, 0, 1);
      }
  
      function handleMove(e, card) {
        const s = state.get(card);
        if (!s) return;
  
        const rect = card.getBoundingClientRect();
        const clientX = (e.touches && e.touches[0] ? e.touches[0].clientX : e.clientX);
        const clientY = (e.touches && e.touches[0] ? e.touches[0].clientY : e.clientY);
  
        // Normalize to [-1, 1]
        const nx = ((clientX - rect.left) / rect.width) * 2 - 1;
        const ny = ((clientY - rect.top) / rect.height) * 2 - 1;
  
        // Max tilt
        const maxX = 6;  // deg
        const maxY = 6;  // deg
  
        const ry = nx * maxY;     // rotateY (left-right)
        const rx = -ny * maxX;    // rotateX (up-down)
  
        setTransform(card, rx, ry, 1.02);
      }
  
      function attach(card) {
        state.set(card, { active: false });
  
        const onEnter = () => {
          card.style.transition = 'transform 160ms ease';
          setTransform(card, 0, 0, 1.02);
        };
        const onLeave = () => reset(card);
  
        const onMove = (e) => handleMove(e, card);
  
        card.addEventListener('mouseenter', onEnter);
        card.addEventListener('mouseleave', onLeave);
        card.addEventListener('mousemove', onMove, { passive: true });
  
        // Touch support
        card.addEventListener('touchstart', onEnter, { passive: true });
        card.addEventListener('touchmove', onMove, { passive: true });
        card.addEventListener('touchend', onLeave, { passive: true });
        card.addEventListener('touchcancel', onLeave, { passive: true });
      }
  
      cards.forEach(attach);
    }
  
    /* ----------------------------------------------------------
     * 3) STAGGERED REVEAL (plays nicely with global hfc.js)
     *    - We add incremental animation delays as classes on load
     * ---------------------------------------------------------- */
    function initRevealStagger() {
      const cards = $$('#trainers article.reveal, #who .reveal, .reveal.fade-up');
      if (!cards.length) return;
  
      // Tailwind CDN includes animation utilities but not custom delays;
      // We'll set inline animationDelay safely (only a style attribute),
      // which does not add CSS rules and respects your hfc.css keyframes.
      // If you prefer absolutely no inline styles, remove this block.
      const base = 0;
      const step = 80; // ms
  
      cards.forEach((el, i) => {
        // Only set delay — the actual 'show' class is handled by hfc.js via IO
        el.style.animationDelay = `${base + i * step}ms`;
      });
    }
  
    /* ----------------------------------------------------------
     * 4) KEYBOARD FOCUS HINT (make cards tappable with Enter)
     * ---------------------------------------------------------- */
    function initKeyboardFocus() {
      const cards = $$('#trainers article');
      cards.forEach(card => {
        card.tabIndex = 0;
        card.setAttribute('role', 'group');
        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            // Small pulse on key activate
            if (prefersReduced) return;
            card.animate(
              [
                { transform: 'perspective(800px) scale(1.00)' },
                { transform: 'perspective(800px) scale(1.03)' },
                { transform: 'perspective(800px) scale(1.00)' },
              ],
              { duration: 240, easing: 'cubic-bezier(.22,.72,.24,.99)' }
            );
            e.preventDefault();
          }
        });
      });
    }
  
    /* ----------------------------------------------------------
     * INIT
     * ---------------------------------------------------------- */
    function init() {
      initHeroParallax();
      initCardTilt();
      initRevealStagger();
      initKeyboardFocus();
    }
  
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  })();
  