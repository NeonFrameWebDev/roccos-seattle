/* =========================================================
   ROCCO'S - main.js
   ES Module. No dependencies.
   ========================================================= */

// ----- NAV SCROLL OPACITY -----
const nav = document.getElementById('nav');
const SCROLL_THRESHOLD = 80;

function updateNav() {
  if (window.scrollY > SCROLL_THRESHOLD) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
}
window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

// ----- HERO PARALLAX -----
const heroBg = document.getElementById('heroBg');
let ticking = false;

function updateParallax() {
  if (!heroBg) return;
  const scrollY = window.scrollY;
  const offset = scrollY * 0.4;
  heroBg.style.transform = `translateY(${offset}px)`;
  ticking = false;
}

if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });
}

// ----- MOBILE MENU -----
const hamburger   = document.getElementById('hamburger');
const mobileMenu  = document.getElementById('mobileMenu');
const mobileClose = document.getElementById('mobileClose');
const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('.mobile-menu__link') : [];

function openMenu() {
  mobileMenu.classList.add('open');
  mobileMenu.removeAttribute('aria-hidden');
  hamburger.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
  mobileClose.focus();
}

function closeMenu() {
  mobileMenu.classList.remove('open');
  mobileMenu.setAttribute('aria-hidden', 'true');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
  hamburger.focus();
}

if (hamburger) hamburger.addEventListener('click', openMenu);
if (mobileClose) mobileClose.addEventListener('click', closeMenu);

mobileLinks.forEach(link => {
  link.addEventListener('click', closeMenu);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('open')) {
    closeMenu();
  }
});

// ----- LOADER CLEANUP -----
// After the CSS animation exits the loader, remove it from the DOM
const loader = document.getElementById('loader');
if (loader) {
  loader.addEventListener('animationend', (e) => {
    if (e.animationName === 'loaderExit') {
      loader.remove();
      document.body.style.overflow = '';
    }
  });
}

// ----- SCROLL REVEAL -----
const revealEls = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings slightly
        const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal:not(.visible)'));
        const idx = siblings.indexOf(entry.target);
        const delay = Math.min(idx * 0.08, 0.1);
        entry.target.style.transitionDelay = `${delay}s`;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  revealEls.forEach(el => observer.observe(el));
} else {
  // Fallback: show all immediately
  revealEls.forEach(el => el.classList.add('visible'));
}

// ----- SMOOTH SCROLL FOR ANCHOR LINKS -----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navHeight = nav ? nav.offsetHeight : 0;
    const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
