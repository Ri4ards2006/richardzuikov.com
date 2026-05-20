// Cursor
const cursor = document.getElementById('cursor');
let mx = 0, my = 0;
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top = my + 'px';
});

// Burger menu
const burger = document.getElementById('burger');
const mobileNav = document.getElementById('mobileNav');
if (burger) {
  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    mobileNav.classList.toggle('open');
  });
  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      burger.classList.remove('open');
      mobileNav.classList.remove('open');
    });
  });
}

// Scroll fade-in
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.1 });
document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
document.querySelectorAll('.fade-up').forEach(el => {
  const rect = el.getBoundingClientRect();
  if (rect.top < window.innerHeight) el.classList.add('visible');
});

// ── THEME TOGGLE ──
function setTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  localStorage.setItem('rz-theme', t);
}
// Apply saved theme IMMEDIATELY (before paint)
const savedTheme = localStorage.getItem('rz-theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
setTheme(savedTheme || (prefersDark.matches ? 'dark' : 'light'));

const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    setTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });
  prefersDark.addEventListener('change', e => {
    if (!localStorage.getItem('rz-theme')) setTheme(e.matches ? 'dark' : 'light');
  });
}

// ── LANG TOGGLE ──
const translations = {
  de: {
    'nav-home': 'Home', 'nav-about': 'Über mich', 'nav-projects': 'Projekte', 'nav-contact': 'Kontakt',
    'home-label': 'Flensburg, DE · 19',
    'home-tagline': 'Low-Level, Hardware<br>und selbst gehostet.',
    'btn-timeline': 'Timeline ansehen',
    'btn-services': 'Zu meinen Services',
    'footer-bar-1': 'Flensburg, Deutschland',
    'footer-bar-2': 'C++ · Go · Linux · Embedded',
    'footer-bar-3': 'Verfügbar für Projekte',
  },
  en: {
    'nav-home': 'Home', 'nav-about': 'About', 'nav-projects': 'Projects', 'nav-contact': 'Contact',
    'home-label': 'Flensburg, DE · 19',
    'home-tagline': 'Low-Level, Hardware<br>and self-hosted.',
    'btn-timeline': 'View Timeline',
    'btn-services': 'My Services',
    'footer-bar-1': 'Flensburg, Germany',
    'footer-bar-2': 'C++ · Go · Linux · Embedded',
    'footer-bar-3': 'Available for work',
  }
};

function setLang(lang) {
  document.documentElement.setAttribute('lang', lang);
  localStorage.setItem('rz-lang', lang);
  const t = translations[lang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key]) el.innerHTML = t[key];
  });
  const langBtn = document.getElementById('langToggle');
  if (langBtn) langBtn.textContent = lang === 'de' ? 'EN' : 'DE';
}

const savedLang = localStorage.getItem('rz-lang') || 'de';
setLang(savedLang);

const langToggle = document.getElementById('langToggle');
if (langToggle) {
  langToggle.addEventListener('click', () => {
    setLang(document.documentElement.getAttribute('lang') === 'de' ? 'en' : 'de');
  });
}
