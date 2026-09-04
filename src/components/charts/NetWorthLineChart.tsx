import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { NetWorthItem } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { TrendingUp, ArrowUpRight, ShieldCheck, Calendar } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface NetWorthLineChartProps {
  items?: NetWorthItem[];
  onNavigateToNetWorth?: () => void;
}

interface MonthlyDataPoint {
  month: string;
  fullMonth: string;
  netWorth: number;
  assets: number;
  debts: number;
  growthMoM?: number;
  projected?: boolean;
}

const HISTORICAL_6M: MonthlyDataPoint[] = [
  { month: 'Dic', fullMonth: 'Diciembre', netWorth: 41200, assets: 44800, debts: 3600, growthMoM: 1.8 },
  { month: 'Ene', fullMonth: 'Enero', netWorth: 42800, assets: 46200, debts: 3400, growthMoM: 3.9 },
  { month: 'Feb', fullMonth: 'Febrero', netWorth: 44100, assets: 47300, debts: 3200, growthMoM: 3.0 },
  { month: 'Mar', fullMonth: 'Marzo', netWorth: 45600, assets: 48600, debts: 3000, growthMoM: 3.4 },
  { month: 'Abr', fullMonth: 'Abril', netWorth: 46670, assets: 49550, debts: 2880, growthMoM: 2.3 },
  { month: 'May', fullMonth: 'Mayo (Actual)', netWorth: 48250, assets: 51090, debts: 2840, growthMoM: 3.4 },
];

const HISTORICAL_12M: MonthlyDataPoint[] = [
  { month: 'Jun 25', fullMonth: 'Junio 2025', netWorth: 34500, assets: 39000, debts: 4500, growthMoM: 2.1 },
  { month: 'Jul', fullMonth: 'Julio 2025', netWorth: 35800, assets: 40100, debts: 4300, growthMoM: 3.8 },
  { month: 'Ago', fullMonth: 'Agosto 2025', netWorth: 36900, assets: 41000, debts: 4100, growthMoM: 3.1 },
  { month: 'Sep', fullMonth: 'Septiembre 2025', netWorth: 38100, assets: 42000, debts: 3900, growthMoM: 3.2 },
  { month: 'Oct', fullMonth: 'Octubre 2025', netWorth: 39500, assets: 43300, debts: 3800, growthMoM: 3.7 },
  { month: 'Nov', fullMonth: 'Noviembre 2025', netWorth: 40400, assets: 44100, debts: 3700, growthMoM: 2.3 },
  ...HISTORICAL_6M
];

const PROJECTION_DATA: MonthlyDataPoint[] = [
  ...HISTORICAL_6M,
  { month: 'Jun', fullMonth: 'Junio (Est.)', netWorth: 49800, assets: 52400, debts: 2600, growthMoM: 3.2, projected: true },
  { month: 'Jul', fullMonth: 'Julio (Est.)', netWorth: 51400, assets: 53800, debts: 2400, growthMoM: 3.2, projected: true },
  { month: 'Ago', fullMonth: 'Agosto (Est.)', netWorth: 53100, assets: 55300, debts: 2200, growthMoM: 3.3, projected: true },
];

