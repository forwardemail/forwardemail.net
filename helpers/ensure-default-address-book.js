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

    // address book obj

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
    url: `${ctx.instance.config.protocol}://${ctx.instance.config.host}:${ctx.instance.config.port}/dav/${ctx.state.session.user.username}/addressbooks/default/`,
    // TODO: isn't this automatic (?)
    prodId: `//forwardemail.net//carddav//EN`
  });
}

module.exports = ensureDefaultAddressBook;
