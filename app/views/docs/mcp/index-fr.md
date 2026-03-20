# Serveur MCP Forward Email {#forward-email-mcp-server}

<img loading="lazy" src="/img/articles/mcp.webp" alt="Serveur MCP Forward Email" class="rounded-lg" />

<p class="lead mt-3">
  <strong>En bref :</strong> Notre <a href="https://github.com/forwardemail/mcp-server">serveur MCP open-source</a> permet aux assistants IA comme Claude, ChatGPT, Cursor et Windsurf de gérer vos emails, domaines, alias, contacts et calendriers via le langage naturel. Les 68 points d’API sont tous exposés comme outils MCP. Il s’exécute localement via <code>npx @forwardemail/mcp-server</code> — vos identifiants ne quittent jamais votre machine.
</p>


## Table des matières {#table-of-contents}

* [Qu’est-ce que MCP ?](#what-is-mcp)
* [Démarrage rapide](#quick-start)
  * [Obtenir une clé API](#get-an-api-key)
  * [Claude Desktop](#claude-desktop)
  * [Cursor](#cursor)
  * [Windsurf](#windsurf)
  * [Autres clients MCP](#other-mcp-clients)
* [Authentification](#authentication)
  * [Authentification par clé API](#api-key-auth)
  * [Authentification par alias](#alias-auth)
  * [Génération d’un mot de passe alias](#generating-an-alias-password)
* [Les 68 outils](#all-68-tools)
  * [Compte (clé API ou authentification alias)](#account-api-key-or-alias-auth)
  * [Domaines (clé API)](#domains-api-key)
  * [Alias (clé API)](#aliases-api-key)
  * [Emails — SMTP sortant (clé API ; Send supporte les deux)](#emails--outbound-smtp-api-key-send-supports-both)
  * [Messages — IMAP (authentification alias)](#messages--imap-alias-auth)
  * [Dossiers — IMAP (authentification alias)](#folders--imap-alias-auth)
  * [Contacts — CardDAV (authentification alias)](#contacts--carddav-alias-auth)
  * [Calendriers — CalDAV (authentification alias)](#calendars--caldav-alias-auth)
  * [Événements de calendrier — CalDAV (authentification alias)](#calendar-events--caldav-alias-auth)
  * [Scripts Sieve (clé API)](#sieve-scripts-api-key)
  * [Scripts Sieve (authentification alias)](#sieve-scripts-alias-auth)
  * [Membres et invitations de domaine (clé API)](#domain-members-and-invites-api-key)
  * [Mots de passe Catch-All (clé API)](#catch-all-passwords-api-key)
  * [Journaux (clé API)](#logs-api-key)
  * [Chiffrement (sans authentification)](#encrypt-no-auth)
* [20 cas d’usage concrets](#20-real-world-use-cases)
  * [1. Tri des emails](#1-email-triage)
  * [2. Automatisation de la configuration de domaine](#2-domain-setup-automation)
  * [3. Gestion en masse des alias](#3-bulk-alias-management)
  * [4. Suivi des campagnes email](#4-email-campaign-monitoring)
  * [5. Synchronisation et nettoyage des contacts](#5-contact-sync-and-cleanup)
  * [6. Gestion du calendrier](#6-calendar-management)
  * [7. Automatisation des scripts Sieve](#7-sieve-script-automation)
  * [8. Intégration d’équipe](#8-team-onboarding)
  * [9. Audit de sécurité](#9-security-auditing)
  * [10. Configuration du transfert d’email](#10-email-forwarding-setup)
  * [11. Recherche et analyse de la boîte de réception](#11-inbox-search-and-analysis)
  * [12. Organisation des dossiers](#12-folder-organization)
  * [13. Rotation des mots de passe](#13-password-rotation)
  * [14. Chiffrement des enregistrements DNS](#14-dns-record-encryption)
  * [15. Analyse des journaux de livraison](#15-delivery-log-analysis)
  * [16. Gestion multi-domaines](#16-multi-domain-management)
  * [17. Configuration Catch-All](#17-catch-all-configuration)
  * [18. Gestion des invitations de domaine](#18-domain-invite-management)
  * [19. Test de stockage S3](#19-s3-storage-testing)
  * [20. Rédaction de brouillons d’email](#20-email-draft-composition)
* [Exemples de prompts](#example-prompts)
* [Variables d’environnement](#environment-variables)
* [Sécurité](#security)
* [Utilisation programmatique](#programmatic-usage)
* [Open Source](#open-source)


## Qu’est-ce que MCP ? {#what-is-mcp}

[Model Context Protocol](https://modelcontextprotocol.io) (MCP) est une norme ouverte créée par Anthropic qui permet aux modèles IA d’appeler en toute sécurité des outils externes. Au lieu de copier-coller les réponses d’API dans une fenêtre de chat, MCP donne au modèle un accès direct et structuré à vos services.

Notre serveur MCP enveloppe toute l’[API Forward Email](/email-api) — chaque point d’accès, chaque paramètre — et les expose comme des outils que tout client compatible MCP peut utiliser. Le serveur s’exécute localement sur votre machine via un transport stdio. Vos identifiants restent dans vos variables d’environnement et ne sont jamais envoyés au modèle IA.


## Démarrage rapide {#quick-start}

### Obtenir une clé API {#get-an-api-key}
1. Connectez-vous à votre [compte Forward Email](/my-account/domains).
2. Allez dans **Mon Compte** → **Sécurité** → **Clés API**.
3. Générez une nouvelle clé API et copiez-la.

### Claude Desktop {#claude-desktop}

Ajoutez ceci à votre fichier de configuration Claude Desktop :

**macOS :** `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows :** `%APPDATA%\Claude\claude_desktop_config.json`

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

Redémarrez Claude Desktop. Vous devriez voir les outils Forward Email dans le sélecteur d'outils.

> **Note :** Les variables `FORWARD_EMAIL_ALIAS_USER` et `FORWARD_EMAIL_ALIAS_PASSWORD` sont optionnelles mais requises pour les outils de boîte aux lettres (messages, dossiers, contacts, calendriers). Voir [Authentification](#authentication) pour plus de détails.

### Cursor {#cursor}

Ouvrez les Paramètres de Cursor → MCP → Ajouter un Serveur :

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

Ouvrez les Paramètres de Windsurf → MCP → Ajouter un Serveur avec la même configuration que ci-dessus.

### Autres Clients MCP {#other-mcp-clients}

Tout client supportant le transport MCP stdio fonctionnera. La commande est :

```sh
FORWARD_EMAIL_API_KEY=your-api-key \
  FORWARD_EMAIL_ALIAS_USER=you@example.com \
  FORWARD_EMAIL_ALIAS_PASSWORD=your-generated-alias-password \
  npx @forwardemail/mcp-server
```


## Authentification {#authentication}

L’API Forward Email utilise **l’authentification HTTP Basic** avec deux types d’identifiants différents selon le point de terminaison. Le serveur MCP gère cela automatiquement — vous devez simplement fournir les bons identifiants.

### Authentification par Clé API {#api-key-auth}

La plupart des points de terminaison de gestion (domaines, alias, emails sortants, journaux) utilisent votre **clé API** comme nom d’utilisateur Basic auth avec un mot de passe vide.

C’est la même clé API que vous utilisez pour l’API REST. Configurez-la via la variable d’environnement `FORWARD_EMAIL_API_KEY`.

### Authentification par Alias {#alias-auth}

Les points de terminaison de boîte aux lettres (messages, dossiers, contacts, calendriers, scripts sieve liés à un alias) utilisent des **identifiants d’alias** — l’adresse email de l’alias comme nom d’utilisateur et un mot de passe généré comme mot de passe.

Ces points de terminaison accèdent aux données par alias via les protocoles IMAP, CalDAV et CardDAV. Ils nécessitent l’email de l’alias et un mot de passe généré, pas la clé API.

Vous pouvez fournir les identifiants d’alias de deux façons :

1. **Variables d’environnement** (recommandé pour l’alias par défaut) : définissez `FORWARD_EMAIL_ALIAS_USER` et `FORWARD_EMAIL_ALIAS_PASSWORD`.
2. **Paramètres par appel d’outil** : passez `alias_username` et `alias_password` en arguments à n’importe quel outil d’auth alias. Ceux-ci remplacent les variables d’environnement, ce qui est utile lorsque vous travaillez avec plusieurs alias.

### Génération d’un Mot de Passe d’Alias {#generating-an-alias-password}

Avant de pouvoir utiliser les outils d’auth alias, vous devez générer un mot de passe pour l’alias. Vous pouvez le faire avec l’outil `generateAliasPassword` ou via l’API :

```sh
curl -u "YOUR_API_KEY:" \
  https://api.forwardemail.net/v1/domains/example.com/aliases/ALIAS_ID/generate-password \
  -X POST
```

La réponse inclut les champs `username` (email de l’alias) et `password`. Utilisez-les comme identifiants d’alias.

> **Astuce :** Vous pouvez aussi demander à votre assistant IA : *« Génère un mot de passe pour l’alias <user@example.com> sur le domaine example.com »* — il appellera l’outil `generateAliasPassword` et retournera les identifiants.

Le tableau ci-dessous résume la méthode d’authentification requise pour chaque groupe d’outils :

| Groupe d’Outils                                               | Méthode d’Auth            | Identifiants                                               |
| ------------------------------------------------------------- | ------------------------- | ---------------------------------------------------------- |
| Compte                                                        | Clé API **ou** Auth Alias | L’un ou l’autre                                            |
| Domaines, Alias, Membres de Domaine, Invitations, Mots de Passe Catch-All | Clé API                   | `FORWARD_EMAIL_API_KEY`                                   |
| Emails Sortants (liste, obtention, suppression, limite)       | Clé API                   | `FORWARD_EMAIL_API_KEY`                                   |
| Envoi d’Email                                                | Clé API **ou** Auth Alias | L’un ou l’autre                                            |
| Messages (IMAP)                                              | Auth Alias                | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Dossiers (IMAP)                                             | Auth Alias                | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Contacts (CardDAV)                                           | Auth Alias                | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Calendriers (CalDAV)                                         | Auth Alias                | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Événements de Calendrier (CalDAV)                           | Auth Alias                | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Scripts Sieve (portée domaine)                              | Clé API                   | `FORWARD_EMAIL_API_KEY`                                   |
| Scripts Sieve (portée alias)                               | Auth Alias                | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Journaux                                                    | Clé API                   | `FORWARD_EMAIL_API_KEY`                                   |
| Chiffrement                                                | Aucun                     | Aucun identifiant requis                                  |
## Tous les 68 Outils {#all-68-tools}

Chaque outil correspond directement à un point de terminaison de la [Forward Email API](/email-api). Les paramètres utilisent les mêmes noms que dans la documentation de l'API. La méthode d'authentification est indiquée dans le titre de chaque section.

### Compte (Authentification par clé API ou alias) {#account-api-key-or-alias-auth}

Avec l'authentification par clé API, ces outils retournent les informations de votre compte utilisateur. Avec l'authentification par alias, ils retournent les informations de l'alias/boîte aux lettres, y compris le quota de stockage et les paramètres.

| Outil            | Point de terminaison API | Description                  |
| --------------- | ------------------------ | ---------------------------- |
| `getAccount`    | `GET /v1/account`        | Obtenir les informations de votre compte |
| `updateAccount` | `PUT /v1/account`        | Mettre à jour les paramètres de votre compte |

### Domaines (Clé API) {#domains-api-key}

| Outil                  | Point de terminaison API                          | Description               |
| --------------------- | ------------------------------------------------ | ------------------------- |
| `listDomains`         | `GET /v1/domains`                                | Lister tous vos domaines  |
| `createDomain`        | `POST /v1/domains`                               | Ajouter un nouveau domaine |
| `getDomain`           | `GET /v1/domains/:domain_id`                     | Obtenir les détails du domaine |
| `updateDomain`        | `PUT /v1/domains/:domain_id`                     | Mettre à jour les paramètres du domaine |
| `deleteDomain`        | `DELETE /v1/domains/:domain_id`                  | Supprimer un domaine      |
| `verifyDomainRecords` | `GET /v1/domains/:domain_id/verify-records`      | Vérifier les enregistrements DNS |
| `verifySmtpRecords`   | `GET /v1/domains/:domain_id/verify-smtp`         | Vérifier la configuration SMTP |
| `testS3Connection`    | `POST /v1/domains/:domain_id/test-s3-connection` | Tester le stockage S3 personnalisé |

### Alias (Clé API) {#aliases-api-key}

| Outil                    | Point de terminaison API                                         | Description                                |
| ----------------------- | ---------------------------------------------------------------- | ------------------------------------------ |
| `listAliases`           | `GET /v1/domains/:domain_id/aliases`                             | Lister les alias pour un domaine           |
| `createAlias`           | `POST /v1/domains/:domain_id/aliases`                            | Créer un nouvel alias                      |
| `getAlias`              | `GET /v1/domains/:domain_id/aliases/:alias_id`                   | Obtenir les détails d'un alias             |
| `updateAlias`           | `PUT /v1/domains/:domain_id/aliases/:alias_id`                   | Mettre à jour un alias                      |
| `deleteAlias`           | `DELETE /v1/domains/:domain_id/aliases/:alias_id`                | Supprimer un alias                         |
| `generateAliasPassword` | `POST /v1/domains/:domain_id/aliases/:alias_id/generate-password` | Générer un mot de passe IMAP/SMTP pour l'authentification par alias |

### Emails — SMTP sortant (Clé API ; Send supporte les deux) {#emails--outbound-smtp-api-key-send-supports-both}

| Outil            | Point de terminaison API  | Authentification       | Description                  |
| --------------- | ------------------------- | --------------------- | ---------------------------- |
| `sendEmail`     | `POST /v1/emails`         | Clé API ou Auth alias | Envoyer un email via SMTP    |
| `listEmails`    | `GET /v1/emails`          | Clé API               | Lister les emails sortants   |
| `getEmail`      | `GET /v1/emails/:id`      | Clé API               | Obtenir les détails et le statut d'un email |
| `deleteEmail`   | `DELETE /v1/emails/:id`   | Clé API               | Supprimer un email en file d'attente |
| `getEmailLimit` | `GET /v1/emails/limit`    | Clé API               | Vérifier votre limite d'envoi |

L'outil `sendEmail` accepte `from`, `to`, `cc`, `bcc`, `subject`, `text`, `html` et `attachments`. C'est identique au point de terminaison `POST /v1/emails`.

### Messages — IMAP (Authentification par alias) {#messages--imap-alias-auth}

> **Nécessite les identifiants de l'alias.** Passez `alias_username` et `alias_password` ou définissez les variables d'environnement `FORWARD_EMAIL_ALIAS_USER` et `FORWARD_EMAIL_ALIAS_PASSWORD`.
| Outil           | Point de terminaison API    | Description                          |
| --------------- | --------------------------- | ----------------------------------- |
| `listMessages`  | `GET /v1/messages`          | Lister et rechercher des messages dans une boîte aux lettres |
| `createMessage` | `POST /v1/messages`         | Créer un brouillon ou télécharger un message |
| `getMessage`    | `GET /v1/messages/:id`      | Obtenir un message par ID           |
| `updateMessage` | `PUT /v1/messages/:id`      | Mettre à jour les indicateurs (lu, étoilé, etc.) |
| `deleteMessage` | `DELETE /v1/messages/:id`   | Supprimer un message                |

L’outil `listMessages` prend en charge plus de 15 paramètres de recherche incluant `subject`, `from`, `to`, `text`, `since`, `before`, `is_unread` et `has_attachment`. Voir les [docs API](/email-api) pour la liste complète.

### Dossiers — IMAP (Authentification Alias) {#folders--imap-alias-auth}

> **Nécessite les identifiants alias.** Passez `alias_username` et `alias_password` ou définissez les variables d’environnement `FORWARD_EMAIL_ALIAS_USER` et `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Outil           | Point de terminaison API    | Description              |
| --------------  | --------------------------- | ------------------------ |
| `listFolders`  | `GET /v1/folders`           | Lister tous les dossiers de la boîte aux lettres |
| `createFolder` | `POST /v1/folders`          | Créer un nouveau dossier |
| `getFolder`    | `GET /v1/folders/:id`       | Obtenir les détails d’un dossier |
| `updateFolder` | `PUT /v1/folders/:id`       | Renommer un dossier      |
| `deleteFolder` | `DELETE /v1/folders/:id`    | Supprimer un dossier     |

### Contacts — CardDAV (Authentification Alias) {#contacts--carddav-alias-auth}

> **Nécessite les identifiants alias.** Passez `alias_username` et `alias_password` ou définissez les variables d’environnement `FORWARD_EMAIL_ALIAS_USER` et `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Outil           | Point de terminaison API    | Description          |
| --------------  | --------------------------- | -------------------- |
| `listContacts`  | `GET /v1/contacts`          | Lister tous les contacts |
| `createContact` | `POST /v1/contacts`         | Créer un nouveau contact |
| `getContact`    | `GET /v1/contacts/:id`      | Obtenir les détails d’un contact |
| `updateContact` | `PUT /v1/contacts/:id`      | Mettre à jour un contact |
| `deleteContact` | `DELETE /v1/contacts/:id`   | Supprimer un contact   |

### Calendriers — CalDAV (Authentification Alias) {#calendars--caldav-alias-auth}

> **Nécessite les identifiants alias.** Passez `alias_username` et `alias_password` ou définissez les variables d’environnement `FORWARD_EMAIL_ALIAS_USER` et `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Outil            | Point de terminaison API    | Description           |
| ---------------- | --------------------------- | --------------------- |
| `listCalendars`  | `GET /v1/calendars`         | Lister tous les calendriers |
| `createCalendar` | `POST /v1/calendars`        | Créer un nouveau calendrier |
| `getCalendar`    | `GET /v1/calendars/:id`     | Obtenir les détails d’un calendrier |
| `updateCalendar` | `PUT /v1/calendars/:id`     | Mettre à jour un calendrier |
| `deleteCalendar` | `DELETE /v1/calendars/:id`  | Supprimer un calendrier |

### Événements de calendrier — CalDAV (Authentification Alias) {#calendar-events--caldav-alias-auth}

> **Nécessite les identifiants alias.** Passez `alias_username` et `alias_password` ou définissez les variables d’environnement `FORWARD_EMAIL_ALIAS_USER` et `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Outil                 | Point de terminaison API       | Description        |
| --------------------- | ------------------------------ | ------------------ |
| `listCalendarEvents`  | `GET /v1/calendar-events`      | Lister tous les événements |
| `createCalendarEvent` | `POST /v1/calendar-events`     | Créer un nouvel événement |
| `getCalendarEvent`    | `GET /v1/calendar-events/:id`  | Obtenir les détails d’un événement |
| `updateCalendarEvent` | `PUT /v1/calendar-events/:id`  | Mettre à jour un événement |
| `deleteCalendarEvent` | `DELETE /v1/calendar-events/:id` | Supprimer un événement |

### Scripts Sieve (Clé API) {#sieve-scripts-api-key}

Ces scripts utilisent des chemins spécifiques au domaine et s’authentifient avec votre clé API.

| Outil                 | Point de terminaison API                                                        | Description               |
| --------------------- | ------------------------------------------------------------------------------- | ------------------------- |
| `listSieveScripts`    | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve`                           | Lister les scripts pour un alias |
| `createSieveScript`   | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve`                          | Créer un nouveau script   |
| `getSieveScript`      | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id`                | Obtenir les détails du script |
| `updateSieveScript`   | `PUT /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id`                | Mettre à jour un script   |
| `deleteSieveScript`   | `DELETE /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id`             | Supprimer un script       |
| `activateSieveScript` | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id/activate`      | Activer un script         |
### Scripts Sieve (Authentification Alias) {#sieve-scripts-alias-auth}

Ils utilisent l'authentification au niveau de l'alias. Utile pour l'automatisation par alias sans avoir besoin de la clé API.

> **Nécessite les identifiants de l'alias.** Passez `alias_username` et `alias_password` ou définissez les variables d'environnement `FORWARD_EMAIL_ALIAS_USER` et `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Outil                         | Point d'API                                  | Description         |
| ----------------------------- | -------------------------------------------- | ------------------- |
| `listSieveScriptsAliasAuth`   | `GET /v1/sieve-scripts`                      | Lister les scripts  |
| `createSieveScriptAliasAuth`  | `POST /v1/sieve-scripts`                     | Créer un script     |
| `getSieveScriptAliasAuth`     | `GET /v1/sieve-scripts/:script_id`           | Obtenir les détails d'un script |
| `updateSieveScriptAliasAuth`  | `PUT /v1/sieve-scripts/:script_id`           | Mettre à jour un script |
| `deleteSieveScriptAliasAuth`  | `DELETE /v1/sieve-scripts/:script_id`        | Supprimer un script |
| `activateSieveScriptAliasAuth`| `POST /v1/sieve-scripts/:script_id/activate` | Activer un script   |

### Membres et Invitations de Domaine (Clé API) {#domain-members-and-invites-api-key}

| Outil                 | Point d'API                                       | Description                |
| --------------------- | ------------------------------------------------ | -------------------------- |
| `updateDomainMember`  | `PUT /v1/domains/:domain_id/members/:member_id`  | Modifier le rôle d'un membre |
| `removeDomainMember`  | `DELETE /v1/domains/:domain_id/members/:member_id` | Supprimer un membre        |
| `acceptDomainInvite`  | `GET /v1/domains/:domain_id/invites`             | Accepter une invitation en attente |
| `createDomainInvite`  | `POST /v1/domains/:domain_id/invites`            | Inviter quelqu'un dans un domaine |
| `removeDomainInvite`  | `DELETE /v1/domains/:domain_id/invites`          | Révoquer une invitation    |

### Mots de Passe Catch-All (Clé API) {#catch-all-passwords-api-key}

| Outil                     | Point d'API                                                  | Description                 |
| ------------------------- | ------------------------------------------------------------ | --------------------------- |
| `listCatchAllPasswords`   | `GET /v1/domains/:domain_id/catch-all-passwords`             | Lister les mots de passe catch-all |
| `createCatchAllPassword`  | `POST /v1/domains/:domain_id/catch-all-passwords`            | Créer un mot de passe catch-all |
| `deleteCatchAllPassword`  | `DELETE /v1/domains/:domain_id/catch-all-passwords/:token_id`| Supprimer un mot de passe catch-all |

### Journaux (Clé API) {#logs-api-key}

| Outil           | Point d'API            | Description                  |
| --------------- | ---------------------- | ---------------------------- |
| `downloadLogs`  | `GET /v1/logs/download`| Télécharger les journaux de livraison des emails |

### Chiffrement (Sans Auth) {#encrypt-no-auth}

| Outil           | Point d'API       | Description              |
| --------------- | ----------------- | ------------------------ |
| `encryptRecord` | `POST /v1/encrypt`| Chiffrer un enregistrement DNS TXT |

Cet outil ne nécessite pas d'authentification. Il chiffre les enregistrements de redirection comme `forward-email=user@example.com` pour une utilisation dans les enregistrements DNS TXT.


## 20 Cas d'Utilisation Concrets {#20-real-world-use-cases}

Voici des façons pratiques d'utiliser le serveur MCP avec votre assistant IA :

### 1. Tri des Emails {#1-email-triage}

Demandez à votre IA de scanner votre boîte de réception et de résumer les messages non lus. Elle peut signaler les emails urgents, les catégoriser par expéditeur, et rédiger des réponses — tout cela en langage naturel. *(Nécessite les identifiants de l'alias pour accéder à la boîte de réception.)*

### 2. Automatisation de la Configuration de Domaine {#2-domain-setup-automation}

Vous configurez un nouveau domaine ? Demandez à l'IA de créer le domaine, d'ajouter vos alias, de vérifier les enregistrements DNS, et de tester la configuration SMTP. Ce qui prend normalement 10 minutes de clics dans les tableaux de bord devient une seule conversation.

### 3. Gestion en Masse des Alias {#3-bulk-alias-management}

Besoin de créer 20 alias pour un nouveau projet ? Décrivez ce dont vous avez besoin et laissez l'IA gérer le travail répétitif. Elle peut créer des alias, définir des règles de redirection, et générer des mots de passe en une seule fois.
### 4. Surveillance des campagnes email {#4-email-campaign-monitoring}

Demandez à votre IA de vérifier les limites d’envoi, de lister les emails sortants récents, et de faire un rapport sur le statut de livraison. Utile pour surveiller la santé des emails transactionnels.

### 5. Synchronisation et nettoyage des contacts {#5-contact-sync-and-cleanup}

Utilisez les outils CardDAV pour lister tous les contacts, trouver les doublons, mettre à jour les informations obsolètes, ou créer en masse des contacts à partir d’un tableau que vous collez dans le chat. *(Nécessite les identifiants d’alias.)*

### 6. Gestion du calendrier {#6-calendar-management}

Créez des calendriers, ajoutez des événements, mettez à jour les horaires de réunion, et supprimez les événements annulés — tout cela par conversation. Les outils CalDAV supportent le CRUD complet sur les calendriers et les événements. *(Nécessite les identifiants d’alias.)*

### 7. Automatisation des scripts Sieve {#7-sieve-script-automation}

Les scripts Sieve sont puissants mais leur syntaxe est obscure. Demandez à votre IA d’écrire des scripts Sieve pour vous : « Filtrer tous les emails de <billing@example.com> dans un dossier Facturation » devient un script fonctionnel sans toucher à la spécification RFC 5228.

### 8. Intégration des membres de l’équipe {#8-team-onboarding}

Quand un nouveau membre rejoint l’équipe, demandez à l’IA de créer son alias, générer un mot de passe, lui envoyer un email de bienvenue avec ses identifiants, et l’ajouter comme membre du domaine. Une seule commande, quatre appels API.

### 9. Audit de sécurité {#9-security-auditing}

Demandez à votre IA de lister tous les domaines, vérifier le statut de vérification DNS, examiner les configurations d’alias, et identifier les domaines avec des enregistrements non vérifiés. Un contrôle de sécurité rapide en langage naturel.

### 10. Configuration du transfert d’email {#10-email-forwarding-setup}

Vous configurez le transfert d’email pour un nouveau domaine ? Demandez à l’IA de créer le domaine, ajouter les alias de transfert, chiffrer les enregistrements DNS, et vérifier que tout est configuré correctement.

### 11. Recherche et analyse dans la boîte de réception {#11-inbox-search-and-analysis}

Utilisez les outils de recherche de messages pour trouver des emails spécifiques : « Trouve tous les emails de <john@example.com> des 30 derniers jours qui ont des pièces jointes. » Les plus de 15 paramètres de recherche rendent cela puissant. *(Nécessite les identifiants d’alias.)*

### 12. Organisation des dossiers {#12-folder-organization}

Demandez à votre IA de créer une structure de dossiers pour un nouveau projet, déplacer des messages entre dossiers, ou nettoyer les anciens dossiers dont vous n’avez plus besoin. *(Nécessite les identifiants d’alias.)*

### 13. Rotation des mots de passe {#13-password-rotation}

Générez de nouveaux mots de passe d’alias selon un planning. Demandez à votre IA de générer un nouveau mot de passe pour chaque alias et de rapporter les nouvelles informations d’identification.

### 14. Chiffrement des enregistrements DNS {#14-dns-record-encryption}

Chiffrez vos enregistrements de transfert avant de les ajouter au DNS. L’outil `encryptRecord` gère cela sans authentification — utile pour des chiffrages rapides ponctuels.

### 15. Analyse des journaux de livraison {#15-delivery-log-analysis}

Téléchargez vos journaux de livraison d’emails et demandez à l’IA d’analyser les taux de rebond, d’identifier les destinataires problématiques, ou de suivre les temps de livraison.

### 16. Gestion multi-domaines {#16-multi-domain-management}

Si vous gérez plusieurs domaines, demandez à l’IA de vous fournir un rapport d’état : quels domaines sont vérifiés, lesquels ont des problèmes, combien d’alias chacun possède, et à quoi ressemblent les limites d’envoi.

### 17. Configuration du catch-all {#17-catch-all-configuration}

Configurez des mots de passe catch-all pour les domaines qui doivent recevoir des emails à n’importe quelle adresse. L’IA peut créer, lister, et gérer ces mots de passe pour vous.

### 18. Gestion des invitations de domaine {#18-domain-invite-management}

Invitez des membres de l’équipe à gérer les domaines, vérifiez les invitations en attente, et nettoyez celles expirées. Utile pour les organisations avec plusieurs administrateurs de domaine.

### 19. Test du stockage S3 {#19-s3-storage-testing}

Si vous utilisez un stockage S3 personnalisé pour les sauvegardes d’emails, demandez à l’IA de tester la connexion et de vérifier que tout fonctionne correctement.

### 20. Composition de brouillons d’email {#20-email-draft-composition}

Créez des brouillons d’emails dans votre boîte sans les envoyer. Utile pour préparer des emails à relire avant envoi, ou pour construire des modèles d’email. *(Nécessite les identifiants d’alias.)*


## Exemples de commandes {#example-prompts}

Voici des commandes que vous pouvez utiliser directement avec votre assistant IA :

**Envoyer un email :**

> « Envoie un email de <hello@mydomain.com> à <john@example.com> avec pour objet ‘Réunion demain’ et pour corps ‘Salut John, on est toujours bon pour 14h ?’ »
**Gestion de domaine :**

> "Listez tous mes domaines et dites-moi lesquels ont des enregistrements DNS non vérifiés."

**Création d'alias :**

> "Créez un nouvel alias <support@mydomain.com> qui transfère vers mon email personnel."

**Recherche dans la boîte de réception (nécessite les identifiants de l'alias) :**

> "Trouvez tous les emails non lus de la semaine dernière qui mentionnent 'facture'."

**Calendrier (nécessite les identifiants de l'alias) :**

> "Créez un calendrier appelé 'Travail' et ajoutez une réunion pour demain à 14h appelée 'Réunion d'équipe'."

**Scripts Sieve :**

> "Écrivez un script Sieve pour <info@mydomain.com> qui répond automatiquement aux emails par 'Merci de nous avoir contactés, nous vous répondrons sous 24 heures.'"

**Opérations en masse :**

> "Créez des alias pour sales@, support@, billing@, et info@ sur mydomain.com, tous redirigeant vers <team@mydomain.com>."

**Vérification de sécurité :**

> "Vérifiez le statut de vérification DNS et SMTP pour tous mes domaines et dites-moi si quelque chose nécessite une attention."

**Générer un mot de passe pour alias :**

> "Générez un mot de passe pour l'alias <user@example.com> afin que je puisse accéder à ma boîte de réception."


## Variables d'environnement {#environment-variables}

| Variable                       | Obligatoire | Par défaut                     | Description                                                                    |
| ------------------------------ | ----------- | ------------------------------ | ------------------------------------------------------------------------------ |
| `FORWARD_EMAIL_API_KEY`        | Oui         | —                              | Votre clé API Forward Email (utilisée comme nom d'utilisateur Basic auth pour les points d'API par clé) |
| `FORWARD_EMAIL_ALIAS_USER`     | Non         | —                              | Adresse email de l'alias pour les points d'accès à la boîte aux lettres (ex. `user@example.com`)            |
| `FORWARD_EMAIL_ALIAS_PASSWORD` | Non         | —                              | Mot de passe généré pour l'alias pour les points d'accès à la boîte aux lettres                                 |
| `FORWARD_EMAIL_API_URL`        | Non         | `https://api.forwardemail.net` | URL de base de l'API (pour auto-hébergement ou tests)                                      |


## Sécurité {#security}

Le serveur MCP s'exécute localement sur votre machine. Voici comment fonctionne la sécurité :

* **Vos identifiants restent locaux.** Votre clé API et vos identifiants d'alias sont lus depuis des variables d'environnement et utilisés pour authentifier les requêtes API via HTTP Basic auth. Ils ne sont jamais envoyés au modèle IA.
* **Transport stdio.** Le serveur communique avec le client IA via stdin/stdout. Aucun port réseau n'est ouvert.
* **Aucune conservation des données.** Le serveur est sans état. Il ne met pas en cache, ne journalise pas et ne stocke aucune donnée de vos emails.
* **Open source.** L'intégralité du code est disponible sur [GitHub](https://github.com/forwardemail/mcp-server). Vous pouvez auditer chaque ligne.


## Utilisation programmatique {#programmatic-usage}

Vous pouvez aussi utiliser le serveur comme une bibliothèque :

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

Le Forward Email MCP Server est [open-source sur GitHub](https://github.com/forwardemail/mcp-server) sous licence BUSL-1.1. Nous croyons en la transparence. Si vous trouvez un bug ou souhaitez une fonctionnalité, [ouvrez une issue](https://github.com/forwardemail/mcp-server/issues).
