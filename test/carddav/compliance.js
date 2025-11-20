/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// NOTE: we use `test.serial` here for tests with `sinon.stub`
//

const { Buffer } = require('node:buffer');

const Redis = require('ioredis-mock');
const axios = require('axios');
const dayjs = require('dayjs-with-plugins');
const ip = require('ip');
const ms = require('ms');
const pWaitFor = require('p-wait-for');
const sinon = require('sinon');
const test = require('ava');
const { Semaphore } = require('@shopify/semaphore');

const utils = require('../utils');
const CardDAV = require('../../carddav-server');
const SQLite = require('../../sqlite-server');

const Users = require('#models/users');
const AddressBooks = require('#models/address-books');
const carddavConfig = require('#config/carddav');
const config = require('#config');
const createTangerine = require('#helpers/create-tangerine');
const createWebSocketAsPromised = require('#helpers/create-websocket-as-promised');
const env = require('#config/env');
const logger = require('#helpers/logger');
const xmlHelpers = require('#helpers/carddav-xml');

// dynamically import @ava/get-port
let getPort;
import('@ava/get-port').then((obj) => {
  getPort = obj.default;
});

const semaphore = new Semaphore(2);
const IP_ADDRESS = ip.address();

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupFactories);

test.beforeEach(async (t) => {
  t.context.permit = await semaphore.acquire();
  const client = new Redis();
  const subscriber = new Redis();
  client.setMaxListeners(0);
  subscriber.setMaxListeners(0);
  subscriber.channels.setMaxListeners(0);

  t.context.client = client;

  if (!getPort) await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
  const port = await getPort();
  const sqlitePort = await getPort();

  const sqlite = new SQLite({ client, subscriber });
  await sqlite.listen(sqlitePort);

  const wsp = createWebSocketAsPromised({
    port: sqlitePort
  });
  t.context.wsp = wsp;

  const cardDAV = new CardDAV(
    {
      ...carddavConfig,
      wsp,
      port,
      client
    },
    Users
  );
  cardDAV.app.server = cardDAV.server;
  await cardDAV.listen();

  t.context.serverUrl = `http://${IP_ADDRESS}:${port}`;

  const user = await t.context.userFactory
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

  t.context.user = await user.save();

  const resolver = createTangerine(t.context.client, logger);

  const domain = await t.context.domainFactory
    .withState({
      members: [{ user: user._id, group: 'admin' }],
      plan: user.plan,
      resolver,
      has_smtp: true
    })
    .create();
  t.context.domain = domain;

  const alias = await t.context.aliasFactory
    .withState({
      user: user._id,
      domain: domain._id,
      recipients: [user.email],
      has_imap: true
    })
    .create();

  const pass = await alias.createToken();
  t.context.pass = pass;
  t.context.alias = await alias.save();

  t.context.username = `${alias.name}@${domain.name}`;

  // spoof dns records
  const map = new Map();

  map.set(
    `txt:${domain.name}`,
    resolver.spoofPacket(
      domain.name,
      'TXT',
      [`${config.paidPrefix}${domain.verification_record}`],
      true,
      ms('5m')
    )
  );

  // dkim
  map.set(
    `txt:${domain.dkim_key_selector}._domainkey.${domain.name}`,
    resolver.spoofPacket(
      `${domain.dkim_key_selector}._domainkey.${domain.name}`,
      'TXT',
      [`v=DKIM1; k=rsa; p=${domain.dkim_public_key.toString('base64')};`],
      true
    )
  );

  // spf
  map.set(
    `txt:${env.WEB_HOST}`,
    resolver.spoofPacket(
      `${env.WEB_HOST}`,
      'TXT',
      [`v=spf1 ip4:${IP_ADDRESS} -all`],
      true,
      ms('5m')
    )
  );

  // cname
  map.set(
    `cname:${domain.return_path}.${domain.name}`,
    resolver.spoofPacket(
      `${domain.return_path}.${domain.name}`,
      'CNAME',
      [env.WEB_HOST],
      true
    )
  );

  // cname -> txt
  map.set(
    `txt:${domain.return_path}.${domain.name}`,
    resolver.spoofPacket(
      `${domain.return_path}.${domain.name}`,
      'TXT',
      [`v=spf1 ip4:${IP_ADDRESS} -all`],
      true,
      ms('5m')
    )
  );

  // dmarc
  map.set(
    `txt:_dmarc.${domain.name}`,
    resolver.spoofPacket(
      `_dmarc.${domain.name}`,
      'TXT',
      [
        `v=DMARC1; p=reject; pct=100; rua=mailto:dmarc-${domain.id}@forwardemail.net;`
      ],
      true
    )
  );

  // store spoofed dns cache
  await resolver.options.cache.mset(map);

  t.context.authHeaders = {
    Authorization: `Basic ${Buffer.from(
      `${alias.name}@${domain.name}:${t.context.pass}`
    ).toString('base64')}`
  };
});

