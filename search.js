const flags = require('./featureFlags');

function searchInvoices(term, invoices) {
  if (!flags.ENABLE_NEW_SEARCH) {
    // Fallback: return unfiltered list
    return invoices;
  }
  return invoices.filter(inv => inv.toLowerCase().includes(term.toLowerCase()));
}

module.exports = { searchInvoices };
