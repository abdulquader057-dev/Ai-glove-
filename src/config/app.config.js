// ──────────────────────────────────────────────
// AI GLOVE — Application Configuration
// ──────────────────────────────────────────────

export const APP_CONFIG = {
  name: 'AI GLOVE',
  version: '1.0.0',
  tagline: 'The Future of Hand Communication',
  description: 'AI-powered wearable technology that detects hand gestures in real time and converts them into understandable text and speech.',

  // Default operating mode
  defaultMode: 'simulation', // 'simulation' | 'hardware'

  // Simulation settings
  simulation: {
    gestureCycleInterval: 4000,    // ms between gesture changes
    sensorUpdateInterval: 100,     // ms between sensor data updates
    noiseLevel: 0.08,              // sensor noise amplitude (0-1)
    confidenceRange: [0.78, 0.98], // simulated confidence range
  },

  // Smart stream filtering
  streamFilter: {
    duplicateCooldownMs: 2000,     // minimum ms before same gesture re-added
    gestureHoldThreshold: 1500,    // ms a gesture must be held to register
  },

  // Accessibility defaults
  accessibility: {
    largerText: false,
    highContrast: false,
    reducedMotion: false,
    voiceOutput: true,
  },

  // Voice defaults
  voice: {
    volume: 0.8,        // 0-1
    rate: 1.0,          // 0.5-2
    pitch: 1.0,         // 0-2
    language: 'en-US',
    autoSpeak: true,
  },

  // History
  history: {
    maxEntries: 500,
  },

  // Project links (placeholders)
  links: {
    github: '#',       // TBD — Add GitHub repository URL
    demo: '#',         // TBD — Add deployed demo URL
    team: '#',         // TBD — Add team page URL
  },

  // Navigation items
  navigation: [
    { id: 'home', label: 'HOME', hash: '#home' },
    { id: 'ai-glove', label: 'AI GLOVE', hash: '#ai-glove' },
    { id: 'ai-ml', label: 'AI & ML', hash: '#ai-ml' },
    { id: 'accessibility', label: 'ACCESSIBILITY', hash: '#accessibility' },
    { id: 'live-demo', label: 'LIVE DEMO', hash: '#live-demo' },
    { id: 'impact-future', label: 'IMPACT & FUTURE', hash: '#impact-future' },
  ],

  // Project status (configurable)
  projectStatus: {
    hardware: 'In Development',
    ble: 'Integration Pending',
    ml: 'Model Selection Pending',
    dataset: 'Collection In Progress',
    frontend: 'Development',
    realTimeDemo: 'Simulation Ready',
  },

  // Team placeholders
  team: [
    { name: 'Team Member 01', role: 'Hardware Engineering', avatar: null },
    { name: 'Team Member 02', role: 'Machine Learning', avatar: null },
    { name: 'Team Member 03', role: 'Frontend Development', avatar: null },
    { name: 'Team Member 04', role: 'Backend & Integration', avatar: null },
  ],
};
