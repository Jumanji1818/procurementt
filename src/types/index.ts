export type BusinessType =
  | 'individual'
  | 'small_business'
  | 'corporation'
  | 'government'
  | 'education'
  | 'healthcare'
  | 'ngo'
  | 'construction'
  | 'manufacturing'
  | 'retail'
  | 'hospitality'
  | 'services'
  | 'other';

export type TeamSize = '1' | '2-5' | '6-20' | '21-100' | '101-500' | '500+';

export type ApprovalWorkflowType = 'none' | 'simple' | 'multi_level' | 'configurable_matrix';

export type UserRole =
  | 'owner'
  | 'requester'
  | 'approver'
  | 'procurement_officer'
  | 'finance'
  | 'vendor'
  | 'admin';

export type CurrencyCode = 'USD' | 'NGN' | 'EUR' | 'GBP' | 'KES' | 'JPY' | 'AED';

export type SupportedLanguage = 'en' | 'fr' | 'es' | 'ha' | 'sw' | 'ar';

export interface OrgConfig {
  id: string;
  name: string;
  businessType: BusinessType;
  teamSize: TeamSize;
  hasDepartments: boolean;
  approvalWorkflow: ApprovalWorkflowType;
  hasSuppliers: boolean;
  hasRfqs: boolean;
  hasBudgets: boolean;
  hasPhysicalGoods: boolean; // Enables deliveries, GRN, Inventory, Returns
  hasInvoicesPayments: boolean; // Enables 3-way matching, invoice inbox, payments
  hasMultipleLocations: boolean;
  currency: CurrencyCode;
  language: SupportedLanguage;
  taxRate: number; // percentage, e.g. 7.5
  logoUrl?: string;
  fiscalYearStart?: string;
  onboardingCompleted: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  departmentId?: string;
  locationId?: string;
  avatarUrl?: string;
  delegatedToUserId?: string;
  delegationEndDate?: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  headUserId: string;
  headName: string;
  budgetAllocated: number;
  budgetSpent: number;
}

export interface Location {
  id: string;
  name: string;
  code: string;
  type: 'headquarters' | 'branch' | 'warehouse' | 'store' | 'site';
  address: string;
  city: string;
}

export type RequestPriority = 'low' | 'medium' | 'high' | 'urgent';

export type RequestStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'pending_approval'
  | 'approved'
  | 'rejected'
  | 'returned'
  | 'converted_to_rfq'
  | 'converted_to_po'
  | 'completed';

export interface RequestItem {
  id: string;
  description: string;
  category: string;
  quantity: number;
  unit: string;
  estimatedUnitPrice: number;
  totalPrice: number;
}

export interface ProcurementRequest {
  id: string;
  requestNumber: string;
  title: string;
  description: string;
  requesterId: string;
  requesterName: string;
  departmentId?: string;
  departmentName?: string;
  locationId?: string;
  locationName?: string;
  category: string;
  priority: RequestPriority;
  requiredDate: string;
  estimatedBudget: number;
  fundingSource: string;
  budgetCode?: string;
  justification: string;
  technicalSpecs?: string;
  status: RequestStatus;
  items: RequestItem[];
  isRecurring: boolean;
  recurringInterval?: 'monthly' | 'quarterly' | 'yearly';
  currentApprovalStepIndex: number;
  createdAt: string;
  updatedAt: string;
  approvalsHistory: {
    stepName: string;
    approverName: string;
    status: 'approved' | 'rejected' | 'returned' | 'pending';
    comments?: string;
    timestamp?: string;
  }[];
}

export interface ApprovalRule {
  id: string;
  tierName: string;
  minAmount: number;
  maxAmount: number; // e.g. 1000000 or Infinity
  requiredRole: UserRole;
  requiredApproverName?: string;
  appliesToDepartmentId?: string;
  autoEscalateDays: number;
}

export type RFQStatus = 'draft' | 'published' | 'evaluation' | 'awarded' | 'cancelled';

export interface RFQItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  specifications: string;
}

export interface RFQ {
  id: string;
  rfqNumber: string;
  title: string;
  procurementRequestId?: string;
  items: RFQItem[];
  closingDate: string;
  deliveryLocation: string;
  invitedVendorIds: string[];
  status: RFQStatus;
  criteriaWeights: {
    price: number; // e.g. 40
    quality: number; // 25
    delivery: number; // 20
    vendorHistory: number; // 15
  };
  createdAt: string;
}

export interface BidItem {
  rfqItemId: string;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
}

export interface Bid {
  id: string;
  rfqId: string;
  vendorId: string;
  vendorName: string;
  totalAmount: number;
  deliveryDays: number;
  warrantyPeriod: string;
  validityDays: number;
  complianceChecked: boolean;
  technicalScore?: number;
  financialScore?: number;
  totalWeightedScore?: number;
  status: 'submitted' | 'under_evaluation' | 'shortlisted' | 'rejected' | 'awarded';
  items: BidItem[];
  submittedAt: string;
  comments?: string;
}

