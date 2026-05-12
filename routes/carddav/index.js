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
const env = require('#config/env');
const davApnsSubscribe = require('#helpers/dav-apns-subscribe');
const ensureDefaultAddressBook = require('#helpers/ensure-default-address-book');
const getApnTopic = require('#helpers/get-apn-topic');
const { sendApnContacts } = require('#helpers/send-apn');
const sendWebSocketNotification = require('#helpers/send-websocket-notification');
const setupAuthSession = require('#helpers/setup-auth-session');
const xmlHelpers = require('#helpers/carddav-xml');

const { encodeXMLEntities } = xmlHelpers;

// TODO: PROPPATCH

function vcf(id) {
  if (id.toLowerCase().endsWith('.vcf')) return '';
  return '.vcf';
}

//
// Apple CalDAV/CardDAV push-discovery
// (https://github.com/apple/ccs-calendarserver/blob/master/doc/Extensions/caldav-pubsubdiscovery.txt)
//
// Builds the <cs:transport type="APSD"> body advertised in the
// <cs:push-transports> property.  iOS Contacts looks for this property on
// BOTH the addressbook-home (`/dav/<user>/addressbooks/`) AND on each
// individual addressbook collection (`/dav/<user>/addressbooks/<id>/`)
// before flipping the account from Fetch to Push in Settings -> Mail ->
// Fetch New Data.  Apple's reference ccs-calendarserver emits the same
// property on every collection that supports notifications via its
// `dynamic_property_provider` mechanism, and Cyrus IMAP exposes it on
// every DAV collection too (see imap/http_applepush.c).  Forward Email's
// CalDAV path goes through caldav-adapter which already advertises
// push-transports on both calendar-home and per-calendar; CardDAV is
// hand-rolled here so we mirror that behavior explicitly.
//
// Returns an empty string when the Apple Server Contact certificate is
// not yet primed (cold start / local CI), so callers should treat the
// property as optional and simply omit it.
//
async function buildCardDAVPushTransportsXML(ctx) {
  try {
    const topic = await getApnTopic(
      ctx.client || ctx.instance.client,
      'Contact'
    );
    if (!topic) {
      if (ctx.logger)
        ctx.logger.warn(
          'CardDAV push-transports omitted: APN Contact topic unavailable (cert not yet primed)',
          { user: ctx.params && ctx.params.user }
        );
      return '';
    }

    const subscriptionURL = env.CARDDAV_HOST
      ? `https://${env.CARDDAV_HOST}/apns`
      : '/apns';

    return (
      '<cs:transport type="APSD">' +
      `<cs:subscription-url><d:href>${encodeXMLEntities(
        subscriptionURL
      )}</d:href></cs:subscription-url>` +
      `<cs:apsbundleid>${encodeXMLEntities(topic)}</cs:apsbundleid>` +
      // <CS:env> mirrors the APNs environment of the certificate.  Forward
      // Email uses production XServer certs everywhere except local CI test
      // (where no certs are loaded and this branch isn't reached anyway).
      '<cs:env>PRODUCTION</cs:env>' +
      // <CS:refresh-interval> tells iOS how often to re-POST its token to
      // the subscription URL.  Apple's ccs-calendarserver default is 2 days
      // (172800s, see twistedcaldav/stdconfig.py SubscriptionRefreshIntervalSeconds);
      // Cyrus uses 14 days via aps_expiry.  A short value (e.g. 1 hour)
      // would multiply registration writes by ~48x without delivering any
      // additional pushes (the refresh is a liveness ping, not a delivery
      // trigger).
      '<cs:refresh-interval>172800</cs:refresh-interval>' +
      '</cs:transport>'
    );
  } catch (err) {
    if (ctx.logger)
      ctx.logger.warn('CardDAV push-transports build failed', { err });
    return '';
  }
}

//
// Mirror the CalDAV adapter's setMultistatusResponse() helper
// (caldav-adapter/common/response.js) which sets the DAV header and
// Content-Type on EVERY 207 Multi-Status response — not just OPTIONS.
//
// The CalDAV adapter calls setMultistatusResponse(ctx) before every
// PROPFIND/REPORT handler, which means every 207 carries:
//   DAV: 1, 3, calendar-access, ...
//   Content-Type: application/xml; charset="utf-8"
//
// The CardDAV server previously only set the DAV header on OPTIONS
// and used Koa's ctx.type (which produces charset=utf-8 without
// quotes).  iOS dataaccessd appears to rely on the DAV header being
// present on PROPFIND 207 responses to recognise push capability.
//
function setCardDAVMultistatusResponse(ctx) {
  ctx.status = 207;
  ctx.set('DAV', '1, 3, addressbook');

  ctx.set('Content-Type', 'application/xml; charset="utf-8"');
}

