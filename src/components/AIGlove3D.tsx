"use client";

import React, { useRef, useMemo, useState, useEffect, Component, ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

// --------------------------------------------------------
// Error Boundary to catch WebGL / Canvas runtime errors
// --------------------------------------------------------
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class WebGLErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.warn("WebGL / 3D Canvas error caught:", error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// --------------------------------------------------------
// Glove Constants & Config
// --------------------------------------------------------
const GESTURES = ["open", "fist", "peace", "thumbsup", "point"] as const;
type Gesture = typeof GESTURES[number];

const GESTURE_MAP: Record<Gesture, number[]> = {
  open: [0, 0, 0, 0, 0],
  fist: [1, 1, 1, 1, 1],
  peace: [1, 0, 0, 1, 1],
  thumbsup: [0, 1, 1, 1, 1],
  point: [1, 0, 1, 1, 1],
};

// --------------------------------------------------------
// Procedural Glove Mesh
// --------------------------------------------------------
function HandMesh({ gesture, setLiveCurl }: { gesture: Gesture, setLiveCurl: (c: number[]) => void }) {
  const group = useRef<THREE.Group>(null);
  const targetCurls = GESTURE_MAP[gesture];
  const currentCurls = useRef([0, 0, 0, 0, 0]);
  const lastStateUpdate = useRef(0);

  // Materials created ONCE via useMemo
  const materials = useMemo(() => {
    return {
      fabric: new THREE.MeshStandardMaterial({
        color: 0x1a1a2e,
        roughness: 0.7,
        metalness: 0.1,
      }),
      imu: new THREE.MeshStandardMaterial({
        color: 0x111111,
        roughness: 0.3,
        metalness: 0.9,
      }),
      wristband: new THREE.MeshStandardMaterial({
        color: 0x222222,
        roughness: 0.9,
        metalness: 0.2,
      }),
      flexSensors: [0, 1, 2, 3, 4].map(() => new THREE.MeshStandardMaterial({
        color: 0x00d4ff,
        emissive: 0x00d4ff,
        emissiveIntensity: 0.5,
        roughness: 0.2,
        metalness: 0.8,
      })),
    };
  }, []);

  // Geometry cache
  const geometries = useMemo(() => {
    return {
      palm: new THREE.BoxGeometry(2, 2.5, 0.6),
      wrist: new THREE.CylinderGeometry(1.2, 1.2, 1.5, 32),
      fingerSegment: new THREE.CapsuleGeometry(0.25, 0.6, 4, 8),
      thumbSegment: new THREE.CapsuleGeometry(0.3, 0.7, 4, 8),
      imu: new THREE.BoxGeometry(0.8, 0.8, 0.2),
      flexStrip: new THREE.BoxGeometry(0.1, 0.6, 0.05),
    };
  }, []);

  // Finger refs
  const fingerRoots = useRef<THREE.Group[]>([]);
  const fingerMids = useRef<THREE.Group[]>([]);
  const fingerTips = useRef<THREE.Group[]>([]);

  useFrame((state, delta) => {
    if (group.current) {
      group.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }

    for (let i = 0; i < 5; i++) {
      currentCurls.current[i] = THREE.MathUtils.damp(
        currentCurls.current[i],
        targetCurls[i],
        4,
        delta
      );

      const curl = currentCurls.current[i];
      const rootCurl = curl * (Math.PI / 2);
      const midCurl = curl * (Math.PI / 2.2);
      const tipCurl = curl * (Math.PI / 3);

      if (fingerRoots.current[i]) {
        if (i === 0) {
          fingerRoots.current[i].rotation.z = -0.5 - (curl * 0.5);
          fingerRoots.current[i].rotation.y = -0.4;
          fingerRoots.current[i].rotation.x = rootCurl * 0.5;
        } else {
          fingerRoots.current[i].rotation.x = rootCurl;
        }
      }
      if (fingerMids.current[i]) fingerMids.current[i].rotation.x = midCurl;
      if (fingerTips.current[i]) fingerTips.current[i].rotation.x = tipCurl;

      const flexMat = materials.flexSensors[i];
      if (flexMat) {
        flexMat.emissiveIntensity = 0.2 + (curl * 1.5);
        const cyan = new THREE.Color(0x00d4ff);
        const magenta = new THREE.Color(0xff00ff);
        flexMat.emissive.lerpColors(cyan, magenta, curl);
        flexMat.color.lerpColors(cyan, magenta, curl);
      }
    }

    // Throttle React state updates to 100ms interval to prevent UI thrashing
    const now = state.clock.elapsedTime;
    if (now - lastStateUpdate.current > 0.1) {
      lastStateUpdate.current = now;
      setLiveCurl([...currentCurls.current]);
    }
  });

  const fingersData = [
    { name: "Thumb", px: -1.2, py: -0.5, pz: 0, length: 0.8 },
    { name: "Index", px: -0.7, py: 1.3, pz: 0, length: 1 },
    { name: "Middle", px: 0, py: 1.4, pz: 0, length: 1.1 },
    { name: "Ring", px: 0.7, py: 1.3, pz: 0, length: 1 },
    { name: "Pinky", px: 1.3, py: 0.9, pz: 0, length: 0.8 },
  ];

  return (
    <group ref={group}>
      <mesh geometry={geometries.palm} material={materials.fabric} />
      <mesh geometry={geometries.wrist} material={materials.wristband} position={[0, -2, 0]} />

      <mesh geometry={geometries.imu} material={materials.imu} position={[0, 0, 0.35]}>
        <mesh position={[0.3, 0.3, 0.11]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial color={0x00d4ff} />
        </mesh>
      </mesh>

      {fingersData.map((f, i) => {
        const mat = materials.flexSensors[i];
        return (
          <group 
            key={f.name} 
            position={[f.px, f.py, f.pz]} 
            ref={(el) => { if (el) fingerRoots.current[i] = el; }}
          >
            <mesh geometry={i === 0 ? geometries.thumbSegment : geometries.fingerSegment} material={materials.fabric} position={[0, f.length/2, 0]} />
            <mesh geometry={geometries.flexStrip} material={mat} position={[0, f.length/2, 0.15]} />

            <group position={[0, f.length, 0]} ref={(el) => { if (el) fingerMids.current[i] = el; }}>
              <mesh geometry={i === 0 ? geometries.thumbSegment : geometries.fingerSegment} material={materials.fabric} position={[0, f.length/2.5, 0]} />
              <mesh geometry={geometries.flexStrip} material={mat} position={[0, f.length/2.5, 0.15]} scale={[1, 0.8, 1]} />

              <group position={[0, f.length/1.2, 0]} ref={(el) => { if (el) fingerTips.current[i] = el; }}>
                <mesh geometry={i === 0 ? geometries.thumbSegment : geometries.fingerSegment} material={materials.fabric} position={[0, f.length/3, 0]} scale={[0.9, 0.7, 0.9]} />
                <mesh geometry={geometries.flexStrip} material={mat} position={[0, f.length/3, 0.13]} scale={[1, 0.6, 1]} />
              </group>
            </group>
          </group>
        );
      })}
    </group>
  );
}

// --------------------------------------------------------
// Data Particles
// --------------------------------------------------------
function DataParticles() {
  const count = 60;
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const particles = useMemo(() => {
    return new Array(count).fill(0).map(() => ({
      t: Math.random() * 10,
      speed: 0.02 + Math.random() * 0.03,
      xFactor: -0.5 + Math.random(),
      zFactor: -0.5 + Math.random(),
    }));
  }, [count]);

  useFrame(() => {
    if (!mesh.current) return;
    particles.forEach((particle, i) => {
      let t = (particle.t += particle.speed);
      if (t > 8) {
        particle.t = 0;
        t = 0;
      }
      
      dummy.position.set(
        particle.xFactor * t * 0.4,
        t * 0.6,
        0.35 + (particle.zFactor * t * 0.4)
      );
      
      const s = Math.max(0, 1 - (t / 8)) * 0.04;
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]} position={[0, 0, 0]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color={0x00d4ff} transparent opacity={0.6} blending={THREE.AdditiveBlending} />
    </instancedMesh>
  );
}

// --------------------------------------------------------
// Bluetooth Waves
// --------------------------------------------------------
function BluetoothWaves() {
  const wavesRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (!wavesRef.current) return;
    const t = clock.elapsedTime;
    
    wavesRef.current.children.forEach((wave, i) => {
      const localT = (t + i) % 3;
      const scale = 1 + localT * 1.5;
      const opacity = Math.max(0, 1 - (localT / 3));
      
      wave.scale.set(scale, scale, scale);
      const material = (wave as THREE.Mesh).material as THREE.Material;
      material.opacity = opacity;
    });
  });

  return (
    <group ref={wavesRef} position={[0, -2, 0.6]} rotation={[Math.PI / 2, 0, 0]}>
      {[0, 1, 2].map((i) => (
        <mesh key={i}>
          <ringGeometry args={[0.5, 0.55, 32]} />
          <meshBasicMaterial color={0x0088ff} transparent opacity={0} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
        </mesh>
      ))}
    </group>
  );
}

// --------------------------------------------------------
// Holographic Scan Line
// --------------------------------------------------------
function ScanLine() {
  const lineRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (!lineRef.current) return;
    lineRef.current.position.y = Math.sin(clock.elapsedTime * 1.5) * 2.5;
  });

  return (
    <mesh ref={lineRef} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[6, 6]} />
      <meshBasicMaterial color={0x00d4ff} transparent opacity={0.15} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} />
    </mesh>
  );
}

