import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useReducedMotion } from '../hooks/useReducedMotion';

/**
 * A slowly rotating cluster of wireframe geometry that forms the hero
 * backdrop. Auto-rotation pauses when the user prefers reduced motion.
 */
function FloatingCluster({ animate }: { animate: boolean }) {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!animate || !group.current) return;
    group.current.rotation.y += delta * 0.15;
    group.current.rotation.x += delta * 0.04;
  });

  return (
    <group ref={group}>
      <Float speed={animate ? 1.4 : 0} rotationIntensity={animate ? 0.6 : 0} floatIntensity={animate ? 1.1 : 0}>
        <mesh position={[0, 0, 0]}>
          <torusKnotGeometry args={[1.1, 0.32, 180, 24]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#1e3a5f"
            metalness={0.6}
            roughness={0.25}
            wireframe
          />
        </mesh>
      </Float>
      <Float speed={animate ? 1 : 0} rotationIntensity={animate ? 0.4 : 0} floatIntensity={animate ? 0.8 : 0}>
        <mesh position={[2.6, 1.2, -1.5]} scale={0.5}>
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#818cf8" metalness={0.4} roughness={0.4} wireframe />
        </mesh>
      </Float>
      <Float speed={animate ? 1.2 : 0} rotationIntensity={animate ? 0.5 : 0} floatIntensity={animate ? 0.9 : 0}>
        <mesh position={[-2.7, -1.1, -1]} scale={0.42}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#38bdf8" metalness={0.4} roughness={0.4} wireframe />
        </mesh>
      </Float>
    </group>
  );
}

/** A field of drifting points for depth. */
function StarField({ animate }: { animate: boolean }) {
  const ref = useRef<THREE.Points>(null);

  // Deterministic point cloud (no Math.random in render path keeps it stable).
  const positions = useMemo(() => {
    const count = 900;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Cheap deterministic scatter based on index.
      const a = i * 2.39996; // golden-angle spiral
      const r = 6 + (i % 50) * 0.08;
      arr[i * 3] = Math.cos(a) * r;
      arr[i * 3 + 1] = ((i % 37) - 18) * 0.45;
      arr[i * 3 + 2] = Math.sin(a) * r - 4;
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    if (!animate || !ref.current) return;
    ref.current.rotation.y += delta * 0.02;
  });

  return (
    <Points ref={ref} positions={positions} frustumCulled>
      <PointMaterial transparent color="#9aa7bd" size={0.05} sizeAttenuation depthWrite={false} />
    </Points>
  );
}

/**
 * Full-bleed 3D background canvas. Rendered behind the hero content with
 * pointer interaction enabled (drag to orbit) but no zoom/pan.
 */
export default function Scene3D() {
  const reducedMotion = useReducedMotion();
  const animate = !reducedMotion;

  return (
    <div className="absolute inset-0 -z-10" aria-hidden="true" data-testid="scene-3d">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 55 }}
        dpr={[1, 2]}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#05060a']} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1.1} />
        <pointLight position={[-5, -3, -2]} intensity={0.6} color="#818cf8" />
        <Suspense fallback={null}>
          <FloatingCluster animate={animate} />
          <StarField animate={animate} />
        </Suspense>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={animate}
          autoRotateSpeed={0.6}
          rotateSpeed={0.4}
          makeDefault
        />
      </Canvas>
    </div>
  );
}
