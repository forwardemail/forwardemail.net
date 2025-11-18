/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// Priority levels for fair queue system
const PRIORITY_LEVELS = {
  HIGH: 2,      // Paid users, good reputation, admin domains
  NORMAL: 1,    // Regular users (default)  
  LOW: 0,       // Free tier, new accounts
  THROTTLED: -1 // Detected abuse/suspicious activity
};

// Human readable names for priority levels
const PRIORITY_NAMES = {
  [PRIORITY_LEVELS.HIGH]: 'HIGH',
  [PRIORITY_LEVELS.NORMAL]: 'NORMAL', 
  [PRIORITY_LEVELS.LOW]: 'LOW',
  [PRIORITY_LEVELS.THROTTLED]: 'THROTTLED'
};

// Configuration for priority-based processing limits
const PRIORITY_CONFIG = {
  // Multipliers for queue allocation by priority
  QUEUE_MULTIPLIERS: {
    [PRIORITY_LEVELS.HIGH]: 1.5,     // 50% more queue allocation
    [PRIORITY_LEVELS.NORMAL]: 1.0,   // Normal allocation
    [PRIORITY_LEVELS.LOW]: 0.5,      // Half allocation
    [PRIORITY_LEVELS.THROTTLED]: 0.1 // Minimal allocation
  },
  
  // Maximum concurrent processing by priority
  CONCURRENCY_LIMITS: {
    [PRIORITY_LEVELS.HIGH]: 0.4,     // 40% of total concurrency
    [PRIORITY_LEVELS.NORMAL]: 0.4,   // 40% of total concurrency  
    [PRIORITY_LEVELS.LOW]: 0.15,     // 15% of total concurrency
    [PRIORITY_LEVELS.THROTTLED]: 0.05 // 5% of total concurrency
  },
  
  // Abuse detection thresholds
  ABUSE_THRESHOLD: 50, // Score above which user gets throttled
  MAX_THROTTLE_DURATION: 24 * 60 * 60 * 1000 // 24 hours max throttle
};

module.exports = {
  PRIORITY_LEVELS,
  PRIORITY_NAMES,
  PRIORITY_CONFIG
};