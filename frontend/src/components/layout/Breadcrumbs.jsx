import { jsx, jsxs } from "react/jsx-runtime";
import { cn } from "@/lib/utils";
function Breadcrumbs({ items }) {
  return /* @__PURE__ */ jsx("nav", { className: "mb-1 text-xs text-text-secondary", children: items.join(" / ") });
}
function StatusTabs({
  tabs,
  active,
  onChange
}) {
  return /* @__PURE__ */ jsx("div", { className: "mb-4 flex flex-wrap gap-2", children: tabs.map((tab) => /* @__PURE__ */ jsxs(
    "button",
    {
      type: "button",
      onClick: () => onChange(tab.key),
      className: cn(
        "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
        active === tab.key ? "bg-maroon text-white" : "bg-surface border border-border text-text-secondary hover:border-maroon hover:text-maroon"
      ),
      children: [
        tab.label,
        tab.count !== void 0 && ` ${tab.count}`
      ]
    },
    tab.key
  )) });
}
export {
  Breadcrumbs,
  StatusTabs
};
