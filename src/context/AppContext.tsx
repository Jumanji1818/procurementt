import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  ApprovalWorkflowType,
  AuditLog,
  Bid,
  Budget,
  BusinessType,
  Contract,
  CurrencyCode,
  Department,
  ExceptionAlert,
  GoodsReceiptNote,
  InventoryItem,
  Invoice,
  Location,
  NotificationItem,
  OrgConfig,
  PaymentRecord,
  POItem,
  ProcurementRequest,
  PurchaseOrder,
  RequestItem,
  RequestStatus,
  RFQ,
  StockMovement,
  SupportedLanguage,
  User,
  UserRole,
  Vendor,
} from '../types';
import {
  initialOrgConfig,
  sampleBudgets,
  sampleContracts,
  sampleDepartments,
  sampleExceptions,
  sampleGoodsReceipts,
  sampleInventoryItems,
  sampleInvoices,
  sampleLocations,
  sampleNotifications,
  samplePayments,
  samplePurchaseOrders,
  sampleRequests,
  sampleRFQs,
  sampleStockMovements,
  sampleUsers,
  sampleVendors,
  sampleBids,
} from '../data/mockData';
import { formatCurrencyAmount } from '../utils/currency';
import { getTranslation } from '../utils/translations';

export type ActiveView =
  | 'landing'
  | 'onboarding'
  | 'auth'
  | 'vendor_portal'
  | 'dashboard'
  | 'requests'
  | 'approvals'
  | 'rfqs'
  | 'vendors'
  | 'orders'
  | 'deliveries'
  | 'inventory'
  | 'finance'
  | 'budgets'
  | 'exceptions'
  | 'calendar'
  | 'contracts'
  | 'analytics'
  | 'audit'
  | 'settings';

interface AppContextType {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  currentUser: User;
  setCurrentUser: (user: User) => void;
  switchRole: (role: UserRole) => void;
  orgConfig: OrgConfig;
  updateOrgConfig: (updates: Partial<OrgConfig>) => void;
  loadPreset: (presetKey: 'enterprise' | 'smb' | 'individual' | 'retail') => void;

  // Auth State & Actions
  isAuthenticated: boolean;
  login: (email: string, role?: UserRole) => boolean;
  signup: (
    name: string,
    email: string,
    role: UserRole,
    orgName?: string,
    isVendor?: boolean,
    vendorDetails?: {
      phone?: string;
      city?: string;
      category?: string;
      bankName?: string;
      accountNumber?: string;
    }
  ) => void;
  logout: () => void;
  resetPassword: (email: string, newPassword?: string) => boolean;

  // Vendor Portal Actions
  submitVendorBid: (rfqId: string, amount: number, leadTimeDays: number, notes: string) => void;
  acknowledgePO: (poId: string, trackingNumber?: string, estimatedDeliveryDate?: string) => void;
  submitVendorInvoice: (poId: string, invoiceNumber: string, amount: number, dueDate: string) => void;
  
  // Collections
  requests: ProcurementRequest[];
  rfqs: RFQ[];
  bids: Bid[];
  vendors: Vendor[];
  purchaseOrders: PurchaseOrder[];
  goodsReceipts: GoodsReceiptNote[];
  inventoryItems: InventoryItem[];
  stockMovements: StockMovement[];
  invoices: Invoice[];
  payments: PaymentRecord[];
  budgets: Budget[];
  contracts: Contract[];
  exceptions: ExceptionAlert[];
  notifications: NotificationItem[];
  auditLogs: AuditLog[];
  departments: Department[];
  locations: Location[];
  users: User[];

  // Actions
  createRequest: (
    data: Omit<
      ProcurementRequest,
      'id' | 'requestNumber' | 'createdAt' | 'updatedAt' | 'approvalsHistory' | 'currentApprovalStepIndex' | 'status'
    > & { status?: RequestStatus }
  ) => void;
  updateRequestStatus: (id: string, status: ProcurementRequest['status']) => void;
  approveRequest: (id: string, comment?: string) => void;
  rejectRequest: (id: string, reason?: string) => void;
  
  createRFQ: (data: Omit<RFQ, 'id' | 'rfqNumber' | 'createdAt' | 'status'>) => void;
  submitBid: (rfqId: string, bidData: Omit<Bid, 'id' | 'submittedAt' | 'status'>) => void;
  awardBid: (rfqId: string, bidId: string) => void;

  createPurchaseOrder: (data: Omit<PurchaseOrder, 'id' | 'poNumber' | 'issuedAt' | 'status'>) => void;
  recordGoodsReceipt: (grnData: Omit<GoodsReceiptNote, 'id' | 'grnNumber' | 'receivedDate'>) => void;
  adjustStock: (itemId: string, qtyDiff: number, movementType: StockMovement['movementType'], reason: string) => void;

