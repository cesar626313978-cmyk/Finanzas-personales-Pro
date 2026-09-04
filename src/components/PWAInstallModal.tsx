import React from 'react';
import { 
  X, 
  Download, 
  Smartphone, 
  Laptop, 
  Apple, 
  CheckCircle2, 
  Share, 
  PlusSquare, 
  WifiOff, 
  Zap, 
  ShieldCheck 
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInstalledToast?: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({
  isOpen,
  onClose,
  onInstalledToast,
}) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, isMac, isWindows, install } = usePWAInstall();

  if (!isOpen) return null;

  const handleNativeInstall = async () => {
    const success = await install();
    if (success) {
      onClose();
      if (onInstalledToast) onInstalledToast();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-[#151D2E] rounded-2xl border border-[#E2E8F0] dark:border-[#1E293B] shadow-2xl max-w-lg w-full overflow-hidden text-[#0F172A] dark:text-[#F8FAFC]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with App Icon */}
        <div className="relative p-6 pb-4 border-b border-[#E2E8F0] dark:border-[#1E293B] bg-linear-to-b from-[#F8FAFC] to-white dark:from-[#0B0F19] dark:to-[#151D2E]">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] dark:text-[#94A3B8] dark:hover:text-white hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] transition-colors cursor-pointer"
            aria-label="Cerrar modal de instalación"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#0F172A] p-2 shadow-lg border border-[#334155] flex items-center justify-center shrink-0">
              <img src="/icon.svg" alt="FinaMatch Logo" className="w-10 h-10" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-[10px] font-extrabold uppercase tracking-wider mb-1">
                <Zap className="w-3 h-3" /> PWA Progresiva Multiplataforma
              </div>
              <h2 className="text-lg font-extrabold tracking-tight">
                Instalar FinaMatch
              </h2>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                Instala como aplicación nativa en tu dispositivo
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Key Advantages */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#0B0F19] border border-[#E2E8F0] dark:border-[#1E293B] text-center">
              <Zap className="w-4 h-4 text-amber-500 mx-auto mb-1.5" />
              <p className="text-[11px] font-bold">Carga Instantánea</p>
              <p className="text-[10px] text-[#64748B] dark:text-[#94A3B8] mt-0.5 leading-tight">Sin barra del navegador</p>
            </div>
            <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#0B0F19] border border-[#E2E8F0] dark:border-[#1E293B] text-center">
              <WifiOff className="w-4 h-4 text-blue-500 mx-auto mb-1.5" />
              <p className="text-[11px] font-bold">Modo Offline</p>
              <p className="text-[10px] text-[#64748B] dark:text-[#94A3B8] mt-0.5 leading-tight">Caché inteligente</p>
            </div>
            <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#0B0F19] border border-[#E2E8F0] dark:border-[#1E293B] text-center">
              <ShieldCheck className="w-4 h-4 text-emerald-500 mx-auto mb-1.5" />
              <p className="text-[11px] font-bold">100% Segura</p>
              <p className="text-[10px] text-[#64748B] dark:text-[#94A3B8] mt-0.5 leading-tight">Aislamiento por usuario</p>
            </div>
          </div>

          {/* If already running in standalone */}
          {isInstalled && (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                  ¡FinaMatch ya está instalada!
                </h4>
                <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">
                  Estás ejecutando la aplicación en modo nativo standalone en tu dispositivo.
                </p>
              </div>
            </div>
          )}

          {/* Native 1-Click Install Button (Android / Chrome / Edge / Brave / Desktop) */}
          {isInstallable && !isInstalled && (
            <div className="space-y-2">
              <button
                onClick={handleNativeInstall}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-md transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Instalar FinaMatch Ahora (1 Clic)</span>
              </button>
              <p className="text-[11px] text-center text-[#64748B] dark:text-[#94A3B8]">
                Compatible con Windows, Mac, Android y ChromeOS
              </p>
            </div>
          )}

          {/* iOS / iPhone Instructions */}
          {isIOS && (
            <div className="p-4 rounded-xl bg-[#F1F5F9] dark:bg-[#0B0F19] border border-[#CBD5E1] dark:border-[#334155] space-y-3">
              <div className="flex items-center gap-2">
                <Apple className="w-4 h-4 text-[#0F172A] dark:text-white" />
                <h4 className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                  Cómo instalar en iPhone o iPad (Safari):
                </h4>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    <span className="font-semibold">Toca el botón Compartir</span>
                    <span className="text-[#64748B] dark:text-[#94A3B8] block text-[11px]">
                      En la barra inferior de Safari, pulsa el icono de compartir (<Share className="w-3 h-3 inline text-blue-500" />).
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    2
                  </span>
                  <div>
                    <span className="font-semibold">Añadir a pantalla de inicio</span>
                    <span className="text-[#64748B] dark:text-[#94A3B8] block text-[11px]">
                      Baja en el menú y selecciona <PlusSquare className="w-3 h-3 inline text-[#0F172A] dark:text-white" /> <strong>"Añadir a pantalla de inicio"</strong>.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    3
                  </span>
                  <div>
                    <span className="font-semibold">Confirmar "Añadir"</span>
                    <span className="text-[#64748B] dark:text-[#94A3B8] block text-[11px]">
                      Listo. Tendrás el icono de FinaMatch en tu pantalla de inicio junto a tus apps nativas.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Desktop (PC Windows / Mac) Instructions */}
          {!isIOS && !isAndroid && (
            <div className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#0B0F19] border border-[#E2E8F0] dark:border-[#1E293B] space-y-3">
              <div className="flex items-center gap-2">
                <Laptop className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h4 className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                  Instalación en PC (Windows) o Mac (macOS):
                </h4>
              </div>
              <ul className="space-y-1.5 text-xs text-[#64748B] dark:text-[#94A3B8]">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  <span><strong>Chrome / Edge / Brave:</strong> Pulsa el icono de instalar en la barra de direcciones (lado derecho).</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  <span><strong>Safari en macOS Sonoma+:</strong> Archivo &gt; Añadir al Dock.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  <span>Se abrirá en su propia ventana aislada, sin pestañas ni barras de navegación.</span>
                </li>
              </ul>
            </div>
          )}

          {/* Android Instructions */}
          {isAndroid && !isInstallable && !isInstalled && (
            <div className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#0B0F19] border border-[#E2E8F0] dark:border-[#1E293B] space-y-2">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h4 className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                  Instalación en Android:
                </h4>
              </div>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                Abre el menú de tu navegador (los tres puntos verticales <span className="font-bold">⋮</span> en la esquina superior derecha) y selecciona <strong>"Instalar aplicación"</strong> o <strong>"Añadir a pantalla de inicio"</strong>.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F8FAFC] dark:bg-[#0B0F19] border-t border-[#E2E8F0] dark:border-[#1E293B] flex items-center justify-between">
          <span className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
            {isInstalled ? 'Estado: Instalada' : 'PWA Manifest v1.0'}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#0F172A] dark:bg-[#1E293B] hover:bg-[#1E293B] dark:hover:bg-[#253347] text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
