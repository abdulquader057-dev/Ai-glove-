import { $, on } from '../utils/dom.js';
import { eventBus } from '../utils/events.js';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

// Store scene instances so we can update them later
const scenesMap = new Map();

export function renderHolographicHand({ size = 'large', interactive = false, showGesture = true, id = 'demo-hand' } = {}) {
  return `
    <div id="${id}" class="holographic-hand-container size-${size} ${interactive ? 'interactive' : ''}">
      <!-- Three.js canvas will be injected here -->
      ${showGesture ? `
        <div class="gesture-overlay">
          <span class="gesture-name text-glow flex items-center gap-2">
            <i data-lucide="activity" style="width: 16px; height: 16px;"></i> System Ready
          </span>
          <span class="gesture-confidence"></span>
        </div>
      ` : ''}
    </div>
  `;
}

export function initHolographicHand(containerId) {
  const container = $(`#${containerId}`);
  if (!container) return;
  
  if (scenesMap.has(containerId)) return;

  const width = container.clientWidth || 300;
  const height = container.clientHeight || 400;

  // Scene setup
  const scene = new THREE.Scene();
  // Don't set background color so it stays transparent, or set a very dark fog
  scene.fog = new THREE.FogExp2(0x0a0a0f, 0.05);
  
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.set(0, 5, 22);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.toneMapping = THREE.ReinhardToneMapping;
  
  // Clean up any existing canvas elements first
  const existingCanvas = container.querySelector('canvas');
  if (existingCanvas) existingCanvas.remove();
  
  container.insertBefore(renderer.domElement, container.firstChild);

  // Post-Processing (Neon Bloom)
  const renderScene = new RenderPass(scene, camera);
  // Optional: clear background
  renderScene.clearColor = new THREE.Color(0x000000);
  renderScene.clearAlpha = 0; // maintain transparency

  const bloomPass = new UnrealBloomPass(new THREE.Vector2(width, height), 2.5, 0.5, 0.1);
  bloomPass.tintColor = new THREE.Color(0x00f0ff);

  const composer = new EffectComposer(renderer);
  composer.addPass(renderScene);
  composer.addPass(bloomPass);

  // Materials
  const neonMaterial = new THREE.MeshBasicMaterial({ 
    color: 0x00f0ff,
    transparent: true,
    opacity: 0.9,
    wireframe: false
  });
  
  const palmMaterial = new THREE.MeshBasicMaterial({
    color: 0x8b5cf6,
    transparent: true,
    opacity: 0.3,
    wireframe: true
  });

  // Hand Group
  const handGroup = new THREE.Group();
  scene.add(handGroup);

  // Palm
  const palmGeo = new THREE.BoxGeometry(5, 5.5, 0.8);
  const palm = new THREE.Mesh(palmGeo, palmMaterial);
  // Add inner solid palm
  const palmSolidGeo = new THREE.BoxGeometry(4.8, 5.3, 0.6);
  const palmSolid = new THREE.Mesh(palmSolidGeo, new THREE.MeshBasicMaterial({ color: 0x000000, opacity: 0.8, transparent: true }));
  palm.add(palmSolid);
  
  // Shift palm so wrist is near origin
  palm.position.y = 2.75;
  handGroup.add(palm);

  // Finger configs
  // Each has base position, lengths of 3 segments, and thickness
  const fingerConfigs = {
    thumb: { x: -3.2, y: 1.5, z: 1.0, lengths: [1.8, 1.4, 1.2], thick: 0.4 },
    index: { x: -1.8, y: 5.5, z: 0, lengths: [2.0, 1.5, 1.2], thick: 0.35 },
    middle: { x: 0, y: 5.7, z: 0, lengths: [2.2, 1.6, 1.3], thick: 0.35 },
    ring: { x: 1.8, y: 5.5, z: 0, lengths: [2.0, 1.5, 1.2], thick: 0.35 },
    pinky: { x: 3.2, y: 5.0, z: 0, lengths: [1.5, 1.2, 1.0], thick: 0.3 }
  };

  const fingers = {};

  // Initialize empty meshes for fingers
  for (const [name, config] of Object.entries(fingerConfigs)) {
    const mesh = new THREE.Mesh(new THREE.BufferGeometry(), neonMaterial);
    handGroup.add(mesh);
    fingers[name] = { mesh, config, currentFlex: 0, targetFlex: 0 };
  }

  // Floating Hologram Particles
  const particlesGeo = new THREE.BufferGeometry();
  const particleCount = 150;
  const posArray = new Float32Array(particleCount * 3);
  for(let i=0; i<particleCount*3; i++) {
    posArray[i] = (Math.random() - 0.5) * 30;
  }
  particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  const particlesMat = new THREE.PointsMaterial({
    size: 0.15,
    color: 0x8b5cf6,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending
  });
  const particlesMesh = new THREE.Points(particlesGeo, particlesMat);
  scene.add(particlesMesh);

  // Function to regenerate finger geometry based on flex
  const updateFingerGeometry = (fingerData, isThumb) => {
    const { mesh, config, currentFlex } = fingerData;
    
    let maxBend = Math.PI / 2.2;
    if (isThumb) maxBend = Math.PI / 4;
    
    const angle = currentFlex * maxBend;
    
    // Calculate forward kinematics
    const points = [];
    let curPos = new THREE.Vector3(config.x, config.y, config.z);
    points.push(curPos.clone());
    
    let currentAngleX = 0;
    let currentAngleZ = isThumb ? Math.PI / 6 : 0; // Thumb sticks out sideways
    
    // Base joint
    currentAngleX += angle;
    curPos.add(new THREE.Vector3(
      config.lengths[0] * Math.sin(currentAngleZ),
      config.lengths[0] * Math.cos(currentAngleX),
      config.lengths[0] * Math.sin(currentAngleX)
    ));
    points.push(curPos.clone());
    
    // Mid joint
    currentAngleX += angle;
    curPos.add(new THREE.Vector3(
      config.lengths[1] * Math.sin(currentAngleZ),
      config.lengths[1] * Math.cos(currentAngleX),
      config.lengths[1] * Math.sin(currentAngleX)
    ));
    points.push(curPos.clone());
    
    // Tip joint
    currentAngleX += angle;
    curPos.add(new THREE.Vector3(
      config.lengths[2] * Math.sin(currentAngleZ),
      config.lengths[2] * Math.cos(currentAngleX),
      config.lengths[2] * Math.sin(currentAngleX)
    ));
    points.push(curPos.clone());
    
    // Create smooth curve
    const curve = new THREE.CatmullRomCurve3(points);
    const geometry = new THREE.TubeGeometry(curve, 20, config.thick, 8, false);
    
    // Dispose old geometry
    if (mesh.geometry) mesh.geometry.dispose();
    mesh.geometry = geometry;
  };

  // Initial draw
  for (const [name, data] of Object.entries(fingers)) {
    updateFingerGeometry(data, name === 'thumb');
  }

  const state = {
    handGroup,
    fingers,
    particlesMesh,
    composer,
    renderer,
    camera,
    scene,
    targetRotation: { x: 0, y: 0, z: 0 },
    currentRotation: { x: 0, y: 0, z: 0 },
    animationId: null
  };
  
  scenesMap.set(containerId, state);

  const resizeObserver = new ResizeObserver(() => {
    if (container.clientWidth === 0) return;
    const newW = container.clientWidth;
    const newH = container.clientHeight;
    renderer.setSize(newW, newH);
    composer.setSize(newW, newH);
    camera.aspect = newW / newH;
    camera.updateProjectionMatrix();
  });
  resizeObserver.observe(container);

  const animate = () => {
    state.animationId = requestAnimationFrame(animate);

    // Interpolate IMU rotation
    state.currentRotation.x += (state.targetRotation.x - state.currentRotation.x) * 0.1;
    state.currentRotation.y += (state.targetRotation.y - state.currentRotation.y) * 0.1;
    state.currentRotation.z += (state.targetRotation.z - state.currentRotation.z) * 0.1;
    
    const time = Date.now() * 0.001;
    
    // Breathing/floating
    handGroup.position.y = Math.sin(time * 1.5) * 0.5 - 2; 
    
    handGroup.rotation.x = state.currentRotation.x;
    handGroup.rotation.y = state.currentRotation.y + Math.sin(time * 0.5) * 0.15;
    handGroup.rotation.z = state.currentRotation.z;
    
    // Slowly rotate particles
    particlesMesh.rotation.y = time * 0.05;

    // Interpolate finger flexes
    let needsUpdate = false;
    for (const [name, data] of Object.entries(state.fingers)) {
      const diff = data.targetFlex - data.currentFlex;
      if (Math.abs(diff) > 0.01) {
        data.currentFlex += diff * 0.2; // smoothing
        updateFingerGeometry(data, name === 'thumb');
      }
    }

    composer.render();
  };
  
  animate();

  const onSensorUpdate = (data) => updateHandSensors(data, containerId);
  const onGesture = (data) => updateGestureDisplay(data.gesture, data.confidence, container);

  eventBus.on('sensor-update', onSensorUpdate);
  eventBus.on('gesture-detected', onGesture);
  
  container._cleanup3D = () => {
    cancelAnimationFrame(state.animationId);
    resizeObserver.disconnect();
    eventBus.off('sensor-update', onSensorUpdate);
    eventBus.off('gesture-detected', onGesture);
    renderer.dispose();
    scenesMap.delete(containerId);
  };
}

