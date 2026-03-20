# Guide complet pour la configuration des e-mails NAS avec Forward Email {#complete-guide-to-nas-email-setup-with-forward-email}

Configurer les notifications par e-mail sur votre NAS ne devrait pas être un casse-tête. Que vous ayez un Synology, un QNAP, ou même un Raspberry Pi, ce guide vous aidera à connecter votre appareil à Forward Email pour que vous sachiez réellement quand quelque chose ne va pas.

La plupart des appareils NAS peuvent envoyer des alertes par e-mail en cas de défaillance de disque, d’alerte de température, de fin de sauvegarde ou d’événements de sécurité. Le problème ? De nombreux fournisseurs d’e-mails sont devenus exigeants en matière de sécurité, et les appareils plus anciens ne peuvent souvent pas suivre. C’est là que Forward Email intervient – nous prenons en charge à la fois les appareils modernes et anciens.

Ce guide couvre la configuration des e-mails pour plus de 75 fournisseurs NAS avec des instructions étape par étape, des informations de compatibilité et des conseils de dépannage. Quel que soit l’appareil que vous utilisez, nous ferons en sorte que vos notifications fonctionnent.


## Table des matières {#table-of-contents}

* [Pourquoi vous avez besoin des notifications e-mail NAS](#why-you-need-nas-email-notifications)
* [Le problème TLS (et comment nous le résolvons)](#the-tls-problem-and-how-we-fix-it)
* [Paramètres SMTP Forward Email](#forward-email-smtp-settings)
* [Matrice complète de compatibilité des fournisseurs NAS](#comprehensive-nas-provider-compatibility-matrix)
* [Configuration e-mail Synology NAS](#synology-nas-email-configuration)
  * [Étapes de configuration](#configuration-steps)
* [Configuration e-mail QNAP NAS](#qnap-nas-email-configuration)
  * [Étapes de configuration](#configuration-steps-1)
  * [Problèmes courants de dépannage QNAP](#common-qnap-troubleshooting-issues)
* [Configuration Legacy ReadyNAS](#readynas-legacy-configuration)
  * [Étapes de configuration Legacy](#legacy-configuration-steps)
  * [Dépannage ReadyNAS](#readynas-troubleshooting)
* [Configuration TerraMaster NAS](#terramaster-nas-configuration)
* [Configuration ASUSTOR NAS](#asustor-nas-configuration)
* [Configuration Buffalo TeraStation](#buffalo-terastation-configuration)
* [Configuration Western Digital My Cloud](#western-digital-my-cloud-configuration)
* [Configuration e-mail TrueNAS](#truenas-email-configuration)
* [Configuration OpenMediaVault](#openmediavault-configuration)
* [Configuration Raspberry Pi NAS](#raspberry-pi-nas-configuration)
  * [Configuration initiale Raspberry Pi](#initial-raspberry-pi-setup)
  * [Configuration du partage de fichiers Samba](#samba-file-sharing-configuration)
  * [Configuration du serveur FTP](#ftp-server-setup)
  * [Configuration des notifications e-mail](#email-notification-configuration)
  * [Fonctionnalités avancées Raspberry Pi NAS](#advanced-raspberry-pi-nas-features)
  * [Dépannage e-mail Raspberry Pi](#raspberry-pi-email-troubleshooting)
  * [Optimisation des performances](#performance-optimization)
  * [Considérations de sécurité](#security-considerations)


## Pourquoi vous avez besoin des notifications e-mail NAS {#why-you-need-nas-email-notifications}

Votre NAS surveille énormément de choses – la santé des disques, la température, les problèmes réseau, les événements de sécurité. Sans alertes par e-mail, les problèmes peuvent passer inaperçus pendant des semaines, ce qui peut entraîner une perte de données ou des failles de sécurité.

Les notifications par e-mail vous alertent immédiatement lorsque les disques commencent à faiblir, avertissent des tentatives d’accès non autorisées, confirment les sauvegardes réussies et vous tiennent informé de la santé du système. Forward Email s’assure que ces notifications critiques vous parviennent réellement.


## Le problème TLS (et comment nous le résolvons) {#the-tls-problem-and-how-we-fix-it}

Voici le problème : si votre NAS a été fabriqué avant 2020, il ne prend probablement en charge que TLS 1.0. Gmail, Outlook et la plupart des fournisseurs ont abandonné ce support il y a des années. Votre appareil essaie d’envoyer un e-mail, se fait rejeter, et vous restez dans le noir.

Forward Email résout cela grâce à un support à double port. Les appareils modernes utilisent nos ports standards (`465` et `587`), tandis que les appareils plus anciens peuvent utiliser nos ports legacy (`2455` et `2555`) qui prennent encore en charge TLS 1.0.

> \[!IMPORTANT]
> Forward Email prend en charge à la fois les appareils NAS modernes et legacy grâce à notre stratégie à double port. Utilisez les ports 465/587 pour les appareils modernes avec support TLS 1.2+, et les ports 2455/2555 pour les appareils legacy qui ne supportent que TLS 1.0.


## Paramètres SMTP Forward Email {#forward-email-smtp-settings}
Voici ce que vous devez savoir sur notre configuration SMTP :

**Pour les appareils NAS modernes (2020+) :** Utilisez `smtp.forwardemail.net` avec le port `465` (SSL/TLS) ou le port `587` (STARTTLS). Ceux-ci fonctionnent avec le firmware actuel qui prend en charge TLS 1.2+.

**Pour les appareils NAS plus anciens :** Utilisez `smtp.forwardemail.net` avec le port `2455` (SSL/TLS) ou le port `2555` (STARTTLS). Ceux-ci prennent en charge TLS 1.0 pour les appareils hérités.

**Authentification :** Utilisez votre alias Forward Email comme nom d’utilisateur et le mot de passe généré depuis [Mon Compte -> Domaines -> Alias](https://forwardemail.net/my-account/domains) (pas votre mot de passe de compte).

> \[!CAUTION]
> N’utilisez jamais votre mot de passe de connexion au compte pour l’authentification SMTP. Utilisez toujours le mot de passe généré depuis [Mon Compte -> Domaines -> Alias](https://forwardemail.net/my-account/domains) pour la configuration NAS.

> \[!TIP]
> Vérifiez la version du firmware de votre appareil NAS et la prise en charge TLS avant la configuration. La plupart des appareils fabriqués après 2020 prennent en charge les protocoles TLS modernes, tandis que les appareils plus anciens nécessitent généralement des ports de compatibilité hérités.


## Matrice complète de compatibilité des fournisseurs NAS {#comprehensive-nas-provider-compatibility-matrix}

La matrice suivante fournit des informations détaillées sur la compatibilité des principaux fournisseurs NAS, y compris les niveaux de prise en charge TLS, l’état du firmware et les paramètres recommandés de configuration Forward Email.

| Fournisseur NAS | Modèles actuels | Prise en charge TLS | État du firmware | Ports recommandés | Problèmes courants                                                                                                                                       | Guide d’installation / Captures d’écran                                                                                                         |
| --------------- | --------------- | ------------------- | ---------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Synology        | DSM 7.x         | TLS 1.2+            | Actif            | `465`, `587`      | [Configuration STARTTLS](https://community.synology.com/enu/forum/2/post/124584)                                                                        | [Configuration des notifications par e-mail DSM](https://kb.synology.com/en-af/DSM/help/DSM/AdminCenter/system_notification_email)             |
| QNAP            | QTS 5.x         | TLS 1.2+            | Actif            | `465`, `587`      | [Échecs du centre de notifications](https://www.qnap.com/en/how-to/faq/article/email-notifications-fail-after-updating-to-qts-524%E2%80%93fixed-in-qts-525) | [Configuration du serveur e-mail QTS](https://docs.qnap.com/operating-system/qts/5.1.x/en-us/configuring-an-email-notification-server-EB4E6D7F.html) |
| Raspberry Pi    | Raspberry Pi OS | TLS 1.2+            | Actif            | `465`, `587`      | [Problèmes de résolution DNS](https://www.raspberrypi.org/forums/viewtopic.php?t=294014)                                                                | [Guide de configuration e-mail Raspberry Pi](#raspberry-pi-nas-configuration)                                                                 |
| ASUSTOR         | ADM 4.x         | TLS 1.2+            | Actif            | `465`, `587`      | [Validation du certificat](https://forum.asustor.com/viewtopic.php?f=134&t=12345)                                                                       | [Configuration des notifications ASUSTOR](https://www.asustor.com/en/online/online_help?id=8)                                                   |
| TerraMaster     | TOS 6.x         | TLS 1.2             | Actif            | `465`, `587`      | [Authentification SMTP](https://www.terra-master.com/global/forum/)                                                                                     | [Configuration e-mail TerraMaster](https://www.terra-master.com/global/support/download.php)                                                    |
| TrueNAS         | SCALE/CORE      | TLS 1.2+            | Actif            | `465`, `587`      | [Configuration du certificat SSL](https://www.truenas.com/community/threads/email-notifications-not-working.95234/)                                     | [Guide de configuration e-mail TrueNAS](https://www.truenas.com/docs/scale/scaletutorials/systemsettings/general/settingupsystememail/)        |
| Buffalo         | TeraStation     | TLS 1.2             | Limité           | `465`, `587`      | [Compatibilité firmware](https://buffaloamericas.com/knowledge-base/configuring-email-notifications-on-a-ts3010-or-ts5010-series-terastation)           | [Configuration e-mail TeraStation](https://buffaloamericas.com/knowledge-base/configuring-email-notifications-on-a-ts3010-or-ts5010-series-terastation) |
| Western Digital | My Cloud OS 5   | TLS 1.2             | Limité           | `465`, `587`      | [Compatibilité OS héritée](https://community.wd.com/t/my-cloud-email-notifications-not-working/265432)                                                 | [Configuration e-mail My Cloud](https://support-en.wd.com/app/answers/detailweb/a_id/10222)                                                     |
| OpenMediaVault  | OMV 7.x         | TLS 1.2+            | Actif            | `465`, `587`      | [Dépendances des plugins](https://forum.openmediavault.org/index.php?thread/42156-email-notifications-not-working/)                                     | [Configuration des notifications OMV](https://docs.openmediavault.org/en/latest/administration/general/notifications.html)                    |
| Netgear ReadyNAS| OS 6.x          | TLS 1.0 uniquement  | Abandonné        | `2455`, `2555`    | [Prise en charge TLS héritée](https://kb.netgear.com/23066/How-do-I-manage-my-email-alert-contacts-on-my-ReadyNAS-OS-6-storage-system)                   | [Configuration des alertes e-mail ReadyNAS](https://kb.netgear.com/23066/How-do-I-manage-my-email-alert-contacts-on-my-ReadyNAS-OS-6-storage-system) |
| Drobo           | Dashboard       | TLS 1.2             | Abandonné        | `465`, `587`      | [Support limité](https://myprojects.drobo.com/support/)                                                                                                | [Notifications e-mail Drobo](https://www.drobo.com/support/)                                                                                     |
Cette matrice démontre la division claire entre les systèmes NAS modernes, activement maintenus, et les appareils hérités qui nécessitent des considérations de compatibilité particulières. La majorité des appareils NAS actuels prennent en charge les normes TLS modernes et peuvent utiliser les ports SMTP principaux de Forward Email sans configuration spéciale.


## Configuration de l’email sur Synology NAS {#synology-nas-email-configuration}

Les appareils Synology avec DSM sont assez simples à configurer. Ils prennent en charge TLS moderne, vous pouvez donc utiliser nos ports standards sans aucun problème.

> \[!NOTE]
> Synology DSM 7.x offre les fonctionnalités de notification par email les plus complètes. Les versions DSM plus anciennes peuvent avoir des options de configuration limitées.

### Étapes de configuration {#configuration-steps}

1. **Accédez à l’interface web DSM** en entrant l’adresse IP de votre appareil NAS ou l’ID QuickConnect dans un navigateur web.

2. **Naviguez vers le Panneau de configuration** et sélectionnez la section « Notification », puis cliquez sur l’onglet « Email » pour accéder aux options de configuration email.

3. **Activez les notifications par email** en cochant la case « Activer les notifications par email ».

4. **Configurez le serveur SMTP** en entrant `smtp.forwardemail.net` comme adresse du serveur.

5. **Définissez la configuration du port** sur le port 465 pour les connexions SSL/TLS (recommandé). Le port 587 avec STARTTLS est également pris en charge en alternative.

6. **Configurez l’authentification** en sélectionnant « Authentification SMTP requise » et en entrant votre alias Forward Email dans le champ nom d’utilisateur.

7. **Entrez votre mot de passe** en utilisant le mot de passe généré depuis [Mon Compte -> Domaines -> Alias](https://forwardemail.net/my-account/domains).

8. **Configurez les adresses des destinataires** en entrant jusqu’à cinq adresses email qui doivent recevoir les notifications.

9. **Configurez le filtrage des notifications** pour contrôler quels événements déclenchent des alertes par email, évitant ainsi une surcharge de notifications tout en assurant que les événements critiques soient signalés.

10. **Testez la configuration** en utilisant la fonction de test intégrée de DSM pour vérifier que tous les paramètres sont corrects et que la communication avec les serveurs de Forward Email fonctionne correctement.

> \[!TIP]
> Synology permet différents types de notifications pour différents destinataires, offrant une flexibilité dans la distribution des alertes au sein de votre équipe.


## Configuration de l’email sur QNAP NAS {#qnap-nas-email-configuration}

Les appareils QNAP avec QTS fonctionnent très bien avec Forward Email. Ils prennent en charge TLS moderne et disposent d’une belle interface web pour la configuration.

> \[!IMPORTANT]
> QNAP QTS 5.2.4 avait un problème connu avec les notifications par email qui a été [corrigé dans QTS 5.2.5](https://www.qnap.com/en/how-to/faq/article/email-notifications-fail-after-updating-to-qts-524%E2%80%93fixed-in-qts-525). Assurez-vous que votre firmware est à jour pour éviter les échecs de notification.

### Étapes de configuration {#configuration-steps-1}

1. **Accédez à l’interface web de votre appareil QNAP** en entrant son adresse IP dans un navigateur web.

2. **Naviguez vers le Panneau de configuration** et sélectionnez « Compte de service et appairage d’appareil », puis cliquez sur la section « E-mail » pour commencer la configuration email.

3. **Cliquez sur « Ajouter un service SMTP »** pour créer une nouvelle configuration email.

4. **Configurez le serveur SMTP** en entrant `smtp.forwardemail.net` comme adresse du serveur SMTP.

5. **Sélectionnez le protocole de sécurité approprié** - choisissez « SSL/TLS » avec le port `465` (recommandé). Le port `587` avec STARTTLS est également pris en charge.

6. **Configurez le numéro de port** - le port `465` avec SSL/TLS est recommandé. Le port `587` avec STARTTLS est également disponible si nécessaire.

7. **Entrez vos identifiants d’authentification** en utilisant votre alias Forward Email comme nom d’utilisateur et votre mot de passe généré depuis [Mon Compte -> Domaines -> Alias](https://forwardemail.net/my-account/domains).

8. **Configurez les informations de l’expéditeur** en entrant un nom descriptif pour le champ « De », comme « Système NAS QNAP » ou le nom d’hôte de votre appareil.

9. **Configurez les adresses des destinataires** pour différents types de notifications. QNAP vous permet de configurer plusieurs groupes de destinataires pour différents types d’alertes.

10. **Testez la configuration** en utilisant la fonction de test email intégrée de QNAP pour vérifier que tous les paramètres fonctionnent correctement.

> \[!TIP]
> Si vous rencontrez des [problèmes de configuration SMTP Gmail](https://forum.qnap.com/viewtopic.php?t=152466), les mêmes étapes de dépannage s’appliquent à Forward Email. Assurez-vous que l’authentification est correctement activée et que les identifiants sont corrects.
> \[!NOTE]
> Les appareils QNAP prennent en charge la planification avancée des notifications, vous permettant de configurer des heures calmes pendant lesquelles les notifications non critiques sont supprimées. Cela est particulièrement utile dans les environnements professionnels.

### Problèmes courants de dépannage QNAP {#common-qnap-troubleshooting-issues}

Si votre appareil QNAP [n’envoie pas les e-mails de notification](https://www.reddit.com/r/qnap/comments/1dc6z03/qnap_nas_will_not_send_notification_emails/), vérifiez les points suivants :

* Vérifiez que vos identifiants Forward Email sont corrects
* Assurez-vous que l’adresse du serveur SMTP est exactement `smtp.forwardemail.net`
* Confirmez que le port correspond à votre méthode de chiffrement (`465` pour SSL/TLS est recommandé ; `587` pour STARTTLS est également pris en charge)
* Vérifiez que votre [configuration du serveur SMTP](https://www.qnap.com/en/how-to/faq/article/why-does-notification-center-fail-to-send-emails-to-my-smtp-server) autorise la connexion


## Configuration Legacy ReadyNAS {#readynas-legacy-configuration}

Les appareils Netgear ReadyNAS présentent des défis uniques en raison de l’arrêt du support de leur firmware et de leur dépendance aux protocoles TLS 1.0 legacy. Cependant, la prise en charge des ports legacy de Forward Email garantit que ces appareils peuvent continuer à envoyer des notifications par e-mail de manière fiable.

> \[!CAUTION]
> ReadyNAS OS 6.x ne prend en charge que TLS 1.0, ce qui nécessite les ports de compatibilité legacy de Forward Email `2455` et `2555`. Les ports modernes `465` et `587` ne fonctionneront pas avec ces appareils.

### Étapes de configuration legacy {#legacy-configuration-steps}

1. **Accédez à l’interface web ReadyNAS** en entrant l’adresse IP de l’appareil dans un navigateur web.

2. **Naviguez vers Système > Paramètres > Alertes** pour accéder à la section de configuration des e-mails.

3. **Configurez le serveur SMTP** en entrant `smtp.forwardemail.net` comme adresse du serveur.

4. **Définissez la configuration du port** sur `2455` pour les connexions SSL/TLS ou `2555` pour les connexions STARTTLS - ce sont les ports de compatibilité legacy de Forward Email.

5. **Activez l’authentification** et saisissez votre alias Forward Email comme nom d’utilisateur ainsi que votre mot de passe généré depuis [Mon Compte -> Domaines -> Alias](https://forwardemail.net/my-account/domains).

6. **Configurez les informations de l’expéditeur** avec une adresse "De" descriptive pour identifier l’appareil ReadyNAS.

7. **Ajoutez les adresses e-mail des destinataires** en utilisant le bouton + dans la section contacts e-mail.

8. **Testez la configuration** pour vous assurer que la connexion TLS legacy fonctionne correctement.

> \[!IMPORTANT]
> Les appareils ReadyNAS nécessitent les ports legacy car ils ne peuvent pas établir de connexions sécurisées avec les protocoles TLS modernes. Il s’agit d’une [limitation connue](https://kb.netgear.com/23066/How-do-I-manage-my-email-alert-contacts-on-my-ReadyNAS-OS-6-storage-system) du firmware abandonné.

### Dépannage ReadyNAS {#readynas-troubleshooting}

Les problèmes courants avec la configuration e-mail ReadyNAS incluent :

* **Incompatibilité de version TLS** : Assurez-vous d’utiliser les ports `2455` ou `2555`, pas les ports modernes
* **Échecs d’authentification** : Vérifiez que vos identifiants Forward Email sont corrects
* **Connectivité réseau** : Vérifiez que le ReadyNAS peut atteindre `smtp.forwardemail.net`
* **Limitations du firmware** : Certains modèles ReadyNAS plus anciens peuvent avoir des [exigences supplémentaires de configuration HTTPS](https://kb.netgear.com/23100/How-do-I-configure-HTTPS-HTTP-with-SSL-encryption-settings-on-my-ReadyNAS-OS-6-storage-system)

Les appareils ReadyNAS fonctionnant sous OS 6.x et versions antérieures ne prennent en charge que les connexions TLS 1.0, que la plupart des fournisseurs de messagerie modernes n’acceptent plus. Les ports legacy dédiés de Forward Email (2455 et 2555) prennent spécifiquement en charge ces anciens protocoles, garantissant une fonctionnalité continue pour les utilisateurs ReadyNAS.

Pour configurer l’e-mail sur les appareils ReadyNAS, accédez à l’interface web de l’appareil via son adresse IP. Naviguez vers la section Système et sélectionnez « Notifications » pour accéder aux options de configuration e-mail.

Dans la section de configuration e-mail, activez les notifications par e-mail et saisissez smtp.forwardemail.net comme serveur SMTP. C’est crucial – utilisez les ports compatibles legacy de Forward Email plutôt que les ports SMTP standards.

Pour les connexions SSL/TLS, configurez le port 2455 au lieu du port standard 465 (recommandé). Pour les connexions STARTTLS, utilisez le port 2555 au lieu du port 587. Ces ports spéciaux maintiennent la compatibilité TLS 1.0 tout en offrant la meilleure sécurité disponible pour les appareils legacy.
Entrez votre alias Forward Email comme nom d'utilisateur et votre mot de passe généré pour l'authentification. Les appareils ReadyNAS prennent en charge l'authentification SMTP, qui est requise pour les connexions Forward Email.

Configurez l'adresse e-mail de l'expéditeur et les adresses des destinataires selon vos besoins de notification. ReadyNAS permet plusieurs adresses de destinataires, vous permettant de distribuer les alertes à différents membres de l'équipe ou comptes e-mail.

Testez la configuration avec soin, car les appareils ReadyNAS peuvent ne pas fournir de messages d'erreur détaillés en cas d'échec de la configuration. Si les tests standards ne fonctionnent pas, vérifiez que vous utilisez les bons ports hérités (2455 ou 2555) plutôt que les ports SMTP modernes.

Considérez les implications de sécurité liées à l'utilisation des protocoles TLS hérités. Bien que les ports hérités de Forward Email offrent la meilleure sécurité disponible pour les appareils plus anciens, il est recommandé de passer à un système NAS moderne avec un support TLS actuel lorsque cela est possible.


## Configuration TerraMaster NAS {#terramaster-nas-configuration}

Les appareils TerraMaster fonctionnant sous TOS 6.x prennent en charge TLS moderne et fonctionnent bien avec les ports standard de Forward Email.

> \[!NOTE]
> TerraMaster TOS 6.x offre des fonctionnalités complètes de notification par e-mail. Assurez-vous que votre firmware est à jour pour une compatibilité optimale.

1. **Accéder aux paramètres système**
   * Connectez-vous à l'interface web de votre TerraMaster
   * Naviguez vers **Panneau de configuration** > **Notification**

2. **Configurer les paramètres SMTP**
   * Serveur : `smtp.forwardemail.net`
   * Port : `465` (SSL/TLS, recommandé) ou `587` (STARTTLS)
   * Nom d'utilisateur : Votre alias Forward Email
   * Mot de passe : Mot de passe généré depuis [Mon compte -> Domaines -> Alias](https://forwardemail.net/my-account/domains)

3. **Activer les notifications**
   * Cochez les types de notifications que vous souhaitez recevoir
   * Testez la configuration avec la fonction de test intégrée

> \[!TIP]
> Les appareils TerraMaster fonctionnent mieux avec le port `465` pour les connexions SSL/TLS (recommandé). En cas de problème, le port `587` avec STARTTLS est également supporté.


## Configuration ASUSTOR NAS {#asustor-nas-configuration}

Les appareils ASUSTOR avec ADM 4.x disposent d'un solide support des notifications par e-mail et fonctionnent parfaitement avec Forward Email.

> \[!NOTE]
> ASUSTOR ADM 4.x inclut des options avancées de filtrage des notifications. Vous pouvez personnaliser les événements qui déclenchent les alertes par e-mail.

1. **Ouvrir les paramètres de notification**
   * Accédez à l'interface web ADM
   * Allez dans **Paramètres** > **Notification**

2. **Configurer SMTP**
   * Serveur SMTP : `smtp.forwardemail.net`
   * Port : `465` (SSL/TLS, recommandé) ou `587` (STARTTLS)
   * Authentification : Activée
   * Nom d'utilisateur : Votre alias Forward Email
   * Mot de passe : Mot de passe généré depuis [Mon compte -> Domaines -> Alias](https://forwardemail.net/my-account/domains)

3. **Configurer les types d'alerte**
   * Sélectionnez les événements système qui doivent déclencher des e-mails
   * Configurez les adresses des destinataires
   * Testez la configuration

> \[!IMPORTANT]
> Les appareils ASUSTOR exigent que l'authentification soit explicitement activée dans les paramètres SMTP. N'oubliez pas de cocher cette option.


## Configuration Buffalo TeraStation {#buffalo-terastation-configuration}

Les appareils Buffalo TeraStation disposent de capacités limitées mais fonctionnelles de notification par e-mail. La configuration est simple une fois que vous savez où chercher.

> \[!CAUTION]
> Les mises à jour du firmware Buffalo TeraStation sont peu fréquentes. Assurez-vous d'utiliser le dernier firmware disponible pour votre modèle avant de configurer l'e-mail.

1. **Accéder à la configuration web**
   * Connectez-vous à l'interface web de votre TeraStation
   * Naviguez vers **Système** > **Notification**

2. **Configurer les paramètres e-mail**
   * Serveur SMTP : `smtp.forwardemail.net`
   * Port : `465` (SSL/TLS, recommandé) ou `587` (STARTTLS)
   * Nom d'utilisateur : Votre alias Forward Email
   * Mot de passe : Mot de passe généré depuis [Mon compte -> Domaines -> Alias](https://forwardemail.net/my-account/domains)
   * Activez le chiffrement SSL/TLS

3. **Définir les préférences de notification**
   * Choisissez les événements qui déclenchent les e-mails (erreurs disque, alertes de température, etc.)
   * Saisissez les adresses e-mail des destinataires
   * Enregistrez et testez la configuration

> \[!NOTE]
> Certains anciens modèles de TeraStation peuvent avoir des options limitées de configuration SMTP. Consultez la documentation de votre modèle pour les capacités spécifiques.
## Configuration Western Digital My Cloud {#western-digital-my-cloud-configuration}

Les appareils Western Digital My Cloud fonctionnant sous OS 5 prennent en charge les notifications par email, bien que l’interface puisse être un peu cachée dans les paramètres.

> \[!WARNING]
> Western Digital a interrompu le support de nombreux modèles My Cloud. Vérifiez si votre appareil reçoit toujours des mises à jour du firmware avant de compter sur les notifications par email pour des alertes critiques.

1. **Naviguez vers Paramètres**
   * Ouvrez le tableau de bord web My Cloud
   * Allez dans **Paramètres** > **Général** > **Notifications**

2. **Configurez les détails SMTP**
   * Serveur de messagerie : `smtp.forwardemail.net`
   * Port : `465` (SSL/TLS, recommandé) ou `587` (STARTTLS)
   * Nom d’utilisateur : Votre alias Forward Email
   * Mot de passe : Mot de passe généré depuis [Mon Compte -> Domaines -> Alias](https://forwardemail.net/my-account/domains)
   * Activez le chiffrement

3. **Configurez les types d’alertes**
   * Sélectionnez les catégories de notification (alertes système, santé du disque, etc.)
   * Ajoutez les adresses email des destinataires
   * Testez la configuration email

> \[!TIP]
> Nous recommandons d’utiliser le port `465` avec SSL/TLS. En cas de problème, le port `587` avec STARTTLS est également pris en charge.


## Configuration Email TrueNAS {#truenas-email-configuration}

TrueNAS (SCALE et CORE) offre un excellent support des notifications par email avec des options de configuration détaillées.

> \[!NOTE]
> TrueNAS propose certaines des fonctionnalités de notification par email les plus complètes parmi les systèmes NAS. Vous pouvez configurer des règles d’alerte détaillées et plusieurs destinataires.

1. **Accédez aux Paramètres Système**
   * Connectez-vous à l’interface web TrueNAS
   * Naviguez vers **Système** > **Email**

2. **Configurez les paramètres SMTP**
   * Serveur de messagerie sortant : `smtp.forwardemail.net`
   * Port du serveur de messagerie : `465` (recommandé) ou `587`
   * Sécurité : SSL/TLS (pour 465, recommandé) ou STARTTLS (pour 587)
   * Nom d’utilisateur : Votre alias Forward Email
   * Mot de passe : Mot de passe généré depuis [Mon Compte -> Domaines -> Alias](https://forwardemail.net/my-account/domains)

3. **Configurez les alertes**
   * Allez dans **Système** > **Services d’alerte**
   * Configurez quelles alertes doivent être envoyées par email
   * Définissez les adresses des destinataires et les niveaux d’alerte
   * Testez la configuration avec la fonction de test intégrée

> \[!IMPORTANT]
> TrueNAS vous permet de configurer différents niveaux d’alerte (INFO, NOTICE, WARNING, ERROR, CRITICAL). Choisissez des niveaux appropriés pour éviter le spam tout en assurant que les problèmes critiques soient signalés.


## Configuration OpenMediaVault {#openmediavault-configuration}

OpenMediaVault offre de solides capacités de notification par email via son interface web. Le processus de configuration est simple et clair.

> \[!NOTE]
> Le système de notification d’OpenMediaVault est basé sur des plugins. Assurez-vous que le plugin de notification par email est installé et activé.

1. **Accédez aux Paramètres de Notification**
   * Ouvrez l’interface web OpenMediaVault
   * Allez dans **Système** > **Notification** > **Email**

2. **Configurez les paramètres SMTP**
   * Serveur SMTP : `smtp.forwardemail.net`
   * Port : `465` (SSL/TLS, recommandé) ou `587` (STARTTLS)
   * Nom d’utilisateur : Votre alias Forward Email
   * Mot de passe : Mot de passe généré depuis [Mon Compte -> Domaines -> Alias](https://forwardemail.net/my-account/domains)
   * Activez SSL/TLS

3. **Configurez les règles de notification**
   * Naviguez vers **Système** > **Notification** > **Notifications**
   * Configurez quels événements système doivent déclencher des emails
   * Définissez les adresses des destinataires
   * Testez la fonctionnalité email

> \[!TIP]
> OpenMediaVault vous permet de configurer des horaires de notification. Vous pouvez définir des heures calmes ou limiter la fréquence des notifications pour éviter d’être submergé par les alertes.


## Configuration NAS Raspberry Pi {#raspberry-pi-nas-configuration}

Le Raspberry Pi représente une excellente porte d’entrée vers les fonctionnalités NAS, offrant une solution économique pour les environnements domestiques et les petits bureaux. Configurer un Raspberry Pi en tant que NAS implique la configuration des protocoles de partage de fichiers, des notifications par email et des services réseau essentiels.

> \[!TIP]
> Pour les passionnés de Raspberry Pi, nous recommandons vivement de compléter votre configuration NAS avec [PiKVM](https://pikvm.org/) pour la gestion à distance du serveur et [Pi-hole](https://pi-hole.net/) pour le blocage des publicités et la gestion DNS à l’échelle du réseau. Ces outils créent un environnement de laboratoire domestique complet.
### Configuration initiale du Raspberry Pi {#initial-raspberry-pi-setup}

Avant de configurer les services NAS, assurez-vous que votre Raspberry Pi exécute la dernière version de Raspberry Pi OS et dispose d’un espace de stockage adéquat. Une carte microSD de haute qualité (Classe 10 ou supérieure) ou un SSD USB 3.0 offre de meilleures performances et une meilleure fiabilité pour les opérations NAS.

1. **Mettez à jour le système** en exécutant `sudo apt update && sudo apt upgrade -y` pour garantir que tous les paquets sont à jour.

2. **Activez l’accès SSH** en utilisant `sudo systemctl enable ssh && sudo systemctl start ssh` pour l’administration à distance.

3. **Configurez une adresse IP statique** en modifiant `/etc/dhcpcd.conf` afin d’assurer un accès réseau cohérent.

4. **Configurez le stockage externe** en connectant et montant des disques USB ou en configurant des ensembles RAID pour la redondance des données.

### Configuration du partage de fichiers Samba {#samba-file-sharing-configuration}

Samba fournit un partage de fichiers compatible Windows, rendant votre Raspberry Pi accessible depuis n’importe quel appareil de votre réseau. Le processus de configuration implique l’installation de Samba, la création de partages et la mise en place de l’authentification utilisateur.

Installez Samba avec `sudo apt install samba samba-common-bin` et configurez le fichier principal de configuration situé à `/etc/samba/smb.conf`. Créez des répertoires partagés et définissez les permissions appropriées avec `sudo mkdir -p /srv/samba/shared && sudo chmod 755 /srv/samba/shared`.

Configurez les partages Samba en ajoutant des sections au fichier de configuration pour chaque répertoire partagé. Mettez en place l’authentification utilisateur avec `sudo smbpasswd -a username` pour créer des mots de passe spécifiques à Samba pour l’accès réseau.

> \[!IMPORTANT]
> Utilisez toujours des mots de passe forts pour les utilisateurs Samba et envisagez d’activer l’accès invité uniquement pour les dossiers partagés non sensibles. Consultez la [documentation officielle de Samba](https://www.samba.org/samba/docs/current/man-html/smb.conf.5.html) pour des configurations de sécurité avancées.

### Configuration du serveur FTP {#ftp-server-setup}

FTP offre une autre méthode d’accès aux fichiers, particulièrement utile pour les sauvegardes automatisées et la gestion de fichiers à distance. Installez et configurez vsftpd (Very Secure FTP Daemon) pour des services FTP fiables.

Installez vsftpd avec `sudo apt install vsftpd` et configurez le service en modifiant `/etc/vsftpd.conf`. Activez l’accès des utilisateurs locaux, configurez les paramètres du mode passif et appliquez les restrictions de sécurité appropriées.

Créez des utilisateurs FTP et configurez les permissions d’accès aux répertoires. Envisagez d’utiliser SFTP (SSH File Transfer Protocol) plutôt que le FTP traditionnel pour une sécurité renforcée, car il chiffre toutes les transmissions de données.

> \[!CAUTION]
> Le FTP traditionnel transmet les mots de passe en clair. Utilisez toujours SFTP ou configurez FTP avec le chiffrement TLS pour des transferts de fichiers sécurisés. Consultez les [meilleures pratiques de sécurité vsftpd](https://security.appspot.com/vsftpd.html) avant le déploiement.

### Configuration des notifications par email {#email-notification-configuration}

Configurez votre NAS Raspberry Pi pour envoyer des notifications par email concernant les événements système, les alertes de stockage et le statut de la fin des sauvegardes. Cela implique l’installation et la configuration d’un agent de transfert de mail ainsi que la mise en place de l’intégration Forward Email.

Installez `msmtp` en tant que client SMTP léger avec `sudo apt install msmtp msmtp-mta`. Créez le fichier de configuration à `/etc/msmtprc` avec les paramètres suivants :

```
defaults
auth           on
tls            on
tls_trust_file /etc/ssl/certs/ca-certificates.crt
logfile        /var/log/msmtp.log

account        forwardemail
host           smtp.forwardemail.net
port           465
tls_starttls   off
from           your-alias@yourdomain.com
user           your-alias@yourdomain.com
password       your-generated-password
```

Configurez les notifications système en mettant en place des tâches cron et des scripts de surveillance système qui utilisent `msmtp` pour envoyer des alertes. Créez des scripts pour la surveillance de l’espace disque, les alertes de température et les notifications de fin de sauvegarde.

### Fonctionnalités avancées du NAS Raspberry Pi {#advanced-raspberry-pi-nas-features}

Améliorez votre NAS Raspberry Pi avec des services supplémentaires et des capacités de surveillance. Installez et configurez des outils de surveillance réseau, des solutions de sauvegarde automatisées et des services d’accès à distance.

Configurez [Nextcloud](https://nextcloud.com/) pour une fonctionnalité de type cloud avec accès aux fichiers via le web, synchronisation de calendrier et fonctionnalités collaboratives. Installez-le en utilisant Docker ou le guide d’installation officiel de Nextcloud pour Raspberry Pi.
Configurez des sauvegardes automatisées en utilisant `rsync` et `cron` pour créer des sauvegardes planifiées des données critiques. Configurez des notifications par email pour la fin des sauvegardes et les alertes d’échec en utilisant votre configuration Forward Email.

Mettez en place une surveillance réseau avec des outils comme [Nagios](https://www.nagios.org/) ou [Zabbix](https://www.zabbix.com/) pour surveiller la santé du système, la connectivité réseau et la disponibilité des services.

> \[!NOTE]
> Pour les utilisateurs gérant une infrastructure réseau, envisagez d’intégrer [Switchbot](https://www.reddit.com/r/pikvm/comments/skhxkm/pikvm_with_switchbot/) à votre configuration PiKVM pour le contrôle à distance des interrupteurs physiques. Ce [guide d’intégration Python](https://www.reddit.com/r/pikvm/comments/skhxkm/pikvm_with_switchbot/) fournit des instructions détaillées pour automatiser la gestion des dispositifs physiques.

### Dépannage des emails sur Raspberry Pi {#raspberry-pi-email-troubleshooting}

Les problèmes courants avec la configuration email sur Raspberry Pi incluent des problèmes de résolution DNS, des restrictions de pare-feu et des échecs d’authentification. La nature légère des systèmes Raspberry Pi peut parfois provoquer des problèmes de synchronisation avec les connexions SMTP.

Si les notifications par email échouent, vérifiez le fichier journal `msmtp` situé à `/var/log/msmtp.log` pour des messages d’erreur détaillés. Assurez-vous que vos identifiants Forward Email sont corrects et que le Raspberry Pi peut résoudre `smtp.forwardemail.net`.

Testez la fonctionnalité email en ligne de commande : `echo "Test message" | msmtp recipient@example.com`. Cela aide à isoler les problèmes de configuration des problèmes spécifiques à une application.

Configurez correctement les paramètres DNS dans `/etc/resolv.conf` si vous rencontrez des problèmes de résolution DNS. Envisagez d’utiliser des serveurs DNS publics comme `8.8.8.8` ou `1.1.1.1` si le DNS local est peu fiable.

### Optimisation des performances {#performance-optimization}

Optimisez les performances de votre NAS Raspberry Pi grâce à une configuration appropriée du stockage, des paramètres réseau et des ressources système. Utilisez des dispositifs de stockage de haute qualité et configurez les options du système de fichiers adaptées à votre cas d’usage.

Activez le démarrage USB 3.0 pour de meilleures performances de stockage si vous utilisez des disques externes. Configurez la répartition de la mémoire GPU avec `sudo raspi-config` pour allouer plus de RAM aux opérations système plutôt qu’au traitement graphique.

Surveillez les performances système avec des outils comme `htop`, `iotop` et `nethogs` pour identifier les goulets d’étranglement et optimiser l’utilisation des ressources. Envisagez une mise à niveau vers un Raspberry Pi 4 avec 8 Go de RAM pour les applications NAS exigeantes.

Mettez en place des solutions de refroidissement appropriées pour éviter le throttling thermique lors d’opérations intensives. Surveillez la température du CPU avec `/opt/vc/bin/vcgencmd measure_temp` et assurez une ventilation adéquate.

### Considérations de sécurité {#security-considerations}

Sécurisez votre NAS Raspberry Pi en mettant en œuvre des contrôles d’accès appropriés, des mesures de sécurité réseau et des mises à jour régulières de sécurité. Changez les mots de passe par défaut, désactivez les services inutiles et configurez les règles de pare-feu.

Installez et configurez `fail2ban` pour protéger contre les attaques par force brute sur SSH et autres services. Configurez les mises à jour de sécurité automatiques avec `unattended-upgrades` pour garantir l’application rapide des correctifs critiques.

Configurez la segmentation réseau pour isoler votre NAS des autres appareils réseau lorsque cela est possible. Utilisez un accès VPN pour les connexions à distance plutôt que d’exposer directement les services sur Internet.

Sauvegardez régulièrement la configuration et les données de votre Raspberry Pi pour prévenir la perte de données due à des pannes matérielles ou des incidents de sécurité. Testez les procédures de restauration des sauvegardes pour garantir les capacités de récupération des données.

La configuration NAS Raspberry Pi offre une excellente base pour apprendre les concepts de stockage réseau tout en fournissant une fonctionnalité pratique pour les environnements domestiques et les petits bureaux. La combinaison avec Forward Email assure une livraison fiable des notifications pour la surveillance système et les alertes de maintenance.
