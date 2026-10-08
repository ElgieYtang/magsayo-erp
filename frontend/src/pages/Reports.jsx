import { jsx, jsxs } from "react/jsx-runtime";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { getStockLevels, useErp } from "@/data/erpStore";
import { Printer } from "lucide-react";
function ReportsPage() {
  const { movements } = useErp();
  const stock = getStockLevels(movements);
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx(
      PageHeader,
      {
        title: "Reports",
        description: "Inventory reports generated from ERP transactions.",
        action: /* @__PURE__ */ jsxs(Button, { onClick: () => window.print(), children: [
          /* @__PURE__ */ jsx(Printer, { className: "h-4 w-4" }),
          "Print"
        ] })
      }
    ),
    /* @__PURE__ */ jsx(Card, { className: "mb-6", children: /* @__PURE__ */ jsxs(CardContent, { className: "pt-4", children: [
      /* @__PURE__ */ jsx("h2", { className: "mb-3 text-base font-semibold text-text-primary", children: "Current stock report" }),
      /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { className: "hover:bg-transparent", children: [
          /* @__PURE__ */ jsx(TableHead, { children: "Item Code" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Item" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Quantity" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Unit" })
        ] }) }),
        /* @__PURE__ */ jsx(TableBody, { children: stock.map((row) => /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableCell, { children: row.itemCode }),
          /* @__PURE__ */ jsx(TableCell, { children: row.item }),
          /* @__PURE__ */ jsx(TableCell, { children: row.quantity }),
          /* @__PURE__ */ jsx(TableCell, { children: row.unit })
        ] }, row.itemCode)) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(CardContent, { className: "pt-4", children: [
      /* @__PURE__ */ jsx("h2", { className: "mb-3 text-base font-semibold text-text-primary", children: "Inventory records report" }),
      /* @__PURE__ */ jsxs(Table, { children: [
        /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { className: "hover:bg-transparent", children: [
          /* @__PURE__ */ jsx(TableHead, { children: "Date" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Item" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Qty" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Project" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Customer" }),
          /* @__PURE__ */ jsx(TableHead, { children: "PO" }),
          /* @__PURE__ */ jsx(TableHead, { children: "Outslip" })
        ] }) }),
        /* @__PURE__ */ jsx(TableBody, { children: movements.map((row) => /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableCell, { children: row.date }),
          /* @__PURE__ */ jsxs(TableCell, { children: [
            row.item,
            /* @__PURE__ */ jsx("div", { className: "text-xs text-text-secondary", children: row.itemCode })
          ] }),
          /* @__PURE__ */ jsxs(TableCell, { children: [
            row.quantity,
            " ",
            row.unit
          ] }),
          /* @__PURE__ */ jsx(TableCell, { children: row.project }),
          /* @__PURE__ */ jsx(TableCell, { children: row.customer }),
          /* @__PURE__ */ jsx(TableCell, { children: row.poId }),
          /* @__PURE__ */ jsx(TableCell, { children: row.outslipId })
        ] }, row.id)) })
      ] })
    ] }) })
  ] });
}
export {
  ReportsPage
};
