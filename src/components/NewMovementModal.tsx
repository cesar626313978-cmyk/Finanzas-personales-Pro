import React, { useState, useEffect } from 'react';
import { 
  X, 
  Store, 
  Calendar, 
  Check, 
  ArrowDownRight, 
  ArrowUpRight, 
  Sparkles,
  CreditCard,
  Tag,
  Users,
  User
} from 'lucide-react';
import { Transaction, AccountOwnershipType, BudgetEnvelope, BankAccount } from '../types';
import { formatCurrency } from '../utils/formatters';

interface NewMovementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tx: Omit<Transaction, 'id'>) => void;
  envelopes: BudgetEnvelope[];
  accounts: BankAccount[];
}

export const NewMovementModal: React.FC<NewMovementModalProps> = ({
  isOpen,
  onClose,
  onSave,
  envelopes,
  accounts,
}) => {
  const [concept, setConcept] = useState('Carrefour Express');
  const [amountStr, setAmountStr] = useState('64.50');
  const [isExpense, setIsExpense] = useState(true);
  const [category, setCategory] = useState(envelopes[0]?.id || 'alimentacion');
  const [accountId, setAccountId] = useState(accounts[0]?.id || 'shared-sabadell');
  const [ownership, setOwnership] = useState<AccountOwnershipType>('Compartida_50_50');
  const [customSplit, setCustomSplit] = useState(50);
  const [dateStr, setDateStr] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [notes, setNotes] = useState('');

  // Auto-switch default ownership based on selected account
  useEffect(() => {
    const selectedAcc = accounts.find((a) => a.id === accountId);
    if (selectedAcc) {
      if (selectedAcc.ownership === 'shared') {
        setOwnership('Compartida_50_50');
      } else {
        setOwnership('Individual');
      }
    }
  }, [accountId, accounts]);

  if (!isOpen) return null;

  const rawAmount = parseFloat(amountStr) || 0;
  // Calculate personal impact
  let splitFactor = 1.0;
  if (ownership === 'Compartida_50_50') {
    splitFactor = 0.5;
  } else if (ownership === 'Compartida_Custom') {
    splitFactor = customSplit / 100;
  }

  const personalImpact = (isExpense ? -1 : 1) * (rawAmount * splitFactor);
  const totalAmountWithSign = (isExpense ? -1 : 1) * rawAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!concept.trim() || rawAmount <= 0) return;

    const selectedAcc = accounts.find((a) => a.id === accountId);
    const now = new Date();
    const formattedDate = `Hoy, ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    onSave({
      concept: concept.trim(),
      amount: totalAmountWithSign,
      date: formattedDate,
      category,
      accountId,
      accountName: selectedAcc ? selectedAcc.name : 'Cuenta Corriente',
      accountType: ownership,
      customSplitPercentage: ownership === 'Compartida_Custom' ? customSplit : (ownership === 'Compartida_50_50' ? 50 : 100),
      notes: notes.trim() || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div 
        className="bg-white dark:bg-[#151D2E] w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-[#E2E8F0] dark:border-[#1E293B] max-h-[90vh] overflow-y-auto transform animate-in zoom-in-95 duration-150 transition-colors duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] dark:border-[#1E293B]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#0F172A] dark:bg-[#2563EB] rounded-lg flex items-center justify-center shrink-0">
              <div className="w-3.5 h-3.5 border-2 border-white rotate-45"></div>
            </div>
            <div>
              <h3 className="font-bold text-[#0F172A] dark:text-[#F8FAFC] text-base">Nuevo Movimiento</h3>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">Imputación y balance geométrico 50/50</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar modal"
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#F1F5F9] dark:bg-[#1E293B] text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          {/* Movement Type Toggle (Gasto vs Ingreso) */}
          <div className="grid grid-cols-2 p-1 bg-[#F1F5F9] dark:bg-[#0B0F19] rounded-lg text-xs font-bold border border-transparent dark:border-[#1E293B]">
            <button
              type="button"
              onClick={() => setIsExpense(true)}
              className={`py-2 rounded-md flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                isExpense ? 'bg-white dark:bg-[#151D2E] text-[#0F172A] dark:text-[#F8FAFC] shadow-xs' : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC]'
              }`}
            >
              <ArrowDownRight className="w-4 h-4 text-rose-500" />
              <span>Gasto</span>
            </button>
            <button
              type="button"
              onClick={() => setIsExpense(false)}
              className={`py-2 rounded-md flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                !isExpense ? 'bg-white dark:bg-[#151D2E] text-[#0F172A] dark:text-[#F8FAFC] shadow-xs' : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC]'
              }`}
            >
              <ArrowUpRight className="w-4 h-4 text-emerald-500" />
              <span>Ingreso</span>
            </button>
          </div>

          {/* Amount Display & Input */}
          <div className="bg-[#F8FAFC] dark:bg-[#0B0F19] p-4 rounded-xl border border-[#E2E8F0] dark:border-[#1E293B] flex flex-col items-center justify-center text-center">
            <label htmlFor="modal-amount-input" className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
              Importe Total de la Operación
            </label>
            <div className="flex items-center justify-center mt-1.5">
              <input
                id="modal-amount-input"
                type="number"
                step="0.01"
                min="0.01"
                required
                value={amountStr}
                onChange={(e) => setAmountStr(e.target.value)}
                className="text-center text-3xl sm:text-4xl font-extrabold text-[#0F172A] dark:text-[#F8FAFC] bg-transparent focus:outline-none w-44 tabular-nums"
                placeholder="0.00"
              />
              <span className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] dark:text-[#F8FAFC] ml-1">€</span>
            </div>
          </div>

          {/* Concepto / Comercio */}
          <div>
            <label htmlFor="modal-concept-input" className="block text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-1.5">
              Concepto o Comercio
            </label>
            <div className="flex items-center bg-[#F8FAFC] dark:bg-[#0B0F19] border border-[#E2E8F0] dark:border-[#1E293B] px-3 py-2.5 rounded-lg focus-within:border-[#0F172A] dark:focus-within:border-[#38BDF8] transition-all">
              <Store className="w-4 h-4 text-[#64748B] dark:text-[#94A3B8] mr-2 shrink-0" />
              <input
                id="modal-concept-input"
                type="text"
                required
                placeholder="Ej. Mercadona, Restaurante, Uber..."
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
                className="bg-transparent text-sm text-[#0F172A] dark:text-[#F8FAFC] w-full focus:outline-none font-medium placeholder:text-[#64748B] dark:placeholder:text-[#64748B]"
              />
            </div>
          </div>

          {/* Titularidad y Reparto (Soporte Multicuenta y Regla 50/50) */}
          <div>
            <label className="block text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-1.5">
              Titularidad y Reparto
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setOwnership('Individual')}
                className={`p-3 rounded-lg text-left border transition-all cursor-pointer ${
                  ownership === 'Individual'
                    ? 'border-[#0F172A] dark:border-[#38BDF8] bg-[#F1F5F9] dark:bg-[#1E293B] text-[#0F172A] dark:text-[#F8FAFC]'
                    : 'border-[#E2E8F0] dark:border-[#1E293B] bg-white dark:bg-[#151D2E] text-[#64748B] dark:text-[#94A3B8] hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <div className="flex items-center gap-1.5">
                    <User className="w-4 h-4 text-[#0F172A] dark:text-[#F8FAFC]" />
                    <span className="text-xs font-bold">Individual 100%</span>
                  </div>
                  {ownership === 'Individual' && (
                    <Check className="w-4 h-4 text-[#0F172A] dark:text-[#38BDF8]" />
                  )}
                </div>
                <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] leading-tight">Asumes el total</p>
              </button>

              <button
                type="button"
                onClick={() => setOwnership('Compartida_50_50')}
                className={`p-3 rounded-lg text-left border transition-all cursor-pointer ${
                  ownership === 'Compartida_50_50'
                    ? 'border-[#0F172A] dark:border-[#38BDF8] bg-[#F1F5F9] dark:bg-[#1E293B] text-[#0F172A] dark:text-[#F8FAFC]'
                    : 'border-[#E2E8F0] dark:border-[#1E293B] bg-white dark:bg-[#151D2E] text-[#64748B] dark:text-[#94A3B8] hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-[#2563EB] dark:text-[#38BDF8]" />
                    <span className="text-xs font-bold text-[#2563EB] dark:text-[#38BDF8]">Pareja 50% / 50%</span>
                  </div>
                  {ownership === 'Compartida_50_50' && (
                    <Check className="w-4 h-4 text-[#2563EB] dark:text-[#38BDF8]" />
                  )}
                </div>
                <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] leading-tight">Mitad a tu sobre</p>
              </button>
            </div>

            {/* Live Calculated Impact Widget */}
            <div className="mt-2.5 p-3 rounded-lg bg-[#F8FAFC] dark:bg-[#0B0F19] border border-[#E2E8F0] dark:border-[#1E293B] flex items-center justify-between">
              <span className="text-xs text-[#64748B] dark:text-[#94A3B8] font-medium">Impacto en tu presupuesto personal:</span>
              <span className={`text-sm font-bold tabular-nums ${isExpense ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                {formatCurrency(personalImpact)}
              </span>
            </div>
          </div>

          {/* Categoría & Cuenta Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="modal-category-select" className="block text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-1.5">
                Sobre / Categoría
              </label>
              <div className="relative">
                <select
                  id="modal-category-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#F8FAFC] dark:bg-[#0B0F19] border border-[#E2E8F0] dark:border-[#1E293B] text-[#0F172A] dark:text-[#F8FAFC] text-xs sm:text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#0F172A] dark:focus:border-[#38BDF8] font-medium appearance-none cursor-pointer"
                >
                  {envelopes.map((env) => (
                    <option key={env.id} value={env.id}>
                      {env.name} ({env.type === 'shared' ? '50% Pareja' : '100% Personal'})
                    </option>
                  ))}
                </select>
                <Tag className="w-4 h-4 text-[#64748B] dark:text-[#94A3B8] absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div>
              <label htmlFor="modal-account-select" className="block text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-1.5">
                Cuenta Origen
              </label>
              <div className="relative">
                <select
                  id="modal-account-select"
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  className="w-full bg-[#F8FAFC] dark:bg-[#0B0F19] border border-[#E2E8F0] dark:border-[#1E293B] text-[#0F172A] dark:text-[#F8FAFC] text-xs sm:text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#0F172A] dark:focus:border-[#38BDF8] font-medium appearance-none cursor-pointer"
                >
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name} ({acc.ownership === 'shared' ? 'Conjunta' : 'Personal'})
                    </option>
                  ))}
                </select>
                <CreditCard className="w-4 h-4 text-[#64748B] dark:text-[#94A3B8] absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Fecha & Notas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="modal-date-input" className="block text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-1.5">
                Fecha
              </label>
              <div className="flex items-center bg-[#F8FAFC] dark:bg-[#0B0F19] border border-[#E2E8F0] dark:border-[#1E293B] px-3 py-2 rounded-lg">
                <Calendar className="w-4 h-4 text-[#64748B] dark:text-[#94A3B8] mr-2" />
                <input
                  id="modal-date-input"
                  type="date"
                  value={dateStr}
                  onChange={(e) => setDateStr(e.target.value)}
                  className="bg-transparent text-xs sm:text-sm text-[#0F172A] dark:text-[#F8FAFC] w-full focus:outline-none font-medium"
                />
              </div>
            </div>

            <div>
              <label htmlFor="modal-notes-input" className="block text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-1.5">
                Nota (Opcional)
              </label>
              <input
                id="modal-notes-input"
                type="text"
                placeholder="Ej. Compra semanal, ticket..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-[#F8FAFC] dark:bg-[#0B0F19] border border-[#E2E8F0] dark:border-[#1E293B] text-xs sm:text-sm text-[#0F172A] dark:text-[#F8FAFC] rounded-lg px-3 py-2 focus:outline-none focus:border-[#0F172A] dark:focus:border-[#38BDF8] font-medium placeholder:text-[#64748B] dark:placeholder:text-[#64748B]"
              />
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-[#E2E8F0] dark:border-[#1E293B] bg-white dark:bg-[#1E293B] text-[#64748B] dark:text-[#94A3B8] text-xs sm:text-sm font-medium hover:text-[#0F172A] dark:hover:text-[#F8FAFC] hover:bg-[#F8FAFC] dark:hover:bg-[#334155] transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-lg bg-[#0F172A] dark:bg-[#2563EB] hover:opacity-90 dark:hover:bg-[#1D4ED8] text-white text-xs sm:text-sm font-medium shadow-sm transition-all cursor-pointer"
            >
              Guardar Movimiento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
