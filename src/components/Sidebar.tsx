import React from 'react';
import { 
  LayoutDashboard, 
  ReceiptText, 
  PieChart, 
  ArrowLeftRight, 
  TrendingUp, 
  CheckCircle2, 
  RefreshCw,
  Sparkles,
  Sun,
  Moon,
  Sliders
} from 'lucide-react';
import { ActiveTab } from '../types';
import { useTheme } from '../context/ThemeContext';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  isSyncing: boolean;
  onSync: () => void;
  onOpenPSD2Config?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  isSyncing,
  onSync,
  onOpenPSD2Config,
}) => {
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { id: 'dashboard' as ActiveTab, label: 'Dashboard General', icon: LayoutDashboard },
    { id: 'transactions' as ActiveTab, label: 'Movimientos & Gastos', icon: ReceiptText },
    { id: 'budget' as ActiveTab, label: 'Presupuesto Base Cero', icon: PieChart },
    { id: 'accounts' as ActiveTab, label: 'Cuentas & Conciliación', icon: ArrowLeftRight },
    { id: 'networth' as ActiveTab, label: 'Patrimonio Neto', icon: TrendingUp },
  ];

  return (
    <aside className="hidden lg:flex lg:flex-col w-60 bg-white dark:bg-[#151D2E] border-r border-[#E2E8F0] dark:border-[#1E293B] fixed inset-y-0 left-0 z-30 p-5 transition-colors duration-200">
      {/* Brand Header with Geometric Balance diamond icon */}
      <div className="flex items-center gap-3 mb-8 px-1">
        <div className="w-8 h-8 bg-[#0F172A] dark:bg-[#2563EB] rounded-lg flex items-center justify-center shadow-xs">
          <div className="w-3.5 h-3.5 border-2 border-white rotate-45"></div>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="font-bold text-xl tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">FinaMatch</span>
          <span className="text-[10px] font-bold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider">v2</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1">
        <div className="px-3 pb-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">Navegación</p>
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm transition-colors text-left cursor-pointer ${
                isActive
                  ? 'bg-[#F1F5F9] dark:bg-[#1E293B] text-[#0F172A] dark:text-[#F8FAFC] font-semibold shadow-xs'
                  : 'text-[#64748B] dark:text-[#94A3B8] hover:bg-[#F8FAFC] dark:hover:bg-[#1A2438] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] font-medium'
              }`}
            >
              <Icon
                className={`w-4 h-4 transition-colors ${
                  isActive ? 'text-[#0F172A] dark:text-[#38BDF8]' : 'text-[#64748B] dark:text-[#94A3B8]'
                }`}
              />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Sync status & Geometric Balance user card */}
      <div className="mt-auto space-y-3 pt-4 border-t border-[#E2E8F0] dark:border-[#1E293B]">
        {/* Open Banking Status */}
        <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#F8FAFC] dark:bg-[#0B0F19] border border-[#E2E8F0] dark:border-[#1E293B]">
          <div 
            onClick={onOpenPSD2Config}
            className="flex items-center gap-2 min-w-0 cursor-pointer group"
            title="Configuración de Conciliación Bancaria PSD2"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
            <span className="text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
              Sabadell & BBVA
            </span>
          </div>
          <div className="flex items-center gap-1">
            {onOpenPSD2Config && (
              <button
                onClick={onOpenPSD2Config}
                title="Configurar PSD2 y Open Banking"
                className="p-1 text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] rounded transition-colors cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={onSync}
              disabled={isSyncing}
              title="Sincronizar cuentas ahora"
              className="p-1 text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] rounded transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-[#0F172A] dark:text-[#F8FAFC]' : ''}`} />
            </button>
          </div>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-[#F8FAFC] dark:bg-[#0B0F19] border border-[#E2E8F0] dark:border-[#1E293B] text-xs font-medium text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-2">
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-700" />}
            <span>{theme === 'dark' ? 'Modo Oscuro' : 'Modo Claro'}</span>
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] text-[#0F172A] dark:text-white">
            {theme === 'dark' ? 'ON' : 'OFF'}
          </span>
        </button>

        {/* User Card */}
        <div className="p-3.5 bg-[#F1F5F9] dark:bg-[#0B0F19] rounded-xl border border-transparent dark:border-[#1E293B]">
          <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8] uppercase font-bold mb-0.5 tracking-wider">
            Plan Conjunto 50/50
          </div>
          <div className="text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC]">Carlos & Elena</div>
          <div className="w-full bg-[#E2E8F0] dark:bg-[#1E293B] h-1.5 rounded-full mt-2.5 overflow-hidden">
            <div className="bg-[#2563EB] h-full w-3/4 rounded-full"></div>
          </div>
          <div className="flex justify-between items-center text-[10px] text-[#64748B] dark:text-[#94A3B8] font-medium mt-1">
            <span>Objetivo mensual</span>
            <span className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">75% cubierto</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
