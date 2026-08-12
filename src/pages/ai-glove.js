import { renderHero, initHero } from '../components/hero-section.js';
import { renderPipeline, initPipeline } from '../components/pipeline-flow.js';
import { renderSpecTable } from '../components/spec-table.js';
import { openModal } from '../components/modal.js';
import { initTooltips } from '../components/tooltip.js';
import { $, $$, on, off } from '../utils/dom.js';

let observer = null;
let sensorInterval = null;

export function render() {
  return `
    <div class="page ai-glove-page">
      <section class="section hero-section" id="glove-hero-section">
        <div class="container text-center animate-fade-in-up">
          <h1>MEET THE AI GLOVE</h1>
          <p class="subtitle">A wearable interface that transforms physical hand movement into machine-readable information.</p>
          <div class="glove-visual-container">
            <div class="glove-hologram">
              <div class="hotspot" data-target="flex" style="top: 20%; left: 50%;">
                <span class="hotspot-pulse"></span>
                <span class="hotspot-label">Flex Sensors</span>
              </div>
              <div class="hotspot" data-target="imu" style="top: 50%; left: 50%;">
                <span class="hotspot-pulse"></span>
                <span class="hotspot-label">IMU</span>
              </div>
              <div class="hotspot" data-target="xiao" style="top: 80%; left: 50%;">
                <span class="hotspot-pulse"></span>
                <span class="hotspot-label">XIAO nRF52840 Sense</span>
              </div>
              <div class="hotspot" data-target="ble" style="top: 85%; left: 30%;">
                <span class="hotspot-pulse"></span>
                <span class="hotspot-label">BLE</span>
              </div>
              <div class="wireframe-hand"></div>
            </div>
          </div>
        </div>
      </section>

      <section class="section section-padding components-section alt-bg">
        <div class="container">
          <div class="grid-2">
            <div class="component-card animate-fade-in-up">
              <div class="card-header flex items-center gap-2 mb-4">
                <i data-lucide="hand" class="text-primary" style="width: 32px; height: 32px;"></i>
                <h3 class="text-lg font-bold">FLEX SENSORS</h3>
              </div>
              <p>Flex sensors detect the bending of individual fingers. The AI Glove uses 5 flex sensors — one for each finger.</p>
              <div class="sensor-bars flex-sensor-bars">
                <div class="bar-row"><span class="label">Thumb</span><div class="bar-track"><div class="bar-fill" id="flex-thumb"></div></div></div>
                <div class="bar-row"><span class="label">Index</span><div class="bar-track"><div class="bar-fill" id="flex-index"></div></div></div>
                <div class="bar-row"><span class="label">Middle</span><div class="bar-track"><div class="bar-fill" id="flex-middle"></div></div></div>
                <div class="bar-row"><span class="label">Ring</span><div class="bar-track"><div class="bar-fill" id="flex-ring"></div></div></div>
                <div class="bar-row"><span class="label">Pinky</span><div class="bar-track"><div class="bar-fill" id="flex-pinky"></div></div></div>
              </div>
            </div>

            <div class="component-card animate-fade-in-up" style="animation-delay: 0.1s">
              <div class="card-header flex items-center gap-2 mb-4">
                <i data-lucide="smartphone" class="text-primary" style="width: 32px; height: 32px;"></i>
                <h3 class="text-lg font-bold">6-AXIS IMU</h3>
              </div>
              <p>The onboard 6-axis IMU captures hand movement and orientation information.</p>
              <div class="sensor-bars imu-bars">
                <div class="bar-row"><span class="label">Acc X</span><div class="bar-track"><div class="bar-fill center-fill" id="imu-ax"></div></div></div>
                <div class="bar-row"><span class="label">Acc Y</span><div class="bar-track"><div class="bar-fill center-fill" id="imu-ay"></div></div></div>
                <div class="bar-row"><span class="label">Acc Z</span><div class="bar-track"><div class="bar-fill center-fill" id="imu-az"></div></div></div>
              </div>
            </div>

            <div class="component-card animate-fade-in-up" style="animation-delay: 0.2s">
              <div class="card-header flex items-center gap-2 mb-4">
                <i data-lucide="cpu" class="text-primary" style="width: 32px; height: 32px;"></i>
                <h3 class="text-lg font-bold">XIAO nRF52840 SENSE</h3>
              </div>
              <p>The XIAO nRF52840 Sense acts as the glove's main controller, collecting sensor data and transmitting it wirelessly.</p>
              <div class="role-diagram">
                <div class="diagram-node">Sensors</div>
                <div class="diagram-arrow">→</div>
                <div class="diagram-node highlight">XIAO MCU</div>
                <div class="diagram-arrow">→</div>
                <div class="diagram-node">BLE</div>
              </div>
            </div>

            <div class="component-card animate-fade-in-up" style="animation-delay: 0.3s">
              <div class="card-header flex items-center gap-2 mb-4">
                <i data-lucide="bluetooth" class="text-primary" style="width: 32px; height: 32px;"></i>
                <h3 class="text-lg font-bold">BLUETOOTH LOW ENERGY</h3>
              </div>
              <p>Bluetooth Low Energy provides wireless communication between the glove and the connected device.</p>
              <div class="connection-flow">
                <div class="flow-item">Glove</div>
                <div class="flow-signal">≈ BLE ≈</div>
                <div class="flow-item">Device</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="section section-padding pipeline-section">
        <div class="container">
          <div class="section-header text-center animate-fade-in-up">
            <h2>HOW IT WORKS</h2>
          </div>
          <div class="full-pipeline-container animate-fade-in-up" style="animation-delay: 0.1s">
            ${renderPipeline({ direction: 'vertical', steps: 8, id: 'glove-pipeline', clickable: true })}
          </div>
        </div>
      </section>

      <section class="section section-padding specs-section alt-bg">
        <div class="container">
          <div class="section-header text-center animate-fade-in-up">
            <h2>SPECIFICATIONS</h2>
          </div>
          <div class="specs-container animate-fade-in-up" style="animation-delay: 0.1s">
            ${renderSpecTable([
              { category: 'Hardware', name: 'Microcontroller', value: 'Seeed Studio XIAO nRF52840 Sense' },
              { category: 'Hardware', name: 'Flex Sensors', value: '5x Spectra Symbol (or generic) 2.2" Flex Sensors' },
              { category: 'Hardware', name: 'IMU', value: 'LSM6DS3 (Built-in to XIAO)' },
              { category: 'Connectivity', name: 'Protocol', value: 'Bluetooth Low Energy (BLE)' },
              { category: 'Connectivity', name: 'Data Rate', value: 'TBD' },
              { category: 'Power', name: 'Battery', value: '3.7V LiPo (Capacity TBD)' },
              { category: 'Power', name: 'Runtime', value: 'TBD' }
            ])}
          </div>
        </div>
      </section>
    </div>
  `;
}

