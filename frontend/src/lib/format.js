function formatCurrency(amount) {
  return `\u20B1${amount.toLocaleString("en-PH")}`;
}
function formatDate(date) {
  return date;
}
function lineTotal(item) {
  return item.quantity * item.unitPrice;
}
function calcTotal(items) {
  return items.reduce((sum, i) => sum + lineTotal(i), 0);
}
export {
  calcTotal,
  formatCurrency,
  formatDate,
  lineTotal
};
