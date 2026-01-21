/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

/**
 * Tests for CardDAV sync issues reported by users:
 * - Changes made in Thunderbird not being pushed to other clients
 * - Duplicate contacts appearing on iPhone but not in Thunderbird
 *
 * These tests specifically target the sync-collection REPORT and
 * ETag handling to ensure proper synchronization between clients.
 */

const Redis = require('ioredis-mock');
const dayjs = require('dayjs-with-plugins');
const ip = require('ip');
const ms = require('ms');
const pWaitFor = require('p-wait-for');
const test = require('ava');
const tsdav = require('tsdav');
const { Semaphore } = require('@shopify/semaphore');

const utils = require('../utils');
const CardDAV = require('../../carddav-server');
const SQLite = require('../../sqlite-server');

const Users = require('#models/users');
const carddavConfig = require('#config/carddav');
const config = require('#config');
const createTangerine = require('#helpers/create-tangerine');
const createWebSocketAsPromised = require('#helpers/create-websocket-as-promised');
const env = require('#config/env');
const logger = require('#helpers/logger');

// dynamically import get-port
let getPort;
import('get-port').then((obj) => {
  getPort = obj.default;
});

const semaphore = new Semaphore(2);

const {
  getBasicAuthHeaders,
  createAccount,
  fetchAddressBooks,
  fetchVCards,
  createVCard,
  updateVCard,
  deleteVCard
} = tsdav;

const IP_ADDRESS = ip.address();

// Sample vCard for testing
const SAMPLE_VCARD = `BEGIN:VCARD
VERSION:3.0
FN:John Doe
N:Doe;John;;;
EMAIL;TYPE=INTERNET:john.doe@example.com
TEL;TYPE=CELL:+1234567890
UID:123e4567-e89b-12d3-a456-426614174000
END:VCARD`;

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
  t.context.sqlite = sqlite;

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
  t.context.cardDAV = cardDAV;

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

  t.context.authHeaders = getBasicAuthHeaders({
    username: `${alias.name}@${domain.name}`,
    password: t.context.pass
  });

  t.context.account = await createAccount({
    account: {
      serverUrl: t.context.serverUrl,
      accountType: 'carddav'
    },
    headers: t.context.authHeaders
  });

  t.context.addressBooks = await fetchAddressBooks({
    account: t.context.account,
    headers: t.context.authHeaders
  });
});

test.afterEach.always(async (t) => {
  await t.context.permit.release();

  // close CardDAV server
  if (t.context.cardDAV) {
    try {
      await t.context.cardDAV.close();
    } catch {
      // ignore errors during cleanup
    }
  }

  // close WebSocket connection
  if (t.context.wsp) {
    try {
      await t.context.wsp.close();
    } catch {
      // ignore errors during cleanup
    }
  }

  // close SQLite server
  if (t.context.sqlite) {
    try {
      await t.context.sqlite.close();
    } catch {
      // ignore errors during cleanup
    }
  }

  // disconnect Redis clients
  if (t.context.client) {
    try {
      t.context.client.disconnect();
    } catch {
      // ignore errors during cleanup
    }
  }

  if (t.context.subscriber) {
    try {
      t.context.subscriber.disconnect();
    } catch {
      // ignore errors during cleanup
    }
  }
});

/**
 * Test: ETag should be properly quoted per RFC 7232
 *
 * ETags must be quoted strings. If the server returns unquoted ETags,
 * clients like Thunderbird may fail to match them correctly during
 * If-Match comparisons, causing sync failures.
 */
test('ETag should be properly quoted in responses', async (t) => {
  const addressBooks = await fetchAddressBooks({
    account: t.context.account,
    headers: t.context.authHeaders
  });

  // Create a contact
  const createResponse = await createVCard({
    addressBook: addressBooks[0],
    filename: 'etag-test.vcf',
    vCardString: SAMPLE_VCARD,
    headers: t.context.authHeaders
  });

  t.is(createResponse.status, 201);

  // Fetch the contact to check ETag format
  const contacts = await fetchVCards({
    addressBook: addressBooks[0],
    headers: t.context.authHeaders
  });

  const contact = contacts.find((c) => c.url.includes('etag-test.vcf'));
  t.truthy(contact, 'Contact should exist');
  t.truthy(contact.etag, 'Contact should have an ETag');

  // ETag should be quoted per RFC 7232
  t.true(
    contact.etag.startsWith('"') && contact.etag.endsWith('"'),
    `ETag should be quoted, got: ${contact.etag}`
  );

  // Clean up
  await deleteVCard({
    vCard: { url: contact.url },
    headers: t.context.authHeaders
  });
});

/**
 * Test: If-Match header comparison should handle quoted ETags correctly
 *
 * When a client sends an If-Match header with a quoted ETag, the server
 * should correctly compare it with the stored ETag (which is also quoted).
 * This is critical for preventing sync conflicts.
 */
