const { v4: uuidv4 } = require('uuid');

class RecurringCharge {
  constructor({ id = uuidv4(), leaseId, description, amount, cadence }) {
    this.id = id;
    this.leaseId = leaseId;
    this.description = description;
    this.amount = amount;
    this.cadence = cadence; // 'monthly' | 'weekly' | 'daily'
  }
}

class Adjustment {
  constructor({ id = uuidv4(), leaseId, description, amount }) {
    this.id = id;
    this.leaseId = leaseId;
    this.description = description;
    this.amount = amount; // positive or negative
  }
}

const leases = [
  { id: '1', tenant: 'John Doe' }
];

const recurringCharges = [];
const adjustments = [];

function listRecurringCharges(leaseId) {
  return recurringCharges.filter(rc => rc.leaseId === leaseId);
}

function listAdjustments(leaseId) {
  return adjustments.filter(adj => adj.leaseId === leaseId);
}

function addRecurringCharge(data) {
  const charge = new RecurringCharge(data);
  recurringCharges.push(charge);
  return charge;
}

function updateRecurringCharge(id, data) {
  const idx = recurringCharges.findIndex(c => c.id === id);
  if (idx === -1) return null;
  recurringCharges[idx] = { ...recurringCharges[idx], ...data };
  return recurringCharges[idx];
}

function deleteRecurringCharge(id) {
  const idx = recurringCharges.findIndex(c => c.id === id);
  if (idx !== -1) recurringCharges.splice(idx, 1);
}

function addAdjustment(data) {
  const adj = new Adjustment(data);
  adjustments.push(adj);
  return adj;
}

function updateAdjustment(id, data) {
  const idx = adjustments.findIndex(a => a.id === id);
  if (idx === -1) return null;
  adjustments[idx] = { ...adjustments[idx], ...data };
  return adjustments[idx];
}

function deleteAdjustment(id) {
  const idx = adjustments.findIndex(a => a.id === id);
  if (idx !== -1) adjustments.splice(idx, 1);
}

function getUpcomingCharges(leaseId, startDate = new Date(), months = 3) {
  const charges = [];
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + months);

  listRecurringCharges(leaseId).forEach(rc => {
    let current = new Date(startDate);
    while (current < endDate) {
      charges.push({
        date: new Date(current),
        description: rc.description,
        amount: rc.amount,
        type: 'recurring',
        id: rc.id
      });
      if (rc.cadence === 'weekly') current.setDate(current.getDate() + 7);
      else if (rc.cadence === 'daily') current.setDate(current.getDate() + 1);
      else current.setMonth(current.getMonth() + 1); // default monthly
    }
  });

  listAdjustments(leaseId).forEach(adj => {
    charges.push({
      date: new Date(startDate),
      description: adj.description,
      amount: adj.amount,
      type: 'adjustment',
      id: adj.id
    });
  });

  charges.sort((a, b) => a.date - b.date);
  return charges;
}

module.exports = {
  RecurringCharge,
  Adjustment,
  leases,
  addRecurringCharge,
  updateRecurringCharge,
  deleteRecurringCharge,
  addAdjustment,
  updateAdjustment,
  deleteAdjustment,
  listRecurringCharges,
  listAdjustments,
  getUpcomingCharges
};
