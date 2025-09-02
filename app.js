function loadInvoices() {
  const list = document.getElementById('invoice-list');
  const empty = document.getElementById('list-empty');
  const error = document.getElementById('list-error');

  // simulate loading delay
  setTimeout(() => {
    list.classList.remove('skeleton');
    list.innerHTML = '';
    const fail = Math.random() < 0.2; // 20% chance of failure
    if (fail) {
      error.textContent = 'Failed to load invoices.';
      error.classList.remove('hidden');
      return;
    }
    const invoices = [];
    if (invoices.length === 0) {
      empty.classList.remove('hidden');
    } else {
      invoices.forEach(inv => {
        const li = document.createElement('li');
        li.textContent = `${inv.customer} - $${inv.amount}`;
        list.appendChild(li);
      });
    }
  }, 1500);
}

function setupForm() {
  const form = document.getElementById('invoice-form');
  const list = document.getElementById('invoice-list');
  const empty = document.getElementById('list-empty');
  const formError = document.getElementById('form-error');

  form.addEventListener('submit', e => {
    e.preventDefault();
    formError.classList.add('hidden');
    document.querySelectorAll('.error-message').forEach(s => s.textContent = '');

    const customer = document.getElementById('customer');
    const amount = document.getElementById('amount');
    const errors = {};
    if (!customer.value.trim()) errors.customer = 'Customer name is required.';
    if (!amount.value) errors.amount = 'Amount is required.';

    if (Object.keys(errors).length) {
      Object.entries(errors).forEach(([key, msg]) => {
        const span = document.querySelector(`.error-message[data-for="${key}"]`);
        if (span) span.textContent = msg;
      });
      return;
    }

    form.classList.add('submitting');
    setTimeout(() => {
      form.classList.remove('submitting');
      const fail = Math.random() < 0.2;
      if (fail) {
        formError.textContent = 'Unable to save invoice. Please try again.';
        formError.classList.remove('hidden');
        return;
      }
      const li = document.createElement('li');
      li.textContent = `${customer.value} - $${parseFloat(amount.value).toFixed(2)}`;
      list.appendChild(li);
      empty.classList.add('hidden');
      form.reset();
    }, 1000);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadInvoices();
  setupForm();
});
