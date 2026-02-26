/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const ObjectID = require('bson-objectid');
const { boolean } = require('boolean');
const isSANB = require('is-string-and-not-blank');
const isEmail = require('#helpers/is-email');

const AddressBooks = require('#models/address-books');
const Aliases = require('#models/aliases');
const Contacts = require('#models/contacts');
const _ = require('#helpers/lodash');
const ensureDefaultAddressBook = require('#helpers/ensure-default-address-book');
const i18n = require('#helpers/i18n');
const setPaginationHeaders = require('#helpers/set-pagination-headers');
const updateStorageUsed = require('#helpers/update-storage-used');
const xmlHelpers = require('#helpers/carddav-xml');

function json(contact) {
  // Transform contact data for API response
  const object = {
    //
    // NOTE: we use `contact_id` as the `id` instead of `_id` from our database
    //       (since CardDAV can have arbitrary ID's from clients)
    //
    id: contact.contact_id,
    uid: contact.uid,
    full_name: contact.fullName,
    content: contact.content,
    etag: contact.etag,
    is_group: contact.isGroup,
    emails: contact.emails,
    phone_numbers: contact.phoneNumbers,
    created_at: contact.created_at,
    updated_at: contact.updated_at,
    object: 'contact'
  };

  return object;
}

async function getDefaultAddressBook(ctx) {
  // Find the default address book
  let addressBook = await AddressBooks.findOne(
    ctx.instance,
    ctx.state.session,
    { address_book_id: 'default' }
  );

  //
  // TODO: we need to make it so users can set a "default"
  //       which would make it so ensureDefaultAddressBook
  //       and this function (and anywhere else) uses this
  //       (e.g. `is_default_address_book = true`)
  //       which would strictly be for API and programmatic acccess
  //

  // Lookup earliest created address book if user deleted "default"
  if (!addressBook) {
    const addressBooks = await AddressBooks.find(
      ctx.instance,
      ctx.state.session,
      {},
      {},
      {
        sort: 'created_at'
      }
    );
    if (addressBooks.length > 0) addressBook = addressBooks[0];
  }

  return addressBook;
}

async function list(ctx) {
  await ensureDefaultAddressBook.call(ctx.instance, ctx);

  // Find the default address book
  const addressBook = await getDefaultAddressBook(ctx);
  if (!addressBook)
    throw Boom.notFound(ctx.translateError('ADDRESS_BOOK_DOES_NOT_EXIST'));

  const query = {
    address_book: addressBook._id,
    // Filter out soft-deleted contacts (deleted via CardDAV sync)
    $or: [{ deleted_at: { $exists: false } }, { deleted_at: null }]
  };

  // Get contacts with pagination
  const { results: contacts, count: itemCount } = await Contacts.findAndCount(
    ctx.instance,
    ctx.state.session,
    query,
    {},
    {
      limit: ctx.query.limit,
      offset: ctx.paginate.skip,
      sort: { created_at: -1 }
    }
  );

  const pageCount = Math.ceil(itemCount / ctx.query.limit);

  // Set pagination headers
  setPaginationHeaders(
    ctx,
    pageCount,
    ctx.query.page,
    contacts.length,
    itemCount
  );

  ctx.body = Array.isArray(contacts)
    ? contacts.map((contact) => json(contact))
    : [];
}

