# Le désastre de l'API PayPal depuis 11 ans : comment nous avons créé des solutions de contournement alors qu'ils ignoraient les développeurs {#paypals-11-year-api-disaster-how-we-built-workarounds-while-they-ignored-developers}

<img loading="lazy" src="/img/articles/pypl-disaster.webp" alt="PayPal API disaster illustration" class="rounded-lg" />

<p class="lead mt-3">Chez Forward Email, nous sommes confrontés aux API défaillantes de PayPal depuis plus de dix ans. Ce qui n'était au départ qu'une frustration mineure s'est transformé en un véritable désastre qui nous a obligés à concevoir nos propres solutions de contournement, à bloquer leurs modèles d'hameçonnage et, finalement, à interrompre tous les paiements PayPal lors d'une migration de compte critique.</p>
<p class="lead mt-3">Voici l'histoire de 11 ans où PayPal a ignoré les besoins fondamentaux des développeurs pendant que nous faisions tout notre possible pour que leur plateforme fonctionne.</p>

## Table des matières {#table-of-contents}

* [La pièce manquante : aucun moyen de lister les abonnements](#the-missing-piece-no-way-to-list-subscriptions)
* [2014-2017 : Le problème émerge](#2014-2017-the-problem-emerges)
* [2020 : nous leur donnons un retour complet](#2020-we-give-them-extensive-feedback)
  * [La liste de commentaires de 27 éléments](#the-27-item-feedback-list)
  * [Les équipes se sont impliquées, des promesses ont été faites](#teams-got-involved-promises-were-made)
  * [Le résultat ? Rien.](#the-result-nothing)
* [L'exode des dirigeants : comment PayPal a perdu toute sa mémoire institutionnelle](#the-executive-exodus-how-paypal-lost-all-institutional-memory)
* [2025 : Nouveau leadership, mêmes problèmes](#2025-new-leadership-same-problems)
  * [Le nouveau PDG s'implique](#the-new-ceo-gets-involved)
  * [Réponse de Michelle Gill](#michelle-gills-response)
  * [Notre réponse : plus de réunions](#our-response-no-more-meetings)
  * [La réponse de Marty Brodbeck à la suringénierie](#marty-brodbecks-overengineering-response)
  * [La contradiction du « simple CRUD »](#the-simple-crud-contradiction)
  * [La déconnexion devient évidente](#the-disconnect-becomes-clear)
* [Des années de rapports de bugs qu'ils ont ignorés](#years-of-bug-reports-they-ignored)
  * [2016 : premières plaintes concernant l'interface utilisateur et l'expérience utilisateur](#2016-early-uiux-complaints)
  * [2021 : Rapport sur les bugs liés aux e-mails professionnels](#2021-business-email-bug-report)
  * [2021 : suggestions d'amélioration de l'interface utilisateur](#2021-ui-improvement-suggestions)
  * [2021 : Échecs de l'environnement Sandbox](#2021-sandbox-environment-failures)
  * [2021 : Système de rapports complètement défaillant](#2021-reports-system-completely-broken)
  * [2022 : Fonctionnalité API principale manquante (à nouveau)](#2022-core-api-feature-missing-again)
* [Le cauchemar de l'expérience du développeur](#the-developer-experience-nightmare)
  * [Interface utilisateur cassée](#broken-user-interface)
  * [Problèmes de SDK](#sdk-problems)
  * [Violations de la politique de sécurité du contenu](#content-security-policy-violations)
  * [Chaos de la documentation](#documentation-chaos)
  * [Vulnérabilités de sécurité](#security-vulnerabilities)
  * [Catastrophe de gestion de session](#session-management-disaster)
* [Juillet 2025 : la goutte d'eau qui fait déborder le vase](#july-2025-the-final-straw)
* [Pourquoi nous ne pouvons pas simplement abandonner PayPal](#why-we-cant-just-drop-paypal)
* [La solution de contournement communautaire](#the-community-workaround)
* [Blocage des modèles PayPal en raison d'hameçonnage](#blocking-paypal-templates-due-to-phishing)
  * [Le vrai problème : les modèles PayPal ressemblent à des arnaques](#the-real-problem-paypals-templates-look-like-scams)
  * [Notre mise en œuvre](#our-implementation)
  * [Pourquoi nous avons dû bloquer PayPal](#why-we-had-to-block-paypal)
  * [L'ampleur du problème](#the-scale-of-the-problem)
  * [L'ironie](#the-irony)
  * [Impact réel : nouvelles escroqueries PayPal](#real-world-impact-novel-paypal-scams)
* [Processus KYC rétrograde de PayPal](#paypals-backwards-kyc-process)
  * [Comment cela devrait fonctionner](#how-it-should-work)
  * [Comment fonctionne réellement PayPal](#how-paypal-actually-works)
  * [L'impact dans le monde réel](#the-real-world-impact)
  * [La catastrophe de la migration des comptes de juillet 2025](#the-july-2025-account-migration-disaster)
  * [Pourquoi c'est important](#why-this-matters)
* [Comment tous les autres processeurs de paiement le font correctement](#how-every-other-payment-processor-does-it-right)
  * [Bande](#stripe)
  * [Pagayer](#paddle)
  * [Coinbase Commerce](#coinbase-commerce)
  * [Carré](#square)
  * [La norme de l'industrie](#the-industry-standard)
  * [Ce que proposent les autres processeurs par rapport à PayPal](#what-other-processors-provide-vs-paypal)
* [La dissimulation systématique de PayPal : réduire au silence 6 millions de voix](#paypals-systematic-cover-up-silencing-6-million-voices)
  * [Le Grand Effacement](#the-great-erasure)
  * [Le sauvetage par un tiers](#the-third-party-rescue)
* [Le désastre des 11 ans de capture de bugs : 1 899 $ et plus](#the-11-year-capture-bug-disaster-1899-and-counting)
  * [Perte de 1 899 $ liée à la transmission de courrier électronique](#forward-emails-1899-loss)
  * [Le rapport original de 2013 : plus de 11 ans de négligence](#the-2013-original-report-11-years-of-negligence)
  * [Admission 2016 : PayPal brise son propre SDK](#the-2016-admission-paypal-breaks-their-own-sdk)
  * [L'escalade de 2024 : toujours en panne](#the-2024-escalation-still-broken)
  * [Le désastre de la fiabilité des webhooks](#the-webhook-reliability-disaster)
  * [Le modèle de négligence systématique](#the-pattern-of-systematic-negligence)
  * [L'exigence sans papiers](#the-undocumented-requirement)
* [Le modèle de tromperie plus large de PayPal](#paypals-broader-pattern-of-deception)
  * [Action du Département des services financiers de New York](#the-new-york-department-of-financial-services-action)
  * [Le procès Honey : réécriture des liens d'affiliation](#the-honey-lawsuit-rewriting-affiliate-links)
  * [Le coût de la négligence de PayPal](#the-cost-of-paypals-negligence)
  * [Le mensonge de la documentation](#the-documentation-lie)
* [Ce que cela signifie pour les développeurs](#what-this-means-for-developers)

## La pièce manquante : aucun moyen de lister les abonnements {#the-missing-piece-no-way-to-list-subscriptions}

Voici ce qui nous époustoufle : PayPal propose la facturation par abonnement depuis 2014, mais n'a jamais fourni aux commerçants un moyen de répertorier leurs propres abonnements.

Réfléchissez-y un instant. Vous pouvez créer des abonnements et les annuler si vous disposez de l'identifiant, mais vous ne pouvez pas obtenir la liste de tous les abonnements actifs pour votre compte. C'est comme avoir une base de données sans instruction SELECT.

Nous en avons besoin pour les opérations commerciales de base :

* Assistance client (lorsqu'un client envoie un e-mail pour poser des questions sur son abonnement)
* Rapports financiers et rapprochement
* Gestion automatisée de la facturation
* Conformité et audit

Mais PayPal ? Ils ne l'ont jamais créé.

## 2014-2017 : Le problème émerge {#2014-2017-the-problem-emerges}

Le problème de liste d'abonnements est apparu pour la première fois sur les forums communautaires de PayPal en 2017. Les développeurs posaient la question évidente : « Comment puis-je obtenir une liste de tous mes abonnements ? »

La réponse de PayPal ? Des grillons.

Les membres de la communauté ont commencé à être frustrés :

> « Omission très étrange si un commerçant ne peut pas lister tous les accords actifs. Si l'identifiant de l'accord est perdu, seul l'utilisateur peut annuler ou suspendre un accord. » - leafspider

> « +1. Cela fait presque 3 ans. » - laudukang (ce qui signifie que le problème existe depuis 2014)

Le fichier [publication communautaire originale](https://web.archive.org/web/20201019142512/https://www.paypal-community.com/t5/REST-API-SDK/List-all-subscriptions/td-p/1147066) de 2017 montre que les développeurs réclamaient cette fonctionnalité de base. PayPal a réagi en archivant le dépôt où les utilisateurs signalaient le problème.

## 2020 : Nous leur donnons un retour complet {#2020-we-give-them-extensive-feedback}

En octobre 2020, PayPal nous a contactés pour une séance de feedback formelle. Il ne s'agissait pas d'une simple conversation informelle : ils ont organisé une conférence Microsoft Teams de 45 minutes avec huit dirigeants de PayPal, dont Sri Shivananda (directeur technique), Edwin Aoki, Jim Magats, John Kunze et d'autres.

### La liste de commentaires de 27 éléments {#the-27-item-feedback-list}

Nous étions préparés. Après six heures d'intégration avec leurs API, nous avions recensé 27 problèmes spécifiques. Mark Stuart, de l'équipe PayPal Checkout, a déclaré :

Salut Nick, merci d'avoir partagé ça avec tout le monde aujourd'hui ! Je pense que cela va nous permettre d'obtenir davantage de soutien et d'investissement pour que notre équipe puisse résoudre ces problèmes. Il a été difficile d'obtenir des retours aussi pertinents que ceux que tu nous as laissés jusqu'à présent.

Les retours n’étaient pas théoriques, ils provenaient de véritables tentatives d’intégration :

1. **La génération de jetons d'accès ne fonctionne pas** :

La génération de jetons d'accès ne fonctionne pas. De plus, il devrait y avoir plus que de simples exemples cURL.

2. **Pas d'interface Web pour la création d'abonnement** :

Comment diable créer des abonnements sans utiliser cURL ? Il ne semble pas exister d'interface web pour cela (contrairement à Stripe).

Mark Stuart a trouvé le problème du jeton d’accès particulièrement préoccupant :

> Nous n’entendons généralement pas parler de problèmes liés à la génération de jetons d’accès.

### Les équipes se sont impliquées, des promesses ont été faites {#teams-got-involved-promises-were-made}

À mesure que nous découvrions de nouveaux problèmes, PayPal a ajouté de nouvelles équipes à la discussion. Darshan Raju, de l'équipe UI Gestion des abonnements, s'est joint à nous et a déclaré :

> Reconnaissez l'écart. Nous le suivrons et y remédierons. Merci encore pour vos commentaires !

La séance a été décrite comme visant à :

> une présentation franche de votre expérience

à:

> faire de PayPal ce qu'il devrait être pour les développeurs.

### Le résultat ? Rien. {#the-result-nothing}

Malgré la séance de rétroaction formelle, la longue liste de 27 points, l'implication de plusieurs équipes et les promesses de :

> piste et adresse

problèmes, absolument rien n'a été résolu.

## L'exode des dirigeants : comment PayPal a perdu toute sa mémoire institutionnelle {#the-executive-exodus-how-paypal-lost-all-institutional-memory}

C'est là que ça devient vraiment intéressant. Toutes les personnes ayant reçu nos commentaires en 2020 ont quitté PayPal :

**Changements de direction :**

* [Dan Schulman (PDG depuis 9 ans) → Alex Chriss](https://www.fastcompany.com/90938418/paypal-ceo-alex-chriss-dan-schulman-what-to-know/) (septembre 2023)
* [Sri Shivananda (directeur technique qui a organisé le feedback) → JPMorgan Chase](https://www.pymnts.com/personnel/2024/jpmorgan-names-paypal-vet-shivananda-as-new-tech-chief/) (janvier 2024)

**Les dirigeants techniques qui ont fait des promesses, puis sont partis :**

* **Mark Stuart** (les commentaires promis seraient un « catalyseur ») → [Maintenant chez Ripple](https://www.linkedin.com/in/markstuartsf)
* **Jim Magats** (18 ans d'expérience chez PayPal) → [PDG de MX](https://www.cnbc.com/2022/07/28/paypal-veteran-jim-magats-is-named-ceo-of-mx-the-startup-that-connects-banks-and-fintech-players.html) (2022)
* **John Kunze** (VP Global Consumer Product) → [À la retraite](https://www.linkedin.com/in/john-kunze-5724a86) (2023)
* **Edwin Aoki** (un des derniers restants) → [Je viens de partir pour le Nasdaq](https://www.linkedin.com/posts/edwinaoki_apparently-i-just-cant-stay-awaythe-day-activity-7289388518487793664-j8OZ) (janvier 2025)

PayPal est devenu une porte tournante où les dirigeants recueillent les commentaires des développeurs, font des promesses, puis partent pour de meilleures entreprises comme JPMorgan, Ripple et d'autres sociétés de technologie financière.

Cela explique pourquoi la réponse au problème GitHub de 2025 semblait complètement déconnectée de nos commentaires de 2020 - littéralement tous ceux qui ont reçu ces commentaires ont quitté PayPal.

## 2025 : Nouveau leadership, mêmes problèmes {#2025-new-leadership-same-problems}

En 2025, le même scénario se reproduit. Après des années d'immobilisme, la nouvelle direction de PayPal tend à nouveau la main.

### Le nouveau PDG s'implique {#the-new-ceo-gets-involved}

Le 30 juin 2025, nous avons contacté directement le nouveau PDG de PayPal, Alex Chriss. Sa réponse a été brève :

Bonjour Nick, merci de votre message et de vos commentaires. Michelle (en copie) et son équipe sont à l'écoute et travaillent avec vous sur ce sujet. Merci ! -A

### Réponse de Michelle Gill {#michelle-gills-response}

Michelle Gill, vice-présidente exécutive et directrice générale des petites entreprises et des services financiers, a répondu :

Merci beaucoup Nick, d'avoir mis Alex en Cci. Nous étudions la situation depuis ton précédent message. Nous te rappellerons avant la fin de la semaine. Pourrais-tu m'envoyer tes coordonnées pour qu'un de mes collègues puisse te contacter ? Michelle

### Notre réponse : plus de réunions {#our-response-no-more-meetings}

Nous avons décliné une autre rencontre, expliquant notre frustration :

Merci. Cependant, je ne pense pas que participer à un appel va aboutir à quoi que ce soit. Voici pourquoi… J'ai déjà participé à un appel et ça n'a mené à rien. J'ai perdu plus de deux heures à discuter avec toute l'équipe et la direction, et rien n'a abouti… Des tonnes d'e-mails échangés. Absolument rien. Les retours n'ont abouti à rien. J'ai essayé pendant des années d'être écouté, et puis ça n'a abouti à rien.

### Réponse de Marty Brodbeck à la suringénierie {#marty-brodbecks-overengineering-response}

Marty Brodbeck, responsable de l’ingénierie des consommateurs chez PayPal, nous a alors contactés :

Bonjour Nick, je suis Marty Brodbeck. Je suis responsable de l'ingénierie consommateur chez PayPal et je pilote le développement de l'API de l'entreprise. Pourriez-vous nous parler du problème que vous rencontrez et de la manière dont nous pouvons vous aider ?

Lorsque nous avons expliqué le simple besoin d’un point de terminaison de liste d’abonnement, sa réponse a révélé le problème exact :

> Merci Nick, nous sommes en train de créer une API d'abonnement unique avec un SDK complet (prend en charge la gestion complète des erreurs, le suivi des abonnements basé sur les événements, une disponibilité robuste) où la facturation est également divisée en une API distincte vers laquelle les commerçants peuvent se tourner plutôt que de devoir orchestrer sur plusieurs points de terminaison pour obtenir une seule réponse.

C'est exactement la mauvaise approche. Nous n'avons pas besoin de plusieurs mois d'architecture complexe. Nous avons besoin d'un point de terminaison REST simple qui répertorie les abonnements, ce qui aurait dû exister depuis 2014.

```http
GET /v1/billing/subscriptions
Authorization: Bearer {access_token}
```

### La contradiction du « simple CRUD » {#the-simple-crud-contradiction}

Lorsque nous avons souligné qu'il s'agissait d'une fonctionnalité CRUD de base qui aurait dû exister depuis 2014, la réponse de Marty a été révélatrice :

> Les opérations Crud simples font partie de l'API principale, mon ami, donc cela ne prendra pas des mois de développement

Le SDK PayPal TypeScript, qui ne prend actuellement en charge que trois points de terminaison après des mois de développement, ainsi que son historique, démontrent clairement que de tels projets nécessitent plus de quelques mois pour être terminés.

Cette réponse montre qu'il ne comprend pas sa propre API. Si « les opérations CRUD simples font partie de l'API principale », où se trouve le point de terminaison de la liste d'abonnements ? Nous avons répondu :

Si « les opérations CRUD simples font partie de l'API principale », où se trouve le point de terminaison de la liste des abonnements ? Les développeurs réclament cette « opération CRUD simple » depuis 2014. Cela fait 11 ans. Tous les autres processeurs de paiement disposent de cette fonctionnalité de base depuis le premier jour.

### La déconnexion devient claire {#the-disconnect-becomes-clear}

Les échanges de 2025 avec Alex Chriss, Michelle Gill et Marty Brodbeck montrent le même dysfonctionnement organisationnel :

1. **La nouvelle direction n'a aucune connaissance des précédentes sessions de feedback**
2. **Elle propose les mêmes solutions complexes**
3. **Elle ne comprend pas les limites de ses propres API**
4. **Elle souhaite davantage de réunions au lieu de simplement résoudre le problème**

Ce modèle explique pourquoi les équipes PayPal en 2025 semblent complètement déconnectées des nombreux commentaires fournis en 2020 : les personnes qui ont reçu ces commentaires sont parties et la nouvelle direction répète les mêmes erreurs.

## Des années de rapports de bugs qu'ils ont ignorés {#years-of-bug-reports-they-ignored}

Nous ne nous sommes pas contentés de nous plaindre de fonctionnalités manquantes. Nous avons activement signalé les bugs et tenté de les améliorer. Voici une chronologie complète des problèmes que nous avons documentés :

### 2016 : Premières plaintes concernant l'interface utilisateur et l'expérience utilisateur {#2016-early-uiux-complaints}

En 2016 déjà, nous avions contacté publiquement la direction de PayPal, dont Dan Schulman, au sujet de problèmes d'interface et d'ergonomie. C'était il y a neuf ans, et les mêmes problèmes d'interface utilisateur et d'expérience utilisateur persistent aujourd'hui.

### 2021 : Rapport de bogue sur les e-mails professionnels {#2021-business-email-bug-report}

En mars 2021, nous avons signalé que le système de messagerie professionnelle de PayPal envoyait des notifications d'annulation incorrectes. Le modèle d'e-mail comportait des variables mal affichées, affichant des messages confus aux clients.

Mark Stuart a reconnu le problème :

Merci Nick ! Passage en copie cachée. @Prasy, votre équipe est-elle responsable de cet e-mail ou savez-vous qui l'est ? La mention « Niftylettuce, LLC, nous ne vous facturerons plus » me laisse penser qu'il y a une confusion entre le destinataire et le contenu de l'e-mail.

**Résultat** : Ils ont vraiment corrigé ce problème ! Mark Stuart l'a confirmé :

L'équipe des notifications vient d'apprendre que le modèle d'e-mail a été corrigé et déployé. Merci de nous l'avoir signalé. Merci !

Cela montre qu'ils PEUVENT réparer les choses quand ils le souhaitent - ils choisissent simplement de ne pas le faire pour la plupart des problèmes.

### 2021 : suggestions d'amélioration de l'interface utilisateur {#2021-ui-improvement-suggestions}

En février 2021, nous avons fourni des commentaires détaillés sur l'interface utilisateur de leur tableau de bord, en particulier sur la section « Activité récente PayPal » :

Je pense que le tableau de bord de paypal.com, et plus particulièrement la section « Activité récente PayPal », mérite d'être amélioré. Je ne pense pas qu'il soit nécessaire d'afficher les lignes d'état « Créé » des paiements récurrents à 0 $ ; cela ajoute une multitude de lignes supplémentaires et empêche de visualiser facilement d'un coup d'œil les revenus générés pour la journée ou les derniers jours.

Mark Stuart l'a transmis à l'équipe des produits de consommation :

Merci ! Je ne sais pas quelle équipe est responsable de l'activité, mais j'ai transmis le problème au responsable des produits grand public pour qu'il le trouve. Un paiement récurrent de 0,00 $ semble être un bug. Il faudrait probablement le filtrer.

**Résultat** : Jamais corrigé. L'interface utilisateur affiche toujours ces entrées $0 inutiles.

### 2021 : Échecs de l'environnement Sandbox {#2021-sandbox-environment-failures}

En novembre 2021, nous avons signalé des problèmes critiques avec l'environnement sandbox de PayPal :

* Les clés API secrètes du sandbox ont été modifiées et désactivées de manière aléatoire.
* Tous les comptes de test du sandbox ont été supprimés sans préavis.
* Messages d'erreur lors de la consultation des détails du compte sandbox.
* Échecs de chargement intermittents.

Pour une raison inconnue, ma clé API secrète Sandbox a été modifiée et désactivée. De plus, tous mes anciens comptes de test Sandbox ont été supprimés.

Parfois, ils se chargent, parfois non. C'est extrêmement frustrant.

**Résultat** : Aucune réponse, aucune solution. Les développeurs sont toujours confrontés à des problèmes de fiabilité du sandbox.

### 2021 : signale un système complètement défectueux {#2021-reports-system-completely-broken}

En mai 2021, nous avons signalé que le système de téléchargement des rapports de transactions de PayPal était complètement défectueux :

Il semble que les rapports de téléchargement ne fonctionnent pas pour le moment, et ce depuis ce jour. Vous devriez également recevoir une notification par e-mail en cas d'échec.

Nous avons également souligné le désastre de la gestion des sessions :

> De plus, si vous êtes inactif pendant environ 5 minutes alors que vous êtes connecté à PayPal, vous êtes déconnecté. Du coup, lorsque vous actualisez le bouton à côté du rapport dont vous souhaitez vérifier l'état (après une attente interminable), c'est pénible de devoir vous reconnecter.

Mark Stuart a reconnu le problème de délai d’expiration de la session :

> Je me souviens que vous aviez signalé que dans le passé, votre session expirait souvent et perturbait votre flux de développement pendant que vous basculiez entre votre IDE et developer.paypal.com ou votre tableau de bord marchand, puis vous reveniez et étiez à nouveau déconnecté.

**Résultat** : Les délais d'expiration des sessions sont toujours de 60 secondes. Le système de rapports continue de tomber en panne régulièrement.

### 2022 : Fonctionnalité API principale manquante (à nouveau) {#2022-core-api-feature-missing-again}

En janvier 2022, nous avons de nouveau signalé le problème de la liste des abonnements, cette fois avec encore plus de détails sur la façon dont leur documentation était erronée :

> Il n'existe pas de GET qui répertorie tous les abonnements (anciennement appelés accords de facturation)

Nous avons découvert que leur documentation officielle était complètement inexacte :

La documentation de l'API est également totalement inexacte. Nous pensions pouvoir contourner le problème en téléchargeant une liste d'identifiants d'abonnement codée en dur. Mais ça ne fonctionne même pas !

> D'après les documents officiels ici... Il est indiqué que vous pouvez le faire... Voici le hic : il n'y a aucun champ « ID d'abonnement » à cocher.

Christina Monti de PayPal a répondu :

> Veuillez nous excuser pour les frustrations causées par ces étapes erronées, nous corrigerons cela cette semaine.

Sri Shivananda (CTO) nous a remerciés :

Merci de votre aide continue pour nous améliorer. C'est très apprécié.

**Résultat** : La documentation n'a jamais été corrigée. Le point de terminaison de la liste d'abonnements n'a jamais été créé.

## Le cauchemar de l'expérience du développeur {#the-developer-experience-nightmare}

Utiliser les API de PayPal, c'est comme remonter dix ans en arrière. Voici les problèmes techniques que nous avons recensés :

### Interface utilisateur cassée {#broken-user-interface}

Le tableau de bord des développeurs PayPal est un désastre. Voici ce que nous gérons quotidiennement :

<figure>
<figcaption><div class="alert alert-danger small text-center">
L'interface utilisateur de PayPal est tellement défectueuse qu'on ne peut même pas ignorer les notifications.
</div></figcaption>
<video class="lazyframe-bordered" loading="lazy" controls>
<source src="/img/articles/pypl-notifications.mp4" type="video/mp4">
Votre navigateur ne prend pas en charge la balise vidéo.
</video>
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
Le tableau de bord du développeur vous oblige à déplacer un curseur, puis vous déconnecte au bout de 60 secondes.
</div></figcaption>
<video class="lazyframe-bordered" loading="lazy" controls>
<source src="/img/articles/pypl-kapture-1.mp4" type="video/mp4">
Votre navigateur ne prend pas en charge la balise vidéo.
</video>
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
D'autres problèmes d'interface utilisateur dans l'interface développeur PayPal montrent des flux de travail interrompus.
</div></figcaption>
<video class="lazyframe-bordered" loading="lazy" controls>
<source src="/img/articles/pypl-kapture-2.mp4" type="video/mp4">
Votre navigateur ne prend pas en charge la balise vidéo.
</video>
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
L'interface de gestion des abonnements est tellement mauvaise que nous avons dû nous fier au code pour générer les produits et les formules d'abonnement.
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-subscriptions.png" alt="PayPal subscriptions screenshot" class="rounded-lg" />
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
Aperçu de l'interface d'abonnement défectueuse, avec des fonctionnalités manquantes (créer des produits/abonnements/forfaits est difficile, et il ne semble pas y avoir de moyen de supprimer des produits ou des forfaits une fois créés dans l'interface utilisateur)
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-subscriptions-2.png" alt="PayPal subscriptions screenshot 2" class="rounded-lg" />
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
Messages d'erreur PayPal typiques : cryptiques et inutiles
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-errors.png" alt="PayPal API error screenshot" class="rounded-lg" />
</figure>

### Problèmes liés au SDK {#sdk-problems}

* Impossible de gérer à la fois les paiements uniques et les abonnements sans solutions de contournement complexes impliquant l'échange et le réaffichage des boutons lors du rechargement du SDK avec des balises de script.
* Le SDK JavaScript viole les conventions de base (noms de classe en minuscules, absence de vérification d'instance).
* Les messages d'erreur n'indiquent pas les champs manquants.
* Types de données incohérents (nécessitant des montants sous forme de chaîne au lieu de nombres).

### Violations de la politique de sécurité du contenu {#content-security-policy-violations}

Leur SDK nécessite unsafe-inline et unsafe-eval dans votre CSP, **vous obligeant à compromettre la sécurité de votre site**.

### Chaos de la documentation {#documentation-chaos}

Mark Stuart lui-même l'a admis :

> D'accord, il y a une quantité incroyable d'API anciennes et nouvelles. Il est vraiment difficile de trouver ce qu'il faut chercher (même pour nous qui travaillons ici).

### Vulnérabilités de sécurité {#security-vulnerabilities}

**L'implémentation de la 2FA par PayPal est rétrograde**. Même avec les applications TOTP activées, elles imposent la vérification par SMS, rendant les comptes vulnérables aux attaques par échange de carte SIM. Si vous avez activé TOTP, utilisez-le exclusivement. L'e-mail est la solution de secours, et non le SMS.

### Gestion de session en cas de catastrophe {#session-management-disaster}

**Leur tableau de bord développeur vous déconnecte après 60 secondes d'inactivité**. Essayez de faire quelque chose de productif et vous passez constamment par : connexion → captcha → 2FA → déconnexion → répéter. Vous utilisez un VPN ? Bonne chance.

## Juillet 2025 : La goutte d'eau qui fait déborder le vase {#july-2025-the-final-straw}

Après 11 ans de problèmes identiques, le point de rupture est survenu lors d'une migration de compte de routine. Nous avons dû migrer vers un nouveau compte PayPal correspondant au nom de notre entreprise, « Forward Email LLC », pour une comptabilité plus claire.

Ce qui aurait dû être simple s'est transformé en un désastre complet :

* Les premiers tests ont montré que tout fonctionnait correctement.
* Quelques heures plus tard, PayPal a soudainement bloqué tous les paiements d'abonnement sans préavis.
* Les clients ne pouvaient pas payer, ce qui a créé une confusion et alourdi la charge de travail du support.
* Le support PayPal a donné des réponses contradictoires, affirmant que les comptes avaient été vérifiés.
* Nous avons été contraints d'interrompre complètement les paiements PayPal.

<figure>
<figcaption><div class="alert alert-danger small text-center">
L'erreur rencontrée par les clients lors du paiement : aucune explication, aucun journal, rien.
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-something-went-wrong.png" alt="PayPal something went wrong error" class="rounded-lg" />
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
L'assistance PayPal affirme que tout va bien alors que les paiements sont complètement interrompus. Le dernier message indique qu'ils ont « restauré certaines fonctionnalités », mais demandent toujours des informations non spécifiées – un classique du support PayPal.
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-help-center-1.png" alt="PayPal help center screenshot 1" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-help-center-2.png" alt="PayPal help center screenshot 2" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-help-center-3.png" alt="PayPal help center screenshot 3" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-help-center-4.png" alt="PayPal help center screenshot 4" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-help-center-5.png" alt="PayPal help center screenshot 5" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-help-center-6.png" alt="PayPal help center screenshot 6" class="rounded-lg" />
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
Le processus de vérification d'identité qui n'a soi-disant rien « résolu »
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-take-care-1.png" alt="PayPal take care screenshot 1" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-take-care-2.png" alt="PayPal take care screenshot 2" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-take-care-3.png" alt="PayPal take care screenshot 3" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-take-care-4.png" alt="PayPal take care screenshot 4" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-take-care-5.png" alt="PayPal take care screenshot 5" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-take-care-6.png" alt="PayPal take care screenshot 6" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-take-care-7.png" alt="PayPal take care screenshot 7" class="rounded-lg" />
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
Message vague et toujours pas de résolution. Aucune information, aucun avis, ni aucune information complémentaire requise. Le support client reste silencieux.
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-restored.png" alt="PayPal restored screenshot" class="rounded-lg" />
</figure>

## Pourquoi nous ne pouvons pas simplement abandonner PayPal {#why-we-cant-just-drop-paypal}

Malgré tous ces problèmes, nous ne pouvons pas abandonner complètement PayPal, car certains clients n'ont que PayPal comme moyen de paiement. Comme l'a indiqué un client sur notre [page d'état](https://github.com/forwardemail/status.forwardemail.net/issues/1658#issuecomment-3026530515) :

> PayPal est ma seule option de paiement

**Nous sommes obligés de soutenir une plateforme défectueuse car PayPal a créé un monopole de paiement pour certains utilisateurs.**

## La solution de contournement de la communauté {#the-community-workaround}

Étant donné que PayPal ne propose pas de fonctionnalité de base pour la gestion des abonnements, la communauté des développeurs a trouvé des solutions de contournement. Nous avons créé un script pour gérer les abonnements PayPal : [set-active-pypl-subscription-ids.js](https://github.com/forwardemail/forwardemail.net/blob/master/scripts/set-active-pypl-subscription-ids.js).

Ce script référence un [l'essentiel de la communauté](https://gist.github.com/titanism/955f0c21d53e8c98068c549fb79e75d4) où les développeurs partagent leurs solutions. Les utilisateurs sont en réalité des [nous remercier](https://gist.github.com/titanism/955f0c21d53e8c98068c549fb79e75d4?permalink_comment_id=5045775#gistcomment-5045775) pour fournir ce que PayPal aurait dû créer il y a des années.

## Blocage des modèles PayPal en raison d'hameçonnage {#blocking-paypal-templates-due-to-phishing}

Les problèmes vont au-delà des API. Les modèles d'e-mails de PayPal sont si mal conçus que nous avons dû implémenter un filtrage spécifique dans notre service de messagerie, car ils sont impossibles à distinguer des tentatives d'hameçonnage.

### Le vrai problème : les modèles de PayPal ressemblent à des arnaques {#the-real-problem-paypals-templates-look-like-scams}

Nous recevons régulièrement des signalements d'e-mails PayPal qui ressemblent à s'y méprendre à des tentatives d'hameçonnage. Voici un exemple concret tiré de nos signalements d'abus :

**Objet :** `[Sandbox] TEST - New invoice from PaypalBilling434567 sandbox #A4D369E8-0001`

Cet e-mail a été transféré à `abuse@microsoft.com` car il semblait s'agir d'une tentative d'hameçonnage. Le problème ? Il provenait en réalité de l'environnement sandbox de PayPal, mais la conception de leur modèle est si médiocre qu'elle déclenche les systèmes de détection d'hameçonnage.

### Notre implémentation {#our-implementation}

Vous pouvez voir notre filtrage spécifique à PayPal implémenté dans notre [code de filtrage des e-mails](https://github.com/forwardemail/forwardemail.net/blob/3b45c70391b5b572b2568749d71be3f7198cd995/helpers/is-arbitrary.js#L151-L172) :

```javascript
// check for paypal scam (very strict until PayPal resolves phishing on their end)
// (seems to only come from "outlook.com" and "paypal.com" hosts)
//
// X-Email-Type-Id = RT000238
// PPC001017
// RT000542 = gift message hack
// RT002947 = paypal invoice spam
// <https://www.bleepingcomputer.com/news/security/beware-paypal-new-address-fraud/>
//
if (
  session.originalFromAddressRootDomain === 'paypal.com' &&
  headers.hasHeader('x-email-type-id') &&
  ['PPC001017', 'RT000238', 'RT000542', 'RT002947'].includes(
    headers.getFirst('x-email-type-id')
  )
) {
  const err = new SMTPError(
    'Due to ongoing PayPal invoice spam, you must manually send an invoice link'
  );
  err.isCodeBug = true; // alert admins for inspection
  throw err;
}
```

### Pourquoi nous avons dû bloquer PayPal {#why-we-had-to-block-paypal}

Nous avons mis en place cette mesure car PayPal refusait de corriger les problèmes massifs de spam, d'hameçonnage et de fraude malgré nos signalements répétés à ses équipes anti-abus. Voici les types d'e-mails que nous bloquons :

* **RT000238** - Notifications de factures suspectes
* **PPC001017** - Confirmations de paiement problématiques
* **RT000542** - Tentatives de piratage de messages cadeaux

### L'ampleur du problème {#the-scale-of-the-problem}

Nos journaux de filtrage du spam révèlent l'important volume de spams liés aux factures PayPal que nous traitons quotidiennement. Voici quelques exemples de sujets bloqués :

* « Facture de l'équipe de facturation PayPal : Ce montant sera automatiquement débité de votre compte. Veuillez nous contacter immédiatement au \[TÉLÉPHONE] »
* « Facture de \[NOM DE L'ENTREPRISE] (\[ID DE COMMANDE]) »
* Plusieurs variantes avec des numéros de téléphone différents et de faux numéros de commande

Ces e-mails proviennent souvent d'hôtes `outlook.com`, mais semblent provenir des systèmes PayPal légitimes, ce qui les rend particulièrement dangereux. Ils passent les authentifications SPF, DKIM et DMARC car ils sont envoyés via l'infrastructure PayPal.

Nos journaux techniques montrent que ces courriers indésirables contiennent des en-têtes PayPal légitimes :

* `X-Email-Type-Id: RT000238` (le même identifiant que celui bloqué)
* `From: "service@paypal.com" <service@paypal.com>`
* Signatures DKIM valides de `paypal.com`
* Enregistrements SPF corrects indiquant les serveurs de messagerie de PayPal

Cela crée une situation impossible : les e-mails PayPal légitimes et les spams ont tous deux des caractéristiques techniques identiques.

### L'ironie {#the-irony}

PayPal, une entreprise qui devrait être à la pointe de la lutte contre la fraude financière, utilise des modèles d'e-mails si mal conçus qu'ils déclenchent des systèmes anti-hameçonnage. Nous sommes contraints de bloquer les e-mails PayPal légitimes, car ils sont impossibles à distinguer des arnaques.

Ceci est documenté dans la recherche de sécurité : [Attention à la fraude à la nouvelle adresse PayPal](https://www.bleepingcomputer.com/news/security/beware-paypal-new-address-feature-abused-to-send-phishing-emails/) - montrant comment les propres systèmes de PayPal sont exploités à des fins de fraude.

### Impact réel : nouvelles escroqueries PayPal {#real-world-impact-novel-paypal-scams}

Le problème ne se limite pas à une conception défectueuse des modèles. Le système de facturation de PayPal est si facilement exploitable que des escrocs en abusent régulièrement pour envoyer des factures frauduleuses d'apparence légitime. Le chercheur en sécurité Gavin Anderegg a documenté l'incident [Une nouvelle arnaque PayPal](https://anderegg.ca/2023/02/01/a-novel-paypal-scam) où des escrocs envoient de véritables factures PayPal qui passent tous les contrôles d'authentification :

> « En examinant la source, l'e-mail semblait provenir de PayPal (SPF, DKIM et DMARC ont tous été validés). Le bouton renvoyait également à ce qui semblait être une URL PayPal légitime… Il m'a fallu une seconde pour comprendre qu'il s'agissait d'un e-mail légitime. Je venais de recevoir une « facture » aléatoire d'un escroc. »

<figure>
<figcaption><div class="alert alert-danger small text-center">
Capture d'écran montrant plusieurs factures PayPal frauduleuses inondant une boîte de réception, toutes semblant légitimes car elles proviennent en réalité des systèmes PayPal.
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-paypal-scam.png" alt="PayPal scam warning screenshot" class="rounded-lg" />
</figure>

Le chercheur a noté :

> « Cela semble également être une fonctionnalité pratique que PayPal devrait envisager de verrouiller. J'ai immédiatement pensé qu'il s'agissait d'une arnaque et je ne m'intéressais qu'aux détails techniques. Cela semble bien trop facile à mettre en œuvre, et je crains que d'autres ne s'y laissent prendre. »

Cela illustre parfaitement le problème : les systèmes légitimes de PayPal sont si mal conçus qu'ils permettent la fraude tout en rendant les communications légitimes suspectes.

Pour couronner le tout, cela a affecté notre capacité de livraison avec Yahoo, ce qui a entraîné des plaintes de clients et des heures de tests méticuleux et de vérification des modèles.

## Processus KYC rétrospectif de PayPal {#paypals-backwards-kyc-process}

L'un des aspects les plus frustrants de la plateforme PayPal est son approche rétrograde en matière de conformité et de procédures KYC (Know Your Customer). Contrairement à tous les autres processeurs de paiement, PayPal permet aux développeurs d'intégrer leurs API et de commencer à collecter les paiements en production avant même d'avoir effectué la vérification appropriée.

### Comment cela devrait fonctionner {#how-it-should-work}

Chaque processeur de paiement légitime suit cette séquence logique :

1. **Effectuez d'abord la vérification KYC**
2. **Approuvez le compte marchand**
3. **Fournissez l'accès à l'API de production**
4. **Autorisez l'encaissement**

Cela protège à la fois le processeur de paiement et le commerçant en garantissant la conformité avant tout changement d'argent.

### Comment fonctionne réellement PayPal {#how-paypal-actually-works}

Le processus de PayPal est complètement à l'envers :

1. **Fournir immédiatement un accès à l'API de production**
2. **Autoriser le recouvrement des paiements pendant des heures ou des jours**
3. **Bloquer les paiements soudainement et sans préavis**
4. **Exiger la documentation KYC alors que les clients sont déjà concernés**
5. **Ne pas notifier le commerçant**
6. **Laisser les clients découvrir le problème et le signaler**

### L'impact dans le monde réel {#the-real-world-impact}

Ce processus à rebours crée des catastrophes pour les entreprises :

* **Impossible pour les clients de finaliser leurs achats** pendant les périodes de forte activité
* **Aucun avertissement préalable** indiquant qu'une vérification est nécessaire
* **Aucune notification par e-mail** en cas de blocage des paiements
* **Les commerçants sont informés des problèmes grâce à des clients désorientés**
* **Perte de revenus** pendant les périodes critiques
* **Atteinte à la confiance des clients** en cas d'échec mystérieux des paiements

### Le désastre de la migration de compte de juillet 2025 {#the-july-2025-account-migration-disaster}

Ce scénario s'est produit lors de notre migration de compte de routine en juillet 2025. PayPal a initialement autorisé les paiements, puis les a soudainement bloqués sans notification. Nous n'avons découvert le problème que lorsque nos clients ont commencé à signaler des impossibilités de paiement.

Lorsque nous avons contacté le support, nous avons reçu des réponses contradictoires concernant les documents nécessaires, sans aucun délai précis pour la résolution du problème. Nous avons donc dû interrompre complètement les paiements PayPal, semant la confusion chez les clients qui n'avaient pas d'autres options de paiement.

### Pourquoi c'est important {#why-this-matters}

L'approche de PayPal en matière de conformité témoigne d'une méconnaissance fondamentale du fonctionnement des entreprises. Une KYC appropriée devrait intervenir **avant** l'intégration en production, et non après que les clients tentent déjà de payer. L'absence de communication proactive en cas de problème démontre la déconnexion de PayPal avec les besoins des commerçants.

Ce processus rétrograde est symptomatique des problèmes organisationnels plus larges de PayPal : ils privilégient leurs processus internes à l'expérience des commerçants et des clients, ce qui conduit au type de catastrophes opérationnelles qui éloignent les entreprises de leur plateforme.

## Comment tous les autres processeurs de paiement le font correctement {#how-every-other-payment-processor-does-it-right}

La fonctionnalité de liste d'abonnements, que PayPal refuse d'implémenter, est la norme dans le secteur depuis plus de dix ans. Voici comment d'autres processeurs de paiement gèrent cette exigence fondamentale :

### Bande {#stripe}

Stripe propose la liste des abonnements depuis le lancement de son API. Sa documentation explique clairement comment récupérer tous les abonnements d'un client ou d'un compte marchand. Il s'agit d'une fonctionnalité CRUD de base.

### Pagaie {#paddle}

Paddle propose des API complètes de gestion des abonnements, incluant le référencement, le filtrage et la pagination. L'entreprise comprend que les commerçants ont besoin de visualiser leurs flux de revenus récurrents.

### Coinbase Commerce {#coinbase-commerce}

Même les processeurs de paiement en crypto-monnaie comme Coinbase Commerce offrent une meilleure gestion des abonnements que PayPal.

### Carré {#square}

L'API de Square inclut la liste des abonnements comme une fonctionnalité fondamentale, et non comme une réflexion après coup.

### La norme de l'industrie {#the-industry-standard}

Chaque processeur de paiement moderne fournit :

* Liste de tous les abonnements
* Filtrer par statut, date, client
* Pagination pour les grands ensembles de données
* Notifications webhook pour les modifications d'abonnement
* Documentation complète avec exemples pratiques

### Ce que proposent les autres processeurs par rapport à PayPal {#what-other-processors-provide-vs-paypal}

**Stripe - Liste de tous les abonnements :**

```http
GET https://api.stripe.com/v1/subscriptions
Authorization: Bearer sk_test_...

Response:
{
  "object": "list",
  "data": [
    {
      "id": "sub_1MowQVLkdIwHu7ixeRlqHVzs",
      "object": "subscription",
      "status": "active",
      "customer": "cus_Na6dX7aXxi11N4",
      "current_period_start": 1679609767,
      "current_period_end": 1682288167
    }
  ],
  "has_more": false
}
```

**Stripe - Filtrer par client :**

```http
GET https://api.stripe.com/v1/subscriptions?customer=cus_Na6dX7aXxi11N4
```

**Stripe - Filtrer par statut :**

```http
GET https://api.stripe.com/v1/subscriptions?status=active
```

**PayPal - Ce que vous obtenez réellement :**

```http
GET https://api.paypal.com/v1/billing/subscriptions/{id}
Authorization: Bearer access_token

# You can ONLY get ONE subscription if you already know the ID
# There is NO endpoint to list all subscriptions
# There is NO way to search or filter
# You must track all subscription IDs yourself
```

**Points de terminaison disponibles de PayPal :**

* `POST /v1/billing/subscriptions` - Créer un abonnement
* `GET /v1/billing/subscriptions/{id}` - Obtenir UN abonnement (si vous connaissez l'identifiant)
* `PATCH /v1/billing/subscriptions/{id}` - Mettre à jour un abonnement
* `POST /v1/billing/subscriptions/{id}/cancel` - Annuler l'abonnement
* `POST /v1/billing/subscriptions/{id}/suspend` - Suspendre l'abonnement

**Ce qui manque à PayPal :**

* ❌ Pas de `GET /v1/billing/subscriptions` (liste complète)
* ❌ Pas de recherche
* ❌ Pas de filtrage par statut, client, date
* ❌ Pas de pagination

PayPal est le seul processeur de paiement majeur qui oblige les développeurs à suivre manuellement les identifiants d'abonnement dans leurs propres bases de données.

## La dissimulation systématique de PayPal : réduire au silence 6 millions de voix {#paypals-systematic-cover-up-silencing-6-million-voices}

Dans une démarche qui résume parfaitement l'approche de PayPal en matière de gestion des critiques, ils ont récemment mis hors ligne l'intégralité de leur forum communautaire, réduisant ainsi au silence plus de 6 millions de membres et effaçant des centaines de milliers de messages documentant leurs échecs.

### Le Grand Effacement {#the-great-erasure}

La communauté PayPal d'origine, située à l'adresse `paypal-community.com`, comptait **6 003 558 membres** et contenait des centaines de milliers de messages, de rapports de bugs, de plaintes et de discussions sur les défaillances de l'API PayPal. Cela représentait plus d'une décennie de preuves documentées des problèmes systématiques de PayPal.

Le 30 juin 2025, PayPal a discrètement mis hors ligne l'intégralité du forum. Tous les liens `paypal-community.com` renvoient désormais des erreurs 404. Il ne s'agit ni d'une migration ni d'une mise à niveau.

### Le sauvetage tiers {#the-third-party-rescue}

Heureusement, un service tiers, [ppl.lithium.com](https://ppl.lithium.com/), a conservé une partie du contenu, nous permettant ainsi d'accéder aux discussions que PayPal a tenté de masquer. Cependant, cette conservation est incomplète et pourrait disparaître à tout moment.

Cette pratique consistant à dissimuler des preuves n'est pas nouvelle pour PayPal. L'entreprise possède un historique documenté de :

* Suppression des rapports de bugs critiques de la vue publique
* Suppression des outils de développement sans préavis
* Modification des API sans documentation appropriée
* Réduction au silence des discussions communautaires sur leurs échecs

La suppression du forum représente la tentative la plus éhontée à ce jour visant à dissimuler leurs échecs systématiques à l’examen public.

## Le désastre du bogue de capture qui dure depuis 11 ans : 1 899 $ et ce n'est pas fini ! {#the-11-year-capture-bug-disaster-1899-and-counting}

Alors que PayPal s'activait à organiser des séances de feedback et à faire des promesses, son système de traitement des paiements est fondamentalement défaillant depuis plus de 11 ans. Le constat est accablant.

### Transférer la perte de 1 899 $ de l'e-mail {#forward-emails-1899-loss}

Dans nos systèmes de production, nous avons découvert 108 paiements PayPal, pour un total de **1 899 $**, perdus suite à des erreurs de capture PayPal. Ces paiements présentent une tendance constante :

* Des webhooks `CHECKOUT.ORDER.APPROVED` ont été reçus
* L'API de capture de PayPal a renvoyé des erreurs 404
* Les commandes sont devenues inaccessibles via l'API PayPal

Il est impossible de déterminer si les clients ont été facturés puisque PayPal masque complètement les journaux de débogage après 14 jours et efface toutes les données du tableau de bord pour les ID de commande qui n'ont pas été capturés.

Cela ne représente qu'une seule entreprise. **Les pertes cumulées de milliers de commerçants sur plus de 11 ans s'élèvent probablement à des millions de dollars.**

**Nous allons le répéter : les pertes collectives de milliers de commerçants sur plus de 11 ans s'élèvent probablement à des millions de dollars.**

La seule raison pour laquelle nous avons découvert cela est que nous sommes incroyablement méticuleux et axés sur les données.

### Le rapport original de 2013 : plus de 11 ans de négligence {#the-2013-original-report-11-years-of-negligence}

Le premier rapport documenté de ce problème précis apparaît sur [Stack Overflow en novembre 2013](https://stackoverflow.com/questions/19773755/keep-receiving-404-error-with-rest-api-when-doing-a-capture) ([archivé](https://web.archive.org/web/20250708045416/https://stackoverflow.com/questions/19773755/keep-receiving-404-error-with-rest-api-when-doing-a-capture)) :

> « Continuez à recevoir une erreur 404 avec l'API REST lors d'une capture »

L'erreur signalée en 2013 est **identique** à celle rencontrée par Forward Email en 2024 :

```json
{
  "name": "INVALID_RESOURCE_ID",
  "message": "The requested resource ID was not found",
  "information_link": "https://developer.paypal.com/webapps/developer/docs/api/#INVALID_RESOURCE_ID",
  "debug_id": "e56bae98dcc26"
}
```

La réponse de la communauté en 2013 a été révélatrice :

> « Un problème est actuellement signalé avec l'API REST. PayPal y travaille. »

**Plus de 11 ans plus tard, ils « y travaillent toujours ».**

### Admission 2016 : PayPal casse son propre SDK {#the-2016-admission-paypal-breaks-their-own-sdk}

En 2016, le dépôt GitHub de PayPal a documenté l'impact de [échecs de capture massifs](https://github.com/paypal/PayPal-PHP-SDK/issues/660) sur son SDK PHP officiel. L'ampleur du problème était stupéfiante :

Depuis le 20/09/2016, toutes les tentatives de capture PayPal échouent avec le message « INVALID_RESOURCE_ID - ID de ressource demandé introuvable ». Aucune modification n'a été apportée à l'intégration de l'API entre le 19 et le 20/09. **100 % des tentatives de capture depuis le 20/09 ont renvoyé cette erreur.**

Un commerçant a rapporté :

> « J'ai eu **plus de 1 400 tentatives de capture infructueuses au cours des dernières 24 heures**, toutes avec la réponse d'erreur INVALID_RESOURCE_ID. »

La première réaction de PayPal a été de blâmer le commerçant et de le renvoyer au support technique. Ce n'est qu'après une pression massive qu'il a finalement admis sa faute :

> « J'ai reçu une mise à jour de nos développeurs produits. Ils constatent que l'ID de demande PayPal contient 42 caractères dans les en-têtes envoyés, mais **il semble qu'un changement récent limite cet ID à 38 caractères.** »

Cet aveu révèle la négligence systématique de PayPal :

1. **Ils ont apporté des modifications non documentées et radicales**
2. **Ils ont corrompu leur propre SDK officiel**
3. **Ils ont d'abord blâmé les commerçants**
4. **Ils n'ont admis leur faute que sous la pression**

Même après avoir « résolu » le problème, les commerçants ont signalé :

> « J'ai mis à jour le SDK vers la version 1.7.4 et **le problème persiste.** »

### L'escalade de 2024 : toujours en panne {#the-2024-escalation-still-broken}

Des rapports récents de la communauté PayPal indiquent que le problème s'est aggravé. Un [Discussion de septembre 2024](https://ppl.lithium.com/t5/REST-APIs/Receiving-APPROVED-Webhooks-for-Order-but-capture-leads-to-404/td-p/3176093) ([archivé](https://web.archive.org/web/20250708045416/https://ppl.lithium.com/t5/REST-APIs/Receiving-APPROVED-Webhooks-for-Order-but-capture-leads-to-404/td-p/3176093)) signale exactement les mêmes problèmes :

> « Le problème n'apparaît qu'il y a environ deux semaines et ne concerne pas toutes les commandes. **Le problème le plus courant semble être l'erreur 404 lors de la capture.** »

Le commerçant décrit le même modèle que Forward Email :

> "Après avoir essayé de capturer la commande, PayPal renvoie une erreur 404. Lors de la récupération des détails de la commande : {'id': 'ID', 'intent': 'CAPTURE', 'status': 'COMPLETED', ..., 'final_capture': true, ...} **Ceci sans aucune trace d'une capture réussie de notre côté.**"

### Le désastre de la fiabilité des Webhooks {#the-webhook-reliability-disaster}

Un autre [discussion communautaire préservée](https://ppl.lithium.com/t5/REST-APIs/Not-received-PAYMENT-CAPTURE-COMPLETED-when-had-captured/m-p/3042446) révèle que le système de webhook de PayPal est fondamentalement peu fiable :

> « Théoriquement, il devrait y avoir deux événements (CHECKOUT.ORDER.APPROVED et PAYMENT.CAPTURE.COMPLETED) à partir de l'événement Webhook. En fait, **ces deux événements sont rarement reçus immédiatement, PAYMENT.CAPTURE.COMPLETED ne peut pas être reçu la plupart du temps ou serait reçu en quelques heures.** »

Pour les paiements d'abonnement :

> « **'PAIEMENT.VENTE.TERMINÉ' n'était pas reçu parfois ou jusqu'à quelques heures plus tard.** »

Les questions du commerçant révèlent la profondeur des problèmes de fiabilité de PayPal :

1. **« Pourquoi cela se produit-il ? »** - Le système de webhook de PayPal est fondamentalement défectueux.
2. **« Si le statut de la commande est « TERMINÉ », puis-je considérer que j'ai reçu l'argent ? »** - Les marchands ne peuvent pas se fier aux réponses de l'API de PayPal.
3. **« Pourquoi « Journaux d'événements ->Événements Webhook » ne trouve aucun journal ? »** - Même le système de journalisation de PayPal ne fonctionne pas.

### Le modèle de négligence systématique {#the-pattern-of-systematic-negligence}

Les preuves s'étendent sur plus de 11 ans et montrent une tendance claire :

* **2013** : « PayPal y travaille »
* **2016** : PayPal admet une modification majeure et fournit un correctif
* **2024** : Les mêmes erreurs se produisent toujours, affectant le transfert d'e-mails et bien d'autres services.

Il ne s'agit pas d'un bug - **il s'agit d'une négligence systématique.** PayPal est au courant de ces défaillances critiques dans le traitement des paiements depuis plus d'une décennie et a systématiquement :

1. **A blâmé les commerçants pour les bugs de PayPal**
2. **A apporté des modifications non documentées et non documentées**
3. **A fourni des correctifs inadéquats et inefficaces**
4. **A ignoré l'impact financier sur les entreprises**
5. **A dissimulé des preuves en fermant des forums communautaires**

### L'exigence non documentée {#the-undocumented-requirement}

Nulle part dans la documentation officielle de PayPal, il n'est mentionné que les commerçants doivent implémenter une logique de nouvelle tentative pour les opérations de capture. Leur documentation indique que les commerçants doivent « capturer immédiatement après approbation », mais omet de mentionner que leur API renvoie de manière aléatoire des erreurs 404 nécessitant des mécanismes de nouvelle tentative complexes.

Cela oblige chaque commerçant à :

* Implémenter une logique de relance avec un backoff exponentiel
* Gérer les livraisons de webhooks incohérentes
* Créer des systèmes complexes de gestion d'état
* Surveiller manuellement les captures échouées

**Tous les autres processeurs de paiement fournissent des API de capture fiables qui fonctionnent du premier coup.**

## Le modèle de tromperie plus large de PayPal {#paypals-broader-pattern-of-deception}

Le désastre du bug de capture n'est qu'un exemple de l'approche systématique de PayPal pour tromper les clients et cacher ses échecs.

### Action du Département des services financiers de New York {#the-new-york-department-of-financial-services-action}

En janvier 2025, le Département des services financiers de New York a émis un [action coercitive contre PayPal](https://www.dfs.ny.gov/system/files/documents/2025/01/ea20250123-paypal-inc.pdf) pour pratiques trompeuses, démontrant que le modèle de tromperie de PayPal s'étend bien au-delà de ses API.

Cette action réglementaire montre la volonté de PayPal de se livrer à des pratiques trompeuses dans l'ensemble de ses activités, et pas seulement dans ses outils de développement.

### Le procès Honey : réécriture des liens d'affiliation {#the-honey-lawsuit-rewriting-affiliate-links}

L'acquisition de Honey par PayPal a entraîné le vol de commissions de créateurs de contenu et d'influenceurs par [poursuites judiciaires alléguant que Honey réécrit les liens d'affiliation](https://www.theverge.com/2024/12/23/24328767/honey-paypal-lawsuit-affiliate-commission-influencer). Il s'agit d'une autre forme de tromperie systématique : PayPal tire profit de la réaffectation de revenus qui devraient revenir à d'autres.

Le schéma est clair :

1. **Défaillances d'API** : Masquer les fonctionnalités défectueuses, blâmer les commerçants
2. **Mise au silence de la communauté** : Supprimer les preuves de problèmes
3. **Violations réglementaires** : Pratiques trompeuses
4. **Vol d'affiliation** : Vol de commissions par manipulation technique

### Le coût de la négligence de PayPal {#the-cost-of-paypals-negligence}

La perte de 1 899 $ de Forward Email ne représente que la partie émergée de l'iceberg. Considérez l'impact plus large :

* **Commerçants individuels** : Des milliers de personnes perdent des centaines, voire des milliers de dollars chacun
* **Entreprises clientes** : Des millions de dollars de revenus potentiellement perdus
* **Temps de développement** : D'innombrables heures passées à trouver des solutions de contournement pour les API PayPal défectueuses
* **Confiance des clients** : Des entreprises perdent des clients à cause des échecs de paiement PayPal

Si un petit service de messagerie électronique perd près de 2 000 $, et que ce problème existe depuis plus de 11 ans et affecte des milliers de commerçants, les dommages financiers collectifs s'élèvent probablement à des **centaines de millions de dollars**.

### Le mensonge de la documentation {#the-documentation-lie}

La documentation officielle de PayPal omet systématiquement de mentionner les limitations et bugs critiques que les commerçants rencontreront. Par exemple :

* **API de capture** : Aucune mention du fait que les erreurs 404 sont courantes et nécessitent une logique de nouvelle tentative
* **Fiabilité des webhooks** : Aucune mention du fait que les webhooks sont souvent retardés de plusieurs heures
* **Liste des abonnements** : La documentation suggère que la liste est possible lorsqu'aucun point de terminaison n'existe
* **Délai d'expiration de session** : Aucune mention de délai d'expiration agressif de 60 secondes

Cette omission systématique d'informations critiques oblige les commerçants à découvrir les limites de PayPal par essais et erreurs dans les systèmes de production, ce qui entraîne souvent des pertes financières.

## Ce que cela signifie pour les développeurs {#what-this-means-for-developers}

L'incapacité systématique de PayPal à répondre aux besoins fondamentaux des développeurs tout en recueillant des retours approfondis témoigne d'un problème organisationnel fondamental. PayPal considère la collecte de retours comme un substitut à la résolution effective des problèmes.

Le schéma est clair :

1. Les développeurs signalent des problèmes
2. PayPal organise des séances de feedback avec les dirigeants
3. Un feedback approfondi est fourni
4. Les équipes reconnaissent les lacunes et promettent de les suivre et de les corriger
5. Rien n'est implémenté
6. Les dirigeants partent pour de meilleures entreprises
7. Les nouvelles équipes demandent le même feedback
8. Le cycle se répète

Pendant ce temps, les développeurs sont obligés de créer des solutions de contournement, de compromettre la sécurité et de gérer des interfaces utilisateur défectueuses juste pour accepter les paiements.

Si vous développez un système de paiement, tirez profit de notre expérience : créez votre [approche du trifecta](https://forwardemail.net/en/blog/docs/building-reliable-payment-system-stripe-paypal) avec plusieurs processeurs, mais ne vous attendez pas à ce que PayPal fournisse les fonctionnalités de base dont vous avez besoin. Prévoyez des solutions de contournement dès le départ.

Cet article présente nos 11 années d'expérience avec les API PayPal chez Forward Email. Tous les exemples de code et liens proviennent de nos systèmes de production. Malgré ces problèmes, nous continuons à prendre en charge les paiements PayPal, car certains clients n'ont pas d'autre choix.

<img loading="lazy" src="/img/articles/paypal-api-issues.webp" alt="PayPal API disaster illustration" class="rounded-lg" />