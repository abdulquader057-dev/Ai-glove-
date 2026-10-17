// Native WebGL 3D Pipeline Stage for SIGNOVA Landing Page
// Powered by Three.js, @react-three/fiber and @react-three/drei
// Architectural standard inspired by atmos-bits.com

'use client';

import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Html, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

interface AtmosWebGLSceneProps {
  progress: number; // 0.0 to 1.0 from GSAP ScrollTrigger
}

// ---------------------------------------------------------------------------
// 3D Glove Model with Scroll-Driven Kinematics & 3D HTML Telemetry Pins
// ---------------------------------------------------------------------------
function GloveModel({ progress }: { progress: number }) {
  const { scene } = useGLTF('/models/glove.glb');
  const groupRef = useRef<THREE.Group>(null);

  // Clone scene so materials/instances are isolated
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  // Target coordinates for smooth lerping
  const targetPos = useRef(new THREE.Vector3(1.2, 0, 0));
  const targetRot = useRef(new THREE.Euler(0.1, -0.4, 0));
  const targetScale = useRef(1);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const clock = state.clock.getElapsedTime();

    // ── Timeline Transformations based on scroll progress ───────────────
    if (progress <= 0.25) {
      // Genesis: sit right-of-center with subtle breathing idle rotation
      const idleFloat = Math.sin(clock * 1.5) * 0.03;
      targetPos.current.set(1.2, idleFloat, 0);
      targetRot.current.set(0.1 + idleFloat * 0.5, -0.4, 0);
      targetScale.current = 1.0;
    } else if (progress <= 0.60) {
      // Hardware Dissection: glide to center stage, tilt forward and rotate 180°
      const t = (progress - 0.25) / 0.35;
      targetPos.current.set(
        THREE.MathUtils.lerp(1.2, 0.0, t),
        THREE.MathUtils.lerp(0.0, -0.1, t),
        THREE.MathUtils.lerp(0.0, 0.3, t)
      );
      targetRot.current.set(
        THREE.MathUtils.lerp(0.1, 0.5, t),
        THREE.MathUtils.lerp(-0.4, Math.PI, t),
        THREE.MathUtils.lerp(0.0, -0.2, t)
      );
      targetScale.current = THREE.MathUtils.lerp(1.0, 1.15, t);
    } else if (progress <= 0.85) {
      // Telemetry Focus: zoom forward, active sign posture
      const t = (progress - 0.60) / 0.25;
      targetPos.current.set(
        THREE.MathUtils.lerp(0.0, 0.2, t),
        THREE.MathUtils.lerp(-0.1, -0.2, t),
        THREE.MathUtils.lerp(0.3, 1.0, t)
      );
      targetRot.current.set(
        THREE.MathUtils.lerp(0.5, 0.25, t),
        THREE.MathUtils.lerp(Math.PI, 0.35, t),
        THREE.MathUtils.lerp(-0.2, 0.1, t)
      );
      targetScale.current = THREE.MathUtils.lerp(1.15, 1.25, t);
    } else {
      // Transition: scale down smoothly and fade out
      const t = (progress - 0.85) / 0.15;
      targetPos.current.set(0.2, -0.2, 1.0 + t * 0.5);
      targetScale.current = Math.max(0, 1.25 * (1 - t * 1.5));
    }

    // Smooth dampening interpolation
    groupRef.current.position.lerp(targetPos.current, delta * 6);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRot.current.x, delta * 6);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRot.current.y, delta * 6);
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRot.current.z, delta * 6);
    const currentScale = groupRef.current.scale.x;
    const nextScale = THREE.MathUtils.lerp(currentScale, targetScale.current, delta * 6);
    groupRef.current.scale.set(nextScale, nextScale, nextScale);
  });

  // Beat 2 Telemetry Pins Opacity: active between 0.30 and 0.60
  const isPinActive = progress >= 0.28 && progress <= 0.62;
  const pinOpacity = isPinActive
    ? Math.min((progress - 0.28) / 0.05, (0.62 - progress) / 0.05, 1)
    : 0;

  return (
    <group ref={groupRef} dispose={null}>
      <primitive object={clonedScene} />

      {/* ── Dynamic 3D HTML Annotation Pins (Pinned directly to Mesh) ── */}
      {pinOpacity > 0.01 && (
        <group>
          {/* Pin 1: Battery Core (at wrist battery unit) */}
          <Html position={[0.4, -1.35, -0.55]} center distanceFactor={5}>
            <div
              style={{ opacity: pinOpacity }}
              className="flex items-center gap-2 select-none pointer-events-none transition-opacity duration-200"
            >
              <div className="w-2 h-2 rounded-full bg-[#F59E0B] shadow-[0_0_10px_#F59E0B] animate-pulse" />
              <div className="px-3 py-1.5 rounded-xl bg-black/80 border border-[#F59E0B]/40 backdrop-blur-md text-left font-mono shadow-[0_0_25px_rgba(245,158,11,0.2)]">
                <div className="text-[10px] font-bold text-[#F59E0B] tracking-widest uppercase">
                  [PWR-3.7V]
                </div>
                <div className="text-xs font-semibold text-[#F6F6F8] whitespace-nowrap">
                  LiPo Telemetry Unit
                </div>
              </div>
            </div>
          </Html>

          {/* Pin 2: PCB / MCU (at ESP32 / Xiao Core) */}
          <Html position={[-0.45, -1.35, 0.6]} center distanceFactor={5}>
            <div
              style={{ opacity: pinOpacity }}
              className="flex items-center gap-2 select-none pointer-events-none transition-opacity duration-200"
            >
              <div className="px-3 py-1.5 rounded-xl bg-black/80 border border-[#00D2FF]/40 backdrop-blur-md text-left font-mono shadow-[0_0_25px_rgba(0,210,255,0.2)]">
                <div className="text-[10px] font-bold text-[#00D2FF] tracking-widest uppercase">
                  [ESP32-S3]
                </div>
                <div className="text-xs font-semibold text-[#F6F6F8] whitespace-nowrap">
                  Deterministic Edge ML Engine
                </div>
              </div>
              <div className="w-2 h-2 rounded-full bg-[#00D2FF] shadow-[0_0_10px_#00D2FF] animate-pulse" />
            </div>
          </Html>

          {/* Pin 3: Sensors (at finger flex ribbon array) */}
          <Html position={[-0.1, 1.8, 0.25]} center distanceFactor={5}>
            <div
              style={{ opacity: pinOpacity }}
              className="flex items-center gap-2 select-none pointer-events-none transition-opacity duration-200"
            >
              <div className="w-2 h-2 rounded-full bg-[#00F2A6] shadow-[0_0_10px_#00F2A6] animate-pulse" />
              <div className="px-3 py-1.5 rounded-xl bg-black/80 border border-[#00F2A6]/40 backdrop-blur-md text-left font-mono shadow-[0_0_25px_rgba(0,242,166,0.2)]">
                <div className="text-[10px] font-bold text-[#00F2A6] tracking-widest uppercase">
                  [FLEX-05]
                </div>
                <div className="text-xs font-semibold text-[#F6F6F8] whitespace-nowrap">
                  5-Channel Biomechanical Ribbon Array
                </div>
              </div>
            </div>
          </Html>
        </group>
      )}
    </group>
  );
}

