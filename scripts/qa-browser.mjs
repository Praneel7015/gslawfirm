/** Playwright CLI audit. Downloads stay in .qa; artifacts in output/playwright. */
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const exec = promisify(execFile);
const base = process.argv[2] ?? process.env.QA_BASE_URL ?? "http://127.0.0.1:3100";
if (!/^https?:\/\/(127\.0\.0\.1|localhost):\d+$/.test(base)) throw new Error("Browser form mocks must run against a local candidate server.");
const label = process.env.QA_CAPTURE_LABEL ?? "after";
if (!/^[a-z0-9-]+$/.test(label)) throw new Error("Invalid capture label");
const output = resolve("output/playwright", label);
await mkdir(output, { recursive: true });
const xml = await (await fetch(`${base}/sitemap.xml`)).text();
const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => new URL(match[1]).pathname);
if (paths.length !== 108) throw new Error(`Expected 108 pages, found ${paths.length}`);
const env = { ...process.env, NPM_CONFIG_CACHE: resolve(".qa/npm-cache"), PLAYWRIGHT_CLI_SESSION: `gslaw-${label}`, PLAYWRIGHT_BROWSERS_PATH: resolve(".qa/browsers") };
const config = resolve(".qa/playwright-cli.json");
await mkdir(resolve(".qa"), { recursive: true });
await writeFile(config, JSON.stringify({ browser: { launchOptions: { headless: true }, contextOptions: { viewport: { width: 390, height: 844 } } } }));
async function cli(...args) {
  const result = await exec("npx", ["--yes", "--package", "@playwright/cli", "playwright-cli", "--config", config, ...args], { env, cwd: output, timeout: 600000, maxBuffer: 8 * 1024 * 1024 });
  process.stdout.write(result.stdout); process.stderr.write(result.stderr);
  if (/### Error\b/.test(result.stdout)) throw new Error("Playwright CLI reported an error");
}
try {
  await cli("open", base);
  await cli("snapshot");
  // Bulk DOM/layout checks need run-code; no stale snapshot element references are used.
  await cli("run-code", `
    const failures = [];
    let mockStatus = 200;
    let mockedPosts = 0;
    await page.context().route('**/api/lead', async route => {
      mockedPosts++;
      await route.fulfill({ status: mockStatus, contentType: 'application/json', body: JSON.stringify(mockStatus === 200 ? { ok: true } : { error: 'mocked_failure' }) });
    });
    await page.context().route('**/turnstile/v0/api.js*', route => route.fulfill({ contentType: 'application/javascript', body: 'window.turnstile={render:(el,opts)=>{setTimeout(()=>opts.callback("qa-mock-token"),0);return "qa";},remove:()=>{},reset:()=>{}};' }));
    const check = (ok, message) => { if (!ok) failures.push(message); };
    // The first-visit disclaimer must contain Tab navigation until agreement.
    await page.waitForSelector('.modal-scrim[open]');
    for (let i = 0; i < 6; i++) {
      await page.keyboard.press('Tab');
      check(await page.evaluate(() => !!document.activeElement?.closest('.modal-scrim')), 'Disclaimer focus escaped');
    }
    await page.locator('.modal-btn.primary').click();
    await page.waitForSelector('.modal-scrim', { state: 'detached' });
    check(await page.evaluate(() => document.body.style.overflow !== 'hidden'), 'Disclaimer left scroll locked');
    const inspect = async (path, width, zoom = 1) => {
      const result = await page.evaluate(() => {
        const main = document.querySelector('main');
        const headings = [...main.querySelectorAll('h1,h2,h3')];
        const overflow = document.documentElement.scrollWidth > innerWidth + 1;
        const invalidHeadings = headings.filter(el => { const s = getComputedStyle(el); return parseFloat(s.lineHeight) / parseFloat(s.fontSize) < 1.14; }).map(el => el.textContent);
        const small = [...main.querySelectorAll('p,input,textarea')].filter(el => getComputedStyle(el).display !== 'none' && parseFloat(getComputedStyle(el).fontSize) < 15.9 && !el.classList.contains('pd-footnote') && !el.classList.contains('field-err'));
        return { overflow, invalidHeadings, small: small.map(el => el.className), h1: main.querySelector('h1')?.textContent, length: main.innerText.length };
      });
      check(!result.overflow, path + ' overflow at ' + width + ' / zoom ' + zoom);
      check(result.h1 && result.length > 300, path + ' missing content');
      if (width < 768) {
        check(!result.invalidHeadings.length, path + ' compressed heading: ' + result.invalidHeadings.join(';'));
        check(!result.small.length, path + ' small reading text: ' + result.small.join(';'));
      }
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      const unobscured = await page.evaluate(() => {
        const footer = document.querySelector('footer');
        const bar = document.querySelector('.mbar');
        const last = footer?.querySelector('.foot-credit-line');
        return !last || !bar || getComputedStyle(bar).display === 'none' || last.getBoundingClientRect().bottom <= bar.getBoundingClientRect().top + 1;
      });
      check(unobscured, path + ' footer obscured by contact bar');
      await page.evaluate(() => window.scrollTo(0, 0));
    };
    await page.setViewportSize({ width: 390, height: 844 });
    for (const path of ${JSON.stringify(paths)}) {
      await page.goto(${JSON.stringify(base)} + path);
      await page.evaluate(() => document.fonts.ready);
      await inspect(path, 390);
    }
    const representative = ['/', '/practice', '/practice/criminal', '/bail', '/resources/understanding-bail-in-hyderabad-courts', '/resources', '/legal-statistics-hyderabad', '/about', '/contact', '/disclaimer'];
    for (const width of [320, 360, 390, 430, 1440]) {
      await page.setViewportSize({ width, height: width === 1440 ? 1000 : 844 });
      for (const locale of ['en', 'hi', 'te']) for (const path of representative) {
        const localized = (locale === 'en' ? '' : '/' + locale) + (path === '/' ? '' : path) || '/';
        await page.goto(${JSON.stringify(base)} + localized);
        await page.evaluate(() => document.fonts.ready);
        await inspect(localized, width);
        await page.screenshot({ path: ${JSON.stringify(output)} + '/' + locale + '-' + (path.replaceAll('/', '-') || 'home') + '-' + width + '.png', fullPage: true });
        if (width === 390) {
          await page.evaluate(() => { document.body.style.zoom = '2'; });
          await inspect(localized, width, 2);
          await page.screenshot({ path: ${JSON.stringify(output)} + '/' + locale + '-' + (path.replaceAll('/', '-') || 'home') + '-200percent.png', fullPage: true });
        }
      }
    }
    await page.setViewportSize({ width: 390, height: 844 });
    for (const locale of ['en', 'hi', 'te']) {
      const prefix = locale === 'en' ? '' : '/' + locale;
      await page.goto(${JSON.stringify(base)} + prefix + '/contact?source=%2Fbail#contact');
      const ham = page.locator('.ham');
      await ham.click();
      await page.waitForSelector('#mobile-menu[open]');
      for (let i = 0; i < 12; i++) {
        await page.keyboard.press('Tab');
        check(await page.evaluate(() => !!document.activeElement?.closest('#mobile-menu')), locale + ' menu focus escaped');
      }
      const next = locale === 'hi' ? 'te' : 'hi';
      const switcher = page.locator('#mobile-menu .lang a[lang="' + next + '"]');
      check((await switcher.getAttribute('href')).includes('?source=%2Fbail#contact'), locale + ' lost query or fragment');
      await switcher.click();
      await page.waitForURL('**/' + next + '/contact?source=%2Fbail#contact');
      check(await page.locator('#mobile-menu').evaluate(el => !el.open), 'Menu did not close after switching locale');
      await page.locator('.ham').click();
      await page.keyboard.press('Escape');
      check(await ham.evaluate(el => document.activeElement === el), 'Menu failed to restore focus');
      for (const status of [200, 503]) {
        mockStatus = status;
        await page.goto(${JSON.stringify(base)} + prefix + '/contact');
        await page.locator('#f-name').fill('QA Local Test');
        await page.locator('#f-phone').fill('9999999999');
        await page.locator('#f-email').fill('qa@example.invalid');
        await page.locator('#f-message').fill('Mock browser verification only. No real enquiry.');
        await page.locator('.btn-submit').click();
        await page.locator(status === 200 ? '.form-success' : 'form [role="alert"]').waitFor();
      }
    }
    check(mockedPosts === 6, 'Expected six intercepted form submissions, saw ' + mockedPosts);
    if (failures.length) throw new Error(failures.join('\\n'));
    console.log('108 pages at 390px; representative pages at five widths and 200% enlargement; keyboard, language and mocked form checks passed. Screenshots still require human visual review.');
  `);
  await cli("snapshot");
} finally {
  await cli("close").catch(error => console.error("Browser cleanup:", error.message));
}
