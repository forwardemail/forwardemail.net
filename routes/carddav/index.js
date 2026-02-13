/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { randomUUID } = require('node:crypto');
const Boom = require('@hapi/boom');
const Router = require('@koa/router');
const basicAuth = require('basic-auth');

const AddressBooks = require('#models/address-books');
const CardDAVFilterParser = require('#helpers/carddav-filter-parser');
const Contacts = require('#models/contacts');
const config = require('#config');
const ensureDefaultAddressBook = require('#helpers/ensure-default-address-book');
const sendApnContacts = require('#helpers/send-apn-contacts');
const sendWebSocketNotification = require('#helpers/send-websocket-notification');
const setupAuthSession = require('#helpers/setup-auth-session');
const xmlHelpers = require('#helpers/carddav-xml');

const { encodeXMLEntities } = xmlHelpers;

// TODO: PROPPATCH

function vcf(id) {
  if (id.toLowerCase().endsWith('.vcf')) return '';
  return '.vcf';
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

router.all('(.*)', async (ctx, next) => {
  // if request is authenticated then redirect to principal
  const creds = basicAuth(ctx);
  if (creds) {
    try {
      ctx.logger.debug('authenticate', {
        username: creds.name
      });
      await setupAuthSession.call(ctx.instance, ctx, creds.name, creds.pass);
    } catch (err) {
      ctx.response.set(
        'WWW-Authenticate',
        'Basic realm="forwardemail/carddav"'
      );
      throw err;
    }

    await ensureDefaultAddressBook.call(ctx.instance, ctx);

    // Handle .well-known/carddav redirect (RFC 6764)
    if (ctx.url.toLowerCase() === '/.well-known/carddav')
      return ctx.redirect(`/dav/${ctx.state.session.user.username}/`);

    return next();
  }

  // Handle .well-known/carddav redirect (RFC 6764)
  if (ctx.url.toLowerCase() === '/.well-known/carddav')
    return ctx.redirect('/dav/');

  ctx.response.set('WWW-Authenticate', 'Basic realm="forwardemail/carddav"');
  throw Boom.unauthorized();
});

const davRouter = new Router({
  prefix: '/dav'
});

davRouter.all('/:user/addressbooks/:addressbook/:contact(.+)', async (ctx) => {
  if (!['PROPFIND', 'GET', 'PUT', 'DELETE'].includes(ctx.method))
    throw Boom.methodNotAllowed();

  const { addressbook, contact: rawContact } = ctx.params;

  // Normalize contact_id by removing .vcf extension if present
  // macOS and other clients may or may not include the extension
  const contact = rawContact.replace(/\.vcf$/i, '');

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

  // db virtual helper
  addressBook.instance = ctx.instance;
  addressBook.session = ctx.state.session;

  // so we can call `save()`
  addressBook.isNew = false;

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

      // Return 404 for non-existent or soft-deleted contacts
      if (!contactObj || contactObj.deleted_at)
        throw Boom.notFound(ctx.translateError('CONTACT_DOES_NOT_EXIST'));

      // Parse XML request body
      const xmlBody = ctx.request.body
        ? await xmlHelpers.parseXML(ctx.request.body.toString())
        : null;
      const props = xmlHelpers.extractRequestedProps(xmlBody);

      // Create response - include .vcf extension for client compatibility
      const xml = xmlHelpers.getPropfindContactXML(
        {
          href: `/dav/${
            ctx.params.user
          }/addressbooks/${addressbook}/${contact}${vcf(contact)}`,
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

      // Return 404 for non-existent or soft-deleted contacts
      if (!contactObj || contactObj.deleted_at)
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

      // Parse vCard to extract properties (this also validates the vCard)
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

      // Check If-None-Match header (RFC 2616 Section 14.26)
      const ifNoneMatch = ctx.request.headers['if-none-match'];
      if (ifNoneMatch === '*' && existingContact) {
        throw Boom.preconditionFailed(
          ctx.translateError('CONTACT_ALREADY_EXISTS')
        );
      }

      // Generate ETag
      const newEtag = xmlHelpers.generateETag(vCardContent);

      if (existingContact) {
        // Check If-Match header if present
        // Per RFC 7232, ETags should be quoted, but some clients may send
        // unquoted values. We normalize both for comparison.
        const ifMatch = ctx.request.headers['if-match'];
        if (ifMatch) {
          // Normalize ETags by removing surrounding quotes for comparison
          const normalizeEtag = (etag) => {
            if (!etag) return '';
            // Remove surrounding quotes if present
            return etag.replace(/^"|"$/g, '');
          };

          const normalizedIfMatch = normalizeEtag(ifMatch);
          const normalizedStoredEtag = normalizeEtag(existingContact.etag);

          if (normalizedIfMatch !== normalizedStoredEtag) {
            throw Boom.preconditionFailed(
              ctx.translateError('ETAG_DOES_NOT_MATCH')
            );
          }
        }

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

        // db virtual helper
        existingContact.instance = ctx.instance;
        existingContact.session = ctx.state.session;

        // so we can call `save()`
        existingContact.isNew = false;

        await existingContact.save();

        // Update address book sync token
        addressBook.synctoken = `${
          config.urls.web
        }/ns/sync-token/${Date.now()}`;

        await addressBook.save();

        // send apple push notification for contacts sync
        sendApnContacts(ctx.instance.client, ctx.state.user.alias_id)
          .then()
          .catch((err) => ctx.logger.fatal(err));

        // send websocket push notification
        sendWebSocketNotification(
          ctx.instance.client,
          ctx.state.user.alias_id,
          'contactUpdated',
          {
            contact: {
              id: existingContact._id.toString(),
              contactId: contact,
              addressBookId: addressBook._id.toString(),
              fullName: existingContact.fullName || '',
              content: vCardContent,
              etag: newEtag,
              object: 'contact'
            }
          }
        );

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

        // send apple push notification for contacts sync
        sendApnContacts(ctx.instance.client, ctx.state.user.alias_id)
          .then()
          .catch((err) => ctx.logger.fatal(err));

        // send websocket push notification
        sendWebSocketNotification(
          ctx.instance.client,
          ctx.state.user.alias_id,
          'contactCreated',
          {
            contact: {
              contactId: contact,
              addressBookId: addressBook._id.toString(),
              fullName: vCard.FN || '',
              content: vCardContent,
              etag: newEtag,
              object: 'contact'
            }
          }
        );

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
      // Per RFC 7232, ETags should be quoted, but some clients may send
      // unquoted values. We normalize both for comparison.
      const ifMatch = ctx.request.headers['if-match'];
      if (ifMatch) {
        // Normalize ETags by removing surrounding quotes for comparison
        const normalizeEtag = (etag) => {
          if (!etag) return '';
          // Remove surrounding quotes if present
          return etag.replace(/^"|"$/g, '');
        };

        const normalizedIfMatch = normalizeEtag(ifMatch);
        const normalizedStoredEtag = normalizeEtag(contactObj.etag);

        if (normalizedIfMatch !== normalizedStoredEtag) {
          throw Boom.preconditionFailed(
            ctx.translateError('ETAG_DOES_NOT_MATCH')
          );
        }
      }

      // Soft delete contact for sync-collection (RFC 6578)
      // Instead of hard delete, set deleted_at so sync-collection
      // can report the deletion to clients with 404 status
      // Also update updated_at so the contact appears in sync queries
      const now = new Date();
      await Contacts.findByIdAndUpdate(
        ctx.instance,
        ctx.state.session,
        contactObj._id,
        {
          $set: {
            deleted_at: now,
            updated_at: now
          }
        }
      );

      // Update address book sync token
      addressBook.synctoken = `${config.urls.web}/ns/sync-token/${Date.now()}`;
      await addressBook.save();

      // send apple push notification for contacts sync
      sendApnContacts(ctx.instance.client, ctx.state.user.alias_id)
        .then()
        .catch((err) => ctx.logger.fatal(err));

      // send websocket push notification
      sendWebSocketNotification(
        ctx.instance.client,
        ctx.state.user.alias_id,
        'contactDeleted',
        {
          contact: {
            id: contactObj._id.toString(),
            contactId: contact,
            addressBookId: addressBook._id.toString(),
            fullName: contactObj.fullName || '',
            content: contactObj.content || '',
            object: 'contact'
          }
        }
      );

      ctx.status = 204;
      break;
    }

    default: {
      throw Boom.methodNotAllowed();
    }
  }
});

davRouter.all('/:user/addressbooks/:addressbook', async (ctx) => {
  if (
    !['PROPFIND', 'MKCOL', 'DELETE', 'REPORT', 'PROPPATCH'].includes(ctx.method)
  )
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
          href: `/dav/${ctx.params.user}/addressbooks/${addressbook}/`,
          propstat: [
            {
              props: [
                {
                  name: 'd:displayname',
                  value: encodeXMLEntities(addressBook.name)
                },
                {
                  name: 'd:resourcetype',
                  value: '<d:collection/><card:addressbook/>'
                },
                { name: 'd:sync-token', value: addressBook.synctoken },
                // getctag is used by some clients (iOS, macOS) to detect changes
                // It should match the sync-token for consistency
                { name: 'cs:getctag', value: addressBook.synctoken },
                {
                  name: 'card:addressbook-description',
                  value: encodeXMLEntities(addressBook.description || '')
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
        const allContacts = await Contacts.find(
          ctx.instance,
          ctx.state.session,
          {
            address_book: addressBook._id
          }
        );

        // Filter out soft-deleted contacts
        const contacts = allContacts.filter((c) => !c.deleted_at);

        for (const contact of contacts) {
          responses.push({
            href: `/dav/${ctx.params.user}/addressbooks/${addressbook}/${
              contact.contact_id
            }${vcf(contact.contact_id)}`,
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
        throw Boom.conflict(ctx.translateError('ADDRESS_BOOK_ALREADY_EXISTS'));

      // Parse XML request body
      const xmlBody = ctx.request.body
        ? await xmlHelpers.parseXML(ctx.request.body.toString())
        : null;

      // Extract properties
      let displayName = addressbook;
      let description = '';

      if (
        xmlBody &&
        xmlBody.mkcol &&
        xmlBody.mkcol.set &&
        xmlBody.mkcol.set.prop
      ) {
        const props = xmlBody.mkcol.set.prop;

        if (props.displayname) {
          displayName = props.displayname;
        }

        if (props['addressbook-description']) {
          description = props['addressbook-description'];
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
        url: `${ctx.instance.config.protocol}://${ctx.instance.config.host}:${ctx.instance.config.port}/dav/${ctx.params.user}/addressbooks/${addressbook}/`,
        prodId: `//forwardemail.net//carddav//EN`
      });

      // send websocket push notification
      sendWebSocketNotification(
        ctx.instance.client,
        ctx.state.user.alias_id,
        'addressBookCreated',
        {
          addressBook: {
            addressBookId: addressbook,
            name: displayName,
            object: 'address_book'
          }
        }
      );

      ctx.status = 201;
      break;
    }

    case 'DELETE': {
      // Delete all contacts in the address book
      await Contacts.deleteMany(ctx.instance, ctx.state.session, {
        address_book: addressBook._id
      });

      // Delete address book
      await AddressBooks.deleteOne(ctx.instance, ctx.state.session, {
        _id: addressBook._id
      });
      // TODO: define $__remove in sqlite helper
      // await addressBook.remove();

      // send websocket push notification
      sendWebSocketNotification(
        ctx.instance.client,
        ctx.state.user.alias_id,
        'addressBookDeleted',
        {
          addressBook: {
            id: addressBook._id.toString(),
            addressBookId: addressbook,
            name: addressBook.name || '',
            object: 'address_book'
          }
        }
      );

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

      // const props = xmlHelpers.extractRequestedProps(xmlBody);

      // Handle different report types
      if (xmlBody['addressbook-query']) {
        await handleAddressbookQuery(ctx, xmlBody, addressBook);
      } else if (xmlBody['addressbook-multiget']) {
        await handleAddressbookMultiget(ctx, xmlBody, addressBook);
      } else if (xmlBody['sync-collection']) {
        await handleSyncCollection(ctx, xmlBody, addressBook);
      } else {
        const err = Boom.badRequest(
          ctx.translateError('UNSUPPORTED_REPORT_TYPE')
        );
        err.xmlBody = xmlBody;
        err.requestBody = ctx.request.body;
        throw err;
      }

      break;
    }

    case 'PROPPATCH': {
      // Parse XML request body
      const xmlBody = ctx.request.body
        ? await xmlHelpers.parseXML(ctx.request.body.toString())
        : null;

      if (!xmlBody || !xmlBody.propertyupdate)
        throw Boom.badRequest(ctx.translateError('INVALID_XML_REQUEST_BODY'));

      // db virtual helper
      addressBook.instance = ctx.instance;
      addressBook.session = ctx.state.session;
      addressBook.isNew = false;

      // Track which properties were successfully updated
      const updatedProps = [];
      const failedProps = [];

      // Handle set operations
      if (xmlBody.propertyupdate.set) {
        const setOperations = Array.isArray(xmlBody.propertyupdate.set)
          ? xmlBody.propertyupdate.set
          : [xmlBody.propertyupdate.set];

        for (const setOp of setOperations) {
          if (!setOp.prop) continue;

          const props = setOp.prop;

          // Update displayname
          if (props.displayname) {
            addressBook.name = props.displayname;
            updatedProps.push('displayname');
          }

          // Update addressbook-description
          if (props['addressbook-description']) {
            addressBook.description = props['addressbook-description'];
            updatedProps.push('addressbook-description');
          }

          // Update color (if provided)
          if (props['calendar-color'] || props.color) {
            addressBook.color = props['calendar-color'] || props.color;
            updatedProps.push('calendar-color');
          }
        }
      }

      // Handle remove operations
      if (xmlBody.propertyupdate.remove) {
        const removeOperations = Array.isArray(xmlBody.propertyupdate.remove)
          ? xmlBody.propertyupdate.remove
          : [xmlBody.propertyupdate.remove];

        for (const removeOp of removeOperations) {
          if (!removeOp.prop) continue;

          const props = removeOp.prop;

          // Remove description
          if (props['addressbook-description']) {
            addressBook.description = '';
            updatedProps.push('addressbook-description');
          }
        }
      }

      // Save changes
      if (updatedProps.length > 0) {
        await addressBook.save();

        // Update sync token
        addressBook.synctoken = `${
          config.urls.web
        }/ns/sync-token/${Date.now()}`;
        await addressBook.save();
      }

      // Build response
      const responses = [
        {
          href: `/dav/${ctx.params.user}/addressbooks/${addressbook}/`,
          propstat: []
        }
      ];

      // Add success propstat if there are updated props
      if (updatedProps.length > 0) {
        responses[0].propstat.push({
          props: updatedProps.map((name) => ({ name, value: '' })),
          status: '200 OK'
        });
      }

      // Add failed propstat if there are failed props
      if (failedProps.length > 0) {
        responses[0].propstat.push({
          props: failedProps.map((name) => ({ name, value: '' })),
          status: '403 Forbidden'
        });
      }

      const xml = xmlHelpers.getMultistatusXML(responses);

      ctx.type = 'application/xml';
      ctx.status = 207;
      ctx.body = xml;
      break;
    }

    default: {
      throw Boom.methodNotAllowed();
    }
  }
});

davRouter.all('/:user/addressbooks', async (ctx) => {
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
        href: `/dav/${ctx.params.user}/addressbooks/`,
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
          href: `/dav/${ctx.params.user}/addressbooks/${addressBook.address_book_id}/`,
          propstat: [
            {
              props: [
                {
                  name: 'd:displayname',
                  value: encodeXMLEntities(addressBook.name)
                },
                {
                  name: 'd:resourcetype',
                  value: '<d:collection/><card:addressbook/>'
                },
                { name: 'd:sync-token', value: addressBook.synctoken },
                {
                  name: 'card:addressbook-description',
                  value: encodeXMLEntities(addressBook.description || '')
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

// Helper functions for REPORT handling
//
// # CardDAV `addressbook-query` Filters and Testing with `tsdav`
//
// To ensure a CardDAV server complies with [RFC 6352](https://tools.ietf.org/html/rfc6352), it must support the `addressbook-query` REPORT for querying address book data, including all specified filters and their combinations. The `tsdav` package, a TypeScript/JavaScript library for WebDAV and CardDAV, provides a convenient way to test these queries using the `addressBookQuery` method. This document outlines the complete set of standard `addressbook-query` filters, provides example XML bodies, and shows how to structure them as arguments for `tsdav`'s `addressBookQuery`. It also includes considerations for testing server compliance.
//
// ## Overview of `addressbook-query` Filters
//
// Per RFC 6352, Section 8.6, a CardDAV server must support the `addressbook-query` REPORT with these filter elements:
//
// - **`<C:prop-filter>`**: Filters vCard objects based on a specific vCard property (e.g., `FN`, `EMAIL`, `TEL`).
// - **`<C:param-filter>`**: Filters based on parameters of a property (e.g., `TYPE=WORK` for an `EMAIL` property).
// - **`<C:text-match>`**: Matches text values in properties, with attributes:
//   - `collation`: At least `i;ascii-casemap` (case-insensitive) must be supported; `i;unicode-casemap` is optional.
//   - `match-type`: Supports `equals`, `contains`, `starts-with`, `ends-with`.
//   - `negate-condition`: Optional boolean (`yes` or `no`) to invert the match.
// - **`<C:is-not-defined>`**: Matches vCards where a property or parameter is absent.
// - **`<C:filter test="anyof|allof">`**: Combines multiple `<C:prop-filter>` elements logically:
//   - `anyof`: At least one condition must match.
//   - `allof`: All conditions must match.
// - **`<D:prop>`**: Specifies which properties to return (e.g., `D:getetag`, `C:address-data`).
// - **`<C:address-data>`**: Optionally limits the vCard properties returned (e.g., only `FN` and `EMAIL`).
//
// A CardDAV server must handle these filters for common vCard properties (e.g., `FN`, `N`, `EMAIL`, `TEL`, `ADR`, `ORG`) and their parameters (e.g., `TYPE`, `VALUE`). It should also support returning partial vCard data and handle edge cases like empty results or invalid filters.
//
// ## Using `tsdav` for Testing
//
// The `tsdav` package provides a `DAVClient` with an `addressBookQuery` method to send `addressbook-query` REPORT requests. The method takes an options object with these relevant properties:
//
// - `url`: The URL of the address book collection.
// - `properties`: An array of WebDAV properties to retrieve (e.g., `['{DAV:}getetag', '{urn:ietf:params:xml:ns:carddav}address-data']`).
// - `filters`: An array of filter objects defining the query criteria.
// - `headers`: Optional headers for authentication or other purposes.
// - `depth`: Typically `1` for querying resources in the collection.
//
// The `filters` array corresponds to the `<C:filter>` element and can include nested `<C:prop-filter>`, `<C:param-filter>`, `<C:text-match>`, and `<C:is-not-defined>` elements. Below are examples of all supported filter combinations and their `tsdav` equivalents.
//
// ## Example Queries and `tsdav` Calls
//
// Below are examples of all standard `addressbook-query` filters that a CardDAV server should support, along with their XML representations and corresponding `tsdav` `addressBookQuery` calls. These cover all required filter types and combinations, suitable for testing server compliance.
//
// ### 1. Simple `prop-filter` with `text-match`
//
// **Purpose**: Search for contacts where the `FN` (Formatted Name) property contains "John".
//
// **XML Request**:
// ```xml
// <?xml version="1.0" encoding="utf-8" ?>
// <D:addressbook-query xmlns:D="DAV:" xmlns:C="urn:ietf:params:xml:ns:carddav">
//   <D:prop>
//     <D:getetag/>
//     <C:address-data/>
//   </D:prop>
//   <C:filter>
//     <C:prop-filter name="FN">
//       <C:text-match collation="i;ascii-casemap" match-type="contains">John</C:text-match>
//     </C:prop-filter>
//   </C:filter>
// </D:addressbook-query>

/**
 * Handle addressbook query with complete RFC 6352 filter support
 * Updated to work with actual ForwardEmail Contacts model
 * @param {Object} ctx - Koa context
 * @param {Object} xmlBody - Parsed XML body
 * @param {Object} addressBook - Address book object
 * @returns {Promise<void>}
 */
async function handleAddressbookQuery(ctx, xmlBody, addressBook) {
  const { addressbook } = ctx.params;

  try {
    // Initialize the filter parser
    const filterParser = new CardDAVFilterParser();

    // Validate the filter first
    const validation = xmlHelpers.validateFilter(xmlBody);
    if (!validation.isValid) {
      ctx.type = 'application/xml';
      ctx.status = 400;
      ctx.body = xmlHelpers.getFilterErrorXML(validation.error);
      return;
    }

    // Extract requested properties
    const props = xmlHelpers.extractRequestedProps(xmlBody);

    // Parse the filter and convert to MongoDB query
    const filterQuery = filterParser.parseFilter(xmlBody);

    // Build the base query using the actual model structure
    // Note: address_book field is ObjectId reference to AddressBooks
    const query = {
      address_book: addressBook._id, // Use the ObjectId from the addressBook document
      ...filterQuery
    };

    // Log the generated query for debugging
    ctx.logger.debug('Generated MongoDB query:', { query });

    // Execute the query using the actual Contacts model
    const allContacts = await Contacts.find(
      ctx.instance,
      ctx.state.session,
      query
    );

    // Filter out soft-deleted contacts
    const contacts = allContacts.filter((c) => !c.deleted_at);

    // Format contacts for response using actual model fields
    const formattedContacts = contacts.map((contact) => ({
      href: `/dav/${ctx.params.user}/addressbooks/${addressbook}/${
        contact.contact_id
      }${vcf(contact.contact_id)}`,
      etag: contact.etag,
      vcard: contact.content, // Use 'content' field from actual model
      fullName: contact.fullName, // Available for debugging/logging
      uid: contact.uid
    }));

    // Generate XML response
    const xml = xmlHelpers.getAddressbookQueryXML(formattedContacts, props);

    ctx.type = 'application/xml';
    ctx.status = 207;
    ctx.body = xml;
  } catch (err) {
    ctx.logger.error('Error in handleAddressbookQuery:', err);
    throw new TypeError('Error processing addressbook query request');
  }
}

/**
 * Handle addressbook multiget with complete RFC 6352 filter support
 * Updated to work with actual ForwardEmail Contacts model
 * @param {Object} ctx - Koa context
 * @param {Object} xmlBody - Parsed XML body
 * @param {Object} addressBook - Address book object
 * @returns {Promise<void>}
 */
async function handleAddressbookMultiget(ctx, xmlBody, addressBook) {
  const { addressbook } = ctx.params;

  try {
    // Extract requested properties
    const props = xmlHelpers.extractRequestedProps(xmlBody);

    // Extract hrefs
    const hrefs = xmlHelpers.extractHrefs(xmlBody);

    if (!hrefs || hrefs.length === 0) {
      ctx.type = 'application/xml';
      ctx.status = 207;
      ctx.body = xmlHelpers.getMultistatusXML([]);
      return;
    }

    // Get contact IDs from hrefs - normalize by removing .vcf extension
    const contactIds = hrefs.map((href) => {
      const parts = href.split('/');
      const filename = parts[parts.length - 1];
      // Remove .vcf extension if present for consistent lookups
      return filename.replace(/\.vcf$/i, '');
    });

    // Build query for specific contacts using actual model structure
    const query = {
      address_book: addressBook._id, // Use ObjectId reference
      contact_id: { $in: contactIds } // Use contact_id field from model
    };

    // Execute the query
    const allContacts = await Contacts.find(
      ctx.instance,
      ctx.state.session,
      query
    );

    // Filter out soft-deleted contacts
    const contacts = allContacts.filter((c) => !c.deleted_at);

    // Format contacts for response
    const formattedContacts = contacts.map((contact) => ({
      href: `/dav/${ctx.params.user}/addressbooks/${addressbook}/${
        contact.contact_id
      }${vcf(contact.contact_id)}`,
      etag: contact.etag,
      vcard: contact.content, // Use 'content' field from actual model
      fullName: contact.fullName,
      uid: contact.uid
    }));

    // Generate XML response
    const xml = xmlHelpers.getAddressbookQueryXML(formattedContacts, props);

    ctx.type = 'application/xml';
    ctx.status = 207;
    ctx.body = xml;
  } catch (err) {
    ctx.logger.error('Error in handleAddressbookMultiget:', err);
    throw new TypeError('Error processing addressbook multiget request');
  }
}

async function handleSyncCollection(ctx, xmlBody, addressBook) {
  const { addressbook } = ctx.params;

  // Extract sync token - handle both string and object formats from XML parser
  let syncToken = null;
  let syncTimestamp = null;
  const rawSyncToken = xmlBody['sync-collection']['sync-token'];

  // The XML parser may return the sync-token as:
  // - A string (most common)
  // - An object with _ property containing the text content
  // - An empty string for initial sync
  // - undefined/null if not present
  if (rawSyncToken) {
    syncToken =
      typeof rawSyncToken === 'object' && rawSyncToken._
        ? rawSyncToken._
        : rawSyncToken;

    // Only parse if we have a non-empty string
    if (typeof syncToken === 'string' && syncToken.length > 0) {
      // Parse timestamp from sync token (format: http://domain.com/ns/sync-token/1234567890)
      const match = syncToken.match(/\/sync-token\/(\d+)$/);
      if (match && match[1]) {
        syncTimestamp = new Date(Number.parseInt(match[1], 10));
      }
    }
  }

  // Extract props
  const props = [];
  if (xmlBody['sync-collection'].prop) {
    for (const key of Object.keys(xmlBody['sync-collection'].prop)) {
      props.push(key);
    }
  }

  // Get changes since sync token
  const changes = [];

  if (syncTimestamp && !Number.isNaN(syncTimestamp.getTime())) {
    // Return only contacts modified after or at the sync token timestamp
    // Using $gte instead of $gt to handle edge cases where a contact
    // is modified at the exact same millisecond as the sync token
    // This ensures no updates are missed during rapid syncs
    //
    // Per RFC 6578, we need to return:
    // 1. Changed members (new or modified) - with 200 OK status and properties
    // 2. Removed members (deleted) - with 404 Not Found status only
    const allModifiedContacts = await Contacts.find(
      ctx.instance,
      ctx.state.session,
      {
        address_book: addressBook._id,
        updated_at: { $gte: syncTimestamp }
      }
    );

    // Separate non-deleted and deleted contacts
    for (const contact of allModifiedContacts) {
      if (contact.deleted_at) {
        // Deleted contact - report with 404 status per RFC 6578 Section 3.5.2
        changes.push({
          href: `/dav/${ctx.params.user}/addressbooks/${addressbook}/${
            contact.contact_id
          }${vcf(contact.contact_id)}`,
          deleted: true
        });
      } else {
        // Active contact - report with 200 status and properties
        changes.push({
          href: `/dav/${ctx.params.user}/addressbooks/${addressbook}/${
            contact.contact_id
          }${vcf(contact.contact_id)}`,
          etag: contact.etag,
          vcard: contact.content,
          deleted: false
        });
      }
    }
  } else {
    // If no sync token or invalid token, return all non-deleted contacts (initial sync)
    // Per RFC 6578 Section 3.4: "The server MUST NOT return any removed member URLs"
    // for initial synchronization
    const contacts = await Contacts.find(ctx.instance, ctx.state.session, {
      address_book: addressBook._id
    });

    // Filter out deleted contacts for initial sync
    for (const contact of contacts) {
      if (!contact.deleted_at) {
        changes.push({
          href: `/dav/${ctx.params.user}/addressbooks/${addressbook}/${
            contact.contact_id
          }${vcf(contact.contact_id)}`,
          etag: contact.etag,
          vcard: contact.content,
          deleted: false
        });
      }
    }
  }

  // Generate XML response with updated sync token
  const xml = xmlHelpers.getSyncCollectionXML(addressBook, changes, props);

  ctx.type = 'application/xml';
  ctx.status = 207;
  ctx.body = xml;
}

// PROPFIND routes
async function propFindPrincipal(ctx) {
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
        href: `/dav/${ctx.state.session.user.username}/`,
        propstat: [
          {
            props: [
              {
                name: 'd:displayname',
                value: encodeXMLEntities(ctx.state.session.user.username)
              },
              {
                name: 'd:resourcetype',
                value: '<d:collection/><d:principal/>'
              },
              {
                name: 'd:current-user-principal',
                value: `<d:href>/dav/${encodeXMLEntities(
                  ctx.state.session.user.username
                )}/</d:href>`
              },
              {
                name: 'card:addressbook-home-set',
                value: `<d:href>/dav/${encodeXMLEntities(
                  ctx.state.session.user.username
                )}/addressbooks/</d:href>`
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
}

davRouter.all('/:user', propFindPrincipal);
davRouter.all('/', propFindPrincipal);

router.use(davRouter.routes());
router.all('(.*)', propFindPrincipal);

module.exports = router;
