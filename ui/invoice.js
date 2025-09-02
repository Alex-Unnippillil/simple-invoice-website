document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('invoice-form');
  const invoiceCurrency = document.getElementById('invoice-currency');
  const itemsContainer = document.getElementById('items');
  const warning = document.getElementById('fx-warning');
  const submitButton = form.querySelector('button[type="submit"]');

  function checkCurrencies() {
    const baseCurrency = invoiceCurrency.value;
    const itemCurrencies = itemsContainer.querySelectorAll('.currency');
    let mixed = false;
    itemCurrencies.forEach(select => {
      if (select.value !== baseCurrency) {
        mixed = true;
      }
    });

    if (mixed) {
      warning.style.display = 'block';
      submitButton.disabled = true;
    } else {
      warning.style.display = 'none';
      submitButton.disabled = false;
    }
  }

  invoiceCurrency.addEventListener('change', checkCurrencies);
  itemsContainer.addEventListener('change', checkCurrencies);
  form.addEventListener('submit', (e) => {
    checkCurrencies();
    if (submitButton.disabled) {
      e.preventDefault();
    }
  });
});
