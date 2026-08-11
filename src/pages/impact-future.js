import { initTooltips } from '../components/tooltip.js';
import { renderStatusBadge } from '../components/status-badge.js';
import { APP_CONFIG } from '../config/app.config.js';
import { $, $$, on, off } from '../utils/dom.js';

export function render() {
  const { team, projectStatus } = APP_CONFIG;

  return `
    <div class="page page-impact-future">
      
      <!-- HERO -->
      <section class="section section-padding text-center bg-surface">
        <h1 class="animate-fade-in-up text-4xl mb-4">FROM PROTOTYPE TO POSSIBILITY</h1>
        <p class="animate-fade-in-up stagger-1 text-xl text-secondary max-w-2xl mx-auto">Exploring the impact and future potential of AI-powered gesture recognition.</p>
      </section>

      <!-- PROBLEM & SOLUTION -->
      <section class="section section-padding">
        <div class="container">
          <div class="grid grid-2 gap-8 items-center">
            <div class="problem-box p-6 bg-surface border-radius animate-fade-in-up">
              <h2 class="text-error mb-4">The Problem</h2>
              <p>Communication depends heavily on voice and screens. Not everyone has equal access to these channels. Physical gestures are a natural, intuitive form of expression that technology should be able to understand.</p>
            </div>
            <div class="solution-box p-6 bg-primary-light border-radius animate-fade-in-up stagger-1">
              <h2 class="text-primary mb-4">The Solution</h2>
              <p>The AI Glove captures hand gestures using sensors, processes them with machine learning, and converts them into text and speech — creating a new bridge for communication.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- WHO BENEFITS -->
      <section class="section section-padding bg-background">
        <div class="container">
          <h2 class="text-center mb-8 animate-fade-in-up">WHO BENEFITS</h2>
          <div class="grid grid-3 gap-6">
            ${[
              { icon: '👥', title: 'People preferring gestures', desc: 'Those who prefer or rely on gesture-based communication in daily life.' },
              { icon: '♿', title: 'Accessibility Applications', desc: 'Tools designed to make digital interaction more inclusive.' },
              { icon: '🎓', title: 'Educational Environments', desc: 'Assisting in learning gestures and sign language fundamentals.' },
              { icon: '🤝', title: 'Assistive Communication', desc: 'Scenarios where traditional voice or text isn\'t viable.' },
              { icon: '💻', title: 'HCI Research', desc: 'Advancing Human-Computer Interaction studies.' },
              { icon: '🤖', title: 'Robotics & Control', desc: 'Intuitive industrial and robotic control mechanisms.' },
              { icon: '🏠', title: 'Smart Devices', desc: 'Gesture control for smart home ecosystems.' }
            ].map((item, i) => `
              <div class="card p-6 text-center animate-fade-in-up stagger-${i % 3}">
                <div class="text-4xl mb-4">${item.icon}</div>
                <h3 class="mb-2">${item.title}</h3>
                <p class="text-sm text-secondary">${item.desc}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- APPLICATIONS -->
      <section class="section section-padding">
        <div class="container">
          <h2 class="text-center mb-8 animate-fade-in-up">APPLICATIONS</h2>
          <div class="grid grid-4 gap-4">
            ${[
              { title: 'Accessibility', badge: 'Current prototype capability', type: 'current' },
              { title: 'Assistive Communication', badge: 'Current', type: 'current' },
              { title: 'Human-Computer Interaction', badge: 'Current', type: 'current' },
              { title: 'Robotics', badge: 'Future application', type: 'future' },
              { title: 'Smart Devices', badge: 'Future', type: 'future' },
              { title: 'Gaming', badge: 'Future', type: 'future' },
              { title: 'Education', badge: 'Future', type: 'future' },
              { title: 'Industrial Interfaces', badge: 'Future', type: 'future' }
            ].map((app, i) => `
              <div class="app-card p-4 bg-surface border-radius border text-center animate-fade-in-up stagger-${i % 4}">
                <h4 class="mb-2">${app.title}</h4>
                <span class="badge ${app.type === 'current' ? 'badge-green' : 'badge-violet'} text-xs">${app.badge}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- ROADMAP -->
      <section class="section section-padding bg-surface">
        <div class="container max-w-3xl">
          <h2 class="text-center mb-8 animate-fade-in-up">DEVELOPMENT ROADMAP</h2>
          <div class="roadmap-timeline relative">
            ${[
              { p: '01', title: 'Prototype', desc: 'Hardware assembly and initial testing', status: 'In Progress' },
              { p: '02', title: 'Real BLE Integration', desc: 'Connect physical glove to web application', status: 'Planned' },
              { p: '03', title: 'Final ML Model', desc: 'Train and evaluate gesture classification model', status: 'Planned' },
              { p: '04', title: 'On-device Inference', desc: 'Assess running ML on XIAO', status: 'Planned' },
              { p: '05', title: 'Expanded Vocabulary', desc: 'Add more gesture classes', status: 'Planned' },
              { p: '06', title: 'Mobile Application', desc: 'Native mobile app development', status: 'Planned' },
              { p: '07', title: 'Cloud Analytics', desc: 'Optional cloud storage and analytics', status: 'Planned' },
              { p: '08', title: 'Productization', desc: 'Refined hardware and software for real use', status: 'Planned' }
            ].map((phase, i) => `
              <div class="timeline-item flex gap-4 mb-6 animate-fade-in-up stagger-${i % 3}">
                <div class="timeline-node w-12 h-12 rounded-full flex items-center justify-center font-bold ${phase.status === 'In Progress' ? 'bg-primary text-white' : 'bg-background border'}">
                  ${phase.p}
                </div>
                <div class="timeline-content flex-1 pt-2 border-b pb-4">
                  <h4 class="flex justify-between">
                    PHASE ${phase.p}: ${phase.title}
                    <span class="text-xs ${phase.status === 'In Progress' ? 'text-primary' : 'text-secondary'}">${phase.status}</span>
                  </h4>
                  <p class="text-sm text-secondary mt-1">${phase.desc}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- PROJECT STATUS -->
      <section class="section section-padding">
        <div class="container text-center max-w-2xl">
          <h2 class="mb-8 animate-fade-in-up">PROJECT STATUS</h2>
          <div class="flex flex-wrap justify-center gap-4">
            ${renderStatusBadge('Hardware', projectStatus.hardware || 'In Development')}
            ${renderStatusBadge('BLE', projectStatus.ble || 'Integration Pending')}
            ${renderStatusBadge('ML', projectStatus.ml || 'Model Selection Pending')}
            ${renderStatusBadge('Dataset', projectStatus.dataset || 'Collection In Progress')}
            ${renderStatusBadge('Frontend', projectStatus.frontend || 'Development')}
            ${renderStatusBadge('Real-time Demo', projectStatus.demo || 'Simulation Ready')}
          </div>
        </div>
      </section>

      <!-- THE TEAM -->
      <section class="section section-padding bg-surface">
        <div class="container">
          <h2 class="text-center mb-8 animate-fade-in-up">THE TEAM</h2>
          <div class="grid grid-2 max-w-2xl mx-auto gap-6">
            ${team.map((member, i) => `
              <div class="team-card p-6 bg-background border-radius text-center shadow-sm animate-fade-in-up stagger-${i}">
                <div class="avatar w-20 h-20 mx-auto rounded-full bg-gradient-primary flex items-center justify-center text-white text-xl font-bold mb-4">
                  ${member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 class="mb-1">${member.name}</h3>
                <p class="text-secondary text-sm">${member.role}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
      
    </div>
  `;
}

export function init() {
  initTooltips();
  
  // Intersection observer for scroll animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });
  
  $$('.animate-fade-in-up').forEach(el => observer.observe(el));
}

export function cleanup() {
  // Observers usually cleanup themselves if nodes are removed, but can be done manually if saved to state.
}
