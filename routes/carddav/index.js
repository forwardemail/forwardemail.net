/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { randomUUID } = require('node:crypto');
const Boom = require('@hapi/boom');
const Router = require('@koa/router');
const basicAuth = require('basic-auth');

const AddressBooks = require('#models/address-books');
const Contacts = require('#models/contacts');
const config = require('#config');
const setupAuthSession = require('#helpers/setup-auth-session');
const xmlHelpers = require('#helpers/carddav-xml');

async function ensureDefaultAddressBook(ctx) {
  const count = await AddressBooks.countDocuments(
    ctx.instance,
    ctx.state.session,
    {}
  );
  if (count > 0) return;
  //
  // TODO: add apple support
  //       (e.g. does it use DEFAULT_CONTACTS_NAME or something?)
  //
  // if (!ctx.state.isApple) {
  await AddressBooks.create({
    // db virtual helper
    instance: ctx.instance,
    session: ctx.state.session,

    // adress book obj

    // TODO: check how fennel does it
    // TODO: should this be randomUUID() ?
    address_book_id: 'default', // randomUUID()
    // TODO: I18N_CONTACTS[ctx.locale] || ctx.translate('CONTACTS')
    name: 'Contacts',
    // TODO: translate this
    description: 'Default address book',
    color: '#0000FF', // blue
    readonly: false,
    synctoken: `${config.urls.web}/ns/sync-token/1`,
    // TODO: do we need a timezone on the addressbook at all (?)
    timezone: ctx.state.session.user.timezone || 'UTC',
    // TODO: isn't this automatic (?)
    // TODO: if we need to change /default here (?)
    // TODO: fix port if 443 or 80 then don't render it (?)
    url: `${ctx.instance.config.protocol}://${ctx.instance.config.host}:${ctx.instance.config.port}/${ctx.state.session.user.email}/addressbooks/default`,
    // TODO: isn't this automatic (?)
    prodId: `//forwardemail.net//carddav//EN`
  });
}

const router = new Router();

// status page crawlers often send `HEAD /` requests
router.get('/', (ctx) => {
  ctx.body = 'OK';
});

// OPTIONS route for CORS and DAV discovery
router.options('(.*)', (ctx) => {
  ctx.set('DAV', '1, 3, addressbook');
  ctx.set(
    'Allow',
    'OPTIONS, GET, PUT, DELETE, PROPFIND, PROPPATCH, REPORT, MKCOL'
  );
  ctx.status = 200;
});

// support well-known redirect
router.use((ctx, next) => {
  console.log('YO YO');
  console.log('ctx.url', ctx.url);
  if (ctx.url.toLowerCase() === '/.well-known/carddav')
    return ctx.redirect('/dav');
  return next();
});

const davRouter = new Router({
  prefix: '/dav'
});

davRouter.use(async (ctx, next) => {
  try {
    const creds = basicAuth(ctx);
    // TODO: translation + error message support (similar to CalDAV?)
    if (!creds) throw Boom.unauthorized();
    ctx.logger.debug('authenticate', {
      username: creds.name,
      password: creds.pass
    });
    await setupAuthSession.call(ctx.instance, ctx, creds.name, creds.pass);
  } catch (err) {
    ctx.response.set('WWW-Authenticate', 'Basic realm="forwardemail/carddav"');
    throw err;
  }

  await ensureDefaultAddressBook.call(ctx.instance, ctx);

  return next();
});

