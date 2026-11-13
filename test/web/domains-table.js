/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// The domain list of My Account, as the web server renders it: every domain
// is a card whose title links to the domain, whose DNS status indicators keep
// their tooltips (outside of that link), and which offers the next step for
// the domain as one button: Setup and 1-Click Setup while the DNS records are
// missing, Mailboxes once they are in place.
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

// the rendered card of `domain`
function cardOf(document, domain) {
  const link = [...document.querySelectorAll('.acct-domain-card h2 a')].find(
    (a) => a.textContent.trim() === domain.name
  );
  return link ? link.closest('.acct-domain-card') : null;
}

// the account has to be on a paid plan to own a domain of that plan
async function upgrade(t) {
  await Users.updateOne(
    { _id: t.context.user._id },
    { $set: { plan: 'enhanced_protection' } }
  );
}

async function makeDomain(t, state) {
  const { user } = t.context;
  return t.context.domainFactory
    .withState({
      name: `test-${randomUUID()}.example.com`,
      members: [{ user: user._id, group: 'admin' }],
      plan: 'free',
      // (the records are not looked up: the flags stand)
      skip_verification: true,
      ...state
    })
    .create();
}

test('the title of a domain card links to the domain and the DNS indicators keep their tooltips', async (t) => {
  const { web } = t.context;
  const verified = await makeDomain(t, {
    has_mx_record: true,
    has_txt_record: true
  });
  const unverified = await makeDomain(t, {
    has_mx_record: false,
    has_txt_record: false
  });

  const res = await web.get('/en/my-account/domains');
  t.is(res.status, 200);
  const { document } = new JSDOM(res.text).window;

  for (const domain of [verified, unverified]) {
    const card = cardOf(document, domain);
    t.truthy(card, `${domain.name} is listed`);
    t.is(
      card.querySelector('h2 a').getAttribute('href'),
      `/en/my-account/domains/${domain.name}`
    );

    // the indicators are tooltips that are not inside the link of the title
    const indicators = card.querySelectorAll('[data-toggle="tooltip"]');
    t.true(indicators.length > 0);
    for (const indicator of indicators) {
      t.is(indicator.closest('h2'), null);
    }
  }

  // what the badges say
  t.regex(
    cardOf(document, unverified).querySelector('.acct-card-badges').textContent,
    /Setup Required/
  );
  t.regex(
    cardOf(document, verified).querySelector('.acct-card-badges').textContent,
    /Free/
  );
});

test('a domain without DNS records offers Setup first, and 1-Click Setup on a paid plan', async (t) => {
  const { web } = t.context;
  await upgrade(t);
  const paid = await makeDomain(t, {
    plan: 'enhanced_protection',
    has_mx_record: false,
    has_txt_record: false
  });
  const free = await makeDomain(t, {
    has_mx_record: false,
    has_txt_record: false
  });

  const res = await web.get('/en/my-account/domains');
  t.is(res.status, 200);
  const { document } = new JSDOM(res.text).window;

  const paidCard = cardOf(document, paid);
  const form = paidCard.querySelector('form.domain-connect-form');
  t.truthy(form, 'one-click form');
  t.is(form.getAttribute('action'), '/en/domain-connect');
  t.is(form.querySelector('input[name="domain"]').value, paid.name);
  t.regex(
    paidCard.querySelector('.acct-actions--cta').textContent,
    /Setup[\s\S]*1-Click Setup/
  );
  // the mailboxes are one click away in the meantime, not the next step
  t.is(paidCard.querySelector('.acct-actions--cta a[href$="/aliases"]'), null);
  t.truthy(paidCard.querySelector('.acct-card-foot a[href$="/aliases"]'));

  // as before, 1-Click Setup stays a paid feature
  t.is(cardOf(document, free).querySelector('form.domain-connect-form'), null);
});

