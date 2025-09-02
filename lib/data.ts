export const invoices = [
  { id: 1, amount: 100, description: 'January rent' },
  { id: 2, amount: 100, description: 'February rent' }
];

export const demoUser = {
  id: 1,
  name: 'Demo User',
  invoices
};

export function toCSV(items: Record<string, any>[]): string {
  if (!items.length) return '';
  const headers = Object.keys(items[0]);
  const lines = items.map(item =>
    headers.map(h => JSON.stringify(item[h] ?? '')).join(',')
  );
  return [headers.join(','), ...lines].join('\n');
}
