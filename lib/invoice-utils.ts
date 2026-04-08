export type InvoiceLineItem = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
};

export function emptyItem(): InvoiceLineItem {
  return {
    id: crypto.randomUUID(),
    description: '',
    quantity: 1,
    unitPrice: 0,
  };
}

export function isoDate(d: string | Date): string {
  return new Date(d).toISOString().split('T')[0];
}

export function todayIso(): string {
  return new Date().toISOString().split('T')[0];
}

export function inDaysIso(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().split('T')[0];
}

export function computeTotals(
  items: InvoiceLineItem[],
  tax: number,
): { subtotal: number; taxAmount: number; total: number } {
  const subtotal = items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
  const taxAmount = (subtotal * tax) / 100;
  return { subtotal, taxAmount, total: subtotal + taxAmount };
}
