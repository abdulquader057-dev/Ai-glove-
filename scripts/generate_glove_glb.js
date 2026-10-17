// Generator script to build the high-fidelity cybernetic AI Glove GLB model
// Saved to public/models/glove.glb

global.FileReader = class {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((buf) => {
      this.result = buf;
      if (this.onload) this.onload();
      if (this.onloadend) this.onloadend();
    });
  }
  readAsDataURL(blob) {
    blob.arrayBuffer().then((buf) => {
      this.result = 'data:application/octet-stream;base64,' + Buffer.from(buf).toString('base64');
      if (this.onload) this.onload();
      if (this.onloadend) this.onloadend();
    });
  }
};

const fs = require('fs');
const path = require('path');
const THREE = require('three');
const { GLTFExporter } = require('three/examples/jsm/exporters/GLTFExporter.js');

const scene = new THREE.Scene();
const rootGroup = new THREE.Group();
rootGroup.name = "AIGloveRoot";
scene.add(rootGroup);

// Materials
const carbonFabric = new THREE.MeshStandardMaterial({
  color: 0x12161f,
  roughness: 0.65,
  metalness: 0.25,
});

const titaniumPlate = new THREE.MeshStandardMaterial({
  color: 0x222a36,
  roughness: 0.35,
  metalness: 0.85,
});

const flexRibbon = new THREE.MeshStandardMaterial({
  color: 0x00f2a6,
  emissive: 0x00f2a6,
  emissiveIntensity: 0.8,
  roughness: 0.2,
  metalness: 0.8,
});

const pcbBoard = new THREE.MeshStandardMaterial({
  color: 0x0e2a22,
  roughness: 0.4,
  metalness: 0.6,
});

const goldContacts = new THREE.MeshStandardMaterial({
  color: 0xffd700,
  roughness: 0.2,
  metalness: 0.95,
});

const batteryMat = new THREE.MeshStandardMaterial({
  color: 0x1f242e,
  roughness: 0.5,
  metalness: 0.4,
});

const cyanGlow = new THREE.MeshStandardMaterial({
  color: 0x00d2ff,
  emissive: 0x00d2ff,
  emissiveIntensity: 1.2,
  roughness: 0.1,
  metalness: 0.9,
});

// 1. Palm Base (Anatomical Chassis)
const palmGeo = new THREE.BoxGeometry(1.6, 1.9, 0.45);
const palmMesh = new THREE.Mesh(palmGeo, carbonFabric);
palmMesh.name = "PalmChassis";
palmMesh.position.set(0, 0, 0);
rootGroup.add(palmMesh);

// Palm Dorsal Shield Plate
const plateGeo = new THREE.BoxGeometry(1.4, 1.5, 0.1);
const plateMesh = new THREE.Mesh(plateGeo, titaniumPlate);
plateMesh.name = "DorsalPlate";
plateMesh.position.set(0, -0.1, 0.25);
rootGroup.add(plateMesh);

// 2. Wrist Cuff & Controller Assembly
const wristGeo = new THREE.CylinderGeometry(0.85, 0.9, 0.9, 32);
const wristMesh = new THREE.Mesh(wristGeo, carbonFabric);
wristMesh.name = "WristCuff";
wristMesh.position.set(0, -1.35, 0);
rootGroup.add(wristMesh);

// PCB Microcontroller Housing (ESP32-S3 / Xiao)
const pcbGeo = new THREE.BoxGeometry(0.85, 0.65, 0.12);
const pcbMesh = new THREE.Mesh(pcbGeo, pcbBoard);
pcbMesh.name = "ESP32_MCU_PCB";
pcbMesh.position.set(0, -1.35, 0.52);
rootGroup.add(pcbMesh);

// Microcontroller IC Chip
const chipGeo = new THREE.BoxGeometry(0.35, 0.35, 0.08);
const chipMesh = new THREE.Mesh(chipGeo, titaniumPlate);
chipMesh.name = "MCU_IC_Core";
chipMesh.position.set(0, -1.35, 0.6);
rootGroup.add(chipMesh);

// Status LED Diode
const ledGeo = new THREE.BoxGeometry(0.08, 0.08, 0.06);
const ledMesh = new THREE.Mesh(ledGeo, cyanGlow);
ledMesh.name = "StatusLED";
ledMesh.position.set(0.3, -1.2, 0.6);
rootGroup.add(ledMesh);

// Battery Housing (3.7V LiPo)
const battGeo = new THREE.BoxGeometry(0.95, 0.75, 0.2);
const battMesh = new THREE.Mesh(battGeo, batteryMat);
battMesh.name = "BatteryCore_LiPo";
battMesh.position.set(0, -1.35, -0.52);
rootGroup.add(battMesh);

