import { test, expect } from '@playwright/test';

const baseUrl = process.env.APP_URL;
const userEmail = process.env.TEST_USER_EMAIL;
const userPassword = process.env.TEST_USER_PASSWORD;

// Skip all tests if base URL or credentials are not provided
const shouldSkip = !baseUrl || !userEmail || !userPassword;

test.describe('Invoice payment flow', () => {
  test.beforeEach(() => {
    test.skip(shouldSkip, 'APP_URL, TEST_USER_EMAIL and TEST_USER_PASSWORD must be set');
  });

  test('login and navigate to dashboard', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', userEmail!);
    await page.fill('input[name="password"]', userPassword!);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('view invoice and complete Stripe test payment', async ({ page }) => {
    await page.goto('/invoices/1');
    await page.click('text=Pay with Card');
    const stripe = page.frameLocator('iframe[name^="__privateStripeFrame"]');
    await stripe.locator('input[placeholder="Card number"]').fill('4242 4242 4242 4242');
    await stripe.locator('input[placeholder="MM / YY"]').fill('12 / 34');
    await stripe.locator('input[placeholder="CVC"]').fill('123');
    await stripe.locator('input[placeholder="ZIP"]').fill('12345');
    await stripe.locator('text=Pay').click();
    await expect(page).toHaveURL(/.*receipt/);
  });

  test('view and print receipt', async ({ page }) => {
    await page.goto('/receipts/1');
    const pdf = await page.pdf();
    expect(pdf.byteLength).toBeGreaterThan(0);
  });
});
