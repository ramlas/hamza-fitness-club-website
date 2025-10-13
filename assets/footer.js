// ======================================================
// Footer enhancements for Hamza Fitness Club
// ======================================================

// === Highlight today's operating hours ===
(() => {
    const hoursSection = document.getElementById('hours');
    if (!hoursSection) return;
  
    const today = new Date().getDay(); // Sunday = 0 ... Saturday = 6
    const row = hoursSection.querySelector(`[data-day="${today}"]`);
  
    if (row) {
      const dayEl = row.querySelector('dt');
      const timeEl = row.querySelector('dd');
  
      dayEl?.classList.add('font-extrabold', 'text-white');
      timeEl?.classList.add('font-extrabold', 'text-white');
    }
  })();
  
  // === Newsletter form feedback ===
  (() => {
    const form = document.getElementById('newsletter-form');
    if (!form) return;
  
    const button = form.querySelector('button[type="submit"]');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
  
      if (!form.reportValidity()) return;
  
      button.disabled = true;
      button.textContent = 'Thank You!';
      button.classList.add('opacity-80');
  
      setTimeout(() => {
        button.disabled = false;
        button.textContent = 'Sign Up';
        button.classList.remove('opacity-80');
        form.reset();
      }, 1800);
    });
  })();
  