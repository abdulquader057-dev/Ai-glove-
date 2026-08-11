import { $, $$ } from '../utils/dom.js';
import { eventBus } from '../utils/events.js';

export function renderSensorDisplay({ compact = false } = {}) {
  const flexSensors = ['Thumb', 'Index', 'Middle', 'Ring', 'Pinky'];
  const imuAxes = ['X', 'Y', 'Z'];

  const flexHtml = flexSensors.map(name => `
    <div class="sensor-row flex-row" data-sensor="${name.toLowerCase()}">
      ${!compact ? `<div class="sensor-label">${name}</div>` : ''}
      <div class="sensor-bar-container">
        <div class="sensor-bar-fill"></div>
      </div>
      <div class="sensor-value">0%</div>
    </div>
  `).join('');

  const imuHtml = imuAxes.map(axis => `
    <div class="sensor-row imu-row" data-axis="${axis.toLowerCase()}">
      ${!compact ? `<div class="sensor-label">${axis}</div>` : ''}
      <div class="imu-bar-container">
        <div class="imu-bar-center"></div>
        <div class="imu-bar-fill"></div>
      </div>
      <div class="sensor-value">0.00</div>
    </div>
  `).join('');

  return `
    <div class="sensor-display ${compact ? 'compact' : ''}">
      <div class="sensor-section">
        ${!compact ? `<h4>FLEX SENSORS</h4>` : ''}
        ${flexHtml}
      </div>
      <div class="sensor-section">
        ${!compact ? `<h4>IMU (ACCEL)</h4>` : ''}
        ${imuHtml}
      </div>
    </div>
  `;
}

export function initSensorDisplay(containerId) {
  eventBus.on('sensor-update', (data) => {
    updateSensorDisplay(containerId, data);
  });
}

export function updateSensorDisplay(containerId, sensorData) {
  const container = $(`#${containerId}`);
  if (!container) return;

  if (sensorData.flex) {
    Object.entries(sensorData.flex).forEach(([finger, value]) => {
      const row = $(`.flex-row[data-sensor="${finger}"]`, container);
      if (row) {
        const fill = $('.sensor-bar-fill', row);
        const valText = $('.sensor-value', row);
        const percent = Math.min(100, Math.max(0, value * 100));
        fill.style.width = `${percent}%`;
        valText.textContent = `${percent.toFixed(0)}%`;
        
        if (percent < 33) fill.style.backgroundColor = '#6bcb77';
        else if (percent < 66) fill.style.backgroundColor = '#00f0ff';
        else fill.style.backgroundColor = '#ff00ff';
      }
    });
  }

  if (sensorData.imu) {
    Object.entries(sensorData.imu).forEach(([axis, value]) => {
      const row = $(`.imu-row[data-axis="${axis}"]`, container);
      if (row) {
        const fill = $('.imu-bar-fill', row);
        const valText = $('.sensor-value', row);
        
        const percent = (value + 1) * 50;
        fill.style.width = `${Math.abs(value * 50)}%`;
        fill.style.left = value < 0 ? `${percent}%` : '50%';
        valText.textContent = value.toFixed(2);
      }
    });
  }
}
