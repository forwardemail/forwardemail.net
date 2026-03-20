# Une Décennie d'Impact : Comment Nos Packages npm Ont Atteint 1 Milliard de Téléchargements et Façonné JavaScript {#a-decade-of-impact-how-our-npm-packages-hit-1-billion-downloads-and-shaped-javascript}

<img loading="lazy" src="/img/articles/npm.webp" alt="NPM packages billion downloads ecosystem" class="rounded-lg" />


## Table des Matières {#table-of-contents}

* [Avant-propos](#foreword)
* [Les Pionniers Qui Nous Font Confiance : Isaac Z. Schlueter et Forward Email](#the-pioneers-who-trust-us-isaac-z-schlueter-and-forward-email)
  * [De la Création de npm au Leadership de Node.js](#from-npms-creation-to-nodejs-leadership)
* [L'Architecte Derrière le Code : Le Parcours de Nick Baugh](#the-architect-behind-the-code-nick-baughs-journey)
  * [Comité Technique Express et Contributions au Core](#express-technical-committee-and-core-contributions)
  * [Contributions au Framework Koa](#koa-framework-contributions)
  * [De Contributeur Individuel à Leader d'Organisation](#from-individual-contributor-to-organization-leader)
* [Nos Organisations GitHub : Écosystèmes d'Innovation](#our-github-organizations-ecosystems-of-innovation)
  * [Cabin : Journalisation Structurée pour Applications Modernes](#cabin-structured-logging-for-modern-applications)
  * [Spam Scanner : Lutte Contre les Abus par Email](#spam-scanner-fighting-email-abuse)
  * [Bree : Planification Moderne des Tâches avec Worker Threads](#bree-modern-job-scheduling-with-worker-threads)
  * [Forward Email : Infrastructure Email Open Source](#forward-email-open-source-email-infrastructure)
  * [Lad : Utilitaires et Outils Essentiels pour Koa](#lad-essential-koa-utilities-and-tools)
  * [Upptime : Surveillance de Disponibilité Open Source](#upptime-open-source-uptime-monitoring)
* [Nos Contributions à l'Écosystème Forward Email](#our-contributions-to-the-forward-email-ecosystem)
  * [Des Packages à la Production](#from-packages-to-production)
  * [La Boucle de Rétroaction](#the-feedback-loop)
* [Les Principes Fondamentaux de Forward Email : Une Base pour l'Excellence](#forward-emails-core-principles-a-foundation-for-excellence)
  * [Toujours Convivial pour les Développeurs, Axé sur la Sécurité et Transparent](#always-developer-friendly-security-focused-and-transparent)
  * [Respect des Principes de Développement Logiciel Éprouvés](#adherence-to-time-tested-software-development-principles)
  * [Ciblage du Développeur Débrouillard et Auto-financé](#targeting-the-scrappy-bootstrapped-developer)
  * [Principes en Pratique : La Base de Code Forward Email](#principles-in-practice-the-forward-email-codebase)
  * [Confidentialité dès la Conception](#privacy-by-design)
  * [Open Source Durable](#sustainable-open-source)
* [Les Chiffres ne Mentent Pas : Nos Statistiques Impressionnantes de Téléchargements npm](#the-numbers-dont-lie-our-staggering-npm-download-statistics)
  * [Vue d'Ensemble de Notre Impact](#a-birds-eye-view-of-our-impact)
  * [Impact Quotidien à Grande Échelle](#daily-impact-at-scale)
  * [Au-Delà des Chiffres Bruts](#beyond-the-raw-numbers)
* [Soutenir l'Écosystème : Nos Sponsorisations Open Source](#supporting-the-ecosystem-our-open-source-sponsorships)
  * [Andris Reinman : Pionnier de l'Infrastructure Email](#andris-reinman-email-infrastructure-pioneer)
  * [Sindre Sorhus : Maître des Packages Utilitaires](#sindre-sorhus-utility-package-mastermind)
* [Détection des Vulnérabilités de Sécurité dans l'Écosystème JavaScript](#uncovering-security-vulnerabilities-in-the-javascript-ecosystem)
  * [Le Sauvetage de Koa-Router](#the-koa-router-rescue)
  * [Traitement des Vulnérabilités ReDoS](#addressing-redos-vulnerabilities)
  * [Plaidoyer pour la Sécurité de Node.js et Chromium](#advocating-for-nodejs-and-chromium-security)
  * [Sécurisation de l'Infrastructure npm](#securing-npm-infrastructure)
* [Nos Contributions à l'Écosystème Forward Email](#our-contributions-to-the-forward-email-ecosystem-1)
  * [Amélioration des Fonctionnalités de Base de Nodemailer](#enhancing-nodemailers-core-functionality)
  * [Avancées dans l'Authentification Email avec Mailauth](#advancing-email-authentication-with-mailauth)
  * [Améliorations Clés d'Upptime](#key-upptime-enhancements)
* [La Colle Qui Relie Tout : Code Personnalisé à Grande Échelle](#the-glue-that-holds-it-all-together-custom-code-at-scale)
  * [Un Effort de Développement Massive](#a-massive-development-effort)
  * [Intégration des Dépendances Core](#core-dependencies-integration)
  * [Infrastructure DNS avec Tangerine et mx-connect](#dns-infrastructure-with-tangerine-and-mx-connect)
* [Impact en Entreprise : De l'Open Source aux Solutions Critiques](#enterprise-impact-from-open-source-to-mission-critical-solutions)
  * [Études de Cas sur l'Infrastructure Email Critique](#case-studies-in-mission-critical-email-infrastructure)
* [Une Décennie d'Open Source : Perspectives d'Avenir](#a-decade-of-open-source-looking-forward)
## Avant-propos {#foreword}

Dans le monde de [JavaScript](https://en.wikipedia.org/wiki/JavaScript) et de [Node.js](https://en.wikipedia.org/wiki/Node.js), certains packages sont essentiels—téléchargés des millions de fois chaque jour et alimentant des applications dans le monde entier. Derrière ces outils se trouvent des développeurs concentrés sur la qualité de l'open source. Aujourd'hui, nous montrons comment notre équipe aide à construire et maintenir des packages npm qui sont devenus des éléments clés de l'écosystème JavaScript.


## Les pionniers qui nous font confiance : Isaac Z. Schlueter et Forward Email {#the-pioneers-who-trust-us-isaac-z-schlueter-and-forward-email}

Nous sommes fiers d'avoir [Isaac Z. Schlueter](https://izs.me/) ([GitHub : isaacs](https://github.com/isaacs)) comme utilisateur. Isaac a créé [npm](https://en.wikipedia.org/wiki/Npm_\(software\)) et a contribué à la construction de [Node.js](https://en.wikipedia.org/wiki/Node.js). Sa confiance en Forward Email montre notre engagement envers la qualité et la sécurité. Isaac utilise Forward Email pour plusieurs domaines, y compris izs.me.

L'impact d'Isaac sur JavaScript est immense. En 2009, il fut parmi les premiers à percevoir le potentiel de Node.js, travaillant avec [Ryan Dahl](https://en.wikipedia.org/wiki/Ryan_Dahl), qui a créé la plateforme. Comme Isaac l'a déclaré dans une [interview avec le magazine Increment](https://increment.com/development/interview-with-isaac-z-schlueter-ceo-of-npm/) : « Au sein de cette toute petite communauté de personnes essayant de comprendre comment faire fonctionner JS côté serveur, Ryan Dahl est arrivé avec Node, qui était clairement la bonne approche. J'ai misé sur cela et me suis beaucoup impliqué vers le milieu de 2009. »

> \[!NOTE]
> Pour ceux qui s'intéressent à l'histoire de Node.js, d'excellents documentaires sont disponibles retraçant son développement, notamment [The Story of Node.js](https://www.youtube.com/watch?v=LB8KwiiUGy0) et [10 Things I Regret About Node.js - Ryan Dahl](https://www.youtube.com/watch?v=jo_B4LTHi3I). Le [site personnel](https://tinyclouds.org/) de Ryan Dahl contient également des informations précieuses sur son travail.

### De la création de npm à la direction de Node.js {#from-npms-creation-to-nodejs-leadership}

Isaac a créé npm en septembre 2009, avec la première version utilisable publiée début 2010. Ce gestionnaire de packages répondait à un besoin clé dans Node.js, permettant aux développeurs de partager et réutiliser facilement du code. Selon la [page Wikipedia de Node.js](https://en.wikipedia.org/wiki/Node.js), « En janvier 2010, un gestionnaire de packages a été introduit pour l'environnement Node.js appelé npm. Ce gestionnaire permet aux programmeurs de publier et partager des packages Node.js, ainsi que le code source associé, et est conçu pour simplifier l'installation, la mise à jour et la désinstallation des packages. »

Lorsque Ryan Dahl s'est retiré de Node.js en janvier 2012, Isaac a pris la tête du projet. Comme indiqué sur [son CV](https://izs.me/resume), il a « dirigé le développement de plusieurs API fondamentales du noyau Node.js, y compris le système de modules CommonJS, les API du système de fichiers et les flux » et « a agi en tant que BDFL (Dictateur Bienveillant à Vie) du projet pendant 2 ans, assurant une qualité toujours croissante et un processus de build fiable pour les versions Node.js v0.6 à v0.10. »

Isaac a guidé Node.js à travers une période clé de croissance, établissant des standards qui façonnent encore la plateforme aujourd'hui. Il a ensuite fondé npm, Inc. en 2014 pour soutenir le registre npm, qu'il gérait auparavant seul.

Nous remercions Isaac pour ses immenses contributions à JavaScript et continuons d'utiliser de nombreux packages qu'il a créés. Son travail a changé notre manière de construire des logiciels et la façon dont des millions de développeurs partagent du code dans le monde.


## L'architecte derrière le code : le parcours de Nick Baugh {#the-architect-behind-the-code-nick-baughs-journey}

Au cœur de notre succès open source se trouve Nick Baugh, fondateur et propriétaire de Forward Email. Son travail en JavaScript s'étend sur près de 20 ans et a façonné la manière dont d'innombrables développeurs construisent des applications. Son parcours open source témoigne à la fois de compétences techniques et d'un leadership communautaire.

### Comité technique Express et contributions au noyau {#express-technical-committee-and-core-contributions}

L'expertise de Nick dans les frameworks web lui a valu une place au sein du [Comité technique Express](https://expressjs.com/en/resources/community.html), où il a contribué à l'un des frameworks Node.js les plus utilisés. Nick est désormais listé comme membre inactif sur la [page communauté Express](https://expressjs.com/en/resources/community.html).
> \[!IMPORTANT]
> Express a été initialement créé par TJ Holowaychuk, un contributeur open source prolifique qui a façonné une grande partie de l'écosystème Node.js. Nous sommes reconnaissants pour le travail fondamental de TJ et respectons sa [décision de faire une pause](https://news.ycombinator.com/item?id=37687017) dans ses nombreuses contributions open source.

En tant que membre du [Comité Technique Express](https://expressjs.com/en/resources/community.html), Nick a montré une grande attention aux détails sur des sujets comme la clarification de la documentation de `req.originalUrl` et la correction des problèmes de gestion des formulaires multipart.

### Contributions au Framework Koa {#koa-framework-contributions}

Le travail de Nick avec le [framework Koa](https://github.com/koajs/koa)—une alternative moderne et plus légère à Express également créée par TJ Holowaychuk—montre encore son engagement envers de meilleurs outils de développement web. Ses contributions à Koa incluent à la fois des issues et du code via des pull requests, traitant la gestion des erreurs, la gestion des types de contenu et des améliorations de documentation.

Son travail à la fois sur Express et Koa lui donne une vision unique du développement web Node.js, aidant notre équipe à créer des packages qui fonctionnent bien avec plusieurs écosystèmes de frameworks.

### De contributeur individuel à leader d’organisation {#from-individual-contributor-to-organization-leader}

Ce qui a commencé par aider des projets existants s’est transformé en création et maintenance d’écosystèmes complets de packages. Nick a fondé plusieurs organisations GitHub—dont [Cabin](https://github.com/cabinjs), [Spam Scanner](https://github.com/spamscanner), [Forward Email](https://github.com/forwardemail), [Lad](https://github.com/ladjs) et [Bree](https://github.com/breejs)—chacune répondant à des besoins spécifiques dans la communauté JavaScript.

Ce passage de contributeur à leader montre la vision de Nick pour des logiciels bien conçus qui résolvent de vrais problèmes. En organisant des packages liés sous des organisations GitHub ciblées, il a construit des écosystèmes d’outils qui fonctionnent ensemble tout en restant modulaires et flexibles pour la communauté développeur au sens large.


## Nos organisations GitHub : des écosystèmes d’innovation {#our-github-organizations-ecosystems-of-innovation}

Nous organisons notre travail open source autour d’organisations GitHub ciblées, chacune répondant à des besoins spécifiques en JavaScript. Cette structure crée des familles de packages cohérentes qui fonctionnent bien ensemble tout en restant modulaires.

### Cabin : journalisation structurée pour applications modernes {#cabin-structured-logging-for-modern-applications}

L’[organisation Cabin](https://github.com/cabinjs) est notre approche d’une journalisation d’application simple et puissante. Le package principal [`cabin`](https://github.com/cabinjs/cabin) compte près de 900 étoiles GitHub et plus de 100 000 téléchargements hebdomadaires\[^1]. Cabin fournit une journalisation structurée compatible avec des services populaires comme Sentry, LogDNA et Papertrail.

Ce qui rend Cabin spécial, c’est son API réfléchie et son système de plugins. Des packages de support comme [`axe`](https://github.com/cabinjs/axe) pour le middleware Express et [`parse-request`](https://github.com/cabinjs/parse-request) pour l’analyse des requêtes HTTP montrent notre engagement envers des solutions complètes plutôt que des outils isolés.

Le package [`bson-objectid`](https://github.com/cabinjs/bson-objectid) mérite une mention spéciale, avec plus de 1,7 million de téléchargements en seulement deux mois\[^2]. Cette implémentation légère de MongoDB ObjectID est devenue la référence pour les développeurs ayant besoin d’identifiants sans dépendances complètes à MongoDB.

### Spam Scanner : lutter contre les abus par email {#spam-scanner-fighting-email-abuse}

L’[organisation Spam Scanner](https://github.com/spamscanner) montre notre engagement à résoudre de vrais problèmes. Le package principal [`spamscanner`](https://github.com/spamscanner/spamscanner) fournit une détection avancée de spam par email, mais c’est le package [`url-regex-safe`](https://github.com/spamscanner/url-regex-safe) qui a connu une adoption remarquable.

Avec plus de 1,2 million de téléchargements en deux mois\[^3], `url-regex-safe` corrige des problèmes de sécurité critiques dans d’autres expressions régulières de détection d’URL. Ce package illustre notre approche de l’open source : identifier un problème commun (dans ce cas, des vulnérabilités [ReDoS](https://en.wikipedia.org/wiki/ReDoS) dans la validation d’URL), créer une solution solide et la maintenir avec soin.
### Bree : Planification moderne des tâches avec les threads workers {#bree-modern-job-scheduling-with-worker-threads}

L’[organisation Bree](https://github.com/breejs) est notre réponse à un défi courant de Node.js : la planification fiable des tâches. Le package principal [`bree`](https://github.com/breejs/bree), avec plus de 3 100 étoiles sur GitHub, fournit un planificateur de tâches moderne utilisant les threads workers de Node.js pour de meilleures performances et une meilleure fiabilité.

> \[!NOTE]
> Bree a été créé après que nous ayons aidé à maintenir [Agenda](https://github.com/agenda/agenda), appliquant les leçons apprises pour construire un meilleur planificateur de tâches. Nos contributions à Agenda nous ont permis de trouver des moyens d’améliorer la planification des tâches.

Ce qui distingue Bree des autres planificateurs comme Agenda :

* **Pas de dépendances externes** : Contrairement à Agenda qui nécessite MongoDB, Bree ne requiert ni Redis ni MongoDB pour gérer l’état des tâches.
* **Threads workers** : Bree utilise les threads workers de Node.js pour des processus isolés, offrant une meilleure isolation et performance.
* **API simple** : Bree offre un contrôle détaillé avec simplicité, facilitant la mise en œuvre de besoins complexes en planification.
* **Support intégré** : Des fonctionnalités comme le rechargement en douceur, les tâches cron, les dates et les horaires conviviaux sont incluses par défaut.

Bree est une partie clé de [forwardemail.net](https://github.com/forwardemail/forwardemail.net), gérant des tâches critiques en arrière-plan comme le traitement des emails, le nettoyage et la maintenance planifiée. L’utilisation de Bree dans Forward Email montre notre engagement à utiliser nos propres outils en production, garantissant qu’ils répondent à des normes élevées de fiabilité.

Nous utilisons également et apprécions d’autres excellents packages de threads workers comme [piscina](https://github.com/piscinajs/piscina) et des clients HTTP comme [undici](https://github.com/nodejs/undici). Piscina, comme Bree, utilise les threads workers de Node.js pour un traitement efficace des tâches. Nous remercions [Matteo Collina](https://github.com/mcollina), qui maintient à la fois undici et piscina, pour ses contributions majeures à Node.js. Matteo siège au comité technique de Node.js et a grandement amélioré les capacités des clients HTTP dans Node.js.

### Forward Email : Infrastructure email open source {#forward-email-open-source-email-infrastructure}

Notre projet le plus ambitieux est [Forward Email](https://github.com/forwardemail), un service email open source qui fournit le transfert d’emails, le stockage et des services API. Le dépôt principal compte plus de 1 100 étoiles sur GitHub\[^4], témoignant de l’appréciation de la communauté pour cette alternative aux services email propriétaires.

Le package [`preview-email`](https://github.com/forwardemail/preview-email) de cette organisation, avec plus de 2,5 millions de téléchargements en deux mois\[^5], est devenu un outil essentiel pour les développeurs travaillant avec des modèles d’emails. En offrant un moyen simple de prévisualiser les emails pendant le développement, il résout un point douloureux fréquent dans la création d’applications intégrant des emails.

### Lad : Utilitaires et outils essentiels pour Koa {#lad-essential-koa-utilities-and-tools}

L’[organisation Lad](https://github.com/ladjs) fournit une collection d’utilitaires et d’outils essentiels principalement axés sur l’amélioration de l’écosystème du framework Koa. Ces packages résolvent des défis courants en développement web et sont conçus pour fonctionner harmonieusement ensemble tout en restant utiles indépendamment.

#### koa-better-error-handler : Gestion améliorée des erreurs pour Koa {#koa-better-error-handler-improved-error-handling-for-koa}

[`koa-better-error-handler`](https://github.com/ladjs/koa-better-error-handler) offre une meilleure solution de gestion des erreurs pour les applications Koa. Avec plus de 50 étoiles sur GitHub, ce package fait en sorte que `ctx.throw` produise des messages d’erreur conviviaux tout en corrigeant plusieurs limitations du gestionnaire d’erreurs intégré de Koa :

* Détecte et gère correctement les erreurs DNS de Node.js, les erreurs Mongoose et les erreurs Redis
* Utilise [Boom](https://github.com/hapijs/boom) pour créer des réponses d’erreur cohérentes et bien formatées
* Préserve les en-têtes (contrairement au gestionnaire intégré de Koa)
* Maintient les codes de statut appropriés au lieu de revenir par défaut à 500
* Supporte les messages flash et la préservation de session
* Fournit des listes d’erreurs HTML pour les erreurs de validation
* Supporte plusieurs types de réponse (HTML, JSON et texte brut)
Ce package est particulièrement précieux lorsqu'il est utilisé avec [`koa-404-handler`](https://github.com/ladjs/koa-404-handler) pour une gestion complète des erreurs dans les applications Koa.

#### passport : Authentification pour Lad {#passport-authentication-for-lad}

[`@ladjs/passport`](https://github.com/ladjs/passport) étend le populaire middleware d'authentification Passport.js avec des améliorations spécifiques pour les applications web modernes. Ce package prend en charge plusieurs stratégies d'authentification prêtes à l'emploi :

* Authentification locale avec email
* Connexion avec Apple
* Authentification GitHub
* Authentification Google
* Authentification par mot de passe à usage unique (OTP)

Le package est hautement personnalisable, permettant aux développeurs d'ajuster les noms de champs et les phrases pour correspondre aux exigences de leur application. Il est conçu pour s'intégrer parfaitement avec Mongoose pour la gestion des utilisateurs, ce qui en fait une solution idéale pour les applications basées sur Koa nécessitant une authentification robuste.

#### graceful : Arrêt élégant de l'application {#graceful-elegant-application-shutdown}

[`@ladjs/graceful`](https://github.com/ladjs/graceful) résout le défi crucial de l'arrêt en douceur des applications Node.js. Avec plus de 70 étoiles sur GitHub, ce package garantit que votre application peut se terminer proprement sans perdre de données ni laisser de connexions ouvertes. Les fonctionnalités clés incluent :

* Support pour la fermeture en douceur des serveurs HTTP (Express/Koa/Fastify)
* Arrêt propre des connexions aux bases de données (MongoDB/Mongoose)
* Fermeture correcte des clients Redis
* Gestion des planificateurs de tâches Bree
* Support pour des gestionnaires d'arrêt personnalisés
* Paramètres de délai configurables
* Intégration avec les systèmes de journalisation

Ce package est essentiel pour les applications en production où des arrêts inattendus pourraient entraîner une perte ou une corruption de données. En mettant en œuvre des procédures d'arrêt appropriées, `@ladjs/graceful` aide à garantir la fiabilité et la stabilité de votre application.

### Upptime : Surveillance de disponibilité open source {#upptime-open-source-uptime-monitoring}

L'[organisation Upptime](https://github.com/upptime) représente notre engagement envers une surveillance transparente et open source. Le dépôt principal [`upptime`](https://github.com/upptime/upptime) compte plus de 13 000 étoiles sur GitHub, ce qui en fait l'un des projets les plus populaires auxquels nous contribuons. Upptime fournit un moniteur de disponibilité et une page de statut alimentés par GitHub qui fonctionnent entièrement sans serveur.

Nous utilisons Upptime pour notre propre page de statut à <https://status.forwardemail.net> avec le code source disponible à <https://github.com/forwardemail/status.forwardemail.net>.

Ce qui rend Upptime spécial, c'est son architecture :

* **100 % Open Source** : Chaque composant est entièrement open source et personnalisable.
* **Alimenté par GitHub** : Exploite GitHub Actions, Issues et Pages pour une solution de surveillance sans serveur.
* **Aucun serveur requis** : Contrairement aux outils de surveillance traditionnels, Upptime ne nécessite pas que vous exécutiez ou mainteniez un serveur.
* **Page de statut automatique** : Génère une belle page de statut pouvant être hébergée sur GitHub Pages.
* **Notifications puissantes** : S'intègre à divers canaux de notification, y compris email, SMS et Slack.

Pour améliorer l'expérience de nos utilisateurs, nous avons intégré [@octokit/core](https://github.com/octokit/core.js/) dans la base de code forwardemail.net afin d'afficher des mises à jour de statut et des incidents en temps réel directement sur notre site web. Cette intégration offre une transparence claire à nos utilisateurs en cas de problèmes sur l'ensemble de notre stack (Site web, API, MongoDB, Redis, SQLite, SMTP, POP3, IMAP, Bree, etc.) avec des notifications toast instantanées, des changements d'icônes de badge, des couleurs d'avertissement, et plus encore.

La bibliothèque @octokit/core nous permet de récupérer des données en temps réel depuis notre dépôt GitHub Upptime, de les traiter et de les afficher de manière conviviale. Lorsqu'un service subit une panne ou une dégradation de performance, les utilisateurs sont immédiatement informés via des indicateurs visuels sans avoir à quitter l'application principale. Cette intégration transparente garantit que nos utilisateurs disposent toujours d'informations à jour sur l'état de notre système, renforçant ainsi la transparence et la confiance.

Upptime a été adopté par des centaines d'organisations cherchant une manière transparente et fiable de surveiller leurs services et de communiquer leur statut aux utilisateurs. Le succès du projet démontre la puissance de la création d'outils qui exploitent l'infrastructure existante (dans ce cas, GitHub) pour résoudre des problèmes courants de manière innovante.
## Nos contributions à l'écosystème Forward Email {#our-contributions-to-the-forward-email-ecosystem}

Alors que nos packages open source sont utilisés par des développeurs du monde entier, ils forment également la base de notre propre service Forward Email. Ce double rôle — en tant que créateurs et utilisateurs de ces outils — nous offre une perspective unique sur leur application réelle et stimule une amélioration continue.

### Des packages à la production {#from-packages-to-production}

Le passage des packages individuels à un système de production cohérent implique une intégration et une extension soigneuses. Pour Forward Email, ce processus comprend :

* **Extensions personnalisées** : Création d'extensions spécifiques à Forward Email pour nos packages open source qui répondent à nos exigences uniques.
* **Modèles d'intégration** : Développement de modèles pour la manière dont ces packages interagissent dans un environnement de production.
* **Optimisations de performance** : Identification et résolution des goulets d'étranglement de performance qui n'apparaissent qu'à grande échelle.
* **Renforcement de la sécurité** : Ajout de couches de sécurité supplémentaires spécifiques à la gestion des emails et à la protection des données utilisateur.

Ce travail représente des milliers d'heures de développement au-delà des packages de base eux-mêmes, aboutissant à un service email robuste et sécurisé qui tire parti du meilleur de nos contributions open source.

### La boucle de rétroaction {#the-feedback-loop}

Peut-être l'aspect le plus précieux de l'utilisation de nos propres packages en production est la boucle de rétroaction qu'elle crée. Lorsque nous rencontrons des limitations ou des cas limites dans Forward Email, nous ne nous contentons pas de les corriger localement — nous améliorons les packages sous-jacents, bénéficiant ainsi à la fois à notre service et à la communauté au sens large.

Cette approche a conduit à de nombreuses améliorations :

* **Arrêt gracieux de Bree** : Le besoin de déploiements sans interruption de Forward Email a conduit à des capacités améliorées d'arrêt gracieux dans Bree.
* **Reconnaissance des motifs du Spam Scanner** : Les motifs de spam rencontrés en conditions réelles dans Forward Email ont informé les algorithmes de détection de Spam Scanner.
* **Optimisations de performance de Cabin** : La journalisation à haut volume en production a révélé des opportunités d'optimisation dans Cabin qui profitent à tous les utilisateurs.

En maintenant ce cycle vertueux entre notre travail open source et le service en production, nous garantissons que nos packages restent des solutions pratiques et éprouvées, plutôt que des implémentations théoriques.


## Les principes fondamentaux de Forward Email : une base pour l'excellence {#forward-emails-core-principles-a-foundation-for-excellence}

Forward Email est conçu selon un ensemble de principes fondamentaux qui guident toutes nos décisions de développement. Ces principes, détaillés sur notre [site web](/blog/docs/best-quantum-safe-encrypted-email-service#principles), garantissent que notre service reste convivial pour les développeurs, sécurisé et axé sur la confidentialité des utilisateurs.

### Toujours convivial pour les développeurs, axé sur la sécurité et transparent {#always-developer-friendly-security-focused-and-transparent}

Notre premier et principal principe est de créer un logiciel convivial pour les développeurs tout en maintenant les normes les plus élevées de sécurité et de confidentialité. Nous croyons que l'excellence technique ne doit jamais se faire au détriment de la facilité d'utilisation, et que la transparence construit la confiance avec notre communauté.

Ce principe se manifeste dans notre documentation détaillée, nos messages d'erreur clairs et notre communication ouverte sur les succès comme sur les défis. En rendant l'ensemble de notre code source ouvert, nous invitons à la critique et à la collaboration, renforçant à la fois notre logiciel et l'écosystème au sens large.

### Respect des principes de développement logiciel éprouvés par le temps {#adherence-to-time-tested-software-development-principles}

Nous suivons plusieurs principes établis de développement logiciel qui ont prouvé leur valeur au fil des décennies :

* **[MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)** : Séparation des préoccupations via le modèle Modèle-Vue-Contrôleur
* **[Philosophie Unix](https://en.wikipedia.org/wiki/Unix_philosophy)** : Création de composants modulaires qui font bien une seule chose
* **[KISS](https://en.wikipedia.org/wiki/KISS_principle)** : Garder les choses simples et directes
* **[DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)** : Ne vous répétez pas, favorisant la réutilisation du code
* **[YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it)** : Vous n'en aurez pas besoin, évitant l'optimisation prématurée
* **[Twelve Factor](https://12factor.net/)** : Suivre les meilleures pratiques pour construire des applications modernes et évolutives
* **[Rasoir d'Occam](https://en.wikipedia.org/wiki/Occam%27s_razor)** : Choisir la solution la plus simple qui répond aux exigences
* **[Dogfooding](https://en.wikipedia.org/wiki/Eating_your_own_dog_food)** : Utiliser largement nos propres produits
Ces principes ne sont pas que des concepts théoriques — ils sont intégrés dans nos pratiques de développement quotidiennes. Par exemple, notre adhésion à la philosophie Unix est évidente dans la façon dont nous avons structuré nos packages npm : des modules petits et ciblés qui peuvent être composés ensemble pour résoudre des problèmes complexes.

### Cibler le développeur débrouillard et autofinancé {#targeting-the-scrappy-bootstrapped-developer}

Nous ciblons spécifiquement le développeur débrouillard, autofinancé et [rentable au ramen](https://www.paulgraham.com/ramenprofitable.html). Ce focus façonne tout, de notre modèle de tarification à nos décisions techniques. Nous comprenons les défis de construire des produits avec des ressources limitées parce que nous sommes passés par là nous-mêmes.

Ce principe est particulièrement important dans notre approche de l’open source. Nous créons et maintenons des packages qui résolvent de vrais problèmes pour les développeurs sans budgets d’entreprise, rendant des outils puissants accessibles à tous, quels que soient leurs moyens.

### Principes en pratique : la base de code de Forward Email {#principles-in-practice-the-forward-email-codebase}

Ces principes sont clairement visibles dans la base de code de Forward Email. Notre fichier package.json révèle une sélection réfléchie de dépendances, chacune choisie pour s’aligner avec nos valeurs fondamentales :

* Des packages axés sur la sécurité comme `mailauth` pour l’authentification des emails
* Des outils conviviaux pour les développeurs comme `preview-email` pour faciliter le débogage
* Des composants modulaires comme les différentes utilitaires `p-*` de Sindre Sorhus

En suivant ces principes de manière cohérente dans le temps, nous avons construit un service auquel les développeurs peuvent faire confiance pour leur infrastructure email — sécurisé, fiable et aligné avec les valeurs de la communauté open source.

### Confidentialité dès la conception {#privacy-by-design}

La confidentialité n’est pas une réflexion après coup ni une fonctionnalité marketing pour Forward Email — c’est un principe fondamental de conception qui informe chaque aspect de notre service et de notre code :

* **Chiffrement zéro accès** : Nous avons mis en place des systèmes qui rendent techniquement impossible pour nous de lire les emails des utilisateurs.
* **Collecte minimale de données** : Nous ne collectons que les données nécessaires pour fournir notre service, rien de plus.
* **Politiques transparentes** : Notre politique de confidentialité est rédigée dans un langage clair et compréhensible, sans jargon juridique.
* **Vérification open source** : Notre base de code open source permet aux chercheurs en sécurité de vérifier nos affirmations en matière de confidentialité.

Cet engagement s’étend à nos packages open source, conçus avec les meilleures pratiques de sécurité et de confidentialité intégrées dès le départ.

### Open source durable {#sustainable-open-source}

Nous croyons que les logiciels open source ont besoin de modèles durables pour prospérer à long terme. Notre approche inclut :

* **Support commercial** : Offrir un support premium et des services autour de nos outils open source.
* **Licences équilibrées** : Utiliser des licences qui protègent à la fois les libertés des utilisateurs et la durabilité du projet.
* **Engagement communautaire** : S’engager activement avec les contributeurs pour construire une communauté solidaire.
* **Feuilles de route transparentes** : Partager nos plans de développement pour permettre aux utilisateurs de planifier en conséquence.

En nous concentrant sur la durabilité, nous assurons que nos contributions open source peuvent continuer à croître et s’améliorer dans le temps plutôt que de tomber dans l’oubli.


## Les chiffres ne mentent pas : nos statistiques impressionnantes de téléchargements npm {#the-numbers-dont-lie-our-staggering-npm-download-statistics}

Quand nous parlons de l’impact des logiciels open source, les statistiques de téléchargement fournissent une mesure tangible de l’adoption et de la confiance. Beaucoup des packages que nous aidons à maintenir ont atteint une échelle que peu de projets open source atteignent, avec des téléchargements combinés se chiffrant en milliards.

![Top npm Packages by Downloads](/img/art/top_packages_bar_chart.svg)

> \[!IMPORTANT]
> Bien que nous soyons fiers d’aider à maintenir plusieurs packages très téléchargés dans l’écosystème JavaScript, nous voulons reconnaître que beaucoup de ces packages ont été initialement créés par d’autres développeurs talentueux. Des packages comme superagent et supertest ont été créés à l’origine par TJ Holowaychuk, dont les contributions prolifiques à l’open source ont été déterminantes dans la formation de l’écosystème Node.js.
### Un aperçu global de notre impact {#a-birds-eye-view-of-our-impact}

En seulement deux mois, de février à mars 2025, les principaux packages auxquels nous contribuons et que nous aidons à maintenir ont enregistré des chiffres de téléchargement impressionnants :

* **[superagent](https://www.npmjs.com/package/superagent)** : 84 575 829 téléchargements\[^7] (créé à l'origine par TJ Holowaychuk)
* **[supertest](https://www.npmjs.com/package/supertest)** : 76 432 591 téléchargements\[^8] (créé à l'origine par TJ Holowaychuk)
* **[koa](https://www.npmjs.com/package/koa)** : 28 539 295 téléchargements\[^34] (créé à l'origine par TJ Holowaychuk)
* **[@koa/router](https://www.npmjs.com/package/@koa/router)** : 11 007 327 téléchargements\[^35]
* **[koa-router](https://www.npmjs.com/package/koa-router)** : 3 498 918 téléchargements\[^36]
* **[url-regex](https://www.npmjs.com/package/url-regex)** : 2 819 520 téléchargements\[^37]
* **[preview-email](https://www.npmjs.com/package/preview-email)** : 2 500 000 téléchargements\[^9]
* **[cabin](https://www.npmjs.com/package/cabin)** : 1 800 000 téléchargements\[^10]
* **[@breejs/later](https://www.npmjs.com/package/@breejs/later)** : 1 709 938 téléchargements\[^38]
* **[email-templates](https://www.npmjs.com/package/email-templates)** : 1 128 139 téléchargements\[^39]
* **[get-paths](https://www.npmjs.com/package/get-paths)** : 1 124 686 téléchargements\[^40]
* **[url-regex-safe](https://www.npmjs.com/package/url-regex-safe)** : 1 200 000 téléchargements\[^11]
* **[dotenv-parse-variables](https://www.npmjs.com/package/dotenv-parse-variables)** : 894 666 téléchargements\[^41]
* **[@koa/multer](https://www.npmjs.com/package/@koa/multer)** : 839 585 téléchargements\[^42]
* **[spamscanner](https://www.npmjs.com/package/spamscanner)** : 145 000 téléchargements\[^12]
* **[bree](https://www.npmjs.com/package/bree)** : 24 270 téléchargements\[^30]

> \[!NOTE]
> Plusieurs autres packages que nous aidons à maintenir mais que nous n'avons pas créés ont des chiffres de téléchargement encore plus élevés, notamment `form-data` (plus de 738 millions de téléchargements), `toidentifier` (plus de 309 millions de téléchargements), `stackframe` (plus de 116 millions de téléchargements) et `error-stack-parser` (plus de 113 millions de téléchargements). Nous sommes honorés de contribuer à ces packages tout en respectant le travail de leurs auteurs originaux.

Ces chiffres ne sont pas seulement impressionnants — ils représentent de vrais développeurs résolvant de vrais problèmes avec du code que nous aidons à maintenir. Chaque téléchargement est une occasion où ces packages ont aidé quelqu’un à construire quelque chose de significatif, des projets amateurs aux applications d’entreprise utilisées par des millions de personnes.

![Package Categories Distribution](/img/art/category_pie_chart.svg)

### Impact quotidien à grande échelle {#daily-impact-at-scale}

Les tendances quotidiennes de téléchargement révèlent une utilisation constante et à fort volume, avec des pics atteignant des millions de téléchargements par jour\[^13]. Cette constance témoigne de la stabilité et de la fiabilité de ces packages — les développeurs ne se contentent pas de les essayer ; ils les intègrent dans leurs flux de travail principaux et en dépendent jour après jour.

Les tendances hebdomadaires de téléchargement montrent des chiffres encore plus impressionnants, oscillant constamment autour de dizaines de millions de téléchargements par semaine\[^14]. Cela représente une empreinte massive dans l’écosystème JavaScript, ces packages étant utilisés en production partout dans le monde.

### Au-delà des chiffres bruts {#beyond-the-raw-numbers}

Bien que les statistiques de téléchargement soient impressionnantes en elles-mêmes, elles racontent une histoire plus profonde sur la confiance que la communauté accorde à ces packages. Maintenir des packages à cette échelle nécessite un engagement sans faille envers :

* **Compatibilité ascendante** : Les changements doivent être soigneusement étudiés pour éviter de casser les implémentations existantes.
* **Sécurité** : Avec des millions d’applications dépendant de ces packages, les vulnérabilités de sécurité pourraient avoir des conséquences majeures.
* **Performance** : À cette échelle, même de petites améliorations de performance peuvent avoir des bénéfices agrégés significatifs.
* **Documentation** : Une documentation claire et complète est essentielle pour des packages utilisés par des développeurs de tous niveaux d’expérience.

La croissance constante des chiffres de téléchargement au fil du temps reflète le succès dans la réalisation de ces engagements, construisant la confiance avec la communauté des développeurs grâce à des packages fiables et bien maintenus.
## Soutenir l'Écosystème : Nos Parrainages Open Source {#supporting-the-ecosystem-our-open-source-sponsorships}

> \[!TIP]
> La durabilité de l'open source ne se limite pas à contribuer du code — il s'agit aussi de soutenir les développeurs qui maintiennent des infrastructures critiques.

Au-delà de nos contributions directes à l'écosystème JavaScript, nous sommes fiers de parrainer des contributeurs majeurs de Node.js dont le travail constitue la base de nombreuses applications modernes. Nos parrainages incluent :

### Andris Reinman : Pionnier de l'Infrastructure Email {#andris-reinman-email-infrastructure-pioneer}

[Andris Reinman](https://github.com/andris9) est le créateur de [Nodemailer](https://github.com/nodemailer/nodemailer), la bibliothèque d'envoi d'emails la plus populaire pour Node.js avec plus de 14 millions de téléchargements hebdomadaires\[^15]. Son travail s'étend à d'autres composants critiques de l'infrastructure email comme [SMTP Server](https://github.com/nodemailer/smtp-server), [Mailparser](https://github.com/nodemailer/mailparser), et [WildDuck](https://github.com/nodemailer/wildduck).

Notre parrainage aide à assurer la maintenance et le développement continus de ces outils essentiels qui alimentent la communication par email pour d'innombrables applications Node.js, y compris notre propre service Forward Email.

### Sindre Sorhus : Maître des Packages Utilitaires {#sindre-sorhus-utility-package-mastermind}

[Sindre Sorhus](https://github.com/sindresorhus) est l'un des contributeurs open source les plus prolifiques de l'écosystème JavaScript, avec plus de 1 000 packages npm à son actif. Ses utilitaires comme [p-map](https://github.com/sindresorhus/p-map), [p-retry](https://github.com/sindresorhus/p-retry), et [is-stream](https://github.com/sindresorhus/is-stream) sont des blocs de construction fondamentaux utilisés dans tout l'écosystème Node.js.

En parrainant le travail de Sindre, nous contribuons à soutenir le développement de ces utilitaires critiques qui rendent le développement JavaScript plus efficace et fiable.

Ces parrainages reflètent notre engagement envers l'écosystème open source au sens large. Nous reconnaissons que notre propre succès repose sur les bases posées par ces contributeurs et d'autres, et nous sommes dédiés à assurer la durabilité de l'ensemble de l'écosystème.


## Découvrir les Vulnérabilités de Sécurité dans l'Écosystème JavaScript {#uncovering-security-vulnerabilities-in-the-javascript-ecosystem}

Notre engagement envers l'open source va au-delà du développement de fonctionnalités pour inclure l'identification et la résolution des vulnérabilités de sécurité qui pourraient affecter des millions de développeurs. Plusieurs de nos contributions les plus significatives à l'écosystème JavaScript concernent la sécurité.

### Le Sauvetage de Koa-Router {#the-koa-router-rescue}

En février 2019, Nick a identifié un problème critique concernant la maintenance du populaire package koa-router. Comme il l'[a rapporté sur Hacker News](https://news.ycombinator.com/item?id=19156707), le package avait été abandonné par son mainteneur original, laissant des vulnérabilités de sécurité non corrigées et la communauté sans mises à jour.

> \[!WARNING]
> Les packages abandonnés avec des vulnérabilités de sécurité représentent des risques importants pour l'ensemble de l'écosystème, surtout lorsqu'ils sont téléchargés des millions de fois chaque semaine.

En réponse, Nick a créé [@koa/router](https://github.com/koajs/router) et a aidé à alerter la communauté sur la situation. Il maintient ce package critique depuis, garantissant que les utilisateurs de Koa disposent d'une solution de routage sécurisée et bien maintenue.

### Résolution des Vulnérabilités ReDoS {#addressing-redos-vulnerabilities}

En 2020, Nick a identifié et corrigé une vulnérabilité critique de type [Regular Expression Denial of Service (ReDoS)](https://en.wikipedia.org/wiki/ReDoS) dans le package largement utilisé `url-regex`. Cette vulnérabilité ([SNYK-JS-URLREGEX-569472](https://security.snyk.io/vuln/SNYK-JS-URLREGEX-569472)) pouvait permettre à des attaquants de provoquer un déni de service en fournissant une entrée spécialement conçue qui causait un retour en arrière catastrophique dans l'expression régulière.

Plutôt que de simplement patcher le package existant, Nick a créé [`url-regex-safe`](https://github.com/spamscanner/url-regex-safe), une implémentation entièrement réécrite qui corrige la vulnérabilité tout en maintenant la compatibilité avec l'API originale. Il a également publié un [article de blog complet](/blog/docs/url-regex-javascript-node-js) expliquant la vulnérabilité et comment la mitiger.
Ce travail montre notre approche de la sécurité : non seulement corriger les problèmes, mais aussi éduquer la communauté et fournir des alternatives robustes qui empêchent des problèmes similaires à l'avenir.

### Plaidoyer pour la sécurité de Node.js et Chromium {#advocating-for-nodejs-and-chromium-security}

Nick a également été actif dans la promotion des améliorations de la sécurité dans l'écosystème plus large. En août 2020, il a identifié un problème de sécurité important dans Node.js lié à la gestion des en-têtes HTTP, qui a été rapporté dans [The Register](https://www.theregister.com/2020/08/18/nodejs_chromium_patch/).

Ce problème, qui provenait d'un correctif dans Chromium, pouvait potentiellement permettre aux attaquants de contourner les mesures de sécurité. Le plaidoyer de Nick a permis de s'assurer que le problème a été traité rapidement, protégeant des millions d'applications Node.js contre une exploitation potentielle.

### Sécurisation de l'infrastructure npm {#securing-npm-infrastructure}

Plus tard ce même mois, Nick a identifié un autre problème critique de sécurité, cette fois dans l'infrastructure email de npm. Comme rapporté dans [The Register](https://www.theregister.com/2020/08/25/nodejs_dmarc_phishing/), npm ne mettait pas correctement en œuvre les protocoles d'authentification email DMARC, SPF et DKIM, permettant potentiellement aux attaquants d'envoyer des emails de phishing semblant provenir de npm.

Le rapport de Nick a conduit à des améliorations dans la posture de sécurité email de npm, protégeant les millions de développeurs qui dépendent de npm pour la gestion des paquets contre les attaques de phishing potentielles.


## Nos contributions à l'écosystème Forward Email {#our-contributions-to-the-forward-email-ecosystem-1}

Forward Email est construit sur plusieurs projets open source critiques, notamment Nodemailer, WildDuck et mailauth. Notre équipe a apporté des contributions significatives à ces projets, aidant à identifier et corriger des problèmes profonds affectant la livraison et la sécurité des emails.

### Amélioration des fonctionnalités principales de Nodemailer {#enhancing-nodemailers-core-functionality}

[Nodemailer](https://github.com/nodemailer/nodemailer) est la colonne vertébrale de l'envoi d'emails dans Node.js, et nos contributions ont aidé à le rendre plus robuste :

* **Améliorations du serveur SMTP** : Nous avons corrigé des bugs d'analyse, des problèmes de gestion des flux et des problèmes de configuration TLS dans le composant serveur SMTP\[^16]\[^17].
* **Améliorations du parseur de mails** : Nous avons résolu des erreurs de décodage de séquences de caractères et des problèmes de parseur d'adresses qui pouvaient causer des échecs dans le traitement des emails\[^18]\[^19].

Ces contributions garantissent que Nodemailer reste une base fiable pour le traitement des emails dans les applications Node.js, y compris Forward Email.

### Avancement de l'authentification email avec Mailauth {#advancing-email-authentication-with-mailauth}

[Mailauth](https://github.com/postalsys/mailauth) fournit des fonctionnalités critiques d'authentification email, et nos contributions ont considérablement amélioré ses capacités :

* **Améliorations de la vérification DKIM** : Nous avons découvert et signalé que X/Twitter avait des problèmes de cache DNS causant des échecs DKIM pour leurs messages sortants, en le rapportant sur Hacker One\[^20].
* **Améliorations DMARC et ARC** : Nous avons corrigé des problèmes avec la vérification DMARC et ARC qui pouvaient entraîner des résultats d'authentification incorrects\[^21]\[^22].
* **Optimisations de performance** : Nous avons contribué à des optimisations qui améliorent la performance des processus d'authentification email\[^23]\[^24]\[^25]\[^26].

Ces améliorations aident à garantir que l'authentification email est précise et fiable, protégeant les utilisateurs contre les attaques de phishing et d'usurpation d'identité.

### Améliorations clés d'Upptime {#key-upptime-enhancements}

Nos contributions à Upptime incluent :

* **Surveillance des certificats SSL** : Nous avons ajouté une fonctionnalité pour surveiller l'expiration des certificats SSL, évitant des interruptions inattendues dues à des certificats expirés\[^27].
* **Support de plusieurs numéros SMS** : Nous avons implémenté le support pour alerter plusieurs membres de l'équipe par SMS lors d'incidents, améliorant les temps de réponse\[^28].
* **Corrections des vérifications IPv6** : Nous avons corrigé des problèmes avec les vérifications de connectivité IPv6, assurant une surveillance plus précise dans les environnements réseau modernes\[^29].
* **Support mode sombre/clair** : Nous avons ajouté le support des thèmes pour améliorer l'expérience utilisateur des pages de statut\[^31].
* **Meilleur support TCP-Ping** : Nous avons amélioré la fonctionnalité de ping TCP pour fournir des tests de connexion plus fiables\[^32].
Ces améliorations bénéficient non seulement à la surveillance de l'état de Forward Email, mais sont également disponibles pour l'ensemble de la communauté des utilisateurs d'Upptime, démontrant notre engagement à améliorer les outils dont nous dépendons.


## Le Liant Qui Tout Relie : Code Personnalisé à Grande Échelle {#the-glue-that-holds-it-all-together-custom-code-at-scale}

Bien que nos packages npm et nos contributions à des projets existants soient importants, c'est le code personnalisé qui intègre ces composants qui met véritablement en valeur notre expertise technique. La base de code de Forward Email représente une décennie d'efforts de développement, remontant à 2017 lorsque le projet a commencé sous le nom de [free-email-forwarding](https://github.com/forwardemail/free-email-forwarding) avant d'être fusionné dans un monorepo.

### Un Effort de Développement Colossal {#a-massive-development-effort}

L'ampleur de ce code d'intégration personnalisé est impressionnante :

* **Contributions Totales** : Plus de 3 217 commits
* **Taille de la Base de Code** : Plus de 421 545 lignes de code réparties entre des fichiers JavaScript, Pug, CSS et JSON\[^33]

Cela représente des milliers d'heures de travail de développement, de sessions de débogage et d'optimisations de performance. C'est la « sauce secrète » qui transforme des packages individuels en un service cohérent et fiable utilisé quotidiennement par des milliers de clients.

### Intégration des Dépendances Principales {#core-dependencies-integration}

La base de code de Forward Email intègre de nombreuses dépendances en un tout homogène :

* **Traitement des Emails** : Intègre Nodemailer pour l'envoi, SMTP Server pour la réception, et Mailparser pour l'analyse
* **Authentification** : Utilise Mailauth pour la vérification DKIM, SPF, DMARC et ARC
* **Résolution DNS** : Exploite Tangerine pour DNS-over-HTTPS avec mise en cache globale
* **Connexion MX** : Utilise mx-connect avec intégration Tangerine pour des connexions fiables aux serveurs mail
* **Planification des Tâches** : Emploie Bree pour un traitement fiable des tâches en arrière-plan avec des threads workers
* **Modèles** : Utilise email-templates pour réutiliser les feuilles de style du site web dans les communications clients
* **Stockage des Emails** : Implémente des boîtes aux lettres SQLite chiffrées individuellement avec better-sqlite3-multiple-ciphers utilisant le chiffrement ChaCha20-Poly1305 pour une confidentialité résistante au quantique, garantissant une isolation complète entre les utilisateurs et que seul l'utilisateur a accès à sa boîte aux lettres

Chacune de ces intégrations nécessite une prise en compte minutieuse des cas limites, des implications de performance et des préoccupations de sécurité. Le résultat est un système robuste qui gère des millions de transactions email de manière fiable. Notre implémentation SQLite utilise également msgpackr pour une sérialisation binaire efficace et WebSockets (via ws) pour des mises à jour de statut en temps réel à travers notre infrastructure.

### Infrastructure DNS avec Tangerine et mx-connect {#dns-infrastructure-with-tangerine-and-mx-connect}

Un composant critique de l'infrastructure de Forward Email est notre système de résolution DNS, construit autour de deux packages clés :

* **[Tangerine](https://github.com/forwardemail/nodejs-dns-over-https-tangerine)** : Notre implémentation Node.js de DNS-over-HTTPS fournit un remplacement direct du résolveur DNS standard, avec des tentatives automatiques, des délais d'attente, une rotation intelligente des serveurs et un support de mise en cache.

* **[mx-connect](https://github.com/zone-eu/mx-connect)** : Ce package établit des connexions TCP aux serveurs MX, prenant un domaine cible ou une adresse email, résolvant les serveurs MX appropriés, et se connectant à eux dans l'ordre de priorité.

Nous avons intégré Tangerine avec mx-connect via la [pull request #4](https://github.com/zone-eu/mx-connect/pull/4), assurant des requêtes DNS sur HTTP au niveau applicatif dans tout Forward Email. Cela fournit une mise en cache DNS globale à grande échelle avec une cohérence 1:1 à travers n'importe quelle région, application ou processus — essentiel pour une livraison fiable des emails dans un système distribué.


## Impact Entreprise : De l'Open Source aux Solutions Critiques pour la Mission {#enterprise-impact-from-open-source-to-mission-critical-solutions}

L'aboutissement de notre parcours de dix ans dans le développement open source a permis à Forward Email de servir non seulement des développeurs individuels mais aussi de grandes entreprises et institutions éducatives qui forment l'épine dorsale du mouvement open source lui-même.
### Études de cas sur l'infrastructure email critique {#case-studies-in-mission-critical-email-infrastructure}

Notre engagement envers la fiabilité, la confidentialité et les principes open source a fait de Forward Email le choix de confiance pour les organisations ayant des exigences email exigeantes :

* **Institutions éducatives** : Comme détaillé dans notre [étude de cas sur le transfert d'email des anciens élèves](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study), de grandes universités s'appuient sur notre infrastructure pour maintenir des liens à vie avec des centaines de milliers d'anciens élèves grâce à des services de transfert d'email fiables.

* **Solutions Linux d'entreprise** : L'[étude de cas sur l'email d'entreprise Canonical Ubuntu](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study) montre comment notre approche open source s'aligne parfaitement avec les besoins des fournisseurs Linux d'entreprise, leur offrant la transparence et le contrôle dont ils ont besoin.

* **Fondations open source** : Peut-être la validation la plus forte est notre partenariat avec la Linux Foundation, comme documenté dans l'[étude de cas sur l'email d'entreprise de la Linux Foundation](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study), où notre service alimente la communication pour l'organisation même qui supervise le développement de Linux.

Il y a une belle symétrie dans la façon dont nos paquets open source, maintenus avec soin pendant de nombreuses années, nous ont permis de construire un service email qui soutient désormais les communautés et organisations qui défendent le logiciel open source. Ce parcours en boucle complète — de la contribution de paquets individuels à l'alimentation d'une infrastructure email de niveau entreprise pour les leaders open source — représente la validation ultime de notre approche du développement logiciel.


## Une décennie d'open source : perspectives {#a-decade-of-open-source-looking-forward}

Alors que nous regardons en arrière sur une décennie de contributions open source et vers les dix prochaines années, nous sommes remplis de gratitude pour la communauté qui a soutenu notre travail et d'enthousiasme pour ce qui est à venir.

Notre parcours, de contributeurs de paquets individuels à mainteneurs d'une infrastructure email complète utilisée par de grandes entreprises et fondations open source, a été remarquable. C'est un témoignage de la puissance du développement open source et de l'impact qu'un logiciel réfléchi et bien maintenu peut avoir sur l'écosystème au sens large.

Dans les années à venir, nous nous engageons à :

* **Continuer à maintenir et améliorer nos paquets existants**, en veillant à ce qu'ils restent des outils fiables pour les développeurs du monde entier.
* **Étendre nos contributions aux projets d'infrastructure critiques**, en particulier dans les domaines de l'email et de la sécurité.
* **Améliorer les capacités de Forward Email** tout en maintenant notre engagement envers la confidentialité, la sécurité et la transparence.
* **Soutenir la prochaine génération de contributeurs open source** par le mentorat, le parrainage et l'engagement communautaire.

Nous croyons que l'avenir du développement logiciel est ouvert, collaboratif et construit sur une base de confiance. En continuant à contribuer des paquets de haute qualité, axés sur la sécurité, à l'écosystème JavaScript, nous espérons jouer un petit rôle dans la construction de cet avenir.

Merci à tous ceux qui ont utilisé nos paquets, contribué à nos projets, signalé des problèmes ou simplement fait connaître notre travail. Votre soutien a rendu possible cette décennie d'impact, et nous sommes impatients de voir ce que nous pourrons accomplir ensemble dans les dix prochaines années.

\[^1]: npm download statistics for cabin, April 2025
\[^2]: npm download statistics for bson-objectid, February-March 2025
\[^3]: npm download statistics for url-regex-safe, April 2025
\[^4]: GitHub stars count for forwardemail/forwardemail.net as of April 2025
\[^5]: npm download statistics for preview-email, April 2025
\[^7]: npm download statistics for superagent, February-March 2025
\[^8]: npm download statistics for supertest, February-March 2025
\[^9]: npm download statistics for preview-email, February-March 2025
\[^10]: npm download statistics for cabin, February-March 2025
\[^11]: npm download statistics for url-regex-safe, February-March 2025
\[^12]: npm download statistics for spamscanner, February-March 2025
\[^13]: Daily download patterns from npm statistics, April 2025
\[^14]: Weekly download patterns from npm statistics, April 2025
\[^15]: npm download statistics for nodemailer, April 2025
\[^16]: <https://github.com/nodemailer/smtp-server/issues/155>
\[^17]: <https://github.com/nodemailer/smtp-server/issues/node-v12-requires-tls-min>
\[^18]: <https://github.com/nodemailer/mailparser/issues/261>
\[^19]: <https://github.com/nodemailer/nodemailer/issues/1102>
\[^20]: <https://github.com/postalsys/mailauth/issues/30>
\[^21]: <https://github.com/postalsys/mailauth/issues/58>
\[^22]: <https://github.com/postalsys/mailauth/issues/48>
\[^23]: <https://github.com/postalsys/mailauth/issues/74>
\[^24]: <https://github.com/postalsys/mailauth/issues/75>
\[^25]: <https://github.com/postalsys/mailauth/issues/60>
\[^26]: <https://github.com/postalsys/mailauth/issues/73>
\[^27]: Based on GitHub issues in the Upptime repository
\[^28]: Based on GitHub issues in the Upptime repository
\[^29]: Based on GitHub issues in the Upptime repository
\[^30]: npm download statistics for bree, February-March 2025
\[^31]: Based on GitHub pull requests to Upptime
\[^32]: Based on GitHub pull requests to Upptime
\[^34]: npm download statistics for koa, February-March 2025
\[^35]: npm download statistics for @koa/router, February-March 2025
\[^36]: npm download statistics for koa-router, February-March 2025
\[^37]: npm download statistics for url-regex, February-March 2025
\[^38]: npm download statistics for @breejs/later, February-March 2025
\[^39]: npm download statistics for email-templates, February-March 2025
\[^40]: npm download statistics for get-paths, February-March 2025
\[^41]: npm download statistics for dotenv-parse-variables, February-March 2025
\[^42]: npm download statistics for @koa/multer, February-March 2025
