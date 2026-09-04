import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  PlusCircle, 
  Trash2, 
  Store, 
  Bolt, 
  Car, 
  Utensils, 
  Tv, 
  Heart, 
  Receipt,
  ArrowUpDown,
  Tag,
  CreditCard
} from 'lucide-react';
import { Transaction, BudgetEnvelope, BankAccount } from '../types';
import { formatCurrency, getTransactionPersonalImpact } from '../utils/formatters';

interface TransactionsViewProps {
  transactions: Transaction[];
  envelopes: BudgetEnvelope[];
  accounts: BankAccount[];
  onDeleteTransaction: (id: string) => void;
  onOpenNewMovement: () => void;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({
  transactions,
  envelopes,
  accounts,
  onDeleteTransaction,
  onOpenNewMovement,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedAccount, setSelectedAccount] = useState('all');
  const [selectedOwnership, setSelectedOwnership] = useState('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount_desc' | 'amount_asc'>('date');

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

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchSearch = tx.concept.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (tx.notes && tx.notes.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchCat = selectedCategory === 'all' || tx.category === selectedCategory;
      const matchAcc = selectedAccount === 'all' || tx.accountId === selectedAccount;
      const matchOwnership = selectedOwnership === 'all' ||
        (selectedOwnership === 'individual' && tx.accountType === 'Individual') ||
        (selectedOwnership === 'shared' && tx.accountType === 'Compartida_50_50');

      return matchSearch && matchCat && matchAcc && matchOwnership;
    }).sort((a, b) => {
      if (sortBy === 'amount_desc') return Math.abs(b.amount) - Math.abs(a.amount);
      if (sortBy === 'amount_asc') return Math.abs(a.amount) - Math.abs(b.amount);
      return 0; // default order
    });
  }, [transactions, searchTerm, selectedCategory, selectedAccount, selectedOwnership, sortBy]);

  const totalFilteredSum = filteredTransactions.reduce((acc, tx) => acc + tx.amount, 0);
  const totalPersonalImpact = filteredTransactions.reduce((acc, tx) => acc + getTransactionPersonalImpact(tx), 0);

  const exportCSV = () => {
    const headers = 'ID,Concepto,Importe Total,Impacto Personal,Fecha,Categoria,Cuenta,Tipo\n';
    const rows = filteredTransactions.map((tx) => 
      `"${tx.id}","${tx.concept}",${tx.amount},${getTransactionPersonalImpact(tx)},"${tx.date}","${tx.category}","${tx.accountName}","${tx.accountType}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `finamatch-movimientos-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header View Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">
            Movimientos & Transacciones
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#94A3B8] mt-0.5">
            Registro con imputación 50/50 y conciliación multicuenta PSD2
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white dark:bg-[#151D2E] border border-[#E2E8F0] dark:border-[#1E293B] text-[#0F172A] dark:text-[#F8FAFC] hover:bg-[#F8FAFC] dark:hover:bg-[#1E293B] text-xs font-semibold shadow-sm transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#64748B] dark:text-[#94A3B8]" />
            <span>Exportar CSV</span>
          </button>
          <button
            onClick={onOpenNewMovement}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0F172A] dark:bg-[#2563EB] hover:opacity-90 dark:hover:bg-[#1D4ED8] text-white text-xs font-medium shadow-sm transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Nuevo Movimiento</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#151D2E] p-5 rounded-2xl border border-[#E2E8F0] dark:border-[#1E293B] shadow-sm transition-colors duration-200">
          <span className="text-xs font-bold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">Total Transacciones</span>
          <p className="text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC] mt-1.5 tabular-nums">
            {filteredTransactions.length}
          </p>
          <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5">Movimientos registrados</p>
        </div>

        <div className="bg-white dark:bg-[#151D2E] p-5 rounded-2xl border border-[#E2E8F0] dark:border-[#1E293B] shadow-sm transition-colors duration-200">
          <span className="text-xs font-bold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">Gasto Bruto Total</span>
          <p className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1.5 tabular-nums">
            {formatCurrency(totalFilteredSum)}
          </p>
          <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5">Suma íntegra de tickets</p>
        </div>

        <div className="bg-white dark:bg-[#151D2E] p-5 rounded-2xl border border-[#E2E8F0] dark:border-[#1E293B] shadow-sm transition-colors duration-200">
          <span className="text-xs font-bold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">Tu Impacto Personal Real</span>
          <p className="text-2xl font-bold text-[#2563EB] dark:text-[#38BDF8] mt-1.5 tabular-nums">
            {formatCurrency(totalPersonalImpact)}
          </p>
          <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5">Aplicada la regla 50/50 en compras conjuntas</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white dark:bg-[#151D2E] p-4 rounded-2xl border border-[#E2E8F0] dark:border-[#1E293B] shadow-sm space-y-3 transition-colors duration-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#64748B] dark:text-[#94A3B8] absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Buscar por comercio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#F8FAFC] dark:bg-[#0B0F19] border border-[#E2E8F0] dark:border-[#1E293B] text-[#0F172A] dark:text-[#F8FAFC] text-xs sm:text-sm rounded-lg focus:outline-none focus:border-[#0F172A] dark:focus:border-[#38BDF8] font-medium placeholder:text-[#64748B] dark:placeholder:text-[#64748B]"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-[#F8FAFC] dark:bg-[#0B0F19] border border-[#E2E8F0] dark:border-[#1E293B] text-[#0F172A] dark:text-[#F8FAFC] text-xs sm:text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#0F172A] dark:focus:border-[#38BDF8] font-medium appearance-none cursor-pointer"
            >
              <option value="all">Todas las categorías</option>
              {envelopes.map((e) => (
                <option key={e.id} value={e.id}>{e.name}</option>
              ))}
            </select>
            <Tag className="w-3.5 h-3.5 text-[#64748B] dark:text-[#94A3B8] absolute right-3 top-3 pointer-events-none" />
          </div>

          {/* Account Filter */}
          <div className="relative">
            <select
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              className="w-full bg-[#F8FAFC] dark:bg-[#0B0F19] border border-[#E2E8F0] dark:border-[#1E293B] text-[#0F172A] dark:text-[#F8FAFC] text-xs sm:text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#0F172A] dark:focus:border-[#38BDF8] font-medium appearance-none cursor-pointer"
            >
              <option value="all">Todas las cuentas</option>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
            <CreditCard className="w-3.5 h-3.5 text-[#64748B] dark:text-[#94A3B8] absolute right-3 top-3 pointer-events-none" />
          </div>

          {/* Ownership Filter */}
          <div className="relative">
            <select
              value={selectedOwnership}
              onChange={(e) => setSelectedOwnership(e.target.value)}
              className="w-full bg-[#F8FAFC] dark:bg-[#0B0F19] border border-[#E2E8F0] dark:border-[#1E293B] text-[#0F172A] dark:text-[#F8FAFC] text-xs sm:text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#0F172A] dark:focus:border-[#38BDF8] font-medium appearance-none cursor-pointer"
            >
              <option value="all">Cualquier titularidad</option>
              <option value="individual">Personal 100%</option>
              <option value="shared">Compartida 50%</option>
            </select>
            <Filter className="w-3.5 h-3.5 text-[#64748B] dark:text-[#94A3B8] absolute right-3 top-3 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="space-y-2.5">
        {filteredTransactions.map((tx) => {
          const isShared = tx.accountType === 'Compartida_50_50';
          const personalImpact = getTransactionPersonalImpact(tx);
          const firstLetter = tx.concept.charAt(0).toUpperCase();

          return (
            <div
              key={tx.id}
              className="bg-white dark:bg-[#151D2E] p-4 rounded-2xl border border-[#E2E8F0] dark:border-[#1E293B] shadow-sm hover:border-slate-400 dark:hover:border-slate-600 transition-all flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center font-bold text-slate-500 dark:text-slate-300 text-sm shrink-0">
                  {firstLetter}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC] truncate">{tx.concept}</p>
                    {tx.notes && (
                      <span className="hidden md:inline text-[11px] text-[#64748B] dark:text-[#94A3B8] italic truncate">
                        "{tx.notes}"
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-xs text-[#64748B] dark:text-[#94A3B8] font-medium">{tx.date}</span>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isShared ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400' : 'bg-slate-100 dark:bg-slate-800 text-[#64748B] dark:text-[#94A3B8]'
                    }`}>
                      {isShared ? '50% Compartido' : 'Personal 100%'}
                    </span>
                    <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
                    <span className="text-xs text-[#64748B] dark:text-[#94A3B8] hidden sm:inline font-medium">{tx.accountName}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right">
                  <p className="text-sm sm:text-base font-bold text-[#0F172A] dark:text-[#F8FAFC] tabular-nums">
                    {formatCurrency(personalImpact)}
                  </p>
                  {isShared && (
                    <p className="text-xs text-[#64748B] dark:text-[#94A3B8] line-through tabular-nums">
                      {formatCurrency(tx.amount)} tot.
                    </p>
                  )}
                  {!isShared && (
                    <p className="text-[10px] text-[#64748B] dark:text-[#94A3B8] font-medium">{tx.accountName}</p>
                  )}
                </div>

                <button
                  onClick={() => onDeleteTransaction(tx.id)}
                  title="Eliminar movimiento"
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}

        {filteredTransactions.length === 0 && (
          <div className="p-12 text-center bg-white dark:bg-[#151D2E] rounded-2xl border border-[#E2E8F0] dark:border-[#1E293B] shadow-sm">
            <p className="text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC]">No se encontraron movimientos con los filtros aplicados</p>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1">Prueba a limpiar la búsqueda o cambia el contexto seleccionado.</p>
          </div>
        )}
      </div>
    </div>
  );
};
