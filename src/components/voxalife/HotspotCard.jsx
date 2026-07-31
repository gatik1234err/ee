import { motion } from 'framer-motion';
import { X } from 'lucide-react';

export function HotspotCard({ hotspot, onClose }) {
  if (!hotspot) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ type: 'spring', damping: 28, stiffness: 220 }}
      className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-40 w-80 max-w-[calc(100vw-2rem)]"
    >
      <div className="relative bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="w-8 h-px bg-[#38BDF8] mb-4" />
        <h3 className="text-lg font-medium text-[#F8FAFC] pr-8 leading-tight">{hotspot.title}</h3>
        <p className="mt-3 text-sm text-slate-400 leading-relaxed">{hotspot.description}</p>
        <div className="mt-5 pt-4 border-t border-slate-800">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-3">Specifications</p>
          <div className="space-y-2">
            {hotspot.specs.map((spec) => (
              <div key={spec} className="text-xs text-slate-300 flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-[#38BDF8]" />
                {spec}
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
