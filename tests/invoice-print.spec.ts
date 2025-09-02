import { test, expect } from '@playwright/test';
import path from 'path';

// Utility to get absolute path to invoice.html
const invoicePath = path.join(__dirname, '..', 'invoice.html');

// Dimensions for A4 and US Letter in pixels at 96 DPI
const sizes = [
  { name: 'A4', width: 794, height: 1123 },
  { name: 'Letter', width: 816, height: 1056 }
];

test('invoice print preview hides navigation and fits standard paper', async ({ page }) => {
  await page.goto('file://' + invoicePath);
  await page.emulateMedia({ media: 'print' });

  // Generate print preview PDF (buffer) to ensure page is printable
  await page.pdf({ format: 'A4' });

  // Navigation should be hidden in print mode
  await expect(page.locator('nav')).toBeHidden();

  for (const size of sizes) {
    await page.setViewportSize({ width: size.width, height: size.height });

    // Ensure content does not overflow the page dimensions
    const bodySize = await page.evaluate(() => ({
      width: document.body.scrollWidth,
      height: document.body.scrollHeight
    }));

    expect(bodySize.width, `${size.name} width overflow`).toBeLessThanOrEqual(size.width);
    expect(bodySize.height, `${size.name} height overflow`).toBeLessThanOrEqual(size.height);

    // Totals section should be fully visible (not clipped)
    const totalsBox = await page.locator('#totals').boundingBox();
    expect(totalsBox, `${size.name} totals not found`).not.toBeNull();
    if (totalsBox) {
      expect(totalsBox.y + totalsBox.height, `${size.name} totals clipped`).toBeLessThanOrEqual(size.height);
    }
  }
});
