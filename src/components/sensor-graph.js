import { $, on, off } from '../utils/dom.js';
import { eventBus } from '../utils/events.js';

let animationId = null;
let graphData = [];
const MAX_POINTS = 100;
const COLORS = {
  thumb: '#ff6b6b',
  index: '#ffa500',
  middle: '#ffd93d',
  ring: '#6bcb77',
  pinky: '#4d96ff',
  x: '#00f0ff',
  y: '#8b5cf6',
  z: '#ff00ff'
};

export function renderSensorGraph({ expanded = false } = {}) {
  return `
    <div class="sensor-graph-container ${expanded ? 'expanded' : ''}">
      <div class="graph-header">
        <h4>Live Sensor Data</h4>
        <button class="btn btn-ghost btn-sm graph-toggle-btn">${expanded ? 'Collapse' : 'Expand'}</button>
      </div>
      <canvas id="sensor-graph-canvas" width="600" height="200"></canvas>
      <div class="graph-legend">
        ${Object.entries(COLORS).map(([key, color]) => `
          <div class="legend-item">
            <span class="legend-color" style="background:${color}"></span>
            <span class="legend-label">${key.toUpperCase()}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

export function initSensorGraph(containerId) {
  const container = $(`#${containerId}`);
  if (!container) return;

  const canvas = $('#sensor-graph-canvas', container);
  const ctx = canvas.getContext('2d');
  
  const toggleBtn = $('.graph-toggle-btn', container);
  if (toggleBtn) {
    on(toggleBtn, 'click', () => {
      container.classList.toggle('expanded');
      toggleBtn.textContent = container.classList.contains('expanded') ? 'Collapse' : 'Expand';
      resizeCanvas(canvas);
    });
  }

  graphData = Array(MAX_POINTS).fill(null).map(() => ({
    thumb: 0, index: 0, middle: 0, ring: 0, pinky: 0,
    x: 0, y: 0, z: 0
  }));

  eventBus.on('sensor-update', (data) => {
    const pt = {
      thumb: data.flex?.thumb || 0,
      index: data.flex?.index || 0,
      middle: data.flex?.middle || 0,
      ring: data.flex?.ring || 0,
      pinky: data.flex?.pinky || 0,
      x: (data.imu?.x || 0 + 1) / 2, // normalized 0-1
      y: (data.imu?.y || 0 + 1) / 2,
      z: (data.imu?.z || 0 + 1) / 2
    };
    graphData.push(pt);
    if (graphData.length > MAX_POINTS) {
      graphData.shift();
    }
  });

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i <= 4; i++) {
      const y = (i / 4) * canvas.height;
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
    }
    ctx.stroke();

    const step = canvas.width / (MAX_POINTS - 1);
    
    Object.keys(COLORS).forEach(key => {
      ctx.strokeStyle = COLORS[key];
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      for (let i = 0; i < graphData.length; i++) {
        const val = graphData[i][key];
        const x = i * step;
        const y = canvas.height - (val * canvas.height);
        
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    });

    animationId = requestAnimationFrame(render);
  }

  resizeCanvas(canvas);
  render();
}

function resizeCanvas(canvas) {
  const parent = canvas.parentElement;
  canvas.width = parent.clientWidth - 40;
  canvas.height = parent.classList.contains('expanded') ? 400 : 200;
}

export function destroySensorGraph() {
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
  graphData = [];
}
