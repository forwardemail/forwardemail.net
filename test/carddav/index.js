/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
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
  deleteObject,
  fetchVCards,
  createVCard,
  updateVCard,
  deleteVCard,
  addressBookQuery,
  propfind,
  DAVNamespaceShort
} = tsdav;
const { makeCollection, serviceDiscovery, fetchPrincipalUrl, fetchHomeUrl } =
  tsdav.default;

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
  // await t.context.cardDAV.close();
  // await t.context.sqlite.close();
});

//
// inspired by tsdav tests for various providers
// <https://github.com/natelindev/tsdav/tree/master/src/__tests__/integration>
//
test('serviceDiscovery should be able to discover the carddav service', async (t) => {
  {
    const url = await serviceDiscovery({
      account: { serverUrl: t.context.serverUrl, accountType: 'carddav' }
    });
    t.is(url, `${t.context.serverUrl}/dav/`);
  }

  {
    const url = await serviceDiscovery({
      account: { serverUrl: t.context.serverUrl, accountType: 'carddav' },
      headers: t.context.authHeaders
    });
    t.is(url, `${t.context.serverUrl}/dav/${t.context.username}/`);
  }
});

test('fetchPrincipalUrl should be able to fetch the url of principal collection', async (t) => {
  const url = await fetchPrincipalUrl({
    account: {
      serverUrl: t.context.serverUrl,
      rootUrl: t.context.serverUrl,
      accountType: 'carddav'
    },
    headers: t.context.authHeaders
  });
  t.is(url, `${t.context.serverUrl}/dav/${t.context.username}/`);
});