async function create(ctx) {
  const { body } = ctx.request;

  // Validate request body exists and is an object
  if (!_.isObject(body)) {
    throw Boom.badRequest(ctx.translateError('INVALID_REQUEST_BODY'));
  }

  // Validate required fields
  if (!body.content && !body.full_name) {
    throw Boom.badRequest(
      ctx.translateError('CONTACT_FULLNAME_OR_CONTENT_REQUIRED')
    );
  }

  // Validate fullName if provided
  if (body.full_name !== undefined && !isSANB(body.full_name)) {
    throw Boom.badRequest(ctx.translateError('CONTACT_FULLNAME_INVALID'));
  }

  // Validate content if provided
  if (body.content !== undefined && !isSANB(body.content)) {
    throw Boom.badRequest(ctx.translateError('CONTACT_CONTENT_INVALID'));
  }

  // Validate contact_id if provided
  if (body.contact_id !== undefined && !isSANB(body.contact_id)) {
    throw Boom.badRequest(ctx.translateError('CONTACT_ID_INVALID'));
  }

  // Validate uid if provided
  if (body.uid !== undefined && !isSANB(body.uid)) {
    throw Boom.badRequest(ctx.translateError('CONTACT_UID_INVALID'));
  }

  // Validate emails array if provided
  if (body.emails !== undefined) {
    if (!Array.isArray(body.emails)) {
      throw Boom.badRequest(ctx.translateError('CONTACT_EMAILS_MUST_BE_ARRAY'));
    }

    for (const email of body.emails) {
      if (!_.isObject(email)) {
        throw Boom.badRequest(
          ctx.translateError('CONTACT_EMAIL_MUST_BE_OBJECT')
        );
      }

      if (!isSANB(email.value) || !isEmail(email.value)) {
        throw Boom.badRequest(ctx.translateError('CONTACT_EMAIL_INVALID'));
      }

      if (email.type !== undefined && !isSANB(email.type)) {
        throw Boom.badRequest(ctx.translateError('CONTACT_EMAIL_TYPE_INVALID'));
      }
    }
  }

  // Validate phones array if provided
  if (body.phones !== undefined) {
    if (!Array.isArray(body.phones)) {
      throw Boom.badRequest(ctx.translateError('CONTACT_PHONES_MUST_BE_ARRAY'));
    }

    for (const phone of body.phones) {
      if (!_.isObject(phone)) {
        throw Boom.badRequest(
          ctx.translateError('CONTACT_PHONE_MUST_BE_OBJECT')
        );
      }

      if (!isSANB(phone.value)) {
        throw Boom.badRequest(ctx.translateError('CONTACT_PHONE_INVALID'));
      }

      if (phone.type !== undefined && !isSANB(phone.type)) {
        throw Boom.badRequest(ctx.translateError('CONTACT_PHONE_TYPE_INVALID'));
      }
    }
  }

  // Validate addresses array if provided
  if (body.addresses !== undefined) {
    if (!Array.isArray(body.addresses)) {
      throw Boom.badRequest(
        ctx.translateError('CONTACT_ADDRESSES_MUST_BE_ARRAY')
      );
    }

    for (const address of body.addresses) {
      if (!_.isObject(address)) {
        throw Boom.badRequest(
          ctx.translateError('CONTACT_ADDRESS_MUST_BE_OBJECT')
        );
      }

      if (address.street !== undefined && !isSANB(address.street)) {
        throw Boom.badRequest(
          ctx.translateError('CONTACT_ADDRESS_STREET_INVALID')
        );
      }

      if (address.city !== undefined && !isSANB(address.city)) {
        throw Boom.badRequest(
          ctx.translateError('CONTACT_ADDRESS_CITY_INVALID')
        );
      }

      if (address.state !== undefined && !isSANB(address.state)) {
        throw Boom.badRequest(
          ctx.translateError('CONTACT_ADDRESS_STATE_INVALID')
        );
      }

      if (address.postalCode !== undefined && !isSANB(address.postalCode)) {
        throw Boom.badRequest(
          ctx.translateError('CONTACT_ADDRESS_POSTAL_CODE_INVALID')
        );
      }

      if (address.country !== undefined && !isSANB(address.country)) {
        throw Boom.badRequest(
          ctx.translateError('CONTACT_ADDRESS_COUNTRY_INVALID')
        );
      }

      if (address.type !== undefined && !isSANB(address.type)) {
        throw Boom.badRequest(
          ctx.translateError('CONTACT_ADDRESS_TYPE_INVALID')
        );
      }
    }
  }

  // check if over quota
  const { isOverQuota } = await Aliases.isOverQuota(
    {
      id: ctx.state.session.user.alias_id,
      domain: ctx.state.session.user.domain_id,
      locale: ctx.locale
    },
    0,
    ctx.client
  );
  if (isOverQuota)
    throw Boom.forbidden(i18n.translate('IMAP_MAILBOX_OVER_QUOTA', ctx.locale));

  await ensureDefaultAddressBook.call(ctx.instance, ctx);

  // Find the default address book
  const addressBook = await getDefaultAddressBook(ctx);
  if (!addressBook)
    throw Boom.notFound(ctx.translateError('ADDRESS_BOOK_DOES_NOT_EXIST'));

  const contactId = body.contact_id || new ObjectID().toString();
  const uid = body.uid || new ObjectID().toString();

  // Generate vCard content if not provided
  let vCardContent = body.content;
  if (vCardContent) {
    // Parse vCard to extract fullName for indexing
    // This also derives FN from N if FN is missing
    const parsedVCard = xmlHelpers.parseVCard(vCardContent);
    if (!body.full_name && parsedVCard.FN) {
      body.full_name = parsedVCard.FN;
    }

    // Extract emails from vCard if not provided in body
    if (!body.emails && parsedVCard.EMAIL) {
      const emailValues = Array.isArray(parsedVCard.EMAIL)
        ? parsedVCard.EMAIL
        : [parsedVCard.EMAIL];
      body.emails = emailValues.map((v) => ({ value: v, type: 'INTERNET' }));
    }

    // Extract phone numbers from vCard if not provided in body
    if (!body.phone_numbers && parsedVCard.TEL) {
      const telValues = Array.isArray(parsedVCard.TEL)
        ? parsedVCard.TEL
        : [parsedVCard.TEL];
      body.phone_numbers = telValues.map((v) => ({ value: v, type: 'CELL' }));
    }
  }

  if (!vCardContent) {
    vCardContent = `BEGIN:VCARD
VERSION:3.0
UID:${uid}
FN:${body.full_name || ''}`;

    if (body.emails && Array.isArray(body.emails)) {
      for (const email of body.emails) {
        vCardContent += `\nEMAIL;TYPE=${email.type || 'INTERNET'}:${
          email.value
        }`;
      }
    }

    if (body.phone_numbers && Array.isArray(body.phone_numbers)) {
      for (const phone of body.phone_numbers) {
        vCardContent += `\nTEL;TYPE=${phone.type || 'CELL'}:${phone.value}`;
      }
    }

    vCardContent += '\nEND:VCARD';
  }

  // Generate ETag
  const etag = xmlHelpers.generateETag(vCardContent);

  const contact = await Contacts.create({
    // db virtual helper
    instance: ctx.instance,
    session: ctx.state.session,

    // contact data
    address_book: addressBook._id,
    contact_id: contactId,
    uid,
    content: vCardContent,
    etag,
    fullName: body.full_name || '',
    isGroup: boolean(body.is_group),
    emails: body.emails || [],
    phoneNumbers: body.phone_numbers || []
  });

  // Set ETag header
  ctx.set('ETag', etag);

  ctx.body = json(contact);

  // Update storage in background (contacts contribute to storage usage)
  updateStorageUsed(ctx.state.session.user.alias_id, ctx.client)
    .then()
    .catch((err) =>
      ctx.logger.fatal(err, { contact, session: ctx.state.session })
    );
}

