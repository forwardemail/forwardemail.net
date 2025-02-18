/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const pRetry = require('p-retry');
const mongoose = require('mongoose');

const isRetryableError = require('./is-retryable-error');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

// initialize all models
// eslint-disable-next-line import/no-unassigned-import
require('#models');

function setupMongoose(logger = console) {
  //
  // this will attempt to reconnect with exponential backoff up to 10x
  // however if there is not a MongooseServerSelectionError, it will throw
  // (this is useful to keep http server running and retry db connection)
  // (apps such as pm2 are recommended to cause app to reboot if this eventually throws)
  // <https://github.com/Automattic/mongoose/issues/12967>
  // <https://github.com/Automattic/mongoose/issues/12965>
  // <https://github.com/Automattic/mongoose/issues/12966>
  // <https://github.com/Automattic/mongoose/issues/12968>
  // <https://github.com/Automattic/mongoose/issues/12970>
  // <https://github.com/Automattic/mongoose/issues/12971>
  //
  return pRetry(
    () =>
      Promise.all(
        mongoose.connections
          .filter(
            (c) => c.readyState === mongoose.ConnectionStates.disconnected
          )
          //
          // NOTE: our version of `asPromise` contains magic per <https://github.com/Automattic/mongoose/issues/12970>
          //       see @ladjs/mongoose package source code for more insight into how this works
          //
          .map((c) => c.asPromise())
      ),
    {
      // <https://github.com/sindresorhus/p-retry/issues/58>
      // <https://github.com/tim-kos/node-retry/issues/84>
      // forever: true,
      // retries: Infinity,
      async onFailedAttempt(err) {
        err.isCodeBug = true;
        logger.error(err);
        // > Uncaught Error: querySrv EREFUSED _mongodb._tcp.something.mongo.something.com
        //     at __node_internal_captureLargerStackTrace (node:internal/errors:496:5)
        //     at __node_internal_ (node:internal/errors:715:10)
        //     at QueryReqWrap.onresolve [as oncomplete] (node:internal/dns/promises:275:17)
        //     at QueryReqWrap.callbackTrampoline (node:internal/async_hooks:128:17) {
        //   errno: undefined,
        //   code: 'EREFUSED',
        //   syscall: 'querySrv',
        //   hostname: '_mongodb._tcp.something.mongo.something.com'
        // }
        // if (!(err instanceof mongoose.Error.MongooseServerSelectionError)) {
        if (!isRetryableError(err)) {
          console.error(err);
          throw err;
        }
      }
    }
  );
}

module.exports = setupMongoose;
