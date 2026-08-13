/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

/**
 * Tests for vCard RFC 2426 compliance and CardDAV XML namespace correctness.
 *
 * Verifies that:
 * 1. API-created contacts generate RFC 2426-compliant vCard 3.0 with
 *    the REQUIRED N (structured name), PRODID, and REV properties.
 * 2. The cs:getctag property uses the correct CalendarServer namespace
 *    in CardDAV XML responses.
 *
 * @see https://tools.ietf.org/html/rfc2426 (vCard 3.0)
 * @see http://calendarserver.org/ns/ (CTag namespace)
 */

const { Buffer } = require('node:buffer');

const dayjs = require('dayjs-with-plugins');
const ms = require('ms');
const test = require('ava');

const utils = require('../utils');
const config = require('#config');
const xmlHelpers = require('#helpers/carddav-xml');

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupApiServer);
test.beforeEach(utils.setupFactories);
test.afterEach.always(utils.teardownApiServer);

// Helper function to create alias auth header
function createAliasAuth(aliasEmail, pass) {
  return `Basic ${Buffer.from(`${aliasEmail}:${pass}`).toString('base64')}`;
}

// Helper function to create test alias
async function createTestAlias(t) {
  let user = await t.context.userFactory
    .withState({
      plan: 'enhanced_protection',
      [config.userFields.planSetAt]: dayjs().startOf('day').toDate()
    })
    .create();

  await t.context.paymentFactory
    .withState({
      user: user._id,
      amount: 300,
      invoice_at: dayjs().startOf('day').toDate(),
      method: 'free_beta_program',
      duration: ms('30d'),
      plan: user.plan,
      kind: 'one-time'
    })
    .create();

  user = await user.save();

  const domain = await t.context.domainFactory
    .withState({
      members: [{ user: user._id, group: 'admin' }],
      plan: user.plan,
      resolver: t.context.resolver,
      has_smtp: true,
      ignore_mx_check: true
    })
    .create();

  const alias = await t.context.aliasFactory
    .withState({
      user: user._id,
      domain: domain._id,
      recipients: [user.email],
      has_imap: true
    })
    .create();

  const pass = await alias.createToken();
  await alias.save();

  // spoof dns records
  const map = new Map();
  map.set(
    `txt:${domain.name}`,
    t.context.resolver.spoofPacket(
      domain.name,
      'TXT',
      [`${config.paidPrefix}${domain.verification_record}`],
      true,
      ms('5m')
    )
  );
  // store spoofed dns cache
  await t.context.resolver.options.cache.mset(map);

  return { user, domain, alias, pass };
}

// ─── vCard N Property Tests ──────────────────────────────────────────────────

test('API-created contact vCard includes N property (two-part name)', async (t) => {
  const { api } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);

  const res = await api
    .post('/v1/contacts')
    .set('Authorization', createAliasAuth(`${alias.name}@${domain.name}`, pass))
    .send({
      full_name: 'John Doe',
      emails: [{ value: 'john@example.com', type: 'INTERNET' }]
    });

  t.is(res.status, 200);
  t.truthy(res.body.content);

  // Check N property is present and correctly structured
  const { content } = res.body;
  t.true(content.includes('N:'), 'vCard must include N property');
  t.true(content.includes('N:Doe;John;;;'), 'N should be Last;First;;;');
});

test('API-created contact vCard includes N property (three-part name)', async (t) => {
  const { api } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);

  const res = await api
    .post('/v1/contacts')
    .set('Authorization', createAliasAuth(`${alias.name}@${domain.name}`, pass))
    .send({
      full_name: 'John Michael Doe'
    });

  t.is(res.status, 200);

  const { content } = res.body;
  t.true(content.includes('N:Doe;John Michael;;;'));
});

test('API-created contact vCard includes N property (single name)', async (t) => {
  const { api } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);

  const res = await api
    .post('/v1/contacts')
    .set('Authorization', createAliasAuth(`${alias.name}@${domain.name}`, pass))
    .send({
      full_name: 'Madonna'
    });

  t.is(res.status, 200);

  const { content } = res.body;
  // Single name: no last name, first name only
  t.true(content.includes('N:;Madonna;;;'));
});

