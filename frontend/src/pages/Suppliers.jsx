import { jsx, jsxs } from "react/jsx-runtime";
import { PageHeader } from "@/components/layout/PageHeader";
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
import { useMemo, useState } from "react";
function SuppliersPage() {
  const { state } = useDemo();
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return state.suppliers;
    return state.suppliers.filter(
      (s) => s.name.toLowerCase().includes(q) || s.contactPerson.toLowerCase().includes(q)
    );
  }, [state.suppliers, search]);
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx(PageHeader, { title: "Suppliers", description: "Manage supplier master data." }),
    /* @__PURE__ */ jsx(TableFilters, { search, onSearchChange: setSearch, searchPlaceholder: "Search suppliers..." }),
    /* @__PURE__ */ jsxs(Table, { children: [
      /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { className: "hover:bg-transparent", children: [
        /* @__PURE__ */ jsx(TableHead, { children: "Supplier" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Contact Person" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Phone" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Email" })
      ] }) }),
      /* @__PURE__ */ jsx(TableBody, { children: filtered.length === 0 ? /* @__PURE__ */ jsx(TableRow, { className: "hover:bg-transparent", children: /* @__PURE__ */ jsx(TableCell, { colSpan: 4, children: /* @__PURE__ */ jsx(EmptyState, {}) }) }) : filtered.map((s) => /* @__PURE__ */ jsxs(TableRow, { children: [
        /* @__PURE__ */ jsx(TableCell, { className: "font-medium", children: s.name }),
        /* @__PURE__ */ jsx(TableCell, { children: s.contactPerson }),
        /* @__PURE__ */ jsx(TableCell, { children: s.phone }),
        /* @__PURE__ */ jsx(TableCell, { children: s.email })
      ] }, s.id)) })
    ] })
  ] });
}
export {
  SuppliersPage
};
