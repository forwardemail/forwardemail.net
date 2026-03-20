# La catastrophe API de PayPal sur 11 ans : comment nous avons construit des contournements pendant qu'ils ignoraient les développeurs {#paypals-11-year-api-disaster-how-we-built-workarounds-while-they-ignored-developers}

> \[!NOTE]
> **Succès ! PayPal a enfin ajouté le point de terminaison `GET /v1/billing/subscriptions`.**
>
> Après avoir publié cet article et l'avoir envoyé par email à la direction exécutive de PayPal, leurs équipes ont mis en place le point de terminaison tant attendu pour lister les abonnements. Le changement est apparu entre le [25 juin 2025](https://web.archive.org/web/20250625121019/https://developer.paypal.com/docs/api/subscriptions/v1/) et le [9 juillet 2025](https://web.archive.org/web/20250709102200/https://developer.paypal.com/docs/api/subscriptions/v1/).
>
> Cependant, à la manière typique de PayPal, ils ne nous ont jamais informés. Nous avons découvert cette mise à jour par nous-mêmes en décembre 2025, des mois après la sortie silencieuse de cette fonctionnalité.

<img loading="lazy" src="/img/articles/pypl-disaster.webp" alt="Illustration de la catastrophe API de PayPal" class="rounded-lg" />

<p class="lead mt-3">Chez Forward Email, nous gérons les API défaillantes de PayPal depuis plus d'une décennie. Ce qui a commencé comme de petites frustrations s'est transformé en une catastrophe complète qui nous a forcés à construire nos propres contournements, bloquer leurs modèles de phishing, et finalement suspendre tous les paiements PayPal lors d'une migration critique de compte.</p>
<p class="lead mt-3">Voici l'histoire de 11 années durant lesquelles PayPal a ignoré les besoins fondamentaux des développeurs pendant que nous faisions tout pour faire fonctionner leur plateforme.</p>


## Table des matières {#table-of-contents}

