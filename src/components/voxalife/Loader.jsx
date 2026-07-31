import { useState, useEffect } from 'react';

export function Loader() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let timer;
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          timer = setTimeout(() => setVisible(false), 600);
          return 100;
        }
        return p + Math.random() * 7 + 3;
      });
    }, 90);
    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#020617] transition-opacity duration-500 ${
        progress >= 100 ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Animated wireframe outline of the device */}
      <svg width="70" height="180" viewBox="0 0 70 180" className="mb-8" fill="none">
        <rect
          x="20" y="15" width="30" height="150" rx="15"
          stroke="#38BDF8" strokeWidth="1" opacity="0.5"
        >
          <animate attributeName="opacity" values="0.2;0.7;0.2" dur="2s" repeatCount="indefinite" />
        </rect>
        <ellipse cx="35" cy="15" rx="15" ry="6" stroke="#38BDF8" strokeWidth="1" opacity="0.5" />
        <line x1="20" y1="50" x2="50" y2="50" stroke="#38BDF8" strokeWidth="0.5" opacity="0.3" />
        <line x1="20" y1="130" x2="50" y2="130" stroke="#38BDF8" strokeWidth="0.5" opacity="0.3" />
        <circle cx="50" cy="80" r="4" stroke="#38BDF8" strokeWidth="0.5" opacity="0.4" />
        <line x1="35" y1="165" x2="35" y2="172" stroke="#38BDF8" strokeWidth="0.5" opacity="0.3" />
      </svg>

      {/* Progress bar */}
      <div className="w-48 h-px bg-slate-800 overflow-hidden">
        <div
          className="h-full bg-[#38BDF8] transition-all duration-200 ease-out"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      <p className="mt-4 text-xs text-slate-500 tracking-[0.3em] uppercase">Loading Experience</p>
    </div>
  );
}
