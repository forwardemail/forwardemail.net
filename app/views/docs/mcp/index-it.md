# Server MCP di Forward Email

<img loading="lazy" src="/img/articles/mcp.webp" alt="Forward Email MCP Server" class="rounded-lg" />

<p class="lead mt-3">
  <strong>TL;DR:</strong> Il nostro <a href="https://github.com/forwardemail/mcp-server">server MCP open-source</a> consente agli assistenti AI come Claude, ChatGPT, Cursor e Windsurf di gestire la tua email, domini, alias, contatti e calendari tramite linguaggio naturale. Tutti i 68 endpoint API sono esposti come strumenti MCP. Funziona localmente tramite <code>npx @forwardemail/mcp-server</code> — le tue credenziali non lasciano mai la tua macchina.
</p>

## Indice

* [Cos'è MCP?](#what-is-mcp)
* [Avvio Rapido](#quick-start)
  * [Ottieni una Chiave API](#get-an-api-key)
  * [Claude Desktop](#claude-desktop)
  * [Cursor](#cursor)
  * [Windsurf](#windsurf)
  * [Altri Client MCP](#other-mcp-clients)
* [Autenticazione](#authentication)
  * [Autenticazione con Chiave API](#api-key-auth)
  * [Autenticazione con Alias](#alias-auth)
  * [Generazione di una Password Alias](#generating-an-alias-password)
* [Tutti i 68 Strumenti](#all-68-tools)
  * [Account (Chiave API o Autenticazione Alias)](#account-api-key-or-alias-auth)
  * [Domini (Chiave API)](#domains-api-key)
  * [Alias (Chiave API)](#aliases-api-key)
  * [Email — SMTP in uscita (Chiave API; Invio supporta entrambi)](#emails--outbound-smtp-api-key-send-supports-both)
  * [Messaggi — IMAP (Autenticazione Alias)](#messages--imap-alias-auth)
  * [Cartelle — IMAP (Autenticazione Alias)](#folders--imap-alias-auth)
  * [Contatti — CardDAV (Autenticazione Alias)](#contacts--carddav-alias-auth)
  * [Calendari — CalDAV (Autenticazione Alias)](#calendars--caldav-alias-auth)
  * [Eventi del Calendario — CalDAV (Autenticazione Alias)](#calendar-events--caldav-alias-auth)
  * [Script Sieve (Chiave API)](#sieve-scripts-api-key)
  * [Script Sieve (Autenticazione Alias)](#sieve-scripts-alias-auth)
  * [Membri del Dominio e Inviti (Chiave API)](#domain-members-and-invites-api-key)
  * [Password Catch-All (Chiave API)](#catch-all-passwords-api-key)
  * [Log (Chiave API)](#logs-api-key)
  * [Crittografia (Nessuna Autenticazione)](#encrypt-no-auth)
* [20 Casi d'Uso Reali](#20-real-world-use-cases)
* [Esempi di Prompt](#example-prompts)
* [Variabili d'Ambiente](#environment-variables)
* [Sicurezza](#security)
* [Uso Programmatico](#programmatic-usage)
* [Open Source](#open-source)


## Cos'è MCP? {#what-is-mcp}

[Model Context Protocol](https://modelcontextprotocol.io) (MCP) è uno standard aperto creato da Anthropic che consente ai modelli AI di chiamare in modo sicuro strumenti esterni. Invece di copiare e incollare le risposte API in una finestra di chat, MCP offre al modello un accesso diretto e strutturato ai tuoi servizi.

Il nostro server MCP avvolge l'intera [API di Forward Email](/email-api) — ogni endpoint, ogni parametro — e li espone come strumenti che qualsiasi client compatibile con MCP può utilizzare. Il server viene eseguito localmente sulla tua macchina utilizzando il trasporto stdio. Le tue credenziali rimangono nelle tue variabili d'ambiente e non vengono mai inviate al modello AI.


## Avvio Rapido {#quick-start}

### Ottieni una Chiave API {#get-an-api-key}

1. Accedi al tuo [account Forward Email](/my-account/domains).
2. Vai su **Il mio account** → **Sicurezza** → **Chiavi API**.
3. Genera una nuova chiave API e copiala.

### Claude Desktop {#claude-desktop}

Aggiungi questo al tuo file di configurazione di Claude Desktop:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "forwardemail": {
      "command": "npx",
      "args": ["-y", "@forwardemail/mcp-server"],
      "env": {
        "FORWARD_EMAIL_API_KEY": "la-tua-chiave-api-qui",
        "FORWARD_EMAIL_ALIAS_USER": "tuo@esempio.com",
        "FORWARD_EMAIL_ALIAS_PASSWORD": "la-tua-password-alias-generata"
      }
    }
  }
}
```

Riavvia Claude Desktop. Dovresti vedere gli strumenti di Forward Email nel selettore degli strumenti.

> **Nota:** Le variabili `FORWARD_EMAIL_ALIAS_USER` e `FORWARD_EMAIL_ALIAS_PASSWORD` sono opzionali ma richieste per gli strumenti della casella di posta (messaggi, cartelle, contatti, calendari). Vedi [Autenticazione](#authentication) per i dettagli.

### Cursor {#cursor}

Apri Impostazioni di Cursor → MCP → Aggiungi Server:

```json
{
  "mcpServers": {
    "forwardemail": {
      "command": "npx",
      "args": ["-y", "@forwardemail/mcp-server"],
      "env": {
        "FORWARD_EMAIL_API_KEY": "la-tua-chiave-api-qui",
        "FORWARD_EMAIL_ALIAS_USER": "tuo@esempio.com",
        "FORWARD_EMAIL_ALIAS_PASSWORD": "la-tua-password-alias-generata"
      }
    }
  }
}
```

### Windsurf {#windsurf}

Apri Impostazioni di Windsurf → MCP → Aggiungi Server con la stessa configurazione di cui sopra.

### Altri Client MCP {#other-mcp-clients}

Qualsiasi client che supporta il trasporto stdio MCP funzionerà. Il comando è:

```sh
FORWARD_EMAIL_API_KEY=la-tua-chiave-api \
  FORWARD_EMAIL_ALIAS_USER=tuo@esempio.com \
  FORWARD_EMAIL_ALIAS_PASSWORD=la-tua-password-alias-generata \
  npx @forwardemail/mcp-server
```


## Autenticazione {#authentication}

L'API di Forward Email utilizza l'**autenticazione HTTP Basic** con due diversi tipi di credenziali a seconda dell'endpoint. Il server MCP gestisce questo automaticamente — devi solo fornire le credenziali corrette.

### Autenticazione con Chiave API {#api-key-auth}

La maggior parte degli endpoint di gestione (domini, alias, email in uscita, log) utilizzano la tua **chiave API** come nome utente di autenticazione Basic con una password vuota.

Questa è la stessa chiave API che usi per l'API REST. Impostala tramite la variabile d'ambiente `FORWARD_EMAIL_API_KEY`.

### Autenticazione con Alias {#alias-auth}

Gli endpoint della casella di posta (messaggi, cartelle, contatti, calendari, script sieve con ambito alias) utilizzano le **credenziali alias** — l'indirizzo email alias come nome utente e una password generata come password.

Questi endpoint accedono ai dati per alias tramite i protocolli IMAP, CalDAV e CardDAV. Richiedono l'email alias e una password generata, non la chiave API.

Puoi fornire le credenziali alias in due modi:

1. **Variabili d'ambiente** (consigliato per l'alias predefinito): Imposta `FORWARD_EMAIL_ALIAS_USER` e `FORWARD_EMAIL_ALIAS_PASSWORD`.
2. **Parametri per chiamata strumento**: Passa `alias_username` e `alias_password` come argomenti a qualsiasi strumento di autenticazione alias. Questi sovrascrivono le variabili d'ambiente, il che è utile quando si lavora con più alias.

### Generazione di una Password Alias {#generating-an-alias-password}

Prima di poter utilizzare gli strumenti di autenticazione alias, devi generare una password per l'alias. Puoi farlo con lo strumento `generateAliasPassword` o tramite l'API:

```sh
curl -u "LA_TUA_CHIAVE_API:" \
  https://api.forwardemail.net/v1/domains/example.com/aliases/ALIAS_ID/generate-password \
  -X POST
```

La risposta include i campi `username` (email alias) e `password`. Usali come credenziali alias.

> **Suggerimento:** Puoi anche chiedere al tuo assistente AI: *"Genera una password per l'alias user@example.com sul dominio example.com"* — chiamerà lo strumento `generateAliasPassword` e restituirà le credenziali.

La tabella seguente riassume quale metodo di autenticazione richiede ogni gruppo di strumenti:

| Gruppo di Strumenti | Metodo di Autenticazione | Credenziali |
|---------------------|--------------------------|-------------|
| Account | Chiave API **o** Autenticazione Alias | Entrambi |
| Domini, Alias, Membri del Dominio, Inviti, Password Catch-All | Chiave API | `FORWARD_EMAIL_API_KEY` |
| Email in uscita (elenca, ottieni, elimina, limita) | Chiave API | `FORWARD_EMAIL_API_KEY` |
| Invia Email | Chiave API **o** Autenticazione Alias | Entrambi |
| Messaggi (IMAP) | Autenticazione Alias | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Cartelle (IMAP) | Autenticazione Alias | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Contatti (CardDAV) | Autenticazione Alias | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Calendari (CalDAV) | Autenticazione Alias | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Eventi del Calendario (CalDAV) | Autenticazione Alias | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Script Sieve (con ambito dominio) | Chiave API | `FORWARD_EMAIL_API_KEY` |
| Script Sieve (con ambito alias) | Autenticazione Alias | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Log | Chiave API | `FORWARD_EMAIL_API_KEY` |
| Crittografia | Nessuno | Nessuna credenziale necessaria |


## Tutti i 68 Strumenti {#all-68-tools}

Ogni strumento mappa direttamente a un endpoint dell'[API di Forward Email](/email-api). I parametri utilizzano gli stessi nomi della documentazione API. Il metodo di autenticazione è indicato nell'intestazione di ogni sezione.

### Account (Chiave API o Autenticazione Alias) {#account-api-key-or-alias-auth}

Con l'autenticazione tramite chiave API, questi restituiscono le informazioni del tuo account utente. Con l'autenticazione tramite alias, restituiscono le informazioni dell'alias/casella di posta, inclusa la quota di archiviazione e le impostazioni.

| Strumento | Endpoint API | Descrizione |
|-----------|--------------|-------------|
| `getAccount` | `GET /v1/account` | Ottieni le informazioni del tuo account |
| `updateAccount` | `PUT /v1/account` | Aggiorna le impostazioni del tuo account |

### Domini (Chiave API) {#domains-api-key}

| Strumento | Endpoint API | Descrizione |
|-----------|--------------|-------------|
| `listDomains` | `GET /v1/domains` | Elenca tutti i tuoi domini |
| `createDomain` | `POST /v1/domains` | Aggiungi un nuovo dominio |
| `getDomain` | `GET /v1/domains/:domain_id` | Ottieni i dettagli del dominio |
| `updateDomain` | `PUT /v1/domains/:domain_id` | Aggiorna le impostazioni del dominio |
| `deleteDomain` | `DELETE /v1/domains/:domain_id` | Rimuovi un dominio |
| `verifyDomainRecords` | `GET /v1/domains/:domain_id/verify-records` | Verifica i record DNS |
| `verifySmtpRecords` | `GET /v1/domains/:domain_id/verify-smtp` | Verifica la configurazione SMTP |
| `testS3Connection` | `POST /v1/domains/:domain_id/test-s3-connection` | Testa la connessione S3 personalizzata |

### Alias (Chiave API) {#aliases-api-key}

| Strumento | Endpoint API | Descrizione |
|-----------|--------------|-------------|
| `listAliases` | `GET /v1/domains/:domain_id/aliases` | Elenca gli alias per un dominio |
| `createAlias` | `POST /v1/domains/:domain_id/aliases` | Crea un nuovo alias |
| `getAlias` | `GET /v1/domains/:domain_id/aliases/:alias_id` | Ottieni i dettagli dell'alias |
| `updateAlias` | `PUT /v1/domains/:domain_id/aliases/:alias_id` | Aggiorna un alias |
| `deleteAlias` | `DELETE /v1/domains/:domain_id/aliases/:alias_id` | Elimina un alias |
| `generateAliasPassword` | `POST /v1/domains/:domain_id/aliases/:alias_id/generate-password` | Genera la password IMAP/SMTP per l'autenticazione alias |

### Email — SMTP in uscita (Chiave API; Invio supporta entrambi) {#emails--outbound-smtp-api-key-send-supports-both}

| Strumento | Endpoint API | Autenticazione | Descrizione |
|-----------|--------------|----------------|-------------|
| `sendEmail` | `POST /v1/emails` | Chiave API o Autenticazione Alias | Invia un'email tramite SMTP |
| `listEmails` | `GET /v1/emails` | Chiave API | Elenca le email in uscita |
| `getEmail` | `GET /v1/emails/:id` | Chiave API | Ottieni i dettagli e lo stato dell'email |
| `deleteEmail` | `DELETE /v1/emails/:id` | Chiave API | Elimina un'email in coda |
| `getEmailLimit` | `GET /v1/emails/limit` | Chiave API | Controlla il tuo limite di invio |

Lo strumento `sendEmail` accetta `from`, `to`, `cc`, `bcc`, `subject`, `text`, `html` e `attachments`. Questo è lo stesso dell'endpoint `POST /v1/emails`.

### Messaggi — IMAP (Autenticazione Alias) {#messages--imap-alias-auth}

> **Richiede credenziali alias.** Passa `alias_username` e `alias_password` o imposta le variabili d'ambiente `FORWARD_EMAIL_ALIAS_USER` e `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Strumento | Endpoint API | Descrizione |
|-----------|--------------|-------------|
| `listMessages` | `GET /v1/messages` | Elenca e cerca messaggi in una casella di posta |
| `createMessage` | `POST /v1/messages` | Crea una bozza o carica un messaggio |
| `getMessage` | `GET /v1/messages/:id` | Ottieni un messaggio per ID |
| `updateMessage` | `PUT /v1/messages/:id` | Aggiorna i flag (letto, contrassegnato, ecc.) |
| `deleteMessage` | `DELETE /v1/messages/:id` | Elimina un messaggio |

Lo strumento `listMessages` supporta oltre 15 parametri di ricerca inclusi `subject`, `from`, `to`, `text`, `since`, `before`, `is_unread` e `has_attachment`. Consulta la [documentazione API](/email-api) per l'elenco completo.

### Cartelle — IMAP (Autenticazione Alias) {#folders--imap-alias-auth}

> **Richiede credenziali alias.** Passa `alias_username` e `alias_password` o imposta le variabili d'ambiente `FORWARD_EMAIL_ALIAS_USER` e `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Strumento | Endpoint API | Descrizione |
|-----------|--------------|-------------|
| `listFolders` | `GET /v1/folders` | Elenca tutte le cartelle della casella di posta |
| `createFolder` | `POST /v1/folders` | Crea una nuova cartella |
| `getFolder` | `GET /v1/folders/:id` | Ottieni i dettagli della cartella |
| `updateFolder` | `PUT /v1/folders/:id` | Rinomina una cartella |
| `deleteFolder` | `DELETE /v1/folders/:id` | Elimina una cartella |

### Contatti — CardDAV (Autenticazione Alias) {#contacts--carddav-alias-auth}

> **Richiede credenziali alias.** Passa `alias_username` e `alias_password` o imposta le variabili d'ambiente `FORWARD_EMAIL_ALIAS_USER` e `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Strumento | Endpoint API | Descrizione |
|-----------|--------------|-------------|
| `listContacts` | `GET /v1/contacts` | Elenca tutti i contatti |
| `createContact` | `POST /v1/contacts` | Crea un nuovo contatto |
| `getContact` | `GET /v1/contacts/:id` | Ottieni i dettagli del contatto |
| `updateContact` | `PUT /v1/contacts/:id` | Aggiorna un contatto |
| `deleteContact` | `DELETE /v1/contacts/:id` | Elimina un contatto |

### Calendari — CalDAV (Autenticazione Alias) {#calendars--caldav-alias-auth}

> **Richiede credenziali alias.** Passa `alias_username` e `alias_password` o imposta le variabili d'ambiente `FORWARD_EMAIL_ALIAS_USER` e `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Strumento | Endpoint API | Descrizione |
|-----------|--------------|-------------|
| `listCalendars` | `GET /v1/calendars` | Elenca tutti i calendari |
| `createCalendar` | `POST /v1/calendars` | Crea un nuovo calendario |
| `getCalendar` | `GET /v1/calendars/:id` | Ottieni i dettagli del calendario |
| `updateCalendar` | `PUT /v1/calendars/:id` | Aggiorna un calendario |
| `deleteCalendar` | `DELETE /v1/calendars/:id` | Elimina un calendario |

### Eventi del Calendario — CalDAV (Autenticazione Alias) {#calendar-events--caldav-alias-auth}

> **Richiede credenziali alias.** Passa `alias_username` e `alias_password` o imposta le variabili d'ambiente `FORWARD_EMAIL_ALIAS_USER` e `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Strumento | Endpoint API | Descrizione |
|-----------|--------------|-------------|
| `listCalendarEvents` | `GET /v1/calendar-events` | Elenca tutti gli eventi |
| `createCalendarEvent` | `POST /v1/calendar-events` | Crea un nuovo evento |
| `getCalendarEvent` | `GET /v1/calendar-events/:id` | Ottieni i dettagli dell'evento |
| `updateCalendarEvent` | `PUT /v1/calendar-events/:id` | Aggiorna un evento |
| `deleteCalendarEvent` | `DELETE /v1/calendar-events/:id` | Elimina un evento |

### Script Sieve (Chiave API) {#sieve-scripts-api-key}

Questi utilizzano percorsi con ambito dominio e si autenticano con la tua chiave API.

| Strumento | Endpoint API | Descrizione |
|-----------|--------------|-------------|
| `listSieveScripts` | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve` | Elenca gli script per un alias |
| `createSieveScript` | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve` | Crea un nuovo script |
| `getSieveScript` | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id` | Ottieni i dettagli dello script |
| `updateSieveScript` | `PUT /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id` | Aggiorna uno script |
| `deleteSieveScript` | `DELETE /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id` | Elimina uno script |
| `activateSieveScript` | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id/activate` | Attiva uno script |

### Script Sieve (Autenticazione Alias) {#sieve-scripts-alias-auth}

Questi utilizzano l'autenticazione a livello di alias. Utile per l'automazione per alias senza la necessità della chiave API.

> **Richiede credenziali alias.** Passa `alias_username` e `alias_password` o imposta le variabili d'ambiente `FORWARD_EMAIL_ALIAS_USER` e `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Strumento | Endpoint API | Descrizione |
|-----------|--------------|-------------|
| `listSieveScriptsAliasAuth` | `GET /v1/sieve-scripts` | Elenca gli script |
| `createSieveScriptAliasAuth` | `POST /v1/sieve-scripts` | Crea uno script |
| `getSieveScriptAliasAuth` | `GET /v1/sieve-scripts/:script_id` | Ottieni i dettagli dello script |
| `updateSieveScriptAliasAuth` | `PUT /v1/sieve-scripts/:script_id` | Aggiorna uno script |
| `deleteSieveScriptAliasAuth` | `DELETE /v1/sieve-scripts/:script_id` | Elimina uno script |
| `activateSieveScriptAliasAuth` | `POST /v1/sieve-scripts/:script_id/activate` | Attiva uno script |

### Membri del Dominio e Inviti (Chiave API) {#domain-members-and-invites-api-key}

| Strumento | Endpoint API | Descrizione |
|-----------|--------------|-------------|
| `updateDomainMember` | `PUT /v1/domains/:domain_id/members/:member_id` | Cambia il ruolo di un membro |
| `removeDomainMember` | `DELETE /v1/domains/:domain_id/members/:member_id` | Rimuovi un membro |
| `acceptDomainInvite` | `GET /v1/domains/:domain_id/invites` | Accetta un invito in sospeso |
| `createDomainInvite` | `POST /v1/domains/:domain_id/invites` | Invita qualcuno a un dominio |
| `removeDomainInvite` | `DELETE /v1/domains/:domain_id/invites` | Revoca un invito |

### Password Catch-All (Chiave API) {#catch-all-passwords-api-key}

| Strumento | Endpoint API | Descrizione |
|-----------|--------------|-------------|
| `listCatchAllPasswords` | `GET /v1/domains/:domain_id/catch-all-passwords` | Elenca le password catch-all |
| `createCatchAllPassword` | `POST /v1/domains/:domain_id/catch-all-passwords` | Crea una password catch-all |
| `deleteCatchAllPassword` | `DELETE /v1/domains/:domain_id/catch-all-passwords/:token_id` | Elimina una password catch-all |

### Log (Chiave API) {#logs-api-key}

| Strumento | Endpoint API | Descrizione |
|-----------|--------------|-------------|
| `downloadLogs` | `GET /v1/logs/download` | Scarica i log di consegna email |

### Crittografia (Nessuna Autenticazione) {#encrypt-no-auth}

| Strumento | Endpoint API | Descrizione |
|-----------|--------------|-------------|
| `encryptRecord` | `POST /v1/encrypt` | Crittografa un record DNS TXT |

Questo strumento non richiede autenticazione. Crittografa i record di inoltro come `forward-email=user@example.com` per l'uso nei record DNS TXT.


## 20 Casi d'Uso Reali {#20-real-world-use-cases}

Ecco modi pratici per utilizzare il server MCP con il tuo assistente AI:

### 1. Triage Email

Chiedi al tuo AI di scansionare la tua casella di posta e riassumere i messaggi non letti. Può contrassegnare le email urgenti, categorizzare per mittente e redigere risposte — tutto tramite linguaggio naturale. *(Richiede credenziali alias per l'accesso alla casella di posta.)*

### 2. Automazione della Configurazione del Dominio

Stai configurando un nuovo dominio? Chiedi all'AI di creare il dominio, aggiungere i tuoi alias, verificare i record DNS e testare la configurazione SMTP. Ciò che normalmente richiede 10 minuti di clic attraverso i dashboard diventa una conversazione.

### 3. Gestione di Alias in Blocco

Hai bisogno di creare 20 alias per un nuovo progetto? Descrivi ciò di cui hai bisogno e lascia che l'AI gestisca il lavoro ripetitivo. Può creare alias, impostare regole di inoltro e generare password in un'unica operazione.

### 4. Monitoraggio delle Campagne Email

Chiedi al tuo AI di controllare i limiti di invio, elencare le email in uscita recenti e segnalare lo stato di consegna. Utile per monitorare la salute delle email transazionali.

### 5. Sincronizzazione e Pulizia dei Contatti

Usa gli strumenti CardDAV per elencare tutti i contatti, trovare duplicati, aggiornare informazioni obsolete o creare contatti in blocco da un foglio di calcolo che incolli nella chat. *(Richiede credenziali alias.)*

### 6. Gestione del Calendario

Crea calendari, aggiungi eventi, aggiorna gli orari delle riunioni ed elimina gli eventi annullati — tutto tramite conversazione. Gli strumenti CalDAV supportano CRUD completo sia sui calendari che sugli eventi. *(Richiede credenziali alias.)*

### 7. Automazione degli Script Sieve

Gli script Sieve sono potenti ma la sintassi è arcana. Chiedi al tuo AI di scrivere script Sieve per te: "Filtra tutte le email da billing@example.com in una cartella Fatturazione" diventa uno script funzionante senza toccare la specifica RFC 5228.

### 8. Onboarding del Team

Quando un nuovo membro del team si unisce, chiedi all'AI di creare il suo alias, generare una password, inviargli un'email di benvenuto con le sue credenziali e aggiungerlo come membro del dominio. Un prompt, quattro chiamate API.

### 9. Audit di Sicurezza

Chiedi al tuo AI di elencare tutti i domini, controllare lo stato di verifica DNS, rivedere le configurazioni degli alias e identificare eventuali domini con record non verificati. Una rapida scansione di sicurezza in linguaggio naturale.

### 10. Configurazione dell'Inoltro Email

Stai configurando l'inoltro email per un nuovo dominio? Chiedi all'AI di creare il dominio, aggiungere gli alias di inoltro, crittografare i record DNS e verificare che tutto sia configurato correttamente.

### 11. Ricerca e Analisi della Casella di Posta

Usa gli strumenti di ricerca dei messaggi per trovare email specifiche: "Trova tutte le email non lette da john@example.com negli ultimi 30 giorni che hanno allegati." Gli oltre 15 parametri di ricerca lo rendono potente. *(Richiede credenziali alias.)*

### 12. Organizzazione delle Cartelle

Chiedi al tuo AI di creare una struttura di cartelle per un nuovo progetto, spostare messaggi tra cartelle o pulire vecchie cartelle di cui non hai più bisogno. *(Richiede credenziali alias.)*

### 13. Rotazione delle Password

Genera nuove password alias su base programmata. Chiedi al tuo AI di generare una nuova password per ogni alias e di segnalare le nuove credenziali.

### 14. Crittografia dei Record DNS

Crittografa i tuoi record di inoltro prima di aggiungerli al DNS. Lo strumento `encryptRecord` gestisce questo senza autenticazione — utile per crittografie rapide e una tantum.

### 15. Analisi dei Log di Consegna

Scarica i tuoi log di consegna email e chiedi all'AI di analizzare i tassi di rimbalzo, identificare i destinatari problematici o tracciare i tempi di consegna.

### 16. Gestione Multi-Dominio

Se gestisci più domini, chiedi all'AI di fornirti un rapporto sullo stato: quali domini sono verificati, quali hanno problemi, quanti alias ha ciascuno e come sono i limiti di invio.

### 17. Configurazione Catch-All

Imposta password catch-all per i domini che devono ricevere email a qualsiasi indirizzo. L'AI può creare, elencare e gestire queste password per te.

### 18. Gestione degli Inviti al Dominio

Invita i membri del team a gestire i domini, controllare gli inviti in sospeso e pulire quelli scaduti. Utile per organizzazioni con più amministratori di dominio.

### 19. Test di Archiviazione S3

Se utilizzi l'archiviazione S3 personalizzata per i backup delle email, chiedi all'AI di testare la connessione e verificare che funzioni correttamente.

### 20. Composizione di Bozze Email

Crea bozze di email nella tua casella di posta senza inviarle. Utile per preparare email che necessitano di revisione prima dell'invio, o per creare modelli di email. *(Richiede credenziali alias.)*


## Esempi di Prompt {#example-prompts}

Ecco i prompt che puoi usare direttamente con il tuo assistente AI:

**Invio di email:**
> "Invia un'email da hello@mydomain.com a john@example.com con l'oggetto 'Riunione Domani' e il corpo 'Ciao John, siamo ancora in programma per le 14:00?'"

**Gestione del dominio:**
> "Elenca tutti i miei domini e dimmi quali hanno record DNS non verificati."

**Creazione di alias:**
> "Crea un nuovo alias support@mydomain.com che inoltra alla mia email personale."

**Ricerca nella casella di posta (richiede credenziali alias):**
> "Trova tutte le email non lette dell'ultima settimana che menzionano 'fattura'."

**Calendario (richiede credenziali alias):**
> "Crea un calendario chiamato 'Lavoro' e aggiungi una riunione per domani alle 14:00 chiamata 'Standup del Team'."

**Script Sieve:**
> "Scrivi uno script Sieve per info@mydomain.com che risponda automaticamente alle email con 'Grazie per averci contattato, ti risponderemo entro 24 ore'."

**Operazioni in blocco:**
> "Crea alias per sales@, support@, billing@ e info@ su mydomain.com, tutti inoltrati a team@mydomain.com."

**Controllo di sicurezza:**
> "Controlla lo stato di verifica DNS e SMTP per tutti i miei domini e dimmi se c'è qualcosa che richiede attenzione."

**Genera password alias:**
> "Genera una password per l'alias user@example.com in modo che io possa accedere alla mia casella di posta."


## Variabili d'Ambiente {#environment-variables}

| Variabile | Obbligatoria | Predefinita | Descrizione |
|-----------|--------------|-------------|-------------|
| `FORWARD_EMAIL_API_KEY` | Sì | — | La tua chiave API di Forward Email (usata come nome utente di autenticazione Basic per gli endpoint con chiave API) |
| `FORWARD_EMAIL_ALIAS_USER` | No | — | Indirizzo email alias per gli endpoint della casella di posta (es. `user@example.com`) |
| `FORWARD_EMAIL_ALIAS_PASSWORD` | No | — | Password alias generata per gli endpoint della casella di posta |
| `FORWARD_EMAIL_API_URL` | No | `https://api.forwardemail.net` | URL base dell'API (per self-hosted o test) |


## Sicurezza {#security}

Il server MCP viene eseguito localmente sulla tua macchina. Ecco come funziona la sicurezza:

*   **Le tue credenziali rimangono locali.** Sia la tua chiave API che le credenziali alias vengono lette dalle variabili d'ambiente e utilizzate per autenticare le richieste API tramite autenticazione HTTP Basic. Non vengono mai inviate al modello AI.
*   **Trasporto stdio.** Il server comunica con il client AI tramite stdin/stdout. Non vengono aperte porte di rete.
*   **Nessun archiviazione dati.** Il server è stateless. Non memorizza nella cache, non registra e non archivia nessuno dei tuoi dati email.
*   **Open source.** L'intero codice è su [GitHub](https://github.com/forwardemail/mcp-server). Puoi controllare ogni riga.


## Uso Programmatico {#programmatic-usage}

Puoi anche usare il server come libreria:

```js
const { McpServer } = require('@forwardemail/mcp-server');

const server = new McpServer({
  apiKey: 'la-tua-chiave-api',
  aliasUser: 'user@example.com',
  aliasPassword: 'password-alias-generata',
});

server.listen();
```


## Open Source {#open-source}

Il server MCP di Forward Email è [open-source su GitHub](https://github.com/forwardemail/mcp-server) sotto licenza BUSL-1.1. Crediamo nella trasparenza. Se trovi un bug o desideri una funzionalità, [apri un problema](https://github.com/forwardemail/mcp-server/issues).

