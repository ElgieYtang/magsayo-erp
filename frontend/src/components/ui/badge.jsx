import { jsx } from "react/jsx-runtime";
import { cn } from "@/lib/utils";
const variantStyles = {
  approved: "bg-[#DCFCE7] text-[#15803D]",
  pending: "bg-[#FEF3C7] text-[#B45309]",
  rejected: "bg-[#FEE2E2] text-[#DC2626]",
  draft: "bg-draft text-text-secondary",
  released: "bg-[#DBEAFE] text-[#1D4ED8]",
  current: "bg-maroon-light text-maroon",
  default: "bg-draft text-text-secondary"
};
function Badge({ className, variant = "default", ...props }) {
  return /* @__PURE__ */ jsx(
    "span",
    {
      className: cn(
        "inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-semibold leading-none",
        "min-h-[22px]",
        variantStyles[variant],
        className
      ),
      ...props
    }
  );
}
export {
  Badge
};
