# API de messagerie {#email-api}

## Table des matières {#table-of-contents}

* [Bibliothèques](#libraries)
* [URI de base](#base-uri)
* [Authentification](#authentication)
* [Erreurs](#errors)
* [Localisation](#localization)
* [Pagination](#pagination)
* [Journaux](#logs)
  * [Récupérer les journaux](#retrieve-logs)
* [Compte](#account)
  * [Créer un compte](#create-account)
  * [Récupérer le compte](#retrieve-account)
  * [Mettre à jour le compte](#update-account)
* [Contacts d'alias (CardDAV)](#alias-contacts-carddav)
  * [Liste des contacts](#list-contacts)
  * [Créer un contact](#create-contact)
  * [Récupérer le contact](#retrieve-contact)
  * [Mettre à jour les contacts](#update-contact)
  * [Supprimer le contact](#delete-contact)
* [Calendriers d'alias (CalDAV)](#alias-calendars-caldav)
  * [Liste des calendriers](#list-calendars)
  * [Créer un calendrier](#create-calendar)
  * [Récupérer le calendrier](#retrieve-calendar)
  * [Calendrier de mise à jour](#update-calendar)
  * [Supprimer le calendrier](#delete-calendar)
* [Messages d'alias (IMAP/POP3)](#alias-messages-imappop3)
  * [Lister et rechercher des messages](#list-and-search-for-messages)
  * [Créer un message](#create-message)
  * [Récupérer le message](#retrieve-message)
  * [Message de mise à jour](#update-message)
  * [Supprimer le message](#delete-message)
* [Dossiers d'alias (IMAP/POP3)](#alias-folders-imappop3)
  * [Liste des dossiers](#list-folders)
  * [Créer un dossier](#create-folder)
  * [Récupérer le dossier](#retrieve-folder)
  * [Mettre à jour le dossier](#update-folder)
  * [Supprimer le dossier](#delete-folder)
  * [Copier le dossier](#copy-folder)
* [Courriels sortants](#outbound-emails)
  * [Obtenir la limite des e-mails SMTP sortants](#get-outbound-smtp-email-limit)
  * [Lister les e-mails SMTP sortants](#list-outbound-smtp-emails)
  * [Créer un e-mail SMTP sortant](#create-outbound-smtp-email)
  * [Récupérer les e-mails SMTP sortants](#retrieve-outbound-smtp-email)
  * [Supprimer les e-mails SMTP sortants](#delete-outbound-smtp-email)
* [Domaines](#domains)
  * [Liste des domaines](#list-domains)
  * [Créer un domaine](#create-domain)
  * [Récupérer le domaine](#retrieve-domain)
  * [Vérifier les enregistrements de domaine](#verify-domain-records)
  * [Vérifier les enregistrements SMTP du domaine](#verify-domain-smtp-records)
  * [Répertorier les mots de passe fourre-tout à l'échelle du domaine](#list-domain-wide-catch-all-passwords)
  * [Créer un mot de passe fourre-tout à l'échelle du domaine](#create-domain-wide-catch-all-password)
  * [Supprimer le mot de passe fourre-tout à l'échelle du domaine](#remove-domain-wide-catch-all-password)
  * [Mettre à jour le domaine](#update-domain)
  * [Supprimer le domaine](#delete-domain)
* [Invitations](#invites)
  * [Accepter l'invitation du domaine](#accept-domain-invite)
  * [Créer une invitation de domaine](#create-domain-invite)
  * [Supprimer l'invitation de domaine](#remove-domain-invite)
* [Membres](#members)
  * [Mettre à jour le membre du domaine](#update-domain-member)
  * [Supprimer un membre du domaine](#remove-domain-member)
* [Alias](#aliases)
  * [Générer un mot de passe d'alias](#generate-an-alias-password)
  * [Lister les alias de domaine](#list-domain-aliases)
  * [Créer un nouvel alias de domaine](#create-new-domain-alias)
  * [Récupérer l'alias de domaine](#retrieve-domain-alias)
  * [Mettre à jour l'alias de domaine](#update-domain-alias)
  * [Supprimer l'alias de domaine](#delete-domain-alias)
* [Crypter](#encrypt)
  * [Crypter l'enregistrement TXT](#encrypt-txt-record)

## Bibliothèques {#libraries}

Nous n'avons pas encore publié de wrappers d'API, mais nous prévoyons de le faire prochainement. Envoyez un e-mail à <api@forwardemail.net> si vous souhaitez être informé de la sortie du wrapper d'API d'un langage de programmation spécifique. En attendant, vous pouvez utiliser les bibliothèques de requêtes HTTP recommandées dans votre application, ou simplement utiliser [boucle](https://stackoverflow.com/a/27442239/3586413) comme dans les exemples ci-dessous.

| Langue | Bibliothèque |
| ---------- | ---------------------------------------------------------------------- |
| Rubis | [Faraday](https://github.com/lostisland/faraday) |
| Python | [requests](https://github.com/psf/requests) |
| Java | [OkHttp](https://github.com/square/okhttp/) |
| PHP | [guzzle](https://github.com/guzzle/guzzle) |
| JavaScript | [superagent](https://github.com/ladjs/superagent) (nous sommes des mainteneurs) |
| Node.js | [superagent](https://github.com/ladjs/superagent) (nous sommes des mainteneurs) |
| Aller | [net/http](https://golang.org/pkg/net/http/) |
| .NET | [RestSharp](https://github.com/restsharp/RestSharp) |

## URI de base {#base-uri}

Le chemin URI de base HTTP actuel est : `BASE_URI`.

## Authentification {#authentication}

Tous les points de terminaison nécessitent que votre [clé API](https://forwardemail.net/my-account/security) soit défini comme valeur « nom d'utilisateur » de l'en-tête [Autorisation de base](https://en.wikipedia.org/wiki/Basic_access_authentication) de la requête (à l'exception de [Contacts d'alias](#alias-contacts), [Calendriers d'alias](#alias-calendars) et [Boîtes aux lettres d'alias](#alias-mailboxes) qui utilisent un [nom d'utilisateur et mot de passe d'alias générés](/faq#do-you-support-receiving-email-with-imap)).

Ne vous inquiétez pas, des exemples sont fournis ci-dessous si vous n'êtes pas sûr de ce que c'est.

## Erreurs {#errors}

Si des erreurs se produisent, le corps de la réponse de la requête API contiendra un message d’erreur détaillé.

| Code | Nom |
| ---- | --------------------- |
| 200 | OK |
| 400 | Mauvaise demande |
| 401 | Non autorisé |
| 403 | Interdit |
| 404 | Non trouvé |
| 429 | Trop de demandes |
| 500 | Erreur interne du serveur |
| 501 | Non mis en œuvre |
| 502 | Mauvaise passerelle |
| 503 | service non disponible |
| 504 | Délai d'expiration de la passerelle |

> \[!TIP]
> Si vous recevez un code d'état 5xx (ce qui ne devrait pas arriver), veuillez nous contacter à l'adresse <a href="mailto:api@forwardemail.net"><api@forwardemail.net></a> et nous vous aiderons à résoudre votre problème immédiatement.

## Localisation {#localization}

Notre service est traduit dans plus de 25 langues. Tous les messages de réponse API sont traduits dans la dernière langue détectée de l'utilisateur effectuant la requête API. Vous pouvez contourner ce problème en ajoutant un en-tête `Accept-Language` personnalisé. N'hésitez pas à l'essayer en utilisant le menu déroulant des langues en bas de cette page.

## Pagination {#pagination}

> \[!NOTE]
> À compter du 1er novembre 2024, les points de terminaison d'API pour [Liste des domaines](#list-domains) et [Lister les alias de domaine](#list-domain-aliases) utiliseront par défaut le nombre maximal de résultats par page `1000`. Si vous souhaitez activer ce comportement plus tôt, vous pouvez ajouter `?paginate=true` comme paramètre de chaîne de requête supplémentaire à l'URL de la requête du point de terminaison.

La pagination est prise en charge par tous les points de terminaison d'API qui répertorient les résultats.

Fournissez simplement les propriétés de chaîne de requête `page` (et éventuellement `limit`).

La propriété `page` doit être un nombre supérieur ou égal à `1`. Si vous indiquez `limit` (également un nombre), la valeur minimale est `10` et la valeur maximale est `50` (sauf indication contraire).

| Paramètres de la chaîne de requête | Requis | Taper | Description |
| --------------------- | -------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `page` | Non | Nombre | Page de résultats à renvoyer. Si non spécifié, la valeur de `page` sera `1`. Doit être un nombre supérieur ou égal à `1`. |
| `limit` | Non | Nombre | Nombre de résultats à renvoyer par page. La valeur par défaut est `10` si non spécifiée. Doit être supérieur ou égal à `1` et inférieur ou égal à `50`. |

Afin de déterminer si davantage de résultats sont disponibles ou non, nous fournissons ces en-têtes de réponse HTTP (que vous pouvez analyser afin de paginer par programmation) :

| En-tête de réponse HTTP | Exemple | Description |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `X-Page-Count` | `X-Page-Count: 3` | Le nombre total de pages disponibles. |
| `X-Page-Current` | `X-Page-Current: 1` | La page actuelle des résultats renvoyés (par exemple, basée sur le paramètre de chaîne de requête `page`). |
| `X-Page-Size` | `X-Page-Size: 10` | Le nombre total de résultats renvoyés dans la page (par exemple, basé sur le paramètre de chaîne de requête `limit` et les résultats réels renvoyés). |
| `X-Item-Count` | `X-Item-Count: 30` | Le nombre total d'éléments disponibles sur toutes les pages. |
| `Link` | `Link: <https://api.forwardemail.net/v1/emails?page=1>; rel="prev", <https://api.forwardemail.net/v1/emails?page=3>; rel="next", <https://api.forwardemail.net/v1/emails?page=3; rel="last", https://api.forwardemail.net/v1/emails?page=1; rel="first"` | Nous fournissons un en-tête de réponse HTTP `Link` que vous pouvez analyser comme illustré dans l'exemple. Il s'agit de [similar to GitHub](https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api#using-link-headers) (par exemple, toutes les valeurs ne seront pas fournies si elles ne sont pas pertinentes ou disponibles ; par exemple, `"next"` ne sera pas fourni s'il n'existe pas d'autre page). |

> Exemple de requête :

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/aliases?page=2&pagination=true \
  -u API_TOKEN:
```

## Journaux {#logs}

### Récupérer les journaux {#retrieve-logs}

Notre API vous permet de télécharger les journaux de votre compte par programmation. En soumettant une requête à ce point de terminaison, tous les journaux de votre compte seront traités et vous seront envoyés par e-mail sous forme de pièce jointe (fichier tableur compressé [Gzip](https://en.wikipedia.org/wiki/Gzip) et [CSV](https://en.wikipedia.org/wiki/Comma-separated_values)).

Cela vous permet de créer des tâches d'arrière-plan avec un [Tâche cron](https://en.wikipedia.org/wiki/Cron) ou d'utiliser notre [Logiciel de planification de tâches Node.js Bree](https://github.com/breejs/bree) pour recevoir les journaux à tout moment. Notez que ce point de terminaison est limité à `10` requêtes par jour.

La pièce jointe est la forme minuscule de `email-deliverability-logs-YYYY-MM-DD-h-mm-A-z.csv.gz` et l'e-mail contient un bref résumé des journaux récupérés. Vous pouvez également télécharger les journaux à tout moment depuis [Mon compte → Journaux](/my-account/logs).

> `GET /v1/logs/download`

| Paramètres de la chaîne de requête | Requis | Taper | Description |
| --------------------- | -------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `domain` | Non | Chaîne (FQDN) | Filtrez les journaux par domaine complet (« FQDN »). Si vous ne le fournissez pas, tous les journaux de tous les domaines seront récupérés. |
| `q` | Non | Chaîne | Recherchez des journaux par e-mail, domaine, nom d'alias, adresse IP ou date (format `M/Y`, `M/D/YY`, `M-D`, `M-D-YY` ou `M.D.YY`). |
| `bounce_category` | Non | Chaîne | Recherchez des journaux par catégorie de rebond spécifique (par exemple `blocklist`). |
| `response_code` | Non | Nombre | Recherchez des journaux par un code de réponse d'erreur spécifique (par exemple `421` ou `550`). |

> Exemple de requête :

```sh
curl BASE_URI/v1/logs/download \
  -u API_TOKEN:
```

> Exemple de tâche Cron (à minuit tous les jours) :

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download -u API_TOKEN: &>/dev/null
```

Notez que vous pouvez utiliser des services tels que [Crontab.guru](https://crontab.guru/) pour valider la syntaxe de votre expression de tâche cron.

> Exemple de tâche Cron (à minuit tous les jours **et avec les journaux du jour précédent**) :

Pour MacOS :

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download?q=`date -v-1d -u "+%-m/%-d/%y"` -u API_TOKEN: &>/dev/null
```

Pour Linux et Ubuntu :

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download?q=`date --date "-1 days" -u "+%-m/%-d/%y"` -u API_TOKEN: &>/dev/null
```

## Compte {#account}

### Créer un compte {#create-account}

> `POST /v1/account`

| Paramètre du corps | Requis | Taper | Description |
| -------------- | -------- | -------------- | ------------- |
| `email` | Oui | Chaîne (e-mail) | Adresse email |
| `password` | Oui | Chaîne | Mot de passe |

> Exemple de requête :

```sh
curl -X POST BASE_URI/v1/account \
  -u API_TOKEN: \
  -d "email=EMAIL"
```

### Récupérer le compte {#retrieve-account}

> `GET /v1/account`

> Exemple de requête :

```sh
curl BASE_URI/v1/account \
  -u API_TOKEN:
```

### Mettre à jour le compte {#update-account}

> `PUT /v1/account`

| Paramètre du corps | Requis | Taper | Description |
| -------------- | -------- | -------------- | -------------------- |
| `email` | Non | Chaîne (e-mail) | Adresse email |
| `given_name` | Non | Chaîne | Prénom |
| `family_name` | Non | Chaîne | Nom de famille |
| `avatar_url` | Non | Chaîne (URL) | Lien vers l'image de l'avatar |

> Exemple de requête :

```sh
curl -X PUT BASE_URI/v1/account \
  -u API_TOKEN: \
  -d "email=EMAIL"
```

## Contacts d'alias (CardDAV) {#alias-contacts-carddav}

> \[!NOTE]
> Contrairement aux autres points de terminaison d'API, ceux-ci nécessitent [Authentification](#authentication) : « username » égal au nom d'utilisateur de l'alias et « password » égal au mot de passe généré par l'alias comme en-têtes d'autorisation de base.

> \[!WARNING]
> Cette section relative aux points de terminaison est en cours de développement et sera publiée (espérons-le) en 2024. En attendant, veuillez utiliser un client IMAP disponible dans le menu déroulant « Applications » de la navigation de notre site web.

### Liste des contacts {#list-contacts}

> `GET /v1/contacts`

**À venir**

### Créer un contact {#create-contact}

> `POST /v1/contacts`

**À venir**

### Récupérer le contact {#retrieve-contact}

> `GET /v1/contacts/:id`

**À venir**

### Mettre à jour le contact {#update-contact}

> `PUT /v1/contacts/:id`

**À venir**

### Supprimer le contact {#delete-contact}

> `DELETE /v1/contacts/:id`

**À venir**

## Calendriers d'alias (CalDAV) {#alias-calendars-caldav}

> \[!NOTE]
> Contrairement aux autres points de terminaison d'API, ceux-ci nécessitent [Authentification](#authentication) : « username » égal au nom d'utilisateur de l'alias et « password » égal au mot de passe généré par l'alias comme en-têtes d'autorisation de base.

> \[!WARNING]
> Cette section relative aux points de terminaison est en cours de développement et sera publiée (espérons-le) en 2024. En attendant, veuillez utiliser un client IMAP disponible dans le menu déroulant « Applications » de la navigation de notre site web.

### Liste des calendriers {#list-calendars}

> `GET /v1/calendars`

**À venir**

### Créer un calendrier {#create-calendar}

> `POST /v1/calendars`

**À venir**

### Récupérer le calendrier {#retrieve-calendar}

> `GET /v1/calendars/:id`

**À venir**

### Mettre à jour le calendrier {#update-calendar}

> `PUT /v1/calendars/:id`

**À venir**

### Supprimer le calendrier {#delete-calendar}

> `DELETE /v1/calendars/:id`

**À venir**

## Messages d'alias (IMAP/POP3) {#alias-messages-imappop3}

> \[!NOTE]
> Contrairement aux autres points de terminaison d'API, ceux-ci nécessitent [Authentification](#authentication) : « username » égal au nom d'utilisateur de l'alias et « password » égal au mot de passe généré par l'alias comme en-têtes d'autorisation de base.

> \[!WARNING]
> Cette section relative aux points de terminaison est en cours de développement et sera publiée (espérons-le) en 2024. En attendant, veuillez utiliser un client IMAP disponible dans le menu déroulant « Applications » de la navigation de notre site web.

Veuillez vous assurer que vous avez suivi les instructions de configuration de votre domaine.

Ces instructions peuvent être trouvées dans notre section FAQ [Prenez-vous en charge la réception d'e-mails avec IMAP ?](/faq#do-you-support-receiving-email-with-imap).

### Lister et rechercher des messages {#list-and-search-for-messages}

> `GET /v1/messages`

**À venir**

### Créer un message {#create-message}

> \[!NOTE]
> Cette commande n'enverra **PAS** d'e-mail ; elle ajoutera simplement le message à votre boîte aux lettres (par exemple, similaire à la commande IMAP `APPEND`). Pour envoyer un e-mail, consultez la commande [Créer un e-mail SMTP sortant](#create-outbound-smtp-email) ci-dessous. Après avoir créé l'e-mail SMTP sortant, vous pouvez en ajouter une copie à la boîte aux lettres de votre alias via ce point de terminaison à des fins de stockage.

> `POST /v1/messages`

**À venir**

### Récupérer le message {#retrieve-message}

> `GET /v1/messages/:id`

**À venir**

### Message de mise à jour {#update-message}

> `PUT /v1/messages/:id`

**À venir**

### Supprimer le message {#delete-message}

> `DELETE /v1/messages:id`

**À venir**

## Dossiers d'alias (IMAP/POP3) {#alias-folders-imappop3}

> \[!TIP]
> Les points de terminaison de dossier dont le chemin d'accès est <code>/v1/folders/:path</code> sont interchangeables avec l'ID de dossier <code>:id</code>. Vous pouvez ainsi faire référence au dossier par sa valeur <code>path</code> ou <code>id</code>.

> \[!WARNING]
> Cette section relative aux points de terminaison est en cours de développement et sera publiée (espérons-le) en 2024. En attendant, veuillez utiliser un client IMAP disponible dans le menu déroulant « Applications » de la navigation de notre site web.

### Liste des dossiers {#list-folders}

> `GET /v1/folders`

**À venir**

### Créer le dossier {#create-folder}

> `POST /v1/folders`

**À venir**

### Récupérer le dossier {#retrieve-folder}

> `GET /v1/folders/:id`

**À venir**

### Mettre à jour le dossier {#update-folder}

> `PUT /v1/folders/:id`

**À venir**

### Supprimer le dossier {#delete-folder}

> `DELETE /v1/folders/:id`

**À venir**

### Copier le dossier {#copy-folder}

> `POST /v1/folders/:id/copy`

**À venir**

## E-mails sortants {#outbound-emails}

Veuillez vous assurer que vous avez suivi les instructions de configuration de votre domaine.

Ces instructions se trouvent dans [Mon compte → Domaines → Paramètres → Configuration SMTP sortante](/my-account/domains). Vous devez configurer DKIM, Return-Path et DMARC pour l'envoi de messages SMTP sortants avec votre domaine.

### Obtenir la limite d'e-mails SMTP sortants {#get-outbound-smtp-email-limit}

Il s'agit d'un point de terminaison simple qui renvoie un objet JSON contenant `count` et `limit` pour le nombre de messages SMTP sortants quotidiens par compte.

> `GET /v1/emails/limit`

> Exemple de requête :

```sh
curl BASE_URI/v1/emails/limit \
  -u API_TOKEN:
```

### Liste des e-mails SMTP sortants {#list-outbound-smtp-emails}

Notez que ce point de terminaison ne renvoie pas de valeurs de propriété pour `message`, `headers` ni `rejectedErrors` d'un e-mail.

Pour renvoyer ces propriétés et leurs valeurs, veuillez utiliser le point de terminaison [Récupérer l'e-mail](#retrieve-email) avec un identifiant de messagerie.

> `GET /v1/emails`

| Paramètres de la chaîne de requête | Requis | Taper | Description |
| --------------------- | -------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q` | Non | Chaîne (RegExp prise en charge) | Rechercher des e-mails par métadonnées |
| `domain` | Non | Chaîne (RegExp prise en charge) | Rechercher des e-mails par nom de domaine |
| `sort` | Non | Chaîne | Trier selon un champ spécifique (préfixer par un tiret simple `-` pour trier dans le sens inverse de ce champ). La valeur par défaut est `created_at` si elle n'est pas définie. |
| `page` | Non | Nombre | Voir [Pagination](#pagination) pour plus d'informations |
| `limit` | Non | Nombre | Voir [Pagination](#pagination) pour plus d'informations |

> Exemple de requête :

```sh
curl BASE_URI/v1/emails?limit=1 \
  -u API_TOKEN:
```

### Créer un e-mail SMTP sortant {#create-outbound-smtp-email}

Notre API de création d'e-mails s'inspire et exploite la configuration des options de message de Nodemailer. Veuillez vous référer à [Configuration des messages Nodemailer](https://nodemailer.com/message/) pour tous les paramètres de corps ci-dessous.

Notez qu'à l'exception de `envelope` et `dkim` (que nous définissons automatiquement), nous prenons en charge toutes les options Nodemailer. Pour des raisons de sécurité, nous définissons automatiquement les options `disableFileAccess` et `disableUrlAccess` sur `true`.

Vous devez soit transmettre l'option unique `raw` avec votre e-mail complet brut, y compris les en-têtes **ou** transmettre les options de paramètres de corps individuelles ci-dessous.

Ce point de terminaison d'API encodera automatiquement les émojis présents dans les en-têtes (par exemple, une ligne d'objet `Subject: 🤓 Hello` est automatiquement convertie en `Subject: =?UTF-8?Q?=F0=9F=A4=93?= Hello`). Notre objectif était de créer une API de messagerie extrêmement conviviale pour les développeurs et à l'épreuve des manipulations.

> `POST /v1/emails`

| Paramètre du corps | Requis | Taper | Description |
| ---------------- | -------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `from` | Non | Chaîne (e-mail) | L'adresse e-mail de l'expéditeur (doit exister en tant qu'alias du domaine). |
| `to` | Non | Chaîne ou tableau | Liste séparée par des virgules ou tableau de destinataires pour l'en-tête « À ». |
| `cc` | Non | Chaîne ou tableau | Liste séparée par des virgules ou tableau de destinataires pour l'en-tête « Cc ». |
| `bcc` | Non | Chaîne ou tableau | Liste séparée par des virgules ou tableau de destinataires pour l'en-tête « Cci ». |
| `subject` | Non | Chaîne | L'objet de l'e-mail. |
| `text` | Non | Chaîne ou tampon | La version en texte brut du message. |
| `html` | Non | Chaîne ou tampon | La version HTML du message. |
| `attachments` | Non | Tableau | Un tableau d'objets de pièce jointe (voir [Nodemailer's common fields](https://nodemailer.com/message/#common-fields)). |
| `sender` | Non | Chaîne | L'adresse e-mail pour l'en-tête « Expéditeur » (voir [Nodemailer's more advanced fields](https://nodemailer.com/message/#more-advanced-fields)). |
| `replyTo` | Non | Chaîne | L'adresse e-mail pour l'en-tête « Répondre à ». |
| `inReplyTo` | Non | Chaîne | L'ID du message auquel le message répond. |
| `references` | Non | Chaîne ou tableau | Liste séparée par des espaces ou un tableau d'ID de message. |
| `attachDataUrls` | Non | Booléen | Si `true` convertit alors `data:` images dans le contenu HTML du message en pièces jointes intégrées. |
| `watchHtml` | Non | Chaîne | Une version HTML spécifique à l'Apple Watch du message ([according to the Nodemailer docs](https://nodemailer.com/message/#content-options]), les montres les plus récentes ne nécessitent pas que cela soit défini). |
| `amp` | Non | Chaîne | Une version HTML spécifique à AMP4EMAIL du message (voir [Nodemailer's example](https://nodemailer.com/message/#amp-example)). |
| `icalEvent` | Non | Objet | Un événement iCalendar à utiliser comme contenu de message alternatif (voir [Nodemailer's calendar events](https://nodemailer.com/message/calendar-events/)). |
| `alternatives` | Non | Tableau | Un tableau de contenu de message alternatif (voir [Nodemailer's alternative content](https://nodemailer.com/message/alternatives/)). |
| `encoding` | Non | Chaîne | Codage pour le texte et les chaînes HTML (par défaut `"utf-8"`, mais prend également en charge les valeurs de codage `"hex"` et `"base64"`). |
| `raw` | Non | Chaîne ou tampon | Un message formaté RFC822 généré sur mesure à utiliser (au lieu de celui généré par Nodemailer – voir [Nodemailer's custom source](https://nodemailer.com/message/custom-source/)). |
| `textEncoding` | Non | Chaîne | Codage obligatoire pour les valeurs texte (`"quoted-printable"` ou `"base64"`). La valeur par défaut est la valeur la plus proche détectée (pour l'ASCII, utilisez `"quoted-printable"`). |
| `priority` | Non | Chaîne | Niveau de priorité de l'e-mail (peut être `"high"`, `"normal"` (par défaut) ou `"low"`). Notez que la valeur `"normal"` ne définit pas d'en-tête de priorité (il s'agit du comportement par défaut). Si la valeur `"high"` ou `"low"` est définie, les en-têtes `X-Priority`, `X-MSMail-Priority` et `Importance` sont [will be set accordingly](https://github.com/nodemailer/nodemailer/blob/19fce2dc4dcb83224acaf1cfc890d08126309594/lib/mailer/mail-message.js#L222-L240). |
| `headers` | Non | Objet ou tableau | Un objet ou un tableau de champs d'en-tête supplémentaires à définir (voir [Nodemailer's custom headers](https://nodemailer.com/message/custom-headers/)). |
| `messageId` | Non | Chaîne | Une valeur Message-ID facultative pour l'en-tête « Message-ID » (une valeur par défaut sera automatiquement créée si elle n'est pas définie – notez que la valeur doit être [adhere to the RFC2822 specification](https://stackoverflow.com/a/4031705)). |
| `date` | Non | Chaîne ou date | Une valeur de date facultative sera utilisée si l'en-tête Date est manquant après l'analyse. Dans le cas contraire, la chaîne UTC actuelle sera utilisée si elle n'est pas définie. L'en-tête de date ne peut pas être antérieur de plus de 30 jours à l'heure actuelle. |
| `list` | Non | Objet | Un objet facultatif d'en-têtes `List-*` (voir [Nodemailer's list headers](https://nodemailer.com/message/list-headers/)). |

> Exemple de requête :

```sh
curl -X POST BASE_URI/v1/emails \
  -u API_TOKEN: \
  -d "from=alias@DOMAIN_NAME" \
  -d "to=EMAIL" \
  -d "subject=test" \
  -d "text=test"
```

> Exemple de requête :

```sh
curl -X POST BASE_URI/v1/emails \
  -u API_TOKEN: \
  -d "raw=`cat file.eml`"
```

### Récupérer les e-mails SMTP sortants {#retrieve-outbound-smtp-email}

> `GET /v1/emails/:id`

> Exemple de requête :

```sh
curl BASE_URI/v1/emails/:id \
  -u API_TOKEN:
```

### Supprimer l'e-mail SMTP sortant {#delete-outbound-smtp-email}

La suppression d'un e-mail définira son statut sur `"rejected"` (et ne le traitera donc pas dans la file d'attente) si et seulement si son statut actuel est `"pending"`, `"queued"` ou `"deferred"`. Nous pouvons supprimer automatiquement les e-mails 30 jours après leur création et/ou leur envoi ; il est donc conseillé de conserver une copie des e-mails SMTP sortants dans votre client, votre base de données ou votre application. Vous pouvez référencer notre identifiant d'e-mail dans votre base de données si vous le souhaitez ; cette valeur est renvoyée par les points de terminaison [Créer un e-mail](#create-email) et [Récupérer l'e-mail](#retrieve-email).

> `DELETE /v1/emails/:id`

> Exemple de requête :

```sh
curl -X DELETE BASE_URI/v1/emails/:id \
  -u API_TOKEN:
```

## Domaines {#domains}

> \[!TIP]
> Les points de terminaison de domaine dont le nom de domaine est <code>/v1/domains/:domain_name</code> sont interchangeables avec l'ID de domaine <code>:domain_id</code>. Cela signifie que vous pouvez faire référence au domaine par sa valeur <code>name</code> ou <code>id</code>.

### Liste des domaines {#list-domains}

> \[!NOTE]
> À compter du 1er novembre 2024, les points de terminaison d'API pour [Liste des domaines](#list-domains) et [Lister les alias de domaine](#list-domain-aliases) utiliseront par défaut le nombre maximal de résultats par page `1000`. Si vous souhaitez activer ce comportement plus tôt, vous pouvez ajouter `?paginate=true` comme paramètre de chaîne de requête supplémentaire à l'URL de la requête du point de terminaison. Consultez [Pagination](#pagination) pour plus d'informations.

> `GET /v1/domains`

| Paramètres de la chaîne de requête | Requis | Taper | Description |
| --------------------- | -------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q` | Non | Chaîne (RegExp prise en charge) | Rechercher des domaines par nom |
| `name` | Non | Chaîne (RegExp prise en charge) | Rechercher des domaines par nom |
| `sort` | Non | Chaîne | Trier selon un champ spécifique (préfixer par un tiret simple `-` pour trier dans le sens inverse de ce champ). La valeur par défaut est `created_at` si elle n'est pas définie. |
| `page` | Non | Nombre | Voir [Pagination](#pagination) pour plus d'informations |
| `limit` | Non | Nombre | Voir [Pagination](#pagination) pour plus d'informations |

> Exemple de requête :

```sh
curl BASE_URI/v1/domains \
  -u API_TOKEN:
```

### Créer un domaine {#create-domain}

> `POST /v1/domains`

| Paramètre du corps | Requis | Taper | Description |
| ------------------------------ | -------- | --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `domain` | Oui | Chaîne (FQDN ou IP) | Nom de domaine complet (« FQDN ») ou adresse IP |
| `team_domain` | Non | Chaîne (ID de domaine ou nom de domaine ; FQDN) | Affecter automatiquement ce domaine à la même équipe d'un autre domaine. Cela signifie que tous les membres de ce domaine seront affectés à l'équipe, et `plan` sera automatiquement défini sur `team`. Vous pouvez définir `"none"` si nécessaire pour désactiver explicitement cette option, mais ce n'est pas indispensable. |
| `plan` | Non | Chaîne (énumérable) | Type de forfait (doit être `"free"`, `"enhanced_protection"` ou `"team"`, la valeur par défaut est `"free"` ou le forfait payant actuel de l'utilisateur s'il en possède un) |
| `catchall` | Non | Chaîne (adresses e-mail délimitées) ou booléen | Créez un alias fourre-tout par défaut, par défaut `true` (si `true` est utilisé, l'adresse e-mail de l'utilisateur de l'API sera utilisée comme destinataire, et si `false` est utilisé, aucun alias fourre-tout ne sera créé). Si une chaîne est transmise, il s'agit d'une liste délimitée d'adresses e-mail à utiliser comme destinataires (séparées par un saut de ligne, un espace et/ou une virgule). |
| `has_adult_content_protection` | Non | Booléen | S'il faut activer la protection du contenu pour adultes de Spam Scanner sur ce domaine |
| `has_phishing_protection` | Non | Booléen | S'il faut activer la protection anti-hameçonnage Spam Scanner sur ce domaine |
| `has_executable_protection` | Non | Booléen | S'il faut activer la protection exécutable du scanner anti-spam sur ce domaine |
| `has_virus_protection` | Non | Booléen | S'il faut activer la protection antivirus Spam Scanner sur ce domaine |
| `has_recipient_verification` | Non | Booléen | Valeur par défaut du domaine global pour savoir s'il faut exiger des destinataires d'alias qu'ils cliquent sur un lien de vérification de courrier électronique pour que les courriers électroniques soient transmis |
| `ignore_mx_check` | Non | Booléen | Indique s'il faut ignorer la vérification de l'enregistrement MX sur le domaine. Cette option s'adresse principalement aux utilisateurs disposant de règles de configuration d'échange MX avancées et souhaitant conserver leur échange MX existant et le transférer vers le nôtre. |
| `retention_days` | Non | Nombre | Nombre entier compris entre `0` et `30`, correspondant au nombre de jours de conservation des e-mails SMTP sortants après distribution réussie ou erreur définitive. La valeur par défaut est `0`, ce qui signifie que les e-mails SMTP sortants sont purgés et expurgés immédiatement pour votre sécurité. |
| `bounce_webhook` | Non | Chaîne (URL) ou booléen (faux) | L'URL du webhook `http://` ou `https://` de votre choix pour l'envoi des webhooks de rebond. Nous enverrons une requête `POST` à cette URL avec les informations sur les échecs SMTP sortants (par exemple, les échecs logiciels ou matériels – afin que vous puissiez gérer vos abonnés et vos e-mails sortants par programmation). |
| `max_quota_per_alias` | Non | Chaîne | Quota de stockage maximal pour les alias sur ce nom de domaine. Saisissez une valeur telle que « 1 Go » qui sera analysée par [bytes](https://github.com/visionmedia/bytes.js). |

> Exemple de requête :

```sh
curl -X POST BASE_URI/v1/domains \
  -u API_TOKEN: \
  -d domain=DOMAIN_NAME \
  -d plan=free
```

### Récupérer le domaine {#retrieve-domain}

> `GET /v1/domains/DOMAIN_NAME`

> Exemple de requête :

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME \
  -u API_TOKEN:
```

### Vérifier les enregistrements de domaine {#verify-domain-records}

> `GET /v1/domains/DOMAIN_NAME/verify-records`

> Exemple de requête :

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/verify-records \
  -u API_TOKEN:
```

### Vérifier les enregistrements SMTP du domaine {#verify-domain-smtp-records}

> `GET /v1/domains/DOMAIN_NAME/verify-smtp`

> Exemple de requête :

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/verify-smtp \
  -u API_TOKEN:
```

### Liste des mots de passe fourre-tout à l'échelle du domaine {#list-domain-wide-catch-all-passwords}

> `GET /v1/domains/DOMAIN_NAME/catch-all-passwords`

> Exemple de requête :

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/catch-all-passwords \
  -u API_TOKEN:
```

### Créer un mot de passe fourre-tout à l'échelle du domaine {#create-domain-wide-catch-all-password}

> `POST /v1/domains/DOMAIN_NAME/catch-all-passwords`

| Paramètre du corps | Requis | Taper | Description |
| -------------- | -------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `new_password` | Non | Chaîne | Votre nouveau mot de passe personnalisé à utiliser comme mot de passe fourre-tout pour l'ensemble du domaine. Vous pouvez laisser ce champ vide ou l'omettre complètement dans le corps de votre requête API si vous souhaitez obtenir un mot de passe fort et généré aléatoirement. |
| `description` | Non | Chaîne | Description à des fins d'organisation uniquement. |

> Exemple de requête :

```sh
curl BASE_URL/v1/domains/DOMAIN_NAME/catch-all-passwords \
  -u API_TOKEN:
```

### Supprimer le mot de passe fourre-tout à l'échelle du domaine {#remove-domain-wide-catch-all-password}

> `DELETE /v1/domains/DOMAIN_NAME/catch-all-passwords/:token_id`

> Exemple de requête :

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/catch-all-passwords/:token_id \
  -u API_TOKEN:
```

### Mettre à jour le domaine {#update-domain}

> `PUT /v1/domains/DOMAIN_NAME`

| Paramètre du corps | Requis | Taper | Description |
| ------------------------------ | -------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `smtp_port` | Non | Chaîne ou nombre | Port personnalisé à configurer pour le transfert SMTP (la valeur par défaut est `"25"`) |
| `has_adult_content_protection` | Non | Booléen | S'il faut activer la protection du contenu pour adultes de Spam Scanner sur ce domaine |
| `has_phishing_protection` | Non | Booléen | S'il faut activer la protection anti-hameçonnage Spam Scanner sur ce domaine |
| `has_executable_protection` | Non | Booléen | S'il faut activer la protection exécutable du scanner anti-spam sur ce domaine |
| `has_virus_protection` | Non | Booléen | S'il faut activer la protection antivirus Spam Scanner sur ce domaine |
| `has_recipient_verification` | Non | Booléen | Valeur par défaut du domaine global pour savoir s'il faut exiger des destinataires d'alias qu'ils cliquent sur un lien de vérification de courrier électronique pour que les courriers électroniques soient transmis |
| `ignore_mx_check` | Non | Booléen | Indique s'il faut ignorer la vérification de l'enregistrement MX sur le domaine. Cette option s'adresse principalement aux utilisateurs disposant de règles de configuration d'échange MX avancées et souhaitant conserver leur échange MX existant et le transférer vers le nôtre. |
| `retention_days` | Non | Nombre | Nombre entier compris entre `0` et `30`, correspondant au nombre de jours de conservation des e-mails SMTP sortants après distribution réussie ou erreur définitive. La valeur par défaut est `0`, ce qui signifie que les e-mails SMTP sortants sont purgés et expurgés immédiatement pour votre sécurité. |
| `bounce_webhook` | Non | Chaîne (URL) ou booléen (faux) | L'URL du webhook `http://` ou `https://` de votre choix pour l'envoi des webhooks de rebond. Nous enverrons une requête `POST` à cette URL avec les informations sur les échecs SMTP sortants (par exemple, les échecs logiciels ou matériels – afin que vous puissiez gérer vos abonnés et vos e-mails sortants par programmation). |
| `max_quota_per_alias` | Non | Chaîne | Quota de stockage maximal pour les alias sur ce nom de domaine. Saisissez une valeur telle que « 1 Go » qui sera analysée par [bytes](https://github.com/visionmedia/bytes.js). |

> Exemple de requête :

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME \
  -u API_TOKEN:
```

### Supprimer le domaine {#delete-domain}

> `DELETE /v1/domains/:domain_name`

> Exemple de requête :

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name \
  -u API_TOKEN:
```

## invite {#invites}

### Accepter l'invitation de domaine {#accept-domain-invite}

> `GET /v1/domains/:domain_name/invites`

> Exemple de requête :

```sh
curl BASE_URI/v1/domains/:domain_name/invites \
  -u API_TOKEN:
```

### Créer une invitation de domaine {#create-domain-invite}

> `POST /v1/domains/DOMAIN_NAME/invites`

| Paramètre du corps | Requis | Taper | Description |
| -------------- | -------- | ------------------- | ----------------------------------------------------------------------------------------- |
| `email` | Oui | Chaîne (e-mail) | Adresse e-mail pour inviter à la liste des membres du domaine |
| `group` | Oui | Chaîne (énumérable) | Groupe pour ajouter l'utilisateur à l'appartenance au domaine avec (peut être l'un des `"admin"` ou `"user"`) |

> Exemple de requête :

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/invites \
  -u API_TOKEN: \
  -d "email=EMAIL" \
  -d group=admin
```

> \[!IMPORTANT]
> Si l'utilisateur invité est déjà membre d'un autre domaine dont l'administrateur l'invite est membre, l'invitation sera automatiquement acceptée et aucun e-mail ne sera envoyé.

### Supprimer l'invitation de domaine {#remove-domain-invite}

> `DELETE /v1/domains/:domain_name/invites`

| Paramètre du corps | Requis | Taper | Description |
| -------------- | -------- | -------------- | ------------------------------------------------ |
| `email` | Oui | Chaîne (e-mail) | Adresse e-mail à supprimer de la liste des membres du domaine |

> Exemple de requête :

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/invites \
  -u API_TOKEN:
```

## Membres {#members}

### Mettre à jour le membre du domaine {#update-domain-member}

> `PUT /v1/domains/DOMAIN_NAME/members/MEMBER_ID`

| Paramètre du corps | Requis | Taper | Description |
| -------------- | -------- | ------------------- | -------------------------------------------------------------------------------------------- |
| `group` | Oui | Chaîne (énumérable) | Groupe pour mettre à jour l'utilisateur avec l'appartenance au domaine (peut être l'un des `"admin"` ou `"user"`) |

> Exemple de requête :

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME/members/MEMBER_ID \
  -u API_TOKEN:
```

### Supprimer le membre du domaine {#remove-domain-member}

> `DELETE /v1/domains/:domain_name/members/:member_id`

> Exemple de requête :

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/members/:member_id \
  -u API_TOKEN:
```

## Alias {#aliases}

### Générer un mot de passe d'alias {#generate-an-alias-password}

Notez que si vous n'envoyez pas d'instructions par e-mail, le nom d'utilisateur et le mot de passe figureront dans le corps de la réponse JSON d'une demande réussie au format `{ username: 'alias@yourdomain.com', password: 'some-generated-password' }`.

> `POST /v1/domains/DOMAIN_NAME/aliases/ALIAS_ID/generate-password`

| Paramètre du corps | Requis | Taper | Description |
| ---------------------- | -------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `new_password` | Non | Chaîne | Votre nouveau mot de passe personnalisé à utiliser pour l'alias. Vous pouvez laisser ce champ vide ou l'omettre complètement dans le corps de votre requête API si vous souhaitez obtenir un mot de passe fort et généré aléatoirement. |
| `password` | Non | Chaîne | Mot de passe existant pour l'alias pour modifier le mot de passe sans supprimer le stockage de boîte aux lettres IMAP existant (voir l'option `is_override` ci-dessous si vous n'avez plus le mot de passe existant). |
| `is_override` | Non | Booléen | **À UTILISER AVEC PRÉCAUTION** : Cette action remplacera complètement le mot de passe et la base de données de l'alias existant, supprimera définitivement le stockage IMAP existant et réinitialisera complètement la base de données de messagerie SQLite de l'alias. Si possible, effectuez une sauvegarde si vous possédez déjà une boîte aux lettres associée à cet alias. |
| `emailed_instructions` | Non | Chaîne | Adresse e-mail à laquelle envoyer le mot de passe de l'alias et les instructions de configuration. |

> Exemple de requête :

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/aliases/ALIAS_ID/generate-password \
  -u API_TOKEN:
```

### Liste des alias de domaine {#list-domain-aliases}

> \[!NOTE]
> À compter du 1er novembre 2024, les points de terminaison d'API pour [Liste des domaines](#list-domains) et [Lister les alias de domaine](#list-domain-aliases) utiliseront par défaut le nombre maximal de résultats par page `1000`. Si vous souhaitez activer ce comportement plus tôt, vous pouvez ajouter `?paginate=true` comme paramètre de chaîne de requête supplémentaire à l'URL de la requête du point de terminaison. Consultez [Pagination](#pagination) pour plus d'informations.

> `GET /v1/domains/DOMAIN_NAME/aliases`

| Paramètres de la chaîne de requête | Requis | Taper | Description |
| --------------------- | -------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q` | Non | Chaîne (RegExp prise en charge) | Rechercher des alias dans un domaine par nom, libellé ou destinataire |
| `name` | Non | Chaîne (RegExp prise en charge) | Rechercher des alias dans un domaine par nom |
| `recipient` | Non | Chaîne (RegExp prise en charge) | Rechercher des alias dans un domaine par destinataire |
| `sort` | Non | Chaîne | Trier selon un champ spécifique (préfixer par un tiret simple `-` pour trier dans le sens inverse de ce champ). La valeur par défaut est `created_at` si elle n'est pas définie. |
| `page` | Non | Nombre | Voir [Pagination](#pagination) pour plus d'informations |
| `limit` | Non | Nombre | Voir [Pagination](#pagination) pour plus d'informations |

> Exemple de requête :

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/aliases?pagination=true \
  -u API_TOKEN:
```

### Créer un nouvel alias de domaine {#create-new-domain-alias}

> `POST /v1/domains/DOMAIN_NAME/aliases`

| Paramètre du corps | Requis | Taper | Description |
| ------------------------------- | -------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name` | Non | Chaîne | Nom d'alias (s'il n'est pas fourni ou s'il est vide, un alias aléatoire est généré) |
| `recipients` | Non | Chaîne ou tableau | Liste des destinataires (doit être une chaîne ou un tableau d'adresses e-mail valides, de noms de domaine complets (« FQDN »), d'adresses IP et/ou d'URL de webhook séparés par des sauts de ligne/espaces/virgules – et si elle n'est pas fournie ou s'il s'agit d'un tableau vide, l'e-mail de l'utilisateur effectuant la demande d'API sera défini comme destinataire) |
| `description` | Non | Chaîne | Description de l'alias |
| `labels` | Non | Chaîne ou tableau | Liste d'étiquettes (doit être séparée par un saut de ligne/un espace/une virgule, une chaîne ou un tableau) |
| `has_recipient_verification` | Non | Booléen | Exiger des destinataires qu'ils cliquent sur un lien de vérification par e-mail pour que les e-mails soient transmis (par défaut, le paramètre du domaine s'il n'est pas explicitement défini dans le corps de la demande) |
| `is_enabled` | Non | Booléen | Activer ou désactiver cet alias (si désactivé, les e-mails ne seront acheminés nulle part, mais renverront des codes de réussite). Si une valeur est transmise, elle est convertie en booléen via [boolean](https://github.com/thenativeweb/boolean#quick-start). |
| `error_code_if_disabled` | Non | Numéro (soit `250`, `421` ou `550`) | Les e-mails entrants vers cet alias seront rejetés si `is_enabled` est `false` avec soit `250` (livraison discrète nulle part, par exemple trou noir ou `/dev/null`), `421` (rejet souple ; et réessayer jusqu'à environ 5 jours) ou `550` échec permanent et rejet. La valeur par défaut est `250`. |
| `has_imap` | Non | Booléen | Activation ou désactivation du stockage IMAP pour cet alias (si désactivé, les e-mails entrants ne seront pas stockés dans [IMAP storage](/blog/docs/best-quantum-safe-encrypted-email-service). Si une valeur est transmise, elle est convertie en booléen via [boolean](https://github.com/thenativeweb/boolean#quick-start)). |
| `has_pgp` | Non | Booléen | S'il faut activer ou désactiver [OpenPGP encryption](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd) pour [IMAP/POP3/CalDAV/CardDAV encrypted email storage](/blog/docs/best-quantum-safe-encrypted-email-service) en utilisant l'alias `public_key`. |
| `public_key` | Non | Chaîne | Clé publique OpenPGP au format ASCII Armor ([click here to view an example](/.well-known/openpgpkey/hu/mxqp8ogw4jfq83a58pn1wy1ccc1cx3f5.txt) ; par exemple, clé GPG pour `support@forwardemail.net`). Ceci s'applique uniquement si `has_pgp` est défini sur `true`. [Learn more about end-to-end encryption in our FAQ](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd). |
| `max_quota` | Non | Chaîne | Quota de stockage maximal pour cet alias. Laissez ce champ vide pour réinitialiser le quota maximal actuel du domaine ou saisissez une valeur telle que « 1 Go », qui sera analysée par [bytes](https://github.com/visionmedia/bytes.js). Cette valeur ne peut être modifiée que par les administrateurs du domaine. |
| `vacation_responder_is_enabled` | Non | Booléen | S'il faut activer ou désactiver un répondeur automatique de vacances. |
| `vacation_responder_start_date` | Non | Chaîne | Date de début du répondeur de vacances (si activé et qu'aucune date de début n'est définie ici, il est alors considéré comme démarré). Nous prenons en charge les formats de date tels que `MM/DD/YYYY`, `YYYY-MM-DD` et d'autres formats de date via l'analyse intelligente avec `dayjs`. |
| `vacation_responder_end_date` | Non | Chaîne | Date de fin du répondeur de vacances (si cette option est activée et qu'aucune date de fin n'est définie ici, le répondeur considère qu'il ne se termine jamais et répond indéfiniment). Nous prenons en charge les formats de date tels que `MM/DD/YYYY`, `YYYY-MM-DD` et d'autres formats de date via l'analyse intelligente avec `dayjs`. |
| `vacation_responder_subject` | Non | Chaîne | Objet en texte clair pour le répondeur d'absence, par exemple « Absent du bureau ». Nous utilisons `striptags` pour supprimer tout le code HTML ici. |
| `vacation_responder_message` | Non | Chaîne | Message en texte clair pour le répondeur en cas d'absence, par exemple : « Je serai absent du bureau jusqu'en février. » Nous utilisons `striptags` pour supprimer tout le code HTML ici. |

> Exemple de requête :

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/aliases \
  -u API_TOKEN:
```

### Récupérer l'alias de domaine {#retrieve-domain-alias}

Vous pouvez récupérer un alias de domaine par sa valeur `id` ou `name`.

> `GET /v1/domains/:domain_name/aliases/:alias_id`

> Exemple de requête :

```sh
curl BASE_URI/v1/domains/:domain_name/aliases/:alias_id \
  -u API_TOKEN:
```

> `GET /v1/domains/:domain_name/aliases/:alias_name`

> Exemple de requête :

```sh
curl BASE_URI/v1/domains/:domain_name/aliases/:alias_name \
  -u API_TOKEN:
```

### Mettre à jour l'alias de domaine {#update-domain-alias}

> `PUT /v1/domains/DOMAIN_NAME/aliases/ALIAS_ID`

| Paramètre du corps | Requis | Taper | Description |
| ------------------------------- | -------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name` | Non | Chaîne | Nom d'alias |
| `recipients` | Non | Chaîne ou tableau | Liste des destinataires (doit être une chaîne ou un tableau d'adresses e-mail valides, de noms de domaine complets (« FQDN »), d'adresses IP et/ou d'URL de webhook séparés par un saut de ligne/un espace/une virgule) |
| `description` | Non | Chaîne | Description de l'alias |
| `labels` | Non | Chaîne ou tableau | Liste d'étiquettes (doit être séparée par un saut de ligne/un espace/une virgule, une chaîne ou un tableau) |
| `has_recipient_verification` | Non | Booléen | Exiger des destinataires qu'ils cliquent sur un lien de vérification par e-mail pour que les e-mails soient transmis (par défaut, le paramètre du domaine s'il n'est pas explicitement défini dans le corps de la demande) |
| `is_enabled` | Non | Booléen | Activer ou désactiver cet alias (si désactivé, les e-mails ne seront acheminés nulle part, mais renverront des codes de réussite). Si une valeur est transmise, elle est convertie en booléen via [boolean](https://github.com/thenativeweb/boolean#quick-start). |
| `error_code_if_disabled` | Non | Numéro (soit `250`, `421` ou `550`) | Les e-mails entrants vers cet alias seront rejetés si `is_enabled` est `false` avec soit `250` (livraison discrète nulle part, par exemple trou noir ou `/dev/null`), `421` (rejet souple ; et réessayer jusqu'à environ 5 jours) ou `550` échec permanent et rejet. La valeur par défaut est `250`. |
| `has_imap` | Non | Booléen | Activation ou désactivation du stockage IMAP pour cet alias (si désactivé, les e-mails entrants ne seront pas stockés dans [IMAP storage](/blog/docs/best-quantum-safe-encrypted-email-service). Si une valeur est transmise, elle est convertie en booléen via [boolean](https://github.com/thenativeweb/boolean#quick-start)). |
| `has_pgp` | Non | Booléen | S'il faut activer ou désactiver [OpenPGP encryption](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd) pour [IMAP/POP3/CalDAV/CardDAV encrypted email storage](/blog/docs/best-quantum-safe-encrypted-email-service) en utilisant l'alias `public_key`. |
| `public_key` | Non | Chaîne | Clé publique OpenPGP au format ASCII Armor ([click here to view an example](/.well-known/openpgpkey/hu/mxqp8ogw4jfq83a58pn1wy1ccc1cx3f5.txt) ; par exemple, clé GPG pour `support@forwardemail.net`). Ceci s'applique uniquement si `has_pgp` est défini sur `true`. [Learn more about end-to-end encryption in our FAQ](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd). |
| `max_quota` | Non | Chaîne | Quota de stockage maximal pour cet alias. Laissez ce champ vide pour réinitialiser le quota maximal actuel du domaine ou saisissez une valeur telle que « 1 Go », qui sera analysée par [bytes](https://github.com/visionmedia/bytes.js). Cette valeur ne peut être modifiée que par les administrateurs du domaine. |
| `vacation_responder_is_enabled` | Non | Booléen | S'il faut activer ou désactiver un répondeur automatique de vacances. |
| `vacation_responder_start_date` | Non | Chaîne | Date de début du répondeur de vacances (si activé et qu'aucune date de début n'est définie ici, il est alors considéré comme démarré). Nous prenons en charge les formats de date tels que `MM/DD/YYYY`, `YYYY-MM-DD` et d'autres formats de date via l'analyse intelligente avec `dayjs`. |
| `vacation_responder_end_date` | Non | Chaîne | Date de fin du répondeur de vacances (si cette option est activée et qu'aucune date de fin n'est définie ici, le répondeur considère qu'il ne se termine jamais et répond indéfiniment). Nous prenons en charge les formats de date tels que `MM/DD/YYYY`, `YYYY-MM-DD` et d'autres formats de date via l'analyse intelligente avec `dayjs`. |
| `vacation_responder_subject` | Non | Chaîne | Objet en texte clair pour le répondeur d'absence, par exemple « Absent du bureau ». Nous utilisons `striptags` pour supprimer tout le code HTML ici. |
| `vacation_responder_message` | Non | Chaîne | Message en texte clair pour le répondeur en cas d'absence, par exemple : « Je serai absent du bureau jusqu'en février. » Nous utilisons `striptags` pour supprimer tout le code HTML ici. |

> Exemple de requête :

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME/aliases/ALIAS_ID \
  -u API_TOKEN:
```

### Supprimer l'alias de domaine {#delete-domain-alias}

> `DELETE /v1/domains/:domain_name/aliases/:alias_id`

> Exemple de requête :

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/aliases/:alias_id \
  -u API_TOKEN:
```

## Chiffrer {#encrypt}

Nous vous permettons de chiffrer vos enregistrements gratuitement, même avec l'offre gratuite. La confidentialité ne devrait pas être une fonctionnalité, mais être intégrée à tous les aspects d'un produit. Suite à une forte demande pour [Discussion sur les guides de confidentialité](https://discuss.privacyguides.net/t/forward-email-email-provider/13370) et [nos problèmes GitHub](https://github.com/forwardemail/forwardemail.net/issues/254), nous avons ajouté cette fonctionnalité.

### Chiffrer l'enregistrement TXT {#encrypt-txt-record}

> `POST /v1/encrypt`

| Paramètre du corps | Requis | Taper | Description |
| -------------- | -------- | ------ | -------------------------------------------- |
| `input` | Oui | Chaîne | Tout enregistrement TXT en texte brut de courrier électronique de transfert valide |

> Exemple de requête :

```sh
curl -X POST BASE_URI/v1/encrypt \
  -d "input=user@gmail.com"
```
