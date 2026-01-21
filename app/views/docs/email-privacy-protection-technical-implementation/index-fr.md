# Comment fonctionne la redirection d'e-mails avec Forward Email : le guide ultime {#how-email-forwarding-works-with-forward-email-the-ultimate-guide}

<img loading="lazy" src="/img/articles/email-privacy.webp" alt="Email privacy protection technical implementation" class="rounded-lg" />

## Table des matières {#table-of-contents}

* [Avant-propos](#foreword)
* [Qu'est-ce que la redirection d'e-mails](#what-is-email-forwarding)
* [Fonctionnement du transfert d'e-mails : explication technique](#how-email-forwarding-works-the-technical-explanation)
  * [Le processus de transfert des e-mails](#the-email-forwarding-process)
  * [Le rôle du SRS (Sender Rewriting Scheme)](#the-role-of-srs-sender-rewriting-scheme)
* [Comment fonctionne la redirection d'e-mails : une explication simple](#how-email-forwarding-works-the-simple-explanation)
* [Configuration du transfert d'e-mails avec Forward Email](#setting-up-email-forwarding-with-forward-email)
  * [1. Créez un compte](#1-sign-up-for-an-account)
  * [2. Ajoutez votre domaine](#2-add-your-domain)
  * [3. Configurer les enregistrements DNS](#3-configure-dns-records)
  * [4. Créer des transferts d'e-mails](#4-create-email-forwards)
  * [5. Commencez à utiliser vos nouvelles adresses e-mail](#5-start-using-your-new-email-addresses)
* [Fonctionnalités avancées de transfert d'e-mails](#advanced-features-of-forward-email)
  * [Adresses jetables](#disposable-addresses)
  * [Destinataires multiples et caractères génériques](#multiple-recipients-and-wildcards)
  * [Intégration « Envoyer un e-mail en tant que »](#send-mail-as-integration)
  * [Sécurité résistante aux quanta](#quantum-resistant-security)
  * [Boîtes aux lettres SQLite chiffrées individuellement](#individually-encrypted-sqlite-mailboxes)
* [Pourquoi choisir Forward Email plutôt que vos concurrents](#why-choose-forward-email-over-competitors)
  * [1. 100 % Open Source](#1-100-open-source)
  * [2. Axé sur la confidentialité](#2-privacy-focused)
  * [3. Aucune dépendance à des tiers](#3-no-third-party-reliance)
  * [4. Tarification rentable](#4-cost-effective-pricing)
  * [5. Ressources illimitées](#5-unlimited-resources)
  * [6. Approuvé par les grandes organisations](#6-trusted-by-major-organizations)
* [Cas d'utilisation courants pour la redirection d'e-mails](#common-use-cases-for-email-forwarding)
  * [Pour les entreprises](#for-businesses)
  * [Pour les développeurs](#for-developers)
  * [Pour les personnes soucieuses de leur vie privée](#for-privacy-conscious-individuals)
* [Meilleures pratiques pour la redirection des e-mails](#best-practices-for-email-forwarding)
  * [1. Utilisez des adresses descriptives](#1-use-descriptive-addresses)
  * [2. Mettre en œuvre une authentification appropriée](#2-implement-proper-authentication)
  * [3. Révisez régulièrement vos transferts](#3-regularly-review-your-forwards)
  * [4. Configurez « Envoyer le courrier en tant que » pour des réponses fluides](#4-set-up-send-mail-as-for-seamless-replies)
  * [5. Utilisez les adresses fourre-tout avec prudence](#5-use-catch-all-addresses-cautiously)
* [Conclusion](#conclusion)

## Avant-propos {#foreword}

La redirection d'e-mails est un outil puissant qui peut transformer la gestion de vos communications en ligne. Que vous soyez un chef d'entreprise souhaitant créer des adresses e-mail professionnelles avec votre domaine personnalisé, un particulier soucieux de sa confidentialité souhaitant protéger son adresse e-mail principale ou un développeur recherchant une gestion flexible de ses e-mails, comprendre la redirection d'e-mails est essentiel dans le paysage numérique actuel.

Chez Forward Email, nous avons développé le service de transfert d'e-mails le plus sécurisé, privé et flexible au monde. Dans ce guide complet, nous vous expliquerons le fonctionnement du transfert d'e-mails (d'un point de vue technique et pratique), vous expliquerons notre processus de configuration simple et vous expliquerons pourquoi notre service se distingue de la concurrence.

## Qu'est-ce que la redirection d'e-mails ? {#what-is-email-forwarding}

La redirection d'e-mails est un processus qui redirige automatiquement les e-mails envoyés à une adresse e-mail vers une autre adresse. Par exemple, lorsqu'un e-mail est envoyé à <contact@votredomaine.com>, il peut être automatiquement transféré vers votre compte Gmail, Outlook ou tout autre compte de messagerie personnel.

Cette capacité apparemment simple offre de puissants avantages :

* **Image de marque professionnelle** : Utilisez des adresses e-mail avec votre domaine personnalisé (<vous@votredomaine.com>) tout en gérant l'ensemble de vos messages depuis votre boîte de réception personnelle.
* **Protection de la vie privée** : Créez des adresses jetables ou spécifiques à un usage spécifique pour protéger votre adresse e-mail principale.
* **Gestion simplifiée** : Consolidez plusieurs adresses e-mail dans une seule boîte de réception.
* **Flexibilité** : Créez un nombre illimité d'adresses pour différents usages sans gérer plusieurs comptes.

## Comment fonctionne la redirection d'e-mails : l'explication technique {#how-email-forwarding-works-the-technical-explanation}

Pour ceux qui s'intéressent aux détails techniques, explorons ce qui se passe dans les coulisses lorsqu'un e-mail est transféré.

### Le processus de transfert des e-mails {#the-email-forwarding-process}

1. **Configuration DNS** : Le processus commence par les enregistrements DNS de votre domaine. Lorsque vous configurez la redirection d'e-mails, vous configurez des enregistrements MX (Mail Exchange) qui indiquent à Internet où les e-mails de votre domaine doivent être distribués. Ces enregistrements pointent vers nos serveurs de messagerie.

2. **Réception d'e-mails** : lorsqu'une personne envoie un e-mail à votre adresse de domaine personnalisée (par exemple, <vous@votredomaine.com>), son serveur de messagerie recherche les enregistrements MX de votre domaine et transmet le message à nos serveurs.

3. **Traitement et authentification** : Nos serveurs reçoivent l'e-mail et exécutent plusieurs fonctions essentielles :
* Vérification de l'authenticité de l'expéditeur à l'aide de protocoles tels que SPF, DKIM et DMARC
* Recherche de contenu malveillant
* Vérification du destinataire par rapport à vos règles de transfert

4. **Réécriture de l'expéditeur** : C'est ici que la magie opère. Nous implémentons le SRS (Sender Rewriting Scheme) pour modifier le chemin de retour de l'e-mail. Ceci est crucial, car de nombreux fournisseurs de messagerie rejettent les e-mails transférés sans implémentation SRS appropriée, car ils peuvent sembler usurpés.

5. **Transfert** : L'e-mail est ensuite envoyé à votre adresse de destination avec le contenu d'origine intact.

6. **Livraison** : L'e-mail arrive dans votre boîte de réception, apparaissant comme s'il avait été envoyé à votre adresse de transfert, conservant l'apparence professionnelle de votre domaine personnalisé.

### Le rôle du SRS (Sender Rewriting Scheme) {#the-role-of-srs-sender-rewriting-scheme}

Le SRS mérite une attention particulière, car il est essentiel à la fiabilité du transfert des e-mails. Lors du transfert d'un e-mail, l'adresse de l'expéditeur doit être réécrite pour garantir sa réussite aux contrôles SPF à destination.

Sans SRS, les e-mails transférés échouent souvent à la vérification SPF et sont considérés comme spam, voire rejetés. Notre implémentation de SRS garantit la fiabilité de la livraison de vos e-mails transférés, tout en conservant les informations de l'expéditeur d'origine de manière transparente.

## Comment fonctionne la redirection d'e-mails : l'explication simple {#how-email-forwarding-works-the-simple-explanation}

Si les détails techniques semblent écrasants, voici une manière plus simple de comprendre la redirection des e-mails :

Considérez la réexpédition des e-mails comme la réexpédition du courrier physique. Lorsque vous déménagez, vous pouvez demander à la Poste de transférer tout le courrier de votre ancienne adresse vers votre nouvelle. La réexpédition des e-mails fonctionne de manière similaire, mais pour les messages numériques.

Avec le transfert d'e-mail :

1. Vous nous indiquez les adresses e-mail que vous souhaitez configurer sur votre domaine (par exemple, <ventes@votredomaine.com> ou <contact@votredomaine.com>).
2. Vous nous indiquez où vous souhaitez que ces e-mails soient envoyés (par exemple, votre compte Gmail ou Outlook).
3. Nous nous occupons de tous les détails techniques pour garantir que les e-mails envoyés à vos adresses personnalisées arrivent bien dans la boîte de réception que vous avez indiquée.

C'est aussi simple que ça ! Vous pouvez utiliser des adresses e-mail professionnelles sans modifier votre flux de messagerie actuel.

## Configuration du transfert d'e-mails avec le transfert d'e-mails {#setting-up-email-forwarding-with-forward-email}

L'un des principaux avantages de la fonction de transfert d'e-mails est sa simplicité de configuration. Voici un guide étape par étape :

### 1. Créez un compte {#1-sign-up-for-an-account}

Visitez [forwardemail.net](https://forwardemail.net) et créez un compte gratuit. Notre processus d'inscription prend moins d'une minute.

### 2. Ajoutez votre domaine {#2-add-your-domain}

Une fois connecté, ajoutez le domaine que vous souhaitez utiliser pour la redirection d'e-mails. Si vous ne possédez pas encore de domaine, vous devrez d'abord en acheter un auprès d'un registraire de domaines.

### 3. Configurer les enregistrements DNS {#3-configure-dns-records}

Nous vous fournirons les enregistrements DNS exacts à ajouter à votre domaine. Généralement, cela implique :

* Ajout d'enregistrements MX pointant vers nos serveurs de messagerie
* Ajout d'enregistrements TXT à des fins de vérification et de sécurité

La plupart des bureaux d'enregistrement de noms de domaine proposent une interface simple pour ajouter ces enregistrements. Nous fournissons des guides détaillés pour tous les principaux bureaux d'enregistrement de noms de domaine afin de simplifier ce processus.

### 4. Créer des transferts d'e-mails {#4-create-email-forwards}

Une fois vos enregistrements DNS vérifiés (ce qui ne prend généralement que quelques minutes), vous pouvez créer des redirections d'e-mails. Il vous suffit de spécifier :

* L'adresse e-mail de votre domaine (par exemple, <contact@votredomaine.com>)
* La destination de vos e-mails (par exemple, votre adresse Gmail personnelle)

### 5. Commencez à utiliser vos nouvelles adresses e-mail {#5-start-using-your-new-email-addresses}

Et voilà ! Les e-mails envoyés à vos adresses de domaine personnalisées seront désormais transférés vers la destination spécifiée. Vous pouvez créer autant de redirections que nécessaire, y compris des adresses fourre-tout qui redirigent tous les e-mails envoyés à n'importe quelle adresse de votre domaine.

## Fonctionnalités avancées du transfert d'e-mails {#advanced-features-of-forward-email}

Bien que la redirection d'e-mails de base soit puissante en soi, Forward Email offre plusieurs fonctionnalités avancées qui nous distinguent :

### Adresses jetables {#disposable-addresses}

Créez des adresses e-mail spécifiques ou anonymes qui redirigent vers votre compte principal. Vous pouvez attribuer des libellés à ces adresses et les activer ou les désactiver à tout moment pour organiser votre boîte de réception. Votre adresse e-mail réelle n'est jamais divulguée.

### Destinataires multiples et caractères génériques {#multiple-recipients-and-wildcards}

Transférez une même adresse à plusieurs destinataires pour faciliter le partage d'informations au sein de votre équipe. Vous pouvez également utiliser des adresses génériques (transfert universel) pour recevoir les e-mails envoyés à n'importe quelle adresse de votre domaine.

Intégration ### « Envoyer un e-mail en tant que » {#send-mail-as-integration}

Vous n'aurez plus besoin de quitter votre boîte de réception pour envoyer des e-mails depuis votre domaine personnalisé. Envoyez et répondez aux messages comme s'ils provenaient de <vous@votredomaine.com>, directement depuis votre compte Gmail ou Outlook.

### Sécurité résistante aux quanta {#quantum-resistant-security}

Nous sommes le premier et le seul service de messagerie électronique au monde à utiliser un cryptage résistant aux quanta, protégeant vos communications contre les menaces futures les plus avancées.

### Boîtes aux lettres SQLite chiffrées individuellement {#individually-encrypted-sqlite-mailboxes}

Contrairement à d’autres fournisseurs qui stockent tous les e-mails des utilisateurs dans des bases de données partagées, nous utilisons des boîtes aux lettres SQLite cryptées individuellement pour une confidentialité et une sécurité inégalées.

## Pourquoi choisir Forward Email plutôt que les concurrents ? {#why-choose-forward-email-over-competitors}

Le marché de la redirection d'e-mails compte plusieurs acteurs, mais Forward Email se démarque de plusieurs manières importantes :

### 1. 100 % Open Source {#1-100-open-source}

Nous sommes le seul service de transfert d'e-mails entièrement open source, y compris notre code back-end. Cette transparence renforce la confiance et permet des audits de sécurité indépendants. D'autres services peuvent se revendiquer open source sans pour autant divulguer leur code back-end.

### 2. Axé sur la confidentialité {#2-privacy-focused}

Nous avons créé ce service car vous avez droit à la confidentialité. Nous utilisons un chiffrement robuste avec TLS, ne conservons pas les journaux SMTP (sauf pour les erreurs et les messages SMTP sortants) et n'enregistrons pas vos e-mails sur disque dur.

### 3. Aucune dépendance à un tiers {#3-no-third-party-reliance}

Contrairement à nos concurrents qui s'appuient sur Amazon SES ou d'autres services tiers, nous conservons un contrôle total sur notre infrastructure, améliorant ainsi à la fois la fiabilité et la confidentialité.

### 4. Tarification rentable {#4-cost-effective-pricing}

Notre modèle tarifaire vous permet d'évoluer à moindre coût. Nous ne facturons pas par utilisateur et vous pouvez payer à l'utilisation de votre espace de stockage. À 3 $/mois, nous offrons plus de fonctionnalités à un prix inférieur à celui de nos concurrents comme Gandi (3,99 $/mois).

### 5. Ressources illimitées {#5-unlimited-resources}

Nous n'imposons pas de limites artificielles aux domaines, aux alias ou aux adresses e-mail comme le font de nombreux concurrents.

### 6. Approuvé par les grandes organisations {#6-trusted-by-major-organizations}

Notre service est utilisé par plus de 500 000 domaines, y compris des organisations notables comme [L'Académie navale américaine](/blog/docs/federal-government-email-service-section-889-compliant), Netflix, [La Fondation Linux](/blog/docs/linux-foundation-email-enterprise-case-study), [Canonical/Ubuntu](/blog/docs/canonical-ubuntu-email-enterprise-case-study), Disney Ad Sales et bien d'autres.

## Cas d'utilisation courants pour le transfert d'e-mails {#common-use-cases-for-email-forwarding}

La redirection de courrier électronique résout de nombreux problèmes pour différents types d’utilisateurs :

### Pour les entreprises {#for-businesses}

* Créez des adresses e-mail professionnelles pour différents services (ventes@, support@, info@)
* Gérez facilement les communications par e-mail de votre équipe
* Préservez la cohérence de votre marque dans toutes vos communications
* Simplifiez la gestion des e-mails lors des changements de personnel

### Pour les développeurs {#for-developers}

* Configurez des systèmes de notifications automatisés
* Créez des adresses spécifiques à vos projets
* Intégrez des webhooks pour une automatisation avancée
* Exploitez notre API pour des implémentations personnalisées

### Pour les personnes soucieuses de leur vie privée {#for-privacy-conscious-individuals}

* Créez des adresses e-mail distinctes pour chaque service afin de savoir qui partage vos informations.
* Utilisez des adresses jetables pour les inscriptions ponctuelles.
* Préservez votre confidentialité en protégeant votre adresse e-mail principale.
* Désactivez facilement les adresses qui commencent à recevoir du spam.

## Meilleures pratiques pour le transfert d'e-mails {#best-practices-for-email-forwarding}

Pour tirer le meilleur parti du transfert d’e-mails, tenez compte de ces bonnes pratiques :

### 1. Utilisez des adresses descriptives {#1-use-descriptive-addresses}

Créez des adresses e-mail qui indiquent clairement leur objectif (par exemple, <newsletter@votredomaine.com>, <shopping@votredomaine.com>) pour vous aider à organiser votre courrier entrant.

### 2. Mettre en œuvre une authentification appropriée {#2-implement-proper-authentication}

Assurez-vous que votre domaine dispose des enregistrements SPF, DKIM et DMARC appropriés pour optimiser la délivrabilité. Forward Email simplifie cette tâche grâce à notre configuration guidée.

### 3. Vérifiez régulièrement vos transferts {#3-regularly-review-your-forwards}

Vérifiez régulièrement vos transferts d'e-mails pour désactiver ceux qui ne sont plus nécessaires ou qui reçoivent trop de spam.

### 4. Configurer « Envoyer le courrier en tant que » pour des réponses transparentes {#4-set-up-send-mail-as-for-seamless-replies}

Configurez votre client de messagerie principal pour envoyer des e-mails en tant qu'adresses de domaine personnalisées pour une expérience cohérente lors de la réponse aux e-mails transférés.

### 5. Utilisez les adresses fourre-tout avec précaution {#5-use-catch-all-addresses-cautiously}

Bien que les adresses fourre-tout soient pratiques, elles peuvent potentiellement recevoir davantage de spam. Pensez à créer des redirections spécifiques pour les communications importantes.

## Conclusion {#conclusion}

La redirection d'e-mails est un outil puissant qui apporte professionnalisme, confidentialité et simplicité à vos communications par e-mail. Avec Forward Email, vous bénéficiez du service de redirection d'e-mails le plus sécurisé, privé et flexible du marché.

En tant que seul fournisseur 100 % open source doté d'un cryptage résistant aux attaques quantiques et axé sur la confidentialité, nous avons créé un service qui respecte vos droits tout en offrant des fonctionnalités exceptionnelles.

Que vous cherchiez à créer des adresses e-mail professionnelles pour votre entreprise, à protéger votre vie privée avec des adresses jetables ou à simplifier la gestion de plusieurs comptes de messagerie, Forward Email fournit la solution parfaite.

Prêt à transformer votre expérience de messagerie ? Inscrivez-vous dès aujourd'hui et rejoignez plus de 500 000 domaines qui bénéficient déjà de notre service.

---

*Cet article de blog a été rédigé par l'équipe Forward Email, créatrice du service de transfert d'e-mails le plus sécurisé, privé et flexible au monde. Consultez [forwardemail.net](https://forwardemail.net) pour en savoir plus sur notre service et commencer à transférer vos e-mails en toute confiance.*