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

const AdmZip = require('adm-zip');
const Graceful = require('@ladjs/graceful');
const Redis = require('@ladjs/redis');
const Tangerine = require('tangerine');
const dayjs = require('dayjs-with-plugins');
const got = require('got');
const isFQDN = require('is-fqdn');
const isSANB = require('is-string-and-not-blank');
const pMap = require('p-map');
const parseErr = require('parse-err');
const safeStringify = require('fast-safe-stringify');
const { encode } = require('html-entities');
const sharedConfig = require('@ladjs/shared-config');
const splitLines = require('split-lines');
const { fromUrl, parseDomain, ParseResultType } = require('parse-domain');
const _ = require('#helpers/lodash');
const parseRootDomain = require('#helpers/parse-root-domain');

const config = require('#config');
const setupMongoose = require('#helpers/setup-mongoose');
const emailHelper = require('#helpers/email');
const logger = require('#helpers/logger');

const breeSharedConfig = sharedConfig('BREE');
const client = new Redis(breeSharedConfig.redis, logger);
const graceful = new Graceful({
  redisClients: [client],
  logger
});

graceful.listen();

// this uses in-memory Map cache for optimization
const resolver = new Tangerine({
  logger,
  servers: ['1.1.1.1', '8.8.8.8', '1.0.0.1', '8.8.4.4']
});

async function checkDate(date) {
  const list = `http://s3-us-west-1.amazonaws.com/umbrella-static/top-1m-${date}.csv.zip`;
  logger.info('updating list', { list });
  const res = await got(list, {
    responseType: 'buffer',
    // <https://github.com/sindresorhus/got/discussions/1813#discussioncomment-3249169>
    retry: {
      statusCodes: [...got.defaults.options.retry.statusCodes, 403, 404]
    }
  });

  const zip = new AdmZip(res.body);
  const zipEntries = zip.getEntries();

  let data;
  for (const entry of zipEntries) {
    if (entry.name === `top-1m.csv`) {
      data = zip.readAsText(entry);
      break;
    }
  }

  if (!data) throw new Error(`top-1m.csv was not in ZIP file`);

  const domains = new Set();
  const map = new Map();
  const lines = splitLines(data);
  await pMap(
    lines,
    async (line) => {
      const [, domain] = line.trim().split(',');
      // Ignore Microsoft Outlook and Outlook Address Book File (olk)
      // And also things like "internal" which shouldn't be in the Umbrella list
      if (!isFQDN(domain)) return;

      const parseResult = parseDomain(fromUrl(domain));

      if (
        parseResult.type !== ParseResultType.Listed ||
        !_.isObject(parseResult.icann) ||
        !isSANB(parseResult.icann.domain) ||
        !_.isArray(parseResult.icann.topLevelDomains) ||
        _.isEmpty(parseResult.icann.topLevelDomains)
      )
        return;

      const rootDomain = `${
        parseResult.icann.domain
      }.${parseResult.icann.topLevelDomains.join('.')}`.toLowerCase();

      // lookup this domain to see if it's using our MX servers
      try {
        const exchanges = await resolver.resolveMx(rootDomain);
        for (const entry of exchanges) {
          if (isFQDN(entry.exchange)) {
            const rootExchange = parseRootDomain(entry.exchange);
            if (map.has(rootExchange))
              map.set(rootExchange, map.get(rootExchange) + 1);
            else map.set(rootExchange, 1);
            // TODO: instead of counter user a set and add unique root domains
            if (rootExchange === 'forwardemail.net') domains.add(rootDomain);
          }
        }
      } catch {}
    },
    { concurrency: config.concurrency }
  );

  //
  // TODO: turn this into a dedicated page
  //       (e.g. top email providers across top 1M domains) (not Alexa, but Umbrella)
  // <https://medium.com/cisco-shifted/cisco-umbrella-releases-free-top-1-million-sites-list-8497fba58efe>
  // <https://archive.is/dyHtj>
  //
  // NOTE: we could also use this but we'd have to parse billions in background
  //       <https://domainsproject.org/STATS.html>
  //       <https://www.patreon.com/tb0hdan>
  //
  // NOTE: this dataset seems to not be complete
  //       <https://viewdns.info/reversemx/?mx=mx1.forwardemail.net> ($66)
  //
  //       (and the API's for securitytrails/whoisxmlapi.com either don't work)
  //       (or they are way too expensive (e.g $100-500+/mo)
  //

  // write to redis the list and counters

  // email admin with dataset and csv attached list of domains
}

(async () => {
  try {
    await setupMongoose(logger);

    // <http://s3-us-west-1.amazonaws.com/umbrella-static/index.html>
    await checkDate(dayjs().subtract(1, 'day').format('YYYY-MM-DD'));
  } catch (err) {
    await logger.error(err);
    await emailHelper({
      template: 'alert',
      message: {
        to: config.alertsEmail,
        subject: 'Scan MX had an error'
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
