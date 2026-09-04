import React, { useState } from 'react';
import { 
  X, 
  Users, 
  Mail, 
  Send, 
  KeyRound, 
  CheckCircle2, 
  ShieldCheck, 
  Copy, 
  Check, 
  AlertCircle,
  Sparkles,
  UserPlus,
  UserCheck,
  Lock,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface PartnerInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string, type: 'success' | 'info' | 'warning') => void;
}

export const PartnerInviteModal: React.FC<PartnerInviteModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
}) => {
  const { 
    currentUser, 
    partner, 
    activeSpace, 
    sendPartnerInvite, 
    acceptPartnerInvite, 
    unlinkPartner 
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'invite' | 'join'>('invite');
  const [inviteEmail, setInviteEmail] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim() || !inviteEmail.includes('@')) {
      onShowToast('Introduce una dirección de Gmail válida', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await sendPartnerInvite(inviteEmail);
      setGeneratedCode(res.code);
      onShowToast(`Invitación enviada a ${inviteEmail}`, 'success');
      setInviteEmail('');
    } catch (err) {
      onShowToast('Error al enviar la invitación', 'warning');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleJoinWithCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) {
      onShowToast('Introduce el código de 6 dígitos', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await acceptPartnerInvite(joinCode);
      if (success) {
        onShowToast('¡Conectado exitosamente con la cuenta conjunta!', 'success');
        onClose();
      } else {
        onShowToast('Código de invitación no válido o caducado', 'warning');
      }
    } catch (err) {
      onShowToast('Error al procesar la unión a cuenta conjunta', 'warning');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    onShowToast('Código copiado al portapapeles', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUnlink = async () => {
    if (window.confirm('¿Seguro que deseas desvincular la cuenta conjunta con tu pareja?')) {
      await unlinkPartner();
      onShowToast('Cuenta conjunta desvinculada', 'info');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div 
        className="bg-white dark:bg-[#151D2E] w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-[#E2E8F0] dark:border-[#1E293B] max-h-[92vh] overflow-y-auto transform animate-in zoom-in-95 duration-150 transition-colors duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0] dark:border-[#1E293B]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-[#0F172A] dark:text-[#F8FAFC] text-base sm:text-lg">
                Vincular Cuenta Conjunta de Pareja
              </h2>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                Aislamiento estricto: tus cuentas privadas no se mezclarán
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#F1F5F9] dark:bg-[#1E293B] text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Isolation Guarantee Banner */}
        <div className="mt-4 p-3.5 rounded-xl bg-slate-50 dark:bg-[#0B0F19] border border-[#E2E8F0] dark:border-[#1E293B] flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
          <div className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
            <strong className="text-[#0F172A] dark:text-[#F8FAFC]">Privacidad garantizada por Firestore:</strong> Tu nómina, tarjetas y sobres personales solo son visibles por ti. Solo se compartirán las cuentas marcadas como conjuntas (50/50).
          </div>
        </div>

        {/* Current Linked Status */}
        {partner ? (
          <div className="mt-5 p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
                <UserCheck className="w-4 h-4" />
                Pareja Vinculada
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
                Sincronización 50/50 Activa
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-sm">
                {partner.displayName.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                  {partner.displayName}
                </p>
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                  {partner.email}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-emerald-200/60 dark:border-emerald-900/40 flex justify-between items-center text-xs">
              <span className="text-[#64748B] dark:text-[#94A3B8]">
                Espacio: <strong className="text-[#0F172A] dark:text-[#F8FAFC]">{activeSpace?.name}</strong>
              </span>
              <button
                type="button"
                onClick={handleUnlink}
                className="text-rose-600 dark:text-rose-400 font-semibold hover:underline cursor-pointer"
              >
                Desvincular
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            {/* Tabs: Invitar vs Unirse */}
            <div className="grid grid-cols-2 p-1 bg-[#F1F5F9] dark:bg-[#0B0F19] rounded-xl border border-[#E2E8F0] dark:border-[#1E293B]">
              <button
                type="button"
                onClick={() => setActiveTab('invite')}
                className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'invite'
                    ? 'bg-white dark:bg-[#1E293B] text-[#0F172A] dark:text-[#F8FAFC] shadow-xs'
                    : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC]'
                }`}
              >
                1. Invitar a tu pareja
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('join')}
                className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'join'
                    ? 'bg-white dark:bg-[#1E293B] text-[#0F172A] dark:text-[#F8FAFC] shadow-xs'
                    : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC]'
                }`}
              >
                2. Unirse con Código
              </button>
            </div>

            {activeTab === 'invite' ? (
              <form onSubmit={handleSendInvite} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC] block mb-1.5">
                    Correo Gmail de tu Pareja
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#64748B] dark:text-[#94A3B8] absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      placeholder="ejemplo.pareja@gmail.com"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#E2E8F0] dark:border-[#1E293B] bg-[#F8FAFC] dark:bg-[#0B0F19] text-[#0F172A] dark:text-[#F8FAFC] text-xs sm:text-sm focus:outline-hidden focus:border-blue-500"
                    />
                  </div>
                  <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] mt-1">
                    Le enviaremos un acceso seguro con autenticación de Google para sincronizar únicamente los fondos compartidos.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-xl bg-[#0F172A] dark:bg-[#2563EB] hover:opacity-90 dark:hover:bg-[#1D4ED8] text-white text-xs sm:text-sm font-semibold shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Enviando...' : 'Generar Invitación y Código'}</span>
                </button>

                {generatedCode && (
                  <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 animate-in fade-in space-y-2">
                    <span className="text-[11px] font-bold text-blue-800 dark:text-blue-300 block">
                      ¡Código de enlace directo generado!
                    </span>
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-[#151D2E] border border-blue-200 dark:border-blue-900">
                      <span className="font-mono text-base font-extrabold text-[#0F172A] dark:text-[#F8FAFC] tracking-widest">
                        {generatedCode}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyCode(generatedCode)}
                        className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                      >
                        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copied ? 'Copiado' : 'Copiar'}</span>
                      </button>
                    </div>
                    <p className="text-[10px] text-blue-700 dark:text-blue-300">
                      Tu pareja puede introducir este código directamente en su app para vincularse sin esperas.
                    </p>
                  </div>
                )}
              </form>
            ) : (
              <form onSubmit={handleJoinWithCode} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC] block mb-1.5">
                    Código de Invitación de 6 Dígitos
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-[#64748B] dark:text-[#94A3B8] absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="FINA50"
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#E2E8F0] dark:border-[#1E293B] bg-[#F8FAFC] dark:bg-[#0B0F19] text-[#0F172A] dark:text-[#F8FAFC] text-xs sm:text-sm font-mono tracking-wider focus:outline-hidden focus:border-blue-500"
                    />
                  </div>
                  <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] mt-1">
                    Introduce el código generado por tu pareja desde su aplicación.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-xl bg-[#0F172A] dark:bg-[#2563EB] hover:opacity-90 dark:hover:bg-[#1D4ED8] text-white text-xs sm:text-sm font-semibold shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Vinculando...' : 'Unirse al Espacio Compartido'}</span>
                </button>
              </form>
            )}
          </div>
        )}

        <div className="mt-5 pt-4 border-t border-[#E2E8F0] dark:border-[#1E293B] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#F1F5F9] dark:bg-[#1E293B] text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-[#F8FAFC] text-xs font-semibold cursor-pointer transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