// Preload the GLB model asset for instant hydration
useGLTF.preload('/models/glove.glb');

// ---------------------------------------------------------------------------
// Fallback Procedural Glove Geometry if GLTF is loading
// ---------------------------------------------------------------------------
function FallbackGlove() {
  return (
    <group position={[1.2, 0, 0]} rotation={[0.1, -0.4, 0]}>
      <mesh>
        <boxGeometry args={[1.5, 1.8, 0.4]} />
        <meshStandardMaterial color="#141a24" roughness={0.4} metalness={0.7} />
      </mesh>
      <mesh position={[0, -1.2, 0]}>
        <cylinderGeometry args={[0.7, 0.75, 0.8, 16]} />
        <meshStandardMaterial color="#00f2a6" emissive="#00f2a6" emissiveIntensity={0.5} wireframe />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Master Full-Screen WebGL Canvas Stage
// ---------------------------------------------------------------------------
export const AtmosWebGLScene: React.FC<AtmosWebGLSceneProps> = ({ progress }) => {
  // Global fadeout as user transitions past the 400vh 3D scrollytelling section
  const canvasOpacity = progress >= 0.88 ? Math.max(0, 1 - (progress - 0.88) / 0.10) : 1;

  return (
    <div
      style={{
        opacity: canvasOpacity,
        visibility: canvasOpacity <= 0.01 ? 'hidden' : 'visible',
        transition: 'opacity 0.25s ease-out',
      }}
      className="fixed inset-0 w-screen h-screen z-10 pointer-events-none"
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        className="w-full h-full block"
      >
        {/* ── Studio Lighting & Environment (Atmospheric Obsidian) ──────── */}
        <ambientLight intensity={0.4} color="#A0C0D0" />
        
        {/* Key Directional Light: Warm titanium white at [5, 8, 5] */}
        <directionalLight
          position={[5, 8, 5]}
          intensity={2.2}
          color="#FFFFFF"
          castShadow
        />

        {/* Rim/Back Light: Signal teal (#00F2A6) at [-6, -4, -5] for glowing edge contours */}
        <directionalLight
          position={[-6, -4, -5]}
          intensity={3.5}
          color="#00F2A6"
        />

        {/* Secondary Fill Light */}
        <pointLight position={[0, -2, 2]} intensity={1.5} color="#00D2FF" />

        {/* Subtle ground contact shadow */}
        <ContactShadows
          position={[0, -2.2, 0]}
          opacity={0.45}
          scale={10}
          blur={2.5}
          far={4}
          color="#000000"
        />

        {/* ── 3D Model Loading with Suspense Fallback ─────────────────── */}
        <Suspense fallback={<FallbackGlove />}>
          <GloveModel progress={progress} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default AtmosWebGLScene;
