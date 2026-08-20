document.addEventListener('DOMContentLoaded', function () {
  // --- Menu hamburger (overlay mobile) ---
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navCloseBtn = document.getElementById('navCloseBtn');
  const navOverlay = document.getElementById('navOverlay');
  const body = document.body;

  function openNav() {
    navOverlay.classList.add('open');
    navOverlay.setAttribute('aria-hidden', 'false');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    body.classList.add('nav-locked');
  }

  function closeNav() {
    navOverlay.classList.remove('open');
    navOverlay.setAttribute('aria-hidden', 'true');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    body.classList.remove('nav-locked');
  }

  hamburgerBtn.addEventListener('click', openNav);
  navCloseBtn.addEventListener('click', closeNav);
  navOverlay.querySelectorAll('.nav-overlay-link').forEach(function (link) {
    link.addEventListener('click', closeNav);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeNav();
  });

  // --- Animation légère du header au scroll ---
  const siteHeader = document.getElementById('siteHeader');
  function handleHeaderScroll() {
    if (window.scrollY > 12) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();
});