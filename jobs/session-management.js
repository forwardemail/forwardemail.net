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
const Redis = require('@ladjs/redis');
const mongoose = require('mongoose');
const pEvent = require('p-event');
const pMap = require('p-map');
const sharedConfig = require('@ladjs/shared-config');

const Users = require('#models/users');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');

// TODO: re-use existing connection from web
const breeSharedConfig = sharedConfig('BREE');
const client = new Redis(breeSharedConfig.redis, logger);
client.setMaxListeners(0);

const graceful = new Graceful({
  mongooses: [mongoose],
  redisClients: [client],
  logger
});

graceful.listen();

(async () => {
  await setupMongoose(logger);

  try {
    // run in the background a scan to ensure redis database is aligned correctly
    const stream = client.scanStream({
      match: `koa:sess:*`,
      type: 'string'
    });
    stream.on('data', (keys) => {
      // `GET $key` returns JSON string
      // when `JSON.parse` is called it looks like this:
      // json = {
      //   cookie: {
      //     httpOnly: true,
      //     path: '/',
      //     overwrite: true,
      //     signed: true,
      //     maxAge: 2592000000,
      //     secure: false,
      //     sameSite: 'lax'
      //   },
      //   _gh_issue: false,
      //   prevPath: '/en/my-account/security',
      //   prevMethod: 'GET',
      //   maxRedirects: 0,
      //   passport: { user: 'some-mongodb-object-id' }
      // }
      pMap(keys, async (key) => {
        try {
          const value = await client.get(key);
          const json = JSON.parse(value);
          const id = key.replace('koa:sess:', '');
          //
          // check if user exists, if not then delete the session
          // if user does exist, then $addToSet the session ID
          //
          // NOTE: cookies only last a maximum of 30d right now (default set)
          //
          if (!json?.passport?.user) return; // return early if user is not logged in
          const user = await Users.findOne({ id: json.passport.user })
            .lean()
            .exec();
          if (!user) {
            await client.del(key);
            return;
          }

          await Users.findByIdAndUpdate(user._id, {
            $addToSet: {
              sessions: id
            }
          });
        } catch (err) {
          logger.fatal(err);
        }
      })
        .then()
        .catch((err) => logger.fatal(err));
    });
    await pEvent(stream, 'end');
  } catch (err) {
    await logger.error(err);
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
