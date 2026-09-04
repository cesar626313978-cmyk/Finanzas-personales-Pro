import React, { useState } from 'react';
import { Download, X, Sparkles, Smartphone, Laptop } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallBannerProps {
  onOpenModal: () => void;
}

export const PWAInstallBanner: React.FC<PWAInstallBannerProps> = ({ onOpenModal }) => {
  const { isInstalled, isIOS, isAndroid } = usePWAInstall();
  const [isDismissed, setIsDismissed] = useState(() => {
    return localStorage.getItem('finamatch_pwa_banner_dismissed') === 'true';
  });

  if (isInstalled || isDismissed) {
    return null;
  }

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('finamatch_pwa_banner_dismissed', 'true');
  };

  return (
    <div className="mb-6 p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-blue-900/90 via-indigo-900/90 to-slate-900/95 text-white border border-blue-700/50 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center shrink-0">
          {isIOS || isAndroid ? (
            <Smartphone className="w-5 h-5 text-blue-300" />
          ) : (
            <Laptop className="w-5 h-5 text-blue-300" />
          )}
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-blue-200 uppercase tracking-wider">
              Nueva App Progresiva (PWA)
            </span>
            <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
              Offline Ready
            </span>
          </div>
          <p className="text-xs text-slate-200 mt-0.5">
            {isIOS
              ? 'Instala FinaMatch en tu iPhone desde Safari (Compartir > Añadir a inicio).'
              : isAndroid
              ? 'Descarga FinaMatch en tu móvil para acceder a pantalla completa sin esperas.'
              : 'Instala FinaMatch en tu PC o Mac como app de escritorio independiente.'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
        <button
          onClick={onOpenModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-[#0F172A] text-xs font-bold shadow-xs transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-blue-600" />
          <span>Instalar App</span>
        </button>
        <button
          onClick={handleDismiss}
          aria-label="Descartar aviso de instalación"
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
