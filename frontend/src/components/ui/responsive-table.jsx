import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { MobileCardList } from "@/components/ui/mobile-card-list";
function ResponsiveTable({ desktop, mobileItems, emptyMessage }) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("div", { className: "hidden md:block", children: desktop }),
    /* @__PURE__ */ jsx(MobileCardList, { items: mobileItems, emptyMessage })
  ] });
}
export {
  ResponsiveTable
};
