# E-mail résistant aux quanta : comment nous utilisons des boîtes aux lettres SQLite chiffrées pour protéger votre e-mail {#quantum-resistant-email-how-we-use-encrypted-sqlite-mailboxes-to-keep-your-email-safe}

<img loading="lazy" src="/img/articles/quantum.webp" alt="Quantum-safe encrypted email service illustration" class="rounded-lg" />

## Table des matières {#table-of-contents}

* [Avant-propos](#foreword)
* [Comparaison des fournisseurs de services de messagerie](#email-service-provider-comparison)
* [Comment ça marche](#how-does-it-work)
* [Technologies](#technologies)
  * [bases de données](#databases)
  * [Sécurité](#security)
  * [boîtes aux lettres](#mailboxes)
  * [Concurrence](#concurrency)
  * [Sauvegardes](#backups)
  * [Recherche](#search)
  * [Projets](#projects)
  * [Fournisseurs](#providers)
* [Pensées](#thoughts)
  * [Principes](#principles)
  * [Expériences](#experiments)
  * [Manque d'alternatives](#lack-of-alternatives)
  * [Essayez le transfert d'e-mails](#try-out-forward-email)

## Avant-propos {#foreword}

> \[!IMPORTANT]
> Notre service de messagerie est [100% open source](https://github.com/forwardemail) et axé sur la confidentialité grâce à des boîtes aux lettres SQLite sécurisées et chiffrées.

Jusqu’à ce que nous lancions [Prise en charge IMAP](/faq#do-you-support-receiving-email-with-imap), nous utilisions MongoDB pour nos besoins de stockage de données persistantes.

Cette technologie est incroyable et nous l’utilisons encore aujourd’hui – mais pour avoir un cryptage au repos avec MongoDB, vous devez utiliser un fournisseur qui propose MongoDB Enterprise, comme Digital Ocean ou Mongo Atlas – ou payer pour une licence d’entreprise (et ensuite devoir travailler avec la latence de l’équipe de vente).

Notre équipe [Transférer un e-mail](https://forwardemail.net) recherchait une solution de stockage chiffrée, évolutive, fiable et conviviale pour les développeurs, destinée aux boîtes aux lettres IMAP. En tant que développeurs open source, l'utilisation d'une technologie nécessitant le paiement d'une licence pour bénéficier de la fonctionnalité de chiffrement au repos était incompatible avec [nos principes](#principles). Nous avons donc expérimenté, recherché et développé une nouvelle solution de A à Z pour répondre à ces besoins.

Au lieu d'utiliser une base de données partagée pour stocker vos boîtes mail, nous les stockons et les chiffrons individuellement avec votre mot de passe (que vous seul possédez). **Notre service de messagerie est tellement sécurisé que si vous oubliez votre mot de passe, vous perdez votre boîte mail** (et devez alors la récupérer avec des sauvegardes hors ligne ou recommencer).

Continuez à lire pendant que nous plongeons en profondeur ci-dessous avec un [comparaison des fournisseurs de services de messagerie](#email-service-provider-comparison), [comment fonctionne notre service](#how-does-it-work), [notre pile technologique](#technologies) et plus encore.

## Comparaison des fournisseurs de services de messagerie {#email-service-provider-comparison}

Nous sommes le seul fournisseur de services de messagerie 100 % open source et axé sur la confidentialité qui stocke des boîtes aux lettres SQLite cryptées individuellement, offre un nombre illimité de domaines, d'alias et d'utilisateurs, et prend en charge les messages sortants SMTP, IMAP et POP3 :

**Contrairement à d'autres fournisseurs de messagerie, avec Forward Email, vous n'avez pas besoin de payer pour l'espace de stockage par domaine ou par alias.** L'espace de stockage est partagé sur l'ensemble de votre compte. Si vous possédez plusieurs noms de domaine personnalisés et plusieurs alias pour chacun d'eux, nous sommes la solution idéale. Notez que vous pouvez toujours appliquer des limites de stockage par domaine ou par alias si vous le souhaitez.

<a href="/blog/best-email-service" target="_blank" class="btn btn-lg bg-success text-white btn-block btn-success">Lire la comparaison des services de messagerie <i class="fa fa-search-plus"></i></a>

## Comment ça marche ? {#how-does-it-work}

1. À l'aide de votre client de messagerie tel qu'Apple Mail, Thunderbird, Gmail ou Outlook, vous vous connectez à nos serveurs sécurisés [IMAP](/faq#do-you-support-receiving-email-with-imap) en utilisant votre nom d'utilisateur et votre mot de passe :

* Votre nom d'utilisateur est votre alias complet avec votre domaine, par exemple `hello@example.com`.
* Votre mot de passe est généré aléatoirement et ne s'affiche que pendant 30 secondes lorsque vous cliquez sur <strong class="text-success"><i class="fa fa-key"></i> Générer un mot de passe</strong> depuis <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mon compte <i class="fa fa-angle-right"></i> Domaines</a> <i class="fa fa-angle-right"></i> Alias.

2. Une fois connecté, votre client de messagerie enverra [Commandes du protocole IMAP](https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol) à notre serveur IMAP pour synchroniser votre boîte mail. Cela inclut la rédaction et le stockage de brouillons d'e-mails, ainsi que d'autres actions que vous pourriez effectuer (par exemple, marquer un e-mail comme important ou comme spam).

3. Les serveurs d'échange de courrier (communément appelés serveurs « MX ») reçoivent les nouveaux e-mails entrants et les stockent dans votre boîte mail. Votre client de messagerie est alors averti et synchronise votre boîte mail. Nos serveurs d'échange de courrier peuvent transférer vos e-mails à un ou plusieurs destinataires (y compris [webhooks](/faq#do-you-support-webhooks)), les stocker pour vous dans votre espace de stockage IMAP chiffré, **ou les deux** !

> \[!TIP]
> Vous souhaitez en savoir plus ? Consultez [comment configurer la redirection des e-mails](/faq#how-do-i-get-started-and-set-up-email-forwarding), [comment fonctionne notre service d'échange de courrier](/faq#how-does-your-email-forwarding-system-work) ou consultez [nos guides](/guides).

4. En coulisses, notre conception de stockage de courrier électronique sécurisé fonctionne de deux manières pour garder vos boîtes aux lettres cryptées et accessibles uniquement par vous :

* Lorsque vous recevez un nouveau courrier de la part d'un expéditeur, nos serveurs d'échange de courrier écrivent dans une boîte aux lettres individuelle, temporaire et cryptée pour vous.

     ```mermaid
     sequenceDiagram
         autonumber
         actor Sender
         Sender->>MX: Inbound message received for your alias (e.g. you@yourdomain.com).
         MX->>SQLite: Message is stored in a temporary mailbox.
         Note over MX,SQLite: Forwards to other recipients and webhooks configured.
         MX->>Sender: Success!
     ```

* Lorsque vous vous connectez à notre serveur IMAP avec votre client de messagerie, votre mot de passe est chiffré en mémoire et utilisé pour lire et écrire dans votre boîte aux lettres. Ce mot de passe est indispensable pour la lecture et l'écriture dans votre boîte aux lettres. N'oubliez pas que, puisque vous êtes le seul à disposer de ce mot de passe, vous seul pouvez y accéder en lecture et en écriture. Lors de votre prochaine tentative de consultation ou de synchronisation, vos nouveaux messages seront transférés depuis cette boîte aux lettres temporaire et stockés dans votre fichier de boîte aux lettres actuel avec le mot de passe que vous avez fourni. Notez que cette boîte aux lettres temporaire est purgée et supprimée par la suite, de sorte que seule votre boîte aux lettres protégée par mot de passe conserve les messages.

* **Si vous êtes connecté en IMAP (par exemple, via un client de messagerie comme Apple Mail ou Thunderbird), nous n'avons pas besoin d'écrire sur le disque dur temporaire. Votre mot de passe IMAP chiffré en mémoire est récupéré et utilisé. En temps réel, lorsqu'un message tente de vous parvenir, nous envoyons une requête WebSocket à tous les serveurs IMAP pour leur demander s'ils ont une session active pour vous (c'est la phase de récupération), puis nous transmettons ensuite ce mot de passe chiffré en mémoire. Nous n'avons donc pas besoin d'écrire dans une boîte aux lettres temporaire ; nous pouvons écrire dans votre boîte aux lettres chiffrée actuelle avec votre mot de passe chiffré.**

     ```mermaid
     sequenceDiagram
         autonumber
         actor You
         You->>IMAP: You connect to IMAP server using an email client.
         IMAP->>SQLite: Transfer message from temporary mailbox to your alias' mailbox.
         Note over IMAP,SQLite: Your alias' mailbox is only available in-memory using IMAP password.
         SQLite->>IMAP: Retrieves messages as requested by email client.
         IMAP->>You: Success!
     ```

5. Les [Sauvegardes de vos boîtes mail cryptées](#backups) sont créés quotidiennement. Vous pouvez également demander une nouvelle sauvegarde à tout moment ou télécharger la dernière sauvegarde depuis <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mon Compte <i class="fa fa-angle-right"></i> Domaines</a> <i class="fa fa-angle-right"></i> Alias. Si vous décidez de changer de service de messagerie, vous pouvez facilement migrer, télécharger, exporter et purger vos boîtes aux lettres et vos sauvegardes à tout moment.

## Technologies {#technologies}

### Bases de données {#databases}

Nous avons exploré d’autres couches de stockage de base de données possibles, mais aucune n’a satisfait nos exigences autant que SQLite :

| Base de données | Chiffrement au repos | [Sandboxed](https://en.wikipedia.org/wiki/Sandbox_\(computer_security\)) Boîtes aux lettres | Licence | [Used Everywhere](https://www.sqlite.org/mostdeployed.html) |
| ------------------------------------------------------ | :-----------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------: | :---------------------------------------------------------: | :---------------------------------------------------------: |
| **[SQLite](https://www.sqlite.org/index.html)** :star: | :white_check_mark: Oui avec [SQLite3MultipleCiphers](https://github.com/utelle/SQLite3MultipleCiphers) | :white_check_mark: | :white_check_mark: Domaine public | :white_check_mark: |
| [MongoDB](https://www.mongodb.com/) | :x: ["Available in MongoDB Enterprise only"](https://www.mongodb.com/docs/manual/core/security-encryption-at-rest/) | :x: Base de données relationnelle | :x: AGPL et `SSPL-1.0` | :x: |
| [rqlite](https://github.com/rqlite/rqlite) | :x: [Network only](https://github.com/rqlite/rqlite/issues/1406) | :x: Base de données relationnelle | :white_check_mark: `MIT` | :x: |
| [dqlite](https://dqlite.io/) | :x: [Untested and not yet supported?](https://github.com/canonical/dqlite/issues/32) | :x: [Untested and not yet supported?](https://github.com/canonical/dqlite/issues/32) | :white_check_mark: `LGPL-3.0-only` | :x: |
| [PostgreSQL](https://www.postgresql.org/) | :white_check_mark: [Yes](https://www.postgresql.org/docs/current/encryption-options.html) | :x: Base de données relationnelle | :white_check_mark: `PostgreSQL` (similaire à `BSD` ou `MIT`) | :x: |
| [MariaDB](https://mariadb.com/) | :white_check_mark: [For InnoDB only](https://mariadb.com/kb/en/data-at-rest-encryption-overview/#which-storage-engines-does-mariadb-encryption-support) | :x: Base de données relationnelle | :white_check_mark: `GPLv2` et `BUSL-1.1` | :x: |
| [CockroachDB](https://www.cockroachlabs.com/product/) | :x: [Enterprise-only feature](https://www.cockroachlabs.com/docs/v23.1/enterprise-licensing) | :x: Base de données relationnelle | :x: `BUSL-1.1` et autres | :x: |

> Voici un [article de blog comparant plusieurs options de stockage de bases de données SQLite](https://gcore.com/learning/comparing-litestream-rqlite-dqlite/) dans le tableau ci-dessus.

### Sécurité {#security}

Nous utilisons en permanence les chiffrements [chiffrement au repos](https://en.wikipedia.org/wiki/Data_at_rest) ([AES-256](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard)), [cryptage en transit](https://en.wikipedia.org/wiki/Data_in_transit) ([TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security)), [DNS sur HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) (« DoH ») avec [Tangerine](https://tangeri.ne) et [Squelet](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/) ([ChaCha20-Poly1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)) pour les boîtes aux lettres. Nous utilisons également l'authentification à deux facteurs par jeton (contrairement aux SMS, suspectés par [attaques de l'homme du milieu](https://en.wikipedia.org/wiki/Man-in-the-middle_attack)), la rotation des clés SSH avec accès root désactivé, l'accès exclusif aux serveurs via des adresses IP restreintes, et bien plus encore.

En cas de [attaque de la servante maléfique](https://en.wikipedia.org/wiki/Evil_maid_attack) ou d'employé malveillant d'un fournisseur tiers, **votre boîte aux lettres ne peut être ouverte qu'avec votre mot de passe généré**. Soyez rassuré, nous ne dépendons d'aucun fournisseur tiers autre que nos fournisseurs de serveurs certifiés SOC de type 2 : Cloudflare, DataPacket, Digital Ocean et Vultr.

Notre objectif est d'avoir le moins de [point de défaillance unique](https://en.wikipedia.org/wiki/Single_point_of_failure) possible.

### Boîtes aux lettres {#mailboxes}

> **tldr;** Nos serveurs IMAP utilisent des bases de données SQLite cryptées individuellement pour chacune de vos boîtes aux lettres.

Base de données intégrée [SQLite est un langage extrêmement populaire](https://www.sqlite.org/mostdeployed.html) – elle est actuellement en cours d'exécution sur votre téléphone et votre ordinateur – [et utilisé par presque toutes les principales technologies](https://www.sqlite.org/famous.html).

Par exemple, sur nos serveurs chiffrés, il existe une boîte aux lettres de base de données SQLite pour `linux@example.com`, `info@example.com`, `hello@example.com`, etc. – une pour chaque fichier de base de données `.sqlite`. Nous ne nommons pas les fichiers de base de données avec l'adresse e-mail ; nous utilisons plutôt l'ObjectID BSON et les UUID uniques générés, qui ne divulguent ni l'identité du destinataire ni l'adresse e-mail à laquelle la boîte aux lettres est associée (par exemple, `353a03f21e534321f5d6e267.sqlite`).

Chacune de ces bases de données est chiffrée à l'aide de votre mot de passe (que vous seul possédez) ([Squelet](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/) ([ChaCha20-Poly1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)). Vos boîtes aux lettres sont ainsi chiffrées individuellement, autonomes ([bac à sable](https://en.wikipedia.org/wiki/Sandbox_\(computer_security\)) et portables.

Nous avons peaufiné SQLite avec le [PRAGMA](https://www.sqlite.org/pragma.html) suivant :

| `PRAGMA` | But |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cipher=chacha20` | [ChaCha20-Poly1305 SQLite database encryption](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/). Référence `better-sqlite3-multiple-ciphers` sous [Projects](#projects) pour plus d'informations. |
| `key="****************"` | Il s'agit de votre mot de passe déchiffré, stocké en mémoire, transmis à notre serveur via la connexion IMAP de votre client de messagerie. De nouvelles instances de base de données sont créées et fermées à chaque session de lecture et d'écriture (afin de garantir le sandboxing et l'isolation). |
| `journal_model=WAL` | Journal d'écriture anticipée ("[WAL](https://www.sqlite.org/wal.html)") [which boosts performance and allows concurrent read access](https://litestream.io/tips/#wal-journal-mode). |
| `busy_timeout=5000` | Empêche les erreurs de verrouillage en écriture [while other writes are taking place](https://litestream.io/tips/#busy-timeout). |
| `synchronous=NORMAL` | Augmente la durabilité des transactions [without data corruption risk](https://litestream.io/tips/#synchronous-pragma). |
| `foreign_keys=ON` | Oblige à ce que les références de clés étrangères (par exemple, une relation d'une table à une autre) soient appliquées. [By default this is not turned on in SQLite](https://www.sqlite.org/foreignkeys.html), mais pour la validation et l'intégrité des données, il doit être activé. |
| `encoding='UTF-8'` | [Default encoding](https://www.sqlite.org/pragma.html#pragma_encoding) à utiliser pour garantir la santé mentale du développeur. |

> Toutes les autres valeurs par défaut proviennent de SQLite comme spécifié dans [documentation officielle de PRAGMA](https://www.sqlite.org/pragma.html#pragma_auto_vacuum).

### Concurrence {#concurrency}

> **tldr;** Nous utilisons `WebSocket` pour les lectures et écritures simultanées dans vos boîtes aux lettres SQLite chiffrées.

#### lit {#reads}

Votre client de messagerie sur votre téléphone peut résoudre `imap.forwardemail.net` en l'une de nos adresses IP Digital Ocean – et votre client de bureau peut résoudre une IP distincte à partir d'un [fournisseur](#providers) complètement différent.

Quel que soit le serveur IMAP auquel votre client de messagerie se connecte, nous souhaitons que la connexion lise votre base de données en temps réel avec une précision de 100 %. Cela se fait via WebSockets.

#### Écrit {#writes}

L'écriture dans votre base de données est un peu différente, car SQLite est une base de données intégrée et votre boîte aux lettres réside dans un seul fichier par défaut.

Nous avons exploré des options telles que `litestream`, `rqlite` et `dqlite` ci-dessous – mais aucune d’entre elles ne répondait à nos exigences.

Pour effectuer des écritures avec la journalisation anticipée (« [WAL](https://www.sqlite.org/wal.html) ») activée, nous devons nous assurer qu'un seul serveur (« principal ») est responsable de ces opérations. [WAL](https://www.sqlite.org/wal.html) accélère considérablement la concurrence et autorise un auteur et plusieurs lecteurs.

Le serveur principal s'exécute sur les serveurs de données avec les volumes montés contenant les boîtes aux lettres chiffrées. Du point de vue de la distribution, on peut considérer tous les serveurs IMAP individuels derrière `imap.forwardemail.net` comme des serveurs secondaires (« Secondaire »).

Nous réalisons une communication bidirectionnelle avec [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket) :

* Les serveurs principaux utilisent une instance du serveur `WebSocketServer` de [ws](https://github.com/websockets/ws).
* Les serveurs secondaires utilisent une instance du client `WebSocket` de [ws](https://github.com/websockets/ws), encapsulée avec [websocket-comme-promis](https://github.com/vitalets/websocket-as-promised) et [reconnexion-websocket](https://github.com/opensumi/reconnecting-websocket). Ces deux encapsuleurs garantissent que `WebSocket` se reconnecte et peut envoyer et recevoir des données pour des écritures de base de données spécifiques.

### Sauvegardes {#backups}

> **tldr;** Des sauvegardes de vos boîtes aux lettres chiffrées sont effectuées quotidiennement. Vous pouvez également demander instantanément une nouvelle sauvegarde ou télécharger la dernière sauvegarde à tout moment depuis <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mon compte <i class="fa fa-angle-right"></i> Domaines</a> <i class="fa fa-angle-right"></i> Alias.

Pour les sauvegardes, nous exécutons simplement la commande SQLite `VACUUM INTO` chaque jour lors du traitement des commandes IMAP, qui exploite votre mot de passe chiffré via une connexion IMAP en mémoire. Les sauvegardes sont conservées si aucune sauvegarde existante n'est détectée ou si le hachage [SHA-256](https://en.wikipedia.org/wiki/SHA-2) du fichier a changé par rapport à la sauvegarde la plus récente.

Notez que nous utilisons la commande `VACUUM INTO` plutôt que la commande intégrée `backup`, car si une page est modifiée pendant une opération `backup`, elle doit être relancée. La commande `VACUUM INTO` prend un instantané. Consultez les commentaires sur [GitHub](https://github.com/benbjohnson/litestream.io/issues/56) et [Hacker News](https://news.ycombinator.com/item?id=31387556) pour plus d'informations.

De plus, nous utilisons `VACUUM INTO` par opposition à `backup`, car la commande `backup` laisserait la base de données non chiffrée pendant une brève période jusqu'à ce que `rekey` soit invoqué (voir ce GitHub [commentaire](https://github.com/m4heshd/better-sqlite3-multiple-ciphers/issues/46#issuecomment-1468018927) pour plus d'informations).

Le secondaire demandera au primaire via la connexion `WebSocket` d'exécuter la sauvegarde – et le primaire recevra alors la commande pour le faire et ensuite :

1. Connectez-vous à votre boîte aux lettres chiffrée.
2. Obtenez un verrou en écriture.
3. Exécutez un point de contrôle WAL via `wal_checkpoint(PASSIVE)`.
4. Exécutez la commande SQLite `VACUUM INTO`.
5. Assurez-vous que le fichier copié peut être ouvert avec le mot de passe chiffré (protection/protection contre les erreurs).
6. Téléchargez-le sur Cloudflare R2 pour le stockage (ou chez votre fournisseur si spécifié).

<!--
7. Compressez le fichier de sauvegarde obtenu avec `gzip`.
8. Téléchargez-le sur Cloudflare R2 pour le stockage (ou chez votre fournisseur si spécifié).
-->

N'oubliez pas que vos boîtes aux lettres sont chiffrées - et bien que nous ayons mis en place des restrictions IP et d'autres mesures d'authentification pour la communication WebSocket - en cas d'acteur malveillant, vous pouvez être assuré qu'à moins que la charge utile WebSocket ne contienne votre mot de passe IMAP, elle ne peut pas ouvrir votre base de données.

Une seule sauvegarde est actuellement stockée par boîte aux lettres, mais à l'avenir, nous pourrions proposer une récupération à un moment donné (« [PITR](https://en.wikipedia.org/wiki/Point-in-time_recovery) »).

### Rechercher {#search}

Nos serveurs IMAP prennent en charge la commande `SEARCH` avec des requêtes complexes, des expressions régulières, etc.

Les performances de recherche rapides sont dues à [FTS5](https://www.sqlite.org/fts5.html) et [sqlite-regex](https://github.com/asg017/sqlite-regex#sqlite-regex).

Nous stockons les valeurs `Date` dans les boîtes aux lettres SQLite sous forme de chaînes [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601) via [Date.prototype.toISOString](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString) (avec le fuseau horaire UTC pour que les comparaisons d'égalité fonctionnent correctement).

Les index sont également stockés pour toutes les propriétés qui figurent dans les requêtes de recherche.

### Projets {#projects}

Voici un tableau décrivant les projets que nous utilisons dans notre code source et notre processus de développement (classés par ordre alphabétique) :

| Projet | But |
| --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Ansible](https://www.ansible.com/) | Plateforme d'automatisation DevOps pour la maintenance, la mise à l'échelle et la gestion de l'ensemble de notre flotte de serveurs en toute simplicité. |
| [Bree](https://github.com/breejs/bree) | Planificateur de tâches pour Node.js et JavaScript avec cron, dates, ms, later et support convivial. |
| [Cabin](https://github.com/cabinjs/cabin) | Bibliothèque de journalisation JavaScript et Node.js conviviale pour les développeurs, avec la sécurité et la confidentialité à l'esprit. |
| [Lad](https://github.com/ladjs/lad) | Framework Node.js qui alimente toute notre architecture et notre conception technique avec MVC et plus encore. |
| [MongoDB](https://www.mongodb.com/) | Solution de base de données NoSQL que nous utilisons pour stocker toutes les autres données en dehors des boîtes aux lettres (par exemple, votre compte, vos paramètres, vos domaines et vos configurations d'alias). |
| [Mongoose](https://github.com/Automattic/mongoose) | Modélisation de documents objets MongoDB (« ODM ») que nous utilisons sur l'ensemble de notre pile. Nous avons développé des outils d'aide spécifiques qui nous permettent de continuer à utiliser **Mongoose avec SQLite**. |
| [Node.js](https://nodejs.org/en) | Node.js est l'environnement d'exécution JavaScript open source et multiplateforme qui exécute tous nos processus serveur. |
| [Nodemailer](https://github.com/nodemailer/nodemailer) | Package Node.js pour l'envoi d'e-mails, la création de connexions et bien plus encore. Nous sommes sponsors officiels de ce projet. |
| [Redis](https://redis.io/) | Base de données en mémoire pour la mise en cache, les canaux de publication/abonnement et les requêtes DNS sur HTTPS. |
| [SQLite3MultipleCiphers](https://github.com/utelle/SQLite3MultipleCiphers) | Extension de chiffrement pour SQLite permettant de chiffrer des fichiers de base de données entiers (y compris le journal d'écriture anticipée ("[WAL](https://www.sqlite.org/wal.html)"), le journal, la restauration, …). |
| [SQLiteStudio](https://github.com/pawelsalawa/sqlitestudio) | Éditeur Visual SQLite (que vous pouvez également utiliser) pour tester, télécharger et afficher les boîtes aux lettres de développement. |
| [SQLite](https://www.sqlite.org/about.html) | Couche de base de données intégrée pour un stockage IMAP évolutif, autonome, rapide et résilient. |
| [Spam Scanner](https://github.com/spamscanner/spamscanner) | Outil anti-spam, de filtrage des e-mails et de prévention du phishing Node.js (notre alternative à [Spam Assassin](https://spamassassin.apache.org/) et [rspamd](https://github.com/rspamd/rspamd)). |
| [Tangerine](https://tangeri.ne) | Requêtes DNS sur HTTPS avec Node.js et mise en cache à l'aide de Redis – ce qui garantit la cohérence globale et bien plus encore. |
| [Thunderbird](https://www.thunderbird.net/) | Notre équipe de développement utilise ceci (et le recommande également) comme **client de messagerie préféré à utiliser avec Forward Email**. |
| [UTM](https://github.com/utmapp/UTM) | Notre équipe de développement utilise ces machines virtuelles créées pour iOS et macOS afin de tester différents clients de messagerie (en parallèle) avec nos serveurs IMAP et SMTP. |
| [Ubuntu](https://ubuntu.com/download/server) | Système d'exploitation serveur moderne et open source basé sur Linux qui alimente toute notre infrastructure. |
| [WildDuck](https://github.com/nodemailer/wildduck) | Bibliothèque de serveur IMAP – voir ses notes sur [attachment de-duplication](https://github.com/nodemailer/wildduck/blob/master/docs/in-depth/attachment-deduplication.md) et [IMAP protocol support](https://github.com/nodemailer/wildduck/blob/master/docs/in-depth/protocol-support.md). |
| [better-sqlite3-multiple-ciphers](https://github.com/m4heshd/better-sqlite3-multiple-ciphers) | Bibliothèque API rapide et simple pour Node.js pour interagir avec SQLite3 par programmation. |
| [email-templates](https://github.com/forwardemail/email-templates) | Cadre de messagerie convivial pour les développeurs pour créer, prévisualiser et envoyer des e-mails personnalisés (par exemple, des notifications de compte et plus encore). |
| [json-sql-enhanced](https://github.com/forwardemail/json-sql-enhanced) | Générateur de requêtes SQL utilisant une syntaxe de type Mongo. Cela permet à notre équipe de développement de gagner du temps, car nous pouvons continuer à écrire en style Mongo sur l'ensemble de la pile, avec une approche indépendante de la base de données. **Cela permet également d'éviter les attaques par injection SQL grâce à l'utilisation de paramètres de requête.** |
| [knex-schema-inspector](https://github.com/knex/knex-schema-inspector) | Utilitaire SQL permettant d'extraire des informations sur les schémas de bases de données existants. Cela nous permet de valider facilement la validité de tous les index, tables, colonnes, contraintes, etc., et de les comparer à `1:1`. Nous avons même développé des assistants automatisés pour ajouter de nouvelles colonnes et index en cas de modification des schémas de bases de données (avec des alertes d'erreur extrêmement détaillées). |
| [knex](https://github.com/knex/knex) | Générateur de requêtes SQL que nous utilisons uniquement pour les migrations de bases de données et la validation de schéma via `knex-schema-inspector`. |
| [mandarin](https://github.com/ladjs/mandarin) | Traduction automatique de phrases [i18n](https://en.wikipedia.org/wiki/Internationalization_and_localization) avec prise en charge de Markdown à l'aide de [Google Cloud Translation API](https://cloud.google.com/translate/docs/reference/rest). |
| [mx-connect](https://github.com/zone-eu/mx-connect) | Package Node.js pour résoudre et établir des connexions avec les serveurs MX et gérer les erreurs. |
| [pm2](https://github.com/Unitech/pm2) | Gestionnaire de processus de production Node.js avec équilibreur de charge intégré ([fine-tuned](https://github.com/Unitech/pm2/issues/5145#issuecomment-1737764214) pour les performances). |
| [smtp-server](https://github.com/nodemailer/smtp-server) | Bibliothèque de serveur SMTP – nous l'utilisons pour notre échange de courrier (« MX ») et nos serveurs SMTP sortants. |
| [ImapTest](https://www.imapwiki.org/ImapTest) | Outil utile pour tester les serveurs IMAP par rapport aux benchmarks et à la compatibilité du protocole IMAP avec les spécifications RFC. Ce projet a été créé par l'équipe [Dovecot](https://en.wikipedia.org/wiki/Dovecot_\(software\) (un serveur IMAP et POP3 open source actif depuis juillet 2002). Nous avons testé notre serveur IMAP de manière approfondie avec cet outil. |

> Vous pouvez trouver d'autres projets que nous utilisons dans [notre code source sur GitHub](https://github.com/forwardemail).

### Fournisseurs {#providers}

| Fournisseur | But |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| [Cloudflare](https://www.cloudflare.com/) | Fournisseur DNS, contrôles de santé, équilibreurs de charge et stockage de sauvegarde à l'aide de [Cloudflare R2](https://developers.cloudflare.com/r2). |
| [GitHub](https://github.com/) | Source code hosting, CI/CD, and project management. |
| [Digital Ocean](https://m.do.co/c/a7fe489d1b27) | Hébergement de serveurs dédiés et bases de données gérées. |
| [Vultr](https://www.vultr.com/?ref=7429848) | Hébergement de serveur dédié. |
| [DataPacket](https://www.datapacket.com) | Hébergement de serveur dédié. |

## Pensées {#thoughts}

### Principes {#principles}

Forward Email est conçu selon ces principes :

1. Soyez toujours à l'écoute des développeurs, axé sur la sécurité et la confidentialité, et transparent.
2. Adhérez aux valeurs [MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller), [Unix](https://en.wikipedia.org/wiki/Unix_philosophy), [KISS](https://en.wikipedia.org/wiki/KISS_principle), [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself), [YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it), [Facteur douze](https://12factor.net/), [Le rasoir d'Occam](https://en.wikipedia.org/wiki/Occam%27s_razor) et [alimentation pour chiens](https://en.wikipedia.org/wiki/Eating_your_own_dog_food).
3. Ciblez les développeurs à la recherche de solutions improvisées et de solutions [ramen-rentable](http://www.paulgraham.com/ramenprofitable.html).

### Expériences {#experiments}

> **tldr;** En fin de compte, l'utilisation d'un stockage d'objets compatible S3 et/ou de tables virtuelles n'est pas techniquement possible pour des raisons de performances et est sujette à des erreurs en raison de limitations de mémoire.

Nous avons réalisé quelques expériences menant à notre solution SQLite finale, comme indiqué ci-dessus.

L’une d’entre elles consistait à essayer d’utiliser [rclone]() et SQLite avec une couche de stockage compatible S3.

Cette expérience nous a permis de mieux comprendre et de découvrir des cas limites entourant l'utilisation de rclone, SQLite et [VFS](https://en.wikipedia.org/wiki/Virtual_file_system) :

* Si vous activez l'indicateur `--vfs-cache-mode writes` avec rclone, les lectures seront autorisées, mais les écritures seront mises en cache.
* Si vous disposez de plusieurs serveurs IMAP répartis dans le monde entier, le cache sera désactivé sur chacun d'eux, sauf si vous disposez d'un seul enregistreur et de plusieurs écouteurs (par exemple, une approche pub/sub).
* C'est extrêmement complexe, et toute complexité supplémentaire entraînera davantage de points de défaillance uniques.
* Les fournisseurs de stockage compatibles S3 ne prennent pas en charge les modifications partielles de fichiers ; toute modification du fichier `.sqlite` entraînera donc une modification complète et un nouveau téléchargement de la base de données.
* D'autres solutions, comme `rsync`, existent, mais elles ne prennent pas en charge l'écriture anticipée (« [WAL](https://www.sqlite.org/wal.html) »). Nous avons donc finalement testé Litestream. Heureusement, notre système de chiffrement chiffre déjà les fichiers [WAL](https://www.sqlite.org/wal.html) ; nous n'avons donc pas besoin de compter sur Litestream pour cela. Cependant, nous n'étions pas encore sûrs de Litestream pour une utilisation en production et vous trouverez ci-dessous quelques remarques à ce sujet.
* L'utilisation de l'option `--vfs-cache-mode writes` (la *seule* façon d'utiliser SQLite par rapport à `rclone` pour les écritures) tentera de copier l'intégralité de la base de données en mémoire. La gestion d'une boîte aux lettres de 10 Go est acceptable. Cependant, la gestion de plusieurs boîtes aux lettres avec un espace de stockage extrêmement important entraînera des limitations de mémoire pour les serveurs IMAP, ainsi que des erreurs `ENOMEM`, des erreurs de segmentation et une corruption des données. * Si vous tentez d'utiliser SQLite [Tables virtuelles](https://www.sqlite.org/vtab.html) (par exemple, [s3db](https://github.com/jrhy/s3db)) pour que les données soient stockées sur une couche de stockage compatible S3, vous rencontrerez plusieurs problèmes supplémentaires :
* Les lectures et écritures seront extrêmement lentes, car les points de terminaison de l'API S3 devront être atteints avec les méthodes HTTP `.sqlite`0, `.sqlite`1, `.sqlite`2 et `.sqlite`3.
* Les tests de développement ont montré que dépasser 500 000 à plus d'un million d'enregistrements sur la fibre optique reste limité par le débit d'écriture et de lecture des fournisseurs compatibles S3. Par exemple, nos développeurs ont exécuté des boucles `.sqlite`4 pour exécuter à la fois des instructions SQL séquentielles `.sqlite`5 et des instructions d'écriture massive de grandes quantités de données. Dans les deux cas, les performances étaient extrêmement lentes. * Les tables virtuelles **ne peuvent pas contenir d'index**, d'instructions `.sqlite`6 et `.sqlite`7 `.sqlite`8, ce qui entraîne des retards de 1 à 2 minutes, voire plus, selon la quantité de données.
* Les objets étaient stockés non chiffrés et aucun chiffrement natif n'était disponible.
* Nous avons également envisagé d'utiliser `.sqlite`9, dont le concept et la technique sont similaires à ceux du point précédent (il présente donc les mêmes problèmes). Une possibilité serait d'utiliser une version personnalisée `rsync`0, encapsulée dans un chiffrement tel que `rsync`1 (que nous utilisons actuellement dans notre solution ci-dessus), via `rsync`2.
* Une autre approche possible serait d'utiliser `rsync`3, mais cette solution est limitée à 32 Go et nécessiterait des tâches complexes de construction et de développement.
* Les instructions `rsync`4 sont obligatoires (ce qui exclut totalement l'utilisation de tables virtuelles). Nous avons besoin des instructions `rsync`5 pour que notre hook avec `rsync`6 fonctionne correctement, ce qui garantit que les données ne sont pas corrompues et que les lignes récupérées peuvent être converties en documents valides conformément à nos définitions de schéma `rsync`7 (qui incluent les contraintes, le type de variable et la validation arbitraire des données).
* Presque tous les projets compatibles S3 liés à SQLite dans la communauté open source sont en Python (et non en JavaScript, que nous utilisons pour 100 % de notre pile).
* Les bibliothèques de compression telles que `rsync`8 (voir `rsync`9) semblent prometteuses, mais __PROTECTED_LINK_189__0. Au lieu de cela, la compression côté application sur des types de données tels que __PROTECTED_LINK_189__1, __PROTECTED_LINK_189__2, __PROTECTED_LINK_189__3, __PROTECTED_LINK_189__4, __PROTECTED_LINK_189__5 et __PROTECTED_LINK_189__6 sera une approche plus propre et plus simple (et plus facile à migrer, car nous pourrions stocker un indicateur ou une colonne __PROTECTED_LINK_189__7, voire utiliser __PROTECTED_LINK_189__8, __PROTECTED_LINK_189__9 pour la compression ou __PROTECTED_LINK_190__0 pour l'absence de compression comme métadonnées de base de données).
* Heureusement, la déduplication des pièces jointes est déjà implémentée sur notre serveur IMAP. Ainsi, chaque message contenant la même pièce jointe n'en conservera pas une copie ; une seule pièce jointe est stockée pour plusieurs messages et threads dans une boîte aux lettres (et une référence étrangère est ensuite utilisée).
* Le projet Litestream, une solution de réplication et de sauvegarde SQLite, est très prometteur et nous l'utiliserons probablement à l'avenir. * Sans vouloir discréditer les auteurs – car nous apprécions leur travail et leurs contributions à l'open source depuis plus de dix ans maintenant –, il ressort de l'utilisation réelle qu'il existe __PROTECTED_LINK_190__1 et __PROTECTED_LINK_190__2.
* La restauration des sauvegardes doit être simple et rapide. Utiliser une solution comme MongoDB avec __PROTECTED_LINK_190__3 et __PROTECTED_LINK_190__4 est non seulement fastidieux, mais aussi chronophage et complexe à configurer.
* Les bases de données SQLite simplifient les choses (il s'agit d'un fichier unique).
* Nous souhaitions concevoir une solution permettant aux utilisateurs de prendre leur boîte aux lettres et de la quitter à tout moment.
* De simples commandes Node.js pour __PROTECTED_LINK_190__5 effacent définitivement le contenu du disque dur.
* De même, nous pouvons utiliser une API compatible S3 avec HTTP __PROTECTED_LINK_190__6 pour supprimer facilement les snapshots et les sauvegardes pour les utilisateurs.
* SQLite était la solution la plus simple, la plus rapide et la plus économique.

### Manque d'alternatives {#lack-of-alternatives}

À notre connaissance, aucun autre service de messagerie n’est conçu de cette manière et n’est pas open source.

Nous *pensons que cela pourrait être dû* au fait que les services de messagerie existants disposent d'une technologie héritée en production avec [code spaghetti](https://en.wikipedia.org/wiki/Spaghetti_code) :spaghetti:.

La plupart, sinon la totalité, des fournisseurs de services de messagerie existants sont soit à code source fermé, soit annoncés comme étant à code source ouvert, **mais en réalité, seul leur interface est à code source ouvert**.

**La partie la plus sensible du courrier électronique** (l'interaction réelle entre le stockage/IMAP/SMTP) **se fait entièrement sur le back-end (serveur) et *pas* sur le front-end (client)**.

### Essayez le transfert d'e-mails {#try-out-forward-email}

Inscrivez-vous dès aujourd'hui sur <https://forwardemail.net>! :rocket: