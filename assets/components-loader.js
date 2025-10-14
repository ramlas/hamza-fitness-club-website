//components-loader.js 

(() => {
  const DEV_NO_CACHE = false;              // set true while developing
  const CONCURRENCY = 4;                   // how many partials to fetch in parallel
  const TIMEOUT_MS  = 8000;                // per-request timeout

  // Run after DOM is ready
  const onReady = (fn) =>
    document.readyState === 'loading'
      ? document.addEventListener('DOMContentLoaded', fn, { once: true })
      : fn();

  // Abortable fetch with timeout + one retry (network hiccups)
  async function fetchWithTimeout(url, opts = {}, timeout = TIMEOUT_MS, tries = 2) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
      const res = await fetch(url, {
        cache: DEV_NO_CACHE ? 'no-store' : 'default',
        credentials: 'same-origin',
        ...opts,
        signal: controller.signal
      });
      clearTimeout(id);
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      return res;
    } catch (err) {
      clearTimeout(id);
      if (tries > 1) return fetchWithTimeout(url, opts, timeout, tries - 1);
      throw err;
    }
  }

  // Turn HTML string into a live fragment and ensure <script> runs
  function htmlToFragment(html) {
    const range = document.createRange();
    range.selectNode(document.body);
    const frag = range.createContextualFragment(html);

    // Recreate any <script> so they execute (inline + external)
    frag.querySelectorAll('script').forEach((oldS) => {
      const s = document.createElement('script');
      for (const { name, value } of Array.from(oldS.attributes)) s.setAttribute(name, value);
      s.textContent = oldS.textContent || '';
      // Keep same referrer/cors defaults; external scripts will load async
      oldS.replaceWith(s);
    });

    return frag;
  }

  // Replace placeholder element with fetched component
  async function inject(el) {
    const src = el.getAttribute('data-include');
    if (!src || el.__hfcLoaded) return;   // idempotent guard
    el.__hfcLoaded = true;

    try {
      const res = await fetchWithTimeout(src);
      const html = await res.text();
      const frag = htmlToFragment(html);
      el.replaceWith(frag);
    } catch (err) {
      console.error(`Component load failed: ${src}`, err);
      const fallback = document.createElement('template');
      fallback.innerHTML = `<!-- Failed to load: ${src} (${String(err)}) -->`;
      el.replaceWith(fallback.content);
    }
  }

  // Simple task queue for controlled concurrency (prevents jank)
  async function runQueue(items, worker, concurrency = CONCURRENCY) {
    let i = 0, active = 0;
    return new Promise((resolve) => {
      const next = () => {
        if (i >= items.length && active === 0) return resolve();
        while (active < concurrency && i < items.length) {
          active++;
          worker(items[i++]).catch(() => {}).finally(() => { active--; next(); });
        }
      };
      next();
    });
  }

  onReady(() => {
    const nodes = Array.from(document.querySelectorAll('[data-include]'));
    if (nodes.length === 0) {
      // still announce readiness so dependent code doesn’t hang
      window.__componentsReady = true;
      document.dispatchEvent(new CustomEvent('components:ready'));
      return;
    }

    // Defer heavy work slightly to avoid blocking first paint
    (window.requestIdleCallback || window.setTimeout)(async () => {
      await runQueue(nodes, inject, CONCURRENCY);
      window.__componentsReady = true;
      document.dispatchEvent(new CustomEvent('components:ready'));
    }, 0);
  });
})();

