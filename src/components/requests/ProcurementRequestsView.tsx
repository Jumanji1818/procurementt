import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ProcurementRequest,
  RequestItem,
  RequestPriority,
  RequestStatus,
} from '../../types';
import {
  Plus,
  Search,
  Filter,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Paperclip,
  Trash2,
  Calendar,
  Building,
  User,
  DollarSign,
  Tag,
  Shield,
  Layers,
} from 'lucide-react';

export const ProcurementRequestsView: React.FC<{
  isOpenCreateModal: boolean;
  setIsOpenCreateModal: (open: boolean) => void;
}> = ({ isOpenCreateModal, setIsOpenCreateModal }) => {
  const {
    requests,
    createRequest,
    currentUser,
    departments,
    locations,
    formatCurrency,
    t,
    orgConfig,
    approveRequest,
    rejectRequest,
    createRFQ,
    createPurchaseOrder,
    vendors,
  } = useApp();

  const [selectedReq, setSelectedReq] = useState<ProcurementRequest | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Form states for New Request Modal
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [departmentId, setDepartmentId] = useState(departments[0]?.id || '');
  const [locationId, setLocationId] = useState(locations[0]?.id || '');
  const [category, setCategory] = useState('IT Equipment');
  const [priority, setPriority] = useState<RequestPriority>('medium');
  const [requiredDate, setRequiredDate] = useState('');
  const [fundingSource, setFundingSource] = useState('Capital Expenditure (CapEx)');
  const [justification, setJustification] = useState('');
  const [technicalSpecs, setTechnicalSpecs] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [items, setItems] = useState<RequestItem[]>([
    {
      id: 'item_1',
      description: '',
      category: 'General',
      quantity: 1,
      unit: 'units',
      estimatedUnitPrice: 0,
      totalPrice: 0,
    },
  ]);

  const addItemRow = () => {
    setItems((prev) => [
      ...prev,
      {
        id: `item_${Date.now()}`,
        description: '',
        category: 'General',
        quantity: 1,
        unit: 'units',
        estimatedUnitPrice: 0,
        totalPrice: 0,
      },
    ]);
  };

  const updateItemRow = (id: string, updates: Partial<RequestItem>) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, ...updates };
        updated.totalPrice = updated.quantity * updated.estimatedUnitPrice;
        return updated;
      })
    );
  };

  const removeItemRow = (id: string) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const totalCalculatedBudget = items.reduce((acc, it) => acc + it.totalPrice, 0);

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const matchedDept = departments.find((d) => d.id === departmentId);
    const matchedLoc = locations.find((l) => l.id === locationId);

    createRequest({
      title,
      description,
      requesterId: currentUser.id,
      requesterName: currentUser.name,
      departmentId: orgConfig.hasDepartments ? departmentId : undefined,
      departmentName: orgConfig.hasDepartments ? matchedDept?.name : undefined,
      locationId: orgConfig.hasMultipleLocations ? locationId : undefined,
      locationName: orgConfig.hasMultipleLocations ? matchedLoc?.name : undefined,
      category,
      priority,
      requiredDate: requiredDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      estimatedBudget: totalCalculatedBudget || 1000,
      fundingSource,
      justification,
      technicalSpecs,
      status: orgConfig.approvalWorkflow === 'none' ? 'approved' : 'pending_approval',
      items: items.filter((i) => i.description.trim().length > 0),
      isRecurring,
    });

    // Reset & close
    setTitle('');
    setDescription('');
    setJustification('');
    setTechnicalSpecs('');
    setIsOpenCreateModal(false);
  };

  // Filter requests
  const filteredRequests = requests.filter((r) => {
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    const matchesSearch =
      r.requestNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.requesterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.departmentName && r.departmentName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Procurement Requests</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Create, audit, and track purchase requisitions across all departments and project locations.
          </p>
        </div>
        <button
          onClick={() => setIsOpenCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Purchase Request</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, number, requester..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto text-xs">
          {[
            { key: 'all', label: 'All Requests' },
            { key: 'pending_approval', label: 'Pending Approval' },
            { key: 'approved', label: 'Approved' },
            { key: 'converted_to_rfq', label: 'In Tender / RFQ' },
            { key: 'rejected', label: 'Rejected' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`px-3 py-1.5 rounded-xl font-medium transition flex-shrink-0 ${
                statusFilter === tab.key
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Requests Grid / Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {filteredRequests.length === 0 ? (
            <div className="p-12 text-center rounded-2xl border border-slate-800 bg-slate-900/40 text-slate-400 text-xs">
              No procurement requests found matching your filter criteria.
            </div>
          ) : (
            filteredRequests.map((r) => {
              const isSelected = selectedReq?.id === r.id;
              return (
                <div
                  key={r.id}
                  onClick={() => setSelectedReq(r)}
                  className={`p-4 sm:p-5 rounded-2xl border cursor-pointer transition text-left ${
                    isSelected
                      ? 'border-indigo-500 bg-slate-900 shadow-lg shadow-indigo-500/10'
                      : 'border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-white">{r.requestNumber}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            r.status === 'approved'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : r.status === 'pending_approval'
                              ? 'bg-amber-500/20 text-amber-400'
                              : r.status === 'rejected'
                              ? 'bg-rose-500/20 text-rose-400'
                              : 'bg-sky-500/20 text-sky-400'
                          }`}
                        >
                          {r.status.replace('_', ' ').toUpperCase()}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            r.priority === 'urgent'
                              ? 'bg-rose-500/20 text-rose-300'
                              : r.priority === 'high'
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {r.priority.toUpperCase()}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-white mt-1">{r.title}</h3>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-black text-white">{formatCurrency(r.estimatedBudget)}</div>
                      <span className="text-[10px] text-slate-500">Est. Budget</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                    {r.description}
                  </p>

                  <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-3 border-t border-slate-800/80">
                    <div className="flex items-center gap-3">
                      <span>Requester: <strong>{r.requesterName}</strong></span>
                      {r.departmentName && <span>• {r.departmentName}</span>}
                    </div>
                    <div>Required by: {r.requiredDate}</div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Selected Request Detail Sidebar Drawer */}
        <div className="lg:col-span-1">
          {selectedReq ? (
            <div className="sticky top-20 rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <span className="font-mono text-xs font-bold text-indigo-400">{selectedReq.requestNumber}</span>
                  <h3 className="text-sm font-bold text-white mt-0.5">{selectedReq.title}</h3>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    selectedReq.status === 'approved'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-amber-500/20 text-amber-400'
                  }`}
                >
                  {selectedReq.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>

              {/* Justification & Specs */}
              <div>
                <span className="text-[11px] font-semibold text-slate-400 block mb-1">Business Justification</span>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800">
                  {selectedReq.justification || 'Standard departmental purchase according to annual procurement calendar.'}
                </p>
              </div>

              {selectedReq.technicalSpecs && (
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 block mb-1">Technical Specifications</span>
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px]">
                    {selectedReq.technicalSpecs}
                  </p>
                </div>
              )}

              {/* Line Items */}
              <div>
                <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                  Line Items ({selectedReq.items.length})
                </span>
                <div className="space-y-1.5">
                  {selectedReq.items.map((it) => (
                    <div
                      key={it.id}
                      className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs flex justify-between items-center"
                    >
                      <div>
                        <div className="font-semibold text-white">{it.description}</div>
                        <div className="text-[10px] text-slate-500">
                          {it.quantity} {it.unit} @ {formatCurrency(it.estimatedUnitPrice)}
                        </div>
                      </div>
                      <div className="font-bold text-white">{formatCurrency(it.totalPrice)}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Approval History */}
              <div>
                <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">Approval Lifecycle</span>
                <div className="space-y-2">
                  {selectedReq.approvalsHistory.map((step, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-200">{step.stepName}</span>
                        <span
                          className={`text-[10px] font-bold ${
                            step.status === 'approved' ? 'text-emerald-400' : 'text-amber-400'
                          }`}
                        >
                          {step.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">By {step.approverName}</div>
                      {step.comments && (
                        <div className="text-[11px] text-slate-500 italic mt-1">"{step.comments}"</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800 space-y-2">
                {selectedReq.status === 'pending_approval' && (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => approveRequest(selectedReq.id)}
                      className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition"
                    >
                      Authorize / Signoff
                    </button>
                    <button
                      onClick={() => rejectRequest(selectedReq.id, 'Budget cap exceeded')}
                      className="py-2 px-3 rounded-xl bg-rose-600/80 hover:bg-rose-500 text-white font-bold text-xs transition"
                    >
                      Reject
                    </button>
                  </div>
                )}

                {selectedReq.status === 'approved' && orgConfig.hasRfqs && (
                  <button
                    onClick={() => {
                      createRFQ({
                        title: `Tender for ${selectedReq.title}`,
                        procurementRequestId: selectedReq.id,
                        deliveryLocation: selectedReq.locationName || 'Main Headquarters',
                        closingDate: new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0],
                        invitedVendorIds: vendors.slice(0, 2).map((v) => v.id),
                        criteriaWeights: { price: 40, quality: 25, delivery: 20, vendorHistory: 15 },
                        items: selectedReq.items.map((it, idx) => ({
                          id: `rfqi_${Date.now()}_${idx}`,
                          description: it.description,
                          quantity: it.quantity,
                          unit: it.unit,
                          specifications: selectedReq.technicalSpecs || 'Commercial standard quality',
                        })),
                      });
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Convert to RFQ / Tender</span>
                  </button>
                )}

                {selectedReq.status === 'approved' && (
                  <button
                    onClick={() => {
                      const vendor = vendors[0];
                      const subtotal = selectedReq.estimatedBudget;
                      const tax = (subtotal * orgConfig.taxRate) / 100;
                      createPurchaseOrder({
                        requestId: selectedReq.id,
                        vendorId: vendor.id,
                        vendorName: vendor.companyName,
                        vendorEmail: vendor.email,
                        items: selectedReq.items.map((it, idx) => ({
                          id: `poi_${Date.now()}_${idx}`,
                          description: it.description,
                          quantityOrdered: it.quantity,
                          quantityReceived: 0,
                          unitPrice: it.estimatedUnitPrice,
                          totalPrice: it.totalPrice,
                        })),
                        subtotal,
                        taxAmount: tax,
                        shippingAmount: 150,
                        totalAmount: subtotal + tax + 150,
                        deliveryTerms: 'DAP (Delivered at Place)',
                        paymentTerms: 'Net 30 Days',
                        expectedDeliveryDate: selectedReq.requiredDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
                        deliveryAddress: selectedReq.locationName || 'HQ Logistics Dock',
                        notes: `Generated from ${selectedReq.requestNumber}`,
                      });
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition"
                  >
                    Issue Direct PO to Supplier
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-2xl border border-slate-800/80 bg-slate-900/30 text-center text-xs text-slate-500">
              Select a procurement request from the left to view detailed breakdown, specifications, line items, and approval steps.
            </div>
          )}
        </div>
      </div>

      {/* NEW REQUEST MODAL */}
      {isOpenCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-3xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 text-left my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <div>
                <h2 className="text-lg font-bold text-white">Create Procurement Requisition</h2>
                <p className="text-xs text-slate-400">
                  Submit items for budget verification and approval routing.
                </p>
              </div>
              <button
                onClick={() => setIsOpenCreateModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitRequest} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Request Title / Purpose *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Ergonomic Chairs for Operations Wing"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {orgConfig.hasDepartments && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Department</label>
                    <select
                      value={departmentId}
                      onChange={(e) => setDepartmentId(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    >
                      {departments.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name} ({d.code})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {orgConfig.hasMultipleLocations && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Location / Site</label>
                    <select
                      value={locationId}
                      onChange={(e) => setLocationId(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    >
                      {locations.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as RequestPriority)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                    <option value="urgent">Urgent / Emergency</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Description & Scope</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed context of the purchase requirement..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Line Items Table */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-300">Itemized Line Items *</label>
                  <button
                    type="button"
                    onClick={addItemRow}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {items.map((item, idx) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-12 gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800 items-center"
                    >
                      <div className="col-span-5">
                        <input
                          type="text"
                          required
                          value={item.description}
                          onChange={(e) => updateItemRow(item.id, { description: e.target.value })}
                          placeholder="Item name / specification"
                          className="w-full bg-transparent text-xs text-white placeholder-slate-600 focus:outline-none"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItemRow(item.id, { quantity: Number(e.target.value) })}
                          placeholder="Qty"
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-white text-center focus:outline-none"
                        />
                      </div>
                      <div className="col-span-3">
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={item.estimatedUnitPrice || ''}
                          onChange={(e) => updateItemRow(item.id, { estimatedUnitPrice: Number(e.target.value) })}
                          placeholder="Unit Price"
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-white focus:outline-none"
                        />
                      </div>
                      <div className="col-span-2 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-200">
                          {formatCurrency(item.totalPrice)}
                        </span>
                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeItemRow(item.id)}
                            className="p-1 text-slate-500 hover:text-rose-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-2 flex justify-end text-xs font-bold text-white">
                  <span>Total Calculated Budget: {formatCurrency(totalCalculatedBudget)}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Business Justification</label>
                  <textarea
                    rows={2}
                    value={justification}
                    onChange={(e) => setJustification(e.target.value)}
                    placeholder="Why is this purchase essential for operations?"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Technical Specs / Standards</label>
                  <textarea
                    rows={2}
                    value={technicalSpecs}
                    onChange={(e) => setTechnicalSpecs(e.target.value)}
                    placeholder="Certifications, wattage, model numbers, dimensions..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsOpenCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 transition"
                >
                  Submit for Approval
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
