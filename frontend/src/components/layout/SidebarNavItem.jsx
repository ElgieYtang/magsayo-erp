import { jsx, jsxs } from "react/jsx-runtime";
import { cn } from "@/lib/utils";
import { NavLink } from "react-router-dom";
function SidebarNavItem({
  to,
  label,
  icon: Icon,
  indent = false,
  nested = false,
  end = false,
  onNavigate
}) {
  return /* @__PURE__ */ jsxs(
    NavLink,
    {
      to,
      end,
      onClick: onNavigate,
      className: ({ isActive }) => cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150",
        indent && "ml-4",
        nested && "ml-8",
        isActive ? "mx-2 bg-maroon-light text-maroon" : "text-white/85 hover:bg-maroon-dark hover:text-white"
      ),
      children: [
        Icon && /* @__PURE__ */ jsx(Icon, { className: "h-4 w-4 shrink-0" }),
        /* @__PURE__ */ jsx("span", { children: label })
      ]
    }
  );
}
export {
  SidebarNavItem
};