export const NetWorthLineChart: React.FC<NetWorthLineChartProps> = ({
  items,
  onNavigateToNetWorth,
}) => {
  const [timeRange, setTimeRange] = useState<'6m' | '12m' | 'projection'>('6m');
  const [viewMode, setViewMode] = useState<'net' | 'breakdown'>('net');
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  let activeData = HISTORICAL_6M;
  if (timeRange === '12m') activeData = HISTORICAL_12M;
  if (timeRange === 'projection') activeData = PROJECTION_DATA;

  const currentPoint = activeData.find((p) => p.month === 'May') || activeData[activeData.length - 1];
  const startPoint = activeData[0];
  const totalGrowthPercent = ((currentPoint.netWorth - startPoint.netWorth) / startPoint.netWorth) * 100;
  const totalGrowthEuros = currentPoint.netWorth - startPoint.netWorth;

  // Custom interactive tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as MonthlyDataPoint;

      return (
        <div className="bg-[#0F172A] dark:bg-[#151D2E] text-white p-3.5 rounded-xl shadow-xl border border-slate-700 dark:border-slate-800 text-xs min-w-[210px] pointer-events-none">
          <div className="flex items-center justify-between gap-2 border-b border-slate-800 dark:border-slate-700 pb-2 mb-2">
            <span className="font-bold text-sm text-slate-100">{data.fullMonth}</span>
            {data.projected ? (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-900/60 text-amber-300">
                Estimado
              </span>
            ) : (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-900/60 text-emerald-300">
                Consolidado
              </span>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB] inline-block"></span>
                Patrimonio Neto:
              </span>
              <span className="font-bold tabular-nums text-white text-sm">
                {formatCurrency(data.netWorth)}
              </span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
                Activos totales:
              </span>
              <span className="font-semibold tabular-nums text-emerald-300">
                {formatCurrency(data.assets)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-400 inline-block"></span>
                Pasivos / Deuda:
              </span>
              <span className="font-semibold tabular-nums text-rose-300">
                -{formatCurrency(data.debts)}
              </span>
            </div>

            {data.growthMoM !== undefined && (
              <div className="border-t border-slate-800 dark:border-slate-700 pt-2 mt-2 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Variación mensual:</span>
                <span className="font-bold text-emerald-400 flex items-center gap-0.5">
                  <ArrowUpRight className="w-3 h-3" />
                  +{data.growthMoM}%
                </span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-[#151D2E] p-5 sm:p-6 rounded-2xl border border-[#E2E8F0] dark:border-[#1E293B] shadow-sm flex flex-col justify-between space-y-4 transition-colors duration-200">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-base text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">
              Patrimonio Neto Consolidado
            </h3>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 uppercase">
              <TrendingUp className="w-3 h-3" />
              +3.4% mes
            </span>
          </div>
          <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5">
            Evolución mensual de activos, fondos indexados y liquidez real
          </p>
        </div>

        {/* Time Selector Pills */}
        <div className="flex items-center gap-1 bg-[#F8FAFC] dark:bg-[#0B0F19] p-1 rounded-lg border border-[#E2E8F0] dark:border-[#1E293B] self-start sm:self-auto text-xs">
          <button
            onClick={() => setTimeRange('6m')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
              timeRange === '6m'
                ? 'bg-white dark:bg-[#1E293B] text-[#0F172A] dark:text-[#F8FAFC] font-bold shadow-xs border border-[#E2E8F0] dark:border-[#334155]'
                : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC]'
            }`}
          >
            6M
          </button>
          <button
            onClick={() => setTimeRange('12m')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
              timeRange === '12m'
                ? 'bg-white dark:bg-[#1E293B] text-[#0F172A] dark:text-[#F8FAFC] font-bold shadow-xs border border-[#E2E8F0] dark:border-[#334155]'
                : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC]'
            }`}
          >
            1 Año
          </button>
          <button
            onClick={() => setTimeRange('projection')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
              timeRange === 'projection'
                ? 'bg-white dark:bg-[#1E293B] text-[#0F172A] dark:text-[#F8FAFC] font-bold shadow-xs border border-[#E2E8F0] dark:border-[#334155]'
                : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC]'
            }`}
          >
            Proyección
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={activeData}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="netWorthGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.18} />
                <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="assetsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.12} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1E293B' : '#F1F5F9'} vertical={false} />
            <XAxis
              dataKey="month"
              stroke={isDark ? '#94A3B8' : '#64748B'}
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: isDark ? '#1E293B' : '#E2E8F0' }}
            />
            <YAxis
              stroke={isDark ? '#94A3B8' : '#64748B'}
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${Math.round(v / 1000)}k€`}
              domain={['dataMin - 2000', 'dataMax + 2000']}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* Reference baseline for latest consolidated point */}
            <ReferenceLine
              y={currentPoint.netWorth}
              stroke={isDark ? '#334155' : '#E2E8F0'}
              strokeDasharray="3 3"
            />

            <Area
              type="monotone"
              dataKey="netWorth"
              name="Patrimonio Neto"
              stroke="#2563EB"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#netWorthGradient)"
              activeDot={{ r: 6, stroke: '#2563EB', strokeWidth: 2, fill: isDark ? '#0B0F19' : '#FFFFFF' }}
            />

            {viewMode === 'breakdown' && (
              <Area
                type="monotone"
                dataKey="assets"
                name="Activos"
                stroke="#10B981"
                strokeWidth={2}
                strokeDasharray="4 4"
                fillOpacity={1}
                fill="url(#assetsGradient)"
                activeDot={{ r: 5, stroke: '#10B981', strokeWidth: 2, fill: isDark ? '#0B0F19' : '#FFFFFF' }}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Metrics & Toggle Breakdown */}
      <div className="pt-3 border-t border-[#E2E8F0] dark:border-[#1E293B] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 w-full sm:w-auto text-left">
          <div className="bg-[#F8FAFC] dark:bg-[#0B0F19] px-3 py-2 rounded-xl border border-[#E2E8F0] dark:border-[#1E293B]">
            <span className="text-[10px] font-bold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider block">Valor Actual</span>
            <span className="text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC] tabular-nums block">
              {formatCurrency(currentPoint.netWorth)}
            </span>
          </div>

          <div className="bg-[#F8FAFC] dark:bg-[#0B0F19] px-3 py-2 rounded-xl border border-[#E2E8F0] dark:border-[#1E293B]">
            <span className="text-[10px] font-bold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider block">
              Progreso ({timeRange === '6m' ? '6M' : timeRange === '12m' ? '12M' : 'Periodo'})
            </span>
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 tabular-nums block">
              +{totalGrowthPercent.toFixed(1)}% (+{formatCurrency(totalGrowthEuros)})
            </span>
          </div>

          <div className="bg-[#F8FAFC] dark:bg-[#0B0F19] px-3 py-2 rounded-xl border border-[#E2E8F0] dark:border-[#1E293B] col-span-2 sm:col-span-1">
            <span className="text-[10px] font-bold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider block">Deuda Reducida</span>
            <span className="text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC] tabular-nums block">
              -760 € (-21%)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={() => setViewMode((prev) => (prev === 'net' ? 'breakdown' : 'net'))}
            className={`text-xs font-semibold px-3 py-2 rounded-lg border transition-colors cursor-pointer ${
              viewMode === 'breakdown'
                ? 'bg-[#0F172A] dark:bg-[#2563EB] text-white border-[#0F172A] dark:border-[#2563EB]'
                : 'bg-white dark:bg-[#1E293B] text-[#64748B] dark:text-[#94A3B8] border-[#E2E8F0] dark:border-[#334155] hover:text-[#0F172A] dark:hover:text-[#F8FAFC]'
            }`}
          >
            {viewMode === 'breakdown' ? 'Ocultar Activos' : 'Ver Curva Activos'}
          </button>

          {onNavigateToNetWorth && (
            <button
              onClick={onNavigateToNetWorth}
              className="text-xs font-bold text-[#2563EB] dark:text-[#60A5FA] hover:underline cursor-pointer px-2"
            >
              Detalle Completo →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
