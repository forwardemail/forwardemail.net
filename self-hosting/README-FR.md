# Self-Hosted Releases {#self-hosted-releases}

Cette section documente le flux de travail CI/CD pour la solution auto-hébergée de ForwardEmail, expliquant comment les images Docker sont créées, publiées et déployées.

## Table of Contents {#table-of-contents}

* [Aperçu](#overview)
* [Flux de travail CI/CD](#cicd-workflow)
  * [Flux de travail des actions GitHub](#github-actions-workflow)
  * [Structure de l'image Docker](#docker-image-structure)
* [Processus de déploiement](#deployment-process)
  * [Installation](#installation)
  * [Configuration de Docker Compose](#docker-compose-configuration)
* [Caractéristiques de maintenance](#maintenance-features)
  * [Mises à jour automatiques](#automatic-updates)
  * [Sauvegarde et restauration](#backup-and-restore)
  * [Renouvellement du certificat](#certificate-renewal)
* [Gestion des versions](#versioning)
* [Accéder aux images](#accessing-images)
* [Contribuer](#contributing)

## Overview {#overview}

La solution auto-hébergée de ForwardEmail utilise GitHub Actions pour créer et publier automatiquement des images Docker dès la sortie d'une nouvelle version. Ces images sont ensuite disponibles pour être déployées sur leurs propres serveurs grâce au script d'installation fourni.

> \[!NOTE]
> There is also our [self-hosted blog](https://forwardemail.net/blog/docs/self-hosted-solution) and [self-hosted developer guide](https://forwardemail.net/self-hosted)
>
> And for the more broken down step-by-step versions see the [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) or [Debian](https://forwardemail.net/guides/selfhosted-on-debian) based guides.

## CI/CD Workflow {#cicd-workflow}

### GitHub Actions Workflow {#github-actions-workflow}

Le processus de création et de publication d'images Docker auto-hébergées est défini dans `.github/workflows/docker-image-build-publish.yml`. Ce flux de travail :

1. **Déclencheurs** : Exécution automatique lors de la publication d'une nouvelle version GitHub
2. **Environnement** : Exécution sur Ubuntu avec Node.js 18.20.4
3. **Processus de build** :
* Extraction du code du dépôt
* Configuration de Docker Buildx pour les builds multiplateformes
* Connexion au registre de conteneurs GitHub (GHCR)
* Mise à jour du schéma pour un déploiement auto-hébergé
* Création de l'image Docker avec `self-hosting/Dockerfile-selfhosted`
* Balisage de l'image avec la version et `latest`
* Envoi des images vers le registre de conteneurs GitHub

```yaml
# Key workflow steps
name: Build and Publish Self-Hosted Docker Image

on:
  release:
    types: [published]  # Trigger on new releases

jobs:
  build-and-publish:
    runs-on: ubuntu-latest
    steps:
      # Setup steps...

      # Build and publish Docker image
      - name: Build / Publish Docker image to GitHub Container Registry
        run: |
          IMAGE_NAME=ghcr.io/${{ github.repository }}-selfhosted:${{ github.ref_name }}
          docker build -f self-hosting/Dockerfile-selfhosted -t $IMAGE_NAME .
          docker tag $IMAGE_NAME ghcr.io/${{ github.repository }}-selfhosted:latest
          docker push $IMAGE_NAME
          docker push ghcr.io/${{ github.repository }}-selfhosted:latest
```

Structure de l'image Docker ### {#docker-image-structure}

L'image Docker est construite à l'aide d'une approche en plusieurs étapes définie dans `self-hosting/Dockerfile-selfhosted` :

1. **Étape de construction** :
* Utilise Node.js 20 comme image de base
* Définit la variable d'environnement `SELF_HOSTED=true`
* Installe les dépendances avec pnpm
* Compile l'application en mode production

2. **Étape finale** :
* Utilise une image Node.js 20 plus légère
* Installe uniquement les dépendances système nécessaires
* Crée les répertoires requis pour le stockage des données
* Copie l'application compilée depuis l'étape de compilation

Cette approche garantit que l’image finale est optimisée en termes de taille et de sécurité.

Processus de déploiement ## {#deployment-process}

Installation de ### {#installation}

Les utilisateurs peuvent déployer la solution auto-hébergée à l'aide du script de configuration fourni :

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/refs/heads/master/self-hosting/setup.sh)
```

Ce script :

1. Clonage du dépôt
2. Configuration de l'environnement
3. Configuration des paramètres DNS et du pare-feu
4. Génération des certificats SSL
5. Extraction des dernières images Docker
6. Démarrage des services via Docker Compose

Configuration de Docker Compose {#docker-compose-configuration}

Le fichier `docker-compose-self-hosted.yml` définit tous les services requis pour la solution auto-hébergée :

* **Web** : Interface web principale
* **API** : Serveur API pour l'accès programmatique
* **SMTP** : Service d'envoi d'e-mails
* **IMAP/POP3** : Services de récupération d'e-mails
* **MX** : Service d'échange de courrier
* **CalDAV** : Service de calendrier
* **CardDAV** : Service de contacts
* **MongoDB** : Base de données pour le stockage des données utilisateur
* **Redis** : Stockage de données en mémoire
* **SQLite** : Base de données pour le stockage des e-mails

Chaque service utilise la même image Docker mais avec des points d'entrée différents, permettant une architecture modulaire tout en simplifiant la maintenance.

## Fonctionnalités de maintenance {#maintenance-features}

La solution auto-hébergée comprend plusieurs fonctionnalités de maintenance :

### Mises à jour automatiques {#automatic-updates}

Les utilisateurs peuvent activer les mises à jour automatiques qui :

* Récupérer la dernière image Docker chaque nuit
* Redémarrer les services avec l'image mise à jour
* Enregistrer le processus de mise à jour

```bash
# Setup auto-updates (runs at 1 AM daily)
0 1 * * * docker compose -f /path/to/docker-compose-self-hosted.yml pull && docker compose -f /path/to/docker-compose-self-hosted.yml up -d >> /var/log/autoupdate.log 2>&1
```

### Sauvegarde et restauration {#backup-and-restore}

La configuration fournit des options pour :

* Configuration de sauvegardes régulières sur un stockage compatible S3
* Sauvegarde des données MongoDB, Redis et SQLite
* Restauration à partir des sauvegardes en cas de panne

### Renouvellement du certificat {#certificate-renewal}

Les certificats SSL sont gérés automatiquement avec des options pour :

* Générer de nouveaux certificats lors de l'installation
* Renouveler les certificats si nécessaire
* Configurer DKIM pour l'authentification par e-mail

## Contrôle de version {#versioning}

Chaque version de GitHub crée une nouvelle image Docker étiquetée avec :

1. La version spécifique (par exemple, `v1.0.0`)
2. La balise `latest` de la version la plus récente

Les utilisateurs peuvent choisir d'utiliser une version spécifique pour la stabilité ou la balise `latest` pour toujours obtenir les fonctionnalités les plus récentes.

## Accès aux images {#accessing-images}

Les images Docker sont disponibles publiquement à l'adresse :

* `ghcr.io/forwardemail/forwardemail.net-selfhosted:latest`
* `ghcr.io/forwardemail/forwardemail.net-selfhosted:v1.0.0` (exemple de balise de version)

Aucune authentification n'est requise pour extraire ces images.

## Contribuant {#contributing}

Pour contribuer à la solution auto-hébergée :

1. Modifiez les fichiers concernés dans le répertoire `self-hosting`
2. Testez localement ou sur un VPS Ubuntu à l'aide du script `setup.sh` fourni.
3. Soumettez une pull request.
4. Une fois la fusion terminée et la nouvelle version créée, le workflow CI générera et publiera automatiquement l'image Docker mise à jour.