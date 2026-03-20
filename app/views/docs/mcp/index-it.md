# Forward Email MCP Server {#forward-email-mcp-server}

<img loading="lazy" src="/img/articles/mcp.webp" alt="Forward Email MCP Server" class="rounded-lg" />

<p class="lead mt-3">
  <strong>TL;DR:</strong> Il nostro <a href="https://github.com/forwardemail/mcp-server">server MCP open-source</a> permette agli assistenti AI come Claude, ChatGPT, Cursor e Windsurf di gestire la tua email, domini, alias, contatti e calendari tramite linguaggio naturale. Tutti i 68 endpoint API sono esposti come strumenti MCP. Funziona localmente tramite <code>npx @forwardemail/mcp-server</code> — le tue credenziali non lasciano mai la tua macchina.
</p>


## Table of Contents {#table-of-contents}

* [Cos'è MCP?](#what-is-mcp)
* [Avvio Rapido](#quick-start)
  * [Ottieni una API Key](#get-an-api-key)
  * [Claude Desktop](#claude-desktop)
  * [Cursor](#cursor)
  * [Windsurf](#windsurf)
  * [Altri Client MCP](#other-mcp-clients)
* [Autenticazione](#authentication)
  * [Autenticazione con API Key](#api-key-auth)
  * [Autenticazione con Alias](#alias-auth)
  * [Generare una Password per Alias](#generating-an-alias-password)
* [Tutti i 68 Strumenti](#all-68-tools)
  * [Account (Autenticazione API Key o Alias)](#account-api-key-or-alias-auth)
  * [Domini (API Key)](#domains-api-key)
  * [Alias (API Key)](#aliases-api-key)
  * [Email — SMTP in Uscita (API Key; Send supporta entrambi)](#emails--outbound-smtp-api-key-send-supports-both)
  * [Messaggi — IMAP (Autenticazione Alias)](#messages--imap-alias-auth)
  * [Cartelle — IMAP (Autenticazione Alias)](#folders--imap-alias-auth)
  * [Contatti — CardDAV (Autenticazione Alias)](#contacts--carddav-alias-auth)
  * [Calendari — CalDAV (Autenticazione Alias)](#calendars--caldav-alias-auth)
  * [Eventi del Calendario — CalDAV (Autenticazione Alias)](#calendar-events--caldav-alias-auth)
  * [Script Sieve (API Key)](#sieve-scripts-api-key)
  * [Script Sieve (Autenticazione Alias)](#sieve-scripts-alias-auth)
  * [Membri e Inviti del Dominio (API Key)](#domain-members-and-invites-api-key)
  * [Password Catch-All (API Key)](#catch-all-passwords-api-key)
  * [Log (API Key)](#logs-api-key)
  * [Crittografia (Nessuna Autenticazione)](#encrypt-no-auth)
* [20 Casi d'Uso Reali](#20-real-world-use-cases)
  * [1. Smistamento Email](#1-email-triage)
  * [2. Automazione Configurazione Dominio](#2-domain-setup-automation)
  * [3. Gestione Alias in Massa](#3-bulk-alias-management)
  * [4. Monitoraggio Campagne Email](#4-email-campaign-monitoring)
  * [5. Sincronizzazione e Pulizia Contatti](#5-contact-sync-and-cleanup)
  * [6. Gestione Calendario](#6-calendar-management)
  * [7. Automazione Script Sieve](#7-sieve-script-automation)
  * [8. Onboarding del Team](#8-team-onboarding)
  * [9. Audit di Sicurezza](#9-security-auditing)
  * [10. Configurazione Inoltro Email](#10-email-forwarding-setup)
  * [11. Ricerca e Analisi Inbox](#11-inbox-search-and-analysis)
  * [12. Organizzazione Cartelle](#12-folder-organization)
  * [13. Rotazione Password](#13-password-rotation)
  * [14. Crittografia Record DNS](#14-dns-record-encryption)
  * [15. Analisi Log di Consegna](#15-delivery-log-analysis)
  * [16. Gestione Multi-Dominio](#16-multi-domain-management)
  * [17. Configurazione Catch-All](#17-catch-all-configuration)
  * [18. Gestione Inviti Dominio](#18-domain-invite-management)
  * [19. Test Storage S3](#19-s3-storage-testing)
  * [20. Composizione Bozze Email](#20-email-draft-composition)
* [Esempi di Prompt](#example-prompts)
* [Variabili d'Ambiente](#environment-variables)
* [Sicurezza](#security)
* [Uso Programmatico](#programmatic-usage)
* [Open Source](#open-source)


## Cos'è MCP? {#what-is-mcp}

[Model Context Protocol](https://modelcontextprotocol.io) (MCP) è uno standard aperto creato da Anthropic che permette ai modelli AI di chiamare in modo sicuro strumenti esterni. Invece di copiare e incollare risposte API in una finestra di chat, MCP dà al modello accesso diretto e strutturato ai tuoi servizi.

Il nostro server MCP incapsula l'intera [Forward Email API](/email-api) — ogni endpoint, ogni parametro — e li espone come strumenti che qualsiasi client compatibile MCP può usare. Il server gira localmente sulla tua macchina usando il trasporto stdio. Le tue credenziali rimangono nelle variabili d'ambiente e non vengono mai inviate al modello AI.


## Avvio Rapido {#quick-start}

### Ottieni una API Key {#get-an-api-key}
1. Accedi al tuo [account Forward Email](/my-account/domains).
2. Vai su **Il mio account** → **Sicurezza** → **Chiavi API**.
3. Genera una nuova chiave API e copiala.

### Claude Desktop {#claude-desktop}

Aggiungi questo al file di configurazione di Claude Desktop:

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

Riavvia Claude Desktop. Dovresti vedere gli strumenti Forward Email nel selettore degli strumenti.

> **Nota:** Le variabili `FORWARD_EMAIL_ALIAS_USER` e `FORWARD_EMAIL_ALIAS_PASSWORD` sono opzionali ma necessarie per gli strumenti della casella di posta (messaggi, cartelle, contatti, calendari). Consulta [Autenticazione](#authentication) per i dettagli.

### Cursor {#cursor}

Apri Impostazioni Cursor → MCP → Aggiungi Server:

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

Apri Impostazioni Windsurf → MCP → Aggiungi Server con la stessa configurazione di cui sopra.

### Altri Client MCP {#other-mcp-clients}

Qualsiasi client che supporti il trasporto MCP stdio funzionerà. Il comando è:

```sh
FORWARD_EMAIL_API_KEY=your-api-key \
  FORWARD_EMAIL_ALIAS_USER=you@example.com \
  FORWARD_EMAIL_ALIAS_PASSWORD=your-generated-alias-password \
  npx @forwardemail/mcp-server
```


## Autenticazione {#authentication}

L’API di Forward Email utilizza **l’autenticazione HTTP Basic** con due diversi tipi di credenziali a seconda dell’endpoint. Il server MCP gestisce questo automaticamente — devi solo fornire le credenziali corrette.

### Autenticazione con Chiave API {#api-key-auth}

La maggior parte degli endpoint di gestione (domini, alias, email in uscita, log) usa la tua **chiave API** come nome utente Basic auth con password vuota.

Questa è la stessa chiave API che usi per la REST API. Impostala tramite la variabile d’ambiente `FORWARD_EMAIL_API_KEY`.

### Autenticazione Alias {#alias-auth}

Gli endpoint della casella di posta (messaggi, cartelle, contatti, calendari, script sieve a livello di alias) usano le **credenziali alias** — l’indirizzo email alias come nome utente e una password generata come password.

Questi endpoint accedono ai dati per alias tramite i protocolli IMAP, CalDAV e CardDAV. Richiedono l’email alias e una password generata, non la chiave API.

Puoi fornire le credenziali alias in due modi:

1. **Variabili d’ambiente** (consigliato per alias predefinito): imposta `FORWARD_EMAIL_ALIAS_USER` e `FORWARD_EMAIL_ALIAS_PASSWORD`.
2. **Parametri per chiamata strumento**: passa `alias_username` e `alias_password` come argomenti a qualsiasi strumento con autenticazione alias. Questi sovrascrivono le variabili d’ambiente, utile quando si lavora con più alias.

### Generare una Password Alias {#generating-an-alias-password}

Prima di poter usare gli strumenti con autenticazione alias, devi generare una password per l’alias. Puoi farlo con lo strumento `generateAliasPassword` o tramite l’API:

```sh
curl -u "YOUR_API_KEY:" \
  https://api.forwardemail.net/v1/domains/example.com/aliases/ALIAS_ID/generate-password \
  -X POST
```

La risposta include i campi `username` (email alias) e `password`. Usali come credenziali alias.

> **Suggerimento:** Puoi anche chiedere al tuo assistente AI: *"Genera una password per l’alias <user@example.com> sul dominio example.com"* — chiamerà lo strumento `generateAliasPassword` e ti restituirà le credenziali.

La tabella sottostante riassume quale metodo di autenticazione richiede ogni gruppo di strumenti:

| Gruppo di Strumenti                                           | Metodo di Autenticazione    | Credenziali                                                |
| ------------------------------------------------------------- | --------------------------- | ---------------------------------------------------------- |
| Account                                                      | Chiave API **o** Autenticazione Alias | Entrambi                                                   |
| Domini, Alias, Membri del Dominio, Inviti, Password Catch-All | Chiave API                  | `FORWARD_EMAIL_API_KEY`                                    |
| Email in Uscita (lista, recupera, elimina, limite)           | Chiave API                  | `FORWARD_EMAIL_API_KEY`                                    |
| Invia Email                                                  | Chiave API **o** Autenticazione Alias | Entrambi                                                   |
| Messaggi (IMAP)                                              | Autenticazione Alias        | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Cartelle (IMAP)                                              | Autenticazione Alias        | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Contatti (CardDAV)                                          | Autenticazione Alias        | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Calendari (CalDAV)                                          | Autenticazione Alias        | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Eventi del Calendario (CalDAV)                              | Autenticazione Alias        | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Script Sieve (a livello di dominio)                         | Chiave API                  | `FORWARD_EMAIL_API_KEY`                                    |
| Script Sieve (a livello di alias)                           | Autenticazione Alias        | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Log                                                         | Chiave API                  | `FORWARD_EMAIL_API_KEY`                                    |
| Crittografia                                               | Nessuna                    | Non sono necessarie credenziali                             |
## Tutti i 68 Strumenti {#all-68-tools}

Ogni strumento corrisponde direttamente a un endpoint della [Forward Email API](/email-api). I parametri usano gli stessi nomi della documentazione API. Il metodo di autenticazione è indicato in ogni intestazione di sezione.

### Account (API Key o Alias Auth) {#account-api-key-or-alias-auth}

Con l'autenticazione tramite API key, questi restituiscono le informazioni del tuo account utente. Con l'autenticazione alias, restituiscono informazioni sull'alias/cassetta postale inclusi quota di archiviazione e impostazioni.

| Strumento       | Endpoint API       | Descrizione                  |
| --------------- | ------------------ | ---------------------------- |
| `getAccount`    | `GET /v1/account`  | Ottieni le informazioni del tuo account |
| `updateAccount` | `PUT /v1/account`  | Aggiorna le impostazioni del tuo account |

### Domini (API Key) {#domains-api-key}

| Strumento             | Endpoint API                                     | Descrizione               |
| --------------------- | ------------------------------------------------ | ------------------------- |
| `listDomains`         | `GET /v1/domains`                                | Elenca tutti i tuoi domini |
| `createDomain`        | `POST /v1/domains`                               | Aggiungi un nuovo dominio  |
| `getDomain`           | `GET /v1/domains/:domain_id`                     | Ottieni dettagli del dominio |
| `updateDomain`        | `PUT /v1/domains/:domain_id`                     | Aggiorna le impostazioni del dominio |
| `deleteDomain`        | `DELETE /v1/domains/:domain_id`                  | Rimuovi un dominio         |
| `verifyDomainRecords` | `GET /v1/domains/:domain_id/verify-records`      | Verifica i record DNS      |
| `verifySmtpRecords`   | `GET /v1/domains/:domain_id/verify-smtp`         | Verifica la configurazione SMTP |
| `testS3Connection`    | `POST /v1/domains/:domain_id/test-s3-connection` | Testa lo storage S3 personalizzato |

### Alias (API Key) {#aliases-api-key}

| Strumento               | Endpoint API                                                      | Descrizione                                |
| ----------------------- | ----------------------------------------------------------------- | ------------------------------------------ |
| `listAliases`           | `GET /v1/domains/:domain_id/aliases`                              | Elenca gli alias per un dominio            |
| `createAlias`           | `POST /v1/domains/:domain_id/aliases`                             | Crea un nuovo alias                        |
| `getAlias`              | `GET /v1/domains/:domain_id/aliases/:alias_id`                    | Ottieni dettagli dell'alias                |
| `updateAlias`           | `PUT /v1/domains/:domain_id/aliases/:alias_id`                    | Aggiorna un alias                          |
| `deleteAlias`           | `DELETE /v1/domains/:domain_id/aliases/:alias_id`                 | Elimina un alias                          |
| `generateAliasPassword` | `POST /v1/domains/:domain_id/aliases/:alias_id/generate-password` | Genera password IMAP/SMTP per autenticazione alias |

### Email — SMTP in uscita (API Key; Send supporta entrambi) {#emails--outbound-smtp-api-key-send-supports-both}

| Strumento       | Endpoint API            | Auth                  | Descrizione                  |
| --------------- | ----------------------- | --------------------- | ---------------------------- |
| `sendEmail`     | `POST /v1/emails`       | API Key o Alias Auth  | Invia un'email via SMTP      |
| `listEmails`    | `GET /v1/emails`        | API Key               | Elenca le email in uscita    |
| `getEmail`      | `GET /v1/emails/:id`    | API Key               | Ottieni dettagli e stato dell'email |
| `deleteEmail`   | `DELETE /v1/emails/:id` | API Key               | Elimina un'email in coda     |
| `getEmailLimit` | `GET /v1/emails/limit`  | API Key               | Controlla il tuo limite di invio |

Lo strumento `sendEmail` accetta `from`, `to`, `cc`, `bcc`, `subject`, `text`, `html` e `attachments`. È lo stesso dell'endpoint `POST /v1/emails`.

### Messaggi — IMAP (Alias Auth) {#messages--imap-alias-auth}

> **Richiede credenziali alias.** Passa `alias_username` e `alias_password` oppure imposta le variabili d'ambiente `FORWARD_EMAIL_ALIAS_USER` e `FORWARD_EMAIL_ALIAS_PASSWORD`.
| Strumento       | Endpoint API              | Descrizione                          |
| --------------- | ------------------------- | ----------------------------------- |
| `listMessages`  | `GET /v1/messages`        | Elenca e cerca messaggi in una casella di posta |
| `createMessage` | `POST /v1/messages`       | Crea una bozza o carica un messaggio |
| `getMessage`    | `GET /v1/messages/:id`    | Ottieni un messaggio tramite ID     |
| `updateMessage` | `PUT /v1/messages/:id`    | Aggiorna flag (letto, contrassegnato, ecc.) |
| `deleteMessage` | `DELETE /v1/messages/:id` | Elimina un messaggio                 |

Lo strumento `listMessages` supporta oltre 15 parametri di ricerca tra cui `subject`, `from`, `to`, `text`, `since`, `before`, `is_unread` e `has_attachment`. Consulta la [documentazione API](/email-api) per l'elenco completo.

### Cartelle — IMAP (Autenticazione Alias) {#folders--imap-alias-auth}

> **Richiede credenziali alias.** Passa `alias_username` e `alias_password` oppure imposta le variabili d'ambiente `FORWARD_EMAIL_ALIAS_USER` e `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Strumento      | Endpoint API             | Descrizione              |
| -------------- | ------------------------ | ------------------------ |
| `listFolders`  | `GET /v1/folders`        | Elenca tutte le cartelle della casella |
| `createFolder` | `POST /v1/folders`       | Crea una nuova cartella  |
| `getFolder`    | `GET /v1/folders/:id`    | Ottieni dettagli della cartella |
| `updateFolder` | `PUT /v1/folders/:id`    | Rinomina una cartella    |
| `deleteFolder` | `DELETE /v1/folders/:id` | Elimina una cartella     |

### Contatti — CardDAV (Autenticazione Alias) {#contacts--carddav-alias-auth}

> **Richiede credenziali alias.** Passa `alias_username` e `alias_password` oppure imposta le variabili d'ambiente `FORWARD_EMAIL_ALIAS_USER` e `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Strumento       | Endpoint API             | Descrizione          |
| --------------- | ------------------------ | -------------------- |
| `listContacts`  | `GET /v1/contacts`       | Elenca tutti i contatti |
| `createContact` | `POST /v1/contacts`      | Crea un nuovo contatto |
| `getContact`    | `GET /v1/contacts/:id`   | Ottieni dettagli del contatto |
| `updateContact` | `PUT /v1/contacts/:id`   | Aggiorna un contatto  |
| `deleteContact` | `DELETE /v1/contacts/:id`| Elimina un contatto   |

### Calendari — CalDAV (Autenticazione Alias) {#calendars--caldav-alias-auth}

> **Richiede credenziali alias.** Passa `alias_username` e `alias_password` oppure imposta le variabili d'ambiente `FORWARD_EMAIL_ALIAS_USER` e `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Strumento        | Endpoint API              | Descrizione           |
| ---------------- | ------------------------- | --------------------- |
| `listCalendars`  | `GET /v1/calendars`       | Elenca tutti i calendari |
| `createCalendar` | `POST /v1/calendars`      | Crea un nuovo calendario |
| `getCalendar`    | `GET /v1/calendars/:id`   | Ottieni dettagli del calendario |
| `updateCalendar` | `PUT /v1/calendars/:id`   | Aggiorna un calendario |
| `deleteCalendar` | `DELETE /v1/calendars/:id`| Elimina un calendario  |

### Eventi del Calendario — CalDAV (Autenticazione Alias) {#calendar-events--caldav-alias-auth}

> **Richiede credenziali alias.** Passa `alias_username` e `alias_password` oppure imposta le variabili d'ambiente `FORWARD_EMAIL_ALIAS_USER` e `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Strumento             | Endpoint API                      | Descrizione        |
| --------------------- | -------------------------------- | ------------------ |
| `listCalendarEvents`  | `GET /v1/calendar-events`         | Elenca tutti gli eventi |
| `createCalendarEvent` | `POST /v1/calendar-events`        | Crea un nuovo evento |
| `getCalendarEvent`    | `GET /v1/calendar-events/:id`     | Ottieni dettagli dell'evento |
| `updateCalendarEvent` | `PUT /v1/calendar-events/:id`     | Aggiorna un evento  |
| `deleteCalendarEvent` | `DELETE /v1/calendar-events/:id`  | Elimina un evento   |

### Script Sieve (API Key) {#sieve-scripts-api-key}

Questi usano percorsi a livello di dominio e si autenticano con la tua API key.

| Strumento             | Endpoint API                                                               | Descrizione               |
| --------------------- | -------------------------------------------------------------------------- | ------------------------- |
| `listSieveScripts`    | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve`                       | Elenca gli script per un alias |
| `createSieveScript`   | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve`                      | Crea un nuovo script      |
| `getSieveScript`      | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id`            | Ottieni dettagli dello script |
| `updateSieveScript`   | `PUT /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id`            | Aggiorna uno script       |
| `deleteSieveScript`   | `DELETE /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id`         | Elimina uno script        |
| `activateSieveScript` | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id/activate`  | Attiva uno script         |
### Script Sieve (Autenticazione Alias) {#sieve-scripts-alias-auth}

Questi utilizzano l'autenticazione a livello di alias. Utile per l'automazione per alias senza necessità della chiave API.

> **Richiede credenziali alias.** Passa `alias_username` e `alias_password` oppure imposta le variabili d'ambiente `FORWARD_EMAIL_ALIAS_USER` e `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Strumento                      | Endpoint API                                  | Descrizione         |
| ----------------------------- | --------------------------------------------- | ------------------- |
| `listSieveScriptsAliasAuth`   | `GET /v1/sieve-scripts`                       | Elenca gli script   |
| `createSieveScriptAliasAuth`  | `POST /v1/sieve-scripts`                      | Crea uno script     |
| `getSieveScriptAliasAuth`     | `GET /v1/sieve-scripts/:script_id`            | Ottieni dettagli script |
| `updateSieveScriptAliasAuth`  | `PUT /v1/sieve-scripts/:script_id`            | Aggiorna uno script |
| `deleteSieveScriptAliasAuth`  | `DELETE /v1/sieve-scripts/:script_id`         | Elimina uno script  |
| `activateSieveScriptAliasAuth`| `POST /v1/sieve-scripts/:script_id/activate` | Attiva uno script   |

### Membri del Dominio e Inviti (Chiave API) {#domain-members-and-invites-api-key}

| Strumento             | Endpoint API                                         | Descrizione                 |
| --------------------- | ---------------------------------------------------- | --------------------------- |
| `updateDomainMember`  | `PUT /v1/domains/:domain_id/members/:member_id`      | Cambia il ruolo di un membro |
| `removeDomainMember`  | `DELETE /v1/domains/:domain_id/members/:member_id`   | Rimuovi un membro           |
| `acceptDomainInvite`  | `GET /v1/domains/:domain_id/invites`                 | Accetta un invito in sospeso |
| `createDomainInvite`  | `POST /v1/domains/:domain_id/invites`                | Invita qualcuno a un dominio |
| `removeDomainInvite`  | `DELETE /v1/domains/:domain_id/invites`              | Revoca un invito            |

### Password Catch-All (Chiave API) {#catch-all-passwords-api-key}

| Strumento                | Endpoint API                                                  | Descrizione                  |
| ------------------------ | ------------------------------------------------------------- | ---------------------------- |
| `listCatchAllPasswords`  | `GET /v1/domains/:domain_id/catch-all-passwords`              | Elenca le password catch-all |
| `createCatchAllPassword` | `POST /v1/domains/:domain_id/catch-all-passwords`             | Crea una password catch-all  |
| `deleteCatchAllPassword` | `DELETE /v1/domains/:domain_id/catch-all-passwords/:token_id` | Elimina una password catch-all |

### Log (Chiave API) {#logs-api-key}

| Strumento      | Endpoint API            | Descrizione                  |
| ------------- | ----------------------- | ---------------------------- |
| `downloadLogs`| `GET /v1/logs/download` | Scarica i log di consegna email |

### Crittografa (Nessuna Autenticazione) {#encrypt-no-auth}

| Strumento       | Endpoint API       | Descrizione                 |
| --------------- | ------------------ | --------------------------- |
| `encryptRecord` | `POST /v1/encrypt` | Crittografa un record DNS TXT |

Questo strumento non richiede autenticazione. Crittografa record di inoltro come `forward-email=user@example.com` per l'uso nei record DNS TXT.


## 20 Casi d'Uso Reali {#20-real-world-use-cases}

Ecco modi pratici per usare il server MCP con il tuo assistente AI:

### 1. Smistamento Email {#1-email-triage}

Chiedi al tuo AI di scansionare la tua casella di posta e riassumere i messaggi non letti. Può segnalare email urgenti, categorizzare per mittente e redigere risposte — tutto tramite linguaggio naturale. *(Richiede credenziali alias per l'accesso alla casella.)*

### 2. Automazione Configurazione Dominio {#2-domain-setup-automation}

Stai configurando un nuovo dominio? Chiedi all'AI di creare il dominio, aggiungere i tuoi alias, verificare i record DNS e testare la configurazione SMTP. Quello che normalmente richiede 10 minuti di clic tra dashboard diventa una conversazione.

### 3. Gestione Alias in Massa {#3-bulk-alias-management}

Devi creare 20 alias per un nuovo progetto? Descrivi ciò di cui hai bisogno e lascia che l'AI gestisca il lavoro ripetitivo. Può creare alias, impostare regole di inoltro e generare password in un colpo solo.
### 4. Monitoraggio Campagne Email {#4-email-campaign-monitoring}

Chiedi alla tua AI di controllare i limiti di invio, elencare le email in uscita recenti e riportare lo stato di consegna. Utile per monitorare la salute delle email transazionali.

### 5. Sincronizzazione e Pulizia Contatti {#5-contact-sync-and-cleanup}

Usa gli strumenti CardDAV per elencare tutti i contatti, trovare duplicati, aggiornare informazioni obsolete o creare contatti in blocco da un foglio di calcolo che incolli nella chat. *(Richiede credenziali alias.)*

### 6. Gestione Calendario {#6-calendar-management}

Crea calendari, aggiungi eventi, aggiorna orari di riunioni ed elimina eventi cancellati — tutto tramite conversazione. Gli strumenti CalDAV supportano il CRUD completo sia su calendari che su eventi. *(Richiede credenziali alias.)*

### 7. Automazione Script Sieve {#7-sieve-script-automation}

Gli script Sieve sono potenti ma la sintassi è arcana. Chiedi alla tua AI di scrivere script Sieve per te: "Filtra tutte le email da <billing@example.com> in una cartella Fatturazione" diventa uno script funzionante senza dover consultare la specifica RFC 5228.

### 8. Onboarding del Team {#8-team-onboarding}

Quando un nuovo membro si unisce al team, chiedi all’AI di creare il suo alias, generare una password, inviargli un’email di benvenuto con le credenziali e aggiungerlo come membro del dominio. Un prompt, quattro chiamate API.

### 9. Audit di Sicurezza {#9-security-auditing}

Chiedi alla tua AI di elencare tutti i domini, controllare lo stato di verifica DNS, rivedere le configurazioni degli alias e identificare eventuali domini con record non verificati. Una rapida verifica di sicurezza in linguaggio naturale.

### 10. Configurazione Inoltro Email {#10-email-forwarding-setup}

Devi configurare l’inoltro email per un nuovo dominio? Chiedi all’AI di creare il dominio, aggiungere alias di inoltro, criptare i record DNS e verificare che tutto sia configurato correttamente.

### 11. Ricerca e Analisi Posta in Arrivo {#11-inbox-search-and-analysis}

Usa gli strumenti di ricerca messaggi per trovare email specifiche: "Trova tutte le email da <john@example.com> negli ultimi 30 giorni che hanno allegati." I più di 15 parametri di ricerca rendono questo strumento potente. *(Richiede credenziali alias.)*

### 12. Organizzazione Cartelle {#12-folder-organization}

Chiedi alla tua AI di creare una struttura di cartelle per un nuovo progetto, spostare messaggi tra cartelle o pulire cartelle vecchie che non ti servono più. *(Richiede credenziali alias.)*

### 13. Rotazione Password {#13-password-rotation}

Genera nuove password per gli alias secondo un programma. Chiedi alla tua AI di generare una nuova password per ogni alias e riportare le nuove credenziali.

### 14. Crittografia Record DNS {#14-dns-record-encryption}

Cripta i tuoi record di inoltro prima di aggiungerli al DNS. Lo strumento `encryptRecord` gestisce questo senza autenticazione — utile per crittografie rapide e isolate.

### 15. Analisi Log di Consegna {#15-delivery-log-analysis}

Scarica i log di consegna email e chiedi all’AI di analizzare i tassi di rimbalzo, identificare destinatari problematici o tracciare i tempi di consegna.

### 16. Gestione Multi-Dominio {#16-multi-domain-management}

Se gestisci più domini, chiedi all’AI di fornirti un rapporto di stato: quali domini sono verificati, quali hanno problemi, quanti alias ha ciascuno e come sono i limiti di invio.

### 17. Configurazione Catch-All {#17-catch-all-configuration}

Configura password catch-all per domini che devono ricevere email a qualsiasi indirizzo. L’AI può creare, elencare e gestire queste password per te.

### 18. Gestione Inviti Dominio {#18-domain-invite-management}

Invita membri del team a gestire domini, controlla gli inviti in sospeso e pulisci quelli scaduti. Utile per organizzazioni con più amministratori di dominio.

### 19. Test Storage S3 {#19-s3-storage-testing}

Se usi storage S3 personalizzato per backup email, chiedi all’AI di testare la connessione e verificare che funzioni correttamente.

### 20. Composizione Bozze Email {#20-email-draft-composition}

Crea bozze di email nella tua casella senza inviarle. Utile per preparare email che necessitano di revisione prima dell’invio o per costruire modelli di email. *(Richiede credenziali alias.)*


## Esempi di Prompt {#example-prompts}

Ecco prompt che puoi usare direttamente con il tuo assistente AI:

**Invio email:**

> "Invia un’email da <hello@mydomain.com> a <john@example.com> con oggetto 'Riunione Domani' e corpo 'Ciao John, siamo ancora confermati per le 14?'"
**Gestione domini:**

> "Elenca tutti i miei domini e dimmi quali hanno record DNS non verificati."

**Creazione alias:**

> "Crea un nuovo alias <support@mydomain.com> che inoltri alla mia email personale."

**Ricerca nella casella (richiede credenziali alias):**

> "Trova tutte le email non lette dell'ultima settimana che menzionano 'fattura'."

**Calendario (richiede credenziali alias):**

> "Crea un calendario chiamato 'Lavoro' e aggiungi una riunione per domani alle 14:00 chiamata 'Team Standup'."

**Script Sieve:**

> "Scrivi uno script Sieve per <info@mydomain.com> che risponda automaticamente alle email con 'Grazie per averci contattato, ti risponderemo entro 24 ore.'"

**Operazioni di massa:**

> "Crea alias per sales@, support@, billing@ e info@ su mydomain.com, tutti inoltrati a <team@mydomain.com>."

**Controllo sicurezza:**

> "Controlla lo stato di verifica DNS e SMTP per tutti i miei domini e dimmi se c'è qualcosa che necessita attenzione."

**Genera password alias:**

> "Genera una password per l'alias <user@example.com> così posso accedere alla mia casella."


## Variabili d'ambiente {#environment-variables}

| Variabile                      | Obbligatoria | Predefinito                    | Descrizione                                                                    |
| ------------------------------ | ------------ | ------------------------------ | ------------------------------------------------------------------------------ |
| `FORWARD_EMAIL_API_KEY`        | Sì           | —                              | La tua chiave API Forward Email (usata come username Basic auth per endpoint API-key) |
| `FORWARD_EMAIL_ALIAS_USER`     | No           | —                              | Indirizzo email alias per endpoint casella (es. `user@example.com`)            |
| `FORWARD_EMAIL_ALIAS_PASSWORD` | No           | —                              | Password alias generata per endpoint casella                                   |
| `FORWARD_EMAIL_API_URL`        | No           | `https://api.forwardemail.net` | URL base API (per self-hosted o test)                                          |


## Sicurezza {#security}

Il server MCP gira localmente sulla tua macchina. Ecco come funziona la sicurezza:

* **Le tue credenziali restano locali.** Sia la tua chiave API che le credenziali alias sono lette dalle variabili d'ambiente e usate per autenticare le richieste API tramite HTTP Basic auth. Non vengono mai inviate al modello AI.
* **Trasporto stdio.** Il server comunica con il client AI tramite stdin/stdout. Nessuna porta di rete viene aperta.
* **Nessuna memorizzazione dati.** Il server è senza stato. Non memorizza, registra o conserva alcun dato delle tue email.
* **Open source.** L'intero codice è su [GitHub](https://github.com/forwardemail/mcp-server). Puoi controllare ogni riga.


## Uso programmatico {#programmatic-usage}

Puoi anche usare il server come libreria:

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

Il Forward Email MCP Server è [open-source su GitHub](https://github.com/forwardemail/mcp-server) sotto licenza BUSL-1.1. Crediamo nella trasparenza. Se trovi un bug o vuoi una funzionalità, [apri un issue](https://github.com/forwardemail/mcp-server/issues).
