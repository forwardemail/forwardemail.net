/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const path = require('node:path');
const process = require('node:process');
const { parentPort } = require('node:worker_threads');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const pEvent = require('p-event');
const pMap = require('p-map');
const Graceful = require('@ladjs/graceful');
const Redis = require('@ladjs/redis');
const mime = require('mime-types');
const mongoose = require('mongoose');
const sharedConfig = require('@ladjs/shared-config');

const config = require('#config');
const emailHelper = require('#helpers/email');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');

const breeSharedConfig = sharedConfig('BREE');
const client = new Redis(breeSharedConfig.redis, logger);

const graceful = new Graceful({
  mongooses: [mongoose],
  redisClients: [client],
  logger
});

graceful.listen();

(async () => {
  await setupMongoose(logger);

  try {
    const stream = client.scanStream({
      match: `koa-cash:*`, // format is `koa-cash:${ctx.request.url}`
      count: 10000,
      type: 'string'
    });

    const urls = [];
    const errors = [];

    stream.on('data', (keys) => {
      if (!Array.isArray(keys) || keys.length === 0) return;
      for (const key of keys) {
        const url = key.split('koa-cash:')[1];
        if (!url) continue;
        urls.push(url);
      }
    });

    await pEvent(stream, 'end');

    if (urls.length > 0) {
      await pMap(
        urls,
        async (url) => {
          const value = await client.get(`koa-cash:${url}`);
          if (!value) return;
          try {
            const json = JSON.parse(value);
            const type = mime.contentType(path.extname(url));
            //
            // TODO: eventually we should either delete it or update the `.type` property
            //       but we're not going to do that until we can verify for sure that this happens
            //       (e.g. we're going to wait for an email alert to get triggered below)
            //
            if (type && type !== json.type)
              errors.push(
                `${url} had Content-Type stored of "${json.type}" but expected "${type}"`
              );
          } catch {
            errors.push(`${url} had invalid JSON stored`);
          }
        },
        { concurrency: config.concurrency }
      );
    }

    // alert admins of any content type mismatches
    if (errors.length > 0)
      await emailHelper({
        template: 'alert',
        message: {
          to: config.alertsEmail,
          subject: `Cache issues detected for ${errors.length} assets`
        },
        locals: {
          message: `<ul><li>${errors.join('</li><li>')}</li></ul>`
        }
      });
  } catch (err) {
    await logger.error(err);
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
