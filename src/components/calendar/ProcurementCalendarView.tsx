import React from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar as CalendarIcon, Clock, Truck, FileText, AlertCircle } from 'lucide-react';

export const ProcurementCalendarView: React.FC = () => {
  const { purchaseOrders, rfqs, invoices, contracts, formatCurrency } = useApp();

  const events = [
    ...purchaseOrders.map((po) => ({
      id: po.id,
      date: po.expectedDeliveryDate,
      title: `Expected Delivery: ${po.poNumber}`,
      subtitle: `${po.vendorName} (${formatCurrency(po.totalAmount)})`,
      type: 'delivery',
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    })),
    ...rfqs.map((rfq) => ({
      id: rfq.id,
      date: rfq.closingDate.split('T')[0],
      title: `Tender Deadline: ${rfq.rfqNumber}`,
      subtitle: rfq.title,
      type: 'rfq',
      color: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
    })),
    ...invoices.map((inv) => ({
      id: inv.id,
      date: inv.dueDate,
      title: `Invoice Due: ${inv.invoiceNumber}`,
      subtitle: `${inv.vendorName} • ${formatCurrency(inv.totalAmount)}`,
      type: 'invoice',
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    })),
    ...contracts.map((c) => ({
      id: c.id,
      date: c.endDate,
      title: `Contract Expiry: ${c.contractNumber}`,
      subtitle: `${c.vendorName} (${c.title})`,
      type: 'contract',
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    })),
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Procurement Operational Calendar</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Consolidated chronological schedule of expected shipments, tender closing deadlines, and invoice settlement targets.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="text-xs font-bold text-white flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-indigo-400" />
            <span>Upcoming Milestones & Critical Deadlines</span>
          </div>
          <span className="text-xs text-slate-400">{events.length} Scheduled Events</span>
        </div>

        <div className="space-y-3">
          {events.map((evt, idx) => (
            <div
              key={`${evt.id}-${idx}`}
              className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${evt.color}`}
            >
              <div className="flex items-start gap-3">
                <div className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800 text-white">
                  {evt.date}
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">{evt.title}</h3>
                  <div className="text-[11px] text-slate-300 mt-0.5">{evt.subtitle}</div>
                </div>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-950/60 text-white self-start sm:self-auto">
                {evt.type}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