* [La pièce manquante : aucune façon de lister les abonnements](#the-missing-piece-no-way-to-list-subscriptions)
* [2014-2017 : le problème émerge](#2014-2017-the-problem-emerges)
* [2020 : nous leur donnons un retour détaillé](#2020-we-give-them-extensive-feedback)
  * [La liste de 27 points de retour](#the-27-item-feedback-list)
  * [Les équipes se sont impliquées, des promesses ont été faites](#teams-got-involved-promises-were-made)
  * [Le résultat ? Rien.](#the-result-nothing)
* [L'exode des cadres : comment PayPal a perdu toute mémoire institutionnelle](#the-executive-exodus-how-paypal-lost-all-institutional-memory)
* [2025 : nouvelle direction, mêmes problèmes](#2025-new-leadership-same-problems)
  * [Le nouveau PDG s'implique](#the-new-ceo-gets-involved)
  * [La réponse de Michelle Gill](#michelle-gills-response)
  * [Notre réponse : plus de réunions](#our-response-no-more-meetings)
  * [La réponse de Marty Brodbeck, sur-ingénierie](#marty-brodbecks-overengineering-response)
  * [La contradiction du "CRUD simple"](#the-simple-crud-contradiction)
  * [La déconnexion devient claire](#the-disconnect-becomes-clear)
* [Des années de rapports de bugs ignorés](#years-of-bug-reports-they-ignored)
  * [2016 : premières plaintes UI/UX](#2016-early-uiux-complaints)
  * [2021 : rapport de bug sur les emails professionnels](#2021-business-email-bug-report)
  * [2021 : suggestions d'amélioration de l'interface](#2021-ui-improvement-suggestions)
  * [2021 : échecs de l'environnement sandbox](#2021-sandbox-environment-failures)
  * [2021 : système de rapports complètement cassé](#2021-reports-system-completely-broken)
  * [2022 : fonctionnalité API centrale manquante (encore)](#2022-core-api-feature-missing-again)
* [Le cauchemar de l'expérience développeur](#the-developer-experience-nightmare)
  * [Interface utilisateur cassée](#broken-user-interface)
  * [Problèmes de SDK](#sdk-problems)
  * [Violations de la politique de sécurité du contenu](#content-security-policy-violations)
  * [Chaos dans la documentation](#documentation-chaos)
  * [Vulnérabilités de sécurité](#security-vulnerabilities)
  * [Désastre de la gestion des sessions](#session-management-disaster)
* [Juillet 2025 : la goutte d'eau](#july-2025-the-final-straw)
* [Pourquoi nous ne pouvons pas simplement abandonner PayPal](#why-we-cant-just-drop-paypal)
* [Le contournement communautaire](#the-community-workaround)
* [Blocage des modèles PayPal à cause du phishing](#blocking-paypal-templates-due-to-phishing)
  * [Le vrai problème : les modèles PayPal ressemblent à des arnaques](#the-real-problem-paypals-templates-look-like-scams)
  * [Notre mise en œuvre](#our-implementation)
  * [Pourquoi nous avons dû bloquer PayPal](#why-we-had-to-block-paypal)
  * [L'ampleur du problème](#the-scale-of-the-problem)
  * [L'ironie](#the-irony)
  * [Impact réel : nouvelles arnaques PayPal](#real-world-impact-novel-paypal-scams)
* [Le processus KYC à l'envers de PayPal](#paypals-backwards-kyc-process)
  * [Comment cela devrait fonctionner](#how-it-should-work)
  * [Comment PayPal fonctionne réellement](#how-paypal-actually-works)
  * [L'impact réel](#the-real-world-impact)
  * [La catastrophe de la migration de compte de juillet 2025](#the-july-2025-account-migration-disaster)
  * [Pourquoi c'est important](#why-this-matters)
* [Comment tous les autres processeurs de paiement font bien](#how-every-other-payment-processor-does-it-right)
  * [Stripe](#stripe)
  * [Paddle](#paddle)
  * [Coinbase Commerce](#coinbase-commerce)
  * [Square](#square)
  * [La norme de l'industrie](#the-industry-standard)
  * [Ce que les autres processeurs fournissent vs PayPal](#what-other-processors-provide-vs-paypal)
* [La dissimulation systématique de PayPal : faire taire 6 millions de voix](#paypals-systematic-cover-up-silencing-6-million-voices)
  * [La grande effacement](#the-great-erasure)
  * [Le sauvetage par un tiers](#the-third-party-rescue)
* [La catastrophe du bug de capture sur 11 ans : 1 899 $ et ça continue](#the-11-year-capture-bug-disaster-1899-and-counting)
  * [La perte de 1 899 $ de Forward Email](#forward-emails-1899-loss)
  * [Le rapport original de 2013 : plus de 11 ans de négligence](#the-2013-original-report-11-years-of-negligence)
  * [L'admission de 2016 : PayPal casse son propre SDK](#the-2016-admission-paypal-breaks-their-own-sdk)
  * [L'escalade de 2024 : toujours cassé](#the-2024-escalation-still-broken)
  * [La catastrophe de fiabilité des webhooks](#the-webhook-reliability-disaster)
  * [Le schéma de négligence systématique](#the-pattern-of-systematic-negligence)
  * [L'exigence non documentée](#the-undocumented-requirement)
* [Le schéma plus large de tromperie de PayPal](#paypals-broader-pattern-of-deception)
  * [L'action du Département des services financiers de New York](#the-new-york-department-of-financial-services-action)
  * [Le procès Honey : réécriture des liens affiliés](#the-honey-lawsuit-rewriting-affiliate-links)
  * [Le coût de la négligence de PayPal](#the-cost-of-paypals-negligence)
  * [Le mensonge de la documentation](#the-documentation-lie)
* [Ce que cela signifie pour les développeurs](#what-this-means-for-developers)
## La pièce manquante : aucune façon de lister les abonnements {#the-missing-piece-no-way-to-list-subscriptions}

Voici ce qui nous laisse sans voix : PayPal propose la facturation par abonnement depuis 2014, mais ils n'ont jamais fourni un moyen pour les commerçants de lister leurs propres abonnements.

Réfléchissez-y un instant. Vous pouvez créer des abonnements, vous pouvez les annuler si vous avez l'ID, mais vous ne pouvez pas obtenir une liste de tous les abonnements actifs pour votre compte. C'est comme avoir une base de données sans instruction SELECT.

Nous avons besoin de cela pour les opérations commerciales de base :

* Support client (lorsqu'une personne envoie un email pour demander des informations sur son abonnement)
* Reporting financier et rapprochement
* Gestion automatisée de la facturation
* Conformité et audit

Mais PayPal ? Ils ne l'ont tout simplement... jamais construit.


## 2014-2017 : le problème émerge {#2014-2017-the-problem-emerges}

Le problème de la liste des abonnements est apparu pour la première fois dans les forums communautaires de PayPal en 2017. Les développeurs posaient la question évidente : « Comment obtenir une liste de tous mes abonnements ? »

La réponse de PayPal ? Le silence radio.

Les membres de la communauté ont commencé à se frustrer :

> « Omission très étrange si un commerçant ne peut pas lister tous les accords actifs. Si l'ID de l'accord est perdu, cela signifie que seul l'utilisateur peut annuler ou suspendre un accord. » - leafspider

> « +1. Cela fait presque 3 ans. » - laudukang (signifiant que le problème existait depuis environ 2014)

Le [post original de la communauté](https://web.archive.org/web/20201019142512/https://www.paypal-community.com/t5/REST-API-SDK/List-all-subscriptions/td-p/1147066) de 2017 montre des développeurs suppliant pour cette fonctionnalité basique. La réponse de PayPal a été d’archiver le dépôt où les gens signalaient le problème.


## 2020 : nous leur donnons un retour détaillé {#2020-we-give-them-extensive-feedback}

En octobre 2020, PayPal nous a contactés pour une session formelle de feedback. Ce n'était pas une simple discussion informelle – ils ont organisé un appel Microsoft Teams de 45 minutes avec 8 cadres de PayPal, dont Sri Shivananda (CTO), Edwin Aoki, Jim Magats, John Kunze, et d'autres.

### La liste de feedback de 27 points {#the-27-item-feedback-list}

Nous étions préparés. Après 6 heures d’essais d’intégration avec leurs API, nous avions compilé 27 problèmes spécifiques. Mark Stuart de l’équipe PayPal Checkout a déclaré :

> Hey Nick, merci d’avoir partagé avec tout le monde aujourd’hui ! Je pense que cela sera le catalyseur pour obtenir plus de soutien et d’investissement pour notre équipe afin de corriger ces problèmes. Il a été difficile d’obtenir un retour aussi riche que celui que tu nous as laissé jusqu’à présent.

Le feedback n’était pas théorique – il venait de tentatives réelles d’intégration :

1. **La génération du token d’accès ne fonctionne pas** :

> La génération du token d’accès ne fonctionne pas. De plus, il devrait y avoir plus que des exemples en cURL.

2. **Pas d’interface web pour la création d’abonnements** :

> Comment diable peut-on créer des abonnements sans devoir le faire via cURL ? Il ne semble pas y avoir d’interface web pour cela (comme Stripe en propose une)

Mark Stuart a trouvé le problème du token d’accès particulièrement préoccupant :

> Nous n’entendons généralement pas parler de problèmes liés à la génération du token d’accès.

### Les équipes se sont impliquées, des promesses ont été faites {#teams-got-involved-promises-were-made}

Au fur et à mesure que nous découvrions plus de problèmes, PayPal a ajouté davantage d’équipes à la conversation. Darshan Raju de l’équipe de gestion de l’interface des abonnements a rejoint et a dit :

> Nous reconnaissons cette lacune. Nous allons suivre et résoudre cela. Merci encore pour votre retour !

La session a été décrite comme une :

> revue honnête de votre expérience

pour :

> faire de PayPal ce qu’il devrait être pour les développeurs.

### Le résultat ? Rien. {#the-result-nothing}

Malgré la session formelle de feedback, la liste détaillée de 27 points, l’implication de plusieurs équipes, et les promesses de :

> suivre et résoudre

les problèmes, absolument rien n’a été corrigé.


## L’exode des cadres : comment PayPal a perdu toute mémoire institutionnelle {#the-executive-exodus-how-paypal-lost-all-institutional-memory}

Voici où cela devient vraiment intéressant. Toutes les personnes qui ont reçu notre feedback en 2020 ont quitté PayPal :

**Changements de direction :**

* [Dan Schulman (CEO pendant 9 ans) → Alex Chriss](https://www.fastcompany.com/90938418/paypal-ceo-alex-chriss-dan-schulman-what-to-know/) (septembre 2023)
* [Sri Shivananda (CTO qui a organisé le feedback) → JPMorgan Chase](https://www.pymnts.com/personnel/2024/jpmorgan-names-paypal-vet-shivananda-as-new-tech-chief/) (janvier 2024)
**Leaders techniques qui ont fait des promesses, puis sont partis :**

* **Mark Stuart** (avait promis que les retours seraient un "catalyseur") → [Maintenant chez Ripple](https://www.linkedin.com/in/markstuartsf)
* **Jim Magats** (vétéran de PayPal depuis 18 ans) → [PDG de MX](https://www.cnbc.com/2022/07/28/paypal-veteran-jim-magats-is-named-ceo-of-mx-the-startup-that-connects-banks-and-fintech-players.html) (2022)
* **John Kunze** (VP Global Consumer Product) → [Retraité](https://www.linkedin.com/in/john-kunze-5724a86) (2023)
* **Edwin Aoki** (un des derniers restants) → [Vient de partir pour Nasdaq](https://www.linkedin.com/posts/edwinaoki_apparently-i-just-cant-stay-awaythe-day-activity-7289388518487793664-j8OZ) (janvier 2025)

PayPal est devenu une porte tournante où les cadres recueillent les retours des développeurs, font des promesses, puis partent pour de meilleures entreprises comme JPMorgan, Ripple et d'autres sociétés fintech.

Cela explique pourquoi la réponse au problème GitHub de 2025 semblait complètement déconnectée de nos retours de 2020 – littéralement tous ceux qui avaient reçu ces retours ont quitté PayPal.


## 2025 : Nouvelle direction, mêmes problèmes {#2025-new-leadership-same-problems}

Avançons jusqu'en 2025, et le même schéma exact réapparaît. Après des années sans progrès, la nouvelle direction de PayPal reprend contact.

### Le nouveau PDG s'implique {#the-new-ceo-gets-involved}

Le 30 juin 2025, nous avons directement contacté le nouveau PDG de PayPal, Alex Chriss. Sa réponse fut brève :

> Salut Nick – Merci de nous avoir contactés et pour les retours. Michelle (en copie) est en charge avec son équipe pour s'engager et travailler cela avec vous. Merci -A

### La réponse de Michelle Gill {#michelle-gills-response}

Michelle Gill, EVP et Directrice générale des Petites entreprises et Services financiers, a répondu :

> Merci beaucoup Nick, je mets Alex en copie cachée. Nous examinons cela depuis votre précédent message. Nous vous appellerons avant la fin de la semaine. Pouvez-vous m'envoyer vos coordonnées pour qu'un de mes collègues puisse vous contacter. Michelle

### Notre réponse : Plus de réunions {#our-response-no-more-meetings}

Nous avons refusé une autre réunion, expliquant notre frustration :

> Merci. Cependant, je ne pense pas qu'un appel va changer quoi que ce soit. Voici pourquoi... J'ai déjà participé à un appel par le passé et cela n'a mené à rien. J'ai perdu plus de 2 heures à parler avec toute l'équipe et la direction et rien n'a été fait... Des tonnes d'e-mails échangés. Absolument rien de fait. Les retours n'ont abouti à rien. J'ai essayé pendant des années, on m'a écouté, puis ça n'a rien donné.

### La réponse de Marty Brodbeck, trop complexe {#marty-brodbecks-overengineering-response}

Puis Marty Brodbeck, responsable de l'ingénierie grand public chez PayPal, a pris contact :

> Salut Nick, ici Marty Brodbeck. Je dirige toute l'ingénierie grand public chez PayPal et j'ai piloté le développement de l'API pour la société. Peux-tu me parler du problème que tu rencontres et comment nous pourrions aider.

Quand nous avons expliqué le besoin simple d'un point de terminaison listant les abonnements, sa réponse a révélé le problème exact :

> Merci Nick, nous sommes en train de créer une API unique pour les abonnements avec un SDK complet (prise en charge complète de la gestion des erreurs, suivi des abonnements basé sur les événements, disponibilité robuste) où la facturation est également séparée en une API distincte pour que les commerçants y accèdent plutôt que d'avoir à orchestrer plusieurs points de terminaison pour obtenir une seule réponse.

C'est exactement la mauvaise approche. Nous n'avons pas besoin de mois d'architecture complexe. Nous avons besoin d'un point de terminaison REST simple qui liste les abonnements – quelque chose qui aurait dû exister depuis 2014.

```http
GET /v1/billing/subscriptions
Authorization: Bearer {access_token}
```

### La contradiction du "CRUD simple" {#the-simple-crud-contradiction}

Lorsque nous avons souligné qu'il s'agissait d'une fonctionnalité CRUD basique qui aurait dû exister depuis 2014, la réponse de Marty était révélatrice :

> Les opérations CRUD simples font partie de l'API principale mon ami, donc cela ne prendra pas des mois de développement

Le SDK TypeScript de PayPal, qui ne supporte actuellement que trois points de terminaison après des mois de développement, ainsi que sa chronologie historique, démontrent clairement que de tels projets nécessitent plus que quelques mois pour être achevés.
Cette réponse montre qu'il ne comprend pas sa propre API. Si « les opérations CRUD simples font partie de l'API principale », alors où est le point de terminaison pour la liste des abonnements ? Nous avons répondu :

> Si « les opérations CRUD simples font partie de l'API principale », alors où est le point de terminaison pour la liste des abonnements ? Les développeurs demandent cette « opération CRUD simple » depuis 2014. Cela fait 11 ans. Tous les autres processeurs de paiement disposent de cette fonctionnalité de base depuis le premier jour.

### Le décalage devient clair {#the-disconnect-becomes-clear}

Les échanges de 2025 avec Alex Chriss, Michelle Gill et Marty Brodbeck montrent la même dysfonction organisationnelle :

1. **La nouvelle direction n'a aucune connaissance des sessions de retour d'expérience précédentes**
2. **Ils proposent les mêmes solutions surconçues**
3. **Ils ne comprennent pas les limites de leur propre API**
4. **Ils veulent plus de réunions au lieu de simplement résoudre le problème**

Ce schéma explique pourquoi les équipes PayPal en 2025 semblent complètement déconnectées des nombreux retours fournis en 2020 – les personnes qui ont reçu ces retours sont parties, et la nouvelle direction répète les mêmes erreurs.


## Des années de rapports de bugs ignorés {#years-of-bug-reports-they-ignored}

Nous ne nous sommes pas contentés de nous plaindre des fonctionnalités manquantes. Nous avons activement signalé des bugs et essayé de les aider à s'améliorer. Voici une chronologie complète des problèmes que nous avons documentés :

### 2016 : Premières plaintes sur l'interface utilisateur/expérience utilisateur {#2016-early-uiux-complaints}

Déjà en 2016, nous contactions publiquement la direction de PayPal, y compris Dan Schulman, au sujet des problèmes d'interface et d'ergonomie. Cela fait 9 ans, et les mêmes problèmes d'interface persistent aujourd'hui.

### 2021 : Rapport de bug sur l'email professionnel {#2021-business-email-bug-report}

En mars 2021, nous avons signalé que le système d'email professionnel de PayPal envoyait des notifications d'annulation incorrectes. Le modèle d'email contenait des variables mal rendues, affichant des messages confus aux clients.

Mark Stuart a reconnu le problème :

> Merci Nick ! Passage en copie cachée. @Prasy, ton équipe est-elle responsable de cet e-mail ou sais-tu qui l'est ? Le message « Niftylettuce, LLC, nous ne vous facturerons plus » me fait penser qu'il y a une confusion sur le destinataire et le contenu de l'e-mail.

**Résultat** : Ils ont effectivement corrigé celui-ci ! Mark Stuart a confirmé :

> Je viens d'avoir des nouvelles de l'équipe notifications : le modèle d'e-mail a été corrigé et déployé. Merci d'avoir pris le temps de le signaler. Merci !

Cela montre qu'ils PEUVENT corriger les choses quand ils le veulent – ils choisissent juste de ne pas le faire pour la plupart des problèmes.

### 2021 : Suggestions d'amélioration de l'interface utilisateur {#2021-ui-improvement-suggestions}

En février 2021, nous avons fourni des retours détaillés sur l'interface de leur tableau de bord, notamment la section « Activité récente PayPal » :

> Je pense que le tableau de bord sur paypal.com, en particulier la section « Activité récente PayPal », doit être amélioré. Je ne pense pas que vous devriez afficher les lignes de statut « Créé » pour les paiements récurrents à 0 $ – cela ajoute beaucoup de lignes inutiles et on ne peut pas voir d'un coup d'œil combien de revenus sont générés pour la journée/les derniers jours.

Mark Stuart l'a transmis à l'équipe produits consommateurs :

> Merci ! Je ne sais pas quelle équipe est responsable de l'Activité, mais je l'ai transmis au responsable des produits consommateurs pour trouver la bonne équipe. Un paiement récurrent à 0,00 $ semble être un bug. Il devrait probablement être filtré.

**Résultat** : Jamais corrigé. L'interface affiche toujours ces entrées inutiles à 0 $.

### 2021 : Échecs de l'environnement Sandbox {#2021-sandbox-environment-failures}

En novembre 2021, nous avons signalé des problèmes critiques avec l'environnement sandbox de PayPal :

* Les clés API secrètes sandbox étaient modifiées et désactivées aléatoirement
* Tous les comptes test sandbox ont été supprimés sans préavis
* Messages d'erreur lors de la consultation des détails des comptes sandbox
* Échecs intermittents de chargement

> Pour une raison quelconque, ma clé API secrète sandbox a été modifiée et désactivée. De plus, tous mes anciens comptes test Sandbox ont été supprimés.

> Parfois ils chargent, parfois non aussi. C'est incroyablement frustrant.

**Résultat** : Pas de réponse, pas de correction. Les développeurs rencontrent toujours des problèmes de fiabilité du sandbox.

### 2021 : Système de rapports complètement cassé {#2021-reports-system-completely-broken}
En mai 2021, nous avons signalé que le système de téléchargement des rapports de transactions de PayPal était complètement cassé :

> Il semble que les téléchargements des rapports ne fonctionnent pas en ce moment et ne fonctionnent pas depuis toute la journée. Il faudrait aussi probablement recevoir une notification par email en cas d’échec.

Nous avons également souligné le désastre de la gestion des sessions :

> De plus, si vous êtes inactif pendant environ 5 minutes en étant connecté à PayPal, vous êtes déconnecté. Donc, lorsque vous actualisez à nouveau le bouton à côté du rapport dont vous voulez vérifier le statut (après avoir attendu une éternité), c’est pénible de devoir se reconnecter.

Mark Stuart a reconnu le problème de timeout de session :

> Je me souviens que vous aviez signalé cela auparavant avec votre session qui expirait souvent et perturbait votre flux de développement lorsque vous passiez entre votre IDE et developer.paypal.com ou votre tableau de bord marchand, puis vous reveniez et étiez de nouveau déconnecté.

**Résultat** : Les délais d’expiration des sessions sont toujours de 60 secondes. Le système de rapports échoue toujours régulièrement.

### 2022 : Fonctionnalité principale de l’API manquante (encore) {#2022-core-api-feature-missing-again}

En janvier 2022, nous avons de nouveau remonté le problème de la liste des abonnements, cette fois avec encore plus de détails sur l’inexactitude de leur documentation :

> Il n’existe pas de GET qui liste tous les abonnements (anciennement appelés accords de facturation)

Nous avons découvert que leur documentation officielle était complètement inexacte :

> La documentation de l’API est aussi totalement inexacte. Nous pensions pouvoir faire un contournement en téléchargeant une liste codée en dur des ID d’abonnement. Mais cela ne fonctionne même pas !

> D’après la documentation officielle ici... Il est dit que vous pouvez faire cela... Voici le hic - il n’y a pas du tout de champ "ID d’abonnement" à trouver pour le cocher.

Christina Monti de PayPal a répondu :

> Nous nous excusons pour les frustrations causées par ces étapes erronées, nous allons corriger cela cette semaine.

Sri Shivananda (CTO) nous a remerciés :

> Merci pour votre aide continue qui nous permet de nous améliorer. Très apprécié.

**Résultat** : La documentation n’a jamais été corrigée. Le point de terminaison pour la liste des abonnements n’a jamais été créé.


## Le cauchemar de l’expérience développeur {#the-developer-experience-nightmare}

Travailler avec les API de PayPal, c’est comme remonter 10 ans en arrière. Voici les problèmes techniques que nous avons documentés :

### Interface utilisateur cassée {#broken-user-interface}

Le tableau de bord développeur de PayPal est un désastre. Voici ce que nous devons gérer au quotidien :

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  L’interface de PayPal est tellement cassée que vous ne pouvez même pas fermer les notifications
  </div></figcaption>
  <video class="lazyframe-bordered" loading="lazy" controls>
    <source src="/img/articles/pypl-notifications.mp4" type="video/mp4">
    Your browser does not support the video tag.
  </video>
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Le tableau de bord développeur vous fait littéralement faire glisser un curseur puis vous déconnecte après 60 secondes
  </div></figcaption>
  <video class="lazyframe-bordered" loading="lazy" controls>
    <source src="/img/articles/pypl-kapture-1.mp4" type="video/mp4">
    Your browser does not support the video tag.
  </video>
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Plus de désastres UI dans l’interface développeur PayPal montrant des flux de travail cassés
  </div></figcaption>
  <video class="lazyframe-bordered" loading="lazy" controls>
    <source src="/img/articles/pypl-kapture-2.mp4" type="video/mp4">
    Your browser does not support the video tag.
  </video>
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  L’interface de gestion des abonnements - l’interface est tellement mauvaise que nous avons dû nous appuyer sur du code pour générer des produits et des plans d’abonnement
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-subscriptions.png" alt="Capture d’écran des abonnements PayPal" class="rounded-lg" />
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Une vue de l’interface d’abonnement cassée avec des fonctionnalités manquantes (vous ne pouvez pas facilement créer des produits/plans/abonnements – et il ne semble pas y avoir de moyen du tout pour supprimer des produits ni des plans une fois créés dans l’interface)
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-subscriptions-2.png" alt="Capture d’écran des abonnements PayPal 2" class="rounded-lg" />
</figure>
<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Messages d'erreur typiques de PayPal - cryptiques et peu utiles
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-errors.png" alt="PayPal API error screenshot" class="rounded-lg" />
</figure>

### Problèmes du SDK {#sdk-problems}

* Ne peut pas gérer à la fois les paiements uniques et les abonnements sans solutions complexes impliquant l'échange et le rechargement des boutons tout en rechargeant le SDK avec des balises script
* Le SDK JavaScript viole les conventions de base (noms de classes en minuscules, pas de vérification d'instance)
* Les messages d'erreur n'indiquent pas quels champs sont manquants
* Types de données incohérents (exigeant des montants sous forme de chaînes au lieu de nombres)

### Violations de la politique de sécurité du contenu {#content-security-policy-violations}

Leur SDK nécessite unsafe-inline et unsafe-eval dans votre CSP, **vous forçant à compromettre la sécurité de votre site**.

### Chaos dans la documentation {#documentation-chaos}

Mark Stuart lui-même a admis :

> D'accord qu'il y a une quantité absurde d'API anciennes et nouvelles. Vraiment difficile de trouver ce qu'on cherche (même pour nous qui travaillons ici).

### Vulnérabilités de sécurité {#security-vulnerabilities}

**L'implémentation 2FA de PayPal est à l'envers**. Même avec les applications TOTP activées, ils imposent la vérification par SMS - rendant les comptes vulnérables aux attaques de swap de SIM. Si vous avez activé le TOTP, il devrait être utilisé exclusivement. Le repli devrait être l'email, pas le SMS.

### Désastre de gestion de session {#session-management-disaster}

**Leur tableau de bord développeur vous déconnecte après 60 secondes d'inactivité**. Essayez de faire quoi que ce soit de productif et vous passez constamment par : connexion → captcha → 2FA → déconnexion → répétition. Vous utilisez un VPN ? Bonne chance.


## Juillet 2025 : La goutte d'eau qui fait déborder le vase {#july-2025-the-final-straw}

Après 11 ans des mêmes problèmes, le point de rupture est survenu lors d'une migration de compte de routine. Nous devions passer à un nouveau compte PayPal pour correspondre au nom de notre entreprise "Forward Email LLC" pour une comptabilité plus claire.

Ce qui aurait dû être simple s'est transformé en un désastre complet :

* Les tests initiaux ont montré que tout fonctionnait correctement
* Quelques heures plus tard, PayPal a soudainement bloqué tous les paiements d'abonnement sans préavis
* Les clients ne pouvaient pas payer, créant confusion et surcharge du support
* Le support PayPal a donné des réponses contradictoires affirmant que les comptes étaient vérifiés
* Nous avons été forcés d'arrêter complètement les paiements PayPal

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  L'erreur que les clients voyaient en essayant de payer - aucune explication, aucun journal, rien
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-something-went-wrong.png" alt="PayPal something went wrong error" class="rounded-lg" />
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Le support PayPal affirmant que tout allait bien alors que les paiements étaient complètement cassés. Le message final montre qu'ils disent avoir "restauré certaines fonctionnalités" mais demandent encore plus d'informations non spécifiées - théâtre classique du support PayPal
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
  Le processus de vérification d'identité qui soi-disant "n'a rien réparé"
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
  Message vague et toujours pas de résolution. Zéro information, avis, ou quoi que ce soit sur les informations supplémentaires requises. Le support client reste silencieux.
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-restored.png" alt="Capture d'écran PayPal restauré" class="rounded-lg" />
</figure>


## Pourquoi nous ne pouvons pas simplement abandonner PayPal {#why-we-cant-just-drop-paypal}

Malgré tous ces problèmes, nous ne pouvons pas complètement abandonner PayPal car certains clients n'ont que PayPal comme option de paiement. Comme un client l'a dit sur notre [page de statut](https://github.com/forwardemail/status.forwardemail.net/issues/1658#issuecomment-3026530515) :

> PayPal est ma seule option de paiement

**Nous sommes obligés de supporter une plateforme défaillante parce que PayPal a créé un monopole de paiement pour certains utilisateurs.**


## La solution de contournement communautaire {#the-community-workaround}

Puisque PayPal ne fournit pas de fonctionnalité basique de liste d’abonnements, la communauté des développeurs a créé des solutions de contournement. Nous avons créé un script qui aide à gérer les abonnements PayPal : [set-active-pypl-subscription-ids.js](https://github.com/forwardemail/forwardemail.net/blob/master/scripts/set-active-pypl-subscription-ids.js)

Ce script fait référence à un [gist communautaire](https://gist.github.com/titanism/955f0c21d53e8c98068c549fb79e75d4) où les développeurs partagent des solutions. Les utilisateurs nous [remercient en fait](https://gist.github.com/titanism/955f0c21d53e8c98068c549fb79e75d4?permalink_comment_id=5045775#gistcomment-5045775) pour fournir ce que PayPal aurait dû construire il y a des années.


## Blocage des modèles PayPal à cause du phishing {#blocking-paypal-templates-due-to-phishing}

Les problèmes vont au-delà des API. Les modèles d’emails de PayPal sont tellement mal conçus que nous avons dû mettre en place un filtrage spécifique dans notre service de messagerie car ils sont indiscernables des tentatives de phishing.

### Le vrai problème : les modèles PayPal ressemblent à des arnaques {#the-real-problem-paypals-templates-look-like-scams}

Nous recevons régulièrement des signalements d’emails PayPal qui ressemblent exactement à des tentatives de phishing. Voici un exemple réel issu de nos rapports d’abus :

**Objet :** `[Sandbox] TEST - Nouvelle facture de PaypalBilling434567 sandbox #A4D369E8-0001`

Cet email a été transféré à `abuse@microsoft.com` car il semblait être une tentative de phishing. Le problème ? Il provenait en réalité de l’environnement sandbox de PayPal, mais leur design de modèle est si mauvais qu’il déclenche les systèmes de détection de phishing.

### Notre implémentation {#our-implementation}

Vous pouvez voir notre filtrage spécifique à PayPal implémenté dans notre [code de filtrage d’emails](https://github.com/forwardemail/forwardemail.net/blob/3b45c70391b5b572b2568749d71be3f7198cd995/helpers/is-arbitrary.js#L151-L172) :

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
    'En raison du spam massif de factures PayPal, vous devez envoyer manuellement un lien de facture'
  );
  err.isCodeBug = true; // alerter les administrateurs pour inspection
  throw err;
}
```

### Pourquoi nous avons dû bloquer PayPal {#why-we-had-to-block-paypal}

Nous avons mis cela en place parce que PayPal a refusé de corriger les problèmes massifs de spam/phishing/fraude malgré nos signalements répétés à leurs équipes d’abus. Les types d’emails spécifiques que nous bloquons incluent :

* **RT000238** - Notifications de factures suspectes
* **PPC001017** - Confirmations de paiement problématiques
* **RT000542** - Tentatives de piratage de message cadeau

### L’ampleur du problème {#the-scale-of-the-problem}

Nos journaux de filtrage anti-spam montrent le volume massif de spam de factures PayPal que nous traitons quotidiennement. Exemples de sujets bloqués incluent :

* "Facture de l’équipe de facturation PayPal : - Ce montant sera débité automatiquement de votre compte. Veuillez nous contacter immédiatement au \[PHONE]"
* "Facture de \[NOM DE L’ENTREPRISE] (\[ORDER-ID])"
* Plusieurs variantes avec différents numéros de téléphone et faux identifiants de commande
Ces e-mails proviennent souvent d'hôtes `outlook.com` mais semblent provenir des systèmes légitimes de PayPal, ce qui les rend particulièrement dangereux. Les e-mails passent l'authentification SPF, DKIM et DMARC car ils sont envoyés via l'infrastructure réelle de PayPal.

Nos journaux techniques montrent que ces e-mails de spam contiennent des en-têtes PayPal légitimes :

* `X-Email-Type-Id: RT000238` (le même ID que nous bloquons)
* `From: "service@paypal.com" <service@paypal.com>`
* Signatures DKIM valides de `paypal.com`
* Enregistrements SPF appropriés montrant les serveurs mail de PayPal

Cela crée une situation impossible : les e-mails légitimes de PayPal et les spams ont tous deux des caractéristiques techniques identiques.

### L'Ironie {#the-irony}

PayPal, une entreprise qui devrait être en première ligne dans la lutte contre la fraude financière, a des modèles d'e-mails si mal conçus qu'ils déclenchent les systèmes anti-phishing. Nous sommes contraints de bloquer des e-mails légitimes de PayPal car ils sont indiscernables des arnaques.

Cela est documenté dans des recherches en sécurité : [Attention à la nouvelle fraude d'adresse PayPal](https://www.bleepingcomputer.com/news/security/beware-paypal-new-address-feature-abused-to-send-phishing-emails/) - montrant comment les propres systèmes de PayPal sont exploités pour la fraude.

### Impact dans le monde réel : Nouvelles arnaques PayPal {#real-world-impact-novel-paypal-scams}

Le problème va au-delà d’un simple mauvais design de modèle. Le système de facturation de PayPal est tellement facilement exploitable que les escrocs l’utilisent régulièrement pour envoyer des factures frauduleuses à l’apparence légitime. Le chercheur en sécurité Gavin Anderegg a documenté [Une nouvelle arnaque PayPal](https://anderegg.ca/2023/02/01/a-novel-paypal-scam) où les escrocs envoient de vraies factures PayPal qui passent toutes les vérifications d’authentification :

> « En inspectant la source, l’e-mail semblait réellement provenir de PayPal (SPF, DKIM et DMARC tous validés). Le bouton pointait aussi vers ce qui semblait être une URL PayPal légitime... Il m’a fallu un moment pour réaliser que c’était un e-mail légitime. Je venais de recevoir une 'facture' aléatoire d’un escroc. »

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Capture d’écran montrant plusieurs factures PayPal frauduleuses inondant une boîte de réception, toutes semblant légitimes car elles proviennent réellement des systèmes de PayPal
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-paypal-scam.png" alt="Capture d'écran d'avertissement d'arnaque PayPal" class="rounded-lg" />
</figure>

Le chercheur a noté :

> « Cela semble aussi être une fonctionnalité de commodité que PayPal devrait envisager de verrouiller. J’ai immédiatement supposé qu’il s’agissait d’une forme d’arnaque et je ne m’intéressais qu’aux détails techniques. Cela semble beaucoup trop facile à réaliser, et je crains que d’autres ne se fassent avoir. »

Cela illustre parfaitement le problème : les propres systèmes légitimes de PayPal sont si mal conçus qu’ils permettent la fraude tout en rendant les communications légitimes suspectes.

Pour aggraver les choses, cela a affecté notre délivrabilité avec Yahoo, entraînant des plaintes clients et des heures de tests minutieux et d’analyse de motifs.


## Le processus KYC à l’envers de PayPal {#paypals-backwards-kyc-process}

Un des aspects les plus frustrants de la plateforme PayPal est leur approche à l’envers de la conformité et des procédures Know Your Customer (KYC). Contrairement à tous les autres processeurs de paiement, PayPal permet aux développeurs d’intégrer leurs API et de commencer à collecter des paiements en production avant d’avoir complété la vérification appropriée.

### Comment cela devrait fonctionner {#how-it-should-work}

Chaque processeur de paiement légitime suit cette séquence logique :

1. **Compléter d’abord la vérification KYC**
2. **Approuver le compte marchand**
3. **Fournir l’accès API en production**
4. **Permettre la collecte des paiements**

Cela protège à la fois le processeur de paiement et le marchand en assurant la conformité avant tout échange d’argent.

### Comment PayPal fonctionne réellement {#how-paypal-actually-works}

Le processus de PayPal est complètement à l’envers :

1. **Fournir immédiatement l’accès API en production**
2. **Permettre la collecte des paiements pendant des heures ou des jours**
3. **Bloquer soudainement les paiements sans préavis**
4. **Exiger les documents KYC après que les clients soient déjà impactés**
5. **Ne fournir aucune notification au marchand**
6. **Laisser les clients découvrir le problème et le signaler**
### L'Impact Réel {#the-real-world-impact}

Ce processus à l'envers crée des désastres pour les entreprises :

* **Les clients ne peuvent pas finaliser leurs achats** pendant les périodes de vente de pointe
* **Aucun avertissement préalable** que la vérification est nécessaire
* **Aucune notification par email** lorsque les paiements sont bloqués
* **Les commerçants apprennent les problèmes par des clients confus**
* **Perte de revenus** pendant des périodes commerciales critiques
* **Atteinte à la confiance des clients** lorsque les paiements échouent mystérieusement

### Le Désastre de la Migration de Compte de Juillet 2025 {#the-july-2025-account-migration-disaster}

Ce scénario exact s'est produit lors de notre migration de compte de routine en juillet 2025. PayPal a d'abord autorisé les paiements, puis les a soudainement bloqués sans aucune notification. Nous n'avons découvert le problème que lorsque les clients ont commencé à signaler qu'ils ne pouvaient pas payer.

Lorsque nous avons contacté le support, nous avons reçu des réponses contradictoires sur les documents nécessaires, sans calendrier clair pour la résolution. Cela nous a forcés à arrêter complètement les paiements PayPal, ce qui a déconcerté les clients qui n'avaient pas d'autres options de paiement.

### Pourquoi Cela Compte {#why-this-matters}

L'approche de PayPal en matière de conformité montre une incompréhension fondamentale du fonctionnement des entreprises. Une KYC appropriée devrait avoir lieu **avant** l'intégration en production, pas après que les clients essaient déjà de payer. Le manque de communication proactive lorsque des problèmes surviennent démontre la déconnexion de PayPal avec les besoins des commerçants.

Ce processus à l'envers est symptomatique des problèmes organisationnels plus larges de PayPal : ils privilégient leurs processus internes au détriment de l'expérience des commerçants et des clients, conduisant à des désastres opérationnels qui éloignent les entreprises de leur plateforme.


## Comment Tous les Autres Processeurs de Paiement Font Correctement {#how-every-other-payment-processor-does-it-right}

La fonctionnalité de listing des abonnements que PayPal refuse d'implémenter est standard dans l'industrie depuis plus d'une décennie. Voici comment les autres processeurs de paiement gèrent cette exigence basique :

### Stripe {#stripe}

Stripe propose le listing des abonnements depuis le lancement de leur API. Leur documentation montre clairement comment récupérer tous les abonnements pour un client ou un compte commerçant. Ceci est considéré comme une fonctionnalité CRUD basique.

### Paddle {#paddle}

Paddle fournit des API complètes de gestion des abonnements incluant listing, filtrage et pagination. Ils comprennent que les commerçants ont besoin de voir leurs flux de revenus récurrents.

### Coinbase Commerce {#coinbase-commerce}

Même les processeurs de paiement en cryptomonnaies comme Coinbase Commerce offrent une meilleure gestion des abonnements que PayPal.

### Square {#square}

L'API de Square inclut le listing des abonnements comme une fonctionnalité fondamentale, pas une réflexion après coup.

### La Norme de l'Industrie {#the-industry-standard}

Chaque processeur de paiement moderne fournit :

* Liste de tous les abonnements
* Filtrage par statut, date, client
* Pagination pour les grands ensembles de données
* Notifications webhook pour les changements d'abonnement
* Documentation complète avec des exemples fonctionnels

### Ce Que Fournissent les Autres Processeurs vs PayPal {#what-other-processors-provide-vs-paypal}

**Stripe - Lister Tous les Abonnements :**

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

**Stripe - Filtrer par Client :**

```http
GET https://api.stripe.com/v1/subscriptions?customer=cus_Na6dX7aXxi11N4
```

**Stripe - Filtrer par Statut :**

```http
GET https://api.stripe.com/v1/subscriptions?status=active
```

**PayPal - Ce Que Vous Obtenez Réellement :**

```http
GET https://api.paypal.com/v1/billing/subscriptions/{id}
Authorization: Bearer access_token

# Vous pouvez UNIQUEMENT obtenir UN abonnement si vous connaissez déjà l'ID
# Il n'y a AUCUN endpoint pour lister tous les abonnements
# Il n'y a AUCUN moyen de rechercher ou filtrer
# Vous devez suivre tous les IDs d'abonnement vous-même
```

**Endpoints Disponibles chez PayPal :**

* `POST /v1/billing/subscriptions` - Créer un abonnement
* `GET /v1/billing/subscriptions/{id}` - Obtenir UN abonnement (si vous connaissez l'ID)
* `PATCH /v1/billing/subscriptions/{id}` - Mettre à jour un abonnement
* `POST /v1/billing/subscriptions/{id}/cancel` - Annuler un abonnement
* `POST /v1/billing/subscriptions/{id}/suspend` - Suspendre un abonnement
**Ce qui manque chez PayPal :**

* ❌ Pas de `GET /v1/billing/subscriptions` (lister tous)
* ❌ Pas de fonctionnalité de recherche
* ❌ Pas de filtrage par statut, client, date
* ❌ Pas de support de pagination

PayPal est le seul grand processeur de paiement qui oblige les développeurs à suivre manuellement les identifiants d’abonnement dans leurs propres bases de données.


## La dissimulation systématique de PayPal : faire taire 6 millions de voix {#paypals-systematic-cover-up-silencing-6-million-voices}

Dans un geste qui résume parfaitement l’approche de PayPal face aux critiques, ils ont récemment mis hors ligne l’intégralité de leur forum communautaire, réduisant au silence plus de 6 millions de membres et effaçant des centaines de milliers de messages documentant leurs échecs.

### La grande effacement {#the-great-erasure}

La communauté originale de PayPal sur `paypal-community.com` comptait **6 003 558 membres** et contenait des centaines de milliers de messages, rapports de bugs, plaintes et discussions sur les défaillances de l’API PayPal. Cela représentait plus d’une décennie de preuves documentées des problèmes systémiques de PayPal.

Le 30 juin 2025, PayPal a discrètement mis hors ligne l’intégralité du forum. Tous les liens `paypal-community.com` renvoient désormais des erreurs 404. Il ne s’agissait ni d’une migration ni d’une mise à jour.

### Le sauvetage par un tiers {#the-third-party-rescue}

Heureusement, un service tiers sur [ppl.lithium.com](https://ppl.lithium.com/) a préservé une partie du contenu, nous permettant d’accéder aux discussions que PayPal a tenté de cacher. Cependant, cette préservation par un tiers est incomplète et pourrait disparaître à tout moment.

Ce schéma de dissimulation de preuves n’est pas nouveau chez PayPal. Ils ont un historique documenté de :

* Suppression des rapports de bugs critiques de la vue publique
* Abandon des outils développeurs sans préavis
* Modifications des API sans documentation adéquate
* Répression des discussions communautaires sur leurs échecs

La suppression du forum représente la tentative la plus audacieuse à ce jour de cacher leurs échecs systémiques à l’examen public.


## Le désastre du bug de capture de 11 ans : 1 899 $ et ça continue {#the-11-year-capture-bug-disaster-1899-and-counting}

Alors que PayPal organisait des sessions de feedback et faisait des promesses, leur système principal de traitement des paiements est fondamentalement défaillant depuis plus de 11 ans. Les preuves sont accablantes.

### La perte de 1 899 $ de Forward Email {#forward-emails-1899-loss}

Dans nos systèmes de production, nous avons découvert 108 paiements PayPal totalisant **1 899 $** perdus à cause des échecs de capture de PayPal. Ces paiements montrent un schéma constant :

* Les webhooks `CHECKOUT.ORDER.APPROVED` ont été reçus
* L’API de capture de PayPal a retourné des erreurs 404
* Les commandes sont devenues inaccessibles via l’API PayPal

Il est impossible de déterminer si les clients ont été débités puisque PayPal cache complètement les logs de débogage après 14 jours et efface toutes les données du tableau de bord pour les ID de commande non capturés.

Cela ne représente qu’une seule entreprise. **Les pertes collectives sur des milliers de commerçants sur plus de 11 ans s’élèvent probablement à des millions de dollars.**

**Nous le répétons : les pertes collectives sur des milliers de commerçants sur plus de 11 ans s’élèvent probablement à des millions de dollars.**

La seule raison pour laquelle nous avons découvert cela est que nous sommes incroyablement méticuleux et guidés par les données.

### Le rapport original de 2013 : plus de 11 ans de négligence {#the-2013-original-report-11-years-of-negligence}

Le premier rapport documenté de ce problème exact apparaît sur [Stack Overflow en novembre 2013](https://stackoverflow.com/questions/19773755/keep-receiving-404-error-with-rest-api-when-doing-a-capture) ([archivé](https://web.archive.org/web/20250708045416/https://stackoverflow.com/questions/19773755/keep-receiving-404-error-with-rest-api-when-doing-a-capture)) :

> "Je reçois constamment une erreur 404 avec l’API Rest lors d’une capture"

L’erreur rapportée en 2013 est **identique** à celle rencontrée par Forward Email en 2024 :

```json
{
  "name": "INVALID_RESOURCE_ID",
  "message": "The requested resource ID was not found",
  "information_link": "https://developer.paypal.com/webapps/developer/docs/api/#INVALID_RESOURCE_ID",
  "debug_id": "e56bae98dcc26"
}
```

La réponse de la communauté en 2013 était révélatrice :

> "Il y a actuellement un problème signalé avec l’API REST. PayPal travaille dessus."
**Plus de 11 ans plus tard, ils "travaillent toujours dessus."**

### L'aveu de 2016 : PayPal casse son propre SDK {#the-2016-admission-paypal-breaks-their-own-sdk}

En 2016, le dépôt GitHub officiel de PayPal documentait des [échecs massifs de capture](https://github.com/paypal/PayPal-PHP-SDK/issues/660) affectant leur SDK PHP officiel. L'ampleur était stupéfiante :

> "Depuis le 20/09/2016, toutes les tentatives de capture PayPal échouent avec 'INVALID_RESOURCE_ID - Requested resource ID was not found.'. Rien n'a été modifié entre le 19/09 et le 20/09 dans l'intégration API. **100 % des tentatives de capture depuis le 20/09 ont retourné cette erreur.**"

Un commerçant rapportait :

> "J'ai eu **plus de 1 400 tentatives de capture échouées dans les dernières 24 heures**, toutes avec la réponse d'erreur INVALID_RESOURCE_ID."

La réponse initiale de PayPal a été de blâmer le commerçant et de le renvoyer au support technique. Ce n'est qu'après une pression massive qu'ils ont admis leur faute :

> "J'ai une mise à jour de nos développeurs produit. Ils ont remarqué dans les en-têtes envoyés que le PayPal-Request-ID est envoyé avec 42 caractères, mais **il semble qu'un changement récent limite cet ID à seulement 38 caractères.**"

Cet aveu révèle la négligence systématique de PayPal :

1. **Ils ont effectué des changements cassants non documentés**
2. **Ils ont cassé leur propre SDK officiel**
3. **Ils ont d'abord blâmé les commerçants**
4. **Ils n'ont admis leur faute que sous pression**

Même après avoir "corrigé" le problème, les commerçants rapportaient :

> "Mise à jour du SDK vers la v1.7.4 et **le problème persiste toujours.**"

### L'escalade de 2024 : Toujours cassé {#the-2024-escalation-still-broken}

Des rapports récents de la communauté PayPal conservée montrent que le problème s'est en fait aggravé. Une [discussion de septembre 2024](https://ppl.lithium.com/t5/REST-APIs/Receiving-APPROVED-Webhooks-for-Order-but-capture-leads-to-404/td-p/3176093) ([archivée](https://web.archive.org/web/20250708045416/https://ppl.lithium.com/t5/REST-APIs/Receiving-APPROVED-Webhooks-for-Order-but-capture-leads-to-404/td-p/3176093)) documente exactement les mêmes problèmes :

> "Le problème a commencé à apparaître il y a environ 2 semaines et n'affecte pas toutes les commandes. **Le problème beaucoup plus courant semble être des 404 lors de la capture.**"

Le commerçant décrit le même schéma que Forward Email a expérimenté :

> "Après avoir essayé de capturer la commande, PayPal retourne un 404. Lors de la récupération des détails de la commande : {'id': 'ID', 'intent': 'CAPTURE', 'status': 'COMPLETED', ..., 'final_capture': true, ...} **Cela sans aucune trace d'une capture réussie de notre côté.**"

### Le désastre de la fiabilité des webhooks {#the-webhook-reliability-disaster}

Une autre [discussion communautaire conservée](https://ppl.lithium.com/t5/REST-APIs/Not-received-PAYMENT-CAPTURE-COMPLETED-when-had-captured/m-p/3042446) révèle que le système de webhook de PayPal est fondamentalement peu fiable :

> "Théoriquement, il devrait y avoir deux événements (CHECKOUT.ORDER.APPROVED et PAYMENT.CAPTURE.COMPLETED) provenant des événements Webhook. En réalité, **ces deux événements sont rarement reçus immédiatement, PAYMENT.CAPTURE.COMPLETED n'est pas reçu la plupart du temps ou ne l'est qu'après quelques heures.**"

Pour les paiements par abonnement :

> "**'PAYMENT.SALE.COMPLETED' n'a parfois pas été reçu ou seulement après quelques heures.**"

Les questions du commerçant révèlent la profondeur des problèmes de fiabilité de PayPal :

1. **"Pourquoi cela arrive-t-il ?"** - Le système de webhook de PayPal est fondamentalement cassé
2. **"Si le statut de la commande est 'COMPLETED', puis-je considérer que j'ai reçu l'argent ?"** - Les commerçants ne peuvent pas faire confiance aux réponses de l'API PayPal
3. **"Pourquoi 'Event Logs->Webhook Events' ne trouve-t-il aucun journal ?"** - Même le système de journalisation de PayPal ne fonctionne pas

### Le schéma de négligence systématique {#the-pattern-of-systematic-negligence}

Les preuves s'étendent sur plus de 11 ans et montrent un schéma clair :

* **2013** : "PayPal travaille dessus"
* **2016** : PayPal admet un changement cassant, fournit une correction défectueuse
* **2024** : Les mêmes erreurs exactes se produisent toujours, affectant Forward Email et bien d'autres

Ce n'est pas un bug - **c'est une négligence systématique.** PayPal connaît ces défaillances critiques de traitement des paiements depuis plus d'une décennie et a constamment :
1. **A imputé les bugs de PayPal aux marchands**
2. **A effectué des changements non documentés et incompatibles**
3. **A fourni des correctifs inadéquats qui ne fonctionnent pas**
4. **A ignoré l'impact financier sur les entreprises**
5. **A caché les preuves en supprimant les forums communautaires**

### L'exigence non documentée {#the-undocumented-requirement}

Nulle part dans la documentation officielle de PayPal il n'est mentionné que les marchands doivent implémenter une logique de nouvelle tentative pour les opérations de capture. Leur documentation indique que les marchands doivent « capturer immédiatement après approbation », mais ne mentionne pas que leur API renvoie aléatoirement des erreurs 404 nécessitant des mécanismes complexes de nouvelle tentative.

Cela oblige chaque marchand à :

* Implémenter une logique de nouvelle tentative avec backoff exponentiel
* Gérer une livraison de webhook incohérente
* Construire des systèmes complexes de gestion d'état
* Surveiller manuellement les captures échouées

**Tous les autres processeurs de paiement fournissent des API de capture fiables qui fonctionnent du premier coup.**


## Le schéma plus large de tromperie de PayPal {#paypals-broader-pattern-of-deception}

Le désastre du bug de capture n’est qu’un exemple de l’approche systématique de PayPal pour tromper ses clients et cacher ses échecs.

### L’action du Département des Services Financiers de New York {#the-new-york-department-of-financial-services-action}

En janvier 2025, le Département des Services Financiers de New York a émis une [action d’exécution contre PayPal](https://www.dfs.ny.gov/system/files/documents/2025/01/ea20250123-paypal-inc.pdf) pour pratiques trompeuses, démontrant que le schéma de tromperie de PayPal dépasse largement leurs API.

Cette action réglementaire montre la volonté de PayPal de s’engager dans des pratiques trompeuses à travers l’ensemble de leur activité, pas seulement leurs outils pour développeurs.

### Le procès Honey : réécriture des liens d’affiliation {#the-honey-lawsuit-rewriting-affiliate-links}

L’acquisition de Honey par PayPal a donné lieu à des [poursuites alléguant que Honey réécrit les liens d’affiliation](https://www.theverge.com/2024/12/23/24328767/honey-paypal-lawsuit-affiliate-commission-influencer), volant des commissions aux créateurs de contenu et influenceurs. Cela représente une autre forme de tromperie systématique où PayPal profite en redirigeant des revenus qui devraient revenir à d’autres.

Le schéma est clair :

1. **Défaillances API** : cacher les fonctionnalités cassées, blâmer les marchands
2. **Silence communautaire** : supprimer les preuves des problèmes
3. **Violations réglementaires** : s’engager dans des pratiques trompeuses
4. **Vol d’affiliation** : voler des commissions par manipulation technique

### Le coût de la négligence de PayPal {#the-cost-of-paypals-negligence}

La perte de 1 899 $ de Forward Email ne représente que la partie émergée de l’iceberg. Considérez l’impact plus large :

* **Marchands individuels** : des milliers perdant des centaines à des milliers de dollars chacun
* **Clients entreprises** : potentiellement des millions de revenus perdus
* **Temps des développeurs** : d’innombrables heures passées à créer des contournements pour les API cassées de PayPal
* **Confiance des clients** : des entreprises perdant des clients à cause des échecs de paiement de PayPal

Si un petit service d’email a perdu près de 2 000 $, et que ce problème existe depuis plus de 11 ans affectant des milliers de marchands, le dommage financier collectif s’élève probablement à **des centaines de millions de dollars**.

### Le mensonge de la documentation {#the-documentation-lie}

La documentation officielle de PayPal omet systématiquement de mentionner les limitations critiques et les bugs que les marchands rencontreront. Par exemple :

* **API de capture** : aucune mention que les erreurs 404 sont fréquentes et nécessitent une logique de nouvelle tentative
* **Fiabilité des webhooks** : aucune mention que les webhooks sont souvent retardés de plusieurs heures
* **Listing des abonnements** : la documentation laisse entendre que le listing est possible alors qu’aucun endpoint n’existe
* **Timeouts de session** : aucune mention des timeouts agressifs de 60 secondes

Cette omission systématique d’informations critiques force les marchands à découvrir les limitations de PayPal par essais et erreurs en production, entraînant souvent des pertes financières.


## Ce que cela signifie pour les développeurs {#what-this-means-for-developers}

L’échec systématique de PayPal à répondre aux besoins basiques des développeurs tout en collectant un grand nombre de retours montre un problème organisationnel fondamental. Ils considèrent la collecte de retours comme un substitut à la correction effective des problèmes.
Le schéma est clair :

1. Les développeurs signalent des problèmes  
2. PayPal organise des sessions de retour d'expérience avec les cadres  
3. Des retours approfondis sont fournis  
4. Les équipes reconnaissent les lacunes et promettent de « suivre et résoudre »  
5. Rien n’est mis en œuvre  
6. Les cadres partent pour de meilleures entreprises  
7. De nouvelles équipes demandent les mêmes retours  
8. Le cycle se répète  

Pendant ce temps, les développeurs sont contraints de créer des contournements, de compromettre la sécurité et de gérer des interfaces utilisateur défaillantes juste pour accepter les paiements.

Si vous construisez un système de paiement, apprenez de notre expérience : construisez votre [approche trifecta](https://forwardemail.net/en/blog/docs/building-reliable-payment-system-stripe-paypal) avec plusieurs processeurs, mais ne vous attendez pas à ce que PayPal fournisse les fonctionnalités de base dont vous avez besoin. Prévoyez de créer des contournements dès le premier jour.

> Ce post documente notre expérience de 11 ans avec les API de PayPal chez Forward Email. Tous les exemples de code et liens proviennent de nos systèmes de production réels. Nous continuons à prendre en charge les paiements PayPal malgré ces problèmes car certains clients n’ont pas d’autre option

<img loading="lazy" src="/img/articles/paypal-api-issues.webp" alt="PayPal API disaster illustration" class="rounded-lg" />
