import React, { useState } from 'react';
import { 
  PieChart, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRightLeft, 
  Plus, 
  Minus, 
  Sparkles,
  Layers,
  HelpCircle,
  ShoppingCart,
  Home,
  Car,
  Utensils,
  Tv,
  Heart,
  Receipt
} from 'lucide-react';
import { BudgetEnvelope } from '../types';
import { formatCurrency, getSemaphoricStyle } from '../utils/formatters';

interface BudgetZeroViewProps {
  envelopes: BudgetEnvelope[];
  onUpdateEnvelopeLimit: (id: string, newLimit: number) => void;
  onTransferFunds: (sourceId: string, targetId: string, amount: number) => void;
}

export const BudgetZeroView: React.FC<BudgetZeroViewProps> = ({
  envelopes,
  onUpdateEnvelopeLimit,
  onTransferFunds,
}) => {
  const [monthlyIncome, setMonthlyIncome] = useState(2500.00);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferSource, setTransferSource] = useState(envelopes[2]?.id || '');
  const [transferTarget, setTransferTarget] = useState(envelopes[0]?.id || '');
  const [transferAmount, setTransferAmount] = useState('50');

  const totalAssigned = envelopes.reduce((acc, env) => acc + env.limit, 0);
  const toAssign = monthlyIncome - totalAssigned;
  const isZeroBaseOk = Math.abs(toAssign) < 0.01;

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShoppingCart': return <ShoppingCart className="w-4 h-4 text-sky-600" />;
      case 'Home': return <Home className="w-4 h-4 text-indigo-600" />;
      case 'Car': return <Car className="w-4 h-4 text-emerald-600" />;
      case 'Utensils': return <Utensils className="w-4 h-4 text-amber-600" />;
      case 'Tv': return <Tv className="w-4 h-4 text-violet-600" />;
      case 'Heart': return <Heart className="w-4 h-4 text-rose-600" />;
      default: return <Receipt className="w-4 h-4 text-slate-600" />;
    }
  };

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(transferAmount);
    if (!amount || amount <= 0 || transferSource === transferTarget) return;

    onTransferFunds(transferSource, transferTarget, amount);
    setShowTransferModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header View Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">
            Presupuesto Base Cero
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#94A3B8] mt-0.5">
            Cada euro tiene una misión asignada. Ingresos previstos vs asignación en sobres.
          </p>
        </div>

        <button
          onClick={() => setShowTransferModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white dark:bg-[#151D2E] border border-[#E2E8F0] dark:border-[#1E293B] text-[#0F172A] dark:text-[#F8FAFC] hover:bg-[#F8FAFC] dark:hover:bg-[#1E293B] text-xs font-semibold shadow-sm transition-all cursor-pointer self-start sm:self-auto"
        >
          <ArrowRightLeft className="w-3.5 h-3.5 text-[#64748B] dark:text-[#94A3B8]" />
          <span>Mover Saldo Entre Sobres</span>
        </button>
      </div>

      {/* Zero Base Status Hero Box (Geometric Balance) */}
      <div className="bg-white dark:bg-[#151D2E] p-6 rounded-2xl border border-[#E2E8F0] dark:border-[#1E293B] shadow-sm transition-colors duration-200">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">Ingresos del Mes</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <input
                type="number"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(parseFloat(e.target.value) || 0)}
                className="text-2xl sm:text-3xl font-bold text-[#0F172A] dark:text-[#F8FAFC] bg-transparent border-b border-dashed border-slate-300 dark:border-slate-600 focus:outline-none focus:border-[#0F172A] dark:focus:border-[#38BDF8] w-36 tabular-nums"
              />
              <span className="text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC]">€</span>
            </div>
            <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] mt-1">Nómina e ingresos recurrentes</p>
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">Total Asignado a Sobres</span>
            <p className="text-2xl sm:text-3xl font-bold text-[#0F172A] dark:text-[#F8FAFC] mt-1 tabular-nums">
              {formatCurrency(totalAssigned)}
            </p>
            <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] mt-1">Repartido en {envelopes.length} categorías</p>
          </div>

          <div className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#0B0F19] border border-[#E2E8F0] dark:border-[#1E293B] flex flex-col justify-center transition-colors duration-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC]">Por Asignar</span>
              {isZeroBaseOk ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-500" />
              )}
            </div>
            <p className={`text-2xl font-bold mt-1 tabular-nums ${
              isZeroBaseOk ? 'text-emerald-600 dark:text-emerald-400' : toAssign > 0 ? 'text-[#2563EB] dark:text-[#38BDF8]' : 'text-rose-600 dark:text-rose-400'
            }`}>
              {formatCurrency(toAssign)}
            </p>
            <span className={`text-[11px] font-bold mt-0.5 ${
              isZeroBaseOk ? 'text-emerald-600 dark:text-emerald-400' : toAssign > 0 ? 'text-[#2563EB] dark:text-[#38BDF8]' : 'text-rose-600 dark:text-rose-400'
            }`}>
              {isZeroBaseOk 
                ? 'Base Cero perfecto alcanzado' 
                : toAssign > 0 
                  ? 'Faltan euros por repartir' 
                  : 'Has presupuestado de más'}
            </span>
          </div>
        </div>
      </div>

      {/* Envelopes Configuration Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">
            Distribución en Sobres Mensuales
          </h2>
          <span className="text-xs text-[#64748B] dark:text-[#94A3B8] font-medium">Usa +/- para balancear presupuestos</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {envelopes.map((env) => {
            const percent = (env.spent / env.limit) * 100;
            const remaining = env.limit - env.spent;

            return (
              <div
                key={env.id}
                className="bg-white dark:bg-[#151D2E] p-5 rounded-2xl border border-[#E2E8F0] dark:border-[#1E293B] shadow-sm space-y-3 hover:border-slate-400 dark:hover:border-slate-600 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-lg shrink-0">
                      {getCategoryIcon(env.icon)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC] leading-tight">{env.name}</h3>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          env.type === 'shared' ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400' : 'bg-slate-100 dark:bg-slate-800 text-[#64748B] dark:text-[#94A3B8]'
                        }`}>
                          {env.type === 'shared' ? 'Compartido 50%' : 'Personal 100%'}
                        </span>
                        <span className={`text-[11px] font-bold ${
                          percent >= 90 ? 'text-rose-600 dark:text-rose-400' : percent >= 70 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
                        }`}>
                          {percent.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Limit Quick Adjust Controls */}
                  <div className="flex items-center gap-1 bg-[#F8FAFC] dark:bg-[#0B0F19] p-1 rounded-lg border border-[#E2E8F0] dark:border-[#1E293B]">
                    <button
                      onClick={() => onUpdateEnvelopeLimit(env.id, Math.max(0, env.limit - 20))}
                      title="Reducir 20€"
                      className="w-7 h-7 rounded-md bg-white dark:bg-[#1E293B] text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] border border-[#E2E8F0] dark:border-[#334155] flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-2 text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC] tabular-nums">
                      {env.limit} €
                    </span>
                    <button
                      onClick={() => onUpdateEnvelopeLimit(env.id, env.limit + 20)}
                      title="Aumentar 20€"
                      className="w-7 h-7 rounded-md bg-white dark:bg-[#1E293B] text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] border border-[#E2E8F0] dark:border-[#334155] flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                <div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        percent >= 90 ? 'bg-rose-500' : percent >= 70 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, percent)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] mt-1.5">
                    <span>Gastado: {formatCurrency(env.spent)}</span>
                    <span className={remaining < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-[#0F172A] dark:text-[#F8FAFC]'}>
                      {remaining >= 0 ? `Restan: ${formatCurrency(remaining)}` : `Excedido: ${formatCurrency(Math.abs(remaining))}`}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Transfer Funds Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#151D2E] w-full max-w-md rounded-2xl p-6 shadow-2xl border border-[#E2E8F0] dark:border-[#1E293B] space-y-4">
            <h3 className="text-base font-bold text-[#0F172A] dark:text-[#F8FAFC]">Mover saldo entre sobres</h3>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
              Reequilibra tus sobres de forma flexible cuando una categoría requiera más presupuesto.
            </p>

            <form onSubmit={handleTransferSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-1">Sobre de Origen (Resta presupuesto)</label>
                <select
                  value={transferSource}
                  onChange={(e) => setTransferSource(e.target.value)}
                  className="w-full bg-[#F8FAFC] dark:bg-[#0B0F19] border border-[#E2E8F0] dark:border-[#1E293B] text-xs sm:text-sm rounded-lg px-3 py-2 font-medium text-[#0F172A] dark:text-[#F8FAFC]"
                >
                  {envelopes.map((e) => (
                    <option key={e.id} value={e.id}>{e.name} (Límite: {e.limit} €)</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-1">Sobre de Destino (Suma presupuesto)</label>
                <select
                  value={transferTarget}
                  onChange={(e) => setTransferTarget(e.target.value)}
                  className="w-full bg-[#F8FAFC] dark:bg-[#0B0F19] border border-[#E2E8F0] dark:border-[#1E293B] text-xs sm:text-sm rounded-lg px-3 py-2 font-medium text-[#0F172A] dark:text-[#F8FAFC]"
                >
                  {envelopes.map((e) => (
                    <option key={e.id} value={e.id}>{e.name} (Límite: {e.limit} €)</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-1">Importe a transferir (€)</label>
                <input
                  type="number"
                  min="1"
                  step="5"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  className="w-full bg-[#F8FAFC] dark:bg-[#0B0F19] border border-[#E2E8F0] dark:border-[#1E293B] text-xs sm:text-sm rounded-lg px-3 py-2 font-medium text-[#0F172A] dark:text-[#F8FAFC]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTransferModal(false)}
                  className="flex-1 py-2.5 rounded-lg border border-[#E2E8F0] dark:border-[#1E293B] text-xs font-medium text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] hover:bg-[#F8FAFC] dark:hover:bg-[#1E293B] cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-lg bg-[#0F172A] dark:bg-[#2563EB] text-white text-xs font-medium hover:opacity-90 dark:hover:bg-[#1D4ED8] shadow-sm cursor-pointer"
                >
                  Confirmar Transferencia
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
