# Comment Forward Email Protège Votre Vie Privée, Votre Domaine et Votre Sécurité : L’Analyse Technique Approfondie {#how-forward-email-protects-your-privacy-domain-and-security-the-technical-deep-dive}

<img loading="lazy" src="/img/articles/email-forwarding.webp" alt="Comparaison des meilleurs services de transfert d’email" class="rounded-lg" />


## Table des Matières {#table-of-contents}

* [Avant-propos](#foreword)
* [La Philosophie de Confidentialité de Forward Email](#the-forward-email-privacy-philosophy)
* [Implémentation SQLite : Durabilité et Portabilité de Vos Données](#sqlite-implementation-durability-and-portability-for-your-data)
* [File d’Attente Intelligente et Mécanisme de Nouvelle Tentative : Assurer la Livraison des Emails](#smart-queue-and-retry-mechanism-ensuring-email-delivery)
* [Ressources Illimitées avec Limitation de Débit Intelligente](#unlimited-resources-with-intelligent-rate-limiting)
* [Chiffrement en Bac à Sable pour une Sécurité Renforcée](#sandboxed-encryption-for-enhanced-security)
* [Traitement des Emails en Mémoire : Pas de Stockage sur Disque pour une Confidentialité Maximale](#in-memory-email-processing-no-disk-storage-for-maximum-privacy)
* [Chiffrement de Bout en Bout avec OpenPGP pour une Confidentialité Totale](#end-to-end-encryption-with-openpgp-for-complete-privacy)
* [Protection Multi-Couches du Contenu pour une Sécurité Complète](#multi-layered-content-protection-for-comprehensive-security)
* [Comment Nous Différons des Autres Services Email : L’Avantage Technique en Matière de Confidentialité](#how-we-differ-from-other-email-services-the-technical-privacy-advantage)
  * [Transparence Open Source pour une Confidentialité Vérifiable](#open-source-transparency-for-verifiable-privacy)
  * [Pas de Verrouillage Fournisseur pour une Confidentialité Sans Compromis](#no-vendor-lock-in-for-privacy-without-compromise)
  * [Données en Bac à Sable pour une Isolation Réelle](#sandboxed-data-for-true-isolation)
  * [Portabilité et Contrôle des Données](#data-portability-and-control)
* [Les Défis Techniques du Transfert d’Email Axé sur la Confidentialité](#the-technical-challenges-of-privacy-first-email-forwarding)
  * [Gestion de la Mémoire pour un Traitement des Emails Sans Journalisation](#memory-management-for-no-logging-email-processing)
  * [Détection de Spam Sans Analyse de Contenu pour un Filtrage Respectueux de la Vie Privée](#spam-detection-without-content-analysis-for-privacy-preserving-filtering)
  * [Maintenir la Compatibilité avec une Conception Axée sur la Confidentialité](#maintaining-compatibility-with-privacy-first-design)
* [Bonnes Pratiques de Confidentialité pour les Utilisateurs de Forward Email](#privacy-best-practices-for-forward-email-users)
* [Conclusion : L’Avenir du Transfert d’Email Privé](#conclusion-the-future-of-private-email-forwarding)


## Avant-propos {#foreword}

Dans le paysage numérique actuel, la confidentialité des emails est devenue plus cruciale que jamais. Avec les violations de données, les préoccupations liées à la surveillance et la publicité ciblée basée sur le contenu des emails, les utilisateurs recherchent de plus en plus des solutions qui privilégient leur vie privée. Chez Forward Email, nous avons construit notre service depuis le départ avec la confidentialité comme pierre angulaire de notre architecture. Ce billet de blog explore les implémentations techniques qui font de notre service l’une des solutions de transfert d’email les plus axées sur la confidentialité disponibles.


## La Philosophie de Confidentialité de Forward Email {#the-forward-email-privacy-philosophy}

Avant d’entrer dans les détails techniques, il est important de comprendre notre philosophie fondamentale en matière de confidentialité : **vos emails vous appartiennent, et à vous seul**. Ce principe guide chaque décision technique que nous prenons, depuis la manière dont nous gérons le transfert d’email jusqu’à la façon dont nous implémentons le chiffrement.

Contrairement à de nombreux fournisseurs d’emails qui scannent vos messages à des fins publicitaires ou les stockent indéfiniment sur leurs serveurs, Forward Email fonctionne avec une approche radicalement différente :

1. **Traitement uniquement en mémoire** – Nous ne stockons pas vos emails transférés sur disque
2. **Aucun stockage de métadonnées** – Nous ne conservons pas de traces de qui envoie des emails à qui
3. **100 % open source** – L’intégralité de notre code est transparente et auditable
4. **Chiffrement de bout en bout** – Nous supportons OpenPGP pour des communications véritablement privées


## Implémentation SQLite : Durabilité et Portabilité de Vos Données {#sqlite-implementation-durability-and-portability-for-your-data}

Un des avantages majeurs en matière de confidentialité de Forward Email est notre implémentation soigneusement conçue de [SQLite](https://en.wikipedia.org/wiki/SQLite). Nous avons affiné SQLite avec des réglages PRAGMA spécifiques et le [Write-Ahead Logging (WAL)](https://en.wikipedia.org/wiki/Write-ahead_logging) pour garantir à la fois la durabilité et la portabilité de vos données, tout en maintenant les plus hauts standards de confidentialité et de sécurité.
Voici un aperçu de la façon dont nous avons implémenté SQLite avec [ChaCha20-Poly1305](https://en.wikipedia.org/wiki/ChaCha20-Poly1305) comme chiffrement pour une encryption résistante au quantique :

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

Cette implémentation garantit que vos données sont non seulement sécurisées mais aussi portables. Vous pouvez emporter vos emails à tout moment en les exportant aux formats [MBOX](https://en.wikipedia.org/wiki/Email#Storage), [EML](https://en.wikipedia.org/wiki/Email#Storage) ou SQLite. Et lorsque vous souhaitez supprimer vos données, elles disparaissent vraiment – nous supprimons simplement les fichiers du stockage disque au lieu d’exécuter des commandes SQL DELETE ROW, qui peuvent laisser des traces dans la base de données.

L’aspect chiffrement quantique de notre implémentation utilise ChaCha20-Poly1305 comme chiffrement lors de l’initialisation de la base de données, offrant une protection forte contre les menaces actuelles et futures à la confidentialité de vos données.


## File d’attente intelligente et mécanisme de nouvelle tentative : garantir la livraison des emails {#smart-queue-and-retry-mechanism-ensuring-email-delivery}

Au lieu de se concentrer uniquement sur la gestion des en-têtes, nous avons mis en place une file d’attente intelligente sophistiquée et un mécanisme de nouvelle tentative avec notre méthode `getBounceInfo`. Ce système garantit que vos emails ont la meilleure chance d’être livrés, même en cas de problèmes temporaires.

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
> Ceci est un extrait de la méthode `getBounceInfo` et non l’implémentation complète et détaillée. Pour le code complet, vous pouvez le consulter sur [GitHub](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/get-bounce-info.js).

Nous retentons la livraison des mails pendant 5 jours, conformément aux standards de l’industrie comme [Postfix](https://en.wikipedia.org/wiki/Postfix_\(software\)), laissant le temps aux problèmes temporaires de se résoudre. Cette approche améliore significativement les taux de livraison tout en préservant la confidentialité.

Dans le même ordre d’idées, nous expurgeons également le contenu des messages des emails SMTP sortants après une livraison réussie. Cela est configuré dans notre système de stockage avec une période de rétention par défaut de 30 jours, que vous pouvez ajuster dans les Paramètres avancés de votre domaine. Après cette période, le contenu de l’email est automatiquement expurgé et purgé, ne laissant qu’un message de remplacement :

```txt
Ce message a été envoyé avec succès. Il a été expurgé et purgé pour votre sécurité et votre confidentialité. Si vous souhaitez augmenter la durée de rétention de vos messages, veuillez vous rendre sur la page des Paramètres avancés de votre domaine.
```
Cette approche garantit que vos e-mails envoyés ne restent pas stockés indéfiniment, réduisant ainsi le risque de violations de données ou d'accès non autorisé à vos communications.


## Ressources illimitées avec limitation de débit intelligente {#unlimited-resources-with-intelligent-rate-limiting}

Bien que Forward Email offre des domaines et alias illimités, nous avons mis en place une limitation de débit intelligente pour protéger notre système contre les abus et assurer une utilisation équitable pour tous les utilisateurs. Par exemple, les clients non-entreprise peuvent créer jusqu'à plus de 50 alias par jour, ce qui empêche notre base de données d'être spammée et saturée, et permet à nos fonctionnalités de protection et de lutte contre les abus en temps réel de fonctionner efficacement.

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

Cette approche équilibrée vous offre la flexibilité de créer autant d'adresses e-mail que nécessaire pour une gestion complète de la confidentialité, tout en maintenant l'intégrité et la performance de notre service pour tous les utilisateurs.


## Chiffrement en bac à sable pour une sécurité renforcée {#sandboxed-encryption-for-enhanced-security}

Notre approche unique de chiffrement en bac à sable offre un avantage de sécurité crucial que de nombreux utilisateurs négligent lorsqu'ils choisissent un service de messagerie. Explorons pourquoi le sandboxing des données, en particulier des e-mails, est si important.

Des services comme Gmail et Proton utilisent très probablement des [bases de données relationnelles](https://en.wikipedia.org/wiki/Relational_database) partagées, ce qui crée une vulnérabilité de sécurité fondamentale. Dans un environnement de base de données partagée, si quelqu'un accède aux données d'un utilisateur, il a potentiellement un moyen d'accéder aux données d'autres utilisateurs également. Cela s'explique par le fait que toutes les données utilisateur résident dans les mêmes tables de base de données, séparées uniquement par des identifiants utilisateur ou similaires.

Forward Email adopte une approche fondamentalement différente avec notre chiffrement en bac à sable :

1. **Isolation complète** : Les données de chaque utilisateur sont stockées dans leur propre fichier de base de données SQLite chiffré, complètement isolé des autres utilisateurs
2. **Clés de chiffrement indépendantes** : Chaque base de données est chiffrée avec sa propre clé unique dérivée du mot de passe de l'utilisateur
3. **Pas de stockage partagé** : Contrairement aux bases de données relationnelles où tous les e-mails des utilisateurs pourraient se trouver dans une seule table "emails", notre approche garantit qu'il n'y a pas de mélange des données
4. **Défense en profondeur** : Même si la base de données d'un utilisateur était compromise, cela ne donnerait pas accès aux données d'autres utilisateurs

Cette approche en bac à sable est similaire à avoir votre e-mail dans un coffre-fort physique séparé plutôt que dans un espace de stockage partagé avec des cloisons internes. C'est une différence architecturale fondamentale qui améliore considérablement votre confidentialité et votre sécurité.


## Traitement des e-mails en mémoire : pas de stockage sur disque pour une confidentialité maximale {#in-memory-email-processing-no-disk-storage-for-maximum-privacy}

Pour notre service de transfert d'e-mails, nous traitons les e-mails entièrement en RAM et ne les écrivons jamais sur un stockage disque ou dans des bases de données. Cette approche offre une protection inégalée contre la surveillance des e-mails et la collecte de métadonnées.

Voici un aperçu simplifié de la façon dont notre traitement des e-mails fonctionne :

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
Cette approche signifie que même si nos serveurs étaient compromis, il n’y aurait aucune donnée historique d’e-mails accessible aux attaquants. Vos e-mails transitent simplement par notre système et sont immédiatement transférés à leur destination sans laisser de trace. Cette approche de transfert d’e-mails sans journalisation est fondamentale pour protéger vos communications contre la surveillance.


## Chiffrement de bout en bout avec OpenPGP pour une confidentialité totale {#end-to-end-encryption-with-openpgp-for-complete-privacy}

Pour les utilisateurs qui exigent le plus haut niveau de protection de la vie privée contre la surveillance des e-mails, nous supportons [OpenPGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy) pour le chiffrement de bout en bout. Contrairement à de nombreux fournisseurs d’e-mails qui nécessitent des ponts ou applications propriétaires, notre implémentation fonctionne avec des clients e-mail standards, rendant la communication sécurisée accessible à tous.

Voici comment nous implémentons le chiffrement OpenPGP :

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

Cette implémentation garantit que vos e-mails sont chiffrés avant de quitter votre appareil et ne peuvent être déchiffrés que par le destinataire prévu, gardant vos communications privées même pour nous. Ceci est essentiel pour protéger les communications sensibles contre tout accès non autorisé et la surveillance.


## Protection multi-couches du contenu pour une sécurité complète {#multi-layered-content-protection-for-comprehensive-security}

Forward Email offre plusieurs couches de protection du contenu activées par défaut pour fournir une sécurité complète contre diverses menaces :

1. **Protection contre le contenu adulte** - Filtre le contenu inapproprié sans compromettre la vie privée  
2. **Protection contre le [phishing](https://en.wikipedia.org/wiki/Phishing)** - Bloque les tentatives de vol d’informations tout en préservant l’anonymat  
3. **Protection contre les exécutables** - Empêche les pièces jointes potentiellement dangereuses sans analyser le contenu  
4. **Protection contre les [virus](https://en.wikipedia.org/wiki/Computer_virus)** - Analyse les malwares en utilisant des techniques respectueuses de la vie privée  

Contrairement à de nombreux fournisseurs qui rendent ces fonctionnalités optionnelles, nous les avons configurées en mode désactivation (opt-out), garantissant que tous les utilisateurs bénéficient par défaut de ces protections. Cette approche reflète notre engagement à la fois pour la vie privée et la sécurité, offrant un équilibre que beaucoup de services e-mail ne parviennent pas à atteindre.


## En quoi nous différons des autres services e-mail : l’avantage technique en matière de confidentialité {#how-we-differ-from-other-email-services-the-technical-privacy-advantage}

En comparant Forward Email à d’autres services e-mail, plusieurs différences techniques clés soulignent notre approche axée sur la confidentialité :

### Transparence open source pour une confidentialité vérifiable {#open-source-transparency-for-verifiable-privacy}

Alors que de nombreux fournisseurs d’e-mails prétendent être open source, ils gardent souvent leur code backend fermé. Forward Email est 100 % [open source](https://en.wikipedia.org/wiki/Open_source), incluant à la fois le code frontend et backend. Cette transparence permet un audit de sécurité indépendant de tous les composants, garantissant que nos affirmations en matière de confidentialité peuvent être vérifiées par quiconque.

### Pas de verrouillage fournisseur pour une confidentialité sans compromis {#no-vendor-lock-in-for-privacy-without-compromise}

De nombreux fournisseurs d’e-mails axés sur la confidentialité exigent que vous utilisiez leurs applications ou ponts propriétaires. Forward Email fonctionne avec n’importe quel client e-mail standard via les protocoles [IMAP](https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol), [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol) et [SMTP](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol), vous donnant la liberté de choisir votre logiciel e-mail préféré sans compromettre la confidentialité.
### Données en Bac à Sable pour une Isolation Véritable {#sandboxed-data-for-true-isolation}

Contrairement aux services qui utilisent des bases de données partagées où les données de tous les utilisateurs sont mélangées, notre approche en bac à sable garantit que les données de chaque utilisateur sont complètement isolées. Cette différence architecturale fondamentale offre des garanties de confidentialité nettement plus fortes que ce que la plupart des services de messagerie proposent.

### Portabilité et Contrôle des Données {#data-portability-and-control}

Nous croyons que vos données vous appartiennent, c’est pourquoi nous facilitons l’exportation de vos emails dans des formats standards (MBOX, EML, SQLite) et la suppression réelle de vos données quand vous le souhaitez. Ce niveau de contrôle est rare chez les fournisseurs de messagerie mais essentiel pour une véritable confidentialité.


## Les Défis Techniques du Transfert d’Email Axé sur la Confidentialité {#the-technical-challenges-of-privacy-first-email-forwarding}

Construire un service de messagerie axé sur la confidentialité implique des défis techniques importants. Voici quelques-uns des obstacles que nous avons surmontés :

### Gestion de la Mémoire pour un Traitement des Emails Sans Journalisation {#memory-management-for-no-logging-email-processing}

Le traitement des emails en mémoire sans stockage sur disque nécessite une gestion rigoureuse de la mémoire pour gérer efficacement de forts volumes de trafic email. Nous avons mis en œuvre des techniques avancées d’optimisation de la mémoire pour garantir des performances fiables sans compromettre notre politique de non-stockage, un élément crucial de notre stratégie de protection de la vie privée.

### Détection de Spam Sans Analyse de Contenu pour un Filtrage Respectueux de la Vie Privée {#spam-detection-without-content-analysis-for-privacy-preserving-filtering}

La plupart des systèmes de [spam](https://en.wikipedia.org/wiki/Email_spam) reposent sur l’analyse du contenu des emails, ce qui est en contradiction avec nos principes de confidentialité. Nous avons développé des techniques pour identifier les schémas de spam sans lire le contenu de vos emails, trouvant un équilibre entre confidentialité et utilisabilité qui préserve la confidentialité de vos communications.

### Maintenir la Compatibilité avec une Conception Axée sur la Confidentialité {#maintaining-compatibility-with-privacy-first-design}

Assurer la compatibilité avec tous les clients email tout en implémentant des fonctionnalités avancées de confidentialité a nécessité des solutions d’ingénierie créatives. Notre équipe a travaillé sans relâche pour rendre la confidentialité transparente, afin que vous n’ayez pas à choisir entre commodité et sécurité pour protéger vos communications email.


## Bonnes Pratiques de Confidentialité pour les Utilisateurs de Forward Email {#privacy-best-practices-for-forward-email-users}

Pour maximiser votre protection contre la surveillance des emails et optimiser votre confidentialité lors de l’utilisation de Forward Email, nous recommandons les bonnes pratiques suivantes :

1. **Utilisez des alias uniques pour différents services** - Créez un alias email différent pour chaque service auquel vous vous inscrivez afin d’éviter le suivi inter-services
2. **Activez le chiffrement OpenPGP** - Pour les communications sensibles, utilisez le chiffrement de bout en bout pour garantir une confidentialité totale
3. **Faites régulièrement tourner vos alias email** - Mettez à jour périodiquement les alias pour les services importants afin de minimiser la collecte de données à long terme
4. **Utilisez des mots de passe forts et uniques** - Protégez votre compte Forward Email avec un mot de passe robuste pour empêcher tout accès non autorisé
5. **Mettez en œuvre l’anonymisation des [adresses IP](https://en.wikipedia.org/wiki/IP_address)** - Envisagez d’utiliser un [VPN](https://en.wikipedia.org/wiki/Virtual_private_network) en conjonction avec Forward Email pour une anonymat complet


## Conclusion : L’Avenir du Transfert d’Email Privé {#conclusion-the-future-of-private-email-forwarding}

Chez Forward Email, nous croyons que la confidentialité n’est pas seulement une fonctionnalité — c’est un droit fondamental. Nos implémentations techniques reflètent cette conviction, vous offrant un transfert d’email qui respecte votre vie privée à tous les niveaux et vous protège contre la surveillance des emails et la collecte de métadonnées.

Alors que nous continuons à développer et améliorer notre service, notre engagement envers la confidentialité reste inébranlable. Nous recherchons constamment de nouvelles méthodes de chiffrement, explorons des protections supplémentaires de la vie privée et affinons notre base de code pour fournir l’expérience email la plus sécurisée possible.

En choisissant Forward Email, vous ne sélectionnez pas seulement un service de messagerie — vous soutenez une vision d’internet où la confidentialité est la norme, pas l’exception. Rejoignez-nous pour construire un avenir numérique plus privé, un email à la fois.
<!-- *Keywords: private email forwarding, email privacy protection, secure email service, open-source email, quantum-safe encryption, OpenPGP email, in-memory email processing, no-log email service, email metadata protection, email header privacy, end-to-end encrypted email, privacy-first email, anonymous email forwarding, email security best practices, email content protection, phishing protection, email virus scanning, privacy-focused email provider, secure email headers, email privacy implementation, protection from email surveillance, no-logging email forwarding, prevent email metadata leakage, email privacy techniques, IP address anonymization for email, private email aliases, email forwarding security, email privacy from advertisers, quantum-resistant email encryption, email privacy without compromise, SQLite email storage, sandboxed email encryption, data portability for email* -->

