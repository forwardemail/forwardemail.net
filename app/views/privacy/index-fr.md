# Politique de confidentialité {#privacy-policy}

<img loading="lazy" src="/img/articles/privacy.webp" alt="Politique de confidentialité Forward Email" class="rounded-lg" />


## Table des matières {#table-of-contents}

* [Avertissement](#disclaimer)
* [Informations non collectées](#information-not-collected)
* [Informations collectées](#information-collected)
  * [Informations sur le compte](#account-information)
  * [Stockage des emails](#email-storage)
  * [Journaux d'erreurs](#error-logs)
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
* [Informations partagées](#information-shared)
* [Suppression des informations](#information-removal)
* [Divulgations supplémentaires](#additional-disclosures)


## Avertissement {#disclaimer}

Veuillez vous référer à nos [Conditions](/terms) qui s'appliquent à l'ensemble du site.


## Informations non collectées {#information-not-collected}

**À l'exception des informations expressément décrites dans cette politique — y compris les [journaux d'erreurs](#error-logs), les [e-mails SMTP sortants](#outbound-smtp-emails), les [informations de compte](#account-information), le [traitement temporaire des données](#temporary-data-processing), les [journaux d'audit](#audit-logs), et les [cookies et sessions](#cookies-and-sessions) :**

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
* La première page que vous avez visitée sur notre site
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


## Analyse {#analytics}

Nous utilisons notre propre système d’analyse axé sur la confidentialité pour comprendre comment nos services sont utilisés. Ce système est conçu avec la confidentialité comme principe fondamental :

**Ce que nous ne collectons PAS :**

* Nous ne stockons pas les adresses IP
* Nous n’utilisons pas de cookies ni d’identifiants persistants pour l’analyse
* Nous n’utilisons aucun service d’analyse tiers
* Nous ne suivons pas les utilisateurs sur plusieurs jours ou sessions

**Ce que nous collectons (anonymisé) :**

* Vues de pages agrégées et utilisation des services (SMTP, IMAP, POP3, API, etc.)
* Type de navigateur et système d’exploitation (analysé à partir de l’agent utilisateur, données brutes supprimées)
* Type d’appareil (ordinateur de bureau, mobile, tablette)
* Domaine référent (pas l’URL complète)
* Type de client mail pour les protocoles de messagerie (ex. Thunderbird, Outlook)

**Conservation des données :**

* Les données analytiques sont automatiquement supprimées après 30 jours
* Les identifiants de session tournent quotidiennement et ne peuvent pas être utilisés pour suivre les utilisateurs sur plusieurs jours


## Informations Partagées {#information-shared}

Nous ne partageons pas vos informations avec des tiers.

Nous pouvons être amenés à nous conformer à des demandes légales ordonnées par un tribunal (mais gardez à l’esprit que [nous ne collectons pas les informations mentionnées ci-dessus sous « Informations Non Collectées »](#information-not-collected), donc nous ne pourrons pas les fournir).


## Suppression des Informations {#information-removal}

Si à tout moment vous souhaitez supprimer les informations que vous nous avez fournies, rendez-vous sur <a href="/my-account/security">Mon Compte > Sécurité</a> et cliquez sur « Supprimer le compte ».

Pour prévenir et atténuer les abus, la suppression de votre compte peut nécessiter une révision manuelle par nos administrateurs si vous le supprimez dans les 5 jours suivant votre premier paiement.

Ce processus prend généralement moins de 24 heures et a été mis en place car des utilisateurs spammaient notre service, puis supprimaient rapidement leurs comptes – ce qui nous empêchait de bloquer leurs empreintes de méthode de paiement dans Stripe.


## Divulgations Supplémentaires {#additional-disclosures}

Ce site est protégé par Cloudflare et sa [Politique de Confidentialité](https://www.cloudflare.com/privacypolicy/) ainsi que ses [Conditions d’Utilisation](https://www.cloudflare.com/website-terms/) s’appliquent.