test('If-Match header should work with quoted ETags', async (t) => {
  const axios = require('axios');
  const addressBooks = await fetchAddressBooks({
    account: t.context.account,
    headers: t.context.authHeaders
  });

  // Create a contact
  const contactUrl = new URL('if-match-test.vcf', addressBooks[0].url).href;
  const createResponse = await createVCard({
    addressBook: addressBooks[0],
    filename: 'if-match-test.vcf',
    vCardString: SAMPLE_VCARD,
    headers: t.context.authHeaders
  });

  t.is(createResponse.status, 201);

  // Fetch the contact to get its ETag
  const contacts = await fetchVCards({
    addressBook: addressBooks[0],
    headers: t.context.authHeaders
  });

  const contact = contacts.find((c) => c.url.includes('if-match-test.vcf'));
  t.truthy(contact, 'Contact should exist');
  t.truthy(contact.etag, 'Contact should have an ETag');

  // Update with correct If-Match header (should succeed)
  const updatedVCard = SAMPLE_VCARD.replace('John Doe', 'Jane Doe');
  const updateResponse = await axios({
    method: 'PUT',
    url: contactUrl,
    headers: {
      'Content-Type': 'text/vcard; charset=utf-8',
      'If-Match': contact.etag,
      ...t.context.authHeaders
    },
    data: updatedVCard,
    validateStatus: () => true
  });

  t.is(
    updateResponse.status,
    204,
    'Update with correct If-Match should succeed'
  );

  // Try to update with wrong If-Match header (should fail with 412)
  const wrongEtag = '"wrong-etag-value"';
  const failedUpdateResponse = await axios({
    method: 'PUT',
    url: contactUrl,
    headers: {
      'Content-Type': 'text/vcard; charset=utf-8',
      'If-Match': wrongEtag,
      ...t.context.authHeaders
    },
    data: updatedVCard.replace('Jane Doe', 'John Smith'),
    validateStatus: () => true
  });

  t.is(
    failedUpdateResponse.status,
    412,
    'Update with wrong If-Match should fail with 412 Precondition Failed'
  );

  // Clean up
  await deleteVCard({
    vCard: { url: contactUrl },
    headers: t.context.authHeaders
  });
});

/**
 * Test: Sync token should properly track contact updates
 *
 * When a contact is updated, the sync-collection REPORT should return
 * the updated contact when using the old sync token. This ensures that
 * changes made on one client (e.g., Thunderbird) are visible to other
 * clients (e.g., iPhone).
 */
test('sync-collection should detect contact updates', async (t) => {
  const axios = require('axios');
  const addressBooks = await fetchAddressBooks({
    account: t.context.account,
    headers: t.context.authHeaders
  });

  const addressBook = addressBooks[0];

  // Create a contact
  const contactUrl = new URL('sync-update-test.vcf', addressBook.url).href;
  await createVCard({
    addressBook,
    filename: 'sync-update-test.vcf',
    vCardString: SAMPLE_VCARD,
    headers: t.context.authHeaders
  });

  // Get sync token after creation
  const propfindResponse = await axios({
    method: 'PROPFIND',
    url: addressBook.url,
    headers: {
      'Content-Type': 'application/xml',
      Depth: '0',
      ...t.context.authHeaders
    },
    data: `<?xml version="1.0" encoding="UTF-8"?>
<d:propfind xmlns:d="DAV:">
  <d:prop>
    <d:sync-token/>
  </d:prop>
</d:propfind>`
  });

  const syncTokenMatch = propfindResponse.data.match(
    /<d:sync-token>([^<]+)<\/d:sync-token>/
  );
  const syncTokenAfterCreate = syncTokenMatch ? syncTokenMatch[1] : null;
  t.truthy(syncTokenAfterCreate, 'Should have sync token after creation');

  // Wait a bit to ensure timestamp difference
  await new Promise((resolve) => {
    setTimeout(resolve, 100);
  });

  // Update the contact
  const updatedVCard = SAMPLE_VCARD.replace('John Doe', 'Updated Name').replace(
    'john.doe@example.com',
    'updated@example.com'
  );

  await updateVCard({
    vCard: {
      url: contactUrl,
      data: updatedVCard
    },
    headers: t.context.authHeaders
  });

  // Perform sync-collection with the old token
  const syncResponse = await axios({
    method: 'REPORT',
    url: addressBook.url,
    headers: {
      'Content-Type': 'application/xml',
      Depth: '1',
      ...t.context.authHeaders
    },
    data: `<?xml version="1.0" encoding="UTF-8"?>
<d:sync-collection xmlns:d="DAV:" xmlns:card="urn:ietf:params:xml:ns:carddav">
  <d:sync-token>${syncTokenAfterCreate}</d:sync-token>
  <d:sync-level>1</d:sync-level>
  <d:prop>
    <d:getetag/>
    <card:address-data/>
  </d:prop>
</d:sync-collection>`
  });

  t.is(syncResponse.status, 207);

  // The updated contact should be in the sync response
  t.true(
    syncResponse.data.includes('sync-update-test.vcf'),
    'Updated contact should be in sync response'
  );
  t.true(
    syncResponse.data.includes('Updated Name'),
    'Updated name should be in sync response'
  );

  // Clean up
  await deleteVCard({
    vCard: { url: contactUrl },
    headers: t.context.authHeaders
  });
});

/**
 * Test: Contact ID normalization should prevent duplicates
 *
 * When a client requests a contact with or without the .vcf extension,
 * the server should treat them as the same contact. This prevents
 * duplicate contacts from appearing when different clients use different
 * URL formats.
 */
test('contact ID should be normalized regardless of .vcf extension', async (t) => {
  const axios = require('axios');
  const addressBooks = await fetchAddressBooks({
    account: t.context.account,
    headers: t.context.authHeaders
  });

  const addressBook = addressBooks[0];

  // Create a contact without .vcf extension in the URL
  const contactIdWithoutExt = 'normalize-test';
  const contactUrlWithExt = new URL(
    `${contactIdWithoutExt}.vcf`,
    addressBook.url
  ).href;
  const contactUrlWithoutExt = new URL(contactIdWithoutExt, addressBook.url)
    .href;

  // Create using URL with .vcf
  const createResponse = await axios({
    method: 'PUT',
    url: contactUrlWithExt,
    headers: {
      'Content-Type': 'text/vcard; charset=utf-8',
      ...t.context.authHeaders
    },
    data: SAMPLE_VCARD,
    validateStatus: () => true
  });

  t.is(createResponse.status, 201, 'Should create contact with .vcf extension');

  // Try to fetch using URL without .vcf - should get the same contact
  const getWithoutExt = await axios({
    method: 'GET',
    url: contactUrlWithoutExt,
    headers: t.context.authHeaders,
    validateStatus: () => true
  });

  t.is(
    getWithoutExt.status,
    200,
    'Should be able to fetch contact without .vcf extension'
  );
  t.true(
    getWithoutExt.data.includes('John Doe'),
    'Should return the same contact'
  );

  // Try to create again using URL without .vcf with If-None-Match: *
  // This should fail because the contact already exists
  const duplicateCreate = await axios({
    method: 'PUT',
    url: contactUrlWithoutExt,
    headers: {
      'Content-Type': 'text/vcard; charset=utf-8',
      'If-None-Match': '*',
      ...t.context.authHeaders
    },
    data: SAMPLE_VCARD,
    validateStatus: () => true
  });

  t.is(
    duplicateCreate.status,
    412,
    'Should reject duplicate creation with If-None-Match: *'
  );

  // Clean up
  await deleteVCard({
    vCard: { url: contactUrlWithExt },
    headers: t.context.authHeaders
  });
});