test('fetchHomeUrl should be able to fetch the url of home set', async (t) => {
  const principalUrl = await fetchPrincipalUrl({
    account: {
      serverUrl: t.context.serverUrl,
      rootUrl: t.context.serverUrl,
      accountType: 'carddav'
    },
    headers: t.context.authHeaders
  });
  const url = await fetchHomeUrl({
    account: {
      principalUrl,
      serverUrl: t.context.serverUrl,
      rootUrl: t.context.serverUrl,
      accountType: 'carddav'
    },
    headers: t.context.authHeaders
  });
  t.regex(url, /http:\/\/.+\//);
});

test('createAccount should be able to create account', async (t) => {
  const account = await createAccount({
    account: {
      serverUrl: t.context.serverUrl,
      accountType: 'carddav'
    },
    headers: t.context.authHeaders
  });
  t.is(account.rootUrl, `${t.context.serverUrl}/dav/${t.context.username}/`);
  t.is(
    account.principalUrl,
    `${t.context.serverUrl}/dav/${t.context.username}/`
  );
  t.is(
    account.homeUrl,
    `${t.context.serverUrl}/dav/${t.context.username}/addressbooks/`
  );
});

test('fetchAddressBooks should be able to fetch address books', async (t) => {
  {
    const addressBooks = await fetchAddressBooks({
      account: t.context.account,
      headers: t.context.authHeaders
    });
    t.is(addressBooks.length, 1);
  }

  const [response] = await makeCollection({
    url: `${t.context.serverUrl}/dav/${t.context.username}/addressbooks/foobar`,
    props: {
      [`${DAVNamespaceShort.DAV}:displayname`]: 'test',
      [`${DAVNamespaceShort.CARDDAV}:addressbook-description`]:
        'some address book description'
    },
    headers: t.context.authHeaders
  });
  t.true(response.ok);

  {
    const addressBooks = await fetchAddressBooks({
      account: t.context.account,
      headers: t.context.authHeaders
    });
    t.is(addressBooks.length, 2);
    t.true(addressBooks.every((c) => c.url.length > 0));
  }
});

test('makeCollection should be able to create an address book', async (t) => {
  const [response] = await makeCollection({
    url: `${t.context.serverUrl}/dav/${t.context.username}/addressbooks/bazboop`,
    props: {
      [`${DAVNamespaceShort.DAV}:displayname`]: 'New Address Book',
      [`${DAVNamespaceShort.CARDDAV}:addressbook-description`]:
        'A new address book for testing'
    },
    headers: t.context.authHeaders
  });

  t.true(response.ok);

  const addressBooks = await fetchAddressBooks({
    account: t.context.account,
    headers: t.context.authHeaders
  });

  const newAddressBook = addressBooks.find(
    (ab) => ab.displayName === 'New Address Book'
  );
  t.truthy(newAddressBook);
  // t.is(newAddressBook.description, 'A new address book for testing');
});

test('deleteObject should be able to delete an address book', async (t) => {
  // Create an address book to delete
  const [response] = await makeCollection({
    url: `${t.context.serverUrl}/dav/${t.context.username}/addressbooks/delete`,
    props: {
      [`${DAVNamespaceShort.DAV}:displayname`]: 'Address Book to Delete',
      [`${DAVNamespaceShort.CARDDAV}:addressbook-description`]:
        'This address book will be deleted'
    },
    headers: t.context.authHeaders
  });

  t.true(response.ok);

  // Find the address book
  const addressBooks = await fetchAddressBooks({
    account: t.context.account,
    headers: t.context.authHeaders
  });

  const addressBookToDelete = addressBooks.find(
    (ab) => ab.displayName === 'Address Book to Delete'
  );
  t.truthy(addressBookToDelete);

  // Delete the address book
  const deleteResponse = await deleteObject({
    url: `${t.context.serverUrl}/dav/${t.context.username}/addressbooks/delete`,
    headers: t.context.authHeaders
  });

  t.true(deleteResponse.ok);

  // Verify it's deleted
  const updatedAddressBooks = await fetchAddressBooks({
    account: t.context.account,
    headers: t.context.authHeaders
  });

  const deletedAddressBook = updatedAddressBooks.find(
    (ab) => ab.displayName === 'Address Book to Delete'
  );
  t.falsy(deletedAddressBook);
});

test('fetchVCards should be able to fetch contacts', async (t) => {
  const addressBooks = await fetchAddressBooks({
    account: t.context.account,
    headers: t.context.authHeaders
  });

  // Create a contact
  const contactUrl = new URL('contact1.vcf', addressBooks[0].url).href;
  const createResponse = await createVCard({
    addressBook: addressBooks[0],
    filename: 'contact1.vcf',
    vCardString: SAMPLE_VCARD,
    headers: t.context.authHeaders
  });

  t.is(createResponse.status, 201);
  t.truthy(createResponse.url);
  // t.truthy(createResponse.etag);

  // Fetch contacts
  const contacts = await fetchVCards({
    addressBook: addressBooks[0],
    headers: t.context.authHeaders
  });

  t.true(contacts.length > 0);
  t.true(
    contacts.every(
      (c) => c.data?.length > 0 && c.etag?.length > 0 && c.url?.length > 0
    )
  );

  // Clean up
  await deleteVCard({
    vCard: {
      url: contactUrl,
      etag: createResponse.etag
    },
    headers: t.context.authHeaders
  });
});

test('createVCard should be able to create a contact', async (t) => {
  const addressBooks = await fetchAddressBooks({
    account: t.context.account,
    headers: t.context.authHeaders
  });

  const contactUrl = new URL('contact2.vcf', addressBooks[0].url).href;
  const response = await createVCard({
    addressBook: addressBooks[0],
    filename: 'contact2.vcf',
    vCardString: SAMPLE_VCARD,
    headers: t.context.authHeaders
  });

  t.is(response.status, 201);
  t.truthy(response.url);
  // t.truthy(response.etag);

  // Clean up
  await deleteVCard({
    vCard: {
      url: contactUrl,
      etag: response.etag
    },
    headers: t.context.authHeaders
  });
});

test('updateVCard should be able to update a contact', async (t) => {
  const addressBooks = await fetchAddressBooks({
    account: t.context.account,
    headers: t.context.authHeaders
  });

  // Create a contact
  const contactUrl = new URL('contact3.vcf', addressBooks[0].url).href;
  const createResponse = await createVCard({
    addressBook: addressBooks[0],
    filename: 'contact3.vcf',
    vCardString: SAMPLE_VCARD,
    headers: t.context.authHeaders
  });

  t.is(createResponse.status, 201);

  // Update the contact
  const updatedVCard = SAMPLE_VCARD.replace('John Doe', 'Jane Doe').replace(
    'john.doe@example.com',
    'jane.doe@example.com'
  );

  const updateResponse = await updateVCard({
    vCard: {
      url: contactUrl,
      // etag: createResponse.etag,
      data: updatedVCard
    },
    headers: t.context.authHeaders
  });

  t.is(updateResponse.status, 204);

  // t.truthy(updateResponse.etag);
  // t.not(updateResponse.etag, createResponse.etag);

  // Fetch the updated contact
  const contacts = await fetchVCards({
    addressBook: addressBooks[0],
    headers: t.context.authHeaders
  });

  const updatedContact = contacts.find((c) => c.url === contactUrl);
  t.truthy(updatedContact);
  t.true(updatedContact.data.includes('Jane Doe'));
  t.true(updatedContact.data.includes('jane.doe@example.com'));

  // Clean up
  await deleteVCard({
    vCard: {
      url: contactUrl
      // etag: updateResponse.etag
    },
    headers: t.context.authHeaders
  });
});

test('deleteVCard should be able to delete a contact', async (t) => {
  const addressBooks = await fetchAddressBooks({
    account: t.context.account,
    headers: t.context.authHeaders
  });

  // Create a contact
  const contactUrl = new URL('contact4.vcf', addressBooks[0].url).href;
  const createResponse = await createVCard({
    addressBook: addressBooks[0],
    filename: 'contact4.vcf',
    vCardString: SAMPLE_VCARD,
    headers: t.context.authHeaders
  });

  t.is(createResponse.status, 201);

  // Delete the contact
  const deleteResponse = await deleteVCard({
    vCard: {
      url: contactUrl
      // etag: createResponse.etag
    },
    headers: t.context.authHeaders
  });

  t.true(deleteResponse.ok);

  // Verify it's deleted
  const contacts = await fetchVCards({
    addressBook: addressBooks[0],
    headers: t.context.authHeaders
  });

  const deletedContact = contacts.find((c) => c.url === contactUrl);
  t.falsy(deletedContact);
});

test('addressBookQuery should be able to detect address book changes', async (t) => {
  const addressBooks = await fetchAddressBooks({
    account: t.context.account,
    headers: t.context.authHeaders
  });

  // Get initial contacts using addressBookQuery
  const initialContacts = await addressBookQuery({
    url: addressBooks[0].url,
    props: {
      [`${DAVNamespaceShort.DAV}:getetag`]: {}
    },
    depth: '1',
    headers: t.context.authHeaders
  });

  t.true(Array.isArray(initialContacts));
  const initialContactCount = initialContacts.length;

  // Create a new contact
  const contactUrl = new URL('contact5.vcf', addressBooks[0].url).href;
  await createVCard({
    addressBook: addressBooks[0],
    filename: 'contact5.vcf',
    vCardString: SAMPLE_VCARD,
    headers: t.context.authHeaders
  });

  // Query again to detect changes
  const updatedContacts = await addressBookQuery({
    url: addressBooks[0].url,
    props: {
      [`${DAVNamespaceShort.DAV}:getetag`]: {}
    },
    depth: '1',
    headers: t.context.authHeaders
  });

  t.true(Array.isArray(updatedContacts));
  t.true(
    updatedContacts.length > initialContactCount,
    'New contact should be detected'
  );

  // Verify the new contact exists
  const newContact = updatedContacts.find(
    (contact) => contact.href && contact.href.includes('contact5.vcf')
  );
  t.truthy(newContact, 'New contact should be found in query results');

  // Clean up
  const contacts = await fetchVCards({
    addressBook: addressBooks[0],
    headers: t.context.authHeaders
  });
  const createdContact = contacts.find((c) => c.url === contactUrl);
  if (createdContact) {
    await deleteVCard({
      vCard: createdContact,
      headers: t.context.authHeaders
    });
  }
});

test('addressBookQuery should be able to filter contacts', async (t) => {
  const addressBooks = await fetchAddressBooks({
    account: t.context.account,
    headers: t.context.authHeaders
  });

  // Create two contacts
  const johnVCard = SAMPLE_VCARD;
  const janeVCard = SAMPLE_VCARD.replace('John Doe', 'Jane Smith').replace(
    'john.doe@example.com',
    'jane.smith@example.com'
  );

  const johnUrl = new URL('john.vcf', addressBooks[0].url).href;
  const janeUrl = new URL('jane.vcf', addressBooks[0].url).href;

  await createVCard({
    addressBook: addressBooks[0],
    filename: 'john.vcf',
    vCardString: johnVCard,
    headers: t.context.authHeaders
  });

  await createVCard({
    addressBook: addressBooks[0],
    filename: 'jane.vcf',
    vCardString: janeVCard,
    headers: t.context.authHeaders
  });

  // Query for John
  const johnQuery = [
    {
      'prop-filter': {
        _attributes: {
          name: 'FN'
        },
        'text-match': {
          _attributes: {
            collation: 'i;ascii-casemap',
            'match-type': 'contains'
          },
          _text: 'John'
        }
      }
    }
  ];

  const johnResults = await addressBookQuery({
    url: addressBooks[0].url,
    props: { 'd:getetag': {}, 'card:address-data': {} },
    filters: johnQuery,
    headers: t.context.authHeaders
  });

  t.true(johnResults.length > 0);
  t.true(johnResults.every((r) => r.props.addressData.includes('John Doe')));

  // Query for Jane
  const janeQuery = [
    {
      'prop-filter': {
        _attributes: {
          name: 'FN'
        },
        'text-match': {
          _attributes: {
            collation: 'i;ascii-casemap',
            'match-type': 'contains'
          },
          _text: 'Jane'
        }
      }
    }
  ];

  const janeResults = await addressBookQuery({
    url: addressBooks[0].url,
    props: { 'd:getetag': {}, 'card:address-data': {} },
    filters: janeQuery,
    headers: t.context.authHeaders
  });

  t.true(janeResults.length > 0);
  t.true(janeResults.every((r) => r.props.addressData.includes('Jane Smith')));

  // Clean up
  const contacts = await fetchVCards({
    addressBook: addressBooks[0],
    headers: t.context.authHeaders
  });

  for (const contact of contacts) {
    if (contact.url === johnUrl || contact.url === janeUrl) {
      await deleteVCard({
        vCard: contact,
        headers: t.context.authHeaders
      });
    }
  }
});

test('propfind should be able to get address book properties', async (t) => {
  const addressBooks = await fetchAddressBooks({
    account: t.context.account,
    headers: t.context.authHeaders
  });

  const response = await propfind({
    url: addressBooks[0].url,
    props: [
      'd:displayname',
      'd:resourcetype',
      'd:sync-token',
      'card:addressbook-description',
      'card:supported-address-data'
    ],
    depth: '0',
    headers: t.context.authHeaders
  });

  t.truthy(response);
  t.true(Array.isArray(response));
  t.true(response.length > 0);

  const { props } = response[0];
  t.truthy(props.displayname);
  t.truthy(props.resourcetype);
  t.truthy(props.syncToken);
});

test('should handle group contacts', async (t) => {
  const addressBooks = await fetchAddressBooks({
    account: t.context.account,
    headers: t.context.authHeaders
  });

  // Create a group vCard
  const groupVCard = `BEGIN:VCARD
VERSION:3.0
FN:Test Group
N:;Test Group;;;
KIND:group
X-ADDRESSBOOKSERVER-KIND:group
X-ADDRESSBOOKSERVER-MEMBER:urn:uuid:123e4567-e89b-12d3-a456-426614174001
X-ADDRESSBOOKSERVER-MEMBER:urn:uuid:123e4567-e89b-12d3-a456-426614174002
UID:123e4567-e89b-12d3-a456-426614174003
END:VCARD`;

  const groupUrl = new URL('group.vcf', addressBooks[0].url).href;
  const response = await createVCard({
    addressBook: addressBooks[0],
    filename: 'group.vcf',
    vCardString: groupVCard,
    headers: t.context.authHeaders
  });

  t.is(response.status, 201);
  t.truthy(response.url);
  // t.truthy(response.etag);

  // Fetch the group
  const contacts = await fetchVCards({
    addressBook: addressBooks[0],
    headers: t.context.authHeaders
  });
  const group = contacts.find((c) => c.url === groupUrl);
  t.truthy(group);
  t.true(group.data.includes('KIND:group'));
  t.true(group.data.includes('X-ADDRESSBOOKSERVER-KIND:group'));

  // Clean up
  await deleteVCard({
    vCard: {
      url: groupUrl,
      etag: response.etag
    },
    headers: t.context.authHeaders
  });
});

test('should handle extended vCard properties', async (t) => {
  const addressBooks = await fetchAddressBooks({
    account: t.context.account,
    headers: t.context.authHeaders
  });

  // Create a vCard with extended properties
  const extendedVCard = `BEGIN:VCARD
VERSION:3.0
FN:Extended Contact
N:Contact;Extended;;;
EMAIL;TYPE=INTERNET:extended@example.com
TEL;TYPE=CELL:+1234567890
X-SOCIALPROFILE;TYPE=twitter:https://twitter.com/extended
X-SOCIALPROFILE;TYPE=linkedin:https://linkedin.com/in/extended
X-ABRELATEDNAMES;TYPE=spouse:Partner Name
IMPP;TYPE=xmpp:xmpp:extended@example.com
CATEGORIES:Friends,Work
PHOTO;ENCODING=b;TYPE=JPEG:/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAABAAEDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9/KKKKAP/2Q==
BDAY:1980-01-01
X-ANNIVERSARY:2010-06-15
UID:123e4567-e89b-12d3-a456-426614174004
END:VCARD`;

  const extendedUrl = new URL('extended.vcf', addressBooks[0].url).href;
  const response = await createVCard({
    addressBook: addressBooks[0],
    filename: 'extended.vcf',
    vCardString: extendedVCard,
    headers: t.context.authHeaders
  });

  t.is(response.status, 201);
  t.truthy(response.url);
  // t.truthy(response.etag);

  // Fetch the contact
  const contacts = await fetchVCards({
    addressBook: addressBooks[0],
    headers: t.context.authHeaders
  });

  const extendedContact = contacts.find((c) => c.url === extendedUrl);
  t.truthy(extendedContact);
  t.true(extendedContact.data.includes('X-SOCIALPROFILE'));
  t.true(extendedContact.data.includes('X-ABRELATEDNAMES'));
  t.true(extendedContact.data.includes('CATEGORIES:Friends,Work'));

  // Clean up
  await deleteVCard({
    vCard: {
      url: extendedUrl,
      etag: response.etag
    },
    headers: t.context.authHeaders
  });
});

//
// Tests for bug fixes
//

test('should reject invalid vCard (missing VERSION)', async (t) => {
  const addressBooks = await fetchAddressBooks({
    account: t.context.account,
    headers: t.context.authHeaders
  });

  const invalidVCard = `BEGIN:VCARD
FN:Invalid Contact
EMAIL:invalid@example.com
UID:invalid-uid
END:VCARD`;

  const createResponse = await createVCard({
    addressBook: addressBooks[0],
    filename: 'invalid.vcf',
    vCardString: invalidVCard,
    headers: t.context.authHeaders
  });
  t.is(createResponse.status, 400);

  const json = await createResponse.json();
  t.is(json.message, 'vCard must contain valid VERSION property (3.0 or 4.0)');
});

test('should reject invalid vCard (missing FN)', async (t) => {
  const addressBooks = await fetchAddressBooks({
    account: t.context.account,
    headers: t.context.authHeaders
  });

  const invalidVCard = `BEGIN:VCARD
VERSION:3.0
EMAIL:invalid@example.com
UID:invalid-uid
END:VCARD`;

  const createResponse = await createVCard({
    addressBook: addressBooks[0],
    filename: 'invalid2.vcf',
    vCardString: invalidVCard,
    headers: t.context.authHeaders
  });
  t.is(createResponse.status, 400);
  const json = await createResponse.json();
  t.is(json.message, 'vCard must contain FN (Formatted Name) property');
});

test('should reject invalid vCard (missing BEGIN:VCARD)', async (t) => {
  const addressBooks = await fetchAddressBooks({
    account: t.context.account,
    headers: t.context.authHeaders
  });

  const invalidVCard = `VERSION:3.0
FN:Invalid Contact
EMAIL:invalid@example.com
UID:invalid-uid
END:VCARD`;

  const createResponse = await createVCard({
    addressBook: addressBooks[0],
    filename: 'invalid3.vcf',
    vCardString: invalidVCard,
    headers: t.context.authHeaders
  });

  t.is(createResponse.status, 400);
  const json = await createResponse.json();
  t.is(json.message, 'vCard must contain BEGIN:VCARD');
});

test('should respect If-None-Match header when creating contact', async (t) => {
  const addressBooks = await fetchAddressBooks({
    account: t.context.account,
    headers: t.context.authHeaders
  });

  // Create a contact
  const contactUrl = new URL('ifnonematch.vcf', addressBooks[0].url).href;
  const createResponse = await createVCard({
    addressBook: addressBooks[0],
    filename: 'ifnonematch.vcf',
    vCardString: SAMPLE_VCARD,
    headers: t.context.authHeaders
  });

  t.is(createResponse.status, 201);

  // Try to create it again with If-None-Match: *
  {
    const createResponse = await createVCard({
      addressBook: addressBooks[0],
      filename: 'ifnonematch.vcf',
      vCardString: SAMPLE_VCARD,
      headers: {
        ...t.context.authHeaders,
        'If-None-Match': '*'
      }
    });
    t.is(createResponse.status, 412); // Precondition Failed
    const json = await createResponse.json();
    t.is(json.message, 'Contact already exists.');
  }

  // Clean up
  await deleteVCard({
    vCard: {
      url: contactUrl
    },
    headers: t.context.authHeaders
  });
});

test('PROPPATCH should update address book properties', async (t) => {
  const axios = require('axios');

  // Get address books
  const addressBooks = await fetchAddressBooks({
    account: t.context.account,
    headers: t.context.authHeaders
  });

  const addressBook = addressBooks[0];
  const originalName = addressBook.displayName;

  // PROPPATCH to update displayname and description
  const proppatchXml = `<?xml version="1.0" encoding="UTF-8"?>
<d:propertyupdate xmlns:d="DAV:" xmlns:card="urn:ietf:params:xml:ns:carddav">
  <d:set>
    <d:prop>
      <d:displayname>Updated Test Name</d:displayname>
      <card:addressbook-description>Updated description via PROPPATCH</card:addressbook-description>
    </d:prop>
  </d:set>
</d:propertyupdate>`;

  const response = await axios({
    method: 'PROPPATCH',
    url: addressBook.url,
    headers: {
      'Content-Type': 'application/xml',
      ...t.context.authHeaders
    },
    data: proppatchXml
  });

  t.is(response.status, 207); // Multi-Status
  t.true(response.data.includes('200 OK'));

  // Verify the changes
  const updatedAddressBooks = await fetchAddressBooks({
    account: t.context.account,
    headers: t.context.authHeaders
  });

  const updatedBook = updatedAddressBooks.find(
    (ab) => ab.url === addressBook.url
  );
  t.is(updatedBook.displayName, 'Updated Test Name');

  // Restore original name
  const restoreXml = `<?xml version="1.0" encoding="UTF-8"?>
<d:propertyupdate xmlns:d="DAV:">
  <d:set>
    <d:prop>
      <d:displayname>${originalName}</d:displayname>
    </d:prop>
  </d:set>
</d:propertyupdate>`;

  await axios({
    method: 'PROPPATCH',
    url: addressBook.url,
    headers: {
      'Content-Type': 'application/xml',
      ...t.context.authHeaders
    },
    data: restoreXml
  });
});

test('sync-collection should return only modified contacts', async (t) => {
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

  // Extract sync token from response
  const syncTokenMatch = propfindResponse.data.match(
    /<d:sync-token>([^<]+)<\/d:sync-token>/
  );
  const initialSyncToken = syncTokenMatch ? syncTokenMatch[1] : null;

  t.truthy(initialSyncToken);

  // Wait a bit to ensure timestamp difference
  await new Promise((resolve) => {
    setTimeout(resolve, 100);
  });

  // Create a new contact
  const contactUrl = new URL('sync-test.vcf', addressBook.url).href;
  await createVCard({
    addressBook,
    filename: 'sync-test.vcf',
    vCardString: SAMPLE_VCARD,
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
  <d:sync-token>${initialSyncToken}</d:sync-token>
  <d:sync-level>1</d:sync-level>
  <d:prop>
    <d:getetag/>
    <card:address-data/>
  </d:prop>
</d:sync-collection>`
  });

  t.is(syncResponse.status, 207);

  // Response should contain only the newly created contact
  t.true(syncResponse.data.includes('sync-test.vcf'));

  // Verify new sync token is included
  t.true(syncResponse.data.includes('<d:sync-token>'));

  // Clean up
  const contacts = await fetchVCards({
    addressBook,
    headers: t.context.authHeaders
  });
  const createdContact = contacts.find((c) => c.url === contactUrl);
  if (createdContact) {
    await deleteVCard({
      vCard: createdContact,
      headers: t.context.authHeaders
    });
  }
});