async function retrieve(ctx) {
  // Validate params object exists
  if (!_.isObject(ctx.params)) {
    throw Boom.badRequest(ctx.translateError('INVALID_PARAMS'));
  }

  // Validate contact ID parameter
  if (!isSANB(ctx.params.id)) {
    throw Boom.badRequest(ctx.translateError('CONTACT_ID_REQUIRED'));
  }

  // Validate contact ID format
  // if (!ObjectID.isValid(ctx.params.id)) {
  //   throw Boom.badRequest(ctx.translateError('CONTACT_INVALID_ID'));
  // }

  await ensureDefaultAddressBook.call(ctx.instance, ctx);

  // Find the default address book
  const addressBook = await getDefaultAddressBook(ctx);
  if (!addressBook)
    throw Boom.notFound(ctx.translateError('ADDRESS_BOOK_DOES_NOT_EXIST'));

  const contact = await Contacts.findOne(ctx.instance, ctx.state.session, {
    contact_id: ctx.params.id,
    address_book: addressBook._id
  });

  // Return 404 for non-existent or soft-deleted contacts
  if (!contact || contact.deleted_at) {
    throw Boom.notFound(ctx.translateError('CONTACT_DOES_NOT_EXIST'));
  }

  // Set ETag header
  if (contact.etag) {
    ctx.set('ETag', contact.etag);
  }

  ctx.body = json(contact);
}

