import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Invoice,
  PaymentRecord,
} from '../../types';
import {
  CreditCard,
  DollarSign,
  Plus,
  Search,
  CheckCircle,
  AlertTriangle,
  FileText,
  ShieldCheck,
  Send,
  Eye,
  Layers,
  ArrowRight,
  TrendingDown,
  Building,
} from 'lucide-react';

export const FinanceAndThreeWayMatchView: React.FC<{
  isOpenNewInvoice: boolean;
  setIsOpenNewInvoice: (open: boolean) => void;
}> = ({ isOpenNewInvoice, setIsOpenNewInvoice }) => {
  const {
    invoices,
    purchaseOrders,
    goodsReceipts,
    payments,
    budgets,
    createInvoice,
    approveInvoice,
    processPayment,
    formatCurrency,
    orgConfig,
    t,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'invoices' | 'payments' | 'budgets'>('invoices');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [payModalInvoice, setPayModalInvoice] = useState<Invoice | null>(null);
  const [payMethod, setPayMethod] = useState<'bank_transfer' | 'credit_card' | 'check'>('bank_transfer');
  const [txnRef, setTxnRef] = useState(`WIRE-${Date.now().toString().slice(-8)}`);

  // New Invoice Form
  const [selectedPOId, setSelectedPOId] = useState(purchaseOrders[0]?.id || '');
  const [vendorInvNum, setVendorInvNum] = useState('INV-VEN-7701');
  const [billedAmount, setBilledAmount] = useState<number>(3643.75);
  const [billedQty, setBilledQty] = useState<number>(20);

  const selectedPO = purchaseOrders.find((p) => p.id === selectedPOId) || purchaseOrders[0];

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPO) return;

    const subtotal = billedAmount;
    const taxAmount = (subtotal * orgConfig.taxRate) / 100;

    createInvoice({
      vendorInvoiceNumber: vendorInvNum,
      purchaseOrderId: selectedPO.id,
      poNumber: selectedPO.poNumber,
      vendorId: selectedPO.vendorId,
      vendorName: selectedPO.vendorName,
      subtotal,
      taxAmount,
      totalAmount: subtotal + taxAmount,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      items: [
        {
          id: `inv_i_${Date.now()}`,
          description: selectedPO.items[0]?.description || 'Procured Material',
          quantityBilled: billedQty,
          unitPrice: selectedPO.items[0]?.unitPrice || 100,
          totalPrice: subtotal,
        },
      ],
    });

    setIsOpenNewInvoice(false);
  };

  const handleExecutePayment = () => {
    if (!payModalInvoice) return;

    processPayment({
      invoiceId: payModalInvoice.id,
      invoiceNumber: payModalInvoice.invoiceNumber,
      vendorId: payModalInvoice.vendorId,
      vendorName: payModalInvoice.vendorName,
      amount: payModalInvoice.totalAmount,
      paymentMethod: payMethod,
      transactionReference: txnRef,
    });

    setPayModalInvoice(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Finance & Automated Three-Way Matching
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Automated verification of Purchase Orders vs Goods Receipts vs Invoices before payment disbursement.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('invoices')}
              className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                activeTab === 'invoices' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Invoices ({invoices.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                activeTab === 'payments' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Disbursements ({payments.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('budgets')}
              className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                activeTab === 'budgets' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Budgets & Cost Centers</span>
            </button>
          </div>

          <button
            onClick={() => setIsOpenNewInvoice(true)}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Invoice</span>
          </button>
        </div>
      </div>

      {activeTab === 'invoices' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            {invoices.map((inv) => {
              const isMatched = inv.threeWayMatch.isMatched;
              const isSelected = selectedInvoice?.id === inv.id;
              return (
                <div
                  key={inv.id}
                  onClick={() => setSelectedInvoice(inv)}
                  className={`p-5 rounded-2xl border cursor-pointer transition text-left ${
                    isSelected
                      ? 'border-indigo-500 bg-slate-900 shadow-lg shadow-indigo-500/10'
                      : 'border-slate-800 bg-slate-900/80 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-white">{inv.invoiceNumber}</span>
                        {isMatched ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" /> 3-Way Matched
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 text-[10px] font-bold flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> Discrepancy Exception
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-bold capitalize">
                          {inv.status}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-white mt-1">{inv.vendorName}</h3>
                      <div className="text-[11px] text-slate-400">
                        Vendor Ref: {inv.vendorInvoiceNumber} • Linked PO: {inv.poNumber}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-base font-black text-white">{formatCurrency(inv.totalAmount)}</div>
                      <span className="text-[10px] text-slate-500">Due: {inv.dueDate}</span>
                    </div>
                  </div>

                  {!isMatched && (
                    <div className="mt-2 p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/20 text-xs text-rose-300">
                      ⚠️ <strong>Match Warning:</strong> {inv.threeWayMatch.discrepancyNote}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* 3-WAY MATCH INSPECTION SIDEBAR DRAWER (Mandatory per specification) */}
          <div className="lg:col-span-1">
            {selectedInvoice ? (
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-4 shadow-xl">
                <div className="pb-3 border-b border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    Three-Way Match Verification Engine
                  </span>
                  <h3 className="text-sm font-bold text-white mt-0.5">{selectedInvoice.invoiceNumber}</h3>
                  <div className="text-xs text-slate-400">{selectedInvoice.vendorName}</div>
                </div>

                {/* Side-by-side audit checks */}
                <div className="space-y-2.5 text-xs">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-white block">1. PO Authorization Check</span>
                      <span className="text-[11px] text-slate-400">PO: {selectedInvoice.poNumber}</span>
                    </div>
                    <span className="text-emerald-400 font-bold">Passed</span>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-white block">2. Goods Receipt (GRN) Audit</span>
                      <span className="text-[11px] text-slate-400">GRN: {selectedInvoice.grnNumber || 'Pending GRN'}</span>
                    </div>
                    <span
                      className={`font-bold ${
                        selectedInvoice.threeWayMatch.hasGrn ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {selectedInvoice.threeWayMatch.hasGrn ? 'Verified' : 'Missing'}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-white block">3. Quantity & Price Match</span>
                      <span className="text-[11px] text-slate-400">Tolerance: 0% variance</span>
                    </div>
                    <span
                      className={`font-bold ${
                        selectedInvoice.threeWayMatch.isMatched ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {selectedInvoice.threeWayMatch.isMatched ? 'Passed' : 'Exception'}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-slate-800 space-y-2">
                  {selectedInvoice.status !== 'paid' && (
                    <button
                      onClick={() => setPayModalInvoice(selectedInvoice)}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#d4af37] hover:bg-[#c49f2b] text-[#051b14] font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Authorize & Release Payment</span>
                    </button>
                  )}

                  {selectedInvoice.status === 'paid' && (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs text-center font-bold">
                      ✓ Invoice Settled & Cleared
                    </div>
                  )}

                  {!selectedInvoice.threeWayMatch.isMatched && selectedInvoice.status !== 'approved' && (
                    <button
                      onClick={() => approveInvoice(selectedInvoice.id)}
                      className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                    >
                      Management Override (Approve Anyway)
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-8 rounded-2xl border border-slate-800/80 bg-slate-900/30 text-center text-xs text-slate-500">
                Select an invoice on the left to review the Three-Way Matching comparison between PO, GRN, and billed lines.
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'payments' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white">Disbursement Settlement Ledger</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Verified corporate payments cleared against Three-Way Matched invoices.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                  <th className="pb-3">Disbursement #</th>
                  <th className="pb-3">Vendor</th>
                  <th className="pb-3">Invoice #</th>
                  <th className="pb-3">Payment Method</th>
                  <th className="pb-3">Transaction Reference</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3 text-right">Amount Cleared</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {payments.map((p) => (
                  <tr key={p.id} className="text-slate-300">
                    <td className="py-3.5 font-mono font-bold text-indigo-400">{p.paymentNumber}</td>
                    <td className="py-3.5 font-bold text-white">{p.vendorName}</td>
                    <td className="py-3.5 font-mono text-slate-400">{p.invoiceNumber}</td>
                    <td className="py-3.5 capitalize">{p.paymentMethod.replace('_', ' ')}</td>
                    <td className="py-3.5 font-mono text-[11px] text-slate-400">{p.transactionReference}</td>
                    <td className="py-3.5">{p.paymentDate}</td>
                    <td className="py-3.5 text-right font-black text-emerald-400 font-mono">
                      {formatCurrency(p.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'budgets' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgets.map((b) => {
            const spentPct = Math.round((b.spentAmount / b.allocatedAmount) * 100);
            const committedPct = Math.round((b.committedAmount / b.allocatedAmount) * 100);
            return (
              <div key={b.id} className="p-5 rounded-2xl border border-slate-800 bg-slate-900 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-indigo-400">{b.code}</span>
                  <span className="text-slate-400">{b.fiscalYear}</span>
                </div>

                <h3 className="text-sm font-bold text-white">{b.name}</h3>
                <div className="text-[11px] text-slate-500">Category: {b.category}</div>

                <div className="pt-2">
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-400">Total Allocated</span>
                    <span className="text-white font-mono">{formatCurrency(b.allocatedAmount)}</span>
                  </div>

                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden flex border border-slate-800">
                    <div className="bg-indigo-500 h-full" style={{ width: `${spentPct}%` }} />
                    <div className="bg-amber-500 h-full" style={{ width: `${committedPct}%` }} />
                  </div>

                  <div className="flex justify-between text-[11px] text-slate-500 mt-2">
                    <span>Spent: {spentPct}%</span>
                    <span>Committed: {committedPct}%</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex justify-between text-xs">
                  <span className="text-slate-400">Remaining Liquidity:</span>
                  <span className="font-bold text-emerald-400">{formatCurrency(b.remainingAmount)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DISBURSEMENT / PAYMENT MODAL */}
      {payModalInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-left">
            <h3 className="text-sm font-bold text-white">Release Payment for {payModalInvoice.invoiceNumber}</h3>
            <p className="text-xs text-slate-400 mt-1">
              Recipient: <strong className="text-white">{payModalInvoice.vendorName}</strong>
            </p>

            <div className="my-4 p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <span className="text-xs text-slate-400">Total Settlement Value</span>
              <div className="text-2xl font-black text-white mt-0.5">
                {formatCurrency(payModalInvoice.totalAmount)}
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Payment Channel</label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="bank_transfer">Direct Corporate Wire / SWIFT</option>
                  <option value="credit_card">Corporate Purchasing Card</option>
                  <option value="check">Certified Commercial Bank Draft</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Transaction Reference</label>
                <input
                  type="text"
                  value={txnRef}
                  onChange={(e) => setTxnRef(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setPayModalInvoice(null)}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleExecutePayment}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md"
              >
                Confirm Wire Release
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE INVOICE MODAL */}
      {isOpenNewInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 text-left my-8">
            <h2 className="text-base font-bold text-white mb-1">Upload / Register Supplier Invoice</h2>
            <p className="text-xs text-slate-400 mb-5">
              The Three-Way Matching engine will automatically compare the line items against the Purchase Order and Goods Receipt.
            </p>

            <form onSubmit={handleCreateInvoice} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Associated Purchase Order</label>
                <select
                  value={selectedPOId}
                  onChange={(e) => setSelectedPOId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                >
                  {purchaseOrders.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.poNumber} — {p.vendorName} ({formatCurrency(p.totalAmount)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Vendor Invoice Reference #</label>
                <input
                  type="text"
                  required
                  value={vendorInvNum}
                  onChange={(e) => setVendorInvNum(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Billed Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={billedQty}
                    onChange={(e) => setBilledQty(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Invoice Subtotal Value</label>
                  <input
                    type="number"
                    step="any"
                    value={billedAmount}
                    onChange={(e) => setBilledAmount(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="p-3 bg-purple-950/20 border border-purple-500/20 rounded-xl text-xs text-purple-300">
                💡 <strong>Tip for Testing:</strong> Enter a billed quantity higher than what was received on the Goods Receipt Note (GRN) to test the automated discrepancy interception!
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsOpenNewInvoice(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
                >
                  Run 3-Way Match & Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