test.afterEach.always(async (t) => {
  await t.context.permit.release();
});

// Test RFC 6352 compliance - OPTIONS request
test('should respond to OPTIONS request with correct headers', async (t) => {
  try {
    const response = await axios.options(t.context.serverUrl);

    // Verify DAV header includes addressbook
    t.true(response.headers.dav.includes('addressbook'));

    // Verify Allow header includes all required methods
    const allowedMethods = response.headers.allow.split(', ');
    t.true(allowedMethods.includes('OPTIONS'));
    t.true(allowedMethods.includes('GET'));
    t.true(allowedMethods.includes('PUT'));
    t.true(allowedMethods.includes('DELETE'));
    t.true(allowedMethods.includes('PROPFIND'));
    t.true(allowedMethods.includes('PROPPATCH'));
    t.true(allowedMethods.includes('REPORT'));
    t.true(allowedMethods.includes('MKCOL'));
  } catch (err) {
    t.fail(`OPTIONS request failed: ${err.message}`);
  }
});

// TODO: should respond with <A:multistatus> and <A:sync-token>
test('iOS REPORT', async (t) => {
  // REPORT /dav/user@user.com/addressbooks/default
  const response = await axios({
    method: 'REPORT',
    url: `${t.context.serverUrl}/dav/${t.context.username}/addressbooks/default`,
    headers: {
      'Content-Type': 'application/xml',
      Depth: '0',
      ...t.context.authHeaders
    },
    data: '<?xml version="1.0" encoding="UTF-8"?>\n<A:sync-collection xmlns:A="DAV:">\n  <A:sync-token>https://forwardemail.net/ns/sync-token/1</A:sync-token>\n  <A:sync-level>1</A:sync-level>\n  <A:prop>\n    <A:getetag/>\n  </A:prop>\n</A:sync-collection>'
  });

  // <?xml version="1.0" encoding="UTF-8"?>
  // <d:multistatus xmlns:d="DAV:" xmlns:card="urn:ietf:params:xml:ns:carddav">
  //   <d:sync-token>http://example.com:3000/ns/sync-token/1</d:sync-token>
  // </d:multistatus>

  // Verify response status
  t.is(response.status, 207);

  // Verify response contains required properties
  // TODO: xmlns:A="DAV:"
  t.true(response.data.includes('<d:multistatus xmlns:d="DAV:"'));
  t.true(response.data.includes('<d:sync-token>'));
});

// Test RFC 6352 compliance - PROPFIND on principal
test.serial(
  'should respond to PROPFIND on principal with correct properties',
  async (t) => {
    // Mock the XML response for principal
    sinon.stub(xmlHelpers, 'getMultistatusXML')
      .returns(`<?xml version="1.0" encoding="UTF-8"?>
<d:multistatus xmlns:d="DAV:" xmlns:card="urn:ietf:params:xml:ns:carddav" xmlns:cs="http://calendarserver.org/ns/">
  <d:response>
    <d:href>/dav/${t.context.username}</d:href>
    <d:propstat>
      <d:prop>
        <d:displayname>${t.context.username}</d:displayname>
        <d:resourcetype><d:collection/><d:principal/></d:resourcetype>
        <d:current-user-principal><d:href>/dav/${t.context.username}</d:href></d:current-user-principal>
        <card:addressbook-home-set><d:href>/dav/${t.context.username}/addressbooks</d:href></card:addressbook-home-set>
      </d:prop>
      <d:status>HTTP/1.1 200 OK</d:status>
    </d:propstat>
  </d:response>
</d:multistatus>`);

    const response = await axios({
      method: 'PROPFIND',
      // TODO: remove this url: `${t.context.serverUrl}/`,
      url: `${t.context.serverUrl}/dav/${t.context.username}`,
      headers: {
        'Content-Type': 'application/xml',
        Depth: '0',
        ...t.context.authHeaders
      },
      data: `<?xml version="1.0" encoding="UTF-8"?>
<d:propfind xmlns:d="DAV:" xmlns:card="urn:ietf:params:xml:ns:carddav">
  <d:prop>
    <d:displayname/>
    <d:resourcetype/>
    <d:current-user-principal/>
    <card:addressbook-home-set/>
  </d:prop>
</d:propfind>`
    });

    // Verify response status
    t.is(response.status, 207);

    // Verify response contains required properties
    t.true(response.data.includes('<d:displayname>'));
    t.true(response.data.includes('<d:resourcetype>'));
    t.true(response.data.includes('<d:principal/>'));
    t.true(response.data.includes('<card:addressbook-home-set>'));
    t.true(response.data.includes(`/dav/${t.context.username}/addressbooks`));

    // Restore the stub
    xmlHelpers.getMultistatusXML.restore();
  }
);

