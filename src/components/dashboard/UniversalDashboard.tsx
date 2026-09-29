import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  Clock,
  CreditCard,
  FileCheck2,
  FileSpreadsheet,
  FileText,
  Package,
  Plus,
  ShieldAlert,
  ShoppingCart,
  TrendingUp,
  Truck,
  Users,
  Zap,
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
    t,
  } = useApp();

  // Metrics computation
  const activeRequests = requests.filter((r) => r.status !== 'completed' && r.status !== 'rejected');
  const pendingApprovals = requests.filter((r) => r.status === 'pending_approval');
  const activePOs = purchaseOrders.filter((p) => p.status === 'issued' || p.status === 'in_transit');
  const pendingDeliveries = purchaseOrders.filter(
    (p) => p.status === 'in_transit' || p.status === 'partially_received'
  );
  const exceptionInvoices = invoices.filter((i) => i.status === 'exception');
  const activeExceptions = exceptions.filter((ex) => !ex.resolved);

  const totalAllocatedBudget = budgets.reduce((acc, b) => acc + b.allocatedAmount, 0);
  const totalCommitted = budgets.reduce((acc, b) => acc + b.committedAmount, 0);
  const totalSpent = budgets.reduce((acc, b) => acc + b.spentAmount, 0);
  const totalRemaining = budgets.reduce((acc, b) => acc + b.remainingAmount, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900/90 to-indigo-950/40 p-5 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {orgConfig.name}
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[11px] font-semibold">
              {orgConfig.businessType.replace('_', ' ').toUpperCase()}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Procurement Command Center • Logged in as <strong className="text-slate-200">{currentUser.name}</strong> ({currentUser.role.replace('_', ' ')})
          </p>
        </div>

        {/* Quick Mode Status Badge */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Workflow: <strong>{orgConfig.approvalWorkflow.replace('_', ' ')}</strong></span>
          </div>
        </div>
      </div>

      {/* NEEDS YOUR ATTENTION SECTION (Mandatory per specification) */}
      {activeExceptions.length > 0 && (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-950/20 p-5 shadow-lg shadow-rose-950/10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white tracking-wide uppercase">
                  {t('needsAttention')}
                </h2>
                <p className="text-[11px] text-rose-300/80">
                  {activeExceptions.length} high-priority operational items require intervention
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveView('exceptions')}
              className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1"
            >
              <span>View All in Exception Center</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 mt-3">
            {activeExceptions.slice(0, 4).map((ex) => (
              <button
                key={ex.id}
                onClick={() => {
                  if (ex.entityType === 'invoice') setActiveView('finance');
                  else if (ex.entityType === 'po') setActiveView('orders');
                  else if (ex.entityType === 'vendor') setActiveView('vendors');
                  else if (ex.entityType === 'inventory') setActiveView('inventory');
                  else setActiveView('exceptions');
                }}
                className="p-3 rounded-xl bg-slate-900/90 border border-rose-500/20 hover:border-rose-500/50 text-left transition flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] mb-1">
                    <span className="font-bold text-rose-400 uppercase tracking-wider">{ex.type.replace('_', ' ')}</span>
                    <span className="text-slate-400">{ex.severity}</span>
                  </div>
                  <div className="text-xs font-semibold text-white group-hover:text-rose-200 transition line-clamp-1">
                    {ex.title}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {ex.description}
                  </div>
                </div>
                <div className="text-[10px] text-rose-400 font-bold mt-2 flex items-center gap-1">
                  <span>Take Action</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* QUICK ACTIONS BAR (Contextual to user role & config) */}
      <div className="bg-slate-900/70 border border-slate-800 p-4 rounded-2xl">
        <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>{t('quickActions')}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          <button
            onClick={onOpenNewRequest}
            className="p-3 rounded-xl bg-slate-800/90 hover:bg-indigo-600 hover:text-white text-slate-200 text-left border border-slate-700/60 transition group flex flex-col justify-between"
          >
            <Plus className="w-4 h-4 text-indigo-400 group-hover:text-white mb-2" />
            <span className="text-xs font-bold leading-tight">{t('newRequest')}</span>
          </button>

          {orgConfig.hasRfqs && (
            <button
              onClick={() => setActiveView('rfqs')}
              className="p-3 rounded-xl bg-slate-800/90 hover:bg-indigo-600 hover:text-white text-slate-200 text-left border border-slate-700/60 transition group flex flex-col justify-between"
            >
              <FileSpreadsheet className="w-4 h-4 text-sky-400 group-hover:text-white mb-2" />
              <span className="text-xs font-bold leading-tight">{t('createRfq')}</span>
            </button>
          )}

          {orgConfig.hasSuppliers && (
            <button
              onClick={onOpenNewVendor}
              className="p-3 rounded-xl bg-slate-800/90 hover:bg-indigo-600 hover:text-white text-slate-200 text-left border border-slate-700/60 transition group flex flex-col justify-between"
            >
              <Users className="w-4 h-4 text-teal-400 group-hover:text-white mb-2" />
              <span className="text-xs font-bold leading-tight">{t('addVendor')}</span>
            </button>
          )}

          <button
            onClick={onOpenNewPO}
            className="p-3 rounded-xl bg-slate-800/90 hover:bg-indigo-600 hover:text-white text-slate-200 text-left border border-slate-700/60 transition group flex flex-col justify-between"
          >
            <ShoppingCart className="w-4 h-4 text-emerald-400 group-hover:text-white mb-2" />
            <span className="text-xs font-bold leading-tight">{t('createPO')}</span>
          </button>

          {orgConfig.hasPhysicalGoods && (
            <button
              onClick={onOpenNewGRN}
              className="p-3 rounded-xl bg-slate-800/90 hover:bg-indigo-600 hover:text-white text-slate-200 text-left border border-slate-700/60 transition group flex flex-col justify-between"
            >
              <Truck className="w-4 h-4 text-amber-400 group-hover:text-white mb-2" />
              <span className="text-xs font-bold leading-tight">{t('recordReceipt')}</span>
            </button>
          )}

          {orgConfig.hasInvoicesPayments && (
            <button
              onClick={onOpenNewInvoice}
              className="p-3 rounded-xl bg-slate-800/90 hover:bg-indigo-600 hover:text-white text-slate-200 text-left border border-slate-700/60 transition group flex flex-col justify-between"
            >
              <CreditCard className="w-4 h-4 text-purple-400 group-hover:text-white mb-2" />
              <span className="text-xs font-bold leading-tight">{t('uploadInvoice')}</span>
            </button>
          )}

          {orgConfig.approvalWorkflow !== 'none' && (
            <button
              onClick={() => setActiveView('approvals')}
              className="p-3 rounded-xl bg-slate-800/90 hover:bg-indigo-600 hover:text-white text-slate-200 text-left border border-slate-700/60 transition group flex flex-col justify-between"
            >
              <CheckCircle className="w-4 h-4 text-rose-400 group-hover:text-white mb-2" />
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-bold leading-tight">{t('reviewApprovals')}</span>
                {pendingApprovals.length > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                    {pendingApprovals.length}
                  </span>
                )}
              </div>
            </button>
          )}
        </div>
      </div>

      {/* FINANCIAL OVERVIEW SECTION */}
      {orgConfig.hasBudgets && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-xs font-semibold text-slate-400 block mb-1">Approved Annual Budget</span>
            <div className="text-2xl font-black text-white">{formatCurrency(totalAllocatedBudget)}</div>
            <div className="text-[11px] text-slate-500 mt-1">Across all authorized cost centers</div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-xs font-semibold text-slate-400 block mb-1">Committed in Flight (POs)</span>
            <div className="text-2xl font-black text-amber-400">{formatCurrency(totalCommitted)}</div>
            <div className="text-[11px] text-slate-400 mt-1">
              {Math.round((totalCommitted / (totalAllocatedBudget || 1)) * 100)}% of total budget encumbered
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-xs font-semibold text-slate-400 block mb-1">{t('totalSpend')}</span>
            <div className="text-2xl font-black text-indigo-400">{formatCurrency(totalSpent)}</div>
            <div className="text-[11px] text-emerald-400 mt-1">Invoices settled & disbursed</div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-xs font-semibold text-slate-400 block mb-1">Remaining Liquidity</span>
            <div className="text-2xl font-black text-emerald-400">{formatCurrency(totalRemaining)}</div>
            <div className="text-[11px] text-slate-400 mt-1">Uncommitted available purchasing power</div>
          </div>
        </div>
      )}

      {/* OPERATIONAL METRICS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div
          onClick={() => setActiveView('requests')}
          className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer transition"
        >
          <div className="text-slate-400 text-[11px] font-semibold">Active Requests</div>
          <div className="text-2xl font-bold text-white mt-1">{activeRequests.length}</div>
          <span className="text-[10px] text-slate-400 mt-1 block">In lifecycle</span>
        </div>

        {orgConfig.approvalWorkflow !== 'none' && (
          <div
            onClick={() => setActiveView('approvals')}
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer transition"
          >
            <div className="text-slate-400 text-[11px] font-semibold">{t('pendingApprovals')}</div>
            <div className="text-2xl font-bold text-rose-400 mt-1">{pendingApprovals.length}</div>
            <span className="text-[10px] text-rose-400/80 mt-1 block">Requires action</span>
          </div>
        )}

        <div
          onClick={() => setActiveView('orders')}
          className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer transition"
        >
          <div className="text-slate-400 text-[11px] font-semibold">{t('activePOs')}</div>
          <div className="text-2xl font-bold text-sky-400 mt-1">{activePOs.length}</div>
          <span className="text-[10px] text-slate-400 mt-1 block">Issued & in delivery</span>
        </div>

        {orgConfig.hasPhysicalGoods && (
          <div
            onClick={() => setActiveView('deliveries')}
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer transition"
          >
            <div className="text-slate-400 text-[11px] font-semibold">{t('pendingReceipts')}</div>
            <div className="text-2xl font-bold text-amber-400 mt-1">{pendingDeliveries.length}</div>
            <span className="text-[10px] text-slate-400 mt-1 block">Shipments tracked</span>
          </div>
        )}

        {orgConfig.hasInvoicesPayments && (
          <div
            onClick={() => setActiveView('finance')}
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer transition"
          >
            <div className="text-slate-400 text-[11px] font-semibold">{t('discrepancies')}</div>
            <div className="text-2xl font-bold text-purple-400 mt-1">{exceptionInvoices.length}</div>
            <span className="text-[10px] text-purple-300/80 mt-1 block">3-way mismatch</span>
          </div>
        )}

        {orgConfig.hasRfqs && (
          <div
            onClick={() => setActiveView('rfqs')}
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer transition"
          >
            <div className="text-slate-400 text-[11px] font-semibold">Active Tenders</div>
            <div className="text-2xl font-bold text-teal-400 mt-1">{rfqs.length}</div>
            <span className="text-[10px] text-slate-400 mt-1 block">{bids.length} bids received</span>
          </div>
        )}
      </div>

      {/* RECENT REQUESTS & PURCHASE ORDERS TABLE SPLIT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Requests */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" />
              <span>Recent Procurement Requests</span>
            </h3>
            <button
              onClick={() => setActiveView('requests')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              View All ({requests.length})
            </button>
          </div>

          <div className="space-y-2.5">
            {requests.slice(0, 4).map((r) => (
              <div
                key={r.id}
                onClick={() => setActiveView('requests')}
                className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-indigo-500/40 cursor-pointer transition flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-white">{r.requestNumber}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        r.status === 'approved'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : r.status === 'pending_approval'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {r.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-xs text-slate-300 font-medium mt-0.5">{r.title}</div>
                  <div className="text-[11px] text-slate-500">{r.departmentName || 'General'} • By {r.requesterName}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-white">{formatCurrency(r.estimatedBudget)}</div>
                  <div className="text-[10px] text-slate-500 capitalize">{r.priority} Priority</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Purchase Orders & Shipments */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
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
                className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-emerald-500/40 cursor-pointer transition flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-white">{po.poNumber}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        po.status === 'fully_received'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : po.status === 'in_transit'
                          ? 'bg-sky-500/20 text-sky-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      {po.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-xs text-slate-300 font-medium mt-0.5">{po.vendorName}</div>
                  <div className="text-[11px] text-slate-500">ETA: {po.expectedDeliveryDate}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-white">{formatCurrency(po.totalAmount)}</div>
                  <div className="text-[10px] text-slate-400">{po.items.length} line items</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
