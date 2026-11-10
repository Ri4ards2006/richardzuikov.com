import { test, expect } from '@playwright/test';

test.describe('v6: Prop drift test', () => {
  test('record the bounding box of every [data-prop] at rest, scroll top->bottom->top 5x with fast page.mouse.wheel bursts of varying delta, wait 1 s, assert |Δ| <= 1 px', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    const propElements = page.locator('[data-prop]');
    const count = await propElements.count();
    // Must fail on current feat/atlus-menu (proves the bug / missing [data-prop] elements)
    expect(count, 'Expected [data-prop] elements to exist on the page').toBeGreaterThan(0);

    const initialBoxes = [];
    for (let i = 0; i < count; i++) {
      const box = await propElements.nth(i).boundingBox();
      expect(box, `Initial bounding box for [data-prop] index ${i} must not be null`).not.toBeNull();
      initialBoxes.push(box);
    }

    // Scroll top->bottom->top 5x with fast page.mouse.wheel bursts of varying delta
    const bursts = [450, 850, -350, 1100, -750, 500, -1200, 950, -600];
    for (let cycle = 0; cycle < 5; cycle++) {
      for (const delta of bursts) {
        await page.mouse.wheel(0, delta);
        await page.waitForTimeout(40);
      }
      // Scroll to bottom
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
      await page.waitForTimeout(80);
      // Scroll to top
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(80);
    }

    // Return to top and wait 1 s at rest
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1000);

    for (let i = 0; i < count; i++) {
      const finalBox = await propElements.nth(i).boundingBox();
      const initBox = initialBoxes[i];
      const deltaX = Math.abs(finalBox.x - initBox.x);
      const deltaY = Math.abs(finalBox.y - initBox.y);
      expect(deltaX, `[data-prop] index ${i} drifted horizontally by ${deltaX}px (expected <= 1px)`).toBeLessThanOrEqual(1);
      expect(deltaY, `[data-prop] index ${i} drifted vertically by ${deltaY}px (expected <= 1px)`).toBeLessThanOrEqual(1);
    }
  });
});

