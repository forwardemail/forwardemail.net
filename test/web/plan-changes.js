/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Changing the account plan and domain plans from the web pages:
// - the links in the error shown when an account downgrade needs a domain
//   downgraded first change that domain's plan
// - changing the last paid domain to free asks first, then offers to
//   downgrade the account (which is what gets billed) too
//

const { randomUUID } = require('node:crypto');

const falso = require('@ngneat/falso');
const ms = require('ms');
const test = require('ava');

const utils = require('../utils');

const config = require('#config');
const { Domains, Payments, Users } = require('#models');

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupFactories);

//
// a user on a paid plan that started `since` ago with one payment of
// `duration` (the plan expiry is worked out from payments when saved)
//
async function makeUser(t, plan, since = '60d', duration = '1y') {
  const password = falso.randPassword();
  let user = await t.context.userFactory.make();
  user = await Users.register(user, password);
  user[config.userFields.hasSetPassword] = true;
  user[config.userFields.hasVerifiedEmail] = true;
  const planSetAt = new Date(Date.now() - ms(since));
  await Payments.create({
    user: user._id,
    amount: plan === 'team' ? 10_800 : 3600,
    amount_refunded: 0,
    duration: ms(duration),
    invoice_at: planSetAt,
    method: 'unknown',
    plan,
    kind: 'one-time'
  });
  user.plan = plan;
  user[config.userFields.planSetAt] = planSetAt;
  user = await user.save();
  return { user, password };
}

async function setup(t, plan) {
  const { user, password } = await makeUser(t, plan);
  t.true(new Date(user[config.userFields.planExpiresAt]) > new Date());
  t.context.user = user;
  t.context.password = password;
  await utils.setupWebServer(t);
  await utils.loginUser(t);
}

test.afterEach.always(utils.teardownWebServer);

function createDomain(t, plan, members) {
  return t.context.domainFactory
    .withState({
      name: `test-${randomUUID()}.example.com`,
      members: members || [{ user: t.context.user._id, group: 'admin' }],
      plan,
      skip_verification: true
    })
    .create();
}

// a click on a link of this site (on the page `from`)
function click(t, url, from = '/en/my-account/billing') {
  return t.context.web
    .get(url)
    .set('Accept', 'text/html')
    .set('Sec-Fetch-Site', 'same-origin')
    .set('Referer', `${config.urls.web}${from}`);
}

//
// the flash messages shown on the page a redirect leads to
// (as one string)
//
async function follow(t, res) {
  t.is(res.status, 302);
  const page = await t.context.web
    .get(res.headers.location)
    .set('Accept', 'text/html');
  const match = page.text.match(/window\._messages = (.*);\s*$/m);
  t.truthy(match);
  return Object.values(JSON.parse(match[1]))
    .flat()
    .map((m) =>
      typeof m === 'string' ? m : `${m.title} ${m.html || m.text || ''}`
    )
    .join('\n');
}

test('the link to downgrade a Team domain when downgrading the account from Team to Enhanced Protection changes the domain plan', async (t) => {
  await setup(t, 'team');
  const domain = await createDomain(t, 'team');

  const text = await follow(
    t,
    await click(t, '/en/my-account/billing/upgrade?plan=enhanced_protection')
  );
  const link = `/en/my-account/domains/${domain.name}/billing?plan=enhanced_protection`;
  t.true(text.includes(link));
  t.false(text.includes(`/en/my-account/domains/${domain.name}/billing"`));

  // (the account was not changed)
  let user = await Users.findById(t.context.user._id).lean().exec();
  t.is(user.plan, 'team');

  // the link changes the domain plan (it was refused as an invalid plan)
  // and goes back to the Billing page
  const res = await click(t, link);
  t.is(res.headers.location, '/en/my-account/billing');
  const page = await follow(t, res);
  t.false(page.includes('Invalid plan selected.'));
  const fresh = await Domains.findById(domain._id).lean().exec();
  t.is(fresh.plan, 'enhanced_protection');

  // and the account downgrade then goes on
  await follow(
    t,
    await click(t, '/en/my-account/billing/upgrade?plan=enhanced_protection')
  );
  user = await Users.findById(t.context.user._id).lean().exec();
  t.is(user.plan, 'enhanced_protection');
});

test('the link to downgrade a domain when downgrading the account to Free changes the domain to Free', async (t) => {
  await setup(t, 'team');
  const domain = await createDomain(t, 'team');

  const text = await follow(
    t,
    await click(t, '/en/my-account/billing/upgrade?plan=free')
  );
  const link = `/en/my-account/domains/${domain.name}/billing?plan=free`;
  t.true(text.includes(link));

  await follow(t, await click(t, link));
  const fresh = await Domains.findById(domain._id).lean().exec();
  t.is(fresh.plan, 'free');
});

