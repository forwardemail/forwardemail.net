/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// The My Account and Admin pages share one shell: a sidebar (a bar that opens
// the same links on small screens), the same links in the navbar menus, a
// guide on the new domain page, a setup hub on the domain page, and the word
// "mailbox" for what some tools call an alias.
//

const { randomUUID } = require('node:crypto');

const falso = require('@ngneat/falso');
const test = require('ava');
const { JSDOM } = require('jsdom');

const utils = require('../utils');

const config = require('#config');
const { Domains, Payments, Users } = require('#models');

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

async function get(t, path) {
  const res = await t.context.web.get(path).set('Accept', 'text/html');
  t.is(res.status, 200, `${path} -> ${res.headers.location}`);
  return new JSDOM(res.text).window.document;
}

async function makeDomain(t, state) {
  return t.context.domainFactory
    .withState({
      name: `test-${randomUUID()}.example.com`,
      members: [{ user: t.context.user._id, group: 'admin' }],
      plan: 'free',
      // (the records are not looked up: the flags stand)
      skip_verification: true,
      ...state
    })
    .create();
}

// (an account without domains is sent to the page of a new one)
async function withDomain(t) {
  return makeDomain(t, { has_mx_record: true, has_txt_record: true });
}

const hrefs = (root) => [...root.querySelectorAll('a')].map((a) => a.href);

test('the sidebar lists the domains with a status dot and the links of the current one', async (t) => {
  await Users.updateOne(
    { _id: t.context.user._id },
    { $set: { plan: 'enhanced_protection' } }
  );
  const ready = await makeDomain(t, {
    plan: 'enhanced_protection',
    has_mx_record: true,
    has_txt_record: true
  });
  const pending = await makeDomain(t, {
    has_mx_record: false,
    has_txt_record: false
  });

  const document = await get(t, '/en/my-account/domains');
  const sidebar = document.querySelector('aside.acct-sidebar');
  t.truthy(sidebar);
  t.truthy(document.querySelector('main.acct-shell'));

  // the bar that opens the list on small screens
  const toggle = sidebar.querySelector('.acct-sidebar-toggle');
  t.is(toggle.dataset.target, '#acct-sidebar-nav');
  t.truthy(sidebar.querySelector('#acct-sidebar-nav'));

  // the one-click add button, and the places of the account
  const links = hrefs(sidebar);
  for (const path of [
    '/en/my-account/domains/new',
    '/en/my-account/domains',
    '/en/my-account/emails',
    '/en/my-account/logs',
    '/en/my-account/analytics',
    '/en/my-account/dmarc-reports',
    '/en/my-account/profile',
    '/en/my-account/billing',
    '/en/my-account/security'
  ]) {
    t.true(links.includes(path), `${path}`);
  }

  // every domain, a dot for its status
  const dot = (domain) =>
    sidebar.querySelector(
      `a.acct-domain[href="/en/my-account/domains/${domain.name}"] .acct-dot`
    );
  t.true(dot(ready).classList.contains('acct-dot--ready'));
  t.true(dot(pending).classList.contains('acct-dot--setup'));

  // the links of the domain are listed once the visitor is on it
  t.is(sidebar.querySelector('.acct-sublinks'), null);
  const onDomain = await get(t, `/en/my-account/domains/${ready.name}`);
  const sublinks = hrefs(onDomain.querySelector('.acct-sublinks'));
  t.true(sublinks.includes(`/en/my-account/domains/${ready.name}/aliases`));
  t.true(sublinks.includes(`/en/my-account/domains/${ready.name}/verify-smtp`));
  t.true(
    sublinks.includes(`/en/my-account/domains/${ready.name}/advanced-settings`)
  );
  const active = onDomain.querySelector(
    'aside.acct-sidebar a.acct-domain.active'
  );
  t.is(active.getAttribute('href'), `/en/my-account/domains/${ready.name}`);
});

test('the sidebar has no Admin links for a user who is not an admin', async (t) => {
  await withDomain(t);
  const document = await get(t, '/en/my-account/domains');
  const sidebar = document.querySelector('aside.acct-sidebar');
  t.false(hrefs(sidebar).some((href) => href.startsWith('/en/admin')));
  t.is(document.querySelector('#navbar-dropdown-admin'), null);

  // and the admin pages stay closed
  const res = await t.context.web.get('/en/admin').set('Accept', 'text/html');
  t.not(res.status, 200);
});