// PROPFIND routes
davRouter.all('/:user', async (ctx) => {
  console.log('ctx.params.user', ctx.params.user);
  if (ctx.params.user !== ctx.state.session.username) throw Boom.unauthorized();
  if (ctx.method !== 'PROPFIND') throw Boom.methodNotAllowed();

  try {
    // const depth = ctx.request.headers.depth || '0';

    // Parse XML request body
    // const xmlBody = ctx.request.body
    //   ? await xmlHelpers.parseXML(ctx.request.body.toString())
    //   : null;
    // const props = xmlHelpers.extractRequestedProps(xmlBody);

    // Create response
    const responses = [
      {
        href: `/dav/${ctx.params.user}`,
        propstat: [
          {
            props: [
              { name: 'd:displayname', value: ctx.state.session.user.username },
              {
                name: 'd:resourcetype',
                value: '<d:collection/><d:principal/>'
              },
              {
                name: 'd:current-user-principal',
                value: `<d:href>/dav/${ctx.params.user}</d:href>`
              },
              {
                name: 'card:addressbook-home-set',
                value: `<d:href>/dav/${ctx.params.user}/addressbooks</d:href>`
              }
            ],
            status: '200 OK'
          }
        ]
      }
    ];

    const xml = xmlHelpers.getMultistatusXML(responses);

    ctx.type = 'application/xml';
    ctx.status = 207;
    ctx.body = xml;
  } catch (err) {
    ctx.logger.error(err);
    throw new TypeError('Error processing PROPFIND request');
  }
});

davRouter.all('/:user/addressbooks', async (ctx) => {
  if (ctx.params.user !== ctx.state.session.username) throw Boom.unauthorized();
  if (ctx.method !== 'PROPFIND') throw Boom.methodNotAllowed();

  try {
    const depth = ctx.request.headers.depth || '0';

    // Parse XML request body
    // const xmlBody = ctx.request.body
    //   ? await xmlHelpers.parseXML(ctx.request.body.toString())
    //   : null;
    // const props = xmlHelpers.extractRequestedProps(xmlBody);

    // Create response
    const responses = [
      {
        href: `/dav/${ctx.params.user}/addressbooks`,
        propstat: [
          {
            props: [
              { name: 'd:displayname', value: 'Address Books' },
              { name: 'd:resourcetype', value: '<d:collection/>' }
            ],
            status: '200 OK'
          }
        ]
      }
    ];

    // If depth is 1, include address books
    if (depth === '1') {
      const addressBooks = await AddressBooks.find(
        ctx.instance,
        ctx.state.session,
        {}
      );

      for (const addressBook of addressBooks) {
        responses.push({
          href: `/dav/${ctx.params.user}/addressbooks/${addressBook.address_book_id}`,
          propstat: [
            {
              props: [
                { name: 'd:displayname', value: addressBook.name },
                {
                  name: 'd:resourcetype',
                  value: '<d:collection/><card:addressbook/>'
                },
                { name: 'd:sync-token', value: addressBook.synctoken },
                {
                  name: 'card:addressbook-description',
                  value: addressBook.description || ''
                }
              ],
              status: '200 OK'
            }
          ]
        });
      }
    }

    const xml = xmlHelpers.getMultistatusXML(responses);

    ctx.type = 'application/xml';
    ctx.status = 207;
    ctx.body = xml;
  } catch (err) {
    ctx.logger.error(err);
    throw new TypeError('Error processing PROPFIND request');
  }
});

