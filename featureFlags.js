const flags = {
  ENABLE_AUTOPAY: process.env.ENABLE_AUTOPAY === 'true',
  ENABLE_ACH_PAYMENTS: process.env.ENABLE_ACH_PAYMENTS === 'true',
  ENABLE_NEW_SEARCH: process.env.ENABLE_NEW_SEARCH === 'true',
};

module.exports = flags;
