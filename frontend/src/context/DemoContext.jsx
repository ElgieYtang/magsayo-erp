import { jsx } from "react/jsx-runtime";
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { initialDemoState } from "@/data/initialData";
import { createSetupMutations } from "@/context/setupMutations";
import { useToast } from "@/context/ToastContext";
const DemoContext = createContext(null);
function updateProductStock(products, productId, delta) {
  return products.map((p) => {
    if (p.id !== productId) return p;
    const stock = p.stock + delta;
    let status = "In Stock";
    if (stock === 0) status = "Out of Stock";
    else if (stock <= p.reorderLevel) status = "Low Stock";
    return { ...p, stock, status };
  });
}
function DemoProvider({ children }) {
  const [state, setState] = useState(initialDemoState);
  const { toasts, showToast, removeToast } = useToast();
  const getCustomerName = useCallback(
    (id) => state.customers.find((c) => c.id === id)?.name ?? id,
    [state.customers]
  );
  const getSupplierName = useCallback(
    (id) => state.suppliers.find((s) => s.id === id)?.name ?? id,
    [state.suppliers]
  );
  const getProduct = useCallback(
    (id) => state.products.find((p) => p.id === id),
    [state.products]
  );
  const updateQuotation = useCallback((id, data) => {
    setState((prev) => ({
      ...prev,
      quotations: prev.quotations.map(
        (q) => q.id === id ? { ...q, ...data } : q
      )
    }));
  }, []);
  const cancelQuotation = useCallback((id) => {
    setState((prev) => ({
      ...prev,
      quotations: prev.quotations.map(
        (q) => q.id === id ? { ...q, status: "cancelled" } : q
      )
    }));
  }, []);
  const addQuotation = useCallback((data) => {
    setState((prev) => {
      const maxNum = prev.quotations.reduce((max, quotation) => {
        const match = quotation.id.match(/QTN-(\d+)/);
        const num = match ? Number(match[1]) : 0;
        return Math.max(max, num);
      }, 0);
      const id = `QTN-${String(maxNum + 1).padStart(5, "0")}`;
      const items = data.items ?? [];
      const total = items.reduce(
        (sum, item) => sum + Number(item.quantity) * Number(item.unitPrice),
        0
      );
      const quotation = {
        id,
        customerId: data.customerId,
        date: data.date ?? "August 19, 2026",
        validUntil: data.validUntil ?? "",
        subject: data.subject ?? "",
        items,
        total,
        status: "pending",
        terms: data.terms ?? "",
        preparedBy: "Admin User"
      };
      return {
        ...prev,
        quotations: [...prev.quotations, quotation]
      };
    });
    showToast("success", "Quotation created successfully.");
  }, [showToast]);
  const convertQuotationToPO = useCallback((quotationId) => {
    const qtn = state.quotations.find((q) => q.id === quotationId);
    if (!qtn || qtn.status !== "approved") return null;
    const existing = state.purchaseOrders.find((po) => po.referenceQuotationId === quotationId);
    if (existing) return existing.id;
    const newId = "PO-00004";
    const newPO = {
      id: newId,
      referenceQuotationId: quotationId,
      supplierId: state.suppliers[0]?.id ?? "sup-tech",
      date: "August 19, 2026",
      items: qtn.items,
      total: qtn.total,
      status: "approved"
    };
    setState((prev) => ({
      ...prev,
      purchaseOrders: [...prev.purchaseOrders, newPO],
      workflowStage: "purchase_order"
    }));
    showToast("success", "Purchase Order created successfully.");
    return newId;
  }, [state.quotations, state.purchaseOrders, state.suppliers, showToast]);
  const updatePurchaseOrder = useCallback(
    (id, data) => {
      setState((prev) => ({
        ...prev,
        purchaseOrders: prev.purchaseOrders.map(
          (po) => po.id === id ? { ...po, ...data } : po
        )
      }));
    },
    []
  );
  const confirmReceiving = useCallback((id) => {
    setState((prev) => {
      const rec = prev.receivings.find((r) => r.id === id);
      if (!rec) return prev;
      if (rec.status === "completed") {
        return prev;
      }
      let products = [...prev.products];
      const movements = [...prev.stockMovements];
      rec.items.forEach((item) => {
        const toReceive = item.remaining > 0 ? item.remaining : item.ordered - item.received;
        if (toReceive <= 0) return;
        const product = products.find((p) => p.id === item.productId);
        if (!product) return;
        products = updateProductStock(products, item.productId, toReceive);
        movements.unshift({
          id: `sm-${Date.now()}-${item.productId}`,
          productId: item.productId,
          date: "August 19, 2026",
          reference: rec.id,
          type: "Receiving",
          change: toReceive,
          balance: product.stock + toReceive
        });
      });
      const receivings = prev.receivings.map(
        (r) => r.id === id ? {
          ...r,
          status: "completed",
          items: r.items.map((i) => ({
            ...i,
            received: i.ordered,
            remaining: 0
          }))
        } : r
      );
      return { ...prev, products, stockMovements: movements, receivings, workflowStage: "receiving" };
    });
    showToast("success", "Receiving completed successfully. Inventory has been updated.");
  }, [showToast]);
  const approveOutslip = useCallback((id) => {
    setState((prev) => ({
      ...prev,
      outslips: prev.outslips.map(
        (o) => o.id === id && o.status === "pending" ? { ...o, status: "approved" } : o
      )
    }));
    showToast("success", "Outslip approved successfully.");
  }, [showToast]);
  const forDispatchOutslip = useCallback((id) => {
    setState((prev) => {
      const os = prev.outslips.find((o) => o.id === id);
      if (!os || os.status !== "approved") return prev;
      let products = [...prev.products];
      const movements = [...prev.stockMovements];
      os.items.forEach((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (!product) return;
        products = updateProductStock(products, item.productId, -item.quantity);
        movements.unshift({
          id: `sm-os-${Date.now()}-${item.productId}`,
          productId: item.productId,
          date: "August 19, 2026",
          reference: os.id,
          type: "Outslip",
          change: -item.quantity,
          balance: product.stock - item.quantity
        });
      });
      return {
        ...prev,
        products,
        stockMovements: movements,
        outslips: prev.outslips.map(
          (o) => o.id === id ? { ...o, status: "for_dispatch" } : o
        ),
        workflowStage: "outslip"
      };
    });
    showToast("success", "Outslip marked for dispatch. Inventory has been updated.");
  }, [showToast]);
  const releaseOutslip = useCallback((id) => {
    forDispatchOutslip(id);
  }, [forDispatchOutslip]);
  const createDeliveryFromOutslip = useCallback((outslipId) => {
    const os = state.outslips.find((o) => o.id === outslipId);
    if (!os || os.status !== "for_dispatch") return null;
    const existing = state.deliveryReceipts.find((d) => d.referenceOutslipId === outslipId);
    if (existing) return existing.id;
    const customer = state.customers.find((c) => c.id === os.customerId);
    const num = state.deliveryReceipts.length + 1;
    const drId = `DR-${String(num).padStart(5, "0")}`;
    setState((prev) => ({
      ...prev,
      deliveryReceipts: [
        ...prev.deliveryReceipts,
        {
          id: drId,
          customerId: os.customerId,
          referenceOutslipId: os.id,
          date: "August 19, 2026",
          deliveryAddress: customer?.address ?? "Cebu City, Cebu",
          driver: "Pedro Santos",
          vehicle: "ABC-1234",
          status: "active"
        }
      ],
      workflowStage: "delivery"
    }));
    showToast("success", "Delivery Receipt created successfully.");
    return drId;
  }, [state.outslips, state.deliveryReceipts, state.customers, showToast]);
  const markDeliveryOutForDelivery = useCallback((id) => {
    setState((prev) => ({
      ...prev,
      deliveryReceipts: prev.deliveryReceipts.map(
        (dr) => dr.id === id && dr.status === "active" ? { ...dr, status: "out_for_delivery" } : dr
      )
    }));
    showToast("success", "Delivery marked as out for delivery.");
  }, [showToast]);
  const markDeliveryDelivered = useCallback((id) => {
    setState((prev) => ({
      ...prev,
      deliveryReceipts: prev.deliveryReceipts.map(
        (dr) => dr.id === id ? { ...dr, status: "delivered" } : dr
      ),
      workflowStage: "delivery"
    }));
    showToast("success", "Delivery marked as completed.");
  }, [showToast]);
  const recordPayment = useCallback(
    (billingId, amount, date, reference) => {
      setState((prev) => {
        const bill = prev.billingStatements.find((b) => b.id === billingId);
        if (!bill) return prev;
        const paidAmount = (bill.paidAmount ?? 0) + amount;
        let paymentStatus = "unpaid";
        if (paidAmount >= bill.amount) paymentStatus = "paid";
        else if (paidAmount > 0) paymentStatus = "partially_paid";
        const billingStatements = prev.billingStatements.map(
          (b) => b.id === billingId ? { ...b, paidAmount, paymentStatus } : b
        );
        const soaPayments = [
          ...prev.soaPayments,
          {
            id: reference || `PAY-${Date.now()}`,
            customerId: bill.customerId,
            date,
            reference: reference || `PAY-${Date.now()}`,
            amount,
            description: "Payment"
          }
        ];
        return { ...prev, billingStatements, soaPayments, workflowStage: "billing" };
      });
      showToast("success", "Payment recorded successfully.");
    },
    [showToast]
  );
  const generateSOA = useCallback(() => {
    setState((prev) => ({ ...prev, workflowStage: "soa" }));
    showToast("success", "SOA generated successfully.");
  }, [showToast]);
  const setupMutations = useMemo(() => createSetupMutations(setState), []);
  const value = useMemo(
    () => ({
      state,
      getCustomerName,
      getSupplierName,
      getProduct,
      updateQuotation,
      addQuotation,
      cancelQuotation,
      convertQuotationToPO,
      updatePurchaseOrder,
      confirmReceiving,
      approveOutslip,
      forDispatchOutslip,
      releaseOutslip,
      createDeliveryFromOutslip,
      markDeliveryOutForDelivery,
      markDeliveryDelivered,
      recordPayment,
      generateSOA,
      ...setupMutations,
      toasts,
      showToast,
      removeToast
    }),
    [
      state,
      getCustomerName,
      getSupplierName,
      getProduct,
      updateQuotation,
      addQuotation,
      cancelQuotation,
      convertQuotationToPO,
      updatePurchaseOrder,
      confirmReceiving,
      approveOutslip,
      forDispatchOutslip,
      releaseOutslip,
      createDeliveryFromOutslip,
      markDeliveryOutForDelivery,
      markDeliveryDelivered,
      recordPayment,
      generateSOA,
      setupMutations,
      toasts,
      showToast,
      removeToast
    ]
  );
  return /* @__PURE__ */ jsx(DemoContext.Provider, { value, children });
}
function useDemo() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemo must be used within DemoProvider");
  return ctx;
}
export {
  DemoProvider,
  useDemo
};
