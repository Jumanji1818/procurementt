import React, { useEffect, useState } from 'react';

export const LoadingSplash: React.FC<{ onFinish: () => void; text?: string }> = ({
  onFinish,
  text = 'Initializing Procura Enterprise Procurement Core...',
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
    <div className="fixed inset-0 z-50 bg-[#04140e] flex flex-col items-center justify-center p-4 select-none">
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-2xl bg-[#092b1f] border-2 border-[#d4af37] flex items-center justify-center text-[#d4af37] text-3xl font-black shadow-2xl shadow-[#d4af37]/20">
          P
        </div>
      </div>

      <div className="text-center space-y-1 mb-6">
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Procura</h1>
        <p className="text-xs text-[#d4af37] font-semibold uppercase tracking-widest text-[11px]">
          Smart Procurement Operating System
        </p>
      </div>

      <div className="w-64 max-w-[80vw] h-1.5 bg-[#082117] rounded-full overflow-hidden border border-[#143e2f]">
        <div
          className="h-full bg-[#d4af37] transition-all duration-300 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="text-[11px] text-slate-400 mt-4 font-mono">{text}</div>
    </div>
  );
};
