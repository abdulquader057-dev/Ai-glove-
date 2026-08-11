import { $, $$, on } from '../utils/dom.js';
import { openModal } from './modal.js';
import { showTooltip, hideTooltip } from './tooltip.js';
import { router } from '../router.js';

export function renderHero({ title, subtitle, description, visual, badges, primaryAction, secondaryAction, className = '' }) {
  let badgesHtml = '';
  if (badges && badges.length) {
    badgesHtml = `
      <div class="hero-badges">
        ${badges.map(b => `<div class="hero-badge badge badge-cyan" data-detail="${b.detail || ''}">${b.icon || ''} ${b.label}</div>`).join('')}
      </div>
    `;
  }
  
  let actionsHtml = '';
  if (primaryAction || secondaryAction) {
    actionsHtml = '<div class="hero-actions">';
    if (primaryAction) {
      actionsHtml += `<button class="btn btn-primary" id="hero-primary-btn" data-navigate="${primaryAction.hash || ''}">${primaryAction.label}</button>`;
    }
    if (secondaryAction) {
      actionsHtml += `<button class="btn btn-secondary" id="hero-secondary-btn" data-navigate="${secondaryAction.hash || ''}">${secondaryAction.label}</button>`;
    }
    actionsHtml += '</div>';
  }

  return `
    <section class="hero section ${className}">
      <div class="hero-background"></div>
      <div class="container grid-2">
        <div class="hero-content animate-fade-in-up">
          <h1 class="text-gradient">${title}</h1>
          <h2>${subtitle}</h2>
          <p>${description}</p>
          ${badgesHtml}
          ${actionsHtml}
        </div>
        <div class="hero-visual animate-float">
          ${visual || ''}
        </div>
      </div>
    </section>
  `;
}

export function initHero(containerSelector, actionsConfig = {}) {
  const container = $(containerSelector);
  if (!container) return;

  const primaryBtn = $('#hero-primary-btn', container);
  if (primaryBtn) {
    on(primaryBtn, 'click', () => {
      if (actionsConfig.primaryHandler) {
        actionsConfig.primaryHandler();
      } else {
        const hash = primaryBtn.getAttribute('data-navigate');
        if (hash) router.navigate(hash);
      }
    });
  }

  const secondaryBtn = $('#hero-secondary-btn', container);
  if (secondaryBtn) {
    on(secondaryBtn, 'click', () => {
      if (actionsConfig.secondaryHandler) {
        actionsConfig.secondaryHandler();
      } else {
        const hash = secondaryBtn.getAttribute('data-navigate');
        if (hash) router.navigate(hash);
      }
    });
  }

  const badges = $$('.hero-badge', container);
  badges.forEach(badge => {
    const detail = badge.getAttribute('data-detail');
    if (detail) {
      on(badge, 'click', () => {
        openModal({ title: 'Details', content: `<p>${detail}</p>` });
      });
      on(badge, 'mouseenter', () => showTooltip(badge, 'Click for details'));
      on(badge, 'mouseleave', () => hideTooltip(badge));
    }
  });
}
