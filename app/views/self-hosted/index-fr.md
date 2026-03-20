# Auto-hébergé {#self-hosted}


## Table des matières {#table-of-contents}

* [Commencer](#getting-started)
* [Exigences](#requirements)
  * [Cloud-init / User-data](#cloud-init--user-data)
* [Installation](#install)
  * [Déboguer le script d'installation](#debug-install-script)
  * [Invites](#prompts)
  * [Configuration initiale (Option 1)](#initial-setup-option-1)
* [Services](#services)
  * [Chemins de fichiers importants](#important-file-paths)
* [Configuration](#configuration)
  * [Configuration DNS initiale](#initial-dns-setup)
* [Intégration](#onboarding)
* [Tests](#testing)
  * [Créer votre premier alias](#creating-your-first-alias)
  * [Envoyer / Recevoir votre premier email](#sending--receiving-your-first-email)
* [Dépannage](#troubleshooting)
  * [Quel est le nom d'utilisateur et le mot de passe de l'authentification basique](#what-is-the-basic-auth-username-and-password)
  * [Comment savoir ce qui est en cours d'exécution](#how-do-i-know-what-is-running)
  * [Comment savoir si quelque chose ne fonctionne pas alors que ça devrait](#how-do-i-know-if-something-isnt-running-that-should-be)
  * [Comment trouver les journaux](#how-do-i-find-logs)
  * [Pourquoi mes emails sortants expirent-ils](#why-are-my-outgoing-emails-timing-out)


## Commencer {#getting-started}

Notre solution d'email auto-hébergée, comme tous nos produits, est 100 % open-source — à la fois frontend et backend. Cela signifie :

1. **Transparence complète** : Chaque ligne de code qui traite vos emails est disponible pour examen public
2. **Contributions communautaires** : Tout le monde peut contribuer à des améliorations ou corriger des problèmes
3. **Sécurité par l'ouverture** : Les vulnérabilités peuvent être identifiées et corrigées par une communauté mondiale
4. **Pas de dépendance au fournisseur** : Vous ne dépendez jamais de l'existence de notre entreprise

L'ensemble du code est disponible sur GitHub à l'adresse <https://github.com/forwardemail/forwardemail.net>, sous licence MIT.

L'architecture comprend des conteneurs pour :

* Serveur SMTP pour les emails sortants
* Serveurs IMAP/POP3 pour la récupération des emails
* Interface web pour l'administration
* Base de données pour le stockage de la configuration
* Redis pour la mise en cache et la performance
* SQLite pour un stockage sécurisé et chiffré des boîtes aux lettres

> \[!NOTE]
> N'oubliez pas de consulter notre [blog auto-hébergé](https://forwardemail.net/blog/docs/self-hosted-solution)
>
> Et pour ceux qui souhaitent une version plus détaillée étape par étape, consultez nos guides basés sur [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) ou [Debian](https://forwardemail.net/guides/selfhosted-on-debian).


## Exigences {#requirements}

Avant d'exécuter le script d'installation, assurez-vous d'avoir les éléments suivants :

* **Système d'exploitation** : Un serveur basé sur Linux (supporte actuellement Ubuntu 22.04+).
* **Ressources** : 1 vCPU et 2 Go de RAM
* **Accès root** : Privilèges administratifs pour exécuter les commandes.
* **Nom de domaine** : Un domaine personnalisé prêt pour la configuration DNS.
* **IP propre** : Assurez-vous que votre serveur dispose d'une adresse IP propre sans réputation de spam antérieure en vérifiant les listes noires. Plus d'infos [ici](#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation).
* Adresse IP publique avec support du port 25
* Capacité à définir un [PTR inverse](https://www.cloudflare.com/learning/dns/dns-records/dns-ptr-record/)
* Support IPv4 et IPv6

> \[!TIP]
> Consultez notre liste des [fournisseurs de serveurs mail géniaux](https://github.com/forwardemail/awesome-mail-server-providers)

### Cloud-init / User-data {#cloud-init--user-data}

La plupart des fournisseurs cloud supportent une configuration cloud-init lors de la mise en service du serveur privé virtuel (VPS). C’est un excellent moyen de définir certains fichiers et variables d’environnement à l’avance pour être utilisés par la logique de configuration initiale des scripts, ce qui évite d’avoir à répondre aux invites pendant l’exécution du script.

**Options**

* `EMAIL` - email utilisé pour les rappels d'expiration certbot
* `DOMAIN` - domaine personnalisé (ex. `example.com`) utilisé pour la configuration auto-hébergée
* `AUTH_BASIC_USERNAME` - nom d'utilisateur utilisé lors de la première configuration pour protéger le site
* `AUTH_BASIC_PASSWORD` - mot de passe utilisé lors de la première configuration pour protéger le site
* `/root/.cloudflare.ini` - (**utilisateurs Cloudflare uniquement**) fichier de configuration Cloudflare utilisé par certbot pour la configuration DNS. Il nécessite que vous définissiez votre jeton API via `dns_cloudflare_api_token`. En savoir plus [ici](https://certbot-dns-cloudflare.readthedocs.io/en/stable/).
Exemple :

```sh
#cloud-config
write_files:
  - path: /root/.cloudflare.ini
    content: |
      dns_cloudflare_api_token = "xxx"
    owner: root:root
    permissions: '0600'
  - path: /etc/profile.d/env.sh
    content: |
      export EMAIL="test@myemail.com"
      export DOMAIN="mydomain.com"

runcmd:
  - chmod +x /etc/profile.d/env.sh
```


## Installer {#install}

Exécutez la commande suivante sur votre serveur pour télécharger et exécuter le script d'installation :

```sh
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

### Déboguer le script d'installation {#debug-install-script}

Ajoutez `DEBUG=true` devant le script d'installation pour une sortie détaillée :

```sh
DEBUG=true bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

### Invites {#prompts}

```sh
1. Configuration initiale
2. Configurer les sauvegardes
3. Configurer les mises à jour automatiques
4. Renouveler les certificats
5. Restaurer à partir d'une sauvegarde
6. Aide
7. Quitter
```

* **Configuration initiale** : Télécharge le dernier code forward email, configure l'environnement, demande votre domaine personnalisé et configure tous les certificats, clés et secrets nécessaires.
* **Configurer la sauvegarde** : Configurera un cron pour sauvegarder mongoDB et redis en utilisant un stockage compatible S3 pour un stockage sécurisé et distant. Séparément, sqlite sera sauvegardé à la connexion s'il y a des modifications pour des sauvegardes sécurisées et chiffrées.
* **Configurer la mise à jour** : Configure un cron pour rechercher des mises à jour nocturnes qui reconstruiront et redémarreront en toute sécurité les composants de l'infrastructure.
* **Renouveler les certificats** : Certbot / lets encrypt est utilisé pour les certificats SSL et les clés expirent tous les 3 mois. Cela renouvellera les certificats pour votre domaine et les placera dans le dossier nécessaire pour que les composants concernés puissent les utiliser. Voir [chemins de fichiers importants](#important-file-paths)
* **Restaurer à partir d'une sauvegarde** : Déclenchera la restauration de mongodb et redis à partir des données de sauvegarde.

### Configuration initiale (Option 1) {#initial-setup-option-1}

Choisissez l'option `1. Configuration initiale` pour commencer.

Une fois terminé, vous devriez voir un message de succès. Vous pouvez même exécuter `docker ps` pour voir **les** composants démarrés. Plus d'informations sur les composants ci-dessous.


## Services {#services}

| Nom du service |         Port par défaut        | Description                                            |
| ------------- | :----------------------------: | ------------------------------------------------------ |
| Web           |            `443`               | Interface web pour toutes les interactions administratives |
| API           |            `4000`              | Couche API pour abstraire les bases de données         |
| Bree          |             Aucun             | Gestionnaire de tâches et jobs en arrière-plan         |
| SMTP          | `465` (recommandé) / `587`    | Serveur SMTP pour les emails sortants                   |
| SMTP Bree     |             Aucun             | Job SMTP en arrière-plan                                |
| MX            |            `2525`              | Échange de mail pour les emails entrants et le transfert d'emails |
| IMAP          |          `993/2993`            | Serveur IMAP pour les emails entrants et la gestion des boîtes aux lettres |
| POP3          |          `995/2995`            | Serveur POP3 pour les emails entrants et la gestion des boîtes aux lettres |
| SQLite        |            `3456`              | Serveur SQLite pour les interactions avec la/les base(s) de données sqlite |
| SQLite Bree   |             Aucun             | Job SQLite en arrière-plan                              |
| CalDAV        |            `5000`              | Serveur CalDAV pour la gestion des calendriers          |
| CardDAV       |            `6000`              | Serveur CardDAV pour la gestion des calendriers         |
| MongoDB       |           `27017`              | Base de données MongoDB pour la plupart de la gestion des données |
| Redis         |            `6379`              | Redis pour la mise en cache et la gestion d'état        |
| SQLite        |             Aucun             | Base(s) de données SQLite pour les boîtes aux lettres chiffrées |

### Chemins de fichiers importants {#important-file-paths}

Note : *Chemin hôte* ci-dessous est relatif à `/root/forwardemail.net/self-hosting/`.

| Composant              |       Chemin hôte       | Chemin dans le conteneur       |
| ---------------------- | :---------------------: | ------------------------------ |
| MongoDB                |   `./mongo-backups`     | `/backups`                     |
| Redis                  |     `./redis-data`      | `/data`                        |
| Sqlite                 |    `./sqlite-data`      | `/mnt/{SQLITE_STORAGE_PATH}`   |
| Fichier Env            |        `./.env`         | `/app/.env`                    |
| Certificats/Clés SSL   |        `./ssl`          | `/app/ssl/`                    |
| Clé privée             |  `./ssl/privkey.pem`    | `/app/ssl/privkey.pem`         |
| Certificat chaîne complète | `./ssl/fullchain.pem` | `/app/ssl/fullchain.pem`       |
| Certificat CA          |    `./ssl/cert.pem`     | `/app/ssl/cert.pem`            |
| Clé privée DKIM        |    `./ssl/dkim.key`     | `/app/ssl/dkim.key`            |
> \[!IMPORTANT]
> Sauvegardez le fichier `.env` en lieu sûr. Il est crucial pour la récupération en cas de panne.
> Vous pouvez le trouver dans `/root/forwardemail.net/self-hosting/.env`.


## Configuration {#configuration}

### Configuration DNS initiale {#initial-dns-setup}

Chez votre fournisseur DNS de choix, configurez les enregistrements DNS appropriés. Notez que tout ce qui est entre crochets (`<>`) est dynamique et doit être mis à jour avec votre valeur.

| Type  | Nom                | Contenu                      | TTL  |
| ----- | ------------------ | ---------------------------- | ---- |
| A     | "@", ".", ou vide  | <ip_address>                 | auto |
| CNAME | api                | <domain_name>                | auto |
| CNAME | caldav             | <domain_name>                | auto |
| CNAME | carddav            | <domain_name>                | auto |
| CNAME | fe-bounces         | <domain_name>                | auto |
| CNAME | imap               | <domain_name>                | auto |
| CNAME | mx                 | <domain_name>                | auto |
| CNAME | pop3               | <domain_name>                | auto |
| CNAME | smtp               | <domain_name>                | auto |
| MX    | "@", ".", ou vide  | mx.<domain_name> (priorité 0) | auto |
| TXT   | "@", ".", ou vide  | "v=spf1 a -all"              | auto |

#### DNS inverse / enregistrement PTR {#reverse-dns--ptr-record}

Le DNS inverse (rDNS) ou les enregistrements pointeurs inverses (enregistrements PTR) sont essentiels pour les serveurs de messagerie car ils aident à vérifier la légitimité du serveur envoyant l’email. Chaque fournisseur cloud procède différemment, vous devrez donc rechercher comment ajouter un "DNS inverse" pour faire correspondre l’hôte et l’IP à son nom d’hôte correspondant. Très probablement dans la section réseau du fournisseur.

#### Port 25 bloqué {#port-25-blocked}

Certains FAI et fournisseurs cloud bloquent le port 25 pour éviter les acteurs malveillants. Vous devrez peut-être ouvrir un ticket de support pour débloquer le port 25 pour SMTP / email sortant.


## Intégration {#onboarding}

1. Ouvrez la page d’accueil  
   Rendez-vous sur https\://\<domain_name>, en remplaçant \<domain_name> par le domaine configuré dans vos paramètres DNS. Vous devriez voir la page d’accueil de Forward Email.

2. Connectez-vous et configurez votre domaine

* Connectez-vous avec un email et un mot de passe valides.
* Entrez le nom de domaine que vous souhaitez configurer (cela doit correspondre à la configuration DNS).
* Suivez les instructions pour ajouter les enregistrements **MX** et **TXT** requis pour la vérification.

3. Finalisez la configuration

* Une fois vérifié, accédez à la page des alias pour créer votre premier alias.
* Facultativement, configurez **SMTP pour l’email sortant** dans les **Paramètres du domaine**. Cela nécessite des enregistrements DNS supplémentaires.

> \[!NOTE]
> Aucune information n’est envoyée en dehors de votre serveur. L’option auto-hébergée et le compte initial servent uniquement à la connexion admin et à la gestion web des domaines, alias et configurations email associées.


## Tests {#testing}

### Création de votre premier alias {#creating-your-first-alias}

1. Accédez à la page des alias  
   Ouvrez la page de gestion des alias :

```sh
https://<domain_name>/en/my-account/domains/<domain_name>/aliases
```

2. Ajoutez un nouvel alias

* Cliquez sur **Ajouter un alias** (en haut à droite).
* Entrez le nom de l’alias et ajustez les paramètres email selon vos besoins.
* (Optionnel) Activez le support **IMAP/POP3/CalDAV/CardDAV** en cochant la case.
* Cliquez sur **Créer l’alias.**

3. Définissez un mot de passe

* Cliquez sur **Générer un mot de passe** pour créer un mot de passe sécurisé.
* Ce mot de passe sera requis pour vous connecter à votre client email.

4. Configurez votre client email

* Utilisez un client email comme Thunderbird.
* Entrez le nom de l’alias et le mot de passe généré.
* Configurez les paramètres **IMAP** et **SMTP** en conséquence.

#### Paramètres du serveur email {#email-server-settings}

Nom d’utilisateur : `<alias name>`

| Type | Nom d’hôte         | Port | Sécurité de connexion | Authentification  |
| ---- | ------------------ | ---- | --------------------- | ----------------- |
| SMTP | smtp.<domain_name> | 465  | SSL / TLS             | Mot de passe normal |
| IMAP | imap.<domain_name> | 993  | SSL / TLS             | Mot de passe normal |

### Envoi / Réception de votre premier email {#sending--receiving-your-first-email}

Une fois configuré, vous devriez pouvoir envoyer et recevoir des emails à votre nouvelle adresse email auto-hébergée !
## Dépannage {#troubleshooting}

#### Pourquoi cela ne fonctionne-t-il pas en dehors d'Ubuntu et Debian {#why-doesnt-this-work-outside-of-ubuntu-and-debian}

Nous cherchons actuellement à prendre en charge MacOS et envisagerons d'autres systèmes. Veuillez ouvrir une [discussion](https://github.com/orgs/forwardemail/discussions) ou contribuer si vous souhaitez voir d'autres systèmes pris en charge.

#### Pourquoi le défi acme de certbot échoue-t-il {#why-is-the-certbot-acme-challenge-failing}

Le piège le plus courant est que certbot / letsencrypt demandent parfois **2** défis. Vous devez vous assurer d'ajouter **LES DEUX** enregistrements txt.

Exemple :  
Vous pourriez voir deux défis comme ceci :  
\_acme-challenge.example.com -> "randomstring1"  
\_acme-challenge.example.com -> "randomstring2"

Il est également possible que la propagation DNS ne soit pas terminée. Vous pouvez utiliser des outils comme : `https://toolbox.googleapps.com/apps/dig/#TXT/_acme-challenge.<your_domain>`. Cela vous donnera une idée si vos modifications d'enregistrement TXT sont prises en compte. Il est aussi possible que le cache DNS local de votre hôte utilise encore une ancienne valeur obsolète ou n'ait pas encore pris en compte les modifications récentes.

Une autre option est d'utiliser les modifications DNS automatisées de certbot en configurant le fichier `/root/.cloudflare.ini` avec le token API dans votre cloud-init / user-data lors de la configuration initiale du VPS ou de créer ce fichier et de relancer le script. Cela gérera automatiquement les modifications DNS et les mises à jour des défis.

### Quel est le nom d'utilisateur et le mot de passe pour l'authentification basique {#what-is-the-basic-auth-username-and-password}

Pour l'auto-hébergement, nous ajoutons une première fenêtre d'authentification native du navigateur avec un nom d'utilisateur simple (`admin`) et un mot de passe (généré aléatoirement lors de la configuration initiale). Nous ajoutons cela comme protection au cas où une automatisation / un scraper vous devancerait lors de la première inscription via l'expérience web. Vous pouvez trouver ce mot de passe après la configuration initiale dans votre fichier `.env` sous `AUTH_BASIC_USERNAME` et `AUTH_BASIC_PASSWORD`.

### Comment savoir ce qui est en cours d'exécution {#how-do-i-know-what-is-running}

Vous pouvez exécuter `docker ps` pour voir tous les conteneurs en cours d'exécution qui sont lancés à partir du fichier `docker-compose-self-hosting.yml`. Vous pouvez aussi exécuter `docker ps -a` pour voir tout (y compris les conteneurs qui ne sont pas en cours d'exécution).

### Comment savoir si quelque chose ne fonctionne pas alors que ça devrait {#how-do-i-know-if-something-isnt-running-that-should-be}

Vous pouvez exécuter `docker ps -a` pour voir tout (y compris les conteneurs qui ne sont pas en cours d'exécution). Vous pourriez voir un journal de sortie ou une note.

### Comment trouver les logs {#how-do-i-find-logs}

Vous pouvez obtenir plus de logs via `docker logs -f <container_name>`. Si quelque chose s'est arrêté, c'est probablement lié à une mauvaise configuration du fichier `.env`.

Dans l'interface web, vous pouvez consulter `/admin/emails` et `/admin/logs` pour les journaux des emails sortants et les journaux d'erreurs respectivement.

### Pourquoi mes emails sortants expirent-ils {#why-are-my-outgoing-emails-timing-out}

Si vous voyez un message comme Connection timed out when connecting to MX server... alors vous devez vérifier si le port 25 est bloqué. Il est courant que les FAI ou les fournisseurs cloud bloquent ce port par défaut, vous devrez peut-être contacter le support / ouvrir un ticket pour le débloquer.

#### Quels outils devrais-je utiliser pour tester les bonnes pratiques de configuration email et la réputation IP {#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation}

Consultez notre [FAQ ici](/faq#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation).
