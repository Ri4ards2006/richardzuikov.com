/**
 * AP0: Descent Prop Visibility & Pixel Probe Test Suite
 *
 * Review Checklist (AP0):
 * - [ ] Every descent panel screenshot shows its corresponding 3D prop rendered in its gutter slot.
 * - [ ] No panel prop is dropped or culled while the panel is centered in the viewport.
 * - [ ] Prop meshes maintain >= 3% non-background pixel difference against #050505 (ΔE > 8).
 * - [ ] Props remain in 'descent' scene hierarchy and inFrustum === true across all scroll transitions.
 * - [ ] Props survive opening and closing modal/dialog sub-screens (/about, /work, /stack, /career).
 */
import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

// Helper to compute CIELAB ΔE76 against background in browser
const ANALYZE_PIXELS_FN = async (base64) => {
  const blob = await fetch(`data:image/png;base64,${base64}`).then((r) => r.blob());
  const bitmap = await createImageBitmap(blob);
  const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(bitmap, 0, 0);
  const imgData = ctx.getImageData(0, 0, bitmap.width, bitmap.height);
  const d = imgData.data;

  const rgbToLab = (r, g, b) => {
    let rL = r / 255;
    let gL = g / 255;
    let bL = b / 255;
    rL = rL > 0.04045 ? Math.pow((rL + 0.055) / 1.055, 2.4) : rL / 12.92;
    gL = gL > 0.04045 ? Math.pow((gL + 0.055) / 1.055, 2.4) : gL / 12.92;
    bL = bL > 0.04045 ? Math.pow((bL + 0.055) / 1.055, 2.4) : bL / 12.92;
    const x = (rL * 0.4124564 + gL * 0.3575761 + bL * 0.1804375) / 0.95047;
    const y = (rL * 0.2126729 + gL * 0.7151522 + bL * 0.0721750) / 1.0;
    const z = (rL * 0.0193339 + gL * 0.1191920 + bL * 0.9503041) / 1.08883;
    const f = (t) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
    const fx = f(x);
    const fy = f(y);
    const fz = f(z);
    return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
  };

  const bgLab = rgbToLab(5, 5, 5); // #050505 canvas background
  const total = bitmap.width * bitmap.height;
  let diffCount = 0;
  for (let i = 0; i < total; i++) {
    const off = i << 2;
    const lab = rgbToLab(d[off], d[off + 1], d[off + 2]);
    const dE = Math.sqrt((lab[0] - bgLab[0]) ** 2 + (lab[1] - bgLab[1]) ** 2 + (lab[2] - bgLab[2]) ** 2);
    if (dE > 8) diffCount++;
  }
  return {
    diffCount,
    total,
    pct: (diffCount / total) * 100,
  };
};

const getSlotClip = async (page, panelIndex) => {
  return await page.evaluate((idx) => {
    const panel = document.querySelectorAll('.stage-descent .manga-panel')[idx];
    if (!panel) return null;
    const r = panel.getBoundingClientRect();
    const onRight = r.left + r.width / 2 > 1440 / 2;
    const gutterStart = onRight ? 0 : r.left + r.width;
    const gutterEnd = onRight ? r.left : 1440;
    const gutterCenterX = (gutterStart + gutterEnd) / 2;
    const gutterCenterY = r.top + r.height / 2;

    const slotEl =
      document.querySelector(`[data-slot="panel-${idx}"]`) ||
      document.querySelector(`[data-slot="${idx}"]`);
    const slotRect = slotEl ? slotEl.getBoundingClientRect() : null;

    const hookData = typeof window.__propScreenPos === 'function' ? window.__propScreenPos() : null;
    let hookProp = null;
    if (hookData) {
      const props = Array.isArray(hookData.props) ? hookData.props : Object.values(hookData);
      hookProp = props[idx] || null;
    }

    const boxX = slotRect
      ? slotRect.left + (slotRect.width - 160) / 2
      : hookProp && Number.isFinite(hookProp.x)
      ? hookProp.x - 80
      : gutterCenterX - 80;
    const boxY = slotRect
      ? slotRect.top + (slotRect.height - 160) / 2
      : hookProp && Number.isFinite(hookProp.y)
      ? hookProp.y - 80
      : gutterCenterY - 80;

    return {
      clip: {
        x: Math.max(0, Math.min(1440 - 160, Math.round(boxX))),
        y: Math.max(0, Math.min(900 - 160, Math.round(boxY))),
        width: 160,
        height: 160,
      },
      hookProp,
    };
  }, panelIndex);
};

