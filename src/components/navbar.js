import { $, on } from '../utils/dom.js';
import { router } from '../router.js';

export function render() {
  return `
    <nav class="navbar glass sticky z-sticky">
      <div class="container flex justify-between items-center w-full">
        
        <!-- Logo -->
        <a href="#home" class="nav-logo flex items-center gap-2" aria-label="AI Glove Home">
          <i data-lucide="hand-metal" class="text-primary" style="width: 24px; height: 24px;"></i>
          <span class="text-large text-gradient">AI GLOVE</span>
        </a>
        
        <!-- Desktop Links -->
        <div class="nav-links flex items-center gap-6 hidden-mobile">
          <a href="#ai-glove" data-route="#ai-glove" class="nav-item">The Tech</a>
          <a href="#ai-ml" data-route="#ai-ml" class="nav-item">AI Engine</a>
          <a href="#accessibility" data-route="#accessibility" class="nav-item">Accessibility</a>
          <a href="#impact-future" data-route="#impact-future" class="nav-item">Impact</a>
        </div>
        
        <!-- CTA & Hamburger -->
        <div class="nav-actions flex items-center gap-4">
          <button class="btn btn-primary hidden-mobile" data-navigate="#live-demo">
            Try Demo <i data-lucide="arrow-right" style="width: 16px; height: 16px;"></i>
          </button>
          
          <button id="mobile-menu-btn" class="hamburger icon-btn display-mobile" aria-label="Toggle navigation menu">
            <i data-lucide="menu"></i>
          </button>
        </div>
      </div>
      
      <!-- Mobile Menu Overlay -->
      <div id="mobile-menu" class="mobile-menu glass hidden">
        <div class="mobile-menu-content flex flex-col gap-4 p-4">
          <a href="#ai-glove" class="mobile-nav-item">The Tech</a>
          <a href="#ai-ml" class="mobile-nav-item">AI Engine</a>
          <a href="#accessibility" class="mobile-nav-item">Accessibility</a>
          <a href="#impact-future" class="mobile-nav-item">Impact</a>
          <button class="btn btn-primary mt-4 w-full" data-navigate="#live-demo">Try Demo</button>
        </div>
      </div>
    </nav>
  `;
}

export function init() {
  const mobileMenuBtn = $('#mobile-menu-btn');
  const mobileMenu = $('#mobile-menu');
  
  if (mobileMenuBtn && mobileMenu) {
    on(mobileMenuBtn, 'click', () => {
      mobileMenu.classList.toggle('hidden');
      const icon = mobileMenu.classList.contains('hidden') ? 'menu' : 'x';
      
      // Update icon using lucide
      mobileMenuBtn.innerHTML = `<i data-lucide="${icon}"></i>`;
      if (window.lucide) {
        window.lucide.createIcons({ root: mobileMenuBtn });
      }
    });
    
    // Close menu when clicking a link
    const links = document.querySelectorAll('.mobile-nav-item');
    links.forEach(link => {
      on(link, 'click', () => {
        mobileMenu.classList.add('hidden');
        mobileMenuBtn.innerHTML = `<i data-lucide="menu"></i>`;
        if (window.lucide) window.lucide.createIcons({ root: mobileMenuBtn });
      });
    });
  }
}
