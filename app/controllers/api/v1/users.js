/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const mongoose = require('mongoose');
const isSANB = require('is-string-and-not-blank');
const _ = require('#helpers/lodash');

const sendVerificationEmail = require('#helpers/send-verification-email');
const config = require('#config');
const { Users, Aliases } = require('#models');

const ALIAS_SETTINGS_FIELDS = [
  'appearance_theme',
  'appearance_layout_mode',
  'compose_plain_default',
  'mail_messages_per_page',
  'mail_archive_folder',
  'search_body_indexing',
  'search_saved_searches',
  'prefetch_enabled',
  'prefetch_folders',
  'prefetch_mode',
  'shortcuts',
  'label_settings',
  'security_remember_passphrase',
  'aliases_defaults'
];

function serializeAliasSettings(alias) {
  const settings = _.pick(alias, ALIAS_SETTINGS_FIELDS);
  if (!settings.shortcuts) settings.shortcuts = {};
  if (!settings.label_settings) settings.label_settings = {};
  if (!settings.aliases_defaults) settings.aliases_defaults = {};
  return settings;
}

function getAliasContext(ctx) {
  const user = ctx.state?.user;
  if (!user || !user.alias_id)
    throw Boom.unauthorized(ctx.translateError('SETTINGS_ALIAS_AUTH_REQUIRED'));

  if (!mongoose.isValidObjectId(user.alias_id))
    throw Boom.unauthorized(ctx.translateError('SETTINGS_INVALID_ALIAS_ID'));

  return {
    aliasId: user.alias_id,
    domainName: user.domain_name,
    aliasEmail: user.username
  };
}

async function updateAliasSettingsForContext(ctx, body) {
  const aliasContext = getAliasContext(ctx);

  if (body && typeof body !== 'object')
    throw Boom.badRequest(ctx.translateError('INVALID_REQUEST_BODY'));

  const alias = await Aliases.findById(aliasContext.aliasId);
  if (!alias)
    throw Boom.unauthorized(ctx.translateError('SETTINGS_INVALID_ALIAS_ID'));

  const updates = _.pick(body, ALIAS_SETTINGS_FIELDS);
  if (
    Object.prototype.hasOwnProperty.call(updates, 'mail_archive_folder') &&
    updates.mail_archive_folder !== null &&
    updates.mail_archive_folder !== undefined &&
    typeof updates.mail_archive_folder !== 'string'
  ) {
    throw Boom.badRequest(
      ctx.translateError('SETTINGS_ARCHIVE_FOLDER_INVALID')
    );
  }

  for (const [key, value] of Object.entries(updates)) {
    if (value === undefined) continue;
    alias.set(key, value);
  }

  await alias.save();
}

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

    const storageUsed = alias.storage_used || 0;
    const maxQuotaPerAlias =
      (alias.domain && alias.domain.max_quota_per_alias) ||
      config.maxQuotaPerAlias;

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
      updated_at: alias.updated_at,
      ...serializeAliasSettings(alias)
    };
  } else {
    // User authentication - return user account information
    ctx.body = ctx.state.user.toObject();
  }
}

async function update(ctx) {
  const { body } = ctx.request;

  if (ctx.state?.session?.db) {
    await updateAliasSettingsForContext(ctx, body);

    const alias = await Aliases.findById(ctx.state.user.alias_id)
      .populate('user', `id email plan ${config.userFields.isBanned}`)
      .populate('domain', 'id name plan max_quota_per_alias')
      .lean()
      .exec();

    if (!alias) throw Boom.notFound(ctx.translateError('ALIAS_DOES_NOT_EXIST'));

    const storageUsed = alias.storage_used || 0;
    const maxQuotaPerAlias =
      (alias.domain && alias.domain.max_quota_per_alias) ||
      config.maxQuotaPerAlias;

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
      updated_at: alias.updated_at,
      ...serializeAliasSettings(alias)
    };
    return;
  }

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

module.exports = {
  create,
  retrieve,
  update,
  updateAliasSettingsForContext
};