test.describe('v6: Menu layout and single visible list', () => {
  const VIEWPORTS = [
    { width: 1024, height: 768 },
    { width: 1280, height: 800 },
    { width: 1440, height: 900 },
    { width: 1920, height: 1080 },
    { width: 390, height: 844 },
  ];

  for (const vp of VIEWPORTS) {
    test(`exactly one visible list of menu items and MENU column does not intersect items at ${vp.width}x${vp.height}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1000);

      // 1. Before opening pause menu overlay: exactly one visible list of menu items (.stage-menu ul)
      const stageMenuList = page.locator('.stage-menu ul');
      expect(await stageMenuList.isVisible(), 'Stage menu list should be visible initially').toBe(true);
      expect(await page.locator('.gm-list').count(), 'Pause menu list should not be in DOM initially').toBe(0);

      // Open global pause menu overlay
      const menuButton = page.locator('.menu-dots').first();
      await expect(menuButton).toBeVisible();
      await menuButton.click();
      await page.waitForTimeout(400);

      const overlay = page.locator('.gm');
      await expect(overlay).toBeVisible();

      // 2. While pause menu is open: exactly one visible list of menu items (.gm-list).
      // .stage-menu must be hidden/not visible
      const isStageMenuVisible = await page.evaluate(() => {
        const el = document.querySelector('.stage-menu');
        if (!el) return false;
        const style = window.getComputedStyle(el);
        return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
      });
      expect(isStageMenuVisible, 'Stage menu must not be visible while pause menu is open').toBe(false);

      const gmList = page.locator('.gm-list');
      await expect(gmList).toBeVisible();

      // 3. MENU column and the menu items don't intersect
      const menuCol = page.locator('.gm-letters');
      await expect(menuCol).toBeVisible();

      const colBox = await menuCol.boundingBox();
      const itemsBox = await gmList.boundingBox();
      expect(colBox, 'MENU column bounding box must exist').not.toBeNull();
      expect(itemsBox, 'Menu items list bounding box must exist').not.toBeNull();

      const intersects = !(
        colBox.x + colBox.width <= itemsBox.x ||
        itemsBox.x + itemsBox.width <= colBox.x ||
        colBox.y + colBox.height <= itemsBox.y ||
        itemsBox.y + itemsBox.height <= colBox.y
      );

      expect(intersects, `MENU column (${JSON.stringify(colBox)}) and items list (${JSON.stringify(itemsBox)}) must not intersect at ${vp.width}x${vp.height}`).toBe(false);
    });
  }
});

test.describe('v6: Card image color filters', () => {
  test('card image computed filter is grayscale at rest and not grayscale on hover', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    const card = page.locator('.deck-card').first();
    const cardImg = card.locator('.deck-image img');
    await cardImg.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);

    // Filter at rest: must be grayscale
    const restFilter = await cardImg.evaluate((el) => window.getComputedStyle(el).filter);
    const restIsGrayscale = restFilter.includes('grayscale(1') || restFilter.includes('grayscale(100%)');
    expect(restIsGrayscale, `Expected card image at rest to be grayscale, but got: "${restFilter}"`).toBe(true);

    // Hover card: filter must NOT be grayscale
    await card.hover();
    await page.waitForTimeout(400);

    const hoverFilter = await cardImg.evaluate((el) => window.getComputedStyle(el).filter);
    const hoverIsGrayscale = hoverFilter.includes('grayscale(1') || hoverFilter.includes('grayscale(100%)');
    expect(hoverIsGrayscale, `Expected card image on hover to NOT be grayscale, but got: "${hoverFilter}"`).toBe(false);
  });

  test('touch emulation: the centered deck card is in color', async ({ browser }) => {
    const context = await browser.newContext({
      hasTouch: true,
      isMobile: true,
      viewport: { width: 390, height: 844 },
    });
    const page = await context.newPage();
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    const centeredCardImg = page.locator('.deck-card.is-selected .deck-image img');
    await centeredCardImg.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);

    const centeredFilter = await centeredCardImg.evaluate((el) => window.getComputedStyle(el).filter);
    const isGrayscale = centeredFilter.includes('grayscale(1') || centeredFilter.includes('grayscale(100%)');
    expect(isGrayscale, `Expected centered deck card under touch emulation to be in color, but got: "${centeredFilter}"`).toBe(false);

    await context.close();
  });
});

test.describe('v6: Career ride start layout', () => {
  test("the first role's title isn't clipped at ride start (fully in viewport, not occluded — elementFromPoint)", async ({ page }) => {
    if ((page.viewportSize()?.width || 0) < 768) {
      test.skip();
    }
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    const recordSection = page.locator('#record');
    await expect(recordSection).toBeAttached();
    await recordSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);

    // Align exactly to the start of the pinned ride (where the section pins and the timeline begins)
    const sectionTop = await recordSection.evaluate((el) => {
      const rect = el.getBoundingClientRect();
      return window.scrollY + rect.top - 64;
    });
    await page.evaluate((y) => window.scrollTo(0, y), sectionTop);
    await page.waitForTimeout(400);

    const firstRole = recordSection.locator('.record-item .record-role').first();
    await expect(firstRole).toBeVisible();

    // 1. Fully in viewport assertion
    const box = await firstRole.boundingBox();
    expect(box, 'First role title must have a valid bounding box').not.toBeNull();
    expect(box.x, 'First role title left edge must be within viewport (>= 0)').toBeGreaterThanOrEqual(0);
    expect(box.x + box.width, 'First role title right edge must be within viewport (<= 1440)').toBeLessThanOrEqual(1440);
    expect(box.y, 'First role title top edge must be within viewport (>= 0)').toBeGreaterThanOrEqual(0);
    expect(box.y + box.height, 'First role title bottom edge must be within viewport (<= 900)').toBeLessThanOrEqual(900);

    // 2. Not occluded assertion via document.elementFromPoint
    const isOccluded = await firstRole.evaluate((el) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const topEl = document.elementFromPoint(cx, cy);
      return !(topEl === el || el.contains(topEl) || topEl?.contains(el));
    });
    expect(isOccluded, 'First role title must not be occluded by another element at ride start').toBe(false);
  });
});
