const {
  addRecurringCharge,
  addAdjustment,
  getUpcomingCharges
} = require('./models');

// Seed data
addRecurringCharge({ leaseId: '1', description: 'Rent', amount: 1000, cadence: 'monthly' });
addAdjustment({ leaseId: '1', description: 'Late fee', amount: 50 });

const charges = getUpcomingCharges('1');
console.log('Upcoming charges count:', charges.length);
console.log(charges.map(c => `${c.description}:${c.amount}`).join(','));
