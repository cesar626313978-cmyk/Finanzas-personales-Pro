import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell
} from 'recharts';
import { BudgetEnvelope } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { SlidersHorizontal, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface MonthlySpendBarChartProps {
  envelopes: BudgetEnvelope[];
  onEnvelopeClick?: (envelopeId: string) => void;
}

interface ChartItem {
  id: string;
  name: string;
  spent: number;
  limit: number;
  type: string;
  percent: number;
  difference: number;
  color: string;
}

export const MonthlySpendBarChart: React.FC<MonthlySpendBarChartProps> = ({
  envelopes,
  onEnvelopeClick,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'shared' | 'personal'>('all');
  const [sortBy, setSortBy] = useState<'default' | 'spent' | 'percent'>('default');
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const filtered = envelopes.filter((env) => {
    if (filterType === 'all') return true;
    return env.type === filterType;
  });

  const chartData: ChartItem[] = filtered.map((env) => {
    const percent = env.limit > 0 ? (env.spent / env.limit) * 100 : 0;
    return {
      id: env.id,
      name: env.name.split(' ')[0], // short name for x-axis
      fullName: env.name,
      spent: Math.round(env.spent),
      limit: Math.round(env.limit),
      type: env.type,
      percent,
      difference: Math.round(env.limit - env.spent),
      color: env.color,
    } as any;
  });

  if (sortBy === 'spent') {
    chartData.sort((a, b) => b.spent - a.spent);
  } else if (sortBy === 'percent') {
    chartData.sort((a, b) => b.percent - a.percent);
  }

  const totalSpent = filtered.reduce((acc, curr) => acc + curr.spent, 0);
  const totalLimit = filtered.reduce((acc, curr) => acc + curr.limit, 0);
  const globalPercent = totalLimit > 0 ? (totalSpent / totalLimit) * 100 : 0;

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as ChartItem & { fullName: string };
      const isOverBudget = data.spent > data.limit;

      return (
        <div className="bg-[#0F172A] dark:bg-[#151D2E] text-white p-3.5 rounded-xl shadow-xl border border-slate-700 dark:border-slate-800 text-xs min-w-[200px] pointer-events-none">
          <div className="flex items-center justify-between gap-2 border-b border-slate-800 dark:border-slate-700 pb-2 mb-2">
            <span className="font-bold text-sm text-slate-100">{data.fullName || data.name}</span>
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
              data.type === 'shared' ? 'bg-blue-900/60 text-blue-300' : 'bg-slate-800 text-slate-300'
            }`}>
              {data.type === 'shared' ? '50% Compartido' : '100% Personal'}
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#2563EB] inline-block"></span>
                Gasto Real:
              </span>
              <span className="font-bold tabular-nums text-white">
                {formatCurrency(data.spent)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-slate-400 dark:bg-slate-500 inline-block"></span>
                Presupuesto:
              </span>
              <span className="font-bold tabular-nums text-slate-200">
                {formatCurrency(data.limit)}
              </span>
            </div>

            <div className="border-t border-slate-800 dark:border-slate-700 pt-2 mt-2 flex items-center justify-between">
              <span className="text-slate-400">Consumo:</span>
              <span className={`font-bold tabular-nums ${
                isOverBudget ? 'text-rose-400' : data.percent >= 80 ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {data.percent.toFixed(1)}%
              </span>
            </div>

            <div className="text-[11px] font-medium pt-0.5">
              {isOverBudget ? (
                <span className="text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Excedido en {formatCurrency(Math.abs(data.difference))}
                </span>
              ) : (
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Restante: {formatCurrency(data.difference)}
                </span>
              )}
            </div>
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
              Gasto del Mes vs. Presupuesto
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F1F5F9] dark:bg-[#1E293B] text-[#64748B] dark:text-[#94A3B8] uppercase">
              Base Cero
            </span>
          </div>
          <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5">
            Comparativa de ejecución presupuestaria por categoría de sobre
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-[#F8FAFC] dark:bg-[#0B0F19] p-1 rounded-lg border border-[#E2E8F0] dark:border-[#1E293B] self-start sm:self-auto text-xs">
          <button
            onClick={() => setFilterType('all')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
              filterType === 'all'
                ? 'bg-white dark:bg-[#1E293B] text-[#0F172A] dark:text-[#F8FAFC] font-bold shadow-xs border border-[#E2E8F0] dark:border-[#334155]'
                : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC]'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilterType('shared')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
              filterType === 'shared'
                ? 'bg-white dark:bg-[#1E293B] text-[#0F172A] dark:text-[#F8FAFC] font-bold shadow-xs border border-[#E2E8F0] dark:border-[#334155]'
                : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC]'
            }`}
          >
            Compartidos
          </button>
          <button
            onClick={() => setFilterType('personal')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
              filterType === 'personal'
                ? 'bg-white dark:bg-[#1E293B] text-[#0F172A] dark:text-[#F8FAFC] font-bold shadow-xs border border-[#E2E8F0] dark:border-[#334155]'
                : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC]'
            }`}
          >
            Personales
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
            barGap={4}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1E293B' : '#F1F5F9'} vertical={false} />
            <XAxis
              dataKey="name"
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
              tickFormatter={(v) => `${v}€`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: isDark ? '#1E293B33' : '#F8FAFC' }} />
            <Legend
              verticalAlign="top"
              align="right"
              iconSize={8}
              iconType="circle"
              wrapperStyle={{ fontSize: '11px', paddingBottom: '12px' }}
              formatter={(value) => {
                if (value === 'spent') {
                  return <span className={isDark ? 'text-[#F8FAFC] font-medium' : 'text-[#0F172A] font-medium'}>Gasto Real</span>;
                }
                return <span className={isDark ? 'text-[#94A3B8] font-medium' : 'text-[#64748B] font-medium'}>Presupuesto</span>;
              }}
            />
            <Bar
              dataKey="spent"
              name="spent"
              fill="#2563EB"
              radius={[4, 4, 0, 0]}
              maxBarSize={32}
              onClick={(entry) => onEnvelopeClick && onEnvelopeClick(entry.id)}
              className="cursor-pointer transition-opacity hover:opacity-85"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-spent-${index}`}
                  fill={entry.spent > entry.limit ? '#F43F5E' : '#2563EB'}
                />
              ))}
            </Bar>
            <Bar
              dataKey="limit"
              name="limit"
              fill={isDark ? '#475569' : '#94A3B8'}
              radius={[4, 4, 0, 0]}
              maxBarSize={32}
              onClick={(entry) => onEnvelopeClick && onEnvelopeClick(entry.id)}
              className="cursor-pointer transition-opacity hover:opacity-85"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Metrics Breakdown */}
      <div className="pt-3 border-t border-[#E2E8F0] dark:border-[#1E293B] grid grid-cols-3 gap-2 text-center">
        <div className="bg-[#F8FAFC] dark:bg-[#0B0F19] p-2.5 rounded-xl border border-[#E2E8F0] dark:border-[#1E293B]">
          <span className="text-[10px] font-bold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider block">Total Gastado</span>
          <span className="text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC] tabular-nums mt-0.5 block">
            {formatCurrency(totalSpent)}
          </span>
        </div>
        <div className="bg-[#F8FAFC] dark:bg-[#0B0F19] p-2.5 rounded-xl border border-[#E2E8F0] dark:border-[#1E293B]">
          <span className="text-[10px] font-bold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider block">Presupuestado</span>
          <span className="text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC] tabular-nums mt-0.5 block">
            {formatCurrency(totalLimit)}
          </span>
        </div>
        <div className="bg-[#F8FAFC] dark:bg-[#0B0F19] p-2.5 rounded-xl border border-[#E2E8F0] dark:border-[#1E293B]">
          <span className="text-[10px] font-bold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider block">Ejecución</span>
          <span className={`text-sm font-bold tabular-nums mt-0.5 block ${
            globalPercent >= 90 ? 'text-rose-500 dark:text-rose-400' : globalPercent >= 75 ? 'text-amber-500 dark:text-amber-400' : 'text-emerald-500 dark:text-emerald-400'
          }`}>
            {globalPercent.toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
};
