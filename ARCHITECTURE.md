# ForwardEmail.net — Deep Architecture Analysis

## Table of Contents

1. [High-Level Architecture](#1-high-level-architecture)
2. [Service Components](#2-service-components)
3. [Email Processing Pipeline](#3-email-processing-pipeline)
4. [Data Store Architecture (MongoDB, SQLite, Redis)](#4-data-store-architecture)
5. [Job & Worker Model (Bree)](#5-job--worker-model)
6. [API & Web Layer](#6-api--web-layer)
7. [Security & Encryption](#7-security--encryption)
8. [Calendar & Contacts (CalDAV/CardDAV)](#8-caldav--carddav)

---

## 1. High-Level Architecture

ForwardEmail is a **multi-process, multi-protocol email platform** composed of 11 independently deployable services managed via PM2.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        ForwardEmail.net Platform                            │
│                                                                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐  │
│  │ MX Server│ │SMTP Subm.│ │IMAP Srv  │ │POP3 Srv  │ │ ManageSieve Srv  │  │
│  │ (Port 25)│ │(587/465) │ │(993/143) │ │(995/110) │ │ (Sieve filters)  │  │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘ └────────┬─────────┘  │
│       │             │            │             │                │            │
│  ┌────┴─────────────┴────────────┴─────────────┴────────────────┴────────┐  │
│  │                     Shared Helper Layer (206 modules)                  │  │
│  │  on-auth · on-data-mx · encrypt-message · imap-notifier · indexer     │  │
│  └───────┬──────────────────┬──────────────────┬────────────────────────┘  │
│          │                  │                  │                            │
│  ┌───────▼──────┐  ┌───────▼──────┐  ┌───────▼──────┐                     │
│  │   MongoDB    │  │    Redis     │  │ SQLite (per  │                      │
│  │  (Accounts,  │  │  (Cache,     │  │   alias DB,  │                      │
│  │   Domains,   │  │   Sessions,  │  │   encrypted) │                      │
│  │   Payments)  │  │   Pub/Sub)   │  │              │                      │
│  └──────────────┘  └──────────────┘  └──────────────┘                      │
│                                                                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐  │
│  │ Web Srv  │ │ API Srv  │ │CalDAV Srv│ │CardDAV   │ │  Bree Scheduler  │  │
│  │ (Koa/UI) │ │ (Koa/API)│ │(Calendar)│ │(Contacts)│ │  (86 cron jobs)  │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────────────┘  │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │              SQLite Server (Piscina worker pool + WebSocket)         │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Entry Points** — each is a standalone Node.js process:

| File | Service | Framework |
|------|---------|-----------|
| `mx.js` | Inbound mail exchange | smtp-server |
| `smtp.js` | Outbound SMTP submission | smtp-server |
| `imap.js` | IMAP mailbox access | WildDuck/IMAP-core |
| `pop3.js` | POP3 mailbox access | WildDuck POP3 |
| `web.js` | Dashboard UI | Koa 3 (@ladjs/web) |
| `api.js` | REST API | Koa 3 (@ladjs/api) |
| `caldav.js` | Calendar sync | caldav-adapter |
| `carddav.js` | Contact sync | Custom CardDAV |
| `sqlite.js` | SQLite DB server | Piscina + WebSocket |
| `bree.js` | Job scheduler | Bree |
| `managesieve.js` | Email filtering | Custom Sieve engine |

---

## 2. Service Components

### Inter-Service Communication

```
                    ┌─────────────────┐
                    │   Redis Pub/Sub  │
                    │  ┌─────────────┐ │
                    │  │ pgp_reload  │ │  ◄── Notify all servers when PGP keys change
                    │  │ smime_reload│ │  ◄── Notify all servers when S/MIME certs change
                    │  │ IMAP notify │ │  ◄── Real-time IMAP folder/message changes
                    │  └─────────────┘ │
                    └────────┬────────┘
           ┌─────────────────┼─────────────────┐
           │                 │                 │
    ┌──────▼──────┐   ┌─────▼──────┐   ┌─────▼──────┐
    │  SMTP/MX    │   │  IMAP/POP3 │   │   CalDAV/  │
    │  Servers    │   │  Servers   │   │   CardDAV   │
    └──────┬──────┘   └─────┬──────┘   └─────┬──────┘
           │                │                 │
           │         ┌──────▼──────┐          │
           │         │  WebSocket  │          │
           │         │  (wsp)      │          │
           │         └──────┬──────┘          │
           │                │                 │
           │         ┌──────▼──────┐          │
           └────────►│SQLite Server│◄─────────┘
                     │(Piscina     │
                     │ worker pool)│
                     └─────────────┘
```

**Key patterns:**

- **Redis Pub/Sub** — inter-process event broadcasting (PGP key changes, IMAP notifications)
- **WebSocket (wsp)** — IMAP/POP3/CalDAV access SQLite databases remotely when the file isn't local
- **Piscina** — thread pool in the SQLite server for concurrent DB operations
- **PM2** — each service has its own `ecosystem-*.json` for independent process management and scaling

---

## 3. Email Processing Pipeline

### 3.1 Inbound Mail (MX Server → Forwarding)

```
External Sender
      │
      ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    MX SERVER (Port 25)                               │
│  on-connect.js ──► on-mail-from.js ──► on-rcpt-to.js ──► on-data   │
└──────────────────────────────────────────────────────┬──────────────┘
                                                       │
                                                       ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    on-data-mx.js (~1800 lines)                      │
│                                                                     │
│  ┌──────────────┐    ┌──────────────┐    ┌────────────────────┐     │
│  │ 1. Parse     │───►│ 2. Auth      │───►│ 3. Spam/Abuse      │     │
│  │    Headers   │    │ SPF/DKIM/    │    │ Greylisting        │     │
│  │    Validate  │    │ DMARC/ARC    │    │ Denylist check     │     │
│  │    Loop det. │    │ (mailauth)   │    │ Backscatter det.   │     │
│  └──────────────┘    └──────────────┘    │ Silent ban check   │     │
│                                          └─────────┬──────────┘     │
│                                                    │                │
│  ┌──────────────┐    ┌──────────────┐    ┌─────────▼──────────┐     │
│  │ 6. Queue to  │◄───│ 5. DKIM Sign │◄───│ 4. Resolve Forward │     │
│  │    MongoDB   │    │    + SRS     │    │    Addresses       │     │
│  │    (Emails)  │    │    Rewrite   │    │    (TXT records,   │     │
│  └──────┬───────┘    └──────────────┘    │     regex, +tags)  │     │
│         │                                └────────────────────┘     │
│         │            ┌──────────────┐                               │
│         │            │ 5a. Encrypt  │  ◄── PGP or S/MIME if        │
│         │            │     (OpenPGP │      recipient has public key │
│         │            │      /S/MIME)│                               │
│         │            └──────────────┘                               │
└─────────┼───────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────┐
│               OUTBOUND WORKER (process-email.js ~1600 lines)        │
│                                                                     │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────────┐   │
│  │ 1. Atomic    │───►│ 2. Validate  │───►│ 3. Prepare Message   │   │
│  │    Lock      │    │    User/     │    │    Headers, DKIM,    │   │
│  │    (MongoDB  │    │    Domain/   │    │    SRS rewrite       │   │
│  │    findOne-  │    │    Alias     │    └──────────┬───────────┘   │
│  │    AndUpdate)│    │    still OK  │               │               │
│  └──────────────┘    └──────────────┘    ┌──────────▼───────────┐   │
│                                          │ 4. Send via          │   │
│  ┌──────────────┐    ┌──────────────┐    │    Nodemailer        │   │
│  │ 6. Webhook   │◄───│ 5. Handle    │◄───│    (SMTP transport)  │   │
│  │    Notify    │    │    Bounces   │    └──────────────────────┘   │
│  │    (HMAC     │    │    (soft/    │                               │
│  │     signed)  │    │     hard)    │                               │
│  └──────────────┘    └──────────────┘                               │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.2 Outbound Mail (User Submission)

```
Email Client (Thunderbird, Apple Mail, etc.)
      │
      ▼
┌──────────────────────────────────────────┐
│   SMTP SUBMISSION SERVER (Port 587/465)  │
│                                          │
│  on-auth.js ──► Rate Limit ──► on-data   │
│  (password     (async-       (validate   │
│   validation    ratelimiter   + queue)    │
│   pbkdf2/      ~100 msg/hr              │
│   argon2)      per alias)               │
└──────────────────┬───────────────────────┘
                   │
                   ▼
            MongoDB Emails
            (status: 'queued')
                   │
                   ▼
            Worker picks up
            (same process-email.js
             pipeline as above)
```

### 3.3 Mailbox Access (IMAP/POP3)

```
Email Client
      │
      ├──── IMAP (Port 993) ──────────────────────────────────────┐
      │     │                                                      │
      │     ├─ on-auth.js (credential validation)                 │
      │     ├─ on-open.js (SELECT mailbox)                        │
      │     ├─ on-fetch.js (FETCH messages)                       │
      │     ├─ on-search.js (SEARCH criteria)                     │
      │     ├─ on-store.js (SET flags: \Seen, \Flagged, etc.)     │
      │     ├─ on-move.js (MOVE between folders)                  │
      │     ├─ on-copy.js (COPY messages)                         │
      │     ├─ on-append.js (APPEND new message)                  │
      │     ├─ on-expunge.js (EXPUNGE deleted)                    │
      │     ├─ on-create/delete/rename.js (folder ops)            │
      │     └─ on-xapplepushservice.js (Apple Push Notifications) │
      │                         │                                  │
      │                         ▼                                  │
      │                  ┌──────────────┐                          │
      │                  │ SQLite DB    │  ◄── Per-alias encrypted │
      │                  │ (ChaCha20)   │      database file       │
      │                  │              │                          │
      │                  │ • Mailboxes  │                          │
      │                  │ • Messages   │                          │
      │                  │ • Threads    │                          │
      │                  │ • Attachments│                          │
      │                  └──────────────┘                          │
      │                         ▲                                  │
      │                         │ (WebSocket if not local)         │
      │                         │                                  │
      └──── POP3 (Port 995) ────┘                                  │
            │                                                      │
            ├─ on-list-messages.js                                 │
            ├─ on-fetch-message.js                                 │
            └─ on-update.js                                        │
                                                                   │
            ┌──────────────────────────────────────────────────────┘
            │
            ▼
     ┌──────────────┐     ┌──────────────┐
     │ IMAP Notifier│────►│ Redis Pub/Sub│──► Push to all
     │ (debounced   │     │              │   connected clients
     │  100ms batch)│     │ EXISTS/      │   (real-time updates)
     └──────────────┘     │ EXPUNGE/     │
                          │ FLAGS change │
                          └──────────────┘
```

---

## 4. Data Store Architecture

### Why Three Databases?

```
┌────────────────────────────────────────────────────────────────────┐
│                     DATA STORE RESPONSIBILITIES                    │
├────────────────────┬──────────────────────┬───────────────────────┤
│      MongoDB       │       Redis          │       SQLite          │
│  (Account Layer)   │   (Speed Layer)      │  (Privacy Layer)      │
├────────────────────┼──────────────────────┼───────────────────────┤
│ • User accounts    │ • Session storage    │ • Email messages      │
│ • Domains & DNS    │ • Rate limit state   │ • Attachments         │
│ • Aliases config   │ • Quota caching      │ • Mailbox structure   │
│ • Payment records  │ • DNS result cache   │ • Threads             │
│ • Analytics/Logs   │ • Migration guards   │ • Calendars/Events    │
│ • Email queue      │ • Pub/Sub events     │ • Contacts/AddressBook│
│ • Subscriptions    │ • Greylisting state  │ • Sieve scripts       │
│                    │ • Denylist/Allowlist  │ • Search results      │
├────────────────────┼──────────────────────┼───────────────────────┤
│ Flexible schema,   │ Sub-millisecond      │ Encrypted per-alias,  │
│ ACID transactions, │ access, TTL-based    │ horizontally scalable,│
│ rich queries       │ expiry, pub/sub      │ zero-knowledge privacy│
└────────────────────┴──────────────────────┴───────────────────────┘
```

### 4.1 MongoDB — The Account & Operational Store

**Connection**: Mongoose ODM, dual connections (`MONGO_URI` + `LOGS_URI`), pool size 500, Snappy compression.

**Core Models (28 total):**

```
┌──────────────────────────────────────────────────────────────┐
│                    MongoDB Collections                        │
├──────────────┬───────────────────────────────────────────────┤
│ Users        │ Accounts, plans, OTP, API tokens,             │
│ (36.6 KB)    │ Stripe/PayPal IDs, storage quotas             │
├──────────────┼───────────────────────────────────────────────┤
│ Domains      │ Custom domains, DNS verification status,      │
│ (77.8 KB)    │ DKIM keys (encrypted), members/roles,         │
│              │ webhook config, plan & quota overrides         │
├──────────────┼───────────────────────────────────────────────┤
│ Aliases      │ Email forwarding rules, storage location,     │
│ (38.4 KB)    │ password hashes (pbkdf2/argon2), PGP keys,    │
│              │ Apple Push tokens, Sieve script refs           │
├──────────────┼───────────────────────────────────────────────┤
│ Emails       │ Outbound queue: status (queued/pending/       │
│ (55.6 KB)    │ sent/failed), atomic locks, priority,         │
│              │ bounce tracking, DSN envelope                  │
├──────────────┼───────────────────────────────────────────────┤
│ Payments     │ Stripe/PayPal/Apple transactions,             │
│              │ invoices, plan durations, refund status        │
├──────────────┼───────────────────────────────────────────────┤
│ Logs         │ Activity audit trail, 30-day TTL              │
├──────────────┼───────────────────────────────────────────────┤
│ Analytics*   │ Privacy-first events (no IPs), session        │
│ Events/      │ hashing, 30-day TTL, separate LOGS_URI        │
│ Summary      │ connection for isolation                       │
├──────────────┼───────────────────────────────────────────────┤
│ Inquiries    │ Customer support tickets                      │
├──────────────┼───────────────────────────────────────────────┤
│ SelfTests    │ User-initiated domain/alias verifications     │
├──────────────┼───────────────────────────────────────────────┤
│ Upgrade-     │ Subscription renewal reminders                │
│ Reminders    │                                               │
└──────────────┴───────────────────────────────────────────────┘
```

**Email Queue Lock Pattern (Emails collection):**

```js
findOneAndUpdate({
  status: 'queued',
  is_locked: false,
  date: { $lte: now }
}, {
  $set: {
    is_locked: true,
    locked_by: workerIP,
    locked_at: now
  }
})
```

This provides distributed atomic locks — multiple workers safely dequeue without conflicts.

### 4.2 SQLite — The Encrypted Per-Alias Privacy Store

```
Production Path:  /mnt/{storage_location}/{alias_id}.sqlite
Dev Path:         {tmpdir}/{storage_location}/{alias_id}.sqlite
Temp Processing:  {alias_id}-tmp.sqlite

Encryption: ChaCha20 (via better-sqlite3-multiple-ciphers)
Mode:       WAL (Write-Ahead Logging) with PASSIVE checkpoints
```

**Each alias gets its own encrypted database with these tables:**

```
┌─────────────────────────────────────────────────────────────┐
│              SQLite Per-Alias Database Schema                │
│                                                             │
│  ┌────────────┐    ┌────────────┐    ┌──────────────┐       │
│  │ Mailboxes  │───►│  Messages  │───►│ Attachments  │       │
│  │            │    │            │    │              │       │
│  │ path       │    │ mailbox_id │    │ hash (dedup) │       │
│  │ uidValidity│    │ thread_id  │    │ content_type │       │
│  │ uidNext    │    │ uid        │    │ body (binary)│       │
│  │ modifyIndex│    │ flags[]    │    │ counter (ref)│       │
│  │ specialUse │    │ idate      │    └──────────────┘       │
│  │ retention  │    │ hdate      │                           │
│  │ subscribed │    │ labels[]   │    ┌──────────────┐       │
│  └────────────┘    │ exp/rdate  │    │   Threads    │       │
│                    └────────────┘    │              │       │
│                                     │ subject      │       │
│  ┌────────────┐    ┌────────────┐   │ messageIds[] │       │
│  │ Calendars  │───►│ Calendar   │   └──────────────┘       │
│  │            │    │ Events     │                           │
│  │ name       │    │ icalendar  │   ┌──────────────┐       │
│  │ color      │    │ rrule      │   │ SieveScripts │       │
│  │ description│    │ href       │   │              │       │
│  └────────────┘    └────────────┘   │ name         │       │
│                                     │ script_text  │       │
│  ┌────────────┐    ┌────────────┐   │ active       │       │
│  │ Address-   │───►│  Contacts  │   └──────────────┘       │
│  │ Books      │    │            │                           │
│  │ name       │    │ vcard_data │                           │
│  │ description│    │ email      │                           │
│  └────────────┘    └────────────┘                           │
└─────────────────────────────────────────────────────────────┘
```

**Maintenance operations** (guarded by Redis TTL checks to avoid repeated work):

| Redis Key Pattern | TTL | Purpose |
|---|---|---|
| `migrate_check:{alias_id}` | 1d | Schema migration |
| `folder_check:{alias_id}` | 1d | Create default IMAP folders |
| `trash_check:{alias_id}` | 1d | Clean Trash/Junk (30d retention) |
| `thread_check:{alias_id}` | 1d | Orphaned thread cleanup |
| `vacuum_check:{alias_id}` | 7d | VACUUM + optimize |
| `calendar_duplicate_check:{alias_id}` | 30d | Remove duplicate calendars |
| `storage_format_check:{alias_id}` | 30d | Migrate hex to base64 attachments |
| `pgp_repair_check:{alias_id}` | 30d | Repair corrupted PGP messages |

### 4.3 Redis — The Speed & Coordination Layer

```
┌─────────────────────────────────────────────────────────────────┐
│                        Redis Usage Map                          │
│                                                                 │
│  SESSION & AUTH                                                 │
│  ├─ koa:sess:{id}          Session data (web dashboard)         │
│  ├─ f:{fingerprint}        Login fingerprint tracking           │
│  └─ otp:{...}              OTP challenge state                  │
│                                                                 │
│  RATE LIMITING                                                  │
│  ├─ {env}:{ip}             SMTP per-IP rate limit               │
│  ├─ api_ratelimit:{key}    API request rate limit               │
│  └─ auth_ratelimit:{ip}    Failed auth attempt limiter          │
│                                                                 │
│  CACHING                                                        │
│  ├─ alias_quota:{id}       Quota + storage used (1d TTL)        │
│  ├─ koa-cache:{url}        HTTP response cache                  │
│  ├─ buffer-gzip:{key}      Pre-compressed response buffers      │
│  ├─ v1_settings:{key}      API settings cache                   │
│  ├─ v1_max_forwarded:{key} Max forwarded addresses              │
│  ├─ sts:{domain}           MTA-STS DNS policy cache             │
│  ├─ whois:{domain}         WHOIS lookup results                 │
│  └─ denylist:{value}       Denylisted IP/domain (30d)           │
│                                                                 │
│  ANTI-SPAM / SECURITY                                           │
│  ├─ greylist:{fingerprint} Greylisting state (5min-2hr)         │
│  ├─ allowlist:{value}      IP/domain allowlist                  │
│  ├─ backscatter:{value}    Backscatter detection                │
│  └─ silent_ban:{value}     Silent recipient rejection           │
│                                                                 │
│  SQLITE MAINTENANCE GUARDS                                      │
│  ├─ migrate_check:{id}     Schema migration done (1d)           │
│  ├─ folder_check:{id}      Default folders created (1d)         │
│  ├─ vacuum_check:{id}      DB optimized (7d)                    │
│  └─ ... (see table above)                                       │
│                                                                 │
│  PUB/SUB CHANNELS                                               │
│  ├─ pgp_reload             PGP key changed → all servers        │
│  ├─ smime_reload           S/MIME cert changed → all servers    │
│  └─ imap_notify            IMAP mailbox state changes           │
└─────────────────────────────────────────────────────────────────┘
```

### 4.4 Data Flow Between Stores

```
┌──────────────────────────────────────────────────────────────────┐
│             EXAMPLE: Receiving an Inbound Email                  │
│                                                                  │
│  1. SMTP connection arrives                                      │
│     │                                                            │
│     ▼                                                            │
│  2. Redis: Check rate limit (async-ratelimiter)                  │
│     │       Check greylist, denylist, allowlist                  │
│     ▼                                                            │
│  3. MongoDB: Query Aliases → get forwarding rules                │
│              Query Domains → get DKIM keys, plan                 │
│     │                                                            │
│     ▼                                                            │
│  4. Redis: Get cached quota (alias_quota:{id})                   │
│     │       If miss → calculate from MongoDB → cache 1d          │
│     ▼                                                            │
│  5. SQLite: Store message in per-alias encrypted DB              │
│     │        (Mailboxes + Messages + Attachments tables)         │
│     ▼                                                            │
│  6. Redis: Publish IMAP notification (EXISTS event)              │
│     │       Update quota cache                                   │
│     ▼                                                            │
│  7. MongoDB: Log analytics event (AnalyticsEvents)               │
│              Update Emails queue if forwarding needed             │
└──────────────────────────────────────────────────────────────────┘
```

---

## 5. Job & Worker Model

### Bree Scheduler Architecture

ForwardEmail uses **[Bree](https://github.com/breejs/bree)** — a Node.js job scheduler that runs jobs as separate worker threads.

```
┌────────────────────────────────────────────────────────────────────┐
│                      bree.js (Main Process)                        │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    Bree Scheduler Engine                      │  │
│  │                                                              │  │
│  │  Loads jobs/ directory → creates worker threads per schedule  │  │
│  │  Each job runs in its own thread (Piscina/worker_threads)    │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                              │                                     │
│         ┌────────────────────┼────────────────────┐                │
│         ▼                    ▼                    ▼                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐         │
│  │  Payment &   │  │  Email &     │  │  Security &      │         │
│  │  Billing     │  │  Domain Ops  │  │  Monitoring      │         │
│  │  Jobs        │  │  Jobs        │  │  Jobs            │         │
│  └──────────────┘  └──────────────┘  └──────────────────┘         │
└────────────────────────────────────────────────────────────────────┘
```

### Complete Job Inventory (86 jobs)

#### Payment & Billing

| Job | Interval | Purpose |
|-----|----------|---------|
| `stripe/*` | Various | Stripe webhook processing, sync |
| `paypal/*` | Various | PayPal integration jobs |
| `billing.js` | Hourly | Subscription status checks |
| `payment-email.js` | On-demand | Payment confirmation emails |
| `past-due-relief.js` | Daily | Handle past-due accounts |
| `subscription-renewal-reminder.js` | Daily | Upcoming renewal alerts |
| `visa-trial-subscription-requirement.js` | Daily | Trial compliance |

#### Email & Queue Operations

| Job | Interval | Purpose |
|-----|----------|---------|
| `check-smtp.js` | 1 hour | SMTP health verification |
| `check-smtp-frozen-queue.js` | 15 sec | Detect stuck queue items |
| `check-smtp-queue-count.js` | 5 min | Monitor queue depth |
| `check-scheduled-send.js` | 5 min | Clock skew detection |
| `delete-emails.js` | 1 hour | Purge based on retention |
| `unlock-emails.js` | Periodic | Recover crashed worker locks |
| `bounce-report.js` | 4 hours | Aggregate bounce stats |
| `weekly-dmarc-report.js` | 1 hour (weekly) | DMARC aggregate reports |

#### Domain & User Management

| Job | Interval | Purpose |
|-----|----------|---------|
| `check-domains.js` | 1 hour | DNS verification refresh |
| `check-bad-domains.js` | 1 hour | Detect misconfigured domains |
| `check-invalid-regex-aliases.js` | Daily | Validate regex patterns |
| `check-alias-recipient-abuse.js` | Daily | Detect abuse patterns |
| `check-suspicious-domain-signups.js` | 1 hour | Fraud detection |
| `check-suspicious-emails.js` | 6 hours | Content scanning |
| `check-denylisted-users.js` | Daily | Enforce denylists |
| `banned-user-abuse.js` | Daily | Post-ban cleanup |
| `ban-user-and-refund-payments.js` | On-demand | Account termination |
| `vanity-domains.js` | Daily | Special domain handling |

#### Notifications & Reminders

| Job | Interval | Purpose |
|-----|----------|---------|
| `account-updates.js` | 1 min | Account change notifications |
| `domain-updates.js` | 1 min | Domain change notifications |
| `send-verification-reminder.js` | Daily | Email verification nudges |
| `upgrade-reminder-email.js` | 6 hours | Plan upgrade prompts |
| `feature-reminder.js` | 3 hours | Feature discovery emails |
| `two-factor-reminder.js` | 3 hours | 2FA enablement nudges |
| `welcome-email.js` | On-demand | New user welcome |
| `recipient-verification-email.js` | On-demand | Verify recipient address |

#### Maintenance & Cleanup

| Job | Interval | Purpose |
|-----|----------|---------|
| `cleanup-database.js` | 1 hour | Orphaned record removal |
| `cleanup-denylist.js` | 30 min | Expire old denylist entries |
| `cleanup-expired-sessions.js` | 1 hour | Redis session cleanup |
| `cleanup-r2-backups.js` | Daily | S3/R2 backup rotation |
| `delete-logs.js` | 1 hour | Log retention enforcement |
| `update-uceprotect.js` | 1 hour | IP blocklist updates |
| `update-umbrella.js` | Daily | DNS blocklist updates |
| `monitor-redis-ttl.js` | Periodic | Ensure cache keys have TTLs |

#### Analytics & Reporting

| Job | Interval | Purpose |
|-----|----------|---------|
| `aggregate-analytics.js` | 1 hour | Summarize event data |
| `daily-log-alert.js` | Daily | Admin alert digest |
| `blocklist-digest.js` | 1 hour | Blocklist change summary |
| `parse-logs.js` | Periodic | Log analysis/parsing |
| `crawl-sitemap.js` | Daily | SEO monitoring |

---

## 6. API & Web Layer

### Web Application (Koa 3 + Pug)

```
┌─────────────────────────────────────────────────────────────────┐
│                    WEB SERVER (Koa 3)                            │
│                                                                 │
│  Middleware Pipeline:                                            │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌──────────┐ ┌─────────┐ │
│  │ Helmet  │►│ Session │►│  i18n   │►│Rate Limit│►│ Router  │ │
│  │ (CSP,   │ │ (Redis) │ │(27 lang)│ │ (Redis)  │ │         │ │
│  │  HSTS)  │ │         │ │         │ │          │ │         │ │
│  └─────────┘ └─────────┘ └─────────┘ └──────────┘ └────┬────┘ │
│                                                         │      │
│  Routes:                                                ▼      │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ /                  → Landing, pricing, features            │ │
│  │ /auth/*            → Login, register, password reset, OTP  │ │
│  │ /my-account/*      → Dashboard (72 sub-controllers!)       │ │
│  │   /domains         → Domain CRUD, DNS verify, DKIM setup   │ │
│  │   /aliases         → Alias management, forwarding rules    │ │
│  │   /billing         → Stripe/PayPal subscription mgmt       │ │
│  │   /settings        → Profile, 2FA, WebAuthn, API tokens    │ │
│  │ /admin/*           → Admin panel (14 sub-controllers)      │ │
│  │   /users           → User management                       │ │
│  │   /domains         → Domain oversight                      │ │
│  │   /payments        → Payment/refund management             │ │
│  │   /inquiries       → Support ticket handling               │ │
│  │   /analytics       → Platform analytics dashboard          │ │
│  │   /allowlist       → IP/domain allowlisting                │ │
│  │   /denylist        → IP/domain denylisting                 │ │
│  │   /logs            → System log viewer                     │ │
│  │   /emails          → Email queue management                │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  Views: Pug templates (71 views)                                │
│  Frontend: Bootstrap 4 + jQuery + ApexCharts + CodeMirror       │
│  Build: Browserify + Babel + Gulp (SCSS → CSS)                  │
└─────────────────────────────────────────────────────────────────┘
```

### REST API (Koa 3)

```
┌─────────────────────────────────────────────────────────────────┐
│                    API SERVER (Koa 3)                            │
│                                                                 │
│  Auth: Basic Auth (API token as username OR alias credentials)  │
│                                                                 │
│  /v1/account      POST (create) | GET | PUT                    │
│  /v1/domains      CRUD + /verify-records + /verify-smtp         │
│  /v1/domains/:id/invites    GET | POST | DELETE                 │
│  /v1/domains/:id/members    PUT | DELETE                        │
│  /v1/aliases      CRUD + /verify                                │
│  /v1/emails       POST (send, multipart) | GET | DELETE         │
│  /v1/emails/limit GET (rate limit info)                         │
│  /v1/logs/download GET                                          │
│                                                                 │
│  Webhooks:                                                      │
│  /v1/stripe       POST (Stripe webhook)                         │
│  /v1/paypal       POST (PayPal webhook)                         │
│  /v1/apple        POST (Apple webhook)                          │
│                                                                 │
│  Internal (API secret required):                                │
│  /v1/lookup       GET (domain/email lookup)                     │
│  /v1/settings     GET (server settings)                         │
│  /v1/self-test    POST (delivery test)                          │
│  /v1/max-forwarded-addresses  GET                               │
│                                                                 │
│  Rate Limits:                                                   │
│  • Account creation: 5/day                                      │
│  • Domain creation: 50/day                                      │
│  • Invite creation: 10/day                                      │
│  • Log downloads: 20/day                                        │
│  • General API: 1000/day                                        │
│  • Email sending: ~100/hour (per alias)                         │
└─────────────────────────────────────────────────────────────────┘
```

### Authentication Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                   Authentication Methods                         │
│                                                                 │
│  WEB (Session-based):                                           │
│  ┌──────────┐    ┌───────────┐    ┌──────────┐                  │
│  │ Email +  │───►│ Passport  │───►│ Redis    │                  │
│  │ Password │    │ Local     │    │ Session  │                  │
│  └──────────┘    │ Strategy  │    │ (30d)    │                  │
│                  └─────┬─────┘    └──────────┘                  │
│  ┌──────────┐          │                                        │
│  │ FIDO2    │──────────┘  ◄── WebAuthn hardware keys            │
│  │ WebAuthn │                                                   │
│  └──────────┘                                                   │
│                                                                 │
│  ┌──────────┐    ┌───────────┐                                  │
│  │ TOTP/OTP │───►│ Required  │  ◄── 2FA for sensitive ops       │
│  │ (otplib) │    │ for admin │      Recovery keys available     │
│  └──────────┘    └───────────┘                                  │
│                                                                 │
│  API (Token-based):                                             │
│  ┌──────────────────────────────────────────────┐               │
│  │ Authorization: Basic {api_token}:            │               │
│  │         OR                                   │               │
│  │ Authorization: Basic {alias_email}:{password}│               │
│  └──────────────────────────────────────────────┘               │
│                                                                 │
│  SMTP/IMAP/POP3 (on-auth.js):                                  │
│  ┌──────────────────────────────────────────────┐               │
│  │ Username: alias email address                │               │
│  │ Password: alias-specific generated password  │               │
│  │ Hash: pbkdf2 → migrating to argon2           │               │
│  │ Rate limit: 10 failed attempts/day/IP        │               │
│  └──────────────────────────────────────────────┘               │
└─────────────────────────────────────────────────────────────────┘
```

---

## 7. Security & Encryption

### Encryption Layers

```
┌─────────────────────────────────────────────────────────────────┐
│                    ENCRYPTION ARCHITECTURE                       │
│                                                                 │
│  TRANSPORT LAYER (in-transit)                                   │
│  ├─ TLS 1.2+ on all protocol servers                            │
│  ├─ STARTTLS support for legacy clients                         │
│  ├─ RFC 8689 REQUIRETLS for enforced encryption                 │
│  └─ MTA-STS policy caching (via Redis)                          │
│                                                                 │
│  MESSAGE LAYER (end-to-end)                                     │
│  ├─ PGP/OpenPGP (encrypt-message.js)                            │
│  │   ├─ AES-256 symmetric encryption                            │
│  │   ├─ Multipart/encrypted MIME (RFC 4880)                     │
│  │   ├─ Key sources: user-uploaded, WKD auto-discovery          │
│  │   └─ Redis pub/sub: pgp_reload on key changes               │
│  │                                                              │
│  └─ S/MIME (encrypt-message-smime.js)                           │
│      ├─ Certificate-based encryption                            │
│      └─ Redis pub/sub: smime_reload on cert changes             │
│                                                                 │
│  STORAGE LAYER (at-rest)                                        │
│  ├─ SQLite: ChaCha20 cipher (per-alias DB encryption)           │
│  ├─ MongoDB field-level encryption:                             │
│  │   ├─ V2: AES-256-GCM + base64url                            │
│  │   │   Format: version(1B) + IV(12B) + tag(16B) + ciphertext │
│  │   ├─ V3 reserved: XWing (X25519 + ML-KEM-768) — quantum-    │
│  │   │   resistant                                              │
│  │   └─ Master key: HELPER_ENCRYPTION_KEY env var               │
│  └─ Encrypted fields: DKIM private keys, webhook keys,         │
│     sensitive user data                                         │
│                                                                 │
│  AUTHENTICATION LAYER                                           │
│  ├─ Passwords: pbkdf2 → argon2 migration path                   │
│  ├─ DKIM: RSA-SHA256, relaxed/relaxed canonicalization           │
│  ├─ SPF/DMARC/ARC: Full mailauth verification                   │
│  └─ SRS: Sender Rewriting Scheme for bounce authentication      │
└─────────────────────────────────────────────────────────────────┘
```

### Anti-Spam & Abuse Prevention

```
┌─────────────────────────────────────────────────────────────────┐
│               MULTI-LAYER DEFENSE SYSTEM                        │
│                                                                 │
│  Layer 1: CONNECTION                                            │
│  ├─ IP rate limiting (async-ratelimiter + Redis)                │
│  ├─ Denylist check (is-denylisted.js)                           │
│  ├─ Allowlist bypass (trusted senders)                          │
│  └─ Reverse DNS validation                                     │
│                                                                 │
│  Layer 2: ENVELOPE                                              │
│  ├─ MAIL FROM validation                                        │
│  ├─ RCPT TO validation (alias exists?)                          │
│  ├─ Silent banning (no error response → stealth rejection)      │
│  └─ Backscatter detection                                      │
│                                                                 │
│  Layer 3: MESSAGE                                               │
│  ├─ SPF record validation                                       │
│  ├─ DKIM signature verification                                │
│  ├─ DMARC policy enforcement (reject/quarantine/none)           │
│  ├─ ARC chain validation                                        │
│  └─ Received header loop detection (>25 hops → reject)          │
│                                                                 │
│  Layer 4: CONTENT                                               │
│  ├─ Greylisting (fingerprint-based, 5min→2hr window)            │
│  ├─ Auto-reply/mailing-list detection                           │
│  └─ Blocked hash tracking (known spam content)                  │
│                                                                 │
│  Layer 5: DELIVERY                                              │
│  ├─ Bounce categorization (soft/hard)                           │
│  ├─ DSN generation (RFC 3464)                                   │
│  ├─ Webhook notifications (HMAC-signed)                         │
│  └─ Automatic account restrictions on abuse                     │
│                                                                 │
│  Background Jobs:                                               │
│  ├─ check-suspicious-domain-signups (1h)                        │
│  ├─ check-suspicious-emails (6h)                                │
│  ├─ banned-user-abuse (daily)                                   │
│  ├─ update-uceprotect (1h) — IP blocklist sync                  │
│  └─ update-umbrella (daily) — DNS blocklist sync                │
└─────────────────────────────────────────────────────────────────┘
```

---

## 8. CalDAV & CardDAV

```
┌────────────────────────────────────────────────────────────────┐
│                CALENDAR & CONTACTS SERVICES                     │
│                                                                │
│  ┌──────────────┐              ┌──────────────┐                │
│  │  CalDAV Srv  │              │ CardDAV Srv  │                │
│  │  (RFC 4791)  │              │ (RFC 6352)   │                │
│  │              │              │              │                │
│  │  • Event     │              │  • Contacts  │                │
│  │    CRUD      │              │    CRUD      │                │
│  │  • Scheduling│              │  • vCard     │                │
│  │    (RFC 6638)│              │    import/   │                │
│  │  • Recurring │              │    export    │                │
│  │    events    │              │  • Directory │                │
│  │  • Invites   │              │    queries   │                │
│  └──────┬───────┘              └──────┬───────┘                │
│         │                             │                        │
│         ▼                             ▼                        │
│  ┌────────────────────────────────────────────┐                │
│  │           SQLite (per-alias DB)            │                │
│  │                                            │                │
│  │  Calendars → CalendarEvents                │                │
│  │  AddressBooks → Contacts                   │                │
│  └────────────────────────────────────────────┘                │
└────────────────────────────────────────────────────────────────┘
```

---

## Complete System Topology

```
                              INTERNET
                                 │
                 ┌───────────────┼───────────────────┐
                 │               │                   │
                 ▼               ▼                   ▼
          ┌──────────┐   ┌──────────┐        ┌──────────┐
          │ MX (25)  │   │SMTP(587) │        │ Web/API  │
          │ Inbound  │   │Submission│        │ (HTTP/S) │
          └────┬─────┘   └────┬─────┘        └────┬─────┘
               │              │                    │
     ┌─────────┴──────────────┴────────────────────┴──────────┐
     │                    SHARED LAYER                         │
     │                                                        │
     │  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
     │  │  Redis   │  │ MongoDB  │  │  SQLite  │             │
     │  │          │  │          │  │  Server  │             │
     │  │ Cache    │  │ Accounts │  │          │             │
     │  │ Sessions │  │ Domains  │  │ Per-alias│             │
     │  │ Pub/Sub  │  │ Queue    │  │ encrypted│             │
     │  │ Rate Lim │  │ Payments │  │ mailboxes│             │
     │  │ Greylist │  │ Analytics│  │ calendar │             │
     │  └──────────┘  └──────────┘  │ contacts │             │
     │                              └──────────┘             │
     │                                    ▲                  │
     │                    ┌───────────────┤                   │
     │                    │ WebSocket     │                   │
     │              ┌─────┴────┐   ┌─────┴────┐              │
     │              │IMAP(993) │   │POP3(995) │              │
     │              └──────────┘   └──────────┘              │
     │                                                        │
     │  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐ │
     │  │ CalDAV   │  │ CardDAV  │  │ ManageSieve          │ │
     │  │ (Cal.)   │  │ (Cont.)  │  │ (Email Filtering)    │ │
     │  └──────────┘  └──────────┘  └──────────────────────┘ │
     │                                                        │
     │  ┌────────────────────────────────────────────────┐    │
     │  │          Bree Job Scheduler (86 jobs)          │    │
     │  │  Billing · Domain checks · Cleanup · Analytics │    │
     │  │  Bounce reports · Blocklist sync · Reminders   │    │
     │  └────────────────────────────────────────────────┘    │
     │                                                        │
     │  ┌────────────────────────────────────────────────┐    │
     │  │     S3/Cloudflare R2 (Attachment Storage)      │    │
     │  └────────────────────────────────────────────────┘    │
     └────────────────────────────────────────────────────────┘
```

---

## Summary of Key Architectural Decisions

| Decision | Rationale |
|----------|-----------|
| **Per-alias SQLite + ChaCha20** | Zero-knowledge privacy — each user's mail is encrypted in its own DB file, horizontally scalable without MongoDB sharding |
| **MongoDB for accounts/queue** | Flexible schema for evolving models, atomic `findOneAndUpdate` for distributed queue locking, rich querying for admin/analytics |
| **Redis for everything ephemeral** | Sub-millisecond caching, TTL-based auto-expiry, pub/sub for real-time IMAP notifications and key reload events |
| **11 independent PM2 processes** | Isolated failure domains, independent scaling per protocol, zero-downtime deploys |
| **Bree (not Bull/Agenda)** | Worker thread isolation per job, no Redis dependency for scheduling (jobs defined in code), built-in cron + interval support |
| **WebSocket bridge to SQLite** | IMAP/POP3 servers can read mailboxes even when the SQLite file is on a different node — distributed access pattern |
| **SRS + DKIM per-domain** | Proper bounce handling across forwarding hops; domains can bring their own DKIM keys with custom selectors |
| **Koa 3 (not Express)** | Lightweight, async/await native, middleware composition via `@ladjs/*` ecosystem built by the same team |
| **Pug SSR (not SPA)** | SEO-friendly, fast initial load, 27-language i18n rendered server-side |
