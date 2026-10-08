const CATEGORY_LABELS = {
  quotations: 'Quotations',
  purchase_orders: 'Purchase orders',
  receiving: 'Receiving',
  outslips: 'Outslips',
  deliveries: 'Deliveries',
  billing: 'Billing',
}

function pushItem(items, entry) {
  items.push(entry)
}

export function buildNotifications(
  {
    quotations = [],
    purchaseOrders = [],
    receivings = [],
    outslips = [],
    deliveryReceipts = [],
    billingStatements = [],
  },
  settings,
) {
  if (!settings?.notify_in_app) {
    return []
  }

  const items = []

  if (settings.notify_quotations) {
    for (const row of quotations.filter((q) => q.status === 'pending').slice(0, 8)) {
      pushItem(items, {
        id: `quotation-${row.id}`,
        category: 'quotations',
        categoryLabel: CATEGORY_LABELS.quotations,
        title: 'Quotation awaiting approval',
        message: `${row.id} · ${row.customerName ?? 'Customer'}`,
        path: `/quotations/${row.id}`,
        active: true,
      })
    }
  }

  if (settings.notify_purchase_orders) {
    for (const row of purchaseOrders
      .filter((po) => po.status !== 'cancelled' && po.status !== 'fully_received')
      .slice(0, 8)) {
      pushItem(items, {
        id: `po-${row.id}`,
        category: 'purchase_orders',
        categoryLabel: CATEGORY_LABELS.purchase_orders,
        title: 'Purchase order needs receiving',
        message: `${row.id} · ${row.supplierName ?? row.supplier ?? 'Supplier'}`,
        path: `/purchase-order/${row.id}`,
        active: true,
      })
    }
  }

  if (settings.notify_receiving) {
    for (const row of receivings.filter((r) => r.status !== 'completed').slice(0, 8)) {
      pushItem(items, {
        id: `receiving-${row.id}`,
        category: 'receiving',
        categoryLabel: CATEGORY_LABELS.receiving,
        title: 'Receiving not completed',
        message: `${row.id} · ${row.referencePoId ?? row.poId ?? 'PO'}`,
        path: '/inventory/receiving',
        active: true,
      })
    }
  }

  if (settings.notify_outslips) {
    for (const row of outslips
      .filter((o) => o.status === 'pending' || o.status === 'approved')
      .slice(0, 8)) {
      const title =
        row.status === 'pending' ? 'Outslip awaiting approval' : 'Outslip ready to dispatch'
      pushItem(items, {
        id: `outslip-${row.id}`,
        category: 'outslips',
        categoryLabel: CATEGORY_LABELS.outslips,
        title,
        message: `${row.id} · ${row.customerName ?? 'Customer'}`,
        path: `/outslip/${row.id}`,
        active: true,
      })
    }
  }

  if (settings.notify_deliveries) {
    for (const row of deliveryReceipts
      .filter((d) => d.status === 'out_for_delivery' || d.status === 'active')
      .slice(0, 8)) {
      pushItem(items, {
        id: `delivery-${row.id}`,
        category: 'deliveries',
        categoryLabel: CATEGORY_LABELS.deliveries,
        title: 'Delivery in progress',
        message: `${row.id} · ${row.customerName ?? 'Customer'}`,
        path: `/delivery-receipt/${row.id}`,
        active: true,
        status: row.status,
      })
    }
  }

  if (settings.notify_billing) {
    for (const row of billingStatements
      .filter((b) => b.paymentStatus !== 'paid')
      .slice(0, 8)) {
      pushItem(items, {
        id: `billing-${row.id}`,
        category: 'billing',
        categoryLabel: CATEGORY_LABELS.billing,
        title: row.paymentStatus === 'partially_paid' ? 'Billing partially paid' : 'Billing unpaid',
        message: `${row.id} · ${row.customerName ?? 'Customer'}`,
        path: '/billing',
        active: true,
      })
    }
  }

  return items
}

export { CATEGORY_LABELS }