export function init() {
  initPipeline('glove-pipeline');
  initTooltips();

  const hotspotData = {
    'flex': { title: 'Flex Sensors', content: 'Five sensors running along the fingers to track flex/bend degrees.' },
    'imu': { title: 'IMU', content: '6-Axis IMU (Accelerometer + Gyroscope) placed on the back of the hand.' },
    'xiao': { title: 'XIAO Controller', content: 'The brain of the glove, processing raw signals and packaging them for transmission.' },
    'ble': { title: 'BLE Module', content: 'Integrated into the XIAO board, transmitting data wirelessly at low power.' }
  };

  const hotspots = $$('.hotspot');
  hotspots.forEach(hotspot => {
    on(hotspot, 'click', () => {
      const target = hotspot.dataset.target;
      if (hotspotData[target]) {
        openModal({
          title: hotspotData[target].title,
          content: `<p>${hotspotData[target].content}</p>`
        });
      }
    });
  });

  // Intersection observer for animations
  const animatedElements = $$('.animate-fade-in-up');
  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    animatedElements.forEach(el => observer.observe(el));
  } else {
    animatedElements.forEach(el => el.classList.add('visible'));
  }

  // Simulate sensor data
  sensorInterval = setInterval(() => {
    const ids = ['flex-thumb', 'flex-index', 'flex-middle', 'flex-ring', 'flex-pinky'];
    ids.forEach(id => {
      const el = $(`#${id}`);
      if (el) el.style.width = (Math.random() * 60 + 20) + '%';
    });

    const imuIds = ['imu-ax', 'imu-ay', 'imu-az'];
    imuIds.forEach(id => {
      const el = $(`#${id}`);
      if (el) {
        const val = (Math.random() * 100) - 50;
        el.style.width = Math.abs(val) + '%';
        el.style.left = val < 0 ? (50 + val) + '%' : '50%';
      }
    });
  }, 1000);
}

export function cleanup() {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
  if (sensorInterval) {
    clearInterval(sensorInterval);
    sensorInterval = null;
  }
  const hotspots = $$('.hotspot');
  hotspots.forEach(h => {
    const clone = h.cloneNode(true);
    h.parentNode.replaceChild(clone, h);
  });
}
