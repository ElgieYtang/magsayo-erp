export function findReceivingForPo(receivings, po) {
  if (!po) return null
  const poId = po.id?.toString()
  const poDbId = po.dbId?.toString()
  return (
    receivings.find(
      (receiving) =>
        receiving.purchaseOrderId === poId ||
        receiving.purchaseOrderDbId === poDbId ||
        receiving.purchaseOrderDbId === poId,
    ) ?? null
  )
}
