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
    const otherDomainsUsage = Math.max(storageUsed - storageUsedByAliases, 0);
    d.storage_quota = Math.max(
      Math.min(maxQuotaPerAlias, pooledMaxQuota - otherDomainsUsage),
      0
    );

    //
    // Expose the global pool size and other-domains usage so templates can
    // render progress-bar segments with correct percentages.
    //
    // Without these, the template would have to re-derive otherDomainsUsage
    // from `storage_used - storage_used_by_aliases` and divide by
    // `storage_quota` — but `storage_quota` has already been reduced by
    // otherDomainsUsage, causing the "other domains" percentage to exceed
    // 100% and the total bar to overflow (see #456).
    //
    d.storage_pooled_max_quota = pooledMaxQuota;
    d.storage_other_domains_usage = otherDomainsUsage;
  } catch (err) {
    logger.fatal(err);
  }

  return d;
}

module.exports = populateDomainStorage;
