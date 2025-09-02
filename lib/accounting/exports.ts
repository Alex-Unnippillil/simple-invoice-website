export interface Invoice {
  id: string;
  customer: string;
  issueDate: string; // ISO date
  dueDate: string;   // ISO date
  item: string;
  quantity: number;
  rate: number;
}

function escapeCSV(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return '"' + value.replace(/"/g, '""') + '"';
  }
  return value;
}

function toCSV(headers: string[], rows: string[][]): string {
  const data = [headers, ...rows];
  return data.map(row => row.map(escapeCSV).join(',')).join('\n');
}

export function exportQuickBooksCSV(invoices: Invoice[]): string {
  const headers = [
    'Invoice Number',
    'Customer',
    'Invoice Date',
    'Due Date',
    'Item',
    'Qty',
    'Rate',
    'Amount'
  ];

  const rows = invoices.map(inv => [
    inv.id,
    inv.customer,
    inv.issueDate,
    inv.dueDate,
    inv.item,
    inv.quantity.toString(),
    inv.rate.toFixed(2),
    (inv.quantity * inv.rate).toFixed(2)
  ]);

  return toCSV(headers, rows);
}

export function exportXeroCSV(invoices: Invoice[]): string {
  const headers = [
    'Contact Name',
    'Invoice Number',
    'Invoice Date',
    'Due Date',
    'Item Code',
    'Description',
    'Quantity',
    'Unit Amount',
    'Account Code',
    'Tax Type'
  ];

  const rows = invoices.map(inv => [
    inv.customer,
    inv.id,
    inv.issueDate,
    inv.dueDate,
    inv.item,
    inv.item,
    inv.quantity.toString(),
    inv.rate.toFixed(2),
    '',
    'NONE'
  ]);

  return toCSV(headers, rows);
}
