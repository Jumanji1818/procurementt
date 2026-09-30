import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  CheckCircle2,
  Clock,
  CreditCard,
  DollarSign,
  FileCheck2,
  FileSpreadsheet,
  FileText,
  Package,
  Plus,
  ShieldAlert,
  ShieldCheck,
  ShoppingCart,
  TrendingUp,
  Truck,
  Users,
  Zap,
  Check,
  X,
  XCircle,
  Building,
  Store,
  Layers
} from 'lucide-react';

export const UniversalDashboard: React.FC<{
  onOpenNewRequest: () => void;
  onOpenNewPO: () => void;
  onOpenNewGRN: () => void;
  onOpenNewInvoice: () => void;
  onOpenNewVendor: () => void;
}> = ({ onOpenNewRequest, onOpenNewPO, onOpenNewGRN, onOpenNewInvoice, onOpenNewVendor }) => {
  const {
    requests,
    purchaseOrders,
    rfqs,
    bids,
    invoices,
    budgets,
    exceptions,
    currentUser,
    orgConfig,
    formatCurrency,
    setActiveView,
    approveRequest,
    rejectRequest,
    createRequest,
    t,
  } = useApp();

  const [quickOrderNotice, setQuickOrderNotice] = useState<string | null>(null);

  // Role flags
  const isRequester = currentUser.role === 'requester';
  const isApprover = currentUser.role === 'approver';
  const isProcurement = currentUser.role === 'procurement_officer';
  const isFinance = currentUser.role === 'finance';
  const isOwnerOrAdmin = currentUser.role === 'owner' || currentUser.role === 'admin';

  // Metrics computation
  const activeRequests = requests.filter((r) => r.status !== 'completed' && r.status !== 'rejected');
  const pendingApprovals = requests.filter((r) => r.status === 'pending_approval');
  const activePOs = purchaseOrders.filter((p) => p.status === 'issued' || p.status === 'in_transit');
  const pendingDeliveries = purchaseOrders.filter(
    (p) => p.status === 'in_transit' || p.status === 'partially_received'
  );
  const activeExceptions = exceptions.filter((ex) => !ex.resolved);

  const totalAllocatedBudget = budgets.reduce((acc, b) => acc + b.allocatedAmount, 0);
  const totalCommitted = budgets.reduce((acc, b) => acc + b.committedAmount, 0);
  const totalSpent = budgets.reduce((acc, b) => acc + b.spentAmount, 0);
  const totalRemaining = budgets.reduce((acc, b) => acc + b.remainingAmount, 0);

  // My personal requests (for Requesters)
  const myRequests = requests.filter(
    (r) => r.requesterId === currentUser.id || r.requesterName.toLowerCase().includes(currentUser.name.toLowerCase().split(' ')[0])
  );

  const handleQuickCatalogReorder = (itemName: string, estimatedCost: number) => {
    createRequest({
      requesterId: currentUser.id,
      requesterName: currentUser.name,
      departmentId: 'dept_ops',
      departmentName: 'Operations',
      title: `Replenishment: ${itemName}`,
      businessJustification: 'Standard catalog routine replenishment.',
      priority: 'medium',
      status: 'pending_approval',
      currency: orgConfig.currency,
      estimatedBudget: estimatedCost,
      items: [
        {
          id: `item_${Date.now()}`,
          description: itemName,
          quantity: 1,
          estimatedUnitPrice: estimatedCost,
          unitPrice: estimatedCost,
          totalPrice: estimatedCost,
          category: 'Office & Operations',
          unit: 'pack',
        },
      ],
      customFields: {},
    });
    setQuickOrderNotice(`Requisition created for ${itemName}! Sent to manager approval.`);
    setTimeout(() => setQuickOrderNotice(null), 3000);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#082117] p-5 rounded-2xl border border-[#143e2f] shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {orgConfig.name}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#0d3b2b] text-[#d4af37] border border-[#d4af37]/30 text-[11px] font-bold">
              {isRequester
                ? 'EMPLOYEE DESK'
                : isApprover
                ? 'APPROVAL COMMAND'
                : isProcurement
                ? 'SOURCING & PURCHASING'
                : isFinance
                ? 'FINANCE & TREASURY'
                : 'EXECUTIVE OVERVIEW'}
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Logged in as <strong className="text-[#d4af37]">{currentUser.name}</strong> • Role:{' '}
            <strong className="text-white capitalize">{currentUser.role.replace('_', ' ')}</strong>
          </p>
        </div>

        {/* Workflow & Org Security Status */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-[#051710] border border-[#143e2f] text-[11px] text-slate-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-pulse" />
            <span>Workflow: <strong className="text-white">{orgConfig.approvalWorkflow.replace('_', ' ')}</strong></span>
          </div>
        </div>
      </div>

      {quickOrderNotice && (
        <div className="p-3 rounded-xl bg-[#0d3b2b] border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{quickOrderNotice}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. ROLE: REQUESTER / EMPLOYEE DESK */}
      {/* ========================================================================= */}
      {isRequester && (
        <div className="space-y-6">
          {/* Requester Quick Actions */}
          <div className="bg-[#082117] border border-[#143e2f] p-4 rounded-2xl shadow-md">
            <div className="text-xs font-bold text-[#d4af37] uppercase tracking-wider mb-3 flex items-center gap-2">
              <Zap className="w-3.5 h-3.5" />
              <span>Employee Purchasing Actions</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={onOpenNewRequest}
                className="p-3.5 rounded-xl bg-[#051710] hover:bg-[#d4af37] hover:text-[#051b14] text-slate-200 border border-[#143e2f] transition group flex items-center gap-3 cursor-pointer"
              >
                <div className="p-2 rounded-lg bg-[#092b1f] group-hover:bg-[#051b14] text-[#d4af37] transition">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold leading-tight">Create New Requisition</div>
                  <div className="text-[10px] text-slate-400 group-hover:text-[#051b14]/80">Submit request for office, tech, or ops</div>
                </div>
              </button>

              <button
                onClick={() => setActiveView('inventory')}
                className="p-3.5 rounded-xl bg-[#051710] hover:bg-[#d4af37] hover:text-[#051b14] text-slate-200 border border-[#143e2f] transition group flex items-center gap-3 cursor-pointer"
              >
                <div className="p-2 rounded-lg bg-[#092b1f] group-hover:bg-[#051b14] text-[#d4af37] transition">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold leading-tight">Browse Company Catalog</div>
                  <div className="text-[10px] text-slate-400 group-hover:text-[#051b14]/80">Pre-approved items with standard pricing</div>
                </div>
              </button>

              <button
                onClick={() => setActiveView('deliveries')}
                className="p-3.5 rounded-xl bg-[#051710] hover:bg-[#d4af37] hover:text-[#051b14] text-slate-200 border border-[#143e2f] transition group flex items-center gap-3 cursor-pointer"
              >
                <div className="p-2 rounded-lg bg-[#092b1f] group-hover:bg-[#051b14] text-sky-400 group-hover:text-[#051b14] transition">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold leading-tight">Track Inbound Shipments</div>
                  <div className="text-[10px] text-slate-400 group-hover:text-[#051b14]/80">Waybills, delivery dates & receipts</div>
                </div>
              </button>
            </div>
          </div>

          {/* Requester Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-[#082117] border border-[#143e2f]">
              <div className="text-slate-400 text-[11px] font-semibold">My Requests</div>
              <div className="text-2xl font-black text-white mt-1">{myRequests.length || activeRequests.length}</div>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Total logged</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#082117] border border-[#143e2f]">
              <div className="text-slate-400 text-[11px] font-semibold">Pending Manager Sign-off</div>
              <div className="text-2xl font-black text-[#d4af37] mt-1">
                {myRequests.filter((r) => r.status === 'pending_approval').length || 2}
              </div>
              <span className="text-[10px] text-[#d4af37] mt-0.5 block">Under review</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#082117] border border-[#143e2f]">
              <div className="text-slate-400 text-[11px] font-semibold">Approved & Ordered</div>
              <div className="text-2xl font-black text-emerald-400 mt-1">
                {myRequests.filter((r) => r.status === 'approved').length || 3}
              </div>
              <span className="text-[10px] text-emerald-300 mt-0.5 block">PO issued to vendor</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#082117] border border-[#143e2f]">
              <div className="text-slate-400 text-[11px] font-semibold">Items Arrived / Dispatched</div>
              <div className="text-2xl font-black text-sky-400 mt-1">{pendingDeliveries.length}</div>
              <span className="text-[10px] text-sky-300 mt-0.5 block">In transit or received</span>
            </div>
          </div>

          {/* My Recent Requisitions with Status Timeline */}
          <div className="p-5 rounded-2xl bg-[#082117] border border-[#143e2f]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#d4af37]" />
                <span>My Active Requisitions Lifecycle</span>
              </h3>
              <button
                onClick={() => setActiveView('requests')}
                className="text-xs text-[#d4af37] hover:underline font-semibold"
              >
                View Full History
              </button>
            </div>

            <div className="space-y-3">
              {(myRequests.length > 0 ? myRequests : requests).slice(0, 4).map((r) => (
                <div
                  key={r.id}
                  onClick={() => setActiveView('requests')}
                  className="p-3.5 rounded-xl bg-[#051710] border border-[#143e2f] hover:border-[#d4af37]/40 cursor-pointer transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-white">{r.requestNumber}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          r.status === 'approved'
                            ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-600/40'
                            : r.status === 'pending_approval'
                            ? 'bg-amber-950/80 text-[#d4af37] border border-[#d4af37]/40'
                            : 'bg-[#0c2d20] text-slate-300'
                        }`}
                      >
                        {r.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="text-xs text-slate-200 font-semibold mt-1">{r.title}</div>
                    <div className="text-[11px] text-slate-400">Created: {r.createdAt.split('T')[0]} • Priority: {r.priority}</div>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-center">
                    <div className="text-right">
                      <div className="text-xs font-bold text-[#d4af37]">{formatCurrency(r.estimatedBudget)}</div>
                      <div className="text-[10px] text-slate-400">{r.items.length} item(s)</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Catalog Quick Replenishment Shortcuts */}
          <div className="p-5 rounded-2xl bg-[#082117] border border-[#143e2f]">
            <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
              <Package className="w-4 h-4 text-[#d4af37]" />
              <span>1-Click Catalog Replenishment</span>
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              Request frequently needed team supplies without manual line-entry:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { name: 'Ergonomic Desk Accessories Pack', cost: 180, icon: '🪑' },
                { name: 'Heavy Duty Box Tape & Logistics Pack', cost: 95, icon: '📦' },
                { name: 'Workstation USB-C Dock & Cables', cost: 220, icon: '🔌' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-[#051710] border border-[#143e2f] flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{item.icon}</span>
                    <div>
                      <div className="text-xs font-bold text-white">{item.name}</div>
                      <div className="text-[11px] text-[#d4af37] font-semibold">{formatCurrency(item.cost)}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleQuickCatalogReorder(item.name, item.cost)}
                    className="px-2.5 py-1 rounded-lg bg-[#092b1f] hover:bg-[#d4af37] hover:text-[#051b14] text-[#d4af37] text-[10px] font-bold border border-[#d4af37]/30 transition cursor-pointer"
                  >
                    + Request
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. ROLE: DEPARTMENT APPROVER / MANAGER */}
      {/* ========================================================================= */}
      {isApprover && (
        <div className="space-y-6">
          {/* Approver Quick Actions */}
          <div className="bg-[#082117] border border-[#143e2f] p-4 rounded-2xl shadow-md">
            <div className="text-xs font-bold text-[#d4af37] uppercase tracking-wider mb-3 flex items-center gap-2">
              <Zap className="w-3.5 h-3.5" />
              <span>Manager Approval Governance</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => setActiveView('approvals')}
                className="p-3.5 rounded-xl bg-[#051710] hover:bg-[#d4af37] hover:text-[#051b14] text-slate-200 border border-[#143e2f] transition group flex items-center gap-3 cursor-pointer"
              >
                <div className="p-2 rounded-lg bg-[#092b1f] group-hover:bg-[#051b14] text-[#d4af37] transition">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold leading-tight">Open Approval Inbox</div>
                  <div className="text-[10px] text-slate-400 group-hover:text-[#051b14]/80">
                    {pendingApprovals.length} sign-offs awaiting action
                  </div>
                </div>
              </button>

              <button
                onClick={() => setActiveView('budgets')}
                className="p-3.5 rounded-xl bg-[#051710] hover:bg-[#d4af37] hover:text-[#051b14] text-slate-200 border border-[#143e2f] transition group flex items-center gap-3 cursor-pointer"
              >
                <div className="p-2 rounded-lg bg-[#092b1f] group-hover:bg-[#051b14] text-[#d4af37] transition">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold leading-tight">Department Budget Health</div>
                  <div className="text-[10px] text-slate-400 group-hover:text-[#051b14]/80">Review cost center burn rates</div>
                </div>
              </button>

              <button
                onClick={onOpenNewRequest}
                className="p-3.5 rounded-xl bg-[#051710] hover:bg-[#d4af37] hover:text-[#051b14] text-slate-200 border border-[#143e2f] transition group flex items-center gap-3 cursor-pointer"
              >
                <div className="p-2 rounded-lg bg-[#092b1f] group-hover:bg-[#051b14] text-emerald-400 group-hover:text-[#051b14] transition">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold leading-tight">Submit Department Request</div>
                  <div className="text-[10px] text-slate-400 group-hover:text-[#051b14]/80">Direct requisition creation</div>
                </div>
              </button>
            </div>
          </div>

          {/* Approver Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-[#082117] border border-[#d4af37]/40 shadow-lg shadow-[#d4af37]/5">
              <div className="text-slate-400 text-[11px] font-semibold">Requires My Signature</div>
              <div className="text-2xl font-black text-[#d4af37] mt-1">{pendingApprovals.length}</div>
              <span className="text-[10px] text-[#d4af37] mt-0.5 block">Immediate action</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#082117] border border-[#143e2f]">
              <div className="text-slate-400 text-[11px] font-semibold">Total Exposure to Sign</div>
              <div className="text-2xl font-black text-white mt-1">
                {formatCurrency(pendingApprovals.reduce((a, b) => a + b.estimatedBudget, 0))}
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Budget impact</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#082117] border border-[#143e2f]">
              <div className="text-slate-400 text-[11px] font-semibold">Dept Budget Spent</div>
              <div className="text-2xl font-black text-emerald-400 mt-1">
                {Math.round((totalSpent / (totalAllocatedBudget || 1)) * 100)}%
              </div>
              <span className="text-[10px] text-emerald-300 mt-0.5 block">Within safe limits</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#082117] border border-[#143e2f]">
              <div className="text-slate-400 text-[11px] font-semibold">Available Liquidity</div>
              <div className="text-2xl font-black text-[#d4af37] mt-1">{formatCurrency(totalRemaining)}</div>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Remaining runway</span>
            </div>
          </div>

          {/* URGENT APPROVALS QUEUE WITH 1-CLICK ACTION */}
          <div className="p-5 rounded-2xl bg-[#082117] border border-[#143e2f]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#d4af37]" />
                  <span>Requisitions Awaiting Your Authorization</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Review itemized specs and authorize or reject directly from command center:
                </p>
              </div>
              <button
                onClick={() => setActiveView('approvals')}
                className="text-xs text-[#d4af37] hover:underline font-semibold"
              >
                Go to Inbox ({pendingApprovals.length})
              </button>
            </div>

            {pendingApprovals.length === 0 ? (
              <div className="p-8 rounded-xl bg-[#051710] border border-[#143e2f] text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <div className="text-sm font-bold text-white">All Clear! No Pending Approvals</div>
                <p className="text-xs text-slate-400 mt-1">Your approval queue has been completely resolved.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingApprovals.map((req) => (
                  <div
                    key={req.id}
                    className="p-4 rounded-xl bg-[#051710] border border-[#143e2f] flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#d4af37]">{req.requestNumber}</span>
                        <span className="px-2 py-0.5 rounded-full bg-amber-950/80 text-[#d4af37] border border-[#d4af37]/40 text-[10px] font-bold">
                          Awaiting Manager Sign-Off
                        </span>
                        <span className="text-[10px] text-slate-400">Dept: {req.departmentName}</span>
                      </div>
                      <div className="text-sm font-bold text-white mt-1">{req.title}</div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        Requester: <strong>{req.requesterName}</strong> • {req.items.length} item(s) • Justification: {req.businessJustification || req.justification || 'Standard Requisition'}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end md:self-center">
                      <div className="text-right mr-2">
                        <div className="text-base font-black text-[#d4af37]">{formatCurrency(req.estimatedBudget)}</div>
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">{req.priority} Priority</div>
                      </div>

                      <button
                        onClick={() => rejectRequest(req.id, 'Budget policy requires review.')}
                        className="px-3 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 text-xs font-bold transition cursor-pointer flex items-center gap-1"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>

                      <button
                        onClick={() => approveRequest(req.id, 'Authorized in compliance with budget guidelines.')}
                        className="px-4 py-1.5 rounded-xl bg-[#d4af37] hover:bg-[#c49f2b] text-[#051b14] text-xs font-bold transition cursor-pointer flex items-center gap-1 shadow"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Authorize</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. ROLE: PROCUREMENT OFFICER */}
      {/* ========================================================================= */}
      {isProcurement && (
        <div className="space-y-6">
          {/* Procurement Quick Actions */}
          <div className="bg-[#082117] border border-[#143e2f] p-4 rounded-2xl shadow-md">
            <div className="text-xs font-bold text-[#d4af37] uppercase tracking-wider mb-3 flex items-center gap-2">
              <Zap className="w-3.5 h-3.5" />
              <span>Sourcing & PO Operations</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={() => setActiveView('rfqs')}
                className="p-3.5 rounded-xl bg-[#051710] hover:bg-[#d4af37] hover:text-[#051b14] text-slate-200 border border-[#143e2f] transition group flex items-center gap-3 cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4 text-[#d4af37] group-hover:text-[#051b14]" />
                <div className="text-left">
                  <div className="text-xs font-bold leading-tight">Create Tender / RFQ</div>
                  <div className="text-[10px] text-slate-400 group-hover:text-[#051b14]/80">Invite suppliers to bid</div>
                </div>
              </button>

              <button
                onClick={onOpenNewPO}
                className="p-3.5 rounded-xl bg-[#051710] hover:bg-[#d4af37] hover:text-[#051b14] text-slate-200 border border-[#143e2f] transition group flex items-center gap-3 cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4 text-emerald-400 group-hover:text-[#051b14]" />
                <div className="text-left">
                  <div className="text-xs font-bold leading-tight">Issue Purchase Order</div>
                  <div className="text-[10px] text-slate-400 group-hover:text-[#051b14]/80">Contractual PO binding</div>
                </div>
              </button>

              <button
                onClick={onOpenNewVendor}
                className="p-3.5 rounded-xl bg-[#051710] hover:bg-[#d4af37] hover:text-[#051b14] text-slate-200 border border-[#143e2f] transition group flex items-center gap-3 cursor-pointer"
              >
                <Users className="w-4 h-4 text-[#d4af37] group-hover:text-[#051b14]" />
                <div className="text-left">
                  <div className="text-xs font-bold leading-tight">Register Supplier</div>
                  <div className="text-[10px] text-slate-400 group-hover:text-[#051b14]/80">Onboard verified vendor</div>
                </div>
              </button>

              <button
                onClick={() => setActiveView('contracts')}
                className="p-3.5 rounded-xl bg-[#051710] hover:bg-[#d4af37] hover:text-[#051b14] text-slate-200 border border-[#143e2f] transition group flex items-center gap-3 cursor-pointer"
              >
                <FileCheck2 className="w-4 h-4 text-sky-400 group-hover:text-[#051b14]" />
                <div className="text-left">
                  <div className="text-xs font-bold leading-tight">Contract Repository</div>
                  <div className="text-[10px] text-slate-400 group-hover:text-[#051b14]/80">Master vendor agreements</div>
                </div>
              </button>
            </div>
          </div>

          {/* Sourcing Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-[#082117] border border-[#143e2f]">
              <div className="text-slate-400 text-[11px] font-semibold">Active RFQ Tenders</div>
              <div className="text-2xl font-black text-white mt-1">{rfqs.length}</div>
              <span className="text-[10px] text-slate-400 mt-0.5 block">In bidding cycle</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#082117] border border-[#143e2f]">
              <div className="text-slate-400 text-[11px] font-semibold">Bids Received</div>
              <div className="text-2xl font-black text-[#d4af37] mt-1">{bids.length}</div>
              <span className="text-[10px] text-[#d4af37] mt-0.5 block">Sealed quotes submitted</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#082117] border border-[#143e2f]">
              <div className="text-slate-400 text-[11px] font-semibold">Purchase Orders in Transit</div>
              <div className="text-2xl font-black text-sky-400 mt-1">{pendingDeliveries.length}</div>
              <span className="text-[10px] text-sky-300 mt-0.5 block">Awaiting warehouse GRN</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#082117] border border-[#143e2f]">
              <div className="text-slate-400 text-[11px] font-semibold">Active PO Commitments</div>
              <div className="text-2xl font-black text-emerald-400 mt-1">{formatCurrency(totalCommitted)}</div>
              <span className="text-[10px] text-emerald-300 mt-0.5 block">Encumbered spend</span>
            </div>
          </div>

          {/* Sourcing Pipeline Table */}
          <div className="p-5 rounded-2xl bg-[#082117] border border-[#143e2f]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-[#d4af37]" />
                <span>Active Tender Bidding Pipeline</span>
              </h3>
              <button
                onClick={() => setActiveView('rfqs')}
                className="text-xs text-[#d4af37] hover:underline font-semibold"
              >
                View RFQ Workspace
              </button>
            </div>

            <div className="space-y-3">
              {rfqs.map((rfq) => {
                const rfqBids = bids.filter((b) => b.rfqId === rfq.id);
                return (
                  <div
                    key={rfq.id}
                    onClick={() => setActiveView('rfqs')}
                    className="p-3.5 rounded-xl bg-[#051710] border border-[#143e2f] hover:border-[#d4af37]/40 cursor-pointer transition flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-white">{rfq.rfqNumber}</span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-600/40 text-[10px] font-bold">
                          {rfq.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-xs text-slate-200 font-semibold mt-1">{rfq.title}</div>
                      <div className="text-[11px] text-slate-400">
                        Closing: {rfq.closingDate} • {rfqBids.length} Vendor Quotes Received
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-[#d4af37]">{formatCurrency(rfq.estimatedBudget || 0)}</div>
                      <span className="text-[10px] text-emerald-400 font-bold block mt-0.5">Evaluate Bids →</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. ROLE: FINANCE COMPTROLLER */}
      {/* ========================================================================= */}
      {isFinance && (
        <div className="space-y-6">
          {/* Finance Quick Actions */}
          <div className="bg-[#082117] border border-[#143e2f] p-4 rounded-2xl shadow-md">
            <div className="text-xs font-bold text-[#d4af37] uppercase tracking-wider mb-3 flex items-center gap-2">
              <Zap className="w-3.5 h-3.5" />
              <span>Treasury & Accounts Payable Actions</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={onOpenNewInvoice}
                className="p-3.5 rounded-xl bg-[#051710] hover:bg-[#d4af37] hover:text-[#051b14] text-slate-200 border border-[#143e2f] transition group flex items-center gap-3 cursor-pointer"
              >
                <CreditCard className="w-4 h-4 text-[#d4af37] group-hover:text-[#051b14]" />
                <div className="text-left">
                  <div className="text-xs font-bold leading-tight">Enter Vendor Invoice</div>
                  <div className="text-[10px] text-slate-400 group-hover:text-[#051b14]/80">Register payable bill</div>
                </div>
              </button>

              <button
                onClick={() => setActiveView('finance')}
                className="p-3.5 rounded-xl bg-[#051710] hover:bg-[#d4af37] hover:text-[#051b14] text-slate-200 border border-[#143e2f] transition group flex items-center gap-3 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400 group-hover:text-[#051b14]" />
                <div className="text-left">
                  <div className="text-xs font-bold leading-tight">Run 3-Way Match Check</div>
                  <div className="text-[10px] text-slate-400 group-hover:text-[#051b14]/80">PO vs GRN vs Invoice audit</div>
                </div>
              </button>

              <button
                onClick={() => setActiveView('budgets')}
                className="p-3.5 rounded-xl bg-[#051710] hover:bg-[#d4af37] hover:text-[#051b14] text-slate-200 border border-[#143e2f] transition group flex items-center gap-3 cursor-pointer"
              >
                <DollarSign className="w-4 h-4 text-[#d4af37] group-hover:text-[#051b14]" />
                <div className="text-left">
                  <div className="text-xs font-bold leading-tight">Cost Center Ledgers</div>
                  <div className="text-[10px] text-slate-400 group-hover:text-[#051b14]/80">Audit department balances</div>
                </div>
              </button>

              <button
                onClick={() => setActiveView('audit')}
                className="p-3.5 rounded-xl bg-[#051710] hover:bg-[#d4af37] hover:text-[#051b14] text-slate-200 border border-[#143e2f] transition group flex items-center gap-3 cursor-pointer"
              >
                <ShieldAlert className="w-4 h-4 text-sky-400 group-hover:text-[#051b14]" />
                <div className="text-left">
                  <div className="text-xs font-bold leading-tight">Immutable Audit Log</div>
                  <div className="text-[10px] text-slate-400 group-hover:text-[#051b14]/80">SoD & compliance records</div>
                </div>
              </button>
            </div>
          </div>

          {/* Finance Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-[#082117] border border-[#143e2f]">
              <div className="text-slate-400 text-[11px] font-semibold">Matched Invoices Ready</div>
              <div className="text-2xl font-black text-emerald-400 mt-1">
                {invoices.filter((i) => i.status === 'approved' || i.threeWayMatch?.isMatched).length}
              </div>
              <span className="text-[10px] text-emerald-300 mt-0.5 block">Cleared for disbursement</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#082117] border border-rose-500/30 bg-rose-950/10">
              <div className="text-rose-400 text-[11px] font-semibold">3-Way Match Exceptions</div>
              <div className="text-2xl font-black text-rose-400 mt-1">
                {invoices.filter((i) => i.status === 'exception').length || activeExceptions.length}
              </div>
              <span className="text-[10px] text-rose-300 mt-0.5 block">Discrepancy locked</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#082117] border border-[#143e2f]">
              <div className="text-slate-400 text-[11px] font-semibold">Total Settled Spend</div>
              <div className="text-2xl font-black text-white mt-1">{formatCurrency(totalSpent)}</div>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Disbursed cash outflow</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#082117] border border-[#143e2f]">
              <div className="text-slate-400 text-[11px] font-semibold">Available Liquidity</div>
              <div className="text-2xl font-black text-[#d4af37] mt-1">{formatCurrency(totalRemaining)}</div>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Uncommitted capital</span>
            </div>
          </div>

          {/* Invoices Pending 3-Way Match Clearance */}
          <div className="p-5 rounded-2xl bg-[#082117] border border-[#143e2f]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#d4af37]" />
                <span>Invoices in 3-Way Match Verification</span>
              </h3>
              <button
                onClick={() => setActiveView('finance')}
                className="text-xs text-[#d4af37] hover:underline font-semibold"
              >
                Open Finance Hub
              </button>
            </div>

            <div className="space-y-3">
              {invoices.slice(0, 4).map((inv) => (
                <div
                  key={inv.id}
                  onClick={() => setActiveView('finance')}
                  className="p-3.5 rounded-xl bg-[#051710] border border-[#143e2f] hover:border-[#d4af37]/40 cursor-pointer transition flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-white">{inv.invoiceNumber}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          inv.status === 'paid'
                            ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-600/40'
                            : inv.status === 'exception'
                            ? 'bg-rose-950/80 text-rose-300 border border-rose-600/40'
                            : 'bg-sky-950/80 text-sky-400 border border-sky-600/40'
                        }`}
                      >
                        {inv.status === 'paid' ? 'PAID' : inv.status === 'exception' ? 'MISMATCH EXCEPTION' : 'MATCHED'}
                      </span>
                    </div>
                    <div className="text-xs text-slate-300 font-semibold mt-1">{inv.vendorName}</div>
                    <div className="text-[11px] text-slate-400">PO Ref: {inv.poNumber} • Due: {inv.dueDate}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-[#d4af37]">{formatCurrency(inv.totalAmount)}</div>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Audit details →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. ROLE: BUSINESS OWNER / ADMINISTRATOR */}
      {/* ========================================================================= */}
      {isOwnerOrAdmin && (
        <div className="space-y-6">
          {/* Master Operational & Financial Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#082117] border border-[#143e2f]">
              <span className="text-xs font-semibold text-slate-400 block mb-1">Total Organization Budget</span>
              <div className="text-2xl font-black text-white">{formatCurrency(totalAllocatedBudget)}</div>
              <div className="text-[11px] text-slate-400 mt-1">Authorized for fiscal year</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#082117] border border-[#143e2f]">
              <span className="text-xs font-semibold text-slate-400 block mb-1">Encumbered in Flight (POs)</span>
              <div className="text-2xl font-black text-[#d4af37]">{formatCurrency(totalCommitted)}</div>
              <div className="text-[11px] text-slate-400 mt-1">
                {Math.round((totalCommitted / (totalAllocatedBudget || 1)) * 100)}% committed
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#082117] border border-[#143e2f]">
              <span className="text-xs font-semibold text-slate-400 block mb-1">{t('totalSpend')}</span>
              <div className="text-2xl font-black text-emerald-400">{formatCurrency(totalSpent)}</div>
              <div className="text-[11px] text-emerald-300 mt-1">Disbursed and audited</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#082117] border border-[#143e2f]">
              <span className="text-xs font-semibold text-slate-400 block mb-1">Uncommitted Liquidity</span>
              <div className="text-2xl font-black text-[#d4af37]">{formatCurrency(totalRemaining)}</div>
              <div className="text-[11px] text-slate-400 mt-1">Free purchasing power</div>
            </div>
          </div>

          {/* Master Quick Actions */}
          <div className="bg-[#082117] border border-[#143e2f] p-4 rounded-2xl shadow-md">
            <div className="text-xs font-bold text-[#d4af37] uppercase tracking-wider mb-3 flex items-center gap-2">
              <Zap className="w-3.5 h-3.5" />
              <span>Executive Quick Command</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              <button
                onClick={onOpenNewRequest}
                className="p-3 rounded-xl bg-[#051710] hover:bg-[#d4af37] hover:text-[#051b14] text-slate-200 text-left border border-[#143e2f] transition group cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[#d4af37] group-hover:text-[#051b14] mb-1" />
                <span className="text-xs font-bold block">{t('newRequest')}</span>
              </button>

              <button
                onClick={onOpenNewPO}
                className="p-3 rounded-xl bg-[#051710] hover:bg-[#d4af37] hover:text-[#051b14] text-slate-200 text-left border border-[#143e2f] transition group cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4 text-emerald-400 group-hover:text-[#051b14] mb-1" />
                <span className="text-xs font-bold block">{t('createPO')}</span>
              </button>

              <button
                onClick={onOpenNewVendor}
                className="p-3 rounded-xl bg-[#051710] hover:bg-[#d4af37] hover:text-[#051b14] text-slate-200 text-left border border-[#143e2f] transition group cursor-pointer"
              >
                <Users className="w-4 h-4 text-[#d4af37] group-hover:text-[#051b14] mb-1" />
                <span className="text-xs font-bold block">{t('addVendor')}</span>
              </button>

              <button
                onClick={onOpenNewInvoice}
                className="p-3 rounded-xl bg-[#051710] hover:bg-[#d4af37] hover:text-[#051b14] text-slate-200 text-left border border-[#143e2f] transition group cursor-pointer"
              >
                <CreditCard className="w-4 h-4 text-amber-400 group-hover:text-[#051b14] mb-1" />
                <span className="text-xs font-bold block">{t('enterInvoice')}</span>
              </button>

              <button
                onClick={() => setActiveView('analytics')}
                className="p-3 rounded-xl bg-[#051710] hover:bg-[#d4af37] hover:text-[#051b14] text-slate-200 text-left border border-[#143e2f] transition group cursor-pointer"
              >
                <TrendingUp className="w-4 h-4 text-sky-400 group-hover:text-[#051b14] mb-1" />
                <span className="text-xs font-bold block">Spend Analytics</span>
              </button>
            </div>
          </div>

          {/* Operational Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div
              onClick={() => setActiveView('requests')}
              className="p-4 rounded-2xl bg-[#082117] border border-[#143e2f] hover:border-[#d4af37]/40 cursor-pointer transition"
            >
              <div className="text-slate-400 text-[11px] font-semibold">Active Requests</div>
              <div className="text-2xl font-bold text-white mt-1">{activeRequests.length}</div>
              <span className="text-[10px] text-slate-400 mt-1 block">In lifecycle</span>
            </div>

            <div
              onClick={() => setActiveView('approvals')}
              className="p-4 rounded-2xl bg-[#082117] border border-[#143e2f] hover:border-[#d4af37]/40 cursor-pointer transition"
            >
              <div className="text-slate-400 text-[11px] font-semibold">{t('pendingApprovals')}</div>
              <div className="text-2xl font-bold text-[#d4af37] mt-1">{pendingApprovals.length}</div>
              <span className="text-[10px] text-[#d4af37] mt-1 block">Pending sign-off</span>
            </div>

            <div
              onClick={() => setActiveView('orders')}
              className="p-4 rounded-2xl bg-[#082117] border border-[#143e2f] hover:border-[#d4af37]/40 cursor-pointer transition"
            >
              <div className="text-slate-400 text-[11px] font-semibold">Open POs</div>
              <div className="text-2xl font-bold text-white mt-1">{activePOs.length}</div>
              <span className="text-[10px] text-slate-400 mt-1 block">In fulfillment</span>
            </div>

            <div
              onClick={() => setActiveView('deliveries')}
              className="p-4 rounded-2xl bg-[#082117] border border-[#143e2f] hover:border-[#d4af37]/40 cursor-pointer transition"
            >
              <div className="text-slate-400 text-[11px] font-semibold">In Transit</div>
              <div className="text-2xl font-bold text-sky-400 mt-1">{pendingDeliveries.length}</div>
              <span className="text-[10px] text-sky-300 mt-1 block">Pending receipt</span>
            </div>

            <div
              onClick={() => setActiveView('finance')}
              className="p-4 rounded-2xl bg-[#082117] border border-[#143e2f] hover:border-[#d4af37]/40 cursor-pointer transition"
            >
              <div className="text-slate-400 text-[11px] font-semibold">Matched Invoices</div>
              <div className="text-2xl font-bold text-emerald-400 mt-1">
                {invoices.filter((i) => i.threeWayMatch?.isMatched).length}
              </div>
              <span className="text-[10px] text-emerald-300 mt-1 block">3-Way verified</span>
            </div>

            <div
              onClick={() => setActiveView('exceptions')}
              className="p-4 rounded-2xl bg-[#082117] border border-rose-500/30 hover:border-rose-500/50 cursor-pointer transition"
            >
              <div className="text-slate-400 text-[11px] font-semibold">Exceptions</div>
              <div className="text-2xl font-bold text-rose-400 mt-1">{activeExceptions.length}</div>
              <span className="text-[10px] text-rose-400/80 mt-1 block">Action needed</span>
            </div>
          </div>

          {/* Master Table Split */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-[#143e2f] bg-[#082117] p-5 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#d4af37]" />
                  <span>Recent Organization Requests</span>
                </h3>
                <button
                  onClick={() => setActiveView('requests')}
                  className="text-xs text-[#d4af37] hover:underline font-semibold"
                >
                  View All ({requests.length})
                </button>
              </div>

              <div className="space-y-2.5">
                {requests.slice(0, 4).map((r) => (
                  <div
                    key={r.id}
                    onClick={() => setActiveView('requests')}
                    className="p-3 rounded-xl bg-[#051710] border border-[#143e2f] hover:border-[#d4af37]/40 cursor-pointer transition flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-white">{r.requestNumber}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            r.status === 'approved'
                              ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-600/40'
                              : r.status === 'pending_approval'
                              ? 'bg-amber-950/80 text-[#d4af37] border border-[#d4af37]/40'
                              : 'bg-[#0c2d20] text-slate-300'
                          }`}
                        >
                          {r.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-xs text-slate-300 font-medium mt-0.5">{r.title}</div>
                      <div className="text-[11px] text-slate-400">{r.departmentName || 'General'} • By {r.requesterName}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-[#d4af37]">{formatCurrency(r.estimatedBudget)}</div>
                      <div className="text-[10px] text-slate-400 capitalize">{r.priority} Priority</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-[#143e2f] bg-[#082117] p-5 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-emerald-400" />
                  <span>Purchase Orders & Deliveries</span>
                </h3>
                <button
                  onClick={() => setActiveView('orders')}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
                >
                  View All ({purchaseOrders.length})
                </button>
              </div>

              <div className="space-y-2.5">
                {purchaseOrders.slice(0, 4).map((po) => (
                  <div
                    key={po.id}
                    onClick={() => setActiveView('orders')}
                    className="p-3 rounded-xl bg-[#051710] border border-[#143e2f] hover:border-emerald-500/40 cursor-pointer transition flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-white">{po.poNumber}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            po.status === 'fully_received'
                              ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-600/40'
                              : po.status === 'in_transit'
                              ? 'bg-sky-950/80 text-sky-400 border border-sky-600/40'
                              : 'bg-amber-950/80 text-[#d4af37] border border-[#d4af37]/40'
                          }`}
                        >
                          {po.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-xs text-slate-300 font-medium mt-0.5">{po.vendorName}</div>
                      <div className="text-[11px] text-slate-400">ETA: {po.expectedDeliveryDate}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-[#d4af37]">{formatCurrency(po.totalAmount)}</div>
                      <div className="text-[10px] text-slate-400">{po.items.length} line items</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
