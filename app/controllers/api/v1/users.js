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

const ALIAS_SETTINGS_SCHEMA = Aliases.schema.path('settings')?.schema;
const ALIAS_SETTINGS_PATHS = ALIAS_SETTINGS_SCHEMA
  ? Object.keys(ALIAS_SETTINGS_SCHEMA.paths).filter((path) => path !== '_id')
  : [];
const OPTIONAL_STRING_SETTINGS = [
  {
    path: 'mail.archive_folder',
    errorKey: 'SETTINGS_ARCHIVE_FOLDER_INVALID'
  },
  {
    path: 'mail.sent_folder',
    errorKey: 'SETTINGS_SENT_FOLDER_INVALID'
  },
  {
    path: 'mail.drafts_folder',
    errorKey: 'SETTINGS_DRAFTS_FOLDER_INVALID'
  }
];
const isOptionalString = (value) =>
  value === null || value === undefined || isSANB(value);

function serializeAliasSettings(alias) {
  const sourceSettings = alias?.settings || {};
  const settingsDoc = new Aliases({ settings: sourceSettings }).settings;
  return settingsDoc?.toObject ? settingsDoc.toObject() : {};
}

function serializeAliasResponse(alias, ctx) {
  const storageUsed = alias.has_imap ? alias.storage_used || 0 : 0;
  const maxQuotaPerAlias = alias.has_imap
    ? alias.domain.max_quota_per_alias || config.maxQuotaPerAlias
    : 0;

  return {
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
    settings: serializeAliasSettings(alias)
  };
}

async function updateAliasSettingsForContext(ctx, body) {
  const user = ctx.state?.user;
  if (!user || !user.alias_id)
    throw Boom.unauthorized(ctx.translateError('SETTINGS_ALIAS_AUTH_REQUIRED'));

  if (!mongoose.isValidObjectId(user.alias_id))
    throw Boom.unauthorized(ctx.translateError('SETTINGS_INVALID_ALIAS_ID'));

  if (body && typeof body !== 'object')
    throw Boom.badRequest(ctx.translateError('INVALID_REQUEST_BODY'));

  const alias = await Aliases.findById(user.alias_id)
    .populate('domain', 'id name plan max_quota_per_alias')
    .exec();
  if (!alias)
    throw Boom.unauthorized(ctx.translateError('SETTINGS_INVALID_ALIAS_ID'));

  const updates = {};
  if (body?.settings && _.isPlainObject(body.settings)) {
    for (const path of ALIAS_SETTINGS_PATHS) {
      const value = _.get(body.settings, path);
      if (value === undefined) continue;
      updates[path] = value;
    }
  }

  for (const { path, errorKey } of OPTIONAL_STRING_SETTINGS) {
    if (!Object.prototype.hasOwnProperty.call(updates, path)) continue;
    if (!isOptionalString(updates[path])) {
      throw Boom.badRequest(ctx.translateError(errorKey));
    }
  }

  for (const [path, value] of Object.entries(updates)) {
    if (value === undefined) continue;
    alias.set(`settings.${path}`, value);
  }

  await alias.save();
  return alias;
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

    ctx.body = serializeAliasResponse(alias, ctx);
  } else {
    // User authentication - return user account information
    ctx.body = ctx.state.user.toObject();
  }
}

async function update(ctx) {
  const { body } = ctx.request;

  if (ctx.state?.session?.db) {
    const alias = await updateAliasSettingsForContext(ctx, body);

    if (!alias) throw Boom.notFound(ctx.translateError('ALIAS_DOES_NOT_EXIST'));

    ctx.body = serializeAliasResponse(alias, ctx);
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