test('changing the last paid domain to Free offers to downgrade the account too', async (t) => {
  await setup(t, 'enhanced_protection');
  const domain = await createDomain(t, 'enhanced_protection');

  // the menu asks before the change (the account stays on its plan)
  for (const url of [
    `/en/my-account/domains/${domain.name}`,
    `/en/my-account/domains/${domain.name}/advanced-settings`,
    '/en/my-account/domains',
    `/en/my-account/domains?q=${domain.name}`
  ]) {
    const res = await t.context.web.get(url).set('Accept', 'text/html');
    t.is(res.status, 200, `at ${url}`);
    t.true(res.text.includes('Downgrade this domain to Free?'), `at ${url}`);
  }

  const text = await follow(
    t,
    await click(
      t,
      `/en/my-account/domains/${domain.name}/billing?plan=free`,
      `/en/my-account/domains/${domain.name}/advanced-settings`
    )
  );
  const fresh = await Domains.findById(domain._id).lean().exec();
  t.is(fresh.plan, 'free');

  // the message says which domain changed, then asks about the account
  t.true(text.includes(domain.name));
  t.true(text.includes('is now on the'));
  t.false(text.includes('You have successfully downgraded to the Free Plan.'));
  t.true(text.includes('Downgrade your account too?'));
  t.true(text.includes('/en/my-account/billing/upgrade?plan=free'));

  // (the account was not changed)
  let user = await Users.findById(t.context.user._id).lean().exec();
  t.is(user.plan, 'enhanced_protection');

  // the button downgrades the account
  await follow(t, await click(t, '/en/my-account/billing/upgrade?plan=free'));
  user = await Users.findById(t.context.user._id).lean().exec();
  t.is(user.plan, 'free');
});

test('changing a paid domain to Free does not ask about the account while another domain is paid', async (t) => {
  await setup(t, 'enhanced_protection');
  const domain = await createDomain(t, 'enhanced_protection');
  await createDomain(t, 'enhanced_protection');

  for (const url of [
    `/en/my-account/domains/${domain.name}`,
    `/en/my-account/domains/${domain.name}/advanced-settings`,
    '/en/my-account/domains',
    `/en/my-account/domains?q=${domain.name}`
  ]) {
    const res = await t.context.web.get(url).set('Accept', 'text/html');
    t.is(res.status, 200, `at ${url}`);
    t.false(res.text.includes('Downgrade this domain to Free?'), `at ${url}`);
    t.true(
      res.text.includes(
        `/en/my-account/domains/${domain.name}/billing?plan=free`
      ),
      `at ${url}`
    );
  }

  const text = await follow(
    t,
    await click(
      t,
      `/en/my-account/domains/${domain.name}/billing?plan=free`,
      `/en/my-account/domains/${domain.name}/advanced-settings`
    )
  );
  const fresh = await Domains.findById(domain._id).lean().exec();
  t.is(fresh.plan, 'free');
  t.false(text.includes('Downgrade your account too?'));
  const user = await Users.findById(t.context.user._id).lean().exec();
  t.is(user.plan, 'enhanced_protection');
});

test('downgrading the account is not blocked by a domain the user is only a member of', async (t) => {
  await setup(t, 'team');
  // another admin is on the Team plan but has not paid for a long time
  const { user: other } = await makeUser(t, 'team', '2y', '30d');
  t.true(new Date(other[config.userFields.planExpiresAt]) < new Date());
  const domain = await createDomain(t, 'team', [
    { user: other._id, group: 'admin' },
    { user: t.context.user._id, group: 'user' }
  ]);

  await follow(t, await click(t, '/en/my-account/billing/upgrade?plan=free'));
  const user = await Users.findById(t.context.user._id).lean().exec();
  t.is(user.plan, 'free');
  const fresh = await Domains.findById(domain._id).lean().exec();
  t.is(fresh.plan, 'team');
});

test('a Team domain of an Enhanced Protection account is offered as a downgrade', async (t) => {
  await setup(t, 'enhanced_protection');
  const { user: other } = await makeUser(t, 'team');
  const domain = await createDomain(t, 'team', [
    { user: t.context.user._id, group: 'admin' },
    { user: other._id, group: 'admin' }
  ]);

  const res = await t.context.web
    .get(`/en/my-account/domains/${domain.name}`)
    .set('Accept', 'text/html');
  t.is(res.status, 200);
  t.true(res.text.includes('Ready to downgrade'));
  t.false(res.text.includes('Ready to upgrade'));
  t.true(
    res.text.includes(
      `/en/my-account/domains/${domain.name}/billing?plan=enhanced_protection`
    )
  );
});

