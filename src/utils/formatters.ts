import { Transaction } from '../types';

export function formatCurrency(amount: number, options?: { showSign?: boolean }): string {
  const isNegative = amount < 0;
  const absVal = Math.abs(amount);
  
  const formatted = absVal.toLocaleString('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  if (options?.showSign) {
    return isNegative ? `-${formatted} €` : `+${formatted} €`;
  }
  return isNegative ? `-${formatted} €` : `${formatted} €`;
}

export function formatPercent(val: number): string {
  return `${val.toLocaleString('es-ES', { maximumFractionDigits: 1 })}%`;
}

/**
 * Returns the personal budget impact of a transaction.
 * Negative for expenses, positive for incomes.
 */
export function getTransactionPersonalImpact(tx: Transaction): number {
  if (tx.accountType === 'Compartida_50_50') {
    return tx.amount * 0.5;
  }
  if (tx.accountType === 'Compartida_Custom' && tx.customSplitPercentage !== undefined) {
    return tx.amount * (tx.customSplitPercentage / 100);
  }
  return tx.amount;
}

/**
 * Semaphoric threshold evaluation:
 * - < 70%: Emerald Green (Safe)
 * - 70% - 89%: Amber Yellow (Caution)
 * - >= 90%: Rose Red (Critical Alert)
 */
export interface SemaphoricTheme {
  barBg: string;
  badgeBg: string;
  textColor: string;
  level: 'safe' | 'caution' | 'danger';
}

export function getSemaphoricStyle(percentage: number): SemaphoricTheme {
  if (percentage < 70) {
    return {
      barBg: 'bg-emerald-500',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      textColor: 'text-emerald-600',
      level: 'safe',
    };
  }
  if (percentage < 90) {
    return {
      barBg: 'bg-amber-500',
      badgeBg: 'bg-amber-50 text-amber-700 border-amber-100',
      textColor: 'text-amber-600',
      level: 'caution',
    };
  }
  return {
    barBg: 'bg-rose-500',
    badgeBg: 'bg-rose-50 text-rose-700 border-rose-100',
    textColor: 'text-rose-600',
    level: 'danger',
  };
}
