import { jsx, jsxs } from "react/jsx-runtime";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { useDemo } from "@/context/DemoContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
function AccomplishmentPage() {
  const { state, showToast } = useDemo();
  const navigate = useNavigate();
  const [viewOpen, setViewOpen] = useState(false);
  const report = state.accomplishmentReports[0];
  if (!report) return null;
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx(
      PageHeader,
      {
        title: "Accomplishment Reports",
        description: "View workflow accomplishment and completion reports.",
        action: /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx(Button, { onClick: () => showToast("success", "Report saved successfully."), children: "Save" }),
          /* @__PURE__ */ jsx(Button, { variant: "secondary", onClick: () => navigate("/reports/accomplishment/preview"), children: "Preview" }),
          /* @__PURE__ */ jsx(Button, { variant: "secondary", onClick: () => {
            navigate("/reports/accomplishment/preview");
            setTimeout(() => window.print(), 300);
          }, children: "Print" })
        ] })
      }
    ),
    /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "pt-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "font-semibold text-text-primary", children: report.id }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-text-secondary", children: [
          "Reporting Period: ",
          report.periodStart,
          " \u2013 ",
          report.periodEnd
        ] })
      ] }),
      /* @__PURE__ */ jsx(Button, { variant: "secondary", onClick: () => setViewOpen(true), children: "View" })
    ] }) }) }),
    /* @__PURE__ */ jsxs(Modal, { open: viewOpen, onClose: () => setViewOpen(false), title: "Accomplishment Report", size: "lg", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4 text-sm", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          "Total Quotations: ",
          /* @__PURE__ */ jsx("strong", { children: report.totalQuotations })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          "Approved Quotations: ",
          /* @__PURE__ */ jsx("strong", { children: report.approvedQuotations })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          "Purchase Orders: ",
          /* @__PURE__ */ jsx("strong", { children: report.purchaseOrders })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          "Receiving Transactions: ",
          /* @__PURE__ */ jsx("strong", { children: report.receivingTransactions })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          "Outslips: ",
          /* @__PURE__ */ jsx("strong", { children: report.outslips })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          "Delivery Receipts: ",
          /* @__PURE__ */ jsx("strong", { children: report.deliveryReceipts })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          "Billing Statements: ",
          /* @__PURE__ */ jsx("strong", { children: report.billingStatements })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          "Completed Deliveries: ",
          /* @__PURE__ */ jsx("strong", { children: report.completedDeliveries })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "mt-4 text-sm text-text-secondary", children: [
        /* @__PURE__ */ jsx("strong", { children: "Remarks:" }),
        " ",
        report.remarks
      ] }),
      /* @__PURE__ */ jsx(Button, { className: "mt-4", onClick: () => navigate("/reports/accomplishment/preview"), children: "Preview Report" })
    ] })
  ] });
}
export {
  AccomplishmentPage
};
