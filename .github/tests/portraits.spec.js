import { test, expect } from '@playwright/test';

// Real-photo portraits (DESIGN.md §2 + §18 "Portraits"): B/W at rest, colour on hover / focus
// (300 ms ease-out), instant under reduced motion; mapping stage → hero, about → /about,
// head → pause menu + mobile hero, night never loaded.
const colourOpacity = (locator) => locator.locator('.cutout-colour').evaluate((node) => Number(getComputedStyle(node).opacity));

test.describe('Real-photo portraits', () => {
  test('/about: about cut-out, B/W at rest, colour on hover and focus', async ({ page, isMobile }) => {
    await page.goto('/about');
    const portrait = page.locator('.prof-portrait .cutout');
    await expect(portrait).toBeVisible();
    await expect(portrait.locator('.cutout-bw img')).toHaveAttribute('src', /about-bw-\d+x\d+/);
    await expect(portrait.locator('.cutout-colour img')).toHaveAttribute('src', /about-color-\d+x\d+/);
    const transition = await portrait.locator('.cutout-colour').evaluate((node) => getComputedStyle(node).transitionDuration);
    expect(transition).toBe('0.3s');
    if (isMobile) {
      await portrait.tap({ force: true }); // the figure breathes, so it is never "stable"
      await expect(portrait).toHaveClass(/is-colour/);
      await expect.poll(() => colourOpacity(portrait)).toBe(1);
      return;
    }
    expect(await colourOpacity(portrait)).toBe(0);
    await portrait.hover({ force: true });
    await expect.poll(() => colourOpacity(portrait)).toBe(1);
    await page.mouse.move(0, 0);
    await expect.poll(() => colourOpacity(portrait)).toBe(0);
    await portrait.focus();
    await expect.poll(() => colourOpacity(portrait)).toBe(1);
  });

  test('reduced motion: instant swap, cut-outs in the fallback hero', async ({ browser, isMobile }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce', viewport: isMobile ? { width: 390, height: 844 } : { width: 1440, height: 900 }, hasTouch: isMobile, isMobile });
    const page = await context.newPage();
    await page.goto('/about');
    const transition = await page.locator('.prof-portrait .cutout-colour').evaluate((node) => getComputedStyle(node).transitionDuration);
    expect(transition).toBe('0s');
    // Reduced motion = no WebGL stage, so the hero shows the DOM cut-out: stage on desktop, head on phones.
    await page.goto('/');
    const hero = page.locator('.stage-portrait .hero-cutout:visible');
    await expect(hero).toHaveCount(1);
    await expect(hero.locator('.cutout-bw img')).toHaveAttribute('src', isMobile ? /head-bw-/ : /stage-bw-/);
    await context.close();
  });

  test('pause menu preview uses the head cut-out', async ({ page, isMobile }) => {
    test.skip(isMobile, 'the preview portrait is hidden below 1024 px');
    await page.goto('/about');
    await page.locator('.menu-dots').first().click();
    const portrait = page.locator('.gm-preview .cutout.gm-portrait');
    await expect(portrait).toBeVisible();
    await expect(portrait.locator('.cutout-bw img')).toHaveAttribute('src', /head-bw-/);
    expect(await colourOpacity(portrait)).toBe(0);
  });

  test('night is never requested', async ({ page }) => {
    const urls = [];
    page.on('request', (request) => urls.push(request.url()));
    await page.goto('/');
    await page.waitForTimeout(1500);
    await page.goto('/about');
    await page.waitForTimeout(500);
    expect(urls.filter((url) => /night-(bw|color)/.test(url))).toEqual([]);
  });
});
