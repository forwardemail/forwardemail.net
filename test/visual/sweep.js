/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Screenshot sweep for the redesigned marketing pages.
//
// Shoots every route in the matrix at phone and desktop widths, in light and
// dark colour schemes, with a real browser user agent (the bot detector serves
// crawler markup otherwise). Two routes are also shot with a crawler user
// agent, because the crawler branch renders different markup. With --compare
// the shots are pixel-diffed against an earlier run and a diff image is
// written for every mismatch.
//
//   node test/visual/sweep.js --out shots/after [--compare shots/before]
//     [--base http://localhost:3000] [--css build/css/app.css]
//     [--login email:password] [--only pattern]
//
//   --css     swap the stylesheet the server inlined at boot for this file,
//             so a rebuild can be checked without restarting the web process
//   --login   also shoot the signed-in routes as that account
//   --only    shoot only routes whose name matches this substring
//
// Requires a web process on --base (default http://localhost:3000).
//

const fs = require('node:fs');
const path = require('node:path');
const process = require('node:process');

/* global document, window */

const pixelmatch = require('pixelmatch');
const puppeteer = require('puppeteer');
const { PNG } = require('pngjs');

const UA = {
  human:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36',
  bot: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
};

// `clip` shoots one element instead of the page: the comparison pages carry
// tables tens of thousands of pixels tall above the redesigned tail.
const ROUTES = [
  { name: 'home', path: '/en' },
  { name: 'home-bot', path: '/en', ua: 'bot' },
  { name: 'pricing', path: '/en/private-business-email' },
  { name: 'pricing-bot', path: '/en/private-business-email', ua: 'bot' },
  { name: 'pricing-jump', path: '/en/private-business-email?pricing=true' },
  { name: 'pricing-ar', path: '/ar/private-business-email' },
  { name: 'faq', path: '/en/faq' },
  { name: 'faq-ar', path: '/ar/faq' },
  { name: 'download', path: '/en/download' },
  {
    name: 'compare',
    path: '/en/blog/best-gmail-alternative',
    clip: '.fe-landing'
  },
  { name: 'open-source', path: '/en/blog/open-source', clip: '.fe-landing' },
  { name: 'webhooks', path: '/en/free-email-webhooks' },
  { name: 'regex', path: '/en/email-forwarding-regex-pattern-filter' },
  { name: 'disposable', path: '/en/disposable-addresses' },
  { name: 'reserved', path: '/en/reserved-email-addresses' },
  { name: 'ips', path: '/en/ips' },
  { name: 'resources', path: '/en/resources' },
  { name: 'docs', path: '/en/blog/docs' },
  { name: 'guides', path: '/en/guides' },
  { name: 'not-found', path: '/en/this-page-does-not-exist' },
  { name: 'help', path: '/en/help' }
];

const SIGNED_IN_ROUTES = [
  { name: 'in-home', path: '/en/my-account/domains' },
  { name: 'in-pricing', path: '/en/private-business-email' },
  { name: 'in-download', path: '/en/download' },
  { name: 'in-faq', path: '/en/faq' }
];

const VIEWPORTS = {
  phone: { width: 390, height: 844, isMobile: true, deviceScaleFactor: 1 },
  desktop: { width: 1280, height: 800, deviceScaleFactor: 1 }
};

const SCHEMES = ['light', 'dark'];

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  if (i === -1) return fallback;
  const v = process.argv[i + 1];
  return v === undefined || v.startsWith('--') ? true : v;
}

async function login(page, base, credentials) {
  const [email, password] = credentials.split(':');
  await page.goto(`${base}/en/login`, { waitUntil: 'networkidle2' });
  await page.type('input[name="email"]', email);
  await page.type('input[name="password"]', password);
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle2' }),
    page.click('form button[type="submit"]')
  ]);
}

async function shoot({ browser, opts, route, viewportName, scheme, cookies }) {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(`console: ${m.text().slice(0, 120)}`);
  });

  await page.setUserAgent(UA[route.ua || 'human']);
  await page.setBypassCSP(true);
  await page.setViewport(VIEWPORTS[viewportName]);
  await page.emulateMediaFeatures([
    { name: 'prefers-color-scheme', value: scheme }
  ]);
  if (cookies) await page.setCookie(...cookies);

  const file = path.join(
    opts.out,
    `${route.name}--${viewportName}--${scheme}.png`
  );

  try {
    await page.goto(opts.base + route.path, {
      waitUntil: 'networkidle2',
      timeout: 60_000
    });
  } catch (err) {
    console.log(`${file}  GOTO FAIL ${err.message}`);
    await page.close();
    return null;
  }

  if (opts.css) {
    await page.evaluate((fresh) => {
      const el = document.querySelector('style[data-critical]');
      if (el) el.textContent = fresh;
    }, opts.css);
  }

  // Stop the hero console rotating and freeze transitions so two runs shoot
  // the same frame.
  await page.evaluate(() => {
    const style = document.createElement('style');
    style.textContent =
      '*,*::before,*::after{transition:none!important;animation:none!important}';
    document.head.append(style);
    window.scrollTo(0, 0);
  });
  await new Promise((resolve) => {
    setTimeout(resolve, 300);
  });

  const metrics = await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth > window.innerWidth,
    height: document.documentElement.scrollHeight
  }));

  if (route.clip) {
    const el = await page.$(route.clip);
    if (el) await el.screenshot({ path: file });
    else console.log(`${file}  no element ${route.clip}`);
  } else {
    await page.screenshot({ path: file, fullPage: true });
  }

  await page.close();
  return { file, metrics, errors };
}

