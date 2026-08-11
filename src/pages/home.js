import { renderHero, initHero } from '../components/hero-section.js';
import { renderHolographicHand, initHolographicHand } from '../components/holographic-hand.js';
import { renderPipeline, initPipeline } from '../components/pipeline-flow.js';
import { openModal } from '../components/modal.js';
import { initTooltips } from '../components/tooltip.js';
import { APP_CONFIG } from '../config/app.config.js';
import { $, $$, on, off } from '../utils/dom.js';

let observer = null;

export function render() {
  const badges = [
    { label: 'REAL-TIME RECOGNITION', icon: '⚡', detail: 'Gesture recognition happens in real time as you move your hand. The system processes sensor data continuously and predicts the gesture within milliseconds.' },
    { label: 'AI POWERED', icon: '🧠', detail: 'Machine learning models analyze complex patterns in sensor data to accurately classify hand gestures.' },
    { label: 'WIRELESS', icon: '📶', detail: 'Bluetooth Low Energy provides efficient wireless communication between the glove and the connected device.' },
    { label: 'ACCESSIBILITY', icon: '♿', detail: 'The AI Glove enables gesture-based communication, converting hand movements into text and speech output.' }
  ];

  return `
    <div class="page home-page">
      <section class="section hero-section" id="home-hero-section">
        ${renderHero({
          title: 'THE FUTURE OF HAND COMMUNICATION',
          subtitle: 'Turn gestures into words with AI.',
          description: APP_CONFIG.description || 'An AI-powered wearable that translates hand gestures into text and speech.',
          primaryAction: { label: 'EXPLORE AI GLOVE', hash: '#ai-glove' },
          secondaryAction: { label: 'TRY LIVE DEMO', hash: '#live-demo' },
          badges: badges,
          visual: renderHolographicHand({ size: 'large', id: 'home-hand' })
        })}
      </section>

      <section class="section section-padding problem-section">
        <div class="container">
          <div class="section-header text-center animate-fade-in-up">
            <h2>THE CHALLENGE</h2>
          </div>
          <div class="split-layout">
            <div class="split-left animate-fade-in-up" style="animation-delay: 0.1s">
              <h3>Communication should not depend entirely on spoken language or a screen.</h3>
              <p>There are many situations where voice interfaces or screens are impractical or inaccessible. Hand gestures represent a natural, intuitive mode of expression that bridges gaps when traditional communication methods fall short.</p>
              <div class="icon-cards-vertical">
                <div class="icon-card-row">
                  <span class="icon">🌍</span>
                  <span>Millions rely on non-verbal communication</span>
                </div>
                <div class="icon-card-row">
                  <span class="icon">🔇</span>
                  <span>Not everyone can use voice-based interfaces</span>
                </div>
                <div class="icon-card-row">
                  <span class="icon">🤝</span>
                  <span>Bridging the gap between gesture and digital communication</span>
                </div>
              </div>
            </div>
            <div class="split-right animate-fade-in-up" style="animation-delay: 0.2s">
              <div class="subtle-visual">
                <div class="connection-nodes">
                  <div class="node disconnected">🗣️</div>
                  <div class="node disconnected">📱</div>
                  <div class="node center-node">✋</div>
                  <div class="node disconnected">💻</div>
                  <div class="node disconnected">🔊</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="section section-padding solution-section alt-bg">
        <div class="container">
          <div class="section-header text-center animate-fade-in-up">
            <h2>THE SOLUTION</h2>
            <p class="section-desc">An AI-powered wearable that captures hand gestures and converts them into understandable text and speech.</p>
          </div>
          <div class="pipeline-container animate-fade-in-up" style="animation-delay: 0.1s">
            ${renderPipeline({ direction: 'horizontal', steps: 5, id: 'solution-pipeline', clickable: false })}
          </div>
          <div class="pipeline-explanation text-center animate-fade-in-up" style="animation-delay: 0.2s">
            <p>From physical movement to digital intelligence.</p>
          </div>
        </div>
      </section>

      <section class="section section-padding tech-section">
        <div class="container">
          <div class="section-header text-center animate-fade-in-up">
            <h2>TECHNOLOGY</h2>
          </div>
          <div class="grid-3">
            <div class="tech-card animate-fade-in-up" data-tech="flex" tabindex="0">
              <div class="tech-icon">🧲</div>
              <h4>5 FLEX SENSORS</h4>
              <p>One sensor per finger detecting bending.</p>
            </div>
            <div class="tech-card animate-fade-in-up" data-tech="imu" tabindex="0" style="animation-delay: 0.1s">
              <div class="tech-icon">📱</div>
              <h4>6-AXIS IMU</h4>
              <p>Captures hand movement and orientation.</p>
            </div>
            <div class="tech-card animate-fade-in-up" data-tech="controller" tabindex="0" style="animation-delay: 0.2s">
              <div class="tech-icon">🔧</div>
              <h4>XIAO nRF52840</h4>
              <p>Ultra-compact main controller.</p>
            </div>
            <div class="tech-card animate-fade-in-up" data-tech="ble" tabindex="0" style="animation-delay: 0.3s">
              <div class="tech-icon">📶</div>
              <h4>BLUETOOTH LE</h4>
              <p>Efficient wireless data transmission.</p>
            </div>
            <div class="tech-card animate-fade-in-up" data-tech="ml" tabindex="0" style="animation-delay: 0.4s">
              <div class="tech-icon">🧠</div>
              <h4>ML INFERENCE</h4>
              <p>Pattern recognition from sensor data.</p>
            </div>
            <div class="tech-card animate-fade-in-up" data-tech="voice" tabindex="0" style="animation-delay: 0.5s">
              <div class="tech-icon">🔊</div>
              <h4>VOICE OUTPUT</h4>
              <p>Text-to-speech for recognized gestures.</p>
            </div>
          </div>
        </div>
      </section>

      <section class="section section-padding pipeline-section alt-bg">
        <div class="container">
          <div class="section-header text-center animate-fade-in-up">
            <h2>COMPLETE PIPELINE</h2>
          </div>
          <div class="full-pipeline-container animate-fade-in-up" style="animation-delay: 0.1s">
            ${renderPipeline({ direction: 'vertical', steps: 8, id: 'home-pipeline', clickable: true })}
          </div>
        </div>
      </section>
    </div>
  `;
}