test('with several Team domains each link downgrades its own domain and the list shrinks until the account can change', async (t) => {
  await setup(t, 'team');
  const domains = [
    await createDomain(t, 'team'),
    await createDomain(t, 'team')
  ];
  const url = '/en/my-account/billing/upgrade?plan=enhanced_protection';

  for (const [i, domain] of domains.entries()) {
    const text = await follow(t, await click(t, url));
    // (a list while more than one is left)
    t.is(text.includes('</ul>'), i < domains.length - 1);
    const link = `/en/my-account/domains/${domain.name}/billing?plan=enhanced_protection`;
    t.true(text.includes(link));
    // (domains already downgraded are no longer listed)
    for (const done of domains.slice(0, i))
      t.false(text.includes(`/en/my-account/domains/${done.name}/billing`));

    const res = await click(t, link);
    t.is(res.headers.location, '/en/my-account/billing');
    const fresh = await Domains.findById(domain._id).lean().exec();
    t.is(fresh.plan, 'enhanced_protection');
  }

  await follow(t, await click(t, url));
  const user = await Users.findById(t.context.user._id).lean().exec();
  t.is(user.plan, 'enhanced_protection');
});

test('changing the last paid domain to Free does not offer the account downgrade when the plan expired', async (t) => {
  // (a subscription whose renewal has not gone through yet)
  const { user, password } = await makeUser(
    t,
    'enhanced_protection',
    '60d',
    '30d'
  );
  user[config.userFields.stripeSubscriptionID] = 'sub_test';
  t.context.user = await user.save();
  t.context.password = password;
  t.true(
    new Date(t.context.user[config.userFields.planExpiresAt]) < new Date()
  );
  await utils.setupWebServer(t);
  await utils.loginUser(t);
  const domain = await createDomain(t, 'enhanced_protection');

  const res = await t.context.web
    .get(`/en/my-account/domains/${domain.name}/advanced-settings`)
    .set('Accept', 'text/html');
  t.is(res.status, 200);
  t.false(res.text.includes('Downgrade this domain to Free?'));

  const text = await follow(
    t,
    await click(
      t,
      `/en/my-account/domains/${domain.name}/billing?plan=free`,
      `/en/my-account/domains/${domain.name}/advanced-settings`
    )
  );
  const fresh = await Domains.findById(domain._id).lean().exec();
  t.is(fresh.plan, 'free');
  t.false(text.includes('Downgrade your account too?'));
});

async function loginExpired(t, since, duration) {
  const { user, password } = await makeUser(
    t,
    'enhanced_protection',
    since,
    duration
  );
  t.context.user = user;
  t.context.password = password;
  t.true(new Date(user[config.userFields.planExpiresAt]) < new Date());
  await utils.setupWebServer(t);
  await utils.loginUser(t);
}

test('switching plans while past due by less than a month says how many days (not "0 months")', async (t) => {
  await loginExpired(t, '50d', '30d');

  const res = await click(t, '/en/my-account/billing/upgrade?plan=team');
  t.is(res.headers.location, '/en/my-account/billing/make-payment');
  const text = await follow(t, res);
  t.true(text.includes('20 days</span> past due'));
  t.false(text.includes('months'));
  const user = await Users.findById(t.context.user._id).lean().exec();
  t.is(user.plan, 'enhanced_protection');
});

test('switching plans while past due by over a year says the years and months', async (t) => {
  // (a plan that ran out about a year and two months ago)
  await loginExpired(t, `${30 + 365 + 75}d`, '30d');

  const text = await follow(
    t,
    await click(t, '/en/my-account/billing/upgrade?plan=team')
  );
  t.true(text.includes('a year and 2 months</span> past due'));
});

test('enabling auto-renew while past due still says how long', async (t) => {
  await loginExpired(t, '50d', '30d');
  await createDomain(t, 'enhanced_protection');

  const res = await click(t, '/en/my-account/billing/enable-auto-renew');
  t.is(res.headers.location, '/en/my-account/billing/make-payment');
  const text = await follow(t, res);
  t.true(text.includes('20 days</strong> past due'));
});

test('the past due time is in Norwegian on the Norwegian site', async (t) => {
  await loginExpired(t, '50d', '30d');

  const res = await click(t, '/no/my-account/billing/upgrade?plan=team');
  t.is(res.headers.location, '/no/my-account/billing/make-payment');
  const text = await follow(t, res);
  t.true(text.includes('20 dager</span>'));
  t.false(text.includes('20 days'));
});

