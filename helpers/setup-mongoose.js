/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const pRetry = require('p-retry');
const mongoose = require('mongoose');

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
      onFailedAttempt(err) {
        logger.error(err);
        if (!(err instanceof mongoose.Error.MongooseServerSelectionError))
          throw err;
      }
    }
  );
}

module.exports = setupMongoose;
