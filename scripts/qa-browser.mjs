/** Candidate browser audit through the project-local Playwright CLI. No real leads. */
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const exec = promisify(execFile);
const base = process.argv[2] ?? process.env.QA_BASE_URL ?? "http://localhost:3100";
if (!/^https?:\/\/(127\.0\.0\.1|localhost):\d+$/.test(base)) throw new Error("Browser form mocks require a local candidate server.");
const label = process.env.QA_CAPTURE_LABEL ?? "after";
if (!/^[a-z0-9-]+$/.test(label)) throw new Error("Invalid capture label");
const output = resolve("output/playwright", label);
await mkdir(output, { recursive: true });
const xml = await (await fetch(`${base}/sitemap.xml`)).text();
const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => new URL(match[1]).pathname);
if (paths.length !== 108) throw new Error(`Expected 108 pages, found ${paths.length}`);
const env = { ...process.env, NPM_CONFIG_CACHE: resolve(".qa/npm-cache"), PLAYWRIGHT_BROWSERS_PATH: resolve(".qa/browsers") };
const config = resolve(".qa/playwright-cli.json");
await mkdir(resolve(".qa"), { recursive: true });
await writeFile(config, JSON.stringify({ browser: { browserName: "chromium", launchOptions: { channel: "chromium", headless: true }, contextOptions: { viewport: { width: 390, height: 844 } } } }));
async function cli(...args) {
  if (args[0] === "open") args.push("--config", config);
  const command = process.env.PLAYWRIGHT_CLI_PATH ? process.execPath : "npx";
  const prefix = process.env.PLAYWRIGHT_CLI_PATH ? [resolve(process.env.PLAYWRIGHT_CLI_PATH)] : ["--yes", "--package", "@playwright/cli@0.1.23", "playwright-cli"];
  const result = await exec(command, [...prefix, `-s=gslaw-${label}`, ...args], { env, cwd: output, timeout: 600000, maxBuffer: 16 * 1024 * 1024 });
  process.stdout.write(result.stdout); process.stderr.write(result.stderr);
  if (/### Error\b/.test(result.stdout)) throw new Error("Playwright CLI reported an error");
  return result.stdout;
}
try {
  await cli("open", base);
  await cli("snapshot");
  // DOM sweeps, timing samples and request interception require a bulk Playwright function.
  const result = await cli("run-code", `async (page) => {
    const base = ${JSON.stringify(base)};
    const output = ${JSON.stringify(output)};
    const failures = [];
    const consoleErrors = [];
    page.on('pageerror', error => consoleErrors.push(error.message));
    let mockStatus = 200, mockedPosts = 0;
    await page.context().route('**/api/lead', async route => {
      mockedPosts++;
      await route.fulfill({ status: mockStatus, contentType: 'application/json', body: JSON.stringify(mockStatus === 200 ? { ok: true } : { error: 'mocked_failure' }) });
    });
    await page.context().route('**/turnstile/v0/api.js*', route => route.fulfill({ contentType: 'application/javascript', body: 'window.turnstile={render:(el,opts)=>{setTimeout(()=>opts.callback("qa-mock-token"),0);return "qa";},remove:()=>{},reset:()=>{}};' }));
    const check = (ok, message) => { if (!ok) failures.push(message); };
    const focusContained = selector => page.evaluate(selector => document.activeElement === document.body || !!document.activeElement?.closest(selector), selector);
    const hydrate = async () => {
      await page.waitForFunction(() => {
        const button = document.querySelector('.ham');
        const key = button && Object.keys(button).find(key => key.startsWith('__reactProps'));
        return key && typeof button[key]?.onClick === 'function';
      });
      await page.evaluate(() => document.fonts.ready);
    };
    const go = async (path, interactive = false) => {
      const locale = path.match(/^\\/(hi|te)(?:\\/|$)/)?.[1] ?? 'en';
      await page.context().addCookies([{ name: 'NEXT_LOCALE', value: locale, url: base }]);
      await page.goto(base + path, { waitUntil: 'domcontentloaded' });
      if (interactive) await hydrate();
    };
    await page.waitForSelector('.modal-scrim[open]');
    for (let i = 0; i < 6; i++) { await page.keyboard.press('Tab'); check(await focusContained('.modal-scrim'), 'Disclaimer focus escaped to page content'); }
    await page.locator('.modal-btn.primary').click();
    await page.waitForSelector('.modal-scrim', { state: 'detached' });
    await hydrate();
    check(await page.evaluate(() => document.body.style.overflow !== 'hidden'), 'Disclaimer left scrolling locked');
    const inspect = async (path, width, zoom = 1) => {
      const result = await page.evaluate(() => {
        const main = document.querySelector('main');
        const invalidHeadings = [...main.querySelectorAll('h1,h2,h3')].filter(el => { const s = getComputedStyle(el); return parseFloat(s.lineHeight) / parseFloat(s.fontSize) < 1.14; }).map(el => el.textContent);
        const small = [...main.querySelectorAll('p,input,textarea')].filter(el => !el.closest('.honeypot') && getComputedStyle(el).display !== 'none' && parseFloat(getComputedStyle(el).fontSize) < 15.9 && !el.classList.contains('pd-footnote') && !el.classList.contains('field-err'));
        return { overflow: document.documentElement.scrollWidth > innerWidth + 1, invalidHeadings, small: small.map(el => el.className), h1: main.querySelector('h1')?.textContent, length: main.innerText.length, bar: !!document.querySelector('.mbar') };
      });
      check(!result.overflow, path + ' overflow at ' + width + ' / zoom ' + zoom);
      check(result.h1 && result.length > 300, path + ' missing content');
      check(!result.bar, path + ' still renders the bottom contact bar');
      if (width <= 768) { check(!result.invalidHeadings.length, path + ' compressed heading: ' + result.invalidHeadings.join(';')); check(!result.small.length, path + ' small reading text: ' + result.small.join(';')); }
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      check(await page.evaluate(() => {
        const last = document.querySelector('.foot-credit-line'), fab = document.querySelector('.wa');
        const a = last.getBoundingClientRect(), b = fab.getBoundingClientRect();
        return a.bottom <= b.top || a.right <= b.left || a.left >= b.right;
      }), path + ' footer credit obscured by WhatsApp');
      await page.evaluate(() => window.scrollTo(0, 0));
    };
    await page.setViewportSize({ width: 390, height: 844 });
    for (const path of ${JSON.stringify(paths)}) { await go(path); await inspect(path, 390); }
    const representative = ['/', '/practice', '/practice/criminal', '/bail', '/resources/understanding-bail-in-hyderabad-courts', '/resources', '/legal-statistics-hyderabad', '/about', '/contact', '/disclaimer'];
    for (const width of [320, 360, 390, 430, 1440]) {
      await page.setViewportSize({ width, height: width === 1440 ? 1000 : 844 });
      for (const locale of ['en', 'hi', 'te']) for (const path of representative) {
        const localized = (locale === 'en' ? '' : '/' + locale) + (path === '/' ? '' : path) || '/';
        await go(localized); await page.evaluate(() => document.fonts.ready); await inspect(localized, width);
        const name = locale + '-' + (path.replaceAll('/', '-') || 'home');
        await page.screenshot({ path: output + '/' + name + '-' + width + '.png', fullPage: width === 390 && ['/','/resources/understanding-bail-in-hyderabad-courts','/contact'].includes(path) });
        if (width === 390) {
          await page.evaluate(() => { document.body.style.zoom = '2'; });
          await inspect(localized, width, 2);
          await page.screenshot({ path: output + '/' + name + '-200percent.png' });
        }
      }
    }
    await page.setViewportSize({ width: 390, height: 844 });
    for (const locale of ['en', 'hi', 'te']) {
      const prefix = locale === 'en' ? '' : '/' + locale;
      await go(prefix + '/contact?source=%2Fbail#contact', true);
      const ham = page.locator('.ham');
      await ham.click(); await page.waitForSelector('#mobile-menu[open]');
      for (let i = 0; i < 12; i++) { await page.keyboard.press('Tab'); check(await focusContained('#mobile-menu'), locale + ' menu focus escaped to page content'); }
      const next = locale === 'hi' ? 'te' : 'hi';
      const switcher = page.locator('#mobile-menu .lang a[lang="' + next + '"]');
      check((await switcher.getAttribute('href')).includes('?source=%2Fbail#contact'), locale + ' lost query or fragment');
      await switcher.click(); await page.waitForURL('**/' + next + '/contact?source=%2Fbail#contact'); await hydrate();
      check(await page.locator('#mobile-menu').evaluate(el => !el.open), 'Menu did not close after switching locale');
      await ham.click(); await page.keyboard.press('Escape');
      check(await ham.evaluate(el => document.activeElement === el), 'Menu failed to restore focus');
      for (const status of [200, 503]) {
        mockStatus = status; await go(prefix + '/contact', true);
        await page.locator('#f-name').fill('QA Local Test');
        check(await page.locator('.wa').evaluate(el => getComputedStyle(el).visibility === 'hidden'), 'WhatsApp obscures focused form');
        await page.locator('#f-phone').fill('9999999999'); await page.locator('#f-email').fill('qa@example.invalid');
        await page.locator('#f-message').fill('Mock browser verification only. No real enquiry.');
        await page.locator('.btn-submit').click(); await page.locator(status === 200 ? '.form-success' : 'form [role="alert"]').waitFor();
      }
    }
    check(mockedPosts === 6, 'Expected six intercepted form submissions, saw ' + mockedPosts);
    check(!consoleErrors.length, 'Page errors: ' + consoleErrors.join(';'));
    if (failures.length) throw new Error([...new Set(failures)].join('\\n'));
    return { pages: 108, widths: [320,360,390,430,1440], localizedRepresentativeScreenshots: 150, enlargementScreenshots: 30, mockedPosts, errors: consoleErrors };
  }`);
  await writeFile(resolve(output, "result.log"), result);
} finally { await cli("close").catch(error => console.error("Browser cleanup:", error.message)); }
