import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { lerp, smoothstep, COLOR_VARIANTS } from './sceneUtils';

// Internal parts that separate along Y during explosion
// [key, baseY, explodeY]
const Y_PARTS = [
  ['speaker', 0.75, 1.2],
  ['motor', 0.2, 0.4],
  ['battery', -0.8, -1.6],
];

// Shell groups that move as units
const SHELL_PARTS = [
  ['topShell', 0, 2.5],
  ['bottomShell', 0, -2.5],
];

// Small glowing pulse traveling between components (internal wire animation)
function ElectricalPulse({ scrollProgress, y1, y2, speed, offset, x = 0, z = 0 }) {
  const ref = useRef();

  useFrame((state) => {
    const p = scrollProgress.current;
    const explode = smoothstep(0.215, 0.355, p) * (1 - smoothstep(0.85, 0.95, p));
    const mesh = ref.current;
    if (!mesh) return;
    mesh.visible = explode > 0.1;
    if (mesh.visible) {
      const t = ((state.clock.elapsedTime * speed + offset) % 1);
      mesh.position.set(x, lerp(y1, y2, t), z);
      mesh.material.opacity = Math.sin(t * Math.PI) * 0.9 * explode;
    }
  });

  return (
    <mesh ref={ref} position={[x, y1, z]}>
      <sphereGeometry args={[0.025, 8, 8]} />
      <meshStandardMaterial color="#38BDF8" emissive="#38BDF8" emissiveIntensity={4} transparent toneMapped={false} />
    </mesh>
  );
}

