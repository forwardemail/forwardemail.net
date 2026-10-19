/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#helpers/polyfill-towellformed');
// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('node:process');
const { parentPort } = require('node:worker_threads');
const { setTimeout } = require('node:timers/promises');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const Redis = require('@ladjs/redis');
const mongoose = require('mongoose');
const ms = require('ms');
const parseErr = require('parse-err');
const safeStringify = require('fast-safe-stringify');
const { encode } = require('html-entities');
const sharedConfig = require('@ladjs/shared-config');
const { XMLParser } = require('fast-xml-parser');
const pMap = require('p-map');
const _ = require('#helpers/lodash');

const RetryClient = require('#helpers/retry-client');
const SearchResults = require('#models/search-results');
const config = require('#config');
const createTangerine = require('#helpers/create-tangerine');
const emailHelper = require('#helpers/email');
const getSearchEntries = require('#helpers/get-search-entries');
const env = require('#config/env');
const locales = require('#config/locales');
const logger = require('#helpers/logger');
const retryRequest = require('#helpers/retry-request');
const setupMongoose = require('#helpers/setup-mongoose');

// <https://github.com/nodejs/undici/issues/583>
const client = new RetryClient(config.urls.web, {
  autoSelectFamily: config.env !== 'production'
});

const breeSharedConfig = sharedConfig('BREE');
const redisClient = new Redis(breeSharedConfig.redis, logger);
const resolver = createTangerine(redisClient, logger);

const graceful = new Graceful({
  mongooses: [mongoose],
  redisClients: [redisClient],
  logger
});

graceful.listen();

//
// Build a regex to strip locale prefixes from URL paths.
// Sitemap URLs look like: https://forwardemail.net/en/faq
// We need the path without the locale prefix for pattern matching.
//
const localeRegex = new RegExp(`^/(${locales.join('|')})/`);

/**
 * Strip the locale prefix from a URL path.
 * e.g. "/en/faq" → "/faq", "/fr/about" → "/about"
 * @param {string} urlPath - Path portion of the URL
 * @returns {string} Path without locale prefix
 */
function stripLocale(urlPath) {
  return urlPath.replace(localeRegex, '/');
}

//
// Programmatic use-case page suffixes (these are thin/generated SEO pages).
// Matches the regex used in routes/web/index.js for isStaticUseCase detection.
//
const PROGRAMMATIC_SUFFIXES_RE =
  /-(email-forwarding|email-provider|email-hosting|email-service|email-newsletters|email-api|email-masking|email-marketing|bulk-email-service|mass-email-service|email-automation|email-security|email-management|email-platform|email-solutions)$/;

/**
 * Determine whether a URL path corresponds to a landing/SEO page
 * that should be excluded from the internal search index.
 *
 * Excluded families:
 * 1. Programmatic use-case pages (noun + title suffix combos)
 * 2. Individual alternative pages (/blog/best-*-alternative)
 * 3. Pairwise comparison pages (/blog/*-vs-*-email-service-comparison)
 * 4. Comparison landing pages (/blog/best-email-service, etc.)
 * 5. Open-source platform pages (/blog/open-source/*-email-server, *-email-clients)
 *
 * @param {string} urlPath - Full URL path (with locale prefix)
 * @returns {boolean} true if the page should be excluded from search
 */
function isLandingPage(urlPath) {
  const path = stripLocale(urlPath);

  // 1. Programmatic use-case pages
  if (PROGRAMMATIC_SUFFIXES_RE.test(path)) return true;

  // 2. Individual alternative pages
  if (/^\/blog\/best-.+-alternative$/.test(path)) return true;

  // 3. Pairwise comparison pages
  if (/^\/blog\/.+-vs-.+-email-service-comparison$/.test(path)) return true;

  // 4. Comparison landing pages
  if (
    [
      '/blog/best-email-service',
      '/blog/best-private-email-service',
      '/blog/best-open-source-email-service',
      '/blog/best-transactional-email-service',
      '/blog/best-email-api-developer-service',
      '/blog/best-email-spam-filtering-service'
    ].includes(path)
  )
    return true;

  // 5. Open-source platform pages (individual server/client pages, not the index)
  if (/^\/blog\/open-source\/.+-(email-server|email-clients)$/.test(path))
    return true;

  return false;
}

/**
 * Fetch and parse a sitemap XML file
 * @param {string} sitemapPath - Path to the sitemap
 * @returns {Promise<Object>} Parsed XML result
 */
async function fetchSitemap(sitemapPath) {
  const response = await client.request({
    method: 'GET',
    path: sitemapPath,
    resolver
  });

  const xml = await response.body.text();
  const parser = new XMLParser({});
  return parser.parse(xml, true);
}

/**
 * Extract URLs from a parsed sitemap result
 * @param {Object} result - Parsed XML result
 * @returns {Array} Array of URL objects with loc property
 */
