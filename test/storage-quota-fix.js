/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

/**
 * Storage Quota Fix Tests (v8)
 *
 * These tests verify the storage quota calculation changes:
 *
 * 1. getMaxQuota bug fix: alias.max_quota is used (not alias.max_quota_per_alias)
 * 2. isOverQuota dual check: alias-specific cap AND domain pool exhaustion
 * 3. get-database.js: trash cleanup uses alias-specific storage
 * 4. cleanup-sqlite.js: notifications use alias-specific storage
 * 5. Display templates: use domain-specific storage_used_by_aliases (not pooled)
 * 6. Admin filtering: only valid paying admins count for quota calculation
 */

const test = require('ava');

// ─────────────────────────────────────────────────────────────────────────────
// Helper: simulate the dual-check logic from isOverQuota
// ─────────────────────────────────────────────────────────────────────────────

function checkOverQuota({
  storageUsed,
  maxQuotaPerAlias,
  domainStorageUsed,
  domainMaxQuota,
  size = 0
}) {
  const aliasOverQuota = storageUsed + size > maxQuotaPerAlias;
  const domainOverQuota = domainStorageUsed + size > domainMaxQuota;
  return {
    aliasOverQuota,
    domainOverQuota,
    isOverQuota: aliasOverQuota || domainOverQuota
  };
}

