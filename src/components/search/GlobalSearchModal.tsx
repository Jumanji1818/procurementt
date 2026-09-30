import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, X, FileText, ShoppingCart, Users, Package, DollarSign, ArrowRight } from 'lucide-react';

export const GlobalSearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    requests,
    purchaseOrders,
    vendors,
    inventoryItems,
    invoices,
    rfqs,
    setActiveView,
    formatCurrency,
  } = useApp();

  const [query, setQuery] = useState('');

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();

    const matchedReqs = requests
      .filter((r) => r.requestNumber.toLowerCase().includes(q) || r.title.toLowerCase().includes(q))
      .map((r) => ({
        id: r.id,
        title: `${r.requestNumber} - ${r.title}`,
        subtitle: `${r.departmentName || 'General'} • ${formatCurrency(r.estimatedBudget)}`,
        category: 'Requests',
        icon: FileText,
        view: 'requests' as const,
      }));

    const matchedPOs = purchaseOrders
      .filter((p) => p.poNumber.toLowerCase().includes(q) || p.vendorName.toLowerCase().includes(q))
      .map((p) => ({
        id: p.id,
        title: `${p.poNumber} (${p.vendorName})`,
        subtitle: `Total: ${formatCurrency(p.totalAmount)} • Status: ${p.status.replace('_', ' ')}`,
        category: 'Purchase Orders',
        icon: ShoppingCart,
        view: 'orders' as const,
      }));

    const matchedVendors = vendors
      .filter((v) => v.companyName.toLowerCase().includes(q) || v.categories.some((c) => c.toLowerCase().includes(q)))
      .map((v) => ({
        id: v.id,
        title: v.companyName,
        subtitle: `Rating: ${v.rating}★ • ${v.city} • Spend: ${formatCurrency(v.totalSpend)}`,
        category: 'Vendors',
        icon: Users,
        view: 'vendors' as const,
      }));

    const matchedInventory = inventoryItems
      .filter((i) => i.name.toLowerCase().includes(q) || i.sku.toLowerCase().includes(q))
      .map((i) => ({
        id: i.id,
        title: `${i.name} (${i.sku})`,
        subtitle: `Stock: ${i.currentStock} ${i.unit} in ${i.locationName}`,
        category: 'Inventory',
        icon: Package,
        view: 'inventory' as const,
      }));

    const matchedInvoices = invoices
      .filter((inv) => inv.invoiceNumber.toLowerCase().includes(q) || inv.vendorName.toLowerCase().includes(q))
      .map((inv) => ({
        id: inv.id,
        title: `${inv.invoiceNumber} (${inv.vendorName})`,
        subtitle: `Amount: ${formatCurrency(inv.totalAmount)} • Match: ${inv.threeWayMatch.isMatched ? 'Passed' : 'Exception'}`,
        category: 'Invoices',
        icon: DollarSign,
        view: 'finance' as const,
      }));

    return [...matchedReqs, ...matchedPOs, ...matchedVendors, ...matchedInventory, ...matchedInvoices].slice(0, 8);
  }, [query, requests, purchaseOrders, vendors, inventoryItems, invoices, rfqs, formatCurrency]);

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 backdrop-blur-sm p-4 pt-16 sm:pt-24">
      <div className="relative w-full max-w-xl rounded-xl bg-[#082117] border border-[#143e2f] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center px-4 py-3.5 border-b border-[#143e2f] bg-[#051710]">
          <Search className="w-5 h-5 text-[#d4af37] mr-3 flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search requests, POs, suppliers, inventory, invoices..."
            className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-white mr-1 text-xs cursor-pointer"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-[#0c2d20] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto p-2">
          {query.trim() === '' ? (
            <div className="p-6 text-center text-xs text-slate-400">
              Type keywords, request codes, vendor names, or inventory SKUs.
              <div className="flex flex-wrap justify-center gap-2 mt-3">
                <span className="px-2.5 py-1 rounded-md bg-[#051710] border border-[#143e2f] text-slate-300">REQ-2026-089</span>
                <span className="px-2.5 py-1 rounded-md bg-[#051710] border border-[#143e2f] text-slate-300">Nexus Logistics</span>
                <span className="px-2.5 py-1 rounded-md bg-[#051710] border border-[#143e2f] text-slate-300">Nitrile Gloves</span>
                <span className="px-2.5 py-1 rounded-md bg-[#051710] border border-[#143e2f] text-slate-300">INV-2026-091</span>
              </div>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No matching procurement records found for "{query}".
            </div>
          ) : (
            <div className="space-y-1">
              {searchResults.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={`${item.category}-${item.id}`}
                    onClick={() => {
                      setActiveView(item.view);
                      setIsSearchOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-[#0c2d20] transition text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-md bg-[#092b1f] border border-[#d4af37]/30 text-[#d4af37] group-hover:bg-[#d4af37] group-hover:text-[#051b14] transition">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white">{item.title}</div>
                        <div className="text-[11px] text-slate-400">{item.subtitle}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 group-hover:text-[#d4af37]">
                      <span>{item.category}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="px-4 py-2.5 bg-[#051710] border-t border-[#143e2f] flex items-center justify-between text-[11px] text-slate-400">
          <span>Procura Universal Search Index</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
};
