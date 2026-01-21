# Comment optimiser l'infrastructure de production Node.js : meilleures pratiques {#how-to-optimize-nodejs-production-infrastructure-best-practices}

<img loading="lazy" src="/img/articles/nodejs-performance.webp" alt="Node.js performance optimization guide" class="rounded-lg" />

## Table des matières {#table-of-contents}

* [Avant-propos](#foreword)
* [Notre révolution d'optimisation des performances monocœur à 573 %](#our-573-single-core-performance-optimization-revolution)
  * [Pourquoi l'optimisation des performances monocœur est importante pour Node.js](#why-single-core-performance-optimization-matters-for-nodejs)
  * [Contenu connexe](#related-content)
* [Configuration de l'environnement de production Node.js : notre pile technologique](#nodejs-production-environment-setup-our-technology-stack)
  * [Gestionnaire de paquets : pnpm pour une production efficace](#package-manager-pnpm-for-production-efficiency)
  * [Framework Web : Koa pour la production Node.js moderne](#web-framework-koa-for-modern-nodejs-production)
  * [Traitement des tâches en arrière-plan : Bree pour la fiabilité de la production](#background-job-processing-bree-for-production-reliability)
  * [Gestion des erreurs : @hapi/boom pour la fiabilité de la production](#error-handling-hapiboom-for-production-reliability)
* [Comment surveiller les applications Node.js en production](#how-to-monitor-nodejs-applications-in-production)
  * [Surveillance de la production Node.js au niveau système](#system-level-nodejs-production-monitoring)
  * [Surveillance au niveau des applications pour la production Node.js](#application-level-monitoring-for-nodejs-production)
  * [Surveillance spécifique à l'application](#application-specific-monitoring)
* [Surveillance de la production Node.js avec les contrôles de santé PM2](#nodejs-production-monitoring-with-pm2-health-checks)
  * [Notre système de contrôle de santé PM2](#our-pm2-health-check-system)
  * [Notre configuration de production PM2](#our-pm2-production-configuration)
  * [Déploiement automatisé de PM2](#automated-pm2-deployment)
* [Système de gestion et de classification des erreurs de production](#production-error-handling-and-classification-system)
  * [Notre implémentation isCodeBug pour la production](#our-iscodebug-implementation-for-production)
  * [Intégration avec notre journalisation de production](#integration-with-our-production-logging)
  * [Contenu connexe](#related-content-1)
* [Débogage avancé des performances avec v8-profiler-next et cpupro](#advanced-performance-debugging-with-v8-profiler-next-and-cpupro)
  * [Notre approche de profilage pour la production Node.js](#our-profiling-approach-for-nodejs-production)
  * [Comment nous mettons en œuvre l'analyse des instantanés de tas](#how-we-implement-heap-snapshot-analysis)
  * [Flux de travail de débogage des performances](#performance-debugging-workflow)
  * [Implémentation recommandée pour votre application Node.js](#recommended-implementation-for-your-nodejs-application)
  * [Intégration avec notre surveillance de production](#integration-with-our-production-monitoring)
* [Sécurité de l'infrastructure de production Node.js](#nodejs-production-infrastructure-security)
  * [Sécurité au niveau du système pour la production Node.js](#system-level-security-for-nodejs-production)
  * [Sécurité des applications pour les applications Node.js](#application-security-for-nodejs-applications)
  * [Automatisation de la sécurité des infrastructures](#infrastructure-security-automation)
  * [Notre contenu de sécurité](#our-security-content)
* [Architecture de base de données pour les applications Node.js](#database-architecture-for-nodejs-applications)
  * [Implémentation de SQLite pour la production Node.js](#sqlite-implementation-for-nodejs-production)
  * [Implémentation de MongoDB pour la production Node.js](#mongodb-implementation-for-nodejs-production)
* [Traitement des tâches d'arrière-plan de production Node.js](#nodejs-production-background-job-processing)
  * [Notre configuration du serveur Bree pour la production](#our-bree-server-setup-for-production)
  * [Exemples de travaux de production](#production-job-examples)
  * [Nos modèles de planification de tâches pour la production Node.js](#our-job-scheduling-patterns-for-nodejs-production)
* [Maintenance automatisée pour les applications Node.js de production](#automated-maintenance-for-production-nodejs-applications)
  * [Notre mise en œuvre du nettoyage](#our-cleanup-implementation)
  * [Gestion de l'espace disque pour la production Node.js](#disk-space-management-for-nodejs-production)
  * [Automatisation de la maintenance des infrastructures](#infrastructure-maintenance-automation)
* [Guide d'implémentation du déploiement en production Node.js](#nodejs-production-deployment-implementation-guide)
  * [Étudiez notre code actuel pour les meilleures pratiques de production](#study-our-actual-code-for-production-best-practices)
  * [Apprenez de nos articles de blog](#learn-from-our-blog-posts)
  * [Automatisation de l'infrastructure pour la production Node.js](#infrastructure-automation-for-nodejs-production)
  * [Nos études de cas](#our-case-studies)
* [Conclusion : Bonnes pratiques de déploiement en production de Node.js](#conclusion-nodejs-production-deployment-best-practices)
* [Liste complète des ressources pour la production Node.js](#complete-resource-list-for-nodejs-production)
  * [Nos principaux fichiers d'implémentation](#our-core-implementation-files)
  * [Nos implémentations de serveur](#our-server-implementations)
  * [Notre automatisation des infrastructures](#our-infrastructure-automation)
  * [Nos articles de blog technique](#our-technical-blog-posts)
  * [Nos études de cas d'entreprise](#our-enterprise-case-studies)

## Avant-propos {#foreword}

Chez Forward Email, nous avons passé des années à perfectionner la configuration de notre environnement de production Node.js. Ce guide complet présente nos bonnes pratiques éprouvées en matière de déploiement en production Node.js, en mettant l'accent sur l'optimisation des performances, la surveillance et les enseignements tirés de la mise à l'échelle d'applications Node.js pour gérer des millions de transactions quotidiennes.

## Notre révolution d'optimisation des performances monocœur à 573 % {#our-573-single-core-performance-optimization-revolution}

Lors de la migration des processeurs Intel vers AMD Ryzen, nous avons obtenu une amélioration des performances de **573 %** dans nos applications Node.js. Il ne s'agissait pas d'une simple optimisation mineure : elle a fondamentalement transformé les performances de nos applications Node.js en production et démontre l'importance de l'optimisation des performances monocœur pour toute application Node.js.

> \[!TIP]
> Pour les bonnes pratiques de déploiement en production de Node.js, le choix du matériel est crucial. Nous avons spécifiquement choisi l'hébergement DataPacket pour sa disponibilité sur AMD Ryzen, car les performances monocœur sont cruciales pour les applications Node.js, l'exécution JavaScript étant monothread.

### Pourquoi l'optimisation des performances monocœur est importante pour Node.js {#why-single-core-performance-optimization-matters-for-nodejs}

Notre migration d'Intel vers AMD Ryzen a abouti à :

* **Amélioration des performances de 573 %** dans le traitement des requêtes (documentée dans [Problème GitHub #1519](https://github.com/forwardemail/status.forwardemail.net/issues/1519#issuecomment-2652177671))
* **Suppression des délais de traitement** pour des réponses quasi instantanées (mentionné dans [Problème GitHub #298](https://github.com/forwardemail/forwardemail.net/issues/298))
* **Meilleur rapport prix/performances** pour les environnements de production Node.js
* **Temps de réponse améliorés** sur tous nos points de terminaison applicatifs

L'amélioration des performances a été si significative que nous considérons désormais les processeurs AMD Ryzen comme essentiels pour tout déploiement de production Node.js sérieux, que vous exécutiez des applications web, des API, des microservices ou toute autre charge de travail Node.js.

### Contenu associé {#related-content}

Pour plus de détails sur nos choix d'infrastructure, consultez :

* [Meilleur service de transfert d'e-mails]](https://forwardemail.net/blog/docs/best-email-forwarding-service) - Comparaisons des performances)
* [Solution auto-hébergée](https://forwardemail.net/blog/docs/self-hosted-solution) - Recommandations matérielles

## Configuration de l'environnement de production Node.js : notre pile technologique {#nodejs-production-environment-setup-our-technology-stack}

Nos bonnes pratiques de déploiement Node.js en production reposent sur des choix technologiques réfléchis, fruit de nombreuses années d'expérience en production. Voici ce que nous utilisons et pourquoi ces choix s'appliquent à toute application Node.js :

Gestionnaire de paquets ### : pnpm pour l'efficacité de la production {#package-manager-pnpm-for-production-efficiency}

**Ce que nous utilisons :** [`pnpm`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json) (version épinglée)

Nous avons choisi pnpm plutôt que npm et yarn pour la configuration de notre environnement de production Node.js car :

* **Temps d'installation plus rapides** dans les pipelines CI/CD
* **Efficacité de l'espace disque** grâce aux liens physiques
* **Résolution stricte des dépendances** qui évite les dépendances fantômes
* **Meilleures performances** dans les déploiements de production

> \[!NOTE]
> Dans le cadre de nos bonnes pratiques de déploiement de production Node.js, nous attribuons des versions exactes d'outils critiques comme pnpm afin de garantir un comportement cohérent dans tous les environnements et sur les machines des membres de l'équipe.

**Détails de mise en œuvre :**

* [Notre configuration package.json](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [Notre article de blog sur l'écosystème NPM](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)

### Framework Web : Koa pour la production Node.js moderne {#web-framework-koa-for-modern-nodejs-production}

**Ce que nous utilisons :**

* [`@koa/router`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@koa/multer`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/koa-simple-ratelimit`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Nous avons choisi Koa plutôt qu'Express pour notre infrastructure de production Node.js en raison de sa prise en charge moderne des approches asynchrones et en attente et de sa composition middleware plus claire. Notre fondateur, Nick Baugh, a contribué à Express et Koa, nous offrant ainsi une connaissance approfondie des deux frameworks pour une utilisation en production.

Ces modèles s'appliquent que vous créiez des API REST, des serveurs GraphQL, des applications Web ou des microservices.

**Nos exemples de mise en œuvre :**

* [Configuration du serveur Web](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [Configuration du serveur API](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Guide de mise en œuvre des formulaires de contact](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)

### Traitement des tâches en arrière-plan : Bree pour la fiabilité de la production {#background-job-processing-bree-for-production-reliability}

**Ce que nous utilisons :** planificateur [`bree`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Nous avons créé et maintenons Bree car les planificateurs de tâches existants ne répondaient pas à nos besoins en matière de prise en charge des threads de travail et de fonctionnalités JavaScript modernes dans les environnements Node.js de production. Ce problème s'applique à toute application Node.js nécessitant un traitement en arrière-plan, des tâches planifiées ou des threads de travail.

**Nos exemples de mise en œuvre :**

* [Configuration du serveur Bree](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [Toutes nos définitions de métiers](https://github.com/forwardemail/forwardemail.net/tree/master/jobs)
* [Travail de contrôle de santé PM2](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)
* [Mise en œuvre du travail de nettoyage](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

Gestion des erreurs ### : @hapi/boom pour la fiabilité de la production {#error-handling-hapiboom-for-production-reliability}

**Ce que nous utilisons :** [`@hapi/boom`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Nous utilisons @hapi/boom pour les réponses d'erreur structurées dans nos applications de production Node.js. Ce modèle fonctionne pour toute application Node.js nécessitant une gestion cohérente des erreurs.

**Nos exemples de mise en œuvre :**

* [Aide à la classification des erreurs](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
* [Implémentation du logger](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

## Comment surveiller les applications Node.js en production {#how-to-monitor-nodejs-applications-in-production}

Notre approche de la surveillance des applications Node.js en production a évolué au fil des années d'exploitation d'applications à grande échelle. Nous mettons en œuvre une surveillance à plusieurs niveaux pour garantir la fiabilité et les performances de tout type d'application Node.js.

### Surveillance de la production Node.js au niveau système {#system-level-nodejs-production-monitoring}

**Notre implémentation principale :** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

**Ce que nous utilisons :** [`node-os-utils`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Nos seuils de surveillance de la production (à partir de notre code de production réel) :

* **Limite de taille de tas de 2 Go** avec alertes automatiques
* **Seuil d'avertissement d'utilisation de la mémoire à 25 %**
* **Seuil d'alerte d'utilisation du processeur à 80 %**
* **Seuil d'avertissement d'utilisation du disque à 75 %**

> \[!WARNING]
> Ces seuils fonctionnent pour notre configuration matérielle spécifique. Lors de la mise en œuvre de la surveillance de production Node.js, examinez notre implémentation de monitor-server.js pour comprendre la logique exacte et adapter les valeurs à votre configuration.

### Surveillance au niveau de l'application pour la production Node.js {#application-level-monitoring-for-nodejs-production}

**Notre classification des erreurs :** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

Cet assistant fait la distinction entre :

* **Bogues de code réels** nécessitant une attention immédiate
* **Erreurs utilisateur** qui sont des comportements attendus
* **Défaillances de service externes** que nous ne pouvons pas contrôler

Ce modèle s'applique à toute application Node.js : applications Web, API, microservices ou services d'arrière-plan.

**Notre implémentation de journalisation :** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

Nous mettons en œuvre une rédaction complète des champs pour protéger les informations sensibles tout en conservant des capacités de débogage utiles dans notre environnement de production Node.js.

### Surveillance spécifique à l'application {#application-specific-monitoring}

**Nos implémentations de serveur :**

* [serveur SMTP](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)
* [serveur IMAP](https://github.com/forwardemail/forwardemail.net/blob/master/imap.js)
* [serveur POP3](https://github.com/forwardemail/forwardemail.net/blob/master/pop3.js)

**Surveillance des files d'attente** : nous implémentons des limites de file d'attente de 5 Go et des délais d'attente de 180 secondes pour le traitement des requêtes afin d'éviter l'épuisement des ressources. Ces modèles s'appliquent à toute application Node.js avec files d'attente ou traitement en arrière-plan.

## Surveillance de la production Node.js avec les contrôles de santé PM2 {#nodejs-production-monitoring-with-pm2-health-checks}

Forts de nombreuses années d'expérience en production, nous avons optimisé la configuration de notre environnement de production Node.js avec PM2. Nos contrôles de santé PM2 sont essentiels pour garantir la fiabilité de toute application Node.js.

### Notre système de contrôle de santé PM2 {#our-pm2-health-check-system}

**Notre implémentation principale :** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

Notre surveillance de production Node.js avec contrôles de santé PM2 comprend :

* **Exécution toutes les 20 minutes** via la planification cron
* **Nécessite un temps de disponibilité minimum de 15 minutes** avant qu'un processus soit considéré comme sain
* **Validation de l'état du processus et de l'utilisation de la mémoire**
* **Redémarrage automatique des processus en échec**
* **Évite les boucles de redémarrage** grâce à des contrôles d'intégrité intelligents

> \[!CAUTION]
> Pour les bonnes pratiques de déploiement en production de Node.js, nous exigeons un temps de disponibilité d'au moins 15 minutes avant de considérer un processus comme sain afin d'éviter les boucles de redémarrage. Cela évite les pannes en cascade lorsque les processus rencontrent des problèmes de mémoire ou d'autres problèmes.

### Notre configuration de production PM2 {#our-pm2-production-configuration}

**Notre configuration d'écosystème :** Étudiez nos fichiers de démarrage de serveur pour la configuration de l'environnement de production Node.js :

* [serveur Web](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [serveur API](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Planificateur Bree](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [serveur SMTP](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)

Ces modèles s'appliquent que vous exécutiez des applications Express, des serveurs Koa, des API GraphQL ou toute autre application Node.js.

### Déploiement PM2 automatisé {#automated-pm2-deployment}

**Déploiement PM2 :** [`ansible/playbooks/node.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

Nous automatisons l'ensemble de notre configuration PM2 via Ansible pour garantir des déploiements de production Node.js cohérents sur tous nos serveurs.

## Système de gestion et de classification des erreurs de production {#production-error-handling-and-classification-system}

L’une de nos meilleures pratiques de déploiement de production Node.js les plus précieuses est la classification intelligente des erreurs qui s’applique à n’importe quelle application Node.js :

### Notre implémentation isCodeBug pour la production {#our-iscodebug-implementation-for-production}

**Source :** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

Cet assistant fournit une classification intelligente des erreurs pour les applications Node.js en production pour :

* **Prioriser les bugs réels** aux erreurs des utilisateurs
* **Améliorer notre réponse aux incidents** en se concentrant sur les problèmes réels
* **Réduire la lassitude liée aux alertes** due aux erreurs attendues des utilisateurs
* **Mieux comprendre** les problèmes liés aux applications par rapport aux problèmes générés par les utilisateurs

Ce modèle fonctionne pour n'importe quelle application Node.js, que vous créiez des sites de commerce électronique, des plateformes SaaS, des API ou des microservices.

### Intégration avec notre journalisation de production {#integration-with-our-production-logging}

**Notre intégration de journal :** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

Notre enregistreur utilise `isCodeBug` pour déterminer les niveaux d'alerte et la rédaction des champs, garantissant que nous sommes informés des problèmes réels tout en filtrant le bruit dans notre environnement de production Node.js.

### Contenu associé à {#related-content-1}

En savoir plus sur nos modèles de gestion des erreurs :

* [Construire un système de paiement fiable](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal) - Modèles de gestion des erreurs
* [Protection de la confidentialité des e-mails](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation) - Gestion des erreurs de sécurité

## Débogage avancé des performances avec v8-profiler-next et cpupro {#advanced-performance-debugging-with-v8-profiler-next-and-cpupro}

Nous utilisons des outils de profilage avancés pour analyser les snapshots de tas et déboguer les problèmes de mémoire insuffisante (OOM), les goulots d'étranglement des performances et les problèmes de mémoire Node.js dans notre environnement de production. Ces outils sont essentiels pour toute application Node.js confrontée à des fuites de mémoire ou des problèmes de performances.

### Notre approche de profilage pour la production Node.js {#our-profiling-approach-for-nodejs-production}

**Outils que nous recommandons :**

* [`v8-profiler-next`](https://www.npmjs.com/package/v8-profiler-next) - Pour générer des instantanés de tas et des profils CPU
* [`cpupro`](https://github.com/discoveryjs/cpupro) - Pour analyser les profils CPU et les instantanés de tas

> \[!TIP]
> Nous utilisons conjointement v8-profiler-next et cpupro pour créer un workflow complet de débogage des performances pour nos applications Node.js. Cette combinaison nous aide à identifier les fuites de mémoire, les goulots d'étranglement des performances et à optimiser notre code de production.

### Comment nous mettons en œuvre l'analyse des instantanés de tas {#how-we-implement-heap-snapshot-analysis}

**Notre implémentation de surveillance :** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

Notre surveillance de la production inclut la génération automatique d'instantanés de tas lorsque les seuils de mémoire sont dépassés. Cela nous permet de déboguer les problèmes de mémoire insuffisante avant qu'ils ne provoquent des plantages d'application.

**Modèles de mise en œuvre clés :**

* **Instantanés automatiques** lorsque la taille du tas dépasse le seuil de 2 Go
* **Profilage basé sur le signal** pour une analyse à la demande en production
* **Politiques de conservation** pour la gestion du stockage des instantanés
* **Intégration à nos tâches de nettoyage** pour une maintenance automatisée

### Flux de travail de débogage des performances {#performance-debugging-workflow}

**Étudiez notre mise en œuvre réelle :**

* [Surveiller l'implémentation du serveur](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js) - Surveillance du tas et génération de snapshots
* [Travaux de nettoyage](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js) - Conservation et nettoyage des snapshots
* [Intégration du logger](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js) - Journalisation des performances

Implémentation recommandée ### pour votre application Node.js {#recommended-implementation-for-your-nodejs-application}

**Pour l'analyse des instantanés de tas :**

1. **Installer v8-profiler-next** pour générer des snapshots
2. **Utiliser cpupro** pour analyser les snapshots générés
3. **Mettre en place des seuils de surveillance** similaires à notre fichier monitor-server.js
4. **Configurer un nettoyage automatisé** pour gérer le stockage des snapshots
5. **Créer des gestionnaires de signaux** pour le profilage à la demande en production

**Pour le profilage du processeur :**

1. **Générer des profils CPU** pendant les périodes de forte charge
2. **Analyser avec cpupro** pour identifier les goulots d'étranglement
3. **Se concentrer sur les chemins chauds** et les opportunités d'optimisation
4. **Surveiller les améliorations de performances avant/après**

> \[!WARNING]
> La génération d'instantanés de tas et de profils CPU peut impacter les performances. Nous recommandons de limiter les performances et d'activer le profilage uniquement lors de l'analyse de problèmes spécifiques ou pendant les périodes de maintenance.

### Intégration avec notre surveillance de production {#integration-with-our-production-monitoring}

Nos outils de profilage s'intègrent à notre stratégie de surveillance plus large :

* **Déclenchement automatique** basé sur les seuils mémoire/CPU
* **Intégration d'alertes** en cas de détection de problèmes de performances
* **Analyse historique** pour suivre les tendances de performances au fil du temps
* **Corrélation avec les métriques applicatives** pour un débogage complet

Cette approche nous a aidé à identifier et à résoudre les fuites de mémoire, à optimiser les chemins de code à chaud et à maintenir des performances stables dans notre environnement de production Node.js.

## Sécurité de l'infrastructure de production Node.js {#nodejs-production-infrastructure-security}

Nous mettons en œuvre une sécurité complète pour notre infrastructure de production Node.js grâce à l'automatisation Ansible. Ces pratiques s'appliquent à toutes les applications Node.js :

### Sécurité au niveau du système pour la production Node.js {#system-level-security-for-nodejs-production}

**Notre implémentation Ansible :** [`ansible/playbooks/security.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)

Nos principales mesures de sécurité pour les environnements de production Node.js :

* **Swap désactivé** pour empêcher l'écriture de données sensibles sur le disque
* **Vidages mémoire désactivés** pour empêcher les vidages mémoire contenant des informations sensibles
* **Stockage USB bloqué** pour empêcher tout accès non autorisé aux données
* **Réglage des paramètres du noyau** pour la sécurité et les performances

> \[!WARNING]
> Lors de la mise en œuvre des bonnes pratiques de déploiement en production de Node.js, la désactivation du swap peut entraîner des arrêts prématurés par manque de mémoire si votre application dépasse la RAM disponible. Nous surveillons attentivement l'utilisation de la mémoire et dimensionnons nos serveurs en conséquence.

### Sécurité des applications pour les applications Node.js {#application-security-for-nodejs-applications}

**Notre rédaction de champ de journal :** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

Nous supprimons les champs sensibles des journaux, notamment les mots de passe, les jetons, les clés API et les informations personnelles. Cela protège la confidentialité des utilisateurs tout en maintenant les capacités de débogage dans tout environnement de production Node.js.

### Automatisation de la sécurité des infrastructures {#infrastructure-security-automation}

**Notre configuration Ansible complète pour la production Node.js :**

* [Manuel de sécurité](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Gestion des clés SSH](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/ssh-keys.yml)
* [Gestion des certificats](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/certificates.yml)
* [Configuration DKIM](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/dkim.yml)

### Notre contenu de sécurité {#our-security-content}

En savoir plus sur notre approche en matière de sécurité :

* [Meilleures sociétés d'audit de sécurité](https://forwardemail.net/blog/docs/best-security-audit-companies)
* [Courriel crypté Quantum Safe](https://forwardemail.net/blog/docs/best-quantum-safe-encrypted-email-service)
* [Pourquoi choisir la sécurité des e-mails Open Source](https://forwardemail.net/blog/docs/why-open-source-email-security-privacy)

## Architecture de base de données pour les applications Node.js {#database-architecture-for-nodejs-applications}

Nous utilisons une approche de base de données hybride optimisée pour nos applications Node.js. Ces modèles peuvent être adaptés à n'importe quelle application Node.js :

### Implémentation SQLite pour la production Node.js {#sqlite-implementation-for-nodejs-production}

**Ce que nous utilisons :**

* [`better-sqlite3`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`better-sqlite3-multiple-ciphers`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

**Notre configuration :** [`ansible/playbooks/sqlite.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

Nous utilisons SQLite pour les données spécifiques à l'utilisateur dans nos applications Node.js car il fournit :

* **Isolation des données** par utilisateur/locataire
* **Meilleures performances** pour les requêtes mono-utilisateur
* **Sauvegarde et migration simplifiées**
* **Complexité réduite** par rapport aux bases de données partagées

Ce modèle fonctionne bien pour les applications SaaS, les systèmes multi-locataires ou toute application Node.js nécessitant une isolation des données.

### Implémentation MongoDB pour la production Node.js {#mongodb-implementation-for-nodejs-production}

**Ce que nous utilisons :**

* [`@ladjs/mongoose`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/mongoose-error-messages`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@zainundin/mongoose-factory`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

**Notre implémentation de configuration :** [`helpers/setup-mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/setup-mongoose.js)

**Notre configuration :** [`config/mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/config/mongoose.js)

Nous utilisons MongoDB pour les données d'application dans notre environnement de production Node.js car il fournit :

* **Schéma flexible** pour structures de données évolutives
* **Meilleures performances** pour les requêtes complexes
* **Fonctionnalités de mise à l'échelle horizontale**
* **Langage de requête enrichi**

> \[!NOTE]
> Notre approche hybride est optimisée pour notre cas d'utilisation spécifique. Étudiez nos modèles d'utilisation de base de données réels dans le code source pour déterminer si cette approche répond aux besoins de votre application Node.js.

## Traitement des tâches d'arrière-plan de production Node.js {#nodejs-production-background-job-processing}

Nous avons construit notre architecture de tâches d'arrière-plan autour de Bree pour un déploiement fiable de Node.js en production. Ceci s'applique à toute application Node.js nécessitant un traitement en arrière-plan :

### Notre configuration du serveur Bree pour la production {#our-bree-server-setup-for-production}

**Notre implémentation principale :** [`bree.js`](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)

**Notre déploiement Ansible :** [`ansible/playbooks/bree.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/bree.yml)

### Exemples de tâches de production {#production-job-examples}

**Surveillance de la santé :** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

**Automatisation du nettoyage :** [`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

**Tous nos emplois :** [Parcourez notre répertoire complet d'emplois](https://github.com/forwardemail/forwardemail.net/tree/master/jobs)

Ces modèles s'appliquent à toute application Node.js qui a besoin de :

* Tâches planifiées (traitement des données, rapports, nettoyage)
* Traitement en arrière-plan (redimensionnement d'images, envoi d'e-mails, importation de données)
* Surveillance et maintenance de l'état de santé
* Utilisation des threads de travail pour les tâches gourmandes en ressources processeur

### Nos modèles de planification de tâches pour la production Node.js {#our-job-scheduling-patterns-for-nodejs-production}

Étudiez nos modèles réels de planification des tâches dans notre répertoire d'emplois pour comprendre :

* Comment implémenter la planification de type cron en production Node.js
* Notre gestion des erreurs et notre logique de relance
* Comment utiliser les threads de travail pour les tâches gourmandes en ressources processeur

## Maintenance automatisée pour les applications Node.js de production {#automated-maintenance-for-production-nodejs-applications}

Nous mettons en œuvre une maintenance proactive pour prévenir les problèmes courants de production de Node.js. Ces modèles s'appliquent à toutes les applications Node.js :

### Notre implémentation de nettoyage {#our-cleanup-implementation}

**Source :** [`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

Notre maintenance automatisée pour les applications de production Node.js cible :

* **Fichiers temporaires** datant de plus de 24 heures
* **Fichiers journaux** au-delà des limites de conservation
* **Fichiers cache** et données temporaires
* **Fichiers téléchargés** qui ne sont plus nécessaires
* **Instantanés du tas** issus du débogage des performances

Ces modèles s'appliquent à toute application Node.js qui génère des fichiers temporaires, des journaux ou des données mises en cache.

### Gestion de l'espace disque pour la production Node.js {#disk-space-management-for-nodejs-production}

**Nos seuils de surveillance :** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

* **Limites de file d'attente** pour le traitement en arrière-plan
* **Seuil d'avertissement d'utilisation du disque à 75 %**
* **Nettoyage automatique** en cas de dépassement des seuils

### Automatisation de la maintenance des infrastructures {#infrastructure-maintenance-automation}

**Notre automatisation Ansible pour la production Node.js :**

* [Déploiement de l'environnement](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/env.yml)
* [Gestion des clés de déploiement](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/deployment-keys.yml)

## Guide d'implémentation du déploiement de production Node.js {#nodejs-production-deployment-implementation-guide}

### Étudiez notre code actuel pour les meilleures pratiques de production {#study-our-actual-code-for-production-best-practices}

**Commencez avec ces fichiers clés pour la configuration de l'environnement de production Node.js :**

1. **Configuration** : [`config/index.js`](https://github.com/forwardemail/forwardemail.net/blob/master/config/index.js)
2. **Surveillance** : [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)
3. **Gestion des erreurs** : [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
4. **Journalisation** : [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
5. **Santé du processus** : [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

### Apprenez de nos articles de blog {#learn-from-our-blog-posts}

**Nos guides d'implémentation technique pour la production Node.js :**

* [Écosystème de packages NPM](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)
* [Systèmes de paiement des bâtiments](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal)
* [Mise en œuvre de la confidentialité des e-mails](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [Formulaires de contact JavaScript](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [Intégration de la messagerie React](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)

### Automatisation de l'infrastructure pour la production Node.js {#infrastructure-automation-for-nodejs-production}

**Nos playbooks Ansible à étudier pour le déploiement de production Node.js :**

* [Répertoire complet des manuels de jeu](https://github.com/forwardemail/forwardemail.net/tree/master/ansible/playbooks)
* [Renforcement de la sécurité](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Configuration de Node.js](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

### Nos études de cas {#our-case-studies}

**Nos implémentations d'entreprise :**

* [Étude de cas de la Fondation Linux](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [Étude de cas canonique Ubuntu](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [Transfert de courrier électronique des anciens élèves](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)

Conclusion : bonnes pratiques de déploiement en production Node.js {#conclusion-nodejs-production-deployment-best-practices}

Notre infrastructure de production Node.js démontre que les applications Node.js peuvent atteindre une fiabilité de niveau entreprise grâce à :

* **Choix matériels éprouvés** (AMD Ryzen pour une optimisation des performances monocœur de 573 %)
* **Surveillance de production Node.js testée** avec seuils spécifiques et réponses automatisées
* **Classification intelligente des erreurs** pour améliorer la réponse aux incidents en production
* **Débogage avancé des performances** avec v8-profiler-next et cpupro pour la prévention des OOM
* **Renforcement complet de la sécurité** grâce à l'automatisation Ansible
* **Architecture de base de données hybride** optimisée pour les besoins des applications
* **Maintenance automatisée** pour prévenir les problèmes courants de production Node.js

**Point clé à retenir :** Étudiez nos fichiers d'implémentation et nos articles de blog plutôt que de suivre des bonnes pratiques génériques. Notre base de code fournit des modèles concrets pour le déploiement en production de Node.js, adaptables à toute application Node.js : applications web, API, microservices ou services d'arrière-plan.

## Liste complète des ressources pour la production Node.js {#complete-resource-list-for-nodejs-production}

### Nos fichiers d'implémentation de base {#our-core-implementation-files}

* [Configuration principale](https://github.com/forwardemail/forwardemail.net/blob/master/config/index.js)
* [Dépendances du package](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [Surveillance du serveur](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)
* [Classification des erreurs](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
* [Système de journalisation](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
* [Contrôles de santé PM2](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)
* [Nettoyage automatisé](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

### Nos implémentations de serveur {#our-server-implementations}

* [serveur Web](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [serveur API](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Planificateur Bree](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [serveur SMTP](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)
* [serveur IMAP](https://github.com/forwardemail/forwardemail.net/blob/master/imap.js)
* [serveur POP3](https://github.com/forwardemail/forwardemail.net/blob/master/pop3.js)

### Notre automatisation de l'infrastructure {#our-infrastructure-automation}

* [Tous nos playbooks Ansible](https://github.com/forwardemail/forwardemail.net/tree/master/ansible/playbooks)
* [Renforcement de la sécurité](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Configuration de Node.js](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)
* [Configuration de la base de données](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

### Nos articles de blog technique {#our-technical-blog-posts}

* [Analyse de l'écosystème NPM](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)
* [Mise en œuvre du système de paiement](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal)
* [Guide technique sur la confidentialité des e-mails](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [Formulaires de contact JavaScript](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [Intégration de la messagerie React](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)
* [Guide des solutions auto-hébergées](https://forwardemail.net/blog/docs/self-hosted-solution)

### Nos études de cas d'entreprise {#our-enterprise-case-studies}

* [Mise en œuvre de la Fondation Linux](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [Étude de cas canonique Ubuntu](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [Conformité du gouvernement fédéral](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)
* [Systèmes de messagerie pour anciens élèves](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)