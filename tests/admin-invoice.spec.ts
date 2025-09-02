import { test, expect } from '@playwright/test';

/**
 * End-to-end flow: admin triggers invoice creation and marks it as sent,
 * tenant can view updated timeline.
 */
test('admin invoice lifecycle visible to tenant', async ({ page }) => {
  // Admin login - for this demo app, admin page is open
  await page.goto('/admin.html');
  await expect(page).toHaveTitle(/Admin/);

  // Simulate invoice creation
  await page.evaluate(() =>
    fetch('/webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leaseId: '1', status: 'created' }),
    })
  );

  // Mark invoice as sent
  await page.evaluate(() =>
    fetch('/webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leaseId: '1', status: 'sent' }),
    })
  );

  // Tenant views timeline
  await page.goto('/lease.html?id=1');
  const timeline = page.locator('#timeline');
  await expect(timeline).toContainText('created');
  await expect(timeline).toContainText('sent');
});