export function updateHandSensors(sensorData, containerId) {
  const state = scenesMap.get(containerId);
  if (!state) return;
  
  const flexData = sensorData.flex || [];
  const imuData = sensorData.imu || {};
  
  const getFlex = (idx) => {
    let val = flexData[idx] !== undefined ? flexData[idx] : 0;
    if (val > 2) val = val / 1023;
    return Math.max(0, Math.min(1, val));
  };

  const map = {
    thumb: getFlex(0),
    index: getFlex(1),
    middle: getFlex(2),
    ring: getFlex(3),
    pinky: getFlex(4)
  };

  // Update target flexes
  for (const [fingerName, value] of Object.entries(map)) {
    if (state.fingers[fingerName]) {
      state.fingers[fingerName].targetFlex = value;
    }
  }

  // Animate IMU
  if (imuData.ax !== undefined) {
    state.targetRotation.x = (imuData.ay || 0) * 0.3; 
    state.targetRotation.y = (imuData.ax || 0) * 0.3;
    state.targetRotation.z = (imuData.az || 0) * 0.2;
  }
}

export function updateGestureDisplay(gesture, confidence, container) {
  if (!container) return;
  const nameEl = $('.gesture-name', container);
  const confEl = $('.gesture-confidence', container);
  
  if (nameEl) nameEl.textContent = gesture;
  if (confEl && confidence !== undefined) {
    confEl.textContent = `${(confidence * 100).toFixed(0)}%`;
  }
}
