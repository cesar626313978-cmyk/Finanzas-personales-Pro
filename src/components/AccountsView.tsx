import React, { useState } from 'react';
import { 
  Landmark, 
  CreditCard, 
  TrendingUp, 
  Wallet, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  ShieldCheck, 
  ChevronRight,
  Sparkles,
  Lock,
  Sliders,
  KeyRound
} from 'lucide-react';
import { BankAccount, PSD2Settings } from '../types';
import { formatCurrency } from '../utils/formatters';

interface AccountsViewProps {
  accounts: BankAccount[];
  isSyncing: boolean;
  onSync: () => void;
  onUpdateAccountBalance: (id: string, newBalance: number) => void;
  onOpenPSD2Config?: () => void;
  psd2Settings?: PSD2Settings;
}

export const AccountsView: React.FC<AccountsViewProps> = ({
  accounts,
  isSyncing,
  onSync,
  onUpdateAccountBalance,
  onOpenPSD2Config,
  psd2Settings,
}) => {
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);
  const [reconcileModalOpen, setReconcileModalOpen] = useState(false);
  const [reconcileBalanceInput, setReconcileBalanceInput] = useState('');
  const [newBankModalOpen, setNewBankModalOpen] = useState(false);
  const [newBankName, setNewBankName] = useState('Revolut Personal');
  const [newBankType, setNewBankType] = useState<'personal' | 'shared'>('personal');
  const [newBankBalance, setNewBankBalance] = useState('850.00');

  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'credit': return <CreditCard className="w-5 h-5 text-amber-600" />;
      case 'investment': return <TrendingUp className="w-5 h-5 text-emerald-600" />;
      case 'savings': return <Wallet className="w-5 h-5 text-sky-600" />;
      default: return <Landmark className="w-5 h-5 text-indigo-600" />;
    }
  };

  const personalAccounts = accounts.filter((a) => a.ownership === 'personal');
  const sharedAccounts = accounts.filter((a) => a.ownership === 'shared');

  const totalPersonalBalance = personalAccounts.reduce((acc, a) => acc + a.balance, 0);
  const totalSharedBalance = sharedAccounts.reduce((acc, a) => acc + a.balance, 0);

  const handleOpenReconcile = (account: BankAccount) => {
    setSelectedAccount(account);
    setReconcileBalanceInput(account.balance.toString());
    setReconcileModalOpen(true);
  };

  const handleReconcileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAccount) return;
    const val = parseFloat(reconcileBalanceInput);
    if (!isNaN(val)) {
      onUpdateAccountBalance(selectedAccount.id, val);
    }
    setReconcileModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header View Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">
            Cuentas & Conciliación Bancaria
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#94A3B8] mt-0.5">
            Sincronización agregada bajo normativa PSD2 y cuadre de saldos en tiempo real
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onOpenPSD2Config && (
            <button
              onClick={onOpenPSD2Config}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white dark:bg-[#151D2E] border border-[#E2E8F0] dark:border-[#1E293B] text-[#0F172A] dark:text-[#F8FAFC] hover:bg-[#F8FAFC] dark:hover:bg-[#1E293B] text-xs font-semibold shadow-sm transition-colors cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Configuración PSD2</span>
            </button>
          )}
          <button
            onClick={onSync}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white dark:bg-[#151D2E] border border-[#E2E8F0] dark:border-[#1E293B] text-[#0F172A] dark:text-[#F8FAFC] hover:bg-[#F8FAFC] dark:hover:bg-[#1E293B] text-xs font-semibold shadow-sm transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-[#0F172A] dark:text-[#F8FAFC]' : 'text-[#64748B] dark:text-[#94A3B8]'}`} />
            <span>{isSyncing ? 'Sincronizando...' : 'Refrescar Bancos'}</span>
          </button>
          <button
            onClick={() => setNewBankModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0F172A] dark:bg-[#2563EB] hover:opacity-90 dark:hover:bg-[#1D4ED8] text-white text-xs font-medium shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Conectar Cuenta</span>
          </button>
        </div>
      </div>

      {/* Dedicated Open Banking PSD2 Status & Configuration Card */}
      <div className="bg-white dark:bg-[#151D2E] p-5 rounded-2xl border border-[#E2E8F0] dark:border-[#1E293B] shadow-sm transition-colors duration-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm sm:text-base font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                  Conciliación Bancaria PSD2 (Open Banking)
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Conexión Activa & Segura
                </span>
              </div>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5">
                Proveedor AISP: <span className="font-semibold text-[#0F172A] dark:text-[#F8FAFC]">{psd2Settings?.provider || 'Redsys / Tink Hub'}</span> • Licencia Banco de España {psd2Settings?.licenseNumber || '#AISP-8821'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <div className="px-3 py-1.5 rounded-lg bg-[#F8FAFC] dark:bg-[#0B0F19] border border-[#E2E8F0] dark:border-[#1E293B] text-xs">
              <span className="text-[#64748B] dark:text-[#94A3B8]">Consentimiento SCA:</span>{' '}
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {psd2Settings?.consentExpiresInDays || 142} días restantes
              </span>
            </div>
            {onOpenPSD2Config && (
              <button
                onClick={onOpenPSD2Config}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0F172A] dark:bg-[#2563EB] hover:opacity-90 dark:hover:bg-[#1D4ED8] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Configurar PSD2</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Overview Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-[#151D2E] p-5 rounded-2xl border border-[#E2E8F0] dark:border-[#1E293B] shadow-sm flex items-center justify-between transition-colors duration-200">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">Total Cuentas Personales</span>
            <p className="text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC] mt-1.5 tabular-nums">
              {formatCurrency(totalPersonalBalance)}
            </p>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5">{personalAccounts.length} cuentas (Nómina, Inversión, Visa, Efectivo)</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#F1F5F9] dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] flex items-center justify-center text-[#0F172A] dark:text-[#F8FAFC]">
            <Landmark className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#151D2E] p-5 rounded-2xl border border-[#E2E8F0] dark:border-[#1E293B] shadow-sm flex items-center justify-between transition-colors duration-200">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">Fondo Conjunto Pareja</span>
            <p className="text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC] mt-1.5 tabular-nums">
              {formatCurrency(totalSharedBalance)}
            </p>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5">
              Tu parte 50%: <span className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">{formatCurrency(totalSharedBalance * 0.5)}</span>
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Shared Accounts Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">Cuentas Compartidas (En Pareja)</h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 uppercase">
              50/50 Automático
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {sharedAccounts.map((acc) => (
            <div
              key={acc.id}
              className="bg-white dark:bg-[#151D2E] p-5 rounded-2xl border border-[#E2E8F0] dark:border-[#1E293B] shadow-sm hover:border-slate-400 dark:hover:border-slate-600 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  {getAccountIcon(acc.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm sm:text-base font-bold text-[#0F172A] dark:text-[#F8FAFC]">{acc.name}</h3>
                    <span className="px-2 py-0.5 rounded bg-[#F1F5F9] dark:bg-[#1E293B] text-[#64748B] dark:text-[#94A3B8] text-[10px] font-bold uppercase">
                      {acc.institution}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-xs text-[#64748B] dark:text-[#94A3B8] font-mono">{acc.ibanMasked}</span>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Sincronizado {acc.lastSynced}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 dark:border-slate-800">
                <div className="text-left sm:text-right">
                  <p className="text-lg sm:text-xl font-bold text-[#0F172A] dark:text-[#F8FAFC] tabular-nums">
                    {formatCurrency(acc.balance)}
                  </p>
                  <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                    Tu impacto 50%: <span className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">{formatCurrency(acc.balance * 0.5)}</span>
                  </p>
                </div>
                <button
                  onClick={() => handleOpenReconcile(acc)}
                  className="px-3.5 py-1.5 rounded-lg border border-[#E2E8F0] dark:border-[#1E293B] bg-white dark:bg-[#1E293B] hover:bg-[#F8FAFC] dark:hover:bg-[#334155] text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC] transition-colors cursor-pointer shadow-sm"
                >
                  Conciliar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Personal Accounts Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">Cuentas e Inversiones Personales</h2>
          <span className="text-xs text-[#64748B] dark:text-[#94A3B8] font-medium">Titularidad Individual</span>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {personalAccounts.map((acc) => (
            <div
              key={acc.id}
              className="bg-white dark:bg-[#151D2E] p-5 rounded-2xl border border-[#E2E8F0] dark:border-[#1E293B] shadow-sm hover:border-slate-400 dark:hover:border-slate-600 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-[#F1F5F9] dark:bg-[#1E293B] text-[#0F172A] dark:text-[#F8FAFC] flex items-center justify-center shrink-0">
                  {getAccountIcon(acc.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm sm:text-base font-bold text-[#0F172A] dark:text-[#F8FAFC]">{acc.name}</h3>
                    <span className="px-2 py-0.5 rounded bg-[#F1F5F9] dark:bg-[#1E293B] text-[#64748B] dark:text-[#94A3B8] text-[10px] font-bold uppercase">
                      {acc.institution}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-xs text-[#64748B] dark:text-[#94A3B8] font-mono">{acc.ibanMasked}</span>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <span className="text-xs text-[#64748B] dark:text-[#94A3B8] font-medium">
                      {acc.lastSynced}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 dark:border-slate-800">
                <div className="text-left sm:text-right">
                  <p className={`text-lg sm:text-xl font-bold tabular-nums ${
                    acc.balance < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-[#0F172A] dark:text-[#F8FAFC]'
                  }`}>
                    {formatCurrency(acc.balance)}
                  </p>
                  <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">100% Personal</p>
                </div>
                <button
                  onClick={() => handleOpenReconcile(acc)}
                  className="px-3.5 py-1.5 rounded-lg border border-[#E2E8F0] dark:border-[#1E293B] bg-white dark:bg-[#1E293B] hover:bg-[#F8FAFC] dark:hover:bg-[#334155] text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC] transition-colors cursor-pointer shadow-sm"
                >
                  Conciliar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Manual Reconciliation Modal */}
      {reconcileModalOpen && selectedAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#151D2E] w-full max-w-md rounded-2xl p-6 shadow-2xl border border-[#E2E8F0] dark:border-[#1E293B] space-y-4">
            <h3 className="text-base font-bold text-[#0F172A] dark:text-[#F8FAFC]">
              Conciliar Saldo: {selectedAccount.name}
            </h3>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
              Introduce el saldo real según el extracto bancario para verificar que no hay desfase ni transacciones huérfanas.
            </p>

            <form onSubmit={handleReconcileSubmit} className="space-y-4">
              <div className="bg-[#F8FAFC] dark:bg-[#0B0F19] p-4 rounded-xl border border-[#E2E8F0] dark:border-[#1E293B]">
                <label className="text-xs font-bold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider">
                  Saldo Real Confirmado (€)
                </label>
                <div className="flex items-center mt-1">
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={reconcileBalanceInput}
                    onChange={(e) => setReconcileBalanceInput(e.target.value)}
                    className="w-full text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC] bg-transparent focus:outline-none tabular-nums"
                  />
                  <span className="text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC] ml-1">€</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReconcileModalOpen(false)}
                  className="flex-1 py-2.5 rounded-lg border border-[#E2E8F0] dark:border-[#1E293B] text-xs font-medium text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] hover:bg-[#F8FAFC] dark:hover:bg-[#1E293B] cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-lg bg-[#0F172A] dark:bg-[#2563EB] text-white text-xs font-medium hover:opacity-90 dark:hover:bg-[#1D4ED8] shadow-sm cursor-pointer"
                >
                  Marcar como Conciliado
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Connect Bank Modal */}
      {newBankModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#151D2E] w-full max-w-md rounded-2xl p-6 shadow-2xl border border-[#E2E8F0] dark:border-[#1E293B] space-y-4">
            <div className="flex items-center gap-2 text-[#0F172A] dark:text-[#F8FAFC]">
              <Lock className="w-5 h-5 text-[#0F172A] dark:text-[#F8FAFC]" />
              <h3 className="text-base font-bold text-[#0F172A] dark:text-[#F8FAFC]">Conexión Segura Open Banking PSD2</h3>
            </div>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
              Conecta tu banco con credenciales bancarias de sólo lectura cifradas de extremo a extremo.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-1">Nombre de la Cuenta o Banco</label>
                <input
                  type="text"
                  value={newBankName}
                  onChange={(e) => setNewBankName(e.target.value)}
                  className="w-full bg-[#F8FAFC] dark:bg-[#0B0F19] border border-[#E2E8F0] dark:border-[#1E293B] text-xs sm:text-sm rounded-lg px-3 py-2 font-medium text-[#0F172A] dark:text-[#F8FAFC]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-1">Titularidad</label>
                <select
                  value={newBankType}
                  onChange={(e) => setNewBankType(e.target.value as 'personal' | 'shared')}
                  className="w-full bg-[#F8FAFC] dark:bg-[#0B0F19] border border-[#E2E8F0] dark:border-[#1E293B] text-xs sm:text-sm rounded-lg px-3 py-2 font-medium text-[#0F172A] dark:text-[#F8FAFC]"
                >
                  <option value="personal">Personal 100%</option>
                  <option value="shared">Compartida (En Pareja 50%)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-1">Saldo Inicial (€)</label>
                <input
                  type="number"
                  step="0.01"
                  value={newBankBalance}
                  onChange={(e) => setNewBankBalance(e.target.value)}
                  className="w-full bg-[#F8FAFC] dark:bg-[#0B0F19] border border-[#E2E8F0] dark:border-[#1E293B] text-xs sm:text-sm rounded-lg px-3 py-2 font-medium text-[#0F172A] dark:text-[#F8FAFC]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setNewBankModalOpen(false)}
                  className="flex-1 py-2.5 rounded-lg border border-[#E2E8F0] dark:border-[#1E293B] text-xs font-medium text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] hover:bg-[#F8FAFC] dark:hover:bg-[#1E293B] cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const bal = parseFloat(newBankBalance) || 0;
                    accounts.push({
                      id: `acc-${Date.now()}`,
                      name: newBankName,
                      institution: newBankName.split(' ')[0] || 'Banco',
                      logo: 'Landmark',
                      type: 'checking',
                      ownership: newBankType,
                      balance: bal,
                      currency: 'EUR',
                      lastSynced: 'Ahora mismo',
                      ibanMasked: 'ES99 **** **** 9012',
                    });
                    setNewBankModalOpen(false);
                  }}
                  className="flex-1 py-2.5 rounded-lg bg-[#0F172A] dark:bg-[#2563EB] text-white text-xs font-medium hover:opacity-90 dark:hover:bg-[#1D4ED8] shadow-sm cursor-pointer"
                >
                  Conectar y Sincronizar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
