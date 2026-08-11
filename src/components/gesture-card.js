import { GESTURE_CATEGORIES } from '../config/gestures.config.js';

export function renderGestureCard(gesture, { showDetails = false, active = false } = {}) {
  const categoryStr = gesture.category ? gesture.category.toLowerCase() : 'other';
  const badgeColor = GESTURE_CATEGORIES ? (GESTURE_CATEGORIES[categoryStr] || 'badge-cyan') : 'badge-cyan';
  
  return `
    <div class="gesture-card card ${active ? 'gesture-card-active' : ''}" data-gesture-id="${gesture.id}">
      <div class="card-body">
        <div class="gesture-icon">${gesture.icon || '✋'}</div>
        <h4 class="gesture-name">${gesture.name}</h4>
        <div class="badge ${badgeColor}">${gesture.category || 'Basic'}</div>
        ${showDetails && gesture.description ? `<p class="gesture-desc">${gesture.description}</p>` : ''}
      </div>
    </div>
  `;
}

export function renderGestureGrid(gestures, options = {}) {
  const cardsHtml = gestures.map(g => renderGestureCard(g, options)).join('');
  return `
    <div class="gesture-grid grid-3">
      ${cardsHtml}
    </div>
  `;
}

export function init() {
  // Event delegation handles clicks at the page level. No init logic needed here.
}