// eslint-disable-next-line complexity
davRouter.all('/:user/addressbooks/:addressbook', async (ctx) => {
  if (ctx.params.user !== ctx.state.session.username) throw Boom.unauthorized();
  if (!['PROPFIND', 'MKCOL', 'DELETE', 'REPORT'].includes(ctx.method))
    throw Boom.methodNotAllowed();

  const { addressbook } = ctx.params;

  // Find address book for methods that require it
  let addressBook;
  if (ctx.method !== 'MKCOL') {
    addressBook = await AddressBooks.findOne(ctx.instance, ctx.state.session, {
      address_book_id: addressbook
    });

    if (!addressBook)
      throw Boom.notFound(ctx.translateError('ADDRESS_BOOK_DOES_NOT_EXIST'));
  }

  // Handle different methods
  switch (ctx.method) {
    case 'PROPFIND': {
      const depth = ctx.request.headers.depth || '0';

      // Parse XML request body
      // const xmlBody = ctx.request.body
      //   ? await xmlHelpers.parseXML(ctx.request.body.toString())
      //   : null;
      // const props = xmlHelpers.extractRequestedProps(xmlBody);

      // Create response for address book
      const responses = [
        {
          href: `/dav/${ctx.params.user}/addressbooks/${addressbook}`,
          propstat: [
            {
              props: [
                { name: 'd:displayname', value: addressBook.name },
                {
                  name: 'd:resourcetype',
                  value: '<d:collection/><card:addressbook/>'
                },
                { name: 'd:sync-token', value: addressBook.synctoken },
                {
                  name: 'card:addressbook-description',
                  value: addressBook.description || ''
                },
                {
                  name: 'card:supported-address-data',
                  value:
                    '<card:address-data-type content-type="text/vcard" version="3.0"/>'
                }
              ],
              status: '200 OK'
            }
          ]
        }
      ];

      // If depth is 1, include contacts
      if (depth === '1') {
        const contacts = await Contacts.find(ctx.instance, ctx.state.session, {
          address_book: addressBook._id
        });

        for (const contact of contacts) {
          responses.push({
            href: `/dav/${ctx.params.user}/addressbooks/${addressbook}/${contact.contact_id}`,
            propstat: [
              {
                props: [
                  { name: 'd:getetag', value: contact.etag },
                  {
                    name: 'd:getcontenttype',
                    value: 'text/vcard; charset=utf-8'
                  },
                  { name: 'd:resourcetype', value: '' }
                ],
                status: '200 OK'
              }
            ]
          });
        }
      }

      const xml = xmlHelpers.getMultistatusXML(responses);

      ctx.type = 'application/xml';
      ctx.status = 207;
      ctx.body = xml;
      break;
    }

    case 'MKCOL': {
      // Check if address book already exists
      const existingAddressBook = await AddressBooks.findOne(
        ctx.instance,
        ctx.state.session,
        {
          address_book_id: addressbook
        }
      );

      if (existingAddressBook)
        throw Boom.conflict(ctx.translateError('ADDRES_BOOK_ALREADY_EXISTS'));

      console.log('ctx.request.headers', ctx.request.headers);
      console.log('ctx.request.body', ctx.request.body);

      // Parse XML request body
      const xmlBody = ctx.request.body
        ? await xmlHelpers.parseXML(ctx.request.body.toString())
        : null;

      // Extract properties
      let displayName = addressbook;
      let description = '';

      if (
        xmlBody &&
        xmlBody['d:mkcol'] &&
        xmlBody['d:mkcol']['d:set'] &&
        xmlBody['d:mkcol']['d:set']['d:prop']
      ) {
        const props = xmlBody['d:mkcol']['d:set']['d:prop'];

        if (props['d:displayname']) {
          displayName = props['d:displayname'];
        }

        if (props['card:addressbook-description']) {
          description = props['card:addressbook-description'];
        }
      }

      // Create new address book
      await AddressBooks.create({
        // db virtual helper
        instance: ctx.instance,
        session: ctx.state.session,

        address_book_id: addressbook,
        name: displayName,
        description,
        color: '#0000FF', // Default color
        synctoken: `${config.urls.web}/ns/sync-token/1`,
        timezone: ctx.state.session.user.timezone || 'UTC',
        // TODO: fix port if 443 or 80 then don't render it (?)
        url: `${ctx.instance.config.protocol}://${ctx.instance.config.host}:${ctx.instance.config.port}/dav/${ctx.params.user}/addressbooks/${addressbook}`,
        prodId: `//forwardemail.net//carddav//EN`
      });

      ctx.status = 201;
      break;
    }

    case 'DELETE': {
      // Delete all contacts in the address book
      await Contacts.deleteMany(ctx.instance, ctx.state.session, {
        address_book: addressBook._id
      });

      // Delete address book
      await addressBook.remove();

      ctx.status = 204;
      break;
    }

    case 'REPORT': {
      // Parse XML request body
      const xmlBody = ctx.request.body
        ? await xmlHelpers.parseXML(ctx.request.body.toString())
        : null;

      if (!xmlBody)
        throw Boom.badRequest(ctx.translateError('INVALID_XML_REQUEST_BODY'));

      // Handle different report types
      if (xmlBody['card:addressbook-query']) {
        await handleAddressbookQuery(ctx, xmlBody, addressBook);
      } else if (xmlBody['card:addressbook-multiget']) {
        await handleAddressbookMultiget(ctx, xmlBody, addressBook);
      } else if (xmlBody['d:sync-collection']) {
        await handleSyncCollection(ctx, xmlBody, addressBook);
      } else {
        throw Boom.badRequest(ctx.translateError('UNSUPPORTED_REPORT_TYPE'));
      }

      break;
    }

    default: {
      throw Boom.methodNotAllowed();
    }
  }
});

