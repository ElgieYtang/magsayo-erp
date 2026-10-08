import { jsx, jsxs } from "react/jsx-runtime";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
function PageHeader({ title, description, action, breadcrumbs }) {
  return /* @__PURE__ */ jsxs("div", { className: "mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-start sm:justify-between sm:gap-4", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      breadcrumbs && breadcrumbs.length > 0 && /* @__PURE__ */ jsx(Breadcrumbs, { items: breadcrumbs }),
      /* @__PURE__ */ jsx("h1", { className: "text-xl font-semibold text-text-primary md:text-2xl", children: title }),
      description && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-text-secondary", children: description })
    ] }),
    action && /* @__PURE__ */ jsx("div", { className: "shrink-0", children: action })
  ] });
}
export {
  PageHeader
};
