import { useState } from 'react';
import {
  Sun,
  Maximize2,
  Minimize2,
  RotateCcw,
  Compass,
  ArrowRight,
  Eye,
  Sliders,
} from 'lucide-react';
import { RoofType, SolarLayoutConfig } from '../../types/solar';
import { calculateSunPosition } from '../../utils/solarCalculations';

interface SolarControlDockProps {
  config: SolarLayoutConfig;
  onChangeConfig: (newConfig: SolarLayoutConfig) => void;
  cameraPreset: 'perspective' | 'topDown' | 'front' | 'sunset';
  onChangeCameraPreset: (preset: 'perspective' | 'topDown' | 'front' | 'sunset') => void;
  onApplyToQuote: () => void;
}

export function SolarControlDock({
  config,
  onChangeConfig,
  cameraPreset,
  onChangeCameraPreset,
  onApplyToQuote,
}: SolarControlDockProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'sun' | 'panels' | 'roof' | 'camera'>('sun');

  const sunInfo = calculateSunPosition(config.timeOfDay, config.season);

  // Time format helper (e.g. 14.5 -> 2:30 PM)
  const formatTime = (timeDecimal: number) => {
    const hours = Math.floor(timeDecimal);
    const minutes = Math.round((timeDecimal - hours) * 60);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHour = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
    const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${displayHour}:${displayMinutes} ${period}`;
  };

  const systemKw = ((config.panelCount * config.panelWattage) / 1000).toFixed(1);

  return (
    <div
      className={`absolute bottom-4 left-1/2 -translate-x-1/2 w-[95%] max-w-4xl z-20 transition-all duration-300 ease-in-out ${
        isCollapsed ? 'translate-y-[calc(100%-42px)]' : 'translate-y-0'
      }`}
    >
      {/* Collapse / Expand Toggle Button pinned to top of dock */}
      <div className="flex justify-center mb-1">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-slate-200 bg-slate-900 border border-slate-700 rounded-t-lg shadow-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          {isCollapsed ? (
            <>
              <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Show 3D Studio Controls</span>
            </>
          ) : (
            <>
              <Minimize2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Zen / Cinema View</span>
            </>
          )}
        </button>
      </div>

      {/* Main Solid Dock Surface (No backdrop-filter over WebGL canvas) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-4 text-white">
        {/* Top Control Bar: Tabs + Quick Specs + Apply CTA */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          {/* Functional Navigation Tabs */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setActiveTab('sun')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                activeTab === 'sun'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>Sun & Shadows</span>
            </button>
            <button
              onClick={() => setActiveTab('panels')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                activeTab === 'panels'
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-sky-400" />
              <span>Panel Layout</span>
            </button>
            <button
              onClick={() => setActiveTab('roof')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                activeTab === 'roof'
                  ? 'bg-slate-800 text-slate-100 border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-slate-400" />
              <span>Roof Architecture</span>
            </button>
            <button
              onClick={() => setActiveTab('camera')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                activeTab === 'camera'
                  ? 'bg-slate-800 text-slate-100 border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-slate-400" />
              <span>Camera Views</span>
            </button>
          </div>

          {/* Real-time System Capacity Indicator & Apply CTA */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs">
              <span className="text-slate-400">Current Design:</span>
              <span className="font-mono font-semibold text-sky-400 tabular-nums">
                {config.panelCount} Panels
              </span>
              <span className="text-slate-600">·</span>
              <span className="font-mono font-bold text-amber-400 tabular-nums">
                {systemKw} kW DC
              </span>
            </div>

            <button
              onClick={onApplyToQuote}
              className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 rounded-lg shadow-sm transition-all cursor-pointer whitespace-nowrap"
            >
              <span>Apply Design to Quote</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Tab 1: Sun Trajectory & Diurnal Path */}
        {activeTab === 'sun' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 items-center">
            {/* Time of Day Slider */}
            <div className="md:col-span-2 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  Time of Day (Sun Position)
                </span>
                <span className="font-mono font-semibold text-amber-300 bg-amber-950/60 border border-amber-800/60 px-2 py-0.5 rounded text-[11px] tabular-nums">
                  {formatTime(config.timeOfDay)}
                </span>
              </div>
              <input
                type="range"
                min="6"
                max="18"
                step="0.25"
                value={config.timeOfDay}
                onChange={(e) =>
                  onChangeConfig({ ...config, timeOfDay: parseFloat(e.target.value) })
                }
                className="w-full h-1.5 bg-slate-750 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>06:00 AM (Sunrise)</span>
                <span>12:00 PM (Solar Noon)</span>
                <span>06:00 PM (Sunset)</span>
              </div>
            </div>

            {/* Sun Elevation & Season Switcher */}
            <div className="space-y-2 bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 text-xs">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-400">Solar Elevation:</span>
                <span className="font-mono text-slate-200 tabular-nums">
                  {Math.round(sunInfo.elevationDeg)}°
                </span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-400">Solar Azimuth:</span>
                <span className="font-mono text-slate-200 tabular-nums">
                  {Math.round(sunInfo.azimuthDeg)}°
                </span>
              </div>
              <div className="flex items-center gap-1 pt-1">
                {(['summer', 'equinox', 'winter'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => onChangeConfig({ ...config, season: s })}
                    className={`flex-1 py-1 text-[10px] capitalize rounded font-medium transition-colors cursor-pointer ${
                      config.season === s
                        ? 'bg-amber-500 text-slate-950 font-semibold'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Panel Layout & Quantity Adjuster */}
        {activeTab === 'panels' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 items-center">
            {/* Panel Slider & Quick Increment */}
            <div className="md:col-span-2 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">Panel Quantity (400W Monocrystalline)</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      onChangeConfig({
                        ...config,
                        panelCount: Math.max(12, config.panelCount - 2),
                      })
                    }
                    className="w-6 h-6 flex items-center justify-center bg-slate-800 hover:bg-slate-700 rounded text-slate-200 text-xs font-bold cursor-pointer"
                  >
                    -
                  </button>
                  <span className="font-mono font-bold text-sky-400 bg-sky-950/60 border border-sky-800/60 px-2 py-0.5 rounded text-[11px] tabular-nums">
                    {config.panelCount} Panels ({systemKw} kW)
                  </span>
                  <button
                    onClick={() =>
                      onChangeConfig({
                        ...config,
                        panelCount: Math.min(36, config.panelCount + 2),
                      })
                    }
                    className="w-6 h-6 flex items-center justify-center bg-slate-800 hover:bg-slate-700 rounded text-slate-200 text-xs font-bold cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
              <input
                type="range"
                min="12"
                max="36"
                step="2"
                value={config.panelCount}
                onChange={(e) =>
                  onChangeConfig({ ...config, panelCount: parseInt(e.target.value, 10) })
                }
                className="w-full h-1.5 bg-slate-750 rounded-lg appearance-none cursor-pointer accent-sky-400"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>12 Panels (4.8 kW)</span>
                <span>24 Panels (9.6 kW)</span>
                <span>36 Panels (14.4 kW)</span>
              </div>
            </div>

            {/* Quick Sizing Presets */}
            <div className="space-y-1.5 bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 text-xs">
              <span className="text-[11px] text-slate-400 block mb-1">Standard Home Sizes:</span>
              <div className="grid grid-cols-3 gap-1">
                {[
                  { label: 'Small', count: 16 },
                  { label: 'Medium', count: 24 },
                  { label: 'Large', count: 32 },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => onChangeConfig({ ...config, panelCount: preset.count })}
                    className={`py-1 text-[11px] rounded font-medium transition-colors cursor-pointer ${
                      config.panelCount === preset.count
                        ? 'bg-sky-500 text-slate-950 font-semibold'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Roof Architecture (Gabled vs Hip) & Pitch */}
        {activeTab === 'roof' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 items-center">
            {/* Roof Style Selector */}
            <div className="space-y-1.5">
              <span className="text-slate-300 text-xs font-medium block">
                Roof Configuration
              </span>
              <div className="flex gap-2">
                {(['gabled', 'hip'] as RoofType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => onChangeConfig({ ...config, roofType: type })}
                    className={`flex-1 py-2 px-3 text-xs capitalize rounded-lg font-medium border transition-colors cursor-pointer ${
                      config.roofType === type
                        ? 'bg-slate-100 text-slate-900 border-white font-semibold'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {type === 'gabled' ? 'Gabled Roof' : 'Hip Roof'}
                  </button>
                ))}
              </div>
            </div>

            {/* Roof Pitch / Tilt Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Pitch / Tilt Angle</span>
                <span className="font-mono text-slate-200 tabular-nums">{config.tiltAngle}°</span>
              </div>
              <input
                type="range"
                min="15"
                max="45"
                step="1"
                value={config.tiltAngle}
                onChange={(e) =>
                  onChangeConfig({ ...config, tiltAngle: parseInt(e.target.value, 10) })
                }
                className="w-full h-1.5 bg-slate-750 rounded-lg appearance-none cursor-pointer accent-slate-300"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>15° (Low Slope)</span>
                <span>30° (Optimal)</span>
                <span>45° (Steep)</span>
              </div>
            </div>

            {/* Compass Azimuth / Orientation */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">House Orientation</span>
                <span className="font-mono text-slate-200 tabular-nums">
                  {config.azimuth}° ({config.azimuth === 180 ? 'True South' : 'Rotated'})
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                step="15"
                value={config.azimuth}
                onChange={(e) =>
                  onChangeConfig({ ...config, azimuth: parseInt(e.target.value, 10) })
                }
                className="w-full h-1.5 bg-slate-750 rounded-lg appearance-none cursor-pointer accent-slate-300"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>0° N</span>
                <span>90° E</span>
                <span>180° S</span>
                <span>270° W</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Camera View Presets */}
        {activeTab === 'camera' && (
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3">
            <span className="text-slate-400 text-xs">Select Camera Perspective:</span>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'perspective', label: '3D Orbit View' },
                { id: 'topDown', label: 'Rooftop Inspector' },
                { id: 'front', label: 'Front Elevation' },
                { id: 'sunset', label: 'Golden Hour Angle' },
              ].map((view) => (
                <button
                  key={view.id}
                  onClick={() => onChangeCameraPreset(view.id as any)}
                  className={`px-3 py-1.5 text-xs rounded-lg font-medium border transition-colors cursor-pointer ${
                    cameraPreset === view.id
                      ? 'bg-slate-100 text-slate-900 border-white font-semibold'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {view.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                onChangeCameraPreset('perspective');
                onChangeConfig({ ...config, azimuth: 180, timeOfDay: 12.0 });
              }}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Scene</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
