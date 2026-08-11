import { $, on, clearChildren, createElement } from '../utils/dom.js';
import { eventBus } from '../utils/events.js';
import { voiceService } from '../services/voice.service.js';

export function renderSentenceSandbox() {
  return `
    <div class="panel sentence-sandbox">
      <div class="card-header">
        <span class="icon">📝</span> SENTENCE BUILDER
      </div>
      <div class="card-body">
        <div id="sandbox-chips" class="phrase-display">
          <span class="placeholder-text">Perform gestures to build a sentence...</span>
        </div>
        <div id="sandbox-composed" class="composed-text"></div>
        <div class="sandbox-controls">
          <button id="btn-sandbox-add" class="btn btn-primary">ADD TO PHRASE</button>
          <button id="btn-sandbox-undo" class="btn btn-secondary">UNDO</button>
          <button id="btn-sandbox-clear" class="btn btn-ghost">CLEAR</button>
          <button id="btn-sandbox-speak" class="btn btn-primary">SPEAK PHRASE</button>
          <button id="btn-sandbox-copy" class="btn btn-secondary">COPY</button>
        </div>
        <div class="status-line">Word count: <span id="sandbox-count">0</span></div>
      </div>
    </div>
  `;
}

export function initSentenceSandbox() {
  let words = [];
  let currentGesture = '';

  const chipsContainer = $('#sandbox-chips');
  const composedContainer = $('#sandbox-composed');
  const addBtn = $('#btn-sandbox-add');
  const undoBtn = $('#btn-sandbox-undo');
  const clearBtn = $('#btn-sandbox-clear');
  const speakBtn = $('#btn-sandbox-speak');
  const copyBtn = $('#btn-sandbox-copy');
  const countEl = $('#sandbox-count');

  const updateDisplay = () => {
    clearChildren(chipsContainer);
    if (words.length === 0) {
      chipsContainer.innerHTML = '<span class="placeholder-text">Perform gestures to build a sentence...</span>';
      composedContainer.textContent = '';
    } else {
      words.forEach(word => {
        const chip = createElement('span', { className: 'phrase-chip', text: word });
        chipsContainer.appendChild(chip);
      });
      composedContainer.textContent = words.join(' ');
    }
    countEl.textContent = words.length;
  };

  eventBus.on('gesture-detected', (data) => {
    currentGesture = data.gesture;
  });

  on(addBtn, 'click', () => {
    if (currentGesture && currentGesture !== words[words.length - 1]) {
      words.push(currentGesture);
      updateDisplay();
      eventBus.emit('phrase-update', { words });
    }
  });

  on(undoBtn, 'click', () => {
    if (words.length > 0) {
      words.pop();
      updateDisplay();
      eventBus.emit('phrase-update', { words });
    }
  });

  on(clearBtn, 'click', () => {
    words = [];
    updateDisplay();
    eventBus.emit('phrase-update', { words });
  });

  on(speakBtn, 'click', () => {
    const text = words.join(' ');
    if (text) voiceService.speak(text);
  });

  on(copyBtn, 'click', () => {
    const text = words.join(' ');
    if (text) {
      navigator.clipboard.writeText(text).then(() => {
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
          copyBtn.textContent = originalText;
        }, 1500);
      });
    }
  });
}
