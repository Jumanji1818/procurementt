import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Vendor } from '../../types';
import {
  Users,
  Plus,
  Search,
  Star,
  ShieldCheck,
  AlertTriangle,
  Building,
  Mail,
  Phone,
  MapPin,
  TrendingUp,
  FileCheck2,
  ExternalLink,
  Store,
  Sliders,
  DollarSign,
} from 'lucide-react';

export const SupplierManagementView: React.FC<{
  isOpenAddVendor: boolean;
  setIsOpenAddVendor: (open: boolean) => void;
}> = ({ isOpenAddVendor, setIsOpenAddVendor }) => {
  const {
    vendors,
    addVendor,
    formatCurrency,
    t,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'directory' | 'marketplace' | 'risk'>('directory');
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Add Vendor Form State
  const [companyName, setCompanyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [categoriesInput, setCategoriesInput] = useState('IT Equipment, Networking');
  const [bankName, setBankName] = useState('First Bank of Nigeria');
  const [accNumber, setAccNumber] = useState('•••• 4410');

  const handleCreateVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) return;

    addVendor({
      companyName,
      contactPerson,
      email,
      phone,
      city: city || 'Lagos',
      categories: categoriesInput.split(',').map((c) => c.trim()),
      complianceStatus: 'verified',
      riskLevel: 'low',
      documents: [
        {
          id: `doc_${Date.now()}`,
          name: 'Certificate of Incorporation & Tax Clearance',
          documentType: 'tax_clearance',
          expiryDate: '2027-12-31',
          isVerified: true,
          status: 'valid',
        },
      ],
      bankDetails: {
        bankName,
        accountNumber: accNumber,
        accountName: companyName,
      },
    });

    setCompanyName('');
    setEmail('');
    setIsOpenAddVendor(false);
  };

  const filteredVendors = vendors.filter((v) => {
    const q = searchQuery.toLowerCase();
    return (
      v.companyName.toLowerCase().includes(q) ||
      v.city.toLowerCase().includes(q) ||
      v.categories.some((c) => c.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Supplier Management & B2B Marketplace
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Maintain verified vendor registries, audit statutory compliance documents, and analyze delivery scorecards.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('directory')}
              className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                activeTab === 'directory' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Registered Directory</span>
            </button>
            <button
              onClick={() => setActiveTab('marketplace')}
              className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                activeTab === 'marketplace' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Public Marketplace</span>
            </button>
            <button
              onClick={() => setActiveTab('risk')}
              className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                activeTab === 'risk' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Risk & Compliance</span>
            </button>
          </div>

          <button
            onClick={() => setIsOpenAddVendor(true)}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-md transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Supplier</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search suppliers by name, category, or city..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Directory & Marketplace Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVendors.map((vendor) => {
          const hasExpiredDoc = vendor.documents.some((d) => d.status === 'expired');
          return (
            <div
              key={vendor.id}
              className="p-5 rounded-2xl border border-slate-800 bg-slate-900/90 shadow-md flex flex-col justify-between space-y-4 hover:border-slate-700 transition"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-white text-xs">
                      {vendor.companyName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white leading-tight">{vendor.companyName}</h3>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        <span>{vendor.city}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-lg text-xs font-bold">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span>{vendor.rating}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {vendor.categories.map((c, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-slate-950 text-[10px] text-slate-300 border border-slate-800">
                      {c}
                    </span>
                  ))}
                </div>

                {/* Scorecards */}
                <div className="grid grid-cols-2 gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block">On-Time Delivery</span>
                    <strong className="text-emerald-400 font-bold">{vendor.onTimeDeliveryRate}%</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Quality Rating</span>
                    <strong className="text-sky-400 font-bold">{vendor.qualityScore}%</strong>
                  </div>
                </div>

                {/* Documents & Compliance */}
                <div className="mt-3 space-y-1">
                  {vendor.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between text-[11px] text-slate-400 p-1.5 rounded-lg bg-slate-950/40"
                    >
                      <span className="truncate mr-2">{doc.name}</span>
                      <span
                        className={`font-semibold ${
                          doc.status === 'valid'
                            ? 'text-emerald-400'
                            : doc.status === 'expiring_soon'
                            ? 'text-amber-400'
                            : 'text-rose-400'
                        }`}
                      >
                        {doc.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Total Spend: <strong className="text-white">{formatCurrency(vendor.totalSpend)}</strong></span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    vendor.riskLevel === 'low'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : vendor.riskLevel === 'medium'
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-rose-500/20 text-rose-400'
                  }`}
                >
                  {vendor.riskLevel.toUpperCase()} RISK
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ADD VENDOR MODAL */}
      {isOpenAddVendor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 text-left my-8">
            <h2 className="text-base font-bold text-white mb-1">Enroll New Supplier / Vendor</h2>
            <p className="text-xs text-slate-400 mb-5">
              Add corporate details and banking info for procurement contracting.
            </p>

            <form onSubmit={handleCreateVendor} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Company Legal Name *</label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Atlas Industrial Solutions"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Contact Person</label>
                  <input
                    type="text"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Operating City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Lagos, Abuja, London"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="bids@company.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Telephone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+234 800..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Supply Categories (comma-separated)</label>
                <input
                  type="text"
                  value={categoriesInput}
                  onChange={(e) => setCategoriesInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsOpenAddVendor(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs"
                >
                  Register Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
