# Fair Queue Implementation Plan

## Overview

This document outlines a comprehensive strategy to implement fair queuing for SMTP outbound emails, preventing bad actors from monopolizing the queue while ensuring fair access for all users.

## Current System Analysis

### Issues Identified
1. **FIFO with no fairness**: Current queue processes emails first-come-first-served (sort by `created_at: -1`)
2. **Single user can flood queue**: No per-user/domain limits in queue processing 
3. **Commented fair queue code**: Lines 158-211 in `jobs/send-emails.js` show attempted domain-based fairness but it's disabled
4. **Basic rate limiting only**: Only has `smtpLimitMessages: 300/day` per user but no queue-time fairness

### Current Queue Flow
- **Entry Point**: `helpers/on-data-smtp.js:612` - Sets `email.status = 'queued'`
- **Processing**: `jobs/send-emails.js:214-236` - Processes emails with PQueue
- **Monitoring**: `jobs/check-smtp-queue-count.js:92-111` - Queue health checks
- **Email Sending**: `helpers/process-email.js:71+` - Actual email delivery

## Strategy: Weighted Fair Queuing (WFQ) with Anti-Abuse

### Core Principles
1. **Domain-level fairness** - Prevent single domains from dominating
2. **User-level fairness** - Ensure fair access within domains
3. **Priority tiers** - Different service levels based on user status
4. **Abuse detection** - Automatic throttling for suspicious behavior
5. **Adaptive limits** - Dynamic adjustments based on system load

## Implementation Phases

### Phase 1: Database Schema Updates (Week 1)

#### Email Model Enhancements
```javascript
// Add new fields to Email schema
{
  priority: {
    type: Number,
    default: 1, // PRIORITY_LEVELS.NORMAL
    index: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  throttled_until: {
    type: Date,
    index: true
  },
  abuse_score: {
    type: Number,
    default: 0
  }
}
```

#### Index Optimization
```javascript
// Composite index for efficient queue queries
db.emails.createIndex({
  status: 1,
  priority: -1,
  domain: 1,
  user: 1,
  created_at: 1
});

// Index for throttled emails
db.emails.createIndex({
  throttled_until: 1,
  status: 1
});
```

### Phase 2: Fair Queue Core Logic (Week 2)

#### Domain-Based Fair Distribution
```javascript
// Enhanced sendEmails function
async function sendEmailsFairly() {
  const limit = config.smtpMaxQueue - queue.size;
  
  // Get domain distribution
  const domainEmailCounts = await Emails.aggregate([
    { $match: query },
    { $group: { _id: '$domain', count: { $sum: 1 } } },
    { $sort: { count: 1 } } // Process domains with fewer queued emails first
  ]);

  const maxPerDomain = Math.max(1, Math.floor(limit / domainEmailCounts.length));
  const selectedEmails = [];

  for (const { _id: domainId, count } of domainEmailCounts) {
    const domainEmails = await Emails.find({
      ...query,
      domain: domainId
    })
    .sort({ priority: -1, created_at: 1 }) // Priority first, then FIFO within domain
    .limit(Math.min(maxPerDomain, count))
    .lean();
    
    selectedEmails.push(...domainEmails);
    if (selectedEmails.length >= limit) break;
  }

  // Process selected emails
  for (const email of selectedEmails) {
    queue.add(() => processEmail({ email, resolver, client }));
  }
}
```

#### Priority System Implementation
```javascript
const PRIORITY_LEVELS = {
  HIGH: 2,      // Paid users, good reputation
  NORMAL: 1,    // Regular users
  LOW: 0,       // Free tier, new accounts
  THROTTLED: -1 // Detected abuse/suspicious activity
};

function calculatePriority(user, domain) {
  let priority = PRIORITY_LEVELS.NORMAL;
  
  // Premium users get higher priority
  if (user.plan === 'team' || user.plan === 'enhanced_protection') {
    priority = PRIORITY_LEVELS.HIGH;
  }
  
  // New accounts get lower priority
  if (dayjs().diff(user.created_at, 'days') < 7) {
    priority = PRIORITY_LEVELS.LOW;
  }
  
  // Throttled users
  if (user.abuse_score > ABUSE_THRESHOLD) {
    priority = PRIORITY_LEVELS.THROTTLED;
  }
  
  return priority;
}
```

### Phase 3: Abuse Detection System (Week 3)

