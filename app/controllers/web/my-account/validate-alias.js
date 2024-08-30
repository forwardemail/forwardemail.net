/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const RE2 = require('re2');
const _ = require('lodash');
const bytes = require('bytes');
const isSANB = require('is-string-and-not-blank');
const slug = require('speakingurl');
const splitLines = require('split-lines');
const striptags = require('striptags');
const { boolean } = require('boolean');
// const { isEmail } = require('validator');

const ensureDomainAdmin = require('./ensure-domain-admin');

const config = require('#config');

//
// NOTE: this regex is not safe according to `safe-regex2` so we use `re2` to wrap it
//       https://github.com/visionmedia/bytes.js/blob/9ddc13b6c66e0cb293616fba246e05db4b6cef4d/index.js#L37C5-L37C16
//
const REGEX_BYTES = new RE2(/^((-|\+)?(\d+(?:\.\d+)?)) *(kb|mb|gb|tb|pb)$/i);

// eslint-disable-next-line complexity
function validateAlias(ctx, next) {
  const body = _.pick(ctx.request.body, [
    'name',
    'description',
    'labels',
    'recipients',
    'error_code_if_disabled',
    'max_quota'
  ]);

  //
  // NOTE: if body includes `max_quota` and user was not an admin of the domain
  //       then throw a permission/forbidden error (either through API or web form manipulation)
  //
  if (typeof body.max_quota !== 'undefined') ensureDomainAdmin(ctx); // this will throw an error

  // validate `body.max_quota` if a value was passed
  if (
    typeof body.max_quota !== 'undefined' &&
    typeof body.max_quota !== 'string'
  )
    throw Boom.badRequest(ctx.translateError('INVALID_BYTES'));

  // indicates reset of the value
  if (body.max_quota === '') {
    body.max_quota = Number.isFinite(ctx.state.domain.max_quota_per_alias)
      ? ctx.state.domain.max_quota_per_alias
      : config.maxQuotaPerAlias;
  } else if (typeof body.max_quota === 'string') {
    // test against bytes regex
    if (!REGEX_BYTES.test(body.max_quota))
      throw Boom.badRequest(ctx.translateError('INVALID_BYTES'));
    // otherwise convert the value
    body.max_quota = bytes(body.max_quota);
  }

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

  //
  // error_code_if_disabled
  //
  if (typeof body.error_code_if_disabled === 'string')
    body.error_code_if_disabled = Number.parseInt(
      body.error_code_if_disabled,
      10
    );

  if (
    body.error_code_if_disabled !== undefined &&
    (!Number.isFinite(body.error_code_if_disabled) ||
      ![250, 421, 550].includes(body.error_code_if_disabled))
  )
    return ctx.throw(
      Boom.badRequest(ctx.translateError('INVALID_ERROR_CODE_IF_DISABLED'))
    );

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
  if (
    ctx.state.domain.plan === 'team' &&
    ctx.state.domain.has_txt_record &&
    Object.keys(config.ubuntuTeamMapping).includes(ctx.state.domain.name)
  ) {
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
        (r) => isEmail(r, { ignore_max_length: true }) && r.endsWith(`@${ctx.state.domain.name}`)
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