const verifyPropSlot = async (page, panelIndex, label) => {
  const slotData = await getSlotClip(page, panelIndex);
  expect(slotData, `Slot rect for panel ${panelIndex + 1} must exist`).not.toBeNull();

  const screenshotDir = path.join(process.cwd(), 'screenshots', 'prop-visibility');
  fs.mkdirSync(screenshotDir, { recursive: true });

  const clipBuf = await page.screenshot({ clip: slotData.clip });
  fs.writeFileSync(path.join(screenshotDir, `${label}-panel-${panelIndex + 1}.png`), clipBuf);

  const stats = await page.evaluate(ANALYZE_PIXELS_FN, clipBuf.toString('base64'));
  console.log(`[PROBE] Panel ${panelIndex + 1} (${label}): diffCount=${stats.diffCount}/${stats.total} (${stats.pct.toFixed(2)}%)`);

  // Assert >= 3% of pixels differ from background by ΔE > 8
  expect(
    stats.pct,
    `Panel ${panelIndex + 1} prop in gutter slot must have >= 3% non-background pixels (got ${stats.pct.toFixed(2)}%) [${label}]`
  ).toBeGreaterThanOrEqual(3.0);

  // Contract required by Claude Code v7: hook must expose visible, inFrustum, parent === 'descent'
  const hookProp = slotData.hookProp;
  expect(hookProp, `Panel ${panelIndex + 1} prop must be exposed in window.__propScreenPos`).not.toBeNull();
  expect(hookProp.visible, `Panel ${panelIndex + 1} hook visible must be true`).toBe(true);
  expect(hookProp.inFrustum, `Panel ${panelIndex + 1} hook inFrustum must be true`).toBe(true);
  const parentVal = hookProp.parent ?? hookProp.scene;
  expect(
    parentVal,
    `Panel ${panelIndex + 1} hook parent must be "descent" (got: "${parentVal}")`
  ).toBe('descent');
};

test.describe('AP0: Descent Prop Visibility & Pixel Probes', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('each panel 01-05 centered displays rendered prop with >= 3% pixels ΔE > 8 and parent="descent"', async ({ page }) => {
    await page.goto('/?e2e=1', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);

    const panels = page.locator('.stage-descent .manga-panel');
    const panelCount = await panels.count();
    expect(panelCount, 'Must find 5 descent panels').toBe(5);

    for (let i = 0; i < 5; i++) {
      const panel = panels.nth(i);
      await panel.evaluate((el) => {
        const r = el.getBoundingClientRect();
        window.scrollTo(0, window.scrollY + r.top + r.height / 2 - window.innerHeight / 2);
      });
      await page.waitForTimeout(600);

      await verifyPropSlot(page, i, `centered`);
    }
  });

  test('props remain rendered and visible across 20 random scroll positions', async ({ page }) => {
    test.setTimeout(180000);
    await page.goto('/?e2e=1', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);

    const descent = page.locator('.stage-descent');
    const descentBox = await descent.boundingBox();
    expect(descentBox).not.toBeNull();

    const startY = descentBox.y + (await page.evaluate(() => window.scrollY));
    const endY = startY + descentBox.height - 900;

    // 20 seeded pseudo-random positions across the descent range
    for (let s = 0; s < 20; s++) {
      const t = (s * 7 + 3) % 20 / 19;
      const scrollY = Math.round(startY + t * (endY - startY));
      await page.evaluate((y) => window.scrollTo(0, y), scrollY);
      await page.waitForTimeout(200);

      // Check which panels are in view (center in 120 <= y <= 780)
      const inViewIndices = await page.evaluate(() => {
        const panels = [...document.querySelectorAll('.stage-descent .manga-panel')];
        return panels
          .map((p, idx) => {
            const r = p.getBoundingClientRect();
            const cy = r.top + r.height / 2;
            return cy >= 120 && cy <= 780 ? idx : -1;
          })
          .filter((idx) => idx !== -1);
      });

      for (const idx of inViewIndices) {
        await verifyPropSlot(page, idx, `scroll-step-${s}`);
      }
    }
  });

  test('props remain rendered and visible after opening/closing every sub-screen', async ({ page }) => {
    test.setTimeout(180000);
    const subScreens = ['/about', '/work', '/stack', '/career'];

    for (const screenPath of subScreens) {
      await page.goto('/?e2e=1', { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1000);

      // Navigate to sub-screen
      await page.goto(`${screenPath}?e2e=1`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(800);

      // Return to main stage
      await page.goto('/?e2e=1', { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1200);

      // Verify all 5 descent panels
      const panels = page.locator('.stage-descent .manga-panel');
      for (let i = 0; i < 5; i++) {
        const panel = panels.nth(i);
        await panel.evaluate((el) => {
          const r = el.getBoundingClientRect();
          window.scrollTo(0, window.scrollY + r.top + r.height / 2 - window.innerHeight / 2);
        });
        await page.waitForTimeout(500);

        await verifyPropSlot(page, i, `after-${screenPath.replace('/', '')}`);
      }
    }
  });

  test('props remain rendered and visible after 5x fast scroll bursts', async ({ page }) => {
    test.setTimeout(180000);
    await page.goto('/?e2e=1', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);

    // 5x fast top->bottom->top bursts
    const bursts = [500, 950, -400, 1100, -750, 600, -1200, 800, -500];
    for (let c = 0; c < 5; c++) {
      for (const b of bursts) {
        await page.mouse.wheel(0, b);
        await page.waitForTimeout(30);
      }
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
      await page.waitForTimeout(60);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(60);
    }

    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1000);

    const panels = page.locator('.stage-descent .manga-panel');
    for (let i = 0; i < 5; i++) {
      const panel = panels.nth(i);
      await panel.evaluate((el) => {
        const r = el.getBoundingClientRect();
        window.scrollTo(0, window.scrollY + r.top + r.height / 2 - window.innerHeight / 2);
      });
      await page.waitForTimeout(500);

      await verifyPropSlot(page, i, `after-bursts`);
    }
  });
});