#### Abuse Scoring Algorithm
```javascript
async function calculateAbuseScore(user, domain) {
  const window = dayjs().subtract(24, 'hours').toDate();
  
  const stats = await Emails.aggregate([
    {
      $match: {
        user: user._id,
        created_at: { $gte: window }
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        bounced: { $sum: { $cond: [{ $eq: ['$status', 'bounced'] }, 1, 0] } },
        rejected: { $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] } }
      }
    }
  ]);

  if (!stats[0]) return 0;

  const { total, bounced, rejected } = stats[0];
  const bounceRate = bounced / total;
  const rejectRate = rejected / total;
  
  let score = 0;
  
  // High bounce/reject rates
  if (bounceRate > 0.1) score += 30;
  if (rejectRate > 0.05) score += 20;
  
  // Volume spikes
  const avgDaily = await getAverageDailyVolume(user._id);
  if (total > avgDaily * 5) score += 25;
  
  // New account sending high volume
  if (dayjs().diff(user.created_at, 'days') < 7 && total > 100) score += 40;
  
  return Math.min(score, 100);
}

const ABUSE_THRESHOLD = 50;
```

#### Automatic Throttling
```javascript
async function applyThrottling(email, abuseScore) {
  if (abuseScore > ABUSE_THRESHOLD) {
    const throttleDuration = Math.min(
      ms('1h') * Math.pow(2, Math.floor(abuseScore / 20)), // Exponential backoff
      ms('24h') // Max 24 hours
    );
    
    await Emails.updateMany(
      { user: email.user, status: 'queued' },
      {
        $set: {
          priority: PRIORITY_LEVELS.THROTTLED,
          throttled_until: new Date(Date.now() + throttleDuration)
        }
      }
    );
    
    // Alert admins
    await emailHelper({
      template: 'alert',
      message: {
        to: config.email.message.from,
        subject: 'User throttled for suspicious activity'
      },
      locals: {
        user: email.user,
        abuseScore,
        throttleDuration: prettyMilliseconds(throttleDuration)
      }
    });
  }
}
```

### Phase 4: User-Level Fairness (Week 4)

#### Per-User Queue Distribution
```javascript
async function distributeByUser(domainId, domainLimit) {
  const userEmailCounts = await Emails.aggregate([
    {
      $match: {
        ...query,
        domain: domainId,
        $or: [
          { throttled_until: { $exists: false } },
          { throttled_until: { $lt: new Date() } }
        ]
      }
    },
    { $group: { _id: '$user', count: { $sum: 1 } } },
    { $sort: { count: 1 } }
  ]);

  const maxPerUser = Math.max(1, Math.floor(domainLimit / userEmailCounts.length));
  const selectedEmails = [];

  for (const { _id: userId, count } of userEmailCounts) {
    const userEmails = await Emails.find({
      ...query,
      domain: domainId,
      user: userId
    })
    .sort({ priority: -1, created_at: 1 })
    .limit(Math.min(maxPerUser, count))
    .lean();
    
    selectedEmails.push(...userEmails);
    if (selectedEmails.length >= domainLimit) break;
  }

  return selectedEmails;
}
```

### Phase 5: Monitoring & Tuning (Week 5)

#### Queue Fairness Metrics
```javascript
// Add to monitoring system
async function collectQueueMetrics() {
  const metrics = {
    // Domain distribution
    domainDistribution: await Emails.aggregate([
      { $match: { status: 'queued' } },
      { $group: { _id: '$domain', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]),
    
    // User distribution
    userDistribution: await Emails.aggregate([
      { $match: { status: 'queued' } },
      { $group: { _id: '$user', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]),
    
    // Priority distribution
    priorityDistribution: await Emails.aggregate([
      { $match: { status: 'queued' } },
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]),
    
    // Throttled users
    throttledCount: await Emails.countDocuments({
      status: 'queued',
      throttled_until: { $gt: new Date() }
    }),
    
    // Queue health score
    queueHealth: await calculateQueueHealth()
  };
  
  return metrics;
}
```

#### Adaptive Rate Limiting
```javascript
async function calculateAdaptiveLimits() {
  const queueHealth = await calculateQueueHealth();
  const baseLimit = config.smtpMaxQueue;
  
  return {
    high_priority: Math.floor(baseLimit * queueHealth.multiplier * 1.5),
    normal: Math.floor(baseLimit * queueHealth.multiplier),
    low: Math.floor(baseLimit * queueHealth.multiplier * 0.5),
    throttled: Math.max(1, Math.floor(baseLimit * queueHealth.multiplier * 0.1))
  };
}

async function calculateQueueHealth() {
  const totalQueued = await Emails.countDocuments({ status: 'queued' });
  const oldestQueued = await Emails.findOne(
    { status: 'queued' },
    { created_at: 1 },
    { sort: { created_at: 1 } }
  );
  
  const queueAge = oldestQueued ? 
    dayjs().diff(oldestQueued.created_at, 'minutes') : 0;
  
  // Health score from 0.1 (unhealthy) to 2.0 (very healthy)
  let multiplier = 1.0;
  
  if (totalQueued > config.smtpMaxQueue * 0.8) multiplier *= 0.7;
  if (queueAge > 30) multiplier *= 0.5; // Emails waiting > 30 minutes
  if (totalQueued < config.smtpMaxQueue * 0.3) multiplier *= 1.5;
  
  return {
    totalQueued,
    queueAge,
    multiplier: Math.max(0.1, Math.min(2.0, multiplier))
  };
}
```

