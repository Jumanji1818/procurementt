import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Clock, User, Filter } from 'lucide-react';

export const AuditLogView: React.FC = () => {
  const { auditLogs } = useApp();

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Compliance & Audit Trail</h1>
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">
            Immutable Ledger
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">
          Tamper-evident record of all procurement events, authorizations, payments, and 3-way match exceptions.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                <th className="pb-3">Timestamp</th>
                <th className="pb-3">Operator</th>
                <th className="pb-3">Role</th>
                <th className="pb-3">Action Event</th>
                <th className="pb-3">Entity Ref</th>
                <th className="pb-3">Audit Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {auditLogs.map((log) => (
                <tr key={log.id} className="text-slate-300">
                  <td className="py-3.5 font-mono text-slate-400 text-[11px] whitespace-nowrap">
                    {log.timestamp.replace('T', ' ').slice(0, 19)}
                  </td>
                  <td className="py-3.5 font-semibold text-white">{log.userName}</td>
                  <td className="py-3.5">
                    <span className="px-2 py-0.5 rounded-md bg-slate-950 text-[10px] text-slate-400 border border-slate-800 capitalize">
                      {log.userRole.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3.5">
                    <span className="font-mono text-[11px] font-bold text-indigo-400">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3.5 font-mono text-[11px] text-slate-300">{log.entityId}</td>
                  <td className="py-3.5 text-slate-300 text-xs">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
