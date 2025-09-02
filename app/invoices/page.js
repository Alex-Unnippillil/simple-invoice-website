import { getInvoices } from './data';

export default async function InvoicesPage() {
  const invoices = await getInvoices();
  return (
    <main>
      <h1>Invoices</h1>
      <ul>
        {invoices.map((inv) => (
          <li key={inv.id}>
            {inv.customer}: ${inv.amount}
          </li>
        ))}
      </ul>
    </main>
  );
}