async function update(ctx) {
  const { body } = ctx.request;

  // Validate params object exists
  if (!_.isObject(ctx.params)) {
    throw Boom.badRequest(ctx.translateError('INVALID_PARAMS'));
  }

  // Validate contact ID parameter
  if (!isSANB(ctx.params.id)) {
    throw Boom.badRequest(ctx.translateError('CONTACT_ID_REQUIRED'));
  }

  // Validate contact ID format
  // if (!ObjectID.isValid(ctx.params.id)) {
  //   throw Boom.badRequest(ctx.translateError('CONTACT_INVALID_ID'));
  // }

  // Validate request body exists and is an object
  if (!_.isObject(body)) {
    throw Boom.badRequest(ctx.translateError('INVALID_REQUEST_BODY'));
  }

  // Validate at least one field is provided for update
  if (
    !body.content &&
    !body.full_name &&
    !body.emails &&
    !body.phones &&
    !body.addresses
  ) {
    throw Boom.badRequest(ctx.translateError('CONTACT_UPDATE_FIELDS_REQUIRED'));
  }

  // Validate fullName if provided
  if (body.full_name !== undefined && !isSANB(body.full_name)) {
    throw Boom.badRequest(ctx.translateError('CONTACT_FULLNAME_INVALID'));
  }

  // Validate content if provided
  if (body.content !== undefined && !isSANB(body.content)) {
    throw Boom.badRequest(ctx.translateError('CONTACT_CONTENT_INVALID'));
  }

  // Validate emails array if provided
  if (body.emails !== undefined) {
    if (!Array.isArray(body.emails)) {
      throw Boom.badRequest(ctx.translateError('CONTACT_EMAILS_MUST_BE_ARRAY'));
    }

    for (const email of body.emails) {
      if (!_.isObject(email)) {
        throw Boom.badRequest(
          ctx.translateError('CONTACT_EMAIL_MUST_BE_OBJECT')
        );
      }

      if (!isSANB(email.value) || !isEmail(email.value)) {
        throw Boom.badRequest(ctx.translateError('CONTACT_EMAIL_INVALID'));
      }

      if (email.type !== undefined && !isSANB(email.type)) {
        throw Boom.badRequest(ctx.translateError('CONTACT_EMAIL_TYPE_INVALID'));
      }
    }
  }

  // Validate phones array if provided
  if (body.phones !== undefined) {
    if (!Array.isArray(body.phones)) {
      throw Boom.badRequest(ctx.translateError('CONTACT_PHONES_MUST_BE_ARRAY'));
    }

    for (const phone of body.phones) {
      if (!_.isObject(phone)) {
        throw Boom.badRequest(
          ctx.translateError('CONTACT_PHONE_MUST_BE_OBJECT')
        );
      }

      if (!isSANB(phone.value)) {
        throw Boom.badRequest(ctx.translateError('CONTACT_PHONE_INVALID'));
      }

      if (phone.type !== undefined && !isSANB(phone.type)) {
        throw Boom.badRequest(ctx.translateError('CONTACT_PHONE_TYPE_INVALID'));
      }
    }
  }

  // Validate addresses array if provided
  if (body.addresses !== undefined) {
    if (!Array.isArray(body.addresses)) {
      throw Boom.badRequest(
        ctx.translateError('CONTACT_ADDRESSES_MUST_BE_ARRAY')
      );
    }

    for (const address of body.addresses) {
      if (!_.isObject(address)) {
        throw Boom.badRequest(
          ctx.translateError('CONTACT_ADDRESS_MUST_BE_OBJECT')
        );
      }

      if (address.street !== undefined && !isSANB(address.street)) {
        throw Boom.badRequest(
          ctx.translateError('CONTACT_ADDRESS_STREET_INVALID')
        );
      }

      if (address.city !== undefined && !isSANB(address.city)) {
        throw Boom.badRequest(
          ctx.translateError('CONTACT_ADDRESS_CITY_INVALID')
        );
      }

      if (address.state !== undefined && !isSANB(address.state)) {
        throw Boom.badRequest(
          ctx.translateError('CONTACT_ADDRESS_STATE_INVALID')
        );
      }

      if (address.postalCode !== undefined && !isSANB(address.postalCode)) {
        throw Boom.badRequest(
          ctx.translateError('CONTACT_ADDRESS_POSTAL_CODE_INVALID')
        );
      }

      if (address.country !== undefined && !isSANB(address.country)) {
        throw Boom.badRequest(
          ctx.translateError('CONTACT_ADDRESS_COUNTRY_INVALID')
        );
      }

      if (address.type !== undefined && !isSANB(address.type)) {
        throw Boom.badRequest(
          ctx.translateError('CONTACT_ADDRESS_TYPE_INVALID')
        );
      }
    }
  }

  // check if over quota
  const { isOverQuota } = await Aliases.isOverQuota(
    {
      id: ctx.state.session.user.alias_id,
      domain: ctx.state.session.user.domain_id,
      locale: ctx.locale
    },
    0,
    ctx.client
  );
  if (isOverQuota)
    throw Boom.forbidden(i18n.translate('IMAP_MAILBOX_OVER_QUOTA', ctx.locale));

  await ensureDefaultAddressBook.call(ctx.instance, ctx);

  // Find the default address book
  const addressBook = await getDefaultAddressBook(ctx);
  if (!addressBook)
    throw Boom.notFound(ctx.translateError('ADDRESS_BOOK_DOES_NOT_EXIST'));

  const contact = await Contacts.findOne(ctx.instance, ctx.state.session, {
    contact_id: ctx.params.id,
    address_book: addressBook._id
  });

  // Return 404 for non-existent or soft-deleted contacts
  if (!contact || contact.deleted_at) {
    throw Boom.notFound(ctx.translateError('CONTACT_DOES_NOT_EXIST'));
  }

  // Check If-Match header if present
  const ifMatch = ctx.request.headers['if-match'];
  if (ifMatch && ifMatch !== contact.etag) {
    throw Boom.preconditionFailed(ctx.translateError('ETAG_DOES_NOT_MATCH'));
  }

  // Update contact fields
  let vCardContent = contact.content;
  let needsETagUpdate = false;

  if (body.full_name !== undefined) {
    contact.fullName = body.full_name;
    needsETagUpdate = true;
  }

  if (body.content !== undefined) {
    vCardContent = body.content;
    contact.content = vCardContent;
    needsETagUpdate = true;
  }

  if (body.emails !== undefined) {
    contact.emails = body.emails;
    needsETagUpdate = true;
  }

  if (body.phone_numbers !== undefined) {
    contact.phoneNumbers = body.phone_numbers;
    needsETagUpdate = true;
  }

  if (body.is_group !== undefined) {
    contact.isGroup = boolean(body.is_group);
    needsETagUpdate = true;
  }

  // Generate new ETag if content changed
  if (needsETagUpdate) {
    // If we updated individual fields but not content, regenerate vCard
    if (
      body.content === undefined &&
      (body.full_name !== undefined ||
        body.emails !== undefined ||
        body.phone_numbers !== undefined)
    ) {
      vCardContent = `BEGIN:VCARD
VERSION:3.0
UID:${contact.uid}
FN:${contact.fullName || ''}`;

      if (contact.emails && Array.isArray(contact.emails)) {
        for (const email of contact.emails) {
          vCardContent += `\nEMAIL;TYPE=${email.type || 'INTERNET'}:${
            email.value
          }`;
        }
      }

      if (contact.phoneNumbers && Array.isArray(contact.phoneNumbers)) {
        for (const phone of contact.phoneNumbers) {
          vCardContent += `\nTEL;TYPE=${phone.type || 'CELL'}:${phone.value}`;
        }
      }

      vCardContent += '\nEND:VCARD';
      contact.content = vCardContent;
    }

    const newEtag = xmlHelpers.generateETag(vCardContent);
    contact.etag = newEtag;
  }

  // Set db virtual helpers
  contact.instance = ctx.instance;
  contact.session = ctx.state.session;
  contact.isNew = false;

  await contact.save();

  // Set ETag header
  if (contact.etag) {
    ctx.set('ETag', contact.etag);
  }

  ctx.body = json(contact);

  // Update storage in background (contact size may have changed)
  updateStorageUsed(ctx.state.session.user.alias_id, ctx.client)
    .then()
    .catch((err) =>
      ctx.logger.fatal(err, { contact, session: ctx.state.session })
    );
}

