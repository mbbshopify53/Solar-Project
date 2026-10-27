import { Sun, ShieldCheck } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2 text-white font-extrabold text-base tracking-tight">
              <div className="w-6 h-6 rounded bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                <Sun className="w-4 h-4 fill-slate-950 text-slate-950" />
              </div>
              <span>HelioCraft Solar</span>
            </div>
            <p className="text-slate-400 text-xs max-w-sm leading-relaxed">
              Precision residential solar engineering, interactive 3D layout simulation, and
              certified clean energy installations backed by a 25-year comprehensive power warranty.
            </p>
            <div className="text-[11px] text-slate-500 space-y-1">
              <div>Contractor License: C-10 Electrical & C-46 Solar #1084291</div>
              <div>NABCEP PV Installation Professional Certification #PV-041920-019284</div>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <span className="text-white font-semibold block mb-3">Explore Platform</span>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#visualizer" className="hover:text-white transition-colors">
                  3D Rooftop Visualizer
                </a>
              </li>
              <li>
                <a href="#calculator" className="hover:text-white transition-colors">
                  Savings Calculator & Sizing
                </a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-white transition-colors">
                  Residential Project Gallery
                </a>
              </li>
              <li>
                <a href="#process" className="hover:text-white transition-colors">
                  4-Step Installation Standard
                </a>
              </li>
            </ul>
          </div>

          {/* Clean Energy Incentives */}
          <div>
            <span className="text-white font-semibold block mb-3">Solar Incentives</span>
            <ul className="space-y-2 text-xs">
              <li className="text-slate-400">30% Federal ITC Tax Credit</li>
              <li className="text-slate-400">Net Energy Metering (NEM)</li>
              <li className="text-slate-400">Smart Battery Time-of-Use Arbitrage</li>
              <li className="text-slate-400">$0 Down Solar Ownership Financing</li>
            </ul>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} HelioCraft Solar Technologies Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Warranty Disclosures</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
