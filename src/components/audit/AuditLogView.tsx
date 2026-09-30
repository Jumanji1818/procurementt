import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Clock,
  User,
  Filter,
  Search,
  Download,
  CheckCircle2,
  AlertTriangle,
  ArrowUpDown,
  FileCheck,
  Lock,
  Info
} from 'lucide-react';

export const AuditLogView: React.FC = () => {
  const { auditLogs, orgConfig, theme } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entityId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === 'all' || log.userRole === roleFilter;

    return matchesSearch && matchesRole;
  });

  const getActionColor = (action: string) => {
    if (action.includes('APPROVED') || action.includes('MATCHED') || action.includes('PROCESSED')) {
      return 'text-emerald-400 border-emerald-600/40 bg-emerald-950/40';
    }
    if (action.includes('REJECTED') || action.includes('EXCEPTION')) {
      return 'text-rose-400 border-rose-800/40 bg-rose-950/40';
    }
    if (action.includes('BID') || action.includes('PO_') || action.includes('CREATED')) {
      return 'text-[#d4af37] border-[#d4af37]/40 bg-[#092b1f]';
    }
    return 'text-slate-300 border-[#143e2f] bg-[#051710]';
  };

  const handleExportCSV = () => {
    const headers = ['Timestamp', 'Operator', 'Role', 'Action', 'Entity', 'Details'];
    const rows = filteredLogs.map((l) => [
      l.timestamp,
      `"${l.userName}"`,
      l.userRole,
      l.action,
      l.entityId,
      `"${l.details.replace(/"/g, '""')}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `procura-audit-trail-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 text-left max-w-full">
      {/* Top Header & Context Description */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#143e2f]">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-[#082117] border border-[#d4af37]/50 flex items-center justify-center text-[#d4af37] shadow-sm">
              <ShieldCheck className="w-5 h-5 text-[#d4af37]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Compliance & Cryptographic Audit Ledger
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#0d3b2b] text-[#d4af37] border border-[#d4af37]/30">
                  Immutable SoD
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Tamper-evident audit trail capturing requisitions, manager authorizations, competitive tenders, goods receipts, and disbursements.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2 rounded-md bg-[#082117] hover:bg-[#0c2d20] border border-[#143e2f] hover:border-[#d4af37]/50 text-slate-200 text-xs font-semibold transition cursor-pointer self-start sm:self-auto flex items-center gap-2 shadow-sm"
        >
          <Download className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>Export Audit Trail (CSV)</span>
        </button>
      </div>

      {/* Spacious Executive Governance & Compliance KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-lg bg-[#082117] border border-[#143e2f] space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold">Compliance Rating</span>
            <Lock className="w-4 h-4 text-[#d4af37]" />
          </div>
          <div className="text-2xl font-black text-white">99.8%</div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Aligned with SOX 404 & ISO-9001</span>
          </div>
        </div>

        <div className="p-5 rounded-lg bg-[#082117] border border-[#143e2f] space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold">Segregation of Duties (SoD)</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">100% Passed</div>
          <div className="text-[11px] text-slate-400">
            Zero cross-role authorization violations
          </div>
        </div>

        <div className="p-5 rounded-lg bg-[#082117] border border-[#143e2f] space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold">3-Way Match Integrity</span>
            <FileCheck className="w-4 h-4 text-[#d4af37]" />
          </div>
          <div className="text-2xl font-black text-white">97.4%</div>
          <div className="text-[11px] text-amber-400">
            1 overbilling invoice auto-quarantined
          </div>
        </div>

        <div className="p-5 rounded-lg bg-[#082117] border border-[#143e2f] space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold">Logged System Events</span>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-black text-[#d4af37]">{filteredLogs.length} Records</div>
          <div className="text-[11px] text-slate-400">
            Timestamped & operator verified
          </div>
        </div>
      </div>

      {/* Narrative Guide explaining what one is looking at */}
      <div className="p-4 rounded-lg bg-[#051710] border border-[#143e2f] flex items-start gap-3 text-xs leading-relaxed text-slate-300">
        <Info className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
        <div>
          <strong className="text-white block mb-0.5">Understanding the Enterprise Compliance Trail:</strong>
          This ledger automatically records every action across the organization. In standard enterprise procurement, an employee who creates a requisition cannot approve it, and the procurement officer who creates a Purchase Order cannot authorize payment. The audit entries below provide verifiable proof of regulatory compliance and fraud prevention.
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-4 rounded-lg bg-[#082117] border border-[#143e2f]">
        <div className="sm:col-span-8 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by action, operator name, reference ID (e.g. REQ-2026, PO-2026)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-md bg-[#051710] border border-[#143e2f] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af37]"
          />
        </div>

        <div className="sm:col-span-4 flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-md bg-[#051710] border border-[#143e2f] text-xs text-slate-300 focus:outline-none focus:border-[#d4af37]"
          >
            <option value="all">All Regulatory Roles</option>
            <option value="owner">Business Owner</option>
            <option value="requester">Employee / Requester</option>
            <option value="approver">Department Approver</option>
            <option value="procurement_officer">Procurement Officer</option>
            <option value="finance">Finance Comptroller</option>
            <option value="vendor">Vendor / Supplier</option>
            <option value="admin">System / Admin</option>
          </select>
        </div>
      </div>

      {/* DESKTOP TABLE VIEW (Spacious & Cleanly Structured) */}
      <div className="rounded-lg border border-[#143e2f] bg-[#082117] overflow-hidden shadow-sm">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead>
              <tr className="border-b border-[#143e2f] bg-[#051710] text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                <th className="py-3 px-4">Timestamp (UTC)</th>
                <th className="py-3 px-4">Action Event</th>
                <th className="py-3 px-4">Entity ID</th>
                <th className="py-3 px-4">Operator & Clearance</th>
                <th className="py-3 px-4">Audit Record Narrative</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#143e2f]">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-xs text-slate-400">
                    No compliance records match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#0c2d20]/60 transition">
                    <td className="py-4 px-4 font-mono text-slate-400 text-[11px] whitespace-nowrap">
                      {log.timestamp.replace('T', ' ').slice(0, 19)}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${getActionColor(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-mono text-[11px] font-bold text-[#d4af37] whitespace-nowrap">
                      {log.entityId}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="font-semibold text-white">{log.userName}</div>
                      <div className="text-[10px] text-slate-400 uppercase font-medium">
                        {log.userRole.replace('_', ' ')}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-200 text-xs leading-relaxed max-w-lg">
                      {log.details}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
