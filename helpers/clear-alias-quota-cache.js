/*
 Copyright (c) Forward Email LLC
 SPDX-License-Identifier: BUSL-1.1
 */

const Aliases = require('#models/aliases');

async function clearAliasQuotaCache(client, domainId) {
  if (!client) throw new TypeError('Redis client missing');
  if (!domainId) throw new TypeError('Domain ID missing');

  const aliasIds = await Aliases.distinct('id', { domain: domainId });

  if (aliasIds.length === 0) return;

  const keys = aliasIds.map((id) => `alias_quota:${id}`);
  await client.del(keys);
}

module.exports = clearAliasQuotaCache;
