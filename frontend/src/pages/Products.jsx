import { jsx, jsxs } from "react/jsx-runtime";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { EmptyState, TableFilters } from "@/components/ui/table-filters";
import { useDemo } from "@/context/DemoContext";
import { formatCurrency } from "@/lib/format";
import { getStatusDisplay } from "@/lib/status";
import { useMemo, useState } from "react";
function ProductsPage() {
  const { state } = useDemo();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewProductId, setViewProductId] = useState(null);
  const filtered = useMemo(() => {
    let list = state.products;
    const q = search.toLowerCase();
    if (q) {
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "all") {
      list = list.filter((p) => p.status === statusFilter);
    }
    return list;
  }, [state.products, search, statusFilter]);
  const viewProduct = viewProductId ? state.products.find((p) => p.id === viewProductId) : null;
  const movements = viewProduct ? state.stockMovements.filter((m) => m.productId === viewProduct.id) : [];
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx(PageHeader, { title: "Products", description: "Manage product catalog, pricing, and stock levels." }),
    /* @__PURE__ */ jsx(
      TableFilters,
      {
        search,
        onSearchChange: setSearch,
        searchPlaceholder: "Search products...",
        statusFilter,
        onStatusChange: setStatusFilter,
        statusOptions: [
          { value: "In Stock", label: "In Stock" },
          { value: "Low Stock", label: "Low Stock" },
          { value: "Out of Stock", label: "Out of Stock" }
        ]
      }
    ),
    /* @__PURE__ */ jsxs(Table, { children: [
      /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { className: "hover:bg-transparent", children: [
        /* @__PURE__ */ jsx(TableHead, { children: "Product" }),
        /* @__PURE__ */ jsx(TableHead, { children: "SKU" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Category" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Unit" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Price" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Stock" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Status" }),
        /* @__PURE__ */ jsx(TableHead, {})
      ] }) }),
      /* @__PURE__ */ jsx(TableBody, { children: filtered.length === 0 ? /* @__PURE__ */ jsx(TableRow, { className: "hover:bg-transparent", children: /* @__PURE__ */ jsx(TableCell, { colSpan: 8, children: /* @__PURE__ */ jsx(EmptyState, {}) }) }) : filtered.map((p) => {
        const st = getStatusDisplay(p.status);
        return /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableCell, { className: "font-medium", children: p.name }),
          /* @__PURE__ */ jsx(TableCell, { children: p.sku }),
          /* @__PURE__ */ jsx(TableCell, { children: p.category }),
          /* @__PURE__ */ jsx(TableCell, { children: p.unit }),
          /* @__PURE__ */ jsx(TableCell, { children: formatCurrency(p.price) }),
          /* @__PURE__ */ jsx(TableCell, { children: p.stock }),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, { variant: st.variant, children: st.label }) }),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", onClick: () => setViewProductId(p.id), children: "View" }) })
        ] }, p.id);
      }) })
    ] }),
    /* @__PURE__ */ jsx(
      Modal,
      {
        open: !!viewProduct,
        onClose: () => setViewProductId(null),
        title: viewProduct?.name ?? "Product",
        size: "lg",
        children: viewProduct && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4 text-sm", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "text-text-secondary", children: "SKU:" }),
              " ",
              viewProduct.sku
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "text-text-secondary", children: "Stock:" }),
              " ",
              viewProduct.stock
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "text-text-secondary", children: "Price:" }),
              " ",
              formatCurrency(viewProduct.price)
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "text-text-secondary", children: "Reorder Level:" }),
              " ",
              viewProduct.reorderLevel
            ] })
          ] }),
          /* @__PURE__ */ jsx("h3", { className: "font-semibold text-text-primary", children: "Stock Movement History" }),
          /* @__PURE__ */ jsxs(Table, { children: [
            /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { className: "hover:bg-transparent", children: [
              /* @__PURE__ */ jsx(TableHead, { children: "Date" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Reference" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Type" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Change" }),
              /* @__PURE__ */ jsx(TableHead, { children: "Balance" })
            ] }) }),
            /* @__PURE__ */ jsx(TableBody, { children: movements.length === 0 ? /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 5, className: "text-center text-text-secondary", children: "No stock movements recorded." }) }) : movements.map((m) => /* @__PURE__ */ jsxs(TableRow, { children: [
              /* @__PURE__ */ jsx(TableCell, { children: m.date }),
              /* @__PURE__ */ jsx(TableCell, { children: m.reference }),
              /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx("span", { className: m.type === "Receiving" ? "text-[#15803D] font-medium" : "text-[#DC2626] font-medium", children: m.type === "Receiving" ? "STOCK IN" : "STOCK OUT" }) }),
              /* @__PURE__ */ jsx(TableCell, { className: m.change > 0 ? "text-[#15803D]" : "text-[#DC2626]", children: m.change > 0 ? `+${m.change}` : m.change }),
              /* @__PURE__ */ jsx(TableCell, { children: m.balance })
            ] }, m.id)) })
          ] })
        ] })
      }
    )
  ] });
}
export {
  ProductsPage
};