export interface VendorDocument {
  id: string;
  name: string;
  documentType: 'tax_clearance' | 'business_reg' | 'insurance' | 'iso_cert' | 'bank_ref';
  expiryDate: string;
  isVerified: boolean;
  status: 'valid' | 'expiring_soon' | 'expired';
}

export interface Vendor {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  categories: string[];
  city: string;
  rating: number; // 1 to 5
  onTimeDeliveryRate: number; // percentage, e.g. 96
  qualityScore: number; // percentage, e.g. 94
  complianceStatus: 'verified' | 'pending' | 'flagged';
  riskLevel: 'low' | 'medium' | 'high';
  completedOrdersCount: number;
  totalSpend: number;
  documents: VendorDocument[];
  bankDetails: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
}

export type POStatus =
  | 'draft'
  | 'issued'
  | 'confirmed_by_vendor'
  | 'in_transit'
  | 'partially_received'
  | 'fully_received'
  | 'cancelled';

export interface POItem {
  id: string;
  description: string;
  quantityOrdered: number;
  quantityReceived: number;
  unitPrice: number;
  totalPrice: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  requestId?: string;
  rfqId?: string;
  vendorId: string;
  vendorName: string;
  vendorEmail: string;
  items: POItem[];
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  totalAmount: number;
  deliveryTerms: string;
  paymentTerms: string;
  expectedDeliveryDate: string;
  deliveryLocationId?: string;
  deliveryAddress: string;
  status: POStatus;
  issuedAt: string;
  notes?: string;
}

export interface GoodsReceiptNote {
  id: string;
  grnNumber: string;
  purchaseOrderId: string;
  poNumber: string;
  vendorName: string;
  receiverUserId: string;
  receiverName: string;
  deliveryNoteNumber: string;
  receivedDate: string;
  locationId: string;
  locationName: string;
  items: {
    poItemId: string;
    description: string;
    quantityOrdered: number;
    quantityReceived: number;
    quantityDamaged: number;
    quantityMissing: number;
    inspectionPassed: boolean;
  }[];
  comments?: string;
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  unit: string;
  currentStock: number;
  minimumStock: number;
  reorderLevel: number;
  averageUnitCost: number;
  locationId: string;
  locationName: string;
  lastStockUpdate: string;
}

export interface StockMovement {
  id: string;
  inventoryItemId: string;
  itemName: string;
  movementType: 'receipt_grn' | 'issue' | 'transfer' | 'adjustment' | 'return';
  quantityChange: number; // +10 or -5
  resultingStock: number;
  referenceId?: string; // e.g. GRN-001
  locationId: string;
  timestamp: string;
  performedBy: string;
}

export type InvoiceStatus = 'pending_review' | 'matched' | 'exception' | 'approved' | 'paid';

export interface InvoiceItem {
  id: string;
  description: string;
  quantityBilled: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  vendorInvoiceNumber: string;
  purchaseOrderId: string;
  poNumber: string;
  grnId?: string;
  grnNumber?: string;
  vendorId: string;
  vendorName: string;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
  threeWayMatch: {
    isMatched: boolean;
    quantityMatch: boolean;
    priceMatch: boolean;
    hasGrn: boolean;
    discrepancyNote?: string;
  };
  items: InvoiceItem[];
}

export interface PaymentRecord {
  id: string;
  paymentNumber: string;
  invoiceId: string;
  invoiceNumber: string;
  vendorId: string;
  vendorName: string;
  amount: number;
  paymentDate: string;
  paymentMethod: 'bank_transfer' | 'credit_card' | 'check' | 'direct_debit';
  transactionReference: string;
  status: 'scheduled' | 'processing' | 'completed' | 'on_hold';
}

export interface Budget {
  id: string;
  code: string;
  name: string;
  departmentId?: string;
  category: string;
  fiscalYear: string;
  allocatedAmount: number;
  committedAmount: number; // In POs not yet invoiced
  spentAmount: number; // Invoices paid or approved
  remainingAmount: number;
  thresholdWarningPercent: number; // 80%
}

export interface Contract {
  id: string;
  contractNumber: string;
  title: string;
  vendorId: string;
  vendorName: string;
  totalValue: number;
  startDate: string;
  endDate: string;
  renewalNoticeDays: number;
  status: 'active' | 'expiring_soon' | 'expired' | 'terminated';
  slaTerms: string;
}

export interface ExceptionAlert {
  id: string;
  type:
    | 'approval_delay'
    | 'delivery_overdue'
    | 'invoice_mismatch'
    | 'budget_threshold'
    | 'vendor_doc_expired'
    | 'low_stock';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  entityId: string;
  entityType: 'request' | 'po' | 'invoice' | 'budget' | 'vendor' | 'inventory';
  createdAt: string;
  resolved: boolean;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  entity: string;
  entityId: string;
  details: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'approval' | 'rfq' | 'delivery' | 'finance' | 'alert' | 'system';
  timestamp: string;
  read: boolean;
  linkTab?: string;
}