async function remove(ctx) {
  // Validate params object exists
  if (!_.isObject(ctx.params)) {
    throw Boom.badRequest(ctx.translateError('INVALID_PARAMS'));
  }

  // Validate contact ID parameter
  if (!isSANB(ctx.params.id)) {
    throw Boom.badRequest(ctx.translateError('CONTACT_ID_REQUIRED'));
  }

  // Validate contact ID format
  // if (!ObjectID.isValid(ctx.params.id)) {
  //   throw Boom.badRequest(ctx.translateError('CONTACT_INVALID_ID'));
  // }

  await ensureDefaultAddressBook.call(ctx.instance, ctx);

  // Find the default address book
  const addressBook = await getDefaultAddressBook(ctx);
  if (!addressBook)
    throw Boom.notFound(ctx.translateError('ADDRESS_BOOK_DOES_NOT_EXIST'));

  const contact = await Contacts.findOne(ctx.instance, ctx.state.session, {
    contact_id: ctx.params.id,
    address_book: addressBook._id
  });

  // Return 404 for non-existent or soft-deleted contacts
  if (!contact || contact.deleted_at) {
    throw Boom.notFound(ctx.translateError('CONTACT_DOES_NOT_EXIST'));
  }

  // Check If-Match header if present
  const ifMatch = ctx.request.headers['if-match'];
  if (ifMatch && ifMatch !== contact.etag) {
    throw Boom.preconditionFailed(ctx.translateError('ETAG_DOES_NOT_MATCH'));
  }

  await Contacts.deleteOne(ctx.instance, ctx.state.session, {
    _id: contact._id
  });

  ctx.body = json(contact);

  // Update storage in background (contact was deleted, reducing storage usage)
  updateStorageUsed(ctx.state.session.user.alias_id, ctx.client)
    .then()
    .catch((err) =>
      ctx.logger.fatal(err, { contact, session: ctx.state.session })
    );
}

module.exports = {
  list,
  create,
  retrieve,
  update,
  remove
};
