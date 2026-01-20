# Comment Forward Email protège votre confidentialité, votre domaine et votre sécurité : l'analyse technique approfondie {#how-forward-email-protects-your-privacy-domain-and-security-the-technical-deep-dive}

<img loading="lazy" src="/img/articles/email-forwarding.webp" alt="Best email forwarding service comparison" class="rounded-lg" />

## Table des matières {#table-of-contents}

* [Avant-propos](#foreword)
* [La philosophie de confidentialité des e-mails transférés](#the-forward-email-privacy-philosophy)
* [Implémentation de SQLite : durabilité et portabilité de vos données](#sqlite-implementation-durability-and-portability-for-your-data)
* [Mécanisme intelligent de file d'attente et de nouvelle tentative : garantir la livraison des e-mails](#smart-queue-and-retry-mechanism-ensuring-email-delivery)
* [Ressources illimitées avec limitation de débit intelligente](#unlimited-resources-with-intelligent-rate-limiting)
* [Cryptage en sandbox pour une sécurité renforcée](#sandboxed-encryption-for-enhanced-security)
* [Traitement des e-mails en mémoire : aucun stockage sur disque pour une confidentialité maximale](#in-memory-email-processing-no-disk-storage-for-maximum-privacy)
* [Chiffrement de bout en bout avec OpenPGP pour une confidentialité totale](#end-to-end-encryption-with-openpgp-for-complete-privacy)
* [Protection de contenu multicouche pour une sécurité complète](#multi-layered-content-protection-for-comprehensive-security)
* [En quoi nous différencions-nous des autres services de messagerie : l'avantage technique en matière de confidentialité](#how-we-differ-from-other-email-services-the-technical-privacy-advantage)
  * [Transparence Open Source pour une confidentialité vérifiable](#open-source-transparency-for-verifiable-privacy)
  * [Pas de dépendance vis-à-vis d'un fournisseur pour une confidentialité sans compromis](#no-vendor-lock-in-for-privacy-without-compromise)
  * [Données en bac à sable pour une véritable isolation](#sandboxed-data-for-true-isolation)
  * [Portabilité et contrôle des données](#data-portability-and-control)
* [Les défis techniques de la redirection d'e-mails axée sur la confidentialité](#the-technical-challenges-of-privacy-first-email-forwarding)
  * [Gestion de la mémoire pour le traitement des e-mails sans journalisation](#memory-management-for-no-logging-email-processing)
  * [Détection de spam sans analyse de contenu pour un filtrage préservant la confidentialité](#spam-detection-without-content-analysis-for-privacy-preserving-filtering)
  * [Maintenir la compatibilité avec une conception axée sur la confidentialité](#maintaining-compatibility-with-privacy-first-design)
* [Meilleures pratiques de confidentialité pour les utilisateurs de Forward Email](#privacy-best-practices-for-forward-email-users)
* [Conclusion : l’avenir du transfert de courrier électronique privé](#conclusion-the-future-of-private-email-forwarding)

## Avant-propos {#foreword}

Dans le paysage numérique actuel, la confidentialité des e-mails est devenue plus cruciale que jamais. Face aux violations de données, aux préoccupations en matière de surveillance et aux publicités ciblées basées sur le contenu des e-mails, les utilisateurs recherchent de plus en plus des solutions qui privilégient leur confidentialité. Chez Forward Email, nous avons conçu notre service dès le départ en plaçant la confidentialité au cœur de notre architecture. Cet article de blog explore les implémentations techniques qui font de notre service l'une des solutions de transfert d'e-mails les plus respectueuses de la confidentialité.

## La philosophie de confidentialité des e-mails transférés {#the-forward-email-privacy-philosophy}

Avant d'entrer dans les détails techniques, il est important de comprendre notre philosophie fondamentale en matière de confidentialité : **vos e-mails vous appartiennent, à vous seul**. Ce principe guide chacune de nos décisions techniques, de la gestion du transfert des e-mails à la mise en œuvre du chiffrement.

Contrairement à de nombreux fournisseurs de messagerie qui analysent vos messages à des fins publicitaires ou les stockent indéfiniment sur leurs serveurs, Forward Email fonctionne avec une approche radicalement différente :

1. **Traitement en mémoire uniquement** - Nous ne stockons pas vos e-mails transférés sur disque.
2. **Aucun stockage de métadonnées** - Nous ne conservons aucune trace des e-mails échangés.
3. **100 % open source** - L'intégralité de notre code source est transparente et vérifiable.
4. **Chiffrement de bout en bout** - Nous prenons en charge OpenPGP pour des communications véritablement privées.

Implémentation SQLite : durabilité et portabilité de vos données {#sqlite-implementation-durability-and-portability-for-your-data}

L'un des principaux avantages de Forward Email en matière de confidentialité réside dans notre implémentation minutieuse de [SQLite](https://en.wikipedia.org/wiki/SQLite). Nous avons optimisé SQLite avec des paramètres PRAGMA spécifiques et [Journalisation à écriture anticipée (WAL)](https://en.wikipedia.org/wiki/Write-ahead_logging) pour garantir la durabilité et la portabilité de vos données, tout en maintenant les normes de confidentialité et de sécurité les plus strictes.

Voici un aperçu de la façon dont nous avons implémenté SQLite avec [ChaCha20-Poly1305](https://en.wikipedia.org/wiki/ChaCha20-Poly1305) comme chiffrement pour le cryptage résistant aux quanta :

```javascript
// Initialize the database with better-sqlite3-multiple-ciphers
const Database = require('better-sqlite3-multiple-ciphers');

// Set up encryption with ChaCha20-Poly1305 cipher
db.pragma(`key="${decrypt(session.user.password)}"`);

// Enable Write-Ahead Logging for durability and performance
db.pragma('journal_mode=WAL');

// Overwrite deleted content with zeros for privacy
db.pragma('secure_delete=ON');

// Enable auto vacuum for efficient storage management
db.pragma('auto_vacuum=FULL');

// Set busy timeout for handling concurrent access
db.pragma(`busy_timeout=${config.busyTimeout}`);

// Optimize synchronization for reliability
db.pragma('synchronous=NORMAL');

// Enable foreign key constraints for data integrity
db.pragma('foreign_keys=ON');

// Set UTF-8 encoding for international character support
db.pragma(`encoding='UTF-8'`);

// Optimize database performance
db.pragma('optimize=0x10002;');

// Use disk for temporary storage instead of memory
db.pragma('temp_store=1;');
```

Cette implémentation garantit la sécurité et la portabilité de vos données. Vous pouvez récupérer vos e-mails à tout moment en les exportant aux formats [MBOX](https://en.wikipedia.org/wiki/Email#Storage), [EML](https://en.wikipedia.org/wiki/Email#Storage) ou SQLite. Et lorsque vous souhaitez supprimer vos données, elles disparaissent définitivement : nous supprimons simplement les fichiers du stockage sur disque, sans exécuter de commandes SQL DELETE ROW, qui peuvent laisser des traces dans la base de données.

L'aspect cryptage quantique de notre implémentation utilise ChaCha20-Poly1305 comme chiffrement lorsque nous initialisons la base de données, offrant une protection solide contre les menaces actuelles et futures pour la confidentialité de vos données.

## Mécanisme intelligent de file d'attente et de nouvelle tentative : garantir la livraison des e-mails {#smart-queue-and-retry-mechanism-ensuring-email-delivery}

Au lieu de nous concentrer uniquement sur la gestion des en-têtes, nous avons mis en place un mécanisme sophistiqué de file d'attente intelligente et de nouvelle tentative avec notre méthode `getBounceInfo`. Ce système garantit que vos e-mails ont les meilleures chances d'être distribués, même en cas de problèmes temporaires.

```javascript
function getBounceInfo(err) {
  // Initialize bounce info with default values
  const bounceInfo = {
    action: err.responseCode >= 500 ? 'reject' : 'defer',
    category: err.category || 'other',
    message: err.message,
    code: err.responseCode || err.code
  };

  // Analyze error response to determine appropriate action
  const response = err.response || err.message || '';

  // Determine if the issue is temporary or permanent
  if (response.includes('temporarily deferred') ||
      response.includes('try again later')) {
    bounceInfo.action = 'defer';
  }

  // Categorize the bounce reason for appropriate handling
  if (response.includes('mailbox full')) {
    bounceInfo.category = 'full';
    bounceInfo.action = 'defer';
  } else if (response.includes('user unknown')) {
    bounceInfo.category = 'unknown';
  }

  return bounceInfo;
}
```

> \[!NOTE]
> Ceci est un extrait de la méthode `getBounceInfo` et non l'implémentation complète. Pour consulter le code complet, consultez [GitHub](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/get-bounce-info.js).

Nous réessayons la distribution du courrier pendant 5 jours, conformément aux normes du secteur ([Postfix](https://en.wikipedia.org/wiki/Postfix_\(software\)), ce qui laisse le temps aux problèmes temporaires de se résoudre. Cette approche améliore considérablement les taux de distribution tout en préservant la confidentialité.

De même, nous expurgons également le contenu des e-mails SMTP sortants après leur distribution. Notre système de stockage configure cette fonctionnalité avec une période de conservation par défaut de 30 jours, que vous pouvez ajuster dans les paramètres avancés de votre domaine. Passé ce délai, le contenu de l'e-mail est automatiquement expurgé et purgé, ne laissant qu'un message d'espace réservé :

```txt
This message was successfully sent. It has been redacted and purged for your security and privacy. If you would like to increase your message retention time, please go to the Advanced Settings page for your domain.
```

Cette approche garantit que vos e-mails envoyés ne restent pas stockés indéfiniment, réduisant ainsi le risque de violation de données ou d'accès non autorisé à vos communications.

## Ressources illimitées avec limitation de débit intelligente {#unlimited-resources-with-intelligent-rate-limiting}

Bien que Forward Email offre un nombre illimité de domaines et d'alias, nous avons mis en place une limitation intelligente du débit afin de protéger notre système contre les abus et de garantir une utilisation équitable pour tous les utilisateurs. Par exemple, les clients non professionnels peuvent créer jusqu'à 50 alias par jour, ce qui prévient le spam et la saturation de notre base de données, et permet à nos fonctionnalités de protection et de prévention des abus en temps réel de fonctionner efficacement.

```javascript
// Rate limiter implementation
const rateLimiter = new RateLimiter({
  // Configuration settings
});

// Check rate limits before processing
const limit = await rateLimiter.get({
  key: `domain:${domain.id}`,
  duration: ms('1d')
});

// Apply appropriate action based on limit status
if (limit.remaining <= 0) {
  // Handle rate limit exceeded
}
```

Cette approche équilibrée vous offre la flexibilité de créer autant d’adresses e-mail que nécessaire pour une gestion complète de la confidentialité, tout en préservant l’intégrité et les performances de notre service pour tous les utilisateurs.

## Chiffrement en sandbox pour une sécurité renforcée {#sandboxed-encryption-for-enhanced-security}

Notre approche unique de chiffrement sandboxé offre un avantage de sécurité crucial que de nombreux utilisateurs négligent lorsqu'ils choisissent un service de messagerie. Découvrons pourquoi le sandboxing des données, notamment celles des e-mails, est si important.

Des services comme Gmail et Proton utilisent très probablement un [bases de données relationnelles](https://en.wikipedia.org/wiki/Relational_database) partagé, ce qui crée une faille de sécurité fondamentale. Dans un environnement de base de données partagée, si quelqu'un accède aux données d'un utilisateur, il peut également accéder aux données d'autres utilisateurs. En effet, toutes les données utilisateur résident dans les mêmes tables de base de données, séparées uniquement par des identifiants utilisateur ou des identifiants similaires.

Forward Email adopte une approche fondamentalement différente avec notre cryptage sandboxé :

1. **Isolation complète** : Les données de chaque utilisateur sont stockées dans sa propre base de données SQLite chiffrée, complètement isolées des autres utilisateurs.
2. **Clés de chiffrement indépendantes** : Chaque base de données est chiffrée avec sa propre clé unique dérivée du mot de passe de l'utilisateur.
3. **Pas de stockage partagé** : Contrairement aux bases de données relationnelles où les e-mails de tous les utilisateurs peuvent se trouver dans une seule table « e-mails », notre approche garantit l'absence de mélange de données.
4. **Défense en profondeur** : Même si la base de données d'un utilisateur était compromise, elle ne donnerait pas accès aux données des autres utilisateurs.

Cette approche sandbox est similaire au stockage de vos e-mails dans un coffre-fort physique distinct plutôt que dans un espace de stockage partagé avec des cloisons internes. Il s'agit d'une différence architecturale fondamentale qui améliore considérablement votre confidentialité et votre sécurité.

## Traitement des e-mails en mémoire : aucun stockage sur disque pour une confidentialité maximale {#in-memory-email-processing-no-disk-storage-for-maximum-privacy}

Pour notre service de transfert d'e-mails, nous traitons entièrement les e-mails en mémoire vive (RAM) et ne les enregistrons jamais sur disque dur ni dans des bases de données. Cette approche offre une protection inégalée contre la surveillance des e-mails et la collecte de métadonnées.

Voici un aperçu simplifié du fonctionnement de notre traitement des e-mails :

```javascript
async function onData(stream, _session, fn) {
  // Store clone of session since it gets modified/destroyed
  const session = JSON.parse(safeStringify(_session));

  try {
    // Process the email stream in memory
    const messageSplitter = new MessageSplitter({
      maxBytes: MAX_BYTES
    });
    stream.pipe(messageSplitter);
    const body = await getStream.buffer(messageSplitter);

    const { headers } = messageSplitter;

    // Update session object with useful debug info for error logs
    await updateSession.call(this, body, headers, session);

    // Process the email without storing to disk
    // [Processing code omitted for brevity]

    // Return success without persisting email data
    fn();
  } catch (err) {
    // Handle errors without storing sensitive information
    fn(err);
  }
}
```

Grâce à cette approche, même si nos serveurs étaient compromis, les attaquants ne pourraient accéder à aucun historique de messagerie. Vos e-mails transitent simplement par notre système et sont immédiatement transférés à leur destination sans laisser de trace. Cette méthode de transfert d'e-mails sans journalisation est essentielle pour protéger vos communications de la surveillance.

## Chiffrement de bout en bout avec OpenPGP pour une confidentialité totale {#end-to-end-encryption-with-openpgp-for-complete-privacy}

Pour les utilisateurs nécessitant un niveau de protection optimal contre la surveillance des e-mails, nous prenons en charge [OpenPGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy) pour le chiffrement de bout en bout. Contrairement à de nombreux fournisseurs de messagerie qui nécessitent des passerelles ou des applications propriétaires, notre implémentation fonctionne avec les clients de messagerie standard, rendant les communications sécurisées accessibles à tous.

Voici comment nous implémentons le cryptage OpenPGP :

```javascript
async function encryptMessage(pubKeyArmored, raw, isArmored = true) {
  // [Initial validation code omitted for brevity]

  // Read the public key
  const pubKey = isArmored
    ? await openpgp.readKey({
        armoredKey: tools.prepareArmoredPubKey(pubKeyArmored),
        config: { tolerant: true }
      })
    : pubKeyArmored;

  if (!pubKey) throw new TypeError('Public key does not exist');

  // Perform the actual encryption using OpenPGP
  const ciphertext = await openpgp.encrypt({
    message: await openpgp.createMessage({
      binary: Buffer.concat([Buffer.from(bodyHeaders + '\r\n\r\n'), body])
    }),
    encryptionKeys: pubKey,
    format: 'armored',
    config: { minRSABits: 1024 }
  });

  // Format the encrypted message as a proper MIME message
  // [MIME formatting code omitted for brevity]

  return Buffer.concat([headers, breaker, Buffer.from(text)]);
}
```

Cette implémentation garantit que vos e-mails sont chiffrés avant de quitter votre appareil et ne peuvent être déchiffrés que par le destinataire prévu, préservant ainsi la confidentialité de vos communications, même vis-à-vis de nous. Ceci est essentiel pour protéger les communications sensibles contre les accès non autorisés et la surveillance.

## Protection de contenu multicouche pour une sécurité complète {#multi-layered-content-protection-for-comprehensive-security}

Forward Email offre plusieurs couches de protection de contenu qui sont activées par défaut pour fournir une sécurité complète contre diverses menaces :

1. **Protection du contenu réservé aux adultes** - Filtre le contenu inapproprié sans compromettre la confidentialité
2. **Protection [Hameçonnage](https://en.wikipedia.org/wiki/Phishing)** - Bloque les tentatives de vol d'informations tout en préservant votre anonymat
3. **Protection des fichiers exécutables** - Empêche les pièces jointes potentiellement dangereuses sans analyser le contenu
4. **Protection [Virus](https://en.wikipedia.org/wiki/Computer_virus)** - Analyse les logiciels malveillants à l'aide de techniques de protection de la confidentialité

Contrairement à de nombreux fournisseurs qui proposent ces fonctionnalités sur option, nous les avons désactivées, garantissant ainsi que tous les utilisateurs bénéficient de ces protections par défaut. Cette approche reflète notre engagement envers la confidentialité et la sécurité, offrant un équilibre que de nombreux services de messagerie ne parviennent pas à atteindre.

## En quoi nous nous différencions des autres services de messagerie : l'avantage technique en matière de confidentialité {#how-we-differ-from-other-email-services-the-technical-privacy-advantage}

Lorsque l'on compare Forward Email à d'autres services de messagerie, plusieurs différences techniques clés mettent en évidence notre approche axée sur la confidentialité :

### Transparence Open Source pour une confidentialité vérifiable {#open-source-transparency-for-verifiable-privacy}

Bien que de nombreux fournisseurs de messagerie se revendiquent open source, ils maintiennent souvent leur code back-end confidentiel. Forward Email est 100 % [open source](https://en.wikipedia.org/wiki/Open_source), y compris le code front-end et back-end. Cette transparence permet un audit de sécurité indépendant de tous les composants, garantissant ainsi la vérification de nos déclarations de confidentialité par tous.

### Pas de dépendance vis-à-vis d'un fournisseur pour une confidentialité sans compromis {#no-vendor-lock-in-for-privacy-without-compromise}

De nombreux fournisseurs de messagerie soucieux de la confidentialité exigent l'utilisation de leurs applications ou passerelles propriétaires. Forward Email fonctionne avec n'importe quel client de messagerie standard via les protocoles [IMAP](https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol), [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol) et [SMTP](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol), vous offrant ainsi la liberté de choisir votre logiciel de messagerie préféré sans compromettre la confidentialité.

### Données sandboxées pour une véritable isolation {#sandboxed-data-for-true-isolation}

Contrairement aux services qui utilisent des bases de données partagées où toutes les données des utilisateurs sont regroupées, notre approche sandbox garantit l'isolement complet des données de chaque utilisateur. Cette différence architecturale fondamentale offre des garanties de confidentialité nettement supérieures à celles de la plupart des services de messagerie.

### Portabilité et contrôle des données {#data-portability-and-control}

Nous pensons que vos données vous appartiennent. C'est pourquoi nous facilitons l'exportation de vos e-mails aux formats standards (MBOX, EML, SQLite) et la suppression définitive de vos données quand vous le souhaitez. Ce niveau de contrôle est rare chez les fournisseurs de messagerie, mais essentiel pour une véritable confidentialité.

## Les défis techniques du transfert d'e-mails axé sur la confidentialité {#the-technical-challenges-of-privacy-first-email-forwarding}

Créer un service de messagerie électronique axé sur la confidentialité pose des défis techniques importants. Voici quelques-uns des obstacles que nous avons surmontés :

### Gestion de la mémoire pour le traitement des e-mails sans journalisation {#memory-management-for-no-logging-email-processing}

Le traitement des e-mails en mémoire sans stockage sur disque nécessite une gestion rigoureuse de la mémoire pour gérer efficacement un volume important de courrier électronique. Nous avons mis en œuvre des techniques avancées d'optimisation de la mémoire afin de garantir des performances fiables sans compromettre notre politique de non-stockage, un élément essentiel de notre stratégie de protection de la confidentialité.

### Détection de spam sans analyse de contenu pour un filtrage préservant la confidentialité {#spam-detection-without-content-analysis-for-privacy-preserving-filtering}

La plupart des systèmes de détection [courrier indésirable](https://en.wikipedia.org/wiki/Email_spam) s'appuient sur l'analyse du contenu des e-mails, ce qui est contraire à nos principes de confidentialité. Nous avons développé des techniques permettant d'identifier les modèles de spam sans lire le contenu de vos e-mails, trouvant ainsi un équilibre entre confidentialité et convivialité, préservant ainsi la confidentialité de vos communications.

### Maintenir la compatibilité avec la conception axée sur la confidentialité {#maintaining-compatibility-with-privacy-first-design}

Assurer la compatibilité avec tous les clients de messagerie tout en implémentant des fonctionnalités de confidentialité avancées a nécessité des solutions d'ingénierie créatives. Notre équipe a travaillé sans relâche pour garantir une confidentialité optimale, afin que vous n'ayez pas à choisir entre commodité et sécurité pour protéger vos communications par e-mail.

## Bonnes pratiques de confidentialité pour les utilisateurs de courrier électronique transféré {#privacy-best-practices-for-forward-email-users}

Pour maximiser votre protection contre la surveillance des e-mails et maximiser votre confidentialité lorsque vous utilisez Forward Email, nous vous recommandons les meilleures pratiques suivantes :

1. **Utilisez des alias uniques pour chaque service** - Créez un alias de messagerie différent pour chaque service auquel vous vous abonnez afin d'éviter tout suivi interservices.
2. **Activez le chiffrement OpenPGP** - Pour les communications sensibles, utilisez le chiffrement de bout en bout afin de garantir une confidentialité totale.
3. **Changez régulièrement vos alias de messagerie** - Mettez régulièrement à jour les alias des services importants afin de minimiser la collecte de données à long terme.
4. **Utilisez des mots de passe forts et uniques** - Protégez votre compte de transfert de courrier électronique avec un mot de passe fort pour empêcher tout accès non autorisé.
5. **Mettez en œuvre l'anonymisation [adresse IP](https://en.wikipedia.org/wiki/IP_address)** - Envisagez d'utiliser un [VPN](https://en.wikipedia.org/wiki/Virtual_private_network) avec le transfert de courrier électronique pour un anonymat complet.

## Conclusion : L'avenir du transfert d'e-mails privés {#conclusion-the-future-of-private-email-forwarding}

Chez Forward Email, nous pensons que la confidentialité n'est pas qu'une simple fonctionnalité, c'est un droit fondamental. Nos solutions techniques reflètent cette conviction : la redirection d'e-mails respecte votre vie privée à tous les niveaux et vous protège de la surveillance et de la collecte de métadonnées.

Alors que nous continuons à développer et à améliorer notre service, notre engagement envers la confidentialité reste inébranlable. Nous recherchons constamment de nouvelles méthodes de chiffrement, explorons de nouvelles protections de la confidentialité et peaufinons notre code source pour offrir l'expérience de messagerie la plus sécurisée possible.

En choisissant « Transférer les e-mails », vous ne choisissez pas simplement un service de messagerie : vous soutenez une vision d'Internet où la confidentialité est la norme, et non l'exception. Rejoignez-nous pour bâtir un avenir numérique plus privé, un e-mail à la fois.

<!-- *Mots-clés : transfert d'e-mails privés, protection de la confidentialité des e-mails, service de messagerie sécurisé, e-mails open source, chiffrement quantique, e-mails OpenPGP, traitement des e-mails en mémoire, service de messagerie sans journalisation, protection des métadonnées des e-mails, confidentialité des en-têtes d'e-mails, e-mails chiffrés de bout en bout, e-mails privilégiant la confidentialité, transfert d'e-mails anonymes, meilleures pratiques de sécurité des e-mails, protection du contenu des e-mails, protection contre le phishing, analyse antivirus des e-mails, fournisseur de messagerie axé sur la confidentialité, en-têtes d'e-mails sécurisés, mise en œuvre de la confidentialité des e-mails, protection contre la surveillance des e-mails, transfert d'e-mails sans journalisation, prévention des fuites de métadonnées des e-mails, techniques de confidentialité des e-mails, anonymisation des adresses IP pour les e-mails, alias d'e-mails privés, sécurité du transfert d'e-mails, confidentialité des e-mails contre les annonceurs, chiffrement des e-mails résistant aux attaques quantiques, confidentialité des e-mails sans compromis, stockage des e-mails SQLite, chiffrement des e-mails en bac à sable, portabilité des données pour les e-mails* -->