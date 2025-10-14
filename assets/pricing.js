// assets/pricing.js — PKR toggle + simple reveals

(function () {
    const PKR = new Intl.NumberFormat('en-PK', {
      style: 'currency', currency: 'PKR', maximumFractionDigits: 0
    });
  
    // Toggle prices
    const toggle = document.getElementById('billing');
    const planSection = document.getElementById('plans');
    const priceEls = Array.from(document.querySelectorAll('#plans .price'));
  
    function applyPrices(yearly) {
      priceEls.forEach(el => {
        const mo = Number(el.getAttribute('data-mo') || 0);
        const yr = Number(el.getAttribute('data-yr') || 0); // monthly equivalent when yearly
        const value = yearly ? yr : mo;
        el.textContent = PKR.format(value);
      });
      planSection?.setAttribute('data-billing', yearly ? 'yearly' : 'monthly');
    }
  
    toggle?.addEventListener('change', (e) => {
      applyPrices(e.target.checked);
    });
  
    // Initial render
    applyPrices(toggle?.checked);
  
    // Simple reveal on scroll (uses .reveal class)
    const reveals = Array.from(document.querySelectorAll('.reveal'));
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(({ isIntersecting, target }) => {
          if (isIntersecting) {
            target.classList.add('in');
            io.unobserve(target);
          }
        });
      }, { threshold: 0.1 });
  
      reveals.forEach(el => io.observe(el));
    } else {
      // Fallback
      reveals.forEach(el => el.classList.add('in'));
    }
  })();
  