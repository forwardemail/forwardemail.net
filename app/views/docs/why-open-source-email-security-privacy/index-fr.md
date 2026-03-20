# Pourquoi l'email open-source est l'avenir : l'avantage Forward Email {#why-open-source-email-is-the-future-the-forward-email-advantage}

<img loading="lazy" src="/img/articles/open-source.webp" alt="Sécurité et confidentialité des emails open source" class="rounded-lg" />


## Table des matières {#table-of-contents}

* [Avant-propos](#foreword)
* [L'avantage de l'open-source : bien plus qu'un simple argument marketing](#the-open-source-advantage-more-than-just-marketing)
  * [Ce que signifie vraiment l'open-source](#what-true-open-source-means)
  * [Le problème du backend : où la plupart des services email "open-source" échouent](#the-backend-problem-where-most-open-source-email-services-fall-short)
* [Forward Email : 100 % open-source, frontend ET backend](#forward-email-100-open-source-frontend-and-backend)
  * [Notre approche technique unique](#our-unique-technical-approach)
* [L'option d'auto-hébergement : liberté de choix](#the-self-hosting-option-freedom-of-choice)
  * [Pourquoi nous soutenons l'auto-hébergement](#why-we-support-self-hosting)
  * [La réalité de l'auto-hébergement d'email](#the-reality-of-self-hosting-email)
* [Pourquoi notre service payant a du sens (même si nous sommes open-source)](#why-our-paid-service-makes-sense-even-though-were-open-source)
  * [Comparaison des coûts](#cost-comparison)
  * [Le meilleur des deux mondes](#the-best-of-both-worlds)
* [La tromperie du code fermé : ce que Proton et Tutanota ne vous disent pas](#the-closed-source-deception-what-proton-and-tutanota-dont-tell-you)
  * [Les prétentions open-source de Proton Mail](#proton-mails-open-source-claims)
  * [L'approche similaire de Tutanota](#tutanotas-similar-approach)
  * [Le débat des guides de confidentialité](#the-privacy-guides-debate)
* [L'avenir est open-source](#the-future-is-open-source)
  * [Pourquoi l'open-source gagne](#why-open-source-is-winning)
* [Passer à Forward Email](#making-the-switch-to-forward-email)
* [Conclusion : l'email open-source pour un avenir privé](#conclusion-open-source-email-for-a-private-future)


## Avant-propos {#foreword}

À une époque où les préoccupations concernant la confidentialité numérique sont à leur apogée, les services email que nous choisissons comptent plus que jamais. Bien que de nombreux fournisseurs prétendent prioriser votre vie privée, il existe une différence fondamentale entre ceux qui en parlent simplement et ceux qui agissent réellement. Chez Forward Email, nous avons construit notre service sur une base de transparence totale grâce au développement open-source — non seulement dans nos applications frontend, mais dans toute notre infrastructure.

Cet article explore pourquoi les solutions email open-source sont supérieures aux alternatives à code fermé, comment notre approche diffère de celle de concurrents comme Proton Mail et Tutanota, et pourquoi — malgré notre engagement envers les options d'auto-hébergement — notre service payant offre la meilleure valeur pour la plupart des utilisateurs.


## L'avantage de l'open-source : bien plus qu'un simple argument marketing {#the-open-source-advantage-more-than-just-marketing}

Le terme « open-source » est devenu un mot à la mode marketing populaire ces dernières années, le marché mondial des services open-source devant croître à un taux annuel composé de plus de 16 % entre 2024 et 2032\[^1]. Mais que signifie vraiment être véritablement open-source, et pourquoi est-ce important pour la confidentialité de vos emails ?

### Ce que signifie vraiment l'open-source {#what-true-open-source-means}

Le logiciel open-source rend l'intégralité de son code source librement accessible à toute personne souhaitant l'inspecter, le modifier et l'améliorer. Cette transparence crée un environnement où :

* Les vulnérabilités de sécurité peuvent être identifiées et corrigées par une communauté mondiale de développeurs
* Les affirmations sur la confidentialité peuvent être vérifiées par une revue indépendante du code
* Les utilisateurs ne sont pas enfermés dans des écosystèmes propriétaires
* L'innovation se fait plus rapidement grâce à l'amélioration collaborative

Quand il s'agit d'email — la pierre angulaire de votre identité en ligne — cette transparence n'est pas seulement un plus ; elle est essentielle pour une véritable confidentialité et sécurité.

### Le problème du backend : où la plupart des services email "open-source" échouent {#the-backend-problem-where-most-open-source-email-services-fall-short}

Voici où les choses deviennent intéressantes. De nombreux fournisseurs d'email « axés sur la confidentialité » populaires se présentent comme open-source, mais il y a une distinction critique qu'ils espèrent que vous ne remarquerez pas : **ils ne rendent open-source que leurs frontends tout en gardant leurs backends fermés**.
Que signifie cela ? Le frontend est ce que vous voyez et avec quoi vous interagissez — l'interface web ou l'application mobile. Le backend est l'endroit où le traitement réel des e-mails a lieu — où vos messages sont stockés, chiffrés et transmis. Lorsqu'un fournisseur garde son backend propriétaire (closed-source) :

1. Vous ne pouvez pas vérifier comment vos e-mails sont réellement traités
2. Vous ne pouvez pas confirmer si leurs affirmations en matière de confidentialité sont légitimes
3. Vous faites confiance aux arguments marketing plutôt qu'à un code vérifiable
4. Les vulnérabilités de sécurité peuvent rester cachées à l'examen public

Comme les discussions sur les forums de Privacy Guides l'ont souligné, Proton Mail et Tutanota prétendent être open-source, mais leurs backends restent fermés et propriétaires\[^2]. Cela crée un important déficit de confiance — on vous demande de croire leurs promesses de confidentialité sans pouvoir les vérifier.


## Forward Email : 100 % Open-Source, Frontend ET Backend {#forward-email-100-open-source-frontend-and-backend}

Chez Forward Email, nous avons adopté une approche fondamentalement différente. L’ensemble de notre base de code — frontend et backend — est open-source et disponible pour que chacun puisse l’inspecter sur <https://github.com/forwardemail/forwardemail.net>.

Cela signifie :

1. **Transparence Totale** : Chaque ligne de code qui traite vos e-mails est accessible à l’examen public.
2. **Confidentialité Vérifiable** : Nos affirmations en matière de confidentialité ne sont pas du marketing — ce sont des faits vérifiables que tout le monde peut confirmer en examinant notre code.
3. **Sécurité Pilotée par la Communauté** : Notre sécurité est renforcée par l’expertise collective de la communauté mondiale des développeurs.
4. **Aucune Fonctionnalité Cachée** : Ce que vous voyez est ce que vous obtenez — pas de suivi caché, pas de portes dérobées secrètes.

### Notre Approche Technique Unique {#our-unique-technical-approach}

Notre engagement envers la confidentialité va au-delà du simple open-source. Nous avons mis en œuvre plusieurs innovations techniques qui nous distinguent :

#### Boîtes aux lettres SQLite chiffrées individuellement {#individually-encrypted-sqlite-mailboxes}

Contrairement aux fournisseurs d’e-mails traditionnels qui utilisent des bases de données relationnelles partagées (où une seule faille pourrait exposer les données de tous les utilisateurs), nous utilisons des fichiers SQLite chiffrés individuellement pour chaque boîte aux lettres. Cela signifie :

* Chaque boîte aux lettres est un fichier chiffré séparé
* L’accès aux données d’un utilisateur ne donne pas accès à celles des autres
* Même nos propres employés ne peuvent pas accéder à vos données — c’est une décision fondamentale de conception

Comme nous l’avons expliqué dans les discussions de Privacy Guides :

> « Les bases de données relationnelles partagées (par exemple, MongoDB, SQL Server, PostgreSQL, Oracle, MySQL, etc.) nécessitent toutes une connexion (avec utilisateur/mot de passe) pour établir la connexion à la base de données. Cela signifie que toute personne disposant de ce mot de passe pourrait interroger la base de données pour n’importe quoi. Que ce soit un employé malveillant ou une attaque de type "evil maid". Cela signifie aussi que l’accès aux données d’un utilisateur implique l’accès à celles de tous les autres. En revanche, SQLite pourrait être considéré comme une base de données partagée, mais la façon dont nous l’utilisons (chaque boîte aux lettres = fichier SQLite individuel) la rend isolée. »\[^3]

#### Chiffrement Résistant au Quantique {#quantum-resistant-encryption}

Alors que d’autres fournisseurs sont encore en train de rattraper leur retard, nous avons déjà mis en œuvre des méthodes de chiffrement résistantes au quantique pour protéger à l’avenir la confidentialité de vos e-mails contre les menaces émergentes de l’informatique quantique.

#### Aucune Dépendance à des Tiers {#no-third-party-dependencies}

Contrairement à nos concurrents qui s’appuient sur des services comme Amazon SES pour la livraison des e-mails, nous avons construit toute notre infrastructure en interne. Cela élimine les fuites potentielles de confidentialité via des services tiers et nous donne un contrôle total sur toute la chaîne de traitement des e-mails.


## L’Option d’Auto-Hébergement : Liberté de Choix {#the-self-hosting-option-freedom-of-choice}

L’un des aspects les plus puissants des logiciels open-source est la liberté qu’ils offrent. Avec Forward Email, vous n’êtes jamais enfermé — vous pouvez auto-héberger toute notre plateforme si vous le souhaitez.

### Pourquoi Nous Soutenons l’Auto-Hébergement {#why-we-support-self-hosting}

Nous croyons en la capacité des utilisateurs à avoir un contrôle total sur leurs données. C’est pourquoi nous avons rendu notre plateforme entièrement auto-hébergeable avec une documentation complète et des guides d’installation. Cette approche :

* Offre un contrôle maximal aux utilisateurs techniquement compétents
* Élimine tout besoin de nous faire confiance en tant que fournisseur de service
* Permet la personnalisation pour répondre à des besoins spécifiques
* Assure la continuité du service même si notre entreprise ne le fait pas
### La réalité de l’auto-hébergement des e-mails {#the-reality-of-self-hosting-email}

Bien que l’auto-hébergement soit une option puissante, il est important de comprendre les coûts réels impliqués :

#### Coûts financiers {#financial-costs}

* Coûts VPS ou serveur : 5 à 50 $/mois pour une configuration basique\[^4]
* Enregistrement et renouvellement de domaine : 10 à 20 $/an
* Certificats SSL (bien que Let's Encrypt propose des options gratuites)
* Coûts potentiels pour les services de surveillance et les solutions de sauvegarde

#### Coûts en temps {#time-costs}

* Configuration initiale : plusieurs heures à plusieurs jours selon l’expertise technique
* Maintenance continue : 5 à 10 heures/mois pour les mises à jour, correctifs de sécurité et dépannage\[^5]
* Courbe d’apprentissage : compréhension des protocoles e-mail, des bonnes pratiques de sécurité et de l’administration serveur

#### Défis techniques {#technical-challenges}

* Problèmes de délivrabilité des e-mails (messages marqués comme spam)
* Suivi des normes de sécurité en évolution
* Garantie de haute disponibilité et fiabilité
* Gestion efficace du filtrage anti-spam

Comme l’a dit un auto-hébergeur expérimenté : « L’e-mail est un service de commodité... Il est moins cher d’héberger mes e-mails chez \[un fournisseur] que de dépenser *et* du temps à l’auto-héberger. »\[^6]


## Pourquoi notre service payant a du sens (même si nous sommes open-source) {#why-our-paid-service-makes-sense-even-though-were-open-source}

Compte tenu des défis de l’auto-hébergement, notre service payant offre le meilleur des deux mondes : la transparence et la sécurité de l’open-source avec la commodité et la fiabilité d’un service géré.

### Comparaison des coûts {#cost-comparison}

Quand on prend en compte à la fois les coûts financiers et en temps, notre service payant offre une valeur exceptionnelle :

* **Coût total de l’auto-hébergement** : 56 à 252 $/mois (incluant les coûts serveur et la valorisation du temps)
* **Forfaits payants Forward Email** : 3 à 9 $/mois

Notre service payant fournit :

* Gestion et maintenance professionnelles
* Réputation IP établie pour une meilleure délivrabilité
* Mises à jour de sécurité régulières et surveillance
* Support en cas de problème
* Tous les avantages de confidentialité de notre approche open-source

### Le meilleur des deux mondes {#the-best-of-both-worlds}

En choisissant Forward Email, vous obtenez :

1. **Confidentialité vérifiable** : Notre base de code open-source signifie que vous pouvez faire confiance à nos affirmations de confidentialité
2. **Gestion professionnelle** : Pas besoin de devenir un expert en serveur e-mail
3. **Rentabilité** : Coût total inférieur à l’auto-hébergement
4. **Liberté d’absence de verrouillage** : L’option d’auto-hébergement reste toujours disponible


## La tromperie du code fermé : ce que Proton et Tutanota ne vous disent pas {#the-closed-source-deception-what-proton-and-tutanota-dont-tell-you}

Examinons de plus près comment notre approche diffère de celle des fournisseurs d’e-mails « axés sur la confidentialité » populaires.

### Les prétentions open-source de Proton Mail {#proton-mails-open-source-claims}

Proton Mail se présente comme open-source, mais cela ne s’applique qu’à leurs applications frontend. Leur backend — où vos e-mails sont réellement traités et stockés — reste en code fermé\[^7]. Cela signifie :

* Vous ne pouvez pas vérifier comment vos e-mails sont traités
* Vous devez faire confiance à leurs affirmations de confidentialité sans vérification
* Les vulnérabilités de sécurité dans leur backend restent cachées au public
* Vous êtes enfermé dans leur écosystème sans options d’auto-hébergement

### Approche similaire de Tutanota {#tutanotas-similar-approach}

Comme Proton Mail, Tutanota ne rend open-source que leur frontend tout en gardant leur backend propriétaire\[^8]. Ils rencontrent les mêmes problèmes de confiance :

* Aucune façon de vérifier les affirmations de confidentialité du backend
* Transparence limitée sur le traitement réel des e-mails
* Problèmes de sécurité potentiels cachés au public
* Verrouillage fournisseur sans option d’auto-hébergement

### Le débat sur Privacy Guides {#the-privacy-guides-debate}

Ces limitations n’ont pas échappé à la communauté de la confidentialité. Dans des discussions sur Privacy Guides, nous avons souligné cette distinction critique :

> « Il est indiqué que Protonmail et Tuta sont tous deux en code fermé. Parce que leur backend est en effet en code fermé. »\[^9]

Nous avons également déclaré :

> « Il n’y a eu aucun audit public partagé des infrastructures backend de quelque fournisseur de service e-mail listé actuellement sur PG, ni de fragments de code open-source partagés sur la façon dont ils traitent les e-mails entrants. »\[^10]
Ce manque de transparence crée un problème fondamental de confiance. Sans backends open-source, les utilisateurs sont contraints de croire aux affirmations sur la confidentialité plutôt que de pouvoir les vérifier.


## L'avenir est open-source {#the-future-is-open-source}

La tendance vers les solutions open-source s'accélère dans toute l'industrie du logiciel. Selon des recherches récentes :

* Le marché des logiciels open-source passe de 41,83 milliards de dollars en 2024 à 48,92 milliards de dollars en 2025\[^11]
* 80 % des entreprises rapportent une utilisation accrue de l'open-source au cours de l'année passée\[^12]
* L'adoption de l'open-source devrait continuer son expansion rapide

Cette croissance reflète un changement fondamental dans notre manière de penser la sécurité et la confidentialité des logiciels. À mesure que les utilisateurs deviennent plus soucieux de leur vie privée, la demande pour une confidentialité vérifiable via des solutions open-source ne fera que croître.

### Pourquoi l'open-source gagne {#why-open-source-is-winning}

Les avantages de l'open-source deviennent de plus en plus évidents :

1. **Sécurité par la transparence** : Le code open-source peut être examiné par des milliers d'experts, pas seulement une équipe interne
2. **Innovation plus rapide** : Le développement collaboratif accélère les améliorations
3. **Confiance par la vérification** : Les affirmations peuvent être vérifiées plutôt que simplement crues
4. **Liberté vis-à-vis du verrouillage fournisseur** : Les utilisateurs gardent le contrôle de leurs données et services
5. **Soutien communautaire** : Une communauté mondiale aide à identifier et corriger les problèmes


## Passer à Forward Email {#making-the-switch-to-forward-email}

Passer à Forward Email est simple, que vous veniez d'un fournisseur grand public comme Gmail ou d'un autre service axé sur la confidentialité comme Proton Mail ou Tutanota.

Notre service offre :

* Domaines et alias illimités
* Support des protocoles standards (SMTP, IMAP, POP3) sans passerelles propriétaires
* Intégration transparente avec les clients mail existants
* Processus d'installation simple avec documentation complète
* Tarifs abordables à partir de seulement 3 $/mois


## Conclusion : un email open-source pour un avenir privé {#conclusion-open-source-email-for-a-private-future}

Dans un monde où la vie privée numérique est de plus en plus menacée, la transparence des solutions open-source constitue une protection cruciale. Chez Forward Email, nous sommes fiers de montrer la voie avec notre approche entièrement open-source de la confidentialité des emails.

Contrairement aux concurrents qui n'adoptent l'open-source que partiellement, nous avons rendu notre plateforme entière — frontend et backend — accessible à l'examen public. Cet engagement envers la transparence, combiné à notre approche technique innovante, offre un niveau de confidentialité vérifiable que les alternatives propriétaires ne peuvent tout simplement pas égaler.

Que vous choisissiez d'utiliser notre service géré ou d'héberger vous-même notre plateforme, vous bénéficiez de la sécurité, de la confidentialité et de la tranquillité d'esprit qu'offre un email véritablement open-source.

L'avenir de l'email est ouvert, transparent et axé sur la confidentialité. L'avenir, c'est Forward Email.

\[^1]: SNS Insider. "The Open Source Services Market was valued at USD 28.6 billion in 2023 and will reach to USD 114.8 Billion by 2032, growing at a CAGR of 16.70% by 2032." [Open Source Services Market Size & Analysis Report 2032](https://www.snsinsider.com/reports/open-source-services-market-3322)

\[^2]: Privacy Guides Community. "Forward Email (email provider) - Site Development / Tool Suggestions." [Privacy Guides Discussion](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^3]: Privacy Guides Community. "Forward Email (email provider) - Site Development / Tool Suggestions." [Privacy Guides Discussion](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^4]: RunCloud. "Generally, you can expect to spend anywhere from $5 to $50 monthly for a basic virtual private server (VPS) to run your email server." [10 Best Self-Hosted Email Server Platforms to Use in 2025](https://runcloud.io/blog/best-self-hosted-email-server)

\[^5]: Mail-in-a-Box Forum. "Maintenance took me maybe 16 hours in that period..." [Self hosting mail server frowned upon](https://discourse.mailinabox.email/t/self-hosting-mail-server-frowned-upon/4143)
\[^6]: Reddit r/selfhosted. "TL:DR : Comme tout ce qui est auto-hébergé, CELA EXIGERA VOTRE TEMPS. Si vous n'avez pas le temps à y consacrer, il est toujours préférable de rester avec un service hébergé..." [Auto-héberger un serveur email ? Pourquoi ou pourquoi pas ? Qu'est-ce qui est populaire ?](https://www.reddit.com/r/selfhosted/comments/1etb8jh/selfhosting_an_email_server_why_or_why_not_whats/)

\[^7]: Forward Email. "Proton Mail prétend être open-source, mais leur back-end est en réalité propriétaire." [Comparaison Tutanota vs Proton Mail (2025)](https://forwardemail.net/blog/tutanota-vs-proton-mail-email-service-comparison)

\[^8]: Forward Email. "Tutanota prétend être open-source, mais leur back-end est en réalité propriétaire." [Comparaison Proton Mail vs Tutanota (2025)](https://forwardemail.net/blog/proton-mail-vs-tutanota-email-service-comparison)

\[^9]: Privacy Guides Community. "Il est indiqué que Protonmail et Tuta sont tous deux propriétaires. Parce que leur backend est en effet propriétaire." [Forward Email (fournisseur d'email) - Développement du site / Suggestions d'outils](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^10]: Privacy Guides Community. "Aucun audit public n'a été partagé concernant les infrastructures backend des fournisseurs de services email actuellement listés par PG, ni aucun extrait de code open source partagé sur la manière dont ils traitent les emails entrants." [Forward Email (fournisseur d'email) - Développement du site / Suggestions d'outils](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^11]: IBM. "Le marché des logiciels open source passera de 41,83 milliards USD en 2024 à 48,92 milliards USD en 2025 avec un taux de croissance annuel composé..." [Qu'est-ce que le logiciel open source ?](https://www.ibm.com/think/topics/open-source)

\[^12]: PingCAP. "Avec 80 % des entreprises déclarant une utilisation accrue des technologies open source au cours de l'année écoulée, c'est..." [Tendances émergentes dans les communautés open source 2024](https://www.pingcap.com/article/emerging-trends-open-source-communities-2024/)
