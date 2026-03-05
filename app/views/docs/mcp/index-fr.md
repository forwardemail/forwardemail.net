# Serveur MCP Forward Email {#forward-email-mcp-server}

<img loading="lazy" src="/img/articles/mcp.webp" alt="Serveur MCP Forward Email" class="rounded-lg" />

<p class="lead mt-3">
  <strong>TL;DR:</strong> Notre <a href="https://github.com/forwardemail/mcp-server">serveur MCP open-source</a> permet aux assistants IA comme Claude, ChatGPT, Cursor et Windsurf de gérer vos e-mails, domaines, alias, contacts et calendriers via le langage naturel. Les 68 points d'API sont exposés en tant qu'outils MCP. Il s'exécute localement via <code>npx @forwardemail/mcp-server</code> — vos identifiants ne quittent jamais votre machine.
</p>

## Table des matières {#table-of-contents}

* [Qu'est-ce que MCP ?](#what-is-mcp)
* [Démarrage rapide](#quick-start)
  * [Obtenir une clé API](#get-an-api-key)
  * [Claude Desktop](#claude-desktop)
  * [Cursor](#cursor)
  * [Windsurf](#windsurf)
  * [Autres clients MCP](#other-mcp-clients)
* [Authentification](#authentication)
  * [Authentification par clé API](#api-key-auth)
  * [Authentification par alias](#alias-auth)
  * [Génération d'un mot de passe d'alias](#generating-an-alias-password)
* [Les 68 outils](#all-68-tools)
  * [Compte (clé API ou authentification par alias)](#account-api-key-or-alias-auth)
  * [Domaines (clé API)](#domains-api-key)
  * [Alias (clé API)](#aliases-api-key)
  * [E-mails — SMTP sortant (clé API ; l'envoi prend en charge les deux)](#emails--outbound-smtp-api-key-send-supports-both)
  * [Messages — IMAP (authentification par alias)](#messages--imap-alias-auth)
  * [Dossiers — IMAP (authentification par alias)](#folders--imap-alias-auth)
  * [Contacts — CardDAV (authentification par alias)](#contacts--carddav-alias-auth)
  * [Calendriers — CalDAV (authentification par alias)](#calendars--caldav-alias-auth)
  * [Événements de calendrier — CalDAV (authentification par alias)](#calendar-events--caldav-alias-auth)
  * [Scripts Sieve (clé API)](#sieve-scripts-api-key)
  * [Scripts Sieve (authentification par alias)](#sieve-scripts-alias-auth)
  * [Membres du domaine et invitations (clé API)](#domain-members-and-invites-api-key)
  * [Mots de passe fourre-tout (clé API)](#catch-all-passwords-api-key)
  * [Journaux (clé API)](#logs-api-key)
  * [Chiffrer (pas d'authentification)](#encrypt-no-auth)
* [20 cas d'utilisation réels](#20-real-world-use-cases)
* [Exemples d'invites](#example-prompts)
* [Variables d'environnement](#environment-variables)
* [Sécurité](#security)
* [Utilisation programmatique](#programmatic-usage)
* [Open Source](#open-source)


## Qu'est-ce que MCP ? {#what-is-mcp}

Le [Model Context Protocol](https://modelcontextprotocol.io) (MCP) est un standard ouvert créé par Anthropic qui permet aux modèles d'IA d'appeler des outils externes de manière sécurisée. Au lieu de copier-coller les réponses de l'API dans une fenêtre de chat, MCP donne au modèle un accès direct et structuré à vos services.

Notre serveur MCP enveloppe l'intégralité de l'[API Forward Email](/email-api) — chaque point d'accès, chaque paramètre — et les expose en tant qu'outils que tout client compatible MCP peut utiliser. Le serveur s'exécute localement sur votre machine en utilisant le transport stdio. Vos identifiants restent dans vos variables d'environnement et ne sont jamais envoyés au modèle d'IA.


## Démarrage rapide {#quick-start}

### Obtenir une clé API {#get-an-api-key}

1. Connectez-vous à votre [compte Forward Email](/my-account/domains).
2. Allez dans **Mon compte** → **Sécurité** → **Clés API**.
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
        "FORWARD_EMAIL_API_KEY": "votre-clé-api-ici",
        "FORWARD_EMAIL_ALIAS_USER": "vous@example.com",
        "FORWARD_EMAIL_ALIAS_PASSWORD": "votre-mot-de-passe-d'alias-généré"
      }
    }
  }
}
```

Redémarrez Claude Desktop. Vous devriez voir les outils Forward Email dans le sélecteur d'outils.

> **Remarque :** Les variables `FORWARD_EMAIL_ALIAS_USER` et `FORWARD_EMAIL_ALIAS_PASSWORD` sont facultatives mais requises pour les outils de boîte aux lettres (messages, dossiers, contacts, calendriers). Voir [Authentification](#authentication) pour plus de détails.

### Cursor {#cursor}

Ouvrez les paramètres de Cursor → MCP → Ajouter un serveur :

```json
{
  "mcpServers": {
    "forwardemail": {
      "command": "npx",
      "args": ["-y", "@forwardemail/mcp-server"],
      "env": {
        "FORWARD_EMAIL_API_KEY": "votre-clé-api-ici",
        "FORWARD_EMAIL_ALIAS_USER": "vous@example.com",
        "FORWARD_EMAIL_ALIAS_PASSWORD": "votre-mot-de-passe-d'alias-généré"
      }
    }
  }
}
```

### Windsurf {#windsurf}

Ouvrez les paramètres de Windsurf → MCP → Ajouter un serveur avec la même configuration que ci-dessus.

### Autres clients MCP {#other-mcp-clients}

Tout client prenant en charge le transport stdio MCP fonctionnera. La commande est :

```sh
FORWARD_EMAIL_API_KEY=votre-clé-api \
  FORWARD_EMAIL_ALIAS_USER=vous@example.com \
  FORWARD_EMAIL_ALIAS_PASSWORD=votre-mot-de-passe-d'alias-généré \
  npx @forwardemail/mcp-server
```


## Authentification {#authentication}

L'API Forward Email utilise l'**authentification HTTP Basic** avec deux types d'identifiants différents selon le point d'accès. Le serveur MCP gère cela automatiquement — il vous suffit de fournir les bons identifiants.

### Authentification par clé API {#api-key-auth}

La plupart des points d'accès de gestion (domaines, alias, e-mails sortants, journaux) utilisent votre **clé API** comme nom d'utilisateur d'authentification Basic avec un mot de passe vide.

C'est la même clé API que vous utilisez pour l'API REST. Définissez-la via la variable d'environnement `FORWARD_EMAIL_API_KEY`.

### Authentification par alias {#alias-auth}

Les points d'accès de boîte aux lettres (messages, dossiers, contacts, calendriers, scripts Sieve liés aux alias) utilisent les **identifiants d'alias** — l'adresse e-mail de l'alias comme nom d'utilisateur et un mot de passe généré comme mot de passe.

Ces points d'accès accèdent aux données par alias via les protocoles IMAP, CalDAV et CardDAV. Ils nécessitent l'e-mail de l'alias et un mot de passe généré, pas la clé API.

Vous pouvez fournir les identifiants d'alias de deux manières :

1. **Variables d'environnement** (recommandé pour l'alias par défaut) : Définissez `FORWARD_EMAIL_ALIAS_USER` et `FORWARD_EMAIL_ALIAS_PASSWORD`.
2. **Paramètres par appel d'outil** : Passez `alias_username` et `alias_password` comme arguments à tout outil d'authentification par alias. Ceux-ci remplacent les variables d'environnement, ce qui est utile lorsque vous travaillez avec plusieurs alias.

### Génération d'un mot de passe d'alias {#generating-an-alias-password}

Avant de pouvoir utiliser les outils d'authentification par alias, vous devez générer un mot de passe pour l'alias. Vous pouvez le faire avec l'outil `generateAliasPassword` ou via l'API :

```sh
curl -u "VOTRE_CLÉ_API:" \
  https://api.forwardemail.net/v1/domains/example.com/aliases/ALIAS_ID/generate-password \
  -X POST
```

La réponse inclut les champs `username` (e-mail de l'alias) et `password`. Utilisez-les comme identifiants d'alias.

> **Astuce :** Vous pouvez également demander à votre assistant IA : *"Générez un mot de passe pour l'utilisateur alias user@example.com sur le domaine example.com"* — il appellera l'outil `generateAliasPassword` et renverra les identifiants.

Le tableau ci-dessous résume la méthode d'authentification requise par chaque groupe d'outils :

| Groupe d'outils | Méthode d'authentification | Identifiants |
|---|---|---|
| Compte | Clé API **ou** authentification par alias | L'un ou l'autre |
| Domaines, Alias, Membres du domaine, Invitations, Mots de passe fourre-tout | Clé API | `FORWARD_EMAIL_API_KEY` |
| E-mails sortants (liste, obtenir, supprimer, limite) | Clé API | `FORWARD_EMAIL_API_KEY` |
| Envoyer un e-mail | Clé API **ou** authentification par alias | L'un ou l'autre |
| Messages (IMAP) | Authentification par alias | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Dossiers (IMAP) | Authentification par alias | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Contacts (CardDAV) | Authentification par alias | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Calendriers (CalDAV) | Authentification par alias | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Événements de calendrier (CalDAV) | Authentification par alias | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Scripts Sieve (portée du domaine) | Clé API | `FORWARD_EMAIL_API_KEY` |
| Scripts Sieve (portée de l'alias) | Authentification par alias | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Journaux | Clé API | `FORWARD_EMAIL_API_KEY` |
| Chiffrer | Aucun | Aucun identifiant nécessaire |


## Les 68 outils {#all-68-tools}

Chaque outil correspond directement à un point d'accès de l'[API Forward Email](/email-api). Les paramètres utilisent les mêmes noms que la documentation de l'API. La méthode d'authentification est indiquée dans l'en-tête de chaque section.

### Compte (clé API ou authentification par alias) {#account-api-key-or-alias-auth}

Avec l'authentification par clé API, ceux-ci renvoient les informations de votre compte utilisateur. Avec l'authentification par alias, ils renvoient les informations d'alias/boîte aux lettres, y compris le quota de stockage et les paramètres.

| Outil | Point d'accès API | Description |
|---|---|---|
| `getAccount` | `GET /v1/account` | Obtenir les informations de votre compte |
| `updateAccount` | `PUT /v1/account` | Mettre à jour les paramètres de votre compte |

### Domaines (clé API) {#domains-api-key}

| Outil | Point d'accès API | Description |
|---|---|---|
| `listDomains` | `GET /v1/domains` | Lister tous vos domaines |
| `createDomain` | `POST /v1/domains` | Ajouter un nouveau domaine |
| `getDomain` | `GET /v1/domains/:domain_id` | Obtenir les détails du domaine |
| `updateDomain` | `PUT /v1/domains/:domain_id` | Mettre à jour les paramètres du domaine |
| `deleteDomain` | `DELETE /v1/domains/:domain_id` | Supprimer un domaine |
| `verifyDomainRecords` | `GET /v1/domains/:domain_id/verify-records` | Vérifier les enregistrements DNS |
| `verifySmtpRecords` | `GET /v1/domains/:domain_id/verify-smtp` | Vérifier la configuration SMTP |
| `testS3Connection` | `POST /v1/domains/:domain_id/test-s3-connection` | Tester la connexion de stockage S3 personnalisée |

### Alias (clé API) {#aliases-api-key}

| Outil | Point d'accès API | Description |
|---|---|---|
| `listAliases` | `GET /v1/domains/:domain_id/aliases` | Lister les alias pour un domaine |
| `createAlias` | `POST /v1/domains/:domain_id/aliases` | Créer un nouvel alias |
| `getAlias` | `GET /v1/domains/:domain_id/aliases/:alias_id` | Obtenir les détails de l'alias |
| `updateAlias` | `PUT /v1/domains/:domain_id/aliases/:alias_id` | Mettre à jour un alias |
| `deleteAlias` | `DELETE /v1/domains/:domain_id/aliases/:alias_id` | Supprimer un alias |
| `generateAliasPassword` | `POST /v1/domains/:domain_id/aliases/:alias_id/generate-password` | Générer un mot de passe IMAP/SMTP pour l'authentification par alias |

### E-mails — SMTP sortant (clé API ; l'envoi prend en charge les deux) {#emails--outbound-smtp-api-key-send-supports-both}

| Outil | Point d'accès API | Authentification | Description |
|---|---|---|---|
| `sendEmail` | `POST /v1/emails` | Clé API ou authentification par alias | Envoyer un e-mail via SMTP |
| `listEmails` | `GET /v1/emails` | Clé API | Lister les e-mails sortants |
| `getEmail` | `GET /v1/emails/:id` | Clé API | Obtenir les détails et le statut de l'e-mail |
| `deleteEmail` | `DELETE /v1/emails/:id` | Clé API | Supprimer un e-mail en file d'attente |
| `getEmailLimit` | `GET /v1/emails/limit` | Clé API | Vérifier votre limite d'envoi |

L'outil `sendEmail` accepte `from`, `to`, `cc`, `bcc`, `subject`, `text`, `html` et `attachments`. C'est la même chose que le point d'accès `POST /v1/emails`.

### Messages — IMAP (authentification par alias) {#messages--imap-alias-auth}

> **Nécessite des identifiants d'alias.** Passez `alias_username` et `alias_password` ou définissez les variables d'environnement `FORWARD_EMAIL_ALIAS_USER` et `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Outil | Point d'accès API | Description |
|---|---|---|
| `listMessages` | `GET /v1/messages` | Lister et rechercher des messages dans une boîte aux lettres |
| `createMessage` | `POST /v1/messages` | Créer un brouillon ou télécharger un message |
| `getMessage` | `GET /v1/messages/:id` | Obtenir un message par ID |
| `updateMessage` | `PUT /v1/messages/:id` | Mettre à jour les drapeaux (lu, marqué, etc.) |
| `deleteMessage` | `DELETE /v1/messages/:id` | Supprimer un message |

L'outil `listMessages` prend en charge plus de 15 paramètres de recherche, y compris `subject`, `from`, `to`, `text`, `since`, `before`, `is_unread` et `has_attachment`. Consultez la [documentation de l'API](/email-api) pour la liste complète.

### Dossiers — IMAP (authentification par alias) {#folders--imap-alias-auth}

> **Nécessite des identifiants d'alias.** Passez `alias_username` et `alias_password` ou définissez les variables d'environnement `FORWARD_EMAIL_ALIAS_USER` et `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Outil | Point d'accès API | Description |
|---|---|---|
| `listFolders` | `GET /v1/folders` | Lister tous les dossiers de la boîte aux lettres |
| `createFolder` | `POST /v1/folders` | Créer un nouveau dossier |
| `getFolder` | `GET /v1/folders/:id` | Obtenir les détails du dossier |
| `updateFolder` | `PUT /v1/folders/:id` | Renommer un dossier |
| `deleteFolder` | `DELETE /v1/folders/:id` | Supprimer un dossier |

### Contacts — CardDAV (authentification par alias) {#contacts--carddav-alias-auth}

> **Nécessite des identifiants d'alias.** Passez `alias_username` et `alias_password` ou définissez les variables d'environnement `FORWARD_EMAIL_ALIAS_USER` et `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Outil | Point d'accès API | Description |
|---|---|---|
| `listContacts` | `GET /v1/contacts` | Lister tous les contacts |
| `createContact` | `POST /v1/contacts` | Créer un nouveau contact |
| `getContact` | `GET /v1/contacts/:id` | Obtenir les détails du contact |
| `updateContact` | `PUT /v1/contacts/:id` | Mettre à jour un contact |
| `deleteContact` | `DELETE /v1/contacts/:id` | Supprimer un contact |

### Calendriers — CalDAV (authentification par alias) {#calendars--caldav-alias-auth}

> **Nécessite des identifiants d'alias.** Passez `alias_username` et `alias_password` ou définissez les variables d'environnement `FORWARD_EMAIL_ALIAS_USER` et `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Outil | Point d'accès API | Description |
|---|---|---|
| `listCalendars` | `GET /v1/calendars` | Lister tous les calendriers |
| `createCalendar` | `POST /v1/calendars` | Créer un nouveau calendrier |
| `getCalendar` | `GET /v1/calendars/:id` | Obtenir les détails du calendrier |
| `updateCalendar` | `PUT /v1/calendars/:id` | Mettre à jour un calendrier |
| `deleteCalendar` | `DELETE /v1/calendars/:id` | Supprimer un calendrier |

### Événements de calendrier — CalDAV (authentification par alias) {#calendar-events--caldav-alias-auth}

> **Nécessite des identifiants d'alias.** Passez `alias_username` et `alias_password` ou définissez les variables d'environnement `FORWARD_EMAIL_ALIAS_USER` et `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Outil | Point d'accès API | Description |
|---|---|---|
| `listCalendarEvents` | `GET /v1/calendar-events` | Lister tous les événements |
| `createCalendarEvent` | `POST /v1/calendar-events` | Créer un nouvel événement |
| `getCalendarEvent` | `GET /v1/calendar-events/:id` | Obtenir les détails de l'événement |
| `updateCalendarEvent` | `PUT /v1/calendar-events/:id` | Mettre à jour un événement |
| `deleteCalendarEvent` | `DELETE /v1/calendar-events/:id` | Supprimer un événement |

### Scripts Sieve (clé API) {#sieve-scripts-api-key}

Ceux-ci utilisent des chemins d'accès à portée de domaine et s'authentifient avec votre clé API.

| Outil | Point d'accès API | Description |
|---|---|---|
| `listSieveScripts` | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve` | Lister les scripts pour un alias |
| `createSieveScript` | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve` | Créer un nouveau script |
| `getSieveScript` | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id` | Obtenir les détails du script |
| `updateSieveScript` | `PUT /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id` | Mettre à jour un script |
| `deleteSieveScript` | `DELETE /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id` | Supprimer un script |
| `activateSieveScript` | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id/activate` | Activer un script |

### Scripts Sieve (authentification par alias) {#sieve-scripts-alias-auth}

Ceux-ci utilisent l'authentification au niveau de l'alias. Utile pour l'automatisation par alias sans avoir besoin de la clé API.

> **Nécessite des identifiants d'alias.** Passez `alias_username` et `alias_password` ou définissez les variables d'environnement `FORWARD_EMAIL_ALIAS_USER` et `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Outil | Point d'accès API | Description |
|---|---|---|
| `listSieveScriptsAliasAuth` | `GET /v1/sieve-scripts` | Lister les scripts |
| `createSieveScriptAliasAuth` | `POST /v1/sieve-scripts` | Créer un script |
| `getSieveScriptAliasAuth` | `GET /v1/sieve-scripts/:script_id` | Obtenir les détails du script |
| `updateSieveScriptAliasAuth` | `PUT /v1/sieve-scripts/:script_id` | Mettre à jour un script |
| `deleteSieveScriptAliasAuth` | `DELETE /v1/sieve-scripts/:script_id` | Supprimer un script |
| `activateSieveScriptAliasAuth` | `POST /v1/sieve-scripts/:script_id/activate` | Activer un script |

### Membres du domaine et invitations (clé API) {#domain-members-and-invites-api-key}

| Outil | Point d'accès API | Description |
|---|---|---|
| `updateDomainMember` | `PUT /v1/domains/:domain_id/members/:member_id` | Changer le rôle d'un membre |
| `removeDomainMember` | `DELETE /v1/domains/:domain_id/members/:member_id` | Supprimer un membre |
| `acceptDomainInvite` | `GET /v1/domains/:domain_id/invites` | Accepter une invitation en attente |
| `createDomainInvite` | `POST /v1/domains/:domain_id/invites` | Inviter quelqu'un à un domaine |
| `removeDomainInvite` | `DELETE /v1/domains/:domain_id/invites` | Révoquer une invitation |

### Mots de passe fourre-tout (clé API) {#catch-all-passwords-api-key}

| Outil | Point d'accès API | Description |
|---|---|---|
| `listCatchAllPasswords` | `GET /v1/domains/:domain_id/catch-all-passwords` | Lister les mots de passe fourre-tout |
| `createCatchAllPassword` | `POST /v1/domains/:domain_id/catch-all-passwords` | Créer un mot de passe fourre-tout |
| `deleteCatchAllPassword` | `DELETE /v1/domains/:domain_id/catch-all-passwords/:token_id` | Supprimer un mot de passe fourre-tout |

### Journaux (clé API) {#logs-api-key}

| Outil | Point d'accès API | Description |
|---|---|---|
| `downloadLogs` | `GET /v1/logs/download` | Télécharger les journaux de livraison d'e-mails |

### Chiffrer (pas d'authentification) {#encrypt-no-auth}

| Outil | Point d'accès API | Description |
|---|---|---|
| `encryptRecord` | `POST /v1/encrypt` | Chiffrer un enregistrement DNS TXT |

Cet outil ne nécessite pas d'authentification. Il chiffre les enregistrements de redirection comme `forward-email=user@example.com` pour une utilisation dans les enregistrements DNS TXT.


## 20 cas d'utilisation réels {#20-real-world-use-cases}

Voici des façons pratiques d'utiliser le serveur MCP avec votre assistant IA :

### 1. Tri des e-mails {#1-email-triage}

Demandez à votre IA de scanner votre boîte de réception et de résumer les messages non lus. Elle peut signaler les e-mails urgents, les classer par expéditeur et rédiger des réponses — le tout par langage naturel. *(Nécessite des identifiants d'alias pour l'accès à la boîte de réception.)*

### 2. Automatisation de la configuration de domaine {#2-domain-setup-automation}

Vous configurez un nouveau domaine ? Demandez à l'IA de créer le domaine, d'ajouter vos alias, de vérifier les enregistrements DNS et de tester la configuration SMTP. Ce qui prend normalement 10 minutes à cliquer dans les tableaux de bord devient une seule conversation.

### 3. Gestion en masse des alias {#3-bulk-alias-management}

Besoin de créer 20 alias pour un nouveau projet ? Décrivez ce dont vous avez besoin et laissez l'IA gérer le travail répétitif. Elle peut créer des alias, définir des règles de redirection et générer des mots de passe en une seule fois.

### 4. Surveillance des campagnes d'e-mails {#4-email-campaign-monitoring}

Demandez à votre IA de vérifier les limites d'envoi, de lister les e-mails sortants récents et de rendre compte de l'état de livraison. Utile pour surveiller la santé des e-mails transactionnels.

### 5. Synchronisation et nettoyage des contacts {#5-contact-sync-and-cleanup}

Utilisez les outils CardDAV pour lister tous les contacts, trouver les doublons, mettre à jour les informations obsolètes ou créer en masse des contacts à partir d'une feuille de calcul que vous collez dans le chat. *(Nécessite des identifiants d'alias.)*

### 6. Gestion de calendrier {#6-calendar-management}

Créez des calendriers, ajoutez des événements, mettez à jour les heures de réunion et supprimez les événements annulés — le tout par conversation. Les outils CalDAV prennent en charge le CRUD complet sur les calendriers et les événements. *(Nécessite des identifiants d'alias.)*

### 7. Automatisation des scripts Sieve {#7-sieve-script-automation}

Les scripts Sieve sont puissants mais la syntaxe est arcanique. Demandez à votre IA de vous écrire des scripts Sieve : "Filtrer tous les e-mails de billing@example.com dans un dossier Facturation" devient un script fonctionnel sans toucher à la spécification RFC 5228.

### 8. Intégration d'équipe {#8-team-onboarding}

Lorsqu'un nouveau membre rejoint l'équipe, demandez à l'IA de créer son alias, de générer un mot de passe, de lui envoyer un e-mail de bienvenue avec ses identifiants et de l'ajouter en tant que membre du domaine. Une invite, quatre appels API.

### 9. Audit de sécurité {#9-security-auditing}

Demandez à votre IA de lister tous les domaines, de vérifier l'état de vérification DNS, de revoir les configurations d'alias et d'identifier les domaines avec des enregistrements non vérifiés. Un balayage de sécurité rapide en langage naturel.

### 10. Configuration de la redirection d'e-mails {#10-email-forwarding-setup}

Vous configurez la redirection d'e-mails pour un nouveau domaine ? Demandez à l'IA de créer le domaine, d'ajouter des alias de redirection, de chiffrer les enregistrements DNS et de vérifier que tout est configuré correctement.

### 11. Recherche et analyse de boîte de réception {#11-inbox-search-and-analysis}

Utilisez les outils de recherche de messages pour trouver des e-mails spécifiques : "Trouvez tous les e-mails non lus de john@example.com des 30 derniers jours qui ont des pièces jointes." Les plus de 15 paramètres de recherche rendent cela puissant. *(Nécessite des identifiants d'alias.)*

### 12. Organisation des dossiers {#12-folder-organization}

Demandez à votre IA de créer une structure de dossiers pour un nouveau projet, de déplacer des messages entre les dossiers ou de nettoyer les anciens dossiers dont vous n'avez plus besoin. *(Nécessite des identifiants d'alias.)*

### 13. Rotation des mots de passe {#13-password-rotation}

Générez de nouveaux mots de passe d'alias selon un calendrier. Demandez à votre IA de générer un nouveau mot de passe pour chaque alias et de signaler les nouveaux identifiants.

### 14. Chiffrement des enregistrements DNS {#14-dns-record-encryption}

Chiffrez vos enregistrements de redirection avant de les ajouter au DNS. L'outil `encryptRecord` gère cela sans authentification — utile pour les chiffrements ponctuels rapides.

### 15. Analyse des journaux de livraison {#15-delivery-log-analysis}

Téléchargez vos journaux de livraison d'e-mails et demandez à l'IA d'analyser les taux de rebond, d'identifier les destinataires problématiques ou de suivre les délais de livraison.

### 16. Gestion multi-domaines {#16-multi-domain-management}

Si vous gérez plusieurs domaines, demandez à l'IA de vous donner un rapport d'état : quels domaines sont vérifiés, lesquels ont des problèmes, combien d'alias chacun a, et à quoi ressemblent les limites d'envoi.

### 17. Configuration fourre-tout {#17-catch-all-configuration}

Configurez des mots de passe fourre-tout pour les domaines qui doivent recevoir des e-mails à n'importe quelle adresse. L'IA peut créer, lister et gérer ces mots de passe pour vous.

### 18. Gestion des invitations de domaine {#18-domain-invite-management}

Invitez les membres de l'équipe à gérer les domaines, vérifiez les invitations en attente et nettoyez celles qui ont expiré. Utile pour les organisations avec plusieurs administrateurs de domaine.

### 19. Test de stockage S3 {#19-s3-storage-testing}

Si vous utilisez un stockage S3 personnalisé pour les sauvegardes d'e-mails, demandez à l'IA de tester la connexion et de vérifier qu'elle fonctionne correctement.

### 20. Composition de brouillons d'e-mails {#20-email-draft-composition}

Créez des brouillons d'e-mails dans votre boîte aux lettres sans les envoyer. Utile pour préparer des e-mails qui nécessitent une révision avant l'envoi, ou pour créer des modèles d'e-mails. *(Nécessite des identifiants d'alias.)*


## Exemples d'invites {#example-prompts}

Voici des invites que vous pouvez utiliser directement avec votre assistant IA :

**Envoi d'e-mail :**
> "Envoyez un e-mail de hello@mydomain.com à john@example.com avec le sujet 'Réunion demain' et le corps 'Bonjour John, sommes-nous toujours d'accord pour 14h ?'"

**Gestion de domaine :**
> "Listez tous mes domaines et dites-moi lesquels ont des enregistrements DNS non vérifiés."

**Création d'alias :**
> "Créez un nouvel alias support@mydomain.com qui redirige vers mon e-mail personnel."

**Recherche de boîte de réception (nécessite des identifiants d'alias) :**
> "Trouvez tous les e-mails non lus de la semaine dernière qui mentionnent 'facture'."

**Calendrier (nécessite des identifiants d'alias) :**
> "Créez un calendrier appelé 'Travail' et ajoutez une réunion pour demain à 14h appelée 'Point d'équipe'."

**Scripts Sieve :**
> "Écrivez un script Sieve pour info@mydomain.com qui répond automatiquement aux e-mails avec 'Merci de nous avoir contactés, nous vous répondrons dans les 24 heures.'"

**Opérations en masse :**
> "Créez des alias pour sales@, support@, billing@ et info@ sur mydomain.com, tous redirigeant vers team@mydomain.com."

**Vérification de sécurité :**
> "Vérifiez l'état de vérification DNS et SMTP pour tous mes domaines et dites-moi si quelque chose nécessite une attention particulière."

**Générer un mot de passe d'alias :**
> "Générez un mot de passe pour l'alias user@example.com afin que je puisse accéder à ma boîte de réception."


## Variables d'environnement {#environment-variables}

| Variable | Requis | Par défaut | Description |
|---|---|---|---|
| `FORWARD_EMAIL_API_KEY` | Oui | — | Votre clé API Forward Email (utilisée comme nom d'utilisateur d'authentification Basic pour les points d'accès de clé API) |
| `FORWARD_EMAIL_ALIAS_USER` | Non | — | Adresse e-mail de l'alias pour les points d'accès de boîte aux lettres (par exemple `user@example.com`) |
| `FORWARD_EMAIL_ALIAS_PASSWORD` | Non | — | Mot de passe d'alias généré pour les points d'accès de boîte aux lettres |
| `FORWARD_EMAIL_API_URL` | Non | `https://api.forwardemail.net` | URL de base de l'API (pour l'auto-hébergement ou les tests) |


## Sécurité {#security}

Le serveur MCP s'exécute localement sur votre machine. Voici comment fonctionne la sécurité :

*   **Vos identifiants restent locaux.** Votre clé API et vos identifiants d'alias sont lus à partir des variables d'environnement et utilisés pour authentifier les requêtes API via l'authentification HTTP Basic. Ils ne sont jamais envoyés au modèle d'IA.
*   **Transport stdio.** Le serveur communique avec le client IA via stdin/stdout. Aucun port réseau n'est ouvert.
*   **Pas de stockage de données.** Le serveur est sans état. Il ne met pas en cache, n'enregistre pas et ne stocke aucune de vos données d'e-mail.
*   **Open source.** L'intégralité du code est sur [GitHub](https://github.com/forwardemail/mcp-server). Vous pouvez auditer chaque ligne.


## Utilisation programmatique {#programmatic-usage}

Vous pouvez également utiliser le serveur comme une bibliothèque :

```js
const { McpServer } = require('@forwardemail/mcp-server');

const server = new McpServer({
  apiKey: 'votre-clé-api',
  aliasUser: 'utilisateur@example.com',
  aliasPassword: 'mot-de-passe-alias-généré',
});

server.listen();
```


## Open Source {#open-source}

Le serveur MCP Forward Email est [open-source sur GitHub](https://github.com/forwardemail/mcp-server) sous la licence BUSL-1.1. Nous croyons en la transparence. Si vous trouvez un bug ou souhaitez une fonctionnalité, [ouvrez un problème](https://github.com/forwardemail/mcp-server/issues).

