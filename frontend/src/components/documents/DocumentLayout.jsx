import { jsx, jsxs } from "react/jsx-runtime";
import { COMPANY_NAME } from "@/types";
import { cn } from "@/lib/utils";
function DocumentLayout({ title, children, className, footer }) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: cn(
        "mx-auto bg-surface text-text-primary print-document",
        "w-full max-w-[210mm] min-h-[297mm] border border-border p-8 shadow-sm",
        "print:border-0 print:shadow-none print:p-0",
        className
      ),
      children: [
        /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold", children: COMPANY_NAME }),
          /* @__PURE__ */ jsx("div", { className: "mt-4 flex justify-center", children: /* @__PURE__ */ jsx("div", { className: "flex h-16 w-16 items-center justify-center rounded border border-dashed border-border bg-page text-xs text-text-secondary", children: "[ COMPANY LOGO ]" }) }),
          /* @__PURE__ */ jsx("h1", { className: "mt-6 text-xl font-bold tracking-wide text-maroon", children: title }),
          /* @__PURE__ */ jsx("div", { className: "mx-auto mt-2 h-0.5 w-24 bg-maroon" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-8", children }),
        footer && /* @__PURE__ */ jsx("div", { className: "mt-8 border-t border-border pt-6", children: footer })
      ]
    }
  );
}
function DocumentRow({
  label,
  value,
  highlight
}) {
  return /* @__PURE__ */ jsxs("div", { className: "flex justify-between py-1 text-sm", children: [
    /* @__PURE__ */ jsx("span", { className: "text-text-secondary", children: label }),
    /* @__PURE__ */ jsx("span", { className: highlight ? "font-semibold text-maroon" : "text-text-primary", children: value })
  ] });
}
function DocumentItemsTable({
  items
}) {
  return /* @__PURE__ */ jsxs("table", { className: "mt-4 w-full text-sm", children: [
    /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "border-b border-border text-left text-xs uppercase tracking-wide text-text-secondary", children: [
      /* @__PURE__ */ jsx("th", { className: "pb-2", children: "Item" }),
      /* @__PURE__ */ jsx("th", { className: "pb-2 text-right", children: "Qty" }),
      /* @__PURE__ */ jsx("th", { className: "pb-2 text-right", children: "Price" }),
      /* @__PURE__ */ jsx("th", { className: "pb-2 text-right", children: "Amount" })
    ] }) }),
    /* @__PURE__ */ jsx("tbody", { children: items.map((item) => /* @__PURE__ */ jsxs("tr", { className: "border-b border-border", children: [
      /* @__PURE__ */ jsx("td", { className: "py-2", children: item.name }),
      /* @__PURE__ */ jsx("td", { className: "py-2 text-right", children: item.qty }),
      /* @__PURE__ */ jsxs("td", { className: "py-2 text-right", children: [
        "\u20B1",
        item.price.toLocaleString()
      ] }),
      /* @__PURE__ */ jsxs("td", { className: "py-2 text-right", children: [
        "\u20B1",
        item.amount.toLocaleString()
      ] })
    ] }, item.name)) })
  ] });
}
function PrintActions({
  onBack,
  onPrint
}) {
  return /* @__PURE__ */ jsxs("div", { className: "print-page-actions no-print", children: [
    onBack && /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: onBack,
        className: "rounded-md border border-maroon px-4 py-2 text-sm font-medium text-maroon hover:bg-maroon-light",
        children: "Back"
      }
    ),
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: onPrint ?? (() => window.print()),
        className: "rounded-md bg-maroon px-4 py-2 text-sm font-medium text-white hover:bg-maroon-dark",
        children: "Print"
      }
    )
  ] });
}
export {
  DocumentItemsTable,
  DocumentLayout,
  DocumentRow,
  PrintActions
};
