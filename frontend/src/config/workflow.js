const ERP_WORKFLOW = [
  "Quotation",
  "Purchase Order",
  "Outslip",
  "Inventory & Reports",
  "Delivery Receipt",
  "Accomplishment"
];
function workflowStages(current) {
  const currentIndex = ERP_WORKFLOW.indexOf(current);
  return ERP_WORKFLOW.map((label, index) => {
    if (index < currentIndex) return { label, status: "completed" };
    if (index === currentIndex) return { label, status: "current" };
    return { label, status: "future" };
  });
}
export {
  ERP_WORKFLOW,
  workflowStages
};
