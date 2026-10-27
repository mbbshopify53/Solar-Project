import { useState, useId } from 'react';
import {
  Zap,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Home,
  Sun,
  Battery,
  ArrowRight,
  ArrowLeft,
  Download,
  PhoneCall,
  Sparkles,
} from 'lucide-react';
import {
  LeadFormData,
  RoofType,
  SolarCalculationResult,
  SolarLayoutConfig,
  SubmittedLeadRecord,
} from '../types/solar';
import { calculateSolarMetrics, formatCurrency } from '../utils/solarCalculations';
import { RoiChart } from './RoiChart';

interface SavingsCalculatorProps {
  layoutConfig: SolarLayoutConfig;
  onLeadSubmitted: (lead: SubmittedLeadRecord) => void;
}

export function SavingsCalculator({ layoutConfig, onLeadSubmitted }: SavingsCalculatorProps) {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [monthlyElectricBill, setMonthlyElectricBill] = useState(240);
  const [roofType, setRoofType] = useState<RoofType>(layoutConfig.roofType);
  const [roofAge, setRoofAge] = useState(6);
  const [sunExposure, setSunExposure] = useState<'high' | 'moderate' | 'partial'>('high');
  const [includeBattery, setIncludeBattery] = useState(false);

  // Homeowner Contact Details
  const [contactData, setContactData] = useState<LeadFormData>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: 'CA',
    zipCode: '',
    monthlyElectricBill: 240,
    roofType: layoutConfig.roofType,
    roofAgeYears: 6,
    sunExposure: 'high',
    includeBattery: false,
    preferredContactMethod: 'phone',
    timeframe: '1-3_months',
    notes: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submittedLead, setSubmittedLead] = useState<SubmittedLeadRecord | null>(null);

  // Calculated metrics synced with 3D design and user inputs
  const calculation: SolarCalculationResult = calculateSolarMetrics(
    {
      panelCount: layoutConfig.panelCount,
      tiltAngle: layoutConfig.tiltAngle,
      azimuth: layoutConfig.azimuth,
      panelWattage: layoutConfig.panelWattage,
    },
    monthlyElectricBill,
    includeBattery
  );

  // Validate contact form
  const validateContactForm = () => {
    const errors: Record<string, string> = {};
    if (!contactData.fullName.trim()) errors.fullName = 'Please enter your full name';
    if (!contactData.email.trim() || !contactData.email.includes('@'))
      errors.email = 'Please provide a valid email address';
    if (!contactData.phone.trim() || contactData.phone.length < 10)
      errors.phone = 'Please provide a valid 10-digit phone number';
    if (!contactData.address.trim()) errors.address = 'Street address is required';
    if (!contactData.zipCode.trim() || contactData.zipCode.length < 5)
      errors.zipCode = 'Valid ZIP code required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateContactForm()) return;

    const leadRecord: SubmittedLeadRecord = {
      ...contactData,
      id: `HC-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toISOString(),
      status: 'new',
      monthlyElectricBill,
      roofType,
      roofAgeYears: roofAge,
      sunExposure,
      includeBattery,
      designedSystemSizeKw: calculation.systemSizeKw,
      designedPanelCount: layoutConfig.panelCount,
      designedTiltAngle: layoutConfig.tiltAngle,
      calculation,
    };

    // Save to localStorage
    try {
      const existing = JSON.parse(localStorage.getItem('heliocraft_leads') || '[]');
      localStorage.setItem('heliocraft_leads', JSON.stringify([leadRecord, ...existing]));
    } catch {
      // ignore storage error
    }

    setSubmittedLead(leadRecord);
    onLeadSubmitted(leadRecord);
  };

  return (
    <div id="calculator" className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider block mb-2">
            Instant Roof Sizing & Savings Estimator
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-4 text-balance">
            Calculate your custom solar investment & 25-year financial return.
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            Our engineering model pairs your roof dimensions and local utility rates with the 3D
            panel layout you just configured, calculating exact bill offsets and federal tax credit
            incentives.
          </p>
        </div>

        {/* 4-Step Progress Indicator */}
        <div className="mb-8 bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { num: 1, title: 'Roof & Property' },
              { num: 2, title: 'Electric Consumption' },
              { num: 3, title: 'Savings Breakdown' },
              { num: 4, title: 'Schedule Assessment' },
            ].map((step) => (
              <button
                key={step.num}
                onClick={() => {
                  if (submittedLead) return;
                  if (step.num <= 3 || validateContactForm()) {
                    setCurrentStep(step.num as any);
                  }
                }}
                className={`flex items-center gap-2.5 p-2 rounded-lg text-left transition-colors cursor-pointer ${
                  currentStep === step.num
                    ? 'bg-amber-50 text-amber-900 border border-amber-200'
                    : currentStep > step.num
                    ? 'text-slate-700 hover:bg-slate-50'
                    : 'text-slate-400'
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    currentStep === step.num
                      ? 'bg-amber-500 text-white'
                      : currentStep > step.num
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {currentStep > step.num ? '✓' : step.num}
                </span>
                <span className="text-xs font-semibold whitespace-nowrap">{step.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Success Confirmation View */}
        {submittedLead ? (
          <div className="bg-white border border-emerald-200 rounded-2xl p-8 sm:p-12 shadow-sm text-center max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full inline-block mb-3">
              Quote Request Confirmed · ID: {submittedLead.id}
            </span>

            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
              Thank You, {submittedLead.fullName}!
            </h3>

            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              Your custom 3D solar system design ({calculation.systemSizeKw} kW DC with{' '}
              {layoutConfig.panelCount} panels) has been received by our engineering team. A
              NABCEP-certified solar design specialist will review your satellite roof profile and
              contact you via {submittedLead.preferredContactMethod} within 1 business day.
            </p>

            {/* Snapshot Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-8 text-left grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <span className="text-xs text-slate-500 block">System Capacity</span>
                <span className="text-base font-bold text-slate-900 font-mono">
                  {calculation.systemSizeKw} kW DC
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block">Est. Annual Savings</span>
                <span className="text-base font-bold text-emerald-600 font-mono">
                  {formatCurrency(calculation.estimatedAnnualSavings)}/yr
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block">Federal Tax Credit</span>
                <span className="text-base font-bold text-amber-600 font-mono">
                  {formatCurrency(calculation.federalTaxCreditValue)}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block">25-Year Net Benefit</span>
                <span className="text-base font-bold text-slate-900 font-mono">
                  {formatCurrency(calculation.estimated25YrNetSavings)}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block">CO₂ Offset</span>
                <span className="text-base font-bold text-slate-900 font-mono">
                  {calculation.co2OffsetMetricTonsYear} Tons/yr
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block">Roof Configuration</span>
                <span className="text-base font-semibold capitalize text-slate-900">
                  {roofType} Roof
                </span>
              </div>
            </div>

            <div className="mb-8 text-left">
              <RoiChart
                calculation={calculation}
                monthlyElectricBill={monthlyElectricBill}
              />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Print Design Summary</span>
              </button>

              <button
                onClick={() => {
                  setSubmittedLead(null);
                  setCurrentStep(1);
                }}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                Configure Another Property
              </button>
            </div>
          </div>
        ) : (
          /* Multi-Step Interactive Funnel */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 7 Columns: Active Step Form */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
              {/* STEP 1: Roof & Property Profile */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">
                      Step 1: Rooftop Architecture & Sun Profile
                    </h3>
                    <p className="text-xs text-slate-500">
                      We calibrate panel spacing and pitch based on your home's structural geometry.
                    </p>
                  </div>

                  {/* Roof Style Selector */}
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-2">
                      Roof Architecture Style
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {(['gabled', 'hip'] as RoofType[]).map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setRoofType(type)}
                          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                            roofType === type
                              ? 'border-amber-500 bg-amber-50/50 ring-2 ring-amber-500/20'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-bold capitalize text-slate-900">
                              {type === 'gabled' ? 'Gabled Roof' : 'Hip Roof'}
                            </span>
                            {roofType === type && (
                              <CheckCircle2 className="w-4 h-4 text-amber-600" />
                            )}
                          </div>
                          <span className="text-xs text-slate-500">
                            {type === 'gabled'
                              ? 'Dual sloping planes with triangular end walls. Excellent solar surface area.'
                              : 'Four sloping planes meeting at a center ridge. High wind resistance.'}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sun Exposure */}
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-2">
                      Estimated Rooftop Sun Exposure
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'high', label: 'Full Sunlight', desc: 'No tree shade' },
                        { id: 'moderate', label: 'Moderate', desc: 'Occasional shade' },
                        { id: 'partial', label: 'Partial Shade', desc: 'Tall trees nearby' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setSunExposure(item.id as any)}
                          className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                            sunExposure === item.id
                              ? 'border-amber-500 bg-amber-50 text-slate-900 font-semibold ring-2 ring-amber-500/20'
                              : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <Sun
                            className={`w-5 h-5 mx-auto mb-1 ${
                              sunExposure === item.id ? 'text-amber-500' : 'text-slate-400'
                            }`}
                          />
                          <span className="text-xs block font-medium">{item.label}</span>
                          <span className="text-[10px] text-slate-400">{item.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Roof Age Slider */}
                  <div>
                    <div className="flex justify-between items-center mb-1 text-xs">
                      <span className="font-semibold text-slate-700">Approximate Roof Age</span>
                      <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                        {roofAge} Years
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="25"
                      value={roofAge}
                      onChange={(e) => setRoofAge(parseInt(e.target.value, 10))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                    <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                      <span>Brand New (1 yr)</span>
                      <span>Mid-life (10 yrs)</span>
                      <span>20+ yrs (Candidate for solar + re-roof bundle)</span>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                    >
                      <span>Continue to Electric Usage</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Electric Consumption */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">
                      Step 2: Monthly Electricity Usage & Battery
                    </h3>
                    <p className="text-xs text-slate-500">
                      Tell us what you currently pay your utility company so we can calculate your
                      exact savings.
                    </p>
                  </div>

                  {/* Monthly Bill Slider */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-semibold text-slate-700">
                        Average Monthly Electric Bill
                      </span>
                      <span className="text-2xl font-bold font-mono text-amber-600 tabular-nums">
                        ${monthlyElectricBill}/mo
                      </span>
                    </div>
                    <input
                      type="range"
                      min="80"
                      max="650"
                      step="10"
                      value={monthlyElectricBill}
                      onChange={(e) => setMonthlyElectricBill(parseInt(e.target.value, 10))}
                      className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                    <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                      <span>$80/mo (Modest usage)</span>
                      <span>$240/mo (Average home)</span>
                      <span>$650+/mo (High AC / EV charging)</span>
                    </div>
                  </div>

                  {/* Battery Storage Addon */}
                  <div className="border border-slate-200 rounded-xl p-4 flex items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                        <Battery className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-sm font-bold text-slate-900 block">
                          Add 13.5 kWh Home Battery Storage
                        </span>
                        <span className="text-xs text-slate-500">
                          Provides seamless whole-home backup during blackout emergencies and peak
                          TOU rate optimization.
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIncludeBattery(!includeBattery)}
                      className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer whitespace-nowrap ${
                        includeBattery
                          ? 'bg-sky-600 text-white border-sky-600'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {includeBattery ? 'Included ✓' : '+ Add Battery'}
                    </button>
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                    >
                      <span>View Financial Breakdown</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Financial ROI Breakdown */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">
                      Step 3: Engineering Sizing & 25-Year ROI
                    </h3>
                    <p className="text-xs text-slate-500">
                      Based on your {calculation.systemSizeKw} kW design from the 3D studio and $
                      {monthlyElectricBill}/mo utility bill.
                    </p>
                  </div>

                  {/* Highlight Metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                      <span className="text-[11px] text-slate-500 uppercase tracking-wide block mb-1">
                        System Capacity
                      </span>
                      <span className="text-xl font-bold font-mono text-slate-900">
                        {calculation.systemSizeKw} kW DC
                      </span>
                      <span className="text-[11px] text-slate-500 block mt-0.5">
                        {layoutConfig.panelCount} × 400W Modules
                      </span>
                    </div>

                    <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-4">
                      <span className="text-[11px] text-amber-700 uppercase tracking-wide block mb-1">
                        30% Federal ITC
                      </span>
                      <span className="text-xl font-bold font-mono text-amber-700">
                        {formatCurrency(calculation.federalTaxCreditValue)}
                      </span>
                      <span className="text-[11px] text-amber-600 block mt-0.5">
                        Direct Tax Credit
                      </span>
                    </div>

                    <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-4">
                      <span className="text-[11px] text-emerald-700 uppercase tracking-wide block mb-1">
                        Annual Savings
                      </span>
                      <span className="text-xl font-bold font-mono text-emerald-700">
                        {formatCurrency(calculation.estimatedAnnualSavings)}
                      </span>
                      <span className="text-[11px] text-emerald-600 block mt-0.5">
                        {calculation.monthlyOffsetPercentage}% Bill Offset
                      </span>
                    </div>
                  </div>

                  {/* Financial Detail Table */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                    <div className="bg-slate-100 px-4 py-2.5 font-semibold text-slate-700 border-b border-slate-200">
                      Estimated Cost & Financial Summary
                    </div>
                    <div className="divide-y divide-slate-100">
                      <div className="px-4 py-2.5 flex justify-between">
                        <span className="text-slate-600">Turnkey Installed System Cost</span>
                        <span className="font-mono font-medium text-slate-900">
                          {formatCurrency(calculation.estimatedGrossCost)}
                        </span>
                      </div>
                      <div className="px-4 py-2.5 flex justify-between bg-emerald-50/30">
                        <span className="text-emerald-800 font-medium">
                          Less: 30% Federal Clean Energy Tax Credit
                        </span>
                        <span className="font-mono font-semibold text-emerald-700">
                          - {formatCurrency(calculation.federalTaxCreditValue)}
                        </span>
                      </div>
                      <div className="px-4 py-2.5 flex justify-between bg-slate-50 font-bold">
                        <span className="text-slate-900">Net Out-of-Pocket System Investment</span>
                        <span className="font-mono text-slate-900">
                          {formatCurrency(calculation.netSystemCost)}
                        </span>
                      </div>
                      <div className="px-4 py-2.5 flex justify-between">
                        <span className="text-slate-600">Estimated Payback Period</span>
                        <span className="font-mono font-semibold text-slate-900">
                          ~{calculation.paybackPeriodYears} Years
                        </span>
                      </div>
                      <div className="px-4 py-2.5 flex justify-between bg-amber-50/40">
                        <span className="text-amber-900 font-semibold">
                          25-Year Cumulative Net Profit & Equity
                        </span>
                        <span className="font-mono font-bold text-amber-700 text-sm">
                          {formatCurrency(calculation.estimated25YrNetSavings)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 25-Year ROI Timeline Chart */}
                  <RoiChart
                    calculation={calculation}
                    monthlyElectricBill={monthlyElectricBill}
                  />

                  <div className="pt-4 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(4)}
                      className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer shadow-xs"
                    >
                      <span>Lock In Estimate & Book Site Visit</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: Homeowner Contact & Booking */}
              {currentStep === 4 && (
                <form onSubmit={handleSubmitLead} className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">
                      Step 4: Request Free Drone & Site Assessment
                    </h3>
                    <p className="text-xs text-slate-500">
                      Zero obligation. We will verify your roof shingles, electric panel amp
                      rating, and send you a detailed engineering schematic.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Sarah Jenkins"
                        value={contactData.fullName}
                        onChange={(e) =>
                          setContactData({ ...contactData, fullName: e.target.value })
                        }
                        className={`w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 ${
                          formErrors.fullName ? 'border-red-400 bg-red-50/20' : 'border-slate-200'
                        }`}
                      />
                      {formErrors.fullName && (
                        <span className="text-[10px] text-red-500 block mt-0.5">
                          {formErrors.fullName}
                        </span>
                      )}
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        placeholder="sarah@example.com"
                        value={contactData.email}
                        onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                        className={`w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 ${
                          formErrors.email ? 'border-red-400 bg-red-50/20' : 'border-slate-200'
                        }`}
                      />
                      {formErrors.email && (
                        <span className="text-[10px] text-red-500 block mt-0.5">
                          {formErrors.email}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        placeholder="(555) 000-0000"
                        value={contactData.phone}
                        onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                        className={`w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 ${
                          formErrors.phone ? 'border-red-400 bg-red-50/20' : 'border-slate-200'
                        }`}
                      />
                      {formErrors.phone && (
                        <span className="text-[10px] text-red-500 block mt-0.5">
                          {formErrors.phone}
                        </span>
                      )}
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Installation Timeframe
                      </label>
                      <select
                        value={contactData.timeframe}
                        onChange={(e) =>
                          setContactData({ ...contactData, timeframe: e.target.value as any })
                        }
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                      >
                        <option value="immediate">Immediate (Ready to install this month)</option>
                        <option value="1-3_months">Next 1 to 3 Months</option>
                        <option value="3-6_months">3 to 6 Months</option>
                        <option value="exploring">Just Gathering Preliminary Figures</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Street Address & ZIP Code *
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        placeholder="Street Address (e.g. 742 Evergreen Terrace)"
                        value={contactData.address}
                        onChange={(e) =>
                          setContactData({ ...contactData, address: e.target.value })
                        }
                        className={`col-span-2 px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 ${
                          formErrors.address ? 'border-red-400 bg-red-50/20' : 'border-slate-200'
                        }`}
                      />
                      <input
                        type="text"
                        placeholder="ZIP Code"
                        value={contactData.zipCode}
                        onChange={(e) =>
                          setContactData({ ...contactData, zipCode: e.target.value })
                        }
                        className={`px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 ${
                          formErrors.zipCode ? 'border-red-400 bg-red-50/20' : 'border-slate-200'
                        }`}
                      />
                    </div>
                    {(formErrors.address || formErrors.zipCode) && (
                      <span className="text-[10px] text-red-500 block mt-0.5">
                        {formErrors.address || formErrors.zipCode}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Special Rooftop Notes (Optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Roof was replaced 4 years ago, prefer all-black panels, interested in EV charger installation"
                      value={contactData.notes}
                      onChange={(e) => setContactData({ ...contactData, notes: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>

                  <div className="pt-3 flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>

                    <button
                      type="submit"
                      className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-all cursor-pointer"
                    >
                      <span>Submit Quote Request</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Right 5 Columns: Sticky Sizing Summary Card */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs sticky top-24">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Live System Summary
                </span>
                <span className="text-xs font-mono font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  3D Layout Linked
                </span>
              </div>

              {/* Specs List */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Solar Array Capacity:</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {calculation.systemSizeKw} kW DC
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Module Count:</span>
                  <span className="font-medium text-slate-800">
                    {layoutConfig.panelCount} × 400W Monocrystalline
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Roof Architecture:</span>
                  <span className="font-medium capitalize text-slate-800">
                    {roofType} Roof ({layoutConfig.tiltAngle}° Pitch)
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Est. Annual Generation:</span>
                  <span className="font-mono font-semibold text-slate-900">
                    {calculation.annualProductionKwh.toLocaleString()} kWh/yr
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Battery Storage:</span>
                  <span className="font-medium text-slate-800">
                    {includeBattery ? '13.5 kWh Powerwall' : 'Grid-Tied (No Battery)'}
                  </span>
                </div>
              </div>

              {/* Financial Box */}
              <div className="bg-slate-900 text-white rounded-xl p-4 mb-4 space-y-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Estimated Annual Savings</span>
                  <span className="text-emerald-400 font-mono font-bold text-sm">
                    {formatCurrency(calculation.estimatedAnnualSavings)}/yr
                  </span>
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>30% Federal Clean Energy Credit</span>
                  <span className="text-amber-400 font-mono font-bold">
                    {formatCurrency(calculation.federalTaxCreditValue)}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between text-xs">
                  <span className="text-slate-300">25-Yr Net Homeowner Profit</span>
                  <span className="text-amber-400 font-mono font-bold text-base">
                    {formatCurrency(calculation.estimated25YrNetSavings)}
                  </span>
                </div>
              </div>

              {/* Guarantees Strip */}
              <div className="space-y-2 pt-2 text-[11px] text-slate-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>25-Year Linear Power Production Guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>10-Year Roof Penetration & Workmanship Warranty</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>NABCEP-Certified Master Electrician Installation</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
