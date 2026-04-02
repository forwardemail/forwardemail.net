/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Domains = require('#models/domains');
const logger = require('#helpers/logger');

async function populateDomainStorage(d, locale) {
  if (!d._id) throw new TypeError('_id missing');
  if (d.is_global || d.plan === 'free') return d;
  try {
    const [
      storageUsed,
      storageUsedByAliases,
      maxQuotaPerAlias,
      pooledMaxQuota
    ] = await Promise.all([
      Domains.getStorageUsed(d._id, locale),
      Domains.getStorageUsed(d._id, locale, true),
      Domains.getMaxQuota(d._id),
      Domains.getMaxQuota(d._id, undefined, locale, { pooled: true })
    ]);
    d.storage_used = storageUsed;
    d.storage_used_by_aliases = storageUsedByAliases;

    //
    // Cap the effective quota by the global pool's remaining capacity.
    //
    // `storageUsed` is the pooled total across ALL of the admin's domains.
    // `storageUsedByAliases` is only this domain's aliases.
    // `maxQuotaPerAlias` is the domain-level cap (may be lower than global).
    // `pooledMaxQuota` is the admin user's global storage allocation.
    //
    // The space consumed by OTHER domains is not available to this domain,
    // so the effective quota is the lesser of:
    //   - the domain's own quota cap (maxQuotaPerAlias)
    //   - the global pool's remaining capacity + this domain's own usage
    //     (i.e. pooledMaxQuota - otherDomainsUsage)
    //
    const otherDomainsUsage = storageUsed - storageUsedByAliases;
    d.storage_quota = Math.max(
      Math.min(maxQuotaPerAlias, pooledMaxQuota - otherDomainsUsage),
      0
    );
  } catch (err) {
    logger.fatal(err);
  }

  return d;
}

module.exports = populateDomainStorage;
