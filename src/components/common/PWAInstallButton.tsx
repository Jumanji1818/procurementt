import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Download, Smartphone, CheckCircle, ExternalLink } from 'lucide-react';

export const PWAInstallButton: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">
        <CheckCircle className="w-3.5 h-3.5" />
        <span>Installed</span>
      </div>
    );
  }

  if (isInstallable) {
    return (
      <button
        onClick={install}
        className={`flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-sm transition active:scale-95 ${
          compact ? 'px-2.5 py-1.5 text-xs' : 'px-3.5 py-2 text-sm'
        }`}
      >
        <Download className="w-4 h-4" />
        <span>Install App</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className={`flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-medium transition ${
            compact ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-sm'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
          <span>iOS Install</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-left">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Install Procura on iPhone</h3>
                  <p className="text-xs text-slate-400">Run as full-screen native mobile application</p>
                </div>
              </div>
              <div className="space-y-3 text-xs text-slate-300 bg-slate-950 p-4 rounded-xl border border-slate-800/80">
                <div className="flex items-start gap-2.5">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px]">1</span>
                  <span>Tap the <strong>Share</strong> button <ExternalLink className="w-3.5 h-3.5 inline text-indigo-400" /> in Safari's bottom toolbar.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px]">2</span>
                  <span>Scroll down and tap <strong>Add to Home Screen</strong>.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px]">3</span>
                  <span>Tap <strong>Add</strong> in the top-right corner to launch Procura from your app drawer.</span>
                </div>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-indigo-600 py-2.5 text-xs font-semibold text-white hover:bg-indigo-500 transition"
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
