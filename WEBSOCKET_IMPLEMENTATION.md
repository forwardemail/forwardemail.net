# Real-Time API Notifications via WebSocket

This document outlines the WebSocket server implementation for the API, which provides real-time push notifications for all IMAP, CalDAV, and CardDAV operations.


## Table of Contents

* [Architecture](#architecture)
  * [Notification Flow](#notification-flow)
  * [Client-Controlled Encoding](#client-controlled-encoding)
* [Enriched Payloads](#enriched-payloads)
* [Supported Events](#supported-events)
* [Security](#security)
* [Client Integration](#client-integration)


## Architecture

The WebSocket server is integrated into the main API server, listening for HTTP upgrade requests on the `/v1/ws` path. Authentication happens during the upgrade handshake, before a connection is established.

When a state-changing operation occurs (e.g., a new email arrives, a calendar event is updated, a contact is deleted), the responsible handler calls `sendWebSocketNotification`. This function publishes a `msgpackr`-encoded message to a dedicated Redis pub/sub channel. A subscriber on each API server instance then broadcasts the notification to all relevant, authenticated WebSocket clients.

### Notification Flow

```mermaid
graph TD
    subgraph "Client-Side Action"
        A[IMAP, CalDAV, or CardDAV Operation]
    end

    subgraph "Server-Side Handler"
        A --> B{Operation Handler e.g., `on-append.js`};
        B --> C[sendWebSocketNotification(aliasId, event, data)];
        C --> D[encoder.pack({ aliasId, payload })];
        D --> E[redis.publishBuffer(channel, packed_message)];
    end

    subgraph "Redis Pub/Sub"
        E -- "`WS_REDIS_CHANNEL_NAME`" --> F((msgpackr-encoded Buffer));
    end

    subgraph "API Server (ApiWebSocketHandler)"
        F --> G{subscriber.on("messageBuffer")};
        G --> H[decoder.unpack(message)];
        H --> I{Find clients for `aliasId`};
        I --> J{For each client...};
        J -- "`?msgpackr=true`" --> K[Send Binary Frame (msgpackr)];
        J -- "default" --> L[Send Text Frame (JSON)];
    end

    subgraph "Connected Clients"
        K --> M[Webmail / Mobile App / etc.];
        L --> M;
    end

    style A fill:#f9f,stroke:#333,stroke-width:2px
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


## Supported Events

The implementation covers 19 distinct event types across the three protocols.

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


## Security

Security is a primary design consideration, addressed through multiple layers:

1. **Authentication at Handshake**: Auth is mandatory and occurs during the HTTP upgrade. Unauthenticated clients are rejected before the WebSocket connection is formed. Both API Token (`?alias_id=` required) and Alias Password auth are supported.
2. **Read-Only Channel**: The connection is strictly for server-to-client push. Any data messages received from a client are silently ignored.
3. **Strict Channel Isolation**: The server maps connections to a specific `alias_id` upon authentication. A client will only ever receive notifications for the alias it is subscribed to.
4. **Rate Limiting & Connection Caps**: To prevent abuse, the server enforces a per-IP connection rate limit (30/minute), a per-alias connection limit (10), and a global connection limit (10,000).
5. **Keep-Alive**: A 30-second ping/pong keep-alive mechanism terminates unresponsive or stale connections.


## Client Integration

#### Browser (JSON)

```javascript
const ws = new WebSocket("wss://api.forwardemail.net/v1/ws", {
  headers: {
    Authorization: `Basic ${btoa("user@domain.com:alias-password")}`
  }
});

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
