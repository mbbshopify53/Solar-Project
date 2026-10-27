import { useState } from 'react';
import {
  Sun,
  Battery,
  MapPin,
  Calendar,
  CheckCircle,
  X,
  ExternalLink,
  Star,
  Zap,
} from 'lucide-react';
import { ProjectCaseStudy, RoofType } from '../types/solar';
import { formatCurrency } from '../utils/solarCalculations';

const CASE_STUDIES: ProjectCaseStudy[] = [
  {
    id: 'case-1',
    title: 'The Morrison Residence',
    location: 'Austin, Texas',
    roofType: 'gabled',
    roofMaterial: 'Architectural Charcoal Shingle',
    systemSizeKw: 9.6,
    panelCount: 24,
    panelBrand: 'REC Alpha Pure-R 400W',
    inverterType: 'Enphase IQ8+ Microinverters',
    hasBatteryBackup: true,
    batteryModel: 'Enphase IQ 5P (10 kWh)',
    annualProductionKwh: 14200,
    annualSavingsUsd: 2280,
    utilityOffsetPercentage: 104,
    completionDate: 'June 2025',
    installDurationDays: 1,
    summary:
      'Gabled suburban residence configured with an east-west array split to capture morning irradiance and late afternoon peak AC cooling draw.',
    keyHighlights: [
      '104% whole-home electric utility offset',
      'Critter guard array mesh protecting against local wildlife',
      'Seamless microinverter per-panel shading optimization',
    ],
    homeowner: {
      name: 'David & Rachel M.',
      neighborhood: 'Barton Hills',
      quote:
        'The 3D preview was spot-on with how the panels look on our roof. Our electric bill went from $260/month to literally the $15 grid connection fee.',
      rating: 5,
    },
  },
  {
    id: 'case-2',
    title: 'Highland Modern Estate',
    location: 'Scottsdale, Arizona',
    roofType: 'hip',
    roofMaterial: 'Low-Slope Concrete Tile',
    systemSizeKw: 14.4,
    panelCount: 36,
    panelBrand: 'Qcells Q.TRON BLK-G2+ 400W',
    inverterType: 'SolarEdge Energy Hub HD-Wave',
    hasBatteryBackup: true,
    batteryModel: 'Tesla Powerwall 3 (13.5 kWh)',
    annualProductionKwh: 22800,
    annualSavingsUsd: 3450,
    utilityOffsetPercentage: 118,
    completionDate: 'September 2025',
    installDurationDays: 2,
    summary:
      'Sprawling hip roof estate requiring multi-facet layout engineering to preserve sightlines from the street while maximizing South and West solar angles.',
    keyHighlights: [
      'Black-on-black aesthetic panels flush with dark tile roof',
      'Full home air conditioning backup during extreme desert summer heat',
      'Electric Vehicle Level-2 48A charger integrated directly with solar inverter',
    ],
    homeowner: {
      name: 'Marcus Vance',
      neighborhood: 'DC Ranch',
      quote:
        'HelioCraft was the only installer willing to model all four hip facets in 3D before climbing on the roof. Cleanest wiring job I have ever seen.',
      rating: 5,
    },
  },
  {
    id: 'case-3',
    title: 'The Bennett Craftsman Home',
    location: 'Denver, Colorado',
    roofType: 'gabled',
    roofMaterial: 'Class-4 Impact-Resistant Asphalt Shingle',
    systemSizeKw: 8.0,
    panelCount: 20,
    panelBrand: 'Silfab Solar Prime 400W',
    inverterType: 'Enphase IQ8M Microinverters',
    hasBatteryBackup: false,
    annualProductionKwh: 12100,
    annualSavingsUsd: 1940,
    utilityOffsetPercentage: 96,
    completionDate: 'April 2025',
    installDurationDays: 1,
    summary:
      'Classic gabled craftsman home engineered to withstand heavy Colorado snow loads while delivering peak production throughout high-elevation sunshine.',
    keyHighlights: [
      'Heavy-duty SnapNrack racking rated for 60 PSF snow load',
      'Concealed attic conduit run with zero exterior electrical piping visible on front facade',
      'Net energy metering credits banked during sunny winter days',
    ],
    homeowner: {
      name: 'Elena & Tom B.',
      neighborhood: 'Wash Park',
      quote:
        'We were concerned about hail damage and conduit aesthetics. HelioCraft ran all wiring internally through the attic. It looks factory-built.',
      rating: 5,
    },
  },
  {
    id: 'case-4',
    title: 'Coastal Sun Rancher',
    location: 'San Diego, California',
    roofType: 'hip',
    roofMaterial: 'Composite Slate Shingles',
    systemSizeKw: 11.2,
    panelCount: 28,
    panelBrand: 'REC Alpha Pure Black 400W',
    inverterType: 'Enphase IQ8A Microinverters',
    hasBatteryBackup: true,
    batteryModel: 'FranklinWH aPower (13.6 kWh)',
    annualProductionKwh: 17600,
    annualSavingsUsd: 3120,
    utilityOffsetPercentage: 110,
    completionDate: 'August 2025',
    installDurationDays: 1,
    summary:
      'California NEM 3.0 solar + smart battery installation configured for autonomous time-of-use rate arbitrage and complete evening power self-sufficiency.',
    keyHighlights: [
      'Avoids California peak 4PM-9PM 64¢/kWh utility pricing via battery dispatch',
      'Salt-spray marine corrosion resistant hardware',
      'Certified 25-year roof flashing waterproofing',
    ],
    homeowner: {
      name: 'Craig Sterling',
      neighborhood: 'Point Loma',
      quote:
        'Under NEM 3.0, battery storage was essential. The system discharges in the evening when SDG&E rates spike. Our ROI timeline dropped to 5.5 years.',
      rating: 5,
    },
  },
  {
    id: 'case-5',
    title: 'Oakridge Family Residence',
    location: 'Raleigh, North Carolina',
    roofType: 'gabled',
    roofMaterial: 'Architectural Timberline Shingles',
    systemSizeKw: 10.4,
    panelCount: 26,
    panelBrand: 'Qcells Q.TRON 400W',
    inverterType: 'SolarEdge Energy Hub',
    hasBatteryBackup: false,
    annualProductionKwh: 14800,
    annualSavingsUsd: 1890,
    utilityOffsetPercentage: 102,
    completionDate: 'May 2025',
    installDurationDays: 1,
    summary:
      'South-facing gabled roof with steep 34° pitch optimized for year-round solar trajectory and Duke Energy net metering credits.',
    keyHighlights: [
      'Rapid 3-week turnaround from contract signing to PTO utility permission',
      'Dual roof plane layout avoiding dormer shade profiles',
      'Generates 100% of EV commuting power requirements',
    ],
    homeowner: {
      name: 'Brian & Chloe K.',
      neighborhood: 'North Hills',
      quote:
        'The team showed up at 7:30 AM, completed the entire 26-panel install by 3:00 PM, and passed county electrical inspection on the very first try.',
      rating: 5,
    },
  },
  {
    id: 'case-6',
    title: 'Palmetto Palms Villa',
    location: 'Orlando, Florida',
    roofType: 'hip',
    roofMaterial: 'Interlocking Spanish Clay Tile',
    systemSizeKw: 12.0,
    panelCount: 30,
    panelBrand: 'Mission Solar 400W All-Black',
    inverterType: 'Enphase IQ8+ Microinverters',
    hasBatteryBackup: true,
    batteryModel: 'Tesla Powerwall 3 (13.5 kWh)',
    annualProductionKwh: 18900,
    annualSavingsUsd: 2640,
    utilityOffsetPercentage: 106,
    completionDate: 'July 2025',
    installDurationDays: 2,
    summary:
      'Hurricane-rated tile roof installation engineered with tile replacement brackets to maintain factory waterproofing during tropical storms.',
    keyHighlights: [
      'Rated for 160 MPH Cat-5 hurricane wind loads',
      'Tile roof replacement flashing prevents clay tile cracking',
      'Automatic storm-watch battery charging protocol during severe weather',
    ],
    homeowner: {
      name: 'Jennifer Alvarez',
      neighborhood: 'Windermere',
      quote:
        'During the last tropical storm, our entire neighborhood lost power for 18 hours. Our lights, refrigerator, and AC never skipped a beat.',
      rating: 5,
    },
  },
];

