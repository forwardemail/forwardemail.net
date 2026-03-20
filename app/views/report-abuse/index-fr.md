# Signaler un abus {#report-abuse}

<img loading="lazy" src="/img/articles/report-abuse.webp" alt="Signaler un abus et du spam à Forward Email" class="rounded-lg" />


## Table des matières {#table-of-contents}

* [Avertissement](#disclaimer)
* [Comment soumettre un rapport d'abus](#how-to-submit-an-abuse-report)
* [Pour le grand public](#for-the-general-public)
* [Pour les forces de l'ordre](#for-law-enforcement)
  * [Quelles informations sont disponibles](#what-information-is-available)
  * [Quelles informations ne sont pas disponibles](#what-information-is-not-available)
  * [Forces de l'ordre basées aux États-Unis](#law-enforcement-based-in-the-united-states)
  * [Forces de l'ordre basées en dehors des États-Unis](#law-enforcement-based-outside-of-the-united-states)
  * [Demandes d'urgence des forces de l'ordre](#law-enforcement-emergency-requests)
  * [Les demandes des forces de l'ordre peuvent déclencher des notifications de compte](#law-enforcement-requests-may-trigger-account-notices)
  * [Demandes des forces de l'ordre pour préserver des informations](#law-enforcement-requests-to-preserve-information)
  * [Signification des actes aux forces de l'ordre](#law-enforcement-serving-process)


## Avertissement {#disclaimer}

Veuillez vous référer à nos [Conditions](/terms) telles qu'elles s'appliquent sur l'ensemble du site.


## Comment soumettre un rapport d'abus {#how-to-submit-an-abuse-report}

Nous examinons les rapports d'abus et traitons les demandes d'informations pour le [grand public](#for-the-general-public) et les [forces de l'ordre](#for-law-enforcement) au cas par cas par email.

Les rapports d'abus et les demandes d'informations concernant les utilisateurs, emails, adresses IP et/ou domaines sont désignés collectivement ci-dessous comme un « Compte ».

Nos adresses email pour nous contacter avec votre demande ou rapport concernant un abus sont : `support@forwardemail.net`, `abuse@forwardemail.net`, et `security@forwardemail.net`.

Veuillez envoyer une copie à toutes ces adresses email si possible, et envoyez également des emails de rappel si nous ne donnons pas suite dans les 24-48+ heures.

Lisez les sections ci-dessous pour plus d'informations qui pourraient vous concerner.


## Pour le grand public {#for-the-general-public}

<u>**Si vous ou quelqu’un d’autre êtes en danger imminent, veuillez contacter immédiatement la police et les services d'urgence.**</u>

<u>**Vous devriez consulter un avocat professionnel pour récupérer l'accès perdu à votre Compte ou pour aider à stopper un acteur malveillant.**</u>

Si vous êtes victime d'abus provenant d'un Compte utilisant notre service, veuillez nous envoyer votre rapport par email à l'adresse ci-dessus. Si votre Compte a été pris en main par un acteur malveillant (par exemple, votre domaine a récemment expiré et a été re-enregistré par un tiers puis utilisé pour des abus), veuillez nous envoyer un rapport à l'adresse ci-dessus avec les informations exactes de votre Compte (par exemple, le nom de votre domaine). Nous pouvons aider à [shadow ban](https://en.wikipedia.org/wiki/Shadow_banning) le Compte après validation de votre précédente propriété. Notez que nous n'avons pas l'autorité pour vous aider à récupérer l'accès à votre Compte.

Votre représentant légal peut vous conseiller de contacter les forces de l'ordre, le propriétaire de votre Compte (par exemple, le bureau d'enregistrement du nom de domaine ; le site où vous avez enregistré le nom de domaine), et/ou de vous référer à la [page d'ICANN sur les noms de domaine perdus](https://www.icann.org/resources/pages/lost-domain-names).


## Pour les forces de l'ordre {#for-law-enforcement}

Pour la majorité des demandes, notre capacité à divulguer des informations est régie par le [Electronic Communications Privacy Act](https://bja.ojp.gov/program/it/privacy-civil-liberties/authorities/statutes/1285) ([Wikipedia](https://en.wikipedia.org/wiki/Electronic_Communications_Privacy_Act)), [18 U.S.C. 2701](https://www.govinfo.gov/link/uscode/18/2701), et suivants (« ECPA »). L'ECPA nous oblige à divulguer certaines informations utilisateur aux forces de l'ordre uniquement en réponse à des types spécifiques de demandes légales, y compris les assignations à comparaître, ordonnances judiciaires et mandats de perquisition.

Si vous êtes un membre des forces de l'ordre et recherchez des informations concernant un Compte, les informations du Compte ainsi que la plage de dates et heures doivent être incluses dans votre demande. Nous ne pouvons pas traiter des demandes trop larges et/ou vagues – ceci afin de protéger les données et la confiance de nos utilisateurs, et surtout pour garantir la sécurité de leurs données.
Si votre demande nous signale une violation de nos [Conditions](/terms), nous la traiterons conformément à nos meilleures pratiques internes pour la gestion des abus – notez que dans certains cas, cela peut entraîner la suspension et/ou l'interdiction du Compte.

**Comme nous ne sommes pas un bureau d'enregistrement de noms de domaine**, si vous souhaitez obtenir des informations historiques sur les enregistrements DNS d'un nom de domaine, vous devez contacter le bureau d'enregistrement spécifique correspondant au domaine. Des services tels que [Security Trails]() peuvent fournir une recherche d'enregistrements historiques, mais des informations plus spécifiques et précises peuvent être fournies par le bureau d'enregistrement. Pour déterminer qui est le bureau d'enregistrement du nom de domaine et/ou les propriétaires des serveurs de noms DNS pour un domaine, les outils `dig` et `whois` peuvent être utiles (par exemple `whois example.com` ou `dig example.com ns`). Vous pouvez déterminer si un Compte est sur un plan payant ou gratuit sur notre service en effectuant une recherche d'enregistrements DNS (par exemple `dig example.com mx` et `dig example.com txt`). Si les enregistrements MX ne renvoient pas des valeurs telles que `mx1.forwardemail.net` et `mx2.forwardemail.net`, alors le domaine n'utilise pas notre service. Si les enregistrements TXT renvoient une adresse email en clair (par exemple `forward-email=user@example.com`), cela indique la destination de transfert d'email pour un domaine. Si au contraire il renvoie une valeur telle que `forward-email-site-verification=XXXXXXXXXX`, cela indique qu'il est sur un plan payant et que la configuration de transfert est stockée dans notre base de données sous l'ID `XXXXXXXXXX`. Pour plus d'informations sur le fonctionnement de notre service au niveau DNS, veuillez consulter notre [FAQ](/faq).

### Quelles informations sont disponibles {#what-information-is-available}

Veuillez vous référer à la section de notre Politique de Confidentialité concernant les [Informations Collectées](/privacy#information-collected). Les Comptes sont autorisés à supprimer leurs informations de notre système conformément aux lois sur la conservation des données et la confidentialité ; veuillez consulter la section de notre Politique de Confidentialité sur la [Suppression des Informations](/privacy#information-removal). Cela signifie que les informations demandées peuvent ne pas être disponibles au moment de la demande en raison de la suppression du Compte.

### Quelles informations ne sont pas disponibles {#what-information-is-not-available}

Veuillez vous référer à la section de notre Politique de Confidentialité concernant les [Informations Non Collectées](/privacy#information-not-collected).

### Forces de l'ordre basées aux États-Unis {#law-enforcement-based-in-the-united-states}

À l'[exception des urgences](#law-enforcement-emergency-requests), nous partageons les informations du Compte uniquement sur réception d'une assignation valide, d'une ordonnance judiciaire ECPA américaine, et/ou d'un mandat de perquisition.

Nous pouvons également [notifier un Compte](#law-enforcement-requests-may-trigger-account-notices) à propos d'une demande des forces de l'ordre, sauf si la loi ou une ordonnance judiciaire nous en interdit la divulgation.

Si nous recevons une assignation valide, une ordonnance judiciaire ECPA, et/ou un mandat de perquisition, nous fournirons les informations pertinentes et disponibles au mieux de nos capacités.

### Forces de l'ordre basées en dehors des États-Unis {#law-enforcement-based-outside-of-the-united-states}

Nous exigeons que les demandes émanant de forces de l'ordre basées en dehors des États-Unis soient signifiées via l'une des méthodes suivantes :

* Un tribunal des États-Unis.
* Une agence d'application de la loi selon les procédures d'un [traité d'entraide judiciaire mutuelle des États-Unis](https://www.justice.gov/criminal-oia/file/1498806/download) ([Wikipedia](https://en.wikipedia.org/wiki/Mutual_legal_assistance_treaty)) ("MLAT").
* Une ordonnance d'un gouvernement étranger soumise à un accord exécutif que le Procureur Général des États-Unis a déterminé et certifié au Congrès comme satisfaisant aux exigences de [18 U.S.C. 2523](https://www.govinfo.gov/link/uscode/18/2523).

### Demandes d'urgence des forces de l'ordre {#law-enforcement-emergency-requests}

Comme la loi le permet aux États-Unis (par exemple conformément à [18 U.S.C. §2702 (b)(8)](https://www.law.cornell.edu/uscode/text/18/2702#:\~:text=\(8\)to%20a%20governmental%20entity%2C%20if%20the%20provider%2C%20in%20good%20faith%2C%20believes%20that%20an%20emergency%20involving%20danger%20of%20death%20or%20serious%20physical%20injury%20to%20any%20person%20requires%20disclosure%20without%20delay%20of%20communications%20relating%20to%20the%20emergency%3B%20or) et [§2702 (c)](https://www.law.cornell.edu/uscode/text/18/2702#:\~:text=\(c\)Exceptions%20for%20Disclosure%20of%20Customer%20Records.%E2%80%94A%20provider%20described%20in%20subsection%20\(a\)%20may%20divulge%20a%20record%20or%20other%20information%20pertaining%20to%20a%20subscriber%20to%20or%20customer%20of%20such%20service%20\(not%20including%20the%20contents%20of%20communications%20covered%20by%20subsection%20\(a\)\(1\)%20or%20\(a\)\(2\)\)%E2%80%94)), lorsque de bonne foi et avec une vérification indépendante du demandeur – nous pouvons divulguer et partager les informations du Compte aux forces de l'ordre sans assignation, ordonnance judiciaire ECPA, et/ou mandat de perquisition lorsque nous estimons que cela est nécessaire sans délai afin de prévenir un décès ou une blessure physique grave.
Nous exigeons que les demandes de données d'urgence ("EDR") soient envoyées par email et incluent toutes les informations pertinentes afin de fournir un processus rapide et accéléré.

Notez que nous sommes conscients des attaques sophistiquées de spoofing, phishing et usurpation d'identité par email (par exemple, voir [cet article du Guardian](https://www.theguardian.com/technology/2022/apr/04/us-law-enforcement-agencies-access-your-data-apple-meta#:\~:text=A%20hack%20using%20a%20forged%20legal%20request%20that%20exposed%20consumer%20data%20collected%20by%20Apple%20and%20Meta%20shed%20light%20on%20the%20reach%20of%20the%20law)).

Notre politique pour le traitement des EDR est la suivante :

1. Rechercher de manière indépendante les métadonnées de l'en-tête email (par exemple DKIM/SPF/DMARC) (ou leur absence) pour vérification.

2. Faire de notre mieux, de bonne foi (avec des tentatives répétées si nécessaire) pour contacter indépendamment par téléphone le demandeur – afin de confirmer l'authenticité de la demande. Par exemple, nous pouvons rechercher le site `.gov` lié à la juridiction d'où provient la demande, puis appeler le bureau depuis leur numéro de téléphone officiel publié publiquement pour vérifier la demande.

### Les demandes des forces de l'ordre peuvent déclencher des notifications de compte {#law-enforcement-requests-may-trigger-account-notices}

Nous pouvons notifier un Compte et lui fournir une copie d'une demande des forces de l'ordre le concernant, sauf si la loi ou une ordonnance judiciaire nous en interdit (par exemple [18 U.S.C. 2705(b)](https://www.govinfo.gov/link/uscode/18/2705)). Dans ces cas, le cas échéant, nous pouvons notifier un Compte lorsque l'ordre de non-divulgation a expiré.

Si une demande d'information par les forces de l'ordre est valide, alors nous [conserverons les informations nécessaires et demandées du Compte](#law-enforcement-requests-to-preserve-information) et ferons un effort raisonnable pour contacter le propriétaire du Compte via son adresse email enregistrée et vérifiée (par exemple dans les 7 jours calendaires). Si nous recevons une objection en temps utile (par exemple dans les 7 jours calendaires), alors nous retiendrons le partage des informations du Compte et poursuivrons le processus légal selon les besoins.

### Demandes des forces de l'ordre pour conserver des informations {#law-enforcement-requests-to-preserve-information}

Nous honorerons les demandes valides des forces de l'ordre pour conserver des informations concernant un Compte conformément à [18 U.S.C. 2703(f)](https://www.govinfo.gov/link/uscode/18/2703). Notez que la conservation des données est limitée uniquement à ce qui est spécifiquement demandé et actuellement disponible.

### Signification des actes par les forces de l'ordre {#law-enforcement-serving-process}

Nous exigeons que toutes les demandes valides des forces de l'ordre nous fournissent une adresse email valide et fonctionnelle à laquelle nous pouvons correspondre et fournir les informations demandées électroniquement.

Toutes les demandes doivent être envoyées à l'adresse email spécifiée sous [Comment soumettre un rapport d'abus](#how-to-submit-an-abuse-report) ci-dessus.

Toutes les demandes des forces de l'ordre doivent être envoyées sur papier à en-tête de l'agence ou du département (par exemple en pièce jointe PDF scannée), depuis une adresse email officielle et pertinente, et signées.

Si cela concerne une [demande d'urgence](#law-enforcement-emergency-requests), veuillez écrire "Demande d'urgence des forces de l'ordre" dans l'objet de l'email.

Veuillez noter qu'il peut nous falloir au moins deux semaines pour pouvoir examiner et répondre à votre demande.
