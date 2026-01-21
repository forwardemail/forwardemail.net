# Une décennie d'impact : comment nos packages npm ont atteint 1 milliard de téléchargements et façonné JavaScript {#a-decade-of-impact-how-our-npm-packages-hit-1-billion-downloads-and-shaped-javascript}

<img loading="lazy" src="/img/articles/npm.webp" alt="NPM packages billion downloads ecosystem" class="rounded-lg" />

## Table des matières {#table-of-contents}

* [Avant-propos](#foreword)
* [Les pionniers qui nous font confiance : Isaac Z. Schlueter et Forward Email](#the-pioneers-who-trust-us-isaac-z-schlueter-and-forward-email)
  * [De la création de npm à la direction de Node.js](#from-npms-creation-to-nodejs-leadership)
* [L'architecte derrière le code : le parcours de Nick Baugh](#the-architect-behind-the-code-nick-baughs-journey)
  * [Comité technique Express et contributions principales](#express-technical-committee-and-core-contributions)
  * [Contributions au cadre Koa](#koa-framework-contributions)
  * [De contributeur individuel à leader d'organisation](#from-individual-contributor-to-organization-leader)
* [Nos organisations GitHub : des écosystèmes d'innovation](#our-github-organizations-ecosystems-of-innovation)
  * [Cabin : journalisation structurée pour applications modernes](#cabin-structured-logging-for-modern-applications)
  * [Scanner de spam : lutte contre les abus par e-mail](#spam-scanner-fighting-email-abuse)
  * [Bree : planification moderne des tâches avec threads de travail](#bree-modern-job-scheduling-with-worker-threads)
  * [Transférer un e-mail : infrastructure de messagerie open source](#forward-email-open-source-email-infrastructure)
  * [Lad : Utilitaires et outils Koa essentiels](#lad-essential-koa-utilities-and-tools)
  * [Upptime : surveillance de la disponibilité open source](#upptime-open-source-uptime-monitoring)
* [Nos contributions à l'écosystème Forward Email](#our-contributions-to-the-forward-email-ecosystem)
  * [Des packages à la production](#from-packages-to-production)
  * [La boucle de rétroaction](#the-feedback-loop)
* [Principes fondamentaux de Forward Email : une base pour l'excellence](#forward-emails-core-principles-a-foundation-for-excellence)
  * [Toujours convivial pour les développeurs, axé sur la sécurité et transparent](#always-developer-friendly-security-focused-and-transparent)
  * [Adhésion aux principes éprouvés de développement de logiciels](#adherence-to-time-tested-software-development-principles)
  * [Cibler les développeurs courageux et autonomes](#targeting-the-scrappy-bootstrapped-developer)
  * [Principes en pratique : la base de code des e-mails de transfert](#principles-in-practice-the-forward-email-codebase)
  * [Confidentialité dès la conception](#privacy-by-design)
  * [Open Source durable](#sustainable-open-source)
* [Les chiffres ne mentent pas : nos statistiques de téléchargement stupéfiantes sur npm](#the-numbers-dont-lie-our-staggering-npm-download-statistics)
  * [Une vue d'ensemble de notre impact](#a-birds-eye-view-of-our-impact)
  * [Impact quotidien à grande échelle](#daily-impact-at-scale)
  * [Au-delà des chiffres bruts](#beyond-the-raw-numbers)
* [Soutenir l'écosystème : nos parrainages Open Source](#supporting-the-ecosystem-our-open-source-sponsorships)
  * [Andris Reinman : pionnier de l'infrastructure de messagerie électronique](#andris-reinman-email-infrastructure-pioneer)
  * [Sindre Sorhus : le cerveau du package utilitaire](#sindre-sorhus-utility-package-mastermind)
* [Découverte des vulnérabilités de sécurité dans l'écosystème JavaScript](#uncovering-security-vulnerabilities-in-the-javascript-ecosystem)
  * [Le sauvetage du Koa-Router](#the-koa-router-rescue)
  * [Traitement des vulnérabilités ReDoS](#addressing-redos-vulnerabilities)
  * [Plaidoyer pour la sécurité de Node.js et Chromium](#advocating-for-nodejs-and-chromium-security)
  * [Sécurisation de l'infrastructure npm](#securing-npm-infrastructure)
* [Nos contributions à l'écosystème Forward Email](#our-contributions-to-the-forward-email-ecosystem-1)
  * [Amélioration des fonctionnalités principales de Nodemailer](#enhancing-nodemailers-core-functionality)
  * [Amélioration de l'authentification des e-mails avec Mailauth](#advancing-email-authentication-with-mailauth)
  * [Améliorations clés du temps de disponibilité](#key-upptime-enhancements)
* [La colle qui maintient tout ensemble : du code personnalisé à grande échelle](#the-glue-that-holds-it-all-together-custom-code-at-scale)
  * [Un effort de développement massif](#a-massive-development-effort)
  * [Intégration des dépendances principales](#core-dependencies-integration)
  * [Infrastructure DNS avec Tangerine et mx-connect](#dns-infrastructure-with-tangerine-and-mx-connect)
* [Impact sur l'entreprise : de l'open source aux solutions critiques](#enterprise-impact-from-open-source-to-mission-critical-solutions)
  * [Études de cas sur les infrastructures de messagerie électronique critiques](#case-studies-in-mission-critical-email-infrastructure)
* [Une décennie d'Open Source : Perspectives d'avenir](#a-decade-of-open-source-looking-forward)

## Avant-propos {#foreword}

Dans l'univers [JavaScript](https://en.wikipedia.org/wiki/JavaScript) et [Node.js](https://en.wikipedia.org/wiki/Node.js), certains packages sont essentiels : téléchargés des millions de fois par jour et propulsant des applications dans le monde entier. Derrière ces outils se cachent des développeurs soucieux de la qualité open source. Aujourd'hui, nous vous montrons comment notre équipe contribue à la création et à la maintenance de packages npm devenus des éléments clés de l'écosystème JavaScript.

## Les pionniers qui nous font confiance : Isaac Z. Schlueter et Forward Email {#the-pioneers-who-trust-us-isaac-z-schlueter-and-forward-email}

Nous sommes fiers d'avoir [Isaac Z. Schlueter](https://izs.me/) ([GitHub : Isaacs](https://github.com/isaacs)) comme utilisateur. Isaac a créé [npm](https://en.wikipedia.org/wiki/Npm_\(software\) et a contribué à la création de [Node.js](https://en.wikipedia.org/wiki/Node.js). Sa confiance en Forward Email témoigne de notre souci de qualité et de sécurité. Isaac utilise Forward Email pour plusieurs domaines, dont izs.me.

L'influence d'Isaac sur JavaScript est considérable. En 2009, il fut parmi les premiers à percevoir le potentiel de Node.js, en collaborant avec [Ryan Dahl](https://en.wikipedia.org/wiki/Ryan_Dahl), créateur de la plateforme. Comme l'a déclaré Isaac dans un [entretien avec le magazine Increment](https://increment.com/development/interview-with-isaac-z-schlueter-ceo-of-npm/) : « Au sein de cette toute petite communauté de personnes cherchant à comprendre comment concrétiser le JavaScript côté serveur, Ryan Dahl a lancé Node, qui était clairement la bonne approche. J'ai investi dans ce projet et je me suis fortement impliqué vers le milieu de l'année 2009. »

> \[!NOTE]
> Pour ceux qui s'intéressent à l'histoire de Node.js, d'excellents documentaires retracent son développement, notamment [L'histoire de Node.js](https://www.youtube.com/watch?v=LB8KwiiUGy0) et [10 choses que je regrette à propos de Node.js - Ryan Dahl](https://www.youtube.com/watch?v=jo_B4LTHi3I). [site web personnel](https://tinyclouds.org/) de Ryan Dahl offre également de précieux aperçus de son travail.

### De la création de npm à la direction de Node.js {#from-npms-creation-to-nodejs-leadership}

Isaac a créé npm en septembre 2009, et la première version utilisable a été publiée début 2010. Ce gestionnaire de paquets répondait à un besoin essentiel de Node.js : il permettait aux développeurs de partager et de réutiliser facilement du code. Selon [Page Wikipédia de Node.js](https://en.wikipedia.org/wiki/Node.js), « En janvier 2010, un gestionnaire de paquets appelé npm a été introduit pour l'environnement Node.js. Ce gestionnaire permet aux programmeurs de publier et de partager des paquets Node.js, ainsi que leur code source, et est conçu pour simplifier l'installation, la mise à jour et la désinstallation des paquets. »

Lorsque Ryan Dahl a quitté Node.js en janvier 2012, Isaac a pris la tête du projet. Comme indiqué sur [his résumé](https://izs.me/resume), il a « dirigé le développement de plusieurs API fondamentales de Node.js, notamment le système de modules CommonJS, les API du système de fichiers et les flux » et « assuré le rôle de BDFL (Dictateur Bienveillant à Vie) du projet pendant deux ans, garantissant une qualité et une fiabilité constantes du processus de développement pour les versions Node.js v0.6 à v0.10 ».

Isaac a guidé Node.js à travers une période de croissance clé, établissant des normes qui façonnent encore la plateforme aujourd'hui. Il a ensuite créé npm, Inc. en 2014 pour soutenir le registre npm, qu'il avait auparavant géré seul.

Nous remercions Isaac pour son immense contribution à JavaScript et continuons d'utiliser les nombreux packages qu'il a créés. Son travail a révolutionné notre façon de développer des logiciels et la manière dont des millions de développeurs partagent leur code à travers le monde.

## L'architecte derrière le code : le parcours de Nick Baugh {#the-architect-behind-the-code-nick-baughs-journey}

Au cœur de notre réussite open source se trouve Nick Baugh, fondateur et propriétaire de Forward Email. Son expérience en JavaScript s'étend sur près de 20 ans et a façonné la manière dont de nombreux développeurs créent des applications. Son parcours open source témoigne à la fois de ses compétences techniques et de son leadership communautaire.

### Comité technique express et contributions principales {#express-technical-committee-and-core-contributions}

L'expertise de Nick en matière de frameworks web lui a valu une place sur [Comité technique Express](https://expressjs.com/en/resources/community.html), où il a contribué au développement de l'un des frameworks Node.js les plus utilisés. Nick est désormais répertorié comme membre inactif sur [Page communautaire Express](https://expressjs.com/en/resources/community.html).

> \[!IMPORTANT]
> Express a été créé à l'origine par TJ Holowaychuk, un contributeur open source prolifique qui a façonné une grande partie de l'écosystème Node.js. Nous sommes reconnaissants envers TJ pour son travail fondateur et respectons son [décision de faire une pause](https://news.ycombinator.com/item?id=37687017) issu de ses nombreuses contributions open source.

En tant que membre de [Comité technique Express](https://expressjs.com/en/resources/community.html), Nick a fait preuve d'une grande attention aux détails dans des problèmes tels que la clarification de la documentation de `req.originalUrl` et la résolution des problèmes de gestion des formulaires en plusieurs parties.

Contributions du framework Koa {#koa-framework-contributions}

Le travail de Nick sur [Cadre Koa](https://github.com/koajs/koa), une alternative moderne et plus légère à Express, également créée par TJ Holowaychuk, témoigne de son engagement envers de meilleurs outils de développement web. Ses contributions à Koa incluent à la fois des problèmes et du code via des pull requests, la gestion des erreurs, la gestion des types de contenu et l'amélioration de la documentation.

Son travail chez Express et Koa lui donne une vision unique du développement Web Node.js, aidant notre équipe à créer des packages qui fonctionnent bien avec plusieurs écosystèmes de frameworks.

### Du contributeur individuel au responsable de l'organisation {#from-individual-contributor-to-organization-leader}

Ce qui a commencé par aider des projets existants s'est transformé en création et maintenance d'écosystèmes de packages complets. Nick a fondé plusieurs organisations GitHub, dont [Cabine](https://github.com/cabinjs), [Scanner de spam](https://github.com/spamscanner), [Transférer un e-mail](https://github.com/forwardemail), [Garçon](https://github.com/ladjs) et [Bree](https://github.com/breejs), chacune répondant à des besoins spécifiques de la communauté JavaScript.

Ce passage du statut de contributeur à celui de leader illustre la vision de Nick : des logiciels bien conçus qui résolvent des problèmes concrets. En organisant des packages connexes au sein d'organisations GitHub dédiées, il a créé des écosystèmes d'outils qui fonctionnent ensemble tout en restant modulaires et flexibles pour l'ensemble de la communauté des développeurs.

## Nos organisations GitHub : Écosystèmes d'innovation {#our-github-organizations-ecosystems-of-innovation}

Nous organisons notre travail open source autour d'organisations GitHub dédiées, chacune répondant à des besoins spécifiques en JavaScript. Cette structure crée des familles de packages cohérentes qui fonctionnent bien ensemble tout en restant modulaires.

### Cabine : journalisation structurée pour les applications modernes {#cabin-structured-logging-for-modern-applications}

Le package [Organisation de la cabine](https://github.com/cabinjs) est notre solution de journalisation d'applications simple et performante. Le package principal [`cabin`](https://github.com/cabinjs/cabin) compte près de 900 étoiles GitHub et plus de 100 000 téléchargements hebdomadaires. Cabin propose une journalisation structurée compatible avec des services populaires comme Sentry, LogDNA et Papertrail.

La particularité de Cabin réside dans son système d'API et de plugins bien pensé. Des packages comme [`axe`](https://github.com/cabinjs/axe) pour le middleware Express et [`parse-request`](https://github.com/cabinjs/parse-request) pour l'analyse des requêtes HTTP témoignent de notre engagement envers des solutions complètes plutôt que des outils isolés.

Le package [`bson-objectid`](https://github.com/cabinjs/bson-objectid) mérite une mention spéciale, avec plus de 1,7 million de téléchargements en seulement deux mois\[^2]. Cette implémentation légère d'ObjectID MongoDB est devenue la référence pour les développeurs ayant besoin d'ID sans dépendances MongoDB complètes.

### Scanner de spam : lutte contre les abus de courrier électronique {#spam-scanner-fighting-email-abuse}

Le package [Organisation du scanner de spam](https://github.com/spamscanner) témoigne de notre engagement à résoudre les problèmes concrets. Le package principal [`spamscanner`](https://github.com/spamscanner/spamscanner) offre une détection avancée du spam, mais c'est le package [`url-regex-safe`](https://github.com/spamscanner/url-regex-safe) qui connaît un succès remarquable.

Avec plus de 1,2 million de téléchargements en deux mois, `url-regex-safe` corrige des failles de sécurité critiques dans d'autres expressions régulières de détection d'URL. Ce package illustre notre approche de l'open source : identifier un problème courant (ici, les vulnérabilités de [RedoS](https://en.wikipedia.org/wiki/ReDoS) dans la validation d'URL), créer une solution fiable et la maintenir à jour.

### Bree : planification de tâches moderne avec threads de travail {#bree-modern-job-scheduling-with-worker-threads}

Le package [Organisation de Bree](https://github.com/breejs) est notre réponse à un défi courant de Node.js : la planification fiable des tâches. Le package principal [`bree`](https://github.com/breejs/bree), avec plus de 3 100 étoiles GitHub, fournit un planificateur de tâches moderne utilisant les threads de travail Node.js pour des performances et une fiabilité accrues.

> \[!NOTE]
> Bree a été créé après que nous ayons contribué à la maintenance de [Ordre du jour](https://github.com/agenda/agenda), en appliquant les leçons apprises pour concevoir un meilleur planificateur de tâches. Nos contributions à Agenda nous ont aidés à trouver des solutions pour améliorer la planification des tâches.

Ce qui différencie Bree des autres planificateurs comme Agenda :

* **Aucune dépendance externe** : Contrairement à Agenda qui nécessite MongoDB, Bree ne nécessite ni Redis ni MongoDB pour gérer l'état des tâches.
* **Threads de travail** : Bree utilise les threads de travail Node.js pour les processus sandboxés, offrant ainsi une meilleure isolation et de meilleures performances.
* **API simple** : Bree offre un contrôle détaillé et simple, facilitant ainsi la mise en œuvre de besoins de planification complexes.
* **Support intégré** : Des fonctionnalités telles que le rechargement progressif, les tâches cron, les dates et les heures conviviales sont incluses par défaut.

Bree est un élément clé de [forwardemail.net](https://github.com/forwardemail/forwardemail.net), gérant des tâches d'arrière-plan critiques comme le traitement des e-mails, le nettoyage et la maintenance planifiée. L'utilisation de Bree dans Forward Email témoigne de notre engagement à utiliser nos propres outils en production, garantissant ainsi leur fiabilité.

Nous utilisons et apprécions également d'autres excellents packages de threads de travail comme [piscine](https://github.com/piscinajs/piscina) et des clients HTTP comme [onze](https://github.com/nodejs/undici). Piscina, comme Bree, utilise les threads de travail Node.js pour un traitement efficace des tâches. Nous remercions [Matthieu Hill](https://github.com/mcollina), qui maintient undici et piscina, pour ses contributions majeures à Node.js. Matteo siège au comité de pilotage technique de Node.js et a grandement amélioré les fonctionnalités des clients HTTP.

### Transférer un e-mail : Infrastructure de messagerie open source {#forward-email-open-source-email-infrastructure}

Notre projet le plus ambitieux est [Transférer un e-mail](https://github.com/forwardemail), un service de messagerie open source offrant des services de transfert, de stockage et d'API. Le dépôt principal compte plus de 1 100 étoiles GitHub\[^4], ce qui témoigne de l'appréciation de la communauté pour cette alternative aux services de messagerie propriétaires.

Le package [`preview-email`](https://github.com/forwardemail/preview-email) de cette organisation, avec plus de 2,5 millions de téléchargements en deux mois[^5], est devenu un outil essentiel pour les développeurs travaillant avec des modèles d'e-mails. En offrant un moyen simple de prévisualiser les e-mails pendant le développement, il résout un problème courant dans la création d'applications de messagerie.

### Lad : Utilitaires et outils Koa essentiels {#lad-essential-koa-utilities-and-tools}

[Organisation des garçons](https://github.com/ladjs) propose un ensemble d'utilitaires et d'outils essentiels, principalement destinés à améliorer l'écosystème du framework Koa. Ces packages résolvent les problèmes courants du développement web et sont conçus pour fonctionner ensemble de manière transparente tout en restant utiles indépendamment.

#### koa-better-error-handler : gestion des erreurs améliorée pour Koa {#koa-better-error-handler-improved-error-handling-for-koa}

[`koa-better-error-handler`](https://github.com/ladjs/koa-better-error-handler) offre une meilleure solution de gestion des erreurs pour les applications Koa. Avec plus de 50 étoiles GitHub, ce package permet à `ctx.throw` de générer des messages d'erreur conviviaux tout en corrigeant plusieurs limitations du gestionnaire d'erreurs intégré de Koa :

* Détecte et gère correctement les erreurs DNS Node.js, Mongoose et Redis
* Utilise [Boom](https://github.com/hapijs/boom) pour créer des réponses d'erreur cohérentes et correctement formatées
* Préserve les en-têtes (contrairement au gestionnaire intégré de Koa)
* Conserve les codes d'état appropriés plutôt que la valeur par défaut de 500
* Prend en charge les messages Flash et la préservation de session
* Fournit des listes d'erreurs HTML pour les erreurs de validation
* Prend en charge plusieurs types de réponses (HTML, JSON et texte brut)

Ce package est particulièrement utile lorsqu'il est utilisé avec [`koa-404-handler`](https://github.com/ladjs/koa-404-handler) pour une gestion complète des erreurs dans les applications Koa.

Passeport #### : Authentification pour Lad {#passport-authentication-for-lad}

[`@ladjs/passport`](https://github.com/ladjs/passport) étend le middleware d'authentification populaire Passport.js avec des améliorations spécifiques pour les applications web modernes. Ce package prend en charge plusieurs stratégies d'authentification prêtes à l'emploi :

* Authentification locale par e-mail
* Connexion avec Apple
* Authentification GitHub
* Authentification Google
* Authentification par mot de passe à usage unique (OTP)

Le package est hautement personnalisable, permettant aux développeurs d'adapter les noms et expressions de champs aux besoins de leur application. Conçu pour s'intégrer parfaitement à Mongoose pour la gestion des utilisateurs, il constitue une solution idéale pour les applications basées sur Koa nécessitant une authentification robuste.

#### gracieux : arrêt élégant de l'application {#graceful-elegant-application-shutdown}

[`@ladjs/graceful`](https://github.com/ladjs/graceful) résout le défi crucial de l'arrêt correct des applications Node.js. Avec plus de 70 étoiles GitHub, ce package garantit l'arrêt correct de votre application sans perte de données ni interruption de connexion. Ses principales fonctionnalités incluent :

* Prise en charge de la fermeture progressive des serveurs HTTP (Express/Koa/Fastify)
* Fermeture propre des connexions aux bases de données (MongoDB/Mongoose)
* Fermeture correcte des clients Redis
* Gestion des planificateurs de tâches Bree
* Prise en charge des gestionnaires d'arrêt personnalisés
* Paramètres de délai d'expiration configurables
* Intégration aux systèmes de journalisation

Ce package est essentiel pour les applications de production où des arrêts inattendus peuvent entraîner une perte ou une corruption de données. En mettant en œuvre des procédures d'arrêt appropriées, `@ladjs/graceful` garantit la fiabilité et la stabilité de votre application.

### Upptime : surveillance de la disponibilité Open Source {#upptime-open-source-uptime-monitoring}

Le dépôt [Organisation Upptime](https://github.com/upptime) représente notre engagement en faveur d'une surveillance transparente et open source. Le dépôt principal [`upptime`](https://github.com/upptime/upptime) compte plus de 13 000 étoiles GitHub, ce qui en fait l'un des projets les plus populaires auxquels nous contribuons. Upptime fournit un outil de surveillance de la disponibilité et une page d'état optimisés par GitHub, fonctionnant entièrement sans serveur.

Nous utilisons Upptime pour notre propre page d'état à <https://status.forwardemail.net> avec le code source disponible à <https://github.com/forwardemail/status.forwardemail.net>.

Ce qui rend Upptime spécial, c'est son architecture :

* **100 % Open Source** : Chaque composant est entièrement open source et personnalisable.
* **Propulsé par GitHub** : Exploite les actions, les problèmes et les pages GitHub pour une solution de surveillance sans serveur.
* **Aucun serveur requis** : Contrairement aux outils de surveillance traditionnels, Upptime ne nécessite ni l'exécution ni la maintenance d'un serveur.
* **Page d'état automatique** : Génère une page d'état attrayante pouvant être hébergée sur les pages GitHub.
* **Notifications puissantes** : S'intègre à divers canaux de notification, notamment les e-mails, les SMS et Slack.

Afin d'améliorer l'expérience utilisateur, nous avons intégré [@octokit/core](https://github.com/octokit/core.js/) au code source de forwardemail.net afin d'afficher les mises à jour de statut et les incidents en temps réel directement sur notre site web. Cette intégration offre une transparence totale à nos utilisateurs en cas de problème sur l'ensemble de notre plateforme (site web, API, MongoDB, Redis, SQLite, SMTP, POP3, IMAP, Bree, etc.) avec des notifications instantanées, des changements d'icônes de badge, des couleurs d'avertissement, etc.

La bibliothèque @octokit/core nous permet de récupérer des données en temps réel depuis notre dépôt GitHub Upptime, de les traiter et de les afficher de manière intuitive. En cas de panne ou de dégradation des performances d'un service, les utilisateurs sont immédiatement avertis par des indicateurs visuels, sans avoir à quitter l'application principale. Cette intégration transparente garantit à nos utilisateurs des informations toujours à jour sur l'état de notre système, renforçant ainsi la transparence et la confiance.

Upptime a été adopté par des centaines d'organisations à la recherche d'un moyen transparent et fiable de surveiller leurs services et de communiquer leur statut aux utilisateurs. Le succès du projet démontre la puissance des outils qui exploitent l'infrastructure existante (en l'occurrence, GitHub) pour résoudre des problèmes courants de manière innovante.

## Nos contributions à l'écosystème de transfert de courrier électronique {#our-contributions-to-the-forward-email-ecosystem}

Si nos packages open source sont utilisés par des développeurs du monde entier, ils constituent également la base de notre propre service de transfert d'e-mails. Ce double rôle – à la fois créateur et utilisateur de ces outils – nous offre une perspective unique sur leur application concrète et favorise une amélioration continue.

### Des packages à la production {#from-packages-to-production}

Le passage d'un package individuel à un système de production cohérent nécessite une intégration et une extension minutieuses. Pour le transfert d'e-mails, ce processus comprend :

* **Extensions personnalisées** : Développement d'extensions spécifiques à la messagerie électronique pour nos packages open source, répondant à nos exigences spécifiques.
* **Modèles d'intégration** : Développement de modèles d'interaction entre ces packages dans un environnement de production.
* **Optimisations des performances** : Identification et résolution des goulots d'étranglement des performances qui n'apparaissent qu'à grande échelle.
* **Renforcement de la sécurité** : Ajout de couches de sécurité supplémentaires spécifiques à la gestion des e-mails et à la protection des données utilisateur.

Ce travail représente des milliers d'heures de développement au-delà des packages de base eux-mêmes, ce qui donne lieu à un service de messagerie électronique robuste et sécurisé qui exploite le meilleur de nos contributions open source.

### La boucle de rétroaction {#the-feedback-loop}

L'avantage le plus important de l'utilisation de nos propres packages en production est sans doute la boucle de rétroaction qu'elle crée. Lorsque nous rencontrons des limitations ou des cas limites dans Forward Email, nous ne nous contentons pas de les corriger localement : nous améliorons les packages sous-jacents, ce qui profite à la fois à notre service et à la communauté au sens large.

Cette approche a conduit à de nombreuses améliorations :

* **Arrêt progressif de Bree** : Le besoin de déploiements sans interruption de service de Forward Email a conduit à l'amélioration des capacités d'arrêt progressif de Bree.
* **Reconnaissance des modèles de Spam Scanner** : Les modèles de spam réels rencontrés dans Forward Email ont influencé les algorithmes de détection de Spam Scanner.
* **Optimisations des performances de Cabin** : La journalisation à volume élevé en production a révélé des opportunités d'optimisation dans Cabin qui profitent à tous les utilisateurs.

En maintenant ce cercle vertueux entre notre travail open source et notre service de production, nous garantissons que nos packages restent des solutions pratiques et testées au combat plutôt que des implémentations théoriques.

## Principes fondamentaux du transfert d'e-mails : une base pour l'excellence {#forward-emails-core-principles-a-foundation-for-excellence}

Forward Email est conçu selon un ensemble de principes fondamentaux qui guident toutes nos décisions de développement. Ces principes, détaillés dans notre [site web](/blog/docs/best-quantum-safe-encrypted-email-service#principles), garantissent que notre service reste convivial, sécurisé et respectueux de la vie privée des utilisateurs.

### Toujours convivial pour les développeurs, axé sur la sécurité et transparent {#always-developer-friendly-security-focused-and-transparent}

Notre principe premier est de créer des logiciels conviviaux pour les développeurs, tout en garantissant les normes de sécurité et de confidentialité les plus strictes. Nous sommes convaincus que l'excellence technique ne doit jamais se faire au détriment de la convivialité, et que la transparence renforce la confiance au sein de notre communauté.

Ce principe se reflète dans notre documentation détaillée, nos messages d'erreur clairs et notre communication ouverte sur les réussites et les difficultés. En rendant l'intégralité de notre code source open source, nous encourageons l'analyse et la collaboration, renforçant ainsi nos logiciels et l'écosystème au sens large.

### Adhésion aux principes de développement logiciel éprouvés {#adherence-to-time-tested-software-development-principles}

Nous suivons plusieurs principes de développement logiciel établis qui ont prouvé leur valeur au fil des décennies :

* **[MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)** : Séparation des préoccupations grâce au modèle Modèle-Vue-Contrôleur
* **[Philosophie Unix](https://en.wikipedia.org/wiki/Unix_philosophy)** : Création de composants modulaires performants
* **[KISS](https://en.wikipedia.org/wiki/KISS_principle)** : Simplicité et accessibilité
* **[DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)** : Éviter les répétitions, favoriser la réutilisation du code
* **[YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it)** : Inutile, éviter les optimisations prématurées
* **[Facteur douze](https://12factor.net/)** : Suivre les bonnes pratiques pour créer des applications modernes et évolutives
* **[Le rasoir d'Occam](https://en.wikipedia.org/wiki/Occam%27s_razor)** : Choisir la solution la plus simple et la plus adaptée aux besoins
* **[Alimentation pour chiens](https://en.wikipedia.org/wiki/Eating_your_own_dog_food)** : Utiliser largement nos propres produits

Ces principes ne sont pas que des concepts théoriques : ils sont ancrés dans nos pratiques de développement quotidiennes. Par exemple, notre adhésion à la philosophie Unix se reflète dans la structure de nos packages npm : de petits modules ciblés, qui peuvent être assemblés pour résoudre des problèmes complexes.

### Cibler le développeur décousu et autodidacte {#targeting-the-scrappy-bootstrapped-developer}

Nous ciblons spécifiquement les développeurs à la recherche de solutions rapides, auto-suffisantes et [ramen-rentable](https://www.paulgraham.com/ramenprofitable.html). Cette approche influence tout, de notre modèle tarifaire à nos décisions techniques. Nous comprenons les défis liés au développement de produits avec des ressources limitées, car nous sommes passés par là.

Ce principe est particulièrement important dans notre approche de l'open source. Nous créons et maintenons des packages qui résolvent des problèmes concrets pour les développeurs sans budget d'entreprise, rendant ainsi des outils puissants accessibles à tous, quelles que soient leurs ressources.

### Principes en pratique : la base de code du courrier électronique de transfert {#principles-in-practice-the-forward-email-codebase}

Ces principes sont clairement visibles dans le code source de Forward Email. Notre fichier package.json présente une sélection judicieuse de dépendances, chacune choisie en accord avec nos valeurs fondamentales :

* Des packages axés sur la sécurité, comme `mailauth` pour l'authentification des e-mails
* Des outils conviviaux pour les développeurs, comme `preview-email`, pour un débogage simplifié
* Des composants modulaires, comme les différents utilitaires `p-*` de Sindre Sorhus

En suivant ces principes de manière cohérente au fil du temps, nous avons créé un service auquel les développeurs peuvent faire confiance avec leur infrastructure de messagerie : sécurisé, fiable et aligné sur les valeurs de la communauté open source.

### Confidentialité dès la conception {#privacy-by-design}

La confidentialité n'est pas une réflexion après coup ou une fonctionnalité marketing pour Forward Email : c'est un principe de conception fondamental qui informe chaque aspect de notre service et de notre code :

* **Chiffrement à accès nul** : Nous avons mis en place des systèmes qui nous empêchent techniquement de lire les e-mails des utilisateurs.
* **Collecte minimale de données** : Nous collectons uniquement les données nécessaires à la fourniture de notre service, rien de plus.
* **Politiques transparentes** : Notre politique de confidentialité est rédigée dans un langage clair et compréhensible, sans jargon juridique.
* **Vérification open source** : Notre code source open source permet aux chercheurs en sécurité de vérifier nos déclarations de confidentialité.

Cet engagement s’étend à nos packages open source, qui sont conçus avec les meilleures pratiques de sécurité et de confidentialité intégrées dès le départ.

### Open Source durable {#sustainable-open-source}

Nous pensons que les logiciels libres ont besoin de modèles durables pour prospérer à long terme. Notre approche comprend :

* **Support commercial** : Proposer un support et des services premium autour de nos outils open source.
* **Licences équilibrées** : Utiliser des licences qui protègent à la fois les libertés des utilisateurs et la pérennité du projet.
* **Engagement communautaire** : Collaborer activement avec les contributeurs pour bâtir une communauté solidaire.
* **Feuilles de route transparentes** : Partager nos plans de développement pour permettre aux utilisateurs de planifier en conséquence.

En mettant l’accent sur la durabilité, nous garantissons que nos contributions open source peuvent continuer à croître et à s’améliorer au fil du temps plutôt que de tomber dans la négligence.

## Les chiffres ne mentent pas : nos statistiques de téléchargement npm stupéfiantes {#the-numbers-dont-lie-our-staggering-npm-download-statistics}

Lorsqu'on parle de l'impact des logiciels open source, les statistiques de téléchargement fournissent une mesure tangible de leur adoption et de la confiance qu'ils inspirent. Nombre des logiciels que nous contribuons à maintenir ont atteint une ampleur que peu de projets open source atteignent, avec des téléchargements cumulés se chiffrant en milliards.

![Principaux packages npm par téléchargement](/img/art/top_packages_bar_chart.svg)

> \[!IMPORTANT]
> Bien que nous soyons fiers de contribuer à la maintenance de plusieurs packages très téléchargés dans l'écosystème JavaScript, nous tenons à souligner que nombre d'entre eux ont été créés à l'origine par d'autres développeurs talentueux. Des packages comme superagent et supertest ont été créés par TJ Holowaychuk, dont les contributions prolifiques à l'open source ont joué un rôle déterminant dans le développement de l'écosystème Node.js.

### Une vue d'ensemble de notre impact {#a-birds-eye-view-of-our-impact}

Au cours de la seule période de deux mois allant de février à mars 2025, les principaux packages auxquels nous contribuons et que nous aidons à maintenir ont enregistré des nombres de téléchargements stupéfiants :

* **[superagent](https://www.npmjs.com/package/superagent)** : 84 575 829 téléchargements\[^7] (créé à l'origine par TJ Holowaychuk)
* **[super test](https://www.npmjs.com/package/supertest)** : 76 432 591 téléchargements\[^8] (créé à l'origine par TJ Holowaychuk)
* **[aussi](https://www.npmjs.com/package/koa)** : 28 539 295 téléchargements\[^34] (créé à l'origine par TJ Holowaychuk)
* **[@koa/routeur](https://www.npmjs.com/package/@koa/router)** : 11 007 327 téléchargements\[^35]
* **[routeur koa](https://www.npmjs.com/package/koa-router)** : 3 498 918 téléchargements\[^36]
* **[url-regex](https://www.npmjs.com/package/url-regex)** : 2 819 520 téléchargements\[^37]
* **[aperçu-e-mail](https://www.npmjs.com/package/preview-email)** : 2 500 000 Téléchargements\[^9]
* **[cabine](https://www.npmjs.com/package/cabin)** : 1 800 000 téléchargements\[^10]
* **[@breejs/plus tard](https://www.npmjs.com/package/@breejs/later)** : 1 709 938 téléchargements\[^38]
* **[modèles d'e-mails](https://www.npmjs.com/package/email-templates)** : 1 128 139 téléchargements\[^39]
* **__PROTECTED_LINK_259__0** : 1 124 686 téléchargements\[^40]
* **__PROTECTED_LINK_259__1** : 1 200 000 téléchargements\[^11]
* **__PROTECTED_LINK_259__2** : 894 666 téléchargements\[^41]
* **__PROTECTED_LINK_259__3** : 839 585 téléchargements\[^42]
* **__PROTECTED_LINK_259__4** : 145 000 Téléchargements\[^12]
* **__PROTECTED_LINK_259__5** : 24 270 téléchargements\[^30]

> \[!NOTE]
> Plusieurs autres packages que nous contribuons à maintenir, mais que nous n'avons pas créés, affichent des nombres de téléchargements encore plus élevés, notamment `form-data` (plus de 738 millions de téléchargements), `toidentifier` (plus de 309 millions de téléchargements), `stackframe` (plus de 116 millions de téléchargements) et `error-stack-parser` (plus de 113 millions de téléchargements). Nous sommes honorés de contribuer à ces packages tout en respectant le travail de leurs auteurs originaux.

Ces chiffres ne sont pas seulement impressionnants : ils représentent de vrais développeurs résolvant des problèmes concrets grâce au code que nous contribuons à maintenir. Chaque téléchargement est un exemple où ces packages ont permis à quelqu'un de créer quelque chose de significatif, des projets amateurs aux applications d'entreprise utilisées par des millions de personnes.

![Distribution des catégories de colis](/img/art/category_pie_chart.svg)

### Impact quotidien à grande échelle {#daily-impact-at-scale}

Les modèles de téléchargement quotidiens révèlent une utilisation constante et importante, avec des pics atteignant des millions de téléchargements par jour[^13]. Cette constance témoigne de la stabilité et de la fiabilité de ces packages : les développeurs ne se contentent pas de les tester ; ils les intègrent à leurs flux de travail principaux et s'y fient jour après jour.

Les statistiques de téléchargement hebdomadaires affichent des chiffres encore plus impressionnants, oscillant régulièrement autour de plusieurs dizaines de millions de téléchargements par semaine[^14]. Cela représente une empreinte considérable dans l'écosystème JavaScript, ces packages étant exécutés dans des environnements de production partout dans le monde.

### Au-delà des chiffres bruts {#beyond-the-raw-numbers}

Si les statistiques de téléchargement sont impressionnantes en elles-mêmes, elles témoignent de la confiance que la communauté accorde à ces packages. Maintenir des packages à cette échelle exige un engagement sans faille envers :

* **Rétrocompatibilité** : Les modifications doivent être soigneusement étudiées pour éviter de perturber les implémentations existantes.
* **Sécurité** : Avec des millions d’applications dépendant de ces packages, les failles de sécurité pourraient avoir des conséquences considérables.
* **Performances** : À cette échelle, même des améliorations mineures des performances peuvent avoir des avantages globaux significatifs.
* **Documentation** : Une documentation claire et complète est essentielle pour les packages utilisés par les développeurs de tous niveaux d’expérience.

La croissance constante du nombre de téléchargements au fil du temps reflète le succès dans le respect de ces engagements, en instaurant la confiance avec la communauté des développeurs grâce à des packages fiables et bien entretenus.

## Soutenir l'écosystème : nos parrainages Open Source {#supporting-the-ecosystem-our-open-source-sponsorships}

> \[!TIP]
> La durabilité de l'open source ne se limite pas à la contribution au code : elle consiste également à soutenir les développeurs qui maintiennent les infrastructures critiques.

Au-delà de nos contributions directes à l'écosystème JavaScript, nous sommes fiers de sponsoriser d'éminents contributeurs Node.js dont le travail constitue la base de nombreuses applications modernes. Nos sponsors incluent :

### Andris Reinman : Pionnier de l'infrastructure de messagerie électronique {#andris-reinman-email-infrastructure-pioneer}

[Andris Reinman](https://github.com/andris9) est le créateur de [Nodemailer](https://github.com/nodemailer/nodemailer), la bibliothèque d'envoi d'e-mails la plus populaire pour Node.js, avec plus de 14 millions de téléchargements hebdomadaires. Son travail s'étend à d'autres composants critiques de l'infrastructure de messagerie, tels que [Serveur SMTP](https://github.com/nodemailer/smtp-server), [Analyseur de courrier](https://github.com/nodemailer/mailparser) et [Canard sauvage](https://github.com/nodemailer/wildduck).

Notre parrainage contribue à assurer la maintenance et le développement continus de ces outils essentiels qui alimentent la communication par courrier électronique pour d'innombrables applications Node.js, y compris notre propre service de transfert de courrier électronique.

### Sindre Sorhus : cerveau du package utilitaire {#sindre-sorhus-utility-package-mastermind}

[Sindre Sorhus](https://github.com/sindresorhus) est l'un des contributeurs open source les plus prolifiques de l'écosystème JavaScript, avec plus de 1 000 packages npm à son actif. Ses utilitaires comme [carte p](https://github.com/sindresorhus/p-map), [p-nouvelle tentative](https://github.com/sindresorhus/p-retry) et [is-stream](https://github.com/sindresorhus/is-stream) sont des éléments fondamentaux utilisés dans l'écosystème Node.js.

En sponsorisant le travail de Sindre, nous contribuons à soutenir le développement de ces utilitaires essentiels qui rendent le développement JavaScript plus efficace et plus fiable.

Ces parrainages reflètent notre engagement envers l'écosystème open source au sens large. Nous sommes conscients que notre succès repose sur les fondations posées par ces contributeurs et d'autres, et nous nous engageons à assurer la pérennité de l'ensemble de l'écosystème.

## Découverte des vulnérabilités de sécurité dans l'écosystème JavaScript {#uncovering-security-vulnerabilities-in-the-javascript-ecosystem}

Notre engagement envers l'open source va au-delà du développement de fonctionnalités et inclut l'identification et la correction des vulnérabilités de sécurité susceptibles d'affecter des millions de développeurs. Plusieurs de nos contributions les plus significatives à l'écosystème JavaScript ont concerné la sécurité.

### Le sauvetage du routeur Koa {#the-koa-router-rescue}

En février 2019, Nick a identifié un problème critique dans la maintenance du populaire paquet koa-router. Nommé [rapporté sur Hacker News](https://news.ycombinator.com/item?id=19156707), le paquet avait été abandonné par son mainteneur initial, laissant des failles de sécurité non corrigées et la communauté sans mises à jour.

> \[!WARNING]
> Les packages abandonnés présentant des failles de sécurité présentent des risques importants pour l'ensemble de l'écosystème, en particulier lorsqu'ils sont téléchargés des millions de fois par semaine.

En réponse, Nick a créé [@koa/routeur](https://github.com/koajs/router) et a alerté la communauté sur la situation. Il assure depuis la maintenance de ce package essentiel, garantissant aux utilisateurs de Koa une solution de routage sécurisée et bien entretenue.

### Traitement des vulnérabilités ReDoS {#addressing-redos-vulnerabilities}

En 2020, Nick a identifié et corrigé une vulnérabilité critique [Déni de service par expression régulière (ReDoS)](https://en.wikipedia.org/wiki/ReDoS) dans le package `url-regex`, largement utilisé. Cette vulnérabilité ([SNYK-JS-URLREGEX-569472](https://security.snyk.io/vuln/SNYK-JS-URLREGEX-569472)) pouvait permettre à des attaquants de provoquer un déni de service en fournissant des entrées spécialement conçues provoquant un retour arrière catastrophique dans l'expression régulière.

Plutôt que de simplement corriger le package existant, Nick a créé [`url-regex-safe`](https://github.com/spamscanner/url-regex-safe), une implémentation entièrement réécrite qui corrige la vulnérabilité tout en maintenant la compatibilité avec l'API d'origine. Il a également publié un [article de blog complet](/blog/docs/url-regex-javascript-node-js) expliquant la vulnérabilité et comment la corriger.

Ce travail montre notre approche de la sécurité : non seulement résoudre les problèmes, mais aussi éduquer la communauté et fournir des alternatives solides qui empêchent des problèmes similaires à l’avenir.

### Plaidoyer pour la sécurité de Node.js et Chromium {#advocating-for-nodejs-and-chromium-security}

Nick a également activement milité en faveur d'améliorations de sécurité dans l'écosystème au sens large. En août 2020, il a identifié un problème de sécurité majeur dans Node.js lié à sa gestion des en-têtes HTTP, signalé dans [Le registre](https://www.theregister.com/2020/08/18/nodejs_chromium_patch/).

Ce problème, lié à un correctif dans Chromium, pouvait potentiellement permettre à des attaquants de contourner les mesures de sécurité. L'intervention de Nick a permis de résoudre rapidement le problème, protégeant ainsi des millions d'applications Node.js d'une éventuelle exploitation.

### Sécurisation de l'infrastructure npm {#securing-npm-infrastructure}

Plus tard ce même mois, Nick a identifié un autre problème de sécurité critique, cette fois dans l'infrastructure de messagerie de npm. Comme indiqué dans [Le registre](https://www.theregister.com/2020/08/25/nodejs_dmarc_phishing/), npm n'implémentait pas correctement les protocoles d'authentification DMARC, SPF et DKIM, ce qui permettait potentiellement aux attaquants d'envoyer des e-mails de phishing semblant provenir de npm.

Le rapport de Nick a conduit à des améliorations de la sécurité des e-mails de npm, protégeant les millions de développeurs qui s'appuient sur npm pour la gestion des packages contre d'éventuelles attaques de phishing.

## Nos contributions à l'écosystème de transfert de courrier électronique {#our-contributions-to-the-forward-email-ecosystem-1}

Forward Email s'appuie sur plusieurs projets open source essentiels, notamment Nodemailer, WildDuck et mailauth. Notre équipe a largement contribué à ces projets, en aidant à identifier et à corriger les problèmes majeurs affectant la distribution et la sécurité des e-mails.

### Amélioration des fonctionnalités principales de Nodemailer {#enhancing-nodemailers-core-functionality}

[Nodemailer](https://github.com/nodemailer/nodemailer) est l'épine dorsale de l'envoi d'e-mails dans Node.js, et nos contributions ont contribué à le rendre plus robuste :

* **Améliorations du serveur SMTP** : Nous avons corrigé des bugs d'analyse, des problèmes de gestion des flux et des problèmes de configuration TLS dans le composant serveur SMTP\[^16]\[^17].
* **Améliorations de l'analyseur de courrier** : Nous avons corrigé des erreurs de décodage de séquences de caractères et des problèmes d'analyseur susceptibles d'entraîner des échecs de traitement des courriers électroniques\[^18]\[^19].

Ces contributions garantissent que Nodemailer reste une base fiable pour le traitement des e-mails dans les applications Node.js, y compris Forward Email.

### Amélioration de l'authentification des e-mails avec Mailauth {#advancing-email-authentication-with-mailauth}

[Mailauth](https://github.com/postalsys/mailauth) fournit une fonctionnalité d'authentification de courrier électronique essentielle, et nos contributions ont considérablement amélioré ses capacités :

* **Améliorations de la vérification DKIM** : Nous avons découvert et signalé des problèmes de cache DNS chez X/Twitter, provoquant l'échec de la vérification DKIM pour leurs messages sortants, et nous les avons signalés sur Hacker One\[^20].
* **Améliorations DMARC et ARC** : Nous avons corrigé des problèmes de vérification DMARC et ARC pouvant entraîner des résultats d'authentification incorrects\[^21]\[^22].
* **Optimisations des performances** : Nous avons apporté des optimisations qui améliorent les performances des processus d'authentification des e-mails\[^23]\[^24]\[^25]\[^26].

Ces améliorations contribuent à garantir que l’authentification des e-mails est précise et fiable, protégeant ainsi les utilisateurs contre les attaques de phishing et d’usurpation d’identité.

### Améliorations de la disponibilité des touches {#key-upptime-enhancements}

Nos contributions à Upptime incluent :

* **Surveillance des certificats SSL** : Nous avons ajouté une fonctionnalité de surveillance de l’expiration des certificats SSL, évitant ainsi les interruptions de service inattendues dues à l’expiration des certificats\[^27].
* **Prise en charge de plusieurs numéros SMS** : Nous avons mis en place une fonction permettant d’alerter plusieurs membres de l’équipe par SMS en cas d’incident, améliorant ainsi les délais de réponse\[^28].
* **Correctifs de vérification IPv6** : Nous avons corrigé des problèmes de vérification de la connectivité IPv6, garantissant ainsi une surveillance plus précise dans les environnements réseau modernes\[^29].
* **Prise en charge des modes sombre/clair** : Nous avons ajouté la prise en charge des thèmes pour améliorer l’expérience utilisateur des pages d’état\[^31].
* **Meilleure prise en charge du ping TCP** : Nous avons amélioré la fonctionnalité de ping TCP pour offrir des tests de connexion plus fiables\[^32].

Ces améliorations profitent non seulement à la surveillance du statut de Forward Email, mais sont également disponibles pour l'ensemble de la communauté des utilisateurs d'Upptime, démontrant ainsi notre engagement à améliorer les outils dont nous dépendons.

## La colle qui maintient tout ensemble : code personnalisé à grande échelle {#the-glue-that-holds-it-all-together-custom-code-at-scale}

Bien que nos packages npm et nos contributions aux projets existants soient importants, c'est le code personnalisé qui intègre ces composants qui témoigne véritablement de notre expertise technique. La base de code de Forward Email représente une décennie de développement, remontant à 2017, lorsque le projet a débuté sous le nom de [transfert d'e-mail gratuit](https://github.com/forwardemail/free-email-forwarding) avant d'être fusionné dans un monorepo.

### Un effort de développement massif {#a-massive-development-effort}

L'ampleur de ce code d'intégration personnalisé est impressionnante :

* **Total des contributions** : Plus de 3 217 commits
* **Taille de la base de code** : Plus de 421 545 lignes de code réparties en fichiers JavaScript, Pug, CSS et JSON\[^33]

Cela représente des milliers d'heures de développement, de sessions de débogage et d'optimisation des performances. C'est la clé de voûte qui transforme chaque package en un service cohérent et fiable, utilisé quotidiennement par des milliers de clients.

### Intégration des dépendances principales {#core-dependencies-integration}

La base de code Forward Email intègre de nombreuses dépendances dans un ensemble homogène :

* **Traitement des e-mails** : intégration de Nodemailer pour l’envoi, d’un serveur SMTP pour la réception et de Mailparser pour l’analyse.
* **Authentification** : utilisation de Mailauth pour la vérification DKIM, SPF, DMARC et ARC.
* **Résolution DNS** : utilisation de Tangerine pour DNS sur HTTPS avec mise en cache globale.
* **Connexion MX** : utilisation de mx-connect avec l’intégration de Tangerine pour des connexions fiables au serveur de messagerie.
* **Planification des tâches** : utilisation de Bree pour un traitement fiable des tâches en arrière-plan avec des threads de travail.
* **Modèles** : utilisation de modèles d’e-mail pour réutiliser les feuilles de style du site web dans les communications client.
* **Stockage des e-mails** : mise en œuvre de boîtes aux lettres SQLite chiffrées individuellement à l’aide de better-sqlite3-multiple-ciphers avec chiffrement ChaCha20-Poly1305 pour une confidentialité quantique, garantissant une isolation complète entre les utilisateurs et l’accès exclusif de chaque utilisateur à sa boîte aux lettres.

Chacune de ces intégrations nécessite une prise en compte rigoureuse des cas limites, des implications en termes de performances et des problèmes de sécurité. Le résultat est un système robuste capable de gérer des millions de transactions par e-mail de manière fiable. Notre implémentation SQLite exploite également msgpackr pour une sérialisation binaire efficace et WebSockets (via ws) pour les mises à jour de statut en temps réel sur l'ensemble de notre infrastructure.

### Infrastructure DNS avec Tangerine et mx-connect {#dns-infrastructure-with-tangerine-and-mx-connect}

Un élément essentiel de l'infrastructure de Forward Email est notre système de résolution DNS, construit autour de deux packages clés :

* **[Tangerine](https://github.com/forwardemail/nodejs-dns-over-https-tangerine)** : Notre implémentation DNS sur HTTPS Node.js fournit un remplacement direct pour le résolveur DNS standard, avec des tentatives intégrées, des délais d'expiration, une rotation intelligente du serveur et une prise en charge de la mise en cache.

* **[mx-connect](https://github.com/zone-eu/mx-connect)** : ce package établit des connexions TCP aux serveurs MX, en prenant un domaine cible ou une adresse e-mail, en résolvant les serveurs MX appropriés et en s'y connectant par ordre de priorité.

Nous avons intégré Tangerine à mx-connect via [pull request #4](https://github.com/zone-eu/mx-connect/pull/4), garantissant les requêtes DNS sur HTTP de la couche applicative tout au long de Forward Email. Cela permet une mise en cache DNS globale à grande échelle avec une cohérence 1:1 dans toutes les régions, applications ou processus, essentielle à une distribution fiable des e-mails dans un système distribué.

## Impact sur l'entreprise : de l'open source aux solutions critiques {#enterprise-impact-from-open-source-to-mission-critical-solutions}

L'aboutissement de dix ans d'expérience dans le développement open source a permis à Forward Email de servir non seulement les développeurs individuels, mais aussi les grandes entreprises et les établissements d'enseignement, piliers du mouvement open source.

### Études de cas sur les infrastructures de messagerie critiques {#case-studies-in-mission-critical-email-infrastructure}

Notre engagement en matière de fiabilité, de confidentialité et de principes open source a fait de Forward Email le choix de confiance des organisations ayant des exigences élevées en matière de messagerie :

* **Établissements d'enseignement** : Comme détaillé dans notre étude de cas sur la redirection d'e-mails pour anciens élèves](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study), les grandes universités comptent sur notre infrastructure pour maintenir des liens à vie avec des centaines de milliers d'anciens élèves grâce à des services de transfert de courrier électronique fiables.

* **Solutions Linux d'entreprise** : Le [Étude de cas d'entreprise sur la messagerie Canonical Ubuntu](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study) démontre comment notre approche open source s'aligne parfaitement sur les besoins des fournisseurs Linux d'entreprise, leur offrant la transparence et le contrôle dont ils ont besoin.

* **Fondations Open Source** : Le plus valorisant est peut-être notre partenariat avec la Linux Foundation, comme documenté dans le [Étude de cas d'entreprise de messagerie électronique de la Fondation Linux](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study), où notre service alimente la communication pour l'organisation même qui gère le développement de Linux.

Il existe une belle symétrie dans la façon dont nos packages open source, maintenus avec soin depuis de nombreuses années, nous ont permis de créer un service de messagerie qui soutient désormais les communautés et les organisations qui défendent les logiciels open source. Ce parcours complet, de la contribution de packages individuels à la mise en place d'une infrastructure de messagerie professionnelle pour les leaders de l'open source, constitue la validation ultime de notre approche du développement logiciel.

## Une décennie d'Open Source : Regard vers l'avenir {#a-decade-of-open-source-looking-forward}

Alors que nous regardons en arrière sur une décennie de contributions open source et que nous envisageons les dix prochaines années, nous sommes remplis de gratitude envers la communauté qui a soutenu notre travail et d'enthousiasme pour ce qui va arriver.

Notre parcours, de contributeurs individuels à mainteneurs d'une infrastructure de messagerie complète utilisée par de grandes entreprises et des fondations open source, a été remarquable. Il témoigne de la puissance du développement open source et de l'impact que des logiciels bien pensés et bien entretenus peuvent avoir sur l'écosystème au sens large.

Dans les années à venir, nous nous engageons à :

* **Continuer à maintenir et à améliorer nos packages existants**, afin qu'ils restent des outils fiables pour les développeurs du monde entier.
* **Élargir nos contributions aux projets d'infrastructure critiques**, notamment dans les domaines de la messagerie électronique et de la sécurité.
* **Améliorer les fonctionnalités de Forward Email** tout en maintenant notre engagement en matière de confidentialité, de sécurité et de transparence.
* **Soutenir la prochaine génération de contributeurs open source** par le mentorat, le parrainage et l'engagement communautaire.

Nous sommes convaincus que l'avenir du développement logiciel est ouvert, collaboratif et fondé sur la confiance. En continuant à contribuer à l'écosystème JavaScript avec des packages de haute qualité et axés sur la sécurité, nous espérons contribuer à bâtir cet avenir.

Merci à tous ceux qui ont utilisé nos packages, contribué à nos projets, signalé des problèmes ou simplement fait connaître notre travail. Votre soutien a rendu possible cette décennie d'impact, et nous sommes impatients de voir ce que nous pourrons accomplir ensemble au cours des dix prochaines années.

\[^1]: Statistiques de téléchargement npm pour cabin, avril 2025
\[^2]: Statistiques de téléchargement npm pour bson-objectid, février-mars 2025
\[^3]: Statistiques de téléchargement npm pour url-regex-safe, avril 2025
\[^4]: Nombre d'étoiles GitHub pour forwardemail/forwardemail.net en avril 2025
\[^5]: Statistiques de téléchargement npm pour preview-email, avril 2025
\[^7]: Statistiques de téléchargement npm pour superagent, février-mars 2025
\[^8]: Statistiques de téléchargement npm pour supertest, février-mars 2025
\[^9]: Statistiques de téléchargement npm pour preview-email, février-mars 2025
\[^10]: Statistiques de téléchargement npm pour cabin, février-mars 2025
\[^11]: Statistiques de téléchargement npm pour url-regex-safe, Février-mars 2025
\[^12] : Statistiques de téléchargement npm pour spamscanner, février-mars 2025
\[^13] : Tendances de téléchargement quotidiennes issues de npm statistics, avril 2025
\[^14] : Tendances de téléchargement hebdomadaires issues de npm statistics, avril 2025
\[^15] : Statistiques de téléchargement npm pour nodemailer, avril 2025
\[^16] : <https://github.com/nodemailer/smtp-server/issues/155>
\[^17] : <https://github.com/nodemailer/smtp-server/issues/node-v12-requires-tls-min>
\[^18] : <https://github.com/nodemailer/mailparser/issues/261>
\[^19] : <https://github.com/nodemailer/nodemailer/issues/1102>
\[^20] : <https://github.com/postalsys/mailauth/issues/30>
\[^21] : <https://github.com/postalsys/mailauth/issues/58>
\[^22] : <https://github.com/postalsys/mailauth/issues/48>
\[^23] : <https://github.com/postalsys/mailauth/issues/74>
\[^24] : <https://github.com/postalsys/mailauth/issues/75>
\[^25]: <https://github.com/postalsys/mailauth/issues/60>
\[^26]: <https://github.com/nodemailer/smtp-server/issues/node-v12-requires-tls-min>0
\[^27]: Basé sur les problèmes GitHub dans le dépôt Upptime
\[^28]: Basé sur les problèmes GitHub dans le dépôt Upptime
\[^29]: Basé sur les problèmes GitHub dans le dépôt Upptime
\[^30]: Statistiques de téléchargement npm pour bree, février-mars 2025
\[^31]: Basé sur les requêtes d'extraction GitHub vers Upptime
\[^32]: Basé sur les requêtes d'extraction GitHub vers Upptime
\[^34]: Statistiques de téléchargement npm pour koa, février-mars 2025
\[^35]: Statistiques de téléchargement npm pour @koa/router, février-mars 2025
\[^36]: Statistiques de téléchargement npm pour koa-router, février-mars 2025
\[^37] : Statistiques de téléchargement npm pour url-regex, février-mars 2025
\[^38] : Statistiques de téléchargement npm pour @breejs/later, février-mars 2025
\[^39] : Statistiques de téléchargement npm pour email-templates, février-mars 2025
\[^40] : Statistiques de téléchargement npm pour get-paths, février-mars 2025
\[^41] : Statistiques de téléchargement npm pour dotenv-parse-variables, février-mars 2025
\[^42] : Statistiques de téléchargement npm pour @koa/multer, février-mars 2025