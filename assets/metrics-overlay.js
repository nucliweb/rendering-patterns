/**
 * Real-time Core Web Vitals overlay.
 * Measures LCP, INP, CLS via web-vitals, FPS via rAF, TTFB via Navigation Timing.
 * Toggle visibility: press M or click the overlay button.
 */
(function () {
  const THRESHOLDS = {
    LCP:  { good: 2500, poor: 4000 },
    INP:  { good: 200,  poor: 500  },
    CLS:  { good: 0.1,  poor: 0.25 },
    FPS:  { good: 55,   poor: 30   },
    TTFB: { good: 800,  poor: 1800 },
  };

  function rating(name, value) {
    const t = THRESHOLDS[name];
    if (!t) return 'pending';
    if (name === 'FPS') {
      if (value >= t.good) return 'good';
      if (value >= t.poor) return 'needs-improvement';
      return 'poor';
    }
    if (value <= t.good) return 'good';
    if (value <= t.poor) return 'needs-improvement';
    return 'poor';
  }

  function barWidth(name, value) {
    const t = THRESHOLDS[name];
    if (!t || value == null) return 0;
    const max = t.poor * 1.5;
    if (name === 'FPS') return Math.min(100, (value / 60) * 100);
    return Math.min(100, (value / max) * 100);
  }

  function fmt(name, value) {
    if (value == null) return '—';
    if (name === 'CLS') return value.toFixed(3);
    if (name === 'FPS') return Math.round(value) + ' fps';
    return Math.round(value) + ' ms';
  }

  const state = { LCP: null, INP: null, CLS: null, FPS: null, TTFB: null, bfcache: false };

  function buildOverlay() {
    const el = document.createElement('div');
    el.id = 'metrics-overlay';
    el.innerHTML = `
      <div id="metrics-overlay-header">
        <span id="metrics-overlay-title">Web Vitals</span>
        <button id="metrics-toggle-btn" title="Toggle (M)">hide</button>
      </div>
      ${['LCP', 'INP', 'CLS', 'FPS', 'TTFB'].map(name => `
        <div class="metric-row" id="row-${name}">
          <span class="metric-label">${name}</span>
          <div class="metric-bar"><div class="metric-bar-fill" id="bar-${name}" style="width:0%"></div></div>
          <span class="metric-value pending" id="val-${name}">—</span>
        </div>
      `).join('')}
      <div id="bfcache-row" style="display:none;margin-top:0.4rem">
        <span class="metric-badge bfcache">✓ Restored from bfcache</span>
      </div>
    `;
    document.body.appendChild(el);

    document.getElementById('metrics-toggle-btn').addEventListener('click', toggleOverlay);
    document.addEventListener('keydown', e => { if (e.key === 'm' || e.key === 'M') toggleOverlay(); });
  }

  let visible = true;
  function toggleOverlay() {
    visible = !visible;
    const el = document.getElementById('metrics-overlay');
    const btn = document.getElementById('metrics-toggle-btn');
    el.classList.toggle('hidden', !visible);
    btn.textContent = visible ? 'hide' : 'show';
  }

  function updateMetric(name, value) {
    state[name] = value;
    const valEl = document.getElementById('val-' + name);
    const barEl = document.getElementById('bar-' + name);
    if (!valEl || !barEl) return;
    const r = rating(name, value);
    valEl.textContent = fmt(name, value);
    valEl.className = 'metric-value ' + r;
    barEl.style.width = barWidth(name, value) + '%';
    barEl.style.background = r === 'good' ? '#52c07a' : r === 'needs-improvement' ? '#f0a04a' : '#e05252';
  }

  function measureTTFB() {
    const nav = performance.getEntriesByType('navigation')[0];
    if (nav) updateMetric('TTFB', nav.responseStart - nav.requestStart);
  }

  function measureFPS() {
    let last = performance.now();
    let frames = 0;
    function tick(now) {
      frames++;
      const elapsed = now - last;
      if (elapsed >= 500) {
        updateMetric('FPS', (frames / elapsed) * 1000);
        frames = 0;
        last = now;
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function measureVitals() {
    const script = document.createElement('script');
    script.type = 'module';
    script.textContent = `
      import { onLCP, onINP, onCLS } from 'https://unpkg.com/web-vitals@4/dist/web-vitals.attribution.js?module';
      const dispatch = (name, value) => window.dispatchEvent(new CustomEvent('vital', { detail: { name, value } }));
      onLCP(m => dispatch('LCP', m.value));
      onINP(m => dispatch('INP', m.value));
      onCLS(m => dispatch('CLS', m.value));
    `;
    document.head.appendChild(script);
    window.addEventListener('vital', e => updateMetric(e.detail.name, e.detail.value));
  }

  function checkBfcache() {
    window.addEventListener('pageshow', e => {
      if (e.persisted) {
        state.bfcache = true;
        const row = document.getElementById('bfcache-row');
        if (row) row.style.display = 'block';
      }
    });
  }

  function init() {
    buildOverlay();
    measureTTFB();
    measureFPS();
    measureVitals();
    checkBfcache();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
