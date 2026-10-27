import { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
} from 'recharts';
import { SolarCalculationResult } from '../types/solar';
import {
  formatCurrency,
  generate25YearRoiTimeline,
  RoiTimelinePoint,
} from '../utils/solarCalculations';
import { TrendingUp, DollarSign, Award, ArrowUpRight } from 'lucide-react';

interface RoiChartProps {
  calculation: SolarCalculationResult;
  monthlyElectricBill: number;
}

export function RoiChart({ calculation, monthlyElectricBill }: RoiChartProps) {
  const [chartMode, setChartMode] = useState<'netProfit' | 'comparison'>('netProfit');

  const data = generate25YearRoiTimeline(calculation, monthlyElectricBill);
  const paybackYear = Math.ceil(calculation.paybackPeriodYears);

  // Custom Recharts Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const point: RoiTimelinePoint = payload[0].payload;
      return (
        <div className="bg-slate-900 border border-slate-700 text-white p-3 rounded-xl shadow-xl text-xs space-y-1.5 min-w-[210px]">
          <div className="flex justify-between items-center border-b border-slate-800 pb-1 font-semibold text-slate-300">
            <span>{point.year === 0 ? 'Initial Installation' : `Year ${point.year}`}</span>
            {point.year === paybackYear && (
              <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-1.5 py-0.2 rounded border border-emerald-800">
                Payback Break-Even
              </span>
            )}
          </div>

          <div className="flex justify-between">
            <span className="text-slate-400">Cumulative Net Profit:</span>
            <span
              className={`font-mono font-bold tabular-nums ${
                point.cumulativeNetProfit >= 0 ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              {formatCurrency(point.cumulativeNetProfit)}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-400">Total Solar Savings:</span>
            <span className="font-mono text-sky-400 tabular-nums">
              {formatCurrency(point.cumulativeSolarSavings)}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-400">Cost Without Solar:</span>
            <span className="font-mono text-red-400 tabular-nums">
              {formatCurrency(point.cumulativeUtilityCostWithoutSolar)}
            </span>
          </div>

          {point.year > 0 && (
            <div className="pt-1 border-t border-slate-800/80 flex justify-between text-[11px] text-slate-400">
              <span>Annual Bill Avoided:</span>
              <span className="font-mono text-slate-200">
                {formatCurrency(point.annualSolarSavings)}/yr
              </span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white">
      {/* Header and Toggle Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <h4 className="text-sm font-bold text-white">
              25-Year Return on Investment (ROI) Timeline
            </h4>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Factors 30% Federal ITC ({formatCurrency(calculation.federalTaxCreditValue)}) + 3.5%
            annual electric utility inflation.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setChartMode('netProfit')}
            className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              chartMode === 'netProfit'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Net Cash Flow ($)
          </button>
          <button
            type="button"
            onClick={() => setChartMode('comparison')}
            className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              chartMode === 'comparison'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Solar vs. Utility No Solar
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          {chartMode === 'netProfit' ? (
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="costGrad" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis
                dataKey="label"
                stroke="#64748b"
                tick={{ fontSize: 10 }}
                interval={4}
              />
              <YAxis
                stroke="#64748b"
                tick={{ fontSize: 10 }}
                tickFormatter={(val) => `$${Math.round(val / 1000)}k`}
              />
              <Tooltip content={<CustomTooltip />} />

              {/* Break-Even $0 Line */}
              <ReferenceLine
                y={0}
                stroke="#94a3b8"
                strokeDasharray="4 4"
                label={{
                  value: 'Break-Even ($0)',
                  fill: '#94a3b8',
                  fontSize: 10,
                  position: 'insideBottomRight',
                }}
              />

              {/* Payback Period Vertical Line */}
              <ReferenceLine
                x={`Yr ${paybackYear}`}
                stroke="#10b981"
                strokeDasharray="3 3"
                label={{
                  value: `Payback ~Yr ${paybackYear}`,
                  fill: '#34d399',
                  fontSize: 10,
                  position: 'top',
                }}
              />

              <Area
                type="monotone"
                dataKey="cumulativeNetProfit"
                stroke="#10b981"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#profitGrad)"
                name="Net Profit"
              />
            </AreaChart>
          ) : (
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="utilityGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="solarSavingsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.05} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis
                dataKey="label"
                stroke="#64748b"
                tick={{ fontSize: 10 }}
                interval={4}
              />
              <YAxis
                stroke="#64748b"
                tick={{ fontSize: 10 }}
                tickFormatter={(val) => `$${Math.round(val / 1000)}k`}
              />
              <Tooltip content={<CustomTooltip />} />

              <Area
                type="monotone"
                dataKey="cumulativeUtilityCostWithoutSolar"
                stroke="#ef4444"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#utilityGrad)"
                name="Utility Cost (Without Solar)"
              />

              <Area
                type="monotone"
                dataKey="cumulativeSolarSavings"
                stroke="#0ea5e9"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#solarSavingsGrad)"
                name="Cumulative Solar Savings"
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Summary Footer Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-800 text-xs">
        <div>
          <span className="text-[10px] text-slate-400 block">Initial Net Investment:</span>
          <span className="font-mono font-bold text-slate-200">
            {formatCurrency(calculation.netSystemCost)}
          </span>
          <span className="text-[10px] text-amber-400 block">
            After {formatCurrency(calculation.federalTaxCreditValue)} Tax Credit
          </span>
        </div>

        <div>
          <span className="text-[10px] text-slate-400 block">Estimated Payback Period:</span>
          <span className="font-mono font-bold text-emerald-400">
            ~{calculation.paybackPeriodYears} Years
          </span>
          <span className="text-[10px] text-slate-400 block">100% Free Energy Thereafter</span>
        </div>

        <div className="col-span-2 sm:col-span-1">
          <span className="text-[10px] text-slate-400 block">25-Year Cumulative Profit:</span>
          <span className="font-mono font-bold text-emerald-400 text-sm">
            +{formatCurrency(calculation.estimated25YrNetSavings)}
          </span>
          <span className="text-[10px] text-slate-400 block">Direct Home Equity & Savings</span>
        </div>
      </div>
    </div>
  );
}
