import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const ROUTES = [
  { path: '/', name: 'home' },
  { path: '/quick', name: 'quick' },
  { path: '/stack', name: 'stack' },
  { path: '/career', name: 'career' },
  { path: '/impressum', name: 'impressum' },
  { path: '/datenschutz', name: 'datenschutz' },
  { path: '/this-route-does-not-exist-404', name: 'unknown-route' },
];

test.describe('Routes rendering without console errors', () => {
  for (const route of ROUTES) {
    test(`renders route ${route.path} without console errors`, async ({ page }, testInfo) => {
      const consoleErrors = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });

      await page.goto(route.path, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1000);

      // Verify zero console errors occurred
      expect(consoleErrors).toEqual([]);

      // Verify page content rendered
      await expect(page.locator('body')).toBeVisible();

      // Take screenshot for artifacts
      const width = page.viewportSize()?.width || 1440;
      const height = page.viewportSize()?.height || 900;
      const screenshotsDir = path.join(process.cwd(), 'screenshots');
      if (!fs.existsSync(screenshotsDir)) {
        fs.mkdirSync(screenshotsDir, { recursive: true });
      }

      await page.screenshot({
        path: path.join(screenshotsDir, `${route.name}-${width}x${height}.png`),
      });
    });
  }
});

test.describe('Atlus Menu interactions', () => {
  test('opens the "…" menu and closes it with Esc key', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    // Find the "…" menu trigger button
    const menuButton = page.locator('button.menu-dots, button[aria-label*="Menu" i], button[aria-label*="Menü" i]').first();
    await expect(menuButton).toBeVisible();

    // Click to open menu
    await menuButton.click();
    await page.waitForTimeout(500);

    // Verify menu overlay is open
    const menuOverlay = page.locator('.gm-panel, .gm-list, [aria-label*="Menu" i]').first();
    await expect(menuOverlay).toBeVisible();

    // Press Escape key to close the menu
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);

    // Verify menu is closed
    await expect(page.locator('.gm-panel')).toHaveCount(0);
  });
});

test.describe('Contact navigation to Bonfire', () => {
  test('clicking CONTACT lands on the bonfire section', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);

    // Open menu
    const menuButton = page.locator('button.menu-dots, button[aria-label*="Menu" i], button[aria-label*="Menü" i]').first();
    await menuButton.click();
    await page.waitForTimeout(500);

    // Find and click CONTACT
    const contactItem = page.locator('.gm-list a, .gm-list button').filter({ hasText: /contact|kontakt/i }).first();
    await contactItem.click();
    await page.waitForTimeout(1500);

    // Verify that we land on #bonfire or the bonfire section is reached
    const bonfireSection = page.locator('#bonfire');
    await expect(bonfireSection).toBeAttached();

    // Capture screenshot of bonfire landing
    const width = page.viewportSize()?.width || 1440;
    const height = page.viewportSize()?.height || 900;
    const screenshotsDir = path.join(process.cwd(), 'screenshots');
    await page.screenshot({
      path: path.join(screenshotsDir, `bonfire-landing-${width}x${height}.png`),
    });
  });
});
