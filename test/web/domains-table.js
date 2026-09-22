/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// The domain list of My Account, as the web server renders it: the whole
// name cell of a domain is a link to the domain (its badge is a stretched
// link over a positioned cell), and the DNS status indicators are raised
// above that link so that they can still be hovered for their tooltips.
//

const { randomUUID } = require('node:crypto');

const falso = require('@ngneat/falso');
const test = require('ava');
const { JSDOM } = require('jsdom');

const utils = require('../utils');

const config = require('#config');
const { Users } = require('#models');

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupFactories);
test.beforeEach(async (t) => {
  t.context.password = falso.randPassword();
  let user = await t.context.userFactory.make();
  user = await Users.register(user, t.context.password);
  user[config.userFields.hasSetPassword] = true;
  user[config.userFields.hasVerifiedEmail] = true;
  t.context.user = await user.save();
  await utils.setupWebServer(t);
  await utils.loginUser(t);
});
test.afterEach.always(utils.teardownWebServer);

// the rendered row of `domain`
function rowOf(document, domain) {
  const heading = [...document.querySelectorAll('td h2')].find(
    (h2) => h2.textContent.trim() === domain.name
  );
  return heading ? heading.closest('tr') : null;
}

test('the name cell of a domain is a link to it, with the DNS indicators above the link', async (t) => {
  const { user, web } = t.context;

  // a verified domain and one that still needs its DNS records
  const verified = await t.context.domainFactory
    .withState({
      name: `${randomUUID().replaceAll('-', '').slice(0, 12)}.com`,
      members: [{ user: user._id, group: 'admin' }],
      plan: 'free',
      has_mx_record: true,
      has_txt_record: true,
      // (the records are not looked up: the flags stand)
      skip_verification: true
    })
    .create();
  const unverified = await t.context.domainFactory
    .withState({
      name: `${randomUUID().replaceAll('-', '').slice(0, 12)}.com`,
      members: [{ user: user._id, group: 'admin' }],
      plan: 'free',
      has_mx_record: false,
      has_txt_record: false,
      skip_verification: true
    })
    .create();

  const res = await web.get('/en/my-account/domains');
  t.is(res.status, 200);
  const { document } = new JSDOM(res.text).window;

  for (const domain of [verified, unverified]) {
    const row = rowOf(document, domain);
    t.truthy(row, `${domain.name} is listed`);

    // the cell is the positioning context of its stretched link, so the
    // link covers the whole cell
    const cell = row.querySelector('td h2').closest('td');
    t.true(cell.classList.contains('position-relative'));
    const links = cell.querySelectorAll('a.stretched-link');
    t.is(links.length, 1);
    t.is(
      links[0].getAttribute('href'),
      `/en/my-account/domains/${domain.name}`
    );

    // the indicators sit in a positioned layer above that link
    const indicators = cell.querySelectorAll('[data-toggle="tooltip"]');
    t.true(indicators.length > 0);
    for (const indicator of indicators) {
      const layer = indicator.closest('.position-relative');
      t.not(layer, cell);
      t.true(cell.contains(layer));
      t.regex(layer.getAttribute('style') || '', /z-index:\s*2/);
    }
  }

  // what the links say
  t.regex(
    rowOf(document, unverified).querySelector('a.stretched-link').textContent,
    /Setup Required/
  );
  t.regex(
    rowOf(document, verified).querySelector('a.stretched-link').textContent,
    /Free/
  );
});