/**
 * Test: Multiple rapid updates should all be tracked by sync-collection
 *
 * When a client makes multiple rapid updates to contacts, all changes
 * should be tracked and returned by sync-collection. This simulates
 * the scenario where a user edits multiple contacts quickly in Thunderbird.
 */
test('sync-collection should track multiple rapid updates', async (t) => {
  const axios = require('axios');
  const addressBooks = await fetchAddressBooks({
    account: t.context.account,
    headers: t.context.authHeaders
  });

  const addressBook = addressBooks[0];

  // Create multiple contacts
  const contacts = [];
  for (let i = 1; i <= 3; i++) {
    const vcard = SAMPLE_VCARD.replace('John Doe', `Contact ${i}`).replace(
      '123e4567-e89b-12d3-a456-426614174000',
      `123e4567-e89b-12d3-a456-42661417400${i}`
    );
    const url = new URL(`rapid-update-${i}.vcf`, addressBook.url).href;

    await createVCard({
      addressBook,
      filename: `rapid-update-${i}.vcf`,
      vCardString: vcard,
      headers: t.context.authHeaders
    });

    contacts.push({ url, originalName: `Contact ${i}` });
  }

  // Get sync token after all creations
  const propfindResponse = await axios({
    method: 'PROPFIND',
    url: addressBook.url,
    headers: {
      'Content-Type': 'application/xml',
      Depth: '0',
      ...t.context.authHeaders
    },
    data: `<?xml version="1.0" encoding="UTF-8"?>
<d:propfind xmlns:d="DAV:">
  <d:prop>
    <d:sync-token/>
  </d:prop>
</d:propfind>`
  });

  const syncTokenMatch = propfindResponse.data.match(
    /<d:sync-token>([^<]+)<\/d:sync-token>/
  );
  const syncTokenBeforeUpdates = syncTokenMatch ? syncTokenMatch[1] : null;
  t.truthy(syncTokenBeforeUpdates, 'Should have sync token');

  // Wait a bit
  await new Promise((resolve) => {
    setTimeout(resolve, 100);
  });

  // Update all contacts rapidly
  for (const [i, contact] of contacts.entries()) {
    const updatedVCard = SAMPLE_VCARD.replace(
      'John Doe',
      `Updated Contact ${i + 1}`
    ).replace(
      '123e4567-e89b-12d3-a456-426614174000',
      `123e4567-e89b-12d3-a456-42661417400${i + 1}`
    );

    await updateVCard({
      vCard: {
        url: contact.url,
        data: updatedVCard
      },
      headers: t.context.authHeaders
    });
  }

  // Perform sync-collection with the old token
  const syncResponse = await axios({
    method: 'REPORT',
    url: addressBook.url,
    headers: {
      'Content-Type': 'application/xml',
      Depth: '1',
      ...t.context.authHeaders
    },
    data: `<?xml version="1.0" encoding="UTF-8"?>
<d:sync-collection xmlns:d="DAV:" xmlns:card="urn:ietf:params:xml:ns:carddav">
  <d:sync-token>${syncTokenBeforeUpdates}</d:sync-token>
  <d:sync-level>1</d:sync-level>
  <d:prop>
    <d:getetag/>
    <card:address-data/>
  </d:prop>
</d:sync-collection>`
  });

  t.is(syncResponse.status, 207);

  // All updated contacts should be in the sync response
  for (let i = 1; i <= 3; i++) {
    t.true(
      syncResponse.data.includes(`rapid-update-${i}.vcf`),
      `Contact ${i} should be in sync response`
    );
    t.true(
      syncResponse.data.includes(`Updated Contact ${i}`),
      `Updated name for contact ${i} should be in sync response`
    );
  }

  // Clean up
  for (const contact of contacts) {
    await deleteVCard({
      vCard: { url: contact.url },
      headers: t.context.authHeaders
    });
  }
});

/**
 * Test: addressbook-multiget should handle mixed .vcf extension URLs
 *
 * When a client requests multiple contacts via addressbook-multiget,
 * some with .vcf extension and some without, the server should correctly
 * resolve all of them to the same contacts.
 */
