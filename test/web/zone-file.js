/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Every DNS record a domain needs, at once, as a zone file to copy or
// download from its setup and settings pages, with how to import it at the
// domain's DNS provider (from `ZONE_FILE_IMPORT` in `config/utilities.js`).
//

const { Buffer } = require('node:buffer');
const { randomUUID } = require('node:crypto');

const dayjs = require('dayjs-with-plugins');
const falso = require('@ngneat/falso');
const ms = require('ms');
const test = require('ava');

const utils = require('../utils');

const config = require('#config');
const getZoneFile = require('#helpers/get-zone-file');
const { Domains, Users } = require('#models');

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupFactories);

test.beforeEach(async (t) => {
  t.context.password = falso.randPassword();
  let user = await t.context.userFactory.make();
  user = await Users.register(user, t.context.password);
  user[config.userFields.hasSetPassword] = true;
  user.plan = 'team';
  user[config.userFields.planSetAt] = dayjs().startOf('day').toDate();
  user[config.userFields.hasVerifiedEmail] = true;
  await t.context.paymentFactory
    .withState({
      user: user._id,
      amount: 300,
      invoice_at: dayjs().startOf('day').toDate(),
      method: 'free_beta_program',
      duration: ms('30d'),
      plan: 'team',
      kind: 'one-time'
    })
    .create();
  t.context.user = await user.save();
  await utils.setupWebServer(t);
  await utils.loginUser(t);

  const domain = await t.context.domainFactory
    .withState({
      name: `zone-${randomUUID()}.example.com`,
      members: [{ user: t.context.user._id, group: 'admin' }],
      plan: 'team',
      skip_verification: true
    })
    .create();
  // (the domain's DNS is hosted at Bunny DNS)
  t.context.domain = await Domains.findByIdAndUpdate(
    domain._id,
    { $set: { ns: ['kiki.bunny.net', 'coco.bunny.net'] } },
    { new: true }
  );
});
test.afterEach.always(utils.teardownWebServer);

test('zone file has every record with absolute names and quoted TXT data', (t) => {
  const { domain } = t.context;
  const zone = getZoneFile(domain, t.context.user);
  const { name } = domain;
  const lines = zone
    .split('\n')
    .filter((line) => line && !line.startsWith(';'));
  const record = (owner, type) =>
    lines.filter((line) => {
      const [n, ttl, cls, rrtype] = line.split(/\s+/);
      return n === owner && ttl === '3600' && cls === 'IN' && rrtype === type;
    });

  // receiving mail and domain verification
  const mx = record(`${name}.`, 'MX').map((line) => line.split(/\s+/).slice(4));
  t.deepEqual(mx, [
    ['0', 'mx1.forwardemail.net.'],
    ['0', 'mx2.forwardemail.net.']
  ]);
  const txt = new Set(
    record(`${name}.`, 'TXT').map((line) =>
      line.split(/\s+/).slice(4).join(' ')
    )
  );
  t.true(
    txt.has(
      `"${config.recordPrefix}-site-verification=${domain.verification_record}"`
    )
  );
  t.true(txt.has('"v=spf1 include:spf.forwardemail.net -all"'));

  // DKIM, split into quoted strings of at most 255 characters
  const [dkim] = record(
    `${domain.dkim_key_selector}._domainkey.${name}.`,
    'TXT'
  );
  t.truthy(dkim);
  const strings = dkim.split(/\s+IN\s+TXT\s+/)[1].match(/"[^"]*"/g);
  t.true(strings.every((s) => s.length - 2 <= 255));
  t.is(
    strings.map((s) => s.slice(1, -1)).join(''),
    `v=DKIM1; k=rsa; p=${domain.dkim_public_key.toString('base64')};`
  );

  // a 2048-bit key is longer than one string
  const long = getZoneFile(
    {
      name: 'example.com',
      id: 'test',
      plan: 'team',
      verification_record: 'test',
      dkim_key_selector: 'fe-test',
      dkim_public_key: Buffer.alloc(294, 1),
      return_path: 'fe-bounces'
    },
    t.context.user
  );
  const longStrings = long
    .split('\n')
    .find((line) => line.includes('v=DKIM1'))
    .match(/"[^"]*"/g);
  t.is(longStrings.length, 2);
  t.is(longStrings[0].length - 2, 255);

  // Return-Path, DMARC, and autodiscovery
  t.is(record(`${domain.return_path}.${name}.`, 'CNAME').length, 1);
  t.true(
    record(`${domain.return_path}.${name}.`, 'CNAME')[0].endsWith(
      `${config.webHost}.`
    )
  );
  t.true(
    record(`_dmarc.${name}.`, 'TXT')[0].endsWith(
      `"v=DMARC1; p=reject; pct=100; rua=mailto:dmarc-${domain.id}@${config.webHost};"`
    )
  );
  t.true(
    record(`autoconfig.${name}.`, 'CNAME')[0].endsWith(
      'autoconfig.forwardemail.net.'
    )
  );
  t.true(
    record(`autodiscover.${name}.`, 'CNAME')[0].endsWith(
      'autodiscover.forwardemail.net.'
    )
  );
  t.true(
    record(`_imaps._tcp.${name}.`, 'SRV')[0].endsWith(
      '0 1 993 imap.forwardemail.net.'
    )
  );
  t.false(zone.includes(' .\n'));

  // a domain on the free plan only needs its MX records and forwarding TXT
  const free = getZoneFile(
    { ...domain.toObject(), plan: 'free' },
    t.context.user
  );
  t.true(free.includes(`"${config.recordPrefix}=${t.context.user.email}"`));
  t.false(free.includes('_domainkey'));
  t.false(free.includes('v=spf1'));

  // and keeps the forwarding TXT records it already has (e.g. per alias)
  const kept = getZoneFile(
    { ...domain.toObject(), plan: 'free' },
    t.context.user,
    {
      existingTXT: [
        `${config.recordPrefix}=hello:hello@example.net`,
        `${config.recordPrefix}=sales:sales@example.net`
      ]
    }
  );
  t.true(kept.includes(`"${config.recordPrefix}=hello:hello@example.net"`));
  t.true(kept.includes(`"${config.recordPrefix}=sales:sales@example.net"`));
  t.false(kept.includes(`"${config.recordPrefix}=${t.context.user.email}"`));
});

