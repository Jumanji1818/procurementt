import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ApprovalWorkflowType,
  BusinessType,
  CurrencyCode,
  SupportedLanguage,
  TeamSize,
} from '../../types';
import {
  Building2,
  Users,
  Layers,
  CheckCircle,
  FileSpreadsheet,
  Package,
  CreditCard,
  MapPin,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Briefcase,
  Store,
  User,
  Factory,
  HardHat,
  Stethoscope,
  GraduationCap,
  Globe2,
} from 'lucide-react';

export const OnboardingWizard: React.FC = () => {
  const { orgConfig, updateOrgConfig, setActiveView, loadPreset } = useApp();

  const [step, setStep] = useState(1);
  const totalSteps = 10;

  // Form states
  const [name, setName] = useState(orgConfig.name || 'My Organization');
  const [businessType, setBusinessType] = useState<BusinessType>(orgConfig.businessType);
  const [teamSize, setTeamSize] = useState<TeamSize>(orgConfig.teamSize);
  const [hasDepartments, setHasDepartments] = useState(orgConfig.hasDepartments);
  const [approvalWorkflow, setApprovalWorkflow] = useState<ApprovalWorkflowType>(orgConfig.approvalWorkflow);
  const [hasSuppliers, setHasSuppliers] = useState(orgConfig.hasSuppliers);
  const [hasRfqs, setHasRfqs] = useState(orgConfig.hasRfqs);
  const [hasBudgets, setHasBudgets] = useState(orgConfig.hasBudgets);
  const [hasPhysicalGoods, setHasPhysicalGoods] = useState(orgConfig.hasPhysicalGoods);
  const [hasInvoicesPayments, setHasInvoicesPayments] = useState(orgConfig.hasInvoicesPayments);
  const [hasMultipleLocations, setHasMultipleLocations] = useState(orgConfig.hasMultipleLocations);
  const [currency, setCurrency] = useState<CurrencyCode>(orgConfig.currency);
  const [language, setLanguage] = useState<SupportedLanguage>(orgConfig.language);

  const businessTypes: { type: BusinessType; label: string; icon: React.ElementType; desc: string }[] = [
    { type: 'individual', label: 'Individual / Freelancer', icon: User, desc: 'Solo operations, no bureaucracy' },
    { type: 'small_business', label: 'Small Business / Shop', icon: Store, desc: 'Nimble teams, direct orders' },
    { type: 'corporation', label: 'Corporation / Enterprise', icon: Building2, desc: 'Multi-tiered, advanced matrix' },
    { type: 'construction', label: 'Construction & Civil', icon: HardHat, desc: 'Material specs, heavy deliveries' },
    { type: 'healthcare', label: 'Hospital / Healthcare', icon: Stethoscope, desc: 'Consumables & clinical equipment' },
    { type: 'education', label: 'School / University', icon: GraduationCap, desc: 'Faculty grants & campus logistics' },
    { type: 'manufacturing', label: 'Manufacturing / Factory', icon: Factory, desc: 'Raw inventory & high throughput' },
    { type: 'services', label: 'Professional Services', icon: Briefcase, desc: 'Software, consulting, operational tools' },
  ];

  const handleFinish = () => {
    updateOrgConfig({
      name,
      businessType,
      teamSize,
      hasDepartments,
      approvalWorkflow,
      hasSuppliers,
      hasRfqs,
      hasBudgets,
      hasPhysicalGoods,
      hasInvoicesPayments,
      hasMultipleLocations,
      currency,
      language,
      onboardingCompleted: true,
    });
    setActiveView('dashboard');
  };

  return (
    <div className="min-h-screen bg-[#04140e] text-[#f1f5f3] flex flex-col justify-between p-4 sm:p-8 selection:bg-[#d4af37] selection:text-[#051b14]">
      {/* Top Header */}
      <div className="max-w-4xl w-full mx-auto flex items-center justify-between py-2 border-b border-[#143e2f]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#092b1f] border border-[#d4af37]/40 flex items-center justify-center font-bold text-lg text-[#d4af37] shadow-md shadow-[#d4af37]/10">
            P
          </div>
          <div>
            <span className="font-extrabold text-white text-base tracking-tight">Procura</span>
            <span className="text-[10px] text-[#d4af37] block -mt-1 font-semibold uppercase tracking-wider">
              Setup Wizard
            </span>
          </div>
        </div>

        {/* 1-Click Quick Presets for rapid evaluation */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs">
          <span className="text-slate-400 mr-1 text-[11px]">Quick Presets:</span>
          <button
            onClick={() => loadPreset('individual')}
            className="px-2.5 py-1 rounded-lg bg-[#051710] border border-[#143e2f] hover:border-[#d4af37] text-slate-300 transition text-[11px] cursor-pointer"
          >
            Solo Freelancer
          </button>
          <button
            onClick={() => loadPreset('retail')}
            className="px-2.5 py-1 rounded-lg bg-[#051710] border border-[#143e2f] hover:border-[#d4af37] text-slate-300 transition text-[11px] cursor-pointer"
          >
            Retail Shop
          </button>
          <button
            onClick={() => loadPreset('enterprise')}
            className="px-2.5 py-1 rounded-lg bg-[#0d3b2b] border border-[#d4af37] hover:bg-[#0f4633] text-[#d4af37] font-bold transition text-[11px] cursor-pointer"
          >
            Full Enterprise
          </button>
        </div>
      </div>

      {/* Main Wizard Card */}
      <div className="max-w-3xl w-full mx-auto my-8 bg-[#082117] border border-[#143e2f] rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-medium text-[#d4af37] uppercase tracking-wider text-[11px]">
              Step {step} of {totalSteps}
            </span>
            <span>{Math.round((step / totalSteps) * 100)}% Completed</span>
          </div>
          <div className="w-full h-1.5 bg-[#051710] rounded-full overflow-hidden border border-[#143e2f]">
            <div
              className="h-full bg-[#d4af37] transition-all duration-300 rounded-full"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Organization Type & Name */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Step 1 — What are you?</h2>
              <p className="text-xs text-slate-400 mt-1">
                Procura adapts its terminology, procurement workflows, and dashboard cards based on your industry.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Organization / Business Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Apex Global, Metro Health, City Construction"
                className="w-full bg-[#051710] border border-[#143e2f] rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {businessTypes.map((b) => {
                const Icon = b.icon;
                const isSelected = businessType === b.type;
                return (
                  <button
                    key={b.type}
                    onClick={() => {
                      setBusinessType(b.type);
                      if (b.type === 'individual') {
                        setTeamSize('1');
                        setHasDepartments(false);
                        setApprovalWorkflow('none');
                        setHasMultipleLocations(false);
                      }
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? 'border-[#d4af37] bg-[#0d3b2b] text-white shadow-lg shadow-[#d4af37]/10'
                        : 'border-[#143e2f] bg-[#051710] hover:bg-[#0c2d20] text-slate-300'
                    }`}
                  >
                    <Icon className={`w-6 h-6 mb-2 ${isSelected ? 'text-[#d4af37]' : 'text-slate-400'}`} />
                    <div>
                      <div className="text-xs font-bold text-white">{b.label}</div>
                      <div className="text-[10px] text-slate-400 leading-tight mt-0.5">{b.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Team Size */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Step 2 — How many people will use Procura?</h2>
              <p className="text-xs text-slate-400 mt-1">
                Whether you're operating solo or orchestrating 500+ employees across continents, Procura scales with you.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {(['1', '2-5', '6-20', '21-100', '101-500', '500+'] as TeamSize[]).map((size) => (
                <button
                  key={size}
                  onClick={() => {
                    setTeamSize(size);
                    if (size === '1') {
                      setHasDepartments(false);
                      setApprovalWorkflow('none');
                    }
                  }}
                  className={`p-5 rounded-2xl border text-center transition cursor-pointer ${
                    teamSize === size
                      ? 'border-[#d4af37] bg-[#0d3b2b] text-white font-bold shadow-md shadow-[#d4af37]/10'
                      : 'border-[#143e2f] bg-[#051710] hover:bg-[#0c2d20] text-slate-300'
                  }`}
                >
                  <Users className="w-6 h-6 mx-auto mb-2 text-[#d4af37]" />
                  <div className="text-base font-bold">{size === '1' ? 'Just Me' : `${size} People`}</div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    {size === '1'
                      ? 'No departmental overhead'
                      : size === '2-5'
                      ? 'Lean agile team'
                      : size === '6-20'
                      ? 'Growing business'
                      : 'Mid & large enterprise'}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Departments */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Step 3 — Do you operate with departments?</h2>
              <p className="text-xs text-slate-400 mt-1">
                If No, Procura removes all department selectors, heads, and routing so your workflows stay clean.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => setHasDepartments(false)}
                className={`p-6 rounded-2xl border text-left transition cursor-pointer ${
                  !hasDepartments
                    ? 'border-[#d4af37] bg-[#0d3b2b] text-white shadow-md'
                    : 'border-[#143e2f] bg-[#051710] text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="text-base font-bold text-white mb-1">No Departments</div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  All requests and spend are tracked at the organization level without departmental silos.
                </p>
              </button>

              <button
                onClick={() => setHasDepartments(true)}
                className={`p-6 rounded-2xl border text-left transition cursor-pointer ${
                  hasDepartments
                    ? 'border-[#d4af37] bg-[#0d3b2b] text-white shadow-md'
                    : 'border-[#143e2f] bg-[#051710] text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="text-base font-bold text-white mb-1">Yes, We Have Departments</div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Enables department heads, departmental budget allocations, cost centers, and departmental approval rules.
                </p>
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Approval Workflows */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Step 4 — Do purchases require approval?</h2>
              <p className="text-xs text-slate-400 mt-1">
                Configure your governance level: from zero approvals for solo operators to multi-level matrix checks.
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  type: 'none' as ApprovalWorkflowType,
                  title: 'No Approval Required',
                  desc: 'Requesters directly issue purchase orders without waiting for management authorization.',
                },
                {
                  type: 'simple' as ApprovalWorkflowType,
                  title: 'Simple Approval (1-Level)',
                  desc: 'Every purchase request is routed to the business owner or designated manager for signoff.',
                },
                {
                  type: 'multi_level' as ApprovalWorkflowType,
                  title: 'Multiple Approval Levels',
                  desc: 'Sequential signoffs: Requester → Department Head → Finance Comptroller → Executive.',
                },
                {
                  type: 'configurable_matrix' as ApprovalWorkflowType,
                  title: 'Configurable Approval Matrix Rules',
                  desc: 'Rules driven by spend thresholds, categories, departmental budgets, and vendor risk levels.',
                },
              ].map((wf) => (
                <button
                  key={wf.type}
                  onClick={() => setApprovalWorkflow(wf.type)}
                  className={`w-full p-4 rounded-2xl border text-left transition flex items-start gap-4 cursor-pointer ${
                    approvalWorkflow === wf.type
                      ? 'border-[#d4af37] bg-[#0d3b2b] text-white shadow-md'
                      : 'border-[#143e2f] bg-[#051710] text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div
                    className={`p-2 rounded-xl mt-0.5 ${
                      approvalWorkflow === wf.type ? 'bg-[#d4af37] text-[#051b14]' : 'bg-[#092b1f] text-slate-400'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{wf.title}</div>
                    <div className="text-xs text-slate-300 mt-0.5">{wf.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: External Suppliers */}
        {step === 5 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Step 5 — Do you work with external suppliers?</h2>
              <p className="text-xs text-slate-400 mt-1">
                Enable vendor directories, document expiry reminders, compliance verification, and performance scoring.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => setHasSuppliers(true)}
                className={`p-6 rounded-2xl border text-left transition cursor-pointer ${
                  hasSuppliers
                    ? 'border-[#d4af37] bg-[#0d3b2b] text-white shadow-md'
                    : 'border-[#143e2f] bg-[#051710] text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="text-base font-bold text-white mb-1">Yes, Manage External Suppliers</div>
                <p className="text-xs text-slate-300">
                  Enables Supplier Management Center, Vendor Scorecards, Tax Clearance tracking, and Marketplace.
                </p>
              </button>

              <button
                onClick={() => setHasSuppliers(false)}
                className={`p-6 rounded-2xl border text-left transition cursor-pointer ${
                  !hasSuppliers
                    ? 'border-[#d4af37] bg-[#0d3b2b] text-white shadow-md'
                    : 'border-[#143e2f] bg-[#051710] text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="text-base font-bold text-white mb-1">No External Suppliers</div>
                <p className="text-xs text-slate-300">
                  Internal purchasing only without vendor registration or supplier portal.
                </p>
              </button>
            </div>
          </div>
        )}

        {/* Step 6: Requests for Quotations (RFQs) */}
        {step === 6 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Step 6 — Do you issue RFQs / Tender Bidding?</h2>
              <p className="text-xs text-slate-400 mt-1">
                Invite multiple suppliers, set weighted criteria (Price 40%, Quality 25%, Delivery 20%), compare side-by-side.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => setHasRfqs(true)}
                className={`p-6 rounded-2xl border text-left transition cursor-pointer ${
                  hasRfqs
                    ? 'border-[#d4af37] bg-[#0d3b2b] text-white shadow-md'
                    : 'border-[#143e2f] bg-[#051710] text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="text-base font-bold text-white mb-1">Enable RFQs & Competitive Bidding</div>
                <p className="text-xs text-slate-300">
                  Includes tender publishing, vendor bidding portal, weighted evaluation matrix, and award generation.
                </p>
              </button>

              <button
                onClick={() => setHasRfqs(false)}
                className={`p-6 rounded-2xl border text-left transition cursor-pointer ${
                  !hasRfqs
                    ? 'border-[#d4af37] bg-[#0d3b2b] text-white shadow-md'
                    : 'border-[#143e2f] bg-[#051710] text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="text-base font-bold text-white mb-1">Direct Purchasing Only</div>
                <p className="text-xs text-slate-300">
                  Skip RFQs; issue Purchase Orders straight from approved requests or catalog items.
                </p>
              </button>
            </div>
          </div>
        )}

        {/* Step 7: Budgets */}
        {step === 7 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Step 7 — Do you manage budgets?</h2>
              <p className="text-xs text-slate-400 mt-1">
                Track allocated vs committed (POs in flight) vs spent amounts with automatic warning thresholds.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => setHasBudgets(true)}
                className={`p-6 rounded-2xl border text-left transition cursor-pointer ${
                  hasBudgets
                    ? 'border-[#d4af37] bg-[#0d3b2b] text-white shadow-md'
                    : 'border-[#143e2f] bg-[#051710] text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="text-base font-bold text-white mb-1">Enable Budget Controls</div>
                <p className="text-xs text-slate-300">
                  Enforces budget limits before purchase approval, alerts when approaching 80%, and blocks overruns.
                </p>
              </button>

              <button
                onClick={() => setHasBudgets(false)}
                className={`p-6 rounded-2xl border text-left transition cursor-pointer ${
                  !hasBudgets
                    ? 'border-[#d4af37] bg-[#0d3b2b] text-white shadow-md'
                    : 'border-[#143e2f] bg-[#051710] text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="text-base font-bold text-white mb-1">No Budget Restrictions</div>
                <p className="text-xs text-slate-300">
                  Purchases can be made without binding cost center budget allocations.
                </p>
              </button>
            </div>
          </div>
        )}

        {/* Step 8: Physical Goods & Inventory */}
        {step === 8 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Step 8 — Do you receive physical goods?</h2>
              <p className="text-xs text-slate-400 mt-1">
                Goods receipts automatically increment inventory stock levels per location, log damaged goods, and trigger returns.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => setHasPhysicalGoods(true)}
                className={`p-6 rounded-2xl border text-left transition cursor-pointer ${
                  hasPhysicalGoods
                    ? 'border-[#d4af37] bg-[#0d3b2b] text-white shadow-md'
                    : 'border-[#143e2f] bg-[#051710] text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="text-base font-bold text-white mb-1">Yes, Physical Goods & Warehouses</div>
                <p className="text-xs text-slate-300">
                  Enables Delivery tracking, Goods Receipts (GRN), Automated Inventory incrementing, and Return logs.
                </p>
              </button>

              <button
                onClick={() => setHasPhysicalGoods(false)}
                className={`p-6 rounded-2xl border text-left transition cursor-pointer ${
                  !hasPhysicalGoods
                    ? 'border-[#d4af37] bg-[#0d3b2b] text-white shadow-md'
                    : 'border-[#143e2f] bg-[#051710] text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="text-base font-bold text-white mb-1">Services & Digital Assets Only</div>
                <p className="text-xs text-slate-300">
                  No warehouse inventory or physical delivery tracking required.
                </p>
              </button>
            </div>
          </div>
        )}

        {/* Step 9: Invoices, 3-Way Match & Payments */}
        {step === 9 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Step 9 — Do you manage invoices and payments?</h2>
              <p className="text-xs text-slate-400 mt-1">
                Automated Three-Way Matching engine (PO vs GRN vs Invoice) to prevent fraud, over-billing, and missing goods.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => setHasInvoicesPayments(true)}
                className={`p-6 rounded-2xl border text-left transition cursor-pointer ${
                  hasInvoicesPayments
                    ? 'border-[#d4af37] bg-[#0d3b2b] text-white shadow-md'
                    : 'border-[#143e2f] bg-[#051710] text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="text-base font-bold text-white mb-1">Enable Finance & 3-Way Matching</div>
                <p className="text-xs text-slate-300">
                  Full invoice inbox, automatic discrepancy checks, approval on hold, and payment settlement queue.
                </p>
              </button>

              <button
                onClick={() => setHasInvoicesPayments(false)}
                className={`p-6 rounded-2xl border text-left transition cursor-pointer ${
                  !hasInvoicesPayments
                    ? 'border-[#d4af37] bg-[#0d3b2b] text-white shadow-md'
                    : 'border-[#143e2f] bg-[#051710] text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="text-base font-bold text-white mb-1">Simple Purchasing Only</div>
                <p className="text-xs text-slate-300">
                  Invoicing and bank settlements handled externally in external accounting software.
                </p>
              </button>
            </div>
          </div>
        )}

        {/* Step 10: Multi-Location, Currency & Language */}
        {step === 10 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Step 10 — Locations, Currency & Language</h2>
              <p className="text-xs text-slate-400 mt-1">
                Final step: Configure multi-branch logistics, default operating currency, and system interface language.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Multiple Locations / Branches?</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setHasMultipleLocations(true)}
                    className={`p-3 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                      hasMultipleLocations
                        ? 'border-[#d4af37] bg-[#0d3b2b] text-white shadow-md'
                        : 'border-[#143e2f] bg-[#051710] text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    Yes (HQ, Warehouses, Sites)
                  </button>
                  <button
                    onClick={() => setHasMultipleLocations(false)}
                    className={`p-3 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                      !hasMultipleLocations
                        ? 'border-[#d4af37] bg-[#0d3b2b] text-white shadow-md'
                        : 'border-[#143e2f] bg-[#051710] text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    Single Location
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Operating Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                    className="w-full bg-[#051710] border border-[#143e2f] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                  >
                    <option value="USD">USD ($) - US Dollar</option>
                    <option value="NGN">NGN (₦) - Nigerian Naira</option>
                    <option value="EUR">EUR (€) - Euro</option>
                    <option value="GBP">GBP (£) - British Pound</option>
                    <option value="KES">KES (KSh) - Kenyan Shilling</option>
                    <option value="JPY">JPY (¥) - Japanese Yen</option>
                    <option value="AED">AED (AED) - UAE Dirham</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Interface Language</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                    className="w-full bg-[#051710] border border-[#143e2f] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                  >
                    <option value="en">English (Global)</option>
                    <option value="fr">Français (French)</option>
                    <option value="es">Español (Spanish)</option>
                    <option value="ha">Hausa (Naija / West Africa)</option>
                    <option value="sw">Kiswahili (East Africa)</option>
                    <option value="ar">العربية (Arabic)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Footer Controls */}
        <div className="mt-8 pt-6 border-t border-[#143e2f] flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#143e2f] hover:bg-[#0c2d20] text-xs font-semibold text-slate-300 transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < totalSteps ? (
            <button
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#d4af37] hover:bg-[#c49f2b] text-[#051b14] text-xs font-bold transition shadow-md shadow-[#d4af37]/20 cursor-pointer"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="flex items-center gap-2 px-7 py-3 rounded-xl bg-[#d4af37] hover:bg-[#c49f2b] text-xs font-bold text-[#051b14] shadow-lg shadow-[#d4af37]/20 transition transform hover:scale-[1.02] cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch Procura Command Center</span>
            </button>
          )}
        </div>
      </div>

      {/* Footer Branding */}
      <div className="max-w-4xl w-full mx-auto text-center text-xs text-slate-400 py-2">
        Procura Universal Procurement OS • Dark Green & Heritage Gold
      </div>
    </div>
  );
};
