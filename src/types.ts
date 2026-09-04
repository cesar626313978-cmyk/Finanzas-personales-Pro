export type AccountOwnershipType = 'Individual' | 'Compartida_50_50' | 'Compartida_Custom';

export type ContextFilter = 'all' | 'personal' | 'shared';

export type ActiveTab = 'dashboard' | 'transactions' | 'budget' | 'accounts' | 'networth';

export interface Transaction {
  id: string;
  concept: string;
  amount: number; // Positive for income, negative for expense (e.g. -84.20)
  date: string;
  category: string;
  accountId: string;
  accountName: string;
  accountType: AccountOwnershipType;
  customSplitPercentage?: number; // default 50 for Compartida_50_50, 100 for Individual
  notes?: string;
  isPending?: boolean;
}

export interface BudgetEnvelope {
  id: string;
  name: string;
  icon: string;
  limit: number;
  spent: number; // Computed or allocated
  type: 'personal' | 'shared';
  splitPercentage: number; // 100 for personal, 50 for shared
  color: string;
}

export interface BankAccount {
  id: string;
  name: string;
  institution: string;
  logo: string;
  type: 'checking' | 'credit' | 'savings' | 'investment';
  ownership: 'personal' | 'shared';
  balance: number;
  currency: string;
  lastSynced: string;
  ibanMasked: string;
}

export interface NetWorthItem {
  id: string;
  name: string;
  category: 'liquid' | 'investment' | 'real_estate' | 'debt';
  value: number; // Positive for assets, negative for debt
  ownership: 'personal' | 'shared';
  changeMonthly: number;
}

export interface PSD2Settings {
  isEnabled: boolean;
  provider: string;
  licenseNumber: string;
  syncFrequency: '6h' | 'daily' | 'manual';
  consentExpiresInDays: number;
  consentExpiryDate: string;
  autoMatchTransfers: boolean;
  autoSplitSharedAccounts: boolean;
  discrepancyAlerts: boolean;
  toleranceCents: number;
  lastReconciledAt: string;
}
