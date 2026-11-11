import { test, expect } from '@playwright/test';

// DESIGN.md §19: TODO / DRAFT hint lines are dev-server only. They must never render in a production
// build (or a Vercel preview, which is one). This greps the rendered DOM of the production preview,
// every route, both languages, every /about tab and the home page scrolled top to bottom.
const ROUTES = ['/', '/quick', '/about', '/work', '/stack', '/career', '/impressum', '/datenschutz'];
const HINT = /\b(TODO|DRAFT|ENTWURF)\b/;

// Rendered markup of <body> (text and attributes such as aria-label), scripts excluded.
const renderedDom = (page) => page.evaluate(() => {
  const clone = document.body.cloneNode(true);
  clone.querySelectorAll('script, noscript').forEach((node) => node.remove());
  return clone.outerHTML;
});

const hits = (html) => (html.match(new RegExp(`.{0,60}${HINT.source}.{0,60}`, 'g')) ?? []);

async function walkHome(page) {
  // Every section mounts or reveals as it scrolls into view.
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  const step = await page.evaluate(() => window.innerHeight);
  for (let y = 0; y < height; y += step) {
    await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y);
    await page.waitForTimeout(60);
  }
}

for (const language of ['de', 'en']) {
  test.describe(`no TODO / DRAFT in production (${language})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.addInitScript((lang) => {
        try {
          localStorage.setItem('language', lang);
          sessionStorage.setItem('seen-stage-intro', 'true');
        } catch {
          // Defaults still render a production page.
        }
      }, language);
    });

    for (const route of ROUTES) {
      test(`${route}`, async ({ page }) => {
        await page.goto(route);
        await page.waitForLoadState('networkidle');
        if (route === '/') await walkHome(page);
        if (route === '/about') {
          const tabs = page.locator('.scr-tab');
          const count = await tabs.count();
          for (let i = 0; i < count; i += 1) {
            await tabs.nth(i).click();
            expect(hits(await renderedDom(page))).toEqual([]);
          }
        }
        expect(hits(await renderedDom(page))).toEqual([]);
      });
    }
  });
}
