/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const AddressBooks = require('#models/address-books');
const config = require('#config');

async function ensureDefaultAddressBook(ctx) {
  const count = await AddressBooks.countDocuments(
    ctx.instance,
    ctx.state.session,
    {}
  );

  ctx.logger.debug('ensureDefaultAddressBook called:', {
    userAgent: ctx.headers['user-agent'],
    isApple: ctx.state.isApple,
    existingAddressBookCount: count,
    userEmail: ctx.state.session.user.email
  });

  if (count > 0) return;

  // Apple-specific address book configuration
  const addressBookConfig = {
    // db virtual helper
    instance: ctx.instance,
    session: ctx.state.session,

    // Default configuration
    address_book_id: 'default',
    name: 'Contacts',
    description: 'Default address book',
    color: '#0000FF',
    readonly: false,
    synctoken: `${config.urls.web}/ns/sync-token/1`,
    timezone: ctx.state.session.user.timezone || 'UTC',
    url: `${ctx.instance.config.protocol}://${ctx.instance.config.host}:${ctx.instance.config.port}/dav/${ctx.state.session.user.email}/addressbooks/default/`,
    prodId: `//forwardemail.net//carddav//EN`
  };

  // Apple-specific adjustments
  if (ctx.state.isApple) {
    ctx.logger.debug('Creating Apple-specific address book');

    // Apple expects specific naming conventions
    addressBookConfig.name = 'Contacts';
    addressBookConfig.description = 'Default Address Book';

    // Ensure readonly is explicitly false for Apple clients
    addressBookConfig.readonly = false;

    // Apple may expect different sync token format
    addressBookConfig.synctoken = `${
      config.urls.web
    }/ns/sync-token/${Date.now()}`;

    ctx.logger.debug('Apple address book config:', {
      readonly: addressBookConfig.readonly,
      name: addressBookConfig.name,
      synctoken: addressBookConfig.synctoken
    });
  }

  const createdAddressBook = await AddressBooks.create(addressBookConfig);

  ctx.logger.debug('Address book created:', {
    userAgent: ctx.headers['user-agent'],
    isApple: ctx.state.isApple,
    addressBookId: createdAddressBook.address_book_id,
    readonly: createdAddressBook.readonly,
    name: createdAddressBook.name
  });
}

module.exports = ensureDefaultAddressBook;