const router = new Router();

// status page crawlers often send `HEAD /` requests
router.get('/', (ctx) => {
  ctx.body = 'OK';
});

// OPTIONS route for CORS and DAV discovery
router.options('(.*)', (ctx) => {
  ctx.set('DAV', '1, 3, addressbook');
  //
  // POST is required for the Apple Push Notification subscription endpoint
  // (`/apns` and `/dav/apns`, see caldav-pubsubdiscovery.txt) which iOS
  // Contacts.app probes with an OPTIONS preflight before sending the
  // form-encoded `token=...&key=...` registration body.  Without POST in
  // the Allow header iOS dataaccessd rejects the endpoint and silently
  // never registers the device for push.  HEAD is included so generic
  // CardDAV clients (e.g. macOS AddressBook) can probe addressbook URLs
  // cheaply without falling back to GET.
  //
  ctx.set(
    'Allow',
    'OPTIONS, HEAD, GET, POST, PUT, DELETE, PROPFIND, PROPPATCH, REPORT, MKCOL'
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

    // Handle .well-known/caldav redirect (RFC 6764)
    // When DAVx5 connects to the CardDAV server, it also tries to discover
    // CalDAV via /.well-known/caldav. Redirect to the CalDAV server so
    // DAVx5 can discover both services from a single account setup.
    if (ctx.url.toLowerCase() === '/.well-known/caldav') {
      const caldavHost = env.CALDAV_HOST;
      const caldavProtocol = env.CALDAV_PROTOCOL || 'https';
      const caldavPort = env.CALDAV_PORT;
      // In production, use https://caldav.forwardemail.net without port
      // In development/test, include the port
      const portSuffix =
        caldavHost === 'localhost' || caldavHost === '127.0.0.1'
          ? `:${caldavPort}`
          : '';
      return ctx.redirect(
        `${caldavProtocol}://${caldavHost}${portSuffix}/dav/${ctx.state.session.user.username}/`
      );
    }

    return next();
  }

  // Handle .well-known/carddav redirect (RFC 6764)
  if (ctx.url.toLowerCase() === '/.well-known/carddav')
    return ctx.redirect('/dav/');

  // Handle .well-known/caldav redirect (RFC 6764)
  // Unauthenticated: redirect to CalDAV server root
  if (ctx.url.toLowerCase() === '/.well-known/caldav') {
    const caldavHost = env.CALDAV_HOST;
    const caldavProtocol = env.CALDAV_PROTOCOL || 'https';
    const caldavPort = env.CALDAV_PORT;
    const portSuffix =
      caldavHost === 'localhost' || caldavHost === '127.0.0.1'
        ? `:${caldavPort}`
        : '';
    return ctx.redirect(`${caldavProtocol}://${caldavHost}${portSuffix}/`);
  }

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
      // Find contact by contact_id (URL-based lookup)
      let contactObj = await Contacts.findOne(ctx.instance, ctx.state.session, {
        address_book: addressBook._id,
        contact_id: contact
      });

      // macOS Contacts may request a contact using a URL that differs
      // from the stored contact_id. Fall back to UID-based lookup.
      if (!contactObj || contactObj.deleted_at) {
        const possibleUid = contact.replace(/\.vcf$/i, '');
        const uidContact = await Contacts.findOne(
          ctx.instance,
          ctx.state.session,
          {
            address_book: addressBook._id,
            uid: possibleUid
          }
        );

        if (uidContact && !uidContact.deleted_at) {
          contactObj = uidContact;
        }
      }

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

      setCardDAVMultistatusResponse(ctx);
      ctx.body = xml;
      break;
    }

    case 'GET': {
      // Find contact by contact_id (URL-based lookup)
      let contactObj = await Contacts.findOne(ctx.instance, ctx.state.session, {
        address_book: addressBook._id,
        contact_id: contact
      });

      // macOS Contacts may request a contact using a URL that differs
      // from the stored contact_id. Fall back to UID-based lookup.
      if (!contactObj || contactObj.deleted_at) {
        const possibleUid = contact.replace(/\.vcf$/i, '');
        const uidContact = await Contacts.findOne(
          ctx.instance,
          ctx.state.session,
          {
            address_book: addressBook._id,
            uid: possibleUid
          }
        );

        if (uidContact && !uidContact.deleted_at) {
          contactObj = uidContact;
        }
      }

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

      // Check if contact already exists by contact_id (URL-based lookup)
      let existingContact = await Contacts.findOne(
        ctx.instance,
        ctx.state.session,
        {
          address_book: addressBook._id,
          contact_id: contact
        }
      );

      // Check If-None-Match header (RFC 2616 Section 14.26)
      // When If-None-Match: * is present, the client explicitly wants to
      // create a new resource and expects a 412 if it already exists at
      // this URL. We only check by contact_id (URL) in this case.
      // However, if the existing contact is soft-deleted, treat it as
      // non-existent — the client can safely "create" over it (resurrection).
      const ifNoneMatch = ctx.request.headers['if-none-match'];
      if (
        ifNoneMatch === '*' &&
        existingContact &&
        !existingContact.deleted_at
      ) {
        throw Boom.preconditionFailed(
          ctx.translateError('CONTACT_ALREADY_EXISTS')
        );
      }

      // macOS Contacts may send a PUT to a new URL when editing a contact.
      // The vCard UID remains the same, but the URL (contact_id) changes.
      // Without this UID-based fallback, the server creates a new contact
      // instead of updating the existing one, causing duplicates on iOS/iPadOS.
      // Only perform UID fallback when the client is NOT sending If-None-Match: *
      // because that header signals explicit create-new intent (e.g. tsdav createVCard).
      if (!existingContact && vCard.UID && ifNoneMatch !== '*') {
        const uidContact = await Contacts.findOne(
          ctx.instance,
          ctx.state.session,
          {
            address_book: addressBook._id,
            uid: vCard.UID
          }
        );

        // Only use UID match if it's not soft-deleted
        if (uidContact && !uidContact.deleted_at) {
          existingContact = uidContact;
        }
      }

      // Clean up duplicate contacts with the same UID in this address book.
      // Duplicates can arise when a client PUTs to a new URL (creating a
      // second row) before the UID-fallback logic was in place, or from
      // sync races between multiple clients.  We keep the canonical contact
      // (existingContact) and soft-delete any others sharing the same UID.
      if (existingContact && vCard.UID) {
        const allWithUid = await Contacts.find(
          ctx.instance,
          ctx.state.session,
          {
            address_book: addressBook._id,
            uid: vCard.UID
          }
        );

        for (const dup of allWithUid) {
          if (
            dup._id.toString() !== existingContact._id.toString() &&
            !dup.deleted_at
          ) {
            dup.deleted_at = new Date().toISOString();
            dup.instance = ctx.instance;
            dup.session = ctx.state.session;
            dup.isNew = false;
            await dup.save();
          }
        }
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

        // NOTE: we intentionally do NOT rewrite contact_id when the
        // contact was found via UID fallback. Changing the canonical
        // contact_id would alter the href reported in sync-collection,
        // causing other clients (phone, macOS) that cached the OLD href
        // to interpret the contact as a brand-new resource and create
        // duplicates. Instead we keep the original contact_id stable
        // and return a Content-Location header pointing to the real URL
        // so the requesting client can update its cache.
        const oldContactId = existingContact.contact_id;

        // Capture old content for no-op detection
        const oldContent = existingContact.content;
        const wasDeleted = Boolean(existingContact.deleted_at);

        // Resurrect soft-deleted contact (clear deleted_at)
        // This handles the case where a client PUTs to a URL that was
        // previously deleted — the contact should come back to life.
        if (existingContact.deleted_at) {
          existingContact.deleted_at = null;
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
        // Add 1ms to ensure the token timestamp is strictly after the
        // contact's updated_at so that the next sync-collection with
        // $gte does not re-report this contact as a change.
        addressBook.synctoken = `${config.urls.web}/ns/sync-token/${
          Date.now() + 1
        }`;

        await addressBook.save();

        // Suppress notifications when vCard content has not actually changed
        // (no-op PUT during sync), but always notify on resurrection
        const contentChanged =
          String(oldContent || '') !== String(vCardContent || '');
        if (contentChanged || wasDeleted) {
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
        }

        ctx.set('ETag', newEtag);
        // Return the canonical URL using the ORIGINAL (stable) contact_id
        // so the client learns the correct href for future requests.
        // This is important when the client PUTs to a URL that differs
        // from the stored contact_id (e.g. macOS using UID as filename).
        ctx.set(
          'Content-Location',
          `/dav/${
            ctx.params.user
          }/addressbooks/${addressbook}/${oldContactId}${vcf(oldContactId)}`
        );
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
        // Add 1ms to ensure the token timestamp is strictly after the
        // contact's updated_at so that the next sync-collection with
        // $gte does not re-report this contact as a change.
        addressBook.synctoken = `${config.urls.web}/ns/sync-token/${
          Date.now() + 1
        }`;
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
        // Return the canonical URL of the newly created resource
        ctx.set(
          'Content-Location',
          `/dav/${ctx.params.user}/addressbooks/${addressbook}/${contact}${vcf(
            contact
          )}`
        );
        ctx.status = 201;
      }

      break;
    }

    case 'DELETE': {
      // Check if address book is read-only
      if (addressBook.readonly)
        throw Boom.forbidden(ctx.translateError('ADDRESS_BOOK_READONLY'));

      // Find contact by contact_id (URL-based lookup)
      let contactObj = await Contacts.findOne(ctx.instance, ctx.state.session, {
        address_book: addressBook._id,
        contact_id: contact
      });

      // macOS Contacts may send a DELETE to a URL that differs from the
      // stored contact_id (e.g. old contacts created with a different URL
      // format). Fall back to UID-based lookup by parsing the vCard UID
      // from the contact_id portion of the URL, similar to the PUT handler.
      if (!contactObj || contactObj.deleted_at) {
        // Try to find by UID — the contact_id in the URL often matches
        // or contains the vCard UID (with or without .vcf extension)
        const possibleUid = contact.replace(/\.vcf$/i, '');
        const uidContact = await Contacts.findOne(
          ctx.instance,
          ctx.state.session,
          {
            address_book: addressBook._id,
            uid: possibleUid
          }
        );

        if (uidContact && !uidContact.deleted_at) {
          contactObj = uidContact;
        }
      }

      // Return 404 for non-existent or already soft-deleted contacts
      if (!contactObj || contactObj.deleted_at)
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
      // Add 1ms to ensure the token timestamp is strictly after the
      // contact's updated_at so that the next sync-collection with
      // $gte does not re-report this contact as a change.
      addressBook.synctoken = `${config.urls.web}/ns/sync-token/${
        Date.now() + 1
      }`;
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

      //
      // Parse the PROPFIND request body so we only return push-transports
      // when the client explicitly asked for it (not for allprop).
      //
      const xmlBody = ctx.request.body
        ? await xmlHelpers.parseXML(ctx.request.body.toString())
        : null;
      const requestedProps = xmlHelpers.extractRequestedProps(xmlBody);
      const wantsPush = requestedProps.includes('push-transports');
      const wantsPushkey = requestedProps.includes('pushkey');

      //
      // Apple push-discovery: iOS Contacts inspects each individual
      // addressbook (not just the addressbook-home) for <cs:push-transports>
      // and <cs:pushkey> before flipping the account from Fetch to Push.
      // Only build the XML when explicitly requested.
      //
      const addressBookPushTransportsXML = wantsPush
        ? await buildCardDAVPushTransportsXML(ctx)
        : '';

      const addressBookProps = [
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
            '<card:address-data-type content-type="text/vcard" version="3.0"/><card:address-data-type content-type="text/vcard" version="4.0"/>'
        },
        {
          name: 'd:current-user-privilege-set',
          value:
            '<d:privilege><d:read/></d:privilege><d:privilege><d:write/></d:privilege><d:privilege><d:write-content/></d:privilege><d:privilege><d:bind/></d:privilege><d:privilege><d:unbind/></d:privilege>'
        },
        // macOS Contacts uses d:owner to determine which principal owns
        // the address book; without it, Mac may not allow setting the
        // CardDAV account as the default account for new contacts.
        {
          name: 'd:owner',
          value: `<d:href>/dav/${encodeXMLEntities(ctx.params.user)}/</d:href>`
        },
        {
          name: 'd:supported-report-set',
          value:
            '<d:supported-report><d:report><card:addressbook-multiget/></d:report></d:supported-report><d:supported-report><d:report><card:addressbook-query/></d:report></d:supported-report><d:supported-report><d:report><d:sync-collection/></d:report></d:supported-report>'
        }
      ];

      //
      // push-transports is only included when the XML was actually built
      // (requires APS cert/topic).  pushkey is always returned when
      // explicitly requested — it is a stable identifier the client
      // needs regardless of whether the transport advertisement is
      // available yet (mirrors CalDAV adapter: pushkey is a separate
      // tag handler that always returns the resource key).
      //
      if (addressBookPushTransportsXML) {
        addressBookProps.push({
          name: 'cs:push-transports',
          value: addressBookPushTransportsXML
        });
      }

      if (wantsPushkey) {
        addressBookProps.push({
          name: 'cs:pushkey',
          value: encodeXMLEntities(addressBook.address_book_id)
        });
      }

      // Create response for address book
      const abPropstats = [
        {
          props: addressBookProps,
          status: '200 OK'
        }
      ];
      if (wantsPush && !addressBookPushTransportsXML) {
        abPropstats.push({
          props: [{ name: 'cs:push-transports', value: '' }],
          status: '404 Not Found'
        });
      }

      const responses = [
        {
          href: `/dav/${ctx.params.user}/addressbooks/${addressbook}/`,
          propstat: abPropstats
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

        // Filter out soft-deleted contacts and deduplicate by UID.
        // Duplicates (same UID, different contact_id) can exist from
        // historical sync issues; only report the earliest-created one
        // so clients don't see phantom contacts.
        const seenUids = new Set();
        const contacts = allContacts
          .filter((c) => !c.deleted_at)
          .filter((c) => {
            if (!c.uid) return true;
            if (seenUids.has(c.uid)) return false;
            seenUids.add(c.uid);
            return true;
          });

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

      setCardDAVMultistatusResponse(ctx);
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

      // send apple push notification so iOS Contacts refreshes its
      // addressbook-home listing and discovers the new collection.
      sendApnContacts(ctx.instance.client, ctx.state.user.alias_id)
        .then()
        .catch((err) => ctx.logger.fatal(err));

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

      // send apple push notification so iOS Contacts removes the
      // deleted collection from its addressbook-home listing.
      sendApnContacts(ctx.instance.client, ctx.state.user.alias_id)
        .then()
        .catch((err) => ctx.logger.fatal(err));

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
        // Add 1ms to ensure the token timestamp is strictly after any
        // concurrent contact updated_at so that the next sync-collection
        // with $gte does not re-report contacts as changes.
        addressBook.synctoken = `${config.urls.web}/ns/sync-token/${
          Date.now() + 1
        }`;
        await addressBook.save();

        // send apple push notification so iOS Contacts picks up the
        // PROPPATCH (display-name, description, color).
        sendApnContacts(ctx.instance.client, ctx.state.user.alias_id)
          .then()
          .catch((err) => ctx.logger.fatal(err));
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

      setCardDAVMultistatusResponse(ctx);
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

    //
    // Parse the PROPFIND request body so we know whether the client
    // explicitly asked for push-transports.  Per the CalDAV adapter
    // pattern and caldav-pubsubdiscovery.txt §6, push-transports
    // SHOULD NOT appear in allprop responses; iOS ignores it there.
    //
    const xmlBody = ctx.request.body
      ? await xmlHelpers.parseXML(ctx.request.body.toString())
      : null;
    const requestedProps = xmlHelpers.extractRequestedProps(xmlBody);
    const wantsPush = requestedProps.includes('push-transports');
    const wantsPushkey = requestedProps.includes('pushkey');

    //
    // Apple CalDAV/CardDAV push-discovery (caldav-pubsubdiscovery.txt):
    // Build the push-transports XML once and reuse it for every
    // addressbook child entry below (in the Depth=1 listing), but
    // only when the client explicitly requested it.
    //
    const pushTransportsXML = wantsPush
      ? await buildCardDAVPushTransportsXML(ctx)
      : '';

    const homeProps = [
      { name: 'd:displayname', value: 'Address Books' },
      { name: 'd:resourcetype', value: '<d:collection/>' },
      // macOS Contacts expects d:owner on the addressbook-home-set
      // collection to determine ownership and write permissions.
      {
        name: 'd:owner',
        value: `<d:href>/dav/${encodeXMLEntities(ctx.params.user)}/</d:href>`
      },
      {
        name: 'd:current-user-privilege-set',
        value:
          '<d:privilege><d:read/></d:privilege><d:privilege><d:write/></d:privilege><d:privilege><d:bind/></d:privilege><d:privilege><d:unbind/></d:privilege>'
      }
    ];

    if (pushTransportsXML) {
      homeProps.push({
        name: 'cs:push-transports',
        value: pushTransportsXML
      });
    }

    //
    // pushkey is the per-user account-wide subscription identifier
    // that iOS uses to refresh the entire addressbook-home (i.e.
    // "any addressbook in this account changed") on push receipt.
    // We use the principal username so it is stable across
    // addressbook adds/removes.  Always returned when explicitly
    // requested, even if push-transports XML could not be built
    // (e.g. APS cert not yet loaded).
    //
    if (wantsPushkey) {
      homeProps.push({
        name: 'cs:pushkey',
        value: encodeXMLEntities(ctx.params.user)
      });
    }

    //
    // If push-transports was requested but the cert is unavailable,
    // return it in a 404 propstat so iOS knows the property was
    // understood but not available (rather than silently omitted).
    // RFC 4918 §9.1 requires properties that are requested but not
    // present to appear in a separate propstat with 404 status.
    //
    const notFoundProps = [];
    if (wantsPush && !pushTransportsXML) {
      notFoundProps.push({ name: 'cs:push-transports', value: '' });
    }

    // Create response
    const homePropstats = [
      {
        props: homeProps,
        status: '200 OK'
      }
    ];
    if (notFoundProps.length > 0) {
      homePropstats.push({
        props: notFoundProps,
        status: '404 Not Found'
      });
    }

    const responses = [
      {
        href: `/dav/${ctx.params.user}/addressbooks/`,
        propstat: homePropstats
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
        const childProps = [
          {
            name: 'd:displayname',
            value: encodeXMLEntities(addressBook.name)
          },
          {
            name: 'd:resourcetype',
            value: '<d:collection/><card:addressbook/>'
          },
          { name: 'd:sync-token', value: addressBook.synctoken },
          // getctag is used by macOS/iOS to detect changes
          { name: 'cs:getctag', value: addressBook.synctoken },
          {
            name: 'card:addressbook-description',
            value: encodeXMLEntities(addressBook.description || '')
          },
          {
            name: 'card:supported-address-data',
            value:
              '<card:address-data-type content-type="text/vcard" version="3.0"/><card:address-data-type content-type="text/vcard" version="4.0"/>'
          },
          {
            name: 'd:current-user-privilege-set',
            value:
              '<d:privilege><d:read/></d:privilege><d:privilege><d:write/></d:privilege><d:privilege><d:write-content/></d:privilege><d:privilege><d:bind/></d:privilege><d:privilege><d:unbind/></d:privilege>'
          },
          // macOS Contacts uses d:owner to determine which principal
          // owns the address book for write permission decisions.
          {
            name: 'd:owner',
            value: `<d:href>/dav/${encodeXMLEntities(
              ctx.params.user
            )}/</d:href>`
          },
          {
            name: 'd:supported-report-set',
            value:
              '<d:supported-report><d:report><card:addressbook-multiget/></d:report></d:supported-report><d:supported-report><d:report><card:addressbook-query/></d:report></d:supported-report><d:supported-report><d:report><d:sync-collection/></d:report></d:supported-report>'
          }
        ];

        //
        // Mirror push-transports onto every addressbook child entry too.
        // iOS sometimes inspects the Depth=1 listing of the addressbook-home
        // rather than issuing a follow-up PROPFIND on each addressbook URL,
        // and ccs-calendarserver returns push-transports for every collection
        // node in either case.  Forward Email's calendar branch (via caldav-
        // adapter) does the same.
        //
        if (pushTransportsXML) {
          childProps.push({
            name: 'cs:push-transports',
            value: pushTransportsXML
          });
        }

        if (wantsPushkey) {
          childProps.push({
            name: 'cs:pushkey',
            value: encodeXMLEntities(addressBook.address_book_id)
          });
        }

        const childPropstats = [
          {
            props: childProps,
            status: '200 OK'
          }
        ];
        //
        // Mirror the 404 propstat for push-transports on child entries
        // when the cert is unavailable (same as the home entry above).
        //
        if (wantsPush && !pushTransportsXML) {
          childPropstats.push({
            props: [{ name: 'cs:push-transports', value: '' }],
            status: '404 Not Found'
          });
        }

        responses.push({
          href: `/dav/${ctx.params.user}/addressbooks/${addressBook.address_book_id}/`,
          propstat: childPropstats
        });
      }
    }

    const xml = xmlHelpers.getMultistatusXML(responses);
    setCardDAVMultistatusResponse(ctx);
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

    setCardDAVMultistatusResponse(ctx);
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
      setCardDAVMultistatusResponse(ctx);
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

    //
    // Fetch contacts for the address book and filter by contact_id in memory.
    // This approach is more reliable than using $in queries because:
    // 1. It avoids potential issues with $in operator across WSP serialization
    // 2. It handles case-insensitive matching for contact_ids
    // 3. It works regardless of whether contact_ids are stored with or without .vcf
    //
    // DAVx5 sends ~10 hrefs per multiget request (70 parallel requests for 696 contacts).
    // Fetching all contacts for the address book and filtering in memory is efficient
    // because the address book query is simple and the results are cached by SQLite.
    //
    const allContacts = await Contacts.find(ctx.instance, ctx.state.session, {
      address_book: addressBook._id
    });

    // Build a Set of requested contact IDs for fast lookup (case-insensitive)
    const requestedIds = new Set(contactIds.map((id) => id.toLowerCase()));

    // Also add versions with .vcf extension in case contacts are stored that way
    for (const id of contactIds) {
      requestedIds.add((id + '.vcf').toLowerCase());
    }

    // Filter to only requested contacts, excluding soft-deleted ones.
    // Also match by UID as a fallback — macOS Contacts may request
    // contacts using a URL whose filename matches the vCard UID rather
    // than the stored contact_id.
    const contacts = allContacts.filter(
      (c) =>
        !c.deleted_at &&
        (requestedIds.has(c.contact_id.toLowerCase()) ||
          requestedIds.has(c.contact_id.replace(/\.vcf$/i, '').toLowerCase()) ||
          requestedIds.has(c.uid.toLowerCase()))
    );

    // Debug logging to help diagnose production issues
    if (contacts.length === 0 && contactIds.length > 0) {
      ctx.logger.warn('addressbook-multiget returned 0 contacts', {
        requestedCount: contactIds.length,
        totalInAddressBook: allContacts.length,
        sampleRequestedIds: contactIds.slice(0, 3),
        sampleStoredIds: allContacts.slice(0, 3).map((c) => c.contact_id),
        addressBookId: addressBook._id.toString()
      });
    } else if (contacts.length < contactIds.length) {
      ctx.logger.debug('addressbook-multiget partial match', {
        requestedCount: contactIds.length,
        foundCount: contacts.length,
        totalInAddressBook: allContacts.length
      });
    }

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

    setCardDAVMultistatusResponse(ctx);
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
    // Return only contacts modified strictly after the sync token timestamp.
    // Using $gt ensures that contacts already reported at the sync token
    // timestamp are not re-reported on subsequent syncs. Re-reporting
    // unchanged contacts can confuse macOS Contacts into creating
    // duplicates because it sees the same contact as a "change."
    const allModifiedContacts = await Contacts.find(
      ctx.instance,
      ctx.state.session,
      {
        address_book: addressBook._id,
        updated_at: { $gte: syncTimestamp.toISOString() }
      }
    );

    // Separate non-deleted and deleted contacts, deduplicating by UID.
    // When duplicates exist (same UID, different contact_id), report only
    // the canonical (first) one to prevent clients from seeing phantoms.
    const seenUids = new Set();
    for (const contact of allModifiedContacts) {
      // Skip UID-duplicates (keep first occurrence)
      if (contact.uid) {
        if (seenUids.has(contact.uid)) continue;
        seenUids.add(contact.uid);
      }

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

    // Filter out deleted contacts and deduplicate by UID for initial sync
    const seenUidsInit = new Set();
    for (const contact of contacts) {
      if (!contact.deleted_at) {
        if (contact.uid) {
          if (seenUidsInit.has(contact.uid)) continue;
          seenUidsInit.add(contact.uid);
        }

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

  setCardDAVMultistatusResponse(ctx);
  ctx.body = xml;
}

// PROPFIND routes
async function propFindPrincipal(ctx) {
  if (ctx.method !== 'PROPFIND') throw Boom.methodNotAllowed();

  try {
    //
    // Parse the PROPFIND request body to determine which properties the
    // client is asking for.  Per RFC 4918 §9.1, an empty body is treated
    // as allprop.  The CalDAV adapter (caldav-adapter/routes/principal/
    // propfind.js) does the same: it parses the body, extracts children,
    // and only returns push-transports when explicitly requested.
    //
    // Apple's caldav-pubsubdiscovery.txt says push-transports SHOULD NOT
    // be returned for allprop.  iOS dataaccessd appears to honour this:
    // if push-transports appears in an allprop-style response it is
    // silently ignored, but when it appears in response to an explicit
    // request it is recognised and the account flips to Push.
    //
    const xmlBody = ctx.request.body
      ? await xmlHelpers.parseXML(ctx.request.body.toString())
      : null;
    const requestedProps = xmlHelpers.extractRequestedProps(xmlBody);
    const wantsPush = requestedProps.includes('push-transports');

    //
    // RFC 4791 Section 6.2.1 - calendar-home-set
    // DAVx5 and other clients use this property on the principal
    // to discover the CalDAV service.  Without it, clients that
    // connect via the CardDAV server (carddav.forwardemail.net)
    // will never discover calendars on the CalDAV server.
    //
    // In production the CalDAV server runs on a separate host
    // (caldav.forwardemail.net), so we build an absolute URL.
    // In test/dev (localhost) we include the port.
    //
    const caldavHost = env.CALDAV_HOST;
    const caldavProtocol = env.CALDAV_PROTOCOL || 'https';
    const caldavPort = env.CALDAV_PORT;
    const portSuffix =
      caldavHost === 'localhost' || caldavHost === '127.0.0.1'
        ? `:${caldavPort}`
        : '';
    const caldavBaseUrl = `${caldavProtocol}://${caldavHost}${portSuffix}`;

    const username = encodeXMLEntities(ctx.state.session.user.username);

    // Create response
    const responses = [
      {
        href: `/dav/${ctx.state.session.user.username}/`,
        propstat: [
          {
            props: [
              {
                name: 'd:displayname',
                value: username
              },
              {
                name: 'd:resourcetype',
                value: '<d:collection/><d:principal/>'
              },
              {
                name: 'd:current-user-principal',
                value: `<d:href>/dav/${username}/</d:href>`
              },
              {
                name: 'card:addressbook-home-set',
                value: `<d:href>/dav/${username}/addressbooks/</d:href>`
              },
              {
                name: 'cal:calendar-home-set',
                value: `<d:href>${caldavBaseUrl}/dav/${username}/</d:href>`
              },
              {
                name: 'd:principal-URL',
                value: `<d:href>/dav/${username}/</d:href>`
              },
              {
                name: 'd:principal-collection-set',
                value: '<d:href>/dav/</d:href>'
              },
              {
                name: 'd:supported-report-set',
                value:
                  '<d:supported-report><d:report><card:addressbook-multiget/></d:report></d:supported-report><d:supported-report><d:report><card:addressbook-query/></d:report></d:supported-report><d:supported-report><d:report><d:sync-collection/></d:report></d:supported-report>'
              }
            ],
            status: '200 OK'
          }
        ]
      }
    ];

    //
    // Apple push-discovery: only include <CS:push-transports> when the
    // client explicitly requested it (i.e. NOT for allprop).  This
    // mirrors the CalDAV adapter (caldav-adapter/common/tags.js) which
    // only returns push-transports via its tag handler when the property
    // appears in the parsed PROPFIND children list.
    //
    // caldav-pubsubdiscovery.txt §6 says push-transports SHOULD NOT be
    // returned by allprop; iOS dataaccessd honours this literally.
    //
    if (wantsPush) {
      const principalPushTransportsXML = await buildCardDAVPushTransportsXML(
        ctx
      );
      if (principalPushTransportsXML) {
        responses[0].propstat[0].props.push({
          name: 'cs:push-transports',
          value: principalPushTransportsXML
        });
      } else {
        // 404 propstat for push-transports when cert unavailable
        responses[0].propstat.push({
          props: [{ name: 'cs:push-transports', value: '' }],
          status: '404 Not Found'
        });
      }
    }

    const xml = xmlHelpers.getMultistatusXML(responses);

    setCardDAVMultistatusResponse(ctx);
    ctx.body = xml;
  } catch (err) {
    ctx.logger.error(err);
    throw new TypeError('Error processing PROPFIND request');
  }
}

davRouter.all('/:user', propFindPrincipal);
davRouter.all('/', propFindPrincipal);

//
// CardDAV side of Apple's CalDAV/CardDAV push subscription protocol
// (`caldav-pubsubdiscovery.txt`).  iOS Contacts POSTs token + key here
// after reading <CS:push-transports> from a PROPFIND on the addressbook
// home.  The handler persists into `alias.aps[]` with subtopic
// `com.apple.mobileaddressbook` so `sendApnContacts` will push to it.
//
// Mounted on /apns AND /dav/apns to match what iOS may send depending on
// whether the subscription-url advertised in PROPFIND is interpreted as
// absolute or relative-to-server-root.
//
// Both GET and POST are accepted, matching Apple's reference
// `APNSubscriptionResource` (which aliases `http_GET = http_POST`) and
// Cyrus IMAP's `http_applepush.c` (which advertises
// `ALLOW_READ|ALLOW_POST`).  The Cyrus implementation explicitly notes
// "POST has been seen with URL params, so for now we just call the GET
// handler", reflecting that real iOS devices send both methods --
// notably the periodic re-registration that follows
// <CS:refresh-interval> uses GET with query parameters.  Without the GET
// route forwardemail's CardDAV server silently 404s those refreshes and
// device tokens drift out of date until the user toggles the account.
//
async function apnsHandler(ctx) {
  ctx.state.davSubtopic = 'com.apple.mobileaddressbook';
  //
  // Always pass an explicit subtopic.  The fallback host-based heuristic
  // in dav-apns-subscribe.js ("carddav.*" -> mobileaddressbook else
  // mobilecal) is brittle if this server is reached via a shared host or
  // a proxy that rewrites Host.
  //
  await davApnsSubscribe(ctx, { subtopic: 'com.apple.mobileaddressbook' });
}

router.post('/apns', apnsHandler);
router.get('/apns', apnsHandler);
davRouter.post('/apns', apnsHandler);
davRouter.get('/apns', apnsHandler);

router.use(davRouter.routes());
router.all('(.*)', propFindPrincipal);
module.exports = router;
