import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LandingPage } from './components/landing/LandingPage';
import { OnboardingWizard } from './components/onboarding/OnboardingWizard';
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
import { APKGuideModal } from './components/common/APKGuideModal';
import { OfflineIndicator } from './components/common/OfflineIndicator';
import { LoadingSplash } from './components/common/LoadingSplash';

const MainAppContent: React.FC = () => {
  const { activeView, setActiveView } = useApp();
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

  if (activeView === 'landing') {
    return (
      <>
        <LandingPage />
        <APKGuideModal />
        <OfflineIndicator />
      </>
    );
  }

  if (activeView === 'onboarding') {
    return (
      <>
        <OnboardingWizard />
        <APKGuideModal />
        <OfflineIndicator />
      </>
    );
  }

  return (
    <AppShell
      onOpenNewRequest={() => setIsOpenNewRequest(true)}
      onOpenNewPO={() => setIsOpenNewPO(true)}
      onOpenNewGRN={() => setIsOpenNewGRN(true)}
      onOpenNewInvoice={() => setIsOpenNewInvoice(true)}
      onOpenNewVendor={() => setIsOpenNewVendor(true)}
    >
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

      {activeView === 'approvals' && <ApprovalInboxView />}

      {activeView === 'rfqs' && <RFQWorkspaceView />}

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
        <FinanceAndThreeWayMatchView
          isOpenNewInvoice={isOpenNewInvoice}
          setIsOpenNewInvoice={setIsOpenNewInvoice}
        />
      )}

      {activeView === 'vendors' && (
        <SupplierManagementView
          isOpenAddVendor={isOpenNewVendor}
          setIsOpenAddVendor={setIsOpenNewVendor}
        />
      )}

      {activeView === 'exceptions' && <ExceptionCenterView />}

      {activeView === 'calendar' && <ProcurementCalendarView />}

      {activeView === 'contracts' && <ContractManagementView />}

      {activeView === 'analytics' && <AnalyticsView />}

      {activeView === 'audit' && <AuditLogView />}

      {activeView === 'settings' && <SettingsView />}

      {/* Global Overlays */}
      <GlobalSearchModal />
      <AIAssistantModal />
      <APKGuideModal />
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