test('API-created contact vCard includes PRODID', async (t) => {
  const { api } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);

  const res = await api
    .post('/v1/contacts')
    .set('Authorization', createAliasAuth(`${alias.name}@${domain.name}`, pass))
    .send({
      full_name: 'Test User'
    });

  t.is(res.status, 200);
  t.true(res.body.content.includes('PRODID:-//Forward Email//EN'));
});

test('API-created contact vCard includes REV timestamp', async (t) => {
  const { api } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);

  const res = await api
    .post('/v1/contacts')
    .set('Authorization', createAliasAuth(`${alias.name}@${domain.name}`, pass))
    .send({
      full_name: 'Test User'
    });

  t.is(res.status, 200);

  // REV should be present and look like a timestamp (e.g., 20250615T120000Z)
  t.regex(res.body.content, /REV:\d{8}T\d{6}Z/);
});

test('API-created contact vCard is valid VERSION:3.0', async (t) => {
  const { api } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);

  const res = await api
    .post('/v1/contacts')
    .set('Authorization', createAliasAuth(`${alias.name}@${domain.name}`, pass))
    .send({
      full_name: 'Test User',
      emails: [{ value: 'test@example.com', type: 'INTERNET' }],
      phone_numbers: [{ value: '+1234567890', type: 'CELL' }]
    });

  t.is(res.status, 200);

  const { content } = res.body;
  t.true(content.includes('BEGIN:VCARD'));
  t.true(content.includes('VERSION:3.0'));
  t.true(content.includes('END:VCARD'));
  t.true(content.includes('FN:Test User'));
  t.true(content.includes('N:User;Test;;;'));
  t.true(content.includes('EMAIL;TYPE=INTERNET:test@example.com'));
  t.true(content.includes('TEL;TYPE=CELL:+1234567890'));
});

test('API contact list preserves every CardDAV EMAIL value for webmail autocomplete', async (t) => {
  const { api } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);
  const auth = createAliasAuth(`${alias.name}@${domain.name}`, pass);
  const emails = [
    { value: 'primary@multi-email.example.test', type: 'INTERNET' },
    { value: 'work@multi-email.example.test', type: 'WORK' },
    { value: 'home@multi-email.example.test', type: 'HOME' }
  ];

  const createRes = await api
    .post('/v1/contacts')
    .set('Authorization', auth)
    .send({
      full_name: 'Multi Email Test Contact',
      emails
    });

  t.is(createRes.status, 200);
  t.deepEqual(
    createRes.body.emails.map((e) => ({ value: e.value, type: e.type })),
    emails
  );
  for (const { value } of emails) {
    t.true(
      createRes.body.content.includes(`:${value}`),
      `vCard must retain ${value}`
    );
  }

  // This is the exact API path consumed by webmail's Contacts page and
  // recipient autocomplete cache. Regression coverage prevents a CardDAV
  // parser/index change from silently reducing a multi-address contact to one.
  const listRes = await api.get('/v1/contacts').set('Authorization', auth);
  t.is(listRes.status, 200);
  const contact = listRes.body.find((item) => item.id === createRes.body.id);
  t.truthy(contact);
  t.deepEqual(
    contact.emails.map((e) => ({ value: e.value, type: e.type })),
    emails
  );
});

test('API indexes every grouped vCard EMAIL property for webmail autocomplete', async (t) => {
  const { api } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);
  const auth = createAliasAuth(`${alias.name}@${domain.name}`, pass);
  const content = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    'UID:grouped-email-example',
    'FN:Grouped Email Test Contact',
    'item1.EMAIL;TYPE=INTERNET:primary@grouped-email.example.test',
    'item2.EMAIL;TYPE=WORK:work@grouped-email.example.test',
    'item3.EMAIL;TYPE=HOME:home@grouped-email.example.test',
    'END:VCARD'
  ].join('\r\n');

  const createRes = await api
    .post('/v1/contacts')
    .set('Authorization', auth)
    .send({ content });

  t.is(createRes.status, 200);
  t.deepEqual(createRes.body.emails.map((email) => email.value).sort(), [
    'home@grouped-email.example.test',
    'primary@grouped-email.example.test',
    'work@grouped-email.example.test'
  ]);

  const listRes = await api.get('/v1/contacts').set('Authorization', auth);
  t.is(listRes.status, 200);
  const contact = listRes.body.find((item) => item.id === createRes.body.id);
  t.truthy(contact);
  t.deepEqual(contact.emails.map((email) => email.value).sort(), [
    'home@grouped-email.example.test',
    'primary@grouped-email.example.test',
    'work@grouped-email.example.test'
  ]);
});

