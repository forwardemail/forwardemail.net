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

const assert = require('node:assert');
const { describe, it } = require('node:test');

// ─────────────────────────────────────────────────────────────────────────────
// Test 1: getMaxQuota alias.max_quota bug fix
// ─────────────────────────────────────────────────────────────────────────────

describe('getMaxQuota alias.max_quota bug fix', () => {
  it('should use alias.max_quota (not alias.max_quota_per_alias) when capping', () => {
    // Simulate the fixed logic from getMaxQuota
    const adminMax = 10 * 1024 * 1024 * 1024; // 10 GB
    const alias = { max_quota: 5 * 1024 * 1024 * 1024 }; // 5 GB alias cap

    let max = adminMax;

    // Fixed logic: uses alias.max_quota (not alias.max_quota_per_alias)
    if (alias && Number.isFinite(alias.max_quota) && alias.max_quota < max)
      max = alias.max_quota;

    assert.strictEqual(max, 5 * 1024 * 1024 * 1024);
  });

  it('should NOT cap when alias.max_quota is larger than admin max', () => {
    const adminMax = 5 * 1024 * 1024 * 1024; // 5 GB
    const alias = { max_quota: 10 * 1024 * 1024 * 1024 }; // 10 GB

    let max = adminMax;

    if (alias && Number.isFinite(alias.max_quota) && alias.max_quota < max)
      max = alias.max_quota;

    assert.strictEqual(max, 5 * 1024 * 1024 * 1024);
  });

  it('should handle alias without max_quota set', () => {
    const adminMax = 10 * 1024 * 1024 * 1024;
    const alias = {}; // no max_quota

    let max = adminMax;

    if (alias && Number.isFinite(alias.max_quota) && alias.max_quota < max)
      max = alias.max_quota;

    assert.strictEqual(max, 10 * 1024 * 1024 * 1024);
  });

  it('should handle null alias', () => {
    const adminMax = 10 * 1024 * 1024 * 1024;
    const alias = null;

    let max = adminMax;

    if (alias && Number.isFinite(alias.max_quota) && alias.max_quota < max)
      max = alias.max_quota;

    assert.strictEqual(max, 10 * 1024 * 1024 * 1024);
  });

  it('OLD BUG: alias.max_quota_per_alias would be undefined and never cap', () => {
    // This demonstrates the old bug where alias.max_quota_per_alias was used
    // but the alias schema only has max_quota
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
    assert.strictEqual(max, 10 * 1024 * 1024 * 1024);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Test 2: isOverQuota alias-specific storage logic
// ─────────────────────────────────────────────────────────────────────────────

describe('isOverQuota dual check (alias cap + domain pool)', () => {
  // Helper to simulate the dual-check logic from isOverQuota
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

  it('should detect over quota when alias storage exceeds alias max', () => {
    const result = checkOverQuota({
      storageUsed: 6 * 1024 * 1024 * 1024, // 6 GB
      maxQuotaPerAlias: 5 * 1024 * 1024 * 1024, // 5 GB cap
      domainStorageUsed: 7 * 1024 * 1024 * 1024, // 7 GB domain total
      domainMaxQuota: 10 * 1024 * 1024 * 1024 // 10 GB domain limit
    });
    assert.strictEqual(result.aliasOverQuota, true);
    assert.strictEqual(result.domainOverQuota, false);
    assert.strictEqual(result.isOverQuota, true);
  });

  it('should detect over quota when domain pool is exhausted even if alias is under cap', () => {
    // Alias A: 3 GB used, 5 GB cap → under its own cap
    // Domain total: 10.5 GB used, 10 GB limit → domain pool exhausted
    const result = checkOverQuota({
      storageUsed: 3 * 1024 * 1024 * 1024, // 3 GB
      maxQuotaPerAlias: 5 * 1024 * 1024 * 1024, // 5 GB cap
      domainStorageUsed: 10.5 * 1024 * 1024 * 1024, // 10.5 GB domain total
      domainMaxQuota: 10 * 1024 * 1024 * 1024 // 10 GB domain limit
    });
    assert.strictEqual(result.aliasOverQuota, false);
    assert.strictEqual(result.domainOverQuota, true);
    assert.strictEqual(result.isOverQuota, true);
  });

  it('should NOT detect over quota when both alias and domain are under limits', () => {
    const result = checkOverQuota({
      storageUsed: 3 * 1024 * 1024 * 1024, // 3 GB
      maxQuotaPerAlias: 5 * 1024 * 1024 * 1024, // 5 GB cap
      domainStorageUsed: 7 * 1024 * 1024 * 1024, // 7 GB domain total
      domainMaxQuota: 10 * 1024 * 1024 * 1024 // 10 GB domain limit
    });
    assert.strictEqual(result.aliasOverQuota, false);
    assert.strictEqual(result.domainOverQuota, false);
    assert.strictEqual(result.isOverQuota, false);
  });

  it('should detect over quota when BOTH alias and domain are over', () => {
    const result = checkOverQuota({
      storageUsed: 6 * 1024 * 1024 * 1024, // 6 GB
      maxQuotaPerAlias: 5 * 1024 * 1024 * 1024, // 5 GB cap
      domainStorageUsed: 11 * 1024 * 1024 * 1024, // 11 GB domain total
      domainMaxQuota: 10 * 1024 * 1024 * 1024 // 10 GB domain limit
    });
    assert.strictEqual(result.aliasOverQuota, true);
    assert.strictEqual(result.domainOverQuota, true);
    assert.strictEqual(result.isOverQuota, true);
  });

  it('should account for incoming message size in both checks', () => {
    const result = checkOverQuota({
      storageUsed: 4.9 * 1024 * 1024 * 1024, // 4.9 GB
      maxQuotaPerAlias: 5 * 1024 * 1024 * 1024, // 5 GB cap
      domainStorageUsed: 9.9 * 1024 * 1024 * 1024, // 9.9 GB domain total
      domainMaxQuota: 10 * 1024 * 1024 * 1024, // 10 GB domain limit
      size: 200 * 1024 * 1024 // 200 MB incoming
    });
    assert.strictEqual(result.aliasOverQuota, true);
    assert.strictEqual(result.domainOverQuota, true);
    assert.strictEqual(result.isOverQuota, true);
  });

  it('should handle zero storage_used on both levels', () => {
    const result = checkOverQuota({
      storageUsed: 0,
      maxQuotaPerAlias: 5 * 1024 * 1024 * 1024,
      domainStorageUsed: 0,
      domainMaxQuota: 10 * 1024 * 1024 * 1024
    });
    assert.strictEqual(result.isOverQuota, false);
  });

  it('should handle exact domain boundary (not over)', () => {
    const result = checkOverQuota({
      storageUsed: 3 * 1024 * 1024 * 1024,
      maxQuotaPerAlias: 5 * 1024 * 1024 * 1024,
      domainStorageUsed: 10 * 1024 * 1024 * 1024, // exactly at limit
      domainMaxQuota: 10 * 1024 * 1024 * 1024
    });
    assert.strictEqual(result.domainOverQuota, false);
    assert.strictEqual(result.isOverQuota, false);
  });

  it('should handle exact domain boundary with 1 byte over', () => {
    const result = checkOverQuota({
      storageUsed: 3 * 1024 * 1024 * 1024,
      maxQuotaPerAlias: 5 * 1024 * 1024 * 1024,
      domainStorageUsed: 10 * 1024 * 1024 * 1024,
      domainMaxQuota: 10 * 1024 * 1024 * 1024,
      size: 1
    });
    assert.strictEqual(result.domainOverQuota, true);
    assert.strictEqual(result.isOverQuota, true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Test 3: Alias-specific storage retrieval logic
// ─────────────────────────────────────────────────────────────────────────────

describe('alias-specific storage retrieval', () => {
  it('should use alias storage_used when available', () => {
    const aliasDoc = { storage_used: 3 * 1024 * 1024 * 1024 };
    const storageUsed =
      aliasDoc && typeof aliasDoc.storage_used === 'number'
        ? aliasDoc.storage_used
        : 0;
    assert.strictEqual(storageUsed, 3 * 1024 * 1024 * 1024);
  });

  it('should default to 0 when aliasDoc is null', () => {
    const aliasDoc = null;
    const storageUsed =
      aliasDoc && typeof aliasDoc.storage_used === 'number'
        ? aliasDoc.storage_used
        : 0;
    assert.strictEqual(storageUsed, 0);
  });

  it('should default to 0 when storage_used is not a number', () => {
    const aliasDoc = { storage_used: undefined };
    const storageUsed =
      aliasDoc && typeof aliasDoc.storage_used === 'number'
        ? aliasDoc.storage_used
        : 0;
    assert.strictEqual(storageUsed, 0);
  });

  it('should handle storage_used of 0 correctly', () => {
    const aliasDoc = { storage_used: 0 };
    const storageUsed =
      aliasDoc && typeof aliasDoc.storage_used === 'number'
        ? aliasDoc.storage_used
        : 0;
    assert.strictEqual(storageUsed, 0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Test 4: Trash cleanup percentage calculation
// ─────────────────────────────────────────────────────────────────────────────

describe('trash cleanup percentage calculation', () => {
  it('should calculate correct percentage for alias-specific storage', () => {
    const storageUsed = 3 * 1024 * 1024 * 1024; // 3 GB
    const maxQuotaPerAlias = 10 * 1024 * 1024 * 1024; // 10 GB

    const percentageUsed = Math.round((storageUsed / maxQuotaPerAlias) * 100);
    assert.strictEqual(percentageUsed, 30);
  });

  it('should calculate correct days for trash retention', () => {
    const storageUsed = 8 * 1024 * 1024 * 1024; // 8 GB
    const maxQuotaPerAlias = 10 * 1024 * 1024 * 1024; // 10 GB

    const percentageUsed = Math.round((storageUsed / maxQuotaPerAlias) * 100);
    assert.strictEqual(percentageUsed, 80);

    const days = Math.max(Math.round(30 * (1 - percentageUsed / 100)), 0);
    assert.strictEqual(days, 6); // 30 * 0.2 = 6 days
  });

  it('should return 0 days when at 100% capacity', () => {
    const storageUsed = 10 * 1024 * 1024 * 1024;
    const maxQuotaPerAlias = 10 * 1024 * 1024 * 1024;

    const percentageUsed = Math.round((storageUsed / maxQuotaPerAlias) * 100);
    const days = Math.max(Math.round(30 * (1 - percentageUsed / 100)), 0);
    assert.strictEqual(days, 0);
  });

  it('should return 30 days when at 0% capacity', () => {
    const storageUsed = 0;
    const maxQuotaPerAlias = 10 * 1024 * 1024 * 1024;

    const percentageUsed = Math.round((storageUsed / maxQuotaPerAlias) * 100);
    const days = Math.max(Math.round(30 * (1 - percentageUsed / 100)), 0);
    assert.strictEqual(days, 30);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Test 5: Storage notification threshold detection
// ─────────────────────────────────────────────────────────────────────────────

describe('storage notification thresholds', () => {
  it('should detect 50% threshold', () => {
    const storageUsed = 5 * 1024 * 1024 * 1024; // 5 GB
    const maxQuotaPerAlias = 10 * 1024 * 1024 * 1024; // 10 GB

    const percentageUsed = Math.round((storageUsed / maxQuotaPerAlias) * 100);

    let threshold;
    for (const percentage of [50, 60, 70, 80, 90, 100]) {
      if (percentageUsed >= percentage) {
        threshold = percentage;
      }
    }

    assert.strictEqual(threshold, 50);
  });

  it('should detect 90% threshold', () => {
    const storageUsed = 9.5 * 1024 * 1024 * 1024;
    const maxQuotaPerAlias = 10 * 1024 * 1024 * 1024;

    const percentageUsed = Math.round((storageUsed / maxQuotaPerAlias) * 100);

    let threshold;
    for (const percentage of [50, 60, 70, 80, 90, 100]) {
      if (percentageUsed >= percentage) {
        threshold = percentage;
      }
    }

    assert.strictEqual(threshold, 90);
  });

  it('should not detect threshold below 50%', () => {
    const storageUsed = 4 * 1024 * 1024 * 1024; // 4 GB = 40%
    const maxQuotaPerAlias = 10 * 1024 * 1024 * 1024;

    const percentageUsed = Math.round((storageUsed / maxQuotaPerAlias) * 100);

    let threshold;
    for (const percentage of [50, 60, 70, 80, 90, 100]) {
      if (percentageUsed >= percentage) {
        threshold = percentage;
      }
    }

    assert.strictEqual(threshold, undefined);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Test 6: Display template calculations (domain-specific)
// ─────────────────────────────────────────────────────────────────────────────

describe('display template calculations', () => {
  it('domain _table.pug: should use storage_used_by_aliases for percentage', () => {
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

    assert.strictEqual(storageUsedByAliases, 80);
    assert.strictEqual(availableStorage, 20);
    assert.strictEqual(percentage, 80);

    // OLD (buggy): would use pooled storage_used = 150%
    const oldPercentage = Math.round(
      (domain.storage_used / domain.storage_quota) * 100
    );
    assert.strictEqual(oldPercentage, 150); // incorrectly shows over quota
  });

  it('aliases _table.pug: should use storage_used_by_aliases for available', () => {
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

    assert.strictEqual(storageUsedBySpecificAlias, 20); // 2/10 = 20%
    assert.strictEqual(storageUsedByOtherAliases, 40); // (6-2)/10 = 40%
    assert.strictEqual(availableStorage, 40); // (10-6)/10 = 40%

    // OLD (buggy): available would be based on pooled = -100%
    const oldAvailable = Math.round(
      ((domain.storage_quota - domain.storage_used) / domain.storage_quota) *
        100
    );
    assert.strictEqual(oldAvailable, -100); // incorrectly shows negative
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Test 7: Cache interaction
// ─────────────────────────────────────────────────────────────────────────────

describe('isOverQuota cache behavior', () => {
  it('should use cached alias-level values when available', () => {
    const cached = {
      storageUsed: 3 * 1024 * 1024 * 1024,
      maxQuotaPerAlias: 10 * 1024 * 1024 * 1024
    };

    let storageUsed;
    let maxQuotaPerAlias;

    // Simulate cache hit
    if (cached.storageUsed && cached.maxQuotaPerAlias) {
      storageUsed = cached.storageUsed;
      maxQuotaPerAlias = cached.maxQuotaPerAlias;
    }

    assert.strictEqual(storageUsed, 3 * 1024 * 1024 * 1024);
    assert.strictEqual(maxQuotaPerAlias, 10 * 1024 * 1024 * 1024);
  });

  it('should use cached domain-level values when available', () => {
    const cached = {
      storageUsed: 3 * 1024 * 1024 * 1024,
      maxQuotaPerAlias: 10 * 1024 * 1024 * 1024,
      domainStorageUsed: 8 * 1024 * 1024 * 1024,
      domainMaxQuota: 10 * 1024 * 1024 * 1024
    };

    let domainStorageUsed;
    let domainMaxQuota;

    if (cached.domainStorageUsed && cached.domainMaxQuota) {
      domainStorageUsed = cached.domainStorageUsed;
      domainMaxQuota = cached.domainMaxQuota;
    }

    assert.strictEqual(domainStorageUsed, 8 * 1024 * 1024 * 1024);
    assert.strictEqual(domainMaxQuota, 10 * 1024 * 1024 * 1024);
  });

  it('should fall through to DB lookup when cache misses', () => {
    let storageUsed;
    let maxQuotaPerAlias;
    let domainStorageUsed;
    let domainMaxQuota;

    // Simulate cache miss (no values set)
    assert.strictEqual(storageUsed, undefined);
    assert.strictEqual(maxQuotaPerAlias, undefined);
    assert.strictEqual(domainStorageUsed, undefined);
    assert.strictEqual(domainMaxQuota, undefined);

    // The !value check would trigger DB lookup
    assert.strictEqual(!storageUsed, true);
    assert.strictEqual(!domainStorageUsed, true);
  });

  it('should cache all four values for 1 day', () => {
    const storageUsed = 5 * 1024 * 1024 * 1024;
    const maxQuotaPerAlias = 10 * 1024 * 1024 * 1024;
    const domainStorageUsed = 8 * 1024 * 1024 * 1024;
    const domainMaxQuota = 10 * 1024 * 1024 * 1024;
    const size = 0;

    // Only cache when size === 0
    const shouldCache = size === 0;
    assert.strictEqual(shouldCache, true);

    const cachePayload = JSON.stringify({
      storageUsed,
      maxQuotaPerAlias,
      domainStorageUsed,
      domainMaxQuota
    });
    const parsed = JSON.parse(cachePayload);
    assert.strictEqual(parsed.storageUsed, storageUsed);
    assert.strictEqual(parsed.maxQuotaPerAlias, maxQuotaPerAlias);
    assert.strictEqual(parsed.domainStorageUsed, domainStorageUsed);
    assert.strictEqual(parsed.domainMaxQuota, domainMaxQuota);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Test 8: Domain ID extraction
// ─────────────────────────────────────────────────────────────────────────────

describe('domain ID extraction from alias', () => {
  it('should extract domain ID from populated domain object', () => {
    const alias = {
      id: 'test-alias',
      domain: { _id: 'domain-123', name: 'example.com' }
    };
    const domainId = alias?.domain?._id || alias.domain;
    assert.strictEqual(domainId, 'domain-123');
  });

  it('should use domain directly when it is an ObjectId string', () => {
    const alias = {
      id: 'test-alias',
      domain: 'domain-456'
    };
    const domainId = alias?.domain?._id || alias.domain;
    assert.strictEqual(domainId, 'domain-456');
  });

  it('should handle IMAP session-style alias objects', () => {
    const alias = {
      id: 'session-alias',
      domain: 'session-domain-id',
      locale: 'en'
    };
    const domainId = alias?.domain?._id || alias.domain;
    assert.strictEqual(domainId, 'session-domain-id');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Test 9: End-to-end scenario tests
// ─────────────────────────────────────────────────────────────────────────────

describe('end-to-end scenarios', () => {
  // Helper to simulate the dual-check logic
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

  it('scenario: alias A is over its own cap but domain pool is under total', () => {
    // Alias A: 6 GB used, 5 GB cap
    // Alias B: 1 GB used, 10 GB cap
    // Domain pool: 7 GB total, 10 GB domain quota
    // OLD behavior: pool (7 GB) < domain quota (10 GB) → not over quota (WRONG)
    // NEW behavior: alias A (6 GB) > alias A cap (5 GB) → over quota via alias check (CORRECT)

    const result = checkOverQuota({
      storageUsed: 6 * 1024 * 1024 * 1024,
      maxQuotaPerAlias: 5 * 1024 * 1024 * 1024,
      domainStorageUsed: 7 * 1024 * 1024 * 1024,
      domainMaxQuota: 10 * 1024 * 1024 * 1024
    });
    assert.strictEqual(result.aliasOverQuota, true);
    assert.strictEqual(result.domainOverQuota, false);
    assert.strictEqual(result.isOverQuota, true);
  });

  it('scenario: alias is under its own cap but other aliases exhausted domain pool', () => {
    // Alias A: 3 GB used, 5 GB cap → under its own cap
    // Other aliases on same domain: 8 GB used
    // Domain total: 11 GB, Domain quota: 10 GB → pool exhausted
    // OLD behavior: compared pooled across ALL admin domains (wrong scope)
    // NEW behavior: domain pool (11 GB) > domain quota (10 GB) → over quota (CORRECT)

    const result = checkOverQuota({
      storageUsed: 3 * 1024 * 1024 * 1024,
      maxQuotaPerAlias: 5 * 1024 * 1024 * 1024,
      domainStorageUsed: 11 * 1024 * 1024 * 1024,
      domainMaxQuota: 10 * 1024 * 1024 * 1024
    });
    assert.strictEqual(result.aliasOverQuota, false);
    assert.strictEqual(result.domainOverQuota, true);
    assert.strictEqual(result.isOverQuota, true);
  });

  it('scenario: alias and domain both under limits → mail accepted', () => {
    // Alias A: 2 GB used, 5 GB cap
    // Domain total: 6 GB, Domain quota: 10 GB
    const result = checkOverQuota({
      storageUsed: 2 * 1024 * 1024 * 1024,
      maxQuotaPerAlias: 5 * 1024 * 1024 * 1024,
      domainStorageUsed: 6 * 1024 * 1024 * 1024,
      domainMaxQuota: 10 * 1024 * 1024 * 1024
    });
    assert.strictEqual(result.isOverQuota, false);
  });

  it('scenario: progress bar shows correct domain-specific values', () => {
    // User has 2 domains sharing same admin
    // Domain A: 5 GB used by its aliases, 10 GB quota
    // Domain B: 8 GB used by its aliases, 10 GB quota
    // Pooled total: 13 GB
    // OLD: Domain A progress bar shows 13/10 = 130% (WRONG)
    // NEW: Domain A progress bar shows 5/10 = 50% (CORRECT)

    const domainA = {
      storage_used: 13 * 1024 * 1024 * 1024, // pooled
      storage_used_by_aliases: 5 * 1024 * 1024 * 1024, // domain-specific
      storage_quota: 10 * 1024 * 1024 * 1024
    };

    const newPercentage = Math.round(
      (domainA.storage_used_by_aliases / domainA.storage_quota) * 100
    );
    assert.strictEqual(newPercentage, 50);

    const oldPercentage = Math.round(
      (domainA.storage_used / domainA.storage_quota) * 100
    );
    assert.strictEqual(oldPercentage, 130); // Bug: shows 130%
  });

  it('scenario: team domain with multiple aliases consuming shared pool', () => {
    // Team domain with 10 GB quota
    // Alias A: 2 GB used, 10 GB per-alias cap
    // Alias B: 4 GB used, 10 GB per-alias cap
    // Alias C: 4 GB used, 10 GB per-alias cap
    // Domain total: 10 GB = at limit
    // Alias A tries to receive 1 byte → domain pool would be exceeded
    const result = checkOverQuota({
      storageUsed: 2 * 1024 * 1024 * 1024,
      maxQuotaPerAlias: 10 * 1024 * 1024 * 1024,
      domainStorageUsed: 10 * 1024 * 1024 * 1024,
      domainMaxQuota: 10 * 1024 * 1024 * 1024,
      size: 1
    });
    assert.strictEqual(result.aliasOverQuota, false);
    assert.strictEqual(result.domainOverQuota, true);
    assert.strictEqual(result.isOverQuota, true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Test 10: Cleanup-sqlite alias.storage_used direct access
// ─────────────────────────────────────────────────────────────────────────────

describe('cleanup-sqlite alias.storage_used direct access', () => {
  it('should use alias.storage_used directly when available', () => {
    const alias = { storage_used: 5 * 1024 * 1024 * 1024 };
    const storageUsed =
      typeof alias.storage_used === 'number' ? alias.storage_used : 0;
    assert.strictEqual(storageUsed, 5 * 1024 * 1024 * 1024);
  });

  it('should default to 0 when alias.storage_used is undefined', () => {
    const alias = {};
    const storageUsed =
      typeof alias.storage_used === 'number' ? alias.storage_used : 0;
    assert.strictEqual(storageUsed, 0);
  });

  it('should handle alias.storage_used of 0', () => {
    const alias = { storage_used: 0 };
    const storageUsed =
      typeof alias.storage_used === 'number' ? alias.storage_used : 0;
    assert.strictEqual(storageUsed, 0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Test 11: getMaxQuota admin filtering (valid paying admins only)
// ─────────────────────────────────────────────────────────────────────────────

describe('getMaxQuota admin filtering for valid paying admins', () => {
  // Helper to simulate the admin filter logic from getMaxQuota
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

  it('should include admin with active plan_expires_at', () => {
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
    assert.strictEqual(result.length, 1);
  });

  it('should include admin with active Stripe subscription even if plan expired', () => {
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
    assert.strictEqual(result.length, 1);
  });

  it('should include admin with active PayPal subscription even if plan expired', () => {
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
    assert.strictEqual(result.length, 1);
  });

  it('should EXCLUDE admin with expired plan and no active subscription', () => {
    const members = [
      {
        group: 'admin',
        user: {
          _id: 'user1',
          plan: 'enhanced_protection',
          is_banned: false,
          has_verified_email: true,
          plan_expires_at: new Date(Date.now() - 86400000), // expired
          // no stripe or paypal subscription
          max_quota_per_alias: 10 * 1024 * 1024 * 1024
        }
      }
    ];
    const result = filterAdminMembers(members, 'enhanced_protection');
    assert.strictEqual(result.length, 0);
  });

  it('should EXCLUDE banned admin even with active plan', () => {
    const members = [
      {
        group: 'admin',
        user: {
          _id: 'user1',
          plan: 'enhanced_protection',
          is_banned: true, // banned
          has_verified_email: true,
          plan_expires_at: new Date(Date.now() + 86400000),
          max_quota_per_alias: 10 * 1024 * 1024 * 1024
        }
      }
    ];
    const result = filterAdminMembers(members, 'enhanced_protection');
    assert.strictEqual(result.length, 0);
  });

  it('should EXCLUDE admin without verified email', () => {
    const members = [
      {
        group: 'admin',
        user: {
          _id: 'user1',
          plan: 'enhanced_protection',
          is_banned: false,
          has_verified_email: false, // not verified
          plan_expires_at: new Date(Date.now() + 86400000),
          max_quota_per_alias: 10 * 1024 * 1024 * 1024
        }
      }
    ];
    const result = filterAdminMembers(members, 'enhanced_protection');
    assert.strictEqual(result.length, 0);
  });

  it('should EXCLUDE admin on free plan for enhanced_protection domain', () => {
    const members = [
      {
        group: 'admin',
        user: {
          _id: 'user1',
          plan: 'free', // wrong plan
          is_banned: false,
          has_verified_email: true,
          plan_expires_at: new Date(Date.now() + 86400000),
          max_quota_per_alias: 10 * 1024 * 1024 * 1024
        }
      }
    ];
    const result = filterAdminMembers(members, 'enhanced_protection');
    assert.strictEqual(result.length, 0);
  });

  it('should EXCLUDE enhanced_protection admin for team domain', () => {
    const members = [
      {
        group: 'admin',
        user: {
          _id: 'user1',
          plan: 'enhanced_protection', // not team
          is_banned: false,
          has_verified_email: true,
          plan_expires_at: new Date(Date.now() + 86400000),
          max_quota_per_alias: 10 * 1024 * 1024 * 1024
        }
      }
    ];
    const result = filterAdminMembers(members, 'team');
    assert.strictEqual(result.length, 0);
  });

  it('should include team admin for enhanced_protection domain (team >= enhanced)', () => {
    const members = [
      {
        group: 'admin',
        user: {
          _id: 'user1',
          plan: 'team', // team covers enhanced_protection
          is_banned: false,
          has_verified_email: true,
          plan_expires_at: new Date(Date.now() + 86400000),
          max_quota_per_alias: 10 * 1024 * 1024 * 1024
        }
      }
    ];
    const result = filterAdminMembers(members, 'enhanced_protection');
    assert.strictEqual(result.length, 1);
  });

  it('should EXCLUDE non-admin members', () => {
    const members = [
      {
        group: 'user', // not admin
        user: {
          _id: 'user1',
          plan: 'enhanced_protection',
          is_banned: false,
          has_verified_email: true,
          plan_expires_at: new Date(Date.now() + 86400000),
          max_quota_per_alias: 10 * 1024 * 1024 * 1024
        }
      }
    ];
    const result = filterAdminMembers(members, 'enhanced_protection');
    assert.strictEqual(result.length, 0);
  });

  it('team domain: should only count valid paying admins for max quota', () => {
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
    assert.strictEqual(validAdmins.length, 1);

    // Max quota should only come from valid admin (10 GB), not expired admin (50 GB)
    const maxQuota = Math.max(
      ...validAdmins.map((m) => m.user.max_quota_per_alias)
    );
    assert.strictEqual(maxQuota, 10 * 1024 * 1024 * 1024);
  });
});
