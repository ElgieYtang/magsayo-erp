import { jsx } from "react/jsx-runtime";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";
const Card = forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx(
    "div",
    {
      ref,
      className: cn(
        "rounded-lg border border-border bg-surface shadow-sm",
        className
      ),
      ...props
    }
  )
);
Card.displayName = "Card";
const CardHeader = forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("px-6 py-4 border-b border-border", className), ...props })
);
CardHeader.displayName = "CardHeader";
const CardTitle = forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx(
    "h3",
    {
      ref,
      className: cn("text-base font-semibold text-text-primary", className),
      ...props
    }
  )
);
CardTitle.displayName = "CardTitle";
const CardContent = forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("px-6 py-4", className), ...props })
);
CardContent.displayName = "CardContent";
export {
  Card,
  CardContent,
  CardHeader,
  CardTitle
};