test('zone file downloads from the domain', async (t) => {
  const { domain } = t.context;
  const res = await t.context.web.get(
    `/en/my-account/domains/${domain.name}/zone-file`
  );
  t.is(res.status, 200);
  t.regex(res.headers['content-type'], /^text\/plain/);
  t.is(
    res.headers['content-disposition'],
    `attachment; filename="${domain.name}.zone"`
  );
  t.true(res.text.includes(`${domain.name}.`));
  t.true(res.text.includes('mx1.forwardemail.net.'));
  t.true(res.text.includes(`_dmarc.${domain.name}.`));
});

test('setup and settings pages show the zone file and how to import it', async (t) => {
  const { domain } = t.context;
  const setup = await t.context.web.get(
    `/en/my-account/domains/${domain.name}`
  );
  t.is(setup.status, 200);
  t.true(setup.text.includes('id="zone-file"'));
  t.true(setup.text.includes('id="copy-zone-file"'));
  t.true(setup.text.includes(`_dmarc.${domain.name}.`));
  t.true(setup.text.includes(`/my-account/domains/${domain.name}/zone-file`));
  // Bunny DNS imports zone files under Import/Export
  t.true(setup.text.includes('Bunny DNS'));
  t.true(setup.text.includes('DNS → (your domain) → Import/Export'));
  t.true(setup.text.includes('https://bunny.net/docs/dns/import-export'));

  const settings = await t.context.web.get(
    `/en/my-account/domains/${domain.name}/advanced-settings`
  );
  t.is(settings.status, 200);
  t.true(settings.text.includes('id="zone-file"'));
  t.true(
    settings.text.includes(`/my-account/domains/${domain.name}/zone-file`)
  );
  t.true(settings.text.includes('id="manage-team"'));

  const list = await t.context.web.get('/en/my-account/domains');
  t.is(list.status, 200);
  t.true(list.text.includes(`/my-account/domains/${domain.name}/zone-file`));
  t.true(
    list.text.includes(
      `/my-account/domains/${domain.name}/advanced-settings#manage-team`
    )
  );
});

test('Bunny DNS has a setup guide', async (t) => {
  const res = await t.context.web.get('/en/guides/bunny-dns');
  t.is(res.status, 200);
  t.true(res.text.includes('Bunny DNS'));
  t.true(res.text.includes('https://dash.bunny.net/'));
  t.true(res.text.includes('DNS → (your domain) → Import/Export'));
});
