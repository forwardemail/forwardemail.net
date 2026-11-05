# Politique de confidentialité {#privacy-policy}

<!-- <img loading="lazy" src="/img/articles/privacy.webp" alt="Politique de confidentialité Forward Email" class="rounded-lg" /> -->


## Table des matières {#table-of-contents}

* [Avertissement](#disclaimer)
* [Informations non collectées](#information-not-collected)
* [Informations collectées](#information-collected)
  * [Informations sur le compte](#account-information)
  * [Stockage des emails](#email-storage)
  * [Journaux d'erreurs](#error-logs)
  * [Journaux des serveurs](#server-logs)
  * [Emails SMTP sortants](#outbound-smtp-emails)
* [Traitement temporaire des données](#temporary-data-processing)
  * [Limitation du débit](#rate-limiting)
  * [Suivi des connexions](#connection-tracking)
  * [Tentatives d'authentification](#authentication-attempts)
* [Journaux d'audit](#audit-logs)
  * [Modifications du compte](#account-changes)
  * [Modifications des paramètres de domaine](#domain-settings-changes)
* [Cookies et sessions](#cookies-and-sessions)
* [Analyses](#analytics)
* [Applications et webmail](#apps-and-webmail)
  * [Données sur votre appareil](#data-on-your-device)
  * [Données que les applications nous envoient](#data-the-apps-send-us)
  * [Notifications push](#push-notifications)
  * [Images et liens dans les emails](#images-and-links-in-emails)
  * [Autres connexions](#other-connections)
* [Informations partagées](#information-shared)
* [Suppression des informations](#information-removal)
* [Divulgations supplémentaires](#additional-disclosures)


## Avertissement {#disclaimer}

Veuillez vous référer à nos [Conditions](/terms) qui s'appliquent à l'ensemble du site.


## Informations non collectées {#information-not-collected}

**À l'exception des informations expressément décrites dans cette politique (y compris les [journaux d'erreurs](#error-logs), les [journaux des serveurs](#server-logs), les [e-mails SMTP sortants](#outbound-smtp-emails), les [informations de compte](#account-information), le [traitement temporaire des données](#temporary-data-processing), les [journaux d'audit](#audit-logs), les [cookies et sessions](#cookies-and-sessions), les [analyses](#analytics), et les [applications et le webmail](#apps-and-webmail) ):**

* Nous ne stockons aucun e-mail transféré sur un stockage disque ni dans des bases de données.
* Nous ne stockons aucune métadonnée concernant les e-mails transférés sur un stockage disque ni dans des bases de données.
* Sauf indication expresse dans cette politique, nous ne stockons pas de journaux ni d'adresses IP sur un stockage disque ni dans des bases de données.
* Nous n'utilisons aucun service d'analyse ou de télémétrie tiers.


## Informations collectées {#information-collected}

Pour plus de transparence, vous pouvez à tout moment <a href="https://github.com/forwardemail" target="_blank" rel="noopener noreferrer">consulter notre code source</a> pour voir comment les informations ci-dessous sont collectées et utilisées.

**Strictement pour la fonctionnalité et pour améliorer notre service, nous collectons et stockons de manière sécurisée les informations suivantes :**

### Informations sur le compte {#account-information}

* Nous stockons l'adresse e-mail que vous nous fournissez.
* Nous stockons vos noms de domaine, alias et configurations que vous nous fournissez.
* Nous stockons des métadonnées de sécurité de compte limitées nécessaires pour protéger votre compte et gérer l'accès, y compris les identifiants de session de site web actifs, les compteurs de tentatives de connexion échouées et l'horodatage de la dernière tentative de connexion.
* Toute information supplémentaire que vous nous fournissez volontairement, telle que des commentaires ou des questions qui nous sont soumis par e-mail ou sur notre page d'<a href="/help">aide</a>.


**Attribution d'inscription** (stockée de manière permanente sur votre compte) :

Lorsque vous créez un compte, nous stockons les informations suivantes pour comprendre comment les utilisateurs découvrent notre service :

* Le domaine du site référent (pas l'URL complète)
* La première page que vous avez visitée sur notre site, avec les valeurs de son chemin, telles que les noms de domaine, les identifiants et les jetons, remplacées par des espaces réservés
* Les paramètres de campagne UTM s'ils sont présents dans l'URL

### Stockage des emails {#email-storage}

* Nous stockons les emails et informations de calendrier dans votre [base de données SQLite chiffrée](/blog/docs/best-quantum-safe-encrypted-email-service) strictement pour votre accès IMAP/POP3/CalDAV/CardDAV et la fonctionnalité de la boîte aux lettres.
  * Notez que si vous utilisez uniquement nos services de transfert d'emails, aucun email n'est stocké sur disque ni dans une base de données comme décrit dans [Informations non collectées](#information-not-collected).
  * Nos services de transfert d'emails fonctionnent uniquement en mémoire (aucune écriture sur disque ni base de données).
  * Le stockage IMAP/POP3/CalDAV/CardDAV est chiffré au repos, chiffré en transit, et stocké sur un disque chiffré LUKS.
  * Les sauvegardes de votre stockage IMAP/POP3/CalDAV/CardDAV sont chiffrées au repos, chiffrées en transit, et stockées sur [Cloudflare R2](https://www.cloudflare.com/developer-platform/r2/).

### Journaux d'erreurs {#error-logs}

* Nous stockons les codes de réponse SMTP `4xx` et `5xx` dans des [journaux d'erreurs](/faq#do-you-store-error-logs) pendant 7 jours.
* Les journaux d'erreurs contiennent l'erreur SMTP, l'enveloppe, et les en-têtes d'email (nous **ne stockons pas** le corps de l'email ni les pièces jointes).
* Les journaux d'erreurs peuvent contenir les adresses IP et noms d'hôtes des serveurs expéditeurs à des fins de débogage.
* Les journaux d'erreurs pour la [limitation du débit](/faq#do-you-have-rate-limiting) et la [liste grise](/faq#do-you-have-a-greylist) ne sont pas accessibles car la connexion se termine tôt (par exemple avant que les commandes `RCPT TO` et `MAIL FROM` puissent être transmises).
* Nous stockons également pendant 7 jours les journaux d'erreurs des requêtes vers le site web et l'API qui échouent ou prennent trop de temps, ainsi que ceux de nos serveurs IMAP, POP3, CalDAV et CardDAV.
* Ces journaux peuvent contenir l'adresse IP, l'URL de la requête (y compris les chaînes de requête, par exemple les termes de recherche), les en-têtes de requête tels que l'agent utilisateur, ainsi que le compte ou l'alias concerné.
* Les mots de passe, jetons API, cookies et corps de requête sont expurgés de ces journaux avant leur enregistrement.

### Journaux des serveurs {#server-logs}

* Pour chaque requête vers le site web et l'API, nos serveurs enregistrent une ligne de journal qui peut inclure l'adresse IP, la méthode et l'URL de la requête (y compris les chaînes de requête), les en-têtes de requête, le statut de la réponse et le compte connecté.
* Nous utilisons ces journaux pour repérer et corriger les problèmes et pour stopper les abus, et nous les conservons jusqu'à 30 jours.

### Emails SMTP sortants {#outbound-smtp-emails}

* Nous stockons les [emails SMTP sortants](/faq#do-you-support-sending-email-with-smtp) pendant environ 30 jours.
  * Cette durée varie en fonction de l'en-tête "Date" ; puisque nous autorisons l'envoi d'emails dans le futur si un en-tête "Date" futur existe.
  * **Notez qu'une fois qu'un email est livré avec succès ou qu'une erreur permanente survient, nous expurgerons et supprimerons le corps du message.**
  * Si vous souhaitez configurer la conservation du corps du message de vos emails SMTP sortants plus longtemps que la valeur par défaut de 0 jour (après livraison réussie ou erreur permanente), allez dans les Paramètres avancés de votre domaine et saisissez une valeur entre `0` et `30`.
  * Certains utilisateurs apprécient d'utiliser la fonctionnalité de prévisualisation [Mon compte > Emails](/my-account/emails) pour voir comment leurs emails sont rendus, c'est pourquoi nous supportons une période de conservation configurable.
  * Notez que nous supportons également [OpenPGP/E2EE](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd).


## Traitement temporaire des données {#temporary-data-processing}

Les données suivantes sont traitées temporairement en mémoire ou dans Redis et ne sont **pas** stockées de manière permanente :

### Limitation de débit {#rate-limiting}

* Les adresses IP sont utilisées temporairement dans Redis pour la limitation de débit.
* Les données de limitation de débit expirent automatiquement (généralement sous 24 heures).
* Cela empêche les abus et garantit une utilisation équitable de nos services.

### Suivi des connexions {#connection-tracking}

* Le nombre de connexions simultanées est suivi par adresse IP dans Redis.
* Ces données expirent automatiquement lorsque les connexions se ferment ou après un court délai.
* Utilisé pour prévenir les abus de connexion et assurer la disponibilité du service.

### Tentatives d'authentification {#authentication-attempts}

* Les tentatives d'authentification échouées sont suivies par adresse IP dans Redis.
* Nous stockons également des métadonnées d'authentification limitées au niveau du compte, y compris les compteurs de tentatives de connexion échouées et l'horodatage de la dernière tentative de connexion.
* Les données de tentative d'authentification basées sur Redis expirent automatiquement (généralement dans les 24 heures).
* Utilisé pour prévenir les attaques par force brute sur les comptes utilisateurs.


## Journaux d'audit {#audit-logs}

Pour vous aider à surveiller et sécuriser votre compte et vos domaines, nous conservons des journaux d'audit pour certains changements. Ces journaux sont utilisés pour envoyer des emails de notification aux titulaires de compte et aux administrateurs de domaine.

### Modifications du compte {#account-changes}

* Nous suivons les modifications des paramètres importants du compte (par exemple, l'authentification à deux facteurs, le nom affiché, le fuseau horaire).
* Lorsqu'un changement est détecté, nous envoyons un email de notification à votre adresse email enregistrée.
* Les champs sensibles (par exemple, mot de passe, jetons API, clés de récupération) sont suivis mais leurs valeurs sont expurgées dans les notifications.
* Les entrées du journal d'audit sont supprimées après l'envoi de l'email de notification.

### Modifications des paramètres du domaine {#domain-settings-changes}

Pour les domaines avec plusieurs administrateurs, nous fournissons une journalisation d'audit détaillée pour aider les équipes à suivre les modifications de configuration :

**Ce que nous suivons :**

* Les modifications des paramètres du domaine (par exemple, webhooks de rebond, filtrage anti-spam, configuration DKIM)
* Qui a effectué la modification (adresse email de l'utilisateur)
* Quand la modification a été effectuée (horodatage)
* L'adresse IP depuis laquelle la modification a été faite
* La chaîne user-agent du navigateur/client

**Comment cela fonctionne :**

* Tous les administrateurs du domaine reçoivent un email de notification consolidé unique lorsque les paramètres changent.
* La notification inclut un tableau montrant chaque modification avec l'utilisateur qui l'a effectuée, son adresse IP et l'horodatage.
* Les champs sensibles (par exemple, clés webhook, jetons API, clés privées DKIM) sont suivis mais leurs valeurs sont expurgées.
* Les informations user-agent sont incluses dans une section "Détails techniques" repliable.
* Les entrées du journal d'audit sont supprimées après l'envoi de l'email de notification.

**Pourquoi nous collectons cela :**

* Pour aider les administrateurs de domaine à maintenir une surveillance de sécurité
* Pour permettre aux équipes d'auditer qui a effectué des modifications de configuration
* Pour aider au dépannage en cas de modifications inattendues
* Pour assurer la responsabilité dans la gestion partagée du domaine


## Cookies et sessions {#cookies-and-sessions}

* Nous stockons des cookies signés, uniquement HTTP, et des données de session côté serveur pour le trafic de votre site web.
* Les cookies utilisent la protection SameSite.
* Nous stockons les identifiants de session de site web actifs sur votre compte pour prendre en charge des fonctionnalités telles que "déconnecter les autres appareils" et l'invalidation de session liée à la sécurité.
* Les cookies de session expirent après 30 jours d'inactivité.
* Nous ne créons pas de sessions pour les robots ou les robots d'exploration.
* Nous utilisons des cookies et des sessions pour :
  * L'authentification et l'état de connexion
  * La fonctionnalité "se souvenir de moi" de l'authentification à deux facteurs
  * Les messages flash et les notifications
  * [Analyse](#analytics) : la première page de votre visite, le domaine référent, les paramètres de campagne UTM et un compteur de pages


## Analyse {#analytics}

Nous utilisons notre propre système d’analyse axé sur la confidentialité pour comprendre comment nos services sont utilisés. Ce système est conçu avec la confidentialité comme principe fondamental :

**Ce que nous ne collectons PAS :**

* Nous ne stockons pas les adresses IP
* Nous ne déposons pas de cookie distinct pour l’analyse
* Nous n’utilisons aucun service d’analyse tiers
* Nous ne suivons pas les visiteurs sur plusieurs jours ou sessions lorsqu’ils ne sont pas connectés

**Ce que nous collectons :**

* Vues de pages agrégées et utilisation des services (SMTP, IMAP, POP3, API, etc.)
* Type et version du navigateur et du système d’exploitation (analysés à partir de l’agent utilisateur, données brutes supprimées)
* Type d’appareil (ordinateur de bureau, mobile, tablette)
* Domaine référent (pas l’URL complète) et paramètres de campagne UTM
* Type de client mail pour les protocoles de messagerie (ex. Thunderbird, Outlook)
* La page ou le chemin d’API demandé, dans lequel les valeurs telles que les noms de domaine, les identifiants et les jetons sont remplacées par des espaces réservés, et si la requête a réussi
* Pour les visites du site web, la première page de la visite et un compteur de pages, conservés dans votre session (voir [Cookies et sessions](#cookies-and-sessions))
* Lorsque vous êtes connecté, l’identifiant de votre compte, de votre alias ou de votre domaine, afin que nous puissions voir comment chaque service est utilisé et résoudre les problèmes

**Conservation des données :**

* Les événements analytiques sont automatiquement supprimés après 30 jours
* Les totaux horaires, qui ne sont liés à aucun compte, sont conservés pendant 90 jours
* Les identifiants de session tournent quotidiennement et ne peuvent pas être utilisés pour suivre les visiteurs sur plusieurs jours


## Applications et webmail {#apps-and-webmail}

Cette section concerne nos applications de messagerie pour iOS, Android, macOS, Windows et Linux, ainsi que notre webmail sur <a href="https://mail.forwardemail.net" target="_blank" rel="noopener noreferrer">mail.forwardemail.net</a>, qui partagent le même code. Les applications ne contiennent aucun code publicitaire ou de suivi, ni aucun outil d'analyse tiers.

### Données sur votre appareil {#data-on-your-device}

* Les applications stockent vos emails, contacts, calendriers, paramètres et informations de connexion sur votre appareil, afin de se charger rapidement et de fonctionner hors ligne.
* Si vous activez App Lock, l'application chiffre le contenu des emails, les contacts et les informations de connexion stockés avec une clé protégée par votre code PIN ou votre passkey. Les dates, dossiers, libellés et indicateurs restent non chiffrés afin que l'application puisse trier et compter vos emails.
* La déconnexion d'un compte supprime ses données de votre appareil.

### Données que les applications nous envoient {#data-the-apps-send-us}

* L'adresse email de votre alias et votre mot de passe, à chaque requête, pour vous connecter.
* Les emails, contacts, calendriers, libellés et filtres que vous envoyez, créez ou modifiez. Nous stockons les emails, contacts et calendriers comme décrit dans [Stockage des emails](#email-storage), et les emails que vous envoyez comme décrit dans [Emails SMTP sortants](#outbound-smtp-emails).
* Vos termes de recherche, afin que nous puissions effectuer des recherches dans votre boîte aux lettres sur nos serveurs. Comme les termes de recherche font partie de l'URL de la requête, ils peuvent apparaître dans les [journaux d'erreurs](#error-logs) et les [journaux des serveurs](#server-logs).
* Les retours que vous choisissez d'envoyer depuis l'application. Ils sont transmis par email depuis votre alias à notre équipe d'assistance, avec les informations de diagnostic que vous choisissez d'inclure.
* Les emails que vous signalez comme spam, que l'application transfère à notre équipe anti-abus (ou à une autre adresse que vous définissez dans les paramètres).

### Notifications push {#push-notifications}

* Lorsque vous autorisez les notifications, l'application enregistre un jeton push auprès de nous. Nous le stockons avec la plateforme, l'alias et le compte auxquels il est associé, le moment de sa dernière livraison et un nom d'appareil tiré de l'agent utilisateur de l'application, qui comprend la version de votre système d'exploitation et, sur Android, le modèle de votre appareil.
* Nous conservons un jeton push jusqu'à un an après sa dernière utilisation. Nous le supprimons plus tôt lorsque vous vous déconnectez de l'application, lorsque la livraison échoue trois fois de suite, lorsque le mot de passe de l'alias change, lorsque vous supprimez l'alias ou votre compte, ou lorsque l'alias passe à un autre propriétaire.
* Sur iOS et macOS, les notifications passent par Apple Push Notification service. Dans notre application Android distribuée via Google Play, elles passent par Firebase Cloud Messaging. Les notifications de nouveaux emails contiennent le nom et l'adresse de l'expéditeur, l'objet, un court aperçu et le nom du dossier, y compris pour les emails qui arrivent sans notification visible, comme ceux classés dans le dossier Indésirables ou Envoyés. Lorsque des emails, calendriers ou contacts changent, nous envoyons également des notifications silencieuses avec des identifiants mais sans contenu d'email, afin que l'application reste à jour.
* Avec [UnifiedPush](https://unifiedpush.org/) sur Android, ainsi qu'avec les notifications dans un navigateur web, chaque notification est chiffrée de sorte que seul votre appareil puisse la lire.
* Notre application Android distribuée via Google Play inclut Firebase Cloud Messaging, qui envoie à Google un identifiant d'installation Firebase, la version de l'application ainsi que des informations sur l'appareil et le SDK. Notre application Android sans Google, distribuée via GitHub, n'inclut pas Firebase.

### Images et liens dans les emails {#images-and-links-in-emails}

* Les images des emails sont chargées depuis les serveurs de l'expéditeur, qui peuvent voir votre adresse IP et le moment où les images ont été chargées.
* Les applications bloquent les pixels de suivi par défaut. Vous pouvez aussi bloquer toutes les images externes dans Settings > Privacy & Security, puis les charger pour un email à la fois.
* Les liens dans les emails s'ouvrent dans votre navigateur web.

### Autres connexions {#other-connections}

* Notre webmail demande à GitHub sa dernière version lors de son chargement, lorsque vous y revenez et toutes les 10 minutes tant qu'il est ouvert. About & Help demande à GitHub la dernière version de bureau, et les applications de bureau vérifient auprès de GitHub si des mises à jour sont disponibles. GitHub reçoit votre adresse IP lors de ces requêtes.


## Informations Partagées {#information-shared}

Nous ne partageons pas vos informations avec des tiers, à l'exception des prestataires qui assurent certaines parties de notre service, comme Cloudflare (protection du site web et sauvegardes chiffrées), Stripe et PayPal (paiements), et des services qui acheminent les notifications push vers vos appareils (voir [Notifications push](#push-notifications)).

Nous pouvons être amenés à nous conformer à des demandes légales ordonnées par un tribunal (mais gardez à l’esprit que [nous ne collectons pas les informations mentionnées ci-dessus sous « Informations Non Collectées »](#information-not-collected), donc nous ne pourrons pas les fournir).


## Suppression des Informations {#information-removal}

Si à tout moment vous souhaitez supprimer les informations que vous nous avez fournies, rendez-vous sur <a href="/my-account/security">Mon Compte > Sécurité</a> et cliquez sur « Supprimer le compte ».

Pour prévenir et atténuer les abus, la suppression de votre compte peut nécessiter une révision manuelle par nos administrateurs si vous le supprimez dans les 5 jours suivant votre premier paiement.

Ce processus prend généralement moins de 24 heures et a été mis en place car des utilisateurs spammaient notre service, puis supprimaient rapidement leurs comptes – ce qui nous empêchait de bloquer leurs empreintes de méthode de paiement dans Stripe.

La suppression de votre compte entraîne également la suppression des domaines que vous administrez, de vos alias et des jetons push enregistrés pour ceux-ci. La fiche du compte elle-même subsiste, mais son adresse email, ses informations de facturation, son mot de passe et ses clés d'accès sont supprimés, son authentification à deux facteurs et son jeton API sont révoqués, et nous conservons les données de paiement associées pour les remboursements et la comptabilité. Les journaux et les données analytiques qui font référence à votre compte sont supprimés selon les délais indiqués ci-dessus.

Pour supprimer les données des applications d'un appareil, déconnectez-vous de l'application ou désinstallez-la.


## Divulgations Supplémentaires {#additional-disclosures}

Ce site est protégé par Cloudflare et sa [Politique de Confidentialité](https://www.cloudflare.com/privacypolicy/) ainsi que ses [Conditions d’Utilisation](https://www.cloudflare.com/website-terms/) s’appliquent.
