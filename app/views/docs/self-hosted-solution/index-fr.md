# E-mail auto-hébergé : engagement envers l'Open Source {#self-hosted-email-commitment-to-open-source}

<img loading="lazy" src="/img/articles/self-hosted.webp" alt="Self-hosted email solution illustration" class="rounded-lg" />

## Table des matières {#table-of-contents}

* [Avant-propos](#foreword)
* [Pourquoi l'auto-hébergement de messagerie électronique est important](#why-self-hosted-email-matters)
  * [Le problème des services de messagerie traditionnels](#the-problem-with-traditional-email-services)
  * [L'alternative auto-hébergée](#the-self-hosted-alternative)
* [Notre implémentation auto-hébergée : aperçu technique](#our-self-hosted-implementation-technical-overview)
  * [Architecture basée sur Docker pour la simplicité et la portabilité](#docker-based-architecture-for-simplicity-and-portability)
  * [Installation de scripts Bash : l'accessibilité rencontre la sécurité](#bash-script-installation-accessibility-meets-security)
  * [Chiffrement quantique sécurisé pour une confidentialité à l'épreuve du temps](#quantum-safe-encryption-for-future-proof-privacy)
  * [Maintenance et mises à jour automatisées](#automated-maintenance-and-updates)
* [L'engagement Open Source](#the-open-source-commitment)
* [Hébergement autonome ou géré : faire le bon choix](#self-hosted-vs-managed-making-the-right-choice)
  * [La réalité de l'auto-hébergement des e-mails](#the-reality-of-self-hosting-email)
  * [Quand choisir notre service géré](#when-to-choose-our-managed-service)
* [Premiers pas avec le transfert d'e-mails auto-hébergé](#getting-started-with-self-hosted-forward-email)
  * [Configuration requise](#system-requirements)
  * [Étapes d'installation](#installation-steps)
* [L'avenir des e-mails auto-hébergés](#the-future-of-self-hosted-email)
* [Conclusion : la liberté du courrier électronique pour tous](#conclusion-email-freedom-for-everyone)
* [Références](#references)

## Avant-propos {#foreword}

Dans le paysage numérique actuel, l'e-mail reste le pilier de notre identité et de nos communications en ligne. Pourtant, face à la montée des préoccupations en matière de confidentialité, de nombreux utilisateurs sont confrontés à un choix difficile : la commodité au détriment de la confidentialité, ou la confidentialité au détriment de la commodité. Chez Forward Email, nous avons toujours pensé que vous ne devriez pas avoir à choisir entre les deux.

Aujourd'hui, nous sommes ravis d'annoncer une étape importante de notre parcours : le lancement de notre solution de messagerie auto-hébergée. Cette fonctionnalité témoigne de notre engagement profond envers les principes open source, une conception respectueuse de la confidentialité et l'autonomisation des utilisateurs. Avec notre option auto-hébergée, nous vous donnons la pleine maîtrise de vos communications par e-mail.

Cet article de blog explore la philosophie derrière notre solution auto-hébergée, sa mise en œuvre technique et pourquoi elle est importante pour les utilisateurs qui accordent la priorité à la confidentialité et à la propriété dans leurs communications numériques.

## Pourquoi l'auto-hébergement de messagerie est important {#why-self-hosted-email-matters}

Notre solution de messagerie auto-hébergée illustre parfaitement notre conviction : une véritable confidentialité implique un contrôle, et ce contrôle commence par l'open source. Pour les utilisateurs qui exigent la pleine maîtrise de leurs communications numériques, l'auto-hébergement n'est plus une idée marginale : c'est un droit essentiel. Nous sommes fiers de défendre cette conviction avec une plateforme entièrement ouverte et vérifiable, que vous pouvez gérer selon vos propres conditions.

### Le problème des services de messagerie traditionnels {#the-problem-with-traditional-email-services}

Les services de messagerie traditionnels présentent plusieurs défis fondamentaux pour les utilisateurs soucieux de leur confidentialité :

1. **Exigences de confiance** : Vous devez faire confiance au fournisseur pour ne pas accéder à vos données, les analyser ou les partager.
2. **Contrôle centralisé** : Votre accès peut être révoqué à tout moment et pour n'importe quelle raison.
3. **Vulnérabilité de la surveillance** : Les services centralisés sont des cibles privilégiées pour la surveillance.
4. **Transparence limitée** : La plupart des services utilisent des logiciels propriétaires à code source fermé.
5. **Lien fournisseur** : Il peut être difficile, voire impossible, de migrer vers d'autres services.

Même les fournisseurs de messagerie « soucieux de la confidentialité » manquent souvent à leurs engagements en ne proposant que leurs applications front-end en open source, tout en conservant leurs systèmes back-end propriétaires et fermés. Cela crée un important manque de confiance : on vous demande de croire à leurs promesses de confidentialité sans pouvoir les vérifier.

### L'alternative auto-hébergée {#the-self-hosted-alternative}

L'auto-hébergement de votre messagerie électronique offre une approche fondamentalement différente :

1. **Contrôle total** : Vous possédez et contrôlez l'intégralité de l'infrastructure de messagerie
2. **Confidentialité vérifiable** : L'ensemble du système est transparent et auditable
3. **Aucune confiance requise** : Vous n'avez pas besoin de confier vos communications à un tiers
4. **Liberté de personnalisation** : Adaptez le système à vos besoins spécifiques
5. **Résilience** : Votre service continue, quelles que soient les décisions de l'entreprise

Comme l'a dit un utilisateur : « Héberger moi-même ma messagerie est l'équivalent numérique de cultiver ma propre nourriture : cela demande plus de travail, mais je sais exactement ce qu'il y a dedans. »

## Notre implémentation auto-hébergée : Présentation technique {#our-self-hosted-implementation-technical-overview}

Notre solution de messagerie auto-hébergée repose sur les mêmes principes de confidentialité que tous nos produits. Découvrons la mise en œuvre technique qui rend cela possible.

### Architecture basée sur Docker pour la simplicité et la portabilité {#docker-based-architecture-for-simplicity-and-portability}

Nous avons intégré l'intégralité de notre infrastructure de messagerie à Docker, facilitant ainsi son déploiement sur la quasi-totalité des systèmes Linux. Cette approche conteneurisée offre plusieurs avantages clés :

1. **Déploiement simplifié** : Une seule commande configure l'ensemble de l'infrastructure.
2. **Environnement cohérent** : Élimine les problèmes de « fonctionne sur ma machine ».
3. **Composants isolés** : Chaque service s'exécute dans son propre conteneur pour plus de sécurité.
4. **Mises à jour faciles** : Des commandes simples pour mettre à jour l'ensemble de la pile.
5. **Dépendances minimales** : Ne nécessite que Docker et Docker Compose.

L'architecture comprend des conteneurs pour :

* Interface web d'administration
* Serveur SMTP pour les e-mails sortants
* Serveurs IMAP/POP3 pour la récupération des e-mails
* Serveur CalDAV pour les calendriers
* Serveur CardDAV pour les contacts
* Base de données pour le stockage des configurations
* Redis pour la mise en cache et les performances
* SQLite pour le stockage sécurisé et chiffré des boîtes aux lettres

> \[!NOTE]
> N'oubliez pas de consulter notre [guide du développeur auto-hébergé](https://forwardemail.net/self-hosted)

Installation du script Bash ### : l'accessibilité rencontre la sécurité {#bash-script-installation-accessibility-meets-security}

Nous avons conçu le processus d'installation pour qu'il soit aussi simple que possible tout en maintenant les meilleures pratiques de sécurité :

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

Cette commande unique :

1. Vérification de la configuration système requise
2. Guide de configuration
3. Configuration des enregistrements DNS
4. Configuration des certificats TLS
5. Déploiement des conteneurs Docker
6. Renforcement initial de la sécurité

Pour ceux qui s'inquiètent de l'intégration de scripts à Bash (et c'est normal !), nous vous encourageons à vérifier le script avant son exécution. Il est entièrement open source et disponible pour inspection.

### Chiffrement quantique sécurisé pour une confidentialité à l'épreuve du temps {#quantum-safe-encryption-for-future-proof-privacy}

Tout comme notre service hébergé, notre solution auto-hébergée implémente un chiffrement résistant aux attaques quantiques utilisant ChaCha20-Poly1305 comme chiffrement pour les bases de données SQLite. Cette approche protège vos données de messagerie non seulement contre les menaces actuelles, mais aussi contre les futures attaques quantiques.

Chaque boîte aux lettres est stockée dans son propre fichier de base de données SQLite chiffré, offrant une isolation complète entre les utilisateurs, un avantage de sécurité significatif par rapport aux approches traditionnelles de base de données partagée.

### Maintenance et mises à jour automatisées {#automated-maintenance-and-updates}

Nous avons intégré des utilitaires de maintenance complets directement dans la solution auto-hébergée :

1. **Sauvegardes automatiques** : Sauvegardes planifiées de toutes les données critiques
2. **Renouvellement de certificat** : Gestion automatisée des certificats Let's Encrypt
3. **Mises à jour système** : Commande simple pour mettre à jour vers la dernière version
4. **Surveillance de l'intégrité** : Vérifications intégrées pour garantir l'intégrité du système

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

## L'engagement Open Source {#the-open-source-commitment}

Notre solution de messagerie auto-hébergée, comme tous nos produits, est 100 % open source, tant en front-end qu'en back-end. Cela signifie :

1. **Transparence totale** : Chaque ligne de code traitant vos e-mails est accessible au public.
2. **Contributions de la communauté** : Chacun peut contribuer à des améliorations ou corriger des problèmes.
3. **Sécurité par l'ouverture** : Les vulnérabilités peuvent être identifiées et corrigées par une communauté mondiale.
4. **Pas de dépendance vis-à-vis d'un fournisseur** : Vous ne dépendez jamais de l'existence de notre entreprise.

L'intégralité de la base de code est disponible sur GitHub à <https://github.com/forwardemail/forwardemail.net>.

## Auto-hébergé ou géré : faire le bon choix {#self-hosted-vs-managed-making-the-right-choice}

Bien que nous soyons fiers de proposer une solution d'auto-hébergement, nous reconnaissons que ce n'est pas une solution adaptée à tous. L'auto-hébergement de messagerie implique de réelles responsabilités et de réels défis :

### La réalité de l'auto-hébergement des e-mails {#the-reality-of-self-hosting-email}

#### Considérations techniques {#technical-considerations}

* **Gestion du serveur** : Vous devrez gérer un VPS ou un serveur dédié.
* **Configuration DNS** : Une configuration DNS correcte est essentielle pour la délivrabilité.
* **Mises à jour de sécurité** : Il est essentiel de se tenir au courant des correctifs de sécurité.
* **Gestion du spam** : Vous devrez gérer le filtrage du spam.
* **Stratégie de sauvegarde** : La mise en œuvre de sauvegardes fiables est de votre responsabilité.

#### Investissement en temps {#time-investment}

* **Configuration initiale** : Temps consacré à l'installation, à la vérification et à la lecture de la documentation
* **Maintenance continue** : Mises à jour et surveillance occasionnelles
* **Dépannage** : Temps consacré occasionnellement à la résolution des problèmes

#### Considérations financières {#financial-considerations}

* **Coûts du serveur** : 5 $ à 20 $/mois pour un VPS de base
* **Enregistrement de domaine** : 10 $ à 20 $/an
* **Valeur temps** : Votre investissement en temps a une réelle valeur

### Quand choisir notre service géré {#when-to-choose-our-managed-service}

Pour de nombreux utilisateurs, notre service géré reste la meilleure option :

1. **Pratique** : Nous prenons en charge la maintenance, les mises à jour et la surveillance.
2. **Fiabilité** : Bénéficiez de notre infrastructure et de notre expertise éprouvées.
3. **Support** : Obtenez de l'aide en cas de problème.
4. **Délivrabilité** : Profitez de notre réputation de propriété intellectuelle.
5. **Rentabilité** : En tenant compte des coûts liés au temps, notre service est souvent plus économique.

Les deux options offrent les mêmes avantages en matière de confidentialité et de transparence open source. La différence réside simplement dans la personne qui gère l’infrastructure.

## Premiers pas avec le transfert d'e-mails auto-hébergé {#getting-started-with-self-hosted-forward-email}

Prêt à prendre le contrôle de votre infrastructure de messagerie ? Voici comment commencer :

### Configuration requise pour {#system-requirements}

* Ubuntu 20.04 LTS ou version ultérieure (recommandé)
* 1 Go de RAM minimum (2 Go et plus recommandés)
* 20 Go de stockage recommandés
* Un nom de domaine que vous contrôlez
* Adresse IP publique avec prise en charge du port 25
* Possibilité de définir [PTR inversé](https://www.cloudflare.com/learning/dns/dns-records/dns-ptr-record/)
* Prise en charge IPv4 et IPv6

> \[!TIP]
> Nous recommandons plusieurs fournisseurs de serveurs de messagerie à <https://forwardemail.net/blog/docs/best-mail-server-providers> (source à <https://github.com/forwardemail/awesome-mail-server-providers>)

### Étapes d'installation de {#installation-steps}

1. **Exécutez le script d'installation** :
```bash
   bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
   ```

2. **Suivez les instructions interactives** :
* Saisissez votre nom de domaine
* Configurez les identifiants d'administrateur
* Configurez les enregistrements DNS comme indiqué
* Choisissez vos options de configuration préférées

3. **Vérification de l'installation** :
Une fois l'installation terminée, vous pouvez vérifier que tout fonctionne :
* Vérification de l'état du conteneur : `docker ps`
* Envoi d'un e-mail de test
* Connexion à l'interface web

## L'avenir de la messagerie électronique auto-hébergée {#the-future-of-self-hosted-email}

Notre solution auto-hébergée n'est qu'un début. Nous nous engageons à l'améliorer continuellement grâce à :

1. **Outils d'administration améliorés** : Gestion Web plus puissante
2. **Options d'authentification supplémentaires** : Prise en charge des clés de sécurité matérielles incluse
3. **Surveillance avancée** : Meilleure visibilité sur l'état et les performances du système
4. **Déploiement multi-serveurs** : Options pour des configurations haute disponibilité
5. **Améliorations communautaires** : Intégration des contributions des utilisateurs

## Conclusion : la liberté du courrier électronique pour tous {#conclusion-email-freedom-for-everyone}

Le lancement de notre solution de messagerie auto-hébergée marque une étape importante dans notre mission : fournir des services de messagerie transparents et respectueux de la confidentialité. Que vous choisissiez notre service géré ou notre solution auto-hébergée, vous bénéficiez de notre engagement indéfectible envers les principes open source et une conception privilégiant la confidentialité.

Les e-mails sont trop importants pour être contrôlés par des systèmes fermés et propriétaires qui privilégient la collecte de données à la confidentialité des utilisateurs. Avec la solution auto-hébergée de Forward Email, nous sommes fiers de vous proposer une véritable alternative, qui vous permet de contrôler entièrement vos communications numériques.

Nous pensons que la confidentialité n'est pas qu'une simple fonctionnalité ; c'est un droit fondamental. Avec notre option de messagerie auto-hébergée, nous rendons ce droit plus accessible que jamais.

Prêt à prendre le contrôle de votre messagerie ? [Commencez dès aujourd'hui](https://forwardemail.net/self-hosted) ou explorez notre [Dépôt GitHub](https://github.com/forwardemail/forwardemail.net) pour en savoir plus.

## Références {#references}

\[1] Transférer l'e-mail Référentiel GitHub : <https://github.com/forwardemail/forwardemail.net>

\[2] Documentation auto-hébergée : <https://forwardemail.net/en/self-hosted>

\[3] Implémentation technique de la confidentialité des e-mails : <https://forwardemail.net/en/blog/docs/email-privacy-protection-technical-implementation>

\[4] Pourquoi le courrier électronique open source est important : <https://forwardemail.net/en/blog/docs/why-open-source-email-security-privacy>