// 3. Fingers Creation Function
function createFinger(name, posX, length, angleZ = 0) {
  const fingerGroup = new THREE.Group();
  fingerGroup.name = name;
  fingerGroup.position.set(posX, 0.95, 0);
  fingerGroup.rotation.z = angleZ;

  const segLen = length / 3;
  
  // Proximal Segment
  const proxGeo = new THREE.CapsuleGeometry(0.14, segLen, 8, 16);
  const proxMesh = new THREE.Mesh(proxGeo, carbonFabric);
  proxMesh.position.set(0, segLen / 2, 0);
  fingerGroup.add(proxMesh);

  // Proximal Flex Ribbon strip
  const proxFlexGeo = new THREE.BoxGeometry(0.09, segLen * 0.9, 0.04);
  const proxFlexMesh = new THREE.Mesh(proxFlexGeo, flexRibbon);
  proxFlexMesh.position.set(0, segLen / 2, 0.15);
  fingerGroup.add(proxFlexMesh);

  // Intermediate Segment
  const midGroup = new THREE.Group();
  midGroup.position.set(0, segLen, 0);
  const midGeo = new THREE.CapsuleGeometry(0.13, segLen * 0.9, 8, 16);
  const midMesh = new THREE.Mesh(midGeo, carbonFabric);
  midMesh.position.set(0, (segLen * 0.9) / 2, 0);
  midGroup.add(midMesh);

  const midFlexGeo = new THREE.BoxGeometry(0.08, segLen * 0.8, 0.04);
  const midFlexMesh = new THREE.Mesh(midFlexGeo, flexRibbon);
  midFlexMesh.position.set(0, (segLen * 0.9) / 2, 0.14);
  midGroup.add(midFlexMesh);

  // Distal Segment (Fingertip)
  const distGroup = new THREE.Group();
  distGroup.position.set(0, segLen * 0.9, 0);
  const distGeo = new THREE.CapsuleGeometry(0.12, segLen * 0.75, 8, 16);
  const distMesh = new THREE.Mesh(distGeo, titaniumPlate);
  distMesh.position.set(0, (segLen * 0.75) / 2, 0);
  distGroup.add(distMesh);

  const tipSensorGeo = new THREE.BoxGeometry(0.07, 0.15, 0.04);
  const tipSensorMesh = new THREE.Mesh(tipSensorGeo, cyanGlow);
  tipSensorMesh.position.set(0, (segLen * 0.75) * 0.6, 0.13);
  distGroup.add(tipSensorMesh);

  midGroup.add(distGroup);
  fingerGroup.add(midGroup);
  rootGroup.add(fingerGroup);
}

// Create 4 main fingers
createFinger("Finger_Index", -0.52, 1.25, 0.04);
createFinger("Finger_Middle", -0.18, 1.38, 0.0);
createFinger("Finger_Ring", 0.18, 1.28, -0.03);
createFinger("Finger_Pinky", 0.52, 1.05, -0.08);

// Create Thumb Assembly
const thumbGroup = new THREE.Group();
thumbGroup.name = "Finger_Thumb";
thumbGroup.position.set(-0.85, -0.2, 0.05);
thumbGroup.rotation.set(0.3, 0.4, 0.75);

const thumbProxGeo = new THREE.CapsuleGeometry(0.16, 0.55, 8, 16);
const thumbProxMesh = new THREE.Mesh(thumbProxGeo, carbonFabric);
thumbProxMesh.position.set(0, 0.3, 0);
thumbGroup.add(thumbProxMesh);

const thumbFlexGeo = new THREE.BoxGeometry(0.1, 0.45, 0.04);
const thumbFlexMesh = new THREE.Mesh(thumbFlexGeo, flexRibbon);
thumbFlexMesh.position.set(0, 0.3, 0.17);
thumbGroup.add(thumbFlexMesh);

const thumbDistGroup = new THREE.Group();
thumbDistGroup.position.set(0, 0.55, 0);

const thumbDistGeo = new THREE.CapsuleGeometry(0.15, 0.48, 8, 16);
const thumbDistMesh = new THREE.Mesh(thumbDistGeo, titaniumPlate);
thumbDistMesh.position.set(0, 0.25, 0);
thumbDistGroup.add(thumbDistMesh);

thumbGroup.add(thumbDistGroup);
rootGroup.add(thumbGroup);

// Export binary GLB
const exporter = new GLTFExporter();
exporter.parse(
  scene,
  (res) => {
    if (res instanceof ArrayBuffer) {
      const targetPath = path.join(process.cwd(), 'public', 'models', 'glove.glb');
      fs.writeFileSync(targetPath, Buffer.from(res));
      console.log('Successfully generated public/models/glove.glb! Size:', fs.statSync(targetPath).size, 'bytes');
    }
  },
  (err) => {
    console.error('Export error:', err);
  },
  { binary: true }
);
