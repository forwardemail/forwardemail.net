/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('node:process');
const { parentPort } = require('node:worker_threads');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const _ = require('lodash');
const delay = require('delay');
const mongoose = require('mongoose');
const ms = require('ms');
const parseErr = require('parse-err');
const { XMLParser } = require('fast-xml-parser');

const RetryClient = require('#helpers/retry-client');
const config = require('#config');
const emailHelper = require('#helpers/email');
const env = require('#config/env');
const logger = require('#helpers/logger');
const retryRequest = require('#helpers/retry-request');
const setupMongoose = require('#helpers/setup-mongoose');

const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

// <https://github.com/nodejs/undici/issues/583>
const client = new RetryClient(config.urls.web, {
  autoSelectFamily: config.env !== 'production'
});

graceful.listen();

(async () => {
  await setupMongoose(logger);

  try {
    //
    // fetch sitemap and then use undici to GET requests for every page
    //
    const response = await client.request({
      method: 'GET',
      path: '/sitemap.xml'
    });

    const xml = await response.body.text();
    const parser = new XMLParser({});
    const result = parser.parse(xml, true);

    for (const url of result.urlset.url) {
      // crawl the page for caching support and localization
      {
        const path = url.loc.replace(config.urls.web, '');
        logger.debug(`crawling ${path}`);
        // eslint-disable-next-line no-await-in-loop
        const { body } = await client.request({
          method: 'GET',
          path
        });

        // eslint-disable-next-line no-await-in-loop
        await body.text();
        // body.destroy();
      }

      // crawl the page + .png for social open graph image caching
      {
        const path = url.loc.replace(config.urls.web, '') + '.png';
        logger.debug(`crawling ${path}`);
        // eslint-disable-next-line no-await-in-loop
        const { body } = await client.request({
          method: 'GET',
          path
        });

        // eslint-disable-next-line no-await-in-loop
        await body.text();
        // body.destroy();
      }
    }

    const sitemap = `${config.urls.web}/sitemap.xml`;

    // google
    try {
      const { body } = await retryRequest(
        `https://www.google.com/ping?sitemap=${sitemap}`,
        {
          method: 'POST'
        }
      );
      await body.text();
      logger.debug('submitted sitemap to google');
    } catch (err) {
      await logger.error(err);
    }

    // yandex
    try {
      const { body } = await retryRequest(
        `https://webmaster.yandex.ru/ping?sitemap=${sitemap}`,
        {
          method: 'POST'
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
        result.urlset.url.map((o) => o.loc),
        500
      );
      for (const urlList of urlLists) {
        try {
          // eslint-disable-next-line no-await-in-loop
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
              })
            }
          );
          // eslint-disable-next-line no-await-in-loop
          await body.text();
          logger.debug('submitted %s urls to bing', urlList.length);
        } catch (err) {
          // eslint-disable-next-line no-await-in-loop
          await logger.error(err);
        }
      }

      logger.debug('submitted sitemap to bing');
    }

    // after successful run wait 24 hours then exit
    await delay(ms('1d'));
  } catch (err) {
    await logger.error(err);
    // send an email to admins of the error
    await emailHelper({
      template: 'alert',
      message: {
        to: config.email.message.from,
        subject: 'Crawl Sitemap Error'
      },
      locals: {
        message: `<pre><code>${JSON.stringify(
          parseErr(err),
          null,
          2
        )}</code></pre>`
      }
    });
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
