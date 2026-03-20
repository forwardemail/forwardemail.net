# Comment optimiser l'infrastructure de production Node.js : meilleures pratiques {#how-to-optimize-nodejs-production-infrastructure-best-practices}

<img loading="lazy" src="/img/articles/nodejs-performance.webp" alt="Guide d'optimisation des performances Node.js" class="rounded-lg" />


## Table des matières {#table-of-contents}

* [Avant-propos](#foreword)
* [Notre révolution d'optimisation des performances monocœur de 573 %](#our-573-single-core-performance-optimization-revolution)
  * [Pourquoi l'optimisation des performances monocœur est importante pour Node.js](#why-single-core-performance-optimization-matters-for-nodejs)
  * [Contenu connexe](#related-content)
* [Configuration de l'environnement de production Node.js : notre stack technologique](#nodejs-production-environment-setup-our-technology-stack)
  * [Gestionnaire de paquets : pnpm pour l'efficacité en production](#package-manager-pnpm-for-production-efficiency)
  * [Framework web : Koa pour une production Node.js moderne](#web-framework-koa-for-modern-nodejs-production)
  * [Traitement des tâches en arrière-plan : Bree pour la fiabilité en production](#background-job-processing-bree-for-production-reliability)
  * [Gestion des erreurs : @hapi/boom pour la fiabilité en production](#error-handling-hapiboom-for-production-reliability)
* [Comment surveiller les applications Node.js en production](#how-to-monitor-nodejs-applications-in-production)
  * [Surveillance Node.js au niveau système en production](#system-level-nodejs-production-monitoring)
  * [Surveillance au niveau application pour la production Node.js](#application-level-monitoring-for-nodejs-production)
  * [Surveillance spécifique à l'application](#application-specific-monitoring)
* [Surveillance de la production Node.js avec les contrôles de santé PM2](#nodejs-production-monitoring-with-pm2-health-checks)
  * [Notre système de contrôle de santé PM2](#our-pm2-health-check-system)
  * [Notre configuration PM2 pour la production](#our-pm2-production-configuration)
  * [Déploiement automatisé PM2](#automated-pm2-deployment)
* [Gestion et classification des erreurs en production](#production-error-handling-and-classification-system)
  * [Notre implémentation isCodeBug pour la production](#our-iscodebug-implementation-for-production)
  * [Intégration avec notre journalisation en production](#integration-with-our-production-logging)
  * [Contenu connexe](#related-content-1)
* [Débogage avancé des performances avec v8-profiler-next et cpupro](#advanced-performance-debugging-with-v8-profiler-next-and-cpupro)
  * [Notre approche de profilage pour la production Node.js](#our-profiling-approach-for-nodejs-production)
  * [Comment nous implémentons l'analyse des instantanés de tas](#how-we-implement-heap-snapshot-analysis)
  * [Flux de travail de débogage des performances](#performance-debugging-workflow)
  * [Implémentation recommandée pour votre application Node.js](#recommended-implementation-for-your-nodejs-application)
  * [Intégration avec notre surveillance en production](#integration-with-our-production-monitoring)
* [Sécurité de l'infrastructure de production Node.js](#nodejs-production-infrastructure-security)
  * [Sécurité au niveau système pour la production Node.js](#system-level-security-for-nodejs-production)
  * [Sécurité des applications pour les applications Node.js](#application-security-for-nodejs-applications)
  * [Automatisation de la sécurité de l'infrastructure](#infrastructure-security-automation)
  * [Notre contenu sur la sécurité](#our-security-content)
* [Architecture de base de données pour les applications Node.js](#database-architecture-for-nodejs-applications)
  * [Implémentation SQLite pour la production Node.js](#sqlite-implementation-for-nodejs-production)
  * [Implémentation MongoDB pour la production Node.js](#mongodb-implementation-for-nodejs-production)
* [Traitement des tâches en arrière-plan en production Node.js](#nodejs-production-background-job-processing)
  * [Notre configuration serveur Bree pour la production](#our-bree-server-setup-for-production)
  * [Exemples de tâches en production](#production-job-examples)
  * [Nos modèles de planification de tâches pour la production Node.js](#our-job-scheduling-patterns-for-nodejs-production)
* [Maintenance automatisée pour les applications Node.js en production](#automated-maintenance-for-production-nodejs-applications)
  * [Notre implémentation de nettoyage](#our-cleanup-implementation)
  * [Gestion de l'espace disque pour la production Node.js](#disk-space-management-for-nodejs-production)
  * [Automatisation de la maintenance de l'infrastructure](#infrastructure-maintenance-automation)
* [Guide d'implémentation du déploiement en production Node.js](#nodejs-production-deployment-implementation-guide)
  * [Étudiez notre code réel pour les meilleures pratiques en production](#study-our-actual-code-for-production-best-practices)
  * [Apprenez de nos articles de blog](#learn-from-our-blog-posts)
  * [Automatisation de l'infrastructure pour la production Node.js](#infrastructure-automation-for-nodejs-production)
  * [Nos études de cas](#our-case-studies)
* [Conclusion : meilleures pratiques de déploiement en production Node.js](#conclusion-nodejs-production-deployment-best-practices)
* [Liste complète des ressources pour la production Node.js](#complete-resource-list-for-nodejs-production)
  * [Nos fichiers d'implémentation principaux](#our-core-implementation-files)
  * [Nos implémentations serveur](#our-server-implementations)
  * [Notre automatisation de l'infrastructure](#our-infrastructure-automation)
  * [Nos articles techniques de blog](#our-technical-blog-posts)
  * [Nos études de cas d'entreprise](#our-enterprise-case-studies)
## Avant-propos {#foreword}

Chez Forward Email, nous avons passé des années à perfectionner notre configuration d'environnement de production Node.js. Ce guide complet partage nos meilleures pratiques éprouvées pour le déploiement en production de Node.js, en mettant l'accent sur l'optimisation des performances, la surveillance et les leçons que nous avons apprises en faisant évoluer des applications Node.js pour gérer des millions de transactions quotidiennes.


## Notre révolution d'optimisation des performances monocœur de 573 % {#our-573-single-core-performance-optimization-revolution}

Lorsque nous sommes passés des processeurs Intel aux processeurs AMD Ryzen, nous avons obtenu une **amélioration des performances de 573 %** dans nos applications Node.js. Ce n'était pas simplement une optimisation mineure — cela a fondamentalement changé la façon dont nos applications Node.js fonctionnent en production et démontre l'importance de l'optimisation des performances monocœur pour toute application Node.js.

> \[!TIP]
> Pour les meilleures pratiques de déploiement en production Node.js, le choix du matériel est crucial. Nous avons spécifiquement choisi l'hébergement DataPacket pour leur disponibilité des processeurs AMD Ryzen car la performance monocœur est essentielle pour les applications Node.js puisque l'exécution de JavaScript est mono-thread.

### Pourquoi l'optimisation des performances monocœur est importante pour Node.js {#why-single-core-performance-optimization-matters-for-nodejs}

Notre migration d'Intel vers AMD Ryzen a entraîné :

* **Une amélioration des performances de 573 %** dans le traitement des requêtes (documentée dans [le GitHub Issue #1519 de notre page de statut](https://github.com/forwardemail/status.forwardemail.net/issues/1519#issuecomment-2652177671))
* **Élimination des délais de traitement** pour des réponses quasi instantanées (mentionné dans [GitHub Issue #298](https://github.com/forwardemail/forwardemail.net/issues/298))
* **Un meilleur rapport qualité-prix** pour les environnements de production Node.js
* **Des temps de réponse améliorés** sur tous nos points d'accès applicatifs

Le gain de performance a été si important que nous considérons désormais les processeurs AMD Ryzen comme essentiels pour tout déploiement sérieux de Node.js en production, que vous exécutiez des applications web, des API, des microservices ou toute autre charge de travail Node.js.

### Contenu connexe {#related-content}

Pour plus de détails sur nos choix d'infrastructure, consultez :

* [Meilleur service de redirection d'email](https://forwardemail.net/blog/docs/best-email-forwarding-service) - Comparaisons de performances
* [Solution auto-hébergée](https://forwardemail.net/blog/docs/self-hosted-solution) - Recommandations matérielles


## Configuration de l'environnement de production Node.js : notre stack technologique {#nodejs-production-environment-setup-our-technology-stack}

Nos meilleures pratiques de déploiement en production Node.js incluent des choix technologiques délibérés basés sur des années d'expérience en production. Voici ce que nous utilisons et pourquoi ces choix s'appliquent à toute application Node.js :

### Gestionnaire de paquets : pnpm pour une efficacité en production {#package-manager-pnpm-for-production-efficiency}

**Ce que nous utilisons :** [`pnpm`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json) (version figée)

Nous avons choisi pnpm plutôt que npm et yarn pour notre configuration d'environnement de production Node.js parce que :

* **Des temps d'installation plus rapides** dans les pipelines CI/CD
* **Efficacité de l'espace disque** grâce au hard linking
* **Résolution stricte des dépendances** qui empêche les dépendances fantômes
* **Meilleure performance** dans les déploiements en production

> \[!NOTE]
> Dans le cadre de nos meilleures pratiques de déploiement en production Node.js, nous fixons des versions exactes des outils critiques comme pnpm pour garantir un comportement cohérent sur tous les environnements et les machines des membres de l'équipe.

**Détails de l'implémentation :**

* [Notre configuration package.json](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [Notre article de blog sur l'écosystème NPM](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)

### Framework web : Koa pour une production Node.js moderne {#web-framework-koa-for-modern-nodejs-production}

**Ce que nous utilisons :**

* [`@koa/router`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@koa/multer`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/koa-simple-ratelimit`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
Nous avons choisi Koa plutôt qu’Express pour notre infrastructure de production Node.js en raison de son support moderne d’async/await et de sa composition de middleware plus propre. Notre fondateur Nick Baugh a contribué à la fois à Express et à Koa, ce qui nous donne une connaissance approfondie des deux frameworks pour une utilisation en production.

Ces modèles s’appliquent que vous construisiez des API REST, des serveurs GraphQL, des applications web ou des microservices.

**Nos exemples d’implémentation :**

* [Configuration du serveur web](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [Configuration du serveur API](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Guide d’implémentation des formulaires de contact](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)

### Traitement des tâches en arrière-plan : Bree pour la fiabilité en production {#background-job-processing-bree-for-production-reliability}

**Ce que nous utilisons :** planificateur [`bree`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Nous avons créé et maintenons Bree car les planificateurs de tâches existants ne répondaient pas à nos besoins en matière de support des threads workers et des fonctionnalités modernes de JavaScript dans les environnements Node.js de production. Cela s’applique à toute application Node.js nécessitant un traitement en arrière-plan, des tâches planifiées ou des threads workers.

**Nos exemples d’implémentation :**

* [Configuration du serveur Bree](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [Toutes nos définitions de tâches](https://github.com/forwardemail/forwardemail.net/tree/master/jobs)
* [Tâche de vérification de santé PM2](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)
* [Implémentation de la tâche de nettoyage](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

### Gestion des erreurs : @hapi/boom pour la fiabilité en production {#error-handling-hapiboom-for-production-reliability}

**Ce que nous utilisons :** [`@hapi/boom`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Nous utilisons @hapi/boom pour des réponses d’erreur structurées dans toutes nos applications Node.js en production. Ce modèle fonctionne pour toute application Node.js nécessitant une gestion cohérente des erreurs.

**Nos exemples d’implémentation :**

* [Assistant de classification des erreurs](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
* [Implémentation du logger](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)


## Comment surveiller les applications Node.js en production {#how-to-monitor-nodejs-applications-in-production}

Notre approche de la surveillance des applications Node.js en production a évolué au fil des années d’exploitation à grande échelle. Nous mettons en œuvre la surveillance à plusieurs niveaux pour garantir la fiabilité et la performance de tout type d’application Node.js.

### Surveillance Node.js au niveau système en production {#system-level-nodejs-production-monitoring}

**Notre implémentation principale :** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

**Ce que nous utilisons :** [`node-os-utils`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Nos seuils de surveillance en production (tirés de notre code de production réel) :

* **Limite de taille du tas à 2 Go** avec alertes automatiques
* **Seuil d’avertissement à 25 % d’utilisation mémoire**
* **Seuil d’alerte à 80 % d’utilisation CPU**
* **Seuil d’avertissement à 75 % d’utilisation disque**

> \[!WARNING]
> Ces seuils fonctionnent pour notre configuration matérielle spécifique. Lors de la mise en œuvre de la surveillance Node.js en production, consultez notre implémentation monitor-server.js pour comprendre la logique exacte et adapter les valeurs à votre configuration.

### Surveillance au niveau application pour Node.js en production {#application-level-monitoring-for-nodejs-production}

**Notre classification des erreurs :** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

Cet assistant distingue entre :

* **Bugs réels dans le code** nécessitant une attention immédiate
* **Erreurs utilisateur** qui sont un comportement attendu
* **Défaillances de services externes** que nous ne pouvons pas contrôler

Ce modèle s’applique à toute application Node.js – applications web, API, microservices ou services en arrière-plan.
**Notre implémentation de journalisation :** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

Nous mettons en œuvre une rédaction complète des champs pour protéger les informations sensibles tout en maintenant des capacités de débogage utiles dans notre environnement de production Node.js.

### Surveillance spécifique à l'application {#application-specific-monitoring}

**Nos implémentations serveur :**

* [Serveur SMTP](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)
* [Serveur IMAP](https://github.com/forwardemail/forwardemail.net/blob/master/imap.js)
* [Serveur POP3](https://github.com/forwardemail/forwardemail.net/blob/master/pop3.js)

**Surveillance de la file d'attente :** Nous appliquons des limites de file d'attente de 5 Go et des délais d'attente de 180 secondes pour le traitement des requêtes afin d'éviter l'épuisement des ressources. Ces modèles s'appliquent à toute application Node.js avec des files d'attente ou un traitement en arrière-plan.


## Surveillance de production Node.js avec les contrôles de santé PM2 {#nodejs-production-monitoring-with-pm2-health-checks}

Nous avons affiné notre configuration d'environnement de production Node.js avec PM2 au fil des années d'expérience en production. Nos contrôles de santé PM2 sont essentiels pour maintenir la fiabilité dans toute application Node.js.

### Notre système de contrôle de santé PM2 {#our-pm2-health-check-system}

**Notre implémentation principale :** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

Notre surveillance de production Node.js avec les contrôles de santé PM2 inclut :

* **Exécution toutes les 20 minutes** via une planification cron
* **Nécessite un temps de fonctionnement minimum de 15 minutes** avant de considérer un processus comme sain
* **Valide le statut du processus et l'utilisation de la mémoire**
* **Redémarre automatiquement les processus en échec**
* **Prévient les boucles de redémarrage** grâce à un contrôle de santé intelligent

> \[!CAUTION]
> Pour les meilleures pratiques de déploiement en production Node.js, nous exigeons un temps de fonctionnement de plus de 15 minutes avant de considérer un processus comme sain afin d'éviter les boucles de redémarrage. Cela prévient les défaillances en cascade lorsque les processus rencontrent des problèmes de mémoire ou autres.

### Notre configuration de production PM2 {#our-pm2-production-configuration}

**Notre configuration d'écosystème :** Étudiez nos fichiers de démarrage serveur pour la configuration de l'environnement de production Node.js :

* [Serveur Web](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [Serveur API](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Planificateur Bree](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [Serveur SMTP](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)

Ces modèles s'appliquent que vous exécutiez des applications Express, des serveurs Koa, des API GraphQL ou toute autre application Node.js.

### Déploiement automatisé PM2 {#automated-pm2-deployment}

**Déploiement PM2 :** [`ansible/playbooks/node.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

Nous automatisons toute notre configuration PM2 via Ansible pour garantir des déploiements de production Node.js cohérents sur tous nos serveurs.


## Système de gestion et classification des erreurs en production {#production-error-handling-and-classification-system}

L'une de nos meilleures pratiques de déploiement en production Node.js les plus précieuses est la classification intelligente des erreurs applicable à toute application Node.js :

### Notre implémentation isCodeBug pour la production {#our-iscodebug-implementation-for-production}

**Source :** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

Cet assistant fournit une classification intelligente des erreurs pour les applications Node.js en production afin de :

* **Prioriser les bugs réels** par rapport aux erreurs utilisateur
* **Améliorer notre réponse aux incidents** en se concentrant sur les problèmes réels
* **Réduire la fatigue des alertes** causée par les erreurs utilisateur attendues
* **Mieux comprendre** les problèmes liés à l'application versus ceux générés par l'utilisateur

Ce modèle fonctionne pour toute application Node.js - que vous développiez des sites e-commerce, des plateformes SaaS, des API ou des microservices.

### Intégration avec notre journalisation de production {#integration-with-our-production-logging}

**Notre intégration du logger :** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
Notre journal utilise `isCodeBug` pour déterminer les niveaux d'alerte et la rédaction des champs, garantissant que nous soyons informés des vrais problèmes tout en filtrant le bruit dans notre environnement de production Node.js.

### Contenu Connexe {#related-content-1}

En savoir plus sur nos modèles de gestion des erreurs :

* [Construire un système de paiement fiable](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal) - Modèles de gestion des erreurs
* [Protection de la vie privée par email](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation) - Gestion des erreurs de sécurité


## Débogage avancé des performances avec v8-profiler-next et cpupro {#advanced-performance-debugging-with-v8-profiler-next-and-cpupro}

Nous utilisons des outils de profilage avancés pour analyser les instantanés du tas et déboguer les problèmes d'OOM (Out of Memory), les goulets d'étranglement de performance et les problèmes de mémoire Node.js dans notre environnement de production. Ces outils sont essentiels pour toute application Node.js rencontrant des fuites de mémoire ou des problèmes de performance.

### Notre approche de profilage pour la production Node.js {#our-profiling-approach-for-nodejs-production}

**Outils que nous recommandons :**

* [`v8-profiler-next`](https://www.npmjs.com/package/v8-profiler-next) - Pour générer des instantanés du tas et des profils CPU
* [`cpupro`](https://github.com/discoveryjs/cpupro) - Pour analyser les profils CPU et les instantanés du tas

> \[!TIP]
> Nous utilisons v8-profiler-next et cpupro ensemble pour créer un flux de travail complet de débogage des performances pour nos applications Node.js. Cette combinaison nous aide à identifier les fuites de mémoire, les goulets d'étranglement de performance et à optimiser notre code de production.

### Comment nous implémentons l'analyse des instantanés du tas {#how-we-implement-heap-snapshot-analysis}

**Notre implémentation de surveillance :** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

Notre surveillance en production inclut la génération automatique d'instantanés du tas lorsque les seuils de mémoire sont dépassés. Cela nous aide à déboguer les problèmes d'OOM avant qu'ils ne provoquent des plantages de l'application.

**Modèles clés d'implémentation :**

* **Instantanés automatiques** lorsque la taille du tas dépasse le seuil de 2 Go
* **Profilage basé sur les signaux** pour une analyse à la demande en production
* **Politiques de rétention** pour gérer le stockage des instantanés
* **Intégration avec nos tâches de nettoyage** pour une maintenance automatisée

### Flux de travail de débogage des performances {#performance-debugging-workflow}

**Étudiez notre implémentation réelle :**

* [Implémentation du serveur de surveillance](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js) - Surveillance du tas et génération d'instantanés
* [Tâche de nettoyage](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js) - Rétention et nettoyage des instantanés
* [Intégration du journal](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js) - Journalisation des performances

### Implémentation recommandée pour votre application Node.js {#recommended-implementation-for-your-nodejs-application}

**Pour l'analyse des instantanés du tas :**

1. **Installer v8-profiler-next** pour la génération d'instantanés
2. **Utiliser cpupro** pour analyser les instantanés générés
3. **Implémenter des seuils de surveillance** similaires à notre monitor-server.js
4. **Mettre en place un nettoyage automatisé** pour gérer le stockage des instantanés
5. **Créer des gestionnaires de signaux** pour le profilage à la demande en production

**Pour le profilage CPU :**

1. **Générer des profils CPU** pendant les périodes de forte charge
2. **Analyser avec cpupro** pour identifier les goulets d'étranglement
3. **Se concentrer sur les chemins chauds** et les opportunités d'optimisation
4. **Surveiller avant/après** les améliorations de performance

> \[!WARNING]
> La génération d'instantanés du tas et de profils CPU peut impacter les performances. Nous recommandons d'implémenter un contrôle de débit et de n'activer le profilage que lors de l'investigation de problèmes spécifiques ou pendant les fenêtres de maintenance.

### Intégration avec notre surveillance de production {#integration-with-our-production-monitoring}

Nos outils de profilage s'intègrent à notre stratégie de surveillance globale :

* **Déclenchement automatique** basé sur les seuils de mémoire/CPU
* **Intégration des alertes** lorsque des problèmes de performance sont détectés
* **Analyse historique** pour suivre les tendances de performance dans le temps
* **Corrélation avec les métriques applicatives** pour un débogage complet
Cette approche nous a aidés à identifier et résoudre des fuites de mémoire, optimiser les chemins de code critiques et maintenir des performances stables dans notre environnement de production Node.js.


## Sécurité de l'infrastructure de production Node.js {#nodejs-production-infrastructure-security}

Nous mettons en œuvre une sécurité complète pour notre infrastructure de production Node.js via l'automatisation Ansible. Ces pratiques s'appliquent à toute application Node.js :

### Sécurité au niveau système pour la production Node.js {#system-level-security-for-nodejs-production}

**Notre implémentation Ansible :** [`ansible/playbooks/security.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)

Nos principales mesures de sécurité pour les environnements de production Node.js :

* **Swap désactivé** pour empêcher l'écriture de données sensibles sur le disque
* **Core dumps désactivés** pour éviter les vidages mémoire contenant des informations sensibles
* **Stockage USB bloqué** pour empêcher l'accès non autorisé aux données
* **Ajustement des paramètres du noyau** pour la sécurité et la performance

> \[!WARNING]
> Lors de la mise en œuvre des meilleures pratiques de déploiement en production Node.js, la désactivation du swap peut entraîner des arrêts pour manque de mémoire si votre application dépasse la RAM disponible. Nous surveillons attentivement l'utilisation de la mémoire et dimensionnons nos serveurs en conséquence.

### Sécurité des applications pour les applications Node.js {#application-security-for-nodejs-applications}

**Notre redaction des champs de logs :** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

Nous rédigeons les champs sensibles des logs, y compris mots de passe, jetons, clés API et informations personnelles. Cela protège la vie privée des utilisateurs tout en maintenant les capacités de débogage dans tout environnement de production Node.js.

### Automatisation de la sécurité de l'infrastructure {#infrastructure-security-automation}

**Notre configuration complète Ansible pour la production Node.js :**

* [Playbook de sécurité](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Gestion des clés SSH](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/ssh-keys.yml)
* [Gestion des certificats](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/certificates.yml)
* [Configuration DKIM](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/dkim.yml)

### Notre contenu sur la sécurité {#our-security-content}

En savoir plus sur notre approche de la sécurité :

* [Meilleures entreprises d'audit de sécurité](https://forwardemail.net/blog/docs/best-security-audit-companies)
* [Email chiffré quantique sécurisé](https://forwardemail.net/blog/docs/best-quantum-safe-encrypted-email-service)
* [Pourquoi la sécurité email open source](https://forwardemail.net/blog/docs/why-open-source-email-security-privacy)


## Architecture de base de données pour les applications Node.js {#database-architecture-for-nodejs-applications}

Nous utilisons une approche hybride de base de données optimisée pour nos applications Node.js. Ces modèles peuvent être adaptés à toute application Node.js :

### Implémentation SQLite pour la production Node.js {#sqlite-implementation-for-nodejs-production}

**Ce que nous utilisons :**

* [`better-sqlite3`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`better-sqlite3-multiple-ciphers`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

**Notre configuration :** [`ansible/playbooks/sqlite.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

Nous utilisons SQLite pour les données spécifiques aux utilisateurs dans nos applications Node.js car il offre :

* **Isolation des données** par utilisateur/locataire
* **Meilleure performance** pour les requêtes mono-utilisateur
* **Sauvegarde** et migration simplifiées
* **Complexité réduite** comparée aux bases de données partagées

Ce modèle fonctionne bien pour les applications SaaS, les systèmes multi-locataires ou toute application Node.js nécessitant une isolation des données.

### Implémentation MongoDB pour la production Node.js {#mongodb-implementation-for-nodejs-production}

**Ce que nous utilisons :**

* [`@ladjs/mongoose`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/mongoose-error-messages`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@zainundin/mongoose-factory`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
**Notre implémentation de configuration :** [`helpers/setup-mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/setup-mongoose.js)

**Notre configuration :** [`config/mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/config/mongoose.js)

Nous utilisons MongoDB pour les données applicatives dans notre environnement de production Node.js car il offre :

* **Schéma flexible** pour des structures de données évolutives
* **Meilleure performance** pour les requêtes complexes
* **Capacités de mise à l’échelle horizontale**
* **Langage de requête riche**

> \[!NOTE]
> Notre approche hybride est optimisée pour notre cas d’utilisation spécifique. Étudiez nos modèles d’utilisation réels de la base de données dans la base de code pour comprendre si cette approche convient aux besoins de votre application Node.js.


## Traitement des tâches en arrière-plan en production Node.js {#nodejs-production-background-job-processing}

Nous avons construit notre architecture de tâches en arrière-plan autour de Bree pour un déploiement fiable en production Node.js. Cela s’applique à toute application Node.js nécessitant un traitement en arrière-plan :

### Notre configuration du serveur Bree pour la production {#our-bree-server-setup-for-production}

**Notre implémentation principale :** [`bree.js`](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)

**Notre déploiement Ansible :** [`ansible/playbooks/bree.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/bree.yml)

### Exemples de tâches en production {#production-job-examples}

**Surveillance de la santé :** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

**Automatisation du nettoyage :** [`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

**Toutes nos tâches :** [Parcourez notre répertoire complet de tâches](https://github.com/forwardemail/forwardemail.net/tree/master/jobs)

Ces modèles s’appliquent à toute application Node.js nécessitant :

* Tâches planifiées (traitement de données, rapports, nettoyage)
* Traitement en arrière-plan (redimensionnement d’images, envoi d’emails, importations de données)
* Surveillance de la santé et maintenance
* Utilisation de threads workers pour les tâches intensives en CPU

### Nos modèles de planification de tâches pour la production Node.js {#our-job-scheduling-patterns-for-nodejs-production}

Étudiez nos modèles réels de planification de tâches dans notre répertoire de tâches pour comprendre :

* Comment nous implémentons une planification de type cron en production Node.js
* Notre gestion des erreurs et logique de réessai
* Comment nous utilisons les threads workers pour les tâches intensives en CPU


## Maintenance automatisée pour les applications Node.js en production {#automated-maintenance-for-production-nodejs-applications}

Nous mettons en œuvre une maintenance proactive pour prévenir les problèmes courants en production Node.js. Ces modèles s’appliquent à toute application Node.js :

### Notre implémentation de nettoyage {#our-cleanup-implementation}

**Source :** [`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

Notre maintenance automatisée pour les applications Node.js en production cible :

* **Fichiers temporaires** de plus de 24 heures
* **Fichiers journaux** au-delà des limites de rétention
* **Fichiers cache** et données temporaires
* **Fichiers téléchargés** qui ne sont plus nécessaires
* **Instantanés de heap** issus du débogage de performance

Ces modèles s’appliquent à toute application Node.js générant des fichiers temporaires, des journaux ou des données mises en cache.

### Gestion de l’espace disque pour la production Node.js {#disk-space-management-for-nodejs-production}

**Nos seuils de surveillance :** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

* **Limites de file d’attente** pour le traitement en arrière-plan
* **Seuil d’alerte à 75 % d’utilisation du disque**
* **Nettoyage automatique** lorsque les seuils sont dépassés

### Automatisation de la maintenance de l’infrastructure {#infrastructure-maintenance-automation}

**Notre automatisation Ansible pour la production Node.js :**

* [Déploiement de l’environnement](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/env.yml)
* [Gestion des clés de déploiement](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/deployment-keys.yml)


## Guide d’implémentation du déploiement en production Node.js {#nodejs-production-deployment-implementation-guide}
### Étudiez Notre Code Réel pour les Meilleures Pratiques en Production {#study-our-actual-code-for-production-best-practices}

**Commencez par ces fichiers clés pour la configuration de l’environnement de production Node.js :**

1. **Configuration :** [`config/index.js`](https://github.com/forwardemail/forwardemail.net/blob/master/config/index.js)
2. **Surveillance :** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)
3. **Gestion des erreurs :** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
4. **Journalisation :** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
5. **Santé du processus :** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

### Apprenez de Nos Articles de Blog {#learn-from-our-blog-posts}

**Nos guides techniques d’implémentation pour la production Node.js :**

* [Écosystème des packages NPM](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)
* [Construction de systèmes de paiement](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal)
* [Implémentation de la confidentialité des emails](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [Formulaires de contact JavaScript](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [Intégration d’emails avec React](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)

### Automatisation de l’Infrastructure pour la Production Node.js {#infrastructure-automation-for-nodejs-production}

**Nos playbooks Ansible à étudier pour le déploiement en production Node.js :**

* [Répertoire complet des playbooks](https://github.com/forwardemail/forwardemail.net/tree/master/ansible/playbooks)
* [Renforcement de la sécurité](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Configuration Node.js](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

### Nos Études de Cas {#our-case-studies}

**Nos implémentations en entreprise :**

* [Étude de cas Linux Foundation](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [Étude de cas Canonical Ubuntu](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [Redirection d’emails pour anciens élèves](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)


## Conclusion : Meilleures Pratiques pour le Déploiement en Production Node.js {#conclusion-nodejs-production-deployment-best-practices}

Notre infrastructure de production Node.js démontre que les applications Node.js peuvent atteindre une fiabilité de niveau entreprise grâce à :

* **Choix matériels éprouvés** (AMD Ryzen pour une optimisation de performance monocœur de 573 %)
* **Surveillance de production Node.js éprouvée** avec seuils spécifiques et réponses automatisées
* **Classification intelligente des erreurs** pour améliorer la réponse aux incidents en production
* **Débogage avancé des performances** avec v8-profiler-next et cpupro pour la prévention des OOM
* **Renforcement complet de la sécurité** via l’automatisation Ansible
* **Architecture hybride de base de données** optimisée pour les besoins applicatifs
* **Maintenance automatisée** pour prévenir les problèmes courants en production Node.js

**Conclusion clé :** Étudiez nos fichiers d’implémentation réels et nos articles de blog plutôt que de suivre des meilleures pratiques génériques. Notre base de code fournit des modèles concrets pour le déploiement en production Node.js qui peuvent être adaptés à toute application Node.js - applications web, API, microservices ou services en arrière-plan.


## Liste Complète des Ressources pour la Production Node.js {#complete-resource-list-for-nodejs-production}

### Nos Fichiers d’Implémentation Principaux {#our-core-implementation-files}

* [Configuration principale](https://github.com/forwardemail/forwardemail.net/blob/master/config/index.js)
* [Dépendances des packages](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [Surveillance du serveur](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)
* [Classification des erreurs](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
* [Système de journalisation](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
* [Contrôles de santé PM2](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)
* [Nettoyage automatisé](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)
### Nos Implémentations Serveur {#our-server-implementations}

* [Serveur Web](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [Serveur API](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Planificateur Bree](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [Serveur SMTP](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)
* [Serveur IMAP](https://github.com/forwardemail/forwardemail.net/blob/master/imap.js)
* [Serveur POP3](https://github.com/forwardemail/forwardemail.net/blob/master/pop3.js)

### Notre Automatisation d'Infrastructure {#our-infrastructure-automation}

* [Tous nos playbooks Ansible](https://github.com/forwardemail/forwardemail.net/tree/master/ansible/playbooks)
* [Renforcement de la sécurité](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Configuration Node.js](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)
* [Configuration de la base de données](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

### Nos Articles Techniques de Blog {#our-technical-blog-posts}

* [Analyse de l'écosystème NPM](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)
* [Implémentation du système de paiement](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal)
* [Guide technique sur la confidentialité des emails](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [Formulaires de contact JavaScript](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [Intégration d'email React](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)
* [Guide de solution auto-hébergée](https://forwardemail.net/blog/docs/self-hosted-solution)

### Nos Études de Cas Entreprises {#our-enterprise-case-studies}

* [Implémentation Linux Foundation](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [Étude de cas Canonical Ubuntu](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [Conformité gouvernement fédéral](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)
* [Systèmes d'email pour anciens élèves](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)
