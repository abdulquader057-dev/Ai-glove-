// ──────────────────────────────────────────────
// AI GLOVE — Main Application Bootstrap
// ──────────────────────────────────────────────

import { router } from './router.js';
import { eventBus } from './utils/events.js';
import { $ } from './utils/dom.js';
import { createIcons } from 'lucide';

// ── Services ──
import { storageService } from './services/storage.service.js';
import { voiceService } from './services/voice.service.js';
import { streamController } from './services/stream-controller.js';

// ── Components ──
import { render as renderNavbar, init as initNavbar } from './components/navbar.js';
import { render as renderFooter, init as initFooter } from './components/footer.js';
import { applyAccessibilitySettings } from './components/accessibility-controls.js';

// ── Pages ──
import { render as renderHome, init as initHome, cleanup as cleanupHome } from './pages/home.js';
import { render as renderAiGlove, init as initAiGlove, cleanup as cleanupAiGlove } from './pages/ai-glove.js';
import { render as renderAiMl, init as initAiMl, cleanup as cleanupAiMl } from './pages/ai-ml.js';
import { render as renderAccessibility, init as initAccessibility, cleanup as cleanupAccessibility } from './pages/accessibility.js';
import { render as renderLiveDemo, init as initLiveDemo, cleanup as cleanupLiveDemo } from './pages/live-demo.js';
import { render as renderImpactFuture, init as initImpactFuture, cleanup as cleanupImpactFuture } from './pages/impact-future.js';


// ──────────────────────────────────────────────
// Application Initialization
// ──────────────────────────────────────────────

function initApp() {
  console.log('%c🧤 AI GLOVE v1.0.0', 'color: #00f0ff; font-size: 16px; font-weight: bold;');
  console.log('%cInitializing application...', 'color: #8888a0;');

  // 1. Apply saved accessibility settings
  try {
    applyAccessibilitySettings();
  } catch (e) {
    console.warn('Could not apply accessibility settings:', e);
  }

  // 2. Mount navigation
  const navRoot = $('#navbar-root');
  if (navRoot) {
    navRoot.innerHTML = renderNavbar();
    initNavbar();
  }

  // 3. Mount footer
  const footerRoot = $('#footer-root');
  if (footerRoot) {
    footerRoot.innerHTML = renderFooter();
    initFooter();
  }

  // 4. Register routes
  router.addRoute('#home', {
    render: renderHome,
    init: initHome,
    cleanup: cleanupHome,
    title: 'AI GLOVE — The Future of Hand Communication'
  });

  router.addRoute('#ai-glove', {
    render: renderAiGlove,
    init: initAiGlove,
    cleanup: cleanupAiGlove,
    title: 'AI GLOVE — Meet the AI Glove'
  });

  router.addRoute('#ai-ml', {
    render: renderAiMl,
    init: initAiMl,
    cleanup: cleanupAiMl,
    title: 'AI GLOVE — AI & Machine Learning'
  });

  router.addRoute('#accessibility', {
    render: renderAccessibility,
    init: initAccessibility,
    cleanup: cleanupAccessibility,
    title: 'AI GLOVE — Accessibility'
  });

  router.addRoute('#live-demo', {
    render: renderLiveDemo,
    init: initLiveDemo,
    cleanup: cleanupLiveDemo,
    title: 'AI GLOVE — Live Feasibility Demo'
  });

  router.addRoute('#impact-future', {
    render: renderImpactFuture,
    init: initImpactFuture,
    cleanup: cleanupImpactFuture,
    title: 'AI GLOVE — Impact & Future'
  });

  // 5. Initialize voice service (loads voices async)
  try {
    voiceService.initVoices();
  } catch (e) {
    console.warn('Voice service initialization failed:', e);
  }

  // 6. Start router (handles initial route)
  router.start();

  // 7. Set up global event listeners
  setupGlobalListeners();

  // 8. Initialize Lucide icons on boot (for nav/footer)
  createIcons();

  console.log('%c✓ Application initialized', 'color: #00ff88;');
}

// ──────────────────────────────────────────────
// Global Event Listeners
// ──────────────────────────────────────────────

function setupGlobalListeners() {
  // Handle smooth scroll for anchor links
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (link) {
      e.preventDefault();
      const hash = link.getAttribute('href');
      router.navigate(hash);
    }
  });

  // Handle CTA buttons with data-navigate attribute
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-navigate]');
    if (btn) {
      e.preventDefault();
      const hash = btn.getAttribute('data-navigate');
      router.navigate(hash);
    }
  });

  // Global keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // Escape closes modals (handled in modal.js)
    // Ctrl+Shift+D toggles demo mode indicator visibility
    if (e.ctrlKey && e.shiftKey && e.key === 'D') {
      const indicator = $('#demo-mode-indicator');
      if (indicator) {
        indicator.style.display = indicator.style.display === 'none' ? 'flex' : 'none';
      }
    }
  });

  // Listen for settings changes
  eventBus.on('settings-change', ({ setting, value }) => {
    console.log(`Setting changed: ${setting} = ${value}`);
  });

  // Handle visibility change (pause simulation when tab is hidden)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      // Optionally pause intensive operations
    }
  });

  // Handle before unload (clean up)
  window.addEventListener('beforeunload', () => {
    try {
      streamController.stop();
    } catch (e) {
      // Ignore cleanup errors
    }
  });
}


// ──────────────────────────────────────────────
// Boot
// ──────────────────────────────────────────────

// Wait for DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

window.addEventListener('error', (e) => {
  document.body.innerHTML += `<div style="position:fixed;top:100px;left:0;right:0;background:red;color:white;padding:20px;z-index:99999;">ERROR: ${e.message}<br/>${e.filename}:${e.lineno}</div>`;
});
window.addEventListener('unhandledrejection', (e) => {
  document.body.innerHTML += `<div style="position:fixed;top:100px;left:0;right:0;background:red;color:white;padding:20px;z-index:99999;">PROMISE ERROR: ${e.reason}</div>`;
});
