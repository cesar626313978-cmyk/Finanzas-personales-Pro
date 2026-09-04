import React, { useState } from 'react';
import { 
  PlusCircle, 
  Bell, 
  ChevronDown, 
  Users, 
  User, 
  Globe2, 
  AlertTriangle,
  X,
  Check,
  Sun,
  Moon
} from 'lucide-react';
import { ContextFilter } from '../types';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  contextFilter: ContextFilter;
  onContextChange: (filter: ContextFilter) => void;
  onOpenNewMovement: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  contextFilter,
  onContextChange,
  onOpenNewMovement,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);
  const { theme, toggleTheme } = useTheme();

  const notifications = [
    {
      id: 'notif-1',
      title: 'Alerta de Presupuesto (96%)',
      message: 'Alimentación & Súper ha alcanzado 480 € de 500 € presupuestados.',
      type: 'warning',
      time: 'Hace 2 horas',
    },
    {
      id: 'notif-2',
      title: 'Conciliación Bancaria',
      message: '2 nuevos movimientos importados desde Sabadell Cuenta Conjunta.',
      type: 'info',
      time: 'Hoy, 09:30',
    },
  ];

  return (
    <header className="sticky top-0 z-20 h-16 bg-white dark:bg-[#151D2E] border-b border-[#E2E8F0] dark:border-[#1E293B] px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-colors duration-200">
      {/* Mobile Brand / Context Title */}
      <div className="flex items-center gap-2.5 lg:hidden">
        <div className="w-8 h-8 bg-[#0F172A] dark:bg-[#2563EB] rounded-lg flex items-center justify-center">
          <div className="w-3.5 h-3.5 border-2 border-white rotate-45"></div>
        </div>
        <span className="font-bold text-[#0F172A] dark:text-[#F8FAFC] text-lg tracking-tight">FinaMatch</span>
      </div>

      {/* Global Context Selector */}
      <div className="flex items-center gap-2.5">
        <span className="text-xs sm:text-sm text-[#64748B] dark:text-[#94A3B8] font-medium hidden sm:inline">Contexto:</span>
        <div className="flex items-center bg-[#F1F5F9] dark:bg-[#0B0F19] p-1 rounded-lg text-xs font-semibold border border-transparent dark:border-[#1E293B]">
          <button
            onClick={() => onContextChange('all')}
            className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              contextFilter === 'all'
                ? 'bg-white dark:bg-[#1E293B] text-[#0F172A] dark:text-[#F8FAFC] shadow-xs font-bold'
                : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC]'
            }`}
          >
            <span>Todas las cuentas</span>
          </button>

          <button
            onClick={() => onContextChange('personal')}
            className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              contextFilter === 'personal'
                ? 'bg-white dark:bg-[#1E293B] text-[#0F172A] dark:text-[#F8FAFC] shadow-xs font-bold'
                : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC]'
            }`}
          >
            <span>Personales</span>
          </button>

          <button
            onClick={() => onContextChange('shared')}
            className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              contextFilter === 'shared'
                ? 'bg-white dark:bg-[#1E293B] text-[#0F172A] dark:text-[#F8FAFC] shadow-xs font-bold'
                : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC]'
            }`}
          >
            <span className="whitespace-nowrap">Compartida / Pareja</span>
          </button>
        </div>
      </div>

      {/* Right Controls: Theme Toggle, New Movement Button & Alerts */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Dark/Light Mode Switcher */}
        <button
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#F1F5F9] dark:bg-[#0B0F19] hover:bg-[#E2E8F0] dark:hover:bg-[#1E293B] text-[#0F172A] dark:text-[#F8FAFC] border border-transparent dark:border-[#1E293B] transition-colors cursor-pointer"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-700" />
          )}
        </button>

        {/* Primary Action Button (Geometric Balance Dark Slate Button) */}
        <button
          onClick={onOpenNewMovement}
          className="bg-[#0F172A] dark:bg-[#2563EB] text-white px-3.5 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium hover:opacity-90 dark:hover:bg-[#1D4ED8] shadow-sm transition-all flex items-center gap-2 cursor-pointer"
        >
          <span className="text-base leading-none font-bold">+</span>
          <span className="hidden xs:inline">Nuevo Movimiento</span>
          <span className="xs:hidden">Movimiento</span>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              if (unreadCount > 0) setUnreadCount(0);
            }}
            aria-label="Ver notificaciones"
            className="relative w-9 h-9 flex items-center justify-center rounded-lg bg-[#F1F5F9] dark:bg-[#0B0F19] hover:bg-[#E2E8F0] dark:hover:bg-[#1E293B] text-[#0F172A] dark:text-[#F8FAFC] border border-transparent dark:border-[#1E293B] transition-colors cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#2563EB] ring-2 ring-white dark:ring-[#151D2E]"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-[#151D2E] rounded-xl shadow-xl border border-[#E2E8F0] dark:border-[#1E293B] p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E2E8F0] dark:border-[#1E293B]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#2563EB]"></div>
                  <span className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC] uppercase tracking-wider">Notificaciones y Alertas</span>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="p-1 text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] rounded-lg"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-2.5 rounded-lg bg-[#F8FAFC] dark:bg-[#0B0F19] hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] transition-colors border border-[#E2E8F0] dark:border-[#1E293B]"
                  >
                    <div className="flex items-start gap-2">
                      {n.type === 'warning' ? (
                        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      ) : (
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      )}
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC]">{n.title}</p>
                        <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] leading-snug mt-0.5">{n.message}</p>
                        <p className="text-[10px] text-[#64748B] dark:text-[#94A3B8] mt-1">{n.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
