// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('process');
const { parentPort } = require('worker_threads');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const mongoose = require('mongoose');
const parseErr = require('parse-err');
const { XMLParser } = require('fast-xml-parser');
const { Client, errors } = require('undici');

const emailHelper = require('#helpers/email');
const config = require('#config');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');

const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

// <https://github.com/nodejs/undici/issues/583>
const client = new Client(config.urls.web, {
  // pipelining: 0
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
      path: '/sitemap.xml',
      signal: AbortSignal.timeout(5000),
      throwOnError: true
    });

    // the error code is between 200-400 (e.g. 302 redirect)
    // in order to mirror the behavior of `throwOnError` we will re-use the undici errors
    // <https://github.com/nodejs/undici/issues/2093>
    if (response.statusCode !== 200)
      throw new errors.ResponseStatusCodeError(
        `Response status code ${response.statusCode}`,
        response.statusCode,
        response.headers
      );

    const xml = await response.body.text();
    const parser = new XMLParser({});
    const result = parser.parse(xml, true);

    for (const url of result.urlset.url) {
      // crawl the page for caching support and localization
      {
        const path = url.loc.replace(config.urls.web, '');
        logger.info(`crawling ${path}`);
        // eslint-disable-next-line no-await-in-loop
        const { statusCode, headers, body } = await client.request({
          method: 'GET',
          path,
          signal: AbortSignal.timeout(10000),
          throwOnError: true
        });

        if (statusCode !== 200)
          throw new errors.ResponseStatusCodeError(
            `Response status code ${statusCode}`,
            statusCode,
            headers
          );

        // eslint-disable-next-line no-await-in-loop
        await body.text();
        // body.destroy();
      }

      // crawl the page + .png for social open graph image caching
      {
        const path = url.loc.replace(config.urls.web, '') + '.png';
        logger.info(`crawling ${path}`);
        // eslint-disable-next-line no-await-in-loop
        const { statusCode, headers, body } = await client.request({
          method: 'GET',
          path,
          signal: AbortSignal.timeout(10000),
          throwOnError: true
        });
        if (statusCode !== 200)
          throw new errors.ResponseStatusCodeError(
            `Response status code ${statusCode}`,
            statusCode,
            headers
          );

        // eslint-disable-next-line no-await-in-loop
        await body.text();
        // body.destroy();
      }
    }
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
