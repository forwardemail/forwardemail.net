# À propos de Forward Email {#about-forward-email}

<img loading="lazy" src="/img/articles/about.webp" alt="Équipe et histoire de l'entreprise Forward Email" class="rounded-lg" />

# À propos de Forward Email {#about-forward-email-1}


## Table des matières {#table-of-contents}

* [Aperçu](#overview)
* [Fondateur et mission](#founder-and-mission)
* [Chronologie](#timeline)
  * [2017 - Fondation et lancement](#2017---founding-and-launch)
  * [2018 - Infrastructure et intégration](#2018---infrastructure-and-integration)
  * [2019 - Révolution des performances](#2019---performance-revolution)
  * [2020 - Focus sur la confidentialité et la sécurité](#2020---privacy-and-security-focus)
  * [2021 - Modernisation de la plateforme](#2021---platform-modernization)
  * [2023 - Expansion de l'infrastructure et des fonctionnalités](#2023---infrastructure-and-feature-expansion)
  * [2024 - Optimisation du service et fonctionnalités avancées](#2024---service-optimization-and-advanced-features)
  * [2025 - Améliorations de la confidentialité et support des protocoles {#2025---privacy-enhancements-and-protocol-support}](#2025---privacy-enhancements-and-protocol-support-2025---privacy-enhancements-and-protocol-support)
  * [2026 - Conformité RFC et filtrage avancé {#2026---rfc-compliance-and-advanced-filtering}](#2026---rfc-compliance-and-advanced-filtering-2026---rfc-compliance-and-advanced-filtering)
* [Principes fondamentaux](#core-principles)
* [Statut actuel](#current-status)


## Aperçu {#overview}

> \[!TIP]
> Pour des détails techniques sur notre architecture, nos implémentations de sécurité et notre feuille de route, consultez le [Livre blanc technique](https://forwardemail.net/technical-whitepaper.pdf).

Forward Email est un service de [transfert d’e-mails](https://en.wikipedia.org/wiki/Email_forwarding "Email forwarding") [gratuit et open-source](https://en.wikipedia.org/wiki/Free_and_open-source "Free and open-source") axé sur le [droit à la vie privée](https://en.wikipedia.org/wiki/Right_to_privacy "Right to privacy") de l’utilisateur. Ce qui a commencé comme une simple solution de transfert d’e-mails en 2017 est devenu une plateforme complète offrant des noms de domaine personnalisés illimités, des adresses e-mail et alias illimités, des adresses e-mail jetables illimitées, une protection contre le spam et le phishing, un stockage chiffré des boîtes aux lettres, ainsi que de nombreuses fonctionnalités avancées.

Le service est maintenu et détenu par son équipe fondatrice originale composée de designers et développeurs. Il est construit à 100 % avec des logiciels open-source utilisant [JavaScript](https://en.wikipedia.org/wiki/JavaScript "JavaScript"), [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js"), [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System"), [HTTPS](https://en.wikipedia.org/wiki/HTTPS "HTTPS"), [TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security "TLS") et [SMTP](https://en.wikipedia.org/wiki/SMTP "SMTP").


## Fondateur et mission {#founder-and-mission}

Forward Email a été fondé par **Nicholas Baugh** en 2017. Selon le [Livre blanc technique de Forward Email](https://forwardemail.net/technical-whitepaper.pdf), Baugh recherchait initialement une solution simple et économique pour activer les e-mails sur des noms de domaine pour ses projets annexes. Après avoir étudié les options disponibles, il a commencé à coder sa propre solution et a acheté le domaine `forwardemail.net` le 2 octobre 2017.

La mission de Forward Email va au-delà de la fourniture de services e-mail — elle vise à transformer la manière dont l’industrie aborde la confidentialité et la sécurité des e-mails. Les valeurs fondamentales de l’entreprise incluent la transparence, le contrôle utilisateur et la protection de la vie privée par une mise en œuvre technique plutôt que par de simples promesses politiques.


## Chronologie {#timeline}

### 2017 - Fondation et lancement {#2017---founding-and-launch}

**2 octobre 2017** : Nicholas Baugh a acheté le domaine `forwardemail.net` après avoir recherché des solutions e-mail économiques pour ses projets annexes.

**5 novembre 2017** : Baugh a créé un fichier JavaScript de 634 lignes utilisant [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js") pour transférer les e-mails pour n’importe quel nom de domaine personnalisé. Cette première implémentation a été publiée en open-source sur [GitHub](https://github.com/forwardemail) et le service a été lancé via GitHub Pages.
**Novembre 2017** : Forward Email a été officiellement lancé après une première version. La version initiale était purement basée sur le DNS sans inscription ni création de compte — simplement un fichier README écrit en Markdown avec des instructions. Les utilisateurs pouvaient configurer le transfert d’email en configurant les enregistrements MX pour pointer vers `mx1.forwardemail.net` et `mx2.forwardemail.net`, et en ajoutant un enregistrement TXT avec `forward-email=user@gmail.com`.

La simplicité et l’efficacité de cette solution ont attiré l’attention de développeurs renommés, dont [David Heinemeier Hansson](https://dhh.dk) (créateur de Ruby on Rails), qui continue d’utiliser Forward Email sur son domaine `dhh.dk` à ce jour.

### 2018 - Infrastructure et Intégration {#2018---infrastructure-and-integration}

**Avril 2018** : Lorsque [Cloudflare](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") a lancé son [service DNS grand public axé sur la confidentialité](https://blog.cloudflare.com/announcing-1111/), Forward Email est passé de l’utilisation de [OpenDNS](https://en.wikipedia.org/wiki/OpenDNS "OpenDNS") à [Cloudflare](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") pour gérer les requêtes [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System"), démontrant l’engagement de l’entreprise envers des choix d’infrastructure axés sur la confidentialité.

**Octobre 2018** : Forward Email a permis aux utilisateurs d’« Envoyer un mail en tant que » avec [Gmail](https://en.wikipedia.org/wiki/Gmail "Gmail") et [Outlook](https://en.wikipedia.org/wiki/Outlook "Outlook"), élargissant les capacités d’intégration avec les fournisseurs de messagerie populaires.

### 2019 - Révolution des Performances {#2019---performance-revolution}

**Mai 2019** : Forward Email a publié la version 2, qui représentait une réécriture majeure par rapport aux versions initiales. Cette mise à jour s’est concentrée sur les améliorations de la [performance](https://en.wikipedia.org/wiki/Software_performance_testing "Software performance testing") grâce à l’utilisation des [streams](https://en.wikipedia.org/wiki/Streams "Streams") de [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js"), établissant les bases de la scalabilité de la plateforme.

### 2020 - Focus sur la Confidentialité et la Sécurité {#2020---privacy-and-security-focus}

**Février 2020** : Forward Email a lancé le plan de Protection de la Confidentialité Améliorée, permettant aux utilisateurs de désactiver la création d’entrées publiques dans les enregistrements DNS avec leurs alias de configuration de transfert d’email. Grâce à ce plan, les informations sur les alias email d’un utilisateur sont cachées et ne sont pas accessibles publiquement sur Internet. L’entreprise a également publié une fonctionnalité permettant d’activer ou de désactiver des alias spécifiques tout en leur permettant d’apparaître comme des adresses email valides et de retourner des [codes de statut SMTP](https://en.wikipedia.org/wiki/List_of_SMTP_server_return_codes "List of SMTP server return codes") réussis, les emails étant immédiatement supprimés (similaire à rediriger la sortie vers [/dev/null](https://en.wikipedia.org/wiki/Null_device "Null device")).

**Avril 2020** : Après avoir rencontré de nombreux obstacles avec les solutions existantes de détection de spam qui ne respectaient pas la politique de confidentialité de Forward Email, l’entreprise a publié sa version alpha initiale du Spam Scanner. Cette solution de filtrage anti-spam [open source](https://en.wikipedia.org/wiki/Anti-spam_techniques "Anti-spam techniques") et totalement gratuite utilise une approche de filtre anti-spam [Naive Bayes](https://en.wikipedia.org/wiki/Naive_Bayes_spam_filtering "Naive Bayes spam filtering") combinée à une protection contre le [phishing](https://en.wikipedia.org/wiki/Phishing "Phishing") et les attaques par homographes IDN ([IDN homograph attack](https://en.wikipedia.org/wiki/IDN_homograph_attack "IDN homograph attack")). Forward Email a également publié l’[authentification à deux facteurs](https://en.wikipedia.org/wiki/Multi-factor_authentication "Multi-factor authentication") (2FA) utilisant des [mots de passe à usage unique](https://en.wikipedia.org/wiki/One-time_password "One-time password") (OTP) pour renforcer la sécurité des comptes.

**Mai 2020** : Forward Email a permis le [transfert de port](https://en.wikipedia.org/wiki/Port_forwarding "Port forwarding") personnalisé comme solution de contournement pour les utilisateurs afin d’éviter le blocage de ports par leur [FAI](https://en.wikipedia.org/wiki/Internet_service_provider "Internet service provider"). L’entreprise a également publié son [API RESTful de transfert d’email gratuit](email-api) avec une documentation complète et des exemples de requêtes et réponses en temps réel, ainsi qu’un support pour les webhooks.
**août 2020** : Forward Email a ajouté la prise en charge du système d'authentification email [Authenticated Received Chain](arc) ("ARC"), renforçant ainsi la sécurité et la délivrabilité des emails.

**23 novembre 2020** : Forward Email a lancé publiquement sa plateforme hors de son programme bêta, marquant une étape importante dans le développement de la plateforme.

### 2021 - Modernisation de la plateforme {#2021---platform-modernization}

**février 2021** : Forward Email a refactorisé sa base de code pour supprimer toutes les dépendances à [Python](https://en.wikipedia.org/wiki/Python_\(programming_language\) "Python (programming language)"), permettant à leur stack de devenir 100 % [JavaScript](https://en.wikipedia.org/wiki/JavaScript "JavaScript") et [Node.js](https://en.wikipedia.org/wiki/Node.js). Cette décision architecturale s'alignait avec l'engagement de l'entreprise à maintenir une stack technologique cohérente et open-source.

**27 septembre 2021** : Forward Email a [ajouté la prise en charge](email-forwarding-regex-pattern-filter) des alias de redirection d'email pour correspondre aux [expressions régulières](https://en.wikipedia.org/wiki/Regular_expression "Regular expression"), offrant aux utilisateurs des capacités de routage d'email plus sophistiquées.

### 2023 - Expansion de l'infrastructure et des fonctionnalités {#2023---infrastructure-and-feature-expansion}

**janvier 2023** : Forward Email a lancé un site web repensé et optimisé pour la vitesse de chargement, améliorant l'expérience utilisateur et les performances.

**février 2023** : L'entreprise a ajouté la prise en charge des [journaux d'erreurs](/faq#do-you-store-error-logs) et a mis en place un schéma de couleurs en [mode sombre](https://en.wikipedia.org/wiki/Light-on-dark_color_scheme) pour le site web, répondant aux préférences des utilisateurs et aux besoins d'accessibilité.

**mars 2023** : Forward Email a publié [Tangerine](https://github.com/forwardemail/tangerine#readme) et l'a intégré dans toute son infrastructure, permettant l'utilisation de [DNS over HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") au niveau de l'application. L'entreprise a également ajouté la prise en charge de [MTA-STS](/faq#do-you-support-mta-sts) et est passée de [hCaptcha](/) à [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile).

**avril 2023** : Forward Email a mis en œuvre et automatisé une toute nouvelle infrastructure. L'ensemble du service fonctionne désormais sur un DNS globalement équilibré en charge et basé sur la proximité avec des contrôles de santé et un basculement utilisant [Cloudflare](https://cloudflare.com), remplaçant l'approche DNS round-robin précédente. L'entreprise est passée à des **serveurs bare metal** chez plusieurs fournisseurs, dont [Vultr](https://www.vultr.com/?ref=429848) et [Digital Ocean](https://m.do.co/c/a7cecd27e071), tous deux conformes SOC 2 Type 1. Les bases de données MongoDB et Redis ont été déplacées vers des configurations en cluster avec des nœuds primaires et de secours pour une haute disponibilité, un chiffrement SSL de bout en bout, un chiffrement au repos et une récupération à un point dans le temps (PITR).

**mai 2023** : Forward Email a lancé sa fonctionnalité **SMTP sortant** pour [l'envoi d'emails avec SMTP](/faq#do-you-support-sending-email-with-smtp) et [l'envoi d'emails via API](/faq#do-you-support-sending-email-with-api). Cette fonctionnalité inclut des protections intégrées pour garantir une haute délivrabilité, un système de file d'attente et de réessai moderne et robuste, et [prend en charge les journaux d'erreurs en temps réel](/faq#do-you-store-error-logs).

**novembre 2023** : Forward Email a lancé sa fonctionnalité de [**stockage de boîte aux lettres chiffrée**](/blog/docs/best-quantum-safe-encrypted-email-service) pour la [prise en charge IMAP](/faq#do-you-support-receiving-email-with-imap), représentant une avancée significative en matière de confidentialité et de sécurité des emails.

**décembre 2023** : L'entreprise a [ajouté la prise en charge](/faq#do-you-support-pop3) de [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol), des [passkeys et WebAuthn](/faq#do-you-support-passkeys-and-webauthn), de la surveillance du [temps jusqu'à la boîte de réception](/faq#i), et de [OpenPGP pour le stockage IMAP](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd).

### 2024 - Optimisation du service et fonctionnalités avancées {#2024---service-optimization-and-advanced-features}

**février 2024** : Forward Email a [ajouté la prise en charge des calendriers (CalDAV)](/faq#do-you-support-calendars-caldav), étendant les capacités de la plateforme au-delà de l'email pour inclure la synchronisation des calendriers.
**Mars à juillet 2024** : Forward Email a publié d'importantes optimisations et améliorations de ses services IMAP, POP3 et CalDAV, dans le but de rendre leur service aussi rapide, voire plus rapide, que les alternatives.

**Juillet 2024** : L'entreprise [a ajouté la prise en charge du Push iOS](https://github.com/nodemailer/wildduck/issues/711#issuecomment-2254114016) pour pallier l'absence de support de la commande IMAP `IDLE` dans Apple Mail sur iOS, permettant des notifications en temps réel pour les appareils Apple iOS. Forward Email a également ajouté la surveillance du temps jusqu'à la boîte de réception ("TTI") pour son propre service ainsi que pour Yahoo/AOL, et a commencé à permettre aux utilisateurs de chiffrer l'intégralité de leur enregistrement DNS TXT même sur le plan gratuit. Comme demandé dans les [discussions Privacy Guides](https://discuss.privacyguides.net/t/forward-email-email-provider/13370) et les [issues GitHub](https://github.com/forwardemail/forwardemail.net/issues/254), l'entreprise a ajouté la possibilité pour les alias de rejeter silencieusement `250`, de rejeter temporairement `421` ou de rejeter définitivement `550` lorsqu'ils sont désactivés.

**Août 2024** : Forward Email a ajouté la prise en charge de l'exportation des boîtes aux lettres aux formats [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions) et [Mbox](https://en.wikipedia.org/wiki/Mbox) (en plus du format d'exportation [SQLite](https://en.wikipedia.org/wiki/SQLite) existant). [La prise en charge de la signature des webhooks a été ajoutée](https://forwardemail.net/faq#do-you-support-bounce-webhooks), et l'entreprise a commencé à permettre aux utilisateurs d'envoyer des newsletters, annonces et campagnes d'email marketing via leur service SMTP sortant. Des quotas de stockage au niveau du domaine et spécifiques aux alias pour IMAP/POP3/CalDAV ont également été mis en place.

### 2025 - Améliorations de la confidentialité et prise en charge des protocoles {#2025---privacy-enhancements-and-protocol-support} {#2025---privacy-enhancements-and-protocol-support-2025---privacy-enhancements-and-protocol-support}

**Septembre 2024 à janvier 2025** : Forward Email [a ajouté une fonctionnalité de répondeur automatique de vacances très demandée ainsi que le chiffrement OpenPGP/WKD pour le transfert d'emails](https://discuss.privacyguides.net/t/forward-email-email-provider/13370/254), s'appuyant sur leurs capacités déjà mises en œuvre de stockage chiffré des boîtes aux lettres.

**21 janvier 2025** : Le meilleur ami du fondateur, "Jack", son fidèle compagnon canin, est décédé paisiblement à l'âge de presque 11 ans. Jack [sera toujours rappelé](https://github.com/forwardemail/forwardemail.net/commit/994ce771f0338cbe77f10bd613989e0924883f9b) pour sa compagnie indéfectible qui a soutenu la création de Forward Email. Le [Livre blanc technique de Forward Email](https://forwardemail.net/technical-whitepaper.pdf) lui est dédié, reconnaissant son rôle dans le développement du service.

**Février 2025** : Forward Email est passé à [DataPacket](https://www.datapacket.com) comme nouveau fournisseur principal de centre de données, mettant en œuvre du matériel bare-metal personnalisé et axé sur la performance pour améliorer encore la fiabilité et la rapidité du service.

**Mars 2025** : La version 1.0 de Forward Email a été officiellement publiée.

**Avril 2025** : La première version du [Livre blanc technique de Forward Email](https://forwardemail.net/technical-whitepaper.pdf) a été publiée, et l'entreprise a commencé à accepter les paiements en cryptomonnaies.

**Mai 2025** : Le service a lancé une nouvelle documentation API utilisant [Scalar](https://github.com/scalar/scalar).

**Juin 2025** : Forward Email a lancé la prise en charge du [protocole CardDAV](/faq#do-you-support-contacts-carddav), étendant les capacités de la plateforme pour inclure la synchronisation des contacts en plus des services de messagerie et de calendrier existants.

**Août 2025** : La plateforme a ajouté la prise en charge des [tâches CalDAV VTODO](https://en.wikipedia.org/wiki/ICalendar#To-do_\(VTODO\)), permettant la gestion des tâches en parallèle des événements calendaires.

**Novembre 2025** : La sécurité de la plateforme a été renforcée avec une migration de PBKDF2 vers [Argon2id](https://en.wikipedia.org/wiki/Argon2) pour le hachage des mots de passe, et l'infrastructure a été migrée de Redis vers [Valkey](https://github.com/valkey-io/valkey).

**Décembre 2025** : La version 2.0 a été publiée, introduisant la prise en charge de [REQUIRETLS (RFC 8689)](/rfc#requiretls-support) pour un chiffrement TLS obligatoire lors du transport des emails et la mise à niveau vers [OpenPGP.js](https://github.com/openpgpjs/openpgpjs) v6.
### 2026 - Conformité RFC et filtrage avancé {#2026---rfc-compliance-and-advanced-filtering} {#2026---rfc-compliance-and-advanced-filtering-2026---rfc-compliance-and-advanced-filtering}

**Janvier 2026** : Forward Email a publié un [document complet sur la conformité aux protocoles RFC](/blog/docs/email-protocols-rfc-compliance-imap-smtp-pop3-comparison) et ajouté la prise en charge du [chiffrement S/MIME (RFC 8551)](/faq#do-you-support-smime-encryption) ainsi qu’un filtrage complet des emails avec [Sieve (RFC 5228)](/faq#do-you-support-sieve-email-filtering) et le support du protocole [ManageSieve (RFC 5804)](/faq#do-you-support-sieve-email-filtering). L’API REST a également été étendue à 39 points de terminaison.

**Février 2026** : Le client webmail officiel et open-source a été lancé sur [mail.forwardemail.net](https://mail.forwardemail.net) ([code source sur GitHub](https://github.com/forwardemail/mail.forwardemail.net)). La plateforme a aussi ajouté la prise en charge des [extensions de planification CalDAV (RFC 6638)](https://www.rfc-editor.org/rfc/rfc6638), [DANE/TLSA (RFC 6698)](https://en.wikipedia.org/wiki/DNS-based_Authentication_of_Named_Entities) et [Domain Connect](https://domainconnect.org) pour une configuration DNS en un clic. Des notifications push en temps réel pour IMAP, CalDAV et CardDAV ont été lancées via WebSockets.

**Mars 2026** : La prise en charge du stockage personnalisé compatible S3 par domaine a été ajoutée, ainsi qu’un outil en ligne de commande pour la gestion. Les travaux ont commencé sur des applications de bureau et mobiles multiplateformes pour macOS, Windows, Linux, iOS et Android utilisant la même base de code open-source du webmail, développées avec [Tauri](https://tauri.app).


## Principes fondamentaux {#core-principles}

Depuis sa création, Forward Email s’est engagé fermement envers les principes de confidentialité et de sécurité :

**Philosophie 100 % open-source** : Contrairement aux concurrents qui ne rendent open-source que leurs interfaces tout en gardant leurs backends fermés, Forward Email a rendu l’intégralité de son code—frontend et backend—disponible pour examen public sur [GitHub](https://github.com/forwardemail).

**Conception axée sur la confidentialité** : Dès le premier jour, Forward Email a mis en œuvre une approche unique de traitement en mémoire qui évite d’écrire les emails sur disque, ce qui le distingue des services de messagerie classiques qui stockent les messages dans des bases de données ou systèmes de fichiers.

**Innovation continue** : Le service a évolué d’une simple solution de transfert d’emails à une plateforme complète avec des fonctionnalités telles que des boîtes aux lettres chiffrées, un chiffrement résistant au quantique, et la prise en charge des protocoles standards comme SMTP, IMAP, POP3 et CalDAV.

**Transparence** : En rendant tout le code open-source et disponible à l’inspection, les utilisateurs peuvent vérifier les affirmations de confidentialité plutôt que de simplement faire confiance aux déclarations marketing.

**Contrôle utilisateur** : Offrir aux utilisateurs des options, y compris la possibilité d’auto-héberger la plateforme entière s’ils le souhaitent.


## Statut actuel {#current-status}

En mars 2026, Forward Email dessert plus de 500 000 domaines dans le monde, incluant des organisations notables et des leaders du secteur tels que :

* **Entreprises technologiques** : Canonical (Ubuntu), Netflix Games, The Linux Foundation, The PHP Foundation, jQuery, LineageOS
* **Organisations médiatiques** : Fox News Radio, Disney Ad Sales
* **Institutions éducatives** : Université de Cambridge, Université du Maryland, Université de Washington, Tufts University, Swarthmore College
* **Entités gouvernementales** : Gouvernement d’Australie-Méridionale, Gouvernement de la République dominicaine
* **Autres organisations** : RCD Hotels, Fly<span>.</span>io
* **Développeurs notables** : Isaac Z. Schlueter (créateur de npm), David Heinemeier Hansson (créateur de Ruby on Rails)

La plateforme continue d’évoluer avec des sorties régulières de fonctionnalités et des améliorations d’infrastructure, maintenant sa position comme le seul service de messagerie 100 % open-source, chiffré, axé sur la confidentialité, transparent et résistant au quantique disponible aujourd’hui.

<img loading="lazy" src="/img/articles/about-footer.webp" alt="Forward Email privacy-focused email service" class="rounded-lg" />
