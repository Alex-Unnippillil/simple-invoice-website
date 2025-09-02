const { test, expect } = require('@playwright/test');
const { AxeBuilder } = require('@axe-core/playwright');

async function checkCriticalAccessibility(page, path) {
  await page.goto(path);
  const results = await new AxeBuilder({ page }).analyze();
  const critical = results.violations.filter(v => v.impact === 'critical');
  expect(critical, `Critical violations: ${critical.map(v => v.id).join(', ')}`).toEqual([]);
}

test('login page has no critical accessibility violations', async ({ page }) => {
  await checkCriticalAccessibility(page, '/login');
});

test('payment page has no critical accessibility violations', async ({ page }) => {
  await checkCriticalAccessibility(page, '/pay');
});

test('receipts page has no critical accessibility violations', async ({ page }) => {
  await checkCriticalAccessibility(page, '/receipts');
});
