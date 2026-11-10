import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const ROUTES = [
  { path: '/', name: 'home' },
  { path: '/quick', name: 'quick' },
  { path: '/about', name: 'about' },
  { path: '/stack', name: 'stack' },
  { path: '/career', name: 'career' },
  { path: '/impressum', name: 'impressum' },
  { path: '/datenschutz', name: 'datenschutz' },
  { path: '/this-route-does-not-exist-404', name: 'unknown-route' },
];

test.describe('Routes rendering without console errors', () => {
  for (const route of ROUTES) {
    test(`renders route ${route.path} without console errors`, async ({ page }) => {
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

      // Capture screenshot for visual verification artifacts
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

test.describe('Atlus Pause Menu Interactions', () => {
  test('with the overlay open the stage nav is not visible and occluded', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    const stageMenu = page.locator('.stage-menu');
    await expect(stageMenu).toBeAttached();

    // Trigger global pause menu overlay
    const menuButton = page.locator('.menu-dots').first();
    await expect(menuButton).toBeVisible();
    await menuButton.click();

    // Verify modal overlay is open
    const overlay = page.locator('.gm');
    await expect(overlay).toBeVisible();

    // Allow diagonal wipe animation (300ms) to settle
    await page.waitForTimeout(400);

    // Verify that the overlay occludes the underlying stage menu:
    // elementFromPoint at the stage menu position returns the overlay or a child of it
    const isOccluded = await page.evaluate(() => {
      const menu = document.querySelector('.stage-menu');
      if (!menu) return true;
      const rect = menu.getBoundingClientRect();
      const topEl = document.elementFromPoint(rect.left + 50, rect.top + 50);
      return topEl === document.querySelector('.gm') || topEl?.closest('.gm') !== null;
    });
    expect(isOccluded).toBe(true);

    // v6: the stage slabs are hidden and inert, and the overlay shows exactly one list and one Quick Read.
    await expect(stageMenu).toHaveJSProperty('inert', true);
    await expect(page.locator('.gm-list li')).toHaveCount(5);
    await expect(page.locator('.gm-quick')).toHaveCount(1);

    // Direct clicks on stage menu links must be intercepted by the overlay
    // v5+: the stage nav is visibility:hidden while the overlay is open, so Playwright reports "not visible".
    const clickBlocked = await stageMenu.locator('a').first().click({ timeout: 500 }).then(() => false).catch((err) => {
      return /intercepts pointer events|hidden|not visible/.test(err.message);
    });
    expect(clickBlocked).toBe(true);
  });

  test('ESC closes overlay and restores the scroll position', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    // Scroll to a defined offset down the page
    const targetScrollY = 1200;
    await page.evaluate((y) => window.scrollTo(0, y), targetScrollY);
    await page.waitForTimeout(400);
    const initialScrollY = await page.evaluate(() => window.scrollY);

    // Open pause menu
    const menuButton = page.locator('.menu-dots').first();
    await menuButton.click();
    const overlay = page.locator('.gm');
    await expect(overlay).toBeVisible();

    // Press Escape key to close the overlay
    await page.keyboard.press('Escape');
    await expect(overlay).toHaveCount(0);
    await page.waitForTimeout(300);

    // Verify scroll position was preserved/restored
    const finalScrollY = await page.evaluate(() => window.scrollY);
    expect(Math.abs(finalScrollY - initialScrollY)).toBeLessThanOrEqual(5);
  });

  test('clicking CONTACT lands on the bonfire section', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    // Open global menu
    const menuButton = page.locator('.menu-dots').first();
    await menuButton.click();
    await expect(page.locator('.gm')).toBeVisible();
    await page.waitForTimeout(300);

    // Click CONTACT slab
    const contactItem = page.locator('.gm-list a').filter({ hasText: /contact|kontakt/i }).first();
    await expect(contactItem).toBeVisible();
    await contactItem.click();

    // Wait for camera flight and scroll landing
    await page.waitForTimeout(1800);

    // Verify bonfire section is in view
    const bonfireSection = page.locator('#bonfire');
    await expect(bonfireSection).toBeAttached();

    const inViewport = await bonfireSection.evaluate((el) => {
      const rect = el.getBoundingClientRect();
      return rect.top < window.innerHeight && rect.bottom > 0;
    });
    expect(inViewport).toBe(true);

    // Capture screenshot of bonfire landing
    const width = page.viewportSize()?.width || 1440;
    const height = page.viewportSize()?.height || 900;
    const screenshotsDir = path.join(process.cwd(), 'screenshots');
    await page.screenshot({
      path: path.join(screenshotsDir, `bonfire-landing-${width}x${height}.png`),
    });
  });
});

test.describe('Horizontal Record Ride', () => {
  test('the horizontal record ride reaches the last entry on desktop', async ({ page, viewport }) => {
    // Pinned horizontal ride is only enabled on viewports >= 768px without reduced motion
    if ((viewport?.width || 0) < 768) {
      test.skip();
    }

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    const recordSection = page.locator('#record');
    await expect(recordSection).toBeAttached();

    // Scroll into record section
    await recordSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);

    // Confirm that the pinned ride class was applied
    await expect(recordSection).toHaveClass(/record-ride/);

    const recordItems = recordSection.locator('.record-item');
    const totalCount = await recordItems.count();
    expect(totalCount).toBeGreaterThan(0);

    const sectionBox = await recordSection.boundingBox();
    const startY = await page.evaluate(() => window.scrollY);
    const scrollStep = 300;
    const maxScroll = (sectionBox?.height || 3000);

    let lastEntryReached = false;

    for (let offset = 0; offset <= maxScroll; offset += scrollStep) {
      await page.evaluate((y) => window.scrollTo(0, y), startY + offset);
      await page.waitForTimeout(60);

      const isLastActive = await recordItems.last().locator('button').evaluate((el) => el.classList.contains('is-active'));
      if (isLastActive) {
        lastEntryReached = true;
        break;
      }
    }

    expect(lastEntryReached).toBe(true);
  });
});

test.describe('Prefers Reduced Motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('prefers-reduced-motion run passes cleanly with disabled WebGL and vertical list fallback', async ({ page }) => {
    const consoleErrors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    // Zero console errors
    expect(consoleErrors).toEqual([]);

    // WebGL canvas disabled when reduced motion is preferred
    const stage = page.locator('.stage');
    await expect(stage).toHaveAttribute('data-webgl', 'off');

    // Horizontal ride disabled: #record remains accessible vertical list
    const recordSection = page.locator('#record');
    await expect(recordSection).not.toHaveClass(/record-ride/);

    // Global menu opens and closes cleanly without wipe animation delays
    const menuButton = page.locator('.menu-dots').first();
    await menuButton.click();
    const overlay = page.locator('.gm');
    await expect(overlay).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(overlay).toHaveCount(0);
  });
});

