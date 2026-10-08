import { jsx, jsxs } from "react/jsx-runtime";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel"
}) {
  return /* @__PURE__ */ jsxs(Modal, { open, onClose, title, size: "sm", children: [
    /* @__PURE__ */ jsx("p", { className: "text-sm text-text-secondary", children: message }),
    /* @__PURE__ */ jsxs("div", { className: "mt-6 flex justify-end gap-3", children: [
      /* @__PURE__ */ jsx(Button, { variant: "secondary", onClick: onClose, children: cancelLabel }),
      /* @__PURE__ */ jsx(
        Button,
        {
          onClick: () => {
            onConfirm();
            onClose();
          },
          children: confirmLabel
        }
      )
    ] })
  ] });
}
export {
  ConfirmDialog
};
