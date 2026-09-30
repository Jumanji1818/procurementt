import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LandingPage } from './components/landing/LandingPage';
import { OnboardingWizard } from './components/onboarding/OnboardingWizard';
import { AuthView } from './components/auth/AuthView';
import { VendorPortalView } from './components/vendor/VendorPortalView';
import { AppShell } from './components/layout/AppShell';
import { UniversalDashboard } from './components/dashboard/UniversalDashboard';
import { ProcurementRequestsView } from './components/requests/ProcurementRequestsView';
import { ApprovalInboxView } from './components/approvals/ApprovalInboxView';
import { RFQWorkspaceView } from './components/rfq/RFQWorkspaceView';
import { PurchaseOrdersView } from './components/orders/PurchaseOrdersView';
import { DeliveriesAndInventoryView } from './components/deliveries/DeliveriesAndInventoryView';
import { FinanceAndThreeWayMatchView } from './components/finance/FinanceAndThreeWayMatchView';
import { SupplierManagementView } from './components/suppliers/SupplierManagementView';
import { ExceptionCenterView } from './components/exceptions/ExceptionCenterView';
import { ProcurementCalendarView } from './components/calendar/ProcurementCalendarView';
import { ContractManagementView } from './components/contracts/ContractManagementView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { AuditLogView } from './components/audit/AuditLogView';
import { SettingsView } from './components/settings/SettingsView';
import { GlobalSearchModal } from './components/search/GlobalSearchModal';
import { AIAssistantModal } from './components/ai/AIAssistantModal';
import { OfflineIndicator } from './components/common/OfflineIndicator';
import { LoadingSplash } from './components/common/LoadingSplash';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

const RoleAccessNotice: React.FC<{ requiredRole: string }> = ({ requiredRole }) => {
  const { setActiveView, currentUser } = useApp();
  return (
    <div className="p-8 max-w-lg mx-auto text-center rounded-2xl bg-[#082117] border border-[#143e2f] shadow-2xl my-12 space-y-4">
      <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] mx-auto">
        <ShieldAlert className="w-7 h-7" />
      </div>
      <div>
        <h2 className="text-lg font-bold text-white">Access Restricted by RBAC Policy</h2>
        <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
          Your current active role (<strong className="text-[#d4af37]">{currentUser.role.replace('_', ' ')}</strong>) does not have authorization for this module. This boundary enforces corporate Segregation of Duties (SoD).
        </p>
        <div className="inline-block mt-3 px-3 py-1 rounded-full bg-[#051710] border border-[#143e2f] text-[11px] text-slate-400">
          Required Clearance: <strong className="text-white">{requiredRole}</strong>
        </div>
      </div>
      <button
        onClick={() => setActiveView('dashboard')}
        className="px-5 py-2.5 rounded-xl bg-[#d4af37] hover:bg-[#c49f2b] text-[#051b14] font-bold text-xs transition inline-flex items-center gap-2 cursor-pointer shadow"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Workspace</span>
      </button>
    </div>
  );
};