test.describe('Prop screen positions (test hook)', () => {
  test('window.__propScreenPos reports projected mesh positions only with ?e2e=1', async ({ page, viewport }) => {
    // Descent props are hidden below 1024 px.
    if ((viewport?.width || 0) < 1024) {
      test.skip();
    }

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    expect(await page.evaluate(() => typeof window.__propScreenPos)).toBe('undefined');

    await page.goto('/?e2e=1', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('.stage')).toHaveAttribute('data-webgl', 'on');
    await page.waitForFunction(() => typeof window.__propScreenPos === 'function');
    await page.evaluate(() => {
      const panel = document.querySelectorAll('.stage-descent .manga-panel')[1];
      window.scrollTo(0, panel.getBoundingClientRect().top + window.scrollY - 100);
    });
    await page.waitForTimeout(800);

    const first = await page.evaluate(() => window.__propScreenPos());
    expect(first.props.map((p) => p.id).sort()).toEqual(['chip', 'dome', 'monitor', 'pcb', 'rack']);
    // v7: visibility by breakpoint only, every prop in the descent scene, never culled.
    for (const p of first.props) {
      expect(p.visible).toBe(true);
      expect(p.scene).toBe('descent');
      expect(Number.isFinite(p.x) && Number.isFinite(p.y)).toBe(true);
    }

    // Fixed map, and each prop rests on its reserved slot (±1 px) at every scroll position.
    const order = await page.evaluate(() => [...document.querySelectorAll('.descent-row [data-slot]')].map((n) => n.dataset.slot));
    expect(order).toEqual(['pcb', 'chip', 'monitor', 'rack', 'dome']);
    for (const index of [0, 1, 2, 3, 4]) {
      await page.evaluate((i) => document.querySelectorAll('.descent-row')[i].scrollIntoView({ block: 'center' }), index);
      await page.waitForTimeout(700);
      const { slot, prop } = await page.evaluate((i) => {
        const node = document.querySelectorAll('.descent-row [data-slot]')[i];
        const r = node.getBoundingClientRect();
        return { slot: { x: r.left + r.width / 2, y: r.top + r.height / 2 }, prop: window.__propScreenPos().props.find((p) => p.id === node.dataset.slot) };
      }, index);
      expect(prop.visible && prop.inFrustum).toBe(true);
      expect(Math.abs(prop.rest.x - slot.x)).toBeLessThanOrEqual(1);
      expect(Math.abs(prop.rest.y - slot.y)).toBeLessThanOrEqual(1);
    }

    // The DOM proxies are written from the same mesh position in the same frame.
    const pairs = await page.evaluate(() => {
      const { props } = window.__propScreenPos();
      return props.filter((p) => p.visible).map((p) => {
        const node = document.querySelector(`[data-prop="${p.id}"]`);
        const m = /translate\(([-\d.]+)px, ([-\d.]+)px\)/.exec(node.style.transform);
        const half = node.offsetWidth / 2;
        return { hx: p.x, hy: p.y, px: Number(m[1]) + half, py: Number(m[2]) + half };
      });
    });
    for (const p of pairs) {
      expect(Math.abs(p.hx - p.px)).toBeLessThan(1.5);
      expect(Math.abs(p.hy - p.py)).toBeLessThan(1.5);
    }

    await page.waitForTimeout(200);
    const second = await page.evaluate(() => window.__propScreenPos());
    expect(second.frame).toBeGreaterThan(first.frame);
  });
});

