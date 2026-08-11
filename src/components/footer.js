import { $, $$, on } from '../utils/dom.js';
import { APP_CONFIG } from '../config/app.config.js';
import { router } from '../router.js';

export function render() {
  const navLinksHtml = APP_CONFIG.navigation.map(link => 
    `<li><a href="${link.hash}" class="footer-link" data-route="${link.hash}">${link.label}</a></li>`
  ).join('');

  const linksArr = APP_CONFIG.links 
    ? Object.entries(APP_CONFIG.links).map(([key, url]) => ({ label: key.charAt(0).toUpperCase() + key.slice(1), url })) 
    : [
      { label: 'GitHub', url: '#' },
      { label: 'Project Demo', url: '#' },
      { label: 'Team', url: '#' }
    ];

  const externalLinksHtml = linksArr.map(link => 
    `<li><a href="${link.url}" target="_blank" rel="noopener noreferrer">${link.label}</a></li>`
  ).join('');

  return `
    <footer class="footer panel">
      <div class="footer-container grid-4">
        <div class="footer-brand">
          <div class="nav-logo text-glow">AI GLOVE</div>
          <p class="tagline">Turning hand movement into meaningful communication.</p>
        </div>
        <div class="footer-links-col">
          <h4 class="footer-heading">Navigation</h4>
          <ul>${navLinksHtml}</ul>
        </div>
        <div class="footer-links-col">
          <h4 class="footer-heading">Resources</h4>
          <ul>${externalLinksHtml}</ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; ${new Date().getFullYear()} AI Glove Project. Built with ♥.</p>
      </div>
    </footer>
  `;
}

export function init() {
  const footerLinks = $$('.footer-link');
  footerLinks.forEach(link => {
    on(link, 'click', (e) => {
      e.preventDefault();
      const route = link.getAttribute('data-route');
      if (route) {
        router.navigate(route);
      }
    });
  });
}
