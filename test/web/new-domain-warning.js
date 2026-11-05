/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Adding a domain the free plan does not take shows why in a popup (a flash
// message, shown as HTML), and its links can be clicked. Its WHOIS/RDAP
// lookup is cached beforehand (tests have no network).
//

const { randomUUID } = require('node:crypto');

const falso = require('@ngneat/falso');
const ms = require('ms');
const test = require('ava');

const utils = require('../utils');

const config = require('#config');
const { Domains, Users } = require('#models');

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

//
// (the warning shown after adding a domain registered 30 days ago on the free
// plan, as HTML)
//
async function addNewDomain(t, domain) {
  await t.context._web.client.set(
    `whois:${domain}`,
    JSON.stringify({
      found: true,
      status: [],
      registrar: { id: 1, name: 'Example Registrar, Inc.' },
      ts: {
        created: new Date(Date.now() - ms('30d')),
        expires: new Date(Date.now() + ms('335d'))
      }
    })
  );

  const res = await t.context.web
    .post('/en/my-account/domains/new')
    .set('Accept', 'text/html')
    .set('Sec-Fetch-Site', 'same-origin')
    .set('Referer', `${config.urls.web}/en/my-account/domains/new`)
    .send({ domain, plan: 'free' });
  t.is(res.status, 302);
  t.true(res.headers.location.includes('/my-account/billing/upgrade'));
  t.is(await Domains.countDocuments({ name: domain }), 0);

  // (the flash messages on the page it leads to)
  const page = await t.context.web
    .get(res.headers.location)
    .set('Accept', 'text/html');
  const match = page.text.match(/window\._messages = (.*);\s*$/m);
  t.truthy(match);
  const [html] = JSON.parse(match[1]).warning;
  return html;
}

// (a link whose text is its address, opened in a new tab)
function link(url) {
  return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
}

test('the popup for a domain the free plan does not take has links to click', async (t) => {
  const domain = `${randomUUID().slice(0, 8)}.top`;
  const html = await addNewDomain(t, domain);
  t.true(html.includes(`The domain ${domain} ends in .top`));
  t.true(html.includes(link(config.urls.web)));
  t.true(
    html.includes(
      link(
        `${config.urls.web}/faq#what-domain-name-extensions-can-be-used-for-free`
      )
    )
  );
});

test('the popup for a new domain on an extension that needs a paid plan while new has links to click', async (t) => {
  const domain = `${randomUUID().slice(0, 8)}.online`;
  const html = await addNewDomain(t, domain);
  t.true(html.includes(`new domains ending in .online need a paid plan`));
  t.true(html.includes(link(config.urls.web)));
  t.true(
    html.includes(
      link(
        `${config.urls.web}/faq#why-do-newly-registered-or-recently-expired-domains-require-a-paid-plan`
      )
    )
  );
});