// eslint-disable-next-line complexity
davRouter.all('/:user/addressbooks/:addressbook/:contact', async (ctx) => {
  if (ctx.params.user !== ctx.state.session.username) throw Boom.unauthorized();
  if (!['PROPFIND', 'GET', 'PUT', 'DELETE'].includes(ctx.method))
    throw Boom.methodNotAllowed();

  const { addressbook, contact } = ctx.params;

  // Find address book
  const addressBook = await AddressBooks.findOne(
    ctx.instance,
    ctx.state.session,
    {
      address_book_id: addressbook
    }
  );

  if (!addressBook)
    throw Boom.notFound(ctx.translateError('ADDRESS_BOOK_DOES_NOT_EXIST'));

  switch (ctx.method) {
    case 'PROPFIND': {
      // Find contact
      const contactObj = await Contacts.findOne(
        ctx.instance,
        ctx.state.session,
        {
          address_book: addressBook._id,
          contact_id: contact
        }
      );

      if (!contactObj)
        throw Boom.notFound(ctx.translateError('CONTACT_DOES_NOT_EXIST'));

      // Parse XML request body
      const xmlBody = ctx.request.body
        ? await xmlHelpers.parseXML(ctx.request.body.toString())
        : null;
      const props = xmlHelpers.extractRequestedProps(xmlBody);

      // Create response
      const xml = xmlHelpers.getPropfindContactXML(
        {
          href: `/dav/${ctx.params.user}/addressbooks/${addressbook}/${contact}`,
          etag: contactObj.etag,
          content: contactObj.content
        },
        props
      );

      ctx.type = 'application/xml';
      ctx.status = 207;
      ctx.body = xml;
      break;
    }

    case 'GET': {
      // Find contact
      const contactObj = await Contacts.findOne(
        ctx.instance,
        ctx.state.session,
        {
          address_book: addressBook._id,
          contact_id: contact
        }
      );

      if (!contactObj)
        throw Boom.notFound(ctx.translateError('CONTACT_DOES_NOT_EXIST'));

      ctx.type = 'text/vcard; charset=utf-8';
      ctx.set('ETag', contactObj.etag);
      ctx.status = 200;
      ctx.body = contactObj.content;
      break;
    }

    case 'PUT': {
      // Check if address book is read-only
      if (addressBook.readonly)
        throw Boom.forbidden(ctx.translateError('ADDRESS_BOOK_READONLY'));

      // Get vCard content
      const vCardContent = ctx.request.body.toString();

      // Parse vCard to extract properties
      const vCard = xmlHelpers.parseVCard(vCardContent);

      // Check if contact already exists
      const existingContact = await Contacts.findOne(
        ctx.instance,
        ctx.state.session,
        {
          address_book: addressBook._id,
          contact_id: contact
        }
      );

      // Generate ETag
      const newEtag = xmlHelpers.generateETag(vCardContent);

      if (existingContact) {
        // Check If-Match header if present
        const ifMatch = ctx.request.headers['if-match'];
        if (ifMatch && ifMatch !== existingContact.etag)
          throw Boom.preconditionFailed(
            ctx.translateError('ETAG_DOES_NOT_MATCH')
          );

        // Update existing contact
        existingContact.content = vCardContent;
        existingContact.etag = newEtag;
        existingContact.fullName = vCard.FN || '';

        // Update other extracted fields as needed
        if (vCard.EMAIL) {
          existingContact.emails = Array.isArray(vCard.EMAIL)
            ? vCard.EMAIL.map((email) => ({ value: email, type: 'INTERNET' }))
            : [{ value: vCard.EMAIL, type: 'INTERNET' }];
        }

        if (vCard.TEL) {
          existingContact.phoneNumbers = Array.isArray(vCard.TEL)
            ? vCard.TEL.map((tel) => ({ value: tel, type: 'CELL' }))
            : [{ value: vCard.TEL, type: 'CELL' }];
        }

        await existingContact.save();

        // Update address book sync token
        addressBook.synctoken = `${
          config.urls.web
        }/ns/sync-token/${Date.now()}`;
        await addressBook.save();

        ctx.set('ETag', newEtag);
        ctx.status = 204;
      } else {
        // Create new contact
        await Contacts.create({
          // db virtual helper
          instance: ctx.instance,
          session: ctx.state.session,

          address_book: addressBook._id,
          contact_id: contact,
          uid: vCard.UID || randomUUID(),
          content: vCardContent,
          etag: newEtag,
          fullName: vCard.FN || '',
          isGroup: vCard.KIND === 'group',
          emails: vCard.EMAIL
            ? Array.isArray(vCard.EMAIL)
              ? vCard.EMAIL.map((email) => ({
                  value: email,
                  type: 'INTERNET'
                }))
              : [{ value: vCard.EMAIL, type: 'INTERNET' }]
            : [],
          phoneNumbers: vCard.TEL
            ? Array.isArray(vCard.TEL)
              ? vCard.TEL.map((tel) => ({ value: tel, type: 'CELL' }))
              : [{ value: vCard.TEL, type: 'CELL' }]
            : []
        });

        // Update address book sync token
        addressBook.synctoken = `${
          config.urls.web
        }/ns/sync-token/${Date.now()}`;
        await addressBook.save();

        ctx.set('ETag', newEtag);
        ctx.status = 201;
      }

      break;
    }

    case 'DELETE': {
      // Check if address book is read-only
      if (addressBook.readonly)
        throw Boom.forbidden(ctx.translateError('ADDRESS_BOOK_READONLY'));

      // Find contact
      const contactObj = await Contacts.findOne(
        ctx.instance,
        ctx.state.session,
        {
          address_book: addressBook._id,
          contact_id: contact
        }
      );

      if (!contactObj)
        throw Boom.notFound(ctx.translateError('CONTACT_DOES_NOT_EXIST'));

      // Check If-Match header if present
      const ifMatch = ctx.request.headers['if-match'];
      if (ifMatch && ifMatch !== contactObj.etag)
        throw Boom.preconditionFailed(
          ctx.translateError('ETAG_DOES_NOT_MATCH')
        );

      // Delete contact
      await contactObj.remove();

      // Update address book sync token
      addressBook.synctoken = `${config.urls.web}/ns/sync-token/${Date.now()}`;
      await addressBook.save();

      ctx.status = 204;
      break;
    }

    default: {
      throw Boom.methodNotAllowed();
    }
  }
});

