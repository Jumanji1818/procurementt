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
  Sliders,
  Building,
  Shield,
  DollarSign,
  Globe2,
  Check,
  RotateCcw,
  Sparkles,
  Layers,
  Store,
  User,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { orgConfig, updateOrgConfig, loadPreset, setActiveView } = useApp();

  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = (updates: Partial<typeof orgConfig>) => {
    updateOrgConfig(updates);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">System & Organization Settings</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure Procura's adaptive architecture, operating currency, tax rates, and enabled functional modules.
          </p>
        </div>

        {savedNotice && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold animate-in fade-in">
            <Check className="w-3.5 h-3.5" />
            <span>Settings Saved!</span>
          </div>
        )}
      </div>

      {/* Fast Preset Swapper */}
      <div className="p-5 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-sky-400" />
          <h2 className="text-xs font-bold text-white uppercase tracking-wider">
            Quick Architecture Presets (Instant Switching)
          </h2>
        </div>
        <p className="text-xs text-slate-300">
          Switch between archetypes in one click to demonstrate Procura adapting to different business sizes:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          <button
            onClick={() => loadPreset('individual')}
            className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-left transition"
          >
            <User className="w-4 h-4 text-amber-400 mb-1" />
            <div className="text-xs font-bold text-white">Solo Trader</div>
            <div className="text-[10px] text-slate-400">1 Person, No approvals</div>
          </button>

          <button
            onClick={() => loadPreset('retail')}
            className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-left transition"
          >
            <Store className="w-4 h-4 text-teal-400 mb-1" />
            <div className="text-xs font-bold text-white">Retail Shop</div>
            <div className="text-[10px] text-slate-400">Stock & goods receipts</div>
          </button>

          <button
            onClick={() => loadPreset('smb')}
            className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-left transition"
          >
            <Layers className="w-4 h-4 text-sky-400 mb-1" />
            <div className="text-xs font-bold text-white">Mid-size Tech</div>
            <div className="text-[10px] text-slate-400">Budgets & simple approvals</div>
          </button>

          <button
            onClick={() => loadPreset('enterprise')}
            className="p-3 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/40 border border-indigo-500 text-left transition"
          >
            <Building className="w-4 h-4 text-indigo-300 mb-1" />
            <div className="text-xs font-bold text-white">Enterprise Corp</div>
            <div className="text-[10px] text-indigo-200">Full 3-Way match & tenders</div>
          </button>
        </div>
      </div>

      {/* Organization Parameters */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
        <h3 className="text-sm font-bold text-white">General Organization Profile</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Company / Organization Legal Name</label>
            <input
              type="text"
              value={orgConfig.name}
              onChange={(e) => handleSave({ name: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Business Classification</label>
            <select
              value={orgConfig.businessType}
              onChange={(e) => handleSave({ businessType: e.target.value as BusinessType })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
            >
              <option value="corporation">Corporation / Enterprise</option>
              <option value="small_business">Small Business / Shop</option>
              <option value="individual">Individual Freelancer</option>
              <option value="construction">Construction & Infrastructure</option>
              <option value="healthcare">Hospital / Healthcare</option>
              <option value="education">School / University</option>
              <option value="manufacturing">Manufacturing / Factory</option>
              <option value="services">Professional Services</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Currency Code</label>
            <select
              value={orgConfig.currency}
              onChange={(e) => handleSave({ currency: e.target.value as CurrencyCode })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
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
            <label className="block text-xs font-semibold text-slate-300 mb-1">System Interface Language</label>
            <select
              value={orgConfig.language}
              onChange={(e) => handleSave({ language: e.target.value as SupportedLanguage })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
            >
              <option value="en">English (Global)</option>
              <option value="fr">Français (French)</option>
              <option value="es">Español (Spanish)</option>
              <option value="ha">Hausa (West Africa)</option>
              <option value="sw">Kiswahili (East Africa)</option>
              <option value="ar">العربية (Arabic)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Standard Statutory Tax Rate (%)</label>
            <input
              type="number"
              step="0.1"
              value={orgConfig.taxRate}
              onChange={(e) => handleSave({ taxRate: Number(e.target.value) })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
            />
          </div>
        </div>
      </div>

      {/* Modular Feature Toggles */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
        <h3 className="text-sm font-bold text-white">Adaptive Functional Modules</h3>
        <p className="text-xs text-slate-400">
          Enable or disable capabilities. Navigation items and dashboard cards update in real time.
        </p>

        <div className="space-y-3">
          {[
            {
              key: 'hasDepartments' as const,
              title: 'Departmental Structure',
              desc: 'Enables cost centers, department heads, and departmental budgets.',
              val: orgConfig.hasDepartments,
            },
            {
              key: 'hasSuppliers' as const,
              title: 'External Supplier Management',
              desc: 'Enables vendor directory, document verification, and supplier performance scorecards.',
              val: orgConfig.hasSuppliers,
            },
            {
              key: 'hasRfqs' as const,
              title: 'Competitive RFQ & Tender Bidding',
              desc: 'Enables weighted bid evaluation and vendor portal bidding.',
              val: orgConfig.hasRfqs,
            },
            {
              key: 'hasBudgets' as const,
              title: 'Budget Controls & Commitment Tracking',
              desc: 'Tracks allocated vs committed vs remaining funds.',
              val: orgConfig.hasBudgets,
            },
            {
              key: 'hasPhysicalGoods' as const,
              title: 'Physical Deliveries & Automated Inventory',
              desc: 'Enables Goods Receipts (GRN) that automatically increment warehouse stock.',
              val: orgConfig.hasPhysicalGoods,
            },
            {
              key: 'hasInvoicesPayments' as const,
              title: 'Invoicing & Three-Way Matching',
              desc: 'Enables automatic cross-audit of POs vs GRNs vs Invoices before payment.',
              val: orgConfig.hasInvoicesPayments,
            },
            {
              key: 'hasMultipleLocations' as const,
              title: 'Multi-Location Warehouses & Branches',
              desc: 'Supports HQ, regional distribution hubs, and project sites.',
              val: orgConfig.hasMultipleLocations,
            },
          ].map((item) => (
            <div
              key={item.key}
              className="p-3.5 bg-slate-950/70 rounded-xl border border-slate-800 flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-bold text-white">{item.title}</div>
                <div className="text-[11px] text-slate-400">{item.desc}</div>
              </div>
              <button
                onClick={() => handleSave({ [item.key]: !item.val })}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  item.val
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {item.val ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
