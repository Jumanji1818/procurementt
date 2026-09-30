import React, { useState } from 'react';
import { useApp, ActiveView } from '../../context/AppContext';
import {
  LayoutDashboard,
  FileText,
  CheckCircle,
  FileSpreadsheet,
  Users,
  ShoppingCart,
  Truck,
  Package,
  CreditCard,
  DollarSign,
  AlertTriangle,
  Calendar,
  FileCheck,
  TrendingUp,
  ShieldCheck,
  Settings,
  Search,
  Bell,
  Sparkles,
  Smartphone,
  Plus,
  Menu,
  X,
  ChevronDown,
  User as UserIcon,
  LogOut,
  Store,
  HelpCircle,
  Sun,
  Moon,
} from 'lucide-react';
import { UserRole, CurrencyCode, SupportedLanguage } from '../../types';
import { InterAccountRelay } from '../common/InterAccountRelay';

export const AppShell: React.FC<{
  children: React.ReactNode;
  onOpenNewRequest: () => void;
  onOpenNewPO: () => void;
  onOpenNewGRN: () => void;
  onOpenNewInvoice: () => void;
  onOpenNewVendor: () => void;
}> = ({
  children,
  onOpenNewRequest,
  onOpenNewPO,
  onOpenNewGRN,
  onOpenNewInvoice,
  onOpenNewVendor,
}) => {
  const {
    activeView,
    setActiveView,
    currentUser,
    switchRole,
    orgConfig,
    updateOrgConfig,
    requests,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setIsSearchOpen,
    setIsAiModalOpen,
    logout,
    theme,
    toggleTheme,
    t,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [quickCreateOpen, setQuickCreateOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const pendingApprovalsCount = requests.filter((r) => r.status === 'pending_approval').length;
  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  interface NavItem {
    id: ActiveView;
    label: string;
    icon: React.ElementType;
    badge?: number;
    visible: boolean;
  }

  // Strict Role-Based Navigation Architecture (RBAC)
  const isVendor = currentUser.role === 'vendor';
  const isRequester = currentUser.role === 'requester';
  const isApprover = currentUser.role === 'approver';
  const isProcurement = currentUser.role === 'procurement_officer';
  const isFinance = currentUser.role === 'finance';
  const isOwnerOrAdmin = currentUser.role === 'owner' || currentUser.role === 'admin';

  let rawNavItems: NavItem[] = [];

  if (isVendor) {
    rawNavItems = [
      { id: 'vendor_portal' as ActiveView, label: 'Supplier Portal', icon: Store, visible: true },
      { id: 'rfqs' as ActiveView, label: 'RFQ Opportunities', icon: FileSpreadsheet, visible: true },
      { id: 'orders' as ActiveView, label: 'Purchase Orders', icon: ShoppingCart, visible: true },
      { id: 'finance' as ActiveView, label: 'Invoices & Payouts', icon: CreditCard, visible: true },
    ];
  } else if (isRequester) {
    rawNavItems = [
      { id: 'dashboard' as ActiveView, label: 'My Requisitions', icon: LayoutDashboard, visible: true },
      { id: 'requests' as ActiveView, label: 'New & Past Requests', icon: FileText, visible: true },
      { id: 'deliveries' as ActiveView, label: 'Track Dispatched Items', icon: Truck, visible: orgConfig.hasPhysicalGoods },
      { id: 'inventory' as ActiveView, label: 'Company Catalog', icon: Package, visible: orgConfig.hasPhysicalGoods },
    ];
  } else if (isApprover) {
    rawNavItems = [
      { id: 'dashboard' as ActiveView, label: 'Approval Command', icon: LayoutDashboard, visible: true },
      { id: 'approvals' as ActiveView, label: 'Pending Approvals', icon: CheckCircle, badge: pendingApprovalsCount, visible: true },
      { id: 'budgets' as ActiveView, label: 'Department Budgets', icon: DollarSign, visible: true },
      { id: 'requests' as ActiveView, label: 'Team Requisitions', icon: FileText, visible: true },
      { id: 'calendar' as ActiveView, label: 'Approval Calendar', icon: Calendar, visible: true },
    ];
  } else if (isProcurement) {
    rawNavItems = [
      { id: 'dashboard' as ActiveView, label: 'Procurement Command', icon: LayoutDashboard, visible: true },
      { id: 'requests' as ActiveView, label: 'Sourcing Queue', icon: FileText, visible: true },
      { id: 'rfqs' as ActiveView, label: 'RFQs & Bidding', icon: FileSpreadsheet, visible: true },
      { id: 'orders' as ActiveView, label: 'Purchase Orders', icon: ShoppingCart, visible: true },
      { id: 'vendors' as ActiveView, label: 'Supplier Directory', icon: Users, visible: true },
      { id: 'contracts' as ActiveView, label: 'Contracts', icon: FileCheck, visible: true },
      { id: 'calendar' as ActiveView, label: 'Calendar', icon: Calendar, visible: true },
    ];
  } else if (isFinance) {
    rawNavItems = [
      { id: 'dashboard' as ActiveView, label: 'Finance Command', icon: LayoutDashboard, visible: true },
      { id: 'finance' as ActiveView, label: 'Invoices & 3-Way Match', icon: CreditCard, visible: true },
      { id: 'budgets' as ActiveView, label: 'Budget Ledgers', icon: DollarSign, visible: true },
      { id: 'orders' as ActiveView, label: 'PO Commitments', icon: ShoppingCart, visible: true },
      { id: 'audit' as ActiveView, label: 'Financial Audit Trail', icon: ShieldCheck, visible: true },
      { id: 'analytics' as ActiveView, label: 'Spend Analytics', icon: TrendingUp, visible: true },
    ];
  } else {
    // Owner / Administrator: Full Master Access
    rawNavItems = [
      { id: 'dashboard' as ActiveView, label: t('dashboard'), icon: LayoutDashboard, visible: true },
      { id: 'requests' as ActiveView, label: t('navRequests'), icon: FileText, visible: true },
      {
        id: 'approvals' as ActiveView,
        label: t('navApprovals'),
        icon: CheckCircle,
        badge: pendingApprovalsCount,
        visible: orgConfig.approvalWorkflow !== 'none',
      },
      { id: 'rfqs' as ActiveView, label: t('navRfqs'), icon: FileSpreadsheet, visible: orgConfig.hasRfqs },
      { id: 'vendors' as ActiveView, label: t('navVendors'), icon: Users, visible: orgConfig.hasSuppliers },
      { id: 'orders' as ActiveView, label: t('navPurchaseOrders'), icon: ShoppingCart, visible: true },
      { id: 'deliveries' as ActiveView, label: t('navDeliveries'), icon: Truck, visible: orgConfig.hasPhysicalGoods },
      { id: 'inventory' as ActiveView, label: t('navInventory'), icon: Package, visible: orgConfig.hasPhysicalGoods },
      { id: 'finance' as ActiveView, label: t('navFinance'), icon: CreditCard, visible: orgConfig.hasInvoicesPayments },
      { id: 'budgets' as ActiveView, label: t('navBudgets'), icon: DollarSign, visible: orgConfig.hasBudgets },
      { id: 'exceptions' as ActiveView, label: t('navExceptions'), icon: AlertTriangle, visible: true },
      { id: 'calendar' as ActiveView, label: t('navCalendar'), icon: Calendar, visible: true },
      { id: 'contracts' as ActiveView, label: t('navContracts'), icon: FileCheck, visible: true },
      { id: 'analytics' as ActiveView, label: t('navAnalytics'), icon: TrendingUp, visible: true },
      { id: 'audit' as ActiveView, label: t('navAudit'), icon: ShieldCheck, visible: true },
      { id: 'settings' as ActiveView, label: t('navSettings'), icon: Settings, visible: true },
    ];
  }

  const navItems = rawNavItems.filter((item) => item.visible);

  const roles: { role: UserRole; title: string; subtitle: string; icon: string }[] = [
    { role: 'owner', title: 'Business Owner', subtitle: 'Executive overview & org control', icon: '👔' },
    { role: 'requester', title: 'Requester / Employee', subtitle: 'Requisitions & personal tracking', icon: '👤' },
    { role: 'approver', title: 'Department Approver', subtitle: 'Sign-offs & budget compliance', icon: '✍️' },
    { role: 'procurement_officer', title: 'Procurement Officer', subtitle: 'RFQs, bidding & PO creation', icon: '📦' },
    { role: 'finance', title: 'Finance Comptroller', subtitle: 'Invoices, 3-way match & payments', icon: '💳' },
    { role: 'vendor', title: 'External Supplier', subtitle: 'Vendor Portal & bidding', icon: '🏢' },
  ];

  const handleNavClick = (viewId: ActiveView) => {
    setActiveView(viewId);
    setMobileMenuOpen(false);
  };

  const getRoleDisplayName = (r: UserRole) => {
    switch (r) {
      case 'owner':
        return 'Business Owner';
      case 'requester':
        return 'Employee';
      case 'approver':
        return 'Approver';
      case 'procurement_officer':
        return 'Procurement Officer';
      case 'finance':
        return 'Finance Comptroller';
      case 'vendor':
        return 'Supplier Partner';
      default:
        return 'Administrator';
    }
  };

  return (
    <div className="min-h-screen bg-[#04140e] text-[#f1f5f3] flex flex-col antialiased">
      {/* TOP HEADER */}
      <header className="sticky top-0 z-30 h-16 bg-[#061e15]/95 border-b border-[#143e2f] backdrop-blur-md px-3 sm:px-6 flex items-center justify-between shadow-lg">
        {/* Left: Brand + Hamburger */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-[#0c2f21] transition cursor-pointer"
            aria-label="Toggle Navigation Drawer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-[#d4af37]" /> : <Menu className="w-5 h-5" />}
          </button>

          <div
            onClick={() => setActiveView(isVendor ? 'vendor_portal' : 'dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#092b1f] border border-[#d4af37]/50 flex items-center justify-center font-black text-[#d4af37] text-base shadow-md group-hover:scale-105 group-hover:border-[#d4af37] transition">
              P
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-white text-base tracking-tight leading-none">
                  Procura
                </span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#0d3b2b] text-[#d4af37] font-bold uppercase tracking-wider border border-[#d4af37]/30">
                  {isVendor ? 'Supplier Portal' : 'Enterprise'}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium block mt-0.5 truncate max-w-[140px] sm:max-w-xs">
                {orgConfig.name}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Global Search Bar Trigger (Ctrl+K) */}
        <div className="flex-1 max-w-md mx-4 hidden md:block">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-[#051710] hover:bg-[#092218] border border-[#143e2f] hover:border-[#d4af37]/40 text-xs text-slate-400 transition text-left cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Search requests, purchase orders, invoices, suppliers...</span>
            </div>
            <kbd className="px-1.5 py-0.5 rounded bg-[#04140e] border border-[#143e2f] text-[10px] font-mono text-[#d4af37]">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Mobile Search Icon */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="md:hidden p-2 rounded-md text-slate-300 hover:text-white hover:bg-[#0c2f21] transition"
            aria-label="Search"
          >
            <Search className="w-4 h-4 text-[#d4af37]" />
          </button>

          {/* Theme Toggle (Dark / Light) */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md bg-[#082117] hover:bg-[#0c2d20] border border-[#143e2f] text-[#d4af37] transition cursor-pointer flex items-center justify-center shadow-sm"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-[#d4af37]" /> : <Moon className="w-4 h-4 text-[#d4af37]" />}
          </button>

          {/* AI Advisor Button */}
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#08281e] hover:bg-[#0e3b2c] border border-[#d4af37]/40 text-[#d4af37] text-xs font-semibold transition shadow-sm cursor-pointer"
            title="AI Procurement Intelligence"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">AI Advisor</span>
          </button>

          {/* Quick Create (+) Dropdown (For Buyer roles only) */}
          {!isVendor && (
            <div className="relative">
              <button
                onClick={() => setQuickCreateOpen(!quickCreateOpen)}
                className="p-2 rounded-md bg-[#d4af37] hover:bg-[#c49f2b] text-[#051b14] font-bold shadow-md shadow-[#d4af37]/15 transition active:scale-95 flex items-center justify-center cursor-pointer"
                title="Quick Action"
              >
                <Plus className="w-4 h-4" />
              </button>

              {quickCreateOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-xl bg-[#082117] border border-[#143e2f] shadow-2xl p-1.5 z-50">
                  <button
                    onClick={() => {
                      onOpenNewRequest();
                      setQuickCreateOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-md hover:bg-[#0c2d20] text-xs font-semibold text-slate-200 flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4 text-[#d4af37]" />
                    <span>{t('newRequest')}</span>
                  </button>
                  <button
                    onClick={() => {
                      onOpenNewPO();
                      setQuickCreateOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-md hover:bg-[#0c2d20] text-xs font-semibold text-slate-200 flex items-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4 text-[#d4af37]" />
                    <span>{t('createPO')}</span>
                  </button>
                  {orgConfig.hasPhysicalGoods && (
                    <button
                      onClick={() => {
                        onOpenNewGRN();
                        setQuickCreateOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-md hover:bg-[#0c2d20] text-xs font-semibold text-slate-200 flex items-center gap-2"
                    >
                      <Truck className="w-4 h-4 text-emerald-400" />
                      <span>{t('recordGRN')}</span>
                    </button>
                  )}
                  {orgConfig.hasInvoicesPayments && (
                    <button
                      onClick={() => {
                        onOpenNewInvoice();
                        setQuickCreateOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-md hover:bg-[#0c2d20] text-xs font-semibold text-slate-200 flex items-center gap-2"
                    >
                      <CreditCard className="w-4 h-4 text-[#d4af37]" />
                      <span>{t('enterInvoice')}</span>
                    </button>
                  )}
                  {orgConfig.hasSuppliers && (
                    <button
                      onClick={() => {
                        onOpenNewVendor();
                        setQuickCreateOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-md hover:bg-[#0c2d20] text-xs font-semibold text-slate-200 flex items-center gap-2"
                    >
                      <Users className="w-4 h-4 text-emerald-400" />
                      <span>{t('onboardVendor')}</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-[#0c2f21] transition relative"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#d4af37]" />
              )}
            </button>

            {notifDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-[#082117] border border-[#143e2f] shadow-2xl p-3 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-[#143e2f] text-xs">
                  <span className="font-bold text-white">Notifications ({unreadNotifsCount})</span>
                  <button
                    onClick={markAllNotificationsAsRead}
                    className="text-[11px] text-[#d4af37] hover:underline"
                  >
                    Mark all read
                  </button>
                </div>
                <div className="max-h-72 overflow-y-auto space-y-2 mt-2">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markNotificationAsRead(n.id);
                        if (n.linkTab) setActiveView(n.linkTab as ActiveView);
                        setNotifDropdownOpen(false);
                      }}
                      className={`p-2.5 rounded-xl cursor-pointer text-xs transition ${
                        n.read ? 'bg-[#051710] text-slate-400' : 'bg-[#0c2d20] text-slate-200 font-medium'
                      }`}
                    >
                      <div className="text-white font-bold text-xs">{n.title}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">{n.message}</div>
                      <div className="text-[10px] text-slate-500 mt-1">{n.timestamp}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile / Role Switcher Menu */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-[#082117] border border-[#143e2f] hover:border-[#d4af37]/50 transition cursor-pointer"
            >
              <div className="w-6 h-6 rounded-lg bg-[#092b1f] border border-[#d4af37]/40 flex items-center justify-center text-[11px] font-black text-[#d4af37]">
                {currentUser.name.charAt(0)}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-bold text-white leading-tight">
                  {getRoleDisplayName(currentUser.role)}
                </div>
                <div className="text-[10px] text-[#d4af37] leading-none">
                  {currentUser.name.split(' ')[0]}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-[#082117] border border-[#143e2f] shadow-2xl p-2 z-50">
                <div className="px-3 py-2 border-b border-[#143e2f] mb-2">
                  <div className="text-xs font-bold text-white">{currentUser.name}</div>
                  <div className="text-[11px] text-slate-400 truncate">{currentUser.email}</div>
                  <div className="inline-block mt-1 px-2 py-0.5 rounded bg-[#0d3b2b] text-[#d4af37] text-[10px] font-bold">
                    Active Role: {getRoleDisplayName(currentUser.role)}
                  </div>
                </div>

                <div className="text-[10px] uppercase font-bold text-[#d4af37] px-3 py-1">
                  Simulate Role-Based Access (RBAC)
                </div>

                <div className="space-y-1 mb-2">
                  {roles.map((r) => (
                    <button
                      key={r.role}
                      onClick={() => {
                        switchRole(r.role);
                        setProfileDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                        currentUser.role === r.role
                          ? 'bg-[#d4af37] text-[#051b14]'
                          : 'text-slate-300 hover:bg-[#0c2d20]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{r.icon}</span>
                        <span>{r.title}</span>
                      </div>
                      {currentUser.role === r.role && <CheckCircle className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>

                <div className="pt-2 border-t border-[#143e2f] space-y-1">
                  <button
                    onClick={() => {
                      logout();
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs text-rose-300 hover:bg-rose-950/40 flex items-center gap-2 cursor-pointer font-semibold"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-400" />
                    <span>Sign Out of Procura</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* BODY WITH PERSISTENT SIDEBAR & MAIN WORKSPACE */}
      <div className="flex-1 flex overflow-hidden">
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden lg:flex w-64 flex-col justify-between bg-[#061e15] border-r border-[#143e2f] p-4 flex-shrink-0">
          <div className="space-y-1 overflow-y-auto pr-1">
            <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-[#d4af37]">
              {isVendor ? 'Vendor Portal Modules' : `${getRoleDisplayName(currentUser.role)} Workspace`}
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition group cursor-pointer ${
                    isActive
                      ? 'bg-[#d4af37] text-[#051b14] shadow-md shadow-[#d4af37]/15'
                      : 'text-slate-300 hover:text-white hover:bg-[#0c2d20]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition ${
                        isActive ? 'text-[#051b14]' : 'text-slate-400 group-hover:text-[#d4af37]'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                        isActive ? 'bg-[#051b14] text-[#d4af37]' : 'bg-[#d4af37] text-[#051b14]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Sidebar Footer: Currency & Language Switcher */}
          <div className="pt-3 border-t border-[#143e2f] space-y-2">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <select
                value={orgConfig.currency}
                onChange={(e) => updateOrgConfig({ currency: e.target.value as CurrencyCode })}
                className="bg-[#051710] border border-[#143e2f] rounded-lg px-2 py-1 text-[11px] text-slate-300 focus:outline-none"
              >
                <option value="USD">$ USD</option>
                <option value="NGN">₦ NGN</option>
                <option value="EUR">€ EUR</option>
                <option value="GBP">£ GBP</option>
                <option value="KES">KSh KES</option>
                <option value="JPY">¥ JPY</option>
                <option value="AED">AED</option>
              </select>

              <select
                value={orgConfig.language}
                onChange={(e) => updateOrgConfig({ language: e.target.value as SupportedLanguage })}
                className="bg-[#051710] border border-[#143e2f] rounded-lg px-2 py-1 text-[11px] text-slate-300 focus:outline-none"
              >
                <option value="en">English</option>
                <option value="fr">Français</option>
                <option value="es">Español</option>
                <option value="ha">Hausa</option>
                <option value="sw">Kiswahili</option>
                <option value="ar">العربية</option>
              </select>
            </div>
            <div className="text-[10px] text-slate-500 text-center">
              Procura v2.0 • Dark Green & Gold
            </div>
          </div>
        </aside>

        {/* MOBILE DRAWER (HAMBURGER OPEN) */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative w-80 max-w-[85vw] bg-[#061e15] border-r border-[#143e2f] p-4 flex flex-col justify-between z-50 h-full overflow-y-auto">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-[#143e2f]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#092b1f] border border-[#d4af37]/50 flex items-center justify-center font-black text-[#d4af37] text-sm">
                      P
                    </div>
                    <div>
                      <span className="font-extrabold text-sm text-white block leading-none">Procura</span>
                      <span className="text-[9px] text-[#d4af37] font-semibold uppercase tracking-wider block mt-0.5">
                        {isVendor ? 'Supplier Portal' : 'Enterprise OS'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#0c2d20]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* User Profile Card */}
                <div className="p-3 rounded-xl bg-[#082117] border border-[#143e2f]">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#092b1f] border border-[#d4af37]/40 flex items-center justify-center text-sm font-black text-[#d4af37]">
                      {currentUser.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-white truncate">{currentUser.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{currentUser.email}</div>
                      <span className="inline-block mt-1 px-2 py-0.2 rounded-full bg-[#0d3b2b] text-[#d4af37] text-[9px] font-bold border border-[#d4af37]/30">
                        {getRoleDisplayName(currentUser.role)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Role Switcher in Mobile Drawer (For Fast Persona Testing) */}
                <div>
                  <div className="px-1 py-1 text-[10px] font-black uppercase tracking-wider text-[#d4af37]">
                    Switch Persona (RBAC Simulation)
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 mt-1">
                    {roles.map((r) => (
                      <button
                        key={r.role}
                        onClick={() => {
                          switchRole(r.role);
                          setMobileMenuOpen(false);
                        }}
                        className={`p-2 rounded-xl text-[11px] font-semibold text-left transition flex items-center gap-2 ${
                          currentUser.role === r.role
                            ? 'bg-[#d4af37] text-[#051b14] font-bold shadow'
                            : 'bg-[#051710] text-slate-300 hover:bg-[#0c2d20] border border-[#143e2f]'
                        }`}
                      >
                        <span>{r.icon}</span>
                        <span className="truncate">{r.title.split(' ')[0]}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Module Navigation List */}
                <div>
                  <div className="px-1 py-1 text-[10px] font-black uppercase tracking-wider text-[#d4af37]">
                    {getRoleDisplayName(currentUser.role)} Modules
                  </div>

                  <div className="space-y-1 mt-1">
                    {navItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeView === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleNavClick(item.id)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition ${
                            isActive
                              ? 'bg-[#d4af37] text-[#051b14] shadow'
                              : 'text-slate-300 hover:text-white hover:bg-[#0c2d20]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon className="w-4 h-4" />
                            <span>{item.label}</span>
                          </div>
                          {item.badge !== undefined && item.badge > 0 && (
                            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#d4af37] text-[#051b14]">
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="pt-4 border-t border-[#143e2f] space-y-2 mt-4">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <select
                    value={orgConfig.currency}
                    onChange={(e) => updateOrgConfig({ currency: e.target.value as CurrencyCode })}
                    className="bg-[#051710] border border-[#143e2f] rounded-lg px-2 py-1 text-[11px] text-slate-300 focus:outline-none"
                  >
                    <option value="USD">$ USD</option>
                    <option value="NGN">₦ NGN</option>
                    <option value="EUR">€ EUR</option>
                    <option value="GBP">£ GBP</option>
                    <option value="KES">KSh KES</option>
                    <option value="JPY">¥ JPY</option>
                  </select>

                  <select
                    value={orgConfig.language}
                    onChange={(e) => updateOrgConfig({ language: e.target.value as SupportedLanguage })}
                    className="bg-[#051710] border border-[#143e2f] rounded-lg px-2 py-1 text-[11px] text-slate-300 focus:outline-none"
                  >
                    <option value="en">English</option>
                    <option value="fr">Français</option>
                    <option value="es">Español</option>
                    <option value="ha">Hausa</option>
                  </select>
                </div>

                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-rose-950/40 text-rose-300 border border-rose-800/40 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer hover:bg-rose-950/60 transition"
                >
                  <LogOut className="w-4 h-4 text-rose-400" />
                  <span>Sign Out of Procura</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MAIN VIEW CONTAINER */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 bg-[#04140e] overflow-x-hidden">
          <div className="max-w-7xl mx-auto w-full">
            <InterAccountRelay />
            {children}
          </div>
        </main>
      </div>

      {/* MOBILE BOTTOM NAVIGATION BAR (Direct App Feel with Role Integration) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 h-16 bg-[#061e15]/98 border-t border-[#143e2f] backdrop-blur-lg px-2 flex items-center justify-around shadow-2xl">
        {isVendor ? (
          <>
            <button
              onClick={() => setActiveView('vendor_portal')}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-bold transition ${
                activeView === 'vendor_portal' ? 'text-[#d4af37]' : 'text-slate-400'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>Portal</span>
            </button>

            <button
              onClick={() => setActiveView('rfqs')}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-bold transition ${
                activeView === 'rfqs' ? 'text-[#d4af37]' : 'text-slate-400'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>RFQs</span>
            </button>

            <button
              onClick={() => setActiveView('orders')}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-bold transition ${
                activeView === 'orders' ? 'text-[#d4af37]' : 'text-slate-400'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Orders</span>
            </button>

            <button
              onClick={() => setActiveView('finance')}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-bold transition ${
                activeView === 'finance' ? 'text-[#d4af37]' : 'text-slate-400'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Invoices</span>
            </button>
          </>
        ) : isRequester ? (
          <>
            <button
              onClick={() => setActiveView('dashboard')}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-bold transition ${
                activeView === 'dashboard' ? 'text-[#d4af37]' : 'text-slate-400'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>My Desk</span>
            </button>

            <button
              onClick={() => setActiveView('requests')}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-bold transition ${
                activeView === 'requests' ? 'text-[#d4af37]' : 'text-slate-400'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Requests</span>
            </button>

            <button
              onClick={() => setActiveView('deliveries')}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-bold transition ${
                activeView === 'deliveries' ? 'text-[#d4af37]' : 'text-slate-400'
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>Deliveries</span>
            </button>

            <button
              onClick={() => setActiveView('inventory')}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-bold transition ${
                activeView === 'inventory' ? 'text-[#d4af37]' : 'text-slate-400'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Catalog</span>
            </button>
          </>
        ) : isApprover ? (
          <>
            <button
              onClick={() => setActiveView('dashboard')}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-bold transition ${
                activeView === 'dashboard' ? 'text-[#d4af37]' : 'text-slate-400'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Home</span>
            </button>

            <button
              onClick={() => setActiveView('approvals')}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-bold transition relative ${
                activeView === 'approvals' ? 'text-[#d4af37]' : 'text-slate-400'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              <span>Approvals</span>
              {pendingApprovalsCount > 0 && (
                <span className="absolute top-0 right-2 w-2 h-2 rounded-full bg-[#d4af37]" />
              )}
            </button>

            <button
              onClick={() => setActiveView('budgets')}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-bold transition ${
                activeView === 'budgets' ? 'text-[#d4af37]' : 'text-slate-400'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              <span>Budgets</span>
            </button>

            <button
              onClick={() => setActiveView('requests')}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-bold transition ${
                activeView === 'requests' ? 'text-[#d4af37]' : 'text-slate-400'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Requests</span>
            </button>
          </>
        ) : isProcurement ? (
          <>
            <button
              onClick={() => setActiveView('dashboard')}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-bold transition ${
                activeView === 'dashboard' ? 'text-[#d4af37]' : 'text-slate-400'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Home</span>
            </button>

            <button
              onClick={() => setActiveView('rfqs')}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-bold transition ${
                activeView === 'rfqs' ? 'text-[#d4af37]' : 'text-slate-400'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>RFQs</span>
            </button>

            <button
              onClick={() => setActiveView('orders')}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-bold transition ${
                activeView === 'orders' ? 'text-[#d4af37]' : 'text-slate-400'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Orders</span>
            </button>

            <button
              onClick={() => setActiveView('vendors')}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-bold transition ${
                activeView === 'vendors' ? 'text-[#d4af37]' : 'text-slate-400'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Suppliers</span>
            </button>
          </>
        ) : isFinance ? (
          <>
            <button
              onClick={() => setActiveView('dashboard')}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-bold transition ${
                activeView === 'dashboard' ? 'text-[#d4af37]' : 'text-slate-400'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Finance</span>
            </button>

            <button
              onClick={() => setActiveView('finance')}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-bold transition ${
                activeView === 'finance' ? 'text-[#d4af37]' : 'text-slate-400'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Invoices</span>
            </button>

            <button
              onClick={() => setActiveView('budgets')}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-bold transition ${
                activeView === 'budgets' ? 'text-[#d4af37]' : 'text-slate-400'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              <span>Budgets</span>
            </button>

            <button
              onClick={() => setActiveView('audit')}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-bold transition ${
                activeView === 'audit' ? 'text-[#d4af37]' : 'text-slate-400'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Audit</span>
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setActiveView('dashboard')}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-bold transition ${
                activeView === 'dashboard' ? 'text-[#d4af37]' : 'text-slate-400'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveView('requests')}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-bold transition ${
                activeView === 'requests' ? 'text-[#d4af37]' : 'text-slate-400'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Requests</span>
            </button>

            <button
              onClick={() => setActiveView('approvals')}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-bold transition relative ${
                activeView === 'approvals' ? 'text-[#d4af37]' : 'text-slate-400'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              <span>Approvals</span>
              {pendingApprovalsCount > 0 && (
                <span className="absolute top-0 right-2 w-2 h-2 rounded-full bg-[#d4af37]" />
              )}
            </button>

            <button
              onClick={() => setActiveView('orders')}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-bold transition ${
                activeView === 'orders' ? 'text-[#d4af37]' : 'text-slate-400'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Orders</span>
            </button>
          </>
        )}
      </nav>
    </div>
  );
};
