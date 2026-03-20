# Email Auto-Hébergé : Engagement envers l'Open Source {#self-hosted-email-commitment-to-open-source}

<img loading="lazy" src="/img/articles/self-hosted.webp" alt="Illustration de solution email auto-hébergée" class="rounded-lg" />


## Table des Matières {#table-of-contents}

* [Avant-propos](#foreword)
* [Pourquoi l'Email Auto-Hébergé est Important](#why-self-hosted-email-matters)
  * [Le Problème des Services Email Traditionnels](#the-problem-with-traditional-email-services)
  * [L'Alternative Auto-Hébergée](#the-self-hosted-alternative)
* [Notre Implémentation Auto-Hébergée : Aperçu Technique](#our-self-hosted-implementation-technical-overview)
  * [Architecture Basée sur Docker pour Simplicité et Portabilité](#docker-based-architecture-for-simplicity-and-portability)
  * [Installation par Script Bash : Accessibilité et Sécurité](#bash-script-installation-accessibility-meets-security)
  * [Chiffrement Quantum-Safe pour une Confidentialité Durable](#quantum-safe-encryption-for-future-proof-privacy)
  * [Maintenance et Mises à Jour Automatisées](#automated-maintenance-and-updates)
* [L'Engagement Open Source](#the-open-source-commitment)
* [Auto-Hébergé vs. Géré : Faire le Bon Choix](#self-hosted-vs-managed-making-the-right-choice)
  * [La Réalité de l'Auto-Hébergement d'Email](#the-reality-of-self-hosting-email)
  * [Quand Choisir Notre Service Géré](#when-to-choose-our-managed-service)
* [Commencer avec Forward Email Auto-Hébergé](#getting-started-with-self-hosted-forward-email)
  * [Exigences Système](#system-requirements)
  * [Étapes d'Installation](#installation-steps)
* [L'Avenir de l'Email Auto-Hébergé](#the-future-of-self-hosted-email)
* [Conclusion : La Liberté de l'Email pour Tous](#conclusion-email-freedom-for-everyone)
* [Références](#references)


## Avant-propos {#foreword}

Dans le paysage numérique actuel, l'email reste la pierre angulaire de notre identité et communication en ligne. Pourtant, à mesure que les préoccupations liées à la vie privée augmentent, de nombreux utilisateurs font face à un choix difficile : la commodité au prix de la vie privée, ou la vie privée au prix de la commodité. Chez Forward Email, nous avons toujours cru que vous ne devriez pas avoir à choisir entre les deux.

Aujourd'hui, nous sommes ravis d'annoncer une étape importante dans notre parcours : le lancement de notre solution d'email auto-hébergée. Cette fonctionnalité représente notre engagement le plus profond envers les principes open source, une conception axée sur la confidentialité, et l'autonomisation des utilisateurs. Avec notre option auto-hébergée, nous mettons tout le pouvoir et le contrôle de votre communication email directement entre vos mains.

Cet article de blog explore la philosophie derrière notre solution auto-hébergée, son implémentation technique, et pourquoi elle est importante pour les utilisateurs qui privilégient à la fois la confidentialité et la propriété dans leurs communications numériques.


## Pourquoi l'Email Auto-Hébergé est Important {#why-self-hosted-email-matters}

Notre solution d'email auto-hébergée est l'expression la plus claire de notre conviction que la vraie confidentialité signifie contrôle, et que le contrôle commence par l'open source. Pour les utilisateurs qui exigent une pleine propriété de leurs communications numériques, l'auto-hébergement n'est plus une idée marginale — c'est un droit essentiel. Nous sommes fiers de soutenir cette conviction avec une plateforme entièrement ouverte et vérifiable que vous pouvez exploiter selon vos propres conditions.

### Le Problème des Services Email Traditionnels {#the-problem-with-traditional-email-services}

Les services email traditionnels présentent plusieurs défis fondamentaux pour les utilisateurs soucieux de leur vie privée :

1. **Exigences de Confiance** : Vous devez faire confiance au fournisseur pour ne pas accéder, analyser ou partager vos données
2. **Contrôle Centralisé** : Votre accès peut être révoqué à tout moment et pour n'importe quelle raison
3. **Vulnérabilité à la Surveillance** : Les services centralisés sont des cibles privilégiées pour la surveillance
4. **Transparence Limitée** : La plupart des services utilisent des logiciels propriétaires et fermés
5. **Verrouillage Fournisseur** : Migrer loin de ces services peut être difficile voire impossible

Même les fournisseurs d'email "axés sur la confidentialité" échouent souvent en ne rendant open source que leurs applications frontend tout en gardant leurs systèmes backend propriétaires et fermés. Cela crée un important fossé de confiance — on vous demande de croire leurs promesses de confidentialité sans pouvoir les vérifier.

### L'Alternative Auto-Hébergée {#the-self-hosted-alternative}
L’auto-hébergement de votre email offre une approche fondamentalement différente :

1. **Contrôle complet** : Vous possédez et contrôlez toute l’infrastructure email
2. **Confidentialité vérifiable** : L’ensemble du système est transparent et auditable
3. **Aucune confiance requise** : Vous n’avez pas besoin de faire confiance à un tiers pour vos communications
4. **Liberté de personnalisation** : Adaptez le système à vos besoins spécifiques
5. **Résilience** : Votre service continue indépendamment des décisions de toute entreprise

Comme l’a dit un utilisateur : « Auto-héberger mon email est l’équivalent numérique de cultiver ma propre nourriture — cela demande plus de travail, mais je sais exactement ce qu’il y a dedans. »


## Notre implémentation auto-hébergée : aperçu technique {#our-self-hosted-implementation-technical-overview}

Notre solution email auto-hébergée est construite sur les mêmes principes de confidentialité prioritaire qui guident tous nos produits. Explorons l’implémentation technique qui rend cela possible.

### Architecture basée sur Docker pour simplicité et portabilité {#docker-based-architecture-for-simplicity-and-portability}

Nous avons emballé toute notre infrastructure email avec Docker, ce qui facilite son déploiement sur pratiquement n’importe quel système Linux. Cette approche conteneurisée offre plusieurs avantages clés :

1. **Déploiement simplifié** : Une seule commande installe toute l’infrastructure
2. **Environnement cohérent** : Élimine les problèmes du type « ça marche sur ma machine »
3. **Composants isolés** : Chaque service fonctionne dans son propre conteneur pour la sécurité
4. **Mises à jour faciles** : Commandes simples pour mettre à jour toute la stack
5. **Dépendances minimales** : Nécessite uniquement Docker et Docker Compose

L’architecture inclut des conteneurs pour :

* Interface web pour l’administration
* Serveur SMTP pour l’envoi d’emails
* Serveurs IMAP/POP3 pour la récupération des emails
* Serveur CalDAV pour les calendriers
* Serveur CardDAV pour les contacts
* Base de données pour le stockage de la configuration
* Redis pour la mise en cache et la performance
* SQLite pour le stockage sécurisé et chiffré des boîtes aux lettres

> \[!NOTE]
> N’oubliez pas de consulter notre [guide développeur auto-hébergé](https://forwardemail.net/self-hosted)

### Installation par script Bash : accessibilité et sécurité {#bash-script-installation-accessibility-meets-security}

Nous avons conçu le processus d’installation pour qu’il soit aussi simple que possible tout en respectant les meilleures pratiques de sécurité :

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

Cette commande unique :

1. Vérifie les prérequis système
2. Vous guide dans la configuration
3. Configure les enregistrements DNS
4. Configure les certificats TLS
5. Déploie les conteneurs Docker
6. Effectue un durcissement initial de la sécurité

Pour ceux qui s’inquiètent de passer des scripts directement à bash (ce qui est légitime !), nous encourageons à examiner le script avant exécution. Il est entièrement open-source et disponible pour inspection.

### Chiffrement résistant au quantique pour une confidentialité pérenne {#quantum-safe-encryption-for-future-proof-privacy}

Comme notre service hébergé, notre solution auto-hébergée implémente un chiffrement résistant au quantique utilisant ChaCha20-Poly1305 comme algorithme pour les bases de données SQLite. Cette approche protège vos données email non seulement contre les menaces actuelles, mais aussi contre les futures attaques par calcul quantique.

Chaque boîte aux lettres est stockée dans son propre fichier de base de données SQLite chiffré, offrant une isolation complète entre les utilisateurs — un avantage de sécurité significatif par rapport aux approches traditionnelles de bases de données partagées.

### Maintenance et mises à jour automatisées {#automated-maintenance-and-updates}

Nous avons intégré des utilitaires de maintenance complets directement dans la solution auto-hébergée :

1. **Sauvegardes automatiques** : Sauvegardes programmées de toutes les données critiques
2. **Renouvellement des certificats** : Gestion automatisée des certificats Let’s Encrypt
3. **Mises à jour système** : Commande simple pour passer à la dernière version
4. **Surveillance de la santé** : Contrôles intégrés pour assurer l’intégrité du système

Ces utilitaires sont accessibles via un menu interactif simple :

```bash
# script prompt

1. Initial setup
2. Setup Backups
3. Setup Auto Upgrades
4. Renew certificates
5. Restore from Backup
6. Help
7. Exit
```


## L’engagement open-source {#the-open-source-commitment}

Notre solution email auto-hébergée, comme tous nos produits, est 100 % open-source — frontend et backend. Cela signifie :
1. **Transparence Totale** : Chaque ligne de code qui traite vos emails est disponible pour un examen public  
2. **Contributions Communautaires** : Tout le monde peut contribuer à des améliorations ou corriger des problèmes  
3. **Sécurité par l’Ouverture** : Les vulnérabilités peuvent être identifiées et corrigées par une communauté mondiale  
4. **Pas de Verrouillage Fournisseur** : Vous ne dépendez jamais de l’existence de notre entreprise  

L’ensemble du code est disponible sur GitHub à <https://github.com/forwardemail/forwardemail.net>.


## Auto-hébergé vs. Géré : Faire le Bon Choix {#self-hosted-vs-managed-making-the-right-choice}

Bien que nous soyons fiers d’offrir une option auto-hébergée, nous reconnaissons que ce n’est pas le bon choix pour tout le monde. L’auto-hébergement des emails implique de réelles responsabilités et défis :

### La Réalité de l’Auto-Hébergement des Emails {#the-reality-of-self-hosting-email}

#### Considérations Techniques {#technical-considerations}

* **Gestion du Serveur** : Vous devrez maintenir un VPS ou un serveur dédié  
* **Configuration DNS** : Une configuration DNS correcte est cruciale pour la délivrabilité  
* **Mises à Jour de Sécurité** : Rester à jour avec les correctifs de sécurité est essentiel  
* **Gestion du Spam** : Vous devrez gérer le filtrage du spam  
* **Stratégie de Sauvegarde** : Mettre en place des sauvegardes fiables est votre responsabilité  

#### Investissement en Temps {#time-investment}

* **Installation Initiale** : Temps pour configurer, vérifier et lire la documentation  
* **Maintenance Continue** : Mises à jour et surveillance occasionnelles  
* **Dépannage** : Temps occasionnel pour résoudre les problèmes  

#### Considérations Financières {#financial-considerations}

* **Coûts du Serveur** : 5 à 20 $/mois pour un VPS basique  
* **Enregistrement de Domaine** : 10 à 20 $/an  
* **Valeur du Temps** : Votre investissement en temps a une vraie valeur  

### Quand Choisir Notre Service Géré {#when-to-choose-our-managed-service}

Pour de nombreux utilisateurs, notre service géré reste la meilleure option :

1. **Commodité** : Nous gérons toute la maintenance, les mises à jour et la surveillance  
2. **Fiabilité** : Bénéficiez de notre infrastructure et expertise établies  
3. **Support** : Obtenez de l’aide en cas de problème  
4. **Délivrabilité** : Profitez de notre réputation IP établie  
5. **Rentabilité** : En tenant compte du coût du temps, notre service est souvent plus économique  

Les deux options offrent les mêmes avantages en matière de confidentialité et de transparence open-source — la différence réside simplement dans qui gère l’infrastructure.


## Commencer avec Forward Email Auto-hébergé {#getting-started-with-self-hosted-forward-email}

Prêt à prendre le contrôle de votre infrastructure email ? Voici comment commencer :

### Exigences Système {#system-requirements}

* Ubuntu 20.04 LTS ou version plus récente (recommandé)  
* Minimum 1 Go de RAM (2 Go+ recommandé)  
* 20 Go de stockage recommandé  
* Un nom de domaine que vous contrôlez  
* Adresse IP publique avec support du port 25  
* Capacité à configurer un [PTR inverse](https://www.cloudflare.com/learning/dns/dns-records/dns-ptr-record/)  
* Support IPv4 et IPv6  

> \[!TIP]  
> Nous recommandons plusieurs fournisseurs de serveurs mail sur <https://forwardemail.net/blog/docs/best-mail-server-providers> (source sur <https://github.com/forwardemail/awesome-mail-server-providers>)  

### Étapes d’Installation {#installation-steps}

1. **Exécutez le Script d’Installation** :  
   ```bash
   bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
   ```

2. **Suivez les Instructions Interactives** :  
   * Entrez votre nom de domaine  
   * Configurez les identifiants administrateur  
   * Configurez les enregistrements DNS comme indiqué  
   * Choisissez vos options de configuration préférées  

3. **Vérifiez l’Installation** :  
   Une fois l’installation terminée, vous pouvez vérifier que tout fonctionne en :  
   * Vérifiant le statut des conteneurs : `docker ps`  
   * Envoyant un email de test  
   * Vous connectant à l’interface web  


## L’Avenir de l’Email Auto-hébergé {#the-future-of-self-hosted-email}

Notre solution auto-hébergée n’est que le début. Nous nous engageons à améliorer continuellement cette offre avec :

1. **Outils d’Administration Améliorés** : Gestion web plus puissante  
2. **Options d’Authentification Supplémentaires** : Y compris le support des clés de sécurité matérielles  
3. **Surveillance Avancée** : Meilleure visibilité sur la santé et la performance du système  
4. **Déploiement Multi-Serveurs** : Options pour des configurations haute disponibilité  
5. **Améliorations Portées par la Communauté** : Intégration des contributions des utilisateurs
## Conclusion : Liberté de l’email pour tous {#conclusion-email-freedom-for-everyone}

Le lancement de notre solution d’email auto-hébergée représente une étape importante dans notre mission de fournir des services email axés sur la confidentialité et la transparence. Que vous choisissiez notre service géré ou l’option auto-hébergée, vous bénéficiez de notre engagement indéfectible envers les principes open-source et une conception axée sur la confidentialité.

L’email est trop important pour être contrôlé par des systèmes fermés et propriétaires qui privilégient la collecte de données au détriment de la vie privée des utilisateurs. Avec la solution auto-hébergée de Forward Email, nous sommes fiers d’offrir une véritable alternative — une solution qui vous donne un contrôle total sur vos communications numériques.

Nous croyons que la confidentialité n’est pas seulement une fonctionnalité ; c’est un droit fondamental. Et avec notre option d’email auto-hébergé, nous rendons ce droit plus accessible que jamais.

Prêt à prendre le contrôle de votre email ? [Commencez dès aujourd’hui](https://forwardemail.net/self-hosted) ou explorez notre [dépôt GitHub](https://github.com/forwardemail/forwardemail.net) pour en savoir plus.


## Références {#references}

\[1] Dépôt GitHub de Forward Email : <https://github.com/forwardemail/forwardemail.net>

\[2] Documentation Auto-Hébergée : <https://forwardemail.net/en/self-hosted>

\[3] Mise en œuvre technique de la confidentialité des emails : <https://forwardemail.net/en/blog/docs/email-privacy-protection-technical-implementation>

\[4] Pourquoi l’email open-source est important : <https://forwardemail.net/en/blog/docs/why-open-source-email-security-privacy>
