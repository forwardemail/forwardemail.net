/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const APIServer = require('@ladjs/api');

const AttachmentStorage = require('#helpers/attachment-storage');
const IMAPNotifier = require('#helpers/imap-notifier');
const createTangerine = require('#helpers/create-tangerine');

class API extends APIServer {
  constructor(...args) {
    super(...args);
    // Add resolver and wsp to the API instance
    this.resolver = createTangerine(this.client, this.logger);
    this.wsp = this.config.wsp;
    // this allows you to do `ctx.instance` inside routers
    this.app.context.instance = this;

    // Set up attachment storage
    this.attachmentStorage = new AttachmentStorage();
    // Set up notifier (similar to IMAP server)
    this.notifier = new IMAPNotifier({
      publisher: this.client
      // NOTE: we do not supply `subscriber` option since it's not IMAP
    });
    // this allows you to do `ctx.instance` inside routers
    this.app.context.instance = this;
    // this allows you to do `ctx.notifier` inside routers
    this.app.context.notifier = this.notifier;
    // this allows you to do `ctx.attachmentStorage` inside routers
    this.app.context.attachmentStorage = this.attachmentStorage;
  }
}

module.exports = API;
