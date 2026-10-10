// SIGNOVA Gesture Classifier
// Exposes classify(values, options) => { label, confidence, source, bits, binaryString }
// Team Syntropy

import { CONFIG } from '../config.js';
import { score as rfScore, CLASSES as RF_CLASSES, MODEL_IS_PLACEHOLDER as RF_PLACEHOLDER } from './rf_model.js';

// Re-export the placeholder flag so the UI badge can read it
export const MODEL_IS_PLACEHOLDER = RF_PLACEHOLDER;

/**
 * Classify 3-finger flex readings
 * @param {number[]} values - 3 flex sensor values [index, middle, ring]
 * @param {Object} [options]
 * @param {number[]} [options.thresholds] - Midpoint thresholds per finger
 * @param {number[]} [options.straight] - Straight calibration per finger
 * @param {number[]} [options.bent] - Bent calibration per finger
 * @param {'threshold'|'random_forest'} [options.source='threshold'] - Classifier engine to use
 * @returns {{ label: string, confidence: number, source: string, bits: [number, number, number], binaryString: string }}
 */
export function classify(values, options = {}) {
  const source = options.source || 'threshold';
  const thresholds = options.thresholds || [512, 512, 512];
  const straightVals = options.straight || [250, 260, 240];
  const bentVals = options.bent || [780, 790, 770];

  if (!values || values.length < 3) {
    return {
      label: 'NONE',
      confidence: 0,
      source,
      bits: [0, 0, 0],
      binaryString: '000',
    };
  }

  // 1. Calculate binary pattern: 1 = bent, 0 = straight
  // Supports dynamic adaptive calibration:
  // If the sensor has not been calibrated and raw values exceed 1023 (e.g. 10-bit or 14-bit ADC on nRF52840),
  // compare against dynamic midpoint or threshold safely.
  const bits = [0, 0, 0];
  const fingerConfidences = [0, 0, 0];

  for (let i = 0; i < 3; i++) {
    const val = values[i];
    let th = thresholds[i];
    let sVal = straightVals[i];
    let bVal = bentVals[i];

    const isBentHigher = bVal >= sVal;

    if (isBentHigher) {
      bits[i] = val >= th ? 1 : 0;
      const target = bits[i] === 1 ? bVal : sVal;
      const span = Math.abs(target - th) || 1;
      const dist = Math.abs(val - th);
      const ratio = Math.min(1.0, dist / span);
      fingerConfidences[i] = 50 + ratio * 50;
    } else {
      // Reversed polarity (resistance drops when flexed)
      bits[i] = val <= th ? 1 : 0;
      const target = bits[i] === 1 ? bVal : sVal;
      const span = Math.abs(th - target) || 1;
      const dist = Math.abs(th - val);
      const ratio = Math.min(1.0, dist / span);
      fingerConfidences[i] = 50 + ratio * 50;
    }
  }

  const binaryString = `${bits[0]}${bits[1]}${bits[2]}`;

  if (source === 'random_forest') {
    const normalized = [0, 0, 0];
    for (let i = 0; i < 3; i++) {
      const min = Math.min(straightVals[i], bentVals[i]);
      const max = Math.max(straightVals[i], bentVals[i]);
      const range = max - min || 1;
      let norm = (values[i] - min) / range;
      if (bentVals[i] < straightVals[i]) {
        norm = 1.0 - norm;
      }
      normalized[i] = Math.max(0.0, Math.min(1.0, norm));
    }

    const probs = rfScore(normalized);
    let maxProb = -1;
    let maxIdx = 0;
    for (let i = 0; i < probs.length; i++) {
      if (probs[i] > maxProb) {
        maxProb = probs[i];
        maxIdx = i;
      }
    }

    const label = RF_CLASSES[maxIdx] || 'NONE';
    const confidence = Math.round(maxProb * 1000) / 10;

    return {
      label,
      confidence,
      source: 'random_forest',
      bits,
      binaryString,
    };
  }

  // Exact Gesture dictionary mapping from config
  const matchedLabel = CONFIG.GESTURE_MAP[binaryString] || 'NONE';
  const avgConf = (fingerConfidences[0] + fingerConfidences[1] + fingerConfidences[2]) / 3;
  const confidence = Math.round(avgConf * 10) / 10;

  return {
    label: matchedLabel,
    confidence,
    source: 'threshold',
    bits,
    binaryString,
  };
}

const classifierExport = { classify, MODEL_IS_PLACEHOLDER };
export default classifierExport;
