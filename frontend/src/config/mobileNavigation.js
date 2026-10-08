import {
  Award,
  FileText,
  Home,
  Package,
  ShoppingCart,
  Truck
} from "lucide-react";
const mobileDrawerSectionLabels = {
  transactions: "Transactions"
};
const mobileDrawerItems = [
  { label: "Dashboard", path: "/", icon: Home, end: true, section: "main" },
  { label: "Quotations", path: "/quotations", icon: FileText, section: "transactions" },
  { label: "Purchase Orders", path: "/purchase-order", icon: ShoppingCart, section: "transactions" },
  { label: "Outslips", path: "/outslip", icon: Package, section: "transactions" },
  { label: "Delivery Receipts", path: "/delivery-receipt", icon: Truck, section: "transactions" },
  { label: "Accomplishments", path: "/reports/accomplishment", icon: Award, section: "transactions" }
];
export {
  mobileDrawerItems,
  mobileDrawerSectionLabels
};
