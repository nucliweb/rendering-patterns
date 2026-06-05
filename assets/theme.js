// Apply saved theme before first paint to avoid flash
(function () {
  const saved = localStorage.getItem('rp-theme');
  if (saved) document.documentElement.dataset.theme = saved;
})();

document.addEventListener('DOMContentLoaded', function () {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;

  function isLight() {
    const theme = document.documentElement.dataset.theme;
    if (theme === 'light') return true;
    if (theme === 'dark') return false;
    return window.matchMedia('(prefers-color-scheme: light)').matches;
  }

  function update() {
    btn.textContent = isLight() ? '🌙' : '☀';
    btn.title = isLight() ? 'Switch to dark' : 'Switch to light';
  }

  update();

  btn.addEventListener('click', function () {
    const next = isLight() ? 'dark' : 'light';
    document.documentElement.dataset.theme = next;
    localStorage.setItem('rp-theme', next);
    update();
  });
});
