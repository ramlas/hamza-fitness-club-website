/* ==================================================================
   Hamza Fitness Club — Classes page interactions
   File: assets/classes.js
   Depends on: assets/hfc.css (styles), assets/hfc.js (global nav + reveal)
   ================================================================== */

   (() => {
    const $  = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
    const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  
    /* --------------------------------------------------------------
     * 1) HERO PARALLAX: subtle movement of background and gradient
     * -------------------------------------------------------------- */
    function initHeroParallax() {
      if (reduceMotion) return;
      const hero = $('#top');
      if (!hero) return;
  
      const bg = hero.querySelector('img');
      const overlay = hero.querySelector('div[class*="bg-gradient"]');
  
      let ticking = false;
      const onScroll = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          const rect = hero.getBoundingClientRect();
          const progress = Math.min(Math.max(-rect.top / Math.max(1, rect.height), 0), 1);
  
          if (bg) {
            const scale = 1 + progress * 0.04;  // up to 4% scale
            const ty = progress * 12;           // up to 12px translate
            bg.style.transform = `translateY(${ty}px) scale(${scale})`;
            bg.style.willChange = 'transform';
          }
          if (overlay) {
            overlay.style.opacity = `${0.7 + progress * 0.2}`;
            overlay.style.willChange = 'opacity';
          }
          ticking = false;
        });
      };
  
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    }
  
    /* --------------------------------------------------------------
     * 2) REVEAL STAGGER: add small, incremental animation delays
     *    (works with .reveal + your hfc.css keyframes)
     * -------------------------------------------------------------- */
    function initRevealStagger() {
      const revealables = $$('.reveal');
      if (!revealables.length) return;
      // Only set delays to avoid extra CSS; hfc.js handles adding "show"
      const stepMs = 80;
      revealables.forEach((el, i) => {
        el.style.animationDelay = `${i * stepMs}ms`;
      });
    }
  
    /* --------------------------------------------------------------
     * 3) HOVER ELEVATION: cards lift slightly with shadow on hover
     * -------------------------------------------------------------- */
    function initCardElevate() {
      if (reduceMotion) return;
  
      const cards = $$('#benefits article, #how article, #reviews article');
      cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
          card.style.transition = 'transform 180ms ease, box-shadow 220ms ease';
          card.style.transform  = 'translateY(-3px)';
          card.style.boxShadow  = '0 10px 30px rgba(0,0,0,.35)';
        });
        card.addEventListener('mouseleave', () => {
          card.style.transition = 'transform 240ms cubic-bezier(.22,.72,.24,.99), box-shadow 220ms ease';
          card.style.transform  = '';
          card.style.boxShadow  = '';
        });
      });
    }
  
    /* --------------------------------------------------------------
     * 4) A11Y: make cards keyboard focusable with subtle pulse
     * -------------------------------------------------------------- */
    function initKeyboardPulse() {
      const cards = $$('#benefits article, #how article, #reviews article');
      cards.forEach(card => {
        card.tabIndex = 0;
        card.setAttribute('role', 'group');
        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            if (reduceMotion) return;
            card.animate(
              [
                { transform: 'scale(1)'   },
                { transform: 'scale(1.02)'},
                { transform: 'scale(1)'   },
              ],
              { duration: 220, easing: 'cubic-bezier(.22,.72,.24,.99)' }
            );
            e.preventDefault();
          }
        });
      });
    }
  
    /* --------------------------------------------------------------
     * 5) MOBILE NAV HOOK (if hfc.js adds toggle via data-* attrs)
     *    — nothing to do here if hfc.js already handles it
     * -------------------------------------------------------------- */
  
    /* --------------------------------------------------------------
     * INIT
     * -------------------------------------------------------------- */
    function init() {
      initHeroParallax();
      initRevealStagger();
      initCardElevate();
      initKeyboardPulse();
    }
  
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  })();
  