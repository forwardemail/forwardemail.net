/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs/promises');
const path = require('node:path');
const process = require('node:process');

const Graceful = require('@ladjs/graceful');
const Cabin = require('cabin');

const logger = require('#helpers/logger');
const SitemapFetcher = require('#helpers/customer-support-ai/sitemap-fetcher');

// Real, legitimate first-party URLs that the FAQ cites but that never
// appear in forwardemail.net's own sitemap.xml crawl - either because
// they're utility/tool pages excluded from sitemap generation (/denylist,
// /help) or because they live on a different first-party subdomain
// entirely (mail., status.). Without these, the response generator's
// "ONLY use URLs from this list" policy makes it refuse to cite pages the
// FAQ itself links to.
const EXTRA_URLS = [
  'https://forwardemail.net/download',
  'https://forwardemail.net/denylist',
  'https://forwardemail.net/help',
  'https://forwardemail.net/technical-whitepaper.pdf',
  'https://mail.forwardemail.net',
  'https://status.forwardemail.net'
];

const cabin = new Cabin({ logger });
const graceful = new Graceful({
  cabins: [cabin],
  logger
});

graceful.listen();

/**
 * Extract URL list from Forward Email sitemap
 * This job fetches all URLs from the sitemap and saves them to a JSON file
 * The URL list is used by the response generator to validate links
 */
(async () => {
  try {
    logger.info('Starting sitemap URL extraction');

    // Initialize sitemap fetcher
    const fetcher = new SitemapFetcher('https://forwardemail.net/sitemap.xml');

    // Fetch all URLs (already filtered to non-localized or /en/ only)
    const sitemapUrls = await fetcher.fetchSitemap();
    const urls = [...new Set([...sitemapUrls, ...EXTRA_URLS])];

    logger.info('URLs extracted from sitemap', {
      sitemapUrls: sitemapUrls.length,
      extraUrls: EXTRA_URLS.length,
      totalUrls: urls.length
    });

    // Save to JSON file in LANCEDB_PATH directory
    const lancedbPath =
      process.env.LANCEDB_PATH ||
      path.join(
        process.env.HOME || process.env.USERPROFILE,
        '.local/share/lancedb'
      );
    await fs.mkdir(lancedbPath, { recursive: true });

    const outputPath = path.join(lancedbPath, 'valid-urls.json');
    await fs.writeFile(
      outputPath,
      JSON.stringify(
        {
          generatedAt: new Date().toISOString(),
          source: 'https://forwardemail.net/sitemap.xml',
          count: urls.length,
          urls
        },
        null,
        2
      )
    );

    logger.info('URL list saved successfully', {
      outputPath,
      urlCount: urls.length
    });

    process.exit(0);
  } catch (err) {
    logger.error('Sitemap URL extraction failed', { error: err });
    process.exit(1);
  }
})();
