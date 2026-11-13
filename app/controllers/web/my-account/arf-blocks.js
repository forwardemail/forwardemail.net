/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Senders blocked for an alias's forwarding destinations after their
// recipient reported them as spam (see `helpers/arf-recipient-block.js`):
// listed on the alias's page, where they can be lifted
//

const punycode = require('node:punycode');

const Boom = require('@hapi/boom');
const isSANB = require('is-string-and-not-blank');

const isEmail = require('#helpers/is-email');
const {
  canonical,
  listBlocks,
  unblock
} = require('#helpers/arf-recipient-block');

// the alias's forwarding destinations (email addresses, as blocks name them)
function getDestinations(alias) {
  return (Array.isArray(alias?.recipients) ? alias.recipients : [])
    .filter((recipient) => typeof recipient === 'string' && isEmail(recipient))
    .map((recipient) => canonical(recipient));
}

// the alias's address (mail to it is what its blocks are for)
function getAddress(ctx) {
  return `${ctx.state.alias.name}@${ctx.state.domain.name}`;
}

async function retrieveArfBlocks(ctx, next) {
  ctx.state.arfBlocks = [];
  try {
    const destinations = new Set(getDestinations(ctx.state.alias));
    const blocks = await listBlocks(
      ctx.client,
      ctx.state.alias._id,
      getAddress(ctx)
    );
    ctx.state.arfBlocks = blocks.filter((block) =>
      destinations.has(block.destination)
    );
  } catch (err) {
    // (the page is shown without them)
    ctx.logger.warn(err);
  }

  return next();
}

async function removeArfBlock(ctx) {
  const { destination, sender } = ctx.request.body;
  if (
    !isSANB(destination) ||
    !isSANB(sender) ||
    destination.length > 320 ||
    sender.length > 320 ||
    !isEmail(destination) ||
    !isEmail(sender) ||
    !getDestinations(ctx.state.alias).includes(canonical(destination))
  )
    throw Boom.badRequest(ctx.translateError('UNKNOWN_ERROR'));

  // (none lifted when there was none, e.g. lifted already, or made again by a
  //  report as it was being lifted: it is still listed)
  const lifted = await unblock(
    ctx.client,
    ctx.state.alias._id,
    destination,
    sender
  );

  ctx.flash('custom', {
    title: ctx.request.t(lifted ? 'Success' : 'Error'),
    text: ctx.translate(lifted ? 'REQUEST_OK' : 'UNKNOWN_ERROR'),
    type: lifted ? 'success' : 'error',
    toast: true,
    showConfirmButton: false,
    timer: 3000,
    position: 'top'
  });
  const redirectTo = ctx.state.l(
    `/my-account/domains/${punycode.toASCII(ctx.state.domain.name)}/aliases/${
      ctx.state.alias.id
    }`
  );
  if (ctx.accepts('html')) ctx.redirect(redirectTo);
  else ctx.body = { redirectTo };
}

module.exports = { retrieveArfBlocks, removeArfBlock };