export function ProjectGallery() {
  const [filter, setFilter] = useState<'all' | 'gabled' | 'hip' | 'battery'>('all');
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<ProjectCaseStudy | null>(null);

  const filteredProjects = CASE_STUDIES.filter((p) => {
    if (filter === 'all') return true;
    if (filter === 'gabled') return p.roofType === 'gabled';
    if (filter === 'hip') return p.roofType === 'hip';
    if (filter === 'battery') return p.hasBatteryBackup;
    return true;
  });

  return (
    <section id="gallery" className="py-20 bg-white border-t border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider block mb-2">
              Verified Residential Installations
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-3 text-balance">
              Recent solar layouts across gabled & hip roof architecture.
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Explore real homeowner installations with verified utility offsets, roof engineering
              blueprints, and verified production metrics.
            </p>
          </div>

          {/* Interactive Filter Tabs (Buttons with click handlers) */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start shrink-0">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                filter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Roofs ({CASE_STUDIES.length})
            </button>
            <button
              onClick={() => setFilter('gabled')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                filter === 'gabled'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Gabled Homes
            </button>
            <button
              onClick={() => setFilter('hip')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                filter === 'hip'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Hip Roofs
            </button>
            <button
              onClick={() => setFilter('battery')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                filter === 'battery'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Battery Backup
            </button>
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => setSelectedCaseStudy(project)}
              className="group bg-slate-50 hover:bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-6 transition-all duration-200 shadow-xs hover:shadow-md cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Clean unboxed metadata with typographic separators */}
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                  <span className="capitalize font-medium">{project.roofType} Roof</span>
                  <span aria-hidden="true">·</span>
                  <span>{project.location}</span>
                  <span aria-hidden="true">·</span>
                  <span>{project.completionDate}</span>
                </div>

                {/* Primary Title */}
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-600 transition-colors mb-2">
                  {project.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                  {project.summary}
                </p>

                {/* KPI Metrics Box */}
                <div className="grid grid-cols-2 gap-2 bg-white group-hover:bg-slate-50 border border-slate-200 rounded-xl p-3 mb-4 transition-colors">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wide block">
                      System Size
                    </span>
                    <span className="text-base font-bold font-mono text-slate-900">
                      {project.systemSizeKw} kW DC
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      {project.panelCount} × 400W Panels
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wide block">
                      Annual Savings
                    </span>
                    <span className="text-base font-bold font-mono text-emerald-600">
                      {formatCurrency(project.annualSavingsUsd)}/yr
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      {project.utilityOffsetPercentage}% Bill Offset
                    </span>
                  </div>
                </div>

                {/* Equipment Specs */}
                <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-200 pt-3">
                  <div className="flex items-center gap-1.5">
                    <Sun className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="truncate">{project.panelBrand}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                    <span className="truncate">{project.inverterType}</span>
                  </div>
                  {project.hasBatteryBackup && (
                    <div className="flex items-center gap-1.5">
                      <Battery className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span className="truncate">{project.batteryModel}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Card Action */}
              <div className="pt-4 mt-4 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-900 group-hover:text-amber-600 flex items-center gap-1">
                  View Full Case Study
                  <ExternalLink className="w-3.5 h-3.5" />
                </span>
                <span className="text-slate-400">{project.installDurationDays}-Day Install</span>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Case Study Inspector */}
        {selectedCaseStudy && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8">
              {/* Close Button */}
              <button
                onClick={() => setSelectedCaseStudy(null)}
                className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="mb-6">
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                  <span className="capitalize font-semibold text-amber-700">
                    {selectedCaseStudy.roofType} Roof Installation
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{selectedCaseStudy.location}</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900">{selectedCaseStudy.title}</h3>
              </div>

              {/* Full Metrics Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wide block">
                    Capacity
                  </span>
                  <span className="text-lg font-bold font-mono text-slate-900">
                    {selectedCaseStudy.systemSizeKw} kW
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {selectedCaseStudy.panelCount} Panels
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wide block">
                    Annual Output
                  </span>
                  <span className="text-lg font-bold font-mono text-slate-900">
                    {selectedCaseStudy.annualProductionKwh.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-slate-500">kWh/year</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wide block">
                    Utility Offset
                  </span>
                  <span className="text-lg font-bold font-mono text-emerald-600">
                    {selectedCaseStudy.utilityOffsetPercentage}%
                  </span>
                  <span className="text-[11px] text-emerald-700">Power Net Positive</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wide block">
                    Savings
                  </span>
                  <span className="text-lg font-bold font-mono text-slate-900">
                    {formatCurrency(selectedCaseStudy.annualSavingsUsd)}
                  </span>
                  <span className="text-[11px] text-slate-500">Average/year</span>
                </div>
              </div>

              {/* Architectural & Engineering Highlights */}
              <div className="mb-6 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Engineering Blueprint & Racking Details
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {selectedCaseStudy.summary}
                </p>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {selectedCaseStudy.keyHighlights.map((hl, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{hl}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Hardware Specifications */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 text-xs mb-6 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Photovoltaic Modules:</span>
                  <span className="font-semibold text-slate-900">
                    {selectedCaseStudy.panelBrand}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Inverter Architecture:</span>
                  <span className="font-semibold text-slate-900">
                    {selectedCaseStudy.inverterType}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Roof Surface:</span>
                  <span className="font-semibold text-slate-900">
                    {selectedCaseStudy.roofMaterial}
                  </span>
                </div>
                {selectedCaseStudy.hasBatteryBackup && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Storage Unit:</span>
                    <span className="font-semibold text-emerald-700">
                      {selectedCaseStudy.batteryModel}
                    </span>
                  </div>
                )}
              </div>

              {/* Verified Homeowner Review */}
              <div className="border-l-2 border-amber-400 pl-4 py-1 mb-6">
                <div className="flex items-center gap-1 mb-1">
                  {[...Array(selectedCaseStudy.homeowner.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs italic text-slate-700 mb-1">
                  "{selectedCaseStudy.homeowner.quote}"
                </p>
                <span className="text-[11px] font-semibold text-slate-900 block">
                  {selectedCaseStudy.homeowner.name} · {selectedCaseStudy.homeowner.neighborhood}
                </span>
              </div>

              {/* Modal Footer CTA */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setSelectedCaseStudy(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  Close
                </button>
                <a
                  href="#calculator"
                  onClick={() => setSelectedCaseStudy(null)}
                  className="px-5 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer"
                >
                  Estimate Sizing for My Roof
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