test('addressbook-multiget should handle mixed URL formats', async (t) => {
  const axios = require('axios');
  const addressBooks = await fetchAddressBooks({
    account: t.context.account,
    headers: t.context.authHeaders
  });

  const addressBook = addressBooks[0];

  // Create two contacts
  const contact1Url = new URL('multiget-test-1.vcf', addressBook.url).href;
  const contact2Url = new URL('multiget-test-2.vcf', addressBook.url).href;

  await createVCard({
    addressBook,
    filename: 'multiget-test-1.vcf',
    vCardString: SAMPLE_VCARD.replace('John Doe', 'Contact One'),
    headers: t.context.authHeaders
  });

  await createVCard({
    addressBook,
    filename: 'multiget-test-2.vcf',
    vCardString: SAMPLE_VCARD.replace('John Doe', 'Contact Two').replace(
      '123e4567-e89b-12d3-a456-426614174000',
      '123e4567-e89b-12d3-a456-426614174001'
    ),
    headers: t.context.authHeaders
  });

  // Request both contacts via multiget, one with .vcf and one without
  const contact1Path = new URL(contact1Url).pathname;
  const contact2PathNoExt = new URL(contact2Url).pathname.replace('.vcf', '');

  const multigetResponse = await axios({
    method: 'REPORT',
    url: addressBook.url,
    headers: {
      'Content-Type': 'application/xml',
      Depth: '1',
      ...t.context.authHeaders
    },
    data: `<?xml version="1.0" encoding="UTF-8"?>
<card:addressbook-multiget xmlns:d="DAV:" xmlns:card="urn:ietf:params:xml:ns:carddav">
  <d:prop>
    <d:getetag/>
    <card:address-data/>
  </d:prop>
  <d:href>${contact1Path}</d:href>
  <d:href>${contact2PathNoExt}</d:href>
</card:addressbook-multiget>`
  });

  t.is(multigetResponse.status, 207);

  // Both contacts should be returned
  t.true(
    multigetResponse.data.includes('Contact One'),
    'Contact One should be in response'
  );
  t.true(
    multigetResponse.data.includes('Contact Two'),
    'Contact Two should be in response'
  );

  // Clean up
  await deleteVCard({
    vCard: { url: contact1Url },
    headers: t.context.authHeaders
  });
  await deleteVCard({
    vCard: { url: contact2Url },
    headers: t.context.authHeaders
  });
});

/**
 * Test: Sync token should be correctly extracted from XML body
 *
 * The sync-collection REPORT receives the sync token in the XML body.
 * The server needs to correctly extract the token value, which may be
 * nested in the XML structure. This test verifies the token is correctly
 * parsed and used for filtering.
 */
test('sync token should be correctly extracted and used for filtering', async (t) => {
  const axios = require('axios');
  const addressBooks = await fetchAddressBooks({
    account: t.context.account,
    headers: t.context.authHeaders
  });

  const addressBook = addressBooks[0];

  // Create initial contact
  const contact1Url = new URL('token-test-1.vcf', addressBook.url).href;
  await createVCard({
    addressBook,
    filename: 'token-test-1.vcf',
    vCardString: SAMPLE_VCARD.replace('John Doe', 'Initial Contact'),
    headers: t.context.authHeaders
  });

  // Get initial sync token
  const propfindResponse = await axios({
    method: 'PROPFIND',
    url: addressBook.url,
    headers: {
      'Content-Type': 'application/xml',
      Depth: '0',
      ...t.context.authHeaders
    },
    data: `<?xml version="1.0" encoding="UTF-8"?>
<d:propfind xmlns:d="DAV:">
  <d:prop>
    <d:sync-token/>
  </d:prop>
</d:propfind>`
  });

  const syncTokenMatch = propfindResponse.data.match(
    /<d:sync-token>([^<]+)<\/d:sync-token>/
  );
  const initialSyncToken = syncTokenMatch ? syncTokenMatch[1] : null;
  t.truthy(initialSyncToken, 'Should have initial sync token');

  // Perform initial sync-collection with empty token to get all contacts
  const initialSyncResponse = await axios({
    method: 'REPORT',
    url: addressBook.url,
    headers: {
      'Content-Type': 'application/xml',
      Depth: '1',
      ...t.context.authHeaders
    },
    data: `<?xml version="1.0" encoding="UTF-8"?>
<d:sync-collection xmlns:d="DAV:" xmlns:card="urn:ietf:params:xml:ns:carddav">
  <d:sync-token/>
  <d:sync-level>1</d:sync-level>
  <d:prop>
    <d:getetag/>
    <card:address-data/>
  </d:prop>
</d:sync-collection>`
  });

  t.is(initialSyncResponse.status, 207);
  t.true(
    initialSyncResponse.data.includes('Initial Contact'),
    'Initial sync should include the contact'
  );

  // Extract the new sync token from the response
  const newSyncTokenMatch = initialSyncResponse.data.match(
    /<d:sync-token>([^<]+)<\/d:sync-token>/
  );
  const newSyncToken = newSyncTokenMatch ? newSyncTokenMatch[1] : null;
  t.truthy(newSyncToken, 'Response should include new sync token');

  // Wait a bit
  await new Promise((resolve) => {
    setTimeout(resolve, 100);
  });

  // Create a second contact
  const contact2Url = new URL('token-test-2.vcf', addressBook.url).href;
  await createVCard({
    addressBook,
    filename: 'token-test-2.vcf',
    vCardString: SAMPLE_VCARD.replace('John Doe', 'Second Contact').replace(
      '123e4567-e89b-12d3-a456-426614174000',
      '123e4567-e89b-12d3-a456-426614174999'
    ),
    headers: t.context.authHeaders
  });

  // Sync with the previous token - should only return the new contact
  const incrementalSyncResponse = await axios({
    method: 'REPORT',
    url: addressBook.url,
    headers: {
      'Content-Type': 'application/xml',
      Depth: '1',
      ...t.context.authHeaders
    },
    data: `<?xml version="1.0" encoding="UTF-8"?>
<d:sync-collection xmlns:d="DAV:" xmlns:card="urn:ietf:params:xml:ns:carddav">
  <d:sync-token>${newSyncToken}</d:sync-token>
  <d:sync-level>1</d:sync-level>
  <d:prop>
    <d:getetag/>
    <card:address-data/>
  </d:prop>
</d:sync-collection>`
  });

  t.is(incrementalSyncResponse.status, 207);

  // Should include the new contact
  t.true(
    incrementalSyncResponse.data.includes('Second Contact'),
    'Incremental sync should include the new contact'
  );

  // Should NOT include the old contact (it was created before the sync token)
  t.false(
    incrementalSyncResponse.data.includes('Initial Contact'),
    'Incremental sync should NOT include the old contact'
  );

  // Clean up
  await deleteVCard({
    vCard: { url: contact1Url },
    headers: t.context.authHeaders
  });
  await deleteVCard({
    vCard: { url: contact2Url },
    headers: t.context.authHeaders
  });
});