function compare(file, compareDir) {
  const beforePath = path.join(compareDir, path.basename(file));
  if (!fs.existsSync(beforePath)) return { status: 'new' };

  const a = PNG.sync.read(fs.readFileSync(beforePath));
  const b = PNG.sync.read(fs.readFileSync(file));
  if (a.width !== b.width) {
    return {
      status: 'resized',
      detail: `${a.width}x${a.height} -> ${b.width}x${b.height}`
    };
  }

  // A page that grew or shrank is compared over the rows both have, and the
  // first row that differs is reported: that is where the layout diverged.
  const height = Math.min(a.height, b.height);
  const diff = new PNG({ width: a.width, height });
  const mismatched = pixelmatch(
    a.data.subarray(0, a.width * height * 4),
    b.data.subarray(0, b.width * height * 4),
    diff.data,
    a.width,
    height,
    { threshold: 0.1 }
  );

  if (mismatched === 0 && a.height === b.height) return { status: 'same' };

  let firstRow = -1;
  for (let y = 0; y < height && firstRow === -1; y++) {
    for (let x = 0; x < a.width; x++) {
      const i = (y * a.width + x) * 4;
      if (diff.data[i] === 255 && diff.data[i + 1] === 0) {
        firstRow = y;
        break;
      }
    }
  }

  const diffPath = file.replace(/\.png$/, '.diff.png');
  fs.writeFileSync(diffPath, PNG.sync.write(diff));
  const sized =
    a.height === b.height ? '' : ` height ${a.height} -> ${b.height},`;
  return {
    status: a.height === b.height ? 'changed' : 'resized',
    detail: `${sized} ${mismatched} px differ, first at y=${firstRow}`
  };
}

async function main() {
  const opts = {
    out: arg('out'),
    compare: arg('compare'),
    base: arg('base', 'http://localhost:3000'),
    css: arg('css'),
    login: arg('login'),
    only: arg('only')
  };

  if (!opts.out || opts.out === true) {
    console.error(
      'usage: node test/visual/sweep.js --out <dir> [--compare <dir>]'
    );
    process.exit(2);
  }

  if (opts.css) opts.css = fs.readFileSync(opts.css, 'utf8');
  fs.mkdirSync(opts.out, { recursive: true });

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox']
  });

  let cookies;
  if (opts.login) {
    const page = await browser.newPage();
    await page.setUserAgent(UA.human);
    await login(page, opts.base, opts.login);
    cookies = await page.cookies();
    await page.close();
  }

  const routes = [
    ...ROUTES.map((r) => ({ ...r, cookies: null })),
    ...(cookies ? SIGNED_IN_ROUTES.map((r) => ({ ...r, cookies })) : [])
  ].filter((r) => !opts.only || r.name.includes(opts.only));

  const totals = { same: 0, changed: 0, new: 0, resized: 0 };
  let failures = 0;

  for (const route of routes) {
    for (const viewportName of Object.keys(VIEWPORTS)) {
      for (const scheme of SCHEMES) {
        const result = await shoot({
          browser,
          opts,
          route,
          viewportName,
          scheme,
          cookies: route.cookies
        });
        if (!result) {
          failures++;
          continue;
        }

        const parts = [path.basename(result.file).padEnd(40)];
        if (result.metrics.overflow) parts.push('H-OVERFLOW');
        if (result.errors.length > 0) parts.push(`ERR ${result.errors[0]}`);
        if (opts.compare) {
          const c = compare(result.file, opts.compare);
          totals[c.status]++;
          parts.push(c.status.toUpperCase(), c.detail || '');
        }

        console.log(parts.join(' '));
      }
    }
  }

  await browser.close();

  if (opts.compare) {
    console.log(
      `\nsame ${totals.same}  changed ${totals.changed}  resized ${totals.resized}  new ${totals.new}`
    );
  }

  if (failures > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
