import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  ArrowRight,
  CheckCircle,
  FileText,
  FileSpreadsheet,
  ShoppingCart,
  CreditCard,
  Building,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Info
} from 'lucide-react';
import { UserRole } from '../../types';

export const InterAccountRelay: React.FC = () => {
  const {
    currentUser,
    switchRole,
    requests,
    rfqs,
    purchaseOrders,
    invoices,
    setActiveView,
  } = useApp();

  const [isExpanded, setIsExpanded] = useState(true);

  const pendingApprovals = requests.filter((r) => r.status === 'pending_approval').length;
  const approvedForProcurement = requests.filter(
    (r) => r.status === 'approved' || r.status === 'submitted'
  ).length;
  const openRFQs = rfqs.filter((r) => r.status === 'published').length;
  const pendingInvoices = invoices.filter(
    (i) => i.status === 'pending_review' || i.status === 'exception'
  ).length;

  const personas: {
    role: UserRole;
    name: string;
    dept: string;
    icon: string;
    badgeCount?: number;
    description: string;
    actionLabel: string;
    view: 'requests' | 'approvals' | 'rfqs' | 'orders' | 'finance' | 'vendor_portal';
  }[] = [
    {
      role: 'requester',
      name: 'Emmanuel Adebayo',
      dept: 'Operations & Engineering',
      icon: '👤',
      description: 'Submits requisitions with specifications & estimates',
      actionLabel: 'New Request',
      view: 'requests',
    },
    {
      role: 'approver',
      name: 'Dr. Michael Chen',
      dept: 'IT & Department Head',
      icon: '✍️',
      badgeCount: pendingApprovals,
      description: 'Reviews & authorizes departmental requisitions',
      actionLabel: 'Review Queue',
      view: 'approvals',
    },
    {
      role: 'procurement_officer',
      name: 'Sarah Jenkins',
      dept: 'Procurement & Sourcing',
      icon: '📦',
      badgeCount: approvedForProcurement,
      description: 'Sourcing queue: Publishes RFQs, evaluates bids, issues POs',
      actionLabel: 'Sourcing Queue',
      view: 'rfqs',
    },
    {
      role: 'vendor',
      name: 'Marcus Vance',
      dept: 'Nexus Logistics Partner',
      icon: '🏢',
      badgeCount: openRFQs,
      description: 'Vendor Portal: Submits bids, confirms POs, sends invoices',
      actionLabel: 'Vendor Portal',
      view: 'vendor_portal',
    },
    {
      role: 'finance',
      name: 'Fatima Al-Mansoor',
      dept: 'Finance & Comptroller',
      icon: '💳',
      badgeCount: pendingInvoices,
      description: 'Audits 3-Way Match (PO vs GRN vs Invoice) & releases payouts',
      actionLabel: '3-Way Match',
      view: 'finance',
    },
  ];

  const currentPersona = personas.find((p) => p.role === currentUser.role);

  return (
    <div className="mb-6 rounded-xl border border-[#143e2f] bg-[#082117] shadow-sm overflow-hidden text-left transition">
      {/* Header bar */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-[#143e2f] bg-[#051710]/80">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#092b1f] border border-[#d4af37]/40 flex items-center justify-center text-sm font-bold text-[#d4af37]">
            <Users className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white tracking-tight">
                Inter-Account Organizational Relay
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#0d3b2b] text-[#d4af37] border border-[#d4af37]/30">
                Multi-Role Pipeline
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Active Persona: <strong className="text-white">{currentUser.name}</strong> ({currentUser.role.replace('_', ' ')})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-2.5 py-1 rounded-md bg-[#082117] hover:bg-[#0c2d20] border border-[#143e2f] text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
          >
            <span>{isExpanded ? 'Hide Relay' : 'Switch Persona'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Expanded Persona Switcher */}
      {isExpanded && (
        <div className="p-4 space-y-3">
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>
              Click any account below to simulate live cross-department communication and watch requisitions advance from Staff ➔ Approver ➔ Procurement ➔ Supplier ➔ Finance:
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
            {personas.map((p) => {
              const isSelected = currentUser.role === p.role;
              return (
                <button
                  key={p.role}
                  onClick={() => {
                    switchRole(p.role);
                    setActiveView(p.view);
                  }}
                  className={`p-3 rounded-lg border text-left transition flex flex-col justify-between group cursor-pointer ${
                    isSelected
                      ? 'bg-[#d4af37] border-[#d4af37] text-[#051b14] shadow-md'
                      : 'bg-[#051710] border-[#143e2f] text-slate-200 hover:bg-[#0c2d20] hover:border-[#d4af37]/40'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-base">{p.icon}</span>
                      {p.badgeCount !== undefined && p.badgeCount > 0 && (
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            isSelected
                              ? 'bg-[#051b14] text-[#d4af37]'
                              : 'bg-[#d4af37] text-[#051b14]'
                          }`}
                        >
                          {p.badgeCount} pending
                        </span>
                      )}
                    </div>
                    <div className={`text-xs font-bold mt-1.5 leading-tight ${isSelected ? 'text-[#051b14]' : 'text-white'}`}>
                      {p.name}
                    </div>
                    <div className={`text-[10px] mt-0.5 leading-tight ${isSelected ? 'text-[#051b14]/80' : 'text-slate-400'}`}>
                      {p.dept}
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-current/15 flex items-center justify-between text-[10px] font-semibold">
                    <span>{isSelected ? 'Current Account' : `Switch ➔`}</span>
                    <span>{p.actionLabel}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Current Persona Context Guidance */}
          <div className="mt-2 p-2.5 rounded-lg bg-[#051710] border border-[#143e2f] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
              <span className="text-slate-300">
                <strong>Current Stage:</strong>{' '}
                {currentUser.role === 'requester' && 'Requisition phase — create and submit purchasing requests.'}
                {currentUser.role === 'approver' && 'Authorization phase — review budget & sign off pending requests.'}
                {currentUser.role === 'procurement_officer' && 'Sourcing phase — convert approved requests to RFQs, publish tenders, or issue POs.'}
                {currentUser.role === 'vendor' && 'Supplier fulfillment — bid on RFQ tenders, accept POs, submit shipments & invoices.'}
                {currentUser.role === 'finance' && 'Audit & disbursement — perform automated 3-way matching and approve vendor payments.'}
                {currentUser.role === 'owner' && 'Executive command — enterprise-wide analytics, budgets, and policy configuration.'}
              </span>
            </div>

            <div className="text-[11px] text-[#d4af37] font-semibold whitespace-nowrap self-end sm:self-auto">
              Real-time Shared State Active
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
