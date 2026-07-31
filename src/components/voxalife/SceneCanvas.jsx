import { Canvas, useFrame, useThree } from '@react-three/fiber';
import './r3fCompat';
import { Suspense, useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { ElectrolarynxModel } from './ElectrolarynxModel';
import { HOTSPOT_DATA, getSceneState } from './sceneUtils';

// Cinematic camera rig driven by scroll progress (or active hotspot)
function CameraRig({ scrollProgress, activeHotspot, reducedMotion }) {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3(0, 0, 0));
  const tempPos = useRef(new THREE.Vector3());
  const tempTarget = useRef(new THREE.Vector3());
  const lerpFactor = reducedMotion ? 0.15 : 0.045;

  useFrame(() => {
    if (activeHotspot) {
      const pos = activeHotspot.position;
      tempPos.current.set(pos[0] * 1.2, pos[1] + 0.4, 2.5);
      tempTarget.current.set(pos[0], pos[1], pos[2]);
    } else {
      const state = getSceneState(scrollProgress.current);
      tempPos.current.set(state.cameraPos[0], state.cameraPos[1], state.cameraPos[2]);
      tempTarget.current.set(state.lookAt[0], state.lookAt[1], state.lookAt[2]);
    }
    camera.position.lerp(tempPos.current, lerpFactor);
    target.current.lerp(tempTarget.current, lerpFactor);
    camera.lookAt(target.current);
  });

  return null;
}

// Custom studio environment using three.js RoomEnvironment (no external HDR needed)
function StudioEnvironment() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmremGenerator = new THREE.PMREMGenerator(gl);
    const roomEnv = new RoomEnvironment();
    const envMap = pmremGenerator.fromScene(roomEnv, 0.04).texture;
    scene.environment = envMap;
    return () => {
      envMap.dispose();
      pmremGenerator.dispose();
    };
  }, [gl, scene]);
  return null;
}

// Floating ambient particles
function Particles() {
  const ref = useRef();

  const geometry = useMemo(() => {
    const count = 250;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 24;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 24;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 14 - 2;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.02;
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial size={0.025} color="#38BDF8" transparent opacity={0.35} sizeAttenuation depthWrite={false} />
    </points>
  );
}

// Interactive hotspot with pulsing ring
function Hotspot({ data, scrollProgress, onClick }) {
  const meshRef = useRef();
  const ringRef = useRef();
  const hoveredRef = useRef(false);
  const pulseRef = useRef(0);

  useFrame((_, delta) => {
    const state = getSceneState(scrollProgress.current);
    const opacity = state.hotspotOpacity;
    const mesh = meshRef.current;
    const ring = ringRef.current;
    if (mesh) {
      mesh.visible = opacity > 0.01;
      mesh.material.opacity = opacity;
      mesh.material.emissiveIntensity = hoveredRef.current ? 6 : 3;
      mesh.scale.setScalar(hoveredRef.current ? 1.4 : 1);
    }
    if (ring) {
      ring.visible = opacity > 0.01;
      pulseRef.current += delta * 2;
      const s = 1 + Math.sin(pulseRef.current) * 0.4;
      ring.scale.setScalar(s);
      ring.material.opacity = opacity * 0.5;
    }
  });

  return (
    <group position={data.position}>
      <mesh
        ref={meshRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          hoveredRef.current = true;
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          hoveredRef.current = false;
          document.body.style.cursor = 'auto';
        }}
        onClick={(e) => {
          e.stopPropagation();
          onClick(data);
        }}
      >
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#38BDF8" emissive="#38BDF8" emissiveIntensity={3} transparent toneMapped={false} />
      </mesh>
      <mesh ref={ringRef}>
        <ringGeometry args={[0.06, 0.08, 32]} />
        <meshBasicMaterial color="#38BDF8" transparent side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
    </group>
  );
}

export function SceneCanvas({ scrollProgress, mouseRef, colorVariant, activeHotspot, onHotspotClick, reducedMotion }) {
  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 6], fov: 45, near: 0.1, far: 100 }}>
      <CameraRig scrollProgress={scrollProgress} activeHotspot={activeHotspot} reducedMotion={reducedMotion} />

      {/* Three-point studio lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 8, 5]} intensity={2} castShadow color="#FFFFFF" />
      <directionalLight position={[-6, 2, -3]} intensity={0.6} color="#38BDF8" />
      <pointLight position={[0, -3, 4]} intensity={0.4} color="#FBBF24" />

      {/* Simple contact shadow */}
      <mesh position={[0, -2.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.6, 32]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.2} depthWrite={false} />
      </mesh>

      <Suspense fallback={null}>
        <StudioEnvironment />

        <ElectrolarynxModel
          scrollProgress={scrollProgress}
          mouseRef={mouseRef}
          colorVariant={colorVariant}
          reducedMotion={reducedMotion}
        />

        {HOTSPOT_DATA.map((h) => (
          <Hotspot key={h.id} data={h} scrollProgress={scrollProgress} onClick={onHotspotClick} />
        ))}
      </Suspense>

      <Particles />
    </Canvas>
  );
}