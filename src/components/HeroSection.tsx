import { ArrowRight, ShieldCheck, Sun, Zap, Award } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative pt-12 pb-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center mb-12">
          {/* Unboxed editorial category */}
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-amber-600 mb-3 tracking-wider uppercase">
            <span>Residential Solar Engineering</span>
            <span aria-hidden="true">·</span>
            <span>NABCEP-Certified Installers</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 text-balance">
            Design your home solar array in interactive 3D.
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto mb-8">
            Simulate real sun trajectories across gabled and hip rooftops, customize 400W panel
            layouts, and compute exact 25-year financial savings before stepping onto the roof.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="#visualizer"
              className="flex items-center gap-2 px-6 py-3 text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap"
            >
              <span>Launch 3D Rooftop Studio</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href="#calculator"
              className="px-6 py-3 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer whitespace-nowrap"
            >
              Calculate Solar Savings
            </a>
          </div>
        </div>

        {/* 4-Column KPI Trust Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 bg-slate-50 border border-slate-200 rounded-2xl">
          <div className="p-3">
            <span className="text-xs text-slate-500 uppercase tracking-wide block mb-1">
              Photovoltaic Tech
            </span>
            <span className="text-xl sm:text-2xl font-bold font-mono text-slate-900 block">
              400W Modules
            </span>
            <span className="text-xs text-slate-500 mt-0.5 block">
              Tier-1 all-black monocrystalline
            </span>
          </div>

          <div className="p-3 border-l-0 md:border-l border-slate-200">
            <span className="text-xs text-slate-500 uppercase tracking-wide block mb-1">
              Federal Incentive
            </span>
            <span className="text-xl sm:text-2xl font-bold font-mono text-amber-600 block">
              30% Tax Credit
            </span>
            <span className="text-xs text-slate-500 mt-0.5 block">
              Inflation Reduction Act Sec 25D
            </span>
          </div>

          <div className="p-3 border-l-0 sm:border-l md:border-l border-slate-200">
            <span className="text-xs text-slate-500 uppercase tracking-wide block mb-1">
              Average Bill Relief
            </span>
            <span className="text-xl sm:text-2xl font-bold font-mono text-emerald-600 block">
              $1,840 / year
            </span>
            <span className="text-xs text-slate-500 mt-0.5 block">
              Immediate electric bill reduction
            </span>
          </div>

          <div className="p-3 border-l-0 md:border-l border-slate-200">
            <span className="text-xs text-slate-500 uppercase tracking-wide block mb-1">
              Coverage & Backing
            </span>
            <span className="text-xl sm:text-2xl font-bold font-mono text-slate-900 block">
              25-Yr Warranty
            </span>
            <span className="text-xs text-slate-500 mt-0.5 block">
              Power generation & roof penetration
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
