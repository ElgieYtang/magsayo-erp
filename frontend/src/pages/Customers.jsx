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
function CustomersPage() {
  const { state } = useDemo();
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return state.customers;
    return state.customers.filter(
      (c) => c.name.toLowerCase().includes(q) || c.contactPerson.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
    );
  }, [state.customers, search]);
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx(PageHeader, { title: "Customers", description: "Manage customer master data." }),
    /* @__PURE__ */ jsx(TableFilters, { search, onSearchChange: setSearch, searchPlaceholder: "Search customers..." }),
    /* @__PURE__ */ jsxs(Table, { children: [
      /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { className: "hover:bg-transparent", children: [
        /* @__PURE__ */ jsx(TableHead, { children: "Customer" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Contact Person" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Phone" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Email" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Address" })
      ] }) }),
      /* @__PURE__ */ jsx(TableBody, { children: filtered.length === 0 ? /* @__PURE__ */ jsx(TableRow, { className: "hover:bg-transparent", children: /* @__PURE__ */ jsx(TableCell, { colSpan: 5, children: /* @__PURE__ */ jsx(EmptyState, {}) }) }) : filtered.map((c) => /* @__PURE__ */ jsxs(TableRow, { children: [
        /* @__PURE__ */ jsx(TableCell, { className: "font-medium", children: c.name }),
        /* @__PURE__ */ jsx(TableCell, { children: c.contactPerson }),
        /* @__PURE__ */ jsx(TableCell, { children: c.phone }),
        /* @__PURE__ */ jsx(TableCell, { children: c.email }),
        /* @__PURE__ */ jsx(TableCell, { children: c.address })
      ] }, c.id)) })
    ] })
  ] });
}
export {
  CustomersPage
};
