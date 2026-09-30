import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  GoodsReceiptNote,
  InventoryItem,
  StockMovement,
} from '../../types';
import {
  Truck,
  Package,
  Plus,
  Search,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Layers,
  ArrowRight,
  TrendingDown,
  Building,
  ShieldCheck,
  Calendar,
} from 'lucide-react';

export const DeliveriesAndInventoryView: React.FC<{
  isOpenNewGRN: boolean;
  setIsOpenNewGRN: (open: boolean) => void;
}> = ({ isOpenNewGRN, setIsOpenNewGRN }) => {
  const {
    goodsReceipts,
    inventoryItems,
    stockMovements,
    purchaseOrders,
    recordGoodsReceipt,
    adjustStock,
    currentUser,
    locations,
    formatCurrency,
    orgConfig,
    t,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'deliveries' | 'inventory' | 'movements'>('deliveries');
  const [searchQuery, setSearchQuery] = useState('');

  // GRN Modal Form States
  const [selectedPOId, setSelectedPOId] = useState(purchaseOrders[0]?.id || '');
  const [deliveryNoteNumber, setDeliveryNoteNumber] = useState('DN-LOG-8891');
  const [locationId, setLocationId] = useState(locations[1]?.id || locations[0]?.id || '');
  const [comments, setComments] = useState('');
  const [receivedQtyInput, setReceivedQtyInput] = useState<number>(10);
  const [damagedQtyInput, setDamagedQtyInput] = useState<number>(0);
  const [missingQtyInput, setMissingQtyInput] = useState<number>(0);

  // Manual stock adjustment modal
  const [adjustModalItem, setAdjustModalItem] = useState<InventoryItem | null>(null);
  const [adjustQty, setAdjustQty] = useState<number>(0);
  const [adjustReason, setAdjustReason] = useState<string>('Cycle Count Reconciliation');

  const selectedPO = purchaseOrders.find((p) => p.id === selectedPOId) || purchaseOrders[0];

  const handleRecordGRN = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPO) return;

    const matchedLoc = locations.find((l) => l.id === locationId) || locations[0];

    const grnItems = selectedPO.items.map((it, idx) => ({
      poItemId: it.id || `poi_${idx}`,
      description: it.description,
      quantityOrdered: it.quantityOrdered ?? 1,
      quantityReceived: receivedQtyInput,
      quantityDamaged: damagedQtyInput,
      quantityMissing: missingQtyInput,
      inspectionPassed: damagedQtyInput === 0 && missingQtyInput === 0,
    }));

    recordGoodsReceipt({
      purchaseOrderId: selectedPO.id,
      poNumber: selectedPO.poNumber,
      vendorName: selectedPO.vendorName,
      receiverUserId: currentUser.id,
      receiverName: currentUser.name,
      deliveryNoteNumber,
      locationId: matchedLoc.id,
      locationName: matchedLoc.name,
      items: grnItems,
      comments: comments || 'Standard dock delivery inspection conducted.',
    });

    setIsOpenNewGRN(false);
  };

  const handleApplyAdjustment = () => {
    if (!adjustModalItem) return;
    adjustStock(adjustModalItem.id, adjustQty, 'adjustment', adjustReason);
    setAdjustModalItem(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Logistics, Goods Receipts & Inventory
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Physical delivery verification, damage inspection, and automated warehouse inventory updates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-[#082117] p-1 rounded-lg border border-[#143e2f] text-xs">
            <button
              onClick={() => setActiveTab('deliveries')}
              className={`px-3 py-1.5 rounded-md font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'deliveries' ? 'bg-[#d4af37] text-[#051b14]' : 'text-slate-300 hover:text-white hover:bg-[#0c2d20]'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Deliveries & GRNs</span>
            </button>
            <button
              onClick={() => setActiveTab('inventory')}
              className={`px-3 py-1.5 rounded-md font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'inventory' ? 'bg-[#d4af37] text-[#051b14]' : 'text-slate-300 hover:text-white hover:bg-[#0c2d20]'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Inventory Stock</span>
            </button>
            <button
              onClick={() => setActiveTab('movements')}
              className={`px-3 py-1.5 rounded-md font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'movements' ? 'bg-[#d4af37] text-[#051b14]' : 'text-slate-300 hover:text-white hover:bg-[#0c2d20]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Movement Ledger</span>
            </button>
          </div>

          <button
            onClick={() => setIsOpenNewGRN(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#d4af37] hover:bg-[#c49f2b] text-[#051b14] text-xs font-bold shadow-md transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Record GRN</span>
          </button>
        </div>
      </div>

      {activeTab === 'deliveries' && (
        <div className="space-y-6">
          {/* INBOUND SHIPMENTS IN TRANSIT (Dispatched by Vendors) */}
          <div className="p-5 rounded-xl border border-[#143e2f] bg-[#082117] space-y-3 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-[#143e2f]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-[#092b1f] border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Inbound Vendor Shipments in Transit</h3>
                  <p className="text-[11px] text-slate-400">
                    Waybills & dispatch tracking logged by suppliers in the Vendor Portal.
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#051710] text-[#d4af37] border border-[#143e2f]">
                {purchaseOrders.filter((p) => p.status === 'in_transit' || p.trackingNumber).length} active shipments
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              {purchaseOrders
                .filter((p) => p.status === 'in_transit' || p.trackingNumber)
                .map((po) => (
                  <div key={po.id} className="p-4 rounded-lg bg-[#051710] border border-[#143e2f] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[#d4af37]">{po.poNumber}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#092b1f] text-emerald-400 border border-emerald-600/40">
                        {po.status === 'in_transit' ? 'In Transit / Dispatched' : po.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-white">{po.vendorName}</div>
                    <div className="text-[11px] text-slate-300">
                      Waybill / Tracking: <strong className="text-white font-mono">{po.trackingNumber || 'TRK-984210'}</strong>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Delivery Target: {po.expectedDeliveryDate || 'Standard 14 Days'} • Destination: {po.deliveryAddress}
                    </div>
                    <div className="pt-2 border-t border-[#143e2f] flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{formatCurrency(po.totalAmount)}</span>
                      <button
                        onClick={() => {
                          setSelectedPOId(po.id);
                          setIsOpenNewGRN(true);
                        }}
                        className="py-1 px-3 rounded-md bg-[#d4af37] hover:bg-[#c49f2b] text-[#051b14] text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                      >
                        <span>Dock Inspection (Log GRN)</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* HISTORICAL GRN LEDGER */}
          <div className="space-y-3 text-left">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Inspected Goods Receipt Notes (GRN Ledger)</h3>
              <span className="text-xs text-slate-400">{goodsReceipts.length} inspection records</span>
            </div>

            <div className="grid grid-cols-1 gap-3">
            {goodsReceipts.map((grn) => (
              <div
                key={grn.id}
                className="p-5 rounded-xl border border-[#143e2f] bg-[#082117] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-400">{grn.grnNumber}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300">
                      PO: {grn.poNumber}
                    </span>
                    <span className="text-[11px] text-slate-400">• Vendor: {grn.vendorName}</span>
                  </div>

                  <div className="text-sm font-bold text-white">
                    Received at {grn.locationName} (Delivery Note #{grn.deliveryNoteNumber})
                  </div>

                  <div className="text-xs text-slate-300">
                    {grn.items.map((it) => (
                      <div key={it.poItemId} className="flex items-center gap-2 mt-0.5">
                        <span>• {it.description}:</span>
                        <strong className="text-white">{it.quantityReceived} accepted</strong>
                        {it.quantityDamaged > 0 && (
                          <span className="text-rose-400 font-bold">({it.quantityDamaged} Damaged)</span>
                        )}
                        {it.quantityMissing > 0 && (
                          <span className="text-amber-400 font-bold">({it.quantityMissing} Missing)</span>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="text-[11px] text-slate-500 italic mt-1">"{grn.comments}"</div>
                </div>

                <div className="text-right border-t md:border-t-0 pt-3 md:pt-0 border-slate-800">
                  <div className="text-xs text-slate-400">Inspected & Verified By</div>
                  <div className="text-sm font-bold text-white">{grn.receiverName}</div>
                  <div className="text-[11px] text-slate-500">{grn.receivedDate.split('T')[0]}</div>
                </div>
              </div>
            ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'inventory' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {inventoryItems.map((item) => {
              const isLowStock = item.currentStock <= item.minimumStock;
              return (
                <div
                  key={item.id}
                  className={`p-5 rounded-xl border text-left flex flex-col justify-between transition ${
                    isLowStock
                      ? 'border-rose-500/40 bg-[#082117] shadow-lg shadow-rose-950/20'
                      : 'border-[#143e2f] bg-[#082117]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-mono font-bold text-[#d4af37]">{item.sku}</span>
                      {isLowStock ? (
                        <span className="px-2 py-0.5 rounded text-rose-400 border border-rose-800/40 bg-rose-950/60 text-[10px] font-bold">
                          Low Stock Alert
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-emerald-400 border border-emerald-600/40 bg-emerald-950/60 text-[10px] font-bold">
                          Optimal Stock
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-white mb-1 line-clamp-1">{item.name}</h3>
                    <p className="text-[11px] text-slate-400 mb-3">{item.locationName}</p>

                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-2xl font-black text-white">{item.currentStock}</span>
                      <span className="text-xs text-slate-400">{item.unit} in stock</span>
                    </div>

                    <div className="w-full bg-[#051710] h-1.5 rounded-full overflow-hidden mb-3 border border-[#143e2f]">
                      <div
                        className={`h-full rounded-full ${
                          isLowStock ? 'bg-rose-500' : 'bg-emerald-500'
                        }`}
                        style={{
                          width: `${Math.min(100, (item.currentStock / item.reorderLevel) * 100)}%`,
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>Safety Min: {item.minimumStock}</span>
                      <span>Reorder At: {item.reorderLevel}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#143e2f] flex items-center justify-between">
                    <span className="text-xs font-mono text-[#d4af37] font-semibold">
                      Avg: {formatCurrency(item.averageUnitCost)}
                    </span>
                    <button
                      onClick={() => setAdjustModalItem(item)}
                      className="px-3 py-1 rounded-lg bg-[#051710] hover:bg-[#0c2d20] border border-[#143e2f] text-xs font-semibold text-slate-200 transition cursor-pointer"
                    >
                      Adjust
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'movements' && (
        <div className="rounded-xl border border-[#143e2f] bg-[#082117] p-5 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white">Stock Movement Audit Trail</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Automated log of receipts, inventory issues, and physical stock reconciliations.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#143e2f] text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="pb-3">Timestamp</th>
                  <th className="pb-3">Item Description</th>
                  <th className="pb-3">Action Type</th>
                  <th className="pb-3 text-center">Qty Variance</th>
                  <th className="pb-3 text-center">Resulting Stock</th>
                  <th className="pb-3">Reference</th>
                  <th className="pb-3 text-right">Logged By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#143e2f]">
                {stockMovements.map((mov) => (
                  <tr key={mov.id} className="text-slate-300">
                    <td className="py-3 font-mono text-slate-400">{mov.timestamp.split('T')[0]}</td>
                    <td className="py-3 font-bold text-white">{mov.itemName}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#051710] border border-[#143e2f] text-slate-300 capitalize">
                        {mov.movementType.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 text-center font-bold text-emerald-400">
                      {mov.quantityChange > 0 ? `+${mov.quantityChange}` : mov.quantityChange}
                    </td>
                    <td className="py-3 text-center font-bold text-white">{mov.resultingStock}</td>
                    <td className="py-3 font-mono text-[#d4af37] font-semibold">{mov.referenceId || 'MANUAL-ADJ'}</td>
                    <td className="py-3 text-right text-slate-400">{mov.performedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* RECORD GRN MODAL */}
      {isOpenNewGRN && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-xl bg-[#082117] border border-[#143e2f] shadow-2xl p-6 sm:p-8 text-left my-8">
            <h2 className="text-base font-bold text-white mb-1">Record Physical Goods Receipt Note (GRN)</h2>
            <p className="text-xs text-slate-400 mb-5">
              Receiving goods automatically syncs inventory stock in the selected warehouse.
            </p>

            <form onSubmit={handleRecordGRN} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Purchase Order (PO)</label>
                <select
                  value={selectedPOId}
                  onChange={(e) => setSelectedPOId(e.target.value)}
                  className="w-full bg-[#051710] border border-[#143e2f] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                >
                  {purchaseOrders.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.poNumber} — {p.vendorName} ({p.items.length} items)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Supplier Delivery Note #</label>
                  <input
                    type="text"
                    required
                    value={deliveryNoteNumber}
                    onChange={(e) => setDeliveryNoteNumber(e.target.value)}
                    className="w-full bg-[#051710] border border-[#143e2f] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Receiving Facility / Warehouse</label>
                  <select
                    value={locationId}
                    onChange={(e) => setLocationId(e.target.value)}
                    className="w-full bg-[#051710] border border-[#143e2f] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                  >
                    {locations.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="p-3.5 bg-[#051710] rounded-lg border border-[#143e2f] space-y-3">
                <span className="text-xs font-bold text-white block">Dock Inspection Counts</span>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Accepted Qty</label>
                    <input
                      type="number"
                      min="0"
                      value={receivedQtyInput}
                      onChange={(e) => setReceivedQtyInput(Number(e.target.value))}
                      className="w-full bg-[#082117] border border-[#143e2f] rounded-lg p-2 text-xs text-white text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-rose-400 mb-1">Damaged Qty</label>
                    <input
                      type="number"
                      min="0"
                      value={damagedQtyInput}
                      onChange={(e) => setDamagedQtyInput(Number(e.target.value))}
                      className="w-full bg-[#082117] border border-[#143e2f] rounded-lg p-2 text-xs text-white text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#d4af37] mb-1">Missing Qty</label>
                    <input
                      type="number"
                      min="0"
                      value={missingQtyInput}
                      onChange={(e) => setMissingQtyInput(Number(e.target.value))}
                      className="w-full bg-[#082117] border border-[#143e2f] rounded-lg p-2 text-xs text-white text-center"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Inspection Remarks</label>
                <textarea
                  rows={2}
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Note damages, batch numbers, expiry dates, or freight notes..."
                  className="w-full bg-[#051710] border border-[#143e2f] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#143e2f]">
                <button
                  type="button"
                  onClick={() => setIsOpenNewGRN(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg bg-[#d4af37] hover:bg-[#c49f2b] text-[#051b14] font-bold text-xs shadow-md transition cursor-pointer"
                >
                  Confirm & Sync Inventory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADJUST STOCK MODAL */}
      {adjustModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl bg-[#082117] border border-[#143e2f] p-6 shadow-2xl text-left">
            <h3 className="text-sm font-bold text-white">Adjust Stock: {adjustModalItem.name}</h3>
            <p className="text-xs text-slate-400 mt-1">Current Stock: {adjustModalItem.currentStock} {adjustModalItem.unit}</p>

            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Adjustment Variance (+ or -)</label>
                <input
                  type="number"
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(Number(e.target.value))}
                  placeholder="e.g. +5 or -2"
                  className="w-full bg-[#051710] border border-[#143e2f] rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Reconciliation Reason</label>
                <input
                  type="text"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full bg-[#051710] border border-[#143e2f] rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setAdjustModalItem(null)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyAdjustment}
                className="px-4 py-2 rounded-lg bg-[#d4af37] hover:bg-[#c49f2b] text-[#051b14] font-bold text-xs cursor-pointer"
              >
                Apply Adjustment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
