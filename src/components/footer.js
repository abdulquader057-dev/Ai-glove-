import { $, on } from '../utils/dom.js';

export function render() {
  return `
    <footer class="footer section-padding bg-surface">
      <div class="container">
        <div class="grid-3 mb-16">
          
          <!-- Column 1: Brand & About -->
          <div class="footer-col flex flex-col gap-4">
            <a href="#home" class="footer-logo flex items-center gap-2" aria-label="AI Glove Home">
              <i data-lucide="hand-metal" class="text-primary" style="width: 24px; height: 24px;"></i>
              <span class="text-large text-gradient">AI GLOVE</span>
            </a>
            <p class="text-muted">
              Turn gestures into words with AI. Open source wearable technology built for accessibility and human connection.
            </p>
            <div class="social-links flex gap-4 mt-4">
              <a href="https://github.com" target="_blank" aria-label="GitHub" class="social-btn">
                <i data-lucide="github"></i>
              </a>
              <a href="https://twitter.com" target="_blank" aria-label="Twitter" class="social-btn">
                <i data-lucide="twitter"></i>
              </a>
            </div>
          </div>
          
          <!-- Column 2: Product -->
          <div class="footer-col flex flex-col gap-4">
            <h4 class="footer-heading">Product</h4>
            <a href="#ai-glove" class="footer-link">The Technology</a>
            <a href="#live-demo" class="footer-link">Live Demo</a>
            <a href="#ai-ml" class="footer-link">AI Engine</a>
            <a href="#impact-future" class="footer-link">Roadmap</a>
          </div>
          
          <!-- Column 3: Resources -->
          <div class="footer-col flex flex-col gap-4">
            <h4 class="footer-heading">Resources</h4>
            <a href="#" class="footer-link">Documentation</a>
            <a href="#" class="footer-link">Build Guide (BOM)</a>
            <a href="#" class="footer-link">API Reference</a>
            <a href="#" class="footer-link">Open Source License</a>
          </div>
          
        </div>
        
        <div class="footer-bottom pt-8 border-t flex justify-between items-center text-sm text-muted">
          <p>&copy; 2026 AI Glove Project. Released under MIT License.</p>
          <div class="flex gap-4">
            <a href="#" class="footer-link">Privacy</a>
            <a href="#" class="footer-link">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  `;
}

export function init() {
  // Any footer-specific JS logic
}
