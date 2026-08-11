import { eventBus } from './utils/events.js';

class Router {
  constructor() {
    this.routes = new Map();
    this.currentRoute = null;
    this.cleanupFn = null;
    this._started = false;
  }

  addRoute(hash, pageConfig) {
    // pageConfig: { render, init, cleanup, title }
    this.routes.set(hash, pageConfig);
  }

  navigate(hash) {
    window.location.hash = hash;
  }

  getCurrentRoute() {
    return window.location.hash || '#home';
  }

  start() {
    if (this._started) return;
    this._started = true;
    window.addEventListener('hashchange', () => this.handleRouteChange());
    this.handleRouteChange();
  }

  async handleRouteChange() {
    const hash = this.getCurrentRoute();

    if (this.currentRoute === hash) return;

    const pageConfig = this.routes.get(hash) || this.routes.get('#home');
    if (!pageConfig) return;

    const container = document.getElementById('page-container');
    if (!container) return;

    // Call previous page's cleanup
    if (this.cleanupFn) {
      try {
        this.cleanupFn();
      } catch (e) {
        console.warn('Page cleanup error:', e);
      }
      this.cleanupFn = null;
    }

    // Exit animation
    if (this.currentRoute) {
      container.style.transition = 'opacity 200ms ease';
      container.style.opacity = '0';
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    this.currentRoute = hash;

    // Render the page
    try {
      const html = pageConfig.render();
      if (typeof html === 'string') {
        container.innerHTML = html;
      } else if (html instanceof HTMLElement) {
        while (container.firstChild) container.removeChild(container.firstChild);
        container.appendChild(html);
      }
    } catch (e) {
      console.error('Page render error:', e);
      container.innerHTML = `<div class="page" style="padding: 4rem 2rem; text-align: center;">
        <h2 style="color: var(--color-accent-cyan);">Page Error</h2>
        <p style="color: var(--color-text-secondary);">${e.message}</p>
      </div>`;
    }

    // Enter animation
    container.style.transition = 'opacity 200ms ease';
    container.style.opacity = '1';

    window.scrollTo({ top: 0, behavior: 'instant' });

    // Initialize page event listeners
    if (pageConfig.init) {
      try {
        pageConfig.init();
      } catch (e) {
        console.error('Page init error:', e);
      }
    }

    // Store cleanup function
    if (pageConfig.cleanup) {
      this.cleanupFn = pageConfig.cleanup;
    }

    // Update nav and title
    this.updateActiveNav(hash);
    document.title = pageConfig.title || this.getPageTitle(hash);

    eventBus.emit('route-change', { route: hash });
  }

  updateActiveNav(hash) {
    const navLinks = document.querySelectorAll('[data-route]');
    navLinks.forEach(link => {
      const route = link.getAttribute('data-route') || link.getAttribute('href');
      if (route === hash) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  getPageTitle(hash) {
    const titles = {
      '#home': 'AI GLOVE — The Future of Hand Communication',
      '#ai-glove': 'AI GLOVE — Meet the AI Glove',
      '#ai-ml': 'AI GLOVE — AI & Machine Learning',
      '#accessibility': 'AI GLOVE — Accessibility',
      '#live-demo': 'AI GLOVE — Live Feasibility Demo',
      '#impact-future': 'AI GLOVE — Impact & Future'
    };
    return titles[hash] || 'AI GLOVE';
  }
}

export const router = new Router();