// Helper functions for REPORT handling
async function handleAddressbookQuery(ctx, xmlBody, addressBook) {
  const { addressbook } = ctx.params;

  // Extract props
  const props = [];
  if (xmlBody['card:addressbook-query']['d:prop']) {
    for (const key of Object.keys(
      xmlBody['card:addressbook-query']['d:prop']
    )) {
      props.push(key);
    }
  }

  // Extract filters
  let filter = {};
  if (xmlBody['card:addressbook-query']['card:filter']) {
    filter = xmlBody['card:addressbook-query']['card:filter'];
  }

  // Query contacts based on filter
  const query = {
    address_book: addressBook._id
  };

  // Apply filters if present
  if (filter['card:prop-filter']) {
    const propFilter = filter['card:prop-filter'];
    if (propFilter.name === 'FN' && propFilter['card:text-match']) {
      const textMatch = propFilter['card:text-match'];
      const searchText = textMatch._;
      query.fullName = { $regex: searchText, $options: 'i' };
    }
  }

  const contacts = await Contacts.find(query);

  // Format contacts for response
  const formattedContacts = contacts.map((contact) => ({
    href: `/dav/${ctx.params.user}/addressbooks/${addressbook}/${contact.contact_id}`,
    etag: contact.etag,
    vcard: contact.content
  }));

  // Generate XML response
  const xml = xmlHelpers.getAddressbookQueryXML(formattedContacts, props);

  ctx.type = 'application/xml';
  ctx.status = 207;
  ctx.body = xml;
}