test('an admin gets the Admin sidebar, with a way back to My Account', async (t) => {
  await withDomain(t);
  await Users.updateOne(
    { _id: t.context.user._id },
    { $set: { group: 'admin' } }
  );

  const mine = await get(t, '/en/my-account/domains');
  t.true(hrefs(mine.querySelector('aside.acct-sidebar')).includes('/en/admin'));

  const admin = await get(t, '/en/admin');
  const sidebar = admin.querySelector('aside.acct-sidebar');
  const links = hrefs(sidebar);
  t.true(links.includes('/en/my-account/domains'));
  for (const path of [
    '/en/admin/spam',
    '/en/admin/users',
    '/en/admin/domains'
  ]) {
    t.true(links.includes(path), `${path}`);
  }

  // the navbar menu lists the same pages
  const menu = admin.querySelector('[aria-labelledby="navbar-dropdown-admin"]');
  t.true(hrefs(menu).includes('/en/admin/spam'));
});

test('pages that are not part of an account have no sidebar', async (t) => {
  for (const path of ['/en/faq', '/en/about', '/en/private-business-email']) {
    const res = await t.context.web.get(path).set('Accept', 'text/html');
    t.is(res.status, 200, `${path}`);
    const { document } = new JSDOM(res.text).window;
    t.is(document.querySelector('aside.acct-sidebar'), null, `${path}`);
    t.is(document.querySelector('main.acct-shell'), null, `${path}`);
  }
});

test('the My Account menu of the navbar has the same places as the sidebar', async (t) => {
  await withDomain(t);
  const document = await get(t, '/en/my-account/domains');
  const menu = document.querySelector(
    '[aria-labelledby="navbar-dropdown-my-account"]'
  );
  const links = hrefs(menu);
  for (const path of [
    '/en/my-account/domains',
    '/en/my-account/domains/new',
    '/en/my-account/emails',
    '/en/my-account/logs',
    '/en/my-account/analytics',
    '/en/my-account/profile',
    '/en/my-account/billing',
    '/en/my-account/security',
    '/en/logout'
  ]) {
    t.true(links.includes(path), `${path}`);
  }
});

test('the new domain page keeps its form and guides people who know DNS and who do not', async (t) => {
  const document = await get(t, '/en/my-account/domains/new');

  // the form still asks for the domain, and only for what it asked before
  const form = document.querySelector(
    'form[action="/en/my-account/domains/new"]'
  );
  t.truthy(form.querySelector('input[name="domain"]'));
  const names = [...form.querySelectorAll('input, select, textarea')].map(
    (el) => el.name
  );
  t.false(names.includes('dns-path'));

  // the guide: two paths, each in a panel, chosen by radios outside of the form
  const guide = document.querySelector('.acct-paths[role="group"]');
  t.truthy(guide);
  t.is(form.querySelector('.acct-paths'), null);
  t.truthy(guide.querySelector('input#path-new[type="radio"]'));
  t.truthy(guide.querySelector('input#path-know[type="radio"]'));
  t.regex(guide.textContent, /1-Click Setup/);
  t.regex(guide.textContent, /zone file/i);
  t.regex(guide.textContent, /Verify/);
  t.regex(
    guide.textContent,
    /Some tools call it an alias|also called an alias/
  );
});

test('the domain page walks through setup, with 1-Click Setup, step by step and a zone file', async (t) => {
  await Users.updateOne(
    { _id: t.context.user._id },
    { $set: { plan: 'enhanced_protection' } }
  );
  const domain = await makeDomain(t, {
    plan: 'enhanced_protection',
    has_mx_record: false,
    has_txt_record: false
  });

  const document = await get(t, `/en/my-account/domains/${domain.name}`);
  const steps = document.querySelectorAll('ol.acct-steps > li.acct-step');
  t.is(steps.length, 4);
  t.true(steps[0].classList.contains('acct-step--current'));

  const form = steps[0].querySelector('form.domain-connect-form');
  t.truthy(form);
  t.is(form.querySelector('input[name="domain"]').value, domain.name);
  t.truthy(steps[0].querySelector('a[href="#setup-step-1"]'));
  const zone = steps[0].querySelector('a[href="#setup-zone-file"]');
  t.truthy(zone);
  t.truthy(document.querySelector('#setup-zone-file'));
  t.truthy(document.querySelector('#setup-step-1'));

  // the DNS records of the page are all still there
  t.regex(document.body.textContent, /forward-email-site-verification/);
});

test('mailboxes are the name of the aliases page, which explains what they are', async (t) => {
  await Users.updateOne(
    { _id: t.context.user._id },
    { $set: { plan: 'enhanced_protection' } }
  );
  const domain = await makeDomain(t, {
    plan: 'enhanced_protection',
    has_mx_record: true,
    has_txt_record: true
  });
  await t.context.aliasFactory
    .withState({
      user: t.context.user._id,
      domain: domain._id,
      recipients: [t.context.user.email]
    })
    .create();

  const document = await get(
    t,
    `/en/my-account/domains/${domain.name}/aliases`
  );
  const callout = document.querySelector('.acct-callout');
  t.truthy(callout);
  t.regex(callout.textContent, /Some tools call it an alias/);
  t.regex(document.querySelector('.breadcrumb').textContent, /Mailboxes/);
  t.notRegex(document.querySelector('.breadcrumb').textContent, /Aliases/);
});

test('the advanced settings page jumps to its sections', async (t) => {
  const domain = await makeDomain(t, {
    has_mx_record: true,
    has_txt_record: true
  });
  const document = await get(
    t,
    `/en/my-account/domains/${domain.name}/advanced-settings`
  );
  const jump = document.querySelector('nav.acct-jump');
  t.truthy(jump);
  const anchors = [...jump.querySelectorAll('a[href^="#"]')].map((a) =>
    a.getAttribute('href').slice(1)
  );
  t.true(anchors.length >= 5);
  for (const id of anchors) {
    t.truthy(document.querySelector(`#${id}`), `#${id} exists`);
  }

  for (const id of ['manage-team', 'zone-file', 'delete-domain']) {
    t.true(anchors.includes(id), `${id}`);
  }
});

test('the locked links of a free domain ask first, like the cards of the list', async (t) => {
  const domain = await makeDomain(t, {
    has_mx_record: true,
    has_txt_record: true
  });
  const pageOf = async () => {
    const document = await get(t, `/en/my-account/domains/${domain.name}`);
    return document.querySelector('.acct-sublinks');
  };

  // a free account goes to upgrade, and nothing switches a plan by a link
  let sublinks = await pageOf();
  for (const link of sublinks.querySelectorAll('a')) {
    t.notRegex(link.getAttribute('href'), /\/billing\?plan=/);
  }

  const lockedLinks = [...sublinks.querySelectorAll('a')].filter((a) =>
    a.querySelector('.acct-link-lock')
  );
  t.true(lockedLinks.length >= 5);
  for (const link of lockedLinks) {
    t.is(
      link.getAttribute('href'),
      '/en/my-account/billing/upgrade?plan=enhanced_protection'
    );
  }

  // a paid account is asked to switch the domain to its plan
  await Users.updateOne(
    { _id: t.context.user._id },
    { $set: { plan: 'enhanced_protection' } }
  );
  sublinks = await pageOf();
  const forms = sublinks.querySelectorAll('form.confirm-prompt');
  t.true(forms.length >= 5);
  for (const form of forms) {
    t.is(
      form.getAttribute('action'),
      `/en/my-account/domains/${domain.name}/billing`
    );
    t.is(form.method.toLowerCase(), 'get');
    t.is(form.querySelector('input[name="plan"]').value, 'enhanced_protection');
    t.truthy(form.dataset.confirmPromptHtml);
    t.truthy(form.querySelector('button.acct-link .acct-link-lock'));
  }

  // what the plan does not lock stays a link
  const settings = [...sublinks.querySelectorAll('a')].find((a) =>
    /Settings/.test(a.textContent)
  );
  t.is(
    settings.getAttribute('href'),
    `/en/my-account/domains/${domain.name}/advanced-settings`
  );
  t.is(settings.querySelector('.acct-link-lock'), null);
});

test('the status of a domain is said in words, not only by the color of its dot', async (t) => {
  const domain = await makeDomain(t, {
    has_mx_record: false,
    has_txt_record: false
  });
  const document = await get(t, '/en/my-account/domains');
  const link = document.querySelector(
    `aside.acct-sidebar a.acct-domain[href="/en/my-account/domains/${domain.name}"]`
  );
  t.is(link.querySelector('.acct-dot').getAttribute('aria-hidden'), 'true');
  t.regex(link.querySelector('.sr-only').textContent, /Setup Required/);
});

