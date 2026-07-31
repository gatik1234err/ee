import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, useReducedMotion } from 'framer-motion';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { SceneCanvas } from '@/components/voxalife/SceneCanvas';
import { StoryContent } from '@/components/voxalife/StoryContent';
import { VocalWaveform } from '@/components/voxalife/VocalWaveform';
import { Loader } from '@/components/voxalife/Loader';
import { Navigation } from '@/components/voxalife/Navigation';
import { HotspotCard } from '@/components/voxalife/HotspotCard';

export default function VoxaLife() {
  const scrollProgress = useScrollProgress();
  const mouseRef = useRef({ x: 0, y: 0 });
  const [colorVariant, setColorVariant] = useState('titaniumSilver');
  const [activeHotspot, setActiveHotspot] = useState(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const handleMouse = (e) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      };
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  return (
    <div className="relative bg-[#020617] text-[#F8FAFC] overflow-x-hidden">
      <Loader />
      <Navigation />

      {/* Fixed background gradient */}
      <div className="fixed inset-0 z-0 bg-[#020617]">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 50% 40%, rgba(56, 189, 248, 0.06) 0%, transparent 60%)',
          }}
        />
      </div>

      {/* Fixed 3D Canvas */}
      <div className="fixed inset-0 z-[1]">
        <SceneCanvas
          scrollProgress={scrollProgress}
          mouseRef={mouseRef}
          colorVariant={colorVariant}
          activeHotspot={activeHotspot}
          onHotspotClick={setActiveHotspot}
          reducedMotion={prefersReducedMotion}
        />
      </div>

      {/* Scrollable content */}
      <StoryContent
        colorVariant={colorVariant}
        setColorVariant={setColorVariant}
        scrollProgress={scrollProgress}
      />

      {/* Vocal waveform overlay */}
      <VocalWaveform scrollProgress={scrollProgress} />

      {/* Hotspot info card */}
      <AnimatePresence>
        {activeHotspot && (
          <HotspotCard hotspot={activeHotspot} onClose={() => setActiveHotspot(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
