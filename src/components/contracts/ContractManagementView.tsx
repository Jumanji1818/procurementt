import React from 'react';
import { useApp } from '../../context/AppContext';
import { FileCheck, Shield, Plus, Calendar, DollarSign } from 'lucide-react';

export const ContractManagementView: React.FC = () => {
  const { contracts, formatCurrency } = useApp();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Contract & SLA Management</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitor master service agreements (MSAs), locked unit pricing covenants, and renewal notice deadlines.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {contracts.map((ct) => (
          <div key={ct.id} className="p-6 rounded-2xl border border-slate-800 bg-slate-900 space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="font-mono text-xs font-bold text-indigo-400">{ct.contractNumber}</span>
                <h3 className="text-sm font-bold text-white mt-1">{ct.title}</h3>
                <div className="text-xs text-slate-400">Supplier: {ct.vendorName}</div>
              </div>
              <span
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                  ct.status === 'active'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-amber-500/20 text-amber-400'
                }`}
              >
                {ct.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300">
              <span className="text-[10px] text-slate-500 font-bold block mb-1 uppercase">SLA & Terms</span>
              {ct.slaTerms}
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-500 block text-[10px]">Term Window</span>
                <span className="text-slate-300">{ct.startDate} → {ct.endDate}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-500 block text-[10px]">Total Contract Value</span>
                <span className="font-mono font-bold text-white">{formatCurrency(ct.totalValue)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
