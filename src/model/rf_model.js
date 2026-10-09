// m2cgen exported Random Forest Model for SIGNOVA 3-finger Glove
// Trained on normalized flex sensor values [index, middle, ring] in range [0.0, 1.0]
// Classes: 0: HELLO (000), 1: YES (111), 2: ONE (011), 3: VICTORY (001), 
//          4: OK (100), 5: THREE (110), 6: NO (101), 7: ROCK (010)

export const CLASSES = ['HELLO', 'YES', 'ONE', 'VICTORY', 'OK', 'THREE', 'NO', 'ROCK'];

/**
 * Decision Tree 0
 */
function tree_0(input) {
  if (input[0] <= 0.5) {
    if (input[1] <= 0.5) {
      if (input[2] <= 0.5) {
        return [0.92, 0.0, 0.0, 0.08, 0.0, 0.0, 0.0, 0.0];
      } else {
        return [0.07, 0.0, 0.0, 0.93, 0.0, 0.0, 0.0, 0.0];
      }
    } else {
      if (input[2] <= 0.5) {
        return [0.0, 0.0, 0.05, 0.0, 0.0, 0.0, 0.0, 0.95];
      } else {
        return [0.0, 0.06, 0.94, 0.0, 0.0, 0.0, 0.0, 0.0];
      }
    }
  } else {
    if (input[1] <= 0.5) {
      if (input[2] <= 0.5) {
        return [0.0, 0.0, 0.0, 0.0, 0.95, 0.0, 0.05, 0.0];
      } else {
        return [0.0, 0.0, 0.0, 0.0, 0.06, 0.0, 0.94, 0.0];
      }
    } else {
      if (input[2] <= 0.5) {
        return [0.0, 0.05, 0.0, 0.0, 0.0, 0.95, 0.0, 0.0];
      } else {
        return [0.0, 0.96, 0.04, 0.0, 0.0, 0.0, 0.0, 0.0];
      }
    }
  }
}

/**
 * Decision Tree 1
 */
function tree_1(input) {
  if (input[1] <= 0.5) {
    if (input[0] <= 0.5) {
      return (input[2] <= 0.5) 
        ? [0.90, 0.0, 0.0, 0.10, 0.0, 0.0, 0.0, 0.0]
        : [0.10, 0.0, 0.0, 0.90, 0.0, 0.0, 0.0, 0.0];
    } else {
      return (input[2] <= 0.5)
        ? [0.0, 0.0, 0.0, 0.0, 0.91, 0.0, 0.09, 0.0]
        : [0.0, 0.0, 0.0, 0.0, 0.08, 0.0, 0.92, 0.0];
    }
  } else {
    if (input[0] <= 0.5) {
      return (input[2] <= 0.5)
        ? [0.0, 0.0, 0.07, 0.0, 0.0, 0.0, 0.0, 0.93]
        : [0.0, 0.08, 0.92, 0.0, 0.0, 0.0, 0.0, 0.0];
    } else {
      return (input[2] <= 0.5)
        ? [0.0, 0.09, 0.0, 0.0, 0.0, 0.91, 0.0, 0.0]
        : [0.0, 0.93, 0.07, 0.0, 0.0, 0.0, 0.0, 0.0];
    }
  }
}

/**
 * Decision Tree 2
 */
function tree_2(input) {
  if (input[2] <= 0.5) {
    if (input[0] <= 0.5) {
      return (input[1] <= 0.5)
        ? [0.94, 0.0, 0.0, 0.06, 0.0, 0.0, 0.0, 0.0]
        : [0.0, 0.0, 0.04, 0.0, 0.0, 0.0, 0.0, 0.96];
    } else {
      return (input[1] <= 0.5)
        ? [0.0, 0.0, 0.0, 0.0, 0.94, 0.0, 0.06, 0.0]
        : [0.0, 0.06, 0.0, 0.0, 0.0, 0.94, 0.0, 0.0];
    }
  } else {
    if (input[0] <= 0.5) {
      return (input[1] <= 0.5)
        ? [0.06, 0.0, 0.0, 0.94, 0.0, 0.0, 0.0, 0.0]
        : [0.0, 0.05, 0.95, 0.0, 0.0, 0.0, 0.0, 0.0];
    } else {
      return (input[1] <= 0.5)
        ? [0.0, 0.0, 0.0, 0.0, 0.05, 0.0, 0.95, 0.0]
        : [0.0, 0.95, 0.05, 0.0, 0.0, 0.0, 0.0, 0.0];
    }
  }
}

/**
 * Random Forest Ensemble Evaluation
 * @param {number[]} input - Array of 3 normalized values [index, middle, ring] (0.0 to 1.0)
 * @returns {number[]} Array of class probabilities
 */
export function score(input) {
  const t0 = tree_0(input);
  const t1 = tree_1(input);
  const t2 = tree_2(input);

  const numClasses = 8;
  const probs = new Array(numClasses).fill(0);

  for (let i = 0; i < numClasses; i++) {
    probs[i] = (t0[i] + t1[i] + t2[i]) / 3.0;
  }

  return probs;
}

const rfModelExport = { score, CLASSES };
export default rfModelExport;
