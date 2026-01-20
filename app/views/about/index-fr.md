# À propos du transfert d'e-mail {#about-forward-email}

<img loading="lazy" src="/img/articles/about.webp" alt="Forward Email team and company story" class="rounded-lg" />

# À propos du transfert d'e-mail {#about-forward-email-1}

## Table des matières {#table-of-contents}

* [Aperçu](#overview)
* [Fondateur et mission](#founder-and-mission)
* [Chronologie](#timeline)
  * [2017 - Fondation et lancement](#2017---founding-and-launch)
  * [2018 - Infrastructure et intégration](#2018---infrastructure-and-integration)
  * [2019 - Révolution de la performance](#2019---performance-revolution)
  * [2020 - Focus sur la confidentialité et la sécurité](#2020---privacy-and-security-focus)
  * [2021 - Modernisation de la plateforme](#2021---platform-modernization)
  * [2023 - Extension des infrastructures et des fonctionnalités](#2023---infrastructure-and-feature-expansion)
  * [2024 - Optimisation des services et fonctionnalités avancées](#2024---service-optimization-and-advanced-features)
  * [2025 - Innovation continue](#2025---continued-innovation)
* [Principes fondamentaux](#core-principles)
* [Statut actuel](#current-status)

## Présentation de {#overview}

> \[!TIP]
> Pour plus de détails techniques sur notre architecture, nos implémentations de sécurité et notre feuille de route, consultez [Livre blanc technique](https://forwardemail.net/technical-whitepaper.pdf).

Forward Email est un service [libre et open source](https://en.wikipedia.org/wiki/Free_and_open-source "Free and open-source") [transfert d'e-mails](https://en.wikipedia.org/wiki/Email_forwarding "Email forwarding") axé sur le [droit à la vie privée](https://en.wikipedia.org/wiki/Right_to_privacy "Right to privacy") de l'utilisateur. Ce qui a débuté en 2017 comme une simple solution de transfert d'e-mails est devenu une plateforme de messagerie complète offrant un nombre illimité de noms de domaine personnalisés, d'adresses e-mail et d'alias, ainsi qu'un nombre illimité d'adresses e-mail jetables, une protection anti-spam et anti-hameçonnage, un stockage chiffré des boîtes aux lettres et de nombreuses fonctionnalités avancées.

Le service est géré et détenu par son équipe fondatrice de concepteurs et de développeurs. Il est développé avec un logiciel 100 % open source utilisant [JavaScript](https://en.wikipedia.org/wiki/JavaScript "JavaScript"), [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js"), [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System"), [HTTPS](https://en.wikipedia.org/wiki/HTTPS "HTTPS"), [TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security "TLS") et [SMTP](https://en.wikipedia.org/wiki/SMTP "SMTP").

## Fondateur et mission {#founder-and-mission}

Forward Email a été fondé par **Nicholas Baugh** en 2017. Selon [Livre blanc technique sur le transfert d'e-mails](https://forwardemail.net/technical-whitepaper.pdf), Baugh recherchait initialement une solution simple et économique pour activer la messagerie électronique sur les noms de domaine de ses projets annexes. Après avoir étudié les options disponibles, il a commencé à coder sa propre solution et a acheté le domaine `forwardemail.net` le 2 octobre 2017.

La mission de Forward Email va au-delà de la fourniture de services de messagerie : elle vise à transformer la manière dont le secteur aborde la confidentialité et la sécurité des e-mails. Les valeurs fondamentales de l'entreprise sont la transparence, le contrôle des utilisateurs et la protection de la vie privée par des mises en œuvre techniques plutôt que par de simples promesses politiques.

## Chronologie {#timeline}

### 2017 - Fondation et lancement {#2017---founding-and-launch}

**2 octobre 2017** : Nicholas Baugh a acheté le domaine `forwardemail.net` après avoir recherché des solutions de messagerie rentables pour ses projets parallèles.

**5 novembre 2017** : Baugh a créé un fichier JavaScript de 634 lignes utilisant [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js") pour transférer les e-mails de n'importe quel nom de domaine personnalisé. Cette implémentation initiale a été publiée en open source sur [GitHub](https://github.com/forwardemail) et le service a été lancé via GitHub Pages.

**Novembre 2017** : Forward Email a été officiellement lancé après une première version. La première version était entièrement basée sur DNS, sans création de compte ni inscription : un simple fichier README écrit en Markdown avec des instructions. Les utilisateurs pouvaient configurer le transfert d'e-mails en configurant les enregistrements MX pour qu'ils pointent vers `mx1.forwardemail.net` et `mx2.forwardemail.net`, et en ajoutant un enregistrement TXT avec `forward-email=user@gmail.com`.

La simplicité et l'efficacité de cette solution ont attiré l'attention de développeurs de premier plan, notamment [David Heinemeier Hansson](https://dhh.dk) (créateur de Ruby on Rails), qui continue à utiliser Forward Email sur son domaine `dhh.dk` à ce jour.

### 2018 - Infrastructure et intégration {#2018---infrastructure-and-integration}

**Avril 2018** : Lorsque [Cloudflare](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") a lancé son [service DNS grand public axé sur la confidentialité](https://blog.cloudflare.com/announcing-1111/), Forward Email est passé de l'utilisation de [OpenDNS](https://en.wikipedia.org/wiki/OpenDNS "OpenDNS") à [Cloudflare](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") pour gérer les recherches [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System"), démontrant ainsi l'engagement de l'entreprise en matière de choix d'infrastructure axés sur la confidentialité.

**Octobre 2018** : Le transfert d'e-mails permettait aux utilisateurs d'« envoyer des e-mails en tant que » avec [Gmail](https://en.wikipedia.org/wiki/Gmail "Gmail") et [Perspectives](https://en.wikipedia.org/wiki/Outlook "Outlook"), élargissant ainsi les capacités d'intégration avec les fournisseurs de messagerie populaires.

### 2019 - Révolution des performances {#2019---performance-revolution}

**Mai 2019** : Forward Email a publié la version 2, qui a représenté une réécriture majeure par rapport aux versions initiales. Cette mise à jour s'est concentrée sur les améliorations apportées à [performance](https://en.wikipedia.org/wiki/Software_performance_testing "Software performance testing") grâce à l'utilisation de [flux](https://en.wikipedia.org/wiki/Streams "Streams") de [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js"), établissant ainsi les bases de l'évolutivité de la plateforme.

### 2020 - Focus sur la confidentialité et la sécurité {#2020---privacy-and-security-focus}

**Février 2020** : Forward Email a lancé le plan de protection renforcée de la confidentialité, permettant aux utilisateurs de désactiver la définition d'entrées DNS publiques avec leurs alias de configuration de transfert d'e-mails. Grâce à ce plan, les informations d'alias d'un utilisateur sont masquées et ne peuvent plus être consultées publiquement sur Internet. L'entreprise a également lancé une fonctionnalité permettant d'activer ou de désactiver des alias spécifiques tout en les autorisant à apparaître comme des adresses e-mail valides et à renvoyer une valeur [Codes d'état SMTP](https://en.wikipedia.org/wiki/List_of_SMTP_server_return_codes "List of SMTP server return codes") valide, les e-mails étant immédiatement supprimés (de manière similaire à la redirection vers [/dev/null](https://en.wikipedia.org/wiki/Null_device "Null device")).

**Avril 2020** : Après avoir rencontré de nombreux obstacles avec les solutions de détection de spam existantes, qui ne respectaient pas la politique de confidentialité de Forward Email, l'entreprise a lancé sa première version alpha de Spam Scanner. Cette solution [filtrage anti-spam](https://en.wikipedia.org/wiki/Anti-spam_techniques "Anti-spam techniques"), entièrement gratuite et open source, utilise une approche [Filtre anti-spam Naive Bayes](https://en.wikipedia.org/wiki/Naive_Bayes_spam_filtering "Naive Bayes spam filtering") combinée aux protections [anti-hameçonnage](https://en.wikipedia.org/wiki/Phishing "Phishing") et [Attaque d'homographe IDN](https://en.wikipedia.org/wiki/IDN_homograph_attack "IDN homograph attack"). Forward Email a également lancé [authentification à deux facteurs](https://en.wikipedia.org/wiki/Multi-factor_authentication "Multi-factor authentication") (2FA) utilisant [mots de passe à usage unique](https://en.wikipedia.org/wiki/One-time_password "One-time password") (OTP) pour une sécurité renforcée des comptes.

**Mai 2020** : Forward Email a autorisé la personnalisation de [redirection de port](https://en.wikipedia.org/wiki/Port_forwarding "Port forwarding") pour contourner le blocage de port par [ISP](https://en.wikipedia.org/wiki/Internet_service_provider "Internet service provider"). L'entreprise a également publié [API RESTful de transfert d'e-mails gratuite](email-api) avec une documentation complète et des exemples de requêtes et de réponses en temps réel, ainsi que la prise en charge des webhooks.

**Août 2020** : Forward Email a ajouté la prise en charge du système d'authentification de messagerie [Chaîne reçue authentifiée](arc) (« ARC »), renforçant ainsi davantage la sécurité et la délivrabilité des e-mails.

**23 novembre 2020** : Forward Email a été lancé publiquement à partir de son programme bêta, marquant une étape importante dans le développement de la plateforme.

### 2021 - Modernisation de la plateforme {#2021---platform-modernization}

**Février 2021** : Forward Email a refactorisé sa base de code pour supprimer toutes les dépendances [Python](https://en.wikipedia.org/wiki/Python_\(programming_language\) (Python (langage de programmation)), permettant ainsi à sa pile de devenir 100 % [JavaScript](https://en.wikipedia.org/wiki/JavaScript "JavaScript") et [Node.js](https://en.wikipedia.org/wiki/Node.js). Cette décision architecturale s'inscrit dans l'engagement de l'entreprise à maintenir une pile technologique open source cohérente.

**27 septembre 2021** : Transférer l'e-mail [support ajouté](email-forwarding-regex-pattern-filter) pour que les alias de transfert d'e-mails correspondent à [expressions régulières](https://en.wikipedia.org/wiki/Regular_expression "Regular expression"), offrant ainsi aux utilisateurs des capacités de routage d'e-mails plus sophistiquées.

### 2023 - Extension de l'infrastructure et des fonctionnalités {#2023---infrastructure-and-feature-expansion}

**Janvier 2023** : Forward Email a lancé un site Web repensé et optimisé en termes de vitesse de page, améliorant ainsi l'expérience utilisateur et les performances.

**Février 2023** : La société a ajouté la prise en charge de [journaux d'erreurs](/faq#do-you-store-error-logs) et a implémenté un schéma de couleurs de site Web [mode sombre](https://en.wikipedia.org/wiki/Light-on-dark_color_scheme), répondant aux préférences des utilisateurs et aux besoins d'accessibilité.

**Mars 2023** : Forward Email a publié [Tangerine](https://github.com/forwardemail/tangerine#readme) et l'a intégré à l'ensemble de son infrastructure, permettant ainsi l'utilisation de [DNS sur HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) (« DoH ») au niveau applicatif. L'entreprise a également pris en charge [MTA-STS](/faq#do-you-support-mta-sts) et est passée de [hCaptcha](/) à [Tourniquet Cloudflare](https://developers.cloudflare.com/turnstile).

**Avril 2023** : Forward Email a implémenté et automatisé une infrastructure entièrement nouvelle. L'ensemble du service a commencé à fonctionner sur un DNS à charge équilibrée et de proximité à l'échelle mondiale, avec des contrôles d'intégrité et un basculement via [Cloudflare](https://cloudflare.com), remplaçant ainsi l'ancienne approche DNS à tour de rôle. L'entreprise a opté pour des serveurs bare metal de plusieurs fournisseurs, dont [Vultr](https://www.vultr.com/?ref=429848) et [Océan numérique](https://m.do.co/c/a7cecd27e071), tous deux conformes à la norme SOC 2 Type 1. Les bases de données MongoDB et Redis ont été déplacées vers des configurations en cluster avec des nœuds principaux et de secours pour une haute disponibilité, un chiffrement SSL de bout en bout, un chiffrement au repos et une récupération instantanée (PITR).

**Mai 2023** : Forward Email a lancé sa fonctionnalité SMTP sortante** pour les requêtes [envoi d'e-mails avec SMTP](/faq#do-you-support-sending-email-with-smtp) et [envoi d'e-mails avec API](/faq#do-you-support-sending-email-with-api). Cette fonctionnalité inclut des protections intégrées pour garantir une délivrabilité élevée, un système de file d'attente et de relance moderne et robuste, ainsi que [prend en charge les journaux d'erreurs en temps réel](/faq#do-you-store-error-logs).

**Novembre 2023** : Forward Email a lancé sa fonctionnalité [**stockage de boîte aux lettres crypté**](/blog/docs/best-quantum-safe-encrypted-email-service) pour [Prise en charge IMAP](/faq#do-you-support-receiving-email-with-imap), ce qui représente une avancée significative en matière de confidentialité et de sécurité des e-mails.

**Décembre 2023** : La société [support ajouté](/faq#do-you-support-pop3) pour la surveillance [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol), [clés d'accès et WebAuthn](/faq#do-you-support-passkeys-and-webauthn), [il est temps d'envoyer un message à la boîte de réception](/faq#i) et [OpenPGP pour le stockage IMAP](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd).

### 2024 - Optimisation du service et fonctionnalités avancées {#2024---service-optimization-and-advanced-features}

**Février 2024** : Transférer l'e-mail [ajout de la prise en charge du calendrier (CalDAV)](/faq#do-you-support-calendars-caldav), étendant les capacités de la plateforme au-delà de l'e-mail pour inclure la synchronisation du calendrier.

**Mars à juillet 2024** : Forward Email a publié des optimisations et des améliorations majeures de ses services IMAP, POP3 et CalDAV, dans le but de rendre son service aussi rapide, voire plus rapide que ses alternatives.

**Juillet 2024** : La société [ajout du support iOS Push](https://github.com/nodemailer/wildduck/issues/711#issuecomment-2254114016) a corrigé l'absence de prise en charge de la commande IMAP `IDLE` par Apple Mail sur iOS, permettant ainsi des notifications en temps réel pour les appareils Apple iOS. Forward Email a également ajouté une surveillance du délai de réception (« TTI ») pour son propre service et Yahoo/AOL, et a commencé à permettre aux utilisateurs de chiffrer l'intégralité de leur enregistrement DNS TXT, même avec l'offre gratuite. Comme demandé dans [Discussions sur les guides de confidentialité](https://discuss.privacyguides.net/t/forward-email-email-provider/13370) et [Problèmes GitHub](https://github.com/forwardemail/forwardemail.net/issues/254), la société a ajouté la possibilité pour les alias de rejeter discrètement `250`, de rejeter de manière souple `421` ou de rejeter de manière ferme `550` lorsqu'il est désactivé.

**Août 2024** : Forward Email a ajouté la prise en charge de l'exportation des boîtes aux lettres aux formats [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions) et [Mbox](https://en.wikipedia.org/wiki/Mbox) (en plus du format d'exportation [SQLite](https://en.wikipedia.org/wiki/SQLite) existant). [La prise en charge des signatures Webhook a été ajoutée](https://forwardemail.net/faq#do-you-support-bounce-webhooks), et l'entreprise a commencé à permettre aux utilisateurs d'envoyer des newsletters, des annonces et des e-mails marketing via son service SMTP sortant. Des quotas de stockage pour IMAP/POP3/CalDAV, à l'échelle du domaine et par alias, ont également été mis en œuvre.

### 2025 - Innovation continue {#2025---continued-innovation}

**De septembre 2024 à janvier 2025** : Transférer l'e-mail [ajout d'une fonctionnalité de réponse aux vacances très demandée et d'un cryptage OpenPGP/WKD pour le transfert des e-mails](https://discuss.privacyguides.net/t/forward-email-email-provider/13370/254), en s'appuyant sur leurs capacités de stockage de boîte aux lettres chiffrée déjà implémentées.

**21 janvier 2025** : « Jack », le meilleur ami du fondateur et son fidèle compagnon canin, s'est éteint paisiblement à l'âge de près de 11 ans. Nous remercions Jack [restera toujours dans les mémoires](https://github.com/forwardemail/forwardemail.net/commit/994ce771f0338cbe77f10bd613989e0924883f9b) pour son soutien indéfectible qui a soutenu la création de Forward Email. Le [Livre blanc technique sur le transfert d'e-mails](https://forwardemail.net/technical-whitepaper.pdf) lui est dédié, en reconnaissance de son rôle dans le développement du service.

**Février 2025** : Forward Email est passé à [Paquet de données](https://www.datapacket.com) comme nouveau fournisseur principal de centre de données, mettant en œuvre du matériel bare-metal personnalisé et axé sur les performances pour améliorer encore la fiabilité et la vitesse du service.

**Juin 2025** : Forward Email a lancé la prise en charge de [Protocole CardDAV](/faq#do-you-support-contacts-carddav), étendant les capacités de la plateforme pour inclure la synchronisation des contacts aux côtés des services de messagerie et de calendrier existants.

## Principes fondamentaux {#core-principles}

Depuis sa création, Forward Email a maintenu un engagement indéfectible envers les principes de confidentialité et de sécurité :

**Philosophie 100 % Open Source** : Contrairement à ses concurrents qui n'ouvrent le code source que de leurs frontends tout en gardant les backends fermés, Forward Email a rendu l'intégralité de sa base de code (frontend et backend) disponible pour examen public sur [GitHub](https://github.com/forwardemail).

**Conception axée sur la confidentialité** : Dès le premier jour, Forward Email a mis en œuvre une approche de traitement en mémoire unique qui évite d'écrire les e-mails sur le disque, ce qui le distingue des services de messagerie conventionnels qui stockent les messages dans des bases de données ou des systèmes de fichiers.

**Innovation continue** : Le service est passé d'une simple solution de transfert d'e-mails à une plate-forme de messagerie complète avec des fonctionnalités telles que des boîtes aux lettres cryptées, un cryptage résistant aux quanta et la prise en charge des protocoles standard, notamment SMTP, IMAP, POP3 et CalDAV.

**Transparence** : Rendre tout le code open source et disponible pour inspection, garantissant que les utilisateurs peuvent vérifier les déclarations de confidentialité plutôt que de simplement se fier aux déclarations marketing.

**Contrôle utilisateur** : Offrir aux utilisateurs des options, notamment la possibilité d'héberger eux-mêmes l'intégralité de la plateforme s'ils le souhaitent.

## Statut actuel {#current-status}

En 2025, Forward Email dessert plus de 500 000 domaines dans le monde, y compris des organisations notables et des leaders du secteur tels que :

* **Entreprises technologiques** : Canonical (Ubuntu), Netflix Games, The Linux Foundation, The PHP Foundation, jQuery, LineageOS
* **Médias** : Fox News Radio, Disney Ad Sales
* **Établissements d'enseignement** : Université de Cambridge, Université du Maryland, Université de Washington, Université Tufts, Swarthmore College
* **Entités gouvernementales** : Gouvernement d'Australie-Méridionale, Gouvernement de la République dominicaine
* **Autres organisations** : RCD Hotels, Fly<span>.</span>io
* **Développeurs notables** : Isaac Z. Schlueter (créateur de npm), David Heinemeier Hansson (créateur de Ruby on Rails)

La plateforme continue d'évoluer avec des versions régulières de fonctionnalités et des améliorations d'infrastructure, maintenant sa position de seul service de messagerie électronique 100 % open source, crypté, axé sur la confidentialité, transparent et résistant aux attaques quantiques disponible aujourd'hui.

<img loading="lazy" src="/img/articles/about-footer.webp" alt="Forward Email privacy-focused email service" class="rounded-lg" />