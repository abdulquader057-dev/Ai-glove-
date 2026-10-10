// Placeholder Random Forest model for SIGNOVA
// This stub satisfies the import in classifier.js when the real model is not yet provided.
// It returns uniform low confidence scores for all classes.
// Replace this file with the real m2cgen-exported model when ready.

export const CLASSES = ['HELLO', 'YES', 'ONE', 'VICTORY', 'OK', 'THREE', 'NO', 'ROCK', 'NONE'];

/**
 * Returns an array of probabilities (0.0 – 1.0) for each class.
 * @param {number[]} normalizedValues - 3 normalised sensor values [0..1]
 * @returns {number[]}
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function score(normalizedValues) {
  // Uniform dummy distribution — all zeros until the real RF model is loaded
  return new Array(CLASSES.length).fill(0);
}

export const rfScore = score;
export const MODEL_IS_PLACEHOLDER = true;
