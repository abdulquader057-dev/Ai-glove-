export function getFeatureNames() {
  return [
    'flex_thumb',
    'flex_index',
    'flex_middle',
    'flex_ring',
    'flex_pinky',
    'imu_x',
    'imu_y',
    'imu_z'
  ];
}

export function extractFeatures(sensorData) {
  if (!sensorData || !sensorData.flex || !sensorData.imu) {
    return Array(8).fill(0);
  }
  
  return [
    sensorData.flex.thumb,
    sensorData.flex.index,
    sensorData.flex.middle,
    sensorData.flex.ring,
    sensorData.flex.pinky,
    sensorData.imu.x,
    sensorData.imu.y,
    sensorData.imu.z
  ];
}

export function extractWindowedFeatures(sensorBuffer, windowSize = 10) {
  if (!sensorBuffer || !Array.isArray(sensorBuffer) || sensorBuffer.length === 0) {
    return Array(8 * 4).fill(0); // 8 features * 4 stats (mean, std, min, max)
  }

  const buf = sensorBuffer.slice(-windowSize);
  const n = buf.length;
  
  const featuresList = buf.map(data => extractFeatures(data));
  const numFeatures = featuresList[0].length;
  
  const windowedFeatures = [];
  
  for (let i = 0; i < numFeatures; i++) {
    const values = featuresList.map(f => f[i]);
    
    // Mean
    const mean = values.reduce((sum, val) => sum + val, 0) / n;
    
    // Min & Max
    const min = Math.min(...values);
    const max = Math.max(...values);
    
    // Standard Deviation
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n;
    const std = Math.sqrt(variance);
    
    windowedFeatures.push(mean, std, min, max);
  }
  
  return windowedFeatures;
}
