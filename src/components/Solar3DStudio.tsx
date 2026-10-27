import { useState } from 'react';
import { Sparkles, Sun, Compass, Layers, ShieldCheck } from 'lucide-react';
import { SolarLayoutConfig } from '../types/solar';
import { SolarRoofScene } from './3d/SolarRoofScene';
import { SolarControlDock } from './3d/SolarControlDock';

interface Solar3DStudioProps {
  config: SolarLayoutConfig;
  onChangeConfig: (config: SolarLayoutConfig) => void;
  onApplyToQuote: () => void;
}

export function Solar3DStudio({ config, onChangeConfig, onApplyToQuote }: Solar3DStudioProps) {
  const [cameraPreset, setCameraPreset] = useState<'perspective' | 'topDown' | 'front' | 'sunset'>(
    'perspective'
  );
  const [hoveredPanel, setHoveredPanel] = useState<string | null>(null);

  const systemKw = ((config.panelCount * config.panelWattage) / 1000).toFixed(1);

  return (
    <section id="visualizer" className="relative bg-slate-950 text-white py-8 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1 tracking-wider uppercase">
              <Sun className="w-3.5 h-3.5" />
              <span>Real-Time Photovoltaic Simulation</span>
              <span aria-hidden="true">·</span>
              <span>Diurnal Sun Trajectory</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Interactive 3D Rooftop Solar Visualizer
            </h2>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
              <span className="text-slate-400">Panels:</span>
              <strong className="text-sky-400 font-mono">{config.panelCount}</strong>
              <span className="text-slate-600">·</span>
              <strong className="text-amber-400 font-mono">{systemKw} kW DC</strong>
            </span>
            <span className="hidden md:inline-block text-slate-500">
              Left-drag to rotate · Right-drag to pan · Scroll to zoom
            </span>
          </div>
        </div>
      </div>

      {/* 3D Viewport Frame */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative w-full h-[620px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
          {/* Top Left Floating Spec Badge */}
          <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
            <div className="bg-slate-900/90 border border-slate-800 rounded-lg px-3 py-2 text-xs shadow-md">
              <div className="flex items-center gap-2">
                <span className="capitalize font-bold text-slate-100">
                  {config.roofType} Roof
                </span>
                <span className="text-slate-500">·</span>
                <span className="text-slate-400 font-mono">{config.tiltAngle}° Pitch</span>
                <span className="text-slate-500">·</span>
                <span className="text-amber-400 font-mono">{systemKw} kW</span>
              </div>
              {hoveredPanel && (
                <div className="mt-1 pt-1 border-t border-slate-800 text-[11px] text-sky-400 font-mono">
                  Inspecting: {hoveredPanel} (400W Monocrystalline)
                </div>
              )}
            </div>
          </div>

          {/* Top Right Quick Hint */}
          <div className="absolute top-4 right-4 z-20 hidden sm:block">
            <div className="bg-slate-900/90 border border-slate-800 rounded-lg px-3 py-1.5 text-[11px] text-slate-400 shadow-md">
              Dynamic Shadows & Sun Orbit Active
            </div>
          </div>

          {/* Three.js Canvas Scene */}
          <SolarRoofScene
            config={config}
            cameraPreset={cameraPreset}
            onHoverPanel={setHoveredPanel}
          />

          {/* Sleek Ergonomic Collapsible Bottom Control Dock */}
          <SolarControlDock
            config={config}
            onChangeConfig={onChangeConfig}
            cameraPreset={cameraPreset}
            onChangeCameraPreset={setCameraPreset}
            onApplyToQuote={onApplyToQuote}
          />
        </div>
      </div>
    </section>
  );
}
