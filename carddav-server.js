/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const API = require('@ladjs/api');

const createTangerine = require('#helpers/create-tangerine');
const getApnTopic = require('#helpers/get-apn-topic');
const logger = require('#helpers/logger');

class CardDAV extends API {
  constructor(...args) {
    super(...args);
    this.resolver = createTangerine(this.client, this.logger);
    this.wsp = this.config.wsp;

    // this allows you to do `ctx.instance` inside routers
    this.app.context.instance = this;

    //
    // Pre-warm the APN Contact certificate so the very first iOS
    // PROPFIND on the addressbook-home already contains
    // <CS:push-transports>.  Without this, a cold-start race exists:
    // iOS discovers the account, sends a PROPFIND, gets no
    // push-transports (cert not yet loaded from Apple / Redis), and
    // caches the result as "Fetch".  iOS never retries push discovery
    // unless the user removes and re-adds the account or toggles
    // the account off/on.
    //
    // The CalDAV adapter avoids this implicitly because its
    // pushTopicProvider is invoked during adapter initialisation.
    // CardDAV is hand-rolled, so we prime the cache explicitly.
    //
    // Best-effort: if it fails the server still starts and
    // push-transports will be built lazily on the first PROPFIND
    // that finds the cert in Redis.
    //
    if (this.client) {
      getApnTopic(this.client, 'Contact')
        .then((topic) => {
          if (topic) {
            logger.info('CardDAV APN Contact topic pre-warmed', { topic });
          } else {
            logger.warn(
              'CardDAV APN Contact topic unavailable at startup (cert not yet primed)'
            );
          }
        })
        .catch((err) => {
          logger.warn('CardDAV APN Contact cert pre-warm failed', { err });
        });
    }
  }
}

module.exports = CardDAV;
