import React from 'react';
import { 
  LayoutDashboard, 
  ReceiptText, 
  PieChart, 
  ArrowLeftRight, 
  TrendingUp, 
  Plus 
} from 'lucide-react';
import { ActiveTab } from '../types';

interface BottomNavProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onOpenNewMovement: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  onOpenNewMovement,
}) => {
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white dark:bg-[#151D2E] border-t border-[#E2E8F0] dark:border-[#1E293B] pb-safe shadow-sm transition-colors duration-200">
      <div className="max-w-md mx-auto flex items-center justify-around h-16 px-2 relative">
        {/* Dashboard */}
        <button
          onClick={() => onTabChange('dashboard')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors cursor-pointer ${
            activeTab === 'dashboard'
              ? 'text-[#0F172A] dark:text-[#38BDF8] font-bold'
              : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC]'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] mt-1 font-medium tracking-tight">Dashboard</span>
        </button>

        {/* Movimientos */}
        <button
          onClick={() => onTabChange('transactions')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors cursor-pointer ${
            activeTab === 'transactions'
              ? 'text-[#0F172A] dark:text-[#38BDF8] font-bold'
              : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC]'
          }`}
        >
          <ReceiptText className="w-5 h-5" />
          <span className="text-[10px] mt-1 font-medium tracking-tight">Movimientos</span>
        </button>

        {/* Center Elevated Action Button */}
        <div className="flex flex-col items-center justify-center -mt-5 px-1">
          <button
            onClick={onOpenNewMovement}
            aria-label="Añadir nuevo movimiento"
            className="w-12 h-12 rounded-xl bg-[#0F172A] dark:bg-[#2563EB] hover:opacity-90 active:scale-95 text-white flex items-center justify-center shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Presupuesto */}
        <button
          onClick={() => onTabChange('budget')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors cursor-pointer ${
            activeTab === 'budget'
              ? 'text-[#0F172A] dark:text-[#38BDF8] font-bold'
              : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC]'
          }`}
        >
          <PieChart className="w-5 h-5" />
          <span className="text-[10px] mt-1 font-medium tracking-tight">Presupuesto</span>
        </button>

        {/* Cuentas */}
        <button
          onClick={() => onTabChange('accounts')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors cursor-pointer ${
            activeTab === 'accounts'
              ? 'text-[#0F172A] dark:text-[#38BDF8] font-bold'
              : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC]'
          }`}
        >
          <ArrowLeftRight className="w-5 h-5" />
          <span className="text-[10px] mt-1 font-medium tracking-tight">Cuentas</span>
        </button>
      </div>
    </nav>
  );
};
