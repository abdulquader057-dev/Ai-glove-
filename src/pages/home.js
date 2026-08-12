import { renderHolographicHand, initHolographicHand } from '../components/holographic-hand.js';
import { renderPipeline, initPipeline } from '../components/pipeline-flow.js';
import { openModal } from '../components/modal.js';
import { initTooltips } from '../components/tooltip.js';
import { APP_CONFIG } from '../config/app.config.js';
import { $, $$, on, off } from '../utils/dom.js';

let observer = null;

export function render() {
  const features = [
    { label: 'Real-Time Recognition', icon: 'zap', detail: 'Processes sensor data continuously and predicts gestures in under 300ms.' },
    { label: 'AI Powered', icon: 'brain-circuit', detail: 'Machine learning models analyze complex patterns for 94% accuracy on 50+ gestures.' },
    { label: 'Wireless Freedom', icon: 'wifi', detail: 'Bluetooth Low Energy provides efficient wireless communication with 8-hour battery life.' },
    { label: 'Accessibility First', icon: 'accessibility', detail: 'Built specifically to bridge the communication gap for the 70 million people using sign language.' }
  ];

  return `
    <main class="page home-page">
      <!-- HERO SECTION -->
      <section class="section hero-section pt-16 pb-16" id="home-hero-section">
        <div class="container grid-2 items-center">
          <div class="hero-content flex flex-col gap-6 animate-fade-in-up">
            <div class="badge inline-flex items-center gap-2 px-4 py-2 border-radius bg-surface w-max">
              <span class="live-dot" style="width:8px;height:8px;border-radius:50%;background:var(--color-status-connected);"></span> 
              Open Source Hardware
            </div>
            <h1 class="text-5xl font-bold">Turn gestures into words with AI.</h1>
            <p class="text-xl text-muted max-w-md">
              A wearable glove that recognizes hand movements and speaks for you. 
              Bridging the gap between gesture and digital communication.
            </p>
            <div class="flex gap-4 mt-4">
              <button class="btn btn-primary" data-navigate="#live-demo">
                Try live demo <i data-lucide="arrow-right"></i>
              </button>
              <button class="btn btn-secondary" data-navigate="#ai-glove">
                Explore the tech
              </button>
            </div>
          </div>
          <div class="hero-visual animate-fade-in-up" style="animation-delay: 0.2s">
            ${renderHolographicHand({ size: 'large', id: 'home-hand' })}
          </div>
        </div>
      </section>

      <!-- FEATURES SECTION -->
      <section class="section section-padding bg-surface border-t">
        <div class="container">
          <div class="section-header text-center mb-12 animate-fade-in-up">
            <h2>The Challenge & Solution</h2>
            <p class="text-muted max-w-md mx-auto mt-4">Communication should not depend entirely on spoken language or a screen. Our hardware aims to restore seamless interaction.</p>
          </div>
          
          <div class="grid-4">
            ${features.map((f, i) => `
              <div class="card p-6 animate-fade-in-up" style="animation-delay: ${0.1 * i}s">
                <div class="card-icon mb-4 text-primary">
                  <i data-lucide="${f.icon}" style="width: 32px; height: 32px;"></i>
                </div>
                <h3 class="text-lg font-bold mb-2">${f.label}</h3>
                <p class="text-sm text-muted">${f.detail}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- PIPELINE SECTION -->
      <section class="section section-padding">
        <div class="container">
          <div class="section-header text-center mb-12 animate-fade-in-up">
            <h2>How It Works</h2>
            <p class="text-muted max-w-md mx-auto mt-4">From physical movement to digital intelligence.</p>
          </div>
          <div class="pipeline-container animate-fade-in-up" style="animation-delay: 0.1s">
            ${renderPipeline({ direction: 'horizontal', steps: 6, id: 'home-pipeline', clickable: true })}
          </div>
        </div>
      </section>

      <!-- HARDWARE SPECS -->
      <section class="section section-padding bg-surface border-t">
        <div class="container">
          <div class="section-header text-center mb-12 animate-fade-in-up">
            <h2>Hardware Architecture</h2>
          </div>
          <div class="grid-3">
            <div class="card p-6 tech-card animate-fade-in-up" data-tech="flex" tabindex="0">
              <div class="card-icon mb-4 text-primary"><i data-lucide="hand"></i></div>
              <h4 class="text-lg font-bold mb-2">5 Flex Sensors</h4>
              <p class="text-sm text-muted">Resistance range: 10kΩ – 50kΩ. Detects bend angle with ±2° accuracy per finger.</p>
            </div>
            <div class="card p-6 tech-card animate-fade-in-up" data-tech="imu" tabindex="0" style="animation-delay: 0.1s">
              <div class="card-icon mb-4 text-primary"><i data-lucide="smartphone"></i></div>
              <h4 class="text-lg font-bold mb-2">6-Axis IMU</h4>
              <p class="text-sm text-muted">Captures hand movement and orientation in 3D space with minimal drift.</p>
            </div>
            <div class="card p-6 tech-card animate-fade-in-up" data-tech="controller" tabindex="0" style="animation-delay: 0.2s">
              <div class="card-icon mb-4 text-primary"><i data-lucide="cpu"></i></div>
              <h4 class="text-lg font-bold mb-2">XIAO nRF52840</h4>
              <p class="text-sm text-muted">Ultra-compact main controller handling data aggregation and ML inference.</p>
            </div>
            <div class="card p-6 tech-card animate-fade-in-up" data-tech="ble" tabindex="0" style="animation-delay: 0.3s">
              <div class="card-icon mb-4 text-primary"><i data-lucide="bluetooth"></i></div>
              <h4 class="text-lg font-bold mb-2">Bluetooth LE</h4>
              <p class="text-sm text-muted">Streams packed sensor data continuously to the client device at 50Hz.</p>
            </div>
            <div class="card p-6 tech-card animate-fade-in-up" data-tech="ml" tabindex="0" style="animation-delay: 0.4s">
              <div class="card-icon mb-4 text-primary"><i data-lucide="network"></i></div>
              <h4 class="text-lg font-bold mb-2">ML Inference</h4>
              <p class="text-sm text-muted">TensorFlow Lite models classify the current gesture vector into text.</p>
            </div>
            <div class="card p-6 tech-card animate-fade-in-up" data-tech="voice" tabindex="0" style="animation-delay: 0.5s">
              <div class="card-icon mb-4 text-primary"><i data-lucide="volume-2"></i></div>
              <h4 class="text-lg font-bold mb-2">Voice Output</h4>
              <p class="text-sm text-muted">Web Speech API synthesizes text into natural-sounding speech.</p>
            </div>
          </div>
        </div>
      </section>
      
      <!-- CTA SECTION -->
      <section class="section section-padding text-center">
        <div class="container animate-fade-in-up">
          <h2 class="text-4xl font-bold mb-6">Ready to see it in action?</h2>
          <p class="text-xl text-muted max-w-md mx-auto mb-8">Test the AI gesture recognition pipeline right in your browser.</p>
          <button class="btn btn-primary btn-lg" data-navigate="#live-demo">
            Launch Live Demo <i data-lucide="play"></i>
          </button>
        </div>
      </section>
    </main>
  `;
}

export function init() {
  initHolographicHand('home-hand');
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
