import { Link } from 'react-router-dom';

export function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 px-6 py-5 flex items-center justify-between">
      <div className="text-lg font-medium tracking-tight text-[#F8FAFC]">GrapheneLabs</div>
      <div className="hidden md:flex items-center gap-8 text-sm text-slate-400">
        <a href="#features" className="hover:text-[#F8FAFC] transition-colors">Features</a>
        <a href="#technology" className="hover:text-[#F8FAFC] transition-colors">Technology</a>
        <a href="#specs" className="hover:text-[#F8FAFC] transition-colors">Specs</a>
      </div>
      <Link to="/product" className="px-5 py-2 rounded-full bg-white/10 backdrop-blur border border-white/10 text-sm text-[#F8FAFC] hover:bg-white/20 transition-colors">
        Buy Now
      </Link>
    </nav>
  );
}