/**
 * Test: Empty sync token should return all contacts
 *
 * When a client sends an empty sync-token element, the server should
 * return all contacts (initial sync). This is how clients like iPhone
 * perform their first sync.
 */
test('empty sync token should return all contacts', async (t) => {
  const axios = require('axios');
  const addressBooks = await fetchAddressBooks({
    account: t.context.account,
    headers: t.context.authHeaders
  });

  const addressBook = addressBooks[0];

  // Create some contacts
  const contacts = [];
  for (let i = 1; i <= 3; i++) {
    const vcard = SAMPLE_VCARD.replace(
      'John Doe',
      `Empty Token Test ${i}`
    ).replace(
      '123e4567-e89b-12d3-a456-426614174000',
      `123e4567-e89b-12d3-a456-42661417400${i}`
    );
    const url = new URL(`empty-token-${i}.vcf`, addressBook.url).href;

    await createVCard({
      addressBook,
      filename: `empty-token-${i}.vcf`,
      vCardString: vcard,
      headers: t.context.authHeaders
    });

    contacts.push({ url, name: `Empty Token Test ${i}` });
  }

  // Sync with empty token
  const syncResponse = await axios({
    method: 'REPORT',
    url: addressBook.url,
    headers: {
      'Content-Type': 'application/xml',
      Depth: '1',
      ...t.context.authHeaders
    },
    data: `<?xml version="1.0" encoding="UTF-8"?>
<d:sync-collection xmlns:d="DAV:" xmlns:card="urn:ietf:params:xml:ns:carddav">
  <d:sync-token/>
  <d:sync-level>1</d:sync-level>
  <d:prop>
    <d:getetag/>
    <card:address-data/>
  </d:prop>
</d:sync-collection>`
  });

  t.is(syncResponse.status, 207);

  // All contacts should be returned
  for (const contact of contacts) {
    t.true(
      syncResponse.data.includes(contact.name),
      `Contact "${contact.name}" should be in response`
    );
  }

  // Clean up
  for (const contact of contacts) {
    await deleteVCard({
      vCard: { url: contact.url },
      headers: t.context.authHeaders
    });
  }
});

/**
 * Test: Sync token with text content should be correctly parsed
 *
 * The xml2js parser may return sync-token as an object with _ property
 * containing the text content, or as a plain string. The server should
 * handle both cases.
 */
test('sync token with different XML structures should work', async (t) => {
  const axios = require('axios');
  const addressBooks = await fetchAddressBooks({
    account: t.context.account,
    headers: t.context.authHeaders
  });

  const addressBook = addressBooks[0];

  // Create a contact
  await createVCard({
    addressBook,
    filename: 'xml-structure-test.vcf',
    vCardString: SAMPLE_VCARD.replace('John Doe', 'XML Structure Test'),
    headers: t.context.authHeaders
  });

  // Get sync token
  const propfindResponse = await axios({
    method: 'PROPFIND',
    url: addressBook.url,
    headers: {
      'Content-Type': 'application/xml',
      Depth: '0',
      ...t.context.authHeaders
    },
    data: `<?xml version="1.0" encoding="UTF-8"?>
<d:propfind xmlns:d="DAV:">
  <d:prop>
    <d:sync-token/>
  </d:prop>
</d:propfind>`
  });

  const syncTokenMatch = propfindResponse.data.match(
    /<d:sync-token>([^<]+)<\/d:sync-token>/
  );
  const syncToken = syncTokenMatch ? syncTokenMatch[1] : null;
  t.truthy(syncToken, 'Should have sync token');

  // Wait and create another contact
  await new Promise((resolve) => {
    setTimeout(resolve, 100);
  });

  await createVCard({
    addressBook,
    filename: 'xml-structure-test-2.vcf',
    vCardString: SAMPLE_VCARD.replace(
      'John Doe',
      'XML Structure Test 2'
    ).replace(
      '123e4567-e89b-12d3-a456-426614174000',
      '123e4567-e89b-12d3-a456-426614174999'
    ),
    headers: t.context.authHeaders
  });

  // Test with sync-token as self-closing element with text
  const syncResponse = await axios({
    method: 'REPORT',
    url: addressBook.url,
    headers: {
      'Content-Type': 'application/xml',
      Depth: '1',
      ...t.context.authHeaders
    },
    data: `<?xml version="1.0" encoding="UTF-8"?>
<d:sync-collection xmlns:d="DAV:" xmlns:card="urn:ietf:params:xml:ns:carddav">
  <d:sync-token>${syncToken}</d:sync-token>
  <d:sync-level>1</d:sync-level>
  <d:prop>
    <d:getetag/>
    <card:address-data/>
  </d:prop>
</d:sync-collection>`
  });

  t.is(syncResponse.status, 207);

  // Should only include the new contact
  t.true(
    syncResponse.data.includes('XML Structure Test 2'),
    'Should include new contact'
  );
  t.false(
    syncResponse.data.includes('XML Structure Test</'),
    'Should NOT include old contact (checking for exact match)'
  );

  // Clean up
  const contactsToDelete = await fetchVCards({
    addressBook,
    headers: t.context.authHeaders
  });

  for (const contact of contactsToDelete) {
    if (contact.url.includes('xml-structure-test')) {
      await deleteVCard({
        vCard: { url: contact.url },
        headers: t.context.authHeaders
      });
    }
  }
});

/**
 * Test: If-Match should work with both quoted and unquoted ETags
 *
 * Some clients send ETags with quotes, some without. The server should
 * normalize both for comparison to ensure updates work correctly.
 */
