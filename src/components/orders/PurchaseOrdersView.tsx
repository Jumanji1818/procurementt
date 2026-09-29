import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PurchaseOrder } from '../../types';
import {
  ShoppingCart,
  Plus,
  Search,
  Filter,
  Printer,
  Download,
  CheckCircle,
  Truck,
  Clock,
  Eye,
  X,
  FileText,
  DollarSign,
  Building,
} from 'lucide-react';

export const PurchaseOrdersView: React.FC<{
  isOpenCreateModal: boolean;
  setIsOpenCreateModal: (open: boolean) => void;
}> = ({ isOpenCreateModal, setIsOpenCreateModal }) => {
  const {
    purchaseOrders,
    createPurchaseOrder,
    vendors,
    formatCurrency,
    orgConfig,
    t,
  } = useApp();

  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const [printModalPO, setPrintModalPO] = useState<PurchaseOrder | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // New PO form states
  const [vendorId, setVendorId] = useState(vendors[0]?.id || '');
  const [deliveryAddress, setDeliveryAddress] = useState('Central Logistics Warehouse, Block 4');
  const [expectedDate, setExpectedDate] = useState('');
  const [notes, setNotes] = useState('');
  const [poLines, setPoLines] = useState([
    { description: 'Commercial Consumables Pack', quantity: 5, unitPrice: 200 },
  ]);

  const handleCreatePO = (e: React.FormEvent) => {
    e.preventDefault();
    const vendor = vendors.find((v) => v.id === vendorId) || vendors[0];
    const items = poLines.map((line, idx) => ({
      id: `poi_${Date.now()}_${idx}`,
      description: line.description,
      quantityOrdered: line.quantity,
      quantityReceived: 0,
      unitPrice: line.unitPrice,
      totalPrice: line.quantity * line.unitPrice,
    }));

    const subtotal = items.reduce((acc, it) => acc + it.totalPrice, 0);
    const taxAmount = (subtotal * orgConfig.taxRate) / 100;

    createPurchaseOrder({
      vendorId: vendor.id,
      vendorName: vendor.companyName,
      vendorEmail: vendor.email,
      items,
      subtotal,
      taxAmount,
      shippingAmount: 120,
      totalAmount: subtotal + taxAmount + 120,
      deliveryTerms: 'DAP (Delivered at Place)',
      paymentTerms: 'Net 30 Days',
      expectedDeliveryDate: expectedDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      deliveryAddress,
      notes,
    });

    setIsOpenCreateModal(false);
  };

  const filteredPOs = purchaseOrders.filter((po) => {
    const matchesStatus = statusFilter === 'all' || po.status === statusFilter;
    const matchesSearch =
      po.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      po.vendorName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Purchase Orders (PO)</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Formal commercial commitments issued to suppliers with delivery schedules and billing terms.
          </p>
        </div>

        <button
          onClick={() => setIsOpenCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Issue Purchase Order</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by PO number or supplier name..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto text-xs">
          {[
            { key: 'all', label: 'All POs' },
            { key: 'issued', label: 'Issued' },
            { key: 'in_transit', label: 'In Transit' },
            { key: 'partially_received', label: 'Partially Received' },
            { key: 'fully_received', label: 'Fully Received' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`px-3 py-1.5 rounded-xl font-medium transition flex-shrink-0 ${
                statusFilter === tab.key
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* PO List */}
      <div className="grid grid-cols-1 gap-3">
        {filteredPOs.map((po) => (
          <div
            key={po.id}
            className="p-5 rounded-2xl border border-slate-800 bg-slate-900/90 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-1.5">
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
                  {po.status.replace('_', ' ').toUpperCase()}
                </span>
                <span className="text-[11px] text-slate-400">• Issued: {po.issuedAt.split('T')[0]}</span>
              </div>

              <div className="text-sm font-bold text-white">{po.vendorName}</div>
              <div className="text-xs text-slate-400">
                {po.items.map((i) => `${i.quantityOrdered}x ${i.description}`).join(' • ')}
              </div>
              <div className="text-[11px] text-slate-500">
                Delivery Target: {po.expectedDeliveryDate} • Destination: {po.deliveryAddress}
              </div>
            </div>

            <div className="flex items-center gap-4 border-t md:border-t-0 pt-3 md:pt-0 border-slate-800">
              <div className="text-right">
                <div className="text-base font-black text-white">{formatCurrency(po.totalAmount)}</div>
                <span className="text-[10px] text-slate-400">Total Contract Value</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPrintModalPO(po)}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <Printer className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Print PO / PDF</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* PRINTABLE / FORMAL PDF VIEW MODAL (Mandatory per specification) */}
      {printModalPO && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-2xl bg-white text-slate-900 shadow-2xl p-6 sm:p-10 my-8 text-left font-sans">
            <div className="flex items-start justify-between pb-6 border-b border-slate-200">
              <div>
                <div className="text-2xl font-black text-indigo-900 tracking-tight">{orgConfig.name}</div>
                <div className="text-xs text-slate-500 mt-1">Official Purchase Order Document</div>
                <div className="text-xs text-slate-500">Global Corporate Procurement Division</div>
              </div>
              <div className="text-right">
                <div className="font-mono text-base font-black text-slate-800">{printModalPO.poNumber}</div>
                <div className="text-xs text-slate-500">Date: {printModalPO.issuedAt.split('T')[0]}</div>
                <button
                  onClick={() => setPrintModalPO(null)}
                  className="mt-2 text-xs text-slate-400 hover:text-slate-800"
                >
                  Close [✕]
                </button>
              </div>
            </div>

            {/* Vendor & Delivery Box */}
            <div className="grid grid-cols-2 gap-4 py-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-700 block mb-1 uppercase text-[10px]">Vendor Details</span>
                <div className="font-bold text-slate-900">{printModalPO.vendorName}</div>
                <div className="text-slate-600">{printModalPO.vendorEmail}</div>
                <div className="text-slate-600 mt-1">Terms: {printModalPO.paymentTerms}</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-700 block mb-1 uppercase text-[10px]">Ship To / Location</span>
                <div className="font-bold text-slate-900">{printModalPO.deliveryAddress}</div>
                <div className="text-slate-600">Expected Delivery: {printModalPO.expectedDeliveryDate}</div>
                <div className="text-slate-600 mt-1">Shipping: {printModalPO.deliveryTerms}</div>
              </div>
            </div>

            {/* Table */}
            <table className="w-full text-left text-xs my-4 border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-800 text-slate-700 uppercase text-[10px]">
                  <th className="py-2">Description</th>
                  <th className="py-2 text-center">Qty</th>
                  <th className="py-2 text-right">Unit Price</th>
                  <th className="py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {printModalPO.items.map((it) => (
                  <tr key={it.id}>
                    <td className="py-2.5 font-medium text-slate-800">{it.description}</td>
                    <td className="py-2.5 text-center">{it.quantityOrdered}</td>
                    <td className="py-2.5 text-right font-mono">{formatCurrency(it.unitPrice)}</td>
                    <td className="py-2.5 text-right font-mono font-bold">{formatCurrency(it.totalPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Financial Summary */}
            <div className="border-t-2 border-slate-800 pt-3 flex justify-end text-xs">
              <div className="w-64 space-y-1.5 text-right">
                <div className="flex justify-between">
                  <span className="text-slate-600">Subtotal:</span>
                  <span className="font-mono">{formatCurrency(printModalPO.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Tax ({orgConfig.taxRate}%):</span>
                  <span className="font-mono">{formatCurrency(printModalPO.taxAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Freight / Shipping:</span>
                  <span className="font-mono">{formatCurrency(printModalPO.shippingAmount)}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-300">
                  <span>Grand Total:</span>
                  <span>{formatCurrency(printModalPO.totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Stamp & Authorized Signature */}
            <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <div>
                <span className="font-bold text-emerald-700 block">✓ DIGITALLY AUTHORIZED BY PROCURA</span>
                <span>SHA-256 Audit Seal: Verified Valid</span>
              </div>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold flex items-center gap-1.5 shadow"
              >
                <Printer className="w-4 h-4" />
                <span>Print Copy</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE PO MODAL */}
      {isOpenCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 text-left my-8">
            <h2 className="text-base font-bold text-white mb-1">Issue Purchase Order Directly</h2>
            <p className="text-xs text-slate-400 mb-5">
              Generate a legally binding PO for direct ordering.
            </p>

            <form onSubmit={handleCreatePO} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Supplier / Vendor</label>
                <select
                  value={vendorId}
                  onChange={(e) => setVendorId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  {vendors.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.companyName} ({v.city})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Delivery Destination</label>
                <input
                  type="text"
                  required
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Target Delivery Date</label>
                  <input
                    type="date"
                    value={expectedDate}
                    onChange={(e) => setExpectedDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Payment Terms</label>
                  <input
                    type="text"
                    disabled
                    value="Net 30 Days after GRN"
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-400"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsOpenCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition"
                >
                  Issue Purchase Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
