/*
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// A self-hosted instance serves the same pages as forwardemail.net under its
// own hostname (one such copy ranked for "free email forwarding"), so it asks
// not to be indexed; forwardemail.net keeps only its query string rule.
//

const test = require('ava');

const utils = require('../utils');
const config = require('#config');

test.before(utils.setupMongoose);
test.before(utils.setupWebServer);
test.after.always(utils.teardownMongoose);
test.after.always(utils.teardownWebServer);
test.afterEach.always(() => {
  config.isSelfHosted = false;
});

const BOT =
  'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';

test.serial(
  'forwardemail.net is indexed, apart from URLs with a query string',
  async (t) => {
    const page = await t.context.web.get('/en/faq').set('User-Agent', BOT);
    t.is(page.status, 200);
    t.is(page.headers['x-robots-tag'], undefined);

    const query = await t.context.web
      .get('/en/faq?utm_source=test')
      .set('User-Agent', BOT);
    t.is(query.headers['x-robots-tag'], 'noindex');
  }
);

test.serial('no page of a self-hosted instance is indexed', async (t) => {
  config.isSelfHosted = true;
  for (const path of ['/en', '/en/faq', '/en/private-business-email']) {
    // (whoever asks: a crawler that does not say it is one too)
    for (const agent of [BOT, 'Mozilla/5.0']) {
      const res = await t.context.web.get(path).set('User-Agent', agent);
      t.is(res.status, 200, `${path}`);
      t.is(res.headers['x-robots-tag'], 'noindex', `${path}`);
    }
  }
});