async function handleAddressbookMultiget(ctx, xmlBody, addressBook) {
  const { addressbook } = ctx.params;

  // Extract props
  const props = [];
  if (xmlBody['card:addressbook-multiget']['d:prop']) {
    for (const key of Object.keys(
      xmlBody['card:addressbook-multiget']['d:prop']
    )) {
      props.push(key);
    }
  }

  // Extract hrefs
  const hrefs = [];
  if (xmlBody['card:addressbook-multiget']['d:href']) {
    if (Array.isArray(xmlBody['card:addressbook-multiget']['d:href'])) {
      hrefs.push(...xmlBody['card:addressbook-multiget']['d:href']);
    } else {
      hrefs.push(xmlBody['card:addressbook-multiget']['d:href']);
    }
  }

  // Get contact IDs from hrefs
  const contactIds = hrefs.map((href) => {
    const parts = href.split('/');
    return parts[parts.length - 1];
  });

  // Fetch contacts
  const contacts = await Contacts.find({
    address_book: addressBook._id,
    contact_id: { $in: contactIds }
  });

  // Format contacts for response
  const formattedContacts = contacts.map((contact) => ({
    href: `/dav/${ctx.params.user}/addressbooks/${addressbook}/${contact.contact_id}`,
    etag: contact.etag,
    vcard: contact.content
  }));

  // Generate XML response
  const xml = xmlHelpers.getAddressbookQueryXML(formattedContacts, props);

  ctx.type = 'application/xml';
  ctx.status = 207;
  ctx.body = xml;
}

async function handleSyncCollection(ctx, xmlBody, addressBook) {
  const { addressbook } = ctx.params;

  // Extract sync token
  let syncToken = null;
  if (xmlBody['d:sync-collection']['d:sync-token']) {
    syncToken = xmlBody['d:sync-collection']['d:sync-token'];
  }

  // Extract props
  const props = [];
  if (xmlBody['d:sync-collection']['d:prop']) {
    for (const key of Object.keys(xmlBody['d:sync-collection']['d:prop'])) {
      props.push(key);
    }
  }

  // Get changes since sync token
  let changes = [];

  if (syncToken) {
    // TODO: Implement proper sync token handling
    // For now, just return all contacts
    const contacts = await Contacts.find({
      address_book: addressBook._id
    });

    changes = contacts.map((contact) => ({
      href: `/dav/${ctx.params.user}/addressbooks/${addressbook}/${contact.contact_id}`,
      etag: contact.etag,
      vcard: contact.content,
      deleted: false
    }));
  } else {
    // If no sync token, return all contacts
    const contacts = await Contacts.find({
      address_book: addressBook._id
    });

    changes = contacts.map((contact) => ({
      href: `/dav/${ctx.params.user}/addressbooks/${addressbook}/${contact.contact_id}`,
      etag: contact.etag,
      vcard: contact.content,
      deleted: false
    }));
  }

  // Generate XML response
  const xml = xmlHelpers.getSyncCollectionXML(addressBook, changes, props);

  ctx.type = 'application/xml';
  ctx.status = 207;
  ctx.body = xml;
}

router.use(davRouter.routes());

module.exports = router;
