// ── ANS ENDE VON main.js ANHÄNGEN ──

const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  function setTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem('rz-theme', t);
  }

  const saved = localStorage.getItem('rz-theme');
  setTheme(saved || (prefersDark.matches ? 'dark' : 'light'));

  themeToggle.addEventListener('click', () => {
    setTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });

  prefersDark.addEventListener('change', e => {
    if (!localStorage.getItem('rz-theme')) setTheme(e.matches ? 'dark' : 'light');
  });
}
