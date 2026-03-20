# Questions Fréquemment Posées {#frequently-asked-questions}

<img loading="lazy" src="/img/articles/faq.webp" alt="Questions fréquemment posées sur Forward Email" class="rounded-lg" />


## Table des Matières {#table-of-contents}

* [Démarrage Rapide](#quick-start)
* [Introduction](#introduction)
  * [Qu'est-ce que Forward Email](#what-is-forward-email)
  * [Qui utilise Forward Email](#who-uses-forward-email)
  * [Quelle est l'histoire de Forward Email](#what-is-forward-emails-history)
  * [Quelle est la rapidité de ce service](#how-fast-is-this-service)
* [Clients Email](#email-clients)
  * [Thunderbird](#thunderbird)
  * [Microsoft Outlook](#microsoft-outlook)
  * [Apple Mail](#apple-mail)
  * [eM Client](#em-client)
  * [Appareils Mobiles](#mobile-devices)
  * [Configuration du relais SMTP Sendmail](#sendmail-smtp-relay-configuration)
  * [Configuration du relais SMTP Exim4](#exim4-smtp-relay-configuration)
  * [Configuration du client SMTP msmtp](#msmtp-smtp-client-configuration)
  * [Clients Email en ligne de commande](#command-line-email-clients)
  * [Configuration Email Windows](#windows-email-configuration)
  * [Configuration du relais SMTP Postfix](#postfix-smtp-relay-configuration)
  * [Comment envoyer un mail en utilisant Gmail](#how-to-send-mail-as-using-gmail)
  * [Quel est le guide gratuit hérité pour envoyer un mail en utilisant Gmail](#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail)
  * [Configuration avancée du routage Gmail](#advanced-gmail-routing-configuration)
  * [Configuration avancée du routage Outlook](#advanced-outlook-routing-configuration)
* [Dépannage](#troubleshooting)
  * [Pourquoi ne reçois-je pas mes emails de test](#why-am-i-not-receiving-my-test-emails)
  * [Comment configurer mon client email pour fonctionner avec Forward Email](#how-do-i-configure-my-email-client-to-work-with-forward-email)
  * [Pourquoi mes emails atterrissent-ils dans les spams et courriers indésirables et comment vérifier la réputation de mon domaine](#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation)
  * [Que faire si je reçois des emails de spam](#what-should-i-do-if-i-receive-spam-emails)
  * [Pourquoi mes emails de test envoyés à moi-même dans Gmail apparaissent-ils comme "suspects"](#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious)
  * [Puis-je supprimer le via forwardemail dot net dans Gmail](#can-i-remove-the-via-forwardemail-dot-net-in-gmail)
* [Gestion des Données](#data-management)
  * [Où sont situés vos serveurs](#where-are-your-servers-located)
  * [Comment exporter et sauvegarder ma boîte aux lettres](#how-do-i-export-and-backup-my-mailbox)
  * [Comment importer et migrer ma boîte aux lettres existante](#how-do-i-import-and-migrate-my-existing-mailbox)
  * [Comment utiliser mon propre stockage compatible S3 pour les sauvegardes](#how-do-i-use-my-own-s3-compatible-storage-for-backups)
  * [Comment convertir les sauvegardes SQLite en fichiers EML](#how-do-i-convert-sqlite-backups-to-eml-files)
  * [Supportez-vous l'auto-hébergement](#do-you-support-self-hosting)
* [Configuration Email](#email-configuration)
  * [Comment démarrer et configurer le transfert d'email](#how-do-i-get-started-and-set-up-email-forwarding)
  * [Puis-je utiliser plusieurs échanges MX et serveurs pour un transfert avancé](#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding)
  * [Comment configurer un répondeur de vacances (répondeur automatique hors bureau)](#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder)
  * [Comment configurer SPF pour Forward Email](#how-do-i-set-up-spf-for-forward-email)
  * [Comment configurer DKIM pour Forward Email](#how-do-i-set-up-dkim-for-forward-email)
  * [Comment configurer DMARC pour Forward Email](#how-do-i-set-up-dmarc-for-forward-email)
  * [Comment consulter les rapports DMARC](#how-do-i-view-dmarc-reports)
  * [Comment connecter et configurer mes contacts](#how-do-i-connect-and-configure-my-contacts)
  * [Comment connecter et configurer mes calendriers](#how-do-i-connect-and-configure-my-calendars)
  * [Comment ajouter plus de calendriers et gérer les calendriers existants](#how-do-i-add-more-calendars-and-manage-existing-calendars)
  * [Comment connecter et configurer les tâches et rappels](#how-do-i-connect-and-configure-tasks-and-reminders)
  * [Pourquoi ne puis-je pas créer de tâches dans les Rappels macOS](#why-cant-i-create-tasks-in-macos-reminders)
  * [Comment configurer Tasks.org sur Android](#how-do-i-set-up-tasksorg-on-android)
  * [Comment configurer SRS pour Forward Email](#how-do-i-set-up-srs-for-forward-email)
  * [Comment configurer MTA-STS pour Forward Email](#how-do-i-set-up-mta-sts-for-forward-email)
  * [Comment ajouter une photo de profil à mon adresse email](#how-do-i-add-a-profile-picture-to-my-email-address)
* [Fonctionnalités Avancées](#advanced-features)
  * [Supportez-vous les newsletters ou listes de diffusion pour les emails marketing](#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email)
  * [Supportez-vous l'envoi d'emails via API](#do-you-support-sending-email-with-api)
  * [Supportez-vous la réception d'emails via IMAP](#do-you-support-receiving-email-with-imap)
  * [Supportez-vous POP3](#do-you-support-pop3)
  * [Supportez-vous les calendriers (CalDAV)](#do-you-support-calendars-caldav)
  * [Supportez-vous les tâches et rappels (CalDAV VTODO)](#do-you-support-tasks-and-reminders-caldav-vtodo)
  * [Supportez-vous les contacts (CardDAV)](#do-you-support-contacts-carddav)
  * [Supportez-vous l'envoi d'emails via SMTP](#do-you-support-sending-email-with-smtp)
  * [Supportez-vous OpenPGP/MIME, le chiffrement de bout en bout ("E2EE"), et Web Key Directory ("WKD")](#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd)
  * [Supportez-vous le chiffrement S/MIME](#do-you-support-smime-encryption)
  * [Supportez-vous le filtrage d'emails Sieve](#do-you-support-sieve-email-filtering)
  * [Supportez-vous MTA-STS](#do-you-support-mta-sts)
  * [Supportez-vous les passkeys et WebAuthn](#do-you-support-passkeys-and-webauthn)
  * [Supportez-vous les bonnes pratiques email](#do-you-support-email-best-practices)
  * [Supportez-vous les webhooks de rebond](#do-you-support-bounce-webhooks)
  * [Supportez-vous les webhooks](#do-you-support-webhooks)
  * [Supportez-vous les expressions régulières ou regex](#do-you-support-regular-expressions-or-regex)
  * [Quelles sont vos limites SMTP sortantes](#what-are-your-outbound-smtp-limits)
  * [Ai-je besoin d'une approbation pour activer SMTP](#do-i-need-approval-to-enable-smtp)
  * [Quels sont les paramètres de configuration de votre serveur SMTP](#what-are-your-smtp-server-configuration-settings)
  * [Quels sont les paramètres de configuration de votre serveur IMAP](#what-are-your-imap-server-configuration-settings)
  * [Quels sont les paramètres de configuration de votre serveur POP3](#what-are-your-pop3-server-configuration-settings)
  * [Comment configurer la découverte automatique d'email pour mon domaine](#how-do-i-set-up-email-autodiscovery-for-my-domain)
* [Sécurité](#security-1)
  * [Techniques avancées de durcissement des serveurs](#advanced-server-hardening-techniques)
  * [Avez-vous des certifications SOC 2 ou ISO 27001](#do-you-have-soc-2-or-iso-27001-certifications)
  * [Utilisez-vous le chiffrement TLS pour le transfert d'email](#do-you-use-tls-encryption-for-email-forwarding)
  * [Préservez-vous les en-têtes d'authentification des emails](#do-you-preserve-email-authentication-headers)
  * [Préservez-vous les en-têtes originaux des emails et empêchez-vous le spoofing](#do-you-preserve-original-email-headers-and-prevent-spoofing)
  * [Comment protégez-vous contre le spam et les abus](#how-do-you-protect-against-spam-and-abuse)
  * [Stockez-vous le contenu des emails sur disque](#do-you-store-email-content-on-disk)
  * [Le contenu des emails peut-il être exposé lors de pannes système](#can-email-content-be-exposed-during-system-crashes)
  * [Qui a accès à votre infrastructure email](#who-has-access-to-your-email-infrastructure)
  * [Quels fournisseurs d'infrastructure utilisez-vous](#what-infrastructure-providers-do-you-use)
  * [Proposez-vous un accord de traitement des données (DPA)](#do-you-offer-a-data-processing-agreement-dpa)
  * [Comment gérez-vous les notifications de violation de données](#how-do-you-handle-data-breach-notifications)
  * [Proposez-vous un environnement de test](#do-you-offer-a-test-environment)
  * [Fournissez-vous des outils de surveillance et d'alerte](#do-you-provide-monitoring-and-alerting-tools)
  * [Comment assurez-vous une haute disponibilité](#how-do-you-ensure-high-availability)
  * [Êtes-vous conforme à la Section 889 de la Loi d'Autorisation de la Défense Nationale (NDAA)](#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa)
* [Détails Systèmes et Techniques](#system-and-technical-details)
  * [Stockez-vous les emails et leur contenu](#do-you-store-emails-and-their-contents)
  * [Comment fonctionne votre système de transfert d'email](#how-does-your-email-forwarding-system-work)
  * [Comment traitez-vous un email pour le transfert](#how-do-you-process-an-email-for-forwarding)
  * [Comment gérez-vous les problèmes de livraison d'email](#how-do-you-handle-email-delivery-issues)
  * [Comment gérez-vous le blocage de vos adresses IP](#how-do-you-handle-your-ip-addresses-becoming-blocked)
  * [Quelles sont les adresses postmaster](#what-are-postmaster-addresses)
  * [Quelles sont les adresses no-reply](#what-are-no-reply-addresses)
  * [Quelles sont les adresses IP de vos serveurs](#what-are-your-servers-ip-addresses)
  * [Avez-vous une liste blanche](#do-you-have-an-allowlist)
  * [Quelles extensions de noms de domaine sont autorisées par défaut](#what-domain-name-extensions-are-allowlisted-by-default)
  * [Quels sont vos critères de liste blanche](#what-is-your-allowlist-criteria)
  * [Quelles extensions de noms de domaine peuvent être utilisées gratuitement](#what-domain-name-extensions-can-be-used-for-free)
  * [Avez-vous une liste grise](#do-you-have-a-greylist)
  * [Avez-vous une liste noire](#do-you-have-a-denylist)
  * [Avez-vous une limitation de débit](#do-you-have-rate-limiting)
  * [Comment protégez-vous contre le backscatter](#how-do-you-protect-against-backscatter)
  * [Prévenir les rebonds des spammeurs connus MAIL FROM](#prevent-bounces-from-known-mail-from-spammers)
  * [Prévenir les rebonds inutiles pour protéger contre le backscatter](#prevent-unnecessary-bounces-to-protect-against-backscatter)
  * [Comment déterminez-vous l'empreinte d'un email](#how-do-you-determine-an-email-fingerprint)
  * [Puis-je transférer des emails vers des ports autres que le 25 (par ex. si mon FAI a bloqué le port 25)](#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25)
  * [Supporte-t-il le symbole plus + pour les alias Gmail](#does-it-support-the-plus--symbol-for-gmail-aliases)
  * [Supporte-t-il les sous-domaines](#does-it-support-sub-domains)
  * [Est-ce que cela transfère les en-têtes de mes emails](#does-this-forward-my-emails-headers)
  * [Est-ce bien testé](#is-this-well-tested)
  * [Transmettez-vous les messages et codes de réponse SMTP](#do-you-pass-along-smtp-response-messages-and-codes)
  * [Comment empêchez-vous les spammeurs et assurez-vous une bonne réputation de transfert d'email](#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation)
  * [Comment effectuez-vous les recherches DNS sur les noms de domaine](#how-do-you-perform-dns-lookups-on-domain-names)
* [Compte et Facturation](#account-and-billing)
  * [Proposez-vous une garantie de remboursement sur les plans payants](#do-you-offer-a-money-back-guarantee-on-paid-plans)
  * [Si je change de plan, faites-vous un prorata et remboursez-vous la différence](#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference)
  * [Puis-je utiliser ce service de transfert d'email comme serveur MX "de secours" ou "de basculement"](#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server)
  * [Puis-je désactiver des alias spécifiques](#can-i-disable-specific-aliases)
  * [Puis-je transférer des emails à plusieurs destinataires](#can-i-forward-emails-to-multiple-recipients)
  * [Puis-je avoir plusieurs destinataires globaux catch-all](#can-i-have-multiple-global-catch-all-recipients)
  * [Y a-t-il une limite maximale au nombre d'adresses email vers lesquelles je peux transférer par alias](#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias)
  * [Puis-je transférer des emails de manière récursive](#can-i-recursively-forward-emails)
  * [Les gens peuvent-ils désenregistrer ou enregistrer mon transfert d'email sans ma permission](#can-people-unregister-or-register-my-email-forwarding-without-my-permission)
  * [Comment est-ce gratuit](#how-is-it-free)
  * [Quelle est la taille maximale d'email](#what-is-the-max-email-size-limit)
  * [Stockez-vous les journaux des emails](#do-you-store-logs-of-emails)
  * [Stockez-vous les journaux d'erreurs](#do-you-store-error-logs)
  * [Lisez-vous mes emails](#do-you-read-my-emails)
  * [Puis-je "envoyer un mail en tant que" dans Gmail avec ceci](#can-i-send-mail-as-in-gmail-with-this)
  * [Puis-je "envoyer un mail en tant que" dans Outlook avec ceci](#can-i-send-mail-as-in-outlook-with-this)
  * [Puis-je "envoyer un mail en tant que" dans Apple Mail et iCloud Mail avec ceci](#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this)
  * [Puis-je transférer un nombre illimité d'emails avec ceci](#can-i-forward-unlimited-emails-with-this)
  * [Proposez-vous des domaines illimités pour un prix unique](#do-you-offer-unlimited-domains-for-one-price)
  * [Quels moyens de paiement acceptez-vous](#which-payment-methods-do-you-accept)
* [Ressources Supplémentaires](#additional-resources)
## Démarrage rapide {#quick-start}

Pour commencer avec Forward Email :

1. **Créez un compte** sur [forwardemail.net/register](https://forwardemail.net/register)

2. **Ajoutez et vérifiez votre domaine** dans [Mon Compte → Domaines](/my-account/domains)

3. **Ajoutez et configurez des alias/boîtes mail** dans [Mon Compte → Domaines](/my-account/domains) → Alias

4. **Testez votre configuration** en envoyant un email à l’un de vos nouveaux alias

> \[!TIP]
> Les modifications DNS peuvent prendre jusqu’à 24-48 heures pour se propager globalement, bien qu’elles prennent souvent effet beaucoup plus tôt.

> \[!IMPORTANT]
> Pour une meilleure délivrabilité, nous recommandons de configurer les enregistrements [SPF](#how-do-i-set-up-spf-for-forward-email), [DKIM](#how-do-i-set-up-dkim-for-forward-email) et [DMARC](#how-do-i-set-up-dmarc-for-forward-email).


## Introduction {#introduction}

### Qu’est-ce que Forward Email {#what-is-forward-email}

> \[!NOTE]
> Forward Email est parfait pour les particuliers, les petites entreprises et les développeurs qui souhaitent des adresses email professionnelles sans le coût et la maintenance d’une solution complète d’hébergement email.

Forward Email est un **fournisseur de service email complet** et un **fournisseur d’hébergement email pour noms de domaine personnalisés**.

C’est le seul service gratuit et open-source, qui vous permet d’utiliser des adresses email avec un domaine personnalisé sans la complexité de configurer et maintenir votre propre serveur email.

Notre service transfère les emails envoyés à votre domaine personnalisé vers votre compte email existant – et vous pouvez même nous utiliser comme votre fournisseur d’hébergement email dédié.

Fonctionnalités clés de Forward Email :

* **Email avec domaine personnalisé** : Utilisez des adresses email professionnelles avec votre propre nom de domaine
* **Offre gratuite** : Transfert d’email basique sans frais
* **Confidentialité renforcée** : Nous ne lisons pas vos emails ni ne vendons vos données
* **Open Source** : L’intégralité de notre code est disponible sur GitHub
* **Support SMTP, IMAP et POP3** : Capacités complètes d’envoi et de réception d’emails
* **Chiffrement de bout en bout** : Support pour OpenPGP/MIME
* **Alias Catch-All personnalisés** : Créez un nombre illimité d’alias email

Vous pouvez nous comparer à plus de 56 autres fournisseurs de service email sur [notre page de comparaison d’emails](/blog/best-email-service).

> \[!TIP]
> En savoir plus sur Forward Email en lisant notre [Livre blanc technique](/technical-whitepaper.pdf) gratuit

### Qui utilise Forward Email {#who-uses-forward-email}

Nous fournissons un service d’hébergement et de transfert d’emails à plus de 500 000 domaines et ces utilisateurs notables :

| Client                                  | Étude de cas                                                                                             |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| U.S. Naval Academy                      | [:page_facing_up: Étude de cas](/blog/docs/federal-government-email-service-section-889-compliant)       |
| Canonical                               | [:page_facing_up: Étude de cas](/blog/docs/canonical-ubuntu-email-enterprise-case-study)                 |
| Netflix Games                           |                                                                                                          |
| The Linux Foundation                    | [:page_facing_up: Étude de cas](/blog/docs/linux-foundation-email-enterprise-case-study)                 |
| The PHP Foundation                      |                                                                                                          |
| Fox News Radio                          |                                                                                                          |
| Disney Ad Sales                         |                                                                                                          |
| jQuery                                  | [:page_facing_up: Étude de cas](/blog/docs/linux-foundation-email-enterprise-case-study)                 |
| LineageOS                               |                                                                                                          |
| Ubuntu                                  | [:page_facing_up: Étude de cas](/blog/docs/canonical-ubuntu-email-enterprise-case-study)                 |
| Kubuntu                                 | [:page_facing_up: Étude de cas](/blog/docs/canonical-ubuntu-email-enterprise-case-study)                 |
| Lubuntu                                 | [:page_facing_up: Étude de cas](/blog/docs/canonical-ubuntu-email-enterprise-case-study)                 |
| The University of Cambridge             | [:page_facing_up: Étude de cas](/blog/docs/alumni-email-forwarding-university-case-study)                |
| The University of Maryland              | [:page_facing_up: Étude de cas](/blog/docs/alumni-email-forwarding-university-case-study)                |
| The University of Washington            | [:page_facing_up: Étude de cas](/blog/docs/alumni-email-forwarding-university-case-study)                |
| Tufts University                        | [:page_facing_up: Étude de cas](/blog/docs/alumni-email-forwarding-university-case-study)                |
| Swarthmore College                      | [:page_facing_up: Étude de cas](/blog/docs/alumni-email-forwarding-university-case-study)                |
| Government of South Australia           |                                                                                                          |
| Government of Dominican Republic        |                                                                                                          |
| Fly<span>.</span>io                     |                                                                                                          |
| RCD Hotels                              |                                                                                                          |
| Isaac Z. Schlueter (npm)                | [:page_facing_up: Étude de cas](/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem) |
| David Heinemeier Hansson (Ruby on Rails) |                                                                                                          |
### Quelle est l'histoire de Forward Email {#what-is-forward-emails-history}

Vous pouvez en apprendre plus sur Forward Email sur [notre page À propos](/about).

### Quelle est la rapidité de ce service {#how-fast-is-this-service}

> \[!NOTE]
> Notre système est conçu pour la rapidité et la fiabilité, avec plusieurs serveurs redondants pour garantir que vos emails sont livrés rapidement.

Forward Email délivre les messages avec un délai minimal, généralement en quelques secondes après réception.

Mesures de performance :

* **Temps moyen de livraison** : Moins de 5-10 secondes entre la réception et le transfert ([voir notre page de surveillance Time to Inbox "TTI"](/tti))
* **Disponibilité** : Plus de 99,9 % de disponibilité du service
* **Infrastructure mondiale** : Serveurs stratégiquement situés pour un routage optimal
* **Mise à l'échelle automatique** : Notre système s'adapte pendant les pics d'envoi d'emails

Nous opérons en temps réel, contrairement à d'autres fournisseurs qui utilisent des files d'attente différées.

Nous n'écrivons pas sur disque ni ne stockons de journaux – à [l'exception des erreurs](#do-you-store-error-logs) et du [SMTP sortant](#do-you-support-sending-email-with-smtp) (voir notre [Politique de confidentialité](/privacy)).

Tout est fait en mémoire et [notre code source est sur GitHub](https://github.com/forwardemail).


## Clients Email {#email-clients}

### Thunderbird {#thunderbird}

1. Créez un nouvel alias et générez un mot de passe dans votre tableau de bord Forward Email
2. Ouvrez Thunderbird et allez dans **Édition → Paramètres des comptes → Actions sur le compte → Ajouter un compte de messagerie**
3. Entrez votre nom, votre adresse Forward Email, et votre mot de passe
4. Cliquez sur **Configurer manuellement** et saisissez :
   * Entrant : IMAP, `imap.forwardemail.net`, port 993, SSL/TLS
   * Sortant : SMTP, `smtp.forwardemail.net`, port 465, SSL/TLS (recommandé ; le port 587 avec STARTTLS est aussi supporté)
5. Cliquez sur **Terminé**

### Microsoft Outlook {#microsoft-outlook}

1. Créez un nouvel alias et générez un mot de passe dans votre tableau de bord Forward Email
2. Allez dans **Fichier → Ajouter un compte**
3. Entrez votre adresse Forward Email et cliquez sur **Connecter**
4. Choisissez **Options avancées** et sélectionnez **Me laisser configurer mon compte manuellement**
5. Sélectionnez **IMAP** et entrez :
   * Entrant : `imap.forwardemail.net`, port 993, SSL
   * Sortant : `smtp.forwardemail.net`, port 465, SSL/TLS (recommandé ; port 587 avec STARTTLS aussi supporté)
   * Nom d'utilisateur : Votre adresse email complète
   * Mot de passe : Votre mot de passe généré
6. Cliquez sur **Connecter**

### Apple Mail {#apple-mail}

1. Créez un nouvel alias et générez un mot de passe dans votre tableau de bord Forward Email
2. Allez dans **Mail → Préférences → Comptes → +**
3. Sélectionnez **Autre compte Mail**
4. Entrez votre nom, votre adresse Forward Email, et votre mot de passe
5. Pour les paramètres du serveur, saisissez :
   * Entrant : `imap.forwardemail.net`
   * Sortant : `smtp.forwardemail.net`
   * Nom d'utilisateur : Votre adresse email complète
   * Mot de passe : Votre mot de passe généré
6. Cliquez sur **Se connecter**

### eM Client {#em-client}

1. Créez un nouvel alias et générez un mot de passe dans votre tableau de bord Forward Email
2. Ouvrez eM Client et allez dans **Menu → Comptes → + Ajouter un compte**
3. Cliquez sur **Mail** puis sélectionnez **Autre**
4. Entrez votre adresse Forward Email et cliquez sur **Suivant**
5. Entrez les paramètres de serveur suivants :
   * **Serveur entrant** : `imap.forwardemail.net`
   * **Serveur sortant** : `smtp.forwardemail.net`
6. Entrez votre adresse email complète comme **Nom d'utilisateur** et votre mot de passe généré comme **Mot de passe** pour les serveurs entrant et sortant.
7. eM Client testera la connexion. Une fois réussie, cliquez sur **Suivant**.
8. Entrez votre nom et choisissez un nom de compte.
9. Cliquez sur **Terminer**.

### Appareils mobiles {#mobile-devices}

Pour iOS :

1. Allez dans **Réglages → Mail → Comptes → Ajouter un compte → Autre**
2. Touchez **Ajouter un compte Mail** et entrez vos informations
3. Pour les paramètres du serveur, utilisez les mêmes paramètres IMAP et SMTP que ci-dessus

Pour Android :

1. Allez dans **Paramètres → Comptes → Ajouter un compte → Personnel (IMAP)**
2. Entrez votre adresse Forward Email et votre mot de passe
3. Pour les paramètres du serveur, utilisez les mêmes paramètres IMAP et SMTP que ci-dessus

### Configuration du relais SMTP Sendmail {#sendmail-smtp-relay-configuration}

Vous pouvez configurer Sendmail pour relayer les emails via les serveurs SMTP de Forward Email. C'est une configuration courante pour les systèmes hérités ou les applications qui dépendent de Sendmail.
<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Temps d'installation estimé :</strong>
  <span>Moins de 20 minutes</span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Important :
  </strong>
  <span>
    Cela nécessite un plan payant avec l'accès SMTP activé.
  </span>
</div>

#### Configuration {#configuration}

1. Modifiez votre fichier `sendmail.mc`, généralement situé dans `/etc/mail/sendmail.mc` :

   ```bash
   sudo nano /etc/mail/sendmail.mc
   ```

2. Ajoutez les lignes suivantes pour définir le smart host et l'authentification :

   ```
   define(`SMART_HOST', `smtp.forwardemail.net')dnl
   define(`RELAY_MAILER_ARGS', `TCP $h 465')dnl
   define(`confAUTH_MECHANISMS', `EXTERNAL GSSAPI DIGEST-MD5 CRAM-MD5 LOGIN PLAIN')dnl
   FEATURE(`authinfo',`hash -o /etc/mail/authinfo.db')dnl
   ```

3. Créez le fichier d'authentification `/etc/mail/authinfo` :

   ```bash
   sudo nano /etc/mail/authinfo
   ```

4. Ajoutez vos identifiants Forward Email dans le fichier `authinfo` :

   ```
   AuthInfo:smtp.forwardemail.net "U:your-alias@yourdomain.com" "P:your-generated-password" "M:PLAIN"
   ```

5. Générez la base de données d'authentification et sécurisez les fichiers :

   ```bash
   sudo makemap hash /etc/mail/authinfo < /etc/mail/authinfo
   sudo chmod 600 /etc/mail/authinfo /etc/mail/authinfo.db
   ```

6. Reconstruisez la configuration de Sendmail et redémarrez le service :

   ```bash
   sudo make -C /etc/mail
   sudo systemctl restart sendmail
   ```

#### Test {#testing}

Envoyez un email de test pour vérifier la configuration :

```bash
echo "Test email from Sendmail" | mail -s "Sendmail Test" recipient@example.com
```

### Configuration du relais SMTP Exim4 {#exim4-smtp-relay-configuration}

Exim4 est un MTA populaire sur les systèmes basés sur Debian. Vous pouvez le configurer pour utiliser Forward Email comme smarthost.

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Temps d'installation estimé :</strong>
  <span>Moins de 15 minutes</span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Important :
  </strong>
  <span>
    Cela nécessite un plan payant avec l'accès SMTP activé.
  </span>
</div>

#### Configuration {#configuration-1}

1. Lancez l'outil de configuration d'Exim4 :

   ```bash
   sudo dpkg-reconfigure exim4-config
   ```

2. Sélectionnez les options suivantes :
   * **Type général de configuration du courrier :** courrier envoyé par smarthost ; reçu via SMTP ou fetchmail
   * **Nom du système de messagerie :** your.hostname
   * **Adresses IP à écouter pour les connexions SMTP entrantes :** 127.0.0.1 ; ::1
   * **Autres destinations pour lesquelles le courrier est accepté :** (laisser vide)
   * **Domaines pour lesquels relayer le courrier :** (laisser vide)
   * **Adresse IP ou nom d'hôte du smarthost sortant :** smtp.forwardemail.net::465
   * **Masquer le nom local dans le courrier sortant ?** Non
   * **Limiter le nombre de requêtes DNS (Dial-on-Demand) ?** Non
   * **Méthode de livraison pour le courrier local :** format Mbox dans /var/mail/
   * **Diviser la configuration en petits fichiers ?** Non

3. Modifiez le fichier `passwd.client` pour ajouter vos identifiants :

   ```bash
   sudo nano /etc/exim4/passwd.client
   ```

4. Ajoutez la ligne suivante :

   ```
   smtp.forwardemail.net:your-alias@yourdomain.com:your-generated-password
   ```

5. Mettez à jour la configuration et redémarrez Exim4 :

   ```bash
   sudo update-exim4.conf
   sudo systemctl restart exim4
   ```

#### Test {#testing-1}

Envoyez un email de test :

```bash
echo "Test from Exim4" | mail -s "Exim4 Test" recipient@example.com
```

### Configuration du client SMTP msmtp {#msmtp-smtp-client-configuration}

msmtp est un client SMTP léger utile pour envoyer des emails depuis des scripts ou des applications en ligne de commande.

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Temps d'installation estimé :</strong>
  <span>Moins de 10 minutes</span>
</div>
<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Important :
  </strong>
  <span>
    Cela nécessite un plan payant avec l'accès SMTP activé.
  </span>
</div>

#### Configuration {#configuration-2}

1. Créez ou modifiez le fichier de configuration msmtp à `~/.msmtprc` :

   ```bash
   nano ~/.msmtprc
   ```

2. Ajoutez la configuration suivante :

   ```
   defaults
   auth           on
   tls            on
   tls_trust_file /etc/ssl/certs/ca-certificates.crt
   logfile        ~/.msmtp.log

   account        forwardemail
   host           smtp.forwardemail.net
   port           465
   tls_starttls   off
   from           your-alias@yourdomain.com
   user           your-alias@yourdomain.com
   password       your-generated-password

   account default : forwardemail
   ```

3. Définissez les permissions correctes pour le fichier de configuration :

   ```bash
   chmod 600 ~/.msmtprc
   ```

#### Test {#testing-2}

Envoyez un email de test :

```bash
echo "This is a test email from msmtp" | msmtp -a default recipient@example.com
```

### Clients email en ligne de commande {#command-line-email-clients}

Les clients email en ligne de commande populaires comme [Mutt](https://gitlab.com/muttmua/mutt), [NeoMutt](https://neomutt.org), et [Alpine](https://alpine.x10.mx/alpine/release/) peuvent être configurés pour utiliser les serveurs SMTP de Forward Email pour l'envoi de mails. La configuration sera similaire à celle de `msmtp`, où vous fournissez les détails du serveur SMTP et vos identifiants dans les fichiers de configuration respectifs (`.muttrc`, `.neomuttrc`, ou `.pinerc`).

### Configuration email sous Windows {#windows-email-configuration}

Pour les utilisateurs Windows, vous pouvez configurer des clients email populaires comme **Microsoft Outlook** et **eM Client** en utilisant les paramètres IMAP et SMTP fournis dans votre compte Forward Email. Pour une utilisation en ligne de commande ou en script, vous pouvez utiliser la cmdlet PowerShell `Send-MailMessage` (bien qu'elle soit considérée comme obsolète) ou un outil relais SMTP léger comme [E-MailRelay](https://github.com/graeme-walker/emailrelay).

### Configuration du relais SMTP Postfix {#postfix-smtp-relay-configuration}

Vous pouvez configurer Postfix pour relayer les emails via les serveurs SMTP de Forward Email. Cela est utile pour les applications serveur qui doivent envoyer des emails.

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Temps estimé d'installation :</strong>
  <span>Moins de 15 minutes</span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Important :
  </strong>
  <span>
    Cela nécessite un plan payant avec l'accès SMTP activé.
  </span>
</div>

#### Installation {#installation}

1. Installez Postfix sur votre serveur :

```bash
# Ubuntu/Debian
sudo apt update && sudo apt install postfix

# CentOS/RHEL
sudo yum install postfix

# macOS
brew install postfix
```

2. Lors de l'installation, sélectionnez "Internet Site" lorsque vous êtes invité à choisir le type de configuration.

#### Configuration {#configuration-3}

1. Modifiez le fichier principal de configuration Postfix :

```bash
sudo nano /etc/postfix/main.cf
```

2. Ajoutez ou modifiez ces paramètres :

```
# Configuration du relais SMTP
relayhost = [smtp.forwardemail.net]:465
smtp_tls_wrappermode = yes
smtp_tls_security_level = encrypt
smtp_sasl_auth_enable = yes
smtp_sasl_password_maps = hash:/etc/postfix/sasl_passwd
smtp_sasl_security_options = noanonymous
smtp_tls_CAfile = /etc/ssl/certs/ca-certificates.crt
```

3. Créez le fichier de mot de passe SASL :

```bash
sudo nano /etc/postfix/sasl_passwd
```

4. Ajoutez vos identifiants Forward Email :

```
[smtp.forwardemail.net]:465 your-alias@yourdomain.com:your-generated-password
```

5. Sécurisez et hachez le fichier de mot de passe :

```bash
sudo chmod 600 /etc/postfix/sasl_passwd
sudo postmap /etc/postfix/sasl_passwd
```

6. Redémarrez Postfix :

```bash
sudo systemctl restart postfix
```

#### Test {#testing-3}

Testez votre configuration en envoyant un email de test :

```bash
echo "Test email body" | mail -s "Test Subject" recipient@example.com
```

### Comment envoyer un mail en tant que via Gmail {#how-to-send-mail-as-using-gmail}
<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Temps d'installation estimé :</strong>
  <span>Moins de 10 minutes</span>
</div>

<div class="alert mb-3 alert-success">
  <i class="fa fa-bullhorn font-weight-bold"></i>
  <strong class="font-weight-bold">
    Pour commencer :
  </strong>
  <span>
    Si vous avez suivi les instructions ci-dessus dans <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">Comment démarrer et configurer le transfert d'e-mails</a>, vous pouvez continuer à lire ci-dessous.
  </span>
</div>

<div id="send-mail-as-content">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Important :
  </strong>
  <span>
    Veuillez vous assurer d'avoir lu nos <a href="/terms" class="alert-link" target="_blank">Conditions</a>, <a href="/privacy" class="alert-link" target="_blank">Politique de confidentialité</a>, et <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Limites SMTP sortantes</a> &ndash; votre utilisation est considérée comme une reconnaissance et un accord.
  </span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Important :
  </strong>
  <span>
    Si vous êtes développeur, veuillez consulter notre <a class="alert-link" href="/email-api#outbound-emails" target="_blank">documentation API e-mail</a>.
  </span>
</div>

1. Allez dans <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Mon compte <i class="fa fa-angle-right"></i> Domaines</a> <i class="fa fa-angle-right"></i> Paramètres <i class="fa fa-angle-right"></i> Configuration SMTP sortante et suivez les instructions d'installation

2. Créez un nouvel alias pour votre domaine sous <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mon compte <i class="fa fa-angle-right"></i> Domaines</a> <i class="fa fa-angle-right"></i> Alias (par exemple <code><hello@example.com></code>)

3. Cliquez sur <strong class="text-success"><i class="fa fa-key"></i> Générer un mot de passe</strong> à côté de l'alias nouvellement créé. Copiez-le dans votre presse-papiers et stockez en toute sécurité le mot de passe généré affiché à l'écran.

4. Allez sur [Gmail](https://gmail.com) et sous [Paramètres <i class="fa fa-angle-right"></i> Comptes et importation <i class="fa fa-angle-right"></i> Envoyer des e-mails en tant que](https://mail.google.com/mail/u/0/#settings/accounts), cliquez sur "Ajouter une autre adresse e-mail"

5. Lorsque vous êtes invité à saisir le "Nom", entrez le nom que vous souhaitez voir apparaître comme expéditeur (par exemple "Linus Torvalds").

6. Lorsque vous êtes invité à saisir "Adresse e-mail", entrez l'adresse e-mail complète d'un alias que vous avez créé sous <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mon compte <i class="fa fa-angle-right"></i> Domaines</a> <i class="fa fa-angle-right"></i> Alias (par exemple <code><hello@example.com></code>)

7. Décochez "Traiter comme un alias"

8. Cliquez sur "Étape suivante" pour continuer

9. Lorsque vous êtes invité à saisir "Serveur SMTP", entrez <code>smtp.forwardemail.net</code> et changez le port en <code>465</code>

10. Lorsque vous êtes invité à saisir "Nom d'utilisateur", entrez l'adresse e-mail complète d'un alias que vous avez créé sous <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mon compte <i class="fa fa-angle-right"></i> Domaines</a> <i class="fa fa-angle-right"></i> Alias (par exemple <code><hello@example.com></code>)

11. Lorsque vous êtes invité à saisir "Mot de passe", collez le mot de passe depuis <strong class="text-success"><i class="fa fa-key"></i> Générer un mot de passe</strong> à l'étape 3 ci-dessus

12. Sélectionnez le bouton radio pour "Connexion sécurisée utilisant SSL"

13. Cliquez sur "Ajouter un compte" pour continuer

14. Ouvrez un nouvel onglet sur [Gmail](https://gmail.com) et attendez que votre e-mail de vérification arrive (vous recevrez un code de vérification confirmant que vous êtes le propriétaire de l'adresse e-mail que vous tentez d'utiliser pour "Envoyer en tant que")

15. Une fois reçu, copiez et collez le code de vérification à l'invite que vous avez reçue à l'étape précédente
16. Une fois que vous avez fait cela, retournez à l’email et cliquez sur le lien pour « confirmer la demande ». Vous devrez très probablement effectuer cette étape ainsi que la précédente pour que l’email soit correctement configuré.

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Félicitations !
    </strong>
    <span>
      Vous avez réussi toutes les étapes.
    </span>
  </div>
</div>

</div>

### Qu’est-ce que le guide legacy free pour Envoyer un mail en utilisant Gmail {#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail}

<div class="alert my-3 alert-danger"><i class="fa fa-stop-circle font-weight-bold"></i> <strong class="font-weight-bold">Important :</strong> Ce guide legacy free est obsolète depuis mai 2023 car <a class="alert-link" href="/faq#do-you-support-sending-email-with-smtp">nous supportons désormais l’envoi SMTP sortant</a>. Si vous utilisez le guide ci-dessous, <a class="alert-link" href="/faq#can-i-remove-the-via-forwardemail-dot-net-in-gmail">cela fera apparaître votre email sortant</a> avec la mention « <span class="notranslate text-danger font-weight-bold">via forwardemail dot net</span> » dans Gmail.</a></div>

<div class="alert mb-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Durée estimée de configuration :</strong>
  <span>Moins de 10 minutes</span>
</div>

<div class="alert mb-3 alert-success">
  <i class="fa fa-bullhorn font-weight-bold"></i>
  <strong class="font-weight-bold">
    Pour commencer :
  </strong>
  <span>
    Si vous avez suivi les instructions ci-dessus dans <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">Comment démarrer et configurer le transfert d’email</a>, vous pouvez continuer à lire ci-dessous.
  </span>
</div>

<div class="mx-auto lazyframe lazyframe-bordered border border-themed mb-3" data-vendor="youtube_nocookie" title="How to Send Mail As using Gmail" data-src="https://www.youtube-nocookie.com/embed/MEheS8gM4Xs?autoplay=0"></div>

<div id="legacy-free-guide">

1. Vous devez avoir activé [l’authentification à deux facteurs de Gmail][gmail-2fa] pour que cela fonctionne. Visitez <https://www.google.com/landing/2step/> si vous ne l’avez pas activée.

2. Une fois l’authentification à deux facteurs activée (ou si elle l’était déjà), rendez-vous sur <https://myaccount.google.com/apppasswords>.

3. Lorsque vous êtes invité à « Sélectionner l’application et l’appareil pour lesquels vous souhaitez générer le mot de passe d’application » :
   * Sélectionnez « Mail » dans le menu déroulant « Sélectionner l’application »
   * Sélectionnez « Autre » dans le menu déroulant « Sélectionner l’appareil »
   * Lorsque vous êtes invité à saisir un texte, entrez l’adresse email de votre domaine personnalisé que vous redirigez (par exemple <code><hello@example.com></code> - cela vous aidera à suivre en cas d’utilisation de ce service pour plusieurs comptes)

4. Copiez le mot de passe généré automatiquement dans votre presse-papiers
   <div class="alert my-3 alert-warning">
     <i class="fa fa-exclamation-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Important :
     </strong>
     <span>
       Si vous utilisez G Suite, rendez-vous dans votre panneau d’administration <a class="alert-link" href="https://admin.google.com/AdminHome#ServiceSettings/service=email&subtab=filters" rel="noopener noreferrer" target="_blank">Applications <i class="fa fa-angle-right"></i> G Suite <i class="fa fa-angle-right"></i> Paramètres pour Gmail <i class="fa fa-angle-right"></i> Paramètres</a> et assurez-vous de cocher « Autoriser les utilisateurs à envoyer des mails via un serveur SMTP externe... ». Il y aura un délai avant que ce changement soit effectif, veuillez patienter quelques minutes.
     </span>
   </div>

5. Allez sur [Gmail](https://gmail.com) et dans [Paramètres <i class="fa fa-angle-right"></i> Comptes et importation <i class="fa fa-angle-right"></i> Envoyer un mail en tant que](https://mail.google.com/mail/u/0/#settings/accounts), cliquez sur « Ajouter une autre adresse e-mail »

6. Lorsque vous êtes invité à saisir le « Nom », entrez le nom que vous souhaitez voir apparaître comme expéditeur (par exemple « Linus Torvalds »)

7. Lorsque vous êtes invité à saisir l’« Adresse e-mail », entrez l’adresse email avec le domaine personnalisé que vous avez utilisé ci-dessus (par exemple <code><hello@example.com></code>)
8. Décochez « Traiter comme un alias »

9. Cliquez sur « Étape suivante » pour continuer

10. Lorsque vous êtes invité à saisir le « Serveur SMTP », entrez <code>smtp.gmail.com</code> et laissez le port à <code>587</code>

11. Lorsque vous êtes invité à saisir le « Nom d’utilisateur », entrez la partie de votre adresse Gmail sans la partie <span>gmail.com</span> (par exemple juste « user » si mon email est <span><user@gmail.com></span>)
    <div class="alert my-3 alert-primary">
      <i class="fa fa-info-circle font-weight-bold"></i>
      <strong class="font-weight-bold">
        Important :
      </strong>
      <span>
        Si la partie « Nom d’utilisateur » est remplie automatiquement, alors <u><strong>vous devrez la modifier</strong></u> pour mettre la partie nom d’utilisateur de votre adresse Gmail à la place.
      </span>
    </div>

12. Lorsque vous êtes invité à saisir le « Mot de passe », collez depuis votre presse-papiers le mot de passe que vous avez généré à l’étape 2 ci-dessus

13. Laissez le bouton radio coché pour « Connexion sécurisée utilisant TLS »

14. Cliquez sur « Ajouter un compte » pour continuer

15. Ouvrez un nouvel onglet vers [Gmail](https://gmail.com) et attendez que votre email de vérification arrive (vous recevrez un code de vérification qui confirme que vous êtes le propriétaire de l’adresse email que vous tentez d’« Envoyer en tant que »)

16. Une fois qu’il arrive, copiez et collez le code de vérification à l’invite que vous avez reçue à l’étape précédente

17. Une fois cela fait, retournez à l’email et cliquez sur le lien pour « confirmer la demande ». Vous devrez très probablement faire cette étape et la précédente pour que l’email soit correctement configuré.

</div>

### Configuration avancée du routage Gmail {#advanced-gmail-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Temps estimé d’installation :</strong>
  <span>15-30 minutes</span>
</div>

Si vous souhaitez configurer un routage avancé dans Gmail afin que les alias qui ne correspondent pas à une boîte aux lettres soient redirigés vers les serveurs de messagerie de Forward Email, suivez ces étapes :

1. Connectez-vous à votre console d’administration Google à [admin.google.com](https://admin.google.com)
2. Allez dans **Applications → Google Workspace → Gmail → Routage**
3. Cliquez sur **Ajouter une route** et configurez les paramètres suivants :

**Paramètres du destinataire unique :**

* Sélectionnez « Modifier le destinataire de l’enveloppe » et saisissez votre adresse Gmail principale
* Cochez « Ajouter l’en-tête X-Gm-Original-To avec le destinataire original »

**Modèles de destinataires d’enveloppe :**

* Ajoutez un modèle qui correspond à toutes les boîtes aux lettres inexistantes (par exemple, `.*@votredomaine.com`)

**Paramètres du serveur de messagerie :**

* Sélectionnez « Routage vers un hôte » et saisissez `mx1.forwardemail.net` comme serveur principal
* Ajoutez `mx2.forwardemail.net` comme serveur de secours
* Réglez le port sur 25
* Sélectionnez « Exiger TLS » pour la sécurité

4. Cliquez sur **Enregistrer** pour créer la route

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Important :
  </strong>
  <span>
    Cette configuration ne fonctionnera que pour les comptes Google Workspace avec des domaines personnalisés, pas pour les comptes Gmail classiques.
  </span>
</div>

### Configuration avancée du routage Outlook {#advanced-outlook-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Temps estimé d’installation :</strong>
  <span>15-30 minutes</span>
</div>

Pour les utilisateurs de Microsoft 365 (anciennement Office 365) qui souhaitent configurer un routage avancé afin que les alias qui ne correspondent pas à une boîte aux lettres soient redirigés vers les serveurs de messagerie de Forward Email :

1. Connectez-vous au centre d’administration Microsoft 365 à [admin.microsoft.com](https://admin.microsoft.com)
2. Allez dans **Exchange → Flux de messagerie → Règles**
3. Cliquez sur **Ajouter une règle** et sélectionnez **Créer une nouvelle règle**
4. Nommez votre règle (par exemple, « Rediriger les boîtes inexistantes vers Forward Email »)
5. Sous **Appliquer cette règle si**, sélectionnez :
   * « L’adresse du destinataire correspond à... »
   * Saisissez un modèle qui correspond à toutes les adresses de votre domaine (par exemple, `*@votredomaine.com`)
6. Sous **Faire ce qui suit**, sélectionnez :
   * « Rediriger le message vers... »
   * Choisissez « Le serveur de messagerie suivant »
   * Saisissez `mx1.forwardemail.net` et port 25
   * Ajoutez `mx2.forwardemail.net` comme serveur de secours
7. Sous **Sauf si**, sélectionnez :
   * « Le destinataire est... »
   * Ajoutez toutes vos boîtes aux lettres existantes qui ne doivent pas être redirigées
8. Définissez la priorité de la règle pour qu’elle s’exécute après les autres règles de flux de messagerie
9. Cliquez sur **Enregistrer** pour activer la règle
## Dépannage {#troubleshooting}

### Pourquoi ne reçois-je pas mes emails de test {#why-am-i-not-receiving-my-test-emails}

Si vous vous envoyez un email de test, il se peut qu'il n'apparaisse pas dans votre boîte de réception car il possède le même en-tête "Message-ID".

C'est un problème largement connu, qui affecte également des services tels que Gmail.  <a href="https://support.google.com/a/answer/1703601">Voici la réponse officielle de Gmail concernant ce problème</a>.

Si vous continuez à rencontrer des problèmes, il s'agit très probablement d'un problème de propagation DNS.  Vous devrez attendre un peu plus longtemps et réessayer (ou essayer de définir une valeur TTL plus basse sur vos enregistrements <strong class="notranslate">TXT</strong>).

**Vous avez toujours des problèmes ?**  Veuillez <a href="/help">nous contacter</a> afin que nous puissions aider à enquêter sur le problème et trouver une solution rapide.

### Comment configurer mon client email pour fonctionner avec Forward Email {#how-do-i-configure-my-email-client-to-work-with-forward-email}

<div class="mb-3">
  Notre service fonctionne avec des clients email populaires tels que :
  <ul class="ml-1 h4 d-inline list-inline mb-0 pl-0">
    <li class="list-inline-item"><a href="/blog/open-source/apple-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Apple&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/windows-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Windows&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/android-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-android"></i> Android&trade;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/linux-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-linux"></i> Linux&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/desktop-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fas fa-desktop"></i> Bureau</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/mozilla-firefox-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-firefox-browser"></i> Mozilla Firefox&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/safari-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Safari&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/google-chrome-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-chrome"></i> Google Chrome&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/terminal-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fas fa-terminal"></i> Terminal</a></li>
  </ul>
</div>

<div class="alert alert-primary">
  Votre nom d'utilisateur est l'adresse email de votre alias et le mot de passe provient de <strong class="text-success"><i class="fa fa-key"></i> Générer un mot de passe</strong> ("Mot de passe normal").
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Astuce :
  </strong>
  <span>Si vous utilisez Thunderbird, assurez-vous que la "Sécurité de la connexion" est réglée sur "SSL/TLS" et que la méthode d'authentification est définie sur "Mot de passe normal".</span>
</div>

| Type |         Nom d'hôte        |         Protocole        |                                            Ports                                           |
| :--: | :-----------------------: | :---------------------: | :----------------------------------------------------------------------------------------: |
| IMAP | `imap.forwardemail.net`   |  SSL/TLS **Préféré**    |                                      `993` et `2993`                                      |
| SMTP | `smtp.forwardemail.net`   | SSL/TLS **Recommandé**  | `465` et `2465` pour SSL/TLS (recommandé) ou `587`, `2587`, `2525`, et `25` pour STARTTLS |

### Pourquoi mes emails atterrissent-ils dans les dossiers Spam et Courrier indésirable et comment puis-je vérifier la réputation de mon domaine {#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation}
Cette section vous guide si votre courrier sortant utilise nos serveurs SMTP (par exemple `smtp.forwardemail.net`) (ou est transféré via `mx1.forwardemail.net` ou `mx2.forwardemail.net`) et qu'il est livré dans le dossier Spam ou Courrier indésirable des destinataires.

Nous surveillons régulièrement nos [adresses IP](#what-are-your-servers-ip-addresses) contre [toutes les listes noires DNS réputées](#how-do-you-handle-your-ip-addresses-becoming-blocked), **il s'agit donc très probablement d'un problème spécifique à la réputation du domaine**.

Les e-mails peuvent atterrir dans les dossiers spam pour plusieurs raisons :

1. **Authentification manquante** : Configurez les enregistrements [SPF](#how-do-i-set-up-spf-for-forward-email), [DKIM](#how-do-i-set-up-dkim-for-forward-email) et [DMARC](#how-do-i-set-up-dmarc-for-forward-email).

2. **Réputation du domaine** : Les nouveaux domaines ont souvent une réputation neutre jusqu'à ce qu'ils établissent un historique d'envoi.

3. **Déclencheurs de contenu** : Certains mots ou phrases peuvent déclencher les filtres anti-spam.

4. **Modèles d'envoi** : Les augmentations soudaines du volume d'e-mails peuvent sembler suspectes.

Vous pouvez essayer d'utiliser un ou plusieurs de ces outils pour vérifier la réputation et la catégorisation de votre domaine :

#### Outils de vérification de réputation et de listes noires {#reputation-and-blocklist-check-tools}

| Nom de l'outil                             | URL                                                          | Type                   |
| ------------------------------------------ | ------------------------------------------------------------ | ---------------------- |
| Cloudflare Domain Categorization Feedback  | <https://radar.cloudflare.com/domains/feedback>              | Catégorisation         |
| Spamhaus IP and Domain Reputation Checker  | <https://check.spamhaus.org/>                                | DNSBL                  |
| Cisco Talos IP and Domain Reputation Center| <https://talosintelligence.com/reputation_center>            | Réputation             |
| Barracuda IP and Domain Reputation Lookup  | <https://www.barracudacentral.org/lookups/lookup-reputation> | DNSBL                  |
| MX Toolbox Blacklist Check                 | <https://mxtoolbox.com/blacklists.aspx>                      | Liste noire            |
| Google Postmaster Tools                    | <https://www.gmail.com/postmaster/>                          | Réputation             |
| Yahoo Sender Hub                           | <https://senders.yahooinc.com/>                              | Réputation             |
| MultiRBL.valli.org Blacklist Check         | <https://multirbl.valli.org/lookup/>                         | DNSBL                  |
| Sender Score                               | <https://senderscore.org/act/blocklist-remover/>             | Réputation             |
| Invaluement                                | <https://www.invaluement.com/lookup/>                        | DNSBL                  |
| SURBL                                      | <https://www.surbl.org/>                                     | DNSBL                  |
| SpamCop                                    | <https://www.spamcop.net/bl.shtml>                           | DNSBL                  |
| UCEPROTECT's Levels 1, 2, and 3            | <https://www.uceprotect.net/en/rblcheck.php>                 | DNSBL                  |
| UCEPROTECT's backscatterer.org             | <https://www.backscatterer.org/>                             | Protection contre le backscatter |
| UCEPROTECT's whitelisted.org               | <https://www.whitelisted.org/> (nécessite des frais)          | DNSWL                  |

#### Formulaires de demande de suppression d'IP par fournisseur {#ip-removal-request-forms-by-provider}

Si votre adresse IP a été bloquée par un fournisseur de messagerie spécifique, utilisez le formulaire de suppression approprié ou contactez-le ci-dessous :

| Fournisseur                            | Formulaire de suppression / Contact                                                                                     | Remarques                                    |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------- |
| Google/Gmail                         | <https://support.google.com/mail/contact/bulk_send_new>                                                                  | Formulaire de contact pour expéditeurs en masse |
| Microsoft (Outlook/Office 365/Hotmail) | <https://sender.office.com>                                                                                                | Portail de suppression d'IP Office 365       |
| Yahoo/AOL/Verizon                    | <https://senders.yahooinc.com/>                                                                                          | Yahoo Sender Hub                             |
| Apple/iCloud                       | <https://ipcheck.proofpoint.com/>                                                                                        | Apple utilise Proofpoint pour la réputation IP |
| Proofpoint                         | <https://ipcheck.proofpoint.com/>                                                                                        | Vérification et suppression IP Proofpoint    |
| Barracuda Networks                 | <https://www.barracudacentral.org/lookups/lookup-reputation>                                                             | Recherche et suppression de réputation Barracuda |
| Cloudmark                        | <https://csi.cloudmark.com/en/reset/>                                                                                    | Demande de réinitialisation Cloudmark CSI    |
| GoDaddy/SecureServer             | <https://unblock.secureserver.net>                                                                                       | Formulaire de demande de déblocage IP GoDaddy |
| Comcast/Xfinity                  | <https://spa.xfinity.com/report>                                                                                         | Demande de suppression IP Comcast            |
| Charter/Spectrum                 | <https://www.spectrum.net/support/internet/understanding-email-error-codes>                                              | Contactez le support Spectrum pour suppression |
| AT&T                             | `abuse_rbl@abuse-att.net`                                                                                                | Email pour demande de suppression             |
| Cox Communications               | `unblock.request@cox.net`                                                                                                | Email pour demande de suppression             |
| CenturyLink/Lumen                | `abuse@centurylink.com`                                                                                                  | Utilise Cloudfilter                           |
| Windstream                      | `abuse@windstream.net`                                                                                                   | Email pour demande de suppression             |
| t-online.de (Allemagne)          | `tobr@rx.t-online.de`                                                                                                    | Email pour demande de suppression             |
| Orange France                   | <https://postmaster.orange.fr/>                                                                                          | Utilisez le formulaire de contact ou l'email `abuse@orange.fr` |
| GMX                             | <https://postmaster.gmx.net/en/contact>                                                                                  | Formulaire de contact postmaster GMX          |
| Mail.ru                         | <https://postmaster.mail.ru/>                                                                                            | Portail postmaster Mail.ru                     |
| Yandex                          | <https://postmaster.yandex.ru/>                                                                                          | Portail postmaster Yandex                      |
| QQ Mail (Tencent)               | <https://open.mail.qq.com/>                                                                                              | Demande de liste blanche QQ Mail (chinois)    |
| Netease (163.com)               | <https://mail.163.com/postmaster/>                                                                                       | Portail postmaster Netease                     |
| Alibaba/Aliyun/HiChina          | <https://www.alibabacloud.com/help/en/alibaba-mail/>                                                                     | Contact via la console Alibaba Cloud           |
| Amazon SES                     | <https://docs.aws.amazon.com/ses/latest/dg/faqs-dnsbls.html>                                                             | Console AWS SES > Suppression de liste noire  |
| SendGrid                       | <https://support.sendgrid.com/>                                                                                          | Contactez le support SendGrid                  |
| Mimecast                       | <https://community.mimecast.com/>                                                                                        | Utilise des RBL tiers - contactez le RBL spécifique |
| Fastmail                       | <https://www.fastmail.com/support/>                                                                                      | Contactez le support Fastmail                  |
| Zoho                           | <https://help.zoho.com/portal/en/kb/campaigns/faqs/campaign-review/articles/how-do-i-delist-my-ip-address>                 | Contactez le support Zoho                       |
| ProtonMail                     | <https://proton.me/support/contact>                                                                                      | Contactez le support Proton                     |
| Tutanota                       | <https://tutanota.com/support>                                                                                           | Contactez le support Tutanota                   |
| Hushmail                      | <https://www.hushmail.com/support/>                                                                                      | Contactez le support Hushmail                   |
| Mailbox.org                   | <https://mailbox.org/en/support>                                                                                         | Contactez le support Mailbox.org                |
| Posteo                        | <https://posteo.de/en/site/contact>                                                                                      | Contactez le support Posteo                      |
| DuckDuckGo Email              | <https://duckduckgo.com/email/support>                                                                                   | Contactez le support DuckDuckGo                  |
| Sonic.net                    | <https://www.sonic.com/support>                                                                                          | Contactez le support Sonic                       |
| Telus                        | <https://www.telus.com/en/support>                                                                                       | Contactez le support Telus                       |
| Vodafone Germany             | <https://www.vodafone.de/hilfe/>                                                                                         | Contactez le support Vodafone                    |
| Xtra (Spark NZ)              | <https://www.spark.co.nz/help/>                                                                                          | Contactez le support Spark NZ                    |
| UOL/BOL (Brésil)             | <https://ajuda.uol.com.br/>                                                                                              | Contactez le support UOL (portugais)             |
| Libero (Italie)              | <https://aiuto.libero.it/>                                                                                               | Contactez le support Libero (italien)            |
| Telenet (Belgique)           | <https://www2.telenet.be/en/support/>                                                                                    | Contactez le support Telenet                      |
| Facebook/WhatsApp            | <https://www.facebook.com/business/help>                                                                                 | Contactez le support business Facebook           |
| LinkedIn                    | <https://www.linkedin.com/help/linkedin>                                                                                 | Contactez le support LinkedIn                     |
| Groups.io                   | <https://groups.io/helpcenter>                                                                                           | Contactez le support Groups.io                     |
| Earthlink/Vade Secure       | <https://sendertool.vadesecure.com/en/>                                                                                  | Outil expéditeur Vade Secure                       |
| Cloudflare Email Security   | <https://www.cloudflare.com/products/zero-trust/email-security/>                                                         | Contactez le support Cloudflare                    |
| Hornetsecurity/Expurgate    | <https://www.hornetsecurity.com/>                                                                                        | Contactez le support Hornetsecurity                |
| SpamExperts/Antispamcloud   | <https://www.spamexperts.com/>                                                                                           | Contact via le fournisseur d'hébergement           |
| Mail2World                 | <https://www.mail2world.com/support/>                                                                                    | Contactez le support Mail2World                     |
> \[!TIP]
> Commencez avec un faible volume d'e-mails de haute qualité pour construire une réputation positive avant d'envoyer en plus grande quantité.

> \[!IMPORTANT]
> Si votre domaine est sur une liste noire, chaque liste noire a son propre processus de suppression. Consultez leurs sites web pour les instructions.

> \[!TIP]
> Si vous avez besoin d'aide supplémentaire ou si vous constatez que nous sommes faussement listés comme spam par un certain fournisseur de services e-mail, veuillez <a href="/help">nous contacter</a>.

### Que dois-je faire si je reçois des e-mails indésirables {#what-should-i-do-if-i-receive-spam-emails}

Vous devez vous désabonner de la liste de diffusion (si possible) et bloquer l'expéditeur.

Veuillez ne pas signaler le message comme spam, mais plutôt le transférer à notre système de prévention des abus, soigneusement géré manuellement et respectueux de la vie privée.

**L'adresse e-mail à laquelle transférer les spams est :** <abuse@forwardemail.net>

### Pourquoi mes e-mails de test envoyés à moi-même dans Gmail apparaissent-ils comme "suspects" {#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious}

Si vous voyez ce message d'erreur dans Gmail lorsque vous vous envoyez un test, ou lorsqu'une personne à qui vous envoyez un e-mail avec votre alias voit un e-mail de votre part pour la première fois, alors **ne vous inquiétez pas** – c'est une fonctionnalité de sécurité intégrée de Gmail.

Vous pouvez simplement cliquer sur "Semble sûr". Par exemple, si vous envoyez un message test en utilisant la fonction envoyer un mail en tant que (à quelqu'un d'autre), ils ne verront pas ce message.

Cependant, s'ils voient ce message, c'est parce qu'ils avaient l'habitude de voir vos e-mails provenir de <john@gmail.com> au lieu de <john@customdomain.com> (juste un exemple). Gmail alerte les utilisateurs juste pour s'assurer que tout est sûr au cas où, il n'y a pas de contournement.

### Puis-je supprimer le via forwardemail dot net dans Gmail {#can-i-remove-the-via-forwardemail-dot-net-in-gmail}

Ce sujet est lié à un [problème largement connu dans Gmail où des informations supplémentaires apparaissent à côté du nom de l'expéditeur](https://support.google.com/mail/answer/1311182).

Depuis mai 2023, nous supportons l'envoi d'e-mails avec SMTP en tant que module complémentaire pour tous les utilisateurs payants – ce qui signifie que vous pouvez supprimer le <span class="notranslate">via forwardemail dot net</span> dans Gmail.

Notez que ce sujet FAQ est spécifique à ceux qui utilisent la fonctionnalité [Comment envoyer un mail en tant que via Gmail](#how-to-send-mail-as-using-gmail).

Veuillez consulter la section sur [Supportez-vous l'envoi d'e-mails avec SMTP](#do-you-support-sending-email-with-smtp) pour les instructions de configuration.


## Gestion des données {#data-management}

### Où sont situés vos serveurs {#where-are-your-servers-located}

> \[!TIP]
> Nous annoncerons bientôt notre centre de données EU hébergé sous [forwardemail.eu](https://forwardemail.eu). Abonnez-vous à la discussion sur <https://github.com/orgs/forwardemail/discussions/336> pour les mises à jour.

Nos serveurs sont principalement situés à Denver, Colorado – voir <https://forwardemail.net/ips> pour notre liste complète d'adresses IP.

Vous pouvez en apprendre davantage sur nos sous-traitants sur nos pages [RGPD](/gdpr), [DPA](/dpa), et [Confidentialité](/privacy).

### Comment exporter et sauvegarder ma boîte aux lettres {#how-do-i-export-and-backup-my-mailbox}

À tout moment, vous pouvez exporter vos boîtes aux lettres aux formats [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions), [Mbox](https://en.wikipedia.org/wiki/Mbox), ou [SQLite](https://en.wikipedia.org/wiki/SQLite) chiffré.

Allez à <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Mon Compte <i class="fa fa-angle-right"></i> Domaines</a> <i class="fa fa-angle-right"></i> Alias <i class="fa fa-angle-right"></i> Télécharger la sauvegarde et sélectionnez votre type de format d'export préféré.

Un lien pour télécharger l'export vous sera envoyé par e-mail une fois terminé.

Notez que ce lien de téléchargement expire après 4 heures pour des raisons de sécurité.

Si vous devez inspecter vos formats exportés EML ou Mbox, ces outils open-source peuvent être utiles :

| Nom             | Format | Plateforme   | URL GitHub                                          |
| --------------- | :----: | ------------ | -------------------------------------------------- |
| MBox Viewer     |  Mbox  | Windows      | <https://github.com/eneam/mboxviewer>              |
| mbox-web-viewer |  Mbox  | Toutes plateformes | <https://github.com/PHMRanger/mbox-web-viewer>     |
| EmlReader       |   EML  | Windows      | <https://github.com/ayamadori/EmlReader>           |
| Email viewer    |   EML  | VSCode       | <https://github.com/joelharkes/vscode_email_viewer>|
| eml-reader      |   EML  | Toutes plateformes | <https://github.com/s0ph1e/eml-reader>             |
De plus, si vous devez convertir un fichier Mbox en fichier EML, vous pouvez utiliser <https://github.com/noelmartinon/mboxzilla>.

### Comment importer et migrer ma boîte aux lettres existante {#how-do-i-import-and-migrate-my-existing-mailbox}

Vous pouvez facilement importer vos e-mails vers Forward Email (par exemple en utilisant [Thunderbird](https://www.thunderbird.net)) avec les instructions ci-dessous :

<div class="alert alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Important :
  </strong>
  <span>
    Vous devez suivre toutes les étapes suivantes afin d'importer vos e-mails existants.
  </span>
</div>

1. Exportez vos e-mails depuis votre fournisseur de messagerie actuel :

   | Fournisseur de messagerie | Format d'exportation                          | Instructions d'exportation                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
   | ------------------------- | --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | Gmail                    | MBOX                                          | <https://takeout.google.com/settings/takeout/custom/gmail>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
   | Outlook                  | PST                                           | <div class="alert my-3 alert-danger"><i class="fa fa-info-circle font-weight-bold"></i> <strong class="font-weight-bold">Astuce :</strong> <span>Si vous utilisez Outlook (<a href="https://support.microsoft.com/en-us/office/back-up-your-email-e5845b0b-1aeb-424f-924c-aa1c33b18833#:~:text=Select%20File%20%3E%20Open%20%26%20Export%20%3E,back%20up%20and%20select%20Next." class="alert-link">format d'export PST</a>), vous pouvez simplement suivre les instructions sous "Autre" ci-dessous. Cependant, nous avons fourni ci-dessous des liens pour convertir PST en format MBOX/EML selon votre système d'exploitation :<ul class="mb-0 mt-3"><li><a class="alert-link" href="https://github.com/BaselineIT/Zinkuba/releases/download/release-1.2/Zinkuba.App.exe">Zinkuba pour Windows</a> (<a class="alert-link" href="https://github.com/BaselineIT/Zinkuba?tab=readme-ov-file#zinkuba">GitHub</a>)</li><li><a class="alert-link" href="https://cygwin.com/packages/summary/readpst.html">readpst pour Windows cygwin</a> – (par exemple <code>readpst -u -o $OUT_DIR $IN_DIR</code> en remplaçant <code>$OUT_DIR</code> et <code>$IN_DIR</code> par les chemins des répertoires de sortie et d'entrée respectivement).</li><li><a class="alert-link" href="https://manpages.ubuntu.com/manpages/trusty/man1/readpst.1.html">readpst pour Ubuntu/Linux</a> – (par exemple <code>sudo apt-get install readpst</code> puis <code>readpst -u -o $OUT_DIR $IN_DIR</code>, en remplaçant <code>$OUT_DIR</code> et <code>$IN_DIR</code> par les chemins des répertoires de sortie et d'entrée respectivement).</li><li><a class="alert-link" href="https://formulae.brew.sh/formula/libpst">readpst pour macOS (via brew)</a> – (par exemple <code>brew install libpst</code> puis <code>readpst -u -o $OUT_DIR $IN_DIR</code>, en remplaçant <code>$OUT_DIR</code> et <code>$IN_DIR</code> par les chemins des répertoires de sortie et d'entrée respectivement).</li><li><a class="alert-link" href="https://github.com/juanirm/pst-converter/tree/master?tab=readme-ov-file#pst-converter">PST Converter pour Windows (GitHub)</a></li></ul><br /></span></div> |
   | Apple Mail               | MBOX                                          | <https://support.apple.com/guide/mail/import-or-export-mailboxes-mlhlp1030/mac#apd37a3190755974>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
   | Fastmail                 | EML                                           | <https://www.fastmail.help/hc/en-us/articles/360060590573-Download-all-your-data#downloadmail>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
   | Proton Mail              | MBOX/EML                                      | <https://proton.me/support/export-emails-import-export-app>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
   | Tutanota                 | EML                                           | <https://github.com/crepererum-oss/tatutanatata>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
   | Gandi                    | EML                                           | <https://docs.gandi.net/en/gandimail/common_operations/backup_email.html#contents>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
   | Zoho                     | EML                                           | <https://www.zoho.com/mail/help/import-export-emails.html#alink2>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
   | Autre                    | [Utilisez Thunderbird](https://www.thunderbird.net) | Configurez votre compte e-mail existant dans Thunderbird puis utilisez le plugin [ImportExportTools NG](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/) pour exporter et importer vos e-mails.  **Vous pouvez également simplement copier/coller ou glisser/déposer des e-mails d’un compte à un autre.**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
2. Téléchargez, installez et ouvrez [Thunderbird](https://www.thunderbird.net).

3. Créez un nouveau compte en utilisant l'adresse email complète de votre alias (par exemple <code><vous@votredomaine.com></code>) et votre mot de passe généré.  <strong>Si vous ne disposez pas encore d’un mot de passe généré, alors <a href="/faq#do-you-support-receiving-email-with-imap" target="_blank">référez-vous à nos instructions d’installation</a></strong>.

4. Téléchargez et installez le plugin Thunderbird [ImportExportTools NG](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/).

5. Créez un nouveau dossier local dans Thunderbird, puis faites un clic droit dessus → sélectionnez l’option `ImportExportTools NG` → choisissez `Import mbox file` (pour le format d’export MBOX) – ou – `Import messages` / `Import all messages from a directory` (pour le format d’export EML).

6. Glissez-déposez depuis le dossier local vers un dossier IMAP nouveau (ou existant) dans Thunderbird dans lequel vous souhaitez importer les messages dans le stockage IMAP avec notre service.  Cela garantira qu’ils sont sauvegardés en ligne avec notre stockage chiffré SQLite.

   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Astuce :
     </strong>
     <span>
       Si vous ne savez pas comment importer dans Thunderbird, vous pouvez consulter les instructions officielles sur <a class="alert-link" href="https://kb.mozillazine.org/Importing_folders">https://kb.mozillazine.org/Importing_folders</a> et <a class="alert-link" href="https://github.com/thunderbird/import-export-tools-ng/wiki">https://github.com/thunderbird/import-export-tools-ng/wiki</a>.
     </span>
   </div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Important :
  </strong>
  <span>
    Une fois que vous avez terminé le processus d’exportation et d’importation, vous pouvez également activer le transfert sur votre compte email existant et configurer un répondeur automatique pour informer les expéditeurs que vous avez une nouvelle adresse email (par exemple si vous utilisiez auparavant Gmail et que vous utilisez maintenant une adresse email avec votre nom de domaine personnalisé).
  </span>
</div>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Félicitations !
    </strong>
    <span>
      Vous avez réussi toutes les étapes.
    </span>
  </div>
</div>

### Comment utiliser mon propre stockage compatible S3 pour les sauvegardes {#how-do-i-use-my-own-s3-compatible-storage-for-backups}

Les utilisateurs des plans payants peuvent configurer leur propre fournisseur de stockage compatible [S3](https://en.wikipedia.org/wiki/Amazon_S3) sur une base par domaine pour les sauvegardes IMAP/SQLite.  Cela signifie que vos sauvegardes de boîtes aux lettres chiffrées peuvent être stockées sur votre propre infrastructure au lieu de (ou en plus de) notre stockage par défaut.

Les fournisseurs supportés incluent [Amazon S3](https://aws.amazon.com/s3/), [Cloudflare R2](https://developers.cloudflare.com/r2/), [MinIO](https://github.com/minio/minio), [Backblaze B2](https://www.backblaze.com/cloud-storage), [DigitalOcean Spaces](https://www.digitalocean.com/products/spaces), et tout autre service compatible S3.

#### Configuration {#setup}

1. Créez un bucket **privé** avec votre fournisseur compatible S3.  Le bucket ne doit pas être accessible publiquement.
2. Créez des identifiants d’accès (ID de clé d’accès et clé d’accès secrète) avec des permissions de lecture/écriture sur le bucket.
3. Allez à <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Mon Compte <i class="fa fa-angle-right"></i> Domaines</a> <i class="fa fa-angle-right"></i> Paramètres avancés <i class="fa fa-angle-right"></i> Stockage compatible S3 personnalisé.
4. Cochez **"Activer le stockage compatible S3 personnalisé"** et remplissez votre URL de point de terminaison, ID de clé d’accès, clé d’accès secrète, région et nom du bucket.
5. Cliquez sur **"Tester la connexion"** pour vérifier vos identifiants, l’accès au bucket et les permissions d’écriture.
6. Cliquez sur **"Enregistrer"** pour appliquer les paramètres.

#### Fonctionnement des sauvegardes {#how-backups-work}

Les sauvegardes sont déclenchées automatiquement pour chaque alias IMAP connecté.  Le serveur IMAP vérifie toutes les connexions actives une fois par heure et lance une sauvegarde pour chaque alias connecté.  Un verrou basé sur Redis empêche que des sauvegardes en double ne s’exécutent dans un intervalle de 30 minutes, et la sauvegarde réelle est ignorée si une sauvegarde réussie a déjà été effectuée dans les dernières 24 heures (sauf si la sauvegarde a été explicitement demandée par un utilisateur pour téléchargement).
Les sauvegardes peuvent également être déclenchées manuellement en cliquant sur **"Télécharger la sauvegarde"** pour n'importe quel alias dans le tableau de bord. Les sauvegardes manuelles s'exécutent toujours, quelle que soit la fenêtre de 24 heures.

Le processus de sauvegarde fonctionne comme suit :

1. La base de données SQLite est copiée en utilisant `VACUUM INTO`, ce qui crée un instantané cohérent sans interrompre les connexions actives et préserve le chiffrement de la base de données.
2. Le fichier de sauvegarde est vérifié en l'ouvrant pour confirmer que le chiffrement est toujours valide.
3. Un hachage SHA-256 est calculé et comparé à la sauvegarde existante dans le stockage. Si le hachage correspond, le téléchargement est ignoré (aucun changement depuis la dernière sauvegarde).
4. La sauvegarde est téléchargée sur S3 en utilisant un téléchargement multipart via la bibliothèque [@aws-sdk/lib-storage](https://github.com/aws/aws-sdk-js-v3/tree/main/lib/lib-storage).
5. Une URL de téléchargement signée (valide pendant 4 heures) est générée et envoyée par email à l'utilisateur.

#### Formats de sauvegarde {#backup-formats}

Trois formats de sauvegarde sont pris en charge :

| Format   | Extension | Description                                                                 |
| -------- | --------- | --------------------------------------------------------------------------- |
| `sqlite` | `.sqlite` | Instantané brut de la base de données SQLite chiffrée (par défaut pour les sauvegardes IMAP automatiques) |
| `mbox`   | `.zip`    | ZIP protégé par mot de passe contenant la boîte aux lettres au format mbox  |
| `eml`    | `.zip`    | ZIP protégé par mot de passe contenant des fichiers `.eml` individuels par message |

> **Astuce :** Si vous avez des fichiers de sauvegarde `.sqlite` et souhaitez les convertir localement en fichiers `.eml`, utilisez notre outil CLI autonome **[convert-sqlite-to-eml](#how-do-i-convert-sqlite-backups-to-eml-files)**. Il fonctionne sous Windows, Linux et macOS et ne nécessite pas de connexion réseau.

#### Nommage des fichiers et structure des clés {#file-naming-and-key-structure}

Lors de l'utilisation d'un **stockage S3 personnalisé**, les fichiers de sauvegarde sont stockés avec un préfixe horodaté au format [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601) afin que chaque sauvegarde soit conservée comme un objet distinct. Cela vous donne un historique complet des sauvegardes dans votre propre bucket.

Le format de la clé est :

```
{horodatage ISO 8601}-{alias_id}.{extension}
```

Par exemple :

```
2025-03-01T12:00:00.000Z-65a31c53c36b75ed685f3fda.sqlite
2025-03-01T12:00:00.000Z-65a31c53c36b75ed685f3fda.zip
2025-03-02T12:00:00.000Z-65a31c53c36b75ed685f3fda.sqlite
```

L’`alias_id` est l’ObjectId MongoDB de l’alias. Vous pouvez le trouver dans la page des paramètres de l’alias ou via l’API.

Lors de l’utilisation du **stockage par défaut (système)**, la clé est plate (par exemple `65a31c53c36b75ed685f3fda.sqlite`) et chaque sauvegarde écrase la précédente.

> **Note :** Puisque le stockage S3 personnalisé conserve toutes les versions des sauvegardes, l’utilisation du stockage augmentera avec le temps. Nous recommandons de configurer des [règles de cycle de vie](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html) sur votre bucket pour expirer automatiquement les anciennes sauvegardes (par exemple supprimer les objets de plus de 30 ou 90 jours).

#### Propriété des données et politique de suppression {#data-ownership-and-deletion-policy}

Votre bucket S3 personnalisé est entièrement sous votre contrôle. Nous **ne supprimons ni ne modifions jamais** les fichiers dans votre bucket S3 personnalisé — ni lors de la suppression d’un alias, ni lors de la suppression d’un domaine, ni lors d’opérations de nettoyage. Nous écrivons uniquement de nouveaux fichiers de sauvegarde dans votre bucket.

Cela signifie :

* **Suppression d’alias** — Lorsque vous supprimez un alias, nous supprimons la sauvegarde uniquement de notre stockage système par défaut. Toutes les sauvegardes précédemment écrites dans votre bucket S3 personnalisé restent intactes.
* **Suppression de domaine** — La suppression d’un domaine n’affecte pas les fichiers dans votre bucket personnalisé.
* **Gestion de la rétention** — Vous êtes responsable de la gestion du stockage dans votre propre bucket, y compris la configuration des règles de cycle de vie pour expirer les anciennes sauvegardes.

Si vous désactivez le stockage S3 personnalisé ou revenez à notre stockage par défaut, les fichiers existants dans votre bucket sont conservés. Les sauvegardes futures seront simplement écrites dans notre stockage par défaut.

#### Sécurité {#security}

* Votre ID de clé d’accès et votre clé d’accès secrète sont **chiffrés au repos** en utilisant [AES-256-GCM](https://en.wikipedia.org/wiki/Galois/Counter_Mode) avant d’être stockés dans notre base de données. Ils ne sont déchiffrés qu’au moment de l’exécution lors des opérations de sauvegarde.
* Nous validons automatiquement que votre bucket **n’est pas accessible publiquement**. Si un bucket public est détecté, la configuration sera rejetée lors de la sauvegarde. Si un accès public est détecté au moment de la sauvegarde, nous revenons à notre stockage par défaut et notifions tous les administrateurs de domaine par email.
* Les identifiants sont validés lors de la sauvegarde via un appel [HeadBucket](https://docs.aws.amazon.com/AmazonS3/latest/API/API_HeadBucket.html) pour s’assurer que le bucket existe et que les identifiants sont corrects. En cas d’échec de la validation, le stockage S3 personnalisé est automatiquement désactivé.
* Chaque fichier de sauvegarde inclut un hachage SHA-256 dans ses métadonnées S3, utilisé pour détecter les bases de données inchangées et éviter les téléchargements redondants.
#### Notifications d'erreur {#error-notifications}

Si une sauvegarde échoue lors de l'utilisation de votre stockage S3 personnalisé (par exemple en raison de credentials expirés ou d'un problème de connectivité), tous les administrateurs de domaine seront notifiés par email. Ces notifications sont limitées à une fois toutes les 6 heures pour éviter les alertes en double. Si votre bucket est détecté comme accessible publiquement au moment de la sauvegarde, les administrateurs seront notifiés une fois par jour.

#### API {#api}

Vous pouvez également configurer un stockage S3 personnalisé via l'API :

```sh
curl -X PUT https://api.forwardemail.net/v1/domains/example.com \
  -u API_TOKEN: \
  -d has_custom_s3=true \
  -d s3_endpoint=https://s3.us-east-1.amazonaws.com \
  -d s3_access_key_id=YOUR_ACCESS_KEY_ID \
  -d s3_secret_access_key=YOUR_SECRET_ACCESS_KEY \
  -d s3_region=us-east-1 \
  -d s3_bucket=my-email-backups
```

Pour tester la connexion via l'API :

```sh
curl -X POST https://api.forwardemail.net/v1/domains/example.com/test-s3-connection \
  -u API_TOKEN:
```

### Comment convertir les sauvegardes SQLite en fichiers EML {#how-do-i-convert-sqlite-backups-to-eml-files}

Si vous téléchargez ou stockez des sauvegardes SQLite (soit depuis notre stockage par défaut, soit depuis votre propre [bucket S3 personnalisé](#how-do-i-use-my-own-s3-compatible-storage-for-backups)), vous pouvez les convertir en fichiers `.eml` standards en utilisant notre outil CLI autonome **[convert-sqlite-to-eml](https://github.com/forwardemail/forwardemail.net/tree/master/tools/convert-sqlite-to-eml)**. Les fichiers EML peuvent être ouverts avec n'importe quel client mail ([Thunderbird](https://www.thunderbird.net/), [Outlook](https://www.microsoft.com/en-us/microsoft-365/outlook/email-and-calendar-software-microsoft-outlook), [Apple Mail](https://support.apple.com/mail), etc.) ou importés dans d'autres serveurs de messagerie.

#### Installation {#installation-1}

Vous pouvez soit télécharger un binaire précompilé (aucun [Node.js](https://github.com/nodejs/node) requis) soit l'exécuter directement avec [Node.js](https://github.com/nodejs/node) :

**Binaires précompilés** — Téléchargez la dernière version pour votre plateforme depuis [GitHub Releases](https://github.com/forwardemail/forwardemail.net/releases) :

| Plateforme | Architecture  | Fichier                              |
| ---------- | ------------- | ----------------------------------- |
| Linux      | x64           | `convert-sqlite-to-eml-linux-x64`   |
| Linux      | arm64         | `convert-sqlite-to-eml-linux-arm64` |
| macOS      | Apple Silicon | `convert-sqlite-to-eml-darwin-arm64`|
| Windows    | x64           | `convert-sqlite-to-eml-win-x64.exe` |

> **Utilisateurs macOS :** Après téléchargement, vous devrez peut-être retirer l'attribut de quarantaine avant d'exécuter le binaire :
>
> ```bash
> sudo xattr -rd com.apple.quarantine ./convert-sqlite-to-eml-darwin-arm64
> ```
>
> (Remplacez `./convert-sqlite-to-eml-darwin-arm64` par le chemin réel vers le fichier téléchargé.)

> **Utilisateurs Linux :** Après téléchargement, vous devrez peut-être rendre le binaire exécutable :
>
> ```bash
> chmod +x ./convert-sqlite-to-eml-linux-x64
> ```
>
> (Remplacez `./convert-sqlite-to-eml-linux-x64` par le chemin réel vers le fichier téléchargé.)

**Depuis la source** (requiert [Node.js](https://github.com/nodejs/node) >= 18) :

```bash
cd tools/convert-sqlite-to-eml
npm install
node index.js
```

#### Utilisation {#usage}

L'outil supporte les modes interactif et non interactif.

**Mode interactif** — lancez sans arguments et vous serez invité à saisir toutes les informations :

```bash
./convert-sqlite-to-eml
```

```
  Forward Email - Convertir une sauvegarde SQLite en EML
  ======================================================

  Chemin vers le fichier de sauvegarde SQLite : /path/to/backup.sqlite
  Mot de passe IMAP/alias : ********
  Chemin de sortie du ZIP [/path/to/backup-2025-03-01T12-00-00-000Z.zip] :
```

**Mode non interactif** — passez les arguments via des options en ligne de commande pour le scripting et l'automatisation :

```bash
./convert-sqlite-to-eml \
  --path /path/to/backup.sqlite \
  --password "votre-mot-de-passe-imap" \
  --output /path/to/output.zip
```

| Option              | Description                                                                    |
| ------------------- | ------------------------------------------------------------------------------ |
| `--path <path>`     | Chemin vers le fichier de sauvegarde SQLite chiffré                            |
| `--password <pass>` | Mot de passe IMAP/alias pour le déchiffrement                                 |
| `--output <path>`   | Chemin de sortie pour le fichier ZIP (par défaut : généré automatiquement avec un timestamp ISO 8601) |
| `--help`            | Affiche le message d'aide                                                      |
#### Format de sortie {#output-format}

L'outil produit une archive ZIP protégée par mot de passe (chiffrée AES-256) contenant :

```
README.txt
INBOX/
  <message-id-1>.eml
  <message-id-2>.eml
Sent/
  <message-id-3>.eml
Drafts/
  <message-id-4>.eml
```

Les fichiers EML sont organisés par dossier de boîte aux lettres. Le mot de passe du ZIP est le même que votre mot de passe IMAP/alias. Chaque fichier `.eml` est un message email standard [RFC 5322](https://datatracker.ietf.org/doc/html/rfc5322) avec en-têtes complets, texte du corps et pièces jointes reconstituées à partir de la base de données SQLite.

#### Comment ça fonctionne {#how-it-works}

1. Ouvre la base de données SQLite chiffrée en utilisant votre mot de passe IMAP/alias (prend en charge les chiffrements [ChaCha20](https://en.wikipedia.org/wiki/ChaCha20-Poly1305) et [AES-256-CBC](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard)).
2. Lit la table Mailboxes pour découvrir la structure des dossiers.
3. Pour chaque message, décode le mimeTree (stocké en JSON compressé avec [Brotli](https://github.com/google/brotli)) depuis la table Messages.
4. Reconstruit le fichier EML complet en parcourant l'arbre MIME et en récupérant les corps des pièces jointes depuis la table Attachments.
5. Emballe tout dans une archive ZIP protégée par mot de passe en utilisant [archiver-zip-encrypted](https://github.com/artem-silaev/archiver-zip-encrypted).

### Supportez-vous l’auto-hébergement {#do-you-support-self-hosting}

Oui, depuis mars 2025, nous supportons une option auto-hébergée. Lisez le blog [ici](https://forwardemail.net/blog/docs/self-hosted-solution). Consultez le [guide auto-hébergé](https://forwardemail.net/self-hosted) pour commencer. Et pour ceux qui souhaitent une version plus détaillée étape par étape, voyez nos guides basés sur [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) ou [Debian](https://forwardemail.net/guides/selfhosted-on-debian).


## Configuration Email {#email-configuration}

### Comment démarrer et configurer le transfert d’email {#how-do-i-get-started-and-set-up-email-forwarding}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Temps estimé d’installation :</strong>
  <span>Moins de 10 minutes</span>
</div>

<div class="alert my-3 alert-success">
  <i class="fa fa-bullhorn font-weight-bold"></i>
  <strong class="font-weight-bold">
    Pour commencer :
  </strong>
  <span>
    Lisez attentivement et suivez les étapes une à huit listées ci-dessous. Assurez-vous de remplacer l’adresse email <code>user@gmail.com</code> par l’adresse email vers laquelle vous souhaitez transférer les emails (si ce n’est pas déjà correct). De même, assurez-vous de remplacer <code>example.com</code> par votre nom de domaine personnalisé (si ce n’est pas déjà correct).
  </span>
</div>

<ol>
  <li class="mb-2 mb-md-3 mb-lg-5">Si vous avez déjà enregistré votre nom de domaine quelque part, vous devez complètement sauter cette étape et passer à l’étape deux ! Sinon, vous pouvez <a href="/domain-registration" rel="noopener noreferrer">cliquer ici pour enregistrer votre nom de domaine</a>.</li>
  <li class="mb-2 mb-md-3 mb-lg-5">
  Vous souvenez-vous où vous avez enregistré votre domaine ? Une fois que vous vous en souvenez, suivez les instructions ci-dessous :

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Important :
  </strong>
  <span>
    Vous devez ouvrir un nouvel onglet et vous connecter à votre registraire de domaine. Vous pouvez facilement cliquer sur votre "Registraire" ci-dessous pour le faire automatiquement. Dans ce nouvel onglet, vous devez naviguer vers la page de gestion DNS chez votre registraire – nous avons fourni les étapes de navigation détaillées ci-dessous dans la colonne "Étapes de configuration". Une fois que vous avez accédé à cette page dans le nouvel onglet, vous pouvez revenir à cet onglet et passer à l’étape trois ci-dessous.
    <strong class="font-weight-bold">Ne fermez pas encore l’onglet ouvert ; vous en aurez besoin pour les étapes suivantes !</strong>
  </span>
</div>

<table id="table-dns-management-by-registrar" class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Registraire</th>
      <th>Étapes de configuration</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://login.ionos.com/">1&amp;1</a></td>
      <td>Connectez-vous <i class="fa fa-angle-right"></i> Centre de domaine <i class="fa fa-angle-right"></i> (Sélectionnez votre domaine) <i class="fa fa-angle-right"></i> Modifier les paramètres DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon Route 53</a></td>
      <td>Connectez-vous <i class="fa fa-angle-right"></i> Zones hébergées <i class="fa fa-angle-right"></i> (Sélectionnez votre domaine)</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>
      <td>Connectez-vous <i class="fa fa-angle-right"></i> Mes serveurs <i class="fa fa-angle-right"></i> Gestion de domaine <i class="fa fa-angle-right"></i> Gestionnaire DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.bluehost.com/help/article/dns-management-add-edit-or-delete-dns-entries">Bluehost</a></td>
      <td>POUR ROCK : Connectez-vous <i class="fa fa-angle-right"></i> Domaines <i class="fa fa-angle-right"></i> (Cliquez sur l’icône ▼ à côté de gérer) <i class="fa fa-angle-right"></i> DNS
      <br />
      POUR LEGACY : Connectez-vous <i class="fa fa-angle-right"></i> Domaines <i class="fa fa-angle-right"></i> Éditeur de zone <i class="fa fa-angle-right"></i> (Sélectionnez votre domaine)</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://dash.cloudflare.com/login">Cloudflare</a></td>
      <td>Connectez-vous <i class="fa fa-angle-right"></i> DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://cp.dnsmadeeasy.com/">DNS Made Easy</a></td>
      <td>Connectez-vous <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> (Sélectionnez votre domaine)</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://dnsimple.com/dashboard">DNSimple</a></td>
      <td>Connectez-vous <i class="fa fa-angle-right"></i> (Sélectionnez votre domaine)  <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> Gérer</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://cloud.digitalocean.com/login">Digital Ocean</a></td>
      <td>Connectez-vous <i class="fa fa-angle-right"></i> Réseau <i class="fa fa-angle-right"></i> Domaines <i class="fa fa-angle-right"></i> (Sélectionnez votre domaine) <i class="fa fa-angle-right"></i> Plus <i class="fa fa-angle-right"></i> Gérer le domaine</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.domain.com/help/article/dns-management-how-to-update-dns-records">Domain.com</a></td>
      <td>Connectez-vous <i class="fa fa-angle-right"></i> En vue carte, cliquez sur gérer votre domaine <i class="fa fa-angle-right"></i> En vue liste, cliquez sur
l’icône d’engrenage <i class="fa fa-angle-right"></i> DNS & Serveurs de noms <i class="fa fa-angle-right"></i> Enregistrements DNS</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://www.domains.com/">Domains.com</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=WnU0Gp-Y-es"><i class="fa fa-play-circle"></i> Regarder</a>
      </td>
      <td>Connectez-vous <i class="fa fa-angle-right"></i> (Sélectionnez votre domaine) <i class="fa fa-angle-right"></i> Gérer <i class="fa fa-angle-right"></i> (cliquez sur l’icône d’engrenage) <i class="fa fa-angle-right"></i> Cliquez sur DNS &amp; Serveurs de noms dans le menu de gauche</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://panel.dreamhost.com/">DreamHost</a></td>
      <td>Connectez-vous <i class="fa fa-angle-right"></i> Panneau <i class="fa fa-angle-right"></i> Domaines <i class="fa fa-angle-right"></i> Gérer les domaines <i class="fa fa-angle-right"></i> DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://portal.dynect.net/login/">Dyn</a></td>
      <td>Connectez-vous <i class="fa fa-angle-right"></i> Vue d’ensemble <i class="fa fa-angle-right"></i> Gérer <i class="fa fa-angle-right"></i> Éditeur simple <i class="fa fa-angle-right"></i> Enregistrements</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://id.gandi.net/en/login">Gandi</a></td>
      <td>Connectez-vous <i class="fa fa-angle-right"></i> (Sélectionnez votre domaine) <i class="fa fa-angle-right"></i> Gestion <i class="fa fa-angle-right"></i> Modifier la zone</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://sso.godaddy.com">GoDaddy</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=G7g8FiZL5D8"><i class="fa fa-play-circle"></i> Regarder</a>
      </td>
      <td>Connectez-vous <i class="fa fa-angle-right"></i> Gérer mes domaines <i class="fa fa-angle-right"></i> (Sélectionnez votre domaine) <i class="fa fa-angle-right"></i> Gérer DNS</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://domains.google.com/registrar">Google Domains</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=01iHjbIN5CQ"><i class="fa fa-play-circle"></i> Regarder</a>
      </td>
      <td>Connectez-vous <i class="fa fa-angle-right"></i> (Sélectionnez votre domaine) <i class="fa fa-angle-right"></i> Configurer DNS</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://www.namecheap.com/myaccount/login/">Namecheap</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=no62GCzMn7E"><i class="fa fa-play-circle"></i> Regarder</a>
      </td>
      <td>Connectez-vous <i class="fa fa-angle-right"></i> Liste des domaines <i class="fa fa-angle-right"></i> (Sélectionnez votre domaine) <i class="fa fa-angle-right"></i> Gérer <i class="fa fa-angle-right"></i> DNS avancé</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://app.netlify.com/">Netlify</a></td>
      <td>Connectez-vous <i class="fa fa-angle-right"></i> (Sélectionnez votre domaine) <i class="fa fa-angle-right"></i> Configurer Netlify DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.networksolutions.com/manage-it/index.jsp">Network Solutions</a></td>
      <td>Connectez-vous <i class="fa fa-angle-right"></i> Gestionnaire de compte <i class="fa fa-angle-right"></i> Mes noms de domaine <i class="fa fa-angle-right"></i> (Sélectionnez votre domaine) <i class="fa fa-angle-right"></i> Gérer <i class="fa fa-angle-right"></i> Modifier la destination du domaine <i class="fa fa-angle-right"></i> DNS avancé</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://accounts.shopify.com/store-login">Shopify</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=G1NR8CIdv2M"><i class="fa fa-play-circle"></i> Regarder</a>
      </td>
      <td>Connectez-vous <i class="fa fa-angle-right"></i> Domaines gérés <i class="fa fa-angle-right"></i> (Sélectionnez votre domaine) <i class="fa fa-angle-right"></i> Paramètres DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://support.squarespace.com/hc/en-us/articles/214767107">Squarespace</a></td>
      <td>Connectez-vous <i class="fa fa-angle-right"></i> Menu d’accueil <i class="fa fa-angle-right"></i> Paramètres <i class="fa fa-angle-right"></i> Domaines <i class="fa fa-angle-right"></i> (Sélectionnez votre domaine) <i class="fa fa-angle-right"></i>
Paramètres avancés <i class="fa fa-angle-right"></i> Enregistrements personnalisés</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://vercel.com/docs/now-cli?utm_source=zeit-dashboard&utm_medium=web&utm_campaign=configure-dns#commands/dns">Now de Vercel</a></td>
      <td>Utilisation de la CLI "now" <i class="fa fa-angle-right"></i> <code>now dns add [domain] '@' MX [record-value] [priority]</code></td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.weebly.com/app/help/us/en/topics/manage-dns-records">Weebly</a></td>
      <td>Connectez-vous <i class="fa fa-angle-right"></i> Page Domaines <i class="fa fa-angle-right"></i> (Sélectionnez votre domaine) <i class="fa fa-angle-right"></i> DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://support.wix.com/en/article/adding-dns-records-in-your-wix-account">Wix</a></td>
      <td>Connectez-vous <i class="fa fa-angle-right"></i> Page Domaines <i class="fa fa-angle-right"></i> (Cliquez sur l’icône <i class="fa fa-ellipsis-h"></i>) <i class="fa fa-angle-right"></i> Sélectionnez Gérer les enregistrements DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.enom.com/login.aspx?page=%2fmyaccount%2fdefault.aspx&amp;">eNom</a></td>
      <td>Connectez-vous <i class="fa fa-angle-right"></i> Domaines <i class="fa fa-angle-right"></i> Mes domaines</td>
    </tr>
    <tr>
      <td>Autre</td>
      <td>
        <div class="alert mb-0 alert-warning"><i class="fa fa-exclamation-circle font-weight-bold"></i> <strong class="font-weight-bold">Important :</strong> Vous ne voyez pas le nom de votre registraire ici ? Cherchez simplement sur Internet "comment changer les enregistrements DNS sur $REGISTRAR" (en remplaçant $REGISTRAR par le nom de votre registraire – par exemple "comment changer les enregistrements DNS sur GoDaddy" si vous utilisez GoDaddy).</div>
      </td>
    </tr>
  </tbody>
</table>
</li>
<li class="mb-2 mb-md-3 mb-lg-5">En utilisant la page de gestion DNS de votre registraire (l’autre onglet que vous avez ouvert), configurez les enregistrements "MX" suivants :
<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Important :
  </strong>
  <span>
    Notez qu'il ne doit y avoir AUCUN autre enregistrement MX configuré. Les deux enregistrements ci-dessous DOIVENT exister. Assurez-vous qu'il n'y a pas de fautes de frappe ; et que vous avez correctement orthographié mx1 et mx2. S'il existait déjà des enregistrements MX, veuillez les supprimer complètement.
    La valeur "TTL" n'a pas besoin d'être 3600, elle peut être plus basse ou plus élevée si nécessaire.
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nom/Hôte/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Priorité</th>
      <th>Réponse/Valeur</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", ou vide</em></td>
      <td class="text-center">3600</td>
      <td>MX</td>
      <td>0</td>
      <td><code>mx1.forwardemail.net</code></td>
    </tr>
    <tr>
      <td><em>"@", ".", ou vide</em></td>
      <td class="text-center">3600</td>
      <td>MX</td>
      <td>0</td>
      <td><code>mx2.forwardemail.net</code></td>
    </tr>
  </tbody>
</table>

</li><li class="mb-2 mb-md-3 mb-lg-5" id="dns-configuration-options">En utilisant la page de gestion DNS de votre registrar (l'autre onglet que vous avez ouvert), configurez le(s) enregistrement(s) <strong class="notranslate">TXT</strong> suivant(s) :

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Important :
  </strong>
  <span>
    Si vous êtes sur un plan payant, vous devez complètement sauter cette étape et passer à l'étape cinq ! Si vous n'êtes pas sur un plan payant, alors vos adresses redirigées seront publiquement consultables – rendez-vous sur <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mon Compte <i class="fa fa-angle-right"></i> Domaines</a> et passez votre domaine à un plan payant si vous le souhaitez. Si vous souhaitez en savoir plus sur les plans payants, consultez notre page <a rel="noopener noreferrer" href="/private-business-email" class="alert-link">Tarification</a>. Sinon, vous pouvez continuer à choisir une ou plusieurs combinaisons parmi les Options A à F listées ci-dessous.
  </span>
</div>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Option A :
  </strong>
  <span>
    Si vous redirigez tous les emails de votre domaine, (par exemple "all@example.com", "hello@example.com", etc.) vers une adresse spécifique "user@gmail.com" :
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nom/Hôte/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Réponse/Valeur</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", ou vide</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=user@gmail.com</code>
      </td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Astuce :
  </strong>
  <span>
    Assurez-vous de remplacer les valeurs ci-dessus dans la colonne "Valeur" par votre propre adresse email. La valeur "TTL" n'a pas besoin d'être 3600, elle peut être plus basse ou plus élevée si nécessaire. Une valeur de temps de vie ("TTL") plus basse garantira que toute modification future apportée à vos enregistrements DNS soit propagée plus rapidement sur Internet – considérez cela comme la durée pendant laquelle elle sera mise en cache en mémoire (en secondes). Vous pouvez en apprendre plus sur le <a href="https://en.wikipedia.org/wiki/Time_to_live#DNS_records" rel="noopener noreferrer" target="_blank" class="alert-link">TTL sur Wikipédia</a>.
  </span>
</div>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Option B :
  </strong>
  <span>
    Si vous avez juste besoin de rediriger une seule adresse email (par exemple <code>hello@example.com</code> vers <code>user@gmail.com</code> ; cela redirigera aussi automatiquement "hello+test@example.com" vers "user+test@gmail.com") :
  </span>
</div>
<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nom/Hôte/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Réponse/Valeur</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", ou vide</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=hello:user@gmail.com</code>
      </td>
    </tr>
  </tbody>
</table>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Option C :
  </strong>
  <span>
    Si vous transférez plusieurs emails, vous devrez les séparer par une virgule :
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nom/Hôte/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Réponse/Valeur</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", ou vide</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=hello:user@gmail.com,support:user@gmail.com</code>
      </td>
    </tr>
  </tbody>
</table>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Option D :
  </strong>
  <span>
    Vous pouvez configurer un nombre infini d’emails de transfert – assurez-vous simplement de ne pas dépasser 255 caractères sur une seule ligne et de commencer chaque ligne par "forward-email=". Un exemple est fourni ci-dessous :
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nom/Hôte/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Réponse/Valeur</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", ou vide</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=hello:user@gmail.com,support:user@gmail.com</code>
      </td>
    </tr>
    <tr>
      <td><em>"@", ".", ou vide</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=help:user@gmail.com,foo:user@gmail.com</code>
      </td>
    </tr>
    <tr>
      <td><em>"@", ".", ou vide</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=orders:user@gmail.com,baz:user@gmail.com</code>
      </td>
    </tr>
    <tr>
      <td><em>"@", ".", ou vide</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=info:user@gmail.com,beep:user@gmail.com</code>
      </td>
    </tr>
    <tr>
      <td><em>"@", ".", ou vide</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=errors:user@gmail.com,boop:user@gmail.com</code>
      </td>
    </tr>
  </tbody>
</table>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Option E :
  </strong>
  <span>
    Vous pouvez aussi spécifier un nom de domaine dans votre enregistrement <strong class="notranslate">TXT</strong> pour avoir un transfert d’alias global (par exemple "user@example.com" sera transféré vers "user@example.net") :
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nom/Hôte/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Réponse/Valeur</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", ou vide</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=example.net</code>
      </td>
    </tr>
  </tbody>
</table>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Option F :
  </strong>
  <span>
    Vous pouvez même utiliser des webhooks comme alias global ou individuel pour transférer les emails. Voir l’exemple et la section complète sur les webhooks intitulée <a href="#do-you-support-webhooks" class="alert-link">Supportez-vous les webhooks</a> ci-dessous.
  </span>
</div>
<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nom/Hôte/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Réponse/Valeur</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", ou vide</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=alias:https://requestbin.com/r/en8pfhdgcculn</code>
      </td>
    </tr>
  </tbody>
</table>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Option G :
  </strong>
  <span>
    Vous pouvez même utiliser des expressions régulières ("regex") pour faire correspondre des alias et gérer les substitutions pour rediriger les emails. Voir les exemples et la section complète sur les regex intitulée <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">Supportez-vous les expressions régulières ou regex</a> ci-dessous.
  </span>
</div>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Besoin de regex avancées avec substitution ?</strong> Voir les exemples et la section complète sur les regex intitulée <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">Supportez-vous les expressions régulières ou regex</a> ci-dessous.
</div>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Exemple simple :</strong> Si je veux que tous les emails envoyés à `linus@example.com` ou `torvalds@example.com` soient redirigés vers `user@gmail.com` :
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nom/Hôte/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Réponse/Valeur</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", ou vide</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=/^(linus|torvalds)$/:user@gmail.com</code>
      </td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Important :
  </strong>
  <span>
    Les règles de redirection catch-all peuvent aussi être décrites comme "fall-through".
    Cela signifie que les emails entrants qui correspondent à au moins une règle de redirection spécifique seront utilisés à la place du catch-all.
    Les règles spécifiques incluent les adresses email et les expressions régulières.
    <br /><br />
    Par exemple :
    <br />
    <code>forward-email=hello:first@gmail.com,second@gmail.com</code>
    <br />
    Les emails envoyés à <code>hello@example.com</code> ne seront **pas** redirigés vers <code>second@gmail.com</code> (catch-all) avec cette configuration, et seront uniquement délivrés à <code>first@gmail.com</code>.
  </span>
</div>

---

</li><li class="mb-2 mb-md-3 mb-lg-5">En utilisant la page de gestion DNS de votre registrar (l’autre onglet que vous avez ouvert), ajoutez également l’enregistrement <strong class="notranslate">TXT</strong> suivant :

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nom/Hôte/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Réponse/Valeur</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", ou vide</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>v=spf1 a include:spf.forwardemail.net -all</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Important :
  </strong>
  <span>
    Si vous utilisez Gmail (par exemple Send Mail As) ou G Suite, vous devrez ajouter <code>include:_spf.google.com</code> à la valeur ci-dessus, par exemple :
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
  </span>
</div>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Astuce :
  </strong>
  <span>
    Si vous avez déjà une ligne similaire avec "v=spf1", vous devrez ajouter <code>include:spf.forwardemail.net</code> juste avant tout enregistrement "include:host.com" existant et avant le "-all" sur la même ligne, par exemple :
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
    <br /><br />
    Notez qu’il y a une différence entre "-all" et "~all". Le "-" indique que la vérification SPF doit ÉCHOUER si elle ne correspond pas, et "~" indique que la vérification SPF doit SOFTFAIL. Nous recommandons d’utiliser l’approche "-all" pour prévenir la falsification de domaine.
    <br /><br />
    Vous devrez peut-être aussi inclure l’enregistrement SPF pour l’hôte depuis lequel vous envoyez le mail (par exemple Outlook).
  </span>
</div>
</li><li class="mb-2 mb-md-3 mb-lg-5">Vérifiez vos enregistrements DNS en utilisant notre outil "Vérifier les enregistrements" disponible dans <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mon Compte <i class="fa fa-angle-right"></i> Domaines</a> <i class="fa fa-angle-right"></i> Configuration.

</li><li class="mb-2 mb-md-3 mb-lg-5">Envoyez un email test pour confirmer que cela fonctionne. Notez qu'il peut falloir un certain temps pour que vos enregistrements DNS se propagent.

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Astuce :
  </strong>
  <span>
  </span>
    Si vous ne recevez pas les emails tests, ou recevez un email test indiquant "Faites attention à ce message", consultez les réponses pour <a href="#why-am-i-not-receiving-my-test-emails" class="alert-link">Pourquoi ne reçois-je pas mes emails tests</a> et <a href="#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious" class="alert-link">Pourquoi mes emails tests envoyés à moi-même dans Gmail apparaissent comme "suspects"</a> respectivement.
</div>

</li><li class="mb-2 mb-md-3 mb-lg-5">Si vous souhaitez "Envoyer un mail en tant que" depuis Gmail, vous devrez <strong><a href="https://www.youtube.com/watch?v=MEheS8gM4Xs" target="_blank" rel="noopener noreferrer">regarder cette vidéo</a></strong>, ou suivre les étapes sous <a href="#how-to-send-mail-as-using-gmail">Comment envoyer un mail en tant que via Gmail</a> ci-dessous.

</li></ol>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Félicitations !
    </strong>
    <span>
      Vous avez complété toutes les étapes avec succès.
    </span>
  </div>
</div>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Astuce :
  </strong>
  <span>
    Les modules complémentaires optionnels sont listés ci-dessous. Notez que ces modules sont entièrement optionnels et peuvent ne pas être nécessaires. Nous voulions au moins vous fournir des informations supplémentaires si besoin.
  </span>
</div>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Module complémentaire optionnel :
  </strong>
  <span>
    Si vous utilisez la fonctionnalité <a class="alert-link" href="#how-to-send-mail-as-using-gmail">Comment envoyer un mail en tant que via Gmail</a>, vous pouvez vouloir vous ajouter à une liste blanche. Consultez <a class="alert-link" href="https://support.google.com/a/answer/60752?hl=en" target="_blank" rel="noopener noreferrer">ces instructions de Gmail</a> à ce sujet.
  </span>
</div>

### Puis-je utiliser plusieurs échanges MX et serveurs pour le transfert avancé {#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding}

Oui, mais **vous ne devez avoir qu'un seul échange MX listé dans vos enregistrements DNS**.

N'essayez pas d'utiliser la "Priorité" comme moyen de configurer plusieurs échanges MX.

Au lieu de cela, vous devez configurer votre échange MX existant pour transférer le courrier pour tous les alias non correspondants vers les échanges de notre service (`mx1.forwardemail.net` et/ou `mx2.forwardemail.net`).

Si vous utilisez Google Workspace et souhaitez transférer tous les alias non correspondants vers notre service, consultez <https://support.google.com/a/answer/6297084>.

Si vous utilisez Microsoft 365 (Outlook) et souhaitez transférer tous les alias non correspondants vers notre service, consultez <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/use-connectors-to-configure-mail-flow/set-up-connectors-to-route-mail> et <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/manage-mail-flow-for-multiple-locations>.

### Comment configurer un répondeur de vacances (répondeur automatique d'absence) {#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder}

Allez dans <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Mon Compte <i class="fa fa-angle-right"></i> Domaines</a> <i class="fa fa-angle-right"></i> Alias et créez ou modifiez l'alias pour lequel vous souhaitez configurer un répondeur automatique de vacances.
Vous avez la possibilité de configurer une date de début, une date de fin, un sujet et un message, et de l’activer ou de la désactiver à tout moment :

* Le sujet et le message en texte brut sont actuellement pris en charge (nous utilisons le paquet `striptags` en interne pour supprimer tout HTML).
* Le sujet est limité à 100 caractères.
* Le message est limité à 1000 caractères.
* La configuration nécessite une configuration SMTP sortante (par exemple, vous devrez configurer les enregistrements DNS DKIM, DMARC et Return-Path).
  * Rendez-vous sur <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Mon Compte <i class="fa fa-angle-right"></i> Domaines</a> <i class="fa fa-angle-right"></i> Paramètres <i class="fa fa-angle-right"></i> Configuration SMTP sortante et suivez les instructions de configuration.
* Le répondeur de vacances ne peut pas être activé sur les noms de domaine personnalisés globaux (par exemple, les [adresses jetables](/disposable-addresses) ne sont pas prises en charge).
* Le répondeur de vacances ne peut pas être activé pour les alias avec des jokers/captures générales (`*`) ni des expressions régulières.

Contrairement aux systèmes de messagerie tels que `postfix` (par exemple ceux qui utilisent l’extension de filtre vacation `sieve`), Forward Email ajoute automatiquement votre signature DKIM, protège contre les problèmes de connexion lors de l’envoi des réponses de vacances (par exemple en raison de problèmes courants de connexion SSL/TLS et de serveurs maintenus en mode legacy), et prend même en charge Open WKD et le chiffrement PGP pour les réponses de vacances.

<!--
* Afin de prévenir les abus, 1 crédit SMTP sortant sera déduit pour chaque message de répondeur de vacances envoyé.
  * Tous les comptes payants incluent par défaut 300 crédits par jour. Si vous avez besoin d’un plus grand nombre, veuillez nous contacter.
-->

1. Nous n’envoyons qu’une seule fois par expéditeur [autorisé](#do-you-have-an-allowlist) tous les 4 jours (ce qui est similaire au comportement de Gmail).

   * Notre cache Redis utilise une empreinte de `alias_id` et `sender`, où `alias_id` est l’ID MongoDB de l’alias et `sender` est soit l’adresse From (si autorisée) soit le domaine racine dans l’adresse From (si non autorisée). Pour simplifier, l’expiration de cette empreinte dans le cache est fixée à 4 jours.

   * Notre approche consistant à utiliser le domaine racine analysé dans l’adresse From pour les expéditeurs non autorisés empêche les abus de la part d’expéditeurs relativement inconnus (par exemple des acteurs malveillants) qui inondent de messages de répondeur de vacances.

2. Nous n’envoyons que lorsque le MAIL FROM et/ou From n’est pas vide et ne contient pas (insensible à la casse) un [nom d’utilisateur postmaster](#what-are-postmaster-addresses) (la partie avant le @ dans un email).

3. Nous n’envoyons pas si le message original contenait l’un des en-têtes suivants (insensible à la casse) :

   * En-tête `auto-submitted` avec une valeur différente de `no`.
   * En-tête `x-auto-response-suppress` avec une valeur de `dr`, `autoreply`, `auto-reply`, `auto_reply` ou `all`.
   * En-tête `list-id`, `list-subscribe`, `list-unsubscribe`, `list-help`, `list-post`, `list-owner`, `list-archive`, `x-autoreply`, `x-autorespond` ou `x-auto-respond` (quelle que soit la valeur).
   * En-tête `precedence` avec une valeur de `bulk`, `autoreply`, `auto-reply`, `auto_reply` ou `list`.

4. Nous n’envoyons pas si l’adresse MAIL FROM ou From se termine par `+donotreply`, `-donotreply`, `+noreply` ou `-noreply`.

5. Nous n’envoyons pas si la partie nom d’utilisateur de l’adresse From était `mdaemon` et qu’elle contenait un en-tête insensible à la casse `X-MDDSN-Message`.

6. Nous n’envoyons pas s’il y avait un en-tête insensible à la casse `content-type` de type `multipart/report`.

### Comment configurer SPF pour Forward Email {#how-do-i-set-up-spf-for-forward-email}

En utilisant la page de gestion DNS de votre registrar, ajoutez l’enregistrement <strong class="notranslate">TXT</strong> suivant :

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nom/Hôte/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Réponse/Valeur</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", ou vide</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>v=spf1 a include:spf.forwardemail.net -all</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Important :
  </strong>
  <span>
    Si vous utilisez Gmail (par exemple Send Mail As) ou G Suite, vous devrez alors ajouter <code>include:_spf.google.com</code> à la valeur ci-dessus, par exemple :
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
  </span>
</div>
<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Important :
  </strong>
  <span>
    Si vous utilisez Microsoft Outlook ou Live.com, vous devrez ajouter <code>include:spf.protection.outlook.com</code> à votre enregistrement SPF <strong class="notranslate">TXT</strong>, par exemple :
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:spf.protection.outlook.com -all</code>
  </span>
</div>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Astuce :
  </strong>
  <span>
    Si vous avez déjà une ligne similaire avec "v=spf1", vous devrez alors ajouter <code>include:spf.forwardemail.net</code> juste avant tout enregistrement "include:host.com" existant et avant le "-all" sur la même ligne, par exemple :
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
    <br /><br />
    Notez qu'il y a une différence entre "-all" et "~all". Le "-" indique que la vérification SPF doit ÉCHOUER si elle ne correspond pas, et "~" indique que la vérification SPF doit SOFTFAIL. Nous recommandons d'utiliser l'approche "-all" pour prévenir la falsification de domaine.
    <br /><br />
    Vous devrez peut-être aussi inclure l'enregistrement SPF pour l'hôte à partir duquel vous envoyez des mails (par exemple Outlook).
  </span>
</div>

### Comment configurer DKIM pour Forward Email {#how-do-i-set-up-dkim-for-forward-email}

Allez dans <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Mon Compte <i class="fa fa-angle-right"></i> Domaines</a> <i class="fa fa-angle-right"></i> Paramètres <i class="fa fa-angle-right"></i> Configuration SMTP Sortant et suivez les instructions de configuration.

### Comment configurer DMARC pour Forward Email {#how-do-i-set-up-dmarc-for-forward-email}

Allez dans <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Mon Compte <i class="fa fa-angle-right"></i> Domaines</a> <i class="fa fa-angle-right"></i> Paramètres <i class="fa fa-angle-right"></i> Configuration SMTP Sortant et suivez les instructions de configuration.

### Comment consulter les rapports DMARC {#how-do-i-view-dmarc-reports}

Forward Email fournit un tableau de bord complet des rapports DMARC qui vous permet de surveiller les performances d'authentification de vos emails sur tous vos domaines depuis une interface unique.

**Qu'est-ce que les rapports DMARC ?**

Les rapports DMARC (Domain-based Message Authentication, Reporting, and Conformance) sont des fichiers XML envoyés par les serveurs de réception qui vous indiquent comment vos emails sont authentifiés. Ces rapports vous aident à comprendre :

* Combien d'emails sont envoyés depuis votre domaine
* Si ces emails passent l'authentification SPF et DKIM
* Quelles actions les serveurs récepteurs prennent (accepter, mettre en quarantaine ou rejeter)
* Quelles adresses IP envoient des emails au nom de votre domaine

**Comment accéder aux rapports DMARC**

Allez dans <a href="/my-account/dmarc-reports" class="alert-link" target="_blank" rel="noopener noreferrer">Mon Compte <i class="fa fa-angle-right"></i> Rapports DMARC</a> pour consulter votre tableau de bord. Vous pouvez aussi accéder aux rapports spécifiques à un domaine depuis <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Mon Compte <i class="fa fa-angle-right"></i> Domaines</a> en cliquant sur le bouton "DMARC" à côté de n'importe quel domaine.

**Fonctionnalités du tableau de bord**

Le tableau de bord des rapports DMARC offre :

* **Métriques Résumées** : Nombre total de rapports reçus, total de messages analysés, taux d'alignement SPF, taux d'alignement DKIM, et taux global de réussite
* **Graphique des messages dans le temps** : Tendance visuelle du volume d'emails et des taux d'authentification sur les 30 derniers jours
* **Résumé d'alignement** : Diagramme en anneau montrant la répartition de l'alignement SPF vs DKIM
* **Disposition des messages** : Diagramme à barres empilées montrant comment les serveurs récepteurs ont traité vos emails (acceptés, mis en quarantaine ou rejetés)
* **Tableau des rapports récents** : Liste détaillée des rapports DMARC individuels avec filtrage et pagination
* **Filtrage par domaine** : Filtrer les rapports par domaine spécifique lors de la gestion de plusieurs domaines
**Pourquoi c’est important**

Pour les organisations gérant plusieurs domaines (comme les entreprises, les associations ou les agences), les rapports DMARC sont essentiels pour :

* **Identifier les expéditeurs non autorisés** : Détecter si quelqu’un usurpe votre domaine
* **Améliorer la délivrabilité** : S’assurer que vos e-mails légitimes passent l’authentification
* **Surveiller l’infrastructure e-mail** : Suivre quels services et IP envoient des messages en votre nom
* **Conformité** : Maintenir la visibilité sur l’authentification des e-mails pour les audits de sécurité

Contrairement à d’autres services qui nécessitent des outils de surveillance DMARC séparés, Forward Email inclut le traitement et la visualisation des rapports DMARC dans votre compte sans coût supplémentaire.

**Exigences**

* Les rapports DMARC sont disponibles uniquement pour les plans payants
* Votre domaine doit avoir DMARC configuré (voir [Comment configurer DMARC pour Forward Email](#how-do-i-set-up-dmarc-for-forward-email))
* Les rapports sont automatiquement collectés lorsque les serveurs de réception les envoient à votre adresse de rapport DMARC configurée

**Rapports hebdomadaires par e-mail**

Les utilisateurs des plans payants reçoivent automatiquement des résumés hebdomadaires des rapports DMARC par e-mail. Ces e-mails incluent :

* Statistiques récapitulatives pour tous vos domaines
* Taux d’alignement SPF et DKIM
* Répartition des dispositions des messages (acceptés, mis en quarantaine, rejetés)
* Principales organisations rapportant (Google, Microsoft, Yahoo, etc.)
* Adresses IP avec des problèmes d’alignement pouvant nécessiter une attention
* Liens directs vers votre tableau de bord des rapports DMARC

Les rapports hebdomadaires sont envoyés automatiquement et ne peuvent pas être désactivés séparément des autres notifications par e-mail.

### Comment connecter et configurer mes contacts {#how-do-i-connect-and-configure-my-contacts}

**Pour configurer vos contacts, utilisez l’URL CardDAV suivante :** `https://carddav.forwardemail.net` (ou simplement `carddav.forwardemail.net` si votre client le permet)

### Comment connecter et configurer mes calendriers {#how-do-i-connect-and-configure-my-calendars}

**Pour configurer votre calendrier, utilisez l’URL CalDAV suivante :** `https://caldav.forwardemail.net` (ou simplement `caldav.forwardemail.net` si votre client le permet)

<img width="612" height="520" src="/img/faq/calendar-setup.png" alt="Exemple de configuration CalDAV Calendrier Forward Email Thunderbird" />

### Comment ajouter plus de calendriers et gérer les calendriers existants {#how-do-i-add-more-calendars-and-manage-existing-calendars}

Si vous souhaitez ajouter des calendriers supplémentaires, ajoutez simplement une nouvelle URL de calendrier : `https://caldav.forwardemail.net/dav/principals/calendar-name` (**assurez-vous de remplacer `calendar-name` par le nom de calendrier souhaité**)

Vous pouvez modifier le nom et la couleur d’un calendrier après sa création – utilisez simplement votre application de calendrier préférée (par exemple Apple Mail ou [Thunderbird](https://thunderbird.net)).

### Comment connecter et configurer les tâches et rappels {#how-do-i-connect-and-configure-tasks-and-reminders}

**Pour configurer les tâches et rappels, utilisez la même URL CalDAV que pour les calendriers :** `https://caldav.forwardemail.net` (ou simplement `caldav.forwardemail.net` si votre client le permet)

Les tâches et rappels seront automatiquement séparés des événements du calendrier dans leur propre collection de calendrier « Rappels » ou « Tâches ».

**Instructions de configuration par plateforme :**

**macOS/iOS :**

1. Ajoutez un nouveau compte CalDAV dans Préférences Système > Comptes Internet (ou Réglages > Comptes sur iOS)
2. Utilisez `caldav.forwardemail.net` comme serveur
3. Entrez votre alias Forward Email et le mot de passe généré
4. Après la configuration, vous verrez les collections « Calendrier » et « Rappels »
5. Utilisez l’application Rappels pour créer et gérer les tâches

**Android avec Tasks.org :**

1. Installez Tasks.org depuis Google Play Store ou F-Droid
2. Allez dans Paramètres > Synchronisation > Ajouter un compte > CalDAV
3. Entrez le serveur : `https://caldav.forwardemail.net`
4. Entrez votre alias Forward Email et le mot de passe généré
5. Tasks.org découvrira automatiquement vos calendriers de tâches

**Thunderbird :**

1. Installez le module Lightning si ce n’est pas déjà fait
2. Créez un nouveau calendrier de type « CalDAV »
3. Utilisez l’URL : `https://caldav.forwardemail.net`
4. Entrez vos identifiants Forward Email
5. Les événements et tâches seront disponibles dans l’interface du calendrier

### Pourquoi ne puis-je pas créer de tâches dans Rappels macOS {#why-cant-i-create-tasks-in-macos-reminders}
Si vous rencontrez des difficultés pour créer des tâches dans macOS Rappels, essayez ces étapes de dépannage :

1. **Vérifiez la configuration du compte** : Assurez-vous que votre compte CalDAV est correctement configuré avec `caldav.forwardemail.net`

2. **Vérifiez les calendriers séparés** : Vous devriez voir à la fois "Calendrier" et "Rappels" dans votre compte. Si vous ne voyez que "Calendrier", le support des tâches peut ne pas être entièrement activé encore.

3. **Actualisez le compte** : Essayez de supprimer puis de réajouter votre compte CalDAV dans Préférences Système > Comptes Internet

4. **Vérifiez la connectivité au serveur** : Testez que vous pouvez accéder à `https://caldav.forwardemail.net` dans votre navigateur

5. **Vérifiez les identifiants** : Assurez-vous d’utiliser l’alias email correct et le mot de passe généré (pas votre mot de passe de compte)

6. **Forcer la synchronisation** : Dans l’application Rappels, essayez de créer une tâche puis de rafraîchir manuellement la synchronisation

**Problèmes courants :**

* **"Calendrier Rappels introuvable"** : Le serveur peut avoir besoin d’un moment pour créer la collection Rappels lors du premier accès
* **Tâches non synchronisées** : Vérifiez que les deux appareils utilisent les mêmes identifiants de compte CalDAV
* **Contenu mixte** : Assurez-vous que les tâches sont créées dans le calendrier "Rappels", pas dans le "Calendrier" général

### Comment configurer Tasks.org sur Android {#how-do-i-set-up-tasksorg-on-android}

Tasks.org est un gestionnaire de tâches open-source populaire qui fonctionne parfaitement avec le support CalDAV des tâches de Forward Email.

**Installation et configuration :**

1. **Installer Tasks.org** :
   * Depuis Google Play Store : [Tasks.org](https://play.google.com/store/apps/details?id=org.tasks)
   * Depuis F-Droid : [Tasks.org sur F-Droid](https://f-droid.org/packages/org.tasks/)

2. **Configurer la synchronisation CalDAV** :
   * Ouvrez Tasks.org
   * Allez dans ☰ Menu > Paramètres > Synchronisation
   * Appuyez sur "Ajouter un compte"
   * Sélectionnez "CalDAV"

3. **Saisir les paramètres Forward Email** :
   * **URL du serveur** : `https://caldav.forwardemail.net`
   * **Nom d’utilisateur** : Votre alias Forward Email (ex. `vous@votredomaine.com`)
   * **Mot de passe** : Votre mot de passe généré spécifique à l’alias
   * Appuyez sur "Ajouter un compte"

4. **Découverte du compte** :
   * Tasks.org découvrira automatiquement vos calendriers de tâches
   * Vous devriez voir apparaître votre collection "Rappels"
   * Appuyez sur "S’abonner" pour activer la synchronisation du calendrier de tâches

5. **Tester la synchronisation** :
   * Créez une tâche test dans Tasks.org
   * Vérifiez qu’elle apparaît dans d’autres clients CalDAV (comme macOS Rappels)
   * Vérifiez que les modifications se synchronisent dans les deux sens

**Fonctionnalités disponibles :**

* ✅ Création et édition de tâches
* ✅ Dates d’échéance et rappels
* ✅ Achèvement et statut des tâches
* ✅ Niveaux de priorité
* ✅ Sous-tâches et hiérarchie des tâches
* ✅ Étiquettes et catégories
* ✅ Synchronisation bidirectionnelle avec d’autres clients CalDAV

**Dépannage :**

* Si aucun calendrier de tâches n’apparaît, essayez de rafraîchir manuellement dans les paramètres de Tasks.org
* Assurez-vous d’avoir au moins une tâche créée sur le serveur (vous pouvez en créer une d’abord dans macOS Rappels)
* Vérifiez la connectivité réseau vers `caldav.forwardemail.net`

### Comment configurer SRS pour Forward Email {#how-do-i-set-up-srs-for-forward-email}

Nous configurons automatiquement le [Sender Rewriting Scheme](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme) ("SRS") – vous n’avez pas besoin de le faire vous-même.

### Comment configurer MTA-STS pour Forward Email {#how-do-i-set-up-mta-sts-for-forward-email}

Veuillez consulter [notre section sur MTA-STS](#do-you-support-mta-sts) pour plus d’informations.

### Comment ajouter une photo de profil à mon adresse email {#how-do-i-add-a-profile-picture-to-my-email-address}

Si vous utilisez Gmail, suivez les étapes ci-dessous :

1. Allez sur <https://google.com> et déconnectez-vous de tous les comptes email
2. Cliquez sur "Se connecter" puis dans le menu déroulant cliquez sur "autre compte"
3. Sélectionnez "Utiliser un autre compte"
4. Sélectionnez "Créer un compte"
5. Sélectionnez "Utiliser mon adresse email actuelle à la place"
6. Saisissez votre adresse email de domaine personnalisé
7. Récupérez l’email de vérification envoyé à votre adresse email
8. Saisissez le code de vérification contenu dans cet email
9. Complétez les informations de profil pour votre nouveau compte Google
10. Acceptez toutes les politiques de confidentialité et conditions d’utilisation
11. Allez sur <https://google.com> et en haut à droite, cliquez sur votre icône de profil, puis cliquez sur le bouton "modifier"
12. Téléchargez une nouvelle photo ou avatar pour votre compte
13. Les modifications prendront environ 1 à 2 heures pour se propager, mais parfois peuvent être très rapides.
14. Envoyez un email test et la photo de profil devrait apparaître.
## Fonctionnalités avancées {#advanced-features}

### Prenez-vous en charge les newsletters ou listes de diffusion pour les emails liés au marketing {#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email}

Oui, vous pouvez en savoir plus sur <https://forwardemail.net/guides/newsletter-with-listmonk>.

Veuillez noter que afin de maintenir la réputation IP et d'assurer la délivrabilité, Forward Email dispose d'un processus de révision manuel par domaine pour **l'approbation des newsletters**. Envoyez un email à <support@forwardemail.net> ou ouvrez une [demande d'aide](https://forwardemail.net/help) pour obtenir l'approbation. Cela prend généralement moins de 24 heures, la plupart des demandes étant traitées en 1 à 2 heures. Dans un avenir proche, nous visons à rendre ce processus instantané avec des contrôles anti-spam supplémentaires et des alertes. Ce processus garantit que vos emails atteignent la boîte de réception et que vos messages ne sont pas marqués comme spam.

### Prenez-vous en charge l'envoi d'emails via API {#do-you-support-sending-email-with-api}

Oui, depuis mai 2023, nous prenons en charge l'envoi d'emails via API en tant qu'extension pour tous les utilisateurs payants.

<div class="alert my-3 alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Important :
  </strong>
  <span>
    Veuillez vous assurer d'avoir lu nos <a href="/terms" class="alert-link" target="_blank">Conditions</a>, <a href="/privacy" class="alert-link" target="_blank">Politique de confidentialité</a>, et <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Limites SMTP sortantes</a> &ndash; votre utilisation est considérée comme une reconnaissance et un accord.
  </span>
</div>

Veuillez consulter notre section sur les [Emails](/email-api#outbound-emails) dans notre documentation API pour les options, exemples et plus d'informations.

Pour envoyer des emails sortants avec notre API, vous devez utiliser votre jeton API disponible sous [Ma sécurité](/my-account/security).

### Prenez-vous en charge la réception d'emails via IMAP {#do-you-support-receiving-email-with-imap}

Oui, depuis le 16 octobre 2023, nous prenons en charge la réception d'emails via IMAP en tant qu'extension pour tous les utilisateurs payants.  **Veuillez lire notre article approfondi** sur [le fonctionnement de notre fonctionnalité de stockage de boîte aux lettres chiffrée SQLite](/blog/docs/best-quantum-safe-encrypted-email-service).

<div id="imap-instructions">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Important :
  </strong>
  <span>
    Veuillez vous assurer d'avoir lu nos <a href="/terms" class="alert-link" target="_blank">Conditions</a> et <a href="/privacy" class="alert-link" target="_blank">Politique de confidentialité</a> &ndash; votre utilisation est considérée comme une reconnaissance et un accord.
  </span>
</div>

1. Créez un nouvel alias pour votre domaine sous <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mon compte <i class="fa fa-angle-right"></i> Domaines</a> <i class="fa fa-angle-right"></i> Alias (par exemple <code><hello@example.com></code>)

2. Cliquez sur <strong class="text-success"><i class="fa fa-key"></i> Générer un mot de passe</strong> à côté de l'alias nouvellement créé. Copiez-le dans votre presse-papiers et stockez en toute sécurité le mot de passe généré affiché à l'écran.

3. Avec votre application email préférée, ajoutez ou configurez un compte avec votre alias nouvellement créé (par exemple <code><hello@example.com></code>)
   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Astuce :
     </strong>
     <span>Nous recommandons d'utiliser <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a>, ou <a href="/blog/open-source" class="alert-link" target="_blank">une alternative open-source et axée sur la confidentialité</a>.</span>
   </div>

4. Lorsque vous êtes invité à saisir le nom du serveur IMAP, entrez `imap.forwardemail.net`

5. Lorsque vous êtes invité à saisir le port du serveur IMAP, entrez `993` (SSL/TLS) – voir les [ports IMAP alternatifs](/faq#what-are-your-imap-server-configuration-settings) si nécessaire
   <div class="alert my-3 alert-warning">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Astuce :
     </strong>
     <span>Si vous utilisez Thunderbird, assurez-vous que la "Sécurité de la connexion" est réglée sur "SSL/TLS" et que la méthode d'authentification est "Mot de passe normal".</span>
   </div>
6. Lorsque vous êtes invité à saisir le mot de passe du serveur IMAP, collez le mot de passe depuis <strong class="text-success"><i class="fa fa-key"></i> Générer un mot de passe</strong> à l’étape 2 ci-dessus

7. **Enregistrez vos paramètres** – si vous rencontrez des problèmes, veuillez <a href="/help">nous contacter</a>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Félicitations !
    </strong>
    <span>
      Vous avez réussi toutes les étapes.
    </span>
  </div>
</div>

</div>

### Prenez-vous en charge POP3 {#do-you-support-pop3}

Oui, depuis le 4 décembre 2023, nous prenons en charge le [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol) en tant que module complémentaire pour tous les utilisateurs payants.  **Veuillez lire notre article approfondi** sur [le fonctionnement de notre fonctionnalité de stockage de boîte aux lettres SQLite chiffrée](/blog/docs/best-quantum-safe-encrypted-email-service).

<div id="pop3-instructions">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Important :
  </strong>
  <span>
    Veuillez vous assurer d’avoir lu nos <a href="/terms" class="alert-link" target="_blank">Conditions</a> et <a href="/privacy" class="alert-link" target="_blank">Politique de confidentialité</a> &ndash; votre utilisation est considérée comme une reconnaissance et un accord.
  </span>
</div>

1. Créez un nouvel alias pour votre domaine sous <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mon compte <i class="fa fa-angle-right"></i> Domaines</a> <i class="fa fa-angle-right"></i> Alias (par exemple <code><hello@example.com></code>)

2. Cliquez sur <strong class="text-success"><i class="fa fa-key"></i> Générer un mot de passe</strong> à côté de l’alias nouvellement créé. Copiez-le dans votre presse-papiers et stockez en toute sécurité le mot de passe généré affiché à l’écran.

3. Avec votre application de messagerie préférée, ajoutez ou configurez un compte avec votre alias nouvellement créé (par exemple <code><hello@example.com></code>)
   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Astuce :
     </strong>
     <span>Nous recommandons d’utiliser <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a>, ou <a href="/blog/open-source" class="alert-link" target="_blank">une alternative open-source et axée sur la confidentialité</a>.</span>
   </div>

4. Lorsque vous êtes invité à saisir le nom du serveur POP3, entrez `pop3.forwardemail.net`

5. Lorsque vous êtes invité à saisir le port du serveur POP3, entrez `995` (SSL/TLS) – voir les [ports POP3 alternatifs](/faq#what-are-your-pop3-server-configuration-settings) si nécessaire
   <div class="alert my-3 alert-warning">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Astuce :
     </strong>
     <span>Si vous utilisez Thunderbird, assurez-vous que la « Sécurité de la connexion » est réglée sur « SSL/TLS » et que la méthode d’authentification est « Mot de passe normal ».</span>
   </div>

6. Lorsque vous êtes invité à saisir le mot de passe du serveur POP3, collez le mot de passe depuis <strong class="text-success"><i class="fa fa-key"></i> Générer un mot de passe</strong> à l’étape 2 ci-dessus

7. **Enregistrez vos paramètres** – si vous rencontrez des problèmes, veuillez <a href="/help">nous contacter</a>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Félicitations !
    </strong>
    <span>
      Vous avez réussi toutes les étapes.
    </span>
  </div>
</div>

</div>

### Prenez-vous en charge les calendriers (CalDAV) {#do-you-support-calendars-caldav}

Oui, depuis le 5 février 2024, nous avons ajouté cette fonctionnalité. Notre serveur est `caldav.forwardemail.net` et est également surveillé sur notre <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">page de statut</a>.
Il prend en charge à la fois IPv4 et IPv6 et est disponible sur le port `443` (HTTPS).

| Connexion | Exemple                    | Description                                                                                                                                                                               |
| --------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nom d’utilisateur | `user@example.com`         | Adresse e-mail d’un alias qui existe pour le domaine dans <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mon compte <i class="fa fa-angle-right"></i> Domaines</a>. |
| Mot de passe | `************************` | Mot de passe généré spécifique à l’alias.                                                                                                                                                 |

Pour utiliser la prise en charge du calendrier, **l’utilisateur** doit être l’adresse e-mail d’un alias qui existe pour le domaine dans <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mon compte <i class="fa fa-angle-right"></i> Domaines</a> – et le **mot de passe** doit être un mot de passe généré spécifique à l’alias.

### Prenez-vous en charge les tâches et rappels (CalDAV VTODO) {#do-you-support-tasks-and-reminders-caldav-vtodo}

Oui, depuis le 14 octobre 2025, nous avons ajouté la prise en charge de CalDAV VTODO pour les tâches et rappels. Cela utilise le même serveur que notre prise en charge du calendrier : `caldav.forwardemail.net`.

Notre serveur CalDAV prend en charge à la fois les événements de calendrier (VEVENT) et les composants tâches (VTODO) en utilisant des **calendriers unifiés**. Cela signifie que chaque calendrier peut contenir à la fois des événements et des tâches, offrant une flexibilité maximale et une compatibilité avec tous les clients CalDAV.

**Comment fonctionnent les calendriers et les listes :**

* **Chaque calendrier prend en charge à la fois les événements et les tâches** – Vous pouvez ajouter des événements, des tâches, ou les deux à n’importe quel calendrier
* **Listes Apple Rappels** – Chaque liste que vous créez dans Apple Rappels devient un calendrier distinct sur le serveur
* **Calendriers multiples** – Vous pouvez créer autant de calendriers que nécessaire, chacun avec son propre nom, couleur et organisation
* **Synchronisation multi-clients** – Les tâches et événements se synchronisent parfaitement entre tous les clients compatibles

**Clients de tâches pris en charge :**

* **macOS Rappels** – Prise en charge native complète pour la création, l’édition, la complétion et la synchronisation des tâches
* **iOS Rappels** – Prise en charge native complète sur tous les appareils iOS
* **Tasks.org (Android)** – Gestionnaire de tâches open-source populaire avec synchronisation CalDAV
* **Thunderbird** – Prise en charge des tâches et du calendrier dans le client mail de bureau
* **Tout gestionnaire de tâches compatible CalDAV** – Prise en charge standard du composant VTODO

**Fonctionnalités des tâches prises en charge :**

* Création, édition et suppression de tâches
* Dates d’échéance et dates de début
* Statut d’achèvement des tâches (NEEDS-ACTION, IN-PROCESS, COMPLETED, CANCELLED)
* Niveaux de priorité des tâches
* Tâches récurrentes
* Descriptions et notes des tâches
* Synchronisation multi-appareils
* Sous-tâches avec propriété RELATED-TO
* Rappels de tâches avec VALARM

Les identifiants de connexion sont les mêmes que pour la prise en charge du calendrier :

| Connexion | Exemple                    | Description                                                                                                                                                                               |
| --------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nom d’utilisateur | `user@example.com`         | Adresse e-mail d’un alias qui existe pour le domaine dans <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mon compte <i class="fa fa-angle-right"></i> Domaines</a>. |
| Mot de passe | `************************` | Mot de passe généré spécifique à l’alias.                                                                                                                                                 |

**Notes importantes :**

* **Chaque liste Rappels est un calendrier distinct** – Lorsque vous créez une nouvelle liste dans Apple Rappels, cela crée un nouveau calendrier sur le serveur CalDAV
* **Utilisateurs Thunderbird** – Vous devrez vous abonner manuellement à chaque calendrier/liste que vous souhaitez synchroniser, ou utiliser l’URL de la racine du calendrier : `https://caldav.forwardemail.net/dav/your-email@domain.com/`
* **Utilisateurs Apple** – La découverte des calendriers se fait automatiquement, donc tous vos calendriers et listes apparaîtront dans Calendar.app et Reminders.app
* **Calendriers unifiés** – Tous les calendriers prennent en charge à la fois les événements et les tâches, vous offrant une flexibilité dans l’organisation de vos données
### Supportez-vous les contacts (CardDAV) {#do-you-support-contacts-carddav}

Oui, depuis le 12 juin 2025, nous avons ajouté cette fonctionnalité. Notre serveur est `carddav.forwardemail.net` et est également surveillé sur notre <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">page de statut</a>.

Il prend en charge à la fois IPv4 et IPv6 et est disponible sur le port `443` (HTTPS).

| Connexion | Exemple                    | Description                                                                                                                                                                               |
| --------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nom d'utilisateur | `user@example.com`         | Adresse e-mail d'un alias existant pour le domaine dans <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mon Compte <i class="fa fa-angle-right"></i> Domaines</a>. |
| Mot de passe | `************************` | Mot de passe généré spécifique à l'alias.                                                                                                                                                  |

Pour utiliser la prise en charge des contacts, le **utilisateur** doit être l'adresse e-mail d'un alias existant pour le domaine dans <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mon Compte <i class="fa fa-angle-right"></i> Domaines</a> – et le **mot de passe** doit être un mot de passe généré spécifique à l'alias.

### Supportez-vous l'envoi d'e-mails avec SMTP {#do-you-support-sending-email-with-smtp}

Oui, depuis mai 2023, nous supportons l'envoi d'e-mails avec SMTP en tant qu'option supplémentaire pour tous les utilisateurs payants.

<div id="smtp-instructions">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Important :
  </strong>
  <span>
    Veuillez vous assurer d'avoir lu nos <a href="/terms" class="alert-link" target="_blank">Conditions</a>, <a href="/privacy" class="alert-link" target="_blank">Politique de confidentialité</a>, et <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Limites SMTP sortantes</a> &ndash; votre utilisation est considérée comme une reconnaissance et un accord.
  </span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Important :
  </strong>
  <span>
    Si vous utilisez Gmail, veuillez consulter notre <a class="alert-link" href="/guides/send-mail-as-gmail-custom-domain">guide Envoyer un mail en tant que avec Gmail</a>. Si vous êtes développeur, veuillez consulter notre <a class="alert-link" href="/email-api#outbound-emails" target="_blank">documentation API e-mail</a>.
  </span>
</div>

1. Allez dans <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Mon Compte <i class="fa fa-angle-right"></i> Domaines</a> <i class="fa fa-angle-right"></i> Paramètres <i class="fa fa-angle-right"></i> Configuration SMTP sortante et suivez les instructions d'installation

2. Créez un nouvel alias pour votre domaine dans <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mon Compte <i class="fa fa-angle-right"></i> Domaines</a> <i class="fa fa-angle-right"></i> Alias (par exemple <code><hello@example.com></code>)

3. Cliquez sur <strong class="text-success"><i class="fa fa-key"></i> Générer un mot de passe</strong> à côté de l'alias nouvellement créé. Copiez-le dans votre presse-papiers et stockez en toute sécurité le mot de passe généré affiché à l'écran.

4. Avec votre application e-mail préférée, ajoutez ou configurez un compte avec votre alias nouvellement créé (par exemple <code><hello@example.com></code>)
   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Astuce :
     </strong>
     <span>Nous recommandons d'utiliser <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a>, ou <a href="/blog/open-source" class="alert-link" target="_blank">une alternative open-source et axée sur la confidentialité</a>.</span>
   </div>
5. Lorsque vous êtes invité à saisir le nom du serveur SMTP, entrez `smtp.forwardemail.net`

6. Lorsque vous êtes invité à saisir le port du serveur SMTP, entrez `465` (SSL/TLS) – voir [ports SMTP alternatifs](/faq#what-are-your-smtp-server-configuration-settings) si nécessaire
   <div class="alert my-3 alert-warning">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Astuce :
     </strong>
     <span>Si vous utilisez Thunderbird, assurez-vous que la "Sécurité de la connexion" est réglée sur "SSL/TLS" et que la méthode d'authentification est définie sur "Mot de passe normal".</span>
   </div>

7. Lorsque vous êtes invité à saisir le mot de passe du serveur SMTP, collez le mot de passe depuis <strong class="text-success"><i class="fa fa-key"></i> Générer un mot de passe</strong> à l'étape 3 ci-dessus

8. **Enregistrez vos paramètres et envoyez votre premier email de test** – si vous rencontrez des problèmes, veuillez <a href="/help">nous contacter</a>

<div class="alert my-3 alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Important :
  </strong>
  <span>
    Veuillez noter que pour maintenir la réputation IP et assurer la délivrabilité, nous avons un processus de révision manuelle par domaine pour l'approbation SMTP sortante. Cela prend généralement moins de 24 heures, la plupart des demandes étant traitées en 1 à 2 heures. Dans un avenir proche, nous visons à rendre ce processus instantané avec des contrôles anti-spam supplémentaires et des alertes. Ce processus garantit que vos emails atteignent la boîte de réception et que vos messages ne sont pas marqués comme spam.
  </span>
</div>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Félicitations !
    </strong>
    <span>
      Vous avez réussi toutes les étapes.
    </span>
  </div>
</div>

</div>

### Supportez-vous OpenPGP/MIME, le chiffrement de bout en bout ("E2EE") et le Web Key Directory ("WKD") {#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd}

Oui, nous supportons [OpenPGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy#OpenPGP), le [chiffrement de bout en bout ("E2EE")](https://en.wikipedia.org/wiki/End-to-end_encryption), et la découverte des clés publiques via [Web Key Directory ("WKD")](https://wiki.gnupg.org/WKD). Vous pouvez configurer OpenPGP en utilisant [keys.openpgp.org](https://keys.openpgp.org/about/usage#wkd-as-a-service) ou [héberger vos propres clés](https://wiki.gnupg.org/WKDHosting) (référez-vous à [ce gist pour la configuration du serveur WKD](https://gist.github.com/kafene/0a6e259996862d35845784e6e5dbfc79)).

* Les recherches WKD sont mises en cache pendant 1 heure pour garantir une livraison rapide des emails → donc si vous ajoutez, modifiez ou supprimez votre clé WKD, veuillez nous envoyer un email à `support@forwardemail.net` avec votre adresse email afin que nous purgions manuellement le cache.
* Nous supportons le chiffrement PGP pour les messages transférés via une recherche WKD ou en utilisant une clé PGP téléchargée sur notre interface.
* Les clés téléchargées ont la priorité tant que la case PGP est activée/cochée.
* Les messages envoyés aux webhooks ne sont pas actuellement chiffrés avec PGP.
* Si vous avez plusieurs alias correspondant à une adresse de transfert donnée (par exemple combinaison regex/wildcard/exacte) et que plus d'un contient une clé PGP téléchargée avec PGP cochée → alors nous vous enverrons un email d'alerte d'erreur et ne chiffrerons pas le message avec votre clé PGP téléchargée. Ceci est très rare et s'applique généralement aux utilisateurs avancés avec des règles d'alias complexes.
* **Le chiffrement PGP ne sera pas appliqué au transfert d'emails via nos serveurs MX si l'expéditeur a une politique DMARC de rejet. Si vous avez besoin du chiffrement PGP sur *tous* les mails, nous vous suggérons d'utiliser notre service IMAP et de configurer votre clé PGP pour votre alias pour les mails entrants.**

**Vous pouvez valider votre configuration Web Key Directory sur <https://wkd.chimbosonic.com/> (open-source) ou <https://www.webkeydirectory.com/> (propriétaire).**

<div class="alert my-3 alert-success">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Chiffrement automatique :
  </strong>
  <span>Si vous utilisez notre <a href="#do-you-support-sending-email-with-smtp" class="alert-link">service SMTP sortant</a> et envoyez des messages non chiffrés, nous tenterons automatiquement de chiffrer les messages par destinataire en utilisant le <a class="alert-link" href="https://wiki.gnupg.org/WKD">Web Key Directory ("WKD")</a>.</span>
</div>
<div class="alert alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Important :
  </strong>
  <span>
    Vous devez suivre toutes les étapes suivantes afin d'activer OpenPGP pour votre nom de domaine personnalisé.
  </span>
</div>

1. Téléchargez et installez le plugin recommandé pour votre client mail ci-dessous :

   | Client Mail    | Plateforme | Plugin Recommandé                                                                                                                                                                    | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                    |
   | --------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | Thunderbird     | Bureau   | [Configurer OpenPGP dans Thunderbird](https://support.mozilla.org/en-US/kb/openpgp-thunderbird-howto-and-faq#w_i-have-never-used-openpgp-with-thunderbird-before-how-do-i-setup-openpgp) | Thunderbird intègre nativement la prise en charge d'OpenPGP.                                                                                                                                                                                                                                                                                                                                                                             |
   | Gmail           | Navigateur | [Mailvelope](https://mailvelope.com/) ou [FlowCrypt](https://flowcrypt.com/download) (licence propriétaire)                                                                            | Gmail ne prend pas en charge OpenPGP, cependant vous pouvez télécharger le plugin open-source [Mailvelope](https://mailvelope.com/) ou [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                                     |
   | Apple Mail      | macOS    | [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation)                                                                                          | Apple Mail ne prend pas en charge OpenPGP, cependant vous pouvez télécharger le plugin open-source [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation).                                                                                                                                                                                                                                          |
   | Apple Mail      | iOS      | [PGPro](https://github.com/opensourceios/PGPro/) ou [FlowCrypt](https://apps.apple.com/us/app/flowcrypt-encrypted-email/id1591754995) (licence propriétaire)                           | Apple Mail ne prend pas en charge OpenPGP, cependant vous pouvez télécharger le plugin open-source [PGPro](https://github.com/opensourceios/PGPro/) ou [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                     |
   | Outlook         | Windows  | [gpg4win](https://www.gpg4win.de/index.html)                                                                                                                                          | Le client mail de bureau Outlook ne prend pas en charge OpenPGP, cependant vous pouvez télécharger le plugin open-source [gpg4win](https://www.gpg4win.de/index.html).                                                                                                                                                                                                                                                                   |
   | Outlook         | Navigateur | [Mailvelope](https://mailvelope.com/) ou [FlowCrypt](https://flowcrypt.com/download) (licence propriétaire)                                                                            | Le client mail web Outlook ne prend pas en charge OpenPGP, cependant vous pouvez télécharger le plugin open-source [Mailvelope](https://mailvelope.com/) ou [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                 |
   | Android         | Mobile   | [OpenKeychain](https://www.openkeychain.org/) ou [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email)                                                       | Les [clients mail Android](/blog/open-source/android-email-clients) tels que [Thunderbird Mobile](https://www.thunderbird.net/en-US/mobile/) et [FairEmail](https://github.com/M66B/FairEmail) prennent tous deux en charge le plugin open-source [OpenKeychain](https://www.openkeychain.org/). Vous pouvez aussi utiliser le plugin open-source (licence propriétaire) [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email). |
   | Google Chrome   | Navigateur | [Mailvelope](https://mailvelope.com/) ou [FlowCrypt](https://flowcrypt.com/download) (licence propriétaire)                                                                            | Vous pouvez télécharger l'extension de navigateur open-source [Mailvelope](https://mailvelope.com/) ou [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                                                                    |
   | Mozilla Firefox | Navigateur | [Mailvelope](https://mailvelope.com/) ou [FlowCrypt](https://flowcrypt.com/download) (licence propriétaire)                                                                            | Vous pouvez télécharger l'extension de navigateur open-source [Mailvelope](https://mailvelope.com/) ou [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                                                                    |
   | Microsoft Edge  | Navigateur | [Mailvelope](https://mailvelope.com/)                                                                                                                                                 | Vous pouvez télécharger l'extension de navigateur open-source [Mailvelope](https://mailvelope.com/).                                                                                                                                                                                                                                                                                                                                   |
   | Brave           | Navigateur | [Mailvelope](https://mailvelope.com/) ou [FlowCrypt](https://flowcrypt.com/download) (licence propriétaire)                                                                            | Vous pouvez télécharger l'extension de navigateur open-source [Mailvelope](https://mailvelope.com/) ou [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                                                                    |
   | Balsa           | Bureau   | [Configurer OpenPGP dans Balsa](https://www.mynetcologne.de/~nc-dreszal/balsa/balsa23-secure-mail.html#USING)                                                                            | Balsa intègre nativement la prise en charge d'OpenPGP.                                                                                                                                                                                                                                                                                                                                                                                   |
   | KMail           | Bureau   | [Configurer OpenPGP dans KMail](https://userbase.kde.org/KMail/PGP_MIME)                                                                                                                 | KMail intègre nativement la prise en charge d'OpenPGP.                                                                                                                                                                                                                                                                                                                                                                                   |
   | GNOME Evolution | Bureau   | [Configurer OpenPGP dans Evolution](https://help.gnome.org/users/evolution/stable/mail-encryption.html.en)                                                                               | GNOME Evolution intègre nativement la prise en charge d'OpenPGP.                                                                                                                                                                                                                                                                                                                                                                       |
   | Terminal        | Bureau   | [Configurer gpg dans le Terminal](https://docs.github.com/en/authentication/managing-commit-signature-verification/generating-a-new-gpg-key#generating-a-gpg-key)                           | Vous pouvez utiliser l'outil en ligne de commande open-source [gpg](https://www.gnupg.org/download/) pour générer une nouvelle clé depuis le terminal.                                                                                                                                                                                                                                                                                 |
2. Ouvrez le plugin, créez votre clé publique et configurez votre client de messagerie pour l’utiliser.

3. Téléversez votre clé publique sur <https://keys.openpgp.org/upload>.

   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Astuce :
     </strong>
     <span>Vous pouvez visiter <a class="alert-link" href="https://keys.openpgp.org/manage">https://keys.openpgp.org/manage</a> pour gérer votre clé à l’avenir.</span>
   </div>

   <div class="alert my-3 alert-secondary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Option supplémentaire :
     </strong>
     <span>
       Si vous utilisez notre service <a class="alert-link" href="/blog/docs/best-quantum-safe-encrypted-email-service">de stockage chiffré (IMAP/POP3)</a> et souhaitez que <i>tous</i> les e-mails stockés dans votre base de données SQLite (déjà chiffrée) soient chiffrés avec votre clé publique, alors rendez-vous sur <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mon Compte <i class="fa fa-angle-right"></i> Domaines</a> <i class="fa fa-angle-right"></i> Alias (par ex. <code>hello@example.com</code>) <i class="fa fa-angle-right"></i> Modifier <i class="fa fa-angle-right"></i> OpenPGP et téléversez votre clé publique.
     </span>
   </div>

4. Ajoutez un nouvel enregistrement `CNAME` à votre nom de domaine (par ex. `example.com`) :

   <table class="table table-striped table-hover my-3">
     <thead class="thead-dark">
       <tr>
         <th>Nom/Hôte/Alias</th>
         <th class="text-center">TTL</th>
         <th>Type</th>
         <th>Réponse/Valeur</th>
       </tr>
     </thead>
     <tbody>
       <tr>
         <td><code>openpgpkey</code></td>
         <td class="text-center">3600</td>
         <td class="notranslate">CNAME</td>
         <td><code>wkd.keys.openpgp.org</code></td>
       </tr>
     </tbody>
   </table>

   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Astuce :
     </strong>
     <span>Si votre alias utilise nos <a class="alert-link" href="/disposable-addresses" target="_blank">domaines personnalisés/jetables</a> (par ex. <code>hideaddress.net</code>), vous pouvez alors passer cette étape.</span>
   </div>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Félicitations !
    </strong>
    <span>
      Vous avez réussi toutes les étapes.
    </span>
  </div>
</div>

### Supportez-vous le chiffrement S/MIME {#do-you-support-smime-encryption}

Oui, nous supportons le chiffrement [S/MIME (Secure/Multipurpose Internet Mail Extensions)](https://en.wikipedia.org/wiki/S/MIME) tel que défini dans [RFC 8551](https://datatracker.ietf.org/doc/html/rfc8551). S/MIME fournit un chiffrement de bout en bout utilisant des certificats X.509, largement supporté par les clients de messagerie d’entreprise.

Nous supportons à la fois les certificats RSA et ECC (Cryptographie à courbe elliptique) :

* **Certificats RSA** : minimum 2048 bits, recommandé 4096 bits
* **Certificats ECC** : courbes NIST P-256, P-384 et P-521

Pour configurer le chiffrement S/MIME pour votre alias :

1. Obtenez un certificat S/MIME auprès d’une Autorité de Certification (CA) de confiance ou générez un certificat auto-signé pour les tests.

   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Astuce :
     </strong>
     <span>Des certificats S/MIME gratuits sont disponibles auprès de fournisseurs comme <a class="alert-link" href="https://www.actalis.com/s-mime-certificates.aspx">Actalis</a> ou <a class="alert-link" href="https://extrassl.actalis.com/portal/uapub/freemail">Actalis Free S/MIME</a>.</span>
   </div>

2. Exportez votre certificat au format PEM (le certificat public uniquement, pas la clé privée).

3. Rendez-vous sur <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mon Compte <i class="fa fa-angle-right"></i> Domaines</a> <i class="fa fa-angle-right"></i> Alias (par ex. <code><hello@example.com></code>) <i class="fa fa-angle-right"></i> Modifier <i class="fa fa-angle-right"></i> S/MIME et téléversez votre certificat public.
4. Une fois configuré, tous les emails entrants vers votre alias seront chiffrés à l’aide de votre certificat S/MIME avant d’être stockés ou transférés.

   <div class="alert my-3 alert-secondary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Remarque :
     </strong>
     <span>
       Le chiffrement S/MIME est appliqué aux messages entrants qui ne sont pas déjà chiffrés. Si un message est déjà chiffré avec OpenPGP ou S/MIME, il ne sera pas rechiffré.
     </span>
   </div>

   <div class="alert my-3 alert-warning">
     <i class="fa fa-exclamation-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Important :
     </strong>
     <span>
       Le chiffrement S/MIME ne sera pas appliqué au transfert d’emails via nos serveurs MX si l’expéditeur avait une politique DMARC de rejet. Si vous avez besoin du chiffrement S/MIME sur <em>tous</em> les mails, nous vous suggérons d’utiliser notre service IMAP et de configurer votre certificat S/MIME pour votre alias pour les mails entrants.
     </span>
   </div>

Les clients email suivants disposent d’un support S/MIME intégré :

| Client Email      | Plateforme | Notes                                                                                                               |
| ----------------- | ---------- | ------------------------------------------------------------------------------------------------------------------- |
| Apple Mail        | macOS      | Support S/MIME intégré. Allez dans Mail > Préférences > Comptes > votre compte > Confiance pour configurer les certificats.      |
| Apple Mail        | iOS        | Support S/MIME intégré. Allez dans Réglages > Mail > Comptes > votre compte > Avancé > S/MIME pour configurer.          |
| Microsoft Outlook | Windows    | Support S/MIME intégré. Allez dans Fichier > Options > Centre de gestion de la confidentialité > Paramètres du Centre de gestion de la confidentialité > Sécurité du courrier pour configurer. |
| Microsoft Outlook | macOS      | Support S/MIME intégré. Allez dans Outils > Comptes > Avancé > Sécurité pour configurer.                                 |
| Thunderbird       | Bureau     | Support S/MIME intégré. Allez dans Paramètres du compte > Chiffrement de bout en bout > S/MIME pour configurer.                      |
| GNOME Evolution   | Bureau     | Support S/MIME intégré. Allez dans Édition > Préférences > Comptes mail > votre compte > Sécurité pour configurer.           |
| KMail             | Bureau     | Support S/MIME intégré. Allez dans Paramètres > Configurer KMail > Identités > votre identité > Cryptographie pour configurer. |

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Félicitations !
    </strong>
    <span>
      Vous avez configuré avec succès le chiffrement S/MIME pour votre alias.
    </span>
  </div>
</div>

### Supportez-vous le filtrage d’emails Sieve {#do-you-support-sieve-email-filtering}

Oui ! Nous supportons le filtrage d’emails [Sieve](https://en.wikipedia.org/wiki/Sieve_\(mail_filtering_language\)) tel que défini dans [RFC 5228](https://datatracker.ietf.org/doc/html/rfc5228). Sieve est un langage de script puissant et standardisé pour le filtrage d’emails côté serveur qui vous permet d’organiser, filtrer et répondre automatiquement aux messages entrants.

#### Extensions Sieve supportées {#supported-sieve-extensions}

Nous supportons un ensemble complet d’extensions Sieve :

| Extension                    | RFC                                                                                    | Description                                      |
| ---------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------ |
| `fileinto`                   | [RFC 5228](https://datatracker.ietf.org/doc/html/rfc5228)                              | Classer les messages dans des dossiers spécifiques              |
| `reject` / `ereject`         | [RFC 5429](https://datatracker.ietf.org/doc/html/rfc5429)                              | Rejeter les messages avec une erreur                    |
| `vacation`                   | [RFC 5230](https://datatracker.ietf.org/doc/html/rfc5230)                              | Réponses automatiques d’absence/vacances         |
| `vacation-seconds`           | [RFC 6131](https://datatracker.ietf.org/doc/html/rfc6131)                              | Intervalles précis pour les réponses d’absence         |
| `imap4flags`                 | [RFC 5232](https://datatracker.ietf.org/doc/html/rfc5232)                              | Définir les drapeaux IMAP (\Seen, \Flagged, etc.)           |
| `envelope`                   | [RFC 5228](https://datatracker.ietf.org/doc/html/rfc5228)                              | Tester l’expéditeur/destinataire de l’enveloppe                   |
| `body`                       | [RFC 5173](https://datatracker.ietf.org/doc/html/rfc5173)                              | Tester le contenu du corps du message                        |
| `variables`                  | [RFC 5229](https://datatracker.ietf.org/doc/html/rfc5229)                              | Stocker et utiliser des variables dans les scripts               |
| `relational`                 | [RFC 5231](https://datatracker.ietf.org/doc/html/rfc5231)                              | Comparaisons relationnelles (plus grand que, plus petit que) |
| `comparator-i;ascii-numeric` | [RFC 4790](https://datatracker.ietf.org/doc/html/rfc4790)                              | Comparaisons numériques                              |
| `copy`                       | [RFC 3894](https://datatracker.ietf.org/doc/html/rfc3894)                              | Copier les messages tout en les redirigeant                  |
| `editheader`                 | [RFC 5293](https://datatracker.ietf.org/doc/html/rfc5293)                              | Ajouter ou supprimer des en-têtes de message                    |
| `date`                       | [RFC 5260](https://datatracker.ietf.org/doc/html/rfc5260)                              | Tester les valeurs de date/heure                            |
| `index`                      | [RFC 5260](https://datatracker.ietf.org/doc/html/rfc5260)                              | Accéder à des occurrences spécifiques d’en-têtes               |
| `regex`                      | [draft-ietf-sieve-regex](https://datatracker.ietf.org/doc/html/draft-ietf-sieve-regex) | Correspondance par expression régulière                      |
| `enotify`                    | [RFC 5435](https://datatracker.ietf.org/doc/html/rfc5435)                              | Envoyer des notifications (ex. mailto:)               |
| `environment`                | [RFC 5183](https://datatracker.ietf.org/doc/html/rfc5183)                              | Accéder aux informations d’environnement                   |
| `mailbox`                    | [RFC 5490](https://datatracker.ietf.org/doc/html/rfc5490)                              | Tester l’existence de boîtes aux lettres, créer des boîtes         |
| `special-use`                | [RFC 8579](https://datatracker.ietf.org/doc/html/rfc8579)                              | Classer dans des boîtes aux lettres à usage spécial (\Junk, \Trash)  |
| `duplicate`                  | [RFC 7352](https://datatracker.ietf.org/doc/html/rfc7352)                              | Détecter les messages en double                        |
| `ihave`                      | [RFC 5463](https://datatracker.ietf.org/doc/html/rfc5463)                              | Tester la disponibilité d’extensions                  |
| `subaddress`                 | [RFC 5233](https://datatracker.ietf.org/doc/html/rfc5233)                              | Accéder aux parties d’adresse user+detail                 |
#### Extensions Non Supportées {#extensions-not-supported}

Les extensions suivantes ne sont pas actuellement supportées :

| Extension                                                       | Raison                                                             |
| --------------------------------------------------------------- | ------------------------------------------------------------------ |
| `include`                                                       | Risque de sécurité (injection de script) et nécessite un stockage global des scripts |
| `mboxmetadata` / `servermetadata`                               | Nécessite le support de l'extension IMAP METADATA                 |
| `foreverypart` / `mime` / `extracttext` / `replace` / `enclose` | Manipulation complexe de l'arbre MIME non encore implémentée       |

#### Exemples de Scripts Sieve {#example-sieve-scripts}

**Classer les newsletters dans un dossier :**

```sieve
require ["fileinto"];

if header :contains "List-Id" "newsletter" {
    fileinto "Newsletters";
}
```

**Réponse automatique en cas d'absence :**

```sieve
require ["vacation"];

vacation :days 7 :subject "Out of Office"
    "Je suis actuellement absent du bureau et je répondrai à mon retour.";
```

**Marquer les messages provenant d'expéditeurs importants :**

```sieve
require ["imap4flags"];

if address :is "from" "boss@example.com" {
    setflag "\\Flagged";
}
```

**Rejeter les spams avec des sujets spécifiques :**

```sieve
require ["reject"];

if header :contains "subject" ["lottery", "winner", "urgent transfer"] {
    reject "Message rejeté en raison de contenu spam.";
}
```

#### Gestion des Scripts Sieve {#managing-sieve-scripts}

Vous pouvez gérer vos scripts Sieve de plusieurs façons :

1. **Interface Web** : Rendez-vous sur <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mon Compte <i class="fa fa-angle-right"></i> Domaines</a> <i class="fa fa-angle-right"></i> Alias <i class="fa fa-angle-right"></i> Scripts Sieve pour créer et gérer vos scripts.

2. **Protocole ManageSieve** : Connectez-vous avec n'importe quel client compatible ManageSieve (comme l'extension Sieve de Thunderbird ou [sieve-connect](https://github.com/philpennock/sieve-connect)) à `imap.forwardemail.net`. Utilisez le port `2190` avec STARTTLS (recommandé pour la plupart des clients) ou le port `4190` avec TLS implicite.

3. **API** : Utilisez notre [API REST](/api#sieve-scripts) pour gérer les scripts de manière programmatique.

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Note :
  </strong>
  <span>
    Le filtrage Sieve est appliqué aux messages entrants avant leur stockage dans votre boîte aux lettres. Les scripts sont exécutés selon leur ordre de priorité, et la première action correspondante détermine la gestion du message.
  </span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Sécurité :
  </strong>
  <span>
    Pour des raisons de sécurité, les actions de redirection sont limitées à 10 par script et 100 par jour. Les réponses d'absence sont limitées en fréquence pour éviter les abus.
  </span>
</div>

### Supportez-vous MTA-STS {#do-you-support-mta-sts}

Oui, depuis le 2 mars 2023 nous supportons [MTA-STS](https://www.hardenize.com/blog/mta-sts). Vous pouvez utiliser [ce modèle](https://github.com/jpawlowski/mta-sts.template) si vous souhaitez l'activer sur votre domaine.

Notre configuration est disponible publiquement sur GitHub à l'adresse <https://github.com/forwardemail/mta-sts.forwardemail.net>.

### Supportez-vous les passkeys et WebAuthn {#do-you-support-passkeys-and-webauthn}

Oui ! Depuis le 13 décembre 2023, nous avons ajouté le support des passkeys [en raison d'une forte demande](https://github.com/orgs/forwardemail/discussions/182).

Les passkeys vous permettent de vous connecter en toute sécurité sans nécessiter de mot de passe ni d'authentification à deux facteurs.

Vous pouvez valider votre identité par empreinte tactile, reconnaissance faciale, mot de passe ou code PIN basé sur l'appareil.

Nous vous permettons de gérer jusqu'à 30 passkeys simultanément, afin que vous puissiez vous connecter facilement avec tous vos appareils.

En savoir plus sur les passkeys aux liens suivants :

* [Se connecter à vos applications et sites web avec des passkeys](https://support.google.com/android/answer/14124480?hl=en) (Google)
* [Utiliser les passkeys pour se connecter aux apps et sites web sur iPhone](https://support.apple.com/guide/iphone/use-passkeys-to-sign-in-to-apps-and-websites-iphf538ea8d0/ios) (Apple)
* [Article Wikipédia sur les Passkeys](https://en.wikipedia.org/wiki/Passkey_\(credential\))
### Soutenez-vous les bonnes pratiques en matière d'email {#do-you-support-email-best-practices}

Oui. Nous avons un support intégré pour SPF, DKIM, DMARC, ARC et SRS sur tous les plans. Nous avons également travaillé en étroite collaboration avec les auteurs originaux de ces spécifications et d'autres experts en email pour garantir la perfection et une haute délivrabilité.

### Soutenez-vous les webhooks de rebond {#do-you-support-bounce-webhooks}

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Astuce :
  </strong>
    Vous cherchez la documentation sur les webhooks email ? Consultez <a href="/faq#do-you-support-webhooks" class="alert-link">Soutenez-vous les webhooks ?</a> pour plus d'informations.
  <span>
  </span>
</div>

Oui, depuis le 14 août 2024, nous avons ajouté cette fonctionnalité. Vous pouvez désormais aller dans Mon Compte → Domaines → Paramètres → URL du webhook de rebond et configurer une URL `http://` ou `https://` à laquelle nous enverrons une requête `POST` chaque fois qu'un email SMTP sortant rebondit.

Cela vous permet de gérer et de surveiller vos emails SMTP sortants – et peut être utilisé pour maintenir les abonnés, gérer les désinscriptions et détecter chaque rebond.

Les charges utiles des webhooks de rebond sont envoyées au format JSON avec ces propriétés :

* `email_id` (String) - ID de l'email correspondant à un email dans Mon Compte → Emails (SMTP sortant)
* `list_id` (String) - la valeur de l'en-tête `List-ID` (insensible à la casse), si elle existe, de l'email sortant original
* `list_unsubscribe` (String) - la valeur de l'en-tête `List-Unsubscribe` (insensible à la casse), si elle existe, de l'email sortant original
* `feedback_id` (String) - la valeur de l'en-tête `Feedback-ID` (insensible à la casse), si elle existe, de l'email sortant original
* `recipient` (String) - l'adresse email du destinataire qui a rebondi ou a généré une erreur
* `message` (String) - un message d'erreur détaillé pour le rebond
* `response` (String) - le message de réponse SMTP
* `response_code` (Number) - le code de réponse SMTP analysé
* `truth_source` (String) - si le code de réponse provient d'une source fiable, cette valeur sera remplie avec le nom de domaine racine (ex. `google.com` ou `yahoo.com`)
* `bounce` (Object) - un objet contenant les propriétés suivantes détaillant le rebond et le statut de rejet
  * `action` (String) - action de rebond (ex. `"reject"`)
  * `message` (String) - raison du rebond (ex. `"Message Sender Blocked By Receiving Server"`)
  * `category` (String) - catégorie du rebond (ex. `"block"`)
  * `code` (Number) - code de statut du rebond (ex. `554`)
  * `status` (String) - code de rebond issu du message de réponse (ex. `5.7.1`)
  * `line` (Number) - numéro de ligne analysé, si disponible, [depuis la liste de parsing des rebonds Zone-MTA](https://github.com/zone-eu/zone-mta/blob/master/config/bounces.txt) (ex. `526`)
* `headers` (Object) - paires clé-valeur des en-têtes de l'email sortant
* `bounced_at` (String) - date au format [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601) indiquant quand l'erreur de rebond est survenue

Par exemple :

```json
{
  "email_id": "66bcce793ef7b2a0928e14ba",
  "recipient": "example@gmail.com",
  "message": "Le compte email que vous avez essayé de joindre est en dépassement de quota.",
  "response": "552 5.2.2 Le compte email que vous avez essayé de joindre est en dépassement de quota.",
  "response_code": 552,
  "truth_source": "google.com",
  "bounce": {
    "action": "reject",
    "message": "Boîte Gmail pleine",
    "category": "capacity",
    "code": 552,
    "status": "5.2.2",
    "line": 300
  },
  "headers": {},
  "bounced_at": "2024-08-24T01:50:02.828Z"
}
```

Voici quelques notes supplémentaires concernant les webhooks de rebond :

* Si la charge utile du webhook contient une valeur `list_id`, `list_unsubscribe` ou `feedback_id`, vous devez prendre les mesures appropriées pour retirer le `recipient` de la liste si nécessaire.
  * Si la valeur `bounce.category` est l'une de `"block"`, `"recipient"`, `"spam"` ou `"virus"`, vous devez absolument retirer l'utilisateur de la liste.
* Si vous devez vérifier les charges utiles des webhooks (pour vous assurer qu'elles proviennent bien de notre serveur), vous pouvez [résoudre l'adresse IP distante du client en nom d'hôte via une recherche inverse](https://nodejs.org/api/dns.html#dnspromisesreverseip) – cela devrait être `smtp.forwardemail.net`.
  * Vous pouvez également vérifier l'IP par rapport à [nos adresses IP publiées](#what-are-your-servers-ip-addresses).
  * Allez dans Mon Compte → Domaines → Paramètres → Clé de vérification de la charge utile de signature du webhook pour obtenir votre clé webhook.
    * Vous pouvez faire pivoter cette clé à tout moment pour des raisons de sécurité.
    * Calculez et comparez la valeur `X-Webhook-Signature` de notre requête webhook avec la valeur calculée du corps en utilisant cette clé. Un exemple de comment faire cela est disponible dans [ce post Stack Overflow](https://stackoverflow.com/a/68885281).
  * Voir la discussion sur <https://github.com/forwardemail/free-email-forwarding/issues/235> pour plus d'informations.
* Nous attendrons jusqu'à `5` secondes que votre point de terminaison webhook réponde avec un code de statut `200`, et nous réessaierons jusqu'à `1` fois.
* Si nous détectons que votre URL de webhook de rebond a une erreur lors de l'envoi d'une requête, nous vous enverrons un email de courtoisie une fois par semaine.
### Supportez-vous les webhooks {#do-you-support-webhooks}

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Astuce :
  </strong>
    Vous cherchez la documentation sur les webhooks de rebond ? Voir <a href="/faq#do-you-support-bounce-webhooks" class="alert-link">Supportez-vous les webhooks de rebond ?</a> pour plus d'informations.
  <span>
  </span>
</div>

Oui, depuis le 15 mai 2020, nous avons ajouté cette fonctionnalité. Vous pouvez simplement ajouter un ou plusieurs webhooks exactement comme vous le feriez avec n'importe quel destinataire ! Veuillez vous assurer que l'URL du webhook est préfixée par le protocole "http" ou "https".

<div class="alert my-3 alert-danger">
  <i class="fa fa-stop-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Protection renforcée de la vie privée :
  </strong>
  <span>
    Si vous êtes sur un plan payant (qui inclut une protection renforcée de la vie privée), veuillez vous rendre sur <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mon Compte <i class="fa fa-angle-right"></i> Domaines</a> et cliquer sur "Alias" à côté de votre domaine pour configurer vos webhooks. Si vous souhaitez en savoir plus sur les plans payants, consultez notre page <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Tarification</a>. Sinon, vous pouvez continuer à suivre les instructions ci-dessous.
  </span>
</div>

Si vous êtes sur le plan gratuit, ajoutez simplement un nouvel enregistrement DNS <strong class="notranslate">TXT</strong> comme indiqué ci-dessous :

Par exemple, si je veux que tous les emails envoyés à `alias@example.com` soient transférés vers un nouveau point de terminaison de test [request bin](https://requestbin.com/r/en8pfhdgcculn?inspect) :

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nom/Hôte/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Réponse/Valeur</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", ou vide</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=alias:https://requestbin.com/r/en8pfhdgcculn</code></td>
    </tr>
  </tbody>
</table>

Ou peut-être souhaitez-vous que tous les emails envoyés à `example.com` soient transférés vers ce point de terminaison :

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nom/Hôte/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Réponse/Valeur</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", ou vide</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=https://requestbin.com/r/en8pfhdgcculn</code></td>
    </tr>
  </tbody>
</table>

**Voici des notes supplémentaires concernant les webhooks :**

* Si vous devez vérifier les charges utiles des webhooks (pour vous assurer qu'elles proviennent bien de notre serveur), vous pouvez [résoudre l'adresse IP distante du client et le nom d'hôte client via une recherche inverse](https://nodejs.org/api/dns.html#dnspromisesreverseip) – cela doit être soit `mx1.forwardemail.net` soit `mx2.forwardemail.net`.
  * Vous pouvez également vérifier l'IP par rapport à [nos adresses IP publiées](#what-are-your-servers-ip-addresses).
  * Si vous êtes sur un plan payant, allez dans Mon Compte → Domaines → Paramètres → Clé de vérification de la signature du webhook pour obtenir votre clé webhook.
    * Vous pouvez faire pivoter cette clé à tout moment pour des raisons de sécurité.
    * Calculez et comparez la valeur `X-Webhook-Signature` de notre requête webhook avec la valeur du corps calculée en utilisant cette clé. Un exemple de comment faire cela est disponible dans [ce post Stack Overflow](https://stackoverflow.com/a/68885281).
  * Voir la discussion sur <https://github.com/forwardemail/free-email-forwarding/issues/235> pour plus d'informations.
* Si un webhook ne répond pas avec un code de statut `200`, nous stockerons sa réponse dans le [journal des erreurs créé](#do-you-store-error-logs) – ce qui est utile pour le débogage.
* Les requêtes HTTP des webhooks seront réessayées jusqu'à 3 fois à chaque tentative de connexion SMTP, avec un délai maximal de 60 secondes par requête POST vers le point de terminaison. **Notez que cela ne signifie pas qu'il ne réessaie que 3 fois**, il réessaiera en fait continuellement dans le temps en envoyant un code SMTP 421 (qui indique à l'expéditeur de réessayer plus tard) après la 3ème tentative échouée de requête POST HTTP. Cela signifie que l'email sera réessayé continuellement pendant des jours jusqu'à ce qu'un code de statut 200 soit obtenu.
* Nous réessayons automatiquement en fonction des codes d'état et d'erreur par défaut utilisés dans la [méthode retry de superagent](https://ladjs.github.io/superagent/#retrying-requests) (nous en sommes les mainteneurs).
* Nous regroupons les requêtes HTTP des webhooks vers le même point de terminaison en une seule requête au lieu de plusieurs afin d'économiser des ressources et d'accélérer le temps de réponse. Par exemple, si vous envoyez un email à <webhook1@example.com>, <webhook2@example.com>, et <webhook3@example.com>, et que tous sont configurés pour atteindre exactement la même URL de point de terminaison, alors une seule requête sera effectuée. Nous regroupons par correspondance exacte du point de terminaison avec égalité stricte.
* Notez que nous utilisons la méthode "simpleParser" de la bibliothèque [mailparser](https://nodemailer.com/extras/mailparser/) pour analyser le message en un objet JSON.
* La valeur brute de l'email en tant que chaîne est donnée sous la propriété "raw".
* Les résultats d'authentification sont donnés sous les propriétés "dkim", "spf", "arc", "dmarc", et "bimi".
* Les en-têtes d'email analysés sont donnés sous la propriété "headers" – mais notez aussi que vous pouvez utiliser "headerLines" pour une itération et un parsing plus faciles.
* Les destinataires regroupés pour ce webhook sont groupés ensemble et donnés sous la propriété "recipients".
* Les informations de session SMTP sont données sous la propriété "session". Cela contient des informations sur l'expéditeur du message, l'heure d'arrivée du message, HELO, et le nom d'hôte client. La valeur du nom d'hôte client en `session.clientHostname` est soit le FQDN (issu d'une recherche PTR inverse) soit `session.remoteAddress` entouré de crochets (par exemple `"[127.0.0.1]"`).
* Si vous avez besoin d'un moyen rapide pour obtenir la valeur de `X-Original-To`, vous pouvez utiliser la valeur de `session.recipient` (voir exemple ci-dessous). L'en-tête `X-Original-To` est un en-tête que nous ajoutons aux messages pour le débogage avec le destinataire original (avant le transfert masqué) du message.
* Si vous devez supprimer les propriétés `attachments` et/ou `raw` du corps de la charge utile, ajoutez simplement `?attachments=false`, `?raw=false`, ou `?attachments=false&raw=false` à votre point de terminaison webhook en tant que paramètre de chaîne de requête (par exemple `https://example.com/webhook?attachments=false&raw=false`).
* S'il y a des pièces jointes, elles seront ajoutées au tableau `attachments` avec des valeurs Buffer. Vous pouvez les retransformer en contenu en utilisant une approche avec JavaScript telle que :
  ```js
  const data = [
    104,
    101,
    108,
    108,
    111,
    32,
    119,
    111,
    114,
    108,
    100,
    33
  ];

  //
  // outputs "hello world!" to the console
  // (this is the content from the filename "text1.txt" in the example JSON request payload above)
  //
  console.log(Buffer.from(data).toString());
  ```

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tip:
  </strong>
    Curious what the webhook request looks like from forwarded emails?  We've included an example below for you!
  <span>
  </span>
</div>

```json
{
  "attachments": [
    {
      "type": "attachment",
      "content": {
        "type": "Buffer",
        "data": [
          104,
          101,
          108,
          108,
          111,
          32,
          119,
          111,
          114,
          108,
          100,
          33
        ]
      },
      "contentType": "text/plain",
      "partId": "2",
      "release": null,
      "contentDisposition": "attachment",
      "filename": "text1.txt",
      "headers": {},
      "checksum": "fc3ff98e8c6a0d3087d515c0473f8677",
      "size": 12
    }
  ],
  "headers": "ARC-Seal: i=1; a=rsa-sha256; t=1653506802; cv=none; d=forwardemail.net;\r\n s=default;\r\n b=R6QJ0tGwwjg2VPxiAlVIKxsg3jEPtRGKPTIOdZNWuhWrbssttFdOYzRRqvacDyN5SLoyDhVye\r\n DUA/64IxANXdHVFlpR258Yp7WxLDv2gtJD5vNSKYmUJZOWk1TynmlqTYrp0Vuqg2xIUjIlPBWAJ\r\n PPNx4JvOLjJuWYynU2qIWz0=\r\nARC-Message-Signature: i=1; a=rsa-sha256; c=relaxed/relaxed;\r\n d=forwardemail.net; h=MIME-Version: Date: Message-ID: From: Content-Type;\r\n q=dns/txt; s=default; t=1653506802;\r\n bh=cEYDoyTy+Ub29XZt/zXR+sprfUE6BW0y5cHfah01PT4=;\r\n b=F/t56AAXr2Kv3G6VsbdT5OKDVJf2ulhwLiTM18Ra4tDPUKPSGSLKrWvxiXEg5NMWwdWnsOYrL\r\n r3YSm4uMxVMhHZbHm/sUu4QZq5/18hQsAkCv6fI9ifTjDwBrN5zpLOhPoZFFo+TyvHxiII3Xv3L\r\n UEzmUIIaJRX6tboQ160tino=\r\nARC-Authentication-Results: i=1; mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)\r\nReceived-SPF: none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) client-ip=127.0.0.1;\r\nAuthentication-Results: mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)\r\n",
  "headerLines": [
    {
      "key": "arc-seal",
      "line": "ARC-Seal: i=1; a=rsa-sha256; t=1653506802; cv=none; d=forwardemail.net;\r\n s=default;\r\n b=R6QJ0tGwwjg2VPxiAlVIKxsg3jEPtRGKPTIOdZNWuhWrbssttFdOYzRRqvacDyN5SLoyDhVye\r\n DUA/64IxANXdHVFlpR258Yp7WxLDv2gtJD5vNSKYmUJZOWk1TynmlqTYrp0Vuqg2xIUjIlPBWAJ\r\n PPNx4JvOLjJuWYynU2qIWz0="
    },
    {
      "key": "arc-message-signature",
      "line": "ARC-Message-Signature: i=1; a=rsa-sha256; c=relaxed/relaxed;\r\n d=forwardemail.net; h=MIME-Version: Date: Message-ID: From: Content-Type;\r\n q=dns/txt; s=default; t=1653506802;\r\n bh=cEYDoyTy+Ub29XZt/zXR+sprfUE6BW0y5cHfah01PT4=;\r\n b=F/t56AAXr2Kv3G6VsbdT5OKDVJf2ulhwLiTM18Ra4tDPUKPSGSLKrWvxiXEg5NMWwdWnsOYrL\r\n r3YSm4uMxVMhHZbHm/sUu4QZq5/18hQsAkCv6fI9ifTjDwBrN5zpLOhPoZFFo+TyvHxiII3Xv3L\r\n UEzmUIIaJRX6tboQ160tino="
    },
    {
      "key": "arc-authentication-results",
      "line": "ARC-Authentication-Results: i=1; mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)"
    },
    {
      "key": "received-spf",
      "line": "Received-SPF: none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) client-ip=127.0.0.1;"
    },
    {
      "key": "authentication-results",
      "line": "Authentication-Results: mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)"
    },
    {
      "key": "x-forward-email-sender",
      "line": "X-Forward-Email-Sender: rfc822; test@example.net"
    },
    {
      "key": "x-forward-email-session-id",
      "line": "X-Forward-Email-Session-ID: w2czxgznghn5ryyw"
    },
    {
      "key": "x-forward-email-version",
      "line": "X-Forward-Email-Version: 9.0.0"
    },
    {
      "key": "content-type",
      "line": "Content-Type: multipart/mixed; boundary=\"--_NmP-179a735428ca7575-Part_1\""
    },
    {
      "key": "from",
      "line": "From: some <random@example.com>"
    },
    {
      "key": "message-id",
      "line": "Message-ID: <69ad5fc2-91cb-728f-ae5c-eeedc5f267b6@example.net>"
    },
    {
      "key": "date",
      "line": "Date: Wed, 25 May 2022 19:26:41 +0000"
    },
    {
      "key": "mime-version",
      "line": "MIME-Version: 1.0"
    }
  ],
  "html": "<strong>some random text</strong>",
  "text": "some random text",
  "textAsHtml": "<p>some random text</p>",
  "date": "2022-05-25T19:26:41.000Z",
  "from": {
    "value": [
      {
        "address": "random@example.com",
        "name": "some"
      }
    ],
    "html": "<span class=\"mp_address_group\"><span class=\"mp_address_name\">some</span> &lt;<a href=\"mailto:random@example.com\" class=\"mp_address_email\">random@example.com</a>&gt;</span>",
    "text": "some <random@example.com>"
  },
  "messageId": "<69ad5fc2-91cb-728f-ae5c-eeedc5f267b6@example.net>",
  "raw": "ARC-Seal: i=1; a=rsa-sha256; t=1653506802; cv=none; d=forwardemail.net;\r\n s=default;\r\n b=R6QJ0tGwwjg2VPxiAlVIKxsg3jEPtRGKPTIOdZNWuhWrbssttFdOYzRRqvacDyN5SLoyDhVye\r\n DUA/64IxANXdHVFlpR258Yp7WxLDv2gtJD5vNSKYmUJZOWk1TynmlqTYrp0Vuqg2xIUjIlPBWAJ\r\n PPNx4JvOLjJuWYynU2qIWz0=\r\nARC-Message-Signature: i=1; a=rsa-sha256; c=relaxed/relaxed;\r\n d=forwardemail.net; h=MIME-Version: Date: Message-ID: From: Content-Type;\r\n q=dns/txt; s=default; t=1653506802;\r\n bh=cEYDoyTy+Ub29XZt/zXR+sprfUE6BW0y5cHfah01PT4=;\r\n b=F/t56AAXr2Kv3G6VsbdT5OKDVJf2ulhwLiTM18Ra4tDPUKPSGSLKrWvxiXEg5NMWwdWnsOYrL\r\n r3YSm4uMxVMhHZbHm/sUu4QZq5/18hQsAkCv6fI9ifTjDwBrN5zpLOhPoZFFo+TyvHxiII3Xv3L\r\n UEzmUIIaJRX6tboQ160tino=\r\nARC-Authentication-Results: i=1; mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)\r\nReceived-SPF: none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) client-ip=127.0.0.1;\r\nAuthentication-Results: mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)\r\nX-Forward-Email-Sender: rfc822; test@example.net\r\nX-Forward-Email-Session-ID: w2czxgznghn5ryyw\r\nX-Forward-Email-Version: 9.0.0\r\nContent-Type: multipart/mixed; boundary=\"--_NmP-179a735428ca7575-Part_1\"\r\nFrom: some <random@example.com>\r\nMessage-ID: <69ad5fc2-91cb-728f-ae5c-eeedc5f267b6@example.net>\r\nDate: Wed, 25 May 2022 19:26:41 +0000\r\nMIME-Version: 1.0\r\n\r\n----_NmP-179a735428ca7575-Part_1\r\nContent-Type: multipart/alternative;\r\n boundary=\"--_NmP-179a735428ca7575-Part_2\"\r\n\r\n----_NmP-179a735428ca7575-Part_2\r\nContent-Type: text/plain; charset=utf-8\r\nContent-Transfer-Encoding: 7bit\r\n\r\nsome random text\r\n----_NmP-179a735428ca7575-Part_2\r\nContent-Type: text/html; charset=utf-8\r\nContent-Transfer-Encoding: 7bit\r\n\r\n<strong>some random text</strong>\r\n----_NmP-179a735428ca7575-Part_2--\r\n\r\n----_NmP-179a735428ca7575-Part_1\r\nContent-Type: text/plain; name=text1.txt\r\nContent-Transfer-Encoding: base64\r\nContent-Disposition: attachment; filename=text1.txt\r\n\r\naGVsbG8gd29ybGQh\r\n----_NmP-179a735428ca7575-Part_1--\r\n",
  "dkim": {
    "headerFrom": [
      "random@example.com"
    ],
    "envelopeFrom": "test@example.net",
    "results": [
      {
        "status": {
          "result": "none",
          "comment": "message not signed"
        },
        "info": "dkim=none (message not signed)"
      }
    ]
  },
  "spf": {
    "domain": "example.net",
    "client-ip": "127.0.0.1",
    "helo": "user.oem.local",
    "envelope-from": "test@example.net",
    "status": {
      "result": "none",
      "comment": "mx1.forwardemail.net: example.net does not designate permitted sender hosts",
      "smtp": {
        "mailfrom": "test@example.net",
        "helo": "user.oem.local"
      }
    },
    "header": "Received-SPF: none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) client-ip=127.0.0.1;",
    "info": "spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local",
    "lookups": {
      "limit": 50,
      "count": 1
    }
  },
  "arc": {
    "status": {
      "result": "none"
    },
    "i": 0,
    "authResults": "mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)"
  },
  "dmarc": {
    "status": {
      "result": "none",
      "header": {
        "from": "example.com"
      }
    },
    "domain": "example.com",
    "info": "dmarc=none header.from=example.com"
  },
  "bimi": {
    "status": {
      "header": {},
      "result": "skipped",
      "comment": "DMARC not enabled"
    },
    "info": "bimi=skipped (DMARC not enabled)"
  },
  "recipients": [
    "webhook1@webhooks.net"
  ],
  "session": {
    "recipient": "webhook1@webhooks.net",
    "remoteAddress": "127.0.0.1",
    "remotePort": 65138,
    "clientHostname": "[127.0.0.1]",
    "hostNameAppearsAs": "user.oem.local",
    "sender": "test@example.net",
    "mta": "mx1.forwardemail.net",
    "arrivalDate": "2022-05-25T19:26:41.423Z",
    "arrivalTime": 1653506801423
  }
}
```

### Supportez-vous les expressions régulières ou regex {#do-you-support-regular-expressions-or-regex}

Oui, depuis le 27 septembre 2021, nous avons ajouté cette fonctionnalité. Vous pouvez simplement écrire des expressions régulières ("regex") pour faire correspondre des alias et effectuer des substitutions.

Les alias supportant les expressions régulières sont ceux qui commencent par un `/` et se terminent par un `/` et dont les destinataires sont des adresses email ou des webhooks. Les destinataires peuvent également inclure la prise en charge des substitutions regex (par exemple `$1`, `$2`).

Nous supportons deux indicateurs d'expression régulière, notamment `i` et `g`. L'indicateur insensible à la casse `i` est un défaut permanent et il est toujours appliqué. L'indicateur global `g` peut être ajouté par vous en ajoutant `/g` à la fin du `/`.

Notez que nous supportons également notre <a href="#can-i-disable-specific-aliases">fonctionnalité d'alias désactivés</a> pour la partie destinataire avec notre support regex.

Les expressions régulières ne sont pas supportées sur les <a href="/disposable-addresses" target="_blank">domaines vanity globaux</a> (car cela pourrait constituer une faille de sécurité).

<div class="alert my-3 alert-danger">
  <i class="fa fa-stop-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Protection renforcée de la vie privée :
  </strong>
  <span>
    Si vous êtes sur un plan payant (qui offre une protection renforcée de la vie privée), veuillez vous rendre sur <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mon Compte <i class="fa fa-angle-right"></i> Domaines</a> et cliquer sur "Alias" à côté de votre domaine pour configurer les alias, y compris ceux avec des expressions régulières. Si vous souhaitez en savoir plus sur les plans payants, consultez notre page <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Tarification</a>.
  </span>
</div>

#### Exemples pour la protection renforcée de la vie privée {#examples-for-enhanced-privacy-protection}

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nom de l'alias</th>
      <th>Effet</th>
      <th>Test</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>/^(linus|torvalds)$/</code></td>
      <td>Emails vers `linus@example.com` ou `torvalds@example.com`</td>
      <td>(<a href="https://regexr.com/8gb8n" class="alert-link">voir le test sur RegExr</a>)</td>
    </tr>
    <tr>
      <td><code>/^24highst(reet)$/</code></td>
      <td>Emails vers `24highst@example.com` ou `24highstreet@example.com`</td>
      <td>(<a href="https://regexr.com/8g9rb" class="alert-link">voir le test sur RegExr</a>)</td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Astuce :
  </strong>
    Pour tester ces expressions sur <a href="https://regexr.com" class="alert-link">RegExr</a>, écrivez l'expression dans la boîte du haut, puis tapez un alias exemple dans la zone de texte en dessous. Si cela correspond, la couleur deviendra bleue.
  <span>
  </span>
</div>

#### Exemples pour le plan gratuit {#examples-for-the-free-plan}

Si vous êtes sur le plan gratuit, ajoutez simplement un nouvel enregistrement DNS <strong class="notranslate">TXT</strong> en utilisant un ou plusieurs des exemples fournis ci-dessous :

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Exemple simple :</strong> Si je veux que tous les emails envoyés à `linus@example.com` ou `torvalds@example.com` soient transférés vers `user@gmail.com` :
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nom/Hôte/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Réponse/Valeur</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", ou vide</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(linus|torvalds)$/:user@gmail.com</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Exemple de substitution prénom nom :</strong> Imaginez que toutes les adresses email de votre entreprise suivent le modèle `prenom.nom@example.com`. Si je veux que tous les emails correspondant au modèle `prenom.nom@example.com` soient transférés vers `prenom.nom@company.com` avec prise en charge des substitutions (<a href="https://regexr.com/66hnu" class="alert-link">voir le test sur RegExr</a>) :
</div>
<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nom/Hôte/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Réponse/Valeur</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", ou vide</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^([A-Za-z]+)+\.([A-Za-z]+)+$/:$1.$2@company.com</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Exemple de substitution avec filtrage du symbole plus :</strong> Si je veux que tous les emails envoyés à `info@example.com` ou `support@example.com` soient transférés respectivement vers `user+info@gmail.com` ou `user+support@gmail.com` (avec prise en charge de la substitution) (<a href="https://regexr.com/66ho7" class="alert-link">voir le test sur RegExr</a>) :
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nom/Hôte/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Réponse/Valeur</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", ou vide</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(support|info)$/:user+$1@gmail.com</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Exemple de substitution dans la chaîne de requête d’un webhook :</strong> Peut-être souhaitez-vous que tous les emails envoyés à `example.com` aillent vers un <a href="#do-you-support-webhooks" class="alert-link">webhook</a> et aient une clé dynamique "to" dans la chaîne de requête avec pour valeur la partie nom d’utilisateur de l’adresse email (<a href="https://regexr.com/66ho4" class="alert-link">voir le test sur RegExr</a>) :
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nom/Hôte/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Réponse/Valeur</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", ou vide</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(.*?)$/:https://example.com/webhook?username=$1</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Exemple de rejet silencieux :</strong> Si vous souhaitez que tous les emails correspondant à un certain motif soient désactivés et rejetés silencieusement (cela apparaît à l’expéditeur comme si le message avait été envoyé avec succès, mais en réalité il ne va nulle part) avec le code d’état `250` (voir <a href="#can-i-disable-specific-aliases" class="alert-link">Puis-je désactiver des alias spécifiques</a>), alors utilisez simplement la même approche avec un point d’exclamation unique "!". Cela indique à l’expéditeur que le message a été livré avec succès, mais il n’a en fait abouti nulle part (par exemple trou noir ou `/dev/null`).
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nom/Hôte/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Réponse/Valeur</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", ou vide</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(linus|torvalds)$/:!</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Exemple de rejet doux :</strong> Si vous souhaitez que tous les emails correspondant à un certain motif soient désactivés et rejetés doucement avec le code d’état `421` (voir <a href="#can-i-disable-specific-aliases" class="alert-link">Puis-je désactiver des alias spécifiques</a>), alors utilisez simplement la même approche avec un double point d’exclamation "!!". Cela indique à l’expéditeur de réessayer son email, et les emails vers cet alias seront réessayés pendant environ 5 jours avant d’être rejetés définitivement.
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nom/Hôte/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Réponse/Valeur</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", ou vide</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(linus|torvalds)$/:!!</code></td>
    </tr>
  </tbody>
</table>
<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Exemple de rejet ferme :</strong> Si vous souhaitez que tous les e-mails correspondant à un certain motif soient désactivés et rejetés fermement avec le code d'état `550` (voir <a href="#can-i-disable-specific-aliases" class="alert-link">Puis-je désactiver des alias spécifiques</a>), utilisez simplement la même approche avec trois points d'exclamation "!!!". Cela indique à l'expéditeur une erreur permanente et les e-mails ne seront pas renvoyés, ils seront rejetés pour cet alias.
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nom/Hôte/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Réponse/Valeur</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", ou vide</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(linus|torvalds)$/:!!!</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Astuce :
  </strong>
    Curieux de savoir comment écrire une expression régulière ou besoin de tester votre remplacement ? Vous pouvez vous rendre sur le site gratuit de test d'expressions régulières <a href="https://regexr.com" class="alert-link">RegExr</a> à l'adresse <a href="https://regexr.com/" class="alert-link">https://regexr.com</a>.
  <span>
  </span>
</div>

### Quelles sont vos limites SMTP sortantes {#what-are-your-outbound-smtp-limits}

Nous limitons les utilisateurs et domaines à 300 messages SMTP sortants par jour. Cela correspond en moyenne à plus de 9000 e-mails par mois calendaire. Si vous devez dépasser ce nombre ou si vous avez régulièrement de gros e-mails, veuillez [nous contacter](https://forwardemail.net/help).

### Ai-je besoin d'une approbation pour activer SMTP {#do-i-need-approval-to-enable-smtp}

Oui, veuillez noter que pour maintenir la réputation IP et garantir la délivrabilité, Forward Email dispose d'un processus de révision manuelle par domaine pour l'approbation SMTP sortante. Envoyez un e-mail à <support@forwardemail.net> ou ouvrez une [demande d'aide](https://forwardemail.net/help) pour obtenir l'approbation. Cela prend généralement moins de 24 heures, la plupart des demandes étant traitées en 1 à 2 heures. Dans un avenir proche, nous visons à rendre ce processus instantané avec des contrôles anti-spam supplémentaires et des alertes. Ce processus garantit que vos e-mails atteignent la boîte de réception et que vos messages ne sont pas marqués comme spam.

### Quelles sont les configurations de votre serveur SMTP {#what-are-your-smtp-server-configuration-settings}

Notre serveur est `smtp.forwardemail.net` et est également surveillé sur notre <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">page de statut</a>.

Il prend en charge à la fois IPv4 et IPv6 et est accessible via les ports `465` et `2465` pour SSL/TLS (recommandé) et `587`, `2587`, `2525` et `25` pour TLS (STARTTLS).

**Depuis octobre 2025**, nous supportons désormais les connexions **TLS 1.0 legacy** sur les ports `2455` (SSL/TLS) et `2555` (STARTTLS) pour les appareils plus anciens tels que les imprimantes, scanners, caméras et clients mail legacy qui ne peuvent pas supporter les versions modernes de TLS. Ces ports sont proposés en alternative à Gmail, Yahoo, Outlook et autres fournisseurs qui ont abandonné le support des anciens protocoles TLS.

> \[!CAUTION]
> **Support TLS 1.0 Legacy (Ports 2455 et 2555)** : Ces ports utilisent le protocole TLS 1.0 obsolète qui présente des vulnérabilités de sécurité connues (BEAST, POODLE). N'utilisez ces ports que si votre appareil ne peut absolument pas supporter TLS 1.2 ou supérieur. Nous recommandons fortement de mettre à jour le firmware de votre appareil ou de passer à des clients mail modernes dès que possible. Ces ports sont destinés uniquement à la compatibilité avec du matériel legacy (anciennes imprimantes, scanners, caméras, appareils IoT).

|                                     Protocole                                     | Nom d'hôte              |            Ports            |        IPv4        |        IPv6        | Notes                                  |
| :------------------------------------------------------------------------------: | ----------------------- | :-------------------------: | :----------------: | :----------------: | -------------------------------------- |
|                              `SSL/TLS` **Préféré**                              | `smtp.forwardemail.net` |        `465`, `2465`        | :white_check_mark: | :white_check_mark: | TLS 1.2+ moderne (Recommandé)          |
|         `TLS` ([STARTTLS](https://wikipedia.org/wiki/Opportunistic_TLS))         | `smtp.forwardemail.net` | `587`, `2587`, `2525`, `25` | :white_check_mark: | :white_check_mark: | Supporté (préférez le port SSL/TLS `465`)  |
|                             `SSL/TLS` **Legacy uniquement**                      | `smtp.forwardemail.net` |            `2455`           | :white_check_mark: | :white_check_mark: | :warning: TLS 1.0 uniquement pour anciens appareils |
| `TLS` ([STARTTLS](https://wikipedia.org/wiki/Opportunistic_TLS)) **Legacy uniquement** | `smtp.forwardemail.net` |            `2555`           | :white_check_mark: | :white_check_mark: | :warning: TLS 1.0 uniquement pour anciens appareils |
| Connexion | Exemple                   | Description                                                                                                                                                                               |
| --------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nom d’utilisateur | `user@example.com`         | Adresse e-mail d’un alias existant pour le domaine dans <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mon Compte <i class="fa fa-angle-right"></i> Domaines</a>. |
| Mot de passe | `************************` | Alias                                                                                                                                                                                     |

Pour envoyer des e-mails sortants avec SMTP, le **utilisateur SMTP** doit être l’adresse e-mail d’un alias existant pour le domaine dans <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mon Compte <i class="fa fa-angle-right"></i> Domaines</a> – et le **mot de passe SMTP** doit être un mot de passe généré spécifique à l’alias.

Veuillez consulter [Supportez-vous l’envoi d’e-mails avec SMTP](#do-you-support-sending-email-with-smtp) pour des instructions étape par étape.

### Quelles sont vos configurations de serveur IMAP {#what-are-your-imap-server-configuration-settings}

Notre serveur est `imap.forwardemail.net` et est également surveillé sur notre <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">page de statut</a>.

Il supporte à la fois IPv4 et IPv6 et est disponible sur les ports `993` et `2993` pour SSL/TLS.

|         Protocole        | Nom d’hôte               |     Ports     |        IPv4        |        IPv6        |
| :----------------------: | ----------------------- | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **Préféré**    | `imap.forwardemail.net` | `993`, `2993` | :white_check_mark: | :white_check_mark: |

| Connexion | Exemple                   | Description                                                                                                                                                                               |
| --------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nom d’utilisateur | `user@example.com`         | Adresse e-mail d’un alias existant pour le domaine dans <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mon Compte <i class="fa fa-angle-right"></i> Domaines</a>. |
| Mot de passe | `************************` | Mot de passe généré spécifique à l’alias.                                                                                                                                                  |

Pour se connecter avec IMAP, le **utilisateur IMAP** doit être l’adresse e-mail d’un alias existant pour le domaine dans <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mon Compte <i class="fa fa-angle-right"></i> Domaines</a> – et le **mot de passe IMAP** doit être un mot de passe généré spécifique à l’alias.

Veuillez consulter [Supportez-vous la réception d’e-mails avec IMAP](#do-you-support-receiving-email-with-imap) pour des instructions étape par étape.

### Quelles sont vos configurations de serveur POP3 {#what-are-your-pop3-server-configuration-settings}

Notre serveur est `pop3.forwardemail.net` et est également surveillé sur notre <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">page de statut</a>.

Il supporte à la fois IPv4 et IPv6 et est disponible sur les ports `995` et `2995` pour SSL/TLS.

|         Protocole        | Nom d’hôte               |     Ports     |        IPv4        |        IPv6        |
| :----------------------: | ----------------------- | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **Préféré**    | `pop3.forwardemail.net` | `995`, `2995` | :white_check_mark: | :white_check_mark: |
| Connexion | Exemple                    | Description                                                                                                                                                                               |
| --------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nom d'utilisateur | `user@example.com`         | Adresse e-mail d'un alias existant pour le domaine dans <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mon Compte <i class="fa fa-angle-right"></i> Domaines</a>. |
| Mot de passe | `************************` | Mot de passe généré spécifique à l'alias.                                                                                                                                                  |

Pour se connecter avec POP3, l'**utilisateur POP3** doit être l'adresse e-mail d'un alias existant pour le domaine dans <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mon Compte <i class="fa fa-angle-right"></i> Domaines</a> – et le **mot de passe IMAP** doit être un mot de passe généré spécifique à l'alias.

Veuillez consulter [Supportez-vous POP3](#do-you-support-pop3) pour des instructions étape par étape.

### Comment configurer l'autodécouverte des e-mails pour mon domaine {#how-do-i-set-up-email-autodiscovery-for-my-domain}

L'autodécouverte des e-mails permet aux clients de messagerie tels que **Thunderbird**, **Apple Mail**, **Microsoft Outlook** et les appareils mobiles de détecter automatiquement les paramètres corrects des serveurs IMAP, SMTP, POP3, CalDAV et CardDAV lorsqu'un utilisateur ajoute son compte e-mail. Ceci est défini par [RFC 6186](https://www.rfc-editor.org/rfc/rfc6186.html) (e-mail) et [RFC 6764](https://www.rfc-editor.org/rfc/rfc6764.html) (CalDAV/CardDAV) et utilise les enregistrements DNS SRV.

Forward Email publie des enregistrements d'autodécouverte sur `forwardemail.net`. Vous pouvez soit ajouter des enregistrements SRV directement à votre domaine, soit utiliser une approche plus simple avec des enregistrements CNAME.

#### Option A : enregistrements CNAME (le plus simple) {#option-a-cname-records-simplest}

Ajoutez ces deux enregistrements CNAME au DNS de votre domaine. Cela délègue l'autodécouverte aux serveurs de Forward Email :

|  Type | Nom/Hôte       | Cible/Valeur                   |
| :---: | -------------- | ------------------------------ |
| CNAME | `autoconfig`   | `autoconfig.forwardemail.net`  |
| CNAME | `autodiscover` | `autodiscover.forwardemail.net` |

L'enregistrement `autoconfig` est utilisé par **Thunderbird** et d'autres clients basés sur Mozilla. L'enregistrement `autodiscover` est utilisé par **Microsoft Outlook**.

#### Option B : enregistrements SRV (direct) {#option-b-srv-records-direct}

Si vous préférez ajouter les enregistrements directement (ou si votre fournisseur DNS ne supporte pas les CNAME sur les sous-domaines), ajoutez ces enregistrements SRV à votre domaine :

| Type | Nom/Hôte           | Priorité | Poids | Port | Cible/Valeur               | Usage                                  |
| :--: | ------------------- | :------: | :----: | :--: | -------------------------- | ------------------------------------- |
|  SRV | `_imaps._tcp`       |     0    |    1   |  993 | `imap.forwardemail.net`    | IMAP sur SSL/TLS (préféré)            |
|  SRV | `_imap._tcp`        |     0    |    0   |   0  | `.`                        | IMAP en clair désactivé               |
|  SRV | `_submissions._tcp` |     0    |    1   |  465 | `smtp.forwardemail.net`    | Soumission SMTP (SSL/TLS, recommandé)|
|  SRV | `_submission._tcp`  |     5    |    1   |  587 | `smtp.forwardemail.net`    | Soumission SMTP (STARTTLS)            |
|  SRV | `_pop3s._tcp`       |    10    |    1   |  995 | `pop3.forwardemail.net`    | POP3 sur SSL/TLS                      |
|  SRV | `_pop3._tcp`        |     0    |    0   |   0  | `.`                        | POP3 en clair désactivé               |
|  SRV | `_caldavs._tcp`     |     0    |    1   |  443 | `caldav.forwardemail.net`  | CalDAV sur TLS (calendriers)          |
|  SRV | `_caldav._tcp`      |     0    |    0   |   0  | `.`                        | CalDAV en clair désactivé             |
|  SRV | `_carddavs._tcp`    |     0    |    1   |  443 | `carddav.forwardemail.net` | CardDAV sur TLS (contacts)            |
|  SRV | `_carddav._tcp`     |     0    |    0   |   0  | `.`                        | CardDAV en clair désactivé            |
> \[!NOTE]
> IMAP a une valeur de priorité plus basse (0) que POP3 (10), ce qui indique aux clients de messagerie de préférer IMAP à POP3 lorsque les deux sont disponibles. Les enregistrements avec une cible `.` (un seul point) indiquent que les versions en clair (non chiffrées) de ces protocoles sont intentionnellement désactivées conformément à la [Section 3.4 de la RFC 6186](https://www.rfc-editor.org/rfc/rfc6186.html#section-3.4). Les enregistrements SRV CalDAV et CardDAV suivent la [RFC 6764](https://www.rfc-editor.org/rfc/rfc6764.html) pour la découverte automatique des calendriers et contacts.

#### Quels clients de messagerie supportent la découverte automatique ? {#which-email-clients-support-autodiscovery}

| Client             | Email                                            | CalDAV/CardDAV                             |
| ------------------ | ------------------------------------------------ | ------------------------------------------ |
| Thunderbird        | enregistrements CNAME ou SRV `autoconfig`        | enregistrements XML ou SRV `autoconfig` (RFC 6764) |
| Apple Mail (macOS) | enregistrements SRV (RFC 6186)                   | enregistrements SRV (RFC 6764)             |
| Apple Mail (iOS)   | enregistrements SRV (RFC 6186)                   | enregistrements SRV (RFC 6764)             |
| Microsoft Outlook  | CNAME `autodiscover` ou SRV `_autodiscover._tcp` | Non supporté                               |
| GNOME (Evolution)  | enregistrements SRV (RFC 6186)                   | enregistrements SRV (RFC 6764)             |
| KDE (KMail)        | enregistrements SRV (RFC 6186)                   | enregistrements SRV (RFC 6764)             |
| eM Client          | `autoconfig` ou `autodiscover`                   | enregistrements SRV (RFC 6764)             |

> \[!TIP]
> Pour une compatibilité optimale avec tous les clients, nous recommandons d’utiliser **l’Option A** (enregistrements CNAME) combinée aux enregistrements SRV de **l’Option B**. L’approche CNAME seule couvre la majorité des clients de messagerie. Les enregistrements SRV CalDAV/CardDAV garantissent que les clients de calendrier et contacts peuvent également découvrir automatiquement vos paramètres serveur.


## Sécurité {#security-1}

### Techniques avancées de renforcement du serveur {#advanced-server-hardening-techniques}

> \[!TIP]
> En savoir plus sur notre infrastructure de sécurité sur [notre page Sécurité](/security).

Forward Email met en œuvre de nombreuses techniques de renforcement du serveur pour garantir la sécurité de notre infrastructure et de vos données :

1. **Sécurité réseau** :
   * Pare-feu iptables avec règles strictes
   * Fail2ban pour la protection contre les attaques par force brute
   * Audits de sécurité réguliers et tests d’intrusion
   * Accès administratif uniquement via VPN

2. **Renforcement du système** :
   * Installation minimale de paquets
   * Mises à jour de sécurité régulières
   * SELinux en mode enforcing
   * Accès SSH root désactivé
   * Authentification uniquement par clés

3. **Sécurité des applications** :
   * En-têtes Content Security Policy (CSP)
   * HTTPS Strict Transport Security (HSTS)
   * En-têtes de protection contre les XSS
   * Options de cadre et politique de référent
   * Audits réguliers des dépendances

4. **Protection des données** :
   * Chiffrement complet du disque avec LUKS
   * Gestion sécurisée des clés
   * Sauvegardes régulières chiffrées
   * Pratiques de minimisation des données

5. **Surveillance et réponse** :
   * Détection d’intrusion en temps réel
   * Analyse de sécurité automatisée
   * Centralisation des journaux et analyses
   * Procédures de réponse aux incidents

> \[!IMPORTANT]
> Nos pratiques de sécurité sont continuellement mises à jour pour faire face aux menaces et vulnérabilités émergentes.

> \[!TIP]
> Pour une sécurité maximale, nous recommandons d’utiliser notre service avec un chiffrement de bout en bout via OpenPGP.

### Avez-vous des certifications SOC 2 ou ISO 27001 ? {#do-you-have-soc-2-or-iso-27001-certifications}

> \[!NOTE]
> Forward Email fonctionne sur une infrastructure fournie par des sous-traitants certifiés afin d’assurer la conformité aux normes industrielles.

Forward Email ne détient pas directement les certifications SOC 2 Type II ou ISO 27001. Cependant, le service fonctionne sur une infrastructure fournie par des sous-traitants certifiés :

* **DigitalOcean** : certifié SOC 2 Type II et SOC 3 Type II (audité par Schellman & Company LLC), certifié ISO 27001 dans plusieurs centres de données. Détails : <https://www.digitalocean.com/trust/certification-reports>
* **Vultr** : certifié SOC 2+ (HIPAA), certifications ISO/IEC : 20000-1:2018, 27001:2022, 27017:2015, 27018:2019. Détails : <https://www.vultr.com/legal/compliance/>

* **DataPacket** : conforme SOC 2 (contactez directement DataPacket pour obtenir la certification), fournisseur d'infrastructure de niveau entreprise (site de Denver). Détails : <https://www.datapacket.com/datacenters/denver>

Forward Email suit les meilleures pratiques de l'industrie pour les audits de sécurité et collabore régulièrement avec des chercheurs en sécurité indépendants. Source : <https://forwardemail.net/technical-whitepaper.pdf#page=36>

### Utilisez-vous le chiffrement TLS pour le transfert d’e-mails {#do-you-use-tls-encryption-for-email-forwarding}

Oui. Forward Email applique strictement TLS 1.2+ pour toutes les connexions (HTTPS, SMTP, IMAP, POP3) et met en œuvre MTA-STS pour un support TLS renforcé. L’implémentation inclut :

* Application de TLS 1.2+ pour toutes les connexions e-mail
* Échange de clés ECDHE (Elliptic Curve Diffie-Hellman Ephemeral) pour une confidentialité parfaite
* Suites de chiffrement modernes avec mises à jour régulières de sécurité
* Support HTTP/2 pour une meilleure performance et sécurité
* HSTS (HTTP Strict Transport Security) avec préchargement dans les principaux navigateurs
* **MTA-STS (Mail Transfer Agent Strict Transport Security)** pour une application stricte de TLS

Source : <https://forwardemail.net/technical-whitepaper.pdf#page=25>

**Implémentation MTA-STS** : Forward Email applique une enforcement stricte de MTA-STS dans la base de code. Lorsqu’une erreur TLS survient et que MTA-STS est activé, le système renvoie des codes SMTP 421 pour garantir que les e-mails soient réessayés plus tard plutôt que livrés de manière non sécurisée. Détails de l’implémentation :

* Détection d’erreur TLS : <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-tls-error.js>
* Enforcement MTA-STS dans le helper send-email : <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/send-email.js>

Validation tierce : <https://www.hardenize.com/report/forwardemail.net/1750312779> affiche des évaluations « Good » pour toutes les mesures TLS et de sécurité des transports.

### Conservez-vous les en-têtes d’authentification des e-mails {#do-you-preserve-email-authentication-headers}

Oui. Forward Email implémente et conserve de manière exhaustive les en-têtes d’authentification des e-mails :

* **SPF (Sender Policy Framework)** : correctement implémenté et conservé
* **DKIM (DomainKeys Identified Mail)** : support complet avec gestion appropriée des clés
* **DMARC** : application de la politique pour les e-mails échouant à la validation SPF ou DKIM
* **ARC** : bien que non détaillé explicitement, les scores parfaits de conformité du service suggèrent une gestion complète des en-têtes d’authentification

Source : <https://forwardemail.net/technical-whitepaper.pdf#page=31>

Validation : le test Internet.nl Mail Test affiche un score de 100/100 spécifiquement pour la mise en œuvre de « SPF, DKIM et DMARC ». L’évaluation Hardenize confirme des notes « Good » pour SPF et DMARC : <https://www.hardenize.com/report/forwardemail.net/1750312779>

### Conservez-vous les en-têtes originaux des e-mails et empêchez-vous le spoofing {#do-you-preserve-original-email-headers-and-prevent-spoofing}

> \[!TIP]
> Forward Email met en œuvre une protection anti-spoofing sophistiquée pour prévenir les abus par e-mail.

Forward Email conserve les en-têtes originaux des e-mails tout en appliquant une protection anti-spoofing complète via la base de code MX :

* **Conservation des en-têtes** : les en-têtes d’authentification originaux sont maintenus lors du transfert
* **Anti-spoofing** : l’application de la politique DMARC empêche le spoofing des en-têtes en rejetant les e-mails échouant à la validation SPF ou DKIM
* **Prévention de l’injection d’en-têtes** : validation et assainissement des entrées via la bibliothèque striptags
* **Protection avancée** : détection sophistiquée de phishing avec détection de spoofing, prévention de l’usurpation d’identité et systèmes de notification utilisateur

**Détails de l’implémentation MX** : la logique principale de traitement des e-mails est gérée par la base de code du serveur MX, notamment :

* Gestionnaire principal des données MX : <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>
* Filtrage arbitraire des e-mails (anti-spoofing) : <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-arbitrary.js>

Le helper `isArbitrary` applique des règles anti-spoofing sophistiquées incluant la détection d’usurpation de domaine, de phrases bloquées et de divers schémas de phishing.
### Comment protégez-vous contre le spam et les abus {#how-do-you-protect-against-spam-and-abuse}

Forward Email met en œuvre une protection multi-couches complète :

* **Limitation de débit** : Appliquée aux tentatives d'authentification, aux points d'API et aux connexions SMTP
* **Isolation des ressources** : Entre les utilisateurs pour éviter l'impact des utilisateurs à volume élevé
* **Protection DDoS** : Protection multi-couches via le système Shield de DataPacket et Cloudflare
* **Mise à l'échelle automatique** : Ajustement dynamique des ressources en fonction de la demande
* **Prévention des abus** : Contrôles spécifiques aux utilisateurs pour la prévention des abus et blocage basé sur des hachages pour le contenu malveillant
* **Authentification des emails** : Protocoles SPF, DKIM, DMARC avec détection avancée de phishing

Sources :

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver> (détails sur la protection DDoS)
* <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/abuse-prevention-by-user-id.js>

### Stockez-vous le contenu des emails sur disque {#do-you-store-email-content-on-disk}

> \[!IMPORTANT]
> Forward Email utilise une architecture zero-knowledge qui empêche le contenu des emails d'être écrit sur disque.

* **Architecture Zero-Knowledge** : Des boîtes aux lettres SQLite chiffrées individuellement signifient que Forward Email ne peut pas accéder au contenu des emails
* **Traitement en mémoire** : Le traitement des emails se fait entièrement en mémoire, évitant le stockage sur disque
* **Pas de journalisation du contenu** : « Nous ne journalisons ni ne stockons le contenu ou les métadonnées des emails sur disque »
* **Chiffrement en bac à sable** : Les clés de chiffrement ne sont jamais stockées en clair sur disque

**Preuve dans le code MX** : Le serveur MX traite les emails entièrement en mémoire sans écrire le contenu sur disque. Le gestionnaire principal de traitement des emails démontre cette approche en mémoire : <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

Sources :

* <https://forwardemail.net/technical-whitepaper.pdf#page=10> (Résumé)
* <https://forwardemail.net/technical-whitepaper.pdf#page=59> (Détails zero-knowledge)
* <https://forwardemail.net/technical-whitepaper.pdf#page=21> (Chiffrement en bac à sable)

### Le contenu des emails peut-il être exposé lors de pannes système {#can-email-content-be-exposed-during-system-crashes}

Non. Forward Email met en œuvre des mesures de protection complètes contre l'exposition des données liée aux pannes :

* **Core dumps désactivés** : Empêche l'exposition de la mémoire lors des pannes
* **Mémoire swap désactivée** : Complètement désactivée pour empêcher l'extraction de données sensibles depuis les fichiers swap
* **Architecture en mémoire** : Le contenu des emails existe uniquement en mémoire volatile pendant le traitement
* **Protection des clés de chiffrement** : Les clés ne sont jamais stockées en clair sur disque
* **Sécurité physique** : Disques chiffrés LUKS v2 empêchent l'accès physique aux données
* **Stockage USB désactivé** : Empêche l'extraction non autorisée de données

**Gestion des erreurs pour les problèmes système** : Forward Email utilise les fonctions d'aide `isCodeBug` et `isTimeoutError` pour s'assurer que si des problèmes de connectivité base de données, de réseau DNS/liste noire ou de connectivité en amont surviennent, le système retourne des codes SMTP 421 afin que les emails soient réessayés plus tard plutôt que perdus ou exposés.

Détails d'implémentation :

* Classification des erreurs : <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js>
* Gestion des erreurs de timeout dans le traitement MX : <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

Source : <https://forwardemail.net/technical-whitepaper.pdf#page=15>

### Qui a accès à votre infrastructure email {#who-has-access-to-your-email-infrastructure}

Forward Email met en œuvre des contrôles d'accès complets pour son équipe d'ingénierie restreinte de 2-3 personnes avec des exigences strictes de 2FA :

* **Contrôle d'accès basé sur les rôles** : Pour les comptes d'équipe avec permissions basées sur les ressources
* **Principe du moindre privilège** : Appliqué dans tous les systèmes
* **Séparation des tâches** : Entre les rôles opérationnels
* **Gestion des utilisateurs** : Utilisateurs distincts pour déploiement et devops avec permissions différentes
* **Connexion root désactivée** : Oblige l'accès via des comptes correctement authentifiés
* **2FA strict** : Pas de 2FA par SMS à cause du risque d'attaques MiTM – uniquement via applications ou tokens matériels
* **Journalisation complète des audits** : Avec masquage des données sensibles
* **Détection automatisée des anomalies** : Pour les accès inhabituels
* **Revue régulière de la sécurité** : Des journaux d'accès
* **Prévention des attaques Evil Maid** : Stockage USB désactivé et autres mesures de sécurité physique
Sources :

* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (Contrôles d'autorisation)
* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (Sécurité réseau)
* <https://forwardemail.net/technical-whitepaper.pdf#page=15> (Prévention des attaques de type evil maid)

### Quels fournisseurs d'infrastructure utilisez-vous {#what-infrastructure-providers-do-you-use}

> \[!IMPORTANT]
> Forward Email utilise plusieurs sous-traitants d'infrastructure avec des certifications de conformité complètes.

Les détails complets sont disponibles sur notre page de conformité RGPD : <https://forwardemail.net/gdpr>

**Principaux sous-traitants d'infrastructure :**

| Fournisseur      | Certifié cadre de confidentialité des données | Page de conformité RGPD                                                                 |
| ---------------- | --------------------------------------------- | --------------------------------------------------------------------------------------- |
| **Cloudflare**   | ✅ Oui                                        | <https://www.cloudflare.com/trust-hub/gdpr/>                                           |
| **DataPacket**   | ❌ Non                                        | <https://www.datapacket.com/privacy-policy>                                            |
| **DigitalOcean** | ❌ Non                                        | <https://www.digitalocean.com/legal/gdpr>                                              |
| **GitHub**       | ✅ Oui                                        | <https://docs.github.com/en/site-policy/privacy-policies/github-data-protection-agreement> |
| **Vultr**        | ❌ Non                                        | <https://www.vultr.com/legal/eea-gdpr-privacy/>                                        |

**Certifications détaillées :**

**DigitalOcean**

* SOC 2 Type II & SOC 3 Type II (audité par Schellman & Company LLC)
* Certifié ISO 27001 dans plusieurs centres de données
* Conforme PCI-DSS
* Certifié CSA STAR Niveau 1
* Certifié APEC CBPR PRP
* Détails : <https://www.digitalocean.com/trust/certification-reports>

**Vultr**

* Certifié SOC 2+ (HIPAA)
* Conforme PCI Merchant
* Certifié CSA STAR Niveau 1
* ISO/IEC 20000-1:2018, 27001:2022, 27017:2015, 27018:2019
* Détails : <https://www.vultr.com/legal/compliance/>

**DataPacket**

* Conforme SOC 2 (contacter DataPacket directement pour obtenir la certification)
* Infrastructure de niveau entreprise (site de Denver)
* Protection DDoS via la suite de cybersécurité Shield
* Support technique 24/7
* Réseau mondial avec 58 centres de données
* Détails : <https://www.datapacket.com/datacenters/denver>

**GitHub**

* Certifié cadre de confidentialité des données (EU-U.S., Swiss-U.S., et extension UK)
* Hébergement de code source, CI/CD, et gestion de projet
* Accord de protection des données GitHub disponible
* Détails : <https://docs.github.com/en/site-policy/privacy-policies/github-data-protection-agreement>

**Processeurs de paiement :**

* **Stripe** : Certifié cadre de confidentialité des données - <https://stripe.com/legal/privacy-center>
* **PayPal** : Non certifié DPF - <https://www.paypal.com/uk/legalhub/privacy-full>

### Proposez-vous un accord de traitement des données (DPA) {#do-you-offer-a-data-processing-agreement-dpa}

Oui, Forward Email propose un accord de traitement des données (DPA) complet qui peut être signé avec notre contrat entreprise. Une copie de notre DPA est disponible à : <https://forwardemail.net/dpa>

**Détails du DPA :**

* Couvre la conformité RGPD ainsi que les cadres Privacy Shield UE-États-Unis / Suisse-États-Unis
* Accepté automatiquement lors de l'acceptation de nos Conditions d'utilisation
* Aucune signature séparée requise pour le DPA standard
* Des arrangements personnalisés de DPA sont disponibles via la licence entreprise

**Cadre de conformité RGPD :**
Notre DPA détaille la conformité au RGPD ainsi que les exigences internationales de transfert de données. Les informations complètes sont disponibles à : <https://forwardemail.net/gdpr>

Pour les clients entreprise nécessitant des conditions DPA personnalisées ou des arrangements contractuels spécifiques, ceux-ci peuvent être traités via notre programme **Licence Entreprise (250 $/mois)**.

### Comment gérez-vous les notifications de violation de données {#how-do-you-handle-data-breach-notifications}

> \[!NOTE]
> L'architecture zero-knowledge de Forward Email limite considérablement l'impact des violations.
* **Exposition limitée des données** : Impossible d'accéder au contenu des emails chiffrés en raison de l'architecture zero-knowledge  
* **Collecte minimale de données** : Seules les informations de base des abonnés et des journaux IP limités pour la sécurité sont collectées  
* **Cadres des sous-traitants** : DigitalOcean, GitHub et Vultr maintiennent des procédures de réponse aux incidents conformes au RGPD  

**Informations sur le représentant RGPD :**  
Forward Email a désigné des représentants RGPD conformément à l'article 27 :

**Représentant UE :**  
Osano International Compliance Services Limited  
ATTN : LFHC  
3 Dublin Landings, North Wall Quay  
Dublin 1, D01C4E0  

**Représentant UK :**  
Osano UK Compliance LTD  
ATTN : LFHC  
42-46 Fountain Street, Belfast  
Antrim, BT1 - 5EF  

Pour les clients entreprise nécessitant des SLA spécifiques de notification de violation, ceux-ci doivent être discutés dans le cadre d'un accord de **Licence Entreprise**.

Sources :

* <https://forwardemail.net/technical-whitepaper.pdf#page=59>  
* <https://forwardemail.net/gdpr>  

### Proposez-vous un environnement de test {#do-you-offer-a-test-environment}

La documentation technique de Forward Email ne décrit pas explicitement un mode bac à sable dédié. Cependant, les approches potentielles de test incluent :

* **Option d'auto-hébergement** : Capacités complètes d'auto-hébergement pour créer des environnements de test  
* **Interface API** : Potentiel de test programmatique des configurations  
* **Open Source** : Code 100 % open source permettant aux clients d'examiner la logique de transfert  
* **Domaines multiples** : Support de plusieurs domaines pouvant permettre la création de domaines de test  

Pour les clients entreprise nécessitant des capacités formelles de bac à sable, cela doit être discuté dans le cadre d'un accord de **Licence Entreprise**.

Source : <https://github.com/forwardemail/forwardemail.net> (Détails de l'environnement de développement)

### Fournissez-vous des outils de surveillance et d'alerte {#do-you-provide-monitoring-and-alerting-tools}

Forward Email fournit une surveillance en temps réel avec certaines limitations :

**Disponible :**

* **Surveillance de la livraison en temps réel** : Indicateurs de performance visibles publiquement pour les principaux fournisseurs d'email  
* **Alertes automatiques** : Équipe d'ingénierie alertée lorsque les délais de livraison dépassent 10 secondes  
* **Surveillance transparente** : Systèmes de surveillance 100 % open source  
* **Surveillance de l'infrastructure** : Détection automatique des anomalies et journalisation complète des audits  

**Limitations :**

* Les webhooks orientés client ou notifications de statut de livraison basées sur API ne sont pas explicitement documentés  

Pour les clients entreprise nécessitant des webhooks détaillés de statut de livraison ou des intégrations de surveillance personnalisées, ces capacités peuvent être disponibles via des accords de **Licence Entreprise**.

Sources :

* <https://forwardemail.net> (Affichage de la surveillance en temps réel)  
* <https://github.com/forwardemail/forwardemail.net> (Implémentation de la surveillance)  

### Comment assurez-vous une haute disponibilité {#how-do-you-ensure-high-availability}

> \[!IMPORTANT]  
> Forward Email met en œuvre une redondance complète via plusieurs fournisseurs d'infrastructure.

* **Infrastructure distribuée** : Plusieurs fournisseurs (DigitalOcean, Vultr, DataPacket) répartis géographiquement  
* **Répartition géographique de la charge** : Équilibrage de charge géolocalisé basé sur Cloudflare avec basculement automatique  
* **Mise à l'échelle automatique** : Ajustement dynamique des ressources selon la demande  
* **Protection DDoS multi-couches** : Via le système Shield de DataPacket et Cloudflare  
* **Redondance des serveurs** : Plusieurs serveurs par région avec basculement automatique  
* **Réplication de base de données** : Synchronisation des données en temps réel sur plusieurs sites  
* **Surveillance et alertes** : Surveillance 24/7 avec réponse automatique aux incidents  

**Engagement de disponibilité** : Disponibilité du service supérieure à 99,9 % avec surveillance transparente disponible sur <https://forwardemail.net>

Sources :

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>  
* <https://www.datapacket.com/datacenters/denver>  

### Êtes-vous conforme à la Section 889 du National Defense Authorization Act (NDAA) {#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa}

> \[!IMPORTANT]  
> Forward Email est entièrement conforme à la Section 889 grâce à une sélection rigoureuse des partenaires d'infrastructure.

Oui, Forward Email est **conforme à la Section 889**. La Section 889 du National Defense Authorization Act (NDAA) interdit aux agences gouvernementales d'utiliser ou de contracter avec des entités utilisant des équipements de télécommunications et de vidéosurveillance de certaines entreprises (Huawei, ZTE, Hikvision, Dahua et Hytera).
**Comment Forward Email respecte la conformité à la Section 889 :**

Forward Email s'appuie exclusivement sur deux fournisseurs d'infrastructure clés, aucun d'eux n'utilisant d'équipements interdits par la Section 889 :

1. **Cloudflare** : Notre partenaire principal pour les services réseau et la sécurité des emails
2. **DataPacket** : Notre fournisseur principal pour l'infrastructure serveur (utilisant exclusivement du matériel Arista Networks et Cisco)
3. **Fournisseurs de secours** : Nos fournisseurs de secours Digital Ocean et Vultr sont également confirmés par écrit comme étant conformes à la Section 889.

**Engagement de Cloudflare** : Cloudflare déclare explicitement dans leur Code de Conduite des Tiers qu'ils n'utilisent pas d'équipements de télécommunications, de produits de vidéosurveillance, ni de services provenant d'entités interdites par la Section 889.

**Cas d'utilisation gouvernemental** : Notre conformité à la Section 889 a été validée lorsque l'**Académie Navale des États-Unis** a choisi Forward Email pour leurs besoins de transfert sécurisé d'emails, nécessitant une documentation de nos normes de conformité fédérales.

Pour des détails complets sur notre cadre de conformité gouvernementale, incluant des réglementations fédérales plus larges, lisez notre étude de cas complète : [Service Email du Gouvernement Fédéral Conforme à la Section 889](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)


## Détails Système et Techniques {#system-and-technical-details}

### Stockez-vous les emails et leur contenu {#do-you-store-emails-and-their-contents}

Non, nous n'écrivons pas sur disque ni ne stockons de logs – à [l'exception des erreurs](#do-you-store-error-logs) et du [SMTP sortant](#do-you-support-sending-email-with-smtp) (voir notre [Politique de Confidentialité](/privacy)).

Tout est fait en mémoire et [notre code source est sur GitHub](https://github.com/forwardemail).

### Comment fonctionne votre système de transfert d'emails {#how-does-your-email-forwarding-system-work}

L'email repose sur le [protocole SMTP](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol). Ce protocole consiste en des commandes envoyées à un serveur (fonctionnant le plus souvent sur le port 25). Il y a une connexion initiale, puis l'expéditeur indique l'adresse d'envoi ("MAIL FROM"), suivie de la destination ("RCPT TO"), et enfin les en-têtes et le corps de l'email lui-même ("DATA"). Le déroulement de notre système de transfert d'emails est décrit en fonction de chaque commande du protocole SMTP ci-dessous :

* Connexion initiale (pas de nom de commande, ex. `telnet example.com 25`) - C'est la connexion initiale. Nous vérifions les expéditeurs qui ne sont pas dans notre [liste blanche](#do-you-have-an-allowlist) contre notre [liste noire](#do-you-have-a-denylist). Enfin, si un expéditeur n'est pas dans notre liste blanche, nous vérifions s'il a été [mise en liste grise](#do-you-have-a-greylist).

* `HELO` - Cela indique une salutation pour identifier le FQDN, l'adresse IP ou le nom du gestionnaire de mail de l'expéditeur. Cette valeur peut être usurpée, donc nous ne nous fions pas à cette donnée et utilisons plutôt la recherche inverse du nom d'hôte de l'adresse IP de la connexion.

* `MAIL FROM` - Cela indique l'adresse d'enveloppe de l'expéditeur de l'email. Si une valeur est saisie, elle doit être une adresse email valide selon la RFC 5322. Les valeurs vides sont autorisées. Nous [vérifions la protection contre le backscatter](#how-do-you-protect-against-backscatter) ici, et nous vérifions également le MAIL FROM contre notre [liste noire](#do-you-have-a-denylist). Nous vérifions enfin les expéditeurs qui ne sont pas sur la liste blanche pour la limitation de débit (voir la section sur la [limitation de débit](#do-you-have-rate-limiting) et la [liste blanche](#do-you-have-an-allowlist) pour plus d'informations).

* `RCPT TO` - Cela indique le(s) destinataire(s) de l'email. Ceux-ci doivent être des adresses email valides selon la RFC 5322. Nous ne permettons que jusqu'à 50 destinataires d'enveloppe par message (ceci est différent de l'en-tête "To" d'un email). Nous vérifions également la validité d'une adresse [Sender Rewriting Scheme](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme) ("SRS") ici pour protéger contre l'usurpation avec notre nom de domaine SRS.

* `DATA` - C'est la partie centrale de notre service qui traite un email. Voir la section [Comment traitez-vous un email pour le transfert](#how-do-you-process-an-email-for-forwarding) ci-dessous pour plus de détails.
### Comment traitez-vous un email pour le transfert {#how-do-you-process-an-email-for-forwarding}

Cette section décrit notre processus lié à la commande du protocole SMTP `DATA` dans la section [Comment fonctionne votre système de transfert d'email](#how-does-your-email-forwarding-system-work) ci-dessus – c'est ainsi que nous traitons les en-têtes, le corps, la sécurité d'un email, déterminons où il doit être livré, et comment nous gérons les connexions.

1. Si le message dépasse la taille maximale de 50 Mo, il est alors rejeté avec un code d'erreur 552.

2. Si le message ne contient pas d'en-tête "From", ou si l'une des valeurs dans l'en-tête "From" n'est pas une adresse email valide selon la RFC 5322, il est alors rejeté avec un code d'erreur 550.

3. Si le message contient plus de 25 en-têtes "Received", il est considéré comme étant bloqué dans une boucle de redirection, et il est rejeté avec un code d'erreur 550.

4. En utilisant l'empreinte de l'email (voir la section sur [l'empreinte](#how-do-you-determine-an-email-fingerprint)), nous vérifions si le message a été tenté d'être renvoyé pendant plus de 5 jours (ce qui correspond au [comportement par défaut de postfix](http://www.postfix.org/postconf.5.html#maximal_queue_lifetime)), et si c'est le cas, il sera rejeté avec un code d'erreur 550.

5. Nous stockons en mémoire les résultats du scan de l'email utilisant [Spam Scanner](https://spamscanner.net).

6. S'il y a eu des résultats arbitraires de Spam Scanner, le message est rejeté avec un code d'erreur 554. Les résultats arbitraires incluent uniquement le test GTUBE au moment de cette rédaction. Voir <https://spamassassin.apache.org/gtube/> pour plus d'informations.

7. Nous ajoutons les en-têtes suivants au message pour des raisons de débogage et de prévention des abus :

   * `Received` - nous ajoutons cet en-tête standard Received avec l'IP et l'hôte d'origine, le type de transmission, les informations de connexion TLS, la date/heure, et le destinataire.
   * `X-Original-To` - le destinataire original du message :
     * Ceci est utile pour déterminer où un email a été initialement livré (en plus de l'en-tête "Received").
     * Ceci est ajouté pour chaque destinataire au moment de l'IMAP et/ou du transfert masqué (afin de protéger la vie privée).
   * `X-Forward-Email-Website` - contient un lien vers notre site web <https://forwardemail.net>
   * `X-Forward-Email-Version` - la version actuelle [SemVer](https://semver.org/) issue du `package.json` de notre base de code.
   * `X-Forward-Email-Session-ID` - une valeur d'ID de session utilisée à des fins de débogage (s'applique uniquement dans les environnements non production).
   * `X-Forward-Email-Sender` - une liste séparée par des virgules contenant l'adresse MAIL FROM d'origine de l'enveloppe (si elle n'était pas vide), le FQDN client PTR inverse (s'il existe), et l'adresse IP de l'expéditeur.
   * `X-Forward-Email-ID` - ceci est applicable uniquement pour le SMTP sortant et correspond à l'ID de l'email stocké dans Mon Compte → Emails
   * `X-Report-Abuse` - avec la valeur `abuse@forwardemail.net`.
   * `X-Report-Abuse-To` - avec la valeur `abuse@forwardemail.net`.
   * `X-Complaints-To` - avec la valeur `abuse@forwardemail.net`.

8. Nous vérifions ensuite le message pour [DKIM](https://fr.wikipedia.org/wiki/DomainKeys_Identified_Mail), [SPF](https://fr.wikipedia.org/wiki/Sender_Policy_Framework), [ARC](https://en.wikipedia.org/wiki/Authenticated_Received_Chain), et [DMARC](https://fr.wikipedia.org/wiki/DMARC).

   * Si le message échoue au DMARC et que le domaine avait une politique de rejet (par exemple `p=reject` [était dans la politique DMARC](https://wikipedia.org/wiki/DMARC)), il est alors rejeté avec un code d'erreur 550. Typiquement, une politique DMARC pour un domaine peut être trouvée dans l'enregistrement <strong class="notranslate">TXT</strong> du sous-domaine `_dmarc` (par exemple `dig _dmarc.example.com txt`).
   * Si le message échoue au SPF et que le domaine avait une politique de rejet stricte (par exemple `-all` était dans la politique SPF contrairement à `~all` ou aucune politique), il est alors rejeté avec un code d'erreur 550. Typiquement, une politique SPF pour un domaine peut être trouvée dans l'enregistrement <strong class="notranslate">TXT</strong> du domaine racine (par exemple `dig example.com txt`). Voir cette section pour plus d'informations sur [l'envoi de mail en tant que dans Gmail](#can-i-send-mail-as-in-gmail-with-this) concernant SPF.
9. Nous traitons maintenant les destinataires du message tels que collectés à partir de la commande `RCPT TO` dans la section [Comment fonctionne votre système de transfert d'email](#how-does-your-email-forwarding-system-work) ci-dessus. Pour chaque destinataire, nous effectuons les opérations suivantes :

   * Nous recherchons les enregistrements <strong class="notranslate">TXT</strong> du nom de domaine (la partie après le symbole `@`, par exemple `example.com` si l'adresse email était `test@example.com`). Par exemple, si le domaine est `example.com`, nous effectuons une recherche DNS telle que `dig example.com txt`.
   * Nous analysons tous les enregistrements <strong class="notranslate">TXT</strong> qui commencent soit par `forward-email=` (plans gratuits) soit par `forward-email-site-verification=` (plans payants). Notez que nous analysons les deux, afin de traiter les emails pendant qu'un utilisateur effectue une montée ou une descente de plan.
   * À partir de ces enregistrements <strong class="notranslate">TXT</strong> analysés, nous itérons dessus pour extraire la configuration de transfert (comme décrit dans la section [Comment démarrer et configurer le transfert d'email](#how-do-i-get-started-and-set-up-email-forwarding) ci-dessus). Notez que nous ne supportons qu'une seule valeur `forward-email-site-verification=`, et si plus d'une est fournie, une erreur 550 se produira et l'expéditeur recevra un rebond pour ce destinataire.
   * Nous itérons récursivement sur la configuration de transfert extraite pour déterminer le transfert global, le transfert basé sur des expressions régulières, et toutes les autres configurations de transfert prises en charge – qui sont désormais appelées nos « Adresses de Transfert ».
   * Pour chaque Adresse de Transfert, nous supportons une recherche récursive (qui relancera cette série d'opérations sur l'adresse donnée). Si une correspondance récursive est trouvée, alors le résultat parent sera retiré des Adresses de Transfert, et les enfants ajoutés.
   * Les Adresses de Transfert sont analysées pour leur unicité (car nous ne voulons pas envoyer de doublons à une même adresse ou générer des connexions clients SMTP supplémentaires inutiles).
   * Pour chaque Adresse de Transfert, nous vérifions son nom de domaine auprès de notre point d'API `/v1/max-forwarded-addresses` (afin de déterminer combien d'adresses le domaine est autorisé à transférer par alias, par exemple 10 par défaut – voir la section sur [limite maximale de transfert par alias](#is-there-a-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias)). Si cette limite est dépassée, une erreur 550 se produira et l'expéditeur recevra un rebond pour ce destinataire.
   * Nous vérifions les paramètres du destinataire original auprès de notre point d'API `/v1/settings`, qui supporte une recherche pour les utilisateurs payants (avec un repli pour les utilisateurs gratuits). Cela retourne un objet de configuration pour les paramètres avancés `port` (Nombre, par exemple `25`), `has_adult_content_protection` (Booléen), `has_phishing_protection` (Booléen), `has_executable_protection` (Booléen), et `has_virus_protection` (Booléen).
   * En fonction de ces paramètres, nous vérifions ensuite les résultats du Scanner de Spam et si des erreurs surviennent, le message est rejeté avec un code d'erreur 554 (par exemple, si `has_virus_protection` est activé, nous vérifierons les résultats du Scanner de Spam pour les virus). Notez que tous les utilisateurs du plan gratuit sont automatiquement soumis aux vérifications contre le contenu adulte, le phishing, les exécutables et les virus. Par défaut, tous les utilisateurs des plans payants sont également soumis à ces vérifications, mais cette configuration peut être modifiée dans la page Paramètres d'un domaine dans le tableau de bord Forward Email).

10. Pour chaque Adresse de Transfert traitée d'un destinataire, nous effectuons ensuite les opérations suivantes :

    * L'adresse est vérifiée contre notre [liste de refus](#do-you-have-a-denylist), et si elle y figure, un code d'erreur 421 sera généré (indiquant à l'expéditeur de réessayer plus tard).
    * Si l'adresse est un webhook, alors nous définissons un booléen pour les opérations futures (voir ci-dessous – nous regroupons les webhooks similaires pour effectuer une seule requête POST au lieu de plusieurs pour la livraison).
    * Si l'adresse est une adresse email, alors nous analysons l'hôte pour les opérations futures (voir ci-dessous – nous regroupons les hôtes similaires pour établir une seule connexion au lieu de plusieurs connexions individuelles pour la livraison).
11. S'il n'y a pas de destinataires et qu'il n'y a pas de rebonds, alors nous répondons avec une erreur 550 "Destinataires invalides".

12. S'il y a des destinataires, alors nous les parcourons (groupés par le même hôte) et livrons les emails. Voir la section [Comment gérez-vous les problèmes de livraison d'email](#how-do-you-handle-email-delivery-issues) ci-dessous pour plus d'informations.

    * Si des erreurs surviennent lors de l'envoi des emails, alors nous les stockerons en mémoire pour un traitement ultérieur.
    * Nous prendrons le code d'erreur le plus bas (le cas échéant) provenant de l'envoi des emails – et l'utiliserons comme code de réponse à la commande `DATA`. Cela signifie que les emails non livrés seront généralement réessayés par l'expéditeur original, tandis que les emails déjà livrés ne seront pas renvoyés la prochaine fois que le message est envoyé (car nous utilisons la [Fingerprinting](#how-do-you-determine-an-email-fingerprint)).
    * Si aucune erreur ne s'est produite, alors nous enverrons un code de statut SMTP 250 indiquant le succès.
    * Un rebond est défini comme toute tentative de livraison qui aboutit à un code de statut >= 500 (échecs permanents).

13. S'il n'y a pas eu de rebonds (échecs permanents), alors nous retournerons un code de statut SMTP correspondant au code d'erreur le plus bas parmi les échecs non permanents (ou un code de statut 250 réussi s'il n'y en avait pas).

14. Si des rebonds se sont produits, alors nous enverrons les emails de rebond en arrière-plan après avoir retourné le plus bas de tous les codes d'erreur à l'expéditeur. Cependant, si le code d'erreur le plus bas est >= 500, alors nous n'envoyons aucun email de rebond. En effet, si nous le faisions, les expéditeurs recevraient un double email de rebond (par exemple un de leur MTA sortant, comme Gmail – et aussi un de notre part). Voir la section sur [Comment protégez-vous contre le backscatter](#how-do-you-protect-against-backscatter) ci-dessous pour plus d'informations.

### Comment gérez-vous les problèmes de livraison d'email {#how-do-you-handle-email-delivery-issues}

Notez que nous effectuerons une réécriture "Friendly-From" sur les emails uniquement si la politique DMARC de l'expéditeur n'était pas validée ET qu'aucune signature DKIM n'était alignée avec l'en-tête "From". Cela signifie que nous modifierons l'en-tête "From" du message, définirons "X-Original-From", et définirons également un "Reply-To" s'il n'était pas déjà défini. Nous refermerons aussi le sceau ARC sur le message après avoir modifié ces en-têtes.

Nous utilisons également une analyse intelligente des messages d'erreur à tous les niveaux de notre pile – dans notre code, les requêtes DNS, les internals Node.js, les requêtes HTTP (par exemple 408, 413, et 429 sont mappés au code de réponse SMTP 421 si le destinataire est un webhook), et les réponses du serveur mail (par exemple les réponses avec "defer" ou "slowdown" seront réessayées comme erreurs 421).

Notre logique est à toute épreuve et elle réessaiera également en cas d'erreurs SSL/TLS, de problèmes de connexion, et plus encore. L'objectif de cette robustesse est de maximiser la délivrabilité à tous les destinataires pour une configuration de transfert.

Si le destinataire est un webhook, alors nous autoriserons un délai d'attente de 60 secondes pour que la requête se termine avec jusqu'à 3 tentatives (soit 4 requêtes au total avant un échec). Notez que nous analysons correctement les codes d'erreur 408, 413, et 429 et les mappons à un code de réponse SMTP 421.

Sinon, si le destinataire est une adresse email, alors nous tenterons d'envoyer l'email avec TLS opportuniste (nous tentons d'utiliser STARTTLS s'il est disponible sur le serveur mail du destinataire). Si une erreur SSL/TLS survient lors de la tentative d'envoi, alors nous tenterons d'envoyer l'email sans TLS (sans utiliser STARTTLS).

Si des erreurs DNS ou de connexion surviennent, alors nous retournerons à la commande `DATA` un code de réponse SMTP 421, sinon s'il y a des erreurs de niveau >= 500, alors des rebonds seront envoyés.

Si nous détectons qu'un serveur email auquel nous tentons de livrer a bloqué une ou plusieurs de nos adresses IP d'échange de mail (par exemple par la technologie qu'ils utilisent pour différer les spammeurs), alors nous enverrons un code de réponse SMTP 421 pour que l'expéditeur réessaie son message plus tard (et nous sommes alertés du problème afin que nous puissions espérer le résoudre avant la prochaine tentative).

### Comment gérez-vous le blocage de vos adresses IP {#how-do-you-handle-your-ip-addresses-becoming-blocked}
Nous surveillons régulièrement toutes les principales listes de refus DNS et si l'une de nos adresses IP d'échange de courrier ("MX") est répertoriée dans une liste de refus majeure, nous la retirerons du round robin de l'enregistrement DNS A concerné si possible jusqu'à ce que le problème soit résolu.

Au moment de la rédaction de ce document, nous sommes également répertoriés dans plusieurs listes d'autorisation DNS, et nous prenons la surveillance des listes de refus très au sérieux. Si vous constatez des problèmes avant que nous ayons eu la chance de les résoudre, veuillez nous en informer par écrit à <support@forwardemail.net>.

Nos adresses IP sont publiquement disponibles, [voir cette section ci-dessous pour plus d'informations](#what-are-your-servers-ip-addresses).

### Quelles sont les adresses postmaster {#what-are-postmaster-addresses}

Afin d'éviter les rebonds mal dirigés et l'envoi de messages de réponse automatique de vacances à des boîtes aux lettres non surveillées ou inexistantes, nous maintenons une liste de noms d'utilisateur similaires à mailer-daemon :

* `automailer`
* `autoresponder`
* `bounce`
* `bounce-notification`
* `bounce-notifications`
* `bounces`
* `hostmaster`
* `listserv`
* `localhost`
* `mail-daemon`
* `mail.daemon`
* `maildaemon`
* `mailer-daemon`
* `mailer.daemon`
* `mailerdaemon`
* `majordomo`
* `postmaster`
* [et toute adresse no-reply](#what-are-no-reply-addresses)

Voir [RFC 5320 Section 4.6](https://datatracker.ietf.org/doc/html/rfc5230#section-4.6) pour plus d'informations sur la manière dont des listes telles que celles-ci sont utilisées pour créer des systèmes de messagerie efficaces.

### Quelles sont les adresses no-reply {#what-are-no-reply-addresses}

Les noms d'utilisateur d'email correspondant à l'un des suivants (insensible à la casse) sont considérés comme des adresses no-reply :

* `do-not-reply`
* `do-not-respond`
* `do.not.reply`
* `donotreply`
* `donotrespond`
* `dont-reply`
* `naoresponda`
* `no-replies`
* `no-reply`
* `no-replys`
* `no.replies`
* `no.reply`
* `no.replys`
* `no_reply`
* `nobody`
* `noreplies`
* `noreply`
* `noreplys`

Cette liste est maintenue [en tant que projet open-source sur GitHub](https://github.com/forwardemail/reserved-email-addresses-list).

### Quelles sont les adresses IP de vos serveurs {#what-are-your-servers-ip-addresses}

Nous publions nos adresses IP sur <https://forwardemail.net/ips>.

### Avez-vous une liste d'autorisation {#do-you-have-an-allowlist}

Oui, nous avons une [liste d'extensions de noms de domaine](#what-domain-name-extensions-are-allowlisted-by-default) qui sont autorisées par défaut ainsi qu'une liste d'autorisation dynamique, mise en cache et roulante basée sur des [critères stricts](#what-is-your-allowlist-criteria).

Tous les domaines, emails et adresses IP utilisés par les clients payants sont automatiquement vérifiés contre notre liste de refus toutes les heures – ce qui alerte les administrateurs qui peuvent intervenir manuellement si nécessaire.

De plus, si l'un de vos domaines ou ses adresses email est inscrit sur une liste de refus (par exemple pour envoi de spam, virus ou en raison d'attaques d'usurpation d'identité) – alors les administrateurs du domaine (vous) et nos administrateurs d'équipe seront immédiatement notifiés par email. Nous recommandons fortement que vous [configuriez DMARC](#how-do-i-set-up-dmarc-for-forward-email) pour éviter cela.

### Quelles extensions de noms de domaine sont autorisées par défaut {#what-domain-name-extensions-are-allowlisted-by-default}

Les extensions de noms de domaine suivantes sont considérées comme autorisées par défaut (qu'elles figurent ou non sur la liste de popularité Umbrella) :

<ul class="list-inline">
  <li class="list-inline-item"><code class="notranslate">edu</code></li>
  <li class="list-inline-item"><code class="notranslate">gov</code></li>
  <li class="list-inline-item"><code class="notranslate">mil</code></li>
  <li class="list-inline-item"><code class="notranslate">int</code></li>
  <li class="list-inline-item"><code class="notranslate">arpa</code></li>
  <li class="list-inline-item"><code class="notranslate">dni.us</code></li>
  <li class="list-inline-item"><code class="notranslate">fed.us</code></li>
  <li class="list-inline-item"><code class="notranslate">isa.us</code></li>
  <li class="list-inline-item"><code class="notranslate">kids.us</code></li>
  <li class="list-inline-item"><code class="notranslate">nsn.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ak.us</code></li>
  <li class="list-inline-item"><code class="notranslate">al.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ar.us</code></li>
  <li class="list-inline-item"><code class="notranslate">as.us</code></li>
  <li class="list-inline-item"><code class="notranslate">az.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ca.us</code></li>
  <li class="list-inline-item"><code class="notranslate">co.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ct.us</code></li>
  <li class="list-inline-item"><code class="notranslate">dc.us</code></li>
  <li class="list-inline-item"><code class="notranslate">de.us</code></li>
  <li class="list-inline-item"><code class="notranslate">fl.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ga.us</code></li>
  <li class="list-inline-item"><code class="notranslate">gu.us</code></li>
  <li class="list-inline-item"><code class="notranslate">hi.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ia.us</code></li>
  <li class="list-inline-item"><code class="notranslate">id.us</code></li>
  <li class="list-inline-item"><code class="notranslate">il.us</code></li>
  <li class="list-inline-item"><code class="notranslate">in.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ks.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ky.us</code></li>
  <li class="list-inline-item"><code class="notranslate">la.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ma.us</code></li>
  <li class="list-inline-item"><code class="notranslate">md.us</code></li>
  <li class="list-inline-item"><code class="notranslate">me.us</code></li>
  <li class="list-inline-item"><code class="notranslate">mi.us</code></li>
  <li class="list-inline-item"><code class="notranslate">mn.us</code></li>
  <li class="list-inline-item"><code class="notranslate">mo.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ms.us</code></li>
  <li class="list-inline-item"><code class="notranslate">mt.us</code></li>
  <li class="list-inline-item"><code class="notranslate">nc.us</code></li>
  <li class="list-inline-item"><code class="notranslate">nd.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ne.us</code></li>
  <li class="list-inline-item"><code class="notranslate">nh.us</code></li>
  <li class="list-inline-item"><code class="notranslate">nj.us</code></li>
  <li class="list-inline-item"><code class="notranslate">nm.us</code></li>
  <li class="list-inline-item"><code class="notranslate">nv.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ny.us</code></li>
  <li class="list-inline-item"><code class="notranslate">oh.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ok.us</code></li>
  <li class="list-inline-item"><code class="notranslate">or.us</code></li>
  <li class="list-inline-item"><code class="notranslate">pa.us</code></li>
  <li class="list-inline-item"><code class="notranslate">pr.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ri.us</code></li>
  <li class="list-inline-item"><code class="notranslate">sc.us</code></li>
  <li class="list-inline-item"><code class="notranslate">sd.us</code></li>
  <li class="list-inline-item"><code class="notranslate">tn.us</code></li>
  <li class="list-inline-item"><code class="notranslate">tx.us</code></li>
  <li class="list-inline-item"><code class="notranslate">ut.us</code></li>
  <li class="list-inline-item"><code class="notranslate">va.us</code></li>
  <li class="list-inline-item"><code class="notranslate">vi.us</code></li>
  <li class="list-inline-item"><code class="notranslate">vt.us</code></li>
  <li class="list-inline-item"><code class="notranslate">wa.us</code></li>
  <li class="list-inline-item"><code class="notranslate">wi.us</code></li>
  <li class="list-inline-item"><code class="notranslate">wv.us</code></li>
  <li class="list-inline-item"><code class="notranslate">wy.us</code></li>
  <li class="list-inline-item"><code class="notranslate">mil.tt</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.tt</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.tr</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.ua</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.au</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.at</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.br</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.nz</code></li>
  <li class="list-inline-item"><code class="notranslate">school.nz</code></li>
  <li class="list-inline-item"><code class="notranslate">cri.nz</code></li>
  <li class="list-inline-item"><code class="notranslate">health.nz</code></li>
  <li class="list-inline-item"><code class="notranslate">mil.nz</code></li>
  <li class="list-inline-item"><code class="notranslate">parliament.nz</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.in</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.in</code></li>
  <li class="list-inline-item"><code class="notranslate">mil.in</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.jp</code></li>
  <li class="list-inline-item"><code class="notranslate">ed.jp</code></li>
  <li class="list-inline-item"><code class="notranslate">lg.jp</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.za</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.za</code></li>
  <li class="list-inline-item"><code class="notranslate">mil.za</code></li>
  <li class="list-inline-item"><code class="notranslate">school.za</code></li>
  <li class="list-inline-item"><code class="notranslate">mil.kr</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.kr</code></li>
  <li class="list-inline-item"><code class="notranslate">hs.kr</code></li>
  <li class="list-inline-item"><code class="notranslate">ms.kr</code></li>
  <li class="list-inline-item"><code class="notranslate">es.kr</code></li>
  <li class="list-inline-item"><code class="notranslate">sc.kr</code></li>
  <li class="list-inline-item"><code class="notranslate">kg.kr</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.es</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.lk</code></li>
  <li class="list-inline-item"><code class="notranslate">sch.lk</code></li>
  <li class="list-inline-item"><code class="notranslate">edu.lk</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.th</code></li>
  <li class="list-inline-item"><code class="notranslate">mi.th</code></li>
  <li class="list-inline-item"><code class="notranslate">admin.ch</code></li>
  <li class="list-inline-item"><code class="notranslate">canada.ca</code></li>
  <li class="list-inline-item"><code class="notranslate">gc.ca</code></li>
  <li class="list-inline-item"><code class="notranslate">go.id</code></li>
  <li class="list-inline-item"><code class="notranslate">go.jp</code></li>
  <li class="list-inline-item"><code class="notranslate">go.ke</code></li>
  <li class="list-inline-item"><code class="notranslate">go.kr</code></li>
  <li class="list-inline-item"><code class="notranslate">go.th</code></li>
  <li class="list-inline-item"><code class="notranslate">gob.ar</code></li>
  <li class="list-inline-item"><code class="notranslate">gob.cl</code></li>
  <li class="list-inline-item"><code class="notranslate">gob.es</code></li>
  <li class="list-inline-item"><code class="notranslate">gob.mx</code></li>
  <!--<li class="list-inline-item"><code class="notranslate">gob.pe</code></li>-->
  <li class="list-inline-item"><code class="notranslate">gob.ve</code></li>
  <li class="list-inline-item"><code class="notranslate">gob.sv</code></li>
  <li class="list-inline-item"><code class="notranslate">gouv.fr</code></li>
  <li class="list-inline-item"><code class="notranslate">gouv.nc</code></li>
  <li class="list-inline-item"><code class="notranslate">gouv.qc.ca</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ad</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.af</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ai</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.al</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.am</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ao</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.au</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.aw</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ax</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.az</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.bd</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.be</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.bg</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.bm</code></li>
  <!--<li class="list-inline-item"><code class="notranslate">gov.br</code></li>-->
  <li class="list-inline-item"><code class="notranslate">gov.by</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.cl</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.cn</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.co</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.cy</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.cz</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.dz</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.eg</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.fi</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.fk</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.gg</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.gr</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.hk</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.hr</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.hu</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ie</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.il</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.im</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.in</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.iq</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ir</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.it</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.je</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.kp</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.krd</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ky</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.kz</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.lb</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.lk</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.lt</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.lv</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ma</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.mm</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.mo</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.mt</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.my</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ng</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.np</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ph</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.pk</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.pl</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.pt</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.py</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ro</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ru</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.scot</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.se</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.sg</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.si</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.sk</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.tr</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.tt</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.tw</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.ua</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.vn</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.wales</code></li>
  <li class="list-inline-item"><code class="notranslate">gov.za</code></li>
  <li class="list-inline-item"><code class="notranslate">government.pn</code></li>
  <li class="list-inline-item"><code class="notranslate">govt.nz</code></li>
  <!--<li class="list-inline-item"><code class="notranslate">gub.uy</code></li>-->
  <li class="list-inline-item"><code class="notranslate">gv.at</code></li>
  <li class="list-inline-item"><code class="notranslate">ac.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">bl.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">judiciary.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">mod.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">nhs.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">parliament.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">police.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">rct.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">royal.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">sch.uk</code></li>
  <li class="list-inline-item"><code class="notranslate">ukaea.uk</code></li>
</ul>
De plus, ces [domaines de premier niveau de marque et d'entreprise](https://en.wikipedia.org/wiki/List_of_Internet_top-level_domains#Brand_and_corporate_top-level_domains) sont autorisés par défaut (par exemple `apple` pour `applecard.apple` pour les relevés bancaires Apple Card) :

<ul class="list-inline">
  <li class="list-inline-item"><code class="notranslate">aaa</code></li>
  <li class="list-inline-item"><code class="notranslate">aarp</code></li>
  <li class="list-inline-item"><code class="notranslate">abarth</code></li>
  <li class="list-inline-item"><code class="notranslate">abb</code></li>
  <li class="list-inline-item"><code class="notranslate">abbott</code></li>
  <li class="list-inline-item"><code class="notranslate">abbvie</code></li>
  <li class="list-inline-item"><code class="notranslate">abc</code></li>
  <li class="list-inline-item"><code class="notranslate">accenture</code></li>
  <li class="list-inline-item"><code class="notranslate">aco</code></li>
  <li class="list-inline-item"><code class="notranslate">aeg</code></li>
  <li class="list-inline-item"><code class="notranslate">aetna</code></li>
  <li class="list-inline-item"><code class="notranslate">afl</code></li>
  <li class="list-inline-item"><code class="notranslate">agakhan</code></li>
  <li class="list-inline-item"><code class="notranslate">aig</code></li>
  <li class="list-inline-item"><code class="notranslate">aigo</code></li>
  <li class="list-inline-item"><code class="notranslate">airbus</code></li>
  <li class="list-inline-item"><code class="notranslate">airtel</code></li>
  <li class="list-inline-item"><code class="notranslate">akdn</code></li>
  <li class="list-inline-item"><code class="notranslate">alfaromeo</code></li>
  <li class="list-inline-item"><code class="notranslate">alibaba</code></li>
  <li class="list-inline-item"><code class="notranslate">alipay</code></li>
  <li class="list-inline-item"><code class="notranslate">allfinanz</code></li>
  <li class="list-inline-item"><code class="notranslate">allstate</code></li>
  <li class="list-inline-item"><code class="notranslate">ally</code></li>
  <li class="list-inline-item"><code class="notranslate">alstom</code></li>
  <li class="list-inline-item"><code class="notranslate">amazon</code></li>
  <li class="list-inline-item"><code class="notranslate">americanexpress</code></li>
  <li class="list-inline-item"><code class="notranslate">amex</code></li>
  <li class="list-inline-item"><code class="notranslate">amica</code></li>
  <li class="list-inline-item"><code class="notranslate">android</code></li>
  <li class="list-inline-item"><code class="notranslate">anz</code></li>
  <li class="list-inline-item"><code class="notranslate">aol</code></li>
  <li class="list-inline-item"><code class="notranslate">apple</code></li>
  <li class="list-inline-item"><code class="notranslate">aquarelle</code></li>
  <li class="list-inline-item"><code class="notranslate">aramco</code></li>
  <li class="list-inline-item"><code class="notranslate">audi</code></li>
  <li class="list-inline-item"><code class="notranslate">auspost</code></li>
  <li class="list-inline-item"><code class="notranslate">aws</code></li>
  <li class="list-inline-item"><code class="notranslate">axa</code></li>
  <li class="list-inline-item"><code class="notranslate">azure</code></li>
  <li class="list-inline-item"><code class="notranslate">baidu</code></li>
  <li class="list-inline-item"><code class="notranslate">bananarepublic</code></li>
  <li class="list-inline-item"><code class="notranslate">barclaycard</code></li>
  <li class="list-inline-item"><code class="notranslate">barclays</code></li>
  <li class="list-inline-item"><code class="notranslate">basketball</code></li>
  <li class="list-inline-item"><code class="notranslate">bauhaus</code></li>
  <li class="list-inline-item"><code class="notranslate">bbc</code></li>
  <li class="list-inline-item"><code class="notranslate">bbt</code></li>
  <li class="list-inline-item"><code class="notranslate">bbva</code></li>
  <li class="list-inline-item"><code class="notranslate">bcg</code></li>
  <li class="list-inline-item"><code class="notranslate">bentley</code></li>
  <li class="list-inline-item"><code class="notranslate">bharti</code></li>
  <li class="list-inline-item"><code class="notranslate">bing</code></li>
  <li class="list-inline-item"><code class="notranslate">blanco</code></li>
  <li class="list-inline-item"><code class="notranslate">bloomberg</code></li>
  <li class="list-inline-item"><code class="notranslate">bms</code></li>
  <li class="list-inline-item"><code class="notranslate">bmw</code></li>
  <li class="list-inline-item"><code class="notranslate">bnl</code></li>
  <li class="list-inline-item"><code class="notranslate">bnpparibas</code></li>
  <li class="list-inline-item"><code class="notranslate">boehringer</code></li>
  <!--<li class="list-inline-item"><code class="notranslate">bond</code></li>-->
  <li class="list-inline-item"><code class="notranslate">booking</code></li>
  <li class="list-inline-item"><code class="notranslate">bosch</code></li>
  <li class="list-inline-item"><code class="notranslate">bostik</code></li>
  <li class="list-inline-item"><code class="notranslate">bradesco</code></li>
  <li class="list-inline-item"><code class="notranslate">bridgestone</code></li>
  <li class="list-inline-item"><code class="notranslate">brother</code></li>
  <li class="list-inline-item"><code class="notranslate">bugatti</code></li>
  <li class="list-inline-item"><code class="notranslate">cal</code></li>
  <li class="list-inline-item"><code class="notranslate">calvinklein</code></li>
  <li class="list-inline-item"><code class="notranslate">canon</code></li>
  <li class="list-inline-item"><code class="notranslate">capitalone</code></li>
  <li class="list-inline-item"><code class="notranslate">caravan</code></li>
  <li class="list-inline-item"><code class="notranslate">cartier</code></li>
  <li class="list-inline-item"><code class="notranslate">cba</code></li>
  <li class="list-inline-item"><code class="notranslate">cbn</code></li>
  <li class="list-inline-item"><code class="notranslate">cbre</code></li>
  <li class="list-inline-item"><code class="notranslate">cbs</code></li>
  <li class="list-inline-item"><code class="notranslate">cern</code></li>
  <li class="list-inline-item"><code class="notranslate">cfa</code></li>
  <li class="list-inline-item"><code class="notranslate">chanel</code></li>
  <li class="list-inline-item"><code class="notranslate">chase</code></li>
  <li class="list-inline-item"><code class="notranslate">chintai</code></li>
  <li class="list-inline-item"><code class="notranslate">chrome</code></li>
  <li class="list-inline-item"><code class="notranslate">chrysler</code></li>
  <li class="list-inline-item"><code class="notranslate">cipriani</code></li>
  <li class="list-inline-item"><code class="notranslate">cisco</code></li>
  <li class="list-inline-item"><code class="notranslate">citadel</code></li>
  <li class="list-inline-item"><code class="notranslate">citi</code></li>
  <li class="list-inline-item"><code class="notranslate">citic</code></li>
  <li class="list-inline-item"><code class="notranslate">clubmed</code></li>
  <li class="list-inline-item"><code class="notranslate">comcast</code></li>
  <li class="list-inline-item"><code class="notranslate">commbank</code></li>
  <li class="list-inline-item"><code class="notranslate">creditunion</code></li>
  <li class="list-inline-item"><code class="notranslate">crown</code></li>
  <li class="list-inline-item"><code class="notranslate">crs</code></li>
  <li class="list-inline-item"><code class="notranslate">csc</code></li>
  <li class="list-inline-item"><code class="notranslate">cuisinella</code></li>
  <li class="list-inline-item"><code class="notranslate">dabur</code></li>
  <li class="list-inline-item"><code class="notranslate">datsun</code></li>
  <li class="list-inline-item"><code class="notranslate">dealer</code></li>
  <li class="list-inline-item"><code class="notranslate">dell</code></li>
  <li class="list-inline-item"><code class="notranslate">deloitte</code></li>
  <li class="list-inline-item"><code class="notranslate">delta</code></li>
  <li class="list-inline-item"><code class="notranslate">dhl</code></li>
  <li class="list-inline-item"><code class="notranslate">discover</code></li>
  <li class="list-inline-item"><code class="notranslate">dish</code></li>
  <li class="list-inline-item"><code class="notranslate">dnp</code></li>
  <li class="list-inline-item"><code class="notranslate">dodge</code></li>
  <li class="list-inline-item"><code class="notranslate">dunlop</code></li>
  <li class="list-inline-item"><code class="notranslate">dupont</code></li>
  <li class="list-inline-item"><code class="notranslate">dvag</code></li>
  <li class="list-inline-item"><code class="notranslate">edeka</code></li>
  <li class="list-inline-item"><code class="notranslate">emerck</code></li>
  <li class="list-inline-item"><code class="notranslate">epson</code></li>
  <li class="list-inline-item"><code class="notranslate">ericsson</code></li>
  <li class="list-inline-item"><code class="notranslate">erni</code></li>
  <li class="list-inline-item"><code class="notranslate">esurance</code></li>
  <li class="list-inline-item"><code class="notranslate">etisalat</code></li>
  <li class="list-inline-item"><code class="notranslate">eurovision</code></li>
  <li class="list-inline-item"><code class="notranslate">everbank</code></li>
  <li class="list-inline-item"><code class="notranslate">extraspace</code></li>
  <li class="list-inline-item"><code class="notranslate">fage</code></li>
  <li class="list-inline-item"><code class="notranslate">fairwinds</code></li>
  <li class="list-inline-item"><code class="notranslate">farmers</code></li>
  <li class="list-inline-item"><code class="notranslate">fedex</code></li>
  <li class="list-inline-item"><code class="notranslate">ferrari</code></li>
  <li class="list-inline-item"><code class="notranslate">ferrero</code></li>
  <li class="list-inline-item"><code class="notranslate">fiat</code></li>
  <li class="list-inline-item"><code class="notranslate">fidelity</code></li>
  <li class="list-inline-item"><code class="notranslate">firestone</code></li>
  <li class="list-inline-item"><code class="notranslate">firmdale</code></li>
  <li class="list-inline-item"><code class="notranslate">flickr</code></li>
  <li class="list-inline-item"><code class="notranslate">flir</code></li>
  <li class="list-inline-item"><code class="notranslate">flsmidth</code></li>
  <li class="list-inline-item"><code class="notranslate">ford</code></li>
  <li class="list-inline-item"><code class="notranslate">fox</code></li>
  <li class="list-inline-item"><code class="notranslate">fresenius</code></li>
  <li class="list-inline-item"><code class="notranslate">forex</code></li>
  <li class="list-inline-item"><code class="notranslate">frogans</code></li>
  <li class="list-inline-item"><code class="notranslate">frontier</code></li>
  <li class="list-inline-item"><code class="notranslate">fujitsu</code></li>
  <li class="list-inline-item"><code class="notranslate">fujixerox</code></li>
  <li class="list-inline-item"><code class="notranslate">gallo</code></li>
  <li class="list-inline-item"><code class="notranslate">gallup</code></li>
  <li class="list-inline-item"><code class="notranslate">gap</code></li>
  <li class="list-inline-item"><code class="notranslate">gbiz</code></li>
  <li class="list-inline-item"><code class="notranslate">gea</code></li>
  <li class="list-inline-item"><code class="notranslate">genting</code></li>
  <li class="list-inline-item"><code class="notranslate">giving</code></li>
  <li class="list-inline-item"><code class="notranslate">gle</code></li>
  <li class="list-inline-item"><code class="notranslate">globo</code></li>
  <li class="list-inline-item"><code class="notranslate">gmail</code></li>
  <li class="list-inline-item"><code class="notranslate">gmo</code></li>
  <li class="list-inline-item"><code class="notranslate">gmx</code></li>
  <li class="list-inline-item"><code class="notranslate">godaddy</code></li>
  <li class="list-inline-item"><code class="notranslate">goldpoint</code></li>
  <li class="list-inline-item"><code class="notranslate">goodyear</code></li>
  <li class="list-inline-item"><code class="notranslate">goog</code></li>
  <li class="list-inline-item"><code class="notranslate">google</code></li>
  <li class="list-inline-item"><code class="notranslate">grainger</code></li>
  <li class="list-inline-item"><code class="notranslate">guardian</code></li>
  <li class="list-inline-item"><code class="notranslate">gucci</code></li>
  <li class="list-inline-item"><code class="notranslate">hbo</code></li>
  <li class="list-inline-item"><code class="notranslate">hdfc</code></li>
  <li class="list-inline-item"><code class="notranslate">hdfcbank</code></li>
  <li class="list-inline-item"><code class="notranslate">hermes</code></li>
  <li class="list-inline-item"><code class="notranslate">hisamitsu</code></li>
  <li class="list-inline-item"><code class="notranslate">hitachi</code></li>
  <li class="list-inline-item"><code class="notranslate">hkt</code></li>
  <li class="list-inline-item"><code class="notranslate">honda</code></li>
  <li class="list-inline-item"><code class="notranslate">honeywell</code></li>
  <li class="list-inline-item"><code class="notranslate">hotmail</code></li>
  <li class="list-inline-item"><code class="notranslate">hsbc</code></li>
  <li class="list-inline-item"><code class="notranslate">hughes</code></li>
  <li class="list-inline-item"><code class="notranslate">hyatt</code></li>
  <li class="list-inline-item"><code class="notranslate">hyundai</code></li>
  <li class="list-inline-item"><code class="notranslate">ibm</code></li>
  <li class="list-inline-item"><code class="notranslate">ieee</code></li>
  <li class="list-inline-item"><code class="notranslate">ifm</code></li>
  <li class="list-inline-item"><code class="notranslate">ikano</code></li>
  <li class="list-inline-item"><code class="notranslate">imdb</code></li>
  <li class="list-inline-item"><code class="notranslate">infiniti</code></li>
  <li class="list-inline-item"><code class="notranslate">intel</code></li>
  <li class="list-inline-item"><code class="notranslate">intuit</code></li>
  <li class="list-inline-item"><code class="notranslate">ipiranga</code></li>
  <li class="list-inline-item"><code class="notranslate">iselect</code></li>
  <li class="list-inline-item"><code class="notranslate">itau</code></li>
  <li class="list-inline-item"><code class="notranslate">itv</code></li>
  <li class="list-inline-item"><code class="notranslate">iveco</code></li>
  <li class="list-inline-item"><code class="notranslate">jaguar</code></li>
  <li class="list-inline-item"><code class="notranslate">java</code></li>
  <li class="list-inline-item"><code class="notranslate">jcb</code></li>
  <li class="list-inline-item"><code class="notranslate">jcp</code></li>
  <li class="list-inline-item"><code class="notranslate">jeep</code></li>
  <li class="list-inline-item"><code class="notranslate">jpmorgan</code></li>
  <li class="list-inline-item"><code class="notranslate">juniper</code></li>
  <li class="list-inline-item"><code class="notranslate">kddi</code></li>
  <li class="list-inline-item"><code class="notranslate">kerryhotels</code></li>
  <li class="list-inline-item"><code class="notranslate">kerrylogistics</code></li>
  <li class="list-inline-item"><code class="notranslate">kerryproperties</code></li>
  <li class="list-inline-item"><code class="notranslate">kfh</code></li>
  <li class="list-inline-item"><code class="notranslate">kia</code></li>
  <li class="list-inline-item"><code class="notranslate">kinder</code></li>
  <li class="list-inline-item"><code class="notranslate">kindle</code></li>
  <li class="list-inline-item"><code class="notranslate">komatsu</code></li>
  <li class="list-inline-item"><code class="notranslate">kpmg</code></li>
  <li class="list-inline-item"><code class="notranslate">kred</code></li>
  <li class="list-inline-item"><code class="notranslate">kuokgroup</code></li>
  <li class="list-inline-item"><code class="notranslate">lacaixa</code></li>
  <li class="list-inline-item"><code class="notranslate">ladbrokes</code></li>
  <li class="list-inline-item"><code class="notranslate">lamborghini</code></li>
  <li class="list-inline-item"><code class="notranslate">lancaster</code></li>
  <li class="list-inline-item"><code class="notranslate">lancia</code></li>
  <li class="list-inline-item"><code class="notranslate">lancome</code></li>
  <li class="list-inline-item"><code class="notranslate">landrover</code></li>
  <li class="list-inline-item"><code class="notranslate">lanxess</code></li>
  <li class="list-inline-item"><code class="notranslate">lasalle</code></li>
  <li class="list-inline-item"><code class="notranslate">latrobe</code></li>
  <li class="list-inline-item"><code class="notranslate">lds</code></li>
  <li class="list-inline-item"><code class="notranslate">leclerc</code></li>
  <li class="list-inline-item"><code class="notranslate">lego</code></li>
  <li class="list-inline-item"><code class="notranslate">liaison</code></li>
  <li class="list-inline-item"><code class="notranslate">lexus</code></li>
  <li class="list-inline-item"><code class="notranslate">lidl</code></li>
  <li class="list-inline-item"><code class="notranslate">lifestyle</code></li>
  <li class="list-inline-item"><code class="notranslate">lilly</code></li>
  <li class="list-inline-item"><code class="notranslate">lincoln</code></li>
  <li class="list-inline-item"><code class="notranslate">linde</code></li>
  <li class="list-inline-item"><code class="notranslate">lipsy</code></li>
  <li class="list-inline-item"><code class="notranslate">lixil</code></li>
  <li class="list-inline-item"><code class="notranslate">locus</code></li>
  <li class="list-inline-item"><code class="notranslate">lotte</code></li>
  <li class="list-inline-item"><code class="notranslate">lpl</code></li>
  <li class="list-inline-item"><code class="notranslate">lplfinancial</code></li>
  <li class="list-inline-item"><code class="notranslate">lundbeck</code></li>
  <li class="list-inline-item"><code class="notranslate">lupin</code></li>
  <li class="list-inline-item"><code class="notranslate">macys</code></li>
  <li class="list-inline-item"><code class="notranslate">maif</code></li>
  <li class="list-inline-item"><code class="notranslate">man</code></li>
  <li class="list-inline-item"><code class="notranslate">mango</code></li>
  <li class="list-inline-item"><code class="notranslate">marriott</code></li>
  <li class="list-inline-item"><code class="notranslate">maserati</code></li>
  <li class="list-inline-item"><code class="notranslate">mattel</code></li>
  <li class="list-inline-item"><code class="notranslate">mckinsey</code></li>
  <li class="list-inline-item"><code class="notranslate">metlife</code></li>
  <li class="list-inline-item"><code class="notranslate">microsoft</code></li>
  <li class="list-inline-item"><code class="notranslate">mini</code></li>
  <li class="list-inline-item"><code class="notranslate">mit</code></li>
  <li class="list-inline-item"><code class="notranslate">mitsubishi</code></li>
  <li class="list-inline-item"><code class="notranslate">mlb</code></li>
  <li class="list-inline-item"><code class="notranslate">mma</code></li>
  <li class="list-inline-item"><code class="notranslate">monash</code></li>
  <li class="list-inline-item"><code class="notranslate">mormon</code></li>
  <li class="list-inline-item"><code class="notranslate">moto</code></li>
  <li class="list-inline-item"><code class="notranslate">movistar</code></li>
  <li class="list-inline-item"><code class="notranslate">msd</code></li>
  <li class="list-inline-item"><code class="notranslate">mtn</code></li>
  <li class="list-inline-item"><code class="notranslate">mtr</code></li>
  <li class="list-inline-item"><code class="notranslate">mutual</code></li>
  <li class="list-inline-item"><code class="notranslate">nadex</code></li>
  <li class="list-inline-item"><code class="notranslate">nationwide</code></li>
  <li class="list-inline-item"><code class="notranslate">natura</code></li>
  <li class="list-inline-item"><code class="notranslate">nba</code></li>
  <li class="list-inline-item"><code class="notranslate">nec</code></li>
  <li class="list-inline-item"><code class="notranslate">netflix</code></li>
  <li class="list-inline-item"><code class="notranslate">neustar</code></li>
  <li class="list-inline-item"><code class="notranslate">newholland</code></li>
  <li class="list-inline-item"><code class="notranslate">nfl</code></li>
  <li class="list-inline-item"><code class="notranslate">nhk</code></li>
  <li class="list-inline-item"><code class="notranslate">nico</code></li>
  <li class="list-inline-item"><code class="notranslate">nike</code></li>
  <li class="list-inline-item"><code class="notranslate">nikon</code></li>
  <li class="list-inline-item"><code class="notranslate">nissan</code></li>
  <li class="list-inline-item"><code class="notranslate">nissay</code></li>
  <li class="list-inline-item"><code class="notranslate">nokia</code></li>
  <li class="list-inline-item"><code class="notranslate">northwesternmutual</code></li>
  <li class="list-inline-item"><code class="notranslate">norton</code></li>
  <li class="list-inline-item"><code class="notranslate">nra</code></li>
  <li class="list-inline-item"><code class="notranslate">ntt</code></li>
  <li class="list-inline-item"><code class="notranslate">obi</code></li>
  <li class="list-inline-item"><code class="notranslate">office</code></li>
  <li class="list-inline-item"><code class="notranslate">omega</code></li>
  <li class="list-inline-item"><code class="notranslate">oracle</code></li>
  <li class="list-inline-item"><code class="notranslate">orange</code></li>
  <li class="list-inline-item"><code class="notranslate">otsuka</code></li>
  <!--<li class="list-inline-item"><code class="notranslate">ovh</code></li>-->
  <li class="list-inline-item"><code class="notranslate">panasonic</code></li>
  <li class="list-inline-item"><code class="notranslate">pccw</code></li>
  <li class="list-inline-item"><code class="notranslate">pfizer</code></li>
  <li class="list-inline-item"><code class="notranslate">philips</code></li>
  <li class="list-inline-item"><code class="notranslate">piaget</code></li>
  <li class="list-inline-item"><code class="notranslate">pictet</code></li>
  <li class="list-inline-item"><code class="notranslate">ping</code></li>
  <li class="list-inline-item"><code class="notranslate">pioneer</code></li>
  <li class="list-inline-item"><code class="notranslate">play</code></li>
  <li class="list-inline-item"><code class="notranslate">playstation</code></li>
  <li class="list-inline-item"><code class="notranslate">pohl</code></li>
  <li class="list-inline-item"><code class="notranslate">politie</code></li>
  <li class="list-inline-item"><code class="notranslate">praxi</code></li>
  <li class="list-inline-item"><code class="notranslate">prod</code></li>
  <li class="list-inline-item"><code class="notranslate">progressive</code></li>
  <li class="list-inline-item"><code class="notranslate">pru</code></li>
  <li class="list-inline-item"><code class="notranslate">prudential</code></li>
  <li class="list-inline-item"><code class="notranslate">pwc</code></li>
  <!--<li class="list-inline-item"><code class="notranslate">quest</code></li>-->
  <li class="list-inline-item"><code class="notranslate">qvc</code></li>
  <li class="list-inline-item"><code class="notranslate">redstone</code></li>
  <li class="list-inline-item"><code class="notranslate">reliance</code></li>
  <li class="list-inline-item"><code class="notranslate">rexroth</code></li>
  <li class="list-inline-item"><code class="notranslate">ricoh</code></li>
  <li class="list-inline-item"><code class="notranslate">rmit</code></li>
  <li class="list-inline-item"><code class="notranslate">rocher</code></li>
  <li class="list-inline-item"><code class="notranslate">rogers</code></li>
  <li class="list-inline-item"><code class="notranslate">rwe</code></li>
  <li class="list-inline-item"><code class="notranslate">safety</code></li>
  <li class="list-inline-item"><code class="notranslate">sakura</code></li>
  <li class="list-inline-item"><code class="notranslate">samsung</code></li>
  <li class="list-inline-item"><code class="notranslate">sandvik</code></li>
  <li class="list-inline-item"><code class="notranslate">sandvikcoromant</code></li>
  <li class="list-inline-item"><code class="notranslate">sanofi</code></li>
  <li class="list-inline-item"><code class="notranslate">sap</code></li>
  <li class="list-inline-item"><code class="notranslate">saxo</code></li>
  <li class="list-inline-item"><code class="notranslate">sbi</code></li>
  <!--<li class="list-inline-item"><code class="notranslate">sbs</code></li>-->
  <li class="list-inline-item"><code class="notranslate">sca</code></li>
  <li class="list-inline-item"><code class="notranslate">scb</code></li>
  <li class="list-inline-item"><code class="notranslate">schaeffler</code></li>
  <li class="list-inline-item"><code class="notranslate">schmidt</code></li>
  <li class="list-inline-item"><code class="notranslate">schwarz</code></li>
  <li class="list-inline-item"><code class="notranslate">scjohnson</code></li>
  <li class="list-inline-item"><code class="notranslate">scor</code></li>
  <li class="list-inline-item"><code class="notranslate">seat</code></li>
  <li class="list-inline-item"><code class="notranslate">sener</code></li>
  <li class="list-inline-item"><code class="notranslate">ses</code></li>
  <li class="list-inline-item"><code class="notranslate">sew</code></li>
  <li class="list-inline-item"><code class="notranslate">seven</code></li>
  <li class="list-inline-item"><code class="notranslate">sfr</code></li>
  <li class="list-inline-item"><code class="notranslate">seek</code></li>
  <li class="list-inline-item"><code class="notranslate">shangrila</code></li>
  <li class="list-inline-item"><code class="notranslate">sharp</code></li>
  <li class="list-inline-item"><code class="notranslate">shaw</code></li>
  <li class="list-inline-item"><code class="notranslate">shell</code></li>
  <li class="list-inline-item"><code class="notranslate">shriram</code></li>
  <li class="list-inline-item"><code class="notranslate">sina</code></li>
  <li class="list-inline-item"><code class="notranslate">sky</code></li>
  <li class="list-inline-item"><code class="notranslate">skype</code></li>
  <li class="list-inline-item"><code class="notranslate">smart</code></li>
  <li class="list-inline-item"><code class="notranslate">sncf</code></li>
  <li class="list-inline-item"><code class="notranslate">softbank</code></li>
  <li class="list-inline-item"><code class="notranslate">sohu</code></li>
  <li class="list-inline-item"><code class="notranslate">sony</code></li>
  <li class="list-inline-item"><code class="notranslate">spiegel</code></li>
  <li class="list-inline-item"><code class="notranslate">stada</code></li>
  <li class="list-inline-item"><code class="notranslate">staples</code></li>
  <li class="list-inline-item"><code class="notranslate">star</code></li>
  <li class="list-inline-item"><code class="notranslate">starhub</code></li>
  <li class="list-inline-item"><code class="notranslate">statebank</code></li>
  <li class="list-inline-item"><code class="notranslate">statefarm</code></li>
  <li class="list-inline-item"><code class="notranslate">statoil</code></li>
  <li class="list-inline-item"><code class="notranslate">stc</code></li>
  <li class="list-inline-item"><code class="notranslate">stcgroup</code></li>
  <li class="list-inline-item"><code class="notranslate">suzuki</code></li>
  <li class="list-inline-item"><code class="notranslate">swatch</code></li>
  <li class="list-inline-item"><code class="notranslate">swiftcover</code></li>
  <li class="list-inline-item"><code class="notranslate">symantec</code></li>
  <li class="list-inline-item"><code class="notranslate">taobao</code></li>
  <li class="list-inline-item"><code class="notranslate">target</code></li>
  <li class="list-inline-item"><code class="notranslate">tatamotors</code></li>
  <li class="list-inline-item"><code class="notranslate">tdk</code></li>
  <li class="list-inline-item"><code class="notranslate">telecity</code></li>
  <li class="list-inline-item"><code class="notranslate">telefonica</code></li>
  <li class="list-inline-item"><code class="notranslate">temasek</code></li>
  <li class="list-inline-item"><code class="notranslate">teva</code></li>
  <li class="list-inline-item"><code class="notranslate">tiffany</code></li>
  <li class="list-inline-item"><code class="notranslate">tjx</code></li>
  <li class="list-inline-item"><code class="notranslate">toray</code></li>
  <li class="list-inline-item"><code class="notranslate">toshiba</code></li>
  <li class="list-inline-item"><code class="notranslate">total</code></li>
  <li class="list-inline-item"><code class="notranslate">toyota</code></li>
  <li class="list-inline-item"><code class="notranslate">travelchannel</code></li>
  <li class="list-inline-item"><code class="notranslate">travelers</code></li>
  <li class="list-inline-item"><code class="notranslate">tui</code></li>
  <li class="list-inline-item"><code class="notranslate">tvs</code></li>
  <li class="list-inline-item"><code class="notranslate">ubs</code></li>
  <li class="list-inline-item"><code class="notranslate">unicom</code></li>
  <li class="list-inline-item"><code class="notranslate">uol</code></li>
  <li class="list-inline-item"><code class="notranslate">ups</code></li>
  <li class="list-inline-item"><code class="notranslate">vanguard</code></li>
  <li class="list-inline-item"><code class="notranslate">verisign</code></li>
  <li class="list-inline-item"><code class="notranslate">vig</code></li>
  <li class="list-inline-item"><code class="notranslate">viking</code></li>
  <li class="list-inline-item"><code class="notranslate">virgin</code></li>
  <li class="list-inline-item"><code class="notranslate">visa</code></li>
  <li class="list-inline-item"><code class="notranslate">vista</code></li>
  <li class="list-inline-item"><code class="notranslate">vistaprint</code></li>
  <li class="list-inline-item"><code class="notranslate">vivo</code></li>
  <li class="list-inline-item"><code class="notranslate">volkswagen</code></li>
  <li class="list-inline-item"><code class="notranslate">volvo</code></li>
  <li class="list-inline-item"><code class="notranslate">walmart</code></li>
  <li class="list-inline-item"><code class="notranslate">walter</code></li>
  <li class="list-inline-item"><code class="notranslate">weatherchannel</code></li>
  <li class="list-inline-item"><code class="notranslate">weber</code></li>
  <li class="list-inline-item"><code class="notranslate">weir</code></li>
  <li class="list-inline-item"><code class="notranslate">williamhill</code></li>
  <li class="list-inline-item"><code class="notranslate">windows</code></li>
  <li class="list-inline-item"><code class="notranslate">wme</code></li>
  <li class="list-inline-item"><code class="notranslate">wolterskluwer</code></li>
  <li class="list-inline-item"><code class="notranslate">woodside</code></li>
  <li class="list-inline-item"><code class="notranslate">wtc</code></li>
  <li class="list-inline-item"><code class="notranslate">xbox</code></li>
  <li class="list-inline-item"><code class="notranslate">xerox</code></li>
  <li class="list-inline-item"><code class="notranslate">xfinity</code></li>
  <li class="list-inline-item"><code class="notranslate">yahoo</code></li>
  <li class="list-inline-item"><code class="notranslate">yamaxun</code></li>
  <li class="list-inline-item"><code class="notranslate">yandex</code></li>
  <li class="list-inline-item"><code class="notranslate">yodobashi</code></li>
  <li class="list-inline-item"><code class="notranslate">youtube</code></li>
  <li class="list-inline-item"><code class="notranslate">zappos</code></li>
  <li class="list-inline-item"><code class="notranslate">zara</code></li>
  <li class="list-inline-item"><code class="notranslate">zippo</code></li>
</ul>
Depuis le 18 mars 2025, nous avons également ajouté ces territoires d'outre-mer français à cette liste ([selon cette demande GitHub](https://github.com/forwardemail/forwardemail.net/issues/327)) :

<ul class="list-inline">
  <li class="list-inline-item"><code class="notranslate">bzh</code></li>
  <li class="list-inline-item"><code class="notranslate">gf</code></li>
  <li class="list-inline-item"><code class="notranslate">gp</code></li>
  <li class="list-inline-item"><code class="notranslate">mq</code></li>
  <li class="list-inline-item"><code class="notranslate">nc</code></li>
  <li class="list-inline-item"><code class="notranslate">pf</code></li>
  <li class="list-inline-item"><code class="notranslate">pm</code></li>
  <li class="list-inline-item"><code class="notranslate">re</code></li>
  <li class="list-inline-item"><code class="notranslate">tf</code></li>
  <li class="list-inline-item"><code class="notranslate">wf</code></li>
  <li class="list-inline-item"><code class="notranslate">yt</code></li>
</ul>

Depuis le 8 juillet 2025, nous avons ajouté ces pays spécifiques à l'Europe :

<ul class="list-inline">
  <li class="list-inline-item"><code class="notranslate">ax</code></li>
  <li class="list-inline-item"><code class="notranslate">bg</code></li>
  <li class="list-inline-item"><code class="notranslate">fo</code></li>
  <li class="list-inline-item"><code class="notranslate">gi</code></li>
  <li class="list-inline-item"><code class="notranslate">gr</code></li>
  <li class="list-inline-item"><code class="notranslate">hr</code></li>
  <li class="list-inline-item"><code class="notranslate">hu</code></li>
  <li class="list-inline-item"><code class="notranslate">lt</code></li>
  <li class="list-inline-item"><code class="notranslate">lu</code></li>
  <li class="list-inline-item"><code class="notranslate">mc</code></li>
  <li class="list-inline-item"><code class="notranslate">mk</code></li>
  <li class="list-inline-item"><code class="notranslate">mt</code></li>
  <li class="list-inline-item"><code class="notranslate">ro</code></li>
  <li class="list-inline-item"><code class="notranslate">sk</code></li>
  <li class="list-inline-item"><code class="notranslate">va</code></li>
</ul>

En octobre 2025, nous avons également ajouté <code class="notranslate">cz</code> (République tchèque) en raison de la demande.

Nous n'avons spécifiquement pas inclus `ru` et `ua` en raison d'une forte activité de spam.

### Quels sont vos critères de liste blanche {#what-is-your-allowlist-criteria}

Nous disposons d'une liste statique des [extensions de noms de domaine autorisées par défaut](#what-domain-name-extensions-are-allowlisted-by-default) – et nous maintenons également une liste blanche dynamique, mise en cache, et roulante basée sur les critères stricts suivants :

* Le domaine racine de l'expéditeur doit être une [extension de nom de domaine correspondant à la liste que nous proposons dans notre plan gratuit](#what-domain-name-extensions-can-be-used-for-free) (avec l'ajout de `biz` et `info`). Nous incluons également des correspondances partielles `edu`, `gov` et `mil`, telles que `xyz.gov.au` et `xyz.edu.au`.
* Le domaine racine de l'expéditeur doit figurer parmi les 100 000 premiers résultats uniques de domaines racines analysés dans la [Umbrella Popularity List](http://s3-us-west-1.amazonaws.com/umbrella-static/index.html "Umbrella Popularity List") ("UPL").
* Le domaine racine de l'expéditeur doit figurer parmi les 50 000 premiers résultats de domaines racines uniques apparaissant dans au moins 4 des 7 derniers jours de l'UPL (~50 %+).
* Le domaine racine de l'expéditeur ne doit pas être [catégorisé](https://radar.cloudflare.com/categorization-feedback/) comme contenu adulte ou malware par Cloudflare.
* Le domaine racine de l'expéditeur doit avoir des enregistrements A ou MX configurés.
* Le domaine racine de l'expéditeur doit avoir soit des enregistrements A, des enregistrements MX, un enregistrement DMARC avec `p=reject` ou `p=quarantine`, ou un enregistrement SPF avec un qualificateur `-all` ou `~all`.

Si ces critères sont satisfaits, alors le domaine racine de l'expéditeur sera mis en cache pendant 7 jours. Notez que notre tâche automatisée s'exécute quotidiennement – il s'agit donc d'un cache de liste blanche roulante qui se met à jour chaque jour.

Notre tâche automatisée télécharge les 7 derniers jours d'UPL en mémoire, les décompresse, puis les analyse en mémoire selon les critères stricts ci-dessus.

Les domaines populaires au moment de la rédaction, tels que Google, Yahoo, Microsoft, Amazon, Meta, Twitter, Netflix, Spotify, et d'autres – sont bien sûr inclus.
Si vous êtes un expéditeur qui ne figure pas sur notre liste blanche, alors la première fois que votre domaine racine FQDN ou votre adresse IP envoie un e-mail, vous serez [limité en débit](#do-you-have-rate-limiting) et [mise en liste grise](#do-you-have-a-greylist). Notez que cela est une pratique standard adoptée comme norme pour les e-mails. La plupart des clients de serveur de messagerie tenteront de réessayer s'ils reçoivent une erreur de limitation de débit ou de liste grise (par exemple un code d'état d'erreur 421 ou de niveau 4xx).

**Notez que des expéditeurs spécifiques tels que `a@gmail.com`, `b@xyz.edu` et `c@gov.au` peuvent toujours être [mis sur liste noire](#do-you-have-a-denylist)** (par exemple si nous détectons automatiquement du spam, du phishing ou des logiciels malveillants provenant de ces expéditeurs).

### Quelles extensions de noms de domaine peuvent être utilisées gratuitement {#what-domain-name-extensions-can-be-used-for-free}

Depuis le 31 mars 2023, nous appliquons une nouvelle règle générale anti-spam pour protéger nos utilisateurs et notre service.

Cette nouvelle règle autorise uniquement les extensions de noms de domaine suivantes à être utilisées sur notre plan gratuit :

<ul class="list-inline">
  <li class="list-inline-item"><code class="notranslate">ac</code></li>
  <li class="list-inline-item"><code class="notranslate">ad</code></li>
  <li class="list-inline-item"><code class="notranslate">ag</code></li>
  <li class="list-inline-item"><code class="notranslate">ai</code></li>
  <li class="list-inline-item"><code class="notranslate">al</code></li>
  <li class="list-inline-item"><code class="notranslate">am</code></li>
  <li class="list-inline-item"><code class="notranslate">app</code></li>
  <li class="list-inline-item"><code class="notranslate">as</code></li>
  <li class="list-inline-item"><code class="notranslate">at</code></li>
  <li class="list-inline-item"><code class="notranslate">au</code></li>
  <li class="list-inline-item"><code class="notranslate">ax</code></li>
  <li class="list-inline-item"><code class="notranslate">ba</code></li>
  <li class="list-inline-item"><code class="notranslate">be</code></li>
  <li class="list-inline-item"><code class="notranslate">bg</code></li>
  <li class="list-inline-item"><code class="notranslate">br</code></li>
  <li class="list-inline-item"><code class="notranslate">by</code></li>
  <li class="list-inline-item"><code class="notranslate">bzh</code></li>
  <li class="list-inline-item"><code class="notranslate">ca</code></li>
  <li class="list-inline-item"><code class="notranslate">cat</code></li>
  <li class="list-inline-item"><code class="notranslate">cc</code></li>
  <li class="list-inline-item"><code class="notranslate">cd</code></li>
  <li class="list-inline-item"><code class="notranslate">ch</code></li>
  <li class="list-inline-item"><code class="notranslate">ck</code></li>
  <li class="list-inline-item"><code class="notranslate">co</code></li>
  <li class="list-inline-item"><code class="notranslate">com</code></li>
  <li class="list-inline-item"><code class="notranslate">de</code></li>
  <li class="list-inline-item"><code class="notranslate">dev</code></li>
  <li class="list-inline-item"><code class="notranslate">dj</code></li>
  <li class="list-inline-item"><code class="notranslate">dk</code></li>
  <li class="list-inline-item"><code class="notranslate">ee</code></li>
  <li class="list-inline-item"><code class="notranslate">es</code></li>
  <li class="list-inline-item"><code class="notranslate">eu</code></li>
  <li class="list-inline-item"><code class="notranslate">family</code></li>
  <li class="list-inline-item"><code class="notranslate">fi</code></li>
  <li class="list-inline-item"><code class="notranslate">fm</code></li>
  <li class="list-inline-item"><code class="notranslate">fo</code></li>
  <li class="list-inline-item"><code class="notranslate">fr</code></li>
  <li class="list-inline-item"><code class="notranslate">gf</code></li>
  <li class="list-inline-item"><code class="notranslate">gg</code></li>
  <li class="list-inline-item"><code class="notranslate">gi</code></li>
  <li class="list-inline-item"><code class="notranslate">gl</code></li>
  <li class="list-inline-item"><code class="notranslate">gp</code></li>
  <li class="list-inline-item"><code class="notranslate">gr</code></li>
  <li class="list-inline-item"><code class="notranslate">hr</code></li>
  <li class="list-inline-item"><code class="notranslate">hu</code></li>
  <li class="list-inline-item"><code class="notranslate">id</code></li>
  <li class="list-inline-item"><code class="notranslate">ie</code></li>
  <li class="list-inline-item"><code class="notranslate">il</code></li>
  <li class="list-inline-item"><code class="notranslate">im</code></li>
  <li class="list-inline-item"><code class="notranslate">in</code></li>
  <li class="list-inline-item"><code class="notranslate">io</code></li>
  <li class="list-inline-item"><code class="notranslate">ir</code></li>
  <li class="list-inline-item"><code class="notranslate">is</code></li>
  <li class="list-inline-item"><code class="notranslate">it</code></li>
  <li class="list-inline-item"><code class="notranslate">je</code></li>
  <li class="list-inline-item"><code class="notranslate">jp</code></li>
  <li class="list-inline-item"><code class="notranslate">ke</code></li>
  <li class="list-inline-item"><code class="notranslate">kr</code></li>
  <li class="list-inline-item"><code class="notranslate">la</code></li>
  <li class="list-inline-item"><code class="notranslate">li</code></li>
  <li class="list-inline-item"><code class="notranslate">lt</code></li>
  <li class="list-inline-item"><code class="notranslate">lu</code></li>
  <li class="list-inline-item"><code class="notranslate">lv</code></li>
  <li class="list-inline-item"><code class="notranslate">ly</code></li>
  <li class="list-inline-item"><code class="notranslate">mc</code></li>
  <li class="list-inline-item"><code class="notranslate">md</code></li>
  <li class="list-inline-item"><code class="notranslate">me</code></li>
  <li class="list-inline-item"><code class="notranslate">mk</code></li>
  <li class="list-inline-item"><code class="notranslate">mn</code></li>
  <li class="list-inline-item"><code class="notranslate">mq</code></li>
  <li class="list-inline-item"><code class="notranslate">ms</code></li>
  <li class="list-inline-item"><code class="notranslate">mt</code></li>
  <li class="list-inline-item"><code class="notranslate">mu</code></li>
  <li class="list-inline-item"><code class="notranslate">mx</code></li>
  <li class="list-inline-item"><code class="notranslate">nc</code></li>
  <li class="list-inline-item"><code class="notranslate">net</code></li>
  <li class="list-inline-item"><code class="notranslate">ni</code></li>
  <li class="list-inline-item"><code class="notranslate">nl</code></li>
  <li class="list-inline-item"><code class="notranslate">no</code></li>
  <li class="list-inline-item"><code class="notranslate">nu</code></li>
  <li class="list-inline-item"><code class="notranslate">nz</code></li>
  <li class="list-inline-item"><code class="notranslate">org</code></li>
  <li class="list-inline-item"><code class="notranslate">pf</code></li>
  <li class="list-inline-item"><code class="notranslate">pl</code></li>
  <li class="list-inline-item"><code class="notranslate">pm</code></li>
  <li class="list-inline-item"><code class="notranslate">pr</code></li>
  <li class="list-inline-item"><code class="notranslate">pt</code></li>
  <li class="list-inline-item"><code class="notranslate">pw</code></li>
  <li class="list-inline-item"><code class="notranslate">re</code></li>
  <li class="list-inline-item"><code class="notranslate">ro</code></li>
  <li class="list-inline-item"><code class="notranslate">rs</code></li>
  <li class="list-inline-item"><code class="notranslate">sc</code></li>
  <li class="list-inline-item"><code class="notranslate">se</code></li>
  <li class="list-inline-item"><code class="notranslate">sh</code></li>
  <li class="list-inline-item"><code class="notranslate">si</code></li>
  <li class="list-inline-item"><code class="notranslate">sk</code></li>
  <li class="list-inline-item"><code class="notranslate">sm</code></li>
  <li class="list-inline-item"><code class="notranslate">sr</code></li>
  <li class="list-inline-item"><code class="notranslate">st</code></li>
  <li class="list-inline-item"><code class="notranslate">tc</code></li>
  <li class="list-inline-item"><code class="notranslate">tf</code></li>
  <li class="list-inline-item"><code class="notranslate">tm</code></li>
  <li class="list-inline-item"><code class="notranslate">to</code></li>
  <li class="list-inline-item"><code class="notranslate">tv</code></li>
  <li class="list-inline-item"><code class="notranslate">uk</code></li>
  <li class="list-inline-item"><code class="notranslate">us</code></li>
  <li class="list-inline-item"><code class="notranslate">uz</code></li>
  <li class="list-inline-item"><code class="notranslate">va</code></li>
  <li class="list-inline-item"><code class="notranslate">vc</code></li>
  <li class="list-inline-item"><code class="notranslate">vg</code></li>
  <li class="list-inline-item"><code class="notranslate">vu</code></li>
  <li class="list-inline-item"><code class="notranslate">wf</code></li>
  <li class="list-inline-item"><code class="notranslate">ws</code></li>
  <li class="list-inline-item"><code class="notranslate">xyz</code></li>
  <li class="list-inline-item"><code class="notranslate">yt</code></li>
  <li class="list-inline-item"><code class="notranslate">za</code></li>
</ul>
### Avez-vous une liste grise {#do-you-have-a-greylist}

Oui, nous utilisons une politique de [greylisting des emails](https://en.wikipedia.org/wiki/Greylisting_\(email\)) très laxiste. Le greylisting ne s'applique qu'aux expéditeurs qui ne sont pas sur notre liste blanche et reste dans notre cache pendant 30 jours.

Pour tout nouvel expéditeur, nous stockons une clé dans notre base de données Redis pendant 30 jours avec une valeur correspondant à l'heure d'arrivée initiale de leur première requête. Nous rejetons ensuite leur email avec un code de statut de retry 450 et ne l'autorisons à passer qu'après un délai de 5 minutes.

S'ils ont attendu avec succès 5 minutes à partir de cette heure d'arrivée initiale, leurs emails seront alors acceptés et ils ne recevront plus ce code de statut 450.

La clé consiste soit en le domaine racine FQDN, soit en l'adresse IP de l'expéditeur. Cela signifie que tout sous-domaine qui passe la liste grise passera également pour le domaine racine, et vice-versa (c'est ce que nous entendons par une politique "très laxiste").

Par exemple, si un email provient de `test.example.com` avant que nous ne voyions un email venir de `example.com`, alors tout email de `test.example.com` et/ou `example.com` devra attendre 5 minutes à partir de l'heure d'arrivée initiale de la connexion. Nous ne faisons pas attendre séparément `test.example.com` et `example.com` chacun pendant 5 minutes (notre politique de greylisting s'applique au niveau du domaine racine).

Notez que le greylisting ne s'applique pas à tout expéditeur figurant sur notre [liste blanche](#do-you-have-an-allowlist) (par exemple Meta, Amazon, Netflix, Google, Microsoft au moment de la rédaction).

### Avez-vous une liste noire {#do-you-have-a-denylist}

Oui, nous gérons notre propre liste noire que nous mettons à jour automatiquement en temps réel et manuellement en fonction des activités de spam et malveillantes détectées.

Nous récupérons également toutes les adresses IP de la liste noire UCEPROTECT Niveau 1 à <http://wget-mirrors.uceprotect.net/rbldnsd-all/dnsbl-1.uceprotect.net.gz> toutes les heures et les intégrons dans notre liste noire avec une expiration de 7 jours.

Les expéditeurs figurant dans la liste noire recevront un code d'erreur 421 (indiquant à l'expéditeur de réessayer plus tard) s'ils [ne sont pas sur la liste blanche](#do-you-have-an-allowlist).

En utilisant un code de statut 421 au lieu d'un code 554, les faux positifs potentiels peuvent être atténués en temps réel et le message peut être délivré avec succès lors de la tentative suivante.

**Cela est conçu différemment des autres services de messagerie**, où si vous êtes mis sur une liste de blocage, un échec dur et permanent se produit. Il est souvent difficile de demander aux expéditeurs de réessayer les messages (surtout pour les grandes organisations), et cette approche offre environ 5 jours à partir de la tentative initiale d'email pour que l'expéditeur, le destinataire ou nous-mêmes intervenions et résolvions le problème (en demandant la suppression de la liste noire).

Toutes les demandes de suppression de la liste noire sont surveillées en temps réel par les administrateurs (par exemple, pour que les faux positifs récurrents puissent être définitivement ajoutés à la liste blanche par les administrateurs).

Les demandes de suppression de la liste noire peuvent être faites à <https://forwardemail.net/denylist>. Les utilisateurs payants voient leurs demandes de suppression traitées instantanément, tandis que les utilisateurs non payants doivent attendre que les administrateurs traitent leur demande.

Les expéditeurs détectés comme envoyant du spam ou du contenu viral seront ajoutés à la liste noire selon la procédure suivante :

1. L'[empreinte initiale du message](#how-do-you-determine-an-email-fingerprint) est mise en greylist dès détection de spam ou de blocage par une liste noire d'un expéditeur "fiable" (par exemple `gmail.com`, `microsoft.com`, `apple.com`).
   * Si l'expéditeur était sur la liste blanche, le message est mis en greylist pendant 1 heure.
   * Si l'expéditeur n'est pas sur la liste blanche, le message est mis en greylist pendant 6 heures.
2. Nous analysons les clés de la liste noire à partir des informations de l'expéditeur et du message, et pour chacune de ces clés nous créons (si elle n'existe pas déjà) un compteur, l'incrémentons de 1, et le mettons en cache pendant 24 heures.
   * Pour les expéditeurs sur liste blanche :
     * Ajouter une clé pour l'adresse email "MAIL FROM" de l'enveloppe si elle a passé le SPF ou s'il n'y a pas de SPF, et si ce n'était pas [un nom d'utilisateur postmaster](#what-are-postmaster-addresses) ou [un nom d'utilisateur no-reply](#what-are-no-reply-addresses).
     * Si l'en-tête "From" était sur liste blanche, alors ajouter une clé pour l'adresse email de l'en-tête "From" si elle a passé le SPF ou le DKIM aligné.
     * Si l'en-tête "From" n'était pas sur liste blanche, alors ajouter une clé pour l'adresse email de l'en-tête "From" et son domaine racine analysé.
   * Pour les expéditeurs non sur liste blanche :
     * Ajouter une clé pour l'adresse email "MAIL FROM" de l'enveloppe si elle a passé le SPF.
     * Si l'en-tête "From" était sur liste blanche, alors ajouter une clé pour l'adresse email de l'en-tête "From" si elle a passé le SPF ou le DKIM aligné.
     * Si l'en-tête "From" n'était pas sur liste blanche, alors ajouter une clé pour l'adresse email de l'en-tête "From" et son domaine racine analysé.
     * Ajouter une clé pour l'adresse IP distante de l'expéditeur.
     * Ajouter une clé pour le nom d'hôte résolu du client par recherche inverse à partir de l'adresse IP de l'expéditeur (le cas échéant).
     * Ajouter une clé pour le domaine racine du nom d'hôte résolu du client (le cas échéant, et s'il diffère du nom d'hôte résolu du client).
3. Si le compteur atteint 5 pour un expéditeur et une clé non sur liste blanche, alors nous mettons la clé sur liste noire pendant 30 jours et un email est envoyé à notre équipe d'abus. Ces chiffres peuvent changer et les mises à jour seront reflétées ici au fur et à mesure que nous surveillons les abus.
4. Si le compteur atteint 10 pour un expéditeur et une clé sur liste blanche, alors nous mettons la clé sur liste noire pendant 7 jours et un email est envoyé à notre équipe d'abus. Ces chiffres peuvent changer et les mises à jour seront reflétées ici au fur et à mesure que nous surveillons les abus.
> **NOTE :** Dans un avenir proche, nous introduirons la surveillance de la réputation. La surveillance de la réputation calculera plutôt quand mettre un expéditeur sur liste noire en fonction d'un seuil en pourcentage (par opposition à un compteur rudimentaire comme indiqué ci-dessus).

### Avez-vous une limitation de débit {#do-you-have-rate-limiting}

La limitation de débit des expéditeurs se fait soit par le domaine racine extrait d'une recherche PTR inverse sur l'adresse IP de l'expéditeur – ou si cela ne donne pas de résultat, alors elle utilise simplement l'adresse IP de l'expéditeur. Notez que nous appelons cela `Expéditeur` ci-dessous.

Nos serveurs MX ont des limites quotidiennes pour le courrier entrant reçu pour le [stockage IMAP chiffré](/blog/docs/best-quantum-safe-encrypted-email-service) :

* Au lieu de limiter le débit du courrier entrant reçu sur une base d'alias individuel (par exemple `vous@votredomaine.com`) – nous limitons le débit par le nom de domaine de l'alias lui-même (par exemple `votredomaine.com`). Cela empêche les `Expéditeurs` de saturer les boîtes de réception de tous les alias de votre domaine en même temps.
* Nous avons des limites générales qui s'appliquent à tous les `Expéditeurs` sur notre service quel que soit le destinataire :
  * Les `Expéditeurs` que nous considérons comme "fiables" en tant que source de vérité (par exemple `gmail.com`, `microsoft.com`, `apple.com`) sont limités à l'envoi de 100 Go par jour.
  * Les `Expéditeurs` qui sont [sur liste blanche](#do-you-have-an-allowlist) sont limités à l'envoi de 10 Go par jour.
  * Tous les autres `Expéditeurs` sont limités à l'envoi de 1 Go et/ou 1000 messages par jour.
* Nous avons une limite spécifique par `Expéditeur` et `votredomaine.com` de 1 Go et/ou 1000 messages par jour.

Les serveurs MX limitent également les messages transférés à un ou plusieurs destinataires via la limitation de débit – mais cela ne s'applique qu'aux `Expéditeurs` qui ne sont pas sur la [liste blanche](#do-you-have-an-allowlist) :

* Nous ne permettons que jusqu'à 100 connexions par heure, par domaine racine FQDN résolu de l'`Expéditeur` (ou) adresse IP distante de l'`Expéditeur` (si aucun PTR inverse n'est disponible), et par destinataire d'enveloppe. Nous stockons la clé pour la limitation de débit sous forme de hachage cryptographique dans notre base de données Redis.

* Si vous envoyez des emails via notre système, veuillez vous assurer que vous avez un PTR inverse configuré pour toutes vos adresses IP (sinon chaque domaine racine FQDN unique ou adresse IP à partir de laquelle vous envoyez sera limité en débit).

* Notez que si vous envoyez via un système populaire tel qu'Amazon SES, vous ne serez pas limité en débit puisque (au moment de la rédaction) Amazon SES est listé dans notre liste blanche.

* Si vous envoyez depuis un domaine tel que `test.abc.123.example.com`, alors la limite de débit sera imposée sur `example.com`. De nombreux spammeurs utilisent des centaines de sous-domaines pour contourner les filtres anti-spam courants qui ne limitent le débit que par noms d'hôtes uniques au lieu de domaines racines FQDN uniques.

* Les `Expéditeurs` qui dépassent la limite de débit seront rejetés avec une erreur 421.

Nos serveurs IMAP et SMTP limitent vos alias à ne pas avoir plus de `60` connexions simultanées à la fois.

Nos serveurs MX limitent les expéditeurs [non sur liste blanche](#do-you-have-an-allowlist) à ne pas établir plus de 10 connexions simultanées (avec une expiration du cache de 3 minutes pour le compteur, ce qui reflète notre délai d'attente de socket de 3 minutes).

### Comment protégez-vous contre le backscatter {#how-do-you-protect-against-backscatter}

Les rebonds mal dirigés ou le spam de rebond (connu sous le nom de "[Backscatter](https://en.wikipedia.org/wiki/Backscatter_\(email\))") peuvent causer une mauvaise réputation aux adresses IP des expéditeurs.

Nous prenons deux mesures pour protéger contre le backscatter, détaillées dans les sections suivantes [Prévenir les rebonds des spammeurs MAIL FROM connus](#prevent-bounces-from-known-mail-from-spammers) et [Prévenir les rebonds inutiles pour protéger contre le backscatter](#prevent-unnecessary-bounces-to-protect-against-backscatter) ci-dessous.

### Prévenir les rebonds des spammeurs MAIL FROM connus {#prevent-bounces-from-known-mail-from-spammers}

Nous récupérons la liste depuis [Backscatter.org](https://www.backscatterer.org/) (alimenté par [UCEPROTECT](https://www.uceprotect.net/)) à <http://wget-mirrors.uceprotect.net/rbldnsd-all/ips.backscatterer.org.gz> toutes les heures et l'intégrons dans notre base de données Redis (nous comparons également la différence à l'avance ; au cas où des IP auraient été retirées et doivent être prises en compte).
Si le MAIL FROM est vide OU est égal (sans tenir compte de la casse) à l'une des [adresses postmaster](#what-are-postmaster-addresses) (la partie avant le @ dans un email), alors nous vérifions si l'IP de l'expéditeur correspond à une IP de cette liste.

Si l'IP de l'expéditeur est listée (et n'est pas dans notre [liste blanche](#do-you-have-an-allowlist)), alors nous envoyons une erreur 554 avec le message `The IP ${session.remoteAddress} is blocked by https://www.backscatterer.org/index.php?target=test&ip=${session.remoteAddress}`. Nous serons alertés si un expéditeur figure à la fois sur la liste Backscatterer et dans notre liste blanche afin que nous puissions résoudre le problème si nécessaire.

Les techniques décrites dans cette section respectent la recommandation "SAFE MODE" sur <https://www.backscatterer.org/?target=usage> – où nous ne vérifions l'IP de l'expéditeur que si certaines conditions ont déjà été remplies.

### Prévenir les rebonds inutiles pour se protéger contre le backscatter {#prevent-unnecessary-bounces-to-protect-against-backscatter}

Les rebonds sont des emails indiquant que le transfert d'email a complètement échoué vers le destinataire et que l'email ne sera pas renvoyé.

Une raison courante d'être listé sur la liste Backscatterer est les rebonds mal dirigés ou le spam de rebond, donc nous devons nous protéger contre cela de plusieurs façons :

1. Nous n'envoyons que lorsque des erreurs de code d'état >= 500 se produisent (lorsque les emails tentés d'être transférés ont échoué, par exemple Gmail répond avec une erreur de niveau 500).

2. Nous n'envoyons qu'une seule fois (nous utilisons une clé d'empreinte de rebond calculée et la stockons en cache pour éviter l'envoi de doublons). L'empreinte de rebond est une clé qui est l'empreinte du message combinée avec un hash de l'adresse de rebond et de son code d'erreur). Voir la section sur [l'empreinte](#how-do-you-determine-an-email-fingerprint) pour plus d'informations sur la façon dont l'empreinte du message est calculée. Les empreintes de rebond envoyées avec succès expireront après 7 jours dans notre cache Redis.

3. Nous n'envoyons que lorsque le MAIL FROM et/ou le From ne sont pas vides et ne contiennent pas (sans tenir compte de la casse) un [nom d'utilisateur postmaster](#what-are-postmaster-addresses) (la partie avant le @ dans un email).

4. Nous n'envoyons pas si le message original contenait l'un des en-têtes suivants (sans tenir compte de la casse) :

   * En-tête `auto-submitted` avec une valeur différente de `no`.
   * En-tête `x-auto-response-suppress` avec une valeur de `dr`, `autoreply`, `auto-reply`, `auto_reply`, ou `all`
   * En-tête `list-id`, `list-subscribe`, `list-unsubscribe`, `list-help`, `list-post`, `list-owner`, `list-archive`, `x-autoreply`, `x-autorespond`, ou `x-auto-respond` (quelle que soit la valeur).
   * En-tête `precedence` avec une valeur de `bulk`, `autoreply`, `auto-reply`, `auto_reply`, ou `list`.

5. Nous n'envoyons pas si l'adresse email MAIL FROM ou From se termine par `+donotreply`, `-donotreply`, `+noreply`, ou `-noreply`.

6. Nous n'envoyons pas si la partie nom d'utilisateur de l'adresse email From était `mdaemon` et qu'il y avait un en-tête `X-MDDSN-Message` sans tenir compte de la casse.

7. Nous n'envoyons pas s'il y avait un en-tête `content-type` sans tenir compte de la casse avec la valeur `multipart/report`.

### Comment déterminez-vous l'empreinte d'un email {#how-do-you-determine-an-email-fingerprint}

L'empreinte d'un email est utilisée pour déterminer l'unicité d'un email et pour empêcher la livraison de messages en double ainsi que l'envoi de [rebonds en double](#prevent-unnecessary-bounces-to-protect-against-backscatter).

L'empreinte est calculée à partir de la liste suivante :

* Nom d'hôte FQDN résolu du client ou adresse IP
* Valeur de l'en-tête `Message-ID` (le cas échéant)
* Valeur de l'en-tête `Date` (le cas échéant)
* Valeur de l'en-tête `From` (le cas échéant)
* Valeur de l'en-tête `To` (le cas échéant)
* Valeur de l'en-tête `Cc` (le cas échéant)
* Valeur de l'en-tête `Subject` (le cas échéant)
* Valeur du `Body` (le cas échéant)

### Puis-je transférer des emails vers des ports autres que le 25 (par exemple si mon FAI a bloqué le port 25) {#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25}

Oui, depuis le 5 mai 2020 nous avons ajouté cette fonctionnalité. Actuellement, la fonctionnalité est spécifique au domaine, et non à l'alias. Si vous avez besoin qu'elle soit spécifique à l'alias, veuillez nous contacter pour nous faire part de vos besoins.

<div class="alert my-3 alert-danger">
  <i class="fa fa-stop-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Protection renforcée de la vie privée :
  </strong>
  <span>
    Si vous êtes sur un plan payant (qui inclut une protection renforcée de la vie privée), veuillez vous rendre sur <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mon Compte <i class="fa fa-angle-right"></i> Domaines</a>, cliquer sur "Configuration" à côté de votre domaine, puis cliquer sur "Paramètres". Si vous souhaitez en savoir plus sur les plans payants, consultez notre page <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Tarification</a>. Sinon, vous pouvez continuer à suivre les instructions ci-dessous.
  </span>
</div>
Si vous êtes sur le plan gratuit, ajoutez simplement un nouvel enregistrement DNS <strong class="notranslate">TXT</strong> comme indiqué ci-dessous, mais changez le port de 25 au port de votre choix.

Par exemple, si je veux que tous les emails destinés à `example.com` soient transférés vers le port SMTP 1337 des destinataires alias au lieu de 25 :

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nom/Hôte/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Réponse/Valeur</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", ou vide</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email-port=1337</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Astuce :
  </strong>
    Le scénario le plus courant pour la configuration du transfert de port personnalisé est lorsque vous souhaitez transférer tous les emails destinés à example.com vers un port différent chez example.com, autre que le port standard SMTP 25. Pour configurer cela, ajoutez simplement l'enregistrement <strong class="notranslate">TXT</strong> catch-all suivant.
  <span>
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nom/Hôte/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Réponse/Valeur</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", ou vide</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=example.com</code></td>
    </tr>
  </tbody>
</table>

### Est-ce que le symbole plus + est supporté pour les alias Gmail {#does-it-support-the-plus--symbol-for-gmail-aliases}

Oui, absolument.

### Est-ce que les sous-domaines sont supportés {#does-it-support-sub-domains}

Oui, absolument. Au lieu d'utiliser "@", ".", ou vide comme nom/hôte/alias, vous utilisez simplement le nom du sous-domaine comme valeur.

Si vous voulez que `foo.example.com` transfère les emails, entrez `foo` comme valeur du nom/hôte/alias dans vos paramètres DNS (pour les enregistrements MX et <strong class="notranslate">TXT</strong>).

### Est-ce que cela transfère les en-têtes de mes emails {#does-this-forward-my-emails-headers}

Oui, absolument.

### Est-ce que c'est bien testé {#is-this-well-tested}

Oui, des tests ont été écrits avec [ava](https://github.com/avajs/ava) et il y a aussi une couverture de code.

### Est-ce que vous transmettez les messages et codes de réponse SMTP {#do-you-pass-along-smtp-response-messages-and-codes}

Oui, absolument. Par exemple, si vous envoyez un email à `hello@example.com` et qu'il est configuré pour être transféré vers `user@gmail.com`, alors le message et le code de réponse SMTP du serveur SMTP "gmail.com" seront renvoyés au lieu du serveur proxy "mx1.forwardemail.net" ou "mx2.forwardemail.net".

### Comment empêchez-vous les spammeurs et assurez-vous une bonne réputation de transfert d'email {#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation}

Voir nos sections sur [Comment fonctionne votre système de transfert d'email](#how-does-your-email-forwarding-system-work), [Comment gérez-vous les problèmes de livraison d'email](#how-do-you-handle-email-delivery-issues), et [Comment gérez-vous le blocage de vos adresses IP](#how-do-you-handle-your-ip-addresses-becoming-blocked) ci-dessus.

### Comment effectuez-vous les recherches DNS sur les noms de domaine {#how-do-you-perform-dns-lookups-on-domain-names}

Nous avons créé un projet logiciel open-source :tangerine: [Tangerine](https://github.com/forwardemail/tangerine) que nous utilisons pour les recherches DNS. Les serveurs DNS par défaut utilisés sont `1.1.1.1` et `1.0.0.1`, et les requêtes DNS passent par [DNS over HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") au niveau de la couche application.

:tangerine: [Tangerine](https://github.com/tangerine) utilise par défaut [le service DNS grand public axé sur la confidentialité de CloudFlare][cloudflare-dns].


## Compte et facturation {#account-and-billing}

### Offrez-vous une garantie de remboursement sur les plans payants {#do-you-offer-a-money-back-guarantee-on-paid-plans}

Oui ! Les remboursements automatiques ont lieu lorsque vous passez à un plan supérieur, inférieur ou annulez votre compte dans les 30 jours suivant le début de votre plan. Cela ne s'applique qu'aux nouveaux clients.
### Si je change de forfait, faites-vous un prorata et remboursez-vous la différence {#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference}

Nous ne faisons pas de prorata ni ne remboursons la différence lorsque vous changez de forfait. À la place, nous convertissons la durée restante à partir de la date d'expiration de votre forfait actuel en la durée relative la plus proche pour votre nouveau forfait (arrondie à la baisse par mois).

Notez que si vous passez à un forfait supérieur ou inférieur entre des forfaits payants dans un délai de 30 jours depuis le début de votre premier forfait payant, nous rembourserons automatiquement le montant total de votre forfait actuel.

### Puis-je utiliser ce service de redirection d’email comme serveur MX de "secours" ou "basculement" {#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server}

Non, ce n’est pas recommandé, car vous ne pouvez utiliser qu’un seul serveur d’échange de courrier à la fois. Les serveurs de secours ne sont généralement jamais réessayés en raison de mauvaises configurations de priorité et des serveurs de messagerie qui ne respectent pas la vérification de priorité MX.

### Puis-je désactiver des alias spécifiques {#can-i-disable-specific-aliases}

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Important :
  </strong>
  <span>
    Si vous êtes sur un forfait payant, vous devez alors aller dans <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mon Compte <i class="fa fa-angle-right"></i> Domaines</a> <i class="fa fa-angle-right"></i> Alias <i class="fa fa-angle-right"></i> Modifier l’Alias <i class="fa fa-angle-right"></i> Décochez la case "Actif" <i class="fa fa-angle-right"></i> Continuer.
  </span>
</div>

Oui, il suffit de modifier votre enregistrement DNS <strong class="notranslate">TXT</strong> et de préfixer l’alias avec un, deux ou trois points d’exclamation (voir ci-dessous).

Notez que vous *devez* conserver le mappage ":" car il est nécessaire si vous décidez un jour de réactiver cet alias (et il est aussi utilisé pour l’importation si vous passez à un de nos forfaits payants).

**Pour un rejet silencieux (apparaît à l’expéditeur comme si le message avait été envoyé avec succès, mais en réalité il ne va nulle part) (code d’état `250`) :** Si vous préfixez un alias avec "!" (point d’exclamation simple), il renverra un code d’état réussi `250` aux expéditeurs tentant d’envoyer à cette adresse, mais les emails eux-mêmes ne seront pas délivrés (ex. un trou noir ou `/dev/null`).

**Pour un rejet temporaire (code d’état `421`) :** Si vous préfixez un alias avec "!!" (double point d’exclamation), il renverra un code d’erreur temporaire `421` aux expéditeurs tentant d’envoyer à cette adresse, et les emails seront souvent réessayés pendant jusqu’à 5 jours avant rejet et rebond.

**Pour un rejet définitif (code d’état `550`) :** Si vous préfixez un alias avec "!!!" (triple point d’exclamation), il renverra un code d’erreur permanent `550` aux expéditeurs tentant d’envoyer à cette adresse et les emails seront rejetés et feront un rebond.

Par exemple, si je veux que tous les emails envoyés à `alias@example.com` cessent d’être redirigés vers `user@gmail.com` et soient rejetés avec rebond (ex. utiliser trois points d’exclamation) :

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nom/Hôte/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Réponse/Valeur</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", ou vide</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=!!!alias:user@gmail.com</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Astuce :
  </strong>
  <span>
    Vous pouvez aussi réécrire l’adresse du destinataire redirigé simplement en "nobody@forwardemail.net", ce qui la dirigera vers nobody comme dans l’exemple ci-dessous.
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nom/Hôte/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Réponse/Valeur</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", ou vide</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=!!!alias:nobody@forwardemail.net</code></td>
    </tr>
  </tbody>
</table>
<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Astuce :
  </strong>
  <span>
    Si vous souhaitez une sécurité accrue, vous pouvez également supprimer la partie ":user@gmail.com" (ou ":nobody@forwardemail.net"), ne laissant que "!!!alias" comme dans l'exemple ci-dessous.
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nom/Hôte/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Réponse/Valeur</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", ou vide</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=!!!alias</code></td>
    </tr>
  </tbody>
</table>

### Puis-je transférer des emails à plusieurs destinataires {#can-i-forward-emails-to-multiple-recipients}

Oui, absolument. Il suffit de spécifier plusieurs destinataires dans vos enregistrements <strong class="notranslate">TXT</strong>.

Par exemple, si je veux qu'un email envoyé à `hello@example.com` soit transféré à `user+a@gmail.com` et `user+b@gmail.com`, alors mon enregistrement <strong class="notranslate">TXT</strong> ressemblerait à ceci :

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nom/Hôte/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Réponse/Valeur</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", ou vide</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code class="cursor-initial" data-original-title="" title="">forward-email=hello:user+a@gmail.com,hello:user+b@gmail.com</code></td>
    </tr>
  </tbody>
</table>

Ou, vous pouvez les spécifier sur deux lignes séparées, comme ceci :

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nom/Hôte/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Réponse/Valeur</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", ou vide</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=hello:user+a@gmail.com</code></td>
    </tr>
    <tr>
      <td><em>"@", ".", ou vide</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=hello:user+b@gmail.com</code></td>
    </tr>
  </tbody>
</table>

C'est à vous de choisir !

### Puis-je avoir plusieurs destinataires globaux catch-all {#can-i-have-multiple-global-catch-all-recipients}

Oui, vous le pouvez. Il suffit de spécifier plusieurs destinataires globaux catch-all dans vos enregistrements <strong class="notranslate">TXT</strong>.

Par exemple, si je veux que chaque email envoyé à `*@example.com` (l'astérisque signifiant un joker alias catch-all) soit transféré à `user+a@gmail.com` et `user+b@gmail.com`, alors mon enregistrement <strong class="notranslate">TXT</strong> ressemblerait à ceci :

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nom/Hôte/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Réponse/Valeur</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", ou vide</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=user+a@gmail.com,user+b@gmail.com</code></td>
    </tr>
  </tbody>
</table>

Ou, vous pouvez les spécifier sur deux lignes séparées, comme ceci :

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nom/Hôte/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Réponse/Valeur</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", ou vide</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=user+a@gmail.com</code></td>
    </tr>
    <tr>
      <td><em>@, ".", ou vide</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=user+b@gmail.com</code></td>
    </tr>
  </tbody>
</table>
C'est à vous de décider !

### Y a-t-il une limite maximale au nombre d'adresses e-mail vers lesquelles je peux transférer par alias {#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias}

Oui, la limite par défaut est de 10. Cela ne signifie PAS que vous ne pouvez avoir que 10 alias sur votre nom de domaine. Vous pouvez avoir autant d'alias que vous le souhaitez (un nombre illimité). Cela signifie que vous ne pouvez transférer qu'un alias vers 10 adresses e-mail uniques. Vous pourriez avoir `hello:user+1@gmail.com`, `hello:user+2@gmail.com`, `hello:user+3@gmail.com`, … (de 1 à 10) – et tous les e-mails envoyés à `hello@example.com` seraient transférés vers `user+1@gmail.com`, `user+2@gmail.com`, `user+3@gmail.com`, … (de 1 à 10).

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Astuce :
  </strong>
  <span>
    Besoin de plus de 10 destinataires par alias ? Envoyez-nous un e-mail et nous serons heureux d'augmenter la limite de votre compte.
  </span>
</div>

### Puis-je transférer les e-mails de manière récursive {#can-i-recursively-forward-emails}

Oui, vous le pouvez, cependant vous devez toujours respecter la limite maximale. Si vous avez `hello:linus@example.com` et `linus:user@gmail.com`, alors les e-mails envoyés à `hello@example.com` seraient transférés à `linus@example.com` et `user@gmail.com`. Notez qu'une erreur sera générée si vous tentez de transférer les e-mails de manière récursive au-delà de la limite maximale.

### Les gens peuvent-ils désenregistrer ou enregistrer mon transfert d'e-mails sans ma permission {#can-people-unregister-or-register-my-email-forwarding-without-my-permission}

Nous utilisons la vérification des enregistrements MX et <strong class="notranslate">TXT</strong>, donc si vous ajoutez les enregistrements MX et <strong class="notranslate">TXT</strong> respectifs de ce service, alors vous êtes enregistré. Si vous les supprimez, alors vous êtes désenregistré. Vous êtes propriétaire de votre domaine et de la gestion DNS, donc si quelqu'un a accès à cela, alors c'est un problème.

### Comment est-ce gratuit {#how-is-it-free}

Forward Email offre un niveau gratuit grâce à une combinaison de développement open source, d'infrastructure efficace et de plans payants optionnels qui soutiennent le service.

Notre niveau gratuit est soutenu par :

1. **Développement Open Source** : Notre base de code est open source, permettant les contributions de la communauté et une opération transparente.

2. **Infrastructure Efficace** : Nous avons optimisé nos systèmes pour gérer le transfert d'e-mails avec des ressources minimales.

3. **Plans Premium Payants** : Les utilisateurs qui ont besoin de fonctionnalités supplémentaires comme l'envoi SMTP, la réception IMAP, ou des options de confidentialité renforcées souscrivent à nos plans payants.

4. **Limites d'Utilisation Raisonnables** : Le niveau gratuit applique des politiques d'utilisation équitables pour prévenir les abus.

> \[!NOTE]
> Nous nous engageons à garder le transfert d'e-mails basique gratuit tout en offrant des fonctionnalités premium pour les utilisateurs ayant des besoins plus avancés.

> \[!TIP]
> Si vous trouvez notre service utile, envisagez de passer à un plan payant pour soutenir le développement et la maintenance continus.

### Quelle est la taille maximale d'un e-mail {#what-is-the-max-email-size-limit}

Nous appliquons par défaut une limite de taille de 50 Mo, ce qui inclut le contenu, les en-têtes et les pièces jointes. Notez que des services comme Gmail et Outlook autorisent seulement une limite de 25 Mo, et si vous dépassez cette limite en envoyant à des adresses chez ces fournisseurs, vous recevrez un message d'erreur.

Une erreur avec le code de réponse approprié est renvoyée si la limite de taille du fichier est dépassée.

### Stockez-vous les journaux des e-mails {#do-you-store-logs-of-emails}

Non, nous n'écrivons pas sur disque ni ne stockons de journaux – à l'[exception des erreurs](#do-you-store-error-logs) et du [SMTP sortant](#do-you-support-sending-email-with-smtp) (voir notre [Politique de confidentialité](/privacy)).

Tout est fait en mémoire et [notre code source est sur GitHub](https://github.com/forwardemail).

### Stockez-vous les journaux d'erreurs {#do-you-store-error-logs}

**Oui. Vous pouvez accéder aux journaux d'erreurs sous [Mon Compte → Journaux](/my-account/logs) ou [Mon Compte → Domaines](/my-account/domains).**

Depuis février 2023, nous stockons les journaux d'erreurs pour les codes de réponse SMTP `4xx` et `5xx` pendant une période de 7 jours – qui contiennent l'erreur SMTP, l'enveloppe et les en-têtes d'e-mail (nous **ne stockons pas** le corps de l'e-mail ni les pièces jointes).
Les journaux d'erreurs vous permettent de vérifier les emails importants manquants et de réduire les faux positifs de spam pour [vos domaines](/my-account/domains). Ils sont également une excellente ressource pour déboguer les problèmes avec les [webhooks email](#do-you-support-webhooks) (puisque les journaux d'erreurs contiennent la réponse du point de terminaison webhook).

Les journaux d'erreurs pour la [limitation de débit](#do-you-have-rate-limiting) et la [liste grise](#do-you-have-a-greylist) ne sont pas accessibles car la connexion se termine prématurément (par exemple avant que les commandes `RCPT TO` et `MAIL FROM` puissent être transmises).

Consultez notre [Politique de confidentialité](/privacy) pour plus d'informations.

### Lisez-vous mes emails {#do-you-read-my-emails}

Non, absolument pas. Voir notre [Politique de confidentialité](/privacy).

De nombreux autres services de transfert d'emails stockent et pourraient potentiellement lire vos emails. Il n'y a aucune raison que les emails transférés doivent être stockés sur un disque – c'est pourquoi nous avons conçu la première solution open-source qui fait tout en mémoire.

Nous croyons que vous devez avoir un droit à la vie privée et nous le respectons strictement. Le code déployé sur le serveur est un [logiciel open-source sur GitHub](https://github.com/forwardemail) pour la transparence et pour instaurer la confiance.

### Puis-je "envoyer un mail en tant que" dans Gmail avec ceci {#can-i-send-mail-as-in-gmail-with-this}

Oui ! Depuis le 2 octobre 2018, nous avons ajouté cette fonctionnalité. Voir [Comment envoyer un mail en tant que avec Gmail](#how-to-send-mail-as-using-gmail) ci-dessus !

Vous devez également configurer l'enregistrement SPF pour Gmail dans votre configuration DNS <strong class="notranslate">TXT</strong>.

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Important :
  </strong>
  <span>
    Si vous utilisez Gmail (par exemple Envoyer un mail en tant que) ou G Suite, vous devrez ajouter <code>include:_spf.google.com</code> à votre enregistrement SPF <strong class="notranslate">TXT</strong>, par exemple :
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
  </span>
</div>

### Puis-je "envoyer un mail en tant que" dans Outlook avec ceci {#can-i-send-mail-as-in-outlook-with-this}

Oui ! Depuis le 2 octobre 2018, nous avons ajouté cette fonctionnalité. Consultez simplement ces deux liens de Microsoft ci-dessous :

* <https://support.office.com/en-us/article/add-or-remove-an-email-alias-in-outlook-com-459b1989-356d-40fa-a689-8f285b13f1f2>
* <https://support.office.com/en-us/article/send-email-from-a-different-address-in-outlook-com-ccba89cb-141c-4a36-8c56-6d16a8556d2e>

Vous devez également configurer l'enregistrement SPF pour Outlook dans votre configuration DNS <strong class="notranslate">TXT</strong>.

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Important :
  </strong>
  <span>
    Si vous utilisez Microsoft Outlook ou Live.com, vous devrez ajouter <code>include:spf.protection.outlook.com</code> à votre enregistrement SPF <strong class="notranslate">TXT</strong>, par exemple :
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:spf.protection.outlook.com -all</code>
  </span>
</div>

### Puis-je "envoyer un mail en tant que" dans Apple Mail et iCloud Mail avec ceci {#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this}

Si vous êtes abonné à iCloud+, vous pouvez utiliser un domaine personnalisé. [Notre service est également compatible avec Apple Mail](#apple-mail).

Veuillez consulter <https://support.apple.com/en-us/102540> pour plus d'informations.

### Puis-je transférer un nombre illimité d'emails avec ceci {#can-i-forward-unlimited-emails-with-this}

Oui, cependant les expéditeurs "relativement inconnus" sont limités à 100 connexions par heure par nom d'hôte ou IP. Voir la section sur la [limitation de débit](#do-you-have-rate-limiting) et la [liste grise](#do-you-have-a-greylist) ci-dessus.

Par "relativement inconnus", nous entendons les expéditeurs qui n'apparaissent pas dans la [liste blanche](#do-you-have-an-allowlist).

Si cette limite est dépassée, nous envoyons un code de réponse 421 qui indique au serveur de messagerie de l'expéditeur de réessayer plus tard.

### Proposez-vous des domaines illimités pour un seul prix {#do-you-offer-unlimited-domains-for-one-price}

Oui. Quel que soit le plan que vous avez, vous ne payez qu'un seul tarif mensuel – qui couvre tous vos domaines.
### Quels modes de paiement acceptez-vous {#which-payment-methods-do-you-accept}

Forward Email accepte les modes de paiement suivants, ponctuels ou mensuels/trimestriels/annuels :

1. **Cartes de crédit/débit/virements bancaires** : Visa, Mastercard, American Express, Discover, JCB, Diners Club, etc.
2. **PayPal** : Connectez votre compte PayPal pour des paiements faciles
3. **Cryptomonnaie** : Nous acceptons les paiements via les stablecoins de Stripe sur les réseaux Ethereum, Polygon et Solana

> \[!NOTE]
> Nous stockons des informations de paiement limitées sur nos serveurs, qui incluent uniquement les identifiants de paiement et les références aux ID de transaction, client, abonnement et paiement de [Stripe](https://stripe.com/global) et [PayPal](https://www.paypal.com).

> \[!TIP]
> Pour une confidentialité maximale, envisagez d’utiliser les paiements en cryptomonnaie.

Tous les paiements sont traités de manière sécurisée via Stripe ou PayPal. Vos informations de paiement ne sont jamais stockées sur nos serveurs.


## Ressources supplémentaires {#additional-resources}

> \[!TIP]
> Nos articles ci-dessous sont régulièrement mis à jour avec de nouveaux guides, conseils et informations techniques. Revenez souvent pour les derniers contenus.

* [Études de cas & Documentation développeur](/blog/docs)
* [Ressources](/resources)
* [Guides](/guides)

[gmail-2fa]: https://myaccount.google.com/signinoptions/two-step-verification

[cloudflare-dns]: https://blog.cloudflare.com/announcing-1111/
