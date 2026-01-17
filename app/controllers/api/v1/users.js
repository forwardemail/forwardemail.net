/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const isSANB = require('is-string-and-not-blank');
const _ = require('#helpers/lodash');

const sendVerificationEmail = require('#helpers/send-verification-email');
const config = require('#config');
const { Users, Aliases } = require('#models');

async function create(ctx) {
  const { body } = ctx.request;

  if (!isSANB(body.password))
    throw Boom.badRequest(ctx.translateError('INVALID_PASSWORD'));

  // register the user
  const query = { email: body.email, locale: ctx.locale };
  query[config.userFields.hasVerifiedEmail] = false;
  query[config.userFields.hasSetPassword] = true;
  query[config.userFields.pendingRecovery] = false;
  query[config.lastLocaleField] = ctx.locale;

  ctx.state.user = await Users.register(query, body.password);

  // send a verification email if needed
  if (!ctx.state.user[config.userFields.hasVerifiedEmail])
    ctx.state.user = await sendVerificationEmail(ctx);

  // send the response
  const object = ctx.state.user.toObject();
  object[config.userFields.apiToken] =
    ctx.state.user[config.userFields.apiToken];
  ctx.body = object;
}

async function retrieve(ctx) {
  // Check if this is alias authentication (has session.db)
  if (ctx.state?.session?.db) {
    // Alias authentication - return alias/mailbox information
    // Fetch the alias with populated user information
    const alias = await Aliases.findById(ctx.state.user.alias_id)
      .populate('user', `id email plan ${config.userFields.isBanned}`)
      .populate('domain', 'id name plan max_quota_per_alias')
      .lean()
      .exec();

    if (!alias) throw Boom.notFound(ctx.translateError('ALIAS_DOES_NOT_EXIST'));

    // Get storage information - only meaningful for IMAP-enabled aliases
    // If alias doesn't have IMAP, storage values should be 0 since no database exists
    const storageUsed = alias.has_imap ? alias.storage_used || 0 : 0;
    const maxQuotaPerAlias = alias.has_imap
      ? alias.domain.max_quota_per_alias || config.maxQuotaPerAlias
      : 0;

    // Return alias account information
    ctx.body = {
      id: alias.id,
      object: 'alias',
      name: alias.name,
      email: `${alias.name}@${alias.domain.name}`,
      domain_id: alias.domain.id,
      domain_name: alias.domain.name,
      storage_used: storageUsed,
      storage_quota: maxQuotaPerAlias,
      has_imap: alias.has_imap,
      has_pgp: alias.has_pgp,
      public_key: alias.public_key,
      locale: alias.locale || ctx.locale,
      created_at: alias.created_at,
      updated_at: alias.updated_at
    };
  } else {
    // User authentication - return user account information
    ctx.body = ctx.state.user.toObject();
  }
}

async function update(ctx) {
  const { body } = ctx.request;

  if (_.isString(body.email)) ctx.state.user.email = body.email;

  if (_.isString(body[config.passport.fields.givenName]))
    ctx.state.user[config.passport.fields.givenName] =
      body[config.passport.fields.givenName];

  if (_.isString(body[config.passport.fields.familyName]))
    ctx.state.user[config.passport.fields.familyName] =
      body[config.passport.fields.familyName];

  if (_.isString(body.avatar_url)) ctx.state.user.avatar_url = body.avatar_url;

  ctx.state.user = await ctx.state.user.save();
  ctx.body = ctx.state.user.toObject();
}

module.exports = { create, retrieve, update };
