import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync, appendFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import { chromium } from '@playwright/test';

const toolRequire = createRequire(join(process.env.SEO_TOOLS, 'package.json'));
const { default: lighthouse } = await import(pathToFileURL(toolRequire.resolve('lighthouse')));
const chromeLauncher = await import(pathToFileURL(toolRequire.resolve('chrome-launcher')));
const output = resolve(process.env.SEO_OUTPUT || 'seo-evidence');
mkdirSync(output, { recursive: true });
const url = 'http://127.0.0.1:3100/razvoj-programske-opreme';
const results = {};
const fingerprints = {};
const noScriptState = {};
let currentServer;
async function start(root) {
  currentServer = spawn(process.execPath, [join(root, 'node_modules/next/dist/bin/next'), 'start', '--hostname', '127.0.0.1', '--port', '3100'], { cwd: root, env: process.env, stdio: ['ignore', 'ignore', 'pipe'] });
  let errors = '';
  currentServer.stderr.on('data', data => { errors = (errors + data).slice(-4000); });
  for (let i = 0; i < 90; i++) {
    if (currentServer.exitCode !== null) throw new Error('Local server exited: ' + errors);
    try { if ((await fetch(url)).ok) return; } catch {}
    await delay(1000);
  }
  throw new Error('Local server did not become ready');
}
async function stop() {
  const server = currentServer;
  currentServer = undefined;
  if (!server || server.exitCode !== null) return;
  const ended = new Promise(resolve => server.once('exit', resolve));
  server.kill('SIGTERM');
  await Promise.race([ended, delay(5000)]);
  if (server.exitCode === null) { server.kill('SIGKILL'); await ended; }
}
async function inspect(label) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, reducedMotion: 'reduce', colorScheme: 'dark' });
  await context.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort());
  const page = await context.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  assert.equal(await page.locator('h1').count(), 1);
  assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), 'https://ju-tan.com/razvoj-programske-opreme');
  assert.ok(await page.locator('a[href="/kontakt?service=software"]').count() > 0);
  assert.equal(await page.locator('#ju-tan-google-ads').count(), 0);
  const structured = await page.locator('script[type="application/ld+json"]').allTextContents();
  structured.forEach(value => JSON.parse(value));
  assert.ok(structured.some(value => value.includes('"Service"')));
  assert.ok(structured.some(value => value.includes('"FAQPage"')));
  fingerprints[label] = await page.locator('#software-dev-hero-title').evaluate(el => {
    const style = getComputedStyle(el);
    return Object.fromEntries(['fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'color', 'letterSpacing'].map(key => [key, style[key]]));
  });
  for (const theme of ['dark', 'light']) {
    await page.evaluate(theme => {
      document.documentElement.classList.remove('dark', 'light');
      document.documentElement.classList.add(theme);
    }, theme);
    await page.screenshot({ path: join(output, label + '-' + theme + '-mobile.png') });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  }
  if (label === 'candidate') {
    assert.match(await page.title(), /Razvoj programske opreme in implementacija/);
    assert.match(await page.locator('meta[name="description"]').getAttribute('content'), /proizvodnjo in zalogo/);
    for (const heading of ['Implementacija programske opreme v proizvodnji in veleprodaji', 'Kako uvedemo programsko opremo v proizvodno podjetje?']) {
      assert.equal(await page.getByText(heading, { exact: true }).count(), 1);
    }
  }
  {
    // Compare the existing Next streaming shell without hydration on both builds.
    const noJS = await browser.newContext({ javaScriptEnabled: false, viewport: {width:390,height:844}, reducedMotion: 'reduce' });
    await noJS.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort());
    const staticPage = await noJS.newPage();
    await staticPage.goto(url);
    const heading = staticPage.locator('#software-dev-process-title');
    // Native scrolling also materializes descendants of content-visibility:auto.
    await heading.evaluate(el => el.scrollIntoView({ block: 'center' }));
    await staticPage.screenshot({ path: join(output, label + '-nojs-mobile.png') });
    noScriptState[label] = await heading.evaluate(el => {
      const hidden = [];
      for (let node = el; node; node = node.parentElement) {
        if (getComputedStyle(node).display === 'none') hidden.push(node.id || node.tagName);
      }
      return { hidden, height: el.getBoundingClientRect().height };
    });
    console.log('SEO_NOJS', JSON.stringify({label, ...noScriptState[label]}));
    if (label === 'candidate') {
      assert.equal(await heading.evaluate(el => getComputedStyle(el.parentElement.parentElement).opacity), '1');
      assert.ok((await staticPage.locator('body').textContent()).includes('Kako uvedemo programsko opremo'));
    }
    await noJS.close();
  }
  await browser.close();
}
try {
  for (const [label, root] of [['baseline', resolve(process.env.SEO_BASELINE)], ['candidate', process.cwd()]]) {
    await start(root);
    await inspect(label);
    results[label] = [];
    for (let run = 1; run <= 3; run++) {
      const chrome = await chromeLauncher.launch({ chromePath: chromium.executablePath(), chromeFlags: ['--headless', '--no-sandbox', '--disable-dev-shm-usage'] });
      try {
        const { lhr } = await lighthouse(url, {
          port: chrome.port, logLevel: 'error', onlyCategories: ['performance'],
          formFactor: 'mobile', throttlingMethod: 'simulate', blockedUrlPatterns: ['https://*'],
        });
        if (lhr.runtimeError) throw new Error(JSON.stringify(lhr.runtimeError));
        writeFileSync(join(output, label + '-' + run + '.json'), JSON.stringify(lhr, null, 2));
        const metrics = {
          score: lhr.categories.performance.score * 100,
          fcp: lhr.audits['first-contentful-paint'].numericValue,
          lcp: lhr.audits['largest-contentful-paint'].numericValue,
          tbt: lhr.audits['total-blocking-time'].numericValue,
          cls: lhr.audits['cumulative-layout-shift'].numericValue,
          bytes: lhr.audits['total-byte-weight'].numericValue,
        };
        results[label].push(metrics);
        console.log('SEO_MEASUREMENT', JSON.stringify({label, run, ...metrics}));
      } finally { await chrome.kill(); }
    }
    await stop();
  }
  assert.deepEqual(fingerprints.candidate, fingerprints.baseline, 'Premium hero typography must stay unchanged');
  assert.deepEqual(noScriptState.candidate.hidden, noScriptState.baseline.hidden, 'No new hidden no-script ancestors');
  const median = values => [...values].sort((a,b)=>a-b)[1];
  const summary = Object.fromEntries(Object.entries(results).map(([name, rows]) => [name, Object.fromEntries(Object.keys(rows[0]).map(key => [key, median(rows.map(row=>row[key]))]))]));
  const rows = Object.keys(summary.baseline).map(key => '| ' + key + ' | ' + summary.baseline[key].toFixed(3) + ' | ' + summary.candidate[key].toFixed(3) + ' |');
  const report = '# Mobile laboratory comparison\n\nBaseline: 069e5c976370158b2f4d8fba38bab93df29a558a. Candidate: ' + process.env.GITHUB_SHA + '.\n\nLighthouse 13.6.0; same runner, Chrome, production builds and URL; three fresh Chrome runs each, medians below. Default mobile simulation, HTTPS third parties blocked consistently. No production traffic or conversions. These are laboratory results, not field CWV or CTR changes.\n\n| Metric | Before | After |\n|---|---:|---:|\n' + rows.join('\n') + '\n\nFCP/LCP/TBT: milliseconds; CLS: unitless; bytes: total transfer. Typography, mobile overflow, metadata, canonical, schema, CTA and server-rendered text checks passed. No-script shell comparison: ' + JSON.stringify(noScriptState) + '. A hidden S:0 ancestor is an inherited Next streaming limitation, not a passing no-JavaScript usability check. Dark/light screenshots are included.\n';
  writeFileSync(join(output, 'comparison.md'), report);
  writeFileSync(join(output, 'summary.json'), JSON.stringify({summary, results, fingerprints, noScriptState}, null, 2));
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, report);
  console.log('SEO_SUMMARY', JSON.stringify(summary));
} finally { await stop(); }
