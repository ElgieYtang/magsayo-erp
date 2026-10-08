import { jsx, jsxs } from "react/jsx-runtime";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";
const Input = forwardRef(
  ({ className, type = "text", ...props }, ref) => /* @__PURE__ */ jsx(
    "input",
    {
      ref,
      type,
      className: cn(
        "flex h-9 w-full rounded-md border border-border-input bg-surface px-3 py-1 text-sm text-text-primary",
        "placeholder:text-text-secondary",
        "focus-visible:outline-none focus-visible:border-maroon focus-visible:ring-2 focus-visible:ring-maroon-light",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props
    }
  )
);
Input.displayName = "Input";
const Label = forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx(
    "label",
    {
      ref,
      className: cn("text-sm font-medium text-text-primary", className),
      ...props
    }
  )
);
Label.displayName = "Label";
const FormField = ({
  label,
  children,
  className
}) => /* @__PURE__ */ jsxs("div", { className: cn("space-y-1.5", className), children: [
  /* @__PURE__ */ jsx(Label, { children: label }),
  children
] });
export {
  FormField,
  Input,
  Label
};
