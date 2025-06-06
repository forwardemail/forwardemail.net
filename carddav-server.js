/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const API = require('@ladjs/api');

const createTangerine = require('#helpers/create-tangerine');

class CardDAV extends API {
  constructor(...args) {
    super(...args);
    this.resolver = createTangerine(this.client, this.logger);
    this.wsp = this.config.wsp;

    // this allows you to do `ctx.instance` inside routers
    this.app.context.instance = this;
  }
}

module.exports = CardDAV;
