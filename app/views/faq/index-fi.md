# Usein kysytyt kysymykset {#frequently-asked-questions}

<img loading="laiska" src="/img/articles/faq.webp" alt="" class="rounded-lg" />

## Sisällysluettelo {#table-of-contents}

* [Pika-aloitus](#quick-start)
* [Johdanto](#introduction)
  * [Mikä on sähköpostin edelleenlähetys](#what-is-forward-email)
  * [Kuka käyttää sähköpostin edelleenlähetystä](#who-uses-forward-email)
  * [Mikä on Forward Emailin historia?](#what-is-forward-emails-history)
  * [Kuinka nopea tämä palvelu on](#how-fast-is-this-service)
* [Sähköpostiohjelmat](#email-clients)
  * [Thunderbird](#thunderbird)
  * [Microsoft Outlook](#microsoft-outlook)
  * [Apple Mail](#apple-mail)
  * [Mobiililaitteet](#mobile-devices)
  * [Kuinka lähettää sähköpostia Gmailin avulla](#how-to-send-mail-as-using-gmail)
  * [Mikä on vanha ilmainen opas Lähetä sähköpostia nimellä -toiminnolle Gmailissa?](#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail)
  * [Gmailin reitityksen lisäasetukset](#advanced-gmail-routing-configuration)
  * [Outlookin reitityksen lisäasetukset](#advanced-outlook-routing-configuration)
* [Vianmääritys](#troubleshooting)
  * [Miksi en saa testisähköpostejani](#why-am-i-not-receiving-my-test-emails)
  * [Miten sähköpostiohjelmani määritetään toimimaan sähköpostin edelleenlähetyksen kanssa?](#how-do-i-configure-my-email-client-to-work-with-forward-email)
  * [Miksi sähköpostini päätyvät roskapostikansioon ja miten voin tarkistaa verkkotunnukseni maineen?](#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation)
  * [Mitä minun pitäisi tehdä, jos saan roskapostia](#what-should-i-do-if-i-receive-spam-emails)
  * [Miksi Gmailissa minulle lähetetyt testisähköpostit näkyvät "epäilyttävinä"?](#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious)
  * [Voinko poistaa via forwardemail-pistemerkinnän Gmailista?](#can-i-remove-the-via-forwardemail-dot-net-in-gmail)
* [Tiedonhallinta](#data-management)
  * [Missä palvelimenne sijaitsevat](#where-are-your-servers-located)
  * [Miten vien ja varmuuskopioin postilaatikon](#how-do-i-export-and-backup-my-mailbox)
  * [Miten tuon ja siirrän olemassa olevan postilaatikon](#how-do-i-import-and-migrate-my-existing-mailbox)
  * [Tuetteko omaa hostingia?](#do-you-support-self-hosting)
* [Sähköpostin määritys](#email-configuration)
  * [Miten pääsen alkuun ja määritän sähköpostin edelleenlähetyksen](#how-do-i-get-started-and-set-up-email-forwarding)
  * [Voinko käyttää useita MX-keskusten ja palvelimien toimintoja edistyneeseen edelleenlähetykseen?](#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding)
  * [Miten määritän lomaviestin (poissaoloviestin automaattisen vastaajan)?](#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder)
  * [Miten määritän SPF:n sähköpostin edelleenlähetystä varten](#how-do-i-set-up-spf-for-forward-email)
  * [Miten otan DKIM:n käyttöön sähköpostin edelleenlähetystä varten](#how-do-i-set-up-dkim-for-forward-email)
  * [Miten määritän DMARC:n sähköpostin edelleenlähetystä varten](#how-do-i-set-up-dmarc-for-forward-email)
  * [Miten yhdistän ja määritän yhteystiedot](#how-do-i-connect-and-configure-my-contacts)
  * [Miten yhdistän ja määritän kalenterini?](#how-do-i-connect-and-configure-my-calendars)
  * [Miten lisään kalentereita ja hallitsen olemassa olevia kalentereita?](#how-do-i-add-more-calendars-and-manage-existing-calendars)
  * [Miten määritän SRS:n sähköpostin edelleenlähetystä varten](#how-do-i-set-up-srs-for-forward-email)
  * [Miten määritän MTA-STS:n sähköpostin edelleenlähetystä varten](#how-do-i-set-up-mta-sts-for-forward-email)
  * [Miten lisään profiilikuvan sähköpostiosoitteeseeni](#how-do-i-add-a-profile-picture-to-my-email-address)
* [Lisäominaisuudet](#advanced-features)
  * [Tuetteko uutiskirjeitä tai postituslistoja markkinointiin liittyville sähköposteille?](#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email)
  * [Tuetteko sähköpostin lähettämistä API:n kautta?](#do-you-support-sending-email-with-api)
  * [Tuetko sähköpostin vastaanottamista IMAP-protokollan kautta?](#do-you-support-receiving-email-with-imap)
  * [Tuetko POP3-palvelua?](#do-you-support-pop3)
  * [Tuetteko kalentereita (CalDAV)?](#do-you-support-calendars-caldav)
  * [Tuetteko yhteystietoja (CardDAV)](#do-you-support-contacts-carddav)
  * [Tuetteko sähköpostin lähettämistä SMTP:n kautta?](#do-you-support-sending-email-with-smtp)
  * [Tuetteko OpenPGP/MIME:tä, päästä päähän -salausta ("E2EE") ja Web Key Directorya ("WKD")?](#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd)
  * [Tuetko MTA-STS:ää?](#do-you-support-mta-sts)
  * [Tuetteko todentamisavaimia ja WebAuthnia?](#do-you-support-passkeys-and-webauthn)
  * [Tuetko sähköpostin parhaita käytäntöjä](#do-you-support-email-best-practices)
  * [Tuetteko bounce-webhookeja?](#do-you-support-bounce-webhooks)
  * [Tuetteko webhookeja?](#do-you-support-webhooks)
  * [Tuetteko säännöllisiä lausekkeita tai regex-lausekkeita?](#do-you-support-regular-expressions-or-regex)
  * [Mitkä ovat lähtevän SMTP-viestien rajoituksesi?](#what-are-your-outbound-smtp-limits)
  * [Tarvitsenko hyväksynnän SMTP:n käyttöönottoon?](#do-i-need-approval-to-enable-smtp)
  * [Mitkä ovat SMTP-palvelimesi asetukset](#what-are-your-smtp-server-configuration-settings)
  * [Mitkä ovat IMAP-palvelimesi asetukset](#what-are-your-imap-server-configuration-settings)
  * [Mitkä ovat POP3-palvelimesi asetukset](#what-are-your-pop3-server-configuration-settings)
  * [Postfix SMTP -välityskonfiguraatio](#postfix-smtp-relay-configuration)
* [Turvallisuus](#security)
  * [Edistyneet palvelimen suojaustekniikat](#advanced-server-hardening-techniques)
  * [Onko sinulla SOC 2- tai ISO 27001 -sertifikaatit?](#do-you-have-soc-2-or-iso-27001-certifications)
  * [Käytätkö TLS-salausta sähköpostin edelleenlähetykseen](#do-you-use-tls-encryption-for-email-forwarding)
  * [Säilytätkö sähköpostin todennusotsikot?](#do-you-preserve-email-authentication-headers)
  * [Säilytätkö alkuperäiset sähköpostiotsikot ja estätkö väärentämisen?](#do-you-preserve-original-email-headers-and-prevent-spoofing)
  * [Miten suojaudut roskapostilta ja väärinkäytöksiltä](#how-do-you-protect-against-spam-and-abuse)
  * [Tallennatteko sähköpostisisältöä levylle?](#do-you-store-email-content-on-disk)
  * [Voiko sähköpostin sisältö paljastua järjestelmän kaatumisen aikana](#can-email-content-be-exposed-during-system-crashes)
  * [Kenellä on pääsy sähköposti-infrastruktuuriisi](#who-has-access-to-your-email-infrastructure)
  * [Mitä infrastruktuurin tarjoajia käytät](#what-infrastructure-providers-do-you-use)
  * [Tarjoatteko tietojenkäsittelysopimusta (DPA)?](#do-you-offer-a-data-processing-agreement-dpa)
  * [Miten käsittelette tietomurtoilmoituksia](#how-do-you-handle-data-breach-notifications)
  * [Tarjoatteko testiympäristöä](#do-you-offer-a-test-environment)
  * [Tarjoatteko valvonta- ja hälytystyökaluja?](#do-you-provide-monitoring-and-alerting-tools)
  * [Miten varmistat korkean käytettävyyden](#how-do-you-ensure-high-availability)
  * [Noudatatko kansallisen puolustusvaltuutuslain (NDAA) pykälän 889 määräyksiä?](#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa)
* [Järjestelmä ja tekniset tiedot](#system-and-technical-details)
  * [Tallennatteko sähköposteja ja niiden sisältöä](#do-you-store-emails-and-their-contents)
  * [Miten sähköpostin edelleenlähetysjärjestelmäsi toimii](#how-does-your-email-forwarding-system-work)
  * [Miten sähköpostia käsitellään edelleenlähetystä varten](#how-do-you-process-an-email-for-forwarding)
  * [Miten käsittelet sähköpostin toimitusongelmia](#how-do-you-handle-email-delivery-issues)
  * [Miten käsittelet IP-osoitteiden estymisen](#how-do-you-handle-your-ip-addresses-becoming-blocked)
  * [Mitä ovat postinjakajien osoitteet](#what-are-postmaster-addresses)
  * [Mitä ovat vastausta vaativat osoitteet?](#what-are-no-reply-addresses)
  * [Mitkä ovat palvelimesi IP-osoitteet](#what-are-your-servers-ip-addresses)
  * [Onko sinulla sallittujen lista](#do-you-have-an-allowlist)
  * [Mitkä verkkotunnuspäätteet ovat oletuksena sallittujen listalla](#what-domain-name-extensions-are-allowlisted-by-default)
  * [Mitkä ovat sallittujen listan kriteerisi?](#what-is-your-allowlist-criteria)
  * [Mitä verkkotunnuspäätteitä voi käyttää ilmaiseksi](#what-domain-name-extensions-can-be-used-for-free)
  * [Onko sinulla harmaa lista](#do-you-have-a-greylist)
  * [Onko sinulla kieltolistaa](#do-you-have-a-denylist)
  * [Onko teillä nopeusrajoitusta](#do-you-have-rate-limiting)
  * [Miten suojaudut takaisinsironnalta](#how-do-you-protect-against-backscatter)
  * [Estä tunnetuilta roskapostittajilta tulevan sähköpostin palautuminen](#prevent-bounces-from-known-mail-from-spammers)
  * [Estää tarpeettomat pomppimiset suojautuakseen takaisinhajottamiselta](#prevent-unnecessary-bounces-to-protect-against-backscatter)
  * [Miten sähköpostin sormenjälki tunnistetaan](#how-do-you-determine-an-email-fingerprint)
  * [Voinko lähettää sähköposteja edelleen muihin portteihin kuin 25 (esim. jos internet-palveluntarjoajani on estänyt portin 25)?](#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25)
  * [Tukeeko se plus-merkkiä (+) Gmail-aliaksille?](#does-it-support-the-plus--symbol-for-gmail-aliases)
  * [Tukeeko se aliverkkotunnuksia](#does-it-support-sub-domains)
  * [Lähettääkö tämä sähköpostini otsikot edelleen?](#does-this-forward-my-emails-headers)
  * [Onko tämä hyvin testattu](#is-this-well-tested)
  * [Välitätkö SMTP-vastausviestejä ja -koodeja?](#do-you-pass-along-smtp-response-messages-and-codes)
  * [Kuinka estät roskapostittajat ja varmistat hyvän sähköpostin edelleenlähetysmaineen](#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation)
  * [Miten teet DNS-hakuja verkkotunnuksille?](#how-do-you-perform-dns-lookups-on-domain-names)
* [Tili ja laskutus](#account-and-billing)
  * [Tarjoatteko rahat takaisin -takuun maksullisille paketeille?](#do-you-offer-a-money-back-guarantee-on-paid-plans)
  * [Jos vaihdan liittymää, hyvitättekö erotuksen?](#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference)
  * [Voinko käyttää tätä sähköpostin edelleenlähetyspalvelua vain "varapalvelimena" tai "varapalvelimena" MX-palvelimena?](#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server)
  * [Voinko poistaa käytöstä tiettyjä aliaksia](#can-i-disable-specific-aliases)
  * [Voinko lähettää sähköposteja useille vastaanottajille](#can-i-forward-emails-to-multiple-recipients)
  * [Voinko määrittää useita globaaleja keräilyvastaanottajia?](#can-i-have-multiple-global-catch-all-recipients)
  * [Onko olemassa yläraja sille, kuinka monta sähköpostiosoitetta voin edelleenlähettää aliasta kohden?](#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias)
  * [Voinko lähettää sähköposteja rekursiivisesti edelleen](#can-i-recursively-forward-emails)
  * [Voivatko ihmiset poistaa sähköpostin edelleenlähetykseni tai rekisteröidä sen ilman lupaani?](#can-people-unregister-or-register-my-email-forwarding-without-my-permission)
  * [Miten se on ilmaista](#how-is-it-free)
  * [Mikä on sähköpostin enimmäiskokorajoitus?](#what-is-the-max-email-size-limit)
  * [Tallennatteko sähköpostilokeja](#do-you-store-logs-of-emails)
  * [Tallennatteko virhelokeja](#do-you-store-error-logs)
  * [Luetko sähköpostejani](#do-you-read-my-emails)
  * [Voinko lähettää sähköpostia nimellä Gmailissa tällä?](#can-i-send-mail-as-in-gmail-with-this)
  * [Voinko lähettää sähköpostia nimellä Outlookissa tällä?](#can-i-send-mail-as-in-outlook-with-this)
  * [Voinko lähettää sähköpostia nimellä Apple Mailissa ja iCloud Mailissa tällä?](#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this)
  * [Voinko lähettää rajattomasti sähköposteja tällä](#can-i-forward-unlimited-emails-with-this)
  * [Tarjoatteko rajattomasti verkkotunnuksia yhteen hintaan](#do-you-offer-unlimited-domains-for-one-price)
  * [Mitä maksutapoja hyväksytte](#which-payment-methods-do-you-accept)
* [Lisäresurssit](#additional-resources)

## Pika-aloitus {#quick-start}

Sähköpostin edelleenlähetyksen aloittaminen:

1. **Luo tili** osoitteessa [forwardemail.net/register](https://forwardemail.net/register)

2. **Lisää ja vahvista verkkotunnuksesi** kohdassa [Oma tili → Verkkotunnukset](/my-account/domains)

3. **Lisää ja määritä sähköpostialiaksia/postilaatikoita** kohdassa [Oma tili → Verkkotunnukset](/my-account/domains) → Aliakset

4. **Testaa asetukset** lähettämällä sähköpostia yhdelle uusista aliaksistasi.

> \[!TIP]
> DNS-muutosten voimaantulo maailmanlaajuisesti voi kestää jopa 24–48 tuntia, vaikka ne tulevat usein voimaan paljon nopeammin.

> \[!IMPORTANT]
> Toimitettavuuden parantamiseksi suosittelemme [SPF](#how-do-i-set-up-spf-for-forward-email)-, [DKIM](#how-do-i-set-up-dkim-for-forward-email)- ja [DMARC](#how-do-i-set-up-dmarc-for-forward-email)-tietueiden määrittämistä.

## Johdanto {#introduction}

### Mikä on sähköpostin edelleenlähetys {#what-is-forward-email}

> \[!NOTE]
> Sähköpostin edelleenlähetys on täydellinen valinta yksityishenkilöille, pienyrityksille ja kehittäjille, jotka haluavat ammattimaiset sähköpostiosoitteet ilman täyden sähköpostipalvelun ylläpitokustannuksia.

Forward Email on **täysin varusteltu sähköpostipalveluntarjoaja** ja **sähköpostipalveluntarjoaja mukautetuille verkkotunnuksille**.

Se on ainoa ilmainen ja avoimen lähdekoodin palvelu, jonka avulla voit käyttää mukautettuja verkkotunnussähköpostiosoitteita ilman oman sähköpostipalvelimen määrittämisen ja ylläpidon monimutkaisuutta.

Palvelumme välittää mukautettuun verkkotunnukseesi lähetetyt sähköpostit olemassa olevaan sähköpostitiliisi – ja voit jopa käyttää meitä erillisenä sähköpostipalveluntarjoajanasi.

Sähköpostin edelleenlähetyksen tärkeimmät ominaisuudet:

* **Mukautettu verkkotunnussähköposti**: Käytä ammattimaisia sähköpostiosoitteita omalla verkkotunnuksellasi
* **Ilmainen taso**: Perussähköpostin edelleenlähetys ilmaiseksi
* **Parannettu yksityisyys**: Emme lue sähköpostejasi tai myy tietojasi
* **Avoin lähdekoodi**: Koko koodikanta on saatavilla GitHubissa
* **SMTP-, IMAP- ja POP3-tuki**: Täydelliset sähköpostin lähetys- ja vastaanotto-ominaisuudet
* **Päästä päähän -salaus**: Tuki OpenPGP/MIME:lle
* **Mukautetut Catch-All-aliakset**: Luo rajattomasti sähköpostialiaksia

Voit verrata meitä yli 56 muuhun sähköpostipalveluntarjoajaan osoitteessa [sähköpostivertailusivumme](/blog/best-email-service).

> \[!TIP]
> Lue lisää sähköpostin edelleenlähetyksestä lukemalla ilmainen [Tekninen raportti](/technical-whitepaper.pdf)-oppaamme

### Kuka käyttää sähköpostin edelleenlähetystä {#who-uses-forward-email}

Tarjoamme sähköpostin ylläpito- ja edelleenlähetyspalveluita yli 500 000 verkkotunnukselle ja näille merkittäville käyttäjille:

| Asiakas | Tapaustutkimus |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Yhdysvaltain laivastoakatemia | [:page_facing_up: Case Study](/blog/docs/federal-government-email-service-section-889-compliant) |
| Kanoninen | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| Netflix-pelit |  |
| Linux-säätiö | [:page_facing_up: Case Study](/blog/docs/linux-foundation-email-enterprise-case-study) |
| PHP-säätiö |  |
| Fox News Radio |  |
| Disney-mainosmyynti |  |
| jQuery | [:page_facing_up: Case Study](/blog/docs/linux-foundation-email-enterprise-case-study) |
| LineageOS |  |
| Ubuntu | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| Ilmainen | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| Lubuntu | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| Cambridgen yliopisto | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| Marylandin yliopisto | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| Washingtonin yliopisto | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| Tuftsin yliopisto | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| Swarthmore College | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| Etelä-Australian hallitus |  |
| Dominikaanisen tasavallan hallitus |  |
| Lennä<span>.</span>io |  |
| RCD-hotellit |  |
| Isaac Z. Schlueter (npm) | [:page_facing_up: Case Study](/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem) |
| David Heinemeier Hansson (Ruby on Rails) |  |

### Mikä on edelleenlähetetyn sähköpostin historia? {#what-is-forward-emails-history}

Voit lukea lisää sähköpostin edelleenlähetyksestä osoitteesta [Tietoja-sivumme](/about).

### Kuinka nopea tämä palvelu on {#how-fast-is-this-service}

> \[!NOTE]
> Järjestelmämme on suunniteltu nopeaksi ja luotettavaksi, ja siinä on useita redundantteja palvelimia, jotka varmistavat sähköpostiesi nopean toimituksen.

Sähköpostin välityspalvelu toimittaa viestit minimaalisella viiveellä, tyypillisesti muutamassa sekunnissa vastaanottamisesta.

Suorituskykymittarit:

* **Keskimääräinen toimitusaika**: Alle 5–10 sekuntia vastaanotosta edelleenlähetykseen ([katso postilaatikkoon saapumisajan seurantasivumme (TTI)](/tti))
* **Käyttöaika**: Palvelun saatavuus yli 99,9 %
* **Globaali infrastruktuuri**: Palvelimet strategisesti sijoitettuina optimaalista reititystä varten
* **Automaattinen skaalaus**: Järjestelmämme skaalautuu sähköpostin ruuhka-aikoina

Toimimme reaaliajassa, toisin kuin muut palveluntarjoajat, jotka luottavat viivästyneisiin jonoihin.

Emme kirjoita levylle emmekä tallenna lokeja – käytämme [virheitä lukuun ottamatta](#do-you-store-error-logs)- ja [lähtevä SMTP](#do-you-support-sending-email-with-smtp)-muuttujaa (katso [Tietosuojakäytäntö](/privacy)).

Kaikki tehdään muistissa ja [lähdekoodimme on GitHubissa](https://github.com/forwardemail)-kohteessa.

## Sähköpostiohjelmat {#email-clients}

VÄLIAIKAINEN_PAIKKAPIDÄN_0 Thunderbird {VÄLIAIKAINEN_PAIKKAPIDÄN_1

1. Luo uusi alias ja luo salasana sähköpostin edelleenlähetyshallintapaneelissa.
2. Avaa Thunderbird ja mene kohtaan **Muokkaa → Tilin asetukset → Tilin toiminnot → Lisää sähköpostitili**.
3. Anna nimesi, sähköpostin edelleenlähetysosoitteesi ja salasanasi.
4. Napsauta **Määritä manuaalisesti** ja anna:
* Saapuva: IMAP, `imap.forwardemail.net`, portti 993, SSL/TLS
* Lähtevä: SMTP, `smtp.forwardemail.net`, portti 587, STARTTLS
5. Napsauta **Valmis**.

### Microsoft Outlook {#microsoft-outlook}

1. Luo uusi alias ja luo salasana Sähköpostin välityshallintapaneelissa.
2. Siirry kohtaan **Tiedosto → Lisää tili**.
3. Anna sähköpostin välitysosoitteesi ja napsauta **Yhdistä**.
4. Valitse **Lisäasetukset** ja valitse **Anna minun määrittää tilini manuaalisesti**.
5. Valitse **IMAP** ja syötä:
* Saapuva: `imap.forwardemail.net`, portti 993, SSL
* Lähtevä: `smtp.forwardemail.net`, portti 587, TLS
* Käyttäjätunnus: Koko sähköpostiosoitteesi
* Salasana: Luomasi salasana
6. Napsauta **Yhdistä**.

### Apple Mail {#apple-mail}

1. Luo uusi alias ja luo salasana Sähköpostin edelleenlähetyshallintapaneelissa.
2. Siirry kohtaan **Sähköposti → Asetukset → Tilit → +**.
3. Valitse **Muu sähköpostitili**.
4. Anna nimesi, Sähköpostin edelleenlähetysosoitteesi ja salasanasi.
5. Palvelimen asetuksiin anna:
* Saapuva: `imap.forwardemail.net`
* Lähtevä: `smtp.forwardemail.net`
* Käyttäjätunnus: Koko sähköpostiosoitteesi
* Salasana: Luomasi salasana.
6. Napsauta **Kirjaudu sisään**.

### Mobiililaitteet {#mobile-devices}

iOS:lle:

1. Siirry kohtaan **Asetukset → Sähköposti → Tilit → Lisää tili → Muu**
2. Napauta **Lisää sähköpostitili** ja anna tietosi
3. Käytä palvelinasetuksissa samoja IMAP- ja SMTP-asetuksia kuin yllä

Androidille:

1. Siirry kohtaan **Asetukset → Tilit → Lisää tili → Henkilökohtainen (IMAP)**
2. Anna edelleenlähetyssähköpostiosoitteesi ja salasanasi
3. Käytä palvelinasetuksissa samoja IMAP- ja SMTP-asetuksia kuin yllä

### Sähköpostin lähettäminen Gmailissa {#how-to-send-mail-as-using-gmail}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Arvioitu asennusaika:</strong>
<span>Alle 10 minuuttia</span>
</div>

<div class="alert mb-3 alert-success">
<i class="fa fa-bullhorn font-weight-bold"></i>
<strong class="font-weight-bold">
Aloittaminen:
</strong>
<span>
Jos olet noudattanut yllä olevia ohjeita kohdassa <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">Aloitus ja sähköpostin edelleenlähetyksen määrittäminen</a>, voit jatkaa lukemista alta.
</span>
</div>

<div id="lähetä sähköpostia sisällönä">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tärkeää:
</strong>
<span>
Varmista, että olet lukenut <a href="/terms" class="alert-link" target="_blank">käyttöehtomme</a>, <a href="/privacy" class="alert-link" target="_blank">tietosuojakäytäntömme</a> ja <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">lähtevän SMTP-liikenteen rajoituksemme</a> – käyttösi katsotaan tiedoksi ja hyväksyt sen.
</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tärkeää:
</strong>
<span>
Jos olet kehittäjä, tutustu <a class="alert-link" href="/email-api#outbound-emails" target="_blank">sähköpostirajapinnan dokumentaatioomme</a>.
</span>
</div>

1. Siirry kohtaan <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Oma tili <i class="fa fa-angle-right"></i> Verkkotunnukset</a> <i class="fa fa-angle-right"></i> Asetukset <i class="fa fa-angle-right"></i> Lähtevän SMTP:n asetukset ja noudata asennusohjeita.

2. Luo verkkotunnuksellesi uusi alias kohdassa <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Oma tili <i class="fa fa-angle-right"></i> Verkkotunnukset</a> <i class="fa fa-angle-right"></i> Aliakset (esim. <code><hello@example.com></code>)

3. Napsauta <strong class="text-success"><i class="fa fa-key"></i>Luo salasana</strong> -painiketta juuri luodun aliaksen vieressä. Kopioi leikepöydälle ja tallenna näytöllä näkyvä luotu salasana turvallisesti.

4. Siirry kohtaan [Gmail](https://gmail.com) ja napsauta kohdassa [Asetukset <i class="fa fa-angle-right"></i> Tilit ja tuonti <i class="fa fa-angle-right"></i> Lähetä sähköpostia muodossa](https://mail.google.com/mail/u/0/#settings/accounts) kohtaa "Lisää toinen sähköpostiosoite".

5. Kun sinulta kysytään "Nimi", anna nimi, jolla haluat sähköpostisi näkyvän "Lähettäjä"-kentässä (esim. "Linus Torvalds").

6. Kun sinulta kysytään "Sähköpostiosoite", anna luomasi aliaksen koko sähköpostiosoite kohdassa <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Oma tili <i class="fa fa-angle-right"></i> Verkkotunnukset</a> <i class="fa fa-angle-right"></i> Aliakset (esim. <code><hello@example.com></code>)

7. Poista valinta kohdasta "Käsittele aliaksena"

8. Jatka napsauttamalla "Seuraava vaihe"

9. Kun sinulta kysytään "SMTP-palvelin", kirjoita <code>smtp.forwardemail.net</code> ja jätä portiksi <code>587</code>.

10. Kun sinulta kysytään "Käyttäjätunnusta", anna luomasi aliaksen koko sähköpostiosoite kohdassa <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Oma tili <i class="fa fa-angle-right"></i> Verkkotunnukset</a> <i class="fa fa-angle-right"></i> Aliakset (esim. <code><hello@example.com></code>)

11. Kun sinulta kysytään salasanaa, liitä salasana kohdasta <strong class="text-success"><i class="fa fa-key"></i>Luo salasana</strong> yllä olevassa vaiheessa 3.

12. Jätä valintanappi "Suojattu yhteys TLS:n avulla" valituksi.

13. Jatka napsauttamalla "Lisää tili"

14. Avaa uusi välilehti [Gmail](https://gmail.com)-sivustolle ja odota vahvistussähköpostin saapumista (saat vahvistuskoodin, joka vahvistaa, että olet sen sähköpostiosoitteen omistaja, jota yrität lähettää sähköpostitse).

15. Kun se saapuu, kopioi ja liitä vahvistuskoodi edellisessä vaiheessa saamaasi kehotteeseen.

16. Kun olet tehnyt sen, palaa sähköpostiin ja napsauta linkkiä "vahvista pyyntö". Sinun on todennäköisesti tehtävä tämä ja edellinen vaihe, jotta sähköposti määritetään oikein.

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Onnittelut!
</strong>
<span>
Olet suorittanut kaikki vaiheet onnistuneesti.
</span>
</div>
</div>

</div>

### Mikä on vanha ilmainen opas Lähetä sähköpostia nimellä -toiminnolle Gmailissa? {#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail}

<div class="alert my-3 alert-danger"><i class="fa fa-stop-circle font-weight-bold"></i> <strong class="font-weight-bold">Tärkeää:</strong> Tämä vanha ilmainen opas on vanhentunut toukokuusta 2023 lähtien, koska <a class="alert-link" href="/faq#do-you-support-sending-email-with-smtp">we tukee nyt lähtevää SMTP:tä</a>. Jos käytät alla olevaa opasta, <a class="alert-link" href="/faq#can-i-remove-the-via-forwardemail-dot-net-in-gmail">this saa lähtevän sähköpostisi</a> näkyviin Gmailissa tekstin "<span class="notranslate text-danger font-weight-bold">via forwardemail dot net</span>".</a></div>

<div class="alert mb-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Arvioitu asennusaika:</strong>
<span>Alle 10 minuuttia</span>
</div>

<div class="alert mb-3 alert-success">
<i class="fa fa-bullhorn font-weight-bold"></i>
<strong class="font-weight-bold">
Aloittaminen:
</strong>
<span>
Jos olet noudattanut yllä olevia ohjeita kohdassa <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">Aloitus ja sähköpostin edelleenlähetyksen määrittäminen</a>, voit jatkaa lukemista alta.
</span>
</div>

<div class="mx-auto lazyframe lazyframe-bordered border border-themed mb-3" data-vendor="youtube_nocookie" title="Kuinka lähettää sähköpostia nimellä Gmailissa" data-src="https://www.youtube-nocookie.com/embed/MEheS8gM4Xs?autoplay=0"></div>

<div id="legacy-free-opas">

1. Jotta tämä toimisi, sinulla on oltava käytössä [Gmailin kaksivaiheinen todennus][gmail-2fa]. Jos se ei ole käytössä, käy osoitteessa <https://www.google.com/landing/2step/>.

2. Kun kaksivaiheinen todennus on käytössä (tai jos se oli jo käytössä), siirry osoitteeseen <https://myaccount.google.com/apppasswords>.

3. Kun sinulta kysytään "Valitse sovellus ja laite, jolle haluat luoda sovelluksen salasanan":
* Valitse "Sähköposti" "Valitse sovellus" -kohdan avattavasta valikosta.
* Valitse "Muu" "Valitse laite" -kohdan avattavasta valikosta.
* Kun sinulta pyydetään tekstisyötettä, anna mukautetun verkkotunnuksesi sähköpostiosoite, josta viestit lähetetään (esim. <koodi><hello@example.com></koodi> - tämä auttaa sinua seuraamaan tilannetta, jos käytät tätä palvelua useilla tileillä).

4. Kopioi automaattisesti luotu salasana leikepöydälle
<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tärkeää:
</strong>
<span>
Jos käytät G Suitea, siirry hallintapaneeliisi <a class="alert-link" href="https://admin.google.com/AdminHome#ServiceSettings/service=email&subtab=filters" rel="noopener noreferrer" target="_blank">Sovellukset <i class="fa fa-angle-right"></i> G Suite <i class="fa fa-angle-right"></i> Gmailin asetukset <i class="fa fa-angle-right"></i> Asetukset</a> ja varmista, että valitset vaihtoehdon "Salli käyttäjien lähettää sähköpostia ulkoisen SMTP-palvelimen kautta...". Muutoksen voimaantulossa on jonkin verran viivettä, joten odota muutama minuutti.
</span>
</div>

5. Siirry kohtaan [Gmail](https://gmail.com) ja napsauta kohdassa [Asetukset <i class="fa fa-angle-right"></i> Tilit ja tuonti <i class="fa fa-angle-right"></i> Lähetä sähköpostia muodossa](https://mail.google.com/mail/u/0/#settings/accounts) kohtaa "Lisää toinen sähköpostiosoite".

6. Kun sinulta kysytään "Nimi", anna nimi, jolla haluat sähköpostisi näkyvän "Lähettäjä"-kentässä (esim. "Linus Torvalds")

7. Kun sinulta kysytään "Sähköpostiosoite", anna sähköpostiosoite ja yllä käyttämäsi mukautettu verkkotunnus (esim. <koodi><hello@example.com></koodi>).

8. Poista valinta kohdasta "Käsittele aliaksena"

9. Jatka napsauttamalla "Seuraava vaihe"

10. Kun sinulta kysytään "SMTP-palvelin", kirjoita <code>smtp.gmail.com</code> ja jätä portiksi <code>587</code>.

11. Kun sinulta pyydetään käyttäjätunnusta, anna Gmail-osoitteesi osa ilman <span>gmail.com</span>-osaa (esim. vain "käyttäjä", jos sähköpostiosoitteeni on <span><user@gmail.com></span>)
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tärkeää:
</strong>
<span>
Jos "Käyttäjätunnus"-osio täytetään automaattisesti, <u><strong>sinun on muutettava se</strong></u> Gmail-osoitteesi käyttäjätunnusosaan.
</span>
</div>

12. Kun sinulta kysytään salasanaa, liitä leikepöydältä yllä vaiheessa 2 luomasi salasana.

13. Jätä valintanappi "Suojattu yhteys TLS:n avulla" valituksi.

14. Jatka napsauttamalla "Lisää tili"

15. Avaa uusi välilehti [Gmail](https://gmail.com)-sivustolle ja odota vahvistussähköpostin saapumista (saat vahvistuskoodin, joka vahvistaa, että olet sen sähköpostiosoitteen omistaja, jota yrität lähettää sähköpostitse).

16. Kun se saapuu, kopioi ja liitä vahvistuskoodi edellisessä vaiheessa saamaasi kehotteeseen.

17. Kun olet tehnyt sen, palaa sähköpostiin ja napsauta linkkiä "vahvista pyyntö". Sinun on todennäköisesti tehtävä tämä ja edellinen vaihe, jotta sähköposti määritetään oikein.

</div>

### Gmailin reitityksen lisäasetukset {#advanced-gmail-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Arvioitu asennusaika:</strong>
<span>15–30 minuuttia</span>
</div>

Jos haluat määrittää Gmailin reitityksen lisäasetukset siten, että sähköpostilaatikkoon vastaamattomat aliakset välittävät viestit Forward Email -palvelun sähköpostivaihtoon, toimi seuraavasti:

1. Kirjaudu Google-hallintakonsoliin osoitteessa [admin.google.com](https://admin.google.com)
2. Siirry kohtaan **Sovellukset → Google Workspace → Gmail → Reititys**
3. Napsauta **Lisää reitti** ja määritä seuraavat asetukset:

**Yksittäisen vastaanottajan asetukset:**

* Valitse "Vaihda kirjekuoren vastaanottaja" ja anna ensisijainen Gmail-osoitteesi
* Valitse "Lisää X-Gm-Original-To-otsikko alkuperäisen vastaanottajan kanssa"

**Kirjekuoren vastaanottajan mallit:**

* Lisää malli, joka vastaa kaikkia olemattomia postilaatikoita (esim. `.*@yourdomain.com`)

**Sähköpostipalvelimen asetukset:**

* Valitse "Reitti isäntään" ja anna `mx1.forwardemail.net` ensisijaiseksi palvelimeksi
* Lisää `mx2.forwardemail.net` varapalvelimeksi
* Aseta portiksi 25
* Valitse "Vaadi TLS suojauksen vuoksi"

4. Luo reitti napsauttamalla **Tallenna**

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tärkeää:
</strong>
<span>
Tämä määritys toimii vain Google Workspace -tileillä, joilla on mukautetut verkkotunnukset, ei tavallisilla Gmail-tileillä.
</span>
</div>

### Outlookin reitityksen lisäasetukset {#advanced-outlook-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Arvioitu asennusaika:</strong>
<span>15–30 minuuttia</span>
</div>

Microsoft 365:n (entinen Office 365) käyttäjille, jotka haluavat määrittää edistyneen reitityksen niin, että postilaatikkoon vastaamattomat aliakset välittävät viestit edelleen Lähetä sähköposti -palvelun sähköpostivaihtoon:

1. Kirjaudu Microsoft 365 -hallintakeskukseen osoitteessa [admin.microsoft.com](https://admin.microsoft.com)
2. Siirry kohtaan **Exchange → Sähköpostin kulku → Säännöt**
3. Napsauta **Lisää sääntö** ja valitse **Luo uusi sääntö**
4. Nimeä sääntösi (esim. "Lähetä olemattomat postilaatikot edelleen Lähetä sähköpostia" -kohtaan)
5. Valitse kohdassa **Käytä tätä sääntöä, jos**:
* "Vastaanottajan osoite vastaa..."
* Anna malli, joka vastaa kaikkia verkkotunnuksesi osoitteita (esim. `*@yourdomain.com`)
6. Valitse kohdassa **Tee seuraavat**:
* "Ohjaa viesti uudelleen..."
* Valitse "Seuraava sähköpostipalvelin"
* Kirjoita `mx1.forwardemail.net` ja portti 25
* Lisää `mx2.forwardemail.net` varapalvelimeksi
7. Valitse kohdassa **Paitsi jos**:
* "Vastaanottaja on..."
* Lisää kaikki olemassa olevat postilaatikot, joita ei pitäisi edelleenlähettää
8. Aseta säännön prioriteetti varmistaaksesi, että se suoritetaan muiden sähköpostin kulkusääntöjen jälkeen
9. Aktivoi napsauttamalla **Tallenna** sääntö

## Vianmääritys {#troubleshooting}

### Miksi en saa testisähköpostejani {#why-am-i-not-receiving-my-test-emails}

Jos lähetät testisähköpostin itsellesi, se ei välttämättä näy postilaatikossasi, koska siinä on sama "Message-ID"-otsikko.

Tämä on laajalti tunnettu ongelma, ja se vaikuttaa myös palveluihin, kuten Gmailiin. <a href="https://support.google.com/a/answer/1703601">Here on Gmailin virallinen vastaus tähän ongelmaan</a>.

Jos ongelmat jatkuvat, kyseessä on todennäköisesti DNS-etenemisongelma. Sinun on odotettava hieman kauemmin ja yritettävä uudelleen (tai yritettävä asettaa alhaisempi TTL-arvo TXT-tietueillesi).

**Onko ongelmia edelleen?** <a href="/help">ota meihin yhteyttä</a>, jotta voimme tutkia ongelmaa ja löytää nopean ratkaisun.

### Miten määritän sähköpostiohjelmani toimimaan sähköpostin edelleenlähetyksen kanssa? {#how-do-i-configure-my-email-client-to-work-with-forward-email}

<div class="mb-3">
Palvelumme toimii suosittujen sähköpostiohjelmien, kuten:
<ul class="ml-1 h4 d-inline list-inline mb-0 pl-0">
<li class="list-inline-item"><a href="/blog/open-source/apple-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Apple&reg;</a></li>
<li class="list-inline-item"><a href="/blog/open-source/windows-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Windows&reg;</a></li>
<li class="list-inline-item"><a href="/blog/open-source/android-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-android"></i> Android&trade;</a></li>
<li class="list-inline-item"><a href="/blog/open-source/linux-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-linux"></i> Linux&reg;</a></li>
<li class="list-inline-item"><a href="/blog/open-source/desktop-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fas fa-desktop"></i> Työpöytä</a></li>
<li class="list-inline-item"><a href="/blog/open-source/mozilla-firefox-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-firefox-browser"></i> Mozilla Firefox</a></li>
<li class="list-inline-item"><a href="/blog/open-source/safari-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Safari</a></li>
<li class="list-inline-item"><a href="/blog/open-source/google-chrome-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-chrome"></i> Google Chrome</a></li>
<li class="list-inline-item"><a href="/blog/open-source/terminal-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fas fa-terminal"></i> Pääte</a></li>
</ul>
</div>

<div class="alert alert-primary">
Käyttäjätunnuksesi on aliaksesi sähköpostiosoite ja salasana on kohdasta <strong class="text-success"><i class="fa fa-key"></i>Luo salasana</strong> ("Normaali salasana").
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Vinkki:
</strong>
<span>Jos käytät Thunderbirdiä, varmista, että "Yhteyden suojaus" -asetukseksi on asetettu "SSL/TLS" ja todennusmenetelmäksi on asetettu "Normaali salasana".</span>
</div>

| Tyyppi | Isäntänimi | Protokolla | Portit |
| :--: | :---------------------: | :-------------------------------------: | :----------------------------------------------------------------------------------: |
| IMAP | `imap.forwardemail.net` | SSL/TLS **Suositeltu** | `993` ja `2993` |
| SMTP | `smtp.forwardemail.net` | SSL/TLS **Suositeltu** tai TLS (STARTTLS) | `465` ja `2465` SSL/TLS-salausta varten (tai) `587`, `2587`, `2525` ja `25` TLS-salausta varten (STARTTLS) |

### Miksi sähköpostini päätyvät roskapostikansioon ja miten voin tarkistaa verkkotunnukseni maineen {#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation}

Tässä osiossa neuvotaan, jos lähtevä postisi käyttää SMTP-palvelimiamme (esim. `smtp.forwardemail.net`) (tai lähetetään edelleen `mx1.forwardemail.net`:n tai `mx2.forwardemail.net`:n kautta) ja se toimitetaan vastaanottajien roskapostikansioon.

Seuraamme rutiininomaisesti [IP-osoitteet](#what-are-your-servers-ip-addresses)-ominaisuuttamme [kaikki hyvämaineiset DNS-estolistat](#how-do-you-handle-your-ip-addresses-becoming-blocked)-ominaisuutta vasten, **siksi kyseessä on todennäköisesti verkkotunnuksen maineeseen liittyvä ongelma**.

Sähköpostit voivat päätyä roskapostikansioon useista syistä:

1. **Puuttuva todennus**: Määritä tietueet [SPF](#how-do-i-set-up-spf-for-forward-email), [DKIM](#how-do-i-set-up-dkim-for-forward-email) ja [DMARC](#how-do-i-set-up-dmarc-for-forward-email).

2. **Verkkotunnuksen maine**: Uusilla verkkotunnuksilla on usein neutraali maine, kunnes ne luovat lähetyshistorian.

3. **Sisältöä laukaisevat tekijät**: Tietyt sanat tai lauseet voivat laukaista roskapostisuodattimet.

4. **Lähetysmallit**: Sähköpostimäärän äkillinen kasvu voi näyttää epäilyttävältä.

Voit kokeilla yhtä tai useampaa näistä työkaluista tarkistaaksesi verkkotunnuksesi maineen ja luokittelun:

| Työkalun nimi | URL | Tyyppi |
| ------------------------------------------- | ---------------------------------------------------------------- | ---------------------- |
| Cloudflare-verkkotunnusten luokittelun palaute | <https://radar.cloudflare.com/domains/feedback> | Luokittelu |
| Spamhaus IP- ja verkkotunnusten maineentarkistin | <https://check.spamhaus.org/> | DNSBL |
| Cisco Talos IP- ja verkkotunnusten mainekeskus | <https://talosintelligence.com/reputation_center> | Maine |
| Barracudan IP-osoitteen ja verkkotunnuksen maineen haku | <https://www.barracudacentral.org/lookups/lookup-reputation> | DNSBL |
| MX Toolboxin mustan listan tarkistus | <https://mxtoolbox.com/blacklists.aspx> | Musta lista |
| Google Postmaster -työkalut | <https://www.gmail.com/postmaster/> | Maine |
| Yahoo Sender Hub | <https://senders.yahooinc.com/> | Maine |
| MultiRBL.valli.org Mustan listan tarkistus | <https://multirbl.valli.org/lookup/> | DNSBL |
| Lähettäjän pisteet | <https://senderscore.org/act/blocklist-remover/> | Maine |
| Arvostus | <https://www.invaluement.com/lookup/> | DNSBL |
| SURBL | <https://www.surbl.org/> | DNSBL |
| Apple/Proofpoint IP-osoitteen poisto | <https://ipcheck.proofpoint.com/> | Poistaminen |
| Cloudmark IP-osoitteen poisto | <https://csi.cloudmark.com/en/reset/> | Poistaminen |
| SpamCop | <https://www.spamcop.net/bl.shtml> | DNSBL |
| Microsoft Outlookin ja Office 365:n IP-osoitteiden poisto | <https://sendersupport.olc.protection.outlook.com/pm/Postmaster> | Poistaminen |
| UCEPROTECTin tasot 1, 2 ja 3 | <https://www.uceprotect.net/en/rblcheck.php> | DNSBL |
| UCEPROTECTin backscatterer.org | <https://www.backscatterer.org/> | Takaisinhajontasuoja |
| UCEPROTECTin whitelisted.org | <https://www.whitelisted.org/> (maksullinen) | DNSWL |
| AT&T | `abuse_rbl@abuse-att.net` | Poistaminen |
| AOL/Verizon (esim. `[IPTS04]`) | <https://senders.yahooinc.com/> | Poistaminen |
| Cox Communications | `unblock.request@cox.net` | Poistaminen |
| t-online.de (saksa/T-Mobile) | `tobr@rx.t-online.de` | Poistaminen |

> \[!TIP]
> Aloita lähettämällä pienemmän määrän, mutta laadukkaita sähköposteja rakentaaksesi positiivisen maineen ennen kuin lähetät suurempia määriä.

> \[!IMPORTANT]
> Jos verkkotunnuksesi on mustalla listalla, jokaisella mustalla listalla on oma poistoprosessinsa. Tarkista ohjeet heidän verkkosivuiltaan.

> \[!TIP]
> Jos tarvitset lisäapua tai huomaat, että jokin sähköpostipalveluntarjoaja on luokitellut meidät roskapostiksi, <a href="/help">ota meihin yhteyttä</a>.

### Mitä minun pitäisi tehdä, jos saan roskapostia {#what-should-i-do-if-i-receive-spam-emails}

Sinun kannattaa peruuttaa sähköpostilistan tilaus (jos mahdollista) ja estää lähettäjä.

Älä ilmoita viestiä roskapostiksi, vaan lähetä se edelleen manuaalisesti kuratoituun ja yksityisyyteen keskittyvään väärinkäytösten estämisjärjestelmällemme.

**Roskapostin edelleenlähetyssähköpostiosoite on:** <abuse@forwardemail.net>

### Miksi minulle lähetetyt testisähköpostit Gmailissa näkyvät "epäilyttävinä" {#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious}

Jos näet tämän virheilmoituksen Gmailissa, kun lähetät itsellesi testiviestin tai kun henkilö, jolle lähetät sähköpostia alias-tunnuksellasi, näkee sinulta sähköpostin ensimmäistä kertaa, **älä huoli** – tämä on Gmailin sisäänrakennettu turvaominaisuus.

Voit yksinkertaisesti napsauttaa "Näyttää turvalliselta". Jos esimerkiksi lähetät testiviestin Lähetä sähköpostia osoitteeseen -toiminnolla (jollekulle toiselle), hän ei näe tätä viestiä.

Jos he kuitenkin näkevät tämän viestin, se johtuu siitä, että he ovat tottuneet näkemään sähköpostiesi tulevan osoitteesta <john@gmail.com> osoitteen <john@customdomain.com> sijaan (vain esimerkki). Gmail ilmoittaa käyttäjille varmistaakseen, että asiat ovat turvassa varmuuden vuoksi, eikä tähän ole kiertotietä.

### Voinko poistaa via forwardemail-pistemerkinnän Gmailissa {#can-i-remove-the-via-forwardemail-dot-net-in-gmail}

Tämä aihe liittyy [Gmailissa yleisesti tunnettu ongelma, jossa lähettäjän nimen vieressä näkyy lisätietoja](https://support.google.com/mail/answer/1311182)-kohteeseen.

Toukokuusta 2023 alkaen tuemme sähköpostin lähettämistä SMTP:n avulla lisäosana kaikille maksaville käyttäjille – tämä tarkoittaa, että voit poistaa <span class="notranslate">via forwardemail dot net</span> -tunnisteen Gmailissa.

Huomaa, että tämä usein kysyttyjen kysymysten aihe on tarkoitettu erityisesti [Kuinka lähettää sähköpostia Gmailin avulla](#how-to-send-mail-as-using-gmail)-ominaisuuden käyttäjille.

Katso määritysohjeet [Tuetteko sähköpostin lähettämistä SMTP:n kautta?](#do-you-support-sending-email-with-smtp)-osiosta.

## Tiedonhallinta {#data-management}

### Missä palvelimesi sijaitsevat {#where-are-your-servers-located}

> \[!TIP]
> Saatamme pian ilmoittaa EU:n datakeskuksemme sijainnin [forwardemail.eu](https://forwardemail.eu):n alaisuudessa. Tilaa keskustelu osoitteessa <https://github.com/orgs/forwardemail/discussions/336> saadaksesi päivityksiä.

Palvelimemme sijaitsevat pääasiassa Denverissä, Coloradossa – katso täydellinen IP-osoitteiden luettelo osoitteesta <https://forwardemail.net/ips>.

Voit lukea lisää alihankkijoistamme [GDPR](/gdpr)-, [DPA](/dpa)- ja [Tietosuoja](/privacy)-sivuiltamme.

### Miten vien ja varmuuskopioin postilaatikoni {#how-do-i-export-and-backup-my-mailbox}

Voit milloin tahansa viedä postilaatikosi [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions)-, [Mbox](https://en.wikipedia.org/wiki/Mbox)- tai salatuissa [SQLite](https://en.wikipedia.org/wiki/SQLite)-muodoissa.

Siirry kohtaan <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Oma tili <i class="fa fa-angle-right"></i> Verkkotunnukset</a> <i class="fa fa-angle-right"></i> Aliakset <i class="fa fa-angle-right"></i> Lataa varmuuskopio ja valitse haluamasi vientimuoto.

Saat sähköpostitse linkin viennin lataamiseksi, kun se on valmis.

Huomaa, että tämä vientilatauslinkki vanhenee neljän tunnin kuluttua turvallisuussyistä.

Jos sinun on tarkasteltava vietyjä EML- tai Mbox-muotojasi, näistä avoimen lähdekoodin työkaluista voi olla hyötyä:

| Nimi | Muoto | Alusta | GitHub-URL-osoite |
| --------------- | :----: | ------------- | --------------------------------------------------- |
| MBox-katseluohjelma | Mbox | Ikkunat | <https://github.com/eneam/mboxviewer> |
| mbox-web-viewer | Mbox | Kaikki alustat | <https://github.com/PHMRanger/mbox-web-viewer> |
| EmlReader | EML | Ikkunat | <https://github.com/ayamadori/EmlReader> |
| Sähköpostin katseluohjelma | EML | VSCode | <https://github.com/joelharkes/vscode_email_viewer> |
| eml-lukija | EML | Kaikki alustat | <https://github.com/s0ph1e/eml-reader> |

Lisäksi, jos sinun on muunnettava Mbox-tiedosto EML-tiedostoksi, voit käyttää <https://github.com/noelmartinon/mboxzilla>.

### Miten tuon ja siirrän olemassa olevan postilaatikon {#how-do-i-import-and-migrate-my-existing-mailbox}

Voit helposti tuoda sähköpostisi Forward Email -toimintoon (esim. käyttämällä [Thunderbird](https://www.thunderbird.net)-ominaisuutta) alla olevien ohjeiden mukaisesti:

<div class="alert alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tärkeää:
</strong>
<span>
Sinun on noudatettava kaikkia seuraavia vaiheita voidaksesi tuoda olemassa olevan sähköpostisi.
</span>
</div>

1. Vie sähköpostisi nykyisestä sähköpostipalveluntarjoajastasi:

| Sähköpostipalveluntarjoaja | Vientimuoto | Vientiohjeet |
| -------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Gmail | MBOX | <https://takeout.google.com/settings/takeout/custom/gmail> |
| Näkymät | PST | <div class="alert my-3 alert-danger"><i class="fa fa-info-circle font-weight-bold"></i> <strong class="font-weight-bold">Vinkki:</strong> <span>Jos käytät Outlookia (<a href="https://support.microsoft.com/en-us/office/back-up-your-email-e5845b0b-1aeb-424f-924c-aa1c33b18833#:~:text=Select%20File%20%3E%20Open%20%26%20Export%20%3E,back%20up%20and%20select%20Next." class="alert-link">PST-vientimuoto</a>), voit yksinkertaisesti seurata alla olevia "Muu"-kohdan ohjeita. Olemme kuitenkin antaneet alla linkkejä PST-tiedostojen muuntamiseen MBOX/EML-muotoon käyttöjärjestelmäsi perusteella:<ul class="mb-0 mt-3"><li><a class="alert-link" href="https://github.com/BaselineIT/Zinkuba/releases/download/release-1.2/Zinkuba.App.exe">Zinkuba Windowsille</a> (<a class="alert-link" href="https://github.com/BaselineIT/Zinkuba?tab=readme-ov-file#zinkuba">GitHub</a>)</li><li><a class="alert-link" href="https://cygwin.com/packages/summary/readpst.html">readpst Windowsille, cygwinille</a> – (esim. <code>readpst -u -o $OUT_DIR $IN_DIR</code> korvaamalla <code>$OUT_DIR</code> ja <code>$IN_DIR</code> tulostushakemistolla ja syötekansiopolkuja vastaavasti).</li><li><a class="alert-link" href="https://manpages.ubuntu.com/manpages/trusty/man1/readpst.1.html">readpst Ubuntu/Linuxille</a> – (esim. <code>sudo apt-get install readpst</code> ja sitten <code>readpst -u -o $OUT_DIR $IN_DIR</code>, korvaamalla <code>$OUT_DIR</code> ja <code>$IN_DIR</code> vastaavasti tulostus- ja syöttökansiopoluilla).</li><li><a class="alert-link" href="https://formulae.brew.sh/formula/libpst">readpst macOS:lle (brew'n kautta)</a> – (esim. <code>brew install libpst</code> ja sitten <code>readpst -u -o $OUT_DIR $IN_DIR</code>, korvaamalla <code>$OUT_DIR</code> ja <code>$IN_DIR</code> sekä vastaavat tulostus- ja syöttöhakemistopolut).</li><li><a class="alert-link" href="https://github.com/juanirm/pst-converter/tree/master?tab=readme-ov-file#pst-converter">PST-muunnin Windowsille (GitHub)</a></li></ul><br /></span></div> |
| Apple Mail | MBOX | <https://support.apple.com/guide/mail/import-or-export-mailboxes-mlhlp1030/mac#apd37a3190755974> |
| Pikaposti | EML | <https://www.fastmail.help/hc/en-us/articles/360060590573-Download-all-your-data#downloadmail> |
| Proton Mail | MBOX/EML | <https://proton.me/support/export-emails-import-export-app> |
| Tutanota | EML | <https://github.com/crepererum-oss/tatutanatata> |
| Ajatella | EML | <https://docs.gandi.net/en/gandimail/common_operations/backup_email.html#contents> |
| Zoho | EML | <https://www.zoho.com/mail/help/import-export-emails.html#alink2> |
| Muut | [Use Thunderbird](https://www.thunderbird.net) | Määritä olemassa oleva sähköpostitilisi Thunderbirdissä ja käytä sitten [ImportExportTools NG](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/) -laajennusta sähköpostiesi viemiseen ja tuomiseen. **Voit ehkä myös yksinkertaisesti kopioida/liittää tai vetää/pudottaa sähköposteja tilien välillä.** |

2. Lataa, asenna ja avaa [Thunderbird](https://www.thunderbird.net).

3. Luo uusi tili käyttämällä aliaksesi koko sähköpostiosoitetta (esim. <koodi><sinä@verkkotunnuksesi.com></koodi>) ja luomaasi salasanaa. <strong>Jos sinulla ei vielä ole luotua salasanaa, <a href="/faq#do-you-support-receiving-email-with-imap" target="_blank">katso asennusohjeet</a></strong>.

4. Lataa ja asenna [TuoVientiTyökalut OF](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/) Thunderbird -laajennus.

5. Luo uusi paikallinen kansio Thunderbirdissä ja napsauta sitä hiiren kakkospainikkeella → valitse `ImportExportTools NG`-vaihtoehto → valitse `Import mbox file` (MBOX-vientimuotoa varten) – tai – `Import messages` / `Import all messages from a directory` (EML-vientimuotoa varten).

6. Vedä/pudota paikallisesta kansiosta uuteen (tai olemassa olevaan) IMAP-kansioon Thunderbirdissä, johon haluat ladata viestit IMAP-tallennustilassa palvelumme avulla. Tämä varmistaa, että ne varmuuskopioidaan verkossa SQLite-salatulla tallennustilallamme.

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Vinkki:
</strong>
<span>
Jos et tiedä, miten tuoda tiedostot Thunderbirdiin, voit katsoa virallisia ohjeita osoitteista <a class="alert-link" href="https://kb.mozillazine.org/Importing_folders">https://kb.mozillazine.org/Importing_folders</a>" ja <a class="alert-link" href="https://github.com/thunderbird/import-export-tools-ng/wiki">https://github.com/thunderbird/import-export-tools-ng/wiki</a>."
</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tärkeää:
</strong>
<span>
Kun olet suorittanut vienti- ja tuontiprosessin, voit myös ottaa käyttöön edelleenlähetyksen olemassa olevalla sähköpostitililläsi ja määrittää automaattisen vastaajan ilmoittamaan lähettäjille uudesta sähköpostiosoitteestasi (esim. jos käytit aiemmin Gmailia ja käytät nyt sähköpostia mukautetulla verkkotunnuksellasi).
</span>
</div>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Onnittelut!
</strong>
<span>
Olet suorittanut kaikki vaiheet onnistuneesti.
</span>
</div>
</div>

### Tuetteko omaa ylläpitoa? {#do-you-support-self-hosting}

Kyllä, maaliskuusta 2025 lähtien tuemme itse isännöityä vaihtoehtoa. Lue blogi [tässä](https://forwardemail.net/blog/docs/self-hosted-solution). Tutustu [itse isännöity opas](https://forwardemail.net/self-hosted)-blogiin päästäksesi alkuun. Ja jos olet kiinnostunut yksityiskohtaisemmasta vaiheittaisesta versiosta, katso [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu)- tai [Debian](https://forwardemail.net/guides/selfhosted-on-debian)-pohjaiset oppaamme.

## Sähköpostin määritys {#email-configuration}

### Miten aloitan ja määritän sähköpostin edelleenlähetyksen {#how-do-i-get-started-and-set-up-email-forwarding}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Arvioitu asennusaika:</strong>
<span>Alle 10 minuuttia</span>
</div>

<div class="alert my-3 alert-success">
<i class="fa fa-bullhorn font-weight-bold"></i>
<strong class="font-weight-bold">
Aloittaminen:
</strong>
<span>
Lue huolellisesti alla olevat vaiheet 1–8 ja noudata niitä. Muista korvata sähköpostiosoite <code>user@gmail.com</code> sillä sähköpostiosoitteella, johon haluat lähettää sähköpostit edelleen (jos se ei ole jo oikein). Muista myös korvata <code>example.com</code> omalla verkkotunnuksellasi (jos se ei ole jo oikein).
</span>
</div>

<ol>
<li class="mb-2 mb-md-3 mb-lg-5">Jos olet jo rekisteröinyt verkkotunnuksesi jonnekin, sinun on ohitettava tämä vaihe kokonaan ja siirryttävä vaiheeseen kaksi! Muussa tapauksessa voit <a href="/domain-registration" rel="noopener noreferrer">napsauttaa tästä rekisteröidäksesi verkkotunnuksesi</a>.</li>
<li class="mb-2 mb-md-3 mb-lg-5">
Muistatko, mihin rekisteröit verkkotunnuksesi? Kun muistat tämän, noudata alla olevia ohjeita:

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tärkeää:
</strong>
<span>
Sinun on avattava uusi välilehti ja kirjauduttava verkkotunnusrekisterinpitäjään. Voit helposti napsauttaa alla olevaa "Rekisteröijä"-kohtaa tehdäksesi tämän automaattisesti. Tällä uudella välilehdellä sinun on siirryttävä rekisterinpitäjäsi DNS-hallintasivulle – ja olemme antaneet vaiheittaiset navigointiohjeet alla "Määritysvaiheet"-sarakkeessa. Kun olet siirtynyt tälle sivulle uudella välilehdellä, voit palata tälle välilehdelle ja siirtyä alla olevaan vaiheeseen kolme.
<strong class="font-weight-bold">Älä sulje avattua välilehteä vielä; tarvitset sitä tulevissa vaiheissa!</strong>
</span>
</div>

<table id="table-dns-management-by-registrar" class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Rekisteröijä</th>
<th>Määrittämisen vaiheet</th>
</tr>
</thead>
<tbody>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://login.ionos.com/">1&amp;1</a></td>
<td>Kirjaudu sisään <i class="fa fa-angle-right"></i> Verkkotunnuskeskus <i class="fa fa-angle-right"></i> (Valitse verkkotunnuksesi) <i class="fa fa-angle-right"></i> Muokkaa DNS-asetuksia</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon Reitti 53</a></td>
<td>Kirjaudu sisään <i class="fa fa-angle-right"></i> Isännöidyt vyöhykkeet <i class="fa fa-angle-right"></i> (Valitse verkkotunnuksesi)</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>
<td>Kirjaudu sisään <i class="fa fa-angle-right"></i> Palvelimeni <i class="fa fa-angle-right"></i> Verkkotunnusten hallinta <i class="fa fa-angle-right"></i> DNS-hallinta</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.bluehost.com/help/article/dns-management-add-edit-or-delete-dns-entries">Bluehost</a></td>
<td>ROCKILLE: Kirjaudu sisään <i class="fa fa-angle-right"></i> Verkkotunnukset <i class="fa fa-angle-right"></i> (Napsauta vieressä olevaa ▼-kuvaketta hallitaksesi) <i class="fa" fa-angle-right"></i> DNS
<br /> VANHEMMAT VERKOT: Kirjaudu sisään <i class="fa fa-angle-right"></i> Verkkotunnukset <i class="fa fa-angle-right"></i> Vyöhykeeditori <i class="fa fa-angle-right"></i> (Valitse verkkotunnuksesi)</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://dash.cloudflare.com/login">Cloudflare</a></td>"
<td>Kirjaudu sisään <i class="fa fa-angle-right"></i> DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://cp.dnsmadeeasy.com/">DNS Helppoa</a></td>
<td>Kirjaudu sisään <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> (Valitse verkkotunnuksesi)</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://dnsimple.com/dashboard">DNSimple</a></td>
<td>Kirjaudu sisään <i class="fa fa-angle-right"></i> (Valitse verkkotunnuksesi) <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> Hallinnoi</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://cloud.digitalocean.com/login">Digital Ocean</a></td>
<td>Kirjaudu sisään <i class="fa fa-angle-right"></i> Verkostoituminen <i class="fa fa-angle-right"></i> Verkkotunnukset <i class="fa fa-angle-right"></i> (Valitse verkkotunnuksesi) <i class="fa fa-angle-right"></i> Lisää <i class="fa fa-angle-right"></i> Hallinnoi verkkotunnusta</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.domain.com/help/article/dns-management-how-to-update-dns-records">Domain.com</a></td>
<td>Kirjaudu sisään <i class="fa fa-angle-right"></i> Korttinäkymässä napsauta verkkotunnuksesi hallinta -painiketta <i class="fa fa-angle-right"></i> Luettelonäkymässä napsauta
rataskuvaketta <i class="fa fa-angle-right"></i> DNS- ja nimipalvelimet <i class="fa fa-angle-right"></i> DNS-tietueet</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://www.domains.com/">Domains.com</a>
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon0 class="fa fa-play-circle"></i> Katso</a>
</td>
<td>Kirjaudu sisään <i class="fa fa-angle-right"></i> (Valitse verkkotunnuksesi) <i class="fa fa-angle-right"></i> Hallinnoi <i class="fa fa-angle-right"></i> (napsauta rataskuvaketta) <i class="fa fa-angle-right"></i> Napsauta DNS ja nimipalvelimet vasemmanpuoleisessa valikossa</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon1
<td>Kirjaudu sisään <i class="fa fa-angle-right"></i> Paneeli <i class="fa fa-angle-right"></i> Verkkotunnukset <i class="fa fa-angle-right"></i> Hallinnoi verkkotunnuksia <i class="fa fa-angle-right"></i> DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon2
<td>Kirjaudu sisään <i class="fa fa-angle-right"></i> Yleiskatsaus <i class="fa fa-angle-right"></i> Hallinnoi <i class="fa fa-angle-right"></i> Yksinkertainen editori <i class="fa fa-angle-right"></i> Tietueet</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon3
<td>Kirjaudu sisään <i class="fa fa-angle-right"></i> (Valitse verkkotunnuksesi) <i class="fa fa-angle-right"></i> Hallinta <i class="fa fa-angle-right"></i> Muokkaa vyöhykettä</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon4
<br />
<a class="btn" btn-dark" rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon5 class="fa fa-play-circle"></i> Seuraa</a>
</td>
<td>Kirjaudu sisään <i class="fa fa-angle-right"></i> Hallinnoi verkkotunnuksiani <i class="fa fa-angle-right"></i> (Valitse verkkotunnuksesi) <i class="fa fa-angle-right"></i> Hallinnoi DNS:ää</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon6 Verkkotunnukset</a>
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon7 class="fa fa-play-circle"></i> Seuraa</a>
</td>
<td>Kirjaudu sisään <i class="fa fa-angle-right"></i> (Valitse verkkotunnuksesi) <i class="fa fa-angle-right"></i> Määritä DNS</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon8
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon9 class="fa fa-play-circle"></i> Seuraa</a>
</td>
<td>Kirjaudu sisään <i class="fa fa-angle-right"></i> Verkkotunnusluettelo <i class="fa fa-angle-right"></i> (Valitse verkkotunnuksesi) <i class="fa fa-angle-right"></i> Hallitse <i class="fa fa-angle-right"></i> Lisäasetukset DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>0
<td>Kirjaudu sisään <i class="fa fa-angle-right"></i> (Valitse verkkotunnuksesi) <i class="fa fa-angle-right"></i> Netlify DNS:n määrittäminen</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>1 Ratkaisut</a></td>
<td>Kirjaudu sisään <i class="fa fa-angle-right"></i> Asiakkuuspäällikkö <i class="fa fa-angle-right"></i> Omat verkkotunnukset <i class="fa fa-angle-right"></i> (Valitse verkkotunnuksesi) <i class="fa fa-angle-right"></i> Hallinnoi <i class="fa fa-angle-right"></i> Muuta verkkotunnuksen osoitetta <i class="fa fa-angle-right"></i> DNS:n lisäasetukset</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>2
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>3 class="fa fa-play-circle"></i> Katso</a>
</td>
<td>Kirjaudu sisään <i class="fa fa-angle-right"></i> Hallitut verkkotunnukset <i class="fa fa-angle-right"></i> (Valitse verkkotunnuksesi) <i class="fa fa-angle-right"></i> DNS-asetukset</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>4
<td>Kirjaudu sisään <i class="fa fa-angle-right"></i> Etusivu-valikko <i class="fa fa-angle-right"></i> Asetukset <i class="fa fa-angle-right"></i> Verkkotunnukset <i class="fa fa-angle-right"></i> (Valitse verkkotunnuksesi) <i class="fa fa-angle-right"></i>
Lisäasetukset <i class="fa fa-angle-right"></i> Mukautetut tietueet</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>5 Now</a></td>
<td>Käyttäen "now"-komentoliittymää <i class="fa fa-angle-right"></i> <code>now dns add [domain] '@' MX [record-value] [priority]</code></td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>6"
<td>Kirjaudu sisään <i class="fa fa-angle-right"></i> Verkkotunnukset-sivu <i class="fa fa-angle-right"></i> (Valitse verkkotunnuksesi) <i class="fa fa-angle-right"></i> DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>7"
<td>Kirjaudu sisään <i class="fa fa-angle-right"></i> Verkkotunnukset-sivu <i class="fa fa-angle-right"></i> (Napsauta <i class="fa fa-ellipsis-h"></i> -kuvaketta) <i class="fa fa-angle-right"></i> Valitse Hallitse DNS-tietueita</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>8"
<td>Kirjaudu sisään <i class="fa fa-angle-right"></i> Verkkotunnukset <i class="fa fa-angle-right"></i> Omat verkkotunnukset</td>
</tr>
<tr>
<td>Muut</td>
<td>
<div class="alert mb-0 alert-warning"><i class="fa fa-exclamation-circle font-weight-bold"></i> <strong class="font-weight-bold">Tärkeää:</strong> Eikö rekisterinpitäjäsi nimeä löydy täältä? Hae internetistä hakusanoilla "kuinka muuttaa DNS-tietueita $REGISTRAR-palvelussa" (korvaa $REGISTRAR rekisterinpitäjäsi nimellä – esim. "kuinka muuttaa DNS-tietueita GoDaddy-palvelussa", jos käytät GoDaddy-palvelua).</div>
</td>
</tr>
</tbody>
</table>
</li>
<li class="mb-2 mb-md-3 mb-lg-5">Aseta seuraavat "MX"-tietueet rekisterinpitäjäsi DNS-hallintasivulla (toinen avaamasi välilehti):

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tärkeää:
</strong>
<span>
Huomaa, että muita MX-tietueita ei pitäisi olla asetettu. Molempien alla näkyvien tietueiden TÄYTYY olla olemassa. Varmista, ettei niissä ole kirjoitusvirheitä ja että sekä mx1 että mx2 ovat oikein kirjoitettu. Jos MX-tietueita on jo olemassa, poista ne kokonaan.

"TTL"-arvon ei tarvitse olla 3600, se voi olla tarvittaessa pienempi tai suurempi arvo.
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Nimi/Isäntä/Alias</th>
<th class="text-center">TTL</th>
<th>Tyyppi</th>
<th>Prioriteetti</th>
<th>Vastaus/Arvo</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", tai tyhjä</em></td>
<td class="text-center">3600</td>
<td>MX</td>
<td>0</td>
<td><code>mx1.forwardemail.net</code></td>
</tr>
<tr>
<td><em>"@", ".", tai tyhjä</em></td>
<td class="text-center">3600</td>
<td>MX</td>
<td>0</td>
<td><code>mx2.forwardemail.net</code></td>
</tr>
</tbody>
</table>

</li><li class="mb-2 mb-md-3 mb-lg-5" id="dns-configuration-options">Aseta rekisterinpitäjäsi DNS-hallintasivulla (toinen avaamasi välilehti) seuraavat <strong class="notranslate">TXT</strong>-tietueet:

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tärkeää:
</strong>
<span>
Jos käytät maksullista tilausta, sinun on ohitettava tämä vaihe kokonaan ja siirryttävä vaiheeseen viisi! Jos et käytä maksullista tilausta, uudelleenohjatut osoitteesi ovat julkisesti haettavissa – siirry kohtaan <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Oma tili <i class="fa fa-angle-right"></i>Verkkotunnukset</a> ja päivitä verkkotunnuksesi maksulliseen tilaukseen halutessasi. Jos haluat lisätietoja maksullisista tilauksista, katso <a rel="noopener noreferrer" href="/private-business-email" class="alert-link">Hinnoittelu</a>-sivumme. Muussa tapauksessa voit jatkaa yhden tai useamman vaihtoehdon A ja F yhdistelmien valitsemista alla luetelluista vaihtoehdoista. </span>
</div>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Vaihtoehto A:
</strong>
<span>
Jos uudelleenohjaat kaikki sähköpostit verkkotunnuksestasi (esim. "all@example.com", "hello@example.com" jne.) tiettyyn osoitteeseen "user@gmail.com":
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Nimi/Isäntä/Alias</th>
<th class="text-center">TTL</th>
<th>Tyyppi</th>
<th>Vastaus/Arvo</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", tai tyhjä</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=user@gmail.com</code>
</td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Vinkki:
</strong>
<span>
Muista korvata yllä olevat arvot "Arvo"-sarakkeessa omalla sähköpostiosoitteellasi. "TTL"-arvon ei tarvitse olla 3600, se voi olla tarvittaessa pienempi tai suurempi. Pienempi "TTL"-arvo varmistaa, että kaikki tulevat DNS-tietueisiisi tehdyt muutokset leviävät nopeammin Internetiin – ajattele tätä siten, että se tarkoittaa sitä, kuinka kauan ne tallennetaan välimuistiin (sekunteina). Voit lukea lisää <a href="https://en.wikipedia.org/wiki/Time_to_live#DNS_records" rel="noopener noreferrer" target="_blank" class="alert-link">TTL:stä Wikipediassa</a>.
</span>
</div>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Vaihtoehto B:
</strong>
<span>
Jos sinun tarvitsee vain lähettää edelleen yksi sähköpostiosoite (esim. <code>hello@example.com</code> osoitteeseen <code>user@gmail.com</code>; tämä lähettää myös osoitteen "hello+test@example.com" automaattisesti osoitteeseen "user+test@gmail.com"):
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Nimi/Isäntä/Alias</th>
<th class="text-center">TTL</th>
<th>Tyyppi</th>
<th>Vastaus/Arvo</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", tai tyhjä</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=hello:user@gmail.com</code>
</td>
</tr>
</tbody>
</table>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Vaihtoehto C:
</strong>
<span>
Jos lähetät edelleen useita sähköposteja, erota ne pilkulla:
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Nimi/Isäntä/Alias</th>
<th class="text-center">TTL</th>
<th>Tyyppi</th>
<th>Vastaus/Arvo</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", tai tyhjä</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=hello:user@gmail.com,support:user@gmail.com</code>
</td>
</tr>
</tbody>
</table>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Vaihtoehto D:
</strong>
<span>
Voit määrittää loputtoman määrän sähköpostien edelleenlähetysasetuksia – varmista vain, ettet rivitä yli 255 merkkiä yhdelle riville ja aloita jokainen rivi merkintänä "forward-email=". Esimerkki on alla:
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Nimi/Isäntä/Alias</th>
<th class="text-center">TTL</th>
<th>Tyyppi</th>
<th>Vastaus/Arvo</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", tai tyhjä</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=hello:user@gmail.com,support:user@gmail.com</code>
</td>
</tr>
<tr>
<td><em>"@", ".", tai tyhjä</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=help:user@gmail.com,foo:user@gmail.com</code>
</td>
</tr>
<tr>
<td><em>"@", ".", tai tyhjä</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=orders:user@gmail.com,baz:user@gmail.com</code>
</td>
</tr>
<tr>
<td><em>"@", ".", tai tyhjä</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=info:user@gmail.com,beep:user@gmail.com</code>
</td>
</tr>
<tr>
<td><em>"@", ".", tai tyhjä</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=errors:user@gmail.com,boop:user@gmail.com</code>
</td>
</tr>
</tbody>
</table>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Vaihtoehto E:
</strong>
<span>
Voit myös määrittää verkkotunnuksen <strong class="notranslate">TXT</strong>-tietueessasi, jos haluat käyttää globaalia alias-uudelleenohjausta (esim. "user@example.com" välitetään osoitteeseen "user@example.net"):
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Nimi/Isäntä/Alias</th>
<th class="text-center">TTL</th>
<th>Tyyppi</th>
<th>Vastaus/Arvo</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", tai tyhjä</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=example.net</code>
</td>
</tr>
</tbody>
</table>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Vaihtoehto F:
</strong>
<span>
Voit käyttää webhookeja jopa globaalina tai yksittäisenä aliaksena sähköpostien edelleenlähettämiseen. Katso esimerkki ja koko webhookeja käsittelevä osio <a href="#do-you-support-webhooks" class="alert-link">Tuetaanko webhookeja</a> alta.
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Nimi/Isäntä/Alias</th>
<th class="text-center">TTL</th>
<th>Tyyppi</th>
<th>Vastaus/Arvo</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", tai tyhjä</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=alias:https://requestbin.com/r/en8pfhdgcculn</code>
</td>
</tr>
</tbody>
</table>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Vaihtoehto G:
</strong>
<span>
Voit käyttää jopa säännöllisiä lausekkeita ("regex") aliaksien yhteensovittamiseen ja korvausten käsittelyyn sähköpostien edelleenlähetystä varten. Katso esimerkit ja koko osio säännöllisistä lausekkeista otsikolla <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">Tuetaanko säännöllisiä lausekkeita vai regexiä</a> alta.
</span>
</div>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Tarvitsetko edistynyttä säännöllistä lauseketta substituutiolla?</strong> Katso esimerkit ja koko säännöllisiä lausekkeita käsittelevä osio <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">Tuetaanko säännöllisiä lausekkeita vai regexejä</a> alta.
</div>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Yksinkertainen esimerkki:</strong> Jos haluan, että kaikki `linus@example.com`- tai `torvalds@example.com`-postiin menevät sähköpostit välitetään edelleen `user@gmail.com`-postiin:
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Nimi/Isäntä/Alias</th>
<th class="text-center">TTL</th>
<th>Tyyppi</th>
<th>Vastaus/Arvo</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", tai tyhjä</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=/^(linus|torvalds)$/:user@gmail.com</code>
</td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tärkeää:
</strong>
<span>
Keräilysääntöjä voitaisiin kuvailla myös "laskeutumissäännöiksi".
Tämä tarkoittaa, että saapuvat sähköpostit, jotka vastaavat vähintään yhtä tiettyä edelleenlähetyssääntöä, käytetään keräilysääntöjen sijaan.
Erityisiä sääntöjä ovat sähköpostiosoitteet ja säännölliset lausekkeet.
<br /><br />
Esimerkiksi:
<br />
<code>forward-email=hello:first@gmail.com,second@gmail.com</code>
<br />
Osoitteeseen <code>hello@example.com</code> lähetettyjä sähköposteja **ei** välitetä osoitteeseen <code>second@gmail.com</code> (keräily) tällä määrityksellä, vaan ne toimitetaan vain osoitteeseen <code>first@gmail.com</code>.
</span>
</div>

---

</li><li class="mb-2 mb-md-3 mb-lg-5">Aseta rekisterinpitäjäsi DNS-hallintasivulla (toinen avaamasi välilehti) lisäksi seuraava <strong class="notranslate">TXT</strong>-tietue:

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Nimi/Isäntä/Alias</th>
<th class="text-center">TTL</th>
<th>Tyyppi</th>
<th>Vastaus/Arvo</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", tai tyhjä</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>v=spf1 a include:spf.forwardemail.net -all</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tärkeää:
</strong>
<span>
Jos käytät Gmailia (esim. Lähetä sähköpostia nimellä) tai G Suitea, sinun on lisättävä yllä olevaan arvoon <code>include:_spf.google.com</code>, esimerkiksi:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
</span>
</div>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Vinkki:
</strong>
<span>
Jos sinulla on jo samanlainen rivi, jossa on "v=spf1", sinun on lisättävä <code>include:spf.forwardemail.net</code> juuri ennen olemassa olevia "include:host.com"-tietueita ja ennen "-all"-merkkiä samalla rivillä, esimerkiksi:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
<br /><br />
Huomaa, että "-all" ja "~all" eroavat toisistaan. "-" osoittaa, että SPF-tarkistuksen pitäisi epäonnistua, jos se ei täsmää, ja "~" osoittaa, että SPF-tarkistuksen pitäisi epäonnistua. Suosittelemme "-all"-lähestymistavan käyttöä verkkotunnusten väärentämisen estämiseksi. <br /><br />
Sinun on ehkä myös sisällytettävä SPF-tietue sille isännälle, josta lähetät sähköpostia (esim. Outlook).
</span>
</div>

</li><li class="mb-2 mb-md-3 mb-lg-5">Vahvista DNS-tietueesi "Vahvista tietueet" -työkalullamme, joka on saatavilla osoitteessa <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Oma tili <i class="fa fa-angle-right"></i> Verkkotunnukset</a> <i class="fa fa-angle-right"></i> Määritys.

</li><li class="mb-2 mb-md-3 mb-lg-5">Lähetä testisähköposti varmistaaksesi, että se toimii. Huomaa, että DNS-tietueidesi levittäminen voi kestää jonkin aikaa.

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Vinkki:
</strong>
<span>
</span>
Jos et saa testisähköposteja tai saat testisähköpostin, jossa lukee "Ole varovainen tämän viestin kanssa", katso vastaukset kysymyksille <a href="#why-am-i-not-receiving-my-test-emails" class="alert-link">Miksi en saa testisähköpostejani</a> ja <a href="#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious" class="alert-link">Miksi minulle lähetetyt testisähköpostini näkyvät Gmailissa "epäilyttävinä"</a>.
</div>

</li><li class="mb-2 mb-md-3 mb-lg-5">Jos haluat käyttää Gmailissa "Lähetä sähköpostia nimellä", sinun on <strong><a href="https://www.youtube.com/watch?v=MEheS8gM4Xs" target="_blank" rel="noopener noreferrer">katsottava tämä video</a></strong> tai noudatettava alla olevia ohjeita kohdassa <a href="#how-to-send-mail-as-using-gmail">How Lähetä sähköpostia nimellä Gmailin avulla</a>.

</li></ol>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Onnittelut!
</strong>
<span>
Olet suorittanut kaikki vaiheet onnistuneesti.
</span>
</div>
</div>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Vinkki:
</strong>
<span>
Valinnaiset lisäosat on lueteltu alla. Huomaa, että nämä lisäosat ovat täysin valinnaisia eivätkä välttämättä välttämättömiä. Halusimme ainakin antaa sinulle lisätietoja tarvittaessa.
</span>
</div>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Valinnainen lisäosa:
</strong>
<span>
Jos käytät <a class="alert-link" href="#how-to-send-mail-as-using-gmail">How Lähetä sähköpostia Gmailissa nimellä</a> -ominaisuutta, voit lisätä itsesi sallittujen listalle. Katso <a class="alert-link" href="https://support.google.com/a/answer/60752?hl=en" target="_blank" rel="noopener noreferrer">nämä Gmailin ohjeet</a> tästä aiheesta.
</span>
</div>

### Voinko käyttää useita MX-vaihtoja ja -palvelimia edistyneeseen edelleenlähetykseen? {#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding}

Kyllä, mutta **DNS-tietueissasi tulisi olla vain yksi MX-vaihto**.

Älä yritä käyttää "Prioriteetti"-asetusta useiden MX-keskusten määrittämiseen.

Sen sijaan sinun on määritettävä olemassa oleva MX-sähköpostinvaihtosi välittämään kaikkien epäsopivien aliaksien posti palvelumme sähköpostinvaihtopisteisiin (`mx1.forwardemail.net` ja/tai `mx2.forwardemail.net`).

Jos käytät Google Workspacea ja haluat välittää kaikki epätäsmäävät aliakset palveluumme, katso <https://support.google.com/a/answer/6297084>.

Jos käytät Microsoft 365:tä (Outlook) ja haluat välittää kaikki epätäsmäävät aliakset palveluumme, katso <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/use-connectors-to-configure-mail-flow/set-up-connectors-to-route-mail> ja <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/manage-mail-flow-for-multiple-locations>.

### Miten määritän lomaviestin (poissaoloviestin automaattisen vastaajan) {#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder}

Siirry kohtaan <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Oma tili <i class="fa fa-angle-right"></i> Verkkotunnukset</a> <i class="fa fa-angle-right"></i> Aliakset ja luo tai muokkaa aliasta, jolle haluat määrittää loma-automaattivastaajan.

Voit määrittää aloituspäivämäärän, päättymispäivämäärän, aiheen ja viestin sekä ottaa ne käyttöön tai poistaa ne käytöstä milloin tahansa:

* Selkotekstistä otsikkoa ja viestiä tuetaan tällä hetkellä (käytämme sisäisesti `striptags`-pakettia HTML-koodin poistamiseen).
* Aihe on rajoitettu 100 merkkiin.
* Viestin pituus on rajoitettu 1000 merkkiin.
* Asennus vaatii lähtevän SMTP-viestin määrityksen (esim. sinun on määritettävä DKIM-, DMARC- ja Return-Path DNS-tietueet).
* Siirry kohtaan <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Oma tili <i class="fa fa-angle-right"></i> Verkkotunnukset</a> <i class="fa fa-angle-right"></i> Asetukset <i class="fa fa-angle-right"></i> Lähtevän SMTP-määritykset ja noudata asennusohjeita.
* Lomavastaajaa ei voi ottaa käyttöön globaaleilla vanity-verkkotunnuksilla (esim. [kertakäyttöiset osoitteet](/disposable-addresses)-verkkotunnusta ei tueta).
* Lomavastaajaa ei voi ottaa käyttöön jokerimerkkiä/kaikki-merkitsevää tunnistetta (`*`) käyttäville aliaksille eikä säännöllisille lausekkeille.

Toisin kuin sähköpostijärjestelmät, kuten `postfix` (jotka esimerkiksi käyttävät `sieve`-lomasähköpostisuodatinlaajennusta), Forward Email lisää automaattisesti DKIM-allekirjoituksesi, estää yhteysongelmat lomasähköpostivastauksia lähetettäessä (esim. yleisten SSL/TLS-yhteysongelmien ja vanhojen palvelimien ylläpitämien ongelmien vuoksi) ja tukee jopa Open WKD- ja PGP-salausta lomasähköpostivastauksissa.

<!--
* Väärinkäytösten estämiseksi jokaisesta lähetetystä lomaviestistä vähennetään yksi lähtevä SMTP-krediitti.
* Kaikkiin maksullisiin tileihin sisältyy oletuksena 300 krediittiä päivässä. Jos tarvitset suuremman summan, ota meihin yhteyttä.
-->

1. Lähetämme viestin vain kerran per [sallittujen listalla](#do-you-have-an-allowlist)-lähettäjä neljän päivän välein (mikä on samanlaista kuin Gmailissa).

* Redis-välimuistissamme käytetään `alias_id`:n ja `sender`:n sormenjälkiä, kun taas `alias_id` on MongoDB-alias-ID ja `sender` on joko lähettäjän osoite (jos sallittujen listalla) tai lähettäjän osoitteen juuriverkkotunnus (jos ei sallittujen listalla). Yksinkertaisuuden vuoksi tämän sormenjäljen vanhenemispäivä välimuistissa on asetettu 4 päivään.

* Lähestymistapamme, jossa käytetään lähettäjän osoitteesta jäsennettyä juuriverkkotunnusta muiden kuin sallittujen lähettäjien kohdalla, estää suhteellisen tuntemattomien lähettäjien (esim. pahantahtoisten toimijoiden) aiheuttaman väärinkäytön tulvimasta lomaviestien piiriin.

2. Lähetämme viestin vain, kun MAIL FROM ja/tai From ei ole tyhjä eikä sisällä (kirjainkokoa ei erotella) [postin pääkäyttäjän käyttäjätunnus](#what-are-postmaster-addresses)-kohtaa (sähköpostin @-merkkiä edeltävä osa).

3. Emme lähetä viestiä, jos alkuperäisessä viestissä oli jokin seuraavista otsikoista (kirjainkokoa ei erotella):

* `auto-submitted`-otsikko, jonka arvo ei ole yhtä suuri kuin `no`.
* `x-auto-response-suppress`-otsikko, jonka arvo on `dr`, `autoreply`, `auto-reply`, `auto_reply` tai `all`.

* `list-id`-, `list-subscribe`-, `no`0-, `no`1-, `no`2-, `no`3-, `no`4-, `no`5-, `no`6- tai `no`7-otsikko (arvosta riippumatta).
* `no`8-otsikko, jonka arvo on `no`9, `x-auto-response-suppress`0, `x-auto-response-suppress`1, `x-auto-response-suppress`2 tai `x-auto-response-suppress`3.

4. Emme lähetä viestiä, jos MAIL FROM- tai Lähettäjä-sähköpostiosoite päättyy `+donotreply`-, `-donotreply`-, `+noreply`- tai `-noreply`-osoitukseen.

5. Emme lähetä, jos Lähettäjän sähköpostiosoite ja käyttäjätunnus -osio oli `mdaemon` ja sen kirjainkokoa ei erotella otsikossa `X-MDDSN-Message`.

6. Emme lähetä, jos `multipart/report`-otsikko on kirjainkokoa ei-herkkä `content-type`.

### Miten määritän SPF:n sähköpostin edelleenlähetystä varten {#how-do-i-set-up-spf-for-forward-email}

Aseta seuraava <strong class="notranslate">TXT</strong>-tietue rekisterinpitäjäsi DNS-hallintasivulla:

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Nimi/Isäntä/Alias</th>
<th class="text-center">TTL</th>
<th>Tyyppi</th>
<th>Vastaus/Arvo</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", tai tyhjä</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>v=spf1 a include:spf.forwardemail.net -all</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tärkeää:
</strong>
<span>
Jos käytät Gmailia (esim. Lähetä sähköpostia nimellä) tai G Suitea, sinun on lisättävä yllä olevaan arvoon <code>include:_spf.google.com</code>, esimerkiksi:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tärkeää:
</strong>
<span>
Jos käytät Microsoft Outlookia tai Live.comia, sinun on lisättävä <code>include:spf.protection.outlook.com</code> SPF <strong class="notranslate">TXT</strong>-tietueeseesi, esimerkiksi:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:spf.protection.outlook.com -all</code>
</span>
</div>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Vinkki:
</strong>
<span>
Jos sinulla on jo samanlainen rivi, jossa on "v=spf1", sinun on lisättävä <code>include:spf.forwardemail.net</code> juuri ennen olemassa olevia "include:host.com"-tietueita ja ennen "-all"-merkkiä samalla rivillä, esimerkiksi:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
<br /><br />
Huomaa, että "-all" ja "~all" eroavat toisistaan. "-" osoittaa, että SPF-tarkistuksen pitäisi epäonnistua, jos se ei täsmää, ja "~" osoittaa, että SPF-tarkistuksen pitäisi epäonnistua. Suosittelemme "-all"-lähestymistavan käyttöä verkkotunnusten väärentämisen estämiseksi. <br /><br />
Sinun on ehkä myös sisällytettävä SPF-tietue sille isännälle, josta lähetät sähköpostia (esim. Outlook).
</span>
</div>

### Miten määritän DKIM:n sähköpostin edelleenlähetystä varten {#how-do-i-set-up-dkim-for-forward-email}

Siirry kohtaan <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Oma tili <i class="fa fa-angle-right"></i> Verkkotunnukset</a> <i class="fa fa-angle-right"></i> Asetukset <i class="fa fa-angle-right"></i> Lähtevän SMTP:n määritys ja noudata asennusohjeita.

### Miten määritän DMARC:n sähköpostin edelleenlähetystä varten {#how-do-i-set-up-dmarc-for-forward-email}

Siirry kohtaan <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Oma tili <i class="fa fa-angle-right"></i> Verkkotunnukset</a> <i class="fa fa-angle-right"></i> Asetukset <i class="fa fa-angle-right"></i> Lähtevän SMTP:n määritys ja noudata asennusohjeita.

### Miten yhdistän ja määritän yhteystietoni {#how-do-i-connect-and-configure-my-contacts}

**Yhteystietojen määrittämiseen käytä CardDAV URL-osoitetta:** `https://carddav.forwardemail.net` (tai yksinkertaisesti `carddav.forwardemail.net`, jos asiakkaasi sallii sen)

### Miten yhdistän ja määritän kalenterini {#how-do-i-connect-and-configure-my-calendars}

**Määritä kalenterisi käyttämällä CalDAV-URL-osoitetta:** `https://caldav.forwardemail.net` (tai yksinkertaisesti `caldav.forwardemail.net`, jos asiakkaasi sallii sen)

<img width="612" height="520" src="/img/faq/calendar-setup.png" alt="Sähköpostin edelleenlähetyskalenterin CalDAV Thunderbird -esimerkkiasetus" />

### Miten lisään kalentereita ja hallitsen olemassa olevia kalentereita {#how-do-i-add-more-calendars-and-manage-existing-calendars}

Jos haluat lisätä kalentereita, lisää vain uusi kalenterin URL-osoite: `https://caldav.forwardemail.net/dav/principals/calendar-name` (**muista korvata `calendar-name` haluamallasi kalenterin nimellä**)

Voit muuttaa kalenterin nimeä ja väriä luomisen jälkeen – käytä vain haluamaasi kalenterisovellusta (esim. Apple Mail tai [Thunderbird](https://thunderbird.net)).

### Miten määritän SRS:n sähköpostin edelleenlähetystä varten {#how-do-i-set-up-srs-for-forward-email}

Määritämme [Lähettäjän uudelleenkirjoitusjärjestelmä](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme):n ("SRS") automaattisesti – sinun ei tarvitse tehdä tätä itse.

### Miten määritän MTA-STS:n sähköpostin edelleenlähetystä varten {#how-do-i-set-up-mta-sts-for-forward-email}

Lisätietoja on kohdassa [MTA-STS-osiomme](#do-you-support-mta-sts).

### Miten lisään profiilikuvan sähköpostiosoitteeseeni {#how-do-i-add-a-profile-picture-to-my-email-address}

Jos käytät Gmailia, noudata seuraavia ohjeita:

1. Siirry kohtaan <https://google.com> ja kirjaudu ulos kaikista sähköpostitileistä.
2. Napsauta "Kirjaudu sisään" ja napsauta avattavasta valikosta "toinen tili".
3. Valitse "Käytä toista tiliä".
4. Valitse "Luo tili".
5. Valitse "Käytä nykyistä sähköpostiosoitettani".
6. Anna mukautettu verkkotunnusnimesi sähköpostiosoite.
7. Hae sähköpostiosoitteeseesi lähetetty vahvistussähköposti.
8. Anna tästä sähköpostista saatu vahvistuskoodi.
9. Täytä uuden Google-tilisi profiilitiedot.
10. Hyväksy kaikki tietosuoja- ja käyttöehdot.
11. Siirry kohtaan <https://google.com> ja napsauta profiilikuvakettasi oikeassa yläkulmassa ja napsauta sitten "muuta"-painiketta.
12. Lataa uusi valokuva tai avatar tilillesi.
13. Muutosten voimaantulo kestää noin 1–2 tuntia, mutta joskus se voi tapahtua hyvin nopeasti.
14. Lähetä testisähköposti, niin profiilikuvan pitäisi tulla näkyviin.

## Lisäominaisuudet {#advanced-features}

### Tuetteko markkinointiin liittyvien sähköpostien uutiskirjeitä tai postituslistoja? {#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email}

Kyllä, voit lukea lisää osoitteesta <https://forwardemail.net/guides/newsletter-with-listmonk>.

Huomaa, että IP-osoitteen maineen ylläpitämiseksi ja toimitettavuuden varmistamiseksi Forward Emaililla on manuaalinen tarkistusprosessi verkkotunnuskohtaisesti **uutiskirjeen hyväksymistä** varten. Lähetä sähköpostia osoitteeseen <support@forwardemail.net> tai avaa [avunpyyntö](https://forwardemail.net/help) hyväksyntää varten. Tämä kestää yleensä alle 24 tuntia, ja useimmat pyynnöt käsitellään 1–2 tunnin kuluessa. Lähitulevaisuudessa pyrimme tekemään tästä prosessista välittömän lisäämällä roskapostinhallintaa ja -hälytyksiä. Tämä prosessi varmistaa, että sähköpostisi päätyvät postilaatikkoon eivätkä viestisi merkitä roskapostiksi.

### Tuetteko sähköpostin lähettämistä API:n kautta? {#do-you-support-sending-email-with-api}

Kyllä, toukokuusta 2023 alkaen tuemme sähköpostin lähettämistä API:n avulla lisäosana kaikille maksaville käyttäjille.

<div class="alert my-3 alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tärkeää:
</strong>
<span>
Varmista, että olet lukenut <a href="/terms" class="alert-link" target="_blank">käyttöehtomme</a>, <a href="/privacy" class="alert-link" target="_blank">tietosuojakäytäntömme</a> ja <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">lähtevän SMTP-liikenteen rajoituksemme</a> – käyttösi katsotaan tiedoksi ja hyväksyt sen.
</span>
</div>

Katso vaihtoehtoja, esimerkkejä ja lisätietoja API-dokumentaatiomme osiosta [Sähköpostit](/email-api#outbound-emails).

Jotta voit lähettää lähteviä sähköposteja API:n kautta, sinun on käytettävä API-tunnustasi, joka on saatavilla kohdassa [Oma turvallisuus](/my-account/security).

### Tuetteko sähköpostin vastaanottamista IMAP-protokollan kautta? {#do-you-support-receiving-email-with-imap}

Kyllä, 16. lokakuuta 2023 alkaen tuemme sähköpostin vastaanottamista IMAP-protokollan kautta lisäosana kaikille maksaville käyttäjille. **Lue perusteellinen artikkelimme** osoitteessa [miten salattu SQLite-postilaatikon tallennustoiminto toimii](/blog/docs/best-quantum-safe-encrypted-email-service).

<div id="imap-ohjeet">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tärkeää:
</strong>
<span>
Varmista, että olet lukenut <a href="/terms" class="alert-link" target="_blank">käyttöehtomme</a> ja <a href="/privacy" class="alert-link" target="_blank">tietosuojakäytäntömme</a> – käyttösi katsotaan tiedoksi ja hyväksyt sen.
</span>
</div>

1. Luo verkkotunnuksellesi uusi alias kohdassa <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Oma tili <i class="fa fa-angle-right"></i> Verkkotunnukset</a> <i class="fa fa-angle-right"></i> Aliakset (esim. <code><hello@example.com></code>)

2. Napsauta <strong class="text-success"><i class="fa fa-key"></i>Luo salasana</strong> -painiketta juuri luodun aliaksen vieressä. Kopioi leikepöydälle ja tallenna näytöllä näkyvä luotu salasana turvallisesti.

3. Lisää tai määritä tili haluamallasi sähköpostisovelluksella, jossa on juuri luomasi alias (esim. <code><hello@example.com></code>).
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Vinkki:
</strong>
<span>Suosittelemme <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbirdin</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobilen</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mailin</a> tai <a href="/blog/open-source" käyttöä. class="alert-link" target="_blank">avoimen lähdekoodin ja yksityisyyteen keskittyvä vaihtoehto</a>.</span>
</div>

4. Kun IMAP-palvelimen nimeä pyydetään antamaan, kirjoita `imap.forwardemail.net`

5. Kun sinulta kysytään IMAP-palvelimen porttia, anna `993` (SSL/TLS) – katso tarvittaessa [vaihtoehtoiset IMAP-portit](/faq#what-are-your-imap-server-configuration-settings)
<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Vinkki:
</strong>
<span>Jos käytät Thunderbirdiä, varmista, että "Yhteyden suojaus" -asetukseksi on asetettu "SSL/TLS" ja todennusmenetelmäksi on asetettu "Normaali salasana".</span>
</div>

6. Kun sinulta kysytään IMAP-palvelimen salasanaa, liitä salasana kohdasta <strong class="text-success"><i class="fa fa-key"></i>Luo salasana</strong> yllä olevassa vaiheessa 2.

7. **Tallenna asetuksesi** – jos sinulla on ongelmia, <a href="/help">ota meihin yhteyttä</a>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Onnittelut!
</strong>
<span>
Olet suorittanut kaikki vaiheet onnistuneesti.
</span>
</div>
</div>

</div>

### Tuetko POP3:a? {#do-you-support-pop3}

Kyllä, 4. joulukuuta 2023 alkaen tuemme [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol):aa lisäosana kaikille maksaville käyttäjille. **Lue perusteellinen artikkelimme** [miten salattu SQLite-postilaatikon tallennustoiminto toimii](/blog/docs/best-quantum-safe-encrypted-email-service):stä.**

<div id="pop3-ohjeet">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tärkeää:
</strong>
<span>
Varmista, että olet lukenut <a href="/terms" class="alert-link" target="_blank">käyttöehtomme</a> ja <a href="/privacy" class="alert-link" target="_blank">tietosuojakäytäntömme</a> – käyttösi katsotaan tiedoksi ja hyväksyt sen.
</span>
</div>

1. Luo verkkotunnuksellesi uusi alias kohdassa <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Oma tili <i class="fa fa-angle-right"></i> Verkkotunnukset</a> <i class="fa fa-angle-right"></i> Aliakset (esim. <code><hello@example.com></code>)

2. Napsauta <strong class="text-success"><i class="fa fa-key"></i>Luo salasana</strong> -painiketta juuri luodun aliaksen vieressä. Kopioi leikepöydälle ja tallenna näytöllä näkyvä luotu salasana turvallisesti.

3. Lisää tai määritä tili haluamallasi sähköpostisovelluksella, jossa on juuri luomasi alias (esim. <code><hello@example.com></code>).
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Vinkki:
</strong>
<span>Suosittelemme <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbirdin</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobilen</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mailin</a> tai <a href="/blog/open-source" käyttöä. class="alert-link" target="_blank">avoimen lähdekoodin ja yksityisyyteen keskittyvä vaihtoehto</a>.</span>
</div>

4. Kun POP3-palvelimen nimeä pyydetään antamaan, kirjoita `pop3.forwardemail.net`

5. Kun sinulta kysytään POP3-palvelimen porttia, anna `995` (SSL/TLS) – katso tarvittaessa [vaihtoehtoiset POP3-portit](/faq#what-are-your-pop3-server-configuration-settings)
<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Vinkki:
</strong>
<span>Jos käytät Thunderbirdiä, varmista, että "Yhteyden suojaus" -asetukseksi on asetettu "SSL/TLS" ja todennusmenetelmäksi on asetettu "Normaali salasana".</span>
</div>

6. Kun sinulta kysytään POP3-palvelimen salasanaa, liitä salasana kohdasta <strong class="text-success"><i class="fa fa-key"></i>Luo salasana</strong> yllä olevassa vaiheessa 2.

7. **Tallenna asetuksesi** – jos sinulla on ongelmia, <a href="/help">ota meihin yhteyttä</a>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Onnittelut!
</strong>
<span>
Olet suorittanut kaikki vaiheet onnistuneesti.
</span>
</div>
</div>

</div>

### Tuetteko kalentereita (CalDAV)? {#do-you-support-calendars-caldav}

Kyllä, 5. helmikuuta 2024 alkaen olemme lisänneet tämän ominaisuuden. Palvelimemme on `caldav.forwardemail.net` ja sitä valvotaan myös <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">statussivullamme</a>.

Se tukee sekä IPv4- että IPv6-protokollia ja on käytettävissä portin `443` (HTTPS) kautta.

| Kirjaudu sisään | Esimerkki | Kuvaus |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Käyttäjätunnus | `user@example.com` | Verkkotunnukselle olemassa olevan aliaksen sähköpostiosoite <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Oma tili <i class="fa fa-angle-right"></i>Verkkotunnukset</a>-osiossa. |
| Salasana | `************************` | Alias-kohtainen luotu salasana. |

Kalenterituen käyttämiseksi **käyttäjän** on oltava sellaisen aliaksen sähköpostiosoite, joka on olemassa verkkotunnukselle kohdassa <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Oma tili <i class="fa fa-angle-right"></i>Verkkotunnukset</a> – ja **salasanan** on oltava aliakselle erikseen luotu salasana.

### Tuetteko yhteystietoja (CardDAV)? {#do-you-support-contacts-carddav}

Kyllä, 12. kesäkuuta 2025 alkaen olemme lisänneet tämän ominaisuuden. Palvelimemme on `carddav.forwardemail.net` ja sitä valvotaan myös <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">statussivullamme</a>.

Se tukee sekä IPv4- että IPv6-protokollia ja on käytettävissä portin `443` (HTTPS) kautta.

| Kirjaudu sisään | Esimerkki | Kuvaus |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Käyttäjätunnus | `user@example.com` | Verkkotunnukselle olemassa olevan aliaksen sähköpostiosoite <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Oma tili <i class="fa fa-angle-right"></i>Verkkotunnukset</a>-osiossa. |
| Salasana | `************************` | Alias-kohtainen luotu salasana. |

Jotta voit käyttää yhteystietojen tukea, **käyttäjän** on oltava sellaisen aliaksen sähköpostiosoite, joka on olemassa verkkotunnukselle kohdassa <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Oma tili <i class="fa fa-angle-right"></i>Verkkotunnukset</a> – ja **salasanan** on oltava aliakselle erikseen luotu salasana.

### Tuetteko sähköpostin lähettämistä SMTP:n avulla? {#do-you-support-sending-email-with-smtp}

Kyllä, toukokuusta 2023 alkaen tuemme sähköpostin lähettämistä SMTP:n avulla lisäosana kaikille maksaville käyttäjille.

<div id="smtp-ohjeet">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tärkeää:
</strong>
<span>
Varmista, että olet lukenut <a href="/terms" class="alert-link" target="_blank">käyttöehtomme</a>, <a href="/privacy" class="alert-link" target="_blank">tietosuojakäytäntömme</a> ja <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">lähtevän SMTP-liikenteen rajoituksemme</a> – käyttösi katsotaan tiedoksi ja hyväksyt sen.
</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tärkeää:
</strong>
<span>
Jos käytät Gmailia, katso <a class="alert-link" href="/guides/send-mail-as-gmail-custom-domain">Lähetä sähköpostia kuten Gmailissa -oppaamme</a>. Jos olet kehittäjä, katso <a class="alert-link" href="/email-api#outbound-emails" target="_blank">sähköposti-API-dokumentaatiomme</a>.
</span>
</div>

1. Siirry kohtaan <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Oma tili <i class="fa fa-angle-right"></i> Verkkotunnukset</a> <i class="fa fa-angle-right"></i> Asetukset <i class="fa fa-angle-right"></i> Lähtevän SMTP:n asetukset ja noudata asennusohjeita.

2. Luo verkkotunnuksellesi uusi alias kohdassa <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Oma tili <i class="fa fa-angle-right"></i> Verkkotunnukset</a> <i class="fa fa-angle-right"></i> Aliakset (esim. <code><hello@example.com></code>)

3. Napsauta <strong class="text-success"><i class="fa fa-key"></i>Luo salasana</strong> -painiketta juuri luodun aliaksen vieressä. Kopioi leikepöydälle ja tallenna näytöllä näkyvä luotu salasana turvallisesti.

4. Lisää tai määritä tili haluamallasi sähköpostisovelluksella, jossa on juuri luomasi alias (esim. <code><hello@example.com></code>).
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Vinkki:
</strong>
<span>Suosittelemme <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbirdin</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobilen</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mailin</a> tai <a href="/blog/open-source" käyttöä. class="alert-link" target="_blank">avoimen lähdekoodin ja yksityisyyteen keskittyvä vaihtoehto</a>.</span>
</div>

5. Kun SMTP-palvelimen nimeä pyydetään antamaan, kirjoita `smtp.forwardemail.net`

6. Kun sinulta kysytään SMTP-palvelimen porttia, anna `465` (SSL/TLS) – katso tarvittaessa [vaihtoehtoiset SMTP-portit](/faq#what-are-your-smtp-server-configuration-settings)
<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Vinkki:
</strong>
<span>Jos käytät Thunderbirdiä, varmista, että "Yhteyden suojaus" -asetukseksi on asetettu "SSL/TLS" ja todennusmenetelmäksi on asetettu "Normaali salasana".</span>
</div>

7. Kun sinulta kysytään SMTP-palvelimen salasanaa, liitä salasana kohdasta <strong class="text-success"><i class="fa fa-key"></i>Luo salasana</strong> yllä olevassa vaiheessa 3.

8. **Tallenna asetuksesi ja lähetä ensimmäinen testisähköposti** – jos sinulla on ongelmia, <a href="/help">ota meihin yhteyttä</a>

<div class="alert my-3 alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tärkeää:
</strong>
<span>
Huomaa, että IP-osoitteen maineen ylläpitämiseksi ja toimitettavuuden varmistamiseksi meillä on manuaalinen tarkistusprosessi lähtevien SMTP-viestien hyväksynnälle verkkotunnuskohtaisesti. Tämä kestää yleensä alle 24 tuntia, ja useimmat pyynnöt käsitellään 1–2 tunnin kuluessa. Lähitulevaisuudessa pyrimme tekemään tästä prosessista välittömän lisäämällä roskapostin hallintaa ja hälytyksiä. Tämä prosessi varmistaa, että sähköpostisi päätyvät postilaatikkoon eivätkä viestisi merkitä roskapostiksi.
</span>
</div>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Onnittelut!
</strong>
<span>
Olet suorittanut kaikki vaiheet onnistuneesti.
</span>
</div>
</div>

</div>

### Tuetteko OpenPGP/MIME:tä, päästä päähän -salausta ("E2EE") ja Web Key Directorya ("WKD")? {#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd}

Kyllä, tuemme [OpenPGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy#OpenPGP):aa ja [päästä päähän -salaus ("E2EE")](https://en.wikipedia.org/wiki/End-to-end_encryption):tä sekä julkisten avainten etsimistä [Verkkoavainten hakemisto ("WKD")](https://wiki.gnupg.org/WKD):n avulla. Voit määrittää OpenPGP:n [keys.openpgp.org](https://keys.openpgp.org/about/usage#wkd-as-a-service):n tai [isännöi omia avaimiasi](https://wiki.gnupg.org/WKDHosting):n avulla (katso [tämä WKD-palvelimen asennuksen ydin](https://gist.github.com/kafene/0a6e259996862d35845784e6e5dbfc79)).

* WKD-haut tallennetaan välimuistiin 1 tunniksi, jotta sähköpostit toimitetaan oikea-aikaisesti → jos siis lisäät, muutat tai poistat WKD-avaimesi, lähetä meille sähköpostia osoitteeseen `support@forwardemail.net` ja kerro sähköpostiosoitteesi, jotta voimme tyhjentää välimuistin manuaalisesti.
* Tuemme PGP-salausta viesteille, jotka lähetetään edelleen WKD-haun kautta tai käyttämällä käyttöliittymässämme ladattua PGP-avainta.
* Ladatut avaimet ovat voimassa niin kauan kuin PGP-valintaruutu on käytössä/valittu.
* Webhookeihin lähetettyjä viestejä ei tällä hetkellä salata PGP:llä.
* Jos sinulla on useita aliaksia, jotka vastaavat tiettyä edelleenlähetysosoitetta (esim. säännöllinen lauseke/jokerimerkki/tarkka yhdistelmä), ja jos useampi kuin yksi näistä sisältää ladatun PGP-avaimen ja PGP on tarkistettu → lähetämme sinulle virheilmoituksen sähköpostitse emmekä salaa viestiä ladatulla PGP-avaimellasi. Tämä on hyvin harvinaista ja koskee yleensä vain edistyneitä käyttäjiä, joilla on monimutkaisia alias-sääntöjä. * **PGP-salausta ei käytetä sähköpostin edelleenlähetykseen MX-palvelimiemme kautta, jos lähettäjällä on DMARC-hylkäyskäytäntö. Jos tarvitset PGP-salausta *kaikelle* sähköpostille, suosittelemme IMAP-palvelumme käyttöä ja PGP-avaimesi määrittämistä saapuvan postin aliakselle.**

**Voit vahvistaa Web Key Directory -asetuksesi osoitteessa <https://wkd.chimbosonic.com/> (avoimen lähdekoodin hakemisto) tai <https://www.webkeydirectory.com/> (omistusoikeudella suojattu hakemisto).**

<div class="alert my-3 alert-success">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Automaattinen salaus:
</strong>
<span>Jos käytät <a href="#do-you-support-sending-email-with-smtp" class="alert-link">lähtevää SMTP-palveluamme</a> ja lähetät salaamattomia viestejä, yritämme automaattisesti salata viestit vastaanottajakohtaisesti käyttämällä <a class="alert-link" href="https://wiki.gnupg.org/WKD">Web-avainhakemistoa ("WKD")</a>.</span>
</div>

<div class="alert alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tärkeää:
</strong>
<span>
Sinun on noudatettava kaikkia seuraavia vaiheita ottaaksesi OpenPGP:n käyttöön mukautetussa verkkotunnuksessasi.
</span>
</div>

1. Lataa ja asenna sähköpostiohjelmasi suosittelema lisäosa alta:

| Sähköpostiohjelma | Alusta | Suositeltu laajennus | Muistiinpanoja |
| --------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Thunderbird | Työpöytä | [Configure OpenPGP in Thunderbird](https://support.mozilla.org/en-US/kb/openpgp-thunderbird-howto-and-faq#w_i-have-never-used-openpgp-with-thunderbird-before-how-do-i-setup-openpgp) | Thunderbirdissä on sisäänrakennettu OpenPGP-tuki. |
| Gmail | Selain | [Mailvelope](https://mailvelope.com/) tai [FlowCrypt](https://flowcrypt.com/download) (omistusoikeudellinen lisenssi) | Gmail ei tue OpenPGP:tä, mutta voit ladata avoimen lähdekoodin laajennuksen [Mailvelope](https://mailvelope.com/) tai [FlowCrypt](https://flowcrypt.com/download). |
| Apple Mail | macOS | [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation) | Apple Mail ei tue OpenPGP:tä, mutta voit ladata avoimen lähdekoodin laajennuksen [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation). |
| Apple Mail | iOS | [PGPro](https://github.com/opensourceios/PGPro/) tai [FlowCrypt](https://apps.apple.com/us/app/flowcrypt-encrypted-email/id1591754995) (omistusoikeudellinen lisenssi) | Apple Mail ei tue OpenPGP:tä, mutta voit ladata avoimen lähdekoodin laajennuksen [PGPro](https://github.com/opensourceios/PGPro/) tai [FlowCrypt](https://flowcrypt.com/download). |
| Näkymät | Ikkunat | [gpg4win](https://www.gpg4win.de/index.html) | Outlookin työpöytäsähköpostiohjelma ei tue OpenPGP:tä, mutta voit ladata avoimen lähdekoodin laajennuksen [gpg4win](https://www.gpg4win.de/index.html). |
| Näkymät | Selain | [Mailvelope](https://mailvelope.com/) tai [FlowCrypt](https://flowcrypt.com/download) (omistusoikeudellinen lisenssi) | Outlookin verkkopohjainen sähköpostiohjelma ei tue OpenPGP:tä, mutta voit ladata avoimen lähdekoodin laajennuksen [Mailvelope](https://mailvelope.com/) tai [FlowCrypt](https://flowcrypt.com/download). |
| Android | Mobiili | [OpenKeychain](https://www.openkeychain.org/) tai [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email) | [Android mail clients](/blog/open-source/android-email-clients), kuten [Thunderbird Mobile](https://www.thunderbird.net/en-US/mobile/) ja [FairEmail](https://github.com/M66B/FairEmail), tukevat molemmat avoimen lähdekoodin laajennusta [OpenKeychain](https://www.openkeychain.org/). Voit vaihtoehtoisesti käyttää avoimen lähdekoodin (omistusoikeudella lisensoitua) laajennusta [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email). |
| Google Chrome | Selain | [Mailvelope](https://mailvelope.com/) tai [FlowCrypt](https://flowcrypt.com/download) (omistusoikeudellinen lisenssi) | Voit ladata avoimen lähdekoodin selainlaajennuksen [Mailvelope](https://mailvelope.com/) tai [FlowCrypt](https://flowcrypt.com/download). |
| Mozilla Firefox | Selain | [Mailvelope](https://mailvelope.com/) tai [FlowCrypt](https://flowcrypt.com/download) (omistusoikeudellinen lisenssi) | Voit ladata avoimen lähdekoodin selainlaajennuksen [Mailvelope](https://mailvelope.com/) tai [FlowCrypt](https://flowcrypt.com/download). |
| Microsoft Edge | Selain | [Mailvelope](https://mailvelope.com/) | Voit ladata avoimen lähdekoodin selainlaajennuksen [Mailvelope](https://mailvelope.com/). |
| Rohkea | Selain | [Mailvelope](https://mailvelope.com/) tai [FlowCrypt](https://flowcrypt.com/download) (omistusoikeudellinen lisenssi) | Voit ladata avoimen lähdekoodin selainlaajennuksen [Mailvelope](https://mailvelope.com/) tai [FlowCrypt](https://flowcrypt.com/download). |
| Balsa | Työpöytä | [Configure OpenPGP in Balsa](https://www.mynetcologne.de/~nc-dreszal/balsa/balsa23-secure-mail.html#USING) | Balsalla on sisäänrakennettu tuki OpenPGP:lle. |
| KMail | Työpöytä | [Configure OpenPGP in KMail](https://userbase.kde.org/KMail/PGP_MIME) | KMailissa on sisäänrakennettu OpenPGP-tuki. |
| GNOME-kehitys | Työpöytä | [Configure OpenPGP in Evolution](https://help.gnome.org/users/evolution/stable/mail-encryption.html.en) | GNOME Evolutionissa on sisäänrakennettu OpenPGP-tuki. |
| Terminaali | Työpöytä | [Configure gpg in Terminal](https://docs.github.com/en/authentication/managing-commit-signature-verification/generating-a-new-gpg-key#generating-a-gpg-key) | Voit käyttää avoimen lähdekoodin [gpg command line tool](https://www.gnupg.org/download/) -komentoa uuden avaimen luomiseen komentoriviltä. |

2. Avaa lisäosa, luo julkinen avaimesi ja määritä sähköpostiohjelmasi käyttämään sitä.

3. Lataa julkinen avaimesi osoitteeseen <https://keys.openpgp.org/upload>.

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Vinkki:
</strong>
<span>Voit hallita avaintasi tulevaisuudessa osoitteessa <a class="alert-link" href="https://keys.openpgp.org/manage">https://keys.openpgp.org/manage</a>".</span>
</div>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Valinnainen lisäosa:
</strong>
<span>
Jos käytät <a class="alert-link" href="/blog/docs/best-quantum-safe-encrypted-email-service">salattua tallennuspalveluamme (IMAP/POP3)</a> ja haluat, että <i>kaikki</i> (jo salattuun) SQLite-tietokantaan tallennetut sähköpostit salataan julkisella avaimellasi, siirry kohtaan <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Oma tili <i class="fa fa-angle-right"></i> Verkkotunnukset</a> <i class="fa fa-angle-right"></i> Aliakset (esim. <code>hello@example.com</code>) <i class="fa fa-angle-right"></i> Muokkaa <i class="fa fa-angle-right"></i> OpenPGP:tä ja lataa julkinen avaimesi.
</span>
</div>

4. Lisää uusi `CNAME`-tietue verkkotunnukseesi (esim. `example.com`):

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Nimi/Isäntä/Alias</th>
<th class="text-center">TTL</th>
<th>Tyyppi</th>
<th>Vastaus/Arvo</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>openpgpkey</code></td>
<td class="text-center">3600</td>
<td class="notranslate">CNAME</td>
<td><code>wkd.keys.openpgp.org</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Vinkki:
</strong>
<span>Jos aliaksesi käytetään <a class="alert-link" href="/disposable-addresses" target="_blank">vanity/disposable-domain-osoitteitamme</a> (esim. <code>hideaddress.net</code>), voit ohittaa tämän vaiheen.</span>
</div>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Onnittelut!
</strong>
<span>
Olet suorittanut kaikki vaiheet onnistuneesti.
</span>
</div>
</div>

### Tuetko MTA-STS:ää? {#do-you-support-mta-sts}

Kyllä, 2. maaliskuuta 2023 alkaen tuemme [MTA-STS](https://www.hardenize.com/blog/mta-sts):aa. Voit käyttää [tämä malli](https://github.com/jpawlowski/mta-sts.template):aa, jos haluat ottaa sen käyttöön verkkotunnuksessasi.

Kokoonpanomme löytyy julkisesti GitHubista osoitteesta <https://github.com/forwardemail/mta-sts.forwardemail.net>.

### Tuetteko todennuksia ja WebAuthnia? {#do-you-support-passkeys-and-webauthn}

Kyllä! 13. joulukuuta 2023 alkaen olemme lisänneet tuen salasanoille [suuren kysynnän vuoksi](https://github.com/orgs/forwardemail/discussions/182).

Salasanat mahdollistavat turvallisen kirjautumisen ilman salasanaa ja kaksivaiheista todennusta.

Voit vahvistaa henkilöllisyytesi kosketuksella, kasvojentunnistuksella, laitepohjaisella salasanalla tai PIN-koodilla.

Voit hallita jopa 30 salasanaa samanaikaisesti, joten voit kirjautua sisään kaikilla laitteillasi helposti.

Lisätietoja salasanoista löydät seuraavista linkeistä:

* [Kirjaudu sovelluksiin ja verkkosivustoihin salasanoilla](https://support.google.com/android/answer/14124480?hl=en) (Google)
* [Kirjautuminen sovelluksiin ja verkkosivustoille iPhonessa salasanojen avulla](https://support.apple.com/guide/iphone/use-passkeys-to-sign-in-to-apps-and-websites-iphf538ea8d0/ios) (Apple)
* [Wikipedian artikkeli salasanoista](https://en.wikipedia.org/wiki/Passkey_\(credential\))

### Tuetko sähköpostin parhaita käytäntöjä? {#do-you-support-email-best-practices}

Kyllä. Kaikissa paketeissamme on sisäänrakennettu tuki SPF:lle, DKIM:lle, DMARC:lle, ARC:lle ja SRS:lle. Olemme myös tehneet laajasti yhteistyötä näiden spesifikaatioiden alkuperäisten tekijöiden ja muiden sähköpostiasiantuntijoiden kanssa varmistaaksemme täydellisyyden ja korkean toimitettavuuden.

### Tuetteko webhookien palautusta? {#do-you-support-bounce-webhooks}

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Vinkki:
</strong>
Etsitkö dokumentaatiota sähköpostin webhookeista? Katso lisätietoja kohdasta <a href="/faq#do-you-support-webhooks" class="alert-link">Tuetaanko webhookeja?</a>.
<span>
</span>
</div>

Kyllä, 14. elokuuta 2024 alkaen olemme lisänneet tämän ominaisuuden. Voit nyt siirtyä kohtaan Oma tili → Verkkotunnukset → Asetukset → Palautuswebhookin URL-osoite ja määrittää `http://`- tai `https://`-URL-osoitteen, johon lähetämme `POST`-pyynnön aina, kun lähtevät SMTP-sähköpostit palautuvat.

Tämä on hyödyllistä lähtevän SMTP-postin hallintaan ja valvontaan – ja sitä voidaan käyttää tilaajien ylläpitoon, tilausten peruuttamiseen ja palautusten havaitsemiseen.

Bounce-webhook-hyötykuormat lähetetään JSON-muodossa, jolla on seuraavat ominaisuudet:

* `email_id` (Merkkijono) - sähköpostiosoite, joka vastaa Oma tili -osiossa olevaa sähköpostia → Sähköpostit (lähtevä SMTP)
* `list_id` (Merkkijono) - `List-ID`-otsikkoarvo (kirjainkokoa ei erottele), jos sellainen on, alkuperäisestä lähtevästä sähköpostista
* `list_unsubscribe` (Merkkijono) - `List-Unsubscribe`-otsikkoarvo (kirjainkokoa ei erottele), jos sellainen on, alkuperäisestä lähtevästä sähköpostista
* `feedback_id` (Merkkijono) - `Feedback-ID`-otsikkoarvo (kirjainkokoa ei erottele), jos sellainen on, alkuperäisestä lähtevästä sähköpostista
* `recipient` (Merkkijono) - palautuneen tai virheellisen viestin vastaanottajan sähköpostiosoite
* `message` (Merkkijono) - palautuksen yksityiskohtainen virheilmoitus
* `response` (Merkkijono) - SMTP-vastausviesti
* `list_id`0 (Numero) - jäsennetyn SMTP-vastauskoodi
* `list_id`1 (Merkkijono) - jos vastauskoodi oli luotettavasta lähteestä, tähän arvoon lisätään pääverkkotunnuksen nimi (esim. `list_id`2 tai `list_id`3)
* `list_id`4 (Objekti) - objekti, joka sisältää seuraavat ominaisuudet, jotka kuvaavat palautus- ja hylkäystilaa:
* `list_id`5 (Merkkijono) - palautustoiminto (esim. `list_id`6)
* `list_id`7 (Merkkijono) - palautuksen syy (esim. `list_id`8)
* `list_id`9 (Merkkijono) - palautusluokka (esim. `List-ID`0)
* `List-ID`1 (Numero) - palautuksen tilakoodi (esim. `List-ID`2)
* `List-ID`3 (Merkkijono) - vastauksen palautuskoodi viesti (esim. `List-ID`4)
* `List-ID`5 (Numero) - jäsennetyn rivin numero, jos sellainen on, `List-ID`6 (esim. `List-ID`7)
* `List-ID`8 (Objekti) - lähtevän sähköpostin avain-arvo-otsikkopari
* `List-ID`9 (Merkkijono) - `list_unsubscribe`0-muotoiltu päivämäärä, jolloin palautusvirhe tapahtui

Esimerkiksi:

```json
{
  "email_id": "66bcce793ef7b2a0928e14ba",
  "recipient": "example@gmail.com",
  "message": "The email account that you tried to reach is over quota.",
  "response": "552 5.2.2 The email account that you tried to reach is over quota.",
  "response_code": 552,
  "truth_source": "google.com",
  "bounce": {
    "action": "reject",
    "message": "Gmail Mailbox is full",
    "category": "capacity",
    "code": 552,
    "status": "5.2.2",
    "line": 300
  },
  "headers": {},
  "bounced_at": "2024-08-24T01:50:02.828Z"
}
```

Tässä on muutamia lisähuomautuksia bounce-webhookeista:

* Jos webhook-hyötykuorma sisältää `list_id`-, `list_unsubscribe`- tai `feedback_id`-arvon, sinun tulee tarvittaessa poistaa `recipient` luettelosta.
* Jos `bounce.category`-arvo oli `"block"`, `"recipient"`, `"spam"` tai `"virus"`, sinun tulee ehdottomasti poistaa käyttäjä luettelosta.
* Jos sinun on tarkistettava webhook-hyötykuormat (varmistaaksesi, että ne todella tulevat palvelimeltamme), voit käyttää [selvitä etäasiakkaan IP-osoite ja asiakkaan isäntänimi käänteisen haun avulla](https://nodejs.org/api/dns.html#dnspromisesreverseip)-arvoa – sen pitäisi olla `list_unsubscribe`0.
* Voit myös tarkistaa IP-osoitteen `list_unsubscribe`1-arvoa vasten.
* Siirry kohtaan Oma tili → Verkkotunnukset → Asetukset → Webhook-allekirjoituksen hyötykuorman vahvistusavain saadaksesi webhook-avaimesi.
* Voit vaihtaa tätä avainta milloin tahansa turvallisuussyistä. * Laske ja vertaa webhook-pyyntömme `list_unsubscribe`2-arvoa laskettuun rungon arvoon käyttämällä tätä avainta. Esimerkki tästä on saatavilla osoitteessa `list_unsubscribe`3.
* Katso lisätietoja keskustelusta osoitteessa <`list_unsubscribe`4.
* Odotamme enintään `list_unsubscribe`5 sekuntia, että webhook-päätepisteesi vastaa `list_unsubscribe`6-tilakoodilla, ja yritämme uudelleen enintään `list_unsubscribe`7 sekunnin kuluttua.
* Jos havaitsemme, että webhook-päätepisteesi palautus-URL-osoitteessa on virhe, kun yritämme lähettää sille pyynnön, lähetämme sinulle kohteliaisuussähköpostin kerran viikossa.

### Tuetteko webhookeja? {#do-you-support-webhooks}

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Vinkki:
</strong>
Etsitkö dokumentaatiota bounce-webhookeista? Katso lisätietoja kohdasta <a href="/faq#do-you-support-bounce-webhooks" class="alert-link">Tuetaanko bounce-webhookeja?</a>.
<span>
</span>
</div>

Kyllä, 15. toukokuuta 2020 alkaen olemme lisänneet tämän ominaisuuden. Voit yksinkertaisesti lisätä webhookin/webhookkeja aivan kuten minkä tahansa vastaanottajan kanssa! Varmista, että webhookin URL-osoitteessa on etuliitteenä "http" tai "https".

<div class="alert my-3 alert-danger">
<i class="fa fa-stop-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Parannettu yksityisyyden suoja:
</strong>
<span>
Jos käytät maksullista tilausta (jossa on parannettu yksityisyyden suoja), siirry kohtaan <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Oma tili <i class="fa fa-angle-right"></i>Verkkotunnukset</a> ja napsauta verkkotunnuksesi vieressä olevaa "Aliaset"-kohtaa määrittääksesi webhookkisi. Jos haluat lisätietoja maksullisista tilauksista, katso <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Hinnoittelusivumme</a>. Muussa tapauksessa voit jatkaa alla olevien ohjeiden noudattamista.
</span>
</div>

Jos käytät ilmaisversiota, lisää uusi DNS-<strong class="notranslate">TXT</strong>-tietue alla olevan kuvan mukaisesti:

Jos esimerkiksi haluan kaikkien `alias@example.com`-osoitteeseen menevien sähköpostien välittävän uuteen [pyyntölokero](https://requestbin.com/r/en8pfhdgcculn?inspect)-testipäätepisteeseen:

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Nimi/Isäntä/Alias</th>
<th class="text-center">TTL</th>
<th>Tyyppi</th>
<th>Vastaus/Arvo</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", tai tyhjä</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=alias:https://requestbin.com/r/en8pfhdgcculn</code></td>
</tr>
</tbody>
</table>

Tai ehkä haluat, että kaikki `example.com`-osoitteeseen menevät sähköpostit välitetään edelleen tähän päätepisteeseen:

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Nimi/Isäntä/Alias</th>
<th class="text-center">TTL</th>
<th>Tyyppi</th>
<th>Vastaus/Arvo</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", tai tyhjä</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=https://requestbin.com/r/en8pfhdgcculn</code></td>
</tr>
</tbody>
</table>

**Tässä on lisähuomautuksia webhookeista:**

* Jos sinun on tarkistettava webhook-hyötykuormat (jotta ne todella tulevat palvelimeltamme), voit käyttää [selvitä etäasiakkaan IP-osoite ja asiakkaan isäntänimi käänteisen haun avulla](https://nodejs.org/api/dns.html#dnspromisesreverseip) – sen pitäisi olla joko `mx1.forwardemail.net` tai `mx2.forwardemail.net`.
* Voit myös verrata IP-osoitetta [julkaistut IP-osoitteemme](#what-are-your-servers-ip-addresses):aan.
* Jos käytät maksullista sopimusta, siirry kohtaan Oma tili → Verkkotunnukset → Asetukset → Webhook Signature Payload Verification Key saadaksesi webhook-avaimesi.
* Voit kierrättää tätä avainta milloin tahansa turvallisuussyistä.
* Laske ja vertaa webhook-pyynnöstämme saamaamme `X-Webhook-Signature`-arvoa laskettuun rungon arvoon tällä avaimella. Esimerkki tästä on osoitteessa [tämä Stack Overflow -viesti](https://stackoverflow.com/a/68885281).
* Lisätietoja on keskustelussa osoitteessa <https://github.com/forwardemail/free-email-forwarding/issues/235>.
* Jos webhook ei vastaa `200`-tilakoodilla, tallennamme sen vastauksen [virheloki luotu](#do-you-store-error-logs)-muuttujaan – mikä on hyödyllistä virheenkorjauksessa. * Webhook HTTP -pyynnöt yrittävät uudelleen jopa 3 kertaa jokaista SMTP-yhteysyritystä kohden, ja päätepisteen POST-pyyntöjen enimmäisaikakatkaisuaika on 60 sekuntia. **Huomaa, että tämä ei tarkoita, että se yrittäisi uudelleen vain 3 kertaa**, vaan se yrittää itse asiassa jatkuvasti uudelleen lähettämällä SMTP-koodin 421 (joka ilmoittaa lähettäjälle, että hän yrittää uudelleen myöhemmin) kolmannen epäonnistuneen HTTP POST -pyyntöyrityksen jälkeen. Tämä tarkoittaa, että sähköposti yrittää uudelleen jatkuvasti päivien ajan, kunnes tilakoodi 200 saavutetaan.
* Yritämme uudelleen automaattisesti [superagentin uudelleenyritysmenetelmä](https://ladjs.github.io/superagent/#retrying-requests):ssä käytettyjen oletustila- ja virhekoodien perusteella (olemme ylläpitäjiä).
* Ryhmittelemme samaan päätepisteeseen lähetetyt webhook HTTP -pyynnöt yhdeksi pyynnöksi useiden sijaan resurssien säästämiseksi ja vastausajan nopeuttamiseksi. Jos esimerkiksi lähetät sähköpostia osoitteisiin <webhook1@example.com>, <webhook2@example.com> ja <webhook3@example.com>, ja kaikki nämä on määritetty osumaan *täsmälleen* samaan päätepisteen URL-osoitteeseen, tehdään vain yksi pyyntö. Ryhmittely perustuu täsmälliseen päätepisteiden yhteensovittamiseen ja ehdottomaan yhtäläisyyteen.
* Huomaa, että käytämme `mx1.forwardemail.net`0-kirjaston "simpleParser"-metodia viestin jäsentämiseen JSON-ystävälliseksi objektiksi.
* Raaka sähköpostiviestin arvo merkkijonona annetaan ominaisuutena "raw".
* Todennustulokset annetaan ominaisuuksina "dkim", "spf", "arc", "dmarc" ja "bimi".
* Jäsennetyt sähköpostiotsikot annetaan ominaisuutena "headers" – mutta huomaa myös, että voit käyttää "headerLines"-ominaisuutta helpottaaksesi iterointia ja jäsentämistä.
* Tämän webhookin ryhmitellyt vastaanottajat ryhmitellään yhteen ja annetaan ominaisuutena "recipients".
* SMTP-istunnon tiedot annetaan ominaisuutena "session". Tämä sisältää tietoja viestin lähettäjästä, viestin saapumisajasta, HELO:sta ja asiakkaan isäntänimestä. Asiakkaan isäntänimen arvo muodossa `mx1.forwardemail.net`1 on joko täydellinen toimialuenimi (käänteisestä PTR-hausta) tai se on `mx1.forwardemail.net`2 hakasulkeissa (esim. `mx1.forwardemail.net`3).
* Jos tarvitset nopean tavan saada `mx1.forwardemail.net`4-arvon, voit käyttää `mx1.forwardemail.net`5-arvoa (katso esimerkki alla). Otsikko `mx1.forwardemail.net`6 on otsikko, jonka lisäämme viesteihin virheenkorjausta varten viestin alkuperäisen vastaanottajan kanssa (ennen peitettyä edelleenlähetystä).
* Jos sinun on poistettava `mx1.forwardemail.net`7- ja/tai `mx1.forwardemail.net`8-ominaisuudet hyötykuorman rungosta, lisää `mx1.forwardemail.net`9, `mx2.forwardemail.net`0 tai `mx2.forwardemail.net`1 webhook-päätepisteeseesi kyselymerkkijonoparametrina (esim. `mx2.forwardemail.net`2).
* Jos liitteitä on, ne lisätään `mx2.forwardemail.net`3-taulukkoon puskuriarvoilla. Voit jäsentää ne takaisin sisällöksi käyttämällä JavaScript-lähestymistapaa, kuten:

  ```js
  const data = [
    104,
    101,
    108,
    108,
    111,
    32,
    119,
    111,
    114,
    108,
    100,
    33
  ];

  //
  // outputs "hello world!" to the console
  // (this is the content from the filename "text1.txt" in the example JSON request payload above)
  //
  console.log(Buffer.from(data).toString());
  ```

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Vinkki:
</strong>
Oletko utelias, miltä webhook-pyyntö näyttää edelleenlähetetyistä sähköposteista? Olemme lisänneet esimerkin alle!
<span>
</span>
</div>

```json
{
  "attachments": [
    {
      "type": "attachment",
      "content": {
        "type": "Buffer",
        "data": [
          104,
          101,
          108,
          108,
          111,
          32,
          119,
          111,
          114,
          108,
          100,
          33
        ]
      },
      "contentType": "text/plain",
      "partId": "2",
      "release": null,
      "contentDisposition": "attachment",
      "filename": "text1.txt",
      "headers": {},
      "checksum": "fc3ff98e8c6a0d3087d515c0473f8677",
      "size": 12
    }
  ],
  "headers": "ARC-Seal: i=1; a=rsa-sha256; t=1653506802; cv=none; d=forwardemail.net;\r\n s=default;\r\n b=R6QJ0tGwwjg2VPxiAlVIKxsg3jEPtRGKPTIOdZNWuhWrbssttFdOYzRRqvacDyN5SLoyDhVye\r\n DUA/64IxANXdHVFlpR258Yp7WxLDv2gtJD5vNSKYmUJZOWk1TynmlqTYrp0Vuqg2xIUjIlPBWAJ\r\n PPNx4JvOLjJuWYynU2qIWz0=\r\nARC-Message-Signature: i=1; a=rsa-sha256; c=relaxed/relaxed;\r\n d=forwardemail.net; h=MIME-Version: Date: Message-ID: From: Content-Type;\r\n q=dns/txt; s=default; t=1653506802;\r\n bh=cEYDoyTy+Ub29XZt/zXR+sprfUE6BW0y5cHfah01PT4=;\r\n b=F/t56AAXr2Kv3G6VsbdT5OKDVJf2ulhwLiTM18Ra4tDPUKPSGSLKrWvxiXEg5NMWwdWnsOYrL\r\n r3YSm4uMxVMhHZbHm/sUu4QZq5/18hQsAkCv6fI9ifTjDwBrN5zpLOhPoZFFo+TyvHxiII3Xv3L\r\n UEzmUIIaJRX6tboQ160tino=\r\nARC-Authentication-Results: i=1; mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)\r\nReceived-SPF: none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) client-ip=127.0.0.1;\r\nAuthentication-Results: mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)\r\n",
  "headerLines": [
    {
      "key": "arc-seal",
      "line": "ARC-Seal: i=1; a=rsa-sha256; t=1653506802; cv=none; d=forwardemail.net;\r\n s=default;\r\n b=R6QJ0tGwwjg2VPxiAlVIKxsg3jEPtRGKPTIOdZNWuhWrbssttFdOYzRRqvacDyN5SLoyDhVye\r\n DUA/64IxANXdHVFlpR258Yp7WxLDv2gtJD5vNSKYmUJZOWk1TynmlqTYrp0Vuqg2xIUjIlPBWAJ\r\n PPNx4JvOLjJuWYynU2qIWz0="
    },
    {
      "key": "arc-message-signature",
      "line": "ARC-Message-Signature: i=1; a=rsa-sha256; c=relaxed/relaxed;\r\n d=forwardemail.net; h=MIME-Version: Date: Message-ID: From: Content-Type;\r\n q=dns/txt; s=default; t=1653506802;\r\n bh=cEYDoyTy+Ub29XZt/zXR+sprfUE6BW0y5cHfah01PT4=;\r\n b=F/t56AAXr2Kv3G6VsbdT5OKDVJf2ulhwLiTM18Ra4tDPUKPSGSLKrWvxiXEg5NMWwdWnsOYrL\r\n r3YSm4uMxVMhHZbHm/sUu4QZq5/18hQsAkCv6fI9ifTjDwBrN5zpLOhPoZFFo+TyvHxiII3Xv3L\r\n UEzmUIIaJRX6tboQ160tino="
    },
    {
      "key": "arc-authentication-results",
      "line": "ARC-Authentication-Results: i=1; mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)"
    },
    {
      "key": "received-spf",
      "line": "Received-SPF: none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) client-ip=127.0.0.1;"
    },
    {
      "key": "authentication-results",
      "line": "Authentication-Results: mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)"
    },
    {
      "key": "x-forward-email-sender",
      "line": "X-Forward-Email-Sender: rfc822; test@example.net"
    },
    {
      "key": "x-forward-email-session-id",
      "line": "X-Forward-Email-Session-ID: w2czxgznghn5ryyw"
    },
    {
      "key": "x-forward-email-version",
      "line": "X-Forward-Email-Version: 9.0.0"
    },
    {
      "key": "content-type",
      "line": "Content-Type: multipart/mixed; boundary=\"--_NmP-179a735428ca7575-Part_1\""
    },
    {
      "key": "from",
      "line": "From: some <random@example.com>"
    },
    {
      "key": "message-id",
      "line": "Message-ID: <69ad5fc2-91cb-728f-ae5c-eeedc5f267b6@example.net>"
    },
    {
      "key": "date",
      "line": "Date: Wed, 25 May 2022 19:26:41 +0000"
    },
    {
      "key": "mime-version",
      "line": "MIME-Version: 1.0"
    }
  ],
  "html": "<strong>some random text</strong>",
  "text": "some random text",
  "textAsHtml": "<p>some random text</p>",
  "date": "2022-05-25T19:26:41.000Z",
  "from": {
    "value": [
      {
        "address": "random@example.com",
        "name": "some"
      }
    ],
    "html": "<span class=\"mp_address_group\"><span class=\"mp_address_name\">some</span> &lt;<a href=\"mailto:random@example.com\" class=\"mp_address_email\">random@example.com</a>&gt;</span>",
    "text": "some <random@example.com>"
  },
  "messageId": "<69ad5fc2-91cb-728f-ae5c-eeedc5f267b6@example.net>",
  "raw": "ARC-Seal: i=1; a=rsa-sha256; t=1653506802; cv=none; d=forwardemail.net;\r\n s=default;\r\n b=R6QJ0tGwwjg2VPxiAlVIKxsg3jEPtRGKPTIOdZNWuhWrbssttFdOYzRRqvacDyN5SLoyDhVye\r\n DUA/64IxANXdHVFlpR258Yp7WxLDv2gtJD5vNSKYmUJZOWk1TynmlqTYrp0Vuqg2xIUjIlPBWAJ\r\n PPNx4JvOLjJuWYynU2qIWz0=\r\nARC-Message-Signature: i=1; a=rsa-sha256; c=relaxed/relaxed;\r\n d=forwardemail.net; h=MIME-Version: Date: Message-ID: From: Content-Type;\r\n q=dns/txt; s=default; t=1653506802;\r\n bh=cEYDoyTy+Ub29XZt/zXR+sprfUE6BW0y5cHfah01PT4=;\r\n b=F/t56AAXr2Kv3G6VsbdT5OKDVJf2ulhwLiTM18Ra4tDPUKPSGSLKrWvxiXEg5NMWwdWnsOYrL\r\n r3YSm4uMxVMhHZbHm/sUu4QZq5/18hQsAkCv6fI9ifTjDwBrN5zpLOhPoZFFo+TyvHxiII3Xv3L\r\n UEzmUIIaJRX6tboQ160tino=\r\nARC-Authentication-Results: i=1; mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)\r\nReceived-SPF: none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) client-ip=127.0.0.1;\r\nAuthentication-Results: mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)\r\nX-Forward-Email-Sender: rfc822; test@example.net\r\nX-Forward-Email-Session-ID: w2czxgznghn5ryyw\r\nX-Forward-Email-Version: 9.0.0\r\nContent-Type: multipart/mixed; boundary=\"--_NmP-179a735428ca7575-Part_1\"\r\nFrom: some <random@example.com>\r\nMessage-ID: <69ad5fc2-91cb-728f-ae5c-eeedc5f267b6@example.net>\r\nDate: Wed, 25 May 2022 19:26:41 +0000\r\nMIME-Version: 1.0\r\n\r\n----_NmP-179a735428ca7575-Part_1\r\nContent-Type: multipart/alternative;\r\n boundary=\"--_NmP-179a735428ca7575-Part_2\"\r\n\r\n----_NmP-179a735428ca7575-Part_2\r\nContent-Type: text/plain; charset=utf-8\r\nContent-Transfer-Encoding: 7bit\r\n\r\nsome random text\r\n----_NmP-179a735428ca7575-Part_2\r\nContent-Type: text/html; charset=utf-8\r\nContent-Transfer-Encoding: 7bit\r\n\r\n<strong>some random text</strong>\r\n----_NmP-179a735428ca7575-Part_2--\r\n\r\n----_NmP-179a735428ca7575-Part_1\r\nContent-Type: text/plain; name=text1.txt\r\nContent-Transfer-Encoding: base64\r\nContent-Disposition: attachment; filename=text1.txt\r\n\r\naGVsbG8gd29ybGQh\r\n----_NmP-179a735428ca7575-Part_1--\r\n",
  "dkim": {
    "headerFrom": [
      "random@example.com"
    ],
    "envelopeFrom": "test@example.net",
    "results": [
      {
        "status": {
          "result": "none",
          "comment": "message not signed"
        },
        "info": "dkim=none (message not signed)"
      }
    ]
  },
  "spf": {
    "domain": "example.net",
    "client-ip": "127.0.0.1",
    "helo": "user.oem.local",
    "envelope-from": "test@example.net",
    "status": {
      "result": "none",
      "comment": "mx1.forwardemail.net: example.net does not designate permitted sender hosts",
      "smtp": {
        "mailfrom": "test@example.net",
        "helo": "user.oem.local"
      }
    },
    "header": "Received-SPF: none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) client-ip=127.0.0.1;",
    "info": "spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local",
    "lookups": {
      "limit": 50,
      "count": 1
    }
  },
  "arc": {
    "status": {
      "result": "none"
    },
    "i": 0,
    "authResults": "mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)"
  },
  "dmarc": {
    "status": {
      "result": "none",
      "header": {
        "from": "example.com"
      }
    },
    "domain": "example.com",
    "info": "dmarc=none header.from=example.com"
  },
  "bimi": {
    "status": {
      "header": {},
      "result": "skipped",
      "comment": "DMARC not enabled"
    },
    "info": "bimi=skipped (DMARC not enabled)"
  },
  "recipients": [
    "webhook1@webhooks.net"
  ],
  "session": {
    "recipient": "webhook1@webhooks.net",
    "remoteAddress": "127.0.0.1",
    "remotePort": 65138,
    "clientHostname": "[127.0.0.1]",
    "hostNameAppearsAs": "user.oem.local",
    "sender": "test@example.net",
    "mta": "mx1.forwardemail.net",
    "arrivalDate": "2022-05-25T19:26:41.423Z",
    "arrivalTime": 1653506801423
  }
}
```

### Tuetaanko säännöllisiä lausekkeita tai regexiä? {#do-you-support-regular-expressions-or-regex}

Kyllä, olemme lisänneet tämän ominaisuuden 27. syyskuuta 2021 alkaen. Voit yksinkertaisesti kirjoittaa säännöllisiä lausekkeita ("regex") aliasten täsmäykseen ja korvausten suorittamiseen.

Säännöllisten lausekkeiden tuetut aliakset alkavat merkeillä `/` ja päättyvät merkeihin `/`, ja niiden vastaanottajat ovat sähköpostiosoitteita tai webhookeja. Vastaanottajat voivat myös sisältää säännöllisten lausekkeiden korvaamisen tuen (esim. `$1`, `$2`).

Tuemme kahta säännöllisen lausekkeen lippua, mukaan lukien `i` ja `g`. Kirjainkokoa ei erotteleva `i`-lippu on pysyvä oletusarvo, ja sitä käytetään aina. Voit lisätä globaalin `g`-lipun liittämällä `/`:n loppuun `/g`.

Huomaa, että tuemme myös <a href="#can-i-disable-specific-aliases">disabled-aliasominaisuuttamme</a> vastaanottajaosassa säännöllisten lausekkeiden tuella.

Säännöllisiä lausekkeita ei tueta <a href="/disposable-addresses" target="_blank">globaaleilla vanity-verkkotunnuksilla</a> (koska tämä voi olla tietoturvahaavoittuvuus).

<div class="alert my-3 alert-danger">
<i class="fa fa-stop-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Parannettu yksityisyyden suoja:
</strong>
<span>
Jos käytät maksullista tilausta (jossa on parannettu yksityisyyden suoja), siirry kohtaan <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Oma tili <i class="fa fa-angle-right"></i>Verkkotunnukset</a> ja napsauta verkkotunnuksesi vieressä olevaa "Aliaset"-kohtaa määrittääksesi säännölliset lausekkeet. Jos haluat lisätietoja maksullisista tilauksista, katso <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Hinnoittelusivumme</a>. Muussa tapauksessa voit jatkaa alla olevien ohjeiden noudattamista.
</span>
</div>

Jos käytät ilmaisversiota, lisää uusi DNS-<strong class="notranslate">TXT</strong>-tietue käyttämällä yhtä tai useampaa alla olevista esimerkeistä:

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Yksinkertainen esimerkki:</strong> Jos haluan, että kaikki `linus@example.com`- tai `torvalds@example.com`-postiin menevät sähköpostit välitetään edelleen `user@gmail.com`-postiin:
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Nimi/Isäntä/Alias</th>
<th class="text-center">TTL</th>
<th>Tyyppi</th>
<th>Vastaus/Arvo</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", tai tyhjä</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^(linus|torvalds)$/:user@gmail.com</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Etunimi Sukunimi Korvausesimerkki:</strong> Kuvittele, että kaikki yrityksesi sähköpostiosoitteet ovat `firstname.lastname@example.com`-mallia. Jos haluan, että kaikki `firstname.lastname@example.com`-malliin kuuluvat sähköpostit lähetetään edelleen `firstname.lastname@company.com`-malliin korvauksen tuella (<a href="https://regexr.com/66hnu" class="alert-link">katsele RegExr-lauseketta</a>):
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Nimi/Isäntä/Alias</th>
<th class="text-center">TTL</th>
<th>Tyyppi</th>
<th>Vastaus/Arvo</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", tai tyhjä</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^([A-Za-z]+)+\.([A-Za-z]+)+$/:$1.$2@yritys.com</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Plus-symbolin suodatuksen korvaamisen esimerkki:</strong> Jos haluan, että kaikki `info@example.com`- tai `support@example.com`-kansioon menevät sähköpostit välitetään vastaavasti `user+info@gmail.com`- tai `user+support@gmail.com`-kansioon (korvaustuella) (<a href="https://regexr.com/66ho7" class="alert-link">katsele RegExr-lauseketta</a>):
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Nimi/Isäntä/Alias</th>
<th class="text-center">TTL</th>
<th>Tyyppi</th>
<th>Vastaus/Arvo</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", tai tyhjä</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^(tuki|info)$/:käyttäjä+$1@gmail.com</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Esimerkki webhookin kyselymerkkijonon korvaamisesta:</strong> Ehkä haluat, että kaikki `example.com`-kohteeseen menevät sähköpostit menevät <a href="#do-you-support-webhooks" class="alert-link">webhookiin</a> ja että niillä on dynaaminen kyselymerkkijonon avain "to" ja sähköpostiosoitteen käyttäjätunnusosan arvo (<a href="https://regexr.com/66ho4" class="alert-link">katsele RegExr-lauseketta</a>):
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Nimi/Isäntä/Alias</th>
<th class="text-center">TTL</th>
<th>Tyyppi</th>
<th>Vastaus/Arvo</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", tai tyhjä</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^(.*?)$/:https://example.com/webhook?username=$1</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Esimerkki hiljaisesta hylkäämisestä:</strong> Jos haluat, että kaikki tiettyä mallia vastaavat sähköpostit poistetaan käytöstä ja hylätään hiljaisesti (lähettäjälle viesti näyttää siltä kuin se olisi lähetetty onnistuneesti, mutta todellisuudessa se ei etene mihinkään) tilakoodilla `250` (katso <a href="#can-i-disable-specific-aliases" class="alert-link">Voinko poistaa tiettyjä aliaksia käytöstä</a>), käytä samaa lähestymistapaa yhdellä huutomerkillä "!". Tämä osoittaa lähettäjälle, että viesti toimitettiin onnistuneesti, mutta se ei todellisuudessa mennyt mihinkään (esim. mustaan reikään tai `/dev/null`).
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Nimi/Isäntä/Alias</th>
<th class="text-center">TTL</th>
<th>Tyyppi</th>
<th>Vastaus/Arvo</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", tai tyhjä</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^(linus|torvalds)$/:!</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Esimerkki pehmeästä hylkäyksestä:</strong> Jos haluat, että kaikki tiettyä mallia vastaavat sähköpostit poistetaan käytöstä ja hylätään pehmeästi tilakoodilla `421` (katso <a href="#can-i-disable-specific-aliases" class="alert-link">Voinko poistaa tiettyjä aliaksia käytöstä</a>), käytä samaa lähestymistapaa kaksoishuutomerkillä "!!". Tämä kehottaa lähettäjää yrittämään sähköpostin lähettämistä uudelleen, ja tähän aliakseen lähetettyjä sähköposteja yritetään uudelleen noin viiden päivän ajan, minkä jälkeen ne hylätään pysyvästi.
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Nimi/Isäntä/Alias</th>
<th class="text-center">TTL</th>
<th>Tyyppi</th>
<th>Vastaus/Arvo</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", tai tyhjä</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^(linus|torvalds)$/:!!</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Esimerkki tiukasta hylkäämisestä:</strong> Jos haluat, että kaikki tiettyä mallia vastaavat sähköpostit poistetaan käytöstä ja hylätään tiukasti tilakoodilla `550` (katso <a href="#can-i-disable-specific-aliases" class="alert-link">Voinko poistaa tiettyjä aliaksia käytöstä</a>), käytä samaa lähestymistapaa kolminkertaisella huutomerkillä "!!!". Tämä ilmoittaa lähettäjälle pysyvästä virheestä, eivätkä sähköpostit yritä uudelleen, vaan ne hylätään tämän aliaksen vuoksi.
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Nimi/Isäntä/Alias</th>
<th class="text-center">TTL</th>
<th>Tyyppi</th>
<th>Vastaus/Arvo</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", tai tyhjä</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^(linus|torvalds)$/:!!!</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Vinkki:
</strong>
Oletko utelias kirjoittamaan säännöllisen lausekkeen tai testaamaan korvaavaa lausekettasi? Voit mennä ilmaiselle säännöllisten lausekkeiden testaussivustolle <a href="https://regexr.com" class="alert-link">RegExr</a> osoitteessa <a href="https://regexr.com/" class="alert-link">https://regexr.com</a>.
<span>
</span>
</div>

### Mitkä ovat lähtevän SMTP-viestinnän rajoituksesi? {#what-are-your-outbound-smtp-limits}

Rajoitamme käyttäjien ja verkkotunnusten lähtevien SMTP-viestien määrän 300:aan päivässä. Tämä tarkoittaa keskimäärin yli 9000 sähköpostia kalenterikuukaudessa. Jos sinun on ylitettävä tämä määrä tai sinulla on jatkuvasti suuria sähköposteja, käytä [ota meihin yhteyttä](https://forwardemail.net/help)-rajoitusta.

### Tarvitsenko hyväksynnän SMTP:n käyttöönottoon? {#do-i-need-approval-to-enable-smtp}

Kyllä, huomioithan, että IP-osoitteen maineen ylläpitämiseksi ja toimitettavuuden varmistamiseksi Forward Emaililla on manuaalinen tarkistusprosessi lähtevien SMTP-viestien hyväksyntää varten verkkotunnuskohtaisesti. Lähetä sähköpostia osoitteeseen <support@forwardemail.net> tai avaa [avunpyyntö](https://forwardemail.net/help) hyväksyntää varten. Tämä kestää yleensä alle 24 tuntia, ja useimmat pyynnöt käsitellään 1–2 tunnin kuluessa. Lähitulevaisuudessa pyrimme tekemään tästä prosessista välittömän lisäämällä roskapostin hallintaa ja ilmoituksia. Tämä prosessi varmistaa, että sähköpostisi päätyvät postilaatikkoon eivätkä viestisi merkitä roskapostiksi.

### Mitkä ovat SMTP-palvelimesi määritysasetukset? {#what-are-your-smtp-server-configuration-settings}

Palvelimemme on `smtp.forwardemail.net` ja sitä valvotaan myös <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">tilasivullamme</a>.

Se tukee sekä IPv4:ää että IPv6:tta ja on käytettävissä porttien `465` ja `2465` kautta SSL/TLS:lle sekä porttien `587`, `2587`, `2525` ja `25` kautta TLS:lle (STARTTLS).

| Protokolla | Isäntänimi | Portit | IPv4 | IPv6 |
| :--------------------------------------------------------------: | ----------------------- | :-------------------------: | :----------------: | :----------------: |
| `SSL/TLS` **Suositeltu** | `smtp.forwardemail.net` | `465`, `2465` | :valkoinen_tarkistusmerkki: | :valkoinen_tarkistusmerkki: |
| `TLS` ([STARTTLS](https://wikipedia.org/wiki/Opportunistic_TLS)) | `smtp.forwardemail.net` | `587`, `2587`, `2525`, `25` | :valkoinen_tarkistusmerkki: | :valkoinen_tarkistusmerkki: |

| Kirjaudu sisään | Esimerkki | Kuvaus |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Käyttäjätunnus | `user@example.com` | Verkkotunnukselle olemassa olevan aliaksen sähköpostiosoite <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Oma tili <i class="fa fa-angle-right"></i>Verkkotunnukset</a>-osiossa. |
| Salasana | `************************` | Alias-kohtainen luotu salasana. |

Jotta lähtevää sähköpostia voidaan lähettää SMTP:n kautta, **SMTP-käyttäjän** on oltava sellaisen aliaksen sähköpostiosoite, joka on olemassa verkkotunnukselle kohdassa <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Oma tili <i class="fa fa-angle-right"></i>Verkkotunnukset</a> – ja **SMTP-salasanan** on oltava aliakselle erikseen luotu salasana.

Katso vaiheittaiset ohjeet kohdasta [Tuetteko sähköpostin lähettämistä SMTP:n kautta?](#do-you-support-sending-email-with-smtp).

### Mitkä ovat IMAP-palvelimesi määritysasetukset? {#what-are-your-imap-server-configuration-settings}

Palvelimemme on `imap.forwardemail.net` ja sitä valvotaan myös <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">tilasivullamme</a>.

Se tukee sekä IPv4- että IPv6-protokollaa ja on käytettävissä porttien `993` ja `2993` kautta SSL/TLS-salausta varten.

| Protokolla | Isäntänimi | Portit | IPv4 | IPv6 |
| :---------------------: | ----------------------- | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **Suositeltu** | `imap.forwardemail.net` | `993`, `2993` | :valkoinen_tarkistusmerkki: | :valkoinen_tarkistusmerkki: |

| Kirjaudu sisään | Esimerkki | Kuvaus |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Käyttäjätunnus | `user@example.com` | Verkkotunnukselle olemassa olevan aliaksen sähköpostiosoite <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Oma tili <i class="fa fa-angle-right"></i>Verkkotunnukset</a>-osiossa. |
| Salasana | `************************` | Alias-kohtainen luotu salasana. |

Jotta IMAP-yhteys voidaan muodostaa, **IMAP-käyttäjän** sähköpostiosoitteen on oltava verkkotunnukselle <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Oma tili <i class="fa fa-angle-right"></i>Verkkotunnukset</a> -osiossa olevan aliaksen sähköpostiosoite – ja **IMAP-salasanan** on oltava aliakselle erikseen luotu salasana.

Katso vaiheittaiset ohjeet kohdasta [Tuetko sähköpostin vastaanottamista IMAP-protokollan kautta?](#do-you-support-receiving-email-with-imap).

### Mitkä ovat POP3-palvelimesi määritysasetukset? {#what-are-your-pop3-server-configuration-settings}

Palvelimemme on `pop3.forwardemail.net` ja sitä valvotaan myös <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">tilasivullamme</a>.

Se tukee sekä IPv4- että IPv6-protokollaa ja on käytettävissä porttien `995` ja `2995` kautta SSL/TLS-salausta varten.

| Protokolla | Isäntänimi | Portit | IPv4 | IPv6 |
| :---------------------: | ----------------------- | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **Suositeltu** | `pop3.forwardemail.net` | `995`, `2995` | :valkoinen_tarkistusmerkki: | :valkoinen_tarkistusmerkki: |

| Kirjaudu sisään | Esimerkki | Kuvaus |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Käyttäjätunnus | `user@example.com` | Verkkotunnukselle olemassa olevan aliaksen sähköpostiosoite <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Oma tili <i class="fa fa-angle-right"></i>Verkkotunnukset</a>-osiossa. |
| Salasana | `************************` | Alias-kohtainen luotu salasana. |

POP3-yhteyden muodostamiseksi **POP3-käyttäjän** sähköpostiosoitteen on oltava aliaksen sähköpostiosoite, joka on olemassa verkkotunnukselle kohdassa <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Oma tili <i class="fa fa-angle-right"></i>Verkkotunnukset</a> – ja **IMAP-salasanan** on oltava aliakselle erikseen luotu salasana.

Katso vaiheittaiset ohjeet kohdasta [Tuetko POP3-palvelua?](#do-you-support-pop3).

### Postfix SMTP -välityspalvelimen määritys {#postfix-smtp-relay-configuration}

Voit määrittää Postfixin välittämään sähköposteja Forward Emailin SMTP-palvelimien kautta. Tämä on hyödyllistä palvelinsovelluksille, joiden on lähetettävä sähköposteja.

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Arvioitu asennusaika:</strong>
<span>Alle 15 minuuttia</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tärkeää:
</strong>
<span>
Tämä edellyttää maksullista liittymää, jossa SMTP-käyttö on käytössä.
</span>
</div>

#### Asennus {#installation}

1. Asenna Postfix palvelimellesi:

```bash
# Ubuntu/Debian
sudo apt update && sudo apt install postfix

# CentOS/RHEL
sudo yum install postfix

# macOS
brew install postfix
```

2. Valitse asennuksen aikana "Internet-sivusto", kun sinulta kysytään määritystyyppiä.

####-määritys {#configuration}

1. Muokkaa Postfixin pääasetustiedostoa:

```bash
sudo nano /etc/postfix/main.cf
```

2. Lisää tai muokkaa näitä asetuksia:

```
# SMTP relay configuration
relayhost = [smtp.forwardemail.net]:587
smtp_use_tls = yes
smtp_sasl_auth_enable = yes
smtp_sasl_password_maps = hash:/etc/postfix/sasl_passwd
smtp_sasl_security_options = noanonymous
smtp_tls_CAfile = /etc/ssl/certs/ca-certificates.crt
```

3. Luo SASL-salasanatiedosto:

```bash
sudo nano /etc/postfix/sasl_passwd
```

4. Lisää sähköpostin edelleenlähetystunnuksesi:

```
[smtp.forwardemail.net]:587 your-alias@yourdomain.com:your-generated-password
```

5. Suojaa ja hajauta salasanatiedosto:

```bash
sudo chmod 600 /etc/postfix/sasl_passwd
sudo postmap /etc/postfix/sasl_passwd
```

6. Käynnistä Postfix uudelleen:

```bash
sudo systemctl restart postfix
```

#### Testataan {#testing}

Testaa kokoonpanoasi lähettämällä testisähköposti:

```bash
echo "Test email body" | mail -s "Test Subject" recipient@example.com
```

## Tietoturva {#security}

### Palvelimen suojauksen edistyneet tekniikat {#advanced-server-hardening-techniques}

> \[!TIP]
> Lue lisää suojausinfrastruktuuristamme osoitteessa [Tietoturvasivumme](/security).

Forward Email käyttää useita palvelimen suojaustekniikoita varmistaakseen infrastruktuurimme ja tietojesi turvallisuuden:

1. **Verkon tietoturva**:
* IP-taulukoiden palomuuri tiukoilla säännöillä
* Fail2ban brute force -suojaukseen
* Säännölliset tietoturvatarkastukset ja penetraatiotestaus
* Vain VPN:llä toimiva järjestelmänvalvojan käyttöoikeus

2. **Järjestelmän suojaus**:
* Minimi pakettien asennus
* Säännölliset tietoturvapäivitykset
* SELinux pakotustilassa
* Root SSH -käyttö estetty
* Vain avaimeen perustuva todennus

3. **Sovellustietoturva**:
* Sisällön tietoturvapolitiikan (CSP) otsikot
* HTTPS:n tiukka tiedonsiirtoturvallisuus (HSTS)
* XSS-suojausotsikot
* Kehysasetukset ja viittaajapolitiikan otsikot
* Säännölliset riippuvuustarkastukset

4. **Tietosuojaus**:
* Täydellinen levyn salaus LUKS:lla
* Turvallinen avaintenhallinta
* Säännölliset varmuuskopiot salauksella
* Tietojen minimointikäytännöt

5. **Seuranta ja reagointi**:
* Reaaliaikainen tunkeutumisen havaitseminen
* Automaattinen tietoturvaskannaus
* Keskitetty lokinpito ja analysointi
* Tapahtumiin reagointimenettelyt

> \[!IMPORTANT]
> Tietoturvakäytäntöjämme päivitetään jatkuvasti uusien uhkien ja haavoittuvuuksien varalta.

> \[!TIP]
> Parhaan mahdollisen turvallisuuden takaamiseksi suosittelemme käyttämään palveluamme OpenPGP:n kautta tapahtuvalla päästä päähän -salauksella.

### Onko sinulla SOC 2- tai ISO 27001 -sertifikaatit? {#do-you-have-soc-2-or-iso-27001-certifications}

> \[!NOTE]
> Sähköpostin edelleenlähetys toimii sertifioitujen alihankkijoiden tarjoaman infrastruktuurin avulla varmistaakseen alan standardien noudattamisen.

Forward Emaililla ei ole suoraan SOC 2 Type II- tai ISO 27001 -sertifikaatteja. Palvelu toimii kuitenkin sertifioitujen alihankkijoiden tarjoaman infrastruktuurin avulla:

* **DigitalOcean**: SOC 2 Type II- ja SOC 3 Type II -sertifioitu (Schellman & Company LLC:n tarkastama), ISO 27001 -sertifioitu useissa datakeskuksissa. Tiedot: <https://www.digitalocean.com/trust/certification-reports>

* **Vultr**: SOC 2+ (HIPAA) -sertifioitu, ISO/IEC-sertifioinnit: 20000-1:2018, 27001:2022, 27017:2015, 27018:2019. Tiedot: <https://www.vultr.com/legal/compliance/>

* **DataPacket**: SOC 2 -yhteensopiva (ota yhteyttä suoraan DataPacketiin sertifioinnin hankkimiseksi), yritystason infrastruktuurin tarjoaja (Denverin toimipiste). Tiedot: <https://www.datapacket.com/datacenters/denver>

Forward Email noudattaa alan parhaita käytäntöjä tietoturvatarkastuksissa ja on säännöllisesti yhteydessä riippumattomiin tietoturvatutkijoihin. Lähde: <https://forwardemail.net/technical-whitepaper.pdf#page=36>

### Käytätkö TLS-salausta sähköpostin edelleenlähetykseen? {#do-you-use-tls-encryption-for-email-forwarding}

Kyllä. Sähköpostin edelleenlähetyspalvelu käyttää tiukasti TLS 1.2+ -salausta kaikissa yhteyksissä (HTTPS, SMTP, IMAP, POP3) ja käyttää MTA-STS:ää parannetun TLS-tuen takaamiseksi. Toteutus sisältää:

* TLS 1.2+ -salauksen valvonta kaikissa sähköpostiyhteyksissä
* ECDHE (Elliptic Curve Diffie-Hellman Ephemeral) -avaintenvaihto täydellisen edelleenlähetyssalaisuuden takaamiseksi
* Nykyaikaiset salausohjelmistot säännöllisillä tietoturvapäivityksillä
* HTTP/2-tuki parannetun suorituskyvyn ja tietoturvan takaamiseksi
* HSTS (HTTP Strict Transport Security) esiasennuksella tärkeimmissä selaimissa
* **MTA-STS (Mail Transfer Agent Strict Transport Security)** tiukan TLS-valvonnan takaamiseksi

Lähde: <https://forwardemail.net/technical-whitepaper.pdf#page=25>

**MTA-STS-toteutus**: Sähköpostin edelleenlähetys toteuttaa tiukan MTA-STS-valvonnan koodikannassa. Kun TLS-virheitä ilmenee ja MTA-STS-salausta valvotaan, järjestelmä palauttaa 421 SMTP-tilakoodia varmistaakseen, että sähköposteja yritetään uudelleen myöhemmin sen sijaan, että ne toimitettaisiin turvattomasti. Toteutuksen tiedot:

* TLS-virheiden tunnistus: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-tls-error.js>
* MTA-STS-valvonta sähköpostin lähetysapuohjelmassa: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/send-email.js>

Kolmannen osapuolen vahvistus: <https://www.hardenize.com/report/forwardemail.net/1750312779> näyttää "Hyvät"-arvosanat kaikille TLS- ja tiedonsiirron suojausmenetelmille.

### Säilytätkö sähköpostin todennusotsikot {#do-you-preserve-email-authentication-headers}

Kyllä. Sähköpostin edelleenlähetys toteuttaa ja säilyttää sähköpostin todennusotsikot kattavasti:

* **SPF (Sender Policy Framework)**: Oikein toteutettu ja säilytetty
* **DKIM (DomainKeys Identified Mail)**: Täysi tuki asianmukaisella avaintenhallinnalla
* **DMARC**: Käytännön valvonta sähköposteille, jotka eivät läpäise SPF- tai DKIM-vahvistusta
* **ARC**: Vaikka sitä ei olekaan erikseen kuvattu, palvelun täydelliset yhteensopivuuspisteet viittaavat kattavaan todennusotsikoiden käsittelyyn

Lähde: <https://forwardemail.net/technical-whitepaper.pdf#page=31>

Validointi: Internet.nl Mail Test antaa 100/100-pistemäärän erityisesti "SPF-, DKIM- ja DMARC-toteutuksille". Hardenize-arviointi vahvistaa SPF- ja DMARC-toteutuksille "hyvät"-arvosanat: <https://www.hardenize.com/report/forwardemail.net/1750312779>

### Säilytätkö alkuperäiset sähköpostiotsikot ja estätkö väärentämisen? {#do-you-preserve-original-email-headers-and-prevent-spoofing}

> \[!TIP]
> Sähköpostin edelleenlähetystoiminto toteuttaa kehittyneen sähköpostihuijausten eston, joka estää sähköpostien väärinkäytön.

Forward Email säilyttää alkuperäiset sähköpostiotsikot ja toteuttaa samalla kattavan huijaussuojauksen MX-koodikannan kautta:

* **Ylätunnisteen säilytys**: Alkuperäiset todennusylätunnisteet säilytetään edelleenlähetyksen aikana.* **Huijaussuoja**: DMARC-käytännön valvonta estää ylätunnisteen väärentämisen hylkäämällä sähköpostit, jotka eivät läpäise SPF- tai DKIM-vahvistusta.
* **Ylätunnisteen lisäyksen esto**: Syötetietojen validointi ja puhdistus striptags-kirjaston avulla.
* **Lisäsuojaus**: Kehittynyt tietojenkalastelutunnistus väärennösten tunnistuksella, henkilöllisyyden estolla ja käyttäjäilmoitusjärjestelmillä.

**MX-toteutuksen tiedot**: Ydinsähköpostin käsittelylogiikkaa hoitaa MX-palvelimen koodikanta, erityisesti:

* Pääasiallinen MX-tietojen käsittelijä: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>
* Sähköpostien mielivaltainen suodatus (huijausesto): <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-arbitrary.js>

`isArbitrary`-apuohjelma toteuttaa kehittyneitä huijausvastaisia sääntöjä, mukaan lukien verkkotunnusten henkilöllisyyden anastamisen, estettyjen lausekkeiden ja erilaisten tietojenkalastelumallien tunnistuksen.

Lähde: <https://forwardemail.net/technical-whitepaper.pdf#page=32>

### Miten suojaudut roskapostilta ja väärinkäytöksiltä {#how-do-you-protect-against-spam-and-abuse}

Forward Email toteuttaa kattavan monikerroksisen suojauksen:

* **Nopeuden rajoittaminen**: Sovelletaan todennusyrityksiin, API-päätepisteisiin ja SMTP-yhteyksiin
* **Resurssien eristäminen**: Käyttäjien välillä suurten käyttäjämäärien vaikutusten estämiseksi
* **DDoS-suojaus**: Monikerroksinen suojaus DataPacketin Shield-järjestelmän ja Cloudflaren avulla
* **Automaattinen skaalaus**: Dynaaminen resurssien säätö kysynnän perusteella
* **Väärinkäytösten estäminen**: Käyttäjäkohtaiset väärinkäytösten estämistarkastukset ja hajautuspohjainen esto haitalliselle sisällölle
* **Sähköpostin todennus**: SPF-, DKIM- ja DMARC-protokollat edistyneellä tietojenkalastelutunnistuksella

Lähteet:

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver> (DDoS-suojauksen tiedot)
* <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/abuse-prevention-by-user-id.js>

### Tallennatko sähköpostisisältöä levylle {#do-you-store-email-content-on-disk}

> \[!IMPORTANT]
> Sähköpostin edelleenlähetys käyttää nollatietoarkkitehtuuria, joka estää sähköpostisisällön kirjoittamisen levylle.

* **Zero-Knowledge Architecture**: Yksittäin salatut SQLite-postilaatikot tarkoittavat, että Forward Email ei voi käyttää sähköpostin sisältöä.
* **Muistissa tapahtuva käsittely**: Sähköpostin käsittely tapahtuu kokonaan muistissa, joten levylle ei tarvitse tallentaa.
* **Ei sisällön lokikirjausta**: "Emme kirjaa tai tallenna sähköpostin sisältöä tai metatietoja levylle."
* **Hiekkalaatikkosalaus**: Salausavaimia ei koskaan tallenneta levylle selkotekstimuodossa.

**MX-koodikannan todiste**: MX-palvelin käsittelee sähköpostit kokonaan muistissa kirjoittamatta sisältöä levylle. Pääasiallinen sähköpostin käsittelyn käsittelijä havainnollistaa tätä muistissa tapahtuvaa lähestymistapaa: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

Lähteet:

* <https://forwardemail.net/technical-whitepaper.pdf#page=10> (Tiivistelmä)
* <https://forwardemail.net/technical-whitepaper.pdf#page=59> (Tietoa ei ole)
* <https://forwardemail.net/technical-whitepaper.pdf#page=21> (Hiekkalaatikkosalaus)

### Voiko sähköpostin sisältö paljastua järjestelmän kaatumisten aikana {#can-email-content-be-exposed-during-system-crashes}

Ei. Forward Email toteuttaa kattavia suojatoimia kaatumiseen liittyvää datan paljastumista vastaan:

* **Ydinvedokset poistettu käytöstä**: Estää muistin paljastumisen kaatumisten aikana
* **Vaihtomuisti poistettu käytöstä**: Täysin poistettu käytöstä, jotta arkaluonteisten tietojen poimiminen vaihtotiedostoista voidaan estää
* **Muistin sisäinen arkkitehtuuri**: Sähköpostin sisältö on vain haihtuvassa muistissa käsittelyn aikana
* **Salausavaimen suojaus**: Avaimia ei koskaan tallenneta levylle selkokielisenä
* **Fyysinen suojaus**: LUKS v2 -salatut levyt estävät fyysisen pääsyn tietoihin
* **USB-tallennustila poistettu käytöstä**: Estää luvattoman tietojen poiminnan

**Järjestelmäongelmien virheiden käsittely**: Sähköpostin edelleenlähetys käyttää apufunktioita `isCodeBug` ja `isTimeoutError` varmistaakseen, että jos tietokannan yhteysongelmia, DNS-verkon/estolistalla olevia ongelmia tai ylävirran yhteysongelmia ilmenee, järjestelmä palauttaa 421 SMTP-tilakoodin varmistaakseen, että sähköposteja yritetään uudelleen myöhemmin katoamisen tai paljastumisen sijaan.

Toteutuksen yksityiskohdat:

* Virheen luokittelu: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js>
* Aikakatkaisuvirheiden käsittely MX-käsittelyssä: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

Lähde: <https://forwardemail.net/technical-whitepaper.pdf#page=15>

### Kenellä on pääsy sähköposti-infrastruktuuriisi {#who-has-access-to-your-email-infrastructure}

Forward Email toteuttaa kattavat käyttöoikeuksien hallinnan 2–3 hengen suunnittelutiimilleen tiukoilla 2FA-vaatimuksilla:

* **Roolipohjainen käyttöoikeuksien hallinta**: Tiimitileille, joilla on resurssipohjaiset käyttöoikeudet
* **Pienimpien oikeuksien periaate**: Sovelletaan kaikissa järjestelmissä
* **Tehtävien eriyttäminen**: Operatiivisten roolien välillä
* **Käyttäjähallinta**: Erilliset käyttöönotto- ja devops-käyttäjät, joilla on erilliset käyttöoikeudet
* **Pääkäyttäjän kirjautuminen poistettu käytöstä**: Pakottaa pääsyn oikein todennettujen tilien kautta
* **Tiukka kaksivaiheinen tunnistautuminen**: Ei tekstiviestipohjaista kaksivaiheista tunnistautumista MiTM-hyökkäysten riskin vuoksi - vain sovelluspohjaiset tai laitteistotunnukset
* **Kattava auditointiloki**: Arkaluonteisten tietojen poistaminen käytöstä
* **Automaattinen poikkeamien tunnistus**: Epätavallisille käyttötapauksille
* **Säännölliset tietoturvatarkastukset**: Käyttölokeille
* **Pahan piian hyökkäysten estäminen**: USB-tallennustila poistettu käytöstä ja muut fyysiset turvatoimenpiteet

Lähteet:

* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (Valtuutusasetukset)
* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (Verkon suojaus)
* <https://forwardemail.net/technical-whitepaper.pdf#page=15> (Paholaisen hyökkäyksen esto)

### Mitä infrastruktuurin tarjoajia käytät {#what-infrastructure-providers-do-you-use}

> \[!IMPORTANT]
> Sähköpostin edelleenlähetys käyttää useita infrastruktuurin alikäsittelijöitä, joilla on kattavat vaatimustenmukaisuussertifikaatit.

Täydelliset tiedot ovat saatavilla GDPR-vaatimustenmukaisuussivullamme: <https://forwardemail.net/gdpr>

**Ensisijaisen infrastruktuurin alihankkijat:**

| Palveluntarjoaja | Tietosuojakehyssertifioitu | GDPR-vaatimustenmukaisuussivu |
| ---------------- | -------------------------------- | ----------------------------------------------- |
| **Pilvimyrsky** | ✅ Kyllä | <https://www.cloudflare.com/trust-hub/gdpr/> |
| **Datapaketti** | ❌ Ei | <https://www.datapacket.com/privacy-policy> |
| **DigitalOcean** | ❌ Ei | <https://www.digitalocean.com/legal/gdpr> |
| **Vultr** | ❌ Ei | <https://www.vultr.com/legal/eea-gdpr-privacy/> |

**Yksityiskohtaiset sertifikaatit:**

**DigitalOcean**

* SOC 2 Type II ja SOC 3 Type II (Schellman & Company LLC:n tarkastama)
* ISO 27001 -sertifioitu useissa datakeskuksissa
* PCI-DSS-yhteensopiva
* CSA STAR Level 1 -sertifioitu
* APEC CBPR PRP -sertifioitu
* Tiedot: <https://www.digitalocean.com/trust/certification-reports>

**Vultr**

* SOC 2+ (HIPAA) -sertifioitu
* PCI Merchant -yhteensopiva
* CSA STAR Level 1 -sertifioitu
* ISO/IEC 20000-1:2018, 27001:2022, 27017:2015, 27018:2019
* Tiedot: <https://www.vultr.com/legal/compliance/>

**Datapaketti**

* SOC 2 -yhteensopiva (ota yhteyttä suoraan DataPacketiin saadaksesi sertifioinnin)
* Yritystason infrastruktuuri (Denverin toimipiste)
* DDoS-suojaus Shield-kyberturvallisuuspinon kautta
* 24/7 tekninen tuki
* Maailmanlaajuinen verkosto 58 datakeskuksessa
* Tiedot: <https://www.datapacket.com/datacenters/denver>

**Maksujen käsittelijät:**

* **Stripe**: Tietosuojakäytäntöjen mukainen sertifioitu - <https://stripe.com/legal/privacy-center>
* **PayPal**: Ei DPF-sertifioitu - <https://www.paypal.com/uk/legalhub/privacy-full>

### Tarjoatteko tietojenkäsittelysopimusta (DPA)? {#do-you-offer-a-data-processing-agreement-dpa}

Kyllä, Forward Email tarjoaa kattavan tietojenkäsittelysopimuksen (DPA), joka voidaan allekirjoittaa yrityssopimuksemme yhteydessä. Kopio DPA:stamme on saatavilla osoitteessa: <https://forwardemail.net/dpa>

**DPA-tiedot:**

* Kattaa GDPR-vaatimustenmukaisuuden ja EU:n ja Yhdysvaltojen/Sveitsin ja Yhdysvaltojen välisen Privacy Shield -kehyksen
* Hyväksytään automaattisesti, kun hyväksyt palveluehtomme
* Erillistä allekirjoitusta ei vaadita vakiomuotoiseen DPA:han
* Mukautetut DPA-järjestelyt saatavilla yrityslisenssin kautta

**GDPR-vaatimustenmukaisuuskehys:** Tietosuojasopimuksessamme on yksityiskohtaisesti kuvattu GDPR:n sekä kansainvälisten tiedonsiirtovaatimusten noudattaminen. Täydelliset tiedot ovat saatavilla osoitteessa: <https://forwardemail.net/gdpr>

Yritysasiakkaat, jotka tarvitsevat mukautettuja DPA-ehtoja tai erityisiä sopimusjärjestelyjä, voivat ratkaista nämä ongelmat **Yrityslisenssi (250 dollaria/kk)** -ohjelmamme kautta.

### Miten käsittelette tietomurtoilmoituksia {#how-do-you-handle-data-breach-notifications}

> \[!NOTE]
> Forward Emailin nollatietoarkkitehtuuri rajoittaa merkittävästi tietomurtojen vaikutusta.

* **Rajoitettu tietomäärä**: Salattua sähköpostisisältöä ei voi käyttää nollatietoarkkitehtuurin vuoksi.
* **Minimaalinen tiedonkeruu**: Vain tilaajien perustiedot ja rajoitetut IP-lokit turvallisuussyistä.
* **Alihankkijoiden viitekehykset**: DigitalOcean ja Vultr noudattavat GDPR-yhteensopivia tietoturvaloukkauksiin reagointimenettelyjä.

**GDPR-edustajan tiedot:**
Forward Email on nimittänyt GDPR-edustajia artiklan 27 mukaisesti:

**EU-edustaja:**
Osano International Compliance Services Limited
HUOM: LFHC
3 Dublin Landings, North Wall Quay
Dublin 1, D01C4E0

**Edustaja Isossa-Britanniassa:**
Osano UK Compliance LTD
HUOM: LFHC
42-46 Fountain Street, Belfast
Antrim, BT1-5EF

Yritysasiakkaiden, jotka tarvitsevat erityisiä tietomurtoilmoituspalvelusopimuksia, tulisi käsitellä näistä osana **yrityslisenssi**sopimusta.

Lähteet:

* <https://forwardemail.net/technical-whitepaper.pdf#page=59>
* <https://forwardemail.net/gdpr>

### Tarjoatteko testiympäristöä? {#do-you-offer-a-test-environment}

Forward Emailin tekninen dokumentaatio ei kuvaa nimenomaisesti erillistä hiekkalaatikkotilaa. Mahdollisia testausmenetelmiä ovat kuitenkin:

* **Itseisännöintivaihtoehto**: Kattavat itseisännöintiominaisuudet testiympäristöjen luomiseen
* **API-rajapinta**: Mahdollisuus konfiguraatioiden ohjelmalliseen testaukseen
* **Avoin lähdekoodi**: 100 % avoimen lähdekoodin koodi antaa asiakkaille mahdollisuuden tutkia edelleenlähetyslogiikkaa
* **Useita verkkotunnuksia**: Tuki useille verkkotunnuksille voi mahdollistaa testiverkkotunnusten luomisen

Yritysasiakkaiden, jotka tarvitsevat virallisia hiekkalaatikko-ominaisuuksia, tulisi keskustella tästä osana **yrityslisenssi**-sopimusta.

Lähde: <https://github.com/forwardemail/forwardemail.net> (Kehitysympäristön tiedot)

### Tarjoatteko valvonta- ja hälytystyökaluja? {#do-you-provide-monitoring-and-alerting-tools}

Sähköpostin edelleenlähetys tarjoaa reaaliaikaista seurantaa tietyin rajoituksin:

**Saatavilla:**

* **Reaaliaikainen toimituksen seuranta**: Julkisesti näkyvät suorituskykymittarit tärkeimmille sähköpostipalveluntarjoajille
* **Automaattinen hälytys**: Suunnittelutiimi saa ilmoituksen, kun toimitusaika ylittää 10 sekuntia
* **Läpinäkyvä seuranta**: 100 % avoimen lähdekoodin valvontajärjestelmät
* **Infrastruktuurin seuranta**: Automaattinen poikkeamien tunnistus ja kattava auditointiloki

Rajoitukset:

* Asiakkaille suunnattuja webhookkeja tai API-pohjaisia toimitustilailmoituksia ei ole dokumentoitu erikseen.

Yritysasiakkaille, jotka tarvitsevat yksityiskohtaisia toimitustilan webhookeja tai mukautettuja valvontaintegraatioita, nämä ominaisuudet voivat olla saatavilla **yrityslisenssi**-sopimusten kautta.

Lähteet:

* <https://forwardemail.net> (Reaaliaikaisen valvonnan näyttö)
* <https://github.com/forwardemail/forwardemail.net> (Valvonnan toteutus)

### Miten varmistat korkean käytettävyyden {#how-do-you-ensure-high-availability}

> \[!IMPORTANT]
> Sähköpostin edelleenlähetys toteuttaa kattavan redundanssin useiden infrastruktuuripalveluntarjoajien välillä.

* **Hajautettu infrastruktuuri**: Useita palveluntarjoajia (DigitalOcean, Vultr, DataPacket) eri maantieteellisillä alueilla
* **Maantieteellinen kuormituksen tasapainotus**: Cloudflare-pohjainen maantieteellisesti paikannettu kuormituksen tasapainotus automaattisella vikasietoisuudella
* **Automaattinen skaalaus**: Dynaaminen resurssien säätö kysynnän perusteella
* **Monikerroksinen DDoS-suojaus**: DataPacketin Shield-järjestelmän ja Cloudflaren kautta
* **Palvelinten redundanssi**: Useita palvelimia aluetta kohden automaattisella vikasietoisuudella
* **Tietokannan replikointi**: Reaaliaikainen tietojen synkronointi useiden sijaintien välillä
* **Seuranta ja hälytykset**: 24/7-valvonta automaattisella tapahtumiin reagoinnilla

**Käyttöaikatakuu**: Palvelun saatavuus yli 99,9 % ja läpinäkyvä valvonta saatavilla osoitteessa <https://forwardemail.net>

Lähteet:

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver>

### Noudatatko National Defense Authorization Actin (NDAA) pykälän 889 määräyksiä? {#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa}

> \[!IMPORTANT]
> Sähköpostin edelleenlähetys on täysin säännön 889 mukainen infrastruktuurikumppaneiden huolellisen valinnan ansiosta.

Kyllä, sähköpostin edelleenlähetys on **pykälän 889 mukainen**. Yhdysvaltain puolustusministeriön lain (NDAA) pykälä 889 kieltää valtion virastoja käyttämästä tiettyjen yritysten (Huawei, ZTE, Hikvision, Dahua ja Hytera) televiestintä- ja videovalvontalaitteita käyttäviä tahoja tai tekemästä sopimuksia niiden kanssa.

**Miten sähköpostin edelleenlähetys täyttää pykälän 889 vaatimukset:**

Forward Email luottaa yksinomaan kahteen keskeiseen infrastruktuuritoimittajaan, joista kumpikaan ei käytä pykälän 889 mukaisesti kiellettyjä laitteita:

1. **Cloudflare**: Ensisijainen kumppanimme verkkopalveluissa ja sähköpostin suojauksessa
2. **DataPacket**: Ensisijainen palvelininfrastruktuurin tarjoajamme (käyttäen yksinomaan Arista Networksin ja Ciscon laitteita)
3. **Varauskopiointipalvelut**: Digital Oceanin ja Vultrin varmuuskopiointipalvelujen tarjoajista on lisäksi kirjallisesti vahvistettu, että ne ovat Section 889 -yhteensopivia.

**Cloudflaren sitoumus**: Cloudflare toteaa nimenomaisesti kolmansien osapuolten käytännesäännöissään, ettei se käytä televiestintälaitteita, videovalvontatuotteita tai -palveluita miltään 889 §:n kieltämiltä tahoilta.

**Viranomaisten käyttötapaus**: Yhteensopivuutemme pykälän 889 mukaisesti varmistettiin, kun **Yhdysvaltain laivastoakatemia** valitsi Forward Email -palvelun suojattuun sähköpostin edelleenlähetystarpeeseensa, mikä edellytti liittovaltion vaatimustenmukaisuusstandardiemme dokumentointia.

Saat täydelliset tiedot viranomaisten vaatimustenmukaisuuskehyksestämme, mukaan lukien laajemmat liittovaltion määräykset, lukemalla kattavan tapaustutkimuksemme: [Liittovaltion hallituksen sähköpostipalvelu pykälän 889 mukainen](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)

## Järjestelmä ja tekniset tiedot {#system-and-technical-details}

### Säilytätkö sähköposteja ja niiden sisältöä {#do-you-store-emails-and-their-contents}

Ei, emme kirjoita levylle emmekä tallenna lokeja – [virheitä lukuun ottamatta](#do-you-store-error-logs)- ja [lähtevä SMTP](#do-you-support-sending-email-with-smtp)-elementtien avulla (katso [Tietosuojakäytäntö](/privacy)).

Kaikki tehdään muistissa ja [lähdekoodimme on GitHubissa](https://github.com/forwardemail)-kohteessa.

### Miten sähköpostin edelleenlähetysjärjestelmäsi toimii {#how-does-your-email-forwarding-system-work}

Sähköposti perustuu [SMTP-protokolla](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol)-protokollaan. Tämä protokolla koostuu palvelimelle lähetettävistä komennoista (yleisimmin portissa 25). Aluksi muodostetaan yhteys, jonka jälkeen lähettäjä ilmoittaa sähköpostin lähettäjän ("MAIL FROM"), minkä jälkeen viestin vastaanottajan ("RCPT TO") ja lopuksi itse sähköpostin otsikot ja rungon ("DATA"). Sähköpostin edelleenlähetysjärjestelmämme kulku on kuvattu alla kunkin SMTP-protokollakomennon osalta:

* Ensimmäinen yhteys (ei komennon nimeä, esim. `telnet example.com 25`) - Tämä on ensimmäinen yhteys. Tarkistamme lähettäjät, jotka eivät ole [sallittujen lista](#do-you-have-an-allowlist)-luettelossamme, [kieltolista](#do-you-have-a-denylist)-luetteloamme vasten. Lopuksi, jos lähettäjää ei ole sallittujen luettelossamme, tarkistamme, onko se ollut [harmaalle listalle](#do-you-have-a-greylist)-luettelossa.

* `HELO` - Tämä osoittaa tervehdyksen, joka tunnistaa lähettäjän FQDN-nimen, IP-osoitteen tai sähköpostin käsittelijän nimen. Tämä arvo voidaan väärentää, joten emme luota tähän tietoon, vaan käytämme yhteyden IP-osoitteen käänteistä isäntänimen hakua.

* `MAIL FROM` - Tämä osoittaa sähköpostin lähettäjän osoitteen kirjekuoressa. Jos arvo annetaan, sen on oltava kelvollinen RFC 5322 -sähköpostiosoite. Tyhjät arvot ovat sallittuja. Me käytämme [tarkista takaisinhajonta](#how-do-you-protect-against-backscatter)-arvoa tässä ja tarkistamme myös MAIL FROM -arvon [kieltolista](#do-you-have-a-denylist)-arvoa vasten. Lopuksi tarkistamme lähettäjät, jotka eivät ole sallittujen listalla, nopeusrajoitusten varalta (lisätietoja on [Nopeuden rajoittaminen](#do-you-have-rate-limiting)- ja [sallittujen lista](#do-you-have-an-allowlist)-osioissa).

* `RCPT TO` - Tämä osoittaa sähköpostin vastaanottajan/vastaanottajat. Näiden on oltava kelvollisia RFC 5322 -sähköpostiosoitteita. Sallimme enintään 50 kirjekuorivastaanottajaa viestiä kohden (tämä eroaa sähköpostin "Vastaanottaja"-otsikosta). Tarkistamme myös, että [Lähettäjän uudelleenkirjoitusjärjestelmä](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme) ("SRS") -osoite on kelvollinen suojataksemme sitä SRS-verkkotunnusnimemme väärentämiseltä.

* `DATA` - Tämä on palvelumme ydinosa, joka käsittelee sähköpostin. Katso lisätietoja alla olevasta osiosta [Miten sähköpostia käsitellään edelleenlähetystä varten](#how-do-you-process-an-email-for-forwarding).

### Miten sähköpostia käsitellään edelleenlähetystä varten {#how-do-you-process-an-email-for-forwarding}

Tässä osiossa kuvataan yllä olevassa osiossa `DATA` käytettyyn SMTP-protokollakomentoon `DATA` liittyvä prosessimme – se kertoo, miten käsittelemme sähköpostin otsikot, leipätekstin ja suojauksen, määritämme, minne viesti on toimitettava, ja miten käsittelemme yhteyksiä.

1. Jos viesti ylittää 50 Mt:n enimmäiskoon, se hylätään virhekoodilla 552.

2. Jos viestissä ei ollut "Lähettäjä"-otsikkoa tai jos jokin "Lähettäjä"-otsikon arvoista ei ollut kelvollinen RFC 5322 -sähköpostiosoite, se hylätään virhekoodilla 550.

3. Jos viestissä oli yli 25 "Received"-otsikkoa, sen katsottiin juuttuneen uudelleenohjaussilmukkaan ja se hylättiin virhekoodilla 550.

4. Sähköpostin sormenjäljen avulla (katso osio [Sormenjälkien ottaminen](#how-do-you-determine-an-email-fingerprint)) tarkistamme, onko viestiä yritetty lähettää uudelleen yli 5 päivää (mikä vastaa [oletusarvoinen postfix-toiminto](http://www.postfix.org/postconf.5.html#maximal_queue_lifetime):tä). Jos näin on, viesti hylätään virhekoodilla 550.

5. Tallennamme sähköpostin skannauksen tulokset muistiin käyttämällä [Roskapostiskanneri](https://spamscanner.net)-metodia.

6. Jos roskapostiskanneri antoi mielivaltaisia tuloksia, ne hylättiin virhekoodilla 554. Kirjoitushetkellä mielivaltaisiin tuloksiin sisältyy vain GTUBE-testi. Lisätietoja on kohdassa <https://spamassassin.apache.org/gtube/>.

7. Lisäämme viestiin seuraavat otsikot virheenkorjausta ja väärinkäytösten estämiseksi:

* `Received` - lisäämme tämän standardin mukaisen Received-otsikon, jossa on alkuperäisen IP-osoitteen ja isännän, lähetystyypin, TLS-yhteystiedot, päivämäärä/aika ja vastaanottaja.
* `X-Original-To` - viestin alkuperäinen vastaanottaja:
* Tämä on hyödyllinen sähköpostin alkuperäisen toimituksen vastaanottajan määrittämiseksi ("Received"-otsikon lisäksi).
* Tämä lisätään vastaanottajakohtaisesti IMAP- ja/tai peitetyn edelleenlähetyksen yhteydessä (yksityisyyden suojaamiseksi).
* `X-Forward-Email-Website` - sisältää linkin verkkosivustollemme <https://forwardemail.net>
* `X-Forward-Email-Version` - koodikantaamme kuuluvan `package.json`:n nykyinen [SemVer](https://semver.org/)-versio.
* `X-Forward-Email-Session-ID` - istuntotunnusarvo, jota käytetään virheenkorjaustarkoituksiin (koskee vain muita kuin tuotantoympäristöjä).
* `X-Forward-Email-Sender` - pilkuilla erotettu luettelo, joka sisältää alkuperäisen kirjekuoren MAIL FROM -osoitteen (jos se ei ollut tyhjä), käänteisen PTR-asiakkaan FQDN-nimen (jos se on olemassa) ja lähettäjän IP-osoitteen.
* `X-Forward-Email-ID` - tämä koskee vain lähtevää SMTP-postia ja korreloi Oma tili → Sähköpostit -osioon tallennetun sähköpostitunnuksen kanssa.
* `X-Original-To`0 - arvolla `X-Original-To`1.
* `X-Original-To`2 - arvolla `X-Original-To`3.
* `X-Original-To`4 - arvolla `X-Original-To`5.

8. Tarkistamme sitten viestin [DKIM](https://en.wikipedia.org/wiki/DomainKeys_Identified_Mail):n, [SPF](https://en.wikipedia.org/wiki/Sender_Policy_Framework):n, [ARC](https://en.wikipedia.org/wiki/Authenticated_Received_Chain):n ja [DMARC](https://en.wikipedia.org/wiki/DMARC):n osalta.

* Jos viesti epäonnistui DMARC-tarkastuksessa ja verkkotunnuksella oli hylkäyskäytäntö (esim. `p=reject` [oli DMARC-käytännössä](https://wikipedia.org/wiki/DMARC)), se hylätään virhekoodilla 550. Tyypillisesti verkkotunnuksen DMARC-käytäntö löytyy `_dmarc`-aliverkkotunnuksen <strong class="notranslate">TXT</strong>-tietueesta (esim. `dig _dmarc.example.com txt`).
* Jos viesti epäonnistui SPF-tarkastuksessa ja verkkotunnuksella oli vaikeasti hylätty käytäntö (esim. `-all` oli SPF-käytännössä `~all`:n sijaan tai ei käytäntöä ollenkaan), se hylätään virhekoodilla 550. Tyypillisesti verkkotunnuksen SPF-käytäntö löytyy juuriverkkotunnuksen <strong class="notranslate">TXT</strong>-tietueesta (esim. `dig example.com txt`). Katso tästä osiosta lisätietoja [sähköpostin lähettäminen kuten Gmailissa](#can-i-send-mail-as-in-gmail-with-this):stä SPF:n osalta.

9. Käsittelemme nyt viestin vastaanottajat, jotka on kerätty `RCPT TO`-komennolla yllä olevassa [Miten sähköpostin edelleenlähetysjärjestelmäsi toimii](#how-does-your-email-forwarding-system-work)-osiossa. Suoritamme kullekin vastaanottajalle seuraavat toiminnot:

* Haemme verkkotunnuksen <strong class="notranslate">TXT</strong>-tietueita (`@`-symbolin jälkeinen osa, esim. `example.com`, jos sähköpostiosoite oli `test@example.com`). Jos verkkotunnus on esimerkiksi `example.com`, teemme DNS-haun, kuten `dig example.com txt`.
* Jäsennämme kaikki <strong class="notranslate">TXT</strong>-tietueet, jotka alkavat joko `forward-email=`:llä (ilmaiset paketit) tai `forward-email-site-verification=`:lla (maksulliset paketit). Huomaa, että jäsennämme molemmat voidaksemme käsitellä sähköposteja käyttäjän päivittäessä tai alentaessa paketteja.
* Käymme näistä jäsennetyistä <strong class="notranslate">TXT</strong>-tietueista läpi selvittääksemme edelleenlähetysmääritykset (kuten yllä olevassa [Miten pääsen alkuun ja määritän sähköpostin edelleenlähetyksen](#how-do-i-get-started-and-set-up-email-forwarding)-osiossa on kuvattu). Huomaa, että tuemme vain yhtä `forward-email-site-verification=`-arvoa, ja jos niitä annetaan useampi kuin yksi, tapahtuu 550-virhe ja lähettäjä saa palautuksen tälle vastaanottajalle.
* Käymme rekursiivisesti läpi poimitun edelleenlähetyskokoonpanon määrittääksemme globaalin edelleenlähetyksen, säännölliseen lausekkeeseen perustuvan edelleenlähetyksen ja kaikki muut tuetut edelleenlähetyskokoonpanot – joita nyt kutsutaan "edelleenlähetysosoitteiksi".
* Jokaiselle edelleenlähetysosoitteelle tuemme yhtä rekursiivista hakua (joka aloittaa tämän toimintosarjan uudelleen annetusta osoitteesta). Jos rekursiivinen osuma löytyy, päätulos poistetaan edelleenlähetysosoitteista ja aliosoitteet lisätään.
* Edelleenlähetysosoitteet jäsennetään yksilöllisyyden varalta (koska emme halua lähettää kaksoiskappaleita yhteen osoitteeseen tai luoda lisäksi tarpeettomia SMTP-asiakasyhteyksiä).
* Jokaiselle edelleenlähetysosoitteelle etsimme sen verkkotunnusta API-päätepisteestämme `/v1/max-forwarded-addresses` (jotta voimme määrittää, kuinka moneen osoitteeseen verkkotunnus saa lähettää sähköpostia edelleen aliasta kohden, esim. 10 oletusarvoisesti – katso osio `example.com`0). Jos tämä raja ylittyy, tapahtuu virhe 550 ja lähettäjä saa palautuksen tästä vastaanottajasta.
* Etsimme alkuperäisen vastaanottajan asetuksia API-päätepisteestämme `example.com`1, joka tukee hakua maksaville käyttäjille (ja varatoimintoa ilmaisille käyttäjille). Tämä palauttaa määritysobjektin lisäasetuksista `example.com`2:lle (numero, esim. `example.com`3), `example.com`4:lle (totuusarvo), `example.com`5:lle (totuusarvo), `example.com`6:lle (totuusarvo) ja `example.com`7:lle (totuusarvo). * Näiden asetusten perusteella tarkistamme roskapostiskannerin tulokset, ja jos virheitä ilmenee, viesti hylätään virhekoodilla 554 (esim. jos `example.com`8 on käytössä, tarkistamme roskapostiskannerin tulokset virusten varalta). Huomaa, että kaikki ilmaisen paketin käyttäjät otetaan mukaan tarkistuksiin aikuisille suunnatun sisällön, tietojenkalastelun, suoritettavien tiedostojen ja virusten varalta. Oletusarvoisesti kaikki maksullisen paketin käyttäjät otetaan mukaan, mutta tätä määritystä voidaan muuttaa verkkotunnuksen Asetukset-sivulla Sähköpostin edelleenlähetys -hallintapaneelissa).

10. Suoritamme sitten seuraavat toimenpiteet kullekin käsitellylle vastaanottajan edelleenlähetysosoitteelle:

* Osoitetta verrataan [kieltolista](#do-you-have-a-denylist)-osoitteeseemme, ja jos se oli listalla, ilmenee 421-virhekoodi (joka kehottaa lähettäjää yrittämään uudelleen myöhemmin).
* Jos osoite on webhook, asetamme totuusarvon tulevia toimintoja varten (katso alla – ryhmittelemme samankaltaiset webhookit yhden POST-pyynnön tekemiseksi useiden toimitusta varten).
* Jos osoite on sähköpostiosoite, jäsennämme isännän tulevia toimintoja varten (katso alla – ryhmittelemme samankaltaiset isännät yhden yhteyden tekemiseksi useiden yksittäisten toimitusta varten).

11. Jos vastaanottajia ei ole eikä palautuksia ole, vastaamme virheellä 550 "Virheelliset vastaanottajat".

12. Jos vastaanottajia on, käymme heidät läpi (ryhmiteltyinä saman isännän mukaan) ja toimitamme sähköpostit. Katso lisätietoja alla olevasta osiosta [Miten käsittelet sähköpostin toimitusongelmia](#how-do-you-handle-email-delivery-issues).

* Jos sähköpostien lähettämisessä tapahtuu virheitä, tallennamme ne muistiin myöhempää käsittelyä varten.
* Käytämme sähköpostien lähettämisestä pienintä virhekoodia (jos sellaista on) vastauskoodina `DATA`-komennolle. Tämä tarkoittaa, että alkuperäinen lähettäjä yrittää yleensä uudelleen lähettää toimittamatta jääneitä sähköposteja, mutta jo toimitettuja sähköposteja ei lähetetä uudelleen seuraavan kerran, kun viesti lähetetään (koska käytämme [Sormenjälkien ottaminen](#how-do-you-determine-an-email-fingerprint)-komentoa).
* Jos virheitä ei ilmennyt, lähetämme 250 onnistuneen SMTP-vastauksen tilakoodin.
* Palautukseksi määritellään mikä tahansa toimitusyritys, jonka tuloksena on tilakoodi, joka on >= 500 (pysyvät virheet).

13. Jos palautuksia ei ole tapahtunut (pysyviä virheitä), palautamme SMTP-vastauksen tilakoodina pienimmän virhekoodin ei-pysyvien virheiden joukosta (tai 250 onnistunut-tilakoodin, jos virheitä ei ole ollut).

14. Jos viestit palautuvat, lähetämme palautussähköpostit taustalla palautettuamme lähettäjälle pienimmän kaikista virhekoodeista. Jos pienin virhekoodi on kuitenkin >= 500, emme lähetä palautussähköposteja. Tämä johtuu siitä, että jos lähettäisimme, lähettäjät saisivat kaksinkertaisen palautussähköpostin (esim. yhden lähtevältä MTA:lta, kuten Gmaililta, ja toisen meiltä). Lisätietoja on alla olevassa [Miten suojaudut takaisinsironnalta](#how-do-you-protect-against-backscatter)-osiossa.

### Miten käsittelette sähköpostin toimitusongelmia {#how-do-you-handle-email-delivery-issues}

Huomaa, että teemme sähköposteihin "Friendly-From"-uudelleenkirjoituksen vain jos ja vain jos lähettäjän DMARC-käytäntö ei läpäissyt lähetystä JA DKIM-allekirjoituksia ei ollut linjassa "From"-otsikon kanssa. Tämä tarkoittaa, että muutamme viestin "From"-otsikkoa, asetamme "X-Original-From":n ja asetamme myös "Reply-To":n, jos sitä ei ole jo asetettu. Sinetöimme myös viestin ARC-sinetin uudelleen näiden otsikoiden muuttamisen jälkeen.

Käytämme myös virheilmoitusten älykästä jäsentämistä pinon jokaisella tasolla – koodissamme DNS-pyynnöissä, Node.js:n sisäisissä osioissa, HTTP-pyynnöissä (esim. 408, 413 ja 429 on yhdistetty SMTP-vastauskoodiin 421, jos vastaanottaja on webhook) ja sähköpostipalvelimen vastauksissa (esim. vastaukset, joissa on "defer" tai "slowdown", yritetään uudelleen 421-virheinä).

Logiikkamme on mallisuojattu ja se yrittää uudelleen myös SSL/TLS-virheiden, yhteysongelmien ja muiden ongelmien varalta. Mallisuojauksen tavoitteena on maksimoida toimitettavuus kaikille vastaanottajille edelleenlähetyskokoonpanossa.

Jos vastaanottaja on webhook, sallimme pyynnön valmistumiselle 60 sekunnin aikakatkaisun, jonka aikana pyyntöä voidaan yrittää uudelleen enintään kolme kertaa (eli yhteensä neljä pyyntöä ennen epäonnistumista). Huomaa, että jäsennämme virhekoodit 408, 413 ja 429 oikein ja yhdistämme ne SMTP-vastauskoodiin 421.

Muussa tapauksessa, jos vastaanottaja on sähköpostiosoite, yritämme lähettää sähköpostin käyttäen opportunistista TLS-salausta (yritämme käyttää STARTTLS:ää, jos se on käytettävissä vastaanottajan sähköpostipalvelimella). Jos sähköpostin lähettämisen aikana tapahtuu SSL/TLS-virhe, yritämme lähettää sähköpostin ilman TLS:ää (ilman STARTTLS:ää).

Jos DNS- tai yhteysvirheitä ilmenee, palautamme `DATA`-komennolle SMTP-vastauskoodin 421. Muussa tapauksessa, jos virheitä on >= 500, lähetetään palautusviestit.

Jos havaitsemme, että sähköpostipalvelimella, jolle yritämme toimittaa viestiä, on yksi tai useampi sähköpostinvaihdon IP-osoitteistamme estetty (esim. millä tahansa roskapostittajien estämiseen käytetyllä tekniikalla), lähetämme lähettäjälle SMTP-vastauskoodin 421, jotta hän voi yrittää lähettää viestinsä uudelleen myöhemmin (ja meille ilmoitetaan ongelmasta, jotta voimme toivottavasti ratkaista sen ennen seuraavaa yritystä).

### Miten käsittelet IP-osoitteiden estymisen? {#how-do-you-handle-your-ip-addresses-becoming-blocked}

Valvomme rutiininomaisesti kaikkia tärkeimpiä DNS-estolistoja, ja jos jokin sähköpostinvaihdon ("MX") IP-osoitteistamme on listattu tärkeällä estolistalla, poistamme sen asiaankuuluvasta DNS A -tietueen round robin -kyselystä, jos mahdollista, kunnes ongelma on ratkaistu.

Tämän kirjoitushetkellä meidät on myös listattu useilla DNS-sallittujen listoilla, ja otamme estolistojen valvonnan vakavasti. Jos huomaat ongelmia ennen kuin meillä on aikaa ratkaista ne, ilmoita niistä meille kirjallisesti osoitteeseen <support@forwardemail.net>.

IP-osoitteemme ovat julkisesti saatavilla, [katso lisätietoja alla olevasta osiosta](#what-are-your-servers-ip-addresses).

### Mitä ovat postin päällikön osoitteet {#what-are-postmaster-addresses}

Estääksemme harhaanjohtavat palautukset ja lomavastausviestien lähettämisen valvomattomiin tai olemattomiin postilaatikoihin, ylläpidämme luetteloa sähköpostipalvelua muistuttavista käyttäjätunnuksista:

* `automailer`
* `autoresponder`
* `bounce`
* `bounce-notification`
* `bounce-notifications`
* `bounces`
* `hostmaster`
* `listserv`
* `localhost`
* `mail-daemon`
* `mail.daemon`
* `maildaemon`
* `mailer-daemon`
* `mailer.daemon`
* `mailerdaemon`
* `majordomo`
* `postmaster`
* [ja kaikkiin osoitteisiin, joihin ei vastata](#what-are-no-reply-addresses)

Katso lisätietoja siitä, miten tällaisia listoja käytetään tehokkaiden sähköpostijärjestelmien luomiseen kohdasta [RFC 5320, kohta 4.6](https://datatracker.ietf.org/doc/html/rfc5230#section-4.6).

### Mitä ovat vastausta vaatimattomat osoitteet {#what-are-no-reply-addresses}

Sähköpostiosoitteet, jotka ovat jonkin seuraavista (kirjainkokoa ei erotella), katsotaan vastausta pyytämättömiksi osoitteiksi:

* `do-not-reply`
* `do-not-respond`
* `do.not.reply`
* `donotreply`
* `donotrespond`
* `dont-reply`
* `naoresponda`
* `no-replies`
* `no-reply`
* `no-replys`
* `no.replies`
* `no.reply`
* `no.replys`
* `no_reply`
* `nobody`
* `noreplies`
* `noreply`
* `noreplys`

Tätä listaa ylläpidetään [avoimen lähdekoodin projektina GitHubissa](https://github.com/forwardemail/reserved-email-addresses-list):na.

### Mitkä ovat palvelimesi IP-osoitteet {#what-are-your-servers-ip-addresses}

Julkaisemme IP-osoitteemme osoitteessa <https://forwardemail.net/ips>.

### Onko sinulla sallittujen lista {#do-you-have-an-allowlist}

Kyllä, meillä on [verkkotunnuspäätteiden luettelo](#what-domain-name-extensions-are-allowlisted-by-default)-luettelo, joka on oletuksena sallittujen luettelossa, ja dynaaminen, välimuistissa oleva ja päivittyvä sallittujen luettelo, joka perustuu [tiukat kriteerit](#what-is-your-allowlist-criteria)-luetteloon.

Kaikki maksullisten sopimusten asiakkaiden sähköpostiosoitteet, verkkotunnukset ja vastaanottajat lisätään automaattisesti sallittujen listallemme.

### Mitkä verkkotunnuspäätteet on oletuksena sallittujen luettelossa {#what-domain-name-extensions-are-allowlisted-by-default}

Seuraavia verkkotunnuspäätteitä pidetään oletuksena sallittuina (riippumatta siitä, ovatko ne sateenvarjo-suosioluettelossa vai eivät):

<ul class="list-inline">
<li class="list-inline-item"><code class="notranslate">edu</code></li>
<li class="list-inline-item"><code class="notranslate">gov</code></li>
<li class="list-inline-item"><code class="notranslate">mil</code></li>
<li class="list-inline-item"><code class="notranslate">int</code></li>
<li class="list-inline-item"><code class="notranslate">arpa</code></li>
<li class="list-inline-item"><code class="notranslate">dni.us</code></li>
<li class="list-inline-item"><code class="notranslate">fed.us</code></li>
<li class="list-inline-item"><code class="notranslate">isa.us</code></li>
<li class="list-inline-item"><code class="notranslate">kids.us</code></li>
<li class="list-inline-item"><code class="notranslate">nsn.us</code></li>
<li class="list-inline-item"><code class="notranslate">ak.us</code></li>
<li class="list-inline-item"><code class="notranslate">al.us</code></li>
<li class="list-inline-item"><code class="notranslate">ar.us</code></li>
<li class="list-inline-item"><code class="notranslate">as.us</code></li>
<li class="list-inline-item"><code class="notranslate">az.us</code></li>
<li class="list-inline-item"><code class="notranslate">ca.us</code></li>
<li class="list-inline-item"><code class="notranslate">co.us</code></li>
<li class="list-inline-item"><code class="notranslate">ct.us</code></li>
<li class="list-inline-item"><code class="notranslate">dc.us</code></li>
<li class="list-inline-item"><code class="notranslate">de.us</code></li>
<li class="list-inline-item"><code class="notranslate">fl.us</code></li>
<li class="list-inline-item"><code class="notranslate">ga.us</code></li>
<li class="list-inline-item"><code class="notranslate">gu.us</code></li>
<li class="list-inline-item"><code class="notranslate">hi.us</code></li>
<li class="list-inline-item"><code class="notranslate">ia.us</code></li>
<li class="list-inline-item"><code class="notranslate">id.us</code></li>
<li class="list-inline-item"><code class="notranslate">il.us</code></li>
<li class="list-inline-item"><code class="notranslate">in.us</code></li>
<li class="list-inline-item"><code class="notranslate">ks.us</code></li>
<li class="list-inline-item"><code class="notranslate">ky.us</code></li>
<li class="list-inline-item"><code class="notranslate">la.us</code></li>
<li class="list-inline-item"><code class="notranslate">ma.us</code></li>
<li class="list-inline-item"><code class="notranslate">md.us</code></li>
<li class="list-inline-item"><code class="notranslate">me.us</code></li>
<li class="list-inline-item"><code class="notranslate">mi.us</code></li>
<li class="list-inline-item"><code class="notranslate">mn.us</code></li>
<li class="list-inline-item"><code class="notranslate">mo.us</code></li>
<li class="list-inline-item"><code class="notranslate">ms.us</code></li>
<li class="list-inline-item"><code class="notranslate">mt.us</code></li>
<li class="list-inline-item"><code class="notranslate">nc.us</code></li>
<li class="list-inline-item"><code class="notranslate">nd.us</code></li>
<li class="list-inline-item"><code class="notranslate">ne.us</code></li>
<li class="list-inline-item"><code class="notranslate">nh.us</code></li>
<li class="list-inline-item"><code class="notranslate">nj.us</code></li>
<li class="list-inline-item"><code class="notranslate">nm.us</code></li>
<li class="list-inline-item"><code class="notranslate">nv.us</code></li>
<li class="list-inline-item"><code class="notranslate">ny.us</code></li>
<li class="list-inline-item"><code class="notranslate">oh.us</code></li>
<li class="list-inline-item"><code class="notranslate">ok.us</code></li>
<li class="list-inline-item"><code class="notranslate">or.us</code></li>
<li class="list-inline-item"><code class="notranslate">pa.us</code></li>
<li class="list-inline-item"><code class="notranslate">pr.us</code></li>
<li class="list-inline-item"><code class="notranslate">ri.us</code></li>
<li class="list-inline-item"><code class="notranslate">sc.us</code></li>
<li class="list-inline-item"><code class="notranslate">sd.us</code></li>
<li class="list-inline-item"><code class="notranslate">tn.us</code></li>
<li class="list-inline-item"><code class="notranslate">tx.us</code></li>
<li class="list-inline-item"><code class="notranslate">ut.us</code></li>
<li class="list-inline-item"><code class="notranslate">va.us</code></li>
<li class="list-inline-item"><code class="notranslate">vi.us</code></li>
<li class="list-inline-item"><code class="notranslate">vt.us</code></li>
<li class="list-inline-item"><code class="notranslate">wa.us</code></li>
<li class="list-inline-item"><code class="notranslate">wi.us</code></li>
<li class="list-inline-item"><code class="notranslate">wv.us</code></li>
<li class="list-inline-item"><code class="notranslate">wy.us</code></li>
<li class="list-inline-item"><code class="notranslate">mil.tt</code></li>
<li class="list-inline-item"><code class="notranslate">edu.tt</code></li>
<li class="list-inline-item"><code class="notranslate">edu.tr</code></li>
<li class="list-inline-item"><code class="notranslate">edu.ua</code></li>
<li class="list-inline-item"><code class="notranslate">edu.au</code></li>
<li class="list-inline-item"><code class="notranslate">ac.at</code></li>
<li class="list-inline-item"><code class="notranslate">edu.br</code></li>
<li class="list-inline-item"><code class="notranslate">ac.nz</code></li>
<li class="list-inline-item"><code class="notranslate">school.nz</code></li>
<li class="list-inline-item"><code class="notranslate">cri.nz</code></li>
<li class="list-inline-item"><code class="notranslate">health.nz</code></li>
<li class="list-inline-item"><code class="notranslate">mil.nz</code></li>
<li class="list-inline-item"><code class="notranslate">parlamentti.nz</code></li>
<li class="list-inline-item"><code class="notranslate">ac.in</code></li>
<li class="list-inline-item"><code class="notranslate">edu.in</code></li>
<li class="list-inline-item"><code class="notranslate">mil.in</code></li>
<li class="list-inline-item"><code class="notranslate">ac.jp</code></li>
<li class="list-inline-item"><code class="notranslate">ed.jp</code></li>
<li class="list-inline-item"><code class="notranslate">lg.jp</code></li>
<li class="list-inline-item"><code class="notranslate">ac.za</code></li>
<li class="list-inline-item"><code class="notranslate">edu.za</code></li>
<li class="list-inline-item"><code class="notranslate">mil.za</code></li>
<li class="list-inline-item"><code class="notranslate">school.za</code></li>
<li class="list-inline-item"><code class="notranslate">mil.kr</code></li>
<li class="list-inline-item"><code class="notranslate">ac.kr</code></li>
<li class="list-inline-item"><code class="notranslate">hs.kr</code></li>
<li class="list-inline-item"><code class="notranslate">ms.kr</code></li>
<li class="list-inline-item"><code class="notranslate">es.kr</code></li>
<li class="list-inline-item"><code class="notranslate">sc.kr</code></li>
<li class="list-inline-item"><code class="notranslate">kg.kr</code></li>
<li class="list-inline-item"><code class="notranslate">edu.es</code></li>
<li class="list-inline-item"><code class="notranslate">ac.lk</code></li>
<li class="list-inline-item"><code class="notranslate">sch.lk</code></li>
<li class="list-inline-item"><code class="notranslate">edu.lk</code></li>
<li class="list-inline-item"><code class="notranslate">ac.th</code></li>
<li class="list-inline-item"><code class="notranslate">mi.th</code></li>
<li class="list-inline-item"><code class="notranslate">admin.ch</code></li>
<li class="list-inline-item"><code class="notranslate">canada.ca</code></li>
<li class="list-inline-item"><code class="notranslate">gc.ca</code></li>
<li class="list-inline-item"><code class="notranslate">go.id</code></li>
<li class="list-inline-item"><code class="notranslate">go.jp</code></li>
<li class="list-inline-item"><code class="notranslate">go.ke</code></li>
<li class="list-inline-item"><code class="notranslate">go.kr</code></li>
<li class="list-inline-item"><code class="notranslate">go.th</code></li>
<li class="list-inline-item"><code class="notranslate">gob.ar</code></li>
<li class="list-inline-item"><code class="notranslate">gob.cl</code></li>
<li class="list-inline-item"><code class="notranslate">gob.es</code></li>
<li class="list-inline-item"><code class="notranslate">gob.mx</code></li>
<!--<li class="list-inline-item"><code class="notranslate">gob.pe</code></li>-->
<li class="list-inline-item"><code class="notranslate">gob.ve</code></li>
<li class="list-inline-item"><code class="notranslate">gob.sv</code></li>
<li class="list-inline-item"><code class="notranslate">gouv.fr</code></li>
<li class="list-inline-item"><code class="notranslate">gouv.nc</code></li>
<li class="list-inline-item"><code class="notranslate">gouv.qc.ca</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ad</code></li>
<li class="list-inline-item"><code class="notranslate">gov.af</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ai</code></li>
<li class="list-inline-item"><code class="notranslate">gov.al</code></li>
<li class="list-inline-item"><code class="notranslate">gov.am</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ao</code></li>
<li class="list-inline-item"><code class="notranslate">gov.au</code></li>
<li class="list-inline-item"><code class="notranslate">gov.aw</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ax</code></li>
<li class="list-inline-item"><code class="notranslate">gov.az</code></li>
<li class="list-inline-item"><code class="notranslate">gov.bd</code></li>
<li class="list-inline-item"><code class="notranslate">gov.be</code></li>
<li class="list-inline-item"><code class="notranslate">gov.bg</code></li>
<li class="list-inline-item"><code class="notranslate">gov.bm</code></li>
<!--<li class="list-inline-item"><code class="notranslate">gov.br</code></li>-->
<li class="list-inline-item"><code class="notranslate">gov.by</code></li>
<li class="list-inline-item"><code class="notranslate">gov.cl</code></li>
<li class="list-inline-item"><code class="notranslate">gov.cn</code></li>
<li class="list-inline-item"><code class="notranslate">gov.co</code></li>
<li class="list-inline-item"><code class="notranslate">gov.cy</code></li>
<li class="list-inline-item"><code class="notranslate">gov.cz</code></li>
<li class="list-inline-item"><code class="notranslate">gov.dz</code></li>
<li class="list-inline-item"><code class="notranslate">gov.eg</code></li>
<li class="list-inline-item"><code class="notranslate">gov.fi</code></li>
<li class="list-inline-item"><code class="notranslate">gov.fk</code></li>
<li class="list-inline-item"><code class="notranslate">gov.gg</code></li>
<li class="list-inline-item"><code class="notranslate">gov.gr</code></li>
<li class="list-inline-item"><code class="notranslate">gov.hk</code></li>
<li class="list-inline-item"><code class="notranslate">gov.hr</code></li>
<li class="list-inline-item"><code class="notranslate">gov.hu</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ie</code></li>
<li class="list-inline-item"><code class="notranslate">gov.il</code></li>
<li class="list-inline-item"><code class="notranslate">gov.im</code></li>
<li class="list-inline-item"><code class="notranslate">gov.in</code></li>
<li class="list-inline-item"><code class="notranslate">gov.iq</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ir</code></li>
<li class="list-inline-item"><code class="notranslate">gov.it</code></li>
<li class="list-inline-item"><code class="notranslate">gov.je</code></li>
<li class="list-inline-item"><code class="notranslate">gov.kp</code></li>
<li class="list-inline-item"><code class="notranslate">gov.krd</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ky</code></li>
<li class="list-inline-item"><code class="notranslate">gov.kz</code></li>
<li class="list-inline-item"><code class="notranslate">gov.lb</code></li>
<li class="list-inline-item"><code class="notranslate">gov.lk</code></li>
<li class="list-inline-item"><code class="notranslate">gov.lt</code></li>
<li class="list-inline-item"><code class="notranslate">gov.lv</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ma</code></li>
<li class="list-inline-item"><code class="notranslate">gov.mm</code></li>
<li class="list-inline-item"><code class="notranslate">gov.mo</code></li>
<li class="list-inline-item"><code class="notranslate">gov.mt</code></li>
<li class="list-inline-item"><code class="notranslate">gov.my</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ng</code></li>
<li class="list-inline-item"><code class="notranslate">gov.np</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ph</code></li>
<li class="list-inline-item"><code class="notranslate">gov.pk</code></li>
<li class="list-inline-item"><code class="notranslate">gov.pl</code></li>
<li class="list-inline-item"><code class="notranslate">gov.pt</code></li>
<li class="list-inline-item"><code class="notranslate">gov.py</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ro</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ru</code></li>
<li class="list-inline-item"><code class="notranslate">gov.scot</code></li>
<li class="list-inline-item"><code class="notranslate">gov.se</code></li>
<li class="list-inline-item"><code class="notranslate">gov.sg</code></li>
<li class="list-inline-item"><code class="notranslate">gov.si</code></li>
<li class="list-inline-item"><code class="notranslate">gov.sk</code></li>
<li class="list-inline-item"><code class="notranslate">gov.tr</code></li>
<li class="list-inline-item"><code class="notranslate">gov.tt</code></li>
<li class="list-inline-item"><code class="notranslate">gov.tw</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ua</code></li>
<li class="list-inline-item"><code class="notranslate">gov.uk</code></li>
<li class="list-inline-item"><code class="notranslate">gov.vn</code></li>
<li class="list-inline-item"><code class="notranslate">gov.wales</code></li>
<li class="list-inline-item"><code class="notranslate">gov.za</code></li>
<li class="list-inline-item"><code class="notranslate">government.pn</code></li>
<li class="list-inline-item"><code class="notranslate">govt.nz</code></li>
<!--<li class="list-inline-item"><code class="notranslate">gub.uy</code></li>-->
<li class="list-inline-item"><code class="notranslate">gv.at</code></li>
<li class="list-inline-item"><code class="notranslate">ac.uk</code></li>
<li class="list-inline-item"><code class="notranslate">bl.uk</code></li>
<li class="list-inline-item"><code class="notranslate">judiciary.uk</code></li>
<li class="list-inline-item"><code class="notranslate">mod.uk</code></li>
<li class="list-inline-item"><code class="notranslate">nhs.uk</code></li>
<li class="list-inline-item"><code class="notranslate">parliament.uk</code></li>
<li class="list-inline-item"><code class="notranslate">police.uk</code></li>
<li class="list-inline-item"><code class="notranslate">rct.uk</code></li>
<li class="list-inline-item"><code class="notranslate">royal.uk</code></li>
<li class="list-inline-item"><code class="notranslate">sch.uk</code></li>
<li class="list-inline-item"><code class="notranslate">ukaea.uk</code></li>
</ul>

Lisäksi nämä [brändi- ja yritysverkkotunnukset](https://en.wikipedia.org/wiki/List_of_Internet_top-level_domains#Brand_and_corporate_top-level_domains)-kohteet ovat oletusarvoisesti sallittujen listalla (esim. `apple` Apple Card -pankkitilioteiden `applecard.apple`-kohteelle):

<ul class="list-inline">
<li class="list-inline-item"><code class="notranslate">aaa</code></li>
<li class="list-inline-item"><code class="notranslate">aarp</code></li>
<li class="list-inline-item"><code class="notranslate">abarth</code></li>
<li class="list-inline-item"><code class="notranslate">abb</code></li>
<li class="list-inline-item"><code class="notranslate">abbvie</code></li>
<li class="list-inline-item"><code class="notranslate">abc</code></li>
<li class="list-inline-item"><code class="notranslate">abc</code></li>
<li class="list-inline-item"><code class="notranslate">accenture</code></li>
<li class="list-inline-item"><code class="notranslate">aco</code></li>
<li class="list-inline-item"><code class="notranslate">aeg</code></li>
<li class="list-inline-item"><code class="notranslate">aetna</code></li>
<li class="list-inline-item"><code class="notranslate">afl</code></li>
<li class="list-inline-item"><code class="notranslate">agakhan</code></li>
<li class="list-inline-item"><code class="notranslate">aig</code></li>
<li class="list-inline-item"><code class="notranslate">aigo</code></li>
<li class="list-inline-item"><code class="notranslate">airbus</code></li>
<li class="list-inline-item"><code class="notranslate">airtel</code></li>
<li class="list-inline-item"><code class="notranslate">akdn</code></li>
<li class="list-inline-item"><code class="notranslate">alfaromeo</code></li>
<li class="list-inline-item"><code class="notranslate">alibaba</code></li>
<li class="list-inline-item"><code class="notranslate">alipay</code></li>
<li class="list-inline-item"><code class="notranslate">allfinanz</code></li>
<li class="list-inline-item"><code class="notranslate">allstate</code></li>
<li class="list-inline-item"><code class="notranslate">ally</code></li>
<li class="list-inline-item"><code class="notranslate">alstom</code></li>
<li class="list-inline-item"><code class="notranslate">amazon</code></li>
<li class="list-inline-item"><code class="notranslate">americanexpress</code></li>
<li class="list-inline-item"><code class="notranslate">amex</code></li>
<li class="list-inline-item"><code class="notranslate">amica</code></li>
<li class="list-inline-item"><code class="notranslate">android</code></li>
<li class="list-inline-item"><code class="notranslate">anz</code></li>
<li class="list-inline-item"><code class="notranslate">aol</code></li>
<li class="list-inline-item"><code class="notranslate">omena</code></li>
<li class="list-inline-item"><code class="notranslate">akvarelli</code></li>
<li class="list-inline-item"><code class="notranslate">aramco</code></li>
<li class="list-inline-item"><code class="notranslate">audi</code></li>
<li class="list-inline-item"><code class="notranslate">auspost</code></li>
<li class="list-inline-item"><code class="notranslate">aws</code></li>
<li class="list-inline-item"><code class="notranslate">axa</code></li>
<li class="list-inline-item"><code class="notranslate">azure</code></li>
<li class="list-inline-item"><code class="notranslate">baidu</code></li>
<li class="list-inline-item"><code class="notranslate">bananarepublic</code></li>
<li class="list-inline-item"><code class="notranslate">barclaycard</code></li>
<li class="list-inline-item"><code class="notranslate">barclays</code></li>
<li class="list-inline-item"><code class="notranslate">koripallo</code></li>
<li class="list-inline-item"><code class="notranslate">bauhaus</code></li>
<li class="list-inline-item"><code class="notranslate">bbc</code></li>
<li class="list-inline-item"><code class="notranslate">bbt</code></li>
<li class="list-inline-item"><code class="notranslate">bbva</code></li>
<li class="list-inline-item"><code class="notranslate">bcg</code></li>
<li class="list-inline-item"><code class="notranslate">bentley</code></li>
<li class="list-inline-item"><code class="notranslate">bharti</code></li>
<li class="list-inline-item"><code class="notranslate">bing</code></li>
<li class="list-inline-item"><code class="notranslate">blanco</code></li>
<li class="list-inline-item"><code class="notranslate">bloomberg</code></li>
<li class="list-inline-item"><code class="notranslate">bms</code></li>
<li class="list-inline-item"><code class="notranslate">bmw</code></li>
<li class="list-inline-item"><code class="notranslate">bnl</code></li>
<li class="list-inline-item"><code class="notranslate">bnpparibas</code></li>
<li class="list-inline-item"><code class="notranslate">boehringer</code></li>
<li class="list-inline-item"><code class="notranslate">bond</code></li>
<li class="list-inline-item"><code class="notranslate">varaus</code></li>
<li class="list-inline-item"><code class="notranslate">bosch</code></li>
<li class="list-inline-item"><code class="notranslate">bostik</code></li>
<li class="list-inline-item"><code class="notranslate">bradesco</code></li>
<li class="list-inline-item"><code class="notranslate">bridgestone</code></li>
<li class="list-inline-item"><code class="notranslate">brother</code></li>
<li class="list-inline-item"><code class="notranslate">bugatti</code></li>
<li class="list-inline-item"><code class="notranslate">cal</code></li>
<li class="list-inline-item"><code class="notranslate">calvinklein</code></li>
<li class="list-inline-item"><code class="notranslate">canon</code></li>
<li class="list-inline-item"><code class="notranslate">capitalone</code></li>
<li class="list-inline-item"><code class="notranslate">asuntovaunu</code></li>
<li class="list-inline-item"><code class="notranslate">asuntovaunu</code></li>
<li class="list-inline-item"><code class="notranslate">cba</code></li>
<li class="list-inline-item"><code class="notranslate">cbn</code></li>
<li class="list-inline-item"><code class="notranslate">cbre</code></li>
<li class="list-inline-item"><code class="notranslate">cbs</code></li>
<li class="list-inline-item"><code class="notranslate">cern</code></li>
<li class="list-inline-item"><code class="notranslate">cfa</code></li>
<li class="list-inline-item"><code class="notranslate">chanel</code></li>
<li class="list-inline-item"><code class="notranslate">chase</code></li>
<li class="list-inline-item"><code class="notranslate">chintai</code></li>
<li class="list-inline-item"><code class="notranslate">chrome</code></li>
<li class="list-inline-item"><code class="notranslate">chrysler</code></li>
<li class="list-inline-item"><code class="notranslate">cipriani</code></li>
<li class="list-inline-item"><code class="notranslate">cisco</code></li>
<li class="list-inline-item"><code class="notranslate">linnoitus</code></li>
<li class="list-inline-item"><code class="notranslate">citi</code></li>
<li class="list-inline-item"><code class="notranslate">citic</code></li>
<li class="list-inline-item"><code class="notranslate">clubmed</code></li>
<li class="list-inline-item"><code class="notranslate">comcast</code></li>
<li class="list-inline-item"><code class="notranslate">commbank</code></li>
<li class="list-inline-item"><code class="notranslate">creditunion</code></li>
<li class="list-inline-item"><code class="notranslate">kruunu</code></li>
<li class="list-inline-item"><code class="notranslate">kruunu</code></li>
<li class="list-inline-item"><code class="notranslate">crs</code></li>
<li class="list-inline-item"><code class="notranslate">csc</code></li>
<li class="list-inline-item"><code class="notranslate">cuisinella</code></li>
<li class="list-inline-item"><code class="notranslate">dabur</code></li>
<li class="list-inline-item"><code class="notranslate">datsun</code></li>
<li class="list-inline-item"><code class="notranslate">jälleenmyyjä</code></li>
<li class="list-inline-item"><code class="notranslate">dell</code></li>
<li class="list-inline-item"><code class="notranslate">deloitte</code></li>
<li class="list-inline-item"><code class="notranslate">delta</code></li>
<li class="list-inline-item"><code class="notranslate">dhl</code></li>
<li class="list-inline-item"><code class="notranslate">discover</code></li>
<li class="list-inline-item"><code class="notranslate">dish</code></li>
<li class="list-inline-item"><code class="notranslate">dnp</code></li>
<li class="list-inline-item"><code class="notranslate">dodge</code></li>
<li class="list-inline-item"><code class="notranslate">dunlop</code></li>
<li class="list-inline-item"><code class="notranslate">dupont</code></li>
<li class="list-inline-item"><code class="notranslate">dvag</code></li>
<li class="list-inline-item"><code class="notranslate">edeka</code></li>
<li class="list-inline-item"><code class="notranslate">emerck</code></li>
<li class="list-inline-item"><code class="notranslate">epson</code></li>
<li class="list-inline-item"><code class="notranslate">ericsson</code></li>
<li class="list-inline-item"><code class="notranslate">erni</code></li>
<li class="list-inline-item"><code class="notranslate">esurance</code></li>
<li class="list-inline-item"><code class="notranslate">etisalat</code></li>
<li class="list-inline-item"><code class="notranslate">eurovision</code></li>
<li class="list-inline-item"><code class="notranslate">everbank</code></li>
<li class="list-inline-item"><code class="notranslate">extraspace</code></li>
<li class="list-inline-item"><code class="notranslate">fage</code></li>
<li class="list-inline-item"><code class="notranslate">fairwinds</code></li>
<li class="list-inline-item"><code class="notranslate">farmers</code></li>
<li class="list-inline-item"><code class="notranslate">fedex</code></li>
<li class="list-inline-item"><code class="notranslate">ferrari</code></li>
<li class="list-inline-item"><code class="notranslate">ferrero</code></li>
<li class="list-inline-item"><code class="notranslate">fiat</code></li>
<li class="list-inline-item"><code class="notranslate">fidelity</code></li>
<li class="list-inline-item"><code class="notranslate">firmdale</code></li>
<li class="list-inline-item"><code class="notranslate">flickr</code></li>
<li class="list-inline-item"><code class="notranslate">flir</code></li>
<li class="list-inline-item"><code class="notranslate">flsmidth</code></li>
<li class="list-inline-item"><code class="notranslate">flsmidth class="notranslate">ford</code></li>
<li class="list-inline-item"><code class="notranslate">fox</code></li>
<li class="list-inline-item"><code class="notranslate">fresenius</code></li>
<li class="list-inline-item"><code class="notranslate">forex</code></li>
<li class="list-inline-item"><code class="notranslate">frogans</code></li>
<li class="list-inline-item"><code class="notranslate">frontier</code></li>
<li class="list-inline-item"><code class="notranslate">fujitsu</code></li>
<li class="list-inline-item"><code class="notranslate">fujixerox</code></li>
<li class="list-inline-item"><code class="notranslate">gallo</code></li>
<li class="list-inline-item"><code class="notranslate">gallup</code></li>
<li class="list-inline-item"><code class="notranslate">gap</code></li>
<li class="list-inline-item"><code class="notranslate">gbiz</code></li>
<li class="list-inline-item"><code class="notranslate">gea</code></li>
<li class="list-inline-item"><code class="notranslate">gentting</code></li>
<li class="list-inline-item"><code class="notranslate">gilfing</code></li>
<li class="list-inline-item"><code class="notranslate">gle</code></li>
<li class="list-inline-item"><code class="notranslate">globo</code></li>
<li class="list-inline-item"><code class="notranslate">gmail</code></li>
<li class="list-inline-item"><code class="notranslate">gmo</code></li>
<li class="list-inline-item"><code class="notranslate">gmx</code></li>
<li class="list-inline-item"><code class="notranslate">godaddy</code></li>
<li class="list-inline-item"><code class="notranslate">goldpoint</code></li>
<li class="list-inline-item"><code class="notranslate">goodyear</code></li>
<li class="list-inline-item"><code class="notranslate">goog</code></li>
<li class="list-inline-item"><code class="notranslate">google</code></li>
<li class="list-inline-item"><code class="notranslate">grainger</code></li>
<li class="list-inline-item"><code class="notranslate">guardian</code></li>
<li class="list-inline-item"><code class="notranslate">gucci</code></li>
<li class="list-inline-item"><code class="notranslate">hbo</code></li>
<li class="list-inline-item"><code class="notranslate">hdfc</code></li>
<li class="list-inline-item"><code class="notranslate">hdfcbank</code></li>
<li class="list-inline-item"><code class="notranslate">hermes</code></li>
<li class="list-inline-item"><code class="notranslate">hisamitsu</code></li>
<li class="list-inline-item"><code class="notranslate">hitachi</code></li>
<li class="list-inline-item"><code class="notranslate">hkt</code></li>
<li class="list-inline-item"><code class="notranslate">honda</code></li>
<li class="list-inline-item"><code class="notranslate">honeywell</code></li>
<li class="list-inline-item"><code class="notranslate">hotmail</code></li>
<li class="list-inline-item"><code class="notranslate">hsbc</code></li>
<li class="list-inline-item"><code class="notranslate">hughes</code></li>
<li class="list-inline-item"><code class="notranslate">hyatt</code></li>
<li class="list-inline-item"><code class="notranslate">hyundai</code></li>
<li class="list-inline-item"><code class="notranslate">ibm</code></li>
<li class="list-inline-item"><code class="notranslate">ieee</code></li>
<li class="list-inline-item"><code class="notranslate">ifm</code></li>
<li class="list-inline-item"><code class="notranslate">ikano</code></li>
<li class="list-inline-item"><code class="notranslate">imdb</code></li>
<li class="list-inline-item"><code class="notranslate">infiniti</code></li>
<li class="list-inline-item"><code class="notranslate">intel</code></li>
<li class="list-inline-item"><code class="notranslate">intuit</code></li>
<li class="list-inline-item"><code class="notranslate">ipiranga</code></li>
<li class="list-inline-item"><code class="notranslate">iselect</code></li>
<li class="list-inline-item"><code class="notranslate">itau</code></li>
<li class="list-inline-item"><code class="notranslate">itv</code></li>
<li class="list-inline-item"><code class="notranslate">iveco</code></li>
<li class="list-inline-item"><code class="notranslate">jaguar</code></li>
<li class="list-inline-item"><code class="notranslate">java</code></li>
<li class="list-inline-item"><code class="notranslate">jcb</code></li>
<li class="list-inline-item"><code class="notranslate">jcp</code></li>
<li class="list-inline-item"><code class="notranslate">jeep</code></li>
<li class="list-inline-item"><code class="notranslate">jpmorgan</code></li>
<li class="list-inline-item"><code class="notranslate">juniper</code></li>
<li class="list-inline-item"><code class="notranslate">kddi</code></li>
<li class="list-inline-item"><code class="notranslate">kerryhotels</code></li>
<li class="list-inline-item"><code class="notranslate">kerrylogistics</code></li>
<li class="list-inline-item"><code class="notranslate">kerryproperties</code></li>
<li class="list-inline-item"><code class="notranslate">kfh</code></li>
<li class="list-inline-item"><code class="notranslate">kia</code></li>
<li class="list-inline-item"><code class="notranslate">kinder</code></li>
<li class="list-inline-item"><code class="notranslate">kindle</code></li>
<li class="list-inline-item"><code class="notranslate">komatsu</code></li>
<li class="list-inline-item"><code class="notranslate">kpmg</code></li>
<li class="list-inline-item"><code class="notranslate">kred</code></li>
<li class="list-inline-item"><code class="notranslate">kuokgroup</code></li>
<li class="list-inline-item"><code class="notranslate">lacaixa</code></li>
<li class="list-inline-item"><code class="notranslate">ladbrokes</code></li>
<li class="list-inline-item"><code class="notranslate">lamborghini</code></li>
<li class="list-inline-item"><code class="notranslate">lancaster</code></li>
<li class="list-inline-item"><code class="notranslate">lancia</code></li>
<li class="list-inline-item"><code class="notranslate">lancome</code></li>
<li class="list-inline-item"><code class="notranslate">landrover</code></li>
<li class="list-inline-item"><code class="notranslate">lanxess</code></li>
<li class="list-inline-item"><code class="notranslate">lasalle</code></li>
<li class="list-inline-item"><code class="notranslate">latrobe</code></li>
<li class="list-inline-item"><code class="notranslate">lds</code></li>
<li class="list-inline-item"><code class="notranslate">leclerc</code></li>
<li class="list-inline-item"><code class="notranslate">lego</code></li>
<li class="list-inline-item"><code class="notranslate">laison</code></li>
<li class="list-inline-item"><code class="notranslate">lexus</code></li>
<li class="list-inline-item"><code class="notranslate">lidl</code></li>
<li class="list-inline-item"><code class="notranslate">elämäntapa</code></li>
<li class="list-inline-item"><code class="notranslate">lilly</code></li>
<li class="list-inline-item"><code class="notranslate">lincoln</code></li>
<li class="list-inline-item"><code class="notranslate">linde</code></li>
<li class="list-inline-item"><code class="notranslate">lipsy</code></li>
<li class="list-inline-item"><code class="notranslate">lixil</code></li>
<li class="list-inline-item"><code class="notranslate">paikka</code></li>
<li class="list-inline-item"><code class="notranslate">lotte</code></li>
<li class="list-inline-item"><code class="notranslate">lpl</code></li>
<li class="list-inline-item"><code class="notranslate">lplfinancial</code></li>
<li class="list-inline-item"><code class="notranslate">lundbeck</code></li>
<li class="list-inline-item"><code class="notranslate">lupin</code></li>
<li class="list-inline-item"><code class="notranslate">macys</code></li>
<li class="list-inline-item"><code class="notranslate">maif</code></li>
<li class="list-inline-item"><code class="notranslate">mies</code></li>
<li class="list-inline-item"><code class="notranslate">mango</code></li>
<li class="list-inline-item"><code class="notranslate">marriott</code></li>
<li class="list-inline-item"><code class="notranslate">maserati</code></li>
<li class="list-inline-item"><code class="notranslate">mattel</code></li>
<li class="list-inline-item"><code class="notranslate">mckinsey</code></li>
<li class="list-inline-item"><code class="notranslate">metlife</code></li>
<li class="list-inline-item"><code class="notranslate">microsoft</code></li>
<li class="list-inline-item"><code class="notranslate">mini</code></li>
<li class="list-inline-item"><code class="notranslate">mit</code></li>
<li class="list-inline-item"><code class="notranslate">mitsubishi</code></li>
<li class="list-inline-item"><code class="notranslate">mlb</code></li>
<li class="list-inline-item"><code class="notranslate">mma</code></li>
<li class="list-inline-item"><code class="notranslate">monash</code></li>
<li class="list-inline-item"><code class="notranslate">mormon</code></li>
<li class="list-inline-item"><code class="notranslate">moto</code></li>
<li class="list-inline-item"><code class="notranslate">movistar</code></li>
<li class="list-inline-item"><code class="notranslate">msd</code></li>
<li class="list-inline-item"><code class="notranslate">mtn</code></li>
<li class="list-inline-item"><code class="notranslate">mtr</code></li>
<li class="list-inline-item"><code class="notranslate">keskinäinen</code></li>
<li class="list-inline-item"><code class="notranslate">nadex</code></li>
<li class="list-inline-item"><code class="notranslate">kokonaisvaltainen</code></li>
<li class="list-inline-item"><code class="notranslate">natura</code></ li>
<li class="list-inline-item"><code class="notranslate">nba</code></li>
<li class="list-inline-item"><code class="notranslate">nec</code></li>
<li class="list-inline-item"><code class="notranslate">netflix</code></li>
<li class="list-inline-item"><code class="notranslate">neustar</code></li>
<li class="list-inline-item"><code class="notranslate">newholland</code></li>
<li class="list-inline-item"><code class="notranslate">nfl</code></li>
<li class="list-inline-item"><code class="notranslate">nhk</code></li>
<li class="list-inline-item"><code class="notranslate">nico</code></li>
<li class="list-inline-item"><code class="notranslate">nike</code></li>
<li class="list-inline-item"><code class="notranslate">nikon</code></li>
<li class="list-inline-item"><code class="notranslate">nissan</code></li>
<li class="list-inline-item"><code class="notranslate">nissay</code></li>
<li class="list-inline-item"><code class="notranslate">nokia</code></li>
<li class="list-inline-item"><code class="notranslate">northwesternmutual</code></li>
<li class="list-inline-item"><code class="notranslate">norton</code></li>
<li class="list-inline-item"><code class="notranslate">nra</code></li>
<li class="list-inline-item"><code class="notranslate">ntt</code></li>
<li class="list-inline-item"><code class="notranslate">obi</code></li>
<li class="list-inline-item"><code class="notranslate">toimisto</code></li>
<li class="list-inline-item"><code class="notranslate">omega</code></li>
<li class="list-inline-item"><code class="notranslate">oraakkeli</code></li>
<li class="list-inline-item"><code class="notranslate">oranssi</code></li>
<li class="list-inline-item"><code class="notranslate">otsuka</code></li>
<!--<li class="list-inline-item"><code class="notranslate">ovh</code></li>-->
<li class="list-inline-item"><code class="notranslate">panasonic</code></li>
<li class="list-inline-item"><code class="notranslate">pccw</code></li>
<li class="list-inline-item"><code class="notranslate">pfizer</code></li>
<li class="list-inline-item"><code class="notranslate">philips</code></li>
<li class="list-inline-item"><code class="notranslate">piaget</code></li>
<li class="list-inline-item"><code class="notranslate">pictet</code></li>
<li class="list-inline-item"><code class="notranslate">ping</code></li>
<li class="list-inline-item"><code class="notranslate">pioneer</code></li>
<li class="list-inline-item"><code class="notranslate">pelaaminen</code></li>
<li class="list-inline-item"><code class="notranslate">playstation</code></li>
<li class="list-inline-item"><code class="notranslate">pelaaminen</code></li>
<li class="list-inline-item"><code class="notranslate">politiikka</code></li>
<li class="list-inline-item"><code class="notranslate">käytäntö</code></li>
<li class="list-inline-item"><code class="notranslate">tuote</code></li>
<li class="list-inline-item"><code class="notranslate">progressiivinen</code></li>
<li class="list-inline-item"><code class="notranslate">pelaaminen</code></li>
<li class="list-inline-item"><code class="notranslate">pelaaminen</code></li> class="notranslate">vakavaraisuus</code></li>
<li class="list-inline-item"><code class="notranslate">pwc</code></li>
<!--<li class="list-inline-item"><code class="notranslate">tehtävä</code></li>-->
<li class="list-inline-item"><code class="notranslate">qvc</code></li>
<li class="list-inline-item"><code class="notranslate">punakivi</code></li>
<li class="list-inline-item"><code class="notranslate">luottamus</code></li>
<li class="list-inline-item"><code class="notranslate">rexroth</code></li>
<li class="list-inline-item"><code class="notranslate">ricoh</code></li>
<li class="list-inline-item"><code class="notranslate">rmit</code></li>
<li class="list-inline-item"><code class="notranslate">rocher</code></li>
<li class="list-inline-item"><code class="notranslate">rogers</code></li>
<li class="list-inline-item"><code class="notranslate">rwe</code></li>
<li class="list-inline-item"><code class="notranslate">turvallisuus</code></li>
<li class="list-inline-item"><code class="notranslate">sakura</code></li>
<li class="list-inline-item"><code class="notranslate">samsung</code></li>
<li class="list-inline-item"><code class="notranslate">sandvik</code></li>
<li class="list-inline-item"><code class="notranslate">sandvikcoromant</code></li>
<li class="list-inline-item"><code class="notranslate">sanofi</code></li>
<li class="list-inline-item"><code class="notranslate">sap</code></li>
<li class="list-inline-item"><code class="notranslate">saxo</code></li>
<li class="list-inline-item"><code class="notranslate">sbi</code></li>
<!--<li class="list-inline-item"><code class="notranslate">sbs</code></li>-->
<li class="list-inline-item"><code class="notranslate">sca</code></li>
<li class="list-inline-item"><code class="notranslate">scb</code></li>
<li class="list-inline-item"><code class="notranslate">schaeffler</code></li>
<li class="list-inline-item"><code class="notranslate">schmidt</code></li>
<li class="list-inline-item"><code class="notranslate">musta</code></li>
<li class="list-inline-item"><code class="notranslate">scjohnson</code></li>
<li class="list-inline-item"><code class="notranslate">skor</code></li>
<li class="list-inline-item"><code class="notranslate">paikka</code></li>
<li class="list-inline-item"><code class="notranslate">ses</code></li>
<li class="list-inline-item"><code class="notranslate">ses</code></li>
<li class="list-inline-item"><code class="notranslate">ompelu</code></li>
<li class="list-inline-item"><code class="notranslate">seitsemän</code></li>
<li class="list-inline-item"><code class="notranslate">sfr</code></li>
<li class="list-inline-item"><code class="notranslate">etsiminen</code></li>
<li class="list-inline-item"><code class="notranslate">shangrila</code></li>
<li class="list-inline-item"><code class="notranslate">terävä</code></li>
<li class="list-inline-item"><code class="notranslate">haha</code></li>
<li class="list-inline-item"><code class="notranslate">kuori</code></li>
<li class="list-inline-item"><code class="notranslate">shriram</code></li>
<li class="list-inline-item"><code class="notranslate">sina</code></li>
<li class="list-inline-item"><code class="notranslate">sky</code></li>
<li class="list-inline-item"><code class="notranslate">skype</code></li>
<li class="list-inline-item"><code class="notranslate">smart</code></li>
<li class="list-inline-item"><code class="notranslate">sncf</code></li>
<li class="list-inline-item"><code class="notranslate">softbank</code></li>
<li class="list-inline-item"><code class="notranslate">sohu</code></li>
<li class="list-inline-item"><code class="notranslate">sony</code></li>
<li class="list-inline-item"><code class="notranslate">peilaus</code></li>
<li class="list-inline-item"><code class="notranslate">stada</code></li>
<li class="list-inline-item"><code class="notranslate">staples</code></li>
<li class="list-inline-item"><code class="notranslate">star</code></li>
<li class="list-inline-item"><code class="notranslate">starhub</code></li>
<li class="list-inline-item"><code class="notranslate">statebank</code></li>
<li class="list-inline-item"><code class="notranslate">statefarm</code></li>
<li class="list-inline-item"><code class="notranslate">statoil</code></li>
<li class="list-inline-item"><code class="notranslate">stc</code></li>
<li class="list-inline-item"><code class="notranslate">stcgroup</code></li>
<li class="list-inline-item"><code class="notranslate">suzuki</code></li>
<li class="list-inline-item"><code class="notranslate">swatch</code></li>
<li class="list-inline-item"><code class="notranslate">swiftcover</code></li>
<li class="list-inline-item"><code class="notranslate">symantec</code></li>
<li class="list-inline-item"><code class="notranslate">taobao</code></li>
<li class="list-inline-item"><code class="notranslate">target</code></li>
<li class="list-inline-item"><code class="notranslate">tatamotors</code></li>
<li class="list-inline-item"><code class="notranslate">tdk</code></li>
<li class="list-inline-item"><code class="notranslate">telecity</code></li>
<li class="list-inline-item"><code class="notranslate">telefonica</code></li>
<li class="list-inline-item"><code class="notranslate">temasek</code></li>
<li class="list-inline-item"><code class="notranslate">teva</code></li>
<li class="list-inline-item"><code class="notranslate">tiffany</code></li>
<li class="list-inline-item"><code class="notranslate">tjx</code></li>
<li class="list-inline-item"><code class="notranslate">toray</code></li>
<li class="list-inline-item"><code class="notranslate">toshiba</code></li>
<li class="list-inline-item"><code class="notranslate">yhteensä</code></li>
<li class="list-inline-item"><code class="notranslate">toyota</code></li>
<li class="list-inline-item"><code class="notranslate">travelchannel</code></li>
<li class="list-inline-item"><code class="notranslate">matkustajat</code></li>
<li class="list-inline-item"><code class="notranslate">tui</code></li>
<li class="list-inline-item"><code class="notranslate">televisiot</code></li>
<li class="list-inline-item"><code class="notranslate">ubs</code></li>
<li class="list-inline-item"><code class="notranslate">unicom</code></li>
<li class="list-inline-item"><code class="notranslate">uol</code></li>
<li class="list-inline-item"><code class="notranslate">ups</code></li>
<li class="list-inline-item"><code class="notranslate">avanguard</code></li>
<li class="list-inline-item"><code class="notranslate">verisign</code></li>
<li class="list-inline-item"><code class="notranslate">vig</code></li>
<li class="list-inline-item"><code class="notranslate">viking</code></li>
<li class="list-inline-item"><code class="notranslate">neitsyt</code></li>
<li class="list-inline-item"><code class="notranslate">visa</code></li>
<li class="list-inline-item"><code class="notranslate">vista</code></li>
<li class="list-inline-item"><code class="notranslate">vistaprint</code></li>
<li class="list-inline-item"><code class="notranslate">vivo</code></li>
<li class="list-inline-item"><code class="notranslate">volvo</code></li>
<li class="list-inline-item"><code class="notranslate">walmart</code></li>
<li class="list-inline-item"><code class="notranslate">walter</code></li>
<li class="list-inline-item"><code class="notranslate">sääkanava</code></li>
<li class="list-inline-item"><code class="notranslate">weber</code></li>
<li class="list-inline-item"><code class="notranslate">pato</code></li>
<li class="list-inline-item"><code class="notranslate">williamhill</code></li>
<li class="list-inline-item"><code class="notranslate">ikkunat</code></li>
<li class="list-inline-item"><code class="notranslate">wme</code></li>
<li class="list-inline-item"><code class="notranslate">wolterskluwer</code></li>
<li class="list-inline-item"><code class="notranslate">metsänpuoli</code></li>
<li class="list-inline-item"><code class="notranslate">wtc</code></li>
<li class="list-inline-item"><code class="notranslate">xbox</code></li>
<li class="list-inline-item"><code class="notranslate">xerox</code></li>
<li class="list-inline-item"><code class="notranslate">xfinity</code></li>
<li class="list-inline-item"><code class="notranslate">yahoo</code></li>
<li class="list-inline-item"><code class="notranslate">yamamaxun</code></li>
<li class="list-inline-item"><code class="notranslate">yandex</code></li>
<li class="list-inline-item"><code class="notranslate">yodobashi</code></li>
<li class="list-inline-item"><code class="notranslate">youtube</code></li>
<li class="list-inline-item"><code class="notranslate">zappos</code></li>
<li class="list-inline-item"><code class="notranslate">zara</code></li>
<li class="list-inline-item"><code class="notranslate">zippo</code></li>
</ul>

18. maaliskuuta 2025 lähtien olemme lisänneet tähän luetteloon myös nämä Ranskan merentakaiset alueet ([tämän GitHub-pyynnön mukaisesti](https://github.com/forwardemail/forwardemail.net/issues/327)):

<ul class="list-inline">
<li class="list-inline-item"><code class="notranslate">bzh</code></li>
<li class="list-inline-item"><code class="notranslate">gf</code></li>
<li class="list-inline-item"><code class="notranslate">gp</code></li>
<li class="list-inline-item"><code class="notranslate">mq</code></li>
<li class="list-inline-item"><code class="notranslate">nc</code></li>
<li class="list-inline-item"><code class="notranslate">pf</code></li>
<li class="list-inline-item"><code class="notranslate">pm</code></li>
<li class="list-inline-item"><code class="notranslate">re</code></li>
<li class="list-inline-item"><code class="notranslate">tf</code></li>
<li class="list-inline-item"><code class="notranslate">wf</code></li>
<li class="list-inline-item"><code class="notranslate">yt</code></li>
</ul>

8. heinäkuuta 2025 alkaen olemme lisänneet nämä Eurooppaan liittyvät maat:

<ul class="list-inline">
<li class="list-inline-item"><code class="notranslate">ax</code></li>
<li class="list-inline-item"><code class="notranslate">bg</code></li>
<li class="list-inline-item"><code class="notranslate">fo</code></li>
<li class="list-inline-item"><code class="notranslate">gi</code></li>
<li class="list-inline-item"><code class="notranslate">gr</code></li>
<li class="list-inline-item"><code class="notranslate">hr</code></li>
<li class="list-inline-item"><code class="notranslate">hu</code></li>
<li class="list-inline-item"><code class="notranslate">lt</code></li>
<li class="list-inline-item"><code class="notranslate">lu</code></li>
<li class="list-inline-item"><code class="notranslate">mc</code></li>
<li class="list-inline-item"><code class="notranslate">mk</code></li>
<li class="list-inline-item"><code class="notranslate">mt</code></li>
<li class="list-inline-item"><code class="notranslate">ro</code></li>
<li class="list-inline-item"><code class="notranslate">sk</code></li>
<li class="list-inline-item"><code class="notranslate">va</code></li>
</ul>

Emme nimenomaisesti sisällyttäneet `cz`:aa, `ru`:tä ja `ua`:ta niiden suuren roskapostiaktiivisuuden vuoksi.

### Mitkä ovat sallittujen listan kriteerisi? {#what-is-your-allowlist-criteria}

Meillä on staattinen lista [verkkotunnuspäätteet sallittujen listalla oletuksena](#what-domain-name-extensions-are-allowlisted-by-default) – ja ylläpidämme myös dynaamista, välimuistissa olevaa, jatkuvasti päivittyvää sallittujen luetteloa, joka perustuu seuraaviin tiukkoihin kriteereihin:

* Lähettäjän juuriverkkotunnuksen on oltava [verkkotunnuspääte, joka vastaa ilmaisessa paketissamme tarjoamaamme luetteloa](#what-domain-name-extensions-can-be-used-for-free)-luokassa (lisättynä `biz` ja `info`). Sisällytämme myös osittaiset osumat `edu`, `gov` ja `mil`, kuten `xyz.gov.au` ja `xyz.edu.au`.
* Lähettäjän juuriverkkotunnuksen on oltava 100 000 parhaan yksilöllisen juuriverkkotunnuksen joukossa [Sateenvarjojen suosioluettelo](http://s3-us-west-1.amazonaws.com/umbrella-static/index.html "Umbrella Popularity List")-luokituksesta ("UPL").
* Lähettäjän juuriverkkotunnuksen on oltava 50 000 parhaan yksilöllisen juuriverkkotunnuksen joukossa, jotka ovat esiintyneet vähintään 4 päivänä viimeisten 7 päivän aikana UPL-luokituksissa (\~50%+).
* Lähettäjän juuriverkkotunnus ei saa olla [luokiteltu](https://radar.cloudflare.com/categorization-feedback/)-luokituksessa aikuisille suunnattu sisältö tai Cloudflaren haittaohjelma.
* Lähettäjän juuriverkkotunnuksella on oltava joko A- tai MX-tietueet asetettuna. * Lähettäjän juuriverkkotunnuksella on oltava joko A-tietue(ita), MX-tietue(ita), DMARC-tietue, jossa on `biz`0 tai `biz`1, tai SPF-tietue, jossa on `biz`2 tai `biz`3.

Jos tämä kriteeri täyttyy, lähettäjän juuriverkkotunnus tallennetaan välimuistiin 7 päiväksi. Huomaa, että automaattinen työmme suoritetaan päivittäin – siksi tämä on päivittäin päivittyvä sallittujen luettelon välimuisti.

Automaattinen työmme lataa UPL:n muistissa olevat edelliset 7 päivää, purkaa ne ja jäsentää sitten muistissa olevat tiedot yllä olevien tiukkojen kriteerien mukaisesti.

Tämän kirjoitushetkellä suositut verkkotunnukset, kuten Google, Yahoo, Microsoft, Amazon, Meta, Twitter, Netflix, Spotify ja muut – ovat tietenkin mukana.

Jos lähettäjäsi ei ole sallittujen listallamme, ensimmäisen kerran, kun FQDN-juuriverkkotunnuksesi tai IP-osoitteesi lähettää sähköpostia, sinut asetetaan [rajoitettu nopeus](#do-you-have-rate-limiting)- ja [harmaalle listalle](#do-you-have-a-greylist)-arvoiksi. Huomaa, että tämä on sähköpostin standardikäytäntö. Useimmat sähköpostipalvelinohjelmat yrittävät yrittää uudelleen, jos ne saavat nopeusrajoitus- tai harmaan listan virheen (esim. 421- tai 4xx-tason virhekoodin).

**Huomaa, että tietyt lähettäjät, kuten `a@gmail.com`, `b@xyz.edu` ja `c@gov.au`, voivat silti olla [kiellettyjen listalla](#do-you-have-a-denylist)** (esim. jos havaitsemme automaattisesti roskapostia, tietojenkalastelua tai haittaohjelmia kyseisiltä lähettäjiltä).**

### Mitä verkkotunnuspäätteitä voi käyttää ilmaiseksi {#what-domain-name-extensions-can-be-used-for-free}

Otimme 31. maaliskuuta 2023 alkaen käyttöön uuden yleisen roskapostisäännön käyttäjiemme ja palvelumme suojelemiseksi.

Tämä uusi sääntö sallii vain seuraavien verkkotunnuspäätteiden käytön ilmaispaketissamme:

<ul class="list-inline">
<li class="list-inline-item"><code class="notranslate">ac</code></li>
<li class="list-inline-item"><code class="notranslate">ad</code></li>
<li class="list-inline-item"><code class="notranslate">ag</code></li>
<li class="list-inline-item"><code class="notranslate">ai</code></li>
<li class="list-inline-item"><code class="notranslate">al</code></li>
<li class="list-inline-item"><code class="notranslate">am</code></li>
<li class="list-inline-item"><code class="notranslate">app</code></li>
<li class="list-inline-item"><code class="notranslate">as</code></li>
<li class="list-inline-item"><code class="notranslate">at</code></li>
<li class="list-inline-item"><code class="notranslate">au</code></li>
<li class="list-inline-item"><code class="notranslate">ba</code></li>
<li class="list-inline-item"><code class="notranslate">be</code></li>
<li class="list-inline-item"><code class="notranslate">br</code></li>
<li class="list-inline-item"><code class="notranslate">by</code></li>
<li class="list-inline-item"><code class="notranslate">ca</code></li>
<li class="list-inline-item"><code class="notranslate">cc</code></li>
<li class="list-inline-item"><code class="notranslate">cd</code></li>
<li class="list-inline-item"><code class="notranslate">ch</code></li>
<li class="list-inline-item"><code class="notranslate">ck</code></li>
<li class="list-inline-item"><code class="notranslate">co</code></li>
<li class="list-inline-item"><code class="notranslate">com</code></li>
<li class="list-inline-item"><code class="notranslate">de</code></li>
<li class="list-inline-item"><code class="notranslate">dev</code></li>
<li class="list-inline-item"><code class="notranslate">dj</code></li>
<li class="list-inline-item"><code class="notranslate">ee</code></li>
<li class="list-inline-item"><code class="notranslate">es</code></li>
<li class="list-inline-item"><code class="notranslate">eu</code></li>
<li class="list-inline-item"><code class="notranslate">perhe</code></li>
<li class="list-inline-item"><code class="notranslate">fi</code></li>
<li class="list-inline-item"><code class="notranslate">fm</code></li>
<li class="list-inline-item"><code class="notranslate">fr</code></li>
<li class="list-inline-item"><code class="notranslate">gg</code></li>
<li class="list-inline-item"><code class="notranslate">gl</code></li>
<li class="list-inline-item"><code class="notranslate">id</code></li>
<li class="list-inline-item"><code class="notranslate">ie</code></li>
<li class="list-inline-item"><code class="notranslate">il</code></li>
<li class="list-inline-item"><code class="notranslate">im</code></li>
<li class="list-inline-item"><code class="notranslate">sisään</code></li>
<li class="list-inline-item"><code class="notranslate">io</code></li>
<li class="list-inline-item"><code class="notranslate">ir</code></li>
<li class="list-inline-item"><code class="notranslate">on</code></li>
<li class="list-inline-item"><code class="notranslate">se</code></li>
<li class="list-inline-item"><code class="notranslate">je</code></li>
<li class="list-inline-item"><code class="notranslate">jp</code></li>
<li class="list-inline-item"><code class="notranslate">ke</code></li>
<li class="list-inline-item"><code class="notranslate">kr</code></li>
<li class="list-inline-item"><code class="notranslate">la</code></li>
<li class="list-inline-item"><code class="notranslate">li</code></li>
<li class="list-inline-item"><code class="notranslate">lv</code></li>
<li class="list-inline-item"><code class="notranslate">ly</code></li>
<li class="list-inline-item"><code class="notranslate">md</code></li>
<li class="list-inline-item"><code class="notranslate">me</code></li>
<li class="list-inline-item"><code class="notranslate">mn</code></li>
<li class="list-inline-item"><code class="notranslate">ms</code></li>
<li class="list-inline-item"><code class="notranslate">mu</code></li>
<li class="list-inline-item"><code class="notranslate">mx</code></li>
<li class="list-inline-item"><code class="notranslate">net</code></li>
<li class="list-inline-item"><code class="notranslate">ni</code></li>
<li class="list-inline-item"><code class="notranslate">nl</code></li>
<li class="list-inline-item"><code class="notranslate">no</code></li>
<li class="list-inline-item"><code class="notranslate">nu</code></li>
<li class="list-inline-item"><code class="notranslate">nz</code></li>
<li class="list-inline-item"><code class="notranslate">org</code></li>
<li class="list-inline-item"><code class="notranslate">pl</code></li>
<li class="list-inline-item"><code class="notranslate">pr</code></li>
<li class="list-inline-item"><code class="notranslate">pt</code></li>
<li class="list-inline-item"><code class="notranslate">pw</code></li>
<li class="list-inline-item"><code class="notranslate">rs</code></li>
<li class="list-inline-item"><code class="notranslate">sc</code></li>
<li class="list-inline-item"><code class="notranslate">se</code></li>
<li class="list-inline-item"><code class="notranslate">sh</code></li>
<li class="list-inline-item"><code class="notranslate">si</code></li>
<li class="list-inline-item"><code class="notranslate">sm</code></li>
<li class="list-inline-item"><code class="notranslate">sr</code></li>
<li class="list-inline-item"><code class="notranslate">st</code></li>
<li class="list-inline-item"><code class="notranslate">tc</code></li>
<li class="list-inline-item"><code class="notranslate">tm</code></li>
<li class="list-inline-item"><code class="notranslate">to</code></li>
<li class="list-inline-item"><code class="notranslate">tv</code></li>
<li class="list-inline-item"><code class="notranslate">uk</code></li>
<li class="list-inline-item"><code class="notranslate">us</code></li>
<li class="list-inline-item"><code class="notranslate">uz</code></li>
<li class="list-inline-item"><code class="notranslate">vc</code></li>
<li class="list-inline-item"><code class="notranslate">vg</code></li>
<li class="list-inline-item"><code class="notranslate">vu</code></li>
<li class="list-inline-item"><code class="notranslate">ws</code></li>
<li class="list-inline-item"><code class="notranslate">xyz</code></li>
<li class="list-inline-item"><code class="notranslate">za</code></li>
</ul>

### Onko sinulla harmaa lista {#do-you-have-a-greylist}

Kyllä, meillä on käytössä hyvin löyhä [sähköpostin harmaalistaus](https://en.wikipedia.org/wiki/Greylisting_\(email\)) -käytäntö. Harmaalistaus koskee vain lähettäjiä, jotka eivät ole sallittujen listallamme, ja se säilyy välimuistissamme 30 päivää.

Jokaiselle uudelle lähettäjälle tallennamme avaimen Redis-tietokantaamme 30 päiväksi. Avaimen arvoksi on asetettu heidän ensimmäisen pyyntönsä alkuperäinen saapumisaika. Tämän jälkeen hylkäämme heidän sähköpostinsa uudelleenyrityskoodilla 450 ja annamme sen läpäistä vasta viiden minuutin kuluttua.

Jos he ovat odottaneet onnistuneesti viisi minuuttia tästä alkuperäisestä saapumisajasta, heidän sähköpostinsa hyväksytään eivätkä he saa tätä 450-tilakoodia.

Avain koostuu joko FQDN-juuriverkkotunnuksesta tai lähettäjän IP-osoitteesta. Tämä tarkoittaa, että kaikki harmaalle listalle päässeet aliverkkotunnukset läpäisevät myös juuriverkkotunnuksen ja päinvastoin (tätä tarkoitamme "erittäin löyhällä" käytännöllä).

Jos esimerkiksi sähköposti tulee `test.example.com`:lta ennen kuin näemme sähköpostin tulevan `example.com`:ltä, kaikkien `test.example.com`:lta ja/tai `example.com`:lta tulevien sähköpostien on odotettava 5 minuuttia yhteyden alkuperäisestä saapumisajasta. Emme aseta sekä `test.example.com`:lle että `example.com`:lle omia 5 minuutin odotusaikojaan (harmaalistauskäytäntömme koskee juuriverkkotunnustasolla).

Huomaa, että harmaalistaus ei koske [sallittujen lista](#do-you-have-an-allowlist)-tietokannan lähettäjiä (esim. Meta, Amazon, Netflix, Google, Microsoft tämän kirjoitushetkellä).

### Onko sinulla estolista {#do-you-have-a-denylist}

Kyllä, meillä on oma estolista ja päivitämme sitä automaattisesti reaaliajassa ja manuaalisesti havaitun roskapostin ja haitallisen toiminnan perusteella.

Haemme myös kaikki IP-osoitteet UCEPROTECTin tason 1 kieltolistalta kohdasta <http://wget-mirrors.uceprotect.net/rbldnsd-all/dnsbl-1.uceprotect.net.gz> tunnin välein ja syötämme ne kieltolistallemme 7 päivän voimassaoloajalla.

Estoluettelosta löytyvät lähettäjät saavat virhekoodin 421 (joka kehottaa lähettäjää yrittämään uudelleen myöhemmin), jos niiden [eivät ole sallittujen listalla](#do-you-have-an-allowlist).

Käyttämällä 421-tilakoodia 554-tilakoodin sijaan voidaan vähentää mahdollisia vääriä positiivisia tuloksia reaaliajassa ja viesti voidaan toimittaa onnistuneesti seuraavalla yrityksellä.

**Tämä on suunniteltu toisin kuin muissa sähköpostipalveluissa**, joissa estolistalle lisätty viesti aiheuttaa pysyvän virheen. Lähettäjien pyytäminen lähettämään viestit uudelleen on usein vaikeaa (etenkin suurista organisaatioista), joten tämä lähestymistapa antaa lähettäjälle, vastaanottajalle tai meille noin viisi päivää ensimmäisestä sähköpostiyrityksestä puuttua asiaan ja korjata ongelman (pyytämällä estolistalta poistamista).

Ylläpitäjät seuraavat kaikkia kieltolistalta poistopyyntöjä reaaliajassa (esim. jotta toistuvat väärät positiiviset tulokset voidaan pysyvästi lisätä sallittujen listalle).

Estolistan poistopyyntöjä voi pyytää osoitteessa <https://forwardemail.net/denylist>.. Maksavien käyttäjien estolistan poistopyyntöjä käsitellään välittömästi, kun taas maksamattomien käyttäjien on odotettava, että ylläpitäjät käsittelevät pyyntönsä.

Roskapostia tai virussisältöä lähettäviksi havaittujen lähettäjien luetteloon lisätään seuraavalla tavalla:

1. [alkuperäisen viestin sormenjälki](#how-do-you-determine-an-email-fingerprint) lisätään harmaalle listalle, kun se havaitsee roskapostia tai estolistalla olevaa viestiä "luotettavalta" lähettäjältä (esim. `gmail.com`, `microsoft.com`, `apple.com`).
* Jos lähettäjä oli sallittujen listalla, viesti on harmaalla listalla 1 tunnin ajan.
* Jos lähettäjää ei ole sallittujen listalla, viesti on harmaalla listalla 6 tuntia.
2. Jäsennämme estolista-avaimet lähettäjän ja viestin tiedoista, ja jokaiselle näistä avaimista luomme (jos sellaista ei vielä ole) laskurin, kasvatamme sitä yhdellä ja tallennamme sen välimuistiin 24 tunniksi.
* Sallittujen lähettäjien osalta:
* Lisää avain kirjekuoren "MAIL FROM" -sähköpostiosoitteelle, jos sillä oli SPF-tarkistus tai ei SPF-tarkistusta, ja se ei ollut [postmaster-käyttäjätunnus](#what-are-postmaster-addresses) tai [käyttäjätunnus, johon ei vastata](#what-are-no-reply-addresses). * Jos "Lähettäjä"-otsikko oli sallittujen listalla, lisää avain "Lähettäjä"-otsikon sähköpostiosoitteelle, jos sillä oli SPF-varmenne tai DKIM-varmenne ja kohdistettu.
* Jos "Lähettäjä"-otsikko ei ollut sallittujen listalla, lisää avain "Lähettäjä"-otsikon sähköpostiosoitteelle ja sen juurijäsennetylle verkkotunnukselle.
* Ei-sallittujen lähettäjien osalta:
* Lisää avain "SÄHKÖPOSTIA"-kirjekuoren sähköpostiosoitteelle, jos sillä oli SPF-varmenne.
* Jos "Lähettäjä"-otsikko oli sallittujen listalla, lisää avain "Lähettäjä"-otsikon sähköpostiosoitteelle, jos sillä oli SPF-varmenne tai DKIM-varmenne ja kohdistettu.
* Jos "Lähettäjä"-otsikko ei ollut sallittujen listalla, lisää avain "Lähettäjä"-otsikon sähköpostiosoitteelle ja sen juurijäsennetylle verkkotunnukselle.
* Lisää avain lähettäjän etä-IP-osoitteelle.
* Lisää avain asiakkaan selvittämälle isäntänimelle käänteisen haun avulla lähettäjän IP-osoitteesta (jos sellainen on).
* Lisää avain asiakkaan selvitetyn isäntänimen juuriverkkotunnukselle (jos sellainen on ja jos se eroaa asiakkaan selvitetystä isäntänimestä). 3. Jos laskuri saavuttaa luvun 5 lähettäjälle ja avaimelle, joka ei ole sallittujen listalla, estämme avaimen 30 päiväksi ja lähetämme sähköpostin väärinkäyttötiimillemme. Nämä luvut voivat muuttua, ja päivitykset näkyvät tässä väärinkäytösten seurannan myötä.

4. Jos laskuri saavuttaa luvun 10 lähettäjälle ja avaimelle, estämme avaimen 7 päiväksi ja lähetämme sähköpostin väärinkäyttötiimillemme. Nämä luvut voivat muuttua, ja päivitykset näkyvät tässä väärinkäytösten seurannan myötä.

> **HUOM:** Lähitulevaisuudessa otamme käyttöön maineen seurannan. Maineen seuranta laskee sen sijaan lähettäjän hylkäyslistan saamisen prosenttikynnyksen perusteella (toisin kuin yllä mainittu alkeellinen laskuri).

### Onko sinulla nopeusrajoitus {#do-you-have-rate-limiting}

Lähettäjän lähetysnopeuden rajoitus perustuu joko lähettäjän IP-osoitteen käänteisestä PTR-hausta jäsennettyyn juuriverkkotunnukseen – tai jos se ei tuota tulosta, käytetään yksinkertaisesti lähettäjän IP-osoitetta. Huomaa, että viittaamme tähän jäljempänä nimellä `Sender`.

MX-palvelimillamme on päivittäiset rajoitukset saapuvalle postille, jota vastaanotetaan [salattu IMAP-tallennustila](/blog/docs/best-quantum-safe-encrypted-email-service):lle:

* Sen sijaan, että saapuvan postin määrää rajoitettaisiin yksittäisten aliasten perusteella (esim. `you@yourdomain.com`), rajoitamme saapuvan postin määrää itse aliaksen verkkotunnuksen mukaan (esim. `yourdomain.com`). Tämä estää `Senders`-aliasta tulvimasta kaikkien verkkotunnuksesi aliasten postilaatikoita samanaikaisesti.
* Meillä on yleisiä rajoituksia, jotka koskevat kaikkia `Senders`-aliaksia koko palvelussamme vastaanottajasta riippumatta:
* `Senders`-aliaksien, joita pidämme "luotettavina" totuuden lähteinä (esim. `gmail.com`, `microsoft.com`, `apple.com`), lähetysrajoitus on 100 Gt päivässä.
* `Senders`-aliaksien, jotka ovat [sallittujen listalla](#do-you-have-an-allowlist)-aliaksia, lähetysrajoitus on 10 Gt päivässä.
* Kaikkien muiden `yourdomain.com`0-aliaksien lähetysrajoitus on 1 Gt ja/tai 1000 viestiä päivässä. * Meillä on `yourdomain.com`1- ja `yourdomain.com`2-kohtainen tietty rajoitus, joka on 1 Gt ja/tai 1000 viestiä päivässä.

MX-palvelimet rajoittavat myös viestien edelleenlähettämistä yhdelle tai useammalle vastaanottajalle nopeusrajoituksen avulla – mutta tämä koskee vain `Senders`-objektia, ei [sallittujen lista](#do-you-have-an-allowlist)-objektia:

* Sallimme enintään 100 yhteyttä tunnissa per `Sender`-selvitetty FQDN-juuriverkkotunnus (tai `Sender`-etä-IP-osoite (jos käänteistä PTR-ominaisuutta ei ole saatavilla) ja per kirjekuoren vastaanottaja. Tallennamme nopeusrajoituksen avaimen kryptografisena tiivisteenä Redis-tietokantaamme.

* Jos lähetät sähköpostia järjestelmämme kautta, varmista, että sinulla on käänteinen PTR-asetus käytössä kaikille IP-osoitteillesi (muuten jokaista yksilöllistä FQDN-juuriverkkotunnusta tai IP-osoitetta, josta lähetät, rajoitetaan nopeudella).

* Huomaa, että jos lähetät suositun järjestelmän, kuten Amazon SES:n, kautta, hintarajoituksia ei ole, koska (tämän kirjoitushetkellä) Amazon SES on sallittujen listallamme.

* Jos lähetät viestiä verkkotunnuksesta, kuten `test.abc.123.example.com`, nopeusrajoitus asetetaan verkkotunnukselle `example.com`. Monet roskapostittajat käyttävät satoja aliverkkotunnuksia kiertääkseen yleisiä roskapostisuodattimia, jotka rajoittavat nopeusrajoituksia vain yksilöllisille isäntänimille yksilöllisten FQDN-juuriverkkotunnusten sijaan.

* Nopeusrajan ylittävät `Senders`-arvot hylätään virheellä 421.

IMAP- ja SMTP-palvelimemme rajoittavat aliaksiesi samanaikaisen yhteydenpidon `60` yhteyteen.

MX-palvelimemme rajoittavat [ei sallittujen listalla](#do-you-have-an-allowlist)-lähettäjien muodostamia yhteyksiä yli 10 samanaikaisesti (laskurin välimuistin vanhenemisaika on 3 minuuttia, mikä vastaa soketin aikakatkaisuaikaamme, joka on 3 minuuttia).

### Miten suojaudut takaisinsironnalta {#how-do-you-protect-against-backscatter}

Väärin ohjatut palautuvat viestit tai roskapostin palautus (tunnetaan nimellä "[Takaisinhajonta](https://en.wikipedia.org/wiki/Backscatter_\(email\)") voi aiheuttaa lähettäjän IP-osoitteille negatiivisen maineen.

Suojaudumme takaisinhajottamiselta kahdella tavalla, jotka on kuvattu yksityiskohtaisesti seuraavissa osioissa [Estä tunnetuilta roskapostittajilta tulevan sähköpostin palautuminen](#prevent-bounces-from-known-mail-from-spammers) ja [Estää tarpeettomat pomppimiset suojautuakseen takaisinhajottamiselta](#prevent-unnecessary-bounces-to-protect-against-backscatter).

### Estä tunnettujen roskapostittajien lähettämien sähköpostien palautuminen {#prevent-bounces-from-known-mail-from-spammers}

Noudamme listan [Backscatter.org](https://www.backscatterer.org/):sta ([UCEPROTECT](https://www.uceprotect.net/):n avulla) kohdasta <http://wget-mirrors.uceprotect.net/rbldnsd-all/ips.backscatterer.org.gz> joka tunti ja syötämme sen Redis-tietokantaamme (vertaamme eroja myös etukäteen siltä varalta, että IP-osoitteita on poistettu ja ne on otettava huomioon).

Jos MAIL FROM on tyhjä TAI on yhtä suuri kuin (kirjainkokoa ei erotella) jokin [postinjakajien osoitteet](#what-are-postmaster-addresses)-arvoista (osa ennen @-merkkiä sähköpostissa), tarkistamme, vastaako lähettäjän IP-osoite jotakin tästä luettelosta.

Jos lähettäjän IP-osoite on luettelossa (eikä [sallittujen lista](#do-you-have-an-allowlist)-luettelossamme), lähetämme 554-virheen viestillä `The IP ${session.remoteAddress} is blocked by https://www.backscatterer.org/index.php?target=test&ip=${session.remoteAddress}`. Saamme ilmoituksen, jos lähettäjä on sekä takaisinsirottavien luettelossa että sallittujen luettelossamme, jotta voimme tarvittaessa ratkaista ongelman.

Tässä osiossa kuvatut tekniikat noudattavat kohdassa <https://www.backscatterer.org/?target=usage> annettua "SAFE MODE" -suositusta, jossa tarkistamme lähettäjän IP-osoitteen vain, jos tietyt ehdot ovat jo täyttyneet.

### Estä tarpeettomat heijastukset suojataksesi takaisinsironnalta {#prevent-unnecessary-bounces-to-protect-against-backscatter}

Pomppuviestit ovat sähköposteja, jotka osoittavat, että sähköpostin edelleenlähetys vastaanottajalle epäonnistui kokonaan eikä sähköpostia yritetä uudelleen.

Yleinen syy takaisinsirontalistalle joutumiseen on väärin ohjatut palautukset tai palautusroskaposti, joten meidän on suojauduttava tältä muutamalla tavalla:

1. Lähetämme viestin vain, kun esiintyy yli 500 tilakoodivirhettä (kun edelleenlähetysyritykset epäonnistuivat, esim. Gmail vastaa 500-tason virheellä).

2. Lähetämme viestin vain kerran ja ainoastaan kerran (käytämme laskettua palautussormenjälkiavainta ja tallennamme sen välimuistiin kaksoiskappaleiden lähettämisen estämiseksi). Palautussormenjälki on avain, joka on viestin sormenjälki yhdistettynä palautusosoitteen tiivisteeseen ja sen virhekoodiin). Katso lisätietoja viestin sormenjäljen laskemisesta osiosta [Sormenjälkien ottaminen](#how-do-you-determine-an-email-fingerprint). Onnistuneesti lähetetyt palautussormenjäljet vanhenevat 7 päivän kuluttua Redis-välimuistissamme.

3. Lähetämme viestin vain, kun MAIL FROM ja/tai From ei ole tyhjä eikä sisällä (kirjainkokoa ei erotella) [postin pääkäyttäjän käyttäjätunnus](#what-are-postmaster-addresses)-kohtaa (sähköpostin @-merkkiä edeltävä osa).

4. Emme lähetä viestiä, jos alkuperäisessä viestissä oli jokin seuraavista otsikoista (kirjainkokoa ei erotella):

* `auto-submitted`-otsikko, jonka arvo ei ole yhtä suuri kuin `no`.
* `x-auto-response-suppress`-otsikko, jonka arvo on `dr`, `autoreply`, `auto-reply`, `auto_reply` tai `all`.

* `list-id`-, `list-subscribe`-, `no`0-, `no`1-, `no`2-, `no`3-, `no`4-, `no`5-, `no`6- tai `no`7-otsikko (arvosta riippumatta).
* `no`8-otsikko, jonka arvo on `no`9, `x-auto-response-suppress`0, `x-auto-response-suppress`1, `x-auto-response-suppress`2 tai `x-auto-response-suppress`3.

5. Emme lähetä viestiä, jos MAIL FROM- tai Lähettäjä-sähköpostiosoite päättyy `+donotreply`-, `-donotreply`-, `+noreply`- tai `-noreply`-osoitukseen.

6. Emme lähetä, jos Lähettäjän sähköpostiosoite ja käyttäjätunnus -osio oli `mdaemon` ja sen kirjainkokoa ei erotella otsikossa `X-MDDSN-Message`.

7. Emme lähetä, jos `multipart/report`-otsikko on kirjainkokoa ei-herkkä `content-type`.

### Miten sähköpostin sormenjälki määritetään {#how-do-you-determine-an-email-fingerprint}

Sähköpostin sormenjälkeä käytetään sähköpostin yksilöllisyyden määrittämiseen ja kaksoisviestien toimittamisen sekä [kaksoispalautukset](#prevent-unnecessary-bounces-to-protect-against-backscatter):n lähettämisen estämiseen.

Sormenjälki lasketaan seuraavasta luettelosta:

* Asiakkaan selvittämä FQDN-isäntänimi tai IP-osoite
* `Message-ID`-otsikkoarvo (jos on)
* `Date`-otsikkoarvo (jos on)
* `From`-otsikkoarvo (jos on)
* `To`-otsikkoarvo (jos on)
* `Cc`-otsikkoarvo (jos on)
* `Subject`-otsikkoarvo (jos on)
* `Body`-arvo (jos on)

### Voinko lähettää sähköposteja edelleen muihin portteihin kuin 25 (esim. jos internet-palveluntarjoajani on estänyt portin 25) {#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25}

Kyllä, olemme lisänneet tämän ominaisuuden 5. toukokuuta 2020 alkaen. Tällä hetkellä ominaisuus on verkkotunnuskohtainen, ei aliaskohtainen. Jos tarvitset sen olevan aliaskohtainen, ota meihin yhteyttä ja kerro tarpeistasi.

<div class="alert my-3 alert-danger">
<i class="fa fa-stop-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Parannettu yksityisyyden suoja:
</strong>
<span>
Jos käytät maksullista tilausta (jossa on parannettu yksityisyyden suoja), siirry kohtaan <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Oma tili <i class="fa fa-angle-right"></i> Verkkotunnukset</a>, napsauta verkkotunnuksesi vieressä olevaa "Määritä"-painiketta ja napsauta sitten "Asetukset". Jos haluat lisätietoja maksullisista tilauksista, katso <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Hinnoittelu</a>-sivumme. Muussa tapauksessa voit jatkaa alla olevien ohjeiden noudattamista.
</span>
</div>

Jos käytät ilmaisversiota, lisää uusi DNS <strong class="notranslate">TXT</strong>-tietue alla olevan kuvan mukaisesti, mutta muuta portti 25:stä valitsemaasi porttiin.

Jos esimerkiksi haluan, että kaikki `example.com`-osoitteeseen menevät sähköpostit lähetetään edelleen aliasvastaanottajien SMTP-porttiin 1337 25:n sijaan:

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Nimi/Isäntä/Alias</th>
<th class="text-center">TTL</th>
<th>Tyyppi</th>
<th>Vastaus/Arvo</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", tai tyhjä</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email-port=1337</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Vinkki:
</strong>
Yleisin mukautetun porttiohjauksen määritystapa on silloin, kun haluat ohjata kaikki example.com-sivustolle menevät sähköpostit eri porttiin example.com-sivustolla kuin SMTP-standardin mukaiseen porttiin 25. Voit määrittää tämän lisäämällä seuraavan <strong class="notranslate">TXT</strong>-keräilytietueen.
<span>
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Nimi/Isäntä/Alias</th>
<th class="text-center">TTL</th>
<th>Tyyppi</th>
<th>Vastaus/Arvo</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", tai tyhjä</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=example.com</code></td>
</tr>
</tbody>
</table>

### Tukeeko se plus-merkkiä (+) Gmail-aliaksille? {#does-it-support-the-plus--symbol-for-gmail-aliases}

Kyllä, ehdottomasti.

### Tukeeko se aliverkkotunnuksia {#does-it-support-sub-domains}

Kyllä, ehdottomasti. Sen sijaan, että nimenä/isännänä/aliaksena käytettäisiin @-merkkiä, "."-merkkiä tai tyhjää kohtaa, käytetään arvona aliverkkotunnuksen nimeä.

Jos haluat `foo.example.com`:n lähettävän sähköpostit edelleen, anna `foo` DNS-asetuksissasi nimeksi/isäntäksi/alias-arvoksi (sekä MX- että TXT-tietueille).

### Lähettääkö tämä sähköpostini otsikot edelleen? {#does-this-forward-my-emails-headers}

Kyllä, ehdottomasti.

### Onko tämä hyvin testattu {#is-this-well-tested}

Kyllä, siinä on [ava](https://github.com/avajs/ava):lla kirjoitettuja testejä ja se sisältää myös koodikattavuutta.

### Välitätkö SMTP-vastausviestejä ja -koodeja? {#do-you-pass-along-smtp-response-messages-and-codes}

Kyllä, ehdottomasti. Jos esimerkiksi lähetät sähköpostia osoitteeseen `hello@example.com` ja se on rekisteröity edelleenlähetettäväksi osoitteeseen `user@gmail.com`, palautetaan SMTP-vastausviesti ja -koodi SMTP-palvelimelta "gmail.com" välityspalvelimen "mx1.forwardemail.net" tai "mx2.forwardemail.net" sijaan.

### Miten estät roskapostittajat ja varmistat hyvän sähköpostin edelleenlähetysmaineen {#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation}

Katso yllä olevat osiot [Miten sähköpostin edelleenlähetysjärjestelmäsi toimii](#how-does-your-email-forwarding-system-work), [Miten käsittelet sähköpostin toimitusongelmia](#how-do-you-handle-email-delivery-issues) ja [Miten käsittelet IP-osoitteiden estymisen](#how-do-you-handle-your-ip-addresses-becoming-blocked).

### Miten suoritat DNS-hakuja verkkotunnuksille {#how-do-you-perform-dns-lookups-on-domain-names}

Loimme avoimen lähdekoodin ohjelmistoprojektin :tangerine: [Mandariini](https://github.com/forwardemail/tangerine) ja käytämme sitä DNS-hakuihin. Oletusarvoisesti käytetyt DNS-palvelimet ovat `1.1.1.1` ja `1.0.0.1`, ja DNS-kyselyt tehdään [DNS HTTPS:n kautta](https://en.wikipedia.org/wiki/DNS_over_HTTPS):n ("DoH") kautta sovellustasolla.

:tangerine: [Mandariini](https://github.com/tangerine) käyttää [oletuksena CloudFlaren yksityisyyttä ensisijaisesti huomioivaa kuluttajille suunnattua DNS-palvelua][cloudflare-dns].

## Tili ja laskutus {#account-and-billing}

### Tarjoatteko rahat takaisin -takuun maksullisille paketeille? {#do-you-offer-a-money-back-guarantee-on-paid-plans}

Kyllä! Automaattiset hyvitykset tapahtuvat, kun päivität, alennat tai peruutat tilisi 30 päivän kuluessa tilauksen alkamisesta. Tämä koskee vain ensikertalaisia asiakkaita.

### Jos vaihdan liittymää, hyvitättekö erotuksen? {#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference}

Emme hyvitä emmekä jaa erotusta, kun vaihdat sopimusta. Sen sijaan muunnamme jäljellä olevan keston nykyisen sopimustesi päättymispäivästä uuden sopimustesi lähimpään suhteelliseen kestoon (pyöristettynä alaspäin kuukausittain).

Huomaa, että jos päivität tai alennat maksullista tilausta 30 päivän sisällä maksullisen tilauksen aloittamisesta, hyvitämme automaattisesti koko summan olemassa olevasta tilauksestasi.

### Voinko käyttää tätä sähköpostin edelleenlähetyspalvelua vain "varapalvelimena" tai "varapalvelimena" MX-palvelimena {#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server}

Ei, sitä ei suositella, koska voit käyttää vain yhtä sähköpostinvaihtopalvelinta kerrallaan. Varajärjestelmiä ei yleensä koskaan yritetä uudelleen prioriteettivirheiden ja MX-vaihdon prioriteettitarkistusta noudattamattomien sähköpostipalvelinten vuoksi.

### Voinko poistaa käytöstä tiettyjä aliaksia {#can-i-disable-specific-aliases}

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tärkeää:
</strong>
<span>
Jos käytät maksullista tilausta, sinun on mentävä kohtaan <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Oma tili <i class="fa fa-angle-right"></i> Verkkotunnukset</a> <i class="fa fa-angle-right"></i> Aliakset <i class="fa fa-angle-right"></i> Muokkaa aliasta <i class="fa fa-angle-right"></i> Poista valinta ruudusta "Aktiivinen" <i class="fa fa-angle-right"></i> Jatka.
</span>
</div>

Kyllä, muokkaa vain DNS-<strong class="notranslate">TXT</strong>-tietuettasi ja lisää aliaksen etuliitteeksi joko yksi, kaksi tai kolme huutomerkkiä (katso alla).

Huomaa, että sinun *tulisi* säilyttää ":"-määritykset, sillä niitä tarvitaan, jos päätät joskus poistaa tämän käytöstä (ja niitä käytetään myös tuontiin, jos päivität johonkin maksullisiin paketteihimme).

**Hiljaista hylkäämistä varten (lähettäjälle viesti näyttää siltä kuin se olisi lähetetty onnistuneesti, mutta ei todellisuudessa mene minnekään) (tilakoodi `250`):** Jos lisäät aliaksen etuliitteeksi "!" (yksi huutomerkki), se palauttaa onnistumistilakoodin `250` lähettäjille, jotka yrittävät lähettää viestin tähän osoitteeseen, mutta itse sähköpostit eivät mene minnekään (esim. mustaan aukkoon tai `/dev/null`).

**Pehmeää hylkäämistä varten (tilakoodi `421`):** Jos lisäät aliaksen etuliitteeksi "!!" (kaksoishuutomerkki), se palauttaa pehmeän virhekoodin `421` lähettäjille, jotka yrittävät lähettää sähköpostia tähän osoitteeseen. Sähköpostien lähetystä yritetään usein uudelleen jopa viiden päivän ajan ennen hylkäämistä ja palautumista.

**Järjestelmän hylkääminen (tilakoodi `550`):** Jos lisäät aliaksen etuliitteeksi kolmoishuutomerkin (!!!), se palauttaa pysyvän virhekoodin `550` lähettäjille, jotka yrittävät lähettää viestiä tähän osoitteeseen, ja sähköpostit hylätään ja palautetaan.

Jos esimerkiksi haluan, että kaikki `alias@example.com`-kansioon menevät sähköpostit eivät enää kulje `user@gmail.com`-kansioon, vaan ne hylätään ja palautetaan (esim. käytä kolmea huutomerkkiä):

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Nimi/Isäntä/Alias</th>
<th class="text-center">TTL</th>
<th>Tyyppi</th>
<th>Vastaus/Arvo</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", tai tyhjä</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=!!!alias:user@gmail.com</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Vinkki:
</strong>
<span>
Voit myös kirjoittaa edelleenlähetetyn vastaanottajan osoitteen muotoon "nobody@forwardemail.net", jolloin viesti reititetään osoitteeseen nobody, kuten alla olevassa esimerkissä.
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Nimi/Isäntä/Alias</th>
<th class="text-center">TTL</th>
<th>Tyyppi</th>
<th>Vastaus/Arvo</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", tai tyhjä</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=!!!alias:nobody@forwardemail.net</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Vinkki:
</strong>
<span>
Jos haluat parantaa tietoturvaa, voit myös poistaa osan ":user@gmail.com" (tai ":nobody@forwardemail.net") ja jättää jäljelle vain "!!!alias" kuten alla olevassa esimerkissä.
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Nimi/Isäntä/Alias</th>
<th class="text-center">TTL</th>
<th>Tyyppi</th>
<th>Vastaus/Arvo</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", tai tyhjä</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=!!!alias</code></td>
</tr>
</tbody>
</table>

### Voinko lähettää sähköposteja edelleen useille vastaanottajille {#can-i-forward-emails-to-multiple-recipients}

Kyllä, ehdottomasti. Määritä vain useita vastaanottajia TXT-tietueissasi.

Jos esimerkiksi haluan sähköpostin, joka menee osoitteeseen `hello@example.com`, välitettävän osoitteeseen `user+a@gmail.com` ja `user+b@gmail.com`, niin <strong class="notranslate">TXT</strong>-tietueeni näyttäisi tältä:

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Nimi/Isäntä/Alias</th>
<th class="text-center">TTL</th>
<th>Tyyppi</th>
<th>Vastaus/Arvo</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", tai tyhjä</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code class="cursor-initial" data-original-title="" title="">forward-email=hello:user+a@gmail.com,hello:user+b@gmail.com</code></td>
</tr>
</tbody>
</table>

Tai voit määrittää ne kahdella eri rivillä, kuten tässä:

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Nimi/Isäntä/Alias</th>
<th class="text-center">TTL</th>
<th>Tyyppi</th>
<th>Vastaus/Arvo</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", tai tyhjä</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=hello:user+a@gmail.com</code></td>
</tr>
<tr>
<td><em>"@", ".", tai tyhjä</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=hello:user+b@gmail.com</code></td>
</tr>
</tbody>
</table>

Se on sinusta kiinni!

### Voinko määrittää useita yleisiä keräilyvastaanottajia? {#can-i-have-multiple-global-catch-all-recipients}

Kyllä voit. Määritä vain useita globaaleja keräilyvastaanottajia <strong class="notranslate">TXT</strong>-tietueissasi.

Jos esimerkiksi haluan, että jokainen sähköposti, joka menee `*@example.com`:aan (tähti tarkoittaa, että kyseessä on jokerimerkki eli keräilyviesti), lähetetään edelleen `user+a@gmail.com`:een ja `user+b@gmail.com`:een, niin <strong class="notranslate">TXT</strong>-tietueeni näyttäisi tältä:

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Nimi/Isäntä/Alias</th>
<th class="text-center">TTL</th>
<th>Tyyppi</th>
<th>Vastaus/Arvo</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", tai tyhjä</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=user+a@gmail.com,user+b@gmail.com</code></td>
</tr>
</tbody>
</table>

Tai voit määrittää ne kahdella eri rivillä, kuten tässä:

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Nimi/Isäntä/Alias</th>
<th class="text-center">TTL</th>
<th>Tyyppi</th>
<th>Vastaus/Arvo</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", tai tyhjä</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=user+a@gmail.com</code></td>
</tr>
<tr>
<td><em>@, ".", tai tyhjä</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=user+b@gmail.com</code></td>
</tr>
</tbody>
</table>

Se on sinusta kiinni!

### Onko olemassa enimmäismäärää sähköpostiosoitteita, joihin voin edelleenlähettää viestit per alias {#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias}}

Kyllä, oletusraja on 10. Tämä EI tarkoita, että verkkotunnuksellasi voi olla vain 10 aliasta. Voit käyttää niin montaa aliasta kuin haluat (rajattomasti). Se tarkoittaa, että voit edelleenlähettää vain yhden aliaksen 10 yksilölliseen sähköpostiosoitteeseen. Sinulla voi olla `hello:user+1@gmail.com`, `hello:user+2@gmail.com`, `hello:user+3@gmail.com`, … (1–10) – ja kaikki osoitteeseen `hello@example.com` lähetetyt sähköpostit välitetään osoitteeseen `user+1@gmail.com`, `user+2@gmail.com`, `user+3@gmail.com`, … (1–10).

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Vinkki:
</strong>
<span>
Tarvitsetko yli 10 vastaanottajaa aliasta kohden? Lähetä meille sähköpostia, niin nostamme mielellämme tilien enimmäismäärää.
</span>
</div>

### Voinko lähettää sähköposteja rekursiivisesti edelleen {#can-i-recursively-forward-emails}

Kyllä, voit, mutta sinun on silti noudatettava enimmäisrajaa. Jos sinulla on `hello:linus@example.com` ja `linus:user@gmail.com`, osoitteeseen `hello@example.com` olevat sähköpostit välitetään osoitteeseen `linus@example.com` ja `user@gmail.com`. Huomaa, että jos yrität lähettää sähköposteja rekursiivisesti edelleen enimmäisrajan ylittävän määrän, saat virheen.

### Voivatko ihmiset rekisteröidä sähköpostin edelleenlähetykseni tai poistaa sen rekisteröinnin ilman lupaani? {#can-people-unregister-or-register-my-email-forwarding-without-my-permission}

Käytämme MX- ja <strong class="notranslate">TXT</strong>-tietueiden vahvistusta, joten jos lisäät tämän palvelun vastaavat MX- ja <strong class="notranslate">TXT</strong>-tietueet, olet rekisteröitynyt. Jos poistat ne, rekisteröintisi peruuntuu. Sinulla on verkkotunnuksesi ja DNS-hallintasi omistusoikeus, joten jos jollakulla on pääsy niihin, se on ongelma.

### Miten se on ilmainen {#how-is-it-free}

Forward Email tarjoaa ilmaisen tason yhdistämällä avoimen lähdekoodin kehitystyön, tehokkaan infrastruktuurin ja valinnaiset maksulliset liittymät, jotka tukevat palvelua.

Ilmaista tasoamme tukevat:

1. **Avoimen lähdekoodin kehitys**: Koodikanta on avoimen lähdekoodin, mikä mahdollistaa yhteisön osallistumisen ja läpinäkyvän toiminnan.

2. **Tehokas infrastruktuuri**: Olemme optimoineet järjestelmämme sähköpostin edelleenlähetyksen käsittelemiseksi minimaalisilla resursseilla.

3. **Maksulliset premium-paketit**: Käyttäjät, jotka tarvitsevat lisäominaisuuksia, kuten SMTP-lähetyksen, IMAP-vastaanoton tai parannetut yksityisyysasetukset, tilaavat maksulliset paketit.

4. **Kohtuulliset käyttörajoitukset**: Ilmaisella tasolla on kohtuullisen käytön käytännöt väärinkäytösten estämiseksi.

> \[!NOTE]
> Olemme sitoutuneet pitämään sähköpostin perus-edelleenohjauksen ilmaisina ja tarjoamaan samalla premium-ominaisuuksia käyttäjille, joilla on edistyneempiä tarpeita.

> \[!TIP]
> Jos palvelumme on mielestäsi arvokas, harkitse maksulliseen tilaukseen päivittämistä jatkuvan kehityksen ja ylläpidon tukemiseksi.

### Mikä on sähköpostin enimmäiskokoraja {#what-is-the-max-email-size-limit}

Oletusarvoinen kokorajoitus on 50 Mt, joka sisältää sisällön, otsikot ja liitteet. Huomaa, että palvelut, kuten Gmail ja Outlook, sallivat vain 25 Mt:n kokorajoituksen, ja jos ylität rajan lähettäessäsi viestejä näiden palveluntarjoajien osoitteisiin, saat virheilmoituksen.

Jos tiedostokokoraja ylitetään, palautetaan virhe oikealla vastauskoodilla.

### Tallennatteko sähköpostilokeja {#do-you-store-logs-of-emails}

Ei, emme kirjoita levylle emmekä tallenna lokeja – [virheitä lukuun ottamatta](#do-you-store-error-logs)- ja [lähtevä SMTP](#do-you-support-sending-email-with-smtp)-elementtien avulla (katso [Tietosuojakäytäntö](/privacy)).

Kaikki tehdään muistissa ja [lähdekoodimme on GitHubissa](https://github.com/forwardemail)-kohteessa.

### Tallennatko virhelokeja {#do-you-store-error-logs}

**Kyllä. Voit tarkastella virhelokeja kohdassa [Oma tili → Lokit](/my-account/logs) tai [Oma tili → Verkkotunnukset](/my-account/domains).**

Helmikuusta 2023 lähtien olemme säilyttäneet `4xx`- ja `5xx`-SMTP-vastauskoodien virhelokeja 7 päivän ajan – nämä lokit sisältävät SMTP-virheen, kirjekuoren ja sähköpostin otsikot (emme tallenna sähköpostin runkoa emmekä liitteitä).

Virhelokien avulla voit tarkistaa puuttuvat tärkeät sähköpostit ja vähentää roskapostin vääriä positiivisia tuloksia [verkkotunnuksesi](/my-account/domains):lle. Ne ovat myös erinomainen resurssi [sähköpostin webhookit](#do-you-support-webhooks)-ongelmien virheenkorjaukseen (koska virhelokit sisältävät webhook-päätepisteen vastauksen).

[nopeuden rajoittaminen](#do-you-have-rate-limiting):n ja [harmaalistaus](#do-you-have-a-greylist):n virhelokit eivät ole käytettävissä, koska yhteys päättyy ennenaikaisesti (esim. ennen kuin `RCPT TO`- ja `MAIL FROM`-komennot voidaan lähettää).

Katso lisätietoja [Tietosuojakäytäntö](/privacy)-kohdasta.

### Luetko sähköpostejani? {#do-you-read-my-emails}

Ei, ehdottomasti ei. Katso [Tietosuojakäytäntö](/privacy).

Monet muut sähköpostin edelleenlähetyspalvelut tallentavat ja voivat mahdollisesti lukea sähköpostisi. Ei ole mitään syytä, miksi edelleenlähetetyt sähköpostit pitäisi tallentaa levylle – ja siksi olemme suunnitelleet ensimmäisen avoimen lähdekoodin ratkaisun, joka tekee kaiken muistissa.

Uskomme, että sinulla tulisi olla oikeus yksityisyyteen ja kunnioitamme sitä ehdottomasti. Palvelimelle asennettu koodi on [avoimen lähdekoodin ohjelmisto GitHubissa](https://github.com/forwardemail) läpinäkyvyyden ja luottamuksen rakentamisen takaamiseksi.

### Voinko lähettää sähköpostia Gmailissa tällä osoitteella: {#can-i-send-mail-as-in-gmail-with-this}

Kyllä! Olemme lisänneet tämän ominaisuuden 2. lokakuuta 2018 alkaen. Katso yllä oleva [Kuinka lähettää sähköpostia Gmailin avulla](#how-to-send-mail-as-using-gmail)!

Sinun tulisi myös asettaa Gmailin SPF-tietue DNS-määritystesi <strong class="notranslate">TXT</strong>-tietueeseen.

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tärkeää:
</strong>
<span>
Jos käytät Gmailia (esim. Lähetä sähköpostia nimellä) tai G Suitea, sinun on lisättävä <code>include:_spf.google.com</code> SPF <strong class="notranslate">TXT</strong>-tietueeseesi, esimerkiksi:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
</span>
</div>

### Voinko lähettää sähköpostia nimellä Outlookissa tällä {#can-i-send-mail-as-in-outlook-with-this}}-asetuksella?

Kyllä! Olemme lisänneet tämän ominaisuuden 2. lokakuuta 2018 alkaen. Katso vain nämä kaksi Microsoftin linkkiä alta:

* <https://support.office.com/en-us/article/add-or-remove-an-email-alias-in-outlook-com-459b1989-356d-40fa-a689-8f285b13f1f2>
* <https://support.office.com/en-us/article/send-email-from-a-different-address-in-outlook-com-ccba89cb-141c-4a36-8c56-6d16a8556d2e>

Sinun tulisi myös asettaa Outlookin SPF-tietue DNS-määritystesi <strong class="notranslate">TXT</strong>-tietueeseen.

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tärkeää:
</strong>
<span>
Jos käytät Microsoft Outlookia tai Live.comia, sinun on lisättävä <code>include:spf.protection.outlook.com</code> SPF <strong class="notranslate">TXT</strong>-tietueeseesi, esimerkiksi:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:spf.protection.outlook.com -all</code>
</span>
</div>

### Voinko lähettää sähköpostia nimellä Apple Mailissa ja iCloud Mailissa tällä {#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this}}-osoitteella?

Jos olet iCloud+:n tilaaja, voit käyttää mukautettua verkkotunnusta. [Palvelumme on yhteensopiva myös Apple Mailin kanssa.](#apple-mail).

Lisätietoja on kohdassa <https://support.apple.com/en-us/102540>.

### Voinko lähettää edelleen rajattomasti sähköposteja tällä {#can-i-forward-unlimited-emails-with-this}}

Kyllä, "suhteellisen tuntemattomien" lähettäjien yhteysnopeus on kuitenkin rajoitettu 100 yhteyteen tunnissa isäntänimeä tai IP-osoitetta kohden. Katso yllä oleva osio [Nopeuden rajoittaminen](#do-you-have-rate-limiting) ja [Harmaalistaus](#do-you-have-a-greylist).

"Suhteellisen tuntemattomalla" tarkoitamme lähettäjiä, jotka eivät näy [sallittujen lista](#do-you-have-an-allowlist)-kohteessa.

Jos tämä raja ylittyy, lähetämme 421-vastauskoodin, joka käskee lähettäjän sähköpostipalvelinta yrittämään uudelleen myöhemmin.

### Tarjoatteko rajattomasti verkkotunnuksia yhteen hintaan? {#do-you-offer-unlimited-domains-for-one-price}

Kyllä. Maksat kuukausittain vain yhden hinnan riippumatta siitä, mikä paketti on käytössäsi – ja se kattaa kaikki verkkotunnuksesi.

### Mitä maksutapoja hyväksytte {#which-payment-methods-do-you-accept}

Sähköpostin edelleenlähetys hyväksyy seuraavat kertaluonteiset tai kuukausittaiset/neljännesvuosittaiset/vuosittaiset maksutavat:

1. **Luotto-/pankkikortit/tilisiirrot**: Visa, Mastercard, American Express, Discover, JCB, Diners Club jne.
2. **PayPal**: Yhdistä PayPal-tilisi helppoja maksuja varten.
3. **Kryptovaluutta**: Hyväksymme maksut Stripen stablecoin-maksuina Ethereum-, Polygon- ja Solana-verkoissa.

> \[!NOTE]
> Tallennamme palvelimillemme rajoitetusti maksutietoja, jotka sisältävät vain maksutunnisteet ja viittaukset [Raita](https://stripe.com/global)- ja [PayPal](https://www.paypal.com)-tapahtuma-, asiakas-, tilaus- ja maksutunnuksiin.

> \[!TIP]
> Parhaan yksityisyyden takaamiseksi harkitse kryptovaluuttojen käyttöä maksuvälineenä.

Kaikki maksut käsitellään turvallisesti Stripen tai PayPalin kautta. Maksutietojasi ei koskaan tallenneta palvelimillemme.

## Lisäresurssit {#additional-resources}

> \[!TIP]
> Alla olevia artikkeleitamme päivitetään säännöllisesti uusilla oppailla, vinkeillä ja teknisillä tiedoilla. Tarkista usein uusin sisältö.

* [Case-tutkimukset ja kehittäjädokumentaatio](/blog/docs)
* [Resurssit](/resources)
* [Oppaat](/guides)

[gmail-2fa]: VÄLIAIKAINEN_PAIKKAPIDÄN_0

[cloudflare-dns]: https://blog.cloudflare.com/announcing-1111/