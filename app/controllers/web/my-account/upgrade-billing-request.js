/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const ms = require('ms');

const emailHelper = require('#helpers/email');

// payment link for storage (each one bought adds 10 GB)
const STORAGE_CHECKOUT_URL =
  'https://checkout.forwardemail.net/b/fZu5kE9al2Yj6iP25Fa3u0b';

async function upgradeBillingRequest(ctx) {
  const { kind, upgrade_option } = ctx.request.body;

  //
  // NOTE: outbound SMTP is unlimited and reputation-based
  //       (thresholds grow with reputation, so there is no SMTP upgrade)
  //
  const validKinds = ['storage_limit'];
  if (!kind || typeof kind !== 'string' || !validKinds.includes(kind))
    throw Boom.badRequest(ctx.translateError('INVALID_UPGRADE_KIND'));

  // TODO: Should move this to a central place to render the page
  // from and also validate against. Possible billing changes would remove
  // this need completely though.
  const validOptions = {
    storage_limit: ['+10 GB', '+20 GB', '+30 GB', '+40 GB', '+50 GB', 'Other']
  };

  if (
    !upgrade_option ||
    typeof upgrade_option !== 'string' ||
    !validOptions[kind].includes(upgrade_option)
  )
    throw Boom.badRequest(ctx.translateError('INVALID_STORAGE_OPTION'));

  const { user } = ctx.state;
  const key = `upgrade_request:${kind}:${user.id}`;
  const cache = await ctx.client.get(key);

  if (cache)
    throw Boom.badRequest(
      ctx.translateError('STORAGE_UPGRADE_LINK_ALREADY_SENT')
    );

  //
  // storage upgrades are a manual process, so the user is emailed the
  // payment link (with their email filled in) and asked to reply once they
  // paid, so the increase can be confirmed (admins are not emailed, since
  // nothing can be done until the user pays)
  //
  const url = `${STORAGE_CHECKOUT_URL}?prefilled_email=${encodeURIComponent(
    user.email
  )}`;
  // (sent from the default address, i.e. support, with its display name)
  await emailHelper({
    template: 'storage-upgrade',
    message: {
      to: user.email,
      subject: ctx.translate('STORAGE_UPGRADE_LINK_SUBJECT')
    },
    locals: {
      message: ctx.translate(
        'STORAGE_UPGRADE_LINK_MESSAGE',
        upgrade_option === 'Other' ? ctx.request.t('Other') : upgrade_option,
        url
      ),
      locale: ctx.locale
    }
  });

  await ctx.client.set(key, true, 'PX', ms('3d'));

  ctx.flash('custom', {
    title: ctx.translate('SUCCESS'),
    text: ctx.translate('STORAGE_UPGRADE_LINK_SENT'),
    type: 'success',
    toast: true,
    showConfirmButton: false,
    timer: 10000,
    position: 'top'
  });

  if (ctx.accepts('html')) ctx.redirect('back');
  else ctx.body = { reloadPage: true };
}

module.exports = upgradeBillingRequest;
