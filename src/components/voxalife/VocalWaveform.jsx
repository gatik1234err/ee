import { useRef, useEffect } from 'react';
import { getSceneState } from './sceneUtils';

export function VocalWaveform({ scrollProgress }) {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;

    const draw = () => {
      const state = getSceneState(scrollProgress.current);
      const intensity = state.waveformIntensity;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = 0.4 + intensity * 0.4;
      ctx.beginPath();

      const bars = 100;
      const barWidth = w / bars;
      const time = Date.now() * 0.003;

      for (let i = 0; i < bars; i++) {
        const phase = i * 0.25 + time;
        // More erratic waveform during motor section (higher scroll), smooth otherwise
        const noise = (scrollProgress.current > 0.43 && scrollProgress.current < 0.53) ? 0.7 : 0.3;
        const amplitude =
          (Math.sin(phase) * 0.5 + Math.sin(phase * 2.3) * noise * 0.3 + 0.5) *
          intensity *
          h *
          0.35;
        const x = i * barWidth + barWidth / 2;
        const y = h / 2;
        ctx.moveTo(x, y - amplitude);
        ctx.lineTo(x, y + amplitude);
      }
      ctx.stroke();

      raf = requestAnimationFrame(draw);
    };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [scrollProgress]);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 h-14 pointer-events-none">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
