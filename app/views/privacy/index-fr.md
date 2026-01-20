# Politique de confidentialité {#privacy-policy}

<img loading="lazy" src="/img/articles/privacy.webp" alt="Forward Email privacy policy" class="rounded-lg" />

## Table des matières {#table-of-contents}

* [Clause de non-responsabilité](#disclaimer)
* [Informations non collectées](#information-not-collected)
* [Informations collectées](#information-collected)
* [Informations partagées](#information-shared)
* [Suppression d'informations](#information-removal)
* [Informations supplémentaires](#additional-disclosures)

## Avertissement {#disclaimer}

Veuillez vous référer à notre [Termes](/terms) car il s'applique à l'ensemble du site.

## Informations non collectées {#information-not-collected}

**À l'exception de [erreurs](/faq#do-you-store-error-logs), [e-mails SMTP sortants](/faq#do-you-support-sending-email-with-smtp) et/ou lorsque du spam ou une activité malveillante est détecté (par exemple pour la limitation du débit) :**

* Nous ne stockons aucun e-mail transféré sur disque dur ni dans des bases de données.
* Nous ne stockons aucune métadonnée relative aux e-mails sur disque dur ni dans des bases de données.
* Nous ne stockons aucun journal ni adresse IP sur disque dur ni dans des bases de données.

## Informations collectées {#information-collected}

Par souci de transparence, vous pouvez à tout moment <a href="https://github.com/forwardemail" target="_blank" rel="noopener noreferrer">consulter notre code source</a> pour voir comment les informations ci-dessous sont collectées et utilisées :

**Strictement pour des raisons de fonctionnalité et pour améliorer notre service, nous collectons et stockons en toute sécurité les informations suivantes :**

* Nous stockons vos e-mails et vos informations de calendrier dans votre [base de données SQLite cryptée](/blog/docs/best-quantum-safe-encrypted-email-service) uniquement pour votre accès IMAP/POP3/CalDAV/CardDAV et vos fonctionnalités de boîte aux lettres.
* Veuillez noter que si vous utilisez uniquement nos services de transfert d'e-mails, aucun e-mail n'est stocké sur disque ou base de données, comme décrit dans [Informations non collectées](#information-not-collected).
* Nos services de transfert d'e-mails fonctionnent uniquement en mémoire (aucune écriture sur disque ni dans les bases de données).
* Le stockage IMAP/POP3/CalDAV/CardDAV est chiffré au repos, chiffré en transit et stocké sur un disque chiffré LUKS.
* Les sauvegardes de votre stockage IMAP/POP3/CalDAV/CardDAV sont chiffrées au repos, chiffrées en transit et stockées dans [Cloudflare R2](https://www.cloudflare.com/developer-platform/r2/).
* Nous stockons un cookie de session pour le trafic de votre site web.
* Nous stockons l'adresse e-mail que vous nous fournissez.
* Nous conservons les noms de domaine, les alias et les configurations que vous nous fournissez.
* Nous conservons les codes de réponse SMTP `4xx` et `5xx` ([journaux d'erreurs](/faq#do-you-store-error-logs)) pendant 7 jours.
* Nous conservons le code de réponse SMTP [e-mails SMTP sortants](/faq#do-you-support-sending-email-with-smtp) pendant environ 30 jours.
* Cette durée varie en fonction de l'en-tête « Date » ; nous autorisons l'envoi d'e-mails ultérieurs si un en-tête « Date » futur existe.
* **Notez qu'une fois qu'un e-mail est correctement distribué ou qu'une erreur permanente survient, nous expurgons et supprimons le corps du message.**
* Si vous souhaitez configurer la conservation du corps de votre e-mail SMTP sortant au-delà de la durée par défaut de 0 jour (après distribution ou erreur permanente), accédez aux Paramètres avancés de votre domaine et saisissez une valeur comprise entre `0` et `30`.
* Certains utilisateurs apprécient la fonctionnalité d'aperçu [Mon compte > E-mails](/my-account/emails) pour visualiser le rendu de leurs e-mails. C'est pourquoi nous proposons une période de conservation configurable.
* Notez que nous prenons également en charge __PROTECTED_LINK_30__0.
* Toute information supplémentaire que vous nous fournissez volontairement, comme les commentaires ou questions que vous nous envoyez par e-mail ou sur notre page d'aide.

## Informations partagées {#information-shared}

Nous ne partageons pas vos informations avec des tiers. Nous n'utilisons pas non plus de logiciels d'analyse ou de télémétrie tiers.

Nous devrons peut-être nous conformer aux demandes légales ordonnées par le tribunal et nous le ferons (mais gardez à l'esprit [nous ne collectons pas les informations mentionnées ci-dessus sous « Informations non collectées »](#information-not-collected), nous ne pourrons donc pas le fournir pour commencer).

## Suppression d'informations {#information-removal}

Si, à tout moment, vous souhaitez supprimer les informations que vous nous avez fournies, accédez à <a href="/my-account/security">Mon compte > Sécurité</a> et cliquez sur « Supprimer le compte ».

En raison de la prévention et de l'atténuation des abus, votre compte peut nécessiter un examen de suppression manuelle par nos administrateurs si vous le supprimez dans les 5 jours suivant votre premier paiement.

Ce processus prend généralement moins de 24 heures et a été mis en œuvre en raison du fait que les utilisateurs envoyaient des spams avec notre service, puis supprimaient rapidement leurs comptes, ce qui nous empêchait de bloquer leurs empreintes digitales de méthode de paiement dans Stripe.

## Informations supplémentaires {#additional-disclosures}

Ce site est protégé par Cloudflare et ses [politique de confidentialité](https://www.cloudflare.com/privacypolicy/) et [Conditions d'utilisation](https://www.cloudflare.com/website-terms/) s'appliquent.