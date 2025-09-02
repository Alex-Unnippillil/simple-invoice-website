async function fetchInvoices() {
  const res = await fetch('/api/invoices');
  const invoices = await res.json();
  const list = document.getElementById('invoice-list');
  list.innerHTML = '';
  invoices.forEach(inv => {
    const li = document.createElement('li');
    li.textContent = `${inv.client} - $${inv.amount} - ${inv.status}`;
    const payBtn = document.createElement('button');
    payBtn.textContent = 'Mark Paid';
    payBtn.onclick = async () => {
      await fetch(`/api/invoices/${inv.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'paid' }),
      });
      fetchInvoices();
    };
    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.onclick = async () => {
      await fetch(`/api/invoices/${inv.id}`, { method: 'DELETE' });
      fetchInvoices();
    };
    li.append(' ', payBtn, ' ', delBtn);
    list.appendChild(li);
  });
}

document.getElementById('create-form').addEventListener('submit', async e => {
  e.preventDefault();
  const form = e.target;
  const data = Object.fromEntries(new FormData(form).entries());
  data.amount = parseFloat(data.amount);
  await fetch('/api/invoices', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  form.reset();
  fetchInvoices();
});

fetchInvoices();
