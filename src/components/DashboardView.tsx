import React from 'react';
import { 
  Wallet, 
  PieChart, 
  TrendingUp, 
  CheckCircle2, 
  ShoppingCart, 
  Home, 
  Car, 
  Utensils, 
  Tv, 
  Heart, 
  Store, 
  Bolt, 
  Layers, 
  RefreshCw, 
  ArrowRight,
  SlidersHorizontal,
  Sliders,
  Sparkles,
  ShieldCheck,
  Building2,
  Receipt
} from 'lucide-react';
import { 
  Transaction, 
  BudgetEnvelope, 
  ContextFilter, 
  ActiveTab,
  BankAccount,
  NetWorthItem
} from '../types';
import { 
  formatCurrency, 
  getSemaphoricStyle, 
  getTransactionPersonalImpact 
} from '../utils/formatters';
import { MonthlySpendBarChart } from './charts/MonthlySpendBarChart';
import { NetWorthLineChart } from './charts/NetWorthLineChart';
import { DashboardAccountDetail } from './DashboardAccountDetail';

interface DashboardViewProps {
  contextFilter: ContextFilter;
  transactions: Transaction[];
  envelopes: BudgetEnvelope[];
  accounts: BankAccount[];
  netWorthItems?: NetWorthItem[];
  isSyncing: boolean;
  onSync: () => void;
  onNavigateTab: (tab: ActiveTab) => void;
  onOpenNewMovement: () => void;
  onQuickAdjustEnvelope?: (envelope: BudgetEnvelope) => void;
  onOpenPSD2Config?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  contextFilter,
  transactions,
  envelopes,
  accounts,
  netWorthItems,
  isSyncing,
  onSync,
  onNavigateTab,
  onOpenNewMovement,
  onQuickAdjustEnvelope,
  onOpenPSD2Config,
}) => {
  // Category icon mapping helper
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

  const getTxIcon = (category: string) => {
    switch (category) {
      case 'alimentacion': return <Store className="w-4 h-4 text-sky-600" />;
      case 'vivienda': return <Bolt className="w-4 h-4 text-indigo-600" />;
      case 'movilidad': return <Car className="w-4 h-4 text-emerald-600" />;
      case 'ocio': return <Utensils className="w-4 h-4 text-amber-600" />;
      case 'suscripciones': return <Tv className="w-4 h-4 text-violet-600" />;
      case 'salud': return <Heart className="w-4 h-4 text-rose-600" />;
      default: return <Receipt className="w-4 h-4 text-slate-600" />;
    }
  };

  // Filter envelopes based on context
  const filteredEnvelopes = envelopes.filter((env) => {
    if (contextFilter === 'all') return true;
    return env.type === contextFilter;
  });

  // Filter transactions based on context
  const filteredTransactions = transactions.filter((tx) => {
    if (contextFilter === 'all') return true;
    if (contextFilter === 'personal') return tx.accountType === 'Individual';
    return tx.accountType === 'Compartida_50_50' || tx.accountType === 'Compartida_Custom';
  });

  // Dynamic KPI calculations
  const totalSpent = filteredEnvelopes.reduce((acc, env) => acc + env.spent, 0);
  const totalLimit = filteredEnvelopes.reduce((acc, env) => acc + env.limit, 0);
  const spentPercent = totalLimit > 0 ? (totalSpent / totalLimit) * 100 : 0;
  const remainingBudget = Math.max(0, totalLimit - totalSpent);

  // Joint account balance
  const jointAccount = accounts.find((a) => a.ownership === 'shared');
  const jointBalance = jointAccount ? jointAccount.balance : 3400.00;
  const myJointPart = jointBalance * 0.5;
  const partnerJointPart = jointBalance * 0.5;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. FILA SUPERIOR DE KPIS (4 CARDS GEOMÉTRICOS EQUILIBRADOS) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Disponible para Asignar (Base Cero) */}
        <div 
          onClick={() => onNavigateTab('budget')}
          className="bg-white dark:bg-[#151D2E] p-5 rounded-2xl border border-[#E2E8F0] dark:border-[#1E293B] shadow-sm hover:border-slate-400 dark:hover:border-slate-600 transition-all cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="text-xs font-bold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-2">
              Disponible (Base Cero)
            </div>
            <div className="text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC] tabular-nums">
              0,00 €
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full w-fit">
            <CheckCircle2 className="w-3 h-3" />
            <span>Listo para asignar (Base Cero OK)</span>
          </div>
        </div>

        {/* Card 2: Gasto del Mes */}
        <div 
          onClick={() => onNavigateTab('budget')}
          className="bg-white dark:bg-[#151D2E] p-5 rounded-2xl border border-[#E2E8F0] dark:border-[#1E293B] shadow-sm hover:border-slate-400 dark:hover:border-slate-600 transition-all cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="text-xs font-bold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-2">
              Gasto del Mes
            </div>
            <div className="text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC] tabular-nums">
              {formatCurrency(totalSpent)}
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  spentPercent >= 90 ? 'bg-rose-500' : spentPercent >= 70 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, spentPercent)}%` }}
              ></div>
            </div>
          </div>
          <div className="mt-1 text-[10px] text-[#64748B] dark:text-[#94A3B8] flex justify-between">
            <span>{spentPercent.toFixed(0)}% de {formatCurrency(totalLimit)} límite</span>
            <span>11d restantes</span>
          </div>
        </div>

        {/* Card 3: Patrimonio Neto */}
        <div 
          onClick={() => onNavigateTab('networth')}
          className="bg-white dark:bg-[#151D2E] p-5 rounded-2xl border border-[#E2E8F0] dark:border-[#1E293B] shadow-sm hover:border-slate-400 dark:hover:border-slate-600 transition-all cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="text-xs font-bold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-2">
              Patrimonio Neto
            </div>
            <div className="text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC] tabular-nums">
              48.250 €
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold underline">
            <TrendingUp className="w-3 h-3" />
            <span>+3.4% vs mes anterior (+1.580 €)</span>
          </div>
        </div>

        {/* Card 4: Fondo Compartido */}
        <div 
          onClick={() => onNavigateTab('accounts')}
          className="bg-white dark:bg-[#151D2E] p-5 rounded-2xl border border-[#E2E8F0] dark:border-[#1E293B] shadow-sm hover:border-slate-400 dark:hover:border-slate-600 transition-all cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="text-xs font-bold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-2">
              Fondo Compartido
            </div>
            <div className="text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC] tabular-nums">
              {formatCurrency(jointBalance)}
            </div>
          </div>
          <div className="mt-2 text-[10px] text-[#64748B] dark:text-[#94A3B8] flex items-center justify-between">
            <span><strong className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">Tú (50%):</strong> {formatCurrency(myJointPart)}</span>
            <span><strong className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">Pareja:</strong> {formatCurrency(partnerJointPart)}</span>
          </div>
        </div>
      </section>

      {/* 2. GRÁFICOS INTERACTIVOS (GEOMETRIC BALANCE: GASTO DEL MES & PATRIMONIO NETO) */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MonthlySpendBarChart
          envelopes={filteredEnvelopes}
          onEnvelopeClick={() => onNavigateTab('budget')}
        />
        <NetWorthLineChart
          items={netWorthItems}
          onNavigateToNetWorth={() => onNavigateTab('networth')}
        />
      </section>

      {/* 3. BANNER DE CONCILIACIÓN ACTIVA */}
      <section className="bg-white dark:bg-[#151D2E] p-4 sm:p-5 rounded-2xl border border-[#E2E8F0] dark:border-[#1E293B] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 transition-colors duration-200">
        <div 
          onClick={onOpenPSD2Config}
          className="flex items-center gap-3.5 cursor-pointer group"
          title="Ver y configurar conciliación bancaria PSD2"
        >
          <div className="w-10 h-10 rounded-lg bg-[#F1F5F9] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] flex items-center justify-center text-[#0F172A] dark:text-[#F8FAFC] shrink-0 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-[#0F172A] dark:text-[#F8FAFC] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                Conciliación Bancaria PSD2 Activa
              </h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Conectado
              </span>
            </div>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5">
              Sincronizado en tiempo real con Banco Sabadell & BBVA hoy a las 09:30 • Click para configurar
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          {onOpenPSD2Config && (
            <button
              onClick={onOpenPSD2Config}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] text-[#0F172A] dark:text-[#F8FAFC] hover:bg-[#F1F5F9] dark:hover:bg-[#253347] text-xs font-semibold transition-all cursor-pointer shadow-xs"
            >
              <Sliders className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Configurar PSD2</span>
            </button>
          )}
          <button
            onClick={onSync}
            disabled={isSyncing}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg bg-[#F1F5F9] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] text-[#0F172A] dark:text-[#F8FAFC] hover:bg-[#E2E8F0] dark:hover:bg-[#253347] text-xs font-semibold transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-[#0F172A] dark:text-[#F8FAFC]' : ''}`} />
            <span>{isSyncing ? 'Sincronizando...' : 'Actualizar'}</span>
          </button>
          <button
            onClick={() => onNavigateTab('accounts')}
            className="flex items-center justify-center px-4 py-2 rounded-lg bg-[#0F172A] dark:bg-[#2563EB] hover:opacity-90 dark:hover:bg-[#1D4ED8] text-white text-xs font-medium shadow-sm transition-colors cursor-pointer"
          >
            <span>Ver Cuentas</span>
          </button>
        </div>
      </section>

      {/* 4. DETALLE POR CUENTA INDIVIDUAL CON SELECTOR INTERACTIVO DE BANCO */}
      <DashboardAccountDetail
        accounts={accounts}
        transactions={transactions}
        onNavigateTab={onNavigateTab}
        onOpenNewMovement={onOpenNewMovement}
        onOpenPSD2Config={onOpenPSD2Config}
        onSync={onSync}
        isSyncing={isSyncing}
      />

      {/* 5. SECCIÓN MEDIA: SOBRES PRESUPUESTARIOS (BASE CERO) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <h2 className="text-base sm:text-lg font-bold text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">
              Sobres Presupuestarios (Base Cero)
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F1F5F9] dark:bg-[#1E293B] text-[#64748B] dark:text-[#94A3B8] uppercase">
              {filteredEnvelopes.length} categorías
            </span>
          </div>
          <button
            onClick={() => onNavigateTab('budget')}
            className="flex items-center gap-1.5 text-xs font-bold text-[#2563EB] dark:text-[#60A5FA] hover:underline transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Ajustar Presupuestos</span>
          </button>
        </div>

        {/* Categories Grid (Geometric Balance 3-Col Layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEnvelopes.map((env) => {
            const percent = (env.spent / env.limit) * 100;
            const isShared = env.type === 'shared';

            return (
              <div
                key={env.id}
                onClick={() => onQuickAdjustEnvelope && onQuickAdjustEnvelope(env)}
                className="bg-white dark:bg-[#151D2E] p-5 rounded-2xl border border-[#E2E8F0] dark:border-[#1E293B] shadow-sm flex flex-col justify-between min-h-[180px] hover:border-slate-400 dark:hover:border-slate-600 transition-all cursor-pointer"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="p-2 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-lg">
                      {getCategoryIcon(env.icon)}
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      isShared ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400' : 'bg-slate-100 dark:bg-slate-800 text-[#64748B] dark:text-[#94A3B8]'
                    }`}>
                      {isShared ? 'Compartido 50%' : 'Personal 100%'}
                    </span>
                  </div>
                  <div className="font-bold text-lg leading-tight text-[#0F172A] dark:text-[#F8FAFC]">
                    {env.name}
                  </div>
                  <div className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1">
                    Gasto: {formatCurrency(env.spent)} {isShared ? `(Impacto 50%: ${formatCurrency(env.spent * 0.5)})` : ''}
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-[11px] font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                    <span>{percent.toFixed(0)}% consumido</span>
                    <span className="text-[#64748B] dark:text-[#94A3B8]">Límite: {formatCurrency(env.limit)}</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        percent >= 90 ? 'bg-rose-500' : percent >= 70 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, percent)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. SECCIÓN INFERIOR: MOVIMIENTOS RECIENTES */}
      <section className="bg-white dark:bg-[#151D2E] rounded-2xl border border-[#E2E8F0] dark:border-[#1E293B] shadow-sm overflow-hidden flex flex-col transition-colors duration-200">
        <div className="px-6 py-4 border-b border-[#E2E8F0] dark:border-[#1E293B] flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">Movimientos Recientes</h3>
            <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">({filteredTransactions.length})</span>
          </div>
          <button
            onClick={() => onNavigateTab('transactions')}
            className="text-xs text-[#2563EB] dark:text-[#60A5FA] font-bold hover:underline cursor-pointer"
          >
            Ver todo
          </button>
        </div>

        <div className="divide-y divide-slate-50 dark:divide-slate-800/60">
          {filteredTransactions.slice(0, 5).map((tx) => {
            const isShared = tx.accountType === 'Compartida_50_50';
            const personalImpact = getTransactionPersonalImpact(tx);
            const firstLetter = tx.concept.charAt(0).toUpperCase();

            return (
              <div
                key={tx.id}
                className="px-6 py-3.5 flex items-center justify-between hover:bg-[#F8FAFC] dark:hover:bg-[#1A2438] transition-colors"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center font-bold text-slate-500 dark:text-slate-300 text-sm shrink-0">
                    {firstLetter}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC] truncate">
                      {tx.concept}
                    </div>
                    <div className="text-[10px] text-[#64748B] dark:text-[#94A3B8]">
                      {tx.date} • {tx.accountName}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC] tabular-nums">
                    {formatCurrency(personalImpact)}
                  </div>
                  <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                    isShared ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50' : 'text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800'
                  }`}>
                    {isShared ? 'Compartido 50%' : 'Personal'}
                  </div>
                </div>
              </div>
            );
          })}

          {filteredTransactions.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">No hay movimientos registrados en este filtro.</p>
              <button
                onClick={onOpenNewMovement}
                className="mt-3 px-4 py-2 rounded-lg bg-[#0F172A] dark:bg-[#2563EB] text-white font-medium text-xs hover:opacity-90 transition-opacity"
              >
                + Registrar movimiento
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
