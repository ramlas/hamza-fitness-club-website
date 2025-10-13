/* Pricing page interactions
 * - Header/Footer includes via [data-include]
 * - Billing toggle (monthly/yearly) with localStorage persistence
 * - Minor FAQ enhancements (close siblings when one opens)
 *
 * Requires assets/hfc.js for reveal animations; this file keeps page-specific logic here.
 */
(() => {
    const $ = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
    const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  
    /* ------------------------------
     * HTML includes loader
     * ------------------------------ */
    async function hydrateIncludes() {
      const slots = $$('[data-include]');
      await Promise.all(slots.map(async slot => {
        const url = slot.getAttribute('data-include');
        if (!url) return;
        try {
          const res = await fetch(url, { credentials: 'same-origin' });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const html = await res.text();
          slot.outerHTML = html; // replace placeholder
        } catch (err) {
          console.warn('Include failed for', url, err);
          // graceful fallback stub
          slot.innerHTML = `<div class="text-sm text-gray-400 py-3 px-4 border border-white/10 rounded">Component failed to load. <code class="text-gray-300">${url}</code></div>`;
        }
      }));
    }
  
    /* ------------------------------
     * Billing toggle
     * ------------------------------ */
    function initBillingToggle() {
      const plans = $('#plans');
      const input = $('#billing');
      if (!plans || !input) return;
  
      // restore preference
      const saved = localStorage.getItem('hfc-billing');
      if (saved === 'yearly') { input.checked = true; plans.dataset.billing = 'yearly'; }
  
      function syncARIA() {
        input.setAttribute('aria-pressed', input.checked ? 'true' : 'false');
        input.setAttribute('aria-label', input.checked ? 'Yearly billing enabled' : 'Monthly billing enabled');
      }
  
      function update() {
        const mode = input.checked ? 'yearly' : 'monthly';
        plans.dataset.billing = mode;
        localStorage.setItem('hfc-billing', mode);
        syncARIA();
        // Optional micro-anim on price swap
        if (!prefersReduced) {
          const els = $$('[data-price-mo], [data-price-yr]', plans);
          els.forEach(el => {
            el.style.transition = 'transform 260ms cubic-bezier(.22,.61,.36,1), opacity 220ms ease';
            el.style.transform = 'translateY(-6px)';
            el.style.opacity = '0.85';
            setTimeout(() => { el.style.transform = 'none'; el.style.opacity = '1'; }, 20);
          });
        }
      }
  
      input.addEventListener('change', update);
      syncARIA();
      update();
    }
  
    /* ------------------------------
     * FAQ: allow only one open at a time (accordion behavior)
     * ------------------------------ */
    function initFAQAccordion() {
      const all = $$('#faq details');
      if (!all.length) return;
      all.forEach(d => d.addEventListener('toggle', () => {
        if (d.open) all.filter(x => x !== d).forEach(x => (x.open = false));
      }));
    }
  
    async function init() {
      await hydrateIncludes();
      initBillingToggle();
      initFAQAccordion();
    }
  
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  })();
  