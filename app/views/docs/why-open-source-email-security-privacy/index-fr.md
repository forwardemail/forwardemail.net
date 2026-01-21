# Pourquoi le courrier électronique open source est l'avenir : l'avantage du courrier électronique de transfert {#why-open-source-email-is-the-future-the-forward-email-advantage}

<img loading="lazy" src="/img/articles/open-source.webp" alt="Open source email security and privacy" class="rounded-lg" />

## Table des matières {#table-of-contents}

* [Avant-propos](#foreword)
* [L'avantage de l'open source : bien plus qu'une simple question de marketing](#the-open-source-advantage-more-than-just-marketing)
  * [Ce que signifie le véritable Open Source](#what-true-open-source-means)
  * [Le problème du backend : là où la plupart des services de messagerie « open source » échouent](#the-backend-problem-where-most-open-source-email-services-fall-short)
* [Transfert d'e-mails : 100 % Open Source, Frontend ET Backend](#forward-email-100-open-source-frontend-and-backend)
  * [Notre approche technique unique](#our-unique-technical-approach)
* [L'option d'auto-hébergement : la liberté de choix](#the-self-hosting-option-freedom-of-choice)
  * [Pourquoi nous soutenons l'auto-hébergement](#why-we-support-self-hosting)
  * [La réalité de l'auto-hébergement des e-mails](#the-reality-of-self-hosting-email)
* [Pourquoi notre service payant est judicieux (même si nous sommes open source)](#why-our-paid-service-makes-sense-even-though-were-open-source)
  * [Comparaison des coûts](#cost-comparison)
  * [Le meilleur des deux mondes](#the-best-of-both-worlds)
* [La tromperie des sources fermées : ce que Proton et Tutanota ne vous disent pas](#the-closed-source-deception-what-proton-and-tutanota-dont-tell-you)
  * [Les revendications open source de Proton Mail](#proton-mails-open-source-claims)
  * [L'approche similaire de Tutanota](#tutanotas-similar-approach)
  * [Le débat sur les guides de confidentialité](#the-privacy-guides-debate)
* [L'avenir est à l'Open Source](#the-future-is-open-source)
  * [Pourquoi l'Open Source est gagnant](#why-open-source-is-winning)
* [Passer au transfert d'e-mails](#making-the-switch-to-forward-email)
* [Conclusion : Le courrier électronique open source pour un avenir privé](#conclusion-open-source-email-for-a-private-future)

## Avant-propos {#foreword}

À une époque où les préoccupations en matière de confidentialité numérique sont plus que jamais d'actualité, les services de messagerie que nous choisissons sont plus importants que jamais. Si de nombreux fournisseurs affirment accorder la priorité à votre vie privée, il existe une différence fondamentale entre ceux qui se contentent de parler de confidentialité et ceux qui agissent concrètement. Chez Forward Email, nous avons bâti notre service sur une transparence totale grâce à un développement open source, non seulement pour nos applications front-end, mais aussi pour l'ensemble de notre infrastructure.

Cet article de blog explore pourquoi les solutions de messagerie open source sont supérieures aux alternatives à source fermée, comment notre approche diffère de celle de concurrents comme Proton Mail et Tutanota, et pourquoi, malgré notre engagement envers les options d'auto-hébergement, notre service payant offre le meilleur rapport qualité-prix pour la plupart des utilisateurs.

## L'avantage de l'Open Source : bien plus que du marketing {#the-open-source-advantage-more-than-just-marketing}

Le terme « open source » est devenu un terme marketing à la mode ces dernières années. Le marché mondial des services open source devrait connaître une croissance annuelle composée de plus de 16 % entre 2024 et 2032[^1]. Mais que signifie être véritablement open source et pourquoi est-ce important pour la confidentialité de vos e-mails ?

### Ce que signifie le véritable Open Source {#what-true-open-source-means}

Les logiciels open source mettent l'intégralité de leur code source à la disposition de tous, pour que chacun puisse l'inspecter, le modifier et l'améliorer. Cette transparence crée un environnement où :

* Les failles de sécurité peuvent être identifiées et corrigées par une communauté mondiale de développeurs.
* Les déclarations de confidentialité peuvent être vérifiées par une revue de code indépendante.
* Les utilisateurs ne sont pas enfermés dans des écosystèmes propriétaires.
* L'innovation est plus rapide grâce à l'amélioration collaborative.

En ce qui concerne le courrier électronique, l’épine dorsale de votre identité en ligne, cette transparence n’est pas seulement agréable à avoir ; elle est essentielle pour une véritable confidentialité et sécurité.

### Le problème du backend : là où la plupart des services de messagerie « open source » échouent {#the-backend-problem-where-most-open-source-email-services-fall-short}

C'est là que les choses deviennent intéressantes. De nombreux fournisseurs de messagerie électronique populaires, soucieux de la confidentialité, se présentent comme open source, mais il existe une distinction essentielle qu'ils espèrent que vous ne remarquerez pas : **ils n'ouvrent le code source que de leurs interfaces utilisateur, tout en gardant leurs back-ends fermés**.

Qu'est-ce que cela signifie ? Le front-end est ce que vous voyez et avec lequel vous interagissez : l'interface web ou l'application mobile. Le back-end est le lieu où s'effectue le traitement des e-mails : vos messages sont stockés, chiffrés et transmis. Lorsqu'un fournisseur conserve son back-end en mode fermé :

1. Vous ne pouvez pas vérifier le traitement de vos e-mails.
2. Vous ne pouvez pas confirmer la légitimité de leurs déclarations de confidentialité.
3. Vous vous fiez aux arguments marketing plutôt qu'à un code vérifiable.
4. Des failles de sécurité peuvent rester invisibles au public.

Comme l'ont souligné les discussions sur les forums Privacy Guides, Proton Mail et Tutanota se revendiquent tous deux open source, mais leurs backends restent fermés et propriétaires\[^2]. Cela crée un important manque de confiance : on vous demande de croire à leurs promesses de confidentialité sans pouvoir les vérifier.

## E-mail de transfert : 100 % Open Source, Frontend ET Backend {#forward-email-100-open-source-frontend-and-backend}

Chez Forward Email, nous avons adopté une approche radicalement différente. L'intégralité de notre code source, front-end et back-end, est open source et accessible à tous à l'adresse <https://github.com/forwardemail/forwardemail.net>.

Cela signifie:

1. **Transparence totale** : Chaque ligne de code qui traite vos e-mails est accessible au public.
2. **Confidentialité vérifiable** : Nos déclarations de confidentialité ne sont pas du marketing, ce sont des faits vérifiables que chacun peut confirmer en examinant notre code.
3. **Sécurité communautaire** : Notre sécurité est renforcée par l'expertise collective de la communauté mondiale de développeurs.
4. **Aucune fonctionnalité cachée** : Ce que vous voyez est ce que vous obtenez : pas de suivi caché, pas de portes dérobées secrètes.

### Notre approche technique unique {#our-unique-technical-approach}

Notre engagement en matière de confidentialité va au-delà du simple fait d'être open source. Nous avons mis en œuvre plusieurs innovations techniques qui nous distinguent :

#### Boîtes aux lettres SQLite chiffrées individuellement {#individually-encrypted-sqlite-mailboxes}

Contrairement aux fournisseurs de messagerie traditionnels qui utilisent des bases de données relationnelles partagées (où une seule faille pourrait exposer toutes les données des utilisateurs), nous utilisons des fichiers SQLite chiffrés individuellement pour chaque boîte aux lettres. Cela signifie :

* Chaque boîte aux lettres est un fichier chiffré distinct.
* L'accès aux données d'un utilisateur ne donne pas accès aux autres.
* Même nos propres employés ne peuvent pas accéder à vos données ; il s'agit d'une décision de conception fondamentale.

Comme nous l'avons expliqué dans les discussions sur les guides de confidentialité :

> « Les bases de données relationnelles partagées (par exemple, MongoDB, SQL Server, PostgreSQL, Oracle, MySQL, etc.) nécessitent toutes un identifiant (avec nom d'utilisateur et mot de passe) pour établir la connexion. Cela signifie que toute personne disposant de ce mot de passe peut interroger la base de données pour n'importe quelle raison, qu'il s'agisse d'un employé malveillant ou d'une attaque de femme de ménage malveillante. Cela signifie également que l'accès aux données d'un utilisateur implique l'accès à celles des autres. D'un autre côté, SQLite pourrait être considéré comme une base de données partagée, mais son utilisation (chaque boîte aux lettres = fichier SQLite individuel) la rend sandbox. »\[^3]

#### Chiffrement résistant aux quanta {#quantum-resistant-encryption}

Alors que d’autres fournisseurs sont encore en train de rattraper leur retard, nous avons déjà mis en œuvre des méthodes de cryptage résistantes aux technologies quantiques pour garantir la confidentialité de vos e-mails contre les menaces émergentes de l’informatique quantique.

#### Aucune dépendance tierce {#no-third-party-dependencies}

Contrairement à nos concurrents qui s'appuient sur des services comme Amazon SES pour la distribution des e-mails, nous avons développé l'intégralité de notre infrastructure en interne. Cela élimine les risques de fuites de données via des services tiers et nous donne un contrôle total sur l'ensemble du processus de messagerie.

## L'option d'auto-hébergement : la liberté de choix {#the-self-hosting-option-freedom-of-choice}

L'un des atouts majeurs des logiciels open source est la liberté qu'ils offrent. Avec Forward Email, vous n'êtes jamais limité : vous pouvez auto-héberger l'intégralité de notre plateforme si vous le souhaitez.

### Pourquoi nous prenons en charge l'auto-hébergement {#why-we-support-self-hosting}

Nous croyons qu'il est important de donner aux utilisateurs un contrôle total sur leurs données. C'est pourquoi nous avons rendu notre plateforme entièrement auto-hébergée, avec une documentation complète et des guides d'installation. Cette approche :

* Offre un contrôle maximal aux utilisateurs à l'aise avec la technologie
* Élimine le besoin de nous faire confiance en tant que prestataire de services
* Permet la personnalisation pour répondre à des exigences spécifiques
* Garantit la continuité du service même en cas de panne de notre entreprise

### La réalité de l'auto-hébergement des e-mails {#the-reality-of-self-hosting-email}

Bien que l'auto-hébergement soit une option puissante, il est important de comprendre les coûts réels impliqués :

#### Coûts financiers {#financial-costs}

* Coûts du VPS ou du serveur : 5 $ à 50 $/mois pour une configuration de base\[^4]
* Enregistrement et renouvellement de domaine : 10 $ à 20 $/an
* Certificats SSL (Let's Encrypt propose des options gratuites)
* Coûts potentiels des services de surveillance et des solutions de sauvegarde

#### Coûts en temps {#time-costs}

* Configuration initiale : de quelques heures à quelques jours, selon l’expertise technique
* Maintenance continue : 5 à 10 heures par mois pour les mises à jour, les correctifs de sécurité et le dépannage\[^5]
* Apprentissage : Compréhension des protocoles de messagerie, des bonnes pratiques de sécurité et de l’administration du serveur

#### Défis techniques {#technical-challenges}

* Problèmes de délivrabilité des e-mails (messages marqués comme spam)
* Suivi de l'évolution des normes de sécurité
* Garantie d'une disponibilité et d'une fiabilité élevées
* Gestion efficace du filtrage anti-spam

Comme l'a dit un auto-hébergeur expérimenté : « Le courrier électronique est un service de base... Il est moins cher d'héberger mon courrier électronique chez \[un fournisseur] que de dépenser de l'argent *et* du temps pour l'héberger lui-même. »\[^6]

## Pourquoi notre service payant est logique (même si nous sommes open source) {#why-our-paid-service-makes-sense-even-though-were-open-source}

Compte tenu des défis de l’auto-hébergement, notre service payant offre le meilleur des deux mondes : la transparence et la sécurité de l’open source avec la commodité et la fiabilité d’un service géré.

### Comparaison des coûts {#cost-comparison}

Si l’on prend en compte les coûts financiers et les délais, notre service payant offre une valeur exceptionnelle :

* **Coût total de l'auto-hébergement** : 56 $ à 252 $/mois (coûts du serveur et estimation du temps de travail inclus)
* **Forfaits payants de transfert d'e-mails** : 3 $ à 9 $/mois

Notre service payant offre :

* Gestion et maintenance professionnelles
* Réputation IP établie pour une meilleure délivrabilité
* Mises à jour et surveillance de sécurité régulières
* Assistance en cas de problème
* Tous les avantages de notre approche open source en matière de confidentialité

### Le meilleur des deux mondes {#the-best-of-both-worlds}

En choisissant Transférer un e-mail, vous obtenez :

1. **Confidentialité vérifiable** : Notre code source open source vous garantit la confiance que vous accordez à nos déclarations de confidentialité.
2. **Gestion professionnelle** : Nul besoin de devenir un expert en serveurs de messagerie.
3. **Rentabilité** : Coût total inférieur à celui de l'auto-hébergement.
4. **Absence de dépendance** : L'auto-hébergement reste toujours disponible.

## La tromperie à source fermée : ce que Proton et Tutanota ne vous disent pas {#the-closed-source-deception-what-proton-and-tutanota-dont-tell-you}

Examinons de plus près en quoi notre approche diffère de celle des fournisseurs de messagerie électronique populaires « axés sur la confidentialité ».

### Les revendications open source de Proton Mail {#proton-mails-open-source-claims}

Proton Mail se présente comme open source, mais cela ne s'applique qu'à ses applications front-end. Son back-end, où vos e-mails sont traités et stockés, reste un environnement à code source fermé[^7]. Cela signifie :

* Vous ne pouvez pas vérifier la gestion de vos e-mails.
* Vous devez faire confiance à leurs déclarations de confidentialité sans vérification.
* Les failles de sécurité de leur back-end restent invisibles au public.
* Vous êtes enfermé dans leur écosystème sans options d'auto-hébergement.

### Approche similaire de Tutanota {#tutanotas-similar-approach}

Comme Proton Mail, Tutanota n'ouvre le code source que de son interface utilisateur, tout en conservant son back-end propriétaire\[^8]. Ils sont confrontés aux mêmes problèmes de confiance :

* Aucun moyen de vérifier les déclarations de confidentialité du backend
* Transparence limitée sur le traitement réel des e-mails
* Problèmes de sécurité potentiels cachés au public
* Enfermement chez un fournisseur sans option d'auto-hébergement

### Le débat sur les guides de confidentialité {#the-privacy-guides-debate}

Ces limitations ne sont pas passées inaperçues au sein de la communauté de la protection de la vie privée. Lors des discussions sur les guides de confidentialité, nous avons souligné cette distinction essentielle :

> « Il est indiqué que Protonmail et Tuta sont des logiciels à code source fermé. Car leur backend est bel et bien à code source fermé. »\[^9]

Nous avons également déclaré :

> « Aucun audit public n'a été partagé sur les infrastructures back-end des fournisseurs de services de messagerie PG actuellement répertoriés, ni aucun extrait de code source ouvert n'a été partagé sur la façon dont ils traitent les e-mails entrants. »\[^10]

Ce manque de transparence crée un problème fondamental de confiance. Sans backends open source, les utilisateurs sont contraints de croire aux déclarations de confidentialité sur parole plutôt que de se fier à une vérification.

## L'avenir est l'open source {#the-future-is-open-source}

La tendance vers les solutions open source s'accélère dans l'industrie du logiciel. Selon une étude récente :

* Le marché des logiciels open source passe de 41,83 milliards de dollars en 2024 à 48,92 milliards de dollars en 2025\[^11]
* 80 % des entreprises déclarent avoir davantage recours à l'open source au cours de l'année écoulée\[^12]
* L'adoption de l'open source devrait poursuivre son expansion rapide.

Cette croissance reflète une évolution fondamentale de notre conception de la sécurité et de la confidentialité des logiciels. À mesure que les utilisateurs se soucient de plus en plus de leur vie privée, la demande de confidentialité vérifiable grâce à des solutions open source ne fera qu'augmenter.

### Pourquoi l'Open Source est en train de gagner {#why-open-source-is-winning}

Les avantages de l’open source deviennent de plus en plus évidents :

1. **Sécurité par la transparence** : Le code open source peut être révisé par des milliers d'experts, et pas seulement par une équipe interne.
2. **Innovation plus rapide** : Le développement collaboratif accélère les améliorations.
3. **Confiance par la vérification** : Les déclarations peuvent être vérifiées plutôt que prises au pied de la lettre.
4. **Absence de dépendance vis-à-vis d'un fournisseur** : Les utilisateurs gardent le contrôle de leurs données et services.
5. **Support communautaire** : Une communauté mondiale contribue à identifier et à résoudre les problèmes.

## Passer au transfert d'e-mails {#making-the-switch-to-forward-email}

Passer à Forward Email est simple, que vous veniez d'un fournisseur grand public comme Gmail ou d'un autre service axé sur la confidentialité comme Proton Mail ou Tutanota.

Notre service offre :

* Domaines et alias illimités
* Prise en charge des protocoles standards (SMTP, IMAP, POP3) sans passerelles propriétaires
* Intégration transparente avec les clients de messagerie existants
* Configuration simple avec documentation complète
* Forfaits abordables à partir de 3 $/mois

## Conclusion : Email open source pour un avenir privé {#conclusion-open-source-email-for-a-private-future}

Dans un monde où la confidentialité numérique est de plus en plus menacée, la transparence des solutions open source offre une protection essentielle. Chez Forward Email, nous sommes fiers d'être à l'avant-garde avec notre approche entièrement open source de la confidentialité des e-mails.

Contrairement à nos concurrents qui n'adoptent que partiellement l'open source, nous avons mis l'intégralité de notre plateforme – front-end et back-end – à la disposition du public. Cet engagement de transparence, combiné à notre approche technique innovante, offre un niveau de confidentialité vérifiable que les alternatives à code source fermé ne peuvent tout simplement pas égaler.

Que vous choisissiez d'utiliser notre service géré ou d'auto-héberger notre plateforme, vous bénéficiez de la sécurité, de la confidentialité et de la tranquillité d'esprit qui découlent d'un courrier électronique véritablement open source.

L'avenir du courrier électronique est ouvert, transparent et respectueux de la vie privée. L'avenir, c'est le transfert de courrier électronique.

\[^1]: SNS Insider. « Le marché des services open source était évalué à 28,6 milliards de dollars en 2023 et atteindra 114,8 milliards de dollars d'ici 2032, avec un TCAC de 16,70 % d'ici 2032. » [Rapport d'analyse et de taille du marché des services open source 2032](https://www.snsinsider.com/reports/open-source-services-market-3322)

\[^2] : Communauté des guides de confidentialité. « Transférer un e-mail (fournisseur de messagerie) – Développement du site / Suggestions d'outils. » [Discussion sur les guides de confidentialité](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^3] : Communauté des guides de confidentialité. « Transférer un e-mail (fournisseur de messagerie) – Développement du site / Suggestions d'outils. » [Discussion sur les guides de confidentialité](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^4]: RunCloud. « En général, comptez entre 5 et 50 $ par mois pour un serveur privé virtuel (VPS) de base pour gérer votre serveur de messagerie. » [Les 10 meilleures plateformes de messagerie auto-hébergées à utiliser en 2025](https://runcloud.io/blog/best-self-hosted-email-server)

\[^5] : Forum Mail-in-a-Box. « La maintenance m'a pris environ 16 heures pendant cette période… » [Serveur de messagerie auto-hébergé mal vu](https://discourse.mailinabox.email/t/self-hosting-mail-server-frowned-upon/4143)

\[^6]: Reddit r/selfhosted. « En résumé : Comme tout ce qui est auto-hébergé, cela demandera du temps. Si vous n'avez pas de temps à y consacrer, il est toujours préférable de vous en tenir à un hébergement… » [Héberger soi-même son serveur de messagerie ? Pourquoi ? Qu'est-ce qui est populaire ?](https://www.reddit.com/r/selfhosted/comments/1etb8jh/selfhosting_an_email_server_why_or_why_not_whats/)

\[^7] : Transférer un e-mail. « Proton Mail se présente comme open source, mais son back-end est en réalité fermé. » [Comparaison entre Tutanota et Proton Mail (2025)](https://forwardemail.net/blog/tutanota-vs-proton-mail-email-service-comparison)

\[^8] : Transférer un e-mail. « Tutanota prétend être open source, mais son back-end est en réalité un back-end fermé. » [Comparaison entre Proton Mail et Tutanota (2025)](https://forwardemail.net/blog/proton-mail-vs-tutanota-email-service-comparison)

\[^9] : Communauté des guides de confidentialité. « Il est indiqué que Protonmail et Tuta sont des logiciels à code source fermé. Car leur backend est bel et bien à code source fermé. » [Transfert d'e-mails (fournisseur de messagerie) - Développement de sites Web / Suggestions d'outils](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^10] : Communauté des guides de confidentialité. « Aucun audit public des infrastructures back-end des fournisseurs de services de messagerie PG actuellement répertoriés n'a été publié, ni aucun extrait de code source ouvert n'a été partagé sur leur traitement des e-mails entrants. » [Transfert d'e-mails (fournisseur de messagerie) - Développement de sites Web / Suggestions d'outils](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^11]: IBM. « Le marché des logiciels open source passera de 41,83 milliards de dollars en 2024 à 48,92 milliards de dollars en 2025 à un taux composé… » [Qu'est-ce qu'un logiciel open source ?](https://www.ibm.com/think/topics/open-source)

\[^12]: PingCAP. « Avec 80 % des entreprises signalant une utilisation accrue des technologies open source au cours de l'année écoulée, c'est… » [Tendances émergentes dans les communautés Open Source 2024](https://www.pingcap.com/article/emerging-trends-open-source-communities-2024/)