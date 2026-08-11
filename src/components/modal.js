import { $, createElement } from '../utils/dom.js';

export function openModal(contentHtml) {
  const overlay = createElement('div', { className: 'modal-overlay' });
  const modalContent = createElement('div', { className: 'modal-content' });
  const closeBtn = createElement('button', { className: 'btn btn-ghost', style: 'position:absolute; right:10px; top:10px;' }, '✕');
  
  closeBtn.onclick = () => overlay.remove();
  overlay.onclick = (e) => {
    if (e.target === overlay) overlay.remove();
  };
  
  modalContent.innerHTML = contentHtml;
  modalContent.appendChild(closeBtn);
  overlay.appendChild(modalContent);
  document.body.appendChild(overlay);
}