test('a verified domain offers Mailboxes as its next step, and says what a mailbox is', async (t) => {
  const { web } = t.context;
  await upgrade(t);
  const domain = await makeDomain(t, {
    plan: 'enhanced_protection',
    has_mx_record: true,
    has_txt_record: true
  });

  const res = await web.get('/en/my-account/domains');
  t.is(res.status, 200);
  const { document } = new JSDOM(res.text).window;

  const cta = cardOf(document, domain).querySelector('.acct-actions--cta');
  const mailboxes = cta.querySelector(
    `a[href="/en/my-account/domains/${domain.name}/aliases"]`
  );
  t.truthy(mailboxes);
  t.regex(mailboxes.textContent, /Mailboxes/);
  t.regex(
    document.querySelector('.acct-domain-list').parentElement.textContent,
    /Some people call them aliases/
  );
});

test('the card shows the team of the domain and links to manage it', async (t) => {
  const { web } = t.context;
  const domain = await makeDomain(t, {
    has_mx_record: true,
    has_txt_record: true
  });

  const res = await web.get('/en/my-account/domains');
  t.is(res.status, 200);
  const { document } = new JSDOM(res.text).window;

  const team = cardOf(document, domain).querySelector('.acct-team');
  t.is(team.querySelectorAll('.acct-avatar').length, 1);
  t.is(
    team.querySelector('a').getAttribute('href'),
    `/en/my-account/domains/${domain.name}/advanced-settings#manage-team`
  );
});

// the buttons of a card that the free plan locks
function lockedButtons(card) {
  return [...card.querySelectorAll('.acct-card-foot .acct-action')].filter(
    (el) => /Logs|Analytics|DMARC/.test(el.textContent)
  );
}

