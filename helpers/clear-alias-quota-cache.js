/*
 Copyright (c) Forward Email LLC
 SPDX-License-Identifier: BUSL-1.1
 */

const Aliases = require('#models/aliases');

async function clearAliasQuotaCache(client, domainIds) {
  if (!client) throw new TypeError('Redis client missing');
  if (!domainIds) throw new TypeError('Domain ID missing');

  const aliasIds = Array.isArray(domainIds)
    ? await Aliases.distinct('id', { domain: { $in: domainIds } })
    : await Aliases.distinct('id', { domain: domainIds });

  if (aliasIds.length === 0) return;

  const keys = aliasIds.map((id) => `alias_quota:${id}`);
  await client.del(keys);
}

module.exports = clearAliasQuotaCache;
