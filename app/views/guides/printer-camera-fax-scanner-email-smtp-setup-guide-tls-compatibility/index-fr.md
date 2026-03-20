# Guide complet pour la configuration des emails d'imprimante, caméra, fax et scanner {#complete-guide-to-printer-camera-fax--scanner-email-setup}

Votre équipement de bureau doit envoyer des emails - les imprimantes alertent sur les niveaux de toner, les caméras IP notifient la détection de mouvement, les télécopieurs rapportent le statut de transmission, et les scanners confirment le traitement des documents. Le problème ? La plupart des fournisseurs d'email ont abandonné le support des anciens appareils, laissant votre équipement incapable d'envoyer des notifications.

[Microsoft Office 365 a interrompu le support de TLS 1.0 et TLS 1.1 en janvier 2022](https://learn.microsoft.com/en-us/troubleshoot/exchange/email-delivery/fix-issues-with-printers-scanners-and-lob-applications-that-send-email-using-off), ce qui a cassé l'email pour des milliers d'appareils. Beaucoup d'imprimantes, caméras et télécopieurs fabriqués avant 2020 ne supportent que ces protocoles hérités et ne peuvent pas être mis à jour.

Forward Email résout ce problème en supportant à la fois les appareils modernes et hérités. Nous disposons de ports dédiés pour l'équipement actuel et de ports spéciaux pour les anciens appareils qui ne peuvent pas être mis à niveau.

> \[!IMPORTANT]
> Forward Email supporte à la fois les appareils modernes et hérités grâce à notre stratégie à double port. Utilisez le port `465` (SSL/TLS, recommandé) ou `587` (STARTTLS) pour les appareils modernes avec support TLS 1.2+, et les ports `2455`/`2555` pour les appareils hérités qui ne supportent que TLS 1.0.


## Table des matières {#table-of-contents}

* [Le problème TLS expliqué](#the-tls-problem-explained)
* [Présentation de la configuration SMTP Forward Email](#forward-email-smtp-configuration-overview)
* [Matrice complète de compatibilité des appareils](#comprehensive-device-compatibility-matrix)
* [Configuration email des imprimantes HP](#hp-printer-email-configuration)
  * [Imprimantes HP modernes (2020 et après)](#modern-hp-printers-2020-and-later)
  * [Imprimantes HP héritées (modèles avant 2020)](#legacy-hp-printers-pre-2020-models)
* [Configuration email des imprimantes Canon](#canon-printer-email-configuration)
  * [Imprimantes Canon actuelles](#current-canon-printers)
  * [Imprimantes Canon héritées](#legacy-canon-printers)
* [Configuration email des imprimantes Brother](#brother-printer-email-configuration)
  * [Configuration de la série Brother MFC](#brother-mfc-series-configuration)
  * [Dépannage des problèmes email Brother](#troubleshooting-brother-email-issues)
* [Configuration email des caméras IP Foscam](#foscam-ip-camera-email-configuration)
  * [Comprendre les limitations email Foscam](#understanding-foscam-email-limitations)
  * [Étapes de configuration email Foscam](#foscam-email-configuration-steps)
  * [Configuration avancée Foscam](#advanced-foscam-configuration)
* [Configuration email des caméras de sécurité Hikvision](#hikvision-security-camera-email-configuration)
  * [Configuration des caméras Hikvision modernes](#modern-hikvision-camera-configuration)
  * [Configuration des caméras Hikvision héritées](#legacy-hikvision-camera-configuration)
* [Configuration email des caméras de sécurité Dahua](#dahua-security-camera-email-configuration)
  * [Configuration email des caméras Dahua](#dahua-camera-email-setup)
  * [Configuration email des NVR Dahua](#dahua-nvr-email-configuration)
* [Configuration email des appareils multifonctions Xerox](#xerox-multifunction-device-email-configuration)
  * [Configuration email MFD Xerox](#xerox-mfd-email-setup)
* [Configuration email des appareils multifonctions Ricoh](#ricoh-multifunction-device-email-configuration)
  * [Configuration MFD Ricoh moderne](#modern-ricoh-mfd-configuration)
  * [Configuration des appareils Ricoh hérités](#legacy-ricoh-device-configuration)
* [Dépannage des problèmes courants de configuration](#troubleshooting-common-configuration-issues)
  * [Problèmes d'authentification et d'identifiants](#authentication-and-credential-issues)
  * [Problèmes TLS et de chiffrement](#tls-and-encryption-problems)
  * [Problèmes de connectivité réseau](#network-connectivity-issues)
  * [Défis spécifiques à la configuration des appareils](#device-specific-configuration-challenges)
* [Considérations de sécurité et bonnes pratiques](#security-considerations-and-best-practices)
  * [Gestion des identifiants](#credential-management)
  * [Sécurité réseau](#network-security)
  * [Divulgation d'informations](#information-disclosure)
  * [Surveillance et maintenance](#monitoring-and-maintenance)
* [Conclusion](#conclusion)
## Le problème TLS expliqué {#the-tls-problem-explained}

Voici ce qui s'est passé : la sécurité des e-mails est devenue plus stricte, mais vos appareils n'ont pas reçu le message. Le matériel moderne prend en charge TLS 1.2+, mais les appareils plus anciens sont bloqués avec TLS 1.0. La plupart des fournisseurs de messagerie ont abandonné le support de TLS 1.0, donc vos appareils ne peuvent pas se connecter.

Cela affecte les opérations réelles - les caméras de sécurité ne peuvent pas envoyer d'alertes lors d'incidents, les imprimantes ne peuvent pas avertir des problèmes de maintenance, et les confirmations de fax se perdent. La [configuration du serveur SMTP](https://forwardemail.net/en/faq#what-are-your-smtp-server-configuration-settings) de Forward Email propose plusieurs ports pour que tout fonctionne.

> \[!TIP]
> Vérifiez la version du firmware de votre appareil et la prise en charge de TLS avant la configuration. La plupart des appareils fabriqués après 2020 prennent en charge les protocoles TLS modernes, tandis que les appareils plus anciens nécessitent généralement des ports de compatibilité héritée.


## Aperçu de la configuration SMTP de Forward Email {#forward-email-smtp-configuration-overview}

Forward Email fournit un service SMTP complet conçu spécifiquement pour répondre aux défis uniques de la configuration des e-mails des appareils. Notre infrastructure prend en charge plusieurs types de connexion et niveaux de sécurité, garantissant la compatibilité avec les équipements de pointe ainsi que les appareils hérités toujours en usage.

Pour les appareils modernes avec prise en charge TLS 1.2+, utilisez notre serveur SMTP principal à smtp.forwardemail.net avec le port 465 pour les connexions SSL/TLS (recommandé) ou le port 587 pour les connexions STARTTLS. Ces ports offrent une sécurité de niveau entreprise et sont compatibles avec toutes les versions actuelles de firmware des appareils.

Les appareils hérités qui ne prennent en charge que TLS 1.0 peuvent utiliser nos ports de compatibilité spécialisés. Le port 2455 fournit des connexions SSL/TLS avec prise en charge TLS 1.0, tandis que le port 2555 offre STARTTLS avec compatibilité des protocoles hérités. Ces ports maintiennent la sécurité la plus élevée possible tout en assurant la fonctionnalité continue des équipements plus anciens.

L'authentification est requise pour toutes les connexions en utilisant votre alias Forward Email comme nom d'utilisateur et un mot de passe généré depuis [Mon compte -> Domaines -> Alias](https://forwardemail.net/my-account/domains). Cette approche offre une sécurité robuste tout en maintenant une large compatibilité avec les différents systèmes d'authentification des appareils.

> \[!CAUTION]
> N'utilisez jamais le mot de passe de connexion de votre compte pour l'authentification SMTP. Utilisez toujours le mot de passe généré depuis [Mon compte -> Domaines -> Alias](https://forwardemail.net/my-account/domains) pour la configuration des appareils.


## Matrice complète de compatibilité des appareils {#comprehensive-device-compatibility-matrix}

Comprendre quels appareils nécessitent un support héritée versus une configuration moderne aide à rationaliser le processus d'installation et garantit une livraison fiable des e-mails dans tout votre écosystème d'appareils.

| Catégorie d'appareil       | Support TLS moderne | TLS héritée requise | Ports recommandés | Problèmes courants                                                                                                                                    | Guide d'installation / Captures d'écran                                                                                                          |
| -------------------------- | ------------------- | ------------------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Imprimantes HP (2020+)     | ✅ TLS 1.2+          | ❌                   | `465`, `587`      | [Validation du certificat](https://h30434.www3.hp.com/t5/Scanning-Faxing-Copying/Scan-to-E-Mail-newer-MFP-Pro-printers-SMTP-Certificate/td-p/9194707) | [Guide d'installation HP LaserJet Pro MFP](https://support.hp.com/us-en/document/ish_6185297-6063300-16)                                          |
| Imprimantes HP (avant 2020)| ❌                   | ✅ TLS 1.0 uniquement | `2455`, `2555`    | [Limitations du firmware](https://www.reddit.com/r/sysadmin/comments/1gnpac4/printers_dont_have_tls_settings/)                                         | [Guide de la fonction Scan to Email](https://support.hp.com/us-en/document/ish_6518575-6518545-16)                                                |
| Imprimantes Canon (actuelles) | ✅ TLS 1.2+       | ❌                   | `465`, `587`      | [Configuration de l'authentification](https://community.usa.canon.com/t5/Office-Printers/MF733CDW-Cannot-Scan-to-Email-with-SMTP-Auth-Error-806/td-p/265358) | [Guide d'authentification SMTP Canon](https://oip.manual.canon/USRMA-0320-zz-CS-enUV/contents/1T0003111775.html)                                 |
| Imprimantes Canon (héritées) | ❌                  | ✅ TLS 1.0 uniquement | `2455`, `2555`    | [Problèmes de certificat](https://community.usa.canon.com/t5/Office-Printers/MF735cx-quot-Register-quot-Certificate-produces-error/td-p/245443)       | [Guide des paramètres avancés d'e-mail](https://oip.manual.canon/USRMA-0163-zz-CS-enGB/contents/08025025.html)                                  |
| Imprimantes Brother (actuelles) | ✅ TLS 1.2+      | ❌                   | `465`, `587`      | [Configuration des ports](https://www.reddit.com/r/techsupport/comments/1548u4o/brother_printer_not_taking_scan_to_email_config/)                      | [Guide de configuration SMTP Brother](https://support.brother.com/g/b/faqend.aspx?c=us&lang=en&prod=mfcl2690dw_us&faqid=faq00100234_512)          |
| Imprimantes Epson (actuelles) | ✅ TLS 1.2+       | ❌                   | `465`, `587`      | Accès à l'interface web                                                                                                                               | [Configuration des notifications e-mail Epson](https://download4.epson.biz/sec_pubs/l6580_series/useg/en/GUID-5FED5794-3E76-4DE9-8B9D-EBD8F60F231C.htm) |
| Caméras IP Foscam          | ❌                   | ✅ TLS 1.0 uniquement | `2455`, `2555`    | [Validation du certificat](https://ipcamtalk.com/threads/foscam-ip-cameras-stopped-sending-email-in-motion-detection.80152/)                         | [FAQ configuration e-mail Foscam](https://www.foscam.com/faqs/view.html?id=63)                                                                  |
| Hikvision (2020+)          | ✅ TLS 1.2+          | ❌                   | `465`, `587`      | Exigences SSL                                                                                                                                          | [Guide de configuration e-mail Hikvision](https://www.hikvision.com/content/dam/hikvision/ca/how-to-document/How-to-setup-email-on-Hikvision-nvr-dvr.pdf) |
| Hikvision (héritée)        | ❌                   | ✅ TLS 1.0 uniquement | `2455`, `2555`    | Mises à jour du firmware                                                                                                                              | [Configuration héritée Hikvision](https://www.hikvision.com/content/dam/hikvision/ca/how-to-document/How-to-setup-email-on-Hikvision-nvr-dvr.pdf) |
| Caméras Dahua (actuelles)  | ✅ TLS 1.2+          | ❌                   | `465`, `587`      | Authentification                                                                                                                                       | [Wiki configuration e-mail Dahua](https://dahuawiki.com/Email/Email_Notifications_Setup_GMail)                                                   |
| MFP Xerox (actuels)        | ✅ TLS 1.2+          | ❌                   | `465`, `587`      | [Configuration TLS](https://www.support.xerox.com/en-us/article/KB0032169)                                                                             | [Guide de configuration TLS Xerox](https://www.support.xerox.com/en-us/article/KB0032169)                                                       |
| MFP Ricoh (actuels)        | ✅ TLS 1.2+          | ❌                   | `465`, `587`      | Configuration SSL                                                                                                                                      | [Configuration e-mail Ricoh](https://www.ricoh.com/info/2025/0526_1)                                                                             |
| MFP Ricoh (hérités)        | ❌                   | ✅ TLS 1.0 uniquement | `2455`, `2555`    | [Problèmes d'authentification basique](https://www.ricoh.com/info/2025/0526_1)                                                                        | [Configuration héritée Ricoh](https://www.ricoh.com/info/2025/0526_1)                                                                            |
Cette matrice fournit une référence rapide pour déterminer l'approche de configuration appropriée pour vos appareils spécifiques. En cas de doute, commencez par les ports modernes et revenez aux ports hérités si des problèmes de connexion surviennent.

> \[!NOTE]
> L'âge de l'appareil n'est pas toujours un indicateur fiable du support TLS. Certains fabricants ont rétroporté le support TLS 1.2 sur des modèles plus anciens via des mises à jour du firmware, tandis que d'autres ont arrêté le support des produits hérités.


## Configuration Email Imprimante HP {#hp-printer-email-configuration}

Les imprimantes HP représentent l'une des plus grandes bases installées d'appareils d'impression connectés en réseau, avec des modèles allant de la série LaserJet Pro actuelle avec un support complet de TLS 1.3 à des modèles hérités ne supportant que TLS 1.0. Le processus de configuration varie considérablement entre les appareils modernes et hérités, nécessitant des approches différentes pour une compatibilité optimale.

### Imprimantes HP Modernes (2020 et plus récentes) {#modern-hp-printers-2020-and-later}

Les imprimantes HP modernes incluent la série LaserJet Pro MFP M404, la série Color LaserJet Pro MFP M479, et des modèles plus récents qui supportent les normes TLS actuelles. Ces appareils offrent des capacités complètes de notification par email via l'interface Embedded Web Server (EWS) de HP.

1. **Accédez à l'interface web de l'imprimante** en entrant l'adresse IP de l'imprimante dans un navigateur web. Vous pouvez trouver l'adresse IP en imprimant une page de configuration réseau depuis le panneau de contrôle de l'imprimante.

2. **Naviguez vers l'onglet Réseau** et sélectionnez "Serveur Email" ou "Paramètres SMTP" selon votre modèle d'imprimante. Certaines imprimantes HP organisent ces paramètres sous "Système" > "Alertes Email."

3. **Configurez les paramètres du serveur SMTP** en entrant `smtp.forwardemail.net` comme adresse du serveur. Sélectionnez "SSL/TLS" comme méthode de chiffrement et entrez `465` comme numéro de port pour la connexion la plus fiable.

4. **Configurez l'authentification** en activant l'authentification SMTP et en entrant votre alias Forward Email comme nom d'utilisateur. Utilisez le mot de passe généré depuis [Mon Compte -> Domaines -> Alias](https://forwardemail.net/my-account/domains), pas votre mot de passe de connexion au compte.

5. **Configurez les informations de l'expéditeur** en entrant votre alias Forward Email comme adresse "De" et un nom descriptif comme "Imprimante HP - Bureau" pour aider à identifier la source des notifications.

6. **Configurez les adresses des destinataires** en ajoutant jusqu'à cinq adresses email qui doivent recevoir les notifications de l'imprimante. Les imprimantes HP permettent d'envoyer différents types de notifications à différents destinataires.

7. **Testez la configuration** en utilisant la fonction de test email intégrée de HP. L'imprimante enverra un message test pour vérifier que tous les paramètres sont corrects et que la communication avec les serveurs de Forward Email fonctionne correctement.

> \[!TIP]
> Les imprimantes HP mettent souvent en cache les recherches DNS. Si vous rencontrez des problèmes de connexion, redémarrez l'imprimante après la configuration pour effacer les entrées DNS mises en cache.

### Imprimantes HP Héritées (Modèles avant 2020) {#legacy-hp-printers-pre-2020-models}

Les anciennes imprimantes HP, y compris la LaserJet Pro MFP M277 et des modèles similaires, ne supportent souvent que TLS 1.0 et nécessitent une configuration spéciale pour fonctionner avec les fournisseurs d'email modernes. Ces appareils affichent fréquemment des erreurs "Échec de la vérification du certificat TLS" lorsqu'ils tentent de se connecter aux ports SMTP standards.

1. **Accédez à l'Embedded Web Server de l'imprimante** en entrant l'adresse IP de l'imprimante dans un navigateur web. Les imprimantes HP héritées peuvent nécessiter Internet Explorer ou le mode compatibilité pour une fonctionnalité complète.

2. **Naviguez vers les paramètres Réseau ou Système** et localisez la section de configuration "Email" ou "SMTP". L'emplacement exact varie selon le modèle et la version du firmware.

3. **Configurez les paramètres SMTP hérités de Forward Email** en entrant smtp.forwardemail.net comme adresse du serveur. C'est crucial - utilisez le port 2455 pour les connexions SSL/TLS ou le port 2555 pour les connexions STARTTLS au lieu des ports standards.

4. **Configurez l'authentification** en activant l'authentification SMTP et en entrant votre alias Forward Email comme nom d'utilisateur. Utilisez votre mot de passe Forward Email généré pour l'authentification.

5. **Configurez soigneusement les paramètres de chiffrement**. Sélectionnez "SSL/TLS" si vous utilisez le port 2455, ou "STARTTLS" si vous utilisez le port 2555. Certains imprimantes HP héritées peuvent nommer ces options différemment.
6. **Définissez les informations de l’expéditeur et du destinataire** en utilisant votre alias Forward Email comme adresse de l’expéditeur et en configurant les adresses des destinataires appropriées pour les notifications.

7. **Testez la configuration** en utilisant la fonction de test de l’imprimante. Si le test échoue avec des erreurs de certificat, vérifiez que vous utilisez les ports hérités corrects (2455 ou 2555) plutôt que les ports SMTP standards.

> \[!CAUTION]
> Les imprimantes HP héritées peuvent ne pas recevoir de mises à jour du firmware traitant les problèmes de compatibilité TLS. Si la configuration continue d’échouer, envisagez d’utiliser un serveur relais SMTP local comme solution intermédiaire.


## Configuration Email des Imprimantes Canon {#canon-printer-email-configuration}

Les imprimantes Canon offrent des capacités robustes de notification par email à travers leurs gammes imageRUNNER, PIXMA et MAXIFY. Les appareils Canon modernes prennent en charge des configurations TLS complètes, tandis que les modèles hérités peuvent nécessiter des réglages spécifiques de compatibilité pour fonctionner avec les fournisseurs d’email actuels.

### Imprimantes Canon Modernes {#current-canon-printers}

Les imprimantes Canon modernes fournissent des fonctionnalités étendues de notification par email via l’interface web Remote UI, prenant en charge tout, des alertes de statut basiques aux notifications détaillées de gestion de l’appareil.

1. **Accédez à l’interface Remote UI** en entrant l’adresse IP de l’imprimante dans un navigateur web. Les imprimantes Canon utilisent généralement une interface web pour toutes les tâches de configuration réseau.

2. **Naviguez vers Paramètres/Enregistrement** et sélectionnez « Gestion de l’appareil » dans le menu. Recherchez « Paramètres de notification par e-mail » ou des options similaires selon votre modèle d’imprimante.

3. **Configurez le serveur SMTP** en cliquant sur « Ajouter une destination » et en entrant smtp.forwardemail.net comme adresse du serveur. Sélectionnez « SSL » ou « TLS » comme méthode de chiffrement.

4. **Définissez le numéro de port** à 465 pour les connexions SSL/TLS (recommandé) ou 587 pour les connexions STARTTLS. Les imprimantes Canon distinguent clairement ces méthodes de chiffrement dans leur interface.

5. **Configurez l’authentification** en activant l’authentification SMTP et en entrant votre alias Forward Email comme nom d’utilisateur. Utilisez le mot de passe généré depuis [Mon Compte -> Domaines -> Aliases](https://forwardemail.net/my-account/domains).

6. **Configurez les informations de l’expéditeur** en entrant votre alias Forward Email comme adresse de l’expéditeur et en configurant un nom d’affichage descriptif pour faciliter l’identification des notifications.

7. **Configurez les types de notifications** en sélectionnant les événements qui doivent déclencher des alertes par email. Les imprimantes Canon offrent un contrôle granulaire sur les types de notifications, incluant les conditions d’erreur, les alertes de maintenance et les événements de sécurité.

8. **Testez la configuration email** en utilisant la fonction de test intégrée de Canon. L’imprimante enverra une notification de test pour vérifier la bonne configuration et connectivité.

> \[!NOTE]
> Les imprimantes Canon fournissent souvent des messages d’erreur détaillés qui peuvent aider à résoudre les problèmes de configuration. Faites attention aux codes d’erreur spécifiques pour une résolution plus rapide.

### Imprimantes Canon Héritées {#legacy-canon-printers}

Les anciennes imprimantes Canon peuvent avoir un support TLS limité et nécessitent une configuration minutieuse pour fonctionner avec les fournisseurs d’email modernes. Ces appareils ont souvent besoin de paramètres SMTP compatibles hérités pour maintenir la fonctionnalité de notification par email.

1. **Accédez à l’interface web de l’imprimante** en utilisant l’adresse IP de l’appareil. Les imprimantes Canon héritées peuvent nécessiter des réglages spécifiques de compatibilité du navigateur pour une fonctionnalité complète.

2. **Naviguez vers la section de configuration email** via le menu de gestion de l’appareil ou des paramètres réseau. Le chemin exact varie selon le modèle et la version du firmware.

3. **Configurez les paramètres SMTP hérités de Forward Email** en entrant smtp.forwardemail.net comme adresse du serveur et en utilisant le port 2455 pour les connexions SSL ou le port 2555 pour les connexions STARTTLS.

4. **Configurez soigneusement l’authentification** en activant l’authentification SMTP et en utilisant votre alias Forward Email et le mot de passe généré. Les imprimantes Canon héritées peuvent avoir des exigences spécifiques d’authentification.

5. **Configurez les paramètres de chiffrement** en sélectionnant l’option TLS appropriée pour le port choisi. Assurez-vous que la méthode de chiffrement correspond à la configuration du port (SSL pour 2455, STARTTLS pour 2555).
6. **Testez la configuration** et surveillez les erreurs de validation de certificat. Si les problèmes persistent, vérifiez que vous utilisez les ports compatibles avec la version legacy de Forward Email plutôt que les ports SMTP standard.

> \[!WARNING]
> Certains imprimantes Canon legacy peuvent ne pas supporter la validation du certificat serveur. Bien que cela réduise la sécurité, cela peut être nécessaire pour assurer la fonctionnalité email sur des appareils plus anciens.


## Configuration Email des Imprimantes Brother {#brother-printer-email-configuration}

Les imprimantes Brother, en particulier les séries MFC et DCP, offrent des capacités complètes de numérisation vers email et de notifications. Cependant, de nombreux utilisateurs signalent des difficultés de configuration lors de la mise en place de la fonctionnalité email, notamment avec Office 365 et d'autres fournisseurs modernes qui ont déprécié les méthodes d'authentification legacy.

### Configuration de la Série Brother MFC {#brother-mfc-series-configuration}

Les imprimantes multifonctions Brother offrent des capacités email étendues, mais la configuration peut être complexe en raison de la variété des options d'authentification et de chiffrement disponibles.

1. **Accédez à l'interface web de l'imprimante** en entrant l'adresse IP de l'imprimante dans un navigateur web. Les imprimantes Brother fournissent un système de configuration complet basé sur le web.

2. **Naviguez vers les paramètres Réseau** et sélectionnez « Email/IFAX » ou « Scan to Email » selon votre modèle d'imprimante. Certaines imprimantes Brother regroupent ces paramètres sous « Paramètres Administrateur ».

3. **Configurez les paramètres du serveur SMTP** en entrant smtp.forwardemail.net comme adresse du serveur. Les imprimantes Brother supportent à la fois les méthodes de chiffrement SSL/TLS et STARTTLS.

4. **Définissez le port et le chiffrement appropriés** en sélectionnant le port 465 avec chiffrement SSL/TLS (recommandé) ou le port 587 avec chiffrement STARTTLS. Les imprimantes Brother indiquent clairement ces options dans leur interface.

5. **Configurez l'authentification SMTP** en activant l'authentification et en entrant votre alias Forward Email comme nom d'utilisateur. Utilisez le mot de passe généré depuis [Mon Compte -> Domaines -> Alias](https://forwardemail.net/my-account/domains).

6. **Configurez les informations de l'expéditeur** en configurant votre alias Forward Email comme adresse de l'expéditeur et en ajoutant un nom descriptif pour identifier l'imprimante dans les notifications email.

7. **Configurez les paramètres de numérisation vers email** en configurant les entrées du carnet d'adresses et les paramètres de numérisation par défaut. Les imprimantes Brother permettent une personnalisation étendue des paramètres de numérisation et de gestion des destinataires.

8. **Testez à la fois les notifications email et la fonctionnalité de numérisation vers email** pour assurer une configuration complète. Les imprimantes Brother fournissent des fonctions de test séparées pour différentes fonctionnalités email.

> \[!TIP]
> Les imprimantes Brother nécessitent souvent des mises à jour du firmware pour résoudre les problèmes de configuration email. Vérifiez les mises à jour disponibles avant de dépanner les problèmes de connexion.

### Dépannage des Problèmes Email Brother {#troubleshooting-brother-email-issues}

Les imprimantes Brother rencontrent fréquemment des défis spécifiques de configuration qui peuvent être résolus avec des approches de dépannage ciblées.

Si votre imprimante Brother affiche des erreurs « Échec d'authentification » lors du test de la configuration email, vérifiez que vous utilisez votre alias Forward Email (et non votre email de compte) comme nom d'utilisateur et le mot de passe généré depuis [Mon Compte -> Domaines -> Alias](https://forwardemail.net/my-account/domains). Les imprimantes Brother sont particulièrement sensibles au format des identifiants d'authentification.

Pour les imprimantes qui n'acceptent pas les paramètres de configuration de numérisation vers email, essayez de configurer les paramètres via l'interface web plutôt que le panneau de contrôle de l'imprimante. L'interface web fournit souvent des messages d'erreur plus détaillés et des options de configuration supplémentaires.

En cas d'erreurs de connexion SSL/TLS, vérifiez que vous utilisez la bonne combinaison de port et de chiffrement. Les imprimantes Brother exigent une correspondance exacte entre les numéros de port et les méthodes de chiffrement - le port 465 doit utiliser SSL/TLS (recommandé), tandis que le port 587 doit utiliser STARTTLS.

> \[!CAUTION]
> Certains modèles d'imprimantes Brother ont des problèmes connus avec des configurations spécifiques de serveur SMTP. Si la configuration standard échoue, consultez la documentation de support Brother pour des solutions spécifiques au modèle.
## Configuration Email de la Caméra IP Foscam {#foscam-ip-camera-email-configuration}

Les caméras IP Foscam représentent l'une des catégories d'appareils les plus difficiles à configurer pour l'email en raison de leur utilisation généralisée de protocoles TLS anciens et de la disponibilité limitée des mises à jour du firmware. La plupart des caméras Foscam, y compris des modèles populaires comme la série R2, ne supportent que TLS 1.0 et ne peuvent pas être mises à jour pour prendre en charge des normes de chiffrement modernes.

### Comprendre les Limitations Email de Foscam {#understanding-foscam-email-limitations}

Les caméras Foscam présentent des défis uniques qui nécessitent des approches de configuration spécifiques. Le message d'erreur le plus courant rencontré est « TLS certificate verification failed: unable to get local issuer certificate », ce qui indique que la caméra ne peut pas valider les certificats SSL modernes utilisés par la plupart des fournisseurs d'email.

Ce problème provient de plusieurs facteurs : des magasins de certificats obsolètes qui ne peuvent pas être mis à jour, un support limité des protocoles TLS qui s'arrête à TLS 1.0, et des limitations du firmware qui empêchent les mises à niveau des protocoles de sécurité. De plus, de nombreux modèles Foscam ont atteint leur fin de vie et ne reçoivent plus de mises à jour du firmware pouvant résoudre ces problèmes de compatibilité.

Les ports SMTP hérités de Forward Email répondent spécifiquement à ces limitations en maintenant la compatibilité TLS 1.0 tout en offrant la meilleure sécurité possible pour ces appareils anciens.

### Étapes de Configuration Email Foscam {#foscam-email-configuration-steps}

Configurer les notifications email sur les caméras Foscam nécessite une attention particulière au choix des ports et aux paramètres de chiffrement pour contourner les limitations TLS des appareils.

1. **Accédez à l'interface web de la caméra** en entrant l'adresse IP de la caméra dans un navigateur web. Les caméras Foscam utilisent généralement le port 88 pour l'accès web (par exemple, <http://192.168.1.100:88>).

2. **Naviguez vers le menu Paramètres** et sélectionnez « Service Mail » ou « Paramètres Email » selon votre modèle de caméra. Certaines caméras Foscam organisent ces paramètres sous « Alarme » > « Service Mail ».

3. **Configurez le serveur SMTP** en entrant smtp.forwardemail.net comme adresse du serveur. C'est crucial – n'utilisez pas les serveurs SMTP des fournisseurs d'email standards car ils ne supportent plus TLS 1.0.

4. **Définissez le port et le chiffrement** en sélectionnant le port 2455 pour le chiffrement SSL ou le port 2555 pour le chiffrement STARTTLS. Ce sont les ports compatibles hérités de Forward Email spécialement conçus pour des appareils comme les caméras Foscam.

5. **Configurez l'authentification** en activant l'authentification SMTP et en entrant votre alias Forward Email comme nom d'utilisateur. Utilisez le mot de passe généré depuis [Mon Compte -> Domaines -> Alias](https://forwardemail.net/my-account/domains).

6. **Configurez les informations de l'expéditeur et du destinataire** en configurant votre alias Forward Email comme adresse de l'expéditeur et en ajoutant les adresses des destinataires pour la détection de mouvement et les alertes système.

7. **Configurez les déclencheurs de notification** en réglant la sensibilité de la détection de mouvement, les horaires d'enregistrement et autres événements devant déclencher des notifications email.

8. **Testez la configuration email** en utilisant la fonction de test intégrée de Foscam. Si le test réussit, vous devriez recevoir un email de test confirmant la bonne configuration.

> \[!IMPORTANT]
> Les caméras Foscam nécessitent les ports hérités de Forward Email (2455 ou 2555) en raison des limitations TLS 1.0. Les ports SMTP standards ne fonctionneront pas avec ces appareils.

### Configuration Avancée Foscam {#advanced-foscam-configuration}

Pour les utilisateurs nécessitant des configurations de notification plus sophistiquées, les caméras Foscam offrent des options supplémentaires qui peuvent améliorer les capacités de surveillance de sécurité.

Configurez des zones de détection de mouvement pour réduire les fausses alertes en définissant des zones spécifiques du champ de vision de la caméra qui doivent déclencher des notifications. Cela évite les emails inutiles causés par des facteurs environnementaux comme des arbres qui bougent ou des véhicules passant.

Mettez en place des horaires d'enregistrement adaptés à vos besoins de surveillance, en vous assurant que les notifications email sont envoyées pendant les périodes appropriées. Les caméras Foscam peuvent supprimer les notifications durant des heures spécifiées pour éviter les alertes nocturnes pour des événements non critiques.
Configurez plusieurs adresses de destinataires pour différents types d’alertes, ce qui vous permet de diriger les alertes de détection de mouvement vers le personnel de sécurité tout en envoyant les alertes de maintenance système au personnel informatique.

> \[!TIP]
> Les caméras Foscam peuvent générer un volume important d’e-mails si la détection de mouvement est trop sensible. Commencez avec des réglages conservateurs et ajustez-les en fonction des caractéristiques de votre environnement.


## Configuration des e-mails pour caméra de sécurité Hikvision {#hikvision-security-camera-email-configuration}

Les caméras Hikvision représentent une part importante du marché mondial des caméras de sécurité, avec des modèles allant des caméras IP basiques aux systèmes de surveillance avancés alimentés par l’IA. Le processus de configuration des e-mails varie considérablement entre les modèles récents avec prise en charge moderne de TLS et les appareils anciens nécessitant des solutions de compatibilité.

### Configuration des caméras Hikvision modernes {#modern-hikvision-camera-configuration}

Les caméras Hikvision actuelles fonctionnant avec des versions récentes du firmware prennent en charge TLS 1.2+ et offrent des capacités complètes de notification par e-mail via leur interface web.

1. **Accédez à l’interface web de la caméra** en saisissant l’adresse IP de la caméra dans un navigateur web. Les caméras Hikvision utilisent généralement les ports HTTP/HTTPS standards pour l’accès web.

2. **Naviguez vers Configuration** et sélectionnez « Réseau » > « Paramètres avancés » > « E-mail » dans la structure du menu. Le chemin exact peut varier selon le modèle de votre caméra et la version du firmware.

3. **Configurez le serveur SMTP** en saisissant smtp.forwardemail.net comme adresse du serveur. Les caméras Hikvision nécessitent une configuration SSL spécifique pour un fonctionnement correct des e-mails.

4. **Définissez le chiffrement sur SSL** et configurez le port 465. Les caméras Hikvision ne supportent pas STARTTLS, donc le chiffrement SSL sur le port 465 est la configuration recommandée pour la compatibilité avec Forward Email.

5. **Activez l’authentification SMTP** et saisissez votre alias Forward Email comme nom d’utilisateur. Utilisez le mot de passe généré depuis [Mon compte -> Domaines -> Alias](https://forwardemail.net/my-account/domains) pour l’authentification.

6. **Configurez les informations de l’expéditeur** en définissant votre alias Forward Email comme adresse de l’expéditeur et en ajoutant un nom descriptif pour identifier la caméra dans les notifications par e-mail.

7. **Configurez les adresses des destinataires** en ajoutant les adresses e-mail qui doivent recevoir les alertes de sécurité, les notifications de détection de mouvement et les mises à jour du statut système.

8. **Configurez les déclencheurs d’événements** en paramétrant la détection de mouvement, la détection de franchissement de ligne, la détection d’intrusion et d’autres événements devant générer des notifications par e-mail.

9. **Testez la configuration e-mail** en utilisant la fonction de test intégrée de Hikvision pour vérifier la connectivité et l’authentification correctes avec les serveurs de Forward Email.

> \[!NOTE]
> Les caméras Hikvision nécessitent les versions de firmware les plus récentes pour prendre en charge correctement le chiffrement SSL et TLS. Vérifiez les mises à jour du firmware avant de configurer les paramètres e-mail.

### Configuration des caméras Hikvision anciennes {#legacy-hikvision-camera-configuration}

Les anciennes caméras Hikvision peuvent avoir un support TLS limité et nécessitent les ports SMTP compatibles avec les versions legacy de Forward Email pour assurer la continuité de la fonctionnalité e-mail.

1. **Accédez à l’interface web de la caméra** et naviguez vers la section de configuration des e-mails. Les caméras Hikvision legacy peuvent avoir des structures de menu différentes des modèles actuels.

2. **Configurez les paramètres SMTP legacy de Forward Email** en saisissant smtp.forwardemail.net comme adresse du serveur et en utilisant le port 2455 pour les connexions SSL.

3. **Configurez l’authentification** en utilisant votre alias Forward Email et le mot de passe généré. Les caméras Hikvision legacy peuvent avoir des exigences ou limitations spécifiques en matière d’authentification.

4. **Configurez les paramètres de chiffrement** en sélectionnant le chiffrement SSL pour correspondre à la configuration du port legacy. Assurez-vous que la méthode de chiffrement correspond aux exigences du port 2455.

5. **Testez la configuration** et surveillez les erreurs de connexion. Les caméras Hikvision legacy peuvent fournir un rapport d’erreur limité, rendant le dépannage plus difficile.

> \[!WARNING]
> Les caméras Hikvision legacy peuvent présenter des vulnérabilités de sécurité connues. Assurez-vous que ces appareils sont correctement isolés sur votre réseau et envisagez de passer à des modèles actuels lorsque cela est possible.
## Configuration de l'email pour caméra de sécurité Dahua {#dahua-security-camera-email-configuration}

Les caméras Dahua offrent des capacités robustes de notification par email sur toute leur gamme de produits, des caméras IP basiques aux systèmes de surveillance avancés alimentés par l'IA. Le processus de configuration est généralement simple pour les appareils modernes, avec un support complet des normes TLS actuelles.

### Configuration email pour caméra Dahua {#dahua-camera-email-setup}

Les caméras Dahua proposent une configuration email conviviale via leur interface web, avec une bonne compatibilité pour les normes SMTP modernes.

1. **Accédez à l'interface web de la caméra** en entrant l'adresse IP de la caméra dans un navigateur web. Les caméras Dahua fournissent généralement des systèmes de configuration web intuitifs.

2. **Naviguez vers Setup** et sélectionnez "Network" > "Email" dans le menu de configuration. Les caméras Dahua organisent les paramètres email dans une section dédiée pour un accès facile.

3. **Configurez le serveur SMTP** en entrant smtp.forwardemail.net comme adresse du serveur. Les caméras Dahua supportent les méthodes de chiffrement SSL et STARTTLS.

4. **Définissez le port et le chiffrement** en sélectionnant le port 465 avec chiffrement SSL/TLS (recommandé) ou le port 587 avec chiffrement STARTTLS.

5. **Activez l'authentification SMTP** et entrez votre alias Forward Email comme nom d'utilisateur. Utilisez le mot de passe généré depuis [My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains).

6. **Configurez les informations de l'expéditeur** en définissant votre alias Forward Email comme adresse de l'expéditeur et en ajoutant un nom descriptif pour identifier la source de la caméra.

7. **Configurez les adresses des destinataires** en ajoutant des adresses email pour différents types de notifications. Les caméras Dahua supportent plusieurs destinataires pour divers types d'alertes.

8. **Configurez les déclencheurs d'événements** en paramétrant la détection de mouvement, les alertes de sabotage et autres événements de sécurité devant générer des notifications par email.

9. **Testez la fonctionnalité email** en utilisant la fonction de test intégrée de Dahua pour vérifier la bonne configuration et connectivité.

> \[!TIP]
> Les caméras Dahua fournissent souvent des guides de configuration détaillés via leur documentation wiki. Consultez [le guide de configuration email Dahua](https://dahuawiki.com/Email/Email_Notifications_Setup_GMail) pour des instructions spécifiques au modèle.

### Configuration email pour NVR Dahua {#dahua-nvr-email-configuration}

Les enregistreurs vidéo réseau (NVR) Dahua offrent une gestion centralisée des notifications email pour plusieurs caméras, permettant une administration efficace des grands systèmes de surveillance.

1. **Accédez à l'interface web du NVR** en entrant l'adresse IP du NVR dans un navigateur web. Les NVR Dahua fournissent des interfaces de gestion complètes pour la configuration système globale.

2. **Naviguez vers la configuration Email** en sélectionnant "Setup" > "Network" > "Email" dans le menu principal. Les NVR organisent généralement les paramètres email au niveau système.

3. **Configurez les paramètres du serveur SMTP** en entrant smtp.forwardemail.net comme adresse du serveur et en sélectionnant le port 465 avec chiffrement SSL/TLS (recommandé) ou le port 587 avec STARTTLS.

4. **Configurez l'authentification** en utilisant votre alias Forward Email et le mot de passe généré. Les NVR supportent les méthodes d'authentification SMTP standard.

5. **Configurez les horaires de notification** en définissant les périodes durant lesquelles les notifications email doivent être actives. Cela aide à gérer le volume de notifications hors heures de travail.

6. **Configurez les notifications basées sur les événements** en paramétrant quels événements caméra doivent déclencher des alertes email. Les NVR permettent un contrôle granulaire des déclencheurs de notification sur plusieurs caméras.

7. **Testez la configuration email système** pour assurer le bon fonctionnement sur toutes les caméras connectées et les systèmes de surveillance.


## Configuration email pour appareil multifonction Xerox {#xerox-multifunction-device-email-configuration}

Les appareils multifonctions Xerox offrent des capacités de notification email de niveau entreprise avec un support complet du TLS et des options de configuration avancées. Les appareils Xerox modernes supportent les normes de sécurité actuelles tout en maintenant la compatibilité avec divers environnements réseau.

### Configuration email pour MFD Xerox {#xerox-mfd-email-setup}

Les appareils multifonctions Xerox proposent une configuration email sophistiquée via leur interface administrative web, supportant à la fois les notifications basiques et l'intégration avancée des flux de travail.
1. **Accédez à l'interface web de l'appareil** en saisissant l'adresse IP de l'appareil dans un navigateur web. Les appareils Xerox offrent généralement des outils d'administration complets basés sur le web.

2. **Naviguez vers Propriétés** et sélectionnez "Connectivité" > "Protocoles" > "SMTP" dans le menu de configuration. Les appareils Xerox organisent les paramètres de messagerie dans leur section de configuration des protocoles.

3. **Configurez le serveur SMTP** en saisissant smtp.forwardemail.net comme adresse du serveur. Les appareils Xerox prennent en charge des versions TLS et des méthodes de chiffrement configurables.

4. **Définissez la configuration TLS** en sélectionnant TLS 1.2 ou une version supérieure comme version minimale prise en charge. Les appareils Xerox permettent aux administrateurs de configurer des exigences TLS spécifiques pour une sécurité renforcée.

5. **Configurez le port et le chiffrement** en définissant le port 465 pour les connexions SSL/TLS (recommandé) ou le port 587 pour les connexions STARTTLS.

6. **Configurez l'authentification SMTP** en activant l'authentification et en saisissant votre alias Forward Email comme nom d'utilisateur. Utilisez le mot de passe généré depuis [Mon Compte -> Domaines -> Alias](https://forwardemail.net/my-account/domains).

7. **Configurez les informations de l'expéditeur** en définissant votre alias Forward Email comme adresse de l'expéditeur et en configurant des adresses de réponse appropriées pour la gestion des notifications.

8. **Configurez les types de notifications** en définissant quels événements de l'appareil doivent déclencher des alertes par email, y compris les notifications de maintenance, les conditions d'erreur et les événements de sécurité.

9. **Testez la configuration email** en utilisant le système de test complet de Xerox pour vérifier la connectivité et l'authentification correctes.

> \[!NOTE]
> Les appareils Xerox offrent des options détaillées de configuration TLS permettant un réglage fin des paramètres de sécurité. Consultez [le guide de configuration TLS de Xerox](https://www.support.xerox.com/en-us/article/KB0032169) pour des exigences de sécurité avancées.


## Configuration Email des Appareils Multifonctions Ricoh {#ricoh-multifunction-device-email-configuration}

Les appareils multifonctions Ricoh offrent des capacités email robustes sur toute leur gamme de produits, des imprimantes de bureau basiques aux systèmes de production avancés. Cependant, [Ricoh a annoncé des changements importants](https://www.ricoh.com/info/2025/0526_1) liés à l'arrêt de l'authentification basique de Microsoft qui affectent la fonctionnalité email.

### Configuration Moderne des MFD Ricoh {#modern-ricoh-mfd-configuration}

Les appareils Ricoh actuels supportent les standards TLS modernes et offrent des capacités complètes de notification email via leur interface web.

1. **Accédez à l'interface web de l'appareil** en saisissant l'adresse IP de l'appareil dans un navigateur web. Les appareils Ricoh proposent des systèmes de configuration web intuitifs.

2. **Naviguez vers la configuration Email** en sélectionnant "Paramètres Système" > "Outils Administrateur" > "Réseau" > "Email" dans la structure du menu.

3. **Configurez le serveur SMTP** en saisissant smtp.forwardemail.net comme adresse du serveur. Les appareils Ricoh supportent les méthodes de chiffrement SSL et STARTTLS.

4. **Activez SSL sur la page du serveur SMTP** pour activer le chiffrement TLS. L'interface Ricoh peut être cryptique, mais l'activation de SSL est requise pour une fonctionnalité email sécurisée.

5. **Définissez le numéro de port** à 465 pour les connexions SSL/TLS (recommandé) ou 587 pour les connexions STARTTLS. Assurez-vous que la méthode de chiffrement correspond au port sélectionné.

6. **Configurez l'authentification SMTP** en activant l'authentification et en saisissant votre alias Forward Email comme nom d'utilisateur. Utilisez le mot de passe généré depuis [Mon Compte -> Domaines -> Alias](https://forwardemail.net/my-account/domains).

7. **Configurez les informations de l'expéditeur** en configurant votre alias Forward Email comme adresse de l'expéditeur et en ajoutant les informations d'identification appropriées.

8. **Configurez les types de notifications** en configurant l'envoi de scans par email, les alertes de l'appareil et les notifications de maintenance selon vos besoins opérationnels.

9. **Testez la fonctionnalité email** en utilisant le système de test intégré de Ricoh pour vérifier la configuration et la connectivité correctes.

> \[!IMPORTANT]
> Les appareils Ricoh affectés par les changements d'authentification basique de Microsoft nécessitent des méthodes d'authentification mises à jour. Assurez-vous que le firmware de votre appareil supporte l'authentification moderne ou utilisez les fonctionnalités de compatibilité de Forward Email.
### Configuration des appareils Ricoh anciens {#legacy-ricoh-device-configuration}

Les anciens appareils Ricoh peuvent nécessiter les ports SMTP compatibles avec la version legacy de Forward Email en raison d'un support TLS limité et de restrictions sur les méthodes d'authentification.

1. **Accédez à l'interface web de l'appareil** et naviguez vers la section de configuration des emails. Les anciens appareils Ricoh peuvent avoir des structures de menu différentes des modèles actuels.

2. **Configurez les paramètres SMTP legacy de Forward Email** en saisissant smtp.forwardemail.net comme adresse du serveur et en utilisant le port 2455 pour les connexions SSL.

3. **Activez le chiffrement SSL** pour correspondre à la configuration du port legacy. Assurez-vous que les paramètres de chiffrement correspondent aux exigences du port 2455.

4. **Configurez l'authentification** en utilisant votre alias Forward Email et le mot de passe généré. Les anciens appareils Ricoh peuvent avoir des limitations spécifiques d'authentification.

5. **Testez la configuration** et surveillez les erreurs d'authentification ou de connexion. Les appareils legacy peuvent fournir un rapport d'erreur limité pour le dépannage.


## Résolution des problèmes courants de configuration {#troubleshooting-common-configuration-issues}

La configuration des emails sur les appareils peut rencontrer divers problèmes dus aux paramètres réseau, aux problèmes d'authentification ou aux incompatibilités de protocole. Comprendre les problèmes courants et leurs solutions aide à garantir une livraison fiable des notifications dans votre écosystème d'appareils.

### Problèmes d'authentification et d'identifiants {#authentication-and-credential-issues}

Les échecs d'authentification représentent le problème de configuration email le plus courant sur tous types d'appareils. Ces problèmes proviennent généralement d'une utilisation incorrecte des identifiants, d'incompatibilités de méthode d'authentification ou de problèmes de configuration de compte.

Vérifiez que vous utilisez votre alias Forward Email comme nom d'utilisateur, et non votre adresse email de compte ou vos identifiants de connexion. De nombreux appareils sont sensibles au format du nom d'utilisateur et exigent une correspondance exacte avec votre alias configuré.

Assurez-vous d'utiliser le mot de passe généré depuis [Mon Compte -> Domaines -> Alias](https://forwardemail.net/my-account/domains) plutôt que votre mot de passe de connexion au compte. L'authentification SMTP nécessite ce mot de passe généré spécifique pour des raisons de sécurité, et l'utilisation d'identifiants incorrects entraînera des échecs d'authentification.

Vérifiez que votre compte Forward Email a bien l'accès SMTP activé et que toute exigence d'authentification à deux facteurs est correctement configurée. Certaines configurations de compte peuvent restreindre l'accès SMTP tant qu'elles ne sont pas activées correctement.

> \[!TIP]
> Si l'authentification continue d'échouer, régénérez votre mot de passe SMTP depuis [Mon Compte -> Domaines -> Alias](https://forwardemail.net/my-account/domains) et mettez à jour la configuration de votre appareil avec les nouveaux identifiants.

### Problèmes TLS et de chiffrement {#tls-and-encryption-problems}

Les problèmes liés à TLS surviennent souvent lorsque les appareils tentent d'utiliser des protocoles de chiffrement non supportés ou lorsqu'il y a une incompatibilité entre la configuration du port et les paramètres de chiffrement.

Pour les appareils modernes rencontrant des erreurs TLS, vérifiez que vous utilisez la bonne combinaison port et chiffrement : port 465 avec SSL/TLS (recommandé) ou port 587 avec STARTTLS. Ces paramètres doivent correspondre exactement pour des connexions réussies.

Les appareils legacy affichant des erreurs de validation de certificat doivent utiliser les ports de compatibilité de Forward Email (2455 ou 2555) plutôt que les ports SMTP standards. Ces ports maintiennent la compatibilité TLS 1.0 tout en offrant une sécurité appropriée pour les appareils plus anciens.

Si la validation du certificat continue d'échouer sur les appareils legacy, vérifiez si l'appareil permet de désactiver la validation du certificat. Bien que cela réduise la sécurité, cela peut être nécessaire pour assurer la fonctionnalité continue sur des appareils qui ne peuvent pas être mis à jour.

> \[!CAUTION]
> Désactiver la validation du certificat réduit la sécurité et ne doit être utilisé qu'en dernier recours pour les appareils legacy qui ne peuvent pas être mis à jour ou remplacés.

### Problèmes de connectivité réseau {#network-connectivity-issues}

Les problèmes liés au réseau peuvent empêcher les appareils d'atteindre les serveurs SMTP de Forward Email même lorsque les paramètres de configuration sont corrects.

Vérifiez que votre réseau autorise les connexions sortantes sur les ports SMTP configurés. Les pare-feu d'entreprise ou les politiques réseau restrictives peuvent bloquer certains ports, nécessitant des ajustements des règles de pare-feu ou des configurations alternatives de ports.
Vérifiez la résolution DNS en vous assurant que vos appareils peuvent résoudre smtp.forwardemail.net vers les adresses IP correctes. Les problèmes DNS peuvent provoquer des échecs de connexion même lorsque la connectivité réseau est autrement fonctionnelle.

Testez la connectivité réseau à partir des outils de diagnostic réseau de l'appareil si disponibles. De nombreux appareils modernes offrent des capacités de test réseau intégrées qui peuvent aider à identifier les problèmes de connectivité.

Prenez en compte la latence réseau et les paramètres de délai d’attente si les appareils sont situés sur des connexions réseau lentes ou à haute latence. Certains appareils peuvent nécessiter des ajustements de délai d’attente pour une livraison fiable des e-mails.

### Défis de configuration spécifiques aux appareils {#device-specific-configuration-challenges}

Les différents fabricants d’appareils implémentent la fonctionnalité e-mail de diverses manières, ce qui entraîne des défis de configuration spécifiques au fabricant nécessitant des solutions ciblées.

Les imprimantes HP peuvent mettre en cache les recherches DNS et nécessitent des redémarrages après des modifications de configuration. Si les problèmes de connexion persistent après la configuration, redémarrez l’imprimante pour effacer les informations réseau mises en cache.

Les imprimantes Brother sont particulièrement sensibles au formatage des identifiants d’authentification et peuvent nécessiter une configuration via l’interface web plutôt que le panneau de contrôle de l’appareil pour une configuration fiable.

Les caméras Foscam nécessitent des configurations de ports spécifiques en raison des limitations TLS et peuvent ne pas fournir de messages d’erreur détaillés pour le dépannage. Assurez-vous d’utiliser les ports hérités de Forward Email (2455 ou 2555) pour ces appareils.

Les caméras Hikvision nécessitent un chiffrement SSL et ne prennent pas en charge STARTTLS, limitant les options de configuration au port 465 avec chiffrement SSL/TLS.

> \[!NOTE]
> Lors du dépannage des problèmes spécifiques aux appareils, consultez la documentation du fabricant pour connaître les limitations ou exigences de configuration pouvant affecter la fonctionnalité e-mail.


## Considérations de sécurité et bonnes pratiques {#security-considerations-and-best-practices}

La configuration des notifications e-mail sur les appareils réseau implique plusieurs considérations de sécurité qui aident à protéger vos systèmes tout en maintenant une livraison fiable des notifications. Suivre les bonnes pratiques de sécurité empêche les accès non autorisés et garantit une divulgation appropriée des informations dans les notifications.

### Gestion des identifiants {#credential-management}

Utilisez des mots de passe forts et uniques pour votre compte Forward Email et activez l’authentification à deux facteurs lorsque disponible. Le mot de passe SMTP généré doit être traité comme un identifiant sensible et stocké en toute sécurité dans les configurations des appareils.

Passez en revue et faites tourner régulièrement les mots de passe SMTP, surtout après des changements de personnel ou des incidents de sécurité. Forward Email permet la régénération des mots de passe sans affecter les autres fonctions du compte.

Évitez d’utiliser des identifiants partagés sur plusieurs appareils lorsque cela est possible. Bien que Forward Email supporte plusieurs connexions d’appareils avec les mêmes identifiants, des identifiants individuels par appareil offrent une meilleure isolation de sécurité et des capacités d’audit.

Documentez les identifiants des appareils de manière sécurisée et incluez-les dans le système de gestion des identifiants de votre organisation. Une documentation appropriée garantit que les configurations e-mail peuvent être maintenues et mises à jour selon les besoins.

### Sécurité réseau {#network-security}

Mettez en œuvre une segmentation réseau appropriée pour isoler les appareils des autres ressources réseau tout en maintenant la connectivité nécessaire pour les notifications e-mail et l’accès légitime.

Configurez les règles de pare-feu pour autoriser le trafic SMTP nécessaire tout en bloquant les accès réseau inutiles. Les appareils ont généralement seulement besoin d’un accès sortant aux serveurs SMTP de Forward Email pour la fonctionnalité de notification.

Surveillez le trafic réseau des appareils pour identifier des schémas inhabituels ou des tentatives de communication non autorisées. Une activité réseau inattendue peut indiquer des problèmes de sécurité nécessitant une enquête.

Envisagez d’utiliser des VLAN ou des segments réseau dédiés pour le trafic de gestion des appareils, y compris les notifications e-mail, afin de fournir une isolation de sécurité supplémentaire.

### Divulgation d’informations {#information-disclosure}

Examinez le contenu des notifications e-mail pour vous assurer qu’elles ne contiennent pas d’informations sensibles pouvant être utiles aux attaquants. Certains appareils incluent des informations système détaillées, des configurations réseau ou des chemins de fichiers dans les e-mails de notification.
Configurez le filtrage des notifications pour limiter les types d’informations incluses dans les alertes par email. De nombreux appareils permettent de personnaliser le contenu des notifications afin d’équilibrer les informations utiles avec les exigences de sécurité.

Mettez en œuvre des politiques appropriées de conservation et de gestion des emails pour les notifications des appareils. Les notifications liées à la sécurité peuvent devoir être conservées pour des raisons de conformité ou à des fins d’enquête.

Prenez en compte la sensibilité des adresses email des destinataires et assurez-vous que les notifications ne sont envoyées qu’au personnel autorisé ayant besoin d’accéder à ces informations.

### Surveillance et maintenance {#monitoring-and-maintenance}

Testez régulièrement les configurations de notification par email pour garantir leur bon fonctionnement continu. Les tests périodiques permettent d’identifier les dérives de configuration, les changements réseau ou les problèmes de service avant qu’ils n’impactent la livraison des alertes critiques.

Surveillez les schémas de notification par email à la recherche de signes d’activité suspecte ou de tentatives d’accès non autorisées. Des volumes inhabituels de notifications ou des événements système inattendus peuvent indiquer des problèmes de sécurité.

Maintenez le firmware des appareils à jour lorsque cela est possible afin de conserver des standards de sécurité actuels et la prise en charge des protocoles. Bien que certains appareils aient atteint leur fin de vie, l’application des mises à jour de sécurité disponibles aide à se protéger contre les vulnérabilités connues.

Mettez en place des méthodes de notification de secours pour les alertes critiques lorsque cela est possible. Bien que les notifications par email soient fiables, disposer de mécanismes d’alerte alternatifs offre une redondance pour les événements système les plus importants.


## Conclusion {#conclusion}

Configurer des notifications email fiables à travers des écosystèmes d’appareils diversifiés nécessite de comprendre le paysage complexe de la compatibilité TLS, des méthodes d’authentification et des exigences spécifiques aux fabricants. Le service SMTP complet de Forward Email répond à ces défis en fournissant à la fois des standards de sécurité modernes pour les appareils actuels et une compatibilité héritée pour les équipements plus anciens qui ne peuvent pas être mis à jour.

Les processus de configuration décrits dans ce guide fournissent des instructions détaillées et étape par étape pour les principales catégories d’appareils, garantissant que les administrateurs peuvent établir des notifications email fiables quel que soit leur parc matériel spécifique. La stratégie à double port de Forward Email répond spécifiquement à la crise de compatibilité TLS affectant des millions d’appareils déployés, offrant une solution pratique qui maintient la sécurité tout en assurant la continuité de fonctionnement.

Les tests et la maintenance réguliers des configurations de notification par email garantissent une fiabilité continue et aident à identifier les problèmes potentiels avant qu’ils n’impactent la livraison des alertes critiques. Suivre les bonnes pratiques de sécurité et les conseils de dépannage de ce guide aide à maintenir des systèmes de notification sécurisés et fiables qui tiennent les administrateurs informés du statut des appareils et des événements de sécurité.

Que vous gériez un petit bureau avec des marques d’imprimantes et de caméras mixtes ou que vous supervisiez un environnement d’entreprise avec des centaines d’appareils, Forward Email fournit l’infrastructure et la compatibilité nécessaires pour des notifications email fiables. L’accent mis par notre service sur la compatibilité des appareils, combiné à une documentation complète et un support, garantit que les alertes système critiques vous parviennent quand vous en avez le plus besoin.

Pour un support supplémentaire concernant la configuration email des appareils ou des questions sur la compatibilité de Forward Email avec un équipement spécifique, consultez notre [FAQ sur la configuration du serveur SMTP](https://forwardemail.net/en/faq#what-are-your-smtp-server-configuration-settings) ou contactez notre équipe de support. Nous nous engageons à vous aider à maintenir des notifications email fiables sur tous vos appareils connectés au réseau, quel que soit leur âge ou les limitations du fabricant.