test('the print and PDF views of a receipt have no sidebar', async (t) => {
  await withDomain(t);
  const payment = await Payments.create({
    user: t.context.user._id,
    amount: 300,
    amount_formatted: '$3.00',
    invoice_at: new Date(),
    method: 'free_beta_program',
    duration: config.validDurations[0],
    plan: 'enhanced_protection',
    kind: 'one-time',
    reference: 'ABCDEFGH'
  });

  // the receipt in the page has the sidebar
  const res = await t.context.web
    .get(`/en/my-account/billing/${payment.reference}`)
    .set('Accept', 'text/html');
  t.is(res.status, 200);
  t.truthy(
    new JSDOM(res.text).window.document.querySelector('aside.acct-sidebar')
  );

  // the print view does not (it is a page of its own, redirected to its name)
  const print = await t.context.web
    .get(`/en/my-account/billing/${payment.reference}.html`)
    .set('Accept', 'text/html')
    .redirects(1);
  t.is(print.status, 200);
  t.is(
    new JSDOM(print.text).window.document.querySelector('aside.acct-sidebar'),
    null
  );
});

test('an id is used once on a page, so that what points at it finds it', async (t) => {
  await Users.updateOne(
    { _id: t.context.user._id },
    { $set: { plan: 'enhanced_protection' } }
  );
  const domain = await makeDomain(t, {
    plan: 'enhanced_protection',
    has_mx_record: true,
    has_txt_record: true
  });
  const base = `/en/my-account/domains/${domain.name}`;
  for (const path of [
    '/en/my-account/domains',
    '/en/my-account/domains/new',
    base,
    `${base}/advanced-settings`,
    '/en/my-account/profile',
    '/en/my-account/security'
  ]) {
    const document = await get(t, path);
    const seen = new Set();
    const twice = new Set();
    for (const el of document.querySelectorAll('[id]')) {
      if (seen.has(el.id)) twice.add(el.id);
      seen.add(el.id);
    }

    t.deepEqual([...twice], [], `${path}`);
  }

  // the button that copies the webhook key copies the field that holds it
  const document = await get(t, `${base}/advanced-settings`);
  const copy = document.querySelector('[data-clipboard-target="#webhook-key"]');
  t.truthy(copy);
  t.is(document.querySelector('#webhook-key').tagName, 'INPUT');
});

test('an account with many domains finds one by name from the sidebar', async (t) => {
  // few domains are all listed, without a search
  const first = await withDomain(t);
  let document = await get(t, '/en/my-account/profile');
  t.is(document.querySelector('aside.acct-sidebar form.acct-find'), null);

  const domains = [first];
  for (let i = 0; i < 11; i++) {
    domains.push(await withDomain(t));
  }

  document = await get(t, '/en/my-account/profile');
  const sidebar = document.querySelector('aside.acct-sidebar');
  // some are listed, with a link to them all
  t.is(sidebar.querySelectorAll('a.acct-domain').length, 8);
  t.regex(sidebar.querySelector('a.acct-more').textContent, /12/);

  // the search leads to the list of domains, which shows the matches
  const form = sidebar.querySelector('form.acct-find');
  t.is(form.getAttribute('action'), '/en/my-account/domains');
  t.is(form.method.toLowerCase(), 'get');
  const input = form.querySelector('input[name="q"]');
  t.truthy(input.getAttribute('aria-label'));

  // every domain is suggested while typing
  const list = document.querySelector(`datalist#${input.getAttribute('list')}`);
  t.deepEqual(
    [...list.querySelectorAll('option')].map((o) => o.value).sort(),
    domains.map((d) => d.name).sort()
  );

  const res = await t.context.web
    .get(`/en/my-account/domains?q=${domains[11].name}`)
    .set('Accept', 'text/html');
  t.is(res.status, 200);
  const titles = [
    ...new JSDOM(res.text).window.document.querySelectorAll(
      '.acct-domain-card h2 a'
    )
  ].map((a) => a.textContent.trim());
  t.deepEqual(titles, [domains[11].name]);
});

