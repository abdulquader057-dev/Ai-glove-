import { $, $$, on, off, addClass, removeClass } from '../utils/dom.js';
import { eventBus } from '../utils/events.js';
import { APP_CONFIG } from '../config/app.config.js';
import { router } from '../router.js';

export function render() {
  const linksHtml = APP_CONFIG.navigation.map(link => 
    `<a href="${link.hash}" class="nav-link" data-route="${link.hash}">${link.label}</a>`
  ).join('');

  return `
    <nav class="navbar glass">
      <div class="nav-container">
        <a href="#home" class="nav-logo text-glow" data-route="home">AI GLOVE</a>
        <div class="nav-links">
          ${linksHtml}
          <button class="btn btn-primary btn-sm nav-cta" data-route="#ai-glove">GET STARTED</button>
        </div>
        <button class="nav-hamburger">
          <span></span><span></span><span></span>
        </button>
      </div>
      <div class="nav-mobile-menu">
        ${linksHtml}
        <button class="btn btn-primary btn-sm nav-cta" data-route="#ai-glove">GET STARTED</button>
      </div>
    </nav>
  `;
}

export function init() {
  const navbar = $('.navbar');
  const hamburger = $('.nav-hamburger');
  const mobileMenu = $('.nav-mobile-menu');
  const navLinks = $$('.nav-link, .nav-logo, .nav-cta');

  if (hamburger) {
    on(hamburger, 'click', () => {
      if (mobileMenu.classList.contains('active')) {
        removeClass(mobileMenu, 'active');
        removeClass(hamburger, 'active');
      } else {
        addClass(mobileMenu, 'active');
        addClass(hamburger, 'active');
      }
    });
  }

  navLinks.forEach(link => {
    on(link, 'click', (e) => {
      e.preventDefault();
      const route = link.getAttribute('data-route');
      if (route) {
        router.navigate(route);
      }
      if (mobileMenu) removeClass(mobileMenu, 'active');
      if (hamburger) removeClass(hamburger, 'active');
    });
  });

  on(window, 'scroll', () => {
    if (window.scrollY > 50) {
      addClass(navbar, 'navbar-scrolled');
    } else {
      removeClass(navbar, 'navbar-scrolled');
    }
  });

  eventBus.on('route-change', (hash) => {
    updateActiveLink(hash);
  });
}

export function updateActiveLink(hash) {
  const navLinks = $$('.nav-link');
  const activeHash = hash.replace('#', '') || 'home';
  navLinks.forEach(link => {
    if (link.getAttribute('data-route') === activeHash) {
      addClass(link, 'active');
    } else {
      removeClass(link, 'active');
    }
  });
}
