# Questions fréquemment posées {#frequently-asked-questions}

<img loading="lazy" src="/img/articles/faq.webp" alt="" class="rounded-lg" />

## Table des matières {#table-of-contents}

* [Démarrage rapide](#quick-start)
* [Introduction](#introduction)
  * [Qu'est-ce que le transfert d'e-mails](#what-is-forward-email)
  * [Qui utilise Forward Email](#who-uses-forward-email)
  * [Quel est l'historique de Forward Email](#what-is-forward-emails-history)
  * [Quelle est la rapidité de ce service ?](#how-fast-is-this-service)
* [Clients de messagerie](#email-clients)
  * [Thunderbird](#thunderbird)
  * [Microsoft Outlook](#microsoft-outlook)
  * [Apple Mail](#apple-mail)
  * [Appareils mobiles](#mobile-devices)
  * [Comment envoyer du courrier électronique avec Gmail](#how-to-send-mail-as-using-gmail)
  * [Quel est le guide gratuit pour envoyer des e-mails en tant que Gmail ?](#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail)
  * [Configuration avancée du routage Gmail](#advanced-gmail-routing-configuration)
  * [Configuration avancée du routage Outlook](#advanced-outlook-routing-configuration)
* [Dépannage](#troubleshooting)
  * [Pourquoi je ne reçois pas mes e-mails de test](#why-am-i-not-receiving-my-test-emails)
  * [Comment configurer mon client de messagerie pour qu'il fonctionne avec le transfert d'e-mails](#how-do-i-configure-my-email-client-to-work-with-forward-email)
  * [Pourquoi mes e-mails atterrissent-ils dans les spams et les courriers indésirables et comment puis-je vérifier la réputation de mon domaine ?](#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation)
  * [Que dois-je faire si je reçois des courriers indésirables](#what-should-i-do-if-i-receive-spam-emails)
  * [Pourquoi mes e-mails de test qui m'ont été envoyés dans Gmail apparaissent-ils comme « suspects » ?](#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious)
  * [Puis-je supprimer le point net via forwardemail dans Gmail ?](#can-i-remove-the-via-forwardemail-dot-net-in-gmail)
* [Gestion des données](#data-management)
  * [Où sont situés vos serveurs](#where-are-your-servers-located)
  * [Comment exporter et sauvegarder ma boîte aux lettres](#how-do-i-export-and-backup-my-mailbox)
  * [Comment importer et migrer ma boîte aux lettres existante](#how-do-i-import-and-migrate-my-existing-mailbox)
  * [Soutenez-vous l'auto-hébergement ?](#do-you-support-self-hosting)
* [Configuration de la messagerie électronique](#email-configuration)
  * [Comment démarrer et configurer le transfert d'e-mails](#how-do-i-get-started-and-set-up-email-forwarding)
  * [Puis-je utiliser plusieurs échanges et serveurs MX pour le transfert avancé ?](#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding)
  * [Comment configurer un répondeur automatique en cas d'absence du bureau ?](#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder)
  * [Comment configurer SPF pour le transfert d'e-mails](#how-do-i-set-up-spf-for-forward-email)
  * [Comment configurer DKIM pour le transfert d'e-mails](#how-do-i-set-up-dkim-for-forward-email)
  * [Comment configurer DMARC pour le transfert d'e-mails](#how-do-i-set-up-dmarc-for-forward-email)
  * [Comment connecter et configurer mes contacts](#how-do-i-connect-and-configure-my-contacts)
  * [Comment connecter et configurer mes calendriers](#how-do-i-connect-and-configure-my-calendars)
  * [Comment ajouter plus de calendriers et gérer les calendriers existants](#how-do-i-add-more-calendars-and-manage-existing-calendars)
  * [Comment configurer SRS pour le transfert d'e-mails](#how-do-i-set-up-srs-for-forward-email)
  * [Comment configurer MTA-STS pour le transfert d'e-mails](#how-do-i-set-up-mta-sts-for-forward-email)
  * [Comment ajouter une photo de profil à mon adresse e-mail](#how-do-i-add-a-profile-picture-to-my-email-address)
* [Fonctionnalités avancées](#advanced-features)
  * [Soutenez-vous les newsletters ou les listes de diffusion pour les e-mails liés au marketing ?](#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email)
  * [Prenez-vous en charge l'envoi d'e-mails avec l'API ?](#do-you-support-sending-email-with-api)
  * [Prenez-vous en charge la réception d'e-mails avec IMAP ?](#do-you-support-receiving-email-with-imap)
  * [Supportez-vous POP3](#do-you-support-pop3)
  * [Prenez-vous en charge les calendriers (CalDAV)](#do-you-support-calendars-caldav)
  * [Prenez-vous en charge les contacts (CardDAV)](#do-you-support-contacts-carddav)
  * [Prenez-vous en charge l'envoi d'e-mails avec SMTP ?](#do-you-support-sending-email-with-smtp)
  * [Prenez-vous en charge OpenPGP/MIME, le chiffrement de bout en bout (« E2EE ») et Web Key Directory (« WKD »)](#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd)
  * [Soutenez-vous MTA-STS](#do-you-support-mta-sts)
  * [Prenez-vous en charge les clés d'accès et WebAuthn ?](#do-you-support-passkeys-and-webauthn)
  * [Soutenez-vous les meilleures pratiques en matière de courrier électronique ?](#do-you-support-email-best-practices)
  * [Supportez-vous les webhooks de rebond ?](#do-you-support-bounce-webhooks)
  * [Supportez-vous les webhooks ?](#do-you-support-webhooks)
  * [Supportez-vous les expressions régulières ou regex](#do-you-support-regular-expressions-or-regex)
  * [Quelles sont vos limites SMTP sortantes](#what-are-your-outbound-smtp-limits)
  * [Ai-je besoin d'une approbation pour activer SMTP ?](#do-i-need-approval-to-enable-smtp)
  * [Quels sont les paramètres de configuration de votre serveur SMTP](#what-are-your-smtp-server-configuration-settings)
  * [Quels sont les paramètres de configuration de votre serveur IMAP](#what-are-your-imap-server-configuration-settings)
  * [Quels sont les paramètres de configuration de votre serveur POP3](#what-are-your-pop3-server-configuration-settings)
  * [Configuration du relais SMTP de Postfix](#postfix-smtp-relay-configuration)
* [Sécurité](#security)
  * [Techniques avancées de renforcement des serveurs](#advanced-server-hardening-techniques)
  * [Avez-vous des certifications SOC 2 ou ISO 27001](#do-you-have-soc-2-or-iso-27001-certifications)
  * [Utilisez-vous le cryptage TLS pour le transfert des e-mails ?](#do-you-use-tls-encryption-for-email-forwarding)
  * [Conservez-vous les en-têtes d'authentification des e-mails ?](#do-you-preserve-email-authentication-headers)
  * [Conservez-vous les en-têtes d'e-mails originaux et empêchez-vous l'usurpation d'identité ?](#do-you-preserve-original-email-headers-and-prevent-spoofing)
  * [Comment vous protéger contre le spam et les abus](#how-do-you-protect-against-spam-and-abuse)
  * [Stockez-vous le contenu des e-mails sur le disque ?](#do-you-store-email-content-on-disk)
  * [Le contenu des e-mails peut-il être exposé lors de pannes du système ?](#can-email-content-be-exposed-during-system-crashes)
  * [Qui a accès à votre infrastructure de messagerie](#who-has-access-to-your-email-infrastructure)
  * [Quels fournisseurs d'infrastructure utilisez-vous ?](#what-infrastructure-providers-do-you-use)
  * [Proposez-vous un accord de traitement des données (DPA)](#do-you-offer-a-data-processing-agreement-dpa)
  * [Comment gérez-vous les notifications de violation de données](#how-do-you-handle-data-breach-notifications)
  * [Proposez-vous un environnement de test](#do-you-offer-a-test-environment)
  * [Fournissez-vous des outils de surveillance et d'alerte](#do-you-provide-monitoring-and-alerting-tools)
  * [Comment garantir une haute disponibilité](#how-do-you-ensure-high-availability)
  * [Êtes-vous conforme à l'article 889 de la loi sur l'autorisation de la défense nationale (NDAA) ?](#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa)
* [Système et détails techniques](#system-and-technical-details)
  * [Stockez-vous des e-mails et leur contenu](#do-you-store-emails-and-their-contents)
  * [Comment fonctionne votre système de transfert d'e-mails](#how-does-your-email-forwarding-system-work)
  * [Comment traiter un e-mail pour le transférer](#how-do-you-process-an-email-for-forwarding)
  * [Comment gérez-vous les problèmes de livraison des e-mails ?](#how-do-you-handle-email-delivery-issues)
  * [Comment gérez-vous le blocage de vos adresses IP ?](#how-do-you-handle-your-ip-addresses-becoming-blocked)
  * [Quelles sont les adresses des maîtres de poste](#what-are-postmaster-addresses)
  * [Que sont les adresses sans réponse ?](#what-are-no-reply-addresses)
  * [Quelles sont les adresses IP de votre serveur](#what-are-your-servers-ip-addresses)
  * [Avez-vous une liste d'autorisation](#do-you-have-an-allowlist)
  * [Quelles extensions de noms de domaine sont autorisées par défaut](#what-domain-name-extensions-are-allowlisted-by-default)
  * [Quels sont vos critères de liste d'autorisation ?](#what-is-your-allowlist-criteria)
  * [Quelles extensions de noms de domaine peuvent être utilisées gratuitement](#what-domain-name-extensions-can-be-used-for-free)
  * [Avez-vous une liste grise](#do-you-have-a-greylist)
  * [Avez-vous une liste de refus](#do-you-have-a-denylist)
  * [Avez-vous une limitation de débit](#do-you-have-rate-limiting)
  * [Comment se protéger contre la rétrodiffusion](#how-do-you-protect-against-backscatter)
  * [Empêcher les rebonds des spammeurs MAIL FROM connus](#prevent-bounces-from-known-mail-from-spammers)
  * [Empêcher les rebonds inutiles pour se protéger contre la rétrodiffusion](#prevent-unnecessary-bounces-to-protect-against-backscatter)
  * [Comment déterminer l'empreinte digitale d'un e-mail](#how-do-you-determine-an-email-fingerprint)
  * [Puis-je transférer des e-mails vers des ports autres que 25 (par exemple, si mon FAI a bloqué le port 25)](#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25)
  * [Prend-il en charge le symbole plus + pour les alias Gmail ?](#does-it-support-the-plus--symbol-for-gmail-aliases)
  * [Prend-il en charge les sous-domaines ?](#does-it-support-sub-domains)
  * [Est-ce que cela transfère les en-têtes de mon e-mail ?](#does-this-forward-my-emails-headers)
  * [Est-ce que c'est bien testé?](#is-this-well-tested)
  * [Transmettez-vous des messages et des codes de réponse SMTP](#do-you-pass-along-smtp-response-messages-and-codes)
  * [Comment prévenir les spammeurs et garantir une bonne réputation en matière de transfert d'e-mails](#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation)
  * [Comment effectuer des recherches DNS sur les noms de domaine](#how-do-you-perform-dns-lookups-on-domain-names)
* [Compte et facturation](#account-and-billing)
  * [Offrez-vous une garantie de remboursement sur les forfaits payants ?](#do-you-offer-a-money-back-guarantee-on-paid-plans)
  * [Si je change de forfait, calculez-vous au prorata et remboursez-vous la différence ?](#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference)
  * [Puis-je simplement utiliser ce service de transfert d'e-mails comme serveur MX « de secours » ou « de secours »](#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server)
  * [Puis-je désactiver des alias spécifiques](#can-i-disable-specific-aliases)
  * [Puis-je transférer des e-mails à plusieurs destinataires](#can-i-forward-emails-to-multiple-recipients)
  * [Puis-je avoir plusieurs destinataires globaux fourre-tout ?](#can-i-have-multiple-global-catch-all-recipients)
  * [Existe-t-il une limite maximale au nombre d'adresses e-mail vers lesquelles je peux transférer par alias ?](#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias)
  * [Puis-je transférer des e-mails de manière récursive ?](#can-i-recursively-forward-emails)
  * [Les gens peuvent-ils annuler ou enregistrer ma redirection d'e-mail sans ma permission ?](#can-people-unregister-or-register-my-email-forwarding-without-my-permission)
  * [Comment est-ce gratuit ?](#how-is-it-free)
  * [Quelle est la taille maximale des e-mails ?](#what-is-the-max-email-size-limit)
  * [Stockez-vous des journaux d'e-mails ?](#do-you-store-logs-of-emails)
  * [Stockez-vous les journaux d'erreurs](#do-you-store-error-logs)
  * [Est-ce que tu lis mes emails?](#do-you-read-my-emails)
  * [Puis-je « envoyer du courrier en tant que » dans Gmail avec cela ?](#can-i-send-mail-as-in-gmail-with-this)
  * [Puis-je « envoyer du courrier en tant que » dans Outlook avec cela ?](#can-i-send-mail-as-in-outlook-with-this)
  * [Puis-je « envoyer du courrier en tant que » dans Apple Mail et iCloud Mail avec cela](#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this)
  * [Puis-je transférer des e-mails illimités avec cela ?](#can-i-forward-unlimited-emails-with-this)
  * [Proposez-vous des domaines illimités pour un prix unique ?](#do-you-offer-unlimited-domains-for-one-price)
  * [Quels modes de paiement acceptez-vous](#which-payment-methods-do-you-accept)
* [Ressources supplémentaires](#additional-resources)

## Démarrage rapide {#quick-start}

Pour commencer à utiliser le transfert d'e-mails :

1. **Créez un compte** sur [forwardemail.net/register](https://forwardemail.net/register)

2. **Ajoutez et vérifiez votre domaine** sous [Mon compte → Domaines](/my-account/domains)

3. **Ajoutez et configurez des alias/boîtes aux lettres de messagerie** sous [Mon compte → Domaines](/my-account/domains) → Alias

4. **Testez votre configuration** en envoyant un e-mail à l'un de vos nouveaux alias

> \[!TIP]
> Les modifications DNS peuvent prendre jusqu'à 24 à 48 heures pour se propager à l'échelle mondiale, même si elles prennent souvent effet beaucoup plus tôt.

> \[!IMPORTANT]
> Pour une meilleure délivrabilité, nous vous recommandons de configurer les enregistrements [SPF](#how-do-i-set-up-spf-for-forward-email), [DKIM](#how-do-i-set-up-dkim-for-forward-email) et [DMARC](#how-do-i-set-up-dmarc-for-forward-email).

## Présentation {#introduction}

### Qu'est-ce que le transfert d'e-mails ? {#what-is-forward-email}

> \[!NOTE]
> Forward Email est idéal pour les particuliers, les petites entreprises et les développeurs qui souhaitent des adresses e-mail professionnelles sans les coûts et la maintenance d'une solution d'hébergement de messagerie complète.

Forward Email est un **fournisseur de services de messagerie complet** et un **fournisseur d'hébergement de messagerie pour les noms de domaine personnalisés**.

C'est le seul service gratuit et open source, et il vous permet d'utiliser des adresses e-mail de domaine personnalisées sans la complexité de la configuration et de la maintenance de votre propre serveur de messagerie.

Notre service transfère les e-mails envoyés à votre domaine personnalisé vers votre compte de messagerie existant – et vous pouvez même nous utiliser comme fournisseur d'hébergement de messagerie dédié.

Principales fonctionnalités de Forward Email :

* **Adresse e-mail personnalisée** : Utilisez des adresses e-mail professionnelles avec votre propre nom de domaine
* **Offre gratuite** : Transfert d'e-mails de base gratuit
* **Confidentialité renforcée** : Nous ne lisons pas vos e-mails et ne vendons pas vos données
* **Open Source** : L'intégralité de notre code source est disponible sur GitHub
* **Prise en charge SMTP, IMAP et POP3** : Fonctionnalités complètes d'envoi et de réception d'e-mails
* **Chiffrement de bout en bout** : Prise en charge d'OpenPGP/MIME
* **Alias fourre-tout personnalisés** : Créez un nombre illimité d'alias e-mails

Vous pouvez nous comparer à plus de 56 autres fournisseurs de services de messagerie sur [notre page de comparaison des e-mails](/blog/best-email-service).

> \[!TIP]
> Pour en savoir plus sur le transfert d'e-mails, consultez notre article gratuit [Livre blanc technique](/technical-whitepaper.pdf)

### Qui utilise le transfert d'e-mails ? {#who-uses-forward-email}

Nous fournissons un service d'hébergement et de transfert de courrier électronique à plus de 500 000 domaines et à ces utilisateurs notables :

| Client | Étude de cas |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Académie navale américaine | [:page_facing_up: Case Study](/blog/docs/federal-government-email-service-section-889-compliant) |
| Canonique | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| Jeux Netflix |  |
| La Fondation Linux | [:page_facing_up: Case Study](/blog/docs/linux-foundation-email-enterprise-case-study) |
| La Fondation PHP |  |
| Fox News Radio |  |
| Ventes publicitaires Disney |  |
| jQuery | [:page_facing_up: Case Study](/blog/docs/linux-foundation-email-enterprise-case-study) |
| LineageOS |  |
| Ubuntu | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| Gratuit | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| Lubuntu | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| L'Université de Cambridge | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| L'Université du Maryland | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| L'Université de Washington | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| Université Tufts | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| Collège Swarthmore | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| Gouvernement d'Australie du Sud |  |
| Gouvernement de la République dominicaine |  |
| Fly<span>.</span>io |  |
| Hôtels RCD |  |
| Isaac Z. Schlueter (npm) | [:page_facing_up: Case Study](/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem) |
| David Heinemeier Hansson (Ruby on Rails) |  |

### Quel est l'historique des e-mails transférés ? {#what-is-forward-emails-history}

Vous pouvez en savoir plus sur le transfert d'e-mails sur [notre page À propos](/about).

### Quelle est la vitesse de ce service ? {#how-fast-is-this-service}

> \[!NOTE]
> Notre système est conçu pour être rapide et fiable, avec plusieurs serveurs redondants pour garantir la livraison rapide de vos e-mails.

Forward Email délivre les messages avec un délai minimal, généralement quelques secondes après réception.

Indicateurs de performance :

* **Délai moyen de livraison** : Moins de 5 à 10 secondes entre la réception et la transmission ([consultez notre page de surveillance du temps de réception des messages « TTI »](/tti))
* **Disponibilité** : Plus de 99,9 % de disponibilité du service
* **Infrastructure mondiale** : Serveurs stratégiquement situés pour un routage optimal
* **Évolution automatique** : Notre système s'adapte aux pics d'activité des e-mails

Nous opérons en temps réel, contrairement à d’autres fournisseurs qui s’appuient sur des files d’attente retardées.

Nous n'écrivons pas sur le disque ni ne stockons les journaux – avec [exception d'erreurs](#do-you-store-error-logs) et [SMTP sortant](#do-you-support-sending-email-with-smtp) (voir notre [politique de confidentialité](/privacy)).

Tout est fait en mémoire et [notre code source est sur GitHub](https://github.com/forwardemail).

## Clients de messagerie {#email-clients}

### Thunderbird {#thunderbird}

1. Créez un nouvel alias et générez un mot de passe dans votre tableau de bord de transfert.
2. Ouvrez Thunderbird et accédez à Édition → Paramètres du compte → Actions du compte → Ajouter un compte de messagerie.
3. Saisissez votre nom, votre adresse e-mail de transfert et votre mot de passe.
4. Cliquez sur **Configurer manuellement** et saisissez :
* Entrant : IMAP, `imap.forwardemail.net`, port 993, SSL/TLS
* Sortant : SMTP, `smtp.forwardemail.net`, port 587, STARTTLS
5. Cliquez sur **Terminé**.

### Microsoft Outlook {#microsoft-outlook}

1. Créez un nouvel alias et générez un mot de passe dans votre tableau de bord de transfert.
2. Accédez à **Fichier → Ajouter un compte**.
3. Saisissez votre adresse e-mail de transfert et cliquez sur **Connecter**.
4. Choisissez **Options avancées** et sélectionnez **Configurer mon compte manuellement**.
5. Sélectionnez **IMAP** et saisissez :
* Entrant : `imap.forwardemail.net`, port 993, SSL
* Sortant : `smtp.forwardemail.net`, port 587, TLS
* Nom d'utilisateur : votre adresse e-mail complète
* Mot de passe : votre mot de passe généré
6. Cliquez sur **Connecter**.

### Apple Mail {#apple-mail}

1. Créez un nouvel alias et générez un mot de passe dans votre tableau de bord de transfert d'e-mails.
2. Accédez à **Mail → Préférences → Comptes → +**.
3. Sélectionnez **Autre compte de messagerie**.
4. Saisissez votre nom, votre adresse e-mail de transfert et votre mot de passe.
5. Pour les paramètres du serveur, saisissez :
* Entrant : `imap.forwardemail.net`
* Sortant : `smtp.forwardemail.net`
* Nom d'utilisateur : votre adresse e-mail complète
* Mot de passe : votre mot de passe généré.
6. Cliquez sur **Connexion**.

### Appareils mobiles {#mobile-devices}

Pour iOS :

1. Accédez à **Paramètres → Mail → Comptes → Ajouter un compte → Autre**
2. Appuyez sur **Ajouter un compte de messagerie** et saisissez vos informations.
3. Pour les paramètres du serveur, utilisez les mêmes paramètres IMAP et SMTP que ci-dessus.

Pour Android :

1. Accédez à **Paramètres → Comptes → Ajouter un compte → Personnel (IMAP)**
2. Saisissez votre adresse e-mail de transfert et votre mot de passe.
3. Pour les paramètres du serveur, utilisez les mêmes paramètres IMAP et SMTP que ci-dessus.

### Comment envoyer des e-mails avec Gmail {#how-to-send-mail-as-using-gmail}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Temps d'installation estimé :</strong>
<span>Moins de 10 minutes</span>
</div>

<div class="alert mb-3 alert-success">
<i class="fa fa-bullhorn font-weight-bold"></i>
<strong class="font-weight-bold">
Premiers pas :
</strong>
<span>
Si vous avez suivi les instructions ci-dessus sous <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">Comment démarrer et configurer le transfert d'e-mails</a>, vous pouvez poursuivre votre lecture ci-dessous.
</span>
</div>

<div id="envoyer-un-courrier-en-tant-que-contenu">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Important :
</strong>
<span>
Veuillez vous assurer d'avoir lu nos <a href="/terms" class="alert-link" target="_blank">Conditions d'utilisation</a>, notre <a href="/privacy" class="alert-link" target="_blank">Politique de confidentialité</a> et nos <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Limites SMTP sortantes</a> ; votre utilisation vaut reconnaissance et acceptation.
</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Important :
</strong>
<span>
Si vous êtes développeur, consultez notre <a class="alert-link" href="/email-api#outbound-emails" target="_blank">documentation de l'API de messagerie</a>.
</span>
</div>

1. Accédez à <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Mon compte <i class="fa fa-angle-right"></i> Domaines</a> <i class="fa fa-angle-right"></i> Paramètres <i class="fa fa-angle-right"></i> Configuration SMTP sortante et suivez les instructions de configuration

2. Créez un nouvel alias pour votre domaine sous <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mon compte <i class="fa fa-angle-right"></i> Domaines</a> <i class="fa fa-angle-right"></i> Alias (par exemple <code><hello@example.com></code>)

3. Cliquez sur <strong class="text-success"><i class="fa fa-key"></i> Générer un mot de passe</strong> à côté du nouvel alias. Copiez-le dans votre presse-papiers et conservez-le précieusement.

4. Accédez à [Gmail](https://gmail.com) et sous [Paramètres <i class="fa fa-angle-right"></i> Comptes et importation <i class="fa fa-angle-right"></i> Envoyer le courrier en tant que](https://mail.google.com/mail/u/0/#settings/accounts), cliquez sur « Ajouter une autre adresse e-mail »

5. Lorsque vous êtes invité à saisir « Nom », saisissez le nom sous lequel vous souhaitez que votre e-mail soit affiché « De » (par exemple, « Linus Torvalds »).

6. Lorsque vous êtes invité à saisir « Adresse e-mail », saisissez l'adresse e-mail complète d'un alias que vous avez créé sous <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mon compte <i class="fa fa-angle-right"></i> Domaines</a> <i class="fa fa-angle-right"></i> Alias (par exemple, <code><hello@example.com></code>)

7. Décochez « Traiter comme un alias »

8. Cliquez sur « Étape suivante » pour continuer

9. Lorsque vous êtes invité à saisir « Serveur SMTP », saisissez <code>smtp.forwardemail.net</code> et laissez le port sur <code>587</code>

10. Lorsque vous êtes invité à saisir « Nom d'utilisateur », saisissez l'adresse e-mail complète d'un alias que vous avez créé sous <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mon compte <i class="fa fa-angle-right"></i> Domaines</a> <i class="fa fa-angle-right"></i> Alias (par exemple, <code><hello@example.com></code>)

11. Lorsque vous êtes invité à saisir un « Mot de passe », collez le mot de passe de <strong class="text-success"><i class="fa fa-key"></i> Générer un mot de passe</strong> à l'étape 3 ci-dessus

12. Laissez le bouton radio coché pour « Connexion sécurisée via TLS »

13. Cliquez sur « Ajouter un compte » pour continuer

14. Ouvrez un nouvel onglet sur [Gmail](https://gmail.com) et attendez que votre e-mail de vérification arrive (vous recevrez un code de vérification qui confirme que vous êtes le propriétaire de l'adresse e-mail avec laquelle vous essayez d'« envoyer un e-mail »)

15. Une fois arrivé, copiez et collez le code de vérification à l'invite que vous avez reçue à l'étape précédente

16. Une fois cette étape terminée, revenez à l'e-mail et cliquez sur le lien « Confirmer la demande ». Vous devrez probablement répéter cette étape et la précédente pour que l'e-mail soit correctement configuré.

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Félicitations !
</strong>
<span>
Vous avez terminé toutes les étapes avec succès.
</span>
</div>
</div>

</div>

### Quel est le guide gratuit hérité pour envoyer des e-mails en tant que à l'aide de Gmail ? {#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail}

<div class="alert my-3 alert-danger"><i class="fa fa-stop-circle font-weight-bold"></i> <strong class="font-weight-bold">Important :</strong> Ce guide gratuit est obsolète depuis mai 2023, car <a class="alert-link" href="/faq#do-you-support-sending-email-with-smtp">we prend désormais en charge le SMTP sortant</a>. Si vous utilisez le guide ci-dessous, <a class="alert-link" href="/faq#can-i-remove-the-via-forwardemail-dot-net-in-gmail">this affichera « <span class="notranslate text-danger font-weight-bold">via forwardemail dot net</span> » dans Gmail.</a></div>

<div class="alert mb-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Temps d'installation estimé :</strong>
<span>Moins de 10 minutes</span>
</div>

<div class="alert mb-3 alert-success">
<i class="fa fa-bullhorn font-weight-bold"></i>
<strong class="font-weight-bold">
Premiers pas :
</strong>
<span>
Si vous avez suivi les instructions ci-dessus sous <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">Comment démarrer et configurer le transfert d'e-mails</a>, vous pouvez poursuivre votre lecture ci-dessous.
</span>
</div>

<div class="mx-auto lazyframe lazyframe-bordered border border-themed mb-3" data-vendor="youtube_nocookie" title="Comment envoyer des e-mails avec Gmail" data-src="https://www.youtube-nocookie.com/embed/MEheS8gM4Xs?autoplay=0"></div>

<div id="legacy-free-guide">

1. L'authentification à deux facteurs de Gmail doit être activée pour que cela fonctionne. Si ce n'est pas le cas, rendez-vous sur <https://www.google.com/landing/2step/>.

2. Une fois l'authentification à deux facteurs activée (ou si vous l'aviez déjà activée), visitez <https://myaccount.google.com/apppasswords>.

3. Lorsque vous êtes invité à sélectionner l'application et l'appareil pour lesquels vous souhaitez générer le mot de passe d'application :
* Sélectionnez « Mail » dans le menu déroulant « Sélectionner l'application ».
* Sélectionnez « Autre » dans le menu déroulant « Sélectionner l'appareil ».
* Lorsque vous êtes invité à saisir du texte, saisissez l'adresse e-mail de votre domaine personnalisé à partir duquel vous souhaitez transférer les messages (par exemple, <code><hello@example.com></code> ; cela vous permettra de suivre l'utilisation de ce service pour plusieurs comptes).

4. Copiez le mot de passe généré automatiquement dans votre presse-papiers.
<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Important :
</strong>
<span>
Si vous utilisez G Suite, accédez à votre panneau d'administration <a class="alert-link" href="https://admin.google.com/AdminHome#ServiceSettings/service=email&subtab=filters" rel="noopener noreferrer" target="_blank">Applications <i class="fa fa-angle-right"></i> G Suite <i class="fa fa-angle-right"></i> Paramètres de Gmail <i class="fa fa-angle-right"></i> Paramètres</a> et cochez la case « Autoriser les utilisateurs à envoyer des e-mails via un serveur SMTP externe… ». L'activation de cette modification prendra un certain temps ; veuillez patienter quelques minutes.
</span>
</div>

5. Accédez à [Gmail](https://gmail.com) et sous [Paramètres <i class="fa fa-angle-right"></i> Comptes et importation <i class="fa fa-angle-right"></i> Envoyer le courrier en tant que](https://mail.google.com/mail/u/0/#settings/accounts), cliquez sur « Ajouter une autre adresse e-mail »

6. Lorsque vous êtes invité à saisir « Nom », saisissez le nom sous lequel vous souhaitez que votre e-mail soit affiché « De » (par exemple, « Linus Torvalds »)

7. Lorsque vous êtes invité à saisir « Adresse e-mail », saisissez l'adresse e-mail avec le domaine personnalisé que vous avez utilisé ci-dessus (par exemple, <code><hello@example.com></code>)

8. Décochez « Traiter comme un alias »

9. Cliquez sur « Étape suivante » pour continuer

10. Lorsque vous êtes invité à saisir « Serveur SMTP », saisissez <code>smtp.gmail.com</code> et laissez le port sur <code>587</code>

11. Lorsque vous êtes invité à saisir votre nom d'utilisateur, saisissez la partie de votre adresse Gmail sans la partie <span>gmail.com</span> (par exemple, simplement « utilisateur » si mon adresse e-mail est <span><utilisateur@gmail.com></span>).
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Important :
</strong>
<span>
Si la partie « Nom d'utilisateur » est remplie automatiquement, vous devrez la remplacer par la partie nom d'utilisateur de votre adresse Gmail.
</span>
</div>

12. Lorsque vous êtes invité à saisir un « Mot de passe », collez depuis votre presse-papiers le mot de passe que vous avez généré à l'étape 2 ci-dessus.

13. Laissez le bouton radio coché pour « Connexion sécurisée via TLS »

14. Cliquez sur « Ajouter un compte » pour continuer

15. Ouvrez un nouvel onglet sur [Gmail](https://gmail.com) et attendez que votre e-mail de vérification arrive (vous recevrez un code de vérification qui confirme que vous êtes le propriétaire de l'adresse e-mail avec laquelle vous essayez d'« envoyer un e-mail »)

16. Une fois arrivé, copiez et collez le code de vérification à l'invite que vous avez reçue à l'étape précédente

17. Une fois cette étape terminée, revenez à l'e-mail et cliquez sur le lien « Confirmer la demande ». Vous devrez probablement répéter cette étape et la précédente pour que l'e-mail soit correctement configuré.

</div>

### Configuration avancée du routage Gmail {#advanced-gmail-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Temps d'installation estimé :</strong>
<span>15 à 30 minutes</span>
</div>

Si vous souhaitez configurer un routage avancé dans Gmail afin que les alias qui ne correspondent pas à une boîte aux lettres soient transférés vers les échanges de courrier de Forward Email, procédez comme suit :

1. Connectez-vous à votre console d'administration Google à l'adresse [admin.google.com](https://admin.google.com)
2. Accédez à Applications → Google Workspace → Gmail → Routage
3. Cliquez sur Ajouter un routage et configurez les paramètres suivants :

**Paramètres de destinataire unique :**

* Sélectionnez « Modifier le destinataire de l'enveloppe » et saisissez votre adresse Gmail principale.
* Cochez « Ajouter l'en-tête X-Gm-Original-To avec le destinataire d'origine ».

**Modèles de destinataires d'enveloppes :**

* Ajouter un modèle qui correspond à toutes les boîtes aux lettres inexistantes (par exemple, `.*@yourdomain.com`)

**Paramètres du serveur de messagerie :**

* Sélectionnez « Route vers l'hôte » et saisissez `mx1.forwardemail.net` comme serveur principal.
* Ajoutez `mx2.forwardemail.net` comme serveur de secours.
* Définissez le port sur 25.
* Sélectionnez « Exiger TLS » pour la sécurité.

4. Cliquez sur **Enregistrer** pour créer l'itinéraire

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Important :
</strong>
<span>
Cette configuration ne fonctionne que pour les comptes Google Workspace avec des domaines personnalisés, et non pour les comptes Gmail classiques.
</span>
</div>

### Configuration avancée du routage Outlook {#advanced-outlook-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Temps d'installation estimé :</strong>
<span>15 à 30 minutes</span>
</div>

Pour les utilisateurs de Microsoft 365 (anciennement Office 365) qui souhaitent configurer un routage avancé afin que les alias qui ne correspondent pas à une boîte aux lettres soient transférés vers les échanges de courrier de Forward Email :

1. Connectez-vous au Centre d'administration Microsoft 365 à l'adresse [admin.microsoft.com](https://admin.microsoft.com)
2. Accédez à **Exchange → Flux de messagerie → Règles**
3. Cliquez sur **Ajouter une règle** et sélectionnez **Créer une règle**
4. Nommez votre règle (par exemple, « Transférer les boîtes aux lettres inexistantes vers Transférer les e-mails »)
5. Sous **Appliquer cette règle si**, sélectionnez :
* « L'adresse du destinataire correspond à… »
* Saisissez un modèle correspondant à toutes les adresses de votre domaine (par exemple, `*@yourdomain.com`)
6. Sous **Procéder comme suit**, sélectionnez :
* « Rediriger le message vers… »
* Choisissez « Le serveur de messagerie suivant »
* Saisissez `mx1.forwardemail.net` et le port 25
* Ajoutez `mx2.forwardemail.net` comme serveur de secours
7. Sous **Sauf si**, sélectionnez :
* « Le destinataire est… »
* Ajoutez toutes vos boîtes aux lettres existantes qui ne doivent pas être transférées
8. Définissez la priorité de la règle pour garantir son exécution Après d'autres règles de flux de messagerie
9. Cliquez sur **Enregistrer** pour activer la règle.

## Dépannage de {#troubleshooting}

### Pourquoi je ne reçois pas mes e-mails de test ? {#why-am-i-not-receiving-my-test-emails}

Si vous vous envoyez un e-mail de test, il se peut qu'il n'apparaisse pas dans votre boîte de réception car il contient le même en-tête « Message-ID ».

Il s'agit d'un problème largement connu, qui affecte également des services tels que Gmail. <a href="https://support.google.com/a/answer/1703601">Here est la réponse officielle de Gmail concernant ce problème</a>.

Si les problèmes persistent, il s'agit probablement d'un problème de propagation DNS. Attendez un peu avant de réessayer (ou essayez de définir une valeur TTL inférieure pour vos enregistrements <strong class="notranslate">TXT</strong>).

**Vous rencontrez toujours des problèmes ?** Veuillez <a href="/help">nous contacter</a> afin que nous puissions vous aider à étudier le problème et à trouver une solution rapide.

### Comment configurer mon client de messagerie pour qu'il fonctionne avec le transfert d'e-mails {#how-do-i-configure-my-email-client-to-work-with-forward-email}

<div class="mb-3">
Notre service est compatible avec les clients de messagerie les plus courants, tels que :
<ul class="ml-1 h4 d-inline list-inline mb-0 pl-0">
<li class="list-inline-item"><a href="/blog/open-source/apple-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Apple®</a></li>
<li class="list-inline-item"><a href="/blog/open-source/windows-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Windows®</a></li>
<li class="list-inline-item"><a href="/blog/open-source/android-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-android"></i> Android&trade;</a></li>
<li class="list-inline-item"><a href="/blog/open-source/linux-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-linux"></i> Linux&reg;</a></li>
<li class="list-inline-item"><a href="/blog/open-source/desktop-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fas fa-desktop"></i> Desktop</a></li>
<li class="list-inline-item"><a href="/blog/open-source/mozilla-firefox-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-firefox-browser"></i> Mozilla Firefox®</a></li>
<li class="list-inline-item"><a href="/blog/open-source/safari-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Safari®</a></li>
<li class="list-inline-item"><a href="/blog/open-source/google-chrome-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-chrome"></i> Google Chrome®</a></li>
<li class="list-inline-item"><a href="/blog/open-source/terminal-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fas fa-terminal"></i>Terminal</a></li>
</ul>
</div>

<div class="alert alert-primary">
Votre nom d'utilisateur correspond à l'adresse e-mail de votre alias et votre mot de passe provient de <strong class="text-success"><i class="fa fa-key"></i> Générer un mot de passe</strong> (« Mot de passe normal »).
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Conseil :
</strong>
<span>Si vous utilisez Thunderbird, assurez-vous que la « Sécurité de la connexion » est définie sur « SSL/TLS » et que la méthode d'authentification est définie sur « Mot de passe normal ».</span>
</div>

| Taper | Nom d'hôte | Protocole | Ports |
| :--: | :---------------------: | :-------------------------------------: | :----------------------------------------------------------------------------------: |
| IMAP | `imap.forwardemail.net` | SSL/TLS **Préféré** | `993` et `2993` |
| SMTP | `smtp.forwardemail.net` | SSL/TLS **Préféré** ou TLS (STARTTLS) | `465` et `2465` pour SSL/TLS (ou) `587`, `2587`, `2525` et `25` pour TLS (STARTTLS) |

### Pourquoi mes e-mails atterrissent-ils dans les spams et les courriers indésirables et comment puis-je vérifier la réputation de mon domaine ? {#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation}

Cette section vous guide si votre courrier sortant utilise nos serveurs SMTP (par exemple `smtp.forwardemail.net`) (ou est transféré via `mx1.forwardemail.net` ou `mx2.forwardemail.net`) et qu'il est livré dans le dossier Spam ou Courrier indésirable des destinataires.

Nous surveillons régulièrement notre [adresses IP](#what-are-your-servers-ip-addresses) par rapport à [toutes les listes de blocage DNS réputées](#how-do-you-handle-your-ip-addresses-becoming-blocked), **il s'agit donc très probablement d'un problème spécifique à la réputation du domaine**.

Les e-mails peuvent atterrir dans les dossiers spam pour plusieurs raisons :

1. **Authentification manquante** : configurez les enregistrements [SPF](#how-do-i-set-up-spf-for-forward-email), [DKIM](#how-do-i-set-up-dkim-for-forward-email) et [DMARC](#how-do-i-set-up-dmarc-for-forward-email).

2. **Réputation du domaine** : les nouveaux domaines ont souvent une réputation neutre jusqu'à ce qu'ils établissent un historique d'envoi.

3. **Déclencheurs de contenu** : Certains mots ou expressions peuvent déclencher des filtres anti-spam.

4. **Modèles d'envoi** : les augmentations soudaines du volume d'e-mails peuvent paraître suspectes.

Vous pouvez essayer d'utiliser un ou plusieurs de ces outils pour vérifier la réputation et la catégorisation de votre domaine :

| Nom de l'outil | URL | Taper |
| ------------------------------------------- | ---------------------------------------------------------------- | ---------------------- |
| Commentaires sur la catégorisation des domaines Cloudflare | <https://radar.cloudflare.com/domains/feedback> | Catégorisation |
| Vérificateur de réputation IP et de domaine Spamhaus | <https://check.spamhaus.org/> | DNSBL |
| Centre de réputation IP et domaine Cisco Talos | <https://talosintelligence.com/reputation_center> | Réputation |
| Recherche de réputation IP et de domaine Barracuda | <https://www.barracudacentral.org/lookups/lookup-reputation> | DNSBL |
| Vérification de la liste noire de MX Toolbox | <https://mxtoolbox.com/blacklists.aspx> | Liste noire |
| Outils Google Postmaster | <https://www.gmail.com/postmaster/> | Réputation |
| Centre d'envoi Yahoo | <https://senders.yahooinc.com/> | Réputation |
| Vérification de la liste noire de MultiRBL.valli.org | <https://multirbl.valli.org/lookup/> | DNSBL |
| Score de l'expéditeur | <https://senderscore.org/act/blocklist-remover/> | Réputation |
| Surévaluation | <https://www.invaluement.com/lookup/> | DNSBL |
| SURBL | <https://www.surbl.org/> | DNSBL |
| Suppression de l'IP Apple/Proofpoint | <https://ipcheck.proofpoint.com/> | Suppression |
| Suppression de l'adresse IP Cloudmark | <https://csi.cloudmark.com/en/reset/> | Suppression |
| SpamCop | <https://www.spamcop.net/bl.shtml> | DNSBL |
| Suppression de l'adresse IP de Microsoft Outlook et Office 365 | <https://sendersupport.olc.protection.outlook.com/pm/Postmaster> | Suppression |
| Niveaux 1, 2 et 3 d'UCEPROTECT | <https://www.uceprotect.net/fr/rblcheck.php> | DNSBL |
| Backscatterer.org d'UCEPROTECT | <https://www.backscatterer.org/> | Protection contre la rétrodiffusion |
| whitelisted.org d'UCEPROTECT | <https://www.whitelisted.org/> (nécessite des frais) | DNSWL |
| AT&T | `abuse_rbl@abuse-att.net` | Suppression |
| AOL/Verizon (par exemple `[IPTS04]`) | <https://senders.yahooinc.com/> | Suppression |
| Cox Communications | `unblock.request@cox.net` | Suppression |
| t-online.de (allemand/T-Mobile) | `tobr@rx.t-online.de` | Suppression |

> \[!TIP]
> Commencez par un petit volume d'e-mails de haute qualité pour bâtir une réputation positive avant d'en envoyer davantage.

> \[!IMPORTANT]
> Si votre domaine est sur une liste noire, chaque liste possède sa propre procédure de suppression. Consultez leurs sites web respectifs pour obtenir des instructions.

> \[!TIP]
> Si vous avez besoin d'aide ou si vous constatez que nous sommes répertoriés comme spam par un fournisseur de messagerie, veuillez <a href="/help">nous contacter</a>.

### Que dois-je faire si je reçois des courriers indésirables ? {#what-should-i-do-if-i-receive-spam-emails}

Vous devez vous désinscrire de la liste de diffusion (si possible) et bloquer l'expéditeur.

Veuillez ne pas signaler le message comme spam, mais plutôt le transmettre à notre système de prévention des abus organisé manuellement et axé sur la confidentialité.

**L'adresse e-mail à laquelle transférer le spam est :** <abuse@forwardemail.net>

### Pourquoi mes e-mails de test qui m'ont été envoyés dans Gmail s'affichent-ils comme « suspects » ? {#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious}

Si vous voyez ce message d'erreur dans Gmail lorsque vous vous envoyez un test ou lorsqu'une personne à qui vous envoyez un e-mail avec votre alias voit un e-mail de votre part pour la première fois, alors **ne vous inquiétez pas**, car il s'agit d'une fonctionnalité de sécurité intégrée de Gmail.

Vous pouvez simplement cliquer sur « Semble sécurisé ». Par exemple, si vous envoyez un message test à quelqu'un d'autre via la fonctionnalité « Envoyer un e-mail » (en tant que), il ne sera pas visible.

Cependant, s'ils voient ce message, c'est parce qu'ils étaient habitués à voir vos e-mails provenir de <john@gmail.com> plutôt que de <john@customdomain.com> (juste un exemple). Gmail avertira les utilisateurs pour s'assurer que tout est en sécurité, au cas où ; il n'existe aucune solution de contournement.

### Puis-je supprimer le point net via forwardemail dans Gmail ? {#can-i-remove-the-via-forwardemail-dot-net-in-gmail}

Ce sujet est lié à un [problème largement connu dans Gmail où des informations supplémentaires apparaissent à côté du nom d'un expéditeur](https://support.google.com/mail/answer/1311182).

Depuis mai 2023, nous prenons en charge l'envoi d'e-mails avec SMTP en tant que module complémentaire pour tous les utilisateurs payants, ce qui signifie que vous pouvez supprimer le <span class="notranslate">via forwardemail dot net</span> dans Gmail.

Notez que cette rubrique FAQ est spécifique à ceux qui utilisent la fonctionnalité [Comment envoyer du courrier électronique avec Gmail](#how-to-send-mail-as-using-gmail).

Veuillez consulter la section sur [Prenez-vous en charge l'envoi d'e-mails avec SMTP ?](#do-you-support-sending-email-with-smtp) pour les instructions de configuration.

## Gestion des données {#data-management}

### Où sont situés vos serveurs {#where-are-your-servers-located}

> \[!TIP]
> Nous pourrions bientôt annoncer l'emplacement de notre centre de données européen hébergé sous [forwardemail.eu](https://forwardemail.eu). Abonnez-vous à la discussion sur <https://github.com/orgs/forwardemail/discussions/336> pour rester informé.

Nos serveurs sont situés principalement à Denver, Colorado – voir <https://forwardemail.net/ips> pour notre liste complète d'adresses IP.

Vous pouvez en savoir plus sur nos sous-traitants sur nos pages [GDPR](/gdpr), [DPA](/dpa) et [Confidentialité](/privacy).

### Comment exporter et sauvegarder ma boîte aux lettres {#how-do-i-export-and-backup-my-mailbox}

À tout moment, vous pouvez exporter vos boîtes aux lettres aux formats [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions), [Mbox](https://en.wikipedia.org/wiki/Mbox) ou [SQLite](https://en.wikipedia.org/wiki/SQLite) chiffrés.

Accédez à <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Mon compte <i class="fa fa-angle-right"></i> Domaines</a> <i class="fa fa-angle-right"></i> Alias <i class="fa fa-angle-right"></i> Téléchargez la sauvegarde et sélectionnez votre type de format d'exportation préféré.

Un lien vous sera envoyé par e-mail pour télécharger l'exportation une fois celle-ci terminée.

Notez que ce lien de téléchargement d'exportation expire après 4 heures pour des raisons de sécurité.

Si vous devez inspecter vos formats EML ou Mbox exportés, ces outils open source peuvent être utiles :

| Nom | Format | Plate-forme | URL GitHub |
| --------------- | :----: | ------------- | --------------------------------------------------- |
| Visionneuse MBox | Mbox | Windows | <https://github.com/eneam/mboxviewer> |
| visionneuse Web mbox | Mbox | Toutes les plateformes | <https://github.com/PHMRanger/mbox-web-viewer> |
| EmlReader | EML | Windows | <https://github.com/ayamadori/EmlReader> |
| Visionneuse de courrier électronique | EML | VSCode | <https://github.com/joelharkes/vscode_email_viewer> |
| lecteur eml | EML | Toutes les plateformes | <https://github.com/s0ph1e/eml-reader> |

De plus, si vous devez convertir un fichier Mbox en fichier EML, vous pouvez utiliser <https://github.com/noelmartinon/mboxzilla>.

### Comment importer et migrer ma boîte aux lettres existante {#how-do-i-import-and-migrate-my-existing-mailbox}

Vous pouvez facilement importer votre e-mail dans Forward Email (par exemple en utilisant [Thunderbird](https://www.thunderbird.net)) en suivant les instructions ci-dessous :

<div class="alert alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Important :
</strong>
<span>
Vous devez suivre toutes les étapes suivantes pour importer votre adresse e-mail existante.
</span>
</div>

1. Exportez votre e-mail depuis votre fournisseur de messagerie existant :

| Fournisseur de messagerie électronique | Format d'exportation | Instructions d'exportation |
| -------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Gmail | MBOX | <https://takeout.google.com/settings/takeout/custom/gmail> |
| Perspectives | PST | <div class="alert my-3 alert-danger"><i class="fa fa-info-circle font-weight-bold"></i> <strong class="font-weight-bold">Conseil :</strong> <span>Si vous utilisez Outlook (<a href="https://support.microsoft.com/en-us/office/back-up-your-email-e5845b0b-1aeb-424f-924c-aa1c33b18833#:~:text=Select%20File%20%3E%20Open%20%26%20Export%20%3E,back%20up%20and%20select%20Next." class="alert-link">format d'exportation PST</a>), vous pouvez simplement suivre les instructions sous « Autre » ci-dessous. Cependant, nous avons fourni des liens ci-dessous pour convertir PST au format MBOX/EML en fonction de votre système d'exploitation :<ul class="mb-0 mt-3"><li><a class="alert-link" href="https://github.com/BaselineIT/Zinkuba/releases/download/release-1.2/Zinkuba.App.exe">Zinkuba pour Windows</a> (<a class="alert-link" href="https://github.com/BaselineIT/Zinkuba?tab=readme-ov-file#zinkuba">GitHub</a>)</li><li><a class="alert-link" href="https://cygwin.com/packages/summary/readpst.html">readpst pour Windows cygwin</a> – (par exemple, <code>readpst -u -o $OUT_DIR $IN_DIR</code> remplaçant <code>$OUT_DIR</code> et <code>$IN_DIR</code> avec les chemins d'accès au répertoire de sortie et au répertoire d'entrée respectivement).</li><li><a class="alert-link" href="https://manpages.ubuntu.com/manpages/trusty/man1/readpst.1.html">readpst pour Ubuntu/Linux</a> – (par exemple, <code>sudo apt-get install readpst</code> puis <code>readpst -u -o $OUT_DIR $IN_DIR</code>, en remplaçant <code>$OUT_DIR</code> et <code>$IN_DIR</code> par les chemins d'accès au répertoire de sortie et au répertoire d'entrée respectivement).</li><li><a class="alert-link" href="https://formulae.brew.sh/formula/libpst">readpst pour macOS (via brew)</a> – (par exemple, <code>brew install libpst</code> puis <code>readpst -u -o $OUT_DIR $IN_DIR</code>, en remplaçant <code>$OUT_DIR</code> et <code>$IN_DIR</code> par les chemins d'accès au répertoire de sortie et au répertoire d'entrée respectivement).</li><li><a class="alert-link" href="https://github.com/juanirm/pst-converter/tree/master?tab=readme-ov-file#pst-converter">Convertisseur PST pour Windows (GitHub)</a></li></ul><br /></span></div> |
| Apple Mail | MBOX | <https://support.apple.com/guide/mail/import-or-export-mailboxes-mlhlp1030/mac#apd37a3190755974> |
| Courrier rapide | EML | <https://www.fastmail.help/hc/en-us/articles/360060590573-Téléchargez-toutes-vos-données#downloadmail> |
| Courrier Proton | MBOX/EML | <https://proton.me/support/export-emails-import-export-app> |
| Tutanota | EML | <https://github.com/crepererum-oss/tatutanatata> |
| Pense | EML | <https://docs.gandi.net/fr/gandimail/common_operations/backup_email.html#contents> |
| Zoho | EML | <https://www.zoho.com/mail/help/import-export-emails.html#alink2> |
| Autre | [Use Thunderbird](https://www.thunderbird.net) | Configurez votre compte de messagerie existant dans Thunderbird, puis utilisez le plugin [ImportExportTools NG](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/) pour exporter et importer vos e-mails. **Vous pouvez également copier/coller ou glisser-déposer des e-mails d'un compte à l'autre.** |

2. Téléchargez, installez et ouvrez [Thunderbird](https://www.thunderbird.net).

3. Créez un nouveau compte en utilisant l'adresse e-mail complète de votre alias (par exemple <code><vous@votredomaine.com></code>) et votre mot de passe généré. <strong>Si vous n'avez pas encore de mot de passe généré, <a href="/faq#do-you-support-receiving-email-with-imap" target="_blank">reportez-vous à nos instructions de configuration</a></strong>.

4. Téléchargez et installez le plugin Thunderbird [Outils d'importation et d'exportation DE](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/).

5. Créez un nouveau dossier local dans Thunderbird, puis faites un clic droit dessus → sélectionnez l'option `ImportExportTools NG` → choisissez `Import mbox file` (pour le format d'exportation MBOX) – ou – `Import messages` / `Import all messages from a directory` (pour le format d'exportation EML).

6. Glissez-déposez vos messages depuis le dossier local vers un nouveau dossier IMAP (ou un dossier existant) dans Thunderbird, dans lequel vous souhaitez les transférer depuis le stockage IMAP avec notre service. Cela garantira leur sauvegarde en ligne sur notre stockage chiffré SQLite.

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Astuce :
</strong>
<span>
Si vous ne savez pas comment importer dans Thunderbird, vous pouvez consulter les instructions officielles à l'adresse <a class="alert-link" href="https://kb.mozillazine.org/Importing_folders">https://kb.mozillazine.org/Importing_folders</a> et <a class="alert-link" href="https://github.com/thunderbird/import-export-tools-ng/wiki">https://github.com/thunderbird/import-export-tools-ng/wiki</a>.
</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Important :
</strong>
<span>
Une fois l'exportation et l'importation terminées, vous pouvez également activer le transfert sur votre compte de messagerie existant et configurer un répondeur automatique pour informer les expéditeurs de votre nouvelle adresse e-mail (par exemple, si vous utilisiez auparavant Gmail et que vous utilisez désormais une adresse e-mail avec votre nom de domaine personnalisé).
</span>
</div>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Félicitations !
</strong>
<span>
Vous avez terminé toutes les étapes avec succès.
</span>
</div>
</div>

### Prenez-vous en charge l'auto-hébergement {#do-you-support-self-hosting}

Oui, depuis mars 2025, nous proposons une option d'hébergement autonome. Consultez le blog [ici](https://forwardemail.net/blog/docs/self-hosted-solution). Consultez [guide auto-hébergé](https://forwardemail.net/self-hosted) pour commencer. Pour une version plus détaillée, consultez nos guides basés sur [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) ou [Debian](https://forwardemail.net/guides/selfhosted-on-debian).

## Configuration de la messagerie {#email-configuration}

### Comment démarrer et configurer le transfert d'e-mails {#how-do-i-get-started-and-set-up-email-forwarding}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Temps d'installation estimé :</strong>
<span>Moins de 10 minutes</span>
</div>

<div class="alert my-3 alert-success">
<i class="fa fa-bullhorn font-weight-bold"></i>
<strong class="font-weight-bold">
Premiers pas :
</strong>
<span>
Lisez attentivement et suivez les étapes 1 à 8 ci-dessous. Assurez-vous de remplacer l'adresse e-mail <code>utilisateur@gmail.com</code> par l'adresse e-mail à laquelle vous souhaitez transférer les e-mails (si elle n'est pas déjà correcte). De même, veillez à remplacer <code>exemple.com</code> par votre nom de domaine personnalisé (si elle n'est pas déjà correcte).
</span>
</div>

<ol>
<li class="mb-2 mb-md-3 mb-lg-5">Si vous avez déjà enregistré votre nom de domaine, vous devez ignorer cette étape et passer directement à l'étape 2 ! Sinon, vous pouvez <a href="/domain-registration" rel="noopener noreferrer">cliquer ici pour enregistrer votre nom de domaine</a>.</li>
<li class="mb-2 mb-md-3 mb-lg-5">
Vous souvenez-vous de l'emplacement d'enregistrement de votre domaine ? Une fois que vous vous en souvenez, suivez les instructions ci-dessous :

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Important :
</strong>
<span>
Vous devez ouvrir un nouvel onglet et vous connecter à votre bureau d'enregistrement de domaine. Cliquez simplement sur « Bureau d'enregistrement » ci-dessous pour effectuer cette opération automatiquement. Dans ce nouvel onglet, accédez à la page de gestion DNS de votre bureau d'enregistrement. Vous trouverez les étapes de navigation étape par étape ci-dessous, dans la colonne « Étapes de configuration ». Une fois sur cette page, vous pouvez y revenir et passer à l'étape 3 ci-dessous.
<strong class="font-weight-bold">Ne fermez pas encore l'onglet ouvert ; vous en aurez besoin pour les étapes suivantes !</strong>
</span>
</div>

<table id="table-dns-management-by-registrar" class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Bureau d'enregistrement</th>
<th>Étapes de configuration</th>
</tr>
</thead>
<tbody>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://login.ionos.com/">1&amp;1</a></td>
<td>Connexion <i class="fa fa-angle-right"></i> Centre de domaines <i class="fa fa-angle-right"></i> (Sélectionnez votre domaine) <i class="fa fa-angle-right"></i> Modifier les paramètres DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon Route 53</a></td>
<td>Connexion <i class="fa fa-angle-right"></i> Zones hébergées <i class="fa fa-angle-right"></i> (Sélectionnez votre domaine)</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>
<td>Connexion <i class="fa fa-angle-right"></i> Mes serveurs <i class="fa fa-angle-right"></i> Gestion de domaine <i class="fa fa-angle-right"></i> Gestionnaire DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.bluehost.com/help/article/dns-management-add-edit-or-delete-dns-entries">Bluehost</a></td>
<td>POUR ROCK : Connexion <i class="fa fa-angle-right"></i> Domaines <i class="fa fa-angle-right"></i> (Cliquez sur l'icône ▼ à côté de « gérer ») <i class="fa fa-angle-right"></i> DNS
<br />
POUR LES ANCIENNES APPLICATIONS : Connexion <i class="fa fa-angle-right"></i> Domaines <i class="fa fa-angle-right"></i> Éditeur de zones <i class="fa fa-angle-right"></i> (Sélectionnez votre domaine)</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://dash.cloudflare.com/login">Cloudflare</a></td>
<td>Connexion <i class="fa fa-angle-right"></i> DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://cp.dnsmadeeasy.com/">DNS Simplifié</a></td>
<td>Connexion <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> (Sélectionnez votre domaine)</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://dnsimple.com/dashboard">DNSimple</a></td>
<td>Connexion <i class="fa fa-angle-right"></i> (Sélectionnez votre domaine) <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> Gérer</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://cloud.digitalocean.com/login">Digital Océan</a></td>
<td>Connexion <i class="fa fa-angle-right"></i> Réseau <i class="fa fa-angle-right"></i> Domaines <i class="fa fa-angle-right"></i> (Sélectionnez votre domaine) <i class="fa fa-angle-right"></i> Plus <i class="fa fa-angle-right"></i> Gérer le domaine</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.domain.com/help/article/dns-management-how-to-update-dns-records">Domain.com</a></td>
<td>Connexion <i class="fa fa-angle-right"></i> En mode carte, cliquez sur Gérer votre domaine. <i class="fa fa-angle-right"></i> En mode liste, cliquez sur
l'icône en forme d'engrenage. <i class="fa fa-angle-right"></i> DNS et serveurs de noms. <i class="fa fa-angle-right"></i> Enregistrements DNS.</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://www.domains.com/">Domains.com</a>
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon0 class="fa fa-play-circle"></i> Regarder</a>
</td>
<td>Connexion <i class="fa fa-angle-right"></i> (Sélectionnez votre domaine) <i class="fa fa-angle-right"></i> Gérer <i class="fa fa-angle-right"></i> (Cliquez sur l'icône en forme d'engrenage) <i class="fa fa-angle-right"></i> Cliquez sur DNS et serveurs de noms dans le menu de gauche</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon1
<td>Connexion <i class="fa fa-angle-right"></i> Panneau <i class="fa fa-angle-right"></i> Domaines <i class="fa fa-angle-right"></i> Gérer les domaines <i class="fa fa-angle-right"></i> DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon2
<td>Connexion <i class="fa fa-angle-right"></i> Présentation <i class="fa fa-angle-right"></i> Gestion <i class="fa fa-angle-right"></i> Éditeur simple <i class="fa fa-angle-right"></i> Enregistrements</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon3
<td>Connexion <i class="fa fa-angle-right"></i> (Sélectionnez votre domaine) <i class="fa fa-angle-right"></i> Gestion <i class="fa fa-angle-right"></i> Modifier la zone</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon4
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon5 class="fa fa-play-circle"></i> Regarder</a>
</td>
<td>Connexion <i class="fa fa-angle-right"></i> Gérer mes domaines <i class="fa fa-angle-right"></i> (Sélectionnez votre domaine) <i class="fa fa-angle-right"></i> Gérer le DNS</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon6 Domaines</a>
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon7 class="fa fa-play-circle"></i> Regarder</a>
</td>
<td>Connexion <i class="fa fa-angle-right"></i> (Sélectionnez votre domaine) <i class="fa fa-angle-right"></i> Configurer DNS</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon8
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon9 class="fa fa-play-circle"></i> Regarder</a>
</td>
<td>Connexion <i class="fa fa-angle-right"></i> Liste des domaines <i class="fa fa-angle-right"></i> (Sélectionnez votre domaine) <i class="fa fa-angle-right"></i> Gérer <i class="fa fa-angle-right"></i> DNS avancé</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>0
<td>Connexion <i class="fa fa-angle-right"></i> (Sélectionnez votre domaine) <i class="fa fa-angle-right"></i> Configuration DNS Netlify</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>1 Solutions</a></td>
<td>Connexion <i class="fa fa-angle-right"></i> Gestionnaire de compte <i class="fa fa-angle-right"></i> Mes noms de domaine <i class="fa fa-angle-right"></i> (Sélectionnez votre domaine) <i class="fa fa-angle-right"></i> Gérer <i class="fa fa-angle-right"></i> Modifier la destination du domaine <i class="fa fa-angle-right"></i> DNS avancé</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>2
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>3 class="fa fa-play-circle"></i> Regarder</a>
</td>
<td>Connexion <i class="fa fa-angle-right"></i> Domaines gérés <i class="fa fa-angle-right"></i> (Sélectionnez votre domaine) <i class="fa fa-angle-right"></i> Paramètres DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>4
<td>Connexion <i class="fa fa-angle-right"></i> Menu Accueil <i class="fa fa-angle-right"></i> Paramètres <i class="fa fa-angle-right"></i> Domaines <i class="fa fa-angle-right"></i> (Sélectionnez votre domaine) <i class="fa fa-angle-right"></i>
Paramètres avancés <i class="fa fa-angle-right"></i> Enregistrements personnalisés</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>5 Maintenant</a></td>
<td>Utilisation de la CLI « maintenant » <i class="fa fa-angle-right"></i> <code>now dns add [domaine] '@' MX [valeur-enregistrement] [priorité]</code></td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>6
<td>Connexion à la page Domaines <i class="fa fa-angle-right"></i> (Sélectionnez votre domaine) <i class="fa fa-angle-right"></i> DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>7
<td>Connexion à la page Domaines <i class="fa fa-angle-right"></i> (Cliquez sur l'icône <i class="fa fa-ellipsis-h"></i>) <i class="fa fa-angle-right"></i> Sélectionnez « Gérer les enregistrements DNS »</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>8
<td>Connexion <i class="fa fa-angle-right"></i> Domaines <i class="fa fa-angle-right"></i> Mes domaines</td>
</tr>
<tr>
<td>Autre</td>
<td>
<div class="alert mb-0 alert-warning"><i class="fa fa-exclamation-circle font-weight-bold"></i> <strong class="font-weight-bold">Important :</strong> Vous ne voyez pas le nom de votre bureau d'enregistrement ici ? Recherchez simplement sur Internet « comment modifier les enregistrements DNS sur $REGISTRAR » (en remplaçant $REGISTRAR par le nom de votre bureau d'enregistrement, par exemple « comment modifier les enregistrements DNS sur GoDaddy » si vous utilisez GoDaddy).</div>
</td>
</tr>
</tbody>
</table>
</li>
<li class="mb-2 mb-md-3 mb-lg-5">À l'aide de la page de gestion DNS de votre bureau d'enregistrement (l'autre onglet que vous avez ouvert), définissez les enregistrements « MX » suivants :

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Important :
</strong>
<span>
Notez qu'aucun autre enregistrement MX ne doit être défini. Les deux enregistrements ci-dessous DOIVENT exister. Assurez-vous qu'il n'y a pas de fautes de frappe et que les champs mx1 et mx2 sont correctement orthographiés. Si des enregistrements MX existaient déjà, veuillez les supprimer complètement.
La valeur « TTL » n'a pas besoin d'être égale à 3 600 ; elle peut être inférieure ou supérieure si nécessaire.
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
<td><em>"@", "." ou vide</em></td>
<td class="text-center">3600</td>
<td>MX</td>
<td>0</td>
<td><code>mx1.forwardemail.net</code></td>
</tr>
<tr>
<td><em>"@", "." ou vide</em></td>
<td class="text-center">3600</td>
<td>MX</td>
<td>0</td>
<td><code>mx2.forwardemail.net</code></td>
</tr>
</tbody>
</table>

</li><li class="mb-2 mb-md-3 mb-lg-5" id="dns-configuration-options">À l'aide de la page de gestion DNS de votre bureau d'enregistrement (l'autre onglet que vous avez ouvert), définissez le(s) enregistrement(s) <strong class="notranslate">TXT</strong> suivant(s) :

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Important :
</strong>
<span>
Si vous avez souscrit à un abonnement payant, vous devez ignorer cette étape et passer directement à l'étape 5 ! Si vous n'avez pas souscrit à un abonnement payant, vos adresses de redirection seront consultables publiquement. Rendez-vous dans <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mon compte <i class="fa fa-angle-right"></i> Domaines</a> et passez à un abonnement payant si vous le souhaitez. Pour en savoir plus sur les abonnements payants, consultez notre page <a rel="noopener noreferrer" href="/private-business-email" class="alert-link">Tarifs</a>. Sinon, vous pouvez continuer à choisir une ou plusieurs combinaisons parmi les options A à F listées ci-dessous.
</span>
</div>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Option A :
</strong>
<span>
Si vous transférez tous les e-mails de votre domaine (par exemple, « all@example.com », « hello@example.com », etc.) vers une adresse spécifique « user@gmail.com » :
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
<td><em>"@", "." ou vide</em></td>
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
Conseil :
</strong>
<span>
Veillez à remplacer les valeurs ci-dessus dans la colonne « Valeur » par votre propre adresse e-mail. La valeur « TTL » n'a pas besoin d'être égale à 3 600 ; elle peut être inférieure ou supérieure si nécessaire. Une valeur de durée de vie (« TTL ») plus faible garantira une propagation plus rapide sur Internet de toute modification future apportée à vos enregistrements DNS ; considérez-la comme la durée de mise en cache en mémoire (en secondes). Pour en savoir plus sur le <a href="https://en.wikipedia.org/wiki/Time_to_live#DNS_records" rel="noopener noreferrer" target="_blank" class="alert-link">TTL, consultez Wikipédia</a>.
</span>
</div>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Option B :
</strong>
<span>
Si vous souhaitez simplement transférer une seule adresse e-mail (par exemple, <code>hello@example.com</code> vers <code>user@gmail.com</code> ; cela transférera également automatiquement « hello+test@example.com » vers « user+test@gmail.com ») :
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
Option C :
</strong>
<span>
Si vous transférez plusieurs e-mails, séparez-les par une virgule :
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
<td><em>"@", "." ou vide</em></td>
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
Option D :
</strong>
<span>
Vous pouvez configurer un nombre illimité d'e-mails de transfert. Veillez simplement à ne pas dépasser 255 caractères sur une seule ligne et à commencer chaque ligne par « forward-email ». Un exemple est fourni ci-dessous :
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
<td><em>"@", "." ou vide</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=hello:user@gmail.com,support:user@gmail.com</code>
</td>
</tr>
<tr>
<td><em>"@", "." ou vide</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=help:user@gmail.com,foo:user@gmail.com</code>
</td>
</tr>
<tr>
<td><em>"@", "." ou vide</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=orders:user@gmail.com,baz:user@gmail.com</code>
</td>
</tr>
<tr>
<td><em>"@", "." ou vide</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=info:user@gmail.com,beep:user@gmail.com</code>
</td>
</tr>
<tr>
<td><em>"@", "." ou vide</em></td>
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
Option E :
</strong>
<span>
Vous pouvez également spécifier un nom de domaine dans votre enregistrement <strong class="notranslate">TXT</strong> pour bénéficier d'une redirection d'alias globale (par exemple, « utilisateur@exemple.com » sera redirigé vers « utilisateur@exemple.net ») :
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
<td><em>"@", "." ou vide</em></td>
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
Option F :
</strong>
<span>
Vous pouvez même utiliser des webhooks comme alias global ou individuel pour transférer des e-mails. Consultez l'exemple et la section complète sur les webhooks intitulée <a href="#do-you-support-webhooks" class="alert-link">Prend-vous en charge les webhooks ?</a> ci-dessous.
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
<td><em>"@", "." ou vide</em></td>
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
Option G :
</strong>
<span>
Vous pouvez même utiliser des expressions régulières (« regex ») pour faire correspondre les alias et gérer les substitutions pour le transfert des e-mails. Consultez les exemples et la section complète sur les expressions régulières intitulée <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">Prend-vous en charge les expressions régulières ou les expressions régulières ?</a> ci-dessous.
</span>
</div>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Besoin d'expressions régulières avancées avec substitution ?</strong> Consultez les exemples et la section complète sur les expressions régulières intitulée <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">Prend-vous en charge les expressions régulières ou les expressions régulières ?</a> ci-dessous.
</div>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Exemple simple :</strong> Si je souhaite que tous les e-mails destinés à `linus@example.com` ou `torvalds@example.com` soient transférés vers `user@gmail.com` :
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
<td><em>"@", "." ou vide</em></td>
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
Important :
</strong>
<span>
Les règles de transfert fourre-tout peuvent également être qualifiées de « fail-through ».
Cela signifie que les e-mails entrants correspondant à au moins une règle de transfert spécifique seront utilisés à la place de la règle fourre-tout.
Les règles spécifiques incluent les adresses e-mail et les expressions régulières.
<br /><br />
Par exemple :
<br />
<code>forward-email=hello:first@gmail.com,second@gmail.com</code>
<br />
Les e-mails envoyés à <code>hello@example.com</code> ne seront **pas** transférés à <code>second@gmail.com</code> (catch-all) avec cette configuration, mais uniquement à <code>first@gmail.com</code>.
</span>
</div>

---

</li><li class="mb-2 mb-md-3 mb-lg-5">À l'aide de la page de gestion DNS de votre bureau d'enregistrement (l'autre onglet que vous avez ouvert), définissez en plus l'enregistrement <strong class="notranslate">TXT</strong> suivant :

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
<td><em>"@", "." ou vide</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>v=spf1 a include:spf.forwardemail.net -all</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Important :
</strong>
<span>
Si vous utilisez Gmail (par exemple, Envoyer un e-mail en tant que) ou G Suite, vous devrez ajouter <code>include:_spf.google.com</code> à la valeur ci-dessus, par exemple :
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
</span>
</div>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Astuce :
</strong>
<span>
Si vous avez déjà une ligne similaire avec « v=spf1 », vous devrez ajouter <code>include:spf.forwardemail.net</code> juste avant tout enregistrement « include:host.com » existant et avant « -all » sur la même ligne, par exemple :
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
<br /><br />
Notez qu'il existe une différence entre « -all » et « ~all ». Le « - » indique que la vérification SPF doit échouer en cas de non-concordance, et le « ~ » indique que la vérification SPF doit échouer. Nous vous recommandons d'utiliser l'approche « -all » pour éviter la falsification de domaine.
<br /><br />
Vous devrez peut-être également inclure l'enregistrement SPF de l'hôte depuis lequel vous envoyez vos e-mails (par exemple, Outlook).
</span>
</div>

</li><li class="mb-2 mb-md-3 mb-lg-5">Vérifiez vos enregistrements DNS à l'aide de notre outil « Vérifier les enregistrements » disponible sur <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mon compte <i class="fa fa-angle-right"></i> Domaines</a> <i class="fa fa-angle-right"></i> Configuration.

</li><li class="mb-2 mb-md-3 mb-lg-5">Envoyez un e-mail de test pour confirmer le fonctionnement. Notez que la propagation de vos enregistrements DNS peut prendre un certain temps.

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Astuce :
</strong>
<span>
</span>
Si vous ne recevez pas d'e-mails de test ou si vous recevez un e-mail de test indiquant « Attention à ce message », consultez les réponses aux questions suivantes : <a href="#why-am-i-not-receiving-my-test-emails" class="alert-link">Pourquoi ne reçois-je pas mes e-mails de test ?</a> et <a href="#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious" class="alert-link">Pourquoi les e-mails de test que je reçois dans Gmail sont-ils considérés comme « suspects ? » ?</a> respectivement.
</div>

</li><li class="mb-2 mb-md-3 mb-lg-5">Si vous souhaitez « Envoyer des e-mails en tant que » depuis Gmail, vous devrez <strong><a href="https://www.youtube.com/watch?v=MEheS8gM4Xs" target="_blank" rel="noopener noreferrer">regarder cette vidéo</a></strong>, ou suivre les étapes décrites sous <a href="#how-to-send-mail-as-using-gmail">How pour envoyer des e-mails en tant que avec Gmail</a> ci-dessous.

</li></ol>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Félicitations !
</strong>
<span>
Vous avez terminé toutes les étapes avec succès.
</span>
</div>
</div>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Conseil :
</strong>
<span>
Les modules complémentaires facultatifs sont listés ci-dessous. Notez que ces modules complémentaires sont entièrement facultatifs et peuvent ne pas être nécessaires. Nous souhaitons au moins vous fournir des informations complémentaires si nécessaire.
</span>
</div>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Module complémentaire facultatif :
</strong>
<span>
Si vous utilisez la fonctionnalité <a class="alert-link" href="#how-to-send-mail-as-using-gmail">How pour envoyer des e-mails avec Gmail</a>, vous pouvez vous ajouter à une liste d'autorisation. Consultez <a class="alert-link" href="https://support.google.com/a/answer/60752?hl=en" target="_blank" rel="noopener noreferrer">ces instructions de Gmail</a> à ce sujet.
</span>
</div>

### Puis-je utiliser plusieurs échanges et serveurs MX pour le transfert avancé ? {#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding}

Oui, mais **vous ne devez avoir qu'un seul échange MX répertorié dans vos enregistrements DNS**.

N'essayez pas d'utiliser « Priorité » comme moyen de configurer plusieurs échanges MX.

Au lieu de cela, vous devez configurer votre échange MX existant pour transférer le courrier de tous les alias non correspondants vers les échanges de notre service (`mx1.forwardemail.net` et/ou `mx2.forwardemail.net`).

Si vous utilisez Google Workspace et que vous souhaitez transférer tous les alias non correspondants à notre service, consultez <https://support.google.com/a/answer/6297084>.

Si vous utilisez Microsoft 365 (Outlook) et que vous souhaitez transférer tous les alias non correspondants à notre service, consultez <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/use-connectors-to-configure-mail-flow/set-up-connectors-to-route-mail> et <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/manage-mail-flow-for-multiple-locations>.

### Comment configurer un répondeur automatique d'absence du bureau (#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder})

Accédez à <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Mon compte <i class="fa fa-angle-right"></i> Domaines</a> <i class="fa fa-angle-right"></i> Alias et créez ou modifiez l'alias pour lequel vous souhaitez configurer un répondeur automatique de vacances.

Vous avez la possibilité de configurer une date de début, une date de fin, un objet et un message, et de l'activer ou de le désactiver à tout moment :

* L'objet et le message en texte brut sont actuellement pris en charge (nous utilisons le package `striptags` en interne pour supprimer tout code HTML).
* L'objet est limité à 100 caractères.
* Le message est limité à 1 000 caractères.
* L'installation nécessite une configuration SMTP sortante (par exemple, vous devrez configurer les enregistrements DNS DKIM, DMARC et Return-Path).
* Accédez à <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Mon compte <i class="fa fa-angle-right"></i> Domaines</a> <i class="fa fa-angle-right"></i> Paramètres <i class="fa fa-angle-right"></i> Configuration SMTP sortante et suivez les instructions de configuration.
* Le répondeur automatique ne peut pas être activé sur les noms de domaine personnalisés globaux (par exemple, [adresses jetables](/disposable-addresses) n'est pas pris en charge). * Le répondeur de vacances ne peut pas être activé pour les alias avec caractère générique/fourre-tout (`*`) ni pour les expressions régulières.

Contrairement aux systèmes de messagerie tels que `postfix` (par exemple, qui utilisent l'extension de filtre de vacances `sieve`), Forward Email ajoute automatiquement votre signature DKIM, vérifie les problèmes de connexion lors de l'envoi de réponses de vacances (par exemple, en raison de problèmes de connexion SSL/TLS courants et de serveurs hérités maintenus), et prend même en charge le cryptage Open WKD et PGP pour les réponses de vacances.

<!--
* Afin d'éviter les abus, un crédit SMTP sortant sera déduit pour chaque message de réponse d'absence envoyé.
* Tous les comptes payants incluent 300 crédits par jour par défaut. Si vous avez besoin d'un montant supérieur, veuillez nous contacter.
-->

1. Nous n'envoyons qu'une seule fois par expéditeur [sur liste blanche](#do-you-have-an-allowlist) tous les 4 jours (ce qui est similaire au comportement de Gmail).

* Notre cache Redis utilise les empreintes `alias_id` et `sender`, tandis que `alias_id` correspond à l'identifiant MongoDB de l'alias et `sender` correspond à l'adresse d'expédition (si autorisée) ou au domaine racine de l'adresse d'expédition (si non autorisée). Par souci de simplicité, l'expiration de cette empreinte dans le cache est fixée à 4 jours.

* Notre approche consistant à utiliser le domaine racine analysé dans l'adresse de l'expéditeur pour les expéditeurs non autorisés empêche les abus d'expéditeurs relativement inconnus (par exemple, des acteurs malveillants) d'inonder les messages des répondeurs de vacances.

2. Nous envoyons uniquement lorsque le MAIL FROM et/ou le De ne sont pas vides et ne contiennent pas (insensible à la casse) un [nom d'utilisateur du postmaster](#what-are-postmaster-addresses) (la partie avant le @ dans un e-mail).

3. Nous n'envoyons pas si le message d'origine contenait l'un des en-têtes suivants (insensible à la casse) :

* En-tête de `auto-submitted` dont la valeur est différente de `no`.
* En-tête de `x-auto-response-suppress` dont la valeur est `dr`, `autoreply`, `auto-reply`, `auto_reply` ou `all`
* En-tête de `list-id`, `list-subscribe`, `no`0, `no`1, `no`2, `no`3, `no`4, `no`5, `no`6 ou `no`7 (quelle que soit la valeur).
* En-tête de `no`8 avec une valeur de `no`9, `x-auto-response-suppress`0, `x-auto-response-suppress`1, `x-auto-response-suppress`2 ou `x-auto-response-suppress`3.

4. Nous n'envoyons pas si l'adresse e-mail MAIL FROM ou From se termine par `+donotreply`, `-donotreply`, `+noreply` ou `-noreply`.

5. Nous n'envoyons pas si la partie nom d'utilisateur de l'adresse e-mail de l'expéditeur était `mdaemon` et qu'elle avait un en-tête insensible à la casse de `X-MDDSN-Message`.

6. Nous n'envoyons pas s'il y avait un en-tête `content-type` insensible à la casse de `multipart/report`.

### Comment configurer SPF pour le transfert d'e-mails {#how-do-i-set-up-spf-for-forward-email}

À l'aide de la page de gestion DNS de votre registraire, définissez l'enregistrement <strong class="notranslate">TXT</strong> suivant :

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
<td><em>"@", "." ou vide</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>v=spf1 a include:spf.forwardemail.net -all</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Important :
</strong>
<span>
Si vous utilisez Gmail (par exemple, Envoyer un e-mail en tant que) ou G Suite, vous devrez ajouter <code>include:_spf.google.com</code> à la valeur ci-dessus, par exemple :
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Important :
</strong>
<span>
Si vous utilisez Microsoft Outlook ou Live.com, vous devrez ajouter <code>include:spf.protection.outlook.com</code> à votre enregistrement SPF <strong class="notranslate">TXT</strong>, par exemple :
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:spf.protection.outlook.com -all</code>
</span>
</div>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Astuce :
</strong>
<span>
Si vous avez déjà une ligne similaire avec « v=spf1 », vous devrez ajouter <code>include:spf.forwardemail.net</code> juste avant tout enregistrement « include:host.com » existant et avant « -all » sur la même ligne, par exemple :
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
<br /><br />
Notez qu'il existe une différence entre « -all » et « ~all ». Le « - » indique que la vérification SPF doit échouer en cas de non-concordance, et le « ~ » indique que la vérification SPF doit échouer. Nous vous recommandons d'utiliser l'approche « -all » pour éviter la falsification de domaine.
<br /><br />
Vous devrez peut-être également inclure l'enregistrement SPF de l'hôte depuis lequel vous envoyez vos e-mails (par exemple, Outlook).
</span>
</div>

### Comment configurer DKIM pour le transfert d'e-mails {#how-do-i-set-up-dkim-for-forward-email}

Accédez à <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Mon compte <i class="fa fa-angle-right"></i> Domaines</a> <i class="fa fa-angle-right"></i> Paramètres <i class="fa fa-angle-right"></i> Configuration SMTP sortante et suivez les instructions de configuration.

### Comment configurer DMARC pour le transfert d'e-mails {#how-do-i-set-up-dmarc-for-forward-email}

Accédez à <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Mon compte <i class="fa fa-angle-right"></i> Domaines</a> <i class="fa fa-angle-right"></i> Paramètres <i class="fa fa-angle-right"></i> Configuration SMTP sortante et suivez les instructions de configuration.

### Comment connecter et configurer mes contacts {#how-do-i-connect-and-configure-my-contacts}

**Pour configurer vos contacts, utilisez l'URL CardDAV de :** `https://carddav.forwardemail.net` (ou simplement `carddav.forwardemail.net` si votre client le permet)

### Comment connecter et configurer mes calendriers {#how-do-i-connect-and-configure-my-calendars}

**Pour configurer votre calendrier, utilisez l'URL CalDAV de :** `https://caldav.forwardemail.net` (ou simplement `caldav.forwardemail.net` si votre client le permet)

<img width="612" height="520" src="/img/faq/calendar-setup.png" alt="Exemple de configuration de transfert de courrier électronique pour le calendrier CalDAV Thunderbird" />

### Comment ajouter plus de calendriers et gérer les calendriers existants {#how-do-i-add-more-calendars-and-manage-existing-calendars}

Si vous souhaitez ajouter des calendriers supplémentaires, ajoutez simplement une nouvelle URL de calendrier : `https://caldav.forwardemail.net/dav/principals/calendar-name` (**assurez-vous de remplacer `calendar-name` par le nom de calendrier souhaité**)

Vous pouvez modifier le nom et la couleur d'un calendrier après sa création : utilisez simplement votre application de calendrier préférée (par exemple, Apple Mail ou [Thunderbird](https://thunderbird.net)).

### Comment configurer SRS pour le transfert d'e-mails {#how-do-i-set-up-srs-for-forward-email}

Nous configurons automatiquement [Schéma de réécriture de l'expéditeur](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme) (« SRS ») – vous n’avez pas besoin de le faire vous-même.

### Comment configurer MTA-STS pour le transfert d'e-mails {#how-do-i-set-up-mta-sts-for-forward-email}

Veuillez vous référer à [notre section sur MTA-STS](#do-you-support-mta-sts) pour plus d'informations.

### Comment ajouter une photo de profil à mon adresse e-mail {#how-do-i-add-a-profile-picture-to-my-email-address}

Si vous utilisez Gmail, suivez les étapes ci-dessous :

1. Accédez à <https://google.com> et déconnectez-vous de tous vos comptes de messagerie.
2. Cliquez sur « Connexion » et, dans le menu déroulant, cliquez sur « Autre compte ».
3. Sélectionnez « Utiliser un autre compte ».
4. Sélectionnez « Créer un compte ».
5. Sélectionnez « Utiliser mon adresse e-mail actuelle ».
6. Saisissez l'adresse e-mail de votre nom de domaine personnalisé.
7. Récupérez l'e-mail de vérification qui vous a été envoyé.
8. Saisissez le code de vérification de cet e-mail.
9. Complétez les informations de votre profil Google.
10. Acceptez les conditions d'utilisation et la politique de confidentialité.
11. Accédez à <https://google.com> et, en haut à droite, cliquez sur l'icône de votre profil, puis sur le bouton « Modifier ».
12. Téléchargez une nouvelle photo ou un nouvel avatar pour votre compte.
13. La mise en œuvre des modifications prend environ 1 à 2 heures, mais peut parfois être très rapide.
14. Envoyez un e-mail de test et la photo de profil devrait apparaître.

## Fonctionnalités avancées {#advanced-features}

### Prenez-vous en charge les newsletters ou les listes de diffusion pour les e-mails liés au marketing ? {#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email}

Oui, vous pouvez en savoir plus sur <https://forwardemail.net/guides/newsletter-with-listmonk>.

Veuillez noter que pour préserver la réputation de votre adresse IP et garantir sa délivrabilité, Forward Email applique un processus de vérification manuelle par domaine pour l'**approbation de la newsletter**. Envoyez un e-mail à <support@forwardemail.net> ou ouvrez un [demande d'aide](https://forwardemail.net/help) pour approbation. Ce processus prend généralement moins de 24 heures, la plupart des demandes étant traitées en 1 à 2 heures. Nous prévoyons prochainement de rendre ce processus instantané grâce à des contrôles anti-spam et des alertes supplémentaires. Ce processus garantit que vos e-mails arrivent bien en boîte de réception et qu'ils ne soient pas marqués comme spam.

### Prenez-vous en charge l'envoi d'e-mails avec l'API {#do-you-support-sending-email-with-api}

Oui, depuis mai 2023, nous prenons en charge l'envoi d'e-mails avec API en tant que module complémentaire pour tous les utilisateurs payants.

<div class="alert my-3 alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Important :
</strong>
<span>
Veuillez vous assurer d'avoir lu nos <a href="/terms" class="alert-link" target="_blank">Conditions d'utilisation</a>, notre <a href="/privacy" class="alert-link" target="_blank">Politique de confidentialité</a> et nos <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Limites SMTP sortantes</a> ; votre utilisation vaut reconnaissance et acceptation.
</span>
</div>

Veuillez consulter notre section sur [Courriels](/email-api#outbound-emails) dans notre documentation API pour des options, des exemples et plus d'informations.

Afin d'envoyer des e-mails sortants avec notre API, vous devez utiliser votre jeton API disponible sous [Ma sécurité](/my-account/security).

### Prenez-vous en charge la réception d'e-mails avec IMAP ? {#do-you-support-receiving-email-with-imap}

Oui, depuis le 16 octobre 2023, nous prenons en charge la réception d'e-mails via IMAP en tant que module complémentaire pour tous les utilisateurs payants. **Veuillez consulter notre article détaillé** sur [comment fonctionne notre fonctionnalité de stockage de boîtes aux lettres SQLite cryptées](/blog/docs/best-quantum-safe-encrypted-email-service).

<div id="imap-instructions">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Important :
</strong>
<span>
Veuillez vous assurer d'avoir lu nos <a href="/terms" class="alert-link" target="_blank">Conditions d'utilisation</a> et notre <a href="/privacy" class="alert-link" target="_blank">Politique de confidentialité</a> ; votre utilisation vaut reconnaissance et acceptation.
</span>
</div>

1. Créez un nouvel alias pour votre domaine sous <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mon compte <i class="fa fa-angle-right"></i> Domaines</a> <i class="fa fa-angle-right"></i> Alias (par exemple <code><hello@example.com></code>)

2. Cliquez sur <strong class="text-success"><i class="fa fa-key"></i> Générer un mot de passe</strong> à côté du nouvel alias. Copiez-le dans votre presse-papiers et conservez-le précieusement.

3. À l'aide de votre application de messagerie préférée, ajoutez ou configurez un compte avec votre nouvel alias (par exemple, <code><hello@example.com></code>).
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Conseil :
</strong>
<span>Nous vous recommandons d'utiliser <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a> ou <a href="/blog/open-source" class="alert-link" target="_blank">une alternative open source et respectueuse de la vie privée</a>.</span>
</div>

4. Lorsque vous êtes invité à saisir le nom du serveur IMAP, saisissez `imap.forwardemail.net`

5. Lorsque vous êtes invité à indiquer le port du serveur IMAP, saisissez `993` (SSL/TLS) – voir [ports IMAP alternatifs](/faq#what-are-your-imap-server-configuration-settings) si nécessaire.
<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Conseil :
</strong>
<span>Si vous utilisez Thunderbird, assurez-vous que la « Sécurité de la connexion » est définie sur « SSL/TLS » et que la méthode d'authentification est définie sur « Mot de passe normal ».</span>
</div>

6. Lorsque vous êtes invité à saisir le mot de passe du serveur IMAP, collez le mot de passe de <strong class="text-success"><i class="fa fa-key"></i> Générer un mot de passe</strong> à l'étape 2 ci-dessus

7. **Enregistrez vos paramètres** – si vous rencontrez des problèmes, veuillez <a href="/help">nous contacter</a>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Félicitations !
</strong>
<span>
Vous avez terminé toutes les étapes avec succès.
</span>
</div>
</div>

</div>

### Prenez-vous en charge POP3 ? {#do-you-support-pop3}

Oui, depuis le 4 décembre 2023, nous prenons en charge [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol) en tant que module complémentaire pour tous les utilisateurs payants. **Veuillez consulter notre article détaillé** sur [comment fonctionne notre fonctionnalité de stockage de boîtes aux lettres SQLite cryptées](/blog/docs/best-quantum-safe-encrypted-email-service).

<div id="pop3-instructions">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Important :
</strong>
<span>
Veuillez vous assurer d'avoir lu nos <a href="/terms" class="alert-link" target="_blank">Conditions d'utilisation</a> et notre <a href="/privacy" class="alert-link" target="_blank">Politique de confidentialité</a> ; votre utilisation vaut reconnaissance et acceptation.
</span>
</div>

1. Créez un nouvel alias pour votre domaine sous <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mon compte <i class="fa fa-angle-right"></i> Domaines</a> <i class="fa fa-angle-right"></i> Alias (par exemple <code><hello@example.com></code>)

2. Cliquez sur <strong class="text-success"><i class="fa fa-key"></i> Générer un mot de passe</strong> à côté du nouvel alias. Copiez-le dans votre presse-papiers et conservez-le précieusement.

3. À l'aide de votre application de messagerie préférée, ajoutez ou configurez un compte avec votre nouvel alias (par exemple, <code><hello@example.com></code>).
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Conseil :
</strong>
<span>Nous vous recommandons d'utiliser <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a> ou <a href="/blog/open-source" class="alert-link" target="_blank">une alternative open source et respectueuse de la vie privée</a>.</span>
</div>

4. Lorsque vous êtes invité à saisir le nom du serveur POP3, saisissez `pop3.forwardemail.net`

5. Lorsque vous êtes invité à indiquer le port du serveur POP3, saisissez `995` (SSL/TLS) – voir [ports POP3 alternatifs](/faq#what-are-your-pop3-server-configuration-settings) si nécessaire.
<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Conseil :
</strong>
<span>Si vous utilisez Thunderbird, assurez-vous que la « Sécurité de la connexion » est définie sur « SSL/TLS » et que la méthode d'authentification est définie sur « Mot de passe normal ».</span>
</div>

6. Lorsque vous êtes invité à saisir le mot de passe du serveur POP3, collez le mot de passe de <strong class="text-success"><i class="fa fa-key"></i> Générer un mot de passe</strong> à l'étape 2 ci-dessus

7. **Enregistrez vos paramètres** – si vous rencontrez des problèmes, veuillez <a href="/help">nous contacter</a>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Félicitations !
</strong>
<span>
Vous avez terminé toutes les étapes avec succès.
</span>
</div>
</div>

</div>

### Prenez-vous en charge les calendriers (CalDAV) {#do-you-support-calendars-caldav}

Oui, nous avons ajouté cette fonctionnalité le 5 février 2024. Notre serveur est `caldav.forwardemail.net` et est également surveillé sur notre <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">page d'état</a>.

Il prend en charge IPv4 et IPv6 et est disponible sur le port `443` (HTTPS).

| Se connecter | Exemple | Description |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nom d'utilisateur | `user@example.com` | Adresse e-mail d'un alias qui existe pour le domaine dans <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mon compte <i class="fa fa-angle-right"></i> Domaines</a>. |
| Mot de passe | `************************` | Mot de passe généré spécifique à l'alias. |

Pour utiliser la prise en charge du calendrier, l'**utilisateur** doit être l'adresse e-mail d'un alias qui existe pour le domaine dans <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mon compte <i class="fa fa-angle-right"></i> Domaines</a> – et le **mot de passe** doit être un mot de passe généré spécifique à l'alias.

### Prenez-vous en charge les contacts (CardDAV) {#do-you-support-contacts-carddav}

Oui, nous avons ajouté cette fonctionnalité le 12 juin 2025. Notre serveur est `carddav.forwardemail.net` et est également surveillé sur notre <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">page d'état</a>.

Il prend en charge IPv4 et IPv6 et est disponible sur le port `443` (HTTPS).

| Se connecter | Exemple | Description |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nom d'utilisateur | `user@example.com` | Adresse e-mail d'un alias qui existe pour le domaine dans <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mon compte <i class="fa fa-angle-right"></i> Domaines</a>. |
| Mot de passe | `************************` | Mot de passe généré spécifique à l'alias. |

Pour utiliser la prise en charge des contacts, l'**utilisateur** doit être l'adresse e-mail d'un alias qui existe pour le domaine dans <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mon compte <i class="fa fa-angle-right"></i> Domaines</a> – et le **mot de passe** doit être un mot de passe généré spécifique à l'alias.

### Prenez-vous en charge l'envoi d'e-mails avec SMTP ? {#do-you-support-sending-email-with-smtp}

Oui, depuis mai 2023, nous prenons en charge l'envoi d'e-mails avec SMTP en tant que module complémentaire pour tous les utilisateurs payants.

<div id="instructions-smtp">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Important :
</strong>
<span>
Veuillez vous assurer d'avoir lu nos <a href="/terms" class="alert-link" target="_blank">Conditions d'utilisation</a>, notre <a href="/privacy" class="alert-link" target="_blank">Politique de confidentialité</a> et nos <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Limites SMTP sortantes</a> ; votre utilisation vaut reconnaissance et acceptation.
</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Important :
</strong>
<span>
Si vous utilisez Gmail, consultez notre <a class="alert-link" href="/guides/send-mail-as-gmail-custom-domain">Guide Envoyer des e-mails comme avec Gmail</a>. Si vous êtes développeur, consultez notre <a class="alert-link" href="/email-api#outbound-emails" target="_blank">documentation de l'API de messagerie</a>.
</span>
</div>

1. Accédez à <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Mon compte <i class="fa fa-angle-right"></i> Domaines</a> <i class="fa fa-angle-right"></i> Paramètres <i class="fa fa-angle-right"></i> Configuration SMTP sortante et suivez les instructions de configuration

2. Créez un nouvel alias pour votre domaine sous <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mon compte <i class="fa fa-angle-right"></i> Domaines</a> <i class="fa fa-angle-right"></i> Alias (par exemple <code><hello@example.com></code>)

3. Cliquez sur <strong class="text-success"><i class="fa fa-key"></i> Générer un mot de passe</strong> à côté du nouvel alias. Copiez-le dans votre presse-papiers et conservez-le précieusement.

4. À l'aide de votre application de messagerie préférée, ajoutez ou configurez un compte avec votre nouvel alias (par exemple, <code><hello@example.com></code>).
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Conseil :
</strong>
<span>Nous vous recommandons d'utiliser <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a> ou <a href="/blog/open-source" class="alert-link" target="_blank">une alternative open source et respectueuse de la vie privée</a>.</span>
</div>

5. Lorsque vous êtes invité à saisir le nom du serveur SMTP, saisissez `smtp.forwardemail.net`

6. Lorsque vous êtes invité à indiquer le port du serveur SMTP, saisissez `465` (SSL/TLS) – voir [ports SMTP alternatifs](/faq#what-are-your-smtp-server-configuration-settings) si nécessaire.
<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Conseil :
</strong>
<span>Si vous utilisez Thunderbird, assurez-vous que la « Sécurité de la connexion » est définie sur « SSL/TLS » et que la méthode d'authentification est définie sur « Mot de passe normal ».</span>
</div>

7. Lorsque vous êtes invité à saisir le mot de passe du serveur SMTP, collez le mot de passe de <strong class="text-success"><i class="fa fa-key"></i> Générer un mot de passe</strong> à l'étape 3 ci-dessus

8. **Enregistrez vos paramètres et envoyez votre premier e-mail de test** – si vous rencontrez des problèmes, veuillez <a href="/help">nous contacter</a>

<div class="alert my-3 alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Important :
</strong>
<span>
Veuillez noter que pour préserver la réputation de nos adresses IP et garantir la délivrabilité, nous appliquons un processus de vérification manuelle, domaine par domaine, pour l'approbation SMTP sortante. Ce processus prend généralement moins de 24 heures, la plupart des demandes étant traitées en 1 à 2 heures. Nous prévoyons prochainement de rendre ce processus instantané grâce à des contrôles anti-spam et des alertes supplémentaires. Ce processus garantit que vos e-mails parviennent bien en boîte de réception et qu'ils ne soient pas marqués comme spam.
</span>
</div>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Félicitations !
</strong>
<span>
Vous avez terminé toutes les étapes avec succès.
</span>
</div>
</div>

</div>

### Prenez-vous en charge OpenPGP/MIME, le chiffrement de bout en bout (« E2EE ») et le répertoire de clés Web (« WKD ») ? {#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd}

Oui, nous prenons en charge [OpenPGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy#OpenPGP), [chiffrement de bout en bout (« E2EE »)](https://en.wikipedia.org/wiki/End-to-end_encryption) et la découverte de clés publiques avec [Répertoire de clés Web (« WKD »)](https://wiki.gnupg.org/WKD). Vous pouvez configurer OpenPGP avec [keys.openpgp.org](https://keys.openpgp.org/about/usage#wkd-as-a-service) ou [hébergez vous-même vos propres clés](https://wiki.gnupg.org/WKDHosting) (voir [cet essentiel pour la configuration du serveur WKD](https://gist.github.com/kafene/0a6e259996862d35845784e6e5dbfc79)).

* Les recherches WKD sont mises en cache pendant une heure afin de garantir la livraison rapide des e-mails. Par conséquent, si vous ajoutez, modifiez ou supprimez votre clé WKD, veuillez nous envoyer un e-mail à `support@forwardemail.net` avec votre adresse e-mail afin que nous puissions purger manuellement le cache.
* Nous prenons en charge le chiffrement PGP pour les messages transférés via la recherche WKD ou à l'aide d'une clé PGP téléchargée sur notre interface.
* Les clés téléchargées sont prioritaires tant que la case PGP est cochée.
* Les messages envoyés aux webhooks ne sont actuellement pas chiffrés avec PGP.
* Si vous avez plusieurs alias correspondant à une adresse de transfert donnée (par exemple, une combinaison regex/wildcard/exact) et si plusieurs d'entre eux contiennent une clé PGP téléchargée et que PGP est coché, nous vous enverrons un e-mail d'alerte d'erreur et ne chiffrerons pas le message avec votre clé PGP téléchargée. Ce problème est très rare et ne concerne généralement que les utilisateurs expérimentés avec des règles d'alias complexes. * **Le chiffrement PGP ne sera pas appliqué aux transferts d'e-mails via nos serveurs MX si l'expéditeur a une politique de rejet DMARC. Si vous exigez le chiffrement PGP pour *tous* les messages, nous vous suggérons d'utiliser notre service IMAP et de configurer votre clé PGP pour votre alias de courrier entrant.**

**Vous pouvez valider la configuration de votre répertoire de clés Web dans <https://wkd.chimbosonic.com/> (open source) ou <https://www.webkeydirectory.com/> (propriétaire).**

<div class="alert my-3 alert-success">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Chiffrement automatique :
</strong>
<span>Si vous utilisez notre <a href="#do-you-support-sending-email-with-smtp" class="alert-link">service SMTP sortant</a> et envoyez des messages non chiffrés, nous tenterons automatiquement de chiffrer les messages pour chaque destinataire à l'aide du <a class="alert-link" href="https://wiki.gnupg.org/WKD">Web Key Directory ("WKD")</a>.</span>
</div>

<div class="alert alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Important :
</strong>
<span>
Vous devez suivre toutes les étapes suivantes afin d'activer OpenPGP pour votre nom de domaine personnalisé.
</span>
</div>

1. Téléchargez et installez le plugin recommandé par votre client de messagerie ci-dessous :

| Client de messagerie | Plate-forme | Plugin recommandé | Notes |
| --------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Thunderbird | Bureau | [Configure OpenPGP in Thunderbird](https://support.mozilla.org/en-US/kb/openpgp-thunderbird-howto-and-faq#w_i-have-never-used-openpgp-with-thunderbird-before-how-do-i-setup-openpgp) | Thunderbird dispose d'un support intégré pour OpenPGP. |
| Gmail | Navigateur | [Mailvelope](https://mailvelope.com/) ou [FlowCrypt](https://flowcrypt.com/download) (licence propriétaire) | Gmail ne prend pas en charge OpenPGP, mais vous pouvez télécharger le plugin open source [Mailvelope](https://mailvelope.com/) ou [FlowCrypt](https://flowcrypt.com/download). |
| Apple Mail | macOS | [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation) | Apple Mail ne prend pas en charge OpenPGP, mais vous pouvez télécharger le plugin open source [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation). |
| Apple Mail | iOS | [PGPro](https://github.com/opensourceios/PGPro/) ou [FlowCrypt](https://apps.apple.com/us/app/flowcrypt-encrypted-email/id1591754995) (licence propriétaire) | Apple Mail ne prend pas en charge OpenPGP, mais vous pouvez télécharger le plugin open source [PGPro](https://github.com/opensourceios/PGPro/) ou [FlowCrypt](https://flowcrypt.com/download). |
| Perspectives | Windows | [gpg4win](https://www.gpg4win.de/index.html) | Le client de messagerie de bureau Outlook ne prend pas en charge OpenPGP, mais vous pouvez télécharger le plugin open source [gpg4win](https://www.gpg4win.de/index.html). |
| Perspectives | Navigateur | [Mailvelope](https://mailvelope.com/) ou [FlowCrypt](https://flowcrypt.com/download) (licence propriétaire) | Le client de messagerie Web d'Outlook ne prend pas en charge OpenPGP, mais vous pouvez télécharger le plugin open source [Mailvelope](https://mailvelope.com/) ou [FlowCrypt](https://flowcrypt.com/download). |
| Androïde | Mobile | [OpenKeychain](https://www.openkeychain.org/) ou [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email) | [Android mail clients](/blog/open-source/android-email-clients), comme [Thunderbird Mobile](https://www.thunderbird.net/en-US/mobile/) et [FairEmail](https://github.com/M66B/FairEmail), prennent tous deux en charge le plugin open source [OpenKeychain](https://www.openkeychain.org/). Vous pouvez également utiliser le plugin open source (licence propriétaire) [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email). |
| Google Chrome | Navigateur | [Mailvelope](https://mailvelope.com/) ou [FlowCrypt](https://flowcrypt.com/download) (licence propriétaire) | Vous pouvez télécharger l'extension de navigateur open source [Mailvelope](https://mailvelope.com/) ou [FlowCrypt](https://flowcrypt.com/download). |
| Mozilla Firefox | Navigateur | [Mailvelope](https://mailvelope.com/) ou [FlowCrypt](https://flowcrypt.com/download) (licence propriétaire) | Vous pouvez télécharger l'extension de navigateur open source [Mailvelope](https://mailvelope.com/) ou [FlowCrypt](https://flowcrypt.com/download). |
| Microsoft Edge | Navigateur | [Mailvelope](https://mailvelope.com/) | Vous pouvez télécharger l'extension de navigateur open source [Mailvelope](https://mailvelope.com/). |
| Courageux | Navigateur | [Mailvelope](https://mailvelope.com/) ou [FlowCrypt](https://flowcrypt.com/download) (licence propriétaire) | Vous pouvez télécharger l'extension de navigateur open source [Mailvelope](https://mailvelope.com/) ou [FlowCrypt](https://flowcrypt.com/download). |
| Balsa | Bureau | [Configure OpenPGP in Balsa](https://www.mynetcologne.de/~nc-dreszal/balsa/balsa23-secure-mail.html#USING) | Balsa dispose d'un support intégré pour OpenPGP. |
| KMail | Bureau | [Configure OpenPGP in KMail](https://userbase.kde.org/KMail/PGP_MIME) | KMail dispose d'un support intégré pour OpenPGP. |
| GNOME Évolution | Bureau | [Configure OpenPGP in Evolution](https://help.gnome.org/users/evolution/stable/mail-encryption.html.en) | GNOME Evolution dispose d'un support intégré pour OpenPGP. |
| Terminal | Bureau | [Configure gpg in Terminal](https://docs.github.com/en/authentication/managing-commit-signature-verification/generating-a-new-gpg-key#generating-a-gpg-key) | Vous pouvez utiliser le code open source [gpg command line tool](https://www.gnupg.org/download/) pour générer une nouvelle clé à partir de la ligne de commande. |

2. Ouvrez le plugin, créez votre clé publique et configurez votre client de messagerie pour l'utiliser.

3. Téléchargez votre clé publique sur <https://keys.openpgp.org/upload>.

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Conseil :
</strong>
<span>Vous pouvez consulter <a class="alert-link" href="https://keys.openpgp.org/manage">https://keys.openpgp.org/manage</a> pour gérer votre clé ultérieurement.</span>
</div>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Module complémentaire facultatif :
</strong>
<span>
Si vous utilisez notre service de <a class="alert-link" href="/blog/docs/best-quantum-safe-encrypted-email-service">stockage chiffré (IMAP/POP3)</a> et souhaitez que <i>tous</i> les e-mails stockés dans votre base de données SQLite (déjà chiffrée) soient chiffrés avec votre clé publique, accédez à <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mon compte <i class="fa fa-angle-right"></i> Domaines</a> <i class="fa fa-angle-right"></i> Alias (par ex. <code>hello@example.com</code>) <i class="fa fa-angle-right"></i> Modifiez <i class="fa fa-angle-right"></i> OpenPGP et téléchargez votre clé publique.
</span>
</div>

4. Ajoutez un nouvel enregistrement `CNAME` à votre nom de domaine (par exemple `example.com`) :

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
Conseil :
</strong>
<span>Si votre alias utilise nos <a class="alert-link" href="/disposable-addresses" target="_blank">domaines personnalisés/jetables</a> (par exemple, <code>hideaddress.net</code>), vous pouvez ignorer cette étape.</span>
</div>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Félicitations !
</strong>
<span>
Vous avez terminé toutes les étapes avec succès.
</span>
</div>
</div>

### Prenez-vous en charge MTA-STS {#do-you-support-mta-sts}

Oui, depuis le 2 mars 2023, nous prenons en charge [MTA-STS](https://www.hardenize.com/blog/mta-sts). Vous pouvez utiliser [ce modèle](https://github.com/jpawlowski/mta-sts.template) si vous souhaitez l'activer sur votre domaine.

Notre configuration est disponible publiquement sur GitHub à l'adresse <https://github.com/forwardemail/mta-sts.forwardemail.net>.

### Prenez-vous en charge les clés d'accès et WebAuthn ? {#do-you-support-passkeys-and-webauthn}

Oui ! Depuis le 13 décembre 2023, nous avons ajouté la prise en charge des clés d'accès [en raison de la forte demande](https://github.com/orgs/forwardemail/discussions/182).

Les clés d'accès vous permettent de vous connecter en toute sécurité sans nécessiter de mot de passe ni d'authentification à deux facteurs.

Vous pouvez valider votre identité par le toucher, la reconnaissance faciale, un mot de passe basé sur l'appareil ou un code PIN.

Nous vous permettons de gérer jusqu'à 30 clés d'accès à la fois, afin que vous puissiez vous connecter facilement avec tous vos appareils.

Pour en savoir plus sur les clés d’accès, consultez les liens suivants :

* [Connectez-vous à vos applications et sites Web avec des clés d'accès](https://support.google.com/android/answer/14124480?hl=en) (Google)
* [Utilisez des clés d'accès pour vous connecter aux applications et aux sites Web sur iPhone](https://support.apple.com/guide/iphone/use-passkeys-to-sign-in-to-apps-and-websites-iphf538ea8d0/ios) (Apple)
* [Article de Wikipédia sur les clés d'accès](https://en.wikipedia.org/wiki/Passkey_\(credential\))

### Soutenez-vous les meilleures pratiques de messagerie électronique ? {#do-you-support-email-best-practices}

Oui. Nous prenons en charge les protocoles SPF, DKIM, DMARC, ARC et SRS dans tous nos forfaits. Nous avons également collaboré étroitement avec les auteurs originaux de ces spécifications et d'autres experts en messagerie électronique afin de garantir la perfection et une délivrabilité optimale.

### Prenez-vous en charge les webhooks de rebond ? {#do-you-support-bounce-webhooks}

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Conseil :
</strong>
Vous recherchez de la documentation sur les webhooks de messagerie ? Consultez la page <a href="/faq#do-you-support-webhooks" class="alert-link">Prend-vous en charge les webhooks ?</a> pour en savoir plus.
<span>
</span>
</div>

Oui, cette fonctionnalité a été ajoutée le 14 août 2024. Vous pouvez désormais accéder à Mon compte → Domaines → Paramètres → URL de webhook de rebond et configurer une URL `http://` ou `https://` à laquelle nous enverrons une requête `POST` en cas de rebond des e-mails SMTP sortants.

Cela vous est utile pour gérer et surveiller votre SMTP sortant – et peut être utilisé pour conserver les abonnés, les désinscrire et détecter chaque fois que des rebonds se produisent.

Les charges utiles du webhook Bounce sont envoyées sous forme de JSON avec ces propriétés :

* `email_id` (Chaîne) - ID e-mail correspondant à un e-mail dans Mon compte → E-mails (SMTP sortant)
* `list_id` (Chaîne) - Valeur de l'en-tête `List-ID` (insensible à la casse), le cas échéant, de l'e-mail sortant d'origine
* `list_unsubscribe` (Chaîne) - Valeur de l'en-tête `List-Unsubscribe` (insensible à la casse), le cas échéant, de l'e-mail sortant d'origine
* `feedback_id` (Chaîne) - Valeur de l'en-tête `Feedback-ID` (insensible à la casse), le cas échéant, de l'e-mail sortant d'origine
* `recipient` (Chaîne) - Adresse e-mail du destinataire ayant reçu un message d'erreur ou ayant renvoyé un e-mail
* `message` (Chaîne) - Message d'erreur détaillé concernant le message d'erreur
* `response` (Chaîne) - Message de réponse SMTP
* `list_id`0 (Nombre) - Code de réponse SMTP analysé
* `list_id`1 (Chaîne) - Si le code de réponse provient d'une source fiable, cette valeur sera renseignée avec le nom de domaine racine (par exemple, `list_id`2 ou `list_id`3)
* `list_id`4 (Objet) - Objet contenant les propriétés suivantes qui détaillent les statuts de rebond et de rejet
* `list_id`5 (Chaîne) - Action du rebond (par exemple, `list_id`6)
* `list_id`7 (Chaîne) - Motif du rebond (par exemple, `list_id`8)
* `list_id`9 (Chaîne) - Catégorie du rebond (par exemple, `List-ID`0)
* `List-ID`1 (Nombre) - Code de statut du rebond (par exemple, `List-ID`2)
* `List-ID`3 (Chaîne) - Code de rebond du message de réponse (ex. : `List-ID`4)
* `List-ID`5 (Nombre) - Numéro de ligne analysé, le cas échéant, `List-ID`6 (ex. : `List-ID`7)
* `List-ID`8 (Objet) - Paire clé-valeur des en-têtes de l'e-mail sortant
* `List-ID`9 (Chaîne) - Date au format `list_unsubscribe`0 à laquelle l'erreur de rebond s'est produite

Par exemple:

```json
{
  "email_id": "66bcce793ef7b2a0928e14ba",
  "recipient": "example@gmail.com",
  "message": "The email account that you tried to reach is over quota.",
  "response": "552 5.2.2 The email account that you tried to reach is over quota.",
  "response_code": 552,
  "truth_source": "google.com",
  "bounce": {
    "action": "reject",
    "message": "Gmail Mailbox is full",
    "category": "capacity",
    "code": 552,
    "status": "5.2.2",
    "line": 300
  },
  "headers": {},
  "bounced_at": "2024-08-24T01:50:02.828Z"
}
```

Voici quelques notes supplémentaires concernant les webhooks de rebond :

* Si la charge utile du webhook contient une valeur `list_id`, `list_unsubscribe` ou `feedback_id`, vous devez prendre les mesures appropriées pour supprimer `recipient` de la liste si nécessaire.
* Si la valeur `bounce.category` était `"block"`, `"recipient"`, `"spam"` ou `"virus"`, vous devez absolument supprimer l'utilisateur de la liste.
* Si vous devez vérifier les charges utiles du webhook (pour vous assurer qu'elles proviennent bien de notre serveur), vous pouvez utiliser [résoudre l'adresse IP du client distant et le nom d'hôte du client à l'aide d'une recherche inversée](https://nodejs.org/api/dns.html#dnspromisesreverseip) ; il devrait s'agir de `list_unsubscribe`0.
* Vous pouvez également comparer l'adresse IP avec `list_unsubscribe`1.
* Accédez à Mon compte → Domaines → Paramètres → Clé de vérification de la charge utile de signature du webhook pour obtenir votre clé de webhook.
* Vous pouvez faire tourner cette clé à tout moment pour des raisons de sécurité.
* Calculez et comparez la valeur `list_unsubscribe`2 de notre requête webhook avec la valeur du corps calculée à l'aide de cette clé. Un exemple est disponible à l'adresse `list_unsubscribe`3.
* Consultez la discussion à l'adresse <`list_unsubscribe`4 pour plus d'informations.
* Nous attendrons jusqu'à `list_unsubscribe`5 secondes que votre point de terminaison webhook réponde avec un code d'état `list_unsubscribe`6, puis nous réessayerons jusqu'à `list_unsubscribe`7 secondes.
* Si nous détectons une erreur dans l'URL de votre webhook de rebond lors de l'envoi d'une requête, nous vous enverrons un e-mail de courtoisie une fois par semaine.

### Prenez-vous en charge les webhooks {#do-you-support-webhooks}

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Astuce :
</strong>
Vous recherchez de la documentation sur les webhooks de rebond ? Consultez la page <a href="/faq#do-you-support-bounce-webhooks" class="alert-link">Prend-vous en charge les webhooks de rebond ?</a> pour en savoir plus.
<span>
</span>
</div>

Oui, cette fonctionnalité est disponible depuis le 15 mai 2020. Vous pouvez ajouter des webhooks comme vous le feriez avec n'importe quel destinataire ! Assurez-vous que l'URL du webhook comporte le préfixe « http » ou « https ».

<div class="alert my-3 alert-danger">
<i class="fa fa-stop-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Protection renforcée de la confidentialité :
</strong>
<span>
Si vous avez souscrit à un forfait payant (avec protection renforcée de la confidentialité), accédez à <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mon compte <i class="fa fa-angle-right"></i> Domaines</a> et cliquez sur « Alias » à côté de votre domaine pour configurer vos webhooks. Pour en savoir plus sur les forfaits payants, consultez notre page <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Tarifs</a>. Sinon, suivez les instructions ci-dessous.
</span>
</div>

Si vous utilisez le forfait gratuit, ajoutez simplement un nouvel enregistrement DNS <strong class="notranslate">TXT</strong> comme indiqué ci-dessous :

Par exemple, si je souhaite que tous les e-mails envoyés à `alias@example.com` soient transférés vers un nouveau point de terminaison de test [demande de corbeille](https://requestbin.com/r/en8pfhdgcculn?inspect) :

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
<td><em>"@", "." ou vide</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=alias:https://requestbin.com/r/en8pfhdgcculn</code></td>
</tr>
</tbody>
</table>

Ou peut-être souhaitez-vous que tous les e-mails envoyés à `example.com` soient transférés vers ce point de terminaison :

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
<td><em>"@", "." ou vide</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=https://requestbin.com/r/en8pfhdgcculn</code></td>
</tr>
</tbody>
</table>

**Voici des notes supplémentaires concernant les webhooks :**

* Si vous devez vérifier les charges utiles des webhooks (pour vous assurer qu'elles proviennent bien de notre serveur), utilisez [résoudre l'adresse IP du client distant et le nom d'hôte du client à l'aide d'une recherche inversée](https://nodejs.org/api/dns.html#dnspromisesreverseip) ; il peut s'agir de `mx1.forwardemail.net` ou `mx2.forwardemail.net`.
* Vous pouvez également comparer l'adresse IP avec [nos adresses IP publiées](#what-are-your-servers-ip-addresses).
* Si vous avez un forfait payant, accédez à Mon compte → Domaines → Paramètres → Clé de vérification de la charge utile de signature webhook pour obtenir votre clé webhook.
* Vous pouvez faire tourner cette clé à tout moment pour des raisons de sécurité.
* Calculez et comparez la valeur `X-Webhook-Signature` de notre requête webhook avec la valeur du corps calculée à l'aide de cette clé. Un exemple est disponible à [cet article Stack Overflow](https://stackoverflow.com/a/68885281).
* Consultez la discussion à <https://github.com/forwardemail/free-email-forwarding/issues/235> pour plus d'informations.
* Si un webhook ne répond pas avec le code d'état `200`, nous stockons sa réponse dans le fichier [journal des erreurs créé](#do-you-store-error-logs), ce qui est utile pour le débogage.
* Les requêtes HTTP webhook effectuent jusqu'à 3 tentatives de connexion SMTP, avec un délai d'expiration maximal de 60 secondes par requête POST de point de terminaison. **Notez que cela ne signifie pas que le webhook effectue seulement 3 tentatives**. Il effectue en fait des tentatives continues en envoyant un code SMTP 421 (indiquant à l'expéditeur de réessayer ultérieurement) après la troisième tentative de requête HTTP POST infructueuse. Cela signifie que l'e-mail effectuera des tentatives continues pendant plusieurs jours jusqu'à l'obtention du code d'état 200.
* Nous effectuons des tentatives automatiques en fonction des codes d'état et d'erreur par défaut utilisés dans [méthode de nouvelle tentative du superagent](https://ladjs.github.io/superagent/#retrying-requests) (nous en assurons la maintenance).
* Nous regroupons les requêtes HTTP webhook destinées au même point de terminaison en une seule requête (au lieu de plusieurs) afin d'économiser des ressources et d'accélérer les temps de réponse. Par exemple, si vous envoyez un e-mail à <webhook1@example.com>, <webhook2@example.com> et <webhook3@example.com>, et que tous ces e-mails sont configurés pour atteindre la même URL de point de terminaison *exacte*, une seule requête sera effectuée. Nous regroupons les messages par correspondance exacte de point de terminaison avec une égalité stricte.
* Notez que nous utilisons la méthode « simpleParser » de la bibliothèque `mx1.forwardemail.net`0 pour analyser le message et le convertir en un objet compatible JSON.
* La valeur brute de l'e-mail, sous forme de chaîne, est indiquée par la propriété « raw ».
* Les résultats d'authentification sont indiqués par les propriétés « dkim », « spf », « arc », « dmarc » et « bimi ».
* Les en-têtes d'e-mail analysés sont indiqués par la propriété « headers ». Notez également que vous pouvez utiliser « headerLines » pour faciliter l'itération et l'analyse.
* Les destinataires groupés pour ce webhook sont regroupés et indiqués dans la propriété « recipients ».
* Les informations de session SMTP sont indiquées dans la propriété « session ». Celle-ci contient des informations sur l'expéditeur du message, son heure d'arrivée, son HELO et le nom d'hôte du client. La valeur du nom d'hôte du client, `mx1.forwardemail.net`1, correspond soit au nom de domaine complet (issu d'une recherche PTR inversée), soit à `mx1.forwardemail.net`2 entre crochets (par exemple, `mx1.forwardemail.net`3).
* Pour obtenir rapidement la valeur de `mx1.forwardemail.net`4, vous pouvez utiliser la valeur de `mx1.forwardemail.net`5 (voir l'exemple ci-dessous). L'en-tête `mx1.forwardemail.net`6 est un en-tête que nous ajoutons aux messages pour le débogage avec le destinataire d'origine (avant le transfert masqué).
* Si vous devez supprimer les propriétés `mx1.forwardemail.net`7 et/ou `mx1.forwardemail.net`8 du corps de la charge utile, ajoutez simplement `mx1.forwardemail.net`9, `mx2.forwardemail.net`0 ou `mx2.forwardemail.net`1 à votre point de terminaison webhook en tant que paramètre de chaîne de requête (par exemple, `mx2.forwardemail.net`2).
* Si des pièces jointes sont présentes, elles seront ajoutées au tableau `mx2.forwardemail.net`3 avec les valeurs du tampon. Vous pouvez les analyser et les convertir en contenu en utilisant une approche JavaScript, comme :

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
Astuce :
</strong>
Vous êtes curieux de savoir à quoi ressemble la requête webhook des e-mails transférés ? Nous avons inclus un exemple ci-dessous !
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

### Prenez-vous en charge les expressions régulières ou regex {#do-you-support-regular-expressions-or-regex}

Oui, cette fonctionnalité est disponible depuis le 27 septembre 2021. Vous pouvez simplement écrire des expressions régulières (« regex ») pour faire correspondre des alias et effectuer des substitutions.

Les alias pris en charge par les expressions régulières commencent par `/` et se terminent par `/`, et leurs destinataires sont des adresses e-mail ou des webhooks. Les destinataires peuvent également inclure la prise en charge de la substitution d'expressions régulières (par exemple, `$1`, `$2`).

Nous prenons en charge deux indicateurs d'expression régulière : `i` et `g`. L'indicateur `i`, insensible à la casse, est une valeur par défaut permanente et toujours appliquée. Vous pouvez ajouter l'indicateur global `g` en ajoutant `/g` à la terminaison `/`.

Notez que nous prenons également en charge notre <a href="#can-i-disable-specific-aliases">disabled alias feature</a> pour la partie destinataire avec notre prise en charge regex.

Les expressions régulières ne sont pas prises en charge sur les <a href="/disposable-addresses" target="_blank">domaines de vanité globaux</a> (car cela pourrait constituer une vulnérabilité de sécurité).

<div class="alert my-3 alert-danger">
<i class="fa fa-stop-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Protection renforcée de la confidentialité :
</strong>
<span>
Si vous avez souscrit à un forfait payant (avec protection renforcée de la confidentialité), accédez à <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mon compte <i class="fa fa-angle-right"></i> Domaines</a> et cliquez sur « Alias » à côté de votre domaine pour configurer les expressions régulières. Pour en savoir plus sur les forfaits payants, consultez notre page <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Tarifs</a>. Sinon, suivez les instructions ci-dessous.
</span>
</div>

Si vous utilisez le forfait gratuit, ajoutez simplement un nouvel enregistrement DNS <strong class="notranslate">TXT</strong> en utilisant un ou plusieurs des exemples fournis ci-dessous :

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Exemple simple :</strong> Si je souhaite que tous les e-mails destinés à `linus@example.com` ou `torvalds@example.com` soient transférés vers `user@gmail.com` :
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
<td><em>"@", "." ou vide</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^(linus|torvalds)$/:user@gmail.com</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Exemple de substitution prénom/nom :</strong> Imaginez que toutes les adresses e-mail de votre entreprise utilisent le format `firstname.lastname@example.com`. Si je souhaite que tous les e-mails utilisant le format `firstname.lastname@example.com` soient transférés vers `firstname.lastname@company.com` avec prise en charge de la substitution (<a href="https://regexr.com/66hnu" class="alert-link">voir le test sur RegExr</a>) :
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
<td><em>"@", "." ou vide</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^([A-Za-z]+)+\.([A-Za-z]+)+$/:$1.$2@company.com</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Exemple de substitution de filtrage de symboles Plus :</strong> Si je souhaite que tous les e-mails destinés à `info@example.com` ou `support@example.com` soient transférés respectivement à `user+info@gmail.com` ou `user+support@gmail.com` (avec prise en charge de la substitution) (<a href="https://regexr.com/66ho7" class="alert-link">voir le test sur RegExr</a>) :
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
<td><em>"@", "." ou vide</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^(support|info)$/:user+$1@gmail.com</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Exemple de substitution de chaîne de requête webhook :</strong> Vous souhaitez peut-être que tous les e-mails destinés à `example.com` soient dirigés vers un <a href="#do-you-support-webhooks" class="alert-link">webhook</a> et possèdent une clé de chaîne de requête dynamique de « to » avec comme valeur la partie nom d'utilisateur de l'adresse e-mail (<a href="https://regexr.com/66ho4" class="alert-link">voir le test sur RegExr</a>) :
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
<td><em>"@", "." ou vide</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^(.*?)$/:https://example.com/webhook?username=$1</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Exemple de rejet silencieux :</strong> Si vous souhaitez que tous les e-mails correspondant à un certain modèle soient désactivés et rejetés silencieusement (le message semble avoir été envoyé avec succès, mais ne mène à rien) avec le code d'état `250` (voir <a href="#can-i-disable-specific-aliases" class="alert-link">Puis-je désactiver des alias spécifiques</a>), utilisez simplement la même approche avec un point d'exclamation « ! ». Cela indique à l'expéditeur que le message a bien été délivré, mais qu'il n'a abouti à rien (par exemple, blackhole ou `/dev/null`).
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
<td><em>"@", "." ou vide</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^(linus|torvalds)$/:!</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Exemple de rejet automatique :</strong> Si vous souhaitez que tous les e-mails correspondant à un certain modèle soient désactivés et automatiquement rejetés avec le code d'état `421` (voir <a href="#can-i-disable-specific-aliases" class="alert-link">Puis-je désactiver des alias spécifiques</a>), utilisez simplement la même approche avec un double point d'exclamation « !! ». Cela indique à l'expéditeur de réessayer son e-mail. Les e-mails destinés à cet alias seront réessayés pendant environ 5 jours, puis rejetés définitivement.
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
<td><em>"@", "." ou vide</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^(linus|torvalds)$/:!!</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Exemple de rejet définitif :</strong> Si vous souhaitez que tous les e-mails correspondant à un certain modèle soient désactivés et rejetés définitivement avec le code d'état `550` (voir <a href="#can-i-disable-specific-aliases" class="alert-link">Puis-je désactiver des alias spécifiques</a>), utilisez simplement la même approche avec un triple point d'exclamation « !!! ». Cela indique à l'expéditeur une erreur permanente et les e-mails ne seront pas réessayés ; ils seront rejetés pour cet alias.
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
Astuce :
</strong>
Vous souhaitez savoir comment écrire une expression régulière ou tester votre remplacement ? Rendez-vous sur le site web gratuit de test d'expressions régulières <a href="https://regexr.com" class="alert-link">RegExr</a> à l'adresse <a href="https://regexr.com/" class="alert-link">https://regexr.com</a>.
<span>
</span>
</div>

### Quelles sont vos limites SMTP sortantes {#what-are-your-outbound-smtp-limits}

Nous limitons les utilisateurs et les domaines à 300 messages SMTP sortants par jour. Cela représente en moyenne plus de 9 000 e-mails par mois. Si vous devez dépasser ce nombre ou si vous recevez régulièrement des e-mails volumineux, veuillez utiliser [Contactez-nous](https://forwardemail.net/help).

### Ai-je besoin d'une approbation pour activer SMTP {#do-i-need-approval-to-enable-smtp}

Oui, veuillez noter que pour préserver la réputation de votre adresse IP et garantir sa délivrabilité, Forward Email applique un processus de vérification manuelle par domaine pour l'approbation SMTP sortant. Envoyez un e-mail à <support@forwardemail.net> ou ouvrez un [demande d'aide](https://forwardemail.net/help) pour approbation. Ce processus prend généralement moins de 24 heures, la plupart des demandes étant traitées en une à deux heures. Nous prévoyons prochainement de rendre ce processus instantané grâce à des contrôles anti-spam et des alertes supplémentaires. Ce processus garantit que vos e-mails arrivent bien en boîte de réception et qu'ils ne soient pas marqués comme spam.

### Quels sont les paramètres de configuration de votre serveur SMTP ? {#what-are-your-smtp-server-configuration-settings}

Notre serveur est `smtp.forwardemail.net` et est également surveillé sur notre <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">page d'état</a>.

Il prend en charge IPv4 et IPv6 et est disponible sur les ports `465` et `2465` pour SSL/TLS et `587`, `2587`, `2525` et `25` pour TLS (STARTTLS).

| Protocole | Nom d'hôte | Ports | IPv4 | IPv6 |
| :--------------------------------------------------------------: | ----------------------- | :-------------------------: | :----------------: | :----------------: |
| `SSL/TLS` **Préféré** | `smtp.forwardemail.net` | `465`, `2465` | :white_check_mark: | :white_check_mark: |
| `TLS` ([STARTTLS](https://wikipedia.org/wiki/Opportunistic_TLS)) | `smtp.forwardemail.net` | `587`, `2587`, `2525`, `25` | :white_check_mark: | :white_check_mark: |

| Se connecter | Exemple | Description |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nom d'utilisateur | `user@example.com` | Adresse e-mail d'un alias qui existe pour le domaine dans <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mon compte <i class="fa fa-angle-right"></i> Domaines</a>. |
| Mot de passe | `************************` | Mot de passe généré spécifique à l'alias. |

Pour envoyer des e-mails sortants avec SMTP, l'**utilisateur SMTP** doit être l'adresse e-mail d'un alias qui existe pour le domaine dans <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mon compte <i class="fa fa-angle-right"></i> Domaines</a> – et le **mot de passe SMTP** doit être un mot de passe généré spécifique à l'alias.

Veuillez vous référer à [Prenez-vous en charge l'envoi d'e-mails avec SMTP ?](#do-you-support-sending-email-with-smtp) pour obtenir des instructions étape par étape.

### Quels sont les paramètres de configuration de votre serveur IMAP ? {#what-are-your-imap-server-configuration-settings}

Notre serveur est `imap.forwardemail.net` et est également surveillé sur notre <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">page d'état</a>.

Il prend en charge IPv4 et IPv6 et est disponible sur les ports `993` et `2993` pour SSL/TLS.

| Protocole | Nom d'hôte | Ports | IPv4 | IPv6 |
| :---------------------: | ----------------------- | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **Préféré** | `imap.forwardemail.net` | `993`, `2993` | :white_check_mark: | :white_check_mark: |

| Se connecter | Exemple | Description |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nom d'utilisateur | `user@example.com` | Adresse e-mail d'un alias qui existe pour le domaine dans <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mon compte <i class="fa fa-angle-right"></i> Domaines</a>. |
| Mot de passe | `************************` | Mot de passe généré spécifique à l'alias. |

Pour se connecter avec IMAP, l'**utilisateur IMAP** doit être l'adresse e-mail d'un alias qui existe pour le domaine dans <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mon compte <i class="fa fa-angle-right"></i> Domaines</a> – et le **mot de passe IMAP** doit être un mot de passe généré spécifique à l'alias.

Veuillez vous référer à [Prenez-vous en charge la réception d'e-mails avec IMAP ?](#do-you-support-receiving-email-with-imap) pour obtenir des instructions étape par étape.

### Quels sont les paramètres de configuration de votre serveur POP3 ? {#what-are-your-pop3-server-configuration-settings}

Notre serveur est `pop3.forwardemail.net` et est également surveillé sur notre <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">page d'état</a>.

Il prend en charge IPv4 et IPv6 et est disponible sur les ports `995` et `2995` pour SSL/TLS.

| Protocole | Nom d'hôte | Ports | IPv4 | IPv6 |
| :---------------------: | ----------------------- | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **Préféré** | `pop3.forwardemail.net` | `995`, `2995` | :white_check_mark: | :white_check_mark: |

| Se connecter | Exemple | Description |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nom d'utilisateur | `user@example.com` | Adresse e-mail d'un alias qui existe pour le domaine dans <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mon compte <i class="fa fa-angle-right"></i> Domaines</a>. |
| Mot de passe | `************************` | Mot de passe généré spécifique à l'alias. |

Pour se connecter avec POP3, l'**utilisateur POP3** doit être l'adresse e-mail d'un alias qui existe pour le domaine dans <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Mon compte <i class="fa fa-angle-right"></i> Domaines</a> – et le **mot de passe IMAP** doit être un mot de passe généré spécifique à l'alias.

Veuillez vous référer à [Supportez-vous POP3](#do-you-support-pop3) pour obtenir des instructions étape par étape.

### Configuration du relais SMTP Postfix {#postfix-smtp-relay-configuration}

Vous pouvez configurer Postfix pour relayer les e-mails via les serveurs SMTP de Forward Email. Ceci est utile pour les applications serveur qui doivent envoyer des e-mails.

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Temps d'installation estimé :</strong>
<span>Moins de 15 minutes</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Important :
</strong>
<span>
Ceci nécessite un forfait payant avec accès SMTP activé.
</span>
</div>

#### Installation de {#installation}

1. Installez Postfix sur votre serveur :

```bash
# Ubuntu/Debian
sudo apt update && sudo apt install postfix

# CentOS/RHEL
sudo yum install postfix

# macOS
brew install postfix
```

2. Lors de l'installation, sélectionnez « Site Internet » lorsque vous êtes invité à choisir le type de configuration.

#### Configuration de {#configuration}

1. Modifiez le fichier de configuration principal de Postfix :

```bash
sudo nano /etc/postfix/main.cf
```

2. Ajoutez ou modifiez ces paramètres :

```
# SMTP relay configuration
relayhost = [smtp.forwardemail.net]:587
smtp_use_tls = yes
smtp_sasl_auth_enable = yes
smtp_sasl_password_maps = hash:/etc/postfix/sasl_passwd
smtp_sasl_security_options = noanonymous
smtp_tls_CAfile = /etc/ssl/certs/ca-certificates.crt
```

3. Créez le fichier de mot de passe SASL :

```bash
sudo nano /etc/postfix/sasl_passwd
```

4. Ajoutez vos informations d'identification de transfert d'e-mail :

```
[smtp.forwardemail.net]:587 your-alias@yourdomain.com:your-generated-password
```

5. Sécurisez et hachez le fichier de mot de passe :

```bash
sudo chmod 600 /etc/postfix/sasl_passwd
sudo postmap /etc/postfix/sasl_passwd
```

6. Redémarrez Postfix :

```bash
sudo systemctl restart postfix
```

#### Test de {#testing}

Testez votre configuration en envoyant un email de test :

```bash
echo "Test email body" | mail -s "Test Subject" recipient@example.com
```

## Sécurité {#security}

### Techniques avancées de renforcement du serveur {#advanced-server-hardening-techniques}

> \[!TIP]
> En savoir plus sur notre infrastructure de sécurité sur [notre page Sécurité](/security).

Forward Email met en œuvre de nombreuses techniques de renforcement du serveur pour assurer la sécurité de notre infrastructure et de vos données :

1. **Sécurité réseau** :
* Pare-feu avec tables IP et règles strictes
* Fail2ban pour la protection contre les attaques par force brute
* Audits de sécurité et tests d'intrusion réguliers
* Accès administrateur uniquement via VPN

2. **Renforcement du système** :
* Installation minimale de paquets
* Mises à jour de sécurité régulières
* SELinux en mode forcé
* Accès SSH root désactivé
* Authentification par clé uniquement

3. **Sécurité des applications** :
* En-têtes de politique de sécurité du contenu (CSP)
* Sécurité de transport HTTPS stricte (HSTS)
* En-têtes de protection XSS
* Options de trame et en-têtes de politique de référencement
* Audits de dépendances réguliers

4. **Protection des données** :
* Chiffrement intégral du disque avec LUKS
* Gestion sécurisée des clés
* Sauvegardes régulières avec chiffrement
* Pratiques de minimisation des données

5. **Surveillance et réponse** :
* Détection d'intrusion en temps réel
* Analyse de sécurité automatisée
* Journalisation et analyse centralisées
* Procédures de réponse aux incidents

> \[!IMPORTANT]
> Nos pratiques de sécurité sont continuellement mises à jour pour faire face aux menaces et vulnérabilités émergentes.

> \[!TIP]
> Pour une sécurité maximale, nous vous recommandons d'utiliser notre service avec chiffrement de bout en bout via OpenPGP.

### Avez-vous des certifications SOC 2 ou ISO 27001 ? {#do-you-have-soc-2-or-iso-27001-certifications}

> \[!NOTE]
> Forward Email fonctionne sur une infrastructure fournie par des sous-traitants certifiés afin de garantir la conformité aux normes du secteur.

Forward Email ne détient pas directement les certifications SOC 2 Type II ni ISO 27001. Cependant, le service fonctionne sur une infrastructure fournie par des sous-traitants certifiés :

* **DigitalOcean** : certifié SOC 2 Type II et SOC 3 Type II (audité par Schellman & Company LLC), certifié ISO 27001 dans plusieurs centres de données. Détails : <https://www.digitalocean.com/trust/certification-reports>

* **Vultr** : certifié SOC 2+ (HIPAA), certifications ISO/IEC : 20000-1:2018, 27001:2022, 27017:2015, 27018:2019. Détails : <https://www.vultr.com/legal/compliance/>

* **DataPacket** : fournisseur d'infrastructures de niveau entreprise (site de Denver), conforme à la norme SOC 2 (contactez DataPacket directement pour obtenir la certification). Détails : <https://www.datapacket.com/datacenters/denver>

Forward Email suit les meilleures pratiques du secteur en matière d'audits de sécurité et collabore régulièrement avec des chercheurs en sécurité indépendants. Source : <https://forwardemail.net/technical-whitepaper.pdf#page=36>

### Utilisez-vous le cryptage TLS pour le transfert des e-mails ? {#do-you-use-tls-encryption-for-email-forwarding}

Oui. Forward Email applique strictement TLS 1.2+ pour toutes les connexions (HTTPS, SMTP, IMAP, POP3) et implémente MTA-STS pour une prise en charge TLS améliorée. Cette implémentation comprend :

* Application de TLS 1.2+ pour toutes les connexions de messagerie
* Échange de clés ECDHE (Elliptic Curve Diffie-Hellman Ephemeral) pour une confidentialité persistante parfaite
* Suites de chiffrement modernes avec mises à jour de sécurité régulières
* Prise en charge de HTTP/2 pour des performances et une sécurité améliorées
* HSTS (HTTP Strict Transport Security) avec préchargement dans les principaux navigateurs
* **MTA-STS (Mail Transfer Agent Strict Transport Security)** pour une application TLS stricte

Source : <https://forwardemail.net/technical-whitepaper.pdf#page=25>

**Implémentation MTA-STS** : Forward Email applique une application stricte de MTA-STS dans le code source. En cas d'erreurs TLS et d'application de MTA-STS, le système renvoie des codes d'état SMTP 421 pour garantir que les e-mails seront réessayés ultérieurement plutôt que d'être distribués de manière non sécurisée. Détails de l'implémentation :

* Détection d'erreur TLS : <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-tls-error.js>
* Application de la norme MTA-STS dans l'assistant d'envoi d'e-mails : <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/send-email.js>

Validation par un tiers : <https://www.hardenize.com/report/forwardemail.net/1750312779> affiche des notes « Bon » pour toutes les mesures de sécurité TLS et de transport.

### Conservez-vous les en-têtes d'authentification des e-mails ? {#do-you-preserve-email-authentication-headers}

Oui. Forward Email implémente et préserve intégralement les en-têtes d'authentification des e-mails :

* **SPF (Sender Policy Framework)** : Implémentation et préservation correctes
* **DKIM (DomainKeys Identified Mail)** : Prise en charge complète avec gestion des clés appropriée
* **DMARC** : Application des politiques pour les e-mails qui échouent à la validation SPF ou DKIM
* **ARC** : Bien que non explicitement détaillé, le score de conformité parfait du service suggère une gestion complète des en-têtes d'authentification

Source : <https://forwardemail.net/technical-whitepaper.pdf#page=31>

Validation : Le test de messagerie Internet.nl affiche un score de 100/100 pour la mise en œuvre de « SPF, DKIM et DMARC ». L’évaluation Hardenize confirme les notes « Bon » pour SPF et DMARC : <https://www.hardenize.com/report/forwardemail.net/1750312779>

### Conservez-vous les en-têtes d'e-mail d'origine et empêchez-vous l'usurpation d'identité ? {#do-you-preserve-original-email-headers-and-prevent-spoofing}

> \[!TIP]
> Forward Email met en œuvre une protection anti-usurpation sophistiquée pour empêcher les abus de messagerie.

Forward Email préserve les en-têtes d'e-mail d'origine tout en mettant en œuvre une protection anti-usurpation d'identité complète via la base de code MX :

* **Préservation des en-têtes** : Les en-têtes d'authentification d'origine sont conservés pendant le transfert.
* **Anti-usurpation d'identité** : L'application de la politique DMARC empêche l'usurpation d'identité en rejetant les e-mails qui échouent à la validation SPF ou DKIM.
* **Prévention des injections d'en-têtes** : Validation et nettoyage des entrées à l'aide de la bibliothèque Striptags.
* **Protection avancée** : Détection sophistiquée du phishing avec détection d'usurpation d'identité, prévention de l'usurpation d'identité et systèmes de notification des utilisateurs.

**Détails d'implémentation MX** : La logique de traitement des e-mails principale est gérée par la base de code du serveur MX, en particulier :

* Gestionnaire de données MX principal : <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>
* Filtrage arbitraire des e-mails (anti-usurpation d'identité) : <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-arbitrary.js>

L'assistant `isArbitrary` implémente des règles anti-usurpation sophistiquées, notamment la détection de l'usurpation d'identité de domaine, des phrases bloquées et de divers modèles de phishing.

Source : <https://forwardemail.net/technical-whitepaper.pdf#page=32>

### Comment vous protéger contre le spam et les abus {#how-do-you-protect-against-spam-and-abuse}

Forward Email met en œuvre une protection multicouche complète :

* **Limitation de débit** : appliquée aux tentatives d'authentification, aux points de terminaison d'API et aux connexions SMTP
* **Isolation des ressources** : entre les utilisateurs pour éviter l'impact des utilisateurs à volume élevé
* **Protection DDoS** : protection multicouche grâce au système Shield de DataPacket et à Cloudflare
* **Mise à l'échelle automatique** : ajustement dynamique des ressources en fonction de la demande
* **Prévention des abus** : contrôles de prévention des abus spécifiques à chaque utilisateur et blocage des contenus malveillants basé sur le hachage
* **Authentification des e-mails** : protocoles SPF, DKIM, DMARC avec détection avancée du phishing

Sources :

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver> (Détails de la protection DDoS)
* <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/abuse-prevention-by-user-id.js>

### Stockez-vous le contenu des e-mails sur le disque ? {#do-you-store-email-content-on-disk}

> \[!IMPORTANT]
> Forward Email utilise une architecture à connaissance nulle qui empêche l'écriture du contenu des e-mails sur le disque.

* **Architecture à connaissance nulle** : Les boîtes aux lettres SQLite chiffrées individuellement empêchent le transfert d'e-mails d'accéder à leur contenu.
* **Traitement en mémoire** : Le traitement des e-mails s'effectue entièrement en mémoire, évitant ainsi le stockage sur disque.
* **Aucune journalisation de contenu** : « Nous n'enregistrons ni ne stockons le contenu ni les métadonnées des e-mails sur le disque. »
* **Chiffrement en bac à sable** : Les clés de chiffrement ne sont jamais stockées en clair sur le disque.

**Preuve du code source MX** : Le serveur MX traite les e-mails entièrement en mémoire, sans écrire de contenu sur le disque. Le gestionnaire principal de traitement des e-mails illustre cette approche en mémoire : <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

Sources :

* <https://forwardemail.net/technical-whitepaper.pdf#page=10> (Résumé)
* <https://forwardemail.net/technical-whitepaper.pdf#page=59> (Détails à divulgation nulle de connaissance)
* <https://forwardemail.net/technical-whitepaper.pdf#page=21> (Chiffrement en sandbox)

### Le contenu des e-mails peut-il être exposé lors de pannes du système ? {#can-email-content-be-exposed-during-system-crashes}

Non. Forward Email met en œuvre des mesures de protection complètes contre l'exposition des données liées aux pannes :

* **Vidages mémoire désactivés** : Empêche l'exposition de la mémoire en cas de panne
* **Mémoire d'échange désactivée** : Complètement désactivée pour empêcher l'extraction de données sensibles à partir des fichiers d'échange
* **Architecture en mémoire** : Le contenu des e-mails n'existe que dans la mémoire volatile pendant le traitement
* **Protection par clé de chiffrement** : Les clés ne sont jamais stockées sur le disque en clair
* **Sécurité physique** : Les disques chiffrés LUKS v2 empêchent l'accès physique aux données
* **Stockage USB désactivé** : Empêche l'extraction de données non autorisée

**Gestion des erreurs pour les problèmes système** : Forward Email utilise les fonctions d'assistance `isCodeBug` et `isTimeoutError` pour garantir qu'en cas de problèmes de connectivité à la base de données, de problèmes de réseau DNS/liste de blocage ou de problèmes de connectivité en amont, le système renvoie les codes d'état SMTP 421 pour garantir que les e-mails seront réessayés ultérieurement plutôt que d'être perdus ou exposés.

Détails de mise en œuvre :

* Classification des erreurs : <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js>
* Gestion des erreurs de dépassement de délai lors du traitement MX : <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

Source : <https://forwardemail.net/technical-whitepaper.pdf#page=15>

### Qui a accès à votre infrastructure de messagerie ? {#who-has-access-to-your-email-infrastructure}

Forward Email met en œuvre des contrôles d'accès complets pour l'accès de son équipe d'ingénierie minimale de 2 à 3 personnes avec des exigences 2FA strictes :

* **Contrôle d'accès basé sur les rôles** : Pour les comptes d'équipe avec autorisations basées sur les ressources
* **Principe du moindre privilège** : Appliqué à tous les systèmes
* **Séparation des tâches** : Entre les rôles opérationnels
* **Gestion des utilisateurs** : Séparez les utilisateurs de déploiement et de développement avec des autorisations distinctes
* **Connexion root désactivée** : Force l'accès via des comptes correctement authentifiés
* **2FA stricte** : Pas de 2FA par SMS en raison du risque d'attaques MiTM ; uniquement des jetons basés sur les applications ou le matériel
* **Journal d'audit complet** : Avec suppression des données sensibles
* **Détection automatique des anomalies** : Pour les schémas d'accès inhabituels
* **Examens de sécurité réguliers** : Des journaux d'accès
* **Prévention des attaques Evil Maid** : Désactivation du stockage USB et autres mesures de sécurité physique

Sources :

* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (Contrôles d'autorisation)
* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (Sécurité réseau)
* <https://forwardemail.net/technical-whitepaper.pdf#page=15> (Prévention des attaques de type « maid malveillante »)

### Quels fournisseurs d'infrastructure utilisez-vous ? {#what-infrastructure-providers-do-you-use}

> \[!IMPORTANT]
> Forward Email utilise plusieurs sous-traitants d'infrastructure dotés de certifications de conformité complètes.

Tous les détails sont disponibles sur notre page de conformité au RGPD : <https://forwardemail.net/gdpr>

**Sous-traitants d'infrastructure principale :**

| Fournisseur | Cadre de protection des données certifié | Page de conformité au RGPD |
| ---------------- | -------------------------------- | ----------------------------------------------- |
| **Cloudflare** | ✅ Oui | <https://www.cloudflare.com/trust-hub/gdpr/> |
| **Paquet de données** | ❌ Non | <https://www.datapacket.com/privacy-policy> |
| **DigitalOcean** | ❌ Non | <https://www.digitalocean.com/legal/gdpr> |
| **Vultr** | ❌ Non | <https://www.vultr.com/legal/eea-gdpr-privacy/> |

**Certifications détaillées :**

**DigitalOcean**

* SOC 2 Type II et SOC 3 Type II (audités par Schellman & Company LLC)
* Certifié ISO 27001 dans plusieurs centres de données
* Conforme à la norme PCI-DSS
* Certifié CSA STAR Niveau 1
* Certifié APEC CBPR PRP
* Détails : <https://www.digitalocean.com/trust/certification-reports>

**Vultr**

* Certifié SOC 2+ (HIPAA)
* Conforme aux normes PCI Merchant
* Certifié CSA STAR Niveau 1
* ISO/IEC 20000-1:2018, 27001:2022, 27017:2015, 27018:2019
* Détails : <https://www.vultr.com/legal/compliance/>

**Paquet de données**

* Conforme à la norme SOC 2 (contactez DataPacket directement pour obtenir la certification)
* Infrastructure de niveau entreprise (site de Denver)
* Protection DDoS grâce à la pile de cybersécurité Shield
* Assistance technique 24h/24 et 7j/7
* Réseau mondial de 58 centres de données
* Détails : <https://www.datapacket.com/datacenters/denver>

**Processeurs de paiement :**

* **Stripe** : Certifié Data Privacy Framework - <https://stripe.com/legal/privacy-center>
* **PayPal** : Non certifié DPF - <https://www.paypal.com/uk/legalhub/privacy-full>

### Proposez-vous un accord de traitement des données (DPA) {#do-you-offer-a-data-processing-agreement-dpa}

Oui, Forward Email propose un accord de traitement des données (ATD) complet, qui peut être signé avec notre contrat d'entreprise. Une copie de cet accord est disponible à l'adresse suivante : <https://forwardemail.net/dpa>

**Détails de la DPA :**

* Couvre la conformité au RGPD et les cadres du bouclier de protection des données UE-États-Unis/Suisse-États-Unis
* Acceptation automatique lors de l'acceptation de nos Conditions d'utilisation
* Aucune signature séparée requise pour un accord de protection des données standard
* Accords de protection des données personnalisés disponibles via la licence Entreprise

**Cadre de conformité au RGPD** :
Notre DPA détaille la conformité au RGPD ainsi que les exigences internationales en matière de transfert de données. Des informations complètes sont disponibles à l'adresse : <https://forwardemail.net/gdpr>

Pour les clients d'entreprise nécessitant des conditions DPA personnalisées ou des accords contractuels spécifiques, ces conditions peuvent être traitées via notre programme **Licence d'entreprise (250 $/mois)**.

### Comment gérez-vous les notifications de violation de données ? {#how-do-you-handle-data-breach-notifications}

> \[!NOTE]
> L'architecture à connaissance nulle de Forward Email limite considérablement l'impact des violations.

* **Exposition limitée des données** : Accès impossible au contenu chiffré des e-mails en raison de l'architecture à connaissance nulle
* **Collecte minimale de données** : Informations de base sur les abonnés uniquement et journaux IP limités pour des raisons de sécurité
* **Cadres de sous-traitance** : DigitalOcean et Vultr appliquent des procédures de réponse aux incidents conformes au RGPD

**Informations sur le représentant RGPD** :
Forward Email a désigné des représentants RGPD conformément à l'article 27 :

**Représentant UE** :
Osano International Compliance Services Limited
À l'attention de : LFHC
3 Dublin Landings, North Wall Quay
Dublin 1, D01C 4E0

**Représentant au Royaume-Uni** :
Osano UK Compliance LTD
À l'attention de : LFHC
42-46 Fountain Street, Belfast
Antrim, BT1-5EF

Pour les clients d'entreprise nécessitant des SLA de notification de violation spécifiques, ceux-ci doivent être discutés dans le cadre d'un contrat de **licence d'entreprise**.

Sources :

* <https://forwardemail.net/technical-whitepaper.pdf#page=59>
* <https://forwardemail.net/gdpr>

### Proposez-vous un environnement de test {#do-you-offer-a-test-environment}

La documentation technique de Forward Email ne décrit pas explicitement de mode sandbox dédié. Cependant, les approches de test possibles incluent :

* **Option d'auto-hébergement** : Fonctionnalités complètes d'auto-hébergement pour la création d'environnements de test
* **Interface API** : Possibilité de tester les configurations par programmation
* **Open Source** : Code 100 % open source permettant aux clients d'examiner la logique de transfert
* **Domaines multiples** : La prise en charge de plusieurs domaines pourrait permettre la création de domaines de test

Pour les clients d'entreprise nécessitant des fonctionnalités de sandbox formelles, cela doit être discuté dans le cadre d'un accord de **licence d'entreprise**.

Source : <https://github.com/forwardemail/forwardemail.net> (Détails de l'environnement de développement)

### Fournissez-vous des outils de surveillance et d'alerte ? {#do-you-provide-monitoring-and-alerting-tools}

Forward Email fournit une surveillance en temps réel avec certaines limitations :

**Disponible:**

* **Surveillance de la livraison en temps réel** : Indicateurs de performance visibles publiquement pour les principaux fournisseurs de messagerie
* **Alerte automatique** : Alerte de l'équipe d'ingénierie lorsque les délais de livraison dépassent 10 secondes
* **Surveillance transparente** : Systèmes de surveillance 100 % open source
* **Surveillance de l'infrastructure** : Détection automatique des anomalies et journalisation d'audit complète

**Limites:**

* Les webhooks destinés aux clients ou les notifications d'état de livraison basées sur l'API ne sont pas explicitement documentés

Pour les clients d'entreprise nécessitant des webhooks d'état de livraison détaillés ou des intégrations de surveillance personnalisées, ces fonctionnalités peuvent être disponibles via des accords de **licence d'entreprise**.

Sources :

* <https://forwardemail.net> (Affichage de la surveillance en temps réel)
* <https://github.com/forwardemail/forwardemail.net> (Implémentation de la surveillance)

### Comment garantir une haute disponibilité {#how-do-you-ensure-high-availability}

> \[!IMPORTANT]
> Forward Email implémente une redondance complète entre plusieurs fournisseurs d'infrastructure.

* **Infrastructure distribuée** : Plusieurs fournisseurs (DigitalOcean, Vultr, DataPacket) répartis sur plusieurs régions géographiques
* **Équilibrage de charge géographique** : Équilibrage de charge géolocalisé basé sur Cloudflare avec basculement automatique
* **Mise à l'échelle automatique** : Ajustement dynamique des ressources en fonction de la demande
* **Protection DDoS multicouche** : Grâce au système Shield de DataPacket et à Cloudflare
* **Redondance des serveurs** : Plusieurs serveurs par région avec basculement automatique
* **Réplication de base de données** : Synchronisation des données en temps réel sur plusieurs sites
* **Surveillance et alertes** : Surveillance 24h/24 et 7j/7 avec réponse automatique aux incidents

**Engagement de disponibilité** : Disponibilité du service supérieure à 99,9 % avec surveillance transparente disponible sur <https://forwardemail.net>

Sources :

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver>

### Êtes-vous conforme à l'article 889 de la loi sur l'autorisation de la défense nationale (NDAA) ? {#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa}

> \[!IMPORTANT]
> Forward Email est entièrement conforme à la section 889 grâce à une sélection rigoureuse des partenaires d'infrastructure.

Oui, Forward Email est **conforme à la section 889**. La section 889 de la loi sur l'autorisation de la défense nationale (NDAA) interdit aux agences gouvernementales d'utiliser ou de conclure des contrats avec des entités qui utilisent des équipements de télécommunications et de vidéosurveillance de sociétés spécifiques (Huawei, ZTE, Hikvision, Dahua et Hytera).

**Comment Forward Email est conforme à la section 889 :**

Forward Email s'appuie exclusivement sur deux fournisseurs d'infrastructures clés, dont aucun n'utilise d'équipement interdit par la section 889 :

1. **Cloudflare** : Notre principal partenaire pour les services réseau et la sécurité des e-mails
2. **DataPacket** : Notre principal fournisseur d'infrastructure serveur (utilisant exclusivement des équipements Arista Networks et Cisco)
3. **Fournisseurs de sauvegarde** : Nos fournisseurs de sauvegarde, Digital Ocean et Vultr, sont également certifiés par écrit conformes à la Section 889.

**Engagement de Cloudflare** : Cloudflare déclare explicitement dans son Code de conduite des tiers qu'il n'utilise pas d'équipements de télécommunications, de produits de vidéosurveillance ou de services provenant d'entités interdites par la section 889.

**Cas d'utilisation gouvernemental** : Notre conformité à la section 889 a été validée lorsque l'**Académie navale américaine** a sélectionné Forward Email pour ses besoins de transfert de courrier électronique sécurisé, nécessitant une documentation de nos normes de conformité fédérales.

Pour plus de détails sur notre cadre de conformité gouvernementale, y compris les réglementations fédérales plus larges, lisez notre étude de cas complète : [Service de courrier électronique du gouvernement fédéral conforme à la section 889](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)

## Détails du système et techniques {#system-and-technical-details}

### Stockez-vous les e-mails et leur contenu {#do-you-store-emails-and-their-contents}

Non, nous n'écrivons pas sur le disque ni ne stockons les journaux - avec [exception d'erreurs](#do-you-store-error-logs) et [SMTP sortant](#do-you-support-sending-email-with-smtp) (voir notre [politique de confidentialité](/privacy)).

Tout est fait en mémoire et [notre code source est sur GitHub](https://github.com/forwardemail).

### Comment fonctionne votre système de transfert d'e-mails {#how-does-your-email-forwarding-system-work}

Le courrier électronique repose sur le protocole [Protocole SMTP](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol). Ce protocole consiste en des commandes envoyées à un serveur (généralement sur le port 25). Après une connexion initiale, l'expéditeur indique l'expéditeur (« MAIL FROM »), le destinataire (« RCPT TO »), et enfin les en-têtes et le corps du message (« DATA »). Le flux de notre système de transfert de courrier électronique est décrit ci-dessous pour chaque commande du protocole SMTP :

* Connexion initiale (sans nom de commande, par exemple `telnet example.com 25`) : il s'agit de la connexion initiale. Nous comparons les expéditeurs qui ne figurent pas dans notre [liste blanche](#do-you-have-an-allowlist) à notre [liste de refus](#do-you-have-a-denylist). Enfin, si un expéditeur ne figure pas dans notre liste blanche, nous vérifions s'il a été ajouté à notre [sur liste grise](#do-you-have-a-greylist).

* `HELO` - Ceci indique un message d'accueil pour identifier le nom de domaine complet (FQDN), l'adresse IP ou le nom du gestionnaire de messagerie de l'expéditeur. Cette valeur peut être usurpée ; nous ne nous basons donc pas sur ces données et utilisons plutôt la recherche inverse du nom d'hôte de l'adresse IP de la connexion.

* `MAIL FROM` - Indique l'adresse de l'expéditeur de l'e-mail. Si une valeur est saisie, elle doit être une adresse RFC 5322 valide. Les valeurs vides sont autorisées. [vérifier la rétrodiffusion](#how-do-you-protect-against-backscatter) est utilisé ici, et nous comparons également MAIL FROM à [liste de refus](#do-you-have-a-denylist). Enfin, nous vérifions la limitation de débit pour les expéditeurs qui ne sont pas sur la liste d'autorisation (voir la section sur [Limitation de débit](#do-you-have-rate-limiting) et [liste blanche](#do-you-have-an-allowlist) pour plus d'informations).

* `RCPT TO` - Indique le(s) destinataire(s) de l'e-mail. Il doit s'agir d'adresses e-mail RFC 5322 valides. Nous autorisons un maximum de 50 destinataires d'enveloppe par message (ceci est différent de l'en-tête « À » d'un e-mail). Nous vérifions également la validité de l'adresse [Schéma de réécriture de l'expéditeur](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme) (« SRS ») afin de nous protéger contre l'usurpation d'identité avec notre nom de domaine SRS.

* `DATA` – Il s'agit de la partie centrale de notre service qui traite les e-mails. Consultez la section [Comment traiter un e-mail pour le transférer](#how-do-you-process-an-email-for-forwarding) ci-dessous pour plus d'informations.

### Comment traiter un e-mail pour le transfert {#how-do-you-process-an-email-for-forwarding}

Cette section décrit notre processus lié à la commande de protocole SMTP `DATA` dans la section [Comment fonctionne votre système de transfert d'e-mails](#how-does-your-email-forwarding-system-work) ci-dessus – c'est ainsi que nous traitons les en-têtes, le corps, la sécurité d'un e-mail, déterminons où il doit être livré et comment nous gérons les connexions.

1. Si le message dépasse la taille maximale de 50 Mo, il est rejeté avec un code d'erreur 552.

2. Si le message ne contient pas d'en-tête « De », ou si l'une des valeurs de l'en-tête « De » n'est pas une adresse e-mail RFC 5322 valide, il est rejeté avec un code d'erreur 550.

3. Si le message contient plus de 25 en-têtes « Reçu », il est alors déterminé qu'il est bloqué dans une boucle de redirection et il est rejeté avec un code d'erreur 550.

4. En utilisant l'empreinte digitale de l'e-mail (voir la section sur [Empreintes digitales](#how-do-you-determine-an-email-fingerprint)), nous vérifierons que le message a été tenté d'être réessayé pendant plus de 5 jours (ce qui correspond à [comportement par défaut de postfix](http://www.postfix.org/postconf.5.html#maximal_queue_lifetime)), et si c'est le cas, il sera rejeté avec un code d'erreur 550.

5. Nous stockons en mémoire les résultats de l'analyse de l'e-mail à l'aide de [Scanner de spam](https://spamscanner.net).

6. Si Spam Scanner génère des résultats arbitraires, le message est rejeté avec un code d'erreur 554. Au moment de la rédaction de ce document, les résultats arbitraires n'incluent que le test GTUBE. Voir <https://spamassassin.apache.org/gtube/> pour plus d'informations.

7. Nous ajouterons les en-têtes suivants au message à des fins de débogage et de prévention des abus :

* `Received` - Nous ajoutons cet en-tête standard « Received » avec l'adresse IP et l'hôte d'origine, le type de transmission, les informations de connexion TLS, la date/heure et le destinataire.
* `X-Original-To` - Le destinataire d'origine du message :
* Ceci est utile pour déterminer le destinataire initial d'un e-mail (en plus de l'en-tête « Received »).
* Cet en-tête est ajouté pour chaque destinataire lors du transfert IMAP et/ou masqué (afin de protéger la confidentialité).
* `X-Forward-Email-Website` - Contient un lien vers notre site web de <https://forwardemail.net>
* `X-Forward-Email-Version` - La version actuelle de [SemVer](https://semver.org/) de `package.json` de notre base de code.
* `X-Forward-Email-Session-ID` - Une valeur d'ID de session utilisée à des fins de débogage (applicable uniquement aux environnements hors production).
* `X-Forward-Email-Sender` - une liste séparée par des virgules contenant l'adresse MAIL FROM de l'enveloppe d'origine (si elle n'était pas vide), le nom de domaine complet du client PTR inversé (s'il existe) et l'adresse IP de l'expéditeur.
* `X-Forward-Email-ID` - ceci s'applique uniquement au SMTP sortant et correspond à l'identifiant de messagerie stocké dans Mon compte → E-mails.
* `X-Original-To`0 - avec la valeur `X-Original-To`1.
* `X-Original-To`2 - avec la valeur `X-Original-To`3.
* `X-Original-To`4 - avec la valeur `X-Original-To`5.

8. Nous vérifions ensuite le message pour [DKIM](https://en.wikipedia.org/wiki/DomainKeys_Identified_Mail), [SPF](https://en.wikipedia.org/wiki/Sender_Policy_Framework), [ARC](https://en.wikipedia.org/wiki/Authenticated_Received_Chain) et [DMARC](https://en.wikipedia.org/wiki/DMARC).

* Si le message a échoué au test DMARC et que le domaine disposait d'une politique de rejet (par exemple, `p=reject` ou [était dans la politique DMARC](https://wikipedia.org/wiki/DMARC)), il est rejeté avec un code d'erreur 550. En général, la politique DMARC d'un domaine se trouve dans l'enregistrement <strong class="notranslate">TXT</strong> du sous-domaine `_dmarc` (par exemple, `dig _dmarc.example.com txt`).
* Si le message a échoué au test SPF et que le domaine disposait d'une politique de rejet définitif (par exemple, `-all` figurait dans la politique SPF, contrairement à `~all`, ou aucune politique du tout), il est rejeté avec un code d'erreur 550. En général, la politique SPF d'un domaine se trouve dans l'enregistrement <strong class="notranslate">TXT</strong> du domaine racine (par exemple, `dig example.com txt`). Consultez cette section pour plus d'informations sur [envoyer du courrier comme avec Gmail](#can-i-send-mail-as-in-gmail-with-this) concernant SPF.

9. Nous traitons maintenant les destinataires du message tels que collectés par la commande `RCPT TO` dans la section [Comment fonctionne votre système de transfert d'e-mails](#how-does-your-email-forwarding-system-work) ci-dessus. Pour chaque destinataire, nous effectuons les opérations suivantes :

* Nous recherchons les enregistrements <strong class="notranslate">TXT</strong> du nom de domaine (la partie après le symbole `@`, par exemple `example.com` si l'adresse e-mail était `test@example.com`). Par exemple, si le domaine est `example.com`, nous effectuons une recherche DNS telle que `dig example.com txt`.
* Nous analysons tous les enregistrements <strong class="notranslate">TXT</strong> commençant par `forward-email=` (offres gratuites) ou `forward-email-site-verification=` (offres payantes). Notez que nous analysons les deux afin de traiter les e-mails lorsqu'un utilisateur change d'offre.
* À partir de ces enregistrements <strong class="notranslate">TXT</strong> analysés, nous les parcourons pour extraire la configuration de transfert (comme décrit dans la section [Comment démarrer et configurer le transfert d'e-mails](#how-do-i-get-started-and-set-up-email-forwarding) ci-dessus). Notez que nous ne prenons en charge qu'une seule valeur `forward-email-site-verification=`. Si plusieurs valeurs sont fournies, une erreur 550 se produira et l'expéditeur recevra un message de non-retour pour ce destinataire.
* Nous parcourons récursivement la configuration de transfert extraite afin de déterminer la transmission globale, la transmission par expressions régulières et toutes les autres configurations de transfert prises en charge, désormais appelées « adresses de transfert ».
* Pour chaque adresse de transfert, nous prenons en charge une recherche récursive (qui relancera cette série d'opérations sur l'adresse donnée). Si une correspondance récursive est trouvée, le résultat parent sera supprimé des adresses de transfert et les enfants ajoutés.
* Les adresses de transfert sont analysées pour vérifier leur unicité (car nous ne souhaitons pas envoyer de doublons à une adresse ni générer de connexions client SMTP inutiles). * Pour chaque adresse de transfert, nous recherchons son nom de domaine via notre point de terminaison API `/v1/max-forwarded-addresses` (afin de déterminer le nombre d'adresses autorisées à transférer des e-mails par alias, par exemple 10 par défaut – voir la section sur `example.com`0). Si cette limite est dépassée, une erreur 550 se produit et l'expéditeur reçoit un message de non-réponse pour ce destinataire.
* Nous recherchons les paramètres du destinataire d'origine via notre point de terminaison API `example.com`1, qui prend en charge la recherche pour les utilisateurs payants (avec une solution de secours pour les utilisateurs gratuits). Cela renvoie un objet de configuration pour les paramètres avancés de `example.com`2 (Numéro, par exemple `example.com`3), `example.com`4 (Booléen), `example.com`5 (Booléen), `example.com`6 (Booléen) et `example.com`7 (Booléen).
* En fonction de ces paramètres, nous effectuons une vérification des résultats de l'analyse anti-spam et, en cas d'erreur, rejetons le message avec le code d'erreur 554 (par exemple, si `example.com`8 est activé, nous vérifions la présence de virus dans les résultats de l'analyse anti-spam). Notez que tous les utilisateurs de l'offre gratuite sont activés pour la vérification des contenus pour adultes, du phishing, des fichiers exécutables et des virus. Par défaut, tous les utilisateurs de l'offre payante sont également activés, mais cette configuration peut être modifiée dans la page Paramètres d'un domaine, dans le tableau de bord de transfert d'e-mails.

10. Pour chaque adresse de réexpédition du destinataire traité, nous effectuons ensuite les opérations suivantes :

* L'adresse est comparée à notre [liste de refus](#do-you-have-a-denylist). Si elle est répertoriée, un code d'erreur 421 s'affiche (indiquant à l'expéditeur de réessayer ultérieurement).
* Si l'adresse est un webhook, nous définissons une valeur booléenne pour les opérations futures (voir ci-dessous : nous regroupons les webhooks similaires pour créer une seule requête POST, au lieu de plusieurs pour la livraison).
* Si l'adresse est une adresse e-mail, nous analysons l'hôte pour les opérations futures (voir ci-dessous : nous regroupons les hôtes similaires pour créer une seule connexion, au lieu de plusieurs connexions individuelles pour la livraison).

11. S'il n'y a pas de destinataires et qu'il n'y a pas de rebonds, nous répondons avec une erreur 550 « Destinataires non valides ».

12. S'il y a des destinataires, nous les parcourons (regroupés par le même hôte) et les envoyons. Voir la section [Comment gérez-vous les problèmes de livraison des e-mails ?](#how-do-you-handle-email-delivery-issues) ci-dessous pour plus d'informations.

* Si des erreurs surviennent lors de l'envoi d'e-mails, nous les stockons en mémoire pour un traitement ultérieur.
* Nous prenons le code d'erreur le plus bas (le cas échéant) lors de l'envoi d'e-mails et l'utilisons comme code de réponse à la commande `DATA`. Cela signifie que les e-mails non délivrés seront généralement réexpédiés par l'expéditeur d'origine, tandis que les e-mails déjà délivrés ne seront pas renvoyés lors du prochain envoi (car nous utilisons [Empreintes digitales](#how-do-you-determine-an-email-fingerprint)).
* Si aucune erreur ne se produit, nous envoyons un code de réponse SMTP de type 250.
* Un rebond est défini comme toute tentative de délivrance générant un code de statut supérieur ou égal à 500 (échecs permanents).

13. Si aucun rebond ne s'est produit (échecs permanents), nous renverrons un code d'état de réponse SMTP du code d'erreur le plus bas parmi les échecs non permanents (ou un code d'état de réussite 250 s'il n'y en a pas eu).

14. En cas de rebond, nous enverrons des e-mails de rebond en arrière-plan après avoir renvoyé le code d'erreur le plus bas à l'expéditeur. Cependant, si le code d'erreur le plus bas est supérieur à 500, nous n'enverrons aucun e-mail de rebond. En effet, dans ce cas, les expéditeurs recevraient un double e-mail de rebond (par exemple, un de leur agent de transfert de messages sortant, comme Gmail, et un de notre part). Consultez la section relative à [Comment se protéger contre la rétrodiffusion](#how-do-you-protect-against-backscatter) ci-dessous pour plus d'informations.

### Comment gérez-vous les problèmes de livraison des e-mails ? {#how-do-you-handle-email-delivery-issues}

Notez que nous effectuerons une réécriture de l'en-tête « De convivial » sur les e-mails si, et seulement si, la politique DMARC de l'expéditeur n'était pas valide et qu'aucune signature DKIM n'était alignée avec l'en-tête « De ». Cela signifie que nous modifierons l'en-tête « De » du message, définirons « X-Original-From » et définirons également un « Répondre à » si ce n'était pas déjà fait. Nous refermerons également le sceau ARC du message après avoir modifié ces en-têtes.

Nous utilisons également l'analyse intelligente des messages d'erreur à chaque niveau de notre pile : dans notre code, les requêtes DNS, les éléments internes de Node.js, les requêtes HTTP (par exemple, 408, 413 et 429 sont mappées au code de réponse SMTP 421 si le destinataire est un webhook) et les réponses du serveur de messagerie (par exemple, les réponses avec « différer » ou « ralentir » seraient relancées comme des erreurs 421).

Notre logique est infaillible et réessayera également en cas d'erreurs SSL/TLS, de problèmes de connexion, etc. L'objectif de cette infaillibilité est d'optimiser la délivrabilité à tous les destinataires d'une configuration de transfert.

Si le destinataire est un webhook, nous autorisons un délai d'attente de 60 secondes pour que la requête aboutisse, avec jusqu'à trois tentatives (soit un total de quatre requêtes avant échec). Notez que nous analysons correctement les codes d'erreur 408, 413 et 429 et les associons à un code de réponse SMTP 421.

Sinon, si le destinataire est une adresse e-mail, nous tenterons d'envoyer l'e-mail avec TLS opportuniste (nous utiliserons STARTTLS s'il est disponible sur le serveur de messagerie du destinataire). Si une erreur SSL/TLS survient lors de l'envoi, nous tenterons d'envoyer l'e-mail sans TLS (sans utiliser STARTTLS).

Si des erreurs DNS ou de connexion se produisent, nous renverrons à la commande `DATA` un code de réponse SMTP de 421, sinon s'il y a des erreurs de niveau >= 500, des rebonds seront envoyés.

Si nous détectons qu'un serveur de messagerie auquel nous tentons de livrer a une ou plusieurs de nos adresses IP d'échange de messagerie bloquées (par exemple, par la technologie qu'ils utilisent pour différer les spammeurs), nous enverrons un code de réponse SMTP de 421 pour que l'expéditeur réessaye son message plus tard (et nous sommes alertés du problème afin que nous puissions, espérons-le, le résoudre avant la prochaine tentative).

### Comment gérez-vous le blocage de vos adresses IP ? {#how-do-you-handle-your-ip-addresses-becoming-blocked}

Nous surveillons régulièrement toutes les principales listes de refus DNS et si l'une de nos adresses IP d'échange de courrier (« MX ») est répertoriée dans une liste de refus majeure, nous la retirerons du round robin d'enregistrement DNS A concerné si possible jusqu'à ce que le problème soit résolu.

Au moment de la rédaction de cet article, nous figurons également sur plusieurs listes d'autorisation DNS et prenons la surveillance des listes de blocage très au sérieux. Si vous constatez des problèmes avant que nous ayons pu les résoudre, veuillez nous en informer par écrit à l'adresse <support@forwardemail.net>.

Nos adresses IP sont accessibles au public, [voir cette section ci-dessous pour plus d'informations](#what-are-your-servers-ip-addresses).

### Quelles sont les adresses des maîtres de poste ? {#what-are-postmaster-addresses}

Afin d'éviter les rebonds mal dirigés et l'envoi de messages de réponse de vacances à des boîtes aux lettres non surveillées ou inexistantes, nous maintenons une liste de noms d'utilisateur de type mailer-daemon :

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
* [et toute adresse sans réponse](#what-are-no-reply-addresses)

Consultez [RFC 5320 Section 4.6](https://datatracker.ietf.org/doc/html/rfc5230#section-4.6) pour plus d'informations sur la manière dont des listes telles que celles-ci sont utilisées pour créer des systèmes de messagerie efficaces.

### Que sont les adresses sans réponse ? {#what-are-no-reply-addresses}

Les noms d'utilisateur de messagerie correspondant à l'un des éléments suivants (insensibles à la casse) sont considérés comme des adresses sans réponse :

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

Cette liste est maintenue [en tant que projet open source sur GitHub](https://github.com/forwardemail/reserved-email-addresses-list).

### Quelles sont les adresses IP de votre serveur {#what-are-your-servers-ip-addresses}

Nous publions nos adresses IP sur <https://forwardemail.net/ips>.

### Avez-vous une liste blanche ? {#do-you-have-an-allowlist}

Oui, nous avons un [liste des extensions de noms de domaine](#what-domain-name-extensions-are-allowlisted-by-default) qui est autorisé par défaut et une liste blanche dynamique, mise en cache et continue basée sur [critères stricts](#what-is-your-allowlist-criteria).

Tous les e-mails, domaines et destinataires des clients disposant de forfaits payants sont automatiquement ajoutés à notre liste autorisée.

### Quelles extensions de nom de domaine sont autorisées par défaut ? {#what-domain-name-extensions-are-allowlisted-by-default}

Les extensions de noms de domaine suivantes sont considérées comme autorisées par défaut (qu'elles figurent ou non sur la liste de popularité Umbrella) :

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
<li class="list-inline-item"><code kg.kr</code></li>
<li class="list-inline-item"><code class="notranslate">edu.es</code></li>
<li class="list-inline-item"><code class="notranslate">ac.lk</code></li>
<li class="list-inline-item"><code class="notranslate">sch.lk</code></li>
<li class="list-inline-item"><code class="notranslate">edu.lk</code></li>
<li class="list-inline-item"><code class="notranslate">ac.th</code></li>
<li class="list-inline-item"><code class="notranslate">mi.th</code></li>
<li class="list-inline-item"><code class="notranslate">admin.ch</code></li>
<li class="list-inline-item"><code canada.ca</code></li>
<li class="list-inline-item"><code class="notranslate">gc.ca</code></li>
<li class="list-inline-item"><code class="notranslate">go.id</code></li>
<li class="list-inline-item"><code class="notranslate">go.jp</code></li>
<li class="list-inline-item"><code class="notranslate">go.ke</code></li>
<li class="list-inline-item"><code class="notranslate">go.kr</code></li>
<li class="list-inline-item"><code class="notranslate">go.th</code></li>
<li class="list-inline-item"><code class="notranslate">gob.ar</code></li>
<li class="list-inline-item"><code gob.cl</code></li>
<li class="list-inline-item"><code class="notranslate">gob.es</code></li>
<li class="list-inline-item"><code class="notranslate">gob.mx</code></li>
<!--<li class="list-inline-item"><code class="notranslate">gob.pe</code></li>-->
<li class="list-inline-item"><code class="notranslate">gob.ve</code></li>
<li class="list-inline-item"><code class="notranslate">gob.sv</code></li>
<li class="list-inline-item"><code class="notranslate">gouv.fr</code></li>
<li class="list-inline-item"><code class="notranslate">gouv.nc</code></li>
<li gouv.qc.ca

<li>gov.ad</li>
<li>gov.af</li>
<li>gov.ai</li>
<li>gov.al</li>
<li>gov.am</li>
<li>gov.ao</li>
<li>gov.au</li>
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
<li class="list-inline-item"><code royal.uk

sch.uk
ukaea.uk

ukaea.uk

De plus, ces [domaines de premier niveau de marque et d'entreprise](https://en.wikipedia.org/wiki/List_of_Internet_top-level_domains#Brand_and_corporate_top-level_domains) sont autorisés par défaut (par exemple, `apple` pour `applecard.apple` pour les relevés bancaires Apple Card) :

<ul class="list-inline">
<li class="list-inline-item"><code class="notranslate">aaa</code></li>
<li class="list-inline-item"><code class="notranslate">aarp</code></li>
<li class="list-inline-item"><code class="notranslate">abarth</code></li>
<li class="list-inline-item"><code class="notranslate">abb</code></li>
<li class="list-inline-item"><code class="notranslate">abbott</code></li>
<li class="list-inline-item"><code class="notranslate">abbvie</code></li>
<li class="list-inline-item"><code class="notranslate">abc</code></li>
<li class="list-inline-item"><code accenture</code></li>
<li class="list-inline-item"><code class="notranslate">aco</code></li>
<li class="list-inline-item"><code class="notranslate">aeg</code></li>
<li class="list-inline-item"><code class="notranslate">aetna</code></li>
<li class="list-inline-item"><code class="notranslate">afl</code></li>
<li class="list-inline-item"><code class="notranslate">agakhan</code></li>
<li class="list-inline-item"><code class="notranslate">aig</code></li>
<li class="list-inline-item"><code class="notranslate">aigo</code></li>
<li class="list-inline-item"><code airbus</code></li>
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
<li class="list-inline-item"><code class="notranslate">AOL</code></li>
<li class="list-inline-item"><code class="notranslate">Apple</code></li>
<li class="list-inline-item"><code class="notranslate">Aquarelle</code></li>
<li class="list-inline-item"><code class="notranslate">Aramco</code></li>
<li class="list-inline-item"><code class="notranslate">Audi</code></li>
<li class="list-inline-item"><code class="notranslate">Auspost</code></li>
<li class="list-inline-item"><code class="notranslate">AWS</code></li>
<li class="list-inline-item"><code class="notranslate">AXA</code></li>
<li class="list-inline-item"><code Azure

Baidu

Bananerapublic

Barclaycard

Barclays

Basketball

Bauhaus

BBC

class="notranslate">bbt</code></li>
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
<li class="list-inline-item"><code class="notranslate">bond</code></li>
<li class="list-inline-item"><code class="notranslate">booking</code></li>
<li class="list-inline-item"><code class="notranslate">bosch</code></li>
<li class="list-inline-item"><code class="notranslate">Bostik</code></li>
<li class="list-inline-item"><code class="notranslate">Bradesco</code></li>
<li class="list-inline-item"><code class="notranslate">Bridgestone</code></li>
<li class="list-inline-item"><code class="notranslate">Brother</code></li>
<li class="list-inline-item"><code class="notranslate">Bugatti</code></li>
<li class="list-inline-item"><code class="notranslate">Cal</code></li>
<li class="list-inline-item"><code class="notranslate">Calvin Klein</code></li>
<li class="list-inline-item"><code class="notranslate">Canon</code></li>
<li class="list-inline-item"><code Capitalone

Caravane
Cartier
CBA
CBN
CBRE
CBS
CERN
class="notranslate">cfa</code></li>
<li class="list-inline-item"><code class="notranslate">chanel</code></li>
<li class="list-inline-item"><code class="notranslate">chase</code></li>
<li class="list-inline-item"><code class="notranslate">chintai</code></li>
<li class="list-inline-item"><code class="notranslate">chrome</code></li>
<li class="list-inline-item"><code class="notranslate">chrysler</code></li>
<li class="list-inline-item"><code class="notranslate">cipriani</code></li>
<li class="list-inline-item"><code class="notranslate">cisco</code></li>
<li class="list-inline-item"><code class="notranslate">citadelle</code></li>
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
<li class="list-inline-item"><code class="notranslate">concessionnaire</code></li>
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
<li class="list-inline-item"><code Eurovision

Everbank

Extraspace

Fage

Fairwinds

Farmers

Fedex

Ferrari

Fage class="notranslate">ferrero</code></li>
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
<li class="list-inline-item"><code class="notranslate">Granger</code></li>
<li class="list-inline-item"><code class="notranslate">Guardian</code></li>
<li class="list-inline-item"><code class="notranslate">Gucci</code></li>
<li class="list-inline-item"><code class="notranslate">HBO</code></li>
<li class="list-inline-item"><code class="notranslate">HDFC</code></li>
<li class="list-inline-item"><code class="notranslate">HDFCBank</code></li>
<li class="list-inline-item"><code class="notranslate">Hermès</code></li>
<li class="list-inline-item"><code class="notranslate">Hisamitsu</code></li>
<li Hitachi
<li class="list-inline-item"><code class="notranslate">HKT</code></li>
<li class="list-inline-item"><code class="notranslate">Honda</code></li>
<li class="list-inline-item"><code class="notranslate">Honeywell</code></li>
<li class="list-inline-item"><code class="notranslate">Hotmail</code></li>
<li class="list-inline-item"><code class="notranslate">HSBC</code></li>
<li class="list-inline-item"><code class="notranslate">Hughes</code></li>
<li class="list-inline-item"><code class="notranslate">Hyatt</code></li>
<li class="list-inline-item"><code class="notranslate">Hyundai</code></li>
<li class="list-inline-item"><code class="notranslate">IBM</code></li>
<li class="list-inline-item"><code class="notranslate">IEEE</code></li>
<li class="list-inline-item"><code class="notranslate">IFM</code></li>
<li class="list-inline-item"><code class="notranslate">Ikano</code></li>
<li class="list-inline-item"><code class="notranslate">IMDB</code></li>
<li class="list-inline-item"><code class="notranslate">Infiniti</code></li>
<li class="list-inline-item"><code class="notranslate">Intel</code></li>
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
<li class="list-inline-item"><code kerryproperties</code></li>
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
<li class="list-inline-item"><code Lanxess
Lasalle
Larobe
LDS
Leclerc
Lego
Liaison
Lexus
class="notranslate">Lidl</code></li>
<li class="list-inline-item"><code class="notranslate">Style de vie</code></li>
<li class="list-inline-item"><code class="notranslate">Lilly</code></li>
<li class="list-inline-item"><code class="notranslate">Lincoln</code></li>
<li class="list-inline-item"><code class="notranslate">Linde</code></li>
<li class="list-inline-item"><code class="notranslate">Lipsy</code></li>
<li class="list-inline-item"><code class="notranslate">Lixil</code></li>
<li class="list-inline-item"><code class="notranslate">Locus</code></li>
<li class="list-inline-item"><code class="notranslate">lotte</code></li>
<li class="list-inline-item"><code class="notranslate">lpl</code></li>
<li class="list-inline-item"><code class="notranslate">lplfinancial</code></li>
<li class="list-inline-item"><code class="notranslate">lundbeck</code></li>
<li class="list-inline-item"><code class="notranslate">lupin</code></li>
<li class="list-inline-item"><code class="notranslate">macys</code></li>
<li class="list-inline-item"><code class="notranslate">maif</code></li>
<li class="list-inline-item"><code class="notranslate">man</code></li>
<li class="list-inline-item"><code class="notranslate">mangue</code></li>
<li class="list-inline-item"><code class="notranslate">marriott</code></li>
<li class="list-inline-item"><code class="notranslate">maserati</code></li>
<li class="list-inline-item"><code class="notranslate">mattel</code></li>
<li class="list-inline-item"><code class="notranslate">mckinsey</code></li>
<li class="list-inline-item"><code class="notranslate">metlife</code></li>
<li class="list-inline-item"><code class="notranslate">microsoft</code></li>
<li class="list-inline-item"><code class="notranslate">mini</code></li>
<li class="list-inline-item"><code class="notranslate">MIT</code></li>
<li class="list-inline-item"><code class="notranslate">MITSUBISHI</code></li>
<li class="list-inline-item"><code class="notranslate">MLB</code></li>
<li class="list-inline-item"><code class="notranslate">MMA</code></li>
<li class="list-inline-item"><code class="notranslate">MONASH</code></li>
<li class="list-inline-item"><code class="notranslate">MORMON</code></li>
<li class="list-inline-item"><code class="notranslate">MOVISTA</code></li>
<li class="list-inline-item"><code class="notranslate">msd</code></li>
<li class="list-inline-item"><code class="notranslate">mtn</code></li>
<li class="list-inline-item"><code class="notranslate">mtr</code></li>
<li class="list-inline-item"><code class="notranslate">mutual</code></li>
<li class="list-inline-item"><code class="notranslate">nadex</code></li>
<li class="list-inline-item"><code class="notranslate">national</code></li>
<li class="list-inline-item"><code class="notranslate">natura</code></ li>
<li class="list-inline-item"><code class="notranslate">NBA</code></li>
<li class="list-inline-item"><code class="notranslate">NEC</code></li>
<li class="list-inline-item"><code class="notranslate">Netflix</code></li>
<li class="list-inline-item"><code class="notranslate">Neustar</code></li>
<li class="list-inline-item"><code class="notranslate">NewHolland</code></li>
<li class="list-inline-item"><code class="notranslate">NFL</code></li>
<li class="list-inline-item"><code class="notranslate">NHK</code></li>
<li class="list-inline-item"><code class="notranslate">Nico</code></li>
<li Nike
<li>Nikon</li>
<li>Nissan</li>
<li>Nissay</li>
<li>Nokia</li>
<li>Northwestern Mutual</li>
<li>Norton</li>
<li>NRA</li>
<li class="list-inline-item"><code class="notranslate">ntt</code></li>
<li class="list-inline-item"><code class="notranslate">obi</code></li>
<li class="list-inline-item"><code class="notranslate">office</code></li>
<li class="list-inline-item"><code class="notranslate">omega</code></li>
<li class="list-inline-item"><code class="notranslate">oracle</code></li>
<li class="list-inline-item"><code class="notranslate">orange</code></li>
<li class="list-inline-item"><code class="notranslate">otsuka</code></li>
<!--<li class="list-inline-item"><code class="notranslate">ovh</code></li>-->
<li Panasonic
<li>Pccw</li>
<li>Pfizer</li>
<li>Philips</li>
<li>Piaget</li>
<li>Pictet</li>
<li>Ping</li>
<li>Pioneer</li>
<li class="list-inline-item"><code class="notranslate">play</code></li>
<li class="list-inline-item"><code class="notranslate">playstation</code></li>
<li class="list-inline-item"><code class="notranslate">pohl</code></li>
<li class="list-inline-item"><code class="notranslate">politie</code></li>
<li class="list-inline-item"><code class="notranslate">praxi</code></li>
<li class="list-inline-item"><code class="notranslate">prod</code></li>
<li class="list-inline-item"><code class="notranslate">progressive</code></li>
<li class="list-inline-item"><code class="notranslate">pru</code></li>
<li class="list-inline-item"><code Prudential

Pwc

Quest

QVC

Redstone

Reliance

Rexroth

Ricoh


Prudential class="notranslate">rmit</code></li>
<li class="list-inline-item"><code class="notranslate">rocher</code></li>
<li class="list-inline-item"><code class="notranslate">rogers</code></li>
<li class="list-inline-item"><code class="notranslate">rwe</code></li>
<li class="list-inline-item"><code class="notranslate">safety</code></li>
<li class="list-inline-item"><code class="notranslate">sakura</code></li>
<li class="list-inline-item"><code class="notranslate">samsung</code></li>
<li class="list-inline-item"><code class="notranslate">sandvik</code></li>
<li class="list-inline-item"><code sandvikcoromant</code></li>
<li class="list-inline-item"><code class="notranslate">sanofi</code></li>
<li class="list-inline-item"><code class="notranslate">sap</code></li>
<li class="list-inline-item"><code class="notranslate">saxo</code></li>
<li class="list-inline-item"><code class="notranslate">sbi</code></li>
<!--<li class="list-inline-item"><code class="notranslate">sbs</code></li>-->
<li class="list-inline-item"><code class="notranslate">sca</code></li>
<li class="list-inline-item"><code class="notranslate">scb</code></li>
<li class="list-inline-item"><code class="notranslate">Schaeffler</code></li>
<li class="list-inline-item"><code class="notranslate">Schmidt</code></li>
<li class="list-inline-item"><code class="notranslate">Schwarz</code></li>
<li class="list-inline-item"><code class="notranslate">ScJohnson</code></li>
<li class="list-inline-item"><code class="notranslate">Scor</code></li>
<li class="list-inline-item"><code class="notranslate">Seat</code></li>
<li class="list-inline-item"><code class="notranslate">Sener</code></li>
<li class="list-inline-item"><code class="notranslate">Ses</code></li>
<li class="list-inline-item"><code class="notranslate">coudre</code></li>
<li class="list-inline-item"><code class="notranslate">sept</code></li>
<li class="list-inline-item"><code class="notranslate">sfr</code></li>
<li class="list-inline-item"><code class="notranslate">chercher</code></li>
<li class="list-inline-item"><code class="notranslate">shangrila</code></li>
<li class="list-inline-item"><code class="notranslate">tranchant</code></li>
<li class="list-inline-item"><code class="notranslate">shaw</code></li>
<li class="list-inline-item"><code class="notranslate">coquille</code></li>
<li class="list-inline-item"><code class="notranslate">Shriram</code></li>
<li class="list-inline-item"><code class="notranslate">Sina</code></li>
<li class="list-inline-item"><code class="notranslate">Sky</code></li>
<li class="list-inline-item"><code class="notranslate">Skype</code></li>
<li class="list-inline-item"><code class="notranslate">Smart</code></li>
<li class="list-inline-item"><code class="notranslate">SNCF</code></li>
<li class="list-inline-item"><code class="notranslate">Softbank</code></li>
<li class="list-inline-item"><code class="notranslate">Sohu</code></li>
<li class="list-inline-item"><code Sony

<li class="list-inline-item"><code class="notranslate">Spiegel</code></li>
<li class="list-inline-item"><code class="notranslate">Stada</code></li>
<li class="list-inline-item"><code class="notranslate">Bureau en Gros</code></li>
<li class="list-inline-item"><code class="notranslate">Star</code></li>
<li class="list-inline-item"><code class="notranslate">Starhub</code></li>
<li class="list-inline-item"><code class="notranslate">Statebank</code></li>
<li class="list-inline-item"><code class="notranslate">Statefarm</code></li>
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
<li class="list-inline-item"><code class="notranslate">téléviseurs</code></li>
<li class="list-inline-item"><code class="notranslate">ubs</code></li>
<li class="list-inline-item"><code class="notranslate">unicom</code></li>
<li class="list-inline-item"><code class="notranslate">uol</code></li>
<li class="list-inline-item"><code class="notranslate">ups</code></li>
<li class="list-inline-item"><code class="notranslate">vanguard</code></li>
<li class="list-inline-item"><code class="notranslate">verisign</code></li>
<li class="list-inline-item"><code class="notranslate">vig</code></li>
<li class="list-inline-item"><code class="notranslate">Viking</code></li>
<li class="list-inline-item"><code class="notranslate">Virgin</code></li>
<li class="list-inline-item"><code class="notranslate">Visa</code></li>
<li class="list-inline-item"><code class="notranslate">Vista</code></li>
<li class="list-inline-item"><code class="notranslate">VistaPrint</code></li>
<li class="list-inline-item"><code class="notranslate">Vivo</code></li>
<li class="list-inline-item"><code class="notranslate">Volkswagen</code></li>
<li class="list-inline-item"><code class="notranslate">Volvo</code></li>
<li class="list-inline-item"><code class="notranslate">Walmart</code></li>
<li class="list-inline-item"><code class="notranslate">Walter</code></li>
<li class="list-inline-item"><code class="notranslate">Weather Channel</code></li>
<li class="list-inline-item"><code class="notranslate">Weber</code></li>
<li class="list-inline-item"><code class="notranslate">Weir</code></li>
<li class="list-inline-item"><code class="notranslate">Williamhill</code></li>
<li class="list-inline-item"><code class="notranslate">Windows</code></li>
<li class="list-inline-item"><code class="notranslate">WME</code></li>
<li class="list-inline-item"><code class="notranslate">wolterskluwer</code></li>
<li class="list-inline-item"><code class="notranslate">woodside</code></li>
<li class="list-inline-item"><code class="notranslate">wtc</code></li>
<li class="list-inline-item"><code class="notranslate">xbox</code></li>
<li class="list-inline-item"><code class="notranslate">xerox</code></li>
<li class="list-inline-item"><code class="notranslate">xfinity</code></li>
<li class="list-inline-item"><code class="notranslate">yahoo</code></li>
<li class="list-inline-item"><code class="notranslate">yamaxun</code></li>
<li class="list-inline-item"><code Yandex
Yodobashi
YouTube
Zappos
Zara
Zara
Zippo

Usine de jeux vidéo

Depuis le 18 mars 2025, nous avons également ajouté ces territoires d'outre-mer français à cette liste ([selon cette requête GitHub](https://github.com/forwardemail/forwardemail.net/issues/327)) :

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

À compter du 8 juillet 2025, nous avons ajouté ces pays spécifiques à l'Europe :

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

Nous n'avons spécifiquement pas inclus `cz`, `ru` et `ua` en raison d'une activité de spam élevée.

### Quels sont vos critères de liste blanche ? {#what-is-your-allowlist-criteria}

Nous avons une liste statique de [extensions de noms de domaine autorisées par défaut](#what-domain-name-extensions-are-allowlisted-by-default) – et nous maintenons également une liste blanche dynamique, mise en cache et continue basée sur les critères stricts suivants :

* Le domaine racine de l'expéditeur doit être de type [extension de nom de domaine correspondant à la liste que nous proposons sur notre forfait gratuit](#what-domain-name-extensions-can-be-used-for-free) (avec l'ajout de `biz` et `info`). Nous incluons également les correspondances partielles `edu`, `gov` et `mil`, telles que `xyz.gov.au` et `xyz.edu.au`.
* Le domaine racine de l'expéditeur doit figurer parmi les 100 000 premiers résultats de domaines racines uniques analysés par [Liste de popularité des parapluies](http://s3-us-west-1.amazonaws.com/umbrella-static/index.html "Umbrella Popularity List") (« UPL »).
* Le domaine racine de l'expéditeur doit figurer parmi les 50 000 premiers résultats de domaines racines uniques apparaissant dans au moins 4 des 7 derniers jours d'UPL (\~50 %+).
* Le domaine racine de l'expéditeur ne doit pas être de type [catégorisé](https://radar.cloudflare.com/categorization-feedback/), car il est considéré comme du contenu pour adultes ou un logiciel malveillant par Cloudflare.
* Le domaine racine de l'expéditeur doit avoir des enregistrements A ou MX définis.
* Le domaine racine de l'expéditeur doit avoir soit un ou plusieurs enregistrements A, soit un ou plusieurs enregistrements MX, soit un enregistrement DMARC avec `biz`0 ou `biz`1, soit un enregistrement SPF avec le qualificateur `biz`2 ou `biz`3.

Si ce critère est rempli, le domaine racine de l'expéditeur sera mis en cache pendant 7 jours. Notez que notre tâche automatisée s'exécute quotidiennement ; il s'agit donc d'un cache de liste blanche évolutif mis à jour quotidiennement.

Notre travail automatisé téléchargera les 7 jours précédents de la mémoire UPL, les décompressera, puis analysera la mémoire selon les critères stricts ci-dessus.

Les domaines populaires au moment de la rédaction de cet article, tels que Google, Yahoo, Microsoft, Amazon, Meta, Twitter, Netflix, Spotify, et bien d'autres, sont bien sûr inclus.

Si vous n'êtes pas un expéditeur figurant sur notre liste blanche, lors du premier envoi d'un e-mail avec votre nom de domaine racine FQDN ou votre adresse IP, vous serez [taux limité](#do-you-have-rate-limiting) et [sur liste grise](#do-you-have-a-greylist). Il s'agit d'une pratique courante adoptée comme norme de messagerie. La plupart des clients de messagerie réessayeront s'ils reçoivent une erreur de limite de débit ou de liste grise (par exemple, un code d'erreur de niveau 421 ou 4xx).

**Notez que des expéditeurs spécifiques tels que `a@gmail.com`, `b@xyz.edu` et `c@gov.au` peuvent toujours être [sur liste noire](#do-you-have-a-denylist)** (par exemple, si nous détectons automatiquement du spam, du phishing ou des logiciels malveillants provenant de ces expéditeurs).

### Quelles extensions de nom de domaine peuvent être utilisées gratuitement {#what-domain-name-extensions-can-be-used-for-free}

À compter du 31 mars 2023, nous avons appliqué une nouvelle règle générale contre le spam pour protéger nos utilisateurs et notre service.

Cette nouvelle règle autorise uniquement l'utilisation des extensions de nom de domaine suivantes sur notre forfait gratuit :

<ul class="list-inline">
<li class="list-inline-item"><code class="notranslate">ac</code></li>
<li class="list-inline-item"><code class="notranslate">ad</code></li>
<li class="list-inline-item"><code class="notranslate">ag</code></li>
<li class="list-inline-item"><code class="notranslate">ai</code></li>
<li class="list-inline-item"><code class="notranslate">al</code></li>
<li class="list-inline-item"><code class="notranslate">am</code></li>
<li class="list-inline-item"><code class="notranslate">app</code></li>
<li class="list-inline-item"><code class="notranslate">as</code></li>
<li class="list-inline-item"><code class="notranslate">à</code></li>
<li class="list-inline-item"><code class="notranslate">au</code></li>
<li class="list-inline-item"><code class="notranslate">ba</code></li>
<li class="list-inline-item"><code class="notranslate">être</code></li>
<li class="list-inline-item"><code class="notranslate">br</code></li>
<li class="list-inline-item"><code class="notranslate">par</code></li>
<li class="list-inline-item"><code class="notranslate">ca</code></li>
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
<li class="list-inline-item"><code class="notranslate">fr</code></li>
<li class="list-inline-item"><code class="notranslate">gg</code></li>
<li class="list-inline-item"><code class="notranslate">gl</code></li>
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
<li class="list-inline-item"><code class="notranslate">lv</code></li>
<li class="list-inline-item"><code class="notranslate">ly</code></li>
<li class="list-inline-item"><code class="notranslate">md</code></li>
<li class="list-inline-item"><code class="notranslate">me</code></li>
<li class="list-inline-item"><code class="notranslate">mn</code></li>
<li class="list-inline-item"><code class="notranslate">ms</code></li>
<li class="list-inline-item"><code class="notranslate">mu</code></li>
<li class="list-inline-item"><code class="notranslate">mx</code></li>
<li class="list-inline-item"><code class="notranslate">net</code></li>
<li class="list-inline-item"><code class="notranslate">ni</code></li>
<li class="list-inline-item"><code class="notranslate">nl</code></li>
<li class="list-inline-item"><code class="notranslate">no</code></li>
<li class="list-inline-item"><code class="notranslate">nu</code></li>
<li class="list-inline-item"><code class="notranslate">nz</code></li>
<li class="list-inline-item"><code class="notranslate">org</code></li>
<li class="list-inline-item"><code class="notranslate">pl</code></li>
<li class="list-inline-item"><code class="notranslate">pr</code></li>
<li class="list-inline-item"><code class="notranslate">pt</code></li>
<li class="list-inline-item"><code class="notranslate">pw</code></li>
<li class="list-inline-item"><code class="notranslate">rs</code></li>
<li class="list-inline-item"><code class="notranslate">sc</code></li>
<li class="list-inline-item"><code class="notranslate">se</code></li>
<li class="list-inline-item"><code class="notranslate">sh</code></li>
<li class="list-inline-item"><code class="notranslate">si</code></li>
<li class="list-inline-item"><code class="notranslate">sm</code></li>
<li class="list-inline-item"><code class="notranslate">sr</code></li>
<li class="list-inline-item"><code class="notranslate">st</code></li>
<li class="list-inline-item"><code class="notranslate">tc</code></li>
<li class="list-inline-item"><code class="notranslate">tm</code></li>
<li class="list-inline-item"><code class="notranslate">to</code></li>
<li class="list-inline-item"><code class="notranslate">tv</code></li>
<li class="list-inline-item"><code class="notranslate">uk</code></li>
<li class="list-inline-item"><code class="notranslate">us</code></li>
<li class="list-inline-item"><code class="notranslate">uz</code></li>
<li class="list-inline-item"><code class="notranslate">vc</code></li>
<li class="list-inline-item"><code class="notranslate">vg</code></li>
<li class="list-inline-item"><code class="notranslate">vu</code></li>
<li class="list-inline-item"><code class="notranslate">ws</code></li>
<li class="list-inline-item"><code class="notranslate">xyz</code></li>
<li class="list-inline-item"><code class="notranslate">za</code></li>
</ul>

### Avez-vous une liste grise {#do-you-have-a-greylist}

Oui, nous appliquons une politique très souple ([liste grise des e-mails](https://en.wikipedia.org/wiki/Greylisting_\(email\)). La liste grise ne s'applique qu'aux expéditeurs ne figurant pas sur notre liste blanche et reste en cache pendant 30 jours.

Pour tout nouvel expéditeur, nous stockons une clé dans notre base de données Redis pendant 30 jours, dont la valeur correspond à l'heure d'arrivée initiale de sa première requête. Nous rejetons ensuite l'e-mail avec un code de nouvelle tentative de 450 et ne l'autorisons à passer qu'après 5 minutes.

S'ils ont attendu avec succès 5 minutes à partir de cette heure d'arrivée initiale, leurs e-mails seront acceptés et ils ne recevront pas ce code d'état 450.

La clé est constituée soit du nom de domaine racine complet, soit de l'adresse IP de l'expéditeur. Cela signifie que tout sous-domaine passant par la liste grise passera également pour le domaine racine, et inversement (c'est ce que nous appelons une politique « très laxiste »).

Par exemple, si un e-mail provient de `test.example.com` avant que nous ne voyions un e-mail provenant de `example.com`, alors tout e-mail provenant de `test.example.com` et/ou `example.com` devra attendre 5 minutes à compter de l'heure d'arrivée initiale de la connexion. `test.example.com` et `example.com` ne doivent pas attendre chacun leur propre période de 5 minutes (notre politique de liste grise s'applique au niveau du domaine racine).

Notez que la liste grise ne s'applique à aucun expéditeur sur notre [liste blanche](#do-you-have-an-allowlist) (par exemple, Meta, Amazon, Netflix, Google, Microsoft au moment de la rédaction de cet article).

### Avez-vous une liste de refus ? {#do-you-have-a-denylist}

Oui, nous exploitons notre propre liste de refus et la mettons à jour automatiquement en temps réel et manuellement en fonction des spams et des activités malveillantes détectés.

Nous extrayons également toutes les adresses IP de la liste de refus UCEPROTECT de niveau 1 à <http://wget-mirrors.uceprotect.net/rbldnsd-all/dnsbl-1.uceprotect.net.gz> toutes les heures et les alimentons dans notre liste de refus avec une expiration de 7 jours.

Les expéditeurs trouvés dans la liste de refus recevront un code d'erreur 421 (indique à l'expéditeur de réessayer plus tard) s'ils [ne sont pas sur la liste blanche](#do-you-have-an-allowlist).

En utilisant un code d'état 421 au lieu d'un code d'état 554, les faux positifs potentiels peuvent être atténués en temps réel et le message peut ensuite être délivré avec succès lors de la prochaine tentative.

**Ce service est conçu différemment des autres services de messagerie**, où l'inscription sur une liste noire entraîne une panne définitive. Il est souvent difficile de demander aux expéditeurs de réessayer d'envoyer leurs messages (surtout s'ils proviennent de grandes organisations). Cette approche laisse donc environ cinq jours à l'expéditeur, au destinataire ou à nous-mêmes pour intervenir et résoudre le problème (en demandant la suppression de la liste noire).

Toutes les demandes de suppression de listes de refus sont surveillées en temps réel par les administrateurs (par exemple, afin que les faux positifs récurrents puissent être définitivement ajoutés à la liste d'autorisation par les administrateurs).

Les demandes de suppression de la liste de refus peuvent être demandées à l'adresse <https://forwardemail.net/denylist>.. Les demandes de suppression de la liste de refus des utilisateurs payants sont traitées instantanément, tandis que les utilisateurs non payants doivent attendre que les administrateurs traitent leur demande.

Les expéditeurs détectés comme envoyant du spam ou du contenu viral seront ajoutés à la liste de blocage selon l'approche suivante :

1. Le [empreinte digitale du message initial](#how-do-you-determine-an-email-fingerprint) est ajouté à la liste grise en cas de détection de spam ou de liste noire provenant d'un expéditeur « de confiance » (par exemple, `gmail.com`, `microsoft.com`, `apple.com`).
* Si l'expéditeur était sur liste blanche, le message est ajouté à la liste grise pendant 1 heure.
* S'il n'est pas sur liste blanche, le message est ajouté à la liste grise pendant 6 heures.
2. Nous analysons les clés de liste noire à partir des informations de l'expéditeur et du message. Pour chacune de ces clés, nous créons (s'il n'en existe pas déjà) un compteur, l'incrémentons de 1 et le mettons en cache pendant 24 heures.
* Pour les expéditeurs sur liste blanche :
* Ajoutez une clé pour l'adresse e-mail « MAIL FROM » de l'enveloppe, qu'elle ait ou non un SPF valide, et qu'il ne s'agisse pas de [un nom d'utilisateur de postmaster](#what-are-postmaster-addresses) ou [un nom d'utilisateur sans réponse](#what-are-no-reply-addresses).
* Si l'en-tête « De » est sur liste blanche, ajoutez une clé pour l'adresse e-mail de l'en-tête « De » si elle possède un SPF valide ou un DKIM valide et aligné.
* Si l'en-tête « De » n'est pas sur liste blanche, ajoutez une clé pour l'adresse e-mail de l'en-tête « De » et son nom de domaine racine analysé.
* Pour les expéditeurs non autorisés :
* Ajoutez une clé pour l'adresse e-mail de l'enveloppe « MAIL FROM » si elle possède un SPF valide.
* Si l'en-tête « De » est sur liste blanche, ajoutez une clé pour l'adresse e-mail de l'en-tête « De » si elle possède un SPF valide ou un DKIM valide et aligné.
* Si l'en-tête « De » n'est pas sur liste blanche, ajoutez une clé pour l'adresse e-mail de l'en-tête « De » et son nom de domaine racine analysé.
* Ajoutez une clé pour l'adresse IP distante de l'expéditeur.
* Ajoutez une clé pour le nom d'hôte résolu par le client par recherche inversée à partir de l'adresse IP de l'expéditeur (le cas échéant).
* Ajoutez une clé pour le domaine racine du nom d'hôte résolu par le client (le cas échéant, et s'il diffère du nom d'hôte résolu par le client).
3. Si le compteur atteint 5 pour un expéditeur et une clé non autorisés, nous suspendons la clé pendant 30 jours et un e-mail est envoyé à notre équipe de gestion des abus. Ces chiffres sont susceptibles d'évoluer et les mises à jour seront affichées ici au fur et à mesure de notre surveillance des abus.
4. Si le compteur atteint 10 pour un expéditeur et une clé autorisés, nous suspendons la clé pendant 7 jours et un e-mail est envoyé à notre équipe de gestion des abus. Ces chiffres sont susceptibles d'évoluer et les mises à jour seront affichées ici au fur et à mesure de notre surveillance des abus.

**REMARQUE :** Nous introduirons prochainement un système de surveillance de la réputation. Ce système calculera le moment opportun pour bloquer un expéditeur en fonction d'un seuil de pourcentage (par opposition à un compteur rudimentaire comme indiqué ci-dessus).

### Avez-vous une limitation de débit ? {#do-you-have-rate-limiting}

La limitation du débit d'expéditeur s'effectue soit par le domaine racine analysé à partir d'une recherche PTR inversée sur l'adresse IP de l'expéditeur, soit, si cette opération ne donne aucun résultat, par l'utilisation de l'adresse IP de l'expéditeur. Notez que nous désignons cette valeur par `Sender` ci-dessous.

Nos serveurs MX ont des limites quotidiennes pour le courrier entrant reçu pour [stockage IMAP crypté](/blog/docs/best-quantum-safe-encrypted-email-service) :

* Au lieu de limiter le débit des messages entrants reçus par alias individuel (par exemple, `you@yourdomain.com`), nous limitons le débit en fonction du nom de domaine de l'alias lui-même (par exemple, `yourdomain.com`). Cela évite que `Senders` n'envahisse simultanément les boîtes de réception de tous les alias de votre domaine.
* Nous avons des limites générales qui s'appliquent à tous les `Senders` de notre service, quel que soit le destinataire :
* Les `Senders` que nous considérons comme une source fiable (par exemple, `gmail.com`, `microsoft.com`, `apple.com`) sont limités à 100 Go par jour.
* Les `Senders` qui sont [sur liste blanche](#do-you-have-an-allowlist) sont limités à 10 Go par jour. * Tous les autres `yourdomain.com`0 sont limités à 1 Go et/ou 1 000 messages par jour.
* Nous avons une limite spécifique par `yourdomain.com`1 et `yourdomain.com`2 de 1 Go et/ou 1 000 messages par jour.

Les serveurs MX limitent également les messages transférés à un ou plusieurs destinataires via la limitation du débit, mais cela ne s'applique qu'à `Senders` et non à [liste blanche](#do-you-have-an-allowlist) :

* Nous n'autorisons que 100 connexions par heure, par domaine racine FQDN résolu `Sender` (ou) par adresse IP distante `Sender` (si aucun PTR inversé n'est disponible), et par destinataire d'enveloppe. Nous stockons la clé de limitation de débit sous forme de hachage cryptographique dans notre base de données Redis.

* Si vous envoyez des e-mails via notre système, assurez-vous d'avoir configuré un PTR inversé pour toutes vos adresses IP (sinon, chaque domaine racine FQDN unique ou adresse IP à partir de laquelle vous envoyez sera limité en débit).

* Notez que si vous envoyez via un système populaire tel qu'Amazon SES, vous ne serez pas limité en débit puisque (au moment de la rédaction de cet article) Amazon SES est répertorié dans notre liste autorisée.

* Si vous envoyez depuis un domaine tel que `test.abc.123.example.com`, la limite de débit sera appliquée à `example.com`. De nombreux spammeurs utilisent des centaines de sous-domaines pour contourner les filtres anti-spam courants qui limitent le débit uniquement aux noms d'hôtes uniques, par opposition aux domaines racines FQDN uniques.

* Les `Senders` qui dépassent la limite de débit seront rejetés avec une erreur 421.

Nos serveurs IMAP et SMTP limitent vos alias à avoir plus de `60` connexions simultanées à la fois.

Nos serveurs MX limitent les expéditeurs [non autorisé](#do-you-have-an-allowlist) à établir plus de 10 connexions simultanées (avec une expiration du cache de 3 minutes pour le compteur, ce qui reflète notre délai d'expiration de socket de 3 minutes).

### Comment se protéger contre la rétrodiffusion {#how-do-you-protect-against-backscatter}

Les rebonds mal dirigés ou spams de rebond (appelés « [Rétrodiffusion](https://en.wikipedia.org/wiki/Backscatter_\(email\) ») peuvent entraîner une réputation négative pour les adresses IP des expéditeurs.

Nous prenons deux mesures pour nous protéger contre la rétrodiffusion, qui sont détaillées dans les sections suivantes [Empêcher les rebonds des spammeurs MAIL FROM connus](#prevent-bounces-from-known-mail-from-spammers) et [Empêcher les rebonds inutiles pour se protéger contre la rétrodiffusion](#prevent-unnecessary-bounces-to-protect-against-backscatter) ci-dessous.

### Empêcher les rebonds des spammeurs MAIL FROM connus {#prevent-bounces-from-known-mail-from-spammers}

Nous extrayons la liste de [Backscatter.org](https://www.backscatterer.org/) (alimenté par [UCEPROTECT](https://www.uceprotect.net/)) à <http://wget-mirrors.uceprotect.net/rbldnsd-all/ips.backscatterer.org.gz> toutes les heures et l'alimentons dans notre base de données Redis (nous comparons également la différence à l'avance ; au cas où des IP auraient été supprimées et devraient être respectées).

Si le MAIL FROM est vide OU est égal (insensible à la casse) à l'un des [adresses des maîtres de poste](#what-are-postmaster-addresses) (la partie avant le @ dans un e-mail), alors nous vérifions si l'adresse IP de l'expéditeur correspond à l'une de cette liste.

Si l'adresse IP de l'expéditeur est répertoriée (et non dans notre [liste blanche](#do-you-have-an-allowlist)), nous envoyons une erreur 554 avec le message `The IP ${session.remoteAddress} is blocked by https://www.backscatterer.org/index.php?target=test&ip=${session.remoteAddress}`. Nous serons alertés si un expéditeur figure à la fois sur la liste des rétrodiffuseurs et sur notre liste d'autorisation afin de résoudre le problème si nécessaire.

Les techniques décrites dans cette section respectent la recommandation « MODE SÉCURISÉ » à <https://www.backscatterer.org/?target=usage> – où nous vérifions uniquement l'adresse IP de l'expéditeur si certaines conditions sont déjà remplies.

### Empêche les rebonds inutiles pour se protéger contre la rétrodiffusion {#prevent-unnecessary-bounces-to-protect-against-backscatter}

Les rebonds sont des e-mails qui indiquent que la transmission de l'e-mail au destinataire a complètement échoué et que l'e-mail ne sera pas réessayé.

Une raison courante pour laquelle un e-mail est répertorié sur la liste des Backscatterers est le fait d'être mal dirigé ou d'être victime de spam. Nous devons donc nous protéger contre cela de plusieurs manières :

1. Nous envoyons uniquement lorsque des erreurs de code d'état >= 500 se produisent (lorsque les tentatives de transfert d'e-mails ont échoué, par exemple lorsque Gmail répond avec une erreur de niveau 500).

2. Nous n'envoyons qu'une seule fois (nous utilisons une clé d'empreinte de rebond calculée et la stockons en cache pour éviter les doublons). L'empreinte de rebond est une clé qui correspond à l'empreinte du message, combinée à un hachage de l'adresse de rebond et de son code d'erreur. Consultez la section [Empreintes digitales](#how-do-you-determine-an-email-fingerprint) pour plus d'informations sur le calcul de l'empreinte du message. Les empreintes de rebond envoyées avec succès expirent après 7 jours dans notre cache Redis.

3. Nous envoyons uniquement lorsque le MAIL FROM et/ou le De ne sont pas vides et ne contiennent pas (insensible à la casse) un [nom d'utilisateur du postmaster](#what-are-postmaster-addresses) (la partie avant le @ dans un e-mail).

4. Nous n'envoyons pas si le message d'origine contenait l'un des en-têtes suivants (insensible à la casse) :

* En-tête de `auto-submitted` dont la valeur est différente de `no`.
* En-tête de `x-auto-response-suppress` dont la valeur est `dr`, `autoreply`, `auto-reply`, `auto_reply` ou `all`
* En-tête de `list-id`, `list-subscribe`, `no`0, `no`1, `no`2, `no`3, `no`4, `no`5, `no`6 ou `no`7 (quelle que soit la valeur).
* En-tête de `no`8 avec une valeur de `no`9, `x-auto-response-suppress`0, `x-auto-response-suppress`1, `x-auto-response-suppress`2 ou `x-auto-response-suppress`3.

5. Nous n'envoyons pas si l'adresse e-mail MAIL FROM ou From se termine par `+donotreply`, `-donotreply`, `+noreply` ou `-noreply`.

6. Nous n'envoyons pas si la partie nom d'utilisateur de l'adresse e-mail de l'expéditeur était `mdaemon` et qu'elle avait un en-tête insensible à la casse de `X-MDDSN-Message`.

7. Nous n'envoyons pas s'il y avait un en-tête `content-type` insensible à la casse de `multipart/report`.

### Comment déterminer une empreinte digitale de courrier électronique {#how-do-you-determine-an-email-fingerprint}

L'empreinte digitale d'un e-mail est utilisée pour déterminer l'unicité d'un e-mail et pour empêcher la livraison de messages en double et l'envoi de [rebonds en double](#prevent-unnecessary-bounces-to-protect-against-backscatter).

L'empreinte digitale est calculée à partir de la liste suivante :

* Nom d'hôte FQDN ou adresse IP résolu par le client
* Valeur d'en-tête `Message-ID` (le cas échéant)
* Valeur d'en-tête `Date` (le cas échéant)
* Valeur d'en-tête `From` (le cas échéant)
* Valeur d'en-tête `To` (le cas échéant)
* Valeur d'en-tête `Cc` (le cas échéant)
* Valeur d'en-tête `Subject` (le cas échéant)
* Valeur d'en-tête `Body` (le cas échéant)

### Puis-je transférer des e-mails vers des ports autres que 25 (par exemple, si mon FAI a bloqué le port 25) {#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25}

Oui, nous avons ajouté cette fonctionnalité le 5 mai 2020. Pour l'instant, elle est spécifique à un domaine, et non à un alias. Si vous souhaitez qu'elle soit spécifique à un alias, veuillez nous contacter pour nous faire part de vos besoins.

<div class="alert my-3 alert-danger">
<i class="fa fa-stop-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Protection renforcée de la confidentialité :
</strong>
<span>
Si vous avez souscrit à un forfait payant (avec protection renforcée de la confidentialité), accédez à <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mon compte <i class="fa fa-angle-right"></i> Domaines</a>, cliquez sur « Configuration » à côté de votre domaine, puis sur « Paramètres ». Pour en savoir plus sur les forfaits payants, consultez notre page <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Tarifs</a>. Sinon, suivez les instructions ci-dessous.
</span>
</div>

Si vous utilisez le forfait gratuit, ajoutez simplement un nouvel enregistrement DNS <strong class="notranslate">TXT</strong> comme indiqué ci-dessous, mais remplacez le port 25 par le port de votre choix.

Par exemple, si je souhaite que tous les e-mails envoyés à `example.com` soient transférés vers le port SMTP 1337 des destinataires alias au lieu de 25 :

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
<td><em>"@", "." ou vide</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email-port=1337</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Astuce :
</strong>
Le scénario le plus courant pour la configuration d'une redirection de port personnalisée est celui où vous souhaitez transférer tous les e-mails destinés à example.com vers un port différent du port SMTP standard 25. Pour configurer cette configuration, ajoutez simplement l'enregistrement catch-all <strong class="notranslate">TXT</strong> suivant.
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
<td><em>"@", "." ou vide</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=example.com</code></td>
</tr>
</tbody>
</table>

### Prend-il en charge le symbole plus + pour les alias Gmail ? {#does-it-support-the-plus--symbol-for-gmail-aliases}

Oui, absolument.

### Prend-il en charge les sous-domaines {#does-it-support-sub-domains}

Oui, absolument. Au lieu d'utiliser « @ », « . » ou un espace vide comme nom/hôte/alias, utilisez simplement le nom du sous-domaine comme valeur.

Si vous souhaitez que `foo.example.com` transfère les e-mails, saisissez `foo` comme valeur de nom/hôte/alias dans vos paramètres DNS (pour les enregistrements MX et <strong class="notranslate">TXT</strong>).

### Est-ce que cela transfère les en-têtes de mon e-mail ? {#does-this-forward-my-emails-headers}

Oui, absolument.

### Est-ce bien testé {#is-this-well-tested}

Oui, il contient des tests écrits avec [ava](https://github.com/avajs/ava) et dispose également d'une couverture de code.

### Transmettez-vous les messages et codes de réponse SMTP ? {#do-you-pass-along-smtp-response-messages-and-codes}

Oui, absolument. Par exemple, si vous envoyez un e-mail à `hello@example.com` et qu'il est enregistré pour être transféré à `user@gmail.com`, le message et le code de réponse SMTP du serveur SMTP « gmail.com » seront renvoyés au lieu du serveur proxy « mx1.forwardemail.net » ou « mx2.forwardemail.net ».

### Comment empêcher les spammeurs et garantir une bonne réputation de transfert de courrier électronique ? {#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation}

Consultez nos sections sur [Comment fonctionne votre système de transfert d'e-mails](#how-does-your-email-forwarding-system-work), [Comment gérez-vous les problèmes de livraison des e-mails ?](#how-do-you-handle-email-delivery-issues) et [Comment gérez-vous le blocage de vos adresses IP ?](#how-do-you-handle-your-ip-addresses-becoming-blocked) ci-dessus.

### Comment effectuer des recherches DNS sur les noms de domaine {#how-do-you-perform-dns-lookups-on-domain-names}

Nous avons créé un projet logiciel open source :tangerine: [Tangerine](https://github.com/forwardemail/tangerine) et l'utilisons pour les recherches DNS. Les serveurs DNS par défaut sont `1.1.1.1` et `1.0.0.1`, et les requêtes DNS s'effectuent via [DNS sur HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) (« DoH ») au niveau applicatif.

:tangerine: [Tangerine](https://github.com/tangerine) utilise [par défaut le service DNS grand public axé sur la confidentialité de CloudFlare][cloudflare-dns].

## Compte et facturation {#account-and-billing}

### Offrez-vous une garantie de remboursement sur les forfaits payants ? {#do-you-offer-a-money-back-guarantee-on-paid-plans}

Oui ! Les remboursements automatiques sont effectués lorsque vous passez à un forfait supérieur, inférieur ou résiliez votre compte dans les 30 jours suivant la date de début de votre abonnement. Ceci s'applique uniquement aux nouveaux clients.

### Si je change de forfait, calculez-vous au prorata et remboursez-vous la différence ? {#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference}

Nous ne calculons pas au prorata ni ne remboursons la différence lors d'un changement d'abonnement. Nous convertissons la durée restante à compter de la date d'expiration de votre abonnement actuel en durée relative la plus proche de votre nouvel abonnement (arrondie au mois inférieur).

Veuillez noter que si vous effectuez une mise à niveau ou une rétrogradation entre des forfaits payants dans un délai de 30 jours après le démarrage d'un forfait payant, nous vous rembourserons automatiquement le montant total de votre forfait existant.

### Puis-je simplement utiliser ce service de transfert d'e-mails comme serveur MX « de secours » ou « de secours » ? {#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server}

Non, ce n'est pas recommandé, car vous ne pouvez utiliser qu'un seul serveur d'échange de messagerie à la fois. Les tentatives de secours ne sont généralement jamais répétées en raison de mauvaises configurations de priorité et de serveurs de messagerie ne respectant pas la vérification des priorités MX Exchange.

### Puis-je désactiver des alias spécifiques {#can-i-disable-specific-aliases}

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Important :
</strong>
<span>
Si vous avez un forfait payant, vous devez accéder à <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mon compte <i class="fa fa-angle-right"></i> Domaines</a> <i class="fa fa-angle-right"></i> Alias <i class="fa fa-angle-right"></i> Modifier l'alias <i class="fa fa-angle-right"></i> Décocher la case « Actif » <i class="fa fa-angle-right"></i> Continuer.
</span>
</div>

Oui, modifiez simplement votre enregistrement DNS <strong class="notranslate">TXT</strong> et préfixez l'alias avec un, deux ou trois points d'exclamation (voir ci-dessous).

Notez que vous *devez* conserver le mappage ":", car cela est nécessaire si jamais vous décidez de le désactiver (et il est également utilisé pour l'importation si vous passez à l'un de nos plans payants).

**Pour un rejet silencieux (il semble à l'expéditeur que le message a été envoyé avec succès, mais ne mène en réalité à rien) (code d'état `250`) :** Si vous préfixez un alias avec « ! » (un seul point d'exclamation), il renverra un code d'état réussi de `250` aux expéditeurs qui tentent d'envoyer à cette adresse, mais les e-mails eux-mêmes n'iront nulle part (par exemple, un trou noir ou `/dev/null`).

**Pour un rejet souple (code d'état `421`) :** Si vous préfixez un alias avec « !! » (double point d'exclamation), un code d'état d'erreur souple de `421` sera renvoyé aux expéditeurs qui tentent d'envoyer à cette adresse, et les e-mails seront souvent réessayés jusqu'à 5 jours avant d'être rejetés et renvoyés.

**Pour un rejet définitif (code d'état `550`) :** Si vous préfixez un alias avec « !!! » (triple point d'exclamation), un code d'état d'erreur permanent `550` sera renvoyé aux expéditeurs qui tentent d'envoyer à cette adresse et les e-mails seront rejetés et renvoyés.

Par exemple, si je veux que tous les e-mails qui vont à `alias@example.com` cessent de circuler vers `user@gmail.com` et soient rejetés et renvoyés (par exemple, utilisez trois points d'exclamation) :

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
<td><em>"@", "." ou vide</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=!!!alias:user@gmail.com</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Astuce :
</strong>
<span>
Vous pouvez également modifier l'adresse du destinataire transféré en « personne@courrieltransféré.net », ce qui ne le redirigera vers personne, comme dans l'exemple ci-dessous.
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
Conseil :
</strong>
<span>
Pour une sécurité renforcée, vous pouvez également supprimer la partie « :user@gmail.com » (ou « :nobody@forwardemail.net ») et conserver uniquement « !!!alias », comme dans l'exemple ci-dessous.
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

### Puis-je transférer des e-mails à plusieurs destinataires ? {#can-i-forward-emails-to-multiple-recipients}

Oui, absolument. Il suffit de spécifier plusieurs destinataires dans vos enregistrements <strong class="notranslate">TXT</strong>.

Par exemple, si je souhaite qu'un e-mail envoyé à `hello@example.com` soit transféré vers `user+a@gmail.com` et `user+b@gmail.com`, mon enregistrement <strong class="notranslate">TXT</strong> ressemblerait à ceci :

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
<td><em>"@", "." ou vide</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code class="cursor-initial" data-original-title="" title="">forward-email=hello:user+a@gmail.com,hello:user+b@gmail.com</code></td>
</tr>
</tbody>
</table>

Ou, vous pouvez les spécifier sur deux lignes distinctes, comme ceci :

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
<td><em>"@", "." ou vide</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=hello:user+a@gmail.com</code></td>
</tr>
<tr>
<td><em>"@", "." ou vide</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=hello:user+b@gmail.com</code></td>
</tr>
</tbody>
</table>

C'est à vous!

### Puis-je avoir plusieurs destinataires globaux fourre-tout ? {#can-i-have-multiple-global-catch-all-recipients}

Oui, c'est possible. Il vous suffit de spécifier plusieurs destinataires génériques dans vos enregistrements <strong class="notranslate">TXT</strong>.

Par exemple, si je veux que chaque e-mail envoyé à `*@example.com` (l'astérisque signifiant qu'il s'agit d'un caractère générique, autrement dit d'un fourre-tout) soit transféré vers `user+a@gmail.com` et `user+b@gmail.com`, alors mon enregistrement <strong class="notranslate">TXT</strong> ressemblerait à ceci :

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
<td><em>"@", "." ou vide</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=user+a@gmail.com,user+b@gmail.com</code></td>
</tr>
</tbody>
</table>

Ou, vous pouvez les spécifier sur deux lignes distinctes, comme ceci :

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
<td><em>"@", "." ou vide</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=user+a@gmail.com</code></td>
</tr>
<tr>
<td><em>@, "." ou vide</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=user+b@gmail.com</code></td>
</tr>
</tbody>
</table>

C'est à vous!

### Existe-t-il une limite maximale au nombre d'adresses e-mail vers lesquelles je peux transférer par alias ? {#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias}

Oui, la limite par défaut est de 10. Cela ne signifie pas que vous ne pouvez pas avoir plus de 10 alias sur votre nom de domaine. Vous pouvez en avoir autant que vous le souhaitez (sans limite). Cela signifie que vous ne pouvez transférer qu'un seul alias vers 10 adresses e-mail uniques. Vous pouvez utiliser `hello:user+1@gmail.com`, `hello:user+2@gmail.com`, `hello:user+3@gmail.com`, … (de 1 à 10) ; et les e-mails destinés à `hello@example.com` seront transférés vers `user+1@gmail.com`, `user+2@gmail.com`, `user+3@gmail.com`, … (de 1 à 10).

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Conseil :
</strong>
<span>
Vous avez besoin de plus de 10 destinataires par alias ? Envoyez-nous un e-mail et nous serons ravis d'augmenter la limite de votre compte.
</span>
</div>

### Puis-je transférer récursivement des e-mails {#can-i-recursively-forward-emails}

Oui, mais vous devez respecter la limite maximale. Si vous avez `hello:linus@example.com` et `linus:user@gmail.com`, les e-mails destinés à `hello@example.com` seront transférés vers `linus@example.com` et `user@gmail.com`. Notez qu'une erreur sera générée si vous tentez de transférer récursivement des e-mails au-delà de la limite maximale.

### Les gens peuvent-ils se désinscrire ou enregistrer ma redirection d'e-mails sans ma permission ? {#can-people-unregister-or-register-my-email-forwarding-without-my-permission}

Nous utilisons la vérification des enregistrements MX et <strong class="notranslate">TXT</strong>. Par conséquent, si vous ajoutez les enregistrements MX et <strong class="notranslate">TXT</strong> de ce service, votre enregistrement est terminé. Si vous les supprimez, votre enregistrement est annulé. Vous êtes propriétaire de votre domaine et de sa gestion DNS ; si quelqu'un y a accès, cela pose problème.

### Comment est-ce gratuit ? {#how-is-it-free}

Forward Email propose un niveau gratuit grâce à une combinaison de développement open source, d'infrastructure efficace et de plans payants optionnels qui prennent en charge le service.

Notre offre gratuite est soutenue par :

1. **Développement Open Source** : Notre base de code est open source, permettant les contributions de la communauté et un fonctionnement transparent.

2. **Infrastructure efficace** : Nous avons optimisé nos systèmes pour gérer le transfert des e-mails avec un minimum de ressources.

3. **Plans Premium payants** : les utilisateurs qui ont besoin de fonctionnalités supplémentaires telles que l'envoi SMTP, la réception IMAP ou des options de confidentialité améliorées s'abonnent à nos plans payants.

4. **Limites d'utilisation raisonnables** : Le niveau gratuit dispose de politiques d'utilisation équitable pour éviter les abus.

> \[!NOTE]
> Nous nous engageons à maintenir la gratuité du transfert d'e-mails de base tout en offrant des fonctionnalités premium aux utilisateurs ayant des besoins plus avancés.

> \[!TIP]
> Si vous trouvez notre service utile, envisagez de passer à une offre payante pour soutenir le développement et la maintenance continus.

### Quelle est la taille maximale des e-mails ? {#what-is-the-max-email-size-limit}

Par défaut, la taille limite est de 50 Mo, ce qui inclut le contenu, les en-têtes et les pièces jointes. Notez que des services comme Gmail et Outlook n'autorisent qu'une taille limite de 25 Mo. Si vous dépassez cette limite lors de l'envoi vers des adresses de ces fournisseurs, vous recevrez un message d'erreur.

Une erreur avec le code de réponse approprié est renvoyée si la limite de taille du fichier est dépassée.

### Stockez-vous les journaux des e-mails {#do-you-store-logs-of-emails}

Non, nous n'écrivons pas sur le disque ni ne stockons les journaux - avec [exception d'erreurs](#do-you-store-error-logs) et [SMTP sortant](#do-you-support-sending-email-with-smtp) (voir notre [politique de confidentialité](/privacy)).

Tout est fait en mémoire et [notre code source est sur GitHub](https://github.com/forwardemail).

### Stockez-vous les journaux d'erreurs {#do-you-store-error-logs}

**Oui. Vous pouvez accéder aux journaux d'erreurs sous [Mon compte → Journaux](/my-account/logs) ou [Mon compte → Domaines](/my-account/domains).**

Depuis février 2023, nous stockons les journaux d'erreurs pour les codes de réponse SMTP `4xx` et `5xx` pendant une période de 7 jours, qui contiennent l'erreur SMTP, l'enveloppe et les en-têtes de l'e-mail (nous **ne stockons** pas le corps de l'e-mail ni les pièces jointes).

Les journaux d'erreurs vous permettent de vérifier les e-mails importants manquants et de limiter les faux positifs de spam pour [vos domaines](/my-account/domains). Ils constituent également une excellente ressource pour déboguer les problèmes liés à [webhooks de messagerie](#do-you-support-webhooks) (puisqu'ils contiennent la réponse du point de terminaison du webhook).

Les journaux d'erreurs pour [limitation de débit](#do-you-have-rate-limiting) et [liste grise](#do-you-have-a-greylist) ne sont pas accessibles car la connexion se termine prématurément (par exemple, avant que les commandes `RCPT TO` et `MAIL FROM` puissent être transmises).

Consultez notre [politique de confidentialité](/privacy) pour plus d'informations.

### Lisez-vous mes e-mails ? {#do-you-read-my-emails}

Non, absolument pas. Voir notre [politique de confidentialité](/privacy).

De nombreux autres services de transfert d'e-mails stockent et peuvent potentiellement lire vos e-mails. Il n'y a aucune raison de stocker les e-mails transférés sur disque ; c'est pourquoi nous avons conçu la première solution open source qui gère tout cela en mémoire.

Nous pensons que votre vie privée est un droit et nous la respectons scrupuleusement. Le code déployé sur le serveur est [logiciel open source sur GitHub](https://github.com/forwardemail), par souci de transparence et de confiance.

### Puis-je « envoyer du courrier en tant que » dans Gmail avec ce {#can-i-send-mail-as-in-gmail-with-this}

Oui ! Cette fonctionnalité a été ajoutée le 2 octobre 2018. Voir [Comment envoyer du courrier électronique avec Gmail](#how-to-send-mail-as-using-gmail) ci-dessus !

Vous devez également définir l'enregistrement SPF pour Gmail dans votre configuration DNS <strong class="notranslate">enregistrement TXT</strong>.

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Important :
</strong>
<span>
Si vous utilisez Gmail (par exemple, Envoyer un e-mail en tant que) ou G Suite, vous devrez ajouter <code>include:_spf.google.com</code> à votre enregistrement SPF <strong class="notranslate">TXT</strong>, par exemple :
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
</span>
</div>

### Puis-je « envoyer du courrier en tant que » dans Outlook avec ce {#can-i-send-mail-as-in-outlook-with-this}

Oui ! Cette fonctionnalité a été ajoutée le 2 octobre 2018. Consultez les deux liens Microsoft ci-dessous :

* <https://support.office.com/en-us/article/add-or-remove-an-email-alias-in-outlook-com-459b1989-356d-40fa-a689-8f285b13f1f2>
* <https://support.office.com/en-us/article/send-email-from-a-different-address-in-outlook-com-ccba89cb-141c-4a36-8c56-6d16a8556d2e>

Vous devez également définir l'enregistrement SPF pour Outlook dans votre enregistrement de configuration DNS <strong class="notranslate">TXT</strong>.

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Important :
</strong>
<span>
Si vous utilisez Microsoft Outlook ou Live.com, vous devrez ajouter <code>include:spf.protection.outlook.com</code> à votre enregistrement SPF <strong class="notranslate">TXT</strong>, par exemple :
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:spf.protection.outlook.com -all</code>
</span>
</div>

### Puis-je « envoyer du courrier en tant que » dans Apple Mail et iCloud Mail avec ce {#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this}

Si vous êtes abonné à iCloud+, vous pouvez utiliser un domaine personnalisé. [Notre service est également compatible avec Apple Mail](#apple-mail).

Veuillez consulter <https://support.apple.com/en-us/102540> pour plus d'informations.

### Puis-je transférer un nombre illimité d'e-mails avec ce {#can-i-forward-unlimited-emails-with-this}

Oui, mais les expéditeurs « relativement inconnus » sont limités à 100 connexions par heure par nom d'hôte ou IP. Voir la section sur [Limitation de débit](#do-you-have-rate-limiting) et [Liste grise](#do-you-have-a-greylist) ci-dessus.

Par « relativement inconnu », nous entendons les expéditeurs qui n'apparaissent pas dans le [liste blanche](#do-you-have-an-allowlist).

Si cette limite est dépassée, nous envoyons un code de réponse 421 qui indique au serveur de messagerie de l'expéditeur de réessayer ultérieurement.

### Proposez-vous des domaines illimités pour un prix unique ? {#do-you-offer-unlimited-domains-for-one-price}

Oui. Quel que soit votre forfait, vous ne paierez qu'un seul forfait mensuel, couvrant tous vos domaines.

### Quels modes de paiement acceptez-vous ? {#which-payment-methods-do-you-accept}

Forward Email accepte les méthodes de paiement uniques ou mensuelles/trimestrielles/annuelles suivantes :

1. **Cartes de crédit/débit/Virements bancaires** : Visa, Mastercard, American Express, Discover, JCB, Diners Club, etc.
2. **PayPal** : Connectez votre compte PayPal pour des paiements faciles.
3. **Cryptomonnaie** : Nous acceptons les paiements par stablecoin Stripe sur les réseaux Ethereum, Polygon et Solana.

> \[!NOTE]
> Nous stockons des informations de paiement limitées sur nos serveurs, qui incluent uniquement les identifiants de paiement et les références aux identifiants de transaction, de client, d'abonnement et de paiement [Bande](https://stripe.com/global) et [PayPal](https://www.paypal.com).

> \[!TIP]
> Pour une confidentialité maximale, pensez à utiliser les paiements en cryptomonnaies.

Tous les paiements sont traités de manière sécurisée via Stripe ou PayPal. Vos informations de paiement ne sont jamais stockées sur nos serveurs.

## Ressources supplémentaires {#additional-resources}

> \[!TIP]
> Nos articles ci-dessous sont régulièrement mis à jour avec de nouveaux guides, astuces et informations techniques. Consultez-les régulièrement pour découvrir les dernières nouveautés.

* [Études de cas et documentation pour les développeurs](/blog/docs)
* [Ressources](/resources)
* [Guides](/guides)

[gmail-2fa] : https://myaccount.google.com/signinoptions/two-step-verification

[cloudflare-dns] : https://blog.cloudflare.com/announcing-1111/