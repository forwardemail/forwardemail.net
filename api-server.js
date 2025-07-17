/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const APIServer = require('@ladjs/api');

const createTangerine = require('#helpers/create-tangerine');

class API extends APIServer {
  constructor(...args) {
    super(...args);
    // Add resolver and wsp to the API instance
    this.resolver = createTangerine(this.client, this.logger);
    this.wsp = this.config.wsp;
    // this allows you to do `ctx.instance` inside routers
    this.app.context.instance = this;
  }
}

module.exports = API;
