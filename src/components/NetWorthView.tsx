import React, { useState } from 'react';
import { 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Wallet, 
  Building2, 
  PiggyBank, 
  ShieldAlert,
  Sparkles,
  Calculator
} from 'lucide-react';
import { NetWorthItem } from '../types';
import { formatCurrency } from '../utils/formatters';
import { NetWorthLineChart } from './charts/NetWorthLineChart';

interface NetWorthViewProps {
  items: NetWorthItem[];
}

export const NetWorthView: React.FC<NetWorthViewProps> = ({ items }) => {
  const [monthlyContribution, setMonthlyContribution] = useState(600);

  const assets = items.filter((i) => i.value > 0);
  const debts = items.filter((i) => i.value < 0);

  const totalAssets = assets.reduce((acc, i) => acc + i.value, 0);
  const totalDebts = Math.abs(debts.reduce((acc, i) => acc + i.value, 0));
  const netWorth = totalAssets - totalDebts;

  // Compound interest calculation
  const calculateProjection = (years: number) => {
    const r = 0.07 / 12; // 7% annual return
    const n = years * 12;
    // FV = PV*(1+r)^n + PMT * [((1+r)^n - 1) / r]
    const fv = netWorth * Math.pow(1 + r, n) + monthlyContribution * ((Math.pow(1 + r, n) - 1) / r);
    return fv;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header View Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight">
          Patrimonio Neto Consolidado
        </h1>
        <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
          Evolución de activos, fondo indexado, liquidez y reducción de deuda
        </p>
      </div>

      {/* Main Interactive Line Chart */}
      <NetWorthLineChart items={items} />

      {/* Breakdown: Assets vs Liabilities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assets List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#0F172A] tracking-tight flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Activos ({formatCurrency(totalAssets)})</span>
            </h2>
            <span className="text-xs text-[#64748B] font-medium">Bienes e Inversiones</span>
          </div>

          <div className="space-y-2.5">
            {assets.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-sm hover:border-slate-400 transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    {item.category === 'investment' ? <TrendingUp className="w-5 h-5" /> : <PiggyBank className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0F172A]">{item.name}</h3>
                    <span className="text-xs text-[#64748B]">
                      {item.ownership === 'shared' ? '50% Pareja' : '100% Personal'}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm sm:text-base font-bold text-[#0F172A] tabular-nums">
                    {formatCurrency(item.value)}
                  </p>
                  <p className="text-[11px] text-emerald-600 font-bold flex items-center justify-end gap-0.5">
                    <ArrowUpRight className="w-3 h-3" />
                    +{item.changeMonthly}% mes
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Debts List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#0F172A] tracking-tight flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              <span>Pasivos y Deudas ({formatCurrency(totalDebts)})</span>
            </h2>
            <span className="text-xs text-[#64748B] font-medium">Compromisos financieros</span>
          </div>

          <div className="space-y-2.5">
            {debts.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-sm hover:border-slate-400 transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0F172A]">{item.name}</h3>
                    <span className="text-xs text-[#64748B]">Liquidación a final de mes</span>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm sm:text-base font-bold text-rose-600 tabular-nums">
                    {formatCurrency(item.value)}
                  </p>
                  <p className="text-[11px] text-emerald-600 font-bold flex items-center justify-end gap-0.5">
                    <ArrowDownRight className="w-3 h-3" />
                    Reduciendo
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Wealth Projection Simulator */}
      <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-[#0F172A]">
          <Calculator className="w-5 h-5 text-[#2563EB]" />
          <h3 className="text-base font-bold text-[#0F172A]">Simulador de Libertad Financiera & Proyección</h3>
        </div>
        <p className="text-xs text-[#64748B] max-w-xl">
          Calcula el impacto del interés compuesto reinvirtiendo tu excedente mensual (estimación 7% TAE media histórica indexada).
        </p>

        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs font-bold text-[#0F172A]">
            <span>Aportación de Ahorro / Inversión Mensual:</span>
            <span className="text-[#2563EB] text-sm">{monthlyContribution} €/mes</span>
          </div>
          <input
            type="range"
            min="100"
            max="2000"
            step="50"
            value={monthlyContribution}
            onChange={(e) => setMonthlyContribution(parseInt(e.target.value, 10))}
            className="w-full accent-[#2563EB] cursor-pointer"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-center">
            <span className="text-xs font-bold text-[#64748B]">En 1 Año</span>
            <p className="text-lg sm:text-xl font-bold text-[#0F172A] mt-1 tabular-nums">
              {formatCurrency(calculateProjection(1))}
            </p>
            <p className="text-[10px] text-emerald-600 font-bold mt-0.5">
              +{formatCurrency(calculateProjection(1) - netWorth)}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-center">
            <span className="text-xs font-bold text-[#64748B]">En 3 Años</span>
            <p className="text-lg sm:text-xl font-bold text-[#0F172A] mt-1 tabular-nums">
              {formatCurrency(calculateProjection(3))}
            </p>
            <p className="text-[10px] text-emerald-600 font-bold mt-0.5">
              +{formatCurrency(calculateProjection(3) - netWorth)}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200 text-center">
            <span className="text-xs font-bold text-[#2563EB]">En 5 Años</span>
            <p className="text-lg sm:text-xl font-bold text-[#0F172A] mt-1 tabular-nums">
              {formatCurrency(calculateProjection(5))}
            </p>
            <p className="text-[10px] text-emerald-600 font-bold mt-0.5">
              +{formatCurrency(calculateProjection(5) - netWorth)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
