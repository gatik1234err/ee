import { useRef, useEffect, useState } from 'react';

const SPECS = [
  { label: 'Weight', value: 120, suffix: 'g', description: 'Lightweight & balanced' },
  { label: 'Power', value: 9, suffix: 'V', description: 'Rechargeable battery' },
  { label: 'Charging', value: 90, suffix: ' min', description: 'Fast charge' },
  { label: 'Runtime', value: 16, suffix: ' hrs', description: 'Per full charge' },
  { label: 'Warranty', value: 1, suffix: ' yr', description: 'Full coverage' },
];

function AnimatedCounter({ value, suffix }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef();
  const isNumber = typeof value === 'number';

  useEffect(() => {
    if (!isNumber) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const duration = 1400;
          const startTime = performance.now();
          const animate = (now) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.floor(eased * value));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, isNumber]);

  return (
    <span ref={ref}>
      {isNumber ? display : value}
      {suffix}
    </span>
  );
}

export function SpecsSection() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
      {SPECS.map((spec) => (
        <div key={spec.label} className="text-center">
          <div className="text-2xl md:text-4xl font-extralight text-[#F8FAFC] tabular-nums">
            <AnimatedCounter value={spec.value} suffix={spec.suffix} />
          </div>
          <div className="mt-2 text-xs uppercase tracking-[0.2em] text-[#38BDF8]">{spec.label}</div>
          <div className="mt-1 text-xs text-slate-500">{spec.description}</div>
        </div>
      ))}
    </div>
  );
}