test('the sidebar lists the default domain first, then what needs setup, then the newest', async (t) => {
  const day = 24 * 60 * 60 * 1000;
  const make = async (state, age) => {
    const domain = await makeDomain(t, {
      has_mx_record: true,
      has_txt_record: true,
      ...state
    });
    await Domains.collection.updateOne(
      { _id: domain._id },
      { $set: { created_at: new Date(Date.now() - age * day) } }
    );
    return domain;
  };

  const oldest = await make({}, 400);
  const older = await make({}, 300);
  const pending = await make({ has_mx_record: false }, 200);
  const newest = await make({}, 1);
  // more than the sidebar lists, all of them older
  for (let i = 0; i < 7; i++) {
    await make({}, 500 + i);
  }

  const names = async () => {
    const document = await get(t, '/en/my-account/profile');
    return {
      document,
      listed: [
        ...document.querySelectorAll('aside.acct-sidebar a.acct-domain')
      ].map((a) => a.dataset.name)
    };
  };

  let { listed } = await names();
  t.deepEqual(listed.slice(0, 4), [
    pending.name,
    newest.name,
    older.name,
    oldest.name
  ]);

  // the default domain of the profile goes to the top, with a star
  await Users.updateOne(
    { _id: t.context.user._id },
    { $set: { [config.userFields.defaultDomain]: oldest._id } }
  );
  const after = await names();
  listed = after.listed;
  t.deepEqual(listed.slice(0, 3), [oldest.name, pending.name, newest.name]);
  const first = after.document.querySelector(
    'aside.acct-sidebar a.acct-domain'
  );
  t.truthy(first.querySelector('.acct-link-star'));
  t.regex(first.querySelector('.sr-only').textContent, /Default Domain/);
  t.is(
    after.document.querySelectorAll('aside.acct-sidebar .acct-link-star')
      .length,
    1
  );

  // where the browser lists the domains viewed last, for this user only
  const recent = after.document.querySelector('#acct-recent');
  t.is(recent.dataset.user, t.context.user.id);
  t.is(recent.dataset.base, '/en/my-account/domains');
  t.true(recent.classList.contains('d-none'));
});

test('the pages of an alias are headed as a mailbox', async (t) => {
  await Users.updateOne(
    { _id: t.context.user._id },
    { $set: { plan: 'enhanced_protection' } }
  );
  const domain = await makeDomain(t, {
    plan: 'enhanced_protection',
    has_mx_record: true,
    has_txt_record: true
  });
  const alias = await t.context.aliasFactory
    .withState({
      user: t.context.user._id,
      domain: domain._id,
      recipients: [t.context.user.email]
    })
    .create();
  const base = `/en/my-account/domains/${domain.name}/aliases`;

  // (the paths keep the word alias)
  const add = await get(t, `${base}/new`);
  t.is(add.querySelector('h1').textContent.trim(), 'Add Mailbox');
  t.regex(add.querySelector('#acct-main').textContent, /Create Mailbox/);

  const edit = await get(t, `${base}/${alias.id}`);
  t.is(edit.querySelector('h1').textContent.trim(), 'Edit Mailbox');
  t.regex(edit.querySelector('.breadcrumb').textContent, /Mailboxes/);
  t.regex(edit.querySelector('#acct-main').textContent, /Update Mailbox/);
  t.regex(edit.querySelector('#acct-main').textContent, /Back to Mailboxes/);
});

test('the FAQ says that a mailbox and an alias are the same, in every language', async (t) => {
  for (const locale of ['en', 'de', 'ja', 'ar']) {
    const res = await t.context.web
      .get(`/${locale}/faq`)
      .set('Accept', 'text/html');
    t.is(res.status, 200, `${locale}`);
    const { document } = new JSDOM(res.text).window;
    const id = 'what-is-the-difference-between-a-mailbox-and-an-alias';
    t.is(document.querySelectorAll(`[id="${id}"]`).length, 1, `${locale}`);
    t.truthy(document.querySelector(`a[href$="#${id}"]`), `${locale}`);
    // the sections around it keep their links
    t.truthy(document.querySelector('[id="what-is-forward-email"]'));
    t.truthy(document.querySelector('[id="who-uses-forward-email"]'));
  }
});

test('breadcrumbs show the name of a domain as it is', async (t) => {
  await Users.updateOne(
    { _id: t.context.user._id },
    { $set: { plan: 'enhanced_protection' } }
  );
  const domain = await makeDomain(t, {
    plan: 'enhanced_protection',
    has_mx_record: true,
    has_txt_record: true
  });
  const alias = await t.context.aliasFactory
    .withState({
      user: t.context.user._id,
      domain: domain._id,
      recipients: [t.context.user.email]
    })
    .create();
  const crumbs = (document) =>
    [...document.querySelectorAll('.breadcrumb .breadcrumb-item')].map((li) =>
      li.textContent.trim()
    );

  // by its name, and by its id
  for (const key of [domain.name, domain.id]) {
    for (const page of ['', '/aliases', '/advanced-settings']) {
      const document = await get(t, `/en/my-account/domains/${key}${page}`);
      t.true(crumbs(document).includes(domain.name), `${key}${page}`);
    }
  }

  // and the address of a mailbox
  const document = await get(
    t,
    `/en/my-account/domains/${domain.name}/aliases/${alias.id}`
  );
  t.true(crumbs(document).includes(domain.name));
  t.true(crumbs(document).includes(`${alias.name}@${domain.name}`));
  // the other parts are still worded
  t.true(crumbs(document).includes('My Account'));
});
