# Listmonk avec Forward Email pour une livraison sécurisée de la newsletter {#listmonk-with-forward-email-for-secure-newsletter-delivery}


## Table des matières {#table-of-contents}

* [Présentation](#overview)
* [Pourquoi Listmonk et Forward Email](#why-listmonk-and-forward-email)
* [Prérequis](#prerequisites)
* [Installation](#installation)
  * [1. Mettez à jour votre serveur](#1-update-your-server)
  * [2. Installez les dépendances](#2-install-dependencies)
  * [3. Téléchargez la configuration de Listmonk](#3-download-listmonk-configuration)
  * [4. Configurez le pare-feu (UFW)](#4-configure-firewall-ufw)
  * [5. Configurez l'accès HTTPS](#5-configure-https-access)
  * [6. Démarrez Listmonk](#6-start-listmonk)
  * [7. Configurez SMTP Forward Email dans Listmonk](#7-configure-forward-email-smtp-in-listmonk)
  * [8. Configurez le traitement des rebonds](#8-configure-bounce-processing)
* [Tests](#testing)
  * [Créez une liste de diffusion](#create-a-mailing-list)
  * [Ajoutez des abonnés](#add-subscribers)
  * [Créez et envoyez une campagne](#create-and-send-a-campaign)
* [Vérification](#verification)
* [Notes pour les développeurs](#developer-notes)
* [Conclusion](#conclusion)


## Présentation {#overview}

Ce guide fournit aux développeurs des instructions étape par étape pour configurer [Listmonk](https://listmonk.app/), un gestionnaire de newsletters et listes de diffusion open source puissant, afin d’utiliser [Forward Email](https://forwardemail.net/) comme fournisseur SMTP. Cette combinaison vous permet de gérer efficacement vos campagnes tout en assurant une livraison d’emails sécurisée, privée et fiable.

* **Listmonk** : Gère la gestion des abonnés, l’organisation des listes, la création de campagnes et le suivi des performances.
* **Forward Email** : Sert de serveur SMTP sécurisé, prenant en charge l’envoi réel des emails avec des fonctionnalités de sécurité intégrées telles que SPF, DKIM, DMARC et le chiffrement TLS.

En intégrant ces deux outils, vous conservez un contrôle total sur vos données et votre infrastructure tout en tirant parti du système de livraison robuste de Forward Email.


## Pourquoi Listmonk et Forward Email {#why-listmonk-and-forward-email}

* **Open Source** : Listmonk et les principes derrière Forward Email mettent l’accent sur la transparence et le contrôle. Vous hébergez Listmonk vous-même, ce qui vous permet de posséder vos données.
* **Respect de la vie privée** : Forward Email est conçu avec la confidentialité au cœur, minimisant la rétention des données et se concentrant sur une transmission sécurisée.
* **Économique** : Listmonk est gratuit, et Forward Email propose des paliers gratuits généreux ainsi que des plans payants abordables, ce qui en fait une solution économique.
* **Scalabilité** : Listmonk est très performant, et l’infrastructure de Forward Email est conçue pour une livraison fiable à grande échelle.
* **Adapté aux développeurs** : Listmonk offre une API robuste, et Forward Email fournit une intégration SMTP simple ainsi que des webhooks.


## Prérequis {#prerequisites}

Avant de commencer, assurez-vous de disposer de :

* Un serveur privé virtuel (VPS) exécutant une distribution Linux récente (Ubuntu 20.04+ recommandé) avec au moins 1 CPU et 1 Go de RAM (2 Go recommandés).
  * Besoin d’un fournisseur ? Consultez la [liste recommandée de VPS](https://github.com/forwardemail/awesome-mail-server-providers).
* Un nom de domaine que vous contrôlez (accès DNS requis).
* Un compte actif chez [Forward Email](https://forwardemail.net/).
* Un accès root ou `sudo` à votre VPS.
* Une connaissance de base des opérations en ligne de commande Linux.


## Installation {#installation}

Ces étapes vous guident pour installer Listmonk en utilisant Docker et Docker Compose sur votre VPS.

### 1. Mettez à jour votre serveur {#1-update-your-server}

Assurez-vous que la liste des paquets de votre système et les paquets installés sont à jour.

```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Installez les dépendances {#2-install-dependencies}

Installez Docker, Docker Compose et UFW (pare-feu simple).

```bash
sudo apt install -y docker.io docker-compose ufw
```

### 3. Téléchargez la configuration de Listmonk {#3-download-listmonk-configuration}

Créez un répertoire pour Listmonk et téléchargez le fichier officiel `docker-compose.yml`.

```bash
mkdir listmonk && cd listmonk
curl -Lo docker-compose.yml https://raw.githubusercontent.com/knadh/listmonk/master/docker-compose.yml
```

Ce fichier définit le conteneur de l’application Listmonk et son conteneur de base de données PostgreSQL requis.
### 4. Configurer le pare-feu (UFW) {#4-configure-firewall-ufw}

Autorisez le trafic essentiel (SSH, HTTP, HTTPS) à travers le pare-feu. Si votre SSH fonctionne sur un port non standard, ajustez en conséquence.

```bash
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
```

Confirmez l’activation du pare-feu lorsqu’on vous le demande.

### 5. Configurer l’accès HTTPS {#5-configure-https-access}

Faire fonctionner Listmonk en HTTPS est crucial pour la sécurité. Vous avez deux options principales :

#### Option A : Utiliser le proxy Cloudflare (recommandé pour la simplicité) {#option-a-using-cloudflare-proxy-recommended-for-simplicity}

Si le DNS de votre domaine est géré par Cloudflare, vous pouvez utiliser leur fonctionnalité de proxy pour un HTTPS facile.

1. **Pointer le DNS** : Créez un enregistrement `A` dans Cloudflare pour votre sous-domaine Listmonk (par exemple, `listmonk.votredomaine.com`) pointant vers l’adresse IP de votre VPS. Assurez-vous que le **Statut du proxy** est réglé sur **Proxied** (nuage orange).
2. **Modifier Docker Compose** : Éditez le fichier `docker-compose.yml` que vous avez téléchargé :
   ```bash
   sed -i 's/9000:9000/80:9000/' docker-compose.yml
   ```
   Cela rend Listmonk accessible en interne sur le port 80, que Cloudflare peut ensuite proxyfier et sécuriser avec HTTPS.

#### Option B : Utiliser un reverse proxy (Nginx, Caddy, etc.) {#option-b-using-a-reverse-proxy-nginx-caddy-etc}

Alternativement, vous pouvez configurer un reverse proxy comme Nginx ou Caddy sur votre VPS pour gérer la terminaison HTTPS et proxyfier les requêtes vers Listmonk (fonctionnant par défaut sur le port 9000).

* Gardez la configuration par défaut `ports: - "127.0.0.1:9000:9000"` dans `docker-compose.yml` pour que Listmonk soit accessible uniquement localement.
* Configurez votre reverse proxy choisi pour écouter sur les ports 80 et 443, gérer l’acquisition du certificat SSL (par exemple via Let's Encrypt), et rediriger le trafic vers `http://127.0.0.1:9000`.
* La configuration détaillée du reverse proxy dépasse le cadre de ce guide, mais de nombreux tutoriels sont disponibles en ligne.

### 6. Démarrer Listmonk {#6-start-listmonk}

Retournez dans votre répertoire `listmonk` (si vous n’y êtes pas déjà) et démarrez les conteneurs en mode détaché.

```bash
cd ~/listmonk # Ou le répertoire où vous avez sauvegardé docker-compose.yml
docker compose up -d
```

Docker téléchargera les images nécessaires et démarrera les conteneurs de l’application Listmonk et de la base de données. Cela peut prendre une minute ou deux la première fois.

✅ **Accéder à Listmonk** : Vous devriez maintenant pouvoir accéder à l’interface web de Listmonk via le domaine que vous avez configuré (par exemple, `https://listmonk.votredomaine.com`).

### 7. Configurer SMTP Forward Email dans Listmonk {#7-configure-forward-email-smtp-in-listmonk}

Ensuite, configurez Listmonk pour envoyer des emails en utilisant votre compte Forward Email.

1. **Activer SMTP dans Forward Email** : Assurez-vous d’avoir généré des identifiants SMTP dans le tableau de bord de votre compte Forward Email. Suivez le [guide Forward Email pour envoyer des emails avec un domaine personnalisé via SMTP](https://forwardemail.net/en/guides/send-email-with-custom-domain-smtp) si ce n’est pas déjà fait.
2. **Configurer Listmonk** : Connectez-vous à votre panneau d’administration Listmonk.
   * Allez dans **Paramètres -> SMTP**.

   * Listmonk supporte nativement Forward Email. Sélectionnez **ForwardEmail** dans la liste des fournisseurs, ou saisissez manuellement les informations suivantes :

     | Paramètre         | Valeur                                                                                                             |
     | :---------------- | :----------------------------------------------------------------------------------------------------------------- |
     | **Hôte**          | `smtp.forwardemail.net`                                                                                            |
     | **Port**          | `465`                                                                                                              |
     | **Protocole Auth**| `LOGIN`                                                                                                            |
     | **Nom d’utilisateur** | Votre **nom d’utilisateur SMTP** Forward Email                                                                   |
     | **Mot de passe**  | Votre **mot de passe SMTP** Forward Email                                                                          |
     | **TLS**           | `SSL/TLS`                                                                                                          |
     | **Adresse From**  | L’adresse `From` souhaitée (par exemple, `newsletter@votredomaine.com`). Assurez-vous que ce domaine est configuré dans Forward Email. |
* **Important** : Utilisez toujours le Port `465` avec `SSL/TLS` pour des connexions sécurisées avec Forward Email (recommandé). Le port `587` avec STARTTLS est également pris en charge, mais SSL/TLS est préféré.

   * Cliquez sur **Enregistrer**.
3. **Envoyer un e-mail de test** : Utilisez le bouton "Envoyer un e-mail de test" dans la page des paramètres SMTP. Saisissez une adresse de destinataire à laquelle vous avez accès et cliquez sur **Envoyer**. Vérifiez que l’e-mail arrive dans la boîte de réception du destinataire.

### 8. Configurer le traitement des rebonds {#8-configure-bounce-processing}

Le traitement des rebonds permet à Listmonk de gérer automatiquement les e-mails qui n’ont pas pu être délivrés (par exemple, en raison d’adresses invalides). Forward Email fournit un webhook pour notifier Listmonk des rebonds.

#### Configuration de Forward Email {#forward-email-setup}

1. Connectez-vous à votre [Tableau de bord Forward Email](https://forwardemail.net/).
2. Allez dans **Domains**, sélectionnez le domaine que vous utilisez pour l’envoi, puis accédez à sa page **Settings**.
3. Faites défiler jusqu’à la section **Bounce Webhook URL**.
4. Saisissez l’URL suivante, en remplaçant `<your_listmonk_domain>` par le domaine ou sous-domaine réel où votre instance Listmonk est accessible :
   ```sh
   https://<your_listmonk_domain>/webhooks/service/forwardemail
   ```
   *Exemple* : `https://listmonk.yourdomain.com/webhooks/service/forwardemail`
5. Descendez encore jusqu’à la section **Webhook Signature Payload Verification Key**.
6. **Copiez** la clé de vérification générée. Vous en aurez besoin dans Listmonk.
7. Enregistrez les modifications dans les paramètres de domaine Forward Email.

#### Configuration de Listmonk {#listmonk-setup}

1. Dans votre panneau d’administration Listmonk, allez dans **Settings -> Bounces**.
2. Activez **Enable bounce processing**.
3. Activez **Enable bounce webhooks**.
4. Faites défiler jusqu’à la section **Webhook Providers**.
5. Activez **Forward Email**.
6. Collez la **Webhook Signature Payload Verification Key** que vous avez copiée depuis le tableau de bord Forward Email dans le champ **Forward Email Key**.
7. Cliquez sur **Save** en bas de la page.
8. Le traitement des rebonds est maintenant configuré ! Lorsque Forward Email détecte un rebond pour un e-mail envoyé par Listmonk, il notifiera votre instance Listmonk via le webhook, et Listmonk marquera l’abonné en conséquence.
9. Complétez les étapes ci-dessous dans [Testing](#testing) pour vous assurer que tout fonctionne.

## Tests {#testing}

Voici un aperçu rapide des fonctions principales de Listmonk :

### Créer une liste de diffusion {#create-a-mailing-list}

* Allez dans **Lists** dans la barre latérale.
* Cliquez sur **New List**.
* Remplissez les détails (Nom, Type : Public/Privé, Description, Tags) et **Enregistrez**.

### Ajouter des abonnés {#add-subscribers}

* Rendez-vous dans la section **Subscribers**.
* Vous pouvez ajouter des abonnés :
  * **Manuellement** : Cliquez sur **New Subscriber**.
  * **Importer** : Cliquez sur **Import Subscribers** pour télécharger un fichier CSV.
  * **API** : Utilisez l’API Listmonk pour des ajouts programmatiques.
* Assignez les abonnés à une ou plusieurs listes lors de la création ou de l’import.
* **Bonne pratique** : Utilisez un processus de double opt-in. Configurez cela sous **Settings -> Opt-in & Subscriptions**.

### Créer et envoyer une campagne {#create-and-send-a-campaign}

* Allez dans **Campaigns** -> **New Campaign**.
* Remplissez les détails de la campagne (Nom, Sujet, E-mail de l’expéditeur, Liste(s) destinataire(s)).
* Choisissez votre type de contenu (Texte enrichi/HTML, Texte brut, HTML brut).
* Rédigez le contenu de votre e-mail. Vous pouvez utiliser des variables de modèle comme `{{ .Subscriber.Email }}` ou `{{ .Subscriber.FirstName }}`.
* **Envoyez toujours un e-mail de test d’abord !** Utilisez l’option "Send Test" pour prévisualiser l’e-mail dans votre boîte de réception.
* Une fois satisfait, cliquez sur **Start Campaign** pour envoyer immédiatement ou planifiez l’envoi.

## Vérification {#verification}

* **Livraison SMTP** : Envoyez régulièrement des e-mails de test via la page des paramètres SMTP de Listmonk et testez des campagnes pour vous assurer que les e-mails sont correctement délivrés.
* **Gestion des rebonds** : Envoyez une campagne test à une adresse e-mail invalide connue (par exemple, `bounce-test@yourdomain.com` si vous n’en avez pas une réelle sous la main, bien que les résultats puissent varier). Vérifiez les statistiques de la campagne dans Listmonk après un court moment pour voir si le rebond est enregistré.
* **En-têtes d’e-mail** : Utilisez des outils comme [Mail-Tester](https://www.mail-tester.com/) ou inspectez manuellement les en-têtes d’e-mail pour vérifier que SPF, DKIM et DMARC passent, indiquant une configuration correcte via Forward Email.
* **Journaux Forward Email** : Consultez les journaux de votre tableau de bord Forward Email si vous suspectez des problèmes de livraison provenant du serveur SMTP.
## Notes pour les développeurs {#developer-notes}

* **Modèles** : Listmonk utilise le moteur de templates de Go. Explorez sa documentation pour une personnalisation avancée : `{{ .Subscriber.Attribs.your_custom_field }}`.
* **API** : Listmonk fournit une API REST complète pour gérer les listes, abonnés, campagnes, modèles, et plus encore. Trouvez le lien vers la documentation de l’API dans le pied de page de votre instance Listmonk.
* **Champs personnalisés** : Définissez des champs personnalisés pour les abonnés sous **Paramètres -> Champs abonnés** afin de stocker des données supplémentaires.
* **Webhooks** : En plus des rebonds, Listmonk peut envoyer des webhooks pour d’autres événements (par exemple, les abonnements), permettant une intégration avec d’autres systèmes.


## Conclusion {#conclusion}

En intégrant la puissance auto-hébergée de Listmonk avec la livraison sécurisée et respectueuse de la vie privée de Forward Email, vous créez une plateforme de marketing par email robuste et éthique. Vous conservez la pleine propriété des données de votre audience tout en bénéficiant d’une haute délivrabilité et de fonctionnalités de sécurité automatisées.

Cette configuration offre une alternative évolutive, économique et conviviale pour les développeurs aux services email propriétaires, s’alignant parfaitement avec l’éthique des logiciels open source et la confidentialité des utilisateurs.

Bon envoi ! 🚀
