const invoice = {
  number: 'INV-001',
  status: 'PAID',
  items: [
    { description: 'September Rent', amount: 1200 },
    { description: 'Utilities', amount: 150 }
  ],
  payment: {
    date: '2025-09-01',
    method: 'Credit Card',
    reference: 'TX12345'
  }
};

function renderInvoice() {
  document.getElementById('invoice-number').textContent = invoice.number;
  document.getElementById('invoice-status').textContent = invoice.status;

  const tbody = document.querySelector('#items tbody');
  invoice.items.forEach(item => {
    const tr = document.createElement('tr');
    const tdDesc = document.createElement('td');
    tdDesc.textContent = item.description;
    const tdAmount = document.createElement('td');
    tdAmount.textContent = `$${item.amount.toFixed(2)}`;
    tr.appendChild(tdDesc);
    tr.appendChild(tdAmount);
    tbody.appendChild(tr);
  });

  const total = invoice.items.reduce((sum, item) => sum + item.amount, 0);
  document.getElementById('total').textContent = total.toFixed(2);

  if (invoice.status === 'PAID') {
    document.getElementById('actions').classList.remove('hidden');
    const pm = document.getElementById('payment-metadata');
    pm.classList.remove('hidden');
    document.getElementById('payment-date').textContent = invoice.payment.date;
    document.getElementById('payment-method').textContent = invoice.payment.method;
    document.getElementById('payment-reference').textContent = invoice.payment.reference;
  }
}

renderInvoice();

document.getElementById('print-btn').addEventListener('click', () => {
  window.print();
});

document.getElementById('pdf-btn').addEventListener('click', async () => {
  const { jsPDF } = window.jspdf;
  const invoiceElement = document.getElementById('invoice');
  const canvas = await html2canvas(invoiceElement);
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF();
  const imgProps = pdf.getImageProperties(imgData);
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  pdf.save(`${invoice.number}.pdf`);
});
