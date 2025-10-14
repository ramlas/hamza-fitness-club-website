/* assets/testimonials.js
   - Calculates average from bars (or use fixed)
   - Animates distribution bars on reveal
   - Carousel: buttons, keyboard, drag (touch + mouse), auto-snap
*/

(() => {
    const $  = (s, r=document) => r.querySelector(s);
    const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
  
    // ----- Ratings math from bar rows -----
    const rows = $$('#rating-bars [data-row]');
    const totalPct = rows.reduce((sum, r) => sum + Number(r.dataset.value||0), 0) || 100;
    const totalReviewsEl = $('#total-reviews');
    const avgNumberEl    = $('#avg-number');
    const avgStarsWrap   = $('#avg-stars');
  
    // If you want to set an explicit review count, do it here:
    const TOTAL_REVIEWS = Number(totalReviewsEl?.textContent || 12); // fallback 12
    const calcAverage = () => {
      // Percent-based approximation
      // Weighted rating: (5*p5 + 4*p4 + 3*p3 + 2*p2 + 1*p1)/100
      let weighted = 0;
      rows.forEach(r => {
        const label = (r.dataset.label||'5★').trim();
        const stars = Number(label[0]) || 5;
        const pct   = Number(r.dataset.value||0);
        weighted += stars * (pct / totalPct);
      });
      return Math.max(0, Math.min(5, weighted));
    };
  
    const average = calcAverage();
    if (avgNumberEl) avgNumberEl.textContent = average.toFixed(1);
  
    // Paint stars (supports halves)
    if (avgStarsWrap) {
      const full = Math.floor(average);
      const half = (average - full) >= 0.5;
      const stars = $$('#avg-stars svg');
      stars.forEach((s, i) => {
        if (i < full) s.classList.remove('opacity-50');
        else if (i === full && half) s.classList.remove('opacity-50');
        else s.classList.add('opacity-50');
      });
    }
  
    // ----- Animate bars when visible -----
    const animateBars = () => {
      rows.forEach(r => {
        const pct = Number(r.dataset.value||0);
        const fill = $('.pg__fill', r);
        const now  = $('.now', r);
        if (!fill) return;
        // simple tween
        const duration = 600;
        const start = performance.now();
        const animate = (t0) => {
          const p = Math.min(1, (t0 - start)/duration);
          fill.style.width = (pct * p) + '%';
          if (now) now.textContent = Math.round(pct * p);
          if (p < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
      });
    };
  
    const barsRoot = $('#rating-bars');
    if ('IntersectionObserver' in window && barsRoot) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            animateBars();
            io.disconnect();
          }
        });
      }, { threshold: 0.3 });
      io.observe(barsRoot);
    } else {
      animateBars();
    }
  
    // ----- Carousel -----
    const carousel    = $('#reviewsCarousel');
    const track       = $('.reel__track', carousel);
    const cards       = $$('.reel__card', track);
    const prevBtn     = $('[data-reel-prev]', carousel);
    const nextBtn     = $('[data-reel-next]', carousel);
    const dotsWrap    = $('#reviewsDots');
  
    // Snap config
    track.style.scrollSnapType = 'x mandatory';
    track.style.display = 'grid';
    track.style.gridAutoFlow = 'column';
    track.style.gridAutoColumns = 'calc(min(100%, 360px))';
    track.style.gap = '16px';
    track.style.overflowX = 'auto';
    track.style.scrollBehavior = 'smooth';
    track.setAttribute('aria-live', 'polite');
  
    // Build dots
    if (dotsWrap) {
      cards.forEach((_, i) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'w-2.5 h-2.5 rounded-full bg-white/20 hover:bg-white/40 transition';
        b.setAttribute('aria-label', `Go to review ${i+1}`);
        b.addEventListener('click', () => snapTo(i));
        dotsWrap.appendChild(b);
      });
    }
  
    const updateDots = () => {
      if (!dotsWrap) return;
      const dots = $$('#reviewsDots > button');
      const idx  = nearestIndex();
      dots.forEach((d, i) => {
        d.classList.toggle('bg-[color:var(--brand-red)]', i === idx);
        d.classList.toggle('bg-white/20', i !== idx);
      });
    };
  
    const cardWidth = () => cards[0]?.getBoundingClientRect().width || 360;
    const gapPx     = 16;
  
    const nearestIndex = () => {
      const x = track.scrollLeft;
      const w = cardWidth() + gapPx;
      return Math.max(0, Math.min(cards.length-1, Math.round(x / w)));
    };
  
    const snapTo = (i) => {
      const w = cardWidth() + gapPx;
      track.scrollTo({ left: i * w, behavior: 'smooth' });
      cards.forEach((c, idx) => c.setAttribute('aria-selected', String(idx === i)));
      updateDots();
    };
  
    prevBtn?.addEventListener('click', () => snapTo(Math.max(0, nearestIndex()-1)));
    nextBtn?.addEventListener('click', () => snapTo(Math.min(cards.length-1, nearestIndex()+1)));
  
    // Keyboard
    track.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); nextBtn?.click(); }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); prevBtn?.click(); }
    });
  
    // Drag / Touch
    let isDown = false, startX = 0, startScroll = 0;
    const onDown = (clientX) => { isDown = true; startX = clientX; startScroll = track.scrollLeft; track.classList.add('cursor-grabbing'); };
    const onMove = (clientX) => { if (!isDown) return; track.scrollLeft = startScroll - (clientX - startX); };
    const onUp   = () => { if (!isDown) return; isDown = false; track.classList.remove('cursor-grabbing'); snapTo(nearestIndex()); };
  
    track.addEventListener('mousedown', (e) => onDown(e.clientX));
    window.addEventListener('mousemove', (e) => onMove(e.clientX));
    window.addEventListener('mouseup', onUp);
  
    track.addEventListener('touchstart', (e) => onDown(e.touches[0].clientX), {passive:true});
    track.addEventListener('touchmove',  (e) => onMove(e.touches[0].clientX), {passive:true});
    track.addEventListener('touchend', onUp);
  
    // On resize, re-snap to current
    let rAF;
    window.addEventListener('resize', () => {
      cancelAnimationFrame(rAF);
      rAF = requestAnimationFrame(() => snapTo(nearestIndex()));
    });
  
    // Initialize
    snapTo(0);
  })();
  