import { $, on, show, hide } from '../utils/dom.js';
import { eventBus } from '../utils/events.js';
import { bleService } from '../services/ble.service.js';
import { BLE_CONFIG, isWebBluetoothSupported, BLE_ERRORS } from '../config/ble.config.js';

export function renderConnectionPanel() {
  return `
    <div class="panel connection-panel">
      <div class="card-header">
        <span class="icon">📡</span> CONNECTION
      </div>
      <div class="card-body">
        <div id="ble-not-supported" class="badge badge-red" style="display:none;">Web Bluetooth Not Supported</div>
        <div id="ble-not-configured" class="badge badge-amber" style="display:none;">BLE Not Configured</div>
        <div id="ble-error-msg" class="badge badge-red" style="display:none;"></div>
        
        <div class="status-rows">
          <div class="status-row"><span>Device:</span> <span id="conn-device">Not Connected</span></div>
          <div class="status-row"><span>Connection:</span> <span id="conn-status" class="badge badge-red">Disconnected</span></div>
          <div class="status-row"><span>BLE:</span> <span id="conn-ble" class="status-dot inactive">Inactive</span></div>
          <div class="status-row"><span>Sensor Stream:</span> <span id="conn-stream" class="status-dot inactive">Inactive</span></div>
          <div class="status-row"><span>Battery:</span> <span id="conn-battery">TBD</span></div>
          <div class="status-row"><span>Firmware:</span> <span id="conn-firmware">TBD</span></div>
        </div>
        
        <button id="btn-connect-ble" class="btn btn-primary mt-3">CONNECT GLOVE</button>
      </div>
    </div>
  `;
}

export function initConnectionPanel() {
  const btnConnect = $('#btn-connect-ble');
  const notSupportedEl = $('#ble-not-supported');
  const notConfiguredEl = $('#ble-not-configured');
  const errorMsgEl = $('#ble-error-msg');
  
  const elDevice = $('#conn-device');
  const elStatus = $('#conn-status');
  const elBle = $('#conn-ble');
  const elStream = $('#conn-stream');
  const elBattery = $('#conn-battery');
  const elFirmware = $('#conn-firmware');

  let isConnected = false;
  let isSimulated = false;

  const updateUI = () => {
    if (isConnected) {
      btnConnect.textContent = 'DISCONNECT';
      btnConnect.className = 'btn btn-danger mt-3';
      elStatus.textContent = 'Connected';
      elStatus.className = 'badge badge-green';
      elBle.className = 'status-dot active';
      elBle.textContent = 'Active';
      elStream.className = 'status-dot active';
      elStream.textContent = 'Active';
      elDevice.textContent = BLE_CONFIG.DEVICE_NAME || 'AI_GLOVE';
    } else {
      btnConnect.textContent = 'CONNECT GLOVE';
      btnConnect.className = 'btn btn-primary mt-3';
      elStatus.textContent = 'Disconnected';
      elStatus.className = 'badge badge-red';
      elBle.className = 'status-dot inactive';
      elBle.textContent = 'Inactive';
      elStream.className = 'status-dot inactive';
      elStream.textContent = 'Inactive';
      elDevice.textContent = 'Not Connected';
    }

    if (isSimulated) {
      elBattery.textContent = 'Simulated';
      elFirmware.textContent = 'Simulated';
    } else {
      elBattery.textContent = 'TBD';
      elFirmware.textContent = 'TBD';
    }
  };

  on(btnConnect, 'click', async () => {
    hide(errorMsgEl);
    if (isConnected) {
      await bleService.disconnect();
    } else {
      if (!isWebBluetoothSupported()) {
        show(notSupportedEl);
        errorMsgEl.textContent = BLE_ERRORS.NOT_SUPPORTED;
        show(errorMsgEl);
        return;
      }
      if (!bleService.isConfigured()) {
        show(notConfiguredEl);
        errorMsgEl.textContent = BLE_ERRORS.NOT_CONFIGURED;
        show(errorMsgEl);
        return;
      }
      
      try {
        await bleService.connect();
      } catch (err) {
        errorMsgEl.textContent = err.message || 'Connection failed';
        show(errorMsgEl);
      }
    }
  });

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
