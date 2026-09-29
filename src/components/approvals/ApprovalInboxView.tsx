import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ApprovalRule,
  ProcurementRequest,
  UserRole,
} from '../../types';
import {
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
  Shield,
  Layers,
  UserCheck,
  RotateCcw,
  Sliders,
  DollarSign,
  AlertTriangle,
  Building,
  Check,
} from 'lucide-react';

export const ApprovalInboxView: React.FC = () => {
  const {
    requests,
    approveRequest,
    rejectRequest,
    invoices,
    approveInvoice,
    currentUser,
    formatCurrency,
    orgConfig,
    departments,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'inbox' | 'matrix'>('inbox');
  const [commentModal, setCommentModal] = useState<{
    id: string;
    type: 'request' | 'invoice';
    action: 'approve' | 'reject' | 'return';
    title: string;
  } | null>(null);
  const [actionComment, setActionComment] = useState('');

  // Sample matrix rules
  const [matrixRules, setMatrixRules] = useState<ApprovalRule[]>([
    {
      id: 'rule_1',
      tierName: 'Tier 1 - Standard Purchasing',
      minAmount: 0,
      maxAmount: 5000,
      requiredRole: 'approver',
      autoEscalateDays: 3,
    },
    {
      id: 'rule_2',
      tierName: 'Tier 2 - Departmental Management',
      minAmount: 5001,
      maxAmount: 25000,
      requiredRole: 'procurement_officer',
      autoEscalateDays: 2,
    },
    {
      id: 'rule_3',
      tierName: 'Tier 3 - Executive Board Signoff',
      minAmount: 25001,
      maxAmount: Infinity,
      requiredRole: 'owner',
      autoEscalateDays: 1,
    },
  ]);

  const pendingRequests = requests.filter((r) => r.status === 'pending_approval');
  const pendingInvoices = invoices.filter((i) => i.status === 'exception' || i.status === 'pending_review');

  const handleConfirmAction = () => {
    if (!commentModal) return;

    if (commentModal.type === 'request') {
      if (commentModal.action === 'approve') {
        approveRequest(commentModal.id, actionComment);
      } else if (commentModal.action === 'reject') {
        rejectRequest(commentModal.id, actionComment || 'Rejected by policy');
      } else {
        rejectRequest(commentModal.id, actionComment ? `Returned for revision: ${actionComment}` : 'Returned for revision');
      }
    } else if (commentModal.type === 'invoice') {
      approveInvoice(commentModal.id);
    }

    setCommentModal(null);
    setActionComment('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Approval Center</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Review requisitions, inspect budget commitments, and enforce organizational authorization thresholds.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('inbox')}
            className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
              activeTab === 'inbox' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Approval Queue ({pendingRequests.length + pendingInvoices.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
              activeTab === 'matrix' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Approval Matrix Rules</span>
          </button>
        </div>
      </div>

      {activeTab === 'inbox' ? (
        <div className="space-y-6">
          {/* Pending Requests */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Requisition Approvals ({pendingRequests.length})</span>
              </h2>
            </div>

            {pendingRequests.length === 0 ? (
              <div className="p-8 text-center rounded-2xl border border-slate-800 bg-slate-900/40 text-slate-400 text-xs">
                No procurement requests are currently waiting in your approval inbox.
              </div>
            ) : (
              <div className="space-y-3">
                {pendingRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-5 rounded-2xl border border-slate-800 bg-slate-900/90 shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 max-w-2xl">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-indigo-400">{req.requestNumber}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            req.priority === 'urgent'
                              ? 'bg-rose-500/20 text-rose-300'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}
                        >
                          {req.priority.toUpperCase()}
                        </span>
                        {req.departmentName && (
                          <span className="text-[11px] text-slate-400">• {req.departmentName}</span>
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-white">{req.title}</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">{req.description}</p>
                      <div className="text-[11px] text-slate-500">
                        Submitted by <strong>{req.requesterName}</strong> • Needed by: {req.requiredDate} • Budget Code:{' '}
                        {req.budgetCode || 'Standard Cost Center'}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-800">
                      <div className="text-right">
                        <div className="text-base font-black text-white">{formatCurrency(req.estimatedBudget)}</div>
                        <span className="text-[10px] text-slate-400 block">Total Requisition</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            setCommentModal({
                              id: req.id,
                              type: 'request',
                              action: 'approve',
                              title: `Authorize ${req.requestNumber} (${formatCurrency(req.estimatedBudget)})`,
                            })
                          }
                          className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-sm"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() =>
                            setCommentModal({
                              id: req.id,
                              type: 'request',
                              action: 'return',
                              title: `Return ${req.requestNumber} for revision`,
                            })
                          }
                          className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition"
                        >
                          Revise
                        </button>
                        <button
                          onClick={() =>
                            setCommentModal({
                              id: req.id,
                              type: 'request',
                              action: 'reject',
                              title: `Reject Requisition ${req.requestNumber}`,
                            })
                          }
                          className="px-3 py-2 rounded-xl bg-rose-600/80 hover:bg-rose-500 text-white font-bold text-xs transition"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pending Invoices / Discrepancy Clearances */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-purple-400" />
                <span>Invoice Exceptions Requiring Signoff ({pendingInvoices.length})</span>
              </h2>
            </div>

            <div className="space-y-3">
              {pendingInvoices.map((inv) => (
                <div
                  key={inv.id}
                  className="p-5 rounded-2xl border border-purple-500/20 bg-slate-900/90 shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  <div className="space-y-1 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-purple-400">{inv.invoiceNumber}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300">
                        {inv.status.toUpperCase()}
                      </span>
                      <span className="text-[11px] text-slate-400">• Vendor: {inv.vendorName}</span>
                    </div>
                    <div className="text-xs text-rose-300 font-medium">
                      {inv.threeWayMatch.discrepancyNote || 'Pending finance verification'}
                    </div>
                    <div className="text-[11px] text-slate-500">Linked to PO: {inv.poNumber} • Due Date: {inv.dueDate}</div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-base font-black text-white">{formatCurrency(inv.totalAmount)}</div>
                      <span className="text-[10px] text-slate-400">Total Billed</span>
                    </div>
                    <button
                      onClick={() =>
                        setCommentModal({
                          id: inv.id,
                          type: 'invoice',
                          action: 'approve',
                          title: `Override & Authorize Invoice ${inv.invoiceNumber}`,
                        })
                      }
                      className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition"
                    >
                      Authorize Clearance
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Approval Matrix Configuration Table */
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-6">
          <div>
            <h2 className="text-base font-bold text-white">Spend Authorization Matrix</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Specify which organizational roles are mandated to approve requisitions within each monetary tier.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
                  <th className="pb-3">Threshold Tier Name</th>
                  <th className="pb-3">Minimum Value</th>
                  <th className="pb-3">Maximum Value</th>
                  <th className="pb-3">Mandatory Signoff Role</th>
                  <th className="pb-3">Auto-Escalation</th>
                  <th className="pb-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {matrixRules.map((rule) => (
                  <tr key={rule.id} className="text-slate-300">
                    <td className="py-3.5 font-bold text-white">{rule.tierName}</td>
                    <td className="py-3.5 font-mono">{formatCurrency(rule.minAmount)}</td>
                    <td className="py-3.5 font-mono">
                      {rule.maxAmount === Infinity ? 'Unlimited / Max' : formatCurrency(rule.maxAmount)}
                    </td>
                    <td className="py-3.5">
                      <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 font-bold border border-indigo-500/20 capitalize">
                        {rule.requiredRole.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 text-slate-400">{rule.autoEscalateDays} Business Days</td>
                    <td className="py-3.5 text-right text-emerald-400 font-bold">Active Rule</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-start gap-3">
            <Shield className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Enterprise Governance Protocol:</strong> Purchases exceeding the tier threshold automatically trigger secondary signoff. If an approver is out of office, delegation rules automatically route tasks to their appointed deputy.
            </div>
          </div>
        </div>
      )}

      {/* Action / Comment Modal */}
      {commentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-left">
            <h3 className="text-sm font-bold text-white">{commentModal.title}</h3>
            <p className="text-xs text-slate-400 mt-1">
              Add any optional authorization comments, inspection notes, or instructions for the audit trail.
            </p>

            <textarea
              rows={3}
              value={actionComment}
              onChange={(e) => setActionComment(e.target.value)}
              placeholder="e.g. Approved within Q4 infrastructure cap; expediting delivery..."
              className="mt-4 w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
            />

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                onClick={() => setCommentModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                className={`px-4 py-2 rounded-xl text-white font-bold text-xs shadow-md transition ${
                  commentModal.action === 'approve'
                    ? 'bg-emerald-600 hover:bg-emerald-500'
                    : commentModal.action === 'reject'
                    ? 'bg-rose-600 hover:bg-rose-500'
                    : 'bg-amber-600 hover:bg-amber-500'
                }`}
              >
                Confirm Action
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