function extractUrls(result) {
  if (!result.urlset || !result.urlset.url) {
    return [];
  }

  const urls = Array.isArray(result.urlset.url)
    ? result.urlset.url
    : [result.urlset.url];

  // Filter out undefined/null entries and entries without loc property
  return urls.filter((url) => url && url.loc);
}

/**
 * Extract child sitemap URLs from a sitemap index
 * @param {Object} result - Parsed XML result
 * @returns {Array} Array of sitemap URL strings
 */
function extractSitemapIndexUrls(result) {
  if (!result.sitemapindex || !result.sitemapindex.sitemap) {
    return [];
  }

  const sitemaps = Array.isArray(result.sitemapindex.sitemap)
    ? result.sitemapindex.sitemap
    : [result.sitemapindex.sitemap];

  // Filter and extract loc from each sitemap entry
  return sitemaps
    .filter((sitemap) => sitemap && sitemap.loc)
    .map((sitemap) => sitemap.loc);
}

// how many search index writes of one page run at once
const SEARCH_WRITE_CONCURRENCY = 10;

//
// Read a response body to the end without keeping it as a string (the
// requests below only warm the web server's cache; a PNG decoded as UTF-8
// text cost CPU for nothing)
//
async function drain(body) {
  await body.arrayBuffer();
}

/**
 * Process a single URL - crawl and index content
 * @param {Object} url - URL object with loc property
 */
async function processUrl(url) {
  // crawl the page for caching support and localization
  {
    const path = url.loc.replace(config.urls.web, '');
    logger.debug(`crawling ${path}`);

    const { body } = await client.request({
      method: 'GET',
      path
    });

    const text = await body.text();

    // the page's entry and one for each heading (helpers/get-search-entries)
    const { page, sections } = getSearchEntries(text, url.loc);

    //
    // Write them a few at a time, and finish before the next page. Each
    // write used to be started without waiting, so a page with thousands of
    // headings queued thousands of writes at once, for every page crawled.
    //
    await pMap(
      [
        [{ href: page.href }, page],
        ...sections.map((section) => [
          {
            href: section.href,
            title: section.title,
            header: section.header
          },
          section
        ])
      ],
      async ([filter, update]) => {
        try {
          await SearchResults.findOneAndUpdate(filter, update, {
            upsert: true
          });
        } catch (err) {
          logger.error(err);
        }
      },
      { concurrency: SEARCH_WRITE_CONCURRENCY }
    );
  }

  // crawl the page + .png for social open graph image caching
  {
    const path = url.loc.replace(config.urls.web, '') + '.png';
    logger.debug(`crawling ${path}`);

    const { body } = await client.request({
      method: 'GET',
      path
    });

    await drain(body);
  }
}