const MainAppContent: React.FC = () => {
  const { activeView, isAuthenticated, currentUser } = useApp();
  const [initialLoading, setInitialLoading] = useState(true);

  // Global modals triggered from topbar quick-create
  const [isOpenNewRequest, setIsOpenNewRequest] = useState(false);
  const [isOpenNewPO, setIsOpenNewPO] = useState(false);
  const [isOpenNewGRN, setIsOpenNewGRN] = useState(false);
  const [isOpenNewInvoice, setIsOpenNewInvoice] = useState(false);
  const [isOpenNewVendor, setIsOpenNewVendor] = useState(false);

  if (initialLoading) {
    return <LoadingSplash onFinish={() => setInitialLoading(false)} />;
  }

  if (!isAuthenticated || activeView === 'auth') {
    return (
      <>
        <AuthView />
        <OfflineIndicator />
      </>
    );
  }

  if (activeView === 'landing') {
    return (
      <>
        <LandingPage />
        <OfflineIndicator />
      </>
    );
  }

  if (activeView === 'onboarding') {
    return (
      <>
        <OnboardingWizard />
        <OfflineIndicator />
      </>
    );
  }

  const isOwnerOrAdmin = currentUser.role === 'owner' || currentUser.role === 'admin';
  const isApprover = currentUser.role === 'approver';
  const isProcurement = currentUser.role === 'procurement_officer';
  const isFinance = currentUser.role === 'finance';

  return (
    <AppShell
      onOpenNewRequest={() => setIsOpenNewRequest(true)}
      onOpenNewPO={() => setIsOpenNewPO(true)}
      onOpenNewGRN={() => setIsOpenNewGRN(true)}
      onOpenNewInvoice={() => setIsOpenNewInvoice(true)}
      onOpenNewVendor={() => setIsOpenNewVendor(true)}
    >
      {/* VENDOR EXPERIENCE (Strict Segregation: All views mapped internally) */}
      {currentUser.role === 'vendor' ? (
        <VendorPortalView />
      ) : (
        <>
          {activeView === 'dashboard' && (
            <UniversalDashboard
              onOpenNewRequest={() => setIsOpenNewRequest(true)}
              onOpenNewPO={() => setIsOpenNewPO(true)}
              onOpenNewGRN={() => setIsOpenNewGRN(true)}
              onOpenNewInvoice={() => setIsOpenNewInvoice(true)}
              onOpenNewVendor={() => setIsOpenNewVendor(true)}
            />
          )}

          {activeView === 'requests' && (
            <ProcurementRequestsView
              isOpenCreateModal={isOpenNewRequest}
              setIsOpenCreateModal={setIsOpenNewRequest}
            />
          )}

          {activeView === 'approvals' && (
            (isApprover || isOwnerOrAdmin) ? (
              <ApprovalInboxView />
            ) : (
              <RoleAccessNotice requiredRole="Department Approver or Executive" />
            )
          )}

          {activeView === 'rfqs' && (
            (isProcurement || isOwnerOrAdmin) ? (
              <RFQWorkspaceView />
            ) : (
              <RoleAccessNotice requiredRole="Procurement Officer or Executive" />
            )
          )}

          {activeView === 'orders' && (
            <PurchaseOrdersView
              isOpenCreateModal={isOpenNewPO}
              setIsOpenCreateModal={setIsOpenNewPO}
            />
          )}

          {(activeView === 'deliveries' || activeView === 'inventory') && (
            <DeliveriesAndInventoryView
              isOpenNewGRN={isOpenNewGRN}
              setIsOpenNewGRN={setIsOpenNewGRN}
            />
          )}

          {(activeView === 'finance' || activeView === 'budgets') && (
            (isFinance || isOwnerOrAdmin || (isApprover && activeView === 'budgets')) ? (
              <FinanceAndThreeWayMatchView
                isOpenNewInvoice={isOpenNewInvoice}
                setIsOpenNewInvoice={setIsOpenNewInvoice}
              />
            ) : (
              <RoleAccessNotice requiredRole="Finance Comptroller or Executive" />
            )
          )}

          {activeView === 'vendors' && (
            (isProcurement || isOwnerOrAdmin) ? (
              <SupplierManagementView
                isOpenAddVendor={isOpenNewVendor}
                setIsOpenAddVendor={setIsOpenNewVendor}
              />
            ) : (
              <RoleAccessNotice requiredRole="Procurement Officer or Executive" />
            )
          )}

          {activeView === 'exceptions' && <ExceptionCenterView />}
          {activeView === 'calendar' && <ProcurementCalendarView />}
          {activeView === 'contracts' && <ContractManagementView />}
          {activeView === 'analytics' && <AnalyticsView />}
          {activeView === 'audit' && (
            (isFinance || isOwnerOrAdmin) ? (
              <AuditLogView />
            ) : (
              <RoleAccessNotice requiredRole="Finance Comptroller or Administrator" />
            )
          )}
          {activeView === 'settings' && <SettingsView />}
        </>
      )}

      {/* Global Overlays */}
      <GlobalSearchModal />
      <AIAssistantModal />
      <OfflineIndicator />
    </AppShell>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
