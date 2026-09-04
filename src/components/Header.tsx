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
  Moon,
  LogOut,
  Sparkles,
  ShieldCheck,
  UserCheck,
  ArrowRightLeft,
  Download
} from 'lucide-react';
import { ContextFilter } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  contextFilter: ContextFilter;
  onContextChange: (filter: ContextFilter) => void;
  onOpenNewMovement: () => void;
  onOpenPartnerInviteModal: () => void;
  onOpenPWAInstallModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  contextFilter,
  onContextChange,
  onOpenNewMovement,
  onOpenPartnerInviteModal,
  onOpenPWAInstallModal,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);
  const { theme, toggleTheme } = useTheme();
  const { 
    currentUser, 
    partner, 
    firebaseUser, 
    loginWithGoogle, 
    logout, 
    switchDemoProfile,
    isFirebaseConnected 
  } = useAuth();

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

        {/* PWA Install Action */}
        {onOpenPWAInstallModal && (
          <button
            onClick={onOpenPWAInstallModal}
            title="Instalar FinaMatch en PC, Mac, Android o iPhone"
            aria-label="Instalar FinaMatch como App nativa"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-2 rounded-lg bg-[#F1F5F9] dark:bg-[#0B0F19] hover:bg-[#E2E8F0] dark:hover:bg-[#1E293B] border border-transparent dark:border-[#1E293B] text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC] transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="hidden md:inline">Instalar App</span>
          </button>
        )}

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

        {/* User Profile & Multi-user Space Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            aria-label="Menú de usuario y cuenta de Google"
            className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-lg bg-[#F1F5F9] dark:bg-[#0B0F19] hover:bg-[#E2E8F0] dark:hover:bg-[#1E293B] border border-transparent dark:border-[#1E293B] transition-colors cursor-pointer"
          >
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
              {currentUser?.displayName?.charAt(0) || 'U'}
            </div>
            <span className="text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC] hidden md:inline max-w-[100px] truncate">
              {currentUser?.displayName || 'Usuario'}
            </span>
            <ChevronDown className="w-3 h-3 text-[#64748B] dark:text-[#94A3B8]" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-[#151D2E] rounded-xl shadow-xl border border-[#E2E8F0] dark:border-[#1E293B] p-3.5 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-3">
              {/* User Identity Info */}
              <div className="pb-3 border-b border-[#E2E8F0] dark:border-[#1E293B]">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
                    Sesión Activa
                  </span>
                  {firebaseUser ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Google Auth
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.5 rounded">
                      Demo Profile
                    </span>
                  )}
                </div>
                <p className="text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC] mt-1 truncate">
                  {currentUser?.displayName}
                </p>
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8] truncate">
                  {currentUser?.email}
                </p>
              </div>

              {/* Google Sign-In Action */}
              {!firebaseUser ? (
                <button
                  onClick={async () => {
                    setShowUserMenu(false);
                    try {
                      await loginWithGoogle();
                    } catch (e) {
                      console.log('Google login completed or cancelled');
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-white dark:bg-[#0B0F19] hover:bg-[#F8FAFC] dark:hover:bg-[#1A2438] border border-[#CBD5E1] dark:border-[#334155] text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC] transition-colors cursor-pointer shadow-xs"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Entrar con Gmail / Google</span>
                </button>
              ) : (
                <button
                  onClick={async () => {
                    setShowUserMenu(false);
                    await logout();
                  }}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Cerrar sesión de Google</span>
                </button>
              )}

              {/* Partner Invite / Joint Space Action */}
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  onOpenPartnerInviteModal();
                }}
                className="w-full flex items-center justify-between p-2 rounded-lg bg-[#F8FAFC] dark:bg-[#0B0F19] hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#1E293B] text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                      {partner ? 'Gestionar Pareja' : 'Invitar a Pareja'}
                    </p>
                    <p className="text-[10px] text-[#64748B] dark:text-[#94A3B8]">
                      {partner ? 'Cuenta conjunta 50/50 activa' : 'Unirse a cuenta conjunta'}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">
                  {partner ? 'Ver' : 'Invitar'}
                </span>
              </button>

              {/* PWA Install Modal Trigger */}
              {onOpenPWAInstallModal && (
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onOpenPWAInstallModal();
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-lg bg-blue-50/70 dark:bg-blue-950/40 hover:bg-blue-100/70 dark:hover:bg-blue-900/40 border border-blue-200 dark:border-blue-900/60 text-left transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Download className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <div>
                      <p className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                        Instalar App FinaMatch
                      </p>
                      <p className="text-[10px] text-[#64748B] dark:text-[#94A3B8]">
                        PC, Mac, iPhone y Android
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">
                    Guía
                  </span>
                </button>
              )}

              {/* Demo Multi-user Switcher (To test that accounts don't mix!) */}
              <div className="pt-2 border-t border-[#E2E8F0] dark:border-[#1E293B] space-y-1.5">
                <span className="text-[10px] font-bold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider block">
                  Probar aislamiento de usuarios:
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => {
                      switchDemoProfile('cesar');
                      setShowUserMenu(false);
                    }}
                    className={`px-2 py-1.5 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                      currentUser?.email?.includes('cesar')
                        ? 'bg-[#0F172A] dark:bg-[#2563EB] text-white shadow-xs'
                        : 'bg-[#F1F5F9] dark:bg-[#0B0F19] text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC]'
                    }`}
                  >
                    César (BBVA)
                  </button>
                  <button
                    onClick={() => {
                      switchDemoProfile('partner');
                      setShowUserMenu(false);
                    }}
                    className={`px-2 py-1.5 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                      currentUser?.email?.includes('elena')
                        ? 'bg-[#0F172A] dark:bg-[#2563EB] text-white shadow-xs'
                        : 'bg-[#F1F5F9] dark:bg-[#0B0F19] text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC]'
                    }`}
                  >
                    Elena (Santander)
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
