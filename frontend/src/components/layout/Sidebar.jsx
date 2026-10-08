import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import logo from "@/assets/logo.png";
import { navigation } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { Link } from "react-router-dom";
import { SidebarNavItem } from "./SidebarNavItem";
function Brand({ onNavigate }) {
  return /* @__PURE__ */ jsxs(
    Link,
    {
      to: "/",
      onClick: onNavigate,
      className: "flex items-center gap-3 rounded-md px-3 py-2 transition-colors hover:bg-maroon-dark",
      "aria-label": "Go to Dashboard",
      children: [
        /* @__PURE__ */ jsx("img", { src: logo, alt: "ResponsivCode ERP", width: 42, height: 42, className: "nav-logo" }),
        /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsx("div", { className: "truncate text-sm font-bold tracking-wide text-white", children: "RESPONSIVCODE" }),
          /* @__PURE__ */ jsx("div", { className: "text-xs text-white/70", children: "ERP" })
        ] })
      ]
    }
  );
}
function NavSections({ onNavigate }) {
  return /* @__PURE__ */ jsx(Fragment, { children: navigation.map((section, sectionIndex) => /* @__PURE__ */ jsxs("div", { className: cn(sectionIndex > 0 && "mt-4"), children: [
    section.heading && /* @__PURE__ */ jsx("div", { className: "mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-white/55", children: section.heading }),
    /* @__PURE__ */ jsx("div", { className: "space-y-0.5", children: section.items.map((item) => /* @__PURE__ */ jsx(
      SidebarNavItem,
      {
        to: item.path,
        label: item.label,
        icon: item.icon,
        end: item.path === "/" || item.path === "/reports/inventory",
        onNavigate
      },
      item.path
    )) })
  ] }, section.heading ?? sectionIndex)) });
}
function Sidebar({ mobileOpen = false, onMobileClose }) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    mobileOpen && /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        className: "fixed inset-0 z-40 bg-black/40 md:hidden print:hidden",
        onClick: onMobileClose,
        "aria-label": "Close menu"
      }
    ),
    /* @__PURE__ */ jsxs(
      "aside",
      {
        className: cn(
          "fixed left-0 top-0 z-50 flex h-screen w-[78%] max-w-[304px] flex-col bg-maroon shadow-xl transition-transform duration-250 print:hidden md:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        ),
        children: [
          /* @__PURE__ */ jsx("div", { className: "shrink-0 px-3 pt-4 pb-3", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2", children: [
            /* @__PURE__ */ jsx(Brand, { onNavigate: onMobileClose }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: onMobileClose,
                className: "shrink-0 rounded-md p-2 text-white/80 transition-colors hover:bg-maroon-dark hover:text-white",
                "aria-label": "Close navigation",
                children: /* @__PURE__ */ jsx(X, { className: "h-5 w-5" })
              }
            )
          ] }) }),
          /* @__PURE__ */ jsx("nav", { className: "sidebar-nav-scroll flex-1 overflow-y-auto px-3 pb-4", children: /* @__PURE__ */ jsx(NavSections, { onNavigate: onMobileClose }) })
        ]
      }
    ),
    /* @__PURE__ */ jsxs("aside", { className: "fixed left-0 top-0 z-40 hidden h-screen w-[250px] flex-col bg-maroon print:hidden md:flex", children: [
      /* @__PURE__ */ jsx("div", { className: "shrink-0 px-3 pt-4 pb-3", children: /* @__PURE__ */ jsx(Brand, {}) }),
      /* @__PURE__ */ jsx("nav", { className: "sidebar-nav-scroll flex-1 overflow-y-auto px-3 pb-4", children: /* @__PURE__ */ jsx(NavSections, {}) })
    ] })
  ] });
}
export {
  Sidebar
};
