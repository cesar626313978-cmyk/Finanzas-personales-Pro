import React, { useState, useMemo } from 'react';
import { 
  Landmark, 
  CreditCard, 
  TrendingUp, 
  Wallet, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowDownRight, 
  ArrowUpRight, 
  Users, 
  User, 
  Plus, 
  RefreshCw, 
  Sliders, 
  ChevronRight, 
  Building2,
  Calendar,
  ExternalLink,
  Receipt,
  PiggyBank,
  Check
} from 'lucide-react';
import { BankAccount, Transaction, ActiveTab } from '../types';
import { formatCurrency, getTransactionPersonalImpact } from '../utils/formatters';

interface DashboardAccountDetailProps {
  accounts: BankAccount[];
  transactions: Transaction[];
  onNavigateTab: (tab: ActiveTab) => void;
  onOpenNewMovement: () => void;
  onOpenPSD2Config?: () => void;
  onSync?: () => void;
  isSyncing?: boolean;
}

export const DashboardAccountDetail: React.FC<DashboardAccountDetailProps> = ({
  accounts,
  transactions,
  onNavigateTab,
  onOpenNewMovement,
  onOpenPSD2Config,
  onSync,
  isSyncing = false,
}) => {
  const [selectedAccountId, setSelectedAccountId] = useState<string>(
    accounts[0]?.id || 'shared-sabadell'
  );

  const selectedAccount = useMemo(() => {
    return accounts.find((acc) => acc.id === selectedAccountId) || accounts[0];
  }, [accounts, selectedAccountId]);

  // Filter transactions belonging to this specific account
  const accountTransactions = useMemo(() => {
    if (!selectedAccount) return [];
    return transactions.filter((tx) => tx.accountId === selectedAccount.id);
  }, [transactions, selectedAccount]);

  // Compute metrics for the selected account
  const metrics = useMemo(() => {
    if (!selectedAccount) return { totalInflows: 0, totalOutflows: 0, netFlow: 0, topCategory: 'General', txCount: 0 };

    let totalInflows = 0;
    let totalOutflows = 0;
    const categoryTotals: Record<string, number> = {};

    accountTransactions.forEach((tx) => {
      if (tx.amount > 0) {
        totalInflows += tx.amount;
      } else {
        const absVal = Math.abs(tx.amount);
        totalOutflows += absVal;
        categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + absVal;
      }
    });

    // Find top category
    let topCat = 'General';
    let maxSpend = 0;
    Object.entries(categoryTotals).forEach(([cat, amount]) => {
      if (amount > maxSpend) {
        maxSpend = amount;
        topCat = cat;
      }
    });

    const netFlow = totalInflows - totalOutflows;

    return {
      totalInflows,
      totalOutflows,
      netFlow,
      topCategory: topCat.charAt(0).toUpperCase() + topCat.slice(1),
      txCount: accountTransactions.length,
    };
  }, [selectedAccount, accountTransactions]);

  if (!selectedAccount) return null;

  const isShared = selectedAccount.ownership === 'shared';
  const myPortion = isShared ? selectedAccount.balance * 0.5 : selectedAccount.balance;
  const partnerPortion = isShared ? selectedAccount.balance * 0.5 : 0;

  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'credit': return <CreditCard className="w-4 h-4" />;
      case 'investment': return <TrendingUp className="w-4 h-4" />;
      case 'savings': return <PiggyBank className="w-4 h-4" />;
      default: return <Landmark className="w-4 h-4" />;
    }
  };

  return (
    <section className="bg-white dark:bg-[#151D2E] rounded-2xl border border-[#E2E8F0] dark:border-[#1E293B] shadow-sm overflow-hidden transition-colors duration-200">
      {/* Header Section */}
      <div className="p-5 sm:p-6 border-b border-[#E2E8F0] dark:border-[#1E293B] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-[#0F172A] dark:text-[#F8FAFC] text-base sm:text-lg">
              Detalle por Cuenta Bancaria
            </h3>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              Desglose Individual & Compartido
            </span>
          </div>
          <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5">
            Selecciona una entidad para auditar sus fondos, cuadre contable PSD2 y desglose de titularidad
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          {onOpenPSD2Config && (
            <button
              onClick={onOpenPSD2Config}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F8FAFC] dark:bg-[#0B0F19] border border-[#E2E8F0] dark:border-[#1E293B] text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC] hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] shadow-xs cursor-pointer transition-colors"
            >
              <Sliders className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Ajustes PSD2</span>
            </button>
          )}
          <button
            onClick={() => onNavigateTab('accounts')}
            className="flex items-center gap-1 text-xs text-[#2563EB] dark:text-[#60A5FA] font-bold hover:underline cursor-pointer px-2 py-1.5"
          >
            <span>Ver todas las cuentas</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 1. SELECTOR INTERACTIVO DE BANCOS / CUENTAS (TABS HORIZONTALES) */}
      <div className="px-5 sm:px-6 pt-4 pb-3 bg-[#F8FAFC]/70 dark:bg-[#0B0F19]/50 border-b border-[#E2E8F0] dark:border-[#1E293B] overflow-x-auto">
        <div className="flex items-center gap-2.5 min-w-max">
          {accounts.map((acc) => {
            const isSelected = acc.id === selectedAccountId;
            const accIsShared = acc.ownership === 'shared';

            return (
              <button
                key={acc.id}
                type="button"
                onClick={() => setSelectedAccountId(acc.id)}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border transition-all cursor-pointer text-left ${
                  isSelected
                    ? 'bg-white dark:bg-[#151D2E] border-[#0F172A] dark:border-[#38BDF8] shadow-sm ring-1 ring-[#0F172A]/10 dark:ring-[#38BDF8]/20'
                    : 'bg-white/80 dark:bg-[#151D2E]/60 border-[#E2E8F0] dark:border-[#1E293B] hover:border-slate-300 dark:hover:border-slate-700 text-[#64748B] dark:text-[#94A3B8]'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  isSelected 
                    ? 'bg-[#0F172A] dark:bg-[#2563EB] text-white' 
                    : 'bg-[#F1F5F9] dark:bg-[#1E293B] text-[#64748B] dark:text-[#94A3B8]'
                }`}>
                  {getAccountIcon(acc.type)}
                </div>

                <div className="pr-1">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-xs font-bold ${isSelected ? 'text-[#0F172A] dark:text-[#F8FAFC]' : 'text-[#64748B] dark:text-[#94A3B8]'}`}>
                      {acc.institution}
                    </span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                      accIsShared 
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}>
                      {accIsShared ? '50/50' : '100%'}
                    </span>
                  </div>
                  <div className="text-xs font-extrabold text-[#0F172A] dark:text-[#F8FAFC] tabular-nums mt-0.5">
                    {formatCurrency(acc.balance)}
                  </div>
                </div>

                {isSelected && (
                  <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-[#38BDF8] shrink-0 ml-1"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. PANEL DE INFORMACIÓN DETALLADA DE LA CUENTA SELECCIONADA */}
      <div className="p-5 sm:p-6 space-y-6">
        {/* Fila de Tarjetas Clave de la Cuenta */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card A: Saldo Total & Conciliación */}
          <div className="bg-[#F8FAFC] dark:bg-[#0B0F19] p-4.5 rounded-xl border border-[#E2E8F0] dark:border-[#1E293B] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
                  Saldo Disponible
                </span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="w-3 h-3" />
                  Cuadrado
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] dark:text-[#F8FAFC] tabular-nums mt-1">
                {formatCurrency(selectedAccount.balance)}
              </div>
              <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] font-mono mt-1">
                {selectedAccount.ibanMasked}
              </p>
            </div>

            <div className="pt-3 mt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
              <span className="text-[#64748B] dark:text-[#94A3B8]">Sincronización PSD2:</span>
              <span className="font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                {selectedAccount.lastSynced}
              </span>
            </div>
          </div>

          {/* Card B: Desglose de Titularidad (Regla Geométrica 50/50 o Individual) */}
          <div className="bg-[#F8FAFC] dark:bg-[#0B0F19] p-4.5 rounded-xl border border-[#E2E8F0] dark:border-[#1E293B] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
                  {isShared ? 'Reparto Pareja (50% / 50%)' : 'Titularidad Individual (100%)'}
                </span>
                {isShared ? (
                  <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                ) : (
                  <User className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                )}
              </div>

              {isShared ? (
                <div className="space-y-2 mt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">Tu parte computable (50%):</span>
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400 tabular-nums">
                      {formatCurrency(myPortion)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">Parte de tu pareja (50%):</span>
                    <span className="text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC] tabular-nums">
                      {formatCurrency(partnerPortion)}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden flex">
                    <div className="bg-blue-600 dark:bg-blue-500 h-full w-1/2" title="Tu cuota (50%)"></div>
                    <div className="bg-slate-400 dark:bg-slate-600 h-full w-1/2" title="Cuota de pareja (50%)"></div>
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5 mt-2">
                  <div className="text-lg font-bold text-[#0F172A] dark:text-[#F8FAFC] tabular-nums">
                    {formatCurrency(myPortion)}
                  </div>
                  <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-tight">
                    Cuenta personal 100% computable para tu presupuesto propio y patrimonio neto sin repartos.
                  </p>
                </div>
              )}
            </div>

            <div className="pt-3 mt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
              <span className="text-[#64748B] dark:text-[#94A3B8]">Tipo de producto:</span>
              <span className="font-semibold text-[#0F172A] dark:text-[#F8FAFC] capitalize">
                {selectedAccount.type === 'checking' ? 'Cuenta Corriente' : selectedAccount.type === 'credit' ? 'Tarjeta de Crédito' : selectedAccount.type === 'investment' ? 'Cartera Inversión' : 'Ahorro / Efectivo'}
              </span>
            </div>
          </div>

          {/* Card C: Flujo Mensual en esta Cuenta */}
          <div className="bg-[#F8FAFC] dark:bg-[#0B0F19] p-4.5 rounded-xl border border-[#E2E8F0] dark:border-[#1E293B] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
                  Actividad en este Banco
                </span>
                <span className="text-xs font-bold text-[#64748B] dark:text-[#94A3B8]">
                  {metrics.txCount} movimientos
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="p-2 rounded-lg bg-white dark:bg-[#151D2E] border border-[#E2E8F0] dark:border-[#1E293B]">
                  <span className="text-[10px] text-[#64748B] dark:text-[#94A3B8] font-bold uppercase block">Cargos</span>
                  <span className="text-sm font-bold text-rose-600 dark:text-rose-400 tabular-nums">
                    -{formatCurrency(metrics.totalOutflows)}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-white dark:bg-[#151D2E] border border-[#E2E8F0] dark:border-[#1E293B]">
                  <span className="text-[10px] text-[#64748B] dark:text-[#94A3B8] font-bold uppercase block">Abonos</span>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                    +{formatCurrency(metrics.totalInflows)}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
              <span className="text-[#64748B] dark:text-[#94A3B8]">Principal categoría:</span>
              <span className="font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                {metrics.topCategory}
              </span>
            </div>
          </div>
        </div>

        {/* 3. LISTA DE MOVIMIENTOS RECIENTES DE ESTE BANCO ESPECÍFICO */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
                Movimientos en {selectedAccount.name} ({accountTransactions.length})
              </h4>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onOpenNewMovement}
                className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#0F172A] dark:bg-[#2563EB] text-white text-[11px] font-semibold hover:opacity-90 transition-all cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Nuevo cargo</span>
              </button>
            </div>
          </div>

          {accountTransactions.length > 0 ? (
            <div className="rounded-xl border border-[#E2E8F0] dark:border-[#1E293B] divide-y divide-[#E2E8F0] dark:divide-[#1E293B] overflow-hidden">
              {accountTransactions.slice(0, 4).map((tx) => {
                const isExpense = tx.amount < 0;
                const personalImpact = getTransactionPersonalImpact(tx);

                return (
                  <div
                    key={tx.id}
                    className="p-3.5 flex items-center justify-between hover:bg-[#F8FAFC] dark:hover:bg-[#1A2438] transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isExpense 
                          ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400' 
                          : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400'
                      }`}>
                        {isExpense ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC] truncate">
                          {tx.concept}
                        </p>
                        <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                          {tx.date} • {tx.notes || (isShared ? 'Reparto 50/50 Pareja' : 'Gasto Propio')}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className={`text-xs sm:text-sm font-bold tabular-nums ${
                        isExpense ? 'text-[#0F172A] dark:text-[#F8FAFC]' : 'text-emerald-600 dark:text-emerald-400'
                      }`}>
                        {formatCurrency(tx.amount)}
                      </div>
                      {isShared && (
                        <div className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold tabular-nums">
                          Tu 50%: {formatCurrency(personalImpact)}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-6 text-center rounded-xl border border-dashed border-[#E2E8F0] dark:border-[#1E293B] bg-[#F8FAFC]/50 dark:bg-[#0B0F19]/30">
              <Receipt className="w-8 h-8 text-[#64748B] dark:text-[#94A3B8] mx-auto mb-2 opacity-50" />
              <p className="text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                No hay movimientos registrados recientemente en esta cuenta
              </p>
              <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] mt-0.5">
                Todos los cargos y abonos sincronizados por PSD2 aparecerán aquí reflejados
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
