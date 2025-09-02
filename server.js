const express = require('express');
const Stripe = require('stripe');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const auditLogPath = path.join(__dirname, 'logs', 'audit.log');

function logChange(action, details) {
  const entry = `${new Date().toISOString()} ${action} ${details}\n`;
  fs.appendFile(auditLogPath, entry, (err) => {
    if (err) console.error('Audit log write failed', err);
  });
}

app.post('/rules', async (req, res) => {
  const { ruleType, value } = req.body;
  let expression;
  if (ruleType === 'country') {
    expression = `:country_code in ["${value}"]`;
  } else if (ruleType === 'velocity') {
    expression = `card_payment.attempts_last_24_hours > ${value}`;
  } else {
    return res.status(400).json({ error: 'Unsupported rule type' });
  }
  try {
    const rule = await stripe.radar.rules.create({ expression, action: 'block' });
    logChange('rule_create', expression);
    res.json({ success: true, rule });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/rules/:id', async (req, res) => {
  const { ruleType, value } = req.body;
  let expression;
  if (ruleType === 'country') {
    expression = `:country_code in ["${value}"]`;
  } else if (ruleType === 'velocity') {
    expression = `card_payment.attempts_last_24_hours > ${value}`;
  } else {
    return res.status(400).json({ error: 'Unsupported rule type' });
  }
  try {
    const rule = await stripe.radar.rules.update(req.params.id, { expression });
    logChange('rule_update', `${req.params.id} ${expression}`);
    res.json({ success: true, rule });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

async function ensureList(alias, name) {
  const lists = await stripe.radar.valueLists.list({ limit: 100 });
  const existing = lists.data.find((l) => l.alias === alias);
  if (existing) return existing.id;
  const created = await stripe.radar.valueLists.create({ alias, name, item_type: 'email' });
  return created.id;
}

app.post('/list', async (req, res) => {
  const { listType, email } = req.body;
  const alias = listType === 'allow' ? 'tenant_allow_list' : 'tenant_deny_list';
  const name = listType === 'allow' ? 'Tenant Allow List' : 'Tenant Deny List';
  try {
    const listId = await ensureList(alias, name);
    const item = await stripe.radar.valueListItems.create({ value_list: listId, value: email });
    logChange(`${listType}_list_add`, email);
    res.json({ success: true, item });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