(async () => {
  await setupMongoose(logger);

  try {
    //
    // fetch sitemap and then use undici to GET requests for every page
    //
    const result = await fetchSitemap('/sitemap.xml');

    // Collect all URLs from all sitemaps
    let allUrls = [];

    // Check if this is a sitemap index (contains sitemapindex with child sitemaps)
    const childSitemapUrls = extractSitemapIndexUrls(result);

    if (childSitemapUrls.length > 0) {
      // This is a sitemap index - fetch each child sitemap
      logger.debug(
        `Found sitemap index with ${childSitemapUrls.length} child sitemaps`
      );

      for (const sitemapUrl of childSitemapUrls) {
        try {
          const sitemapPath = sitemapUrl.replace(config.urls.web, '');
          logger.debug(`Fetching child sitemap: ${sitemapPath}`);

          const childResult = await fetchSitemap(sitemapPath);
          const urls = extractUrls(childResult);
          allUrls = [...allUrls, ...urls];

          logger.debug(`Found ${urls.length} URLs in ${sitemapPath}`);
        } catch (err) {
          logger.error(err, { sitemapUrl });
        }
      }
    } else {
      // This is a regular sitemap with URLs directly
      allUrls = extractUrls(result);
    }

    logger.debug(`Total URLs to crawl: ${allUrls.length}`);

    //
    // Partition URLs into indexable and landing/SEO pages.
    // Landing pages still get crawled for caching/OG images but are
    // excluded from the internal search index.
    //
    const indexableUrls = [];
    const landingUrls = [];
    for (const url of allUrls) {
      const path = url.loc.replace(config.urls.web, '');
      if (isLandingPage(path)) {
        landingUrls.push(url);
      } else {
        indexableUrls.push(url);
      }
    }

    logger.debug(
      `Indexable: ${indexableUrls.length}, Landing (skip index): ${landingUrls.length}`
    );

    // Process indexable pages (crawl + index)
    for (const url of indexableUrls) {
      try {
        await processUrl(url);
      } catch (err) {
        logger.error(err, { url: url.loc });
      }
    }

    // Crawl landing pages for caching/OG only (no search indexing)
    for (const url of landingUrls) {
      try {
        const path = url.loc.replace(config.urls.web, '');
        logger.debug(`crawling (cache only) ${path}`);

        const { body } = await client.request({
          method: 'GET',
          path
        });

        await drain(body);

        // Also crawl .png for OG image caching
        const pngPath = path + '.png';
        logger.debug(`crawling ${pngPath}`);
        const { body: pngBody } = await client.request({
          method: 'GET',
          path: pngPath
        });

        await drain(pngBody);
      } catch (err) {
        logger.error(err, { url: url.loc });
      }
    }

    //
    // Clean up stale search index entries for landing pages.
    // Use a regex that matches any landing page href pattern.
    //
    try {
      const deleteResult = await SearchResults.deleteMany({
        $or: [
          { href: { $regex: PROGRAMMATIC_SUFFIXES_RE } },
          { href: { $regex: /\/blog\/best-.+-alternative/ } },
          { href: { $regex: /\/blog\/.+-vs-.+-email-service-comparison/ } },
          {
            href: {
              $regex: /\/blog\/open-source\/.+-(email-server|email-clients)/
            }
          },
          {
            href: {
              $in: [
                '/blog/best-email-service',
                '/blog/best-private-email-service',
                '/blog/best-open-source-email-service',
                '/blog/best-transactional-email-service',
                '/blog/best-email-api-developer-service',
                '/blog/best-email-spam-filtering-service'
              ].flatMap((p) =>
                locales.map((l) => `${config.urls.web}/${l}${p}`)
              )
            }
          }
        ]
      });
      logger.debug(
        `Cleaned up ${deleteResult.deletedCount} stale landing page search entries`
      );
    } catch (err) {
      logger.error(err);
    }

    const sitemap = `${config.urls.web}/sitemap.xml`;

    // google
    // <https://developers.google.com/search/blog/2023/06/sitemaps-lastmod-ping>
    // try {
    //   const { body } = await retryRequest(
    //     `https://www.google.com/ping?sitemap=${sitemap}`,
    //     {
    //       method: 'POST',
    //       resolver
    //     }
    //   );
    //   await body.text();
    //   logger.debug('submitted sitemap to google');
    // } catch (err) {
    //   await logger.error(err);
    // }

    // yandex
    try {
      const { body } = await retryRequest(
        `https://webmaster.yandex.ru/ping?sitemap=${sitemap}`,
        {
          method: 'POST',
          resolver
        }
      );
      await body.text();
      logger.debug('submitted sitemap to yandex');
    } catch (err) {
      await logger.error(err);
    }

    //
    // bing, yahoo
    // <https://www.bing.com/indexnow>
    // <https://blogs.bing.com/webmaster/may-2019/Easy-set-up-guide-for-Bing%E2%80%99s-Adaptive-URL-submission-API>
    // <https://blogs.bing.com/webmaster/november-2019/Accessing-Bing-webmaster-tools-api-using-cURL>
    // (can submit 500 at a time using bulk API endpoint)
    //
    // curl -X POST "https://ssl.bing.com/webmaster/api.svc/json/SubmitUrlBatch?apikey=API_KEY"
    // -H "Content-Type: application/json"
    // -H "charset: utf-8"
    // -d '{"siteUrl":"https://www.example.com", "urlList":["https://www.example.com/about", "https://www.example.com/projects"]}'
    //
    // Response:
    // {"d":null}
    //
    if (env.MICROSOFT_BING_API_KEY) {
      const urlLists = _.chunk(
        allUrls.map((o) => o.loc),
        500
      );
      for (const urlList of urlLists) {
        try {
          const { body } = await retryRequest(
            `https://ssl.bing.com/webmaster/api.svc/json/SubmitUrlBatch?apikey=${env.MICROSOFT_BING_API_KEY}`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                // eslint-disable-next-line unicorn/text-encoding-identifier-case
                charset: 'utf-8'
              },
              body: JSON.stringify({
                siteUrl: config.urls.web,
                urlList
              }),
              resolver
            }
          );

          await body.text();
          logger.debug('submitted %s urls to bing', urlList.length);
        } catch (err) {
          await logger.error(err);
        }
      }

      logger.debug('submitted sitemap to bing');
    }

    // after successful run wait 24 hours then exit
    await setTimeout(ms('1d'));
  } catch (err) {
    await logger.error(err);
    // send an email to admins of the error
    await emailHelper({
      template: 'alert',
      message: {
        to: config.alertsEmail,
        subject: 'Crawl Sitemap Error'
      },
      locals: {
        message: `<pre><code>${encode(
          safeStringify(parseErr(err), null, 2)
        )}</code></pre>`
      }
    });
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
