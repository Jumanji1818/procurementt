import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  Download,
  Calendar,
  Filter,
  DollarSign,
  PieChart,
  BarChart3,
  Building,
  Users,
  CheckCircle,
  FileSpreadsheet,
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const {
    requests,
    purchaseOrders,
    vendors,
    departments,
    invoices,
    budgets,
    formatCurrency,
    orgConfig,
  } = useApp();

  const [dateRange, setDateRange] = useState('FY2026');

  // Compute spend by category
  const categorySpend: Record<string, number> = {};
  purchaseOrders.forEach((po) => {
    po.items.forEach((item) => {
      const cat = item.description.includes('Workstation') || item.description.includes('Micro-Controller')
        ? 'IT Equipment'
        : item.description.includes('Desk') || item.description.includes('Pod')
        ? 'Office Furniture'
        : 'Facilities & Chemicals';
      categorySpend[cat] = (categorySpend[cat] || 0) + item.totalPrice;
    });
  });

  const totalPOSpend = purchaseOrders.reduce((acc, p) => acc + p.totalAmount, 0);

  const exportCSV = () => {
    let csv = 'PO Number,Vendor,Date,Subtotal,Tax,Total,Status\n';
    purchaseOrders.forEach((po) => {
      csv += `${po.poNumber},"${po.vendorName}",${po.issuedAt.split('T')[0]},${po.subtotal},${po.taxAmount},${po.totalAmount},${po.status}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `procura-spend-report-${dateRange}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Procurement Intelligence & Spend Analytics
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time spend visibility across suppliers, categories, cost centers, and contract cycle times.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
          >
            <option value="FY2026">Fiscal Year 2026</option>
            <option value="Q3-2026">Q3 2026</option>
            <option value="Q4-2026">Q4 2026</option>
          </select>

          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV Report</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Total Committed & Disbursed</span>
          <div className="text-2xl font-black text-white">{formatCurrency(totalPOSpend)}</div>
          <span className="text-[11px] text-emerald-400 mt-1 block">Across {purchaseOrders.length} Purchase Orders</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Average Requisition Cycle Time</span>
          <div className="text-2xl font-black text-sky-400">1.8 Days</div>
          <span className="text-[11px] text-slate-500 mt-1 block">From draft to executive signoff</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Average Vendor On-Time Delivery</span>
          <div className="text-2xl font-black text-teal-400">93.8%</div>
          <span className="text-[11px] text-slate-500 mt-1 block">Based on warehouse dock receipts</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold block mb-1">Contract Compliance Ratio</span>
          <div className="text-2xl font-black text-purple-400">98.2%</div>
          <span className="text-[11px] text-emerald-400 mt-1 block">Zero unauthorized rogue spend</span>
        </div>
      </div>

      {/* Spend Breakdown by Category */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <PieChart className="w-4 h-4 text-indigo-400" />
            <span>Spend Allocation by Category</span>
          </h3>

          <div className="space-y-3 pt-2">
            {Object.entries(categorySpend).map(([cat, amount], idx) => {
              const pct = Math.round((amount / (totalPOSpend || 1)) * 100);
              const colors = ['bg-indigo-500', 'bg-sky-500', 'bg-teal-500'];
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-300">{cat}</span>
                    <span className="font-mono text-white font-bold">
                      {formatCurrency(amount)} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div className={`h-full ${colors[idx % colors.length]}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Vendors by Volume */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-400" />
            <span>Top Strategic Suppliers by Volume</span>
          </h3>

          <div className="space-y-3">
            {vendors.map((v) => (
              <div
                key={v.id}
                className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-white">{v.companyName}</div>
                  <div className="text-[11px] text-slate-500">{v.categories.join(', ')} • Rating: {v.rating}★</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-emerald-400">{formatCurrency(v.totalSpend)}</div>
                  <span className="text-[10px] text-slate-400">{v.completedOrdersCount} Orders Fulfilled</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
