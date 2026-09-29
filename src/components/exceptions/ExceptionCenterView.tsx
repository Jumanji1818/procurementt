import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Truck,
  CreditCard,
  FileCheck2,
  Package,
  ArrowRight,
  ShieldAlert,
  Filter,
} from 'lucide-react';

export const ExceptionCenterView: React.FC = () => {
  const { exceptions, dismissException, setActiveView } = useApp();
  const [filterSeverity, setFilterSeverity] = useState('all');

  const filtered = exceptions.filter((ex) => {
    if (filterSeverity === 'all') return true;
    return ex.severity === filterSeverity;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Operational Exception Center
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 text-xs font-bold">
              {exceptions.filter((e) => !e.resolved).length} Active Anomaly Alerts
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Automated intelligence intercepting 3-way match mismatches, overdue shipments, budget threshold breeches, and expired supplier compliance.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          {['all', 'critical', 'high', 'medium'].map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-3 py-1.5 rounded-lg font-bold transition capitalize ${
                filterSeverity === sev ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Exception cards */}
      <div className="space-y-3">
        {filtered.map((ex) => {
          const isResolved = ex.resolved;
          return (
            <div
              key={ex.id}
              className={`p-5 rounded-2xl border transition flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                isResolved
                  ? 'border-slate-800/80 bg-slate-950/40 opacity-60'
                  : ex.severity === 'critical'
                  ? 'border-rose-500/40 bg-rose-950/20 shadow-lg shadow-rose-950/10'
                  : 'border-slate-800 bg-slate-900'
              }`}
            >
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      ex.severity === 'critical'
                        ? 'bg-rose-500 text-white'
                        : ex.severity === 'high'
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {ex.severity.toUpperCase()}
                  </span>
                  <span className="font-mono text-xs font-semibold text-slate-400">
                    {ex.type.replace('_', ' ').toUpperCase()}
                  </span>
                  {isResolved && (
                    <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Resolved
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-white">{ex.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{ex.description}</p>
                <div className="text-[11px] text-slate-500">Detected: {ex.createdAt.split('T')[0]}</div>
              </div>

              <div className="flex items-center gap-3 border-t md:border-t-0 pt-3 md:pt-0 border-slate-800">
                <button
                  onClick={() => {
                    if (ex.entityType === 'invoice') setActiveView('finance');
                    else if (ex.entityType === 'po') setActiveView('orders');
                    else if (ex.entityType === 'vendor') setActiveView('vendors');
                    else if (ex.entityType === 'inventory') setActiveView('inventory');
                    else setActiveView('requests');
                  }}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1.5"
                >
                  <span>Investigate Entity</span>
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
                </button>

                {!isResolved && (
                  <button
                    onClick={() => dismissException(ex.id)}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition"
                  >
                    Mark Handled
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
