// ──────────────────────────────────────────────
// AI GLOVE — Gesture Configuration
// ──────────────────────────────────────────────
//
// HOW TO MODIFY THE GESTURE LIST:
// 1. Add/remove/edit entries in the GESTURES array below
// 2. Each gesture needs: id, name, icon, description, category, sensorProfile
// 3. sensorProfile defines the characteristic sensor values for simulation
//    - flex values: 0 = fully extended, 1 = fully bent
//    - imu values: normalized -1 to 1
// 4. The rest of the application reads from this file automatically
//
// IMPORTANT: The final gesture list is TBD.
// These are example gestures for development and demonstration.
// ──────────────────────────────────────────────

export const GESTURES = [
  {
    id: 'hello',
    name: 'HELLO',
    icon: '👋',
    description: 'Open hand with fingers spread, waving motion.',
    category: 'communication',
    sensorProfile: {
      flex: { thumb: 0.05, index: 0.05, middle: 0.05, ring: 0.05, pinky: 0.05 },
      imu: { x: 0.6, y: 0.2, z: 0.1 }  // waving motion
    }
  },
  {
    id: 'help',
    name: 'HELP',
    icon: '🆘',
    description: 'Closed fist with thumb extended upward, urgent gesture.',
    category: 'communication',
    sensorProfile: {
      flex: { thumb: 0.1, index: 0.9, middle: 0.9, ring: 0.9, pinky: 0.9 },
      imu: { x: 0.0, y: 0.7, z: 0.0 }  // hand raised
    }
  },
  {
    id: 'yes',
    name: 'YES',
    icon: '👍',
    description: 'Thumbs up gesture — affirmative response.',
    category: 'response',
    sensorProfile: {
      flex: { thumb: 0.0, index: 0.95, middle: 0.95, ring: 0.95, pinky: 0.95 },
      imu: { x: 0.0, y: 0.5, z: 0.0 }
    }
  },
  {
    id: 'no',
    name: 'NO',
    icon: '👎',
    description: 'Thumbs down gesture — negative response.',
    category: 'response',
    sensorProfile: {
      flex: { thumb: 0.0, index: 0.95, middle: 0.95, ring: 0.95, pinky: 0.95 },
      imu: { x: 0.0, y: -0.5, z: 0.0 }  // hand inverted
    }
  },
  {
    id: 'thank_you',
    name: 'THANK YOU',
    icon: '🙏',
    description: 'Flat hand moving away from chin — sign of gratitude.',
    category: 'communication',
    sensorProfile: {
      flex: { thumb: 0.15, index: 0.1, middle: 0.1, ring: 0.1, pinky: 0.1 },
      imu: { x: 0.0, y: 0.3, z: -0.4 }  // forward motion
    }
  },
  {
    id: 'ok',
    name: 'OK',
    icon: '👌',
    description: 'Thumb and index finger forming a circle, other fingers extended.',
    category: 'response',
    sensorProfile: {
      flex: { thumb: 0.5, index: 0.5, middle: 0.05, ring: 0.05, pinky: 0.05 },
      imu: { x: 0.0, y: 0.1, z: 0.0 }
    }
  },
  {
    id: 'victory',
    name: 'VICTORY',
    icon: '✌️',
    description: 'Index and middle fingers extended in a V shape.',
    category: 'expression',
    sensorProfile: {
      flex: { thumb: 0.8, index: 0.05, middle: 0.05, ring: 0.9, pinky: 0.9 },
      imu: { x: 0.0, y: 0.4, z: 0.0 }
    }
  },
  {
    id: 'love_you',
    name: 'LOVE YOU',
    icon: '🤟',
    description: 'Thumb, index, and pinky extended — "I Love You" in ASL.',
    category: 'expression',
    sensorProfile: {
      flex: { thumb: 0.05, index: 0.05, middle: 0.95, ring: 0.95, pinky: 0.05 },
      imu: { x: 0.0, y: 0.3, z: 0.0 }
    }
  },
  {
    id: 'fist',
    name: 'FIST',
    icon: '✊',
    description: 'All fingers fully closed into a fist.',
    category: 'expression',
    sensorProfile: {
      flex: { thumb: 0.9, index: 0.95, middle: 0.95, ring: 0.95, pinky: 0.95 },
      imu: { x: 0.0, y: 0.0, z: 0.0 }
    }
  },
  {
    id: 'point',
    name: 'POINT',
    icon: '☝️',
    description: 'Index finger extended, all other fingers closed.',
    category: 'communication',
    sensorProfile: {
      flex: { thumb: 0.8, index: 0.0, middle: 0.95, ring: 0.95, pinky: 0.95 },
      imu: { x: 0.3, y: 0.3, z: 0.0 }
    }
  },
];

// ── Gesture Categories ──
export const GESTURE_CATEGORIES = {
  communication: { label: 'Communication', color: '#00f0ff' },
  response: { label: 'Response', color: '#00ff88' },
  expression: { label: 'Expression', color: '#8b5cf6' },
};

// ── Helper Functions ──

/** Get gesture by ID */
export function getGestureById(id) {
  return GESTURES.find(g => g.id === id) || null;
}

/** Get gestures by category */
export function getGesturesByCategory(category) {
  return GESTURES.filter(g => g.category === category);
}

/** Get all gesture names */
export function getGestureNames() {
  return GESTURES.map(g => g.name);
}

/** Get gesture count */
export function getGestureCount() {
  return GESTURES.length;
}
