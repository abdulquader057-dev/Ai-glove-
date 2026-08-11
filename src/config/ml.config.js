// ──────────────────────────────────────────────
// AI GLOVE — ML Model Configuration
// ──────────────────────────────────────────────
//
// HOW TO CONNECT A REAL ML MODEL:
// 1. Choose an adapter type in ML_CONFIG.activeAdapter
// 2. For 'local-python': Set apiEndpoint to your Python inference server
// 3. For 'onnx': Place ONNX model file in public/ and set modelPath
// 4. For 'tfjs': Place TF.js model files in public/ and set modelPath
// 5. Update MODEL_STATUS fields with actual evaluation results
//
// The SimulationML adapter is used by default for development.
// ──────────────────────────────────────────────

export const ML_CONFIG = {
  // ── Active Model Adapter ──
  // Options: 'simulation' | 'local-python' | 'onnx' | 'tfjs'
  activeAdapter: 'simulation',

  // ── Model Information ──
  model: {
    name: 'Not Finalized',
    type: null,  // 'random-forest' | 'svm' | 'neural-network' | etc.
    version: null,
    status: 'AWAITING_MODEL',  // 'AWAITING_MODEL' | 'TRAINING' | 'READY' | 'DEPLOYED'
    description: 'The final ML model has not been selected. Possible lightweight candidates include Random Forest and SVM.',
  },

  // ── Possible Model Candidates ──
  possibleModels: [
    {
      name: 'Random Forest',
      type: 'random-forest',
      description: 'Ensemble of decision trees. Provides class probabilities for confidence estimation.',
      pros: ['Interpretable', 'Handles noisy data well', 'Provides feature importance', 'Fast inference'],
      cons: ['May require feature engineering', 'Larger model size with many trees'],
    },
    {
      name: 'Support Vector Machine (SVM)',
      type: 'svm',
      description: 'Finds optimal decision boundaries between gesture classes.',
      pros: ['Effective in high-dimensional spaces', 'Memory efficient', 'Works well with small datasets'],
      cons: ['Slower training on large datasets', 'Less intuitive confidence scores'],
    },
  ],

  // ── ML Deployment Location ──
  deployment: {
    current: 'PC',  // Initial plan: ML runs on the connected PC
    future: 'Evaluate on-device inference on XIAO nRF52840 Sense',
    note: 'The final ML deployment location is not finalized. Initial development runs inference on the connected device. On-device inference will be evaluated later.',
  },

  // ── Feature Configuration ──
  features: {
    inputs: [
      { name: 'flex_thumb', source: 'flex', description: 'Thumb flex sensor reading' },
      { name: 'flex_index', source: 'flex', description: 'Index finger flex sensor reading' },
      { name: 'flex_middle', source: 'flex', description: 'Middle finger flex sensor reading' },
      { name: 'flex_ring', source: 'flex', description: 'Ring finger flex sensor reading' },
      { name: 'flex_pinky', source: 'flex', description: 'Pinky finger flex sensor reading' },
      { name: 'imu_x', source: 'imu', description: 'IMU X-axis reading' },
      { name: 'imu_y', source: 'imu', description: 'IMU Y-axis reading' },
      { name: 'imu_z', source: 'imu', description: 'IMU Z-axis reading' },
    ],
    totalInputs: 8,
    outputType: 'gesture_class',
    description: '5 flex sensor values + 3 IMU axis readings → gesture classification',
  },

  // ── Adapter-specific Configuration ──
  adapters: {
    'local-python': {
      apiEndpoint: null,  // TBD — e.g., 'http://localhost:5000/predict'
      timeout: 5000,
    },
    'onnx': {
      modelPath: null,    // TBD — e.g., '/models/gesture_model.onnx'
    },
    'tfjs': {
      modelPath: null,    // TBD — e.g., '/models/gesture_model/model.json'
    },
  },
};

// ── Model Evaluation Metrics ──
// All initially awaiting evaluation — update with actual results
export const MODEL_METRICS = {
  accuracy: { value: null, label: 'Accuracy', status: 'Awaiting evaluation' },
  precision: { value: null, label: 'Precision', status: 'Awaiting evaluation' },
  recall: { value: null, label: 'Recall', status: 'Awaiting evaluation' },
  f1Score: { value: null, label: 'F1 Score', status: 'Awaiting evaluation' },
  confusionMatrix: null,  // 2D array when available
};

// ── Dataset Metadata ──
// Only metadata exposed — full dataset stays in project storage
export const DATASET_INFO = {
  gestureClasses: 10,       // matches GESTURES.length
  sensorTypes: ['Flex Sensors (5)', 'IMU 6-axis (3 accel/gyro values used)'],
  inputFeatures: 8,
  trainingPipeline: 'Data collection → Preprocessing → Feature extraction → Model training → Evaluation',
  status: 'Collection In Progress',
  note: 'The full training dataset is stored in project storage and is not exposed on the public website.',
};
