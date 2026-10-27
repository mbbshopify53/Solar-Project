import { CheckCircle2, ShieldCheck, Zap, HardHat, FileText, Activity } from 'lucide-react';

export function ProcessSection() {
  const steps = [
    {
      num: '01',
      title: '3D Drone & Structural Roof Modeling',
      desc: 'Our engineering team verifies your roof structural decking, rafter spacing, and micro-shading patterns using millimeter-accurate aerial photogrammetry.',
      details: 'Confirms rafter integrity and verifies 100% weatherproofing compatibility.',
    },
    {
      num: '02',
      title: 'City Permitting & Utility Engineering',
      desc: 'We prepare stamped PE structural and single-line electrical schematics, handle all municipal building permits, and secure utility interconnection approval.',
      details: 'Zero paperwork for the homeowner. 100% turnkey municipal compliance.',
    },
    {
      num: '03',
      title: '1-Day Master Electrician Installation',
      desc: 'Our in-house, NABCEP-certified crew installs your mounting racking, 400W monocrystalline modules, and smart inverter system with concealed attic conduit runs.',
      details: 'Clean, factory-grade aesthetics with zero unsightly exterior conduit piping.',
    },
    {
      num: '04',
      title: 'Utility PTO & Zero-Down Energization',
      desc: 'Following local electrical inspection pass, we commission the system, submit for Permission to Operate (PTO), and activate your live 24/7 mobile production monitoring.',
      details: 'Immediate power generation offset and 25-year linear production warranty begins.',
    },
  ];

  return (
    <section id="process" className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mb-14">
          <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider block mb-2">
            The HelioCraft Standard
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-3 text-balance">
            Our 4-step precision installation path.
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            From your interactive 3D layout to utility Permission to Operate, we handle every permit,
            engineering stamp, and inspection in-house.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div
              key={step.num}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between"
            >
              <div>
                <span className="font-mono text-2xl font-bold text-amber-500 block mb-3">
                  {step.num}
                </span>
                <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">{step.desc}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-start gap-1.5 text-[11px] text-slate-500">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>{step.details}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Quality Certifications Bar */}
        <div className="mt-12 bg-white border border-slate-200 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900 block">
                NABCEP Certified PV Installation Professionals
              </span>
              <span className="text-xs text-slate-500">
                The gold standard in solar engineering, electrical safety, and roof craftsmanship.
              </span>
            </div>
          </div>

          <a
            href="#calculator"
            className="px-5 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
          >
            Schedule Free Assessment
          </a>
        </div>
      </div>
    </section>
  );
}
