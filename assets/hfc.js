/* =========================================
   Hamza Fitness Club – Global JS
   - Header include (robust paths)
   - Reveal on scroll
   - Simple carousel (auto-detect) hfc.js
   ========================================= */

// Respect reduced motion
const HFC_PREFERS_REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ===== Header include (works from subfolders & different dev servers) ===== */
document.addEventListener("DOMContentLoaded", () => {
  const mount = document.getElementById("header");
  if (!mount) return;

  // Build fallback paths based on current page depth
  const depth = (location.pathname.replace(/\/$/, "").match(/\//g) || []).length;
  const ups = Array.from({ length: Math.max(0, depth) }, (_, i) => "../".repeat(i + 1));

  const candidates = [
    "/components/header.html",           // root-relative
    "/components/header.html",            // same folder
    ...ups.map(u => `${u}/components/header.html`) // ../components/, ../../components/, ...
  ];

  (async function loadHeader() {
    let html = null, used = null;

    for (const url of candidates) {
      try {
        const res = await fetch(url, { cache: "no-store" });
        if (res.ok) { html = await res.text(); used = url; break; }
      } catch { /* try next */ }
    }

    if (!html) {
      console.error("HFC: failed to load header from", candidates);
      return;
    }

    mount.innerHTML = html;

    // Mobile nav toggle inside injected header
    const btn = mount.querySelector("[data-nav-toggle]");
    const panel = mount.querySelector("[data-nav-panel]");
    btn?.addEventListener("click", () => panel?.classList.toggle("hidden"));

    // Optional: auto top padding if page didn't add pt-*
    const headerEl = mount.querySelector("header");
    if (headerEl) {
      const h = headerEl.getBoundingClientRect().height;
      document.documentElement.style.setProperty("--header-h", `${h}px`);
      if (!/\bpt-/.test(document.body.className)) {
        document.body.style.paddingTop = `${h}px`;
      }
    }

    console.log("HFC header loaded from:", used);
  })();
});

/* ===== Reveal-on-scroll (.reveal + animation class, e.g. .fade-up) ===== */
(() => {
  const els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || !els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("show"); });
  }, { threshold: 0.14 });
  els.forEach(el => io.observe(el));
})();

/* ===== Footer include (works from subfolders & sets current year) ===== */
(function loadHfcFooter(){
  const mount = document.getElementById("footer");
  // If there's no explicit mount, append at end of body.
  const inject = (html) => {
    if (mount) mount.innerHTML = html; else document.body.insertAdjacentHTML("beforeend", html);
    const y = document.getElementById("y"); if (y) y.textContent = new Date().getFullYear();
  };

  const depth = (location.pathname.replace(/\/$/, "").match(/\//g) || []).length;
  const ups = Array.from({ length: Math.max(0, depth) }, (_, i) => "../".repeat(i + 1));

  const candidates = [
    "/components/footer.html",
    "components/footer.html",
    ...ups.map(u => `${u}components/footer.html`)
  ];

  (async () => {
    for (const url of candidates) {
      try {
        const res = await fetch(url, { cache: "no-store" });
        if (res.ok) { inject(await res.text()); return; }
      } catch {}
    }
    console.error("HFC: Could not load footer from", candidates);
  })();
})();

/* ===== Generic carousel (optional) =====
Markup:
<div data-carousel>
  <div data-carousel-track>...slides...</div>
  <button data-carousel-prev>‹</button>
  <button data-carousel-next>›</button>
  <div data-carousel-dots>
    <button aria-selected="true"></button>
    ...
  </div>
</div>
*/
(() => {
  const carousels = document.querySelectorAll("[data-carousel]");
  if (!carousels.length) return;

  carousels.forEach((root) => {
    const track = root.querySelector("[data-carousel-track]");
    if (!track) return;
    const slides = Array.from(track.children);
    const dotsWrap = root.querySelector("[data-carousel-dots]");
    const dots = dotsWrap ? Array.from(dotsWrap.querySelectorAll("button")) : [];
    const prev = root.querySelector("[data-carousel-prev]");
    const next = root.querySelector("[data-carousel-next]");

    let index = 0;
    const perView = () => (window.matchMedia("(min-width: 768px)").matches ? Math.min(3, slides.length) : 1);

    function clampIndex() {
      const max = Math.max(0, slides.length - perView());
      index = Math.max(0, Math.min(index, max));
    }

    function slideTo(i) {
      index = i;
      clampIndex();
      const cardW = slides[0].getBoundingClientRect().width;
      const gap = parseFloat(getComputedStyle(track).gap || 24);
      const offset = -(index * (cardW + gap));
      track.style.transform = `translateX(${offset}px)`;
      slides.forEach((s, si) => s.setAttribute("aria-selected", si === index ? "true" : "false"));
      dots.forEach((d, di) => d.setAttribute("aria-selected", di === index ? "true" : "false"));
    }

    const nextSlide = () => slideTo(index + 1);
    const prevSlide = () => slideTo(index - 1);

    // Dots
    dots.forEach((d, di) => d.addEventListener("click", () => { slideTo(di); stopAuto(); }));

    // Buttons
    prev?.addEventListener("click", () => { prevSlide(); stopAuto(); });
    next?.addEventListener("click", () => { nextSlide(); stopAuto(); });

    // Keyboard
    track.setAttribute("tabindex", "0");
    track.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") { nextSlide(); stopAuto(); }
      if (e.key === "ArrowLeft") { prevSlide(); stopAuto(); }
    });

    // Touch
    let startX = 0, dx = 0;
    track.addEventListener("touchstart", e => { startX = e.touches[0].clientX; dx = 0; stopAuto(); }, { passive: true });
    track.addEventListener("touchmove", e => { dx = e.touches[0].clientX - startX; }, { passive: true });
    track.addEventListener("touchend", () => { if (Math.abs(dx) > 40) (dx < 0 ? nextSlide() : prevSlide()); });

    // Autoplay
    let timer = null;
    function startAuto() {
      if (HFC_PREFERS_REDUCED) return;
      timer = setInterval(() => { slideTo(index + 1); }, 3500);
    }
    function stopAuto() { if (timer) clearInterval(timer); timer = null; }

    root.addEventListener("mouseenter", stopAuto);
    root.addEventListener("mouseleave", () => { if (!timer) startAuto(); });
    window.addEventListener("resize", () => slideTo(index));

    // init
    slideTo(0);
    startAuto();
  });
})();

/* ===== Generic mobile-nav toggle (for static headers, if any) ===== */
(() => {
  const btn = document.querySelector("[data-nav-toggle]");
  const panel = document.querySelector("[data-nav-panel]");
  if (!btn || !panel) return;
  btn.addEventListener("click", () => panel.classList.toggle("hidden"));
})();
