/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Aliases = require('#models/aliases');
const Domains = require('#models/domains');

//
// Resolve an alias ID for an API token user: the alias must belong to the
// user, or to a domain the user administers (a plain member only reaches
// their own aliases, as in My Account).  Returns the alias ID as a string,
// or null when the user cannot access it.
//
async function getAccessibleAliasId(userId, aliasId) {
  if (!userId || typeof aliasId !== 'string' || !aliasId) return null;

  const owned = await Aliases.findOne({ id: aliasId, user: userId })
    .select('id')
    .lean()
    .exec();
  if (owned) return owned.id.toString();

  const alias = await Aliases.findOne({ id: aliasId })
    .select('id domain')
    .lean()
    .exec();
  if (!alias) return null;

  const isAdmin = await Domains.exists({
    _id: alias.domain,
    members: { $elemMatch: { user: userId, group: 'admin' } }
  });
  return isAdmin ? alias.id.toString() : null;
}

module.exports = getAccessibleAliasId;