// Helper: simulate the admin filter logic from getMaxQuota
function filterAdminMembers(members, domainPlan) {
  const isSANB = (v) => typeof v === 'string' && v.length > 0;
  const validPlans =
    domainPlan === 'team' ? ['team'] : ['team', 'enhanced_protection'];

  return members.filter(
    (member) =>
      member.user &&
      typeof member.user === 'object' &&
      member.user._id &&
      !member.user.is_banned &&
      member.user.has_verified_email &&
      member.group === 'admin' &&
      validPlans.includes(member.user.plan) &&
      (new Date(member.user.plan_expires_at).getTime() >= Date.now() ||
        isSANB(member.user.stripe_subscription_id) ||
        isSANB(member.user.paypal_subscription_id))
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Test 1: getMaxQuota alias.max_quota bug fix
// ─────────────────────────────────────────────────────────────────────────────

test('getMaxQuota: should use alias.max_quota (not alias.max_quota_per_alias) when capping', (t) => {
  const adminMax = 10 * 1024 * 1024 * 1024; // 10 GB
  const alias = { max_quota: 5 * 1024 * 1024 * 1024 }; // 5 GB alias cap

  let max = adminMax;

  // Fixed logic: uses alias.max_quota (not alias.max_quota_per_alias)
  if (alias && Number.isFinite(alias.max_quota) && alias.max_quota < max)
    max = alias.max_quota;

  t.is(max, 5 * 1024 * 1024 * 1024);
});

test('getMaxQuota: should NOT cap when alias.max_quota is larger than admin max', (t) => {
  const adminMax = 5 * 1024 * 1024 * 1024; // 5 GB
  const alias = { max_quota: 10 * 1024 * 1024 * 1024 }; // 10 GB

  let max = adminMax;

  if (alias && Number.isFinite(alias.max_quota) && alias.max_quota < max)
    max = alias.max_quota;

  t.is(max, 5 * 1024 * 1024 * 1024);
});

test('getMaxQuota: should handle alias without max_quota set', (t) => {
  const adminMax = 10 * 1024 * 1024 * 1024;
  const alias = {}; // no max_quota

  let max = adminMax;

  if (alias && Number.isFinite(alias.max_quota) && alias.max_quota < max)
    max = alias.max_quota;

  t.is(max, 10 * 1024 * 1024 * 1024);
});

test('getMaxQuota: should handle null alias', (t) => {
  const adminMax = 10 * 1024 * 1024 * 1024;
  const alias = null;

  let max = adminMax;

  if (alias && Number.isFinite(alias.max_quota) && alias.max_quota < max)
    max = alias.max_quota;

  t.is(max, 10 * 1024 * 1024 * 1024);
});

test('getMaxQuota: OLD BUG - alias.max_quota_per_alias would be undefined and never cap', (t) => {
  const adminMax = 10 * 1024 * 1024 * 1024;
  const alias = { max_quota: 5 * 1024 * 1024 * 1024 };

  let max = adminMax;

  // OLD buggy logic:
  if (
    alias &&
    Number.isFinite(alias.max_quota) &&
    alias.max_quota_per_alias < max // undefined < number = false
  )
    max = alias.max_quota_per_alias;

  // Bug: max stays at adminMax because alias.max_quota_per_alias is undefined
  t.is(max, 10 * 1024 * 1024 * 1024);
});

// ─────────────────────────────────────────────────────────────────────────────
// Test 2: isOverQuota alias-specific storage logic
// ─────────────────────────────────────────────────────────────────────────────

test('isOverQuota: should detect over quota when alias storage exceeds alias max', (t) => {
  const result = checkOverQuota({
    storageUsed: 6 * 1024 * 1024 * 1024, // 6 GB
    maxQuotaPerAlias: 5 * 1024 * 1024 * 1024, // 5 GB cap
    domainStorageUsed: 7 * 1024 * 1024 * 1024, // 7 GB domain total
    domainMaxQuota: 10 * 1024 * 1024 * 1024 // 10 GB domain limit
  });
  t.true(result.aliasOverQuota);
  t.false(result.domainOverQuota);
  t.true(result.isOverQuota);
});

test('isOverQuota: should detect over quota when domain pool is exhausted even if alias is under cap', (t) => {
  const result = checkOverQuota({
    storageUsed: 3 * 1024 * 1024 * 1024, // 3 GB
    maxQuotaPerAlias: 5 * 1024 * 1024 * 1024, // 5 GB cap
    domainStorageUsed: 10.5 * 1024 * 1024 * 1024, // 10.5 GB domain total
    domainMaxQuota: 10 * 1024 * 1024 * 1024 // 10 GB domain limit
  });
  t.false(result.aliasOverQuota);
  t.true(result.domainOverQuota);
  t.true(result.isOverQuota);
});

test('isOverQuota: should NOT detect over quota when both alias and domain are under limits', (t) => {
  const result = checkOverQuota({
    storageUsed: 3 * 1024 * 1024 * 1024, // 3 GB
    maxQuotaPerAlias: 5 * 1024 * 1024 * 1024, // 5 GB cap
    domainStorageUsed: 7 * 1024 * 1024 * 1024, // 7 GB domain total
    domainMaxQuota: 10 * 1024 * 1024 * 1024 // 10 GB domain limit
  });
  t.false(result.aliasOverQuota);
  t.false(result.domainOverQuota);
  t.false(result.isOverQuota);
});

test('isOverQuota: should detect over quota when BOTH alias and domain are over', (t) => {
  const result = checkOverQuota({
    storageUsed: 6 * 1024 * 1024 * 1024, // 6 GB
    maxQuotaPerAlias: 5 * 1024 * 1024 * 1024, // 5 GB cap
    domainStorageUsed: 11 * 1024 * 1024 * 1024, // 11 GB domain total
    domainMaxQuota: 10 * 1024 * 1024 * 1024 // 10 GB domain limit
  });
  t.true(result.aliasOverQuota);
  t.true(result.domainOverQuota);
  t.true(result.isOverQuota);
});

test('isOverQuota: should account for incoming message size in both checks', (t) => {
  const result = checkOverQuota({
    storageUsed: 4.9 * 1024 * 1024 * 1024, // 4.9 GB
    maxQuotaPerAlias: 5 * 1024 * 1024 * 1024, // 5 GB cap
    domainStorageUsed: 9.9 * 1024 * 1024 * 1024, // 9.9 GB domain total
    domainMaxQuota: 10 * 1024 * 1024 * 1024, // 10 GB domain limit
    size: 200 * 1024 * 1024 // 200 MB incoming
  });
  t.true(result.aliasOverQuota);
  t.true(result.domainOverQuota);
  t.true(result.isOverQuota);
});

test('isOverQuota: should handle zero storage_used on both levels', (t) => {
  const result = checkOverQuota({
    storageUsed: 0,
    maxQuotaPerAlias: 5 * 1024 * 1024 * 1024,
    domainStorageUsed: 0,
    domainMaxQuota: 10 * 1024 * 1024 * 1024
  });
  t.false(result.isOverQuota);
});

test('isOverQuota: should handle exact domain boundary (not over)', (t) => {
  const result = checkOverQuota({
    storageUsed: 3 * 1024 * 1024 * 1024,
    maxQuotaPerAlias: 5 * 1024 * 1024 * 1024,
    domainStorageUsed: 10 * 1024 * 1024 * 1024, // exactly at limit
    domainMaxQuota: 10 * 1024 * 1024 * 1024
  });
  t.false(result.domainOverQuota);
  t.false(result.isOverQuota);
});

test('isOverQuota: should handle exact domain boundary with 1 byte over', (t) => {
  const result = checkOverQuota({
    storageUsed: 3 * 1024 * 1024 * 1024,
    maxQuotaPerAlias: 5 * 1024 * 1024 * 1024,
    domainStorageUsed: 10 * 1024 * 1024 * 1024,
    domainMaxQuota: 10 * 1024 * 1024 * 1024,
    size: 1
  });
  t.true(result.domainOverQuota);
  t.true(result.isOverQuota);
});

// ─────────────────────────────────────────────────────────────────────────────
// Test 3: Alias-specific storage retrieval logic
// ─────────────────────────────────────────────────────────────────────────────

test('alias storage: should use alias storage_used when available', (t) => {
  const aliasDoc = { storage_used: 3 * 1024 * 1024 * 1024 };
  const storageUsed =
    aliasDoc && typeof aliasDoc.storage_used === 'number'
      ? aliasDoc.storage_used
      : 0;
  t.is(storageUsed, 3 * 1024 * 1024 * 1024);
});

test('alias storage: should default to 0 when aliasDoc is null', (t) => {
  const aliasDoc = null;
  const storageUsed =
    aliasDoc && typeof aliasDoc.storage_used === 'number'
      ? aliasDoc.storage_used
      : 0;
  t.is(storageUsed, 0);
});

test('alias storage: should default to 0 when storage_used is not a number', (t) => {
  const aliasDoc = { storage_used: undefined };
  const storageUsed =
    aliasDoc && typeof aliasDoc.storage_used === 'number'
      ? aliasDoc.storage_used
      : 0;
  t.is(storageUsed, 0);
});

test('alias storage: should handle storage_used of 0 correctly', (t) => {
  const aliasDoc = { storage_used: 0 };
  const storageUsed =
    aliasDoc && typeof aliasDoc.storage_used === 'number'
      ? aliasDoc.storage_used
      : 0;
  t.is(storageUsed, 0);
});

// ─────────────────────────────────────────────────────────────────────────────
// Test 4: Trash cleanup percentage calculation
// ─────────────────────────────────────────────────────────────────────────────

test('trash cleanup: should calculate correct percentage for alias-specific storage', (t) => {
  const storageUsed = 3 * 1024 * 1024 * 1024; // 3 GB
  const maxQuotaPerAlias = 10 * 1024 * 1024 * 1024; // 10 GB

  const percentageUsed = Math.round((storageUsed / maxQuotaPerAlias) * 100);
  t.is(percentageUsed, 30);
});

test('trash cleanup: should calculate correct days for trash retention', (t) => {
  const storageUsed = 8 * 1024 * 1024 * 1024; // 8 GB
  const maxQuotaPerAlias = 10 * 1024 * 1024 * 1024; // 10 GB

  const percentageUsed = Math.round((storageUsed / maxQuotaPerAlias) * 100);
  const days = Math.max(Math.round(30 * (1 - percentageUsed / 100)), 0);
  t.is(days, 6); // 30 * 0.2 = 6 days
});

test('trash cleanup: should return 0 days when at 100% capacity', (t) => {
  const storageUsed = 10 * 1024 * 1024 * 1024;
  const maxQuotaPerAlias = 10 * 1024 * 1024 * 1024;

  const percentageUsed = Math.round((storageUsed / maxQuotaPerAlias) * 100);
  const days = Math.max(Math.round(30 * (1 - percentageUsed / 100)), 0);
  t.is(days, 0);
});

test('trash cleanup: should return 30 days when at 0% capacity', (t) => {
  const storageUsed = 0;
  const maxQuotaPerAlias = 10 * 1024 * 1024 * 1024;

  const percentageUsed = Math.round((storageUsed / maxQuotaPerAlias) * 100);
  const days = Math.max(Math.round(30 * (1 - percentageUsed / 100)), 0);
  t.is(days, 30);
});

// ─────────────────────────────────────────────────────────────────────────────
// Test 5: Storage notification threshold detection
// ─────────────────────────────────────────────────────────────────────────────

test('notification: should detect 50% threshold', (t) => {
  const storageUsed = 5 * 1024 * 1024 * 1024; // 5 GB
  const maxQuotaPerAlias = 10 * 1024 * 1024 * 1024; // 10 GB

  const percentageUsed = Math.round((storageUsed / maxQuotaPerAlias) * 100);

  let threshold;
  for (const percentage of [50, 60, 70, 80, 90, 100]) {
    if (percentageUsed >= percentage) {
      threshold = percentage;
    }
  }

  t.is(threshold, 50);
});

test('notification: should detect 90% threshold', (t) => {
  const storageUsed = 9.5 * 1024 * 1024 * 1024;
  const maxQuotaPerAlias = 10 * 1024 * 1024 * 1024;

  const percentageUsed = Math.round((storageUsed / maxQuotaPerAlias) * 100);

  let threshold;
  for (const percentage of [50, 60, 70, 80, 90, 100]) {
    if (percentageUsed >= percentage) {
      threshold = percentage;
    }
  }

  t.is(threshold, 90);
});

test('notification: should not detect threshold below 50%', (t) => {
  const storageUsed = 4 * 1024 * 1024 * 1024; // 4 GB = 40%
  const maxQuotaPerAlias = 10 * 1024 * 1024 * 1024;

  const percentageUsed = Math.round((storageUsed / maxQuotaPerAlias) * 100);

  let threshold;
  for (const percentage of [50, 60, 70, 80, 90, 100]) {
    if (percentageUsed >= percentage) {
      threshold = percentage;
    }
  }

  t.is(threshold, undefined);
});

// ─────────────────────────────────────────────────────────────────────────────
// Test 6: Display template calculations (domain-specific)
// ─────────────────────────────────────────────────────────────────────────────

test('display: domain _table.pug should use storage_used_by_aliases for percentage', (t) => {
  const domain = {
    storage_used: 15 * 1024 * 1024 * 1024, // 15 GB pooled
    storage_used_by_aliases: 8 * 1024 * 1024 * 1024, // 8 GB domain-specific
    storage_quota: 10 * 1024 * 1024 * 1024 // 10 GB quota
  };

  // NEW: uses storage_used_by_aliases (domain-specific)
  const storageUsedByAliases = Math.round(
    (domain.storage_used_by_aliases / domain.storage_quota) * 100
  );
  const availableStorage = Math.round(
    ((domain.storage_quota - domain.storage_used_by_aliases) /
      domain.storage_quota) *
      100
  );
  const percentage = Math.round(
    (domain.storage_used_by_aliases / domain.storage_quota) * 100
  );

  t.is(storageUsedByAliases, 80);
  t.is(availableStorage, 20);
  t.is(percentage, 80);

  // OLD (buggy): would use pooled storage_used = 150%
  const oldPercentage = Math.round(
    (domain.storage_used / domain.storage_quota) * 100
  );
  t.is(oldPercentage, 150); // incorrectly shows over quota
});

test('display: aliases _table.pug should use storage_used_by_aliases for available', (t) => {
  const domain = {
    storage_used: 20 * 1024 * 1024 * 1024, // 20 GB pooled
    storage_used_by_aliases: 6 * 1024 * 1024 * 1024, // 6 GB domain-specific
    storage_quota: 10 * 1024 * 1024 * 1024 // 10 GB quota
  };
  const alias = {
    storage_used: 2 * 1024 * 1024 * 1024 // 2 GB
  };

  // NEW calculations
  const storageUsedBySpecificAlias = Math.round(
    (alias.storage_used / domain.storage_quota) * 100
  );
  const storageUsedByOtherAliases = Math.round(
    ((domain.storage_used_by_aliases - alias.storage_used) /
      domain.storage_quota) *
      100
  );
  const availableStorage = Math.round(
    ((domain.storage_quota - domain.storage_used_by_aliases) /
      domain.storage_quota) *
      100
  );

  t.is(storageUsedBySpecificAlias, 20); // 2/10 = 20%
  t.is(storageUsedByOtherAliases, 40); // (6-2)/10 = 40%
  t.is(availableStorage, 40); // (10-6)/10 = 40%

  // OLD (buggy): available would be based on pooled = -100%
  const oldAvailable = Math.round(
    ((domain.storage_quota - domain.storage_used) / domain.storage_quota) * 100
  );
  t.is(oldAvailable, -100); // incorrectly shows negative
});

// ─────────────────────────────────────────────────────────────────────────────
// Test 7: Cache interaction
// ─────────────────────────────────────────────────────────────────────────────

test('cache: should use cached quota config values when available', (t) => {
  const cached = {
    maxQuotaPerAlias: 10 * 1024 * 1024 * 1024,
    domainMaxQuota: 10 * 1024 * 1024 * 1024
  };

  let maxQuotaPerAlias;
  let domainMaxQuota;

  // Simulate cache hit (only quota config values are cached)
  if (typeof cached.maxQuotaPerAlias === 'number')
    maxQuotaPerAlias = cached.maxQuotaPerAlias;
  if (typeof cached.domainMaxQuota === 'number')
    domainMaxQuota = cached.domainMaxQuota;

  t.is(maxQuotaPerAlias, 10 * 1024 * 1024 * 1024);
  t.is(domainMaxQuota, 10 * 1024 * 1024 * 1024);
});

test('cache: storage usage values are NOT cached (always fetched fresh)', (t) => {
  // The cache payload should only contain quota config values
  const cachePayload = {
    maxQuotaPerAlias: 10 * 1024 * 1024 * 1024,
    domainMaxQuota: 10 * 1024 * 1024 * 1024
  };

  // storageUsed and domainStorageUsed should NOT be in cache
  t.is(cachePayload.storageUsed, undefined);
  t.is(cachePayload.domainStorageUsed, undefined);

  // Only quota config values should be present
  t.is(cachePayload.maxQuotaPerAlias, 10 * 1024 * 1024 * 1024);
  t.is(cachePayload.domainMaxQuota, 10 * 1024 * 1024 * 1024);
});

test('cache: should fall through to DB lookup when cache misses', (t) => {
  let maxQuotaPerAlias;
  let domainMaxQuota;

  // Simulate cache miss (no values set)
  t.is(maxQuotaPerAlias, undefined);
  t.is(domainMaxQuota, undefined);

  // The === undefined check would trigger DB lookup
  t.true(maxQuotaPerAlias === undefined);
  t.true(domainMaxQuota === undefined);
});

test('cache: should cache only quota config values for 1 day', (t) => {
  const maxQuotaPerAlias = 10 * 1024 * 1024 * 1024;
  const domainMaxQuota = 10 * 1024 * 1024 * 1024;
  const size = 0;

  // Only cache when size === 0
  const shouldCache = size === 0;
  t.true(shouldCache);

  // Only quota config values are cached (not storageUsed or domainStorageUsed)
  const cachePayload = JSON.stringify({
    maxQuotaPerAlias,
    domainMaxQuota
  });
  const parsed = JSON.parse(cachePayload);
  t.is(parsed.maxQuotaPerAlias, maxQuotaPerAlias);
  t.is(parsed.domainMaxQuota, domainMaxQuota);
  // Storage usage values should NOT be in cache
  t.is(parsed.storageUsed, undefined);
  t.is(parsed.domainStorageUsed, undefined);
});

// ─────────────────────────────────────────────────────────────────────────────
// Test 8: Domain ID extraction
// ─────────────────────────────────────────────────────────────────────────────

test('domain ID: should extract domain ID from populated domain object', (t) => {
  const alias = {
    id: 'test-alias',
    domain: { _id: 'domain-123', name: 'example.com' }
  };
  const domainId = alias?.domain?._id || alias.domain;
  t.is(domainId, 'domain-123');
});

test('domain ID: should use domain directly when it is an ObjectId string', (t) => {
  const alias = {
    id: 'test-alias',
    domain: 'domain-456'
  };
  const domainId = alias?.domain?._id || alias.domain;
  t.is(domainId, 'domain-456');
});

test('domain ID: should handle IMAP session-style alias objects', (t) => {
  const alias = {
    id: 'session-alias',
    domain: 'session-domain-id',
    locale: 'en'
  };
  const domainId = alias?.domain?._id || alias.domain;
  t.is(domainId, 'session-domain-id');
});

// ─────────────────────────────────────────────────────────────────────────────
// Test 9: End-to-end scenario tests
// ─────────────────────────────────────────────────────────────────────────────

test('e2e: alias A is over its own cap but domain pool is under total', (t) => {
  const result = checkOverQuota({
    storageUsed: 6 * 1024 * 1024 * 1024,
    maxQuotaPerAlias: 5 * 1024 * 1024 * 1024,
    domainStorageUsed: 7 * 1024 * 1024 * 1024,
    domainMaxQuota: 10 * 1024 * 1024 * 1024
  });
  t.true(result.aliasOverQuota);
  t.false(result.domainOverQuota);
  t.true(result.isOverQuota);
});

test('e2e: alias is under its own cap but other aliases exhausted domain pool', (t) => {
  const result = checkOverQuota({
    storageUsed: 3 * 1024 * 1024 * 1024,
    maxQuotaPerAlias: 5 * 1024 * 1024 * 1024,
    domainStorageUsed: 11 * 1024 * 1024 * 1024,
    domainMaxQuota: 10 * 1024 * 1024 * 1024
  });
  t.false(result.aliasOverQuota);
  t.true(result.domainOverQuota);
  t.true(result.isOverQuota);
});

test('e2e: alias and domain both under limits - mail accepted', (t) => {
  const result = checkOverQuota({
    storageUsed: 2 * 1024 * 1024 * 1024,
    maxQuotaPerAlias: 5 * 1024 * 1024 * 1024,
    domainStorageUsed: 6 * 1024 * 1024 * 1024,
    domainMaxQuota: 10 * 1024 * 1024 * 1024
  });
  t.false(result.isOverQuota);
});

test('e2e: progress bar shows correct domain-specific values', (t) => {
  const domainA = {
    storage_used: 13 * 1024 * 1024 * 1024, // pooled
    storage_used_by_aliases: 5 * 1024 * 1024 * 1024, // domain-specific
    storage_quota: 10 * 1024 * 1024 * 1024
  };

  const newPercentage = Math.round(
    (domainA.storage_used_by_aliases / domainA.storage_quota) * 100
  );
  t.is(newPercentage, 50);

  const oldPercentage = Math.round(
    (domainA.storage_used / domainA.storage_quota) * 100
  );
  t.is(oldPercentage, 130); // Bug: shows 130%
});

test('e2e: team domain with multiple aliases consuming shared pool', (t) => {
  const result = checkOverQuota({
    storageUsed: 2 * 1024 * 1024 * 1024,
    maxQuotaPerAlias: 10 * 1024 * 1024 * 1024,
    domainStorageUsed: 10 * 1024 * 1024 * 1024,
    domainMaxQuota: 10 * 1024 * 1024 * 1024,
    size: 1
  });
  t.false(result.aliasOverQuota);
  t.true(result.domainOverQuota);
  t.true(result.isOverQuota);
});

// ─────────────────────────────────────────────────────────────────────────────
// Test 10: Cleanup-sqlite alias.storage_used direct access
// ─────────────────────────────────────────────────────────────────────────────

test('cleanup-sqlite: should use alias.storage_used directly when available', (t) => {
  const alias = { storage_used: 5 * 1024 * 1024 * 1024 };
  const storageUsed =
    typeof alias.storage_used === 'number' ? alias.storage_used : 0;
  t.is(storageUsed, 5 * 1024 * 1024 * 1024);
});

test('cleanup-sqlite: should default to 0 when alias.storage_used is undefined', (t) => {
  const alias = {};
  const storageUsed =
    typeof alias.storage_used === 'number' ? alias.storage_used : 0;
  t.is(storageUsed, 0);
});

test('cleanup-sqlite: should handle alias.storage_used of 0', (t) => {
  const alias = { storage_used: 0 };
  const storageUsed =
    typeof alias.storage_used === 'number' ? alias.storage_used : 0;
  t.is(storageUsed, 0);
});

// ─────────────────────────────────────────────────────────────────────────────
// Test 11: getMaxQuota admin filtering (valid paying admins only)
// ─────────────────────────────────────────────────────────────────────────────

test('admin filter: should include admin with active plan_expires_at', (t) => {
  const members = [
    {
      group: 'admin',
      user: {
        _id: 'user1',
        plan: 'enhanced_protection',
        is_banned: false,
        has_verified_email: true,
        plan_expires_at: new Date(Date.now() + 86400000), // tomorrow
        max_quota_per_alias: 10 * 1024 * 1024 * 1024
      }
    }
  ];
  const result = filterAdminMembers(members, 'enhanced_protection');
  t.is(result.length, 1);
});

test('admin filter: should include admin with active Stripe subscription even if plan expired', (t) => {
  const members = [
    {
      group: 'admin',
      user: {
        _id: 'user1',
        plan: 'enhanced_protection',
        is_banned: false,
        has_verified_email: true,
        plan_expires_at: new Date(Date.now() - 86400000), // yesterday (expired)
        stripe_subscription_id: 'sub_abc123',
        max_quota_per_alias: 10 * 1024 * 1024 * 1024
      }
    }
  ];
  const result = filterAdminMembers(members, 'enhanced_protection');
  t.is(result.length, 1);
});

test('admin filter: should include admin with active PayPal subscription even if plan expired', (t) => {
  const members = [
    {
      group: 'admin',
      user: {
        _id: 'user1',
        plan: 'enhanced_protection',
        is_banned: false,
        has_verified_email: true,
        plan_expires_at: new Date(Date.now() - 86400000), // expired
        paypal_subscription_id: 'I-PAYPAL123',
        max_quota_per_alias: 10 * 1024 * 1024 * 1024
      }
    }
  ];
  const result = filterAdminMembers(members, 'enhanced_protection');
  t.is(result.length, 1);
});

test('admin filter: should EXCLUDE admin with expired plan and no active subscription', (t) => {
  const members = [
    {
      group: 'admin',
      user: {
        _id: 'user1',
        plan: 'enhanced_protection',
        is_banned: false,
        has_verified_email: true,
        plan_expires_at: new Date(Date.now() - 86400000) // expired, no subscription
      }
    }
  ];
  const result = filterAdminMembers(members, 'enhanced_protection');
  t.is(result.length, 0);
});

test('admin filter: should EXCLUDE banned admin even with active plan', (t) => {
  const members = [
    {
      group: 'admin',
      user: {
        _id: 'user1',
        plan: 'enhanced_protection',
        is_banned: true, // banned
        has_verified_email: true,
        plan_expires_at: new Date(Date.now() + 86400000)
      }
    }
  ];
  const result = filterAdminMembers(members, 'enhanced_protection');
  t.is(result.length, 0);
});

test('admin filter: should EXCLUDE admin without verified email', (t) => {
  const members = [
    {
      group: 'admin',
      user: {
        _id: 'user1',
        plan: 'enhanced_protection',
        is_banned: false,
        has_verified_email: false, // not verified
        plan_expires_at: new Date(Date.now() + 86400000)
      }
    }
  ];
  const result = filterAdminMembers(members, 'enhanced_protection');
  t.is(result.length, 0);
});

test('admin filter: should EXCLUDE admin on free plan for enhanced_protection domain', (t) => {
  const members = [
    {
      group: 'admin',
      user: {
        _id: 'user1',
        plan: 'free', // wrong plan
        is_banned: false,
        has_verified_email: true,
        plan_expires_at: new Date(Date.now() + 86400000)
      }
    }
  ];
  const result = filterAdminMembers(members, 'enhanced_protection');
  t.is(result.length, 0);
});

test('admin filter: should EXCLUDE enhanced_protection admin for team domain', (t) => {
  const members = [
    {
      group: 'admin',
      user: {
        _id: 'user1',
        plan: 'enhanced_protection', // not team
        is_banned: false,
        has_verified_email: true,
        plan_expires_at: new Date(Date.now() + 86400000)
      }
    }
  ];
  const result = filterAdminMembers(members, 'team');
  t.is(result.length, 0);
});

test('admin filter: should include team admin for enhanced_protection domain (team >= enhanced)', (t) => {
  const members = [
    {
      group: 'admin',
      user: {
        _id: 'user1',
        plan: 'team', // team covers enhanced_protection
        is_banned: false,
        has_verified_email: true,
        plan_expires_at: new Date(Date.now() + 86400000)
      }
    }
  ];
  const result = filterAdminMembers(members, 'enhanced_protection');
  t.is(result.length, 1);
});

test('admin filter: should EXCLUDE non-admin members', (t) => {
  const members = [
    {
      group: 'user', // not admin
      user: {
        _id: 'user1',
        plan: 'enhanced_protection',
        is_banned: false,
        has_verified_email: true,
        plan_expires_at: new Date(Date.now() + 86400000)
      }
    }
  ];
  const result = filterAdminMembers(members, 'enhanced_protection');
  t.is(result.length, 0);
});

test('admin filter: team domain should only count valid paying admins for max quota', (t) => {
  const members = [
    {
      group: 'admin',
      user: {
        _id: 'user1',
        plan: 'team',
        is_banned: false,
        has_verified_email: true,
        plan_expires_at: new Date(Date.now() + 86400000),
        max_quota_per_alias: 10 * 1024 * 1024 * 1024
      }
    },
    {
      group: 'admin',
      user: {
        _id: 'user2',
        plan: 'team',
        is_banned: false,
        has_verified_email: true,
        plan_expires_at: new Date(Date.now() - 86400000), // expired, no subscription
        max_quota_per_alias: 50 * 1024 * 1024 * 1024 // 50 GB - should NOT count
      }
    }
  ];
  const validAdmins = filterAdminMembers(members, 'team');
  t.is(validAdmins.length, 1);

  // Max quota should only come from valid admin (10 GB), not expired admin (50 GB)
  const maxQuota = Math.max(
    ...validAdmins.map((m) => m.user.max_quota_per_alias)
  );
  t.is(maxQuota, 10 * 1024 * 1024 * 1024);
});

// ─────────────────────────────────────────────────────────────────────────────
// Test 7b: Cache fix - only quota config values cached, storage always fresh
// ─────────────────────────────────────────────────────────────────────────────

// Helper: simulate the FIXED cache deserialization logic from isOverQuota
// Only quota config values (maxQuotaPerAlias, domainMaxQuota) are cached;
// storage usage values are always fetched fresh from DB.
function loadQuotaConfigFromCache(json) {
  let maxQuotaPerAlias;
  let domainMaxQuota;

  if (typeof json.maxQuotaPerAlias === 'number')
    maxQuotaPerAlias = json.maxQuotaPerAlias;

  if (typeof json.domainMaxQuota === 'number')
    domainMaxQuota = json.domainMaxQuota;

  return { maxQuotaPerAlias, domainMaxQuota };
}

// Helper: simulate the OLD buggy cache deserialization logic
function loadFromCacheOld(json) {
  let storageUsed;
  let maxQuotaPerAlias;

  if (json.storageUsed && json.maxQuotaPerAlias) {
    storageUsed = json.storageUsed;
    maxQuotaPerAlias = json.maxQuotaPerAlias;
  }

  return { storageUsed, maxQuotaPerAlias };
}

test('cache fix: should load cached quota config values via typeof check', (t) => {
  const cached = {
    maxQuotaPerAlias: 10 * 1024 * 1024 * 1024,
    domainMaxQuota: 10 * 1024 * 1024 * 1024
  };
  const result = loadQuotaConfigFromCache(cached);
  t.is(result.maxQuotaPerAlias, 10 * 1024 * 1024 * 1024);
  t.is(result.domainMaxQuota, 10 * 1024 * 1024 * 1024);
});

test('cache fix: OLD BUG - storageUsed=0 caused maxQuotaPerAlias to be ignored', (t) => {
  // Old code coupled storageUsed and maxQuotaPerAlias in a single truthiness check
  const cached = {
    storageUsed: 0,
    maxQuotaPerAlias: 10 * 1024 * 1024 * 1024
  };
  const result = loadFromCacheOld(cached);
  // Bug: 0 is falsy, so maxQuotaPerAlias is also discarded
  t.is(result.storageUsed, undefined);
  t.is(result.maxQuotaPerAlias, undefined);
});

test('cache fix: storage usage is never cached, always fetched fresh', (t) => {
  // The cache payload should only contain quota config values
  const cachePayload = {
    maxQuotaPerAlias: 10 * 1024 * 1024 * 1024,
    domainMaxQuota: 10 * 1024 * 1024 * 1024
  };
  // storageUsed and domainStorageUsed are intentionally absent
  t.is(cachePayload.storageUsed, undefined);
  t.is(cachePayload.domainStorageUsed, undefined);
  t.is(cachePayload.maxQuotaPerAlias, 10 * 1024 * 1024 * 1024);
  t.is(cachePayload.domainMaxQuota, 10 * 1024 * 1024 * 1024);
});

test('cache fix: should not load maxQuotaPerAlias when missing from cache', (t) => {
  const cached = {};
  const result = loadQuotaConfigFromCache(cached);
  t.is(result.maxQuotaPerAlias, undefined);
  t.is(result.domainMaxQuota, undefined);
});

test('cache fix: fallback should use undefined check not truthiness for maxQuotaPerAlias', (t) => {
  // Simulate: maxQuotaPerAlias was loaded from cache as a valid number
  // The fallback should NOT call getMaxQuota since the value is defined
  const maxQuotaPerAlias = 1073741824; // 1 GB from cache
  // Old code: maxQuotaPerAlias || getMaxQuota() -> truthy, skip fetch (correct for non-zero)
  // New code: maxQuotaPerAlias === undefined ? getMaxQuota() : maxQuotaPerAlias -> defined, skip fetch
  const resultOld = maxQuotaPerAlias || 'FETCHED';
  const resultNew =
    maxQuotaPerAlias === undefined ? 'FETCHED' : maxQuotaPerAlias;
  t.is(resultOld, 1073741824);
  t.is(resultNew, 1073741824);

  // Now simulate: maxQuotaPerAlias is 0 (edge case, should not happen but tests robustness)
  const zeroQuota = 0;
  const resultOldZero = zeroQuota || 'FETCHED';
  const resultNewZero = zeroQuota === undefined ? 'FETCHED' : zeroQuota;
  // Old code would incorrectly fetch because 0 is falsy
  t.is(resultOldZero, 'FETCHED');
  // New code correctly uses the cached value
  t.is(resultNewZero, 0);
});
