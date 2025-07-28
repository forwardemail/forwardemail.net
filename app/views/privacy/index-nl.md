# Privacybeleid {#privacy-policy}

<img loading="lazy" src="/img/articles/privacy.webp" alt="" class="rounded-lg" />

## Inhoudsopgave {#table-of-contents}

* [Vrijwaring](#disclaimer)
* [Informatie niet verzameld](#information-not-collected)
* [Verzamelde informatie](#information-collected)
* [Gedeelde informatie](#information-shared)
* [Informatie verwijderen](#information-removal)
* [Aanvullende openbaarmakingen](#additional-disclosures)

Vrijwaring ##

Raadpleeg onze [Voorwaarden](/terms) aangezien deze op de hele site van toepassing is.

## Informatie niet verzameld {#information-not-collected}

**Met uitzondering van [fouten](/faq#do-you-store-error-logs), [uitgaande SMTP-e-mails](/faq#do-you-support-sending-email-with-smtp) en/of wanneer spam of kwaadaardige activiteit wordt gedetecteerd (bijvoorbeeld voor snelheidsbeperking):**

* We slaan geen doorgestuurde e-mails op in schijfopslag of databases.
* We slaan geen metadata over e-mails op in schijfopslag of databases.
* We slaan geen logs of IP-adressen op in schijfopslag of databases.

## Verzamelde informatie {#information-collected}

Voor transparantie kunt u op elk moment <a href="https://github.com/forwardemail" target="_blank" rel="noopener noreferrer">onze broncode bekijken</a> om te zien hoe de onderstaande informatie wordt verzameld en gebruikt:

**Uitsluitend voor functionaliteit en om onze service te verbeteren, verzamelen en bewaren wij de volgende informatie op een veilige manier:**

* We slaan e-mails en agendagegevens op in uw [gecodeerde SQLite-database](/blog/docs/best-quantum-safe-encrypted-email-service), uitsluitend voor uw IMAP/POP3/CalDAV/CardDAV-toegang en mailboxfunctionaliteit.
* Houd er rekening mee dat als u alleen onze e-maildoorstuurservices gebruikt, er geen e-mails op schijf of in een database worden opgeslagen, zoals beschreven in [Informatie niet verzameld](#information-not-collected).
* Onze e-maildoorstuurservices werken alleen in het geheugen (er wordt niet naar schijfopslag of databases geschreven).
* IMAP/POP3/CalDAV/CardDAV-opslag is versleuteld in rust, versleuteld tijdens verzending en opgeslagen op een LUKS-versleutelde schijf.
* Back-ups van uw IMAP/POP3/CalDAV/CardDAV-opslag zijn versleuteld in rust, versleuteld tijdens verzending en opgeslagen op [Cloudflare R2](https://www.cloudflare.com/developer-platform/r2/).
* We slaan een cookie op tijdens een sessie voor uw websiteverkeer.
* We slaan het e-mailadres op dat u ons verstrekt. * We bewaren uw domeinnamen, aliassen en configuraties die u ons verstrekt.
* We bewaren `4xx` en `5xx` SMTP-responscode [foutlogboeken](/faq#do-you-store-error-logs) gedurende 7 dagen.
* We bewaren [uitgaande SMTP-e-mails](/faq#do-you-support-sending-email-with-smtp) gedurende \~30 dagen.
* Deze lengte varieert op basis van de "Date"-header; we staan toe dat e-mails in de toekomst worden verzonden als er een toekomstige "Date"-header bestaat. * **Houd er rekening mee dat zodra een e-mail succesvol is afgeleverd of er permanente fouten zijn opgetreden, we de berichttekst zullen redigeren en verwijderen.**
* Als u wilt dat de berichttekst van uw uitgaande SMTP-e-mail langer wordt bewaard dan de standaardperiode van 0 dagen (na succesvolle aflevering of permanente fouten), ga dan naar Geavanceerde instellingen voor uw domein en voer een waarde in tussen `0` en `30`.
* Sommige gebruikers gebruiken graag de previewfunctie [Mijn account > E-mails](/my-account/emails) om te zien hoe hun e-mails worden weergegeven. Daarom ondersteunen we een configureerbare bewaartermijn.
* Houd er rekening mee dat we ook [OpenPGP/E2EE](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd) ondersteunen.
* Alle aanvullende informatie die u ons vrijwillig verstrekt, zoals opmerkingen of vragen die u per e-mail of op onze <a href="/help">help</a>-pagina hebt ingediend.

## Gedeelde informatie {#information-shared}

Wij delen uw gegevens niet met derden. We maken ook geen gebruik van analyse- of telemetriesoftware van derden.

Het kan zijn dat we aan een door de rechtbank bevolen juridisch verzoek moeten voldoen en dat zullen we ook doen (houd er echter rekening mee dat [Wij verzamelen geen informatie zoals hierboven vermeld onder "Informatie niet verzameld"](#information-not-collected), dus we kunnen het in eerste instantie niet verstrekken).

## Informatie verwijderen {#information-removal}

Als u op enig moment de informatie die u ons hebt verstrekt wilt verwijderen, gaat u naar <a href="/my-account/security">Mijn account > Beveiliging</a> en klikt u op "Account verwijderen".

Om misbruik te voorkomen en beperken, kan het zijn dat onze beheerders uw account handmatig moeten beoordelen ter verwijdering als u het binnen 5 dagen na uw eerste betaling verwijdert.

Dit proces duurt normaal gesproken minder dan 24 uur en werd geïmplementeerd omdat gebruikers onze service spamden en vervolgens snel hun accounts verwijderden. Hierdoor konden we de vingerafdruk(ken) van hun betaalmethode niet blokkeren in Stripe.

## Aanvullende openbaarmakingen {#additional-disclosures}

Deze site wordt beschermd door Cloudflare en de [Privacybeleid](https://www.cloudflare.com/privacypolicy/) en [Servicevoorwaarden](https://www.cloudflare.com/website-terms/) zijn van toepassing.