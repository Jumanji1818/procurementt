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
  Sliders,
  Globe2,
  Download,
  Github,
} from 'lucide-react';
import { PWAInstallButton } from '../common/PWAInstallButton';
import { UserRole, CurrencyCode, SupportedLanguage } from '../../types';

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
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setIsSearchOpen,
    setIsAiModalOpen,
    setIsAPKModalOpen,
    t,
    requests,
    invoices,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [quickCreateOpen, setQuickCreateOpen] = useState(false);
  const [currencyLangOpen, setCurrencyLangOpen] = useState(false);

  const pendingApprovalsCount = requests.filter((r) => r.status === 'pending_approval').length;
  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  interface NavItem {
    id: ActiveView;
    label: string;
    icon: React.ElementType;
    badge?: number;
    visible: boolean;
  }

  // Build navigation items based on orgConfig and user permissions
  const navItems: NavItem[] = ([
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
    {
      id: 'deliveries' as ActiveView,
      label: t('navDeliveries'),
      icon: Truck,
      visible: orgConfig.hasPhysicalGoods,
    },
    {
      id: 'inventory' as ActiveView,
      label: t('navInventory'),
      icon: Package,
      visible: orgConfig.hasPhysicalGoods,
    },
    {
      id: 'finance' as ActiveView,
      label: t('navFinance'),
      icon: CreditCard,
      visible: orgConfig.hasInvoicesPayments,
    },
    { id: 'budgets' as ActiveView, label: t('navBudgets'), icon: DollarSign, visible: orgConfig.hasBudgets },
    { id: 'exceptions' as ActiveView, label: t('navExceptions'), icon: AlertTriangle, visible: true },
    { id: 'calendar' as ActiveView, label: t('navCalendar'), icon: Calendar, visible: true },
    { id: 'contracts' as ActiveView, label: t('navContracts'), icon: FileCheck, visible: true },
    { id: 'analytics' as ActiveView, label: t('navAnalytics'), icon: TrendingUp, visible: true },
    { id: 'audit' as ActiveView, label: t('navAudit'), icon: ShieldCheck, visible: true },
    { id: 'settings' as ActiveView, label: t('navSettings'), icon: Settings, visible: true },
  ] as NavItem[]).filter((item) => item.visible);

  const roles: { role: UserRole; title: string }[] = [
    { role: 'owner', title: 'Business Owner' },
    { role: 'requester', title: 'Requester / Employee' },
    { role: 'approver', title: 'Department Approver' },
    { role: 'procurement_officer', title: 'Procurement Officer' },
    { role: 'finance', title: 'Finance Comptroller' },
    { role: 'vendor', title: 'External Supplier' },
    { role: 'admin', title: 'System Administrator' },
  ];

  const handleNavClick = (viewId: ActiveView) => {
    setActiveView(viewId);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased">
      {/* TOP BAR */}
      <header className="sticky top-0 z-30 h-16 bg-slate-950/90 border-b border-slate-800/80 backdrop-blur-md px-3 sm:px-6 flex items-center justify-between">
        {/* Left: Brand + Hamburger */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div
            onClick={() => setActiveView('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-400 flex items-center justify-center font-bold text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition">
              P
            </div>
            <div className="hidden sm:block">
              <span className="font-extrabold text-white text-base tracking-tight block leading-none">
                Procura
              </span>
              <span className="text-[10px] text-indigo-400 font-semibold uppercase tracking-wider block mt-0.5">
                {orgConfig.name.length > 20 ? `${orgConfig.name.substring(0, 18)}...` : orgConfig.name}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Search Bar Trigger (Ctrl+K) */}
        <div className="flex-1 max-w-md mx-4 hidden md:block">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-900 border border-slate-800 text-xs text-slate-400 transition text-left"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>{t('search')}</span>
            </div>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-400">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Mobile Search Button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* AI Advisor Button */}
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600/30 to-sky-500/30 border border-indigo-500/40 text-indigo-200 hover:text-white text-xs font-semibold shadow-sm transition active:scale-95"
            title="AI Procurement Intelligence"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">AI Advisor</span>
          </button>

          {/* Download & APK / Mobile & GitHub Guide */}
          <button
            onClick={() => setIsAPKModalOpen(true)}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-emerald-400 hover:text-emerald-300 text-xs font-semibold transition flex items-center gap-1.5 shadow-sm"
            title="Download Source Code (.ZIP), Push to GitHub, or Get Mobile APK"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Download & APK</span>
          </button>

          {/* PWA Install Button */}
          <PWAInstallButton compact />

          {/* Quick Create (+) Dropdown */}
          <div className="relative">
            <button
              onClick={() => setQuickCreateOpen(!quickCreateOpen)}
              className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-500/20 transition active:scale-95 flex items-center justify-center"
              title="Quick Create"
            >
              <Plus className="w-4 h-4" />
            </button>

            {quickCreateOpen && (
              <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
                <button
                  onClick={() => {
                    onOpenNewRequest();
                    setQuickCreateOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 text-xs font-semibold text-slate-200 flex items-center gap-2"
                >
                  <FileText className="w-4 h-4 text-indigo-400" />
                  <span>{t('newRequest')}</span>
                </button>
                <button
                  onClick={() => {
                    onOpenNewPO();
                    setQuickCreateOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 text-xs font-semibold text-slate-200 flex items-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4 text-emerald-400" />
                  <span>{t('createPO')}</span>
                </button>
                {orgConfig.hasPhysicalGoods && (
                  <button
                    onClick={() => {
                      onOpenNewGRN();
                      setQuickCreateOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 text-xs font-semibold text-slate-200 flex items-center gap-2"
                  >
                    <Truck className="w-4 h-4 text-amber-400" />
                    <span>{t('recordReceipt')}</span>
                  </button>
                )}
                {orgConfig.hasInvoicesPayments && (
                  <button
                    onClick={() => {
                      onOpenNewInvoice();
                      setQuickCreateOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 text-xs font-semibold text-slate-200 flex items-center gap-2"
                  >
                    <CreditCard className="w-4 h-4 text-purple-400" />
                    <span>{t('uploadInvoice')}</span>
                  </button>
                )}
                {orgConfig.hasSuppliers && (
                  <button
                    onClick={() => {
                      onOpenNewVendor();
                      setQuickCreateOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 text-xs font-semibold text-slate-200 flex items-center gap-2"
                  >
                    <Users className="w-4 h-4 text-teal-400" />
                    <span>{t('addVendor')}</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 relative transition"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              )}
            </button>

            {notifDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
                  <span className="font-bold text-white">Notifications ({unreadNotifsCount})</span>
                  <button
                    onClick={markAllNotificationsAsRead}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300"
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
                        n.read ? 'bg-slate-950/50 text-slate-400' : 'bg-slate-800 text-slate-200 font-medium'
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

          {/* Role Switcher Pill (Critical for demonstration of all 7 roles!) */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition"
            >
              <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-[11px] font-bold text-white">
                {currentUser.name.charAt(0)}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-bold text-white leading-tight">
                  {currentUser.role.replace('_', ' ')}
                </div>
                <div className="text-[10px] text-slate-400 leading-none">Switch Role</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-2 border-b border-slate-800 mb-1">
                  <div className="text-xs font-bold text-white">{currentUser.name}</div>
                  <div className="text-[11px] text-slate-400">{currentUser.email}</div>
                </div>

                <div className="text-[10px] uppercase font-bold text-slate-500 px-3 py-1">
                  Simulate Role-Based Access (RBAC)
                </div>

                <div className="space-y-1">
                  {roles.map((r) => (
                    <button
                      key={r.role}
                      onClick={() => {
                        switchRole(r.role);
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition ${
                        currentUser.role === r.role
                          ? 'bg-indigo-600 text-white'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span>{r.title}</span>
                      {currentUser.role === r.role && <CheckCircle className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>

                <div className="pt-2 mt-2 border-t border-slate-800">
                  <button
                    onClick={() => {
                      setActiveView('landing');
                      setRoleDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/30 flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Return to Landing Page</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* BODY LAYOUT: DESKTOP SIDEBAR + MAIN CONTENT AREA */}
      <div className="flex-1 flex overflow-hidden">
        {/* DESKTOP SIDEBAR (Adaptive based on enabled modules) */}
        <aside className="hidden lg:flex w-64 flex-col bg-slate-950 border-r border-slate-800/80 p-3 justify-between overflow-y-auto">
          <div className="space-y-1">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-3 py-2">
              Navigation
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition group ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/90'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                        isActive ? 'bg-white text-indigo-600' : 'bg-rose-500 text-white'
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
          <div className="pt-3 border-t border-slate-800/80 space-y-2">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <select
                value={orgConfig.currency}
                onChange={(e) => updateOrgConfig({ currency: e.target.value as CurrencyCode })}
                className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-[11px] text-slate-300 focus:outline-none"
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
                className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-[11px] text-slate-300 focus:outline-none"
              >
                <option value="en">English</option>
                <option value="fr">Français</option>
                <option value="es">Español</option>
                <option value="ha">Hausa</option>
                <option value="sw">Kiswahili</option>
                <option value="ar">العربية</option>
              </select>
            </div>
            <div className="text-[10px] text-slate-400 text-center">
              Procura v1.0.0 • Final Year Capstone
            </div>
          </div>
        </aside>

        {/* MOBILE DRAWER (HAMBURGER OPEN) */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 lg:hidden flex">
            <div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative w-72 max-w-[80vw] bg-slate-950 border-r border-slate-800 p-4 flex flex-col justify-between z-50 h-full overflow-y-auto">
              <div className="space-y-1">
                <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-xs">
                      P
                    </div>
                    <span className="font-bold text-sm text-white">Procura Navigation</span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                        isActive
                          ? 'bg-indigo-600 text-white'
                          : 'text-slate-400 hover:text-white hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-slate-800 space-y-2">
                <button
                  onClick={() => {
                    setIsAPKModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-indigo-900/60 to-emerald-900/60 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center justify-center gap-2 shadow-sm"
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>Download Code (.ZIP) & APK</span>
                </button>
                <div className="text-[10px] text-slate-400 text-center">
                  Signed in as {currentUser.name}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MAIN VIEW CONTAINER */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>

      {/* MOBILE BOTTOM NAVIGATION BAR (Mandatory per specification) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 h-16 bg-slate-950/95 border-t border-slate-800/90 backdrop-blur-lg px-2 flex items-center justify-around">
        <button
          onClick={() => setActiveView('dashboard')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-semibold transition ${
            activeView === 'dashboard' ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Home</span>
        </button>

        <button
          onClick={() => setActiveView('requests')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-semibold transition ${
            activeView === 'requests' ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Requests</span>
        </button>

        {orgConfig.approvalWorkflow !== 'none' && (
          <button
            onClick={() => setActiveView('approvals')}
            className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-semibold transition relative ${
              activeView === 'approvals' ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            <span>Approvals</span>
            {pendingApprovalsCount > 0 && (
              <span className="absolute top-0 right-2 w-2 h-2 rounded-full bg-rose-500" />
            )}
          </button>
        )}

        <button
          onClick={() => setActiveView(orgConfig.hasPhysicalGoods ? 'inventory' : 'orders')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-semibold transition ${
            activeView === 'inventory' || activeView === 'orders'
              ? 'text-indigo-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>{orgConfig.hasPhysicalGoods ? 'Inventory' : 'Orders'}</span>
        </button>

        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-[10px] font-semibold text-slate-400 hover:text-slate-200 transition"
        >
          <Menu className="w-4 h-4" />
          <span>Menu</span>
        </button>
      </nav>
    </div>
  );
};
