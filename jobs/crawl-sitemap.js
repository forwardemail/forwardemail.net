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
const isSANB = require('is-string-and-not-blank');
const mongoose = require('mongoose');
const ms = require('ms');
const parseErr = require('parse-err');
const safeStringify = require('fast-safe-stringify');
const { encode } = require('html-entities');
const sharedConfig = require('@ladjs/shared-config');
const splitLines = require('split-lines');
const { XMLParser } = require('fast-xml-parser');
const { convert } = require('html-to-text');
const { parse } = require('node-html-parser');
const _ = require('#helpers/lodash');

const RetryClient = require('#helpers/retry-client');
const SearchResults = require('#models/search-results');
const config = require('#config');
const createTangerine = require('#helpers/create-tangerine');
const emailHelper = require('#helpers/email');
const env = require('#config/env');
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

    const document = parse(text);

    // remove <nav> and <footer> and all modals
    for (const el of document.querySelectorAll(
      'nav, footer, .modal, .fixed-bottom, .no-search'
    )) {
      el.remove();
    }

    const title = document.querySelector('title').rawText;
    const content = document
      .querySelector('meta[name="description"]')
      .getAttribute('content');
    const locale = document.querySelector('html').getAttribute('lang');

    SearchResults.findOneAndUpdate(
      {
        href: url.loc
      },
      {
        href: url.loc,
        title,
        content,
        locale
      },
      {
        upsert: true
      }
    )
      .then()
      .catch((err) => logger.error(err));

    for (const header of document.querySelectorAll('h1,h2,h3,h4,h5,h6')) {
      let content = '';

      let href = url.loc;
      let id;

      id = header.getAttribute('id');
      if (!isSANB(id) || id === 'top') id = null;
      if (!id) {
        const a = header.querySelector('a');
        if (a) {
          id = a.getAttribute('id');
          if (!isSANB(id) || id === 'top') id = null;
        }
      }

      if (!id) {
        // find closest parent header
        const number = Number.parseInt(header.rawTagName.replace('h', ''), 10);
        if (number !== 1) {
          const closest = header.closest(`h${number - 1}`);
          if (closest) {
            id = closest.getAttribute('id');
            if (!isSANB(id) || id === 'top') id = null;
            if (!id) {
              const anchor = closest.querySelector('a');
              if (anchor) {
                const id = anchor.getAttribute('id');
                if (isSANB(id) && id !== 'top') href += `#${id}`;
              }
            }
          }
        }
      }

      if (id) {
        href += `#${id}`;
        href += `:~:text=${encodeURIComponent(header.text)}`;
      } else {
        href += `#:~:text=${encodeURIComponent(header.text)}`;
      }

      let node = header;
      while (
        node.nextElementSibling &&
        !['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(
          node.nextElementSibling.rawTagName
        )
      ) {
        node = node.nextElementSibling;
        content += _.compact(
          splitLines(
            convert(node.outerHTML, {
              wordwrap: false,
              linkBrackets: false,
              selectors: [
                ...[1, 2, 3, 4, 5, 6].map((i) => ({
                  selector: `h${i}`,
                  format: 'block',
                  options: { uppercase: false }
                })),
                { selector: 'form', format: 'skip' },
                { selector: 'pre', format: 'skip' },
                { selector: 'img', format: 'skip' },
                { selector: 'svg', format: 'skip' },
                { selector: 'hr', format: 'skip' },
                { selector: 'ul', options: { itemPrefix: ' ' } },
                {
                  selector: 'a',
                  options: {
                    hideLinkHrefIfSameAsText: true,
                    ignoreHref: true,
                    baseUrl: config.urls.web,
                    linkBrackets: false
                  }
                }
              ]
            }).trim()
          )
        ).join(' ');
      }

      // <https://stackoverflow.com/a/64875801>
      content = content
        .replace(/\s\s+/g, ' ')
        // .replace(/\s*([,.!?:;]+)(?!\s*$)\s*/g, '$1 ')
        .trim();

      if (content) {
        SearchResults.findOneAndUpdate(
          {
            href,
            title,
            header: header.text
          },
          {
            href,
            title,
            header: header.text,
            content,
            locale
          },
          {
            upsert: true
          }
        )
          .then()
          .catch((err) => logger.error(err));
      }
    }
  }

  // crawl the page + .png for social open graph image caching
  {
    const path = url.loc.replace(config.urls.web, '') + '.png';
    logger.debug(`crawling ${path}`);

    const { body } = await client.request({
      method: 'GET',
      path
    });

    await body.text();
    // body.destroy();
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

    for (const url of allUrls) {
      try {
        await processUrl(url);
      } catch (err) {
        logger.error(err, { url: url.loc });
      }
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
