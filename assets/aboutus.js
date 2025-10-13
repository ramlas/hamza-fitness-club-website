/* ==========================================================
   Hamza Fitness Club — About Page Animations
   File: assets/about.js
   ========================================================== */
   (() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
    // Reveal on scroll
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('show');
      });
    }, { threshold: 0.15 });
  
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  
    // Animated counters
    const counters = document.querySelectorAll('.counter');
    const animateCounter = el => {
      const target = parseFloat(el.dataset.target);
      let current = 0;
      const step = target / 80;
  
      const update = () => {
        current += step;
        if (current < target) {
          el.textContent = current.toFixed(0) + (target % 1 ? '+' : 'K+');
          requestAnimationFrame(update);
        } else {
          el.textContent = target % 1 ? target.toFixed(1) : target + 'K+';
        }
      };
      update();
    };
  
    const counterObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !prefersReduced) {
          animateCounter(entry.target);
          counterObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
  
    counters.forEach(c => counterObs.observe(c));
  
    // Year
    document.getElementById('year').textContent = new Date().getFullYear();
  })();
  