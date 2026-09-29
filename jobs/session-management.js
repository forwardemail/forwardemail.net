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

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const Redis = require('@ladjs/redis');
const mongoose = require('mongoose');
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
    //
    // scan to ensure redis database is aligned correctly, one page at a time
    // (starting the work for every page as the scan went, without waiting,
    // queued work for every session at once and posted "done" before it ran)
    //
    for await (const keys of client.scanStream({
      match: `koa:sess:*`,
      type: 'string',
      // hold one page at a time (a readable stream buffers 16 by default)
      highWaterMark: 1
    })) {
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
      await pMap(
        keys,
        async (key) => {
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
              .select('_id')
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
        },
        { concurrency: 10 }
      );
    }
  } catch (err) {
    await logger.error(err);
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
