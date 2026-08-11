export function $(selector, parent = document) {
  return parent.querySelector(selector);
}

export function $$(selector, parent = document) {
  return Array.from(parent.querySelectorAll(selector));
}

export function createElement(tag, { className, id, attrs, text, html, children, events } = {}) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (id) el.id = id;
  if (attrs) {
    for (const [key, value] of Object.entries(attrs)) {
      el.setAttribute(key, value);
    }
  }
  if (text) el.textContent = text;
  if (html) el.innerHTML = html;
  if (children) {
    children.forEach(child => {
      if (child) el.appendChild(child);
    });
  }
  if (events) {
    for (const [event, handler] of Object.entries(events)) {
      el.addEventListener(event, handler);
    }
  }
  return el;
}

export function on(el, event, handler, options = false) {
  el.addEventListener(event, handler, options);
}

export function off(el, event, handler, options = false) {
  el.removeEventListener(event, handler, options);
}

export function addClass(el, ...classes) {
  el.classList.add(...classes);
}

export function removeClass(el, ...classes) {
  el.classList.remove(...classes);
}

export function toggleClass(el, className, force) {
  if (force !== undefined) {
    el.classList.toggle(className, force);
  } else {
    el.classList.toggle(className);
  }
}

export function setAttributes(el, attrs) {
  for (const [key, value] of Object.entries(attrs)) {
    el.setAttribute(key, value);
  }
}

export function show(el) {
  el.style.display = 'block';
}

export function hide(el) {
  el.style.display = 'none';
}

export function clearChildren(el) {
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }
}

export function insertHTML(el, position, html) {
  el.insertAdjacentHTML(position, html);
}

export function animateElement(el, animationClass, duration = 300) {
  return new Promise(resolve => {
    el.classList.add(animationClass);
    setTimeout(() => {
      el.classList.remove(animationClass);
      resolve();
    }, duration);
  });
}
