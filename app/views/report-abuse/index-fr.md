# Signaler un abus {#report-abuse}

<img loading="lazy" src="/img/articles/report-abuse.webp" alt="" class="rounded-lg" />

## Table des matières {#table-of-contents}

* [Clause de non-responsabilité](#disclaimer)
* [Comment soumettre un rapport d'abus](#how-to-submit-an-abuse-report)
* [Pour le grand public](#for-the-general-public)
* [Pour les forces de l'ordre](#for-law-enforcement)
  * [Quelles informations sont disponibles](#what-information-is-available)
  * [Quelles informations ne sont pas disponibles](#what-information-is-not-available)
  * [Forces de l'ordre basées aux États-Unis](#law-enforcement-based-in-the-united-states)
  * [Forces de l'ordre basées en dehors des États-Unis](#law-enforcement-based-outside-of-the-united-states)
  * [Demandes d'urgence des forces de l'ordre](#law-enforcement-emergency-requests)
  * [Les demandes des forces de l'ordre peuvent déclencher des notifications de compte](#law-enforcement-requests-may-trigger-account-notices)
  * [Les forces de l'ordre demandent la conservation des informations](#law-enforcement-requests-to-preserve-information)
  * [Procédure de signification des forces de l'ordre](#law-enforcement-serving-process)

## Avis de non-responsabilité {#disclaimer}

Veuillez vous référer à notre [Termes](/terms) car il s'applique à l'ensemble du site.

## Comment soumettre un rapport d'abus {#how-to-submit-an-abuse-report}

Nous examinons les rapports d'abus et répondons aux demandes d'informations pour [grand public](#for-the-general-public) et [forces de l'ordre](#for-law-enforcement) au cas par cas par courrier électronique.

Les rapports d'abus et les demandes d'informations concernant les utilisateurs, les e-mails, les adresses IP et/ou les domaines sont appelés collectivement « Compte » ci-dessous.

Notre adresse e-mail pour vous contacter concernant votre demande ou votre signalement d'abus est : `abuse@forwardemail.net`

Lisez les sections ci-dessous pour plus d’informations qui pourraient vous concerner.

## Pour le grand public {#for-the-general-public}

<u>**Si vous ou quelqu'un d'autre êtes en danger imminent, veuillez contacter immédiatement la police et les services d'urgence.**</u>

<u>**Vous devriez demander un avis juridique professionnel pour récupérer l'accès perdu à votre compte ou pour aider à arrêter un acteur malveillant.**</u>

Si vous êtes victime d'abus sur un compte utilisant nos services, veuillez nous signaler votre abus par e-mail à l'adresse ci-dessus. Si votre compte a été piraté par un acteur malveillant (par exemple, si votre domaine a récemment expiré et a été réenregistré par un tiers, puis utilisé à des fins abusives), veuillez nous signaler votre abus par e-mail à l'adresse ci-dessus en précisant les informations exactes de votre compte (par exemple, votre nom de domaine). Nous pouvons vous aider à [interdiction de l'ombre](https://en.wikipedia.org/wiki/Shadow_banning) votre compte après validation de votre ancien propriétaire. Veuillez noter que nous ne sommes pas habilités à vous aider à récupérer l'accès à votre compte.

Votre représentant légal peut vous conseiller de contacter les forces de l'ordre, le propriétaire de votre compte (par exemple, le bureau d'enregistrement du nom de domaine, le site Web sur lequel vous avez enregistré le nom de domaine) et/ou vous renvoyer vers [Page de l'ICANN sur les domaines perdus](https://www.icann.org/resources/pages/lost-domain-names).

## Pour les forces de l'ordre {#for-law-enforcement}

Pour la majorité des demandes, notre capacité à divulguer des informations est régie par la loi [Loi sur la protection des renseignements personnels en matière de communications électroniques](https://bja.ojp.gov/program/it/privacy-civil-liberties/authorities/statutes/1285) ([Wikipédia](https://en.wikipedia.org/wiki/Electronic_Communications_Privacy_Act)), [18 U.S.C. 2701](https://www.govinfo.gov/link/uscode/18/2701) et suivantes (« ECPA »). Cette loi nous impose de divulguer certaines informations utilisateur aux forces de l'ordre uniquement en réponse à des demandes légales spécifiques, notamment des assignations à comparaître, des ordonnances judiciaires et des mandats de perquisition.

Si vous êtes membre des forces de l'ordre et que vous souhaitez obtenir des informations concernant un compte, veuillez inclure les informations relatives au compte ainsi que la date et l'heure de la demande dans votre demande. Nous ne pouvons pas traiter de demandes trop vagues et/ou vagues, afin de préserver les données et la confiance de nos utilisateurs, et surtout de garantir la sécurité de leurs données.

Si votre demande nous signale une violation de notre [Termes](/terms), nous la traiterons conformément à nos meilleures pratiques internes en matière de gestion des abus. Notez que dans certains cas, cela peut entraîner la suspension et/ou l'interdiction du compte.

**Comme nous ne sommes pas un bureau d'enregistrement de noms de domaine**, si vous souhaitez consulter l'historique des enregistrements DNS d'un nom de domaine, veuillez contacter le bureau d'enregistrement correspondant. Des services tels que [Security Trails]() peuvent permettre une recherche d'historique, mais le bureau d'enregistrement peut fournir des informations plus précises. Afin de déterminer le propriétaire du bureau d'enregistrement et/ou des serveurs DNS d'un domaine, les outils `dig` et `whois` peuvent être utiles (par exemple, `whois example.com` ou `dig example.com ns`). Vous pouvez déterminer si un compte est abonné à un abonnement payant ou gratuit sur notre service en effectuant une recherche d'enregistrement DNS (par exemple, `dig example.com mx` et `dig example.com txt`). Si les enregistrements MX ne renvoient pas de valeurs telles que `mx1.forwardemail.net` et `mx2.forwardemail.net`, le domaine n'utilise pas notre service. Si les enregistrements TXT renvoient une adresse e-mail en texte clair (par exemple, `forward-email=user@example.com`), cela indique l'adresse de destination de la redirection d'un domaine. Si, au contraire, ils renvoient une valeur telle que `forward-email-site-verification=XXXXXXXXXX`, cela indique qu'il s'agit d'un forfait payant et que la configuration de redirection est stockée dans notre base de données sous l'identifiant `XXXXXXXXXX`. Pour plus d'informations sur le fonctionnement de notre service au niveau DNS, veuillez consulter notre [FAQ](/faq).

### Quelles informations sont disponibles {#what-information-is-available}

Veuillez consulter notre Politique de confidentialité pour plus d'informations. Les comptes sont autorisés à supprimer leurs informations de notre système conformément aux lois sur la conservation des données et la confidentialité ; veuillez consulter notre Politique de confidentialité pour plus d'informations. Cela signifie que les informations demandées peuvent ne pas être disponibles au moment de la demande en raison de la suppression du compte.

### Quelles informations ne sont pas disponibles {#what-information-is-not-available}

Veuillez vous référer à notre section Politique de confidentialité pour [Informations non collectées](/privacy#information-not-collected).

### Forces de l'ordre basées aux États-Unis {#law-enforcement-based-in-the-united-states}

Avec le [exception des situations d'urgence](#law-enforcement-emergency-requests), nous partageons les informations de compte uniquement après réception d'une assignation à comparaître valide, d'une ordonnance d'un tribunal américain ECPA et/ou d'un mandat de perquisition.

Nous pouvons également [notifier un compte](#law-enforcement-requests-may-trigger-account-notices) à propos d'une demande des forces de l'ordre, à moins que la loi ou une décision de justice ne nous l'interdise.

Si nous recevons une assignation à comparaître valide, une ordonnance du tribunal de l'ECPA et/ou un mandat de perquisition, nous fournirons les informations pertinentes et disponibles au mieux de nos capacités.

### Forces de l'ordre basées en dehors des États-Unis {#law-enforcement-based-outside-of-the-united-states}

Nous exigeons que les demandes soient adressées aux forces de l'ordre basées en dehors des États-Unis via l'un des moyens suivants :

* Un tribunal des États-Unis.
* Un organisme d'application de la loi régi par les procédures d'un [Traité d'entraide judiciaire des États-Unis](https://www.justice.gov/criminal-oia/file/1498806/download) ([Wikipédia](https://en.wikipedia.org/wiki/Mutual_legal_assistance_treaty)) (« MLAT »).
* Une ordonnance d'un gouvernement étranger soumise à un accord exécutif que le procureur général des États-Unis a déterminé et certifié au Congrès comme satisfaisant aux exigences de [18 U.S.C. 2523](https://www.govinfo.gov/link/uscode/18/2523).

### Demandes d'urgence des forces de l'ordre {#law-enforcement-emergency-requests}

Comme le permet la loi aux États-Unis (par exemple, conformément à [18 U.S.C. §2702 (b)(8)](https://www.law.cornell.edu/uscode/text/18/2702#:\~:text=\(8\)à%20une%20entité%20gouvernementale%2C%20si%20le%20fournisseur%2C%20estime%20de%20bonne%20foi%2C%20qu'une%20urgence%20impliquant%20un%20danger%20de%20mort%20ou%20de%20blessure%20physique%20grave%20à%20une%20personne%20nécessite%20la%20divulgation%20sans%20délai%20des%20communications%20relatives%20à%20l'urgence%3B%20ou) et [§2702 (c)](https://www.law.cornell.edu/uscode/text/18/2702#:\~:text=\(c\)Exceptions%20à%20la%20divulgation%20des%20dossiers%20clients.%E2%80%94Un%20fournisseur%20décrit%20au%20sous-article%20\(a\)%20peut%20divulguer%20un%20dossier%20ou%20d'autres%20informations%20concernant%20un%20abonné%20ou%20un%20client%20d'un%20tel%20service%20\(à%20l'exclusion%20du%20contenu%20des%20communications%20couvertes%20au%20sous-article%20\(a\)\(1\)%20ou%20\(a\)\(2\)\)%E2%80%94)), lorsqu'il est de bonne foi et après vérification indépendante le demandeur – nous pouvons divulguer et partager les informations du compte aux forces de l'ordre sans assignation à comparaître, ordonnance du tribunal de l'ECPA et/ou mandat de perquisition lorsque nous pensons que cela est nécessaire sans délai pour éviter un décès ou des blessures physiques graves.

Nous exigeons que les demandes de données d'urgence (« EDR ») soient envoyées par courrier électronique et incluent toutes les informations pertinentes afin de fournir un processus rapide et accéléré.

Veuillez noter que nous sommes conscients des attaques sophistiquées d'usurpation d'identité, de phishing et d'usurpation d'identité par courrier électronique (voir par exemple [cet article du Guardian](https://www.theguardian.com/technology/2022/apr/04/us-law-enforcement-agencies-access-your-data-apple-meta#:\~:text=A%20hack%20using%20a%20forged%20legal%20request%20that%20exposed%20consumer%20data%20collected%20by%20Apple%20and%20Meta%20shed%20light%20on%20the%20reach%20of%20the%20law)).

Notre politique de traitement des EDR est la suivante :

1. Recherchez indépendamment les métadonnées de l'en-tête de l'e-mail (par exemple DKIM/SPF/DMARC) (ou leur absence) pour vérification.

2. Nous nous efforcerons, de bonne foi (et à plusieurs reprises si nécessaire), de contacter le demandeur par téléphone afin de confirmer l'authenticité de sa demande. Par exemple, nous pouvons consulter le site web `.gov` de la juridiction concernée, puis appeler le bureau à son numéro de téléphone officiel pour vérifier la demande.

### Les demandes des forces de l'ordre peuvent déclencher des notifications de compte {#law-enforcement-requests-may-trigger-account-notices}

Nous pouvons informer un Compte et lui fournir une copie d'une demande d'application de la loi le concernant, sauf si la loi ou une décision de justice nous l'interdit (par exemple, [18 U.S.C. 2705(b)](https://www.govinfo.gov/link/uscode/18/2705)). Dans ce cas, le cas échéant, nous pouvons informer le Compte de l'expiration de l'ordonnance de confidentialité.

Si une demande d'informations émanant des forces de l'ordre est recevable, nous [conserver les informations de compte nécessaires et demandées](#law-enforcement-requests-to-preserve-information) et mettrons tout en œuvre pour contacter le titulaire du compte à son adresse e-mail enregistrée et vérifiée (par exemple, dans un délai de 7 jours calendaires). Si nous recevons une objection dans les délais (par exemple, dans un délai de 7 jours calendaires), nous ne communiquerons pas les informations du compte et poursuivrons la procédure judiciaire si nécessaire.

### Les forces de l'ordre demandent la préservation des informations {#law-enforcement-requests-to-preserve-information}

Nous honorerons les demandes valides des forces de l'ordre visant à préserver les informations relatives à un compte, conformément à la clause [18 U.S.C. 2703(f)](https://www.govinfo.gov/link/uscode/18/2703). Veuillez noter que la conservation des données est limitée à ce qui est spécifiquement demandé et disponible.

### Les forces de l'ordre signifient le processus {#law-enforcement-serving-process}

Nous exigeons que toutes les demandes valides des forces de l'ordre nous fournissent une adresse e-mail valide et fonctionnelle à laquelle nous pouvons correspondre et fournir les informations demandées par voie électronique.

Toutes les demandes doivent être envoyées à l'adresse e-mail indiquée sous [Comment soumettre un rapport d'abus](#how-to-submit-an-abuse-report) ci-dessus.

Toutes les demandes des forces de l'ordre doivent être envoyées sur du papier à en-tête de l'agence ou du département (par exemple sous forme de pièce jointe numérisée au format PDF), à partir d'une adresse e-mail officielle et pertinente, et signées.

S'il s'agit d'un [demande d'urgence](#law-enforcement-emergency-requests), veuillez écrire « Demande d'application de la loi d'urgence » dans l'objet de l'e-mail.

Veuillez noter qu’il nous faudra peut-être au moins deux semaines pour examiner et répondre à votre demande.