import React, { useState, useEffect } from 'react';
import { 
  ActiveTab, 
  ContextFilter, 
  Transaction, 
  BudgetEnvelope, 
  BankAccount, 
  NetWorthItem,
  PSD2Settings
} from './types';
import { 
  INITIAL_TRANSACTIONS, 
  INITIAL_ENVELOPES, 
  INITIAL_ACCOUNTS, 
  INITIAL_NET_WORTH_ITEMS,
  PARTNER_ACCOUNTS,
  PARTNER_TRANSACTIONS 
} from './data/initialData';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { DashboardView } from './components/DashboardView';
import { TransactionsView } from './components/TransactionsView';
import { BudgetZeroView } from './components/BudgetZeroView';
import { AccountsView } from './components/AccountsView';
import { NetWorthView } from './components/NetWorthView';
import { NewMovementModal } from './components/NewMovementModal';
import { PSD2ConfigModal } from './components/PSD2ConfigModal';
import { PartnerInviteModal } from './components/PartnerInviteModal';
import { PWAInstallModal } from './components/PWAInstallModal';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { Toast, ToastData } from './components/Toast';
import { formatCurrency, getTransactionPersonalImpact } from './utils/formatters';

function AppContent() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [contextFilter, setContextFilter] = useState<ContextFilter>('all');
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [envelopes, setEnvelopes] = useState<BudgetEnvelope[]>(INITIAL_ENVELOPES);
  const [accounts, setAccounts] = useState<BankAccount[]>(INITIAL_ACCOUNTS);
  const [netWorthItems, setNetWorthItems] = useState<NetWorthItem[]>(INITIAL_NET_WORTH_ITEMS);
  const [isNewMovementModalOpen, setIsNewMovementModalOpen] = useState(false);
  const [isPSD2ModalOpen, setIsPSD2ModalOpen] = useState(false);
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
  const [isPWAInstallModalOpen, setIsPWAInstallModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [toast, setToast] = useState<ToastData | null>(null);

  // Switch accounts dynamically based on active user to demonstrate true multi-user isolation
  useEffect(() => {
    if (currentUser?.email?.includes('elena')) {
      setAccounts(PARTNER_ACCOUNTS);
      setTransactions(PARTNER_TRANSACTIONS);
      showToast('Perfil activo: Elena. Cuentas personales de César aisladas.', 'info');
    } else {
      setAccounts(INITIAL_ACCOUNTS);
      setTransactions(INITIAL_TRANSACTIONS);
      if (currentUser) {
        showToast('Perfil activo: César. Cuentas personales de Elena aisladas.', 'info');
      }
    }
  }, [currentUser?.email]);

  const [psd2Settings, setPsd2Settings] = useState<PSD2Settings>({
    isEnabled: true,
    provider: 'Redsys / Tink Open Banking Hub',
    licenseNumber: 'AISP-8821 (Banco de España)',
    syncFrequency: '6h',
    consentExpiresInDays: 142,
    consentExpiryDate: '15 de Enero de 2027',
    autoMatchTransfers: true,
    autoSplitSharedAccounts: true,
    discrepancyAlerts: true,
    toleranceCents: 0.05,
    lastReconciledAt: 'Hoy, 09:30',
  });

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToast({
      id: `toast-${Date.now()}`,
      message,
      type,
    });
  };

  const handleSavePSD2Settings = (newSettings: PSD2Settings) => {
    setPsd2Settings(newSettings);
    showToast('Configuración PSD2 y conciliación bancaria guardada con éxito', 'success');
  };

  // 1. Add Transaction & Recalculate
  const handleSaveTransaction = (newTxData: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...newTxData,
      id: `tx-${Date.now()}`,
    };

    setTransactions((prev) => [newTx, ...prev]);

    // Update Envelope spend
    if (newTx.amount < 0) {
      const expenseValue = Math.abs(newTx.amount);
      setEnvelopes((prev) =>
        prev.map((env) => {
          if (env.id === newTx.category) {
            return {
              ...env,
              spent: env.spent + expenseValue,
            };
          }
          return env;
        })
      );
    }

    // Update Account Balance
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === newTx.accountId) {
          return {
            ...acc,
            balance: acc.balance + newTx.amount,
          };
        }
        return acc;
      })
    );

    const personalImpact = getTransactionPersonalImpact(newTx);
    showToast(
      `Guardado: "${newTx.concept}" (${formatCurrency(personalImpact)} en tu presupuesto personal)`,
      'success'
    );
  };

  // 2. Delete Transaction
  const handleDeleteTransaction = (id: string) => {
    const txToDelete = transactions.find((t) => t.id === id);
    if (!txToDelete) return;

    setTransactions((prev) => prev.filter((t) => t.id !== id));

    // Revert envelope if it was expense
    if (txToDelete.amount < 0) {
      const expenseValue = Math.abs(txToDelete.amount);
      setEnvelopes((prev) =>
        prev.map((env) => {
          if (env.id === txToDelete.category) {
            return {
              ...env,
              spent: Math.max(0, env.spent - expenseValue),
            };
          }
          return env;
        })
      );
    }

    // Revert Account Balance
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === txToDelete.accountId) {
          return {
            ...acc,
            balance: acc.balance - txToDelete.amount,
          };
        }
        return acc;
      })
    );

    showToast(`Movimiento "${txToDelete.concept}" eliminado correctamente`, 'info');
  };

  // 3. Update Envelope Limit (Zero-based rule)
  const handleUpdateEnvelopeLimit = (id: string, newLimit: number) => {
    setEnvelopes((prev) =>
      prev.map((env) => {
        if (env.id === id) {
          return { ...env, limit: newLimit };
        }
        return env;
      })
    );
    showToast('Límite de sobre presupuestario actualizado', 'success');
  };

  // 4. Transfer between Envelopes
  const handleTransferFunds = (fromId: string, toId: string, amount: number) => {
    setEnvelopes((prev) =>
      prev.map((env) => {
        if (env.id === fromId) {
          return { ...env, limit: Math.max(0, env.limit - amount) };
        }
        if (env.id === toId) {
          return { ...env, limit: env.limit + amount };
        }
        return env;
      })
    );
    showToast(`Traspaso de ${formatCurrency(amount)} completado entre sobres`, 'success');
  };

  // 5. Update Manual Account Balance
  const handleUpdateAccountBalance = (accountId: string, newBalance: number) => {
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === accountId) {
          return {
            ...acc,
            balance: newBalance,
            lastSynced: 'Ahora mismo (manual)',
          };
        }
        return acc;
      })
    );
    showToast('Saldo bancario conciliado correctamente', 'success');
  };

  // 6. Global PSD2 Sync Simulation
  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setAccounts((prev) =>
        prev.map((acc) => ({
          ...acc,
          lastSynced: 'Hoy, ' + new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        }))
      );
      showToast('Cuentas sincronizadas con éxito vía Open Banking PSD2', 'success');
    }, 900);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] text-[#0F172A] dark:text-[#F8FAFC] flex flex-col antialiased selection:bg-indigo-100 selection:text-indigo-900 pb-20 lg:pb-8 transition-colors duration-200">
      {/* Desktop Persistent Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isSyncing={isSyncing}
        onSync={handleSync}
        onOpenPSD2Config={() => setIsPSD2ModalOpen(true)}
        onOpenPartnerInvite={() => setIsPartnerModalOpen(true)}
        onOpenPWAInstallModal={() => setIsPWAInstallModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="lg:pl-60 flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <Header
          contextFilter={contextFilter}
          onContextChange={setContextFilter}
          onOpenNewMovement={() => setIsNewMovementModalOpen(true)}
          onOpenPartnerInviteModal={() => setIsPartnerModalOpen(true)}
          onOpenPWAInstallModal={() => setIsPWAInstallModalOpen(true)}
        />

        {/* View Router */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          {/* PWA In-App Install Banner (Self-dismissing / suppressable) */}
          <PWAInstallBanner onOpenModal={() => setIsPWAInstallModalOpen(true)} />

          {activeTab === 'dashboard' && (
            <DashboardView
              contextFilter={contextFilter}
              transactions={transactions}
              envelopes={envelopes}
              accounts={accounts}
              netWorthItems={netWorthItems}
              isSyncing={isSyncing}
              onSync={handleSync}
              onNavigateTab={setActiveTab}
              onOpenNewMovement={() => setIsNewMovementModalOpen(true)}
              onQuickAdjustEnvelope={() => setActiveTab('budget')}
              onOpenPSD2Config={() => setIsPSD2ModalOpen(true)}
            />
          )}

          {activeTab === 'transactions' && (
            <TransactionsView
              transactions={transactions}
              envelopes={envelopes}
              accounts={accounts}
              onDeleteTransaction={handleDeleteTransaction}
              onOpenNewMovement={() => setIsNewMovementModalOpen(true)}
            />
          )}

          {activeTab === 'budget' && (
            <BudgetZeroView
              envelopes={envelopes}
              onUpdateEnvelopeLimit={handleUpdateEnvelopeLimit}
              onTransferFunds={handleTransferFunds}
            />
          )}

          {activeTab === 'accounts' && (
            <AccountsView
              accounts={accounts}
              isSyncing={isSyncing}
              onSync={handleSync}
              onUpdateAccountBalance={handleUpdateAccountBalance}
              onOpenPSD2Config={() => setIsPSD2ModalOpen(true)}
              psd2Settings={psd2Settings}
            />
          )}

          {activeTab === 'networth' && (
            <NetWorthView items={netWorthItems} />
          )}
        </main>
      </div>

      {/* Mobile Sticky Bottom Nav */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenNewMovement={() => setIsNewMovementModalOpen(true)}
      />

      {/* Modal Form: "+ Nuevo Movimiento" */}
      <NewMovementModal
        isOpen={isNewMovementModalOpen}
        onClose={() => setIsNewMovementModalOpen(false)}
        onSave={handleSaveTransaction}
        envelopes={envelopes}
        accounts={accounts}
      />

      {/* Modal: "Configuración Conciliación Bancaria PSD2 (Open Banking)" */}
      <PSD2ConfigModal
        isOpen={isPSD2ModalOpen}
        onClose={() => setIsPSD2ModalOpen(false)}
        accounts={accounts}
        settings={psd2Settings}
        onSaveSettings={handleSavePSD2Settings}
        onForceReconcile={handleSync}
        isSyncing={isSyncing}
      />

      {/* Modal: "Vincular Cuenta Conjunta de Pareja" */}
      <PartnerInviteModal
        isOpen={isPartnerModalOpen}
        onClose={() => setIsPartnerModalOpen(false)}
        onShowToast={showToast}
      />

      {/* Modal: "Instalar Aplicación Progresiva (PWA)" */}
      <PWAInstallModal
        isOpen={isPWAInstallModalOpen}
        onClose={() => setIsPWAInstallModalOpen(false)}
        onInstalledToast={() => showToast('¡FinaMatch instalada como aplicación nativa!', 'success')}
      />

      {/* Toast Feedback */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
