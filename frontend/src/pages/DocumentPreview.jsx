import { jsx, jsxs } from "react/jsx-runtime";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { colors } from "@/lib/theme";
function DocumentPreview() {
  return /* @__PURE__ */ jsx(Card, { className: "max-w-2xl", children: /* @__PURE__ */ jsxs(CardContent, { className: "p-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold text-text-primary", children: "RESPONSIVCODE TECHNOLOGY SOLUTIONS" }),
      /* @__PURE__ */ jsxs("div", { className: "mt-6", children: [
        /* @__PURE__ */ jsx(
          "h2",
          {
            className: "text-xl font-bold tracking-wide",
            style: { color: colors.maroon },
            children: "QUOTATION"
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "mx-auto mt-1 h-0.5 w-24",
            style: { backgroundColor: colors.maroon }
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-8 space-y-2 text-sm", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
        /* @__PURE__ */ jsx("span", { className: "text-text-secondary", children: "Quotation No:" }),
        /* @__PURE__ */ jsx("span", { className: "font-medium text-maroon", children: "QTN-00001" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
        /* @__PURE__ */ jsx("span", { className: "text-text-secondary", children: "Date:" }),
        /* @__PURE__ */ jsx("span", { className: "text-text-primary", children: "August 19, 2026" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
        /* @__PURE__ */ jsx("span", { className: "text-text-secondary", children: "Customer:" }),
        /* @__PURE__ */ jsx("span", { className: "text-text-primary", children: "ABC Corporation" })
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "my-6 border-t",
        style: { borderColor: colors.border }
      }
    ),
    /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs(
        "tr",
        {
          className: "text-left text-xs uppercase tracking-wide",
          style: { color: colors.textSecondary },
          children: [
            /* @__PURE__ */ jsx("th", { className: "pb-2", children: "Item" }),
            /* @__PURE__ */ jsx("th", { className: "pb-2 text-right", children: "Qty" }),
            /* @__PURE__ */ jsx("th", { className: "pb-2 text-right", children: "Price" }),
            /* @__PURE__ */ jsx("th", { className: "pb-2 text-right", children: "Amount" })
          ]
        }
      ) }),
      /* @__PURE__ */ jsx("tbody", { children: /* @__PURE__ */ jsxs("tr", { className: "border-t", style: { borderColor: colors.border }, children: [
        /* @__PURE__ */ jsx("td", { className: "py-3 text-text-primary", children: "Laptop" }),
        /* @__PURE__ */ jsx("td", { className: "py-3 text-right text-text-primary", children: "10" }),
        /* @__PURE__ */ jsx("td", { className: "py-3 text-right text-text-primary", children: "\u20B140,000" }),
        /* @__PURE__ */ jsx("td", { className: "py-3 text-right text-text-primary", children: "\u20B1400,000" })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "my-4 border-t",
        style: { borderColor: colors.border }
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
      /* @__PURE__ */ jsx("span", { className: "text-sm text-text-secondary", children: "TOTAL " }),
      /* @__PURE__ */ jsx("span", { className: "text-lg font-bold text-text-primary", children: "\u20B1400,000" })
    ] }) })
  ] }) });
}
function DocumentPreviewPage() {
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx(
      PageHeader,
      {
        title: "Document Preview",
        description: "Official printable document format with maroon accents."
      }
    ),
    /* @__PURE__ */ jsx(DocumentPreview, {})
  ] });
}
export {
  DocumentPreview,
  DocumentPreviewPage
};
