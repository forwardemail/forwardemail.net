# Upgrading Our MongoDB and Mongoose Stack

This guide provides a comprehensive plan for upgrading our stack from MongoDB 6.0 and Mongoose 6.x to the latest stable versions. We are doing this because our current version of MongoDB has reached its end of life, and upgrading will also provide significant performance and security benefits.

> [!WARNING]
> **MongoDB 6.0 is no longer supported as of July 31, 2025.**
> Continuing to use an EOL version poses a security risk and means we will not receive bug fixes or support. You can view the official support policy on the [MongoDB Legal website](https://www.mongodb.com/legal/support-policy/lifecycles).

This document merges all previous analysis into a single, comprehensive guide. It covers the server upgrade path, all required code changes, and clarifies which previously discussed changes are **not** necessary.

## Table of Contents

## MongoDB Version Comparison (v6, v7, v8)

| Feature / Aspect | MongoDB 6.0 | MongoDB 7.0 | MongoDB 8.0 / 8.2 (Latest) |
|---|---|---|---|
| **Release Date** | July 2022 | August 2023 | October 2024 / September 2025 |
| **End of Life (EOL)** | **July 31, 2025** | August 31, 2027 | October 31, 2029 |
| **Key Features** | Enhanced time series, Change Stream improvements, Queryable Encryption (Preview) | Compound wildcard indexes, improved query performance, Queryable Encryption (GA) | **Significant performance gains**, improved memory management (TCMalloc), enhanced security features, native vector search (preview in 8.2) |
| **Upgrade Path** | Must upgrade to 7.0 before 8.0 | Must upgrade from 6.0 | Must upgrade from 7.0 |
| **Critical Change** | - | Free Monitoring decommissioned | **Queries for `null` no longer match `undefined` fields** |

## Performance Benchmarks: Why Upgrade to MongoDB 8.0?

Upgrading to MongoDB 8.0 brings major performance improvements. According to [official benchmarks from MongoDB](https://www.mongodb.com/company/blog/mongodb-8-0-improving-performance-avoiding-regressions), the gains are significant:

- **36% Better Read Throughput**
- **56% Faster Bulk Writes**
- **32% Faster Mixed Workloads**
- **60% Faster Time Series**

## Security Advisories and Critical Issues

Upgrading is not just about performance; it's also critical for security. Early versions of MongoDB 8.0 had several critical vulnerabilities that have since been patched.

> [!IMPORTANT]
> It is strongly recommended to upgrade directly to **MongoDB 8.0.15+** or the latest **8.2.x** release. These versions include fixes for all known critical security vulnerabilities and bugs.

## MongoDB Server Upgrade Path

> [!IMPORTANT]
> You cannot upgrade directly from MongoDB 6.0 to 8.0. The upgrade must be done sequentially: **`6.0` → `7.0` → `8.0`**.

### Step-by-Step Server Upgrade Procedure

This procedure must be followed twice: once for 6.0 → 7.0, and again for 7.0 → 8.0.

1.  **Backup the Database**: Always create a full backup before starting.
2.  **Verify FCV**: Ensure the `featureCompatibilityVersion` is set to the current version (e.g., `"6.0"` before upgrading to 7.0).
    ```sh
    db.adminCommand({ getParameter: 1, featureCompatibilityVersion: 1 })
    ```
3.  **Shut Down**: Shut down the `mongod` instance cleanly.
    ```sh
    db.adminCommand({ shutdown: 1 })
    ```
4.  **Replace Binaries**: Replace the old MongoDB binaries with the new version's binaries.
5.  **Restart**: Restart the `mongod` process.
6.  **Enable New Features**: After a burn-in period to ensure stability, update the FCV to the new version.
    ```sh
    # For 7.0
    db.adminCommand({ setFeatureCompatibilityVersion: "7.0", confirm: true })

    # For 8.0
    db.adminCommand({ setFeatureCompatibilityVersion: "8.0", confirm: true })
    ```

## Codebase Migration Guide

### 1. Dependency Upgrades (Verified)

After verifying against the npm registry, here are the correct latest versions for our dependencies.

> [!WARNING]
> **`@ladjs/mongoose` has not been updated in over a year.** Its `peerDependencies` only specify `mongoose: '>=6'`. While this means it *should* work with Mongoose 8, it is not guaranteed. This is a **migration risk** that must be mitigated with thorough testing of our Mongoose configuration and connection logic.

Update `package.json` with these versions and run `pnpm install`:

```json
{
  "dependencies": {
    "mongoose": "^8.20.0",
    "@ladjs/mongoose": "^7.0.0",
    "passport-local-mongoose": "^8.0.0",
    "mongoose-unique-validator": "^4.0.1"
  }
}
```

### 2. Clarification on Unnecessary Changes

> [!NOTE]
> **The extensive refactoring of `doc.field = undefined` is NOT required.**
>
> Our initial analysis flagged this pattern. However, after a deeper look, we can confirm that Mongoose is designed to handle this correctly. When you set a field to `undefined` and call `.save()`, Mongoose automatically translates this into an `$unset` command for MongoDB.
>
> While there was a bug in older Mongoose 6.x versions related to nested objects, upgrading to Mongoose 8.x resolves this. The MongoDB 8.0 query behavior change is only a problem if `undefined` is actually stored in the database, which Mongoose prevents.
>
> **Conclusion**: We can save the effort of refactoring 24+ files. The risk is very low, and the code will function as expected after the Mongoose upgrade.

### 3. Mongoose 6.x to 8.x Migration: All Breaking Changes

This section covers all breaking changes from Mongoose 6 through 8 and how they affect our codebase.

#### 3.1. Required Code Changes (3 Total)

**1. Set `strictQuery: true` (Global Impact)**

*   **The Change**: In Mongoose 7, `strictQuery` defaults to `false`, which can cause unexpected behavior by allowing queries with fields not in our schema. We must set it to `true` globally to maintain our current, safer behavior. See the [Mongoose 7 migration guide](https://mongoosejs.com/docs/migrating_to_7.html) for details.
*   **File**: `/config/mongoose.js`

```javascript
const m = new Mongoose({
  logger,
  hideMeta: true,
  bindEvents: false,
  strictQuery: true, // Add this line
  mongo: {
    options: {
      compressors: ["snappy"]
    }
  }
});
```

**2. Replace `document.remove()`**

*   **The Change**: The `.remove()` method was removed in Mongoose 7. It must be replaced with `.deleteOne()`.
*   **File**: `/app/controllers/web/admin/domains.js`

```diff
- await domain.remove();
+ await domain.deleteOne();
```

**3. Replace `findByIdAndRemove()`**

*   **The Change**: This method was removed in Mongoose 8. It must be replaced with `findByIdAndDelete()`.
*   **File**: `/app/controllers/api/v1/paypal.js`

```diff
- await Payments.findByIdAndRemove(payment._id);
+ await Payments.findByIdAndDelete(payment._id);
```

#### 3.2. Other Breaking Changes (No Action Required)

*   **Dropped Callback Support**: Mongoose 7 dropped support for callbacks. **No action required**, as our codebase consistently uses `async/await`.
*   **`ObjectId` Constructor**: `mongoose.Types.ObjectId()` can no longer be called without the `new` keyword. **No action required**, as our codebase already uses the correct `new` keyword.
*   **Removed `Model.count()`**: `Model.count()` was removed in Mongoose 8. **No action required**, as our codebase already uses `countDocuments()`.
*   **`document.deleteOne()` Return Value**: In Mongoose 8, `doc.deleteOne()` returns a `DeleteResult` object instead of the deleted document. Since we don't use the return value of this operation, **no further logic changes are needed**.

#### 3.3. Breaking Changes Requiring Review

*   **`$lookup` Behavior Change**: The `$lookup` aggregation stage in MongoDB 8.0 will no longer match a `null` value in a `localField` with an `undefined` or non-existent `foreignField`. We use `$lookup` in `/app/controllers/web/admin/inquiries.js` and `/app/controllers/web/admin/payments.js`. The current usage appears safe, but we must **verify that the `localField` (`user`) in both collections can never be `null` or `undefined` if a join is expected**.

*   **`null` is Valid for Non-Required String Enums**: In Mongoose 8, you can now save `null` to a string field with an `enum` validator (if `required` is not `true`). This could change validation behavior. We must **review all schemas with string `enum` validators** to ensure this is acceptable. If not, we must add a custom validator to disallow `null`.

### 4. Underlying Module Analysis

*   **`passport-local-mongoose`**: We are upgrading to `^8.0.0`. While this version was released to add Mongoose 7 support, it is the latest available and is being used by the community with Mongoose 8. We must **thoroughly test all authentication flows** (registration, login, password reset) after the upgrade to confirm compatibility.

## Final Migration Checklist

- [ ] Create a full backup of the production database.
- [ ] Set up a staging environment that mirrors production.
- [ ] Upgrade MongoDB server from 6.0 → 7.0 in staging.
- [ ] Upgrade MongoDB server from 7.0 → 8.0 in staging.
- [ ] Update `package.json` dependencies to the verified versions and run `pnpm install`.
- [ ] Apply the 3 required code changes (`strictQuery`, `deleteOne`, `findByIdAndDelete`).
- [ ] Review all schemas with `enum` validators to check for desired behavior with `null` values.
- [ ] Verify `$lookup` usage in `/app/controllers/web/admin/inquiries.js` and `/app/controllers/web/admin/payments.js`.
- [ ] Thoroughly test the application in staging, paying close attention to:
    - All authentication flows (registration, login, password reset).
    - All database interactions affected by the Mongoose method changes.
    - The Mongoose connection logic handled by `@ladjs/mongoose`.
- [ ] Run the full test suite to ensure no regressions.
- [ ] Schedule and perform the production deployment.
- [ ] Monitor application logs and performance after deployment.
