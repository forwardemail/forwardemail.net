# Forward Email MCP Server {#forward-email-mcp-server}

<img loading="lazy" src="/img/articles/mcp.webp" alt="Forward Email MCP Server" class="rounded-lg" />

<p class="lead mt-3">
  <strong>TL;DR:</strong> Unser <a href="https://github.com/forwardemail/mcp-server">Open-Source MCP-Server</a> ermöglicht es KI-Assistenten wie Claude, ChatGPT, Cursor und Windsurf, Ihre E-Mails, Domains, Aliase, Kontakte und Kalender über natürliche Sprache zu verwalten. Alle 68 API-Endpunkte werden als MCP-Tools bereitgestellt. Er läuft lokal über <code>npx @forwardemail/mcp-server</code> – Ihre Anmeldeinformationen verlassen niemals Ihren Rechner.
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
  * [API-Schlüssel-Authentifizierung](#api-key-auth)
  * [Alias-Authentifizierung](#alias-auth)
  * [Generieren eines Alias-Passworts](#generating-an-alias-password)
* [Alle 68 Tools](#all-68-tools)
  * [Konto (API-Schlüssel oder Alias-Authentifizierung)](#account-api-key-or-alias-auth)
  * [Domains (API-Schlüssel)](#domains-api-key)
  * [Aliase (API-Schlüssel)](#aliases-api-key)
  * [E-Mails – ausgehender SMTP (API-Schlüssel; Senden unterstützt beides)](#emails--outbound-smtp-api-key-send-supports-both)
  * [Nachrichten – IMAP (Alias-Authentifizierung)](#messages--imap-alias-auth)
  * [Ordner – IMAP (Alias-Authentifizierung)](#folders--imap-alias-auth)
  * [Kontakte – CardDAV (Alias-Authentifizierung)](#contacts--carddav-alias-auth)
  * [Kalender – CalDAV (Alias-Authentifizierung)](#calendars--caldav-alias-auth)
  * [Kalenderereignisse – CalDAV (Alias-Authentifizierung)](#calendar-events--caldav-alias-auth)
  * [Sieve-Skripte (API-Schlüssel)](#sieve-scripts-api-key)
  * [Sieve-Skripte (Alias-Authentifizierung)](#sieve-scripts-alias-auth)
  * [Domain-Mitglieder und Einladungen (API-Schlüssel)](#domain-members-and-invites-api-key)
  * [Catch-All-Passwörter (API-Schlüssel)](#catch-all-passwords-api-key)
  * [Protokolle (API-Schlüssel)](#logs-api-key)
  * [Verschlüsseln (keine Authentifizierung)](#encrypt-no-auth)
* [20 reale Anwendungsfälle](#20-real-world-use-cases)
* [Beispiel-Prompts](#example-prompts)
* [Umgebungsvariablen](#environment-variables)
* [Sicherheit](#security)
* [Programmatische Nutzung](#programmatic-usage)
* [Open Source](#open-source)


## Was ist MCP? {#what-is-mcp}

[Model Context Protocol](https://modelcontextprotocol.io) (MCP) ist ein offener Standard, der von Anthropic entwickelt wurde und es KI-Modellen ermöglicht, externe Tools sicher aufzurufen. Anstatt API-Antworten in ein Chatfenster zu kopieren und einzufügen, bietet MCP dem Modell direkten, strukturierten Zugriff auf Ihre Dienste.

Unser MCP-Server umschließt die gesamte [Forward Email API](/email-api) – jeden Endpunkt, jeden Parameter – und stellt sie als Tools bereit, die jeder MCP-kompatible Client verwenden kann. Der Server läuft lokal auf Ihrem Rechner über stdio-Transport. Ihre Anmeldeinformationen bleiben in Ihren Umgebungsvariablen und werden niemals an das KI-Modell gesendet.


## Schnellstart {#quick-start}

### API-Schlüssel erhalten {#get-an-api-key}

1. Melden Sie sich bei Ihrem [Forward Email-Konto](/my-account/domains) an.
2. Gehen Sie zu **Mein Konto** → **Sicherheit** → **API-Schlüssel**.
3. Generieren Sie einen neuen API-Schlüssel und kopieren Sie ihn.

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

Starten Sie Claude Desktop neu. Sie sollten die Forward Email-Tools in der Tool-Auswahl sehen.

> **Hinweis:** Die Variablen `FORWARD_EMAIL_ALIAS_USER` und `FORWARD_EMAIL_ALIAS_PASSWORD` sind optional, aber für Mailbox-Tools (Nachrichten, Ordner, Kontakte, Kalender) erforderlich. Details finden Sie unter [Authentifizierung](#authentication).

### Cursor {#cursor}

Öffnen Sie Cursor-Einstellungen → MCP → Server hinzufügen:

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

Öffnen Sie Windsurf-Einstellungen → MCP → Server hinzufügen mit der gleichen Konfiguration wie oben.

### Andere MCP-Clients {#other-mcp-clients}

Jeder Client, der den MCP stdio-Transport unterstützt, funktioniert. Der Befehl lautet:

```sh
FORWARD_EMAIL_API_KEY=your-api-key \
  FORWARD_EMAIL_ALIAS_USER=you@example.com \
  FORWARD_EMAIL_ALIAS_PASSWORD=your-generated-alias-password \
  npx @forwardemail/mcp-server
```


## Authentifizierung {#authentication}

Die Forward Email API verwendet die **HTTP Basic Authentifizierung** mit zwei verschiedenen Anmeldeinformationstypen, abhängig vom Endpunkt. Der MCP-Server handhabt dies automatisch – Sie müssen lediglich die richtigen Anmeldeinformationen bereitstellen.

### API-Schlüssel-Authentifizierung {#api-key-auth}

Die meisten Verwaltungs-Endpunkte (Domains, Aliase, ausgehende E-Mails, Protokolle) verwenden Ihren **API-Schlüssel** als Basic-Auth-Benutzernamen mit einem leeren Passwort.

Dies ist derselbe API-Schlüssel, den Sie für die REST API verwenden. Legen Sie ihn über die Umgebungsvariable `FORWARD_EMAIL_API_KEY` fest.

### Alias-Authentifizierung {#alias-auth}

Mailbox-Endpunkte (Nachrichten, Ordner, Kontakte, Kalender, Alias-bezogene Sieve-Skripte) verwenden **Alias-Anmeldeinformationen** – die Alias-E-Mail-Adresse als Benutzernamen und ein generiertes Passwort als Passwort.

Diese Endpunkte greifen über IMAP, CalDAV und CardDAV-Protokolle auf Daten pro Alias zu. Sie erfordern die Alias-E-Mail und ein generiertes Passwort, nicht den API-Schlüssel.

Sie können Alias-Anmeldeinformationen auf zwei Arten bereitstellen:

1. **Umgebungsvariablen** (empfohlen für Standard-Alias): Setzen Sie `FORWARD_EMAIL_ALIAS_USER` und `FORWARD_EMAIL_ALIAS_PASSWORD`.
2. **Parameter pro Tool-Aufruf**: Übergeben Sie `alias_username` und `alias_password` als Argumente an jedes Alias-Auth-Tool. Diese überschreiben die Umgebungsvariablen, was nützlich ist, wenn Sie mit mehreren Aliasen arbeiten.

### Generieren eines Alias-Passworts {#generating-an-alias-password}

Bevor Sie Alias-Auth-Tools verwenden können, müssen Sie ein Passwort für den Alias generieren. Sie können dies mit dem Tool `generateAliasPassword` oder über die API tun:

```sh
curl -u "YOUR_API_KEY:" \
  https://api.forwardemail.net/v1/domains/example.com/aliases/ALIAS_ID/generate-password \
  -X POST
```

Die Antwort enthält die Felder `username` (Alias-E-Mail) und `password`. Verwenden Sie diese als Ihre Alias-Anmeldeinformationen.

> **Tipp:** Sie können Ihren KI-Assistenten auch fragen: *"Generiere ein Passwort für den Alias user@example.com auf der Domain example.com"* – er wird das Tool `generateAliasPassword` aufrufen und die Anmeldeinformationen zurückgeben.

Die folgende Tabelle fasst zusammen, welche Authentifizierungsmethode jede Tool-Gruppe erfordert:

| Tool-Gruppe | Authentifizierungsmethode | Anmeldeinformationen |
|-----------|-------------|-------------|
| Konto | API-Schlüssel **oder** Alias-Authentifizierung | Entweder |
| Domains, Aliase, Domain-Mitglieder, Einladungen, Catch-All-Passwörter | API-Schlüssel | `FORWARD_EMAIL_API_KEY` |
| Ausgehende E-Mails (Liste, Abrufen, Löschen, Limit) | API-Schlüssel | `FORWARD_EMAIL_API_KEY` |
| E-Mail senden | API-Schlüssel **oder** Alias-Authentifizierung | Entweder |
| Nachrichten (IMAP) | Alias-Authentifizierung | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Ordner (IMAP) | Alias-Authentifizierung | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Kontakte (CardDAV) | Alias-Authentifizierung | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Kalender (CalDAV) | Alias-Authentifizierung | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Kalenderereignisse (CalDAV) | Alias-Authentifizierung | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Sieve-Skripte (Domain-bezogen) | API-Schlüssel | `FORWARD_EMAIL_API_KEY` |
| Sieve-Skripte (Alias-bezogen) | Alias-Authentifizierung | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Protokolle | API-Schlüssel | `FORWARD_EMAIL_API_KEY` |
| Verschlüsseln | Keine | Keine Anmeldeinformationen erforderlich |


## Alle 68 Tools {#all-68-tools}

Jedes Tool bildet direkt einen [Forward Email API](/email-api)-Endpunkt ab. Parameter verwenden dieselben Namen wie in der API-Dokumentation. Die Authentifizierungsmethode ist in jeder Abschnittsüberschrift vermerkt.

### Konto (API-Schlüssel oder Alias-Authentifizierung) {#account-api-key-or-alias-auth}

Mit der API-Schlüssel-Authentifizierung geben diese Ihre Benutzerkontoinformationen zurück. Mit der Alias-Authentifizierung geben sie Alias-/Mailbox-Informationen einschließlich Speicherkontingent und Einstellungen zurück.

| Tool | API-Endpunkt | Beschreibung |
|------|-------------|-------------|
| `getAccount` | `GET /v1/account` | Ihre Kontoinformationen abrufen |
| `updateAccount` | `PUT /v1/account` | Ihre Kontoeinstellungen aktualisieren |

### Domains (API-Schlüssel) {#domains-api-key}

| Tool | API-Endpunkt | Beschreibung |
|------|-------------|-------------|
| `listDomains` | `GET /v1/domains` | Alle Ihre Domains auflisten |
| `createDomain` | `POST /v1/domains` | Eine neue Domain hinzufügen |
| `getDomain` | `GET /v1/domains/:domain_id` | Domain-Details abrufen |
| `updateDomain` | `PUT /v1/domains/:domain_id` | Domain-Einstellungen aktualisieren |
| `deleteDomain` | `DELETE /v1/domains/:domain_id` | Eine Domain entfernen |
| `verifyDomainRecords` | `GET /v1/domains/:domain_id/verify-records` | DNS-Einträge überprüfen |
| `verifySmtpRecords` | `GET /v1/domains/:domain_id/verify-smtp` | SMTP-Konfiguration überprüfen |
| `testS3Connection` | `POST /v1/domains/:domain_id/test-s3-connection` | Benutzerdefinierte S3-Speicherung testen |

### Aliase (API-Schlüssel) {#aliases-api-key}

| Tool | API-Endpunkt | Beschreibung |
|------|-------------|-------------|
| `listAliases` | `GET /v1/domains/:domain_id/aliases` | Aliase für eine Domain auflisten |
| `createAlias` | `POST /v1/domains/:domain_id/aliases` | Einen neuen Alias erstellen |
| `getAlias` | `GET /v1/domains/:domain_id/aliases/:alias_id` | Alias-Details abrufen |
| `updateAlias` | `PUT /v1/domains/:domain_id/aliases/:alias_id` | Einen Alias aktualisieren |
| `deleteAlias` | `DELETE /v1/domains/:domain_id/aliases/:alias_id` | Einen Alias löschen |
| `generateAliasPassword` | `POST /v1/domains/:domain_id/aliases/:alias_id/generate-password` | IMAP/SMTP-Passwort für Alias-Authentifizierung generieren |

### E-Mails – ausgehender SMTP (API-Schlüssel; Senden unterstützt beides) {#emails--outbound-smtp-api-key-send-supports-both}

| Tool | API-Endpunkt | Authentifizierung | Beschreibung |
|------|-------------|------|-------------|
| `sendEmail` | `POST /v1/emails` | API-Schlüssel oder Alias-Authentifizierung | Eine E-Mail über SMTP senden |
| `listEmails` | `GET /v1/emails` | API-Schlüssel | Ausgehende E-Mails auflisten |
| `getEmail` | `GET /v1/emails/:id` | API-Schlüssel | E-Mail-Details und Status abrufen |
| `deleteEmail` | `DELETE /v1/emails/:id` | API-Schlüssel | Eine in der Warteschlange befindliche E-Mail löschen |
| `getEmailLimit` | `GET /v1/emails/limit` | API-Schlüssel | Ihr Sendelimit überprüfen |

Das Tool `sendEmail` akzeptiert `from`, `to`, `cc`, `bcc`, `subject`, `text`, `html` und `attachments`. Dies ist dasselbe wie der Endpunkt `POST /v1/emails`.

### Nachrichten – IMAP (Alias-Authentifizierung) {#messages--imap-alias-auth}

> **Erfordert Alias-Anmeldeinformationen.** Übergeben Sie `alias_username` und `alias_password` oder setzen Sie die Umgebungsvariablen `FORWARD_EMAIL_ALIAS_USER` und `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Tool | API-Endpunkt | Beschreibung |
|------|-------------|-------------|
| `listMessages` | `GET /v1/messages` | Nachrichten in einem Postfach auflisten und suchen |
| `createMessage` | `POST /v1/messages` | Einen Entwurf erstellen oder eine Nachricht hochladen |
| `getMessage` | `GET /v1/messages/:id` | Eine Nachricht anhand der ID abrufen |
| `updateMessage` | `PUT /v1/messages/:id` | Flags aktualisieren (gelesen, markiert usw.) |
| `deleteMessage` | `DELETE /v1/messages/:id` | Eine Nachricht löschen |

Das Tool `listMessages` unterstützt über 15 Suchparameter, darunter `subject`, `from`, `to`, `text`, `since`, `before`, `is_unread` und `has_attachment`. Die vollständige Liste finden Sie in der [API-Dokumentation](/email-api).

### Ordner – IMAP (Alias-Authentifizierung) {#folders--imap-alias-auth}

> **Erfordert Alias-Anmeldeinformationen.** Übergeben Sie `alias_username` und `alias_password` oder setzen Sie die Umgebungsvariablen `FORWARD_EMAIL_ALIAS_USER` und `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Tool | API-Endpunkt | Beschreibung |
|------|-------------|-------------|
| `listFolders` | `GET /v1/folders` | Alle Postfachordner auflisten |
| `createFolder` | `POST /v1/folders` | Einen neuen Ordner erstellen |
| `getFolder` | `GET /v1/folders/:id` | Ordnerdetails abrufen |
| `updateFolder` | `PUT /v1/folders/:id` | Einen Ordner umbenennen |
| `deleteFolder` | `DELETE /v1/folders/:id` | Einen Ordner löschen |

### Kontakte – CardDAV (Alias-Authentifizierung) {#contacts--carddav-alias-auth}

> **Erfordert Alias-Anmeldeinformationen.** Übergeben Sie `alias_username` und `alias_password` oder setzen Sie die Umgebungsvariablen `FORWARD_EMAIL_ALIAS_USER` und `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Tool | API-Endpunkt | Beschreibung |
|------|-------------|-------------|
| `listContacts` | `GET /v1/contacts` | Alle Kontakte auflisten |
| `createContact` | `POST /v1/contacts` | Einen neuen Kontakt erstellen |
| `getContact` | `GET /v1/contacts/:id` | Kontaktdetails abrufen |
| `updateContact` | `PUT /v1/contacts/:id` | Einen Kontakt aktualisieren |
| `deleteContact` | `DELETE /v1/contacts/:id` | Einen Kontakt löschen |

### Kalender – CalDAV (Alias-Authentifizierung) {#calendars--caldav-alias-auth}

> **Erfordert Alias-Anmeldeinformationen.** Übergeben Sie `alias_username` und `alias_password` oder setzen Sie die Umgebungsvariablen `FORWARD_EMAIL_ALIAS_USER` und `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Tool | API-Endpunkt | Beschreibung |
|------|-------------|-------------|
| `listCalendars` | `GET /v1/calendars` | Alle Kalender auflisten |
| `createCalendar` | `POST /v1/calendars` | Einen neuen Kalender erstellen |
| `getCalendar` | `GET /v1/calendars/:id` | Kalenderdetails abrufen |
| `updateCalendar` | `PUT /v1/calendars/:id` | Einen Kalender aktualisieren |
| `deleteCalendar` | `DELETE /v1/calendars/:id` | Einen Kalender löschen |

### Kalenderereignisse – CalDAV (Alias-Authentifizierung) {#calendar-events--caldav-alias-auth}

> **Erfordert Alias-Anmeldeinformationen.** Übergeben Sie `alias_username` und `alias_password` oder setzen Sie die Umgebungsvariablen `FORWARD_EMAIL_ALIAS_USER` und `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Tool | API-Endpunkt | Beschreibung |
|------|-------------|-------------|
| `listCalendarEvents` | `GET /v1/calendar-events` | Alle Ereignisse auflisten |
| `createCalendarEvent` | `POST /v1/calendar-events` | Ein neues Ereignis erstellen |
| `getCalendarEvent` | `GET /v1/calendar-events/:id` | Ereignisdetails abrufen |
| `updateCalendarEvent` | `PUT /v1/calendar-events/:id` | Ein Ereignis aktualisieren |
| `deleteCalendarEvent` | `DELETE /v1/calendar-events/:id` | Ein Ereignis löschen |

### Sieve-Skripte (API-Schlüssel) {#sieve-scripts-api-key}

Diese verwenden Domain-bezogene Pfade und authentifizieren sich mit Ihrem API-Schlüssel.

| Tool | API-Endpunkt | Beschreibung |
|------|-------------|-------------|
| `listSieveScripts` | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve` | Skripte für einen Alias auflisten |
| `createSieveScript` | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve` | Ein neues Skript erstellen |
| `getSieveScript` | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id` | Skriptdetails abrufen |
| `updateSieveScript` | `PUT /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id` | Ein Skript aktualisieren |
| `deleteSieveScript` | `DELETE /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id` | Ein Skript löschen |
| `activateSieveScript` | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id/activate` | Ein Skript aktivieren |

### Sieve-Skripte (Alias-Authentifizierung) {#sieve-scripts-alias-auth}

Diese verwenden die Authentifizierung auf Alias-Ebene. Nützlich für die Automatisierung pro Alias, ohne den API-Schlüssel zu benötigen.

> **Erfordert Alias-Anmeldeinformationen.** Übergeben Sie `alias_username` und `alias_password` oder setzen Sie die Umgebungsvariablen `FORWARD_EMAIL_ALIAS_USER` und `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Tool | API-Endpunkt | Beschreibung |
|------|-------------|-------------|
| `listSieveScriptsAliasAuth` | `GET /v1/sieve-scripts` | Skripte auflisten |
| `createSieveScriptAliasAuth` | `POST /v1/sieve-scripts` | Ein Skript erstellen |
| `getSieveScriptAliasAuth` | `GET /v1/sieve-scripts/:script_id` | Skriptdetails abrufen |
| `updateSieveScriptAliasAuth` | `PUT /v1/sieve-scripts/:script_id` | Ein Skript aktualisieren |
| `deleteSieveScriptAliasAuth` | `DELETE /v1/sieve-scripts/:script_id` | Ein Skript löschen |
| `activateSieveScriptAliasAuth` | `POST /v1/sieve-scripts/:script_id/activate` | Ein Skript aktivieren |

### Domain-Mitglieder und Einladungen (API-Schlüssel) {#domain-members-and-invites-api-key}

| Tool | API-Endpunkt | Beschreibung |
|------|-------------|-------------|
| `updateDomainMember` | `PUT /v1/domains/:domain_id/members/:member_id` | Die Rolle eines Mitglieds ändern |
| `removeDomainMember` | `DELETE /v1/domains/:domain_id/members/:member_id` | Ein Mitglied entfernen |
| `acceptDomainInvite` | `GET /v1/domains/:domain_id/invites` | Eine ausstehende Einladung annehmen |
| `createDomainInvite` | `POST /v1/domains/:domain_id/invites` | Jemanden zu einer Domain einladen |
| `removeDomainInvite` | `DELETE /v1/domains/:domain_id/invites` | Eine Einladung widerrufen |

### Catch-All-Passwörter (API-Schlüssel) {#catch-all-passwords-api-key}

| Tool | API-Endpunkt | Beschreibung |
|------|-------------|-------------|
| `listCatchAllPasswords` | `GET /v1/domains/:domain_id/catch-all-passwords` | Catch-All-Passwörter auflisten |
| `createCatchAllPassword` | `POST /v1/domains/:domain_id/catch-all-passwords` | Ein Catch-All-Passwort erstellen |
| `deleteCatchAllPassword` | `DELETE /v1/domains/:domain_id/catch-all-passwords/:token_id` | Ein Catch-All-Passwort löschen |

### Protokolle (API-Schlüssel) {#logs-api-key}

| Tool | API-Endpunkt | Beschreibung |
|------|-------------|-------------|
| `downloadLogs` | `GET /v1/logs/download` | E-Mail-Zustellungsprotokolle herunterladen |

### Verschlüsseln (keine Authentifizierung) {#encrypt-no-auth}

| Tool | API-Endpunkt | Beschreibung |
|------|-------------|-------------|
| `encryptRecord` | `POST /v1/encrypt` | Einen DNS TXT-Eintrag verschlüsseln |

Dieses Tool erfordert keine Authentifizierung. Es verschlüsselt Weiterleitungsdatensätze wie `forward-email=user@example.com` zur Verwendung in DNS TXT-Einträgen.


## 20 reale Anwendungsfälle {#20-real-world-use-cases}

Hier sind praktische Möglichkeiten, den MCP-Server mit Ihrem KI-Assistenten zu verwenden:

### 1. E-Mail-Triage {#1-email-triage}

Bitten Sie Ihre KI, Ihren Posteingang zu scannen und ungelesene Nachrichten zusammenzufassen. Sie kann dringende E-Mails kennzeichnen, nach Absender kategorisieren und Entwürfe für Antworten erstellen – alles über natürliche Sprache. *(Erfordert Alias-Anmeldeinformationen für den Posteingangszugriff.)*

### 2. Automatisierung der Domain-Einrichtung {#2-domain-setup-automation}

Richten Sie eine neue Domain ein? Bitten Sie die KI, die Domain zu erstellen, Ihre Aliase hinzuzufügen, DNS-Einträge zu überprüfen und die SMTP-Konfiguration zu testen. Was normalerweise 10 Minuten Klicken durch Dashboards dauert, wird zu einem einzigen Gespräch.

### 3. Massen-Alias-Verwaltung {#3-bulk-alias-management}

Müssen Sie 20 Aliase für ein neues Projekt erstellen? Beschreiben Sie, was Sie benötigen, und lassen Sie die KI die sich wiederholende Arbeit erledigen. Sie kann Aliase erstellen, Weiterleitungsregeln festlegen und Passwörter in einem Durchgang generieren.

### 4. Überwachung von E-Mail-Kampagnen {#4-email-campaign-monitoring}

Bitten Sie Ihre KI, Sendelimits zu überprüfen, aktuelle ausgehende E-Mails aufzulisten und den Zustellstatus zu melden. Nützlich zur Überwachung der Gesundheit von Transaktions-E-Mails.

### 5. Kontaktsynchronisierung und -bereinigung {#5-contact-sync-and-cleanup}

Verwenden Sie die CardDAV-Tools, um alle Kontakte aufzulisten, Duplikate zu finden, veraltete Informationen zu aktualisieren oder Kontakte aus einer Tabelle, die Sie in den Chat einfügen, massenhaft zu erstellen. *(Erfordert Alias-Anmeldeinformationen.)*

### 6. Kalenderverwaltung {#6-calendar-management}

Erstellen Sie Kalender, fügen Sie Ereignisse hinzu, aktualisieren Sie Besprechungszeiten und löschen Sie abgesagte Ereignisse – alles über Konversation. Die CalDAV-Tools unterstützen vollständige CRUD-Operationen sowohl für Kalender als auch für Ereignisse. *(Erfordert Alias-Anmeldeinformationen.)*

### 7. Sieve-Skript-Automatisierung {#7-sieve-script-automation}

Sieve-Skripte sind mächtig, aber die Syntax ist undurchsichtig. Bitten Sie Ihre KI, Sieve-Skripte für Sie zu schreiben: "Filtere alle E-Mails von billing@example.com in einen Ordner 'Rechnungen'" wird zu einem funktionierenden Skript, ohne die RFC 5228-Spezifikation zu berühren.

### 8. Team-Onboarding {#8-team-onboarding}

Wenn ein neues Teammitglied beitritt, bitten Sie die KI, dessen Alias zu erstellen, ein Passwort zu generieren, eine Willkommens-E-Mail mit den Anmeldeinformationen zu senden und es als Domain-Mitglied hinzuzufügen. Ein Prompt, vier API-Aufrufe.

### 9. Sicherheitsprüfung {#9-security-auditing}

Bitten Sie Ihre KI, alle Domains aufzulisten, den DNS-Verifizierungsstatus zu überprüfen, Alias-Konfigurationen zu überprüfen und Domains mit nicht verifizierten Einträgen zu identifizieren. Eine schnelle Sicherheitsüberprüfung in natürlicher Sprache.

### 10. Einrichtung der E-Mail-Weiterleitung {#10-email-forwarding-setup}

Richten Sie die E-Mail-Weiterleitung für eine neue Domain ein? Bitten Sie die KI, die Domain zu erstellen, Weiterleitungsaliase hinzuzufügen, die DNS-Einträge zu verschlüsseln und zu überprüfen, ob alles korrekt konfiguriert ist.

### 11. Posteingangssuche und -analyse {#11-inbox-search-and-analysis}

Verwenden Sie die Nachrichtensuchtools, um bestimmte E-Mails zu finden: "Finde alle E-Mails von john@example.com in den letzten 30 Tagen, die Anhänge haben." Die über 15 Suchparameter machen dies leistungsstark. *(Erfordert Alias-Anmeldeinformationen.)*

### 12. Ordnerorganisation {#12-folder-organization}

Bitten Sie Ihre KI, eine Ordnerstruktur für ein neues Projekt zu erstellen, Nachrichten zwischen Ordnern zu verschieben oder alte Ordner zu bereinigen, die Sie nicht mehr benötigen. *(Erfordert Alias-Anmeldeinformationen.)*

### 13. Passwortrotation {#13-password-rotation}

Generieren Sie neue Alias-Passwörter nach einem Zeitplan. Bitten Sie Ihre KI, für jeden Alias ein neues Passwort zu generieren und die neuen Anmeldeinformationen zu melden.

### 14. DNS-Eintrag-Verschlüsselung {#14-dns-record-encryption}

Verschlüsseln Sie Ihre Weiterleitungsdatensätze, bevor Sie sie zu DNS hinzufügen. Das Tool `encryptRecord` erledigt dies ohne Authentifizierung – nützlich für schnelle einmalige Verschlüsselungen.

### 15. Analyse von Zustellungsprotokollen {#15-delivery-log-analysis}

Laden Sie Ihre E-Mail-Zustellungsprotokolle herunter und bitten Sie die KI, die Absprungraten zu analysieren, problematische Empfänger zu identifizieren oder Zustellzeiten zu verfolgen.

### 16. Multi-Domain-Verwaltung {#16-multi-domain-management}

Wenn Sie mehrere Domains verwalten, bitten Sie die KI um einen Statusbericht: welche Domains verifiziert sind, welche Probleme haben, wie viele Aliase jede hat und wie die Sendelimits aussehen.

### 17. Catch-All-Konfiguration {#17-catch-all-configuration}

Richten Sie Catch-All-Passwörter für Domains ein, die E-Mails an jede Adresse empfangen müssen. Die KI kann diese Passwörter für Sie erstellen, auflisten und verwalten.

### 18. Domain-Einladungsverwaltung {#18-domain-invite-management}

Laden Sie Teammitglieder zur Domainverwaltung ein, überprüfen Sie ausstehende Einladungen und bereinigen Sie abgelaufene. Nützlich für Organisationen mit mehreren Domain-Administratoren.

### 19. S3-Speichertest {#19-s3-storage-testing}

Wenn Sie benutzerdefinierten S3-Speicher für E-Mail-Backups verwenden, bitten Sie die KI, die Verbindung zu testen und zu überprüfen, ob sie korrekt funktioniert.

### 20. E-Mail-Entwurfserstellung {#20-email-draft-composition}

Erstellen Sie E-Mail-Entwürfe in Ihrem Postfach, ohne sie zu senden. Nützlich zum Vorbereiten von E-Mails, die vor dem Senden überprüft werden müssen, oder zum Erstellen von E-Mail-Vorlagen. *(Erfordert Alias-Anmeldeinformationen.)*


## Beispiel-Prompts {#example-prompts}

Hier sind Prompts, die Sie direkt mit Ihrem KI-Assistenten verwenden können:

**E-Mail senden:**
> "Sende eine E-Mail von hello@mydomain.com an john@example.com mit dem Betreff 'Meeting Morgen' und dem Text 'Hallo John, treffen wir uns noch um 14 Uhr?'"

**Domain-Verwaltung:**
> "Liste alle meine Domains auf und sage mir, welche davon nicht verifizierte DNS-Einträge haben."

**Alias-Erstellung:**
> "Erstelle einen neuen Alias support@mydomain.com, der an meine persönliche E-Mail weiterleitet."

**Posteingangssuche (erfordert Alias-Anmeldeinformationen):**
> "Finde alle ungelesenen E-Mails der letzten Woche, die 'Rechnung' erwähnen."

**Kalender (erfordert Alias-Anmeldeinformationen):**
> "Erstelle einen Kalender namens 'Arbeit' und füge ein Meeting für morgen um 14 Uhr namens 'Team-Standup' hinzu."

**Sieve-Skripte:**
> "Schreibe ein Sieve-Skript für info@mydomain.com, das E-Mails automatisch mit 'Vielen Dank für Ihre Nachricht, wir melden uns innerhalb von 24 Stunden bei Ihnen' beantwortet."

**Massenoperationen:**
> "Erstelle Aliase für sales@, support@, billing@ und info@ auf mydomain.com, die alle an team@mydomain.com weiterleiten."

**Sicherheitsprüfung:**
> "Überprüfe den DNS- und SMTP-Verifizierungsstatus für alle meine Domains und sage mir, ob etwas beachtet werden muss."

**Alias-Passwort generieren:**
> "Generiere ein Passwort für den Alias user@example.com, damit ich auf meinen Posteingang zugreifen kann."


## Umgebungsvariablen {#environment-variables}

| Variable | Erforderlich | Standard | Beschreibung |
|----------|----------|---------|-------------|
| `FORWARD_EMAIL_API_KEY` | Ja | — | Ihr Forward Email API-Schlüssel (wird als Basic-Auth-Benutzername für API-Schlüssel-Endpunkte verwendet) |
| `FORWARD_EMAIL_ALIAS_USER` | Nein | — | Alias-E-Mail-Adresse für Mailbox-Endpunkte (z. B. `user@example.com`) |
| `FORWARD_EMAIL_ALIAS_PASSWORD` | Nein | — | Generiertes Alias-Passwort für Mailbox-Endpunkte |
| `FORWARD_EMAIL_API_URL` | Nein | `https://api.forwardemail.net` | API-Basis-URL (für selbst gehostete oder Testzwecke) |


## Sicherheit {#security}

Der MCP-Server läuft lokal auf Ihrem Rechner. So funktioniert die Sicherheit:

*   **Ihre Anmeldeinformationen bleiben lokal.** Sowohl Ihr API-Schlüssel als auch Ihre Alias-Anmeldeinformationen werden aus Umgebungsvariablen gelesen und zur Authentifizierung von API-Anfragen über HTTP Basic Auth verwendet. Sie werden niemals an das KI-Modell gesendet.
*   **stdio-Transport.** Der Server kommuniziert mit dem KI-Client über stdin/stdout. Es werden keine Netzwerkports geöffnet.
*   **Keine Datenspeicherung.** Der Server ist zustandslos. Er speichert, protokolliert oder cacht keine Ihrer E-Mail-Daten.
*   **Open Source.** Der gesamte Code ist auf [GitHub](https://github.com/forwardemail/mcp-server) verfügbar. Sie können jede Zeile überprüfen.


## Programmatische Nutzung {#programmatic-usage}

Sie können den Server auch als Bibliothek verwenden:

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

Der Forward Email MCP Server ist [Open Source auf GitHub](https://github.com/forwardemail/mcp-server) unter der BUSL-1.1-Lizenz. Wir glauben an Transparenz. Wenn Sie einen Fehler finden oder eine Funktion wünschen, [eröffnen Sie ein Issue](https://github.com/forwardemail/mcp-server/issues).

