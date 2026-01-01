/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const ObjectID = require('bson-objectid');
const pickOriginal = require('@ladjs/pick-original');

const { _domainJSON } = require('./domains');
const _ = require('#helpers/lodash');
const { Aliases, Users } = require('#models');
const toObject = require('#helpers/to-object');

function json(alias) {
  const object = toObject(Aliases, alias);
  object.user = toObject(Users, alias.user);
  object.domain = ObjectID.isValid(alias.domain)
    ? alias.domain
    : _domainJSON(alias.domain);
  // Exclude internal migration tracking field from API responses
  delete object.has_storage_format_migration;
  // TODO: if alias is not on paid plan or !alias.has_recipient_verification
  //       then we should omit `alias.pending_recipients` and `alias.verified_recipients`
  return pickOriginal(
    object,
    _.isFunction(alias.toObject) ? alias.toObject() : alias
  );
}

async function list(ctx) {
  ctx.body = Array.isArray(ctx.state.domain.aliases)
    ? ctx.state.domain.aliases.map((alias) => json(alias))
    : [];
}

async function retrieve(ctx) {
  ctx.body = json(ctx.state.alias);
}

module.exports = {
  list,
  retrieve
};
