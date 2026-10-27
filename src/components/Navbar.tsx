import { Sun, ClipboardList } from 'lucide-react';

interface NavbarProps {
  onOpenLeadsDrawer: () => void;
  leadCount: number;
}

export function Navbar({ onOpenLeadsDrawer, leadCount }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#"
          className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-slate-900 whitespace-nowrap shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
            <Sun className="w-5 h-5 fill-slate-950 text-slate-950" />
          </div>
          <span>HelioCraft Solar</span>
        </a>

        {/* Zone 2: 4-5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-600">
          <a
            href="#visualizer"
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
          >
            3D Visualizer
          </a>
          <a
            href="#calculator"
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
          >
            Savings Calculator
          </a>
          <a
            href="#gallery"
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
          >
            Project Gallery
          </a>
          <a
            href="#process"
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
          >
            Installation Process
          </a>
          <button
            type="button"
            onClick={onOpenLeadsDrawer}
            className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <ClipboardList className="w-3.5 h-3.5 text-slate-500" />
            <span>Lead Manager</span>
            {leadCount > 0 && (
              <span className="font-mono text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-bold">
                {leadCount}
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#calculator"
            className="px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-xs transition-colors whitespace-nowrap shrink-0"
          >
            Request Free Quote
          </a>
        </div>
      </div>
    </header>
  );
}
