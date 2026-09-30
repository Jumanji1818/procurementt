import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { RFQ, PurchaseOrder, Invoice, Bid } from '../../types';
import {
  Store,
  FileSpreadsheet,
  ShoppingCart,
  CreditCard,
  ShieldCheck,
  Send,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  DollarSign,
  Calendar,
  Building,
  Upload,
  Check,
  Package,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Award,
  Edit3,
  Save,
  X
} from 'lucide-react';

export type VendorTab = 'overview' | 'rfqs' | 'orders' | 'invoices' | 'profile';

export const VendorPortalView: React.FC = () => {
  const {
    currentUser,
    vendors,
    updateVendor,
    rfqs,
    bids,
    purchaseOrders,
    invoices,
    submitVendorBid,
    acknowledgePO,
    submitVendorInvoice,
    formatCurrency,
    activeView,
    setActiveView,
  } = useApp();

  const [activeTab, setActiveTab] = useState<VendorTab>('overview');

  // Sync with AppShell activeView
  useEffect(() => {
    if (activeView === 'rfqs') setActiveTab('rfqs');
    else if (activeView === 'orders') setActiveTab('orders');
    else if (activeView === 'finance') setActiveTab('invoices');
    else if (activeView === 'settings' || activeView === 'vendors') setActiveTab('profile');
    else if (activeView === 'vendor_portal' || activeView === 'dashboard') setActiveTab('overview');
  }, [activeView]);

  const handleTabClick = (tab: VendorTab) => {
    setActiveTab(tab);
    if (tab === 'overview') setActiveView('vendor_portal');
    else if (tab === 'rfqs') setActiveView('rfqs');
    else if (tab === 'orders') setActiveView('orders');
    else if (tab === 'invoices') setActiveView('finance');
    else if (tab === 'profile') setActiveView('settings');
  };

  // Find vendor profile associated with current user or fallback to first sample vendor
  const currentVendor =
    vendors.find((v) => v.email.toLowerCase() === currentUser.email.toLowerCase()) ||
    vendors[0];

  // RFQs relevant to this vendor
  const availableRFQs = rfqs.filter(
    (r) => r.status === 'published' || (r.invitedVendorIds || r.invitedVendors || []).includes(currentVendor.id)
  );

  // My bids
  const myBids = bids.filter((b) => b.vendorId === currentVendor.id);

  // My Purchase Orders
  const myPOs = purchaseOrders.filter((po) => po.vendorId === currentVendor.id);

  // My Invoices
  const myInvoices = invoices.filter((inv) => inv.vendorId === currentVendor.id);

  // Active Bidding Modal state
  const [selectedRFQForBid, setSelectedRFQForBid] = useState<RFQ | null>(null);
  const [bidAmount, setBidAmount] = useState<number>(0);
  const [bidLeadTime, setBidLeadTime] = useState<number>(5);
  const [bidNotes, setBidNotes] = useState<string>('');
  const [bidSuccess, setBidSuccess] = useState<boolean>(false);

  // Dispatch / Acknowledge PO Modal state
  const [selectedPOForDispatch, setSelectedPOForDispatch] = useState<PurchaseOrder | null>(null);
  const [trackingNumber, setTrackingNumber] = useState<string>('');
  const [estimatedDelivery, setEstimatedDelivery] = useState<string>('');

  // Submit Invoice Modal state
  const [selectedPOForInvoice, setSelectedPOForInvoice] = useState<PurchaseOrder | null>(null);
  const [invoiceNumber, setInvoiceNumber] = useState<string>('');
  const [invoiceAmount, setInvoiceAmount] = useState<number>(0);
  const [invoiceDueDate, setInvoiceDueDate] = useState<string>('');

  // Vendor Account Editing Modals
  const [isEditBankModalOpen, setIsEditBankModalOpen] = useState(false);
  const [bankNameInput, setBankNameInput] = useState(currentVendor.bankDetails?.bankName || '');
  const [accountNumberInput, setAccountNumberInput] = useState(currentVendor.bankDetails?.accountNumber || '');
  const [accountNameInput, setAccountNameInput] = useState(currentVendor.bankDetails?.accountName || '');

  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [companyNameInput, setCompanyNameInput] = useState(currentVendor.companyName);
  const [contactPersonInput, setContactPersonInput] = useState(currentVendor.contactPerson);
  const [phoneInput, setPhoneInput] = useState(currentVendor.phone);
  const [cityInput, setCityInput] = useState(currentVendor.city);
  const [categoriesInput, setCategoriesInput] = useState(currentVendor.categories.join(', '));

  const [isUploadDocModalOpen, setIsUploadDocModalOpen] = useState(false);
  const [newDocName, setNewDocName] = useState('');
  const [newDocType, setNewDocType] = useState('tax_clearance');
  const [newDocExpiry, setNewDocExpiry] = useState('2027-12-31');

  const handleSaveBankDetails = (e: React.FormEvent) => {
    e.preventDefault();
    updateVendor(currentVendor.id, {
      bankDetails: {
        bankName: bankNameInput,
        accountNumber: accountNumberInput,
        accountName: accountNameInput,
      },
    });
    setIsEditBankModalOpen(false);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateVendor(currentVendor.id, {
      companyName: companyNameInput,
      contactPerson: contactPersonInput,
      phone: phoneInput,
      city: cityInput,
      categories: categoriesInput.split(',').map((c) => c.trim()).filter(Boolean),
    });
    setIsEditProfileModalOpen(false);
  };

  const handleSaveDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName) return;
    const newDoc = {
      id: `doc_${Date.now()}`,
      name: newDocName,
      documentType: newDocType as any,
      expiryDate: newDocExpiry,
      isVerified: true,
      status: 'valid' as const,
    };
    updateVendor(currentVendor.id, {
      documents: [...currentVendor.documents, newDoc],
    });
    setIsUploadDocModalOpen(false);
    setNewDocName('');
  };

  const handleOpenBidModal = (rfq: RFQ) => {
    setSelectedRFQForBid(rfq);
    setBidAmount(rfq.estimatedBudget || 5000);
    setBidLeadTime(7);
    setBidNotes('Guaranteed on-time delivery with manufacturer warranty included.');
    setBidSuccess(false);
  };

  const handleSubmitBidForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRFQForBid) return;
    submitVendorBid(selectedRFQForBid.id, Number(bidAmount), Number(bidLeadTime), bidNotes);
    setBidSuccess(true);
    setTimeout(() => {
      setSelectedRFQForBid(null);
      setBidSuccess(false);
    }, 1500);
  };

  const handleDispatchOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPOForDispatch) return;
    acknowledgePO(
      selectedPOForDispatch.id,
      trackingNumber || `NEX-${Date.now().toString().slice(-6)}`,
      estimatedDelivery || '2026-10-05'
    );
    setSelectedPOForDispatch(null);
  };

  const handleSubmitInvoiceForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPOForInvoice) return;
    submitVendorInvoice(
      selectedPOForInvoice.id,
      invoiceNumber || `INV-${Date.now().toString().slice(-5)}`,
      invoiceAmount || selectedPOForInvoice.totalAmount,
      invoiceDueDate || '2026-10-30'
    );
    setSelectedPOForInvoice(null);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Vendor Profile Prestige Header */}
      <div className="p-6 rounded-2xl bg-[#082117] border border-[#143e2f] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#092b1f] border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] shadow-lg">
              <Store className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-white">
                  {currentVendor.companyName}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-600/50 text-emerald-400 text-xs font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified Supplier Partner
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 flex items-center gap-3 flex-wrap">
                <span>Account: <strong>{currentUser.email}</strong></span>
                <span>•</span>
                <span>Contact: <strong>{currentVendor.contactPerson}</strong></span>
                <span>•</span>
                <span>City: <strong>{currentVendor.city}</strong></span>
              </p>
            </div>
          </div>

          {/* Key Metrics / KPI Pills */}
          <div className="grid grid-cols-3 gap-3 border-t md:border-t-0 md:border-l border-[#143e2f] pt-4 md:pt-0 md:pl-6">
            <div className="text-center md:text-left">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Vendor Rating</div>
              <div className="text-base sm:text-lg font-black text-[#d4af37] flex items-center gap-1 justify-center md:justify-start">
                <span>★ {currentVendor.rating.toFixed(1)}</span>
                <span className="text-[10px] text-slate-400 font-normal">/ 5.0</span>
              </div>
            </div>
            <div className="text-center md:text-left">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">On-Time Rate</div>
              <div className="text-base sm:text-lg font-black text-emerald-400">
                {currentVendor.onTimeDeliveryRate}%
              </div>
            </div>
            <div className="text-center md:text-left">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Active Orders</div>
              <div className="text-base sm:text-lg font-black text-white">
                {myPOs.filter((p) => p.status !== 'fully_received' && (p.status as string) !== 'received' && p.status !== 'cancelled').length}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mt-6 pt-4 border-t border-[#143e2f] overflow-x-auto">
          <button
            onClick={() => handleTabClick('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer flex-shrink-0 ${
              activeTab === 'overview'
                ? 'bg-[#d4af37] text-[#051b14] shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-[#0c2d20]'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Portal Overview</span>
          </button>

          <button
            onClick={() => handleTabClick('rfqs')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer flex-shrink-0 ${
              activeTab === 'rfqs'
                ? 'bg-[#d4af37] text-[#051b14] shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-[#0c2d20]'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Opportunities & RFQs ({availableRFQs.length})</span>
          </button>

          <button
            onClick={() => handleTabClick('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer flex-shrink-0 ${
              activeTab === 'orders'
                ? 'bg-[#d4af37] text-[#051b14] shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-[#0c2d20]'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Purchase Orders ({myPOs.length})</span>
          </button>

          <button
            onClick={() => handleTabClick('invoices')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer flex-shrink-0 ${
              activeTab === 'invoices'
                ? 'bg-[#d4af37] text-[#051b14] shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-[#0c2d20]'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Invoices & Payouts ({myInvoices.length})</span>
          </button>

          <button
            onClick={() => handleTabClick('profile')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer flex-shrink-0 ${
              activeTab === 'profile'
                ? 'bg-[#d4af37] text-[#051b14] shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-[#0c2d20]'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>Account & Banking</span>
          </button>
        </div>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-[#082117] border border-[#143e2f]">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Open RFQs to Quote</span>
                <FileSpreadsheet className="w-4 h-4 text-[#d4af37]" />
              </div>
              <div className="text-2xl font-black text-white">{availableRFQs.length}</div>
              <div className="text-[11px] text-[#d4af37] mt-1">Submit quotes before deadline</div>
            </div>

            <div className="p-4 rounded-xl bg-[#082117] border border-[#143e2f]">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Active Orders</span>
                <ShoppingCart className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-white">{myPOs.length}</div>
              <div className="text-[11px] text-emerald-400 mt-1">
                {myPOs.filter((p) => p.status === 'issued').length} awaiting acknowledgment
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#082117] border border-[#143e2f]">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Total Invoiced</span>
                <CreditCard className="w-4 h-4 text-sky-400" />
              </div>
              <div className="text-2xl font-black text-white">
                {formatCurrency(myInvoices.reduce((acc, i) => acc + i.totalAmount, 0))}
              </div>
              <div className="text-[11px] text-slate-300 mt-1">
                {myInvoices.filter((i) => i.status === 'paid').length} invoices settled
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#082117] border border-[#143e2f]">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Compliance Score</span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-white">{currentVendor.qualityScore}%</div>
              <div className="text-[11px] text-emerald-400 mt-1">Tax & KYC fully validated</div>
            </div>
          </div>

          {/* Two-Column Section: Immediate Actions & Recent Orders */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Open RFQ Opportunities */}
            <div className="p-5 rounded-2xl bg-[#082117] border border-[#143e2f]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-[#d4af37]" />
                  <span>Immediate RFQ Bidding Opportunities</span>
                </h2>
                <button
                  onClick={() => setActiveTab('rfqs')}
                  className="text-xs text-[#d4af37] hover:underline font-semibold"
                >
                  View All
                </button>
              </div>

              <div className="space-y-3">
                {availableRFQs.slice(0, 3).map((rfq) => (
                  <div
                    key={rfq.id}
                    className="p-3.5 rounded-xl bg-[#051710] border border-[#143e2f] hover:border-[#d4af37]/40 transition flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{rfq.title}</span>
                        <span className="px-2 py-0.5 rounded-full bg-[#0d3b2b] text-[#d4af37] text-[10px] font-semibold">
                          {rfq.rfqNumber}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-3">
                        <span>Closing: <strong>{rfq.closingDate}</strong></span>
                        <span>•</span>
                        <span>Items: <strong>{(rfq.items || rfq.lineItems || []).length}</strong></span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleOpenBidModal(rfq)}
                      className="px-3 py-1.5 rounded-lg bg-[#d4af37] hover:bg-[#c49f2b] text-[#051b14] text-xs font-bold transition flex items-center gap-1 cursor-pointer flex-shrink-0"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Quote</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Purchase Orders Received */}
            <div className="p-5 rounded-2xl bg-[#082117] border border-[#143e2f]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-emerald-400" />
                  <span>Purchase Orders Requiring Action</span>
                </h2>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs text-[#d4af37] hover:underline font-semibold"
                >
                  View All
                </button>
              </div>

              <div className="space-y-3">
                {myPOs.slice(0, 3).map((po) => (
                  <div
                    key={po.id}
                    className="p-3.5 rounded-xl bg-[#051710] border border-[#143e2f] flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{po.poNumber}</span>
                        <span className="text-xs font-semibold text-[#d4af37]">
                          {formatCurrency(po.totalAmount)}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        Status: <span className="text-emerald-400 font-semibold uppercase">{po.status}</span>
                        {po.trackingNumber && ` • Tracking: ${po.trackingNumber}`}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {po.status === 'issued' ? (
                        <button
                          onClick={() => {
                            setSelectedPOForDispatch(po);
                            setTrackingNumber(`TRK-${Date.now().toString().slice(-6)}`);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Dispatch</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedPOForInvoice(po);
                            setInvoiceNumber(`INV-${Date.now().toString().slice(-4)}`);
                            setInvoiceAmount(po.totalAmount);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-[#0d3b2b] hover:bg-[#144d3b] text-[#d4af37] border border-[#d4af37]/30 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>Bill Buyer</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: RFQS & BIDDING */}
      {activeTab === 'rfqs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white">
              Open Requests for Quotation (RFQs)
            </h2>
            <span className="text-xs text-slate-400">
              {availableRFQs.length} procurement opportunities available
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableRFQs.map((rfq) => {
              const myExistingBid = myBids.find((b) => b.rfqId === rfq.id);
              return (
                <div
                  key={rfq.id}
                  className="p-5 rounded-2xl bg-[#082117] border border-[#143e2f] space-y-3 relative"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs font-bold text-[#d4af37] uppercase tracking-wider">
                        {rfq.rfqNumber}
                      </div>
                      <h3 className="text-base font-bold text-white mt-0.5">{rfq.title}</h3>
                      <p className="text-xs text-slate-300 mt-1">{rfq.description || 'Tender specification and quotation request'}</p>
                    </div>
                    {myExistingBid && (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-600/50 text-emerald-400 text-[10px] font-bold">
                        Quoted: {formatCurrency(myExistingBid.totalAmount)}
                      </span>
                    )}
                  </div>

                  {/* Line items required */}
                  <div className="p-3 rounded-xl bg-[#051710] border border-[#143e2f] text-xs">
                    <div className="font-semibold text-slate-300 mb-1.5">Required Specifications:</div>
                    <div className="space-y-1">
                      {(rfq.items || rfq.lineItems || []).map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between text-slate-400 text-[11px]">
                          <span>• {item.description}</span>
                          <span className="font-bold text-white">Qty: {item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-[#143e2f]">
                    <div>
                      Closing Date: <strong className="text-white">{rfq.closingDate}</strong>
                    </div>
                    <button
                      onClick={() => handleOpenBidModal(rfq)}
                      className="px-4 py-2 rounded-xl bg-[#d4af37] hover:bg-[#c49f2b] text-[#051b14] text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{myExistingBid ? 'Update Bid' : 'Submit Quotation'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: PURCHASE ORDERS */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white">Purchase Orders from Buyer</h2>
            <span className="text-xs text-slate-400">{myPOs.length} total orders recorded</span>
          </div>

          <div className="space-y-3">
            {myPOs.map((po) => (
              <div
                key={po.id}
                className="p-5 rounded-2xl bg-[#082117] border border-[#143e2f] space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-white">{po.poNumber}</span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          po.status === 'issued'
                            ? 'bg-amber-950/80 text-[#d4af37] border border-[#d4af37]/40'
                            : po.status === 'acknowledged'
                            ? 'bg-sky-950/80 text-sky-400 border border-sky-600/40'
                            : 'bg-emerald-950/80 text-emerald-400 border border-emerald-600/40'
                        }`}
                      >
                        {po.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Issued On: {po.issuedAt.split('T')[0]} • Expected Delivery: {po.estimatedDeliveryDate || po.expectedDeliveryDate || 'Standard 14 Days'}
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="text-base font-black text-[#d4af37]">
                      {formatCurrency(po.totalAmount)}
                    </div>
                    <div className="text-[11px] text-slate-400">Payment: Net 30 Days</div>
                  </div>
                </div>

                {/* Items */}
                <div className="p-3 rounded-xl bg-[#051710] border border-[#143e2f] text-xs">
                  <div className="grid grid-cols-12 text-slate-400 font-semibold pb-1 border-b border-[#143e2f] mb-1.5 text-[11px]">
                    <div className="col-span-6">Description</div>
                    <div className="col-span-2 text-center">Qty</div>
                    <div className="col-span-2 text-right">Unit Price</div>
                    <div className="col-span-2 text-right">Total</div>
                  </div>
                  {(po.items || po.lineItems || []).map((item: any, idx: number) => {
                    const itemQty = item.quantityOrdered ?? item.quantity ?? 1;
                    const itemTotal = item.totalPrice ?? item.lineTotal ?? (item.unitPrice * itemQty);
                    return (
                      <div key={idx} className="grid grid-cols-12 text-slate-300 text-[11px] py-0.5">
                        <div className="col-span-6 truncate">{item.description}</div>
                        <div className="col-span-2 text-center">{itemQty}</div>
                        <div className="col-span-2 text-right">{formatCurrency(item.unitPrice)}</div>
                        <div className="col-span-2 text-right font-semibold text-white">
                          {formatCurrency(itemTotal)}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Action buttons */}
                <div className="flex items-center justify-between pt-2 border-t border-[#143e2f]">
                  <div className="text-xs text-slate-400">
                    {po.trackingNumber ? (
                      <span className="text-sky-300">
                        📦 Tracking: <strong>{po.trackingNumber}</strong>
                      </span>
                    ) : (
                      <span className="text-amber-300">⚠️ Needs fulfillment acknowledgment</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {po.status === 'issued' && (
                      <button
                        onClick={() => {
                          setSelectedPOForDispatch(po);
                          setTrackingNumber(`TRK-${Date.now().toString().slice(-6)}`);
                        }}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Acknowledge & Dispatch</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setSelectedPOForInvoice(po);
                        setInvoiceNumber(`INV-${Date.now().toString().slice(-4)}`);
                        setInvoiceAmount(po.totalAmount);
                      }}
                      className="px-4 py-2 rounded-xl bg-[#0d3b2b] hover:bg-[#144d3b] text-[#d4af37] border border-[#d4af37]/30 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Submit Invoice</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: INVOICES & PAYOUTS */}
      {activeTab === 'invoices' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white">Submitted Invoices & Settlement Tracker</h2>
            <span className="text-xs text-slate-400">
              {myInvoices.filter((i) => i.status === 'paid').length} / {myInvoices.length} Settled
            </span>
          </div>

          <div className="space-y-3">
            {myInvoices.map((inv) => (
              <div
                key={inv.id}
                className="p-4 rounded-xl bg-[#082117] border border-[#143e2f] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{inv.invoiceNumber}</span>
                    <span className="text-xs text-slate-400">for {inv.poNumber}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        inv.status === 'paid'
                          ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-600/40'
                          : inv.status === 'approved'
                          ? 'bg-sky-950/80 text-sky-400 border border-sky-600/40'
                          : 'bg-amber-950/80 text-amber-300 border border-amber-600/40'
                      }`}
                    >
                      {inv.status === 'paid' ? 'PAID / DISPATCHED' : inv.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Submitted Date: {inv.receivedDate || inv.issueDate || 'Recent'} • Due Date: {inv.dueDate}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-base font-black text-[#d4af37]">
                    {formatCurrency(inv.totalAmount)}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {inv.status === 'paid' ? 'Settled to Bank Account' : 'In 3-Way Match Queue'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: ACCOUNT & BANKING */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          {/* Top Banner with Payout Readiness */}
          <div className="p-5 rounded-2xl bg-[#082117] border border-[#143e2f] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-white">Vendor Account & Settlement Profile</h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-600/40 text-[10px] font-bold">
                  KYC Verified
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Manage your commercial entity registration, direct payout bank account, and compliance documentation.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditBankModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-[#d4af37] hover:bg-[#c49f2b] text-[#051b14] text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Update Bank Details</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Card 1: Company Profile */}
            <div className="p-5 rounded-2xl bg-[#082117] border border-[#143e2f] space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#143e2f]">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Building className="w-4 h-4 text-[#d4af37]" />
                  <span>Company Identity</span>
                </h3>
                <button
                  onClick={() => setIsEditProfileModalOpen(true)}
                  className="p-1.5 rounded-lg bg-[#051710] hover:bg-[#0c2d20] border border-[#143e2f] text-[#d4af37] text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                  title="Edit Company Details"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit</span>
                </button>
              </div>

              <div className="space-y-2.5 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Legal Entity Name</span>
                  <span className="font-bold text-white text-sm">{currentVendor.companyName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Primary Contact Person</span>
                  <span className="font-semibold text-slate-200">{currentVendor.contactPerson}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Registered Email</span>
                  <span className="font-semibold text-slate-200">{currentVendor.email}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Telephone / Mobile</span>
                  <span className="font-semibold text-slate-200">{currentVendor.phone}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">City & Operating Region</span>
                  <span className="font-semibold text-slate-200">{currentVendor.city}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Approved Supply Categories</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {currentVendor.categories.map((cat, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-[#051710] border border-[#143e2f] text-[10px] text-[#d4af37] font-semibold"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Bank Payout Account */}
            <div className="p-5 rounded-2xl bg-[#082117] border border-[#143e2f] space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#143e2f]">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                  <span>Direct Bank Payout Account</span>
                </h3>
                <button
                  onClick={() => setIsEditBankModalOpen(true)}
                  className="p-1.5 rounded-lg bg-[#051710] hover:bg-[#0c2d20] border border-[#143e2f] text-emerald-400 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                  title="Update Payout Account"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Update</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-[#051710] border border-[#143e2f] space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Settlement Bank</span>
                  <span className="px-2 py-0.5 rounded bg-[#092b1f] text-emerald-400 text-[10px] font-bold">
                    Active for ACH/Wire
                  </span>
                </div>
                <div className="text-sm font-bold text-white">
                  {currentVendor.bankDetails?.bankName || 'First Commercial Bank'}
                </div>

                <div className="pt-2 border-t border-[#143e2f]">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Account Number / IBAN</span>
                  <span className="font-mono text-sm font-bold text-[#d4af37]">
                    {currentVendor.bankDetails?.accountNumber || '•••• 4521'}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Beneficiary Account Name</span>
                  <span className="font-semibold text-slate-200">
                    {currentVendor.bankDetails?.accountName || currentVendor.companyName}
                  </span>
                </div>

                <div className="pt-2 border-t border-[#143e2f] flex justify-between text-[11px] text-slate-400">
                  <span>Standard Payment Terms:</span>
                  <span className="font-bold text-white">Net 30 Days</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#051710]/60 border border-[#143e2f] text-[11px] text-slate-400 leading-relaxed">
                🛡️ Automated 3-Way Match dispatches funds directly into this verified settlement account upon Finance clearance.
              </div>
            </div>

            {/* Card 3: Compliance & Documents */}
            <div className="p-5 rounded-2xl bg-[#082117] border border-[#143e2f] space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#143e2f]">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
                  <span>Compliance Document Vault</span>
                </h3>
                <button
                  onClick={() => setIsUploadDocModalOpen(true)}
                  className="p-1.5 rounded-lg bg-[#051710] hover:bg-[#0c2d20] border border-[#143e2f] text-[#d4af37] text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                  title="Upload Document"
                >
                  <Upload className="w-3 h-3" />
                  <span>Upload</span>
                </button>
              </div>

              <div className="space-y-2 text-xs">
                {currentVendor.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3 rounded-xl bg-[#051710] border border-[#143e2f] flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-white">{doc.name}</div>
                      <div className="text-[10px] text-slate-400">
                        Expires: {doc.expiryDate}
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-600/40 text-[10px] font-bold">
                      VERIFIED
                    </span>
                  </div>
                ))}
              </div>

              {/* Performance Scorecard */}
              <div className="p-3.5 rounded-xl bg-[#051710] border border-[#143e2f] space-y-2 text-xs">
                <div className="font-bold text-[#d4af37]">Lifetime Supplier Scorecard</div>
                <div className="flex justify-between py-1 border-b border-[#143e2f]">
                  <span className="text-slate-400">Total Billed Volume</span>
                  <span className="font-bold text-white">
                    {formatCurrency(myInvoices.reduce((a, b) => a + b.totalAmount, 0) || 142500)}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#143e2f]">
                  <span className="text-slate-400">Settled Payouts</span>
                  <span className="font-bold text-emerald-400">
                    {formatCurrency(myInvoices.filter((i) => i.status === 'paid').reduce((a, b) => a + b.totalAmount, 0) || 126000)}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Orders Delivered on Schedule</span>
                  <span className="font-bold text-[#d4af37]">{currentVendor.onTimeDeliveryRate}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: SUBMIT QUOTE / BID ON RFQ */}
      {selectedRFQForBid && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-[#082117] border border-[#d4af37]/40 rounded-2xl p-6 shadow-2xl relative">
            <h3 className="text-lg font-bold text-white mb-1">
              Submit Quotation for {selectedRFQForBid.rfqNumber}
            </h3>
            <p className="text-xs text-slate-300 mb-4">{selectedRFQForBid.title}</p>

            {bidSuccess ? (
              <div className="p-6 rounded-xl bg-[#0d3b2b] border border-emerald-500/40 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <div className="text-sm font-bold text-white">Quotation Submitted Successfully!</div>
                <p className="text-xs text-slate-300">
                  Your bid has been sealed and entered into the procurement evaluation matrix.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitBidForm} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Total Quotation Price ($ USD / Equivalent)
                  </label>
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(Number(e.target.value))}
                    className="w-full bg-[#051710] border border-[#143e2f] focus:border-[#d4af37] rounded-xl px-3.5 py-2.5 text-white font-bold text-sm focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Fulfillment Lead Time (Calendar Days)
                  </label>
                  <input
                    type="number"
                    value={bidLeadTime}
                    onChange={(e) => setBidLeadTime(Number(e.target.value))}
                    className="w-full bg-[#051710] border border-[#143e2f] focus:border-[#d4af37] rounded-xl px-3.5 py-2 text-white focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Technical Specifications & Commercial Warranty Terms
                  </label>
                  <textarea
                    rows={3}
                    value={bidNotes}
                    onChange={(e) => setBidNotes(e.target.value)}
                    className="w-full bg-[#051710] border border-[#143e2f] focus:border-[#d4af37] rounded-xl p-3 text-white focus:outline-none"
                    placeholder="Enter warranty coverage, quality certifications, or shipping details..."
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRFQForBid(null)}
                    className="px-4 py-2 rounded-xl bg-[#051710] text-slate-300 hover:text-white transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#d4af37] hover:bg-[#c49f2b] text-[#051b14] font-bold transition flex items-center gap-1.5 cursor-pointer shadow"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Formal Quote</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: DISPATCH ORDER / ACKNOWLEDGE PO */}
      {selectedPOForDispatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[#082117] border border-[#143e2f] rounded-2xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">
              Dispatch Goods for {selectedPOForDispatch.poNumber}
            </h3>
            <p className="text-xs text-slate-300 mb-4">
              Enter shipping tracking and estimated delivery details.
            </p>

            <form onSubmit={handleDispatchOrder} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Waybill / Tracking Number
                </label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full bg-[#051710] border border-[#143e2f] focus:border-[#d4af37] rounded-xl px-3 py-2 text-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Estimated Delivery Date
                </label>
                <input
                  type="date"
                  value={estimatedDelivery}
                  onChange={(e) => setEstimatedDelivery(e.target.value)}
                  className="w-full bg-[#051710] border border-[#143e2f] focus:border-[#d4af37] rounded-xl px-3 py-2 text-white focus:outline-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedPOForDispatch(null)}
                  className="px-4 py-2 rounded-xl bg-[#051710] text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Confirm Dispatch</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: SUBMIT INVOICE */}
      {selectedPOForInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[#082117] border border-[#143e2f] rounded-2xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">
              Submit Invoice against {selectedPOForInvoice.poNumber}
            </h3>
            <p className="text-xs text-slate-300 mb-4">
              Bills will be automatically queued for 3-Way Matching by Finance.
            </p>

            <form onSubmit={handleSubmitInvoiceForm} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Invoice Reference Number
                </label>
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="w-full bg-[#051710] border border-[#143e2f] focus:border-[#d4af37] rounded-xl px-3 py-2 text-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Total Bill Amount ($)
                </label>
                <input
                  type="number"
                  value={invoiceAmount}
                  onChange={(e) => setInvoiceAmount(Number(e.target.value))}
                  className="w-full bg-[#051710] border border-[#143e2f] focus:border-[#d4af37] rounded-xl px-3 py-2 text-white font-bold focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Payment Due Date
                </label>
                <input
                  type="date"
                  value={invoiceDueDate}
                  onChange={(e) => setInvoiceDueDate(e.target.value)}
                  className="w-full bg-[#051710] border border-[#143e2f] focus:border-[#d4af37] rounded-xl px-3 py-2 text-white focus:outline-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedPOForInvoice(null)}
                  className="px-4 py-2 rounded-xl bg-[#051710] text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#d4af37] hover:bg-[#c49f2b] text-[#051b14] font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Transmit Invoice to Buyer</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: EDIT VENDOR PROFILE */}
      {isEditProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[#082117] border border-[#143e2f] rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Building className="w-4 h-4 text-[#d4af37]" />
                <span>Edit Vendor Company Profile</span>
              </h3>
              <button
                onClick={() => setIsEditProfileModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Company Legal Name</label>
                <input
                  type="text"
                  value={companyNameInput}
                  onChange={(e) => setCompanyNameInput(e.target.value)}
                  className="w-full bg-[#051710] border border-[#143e2f] focus:border-[#d4af37] rounded-xl px-3 py-2 text-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Primary Representative Name</label>
                <input
                  type="text"
                  value={contactPersonInput}
                  onChange={(e) => setContactPersonInput(e.target.value)}
                  className="w-full bg-[#051710] border border-[#143e2f] focus:border-[#d4af37] rounded-xl px-3 py-2 text-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Contact Telephone</label>
                <input
                  type="text"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  className="w-full bg-[#051710] border border-[#143e2f] focus:border-[#d4af37] rounded-xl px-3 py-2 text-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">City / Region Base</label>
                <input
                  type="text"
                  value={cityInput}
                  onChange={(e) => setCityInput(e.target.value)}
                  className="w-full bg-[#051710] border border-[#143e2f] focus:border-[#d4af37] rounded-xl px-3 py-2 text-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Supply Categories (comma separated)</label>
                <input
                  type="text"
                  value={categoriesInput}
                  onChange={(e) => setCategoriesInput(e.target.value)}
                  className="w-full bg-[#051710] border border-[#143e2f] focus:border-[#d4af37] rounded-xl px-3 py-2 text-white focus:outline-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsEditProfileModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#051710] text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#d4af37] hover:bg-[#c49f2b] text-[#051b14] font-bold transition flex items-center gap-1.5 cursor-pointer shadow"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Profile</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: EDIT BANK ACCOUNT DETAILS */}
      {isEditBankModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[#082117] border border-[#143e2f] rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-400" />
                <span>Update Payout Bank Account</span>
              </h3>
              <button
                onClick={() => setIsEditBankModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveBankDetails} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Financial Institution Name</label>
                <input
                  type="text"
                  value={bankNameInput}
                  onChange={(e) => setBankNameInput(e.target.value)}
                  placeholder="e.g. Standard Chartered Bank, Chase, GTBank"
                  className="w-full bg-[#051710] border border-[#143e2f] focus:border-[#d4af37] rounded-xl px-3 py-2 text-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Account Number / IBAN</label>
                <input
                  type="text"
                  value={accountNumberInput}
                  onChange={(e) => setAccountNumberInput(e.target.value)}
                  placeholder="e.g. 0123456789 or GB29NWBK..."
                  className="w-full bg-[#051710] border border-[#143e2f] focus:border-[#d4af37] rounded-xl px-3 py-2 text-white font-mono focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Beneficiary Account Name</label>
                <input
                  type="text"
                  value={accountNameInput}
                  onChange={(e) => setAccountNameInput(e.target.value)}
                  placeholder="Must match corporate registration"
                  className="w-full bg-[#051710] border border-[#143e2f] focus:border-[#d4af37] rounded-xl px-3 py-2 text-white focus:outline-none"
                  required
                />
              </div>

              <div className="p-3 rounded-xl bg-[#051710] border border-[#143e2f] text-[11px] text-slate-400">
                🔒 Payouts are protected with 256-bit encryption. All funds from cleared 3-way match invoices are routed directly here.
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsEditBankModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#051710] text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition flex items-center gap-1.5 cursor-pointer shadow"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Update Account</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 6: UPLOAD COMPLIANCE CERTIFICATE */}
      {isUploadDocModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[#082117] border border-[#143e2f] rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
                <span>Upload Compliance Document</span>
              </h3>
              <button
                onClick={() => setIsUploadDocModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveDocument} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Document Title</label>
                <input
                  type="text"
                  value={newDocName}
                  onChange={(e) => setNewDocName(e.target.value)}
                  placeholder="e.g. 2026 Tax Clearance Certificate, ISO-9001"
                  className="w-full bg-[#051710] border border-[#143e2f] focus:border-[#d4af37] rounded-xl px-3 py-2 text-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Document Type</label>
                <select
                  value={newDocType}
                  onChange={(e) => setNewDocType(e.target.value)}
                  className="w-full bg-[#051710] border border-[#143e2f] focus:border-[#d4af37] rounded-xl px-3 py-2 text-white focus:outline-none"
                >
                  <option value="tax_clearance">Taxpayer Clearance / TIN</option>
                  <option value="business_license">Certificate of Incorporation / CAC</option>
                  <option value="insurance">General Commercial Liability Insurance</option>
                  <option value="iso_certification">ISO-9001 Quality Standard</option>
                  <option value="nda">Non-Disclosure Agreement</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Document Expiry Date</label>
                <input
                  type="date"
                  value={newDocExpiry}
                  onChange={(e) => setNewDocExpiry(e.target.value)}
                  className="w-full bg-[#051710] border border-[#143e2f] focus:border-[#d4af37] rounded-xl px-3 py-2 text-white focus:outline-none"
                  required
                />
              </div>

              <div className="border-2 border-dashed border-[#143e2f] rounded-xl p-4 text-center cursor-pointer hover:border-[#d4af37]/60 transition">
                <Upload className="w-6 h-6 text-[#d4af37] mx-auto mb-1" />
                <span className="text-[11px] font-semibold text-slate-300 block">
                  Click to select PDF or Scanned PNG
                </span>
                <span className="text-[9px] text-slate-500">Max size: 15MB • TLS encrypted</span>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsUploadDocModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#051710] text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#d4af37] hover:bg-[#c49f2b] text-[#051b14] font-bold transition flex items-center gap-1.5 cursor-pointer shadow"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Verify & Vault</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
