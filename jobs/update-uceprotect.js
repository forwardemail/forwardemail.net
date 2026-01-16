/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('node:process');
const { parentPort } = require('node:worker_threads');

const Graceful = require('@ladjs/graceful');
const Redis = require('@ladjs/redis');
const got = require('got');
const ms = require('ms');
const pMapSeries = require('p-map-series');
const parseErr = require('parse-err');
const sharedConfig = require('@ladjs/shared-config');
const safeStringify = require('fast-safe-stringify');
const { encode } = require('html-entities');
const splitLines = require('split-lines');
const validator = require('@forwardemail/validator');
const { ungzip } = require('node-gzip');

const config = require('#config');
const emailHelper = require('#helpers/email');
const logger = require('#helpers/logger');

const breeSharedConfig = sharedConfig('BREE');
const client = new Redis(breeSharedConfig.redis, logger);
const graceful = new Graceful({
  redisClients: [client],
  logger
});
const LISTS = [
  {
    name: 'UCEPROTECT Level 1',
    prefix: 'denylist',
    url: 'http://wget-mirrors.uceprotect.net/rbldnsd-all/dnsbl-1.uceprotect.net.gz'
  },
  {
    name: 'UCEPROTECT Backscatterer',
    prefix: 'backscatter',
    url: 'http://wget-mirrors.uceprotect.net/rbldnsd-all/ips.backscatterer.org.gz'
  }
];
const SEVEN_DAYS_TO_MS = ms('7d');

graceful.listen();

async function mapper(list) {
  logger.info('updating list', { list });
  const res = await got(list.url, {
    responseType: 'buffer',
    decompress: false,
    // <https://github.com/sindresorhus/got/discussions/1813#discussioncomment-3249169>
    retry: {
      statusCodes: [...got.defaults.options.retry.statusCodes, 403, 404]
    }
  });
  if (
    res.headers['content-type'] === 'application/octet-stream' ||
    res.headers['content-encoding'] === 'gzip'
  )
    res.body = await ungzip(res.body);
  const lines = splitLines(res.body.toString());
  const ips = [];
  for (const line of lines) {
    const firstChar = line.charAt(0);
    if (['#', '!', '$', ':'].includes(firstChar)) continue;
    if (validator.isIP(line)) ips.push(line);
  }

  // ensure that we have at least one ip
  if (ips.length === 0) throw new Error('No IP addresses were found.');

  // log how many we're adding
  logger.info('adding ips to list', { list, count: ips.length });

  // add to the cache for 7d (the same time that UCEProtect keeps it for)
  const p = client.pipeline();
  for (const ip of ips) {
    p.set(`${list.prefix}:${ip}`, 'true', 'PX', SEVEN_DAYS_TO_MS);
  }

  await p.exec();

  logger.info('successfully added ips to list', { list, count: ips.length });
}

(async () => {
  try {
    await pMapSeries(LISTS, mapper);
  } catch (err) {
    await logger.error(err);
    await emailHelper({
      template: 'alert',
      message: {
        to: config.alertsEmail,
        subject: 'Update UCEPROTECT had an error'
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
