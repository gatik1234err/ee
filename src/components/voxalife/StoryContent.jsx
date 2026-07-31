import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Battery, Activity, Cpu, ChevronDown, ChevronRight } from 'lucide-react';
import { ColorSwitcher } from './ColorSwitcher';
import { SpecsSection } from './SpecsSection';

export function StoryContent({ colorVariant, setColorVariant, scrollProgress }) {
  return (
    <div className="relative z-10">
      {/* ===== SECTION 1: HERO ===== */}
      <section className="h-screen flex flex-col items-center justify-center px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.8 }}
          className="text-center pointer-events-none"
        >
          <p className="text-xs md:text-sm uppercase tracking-[0.4em] text-[#38BDF8] mb-6">
            GraphineLabs Smart Electrolarynx
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extralight tracking-tight text-[#F8FAFC] leading-[1.05]">
            Give Your Voice
            <br />a Second Chance
          </h1>
          <p className="mt-8 text-base md:text-lg text-slate-400 max-w-xl mx-auto leading-relaxed">
            A next-generation electrolarynx engineered for comfort, clarity, and confidence.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.6, duration: 0.8 }}
          className="mt-10 flex gap-4 pointer-events-auto"
        >
          <Link to="/product" className="px-8 py-3.5 rounded-full bg-[#38BDF8] text-[#020617] font-medium text-sm hover:bg-[#7DD3FC] transition-all hover:scale-105 active:scale-95">
            Buy Now
          </Link>
          <button className="px-8 py-3.5 rounded-full border border-slate-700 text-[#F8FAFC] text-sm hover:border-[#38BDF8] hover:bg-white/5 transition-all">
            Watch Demo
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.2, duration: 0.8 }}
          className="absolute bottom-24 text-slate-600 text-xs flex flex-col items-center gap-2"
        >
          <span className="uppercase tracking-[0.2em]">Scroll to explore</span>
          <ChevronDown className="w-4 h-4 animate-pulse" />
        </motion.div>
      </section>

      {/* ===== SECTION 2: PREMIUM FINISH ===== */}
      <section className="h-screen flex items-center" id="features">
        <div className="ml-[5%] md:ml-[8%] max-w-md">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.4 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-xs uppercase tracking-[0.3em] text-[#38BDF8] mb-4">Precision Engineering</p>
            <h2 className="text-4xl md:text-5xl font-light text-[#F8FAFC] leading-tight">Premium Finish</h2>
            <p className="mt-5 text-slate-400 leading-relaxed">
              Every surface is crafted from aerospace-grade materials, finished to medical standards, and assembled with obsessive attention to detail.
            </p>
            <div className="mt-10 space-y-4">
              {[
                { label: 'Precision Housing', desc: 'Anodized aluminum body' },
                { label: 'Ergonomic Grip', desc: 'Medical-grade silicone' },
                { label: 'Silent Activation Button', desc: 'Frosted tactile dome' },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false, amount: 0.5 }}
                  transition={{ delay: i * 0.12, duration: 0.6 }}
                  className="flex items-start gap-4"
                >
                  <div className="mt-2.5 w-10 h-px bg-gradient-to-r from-[#38BDF8] to-transparent flex-shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-[#F8FAFC]">{item.label}</div>
                    <div className="text-xs text-slate-500">{item.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== SECTION 3: EXPLODED VIEW ===== */}
      <section className="relative" style={{ height: '130vh' }} id="technology">
        <div className="sticky top-0 h-screen flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-2xl px-4"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-[#38BDF8] mb-4">Anatomy of Speech</p>
            <h2 className="text-4xl md:text-5xl font-light text-[#F8FAFC]">Engineering Transparency</h2>
            <p className="mt-5 text-slate-400 leading-relaxed">
              Explore every component that powers clear, natural communication. From the precision vibration motor to the high-density battery, each part is engineered for reliability and performance.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ===== SECTION 4: COMPONENT HIGHLIGHT ===== */}
      <section className="relative" style={{ height: '200vh' }}>
        <div className="sticky top-0 h-screen flex items-center">
          <div className="w-full max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-6">
            {[
              { icon: Battery, title: 'Battery', text: 'Long-lasting rechargeable battery designed for extended daily use.' },
              { icon: Activity, title: 'Vibration Motor', text: 'Generates controlled vibrations that help produce clear speech.' },
              { icon: Cpu, title: 'Control Circuit', text: 'Compact electronics manage power, vibration control, and system stability.' },
            ].map((comp, i) => (
              <motion.div
                key={comp.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="bg-slate-900/40 backdrop-blur-md border border-slate-800/60 rounded-2xl p-6"
              >
                <comp.icon className="w-6 h-6 text-[#38BDF8] mb-4" />
                <h3 className="text-lg font-medium text-[#F8FAFC]">{comp.title}</h3>
                <p className="mt-2 text-sm text-slate-400 leading-relaxed">{comp.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION 5: VOICE GENERATION ===== */}
      <section className="h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl px-4"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-[#38BDF8] mb-4">Voice Generation</p>
          <h2 className="text-4xl md:text-5xl font-light text-[#F8FAFC]">How Speech is Created</h2>
          <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-4">
            {[
              { step: '01', title: 'Vibration Generated', desc: 'The motor produces controlled vibrations' },
              { step: '02', title: 'Transferred Through Tissue', desc: 'Vibration travels through the neck' },
              { step: '03', title: 'Converted to Speech', desc: 'Articulated into understandable words' },
            ].map((s, i) => (
              <div key={s.step} className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
                <div className="text-center">
                  <div className="text-xs text-[#38BDF8] mb-2 tracking-widest">{s.step}</div>
                  <div className="text-sm font-medium text-[#F8FAFC]">{s.title}</div>
                  <div className="text-xs text-slate-500 mt-1 max-w-[160px]">{s.desc}</div>
                </div>
                {i < 2 && (
                  <ChevronRight className="w-5 h-5 text-slate-600 rotate-90 md:rotate-0 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ===== SECTION 6: COLOR VARIANTS ===== */}
      <section className="h-screen flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-[#38BDF8] mb-4">Personalization</p>
          <h2 className="text-4xl md:text-5xl font-light text-[#F8FAFC]">Choose Your Finish</h2>
          <p className="mt-4 text-slate-400">Four premium colorways, each anodized to perfection.</p>
          <div className="mt-14">
            <ColorSwitcher colorVariant={colorVariant} setColorVariant={setColorVariant} />
          </div>
        </motion.div>
      </section>

      {/* ===== SECTION 7: SPECIFICATIONS ===== */}
      <section className="h-screen flex items-end justify-center pb-28" id="specs">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-5xl mx-auto px-4"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-[#38BDF8] mb-4 text-center">Technical Specifications</p>
          <h2 className="text-3xl md:text-4xl font-light text-[#F8FAFC] text-center mb-12">Built to Last</h2>
          <SpecsSection />
        </motion.div>
      </section>

      {/* ===== SECTION 8: ASSEMBLY + CTA ===== */}
      <section className="h-screen flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 1 }}
          className="text-center"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-[#38BDF8] mb-4">Ready to Speak</p>
          <h2 className="text-4xl md:text-6xl font-extralight text-[#F8FAFC] leading-tight max-w-2xl">
            Experience Natural
            <br />Communication
          </h2>
          <p className="mt-6 text-slate-400 max-w-lg mx-auto">
            Reclaim your voice with a device engineered for clarity, comfort, and confidence.
          </p>
          <p className="mt-8 text-2xl font-light text-[#F8FAFC]">From ₹20,000</p>
          <p className="mt-2 text-xs text-slate-500">Free shipping · 1-year warranty · 30-day returns</p>
          <div className="mt-10">
            <Link to="/product" className="inline-block px-10 py-4 rounded-full bg-[#38BDF8] text-[#020617] font-medium text-sm hover:bg-[#7DD3FC] transition-all hover:scale-105 active:scale-95">
              Buy Now
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