// the flash messages shown on the next page (after an XHR form submission)
async function nextFlash(t) {
  const page = await t.context.web
    .get('/en/my-account/billing')
    .set('Accept', 'text/html');
  t.is(page.status, 200);
  const match = page.text.match(/window\._messages = (.*);\s*$/m);
  t.truthy(match);
  return Object.values(JSON.parse(match[1]))
    .flat()
    .map((m) =>
      typeof m === 'string' ? m : `${m.title} ${m.html || m.text || ''}`
    )
    .join('\n');
}

test('deleting the last paid domain offers to downgrade the account too', async (t) => {
  await setup(t, 'enhanced_protection');
  const domain = await createDomain(t, 'enhanced_protection');

  const res = await t.context.web
    .delete(`/en/my-account/domains/${domain.name}`)
    .set('Accept', 'application/json')
    .set('Sec-Fetch-Site', 'same-origin');
  t.is(res.status, 200);
  t.is(await Domains.countDocuments({ _id: domain._id }), 0);

  const text = await nextFlash(t);
  t.true(text.includes('Downgrade your account too?'));
  t.true(text.includes('/en/my-account/billing/upgrade?plan=free'));
  const user = await Users.findById(t.context.user._id).lean().exec();
  t.is(user.plan, 'enhanced_protection');
});

test('deleting a paid domain does not ask about the account while another domain is paid', async (t) => {
  await setup(t, 'enhanced_protection');
  const domain = await createDomain(t, 'enhanced_protection');
  await createDomain(t, 'enhanced_protection');

  const res = await t.context.web
    .delete(`/en/my-account/domains/${domain.name}`)
    .set('Accept', 'application/json')
    .set('Sec-Fetch-Site', 'same-origin');
  t.is(res.status, 200);
  const text = await nextFlash(t);
  t.false(text.includes('Downgrade your account too?'));
});

async function teamDomainWithOtherAdmin(t) {
  const { user: other } = await makeUser(t, 'team');
  const domain = await createDomain(t, 'team', [
    { user: t.context.user._id, group: 'admin' },
    { user: other._id, group: 'admin' }
  ]);
  return { domain, other };
}

test('leaving the last paid domain you manage offers to downgrade the account too', async (t) => {
  await setup(t, 'team');
  const { domain } = await teamDomainWithOtherAdmin(t);

  const res = await t.context.web
    .delete(
      `/en/my-account/domains/${domain.name}/members/${t.context.user.id}`
    )
    .set('Accept', 'application/json')
    .set('Sec-Fetch-Site', 'same-origin');
  t.is(res.status, 200);
  // (not a reload of a domain page the user can no longer open)
  t.is(res.body.redirectTo, '/en/my-account/domains');
  const fresh = await Domains.findById(domain._id).lean().exec();
  t.false(fresh.members.some((m) => m.user.toString() === t.context.user.id));

  const text = await nextFlash(t);
  t.true(text.includes('Downgrade your account too?'));
});

test('setting yourself back to a user of the last paid domain you manage offers to downgrade the account too', async (t) => {
  await setup(t, 'team');
  const { domain } = await teamDomainWithOtherAdmin(t);

  const res = await t.context.web
    .put(`/en/my-account/domains/${domain.name}/members/${t.context.user.id}`)
    .set('Accept', 'application/json')
    .set('Sec-Fetch-Site', 'same-origin')
    .send({ group: 'user' });
  t.is(res.status, 200);
  t.is(res.body.redirectTo, '/en/my-account/domains');
  const fresh = await Domains.findById(domain._id).lean().exec();
  t.is(
    fresh.members.find((m) => m.user.toString() === t.context.user.id).group,
    'user'
  );

  const text = await nextFlash(t);
  t.true(text.includes('Downgrade your account too?'));
});

test('removing another member does not ask about your account', async (t) => {
  await setup(t, 'team');
  const { domain, other } = await teamDomainWithOtherAdmin(t);

  const res = await t.context.web
    .delete(`/en/my-account/domains/${domain.name}/members/${other.id}`)
    .set('Accept', 'application/json')
    .set('Sec-Fetch-Site', 'same-origin');
  t.is(res.status, 200);
  t.true(res.body.reloadPage);
  const text = await nextFlash(t);
  t.false(text.includes('Downgrade your account too?'));
});

test('deleting a free domain does not ask about the account', async (t) => {
  // (a paid account with no paid domains, e.g. after keeping the plan)
  await setup(t, 'enhanced_protection');
  const domain = await createDomain(t, 'free');

  const res = await t.context.web
    .delete(`/en/my-account/domains/${domain.name}`)
    .set('Accept', 'application/json')
    .set('Sec-Fetch-Site', 'same-origin');
  t.is(res.status, 200);
  t.is(await Domains.countDocuments({ _id: domain._id }), 0);
  const text = await nextFlash(t);
  t.false(text.includes('Downgrade your account too?'));
});
