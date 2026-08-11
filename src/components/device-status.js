import { $ } from '../utils/dom.js';
import { eventBus } from '../utils/events.js';
import { renderStatusBadge } from './status-badge.js';

export function renderDeviceStatus() {
  return `
    <div class="panel device-status">
      <div class="card-header">
        <span class="icon">📱</span> DEVICE STATUS
      </div>
      <div class="card-body">
        <div class="status-row"><span>Connection:</span> <span id="ds-conn"></span></div>
        <div class="status-row"><span>BLE:</span> <span id="ds-ble"></span></div>
        <div class="status-row"><span>Flex Sensors:</span> <span id="ds-flex"></span></div>
        <div class="status-row"><span>IMU:</span> <span id="ds-imu"></span></div>
        <div class="status-row"><span>Battery:</span> <span id="ds-batt"></span></div>
        <div class="status-row"><span>Firmware:</span> <span id="ds-firm"></span></div>
      </div>
    </div>
  `;
}

export function initDeviceStatus() {
  const dsConn = $('#ds-conn');
  const dsBle = $('#ds-ble');
  const dsFlex = $('#ds-flex');
  const dsImu = $('#ds-imu');
  const dsBatt = $('#ds-batt');
  const dsFirm = $('#ds-firm');

  let isSimulated = false;
  let isConnected = false;

  const updateUI = () => {
    dsConn.innerHTML = renderStatusBadge(isConnected ? 'Connected' : 'Disconnected', isConnected ? 'green' : 'red');
    dsBle.innerHTML = renderStatusBadge(isConnected ? 'Active' : 'Inactive', isConnected ? 'green' : 'red');
    
    if (isSimulated) {
      dsFlex.innerHTML = renderStatusBadge('Simulated', 'cyan');
      dsImu.innerHTML = renderStatusBadge('Simulated', 'cyan');
      dsBatt.innerHTML = renderStatusBadge('Simulated', 'cyan');
      dsFirm.innerHTML = renderStatusBadge('Simulated', 'cyan');
    } else {
      dsFlex.innerHTML = renderStatusBadge(isConnected ? '5/5 Active' : 'Inactive', isConnected ? 'green' : 'red');
      dsImu.innerHTML = renderStatusBadge(isConnected ? 'Active' : 'Inactive', isConnected ? 'green' : 'red');
      dsBatt.innerHTML = renderStatusBadge(isConnected ? 'TBD' : 'Unknown', 'amber');
      dsFirm.innerHTML = renderStatusBadge(isConnected ? 'TBD' : 'Unknown', 'amber');
    }
  };

  eventBus.on('ble-status', (status) => {
    isConnected = status.connected;
    updateUI();
  });

  eventBus.on('mode-change', (mode) => {
    isSimulated = (mode === 'simulation');
    updateUI();
  });

  updateUI();
}
