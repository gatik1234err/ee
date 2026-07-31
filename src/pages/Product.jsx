import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Battery, Activity, Cpu, Shield, Truck, Check, Minus, Plus, ChevronLeft } from 'lucide-react';
import { COLOR_VARIANTS } from '@/components/voxalife/sceneUtils';
import { SpecsSection } from '@/components/voxalife/SpecsSection';
import { ProductViewer } from '@/components/voxalife/ProductViewer';

const PRICE = 20000;

export default function Product() {
  const [colorVariant, setColorVariant] = useState('titaniumSilver');
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  const selectedColor = COLOR_VARIANTS[colorVariant];

  const handleBuyNow = () => {
    navigate(`/checkout?color=${colorVariant}&qty=${quantity}`);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-[#F8FAFC]">
      {/* Sticky header */}
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-[#020617]/80 border-b border-slate-800/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-sm text-slate-400 hover:text-[#F8FAFC] transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </Link>
            <Link to="/" className="text-lg font-medium tracking-tight">GrapheneLabs</Link>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-slate-400">
            <a href="#features" className="hover:text-[#F8FAFC] transition-colors">Features</a>
            <a href="#specs" className="hover:text-[#F8FAFC] transition-colors">Specs</a>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400">₹{PRICE.toLocaleString('en-IN')}</span>
            <button onClick={handleBuyNow} className="px-5 py-2 rounded-full bg-[#38BDF8] text-[#020617] text-sm font-medium hover:bg-[#7DD3FC] transition-colors">Buy Now</button>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="max-w-4xl mx-auto px-6 pt-20 pb-8 text-center">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="text-xs uppercase tracking-[0.4em] text-[#38BDF8] mb-4">GrapheneLabs Smart Electrolarynx</motion.p>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }} className="text-5xl md:text-7xl font-extralight tracking-tight leading-[1.05]">Give Your Voice<br />a Second Chance</motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.4 }} className="mt-6 text-lg text-slate-400 max-w-xl mx-auto">From ₹{PRICE.toLocaleString('en-IN')}. Free shipping and a 1-year warranty included.</motion.p>
      </div>

      {/* Product visual — 3D */}
      <div className="max-w-4xl mx-auto px-6 mb-16">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.3 }} className="relative aspect-[4/3] rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800/50 overflow-hidden">
          <ProductViewer colorVariant={colorVariant} />
          <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none">
            <p className="text-sm text-slate-500">{selectedColor.name}</p>
          </div>
        </motion.div>
      </div>

      {/* Buy section */}
      <div className="max-w-2xl mx-auto px-6 pb-20">
        {/* Color selector */}
        <div className="mb-8">
          <span className="text-sm font-medium block mb-4">Color — {selectedColor.name}</span>
          <div className="flex gap-4">
            {Object.entries(COLOR_VARIANTS).map(([key, variant]) => (
              <button key={key} onClick={() => setColorVariant(key)} className={`relative w-12 h-12 rounded-full border-2 transition-all ${colorVariant === key ? 'border-[#38BDF8] scale-110' : 'border-slate-700 hover:border-slate-500'}`} style={{ background: variant.body }} aria-label={variant.name}>
                {colorVariant === key && <Check className="absolute inset-0 m-auto w-5 h-5" style={{ color: variant.body > '#888888' ? '#020617' : '#F8FAFC' }} />}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity */}
        <div className="mb-8">
          <span className="text-sm font-medium block mb-4">Quantity</span>
          <div className="flex items-center gap-4">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-full border border-slate-700 flex items-center justify-center hover:border-[#38BDF8] transition-colors"><Minus className="w-4 h-4" /></button>
            <span className="text-xl font-light w-10 text-center">{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 rounded-full border border-slate-700 flex items-center justify-center hover:border-[#38BDF8] transition-colors"><Plus className="w-4 h-4" /></button>
          </div>
        </div>

        {/* Price + Buy */}
        <div className="border-t border-slate-800 pt-8">
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-slate-400 text-sm">GrapheneLabs Smart Electrolarynx × {quantity}</span>
            <span className="text-2xl font-light">₹{(PRICE * quantity).toLocaleString('en-IN')}</span>
          </div>
          <div className="flex items-center justify-between mb-6 text-sm text-slate-500">
            <span>Shipping</span>
            <span className="text-[#38BDF8]">Free</span>
          </div>
          <button onClick={handleBuyNow} className="w-full py-4 rounded-full bg-[#38BDF8] text-[#020617] font-medium hover:bg-[#7DD3FC] transition-all hover:scale-[1.02] active:scale-[0.98]">Buy Now</button>
          <div className="mt-6 flex items-center justify-center gap-6 text-xs text-slate-500">
            <span className="flex items-center gap-1.5"><Truck className="w-3.5 h-3.5" /> Free shipping</span>
            <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> 1-year warranty</span>
            <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5" /> 30-day returns</span>
          </div>
        </div>
      </div>

      {/* Feature highlights */}
      <section id="features" className="max-w-5xl mx-auto px-6 py-20 border-t border-slate-800/50">
        <h2 className="text-3xl md:text-4xl font-light text-center mb-16">Why GrapheneLabs</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { icon: Battery, title: 'All-Day Battery', text: '16 hours of continuous use on a single 90-minute charge.' },
            { icon: Activity, title: 'Natural Speech', text: 'Precision vibration motor produces clear, natural-sounding speech.' },
            { icon: Cpu, title: 'Smart Electronics', text: '32-bit MCU manages power regulation and vibration control.' },
          ].map((f) => (
            <div key={f.title} className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-6">
              <f.icon className="w-6 h-6 text-[#38BDF8] mb-4" />
              <h3 className="text-lg font-medium">{f.title}</h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Specs */}
      <section id="specs" className="max-w-5xl mx-auto px-6 py-20 border-t border-slate-800/50">
        <p className="text-xs uppercase tracking-[0.3em] text-[#38BDF8] mb-4 text-center">Technical Specifications</p>
        <h2 className="text-3xl md:text-4xl font-light text-center mb-12">Built to Last</h2>
        <SpecsSection />
      </section>

      {/* Bottom CTA */}
      <section className="max-w-2xl mx-auto px-6 py-24 text-center border-t border-slate-800/50">
        <h2 className="text-4xl md:text-5xl font-extralight">Ready to Speak?</h2>
        <p className="mt-4 text-slate-400">Reclaim your voice today.</p>
        <button onClick={handleBuyNow} className="mt-8 px-10 py-4 rounded-full bg-[#38BDF8] text-[#020617] font-medium hover:bg-[#7DD3FC] transition-all hover:scale-105">Buy Now — ₹{PRICE.toLocaleString('en-IN')}</button>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 py-8 px-6 text-center text-xs text-slate-600">
        <p>GrapheneLabs © 2026. All rights reserved.</p>
      </footer>
    </div>
  );
}
