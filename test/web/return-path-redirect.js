/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// The bounce domain (fe-bounces.forwardemail.net) redirects to the site;
// without a port in the Host it redirected to "forwardemail.netundefined".
//

const test = require('ava');

const utils = require('../utils');

const config = require('#config');

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupWebServer);
test.afterEach.always(utils.teardownWebServer);

test('the bounce domain redirects to the site', async (t) => {
  const res = await t.context.web
    .get('/en/faq?x=1')
    .set('Host', `${config.returnPath}.${config.webHost}`);
  t.is(res.status, 301);
  t.is(res.headers.location, `http://${config.webHost}/en/faq?x=1`);
});
