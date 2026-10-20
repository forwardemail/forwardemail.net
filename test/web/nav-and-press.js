/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// The Resources menu lists our other projects under their own header, and
// the press page no longer has the old graphics.
//

const test = require('ava');

const utils = require('../utils');

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupWebServer);
test.afterEach.always(utils.teardownWebServer);

test('the Resources menu lists our projects under a header', async (t) => {
  for (const [locale, header] of [
    ['en', 'Our Projects'],
    ['de', 'Unsere Projekte']
  ]) {
    const res = await t.context.web.get(`/${locale}`);
    t.is(res.status, 200);
    const start = res.text.indexOf(`>${header}<`);
    t.true(start > 0, `in ${locale}`);
    // (the new projects come first, above AlumniEmail.com)
    const order = [
      'https://privacyratings.com',
      'https://spamscanner.net',
      'https://attestium.com',
      'https://terminalemail.com',
      'https://alumniemail.com',
      'https://sslmonitor.com'
    ].map((href) => res.text.indexOf(`href="${href}"`, start));
    t.true(
      order.every(
        (index, i) => index > start && (i === 0 || index > order[i - 1])
      ),
      `in ${locale}`
    );
  }
});

test('the press page has no graphics section', async (t) => {
  for (const locale of ['en', 'de', 'ja']) {
    const res = await t.context.web.get(`/${locale}/press`);
    t.is(res.status, 200);
    t.true(res.text.includes('logo-square.svg'), `in ${locale}`);
    t.false(res.text.includes('domain-onboard.gif'), `in ${locale}`);
    t.false(res.text.includes('#graphics'), `in ${locale}`);
  }
});
