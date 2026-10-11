# Guide du webmail Forward Email {#forward-email-webmail-guide}

<p class="lead mt-3">
  <strong>En bref :</strong> Le <a href="https://mail.forwardemail.net" target="_blank" rel="noopener noreferrer">webmail</a> sert à lire et envoyer vos emails. Le <a href="/my-account/domains">tableau de bord web</a> sert à configurer vos domaines, alias et mots de passe. Vous vous connectez au webmail avec une adresse d’alias et un mot de passe généré dans le tableau de bord. Le webmail est gratuit et <a href="/faq#do-you-offer-a-webmail-client">open source</a>, et la même application fonctionne dans le navigateur, sur ordinateur, sur mobile et dans un terminal.
</p>


## Table des matières {#table-of-contents}

* [Où trouver le webmail](#where-to-get-webmail)
* [Le webmail et le tableau de bord web](#webmail-and-the-web-dashboard)
* [Connexion](#signing-in)
  * [Générer un mot de passe d’alias](#generate-an-alias-password)
  * [Se connecter au webmail](#sign-in-to-webmail)
* [Utiliser plusieurs comptes](#using-more-than-one-account)
  * [Envoyer depuis un autre compte connecté](#send-as-another-signed-in-account)
* [Envoyer depuis n’importe quelle adresse de votre domaine](#send-from-any-address-on-your-domain)
  * [Étape 1 : Générer un mot de passe catch-all dans le tableau de bord](#step-1-generate-a-catch-all-password-in-the-dashboard)
  * [Étape 2 : L’enregistrer dans le webmail](#step-2-save-it-in-webmail)
  * [Étape 3 : Choisir l’adresse lors de la rédaction](#step-3-pick-the-address-when-you-compose)
  * [Ce qu’il faut savoir sur l’envoi catch-all](#what-to-know-about-catch-all-sending)
* [Aperçu des paramètres du webmail](#webmail-settings-at-a-glance)
* [Confidentialité et App Lock](#privacy-and-app-lock)
* [Dépannage](#troubleshooting)


## Où trouver le webmail {#where-to-get-webmail}

| Plateforme                       | Où                                                                                                                            |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Navigateur                       | <a href="https://mail.forwardemail.net" target="_blank" rel="noopener noreferrer">mail.forwardemail.net</a> (sans installation) |
| Ordinateur (macOS, Windows, Linux) | Notre <a href="/download">page de téléchargement</a>                                                                        |
| Mobile (Android, iOS)            | Notre <a href="/download">page de téléchargement</a>                                                                          |
| Terminal                         | La commande `forwardemail`. Voir [Avez-vous une application pour le terminal](/faq#do-you-have-a-terminal-app)                |

Toutes sont construites à partir du même projet open source, donc tout ce qui figure dans ce guide s’applique à chacune. Les paramètres et les mots de passe enregistrés sont conservés sur chaque appareil : configurez-les donc sur chaque appareil que vous utilisez.


## Le webmail et le tableau de bord web {#webmail-and-the-web-dashboard}

Forward Email propose deux endroits distincts où se connecter, et ils utilisent des identifiants différents :

|                               | Tableau de bord web (forwardemail.net)                                                                                    | Webmail (mail.forwardemail.net et les applications)                                  |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| **Connexion avec**            | L’email et le mot de passe de votre compte Forward Email (plus la 2FA ou une passkey)                                       | Une adresse d’alias (comme `you@example.com`) et son mot de passe généré             |
| **Sert à**                    | Ajouter des domaines, DNS, alias, facturation, membres de l’équipe, générer des mots de passe, Paramètres avancés          | Lire et envoyer des emails, dossiers, libellés, recherche, calendrier, contacts, filtres |
| **Mots de passe créés ici**   | Mots de passe d’alias et mots de passe catch-all                                                                          | Aucun. Le webmail utilise les mots de passe créés dans le tableau de bord           |

Une configuration courante ressemble à ceci :

1. Dans le tableau de bord, ajoutez votre domaine et configurez le DNS.
2. Créez un alias avec le stockage IMAP activé (par exemple `you@example.com`).
3. Générez un mot de passe pour cet alias.
4. Connectez-vous au webmail avec cet alias et ce mot de passe.

Pour envoyer des emails, votre domaine doit aussi avoir le SMTP sortant activé dans <a href="/my-account/domains">Mon compte <i class="fa fa-angle-right"></i> Domaines</a> <i class="fa fa-angle-right"></i> Paramètres avancés <i class="fa fa-angle-right"></i> Configuration SMTP sortante, comme pour n’importe quel autre client email.


## Connexion {#signing-in}

### Générer un mot de passe d’alias {#generate-an-alias-password}

1. Allez dans <a href="/my-account/domains">Mon compte <i class="fa fa-angle-right"></i> Domaines</a> <i class="fa fa-angle-right"></i> Alias.
2. À côté de l’alias, cliquez sur **Générer un mot de passe**.
3. Copiez le mot de passe. Il n’est affiché qu’une seule fois.

C’est le même mot de passe que celui que vous utiliseriez pour IMAP, POP3, SMTP, CalDAV et CardDAV. Il ne permet pas de se connecter au tableau de bord web.

### Se connecter au webmail {#sign-in-to-webmail}

Ouvrez le webmail et saisissez l’adresse d’alias complète et le mot de passe généré. Si vous voulez d’abord simplement jeter un œil, essayez la démo depuis l’écran de connexion.


## Utiliser plusieurs comptes {#using-more-than-one-account}

Vous pouvez vous connecter à plusieurs alias à la fois, même sur des domaines différents. Passez de l’un à l’autre depuis le menu des comptes, et gérez-les dans **Settings <i class="fa fa-angle-right"></i> General <i class="fa fa-angle-right"></i> Your accounts**. Les comptes sont conservés sur l’appareil où vous les avez ajoutés et ne sont pas synchronisés.

### Envoyer depuis un autre compte connecté {#send-as-another-signed-in-account}

Lorsque vous rédigez un message, le menu **From** liste tous les comptes connectés sur cet appareil. Choisissez-en un pour envoyer depuis cette adresse. Le message est envoyé avec le mot de passe propre à ce compte, et la copie va dans le dossier des messages envoyés de ce compte.


## Envoyer depuis n’importe quelle adresse de votre domaine {#send-from-any-address-on-your-domain}

Si vous possédez un domaine, vous pouvez envoyer depuis n’importe quelle adresse de ce domaine, comme `billing@example.com` ou `no-reply@example.com`, sans créer d’alias ni vous connecter pour chacune. Pour cela, vous utilisez un **mot de passe catch-all** pour le domaine.

Vous ne vous connectez **pas** au webmail avec un compte générique ou catch-all, et il n’y a aucune fonction à activer. Vous enregistrez une seule fois le mot de passe catch-all dans les paramètres du webmail, et le menu From vous permet ensuite de saisir n’importe quelle adresse de ce domaine.

### Étape 1 : Générer un mot de passe catch-all dans le tableau de bord {#step-1-generate-a-catch-all-password-in-the-dashboard}

1. Allez dans <a href="/my-account/domains">Mon compte <i class="fa fa-angle-right"></i> Domaines</a> et choisissez votre domaine.
2. Ouvrez **Paramètres avancés** et trouvez **Mots de passe fourre-tout**.
3. Cliquez sur **Générer un mot de passe**. Laissez le champ vide pour obtenir un mot de passe aléatoire robuste, et ajoutez une description si vous le souhaitez (par exemple "Webmail sur mon portable").
4. Copiez le mot de passe. Il n’est affiché qu’une seule fois.

Vous devez être administrateur du domaine pour voir cette section. Utilisez **Gérer les mots de passe** au même endroit pour voir ou supprimer des mots de passe catch-all plus tard. En supprimer un le désactive partout où il est enregistré.

### Étape 2 : L’enregistrer dans le webmail {#step-2-save-it-in-webmail}

1. Dans le webmail, ouvrez **Settings <i class="fa fa-angle-right"></i> General**.
2. Trouvez la carte intitulée **Send from any address**, juste en dessous de **Your accounts**.
3. Cliquez sur **Add catch-all password**.
4. Saisissez le domaine (par exemple `example.com`) et collez le mot de passe catch-all.
5. Cliquez sur **Save**. Vous verrez "You can now send from any address @example.com".

Vous pouvez enregistrer des mots de passe pour autant de domaines que vous le souhaitez. Pour en retirer un, cliquez sur l’icône de corbeille à côté.

### Étape 3 : Choisir l’adresse lors de la rédaction {#step-3-pick-the-address-when-you-compose}

1. Commencez un nouveau message.
2. Ouvrez le menu **From**. Sous vos comptes connectés, il y a une entrée pour chaque domaine enregistré : **Other address @example.com…**
3. Choisissez-la. La ligne From devient une zone de texte suivie de `@example.com`.
4. Saisissez la partie avant le @ (par exemple `billing`) et envoyez.

Les brouillons conservent l’adresse saisie : un brouillon enregistré se rouvre donc avec la même adresse From.

### Ce qu’il faut savoir sur l’envoi catch-all {#what-to-know-about-catch-all-sending}

* **Il ne peut qu’envoyer.** Un mot de passe catch-all ne sert qu’à l’envoi. Il ne peut pas ouvrir de boîte aux lettres, vous ne pouvez donc pas lire les emails de `billing@example.com` avec. Pour lire les réponses, créez un alias (ou un alias catch-all qui vous les redirige) pour cette adresse.
* **Les copies envoyées vont dans le compte que vous utilisez.** Un message envoyé en tant que `billing@example.com` est classé dans le dossier des messages envoyés du compte depuis lequel vous l’avez rédigé.
* **Il fonctionne depuis tous les comptes de l’appareil.** Le mot de passe enregistré n’est pas lié à un seul compte connecté. N’importe quel compte de cet appareil peut l’utiliser.
* **Il reste sur cet appareil.** Le mot de passe est stocké uniquement sur l’appareil où vous l’avez enregistré. Il n’est pas synchronisé, et l’appairage d’appareils par QR code ne le copie pas. Ajoutez-le de nouveau sur chaque appareil.
* **App Lock le protège.** Si App Lock est activé, le mot de passe est chiffré avec le reste de vos données locales, et les entrées **Other address** sont masquées tant que l’application est verrouillée.
* **L’envoi programmé n’est pas disponible** pour les adresses utilisées avec un mot de passe catch-all, car ce mot de passe ne peut pas relire ni annuler un message programmé. Envoyez immédiatement, ou envoyez depuis un compte connecté.
* **Un mauvais mot de passe ne vous déconnecte pas.** Si le mot de passe catch-all est erroné ou a été supprimé dans le tableau de bord, l’envoi échoue avec une erreur, et vous restez connecté.


## Aperçu des paramètres du webmail {#webmail-settings-at-a-glance}

| Section                | Contenu                                                                                                  |
| ---------------------- | -------------------------------------------------------------------------------------------------------- |
| **General**            | Vos comptes, envoi depuis n’importe quelle adresse (mots de passe catch-all), notifications, stockage    |
| **Appearance**         | Thème, mise en page, densité, valeurs par défaut de l’éditeur, signature, police, liens externes         |
| **Privacy & Security** | App Lock, chiffrement PGP, options de confidentialité, signalement de spam                              |
| **Folders & Labels**   | Dossiers spéciaux, vos dossiers, libellés                                                                |
| **Filters**            | Filtres de messagerie pour l’alias connecté                                                              |
| **Calendar**           | Premier jour de la semaine et tâches                                                                     |
| **Search**             | Indexation de la recherche, état de l’index, recherches enregistrées, opérateurs de recherche           |
| **Advanced**           | Stockage de la boîte aux lettres, cache local et réinitialisation de l’application                       |
| **Keyboard Shortcuts** | Tous les raccourcis                                                                                      |
| **About & Help**       | Version, téléchargement de l’application de bureau, commentaires et liens                                |

Ce qui concerne le domaine ou l’alias lui-même, comme le DNS, les destinataires de redirection, les limites de stockage, les répondeurs automatiques d’absence, les mots de passe catch-all et l’analyse anti-spam, se configure dans le <a href="/my-account/domains">tableau de bord web</a>.


## Confidentialité et App Lock {#privacy-and-app-lock}

Le webmail conserve une copie locale de vos emails pour être rapide et fonctionner hors ligne. **App Lock** (dans **Settings <i class="fa fa-angle-right"></i> Privacy & Security**) chiffre ces données locales, vos paramètres et vos mots de passe enregistrés sur l’appareil, et se déverrouille avec une passkey ou un code PIN. Les emails et les mises à jour en temps réel circulent directement entre l’application et Forward Email, sans aucun service de publicité ou de suivi entre les deux.


## Dépannage {#troubleshooting}

**"Can't send as <name@example.com>: sign in to that account on this device again, or save its domain's catch-all password in Settings."**

Le webmail n’a aucun mot de passe pour cette adresse sur cet appareil. Connectez-vous à cet alias, ou enregistrez le mot de passe catch-all du domaine dans **Settings <i class="fa fa-angle-right"></i> General <i class="fa fa-angle-right"></i> Send from any address**. Si l’application est verrouillée, déverrouillez-la d’abord.

**L’entrée "Other address" n’apparaît pas dans le menu From.**

Vérifiez que vous avez enregistré le mot de passe catch-all sur cet appareil, et que App Lock est déverrouillé.

**L’envoi depuis une adresse catch-all échoue avec une erreur d’authentification.**

Le mot de passe catch-all a peut-être été supprimé ou mal saisi. Générez-en un nouveau dans le tableau de bord, puis retirez l’ancien dans le webmail et ajoutez le nouveau.

**Le mot de passe de mon tableau de bord ne fonctionne pas dans le webmail.**

Le webmail nécessite un mot de passe d’alias, et non le mot de passe de votre tableau de bord. Voir [Générer un mot de passe d’alias](#generate-an-alias-password).

Toujours bloqué ? Consultez notre <a href="/faq">FAQ</a> ou <a href="/help">contactez-nous</a>.
