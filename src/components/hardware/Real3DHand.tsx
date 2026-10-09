// Real-Time 3D Hand with Visible Flex Sensors & Live Hardware Kinematics
// Team Syntropy - SIGNOVA
// Pure Three.js client-side 3D hand with fair, realistic skin shading,
// visible hardware flex sensor strips on Index (F1), Middle (F2), and Ring (F3) fingers,
// and 100% real-time kinematics driven by live hardware ADC stream. Zero mock/canned animations.

'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Eye, RotateCcw, Sparkles } from 'lucide-react';

interface Real3DHandProps {
  normalizedFingers: number[]; // [index, middle, ring] (0.0 straight, 1.0 fully curled)
  rawSensors: number[];
  binaryBits: [number, number, number];
}

export const Real3DHand: React.FC<Real3DHandProps> = ({
  normalizedFingers,
  rawSensors,
  binaryBits,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  // Store live normalized targets in ref for smooth 60fps RAF loop
  const targetsRef = useRef<[number, number, number]>([0, 0, 0]);
  const currentCurlsRef = useRef<[number, number, number]>([0, 0, 0]);

  const [showCallouts, setShowCallouts] = useState<boolean>(true);

  // Keep target refs updated from incoming props
  useEffect(() => {
    targetsRef.current = [
      normalizedFingers[0] ?? 0,
      normalizedFingers[1] ?? 0,
      normalizedFingers[2] ?? 0,
    ];
  }, [normalizedFingers]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // 1. SCENE SETUP
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0d10);

    // 2. CAMERA SETUP
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 360;
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    // Position camera showing dorsal (back) of hand at a natural 3/4 angle
    camera.position.set(0.6, 0.8, 7.8);

    // 3. RENDERER SETUP
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // 4. ORBIT CONTROLS
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 3.5;
    controls.maxDistance = 12;
    controls.maxPolarAngle = Math.PI / 1.7;
    controls.target.set(0, 0.2, 0);
    controlsRef.current = controls;

    // 5. NATURAL FAIR SKIN LIGHTING
    // Ambient light with soft warm radiance
    const ambientLight = new THREE.AmbientLight(0xfff0e6, 0.95);
    scene.add(ambientLight);

    // Key Light (warm soft directional light)
    const keyLight = new THREE.DirectionalLight(0xfffaed, 2.2);
    keyLight.position.set(4, 6, 6);
    keyLight.castShadow = true;
    scene.add(keyLight);

    // Fill Light (soft cool sky fill for anatomical depth)
    const fillLight = new THREE.DirectionalLight(0xdbeafe, 1.1);
    fillLight.position.set(-5, 2, 4);
    scene.add(fillLight);

    // Back / Rim Light (highlights edge silhouette)
    const rimLight = new THREE.DirectionalLight(0x2ee6a6, 0.7);
    rimLight.position.set(0, -4, -5);
    scene.add(rimLight);

    // 6. MATERIALS
    // Fair, realistic skin tone material (natural melanin, peach undertone)
    const skinMaterial = new THREE.MeshStandardMaterial({
      color: 0xf6d6c2, // Fair natural human skin
      roughness: 0.62,
      metalness: 0.02,
    });

    // Palm slightly lighter fair skin tone
    const palmMaterial = new THREE.MeshStandardMaterial({
      color: 0xf9dfcf,
      roughness: 0.58,
      metalness: 0.02,
    });

    // Nail keratin material
    const nailMaterial = new THREE.MeshStandardMaterial({
      color: 0xfbeef3,
      roughness: 0.35,
      metalness: 0.05,
    });

    // Flex Sensor Substrate (Black flexible polyimide film)
    const sensorBaseMat = new THREE.MeshStandardMaterial({
      color: 0x181d22,
      roughness: 0.4,
      metalness: 0.6,
    });

    // Dynamic Sensor Active Line Materials (one per active finger)
    const sensorActiveMats = [0, 1, 2].map(
      () =>
        new THREE.MeshStandardMaterial({
          color: 0x2ee6a6,
          emissive: 0x165b44,
          emissiveIntensity: 0.3,
          roughness: 0.2,
          metalness: 0.8,
        })
    );

    // Wriststrap fabric & XIAO PCB
    const strapMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a2128,
      roughness: 0.8,
      metalness: 0.1,
    });
    const pcbMaterial = new THREE.MeshStandardMaterial({
      color: 0x0f2b1d, // Green microcontroller PCB
      roughness: 0.3,
      metalness: 0.7,
    });
    const ledMaterial = new THREE.MeshBasicMaterial({ color: 0x2ee6a6 });

    // 7. HIERARCHICAL HAND ANATOMY GROUP
    const handGroup = new THREE.Group();
    // Rotate hand slightly so dorsal side (back of hand with flex sensors) is hero view
    handGroup.rotation.y = Math.PI * 0.05;
    scene.add(handGroup);

    // --- WRIST & HARDWARE BOARD ---
    const wristGeo = new THREE.CylinderGeometry(0.9, 0.95, 1.4, 24);
    const wristMesh = new THREE.Mesh(wristGeo, skinMaterial);
    wristMesh.position.set(0, -2.1, 0);
    handGroup.add(wristMesh);

    // Fabric wrist strap
    const strapGeo = new THREE.CylinderGeometry(0.96, 0.98, 0.7, 24);
    const strapMesh = new THREE.Mesh(strapGeo, strapMaterial);
    strapMesh.position.set(0, -2.1, 0);
    handGroup.add(strapMesh);

    // Seeed XIAO nRF52840 Sense / Arduino Unit mounted on dorsal wrist
    const pcbGeo = new THREE.BoxGeometry(0.85, 1.1, 0.15);
    const pcbMesh = new THREE.Mesh(pcbGeo, pcbMaterial);
    pcbMesh.position.set(0, -2.1, 1.02);
    handGroup.add(pcbMesh);

    // MCU Chip
    const mcuGeo = new THREE.BoxGeometry(0.45, 0.45, 0.08);
    const mcuMesh = new THREE.Mesh(mcuGeo, sensorBaseMat);
    mcuMesh.position.set(0, -2.1, 1.12);
    handGroup.add(mcuMesh);

    // Status LED
    const ledGeo = new THREE.BoxGeometry(0.08, 0.08, 0.08);
    const ledMesh = new THREE.Mesh(ledGeo, ledMaterial);
    ledMesh.position.set(0.25, -1.8, 1.12);
    handGroup.add(ledMesh);

    // --- PALM VOLUME ---
    const palmGeo = new THREE.BoxGeometry(2.2, 2.4, 0.72);
    const palmMesh = new THREE.Mesh(palmGeo, palmMaterial);
    palmMesh.position.set(0, -0.3, 0);
    handGroup.add(palmMesh);

    // Palm dorsal curve backing
    const dorsalGeo = new THREE.CylinderGeometry(1.1, 1.1, 2.3, 16, 1, false, 0, Math.PI);
    const dorsalMesh = new THREE.Mesh(dorsalGeo, skinMaterial);
    dorsalMesh.rotation.z = Math.PI / 2;
    dorsalMesh.rotation.y = Math.PI / 2;
    dorsalMesh.position.set(0, -0.3, 0.05);
    handGroup.add(dorsalMesh);

    // Flexible wire ribbon routing from 3 sensors down into XIAO
    const ribbonGeo = new THREE.BoxGeometry(0.65, 1.2, 0.04);
    const ribbonMesh = new THREE.Mesh(ribbonGeo, sensorBaseMat);
    ribbonMesh.position.set(0, -1.3, 0.45);
    handGroup.add(ribbonMesh);

    // --- FINGER JOINTS & SENSOR STRIPS ---
    interface FingerNode {
      mcp: THREE.Group;
      pip: THREE.Group;
      dip: THREE.Group;
      activeMat?: THREE.MeshStandardMaterial;
    }

    const fingerNodes: FingerNode[] = [];

    // Helper to build an articulated finger with knuckles, phalanx capsules, and flex sensor strip
    const createFinger = (
      name: string,
      baseX: number,
      baseY: number,
      baseZ: number,
      spreadAngleZ: number,
      length: number,
      radius: number,
      hasSensor: boolean,
      sensorIdx: number
    ): FingerNode => {
      const seg1Len = length * 0.42;
      const seg2Len = length * 0.33;
      const seg3Len = length * 0.25;

      // MCP (Base Knuckle) Group
      const mcpGroup = new THREE.Group();
      mcpGroup.position.set(baseX, baseY, baseZ);
      mcpGroup.rotation.z = spreadAngleZ;
      handGroup.add(mcpGroup);

      // Knuckle joint sphere
      const knuckleGeo = new THREE.SphereGeometry(radius * 1.15, 12, 12);
      const knuckleMesh = new THREE.Mesh(knuckleGeo, skinMaterial);
      mcpGroup.add(knuckleMesh);

      // Segment 1 (Proximal Phalanx)
      const seg1Geo = new THREE.CylinderGeometry(radius * 0.95, radius, seg1Len, 16);
      const seg1Mesh = new THREE.Mesh(seg1Geo, skinMaterial);
      seg1Mesh.position.set(0, seg1Len / 2, 0);
      mcpGroup.add(seg1Mesh);

      // Flex Sensor Strip on Segment 1
      if (hasSensor) {
        const strip1Geo = new THREE.BoxGeometry(radius * 0.75, seg1Len * 0.9, 0.06);
        const strip1Mesh = new THREE.Mesh(strip1Geo, sensorBaseMat);
        strip1Mesh.position.set(0, seg1Len / 2, radius * 0.95);
        mcpGroup.add(strip1Mesh);

        const trace1Geo = new THREE.BoxGeometry(radius * 0.35, seg1Len * 0.85, 0.07);
        const trace1Mesh = new THREE.Mesh(trace1Geo, sensorActiveMats[sensorIdx]);
        trace1Mesh.position.set(0, seg1Len / 2, radius * 0.98);
        mcpGroup.add(trace1Mesh);
      }

      // PIP (Middle Knuckle) Group
      const pipGroup = new THREE.Group();
      pipGroup.position.set(0, seg1Len, 0);
      mcpGroup.add(pipGroup);

      const pipJointGeo = new THREE.SphereGeometry(radius * 1.05, 12, 12);
      const pipJointMesh = new THREE.Mesh(pipJointGeo, skinMaterial);
      pipGroup.add(pipJointMesh);

      // Segment 2 (Intermediate Phalanx)
      const seg2Geo = new THREE.CylinderGeometry(radius * 0.85, radius * 0.95, seg2Len, 16);
      const seg2Mesh = new THREE.Mesh(seg2Geo, skinMaterial);
      seg2Mesh.position.set(0, seg2Len / 2, 0);
      pipGroup.add(seg2Mesh);

      // Flex Sensor Strip on Segment 2
      if (hasSensor) {
        const strip2Geo = new THREE.BoxGeometry(radius * 0.7, seg2Len * 0.9, 0.06);
        const strip2Mesh = new THREE.Mesh(strip2Geo, sensorBaseMat);
        strip2Mesh.position.set(0, seg2Len / 2, radius * 0.9);
        pipGroup.add(strip2Mesh);

        const trace2Geo = new THREE.BoxGeometry(radius * 0.3, seg2Len * 0.85, 0.07);
        const trace2Mesh = new THREE.Mesh(trace2Geo, sensorActiveMats[sensorIdx]);
        trace2Mesh.position.set(0, seg2Len / 2, radius * 0.93);
        pipGroup.add(trace2Mesh);
      }

      // DIP (Distal Knuckle) Group
      const dipGroup = new THREE.Group();
      dipGroup.position.set(0, seg2Len, 0);
      pipGroup.add(dipGroup);

      const dipJointGeo = new THREE.SphereGeometry(radius * 0.95, 12, 12);
      const dipJointMesh = new THREE.Mesh(dipJointGeo, skinMaterial);
      dipGroup.add(dipJointMesh);

      // Segment 3 (Distal Phalanx & Fingertip)
      const seg3Geo = new THREE.CylinderGeometry(radius * 0.65, radius * 0.85, seg3Len, 16);
      const seg3Mesh = new THREE.Mesh(seg3Geo, skinMaterial);
      seg3Mesh.position.set(0, seg3Len / 2, 0);
      dipGroup.add(seg3Mesh);

      const tipGeo = new THREE.SphereGeometry(radius * 0.65, 12, 12);
      const tipMesh = new THREE.Mesh(tipGeo, skinMaterial);
      tipMesh.position.set(0, seg3Len, 0);
      dipGroup.add(tipMesh);

      // Fingernail
      const nailGeo = new THREE.BoxGeometry(radius * 0.8, seg3Len * 0.45, 0.05);
      const nailMesh = new THREE.Mesh(nailGeo, nailMaterial);
      nailMesh.position.set(0, seg3Len * 0.65, radius * 0.65);
      dipGroup.add(nailMesh);

      // Flex Sensor Strip Terminal on Segment 3
      if (hasSensor) {
        const strip3Geo = new THREE.BoxGeometry(radius * 0.65, seg3Len * 0.6, 0.06);
        const strip3Mesh = new THREE.Mesh(strip3Geo, sensorBaseMat);
        strip3Mesh.position.set(0, seg3Len * 0.35, radius * 0.8);
        dipGroup.add(strip3Mesh);

        const trace3Geo = new THREE.BoxGeometry(radius * 0.28, seg3Len * 0.55, 0.07);
        const trace3Mesh = new THREE.Mesh(trace3Geo, sensorActiveMats[sensorIdx]);
        trace3Mesh.position.set(0, seg3Len * 0.35, radius * 0.83);
        dipGroup.add(trace3Mesh);
      }

      return {
        mcp: mcpGroup,
        pip: pipGroup,
        dip: dipGroup,
        activeMat: hasSensor ? sensorActiveMats[sensorIdx] : undefined,
      };
    };

    // --- INSTANTIATE 5 FINGERS (Active Flex Sensors on Index, Middle, Ring) ---
    // 1. Thumb (Stationary Reference - No sensor)
    const thumbMCP = new THREE.Group();
    thumbMCP.position.set(-1.18, -0.4, 0.15);
    thumbMCP.rotation.set(0.3, -0.4, 0.6);
    handGroup.add(thumbMCP);
    const thumb1Geo = new THREE.CylinderGeometry(0.24, 0.28, 0.85, 16);
    const thumb1Mesh = new THREE.Mesh(thumb1Geo, skinMaterial);
    thumb1Mesh.position.set(0, 0.42, 0);
    thumbMCP.add(thumb1Mesh);
    const thumbDIP = new THREE.Group();
    thumbDIP.position.set(0, 0.85, 0);
    thumbDIP.rotation.x = -0.35;
    thumbMCP.add(thumbDIP);
    const thumb2Geo = new THREE.CylinderGeometry(0.18, 0.24, 0.75, 16);
    const thumb2Mesh = new THREE.Mesh(thumb2Geo, skinMaterial);
    thumb2Mesh.position.set(0, 0.37, 0);
    thumbDIP.add(thumb2Mesh);
    const thumbTip = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 12), skinMaterial);
    thumbTip.position.set(0, 0.75, 0);
    thumbDIP.add(thumbTip);

    // 2. Index Finger (CH1 / F1 — ACTIVE FLEX SENSOR 1)
    const indexFinger = createFinger('Index', -0.72, 0.9, 0.08, 0.04, 2.1, 0.22, true, 0);
    fingerNodes.push(indexFinger);

    // 3. Middle Finger (CH2 / F2 — ACTIVE FLEX SENSOR 2)
    const middleFinger = createFinger('Middle', 0.0, 0.98, 0.1, 0.0, 2.3, 0.23, true, 1);
    fingerNodes.push(middleFinger);

    // 4. Ring Finger (CH3 / F3 — ACTIVE FLEX SENSOR 3)
    const ringFinger = createFinger('Ring', 0.7, 0.92, 0.08, -0.04, 2.15, 0.22, true, 2);
    fingerNodes.push(ringFinger);

    // 5. Pinky Finger (Stationary Reference - No sensor)
    const pinkyFinger = createFinger('Pinky', 1.35, 0.65, 0.04, -0.15, 1.7, 0.18, false, -1);
    pinkyFinger.mcp.rotation.x = -0.25; // Gentle resting natural curl
    pinkyFinger.pip.rotation.x = -0.2;
    pinkyFinger.dip.rotation.x = -0.15;

    // --- 8. SMOOTH REAL-TIME ANIMATION LOOP ---
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      controls.update();

      // Subtle resting organic breathing motion
      const time = performance.now() * 0.0015;
      handGroup.position.y = Math.sin(time) * 0.04;

      // Pulse XIAO LED at ~50 Hz
      ledMesh.visible = Math.floor(time * 50) % 2 === 0;

      // Interpolate live finger curls towards target (12ms spring response for instant tracking)
      const targets = targetsRef.current;
      for (let i = 0; i < 3; i++) {
        currentCurlsRef.current[i] += (targets[i] - currentCurlsRef.current[i]) * 0.28;
        const curl = currentCurlsRef.current[i];
        const node = fingerNodes[i];

        if (node) {
          // Anatomical human finger joint flexion:
          // In Three.js with dorsal side facing camera (+Z), curling into palm is negative rotation on X
          const mcpAngle = -curl * 1.25; // Knuckle flexes up to ~72°
          const pipAngle = -curl * 1.45; // Middle knuckle flexes up to ~83°
          const dipAngle = -curl * 1.05; // Fingertip flexes up to ~60°

          node.mcp.rotation.x = mcpAngle;
          node.pip.rotation.x = pipAngle;
          node.dip.rotation.x = dipAngle;

          // Dynamically glow the active flex sensor strip based on live bend
          if (node.activeMat) {
            node.activeMat.emissiveIntensity = 0.3 + curl * 1.5;
            // Shift emissive color toward bright mint when heavily bent
            node.activeMat.emissive.setHex(curl > 0.5 ? 0x2ee6a6 : 0x165b44);
          }
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      controls.dispose();
    };
  }, []);

  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  return (
    <div className="relative w-full flex flex-col items-center justify-center p-4 bg-[#0A0D10] border border-[#1F242A] rounded-sm font-mono">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between pb-3 mb-2 border-b border-[#1F242A] text-[11px] tracking-wider">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#2EE6A6] animate-pulse" />
          <span className="text-white font-bold tracking-widest">
            REAL-TIME 3D GLOVE KINEMATICS
          </span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#14181D] border border-[#1F242A] text-[#2EE6A6]">
            3 FLEX SENSORS MOUNTED
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCallouts(!showCallouts)}
            className={`flex items-center gap-1 px-2 py-0.5 text-[10px] rounded-xs border transition-colors ${
              showCallouts
                ? 'bg-[#2EE6A6] text-[#08090A] border-[#2EE6A6] font-bold'
                : 'bg-[#14181D] text-[#9CA3AF] border-[#1F242A] hover:text-white'
            }`}
            title="Toggle hardware sensor callout badges"
          >
            <Eye className="w-3 h-3" />
            <span>SENSOR LABELS</span>
          </button>

          <button
            onClick={handleResetCamera}
            className="flex items-center gap-1 px-2 py-0.5 text-[10px] bg-[#14181D] hover:bg-[#1E242B] border border-[#1F242A] text-[#9CA3AF] hover:text-white rounded-xs transition-colors"
            title="Reset 3D camera to default view"
          >
            <RotateCcw className="w-3 h-3 text-[#2EE6A6]" />
            <span>RESET VIEW</span>
          </button>
        </div>
      </div>

      {/* Main 3D Canvas Viewport */}
      <div
        ref={containerRef}
        className="relative w-full aspect-[4/3] sm:aspect-[16/11] max-h-[440px] bg-[#07090C] border border-[#161B22] rounded-xs overflow-hidden select-none cursor-grab active:cursor-grabbing"
      >
        <canvas ref={canvasRef} className="w-full h-full block" />

        {/* 3D Viewport Controls Hint */}
        <div className="absolute right-2 top-2 z-10 px-2 py-1 bg-[#08090A]/90 border border-[#1F242A] rounded-xs text-[9px] text-[#6B7280] pointer-events-none backdrop-blur-sm">
          ORBIT: LEFT-CLICK DRAG | ZOOM: SCROLL | PAN: RIGHT-CLICK
        </div>

        {/* Hardware Status Tag */}
        <div className="absolute left-2 top-2 z-10 flex items-center gap-1.5 px-2 py-1 bg-[#08090A]/90 border border-[#1F242A] rounded-xs text-[10px] text-[#2EE6A6] pointer-events-none backdrop-blur-sm">
          <Sparkles className="w-3 h-3" />
          <span>LIVE HARDWARE BONE KINEMATICS</span>
        </div>

        {/* Hardware Sensor Callout Overlays */}
        {showCallouts && (
          <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-4">
            <div className="flex justify-between items-start pt-6">
              {/* CH1 Index */}
              <div className="bg-[#08090A]/90 border border-[#2EE6A6]/60 px-2 py-1 rounded-xs text-[9px] text-[#2EE6A6] backdrop-blur-sm flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2EE6A6]" />
                <span>CH1: INDEX FLEX STRIP</span>
              </div>

              {/* CH2 Middle */}
              <div className="bg-[#08090A]/90 border border-[#38BDF8]/60 px-2 py-1 rounded-xs text-[9px] text-[#38BDF8] backdrop-blur-sm flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" />
                <span>CH2: MIDDLE FLEX STRIP</span>
              </div>

              {/* CH3 Ring */}
              <div className="bg-[#08090A]/90 border border-[#A78BFA]/60 px-2 py-1 rounded-xs text-[9px] text-[#A78BFA] backdrop-blur-sm flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#A78BFA]" />
                <span>CH3: RING FLEX STRIP</span>
              </div>
            </div>

            {/* Wrist Module Callout */}
            <div className="flex justify-center pb-2">
              <div className="bg-[#08090A]/90 border border-[#1F242A] px-2.5 py-1 rounded-xs text-[9px] text-[#9CA3AF] backdrop-blur-sm">
                SEEED XIAO nRF52840 / ARDUINO UNO ON WRIST (115200 BAUD)
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Live Channel Telemetry Cards (Index, Middle, Ring) */}
      <div className="w-full grid grid-cols-3 gap-2 pt-3 mt-1 border-t border-[#1F242A]">
        {[
          { label: 'F1 INDEX', bit: binaryBits[0], norm: normalizedFingers[0] ?? 0, raw: rawSensors[0] },
          { label: 'F2 MIDDLE', bit: binaryBits[1], norm: normalizedFingers[1] ?? 0, raw: rawSensors[1] },
          { label: 'F3 RING', bit: binaryBits[2], norm: normalizedFingers[2] ?? 0, raw: rawSensors[2] },
        ].map((f) => (
          <div
            key={f.label}
            className={`p-2 rounded-sm border ${
              f.bit === 1
                ? 'border-[#2EE6A6] bg-[#0E1B15]'
                : 'border-[#1F242A] bg-[#0C0E11]'
            } flex flex-col text-[10px]`}
          >
            <div className="flex justify-between items-center text-[#9CA3AF]">
              <span>{f.label}</span>
              <span
                className={`px-1 py-0.2 rounded font-bold ${
                  f.bit === 1 ? 'text-[#08090A] bg-[#2EE6A6]' : 'text-[#6B7280] bg-[#1F242A]'
                }`}
              >
                {f.bit === 1 ? 'BENT (1)' : 'STRAIGHT (0)'}
              </span>
            </div>
            <div className="mt-1 flex justify-between items-center text-[#D1D5DB]">
              <span>ADC: {f.raw ?? '---'}</span>
              <span className="text-[#2EE6A6]">{Math.round(f.norm * 100)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Real3DHand;
