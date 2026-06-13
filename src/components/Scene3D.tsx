import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { getScrollProgress } from '../utils/scroll';

/*
 * Scroll-driven flythrough.
 *
 * The page doesn't visually "scroll" so much as scrub a camera forward down a
 * winding tunnel of glowing rings — scroll position maps directly to how far
 * along the tunnel the camera has travelled. This is the hubtown.co.in feel:
 * scroll as a playback head, not as page translation.
 */

const RING_COUNT = 38;
const RING_SPACING = 6;
const TUNNEL_LENGTH = RING_COUNT * RING_SPACING;
const START_Z = 10; // camera's z at scroll = 0
const END_Z = -(TUNNEL_LENGTH - 26); // camera's z at scroll = 1

/** The gentle winding centre-line of the tunnel, parameterised by world-z. */
function pathAt(z: number, out = new THREE.Vector3()): THREE.Vector3 {
  return out.set(Math.sin(z * 0.025) * 4, Math.cos(z * 0.02) * 2, z);
}

/** Glowing rings laid out along the path — the "road" the camera flies down. */
function Tunnel() {
  const rings = useMemo(
    () =>
      Array.from({ length: RING_COUNT }, (_, i) => {
        const z = -i * RING_SPACING;
        const p = pathAt(z);
        return {
          position: [p.x, p.y, z] as [number, number, number],
          spin: i * 0.32,
          color: i % 2 === 0 ? '#38bdf8' : '#818cf8',
        };
      }),
    [],
  );

  return (
    <group>
      {rings.map((ring, i) => (
        <mesh key={i} position={ring.position} rotation={[0, 0, ring.spin]}>
          <torusGeometry args={[3.2, 0.045, 8, 64]} />
          <meshBasicMaterial
            color={ring.color}
            transparent
            opacity={0.45}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

/** A haze of points hugging the path, for a sense of speed and depth. */
function Dust() {
  const positions = useMemo(() => {
    const count = 1300;
    const arr = new Float32Array(count * 3);
    const tmp = new THREE.Vector3();
    for (let i = 0; i < count; i++) {
      const z = -(i / count) * TUNNEL_LENGTH;
      pathAt(z, tmp);
      const a = i * 2.39996; // golden-angle scatter
      const r = 1.4 + (i % 30) * 0.13;
      arr[i * 3] = tmp.x + Math.cos(a) * r;
      arr[i * 3 + 1] = tmp.y + Math.sin(a) * r;
      arr[i * 3 + 2] = z + ((i % 13) - 6) * 0.3;
    }
    return arr;
  }, []);

  return (
    <Points positions={positions} frustumCulled={false}>
      <PointMaterial transparent color="#9aa7bd" size={0.06} sizeAttenuation depthWrite={false} opacity={0.7} />
    </Points>
  );
}

/**
 * Moves the camera along the path each frame. Scroll progress is read from a
 * ref (updated by a passive listener) so per-frame motion never triggers a
 * React re-render. The eased value chases the target, smoothing scroll jumps.
 */
function CameraRig({ animate }: { animate: boolean }) {
  const target = useRef(0);
  const eased = useRef(0);
  const posVec = useRef(new THREE.Vector3());
  const lookVec = useRef(new THREE.Vector3());

  useEffect(() => {
    let raf = 0;
    const read = () => {
      target.current = getScrollProgress();
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(read);
    };
    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  useFrame((state, delta) => {
    const goal = animate ? target.current : 0;
    // Critically-damped chase toward the scroll target.
    eased.current += (goal - eased.current) * Math.min(1, delta * 3.5);

    const z = THREE.MathUtils.lerp(START_Z, END_Z, eased.current);
    pathAt(z, posVec.current);
    pathAt(z - 10, lookVec.current); // aim a little further down the tunnel

    state.camera.position.copy(posVec.current);
    if (animate) {
      // Subtle idle drift so the scene breathes even when scroll is still.
      state.camera.position.x += Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
      state.camera.position.y += Math.cos(state.clock.elapsedTime * 0.25) * 0.1;
    }
    state.camera.lookAt(lookVec.current);
  });

  return null;
}

/**
 * Fixed, full-viewport backdrop rendered behind all page content. Decorative
 * (aria-hidden); a global scrim in App keeps text legible over the motion.
 */
export default function Scene3D() {
  const reducedMotion = useReducedMotion();
  const animate = !reducedMotion;
  const start = pathAt(START_Z);

  return (
    <div className="fixed inset-0 -z-10" aria-hidden="true" data-testid="scene-3d">
      <Canvas
        camera={{ position: [start.x, start.y, START_Z], fov: 72 }}
        dpr={[1, 2]}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#05060a']} />
        <fog attach="fog" args={['#05060a', 6, 46]} />
        <Suspense fallback={null}>
          <Tunnel />
          <Dust />
        </Suspense>
        <CameraRig animate={animate} />
      </Canvas>
    </div>
  );
}