test('If-Match should work with unquoted ETags', async (t) => {
  const axios = require('axios');
  const addressBooks = await fetchAddressBooks({
    account: t.context.account,
    headers: t.context.authHeaders
  });

  const addressBook = addressBooks[0];

  // Create a contact with unique filename
  const uniqueId = Date.now();
  const filename = `unquoted-etag-test-${uniqueId}.vcf`;
  const contactUrl = new URL(filename, addressBook.url).href;
  await createVCard({
    addressBook,
    filename,
    vCardString: SAMPLE_VCARD.replace('John Doe', 'Unquoted ETag Test').replace(
      '123e4567-e89b-12d3-a456-426614174000',
      `123e4567-e89b-12d3-a456-${uniqueId}`
    ),
    headers: t.context.authHeaders
  });

  // Fetch the contact to get its ETag
  const contacts = await fetchVCards({
    addressBook,
    headers: t.context.authHeaders
  });

  const contact = contacts.find((c) => c.url.includes(filename));
  t.truthy(contact, 'Contact should exist');
  t.truthy(contact.etag, 'Contact should have an ETag');

  // The ETag should be quoted
  t.true(
    contact.etag.startsWith('"') && contact.etag.endsWith('"'),
    'ETag should be quoted'
  );

  // Try to update with unquoted If-Match header (should still succeed)
  const unquotedEtag = contact.etag.replace(/^"|"$/g, '');
  const updatedVCard = SAMPLE_VCARD.replace('John Doe', 'Updated Unquoted');

  const updateResponse = await axios({
    method: 'PUT',
    url: contactUrl,
    headers: {
      'Content-Type': 'text/vcard; charset=utf-8',
      'If-Match': unquotedEtag, // Send without quotes
      ...t.context.authHeaders
    },
    data: updatedVCard,
    validateStatus: () => true
  });

  t.is(
    updateResponse.status,
    204,
    'Update with unquoted If-Match should succeed'
  );

  // Clean up
  await deleteVCard({
    vCard: { url: contactUrl },
    headers: t.context.authHeaders
  });
});

/**
 * Test: getctag should be returned in PROPFIND response
 *
 * iOS and macOS clients use getctag to detect changes in the address book.
 * The server should return this property in PROPFIND responses.
 */
test('PROPFIND should return getctag property', async (t) => {
  const axios = require('axios');
  const addressBooks = await fetchAddressBooks({
    account: t.context.account,
    headers: t.context.authHeaders
  });

  const addressBook = addressBooks[0];

  // Perform PROPFIND on the address book
  const propfindResponse = await axios({
    method: 'PROPFIND',
    url: addressBook.url,
    headers: {
      'Content-Type': 'application/xml',
      Depth: '0',
      ...t.context.authHeaders
    },
    data: `<?xml version="1.0" encoding="UTF-8"?>
<d:propfind xmlns:d="DAV:" xmlns:cs="http://calendarserver.org/ns/">
  <d:prop>
    <d:sync-token/>
    <cs:getctag/>
  </d:prop>
</d:propfind>`
  });

  t.is(propfindResponse.status, 207);

  // Response should include getctag
  t.true(
    propfindResponse.data.includes('getctag') ||
      propfindResponse.data.includes('cs:getctag'),
    'Response should include getctag property'
  );

  // getctag should have a value (not empty)
  const getctagMatch = propfindResponse.data.match(
    /<cs:getctag>([^<]+)<\/cs:getctag>/
  );
  t.truthy(getctagMatch, 'getctag should have a value');
  t.truthy(getctagMatch[1], 'getctag value should not be empty');
});

/**
 * Test: Sync token should change after contact update
 *
 * When a contact is updated, the address book's sync token should change.
 * This ensures clients can detect that changes have occurred.
 */
test('sync token should change after contact update', async (t) => {
  const axios = require('axios');
  const addressBooks = await fetchAddressBooks({
    account: t.context.account,
    headers: t.context.authHeaders
  });

  const addressBook = addressBooks[0];

  // Get initial sync token
  const propfindResponse1 = await axios({
    method: 'PROPFIND',
    url: addressBook.url,
    headers: {
      'Content-Type': 'application/xml',
      Depth: '0',
      ...t.context.authHeaders
    },
    data: `<?xml version="1.0" encoding="UTF-8"?>
<d:propfind xmlns:d="DAV:">
  <d:prop>
    <d:sync-token/>
  </d:prop>
</d:propfind>`
  });

  const syncToken1Match = propfindResponse1.data.match(
    /<d:sync-token>([^<]+)<\/d:sync-token>/
  );
  const syncToken1 = syncToken1Match ? syncToken1Match[1] : null;
  t.truthy(syncToken1, 'Should have initial sync token');

  // Create a contact
  const contactUrl = new URL('sync-token-change-test.vcf', addressBook.url)
    .href;
  await createVCard({
    addressBook,
    filename: 'sync-token-change-test.vcf',
    vCardString: SAMPLE_VCARD.replace('John Doe', 'Sync Token Test'),
    headers: t.context.authHeaders
  });

  // Get sync token after creation
  const propfindResponse2 = await axios({
    method: 'PROPFIND',
    url: addressBook.url,
    headers: {
      'Content-Type': 'application/xml',
      Depth: '0',
      ...t.context.authHeaders
    },
    data: `<?xml version="1.0" encoding="UTF-8"?>
<d:propfind xmlns:d="DAV:">
  <d:prop>
    <d:sync-token/>
  </d:prop>
</d:propfind>`
  });

  const syncToken2Match = propfindResponse2.data.match(
    /<d:sync-token>([^<]+)<\/d:sync-token>/
  );
  const syncToken2 = syncToken2Match ? syncToken2Match[1] : null;
  t.truthy(syncToken2, 'Should have sync token after creation');
  t.not(
    syncToken1,
    syncToken2,
    'Sync token should change after contact creation'
  );

  // Wait a bit
  await new Promise((resolve) => {
    setTimeout(resolve, 10);
  });

  // Update the contact
  await updateVCard({
    vCard: {
      url: contactUrl,
      data: SAMPLE_VCARD.replace('John Doe', 'Updated Sync Token Test')
    },
    headers: t.context.authHeaders
  });

  // Get sync token after update
  const propfindResponse3 = await axios({
    method: 'PROPFIND',
    url: addressBook.url,
    headers: {
      'Content-Type': 'application/xml',
      Depth: '0',
      ...t.context.authHeaders
    },
    data: `<?xml version="1.0" encoding="UTF-8"?>
<d:propfind xmlns:d="DAV:">
  <d:prop>
    <d:sync-token/>
  </d:prop>
</d:propfind>`
  });

  const syncToken3Match = propfindResponse3.data.match(
    /<d:sync-token>([^<]+)<\/d:sync-token>/
  );
  const syncToken3 = syncToken3Match ? syncToken3Match[1] : null;
  t.truthy(syncToken3, 'Should have sync token after update');
  t.not(
    syncToken2,
    syncToken3,
    'Sync token should change after contact update'
  );

  // Clean up
  await deleteVCard({
    vCard: { url: contactUrl },
    headers: t.context.authHeaders
  });
});

/**
 * Test: sync-collection should report deleted contacts with 404 status (RFC 6578)
 *
 * Per RFC 6578 Section 3.5.2, when a resource is deleted, the server should
 * report it in sync-collection with a 404 Not Found status (not in propstat).
 * This ensures clients can properly remove deleted contacts from their cache.
 */
test('sync-collection should report deleted contacts with 404 status (RFC 6578)', async (t) => {
  const axios = require('axios');
  const addressBooks = await fetchAddressBooks({
    account: t.context.account,
    headers: t.context.authHeaders
  });

  const addressBook = addressBooks[0];

  // Get initial sync token
  const propfindResponse = await axios({
    method: 'PROPFIND',
    url: addressBook.url,
    headers: {
      'Content-Type': 'application/xml',
      Depth: '0',
      ...t.context.authHeaders
    },
    data: `<?xml version="1.0" encoding="UTF-8"?>
<d:propfind xmlns:d="DAV:">
  <d:prop>
    <d:sync-token/>
  </d:prop>
</d:propfind>`
  });

  const syncTokenMatch = propfindResponse.data.match(
    /<d:sync-token>([^<]+)<\/d:sync-token>/
  );
  const initialSyncToken = syncTokenMatch ? syncTokenMatch[1] : null;
  t.truthy(initialSyncToken, 'Should have initial sync token');

  // Create a contact
  const contactUrl = new URL('delete-test-rfc6578.vcf', addressBook.url).href;
  const createResponse = await createVCard({
    addressBook,
    filename: 'delete-test-rfc6578.vcf',
    vCardString: SAMPLE_VCARD.replace(
      '123e4567-e89b-12d3-a456-426614174000',
      'delete-test-rfc6578-uid'
    ),
    headers: t.context.authHeaders
  });

  t.is(createResponse.status, 201, 'Should create contact');

  // Wait a bit to ensure timestamp difference
  await new Promise((resolve) => {
    setTimeout(resolve, 50);
  });

  // Get sync token after create
  const propfindResponse2 = await axios({
    method: 'PROPFIND',
    url: addressBook.url,
    headers: {
      'Content-Type': 'application/xml',
      Depth: '0',
      ...t.context.authHeaders
    },
    data: `<?xml version="1.0" encoding="UTF-8"?>
<d:propfind xmlns:d="DAV:">
  <d:prop>
    <d:sync-token/>
  </d:prop>
</d:propfind>`
  });

  const syncToken2Match = propfindResponse2.data.match(
    /<d:sync-token>([^<]+)<\/d:sync-token>/
  );
  const syncTokenAfterCreate = syncToken2Match ? syncToken2Match[1] : null;
  t.truthy(syncTokenAfterCreate, 'Should have sync token after create');

  // Delete the contact
  const deleteResponse = await deleteVCard({
    vCard: { url: contactUrl },
    headers: t.context.authHeaders
  });

  t.true(
    deleteResponse.status >= 200 && deleteResponse.status < 300,
    'Should delete contact'
  );

  // Wait a bit to ensure timestamp difference
  await new Promise((resolve) => {
    setTimeout(resolve, 50);
  });

  // Do sync-collection with the token from after create
  // This should report the deleted contact
  const syncResponse = await axios({
    method: 'REPORT',
    url: addressBook.url,
    headers: {
      'Content-Type': 'application/xml',
      ...t.context.authHeaders
    },
    data: `<?xml version="1.0" encoding="UTF-8"?>
<d:sync-collection xmlns:d="DAV:" xmlns:card="urn:ietf:params:xml:ns:carddav">
  <d:sync-token>${syncTokenAfterCreate}</d:sync-token>
  <d:sync-level>1</d:sync-level>
  <d:prop>
    <d:getetag/>
    <card:address-data/>
  </d:prop>
</d:sync-collection>`
  });

  t.is(syncResponse.status, 207, 'Should return 207 Multi-Status');

  // Check that the response contains a 404 status for the deleted contact
  // Per RFC 6578 Section 3.5.2, deleted resources should have:
  // <d:response>
  //   <d:href>...</d:href>
  //   <d:status>HTTP/1.1 404 Not Found</d:status>
  // </d:response>
  // NOT a propstat element
  t.true(
    syncResponse.data.includes('delete-test-rfc6578'),
    'Should include deleted contact in sync response'
  );
  t.true(
    syncResponse.data.includes('404') &&
      syncResponse.data.includes('Not Found'),
    'Should report deleted contact with 404 status'
  );

  // Verify GET request for deleted contact returns 404
  const getResponse = await axios({
    method: 'GET',
    url: contactUrl,
    headers: t.context.authHeaders,
    validateStatus: () => true
  });

  t.is(getResponse.status, 404, 'GET for deleted contact should return 404');
});

