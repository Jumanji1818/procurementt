import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Building2,
  Users,
  Package,
  CreditCard,
  FileCheck2,
  TrendingUp,
  Cpu,
  Smartphone,
  ChevronDown,
  Layers,
  Globe2,
  Laptop,
  Store,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setActiveView, loadPreset } = useApp();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const workflowSteps = [
    { num: '01', title: 'Request Created', desc: 'Itemized line specs & budget allocations', role: 'Requester' },
    { num: '02', title: 'Approval Matrix', desc: 'Automated policy & multi-tier authorization', role: 'Approvers' },
    { num: '03', title: 'Competitive RFQ', desc: 'Publish tender & invite verified suppliers', role: 'Procurement' },
    { num: '04', title: 'Weighted Scoring', desc: 'Price, quality & SLA comparison matrix', role: 'Committee' },
    { num: '05', title: 'Purchase Order', desc: 'Direct contract award and PO transmission', role: 'Vendor' },
    { num: '06', title: 'Goods Receipt', desc: 'Delivery verification & automated stock sync', role: 'Warehouse' },
    { num: '07', title: '3-Way Matching', desc: 'Automated PO vs GRN vs Invoice audit', role: 'Finance' },
    { num: '08', title: 'Payment Release', desc: 'Discrepancy-free disbursement & audit trail', role: 'Treasury' },
  ];

  const faqs = [
    {
      q: 'Does Procura work for a 1-person shop or freelancer?',
      a: 'Absolutely. In 1-person mode, Procura automatically disables departments, approval matrices, and multi-tier tenders, leaving a lightning-fast purchasing, supplier tracking, and invoice register.',
    },
    {
      q: 'How does the automated inventory tracking work?',
      a: 'Whenever a Goods Received Note (GRN) is logged at a warehouse or site location, Procura automatically increments the corresponding SKU stock levels and logs a timestamped stock movement in the audit trail.',
    },
    {
      q: 'What is 3-Way Matching and how does it prevent fraud?',
      a: 'Procura compares the Purchase Order (what was ordered and at what price), the Goods Received Note (what was physically accepted), and the Supplier Invoice (what is billed). If the vendor over-bills or invoices for missing items, Procura automatically locks the payment and alerts finance.',
    },
    {
      q: 'Can I install this on my Android phone, iPhone, and laptop?',
      a: 'Yes! Procura is built as a Progressive Web Application (PWA) with native-like mobile bottom navigation, touch drawers, offline mode, and is packageable into a standalone Android APK via Capacitor.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#04140e] text-[#f1f5f3] selection:bg-[#d4af37] selection:text-[#051b14]">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-40 backdrop-blur-md bg-[#061e15]/95 border-b border-[#143e2f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#092b1f] border border-[#d4af37]/50 flex items-center justify-center font-black text-[#d4af37] text-base shadow-md">
              P
            </div>
            <div>
              <span className="font-extrabold text-white text-lg tracking-tight">Procura</span>
              <span className="text-[10px] text-[#d4af37] font-semibold block -mt-1 tracking-wider uppercase">
                Procurement OS
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
            <a href="#workflows" className="hover:text-[#d4af37] transition">Workflows</a>
            <a href="#adaptive" className="hover:text-[#d4af37] transition">Adaptive Engine</a>
            <a href="#matching" className="hover:text-[#d4af37] transition">3-Way Matching</a>
            <a href="#pricing" className="hover:text-[#d4af37] transition">Deployment</a>
            <a href="#faq" className="hover:text-[#d4af37] transition">FAQ</a>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setActiveView('auth')}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-[#0c2f21] transition cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveView('auth')}
              className="px-4 py-2 rounded-xl bg-[#d4af37] hover:bg-[#c49f2b] text-xs font-bold text-[#051b14] shadow-md shadow-[#d4af37]/20 transition active:scale-95 cursor-pointer"
            >
              Get Started / Register
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden bg-[#04140e]">
        {/* Glow backdrop */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#d4af37]/5 blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#082117] border border-[#d4af37]/30 text-[#d4af37] text-xs font-bold mb-6 shadow-inner">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Universal Adaptive Procurement Architecture • Enterprise RBAC</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] max-w-4xl mx-auto">
            From Solo Shops to Global Enterprises.{' '}
            <span className="text-[#d4af37] block mt-1">
              One Smart Procurement OS.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Eliminate purchasing chaos. Configurable approval workflows, automated multi-location inventory sync, competitive RFQ bidding, and automated 3-way invoice matching tailored to your exact business size.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={() => setActiveView('auth')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#d4af37] hover:bg-[#c49f2b] text-[#051b14] font-bold text-sm shadow-xl shadow-[#d4af37]/20 transition transform hover:scale-[1.02] cursor-pointer"
            >
              <span>Launch Workspace / Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveView('auth')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#082117] hover:bg-[#0c2d20] text-[#d4af37] border border-[#d4af37]/40 font-bold text-sm transition cursor-pointer"
            >
              <Store className="w-4 h-4 text-[#d4af37]" />
              <span>Supplier & Vendor Portal</span>
            </button>

            <button
              onClick={() => setActiveView('onboarding')}
              className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-[#051710] hover:bg-[#0c2f21] text-slate-300 border border-[#143e2f] font-semibold text-sm transition cursor-pointer"
            >
              <Building2 className="w-4 h-4 text-emerald-400" />
              <span>Configure Organization</span>
            </button>
          </div>

          {/* Quick Preset Selector Buttons */}
          <div className="mt-10 pt-6 border-t border-[#143e2f] max-w-3xl mx-auto flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs">
            <span className="text-slate-400 font-semibold">Test Business Presets:</span>
            <button
              onClick={() => loadPreset('individual')}
              className="px-3 py-1.5 rounded-lg bg-[#082117] hover:bg-[#0c2d20] border border-[#143e2f] hover:border-[#d4af37]/50 text-slate-300 transition cursor-pointer"
            >
              Solo Freelancer (1 User)
            </button>
            <button
              onClick={() => loadPreset('retail')}
              className="px-3 py-1.5 rounded-lg bg-[#082117] hover:bg-[#0c2d20] border border-[#143e2f] hover:border-[#d4af37]/50 text-slate-300 transition cursor-pointer"
            >
              Retail Store (Stock & Goods)
            </button>
            <button
              onClick={() => loadPreset('smb')}
              className="px-3 py-1.5 rounded-lg bg-[#082117] hover:bg-[#0c2d20] border border-[#143e2f] hover:border-[#d4af37]/50 text-slate-300 transition cursor-pointer"
            >
              Mid-size Tech Startup
            </button>
            <button
              onClick={() => loadPreset('enterprise')}
              className="px-3 py-1.5 rounded-lg bg-[#0d3b2b] border border-[#d4af37] text-[#d4af37] font-bold transition cursor-pointer"
            >
              Enterprise Conglomerate
            </button>
          </div>
        </div>
      </section>

      {/* Live Command Center Preview Card */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-10 mb-20 relative z-20">
        <div className="rounded-3xl border border-[#143e2f] bg-[#082117] shadow-2xl p-4 sm:p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between pb-4 border-b border-[#143e2f] text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-[#d4af37] inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="font-mono text-slate-400 ml-2">procura.app/command-center</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-[#d4af37] font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-ping" />
              Real-time 3-Way Audit Engine Active
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-[#051710] border border-[#143e2f]">
              <span className="text-[11px] text-slate-400 font-medium">Annual Procurement Spend</span>
              <div className="text-xl font-extrabold text-white mt-0.5">$487,250.00</div>
              <span className="text-[10px] text-emerald-400 font-semibold">↑ 14% optimized with RFQs</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#051710] border border-[#143e2f]">
              <span className="text-[11px] text-slate-400 font-medium">Active Purchase Orders</span>
              <div className="text-xl font-extrabold text-white mt-0.5">28 Orders</div>
              <span className="text-[10px] text-[#d4af37] font-semibold">3 In Transit • 1 Delayed</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#051710] border border-[#143e2f]">
              <span className="text-[11px] text-slate-400 font-medium">3-Way Match Rate</span>
              <div className="text-xl font-extrabold text-white mt-0.5">97.4%</div>
              <span className="text-[10px] text-amber-400 font-semibold">1 blocked over-billing</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#051710] border border-[#143e2f]">
              <span className="text-[11px] text-slate-400 font-medium">Supplier Compliance</span>
              <div className="text-xl font-extrabold text-white mt-0.5">99.1%</div>
              <span className="text-[10px] text-emerald-400 font-semibold">Tax & ISO verified</span>
            </div>
          </div>
        </div>
      </section>

      {/* End-to-End Workflow Timeline */}
      <section id="workflows" className="py-16 sm:py-24 bg-[#04140e] border-t border-[#143e2f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-xs font-bold text-[#d4af37] uppercase tracking-widest mb-2">
              End-To-End Procurement Architecture
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              One unbroken lifecycle from initial need to settled payment.
            </p>
            <p className="text-sm text-slate-400 mt-2">
              Every stage communicates with the next, eliminating duplicate data entry, rogue spending, and manual paper trails.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {workflowSteps.map((s) => (
              <div
                key={s.num}
                className="p-5 rounded-2xl bg-[#082117] border border-[#143e2f] hover:border-[#d4af37]/40 transition group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-black text-slate-500 group-hover:text-[#d4af37] transition font-mono">
                    {s.num}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#051710] border border-[#143e2f] text-[10px] font-semibold text-[#d4af37]">
                    {s.role}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mb-1">{s.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Adaptive Architecture: Small vs Large */}
      <section id="adaptive" className="py-16 sm:py-24 bg-[#061e15] border-t border-[#143e2f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-xs font-bold text-[#d4af37] uppercase tracking-widest mb-2">
              The Procura Adaptive Engine
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Simple for simple teams. Powerful for complex enterprises.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Small Business */}
            <div className="p-7 rounded-3xl bg-[#082117] border border-[#143e2f] relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-[#092b1f] text-[#d4af37] border border-[#d4af37]/30">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Small Shop & Freelancer Mode</h3>
                  <p className="text-xs text-slate-400">Zero unnecessary bureaucracy, 100% speed</p>
                </div>
              </div>
              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Direct Request → Order without departmental routing</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>No mandatory approval committees</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Fast supplier catalog and purchase orders</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Clean invoice inbox and payments ledger</span>
                </li>
              </ul>
              <button
                onClick={() => loadPreset('individual')}
                className="mt-6 w-full py-2.5 rounded-xl bg-[#051710] hover:bg-[#0c2f21] border border-[#143e2f] text-xs font-bold text-white transition cursor-pointer"
              >
                Experience Simple Mode
              </button>
            </div>

            {/* Enterprise */}
            <div className="p-7 rounded-3xl bg-[#082117] border border-[#d4af37]/40 relative shadow-xl shadow-[#d4af37]/5">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-[#092b1f] text-[#d4af37] border border-[#d4af37]/50">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Enterprise & Multi-Location Mode</h3>
                  <p className="text-xs text-slate-400">Full auditability, compliance & spend governance</p>
                </div>
              </div>
              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Configurable Multi-Tier Approval Matrix by threshold & category</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Automated 3-Way Matching Engine (PO vs GRN vs Invoice)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Competitive RFQ Tender Bidding with weighted scoring algorithms</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Automated Inventory Tracking across distributed warehouses</span>
                </li>
              </ul>
              <button
                onClick={() => loadPreset('enterprise')}
                className="mt-6 w-full py-2.5 rounded-xl bg-[#d4af37] hover:bg-[#c49f2b] text-[#051b14] text-xs font-bold transition shadow-md shadow-[#d4af37]/20 cursor-pointer"
              >
                Experience Enterprise Mode
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Way Matching & Security Spotlight */}
      <section id="matching" className="py-16 sm:py-24 bg-[#04140e] border-t border-[#143e2f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0d3b2b] border border-[#d4af37]/40 text-[#d4af37] text-xs font-bold mb-4">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Automated Financial Fraud Prevention</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Three-Way Matching that protects every dollar and naira.
            </h2>
            <p className="mt-4 text-sm text-slate-400 leading-relaxed">
              Never pay for goods that were never delivered, or unit prices higher than what was agreed upon in the purchase contract. Procura cross-checks POs against warehouse Goods Receipt Notes (GRN) before clearing any invoice.
            </p>

            <div className="mt-6 space-y-3">
              <div className="p-3.5 rounded-xl bg-[#082117] border border-[#143e2f] flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-[#092b1f] text-[#d4af37] border border-[#d4af37]/30 flex items-center justify-center font-bold text-xs flex-shrink-0">
                  PO
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Purchase Order Verification</div>
                  <div className="text-[11px] text-slate-400">Verifies items, quantities ordered, and contracted unit price.</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#082117] border border-[#143e2f] flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-[#092b1f] text-[#d4af37] border border-[#d4af37]/30 flex items-center justify-center font-bold text-xs flex-shrink-0">
                  GRN
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Goods Receipt Note (GRN) Audit</div>
                  <div className="text-[11px] text-slate-400">Verifies physically inspected & accepted counts, deducting damages.</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#082117] border border-[#143e2f] flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-[#092b1f] text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-xs flex-shrink-0">
                  INV
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Automated Discrepancy Flagging</div>
                  <div className="text-[11px] text-slate-400">Blocks payment and creates an Exception Alert if there is variance.</div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-[#143e2f] bg-[#082117] p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#143e2f] text-xs">
              <span className="font-bold text-white">Live Discrepancy Example</span>
              <span className="px-2 py-0.5 rounded-full bg-rose-950/80 border border-rose-800 text-rose-400 font-semibold text-[10px]">
                Payment Locked
              </span>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-[#051710] border border-[#143e2f] flex justify-between items-center">
                <span className="text-slate-400">Purchase Order (PO-2026-118)</span>
                <span className="font-bold text-white">20 Units @ $95/unit</span>
              </div>
              <div className="p-3 rounded-xl bg-[#051710] border border-[#143e2f] flex justify-between items-center">
                <span className="text-slate-400">Goods Receipt (GRN-2026-077)</span>
                <span className="font-bold text-[#d4af37]">18 Units Received (2 Missing)</span>
              </div>
              <div className="p-3 rounded-xl bg-[#051710] border border-rose-500/30 flex justify-between items-center">
                <span className="text-slate-400">Vendor Invoice (INV-2026-091)</span>
                <span className="font-bold text-rose-400">Billed for 20 Units ($1,900)</span>
              </div>
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/40 text-rose-300 text-[11px] leading-relaxed">
                ⚠️ <strong>Audit Warning:</strong> Vendor billed for 2 unreceived units. Procura intercepted the overcharge ($190.00 saved).
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing / Deployment Tiers */}
      <section id="pricing" className="py-16 sm:py-24 bg-[#061e15] border-t border-[#143e2f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-xs font-bold text-[#d4af37] uppercase tracking-widest mb-2">
              Transparent Deployment Tiers
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Accessible for small traders. Scalable for national conglomerates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-[#082117] border border-[#143e2f] flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Solo & Small Shop</h3>
                <div className="text-3xl font-extrabold text-white mt-2 mb-1">$0 / Free</div>
                <p className="text-xs text-slate-400 mb-6">Forever free for independent traders and small offices.</p>
                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">✓ 1-5 users</li>
                  <li className="flex items-center gap-2">✓ Direct purchase requests & orders</li>
                  <li className="flex items-center gap-2">✓ Basic supplier directory</li>
                  <li className="flex items-center gap-2">✓ Invoice register</li>
                </ul>
              </div>
              <button
                onClick={() => loadPreset('individual')}
                className="mt-6 w-full py-2.5 rounded-xl bg-[#051710] hover:bg-[#0c2f21] border border-[#143e2f] text-xs font-bold text-white transition cursor-pointer"
              >
                Start Free
              </button>
            </div>

            <div className="p-6 rounded-3xl bg-[#082117] border border-[#d4af37] shadow-xl shadow-[#d4af37]/10 flex flex-col justify-between relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#d4af37] text-[#051b14] font-bold text-[10px] uppercase tracking-wider">
                Most Popular
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Growth Business</h3>
                <div className="text-3xl font-extrabold text-[#d4af37] mt-2 mb-1">$79 / mo</div>
                <p className="text-xs text-slate-400 mb-6">Designed for expanding teams requiring budget controls.</p>
                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">✓ Up to 50 users</li>
                  <li className="flex items-center gap-2">✓ Departmental cost centers</li>
                  <li className="flex items-center gap-2">✓ Automated Inventory increment per GRN</li>
                  <li className="flex items-center gap-2">✓ 3-Way Matching fraud protection</li>
                  <li className="flex items-center gap-2">✓ Multi-currency & multi-language</li>
                </ul>
              </div>
              <button
                onClick={() => loadPreset('smb')}
                className="mt-6 w-full py-2.5 rounded-xl bg-[#d4af37] hover:bg-[#c49f2b] text-xs font-bold text-[#051b14] transition cursor-pointer"
              >
                Launch Growth Tier
              </button>
            </div>

            <div className="p-6 rounded-3xl bg-[#082117] border border-[#143e2f] flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Enterprise & Public</h3>
                <div className="text-3xl font-extrabold text-white mt-2 mb-1">$299 / mo</div>
                <p className="text-xs text-slate-400 mb-6">For hospitals, construction, universities & public bodies.</p>
                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">✓ Unlimited users & locations</li>
                  <li className="flex items-center gap-2">✓ Configurable Approval Matrix Rules</li>
                  <li className="flex items-center gap-2">✓ Competitive RFQ & Tender Bidding Portal</li>
                  <li className="flex items-center gap-2">✓ Immutable Audit Logs & AI Advisor</li>
                  <li className="flex items-center gap-2">✓ Standalone mobile deployment</li>
                </ul>
              </div>
              <button
                onClick={() => loadPreset('enterprise')}
                className="mt-6 w-full py-2.5 rounded-xl bg-[#051710] hover:bg-[#0c2f21] border border-[#143e2f] text-xs font-bold text-white transition cursor-pointer"
              >
                Launch Enterprise
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 sm:py-24 bg-[#04140e] border-t border-[#143e2f]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-xs font-bold text-[#d4af37] uppercase tracking-widest mb-2">Frequently Asked Questions</h2>
            <p className="text-3xl font-extrabold text-white">Everything you need to know about Procura.</p>
          </div>

          <div className="space-y-3">
            {faqs.map((f, i) => (
              <div
                key={i}
                className="rounded-2xl border border-[#143e2f] bg-[#082117] overflow-hidden transition"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between text-sm font-bold text-white cursor-pointer"
                >
                  <span>{f.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      activeFaq === i ? 'rotate-180 text-[#d4af37]' : ''
                    }`}
                  />
                </button>
                {activeFaq === i && (
                  <div className="px-5 pb-5 text-xs text-slate-300 leading-relaxed border-t border-[#143e2f] pt-3">
                    {f.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-[#061e15] border-t border-[#143e2f] text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#092b1f] border border-[#d4af37]/40 flex items-center justify-center font-bold text-xs text-[#d4af37]">
              P
            </div>
            <span className="font-bold text-white">Procura Smart Procurement OS</span>
            <span className="text-slate-500">— Enterprise Edition</span>
          </div>

          <div className="flex items-center gap-5 text-slate-300">
            <button onClick={() => setActiveView('auth')} className="hover:text-[#d4af37] transition font-medium">
              Enterprise Sign In
            </button>
            <button onClick={() => setActiveView('auth')} className="hover:text-[#d4af37] transition font-medium">
              Supplier Portal
            </button>
            <button onClick={() => setActiveView('auth')} className="hover:text-[#d4af37] transition font-medium">
              Register Company
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
