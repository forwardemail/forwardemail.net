# Email Résistante au Quantique : Comment nous utilisons des boîtes aux lettres SQLite chiffrées pour sécuriser vos emails {#quantum-resistant-email-how-we-use-encrypted-sqlite-mailboxes-to-keep-your-email-safe}

<img loading="lazy" src="/img/articles/quantum.webp" alt="Illustration du service de messagerie chiffrée sécurisée quantique" class="rounded-lg" />


## Table des Matières {#table-of-contents}

* [Avant-propos](#foreword)
* [Comparaison des fournisseurs de services email](#email-service-provider-comparison)
* [Comment ça fonctionne](#how-does-it-work)
* [Technologies](#technologies)
  * [Bases de données](#databases)
  * [Sécurité](#security)
  * [Boîtes aux lettres](#mailboxes)
  * [Concurrence](#concurrency)
  * [Sauvegardes](#backups)
  * [Recherche](#search)
  * [Projets](#projects)
  * [Fournisseurs](#providers)
* [Réflexions](#thoughts)
  * [Principes](#principles)
  * [Expériences](#experiments)
  * [Manque d’alternatives](#lack-of-alternatives)
  * [Essayez Forward Email](#try-out-forward-email)


## Avant-propos {#foreword}

> \[!IMPORTANT]
> Notre service email est [100% open-source](https://github.com/forwardemail) et axé sur la confidentialité grâce à des boîtes aux lettres SQLite sécurisées et chiffrées.

Jusqu’à ce que nous lancions le [support IMAP](/faq#do-you-support-receiving-email-with-imap), nous utilisions MongoDB pour nos besoins de stockage de données persistantes.

Cette technologie est incroyable et nous l’utilisons encore aujourd’hui – mais pour avoir un chiffrement au repos avec MongoDB, vous devez utiliser un fournisseur qui propose MongoDB Enterprise, comme Digital Ocean ou Mongo Atlas – ou payer une licence entreprise (et devoir ensuite gérer la latence avec l’équipe commerciale).

Notre équipe chez [Forward Email](https://forwardemail.net) avait besoin d’une solution de stockage chiffrée, évolutive, fiable et conviviale pour les développeurs pour les boîtes aux lettres IMAP. En tant que développeurs open-source, utiliser une technologie nécessitant le paiement d’une licence pour obtenir la fonctionnalité de chiffrement au repos allait à l’encontre de [nos principes](#principles) – nous avons donc expérimenté, recherché et développé une nouvelle solution de zéro pour répondre à ces besoins.

Au lieu d’utiliser une base de données partagée pour stocker vos boîtes aux lettres, nous stockons et chiffrons individuellement vos boîtes aux lettres avec votre mot de passe (que vous seul possédez). **Notre service email est tellement sécurisé que si vous oubliez votre mot de passe, vous perdez votre boîte aux lettres** (et devez récupérer avec des sauvegardes hors ligne ou repartir de zéro).

Continuez votre lecture pour une plongée approfondie avec une [comparaison des fournisseurs de services email](#email-service-provider-comparison), [le fonctionnement de notre service](#how-does-it-work), [notre pile technologique](#technologies), et plus encore.


## Comparaison des fournisseurs de services email {#email-service-provider-comparison}

Nous sommes le seul fournisseur de service email 100% open-source et axé sur la confidentialité qui stocke des boîtes aux lettres SQLite chiffrées individuellement, offre des domaines, alias et utilisateurs illimités, et supporte SMTP sortant, IMAP et POP3 :

**Contrairement à d’autres fournisseurs email, vous n’avez pas besoin de payer pour le stockage par domaine ou alias avec Forward Email.** Le stockage est partagé sur l’ensemble de votre compte – donc si vous avez plusieurs noms de domaine personnalisés et plusieurs alias sur chacun, nous sommes la solution parfaite pour vous. Notez que vous pouvez toujours appliquer des limites de stockage si vous le souhaitez, par domaine ou alias.

<a href="/blog/best-email-service" target="_blank" class="btn btn-lg bg-success text-white btn-block btn-success">Lire la comparaison des services email <i class="fa fa-search-plus"></i></a>


## Comment ça fonctionne {#how-does-it-work}

1. En utilisant votre client email tel que Apple Mail, Thunderbird, Gmail ou Outlook – vous vous connectez à nos serveurs [IMAP](/faq#do-you-support-receiving-email-with-imap) sécurisés avec votre nom d’utilisateur et mot de passe :

   * Votre nom d’utilisateur est votre alias complet avec votre domaine, par exemple `hello@example.com`.
   * Votre mot de passe est généré aléatoirement et affiché uniquement pendant 30 secondes lorsque vous cliquez sur <strong class="text-success"><i class="fa fa-key"></i> Générer un mot de passe</strong> depuis <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mon Compte <i class="fa fa-angle-right"></i> Domaines</a> <i class="fa fa-angle-right"></i> Aliases.
2. Une fois connecté, votre client de messagerie enverra des [commandes du protocole IMAP](https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol) à notre serveur IMAP pour garder votre boîte aux lettres synchronisée. Cela inclut la rédaction et le stockage des brouillons d'emails ainsi que d'autres actions que vous pourriez effectuer (par exemple, étiqueter un email comme Important ou marquer un email comme Spam/Courrier indésirable).

3. Les serveurs d'échange de courrier (communément appelés serveurs "MX") reçoivent les nouveaux emails entrants et les stockent dans votre boîte aux lettres. Lorsque cela se produit, votre client de messagerie est notifié et synchronise votre boîte aux lettres. Nos serveurs d'échange de courrier peuvent transférer votre email à un ou plusieurs destinataires (y compris des [webhooks](/faq#do-you-support-webhooks)), stocker votre email pour vous dans votre stockage IMAP chiffré chez nous, **ou les deux** !

   > \[!TIP]
   > Vous souhaitez en savoir plus ? Lisez [comment configurer le transfert d'email](/faq#how-do-i-get-started-and-set-up-email-forwarding), [comment fonctionne notre service d'échange de courrier](/faq#how-does-your-email-forwarding-system-work), ou consultez [nos guides](/guides).

4. En coulisses, notre conception de stockage sécurisé des emails fonctionne de deux manières pour garder vos boîtes aux lettres chiffrées et accessibles uniquement par vous :

   * Lorsqu'un nouveau mail vous est envoyé par un expéditeur, nos serveurs d'échange de courrier écrivent dans une boîte aux lettres individuelle, temporaire et chiffrée pour vous.

     ```mermaid
     sequenceDiagram
         autonumber
         actor Sender
         Sender->>MX: Message entrant reçu pour votre alias (par exemple vous@votredomaine.com).
         MX->>SQLite: Le message est stocké dans une boîte aux lettres temporaire.
         Note over MX,SQLite: Transferts vers d'autres destinataires et webhooks configurés.
         MX->>Sender: Succès !
     ```

   * Lorsque vous vous connectez à notre serveur IMAP avec votre client de messagerie, votre mot de passe est alors chiffré en mémoire et utilisé pour lire et écrire dans votre boîte aux lettres. Votre boîte aux lettres ne peut être lue ni modifiée qu'avec ce mot de passe. Gardez à l'esprit que puisque vous êtes le seul à posséder ce mot de passe, **seul vous** pouvez lire et écrire dans votre boîte aux lettres lorsque vous y accédez. La prochaine fois que votre client de messagerie tentera de vérifier les mails ou de synchroniser, vos nouveaux messages seront transférés depuis cette boîte aux lettres temporaire et stockés dans votre fichier de boîte aux lettres réel en utilisant le mot de passe que vous avez fourni. Notez que cette boîte aux lettres temporaire est ensuite purgée et supprimée afin que seuls vos messages protégés par mot de passe restent dans votre boîte aux lettres.

   * **Si vous êtes connecté à IMAP (par exemple en utilisant un client de messagerie tel qu'Apple Mail ou Thunderbird), alors nous n'avons pas besoin d'écrire sur un stockage disque temporaire. Votre mot de passe IMAP chiffré en mémoire est récupéré et utilisé à la place. En temps réel, lorsqu'un message tente de vous être livré, nous envoyons une requête WebSocket à tous les serveurs IMAP leur demandant s'ils ont une session active pour vous (c'est la partie récupération), puis nous transmettons ensuite ce mot de passe chiffré en mémoire – ainsi nous n'avons pas besoin d'écrire dans une boîte aux lettres temporaire, nous pouvons écrire dans votre boîte aux lettres chiffrée réelle en utilisant votre mot de passe chiffré.**

     ```mermaid
     sequenceDiagram
         autonumber
         actor You
         You->>IMAP: Vous vous connectez au serveur IMAP avec un client de messagerie.
         IMAP->>SQLite: Transfert du message de la boîte aux lettres temporaire vers la boîte aux lettres de votre alias.
         Note over IMAP,SQLite: La boîte aux lettres de votre alias n'est disponible qu'en mémoire avec le mot de passe IMAP.
         SQLite->>IMAP: Récupère les messages selon la demande du client de messagerie.
         IMAP->>You: Succès !
     ```

5. [Les sauvegardes de vos boîtes aux lettres chiffrées](#backups) sont effectuées quotidiennement. Vous pouvez également demander une nouvelle sauvegarde à tout moment ou télécharger la dernière sauvegarde depuis <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mon Compte <i class="fa fa-angle-right"></i> Domaines</a> <i class="fa fa-angle-right"></i> Alias. Si vous décidez de passer à un autre service de messagerie, vous pouvez facilement migrer, télécharger, exporter et purger vos boîtes aux lettres et sauvegardes à tout moment.


## Technologies {#technologies}

### Bases de données {#databases}

Nous avons exploré d'autres couches possibles de stockage de bases de données, cependant aucune n'a satisfait nos exigences autant que SQLite :
| Base de données                                        |                                                                    Chiffrement au repos                                                                   |  [Boîtes aux lettres isolées](https://fr.wikipedia.org/wiki/Sandbox_\(computer_security\))  |                           Licence                           | [Utilisé Partout](https://www.sqlite.org/mostdeployed.html) |
| ------------------------------------------------------ | :-----------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------: | :---------------------------------------------------------: | :---------------------------------------------------------: |
| **[SQLite](https://www.sqlite.org/index.html)** :star: |                          :white_check_mark: Oui avec [SQLite3MultipleCiphers](https://github.com/utelle/SQLite3MultipleCiphers)                         |                                  :white_check_mark:                                  |               :white_check_mark: Domaine Public              |                      :white_check_mark:                     |
| [MongoDB](https://www.mongodb.com/)                    |                   :x: ["Disponible uniquement dans MongoDB Enterprise"](https://www.mongodb.com/docs/manual/core/security-encryption-at-rest/)                   |                                :x: Base de données relationnelle                               |                   :x: AGPL et `SSPL-1.0`                   |                             :x:                             |
| [rqlite](https://github.com/rqlite/rqlite)             |                                             :x: [Réseau uniquement](https://github.com/rqlite/rqlite/issues/1406)                                            |                                :x: Base de données relationnelle                               |                   :white_check_mark: `MIT`                  |                             :x:                             |
| [dqlite](https://dqlite.io/)                           |                                   :x: [Non testé et pas encore supporté ?](https://github.com/canonical/dqlite/issues/32)                                  | :x: [Non testé et pas encore supporté ?](https://github.com/canonical/dqlite/issues/32) |              :white_check_mark: `LGPL-3.0-only`             |                             :x:                             |
| [PostgreSQL](https://www.postgresql.org/)              |                                :white_check_mark: [Oui](https://www.postgresql.org/docs/current/encryption-options.html)                                |                                :x: Base de données relationnelle                               | :white_check_mark: `PostgreSQL` (similaire à `BSD` ou `MIT`) |                             :x:                             |
| [MariaDB](https://mariadb.com/)                        | :white_check_mark: [Pour InnoDB uniquement](https://mariadb.com/kb/en/data-at-rest-encryption-overview/#which-storage-engines-does-mariadb-encryption-support) |                                :x: Base de données relationnelle                               |          :white_check_mark: `GPLv2` et `BUSL-1.1`          |                             :x:                             |
| [CockroachDB](https://www.cockroachlabs.com/product/)  |                               :x: [Fonctionnalité uniquement Enterprise](https://www.cockroachlabs.com/docs/v23.1/enterprise-licensing)                              |                                :x: Base de données relationnelle                               |                  :x: `BUSL-1.1` et autres                  |                             :x:                             |

> Voici un [article de blog qui compare plusieurs options de stockage de base de données SQLite](https://gcore.com/learning/comparing-litestream-rqlite-dqlite/) dans le tableau ci-dessus.

### Sécurité {#security}

Nous utilisons en permanence le [chiffrement au repos](https://fr.wikipedia.org/wiki/Data_at_rest) ([AES-256](https://fr.wikipedia.org/wiki/Advanced_Encryption_Standard)), le [chiffrement en transit](https://fr.wikipedia.org/wiki/Data_in_transit) ([TLS](https://fr.wikipedia.org/wiki/Transport_Layer_Security)), le [DNS over HTTPS](https://fr.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") via :tangerine: [Tangerine](https://tangeri.ne), et le chiffrement [sqleet](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/) ([ChaCha20-Poly1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)) sur les boîtes aux lettres. De plus, nous utilisons une authentification à deux facteurs basée sur un jeton (contrairement au SMS qui est susceptible aux [attaques de l'homme du milieu](https://fr.wikipedia.org/wiki/Man-in-the-middle_attack)), des clés SSH tournantes avec accès root désactivé, un accès exclusif aux serveurs via des adresses IP restreintes, et plus encore.
En cas d'[attaque de la bonne malveillante](https://en.wikipedia.org/wiki/Evil_maid_attack) ou d'employé malveillant d'un fournisseur tiers, **votre boîte aux lettres ne peut toujours être ouverte qu'avec votre mot de passe généré**. Soyez assuré que nous ne dépendons d'aucun fournisseur tiers autre que nos fournisseurs de serveurs conformes SOC Type 2 : Cloudflare, DataPacket, Digital Ocean, GitHub et Vultr.

Notre objectif est d'avoir le moins de [points de défaillance uniques](https://en.wikipedia.org/wiki/Single_point_of_failure) possible.

### Boîtes aux lettres {#mailboxes}

> **en bref ;** Nos serveurs IMAP utilisent des bases de données SQLite chiffrées individuellement pour chacune de vos boîtes aux lettres.

[SQLite est une base de données embarquée extrêmement populaire](https://www.sqlite.org/mostdeployed.html) – elle fonctionne actuellement sur votre téléphone et votre ordinateur – [et est utilisée par presque toutes les grandes technologies](https://www.sqlite.org/famous.html).

Par exemple, sur nos serveurs chiffrés, il y a une base de données SQLite pour la boîte aux lettres `linux@example.com`, `info@example.com`, `hello@example.com` et ainsi de suite – une pour chacune sous forme de fichier de base de données `.sqlite`. Nous ne nommons pas non plus les fichiers de base de données avec l'adresse e-mail – à la place, nous utilisons des ObjectID BSON et des UUID uniques générés qui ne révèlent ni à qui appartient la boîte aux lettres ni quelle est l'adresse e-mail associée (par exemple `353a03f21e534321f5d6e267.sqlite`).

Chacune de ces bases de données est elle-même chiffrée avec votre mot de passe (que vous seul possédez) en utilisant [sqleet](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/) ([ChaCha20-Poly1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)). Cela signifie que vos boîtes aux lettres sont chiffrées individuellement, autonomes, [sandboxées](https://en.wikipedia.org/wiki/Sandbox_\(computer_security\)) et portables.

Nous avons affiné SQLite avec les [PRAGMA](https://www.sqlite.org/pragma.html) suivants :

| `PRAGMA`                 | But                                                                                                                                                                                                                                                     |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cipher=chacha20`        | [Chiffrement de base de données SQLite ChaCha20-Poly1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/). Consultez `better-sqlite3-multiple-ciphers` sous [Projects](#projects) pour plus d'informations.                 |
| `key="****************"` | C'est votre mot de passe déchiffré en mémoire uniquement qui est transmis via la connexion IMAP de votre client mail à notre serveur. De nouvelles instances de base de données sont créées et fermées pour chaque session de lecture et d'écriture (afin d'assurer sandboxing et isolation). |
| `journal_mode=WAL`       | Write-ahead-log ("[WAL](https://www.sqlite.org/wal.html)") [qui améliore les performances et permet un accès en lecture concurrent](https://litestream.io/tips/#wal-journal-mode).                                                                       |
| `busy_timeout=5000`      | Évite les erreurs de verrouillage en écriture [pendant que d'autres écritures ont lieu](https://litestream.io/tips/#busy-timeout).                                                                                                                     |
| `synchronous=NORMAL`     | Augmente la durabilité des transactions [sans risque de corruption des données](https://litestream.io/tips/#synchronous-pragma).                                                                                                                      |
| `foreign_keys=ON`        | Fait respecter les références de clés étrangères (par exemple une relation d'une table à une autre). [Par défaut, ce n'est pas activé dans SQLite](https://www.sqlite.org/foreignkeys.html), mais pour la validation et l'intégrité des données, il doit être activé. |
| `encoding='UTF-8'`       | [Encodage par défaut](https://www.sqlite.org/pragma.html#pragma_encoding) à utiliser pour assurer la cohérence des développeurs.                                                                                                                        |
> Tous les autres paramètres par défaut proviennent de SQLite comme spécifié dans la [documentation officielle PRAGMA](https://www.sqlite.org/pragma.html#pragma_auto_vacuum).

### Concurrence {#concurrency}

> **en bref ;** Nous utilisons `WebSocket` pour les lectures et écritures concurrentes sur vos boîtes aux lettres SQLite chiffrées.

#### Lectures {#reads}

Votre client mail sur votre téléphone peut résoudre `imap.forwardemail.net` vers l'une de nos adresses IP Digital Ocean – et votre client de bureau peut résoudre une adresse IP différente provenant d'un autre [fournisseur](#providers).

Peu importe le serveur IMAP auquel votre client mail se connecte, nous voulons que la connexion lise votre base de données en temps réel avec une précision de 100 %. Cela est réalisé via les WebSockets.

#### Écritures {#writes}

L'écriture dans votre base de données est un peu différente – puisque SQLite est une base de données embarquée et que votre boîte aux lettres vit dans un seul fichier par défaut.

Nous avons exploré des options telles que `litestream`, `rqlite` et `dqlite` ci-dessous – cependant aucune ne satisfaisait nos exigences.

Pour effectuer des écritures avec le journal d'écriture anticipée ("[WAL](https://www.sqlite.org/wal.html)") activé – nous devons nous assurer qu'un seul serveur ("Principal") en est responsable. Le [WAL](https://www.sqlite.org/wal.html) accélère considérablement la concurrence et permet un seul écrivain et plusieurs lecteurs.

Le Principal fonctionne sur les serveurs de données avec les volumes montés contenant les boîtes aux lettres chiffrées. D'un point de vue distribution, vous pouvez considérer tous les serveurs IMAP individuels derrière `imap.forwardemail.net` comme des serveurs secondaires ("Secondaire").

Nous réalisons une communication bidirectionnelle avec [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket) :

* Les serveurs Principaux utilisent une instance du serveur `WebSocketServer` de [ws](https://github.com/websockets/ws).
* Les serveurs Secondaires utilisent une instance du client `WebSocket` de [ws](https://github.com/websockets/ws) enveloppée avec [websocket-as-promised](https://github.com/vitalets/websocket-as-promised) et [reconnecting-websocket](https://github.com/opensumi/reconnecting-websocket). Ces deux wrappers garantissent que le `WebSocket` se reconnecte et peut envoyer et recevoir des données pour des écritures spécifiques dans la base de données.

### Sauvegardes {#backups}

> **en bref ;** Des sauvegardes de vos boîtes aux lettres chiffrées sont effectuées quotidiennement. Vous pouvez également demander instantanément une nouvelle sauvegarde ou télécharger la dernière sauvegarde à tout moment depuis <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mon Compte <i class="fa fa-angle-right"></i> Domaines</a> <i class="fa fa-angle-right"></i> Alias.

Pour les sauvegardes, nous exécutons simplement la commande SQLite `VACUUM INTO` chaque jour pendant le traitement des commandes IMAP, qui utilise votre mot de passe chiffré depuis une connexion IMAP en mémoire. Les sauvegardes sont stockées si aucune sauvegarde existante n'est détectée ou si le hachage [SHA-256](https://en.wikipedia.org/wiki/SHA-2) a changé sur le fichier par rapport à la sauvegarde la plus récente.

Notez que nous utilisons la commande `VACUUM INTO` plutôt que la commande intégrée `backup` car si une page est modifiée pendant une opération de commande `backup`, alors elle doit recommencer. La commande `VACUUM INTO` prendra un instantané. Voir ces commentaires sur [GitHub](https://github.com/benbjohnson/litestream.io/issues/56) et [Hacker News](https://news.ycombinator.com/item?id=31387556) pour plus d'informations.

De plus, nous utilisons `VACUUM INTO` plutôt que `backup`, car la commande `backup` laisserait la base de données non chiffrée pendant une courte période jusqu'à ce que `rekey` soit invoqué (voir ce [commentaire](https://github.com/m4heshd/better-sqlite3-multiple-ciphers/issues/46#issuecomment-1468018927) sur GitHub pour plus de détails).

Le Secondaire ordonnera au Principal via la connexion `WebSocket` d'exécuter la sauvegarde – et le Principal recevra alors la commande pour le faire et procédera ensuite à :

1. Se connecter à votre boîte aux lettres chiffrée.
2. Acquérir un verrou d'écriture.
3. Exécuter un point de contrôle WAL via `wal_checkpoint(PASSIVE)`.
4. Exécuter la commande SQLite `VACUUM INTO`.
5. S'assurer que le fichier copié peut être ouvert avec le mot de passe chiffré (sécurité/anti-erreur).
6. Le téléverser sur Cloudflare R2 pour stockage (ou votre propre fournisseur si spécifié).
<!--
7. Compressez le fichier de sauvegarde résultant avec `gzip`.
8. Téléversez-le sur Cloudflare R2 pour le stockage (ou votre propre fournisseur si spécifié).
-->

N'oubliez pas que vos boîtes aux lettres sont chiffrées – et bien que nous ayons des restrictions IP et d'autres mesures d'authentification en place pour la communication WebSocket – en cas de mauvaise intention, vous pouvez être assuré que sauf si la charge utile WebSocket contient votre mot de passe IMAP, elle ne peut pas ouvrir votre base de données.

Une seule sauvegarde est stockée par boîte aux lettres pour le moment, mais à l'avenir, nous pourrions offrir une récupération à un point dans le temps ("[PITR](https://en.wikipedia.org/wiki/Point-in-time_recovery)").

### Recherche {#search}

Nos serveurs IMAP prennent en charge la commande `SEARCH` avec des requêtes complexes, des expressions régulières, et plus encore.

La rapidité de la recherche est grâce à [FTS5](https://www.sqlite.org/fts5.html) et [sqlite-regex](https://github.com/asg017/sqlite-regex#sqlite-regex).

Nous stockons les valeurs `Date` dans les boîtes aux lettres SQLite sous forme de chaînes [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601) via [Date.prototype.toISOString](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString) (avec le fuseau horaire UTC pour que les comparaisons d'égalité fonctionnent correctement).

Des index sont également stockés pour toutes les propriétés présentes dans les requêtes de recherche.

### Projets {#projects}

Voici un tableau présentant les projets que nous utilisons dans notre code source et notre processus de développement (triés par ordre alphabétique) :

| Projet                                                                                       | Objectif                                                                                                                                                                                                                                                                                                                                                              |
| --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Ansible](https://www.ansible.com/)                                                           | Plateforme d'automatisation DevOps pour maintenir, faire évoluer et gérer facilement l'ensemble de notre flotte de serveurs.                                                                                                                                                                                                                                         |
| [Bree](https://github.com/breejs/bree)                                                        | Planificateur de tâches pour Node.js et JavaScript avec prise en charge de cron, dates, ms, later, et convivial pour les humains.                                                                                                                                                                                                                                    |
| [Cabin](https://github.com/cabinjs/cabin)                                                     | Bibliothèque de journalisation JavaScript et Node.js conviviale pour les développeurs, avec la sécurité et la confidentialité en tête.                                                                                                                                                                                                                               |
| [Lad](https://github.com/ladjs/lad)                                                           | Framework Node.js qui alimente toute notre architecture et conception d'ingénierie avec MVC et plus encore.                                                                                                                                                                                                                                                         |
| [MongoDB](https://www.mongodb.com/)                                                           | Solution de base de données NoSQL que nous utilisons pour stocker toutes les autres données en dehors des boîtes aux lettres (par exemple votre compte, paramètres, domaines et configurations d'alias).                                                                                                                                                              |
| [Mongoose](https://github.com/Automattic/mongoose)                                            | Modélisation d'objets documents MongoDB ("ODM") que nous utilisons dans toute notre pile. Nous avons écrit des helpers spéciaux qui nous permettent de continuer simplement à utiliser **Mongoose avec SQLite** :tada:                                                                                                                                               |
| [Node.js](https://nodejs.org/en)                                                              | Node.js est l'environnement d'exécution JavaScript open-source multiplateforme qui exécute tous nos processus serveur.                                                                                                                                                                                                                                              |
| [Nodemailer](https://github.com/nodemailer/nodemailer)                                        | Package Node.js pour envoyer des emails, créer des connexions, et plus encore. Nous sommes un sponsor officiel de ce projet.                                                                                                                                                                                                                                         |
| [Redis](https://redis.io/)                                                                    | Base de données en mémoire pour la mise en cache, les canaux publish/subscribe, et les requêtes DNS over HTTPS.                                                                                                                                                                                                                                                     |
| [SQLite3MultipleCiphers](https://github.com/utelle/SQLite3MultipleCiphers)                    | Extension de chiffrement pour SQLite permettant de chiffrer entièrement les fichiers de base de données (y compris le write-ahead-log ("[WAL](https://www.sqlite.org/wal.html)"), journal, rollback, …).                                                                                                                                                             |
| [SQLiteStudio](https://github.com/pawelsalawa/sqlitestudio)                                   | Éditeur visuel SQLite (que vous pouvez aussi utiliser) pour tester, télécharger et visualiser les boîtes aux lettres de développement.                                                                                                                                                                                                                             |
| [SQLite](https://www.sqlite.org/about.html)                                                   | Couche de base de données embarquée pour un stockage IMAP évolutif, autonome, rapide et résilient.                                                                                                                                                                                                                                                                  |
| [Spam Scanner](https://github.com/spamscanner/spamscanner)                                    | Outil anti-spam Node.js, filtrage d'emails et prévention du phishing (notre alternative à [Spam Assassin](https://spamassassin.apache.org/) et [rspamd](https://github.com/rspamd/rspamd)).                                                                                                                                                                          |
| [Tangerine](https://tangeri.ne)                                                               | Requêtes DNS over HTTPS avec Node.js et mise en cache utilisant Redis – ce qui assure la cohérence globale et bien plus.                                                                                                                                                                                                                                           |
| [Thunderbird](https://www.thunderbird.net/)                                                   | Notre équipe de développement utilise ceci (et le recommande aussi) comme **le client email préféré à utiliser avec Forward Email**.                                                                                                                                                                                                                              |
| [UTM](https://github.com/utmapp/UTM)                                                          | Notre équipe de développement utilise cet outil pour créer des machines virtuelles pour iOS et macOS afin de tester différents clients email (en parallèle) avec nos serveurs IMAP et SMTP.                                                                                                                                                                        |
| [Ubuntu](https://ubuntu.com/download/server)                                                  | Système d'exploitation serveur moderne open-source basé sur Linux qui alimente toute notre infrastructure.                                                                                                                                                                                                                                                         |
| [WildDuck](https://github.com/nodemailer/wildduck)                                            | Bibliothèque serveur IMAP – voir ses notes sur la [déduplication des pièces jointes](https://github.com/nodemailer/wildduck/blob/master/docs/in-depth/attachment-deduplication.md) et le [support du protocole IMAP](https://github.com/nodemailer/wildduck/blob/master/docs/in-depth/protocol-support.md).                                                               |
| [better-sqlite3-multiple-ciphers](https://github.com/m4heshd/better-sqlite3-multiple-ciphers) | Bibliothèque API rapide et simple pour Node.js pour interagir avec SQLite3 de manière programmatique.                                                                                                                                                                                                                                                               |
| [email-templates](https://github.com/forwardemail/email-templates)                            | Framework email convivial pour les développeurs pour créer, prévisualiser et envoyer des emails personnalisés (par exemple notifications de compte et plus).                                                                                                                                                                                                       |
| [json-sql-enhanced](https://github.com/forwardemail/json-sql-enhanced)                        | Générateur de requêtes SQL utilisant une syntaxe de style Mongo. Cela fait gagner du temps à notre équipe de développement car nous pouvons continuer à écrire en style Mongo sur toute la pile avec une approche agnostique de la base de données. **Cela aide aussi à éviter les attaques par injection SQL en utilisant des paramètres de requête.**               |
| [knex-schema-inspector](https://github.com/knex/knex-schema-inspector)                        | Utilitaire SQL pour extraire des informations sur le schéma de base de données existant. Cela nous permet de valider facilement que tous les index, tables, colonnes, contraintes, et plus sont valides et sont `1:1` avec ce qu'ils devraient être. Nous avons même écrit des helpers automatisés pour ajouter de nouvelles colonnes et index si des modifications sont faites aux schémas de base de données (avec des alertes d'erreur extrêmement détaillées aussi). |
| [knex](https://github.com/knex/knex)                                                          | Générateur de requêtes SQL que nous utilisons uniquement pour les migrations de base de données et la validation de schéma via `knex-schema-inspector`.                                                                                                                                                                                                             |
| [mandarin](https://github.com/ladjs/mandarin)                                                 | Traduction automatique de phrases [i18n](https://en.wikipedia.org/wiki/Internationalization_and_localization) avec prise en charge de Markdown utilisant l'[API Google Cloud Translation](https://cloud.google.com/translate/docs/reference/rest).                                                                                                                                                         |
| [mx-connect](https://github.com/zone-eu/mx-connect)                                           | Package Node.js pour résoudre et établir des connexions avec les serveurs MX et gérer les erreurs.                                                                                                                                                                                                                                                                  |
| [pm2](https://github.com/Unitech/pm2)                                                         | Gestionnaire de processus de production Node.js avec équilibrage de charge intégré ([finement réglé](https://github.com/Unitech/pm2/issues/5145#issuecomment-1737764214) pour la performance).                                                                                                                                                                         |
| [smtp-server](https://github.com/nodemailer/smtp-server)                                      | Bibliothèque serveur SMTP – nous l'utilisons pour nos serveurs d'échange de mail ("MX") et SMTP sortants.                                                                                                                                                                                                                                                           |
| [ImapTest](https://www.imapwiki.org/ImapTest)                                                 | Outil utile pour tester les serveurs IMAP selon les benchmarks et la compatibilité avec la spécification RFC du protocole IMAP. Ce projet a été créé par l'équipe [Dovecot](https://en.wikipedia.org/wiki/Dovecot_\(software\)) (un serveur IMAP et POP3 open-source actif depuis juillet 2002). Nous avons testé en profondeur notre serveur IMAP avec cet outil.                |
> Vous pouvez trouver d'autres projets que nous utilisons dans [notre code source sur GitHub](https://github.com/forwardemail).

### Fournisseurs {#providers}

| Fournisseur                                     | Objectif                                                                                                                     |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| [Cloudflare](https://www.cloudflare.com/)       | Fournisseur DNS, contrôles de santé, équilibreurs de charge, et stockage de secours utilisant [Cloudflare R2](https://developers.cloudflare.com/r2). |
| [GitHub](https://github.com/)                   | Hébergement de code source, CI/CD, et gestion de projet.                                                                     |
| [Digital Ocean](https://m.do.co/c/a7fe489d1b27) | Hébergement de serveurs dédiés et bases de données gérées.                                                                   |
| [Vultr](https://www.vultr.com/?ref=7429848)     | Hébergement de serveurs dédiés.                                                                                              |
| [DataPacket](https://www.datapacket.com)        | Hébergement de serveurs dédiés.                                                                                              |


## Réflexions {#thoughts}

### Principes {#principles}

Forward Email est conçu selon ces principes :

1. Être toujours convivial pour les développeurs, axé sur la sécurité et la confidentialité, et transparent.
2. Respecter [MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller), [Unix](https://en.wikipedia.org/wiki/Unix_philosophy), [KISS](https://en.wikipedia.org/wiki/KISS_principle), [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself), [YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it), [Twelve Factor](https://12factor.net/), [Rasoir d'Occam](https://en.wikipedia.org/wiki/Occam%27s_razor), et [dogfooding](https://en.wikipedia.org/wiki/Eating_your_own_dog_food)
3. Cibler les développeurs débrouillards, autofinancés, et [rentables au ramen](http://www.paulgraham.com/ramenprofitable.html)

### Expériences {#experiments}

> **tldr;** En fin de compte, utiliser un stockage d'objets compatible S3 et/ou des Tables Virtuelles n'est pas techniquement faisable pour des raisons de performance et est sujet à erreurs en raison des limitations de mémoire.

Nous avons réalisé quelques expériences menant à notre solution finale SQLite comme discuté ci-dessus.

L'une d'elles a été d'essayer d'utiliser [rclone]() et SQLite ensemble avec une couche de stockage compatible S3.

Cette expérience nous a permis de mieux comprendre et découvrir des cas limites autour de rclone, SQLite, et l'utilisation de [VFS](https://en.wikipedia.org/wiki/Virtual_file_system) :

* Si vous activez le flag `--vfs-cache-mode writes` avec rclone, alors les lectures seront correctes, cependant les écritures seront mises en cache.
  * Si vous avez plusieurs serveurs IMAP répartis globalement, alors le cache sera désynchronisé entre eux à moins d'avoir un seul écrivain et plusieurs auditeurs (par exemple une approche pub/sub).
  * C'est incroyablement complexe et ajouter toute complexité supplémentaire comme celle-ci entraînera plus de points uniques de défaillance.
  * Les fournisseurs de stockage compatibles S3 ne supportent pas les modifications partielles de fichiers – ce qui signifie que toute modification du fichier `.sqlite` entraînera un changement complet et une ré-upload de la base de données.
  * D'autres solutions comme `rsync` existent, mais elles ne sont pas axées sur le support du journal d'écriture anticipée ("[WAL](https://www.sqlite.org/wal.html)") – nous avons donc fini par examiner Litestream. Heureusement, notre usage du chiffrement chiffre déjà les fichiers [WAL](https://www.sqlite.org/wal.html) pour nous, donc nous n'avons pas besoin de dépendre de Litestream pour cela. Cependant, nous n'étions pas encore confiants dans Litestream pour une utilisation en production et avons quelques notes à ce sujet ci-dessous.
  * Utiliser cette option `--vfs-cache-mode writes` (la *seule* façon d'utiliser SQLite via `rclone` pour les écritures) tentera de copier toute la base de données en mémoire depuis zéro – gérer une boîte aux lettres de 10 Go est acceptable, mais gérer plusieurs boîtes aux lettres avec un stockage extrêmement élevé fera que les serveurs IMAP atteindront des limites de mémoire et provoqueront des erreurs `ENOMEM`, des fautes de segmentation, et une corruption des données.
* Si vous tentez d'utiliser les [Tables Virtuelles](https://www.sqlite.org/vtab.html) SQLite (par exemple en utilisant [s3db](https://github.com/jrhy/s3db)) afin d'avoir les données sur une couche de stockage compatible S3, vous rencontrerez plusieurs autres problèmes :
  * Les lectures et écritures seront extrêmement lentes car les points d'accès API S3 devront être sollicités avec les méthodes HTTP `GET`, `PUT`, `HEAD`, et `POST`.
  * Les tests de développement ont montré qu'au-delà de 500K-1M+ enregistrements sur une connexion fibre, la limitation reste le débit d'écriture et de lecture vers les fournisseurs compatibles S3. Par exemple, nos développeurs ont exécuté des boucles `for` pour faire à la fois des instructions SQL `INSERT` séquentielles et des écritures en masse de grandes quantités de données. Dans les deux cas, la performance était extrêmement lente.
  * Les tables virtuelles **ne peuvent pas avoir d'index**, d'instructions `ALTER TABLE`, et [autres](https://stackoverflow.com/a/12507650) [limitations](https://sqlite.org/lang_createvtab.html) – ce qui entraîne des délais pouvant atteindre 1 à 2 minutes ou plus selon la quantité de données.
  * Les objets étaient stockés sans chiffrement et aucun support natif de chiffrement n'est facilement disponible.
* Nous avons également exploré l'utilisation de [sqlite-s3vfs](https://github.com/uktrade/sqlite-s3vfs) qui est conceptuellement et techniquement similaire au point précédent (donc avec les mêmes problèmes). Une possibilité serait d'utiliser une compilation personnalisée de `sqlite3` enveloppée avec un chiffrement tel que [wxSQLite3](https://github.com/utelle/wxsqlite3) (que nous utilisons actuellement dans notre solution ci-dessus) via [l'édition du fichier de configuration](https://github.com/rogerbinns/apsw/blob/a870bda57ce28704f028af44c392b9a458e702be/setup.py#L268-L276).
* Une autre approche potentielle était d'utiliser l'[extension multiplex](https://www.sqlite.org/src/doc/trunk/src/test_multiplex.c), cependant elle a une limite de 32 Go et nécessiterait une construction complexe et des difficultés de développement.
* Les instructions `ALTER TABLE` sont nécessaires (ce qui exclut complètement l'utilisation des Tables Virtuelles). Nous avons besoin des instructions `ALTER TABLE` pour que notre hook avec `knex-schema-inspector` fonctionne correctement – ce qui garantit que les données ne sont pas corrompues et que les lignes récupérées peuvent être converties en documents valides selon nos définitions de schéma `mongoose` (incluant contraintes, types de variables, et validation arbitraire des données).
* Presque tous les projets compatibles S3 liés à SQLite dans la communauté open-source sont en Python (et non en JavaScript que nous utilisons pour 100% de notre stack).
* Les bibliothèques de compression telles que [sqlite-zstd](https://github.com/phiresky/sqlite-zstd) (voir [commentaires](https://news.ycombinator.com/item?id=32303762)) semblent prometteuses, mais [peuvent ne pas encore être prêtes pour une utilisation en production](https://github.com/phiresky/sqlite-zstd#usage). À la place, la compression côté application sur des types de données tels que `String`, `Object`, `Map`, `Array`, `Set`, et `Buffer` sera une approche plus propre et plus facile (et plus facile à migrer aussi, puisque nous pourrions stocker un indicateur `Boolean` ou une colonne – ou même utiliser `PRAGMA` `user_version=1` pour compression ou `user_version=0` pour pas de compression comme métadonnées de la base).
  * Heureusement, nous avons déjà la déduplication des pièces jointes implémentée dans notre stockage serveur IMAP – donc chaque message avec la même pièce jointe ne conserve pas une copie de la pièce jointe – une seule pièce jointe est stockée pour plusieurs messages et fils dans une boîte aux lettres (et une référence étrangère est ensuite utilisée).
* Le projet Litestream, qui est une solution de réplication et de sauvegarde SQLite, est très prometteur et nous l'utiliserons très probablement à l'avenir.
  * Sans dénigrer l'auteur(s) – car nous aimons leur travail et leurs contributions à l'open-source depuis plus d'une décennie – cependant d'après l'usage réel il semble qu'il [y ait beaucoup de difficultés](https://github.com/benbjohnson/litestream/issues) et [un risque potentiel de perte de données](https://github.com/benbjohnson/litestream/issues/218).
* La restauration des sauvegardes doit être sans friction et triviale. Utiliser une solution comme MongoDB avec `mongodump` et `mongoexport` est non seulement fastidieux, mais aussi chronophage et complexe à configurer.
  * Les bases SQLite simplifient cela (c'est un seul fichier).
  * Nous voulions concevoir une solution où les utilisateurs pourraient prendre leur boîte aux lettres et partir à tout moment.
    * Commandes Node.js simples pour `fs.unlink('mailbox.sqlite'))` et elle est définitivement effacée du stockage disque.
    * Nous pouvons de même utiliser une API compatible S3 avec HTTP `DELETE` pour supprimer facilement les instantanés et sauvegardes pour les utilisateurs.
  * SQLite était la solution la plus simple, rapide, et rentable.
### Manque d'alternatives {#lack-of-alternatives}

À notre connaissance, aucun autre service de messagerie n'est conçu de cette manière ni n'est open-source.

Nous *pensons que cela pourrait être dû* au fait que les services de messagerie existants utilisent une technologie héritée en production avec du [code spaghetti](https://en.wikipedia.org/wiki/Spaghetti_code) :spaghetti:.

La plupart, sinon la totalité, des fournisseurs de services de messagerie existants sont soit propriétaires, soit se présentent comme open-source, **mais en réalité seule leur interface frontale est open-source.**

**La partie la plus sensible de la messagerie** (le stockage réel / interaction IMAP/SMTP) **est entièrement réalisée sur le back-end (serveur), et *pas* sur le front-end (client)**.

### Essayez Forward Email {#try-out-forward-email}

Inscrivez-vous dès aujourd'hui sur <https://forwardemail.net> ! :rocket:
