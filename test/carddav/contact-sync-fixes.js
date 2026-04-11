/*
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

/**
 * Tests for CardDAV contact sync fixes:
 *
 * Bug 1 – sync-collection timing: Contact's updated_at could equal the sync
 *   token timestamp (same millisecond), causing `$gt` to miss the change.
 *   Fixed by using `$gte` and adding +1 ms to the sync token so the next
 *   sync does not re-report the same contact.
 *
 * Bug 2 – DELETE / GET / PROPFIND missing UID fallback: macOS Contacts may
 *   reference a contact by a URL whose filename matches the vCard UID rather
 *   than the stored contact_id.  Without a UID-based fallback the server
 *   returned 404, making old contacts undeletable from macOS.
 *
 * Bug 3 – addressbook-multiget missing UID fallback: Same root cause as
 *   Bug 2 but in the REPORT multiget handler.
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

  map.set(
    `txt:${domain.dkim_key_selector}._domainkey.${domain.name}`,
    resolver.spoofPacket(
      `${domain.dkim_key_selector}._domainkey.${domain.name}`,
      'TXT',
      [`v=DKIM1; k=rsa; p=${domain.dkim_public_key.toString('base64')};`],
      true
    )
  );

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

  map.set(
    `cname:${domain.return_path}.${domain.name}`,
    resolver.spoofPacket(
      `${domain.return_path}.${domain.name}`,
      'CNAME',
      [env.WEB_HOST],
      true
    )
  );

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

// ---------------------------------------------------------------------------
// Helper: fetch the current sync-token for an address book via PROPFIND
// ---------------------------------------------------------------------------
async function getSyncToken(t, addressBookUrl) {
  const axios = require('axios');
  const res = await axios({
    method: 'PROPFIND',
    url: addressBookUrl,
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
  const m = res.data.match(/<d:sync-token>([^<]+)<\/d:sync-token>/);
  return m ? m[1] : null;
}

// ---------------------------------------------------------------------------
// Helper: perform a sync-collection REPORT and return the raw XML body
// ---------------------------------------------------------------------------
async function syncCollection(t, addressBookUrl, syncToken) {
  const axios = require('axios');
  const res = await axios({
    method: 'REPORT',
    url: addressBookUrl,
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
  return res;
}

// ===================================================================
// Bug 1 – sync-collection timing: newly created contacts must appear
// ===================================================================

test('sync-collection returns a newly created contact (same-millisecond timing)', async (t) => {
  const addressBook = t.context.addressBooks[0];

  // 1. Get the current sync token
  const tokenBefore = await getSyncToken(t, addressBook.url);
  t.truthy(tokenBefore, 'Should have an initial sync token');

  // 2. Create a contact
  const uid = 'timing-test-' + Date.now();
  const vcard = SAMPLE_VCARD.replace(
    '123e4567-e89b-12d3-a456-426614174000',
    uid
  ).replace('John Doe', 'Timing Test');

  await createVCard({
    addressBook,
    filename: `${uid}.vcf`,
    vCardString: vcard,
    headers: t.context.authHeaders
  });

  // 3. Get the new sync token
  const tokenAfter = await getSyncToken(t, addressBook.url);
  t.not(tokenBefore, tokenAfter, 'Sync token should change after create');

  // 4. Sync-collection with the OLD token → must include the new contact
  const syncRes = await syncCollection(t, addressBook.url, tokenBefore);
  t.is(syncRes.status, 207);
  t.true(
    syncRes.data.includes(uid),
    'Newly created contact must appear in sync-collection'
  );
  t.true(
    syncRes.data.includes('Timing Test'),
    'Contact data should be in the response'
  );

  // 5. Sync-collection with the NEW token → must NOT include the contact
  const syncRes2 = await syncCollection(t, addressBook.url, tokenAfter);
  t.is(syncRes2.status, 207);
  t.false(
    syncRes2.data.includes(uid),
    'Contact must NOT be re-reported with the new sync token'
  );

  // Clean up
  const contactUrl = new URL(`${uid}.vcf`, addressBook.url).href;
  await deleteVCard({
    vCard: { url: contactUrl },
    headers: t.context.authHeaders
  });
});

test('sync-collection returns an updated contact', async (t) => {
  const addressBook = t.context.addressBooks[0];

  // 1. Create a contact
  const uid = 'update-timing-' + Date.now();
  const vcard = SAMPLE_VCARD.replace(
    '123e4567-e89b-12d3-a456-426614174000',
    uid
  ).replace('John Doe', 'Before Update');

  await createVCard({
    addressBook,
    filename: `${uid}.vcf`,
    vCardString: vcard,
    headers: t.context.authHeaders
  });

  // 2. Get sync token after create
  const tokenAfterCreate = await getSyncToken(t, addressBook.url);
  t.truthy(tokenAfterCreate);

  // 3. Wait a tiny bit to ensure timestamp separation
  await new Promise((resolve) => {
    setTimeout(resolve, 50);
  });

  // 4. Update the contact
  const contactUrl = new URL(`${uid}.vcf`, addressBook.url).href;
  const updatedVcard = SAMPLE_VCARD.replace(
    '123e4567-e89b-12d3-a456-426614174000',
    uid
  ).replace('John Doe', 'After Update');

  await updateVCard({
    vCard: { url: contactUrl, data: updatedVcard },
    headers: t.context.authHeaders
  });

  // 5. Get sync token after update
  const tokenAfterUpdate = await getSyncToken(t, addressBook.url);
  t.not(
    tokenAfterCreate,
    tokenAfterUpdate,
    'Sync token should change after update'
  );

  // 6. Sync-collection with the post-create token → must include the update
  const syncRes = await syncCollection(t, addressBook.url, tokenAfterCreate);
  t.is(syncRes.status, 207);
  t.true(
    syncRes.data.includes('After Update'),
    'Updated contact data should appear in sync-collection'
  );

  // 7. Sync-collection with the post-update token → must NOT re-report
  const syncRes2 = await syncCollection(t, addressBook.url, tokenAfterUpdate);
  t.is(syncRes2.status, 207);
  t.false(
    syncRes2.data.includes(uid),
    'Contact must NOT be re-reported with the post-update token'
  );

  // Clean up
  await deleteVCard({
    vCard: { url: contactUrl },
    headers: t.context.authHeaders
  });
});

test('sync-collection returns a deleted contact with 404 status', async (t) => {
  const addressBook = t.context.addressBooks[0];

  // 1. Create a contact
  const uid = 'delete-timing-' + Date.now();
  const vcard = SAMPLE_VCARD.replace(
    '123e4567-e89b-12d3-a456-426614174000',
    uid
  ).replace('John Doe', 'Delete Me');

  await createVCard({
    addressBook,
    filename: `${uid}.vcf`,
    vCardString: vcard,
    headers: t.context.authHeaders
  });

  // 2. Get sync token after create
  const tokenAfterCreate = await getSyncToken(t, addressBook.url);
  t.truthy(tokenAfterCreate);

  // 3. Wait a tiny bit
  await new Promise((resolve) => {
    setTimeout(resolve, 50);
  });

  // 4. Delete the contact
  const contactUrl = new URL(`${uid}.vcf`, addressBook.url).href;
  await deleteVCard({
    vCard: { url: contactUrl },
    headers: t.context.authHeaders
  });

  // 5. Sync-collection with the post-create token → must include the deletion
  const syncRes = await syncCollection(t, addressBook.url, tokenAfterCreate);
  t.is(syncRes.status, 207);
  t.true(
    syncRes.data.includes(uid),
    'Deleted contact must appear in sync-collection'
  );
  t.true(
    syncRes.data.includes('404') && syncRes.data.includes('Not Found'),
    'Deleted contact should have 404 status'
  );
});

// ===================================================================
// Bug 2 – DELETE / GET / PROPFIND with UID-based fallback
// ===================================================================

test('DELETE succeeds when URL uses vCard UID instead of stored contact_id', async (t) => {
  const axios = require('axios');
  const addressBook = t.context.addressBooks[0];

  // 1. Create a contact with a contact_id that differs from the UID
  const uid = 'uid-delete-test-' + Date.now();
  const contactId = 'different-id-' + Date.now();
  const vcard = SAMPLE_VCARD.replace(
    '123e4567-e89b-12d3-a456-426614174000',
    uid
  ).replace('John Doe', 'UID Delete Test');

  // Create using the different contact_id URL
  const createUrl = new URL(`${contactId}.vcf`, addressBook.url).href;
  await axios({
    method: 'PUT',
    url: createUrl,
    headers: {
      'Content-Type': 'text/vcard; charset=utf-8',
      ...t.context.authHeaders
    },
    data: vcard
  });

  // 2. Try to DELETE using the UID-based URL (simulating macOS behavior)
  const uidUrl = new URL(`${uid}.vcf`, addressBook.url).href;
  const deleteRes = await axios({
    method: 'DELETE',
    url: uidUrl,
    headers: t.context.authHeaders,
    validateStatus: () => true
  });

  t.is(
    deleteRes.status,
    204,
    'DELETE should succeed via UID fallback when contact_id does not match'
  );

  // 3. Verify the contact is actually deleted (GET should return 404)
  const getRes = await axios({
    method: 'GET',
    url: createUrl,
    headers: t.context.authHeaders,
    validateStatus: () => true
  });

  t.is(getRes.status, 404, 'Contact should be soft-deleted');
});

test('GET succeeds when URL uses vCard UID instead of stored contact_id', async (t) => {
  const axios = require('axios');
  const addressBook = t.context.addressBooks[0];

  // 1. Create a contact with a contact_id that differs from the UID
  const uid = 'uid-get-test-' + Date.now();
  const contactId = 'different-get-id-' + Date.now();
  const vcard = SAMPLE_VCARD.replace(
    '123e4567-e89b-12d3-a456-426614174000',
    uid
  ).replace('John Doe', 'UID Get Test');

  const createUrl = new URL(`${contactId}.vcf`, addressBook.url).href;
  await axios({
    method: 'PUT',
    url: createUrl,
    headers: {
      'Content-Type': 'text/vcard; charset=utf-8',
      ...t.context.authHeaders
    },
    data: vcard
  });

  // 2. Try to GET using the UID-based URL
  const uidUrl = new URL(`${uid}.vcf`, addressBook.url).href;
  const getRes = await axios({
    method: 'GET',
    url: uidUrl,
    headers: t.context.authHeaders,
    validateStatus: () => true
  });

  t.is(
    getRes.status,
    200,
    'GET should succeed via UID fallback when contact_id does not match'
  );
  t.true(
    getRes.data.includes('UID Get Test'),
    'Should return the correct contact data'
  );

  // Clean up
  await axios({
    method: 'DELETE',
    url: createUrl,
    headers: t.context.authHeaders,
    validateStatus: () => true
  });
});

test('PROPFIND succeeds when URL uses vCard UID instead of stored contact_id', async (t) => {
  const axios = require('axios');
  const addressBook = t.context.addressBooks[0];

  // 1. Create a contact with a contact_id that differs from the UID
  const uid = 'uid-propfind-test-' + Date.now();
  const contactId = 'different-propfind-id-' + Date.now();
  const vcard = SAMPLE_VCARD.replace(
    '123e4567-e89b-12d3-a456-426614174000',
    uid
  ).replace('John Doe', 'UID Propfind Test');

  const createUrl = new URL(`${contactId}.vcf`, addressBook.url).href;
  await axios({
    method: 'PUT',
    url: createUrl,
    headers: {
      'Content-Type': 'text/vcard; charset=utf-8',
      ...t.context.authHeaders
    },
    data: vcard
  });

  // 2. Try to PROPFIND using the UID-based URL
  const uidUrl = new URL(`${uid}.vcf`, addressBook.url).href;
  const propfindRes = await axios({
    method: 'PROPFIND',
    url: uidUrl,
    headers: {
      'Content-Type': 'application/xml',
      Depth: '0',
      ...t.context.authHeaders
    },
    data: `<?xml version="1.0" encoding="UTF-8"?>
<d:propfind xmlns:d="DAV:">
  <d:prop>
    <d:getetag/>
  </d:prop>
</d:propfind>`,
    validateStatus: () => true
  });

  t.is(
    propfindRes.status,
    207,
    'PROPFIND should succeed via UID fallback when contact_id does not match'
  );
  t.true(
    propfindRes.data.includes('getetag'),
    'Should return ETag in PROPFIND response'
  );

  // Clean up
  await axios({
    method: 'DELETE',
    url: createUrl,
    headers: t.context.authHeaders,
    validateStatus: () => true
  });
});

// ===================================================================
// Bug 3 – addressbook-multiget with UID-based fallback
// ===================================================================

test('addressbook-multiget resolves contacts by UID when contact_id differs', async (t) => {
  const axios = require('axios');
  const addressBook = t.context.addressBooks[0];

  // 1. Create a contact with a contact_id that differs from the UID
  const uid = 'uid-multiget-test-' + Date.now();
  const contactId = 'different-multiget-id-' + Date.now();
  const vcard = SAMPLE_VCARD.replace(
    '123e4567-e89b-12d3-a456-426614174000',
    uid
  ).replace('John Doe', 'UID Multiget Test');

  const createUrl = new URL(`${contactId}.vcf`, addressBook.url).href;
  await axios({
    method: 'PUT',
    url: createUrl,
    headers: {
      'Content-Type': 'text/vcard; charset=utf-8',
      ...t.context.authHeaders
    },
    data: vcard
  });

  // 2. Request via multiget using the UID-based href
  const uidPath = new URL(`${uid}.vcf`, addressBook.url).pathname;
  const multigetRes = await axios({
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
  <d:href>${uidPath}</d:href>
</card:addressbook-multiget>`
  });

  t.is(multigetRes.status, 207);
  t.true(
    multigetRes.data.includes('UID Multiget Test'),
    'Multiget should resolve the contact via UID fallback'
  );

  // Clean up
  await axios({
    method: 'DELETE',
    url: createUrl,
    headers: t.context.authHeaders,
    validateStatus: () => true
  });
});

// ===================================================================
// Regression: macOS full sync flow (create on server, sync to client)
// ===================================================================

test('server-created contact is visible in sync-collection on next sync', async (t) => {
  const axios = require('axios');
  const addressBook = t.context.addressBooks[0];

  // 1. Simulate initial sync — get the current token
  const tokenBefore = await getSyncToken(t, addressBook.url);
  t.truthy(tokenBefore);

  // 2. Create a contact directly via PUT (simulating server/API creation)
  const uid = 'server-created-' + Date.now();
  const vcard = SAMPLE_VCARD.replace(
    '123e4567-e89b-12d3-a456-426614174000',
    uid
  ).replace('John Doe', 'Server Created Contact');

  const contactUrl = new URL(`${uid}.vcf`, addressBook.url).href;
  const createRes = await axios({
    method: 'PUT',
    url: contactUrl,
    headers: {
      'Content-Type': 'text/vcard; charset=utf-8',
      ...t.context.authHeaders
    },
    data: vcard
  });

  t.is(createRes.status, 201, 'Contact should be created');

  // 3. macOS polls sync-collection with the old token
  const syncRes = await syncCollection(t, addressBook.url, tokenBefore);
  t.is(syncRes.status, 207);
  t.true(
    syncRes.data.includes('Server Created Contact'),
    'Server-created contact MUST appear in sync-collection (was the main reported bug)'
  );

  // 4. Get the new token and verify no re-report
  const tokenAfter = await getSyncToken(t, addressBook.url);
  const syncRes2 = await syncCollection(t, addressBook.url, tokenAfter);
  t.false(
    syncRes2.data.includes(uid),
    'Contact must NOT be re-reported with the new token'
  );

  // Clean up
  await deleteVCard({
    vCard: { url: contactUrl },
    headers: t.context.authHeaders
  });
});

test('macOS delete-from-server flow: contact deleted on server appears as 404 in sync', async (t) => {
  const addressBook = t.context.addressBooks[0];

  // 1. Create a contact
  const uid = 'macos-delete-flow-' + Date.now();
  const vcard = SAMPLE_VCARD.replace(
    '123e4567-e89b-12d3-a456-426614174000',
    uid
  ).replace('John Doe', 'Delete Flow Test');

  await createVCard({
    addressBook,
    filename: `${uid}.vcf`,
    vCardString: vcard,
    headers: t.context.authHeaders
  });

  // 2. macOS syncs and gets the contact
  const tokenAfterCreate = await getSyncToken(t, addressBook.url);
  const syncRes1 = await syncCollection(
    t,
    addressBook.url,
    // Use a very old token to get everything
    `${config.urls.web}/ns/sync-token/0`
  );
  t.true(
    syncRes1.data.includes('Delete Flow Test'),
    'Contact should be visible in initial sync'
  );

  // 3. Wait a tiny bit
  await new Promise((resolve) => {
    setTimeout(resolve, 50);
  });

  // 4. Delete the contact
  const contactUrl = new URL(`${uid}.vcf`, addressBook.url).href;
  await deleteVCard({
    vCard: { url: contactUrl },
    headers: t.context.authHeaders
  });

  // 5. macOS syncs again with the post-create token
  const syncRes2 = await syncCollection(t, addressBook.url, tokenAfterCreate);
  t.is(syncRes2.status, 207);
  t.true(
    syncRes2.data.includes(uid),
    'Deleted contact must appear in sync-collection'
  );
  t.true(
    syncRes2.data.includes('404'),
    'Deleted contact should have 404 status so macOS removes it'
  );

  // 6. Initial sync should NOT include the deleted contact
  const syncRes3 = await syncCollection(
    t,
    addressBook.url,
    '' // empty token = initial sync
  );
  // For initial sync with empty token, the server returns all non-deleted contacts
  // The deleted contact should not be there
  t.false(
    syncRes3.data.includes('Delete Flow Test'),
    'Deleted contact should NOT appear in initial sync'
  );
});
