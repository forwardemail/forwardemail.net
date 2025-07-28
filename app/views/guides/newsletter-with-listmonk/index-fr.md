# Listmonk avec e-mail de transfert pour une livraison sécurisée de la newsletter {#listmonk-with-forward-email-for-secure-newsletter-delivery}

## Table des matières {#table-of-contents}

* [Aperçu](#overview)
* [Pourquoi Listmonk et Forward Email](#why-listmonk-and-forward-email)
* [Prérequis](#prerequisites)
* [Installation](#installation)
  * [1. Mettez à jour votre serveur](#1-update-your-server)
  * [2. Installer les dépendances](#2-install-dependencies)
  * [3. Télécharger la configuration de Listmonk](#3-download-listmonk-configuration)
  * [4. Configurer le pare-feu (UFW)](#4-configure-firewall-ufw)
  * [5. Configurer l'accès HTTPS](#5-configure-https-access)
  * [6. Démarrez Listmonk](#6-start-listmonk)
  * [7. Configurer le transfert d'e-mails SMTP dans Listmonk](#7-configure-forward-email-smtp-in-listmonk)
  * [8. Configurer le traitement des rebonds](#8-configure-bounce-processing)
* [Essai](#testing)
  * [Créer une liste de diffusion](#create-a-mailing-list)
  * [Ajouter des abonnés](#add-subscribers)
  * [Créer et envoyer une campagne](#create-and-send-a-campaign)
* [Vérification](#verification)
* [Notes du développeur](#developer-notes)
* [Conclusion](#conclusion)

## Présentation de {#overview}

Ce guide fournit aux développeurs des instructions étape par étape pour configurer [Listmonk](https://listmonk.app/), un puissant gestionnaire de newsletters et de listes de diffusion open source, afin d'utiliser [Transférer un e-mail](https://forwardemail.net/) comme fournisseur SMTP. Cette combinaison vous permet de gérer efficacement vos campagnes tout en garantissant une distribution d'e-mails sécurisée, privée et fiable.

* **Listmonk** : gère la gestion des abonnés, l'organisation des listes, la création de campagnes et le suivi des performances.
* **Transfert d'e-mails** : agit comme un serveur SMTP sécurisé, gérant l'envoi des e-mails grâce à des fonctionnalités de sécurité intégrées comme le chiffrement SPF, DKIM, DMARC et TLS.

En intégrant ces deux éléments, vous conservez un contrôle total sur vos données et votre infrastructure tout en tirant parti du système de livraison robuste de Forward Email.

## Pourquoi Listmonk et transférer les e-mails ? {#why-listmonk-and-forward-email}

* **Open Source** : Listmonk et les principes de Forward Email privilégient la transparence et le contrôle. Vous hébergez Listmonk vous-même et êtes propriétaire de vos données.
* **Confidentialité** : Forward Email est conçu avec la confidentialité au cœur de ses préoccupations, minimisant la conservation des données et privilégiant la transmission sécurisée.
* **Rentabilité** : Listmonk est gratuit, et Forward Email propose des offres gratuites généreuses et des forfaits payants abordables, ce qui en fait une solution économique.
* **Évolutivité** : Listmonk est très performant et l'infrastructure de Forward Email est conçue pour une diffusion fiable à grande échelle.
* **Convivial pour les développeurs** : Listmonk propose une API robuste, et Forward Email offre une intégration SMTP et des webhooks simples.

## Prérequis {#prerequisites}

Avant de commencer, assurez-vous d’avoir les éléments suivants :

* Un serveur privé virtuel (VPS) exécutant une distribution Linux récente (Ubuntu 20.04+ recommandé) avec au moins 1 processeur et 1 Go de RAM (2 Go recommandés).
* Besoin d'un fournisseur ? Consultez [liste des VPS recommandés](https://github.com/forwardemail/awesome-mail-server-providers).
* Un nom de domaine que vous contrôlez (accès DNS requis).
* Un compte actif avec [Transférer un e-mail](https://forwardemail.net/).
* Un accès root ou `sudo` à votre VPS.
* Une connaissance de base des opérations en ligne de commande Linux.

## Installation de {#installation}

Ces étapes vous guident dans l’installation de Listmonk à l’aide de Docker et Docker Compose sur votre VPS.

### 1. Mettez à jour votre serveur {#1-update-your-server}

Assurez-vous que la liste des packages de votre système et les packages installés sont à jour.

```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Installer les dépendances {#2-install-dependencies}

Installez Docker, Docker Compose et UFW (Uncomplicated Firewall).

```bash
sudo apt install -y docker.io docker-compose ufw
```

### 3. Télécharger la configuration Listmonk {#3-download-listmonk-configuration}

Créez un répertoire pour Listmonk et téléchargez le fichier officiel `docker-compose.yml`.

```bash
mkdir listmonk && cd listmonk
curl -Lo docker-compose.yml https://raw.githubusercontent.com/knadh/listmonk/master/docker-compose.yml
```

Ce fichier définit le conteneur d'application Listmonk et son conteneur de base de données PostgreSQL requis.

### 4. Configurer le pare-feu (UFW) {#4-configure-firewall-ufw}

Autorisez le trafic essentiel (SSH, HTTP, HTTPS) à traverser le pare-feu. Si votre SSH fonctionne sur un port non standard, ajustez-le en conséquence.

```bash
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
```

Confirmez l’activation du pare-feu lorsque vous y êtes invité.

### 5. Configurer l'accès HTTPS {#5-configure-https-access}

Exécuter Listmonk via HTTPS est crucial pour la sécurité. Deux options principales s'offrent à vous :

#### Option A : Utilisation du proxy Cloudflare (recommandé pour plus de simplicité) {#option-a-using-cloudflare-proxy-recommended-for-simplicity}

Si le DNS de votre domaine est géré par Cloudflare, vous pouvez tirer parti de leur fonction proxy pour un HTTPS facile.

1. **Point DNS** : Créez un enregistrement `A` dans Cloudflare pour votre sous-domaine Listmonk (par exemple, `listmonk.yourdomain.com`) pointant vers l'adresse IP de votre VPS. Assurez-vous que le **statut du proxy** est défini sur **Proxyé** (nuage orange).
2. **Modifier Docker Compose** : Modifiez le fichier `docker-compose.yml` que vous avez téléchargé :
```bash
   sed -i 's/9000:9000/80:9000/' docker-compose.yml
   ```
Listmonk est alors accessible en interne sur le port 80, que Cloudflare peut ensuite proxy et sécuriser via HTTPS.

#### Option B : Utilisation d'un proxy inverse (Nginx, Caddy, etc.) {#option-b-using-a-reverse-proxy-nginx-caddy-etc}

Alternativement, vous pouvez configurer un proxy inverse comme Nginx ou Caddy sur votre VPS pour gérer la terminaison HTTPS et les demandes de proxy vers Listmonk (exécuté sur le port 9000 par défaut).

* Conservez la valeur par défaut `ports: - "127.0.0.1:9000:9000"` dans `docker-compose.yml` pour garantir que Listmonk ne soit accessible que localement.
* Configurez le proxy inverse de votre choix pour écouter sur les ports 80 et 443, gérer l'acquisition des certificats SSL (par exemple, via Let's Encrypt) et transférer le trafic vers `http://127.0.0.1:9000`.
* La configuration détaillée du proxy inverse dépasse le cadre de ce guide, mais de nombreux tutoriels sont disponibles en ligne.

### 6. Démarrer Listmonk {#6-start-listmonk}

Revenez à votre répertoire `listmonk` (si vous n'y êtes pas déjà) et démarrez les conteneurs en mode détaché.

```bash
cd ~/listmonk # Or the directory where you saved docker-compose.yml
docker compose up -d
```

Docker téléchargera les images nécessaires et démarrera l'application Listmonk et les conteneurs de base de données. La première fois, cela peut prendre une à deux minutes.

✅ **Accéder à Listmonk** : Vous devriez maintenant pouvoir accéder à l'interface Web Listmonk via le domaine que vous avez configuré (par exemple, `https://listmonk.yourdomain.com`).

### 7. Configurer le transfert d'e-mails SMTP dans Listmonk {#7-configure-forward-email-smtp-in-listmonk}

Ensuite, configurez Listmonk pour envoyer des e-mails à l’aide de votre compte de transfert d’e-mail.

1. **Activer SMTP dans les e-mails de transfert** : Assurez-vous d'avoir généré les identifiants SMTP dans le tableau de bord de votre compte de transfert. Suivez les instructions de la section [Guide de transfert d'e-mails pour envoyer des e-mails avec un domaine personnalisé via SMTP](https://forwardemail.net/en/guides/send-email-with-custom-domain-smtp) si ce n'est pas déjà fait.
2. **Configurer Listmonk** : Connectez-vous à votre panneau d'administration Listmonk.
* Accédez à **Paramètres -> SMTP**.

* Listmonk prend en charge le transfert d'e-mails. Sélectionnez **ForwardEmail** dans la liste des fournisseurs ou saisissez manuellement les informations suivantes :

| Paramètre | Valeur |
| :---------------- | :------------------------------------------------------------------------------------------------------------------ |
| **Hôte** | `smtp.forwardemail.net` |
| **Port** | `465` |
| **Protocole d'authentification** | `LOGIN` |
| **Nom d'utilisateur** | Votre e-mail de transfert **Nom d'utilisateur SMTP** |
| **Mot de passe** | Votre e-mail de transfert **Mot de passe SMTP** |
| **TLS** | `SSL/TLS` |
| **De l'e-mail** | L'adresse `From` souhaitée (par exemple, `newsletter@yourdomain.com`). Assurez-vous que ce domaine est configuré dans « Transférer les e-mails ». |

* **Important** : Utilisez toujours le port `465` avec `SSL/TLS` pour les connexions sécurisées avec le transfert d'e-mails. N'utilisez pas STARTTLS (port 587).

* Cliquez sur **Enregistrer**.
3. **Envoyer un e-mail de test** : utilisez le bouton « Envoyer un e-mail de test » dans les paramètres SMTP. Saisissez une adresse de destinataire accessible et cliquez sur **Envoyer**. Vérifiez que l'e-mail arrive dans la boîte de réception du destinataire.

### 8. Configurer le traitement des rebonds {#8-configure-bounce-processing}

Le traitement des retours permet à Listmonk de gérer automatiquement les e-mails qui n'ont pas pu être distribués (par exemple, en raison d'adresses invalides). Forward Email fournit un webhook pour notifier Listmonk des retours.

#### Configuration du transfert d'e-mails {#forward-email-setup}

1. Connectez-vous à votre [Tableau de bord de transfert d'e-mails](https://forwardemail.net/).
2. Accédez à **Domaines**, sélectionnez le domaine que vous utilisez pour l'envoi et accédez à sa page **Paramètres**.
3. Faites défiler la page jusqu'à la section **URL du webhook de rebond**.
4. Saisissez l'URL suivante, en remplaçant `<your_listmonk_domain>` par le domaine ou sous-domaine où votre instance Listmonk est accessible :
```sh
   https://<your_listmonk_domain>/webhooks/service/forwardemail
   ```
*Exemple* : `https://listmonk.yourdomain.com/webhooks/service/forwardemail`
5. Faites défiler la page jusqu'à la section **Clé de vérification de la charge utile de signature du webhook**.
6. **Copiez** la clé de vérification générée. Vous en aurez besoin dans Listmonk.
7. Enregistrez les modifications dans les paramètres de votre domaine de transfert d'e-mails.

#### Configuration de Listmonk {#listmonk-setup}

1. Dans votre panneau d'administration Listmonk, accédez à **Paramètres -> Rebonds**.
2. Activez **Activer le traitement des rebonds**.
3. Activez **Activer les webhooks de rebond**.
4. Faites défiler la page jusqu'à la section **Fournisseurs de webhooks**.
5. Activez **Transférer les e-mails**.
6. Collez la **Clé de vérification de la charge utile de signature du webhook** que vous avez copiée depuis le tableau de bord de transfert des e-mails dans le champ **Clé de transfert des e-mails**.
7. Cliquez sur **Enregistrer** en bas de la page.
8. Le traitement des rebonds est maintenant configuré ! Lorsque Forward Email détecte un rebond pour un e-mail envoyé par Listmonk, il en informe votre instance Listmonk via le webhook, et Listmonk marque l'abonné en conséquence.
9. Suivez les étapes ci-dessous dans [Essai](#testing) pour vous assurer que tout fonctionne.

## Test de {#testing}

Voici un aperçu rapide des fonctions principales de Listmonk :

### Créer une liste de diffusion {#create-a-mailing-list}

* Accédez à **Listes** dans la barre latérale.
* Cliquez sur **Nouvelle liste**.
* Renseignez les informations (Nom, Type : Public/Privé, Description, Mots-clés) et **Enregistrez**.

### Ajouter des abonnés {#add-subscribers}

* Accédez à la section **Abonnés**.
* Vous pouvez ajouter des abonnés :
* **Manuellement** : Cliquez sur **Nouvel abonné**.
* **Importer** : Cliquez sur **Importer des abonnés** pour télécharger un fichier CSV.
* **API** : Utilisez l'API Listmonk pour les ajouts programmatiques.
* Affectez des abonnés à une ou plusieurs listes lors de la création ou de l'importation.
* **Bonne pratique** : Utilisez un processus de double adhésion. Configurez-le sous **Paramètres -> Inscription et abonnements**.

### Créer et envoyer une campagne {#create-and-send-a-campaign}

* Accédez à **Campagnes** -> **Nouvelle campagne**.
* Renseignez les détails de la campagne (nom, objet, adresse e-mail de l'expéditeur, liste(s) à laquelle envoyer).
* Choisissez votre type de contenu (texte enrichi/HTML, texte brut, HTML brut).
* Rédigez le contenu de votre e-mail. Vous pouvez utiliser des variables de modèle comme `{{ .Subscriber.Email }}` ou `{{ .Subscriber.FirstName }}`.
* **Envoyez toujours un e-mail de test au préalable !** Utilisez l'option « Envoyer un test » pour prévisualiser l'e-mail dans votre boîte de réception.
* Une fois satisfait, cliquez sur **Démarrer la campagne** pour l'envoyer immédiatement ou le programmer ultérieurement.

## Vérification {#verification}

* **Livraison SMTP** : Envoyez régulièrement des e-mails de test via la page des paramètres SMTP de Listmonk et testez vos campagnes pour vous assurer que les e-mails sont correctement distribués.
* **Gestion des retours à l'expéditeur** : Envoyez une campagne de test à une adresse e-mail invalide connue (par exemple, `bounce-test@yourdomain.com` si vous n'en avez pas sous la main, mais les résultats peuvent varier). Vérifiez les statistiques de la campagne dans Listmonk après un court instant pour voir si le retour à l'expéditeur est enregistré.
* **En-têtes d'e-mail** : Utilisez des outils comme [Testeur de courrier](https://www.mail-tester.com/) ou inspectez manuellement les en-têtes d'e-mail pour vérifier que les protocoles SPF, DKIM et DMARC sont valides, indiquant une configuration correcte via le transfert d'e-mails.
* **Journaux de transfert d'e-mails** : Consultez les journaux de votre tableau de bord de transfert d'e-mails si vous suspectez des problèmes de distribution provenant du serveur SMTP.

## Notes du développeur {#developer-notes}

* **Modèles** : Listmonk utilise le moteur de création de modèles de Go. Consultez sa documentation pour une personnalisation avancée : `{{ .Subscriber.Attribs.your_custom_field }}`.
* **API** : Listmonk fournit une API REST complète pour la gestion des listes, des abonnés, des campagnes, des modèles, etc. Le lien vers la documentation de l'API se trouve dans le pied de page de votre instance Listmonk.
* **Champs personnalisés** : Définissez des champs d'abonné personnalisés sous **Paramètres -> Champs d'abonné** pour stocker des données supplémentaires.
* **Webhooks** : Outre les rebonds, Listmonk peut envoyer des webhooks pour d'autres événements (par exemple, les abonnements), permettant ainsi l'intégration avec d'autres systèmes.

## Conclusion {#conclusion}

En combinant la puissance auto-hébergée de Listmonk avec la diffusion sécurisée et respectueuse de la confidentialité de Forward Email, vous créez une plateforme d'email marketing robuste et éthique. Vous conservez l'entière propriété des données de votre audience tout en bénéficiant d'une délivrabilité élevée et de fonctionnalités de sécurité automatisées.

Cette configuration offre une alternative évolutive, rentable et conviviale pour les développeurs aux services de messagerie propriétaires, s'alignant parfaitement sur l'éthique des logiciels open source et de la confidentialité des utilisateurs.

Bon envoi ! 🚀