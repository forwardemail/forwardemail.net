# Auto-hébergé {#self-hosted}

## Table des matières {#table-of-contents}

* [Commencer](#getting-started)
* [Exigences](#requirements)
  * [Cloud-init / Données utilisateur](#cloud-init--user-data)
* [Installer](#install)
  * [Script d'installation de débogage](#debug-install-script)
  * [Invites](#prompts)
  * [Configuration initiale (option 1)](#initial-setup-option-1)
* [Services](#services)
  * [Chemins de fichiers importants](#important-file-paths)
* [Configuration](#configuration)
  * [Configuration DNS initiale](#initial-dns-setup)
* [Intégration](#onboarding)
* [Essai](#testing)
  * [Créer votre premier alias](#creating-your-first-alias)
  * [Envoi / Réception de votre premier email](#sending--receiving-your-first-email)
* [Dépannage](#troubleshooting)
  * [Quel est le nom d'utilisateur et le mot de passe d'authentification de base](#what-is-the-basic-auth-username-and-password)
  * [Comment savoir ce qui est en cours d'exécution](#how-do-i-know-what-is-running)
  * [Comment savoir si quelque chose ne fonctionne pas alors qu'il devrait fonctionner ?](#how-do-i-know-if-something-isnt-running-that-should-be)
  * [Comment trouver les journaux](#how-do-i-find-logs)
  * [Pourquoi mes e-mails sortants expirent-ils ?](#why-are-my-outgoing-emails-timing-out)

## Mise en route {#getting-started}

Notre solution de messagerie auto-hébergée, comme tous nos produits, est 100 % open source, tant en front-end qu'en back-end. Cela signifie :

1. **Transparence totale** : Chaque ligne de code traitant vos e-mails est accessible au public.
2. **Contributions de la communauté** : Chacun peut contribuer à des améliorations ou corriger des problèmes.
3. **Sécurité par l'ouverture** : Les vulnérabilités peuvent être identifiées et corrigées par une communauté mondiale.
4. **Pas de dépendance vis-à-vis d'un fournisseur** : Vous ne dépendez jamais de l'existence de notre entreprise.

L'intégralité de la base de code est disponible sur GitHub à <https://github.com/forwardemail/forwardemail.net>, sous licence MIT.

L'architecture comprend des conteneurs pour :

* Serveur SMTP pour les e-mails sortants
* Serveurs IMAP/POP3 pour la récupération des e-mails
* Interface web d'administration
* Base de données pour le stockage des configurations
* Redis pour la mise en cache et les performances
* SQLite pour le stockage sécurisé et chiffré des boîtes aux lettres

> \[!NOTE]
> N'oubliez pas de consulter notre guide [blog auto-hébergé](https://forwardemail.net/blog/docs/self-hosted-solution)
>
> Pour une version plus détaillée, consultez nos guides basés sur [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) ou [Debian](https://forwardemail.net/guides/selfhosted-on-debian).

## Exigences {#requirements}

Avant d’exécuter le script d’installation, assurez-vous de disposer des éléments suivants :

* **Système d'exploitation** : Serveur Linux (prenant actuellement en charge Ubuntu 22.04+).
* **Ressources** : 1 vCPU et 2 Go de RAM
* **Accès root** : Droits d'administrateur pour exécuter des commandes.
* **Nom de domaine** : Domaine personnalisé prêt pour la configuration DNS.
* **IP propre** : Assurez-vous que votre serveur dispose d'une adresse IP propre et sans réputation de spam en consultant les listes noires. Plus d'informations : [ici](#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation).
* Adresse IP publique avec prise en charge du port 25
* Possibilité de définir [PTR inversé](https://www.cloudflare.com/learning/dns/dns-records/dns-ptr-record/)
* Prise en charge IPv4 et IPv6

> \[!TIP]
> Consultez notre liste de [fournisseurs de serveurs de messagerie impressionnants](https://github.com/forwardemail/awesome-mail-server-providers)

### Cloud-init / Données utilisateur {#cloud-init--user-data}

La plupart des fournisseurs de cloud prennent en charge une configuration cloud-init lors du provisionnement du serveur privé virtuel (VPS). C'est un excellent moyen de définir à l'avance certains fichiers et variables d'environnement à utiliser par la logique de configuration initiale des scripts, évitant ainsi de demander des informations supplémentaires pendant l'exécution du script.

**Options**

* `EMAIL` - adresse e-mail utilisée pour les rappels d'expiration de certbot
* `DOMAIN` - domaine personnalisé (par exemple, `example.com`) utilisé pour la configuration de l'auto-hébergement
* `AUTH_BASIC_USERNAME` - nom d'utilisateur utilisé lors de la première configuration pour protéger le site
* `AUTH_BASIC_PASSWORD` - mot de passe utilisé lors de la première configuration pour protéger le site
* `/root/.cloudflare.ini` - (**Utilisateurs Cloudflare uniquement**) fichier de configuration Cloudflare utilisé par certbot pour la configuration DNS. Vous devez définir votre jeton API via `dns_cloudflare_api_token`. En savoir plus sur [ici](https://certbot-dns-cloudflare.readthedocs.io/en/stable/).

Exemple:

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

Exécutez la commande suivante sur votre serveur pour télécharger et exécuter le script d'installation :

```sh
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

### Script d'installation de débogage {#debug-install-script}

Ajoutez `DEBUG=true` devant le script d'installation pour une sortie détaillée :

```sh
DEBUG=true bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

### invite {#prompts}

```sh
1. Initial setup
2. Setup Backups
3. Setup Auto Upgrades
4. Renew certificates
5. Restore from Backup
6. Help
7. Exit
```

* **Configuration initiale** : Téléchargez le dernier code de transfert d'e-mails, configurez l'environnement, demandez votre domaine personnalisé et configurez tous les certificats, clés et secrets nécessaires.
* **Sauvegarde de la configuration** : Configurera une tâche cron pour sauvegarder MongoDB et Redis à l'aide d'un stockage distant sécurisé compatible S3. SQLite sera sauvegardé séparément à la connexion en cas de modifications pour des sauvegardes sécurisées et chiffrées.
* **Mise à niveau de la configuration** : Configurez une tâche cron pour rechercher les mises à jour nocturnes, ce qui reconstruira et redémarrera les composants de l'infrastructure en toute sécurité.
* **Renouvellement des certificats** : Certbot / lets encrypt est utilisé pour les certificats SSL et les clés expireront tous les 3 mois. Cela renouvellera les certificats de votre domaine et les placera dans le dossier approprié pour leur utilisation par les composants associés. Voir [chemins de fichiers importants](#important-file-paths)
* **Restauration depuis une sauvegarde** : Déclenchera la restauration depuis les données de sauvegarde de MongoDB et Redis.

### Configuration initiale (option 1) {#initial-setup-option-1}

Choisissez l'option `1. Initial setup` pour commencer.

Une fois l'opération terminée, un message de réussite devrait s'afficher. Vous pouvez même exécuter `docker ps` pour voir **les** composants se lancer. Plus d'informations sur les composants ci-dessous.

## Services {#services}

| Nom du service | Port par défaut | Description |
| ------------ | :----------: | ------------------------------------------------------ |
| Web | `443` | Interface Web pour toutes les interactions avec l'administrateur |
| API | `4000` | Couche API pour abstraire les bases de données |
| Bree | Aucun | Exécuteur de tâches et de tâches en arrière-plan |
| SMTP | `465/587` | Serveur SMTP pour les e-mails sortants |
| SMTP Bree | Aucun | Tâche d'arrière-plan SMTP |
| MX | `2525` | Échange de courrier pour les e-mails entrants et les transferts d'e-mails |
| IMAP | `993/2993` | Serveur IMAP pour la gestion des e-mails entrants et des boîtes aux lettres |
| POP3 | `995/2995` | Serveur POP3 pour la gestion des e-mails entrants et des boîtes aux lettres |
| SQLite | `3456` | Serveur SQLite pour les interactions avec les bases de données SQLite |
| SQLite Bree | Aucun | Tâche d'arrière-plan SQLite |
| CalDAV | `5000` | Serveur CalDAV pour la gestion du calendrier |
| CardDAV | `6000` | Serveur CardDAV pour la gestion du calendrier |
| MongoDB | `27017` | Base de données MongoDB pour la plupart des gestions de données |
| Redis | `6379` | Redis pour la mise en cache et la gestion de l'état |
| SQLite | Aucun | Base(s) de données SQLite pour boîtes aux lettres chiffrées |

### Chemins de fichiers importants {#important-file-paths}

Remarque : le *chemin d'accès à l'hôte* ci-dessous est relatif à `/root/forwardemail.net/self-hosting/`.

| Composant | Chemin de l'hôte | Chemin du conteneur |
| ---------------------- | :-------------------: | ---------------------------- |
| MongoDB | `./mongo-backups` | `/backups` |
| Redis | `./redis-data` | `/data` |
| Sqlite | `./sqlite-data` | `/mnt/{SQLITE_STORAGE_PATH}` |
| Fichier d'environnement | `./.env` | `/app/.env` |
| Certificats/clés SSL | `./ssl` | `/app/ssl/` |
| Clé privée | `./ssl/privkey.pem` | `/app/ssl/privkey.pem` |
| Certificat de chaîne complète | `./ssl/fullchain.pem` | `/app/ssl/fullchain.pem` |
| CA certifiés | `./ssl/cert.pem` | `/app/ssl/cert.pem` |
| Clé privée DKIM | `./ssl/dkim.key` | `/app/ssl/dkim.key` |

> \[!IMPORTANT]
> Enregistrez le fichier `.env` en toute sécurité. Il est essentiel pour la récupération en cas de panne.
> Vous le trouverez dans `/root/forwardemail.net/self-hosting/.env`.

## Configuration de {#configuration}

### Configuration DNS initiale {#initial-dns-setup}

Chez votre fournisseur DNS, configurez les enregistrements DNS appropriés. Notez que les valeurs entre parenthèses (`<>`) sont dynamiques et doivent être mises à jour avec votre valeur.

| Taper | Nom | Contenu | TTL |
| ----- | ------------------ | ----------------------------- | ---- |
| A | "@", "." ou vide | <adresse_ip> | auto |
| CNAME | API | <nom_de_domaine> | auto |
| CNAME | caldav | <nom_de_domaine> | auto |
| CNAME | carddav | <nom_de_domaine> | auto |
| CNAME | rebonds fe | <nom_de_domaine> | auto |
| CNAME | imap | <nom_de_domaine> | auto |
| CNAME | mx | <nom_de_domaine> | auto |
| CNAME | pop3 | <nom_de_domaine> | auto |
| CNAME | SMTP | <nom_de_domaine> | auto |
| MX | "@", "." ou vide | mx.<nom_de_domaine> (priorité 0) | auto |
| TXT | "@", "." ou vide | "v=spf1 a -all" | auto |

#### Enregistrement DNS / PTR inversé {#reverse-dns--ptr-record}

Le DNS inversé (rDNS) ou les enregistrements de pointeur inversé (enregistrements PTR) sont essentiels pour les serveurs de messagerie, car ils permettent de vérifier la légitimité du serveur qui envoie l'e-mail. Chaque fournisseur de cloud procède différemment ; vous devrez donc rechercher comment ajouter un DNS inversé pour associer l'hôte et l'adresse IP au nom d'hôte correspondant. Probablement dans la section réseau du fournisseur.

#### Port 25 bloqué {#port-25-blocked}

Certains FAI et fournisseurs de cloud bloquent le port 25 pour éviter les acteurs malveillants. Vous devrez peut-être ouvrir un ticket d'assistance pour ouvrir le port 25 pour le SMTP et les e-mails sortants.

## Intégration {#onboarding}

1. Ouvrez la page d'accueil. Accédez à https\://\<nom_de_domaine>, en remplaçant \<nom_de_domaine> par le domaine configuré dans vos paramètres DNS. La page d'accueil « Transférer un e-mail » devrait s'afficher.

2. Connectez-vous et intégrez votre domaine

* Connectez-vous avec une adresse e-mail et un mot de passe valides.
* Saisissez le nom de domaine que vous souhaitez configurer (il doit correspondre à la configuration DNS).
* Suivez les instructions pour ajouter les enregistrements **MX** et **TXT** requis pour vérification.

3. Configuration complète

* Une fois la vérification effectuée, accédez à la page Alias pour créer votre premier alias.
* Vous pouvez également configurer **SMTP pour les e-mails sortants** dans les **Paramètres du domaine**. Cela nécessite des enregistrements DNS supplémentaires.

> \[!NOTE]
> Aucune information n'est envoyée en dehors de votre serveur. L'option auto-hébergée et le compte initial servent uniquement à la connexion administrateur et à la vue web pour gérer les domaines, les alias et les configurations de messagerie associées.

## Test de {#testing}

### Création de votre premier alias {#creating-your-first-alias}

1. Accédez à la page Alias
Ouvrez la page de gestion des alias :

```sh
https://<domain_name>/en/my-account/domains/<domain_name>/aliases
```

2. Ajouter un nouvel alias

Cliquez sur **Ajouter un alias** (en haut à droite).
Saisissez l'alias et ajustez les paramètres de messagerie selon vos besoins.
(Facultatif) Activez la prise en charge **IMAP/POP3/CalDAV/CardDAV** en cochant la case correspondante.
Cliquez sur **Créer un alias**.

3. Définissez un mot de passe

* Cliquez sur **Générer un mot de passe** pour créer un mot de passe sécurisé.
* Ce mot de passe vous sera demandé pour vous connecter à votre messagerie.

4. Configurez votre client de messagerie

* Utilisez un client de messagerie comme Thunderbird.
* Saisissez le nom d'alias et le mot de passe généré.
* Configurez les paramètres **IMAP** et **SMTP** en conséquence.

#### Paramètres du serveur de messagerie {#email-server-settings}

Nom d'utilisateur : `<alias name>`

| Taper | Nom d'hôte | Port | Sécurité de la connexion | Authentification |
| ---- | ------------------ | ---- | ------------------- | --------------- |
| SMTP | smtp.<nom_de_domaine> | 465 | SSL / TLS | Mot de passe normal |
| IMAP | imap.<nom_de_domaine> | 993 | SSL / TLS | Mot de passe normal |

### Envoi/Réception de votre premier e-mail {#sending--receiving-your-first-email}

Une fois configuré, vous devriez pouvoir envoyer et recevoir des e-mails à votre adresse e-mail nouvellement créée et auto-hébergée !

## Dépannage de {#troubleshooting}

#### Pourquoi cela ne fonctionne-t-il pas en dehors d'Ubuntu et de Debian ? {#why-doesnt-this-work-outside-of-ubuntu-and-debian}

Nous cherchons actuellement à prendre en charge macOS et nous nous tournerons vers d'autres plateformes. N'hésitez pas à créer un [discussion](https://github.com/orgs/forwardemail/discussions) ou à contribuer si vous souhaitez que d'autres plateformes soient prises en charge.

#### Pourquoi le défi Certbot ACME échoue-t-il ? {#why-is-the-certbot-acme-challenge-failing}

Le piège le plus courant est que certbot / letsencrypt demande parfois **2** défis. Assurez-vous d'ajouter **LES DEUX** enregistrements txt.

Exemple :
Vous pourriez voir deux défis comme celui-ci :
\_acme-challenge.example.com -> "randomstring1"
\_acme-challenge.example.com -> "randomstring2"

Il est également possible que la propagation DNS ne soit pas terminée. Vous pouvez utiliser des outils tels que `https://toolbox.googleapps.com/apps/dig/#TXT/_acme-challenge.<your_domain>`. Cela vous permettra de savoir si les modifications de votre enregistrement TXT doivent être prises en compte. Il est également possible que le cache DNS local de votre hôte utilise encore une valeur obsolète ou n'ait pas pris en compte les modifications récentes.

Une autre option consiste à utiliser les modifications DNS automatisées de Cerbot en définissant le fichier `/root/.cloudflare.ini` avec le jeton API dans cloud-init / user-data lors de la configuration initiale du VPS, ou en créant ce fichier et en réexécutant le script. Cela gérera automatiquement les modifications DNS et les mises à jour des défis.

### Quel est le nom d'utilisateur et le mot de passe d'authentification de base ? {#what-is-the-basic-auth-username-and-password}

Pour l'auto-hébergement, nous ajoutons une fenêtre d'authentification native au navigateur lors de la première connexion, avec un nom d'utilisateur simple (`admin`) et un mot de passe (généré aléatoirement lors de la configuration initiale). Cette option sert uniquement de protection au cas où des robots d'automatisation ou des scrapers vous devancent lors de la première connexion. Après la configuration initiale, vous trouverez ce mot de passe dans votre fichier `.env`, sous `AUTH_BASIC_USERNAME` et `AUTH_BASIC_PASSWORD`.

### Comment savoir ce qui est en cours d'exécution ? {#how-do-i-know-what-is-running}

Vous pouvez exécuter `docker ps` pour afficher tous les conteneurs en cours d'exécution, créés à partir du fichier `docker-compose-self-hosting.yml`. Vous pouvez également exécuter `docker ps -a` pour tout afficher (y compris les conteneurs inactifs).

### Comment savoir si quelque chose ne fonctionne pas alors qu'il devrait l'être ? {#how-do-i-know-if-something-isnt-running-that-should-be}

Vous pouvez exécuter `docker ps -a` pour tout voir (y compris les conteneurs inactifs). Un journal de sortie ou une note peuvent s'afficher.

### Comment trouver les journaux {#how-do-i-find-logs}

Vous pouvez obtenir plus de journaux via `docker logs -f <container_name>`. Si un événement persiste, il est probablement lié à une mauvaise configuration du fichier `.env`.

Dans l'interface utilisateur Web, vous pouvez afficher `/admin/emails` et `/admin/logs` pour les journaux de courrier électronique sortant et les journaux d'erreurs respectivement.

### Pourquoi mes e-mails sortants expirent-ils ? {#why-are-my-outgoing-emails-timing-out}

Si vous voyez un message du type « Délai de connexion expiré lors de la connexion au serveur MX… », vérifiez si le port 25 est bloqué. Il est courant que les FAI et les fournisseurs de cloud bloquent ce port par défaut. Vous devrez alors contacter le support ou créer un ticket pour obtenir son ouverture.

#### Quels outils dois-je utiliser pour tester les meilleures pratiques de configuration de messagerie et la réputation IP ? {#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation}

Jetez un œil à notre [FAQ ici](/faq#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation).