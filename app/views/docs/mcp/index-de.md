# Forward Email MCP Server {#forward-email-mcp-server}

<img loading="lazy" src="/img/articles/mcp.webp" alt="Forward Email MCP Server" class="rounded-lg" />

<p class="lead mt-3">
  <strong>TL;DR:</strong> Unser <a href="https://github.com/forwardemail/mcp-server">Open-Source MCP-Server</a> ermöglicht es KI-Assistenten wie Claude, ChatGPT, Cursor und Windsurf, Ihre E-Mails, Domains, Aliase, Kontakte und Kalender über natürliche Sprache zu verwalten. Alle 68 API-Endpunkte sind als MCP-Tools verfügbar. Er läuft lokal über <code>npx @forwardemail/mcp-server</code> — Ihre Zugangsdaten verlassen niemals Ihr Gerät.
</p>


## Inhaltsverzeichnis {#table-of-contents}

* [Was ist MCP?](#what-is-mcp)
* [Schnellstart](#quick-start)
  * [API-Schlüssel erhalten](#get-an-api-key)
  * [Claude Desktop](#claude-desktop)
  * [Cursor](#cursor)
  * [Windsurf](#windsurf)
  * [Andere MCP-Clients](#other-mcp-clients)
* [Authentifizierung](#authentication)
  * [API-Schlüssel Auth](#api-key-auth)
  * [Alias Auth](#alias-auth)
  * [Alias-Passwort generieren](#generating-an-alias-password)
* [Alle 68 Tools](#all-68-tools)
  * [Konto (API-Schlüssel oder Alias Auth)](#account-api-key-or-alias-auth)
  * [Domains (API-Schlüssel)](#domains-api-key)
  * [Aliase (API-Schlüssel)](#aliases-api-key)
  * [E-Mails — Ausgehender SMTP (API-Schlüssel; Senden unterstützt beides)](#emails--outbound-smtp-api-key-send-supports-both)
  * [Nachrichten — IMAP (Alias Auth)](#messages--imap-alias-auth)
  * [Ordner — IMAP (Alias Auth)](#folders--imap-alias-auth)
  * [Kontakte — CardDAV (Alias Auth)](#contacts--carddav-alias-auth)
  * [Kalender — CalDAV (Alias Auth)](#calendars--caldav-alias-auth)
  * [Kalenderereignisse — CalDAV (Alias Auth)](#calendar-events--caldav-alias-auth)
  * [Sieve-Skripte (API-Schlüssel)](#sieve-scripts-api-key)
  * [Sieve-Skripte (Alias Auth)](#sieve-scripts-alias-auth)
  * [Domain-Mitglieder und Einladungen (API-Schlüssel)](#domain-members-and-invites-api-key)
  * [Catch-All-Passwörter (API-Schlüssel)](#catch-all-passwords-api-key)
  * [Protokolle (API-Schlüssel)](#logs-api-key)
  * [Verschlüsseln (Keine Auth)](#encrypt-no-auth)
* [20 Praxisbeispiele](#20-real-world-use-cases)
  * [1. E-Mail-Triage](#1-email-triage)
  * [2. Automatisierung der Domain-Einrichtung](#2-domain-setup-automation)
  * [3. Massenverwaltung von Aliasen](#3-bulk-alias-management)
  * [4. Überwachung von E-Mail-Kampagnen](#4-email-campaign-monitoring)
  * [5. Kontakt-Synchronisation und Bereinigung](#5-contact-sync-and-cleanup)
  * [6. Kalenderverwaltung](#6-calendar-management)
  * [7. Automatisierung von Sieve-Skripten](#7-sieve-script-automation)
  * [8. Team-Onboarding](#8-team-onboarding)
  * [9. Sicherheitsüberprüfung](#9-security-auditing)
  * [10. Einrichtung der E-Mail-Weiterleitung](#10-email-forwarding-setup)
  * [11. Postfachsuche und Analyse](#11-inbox-search-and-analysis)
  * [12. Ordnerorganisation](#12-folder-organization)
  * [13. Passwortrotation](#13-password-rotation)
  * [14. DNS-Eintrag-Verschlüsselung](#14-dns-record-encryption)
  * [15. Analyse von Zustellprotokollen](#15-delivery-log-analysis)
  * [16. Verwaltung mehrerer Domains](#16-multi-domain-management)
  * [17. Catch-All-Konfiguration](#17-catch-all-configuration)
  * [18. Verwaltung von Domain-Einladungen](#18-domain-invite-management)
  * [19. S3-Speichertests](#19-s3-storage-testing)
  * [20. Verfassen von E-Mail-Entwürfen](#20-email-draft-composition)
* [Beispiel-Prompts](#example-prompts)
* [Umgebungsvariablen](#environment-variables)
* [Sicherheit](#security)
* [Programmgesteuerte Nutzung](#programmatic-usage)
* [Open Source](#open-source)


## Was ist MCP? {#what-is-mcp}

[Model Context Protocol](https://modelcontextprotocol.io) (MCP) ist ein offener Standard, der von Anthropic entwickelt wurde und es KI-Modellen ermöglicht, externe Tools sicher aufzurufen. Anstatt API-Antworten in ein Chatfenster zu kopieren, erhält das Modell direkten, strukturierten Zugriff auf Ihre Dienste.

Unser MCP-Server kapselt die gesamte [Forward Email API](/email-api) — jeden Endpunkt, jeden Parameter — und stellt sie als Tools bereit, die jeder MCP-kompatible Client nutzen kann. Der Server läuft lokal auf Ihrem Gerät über stdio-Transport. Ihre Zugangsdaten bleiben in Ihren Umgebungsvariablen und werden niemals an das KI-Modell gesendet.


## Schnellstart {#quick-start}

### API-Schlüssel erhalten {#get-an-api-key}
1. Melden Sie sich bei Ihrem [Forward Email-Konto](/my-account/domains) an.
2. Gehen Sie zu **Mein Konto** → **Sicherheit** → **API-Schlüssel**.
3. Erstellen Sie einen neuen API-Schlüssel und kopieren Sie ihn.

### Claude Desktop {#claude-desktop}

Fügen Sie dies zu Ihrer Claude Desktop-Konfigurationsdatei hinzu:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "forwardemail": {
      "command": "npx",
      "args": ["-y", "@forwardemail/mcp-server"],
      "env": {
        "FORWARD_EMAIL_API_KEY": "your-api-key-here",
        "FORWARD_EMAIL_ALIAS_USER": "you@example.com",
        "FORWARD_EMAIL_ALIAS_PASSWORD": "your-generated-alias-password"
      }
    }
  }
}
```

Starten Sie Claude Desktop neu. Sie sollten die Forward Email-Tools im Tool-Auswahlmenü sehen.

> **Hinweis:** Die Variablen `FORWARD_EMAIL_ALIAS_USER` und `FORWARD_EMAIL_ALIAS_PASSWORD` sind optional, aber für Postfach-Tools (Nachrichten, Ordner, Kontakte, Kalender) erforderlich. Details finden Sie unter [Authentifizierung](#authentication).

### Cursor {#cursor}

Öffnen Sie Cursor Einstellungen → MCP → Server hinzufügen:

```json
{
  "mcpServers": {
    "forwardemail": {
      "command": "npx",
      "args": ["-y", "@forwardemail/mcp-server"],
      "env": {
        "FORWARD_EMAIL_API_KEY": "your-api-key-here",
        "FORWARD_EMAIL_ALIAS_USER": "you@example.com",
        "FORWARD_EMAIL_ALIAS_PASSWORD": "your-generated-alias-password"
      }
    }
  }
}
```

### Windsurf {#windsurf}

Öffnen Sie Windsurf Einstellungen → MCP → Server hinzufügen mit derselben Konfiguration wie oben.

### Andere MCP-Clients {#other-mcp-clients}

Jeder Client, der den MCP stdio-Transport unterstützt, funktioniert. Der Befehl lautet:

```sh
FORWARD_EMAIL_API_KEY=your-api-key \
  FORWARD_EMAIL_ALIAS_USER=you@example.com \
  FORWARD_EMAIL_ALIAS_PASSWORD=your-generated-alias-password \
  npx @forwardemail/mcp-server
```


## Authentifizierung {#authentication}

Die Forward Email API verwendet **HTTP Basic Authentifizierung** mit zwei verschiedenen Anmeldetypen, abhängig vom Endpunkt. Der MCP-Server übernimmt dies automatisch — Sie müssen nur die richtigen Zugangsdaten bereitstellen.

### API-Schlüssel-Authentifizierung {#api-key-auth}

Die meisten Verwaltungsendpunkte (Domains, Aliase, ausgehende E-Mails, Protokolle) verwenden Ihren **API-Schlüssel** als Basic-Auth-Benutzernamen mit leerem Passwort.

Dies ist derselbe API-Schlüssel, den Sie für die REST-API verwenden. Setzen Sie ihn über die Umgebungsvariable `FORWARD_EMAIL_API_KEY`.

### Alias-Authentifizierung {#alias-auth}

Postfach-Endpunkte (Nachrichten, Ordner, Kontakte, Kalender, alias-bezogene Sieve-Skripte) verwenden **Alias-Zugangsdaten** — die Alias-E-Mail-Adresse als Benutzername und ein generiertes Passwort als Passwort.

Diese Endpunkte greifen über IMAP-, CalDAV- und CardDAV-Protokolle auf alias-spezifische Daten zu. Sie benötigen die Alias-E-Mail und ein generiertes Passwort, nicht den API-Schlüssel.

Sie können Alias-Zugangsdaten auf zwei Arten bereitstellen:

1. **Umgebungsvariablen** (empfohlen für Standardalias): Setzen Sie `FORWARD_EMAIL_ALIAS_USER` und `FORWARD_EMAIL_ALIAS_PASSWORD`.
2. **Parameter pro Tool-Aufruf**: Übergeben Sie `alias_username` und `alias_password` als Argumente an jedes Alias-Auth-Tool. Diese überschreiben die Umgebungsvariablen, was nützlich ist, wenn Sie mit mehreren Aliassen arbeiten.

### Generierung eines Alias-Passworts {#generating-an-alias-password}

Bevor Sie Alias-Auth-Tools verwenden können, müssen Sie ein Passwort für den Alias generieren. Dies können Sie mit dem Tool `generateAliasPassword` oder über die API tun:

```sh
curl -u "YOUR_API_KEY:" \
  https://api.forwardemail.net/v1/domains/example.com/aliases/ALIAS_ID/generate-password \
  -X POST
```

Die Antwort enthält die Felder `username` (Alias-E-Mail) und `password`. Verwenden Sie diese als Ihre Alias-Zugangsdaten.

> **Tipp:** Sie können auch Ihren KI-Assistenten fragen: *"Generiere ein Passwort für den Alias <user@example.com> auf der Domain example.com"* — er ruft das Tool `generateAliasPassword` auf und gibt die Zugangsdaten zurück.

Die folgende Tabelle fasst zusammen, welche Authentifizierungsmethode jede Tool-Gruppe benötigt:

| Tool-Gruppe                                                   | Auth-Methode              | Zugangsdaten                                               |
| ------------------------------------------------------------- | ------------------------- | ---------------------------------------------------------- |
| Konto                                                        | API-Schlüssel **oder** Alias-Auth | Beides                                                    |
| Domains, Aliase, Domain-Mitglieder, Einladungen, Catch-All-Passwörter | API-Schlüssel             | `FORWARD_EMAIL_API_KEY`                                   |
| Ausgehende E-Mails (Liste, Abrufen, Löschen, Limit)          | API-Schlüssel             | `FORWARD_EMAIL_API_KEY`                                   |
| E-Mail senden                                               | API-Schlüssel **oder** Alias-Auth | Beides                                                    |
| Nachrichten (IMAP)                                           | Alias-Auth                | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Ordner (IMAP)                                               | Alias-Auth                | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Kontakte (CardDAV)                                          | Alias-Auth                | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Kalender (CalDAV)                                          | Alias-Auth                | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Kalenderereignisse (CalDAV)                                | Alias-Auth                | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Sieve-Skripte (domain-bezogen)                            | API-Schlüssel             | `FORWARD_EMAIL_API_KEY`                                   |
| Sieve-Skripte (alias-bezogen)                             | Alias-Auth                | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Protokolle                                                 | API-Schlüssel             | `FORWARD_EMAIL_API_KEY`                                   |
| Verschlüsselung                                           | Keine                    | Keine Zugangsdaten erforderlich                            |
## Alle 68 Werkzeuge {#all-68-tools}

Jedes Werkzeug entspricht direkt einem [Forward Email API](/email-api) Endpunkt. Die Parameter verwenden dieselben Namen wie in der API-Dokumentation. Die Authentifizierungsmethode ist in jeder Abschnittsüberschrift angegeben.

### Konto (API-Schlüssel oder Alias-Authentifizierung) {#account-api-key-or-alias-auth}

Bei API-Schlüssel-Authentifizierung geben diese Ihre Benutzerkontoinformationen zurück. Bei Alias-Authentifizierung geben sie Alias-/Mailbox-Informationen einschließlich Speicherquote und Einstellungen zurück.

| Werkzeug          | API-Endpunkt       | Beschreibung                 |
| ----------------- | ------------------ | ---------------------------- |
| `getAccount`      | `GET /v1/account`  | Ihre Kontoinformationen abrufen |
| `updateAccount`   | `PUT /v1/account`  | Ihre Kontoeinstellungen aktualisieren |

### Domains (API-Schlüssel) {#domains-api-key}

| Werkzeug              | API-Endpunkt                                      | Beschreibung               |
| --------------------- | ------------------------------------------------ | ------------------------- |
| `listDomains`         | `GET /v1/domains`                                | Alle Ihre Domains auflisten |
| `createDomain`        | `POST /v1/domains`                               | Eine neue Domain hinzufügen |
| `getDomain`           | `GET /v1/domains/:domain_id`                     | Domain-Details abrufen     |
| `updateDomain`        | `PUT /v1/domains/:domain_id`                     | Domain-Einstellungen aktualisieren |
| `deleteDomain`        | `DELETE /v1/domains/:domain_id`                  | Eine Domain entfernen      |
| `verifyDomainRecords` | `GET /v1/domains/:domain_id/verify-records`     | DNS-Einträge überprüfen    |
| `verifySmtpRecords`   | `GET /v1/domains/:domain_id/verify-smtp`        | SMTP-Konfiguration überprüfen |
| `testS3Connection`    | `POST /v1/domains/:domain_id/test-s3-connection`| Benutzerdefinierten S3-Speicher testen |

### Aliase (API-Schlüssel) {#aliases-api-key}

| Werkzeug                | API-Endpunkt                                                      | Beschreibung                                |
| ----------------------- | ----------------------------------------------------------------- | ------------------------------------------ |
| `listAliases`           | `GET /v1/domains/:domain_id/aliases`                              | Aliase für eine Domain auflisten            |
| `createAlias`           | `POST /v1/domains/:domain_id/aliases`                             | Einen neuen Alias erstellen                  |
| `getAlias`              | `GET /v1/domains/:domain_id/aliases/:alias_id`                    | Alias-Details abrufen                        |
| `updateAlias`           | `PUT /v1/domains/:domain_id/aliases/:alias_id`                    | Einen Alias aktualisieren                     |
| `deleteAlias`           | `DELETE /v1/domains/:domain_id/aliases/:alias_id`                 | Einen Alias löschen                          |
| `generateAliasPassword` | `POST /v1/domains/:domain_id/aliases/:alias_id/generate-password` | IMAP/SMTP-Passwort für Alias-Authentifizierung generieren |

### E-Mails — Ausgehendes SMTP (API-Schlüssel; Senden unterstützt beide) {#emails--outbound-smtp-api-key-send-supports-both}

| Werkzeug          | API-Endpunkt          | Authentifizierung     | Beschreibung                  |
| ----------------- | ---------------------| ---------------------| ---------------------------- |
| `sendEmail`       | `POST /v1/emails`    | API-Schlüssel oder Alias-Authentifizierung | Eine E-Mail via SMTP senden |
| `listEmails`      | `GET /v1/emails`     | API-Schlüssel        | Ausgehende E-Mails auflisten |
| `getEmail`        | `GET /v1/emails/:id` | API-Schlüssel        | E-Mail-Details und Status abrufen |
| `deleteEmail`     | `DELETE /v1/emails/:id` | API-Schlüssel      | Eine wartende E-Mail löschen |
| `getEmailLimit`   | `GET /v1/emails/limit` | API-Schlüssel       | Ihr Versandlimit prüfen       |

Das Werkzeug `sendEmail` akzeptiert `from`, `to`, `cc`, `bcc`, `subject`, `text`, `html` und `attachments`. Dies entspricht dem Endpunkt `POST /v1/emails`.

### Nachrichten — IMAP (Alias-Authentifizierung) {#messages--imap-alias-auth}

> **Erfordert Alias-Zugangsdaten.** Übergeben Sie `alias_username` und `alias_password` oder setzen Sie die Umgebungsvariablen `FORWARD_EMAIL_ALIAS_USER` und `FORWARD_EMAIL_ALIAS_PASSWORD`.
| Tool            | API-Endpunkt              | Beschreibung                           |
| --------------- | ------------------------- | ------------------------------------- |
| `listMessages`  | `GET /v1/messages`        | Nachrichten in einem Postfach auflisten und durchsuchen |
| `createMessage` | `POST /v1/messages`       | Einen Entwurf erstellen oder eine Nachricht hochladen    |
| `getMessage`    | `GET /v1/messages/:id`    | Eine Nachricht anhand der ID abrufen                   |
| `updateMessage` | `PUT /v1/messages/:id`    | Flags aktualisieren (gelesen, markiert, etc.)           |
| `deleteMessage` | `DELETE /v1/messages/:id` | Eine Nachricht löschen                      |

Das Tool `listMessages` unterstützt über 15 Suchparameter, darunter `subject`, `from`, `to`, `text`, `since`, `before`, `is_unread` und `has_attachment`. Siehe die [API docs](/email-api) für die vollständige Liste.

### Ordner — IMAP (Alias-Authentifizierung) {#folders--imap-alias-auth}

> **Erfordert Alias-Zugangsdaten.** Übergeben Sie `alias_username` und `alias_password` oder setzen Sie die Umgebungsvariablen `FORWARD_EMAIL_ALIAS_USER` und `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Tool           | API-Endpunkt             | Beschreibung              |
| -------------- | ------------------------ | ------------------------ |
| `listFolders`  | `GET /v1/folders`        | Alle Postfachordner auflisten |
| `createFolder` | `POST /v1/folders`       | Einen neuen Ordner erstellen      |
| `getFolder`    | `GET /v1/folders/:id`    | Ordnerdetails abrufen       |
| `updateFolder` | `PUT /v1/folders/:id`    | Einen Ordner umbenennen          |
| `deleteFolder` | `DELETE /v1/folders/:id` | Einen Ordner löschen          |

### Kontakte — CardDAV (Alias-Authentifizierung) {#contacts--carddav-alias-auth}

> **Erfordert Alias-Zugangsdaten.** Übergeben Sie `alias_username` und `alias_password` oder setzen Sie die Umgebungsvariablen `FORWARD_EMAIL_ALIAS_USER` und `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Tool            | API-Endpunkt              | Beschreibung          |
| --------------- | ------------------------- | -------------------- |
| `listContacts`  | `GET /v1/contacts`        | Alle Kontakte auflisten    |
| `createContact` | `POST /v1/contacts`       | Einen neuen Kontakt erstellen |
| `getContact`    | `GET /v1/contacts/:id`    | Kontaktdetails abrufen  |
| `updateContact` | `PUT /v1/contacts/:id`    | Einen Kontakt aktualisieren     |
| `deleteContact` | `DELETE /v1/contacts/:id` | Einen Kontakt löschen     |

### Kalender — CalDAV (Alias-Authentifizierung) {#calendars--caldav-alias-auth}

> **Erfordert Alias-Zugangsdaten.** Übergeben Sie `alias_username` und `alias_password` oder setzen Sie die Umgebungsvariablen `FORWARD_EMAIL_ALIAS_USER` und `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Tool             | API-Endpunkt               | Beschreibung           |
| ---------------- | -------------------------- | --------------------- |
| `listCalendars`  | `GET /v1/calendars`        | Alle Kalender auflisten    |
| `createCalendar` | `POST /v1/calendars`       | Einen neuen Kalender erstellen |
| `getCalendar`    | `GET /v1/calendars/:id`    | Kalenderdetails abrufen  |
| `updateCalendar` | `PUT /v1/calendars/:id`    | Einen Kalender aktualisieren     |
| `deleteCalendar` | `DELETE /v1/calendars/:id` | Einen Kalender löschen     |

### Kalenderereignisse — CalDAV (Alias-Authentifizierung) {#calendar-events--caldav-alias-auth}

> **Erfordert Alias-Zugangsdaten.** Übergeben Sie `alias_username` und `alias_password` oder setzen Sie die Umgebungsvariablen `FORWARD_EMAIL_ALIAS_USER` und `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Tool                  | API-Endpunkt                     | Beschreibung        |
| --------------------- | -------------------------------- | ------------------ |
| `listCalendarEvents`  | `GET /v1/calendar-events`        | Alle Ereignisse auflisten    |
| `createCalendarEvent` | `POST /v1/calendar-events`       | Ein neues Ereignis erstellen |
| `getCalendarEvent`    | `GET /v1/calendar-events/:id`    | Ereignisdetails abrufen  |
| `updateCalendarEvent` | `PUT /v1/calendar-events/:id`    | Ein Ereignis aktualisieren    |
| `deleteCalendarEvent` | `DELETE /v1/calendar-events/:id` | Ein Ereignis löschen    |

### Sieve-Skripte (API-Schlüssel) {#sieve-scripts-api-key}

Diese verwenden domänenbezogene Pfade und authentifizieren sich mit Ihrem API-Schlüssel.

| Tool                  | API-Endpunkt                                                              | Beschreibung               |
| --------------------- | ------------------------------------------------------------------------- | ------------------------- |
| `listSieveScripts`    | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve`                      | Skripte für einen Alias auflisten |
| `createSieveScript`   | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve`                     | Ein neues Skript erstellen       |
| `getSieveScript`      | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id`           | Skriptdetails abrufen        |
| `updateSieveScript`   | `PUT /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id`           | Ein Skript aktualisieren           |
| `deleteSieveScript`   | `DELETE /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id`        | Ein Skript löschen           |
| `activateSieveScript` | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id/activate` | Ein Skript aktivieren         |
### Sieve-Skripte (Alias-Authentifizierung) {#sieve-scripts-alias-auth}

Diese verwenden Alias-Level-Authentifizierung. Nützlich für Automatisierung pro Alias, ohne den API-Schlüssel zu benötigen.

> **Erfordert Alias-Zugangsdaten.** Übergebe `alias_username` und `alias_password` oder setze die Umgebungsvariablen `FORWARD_EMAIL_ALIAS_USER` und `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Tool                           | API-Endpunkt                                 | Beschreibung        |
| ------------------------------ | -------------------------------------------- | ------------------ |
| `listSieveScriptsAliasAuth`    | `GET /v1/sieve-scripts`                      | Skripte auflisten   |
| `createSieveScriptAliasAuth`   | `POST /v1/sieve-scripts`                     | Ein Skript erstellen|
| `getSieveScriptAliasAuth`      | `GET /v1/sieve-scripts/:script_id`           | Skriptdetails abrufen |
| `updateSieveScriptAliasAuth`   | `PUT /v1/sieve-scripts/:script_id`           | Ein Skript aktualisieren |
| `deleteSieveScriptAliasAuth`   | `DELETE /v1/sieve-scripts/:script_id`        | Ein Skript löschen  |
| `activateSieveScriptAliasAuth` | `POST /v1/sieve-scripts/:script_id/activate` | Ein Skript aktivieren |

### Domain-Mitglieder und Einladungen (API-Schlüssel) {#domain-members-and-invites-api-key}

| Tool                 | API-Endpunkt                                       | Beschreibung                |
| -------------------- | -------------------------------------------------- | -------------------------- |
| `updateDomainMember` | `PUT /v1/domains/:domain_id/members/:member_id`    | Rolle eines Mitglieds ändern |
| `removeDomainMember` | `DELETE /v1/domains/:domain_id/members/:member_id` | Mitglied entfernen          |
| `acceptDomainInvite` | `GET /v1/domains/:domain_id/invites`               | Ausstehende Einladung annehmen |
| `createDomainInvite` | `POST /v1/domains/:domain_id/invites`              | Jemanden zu einer Domain einladen |
| `removeDomainInvite` | `DELETE /v1/domains/:domain_id/invites`            | Einladung widerrufen        |

### Catch-All-Passwörter (API-Schlüssel) {#catch-all-passwords-api-key}

| Tool                     | API-Endpunkt                                                  | Beschreibung                 |
| ------------------------ | ------------------------------------------------------------- | --------------------------- |
| `listCatchAllPasswords`  | `GET /v1/domains/:domain_id/catch-all-passwords`              | Catch-All-Passwörter auflisten |
| `createCatchAllPassword` | `POST /v1/domains/:domain_id/catch-all-passwords`             | Ein Catch-All-Passwort erstellen |
| `deleteCatchAllPassword` | `DELETE /v1/domains/:domain_id/catch-all-passwords/:token_id` | Ein Catch-All-Passwort löschen |

### Protokolle (API-Schlüssel) {#logs-api-key}

| Tool           | API-Endpunkt            | Beschreibung                  |
| -------------- | ----------------------- | ---------------------------- |
| `downloadLogs` | `GET /v1/logs/download` | E-Mail-Zustellprotokolle herunterladen |

### Verschlüsseln (Keine Authentifizierung) {#encrypt-no-auth}

| Tool            | API-Endpunkt       | Beschreibung              |
| --------------- | ------------------ | ------------------------ |
| `encryptRecord` | `POST /v1/encrypt` | Einen DNS TXT-Eintrag verschlüsseln |

Dieses Tool benötigt keine Authentifizierung. Es verschlüsselt Weiterleitungsdatensätze wie `forward-email=user@example.com` zur Verwendung in DNS TXT-Einträgen.


## 20 Praxisbeispiele {#20-real-world-use-cases}

Hier sind praktische Möglichkeiten, den MCP-Server mit deinem KI-Assistenten zu nutzen:

### 1. E-Mail-Triage {#1-email-triage}

Bitte deine KI, deinen Posteingang zu scannen und ungelesene Nachrichten zusammenzufassen. Sie kann dringende E-Mails markieren, nach Absender kategorisieren und Antworten entwerfen – alles per natürlicher Sprache. *(Erfordert Alias-Zugangsdaten für den Posteingangszugriff.)*

### 2. Automatisierung der Domain-Einrichtung {#2-domain-setup-automation}

Richtest du eine neue Domain ein? Bitte die KI, die Domain zu erstellen, deine Aliase hinzuzufügen, DNS-Einträge zu überprüfen und die SMTP-Konfiguration zu testen. Was normalerweise 10 Minuten Klickarbeit erfordert, wird so zu einem Gespräch.

### 3. Massenverwaltung von Aliases {#3-bulk-alias-management}

Musst du 20 Aliase für ein neues Projekt erstellen? Beschreibe, was du brauchst, und lass die KI die repetitive Arbeit übernehmen. Sie kann Aliase erstellen, Weiterleitungsregeln setzen und Passwörter auf einmal generieren.
### 4. E-Mail-Kampagnenüberwachung {#4-email-campaign-monitoring}

Bitten Sie Ihre KI, die Versandlimits zu überprüfen, die letzten ausgehenden E-Mails aufzulisten und den Zustellstatus zu melden. Nützlich zur Überwachung der Gesundheit von Transaktions-E-Mails.

### 5. Kontakt-Synchronisation und Bereinigung {#5-contact-sync-and-cleanup}

Verwenden Sie die CardDAV-Tools, um alle Kontakte aufzulisten, Duplikate zu finden, veraltete Informationen zu aktualisieren oder Kontakte massenhaft aus einer Tabelle zu erstellen, die Sie in den Chat einfügen. *(Erfordert Alias-Zugangsdaten.)*

### 6. Kalenderverwaltung {#6-calendar-management}

Erstellen Sie Kalender, fügen Sie Termine hinzu, aktualisieren Sie Besprechungszeiten und löschen Sie abgesagte Termine – alles per Konversation. Die CalDAV-Tools unterstützen vollständiges CRUD für Kalender und Termine. *(Erfordert Alias-Zugangsdaten.)*

### 7. Sieve-Skript-Automatisierung {#7-sieve-script-automation}

Sieve-Skripte sind mächtig, aber die Syntax ist schwer verständlich. Bitten Sie Ihre KI, Sieve-Skripte für Sie zu schreiben: „Filtere alle E-Mails von <billing@example.com> in einen Ordner ‚Billing‘“ wird so zu einem funktionierenden Skript, ohne die RFC 5228-Spezifikation zu berühren.

### 8. Team-Onboarding {#8-team-onboarding}

Wenn ein neues Teammitglied hinzukommt, bitten Sie die KI, dessen Alias zu erstellen, ein Passwort zu generieren, eine Willkommens-E-Mail mit den Zugangsdaten zu senden und ihn als Domain-Mitglied hinzuzufügen. Ein Prompt, vier API-Aufrufe.

### 9. Sicherheitsprüfung {#9-security-auditing}

Bitten Sie Ihre KI, alle Domains aufzulisten, den DNS-Verifizierungsstatus zu prüfen, Alias-Konfigurationen zu überprüfen und Domains mit nicht verifizierten Einträgen zu identifizieren. Ein schneller Sicherheitsscan in natürlicher Sprache.

### 10. Einrichtung der E-Mail-Weiterleitung {#10-email-forwarding-setup}

Richten Sie die E-Mail-Weiterleitung für eine neue Domain ein? Bitten Sie die KI, die Domain zu erstellen, Weiterleitungs-Aliase hinzuzufügen, die DNS-Einträge zu verschlüsseln und alles korrekt zu verifizieren.

### 11. Postfachsuche und Analyse {#11-inbox-search-and-analysis}

Verwenden Sie die Nachrichtensuch-Tools, um bestimmte E-Mails zu finden: „Finde alle E-Mails von <john@example.com> in den letzten 30 Tagen, die Anhänge haben.“ Die über 15 Suchparameter machen dies sehr leistungsfähig. *(Erfordert Alias-Zugangsdaten.)*

### 12. Ordnerorganisation {#12-folder-organization}

Bitten Sie Ihre KI, eine Ordnerstruktur für ein neues Projekt zu erstellen, Nachrichten zwischen Ordnern zu verschieben oder alte Ordner zu bereinigen, die Sie nicht mehr benötigen. *(Erfordert Alias-Zugangsdaten.)*

### 13. Passwortrotation {#13-password-rotation}

Generieren Sie neue Alias-Passwörter nach Zeitplan. Bitten Sie Ihre KI, für jeden Alias ein neues Passwort zu generieren und die neuen Zugangsdaten zu melden.

### 14. DNS-Eintragsverschlüsselung {#14-dns-record-encryption}

Verschlüsseln Sie Ihre Weiterleitungseinträge, bevor Sie sie in DNS eintragen. Das `encryptRecord`-Tool erledigt dies ohne Authentifizierung – nützlich für schnelle Einzelverschlüsselungen.

### 15. Analyse der Zustellprotokolle {#15-delivery-log-analysis}

Laden Sie Ihre E-Mail-Zustellprotokolle herunter und bitten Sie die KI, Absprungraten zu analysieren, problematische Empfänger zu identifizieren oder Zustellzeiten zu verfolgen.

### 16. Verwaltung mehrerer Domains {#16-multi-domain-management}

Wenn Sie mehrere Domains verwalten, bitten Sie die KI um einen Statusbericht: welche Domains verifiziert sind, welche Probleme haben, wie viele Aliase jede hat und wie die Versandlimits aussehen.

### 17. Catch-All-Konfiguration {#17-catch-all-configuration}

Richten Sie Catch-All-Passwörter für Domains ein, die E-Mails an jede Adresse empfangen müssen. Die KI kann diese Passwörter für Sie erstellen, auflisten und verwalten.

### 18. Domain-Einladungsverwaltung {#18-domain-invite-management}

Laden Sie Teammitglieder ein, Domains zu verwalten, prüfen Sie ausstehende Einladungen und bereinigen Sie abgelaufene. Nützlich für Organisationen mit mehreren Domain-Administratoren.

### 19. S3-Speichertest {#19-s3-storage-testing}

Wenn Sie benutzerdefinierten S3-Speicher für E-Mail-Backups verwenden, bitten Sie die KI, die Verbindung zu testen und zu verifizieren, dass sie korrekt funktioniert.

### 20. Entwurf von E-Mails {#20-email-draft-composition}

Erstellen Sie Entwurf-E-Mails in Ihrem Postfach, ohne sie zu senden. Nützlich zum Vorbereiten von E-Mails, die vor dem Versand überprüft werden sollen, oder zum Erstellen von E-Mail-Vorlagen. *(Erfordert Alias-Zugangsdaten.)*


## Beispiel-Prompts {#example-prompts}

Hier sind Prompts, die Sie direkt mit Ihrem KI-Assistenten verwenden können:

**E-Mail senden:**

> "Sende eine E-Mail von <hello@mydomain.com> an <john@example.com> mit dem Betreff 'Meeting Tomorrow' und dem Text 'Hi John, are we still on for 2pm?'"
**Domain-Verwaltung:**

> "Liste alle meine Domains auf und sag mir, welche unbestätigte DNS-Einträge haben."

**Alias-Erstellung:**

> "Erstelle einen neuen Alias <support@mydomain.com>, der an meine persönliche E-Mail weiterleitet."

**Postfachsuche (erfordert Alias-Zugangsdaten):**

> "Finde alle ungelesenen E-Mails der letzten Woche, die 'Rechnung' erwähnen."

**Kalender (erfordert Alias-Zugangsdaten):**

> "Erstelle einen Kalender namens 'Arbeit' und füge ein Meeting für morgen um 14 Uhr mit dem Titel 'Team Standup' hinzu."

**Sieve-Skripte:**

> "Schreibe ein Sieve-Skript für <info@mydomain.com>, das automatisch auf E-Mails mit 'Danke, dass Sie sich gemeldet haben, wir melden uns innerhalb von 24 Stunden bei Ihnen.' antwortet."

**Massenoperationen:**

> "Erstelle Aliase für sales@, support@, billing@ und info@ auf mydomain.com, die alle an <team@mydomain.com> weiterleiten."

**Sicherheitsprüfung:**

> "Überprüfe den DNS- und SMTP-Verifizierungsstatus aller meiner Domains und sag mir, ob etwas Aufmerksamkeit benötigt."

**Alias-Passwort generieren:**

> "Generiere ein Passwort für den Alias <user@example.com>, damit ich auf mein Postfach zugreifen kann."


## Environment Variables {#environment-variables}

| Variable                       | Erforderlich | Standard                       | Beschreibung                                                                   |
| ------------------------------ | ------------ | ------------------------------ | ----------------------------------------------------------------------------- |
| `FORWARD_EMAIL_API_KEY`        | Ja           | —                              | Dein Forward Email API-Schlüssel (wird als Basic-Auth-Benutzername für API-Key-Endpunkte verwendet) |
| `FORWARD_EMAIL_ALIAS_USER`     | Nein         | —                              | Alias-E-Mail-Adresse für Postfach-Endpunkte (z.B. `user@example.com`)         |
| `FORWARD_EMAIL_ALIAS_PASSWORD` | Nein         | —                              | Generiertes Alias-Passwort für Postfach-Endpunkte                             |
| `FORWARD_EMAIL_API_URL`        | Nein         | `https://api.forwardemail.net` | API-Basis-URL (für Self-Hosting oder Tests)                                  |


## Sicherheit {#security}

Der MCP-Server läuft lokal auf deinem Rechner. So funktioniert die Sicherheit:

* **Deine Zugangsdaten bleiben lokal.** Sowohl dein API-Schlüssel als auch Alias-Zugangsdaten werden aus Umgebungsvariablen gelesen und zur Authentifizierung von API-Anfragen via HTTP Basic Auth verwendet. Sie werden niemals an das KI-Modell gesendet.
* **stdio-Transport.** Der Server kommuniziert mit dem KI-Client über stdin/stdout. Es werden keine Netzwerkports geöffnet.
* **Keine Datenspeicherung.** Der Server ist zustandslos. Er cached, protokolliert oder speichert keine deiner E-Mail-Daten.
* **Open Source.** Der gesamte Code ist auf [GitHub](https://github.com/forwardemail/mcp-server). Du kannst jede Zeile prüfen.


## Programmatische Nutzung {#programmatic-usage}

Du kannst den Server auch als Bibliothek verwenden:

```js
const { McpServer } = require('@forwardemail/mcp-server');

const server = new McpServer({
  apiKey: 'your-api-key',
  aliasUser: 'user@example.com',
  aliasPassword: 'generated-alias-password',
});

server.listen();
```


## Open Source {#open-source}

Der Forward Email MCP Server ist [open-source auf GitHub](https://github.com/forwardemail/mcp-server) unter der BUSL-1.1 Lizenz. Wir glauben an Transparenz. Wenn du einen Fehler findest oder ein Feature möchtest, [öffne ein Issue](https://github.com/forwardemail/mcp-server/issues).
