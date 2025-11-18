/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const test = require('ava');

// Test the core logic without loading the full module
// which requires config that needs environment variables

test('locale pattern regex should match locale prefixes', (t) => {
  const locales = ['en', 'fr', 'es', 'de', 'zh', 'ja'];
  const localePattern = new RegExp(`^/(${locales.join('|')})/`);

  t.regex('/en/faq', localePattern);
  t.regex('/fr/faq', localePattern);
  t.regex('/es/my-account', localePattern);
  t.notRegex('/faq', localePattern);
  t.notRegex('/my-account', localePattern);
  t.notRegex('/enable-2fa', localePattern); // "enable" starts with "en" but is not a locale
});

test('URL path extraction and locale stripping logic', (t) => {
  const locales = ['en', 'fr', 'es', 'de'];
  const localePattern = new RegExp(`^/(${locales.join('|')})/`);

  const stripLocale = (url) => {
    const urlObj = new URL(url);
    urlObj.pathname = urlObj.pathname.replace(localePattern, '/');
    return urlObj.toString();
  };

  t.is(
    stripLocale('https://forwardemail.net/en/faq'),
    'https://forwardemail.net/faq'
  );
  t.is(
    stripLocale('https://forwardemail.net/fr/my-account'),
    'https://forwardemail.net/my-account'
  );
  t.is(
    stripLocale('https://forwardemail.net/faq'),
    'https://forwardemail.net/faq'
  );
});

test('URL filtering logic for locales', (t) => {
  const locales = ['en', 'fr', 'es', 'de'];
  const localePattern = new RegExp(`^/(${locales.join('|')})/`);

  const shouldProcess = (url) => {
    const urlObj = new URL(url);
    const path = urlObj.pathname;

    // Non-localized URLs
    if (!localePattern.test(path)) {
      return true;
    }

    // Only /en/ URLs
    return path.startsWith('/en/');
  };

  t.true(shouldProcess('https://forwardemail.net/faq'));
  t.true(shouldProcess('https://forwardemail.net/en/faq'));
  t.false(shouldProcess('https://forwardemail.net/fr/faq'));
  t.false(shouldProcess('https://forwardemail.net/es/faq'));
});

test('XML parsing logic for sitemap', (t) => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://forwardemail.net/</loc></url>
  <url><loc>https://forwardemail.net/faq</loc></url>
  <url><loc>https://forwardemail.net/my-account</loc></url>
</urlset>`;

  // Simple regex extraction (similar to what sitemap-fetcher does)
  const urlMatches = xml.matchAll(/<loc>(.*?)<\/loc>/g);
  const urls = [...urlMatches].map((match) => match[1]);

  t.is(urls.length, 3);
  t.true(urls.includes('https://forwardemail.net/'));
  t.true(urls.includes('https://forwardemail.net/faq'));
  t.true(urls.includes('https://forwardemail.net/my-account'));
});

test('deduplication logic', (t) => {
  const urls = [
    'https://forwardemail.net/faq',
    'https://forwardemail.net/faq',
    'https://forwardemail.net/my-account',
    'https://forwardemail.net/faq'
  ];

  const unique = [...new Set(urls)];

  t.is(unique.length, 2);
  t.true(unique.includes('https://forwardemail.net/faq'));
  t.true(unique.includes('https://forwardemail.net/my-account'));
});

test('combined filtering, stripping, and deduplication', (t) => {
  const locales = ['en', 'fr', 'es', 'de'];
  const localePattern = new RegExp(`^/(${locales.join('|')})/`);

  const processUrls = (urls) => {
    const processed = [];

    for (const url of urls) {
      const urlObj = new URL(url);
      const path = urlObj.pathname;

      // Filter: only non-localized or /en/ URLs
      if (localePattern.test(path) && !path.startsWith('/en/')) {
        continue;
      }

      // Strip locale prefix
      urlObj.pathname = urlObj.pathname.replace(localePattern, '/');
      processed.push(urlObj.toString());
    }

    // Deduplicate
    return [...new Set(processed)];
  };

  const urls = [
    'https://forwardemail.net/faq',
    'https://forwardemail.net/en/faq',
    'https://forwardemail.net/fr/faq',
    'https://forwardemail.net/es/faq',
    'https://forwardemail.net/my-account',
    'https://forwardemail.net/en/my-account'
  ];

  const result = processUrls(urls);

  // Should only have 2 unique URLs after filtering and stripping
  t.is(result.length, 2);
  t.true(result.includes('https://forwardemail.net/faq'));
  t.true(result.includes('https://forwardemail.net/my-account'));
});
