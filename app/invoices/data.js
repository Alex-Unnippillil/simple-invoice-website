export async function getInvoices() {
  const res = await fetch('http://localhost:3000/api/invoices', {
    next: { revalidate: 60, tags: ['invoices'] }
  });
  if (!res.ok) {
    throw new Error('Failed to fetch invoices');
  }
  return res.json();
}