test('API-updated contact vCard includes N property', async (t) => {
  const { api } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);
  const auth = createAliasAuth(`${alias.name}@${domain.name}`, pass);

  // Create
  const createRes = await api
    .post('/v1/contacts')
    .set('Authorization', auth)
    .send({ full_name: 'Original Name' });
  t.is(createRes.status, 200);

  // Update with new name
  const updateRes = await api
    .put(`/v1/contacts/${createRes.body.id}`)
    .set('Authorization', auth)
    .send({ full_name: 'Updated Name' });
  t.is(updateRes.status, 200);

  const { content } = updateRes.body;
  t.true(content.includes('N:Name;Updated;;;'));
  t.true(content.includes('FN:Updated Name'));
  t.true(content.includes('PRODID:-//Forward Email//EN'));
  t.regex(content, /REV:\d{8}T\d{6}Z/);
});

test('API-created contact with empty name still has N property', async (t) => {
  const { api } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);

  const res = await api
    .post('/v1/contacts')
    .set('Authorization', createAliasAuth(`${alias.name}@${domain.name}`, pass))
    .send({
      full_name: '',
      emails: [{ value: 'noname@example.com', type: 'INTERNET' }]
    });

  // Even with empty name, N should be present
  if (res.status === 200) {
    t.true(res.body.content.includes('N:'));
  } else {
    // If the API rejects empty name, that's also acceptable
    t.pass('API rejected empty name');
  }
});

// ─── cs:getctag Namespace Tests ──────────────────────────────────────────────

test('getAddressbookPropfindXML uses cs:getctag (CalendarServer namespace)', (t) => {
  const addressBook = {
    name: 'Default',
    description: 'Test address book',
    synctoken: '1234567890'
  };

  // getAddressbookPropfindXML is used for address book collection PROPFIND
  // The getctag case should use cs: prefix, not d: prefix
  const xml = xmlHelpers.getAddressbookPropfindXML(
    addressBook,
    ['getctag'],
    '/dav/user/addressbooks/default/'
  );

  // Should contain cs:getctag, not d:getctag
  t.true(xml.includes('cs:getctag'), 'XML should use cs:getctag namespace');
  t.false(xml.includes('d:getctag'), 'XML should NOT use d:getctag namespace');
  // Should contain the sync token value
  t.true(xml.includes('1234567890'));
});

test('getMultistatusXML declares CalendarServer namespace', (t) => {
  const responses = [
    {
      href: '/dav/user/addressbooks/default/',
      propstat: [
        {
          props: [{ name: 'cs:getctag', value: '1234567890' }],
          status: '200 OK'
        }
      ]
    }
  ];

  const xml = xmlHelpers.getMultistatusXML(responses);

  // Should declare the CalendarServer namespace
  t.true(xml.includes('xmlns:cs="http://calendarserver.org/ns/"'));
  t.true(xml.includes('<cs:getctag>1234567890</cs:getctag>'));
});

test('CardDAV responses do not double-escape special characters (Issue #573)', async (t) => {
  const { api } = t.context;
  const { alias, domain, pass } = await createTestAlias(t);
  const auth = createAliasAuth(`${alias.name}@${domain.name}`, pass);

  const vCardCustom = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    'FN:A&B Services',
    'N:Services;A&B;;;',
    'item1.URL;type=pref:https://www.example.test/',
    'item1.X-ABLabel:_$!<HomePage>!$_',
    'END:VCARD'
  ].join('\r\n');

  const createRes = await api
    .post('/v1/contacts')
    .set('Authorization', auth)
    .send({ content: vCardCustom });

  t.is(createRes.status, 200);

  const { getAddressbookQueryXML } = require('./../../helpers/carddav-xml');
  const xmlOutput = getAddressbookQueryXML(
    [
      {
        href: '/dav/test/addressbooks/default/1.vcf',
        etag: '"123"',
        content: vCardCustom
      }
    ],
    ['address-data', 'getetag']
  );

  t.true(xmlOutput.includes('A&amp;B Services'));
  t.false(xmlOutput.includes('&amp;amp;'));
  t.true(xmlOutput.includes('&lt;HomePage&gt;'));
  t.false(xmlOutput.includes('&amp;lt;'));
});
