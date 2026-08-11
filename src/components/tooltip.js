import { $, $$, createElement, on, off, addClass, removeClass } from '../utils/dom.js';

let currentTooltip = null;

export function initTooltips() {
  const elements = $$('[data-tooltip]');
  elements.forEach(el => {
    on(el, 'mouseenter', handleMouseEnter);
    on(el, 'mouseleave', handleMouseLeave);
    on(el, 'focus', handleMouseEnter);
    on(el, 'blur', handleMouseLeave);
  });
}

function handleMouseEnter(e) {
  const target = e.currentTarget;
  const text = target.getAttribute('data-tooltip');
  if (text) {
    showTooltip(target, text);
  }
}

function handleMouseLeave(e) {
  hideTooltip(e.currentTarget);
}

export function showTooltip(element, text) {
  if (currentTooltip) {
    if (currentTooltip.parentNode) document.body.removeChild(currentTooltip);
  }
  
  const tooltip = createElement('div', { className: 'tooltip animate-fade-in' });
  tooltip.textContent = text;
  document.body.appendChild(tooltip);
  
  const rect = element.getBoundingClientRect();
  const tooltipRect = tooltip.getBoundingClientRect();
  
  let top = rect.top - tooltipRect.height - 8;
  let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
  
  if (top < 0) {
    top = rect.bottom + 8;
  }
  if (left < 0) {
    left = 8;
  } else if (left + tooltipRect.width > window.innerWidth) {
    left = window.innerWidth - tooltipRect.width - 8;
  }
  
  tooltip.style.top = `${top}px`;
  tooltip.style.left = `${left}px`;
  tooltip.style.position = 'fixed';
  tooltip.style.zIndex = '1000';
  
  currentTooltip = tooltip;
  element._tooltipEl = tooltip;
}

export function hideTooltip(element) {
  const tooltip = element._tooltipEl;
  if (tooltip && tooltip.parentNode) {
    addClass(tooltip, 'fade-out');
    setTimeout(() => {
      if (tooltip.parentNode) {
        document.body.removeChild(tooltip);
      }
      if (currentTooltip === tooltip) {
        currentTooltip = null;
      }
    }, 200);
  }
  element._tooltipEl = null;
}