### Phase 6: Advanced Features (Week 6+)

#### Premium Priority Lanes
```javascript
// Separate processing lanes for different priorities
const priorityQueues = {
  [PRIORITY_LEVELS.HIGH]: new PQueue({ concurrency: Math.floor(config.smtpMaxQueue * 0.4) }),
  [PRIORITY_LEVELS.NORMAL]: new PQueue({ concurrency: Math.floor(config.smtpMaxQueue * 0.4) }),
  [PRIORITY_LEVELS.LOW]: new PQueue({ concurrency: Math.floor(config.smtpMaxQueue * 0.15) }),
  [PRIORITY_LEVELS.THROTTLED]: new PQueue({ concurrency: Math.floor(config.smtpMaxQueue * 0.05) })
};

async function processEmailByPriority(email) {
  const targetQueue = priorityQueues[email.priority] || priorityQueues[PRIORITY_LEVELS.NORMAL];
  
  targetQueue.add(async () => {
    await processEmail({ email, resolver, client });
  });
}
```

#### Machine Learning Integration
```javascript
// Future enhancement: ML-based abuse detection
async function mlAbuseDetection(user, email) {
  const features = await extractFeatures(user, email);
  const prediction = await mlModel.predict(features);
  
  return {
    abuseScore: prediction.score,
    confidence: prediction.confidence,
    reasons: prediction.reasons
  };
}
```

## Configuration Updates

### Environment Variables
```bash
# Add to .env
SMTP_FAIR_QUEUE_ENABLED=true
SMTP_ABUSE_DETECTION_ENABLED=true
SMTP_ABUSE_THRESHOLD=50
SMTP_MAX_THROTTLE_DURATION=86400000  # 24 hours
SMTP_PRIORITY_MULTIPLIERS="2,1,0.5,0.1"  # HIGH,NORMAL,LOW,THROTTLED
```

### Config Updates
```javascript
// Add to config/index.js
module.exports = {
  // ... existing config
  
  // Fair queue settings
  smtpFairQueueEnabled: boolean(env.SMTP_FAIR_QUEUE_ENABLED),
  smtpAbuseDetectionEnabled: boolean(env.SMTP_ABUSE_DETECTION_ENABLED),
  smtpAbuseThreshold: Number.parseInt(env.SMTP_ABUSE_THRESHOLD, 10) || 50,
  smtpMaxThrottleDuration: Number.parseInt(env.SMTP_MAX_THROTTLE_DURATION, 10) || ms('24h'),
  smtpPriorityMultipliers: (env.SMTP_PRIORITY_MULTIPLIERS || '2,1,0.5,0.1')
    .split(',')
    .map(Number)
};
```

## Testing Strategy

### Unit Tests
- Priority calculation logic
- Abuse score calculation
- Fair distribution algorithms
- Throttling mechanisms

### Integration Tests
- End-to-end queue processing
- Database query performance
- Queue fairness under load
- Abuse detection accuracy

### Load Testing
- Queue performance with 10k+ emails
- Fairness maintenance under high load
- System stability during abuse scenarios
- Memory and CPU usage optimization

## Rollout Plan

### Stage 1: Database Migration
- Deploy schema changes
- Create indexes
- Migrate existing data

### Stage 2: Feature Flags
- Deploy code with features disabled
- Enable monitoring first
- Gradual feature enablement

### Stage 3: A/B Testing
- Split traffic between old/new systems
- Monitor fairness metrics
- Performance comparison

### Stage 4: Full Rollout
- Complete migration to fair queue
- Remove old code
- Full monitoring deployment

## Success Metrics

### Fairness Metrics
- **Gini coefficient** of email distribution per domain/user
- **Maximum queue monopolization** by single entity
- **Average wait time** across user tiers

### Performance Metrics
- **Queue processing throughput**
- **Database query performance**
- **Memory/CPU usage**
- **Email delivery latency**

### Abuse Detection Metrics
- **False positive rate** for throttling
- **Time to detect** abuse scenarios
- **Effectiveness** at preventing queue monopolization

## Benefits

1. **Prevents queue monopolization** by bad actors
2. **Maintains fairness** across all users and domains  
3. **Adaptive performance** based on system load
4. **Abuse detection** with automatic throttling
5. **Graceful degradation** under high load
6. **Backwards compatible** with existing system
7. **Premium user experience** through priority lanes
8. **Scalable architecture** for future growth

## Future Enhancements

- **Geographic distribution** fairness
- **Time-based priority** adjustments
- **Machine learning** abuse detection
- **Predictive scaling** based on queue patterns
- **Multi-tenant** isolation improvements
- **Real-time** queue visualization dashboard