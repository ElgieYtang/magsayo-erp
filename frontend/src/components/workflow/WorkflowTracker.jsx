import { jsx } from "react/jsx-runtime";
import { SHOW_TRANSACTION_WORKFLOW } from "@/config/featureFlags";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
function WorkflowTracker({ stages, className }) {
  if (!SHOW_TRANSACTION_WORKFLOW) return null;
  return /* @__PURE__ */ jsx("div", { className: cn("flex flex-col", className), children: stages.map((stage, index) => /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: cn(
            "flex h-6 w-6 items-center justify-center rounded-full text-xs",
            stage.status === "completed" && "bg-[#DCFCE7] text-[#15803D]",
            stage.status === "current" && "bg-maroon text-white",
            stage.status === "future" && "border-2 border-border bg-surface text-text-secondary"
          ),
          children: stage.status === "completed" ? /* @__PURE__ */ jsx(Check, { className: "h-3.5 w-3.5" }) : stage.status === "current" ? /* @__PURE__ */ jsx("span", { className: "h-2 w-2 rounded-full bg-white" }) : null
        }
      ),
      index < stages.length - 1 && /* @__PURE__ */ jsx(
        "div",
        {
          className: cn(
            "my-1 h-6 w-0.5",
            stage.status === "completed" ? "bg-[#15803D]" : "bg-border"
          )
        }
      )
    ] }),
    /* @__PURE__ */ jsx(
      "span",
      {
        className: cn(
          "pb-6 text-sm",
          stage.status === "current" && "font-semibold text-maroon",
          stage.status === "completed" && "text-text-primary",
          stage.status === "future" && "text-text-secondary"
        ),
        children: stage.label
      }
    )
  ] }, stage.label)) });
}
export {
  WorkflowTracker
};