test('a free account sees the upgrade dialogs for a free domain, a paid account the prompt to switch it', async (t) => {
  const { web } = t.context;
  const domain = await makeDomain(t, {
    has_mx_record: true,
    has_txt_record: true
  });

  let res = await web.get('/en/my-account/domains');
  t.is(res.status, 200);
  let card = cardOf(new JSDOM(res.text).window.document, domain);
  let buttons = lockedButtons(card);
  t.is(buttons.length, 3);
  for (const button of buttons) {
    t.is(button.dataset.toggle, 'modal');
    t.regex(button.dataset.target, /^#modal-upgrade/);
  }

  await upgrade(t);
  res = await web.get('/en/my-account/domains');
  t.is(res.status, 200);
  card = cardOf(new JSDOM(res.text).window.document, domain);
  buttons = lockedButtons(card);
  t.is(buttons.length, 3);
  for (const button of buttons) {
    const form = button.closest('form.confirm-prompt');
    t.truthy(form, 'asks first');
    t.is(form.method.toLowerCase(), 'get');
    t.is(
      form.getAttribute('action'),
      `/en/my-account/domains/${domain.name}/billing`
    );
    t.is(form.querySelector('input[name="plan"]').value, 'enhanced_protection');
    t.regex(form.dataset.confirmPromptTitle, /Switch domain plan/);
  }
});

test('a member who is not an admin of the domain gets no settings, setup or team', async (t) => {
  const { web, user } = t.context;
  const owner = await t.context.userFactory.make();
  const admin = await Users.register(owner, falso.randPassword());
  // (a domain with a team is on the team plan, as is its admin)
  admin.plan = 'team';
  await admin.save();
  const domain = await makeDomain(t, {
    plan: 'team',
    members: [
      { user: admin._id, group: 'admin' },
      { user: user._id, group: 'user' }
    ],
    has_mx_record: true,
    has_txt_record: true
  });

  const res = await web.get('/en/my-account/domains');
  t.is(res.status, 200);
  const card = cardOf(new JSDOM(res.text).window.document, domain);
  t.truthy(card);
  const hrefs = [...card.querySelectorAll('a')].map((a) =>
    a.getAttribute('href')
  );
  t.false(hrefs.some((href) => /advanced-settings|zone-file/.test(href)));
  t.is(card.querySelector('.acct-team'), null);
  // (nor the email addresses of the other members)
  t.false(card.textContent.includes(admin.email));
  t.false(card.innerHTML.includes(admin.email));
  t.truthy(card.querySelector('a[href$="/aliases"]'));
});

test('a vanity domain keeps its logs, analytics and DMARC reports', async (t) => {
  const { web, user } = t.context;
  await Users.updateOne(
    { _id: user._id },
    { $set: { group: 'admin', plan: 'team' } }
  );
  // (an account without a domain of its own is sent to add one)
  await makeDomain(t, {
    plan: 'team',
    has_mx_record: true,
    has_txt_record: true
  });
  const domain = await makeDomain(t, {
    plan: 'team',
    is_global: true,
    has_mx_record: true,
    has_txt_record: true
  });

  const res = await web.get('/en/my-account/domains');
  t.is(res.status, 200);
  const card = cardOf(new JSDOM(res.text).window.document, domain);
  // (its admin manages the team, whose members are too many to show)
  t.is(card.querySelectorAll('.acct-team .acct-avatar').length, 0);
  t.truthy(
    card.querySelector('.acct-team a[href$="/advanced-settings#manage-team"]')
  );
  const hrefs = [...card.querySelectorAll('.acct-card-foot a')].map((a) =>
    a.getAttribute('href')
  );
  for (const path of ['logs', 'analytics', 'dmarc-reports']) {
    t.true(
      hrefs.some((href) => href.startsWith(`/en/my-account/${path}?domains=`)),
      `${path}`
    );
  }
});

test('the table refreshes over XHR with the same cards', async (t) => {
  const { web } = t.context;
  const domain = await makeDomain(t, {
    has_mx_record: true,
    has_txt_record: true
  });

  const res = await web
    .get('/en/my-account/domains')
    .set('Accept', 'application/json')
    .set('X-Requested-With', 'XMLHttpRequest');
  t.is(res.status, 200);
  const { document } = new JSDOM(res.body.table).window;
  t.truthy(cardOf(document, domain));
});

test('the names of the members are escaped', async (t) => {
  const { web, user } = t.context;
  await Users.updateOne(
    { _id: user._id },
    {
      $set: {
        [config.passport.fields.displayName]: '<img src=x onerror=alert(1)>'
      }
    }
  );
  const domain = await makeDomain(t, {
    has_mx_record: true,
    has_txt_record: true
  });

  const res = await web.get('/en/my-account/domains');
  t.is(res.status, 200);
  t.false(res.text.includes('<img src=x onerror=alert(1)>'));
  const { document } = new JSDOM(res.text).window;
  const avatar = cardOf(document, domain).querySelector('.acct-avatar');
  t.regex(avatar.getAttribute('title'), /<img src=x/);
  t.is(avatar.querySelector('img'), null);
});

test('1-Click Setup is offered unless the DNS provider is known not to support it', async (t) => {
  const { web } = t.context;
  await upgrade(t);
  const state = {
    plan: 'enhanced_protection',
    has_mx_record: false,
    has_txt_record: false
  };
  const supported = await makeDomain(t, {
    ...state,
    ns: ['ada.ns.cloudflare.com', 'bob.ns.cloudflare.com']
  });
  const unsupported = await makeDomain(t, {
    ...state,
    ns: ['dns1.registrar-servers.com', 'dns2.registrar-servers.com']
  });
  const unknown = await makeDomain(t, state);

  const res = await web.get('/en/my-account/domains');
  t.is(res.status, 200);
  const { document } = new JSDOM(res.text).window;
  const formOf = (domain) =>
    cardOf(document, domain).querySelector('form.domain-connect-form');

  // the provider is named when it is known
  t.is(
    formOf(supported).querySelector('input[name="provider"]').value,
    'cloudflare'
  );
  // and looked up when it is not
  t.truthy(formOf(unknown));
  t.is(formOf(unknown).querySelector('input[name="provider"]'), null);
  // once the records are applied, the page of the domain has the Verify button
  t.is(
    formOf(unknown).dataset.nextUrl,
    `/en/my-account/domains/${unknown.name}`
  );
  // a provider without it gets the step by step setup
  t.is(formOf(unsupported), null);
  t.truthy(
    cardOf(document, unsupported).querySelector(
      `.acct-actions--cta a[href="/en/my-account/domains/${unsupported.name}"]`
    )
  );

  // the same on the page of the domain
  const page = await web.get(`/en/my-account/domains/${unsupported.name}`);
  t.is(page.status, 200);
  const hub = new JSDOM(page.text).window.document.querySelector(
    'ol.acct-steps'
  );
  t.is(hub.querySelector('form.domain-connect-form'), null);
  t.truthy(hub.querySelector('a[href="#setup-step-1"]'));
});
