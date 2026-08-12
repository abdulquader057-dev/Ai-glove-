import { $, $$, on } from '../utils/dom.js';
import { openModal } from './modal.js';

const STEP_DETAILS = {
  hand: { title: 'Hand Movement', content: 'User performs physical sign language gesture.' },
  sensors: { title: 'Flex Sensors + IMU', content: '5 flex sensors measure finger bend. 6-axis IMU tracks hand orientation and movement.' },
  xiao: { title: 'XIAO nRF52840', content: 'Microcontroller reads analog sensor data and prepares it for transmission.' },
  ble: { title: 'Bluetooth LE', content: 'Low energy wireless transmission of sensor data to the application.' },
  ml: { title: 'ML Model', content: 'TensorFlow.js model processes sequential data to recognize patterns.' },
  gesture: { title: 'Gesture Recognition', content: 'Classification of the current gesture with a confidence score.' },
  text: { title: 'Text Output', content: 'Visual display of the recognized gesture meaning.' },
  voice: { title: 'Voice Output', content: 'Web Speech API synthesizes spoken words from text.' }
};

export function renderPipeline({ steps, direction = 'vertical', animated = true, clickable = true } = {}) {
  const defaultSteps = [
    { id: 'hand', icon: '<i data-lucide="hand"></i>', label: 'Hand Movement', subtitle: 'Physical gesture' },
    { id: 'sensors', icon: '<i data-lucide="satellite-dish"></i>', label: 'Flex Sensors + IMU', subtitle: '5 flex + 6-axis' },
    { id: 'xiao', icon: '<i data-lucide="cpu"></i>', label: 'XIAO nRF52840', subtitle: 'Main controller' },
    { id: 'ble', icon: '<i data-lucide="bluetooth"></i>', label: 'Bluetooth LE', subtitle: 'Wireless transmission' },
    { id: 'ml', icon: '<i data-lucide="network"></i>', label: 'ML Model', subtitle: 'Pattern recognition' },
    { id: 'gesture', icon: '<i data-lucide="target"></i>', label: 'Gesture Recognition', subtitle: 'Classification' },
    { id: 'text', icon: '<i data-lucide="file-text"></i>', label: 'Text Output', subtitle: 'Display result' },
    { id: 'voice', icon: '<i data-lucide="volume-2"></i>', label: 'Voice Output', subtitle: 'Speech synthesis' }
  ];

  const pipelineSteps = Array.isArray(steps) ? steps : (steps && typeof steps === 'number' ? defaultSteps.slice(0, steps) : defaultSteps);
  
  const nodesHtml = pipelineSteps.map((step, index) => {
    const isLast = index === pipelineSteps.length - 1;
    return `
      <div class="pipeline-step">
        <div class="pipeline-node ${clickable ? 'clickable' : ''}" data-step-id="${step.id}">
          <div class="node-icon">${step.icon}</div>
          <div class="node-text">
            <div class="node-label">${step.label}</div>
            ${step.subtitle ? `<div class="node-subtitle">${step.subtitle}</div>` : ''}
          </div>
        </div>
        ${!isLast ? `
          <div class="pipeline-line">
            <div class="pipeline-connector ${animated ? 'animated' : ''}"></div>
          </div>
        ` : ''}
      </div>
    `;
  }).join('');

  return `
    <div class="pipeline pipeline-${direction}">
      ${nodesHtml}
    </div>
  `;
}

export function initPipeline(containerId) {
  const container = $(`#${containerId}`);
  if (!container) return;

  const nodes = $$('.pipeline-node.clickable', container);
  nodes.forEach(node => {
    on(node, 'click', () => {
      const stepId = node.getAttribute('data-step-id');
      const details = STEP_DETAILS[stepId];
      if (details) {
        openModal({
          title: details.title,
          content: `<p>${details.content}</p>`,
          size: 'sm'
        });
      }
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  $$('.pipeline-step', container).forEach(step => {
    observer.observe(step);
  });
}
