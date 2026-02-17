# Real-Time API Notifications via WebSocket

This document outlines the WebSocket server implementation for the API, which provides real-time push notifications for all IMAP, CalDAV, and CardDAV operations, as well as global app update events.


## Table of Contents

* [Architecture](#architecture)
  * [Notification Flow](#notification-flow)
  * [Client-Controlled Encoding](#client-controlled-encoding)
* [Enriched Payloads](#enriched-payloads)
* [Supported Events](#supported-events)
* [Security](#security)
* [Client Integration](#client-integration)


## Architecture

The WebSocket server is integrated into the main API server, listening for HTTP upgrade requests on the `/v1/ws` path. Authentication is optional and, when provided, happens during the upgrade handshake before a connection is established. Unauthenticated clients are accepted and receive only global broadcast events (e.g. `newRelease`), while authenticated clients receive both per-alias events and broadcast events.

The system supports two notification types:

1. **Per-Alias Notifications**: When a state-changing operation occurs for a specific alias (e.g., a new email arrives, a calendar event is updated), the responsible handler calls `sendWebSocketNotification`. This function publishes a `msgpackr`-encoded message to a dedicated Redis pub/sub channel, scoped to a specific `aliasId`.
2. **Broadcast Notifications**: A background poller periodically checks for new releases of the [Forward Email Mail App](https://github.com/forwardemail/mail.forwardemail.net). If a new release is found (or an existing one is updated), the `ApiWebSocketHandler` broadcasts a `newRelease` event to **all** connected clients.

A subscriber on each API server instance listens to the Redis channel and forwards the notification to the appropriate WebSocket clients based on the delivery mode (per-alias or broadcast).

To detect updates to an existing release (e.g., when a GitHub Actions workflow adds compiled assets after initial publication), the poller computes and stores a **content fingerprint** of the release in Redis. This fingerprint is a SHA-256 hash of the tag name, body content, and a sorted list of asset names and sizes. Any change to these properties will result in a new fingerprint, triggering a `newRelease` broadcast even if the tag name remains the same.

**Asset Gating**: When a new release is detected but has no assets yet, the broadcast is deferred. The poller stores the tag as "pending" and waits. Once assets appear (detected by a change in the fingerprint on a subsequent poll), the pending flag is cleared and the `newRelease` event is broadcast. This ensures clients are only notified when downloadable artifacts are actually available.

### Notification Flow

```mermaid
graph TD
    subgraph "Client-Side Action / Timed Poller"
        A[IMAP, CalDAV, or CardDAV Operation]
        P[GitHub Release Poller]
    end

    subgraph "Server-Side Handler"
        A --> B["Operation Handler e.g., `on-append.js`"];
        B --> C["sendWebSocketNotification(aliasId, event, data)"];
        C --> D["encoder.pack({ aliasId, payload })"];
        D --> E["redis.publishBuffer(channel, packed_message)"];

        P --> Q["checkForNewMailAppRelease() → fingerprint + asset gating"];
        Q --> R["_broadcast(payload)"];
        R --> S["encoder.pack({ broadcast: true, payload })"];
        S --> E;
    end

    subgraph "Redis Pub/Sub"
        E -- "`WS_REDIS_CHANNEL_NAME`" --> F([msgpackr-encoded Buffer]);
    end

    subgraph "API Server (ApiWebSocketHandler)"
        F --> G["subscriber.on('messageBuffer')"];
        G --> H["decoder.unpack(message)"];
        H -- "broadcast: true" --> I_ALL["Broadcast to ALL clients"];
        H -- "has aliasId" --> I_ALIAS["Find clients for `aliasId`"];
        I_ALIAS --> J["For each client..."];
        I_ALL --> J;
        J -- "`?msgpackr=true`" --> K["Send Binary Frame (msgpackr)"];
        J -- "default" --> L["Send Text Frame (JSON)"];
    end

    subgraph "Connected Clients"
        K --> M["Webmail / Mobile App / etc."];
        L --> M;
    end

    style A fill:#f9f,stroke:#333,stroke-width:2px
    style P fill:#f9f,stroke:#333,stroke-width:2px
    style M fill:#ccf,stroke:#333,stroke-width:2px
```

### Client-Controlled Encoding

All internal communication uses `msgpackr` for efficiency. The client determines the final delivery format via a query parameter, allowing for flexibility.

| Connection URL                                   | Delivery Format        | Use Case                                   |
| ------------------------------------------------ | ---------------------- | ------------------------------------------ |
| `wss://api.forwardemail.net/v1/ws`               | JSON text frames       | Browser clients, easy debugging            |
| `wss://api.forwardemail.net/v1/ws?msgpackr=true` | msgpackr binary frames | Native apps, performance-sensitive clients |


## Enriched Payloads

To prevent clients from needing to make follow-up HTTP requests, notification payloads include the full resource object, mirroring the REST API responses.

* **IMAP message events** include the full raw email in an `eml` field.
* **CalDAV events** include the full iCalendar data in an `ical` field.
* **CardDAV events** include the full vCard data in a `content` field.
* **App release events** include a `release` object with details from the GitHub Release.

**Example `newMessage` Payload:**

```json
{
  "event": "newMessage",
  "timestamp": 1739347200000,
  "mailbox": "67abcdef1234567890abcdef",
  "message": {
    "id": "67abcdef1234567890abcdef",
    "uid": 42,
    "subject": "Hello World",
    "size": 1234,
    "eml": "From: sender@example.com\r\nTo: recipient@example.com\r\n..."
  }
}
```

**Example `newRelease` Payload:**

```json
{
  "event": "newRelease",
  "timestamp": 1739348200000,
  "release": {
    "tagName": "v1.2.3",
    "name": "Release v1.2.3",
    "body": "This release includes several bug fixes and performance improvements.",
    "htmlUrl": "https://github.com/forwardemail/mail.forwardemail.net/releases/tag/v1.2.3",
    "prerelease": false,
    "publishedAt": "2026-02-15T12:00:00Z",
    "author": {
      "login": "user",
      "avatarUrl": "https://github.com/avatars/user.png",
      "htmlUrl": "https://github.com/user"
    },
    "assets": [
      {
        "name": "mail.forwardemail.net-1.2.3.dmg",
        "size": 104857600,
        "downloadCount": 500,
        "browserDownloadUrl": "https://github.com/forwardemail/mail.forwardemail.net/releases/download/v1.2.3/mail.forwardemail.net-1.2.3.dmg"
      }
    ]
  }
}
```


## Supported Events

The implementation covers 20 distinct event types across three protocols and one global event type.

#### IMAP Events

| Event              | Trigger                    | Key Payload Fields                                                   |
| ------------------ | -------------------------- | -------------------------------------------------------------------- |
| `newMessage`       | `APPEND` / SMTP delivery   | `mailbox`, `message` (with `eml`)                                    |
| `messagesMoved`    | `MOVE`                     | `sourceMailbox`, `destinationMailbox`, `sourceUid`, `destinationUid` |
| `messagesCopied`   | `COPY`                     | `sourceMailbox`, `destinationMailbox`, `sourceUid`, `destinationUid` |
| `flagsUpdated`     | `STORE` / implicit `\Seen` | `mailbox`, `action`, `flags`, `uid`                                  |
| `messagesExpunged` | `EXPUNGE`                  | `mailbox`, `uids`                                                    |
| `mailboxCreated`   | `CREATE`                   | `path`, `mailbox`                                                    |
| `mailboxDeleted`   | `DELETE`                   | `path`, `mailbox`                                                    |
| `mailboxRenamed`   | `RENAME`                   | `oldPath`, `newPath`, `mailbox`                                      |

#### CalDAV & CardDAV Events

Notifications are sent for all `Created`, `Updated`, and `Deleted` operations on calendars, calendar events, address books, and contacts.

#### App Release Events

| Event        | Trigger                                                                                                                                                                   | Key Payload Fields |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| `newRelease` | A new version of the [Forward Email Mail App](https://github.com/forwardemail/mail.forwardemail.net) is published, or an existing release is updated (e.g. assets added). | `release`          |


## Security

Security is a primary design consideration, addressed through multiple layers:

1. **Optional Authentication**: Authentication is optional. Authenticated clients receive both per-alias events and global broadcast events. Unauthenticated clients are also accepted but only receive global broadcast events (e.g. `newRelease`). Both API Token (`?alias_id=` required) and Alias Password auth are supported for authenticated connections.
2. **Read-Only Channel**: The connection is strictly for server-to-client push. Any data messages received from a client are silently ignored.
3. **Strict Channel Isolation**: For authenticated clients, the server maps connections to a specific `alias_id`. A client will only ever receive notifications for the alias it is subscribed to. Global events like `newRelease` are broadcast to all clients (both authenticated and unauthenticated).
4. **Rate Limiting & Connection Caps**: To prevent abuse, the server enforces a per-IP connection rate limit (30/minute), a per-alias connection limit for authenticated clients (10), a per-IP limit for unauthenticated clients (3), and a global connection limit (10,000).
5. **Keep-Alive**: A 30-second ping/pong keep-alive mechanism terminates unresponsive or stale connections.


## Client Integration

#### Browser (JSON)

**Authenticated:**

```javascript
const ws = new WebSocket("wss://api.forwardemail.net/v1/ws", {
  headers: {
    Authorization: `Basic ${btoa("user@domain.com:alias-password")}`
  }
});
```

**Unauthenticated (Broadcast-Only):**

```javascript
// No auth headers needed
const ws = new WebSocket("wss://api.forwardemail.net/v1/ws");
```

Both authenticated and unauthenticated clients handle messages the same way:

```javascript
ws.onmessage = (event) => {
  const notification = JSON.parse(event.data);
  console.log(notification.event, notification);
};
```

#### Node.js (msgpackr)

```javascript
const WebSocket = require("ws");
const { Decoder } = require("msgpackr");
const decoder = new Decoder();

const ws = new WebSocket(
  "wss://api.forwardemail.net/v1/ws?msgpackr=true",
  {
    headers: {
      Authorization: `Basic ${Buffer.from(
        "user@domain.com:alias-password"
      ).toString("base64")}`
    }
  }
);

ws.on("message", (data, isBinary) => {
  const notification = isBinary ? decoder.unpack(data) : JSON.parse(data);
  console.log(notification.event, notification);
});
```
