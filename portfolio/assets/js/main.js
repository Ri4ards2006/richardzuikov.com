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

// Auto trigger visible for above-fold elements
document.querySelectorAll('.fade-up').forEach(el => {
  const rect = el.getBoundingClientRect();
  if (rect.top < window.innerHeight) el.classList.add('visible');
});
