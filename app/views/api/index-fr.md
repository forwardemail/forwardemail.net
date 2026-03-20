# API Email {#email-api}


## Table des matières {#table-of-contents}

* [Bibliothèques](#libraries)
* [URI de base](#base-uri)
* [Authentification](#authentication)
  * [Authentification par jeton API (recommandée pour la plupart des points de terminaison)](#api-token-authentication-recommended-for-most-endpoints)
  * [Authentification par identifiants d'alias (pour les emails sortants)](#alias-credentials-authentication-for-outbound-email)
  * [Points de terminaison réservés aux alias](#alias-only-endpoints)
* [Erreurs](#errors)
* [Localisation](#localization)
* [Pagination](#pagination)
* [Journaux](#logs)
  * [Récupérer les journaux](#retrieve-logs)
* [Compte](#account)
  * [Créer un compte](#create-account)
  * [Récupérer un compte](#retrieve-account)
  * [Mettre à jour un compte](#update-account)
* [Contacts d'alias (CardDAV)](#alias-contacts-carddav)
  * [Lister les contacts](#list-contacts)
  * [Créer un contact](#create-contact)
  * [Récupérer un contact](#retrieve-contact)
  * [Mettre à jour un contact](#update-contact)
  * [Supprimer un contact](#delete-contact)
* [Calendriers d'alias (CalDAV)](#alias-calendars-caldav)
  * [Lister les calendriers](#list-calendars)
  * [Créer un calendrier](#create-calendar)
  * [Récupérer un calendrier](#retrieve-calendar)
  * [Mettre à jour un calendrier](#update-calendar)
  * [Supprimer un calendrier](#delete-calendar)
* [Messages d'alias (IMAP/POP3)](#alias-messages-imappop3)
  * [Lister et rechercher des messages](#list-and-search-for-messages)
  * [Créer un message](#create-message)
  * [Récupérer un message](#retrieve-message)
  * [Mettre à jour un message](#update-message)
  * [Supprimer un message](#delete-message)
* [Dossiers d'alias (IMAP/POP3)](#alias-folders-imappop3)
  * [Lister les dossiers](#list-folders)
  * [Créer un dossier](#create-folder)
  * [Récupérer un dossier](#retrieve-folder)
  * [Mettre à jour un dossier](#update-folder)
  * [Supprimer un dossier](#delete-folder)
  * [Copier un dossier](#copy-folder)
* [Emails sortants](#outbound-emails)
  * [Obtenir la limite d'emails SMTP sortants](#get-outbound-smtp-email-limit)
  * [Lister les emails SMTP sortants](#list-outbound-smtp-emails)
  * [Créer un email SMTP sortant](#create-outbound-smtp-email)
  * [Récupérer un email SMTP sortant](#retrieve-outbound-smtp-email)
  * [Supprimer un email SMTP sortant](#delete-outbound-smtp-email)
* [Domaines](#domains)
  * [Lister les domaines](#list-domains)
  * [Créer un domaine](#create-domain)
  * [Récupérer un domaine](#retrieve-domain)
  * [Vérifier les enregistrements de domaine](#verify-domain-records)
  * [Vérifier les enregistrements SMTP de domaine](#verify-domain-smtp-records)
  * [Lister les mots de passe catch-all à l'échelle du domaine](#list-domain-wide-catch-all-passwords)
  * [Créer un mot de passe catch-all à l'échelle du domaine](#create-domain-wide-catch-all-password)
  * [Supprimer un mot de passe catch-all à l'échelle du domaine](#remove-domain-wide-catch-all-password)
  * [Mettre à jour un domaine](#update-domain)
  * [Supprimer un domaine](#delete-domain)
* [Invitations](#invites)
  * [Accepter une invitation de domaine](#accept-domain-invite)
  * [Créer une invitation de domaine](#create-domain-invite)
  * [Supprimer une invitation de domaine](#remove-domain-invite)
* [Membres](#members)
  * [Mettre à jour un membre de domaine](#update-domain-member)
  * [Supprimer un membre de domaine](#remove-domain-member)
* [Alias](#aliases)
  * [Générer un mot de passe d'alias](#generate-an-alias-password)
  * [Lister les alias de domaine](#list-domain-aliases)
  * [Créer un nouvel alias de domaine](#create-new-domain-alias)
  * [Récupérer un alias de domaine](#retrieve-domain-alias)
  * [Mettre à jour un alias de domaine](#update-domain-alias)
  * [Supprimer un alias de domaine](#delete-domain-alias)
* [Chiffrer](#encrypt)
  * [Chiffrer un enregistrement TXT](#encrypt-txt-record)


## Bibliothèques {#libraries}

Pour l'instant, nous n'avons pas encore publié de wrappers API, mais nous prévoyons de le faire prochainement. Envoyez un email à <api@forwardemail.net> si vous souhaitez être informé de la sortie d'un wrapper API pour un langage de programmation particulier. En attendant, vous pouvez utiliser ces bibliothèques HTTP recommandées dans votre application, ou simplement utiliser [curl](https://stackoverflow.com/a/27442239/3586413) comme dans les exemples ci-dessous.

| Langage   | Bibliothèque                                                           |
| ---------- | ---------------------------------------------------------------------- |
| Ruby       | [Faraday](https://github.com/lostisland/faraday)                      |
| Python     | [requests](https://github.com/psf/requests)                            |
| Java       | [OkHttp](https://github.com/square/okhttp/)                           |
| PHP        | [guzzle](https://github.com/guzzle/guzzle)                            |
| JavaScript | [superagent](https://github.com/ladjs/superagent) (nous sommes mainteneurs) |
| Node.js    | [superagent](https://github.com/ladjs/superagent) (nous sommes mainteneurs) |
| Go         | [net/http](https://golang.org/pkg/net/http/)                          |
| .NET       | [RestSharp](https://github.com/restsharp/RestSharp)                   |
## URI de base {#base-uri}

Le chemin URI de base HTTP actuel est : `BASE_URI`.


## Authentification {#authentication}

Tous les points de terminaison nécessitent une authentification utilisant [l’authentification basique](https://en.wikipedia.org/wiki/Basic_access_authentication). Nous supportons deux méthodes d’authentification :

### Authentification par jeton API (recommandée pour la plupart des points de terminaison) {#api-token-authentication-recommended-for-most-endpoints}

Définissez votre [clé API](https://forwardemail.net/my-account/security) comme valeur "nom d’utilisateur" avec un mot de passe vide :

```sh
curl BASE_URI/v1/account \
  -u API_TOKEN:
```

Notez les deux-points (`:`) après le jeton API – cela indique un mot de passe vide au format Auth basique.

### Authentification par identifiants d’alias (pour les emails sortants) {#alias-credentials-authentication-for-outbound-email}

Le point de terminaison [Créer un email SMTP sortant](#create-outbound-smtp-email) supporte également l’authentification en utilisant votre adresse email alias et un [mot de passe alias généré](/faq#do-you-support-receiving-email-with-imap) :

```sh
curl -X POST BASE_URI/v1/emails \
  -u "alias@yourdomain.com:your_generated_password" \
  -d "to=recipient@example.com" \
  -d "subject=Bonjour" \
  -d "text=Email de test"
```

Cette méthode est utile lors de l’envoi d’emails depuis des applications qui utilisent déjà des identifiants SMTP et facilite la migration de SMTP vers notre API.

### Points de terminaison réservés aux alias {#alias-only-endpoints}

Les points de terminaison [Contacts alias](#alias-contacts-carddav), [Calendriers alias](#alias-calendars-caldav), [Messages alias](#alias-messages-imappop3) et [Dossiers alias](#alias-folders-imappop3) requièrent des identifiants alias et ne supportent pas l’authentification par jeton API.

Ne vous inquiétez pas – des exemples sont fournis ci-dessous si vous ne savez pas ce que c’est.


## Erreurs {#errors}

Si des erreurs surviennent, le corps de la réponse de la requête API contiendra un message d’erreur détaillé.

| Code | Nom                   |
| ---- | --------------------- |
| 200  | OK                    |
| 400  | Mauvaise requête      |
| 401  | Non autorisé          |
| 403  | Interdit              |
| 404  | Non trouvé            |
| 429  | Trop de requêtes      |
| 500  | Erreur interne serveur|
| 501  | Non implémenté        |
| 502  | Mauvaise passerelle   |
| 503  | Service indisponible  |
| 504  | Délai de passerelle dépassé |

> \[!TIP]
> Si vous recevez un code d’état 5xx (ce qui ne devrait pas arriver), veuillez nous contacter à <a href="mailto:api@forwardemail.net"><api@forwardemail.net></a> et nous vous aiderons à résoudre votre problème immédiatement.


## Localisation {#localization}

Notre service est traduit en plus de 25 langues différentes. Tous les messages de réponse API sont traduits dans la dernière locale détectée de l’utilisateur effectuant la requête API. Vous pouvez outrepasser cela en passant un en-tête `Accept-Language` personnalisé. N’hésitez pas à l’essayer en utilisant le menu déroulant de langue en bas de cette page.


## Pagination {#pagination}

> \[!NOTE]
> À partir du 1er novembre 2024, les points de terminaison API pour [Lister les domaines](#list-domains) et [Lister les alias de domaine](#list-domain-aliases) auront par défaut `1000` résultats max par page. Si vous souhaitez adopter ce comportement plus tôt, vous pouvez passer `?paginate=true` comme paramètre de chaîne de requête supplémentaire à l’URL du point de terminaison.

La pagination est supportée par tous les points de terminaison API qui listent des résultats.

Il suffit de fournir les propriétés de chaîne de requête `page` (et éventuellement `limit`).

La propriété `page` doit être un nombre supérieur ou égal à `1`. Si vous fournissez `limit` (également un nombre), la valeur minimale est `10` et la maximale est `50` (sauf indication contraire).

| Paramètre de chaîne de requête | Obligatoire | Type   | Description                                                                                                                                               |
| ------------------------------ | ----------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `page`                         | Non         | Nombre | Page de résultats à retourner. Si non spécifié, la valeur `page` sera `1`. Doit être un nombre supérieur ou égal à `1`.                                  |
| `limit`                        | Non         | Nombre | Nombre de résultats à retourner par page. Par défaut `10` si non spécifié. Doit être un nombre supérieur ou égal à `1`, et inférieur ou égal à `50`.      |
Afin de déterminer si d'autres résultats sont disponibles ou non, nous fournissons ces en-têtes de réponse HTTP (que vous pouvez analyser pour paginer de manière programmatique) :

| HTTP Response Header | Exemple                                                                                                                                                                                                                                                  | Description                                                                                                                                                                                                                                                                                                                                                        |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `X-Page-Count`       | `X-Page-Count: 3`                                                                                                                                                                                                                                        | Le nombre total de pages disponibles.                                                                                                                                                                                                                                                                                                                            |
| `X-Page-Current`     | `X-Page-Current: 1`                                                                                                                                                                                                                                      | La page actuelle des résultats retournés (par exemple basée sur le paramètre de chaîne de requête `page`).                                                                                                                                                                                                                                                        |
| `X-Page-Size`        | `X-Page-Size: 10`                                                                                                                                                                                                                                        | Le nombre total de résultats dans la page retournée (par exemple basé sur le paramètre de chaîne de requête `limit` et les résultats effectivement retournés).                                                                                                                                                                                                   |
| `X-Item-Count`       | `X-Item-Count: 30`                                                                                                                                                                                                                                       | Le nombre total d'éléments disponibles sur toutes les pages.                                                                                                                                                                                                                                                                                                    |
| `Link`               | `Link: <https://api.forwardemail.net/v1/emails?page=1>; rel="prev", <https://api.forwardemail.net/v1/emails?page=3>; rel="next", <https://api.forwardemail.net/v1/emails?page=3; rel="last", https://api.forwardemail.net/v1/emails?page=1; rel="first"` | Nous fournissons un en-tête de réponse HTTP `Link` que vous pouvez analyser comme montré dans l'exemple. Ceci est [similaire à GitHub](https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api#using-link-headers) (par exemple, toutes les valeurs ne seront pas fournies si elles ne sont pas pertinentes ou disponibles, par ex. `"next"` ne sera pas fourni s'il n'y a pas une autre page). |
> Exemple de requête :

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/aliases?page=2&pagination=true \
  -u API_TOKEN:
```


## Journaux {#logs}

### Récupérer les journaux {#retrieve-logs}

Notre API vous permet de télécharger programmatiquement les journaux de votre compte. Soumettre une requête à ce point de terminaison traitera tous les journaux de votre compte et vous les enverra par email en pièce jointe (fichier tableur [CSV](https://en.wikipedia.org/wiki/Comma-separated_values) compressé [Gzip](https://en.wikipedia.org/wiki/Gzip)) une fois terminé.

Cela vous permet de créer des tâches en arrière-plan avec un [Cron job](https://en.wikipedia.org/wiki/Cron) ou en utilisant notre [logiciel de planification de tâches Node.js Bree](https://github.com/breejs/bree) pour recevoir les journaux quand vous le souhaitez. Notez que ce point de terminaison est limité à `10` requêtes par jour.

La pièce jointe porte le nom en minuscules `email-deliverability-logs-YYYY-MM-DD-h-mm-A-z.csv.gz` et l’email contient un bref résumé des journaux récupérés. Vous pouvez également télécharger les journaux à tout moment depuis [Mon Compte → Journaux](/my-account/logs)

> `GET /v1/logs/download`

| Paramètre Querystring | Obligatoire | Type          | Description                                                                                                                     |
| --------------------- | ----------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `domain`              | Non         | String (FQDN) | Filtrer les journaux par nom de domaine pleinement qualifié ("FQDN"). Si vous ne fournissez pas ce paramètre, tous les journaux de tous les domaines seront récupérés. |
| `q`                   | Non         | String        | Rechercher des journaux par email, domaine, nom d’alias, adresse IP ou date (formats `M/Y`, `M/D/YY`, `M-D`, `M-D-YY` ou `M.D.YY`).       |
| `bounce_category`     | Non         | String        | Rechercher des journaux par catégorie de rebond spécifique (ex. `blocklist`).                                                               |
| `response_code`       | Non         | Number        | Rechercher des journaux par code de réponse d’erreur spécifique (ex. `421` ou `550`).                                                        |

> Exemple de requête :

```sh
curl BASE_URI/v1/logs/download \
  -u API_TOKEN:
```

> Exemple de Cron job (à minuit chaque jour) :

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download -u API_TOKEN: &>/dev/null
```

Notez que vous pouvez utiliser des services tels que [Crontab.guru](https://crontab.guru/) pour valider la syntaxe de votre expression cron.

> Exemple de Cron job (à minuit chaque jour **et avec les journaux du jour précédent**) :

Pour MacOS :

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download?q=`date -v-1d -u "+%-m/%-d/%y"` -u API_TOKEN: &>/dev/null
```

Pour Linux et Ubuntu :

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download?q=`date --date "-1 days" -u "+%-m/%-d/%y"` -u API_TOKEN: &>/dev/null
```


## Compte {#account}

### Créer un compte {#create-account}

> `POST /v1/account`

| Paramètre Body | Obligatoire | Type           | Description   |
| -------------- | ----------- | -------------- | ------------- |
| `email`        | Oui         | String (Email) | Adresse email |
| `password`     | Oui         | String         | Mot de passe  |

> Exemple de requête :

```sh
curl -X POST BASE_URI/v1/account \
  -u API_TOKEN: \
  -d "email=EMAIL"
```

### Récupérer un compte {#retrieve-account}

> `GET /v1/account`

> Exemple de requête :

```sh
curl BASE_URI/v1/account \
  -u API_TOKEN:
```

### Mettre à jour un compte {#update-account}

> `PUT /v1/account`

| Paramètre Body | Obligatoire | Type           | Description          |
| -------------- | ----------- | -------------- | -------------------- |
| `email`        | Non         | String (Email) | Adresse email        |
| `given_name`   | Non         | String         | Prénom               |
| `family_name`  | Non         | String         | Nom de famille       |
| `avatar_url`   | Non         | String (URL)   | Lien vers l’image d’avatar |

> Exemple de requête :

```sh
curl -X PUT BASE_URI/v1/account \
  -u API_TOKEN: \
  -d "email=EMAIL"
```


## Contacts Alias (CardDAV) {#alias-contacts-carddav}

> \[!NOTE]
> Contrairement aux autres points de terminaison de l’API, ceux-ci requièrent que l’[Authentification](#authentication) utilise comme "nom d’utilisateur" le nom d’utilisateur de l’alias et comme "mot de passe" le mot de passe généré de l’alias en tant qu’en-têtes d’Autorisation Basic.
> \[!WARNING]
> Cette section des points de terminaison est en cours de développement et sera publiée (espérons-le) en 2024. En attendant, veuillez utiliser un client IMAP depuis le menu déroulant "Apps" dans la navigation de notre site web.

### Lister les contacts {#list-contacts}

> `GET /v1/contacts`

**Bientôt disponible**

### Créer un contact {#create-contact}

> `POST /v1/contacts`

**Bientôt disponible**

### Récupérer un contact {#retrieve-contact}

> `GET /v1/contacts/:id`

**Bientôt disponible**

### Mettre à jour un contact {#update-contact}

> `PUT /v1/contacts/:id`

**Bientôt disponible**

### Supprimer un contact {#delete-contact}

> `DELETE /v1/contacts/:id`

**Bientôt disponible**


## Calendriers Alias (CalDAV) {#alias-calendars-caldav}

> \[!NOTE]
> Contrairement aux autres points de terminaison API, ceux-ci nécessitent que [l’Authentification](#authentication) utilise un "nom d’utilisateur" égal au nom d’utilisateur de l’alias et un "mot de passe" égal au mot de passe généré de l’alias en tant qu’en-têtes d’Autorisation Basic.

> \[!WARNING]
> Cette section des points de terminaison est en cours de développement et sera publiée (espérons-le) en 2024. En attendant, veuillez utiliser un client IMAP depuis le menu déroulant "Apps" dans la navigation de notre site web.

### Lister les calendriers {#list-calendars}

> `GET /v1/calendars`

**Bientôt disponible**

### Créer un calendrier {#create-calendar}

> `POST /v1/calendars`

**Bientôt disponible**

### Récupérer un calendrier {#retrieve-calendar}

> `GET /v1/calendars/:id`

**Bientôt disponible**

### Mettre à jour un calendrier {#update-calendar}

> `PUT /v1/calendars/:id`

**Bientôt disponible**

### Supprimer un calendrier {#delete-calendar}

> `DELETE /v1/calendars/:id`

**Bientôt disponible**


## Messages Alias (IMAP/POP3) {#alias-messages-imappop3}

> \[!NOTE]
> Contrairement aux autres points de terminaison API, ceux-ci nécessitent que [l’Authentification](#authentication) utilise un "nom d’utilisateur" égal au nom d’utilisateur de l’alias et un "mot de passe" égal au mot de passe généré de l’alias en tant qu’en-têtes d’Autorisation Basic.

> \[!WARNING]
> Cette section des points de terminaison est en cours de développement et sera publiée (espérons-le) en 2024. En attendant, veuillez utiliser un client IMAP depuis le menu déroulant "Apps" dans la navigation de notre site web.

Veuillez vous assurer d’avoir suivi les instructions de configuration pour votre domaine.

Ces instructions se trouvent dans notre section FAQ [Supportez-vous la réception d’emails avec IMAP ?](/faq#do-you-support-receiving-email-with-imap).

### Lister et rechercher des messages {#list-and-search-for-messages}

> `GET /v1/messages`

**Bientôt disponible**

### Créer un message {#create-message}

> \[!NOTE]
> Cela **NE** va **PAS** envoyer un email – cela ajoutera simplement le message dans le dossier de votre boîte aux lettres (par exemple, c’est similaire à la commande IMAP `APPEND`). Si vous souhaitez envoyer un email, veuillez consulter [Créer un email SMTP sortant](#create-outbound-smtp-email) ci-dessous. Après avoir créé l’email SMTP sortant, vous pouvez alors ajouter une copie de celui-ci à l’aide de ce point de terminaison dans la boîte aux lettres de votre alias à des fins de stockage.

> `POST /v1/messages`

**Bientôt disponible**

### Récupérer un message {#retrieve-message}

> `GET /v1/messages/:id`

**Bientôt disponible**

### Mettre à jour un message {#update-message}

> `PUT /v1/messages/:id`

**Bientôt disponible**

### Supprimer un message {#delete-message}

> `DELETE /v1/messages:id`

**Bientôt disponible**


## Dossiers Alias (IMAP/POP3) {#alias-folders-imappop3}

> \[!TIP]
> Les points de terminaison des dossiers avec un chemin de dossier <code>/v1/folders/:path</code> comme point de terminaison sont interchangeables avec un ID de dossier <code>:id</code>. Cela signifie que vous pouvez référer au dossier soit par son <code>path</code> soit par sa valeur <code>id</code>.

> \[!WARNING]
> Cette section des points de terminaison est en cours de développement et sera publiée (espérons-le) en 2024. En attendant, veuillez utiliser un client IMAP depuis le menu déroulant "Apps" dans la navigation de notre site web.

### Lister les dossiers {#list-folders}

> `GET /v1/folders`

**Bientôt disponible**

### Créer un dossier {#create-folder}

> `POST /v1/folders`

**Bientôt disponible**

### Récupérer un dossier {#retrieve-folder}

> `GET /v1/folders/:id`

**Bientôt disponible**

### Mettre à jour un dossier {#update-folder}

> `PUT /v1/folders/:id`

**Bientôt disponible**

### Supprimer un dossier {#delete-folder}

> `DELETE /v1/folders/:id`

**Bientôt disponible**

### Copier un dossier {#copy-folder}

> `POST /v1/folders/:id/copy`

**Bientôt disponible**


## Emails sortants {#outbound-emails}

Veuillez vous assurer d’avoir suivi les instructions de configuration pour votre domaine.

Ces instructions se trouvent à [Mon Compte → Domaines → Paramètres → Configuration SMTP sortant](/my-account/domains). Vous devez vous assurer de la configuration de DKIM, Return-Path, et DMARC pour l’envoi SMTP sortant avec votre domaine.
### Obtenir la limite d'emails SMTP sortants {#get-outbound-smtp-email-limit}

Ceci est un point de terminaison simple qui renvoie un objet JSON contenant le `count` et la `limit` pour le nombre de messages SMTP sortants quotidiens par compte.

> `GET /v1/emails/limit`

> Exemple de requête :

```sh
curl BASE_URI/v1/emails/limit \
  -u API_TOKEN:
```

### Lister les emails SMTP sortants {#list-outbound-smtp-emails}

Notez que ce point de terminaison ne renvoie pas les valeurs des propriétés pour le `message`, les `headers`, ni les `rejectedErrors` d'un email.

Pour retourner ces propriétés et leurs valeurs, veuillez utiliser le point de terminaison [Récupérer un email](#retrieve-email) avec un ID d'email.

> `GET /v1/emails`

| Paramètre de la chaîne de requête | Obligatoire | Type                      | Description                                                                                                                                      |
| --------------------------------- | ----------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q`                               | Non         | Chaîne (RegExp supporté)  | Recherche d'emails par métadonnées                                                                                                              |
| `domain`                          | Non         | Chaîne (RegExp supporté)  | Recherche d'emails par nom de domaine                                                                                                           |
| `sort`                            | Non         | Chaîne                    | Trier par un champ spécifique (préfixer d'un tiret simple `-` pour trier dans la direction inverse de ce champ). Par défaut `created_at` si non défini. |
| `page`                            | Non         | Nombre                    | Voir [Pagination](#pagination) pour plus de détails                                                                                             |
| `limit`                           | Non         | Nombre                    | Voir [Pagination](#pagination) pour plus de détails                                                                                             |

> Exemple de requête :

```sh
curl BASE_URI/v1/emails?limit=1 \
  -u API_TOKEN:
```

### Créer un email SMTP sortant {#create-outbound-smtp-email}

Notre API pour créer un email est inspirée et utilise la configuration des options de message de Nodemailer. Veuillez vous référer à la [configuration des messages Nodemailer](https://nodemailer.com/message/) pour tous les paramètres du corps ci-dessous.

Notez qu'à l'exception de `envelope` et `dkim` (puisque nous les définissons automatiquement pour vous), nous supportons toutes les options Nodemailer. Nous définissons automatiquement les options `disableFileAccess` et `disableUrlAccess` à `true` pour des raisons de sécurité.

Vous devez soit passer l'option unique `raw` avec votre email complet brut incluant les en-têtes **ou** passer les options individuelles du corps ci-dessous.

Ce point de terminaison API encodera automatiquement les emojis pour vous s'ils sont trouvés dans les en-têtes (par exemple une ligne d'objet `Subject: 🤓 Hello` est automatiquement convertie en `Subject: =?UTF-8?Q?=F0=9F=A4=93?= Hello`). Notre objectif était de créer une API email extrêmement conviviale et à l'épreuve des erreurs pour les développeurs.

**Authentification :** Ce point de terminaison supporte à la fois [l'authentification par token API](#api-token-authentication-recommended-for-most-endpoints) et [l'authentification par identifiants d'alias](#alias-credentials-authentication-for-outbound-email). Voir la section [Authentification](#authentication) ci-dessus pour plus de détails.

> `POST /v1/emails`

| Paramètre du corps | Obligatoire | Type             | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ----------------- | ----------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `from`            | Non         | Chaîne (Email)   | L'adresse email de l'expéditeur (doit exister en tant qu'alias du domaine).                                                                                                                                                                                                                                                                                                                                                                                      |
| `to`              | Non         | Chaîne ou Tableau| Liste séparée par des virgules ou un tableau des destinataires pour l'en-tête "To".                                                                                                                                                                                                                                                                                                                                                                              |
| `cc`              | Non         | Chaîne ou Tableau| Liste séparée par des virgules ou un tableau des destinataires pour l'en-tête "Cc".                                                                                                                                                                                                                                                                                                                                                                              |
| `bcc`             | Non         | Chaîne ou Tableau| Liste séparée par des virgules ou un tableau des destinataires pour l'en-tête "Bcc".                                                                                                                                                                                                                                                                                                                                                                             |
| `subject`         | Non         | Chaîne           | L'objet de l'email.                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `text`            | Non         | Chaîne ou Buffer | La version texte brut du message.                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `html`            | Non         | Chaîne ou Buffer | La version HTML du message.                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `attachments`     | Non         | Tableau          | Un tableau d'objets de pièces jointes (voir les [champs communs de Nodemailer](https://nodemailer.com/message/#common-fields)).                                                                                                                                                                                                                                                                                                                                  |
| `sender`          | Non         | Chaîne           | L'adresse email pour l'en-tête "Sender" (voir les [champs plus avancés de Nodemailer](https://nodemailer.com/message/#more-advanced-fields)).                                                                                                                                                                                                                                                                                                                   |
| `replyTo`         | Non         | Chaîne           | L'adresse email pour l'en-tête "Reply-To".                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `inReplyTo`       | Non         | Chaîne           | Le Message-ID auquel le message répond.                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `references`      | Non         | Chaîne ou Tableau| Liste séparée par des espaces ou un tableau de Message-ID.                                                                                                                                                                                                                                                                                                                                                                                                       |
| `attachDataUrls`  | Non         | Booléen          | Si `true`, convertit les images `data:` dans le contenu HTML du message en pièces jointes intégrées.                                                                                                                                                                                                                                                                                                                                                             |
| `watchHtml`       | Non         | Chaîne           | Une version HTML spécifique à Apple Watch du message ([selon la documentation Nodemailer](https://nodemailer.com/message/#content-options]), les dernières montres ne nécessitent pas que cela soit défini).                                                                                                                                                                                                                                                      |
| `amp`             | Non         | Chaîne           | Une version HTML spécifique AMP4EMAIL du message (voir [l'exemple Nodemailer](https://nodemailer.com/message/#amp-example)).                                                                                                                                                                                                                                                                                                                                     |
| `icalEvent`       | Non         | Objet            | Un événement iCalendar à utiliser comme contenu alternatif du message (voir [les événements calendrier Nodemailer](https://nodemailer.com/message/calendar-events/)).                                                                                                                                                                                                                                                                                             |
| `alternatives`    | Non         | Tableau          | Un tableau de contenus alternatifs du message (voir [le contenu alternatif Nodemailer](https://nodemailer.com/message/alternatives/)).                                                                                                                                                                                                                                                                                                                          |
| `encoding`        | Non         | Chaîne           | Encodage pour les chaînes texte et HTML (par défaut `"utf-8"`, mais supporte aussi les valeurs d'encodage `"hex"` et `"base64"`).                                                                                                                                                                                                                                                                                                                               |
| `raw`             | Non         | Chaîne ou Buffer | Un message formaté RFC822 généré personnalisé à utiliser (au lieu d'un généré par Nodemailer – voir [source personnalisée Nodemailer](https://nodemailer.com/message/custom-source/)).                                                                                                                                                                                                                                                                           |
| `textEncoding`    | Non         | Chaîne           | Encodage forcé à utiliser pour les valeurs texte (soit `"quoted-printable"` ou `"base64"`). La valeur par défaut est la valeur la plus proche détectée (pour ASCII utiliser `"quoted-printable"`).                                                                                                                                                                                                                                                             |
| `priority`        | Non         | Chaîne           | Niveau de priorité pour l'email (peut être `"high"`, `"normal"` (par défaut), ou `"low"`). Notez qu'une valeur `"normal"` ne définit pas d'en-tête de priorité (c'est le comportement par défaut). Si une valeur `"high"` ou `"low"` est définie, alors les en-têtes `X-Priority`, `X-MSMail-Priority` et `Importance` [seront définis en conséquence](https://github.com/nodemailer/nodemailer/blob/19fce2dc4dcb83224acaf1cfc890d08126309594/lib/mailer/mail-message.js#L222-L240). |
| `headers`         | Non         | Objet ou Tableau | Un objet ou un tableau de champs d'en-tête supplémentaires à définir (voir [les en-têtes personnalisés Nodemailer](https://nodemailer.com/message/custom-headers/)).                                                                                                                                                                                                                                                                                            |
| `messageId`       | Non         | Chaîne           | Une valeur Message-ID optionnelle pour l'en-tête "Message-ID" (une valeur par défaut sera automatiquement créée si non définie – notez que la valeur doit [respecter la spécification RFC2822](https://stackoverflow.com/a/4031705)).                                                                                                                                                                                                                             |
| `date`            | Non         | Chaîne ou Date   | Une valeur Date optionnelle qui sera utilisée si l'en-tête Date est manquant après analyse, sinon la chaîne UTC actuelle sera utilisée si non définie. L'en-tête date ne peut pas être plus de 30 jours en avance par rapport à l'heure actuelle.                                                                                                                                                                                                             |
| `list`            | Non         | Objet            | Un objet optionnel des en-têtes `List-*` (voir [les en-têtes de liste Nodemailer](https://nodemailer.com/message/list-headers/)).                                                                                                                                                                                                                                                                                                                                |
> Exemple de requête (jeton API) :

```sh
curl -X POST BASE_URI/v1/emails \
  -u API_TOKEN: \
  -d "from=alias@DOMAIN_NAME" \
  -d "to=EMAIL" \
  -d "subject=test" \
  -d "text=test"
```

> Exemple de requête (identifiants alias) :

```sh
curl -X POST BASE_URI/v1/emails \
  -u "alias@DOMAIN_NAME:GENERATED_PASSWORD" \
  -d "from=alias@DOMAIN_NAME" \
  -d "to=EMAIL" \
  -d "subject=test" \
  -d "text=test"
```

> Exemple de requête (email brut) :

```sh
curl -X POST BASE_URI/v1/emails \
  -u API_TOKEN: \
  -d "raw=`cat file.eml`"
```

### Récupérer un email SMTP sortant {#retrieve-outbound-smtp-email}

> `GET /v1/emails/:id`

> Exemple de requête :

```sh
curl BASE_URI/v1/emails/:id \
  -u API_TOKEN:
```

### Supprimer un email SMTP sortant {#delete-outbound-smtp-email}

La suppression d’un email définira le statut à `"rejected"` (et ne le traitera donc plus dans la file d’attente) si et seulement si le statut actuel est l’un des suivants : `"pending"`, `"queued"`, ou `"deferred"`. Nous pouvons purger automatiquement les emails après 30 jours suivant leur création et/ou envoi – vous devez donc conserver une copie des emails SMTP sortants dans votre client, base de données ou application. Vous pouvez référencer notre valeur d’ID d’email dans votre base de données si vous le souhaitez – cette valeur est retournée à la fois par les points d’accès [Créer un email](#create-email) et [Récupérer un email](#retrieve-email).

> `DELETE /v1/emails/:id`

> Exemple de requête :

```sh
curl -X DELETE BASE_URI/v1/emails/:id \
  -u API_TOKEN:
```


## Domaines {#domains}

> \[!TIP]
> Les points d’accès de domaine avec le nom de domaine <code>/v1/domains/:domain_name</code> comme point d’accès sont interchangeables avec l’ID du domaine <code>:domain_id</code>. Cela signifie que vous pouvez vous référer au domaine soit par son <code>nom</code>, soit par sa valeur <code>id</code>.

### Lister les domaines {#list-domains}

> \[!NOTE]
> À partir du 1er novembre 2024, les points d’accès API pour [Lister les domaines](#list-domains) et [Lister les alias de domaine](#list-domain-aliases) auront par défaut un maximum de `1000` résultats par page. Si vous souhaitez activer ce comportement plus tôt, vous pouvez passer `?paginate=true` comme paramètre de chaîne de requête supplémentaire à l’URL du point d’accès. Voir [Pagination](#pagination) pour plus de détails.

> `GET /v1/domains`

| Paramètre de requête | Obligatoire | Type                      | Description                                                                                                                                      |
| --------------------- | -------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q`                   | Non       | Chaîne (RegExp supporté)  | Recherche de domaines par nom                                                                                                                   |
| `name`                | Non       | Chaîne (RegExp supporté)  | Recherche de domaines par nom                                                                                                                   |
| `sort`                | Non       | Chaîne                    | Trier par un champ spécifique (précéder d’un tiret simple `-` pour trier dans le sens inverse de ce champ). Par défaut `created_at` si non défini. |
| `page`                | Non       | Nombre                    | Voir [Pagination](#pagination) pour plus de détails                                                                                             |
| `limit`               | Non       | Nombre                    | Voir [Pagination](#pagination) pour plus de détails                                                                                             |

> Exemple de requête :

```sh
curl BASE_URI/v1/domains \
  -u API_TOKEN:
```

### Créer un domaine {#create-domain}

> `POST /v1/domains`

| Paramètre du corps             | Obligatoire | Type                                          | Description                                                                                                                                                                                                                                                                                                          |
| ------------------------------ | -------- | --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `domain`                       | Oui      | Chaîne (FQDN ou IP)                           | Nom de domaine pleinement qualifié ("FQDN") ou adresse IP                                                                                                                                                                                                                                                           |
| `team_domain`                  | Non       | Chaîne (ID de domaine ou nom de domaine ; FQDN) | Assigner automatiquement ce domaine à la même équipe qu’un autre domaine. Cela signifie que tous les membres de ce domaine seront assignés comme membres de l’équipe, et le `plan` sera automatiquement défini sur `team`. Vous pouvez définir cette valeur à `"none"` si nécessaire pour désactiver explicitement cela, mais ce n’est pas obligatoire. |
| `plan`                         | Non       | Chaîne (énumérable)                           | Type de plan (doit être `"free"`, `"enhanced_protection"`, ou `"team"`, par défaut `"free"` ou le plan payant actuel de l’utilisateur s’il en a un)                                                                                                                                                                   |
| `catchall`                     | Non       | Chaîne (adresses email délimitées) ou Booléen | Créer un alias catch-all par défaut, par défaut à `true` (si `true`, l’adresse email de l’utilisateur API sera utilisée comme destinataire, et si `false`, aucun catch-all ne sera créé). Si une chaîne est passée, il s’agit d’une liste délimitée d’adresses email à utiliser comme destinataires (séparées par saut de ligne, espace et/ou virgule)     |
| `has_adult_content_protection` | Non       | Booléen                                       | Activer la protection contre le contenu adulte du scanner anti-spam sur ce domaine                                                                                                                                                                                                                                   |
| `has_phishing_protection`      | Non       | Booléen                                       | Activer la protection contre le phishing du scanner anti-spam sur ce domaine                                                                                                                                                                                                                                        |
| `has_executable_protection`    | Non       | Booléen                                       | Activer la protection contre les exécutables du scanner anti-spam sur ce domaine                                                                                                                                                                                                                                    |
| `has_virus_protection`         | Non       | Booléen                                       | Activer la protection contre les virus du scanner anti-spam sur ce domaine                                                                                                                                                                                                                                         |
| `has_recipient_verification`   | Non       | Booléen                                       | Valeur par défaut globale du domaine pour exiger que les destinataires d’alias cliquent sur un lien de vérification d’email pour que les emails soient transmis                                                                                                                                                   |
| `ignore_mx_check`              | Non       | Booléen                                       | Ignorer la vérification de l’enregistrement MX sur le domaine pour la vérification. Ceci est principalement destiné aux utilisateurs ayant des règles avancées de configuration d’échange MX et qui doivent conserver leur échange MX existant et le rediriger vers le nôtre.                                                                                  |
| `retention_days`               | Non       | Nombre                                        | Entier entre `0` et `30` correspondant au nombre de jours de conservation des emails SMTP sortants une fois livrés avec succès ou en erreur permanente. Par défaut `0`, ce qui signifie que les emails SMTP sortants sont purgés et expurgés immédiatement pour votre sécurité.                                   |
| `bounce_webhook`               | Non       | Chaîne (URL) ou Booléen (false)               | URL webhook `http://` ou `https://` de votre choix pour recevoir les webhooks de rebond. Nous enverrons une requête `POST` à cette URL avec des informations sur les échecs SMTP sortants (par exemple échecs temporaires ou définitifs – pour que vous puissiez gérer vos abonnés et gérer programmatiquement vos emails sortants).                        |
| `max_quota_per_alias`          | Non       | Chaîne                                        | Quota maximum de stockage pour les alias sur ce nom de domaine. Entrez une valeur telle que "1 GB" qui sera analysée par [bytes](https://github.com/visionmedia/bytes.js).                                                                                                                                         |
> Exemple de requête :

```sh
curl -X POST BASE_URI/v1/domains \
  -u API_TOKEN: \
  -d domain=DOMAIN_NAME \
  -d plan=free
```

### Récupérer le domaine {#retrieve-domain}

> `GET /v1/domains/DOMAIN_NAME`

> Exemple de requête :

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME \
  -u API_TOKEN:
```

### Vérifier les enregistrements du domaine {#verify-domain-records}

> `GET /v1/domains/DOMAIN_NAME/verify-records`

> Exemple de requête :

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/verify-records \
  -u API_TOKEN:
```

### Vérifier les enregistrements SMTP du domaine {#verify-domain-smtp-records}

> `GET /v1/domains/DOMAIN_NAME/verify-smtp`

> Exemple de requête :

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/verify-smtp \
  -u API_TOKEN:
```

### Lister les mots de passe catch-all pour tout le domaine {#list-domain-wide-catch-all-passwords}

> `GET /v1/domains/DOMAIN_NAME/catch-all-passwords`

> Exemple de requête :

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/catch-all-passwords \
  -u API_TOKEN:
```

### Créer un mot de passe catch-all pour tout le domaine {#create-domain-wide-catch-all-password}

> `POST /v1/domains/DOMAIN_NAME/catch-all-passwords`

| Paramètre du corps | Obligatoire | Type   | Description                                                                                                                                                                                                               |
| ------------------ | ----------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `new_password`     | Non         | String | Votre nouveau mot de passe personnalisé à utiliser pour le mot de passe catch-all du domaine. Notez que vous pouvez laisser ce champ vide ou l’omettre complètement dans le corps de votre requête API si vous souhaitez obtenir un mot de passe fort généré aléatoirement. |
| `description`      | Non         | String | Description à des fins d’organisation uniquement.                                                                                                                                                                        |

> Exemple de requête :

```sh
curl BASE_URL/v1/domains/DOMAIN_NAME/catch-all-passwords \
  -u API_TOKEN:
```

### Supprimer un mot de passe catch-all pour tout le domaine {#remove-domain-wide-catch-all-password}

> `DELETE /v1/domains/DOMAIN_NAME/catch-all-passwords/:token_id`

> Exemple de requête :

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/catch-all-passwords/:token_id \
  -u API_TOKEN:
```

### Mettre à jour le domaine {#update-domain}

> `PUT /v1/domains/DOMAIN_NAME`

| Paramètre du corps             | Obligatoire | Type                            | Description                                                                                                                                                                                                                                                                                   |
| ----------------------------- | ----------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `smtp_port`                   | Non         | String ou Number                | Port personnalisé à configurer pour le transfert SMTP (par défaut `"25"`)                                                                                                                                                                                                                      |
| `has_adult_content_protection`| Non         | Boolean                         | Indique s’il faut activer la protection contre le contenu adulte du Spam Scanner sur ce domaine                                                                                                                                                                                              |
| `has_phishing_protection`     | Non         | Boolean                         | Indique s’il faut activer la protection anti-phishing du Spam Scanner sur ce domaine                                                                                                                                                                                                          |
| `has_executable_protection`   | Non         | Boolean                         | Indique s’il faut activer la protection contre les exécutables du Spam Scanner sur ce domaine                                                                                                                                                                                                |
| `has_virus_protection`        | Non         | Boolean                         | Indique s’il faut activer la protection antivirus du Spam Scanner sur ce domaine                                                                                                                                                                                                              |
| `has_recipient_verification`  | Non         | Boolean                         | Valeur par défaut globale du domaine indiquant s’il faut exiger que les destinataires alias cliquent sur un lien de vérification d’email pour que les emails soient transmis                                                                                                                                                                  |
| `ignore_mx_check`             | Non         | Boolean                         | Indique s’il faut ignorer la vérification de l’enregistrement MX sur le domaine pour la vérification. Ceci s’adresse principalement aux utilisateurs ayant des règles avancées de configuration d’échange MX et qui doivent conserver leur échange MX existant et le transférer au nôtre.          |
| `retention_days`              | Non         | Number                          | Entier entre `0` et `30` correspondant au nombre de jours de conservation des emails SMTP sortants une fois livrés avec succès ou en erreur permanente. Par défaut `0`, ce qui signifie que les emails SMTP sortants sont immédiatement purgés et expurgés pour votre sécurité.                |
| `bounce_webhook`              | Non         | String (URL) ou Boolean (false) | URL webhook `http://` ou `https://` de votre choix pour recevoir les webhooks de rebond. Nous enverrons une requête `POST` à cette URL avec des informations sur les échecs SMTP sortants (par ex. échecs temporaires ou définitifs – pour que vous puissiez gérer vos abonnés et gérer programmatiquement vos emails sortants). |
| `max_quota_per_alias`         | Non         | String                          | Quota maximum de stockage pour les alias sur ce nom de domaine. Entrez une valeur telle que "1 GB" qui sera analysée par [bytes](https://github.com/visionmedia/bytes.js).                                                                                                                                 |
> Exemple de requête :

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME \
  -u API_TOKEN:
```

### Supprimer un domaine {#delete-domain}

> `DELETE /v1/domains/:domain_name`

> Exemple de requête :

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name \
  -u API_TOKEN:
```


## Invitations {#invites}

### Accepter une invitation de domaine {#accept-domain-invite}

> `GET /v1/domains/:domain_name/invites`

> Exemple de requête :

```sh
curl BASE_URI/v1/domains/:domain_name/invites \
  -u API_TOKEN:
```

### Créer une invitation de domaine {#create-domain-invite}

> `POST /v1/domains/DOMAIN_NAME/invites`

| Paramètre du corps | Obligatoire | Type                | Description                                                                               |
| ------------------ | ----------- | ------------------- | ----------------------------------------------------------------------------------------- |
| `email`            | Oui         | Chaîne (Email)      | Adresse email à inviter dans la liste des membres du domaine                             |
| `group`            | Oui         | Chaîne (énumérable) | Groupe auquel ajouter l'utilisateur dans l'appartenance au domaine (peut être `"admin"` ou `"user"`) |

> Exemple de requête :

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/invites \
  -u API_TOKEN: \
  -d "email=EMAIL" \
  -d group=admin
```

> \[!IMPORTANT]
> Si l'utilisateur invité est déjà un membre accepté d'autres domaines dont l'administrateur qui l'invite est membre, alors l'invitation sera automatiquement acceptée et aucun email ne sera envoyé.

### Supprimer une invitation de domaine {#remove-domain-invite}

> `DELETE /v1/domains/:domain_name/invites`

| Paramètre du corps | Obligatoire | Type           | Description                                      |
| ------------------ | ----------- | -------------- | ------------------------------------------------ |
| `email`            | Oui         | Chaîne (Email) | Adresse email à retirer de la liste des membres du domaine |

> Exemple de requête :

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/invites \
  -u API_TOKEN:
```


## Membres {#members}

### Mettre à jour un membre du domaine {#update-domain-member}

> `PUT /v1/domains/DOMAIN_NAME/members/MEMBER_ID`

| Paramètre du corps | Obligatoire | Type                | Description                                                                                  |
| ------------------ | ----------- | ------------------- | -------------------------------------------------------------------------------------------- |
| `group`            | Oui         | Chaîne (énumérable) | Groupe auquel mettre à jour l'utilisateur dans l'appartenance au domaine (peut être `"admin"` ou `"user"`) |

> Exemple de requête :

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME/members/MEMBER_ID \
  -u API_TOKEN:
```

### Supprimer un membre du domaine {#remove-domain-member}

> `DELETE /v1/domains/:domain_name/members/:member_id`

> Exemple de requête :

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/members/:member_id \
  -u API_TOKEN:
```


## Alias {#aliases}

### Générer un mot de passe pour un alias {#generate-an-alias-password}

Notez que si vous n'envoyez pas les instructions par email, alors le nom d'utilisateur et le mot de passe seront dans le corps de la réponse JSON d'une requête réussie au format `{ username: 'alias@yourdomain.com', password: 'some-generated-password' }`.

> `POST /v1/domains/DOMAIN_NAME/aliases/ALIAS_ID/generate-password`

| Paramètre du corps     | Obligatoire | Type    | Description                                                                                                                                                                                                                                                                                         |
| --------------------- | ----------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `new_password`        | Non         | Chaîne  | Votre nouveau mot de passe personnalisé à utiliser pour l'alias. Notez que vous pouvez laisser ce champ vide ou l'omettre complètement dans le corps de votre requête API si vous souhaitez obtenir un mot de passe fort généré aléatoirement.                                                                                                    |
| `password`            | Non         | Chaîne  | Mot de passe existant de l'alias pour changer le mot de passe sans supprimer le stockage IMAP existant (voir l'option `is_override` ci-dessous si vous n'avez plus le mot de passe existant).                                                                                                                 |
| `is_override`         | Non         | Booléen | **À UTILISER AVEC PRUDENCE** : Cela écrasera complètement le mot de passe et la base de données existants de l'alias, supprimera définitivement le stockage IMAP existant et réinitialisera complètement la base de données SQLite des emails de l'alias. Veuillez faire une sauvegarde si possible si vous avez une boîte aux lettres attachée à cet alias. |
| `emailed_instructions`| Non         | Chaîne  | Adresse email à laquelle envoyer le mot de passe de l'alias et les instructions de configuration.                                                                                                                                                                                                                                |
> Exemple de requête :

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/aliases/ALIAS_ID/generate-password \
  -u API_TOKEN:
```

### Lister les alias de domaine {#list-domain-aliases}

> \[!NOTE]
> À partir du 1er novembre 2024, les points d’API pour [Lister les domaines](#list-domains) et [Lister les alias de domaine](#list-domain-aliases) auront par défaut `1000` résultats maximum par page. Si vous souhaitez activer ce comportement plus tôt, vous pouvez passer `?paginate=true` comme paramètre supplémentaire dans la chaîne de requête de l’URL du point d’API. Voir [Pagination](#pagination) pour plus de détails.

> `GET /v1/domains/DOMAIN_NAME/aliases`

| Paramètre de la chaîne de requête | Obligatoire | Type                      | Description                                                                                                                                      |
| --------------------------------- | ----------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q`                               | Non         | Chaîne (RegExp supporté)  | Recherche d’alias dans un domaine par nom, étiquette ou destinataire                                                                             |
| `name`                            | Non         | Chaîne (RegExp supporté)  | Recherche d’alias dans un domaine par nom                                                                                                       |
| `recipient`                       | Non         | Chaîne (RegExp supporté)  | Recherche d’alias dans un domaine par destinataire                                                                                              |
| `sort`                            | Non         | Chaîne                    | Trier par un champ spécifique (précéder d’un tiret simple `-` pour trier dans le sens inverse). Par défaut `created_at` si non défini.            |
| `page`                            | Non         | Nombre                    | Voir [Pagination](#pagination) pour plus de détails                                                                                            |
| `limit`                           | Non         | Nombre                    | Voir [Pagination](#pagination) pour plus de détails                                                                                            |

> Exemple de requête :

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/aliases?pagination=true \
  -u API_TOKEN:
```

### Créer un nouvel alias de domaine {#create-new-domain-alias}

> `POST /v1/domains/DOMAIN_NAME/aliases`

| Paramètre du corps               | Obligatoire | Type                                   | Description                                                                                                                                                                                                                                                                                                                                                                                 |
| ------------------------------- | ----------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`                          | Non         | Chaîne                                 | Nom de l’alias (si non fourni ou vide, un alias aléatoire est généré)                                                                                                                                                                                                                                                                                                                      |
| `recipients`                    | Non         | Chaîne ou Tableau                      | Liste des destinataires (doit être une chaîne séparée par retour à la ligne/espace/virgule ou un tableau d’adresses email valides, noms de domaine pleinement qualifiés ("FQDN"), adresses IP, et/ou URL de webhook – si non fourni ou tableau vide, l’email de l’utilisateur effectuant la requête API sera défini comme destinataire)                                                                                     |
| `description`                   | Non         | Chaîne                                 | Description de l’alias                                                                                                                                                                                                                                                                                                                                                                       |
| `labels`                        | Non         | Chaîne ou Tableau                      | Liste d’étiquettes (doit être une chaîne séparée par retour à la ligne/espace/virgule ou un tableau)                                                                                                                                                                                                                                                                                       |
| `has_recipient_verification`    | Non         | Booléen                               | Exiger que les destinataires cliquent sur un lien de vérification par email pour que les emails soient transmis (par défaut, la configuration du domaine est utilisée si non défini explicitement dans le corps de la requête)                                                                                                                                                              |
| `is_enabled`                    | Non         | Booléen                               | Activer ou désactiver cet alias (si désactivé, les emails ne seront pas routés mais renverront des codes de statut réussis). Si une valeur est passée, elle est convertie en booléen via [boolean](https://github.com/thenativeweb/boolean#quick-start))                                                                                                                                   |
| `error_code_if_disabled`        | Non         | Nombre (soit `250`, `421` ou `550`) | Les emails entrants vers cet alias seront rejetés si `is_enabled` est `false` avec soit `250` (livraison silencieuse nulle, ex. trou noir ou `/dev/null`), `421` (rejet temporaire ; réessayer pendant environ 5 jours) ou `550` (échec permanent et rejet). Par défaut `250`.                                                                                                           |
| `has_imap`                      | Non         | Booléen                               | Activer ou désactiver le stockage IMAP pour cet alias (si désactivé, les emails entrants ne seront pas stockés dans le [stockage IMAP](/blog/docs/best-quantum-safe-encrypted-email-service). Si une valeur est passée, elle est convertie en booléen via [boolean](https://github.com/thenativeweb/boolean#quick-start))                                                                  |
| `has_pgp`                       | Non         | Booléen                               | Activer ou désactiver le [chiffrement OpenPGP](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd) pour le [stockage email chiffré IMAP/POP3/CalDAV/CardDAV](/blog/docs/best-quantum-safe-encrypted-email-service) en utilisant la `public_key` de l’alias.                                                                                                   |
| `public_key`                    | Non         | Chaîne                                 | Clé publique OpenPGP au format ASCII Armor ([cliquez ici pour voir un exemple](/.well-known/openpgpkey/hu/mxqp8ogw4jfq83a58pn1wy1ccc1cx3f5.txt); ex. clé GPG pour `support@forwardemail.net`). S’applique uniquement si `has_pgp` est à `true`. [En savoir plus sur le chiffrement de bout en bout dans notre FAQ](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd). |
| `max_quota`                     | Non         | Chaîne                                 | Quota maximum de stockage pour cet alias. Laisser vide pour réinitialiser au quota maximum actuel du domaine ou entrer une valeur comme "1 GB" qui sera analysée par [bytes](https://github.com/visionmedia/bytes.js). Cette valeur ne peut être modifiée que par les administrateurs du domaine.                                                                                      |
| `vacation_responder_is_enabled` | Non         | Booléen                               | Activer ou désactiver un répondeur automatique d’absence.                                                                                                                                                                                                                                                                                                                                   |
| `vacation_responder_start_date` | Non         | Chaîne                                 | Date de début du répondeur d’absence (si activé et aucune date de début définie ici, il est supposé déjà démarré). Nous supportons des formats de date tels que `MM/DD/YYYY`, `YYYY-MM-DD` et d’autres formats via une analyse intelligente avec `dayjs`.                                                                                                                                  |
| `vacation_responder_end_date`   | Non         | Chaîne                                 | Date de fin du répondeur d’absence (si activé et aucune date de fin définie ici, il est supposé ne jamais se terminer et répondre indéfiniment). Nous supportons des formats de date tels que `MM/DD/YYYY`, `YYYY-MM-DD` et d’autres formats via une analyse intelligente avec `dayjs`.                                                                                                      |
| `vacation_responder_subject`    | Non         | Chaîne                                 | Sujet en texte brut pour le répondeur d’absence, ex. "Absent du bureau". Nous utilisons `striptags` pour supprimer tout HTML ici.                                                                                                                                                                                                                                                           |
| `vacation_responder_message`    | Non         | Chaîne                                 | Message en texte brut pour le répondeur d’absence, ex. "Je serai absent du bureau jusqu’en février.". Nous utilisons `striptags` pour supprimer tout HTML ici.                                                                                                                                                                                                                               |
> Exemple de requête :

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/aliases \
  -u API_TOKEN:
```

### Récupérer un alias de domaine {#retrieve-domain-alias}

Vous pouvez récupérer un alias de domaine soit par son `id`, soit par sa valeur `name`.

> `GET /v1/domains/:domain_name/aliases/:alias_id`

> Exemple de requête :

```sh
curl BASE_URI/v1/domains/:domain_name/aliases/:alias_id \
  -u API_TOKEN:
```

> `GET /v1/domains/:domain_name/aliases/:alias_name`

> Exemple de requête :

```sh
curl BASE_URI/v1/domains/:domain_name/aliases/:alias_name \
  -u API_TOKEN:
```

### Mettre à jour un alias de domaine {#update-domain-alias}

> `PUT /v1/domains/DOMAIN_NAME/aliases/ALIAS_ID`

| Paramètre du corps              | Obligatoire | Type                                   | Description                                                                                                                                                                                                                                                                                                                                                                                 |
| ------------------------------- | ----------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`                          | Non         | Chaîne de caractères                   | Nom de l'alias                                                                                                                                                                                                                                                                                                                                                                              |
| `recipients`                    | Non         | Chaîne ou Tableau                      | Liste des destinataires (doit être une chaîne séparée par des sauts de ligne/espaces/virgules ou un tableau d'adresses email valides, noms de domaine entièrement qualifiés ("FQDN"), adresses IP, et/ou URL de webhook)                                                                                                                                                                      |
| `description`                   | Non         | Chaîne de caractères                   | Description de l'alias                                                                                                                                                                                                                                                                                                                                                                      |
| `labels`                        | Non         | Chaîne ou Tableau                      | Liste des étiquettes (doit être une chaîne séparée par des sauts de ligne/espaces/virgules ou un tableau)                                                                                                                                                                                                                                                                                   |
| `has_recipient_verification`    | Non         | Booléen                               | Exiger que les destinataires cliquent sur un lien de vérification par email pour que les emails soient transmis (par défaut, la configuration du domaine est utilisée si ce n'est pas explicitement défini dans le corps de la requête)                                                                                                                                                      |
| `is_enabled`                    | Non         | Booléen                               | Activer ou désactiver cet alias (si désactivé, les emails ne seront acheminés nulle part mais retourneront des codes de statut réussis). Si une valeur est passée, elle est convertie en booléen en utilisant [boolean](https://github.com/thenativeweb/boolean#quick-start))                                                                                                               |
| `error_code_if_disabled`        | Non         | Nombre (soit `250`, `421` ou `550`)  | Les emails entrants vers cet alias seront rejetés si `is_enabled` est `false` avec soit `250` (livraison silencieuse nulle part, ex. trou noir ou `/dev/null`), `421` (rejet temporaire ; et réessai pendant environ 5 jours) ou `550` échec permanent et rejet. Par défaut `250`.                                                                                                         |
| `has_imap`                      | Non         | Booléen                               | Activer ou désactiver le stockage IMAP pour cet alias (si désactivé, les emails entrants reçus ne seront pas stockés dans le [stockage IMAP](/blog/docs/best-quantum-safe-encrypted-email-service). Si une valeur est passée, elle est convertie en booléen en utilisant [boolean](https://github.com/thenativeweb/boolean#quick-start))                                                        |
| `has_pgp`                       | Non         | Booléen                               | Activer ou désactiver le [chiffrement OpenPGP](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd) pour le [stockage email chiffré IMAP/POP3/CalDAV/CardDAV](/blog/docs/best-quantum-safe-encrypted-email-service) en utilisant la `public_key` de l'alias.                                                                                                   |
| `public_key`                    | Non         | Chaîne de caractères                   | Clé publique OpenPGP au format ASCII Armor ([cliquez ici pour voir un exemple](/.well-known/openpgpkey/hu/mxqp8ogw4jfq83a58pn1wy1ccc1cx3f5.txt); ex. clé GPG pour `support@forwardemail.net`). Cela s'applique uniquement si vous avez `has_pgp` défini à `true`. [En savoir plus sur le chiffrement de bout en bout dans notre FAQ](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd). |
| `max_quota`                     | Non         | Chaîne de caractères                   | Quota maximum de stockage pour cet alias. Laisser vide pour réinitialiser au quota maximum actuel du domaine ou entrer une valeur telle que "1 GB" qui sera analysée par [bytes](https://github.com/visionmedia/bytes.js). Cette valeur ne peut être ajustée que par les administrateurs du domaine.                                                                                     |
| `vacation_responder_is_enabled` | Non         | Booléen                               | Activer ou désactiver un répondeur automatique de vacances.                                                                                                                                                                                                                                                                                                                               |
| `vacation_responder_start_date` | Non         | Chaîne de caractères                   | Date de début pour le répondeur de vacances (si activé et aucune date de début définie ici, il est supposé qu'il a déjà commencé). Nous supportons des formats de date tels que `MM/DD/YYYY`, `YYYY-MM-DD`, et d'autres formats via une analyse intelligente avec `dayjs`.                                                                                                               |
| `vacation_responder_end_date`   | Non         | Chaîne de caractères                   | Date de fin pour le répondeur de vacances (si activé et aucune date de fin définie ici, il est supposé qu'il ne se termine jamais et répond indéfiniment). Nous supportons des formats de date tels que `MM/DD/YYYY`, `YYYY-MM-DD`, et d'autres formats via une analyse intelligente avec `dayjs`.                                                                                           |
| `vacation_responder_subject`    | Non         | Chaîne de caractères                   | Sujet en texte brut pour le répondeur de vacances, ex. "Absent du bureau". Nous utilisons `striptags` pour supprimer tout HTML ici.                                                                                                                                                                                                                                                       |
| `vacation_responder_message`    | Non         | Chaîne de caractères                   | Message en texte brut pour le répondeur de vacances, ex. "Je serai absent du bureau jusqu'en février.". Nous utilisons `striptags` pour supprimer tout HTML ici.                                                                                                                                                                                                                             |
> Exemple de requête :

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME/aliases/ALIAS_ID \
  -u API_TOKEN:
```

### Supprimer un alias de domaine {#delete-domain-alias}

> `DELETE /v1/domains/:domain_name/aliases/:alias_id`

> Exemple de requête :

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/aliases/:alias_id \
  -u API_TOKEN:
```


## Chiffrer {#encrypt}

Nous vous permettons de chiffrer des enregistrements même avec le plan gratuit sans frais. La confidentialité ne devrait pas être une fonctionnalité, elle devrait être intrinsèquement intégrée à tous les aspects d’un produit. Très demandé dans une [discussion Privacy Guides](https://discuss.privacyguides.net/t/forward-email-email-provider/13370) et sur [nos issues GitHub](https://github.com/forwardemail/forwardemail.net/issues/254), nous avons ajouté cela.

### Chiffrer un enregistrement TXT {#encrypt-txt-record}

> `POST /v1/encrypt`

| Paramètre du corps | Obligatoire | Type   | Description                                  |
| ------------------ | ----------- | ------ | -------------------------------------------- |
| `input`            | Oui         | String | Tout enregistrement TXT en clair valide de Forward Email |

> Exemple de requête :

```sh
curl -X POST BASE_URI/v1/encrypt \
  -d "input=user@gmail.com"
```
