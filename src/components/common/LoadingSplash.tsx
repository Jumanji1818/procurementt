import React, { useEffect, useState } from 'react';

export const LoadingSplash: React.FC<{ onFinish: () => void; text?: string }> = ({
  onFinish,
  text = 'Initializing Procura Adaptive Procurement Core...',
}) => {
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    const timer1 = setTimeout(() => setProgress(45), 200);
    const timer2 = setTimeout(() => setProgress(85), 500);
    const timer3 = setTimeout(() => {
      setProgress(100);
      setTimeout(onFinish, 300);
    }, 800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center p-4 select-none">
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-sky-500 to-teal-400 flex items-center justify-center text-white text-3xl font-black shadow-2xl shadow-indigo-500/30 animate-pulse">
          P
        </div>
        <div className="absolute -inset-2 bg-gradient-to-tr from-indigo-500/20 to-sky-400/20 rounded-3xl blur-xl -z-10" />
      </div>

      <div className="text-center space-y-1 mb-6">
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Procura</h1>
        <p className="text-xs text-indigo-400 font-semibold uppercase tracking-widest text-[11px]">
          Universal Procurement OS
        </p>
      </div>

      <div className="w-64 max-w-[80vw] h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 via-sky-400 to-teal-400 transition-all duration-300 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="text-[11px] text-slate-500 mt-4 font-mono">{text}</div>
    </div>
  );
};
