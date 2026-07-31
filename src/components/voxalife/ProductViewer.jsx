import { Canvas, useThree } from '@react-three/fiber';
import './r3fCompat';
import { Suspense, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { ElectrolarynxModel } from './ElectrolarynxModel';

// Fixed camera positioned to show the full assembled model
function FixedCamera() {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0, 0.3, 5);
    camera.lookAt(0, 0, 0);
  }, [camera]);
  return null;
}

// Studio environment for PBR reflections (same as landing page)
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

export function ProductViewer({ colorVariant }) {
  const mouseRef = useRef({ x: 0, y: 0 });
  const scrollProgress = useRef(0);
  const containerRef = useRef();

  useEffect(() => {
    const handleMouse = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      mouseRef.current = { x, y };
    };
    const container = containerRef.current;
    container?.addEventListener('mousemove', handleMouse);
    return () => container?.removeEventListener('mousemove', handleMouse);
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full">
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0.3, 5], fov: 45, near: 0.1, far: 100 }}>
        <FixedCamera />

        {/* Three-point studio lighting */}
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 8, 5]} intensity={2} color="#FFFFFF" />
        <directionalLight position={[-6, 2, -3]} intensity={0.6} color="#38BDF8" />
        <pointLight position={[0, -3, 4]} intensity={0.4} color="#FBBF24" />

        {/* Contact shadow */}
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
            reducedMotion={false}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
