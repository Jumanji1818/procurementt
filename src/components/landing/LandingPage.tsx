import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Building2,
  Users,
  Package,
  CreditCard,
  FileCheck2,
  TrendingUp,
  FileText,
  FileSpreadsheet,
  ShoppingCart,
  Truck,
  ArrowRight,
  Sun,
  Moon,
  Layers,
  Store,
  CheckCircle2,
  Zap,
  Clock,
  ExternalLink,
  ChevronRight,
  Cpu
} from 'lucide-react';
import { UserRole } from '../../types';

export const LandingPage: React.FC = () => {
  const { setActiveView, switchRole, theme, toggleTheme, orgConfig } = useApp();

  const [activeTab, setActiveTab] = useState<'architecture' | 'workflow' | 'rbac' | 'threeway'>('workflow');

  const demoAccounts: {
    role: UserRole;
    name: string;
    title: string;
    department: string;
    avatar: string;
    icon: string;
    focus: string;
    targetView: 'dashboard' | 'requests' | 'approvals' | 'rfqs' | 'finance' | 'vendor_portal';
  }[] = [
    {
      role: 'procurement_officer',
      name: 'Sarah Jenkins',
      title: 'Chief Procurement Specialist',
      department: 'Sourcing & Supply Chain Office',
      avatar: 'SJ',
      icon: '📦',
      focus: 'Sourcing Queue, Tender Publishing, Bid Evaluation & PO Awards',
      targetView: 'dashboard',
    },
    {
      role: 'requester',
      name: 'Emmanuel Adebayo',
      title: 'Lead Operations Engineer',
      department: 'Operations & Facilities',
      avatar: 'EA',
      icon: '👤',
      focus: 'Submits Requisitions with itemized line specs & budget allocations',
      targetView: 'dashboard',
    },
    {
      role: 'approver',
      name: 'Dr. Michael Chen',
      title: 'Head of IT & Department Lead',
      department: 'Information Technology',
      avatar: 'MC',
      icon: '✍️',
      focus: 'Multi-Tier Budget Matrix, Policy Sign-Off & Requisition Authorization',
      targetView: 'approvals',
    },
    {
      role: 'vendor',
      name: 'Marcus Vance',
      title: 'External Supplier Representative',
      department: 'Nexus Logistics Partner',
      avatar: 'MV',
      icon: '🏢',
      focus: 'Vendor Portal: Tender Quotes, PO Confirmation, Waybills & Invoicing',
      targetView: 'vendor_portal',
    },
    {
      role: 'finance',
      name: 'Fatima Al-Mansoor',
      title: 'Senior Financial Comptroller',
      department: 'Finance & Treasury',
      avatar: 'FA',
      icon: '💳',
      focus: 'Automated 3-Way Matching (PO vs GRN vs Invoice) & Payment Release',
      targetView: 'finance',
    },
    {
      role: 'owner',
      name: 'Alhaji Tariq Danjuma',
      title: 'Managing Director / Executive',
      department: 'Executive Governance',
      avatar: 'TD',
      icon: '👔',
      focus: 'Enterprise Dashboard, Policy Settings & Immutable SHA-256 Audit Trail',
      targetView: 'dashboard',
    },
  ];

  const handleLaunchRole = (role: UserRole, targetView: any) => {
    switchRole(role);
    setActiveView(targetView);
  };

  const workflowPipeline = [
    {
      step: '01',
      title: 'Departmental Requisition',
      actor: 'Employee / Requester',
      action: 'Itemized line specs, estimated budget, urgency priority & justification.',
      status: 'Initial Submission',
    },
    {
      step: '02',
      title: 'Multi-Tier Approval Matrix',
      actor: 'Department Approver / Lead',
      action: 'Automated policy enforcement, departmental budget verification & digital sign-off.',
      status: 'Authorization',
    },
    {
      step: '03',
      title: 'Procurement Sourcing Queue',
      actor: 'Procurement Officer',
      action: 'Consolidates requisitions, converts to competitive RFQ tenders or direct POs.',
      status: 'Sourcing',
    },
    {
      step: '04',
      title: 'Competitive Supplier Bidding',
      actor: 'External Vendors / Suppliers',
      action: 'Invited vendors submit itemized unit quotes, lead times & compliance documents.',
      status: 'Tender Quoting',
    },
    {
      step: '05',
      title: 'PO Award & Transmission',
      actor: 'Procurement & Vendor',
      action: 'Automated bid evaluation matrix, legal PO issuance & supplier delivery confirmation.',
      status: 'Contract Award',
    },
    {
      step: '06',
      title: 'Goods Received Note (GRN)',
      actor: 'Warehouse / Storekeeper',
      action: 'Physical inspection upon arrival; automatic SKU inventory increment & damage log.',
      status: 'Stock Reconciliation',
    },
    {
      step: '07',
      title: 'Algorithmic 3-Way Match',
      actor: 'Finance Comptroller',
      action: 'Tri-party audit: Purchase Order vs Delivery GRN vs Supplier Invoice verification.',
      status: 'Fraud Prevention',
    },
    {
      step: '08',
      title: 'Payment Release & Audit',
      actor: 'Treasury & Compliance',
      action: 'Disbursement release with cryptographic, tamper-evident audit ledger entries.',
      status: 'Settlement Complete',
    },
  ];

  return (
    <div className="min-h-screen bg-[#04140e] text-[#f1f5f3] selection:bg-[#d4af37] selection:text-[#051b14] overflow-x-hidden">
      {/* Top Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[#061e15]/98 border-b border-[#143e2f] px-4 sm:px-8 h-16 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-[#092b1f] border border-[#d4af37]/50 flex items-center justify-center font-black text-[#d4af37] text-base shadow-sm">
            P
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-base tracking-tight leading-none">
                Procura
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#0d3b2b] text-[#d4af37] font-bold uppercase tracking-wider border border-[#d4af37]/30">
                Enterprise OS
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
              Final Year Project Demonstration Gateway
            </span>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md bg-[#082117] hover:bg-[#0c2d20] border border-[#143e2f] text-[#d4af37] transition cursor-pointer"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-[#d4af37]" /> : <Moon className="w-4 h-4 text-[#d4af37]" />}
          </button>

          <button
            onClick={() => setActiveView('onboarding')}
            className="px-3.5 py-1.5 rounded-md bg-[#082117] hover:bg-[#0c2d20] border border-[#143e2f] text-slate-200 text-xs font-semibold transition cursor-pointer hidden sm:flex items-center gap-1.5"
          >
            <Building2 className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Configure Organization</span>
          </button>

          <button
            onClick={() => {
              switchRole('owner');
              setActiveView('dashboard');
            }}
            className="px-4 py-2 rounded-md bg-[#d4af37] hover:bg-[#c49f2b] text-[#051b14] text-xs font-bold transition shadow-sm cursor-pointer flex items-center gap-1.5"
          >
            <span>Launch Workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-10 pb-12 sm:pt-14 sm:pb-16 px-4 sm:px-8 border-b border-[#143e2f] bg-[#04140e]">
        <div className="max-w-6xl mx-auto text-left space-y-6">
          {/* Capstone Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#082117] border border-[#d4af37]/40 text-[#d4af37] text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
            <span>Academic Capstone Presentation System • Segregation of Duties (SoD) Verified</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Enterprise Procurement, Multi-Tier Governance & Supply Chain Engine
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
              A fully integrated, role-segregated operations portal automating the complete purchasing lifecycle:
              from employee requisition and departmental budget authorization, to competitive RFQ vendor bidding, warehouse delivery inspection, and automated 3-way invoice matching.
            </p>
          </div>

          {/* Quick Launch Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => handleLaunchRole('procurement_officer', 'dashboard')}
              className="px-4 py-2.5 rounded-md bg-[#d4af37] hover:bg-[#c49f2b] text-[#051b14] text-xs font-bold transition shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <Package className="w-4 h-4" />
              <span>Enter as Procurement Officer</span>
            </button>

            <button
              onClick={() => handleLaunchRole('vendor', 'vendor_portal')}
              className="px-4 py-2.5 rounded-md bg-[#082117] hover:bg-[#0c2d20] text-[#d4af37] border border-[#d4af37]/40 text-xs font-bold transition shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <Store className="w-4 h-4" />
              <span>Enter External Supplier Portal</span>
            </button>

            <button
              onClick={() => handleLaunchRole('finance', 'finance')}
              className="px-4 py-2.5 rounded-md bg-[#082117] hover:bg-[#0c2d20] text-slate-200 border border-[#143e2f] text-xs font-semibold transition flex items-center gap-2 cursor-pointer"
            >
              <CreditCard className="w-4 h-4 text-emerald-400" />
              <span>3-Way Match & Finance Desk</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Presentation Body */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-10 space-y-12">
        {/* SECTION 1: Inter-Account Multi-Role Matrix */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#143e2f] pb-3">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-[#d4af37]" />
                <span>Inter-Account Operational Matrix (Simulate Any Department)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Click any role card below to test live segregation-of-duties and real-time inter-account requisition routing.
              </p>
            </div>
            <span className="text-[11px] text-[#d4af37] font-semibold self-start sm:self-auto">
              6 Interconnected Accounts
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {demoAccounts.map((account) => (
              <div
                key={account.role}
                onClick={() => handleLaunchRole(account.role, account.targetView)}
                className="p-4 rounded-lg bg-[#082117] border border-[#143e2f] hover:border-[#d4af37]/50 hover:bg-[#0c2d20] transition cursor-pointer flex flex-col justify-between group shadow-sm"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-md bg-[#092b1f] border border-[#d4af37]/30 flex items-center justify-center text-base font-bold text-[#d4af37]">
                        {account.avatar}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-[#d4af37] transition">
                          {account.name}
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium">
                          {account.title}
                        </div>
                      </div>
                    </div>
                    <span className="text-lg">{account.icon}</span>
                  </div>

                  <div className="mt-3 py-1 px-2 rounded bg-[#051710] border border-[#143e2f] text-[10px] text-[#d4af37] font-semibold">
                    {account.department}
                  </div>

                  <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
                    {account.focus}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#143e2f] flex items-center justify-between text-xs font-bold text-[#d4af37]">
                  <span>Launch Session ➔</span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                    {account.role.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 2: End-to-End Enterprise Procurement Lifecycle Diagram */}
        <section className="space-y-4">
          <div className="border-b border-[#143e2f] pb-3">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-[#d4af37]" />
              <span>Full-Cycle Procurement Workflow Architecture</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              The 8-stage automated pipeline implemented for rigorous supply chain governance and thesis demonstration.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {workflowPipeline.map((step) => (
              <div
                key={step.step}
                className="p-4 rounded-lg bg-[#082117] border border-[#143e2f] space-y-2 relative shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[#d4af37] font-mono">{step.step}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#051710] text-slate-400 border border-[#143e2f] font-semibold">
                    {step.status}
                  </span>
                </div>
                <h3 className="text-xs font-bold text-white">{step.title}</h3>
                <div className="text-[10px] text-[#d4af37] font-semibold">{step.actor}</div>
                <p className="text-[11px] text-slate-300 leading-relaxed">{step.action}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 3: Technical Specifications & Academic Defense Notes */}
        <section className="p-6 rounded-xl bg-[#082117] border border-[#143e2f] space-y-4 shadow-sm text-left">
          <div className="flex items-center gap-2 pb-3 border-b border-[#143e2f]">
            <Cpu className="w-5 h-5 text-[#d4af37]" />
            <h2 className="text-base font-bold text-white">System Governance & Architectural Specifications</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-lg bg-[#051710] border border-[#143e2f] space-y-1.5">
              <div className="font-bold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Segregation of Duties (SoD)</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Hard role boundaries prevent collusion: Requesters cannot approve their own requests; Procurement officers cannot approve payouts; Finance cannot fabricate POs.
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-[#051710] border border-[#143e2f] space-y-1.5">
              <div className="font-bold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Automated 3-Way Match</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Algorithmic line-item reconciliation between Purchase Orders, Warehouse GRNs, and Vendor Invoices. Overbilling or damaged deliveries immediately lock disbursement.
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-[#051710] border border-[#143e2f] space-y-1.5">
              <div className="font-bold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Immutable Audit Ledger</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Every authorization, RFQ tender publication, bid submission, delivery receipt, and financial transaction is logged with timestamps and operator identity.
              </p>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border-t border-[#143e2f]">
            <span className="text-slate-400">
              Active Organization: <strong className="text-white">{orgConfig.name}</strong> • Currency: <strong>{orgConfig.currency}</strong>
            </span>
            <button
              onClick={() => {
                switchRole('owner');
                setActiveView('dashboard');
              }}
              className="px-4 py-2 rounded-md bg-[#d4af37] hover:bg-[#c49f2b] text-[#051b14] font-bold text-xs transition cursor-pointer self-start sm:self-auto"
            >
              Enter Main Dashboard
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#143e2f] py-6 px-4 text-center text-xs text-slate-500 bg-[#061e15]">
        <p>Procura Enterprise Procurement & Supply Chain OS • Built for Final Year Project Defense</p>
      </footer>
    </div>
  );
};
