import { jsx } from "react/jsx-runtime";
import { cn } from "@/lib/utils";
function Table({ className, ...props }) {
  return /* @__PURE__ */ jsx("div", { className: "w-full overflow-auto rounded-lg border border-border bg-surface", children: /* @__PURE__ */ jsx("table", { className: cn("w-full caption-bottom text-sm", className), ...props }) });
}
function TableHeader({ className, ...props }) {
  return /* @__PURE__ */ jsx("thead", { className: cn("bg-table-header", className), ...props });
}
function TableBody({ className, ...props }) {
  return /* @__PURE__ */ jsx("tbody", { className: cn("[&_tr:last-child]:border-0", className), ...props });
}
function TableRow({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "tr",
    {
      className: cn(
        "border-b border-border transition-colors hover:bg-maroon-light",
        className
      ),
      ...props
    }
  );
}
function TableHead({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "th",
    {
      className: cn(
        "h-10 px-4 text-left align-middle text-xs font-medium uppercase tracking-wide text-text-secondary",
        className
      ),
      ...props
    }
  );
}
function TableCell({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "td",
    {
      className: cn("px-4 py-3 align-middle text-text-primary", className),
      ...props
    }
  );
}
function TableLink({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "span",
    {
      className: cn("font-medium text-maroon cursor-pointer hover:text-maroon-dark", className),
      ...props
    }
  );
}
export {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableLink,
  TableRow
};