export function ElectrolarynxModel({ scrollProgress, mouseRef, colorVariant, reducedMotion }) {
  const groupRef = useRef();
  const partRefs = useRef({});

  // Create materials once; animate their properties in useFrame for smooth color transitions
  const bodyMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#C4C4CC'),
        metalness: 0.95,
        roughness: 0.18,
        transparent: true,
      }),
    []
  );

  const gripMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#82828C'),
        metalness: 0.05,
        roughness: 0.85,
        transparent: true,
      }),
    []
  );

  const neckMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#E2E8F0'),
        metalness: 0.2,
        roughness: 0.45,
        transparent: true,
      }),
    []
  );

  // Target properties updated when colorVariant changes
  const targetBodyColor = useRef(new THREE.Color('#C4C4CC'));
  const targetGripColor = useRef(new THREE.Color('#82828C'));
  const targetMetalness = useRef(0.95);
  const targetRoughness = useRef(0.18);

  useEffect(() => {
    const v = COLOR_VARIANTS[colorVariant] || COLOR_VARIANTS.titaniumSilver;
    targetBodyColor.current.set(v.body);
    targetGripColor.current.set(v.grip);
    targetMetalness.current = v.metalness;
    targetRoughness.current = v.roughness;
  }, [colorVariant]);

  useFrame((state, delta) => {
    const p = scrollProgress.current;
    const explode = smoothstep(0.215, 0.355, p) * (1 - smoothstep(0.85, 0.95, p));
    const crossSection = smoothstep(0.355, 0.42, p) * (1 - smoothstep(0.55, 0.57, p));
    const rotSpeed = 0.12 + smoothstep(0.108, 0.215, p) * 0.18;

    const g = groupRef.current;
    if (!g) return;

    g.rotation.y += rotSpeed * delta;

    // Gentle floating bob + mouse parallax (skipped if reduced motion)
    if (!reducedMotion) {
      g.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.06;
      if (mouseRef?.current) {
        g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, mouseRef.current.y * 0.1, 0.04);
        g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, -mouseRef.current.x * 0.06, 0.04);
      }
    }

    // Explode internal parts along Y
    Y_PARTS.forEach(([key, baseY, explodeY]) => {
      const ref = partRefs.current[key];
      if (ref) ref.position.y = lerp(baseY, explodeY, explode);
    });

    // Explode shell groups along Y
    SHELL_PARTS.forEach(([key, baseY, explodeY]) => {
      const ref = partRefs.current[key];
      if (ref) ref.position.y = lerp(baseY, explodeY, explode);
    });

    // Cross-section: make shell materials translucent
    const shellOpacity = lerp(1, 0.22, crossSection);

    // Smoothly animate body material toward target variant
    bodyMaterial.color.lerp(targetBodyColor.current, 0.06);
    bodyMaterial.metalness = lerp(bodyMaterial.metalness, targetMetalness.current, 0.06);
    bodyMaterial.roughness = lerp(bodyMaterial.roughness, targetRoughness.current, 0.06);
    bodyMaterial.opacity = shellOpacity;

    // Grip material
    gripMaterial.color.lerp(targetGripColor.current, 0.06);
    gripMaterial.opacity = shellOpacity;

    // Neck material
    neckMaterial.opacity = shellOpacity;
  });

  return (
    <group ref={groupRef}>
      {/* ===== TOP SHELL GROUP (neck surface, top cap, upper body, button, LED, logo) ===== */}
      <group ref={(el) => (partRefs.current['topShell'] = el)}>
        {/* Neck contact surface — rounded dome */}
        <mesh position={[0, 2.0, 0]} castShadow material={neckMaterial}>
          <sphereGeometry args={[0.55, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
        </mesh>

        {/* Top cap */}
        <mesh position={[0, 1.55, 0]} castShadow material={bodyMaterial}>
          <cylinderGeometry args={[0.52, 0.55, 0.35, 48]} />
        </mesh>

        {/* Upper body cylinder */}
        <mesh position={[0, 0.8, 0]} castShadow material={bodyMaterial}>
          <cylinderGeometry args={[0.55, 0.58, 1.2, 48]} />
        </mesh>

        {/* Power button — frosted translucent dome */}
        <mesh position={[0.58, 1.15, 0]} castShadow rotation={[0, 0, 0]}>
          <sphereGeometry args={[0.14, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial
            color="#38BDF8"
            roughness={0.12}
            metalness={0.1}
            transparent
            opacity={0.7}
            emissive="#1A5F8A"
            emissiveIntensity={0.3}
          />
        </mesh>

        {/* LED indicator — emissive dot */}
        <mesh position={[0.58, 1.42, 0.15]}>
          <sphereGeometry args={[0.045, 16, 16]} />
          <meshStandardMaterial color="#38BDF8" emissive="#38BDF8" emissiveIntensity={5} toneMapped={false} />
        </mesh>

        {/* Fine engraved logo — subtle inset ring */}
        <mesh position={[0, 1.0, 0.565]} material={bodyMaterial}>
          <torusGeometry args={[0.18, 0.006, 8, 48]} />
        </mesh>
      </group>

      {/* ===== BOTTOM SHELL GROUP (lower body, bottom cap) ===== */}
      <group ref={(el) => (partRefs.current['bottomShell'] = el)}>
        {/* Lower body cylinder */}
        <mesh position={[0, -0.8, 0]} castShadow material={bodyMaterial}>
          <cylinderGeometry args={[0.58, 0.55, 1.2, 48]} />
        </mesh>

        {/* Bottom cap */}
        <mesh position={[0, -1.55, 0]} castShadow material={bodyMaterial}>
          <cylinderGeometry args={[0.55, 0.5, 0.35, 48]} />
        </mesh>

      </group>

      {/* ===== RUBBER GRIP (stays centered) ===== */}
      <mesh position={[0, -0.1, 0]} castShadow material={gripMaterial}>
        <cylinderGeometry args={[0.6, 0.6, 0.7, 48]} />
      </mesh>

      {/* ===== INTERNAL COMPONENTS ===== */}
      {/* Speaker / Transducer */}
      <mesh ref={(el) => (partRefs.current['speaker'] = el)} position={[0, 0.75, 0]} castShadow>
        <cylinderGeometry args={[0.32, 0.38, 0.3, 32]} />
        <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Vibration motor */}
      <mesh ref={(el) => (partRefs.current['motor'] = el)} position={[0, 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.28, 0.28, 0.5, 32]} />
        <meshStandardMaterial color="#64748B" metalness={0.8} roughness={0.25} />
      </mesh>

      {/* Battery */}
      <mesh ref={(el) => (partRefs.current['battery'] = el)} position={[0, -0.8, 0]} castShadow>
        <cylinderGeometry args={[0.35, 0.35, 0.65, 32]} />
        <meshStandardMaterial color="#1E3A5F" metalness={0.4} roughness={0.4} />
      </mesh>

      {/* ===== ELECTRICAL PULSES (internal wire animation) ===== */}
      <ElectricalPulse scrollProgress={scrollProgress} y1={-1.5} y2={1.0} speed={0.4} offset={0} />
      <ElectricalPulse scrollProgress={scrollProgress} y1={-1.5} y2={1.0} speed={0.4} offset={0.35} />
      <ElectricalPulse scrollProgress={scrollProgress} y1={-1.5} y2={1.0} speed={0.4} offset={0.7} />
      <ElectricalPulse scrollProgress={scrollProgress} y1={-0.4} y2={0.4} speed={0.7} offset={0.15} x={0.15} />
    </group>
  );
}