// --------------------------------------------------------
// 2D Fallback Component for Non-WebGL environments
// --------------------------------------------------------
function GloveFallback({ gesture, onNextGesture }: { gesture: Gesture, onNextGesture: () => void }) {
  const emojis: Record<Gesture, string> = {
    open: "✋",
    fist: "✊",
    peace: "✌️",
    thumbsup: "👍",
    point: "👆",
  };

  return (
    <div 
      onClick={onNextGesture}
      className="w-full h-[400px] lg:h-[600px] bg-[#050508] rounded-2xl border border-border flex flex-col items-center justify-center p-8 cursor-pointer relative overflow-hidden group"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 to-transparent pointer-events-none" />
      <div className="text-8xl mb-6 transition-transform duration-300 group-hover:scale-110">
        {emojis[gesture]}
      </div>
      <span className="text-xl font-bold text-white uppercase tracking-widest mb-2">
        AI Glove Prototype
      </span>
      <span className="text-sm text-cyan-400 font-mono mb-4">
        Active Gesture: {gesture.toUpperCase()}
      </span>
      <span className="text-xs text-text-muted bg-white/5 border border-white/10 px-4 py-2 rounded-full">
        Click to cycle gesture
      </span>
    </div>
  );
}

// --------------------------------------------------------
// Main Component
// --------------------------------------------------------
export default function AIGlove3D() {
  const [gestureIndex, setGestureIndex] = useState(0);
  const [liveCurl, setLiveCurl] = useState<number[]>([0,0,0,0,0]);
  const [isClient, setIsClient] = useState(false);
  const currentGesture = GESTURES[gestureIndex];

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleClick = () => {
    setGestureIndex((prev) => (prev + 1) % GESTURES.length);
  };

  if (!isClient) {
    return <GloveFallback gesture={currentGesture} onNextGesture={handleClick} />;
  }

  return (
    <WebGLErrorBoundary fallback={<GloveFallback gesture={currentGesture} onNextGesture={handleClick} />}>
      <div 
        className="relative w-full h-[400px] lg:h-[600px] rounded-2xl overflow-hidden shadow-xl border border-[#334155] cursor-pointer"
        onClick={handleClick}
      >
        <Canvas camera={{ position: [0, 2, 7], fov: 45 }}>
          <color attach="background" args={["#050508"]} />
          <ambientLight intensity={0.5} color={0x404040} />
          <directionalLight position={[5, 10, 7]} intensity={1.5} color={0xffffff} />
          <pointLight position={[0, -2, 2]} intensity={0.8} color={0x00d4ff} />
          <pointLight position={[0, 4, -2]} intensity={0.4} color={0xff00ff} />

          <HandMesh gesture={currentGesture} setLiveCurl={setLiveCurl} />
          <DataParticles />
          <BluetoothWaves />
          <ScanLine />

          <EffectComposer>
            <Bloom luminanceThreshold={0.85} mipmapBlur intensity={1.5} radius={0.6} />
          </EffectComposer>

          <OrbitControls 
            enableZoom={false} 
            enablePan={false} 
            autoRotate 
            autoRotateSpeed={0.5} 
            enableDamping 
            dampingFactor={0.05} 
          />
        </Canvas>

        {/* Floating UI Overlay */}
        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-accent/30 rounded-lg p-4 pointer-events-none">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
            <span className="text-xs uppercase tracking-wider text-text-on-dark font-semibold">Live Sensor Data</span>
          </div>
          
          <div className="space-y-2">
            {['Thumb', 'Index', 'Middle', 'Ring', 'Pinky'].map((finger, i) => {
              const curlPercent = Math.round((liveCurl[i] || 0) * 100);
              return (
                <div key={finger} className="flex items-center gap-3">
                  <span className="text-xs text-text-muted w-12">{finger}</span>
                  <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-accent transition-all duration-150"
                      style={{ width: `${curlPercent}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-accent w-6 text-right tabular-nums">{curlPercent}%</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Current Gesture Label */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md border border-white/10 rounded-full px-6 py-2 pointer-events-none">
          <span className="text-sm font-medium text-white tracking-widest uppercase flex items-center gap-2">
            Gesture: <span className="text-accent">{currentGesture}</span>
          </span>
        </div>
        
        {/* Interaction Hint */}
        <div className="absolute bottom-2 right-4 pointer-events-none">
          <span className="text-[10px] text-white/40 uppercase tracking-widest">Click to change gesture</span>
        </div>
      </div>
    </WebGLErrorBoundary>
  );
}