// Test RFC 6352 compliance - MKCOL for creating address books
test.serial('should respond to MKCOL for creating address books', async (t) => {
  // Mock the AddressBooks.findOne method
  sinon.stub(AddressBooks, 'findOne').resolves(null);

  // Mock the AddressBooks.create method
  sinon.stub(AddressBooks, 'create').resolves([
    {
      address_book_id: 'new-address-book',
      name: 'New Address Book',
      description: 'New Description',
      color: '#00FF00',
      synctoken: `${config.urls.web}/ns/sync-token/1`
    }
  ]);

  const response = await axios({
    method: 'MKCOL',
    url: `${t.context.serverUrl}/dav/${t.context.username}/addressbooks/new-address-book`,
    headers: {
      'Content-Type': 'application/xml',
      ...t.context.authHeaders
    },
    data: `<?xml version="1.0" encoding="UTF-8"?>
<d:mkcol xmlns:d="DAV:" xmlns:card="urn:ietf:params:xml:ns:carddav">
  <d:set>
    <d:prop>
      <d:resourcetype>
        <d:collection/>
        <card:addressbook/>
      </d:resourcetype>
      <d:displayname>New Address Book</d:displayname>
    </d:prop>
  </d:set>
</d:mkcol>`
  });

  // Verify response status
  t.is(response.status, 201);

  // Restore the stubs
  AddressBooks.findOne.restore();
  AddressBooks.create.restore();
});

// Test RFC 6352 compliance - Error handling for invalid requests
test.serial(
  'should handle invalid requests with appropriate error responses',
  async (t) => {
    // Test case 1: Non-existent address book
    try {
      // Mock the AddressBooks.findOne method to return null
      sinon.stub(AddressBooks, 'findOne').resolves(null);

      await axios({
        method: 'PROPFIND',
        url: `${t.context.serverUrl}/dav/${t.context.username}/addressbooks/nonexistent`,
        headers: {
          'Content-Type': 'application/xml',
          Depth: '0',
          ...t.context.authHeaders
        },
        data: `<?xml version="1.0" encoding="UTF-8"?>
<d:propfind xmlns:d="DAV:">
  <d:prop>
    <d:displayname/>
  </d:prop>
</d:propfind>`
      });

      t.fail('Request to non-existent address book should fail');
    } catch (err) {
      t.is(err.response.status, 404);
      AddressBooks.findOne.restore();
    }

    // Test case 2: Unauthorized access
    try {
      await axios({
        method: 'PROPFIND',
        url: `${t.context.serverUrl}/dav/${t.context.username}/addressbooks/test-address-book`,
        headers: {
          'Content-Type': 'application/xml',
          Depth: '0',
          Authorization: `Basic ${Buffer.from(
            'invalid@example.com:wrongpassword'
          ).toString('base64')}`
        },
        data: `<?xml version="1.0" encoding="UTF-8"?>
<d:propfind xmlns:d="DAV:">
  <d:prop>
    <d:displayname/>
  </d:prop>
</d:propfind>`
      });

      t.fail('Request with invalid credentials should fail');
    } catch (err) {
      t.is(err.response.status, 401);
    }
  }
);
