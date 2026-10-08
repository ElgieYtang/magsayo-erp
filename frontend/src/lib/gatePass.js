export function canPrintGatePass(status) {
  return ['approved', 'for_dispatch', 'released'].includes(status)
}
