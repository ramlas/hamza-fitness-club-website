// assets/header.js
(function () {
    // -------------------------------
    // Configurable delays (ms)
    // -------------------------------
    const ENTER_DELAY = 80;   // small delay before showing
    const LEAVE_DELAY = 450;  // <- increase this to keep dropdown open longer
  
    // -------------------------------
    // Mobile menu toggle
    // -------------------------------
    const toggleBtn = document.querySelector('[data-nav-toggle]');
    const mobilePanel = document.querySelector('[data-nav-panel]');
    if (toggleBtn && mobilePanel) {
      const setState = (open) => {
        toggleBtn.setAttribute('aria-expanded', String(open));
        mobilePanel.classList.toggle('hidden', !open);
      };
      toggleBtn.addEventListener('click', () => {
        const open = toggleBtn.getAttribute('aria-expanded') !== 'true';
        setState(open);
      });
      // Close when clicking outside panel (mobile only)
      document.addEventListener('click', (e) => {
        if (window.matchMedia('(min-width: 768px)').matches) return;
        if (!mobilePanel.contains(e.target) && e.target !== toggleBtn && !toggleBtn.contains(e.target)) {
          setState(false);
        }
      });
    }
  
    // -------------------------------
    // Dropdown hover with linger + a11y
    // -------------------------------
    const dropdownItems = Array.from(document.querySelectorAll('#header li.relative.group'));
  
    dropdownItems.forEach((item) => {
      const btn  = item.querySelector('button[aria-haspopup="true"]');
      const menu = item.querySelector('[data-menu]');
      if (!btn || !menu) return;
  
      let enterT, leaveT;
  
      const show = () => {
        clearTimeout(leaveT);
        enterT = setTimeout(() => {
          menu.classList.remove('invisible', 'opacity-0', 'translate-y-1');
          btn.setAttribute('aria-expanded', 'true');
        }, ENTER_DELAY);
      };
  
      const hide = () => {
        clearTimeout(enterT);
        leaveT = setTimeout(() => {
          menu.classList.add('invisible', 'opacity-0', 'translate-y-1');
          btn.setAttribute('aria-expanded', 'false');
        }, LEAVE_DELAY);
      };
  
      // Mouse interactions
      item.addEventListener('mouseenter', show);
      item.addEventListener('mouseleave', hide);
  
      // Focus interactions (keyboard nav)
      item.addEventListener('focusin', show);
      item.addEventListener('focusout', (e) => {
        if (!item.contains(e.relatedTarget)) hide();
      });
  
      // Escape key closes the menu and returns focus to button
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          hide();
          btn.focus();
        }
      });
  
      // Click on button toggles for touch/pen users on desktop
      btn.addEventListener('click', (e) => {
        // Prevent page jump and just toggle
        e.preventDefault();
        const isOpen = btn.getAttribute('aria-expanded') === 'true';
        if (isOpen) {
          hide();
        } else {
          show();
        }
      });
    });
  
    // -------------------------------
    // Optional: add subtle shadow when scrolled
    // -------------------------------
    const header = document.getElementById('header');
    if (header) {
      const onScroll = () => {
        if (window.scrollY > 2) {
          header.classList.add('border-white/20');
        } else {
          header.classList.remove('border-white/20');
        }
      };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    }
  })();
  