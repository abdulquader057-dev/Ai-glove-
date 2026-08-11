let customParser = null;

export function setParserFunction(fn) {
  customParser = fn;
}

export function parseSensorPacket(dataView) {
  if (customParser) {
    return customParser(dataView);
  }
  
  // Default parser assuming 8 Float32 values (5 flex, 3 IMU) in little-endian format
  if (!dataView || dataView.byteLength < 32) {
    return null;
  }
  
  return {
    flex: {
      thumb: dataView.getFloat32(0, true),
      index: dataView.getFloat32(4, true),
      middle: dataView.getFloat32(8, true),
      ring: dataView.getFloat32(12, true),
      pinky: dataView.getFloat32(16, true)
    },
    imu: {
      x: dataView.getFloat32(20, true),
      y: dataView.getFloat32(24, true),
      z: dataView.getFloat32(28, true)
    },
    timestamp: Date.now()
  };
}

export function validateSensorData(data) {
  const errors = [];
  let valid = true;

  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['Data is not an object'] };
  }

  if (!data.flex || typeof data.flex !== 'object') {
    valid = false;
    errors.push('Missing or invalid flex data');
  } else {
    ['thumb', 'index', 'middle', 'ring', 'pinky'].forEach(finger => {
      if (typeof data.flex[finger] !== 'number' || isNaN(data.flex[finger])) {
        valid = false;
        errors.push(`Invalid flex value for ${finger}`);
      }
    });
  }

  if (!data.imu || typeof data.imu !== 'object') {
    valid = false;
    errors.push('Missing or invalid IMU data');
  } else {
    ['x', 'y', 'z'].forEach(axis => {
      if (typeof data.imu[axis] !== 'number' || isNaN(data.imu[axis])) {
        valid = false;
        errors.push(`Invalid IMU value for ${axis}`);
      }
    });
  }

  return { valid, errors };
}

export function normalizeSensorData(raw) {
  // Assuming raw flex values need normalization to 0-1 range
  // and IMU to -1 to 1 range (these would ideally be calibrated)
  
  const clamp = (val, min, max) => Math.min(Math.max(val, min), max);
  
  // These min/max bounds would ideally come from calibration service
  const flexMin = 0.0;
  const flexMax = 1.0;
  const imuMin = -2.0; 
  const imuMax = 2.0;

  const normalizeRange = (val, min, max, targetMin, targetMax) => {
    const normalized = (val - min) / (max - min);
    return targetMin + (normalized * (targetMax - targetMin));
  };

  return {
    flex: {
      thumb: clamp(normalizeRange(raw.flex.thumb, flexMin, flexMax, 0, 1), 0, 1),
      index: clamp(normalizeRange(raw.flex.index, flexMin, flexMax, 0, 1), 0, 1),
      middle: clamp(normalizeRange(raw.flex.middle, flexMin, flexMax, 0, 1), 0, 1),
      ring: clamp(normalizeRange(raw.flex.ring, flexMin, flexMax, 0, 1), 0, 1),
      pinky: clamp(normalizeRange(raw.flex.pinky, flexMin, flexMax, 0, 1), 0, 1)
    },
    imu: {
      x: clamp(normalizeRange(raw.imu.x, imuMin, imuMax, -1, 1), -1, 1),
      y: clamp(normalizeRange(raw.imu.y, imuMin, imuMax, -1, 1), -1, 1),
      z: clamp(normalizeRange(raw.imu.z, imuMin, imuMax, -1, 1), -1, 1)
    },
    timestamp: raw.timestamp || Date.now()
  };
}
