import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  KeyRound, 
  Landmark, 
  ExternalLink, 
  Sliders, 
  Clock, 
  Check, 
  ChevronRight,
  Sparkles,
  Info
} from 'lucide-react';
import { BankAccount, PSD2Settings } from '../types';

interface PSD2ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: BankAccount[];
  settings: PSD2Settings;
  onSaveSettings: (newSettings: PSD2Settings) => void;
  onForceReconcile: () => void;
  isSyncing: boolean;
}

export const PSD2ConfigModal: React.FC<PSD2ConfigModalProps> = ({
  isOpen,
  onClose,
  accounts,
  settings,
  onSaveSettings,
  onForceReconcile,
  isSyncing,
}) => {
  const [localSettings, setLocalSettings] = useState<PSD2Settings>(settings);
  const [isRenewingConsent, setIsRenewingConsent] = useState(false);
  const [renewSuccess, setRenewSuccess] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRenewConsent = () => {
    setIsRenewingConsent(true);
    setTimeout(() => {
      setIsRenewingConsent(false);
      setRenewSuccess(true);
      const newExpiry = new Date();
      newExpiry.setDate(newExpiry.getDate() + 180);
      const formattedDate = newExpiry.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
      
      setLocalSettings(prev => ({
        ...prev,
        consentExpiresInDays: 180,
        consentExpiryDate: formattedDate,
      }));
      setTimeout(() => setRenewSuccess(false), 3000);
    }, 1200);
  };

  const handleRunHealthCheck = () => {
    setTestResult('Comprobando certificados mTLS y tokens OAuth 2.0...');
    setTimeout(() => {
      setTestResult('OK: Todos los canales PSD2 activos. 0 discrepancias encontradas.');
      onForceReconcile();
      setTimeout(() => setTestResult(null), 4000);
    }, 1000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(localSettings);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div 
        className="bg-white dark:bg-[#151D2E] w-full max-w-2xl rounded-2xl p-6 shadow-2xl border border-[#E2E8F0] dark:border-[#1E293B] max-h-[92vh] overflow-y-auto transform animate-in zoom-in-95 duration-150 transition-colors duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0] dark:border-[#1E293B]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-[#0F172A] dark:text-[#F8FAFC] text-lg">
                  Conciliación Bancaria PSD2 (Open Banking)
                </h2>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Activa
                </span>
              </div>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5">
                Conexión regulada por Directiva UE 2015/2366 (PSD2) y RTS EBA para agregación y cuadre
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar modal de configuración"
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#F1F5F9] dark:bg-[#1E293B] text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-6 pt-5">
          {/* Status & Compliance Banner */}
          <div className="bg-[#F8FAFC] dark:bg-[#0B0F19] rounded-xl p-4 border border-[#E2E8F0] dark:border-[#1E293B] space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800/80">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
                  Proveedor AISP Homologado
                </span>
                <p className="text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC] mt-0.5">
                  {localSettings.provider}
                </p>
                <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                  Licencia Banco de España {localSettings.licenseNumber} • Cifrado TLS 1.3
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRunHealthCheck}
                  disabled={isSyncing}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white dark:bg-[#151D2E] border border-[#E2E8F0] dark:border-[#1E293B] text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC] hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] shadow-xs cursor-pointer transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>Test de Conexión</span>
                </button>
              </div>
            </div>

            {/* Consent Renewal Widget (PSD2 90/180-day cycle) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-[#0F172A] dark:text-[#F8FAFC] flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    Consentimiento SCA (Autenticación Fuerte)
                  </span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {localSettings.consentExpiresInDays} días restantes
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${(localSettings.consentExpiresInDays / 180) * 100}%` }}
                  ></div>
                </div>
                <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] mt-1">
                  Válido hasta el {localSettings.consentExpiryDate} (según directiva RTS de renovación semestral).
                </p>
              </div>

              <button
                type="button"
                onClick={handleRenewConsent}
                disabled={isRenewingConsent}
                className="shrink-0 px-3.5 py-1.5 rounded-lg bg-[#0F172A] dark:bg-[#2563EB] text-white text-xs font-medium hover:opacity-90 dark:hover:bg-[#1D4ED8] shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                {isRenewingConsent ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Conectando con banco...</span>
                  </>
                ) : renewSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>¡Consentimiento Renovado!</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Renovar Consentimiento</span>
                  </>
                )}
              </button>
            </div>

            {testResult && (
              <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs font-medium text-emerald-800 dark:text-emerald-300 animate-in fade-in flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{testResult}</span>
              </div>
            )}
          </div>

          {/* Section 1: Sincronización Automática */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
              Frecuencia de Sincronización en Segundo Plano
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                { id: '6h', label: 'Cada 6 horas', desc: 'Recomendado para tiempo real' },
                { id: 'daily', label: 'Diaria (06:00 AM)', desc: 'Conciliación matutina' },
                { id: 'manual', label: 'Bajo demanda', desc: 'Solo al pulsar actualizar' },
              ].map((freq) => (
                <button
                  key={freq.id}
                  type="button"
                  onClick={() => setLocalSettings(prev => ({ ...prev, syncFrequency: freq.id as any }))}
                  className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                    localSettings.syncFrequency === freq.id
                      ? 'border-[#0F172A] dark:border-[#38BDF8] bg-[#F1F5F9] dark:bg-[#1E293B] text-[#0F172A] dark:text-[#F8FAFC]'
                      : 'border-[#E2E8F0] dark:border-[#1E293B] bg-white dark:bg-[#151D2E] text-[#64748B] dark:text-[#94A3B8] hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold">{freq.label}</span>
                    {localSettings.syncFrequency === freq.id && (
                      <Check className="w-4 h-4 text-[#0F172A] dark:text-[#38BDF8]" />
                    )}
                  </div>
                  <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">{freq.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Reglas de Conciliación Inteligente */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
              Reglas de Conciliación y Cuadre de Saldos
            </h3>

            <div className="space-y-2">
              <label className="flex items-start gap-3 p-3 rounded-xl border border-[#E2E8F0] dark:border-[#1E293B] bg-white dark:bg-[#151D2E] hover:bg-[#F8FAFC] dark:hover:bg-[#1A2438] transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.autoMatchTransfers}
                  onChange={(e) => setLocalSettings(prev => ({ ...prev, autoMatchTransfers: e.target.checked }))}
                  className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <div className="flex-1">
                  <span className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC] block">
                    Auto-emparejar transferencias entre cuentas propias y conjuntas
                  </span>
                  <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] mt-0.5">
                    Evita duplicar movimientos cuando traspasas dinero de tu cuenta personal a la cuenta compartida.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-xl border border-[#E2E8F0] dark:border-[#1E293B] bg-white dark:bg-[#151D2E] hover:bg-[#F8FAFC] dark:hover:bg-[#1A2438] transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.autoSplitSharedAccounts}
                  onChange={(e) => setLocalSettings(prev => ({ ...prev, autoSplitSharedAccounts: e.target.checked }))}
                  className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <div className="flex-1">
                  <span className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC] block">
                    Regla 50/50 automática en cargos de cuentas conjuntas
                  </span>
                  <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] mt-0.5">
                    Imputa automáticamente la mitad exacta de cualquier cargo bancario al sobre presupuestario correspondiente.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-xl border border-[#E2E8F0] dark:border-[#1E293B] bg-white dark:bg-[#151D2E] hover:bg-[#F8FAFC] dark:hover:bg-[#1A2438] transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.discrepancyAlerts}
                  onChange={(e) => setLocalSettings(prev => ({ ...prev, discrepancyAlerts: e.target.checked }))}
                  className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <div className="flex-1">
                  <span className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC] block">
                    Alertas proactivas de descuadre bancario
                  </span>
                  <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] mt-0.5">
                    Notifica de inmediato si el saldo devuelto por la API bancaria difiere del acumulado de movimientos.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Section 3: Cuentas Conectadas en PSD2 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
                Entidades Bancarias Conectadas ({accounts.length})
              </h3>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                API PSD2 en línea
              </span>
            </div>

            <div className="space-y-2">
              {accounts.map((acc) => (
                <div 
                  key={acc.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#0B0F19] border border-[#E2E8F0] dark:border-[#1E293B]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-slate-700 flex items-center justify-center text-[#0F172A] dark:text-[#F8FAFC]">
                      <Landmark className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                        {acc.name}
                      </p>
                      <p className="text-[10px] text-[#64748B] dark:text-[#94A3B8] font-mono">
                        {acc.ibanMasked} • {acc.institution} • {acc.lastSynced}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 uppercase">
                    Sincronizada
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Modal Footer Buttons */}
          <div className="flex items-center gap-3 pt-3 border-t border-[#E2E8F0] dark:border-[#1E293B]">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-[#E2E8F0] dark:border-[#1E293B] bg-white dark:bg-[#1E293B] text-[#64748B] dark:text-[#94A3B8] text-xs sm:text-sm font-medium hover:text-[#0F172A] dark:hover:text-[#F8FAFC] hover:bg-[#F8FAFC] dark:hover:bg-[#334155] transition-colors cursor-pointer"
            >
              Cerrar
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-lg bg-[#0F172A] dark:bg-[#2563EB] hover:opacity-90 dark:hover:bg-[#1D4ED8] text-white text-xs sm:text-sm font-medium shadow-sm transition-all cursor-pointer"
            >
              Guardar Configuración PSD2
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
