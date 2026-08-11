import { $, createElement, on, clearChildren, addClass, removeClass } from '../utils/dom.js';
import { GESTURES, GESTURE_CATEGORIES } from '../config/gestures.config.js';
import { renderGestureCard } from './gesture-card.js';
import { openModal } from './modal.js';

export function renderGestureLibrary({ asModal = false } = {}) {
  const tabsHtml = GESTURE_CATEGORIES.map((cat, idx) => 
    `<button class="btn btn-sm tab-btn ${idx === 0 ? 'btn-primary' : 'btn-secondary'}" data-category="${cat.id}">${cat.name}</button>`
  ).join('');

  return `
    <div class="gesture-library ${asModal ? 'in-modal' : ''}">
      <div class="section-header">
        <h2>GESTURE LIBRARY <span class="badge badge-cyan">${GESTURES.length}</span></h2>
      </div>
      <div class="filter-tabs mb-3 button-group">
        ${tabsHtml}
      </div>
      <div id="gesture-grid" class="grid-3">
        <!-- Cards injected here -->
      </div>
    </div>
  `;
}

export function initGestureLibrary(containerId) {
  const grid = $('#gesture-grid');
  const tabBtns = document.querySelectorAll('.tab-btn');

  const renderGrid = (categoryId) => {
    clearChildren(grid);
    const filtered = categoryId === 'all' 
      ? GESTURES 
      : GESTURES.filter(g => g.category === categoryId);
      
    filtered.forEach(gesture => {
      const wrapper = createElement('div');
      wrapper.innerHTML = renderGestureCard(gesture);
      const card = wrapper.firstElementChild;
      
      on(card, 'click', () => {
        openGestureModal(gesture);
      });
      
      grid.appendChild(card);
    });
  };

  tabBtns.forEach(btn => {
    on(btn, 'click', (e) => {
      tabBtns.forEach(b => {
        removeClass(b, 'btn-primary');
        addClass(b, 'btn-secondary');
      });
      removeClass(btn, 'btn-secondary');
      addClass(btn, 'btn-primary');
      
      renderGrid(btn.dataset.category);
    });
  });

  renderGrid('all');
}

function openGestureModal(gesture) {
  const cat = GESTURE_CATEGORIES.find(c => c.id === gesture.category);
  const content = `
    <div class="gesture-details text-center">
      <div style="font-size:4rem;">${gesture.icon}</div>
      <h2>${gesture.name}</h2>
      <div class="badge badge-violet mb-3">${cat ? cat.name : gesture.category}</div>
      <p>${gesture.description || 'No description available.'}</p>
      <div class="sensor-profile mt-4">
        <h4>Expected Sensor Profile</h4>
        <div class="flex-bars" style="display:flex; justify-content:center; gap:10px;">
          ${(gesture.profile || [0.5,0.5,0.5,0.5,0.5]).map(val => 
            `<div style="width:20px; height:50px; background:#333; position:relative; border-radius:4px;">
               <div style="position:absolute; bottom:0; width:100%; height:${val*100}%; background:var(--primary); border-radius:4px;"></div>
             </div>`
          ).join('')}
        </div>
      </div>
      <button class="btn btn-primary mt-4" onclick="window.location.hash='live-demo'; document.querySelector('.modal-overlay')?.remove();">Try in Demo</button>
    </div>
  `;
  openModal(content);
}
