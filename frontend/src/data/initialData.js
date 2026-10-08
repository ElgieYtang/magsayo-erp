import {
  companyInfo,
  setupBranches,
  setupBrands,
  setupCategories,
  setupItems,
  setupModels,
  setupPositions,
  setupProjects,
  setupUnits,
  setupUsers,
  setupCompanies
} from "@/data/setupData";
const initialDemoState = {
  workflowStage: "billing",
  customers: [
    {
      id: "cust-abc",
      code: "CUS-001",
      name: "ABC Corporation",
      contactPerson: "Juan Dela Cruz",
      phone: "0917-123-4567",
      email: "juan@abccorporation.example",
      address: "Cebu City, Cebu",
      tinNo: "123-456-789-000",
      terms: "30",
      termsType: "Days"
    },
    {
      id: "cust-cbs",
      code: "CUS-002",
      name: "Cebu Business Solutions",
      contactPerson: "Maria Santos",
      phone: "0918-234-5678",
      email: "maria@cebusolutions.example",
      address: "Cebu City, Cebu",
      tinNo: "234-567-890-000",
      terms: "15",
      termsType: "Days"
    },
    {
      id: "cust-pacific",
      code: "CUS-003",
      name: "Pacific Office Supplies",
      contactPerson: "Carlo Reyes",
      phone: "0919-345-6789",
      email: "carlo@pacificoffice.example",
      address: "Mandaue City, Cebu",
      tinNo: "345-678-901-000",
      terms: "30",
      termsType: "Days"
    },
    {
      id: "cust-metro",
      code: "CUS-004",
      name: "MetroTech Solutions",
      contactPerson: "Angela Garcia",
      phone: "0920-456-7890",
      email: "angela@metrotech.example",
      address: "Lapu-Lapu City, Cebu",
      tinNo: "456-789-012-000",
      terms: "45",
      termsType: "Days"
    }
  ],
  suppliers: [
    {
      id: "sup-global",
      name: "Global Office Supply",
      contactPerson: "Mark Wilson",
      phone: "0917-555-1001",
      email: "mark@globaloffice.example"
    },
    {
      id: "sup-cebu",
      name: "Cebu Industrial Trading",
      contactPerson: "Robert Tan",
      phone: "0918-555-1002",
      email: "robert@cebuindustrial.example"
    },
    {
      id: "sup-tech",
      name: "TechSource Philippines",
      contactPerson: "Kevin Lim",
      phone: "0919-555-1003",
      email: "kevin@techsource.example"
    }
  ],
  products: [
    {
      id: "prod-laptop",
      name: "Laptop Computer",
      sku: "LAP-001",
      category: "Computer Equipment",
      unit: "pcs",
      price: 4e4,
      stock: 42,
      reorderLevel: 10,
      status: "In Stock"
    },
    {
      id: "prod-desktop",
      name: "Desktop Computer",
      sku: "DES-001",
      category: "Computer Equipment",
      unit: "pcs",
      price: 35e3,
      stock: 25,
      reorderLevel: 10,
      status: "In Stock"
    },
    {
      id: "prod-monitor",
      name: "24-inch Monitor",
      sku: "MON-001",
      category: "Computer Equipment",
      unit: "pcs",
      price: 12500,
      stock: 8,
      reorderLevel: 10,
      status: "Low Stock"
    },
    {
      id: "prod-printer",
      name: "Laser Printer",
      sku: "PRN-001",
      category: "Office Equipment",
      unit: "pcs",
      price: 18500,
      stock: 15,
      reorderLevel: 5,
      status: "In Stock"
    },
    {
      id: "prod-chair",
      name: "Office Chair",
      sku: "CHR-001",
      category: "Office Furniture",
      unit: "pcs",
      price: 6500,
      stock: 30,
      reorderLevel: 10,
      status: "In Stock"
    },
    {
      id: "prod-switch",
      name: "Network Switch",
      sku: "NET-001",
      category: "Networking",
      unit: "pcs",
      price: 8500,
      stock: 12,
      reorderLevel: 5,
      status: "In Stock"
    }
  ],
  stockMovements: [
    {
      id: "sm-1",
      productId: "prod-laptop",
      date: "August 18, 2026",
      reference: "REC-00001",
      type: "Receiving",
      change: 10,
      balance: 52
    },
    {
      id: "sm-2",
      productId: "prod-laptop",
      date: "August 17, 2026",
      reference: "OS-00001",
      type: "Outslip",
      change: -10,
      balance: 42
    },
    {
      id: "sm-3",
      productId: "prod-laptop",
      date: "August 15, 2026",
      reference: "REC-00005",
      type: "Receiving",
      change: 20,
      balance: 52
    }
  ],
  quotations: [
    {
      id: "QTN-00001",
      customerId: "cust-abc",
      date: "August 18, 2026",
      validUntil: "September 18, 2026",
      items: [
        {
          productId: "prod-laptop",
          productName: "Laptop Computer",
          quantity: 10,
          unitPrice: 4e4
        }
      ],
      total: 4e5,
      status: "approved",
      terms: "Payment due within 30 days. Prices valid for 30 days from quotation date.",
      preparedBy: "Admin User",
      approvedBy: "Manager"
    },
    {
      id: "QTN-00002",
      customerId: "cust-cbs",
      date: "August 17, 2026",
      validUntil: "September 17, 2026",
      items: [
        {
          productId: "prod-desktop",
          productName: "Desktop Computer",
          quantity: 5,
          unitPrice: 35e3
        }
      ],
      total: 175e3,
      status: "pending",
      terms: "Payment due within 30 days.",
      preparedBy: "Admin User"
    },
    {
      id: "QTN-00003",
      customerId: "cust-pacific",
      date: "August 16, 2026",
      validUntil: "September 16, 2026",
      items: [
        {
          productId: "prod-printer",
          productName: "Laser Printer",
          quantity: 4,
          unitPrice: 18500
        }
      ],
      total: 74e3,
      status: "approved",
      terms: "Payment due within 30 days.",
      preparedBy: "Admin User",
      approvedBy: "Manager"
    },
    {
      id: "QTN-00004",
      customerId: "cust-metro",
      date: "August 15, 2026",
      validUntil: "September 15, 2026",
      items: [
        {
          productId: "prod-switch",
          productName: "Network Switch",
          quantity: 5,
          unitPrice: 8500
        }
      ],
      total: 42500,
      status: "rejected",
      terms: "Payment due within 30 days.",
      preparedBy: "Admin User"
    }
  ],
  purchaseOrders: [
    {
      id: "PO-00001",
      referenceQuotationId: "QTN-00001",
      supplierId: "sup-tech",
      date: "August 18, 2026",
      items: [
        {
          productId: "prod-laptop",
          productName: "Laptop Computer",
          quantity: 10,
          unitPrice: 4e4
        }
      ],
      total: 4e5,
      status: "fully_received"
    },
    {
      id: "PO-00002",
      referenceQuotationId: "QTN-00003",
      supplierId: "sup-global",
      date: "August 17, 2026",
      items: [
        {
          productId: "prod-printer",
          productName: "Laser Printer",
          quantity: 4,
          unitPrice: 18500
        }
      ],
      total: 74e3,
      status: "approved"
    },
    {
      id: "PO-00003",
      supplierId: "sup-cebu",
      date: "August 16, 2026",
      items: [
        {
          productId: "prod-desktop",
          productName: "Desktop Computer",
          quantity: 5,
          unitPrice: 35e3
        }
      ],
      total: 175e3,
      status: "pending"
    }
  ],
  receivings: [
    {
      id: "REC-00001",
      purchaseOrderId: "PO-00001",
      supplierId: "sup-tech",
      date: "August 18, 2026",
      items: [
        {
          productId: "prod-laptop",
          productName: "Laptop Computer",
          quantity: 10,
          unitPrice: 4e4,
          ordered: 10,
          received: 10,
          remaining: 0
        }
      ],
      status: "completed"
    },
    {
      id: "REC-00002",
      purchaseOrderId: "PO-00002",
      supplierId: "sup-global",
      date: "August 17, 2026",
      items: [
        {
          productId: "prod-printer",
          productName: "Laser Printer",
          quantity: 4,
          unitPrice: 18500,
          ordered: 4,
          received: 2,
          remaining: 2
        }
      ],
      status: "partial"
    }
  ],
  outslips: [
    {
      id: "OS-00001",
      customerId: "cust-abc",
      referencePoId: "PO-00001",
      date: "August 19, 2026",
      items: [
        {
          productId: "prod-laptop",
          productName: "Laptop Computer",
          quantity: 10,
          unitPrice: 4e4
        }
      ],
      status: "for_dispatch"
    },
    {
      id: "OS-00002",
      customerId: "cust-cbs",
      referencePoId: "PO-00003",
      date: "August 18, 2026",
      items: [
        {
          productId: "prod-desktop",
          productName: "Desktop Computer",
          quantity: 5,
          unitPrice: 35e3
        }
      ],
      status: "approved"
    },
    {
      id: "OS-00003",
      customerId: "cust-pacific",
      referencePoId: "PO-00002",
      date: "August 18, 2026",
      items: [
        {
          productId: "prod-printer",
          productName: "Laser Printer",
          quantity: 4,
          unitPrice: 18500
        }
      ],
      status: "for_dispatch"
    }
  ],
  deliveryReceipts: [
    {
      id: "DR-00001",
      customerId: "cust-abc",
      referenceOutslipId: "OS-00001",
      date: "August 19, 2026",
      deliveryAddress: "Cebu City, Cebu",
      driver: "Pedro Santos",
      vehicle: "ABC-1234",
      status: "active"
    },
    {
      id: "DR-00002",
      customerId: "cust-cbs",
      referenceOutslipId: "OS-00002",
      date: "August 16, 2026",
      deliveryAddress: "Cebu City, Cebu",
      driver: "Ramon Cruz",
      vehicle: "XYZ-5678",
      status: "out_for_delivery"
    }
  ],
  billingStatements: [
    {
      id: "BS-00001",
      customerId: "cust-abc",
      referenceDrId: "DR-00001",
      billingDate: "August 17, 2026",
      dueDate: "September 17, 2026",
      amount: 4e5,
      paymentStatus: "unpaid",
      paidAmount: 0
    },
    {
      id: "BS-00002",
      customerId: "cust-cbs",
      referenceDrId: "DR-00002",
      billingDate: "August 16, 2026",
      dueDate: "September 16, 2026",
      amount: 175e3,
      paymentStatus: "partially_paid",
      paidAmount: 1e5
    },
    {
      id: "BS-00003",
      customerId: "cust-pacific",
      billingDate: "August 15, 2026",
      dueDate: "September 15, 2026",
      amount: 74e3,
      paymentStatus: "paid",
      paidAmount: 74e3
    }
  ],
  soaPayments: [
    {
      id: "PAY-00001",
      customerId: "cust-abc",
      date: "August 19, 2026",
      reference: "PAY-00001",
      amount: 1e5,
      description: "Payment"
    }
  ],
  supplierPayments: [
    {
      id: "SPAY-00001",
      supplierId: "sup-tech",
      date: "August 19, 2026",
      reference: "CHK-00001",
      amount: 2e5,
      description: "Partial payment for PO-00001"
    },
    {
      id: "SPAY-00002",
      supplierId: "sup-global",
      date: "August 18, 2026",
      reference: "CHK-00002",
      amount: 74e3,
      description: "Payment for PO-00002"
    }
  ],
  accomplishmentReports: [
    {
      id: "AR-00001",
      periodStart: "August 1, 2026",
      periodEnd: "August 19, 2026",
      totalQuotations: 4,
      approvedQuotations: 2,
      purchaseOrders: 3,
      receivingTransactions: 2,
      outslips: 2,
      deliveryReceipts: 2,
      billingStatements: 3,
      completedDeliveries: 1,
      remarks: "Transactions processed during the reporting period."
    }
  ],
  setupCompanies,
  setupUsers,
  setupBranches,
  setupProjects,
  setupPositions,
  setupCategories,
  setupBrands,
  setupModels,
  setupUnits,
  setupItems,
  companyInfo
};
export {
  initialDemoState
};
