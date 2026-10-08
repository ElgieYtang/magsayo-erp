import { jsx, jsxs } from "react/jsx-runtime";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AppLayout } from "@/components/layout/AppLayout";
import { ErpProvider } from "@/data/erpStore";
import { AccomplishmentReportsPage } from "@/pages/AccomplishmentReports";
import { BillingPage } from "@/pages/Billing";
import { DashboardPage } from "@/pages/Dashboard";
import { DeliveryReceiptsPage } from "@/pages/DeliveryReceipts";
import { DeliveryReceiptDetailPage } from "@/pages/details/DeliveryReceiptDetailPage";
import { OutslipDetailPage } from "@/pages/details/OutslipDetailPage";
import { PurchaseOrderDetailPage } from "@/pages/details/PurchaseOrderDetailPage";
import { QuotationDetailPage } from "@/pages/details/QuotationDetailPage";
import { DocumentPreviewPage } from "@/pages/DocumentPreview";
import { InventoryOverviewPage } from "@/pages/InventoryOverview";
import { InventoryReportsPage } from "@/pages/InventoryReports";
import { LoginPage } from "@/pages/Login";
import { OutslipsPage } from "@/pages/Outslips";
import { PurchaseOrdersPage } from "@/pages/PurchaseOrders";
import { QuotationsPage } from "@/pages/Quotations";
import { ReceivingPage } from "@/pages/Receiving";
import { ReportsPage } from "@/pages/Reports";
import { SettingsPage } from "@/pages/Settings";
import { ProfilePage } from "@/pages/Profile";
import { SOAPage } from "@/pages/SOA";
import { CustomerLedgerPage } from "@/pages/reports/CustomerLedgerPage";
import { SupplierLedgerPage } from "@/pages/reports/SupplierLedgerPage";
import { AccomplishmentPreviewPage } from "@/pages/previews/AccomplishmentPreview";
import { DeliveryReceiptPreviewPage } from "@/pages/previews/DeliveryReceiptPreview";
import { GatePassPreviewPage } from "@/pages/previews/GatePassPreview";
import { PurchaseOrderPreviewPage } from "@/pages/previews/PurchaseOrderPreview";
import { QuotationPreviewPage } from "@/pages/previews/QuotationPreview";
import { SOAPreviewPage } from "@/pages/previews/SOAPreview";
import {
  BranchSetupPage,
  BrandSetupPage,
  CategorySetupPage,
  CompanySetupPage,
  CustomerSetupPage,
  ItemSetupPage,
  ModelSetupPage,
  PositionSetupPage,
  ProjectSetupPage,
  SupplierSetupPage,
  UnitMeasureSetupPage,
  UserSetupPage
} from "@/pages/setup/SetupPages";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
function App() {
  return /* @__PURE__ */ jsx(ErpProvider, { children: /* @__PURE__ */ jsx(BrowserRouter, { children: /* @__PURE__ */ jsxs(Routes, { children: [
    /* @__PURE__ */ jsx(Route, { path: "/login", element: /* @__PURE__ */ jsx(LoginPage, {}) }),
    /* @__PURE__ */ jsx(Route, { element: /* @__PURE__ */ jsx(ProtectedRoute, {}), children: /* @__PURE__ */ jsxs(Route, { element: /* @__PURE__ */ jsx(AppLayout, {}), children: [
      /* @__PURE__ */ jsx(Route, { index: true, element: /* @__PURE__ */ jsx(DashboardPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "quotations", element: /* @__PURE__ */ jsx(QuotationsPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "quotations/:id", element: /* @__PURE__ */ jsx(QuotationDetailPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "quotations/:id/preview", element: /* @__PURE__ */ jsx(QuotationPreviewPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "purchase-order", element: /* @__PURE__ */ jsx(PurchaseOrdersPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "purchase-order/:id", element: /* @__PURE__ */ jsx(PurchaseOrderDetailPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "purchase-order/:id/preview", element: /* @__PURE__ */ jsx(PurchaseOrderPreviewPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "outslip", element: /* @__PURE__ */ jsx(OutslipsPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "outslip/:id", element: /* @__PURE__ */ jsx(OutslipDetailPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "outslip/:id/gate-pass/preview", element: /* @__PURE__ */ jsx(GatePassPreviewPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "delivery-receipt", element: /* @__PURE__ */ jsx(DeliveryReceiptsPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "delivery-receipt/:id", element: /* @__PURE__ */ jsx(DeliveryReceiptDetailPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "delivery-receipt/:id/preview", element: /* @__PURE__ */ jsx(DeliveryReceiptPreviewPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "setup/user-type", element: /* @__PURE__ */ jsx(Navigate, { to: "/setup/user-setup", replace: true }) }),
      /* @__PURE__ */ jsx(Route, { path: "setup/user-setup", element: /* @__PURE__ */ jsx(UserSetupPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "setup/company-setup", element: /* @__PURE__ */ jsx(CompanySetupPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "setup/branch-setup", element: /* @__PURE__ */ jsx(BranchSetupPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "setup/project-setup", element: /* @__PURE__ */ jsx(ProjectSetupPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "setup/position-setup", element: /* @__PURE__ */ jsx(PositionSetupPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "setup/category", element: /* @__PURE__ */ jsx(CategorySetupPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "setup/brand", element: /* @__PURE__ */ jsx(BrandSetupPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "setup/model", element: /* @__PURE__ */ jsx(ModelSetupPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "setup/unit-measure", element: /* @__PURE__ */ jsx(UnitMeasureSetupPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "setup/item", element: /* @__PURE__ */ jsx(ItemSetupPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "setup/supplier", element: /* @__PURE__ */ jsx(SupplierSetupPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "setup/customer", element: /* @__PURE__ */ jsx(CustomerSetupPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "profile", element: /* @__PURE__ */ jsx(ProfilePage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "settings", element: /* @__PURE__ */ jsx(SettingsPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "document-preview", element: /* @__PURE__ */ jsx(DocumentPreviewPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "reports/accomplishment", element: /* @__PURE__ */ jsx(AccomplishmentReportsPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "reports/accomplishment/:id/preview", element: /* @__PURE__ */ jsx(AccomplishmentPreviewPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "reports/accomplishment/preview", element: /* @__PURE__ */ jsx(Navigate, { to: "/reports/accomplishment", replace: true }) }),
      /* @__PURE__ */ jsx(Route, { path: "reports/inventory", element: /* @__PURE__ */ jsx(InventoryReportsPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "reports/customer-ledger", element: /* @__PURE__ */ jsx(CustomerLedgerPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "reports/customer-ledger/soa/preview", element: /* @__PURE__ */ jsx(Navigate, { to: "/soa/preview", replace: true }) }),
      /* @__PURE__ */ jsx(Route, { path: "reports/supplier-ledger", element: /* @__PURE__ */ jsx(SupplierLedgerPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "inventory/reports", element: /* @__PURE__ */ jsx(ReportsPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "purchase-orders", element: /* @__PURE__ */ jsx(Navigate, { to: "/purchase-order", replace: true }) }),
      /* @__PURE__ */ jsx(Route, { path: "purchase-orders/:id/preview", element: /* @__PURE__ */ jsx(Navigate, { to: "/purchase-order", replace: true }) }),
      /* @__PURE__ */ jsx(Route, { path: "outslips", element: /* @__PURE__ */ jsx(Navigate, { to: "/outslip", replace: true }) }),
      /* @__PURE__ */ jsx(Route, { path: "delivery-receipts", element: /* @__PURE__ */ jsx(Navigate, { to: "/delivery-receipt", replace: true }) }),
      /* @__PURE__ */ jsx(Route, { path: "delivery-receipts/:id/preview", element: /* @__PURE__ */ jsx(Navigate, { to: "/delivery-receipt", replace: true }) }),
      /* @__PURE__ */ jsx(Route, { path: "accomplishments", element: /* @__PURE__ */ jsx(Navigate, { to: "/reports/accomplishment", replace: true }) }),
      /* @__PURE__ */ jsx(Route, { path: "inventory/outslips", element: /* @__PURE__ */ jsx(Navigate, { to: "/outslip", replace: true }) }),
      /* @__PURE__ */ jsx(Route, { path: "inventory", element: /* @__PURE__ */ jsx(InventoryOverviewPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "receiving", element: /* @__PURE__ */ jsx(Navigate, { to: "/inventory/receiving", replace: true }) }),
      /* @__PURE__ */ jsx(Route, { path: "inventory/receiving", element: /* @__PURE__ */ jsx(ReceivingPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "billing", element: /* @__PURE__ */ jsx(BillingPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "soa", element: /* @__PURE__ */ jsx(SOAPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "soa/preview", element: /* @__PURE__ */ jsx(SOAPreviewPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "customers", element: /* @__PURE__ */ jsx(Navigate, { to: "/setup/customer", replace: true }) }),
      /* @__PURE__ */ jsx(Route, { path: "suppliers", element: /* @__PURE__ */ jsx(Navigate, { to: "/setup/supplier", replace: true }) }),
      /* @__PURE__ */ jsx(Route, { path: "products", element: /* @__PURE__ */ jsx(Navigate, { to: "/setup/item", replace: true }) }),
      /* @__PURE__ */ jsx(Route, { path: "setup/users", element: /* @__PURE__ */ jsx(Navigate, { to: "/setup/user-setup", replace: true }) }),
      /* @__PURE__ */ jsx(Route, { path: "setup/user-types", element: /* @__PURE__ */ jsx(Navigate, { to: "/setup/user-setup", replace: true }) }),
      /* @__PURE__ */ jsx(Route, { path: "setup/company", element: /* @__PURE__ */ jsx(Navigate, { to: "/setup/company-setup", replace: true }) }),
      /* @__PURE__ */ jsx(Route, { path: "setup/branch", element: /* @__PURE__ */ jsx(Navigate, { to: "/setup/branch-setup", replace: true }) }),
      /* @__PURE__ */ jsx(Route, { path: "setup/project", element: /* @__PURE__ */ jsx(Navigate, { to: "/setup/project-setup", replace: true }) }),
      /* @__PURE__ */ jsx(Route, { path: "setup/position", element: /* @__PURE__ */ jsx(Navigate, { to: "/setup/position-setup", replace: true }) }),
      /* @__PURE__ */ jsx(Route, { path: "setup/uom", element: /* @__PURE__ */ jsx(Navigate, { to: "/setup/unit-measure", replace: true }) }),
      /* @__PURE__ */ jsx(Route, { path: "setup/items", element: /* @__PURE__ */ jsx(Navigate, { to: "/setup/item", replace: true }) }),
      /* @__PURE__ */ jsx(Route, { path: "setup/suppliers", element: /* @__PURE__ */ jsx(Navigate, { to: "/setup/supplier", replace: true }) }),
      /* @__PURE__ */ jsx(Route, { path: "setup/customers", element: /* @__PURE__ */ jsx(Navigate, { to: "/setup/customer", replace: true }) })
    ] }) })
  ] }) }) });
}
export {
  App as default
};
