import { jsx, jsxs } from "react/jsx-runtime";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
function PlaceholderPage({ title, description }) {
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx(PageHeader, { title, description }),
    /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "py-12 text-center", children: /* @__PURE__ */ jsxs("p", { className: "text-text-secondary", children: [
      title,
      " module \u2014 ready for implementation."
    ] }) }) })
  ] });
}
export {
  PlaceholderPage
};