  createInvoice: (data: Omit<Invoice, 'id' | 'invoiceNumber' | 'status' | 'threeWayMatch'>) => void;
  approveInvoice: (id: string) => void;
  processPayment: (data: Omit<PaymentRecord, 'id' | 'paymentNumber' | 'paymentDate' | 'status'>) => void;

  addVendor: (vendor: Omit<Vendor, 'id' | 'rating' | 'onTimeDeliveryRate' | 'qualityScore' | 'completedOrdersCount' | 'totalSpend'>) => void;
  updateVendor: (id: string, updates: Partial<Vendor>) => void;
  dismissException: (id: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  // Search & Global state
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isAiModalOpen: boolean;
  setIsAiModalOpen: (open: boolean) => void;
  isAPKModalOpen: boolean;
  setIsAPKModalOpen: (open: boolean) => void;

  // Helper
  formatCurrency: (amount: number) => string;
  t: (key: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<ActiveView>('landing');
  const [currentUser, setCurrentUser] = useState<User>(sampleUsers[0]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem('procura_auth');
    return saved !== null ? saved === 'true' : true;
  });
  const [orgConfig, setOrgConfig] = useState<OrgConfig>(() => {
    const saved = localStorage.getItem('procura_org_config');
    return saved ? JSON.parse(saved) : initialOrgConfig;
  });

  const [requests, setRequests] = useState<ProcurementRequest[]>(sampleRequests);
  const [rfqs, setRfqs] = useState<RFQ[]>(sampleRFQs);
  const [bids, setBids] = useState<Bid[]>(sampleBids);
  const [vendors, setVendors] = useState<Vendor[]>(sampleVendors);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(samplePurchaseOrders);
  const [goodsReceipts, setGoodsReceipts] = useState<GoodsReceiptNote[]>(sampleGoodsReceipts);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(sampleInventoryItems);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>(sampleStockMovements);
  const [invoices, setInvoices] = useState<Invoice[]>(sampleInvoices);
  const [payments, setPayments] = useState<PaymentRecord[]>(samplePayments);
  const [budgets, setBudgets] = useState<Budget[]>(sampleBudgets);
  const [contracts, setContracts] = useState<Contract[]>(sampleContracts);
  const [exceptions, setExceptions] = useState<ExceptionAlert[]>(sampleExceptions);
  const [notifications, setNotifications] = useState<NotificationItem[]>(sampleNotifications);
  const [departments, setDepartments] = useState<Department[]>(sampleDepartments);
  const [locations, setLocations] = useState<Location[]>(sampleLocations);
  const [users, setUsers] = useState<User[]>(sampleUsers);

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    {
      id: 'log_1',
      timestamp: '2026-09-29T11:20:00Z',
      userId: 'u_finance',
      userName: 'Fatima Al-Mansoor',
      userRole: 'finance',
      action: 'PAYMENT_PROCESSED',
      entity: 'Payment',
      entityId: 'PAY-2026-052',
      details: 'Dispatched $12,075 payment to PrimeTech Solutions for INV-2026-088.',
    },
    {
      id: 'log_2',
      timestamp: '2026-09-28T16:15:00Z',
      userId: 'system',
      userName: 'Procura System',
      userRole: 'admin',
      action: '3_WAY_MATCH_EXCEPTION',
      entity: 'Invoice',
      entityId: 'INV-2026-091',
      details: 'Detected quantity mismatch between PO-2026-118, GRN-2026-077 and INV-2026-091.',
    },
    {
      id: 'log_3',
      timestamp: '2026-09-28T15:25:00Z',
      userId: 'u_requester',
      userName: 'Emmanuel Adebayo',
      userRole: 'requester',
      action: 'GOODS_RECEIPT_LOGGED',
      entity: 'GoodsReceipt',
      entityId: 'GRN-2026-077',
      details: 'Recorded delivery of warehouse chemicals. Flagged 2 missing/damaged glove packs.',
    },
  ]);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isAPKModalOpen, setIsAPKModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('procura_org_config', JSON.stringify(orgConfig));
  }, [orgConfig]);

  const addAudit = (action: string, entity: string, entityId: string, details: string) => {
    const newLog: AuditLog = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      action,
      entity,
      entityId,
      details,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const updateOrgConfig = (updates: Partial<OrgConfig>) => {
    setOrgConfig((prev) => ({ ...prev, ...updates }));
    addAudit('ORG_CONFIG_UPDATED', 'Organization', orgConfig.id, 'Organization settings modified.');
  };

  const switchRole = (role: UserRole) => {
    const matchedUser = users.find((u) => u.role === role);
    if (matchedUser) {
      setCurrentUser(matchedUser);
    } else {
      const newUser = {
        id: `u_${role}`,
        name: `User (${role.replace('_', ' ')})`,
        email: `${role}@apexglobal.com`,
        role,
      };
      setCurrentUser(newUser);
    }
    if (role === 'vendor') {
      setActiveView('vendor_portal');
    } else if (activeView === 'vendor_portal') {
      setActiveView('dashboard');
    }
  };

  const login = (email: string, role?: UserRole): boolean => {
    let target = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!target && role) {
      target = users.find((u) => u.role === role);
    }
    if (!target) {
      target = {
        id: `u_${Date.now()}`,
        name: email.split('@')[0],
        email,
        role: role || 'owner',
      };
      setUsers((prev) => [...prev, target!]);
    }
    setCurrentUser(target);
    setIsAuthenticated(true);
    localStorage.setItem('procura_auth', 'true');
    if (target.role === 'vendor') {
      setActiveView('vendor_portal');
    } else {
      setActiveView('dashboard');
    }
    addAudit('USER_LOGIN', 'User', target.id, `${target.name} logged into Procura.`);
    return true;
  };

  const signup = (
    name: string,
    email: string,
    role: UserRole,
    orgName?: string,
    isVendor?: boolean,
    vendorDetails?: {
      phone?: string;
      city?: string;
      category?: string;
      bankName?: string;
      accountNumber?: string;
    }
  ) => {
    const newUser: User = {
      id: `u_${Date.now()}`,
      name,
      email,
      role: isVendor ? 'vendor' : role,
    };
    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('procura_auth', 'true');

    if (isVendor) {
      const newVendor: Vendor = {
        id: `v_${Date.now()}`,
        companyName: orgName || `${name} Supplies & Logistics Ltd`,
        contactPerson: name,
        email,
        phone: vendorDetails?.phone || '+1 (555) 019-2834',
        categories: vendorDetails?.category ? [vendorDetails.category] : ['General Supplies', 'Technology & Services'],
        city: vendorDetails?.city || 'Metropolitan Area',
        rating: 5.0,
        onTimeDeliveryRate: 100,
        qualityScore: 100,
        complianceStatus: 'verified',
        riskLevel: 'low',
        completedOrdersCount: 0,
        totalSpend: 0,
        documents: [
          {
            id: `doc_${Date.now()}`,
            name: 'Taxpayer Clearance & Registration',
            documentType: 'tax_clearance',
            expiryDate: '2027-12-31',
            isVerified: true,
            status: 'valid',
          },
          {
            id: `doc_cac_${Date.now()}`,
            name: 'Certificate of Commercial Incorporation',
            documentType: 'business_license',
            expiryDate: '2028-06-30',
            isVerified: true,
            status: 'valid',
          },
        ],
        bankDetails: {
          bankName: vendorDetails?.bankName || 'First Commercial Bank',
          accountNumber: vendorDetails?.accountNumber || '•••• 4521',
          accountName: orgName || name,
        },
      };
      setVendors((prev) => [newVendor, ...prev]);
      setActiveView('vendor_portal');
    } else {
      if (orgName) {
        setOrgConfig((prev) => ({ ...prev, name: orgName }));
      }
      setActiveView('dashboard');
    }
    addAudit('USER_SIGNUP', 'User', newUser.id, `New user ${name} registered (${isVendor ? 'Vendor' : role}).`);
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.setItem('procura_auth', 'false');
    setActiveView('auth');
    addAudit('USER_LOGOUT', 'User', currentUser.id, `${currentUser.name} signed out.`);
  };

  const resetPassword = (email: string, _newPassword?: string) => {
    addAudit('PASSWORD_RESET', 'User', email, `Password reset initiated for ${email}`);
    return true;
  };

  const submitVendorBid = (rfqId: string, amount: number, leadTimeDays: number, notes: string) => {
    const targetRFQ = rfqs.find((r) => r.id === rfqId);
    if (!targetRFQ) return;

    const vendorProfile = vendors.find((v) => v.email === currentUser.email) || vendors[0];
    const rfqItems = targetRFQ.items || targetRFQ.lineItems || [];
    const totalQty = Math.max(1, rfqItems.reduce((acc, i) => acc + (i.quantity || 1), 0));
    const newBid: Bid = {
      id: `bid_${Date.now()}`,
      rfqId,
      vendorId: vendorProfile.id,
      vendorName: vendorProfile.companyName,
      totalAmount: amount,
      deliveryDays: leadTimeDays,
      leadTimeDays,
      validUntil: targetRFQ.closingDate,
      submittedAt: new Date().toISOString(),
      status: 'submitted',
      items: rfqItems.map((item) => ({
        rfqItemId: item.id || item.itemId || '',
        itemId: item.id || item.itemId,
        description: item.description,
        quantity: item.quantity,
        unitPrice: amount / totalQty,
        totalPrice: amount,
        lineTotal: amount,
      })),
      lineItems: rfqItems.map((item) => ({
        rfqItemId: item.id || item.itemId || '',
        itemId: item.id || item.itemId,
        description: item.description,
        quantity: item.quantity,
        unitPrice: amount / totalQty,
        totalPrice: amount,
        lineTotal: amount,
      })),
      notes,
    };
    setBids((prev) => [newBid, ...prev]);
    setRfqs((prev) =>
      prev.map((r) => (r.id === rfqId ? { ...r, bidsCount: (r.bidsCount || 0) + 1 } : r))
    );
    addAudit('VENDOR_BID_SUBMITTED', 'RFQ', rfqId, `${vendorProfile.companyName} submitted a quote of $${amount}.`);
  };

  const acknowledgePO = (poId: string, trackingNumber?: string, estimatedDeliveryDate?: string) => {
    setPurchaseOrders((prev) =>
      prev.map((po) =>
        po.id === poId
          ? {
              ...po,
              status: 'confirmed_by_vendor',
              vendorAcknowledgedAt: new Date().toISOString(),
              dispatchedAt: new Date().toISOString(),
              trackingNumber: trackingNumber || `TRK-${Date.now().toString().slice(-6)}`,
              expectedDeliveryDate: estimatedDeliveryDate || po.expectedDeliveryDate,
              estimatedDeliveryDate: estimatedDeliveryDate || po.estimatedDeliveryDate || po.expectedDeliveryDate,
            }
          : po
      )
    );
    addAudit('PO_ACKNOWLEDGED', 'PurchaseOrder', poId, `Vendor acknowledged order ${poId}.`);
  };

  const submitVendorInvoice = (poId: string, invoiceNumber: string, amount: number, dueDate: string) => {
    const po = purchaseOrders.find((p) => p.id === poId);
    const vendorProfile = vendors.find((v) => v.id === po?.vendorId) || vendors[0];
    const poItems = po ? (po.items || po.lineItems || []) : [];
    const newInv: Invoice = {
      id: `inv_${Date.now()}`,
      invoiceNumber,
      purchaseOrderId: poId,
      poId,
      poNumber: po ? po.poNumber : 'PO-DIRECT',
      vendorId: vendorProfile.id,
      vendorName: vendorProfile.companyName,
      issueDate: new Date().toISOString().split('T')[0],
      receivedDate: new Date().toISOString().split('T')[0],
      dueDate,
      subtotal: Math.round(amount / 1.075),
      taxAmount: Math.round(amount - amount / 1.075),
      totalAmount: amount,
      status: 'pending_review',
      threeWayMatch: {
        isMatched: false,
        quantityMatch: false,
        priceMatch: false,
        hasGrn: false,
        discrepancyNote: 'Pending receiving confirmation & 3-way matching audit',
      },
      items: poItems.map((li) => {
        const qty = li.quantityOrdered ?? li.quantity ?? 1;
        const total = li.totalPrice ?? li.lineTotal ?? (li.unitPrice * qty);
        return {
          id: li.id,
          itemId: li.itemId || li.id,
          description: li.description,
          quantityBilled: qty,
          quantity: qty,
          unitPrice: li.unitPrice,
          totalPrice: total,
          lineTotal: total,
        };
      }),
      lineItems: poItems.map((li) => {
        const qty = li.quantityOrdered ?? li.quantity ?? 1;
        const total = li.totalPrice ?? li.lineTotal ?? (li.unitPrice * qty);
        return {
          id: li.id,
          itemId: li.itemId || li.id,
          description: li.description,
          quantityBilled: qty,
          quantity: qty,
          unitPrice: li.unitPrice,
          totalPrice: total,
          lineTotal: total,
        };
      }),
    };
    setInvoices((prev) => [newInv, ...prev]);
    addAudit('VENDOR_INVOICE_SUBMITTED', 'Invoice', newInv.id, `${vendorProfile.companyName} submitted invoice ${invoiceNumber} for $${amount}.`);
  };

  const loadPreset = (presetKey: 'enterprise' | 'smb' | 'individual' | 'retail') => {
    if (presetKey === 'individual') {
      setOrgConfig({
        id: 'org_freelance',
        name: 'Alex Rivera Studio',
        businessType: 'individual',
        teamSize: '1',
        hasDepartments: false,
        approvalWorkflow: 'none',
        hasSuppliers: true,
        hasRfqs: false,
        hasBudgets: false,
        hasPhysicalGoods: false,
        hasInvoicesPayments: true,
        hasMultipleLocations: false,
        currency: 'USD',
        language: 'en',
        taxRate: 0,
        onboardingCompleted: true,
      });
      switchRole('owner');
    } else if (presetKey === 'smb') {
      setOrgConfig({
        id: 'org_smb_tech',
        name: 'Zenith Labs Inc.',
        businessType: 'small_business',
        teamSize: '6-20',
        hasDepartments: false,
        approvalWorkflow: 'simple',
        hasSuppliers: true,
        hasRfqs: false,
        hasBudgets: true,
        hasPhysicalGoods: true,
        hasInvoicesPayments: true,
        hasMultipleLocations: false,
        currency: 'USD',
        language: 'en',
        taxRate: 5,
        onboardingCompleted: true,
      });
      switchRole('owner');
    } else if (presetKey === 'retail') {
      setOrgConfig({
        id: 'org_metro_retail',
        name: 'Metro Wholesale & Superstores',
        businessType: 'retail',
        teamSize: '21-100',
        hasDepartments: true,
        approvalWorkflow: 'simple',
        hasSuppliers: true,
        hasRfqs: true,
        hasBudgets: true,
        hasPhysicalGoods: true,
        hasInvoicesPayments: true,
        hasMultipleLocations: true,
        currency: 'USD',
        language: 'en',
        taxRate: 7.5,
        onboardingCompleted: true,
      });
      switchRole('procurement_officer');
    } else {
      // Enterprise default
      setOrgConfig(initialOrgConfig);
      switchRole('owner');
    }
    setActiveView('dashboard');
  };

  const formatCurrency = (amount: number) => {
    return formatCurrencyAmount(amount, orgConfig.currency);
  };

  const t = (key: string) => {
    return getTranslation(key, orgConfig.language);
  };

  // Business Actions
  const createRequest = (
    data: Omit<ProcurementRequest, 'id' | 'requestNumber' | 'createdAt' | 'updatedAt' | 'approvalsHistory' | 'currentApprovalStepIndex' | 'status'> & { status?: RequestStatus }
  ) => {
    const num = `REQ-2026-${String(requests.length + 101).padStart(3, '0')}`;
    const newReq: ProcurementRequest = {
      status: data.status || 'pending_approval',
      requiredDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      ...data,
      id: `req_${Date.now()}`,
      requestNumber: num,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      currentApprovalStepIndex: 0,
      approvalsHistory: [
        {
          stepName: 'Initial Submission',
          approverName: currentUser.name,
          status: 'pending',
          timestamp: new Date().toISOString(),
        },
      ],
    };

    setRequests((prev) => [newReq, ...prev]);
    addAudit('REQUEST_CREATED', 'ProcurementRequest', num, `Created request: ${newReq.title} for ${formatCurrency(newReq.estimatedBudget)}`);

    // Add notification
    setNotifications((prev) => [
      {
        id: `notif_${Date.now()}`,
        title: 'New Request Created',
        message: `${newReq.requestNumber} - ${newReq.title} submitted.`,
        type: 'approval',
        timestamp: 'Just now',
        read: false,
        linkTab: 'requests',
      },
      ...prev,
    ]);
  };

  const updateRequestStatus = (id: string, status: ProcurementRequest['status']) => {
    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status, updatedAt: new Date().toISOString() } : req))
    );
  };

  const approveRequest = (id: string, comment?: string) => {
    const target = requests.find((r) => r.id === id);
    if (!target) return;

    setRequests((prev) =>
      prev.map((req) => {
        if (req.id !== id) return req;
        const newHistory = [
          ...req.approvalsHistory,
          {
            stepName: 'Executive / Lead Signoff',
            approverName: currentUser.name,
            status: 'approved' as const,
            comments: comment || 'Approved in accordance with procurement policy.',
            timestamp: new Date().toISOString(),
          },
        ];
        return {
          ...req,
          status: 'approved',
          approvalsHistory: newHistory,
          updatedAt: new Date().toISOString(),
        };
      })
    );

    addAudit('REQUEST_APPROVED', 'ProcurementRequest', target.requestNumber, `Approved by ${currentUser.name}`);
  };

  const rejectRequest = (id: string, reason?: string) => {
    const target = requests.find((r) => r.id === id);
    if (!target) return;

    setRequests((prev) =>
      prev.map((req) => {
        if (req.id !== id) return req;
        const newHistory = [
          ...req.approvalsHistory,
          {
            stepName: 'Approval Review',
            approverName: currentUser.name,
            status: 'rejected' as const,
            comments: reason || 'Request rejected due to policy or budget constraints.',
            timestamp: new Date().toISOString(),
          },
        ];
        return {
          ...req,
          status: 'rejected',
          approvalsHistory: newHistory,
          updatedAt: new Date().toISOString(),
        };
      })
    );

    addAudit('REQUEST_REJECTED', 'ProcurementRequest', target.requestNumber, `Rejected by ${currentUser.name}: ${reason || ''}`);
  };

  const createRFQ = (data: Omit<RFQ, 'id' | 'rfqNumber' | 'createdAt' | 'status'>) => {
    const num = `RFQ-2026-${String(rfqs.length + 51).padStart(3, '0')}`;
    const newRfq: RFQ = {
      ...data,
      id: `rfq_${Date.now()}`,
      rfqNumber: num,
      status: 'published',
      createdAt: new Date().toISOString(),
    };

    setRfqs((prev) => [newRfq, ...prev]);
    if (data.procurementRequestId) {
      updateRequestStatus(data.procurementRequestId, 'converted_to_rfq');
    }

    addAudit('RFQ_PUBLISHED', 'RFQ', num, `Tender published: ${newRfq.title}`);
  };

  const submitBid = (rfqId: string, bidData: Omit<Bid, 'id' | 'submittedAt' | 'status'>) => {
    const newBid: Bid = {
      ...bidData,
      id: `bid_${Date.now()}`,
      status: 'submitted',
      submittedAt: new Date().toISOString(),
    };

    setBids((prev) => [newBid, ...prev]);
    addAudit('BID_SUBMITTED', 'Bid', newBid.id, `Vendor ${newBid.vendorName} submitted bid for ${formatCurrency(newBid.totalAmount)}`);
  };

  const awardBid = (rfqId: string, bidId: string) => {
    const targetBid = bids.find((b) => b.id === bidId);
    const targetRfq = rfqs.find((r) => r.id === rfqId);
    if (!targetBid || !targetRfq) return;

    // Set bid status
    setBids((prev) =>
      prev.map((b) => {
        if (b.rfqId === rfqId) {
          return b.id === bidId ? { ...b, status: 'awarded' } : { ...b, status: 'rejected' };
        }
        return b;
      })
    );

    // Set RFQ status
    setRfqs((prev) => prev.map((r) => (r.id === rfqId ? { ...r, status: 'awarded' } : r)));

    // Automatically generate Purchase Order
    const poNumber = `PO-2026-${String(purchaseOrders.length + 120).padStart(3, '0')}`;
    const poItems: POItem[] = targetRfq.items.map((item, idx) => {
      const bidItem = targetBid.items.find((bi) => bi.rfqItemId === item.id) || targetBid.items[idx];
      const unitPrice = bidItem ? bidItem.unitPrice : 100;
      return {
        id: `poi_${Date.now()}_${idx}`,
        description: item.description,
        quantityOrdered: item.quantity,
        quantityReceived: 0,
        unitPrice,
        totalPrice: unitPrice * item.quantity,
      };
    });

    const subtotal = poItems.reduce((acc, it) => acc + it.totalPrice, 0);
    const taxAmount = (subtotal * orgConfig.taxRate) / 100;

    const newPO: PurchaseOrder = {
      id: `po_${Date.now()}`,
      poNumber,
      requestId: targetRfq.procurementRequestId,
      rfqId: targetRfq.id,
      vendorId: targetBid.vendorId,
      vendorName: targetBid.vendorName,
      vendorEmail: 'orders@vendor.com',
      items: poItems,
      subtotal,
      taxAmount,
      shippingAmount: 200,
      totalAmount: subtotal + taxAmount + 200,
      deliveryTerms: 'DAP (Delivered at Place)',
      paymentTerms: 'Net 30 Days',
      expectedDeliveryDate: new Date(Date.now() + targetBid.deliveryDays * 86400000).toISOString().split('T')[0],
      deliveryAddress: targetRfq.deliveryLocation,
      status: 'issued',
      issuedAt: new Date().toISOString(),
      notes: `Generated automatically upon award of ${targetRfq.rfqNumber}.`,
    };

    setPurchaseOrders((prev) => [newPO, ...prev]);
    addAudit('BID_AWARDED', 'RFQ', targetRfq.rfqNumber, `Awarded to ${targetBid.vendorName}. Generated Purchase Order ${poNumber}.`);

    setNotifications((prev) => [
      {
        id: `notif_${Date.now()}`,
        title: 'Tender Awarded & PO Issued',
        message: `${poNumber} issued to ${targetBid.vendorName} for ${formatCurrency(newPO.totalAmount)}`,
        type: 'rfq',
        timestamp: 'Just now',
        read: false,
        linkTab: 'orders',
      },
      ...prev,
    ]);
  };

  const createPurchaseOrder = (data: Omit<PurchaseOrder, 'id' | 'poNumber' | 'issuedAt' | 'status'>) => {
    const poNumber = `PO-2026-${String(purchaseOrders.length + 120).padStart(3, '0')}`;
    const newPO: PurchaseOrder = {
      ...data,
      id: `po_${Date.now()}`,
      poNumber,
      status: 'issued',
      issuedAt: new Date().toISOString(),
    };

    setPurchaseOrders((prev) => [newPO, ...prev]);
    addAudit('PO_ISSUED', 'PurchaseOrder', poNumber, `Issued PO to ${newPO.vendorName} for ${formatCurrency(newPO.totalAmount)}`);
  };

  const recordGoodsReceipt = (grnData: Omit<GoodsReceiptNote, 'id' | 'grnNumber' | 'receivedDate'>) => {
    const grnNumber = `GRN-2026-${String(goodsReceipts.length + 80).padStart(3, '0')}`;
    const newGRN: GoodsReceiptNote = {
      ...grnData,
      id: `grn_${Date.now()}`,
      grnNumber,
      receivedDate: new Date().toISOString(),
    };

    setGoodsReceipts((prev) => [newGRN, ...prev]);

    // Update PO quantities and status
    setPurchaseOrders((prev) =>
      prev.map((po) => {
        if (po.id !== grnData.purchaseOrderId) return po;
        const updatedItems = po.items.map((poi) => {
          const receivedMatch = grnData.items.find((gi) => gi.poItemId === poi.id);
          const addQty = receivedMatch ? receivedMatch.quantityReceived : 0;
          return {
            ...poi,
            quantityReceived: poi.quantityReceived + addQty,
          };
        });

        const isFully = updatedItems.every((it) => it.quantityReceived >= it.quantityOrdered);
        return {
          ...po,
          items: updatedItems,
          status: isFully ? 'fully_received' : 'partially_received',
        };
      })
    );

    // Automated Inventory increment!
    grnData.items.forEach((gi) => {
      if (gi.quantityReceived > 0) {
        // Find or create inventory item
        setInventoryItems((prev) => {
          const existing = prev.find((item) => item.name.toLowerCase() === gi.description.toLowerCase());
          if (existing) {
            return prev.map((item) =>
              item.id === existing.id
                ? {
                    ...item,
                    currentStock: item.currentStock + gi.quantityReceived,
                    lastStockUpdate: new Date().toISOString(),
                  }
                : item
            );
          } else {
            const newItem: InventoryItem = {
              id: `inv_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
              sku: `SKU-${gi.description.substring(0, 4).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
              name: gi.description,
              category: 'General Supplies',
              unit: 'units',
              currentStock: gi.quantityReceived,
              minimumStock: 10,
              reorderLevel: 20,
              averageUnitCost: 100,
              locationId: grnData.locationId,
              locationName: grnData.locationName,
              lastStockUpdate: new Date().toISOString(),
            };
            return [...prev, newItem];
          }
        });

        // Add Stock Movement record
        const newMovement: StockMovement = {
          id: `mov_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          inventoryItemId: gi.poItemId,
          itemName: gi.description,
          movementType: 'receipt_grn',
          quantityChange: gi.quantityReceived,
          resultingStock: gi.quantityReceived,
          referenceId: grnNumber,
          locationId: grnData.locationId,
          timestamp: new Date().toISOString(),
          performedBy: currentUser.name,
        };
        setStockMovements((prev) => [newMovement, ...prev]);
      }
    });

    addAudit('GRN_RECORDED', 'GoodsReceipt', grnNumber, `Recorded receipt for ${grnData.poNumber} at ${grnData.locationName}`);
  };

  const adjustStock = (itemId: string, qtyDiff: number, movementType: StockMovement['movementType'], reason: string) => {
    setInventoryItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        const newStock = Math.max(0, item.currentStock + qtyDiff);
        const mov: StockMovement = {
          id: `mov_${Date.now()}`,
          inventoryItemId: item.id,
          itemName: item.name,
          movementType,
          quantityChange: qtyDiff,
          resultingStock: newStock,
          locationId: item.locationId,
          timestamp: new Date().toISOString(),
          performedBy: currentUser.name,
        };
        setStockMovements((mPrev) => [mov, ...mPrev]);
        return {
          ...item,
          currentStock: newStock,
          lastStockUpdate: new Date().toISOString(),
        };
      })
    );
  };

  // Automated 3-Way Matching Engine
  const createInvoice = (data: Omit<Invoice, 'id' | 'invoiceNumber' | 'status' | 'threeWayMatch'>) => {
    const invNumber = `INV-2026-${String(invoices.length + 95).padStart(3, '0')}`;
    const linkedPO = purchaseOrders.find((p) => p.id === data.purchaseOrderId);
    const linkedGRN = goodsReceipts.find((g) => g.purchaseOrderId === data.purchaseOrderId);

    let isMatched = true;
    let quantityMatch = true;
    let priceMatch = true;
    const hasGrn = !!linkedGRN;
    let discrepancyNote: string | undefined = undefined;

    if (!linkedGRN) {
      isMatched = false;
      discrepancyNote = 'No Goods Receipt Note (GRN) found for this Purchase Order yet.';
    } else if (linkedPO) {
      // Check billed items against received items
      data.items.forEach((invItem) => {
        const grnItem = linkedGRN.items.find(
          (gi) => gi.description.toLowerCase() === invItem.description.toLowerCase()
        );
        const poItem = linkedPO.items.find(
          (pi) => pi.description.toLowerCase() === invItem.description.toLowerCase()
        );

        if (grnItem && invItem.quantityBilled > grnItem.quantityReceived) {
          quantityMatch = false;
          isMatched = false;
          discrepancyNote = `Quantity Discrepancy: Billed for ${invItem.quantityBilled}, but only ${grnItem.quantityReceived} verified on ${linkedGRN.grnNumber}.`;
        }

        if (poItem && invItem.unitPrice > poItem.unitPrice) {
          priceMatch = false;
          isMatched = false;
          discrepancyNote = `Price Discrepancy: Billed unit price ($${invItem.unitPrice}) exceeds approved PO unit price ($${poItem.unitPrice}).`;
        }
      });
    }

    const newInvoice: Invoice = {
      ...data,
      id: `inv_${Date.now()}`,
      invoiceNumber: invNumber,
      grnId: linkedGRN?.id,
      grnNumber: linkedGRN?.grnNumber,
      status: isMatched ? 'matched' : 'exception',
      threeWayMatch: {
        isMatched,
        quantityMatch,
        priceMatch,
        hasGrn,
        discrepancyNote,
      },
    };

    setInvoices((prev) => [newInvoice, ...prev]);

    if (!isMatched) {
      // Trigger Exception Alert
      setExceptions((prev) => [
        {
          id: `ex_${Date.now()}`,
          type: 'invoice_mismatch',
          severity: 'high',
          title: `3-Way Match Exception: ${invNumber}`,
          description: discrepancyNote || 'Discrepancy detected between invoice, PO and GRN.',
          entityId: newInvoice.id,
          entityType: 'invoice',
          createdAt: new Date().toISOString(),
          resolved: false,
        },
        ...prev,
      ]);
    }

    addAudit('INVOICE_CREATED', 'Invoice', invNumber, `Added invoice: ${invNumber}. Matched: ${isMatched}`);
  };

  const approveInvoice = (id: string) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status: 'approved' } : inv))
    );
    addAudit('INVOICE_APPROVED', 'Invoice', id, 'Approved for payment clearance.');
  };

  const processPayment = (data: Omit<PaymentRecord, 'id' | 'paymentNumber' | 'paymentDate' | 'status'>) => {
    const payNumber = `PAY-2026-${String(payments.length + 55).padStart(3, '0')}`;
    const newPayment: PaymentRecord = {
      ...data,
      id: `pay_${Date.now()}`,
      paymentNumber: payNumber,
      paymentDate: new Date().toISOString().split('T')[0],
      status: 'completed',
    };

    setPayments((prev) => [newPayment, ...prev]);

    // Mark invoice paid
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === data.invoiceId ? { ...inv, status: 'paid' } : inv))
    );

    // Update budget spent amount
    setBudgets((prev) =>
      prev.map((b) => {
        const newSpent = b.spentAmount + data.amount;
        return {
          ...b,
          spentAmount: newSpent,
          remainingAmount: Math.max(0, b.allocatedAmount - newSpent),
        };
      })
    );

    addAudit('PAYMENT_DISPATCHED', 'Payment', payNumber, `Dispatched payment of ${formatCurrency(data.amount)} to ${data.vendorName}`);
  };

  const addVendor = (vendorData: Omit<Vendor, 'id' | 'rating' | 'onTimeDeliveryRate' | 'qualityScore' | 'completedOrdersCount' | 'totalSpend'>) => {
    const newVendor: Vendor = {
      ...vendorData,
      id: `v_${Date.now()}`,
      rating: 4.5,
      onTimeDeliveryRate: 95,
      qualityScore: 92,
      completedOrdersCount: 0,
      totalSpend: 0,
    };
    setVendors((prev) => [newVendor, ...prev]);
    addAudit('VENDOR_ADDED', 'Vendor', newVendor.id, `Enrolled supplier: ${newVendor.companyName}`);
  };

  const updateVendor = (id: string, updates: Partial<Vendor>) => {
    setVendors((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...updates } : v))
    );
    addAudit('VENDOR_UPDATED', 'Vendor', id, 'Vendor account profile & banking details updated.');
  };

  const dismissException = (id: string) => {
    setExceptions((prev) => prev.map((ex) => (ex.id === id ? { ...ex, resolved: true } : ex)));
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <AppContext.Provider
      value={{
        activeView,
        setActiveView,
        currentUser,
        setCurrentUser,
        switchRole,
        orgConfig,
        updateOrgConfig,
        loadPreset,

        isAuthenticated,
        login,
        signup,
        logout,
        resetPassword,
        submitVendorBid,
        acknowledgePO,
        submitVendorInvoice,

        requests,
        rfqs,
        bids,
        vendors,
        purchaseOrders,
        goodsReceipts,
        inventoryItems,
        stockMovements,
        invoices,
        payments,
        budgets,
        contracts,
        exceptions,
        notifications,
        auditLogs,
        departments,
        locations,
        users,

        createRequest,
        updateRequestStatus,
        approveRequest,
        rejectRequest,

        createRFQ,
        submitBid,
        awardBid,

        createPurchaseOrder,
        recordGoodsReceipt,
        adjustStock,

        createInvoice,
        approveInvoice,
        processPayment,

        addVendor,
        updateVendor,
        dismissException,
        markNotificationAsRead,
        markAllNotificationsAsRead,

        isSearchOpen,
        setIsSearchOpen,
        isAiModalOpen,
        setIsAiModalOpen,
        isAPKModalOpen,
        setIsAPKModalOpen,

        formatCurrency,
        t,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