test.describe('Pause menu (v7)', () => {
  test('the open menu pauses the page: no scroll, main inert, exact position restored', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(800);
    const before = await page.evaluate(() => window.scrollY);

    await page.locator('.menu-dots').first().click();
    await expect(page.locator('.gm')).toBeVisible();
    const vp = page.viewportSize();
    await page.mouse.move(vp.width / 2, vp.height / 2);
    await page.mouse.wheel(0, -1500);
    await page.keyboard.press('PageUp');
    await page.waitForTimeout(400);
    const during = await page.evaluate(() => ({
      y: window.scrollY,
      inert: document.querySelector('main').inert,
      hidden: document.querySelector('main').getAttribute('aria-hidden'),
    }));
    expect(during).toEqual({ y: before, inert: true, hidden: 'true' });

    // Letters column exactly as tall as the list; no footer chip overlaps another.
    const layout = await page.evaluate(() => {
      const box = (n) => n.getBoundingClientRect();
      const letters = box(document.querySelector('.gm-letters'));
      const list = box(document.querySelector('.gm-list'));
      const chips = [...document.querySelectorAll('.gm-foot .gm-chip, .gm-legal button')].map(box);
      const overlaps = chips.some((a, i) => chips.some((b, j) => i < j && a.left < b.right - 0.5 && b.left < a.right - 0.5 && a.top < b.bottom - 0.5 && b.top < a.bottom - 0.5));
      return { dh: Math.abs(letters.height - list.height), overlaps };
    });
    expect(layout.dh).toBeLessThanOrEqual(1);
    expect(layout.overlaps).toBe(false);

    await page.keyboard.press('Escape');
    await expect(page.locator('.gm')).toHaveCount(0);
    const after = await page.evaluate(() => ({ y: window.scrollY, inert: document.querySelector('main').inert }));
    expect(after).toEqual({ y: before, inert: false });
  });
});

test.describe('/about status screen (v7)', () => {
  test('person, not skills: status sub-menu, arrow keys, no TODO or skill panels in production', async ({ page }) => {
    await page.goto('/about');
    const tabs = page.locator('.scr-tab');
    await expect(tabs.first()).toContainText(/STATUS/);
    await expect(tabs.last()).toContainText(/JETZT|NOW/);
    await expect(page.locator('.prof-detail')).toContainText('Richard Zuikov');
    await expect(page.locator('body')).not.toContainText('Register-Level');
    await expect(page.locator('body')).not.toContainText('TODO');
    const words = (await page.locator('.prof-intro p').first().innerText()).trim().split(/\s+/).length;
    expect(words).toBeLessThanOrEqual(90);
    await tabs.first().focus();
    await page.keyboard.press('ArrowDown');
    await expect(tabs.nth(1)).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('a[href="/stack"].prof-skills')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page).toHaveURL(/\/$/);
  });
});

test.describe('Record turn beat (v7)', () => {
  test('the 90° turn is its own pinned, reversible beat after the last role', async ({ page, viewport }) => {
    if (viewport.width < 768) test.skip();
    await page.goto('/');
    await page.waitForFunction(() => document.querySelector('#record')?.dataset.turnLen);
    const geo = await page.evaluate(() => {
      const s = document.querySelector('#record');
      return { top: s.getBoundingClientRect().top + scrollY - 64, start: Number(s.dataset.turnStart), len: Number(s.dataset.turnLen) };
    });
    expect(geo.len).toBeGreaterThanOrEqual(Math.round(viewport.height * 0.6) - 1);
    const at = async (p) => {
      await page.evaluate((y) => window.scrollTo(0, y), geo.top + geo.start + geo.len * p);
      await page.waitForTimeout(300);
      return page.evaluate(() => {
        const s = document.querySelector('#record');
        return {
          turn: parseFloat(s.style.getPropertyValue('--turn')),
          pinTop: Math.round(s.querySelector('.record-pin').getBoundingClientRect().top),
          yearRotate: getComputedStyle(s.querySelector('.record-year')).rotate,
        };
      });
    };
    const hold = await at(0);
    expect(hold.turn).toBe(0);
    const turned = await at(0.75);
    expect(turned.turn).toBeCloseTo(90, 1);
    expect(turned.pinTop).toBe(64);
    expect(turned.yearRotate).toBe('-90deg');
    const back = await at(0.05);
    expect(back.turn).toBe(0);
  });
});