/**
 * Test: Initial sync-collection should not include deleted contacts (RFC 6578)
 *
 * Per RFC 6578 Section 3.4, when doing an initial sync (empty sync token),
 * the server MUST NOT return any removed member URLs. Only active contacts
 * should be returned.
 */
test('initial sync-collection should not include deleted contacts (RFC 6578 Section 3.4)', async (t) => {
  const axios = require('axios');
  const addressBooks = await fetchAddressBooks({
    account: t.context.account,
    headers: t.context.authHeaders
  });

  const addressBook = addressBooks[0];

  // Create a contact
  const contactUrl = new URL('initial-sync-test.vcf', addressBook.url).href;
  await createVCard({
    addressBook,
    filename: 'initial-sync-test.vcf',
    vCardString: SAMPLE_VCARD.replace(
      '123e4567-e89b-12d3-a456-426614174000',
      'initial-sync-test-uid'
    ),
    headers: t.context.authHeaders
  });

  // Delete the contact
  await deleteVCard({
    vCard: { url: contactUrl },
    headers: t.context.authHeaders
  });

  // Wait a bit
  await new Promise((resolve) => {
    setTimeout(resolve, 50);
  });

  // Do initial sync-collection (empty sync token)
  const syncResponse = await axios({
    method: 'REPORT',
    url: addressBook.url,
    headers: {
      'Content-Type': 'application/xml',
      ...t.context.authHeaders
    },
    data: `<?xml version="1.0" encoding="UTF-8"?>
<d:sync-collection xmlns:d="DAV:" xmlns:card="urn:ietf:params:xml:ns:carddav">
  <d:sync-token/>
  <d:sync-level>1</d:sync-level>
  <d:prop>
    <d:getetag/>
    <card:address-data/>
  </d:prop>
</d:sync-collection>`
  });

  t.is(syncResponse.status, 207, 'Should return 207 Multi-Status');

  // The deleted contact should NOT be in the initial sync response
  t.false(
    syncResponse.data.includes('initial-sync-test'),
    'Initial sync should NOT include deleted contacts per RFC 6578 Section 3.4'
  );
});

/**
 * Test: sync-collection should report updated contacts (e.g., photo changes)
 *
 * When a contact is updated (including photo changes), the sync-collection
 * should report it so other clients can fetch the updated data.
 */
test('sync-collection should report updated contacts', async (t) => {
  const axios = require('axios');
  const addressBooks = await fetchAddressBooks({
    account: t.context.account,
    headers: t.context.authHeaders
  });

  const addressBook = addressBooks[0];

  // Create a contact
  const contactUrl = new URL('update-sync-test.vcf', addressBook.url).href;
  await createVCard({
    addressBook,
    filename: 'update-sync-test.vcf',
    vCardString: SAMPLE_VCARD.replace(
      '123e4567-e89b-12d3-a456-426614174000',
      'update-sync-test-uid'
    ),
    headers: t.context.authHeaders
  });

  // Wait a bit
  await new Promise((resolve) => {
    setTimeout(resolve, 50);
  });

  // Get sync token after create
  const propfindResponse = await axios({
    method: 'PROPFIND',
    url: addressBook.url,
    headers: {
      'Content-Type': 'application/xml',
      Depth: '0',
      ...t.context.authHeaders
    },
    data: `<?xml version="1.0" encoding="UTF-8"?>
<d:propfind xmlns:d="DAV:">
  <d:prop>
    <d:sync-token/>
  </d:prop>
</d:propfind>`
  });

  const syncTokenMatch = propfindResponse.data.match(
    /<d:sync-token>([^<]+)<\/d:sync-token>/
  );
  const syncTokenAfterCreate = syncTokenMatch ? syncTokenMatch[1] : null;
  t.truthy(syncTokenAfterCreate, 'Should have sync token after create');

  // Wait a bit
  await new Promise((resolve) => {
    setTimeout(resolve, 50);
  });

  // Update the contact (simulate adding a photo or changing data)
  const updatedVCard = SAMPLE_VCARD.replace(
    '123e4567-e89b-12d3-a456-426614174000',
    'update-sync-test-uid'
  )
    .replace('John Doe', 'John Doe Updated')
    .replace('END:VCARD', 'NOTE:Updated with photo\nEND:VCARD');

  await updateVCard({
    vCard: {
      url: contactUrl,
      data: updatedVCard
    },
    headers: t.context.authHeaders
  });

  // Wait a bit
  await new Promise((resolve) => {
    setTimeout(resolve, 50);
  });

  // Do sync-collection with the token from after create
  const syncResponse = await axios({
    method: 'REPORT',
    url: addressBook.url,
    headers: {
      'Content-Type': 'application/xml',
      ...t.context.authHeaders
    },
    data: `<?xml version="1.0" encoding="UTF-8"?>
<d:sync-collection xmlns:d="DAV:" xmlns:card="urn:ietf:params:xml:ns:carddav">
  <d:sync-token>${syncTokenAfterCreate}</d:sync-token>
  <d:sync-level>1</d:sync-level>
  <d:prop>
    <d:getetag/>
    <card:address-data/>
  </d:prop>
</d:sync-collection>`
  });

  t.is(syncResponse.status, 207, 'Should return 207 Multi-Status');

  // The updated contact should be in the sync response with 200 status
  t.true(
    syncResponse.data.includes('update-sync-test'),
    'Should include updated contact in sync response'
  );
  t.true(
    syncResponse.data.includes('200 OK'),
    'Updated contact should have 200 OK status'
  );
  t.true(
    syncResponse.data.includes('Updated with photo'),
    'Should include updated contact data'
  );

  // Clean up
  await deleteVCard({
    vCard: { url: contactUrl },
    headers: t.context.authHeaders
  });
});
