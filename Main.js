/**
 * portfolio/js/main.js
 * Amara Narayana Dasari — Portfolio
 * Pure vanilla JS: loader, nav, scroll reveal, active nav,
 * mobile menu, staggered animation delays.
 */

'use strict';

/* ============================================================
   1. LOADER
============================================================ */
(function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  // Hide after bar fills (~1.4s) + small buffer
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      // Trigger hero animations once loader is gone
      triggerHeroAnimations();
    }, 1600);
  });

  // Fallback: hide after 2.5s even if load event is slow
  setTimeout(() => {
    loader.classList.add('hidden');
    triggerHeroAnimations();
  }, 2500);
})();

/* ============================================================
   2. HERO STAGGERED ANIMATIONS
============================================================ */
function triggerHeroAnimations() {
  const els = document.querySelectorAll('.animate-in[data-delay]');
  els.forEach(el => {
    const delay = parseInt(el.dataset.delay, 10) * 120;
    setTimeout(() => el.classList.add('fired'), delay);
  });
}

/* ============================================================
   3. HEADER — SCROLL SHADOW
============================================================ */
(function initHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
})();

/* ============================================================
   4. SCROLL REVEAL
============================================================ */
(function initScrollReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  // Stagger grid children for a cascade effect
  const staggerGroups = [
    '.skills__grid .skill-block',
    '.fit-grid .fit-item',
    '.about__pillars .about__pillar',
  ];

  staggerGroups.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.style.transitionDelay = `${i * 70}ms`;
    });
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -50px 0px',
  });

  items.forEach(el => observer.observe(el));
})();

/* ============================================================
   5. ACTIVE NAV LINK ON SCROLL
============================================================ */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav__link:not(.nav__link--cta)');
  if (!sections.length || !links.length) return;

  const activate = () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 140) {
        current = sec.id;
      }
    });

    links.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', activate, { passive: true });
  activate(); // run once on load
})();

/* ============================================================
   6. SMOOTH SCROLL — ALL ANCHOR LINKS
============================================================ */
document.addEventListener('click', e => {
  const anchor = e.target.closest('a[href^="#"]');
  if (!anchor) return;

  const target = document.querySelector(anchor.getAttribute('href'));
  if (!target) return;

  e.preventDefault();
  const headerH = document.getElementById('header')?.offsetHeight || 80;
  const top = target.getBoundingClientRect().top + window.scrollY - headerH;
  window.scrollTo({ top, behavior: 'smooth' });
});

/* ============================================================
   7. MOBILE NAVIGATION
============================================================ */
(function initMobileNav() {
  const toggle   = document.getElementById('nav-toggle');
  const mobileEl = document.getElementById('nav-mobile');
  if (!toggle || !mobileEl) return;

  const spans = toggle.querySelectorAll('span');

  const open = () => {
    mobileEl.classList.add('open');
    document.body.style.overflow = 'hidden';
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity   = '0';
  };

  const close = () => {
    mobileEl.classList.remove('open');
    document.body.style.overflow = '';
    spans[0].style.transform = '';
    spans[1].style.opacity   = '';
  };

  toggle.addEventListener('click', () => {
    mobileEl.classList.contains('open') ? close() : open();
  });

  mobileEl.querySelectorAll('a').forEach(a => a.addEventListener('click', close));

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') close();
  });
})();

/* ============================================================
   8. PROJECT CARDS — subtle tilt on hover (desktop only)
============================================================ */
(function initCardTilt() {
  if (window.matchMedia('(max-width: 900px)').matches) return;

  document.querySelectorAll('.project').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width  / 2);
      const dy     = (e.clientY - cy) / (rect.height / 2);
      const tiltX  = -(dy * 1.5);
      const tiltY  =  (dx * 1.5);
      card.style.transform = `translateY(-2px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s cubic-bezier(0.4,0,0.2,1)';
    });
  });
})();

/* ============================================================
   9. TICKER — pause on hover
============================================================ */
(function initTicker() {
  const track = document.querySelector('.ticker__track');
  if (!track) return;

  track.addEventListener('mouseenter', () => {
    track.style.animationPlayState = 'paused';
  });
  track.addEventListener('mouseleave', () => {
    track.style.animationPlayState = 'running';
  });
})();