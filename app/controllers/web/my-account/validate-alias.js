/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const _ = require('lodash');
const isSANB = require('is-string-and-not-blank');
const slug = require('speakingurl');
const splitLines = require('split-lines');
const striptags = require('striptags');
const { boolean } = require('boolean');
const { isEmail } = require('validator');

const config = require('#config');

// eslint-disable-next-line complexity
function validateAlias(ctx, next) {
  const body = _.pick(ctx.request.body, [
    'name',
    'description',
    'labels',
    'recipients'
  ]);

  if (!isSANB(body.name)) delete body.name;

  body.description = isSANB(body.description)
    ? striptags(body.description)
    : '';

  if (isSANB(ctx.request.body.public_key))
    body.public_key = ctx.request.body.public_key;
  else if (
    typeof ctx.request.body.public_key === 'string' &&
    ctx.request.body.public_key === ''
  )
    body.public_key = '';

  if (isSANB(body.labels))
    body.labels = _.compact(
      _.uniq(
        _.map(
          splitLines(body.labels).join(' ').split(',').join(' ').split(' '),
          (label) => slug(label.trim())
        )
      )
    );
  else if (_.isArray(body.labels))
    body.labels = _.compact(
      _.uniq(
        _.map(body.labels, (label) =>
          isSANB(label) ? slug(label.trim()) : null
        )
      )
    );
  else body.labels = [];

  // has_recipient_verification (defaults to domain's setting if not set)
  if (ctx.api) {
    if (
      _.isBoolean(ctx.request.body.has_recipient_verification) ||
      isSANB(ctx.request.body.has_recipient_verification)
    )
      body.has_recipient_verification = boolean(
        ctx.request.body.has_recipient_verification
      );
    else if (!ctx.state.alias)
      body.has_recipient_verification =
        ctx.state.domain.has_recipient_verification;
  } else {
    body.has_recipient_verification = boolean(
      ctx.request.body.has_recipient_verification
    );
  }

  if (typeof ctx.request.body.is_enabled !== 'undefined' || !ctx.api)
    body.is_enabled = boolean(ctx.request.body.is_enabled);

  if (typeof ctx.request.body.has_pgp !== 'undefined' || !ctx.api)
    body.has_pgp = boolean(ctx.request.body.has_pgp);

  if (isSANB(body.recipients))
    body.recipients = _.compact(
      _.uniq(
        _.map(
          splitLines(body.recipients).join(' ').split(',').join(' ').split(' '),
          (recipient) => recipient.trim()
        )
      )
    );
  else if (_.isArray(body.recipients))
    body.recipients = _.compact(
      _.uniq(
        _.map(body.recipients, (recipient) =>
          isSANB(recipient) ? recipient.trim() : null
        )
      )
    );
  else body.recipients = [];

  if (typeof ctx.request.body.has_imap !== 'undefined' || !ctx.api)
    body.has_imap = boolean(ctx.request.body.has_imap);

  if (ctx.api && _.isEmpty(body.recipients))
    body.recipients = [ctx.state.user.email];

  //
  // if the domain is ubuntu.com and the user is in the user group
  // then don't allow them to enable IMAP
  //
  if (Object.keys(config.ubuntuTeamMapping).includes(ctx.state.domain.name)) {
    const member = ctx.state.domain.members.find(
      (member) => member.user && member.user.id === ctx.state.user.id
    );

    if (!member)
      return ctx.throw(Boom.notFound(ctx.translateError('INVALID_USER')));

    if (member.group === 'user' && body.has_imap)
      return ctx.throw(Boom.notFound(ctx.translateError('UBUNTU_PERMISSIONS')));

    /*
    if (
      _.isArray(body.recipients) &&
      body.recipients.some(
        (r) => isEmail(r) && r.endsWith(`@${ctx.state.domain.name}`)
      )
    )
      return ctx.throw(
        Boom.notFound(ctx.translateError('UBUNTU_NOT_ALLOWED_EMAIL'))
      );
    */
  }

  ctx.state.body = body;

  return next();
}

module.exports = validateAlias;
