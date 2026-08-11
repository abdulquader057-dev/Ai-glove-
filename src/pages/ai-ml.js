import { renderSensorDisplay, initSensorDisplay } from '../components/sensor-display.js';
import { renderMetricCard, renderMetricsGrid, renderConfusionMatrix } from '../components/metric-card.js';
import { renderPipeline, initPipeline } from '../components/pipeline-flow.js';
import { ML_CONFIG, MODEL_METRICS, DATASET_INFO } from '../config/ml.config.js';
import { GESTURES } from '../config/gestures.config.js';
import { $, $$, on, off } from '../utils/dom.js';

let observer = null;
let sensorSimInterval = null;

export function render() {
  const gestureLabels = GESTURES.map(g => g.name);

  return `
    <div class="page ai-ml-page">
      <section class="section hero-section" id="ml-hero-section">
        <div class="container text-center animate-fade-in-up">
          <h1>FROM SENSOR SIGNALS TO INTELLIGENCE</h1>
          <p class="subtitle">How machine learning transforms raw sensor data into meaningful gesture predictions.</p>
          <div class="hero-pipeline animate-fade-in-up" style="animation-delay: 0.2s">
            <div class="pipeline-row">
              <div class="step">RAW DATA</div>
              <div class="arrow">→</div>
              <div class="step">PREPROCESSING</div>
              <div class="arrow">→</div>
              <div class="step">FEATURE VECTOR</div>
              <div class="arrow">→</div>
              <div class="step highlight">ML MODEL</div>
              <div class="arrow">→</div>
              <div class="step">PREDICTION</div>
              <div class="arrow">→</div>
              <div class="step">CONFIDENCE</div>
              <div class="arrow">→</div>
              <div class="step final">GESTURE</div>
            </div>
          </div>
        </div>
      </section>

      <section class="section section-padding data-input-section alt-bg">
        <div class="container">
          <div class="section-header text-center animate-fade-in-up">
            <h2>DATA INPUT</h2>
            <p>The ML model receives 8 input features from the glove's sensors.</p>
            <span class="badge badge-info">Simulated Data</span>
          </div>
          <div class="sensor-display-wrapper animate-fade-in-up" style="animation-delay: 0.1s">
            ${renderSensorDisplay({ id: 'ml-sensor-display' })}
          </div>
        </div>
      </section>

      <section class="section section-padding dataset-section">
        <div class="container">
          <div class="section-header text-center animate-fade-in-up">
            <h2>DATASET</h2>
            <p>The dataset contains sensor readings paired with gesture labels used to train and evaluate the model.</p>
            <span class="badge status-badge">${DATASET_INFO.status}</span>
          </div>
          
          <div class="grid-3">
            <div class="info-card animate-fade-in-up">
              <h4>Gesture Classes</h4>
              <p class="big-value">${DATASET_INFO.gestureClasses.length}</p>
              <div class="tag-list">
                ${gestureLabels.map(g => `<span class="tag">${g}</span>`).join('')}
              </div>
            </div>
            
            <div class="info-card animate-fade-in-up" style="animation-delay: 0.1s">
              <h4>Input Features</h4>
              <p class="big-value">${DATASET_INFO.inputFeatures}</p>
              <div class="tag-list">
                ${DATASET_INFO.sensorTypes.map(t => `<span class="tag">${t}</span>`).join('')}
              </div>
            </div>

            <div class="info-card animate-fade-in-up" style="animation-delay: 0.2s">
              <h4>Training Pipeline</h4>
              <ul class="mini-flow">
                ${(typeof DATASET_INFO.trainingPipeline === 'string' ? DATASET_INFO.trainingPipeline.split(' → ') : DATASET_INFO.trainingPipeline).map(step => `<li>${step}</li>`).join('')}
              </ul>
            </div>
          </div>
          <div class="note-box animate-fade-in-up" style="animation-delay: 0.3s">
            <p><strong>Note:</strong> ${DATASET_INFO.note}</p>
          </div>
        </div>
      </section>

      <section class="section section-padding model-section alt-bg">
        <div class="container">
          <div class="section-header text-center animate-fade-in-up">
            <h2>MODEL</h2>
            <div class="status-indicator">
              <span class="badge ${ML_CONFIG.model.status === 'Awaiting Model' ? 'badge-warning' : 'badge-success'}">${ML_CONFIG.model.status}</span>
            </div>
            <p>${ML_CONFIG.model.description}</p>
            <p class="important-note"><strong>Important:</strong> The final ML model has not been selected.</p>
          </div>
          
          <h3 class="text-center">Candidates</h3>
          <div class="grid-2 candidate-models">
            ${ML_CONFIG.possibleModels.map((m, i) => `
              <div class="model-card animate-fade-in-up" style="animation-delay: ${i * 0.1}s">
                <h4>${m.name}</h4>
                <div class="pros-cons">
                  <div class="pros">
                    <h5>Pros</h5>
                    <ul>${m.pros.map(p => `<li>${p}</li>`).join('')}</ul>
                  </div>
                  <div class="cons">
                    <h5>Cons</h5>
                    <ul>${m.cons.map(c => `<li>${c}</li>`).join('')}</ul>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
          <div class="deployment-info text-center animate-fade-in-up" style="margin-top: 2rem;">
            <p><strong>Deployment:</strong> ${ML_CONFIG.deployment}</p>
          </div>
        </div>
      </section>

      <section class="section section-padding inference-section">
        <div class="container">
          <div class="section-header text-center animate-fade-in-up">
            <h2>INFERENCE</h2>
            <p>Inference is the process of using the trained model to predict the gesture represented by new sensor data.</p>
          </div>
          
          <div class="inference-flow text-center animate-fade-in-up" style="animation-delay: 0.1s">
            <div class="inference-step">
              <div class="box">[1024, 850, 912, 110, 50, -0.5, 0.2, 0.9]</div>
              <span>Sensor Values</span>
            </div>
            <div class="inference-arrow">↓</div>
            <div class="inference-step">
              <div class="box highlight">Random Forest Classifier</div>
              <span>Model</span>
            </div>
            <div class="inference-arrow">↓</div>
            <div class="inference-step">
              <div class="box result">"HELLO" (94.6%)</div>
              <span>Prediction + Confidence</span>
            </div>
          </div>
        </div>
      </section>

      <section class="section section-padding metrics-section alt-bg">
        <div class="container">
          <div class="section-header text-center animate-fade-in-up">
            <h2>MODEL PERFORMANCE</h2>
          </div>
          
          <div class="metrics-container animate-fade-in-up" style="animation-delay: 0.1s">
            ${renderMetricsGrid(MODEL_METRICS)}
          </div>
          
          <div class="confusion-matrix-container animate-fade-in-up" style="animation-delay: 0.2s">
            ${renderConfusionMatrix(MODEL_METRICS.confusionMatrix, gestureLabels)}
          </div>
        </div>
      </section>
    </div>
  `;
}

export function init() {
  initSensorDisplay('ml-sensor-display');

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
  const sensorDisplay = $('#ml-sensor-display');
  if (sensorDisplay) {
    sensorSimInterval = setInterval(() => {
      const data = {
        flex: [
          Math.random() * 1023,
          Math.random() * 1023,
          Math.random() * 1023,
          Math.random() * 1023,
          Math.random() * 1023
        ],
        imu: {
          ax: (Math.random() * 4) - 2,
          ay: (Math.random() * 4) - 2,
          az: (Math.random() * 4) - 2,
          gx: (Math.random() * 500) - 250,
          gy: (Math.random() * 500) - 250,
          gz: (Math.random() * 500) - 250
        }
      };
      // Dispatch event to update sensor display
      const event = new CustomEvent('sensorData', { detail: data });
      window.dispatchEvent(event);
    }, 100);
  }
}

export function cleanup() {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
  if (sensorSimInterval) {
    clearInterval(sensorSimInterval);
    sensorSimInterval = null;
  }
}
