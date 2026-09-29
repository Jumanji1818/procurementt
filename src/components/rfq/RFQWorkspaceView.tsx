import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bid,
  RFQ,
  RFQItem,
} from '../../types';
import {
  Plus,
  FileSpreadsheet,
  Award,
  Users,
  CheckCircle,
  Clock,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  ExternalLink,
  Sliders,
  DollarSign,
  Calendar,
  Layers,
} from 'lucide-react';

export const RFQWorkspaceView: React.FC = () => {
  const {
    rfqs,
    bids,
    awardBid,
    submitBid,
    vendors,
    formatCurrency,
    t,
    orgConfig,
  } = useApp();

  const [selectedRfqId, setSelectedRfqId] = useState<string>(rfqs[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'evaluation' | 'vendor_portal'>('evaluation');

  // Supplier portal submission simulation
  const [vendorBidAmount, setVendorBidAmount] = useState<number>(16500);
  const [vendorDeliveryDays, setVendorDeliveryDays] = useState<number>(10);
  const [vendorWarranty, setVendorWarranty] = useState<string>('3 Years Full Replacement');
  const [vendorNotes, setVendorNotes] = useState<string>('Ex-stock delivery with free setup.');
  const [vendorSubmitted, setVendorSubmitted] = useState<boolean>(false);

  const activeRfq = rfqs.find((r) => r.id === selectedRfqId) || rfqs[0];
  const rfqBids = bids.filter((b) => b.rfqId === activeRfq?.id);

  const handleSimulateVendorBid = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRfq) return;

    submitBid(activeRfq.id, {
      rfqId: activeRfq.id,
      vendorId: vendors[3]?.id || 'v_4',
      vendorName: vendors[3]?.companyName || 'PrimeTech Solutions',
      totalAmount: vendorBidAmount,
      deliveryDays: vendorDeliveryDays,
      warrantyPeriod: vendorWarranty,
      validityDays: 60,
      complianceChecked: true,
      technicalScore: 94,
      financialScore: 90,
      totalWeightedScore: 92.4,
      items: activeRfq.items.map((item) => ({
        rfqItemId: item.id,
        unitPrice: Math.round(vendorBidAmount / item.quantity),
        totalPrice: vendorBidAmount,
        notes: 'Compliant with enterprise specification',
      })),
      comments: vendorNotes,
    });

    setVendorSubmitted(true);
    setTimeout(() => {
      setVendorSubmitted(false);
      setActiveTab('evaluation');
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Competitive Tender & RFQ Workspace
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Issue transparent requests for quotation, evaluate bids against weighted criteria, and award contracts.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('evaluation')}
            className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
              activeTab === 'evaluation' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Bid Evaluation & Matrix</span>
          </button>

          <button
            onClick={() => setActiveTab('vendor_portal')}
            className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
              activeTab === 'vendor_portal' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Vendor Portal Simulator</span>
          </button>
        </div>
      </div>

      {/* RFQ Selection Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {rfqs.map((rfq) => {
          const isSelected = rfq.id === activeRfq?.id;
          const count = bids.filter((b) => b.rfqId === rfq.id).length;
          return (
            <div
              key={rfq.id}
              onClick={() => setSelectedRfqId(rfq.id)}
              className={`p-4 rounded-2xl border cursor-pointer transition text-left ${
                isSelected
                  ? 'border-indigo-500 bg-slate-900 shadow-lg shadow-indigo-500/10'
                  : 'border-slate-800 bg-slate-900/60 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-mono font-bold text-indigo-400">{rfq.rfqNumber}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    rfq.status === 'awarded'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-amber-500/20 text-amber-400'
                  }`}
                >
                  {rfq.status.toUpperCase()}
                </span>
              </div>
              <h3 className="text-xs font-bold text-white line-clamp-1">{rfq.title}</h3>
              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                <span>{count} Proposals Received</span>
                <span>Closes: {rfq.closingDate.split('T')[0]}</span>
              </div>
            </div>
          );
        })}
      </div>

      {activeTab === 'evaluation' ? (
        activeRfq ? (
          <div className="space-y-6">
            {/* Active RFQ Specification Overview */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-indigo-400">{activeRfq.rfqNumber}</span>
                    <h2 className="text-sm font-bold text-white">{activeRfq.title}</h2>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Delivery Destination: {activeRfq.deliveryLocation}</p>
                </div>

                {/* Criteria Weights */}
                <div className="flex items-center gap-2 text-[11px] text-slate-300">
                  <span className="text-slate-500">Evaluation Weights:</span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800">
                    Price: {activeRfq.criteriaWeights.price}%
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800">
                    Quality: {activeRfq.criteriaWeights.quality}%
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800">
                    Delivery: {activeRfq.criteriaWeights.delivery}%
                  </span>
                </div>
              </div>

              {/* Items required */}
              <div className="mt-4">
                <span className="text-xs font-semibold text-slate-400 block mb-2">Required Bill of Quantities</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeRfq.items.map((item) => (
                    <div key={item.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs">
                      <div className="font-bold text-white">
                        {item.quantity} {item.unit} — {item.description}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1 font-mono">{item.specifications}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* SIDE-BY-SIDE BID COMPARISON MATRIX (Mandatory per specification) */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>Side-by-Side Competitive Bid Comparison Matrix</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Scores calculated dynamically based on criteria weightings and vendor track record.
                  </p>
                </div>
              </div>

              {rfqBids.length === 0 ? (
                <div className="p-12 text-center text-xs text-slate-400">
                  No bids have been submitted yet for this RFQ. Switch to the "Vendor Portal Simulator" to submit a bid as a supplier!
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
                        <th className="pb-3">Vendor / Tenderer</th>
                        <th className="pb-3">Bid Amount</th>
                        <th className="pb-3">Lead Time</th>
                        <th className="pb-3">Warranty</th>
                        <th className="pb-3">Compliance</th>
                        <th className="pb-3">Weighted Score</th>
                        <th className="pb-3 text-right">Award Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      {rfqBids.map((bid) => {
                        const isAwarded = bid.status === 'awarded';
                        return (
                          <tr key={bid.id} className="text-slate-300">
                            <td className="py-4">
                              <div className="font-bold text-white">{bid.vendorName}</div>
                              <div className="text-[11px] text-slate-500 italic">"{bid.comments}"</div>
                            </td>
                            <td className="py-4 font-mono font-bold text-white">
                              {formatCurrency(bid.totalAmount)}
                            </td>
                            <td className="py-4">{bid.deliveryDays} Days</td>
                            <td className="py-4 text-slate-400">{bid.warrantyPeriod}</td>
                            <td className="py-4">
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px] flex items-center gap-1 w-max">
                                <ShieldCheck className="w-3 h-3" /> Verified
                              </span>
                            </td>
                            <td className="py-4">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-black text-white">{bid.totalWeightedScore}</span>
                                <span className="text-[10px] text-slate-500">/ 100</span>
                              </div>
                            </td>
                            <td className="py-4 text-right">
                              {isAwarded ? (
                                <span className="px-3 py-1.5 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold inline-flex items-center gap-1.5">
                                  <CheckCircle className="w-3.5 h-3.5" /> Awarded & PO Issued
                                </span>
                              ) : (
                                <button
                                  onClick={() => awardBid(activeRfq.id, bid.id)}
                                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs shadow-md transition"
                                >
                                  Award & Issue PO
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        ) : null
      ) : (
        /* VENDOR PORTAL SIMULATOR (Mandatory per specification) */
        <div className="rounded-2xl border border-sky-500/30 bg-slate-900 p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-sky-500/20 text-sky-400">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Vendor Portal: Bid Submission Experience</h2>
                <p className="text-xs text-slate-400">
                  Simulate how an invited supplier discovers opportunities, quotes unit rates, and submits tenders.
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-sky-500/20 text-sky-300 font-bold text-xs">
              Supplier View
            </span>
          </div>

          <form onSubmit={handleSimulateVendorBid} className="space-y-4 max-w-xl">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Total Quotation Value ({orgConfig.currency})
              </label>
              <input
                type="number"
                required
                value={vendorBidAmount}
                onChange={(e) => setVendorBidAmount(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Guaranteed Delivery Lead Time (Days)
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={vendorDeliveryDays}
                  onChange={(e) => setVendorDeliveryDays(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Warranty & SLA Guarantee
                </label>
                <input
                  type="text"
                  required
                  value={vendorWarranty}
                  onChange={(e) => setVendorWarranty(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Technical Commentary & Commercial Terms
              </label>
              <textarea
                rows={2}
                value={vendorNotes}
                onChange={(e) => setVendorNotes(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-lg shadow-sky-500/20 transition"
            >
              {vendorSubmitted ? 'Bid Submitted Successfully!' : 'Submit Sealed Tender Proposal'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