export function init() {
  initHero('#home-hero-section');
  initHolographicHand('home-hand');
  initPipeline('solution-pipeline');
  initPipeline('home-pipeline');
  initTooltips();

  const techData = {
    'flex': { title: '5 Flex Sensors', content: 'These variable resistors change resistance based on how much they are bent. Attached to each finger, they provide the core raw data indicating hand shape and finger positions.' },
    'imu': { title: '6-Axis IMU', content: 'An Inertial Measurement Unit featuring an accelerometer and gyroscope. It tracks the rotational and translational movement of the entire hand in 3D space.' },
    'controller': { title: 'XIAO nRF52840 Sense', content: 'A powerful, tiny microcontroller that aggregates all sensor readings. It processes the analog and digital signals before transmission.' },
    'ble': { title: 'Bluetooth Low Energy', content: 'Enables low-latency, low-power wireless communication. It streams the packed sensor data continuously to the client device for processing.' },
    'ml': { title: 'Machine Learning Inference', content: 'Trained models evaluate incoming data vectors to classify the current gesture. It translates numerical arrays into discrete textual predictions.' },
    'voice': { title: 'Voice Output', content: 'The Web Speech API takes the classified text and synthesizes it into audible speech, completing the communication loop.' }
  };

  const techCards = $$('.tech-card');
  techCards.forEach(card => {
    on(card, 'click', () => {
      const type = card.dataset.tech;
      if (techData[type]) {
        openModal({
          title: techData[type].title,
          content: `<p>${techData[type].content}</p>`
        });
      }
    });
    on(card, 'keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });

  // Setup intersection observer for animations
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
}

export function cleanup() {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
  const techCards = $$('.tech-card');
  techCards.forEach(card => {
    const clone = card.cloneNode(true);
    card.parentNode.replaceChild(clone, card);
  });
}
