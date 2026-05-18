/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const mongoose = require('mongoose');
const mongooseCommonPlugin = require('mongoose-common-plugin');

const PLATFORMS = ['apns', 'fcm', 'unified-push', 'web-push'];

const PushTokens = new mongoose.Schema({
  //
  // The alias this push token belongs to.
  // Indexed for fast lookup when delivering notifications.
  //
  alias: {
    type: mongoose.Schema.ObjectId,
    ref: 'Aliases',
    required: true,
    index: true
  },

  //
  // The user who registered this token (for API token auth lookups).
  // When authenticated via API token, we use this to scope tokens
  // to the user's aliases.
  //
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'Users',
    required: true,
    index: true
  },

  //
  // Platform identifier — determines which delivery transport to use.
  //
  //   * apns          — Apple Push Notification service (iOS/macOS)
  //   * fcm           — Firebase Cloud Messaging (Android)
  //   * unified-push  — UnifiedPush (Android, self-hosted distributors)
  //   * web-push      — Web Push API (browser service workers)
  //
  platform: {
    type: String,
    required: true,
    enum: PLATFORMS,
    index: true
  },

  //
  // The device token or push endpoint URL.
  //
  //   * apns:         hex device token (64–200 chars)
  //   * fcm:          FCM registration token (string)
  //   * unified-push: full HTTPS endpoint URL from the distributor
  //   * web-push:     JSON-encoded PushSubscription object
  //
  token: {
    type: String,
    required: true,
    maxlength: 4096
  },

  //
  // Optional human-readable device name for user management.
  // e.g. "iPhone 16 Pro", "Pixel 9", "Firefox on Linux"
  //
  device_name: {
    type: String,
    maxlength: 255,
    default: ''
  },

  //
  // Last time a push was successfully delivered to this token.
  // Used for stale-token cleanup and debugging.
  //
  last_used_at: {
    type: Date,
    default: null
  },

  //
  // Number of consecutive delivery failures.
  // Tokens with >= 3 failures are auto-pruned by the delivery helper.
  //
  failure_count: {
    type: Number,
    default: 0,
    min: 0
  },

  //
  // Expiry date — tokens older than this are considered stale.
  // Defaults to 1 year from creation; refreshed on each successful delivery.
  //
  // NOTE: Different platforms have different token lifetimes:
  //   - APNs:         Tokens are valid indefinitely (invalidated via 410 Gone)
  //   - FCM:          270 days of inactivity before expiry
  //   - UnifiedPush:  Depends on distributor (ntfy: 60 days unused)
  //   - Web Push:     Usually indefinite (Edge: 30 days)
  //
  // A 1-year TTL is a safe upper bound for all platforms.
  // The primary cleanup mechanism is the failure counter (auto-prune
  // after 3 consecutive delivery failures), not this TTL.
  //
  expires_at: {
    type: Date,
    required: true,
    index: true
  }
});

//
// Compound unique index: one token per (alias, platform, token) triple.
// Prevents duplicate registrations from the same device.
//
PushTokens.index({ alias: 1, platform: 1, token: 1 }, { unique: true });

//
// TTL index: automatically remove expired tokens.
// MongoDB's TTL monitor runs every 60 seconds.
//
PushTokens.index({ expires_at: 1 }, { expireAfterSeconds: 0 });

PushTokens.plugin(mongooseCommonPlugin, {
  object: 'push_token',
  omitCommonFields: false,
  omitExtraFields: ['_id', '__v'],
  uniqueId: false,
  locale: false
});

//
// Virtual: is this token expired?
//
PushTokens.virtual('is_expired').get(function () {
  return this.expires_at && this.expires_at < new Date();
});

//
// Static: find all active tokens for an alias.
//
PushTokens.statics.findActiveForAlias = function (aliasId) {
  return this.find({
    alias: aliasId,
    expires_at: { $gt: new Date() },
    failure_count: { $lt: 3 }
  }).exec();
};

//
// Static: record a successful delivery.
//
PushTokens.statics.recordSuccess = async function (tokenId) {
  return this.findByIdAndUpdate(tokenId, {
    $set: {
      last_used_at: new Date(),
      failure_count: 0,
      // Extend expiry by 1 year on success
      expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    }
  }).exec();
};

//
// Static: record a delivery failure; prune if threshold exceeded.
//
PushTokens.statics.recordFailure = async function (tokenId) {
  const token = await this.findByIdAndUpdate(
    tokenId,
    { $inc: { failure_count: 1 } },
    { new: true }
  ).exec();
  if (token && token.failure_count >= 3) {
    await this.deleteOne({ _id: tokenId }).exec();
  }

  return token;
};

module.exports = mongoose.model('PushTokens', PushTokens);
module.exports.PLATFORMS = PLATFORMS;
