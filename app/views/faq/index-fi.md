# Usein Kysytyt Kysymykset {#frequently-asked-questions}

<img loading="lazy" src="/img/articles/faq.webp" alt="Forward Email usein kysytyt kysymykset" class="rounded-lg" />


## Sisällysluettelo {#table-of-contents}

* [Pika-aloitus](#quick-start)
* [Johdanto](#introduction)
  * [Mikä on Forward Email](#what-is-forward-email)
  * [Kuka käyttää Forward Emailia](#who-uses-forward-email)
  * [Mikä on Forward Emailin historia](#what-is-forward-emails-history)
  * [Kuinka nopea tämä palvelu on](#how-fast-is-this-service)
* [Sähköpostiohjelmat](#email-clients)
  * [Thunderbird](#thunderbird)
  * [Microsoft Outlook](#microsoft-outlook)
  * [Apple Mail](#apple-mail)
  * [eM Client](#em-client)
  * [Mobiililaitteet](#mobile-devices)
  * [Sendmail SMTP -välityspalvelimen asetukset](#sendmail-smtp-relay-configuration)
  * [Exim4 SMTP -välityspalvelimen asetukset](#exim4-smtp-relay-configuration)
  * [msmtp SMTP -asiakasohjelman asetukset](#msmtp-smtp-client-configuration)
  * [Komentorivisähköpostiohjelmat](#command-line-email-clients)
  * [Windows-sähköpostin asetukset](#windows-email-configuration)
  * [Postfix SMTP -välityspalvelimen asetukset](#postfix-smtp-relay-configuration)
  * [Kuinka lähettää sähköpostia Gmailin kautta](#how-to-send-mail-as-using-gmail)
  * [Mikä on perinteinen ilmainen opas Send Mail As -toiminnolle Gmailissa](#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail)
  * [Edistynyt Gmail-reitityksen asetukset](#advanced-gmail-routing-configuration)
  * [Edistynyt Outlook-reitityksen asetukset](#advanced-outlook-routing-configuration)
* [Vianmääritys](#troubleshooting)
  * [Miksi en saa testisähköposteja](#why-am-i-not-receiving-my-test-emails)
  * [Kuinka määrittää sähköpostiohjelma toimimaan Forward Emailin kanssa](#how-do-i-configure-my-email-client-to-work-with-forward-email)
  * [Miksi sähköpostini päätyvät roskapostiin ja roskakansioon ja kuinka tarkistaa domainin maine](#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation)
  * [Mitä tehdä, jos saan roskapostia](#what-should-i-do-if-i-receive-spam-emails)
  * [Miksi testisähköpostini Gmailissa näyttävät epäilyttäviltä](#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious)
  * [Voinko poistaa via forwardemail dot net -tekstin Gmailissa](#can-i-remove-the-via-forwardemail-dot-net-in-gmail)
* [Tietojen hallinta](#data-management)
  * [Missä palvelimesi sijaitsevat](#where-are-your-servers-located)
  * [Kuinka viedä ja varmuuskopioida postilaatikko](#how-do-i-export-and-backup-my-mailbox)
  * [Kuinka tuoda ja siirtää olemassa oleva postilaatikko](#how-do-i-import-and-migrate-my-existing-mailbox)
  * [Kuinka käyttää omaa S3-yhteensopivaa tallennustilaa varmuuskopioihin](#how-do-i-use-my-own-s3-compatible-storage-for-backups)
  * [Kuinka muuntaa SQLite-varmuuskopiot EML-tiedostoiksi](#how-do-i-convert-sqlite-backups-to-eml-files)
  * [Tuetteko itseisännöintiä](#do-you-support-self-hosting)
* [Sähköpostin asetukset](#email-configuration)
  * [Kuinka aloittaa ja määrittää sähköpostin edelleenlähetys](#how-do-i-get-started-and-set-up-email-forwarding)
  * [Voinko käyttää useita MX-vaihtoehtoja ja palvelimia edistyneeseen edelleenlähetykseen](#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding)
  * [Kuinka määrittää lomavastaaja (poissa toimistosta automaattivastaaja)](#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder)
  * [Kuinka määrittää SPF Forward Emailille](#how-do-i-set-up-spf-for-forward-email)
  * [Kuinka määrittää DKIM Forward Emailille](#how-do-i-set-up-dkim-for-forward-email)
  * [Kuinka määrittää DMARC Forward Emailille](#how-do-i-set-up-dmarc-for-forward-email)
  * [Kuinka tarkastella DMARC-raportteja](#how-do-i-view-dmarc-reports)
  * [Kuinka yhdistää ja määrittää yhteystiedot](#how-do-i-connect-and-configure-my-contacts)
  * [Kuinka yhdistää ja määrittää kalenterit](#how-do-i-connect-and-configure-my-calendars)
  * [Kuinka lisätä lisää kalentereita ja hallita olemassa olevia kalentereita](#how-do-i-add-more-calendars-and-manage-existing-calendars)
  * [Kuinka yhdistää ja määrittää tehtävät ja muistutukset](#how-do-i-connect-and-configure-tasks-and-reminders)
  * [Miksi en voi luoda tehtäviä macOS Muistutuksissa](#why-cant-i-create-tasks-in-macos-reminders)
  * [Kuinka määrittää Tasks.org Androidilla](#how-do-i-set-up-tasksorg-on-android)
  * [Kuinka määrittää SRS Forward Emailille](#how-do-i-set-up-srs-for-forward-email)
  * [Kuinka määrittää MTA-STS Forward Emailille](#how-do-i-set-up-mta-sts-for-forward-email)
  * [Kuinka lisätä profiilikuva sähköpostiosoitteeseeni](#how-do-i-add-a-profile-picture-to-my-email-address)
* [Edistyneet ominaisuudet](#advanced-features)
  * [Tuetteko uutiskirjeitä tai markkinointisähköpostilistoja](#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email)
  * [Tuetteko sähköpostin lähettämistä API:n kautta](#do-you-support-sending-email-with-api)
  * [Tuetteko sähköpostin vastaanottamista IMAPilla](#do-you-support-receiving-email-with-imap)
  * [Tuetteko POP3:a](#do-you-support-pop3)
  * [Tuetteko kalentereita (CalDAV)](#do-you-support-calendars-caldav)
  * [Tuetteko tehtäviä ja muistutuksia (CalDAV VTODO)](#do-you-support-tasks-and-reminders-caldav-vtodo)
  * [Tuetteko yhteystietoja (CardDAV)](#do-you-support-contacts-carddav)
  * [Tuetteko sähköpostin lähettämistä SMTP:llä](#do-you-support-sending-email-with-smtp)
  * [Tuetteko OpenPGP/MIMEa, päästä päähän -salausta ("E2EE") ja Web Key Directoryä ("WKD")](#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd)
  * [Tuetteko S/MIME-salausta](#do-you-support-smime-encryption)
  * [Tuetteko Sieve-sähköpostisuodatusta](#do-you-support-sieve-email-filtering)
  * [Tuetteko MTA-STS:ää](#do-you-support-mta-sts)
  * [Tuetteko passkeyjä ja WebAuthnia](#do-you-support-passkeys-and-webauthn)
  * [Tuetteko sähköpostin parhaita käytäntöjä](#do-you-support-email-best-practices)
  * [Tuetteko bounce-webhookkeja](#do-you-support-bounce-webhooks)
  * [Tuetteko webhookkeja](#do-you-support-webhooks)
  * [Tuetteko säännöllisiä lausekkeita eli regexiä](#do-you-support-regular-expressions-or-regex)
  * [Mitkä ovat lähtevän SMTP:n rajoitukset](#what-are-your-outbound-smtp-limits)
  * [Tarvitsenko hyväksynnän SMTP:n käyttöönottoon](#do-i-need-approval-to-enable-smtp)
  * [Mitkä ovat SMTP-palvelimen asetukset](#what-are-your-smtp-server-configuration-settings)
  * [Mitkä ovat IMAP-palvelimen asetukset](#what-are-your-imap-server-configuration-settings)
  * [Mitkä ovat POP3-palvelimen asetukset](#what-are-your-pop3-server-configuration-settings)
  * [Kuinka määrittää sähköpostin automaattinen etsintä domainilleni](#how-do-i-set-up-email-autodiscovery-for-my-domain)
* [Turvallisuus](#security-1)
  * [Edistyneet palvelimen koventamistekniikat](#advanced-server-hardening-techniques)
  * [Onko teillä SOC 2- tai ISO 27001 -sertifikaatteja](#do-you-have-soc-2-or-iso-27001-certifications)
  * [Käytättekö TLS-salausta sähköpostin edelleenlähetyksessä](#do-you-use-tls-encryption-for-email-forwarding)
  * [Säilytättekö sähköpostin todennusotsikot](#do-you-preserve-email-authentication-headers)
  * [Säilytättekö alkuperäiset sähköpostin otsikot ja estättekö väärentämisen](#do-you-preserve-original-email-headers-and-prevent-spoofing)
  * [Kuinka suojaudutte roskapostilta ja väärinkäytöksiltä](#how-do-you-protect-against-spam-and-abuse)
  * [Tallennatteko sähköpostin sisällön levylle](#do-you-store-email-content-on-disk)
  * [Voiko sähköpostin sisältö paljastua järjestelmävirheissä](#can-email-content-be-exposed-during-system-crashes)
  * [Kuka pääsee käsiksi sähköpostiinfrastruktuuriinne](#who-has-access-to-your-email-infrastructure)
  * [Mitä infrastruktuuripalveluntarjoajia käytätte](#what-infrastructure-providers-do-you-use)
  * [Tarjoatteko tietojenkäsittelysopimusta (DPA)](#do-you-offer-a-data-processing-agreement-dpa)
  * [Kuinka käsittelette tietomurtotiedotteet](#how-do-you-handle-data-breach-notifications)
  * [Tarjoatteko testausympäristön](#do-you-offer-a-test-environment)
  * [Tarjoatteko valvonta- ja hälytystyökaluja](#do-you-provide-monitoring-and-alerting-tools)
  * [Kuinka varmistatte korkean käytettävyyden](#how-do-you-ensure-high-availability)
  * [Oletteko NDAA:n Section 889 -vaatimusten mukaisia](#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa)
* [Järjestelmä- ja tekniset tiedot](#system-and-technical-details)
  * [Tallennatteko sähköpostit ja niiden sisällöt](#do-you-store-emails-and-their-contents)
  * [Kuinka sähköpostin edelleenlähetysjärjestelmänne toimii](#how-does-your-email-forwarding-system-work)
  * [Kuinka käsittelette sähköpostin edelleenlähetykseen](#how-do-you-process-an-email-for-forwarding)
  * [Kuinka käsittelette sähköpostin toimitusongelmia](#how-do-you-handle-email-delivery-issues)
  * [Kuinka käsittelette IP-osoitteiden estämisen](#how-do-you-handle-your-ip-addresses-becoming-blocked)
  * [Mitä ovat postmaster-osoitteet](#what-are-postmaster-addresses)
  * [Mitä ovat no-reply-osoitteet](#what-are-no-reply-addresses)
  * [Mitkä ovat palvelimienne IP-osoitteet](#what-are-your-servers-ip-addresses)
  * [Onko teillä sallittujen listaa](#do-you-have-an-allowlist)
  * [Mitkä domain-päätteet ovat oletuksena sallittuja](#what-domain-name-extensions-are-allowlisted-by-default)
  * [Mikä on sallittujen listan kriteeri](#what-is-your-allowlist-criteria)
  * [Mitkä domain-päätteet voi käyttää ilmaiseksi](#what-domain-name-extensions-can-be-used-for-free)
  * [Onko teillä harmaaslista](#do-you-have-a-greylist)
  * [Onko teillä estolista](#do-you-have-a-denylist)
  * [Onko teillä nopeuden rajoitus](#do-you-have-rate-limiting)
  * [Kuinka suojaudutte backscatterilta](#how-do-you-protect-against-backscatter)
  * [Estä bounce-viestit tunnetuilta MAIL FROM -roskapostittajilta](#prevent-bounces-from-known-mail-from-spammers)
  * [Estä tarpeettomat bounce-viestit backscatterin estämiseksi](#prevent-unnecessary-bounces-to-protect-against-backscatter)
  * [Kuinka määritätte sähköpostin sormenjäljen](#how-do-you-determine-an-email-fingerprint)
  * [Voinko edelleenlähettää sähköposteja muille porteille kuin 25 (esim. jos ISP on estänyt portin 25)](#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25)
  * [Tukeeko se plus + -merkkiä Gmailin aliaksissa](#does-it-support-the-plus--symbol-for-gmail-aliases)
  * [Tukeeko se alidomaineja](#does-it-support-sub-domains)
  * [Edelleenlähettääkö tämä sähköpostin otsikot](#does-this-forward-my-emails-headers)
  * [Onko tämä hyvin testattu](#is-this-well-tested)
  * [Välitättekö SMTP-vastausviestit ja -koodit](#do-you-pass-along-smtp-response-messages-and-codes)
  * [Kuinka estätte roskapostittajat ja varmistatte hyvän sähköpostin edelleenlähetyksen maineen](#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation)
  * [Kuinka teette DNS-kyselyjä domain-nimille](#how-do-you-perform-dns-lookups-on-domain-names)
* [Tili ja laskutus](#account-and-billing)
  * [Tarjoatteko rahat takaisin -takuun maksullisissa suunnitelmissa](#do-you-offer-a-money-back-guarantee-on-paid-plans)
  * [Jos vaihdan suunnitelmaa, hyvitättekö erotuksen](#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference)
  * [Voinko käyttää tätä sähköpostin edelleenlähetyspalvelua "varapalvelimena" tai "varakatkaisupalvelimena" MX-palvelimena](#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server)
  * [Voinko poistaa tiettyjä aliaksia käytöstä](#can-i-disable-specific-aliases)
  * [Voinko edelleenlähettää sähköposteja useille vastaanottajille](#can-i-forward-emails-to-multiple-recipients)
  * [Voinko käyttää useita globaaleja catch-all-vastaanottajia](#can-i-have-multiple-global-catch-all-recipients)
  * [Onko aliaksia kohden enimmäismäärä sähköpostiosoitteita, joihin voi edelleenlähettää](#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias)
  * [Voinko edelleenlähettää sähköposteja rekursiivisesti](#can-i-recursively-forward-emails)
  * [Voivatko ihmiset rekisteröidä tai poistaa edelleenlähetykseni ilman lupaani](#can-people-unregister-or-register-my-email-forwarding-without-my-permission)
  * [Miten tämä on ilmaista](#how-is-it-free)
  * [Mikä on suurin sallittu sähköpostin koko](#what-is-the-max-email-size-limit)
  * [Tallennatteko sähköpostilokeja](#do-you-store-logs-of-emails)
  * [Tallennatteko virhelokeja](#do-you-store-error-logs)
  * [Lukevatko te sähköpostejani](#do-you-read-my-emails)
  * [Voinko lähettää sähköpostia Gmailissa tämän avulla](#can-i-send-mail-as-in-gmail-with-this)
  * [Voinko lähettää sähköpostia Outlookissa tämän avulla](#can-i-send-mail-as-in-outlook-with-this)
  * [Voinko lähettää sähköpostia Apple Mailissa ja iCloud Mailissa tämän avulla](#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this)
  * [Voinko edelleenlähettää rajattomasti sähköposteja tämän avulla](#can-i-forward-unlimited-emails-with-this)
  * [Tarjoatteko rajattomasti domaineja yhdellä hinnalla](#do-you-offer-unlimited-domains-for-one-price)
  * [Mitkä maksutavat hyväksytte](#which-payment-methods-do-you-accept)
* [Lisäresurssit](#additional-resources)
## Quick Start {#quick-start}

Aloittaaksesi Forward Emailin kanssa:

1. **Luo tili** osoitteessa [forwardemail.net/register](https://forwardemail.net/register)

2. **Lisää ja vahvista verkkotunnuksesi** kohdassa [Oma tili → Verkkotunnukset](/my-account/domains)

3. **Lisää ja määritä sähköpostialiaset/postilaatikot** kohdassa [Oma tili → Verkkotunnukset](/my-account/domains) → Aliakset

4. **Testaa asetuksesi** lähettämällä sähköposti yhdelle uudelle aliasillesi

> \[!TIP]
> DNS-muutosten leviämisessä maailmanlaajuisesti voi kestää 24–48 tuntia, vaikka ne usein astuvat voimaan paljon nopeammin.

> \[!IMPORTANT]
> Parhaan toimitettavuuden varmistamiseksi suosittelemme [SPF](#how-do-i-set-up-spf-for-forward-email), [DKIM](#how-do-i-set-up-dkim-for-forward-email) ja [DMARC](#how-do-i-set-up-dmarc-for-forward-email) -tietueiden määrittämistä.


## Introduction {#introduction}

### What is Forward Email {#what-is-forward-email}

> \[!NOTE]
> Forward Email sopii erinomaisesti yksityishenkilöille, pienyrityksille ja kehittäjille, jotka haluavat ammattimaiset sähköpostiosoitteet ilman täyden sähköpostipalvelun kustannuksia ja ylläpitoa.

Forward Email on **täysimittainen sähköpostipalveluntarjoaja** ja **sähköpostipalveluntarjoaja omille verkkotunnuksille**.

Se on ainoa ilmainen ja avoimen lähdekoodin palvelu, joka mahdollistaa omien verkkotunnusten sähköpostiosoitteiden käytön ilman oman sähköpostipalvelimen perustamisen ja ylläpidon monimutkaisuutta.

Palvelumme välittää sähköpostit, jotka on lähetetty omalle verkkotunnuksellesi, olemassa olevaan sähköpostitiliisi – ja voit jopa käyttää meitä omana sähköpostipalveluntarjoajanasi.

Forward Emailin keskeiset ominaisuudet:

* **Oman verkkotunnuksen sähköposti**: Käytä ammattimaisia sähköpostiosoitteita omalla verkkotunnuksellasi
* **Ilmainen taso**: Perussähköpostin edelleenlähetys ilman kustannuksia
* **Parannettu yksityisyys**: Emme lue sähköpostejasi emmekä myy tietojasi
* **Avoin lähdekoodi**: Koko koodipohjamme on saatavilla GitHubissa
* **SMTP-, IMAP- ja POP3-tuki**: Täydet sähköpostin lähetys- ja vastaanotto-ominaisuudet
* **Päätepisteestä päätepisteeseen -salauksen tuki**: OpenPGP/MIME-tuki
* **Mukautetut catch-all-aliaset**: Luo rajattomasti sähköpostialiasia

Voit verrata meitä yli 56 muuhun sähköpostipalveluntarjoajaan [sähköpostipalvelujen vertailusivullamme](/blog/best-email-service).

> \[!TIP]
> Opi lisää Forward Emailista lukemalla ilmainen [Tekninen valkoinen kirjamme](/technical-whitepaper.pdf)

### Who uses Forward Email {#who-uses-forward-email}

Tarjoamme sähköpostipalvelua ja edelleenlähetyspalvelua yli 500 000 verkkotunnukselle ja näille merkittäville käyttäjille:

| Asiakas                                 | Case Study                                                                                               |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| U.S. Naval Academy                       | [:page_facing_up: Case Study](/blog/docs/federal-government-email-service-section-889-compliant)         |
| Canonical                                | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study)                   |
| Netflix Games                            |                                                                                                          |
| The Linux Foundation                     | [:page_facing_up: Case Study](/blog/docs/linux-foundation-email-enterprise-case-study)                   |
| The PHP Foundation                       |                                                                                                          |
| Fox News Radio                           |                                                                                                          |
| Disney Ad Sales                          |                                                                                                          |
| jQuery                                   | [:page_facing_up: Case Study](/blog/docs/linux-foundation-email-enterprise-case-study)                   |
| LineageOS                                |                                                                                                          |
| Ubuntu                                   | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study)                   |
| Kubuntu                                  | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study)                   |
| Lubuntu                                  | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study)                   |
| The University of Cambridge              | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study)                  |
| The University of Maryland               | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study)                  |
| The University of Washington             | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study)                  |
| Tufts University                         | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study)                  |
| Swarthmore College                       | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study)                  |
| Government of South Australia            |                                                                                                          |
| Government of Dominican Republic         |                                                                                                          |
| Fly<span>.</span>io                      |                                                                                                          |
| RCD Hotels                               |                                                                                                          |
| Isaac Z. Schlueter (npm)                 | [:page_facing_up: Case Study](/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem) |
| David Heinemeier Hansson (Ruby on Rails) |                                                                                                          |
### Mikä on Forward Emailin historia {#what-is-forward-emails-history}

Voit oppia lisää Forward Emailista [meidän Tietoa-sivultamme](/about).

### Kuinka nopea tämä palvelu on {#how-fast-is-this-service}

> \[!NOTE]
> Järjestelmämme on suunniteltu nopeudelle ja luotettavuudelle, useilla varmistetuilla palvelimilla varmistaaksemme, että sähköpostisi toimitetaan viipymättä.

Forward Email toimittaa viestit minimaalisen viiveen kanssa, tyypillisesti sekunneissa vastaanottamisesta.

Suorituskykymittarit:

* **Keskimääräinen toimitusaika**: Alle 5-10 sekuntia vastaanotosta edelleenlähetykseen ([katso meidän Inboxiin saapumisen "TTI" seurantapiste](/tti))
* **Käyttöaika**: 99,9 %+ palvelun saatavuus
* **Globaali infrastruktuuri**: Palvelimet strategisesti sijoitettu optimaaliseksi reititykseksi
* **Automaattinen skaalaus**: Järjestelmämme skaalautuu sähköpostipiikkien aikana

Toimimme reaaliajassa, toisin kuin muut palveluntarjoajat, jotka luottavat viivästyneisiin jonoihin.

Emme kirjoita levyille emmekä tallenna lokeja – [virheiden poikkeuksella](#do-you-store-error-logs) ja [lähtö-SMTP:n osalta](#do-you-support-sending-email-with-smtp) (katso meidän [Tietosuojakäytäntö](/privacy)).

Kaikki tehdään muistissa ja [lähdekoodimme on GitHubissa](https://github.com/forwardemail).


## Sähköpostiohjelmat {#email-clients}

### Thunderbird {#thunderbird}

1. Luo uusi alias ja generoi salasana Forward Email -hallintapaneelissasi
2. Avaa Thunderbird ja mene kohtaan **Muokkaa → Tilin asetukset → Tilitoiminnot → Lisää sähköpostitili**
3. Syötä nimesi, Forward Email -osoitteesi ja salasana
4. Klikkaa **Määritä manuaalisesti** ja syötä:
   * Saapuva: IMAP, `imap.forwardemail.net`, portti 993, SSL/TLS
   * Lähtevä: SMTP, `smtp.forwardemail.net`, portti 465, SSL/TLS (suositeltu; portti 587 STARTTLS:llä on myös tuettu)
5. Klikkaa **Valmis**

### Microsoft Outlook {#microsoft-outlook}

1. Luo uusi alias ja generoi salasana Forward Email -hallintapaneelissasi
2. Mene kohtaan **Tiedosto → Lisää tili**
3. Syötä Forward Email -osoitteesi ja klikkaa **Yhdistä**
4. Valitse **Lisäasetukset** ja valitse **Anna minun määrittää tilini manuaalisesti**
5. Valitse **IMAP** ja syötä:
   * Saapuva: `imap.forwardemail.net`, portti 993, SSL
   * Lähtevä: `smtp.forwardemail.net`, portti 465, SSL/TLS (suositeltu; portti 587 STARTTLS:llä on myös tuettu)
   * Käyttäjätunnus: Koko sähköpostiosoitteesi
   * Salasana: Generoitu salasanasi
6. Klikkaa **Yhdistä**

### Apple Mail {#apple-mail}

1. Luo uusi alias ja generoi salasana Forward Email -hallintapaneelissasi
2. Mene kohtaan **Mail → Asetukset → Tilit → +**
3. Valitse **Muu sähköpostitili**
4. Syötä nimesi, Forward Email -osoitteesi ja salasana
5. Palvelinasetuksissa syötä:
   * Saapuva: `imap.forwardemail.net`
   * Lähtevä: `smtp.forwardemail.net`
   * Käyttäjätunnus: Koko sähköpostiosoitteesi
   * Salasana: Generoitu salasanasi
6. Klikkaa **Kirjaudu sisään**

### eM Client {#em-client}

1. Luo uusi alias ja generoi salasana Forward Email -hallintapaneelissasi
2. Avaa eM Client ja mene kohtaan **Valikko → Tilit → + Lisää tili**
3. Klikkaa **Sähköposti** ja valitse sitten **Muu**
4. Syötä Forward Email -osoitteesi ja klikkaa **Seuraava**
5. Syötä seuraavat palvelinasetukset:
   * **Saapuva palvelin**: `imap.forwardemail.net`
   * **Lähtevä palvelin**: `smtp.forwardemail.net`
6. Syötä koko sähköpostiosoitteesi **Käyttäjänimeksi** ja generoitu salasana **Salasanaksi** sekä saapuvaan että lähtevään palvelimeen.
7. eM Client testaa yhteyden. Kun testi onnistuu, klikkaa **Seuraava**.
8. Syötä nimesi ja valitse tilin nimi.
9. Klikkaa **Valmis**.

### Mobiililaitteet {#mobile-devices}

iOS:lle:

1. Mene kohtaan **Asetukset → Mail → Tilit → Lisää tili → Muu**
2. Napauta **Lisää sähköpostitili** ja syötä tietosi
3. Palvelinasetuksissa käytä samoja IMAP- ja SMTP-asetuksia kuin yllä

Androidille:

1. Mene kohtaan **Asetukset → Tilit → Lisää tili → Henkilökohtainen (IMAP)**
2. Syötä Forward Email -osoitteesi ja salasana
3. Palvelinasetuksissa käytä samoja IMAP- ja SMTP-asetuksia kuin yllä

### Sendmail SMTP -välityksen määritys {#sendmail-smtp-relay-configuration}

Voit määrittää Sendmailin välittämään sähköpostit Forward Emailin SMTP-palvelimien kautta. Tämä on yleinen asetus vanhemmille järjestelmille tai sovelluksille, jotka käyttävät Sendmailia.
<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Arvioitu asennusaika:</strong>
  <span>Alle 20 minuuttia</span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tärkeää:
  </strong>
  <span>
    Tämä vaatii maksullisen tilauksen, jossa SMTP-käyttöoikeus on käytössä.
  </span>
</div>

#### Configuration {#configuration}

1. Muokkaa `sendmail.mc` -tiedostoasi, joka sijaitsee tyypillisesti polussa `/etc/mail/sendmail.mc`:

   ```bash
   sudo nano /etc/mail/sendmail.mc
   ```

2. Lisää seuraavat rivit määrittääksesi smart hostin ja todennuksen:

   ```
   define(`SMART_HOST', `smtp.forwardemail.net')dnl
   define(`RELAY_MAILER_ARGS', `TCP $h 465')dnl
   define(`confAUTH_MECHANISMS', `EXTERNAL GSSAPI DIGEST-MD5 CRAM-MD5 LOGIN PLAIN')dnl
   FEATURE(`authinfo',`hash -o /etc/mail/authinfo.db')dnl
   ```

3. Luo todennustiedosto `/etc/mail/authinfo`:

   ```bash
   sudo nano /etc/mail/authinfo
   ```

4. Lisää Forward Email -tunnuksesi `authinfo`-tiedostoon:

   ```
   AuthInfo:smtp.forwardemail.net "U:your-alias@yourdomain.com" "P:your-generated-password" "M:PLAIN"
   ```

5. Luo todennustietokanta ja suojaa tiedostot:

   ```bash
   sudo makemap hash /etc/mail/authinfo < /etc/mail/authinfo
   sudo chmod 600 /etc/mail/authinfo /etc/mail/authinfo.db
   ```

6. Rakenna Sendmailin konfiguraatio uudelleen ja käynnistä palvelu uudelleen:

   ```bash
   sudo make -C /etc/mail
   sudo systemctl restart sendmail
   ```

#### Testing {#testing}

Lähetä testisähköposti varmistaaksesi konfiguraation:

```bash
echo "Test email from Sendmail" | mail -s "Sendmail Test" recipient@example.com
```

### Exim4 SMTP Relay Configuration {#exim4-smtp-relay-configuration}

Exim4 on suosittu MTA Debian-pohjaisissa järjestelmissä. Voit konfiguroida sen käyttämään Forward Emailia smarthostina.

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
    Tämä vaatii maksullisen tilauksen, jossa SMTP-käyttöoikeus on käytössä.
  </span>
</div>

#### Configuration {#configuration-1}

1. Käynnistä Exim4:n konfigurointityökalu:

   ```bash
   sudo dpkg-reconfigure exim4-config
   ```

2. Valitse seuraavat asetukset:
   * **Yleinen postin konfigurointityyppi:** posti lähetetään smarthostin kautta; vastaanotetaan SMTP:n tai fetchmailin kautta
   * **Järjestelmän postin nimi:** your.hostname
   * **IP-osoitteet, joilla kuunnellaan saapuvia SMTP-yhteyksiä:** 127.0.0.1 ; ::1
   * **Muut kohteet, joille posti hyväksytään:** (jätä tyhjäksi)
   * **Toimialueet, joille posti välitetään:** (jätä tyhjäksi)
   * **Lähtevän smarthostin IP-osoite tai isäntänimi:** smtp.forwardemail.net::465
   * **Piilota paikallinen postinimi lähtevässä postissa?** Ei
   * **Pidä DNS-kyselyjen määrä minimissä (Dial-on-Demand)?** Ei
   * **Paikallisen postin toimitustapa:** Mbox-muoto kansiossa /var/mail/
   * **Jaa konfiguraatio pieniin tiedostoihin?** Ei

3. Muokkaa `passwd.client` -tiedostoa lisätäksesi tunnuksesi:

   ```bash
   sudo nano /etc/exim4/passwd.client
   ```

4. Lisää seuraava rivi:

   ```
   smtp.forwardemail.net:your-alias@yourdomain.com:your-generated-password
   ```

5. Päivitä konfiguraatio ja käynnistä Exim4 uudelleen:

   ```bash
   sudo update-exim4.conf
   sudo systemctl restart exim4
   ```

#### Testing {#testing-1}

Lähetä testisähköposti:

```bash
echo "Test from Exim4" | mail -s "Exim4 Test" recipient@example.com
```

### msmtp SMTP Client Configuration {#msmtp-smtp-client-configuration}

msmtp on kevyt SMTP-asiakasohjelma, joka on hyödyllinen sähköpostien lähettämiseen skripteistä tai komentorivisovelluksista.

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Arvioitu asennusaika:</strong>
  <span>Alle 10 minuuttia</span>
</div>
<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tärkeää:
  </strong>
  <span>
    Tämä vaatii maksullisen tilauksen, jossa SMTP-käyttöoikeus on käytössä.
  </span>
</div>

#### Konfigurointi {#configuration-2}

1. Luo tai muokkaa msmtp-konfiguraatiotiedostoa sijainnissa `~/.msmtprc`:

   ```bash
   nano ~/.msmtprc
   ```

2. Lisää seuraava konfiguraatio:

   ```
   defaults
   auth           on
   tls            on
   tls_trust_file /etc/ssl/certs/ca-certificates.crt
   logfile        ~/.msmtp.log

   account        forwardemail
   host           smtp.forwardemail.net
   port           465
   tls_starttls   off
   from           your-alias@yourdomain.com
   user           your-alias@yourdomain.com
   password       your-generated-password

   account default : forwardemail
   ```

3. Aseta oikeat käyttöoikeudet konfiguraatiotiedostolle:

   ```bash
   chmod 600 ~/.msmtprc
   ```

#### Testaus {#testing-2}

Lähetä testisähköposti:

```bash
echo "This is a test email from msmtp" | msmtp -a default recipient@example.com
```

### Komentorivipohjaiset sähköpostiohjelmat {#command-line-email-clients}

Suositut komentorivipohjaiset sähköpostiohjelmat kuten [Mutt](https://gitlab.com/muttmua/mutt), [NeoMutt](https://neomutt.org) ja [Alpine](https://alpine.x10.mx/alpine/release/) voidaan konfiguroida käyttämään Forward Emailin SMTP-palvelimia sähköpostin lähettämiseen. Konfiguraatio on samanlainen kuin `msmtp`-asetuksessa, jossa annat SMTP-palvelimen tiedot ja tunnistetietosi vastaaviin konfiguraatiotiedostoihin (`.muttrc`, `.neomuttrc` tai `.pinerc`).

### Windowsin sähköpostikonfiguraatio {#windows-email-configuration}

Windows-käyttäjille voit konfiguroida suosittuja sähköpostiohjelmia kuten **Microsoft Outlook** ja **eM Client** käyttämällä Forward Email -tililtäsi löytyviä IMAP- ja SMTP-asetuksia. Komentorivikäyttöön tai skriptaamiseen voit käyttää PowerShellin `Send-MailMessage`-cmdlet-komentoa (vaikka se onkin vanhentunut) tai kevyttä SMTP-välitystyökalua kuten [E-MailRelay](https://github.com/graeme-walker/emailrelay).

### Postfix SMTP -välityskonfiguraatio {#postfix-smtp-relay-configuration}

Voit konfiguroida Postfixin välittämään sähköpostit Forward Emailin SMTP-palvelimien kautta. Tämä on hyödyllistä palvelinsovelluksille, jotka tarvitsevat lähettää sähköposteja.

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
    Tämä vaatii maksullisen tilauksen, jossa SMTP-käyttöoikeus on käytössä.
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

2. Asennuksen aikana valitse "Internet Site" kun sinulta kysytään konfiguraatiotyyppiä.

#### Konfigurointi {#configuration-3}

1. Muokkaa Postfixin pääkonfiguraatiotiedostoa:

```bash
sudo nano /etc/postfix/main.cf
```

2. Lisää tai muokkaa näitä asetuksia:

```
# SMTP-välityskonfiguraatio
relayhost = [smtp.forwardemail.net]:465
smtp_tls_wrappermode = yes
smtp_tls_security_level = encrypt
smtp_sasl_auth_enable = yes
smtp_sasl_password_maps = hash:/etc/postfix/sasl_passwd
smtp_sasl_security_options = noanonymous
smtp_tls_CAfile = /etc/ssl/certs/ca-certificates.crt
```

3. Luo SASL-salasanatiedosto:

```bash
sudo nano /etc/postfix/sasl_passwd
```

4. Lisää Forward Email -tunnuksesi:

```
[smtp.forwardemail.net]:465 your-alias@yourdomain.com:your-generated-password
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

#### Testaus {#testing-3}

Testaa konfiguraatiosi lähettämällä testisähköposti:

```bash
echo "Test email body" | mail -s "Test Subject" recipient@example.com
```

### Kuinka lähettää sähköpostia Gmailin kautta {#how-to-send-mail-as-using-gmail}
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
    Jos olet noudattanut yllä olevia ohjeita kohdassa <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">Kuinka aloitan ja asetan sähköpostin edelleenlähetyksen</a>, voit jatkaa lukemista alla.
  </span>
</div>

<div id="send-mail-as-content">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tärkeää:
  </strong>
  <span>
    Varmistathan, että olet lukenut <a href="/terms" class="alert-link" target="_blank">Käyttöehdot</a>, <a href="/privacy" class="alert-link" target="_blank">Tietosuojakäytännön</a> ja <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Lähtevien SMTP-rajat</a> &ndash; palvelun käyttö tarkoittaa hyväksyntää ja sopimusta.
  </span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tärkeää:
  </strong>
  <span>
    Jos olet kehittäjä, tutustu <a class="alert-link" href="/email-api#outbound-emails" target="_blank">sähköpostin API-dokumentaatioomme</a>.
  </span>
</div>

1. Mene osoitteeseen <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Oma tili <i class="fa fa-angle-right"></i> Domainit</a> <i class="fa fa-angle-right"></i> Asetukset <i class="fa fa-angle-right"></i> Lähtevän SMTP:n asetukset ja seuraa asennusohjeita

2. Luo uusi alias domainillesi kohdassa <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Oma tili <i class="fa fa-angle-right"></i> Domainit</a> <i class="fa fa-angle-right"></i> Aliakset (esim. <code><hello@example.com></code>)

3. Klikkaa <strong class="text-success"><i class="fa fa-key"></i> Luo salasana</strong> juuri luodun aliaksen vieressä. Kopioi salasana leikepöydälle ja säilytä se turvallisesti.

4. Mene [Gmailiin](https://gmail.com) ja kohdassa [Asetukset <i class="fa fa-angle-right"></i> Tilit ja tuonti <i class="fa fa-angle-right"></i> Lähetä sähköpostia nimellä](https://mail.google.com/mail/u/0/#settings/accounts), klikkaa "Lisää toinen sähköpostiosoite"

5. Kun sinulta kysytään "Nimi", kirjoita nimi, jonka haluat näkyvän lähettäjänä (esim. "Linus Torvalds").

6. Kun sinulta kysytään "Sähköpostiosoite", kirjoita täydellinen sähköpostiosoite aliaksesta, jonka loit kohdassa <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Oma tili <i class="fa fa-angle-right"></i> Domainit</a> <i class="fa fa-angle-right"></i> Aliakset (esim. <code><hello@example.com></code>)

7. Poista valinta kohdasta "Kohdellaan aliasosoitteena"

8. Klikkaa "Seuraava vaihe" jatkaaksesi

9. Kun sinulta kysytään "SMTP-palvelin", kirjoita <code>smtp.forwardemail.net</code> ja vaihda portiksi <code>465</code>

10. Kun sinulta kysytään "Käyttäjätunnus", kirjoita täydellinen sähköpostiosoite aliaksesta, jonka loit kohdassa <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Oma tili <i class="fa fa-angle-right"></i> Domainit</a> <i class="fa fa-angle-right"></i> Aliakset (esim. <code><hello@example.com></code>)

11. Kun sinulta kysytään "Salasana", liitä salasana, jonka sait kohdassa 3 <strong class="text-success"><i class="fa fa-key"></i> Luo salasana</strong>

12. Valitse valintanappi "Suojattu yhteys SSL:llä"

13. Klikkaa "Lisää tili" jatkaaksesi

14. Avaa uusi välilehti [Gmailissa](https://gmail.com) ja odota vahvistussähköpostin saapumista (saat vahvistuskoodin, joka varmistaa, että olet sähköpostiosoitteen omistaja, jolta yrität lähettää sähköpostia)

15. Kun se saapuu, kopioi ja liitä vahvistuskoodi kehotteeseen, jonka sait edellisessä vaiheessa
16. Kun olet tehnyt tämän, palaa sähköpostiin ja klikkaa linkkiä "vahvista pyyntö". Todennäköisesti sinun täytyy tehdä tämä vaihe ja edellinen vaihe, jotta sähköposti konfiguroidaan oikein.

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Onnittelut!
    </strong>
    <span>
      Olet onnistuneesti suorittanut kaikki vaiheet.
    </span>
  </div>
</div>

</div>

### Mikä on perinteetön opas Send Mail As -toiminnon käyttöön Gmaililla {#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail}

<div class="alert my-3 alert-danger"><i class="fa fa-stop-circle font-weight-bold"></i> <strong class="font-weight-bold">Tärkeää:</strong> Tämä perinteetön opas on vanhentunut toukokuusta 2023 lähtien, koska <a class="alert-link" href="/faq#do-you-support-sending-email-with-smtp">tuemme nyt lähtevää SMTP:tä</a>. Jos käytät alla olevaa opasta, <a class="alert-link" href="/faq#can-i-remove-the-via-forwardemail-dot-net-in-gmail">tämä saa lähtevän sähköpostisi</a> näyttämään Gmailissa "<span class="notranslate text-danger font-weight-bold">via forwardemail dot net</span>" -merkinnän.</a></div>

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
    Jos olet seurannut yllä olevia ohjeita kohdassa <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">Miten aloitan ja asetan sähköpostin edelleenlähetyksen</a>, voit jatkaa lukemista alla.
  </span>
</div>

<div class="mx-auto lazyframe lazyframe-bordered border border-themed mb-3" data-vendor="youtube_nocookie" title="How to Send Mail As using Gmail" data-src="https://www.youtube-nocookie.com/embed/MEheS8gM4Xs?autoplay=0"></div>

<div id="legacy-free-guide">

1. Sinulla täytyy olla käytössä [Gmailin kaksivaiheinen tunnistautuminen][gmail-2fa] tämän toiminnan mahdollistamiseksi. Käy osoitteessa <https://www.google.com/landing/2step/> jos et ole ottanut sitä käyttöön.

2. Kun kaksivaiheinen tunnistautuminen on käytössä (tai jos se oli jo käytössä), käy osoitteessa <https://myaccount.google.com/apppasswords>.

3. Kun sinua pyydetään valitsemaan "Valitse sovellus ja laite, jolle haluat luoda sovellussalasanan":
   * Valitse "Mail" avattavasta valikosta "Valitse sovellus"
   * Valitse "Muu" avattavasta valikosta "Valitse laite"
   * Kun sinua pyydetään tekstisyötettä, kirjoita mukautetun domainisi sähköpostiosoite, josta edelleenlähetät (esim. <code><hello@example.com></code> - tämä auttaa sinua seuraamaan, jos käytät tätä palvelua useammalle tilille)

4. Kopioi automaattisesti luotu salasana leikepöydällesi
   <div class="alert my-3 alert-warning">
     <i class="fa fa-exclamation-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tärkeää:
     </strong>
     <span>
       Jos käytät G Suitea, käy ylläpitäjän hallintapaneelissa <a class="alert-link" href="https://admin.google.com/AdminHome#ServiceSettings/service=email&subtab=filters" rel="noopener noreferrer" target="_blank">Sovellukset <i class="fa fa-angle-right"></i> G Suite <i class="fa fa-angle-right"></i> Gmailin asetukset <i class="fa fa-angle-right"></i> Asetukset</a> ja varmista, että "Salli käyttäjien lähettää sähköpostia ulkoisen SMTP-palvelimen kautta..." on valittuna. Muutoksen aktivoitumisessa voi kestää hetki, joten odota muutama minuutti.
     </span>
   </div>

5. Mene [Gmailiin](https://gmail.com) ja valitse [Asetukset <i class="fa fa-angle-right"></i> Tilit ja tuonti <i class="fa fa-angle-right"></i> Lähetä sähköpostia nimellä](https://mail.google.com/mail/u/0/#settings/accounts), klikkaa "Lisää toinen sähköpostiosoite"

6. Kun sinua pyydetään "Nimi", kirjoita nimi, jonka haluat näkyvän lähettäjänä (esim. "Linus Torvalds")

7. Kun sinua pyydetään "Sähköpostiosoite", kirjoita mukautetun domainisi sähköpostiosoite, jonka käytit yllä (esim. <code><hello@example.com></code>)
8. Poista valinta kohdasta "Treat as an alias"

9. Napsauta "Next Step" jatkaaksesi

10. Kun sinulta kysytään "SMTP Server", kirjoita <code>smtp.gmail.com</code> ja jätä portti <code>587</code> arvoksi

11. Kun sinulta kysytään "Username", kirjoita Gmail-osoitteesi osa ilman <span>gmail.com</span> osaa (esim. pelkkä "user", jos sähköpostiosoitteeni on <span><user@gmail.com></span>)
    <div class="alert my-3 alert-primary">
      <i class="fa fa-info-circle font-weight-bold"></i>
      <strong class="font-weight-bold">
        Tärkeää:
      </strong>
      <span>
        Jos "Username" -kenttä täytetään automaattisesti, <u><strong>sinun tulee muuttaa se</strong></u> Gmail-osoitteesi käyttäjänimeksi.
      </span>
    </div>

12. Kun sinulta kysytään "Password", liitä leikepöydältäsi vaiheessa 2 luomasi salasana

13. Jätä valinta kohtaan "Secured connection using TLS"

14. Napsauta "Add Account" jatkaaksesi

15. Avaa uusi välilehti [Gmail](https://gmail.com) ja odota vahvistussähköpostin saapumista (saat vahvistuskoodin, joka varmistaa, että olet sähköpostiosoitteen omistaja, josta yrität "Send Mail As")

16. Kun se saapuu, kopioi ja liitä vahvistuskoodi aiemmassa vaiheessa saamallasi kehotteella

17. Kun olet tehnyt tämän, palaa sähköpostiin ja napsauta linkkiä "confirm the request". Todennäköisesti sinun täytyy tehdä tämä vaihe ja edellinen vaihe, jotta sähköposti konfiguroituu oikein.

</div>

### Advanced Gmail Routing Configuration {#advanced-gmail-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Arvioitu asennusaika:</strong>
  <span>15-30 minuuttia</span>
</div>

Jos haluat määrittää edistyneen reitityksen Gmailissa niin, että aliasosoitteet, jotka eivät vastaa postilaatikkoa, ohjautuvat Forward Emailin sähköpostipalvelimille, toimi seuraavasti:

1. Kirjaudu Google Admin -konsoliin osoitteessa [admin.google.com](https://admin.google.com)
2. Siirry kohtaan **Apps → Google Workspace → Gmail → Routing**
3. Napsauta **Add Route** ja määritä seuraavat asetukset:

**Yksittäisen vastaanottajan asetukset:**

* Valitse "Change envelope recipient" ja kirjoita ensisijainen Gmail-osoitteesi
* Valitse "Add X-Gm-Original-To header with original recipient"

**Kuoren vastaanottajamallit:**

* Lisää malli, joka vastaa kaikkia olemattomia postilaatikoita (esim. `.*@yourdomain.com`)

**Sähköpostipalvelimen asetukset:**

* Valitse "Route to host" ja kirjoita ensisijaiseksi palvelimeksi `mx1.forwardemail.net`
* Lisää varapalvelimeksi `mx2.forwardemail.net`
* Aseta portiksi 25
* Valitse turvallisuudeksi "Require TLS"

4. Napsauta **Save** luodaksesi reitin

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tärkeää:
  </strong>
  <span>
    Tämä konfiguraatio toimii vain Google Workspace -tileillä, joilla on omat verkkotunnukset, ei tavallisilla Gmail-tileillä.
  </span>
</div>

### Advanced Outlook Routing Configuration {#advanced-outlook-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Arvioitu asennusaika:</strong>
  <span>15-30 minuuttia</span>
</div>

Microsoft 365 (entinen Office 365) -käyttäjille, jotka haluavat määrittää edistyneen reitityksen niin, että aliasosoitteet, jotka eivät vastaa postilaatikkoa, ohjautuvat Forward Emailin sähköpostipalvelimille:

1. Kirjaudu Microsoft 365 -hallintakeskukseen osoitteessa [admin.microsoft.com](https://admin.microsoft.com)
2. Siirry kohtaan **Exchange → Mail flow → Rules**
3. Napsauta **Add a rule** ja valitse **Create a new rule**
4. Nimeä sääntö (esim. "Forward non-existent mailboxes to Forward Email")
5. Kohdassa **Apply this rule if**, valitse:
   * "The recipient address matches..."
   * Kirjoita malli, joka vastaa kaikkia osoitteita verkkotunnuksessasi (esim. `*@yourdomain.com`)
6. Kohdassa **Do the following**, valitse:
   * "Redirect the message to..."
   * Valitse "The following mail server"
   * Kirjoita `mx1.forwardemail.net` ja portti 25
   * Lisää varapalvelimeksi `mx2.forwardemail.net`
7. Kohdassa **Except if**, valitse:
   * "The recipient is..."
   * Lisää kaikki olemassa olevat postilaatikkosi, joita ei tule ohjata
8. Aseta säännön prioriteetti niin, että se suoritetaan muiden postivirran sääntöjen jälkeen
9. Napsauta **Save** aktivoidaksesi säännön
## Vianmääritys {#troubleshooting}

### Miksi en vastaanota testisähköposteja {#why-am-i-not-receiving-my-test-emails}

Jos lähetät testisähköpostin itsellesi, se ei välttämättä näy postilaatikossasi, koska sillä on sama "Message-ID" -otsake.

Tämä on laajalti tunnettu ongelma, ja se vaikuttaa myös palveluihin kuten Gmail.  <a href="https://support.google.com/a/answer/1703601">Tässä on virallinen Gmailin vastaus tähän ongelmaan</a>.

Jos ongelmat jatkuvat, kyseessä on todennäköisesti DNS:n leviämisongelma. Sinun täytyy odottaa hieman pidempään ja yrittää uudelleen (tai kokeilla asettaa pienempi TTL-arvo <strong class="notranslate">TXT</strong>-tietueillesi).

**Ongelmia edelleen?**  Ole hyvä ja <a href="/help">ota meihin yhteyttä</a>, jotta voimme auttaa tutkimaan ongelmaa ja löytämään nopean ratkaisun.

### Kuinka määritän sähköpostiohjelmani toimimaan Forward Emailin kanssa {#how-do-i-configure-my-email-client-to-work-with-forward-email}

<div class="mb-3">
  Palvelumme toimii suosittujen sähköpostiohjelmien kanssa, kuten:
  <ul class="ml-1 h4 d-inline list-inline mb-0 pl-0">
    <li class="list-inline-item"><a href="/blog/open-source/apple-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Apple&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/windows-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Windows&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/android-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-android"></i> Android&trade;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/linux-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-linux"></i> Linux&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/desktop-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fas fa-desktop"></i> Työpöytä</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/mozilla-firefox-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-firefox-browser"></i> Mozilla Firefox&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/safari-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Safari&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/google-chrome-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-chrome"></i> Google Chrome&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/terminal-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fas fa-terminal"></i> Terminal</a></li>
  </ul>
</div>

<div class="alert alert-primary">
  Käyttäjätunnuksesi on aliaksesi sähköpostiosoite ja salasana on <strong class="text-success"><i class="fa fa-key"></i> Generate Password</strong> ("Normaali salasana").
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Vinkki:
  </strong>
  <span>Jos käytät Thunderbirdiä, varmista että "Yhteyden suojaus" on asetettu "SSL/TLS" ja Todennusmenetelmä on asetettu "Normaali salasana".</span>
</div>

| Tyyppi |         Isäntänimi        |         Protokolla        |                                            Portit                                           |
| :----: | :-----------------------: | :-----------------------: | :----------------------------------------------------------------------------------------: |
| IMAP   | `imap.forwardemail.net`    |  SSL/TLS **Suositeltu**   |                                      `993` ja `2993`                                      |
| SMTP   | `smtp.forwardemail.net`    | SSL/TLS **Suositeltu**    | `465` ja `2465` SSL/TLS:lle (suositeltu) tai `587`, `2587`, `2525` ja `25` STARTTLS:lle |

### Miksi sähköpostini päätyvät Roskapostiin ja roskakansioon ja kuinka voin tarkistaa domainini maineen {#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation}
Tämä osio opastaa sinua, jos lähtevä sähköpostisi käyttää meidän SMTP-palvelimiamme (esim. `smtp.forwardemail.net`) (tai välitetään `mx1.forwardemail.net` tai `mx2.forwardemail.net` kautta) ja se toimitetaan vastaanottajien Roskaposti- tai Roska-kansioon.

Seuraamme säännöllisesti [IP-osoitteitamme](#what-are-your-servers-ip-addresses) vastaan [kaikkia luotettavia DNS-estolistoja](#how-do-you-handle-your-ip-addresses-becoming-blocked), **siksi kyseessä on todennäköisesti domain-maineeseen liittyvä ongelma**.

Sähköpostit voivat päätyä roskapostikansioihin useista syistä:

1. **Todentamisen puute**: Määritä [SPF](#how-do-i-set-up-spf-for-forward-email), [DKIM](#how-do-i-set-up-dkim-for-forward-email) ja [DMARC](#how-do-i-set-up-dmarc-for-forward-email) -tietueet.

2. **Domain-maine**: Uusilla domaineilla on usein neutraali maine, kunnes ne ovat luoneet lähetyshistorian.

3. **Sisältöön liittyvät laukaisimet**: Tietyt sanat tai lauseet voivat laukaista roskapostisuodattimet.

4. **Lähetyskäytännöt**: Äkilliset sähköpostimäärän kasvut voivat näyttää epäilyttäviltä.

Voit kokeilla käyttää yhtä tai useampaa näistä työkaluista tarkistaaksesi domainisi maineen ja luokituksen:

#### Maineen ja estolistojen tarkistustyökalut {#reputation-and-blocklist-check-tools}

| Työkalun nimi                              | URL                                                          | Tyyppi                 |
| ------------------------------------------ | ------------------------------------------------------------ | ---------------------- |
| Cloudflare Domain Categorization Feedback  | <https://radar.cloudflare.com/domains/feedback>              | Luokittelu             |
| Spamhaus IP and Domain Reputation Checker  | <https://check.spamhaus.org/>                                | DNSBL                  |
| Cisco Talos IP and Domain Reputation Center| <https://talosintelligence.com/reputation_center>            | Maine                  |
| Barracuda IP and Domain Reputation Lookup  | <https://www.barracudacentral.org/lookups/lookup-reputation> | DNSBL                  |
| MX Toolbox Blacklist Check                 | <https://mxtoolbox.com/blacklists.aspx>                      | Musta lista            |
| Google Postmaster Tools                    | <https://www.gmail.com/postmaster/>                          | Maine                  |
| Yahoo Sender Hub                           | <https://senders.yahooinc.com/>                              | Maine                  |
| MultiRBL.valli.org Blacklist Check         | <https://multirbl.valli.org/lookup/>                         | DNSBL                  |
| Sender Score                               | <https://senderscore.org/act/blocklist-remover/>             | Maine                  |
| Invaluement                                | <https://www.invaluement.com/lookup/>                        | DNSBL                  |
| SURBL                                      | <https://www.surbl.org/>                                     | DNSBL                  |
| SpamCop                                    | <https://www.spamcop.net/bl.shtml>                           | DNSBL                  |
| UCEPROTECT's Levels 1, 2, and 3            | <https://www.uceprotect.net/en/rblcheck.php>                 | DNSBL                  |
| UCEPROTECT's backscatterer.org             | <https://www.backscatterer.org/>                             | Backscatter-suojaus    |
| UCEPROTECT's whitelisted.org               | <https://www.whitelisted.org/> (vaatii maksun)               | DNSWL                  |

#### IP-osoitteen poistopyyntölomakkeet palveluntarjoajittain {#ip-removal-request-forms-by-provider}

Jos IP-osoitteesi on estetty tietyn sähköpostipalveluntarjoajan toimesta, käytä asianmukaista poistopyyntölomaketta tai ota yhteyttä alla olevan listan mukaisesti:

| Palveluntarjoaja                        | Poistopyyntölomake / Yhteystiedot                                                                                  | Huomautukset                                  |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| Google/Gmail                          | <https://support.google.com/mail/contact/bulk_send_new>                                                           | Massalähettäjän yhteydenottolomake            |
| Microsoft (Outlook/Office 365/Hotmail) | <https://sender.office.com>                                                                                         | Office 365 IP-poistopalvelu                    |
| Yahoo/AOL/Verizon                     | <https://senders.yahooinc.com/>                                                                                     | Yahoo Sender Hub                              |
| Apple/iCloud                          | <https://ipcheck.proofpoint.com/>                                                                                   | Apple käyttää Proofpointia IP-maineeseen       |
| Proofpoint                          | <https://ipcheck.proofpoint.com/>                                                                                   | Proofpoint IP-tarkistus ja poisto              |
| Barracuda Networks                    | <https://www.barracudacentral.org/lookups/lookup-reputation>                                                        | Barracuda maineen tarkistus ja poisto          |
| Cloudmark                           | <https://csi.cloudmark.com/en/reset/>                                                                               | Cloudmark CSI reset -pyyntö                    |
| GoDaddy/SecureServer                  | <https://unblock.secureserver.net>                                                                                  | GoDaddy IP-poistopyyntölomake                  |
| Comcast/Xfinity                     | <https://spa.xfinity.com/report>                                                                                    | Comcast IP-poistopyyntö                        |
| Charter/Spectrum                    | <https://www.spectrum.net/support/internet/understanding-email-error-codes>                                         | Ota yhteyttä Spectrumin tukeen poistoa varten |
| AT&T                                  | `abuse_rbl@abuse-att.net`                                                                                           | Sähköposti poistopyyntöä varten                |
| Cox Communications                  | `unblock.request@cox.net`                                                                                            | Sähköposti poistopyyntöä varten                |
| CenturyLink/Lumen                   | `abuse@centurylink.com`                                                                                             | Käyttää Cloudfilteriä                          |
| Windstream                          | `abuse@windstream.net`                                                                                              | Sähköposti poistopyyntöä varten                |
| t-online.de (Saksa)                 | `tobr@rx.t-online.de`                                                                                                | Sähköposti poistopyyntöä varten                |
| Orange France                      | <https://postmaster.orange.fr/>                                                                                      | Käytä yhteydenottolomaketta tai sähköpostia `abuse@orange.fr` |
| GMX                                 | <https://postmaster.gmx.net/en/contact>                                                                              | GMX postmaster-yhteydenottolomake              |
| Mail.ru                             | <https://postmaster.mail.ru/>                                                                                        | Mail.ru postmaster-portaali                    |
| Yandex                             | <https://postmaster.yandex.ru/>                                                                                      | Yandex postmaster-portaali                     |
| QQ Mail (Tencent)                  | <https://open.mail.qq.com/>                                                                                          | QQ Mailin valkoinen lista -hakemus (kiina)     |
| Netease (163.com)                  | <https://mail.163.com/postmaster/>                                                                                   | Netease postmaster-portaali                    |
| Alibaba/Aliyun/HiChina             | <https://www.alibabacloud.com/help/en/alibaba-mail/>                                                                | Ota yhteyttä Alibaba Cloud -konsolin kautta    |
| Amazon SES                        | <https://docs.aws.amazon.com/ses/latest/dg/faqs-dnsbls.html>                                                        | AWS SES -konsoli > Mustan listan poisto        |
| SendGrid                          | <https://support.sendgrid.com/>                                                                                      | Ota yhteyttä SendGridin tukeen                 |
| Mimecast                          | <https://community.mimecast.com/>                                                                                    | Käyttää kolmannen osapuolen RBL-listoja - ota yhteyttä kyseiseen RBL:ään |
| Fastmail                          | <https://www.fastmail.com/support/>                                                                                  | Ota yhteyttä Fastmailin tukeen                 |
| Zoho                              | <https://help.zoho.com/portal/en/kb/campaigns/faqs/campaign-review/articles/how-do-i-delist-my-ip-address>           | Ota yhteyttä Zohon tukeen                       |
| ProtonMail                       | <https://proton.me/support/contact>                                                                                  | Ota yhteyttä Protonin tukeen                    |
| Tutanota                         | <https://tutanota.com/support>                                                                                       | Ota yhteyttä Tutanotan tukeen                   |
| Hushmail                        | <https://www.hushmail.com/support/>                                                                                  | Ota yhteyttä Hushmailin tukeen                  |
| Mailbox.org                     | <https://mailbox.org/en/support>                                                                                     | Ota yhteyttä Mailbox.orgin tukeen               |
| Posteo                          | <https://posteo.de/en/site/contact>                                                                                   | Ota yhteyttä Posteon tukeen                      |
| DuckDuckGo Email                | <https://duckduckgo.com/email/support>                                                                                | Ota yhteyttä DuckDuckGo:n tukeen                 |
| Sonic.net                      | <https://www.sonic.com/support>                                                                                       | Ota yhteyttä Sonic-tukeen                        |
| Telus                          | <https://www.telus.com/en/support>                                                                                    | Ota yhteyttä Telusin tukeen                       |
| Vodafone Germany               | <https://www.vodafone.de/hilfe/>                                                                                      | Ota yhteyttä Vodafone-tukeen                     |
| Xtra (Spark NZ)                | <https://www.spark.co.nz/help/>                                                                                       | Ota yhteyttä Spark NZ:n tukeen                   |
| UOL/BOL (Brasilia)             | <https://ajuda.uol.com.br/>                                                                                           | Ota yhteyttä UOL:n tukeen (portugali)            |
| Libero (Italia)                | <https://aiuto.libero.it/>                                                                                            | Ota yhteyttä Liberon tukeen (italia)             |
| Telenet (Belgia)               | <https://www2.telenet.be/en/support/>                                                                                 | Ota yhteyttä Telenetin tukeen                     |
| Facebook/WhatsApp              | <https://www.facebook.com/business/help>                                                                              | Ota yhteyttä Facebookin yritystukeen             |
| LinkedIn                      | <https://www.linkedin.com/help/linkedin>                                                                              | Ota yhteyttä LinkedInin tukeen                    |
| Groups.io                     | <https://groups.io/helpcenter>                                                                                        | Ota yhteyttä Groups.io:n tukeen                   |
| Earthlink/Vade Secure         | <https://sendertool.vadesecure.com/en/>                                                                               | Vade Secure lähettäjätyökalu                      |
| Cloudflare Email Security     | <https://www.cloudflare.com/products/zero-trust/email-security/>                                                    | Ota yhteyttä Cloudflaren tukeen                   |
| Hornetsecurity/Expurgate      | <https://www.hornetsecurity.com/>                                                                                     | Ota yhteyttä Hornetsecurityn tukeen               |
| SpamExperts/Antispamcloud     | <https://www.spamexperts.com/>                                                                                        | Ota yhteyttä hosting-palveluntarjoajan kautta    |
| Mail2World                   | <https://www.mail2world.com/support/>                                                                                 | Ota yhteyttä Mail2Worldin tukeen                  |
> \[!TIP]
> Aloita pienellä määrällä korkealaatuisia sähköposteja rakentaaksesi positiivisen maineen ennen suurempien määrien lähettämistä.

> \[!IMPORTANT]
> Jos verkkotunnuksesi on mustalla listalla, jokaisella mustalla listalla on oma poistoprosessinsa. Tarkista heidän verkkosivuiltaan ohjeet.

> \[!TIP]
> Jos tarvitset lisäapua tai huomaat, että meidät on virheellisesti merkitty roskapostiksi tietyn sähköpostipalveluntarjoajan toimesta, ota <a href="/help">yhteyttä meihin</a>.

### Mitä minun pitäisi tehdä, jos saan roskapostia {#what-should-i-do-if-i-receive-spam-emails}

Sinun tulisi peruuttaa tilaus sähköpostilistalta (jos mahdollista) ja estää lähettäjä.

Älä ilmoita viestiä roskapostiksi, vaan lähetä se sen sijaan manuaalisesti valvottuun ja yksityisyyttä kunnioittavaan väärinkäytösten estojärjestelmäämme.

**Sähköpostiosoite, johon roskapostia voi lähettää, on:** <abuse@forwardemail.net>

### Miksi testisähköpostini, jotka lähetän itselleni Gmailissa, näkyvät "epäilyttävinä" {#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious}

Jos näet tämän virheilmoituksen Gmailissa, kun lähetät testin itsellesi, tai kun henkilö, jolle lähetät sähköpostia aliaksellasi, näkee sinulta tulevan sähköpostin ensimmäistä kertaa, **älä huoli** – tämä on Gmailin sisäänrakennettu turvallisuusominaisuus.

Voit yksinkertaisesti klikata "Näyttää turvalliselta". Esimerkiksi, jos lähettäisit testiviestin käyttäen "lähetä sähköpostina" -toimintoa (jollekin muulle), he eivät näe tätä viestiä.

Jos he kuitenkin näkevät tämän viestin, se johtuu siitä, että he ovat tottuneet näkemään sähköpostisi tulevan osoitteesta <john@gmail.com> eikä <john@customdomain.com> (vain esimerkki). Gmail varoittaa käyttäjiä varmistaakseen, että kaikki on turvallista, eikä tähän ole kiertotietä.

### Voinko poistaa "via forwardemail dot net" Gmailissa {#can-i-remove-the-via-forwardemail-dot-net-in-gmail}

Tämä aihe liittyy [laajalti tunnettuun ongelmaan Gmailissa, jossa lähettäjän nimen viereen ilmestyy lisätietoja](https://support.google.com/mail/answer/1311182).

Toukokuusta 2023 lähtien tuemme sähköpostin lähettämistä SMTP:n kautta lisäominaisuutena kaikille maksaville käyttäjille – mikä tarkoittaa, että voit poistaa <span class="notranslate">via forwardemail dot net</span> Gmailissa.

Huomaa, että tämä UKK-aihe koskee erityisesti niitä, jotka käyttävät [Miten lähettää sähköpostia Gmailin kautta](#how-to-send-mail-as-using-gmail) -toimintoa.

Katso ohjeet kohdasta [Tuetteko sähköpostin lähettämistä SMTP:llä](#do-you-support-sending-email-with-smtp).

## Tietojen hallinta {#data-management}

### Missä palvelimenne sijaitsevat {#where-are-your-servers-located}

> \[!TIP]
> Saatamme pian ilmoittaa EU:n datakeskuksemme sijainnin, joka sijaitsee [forwardemail.eu](https://forwardemail.eu) -palvelun alla. Tilaa keskustelu osoitteessa <https://github.com/orgs/forwardemail/discussions/336> saadaksesi päivityksiä.

Palvelimemme sijaitsevat pääasiassa Denverissä, Coloradossa – katso täydellinen IP-osoitelistamme osoitteesta <https://forwardemail.net/ips>.

Voit lukea alihankkijoistamme GDPR- (/gdpr), DPA- (/dpa) ja Tietosuojakäytäntö- (/privacy) sivuillamme.

### Kuinka voin viedä ja varmuuskopioida postilaatikkoni {#how-do-i-export-and-backup-my-mailbox}

Voit milloin tahansa viedä postilaatikkosi [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions), [Mbox](https://en.wikipedia.org/wiki/Mbox) tai salatuissa [SQLite](https://en.wikipedia.org/wiki/SQLite) -muodoissa.

Mene osoitteeseen <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Oma tili <i class="fa fa-angle-right"></i> Verkkotunnukset</a> <i class="fa fa-angle-right"></i> Aliakset <i class="fa fa-angle-right"></i> Lataa varmuuskopio ja valitse haluamasi vientimuoto.

Saat sähköpostitse linkin vientitiedoston lataamista varten, kun vienti on valmis.

Huomaa, että tämä vientilatauslinkki vanhenee 4 tunnin kuluttua turvallisuussyistä.

Jos sinun tarvitsee tarkastella vietyjä EML- tai Mbox-muotoja, nämä avoimen lähdekoodin työkalut voivat olla hyödyllisiä:

| Nimi            | Muoto | Alusta       | GitHub-URL                                         |
| --------------- | :----:| ------------ | ------------------------------------------------- |
| MBox Viewer     |  Mbox | Windows      | <https://github.com/eneam/mboxviewer>             |
| mbox-web-viewer |  Mbox | Kaikki alustat | <https://github.com/PHMRanger/mbox-web-viewer>    |
| EmlReader       |   EML | Windows      | <https://github.com/ayamadori/EmlReader>          |
| Email viewer    |   EML | VSCode       | <https://github.com/joelharkes/vscode_email_viewer> |
| eml-reader      |   EML | Kaikki alustat | <https://github.com/s0ph1e/eml-reader>            |
Lisäksi, jos sinun tarvitsee muuntaa Mbox-tiedosto EML-tiedostoksi, voit käyttää <https://github.com/noelmartinon/mboxzilla>.

### Kuinka tuon ja siirrän olemassa olevan postilaatikkoni {#how-do-i-import-and-migrate-my-existing-mailbox}

Voit helposti tuoda sähköpostisi Forward Emailiin (esim. käyttämällä [Thunderbirdiä](https://www.thunderbird.net)) alla olevien ohjeiden avulla:

<div class="alert alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tärkeää:
  </strong>
  <span>
    Sinun on noudatettava kaikkia seuraavia vaiheita tuodaksesi olemassa olevan sähköpostisi.
  </span>
</div>

1. Vie sähköpostisi nykyiseltä sähköpostipalveluntarjoajaltasi:

   | Sähköpostipalveluntarjoaja | Vientimuoto                                  | Viennin ohjeet                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
   | -------------------------- | -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | Gmail                     | MBOX                                         | <https://takeout.google.com/settings/takeout/custom/gmail>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
   | Outlook                   | PST                                          | <div class="alert my-3 alert-danger"><i class="fa fa-info-circle font-weight-bold"></i> <strong class="font-weight-bold">Vinkki:</strong> <span>Jos käytät Outlookia (<a href="https://support.microsoft.com/en-us/office/back-up-your-email-e5845b0b-1aeb-424f-924c-aa1c33b18833#:~:text=Select%20File%20%3E%20Open%20%26%20Export%20%3E,back%20up%20and%20select%20Next." class="alert-link">PST-vientimuoto</a>), voit yksinkertaisesti noudattaa alla "Muut" -kohdan ohjeita. Olemme kuitenkin tarjonneet alla linkkejä PST:n muuntamiseksi MBOX/EML-muotoon käyttöjärjestelmäsi mukaan:<ul class="mb-0 mt-3"><li><a class="alert-link" href="https://github.com/BaselineIT/Zinkuba/releases/download/release-1.2/Zinkuba.App.exe">Zinkuba Windowsille</a> (<a class="alert-link" href="https://github.com/BaselineIT/Zinkuba?tab=readme-ov-file#zinkuba">GitHub</a>)</li><li><a class="alert-link" href="https://cygwin.com/packages/summary/readpst.html">readpst Windowsin cygwinille</a> – (esim. <code>readpst -u -o $OUT_DIR $IN_DIR</code> korvaten <code>$OUT_DIR</code> ja <code>$IN_DIR</code> tulostuskansion ja syötekansion poluilla).</li><li><a class="alert-link" href="https://manpages.ubuntu.com/manpages/trusty/man1/readpst.1.html">readpst Ubuntulle/Linuxille</a> – (esim. <code>sudo apt-get install readpst</code> ja sitten <code>readpst -u -o $OUT_DIR $IN_DIR</code>, korvaten <code>$OUT_DIR</code> ja <code>$IN_DIR</code> tulostuskansion ja syötekansion poluilla).</li><li><a class="alert-link" href="https://formulae.brew.sh/formula/libpst">readpst macOS:lle (brew:n kautta)</a> – (esim. <code>brew install libpst</code> ja sitten <code>readpst -u -o $OUT_DIR $IN_DIR</code>, korvaten <code>$OUT_DIR</code> ja <code>$IN_DIR</code> tulostuskansion ja syötekansion poluilla).</li><li><a class="alert-link" href="https://github.com/juanirm/pst-converter/tree/master?tab=readme-ov-file#pst-converter">PST Converter Windowsille (GitHub)</a></li></ul><br /></span></div> |
   | Apple Mail                | MBOX                                         | <https://support.apple.com/guide/mail/import-or-export-mailboxes-mlhlp1030/mac#apd37a3190755974>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
   | Fastmail                  | EML                                          | <https://www.fastmail.help/hc/en-us/articles/360060590573-Download-all-your-data#downloadmail>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
   | Proton Mail               | MBOX/EML                                     | <https://proton.me/support/export-emails-import-export-app>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
   | Tutanota                  | EML                                          | <https://github.com/crepererum-oss/tatutanatata>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
   | Gandi                     | EML                                          | <https://docs.gandi.net/en/gandimail/common_operations/backup_email.html#contents>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
   | Zoho                      | EML                                          | <https://www.zoho.com/mail/help/import-export-emails.html#alink2>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
   | Muut                      | [Käytä Thunderbirdiä](https://www.thunderbird.net) | Määritä olemassa oleva sähköpostitilisi Thunderbirdissä ja käytä sitten [ImportExportTools NG](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/) -lisäosaa sähköpostisi viemiseen ja tuomiseen.  **Saatat myös pystyä yksinkertaisesti kopioimaan/liittämään tai vetämään ja pudottamaan sähköposteja tililtä toiselle.**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
2. Lataa, asenna ja avaa [Thunderbird](https://www.thunderbird.net).

3. Luo uusi tili käyttämällä aliaksesi koko sähköpostiosoitetta (esim. <code><you@yourdomain.com></code>) ja luomaasi salasanaa.  <strong>Jos sinulla ei vielä ole luotua salasanaa, niin <a href="/faq#do-you-support-receiving-email-with-imap" target="_blank">katso asennusohjeemme</a></strong>.

4. Lataa ja asenna [ImportExportTools NG](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/) Thunderbird-laajennus.

5. Luo Thunderbirdiin uusi paikallinen kansio, napsauta sitä sitten hiiren oikealla → valitse `ImportExportTools NG` -vaihtoehto → valitse `Import mbox file` (MBOX-vientimuodolle) – tai – `Import messages` / `Import all messages from a directory` (EML-vientimuodolle).

6. Vedä/pudota paikallisesta kansiosta uusiin (tai olemassa oleviin) IMAP-kansioihin Thunderbirdissä, joihin haluat ladata viestejä IMAP-tallennustilaan palvelumme kanssa.  Tämä varmistaa, että ne varmuuskopioidaan verkossa salatussa SQLite-tallennuksessamme.

   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Vinkki:
     </strong>
     <span>
       Jos olet epävarma Thunderbirdiin tuonnista, voit katsoa viralliset ohjeet osoitteista <a class="alert-link" href="https://kb.mozillazine.org/Importing_folders">https://kb.mozillazine.org/Importing_folders</a> ja <a class="alert-link" href="https://github.com/thunderbird/import-export-tools-ng/wiki">https://github.com/thunderbird/import-export-tools-ng/wiki</a>.
     </span>
   </div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tärkeää:
  </strong>
  <span>
    Kun olet suorittanut vienti- ja tuontiprosessin, saatat haluta myös ottaa edelleenlähetyksen käyttöön olemassa olevassa sähköpostitilissäsi ja asettaa automaattivastaajan ilmoittamaan lähettäjille, että sinulla on uusi sähköpostiosoite (esim. jos käytit aiemmin Gmailia ja käytät nyt sähköpostia omalla verkkotunnuksellasi).
  </span>
</div>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Onnittelut!
    </strong>
    <span>
      Olet onnistuneesti suorittanut kaikki vaiheet.
    </span>
  </div>
</div>

### Kuinka käytän omaa S3-yhteensopivaa tallennustilaa varmuuskopioihin {#how-do-i-use-my-own-s3-compatible-storage-for-backups}

Maksullisen suunnitelman käyttäjät voivat määrittää oman [S3](https://en.wikipedia.org/wiki/Amazon_S3)-yhteensopivan tallennuspalveluntarjoajan verkkotunnuskohtaisesti IMAP/SQLite-varmuuskopioita varten. Tämä tarkoittaa, että salatut postilaatikkovarmuuskopiosi voidaan tallentaa omaan infrastruktuuriisi sen sijaan, että ne tallennettaisiin (tai lisäksi) oletustallennukseemme.

Tuetut palveluntarjoajat sisältävät [Amazon S3](https://aws.amazon.com/s3/), [Cloudflare R2](https://developers.cloudflare.com/r2/), [MinIO](https://github.com/minio/minio), [Backblaze B2](https://www.backblaze.com/cloud-storage), [DigitalOcean Spaces](https://www.digitalocean.com/products/spaces) ja muut S3-yhteensopivat palvelut.

#### Määritys {#setup}

1. Luo **yksityinen** säiliö (bucket) S3-yhteensopivalla palveluntarjoajallasi. Säiliön ei saa olla julkisesti saatavilla.
2. Luo käyttöoikeustiedot (access key ID ja secret access key) säiliön luku- ja kirjoitusoikeuksilla.
3. Siirry kohtaan <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Oma tili <i class="fa fa-angle-right"></i> Verkkotunnukset</a> <i class="fa fa-angle-right"></i> Lisäasetukset <i class="fa fa-angle-right"></i> Mukautettu S3-yhteensopiva tallennustila.
4. Valitse **"Ota käyttöön mukautettu S3-yhteensopiva tallennustila"** ja täytä päätepisteen URL, access key ID, secret access key, alue (region) ja säiliön nimi.
5. Klikkaa **"Testaa yhteys"** varmistaaksesi tunnistetietosi, säiliön pääsyn ja kirjoitusoikeudet.
6. Klikkaa **"Tallenna"** ottaaksesi asetukset käyttöön.

#### Kuinka varmuuskopiot toimivat {#how-backups-work}

Varmuuskopiot käynnistyvät automaattisesti jokaiselle yhdistetyllä IMAP-aliakselle. IMAP-palvelin tarkistaa kaikki aktiiviset yhteydet kerran tunnissa ja käynnistää varmuuskopion jokaiselle yhdistetyllä aliakselle. Redis-pohjainen lukitus estää päällekkäiset varmuuskopiot, jotka käynnistyisivät alle 30 minuutin sisällä toisistaan, ja varsinainen varmuuskopio ohitetaan, jos onnistunut varmuuskopio on jo tehty viimeisen 24 tunnin aikana (ellei varmuuskopiota ole nimenomaisesti pyydetty käyttäjän toimesta latausta varten).
Varmuuskopiot voidaan myös käynnistää manuaalisesti napsauttamalla kojelaudassa mitä tahansa aliasta vastaavaa **"Lataa varmuuskopio"** -painiketta. Manuaaliset varmuuskopiot suoritetaan aina riippumatta 24 tunnin ikkunasta.

Varmuuskopiointiprosessi toimii seuraavasti:

1. SQLite-tietokanta kopioidaan käyttämällä `VACUUM INTO` -komentoa, joka luo yhdenmukaisen tilannekuvan keskeyttämättä aktiivisia yhteyksiä ja säilyttää tietokannan salauksen.
2. Varmuuskopiotiedosto tarkistetaan avaamalla se ja varmistamalla, että salaus on edelleen voimassa.
3. Lasketaan SHA-256-tiiviste ja verrataan sitä tallennuksessa olevaan olemassa olevaan varmuuskopioon. Jos tiiviste täsmää, lataus ohitetaan (ei muutoksia viime varmuuskopion jälkeen).
4. Varmuuskopio ladataan S3:een käyttämällä moniosalatausta [@aws-sdk/lib-storage](https://github.com/aws/aws-sdk-js-v3/tree/main/lib/lib-storage) -kirjaston kautta.
5. Luodaan allekirjoitettu lataus-URL (voimassa 4 tuntia), joka lähetetään käyttäjälle sähköpostitse.

#### Varmuuskopioformaatit {#backup-formats}

Kolme varmuuskopioformaattia on tuettu:

| Formaatti | Tiedostopääte | Kuvaus                                                                    |
| --------- | ------------- | ------------------------------------------------------------------------- |
| `sqlite`  | `.sqlite`     | Raaka salattu SQLite-tietokannan tilannekuva (oletus automaattisille IMAP-varmuuskopioille) |
| `mbox`    | `.zip`        | Salasanalla suojattu ZIP, joka sisältää postilaatikon mbox-muodossa       |
| `eml`     | `.zip`        | Salasanalla suojattu ZIP, joka sisältää yksittäiset `.eml`-tiedostot viesteittäin |

> **Vinkki:** Jos sinulla on `.sqlite`-varmuuskopiotiedostoja ja haluat muuntaa ne paikallisesti `.eml`-tiedostoiksi, käytä erillistä komentorivityökalua **[convert-sqlite-to-eml](#how-do-i-convert-sqlite-backups-to-eml-files)**. Se toimii Windowsissa, Linuxissa ja macOS:ssä eikä vaadi verkkoyhteyttä.

#### Tiedoston nimeäminen ja avainrakenne {#file-naming-and-key-structure}

Kun käytät **mukautettua S3-tallennustilaa**, varmuuskopiotiedostot tallennetaan [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601) -aikaleimaprefiksillä, jotta kukin varmuuskopio säilyy erillisenä objektina. Tämä antaa sinulle täydellisen varmuuskopiohistorian omassa bucketissasi.

Avainmuoto on:

```
{ISO 8601 timestamp}-{alias_id}.{extension}
```

Esimerkiksi:

```
2025-03-01T12:00:00.000Z-65a31c53c36b75ed685f3fda.sqlite
2025-03-01T12:00:00.000Z-65a31c53c36b75ed685f3fda.zip
2025-03-02T12:00:00.000Z-65a31c53c36b75ed685f3fda.sqlite
```

`alias_id` on aliaksen MongoDB ObjectId. Löydät sen aliaksen asetussivulta tai API:n kautta.

Kun käytät **oletusjärjestelmän tallennustilaa**, avain on tasainen (esim. `65a31c53c36b75ed685f3fda.sqlite`) ja kukin varmuuskopio korvaa edellisen.

> **Huom:** Koska mukautettu S3-tallennustila säilyttää kaikki varmuuskopion versiot, tallennustilan käyttö kasvaa ajan myötä. Suosittelemme määrittämään [elinkaarisäännöt](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html) bucketillesi vanhojen varmuuskopioiden automaattista vanhentamista varten (esim. poista objektit, jotka ovat yli 30 tai 90 päivää vanhoja).

#### Datan omistajuus ja poistopolitiikka {#data-ownership-and-deletion-policy}

Mukautettu S3-bucketisi on täysin sinun hallinnassasi. Emme **koskaan poista tai muokkaa** tiedostoja mukautetussa S3-bucketissasi — ei aliaksen poiston yhteydessä, ei domainin poistamisen yhteydessä eikä siivoustoimintojen aikana. Kirjoitamme bucketillesi vain uusia varmuuskopiotiedostoja.

Tämä tarkoittaa:

* **Aliaksen poisto** — Kun poistat aliaksen, poistamme varmuuskopion vain oletusjärjestelmän tallennustilasta. Kaikki aiemmin mukautettuun S3-buckettiin kirjoitetut varmuuskopiot säilyvät koskemattomina.
* **Domainin poisto** — Domainin poistaminen ei vaikuta tiedostoihin mukautetussa bucketissasi.
* **Säilytyksen hallinta** — Olet vastuussa oman bucketisi tallennustilan hallinnasta, mukaan lukien elinkaarisääntöjen määrittämisestä vanhojen varmuuskopioiden vanhentamiseksi.

Jos poistat mukautetun S3-tallennustilan käytöstä tai vaihdat takaisin oletustallennustilaan, bucketissasi olevat tiedostot säilyvät. Tulevat varmuuskopiot kirjoitetaan yksinkertaisesti oletustallennustilaan.

#### Turvallisuus {#security}

* Käyttöavaimesi ID ja salainen käyttöavain ovat **salattu levossa** käyttäen [AES-256-GCM](https://en.wikipedia.org/wiki/Galois/Counter_Mode) -menetelmää ennen tallennusta tietokantaamme. Ne puretaan vain ajonaikaisesti varmuuskopiointitoimintojen aikana.
* Varmistamme automaattisesti, että bucketisi ei ole **julkisesti saatavilla**. Jos julkinen bucket havaitaan, asetusten tallennus hylätään. Jos julkinen pääsy havaitaan varmuuskopioinnin aikana, palautumme oletustallennustilaan ja ilmoitamme kaikille domainin ylläpitäjille sähköpostitse.
* Tunnistetiedot validoidaan tallennuksen yhteydessä [HeadBucket](https://docs.aws.amazon.com/AmazonS3/latest/API/API_HeadBucket.html) -kutsulla varmistaaksemme, että bucket on olemassa ja tunnistetiedot ovat oikein. Jos validointi epäonnistuu, mukautettu S3-tallennustila poistetaan automaattisesti käytöstä.
* Jokainen varmuuskopiotiedosto sisältää SHA-256-tiivisteen S3-metadatassaan, jota käytetään havaitsemaan muuttumattomat tietokannat ja ohittamaan turhat lataukset.
#### Virheilmoitukset {#error-notifications}

Jos varmuuskopio epäonnistuu käyttäessäsi omaa S3-tallennustasi (esim. vanhentuneiden tunnistetietojen tai yhteysongelman vuoksi), kaikille verkkotunnuksen ylläpitäjille lähetetään sähköpostitse ilmoitus. Näitä ilmoituksia rajoitetaan niin, että niitä lähetetään korkeintaan kerran kuudessa tunnissa kaksoishälytysten estämiseksi. Jos varmuuskopiointiaikana havaitaan, että säiliösi on julkisesti saavutettavissa, ylläpitäjille ilmoitetaan kerran päivässä.

#### API {#api}

Voit myös määrittää oman S3-tallennuksen API:n kautta:

```sh
curl -X PUT https://api.forwardemail.net/v1/domains/example.com \
  -u API_TOKEN: \
  -d has_custom_s3=true \
  -d s3_endpoint=https://s3.us-east-1.amazonaws.com \
  -d s3_access_key_id=YOUR_ACCESS_KEY_ID \
  -d s3_secret_access_key=YOUR_SECRET_ACCESS_KEY \
  -d s3_region=us-east-1 \
  -d s3_bucket=my-email-backups
```

Yhteyden testaaminen API:n kautta:

```sh
curl -X POST https://api.forwardemail.net/v1/domains/example.com/test-s3-connection \
  -u API_TOKEN:
```

### Kuinka muuntaa SQLite-varmuuskopiot EML-tiedostoiksi {#how-do-i-convert-sqlite-backups-to-eml-files}

Jos lataat tai tallennat SQLite-varmuuskopioita (joko oletustallennuksestamme tai omasta [mukautetusta S3-säiliöstäsi](#how-do-i-use-my-own-s3-compatible-storage-for-backups)), voit muuntaa ne standardeiksi `.eml`-tiedostoiksi käyttämällä erillistä komentorivityökalua **[convert-sqlite-to-eml](https://github.com/forwardemail/forwardemail.net/tree/master/tools/convert-sqlite-to-eml)**. EML-tiedostot voi avata millä tahansa sähköpostiohjelmalla ([Thunderbird](https://www.thunderbird.net/), [Outlook](https://www.microsoft.com/en-us/microsoft-365/outlook/email-and-calendar-software-microsoft-outlook), [Apple Mail](https://support.apple.com/mail) jne.) tai tuoda muihin sähköpostipalvelimiin.

#### Asennus {#installation-1}

Voit joko ladata valmiin binäärin (ei vaadi [Node.js](https://github.com/nodejs/node)) tai suorittaa sen suoraan [Node.js](https://github.com/nodejs/node) -ympäristössä:

**Valmiit binäärit** — Lataa uusin julkaisu alustallesi osoitteesta [GitHub Releases](https://github.com/forwardemail/forwardemail.net/releases):

| Alusta  | Arkkitehtuuri | Tiedosto                              |
| ------- | ------------- | ------------------------------------ |
| Linux   | x64           | `convert-sqlite-to-eml-linux-x64`    |
| Linux   | arm64         | `convert-sqlite-to-eml-linux-arm64`  |
| macOS   | Apple Silicon | `convert-sqlite-to-eml-darwin-arm64` |
| Windows | x64           | `convert-sqlite-to-eml-win-x64.exe`  |

> **macOS-käyttäjät:** Latauksen jälkeen saatat joutua poistamaan karanteenitunnisteen ennen binäärin suorittamista:
>
> ```bash
> sudo xattr -rd com.apple.quarantine ./convert-sqlite-to-eml-darwin-arm64
> ```
>
> (Korvaa `./convert-sqlite-to-eml-darwin-arm64` ladatun tiedoston todellisella polulla.)

> **Linux-käyttäjät:** Latauksen jälkeen saatat joutua tekemään binääristä suoritettavan:
>
> ```bash
> chmod +x ./convert-sqlite-to-eml-linux-x64
> ```
>
> (Korvaa `./convert-sqlite-to-eml-linux-x64` ladatun tiedoston todellisella polulla.)

**Lähdekoodista** (vaatii [Node.js](https://github.com/nodejs/node) >= 18):

```bash
cd tools/convert-sqlite-to-eml
npm install
node index.js
```

#### Käyttö {#usage}

Työkalu tukee sekä vuorovaikutteista että ei-vuorovaikutteista tilaa.

**Vuorovaikutteinen tila** — suorita ilman argumentteja, jolloin sinulta kysytään kaikki tarvittavat tiedot:

```bash
./convert-sqlite-to-eml
```

```
  Forward Email - Muunna SQLite-varmuuskopio EML-muotoon
  =============================================

  Polku SQLite-varmuuskopiotiedostoon: /path/to/backup.sqlite
  IMAP/alias-salasana: ********
  Tulosteen ZIP-polku [/path/to/backup-2025-03-01T12-00-00-000Z.zip]:
```

**Ei-vuorovaikutteinen tila** — anna argumentit komentoriviparametreina skriptausta ja automaatiota varten:

```bash
./convert-sqlite-to-eml \
  --path /path/to/backup.sqlite \
  --password "your-imap-password" \
  --output /path/to/output.zip
```

| Parametri           | Kuvaus                                                                        |
| ------------------- | ----------------------------------------------------------------------------- |
| `--path <path>`     | Polku salattuun SQLite-varmuuskopiotiedostoon                                |
| `--password <pass>` | IMAP/alias-salasana salauksen purkuun                                        |
| `--output <path>`   | Tulostetiedoston ZIP-polku (oletus: automaattisesti ISO 8601 -aikaleimalla)   |
| `--help`            | Näytä ohjeviesti                                                              |
#### Output Format {#output-format}

Työkalu tuottaa salasanalla suojatun ZIP-arkiston (AES-256-salattu), joka sisältää:

```
README.txt
INBOX/
  <message-id-1>.eml
  <message-id-2>.eml
Sent/
  <message-id-3>.eml
Drafts/
  <message-id-4>.eml
```

EML-tiedostot on järjestetty postilaatikon kansioittain. ZIP-salasanana toimii sama salasana kuin IMAP-/alias-salasanasi. Jokainen `.eml`-tiedosto on standardin [RFC 5322](https://datatracker.ietf.org/doc/html/rfc5322) mukainen sähköpostiviesti, jossa on täydelliset otsikot, viestin runko ja liitteet, jotka on rekonstruoitu SQLite-tietokannasta.

#### How It Works {#how-it-works}

1. Avaa salatun SQLite-tietokannan käyttäen IMAP-/alias-salasanaasi (tukee sekä [ChaCha20](https://en.wikipedia.org/wiki/ChaCha20-Poly1305) että [AES-256-CBC](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard) salausmenetelmiä).
2. Lukee Mailboxes-taulun löytääkseen kansiorakenteen.
3. Jokaiselle viestille dekoodaa mimeTree:n (tallennettu [Brotli](https://github.com/google/brotli)-pakattuna JSON-muodossa) Messages-taulusta.
4. Rekonstruoi koko EML:n käymällä MIME-puun läpi ja hakemalla liitteiden rungot Attachments-taulusta.
5. Pakkaa kaiken salasanalla suojattuun ZIP-arkistoon käyttäen [archiver-zip-encrypted](https://github.com/artem-silaev/archiver-zip-encrypted).

### Do you support self-hosting {#do-you-support-self-hosting}

Kyllä, maaliskuusta 2025 alkaen tuemme itseisännöityä vaihtoehtoa. Lue blogi [tästä](https://forwardemail.net/blog/docs/self-hosted-solution). Aloita tutustumalla [itseisännöityyn oppaaseen](https://forwardemail.net/self-hosted). Ja jos haluat yksityiskohtaisemman vaiheittaisen version, katso [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) tai [Debian](https://forwardemail.net/guides/selfhosted-on-debian) -pohjaiset oppaamme.


## Email Configuration {#email-configuration}

### How do I get started and set up email forwarding {#how-do-i-get-started-and-set-up-email-forwarding}

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
    Lue huolellisesti ja seuraa alla lueteltuja vaiheita yhdestä kahdeksaan. Muista korvata sähköpostiosoite <code>user@gmail.com</code> sillä sähköpostiosoitteella, johon haluat sähköpostien ohjautuvan (jos se ei ole jo oikein). Vastaavasti korvaa <code>example.com</code> omalla mukautetulla verkkotunnuksellasi (jos se ei ole jo oikein).
  </span>
</div>

<ol>
  <li class="mb-2 mb-md-3 mb-lg-5">Jos olet jo rekisteröinyt verkkotunnuksesi jossain, sinun tulee täysin ohittaa tämä vaihe ja siirtyä suoraan toiseen vaiheeseen! Muussa tapauksessa voit <a href="/domain-registration" rel="noopener noreferrer">napsauttaa tästä rekisteröidäksesi verkkotunnuksesi</a>.</li>
  <li class="mb-2 mb-md-3 mb-lg-5">
  Muistatko, missä rekisteröit verkkotunnuksesi? Kun muistat tämän, seuraa alla olevia ohjeita:

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tärkeää:
  </strong>
  <span>
    Sinun täytyy avata uusi välilehti ja kirjautua sisään verkkotunnuksesi rekisteröijälle. Voit helposti napsauttaa alla olevaa "Registrar"-linkkiä tehdäksesi tämän automaattisesti. Tässä uudessa välilehdessä sinun tulee siirtyä rekisteröijäsi DNS-hallintasivulle – olemme antaneet vaiheittaiset navigointiohjeet alla "Steps to Configure" -sarakkeessa. Kun olet navigoinut tälle sivulle uudessa välilehdessä, voit palata tähän välilehteen ja jatkaa kolmannesta vaiheesta eteenpäin.
    <strong class="font-weight-bold">Älä sulje avattua välilehteä vielä; tarvitset sitä tulevissa vaiheissa!</strong>
  </span>
</div>

<table id="table-dns-management-by-registrar" class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Rekisteröijä</th>
      <th>Vaiheet asetusten tekemiseen</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://login.ionos.com/">1&amp;1</a></td>
      <td>Kirjaudu sisään <i class="fa fa-angle-right"></i> Domain Center <i class="fa fa-angle-right"></i> (Valitse verkkotunnuksesi) <i class="fa fa-angle-right"></i> Muokkaa DNS-asetuksia</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon Route 53</a></td>
      <td>Kirjaudu sisään <i class="fa fa-angle-right"></i> Hosted Zones <i class="fa fa-angle-right"></i> (Valitse verkkotunnuksesi)</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>
      <td>Kirjaudu sisään <i class="fa fa-angle-right"></i> My Servers <i class="fa fa-angle-right"></i> Domain Management <i class="fa fa-angle-right"></i> DNS Manager</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.bluehost.com/help/article/dns-management-add-edit-or-delete-dns-entries">Bluehost</a></td>
      <td>FOR ROCK: Kirjaudu sisään <i class="fa fa-angle-right"></i> Domains <i class="fa fa-angle-right"></i> (Klikkaa ▼-kuvaketta hallinnoidaksesi) <i class="fa fa-angle-right"></i> DNS
      <br />
      FOR LEGACY: Kirjaudu sisään <i class="fa fa-angle-right"></i> Domains <i class="fa fa-angle-right"></i> Zone editor <i class="fa fa-angle-right"></i> (Valitse verkkotunnuksesi)</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://dash.cloudflare.com/login">Cloudflare</a></td>
      <td>Kirjaudu sisään <i class="fa fa-angle-right"></i> DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://cp.dnsmadeeasy.com/">DNS Made Easy</a></td>
      <td>Kirjaudu sisään <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> (Valitse verkkotunnuksesi)</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://dnsimple.com/dashboard">DNSimple</a></td>
      <td>Kirjaudu sisään <i class="fa fa-angle-right"></i> (Valitse verkkotunnuksesi)  <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> Hallinnoi</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://cloud.digitalocean.com/login">Digital Ocean</a></td>
      <td>Kirjaudu sisään <i class="fa fa-angle-right"></i> Networking <i class="fa fa-angle-right"></i> Domains <i class="fa fa-angle-right"></i> (Valitse verkkotunnuksesi) <i class="fa fa-angle-right"></i> More <i class="fa fa-angle-right"></i> Manage Domain</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.domain.com/help/article/dns-management-how-to-update-dns-records">Domain.com</a></td>
      <td>Kirjaudu sisään <i class="fa fa-angle-right"></i> Korttinäkymässä klikkaa hallinnoi verkkotunnustasi <i class="fa fa-angle-right"></i> Listanäkymässä klikkaa rataskuvaketta <i class="fa fa-angle-right"></i> DNS & Nameservers <i class="fa fa-angle-right"></i> DNS Records</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://www.domains.com/">Domains.com</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=WnU0Gp-Y-es"><i class="fa fa-play-circle"></i> Katso</a>
      </td>
      <td>Kirjaudu sisään <i class="fa fa-angle-right"></i> (Valitse verkkotunnuksesi) <i class="fa fa-angle-right"></i> Hallinnoi <i class="fa fa-angle-right"></i> (klikkaa rataskuvaketta) <i class="fa fa-angle-right"></i> Klikkaa DNS &amp; Nameservers vasemman valikon kohdasta</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://panel.dreamhost.com/">DreamHost</a></td>
      <td>Kirjaudu sisään <i class="fa fa-angle-right"></i> Panel <i class="fa fa-angle-right"></i> Domains <i class="fa fa-angle-right"></i> Manage Domains <i class="fa fa-angle-right"></i> DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://portal.dynect.net/login/">Dyn</a></td>
      <td>Kirjaudu sisään <i class="fa fa-angle-right"></i> Overview <i class="fa fa-angle-right"></i> Manage <i class="fa fa-angle-right"></i> Simple Editor <i class="fa fa-angle-right"></i> Records</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://id.gandi.net/en/login">Gandi</a></td>
      <td>Kirjaudu sisään <i class="fa fa-angle-right"></i> (Valitse verkkotunnuksesi) <i class="fa fa-angle-right"></i> Management <i class="fa fa-angle-right"></i> Muokkaa aluetta</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://sso.godaddy.com">GoDaddy</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=G7g8FiZL5D8"><i class="fa fa-play-circle"></i> Katso</a>
      </td>
      <td>Kirjaudu sisään <i class="fa fa-angle-right"></i> Manage My Domains <i class="fa fa-angle-right"></i> (Valitse verkkotunnuksesi) <i class="fa fa-angle-right"></i> Manage DNS</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://domains.google.com/registrar">Google Domains</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=01iHjbIN5CQ"><i class="fa fa-play-circle"></i> Katso</a>
      </td>
      <td>Kirjaudu sisään <i class="fa fa-angle-right"></i> (Valitse verkkotunnuksesi) <i class="fa fa-angle-right"></i> Määritä DNS</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://www.namecheap.com/myaccount/login/">Namecheap</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=no62GCzMn7E"><i class="fa fa-play-circle"></i> Katso</a>
      </td>
      <td>Kirjaudu sisään <i class="fa fa-angle-right"></i> Domain List <i class="fa fa-angle-right"></i> (Valitse verkkotunnuksesi) <i class="fa fa-angle-right"></i> Hallinnoi <i class="fa fa-angle-right"></i> Advanced DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://app.netlify.com/">Netlify</a></td>
      <td>Kirjaudu sisään <i class="fa fa-angle-right"></i> (Valitse verkkotunnuksesi) <i class="fa fa-angle-right"></i> Aseta Netlify DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.networksolutions.com/manage-it/index.jsp">Network Solutions</a></td>
      <td>Kirjaudu sisään <i class="fa fa-angle-right"></i> Account Manager <i class="fa fa-angle-right"></i> My Domain Names <i class="fa fa-angle-right"></i> (Valitse verkkotunnuksesi) <i class="fa fa-angle-right"></i> Hallinnoi <i class="fa fa-angle-right"></i> Vaihda mihin verkkotunnus osoittaa <i class="fa fa-angle-right"></i> Advanced DNS</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://accounts.shopify.com/store-login">Shopify</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=G1NR8CIdv2M"><i class="fa fa-play-circle"></i> Katso</a>
      </td>
      <td>Kirjaudu sisään <i class="fa fa-angle-right"></i> Managed Domains <i class="fa fa-angle-right"></i> (Valitse verkkotunnuksesi) <i class="fa fa-angle-right"></i> DNS-asetukset</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://support.squarespace.com/hc/en-us/articles/214767107">Squarespace</a></td>
      <td>Kirjaudu sisään <i class="fa fa-angle-right"></i> Kotivalikko <i class="fa fa-angle-right"></i> Asetukset <i class="fa fa-angle-right"></i> Verkkotunnukset <i class="fa fa-angle-right"></i> (Valitse verkkotunnuksesi) <i class="fa fa-angle-right"></i>
Lisäasetukset <i class="fa fa-angle-right"></i> Mukautetut tietueet</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://vercel.com/docs/now-cli?utm_source=zeit-dashboard&utm_medium=web&utm_campaign=configure-dns#commands/dns">Vercel's Now</a></td>
      <td>Käytä "now" CLI:tä <i class="fa fa-angle-right"></i> <code>now dns add [domain] '@' MX [record-value] [priority]</code></td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.weebly.com/app/help/us/en/topics/manage-dns-records">Weebly</a></td>
      <td>Kirjaudu sisään <i class="fa fa-angle-right"></i> Verkkotunnussivulle <i class="fa fa-angle-right"></i> (Valitse verkkotunnuksesi) <i class="fa fa-angle-right"></i> DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://support.wix.com/en/article/adding-dns-records-in-your-wix-account">Wix</a></td>
      <td>Kirjaudu sisään <i class="fa fa-angle-right"></i> Verkkotunnussivulle <i class="fa fa-angle-right"></i> (Klikkaa <i class="fa fa-ellipsis-h"></i> kuvaketta) <i class="fa fa-angle-right"></i> Valitse Hallinnoi DNS-tietueita</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.enom.com/login.aspx?page=%2fmyaccount%2fdefault.aspx&amp;">eNom</a></td>
      <td>Kirjaudu sisään <i class="fa fa-angle-right"></i> Verkkotunnukset <i class="fa fa-angle-right"></i> Omat verkkotunnukset</td>
    </tr>
    <tr>
      <td>Muu</td>
      <td>
        <div class="alert mb-0 alert-warning"><i class="fa fa-exclamation-circle font-weight-bold"></i> <strong class="font-weight-bold">Tärkeää:</strong> Etkö näe rekisteröijäsi nimeä listattuna täällä? Etsi Internetistä hakusanalla "how to change DNS records on $REGISTRAR" (korvaten $REGISTRAR rekisteröijäsi nimellä – esim. "how to change DNS records on GoDaddy", jos käytät GoDaddyä).</div>
      </td>
    </tr>
  </tbody>
</table>
</li>
<li class="mb-2 mb-md-3 mb-lg-5">Käytä rekisteröijäsi DNS-hallintasivua (toinen välilehti, jonka olet avannut) ja aseta seuraavat "MX"-tietueet:
<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tärkeää:
  </strong>
  <span>
    Huomaa, että muita MX-tietueita EI SAA olla asetettuna. Molempien alla näkyvien tietueiden ON oltava olemassa. Varmista, ettei kirjoitusvirheitä ole; ja että sinulla on sekä mx1 että mx2 kirjoitettuna oikein. Jos MX-tietueita oli jo olemassa, poista ne kokonaan.
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

</li><li class="mb-2 mb-md-3 mb-lg-5" id="dns-configuration-options">Käytä rekisteröijäsi DNS-hallintasivua (toinen välilehti, joka sinulla on auki) ja aseta seuraavat <strong class="notranslate">TXT</strong>-tietueet:

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tärkeää:
  </strong>
  <span>
    Jos olet maksullisella tilillä, sinun tulee ohittaa tämä vaihe kokonaan ja siirtyä viidenteen vaiheeseen! Jos et ole maksullisella tilillä, eteenpäin ohjatut osoitteesi ovat julkisesti haettavissa – siirry kohtaan <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Oma tili <i class="fa fa-angle-right"></i> Domainit</a> ja päivitä domainisi maksulliseen tilaan halutessasi. Jos haluat tietää lisää maksullisista tilauksista, katso <a rel="noopener noreferrer" href="/private-business-email" class="alert-link">Hinnoittelu</a>-sivumme. Muussa tapauksessa voit jatkaa valitsemalla yhden tai useamman vaihtoehdoista A–F alla.
  </span>
</div>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Vaihtoehto A:
  </strong>
  <span>
    Jos ohjaat kaikki sähköpostit domainiltasi (esim. "all@example.com", "hello@example.com" jne.) tiettyyn osoitteeseen "user@gmail.com":
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
    Muista korvata yllä olevassa "Arvo"-sarakkeen arvossa oma sähköpostiosoitteesi. "TTL"-arvon ei tarvitse olla 3600, se voi olla tarvittaessa pienempi tai suurempi arvo. Pienempi TTL-arvo varmistaa, että DNS-tietueisiisi tehdyt tulevat muutokset leviävät Internetissä nopeammin – ajattele tätä kuinka kauan tieto säilyy välimuistissa (sekunteina). Voit lukea lisää <a href="https://en.wikipedia.org/wiki/Time_to_live#DNS_records" rel="noopener noreferrer" target="_blank" class="alert-link">TTL:stä Wikipediassa</a>.
  </span>
</div>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Vaihtoehto B:
  </strong>
  <span>
    Jos haluat ohjata vain yhden sähköpostiosoitteen (esim. <code>hello@example.com</code> osoitteeseen <code>user@gmail.com</code>; tämä ohjaa myös automaattisesti "hello+test@example.com" osoitteeseen "user+test@gmail.com"):
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
    Jos välität useita sähköposteja, haluat erottaa ne pilkulla:
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
    Voit määrittää rajattoman määrän välityssähköposteja – varmista vain, ettet ylitä 255 merkkiä yhdellä rivillä ja aloita jokainen rivi "forward-email="-tekstillä. Alla on esimerkki:
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
    Voit myös määrittää verkkotunnuksen <strong class="notranslate">TXT</strong>-tietueessasi globaalin alias-välityksen mahdollistamiseksi (esim. "user@example.com" välitetään osoitteeseen "user@example.net"):
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
    Voit jopa käyttää webhookkeja globaalina tai yksittäisenä alias-välityksenä sähköpostien välittämiseen. Katso esimerkki ja koko osio webhookeista otsikolla <a href="#do-you-support-webhooks" class="alert-link">Tuetteko webhookkeja</a> alla.
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
    Voit jopa käyttää säännöllisiä lausekkeita ("regex") aliasien vastaavuuteen ja korvausten käsittelyyn sähköpostien edelleenlähettämiseksi. Katso esimerkit ja koko osio regexistä otsikolla <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">Tuetteko säännöllisiä lausekkeita tai regexiä</a> alla.
  </span>
</div>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Tarvitsetko kehittynyttä regexiä korvauksilla?</strong> Katso esimerkit ja koko osio regexistä otsikolla <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">Tuetteko säännöllisiä lausekkeita tai regexiä</a> alla.
</div>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Yksinkertainen esimerkki:</strong> Jos haluan, että kaikki sähköpostit, jotka menevät osoitteisiin `linus@example.com` tai `torvalds@example.com`, lähetetään edelleen osoitteeseen `user@gmail.com`:
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
    Catch-all -edelleenlähetyssääntöjä voidaan myös kuvata "putoamisena".
    Tämä tarkoittaa, että saapuvat sähköpostit, jotka vastaavat vähintään yhtä tiettyä edelleenlähetyssääntöä, käytetään catch-allin sijaan.
    Tarkat säännöt sisältävät sähköpostiosoitteet ja säännölliset lausekkeet.
    <br /><br />
    Esimerkiksi:
    <br />
    <code>forward-email=hello:first@gmail.com,second@gmail.com</code>
    <br />
    Sähköpostit osoitteeseen <code>hello@example.com</code> **eivät** tässä kokoonpanossa lähetetä edelleen osoitteeseen <code>second@gmail.com</code> (catch-all), vaan ne toimitetaan vain osoitteeseen <code>first@gmail.com</code>.
  </span>
</div>

---

</li><li class="mb-2 mb-md-3 mb-lg-5">Käyttämällä rekisteröijäsi DNS-hallintasivua (toinen välilehti, joka sinulla on auki), aseta lisäksi seuraava <strong class="notranslate">TXT</strong> -tietue:

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
    Jos käytät Gmailia (esim. Lähetä sähköpostina) tai G Suitea, sinun täytyy lisätä yllä olevaan arvoon <code>include:_spf.google.com</code>, esimerkiksi:
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
    Jos sinulla on jo vastaava rivi, jossa on "v=spf1", sinun täytyy lisätä <code>include:spf.forwardemail.net</code> juuri ennen olemassa olevia "include:host.com" -tietueita ja ennen "-all" samassa rivissä, esimerkiksi:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
    <br /><br />
    Huomaa, että "-all" ja "~all" eroavat toisistaan. "-" tarkoittaa, että SPF-tarkistus epäonnistuu, jos se ei täsmää, ja "~" tarkoittaa, että SPF-tarkistus on pehmeä epäonnistuminen (softfail). Suosittelemme käyttämään "-all" -menetelmää estämään domainin väärentämisen.
    <br /><br />
    Saatat myös joutua lisäämään SPF-tietueen sille isännälle, jolta lähetät sähköpostia (esim. Outlook).
  </span>
</div>
</li><li class="mb-2 mb-md-3 mb-lg-5">Varmista DNS-tietueesi käyttämällä "Verify Records" -työkalua, joka on saatavilla osoitteessa <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Oma tili <i class="fa fa-angle-right"></i> Domainit</a> <i class="fa fa-angle-right"></i> Asetukset.

</li><li class="mb-2 mb-md-3 mb-lg-5">Lähetä testisähköposti varmistaaksesi, että se toimii. Huomaa, että DNS-tietueiden leviämisessä voi kestää jonkin aikaa.

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Vinkki:
  </strong>
  <span>
  </span>
    Jos et vastaanota testisähköposteja tai saat testisähköpostin, jossa lukee "Ole varovainen tämän viestin kanssa", katso vastaukset kohtiin <a href="#why-am-i-not-receiving-my-test-emails" class="alert-link">Miksi en vastaanota testisähköposteja</a> ja <a href="#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious" class="alert-link">Miksi Gmailiin lähetetyt testisähköpostini näyttävät epäilyttäviltä</a>.
</div>

</li><li class="mb-2 mb-md-3 mb-lg-5">Jos haluat "Lähettää postia nimellä" Gmailista, sinun tulee <strong><a href="https://www.youtube.com/watch?v=MEheS8gM4Xs" target="_blank" rel="noopener noreferrer">katsoa tämä video</a></strong> tai seurata alla olevaa kohtaa <a href="#how-to-send-mail-as-using-gmail">Kuinka lähettää postia Gmailin kautta</a>.

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
    Valinnaiset lisäosat on lueteltu alla. Huomaa, että nämä lisäosat ovat täysin vapaaehtoisia eivätkä välttämättä ole tarpeellisia. Halusimme kuitenkin tarjota sinulle lisätietoa, jos se on tarpeen.
  </span>
</div>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Valinnainen lisäosa:
  </strong>
  <span>
    Jos käytät <a class="alert-link" href="#how-to-send-mail-as-using-gmail">Kuinka lähettää postia Gmailin kautta</a> -toimintoa, saatat haluta lisätä itsesi sallittujen listalle. Katso <a class="alert-link" href="https://support.google.com/a/answer/60752?hl=en" target="_blank" rel="noopener noreferrer">Gmailin ohjeet tästä aiheesta</a>.
  </span>
</div>

### Voinko käyttää useita MX-vaihtoehtoja ja palvelimia edistyneeseen edelleenlähetykseen {#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding}

Kyllä, mutta **sinulla tulisi olla vain yksi MX-vaihtoehto DNS-tietueissasi**.

Älä yritä käyttää "Prioriteettia" useiden MX-vaihtoehtojen määrittämiseen.

Sen sijaan sinun tulee määrittää nykyinen MX-vaihtoehtosi edelleenlähettämään postit kaikille ei-yhdenmukaisille aliaksille palvelumme vaihtajille (`mx1.forwardemail.net` ja/tai `mx2.forwardemail.net`).

Jos käytät Google Workspacea ja haluat edelleenlähettää kaikki ei-yhdenmukaiset aliasosoitteet palveluumme, katso <https://support.google.com/a/answer/6297084>.

Jos käytät Microsoft 365:tä (Outlook) ja haluat edelleenlähettää kaikki ei-yhdenmukaiset aliasosoitteet palveluumme, katso <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/use-connectors-to-configure-mail-flow/set-up-connectors-to-route-mail> ja <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/manage-mail-flow-for-multiple-locations>.

### Kuinka asetan lomavastaajan (poissa toimistolta -automaattivastaajan) {#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder}

Mene osoitteeseen <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Oma tili <i class="fa fa-angle-right"></i> Domainit</a> <i class="fa fa-angle-right"></i> Aliakset ja luo tai muokkaa aliasta, jolle haluat määrittää lomavastaajan.
Sinulla on mahdollisuus määrittää aloituspäivä, lopetuspäivä, aihe ja viesti sekä ottaa se käyttöön tai poistaa käytöstä milloin tahansa:

* Pelkkä teksti -aihe ja viesti ovat tällä hetkellä tuettuja (käytämme sisäisesti `striptags`-pakettia poistaaksemme kaiken HTML:n).
* Aihe on rajoitettu 100 merkkiin.
* Viesti on rajoitettu 1000 merkkiin.
* Asetus vaatii lähtevän SMTP:n konfiguroinnin (esim. sinun tulee määrittää DKIM, DMARC ja Return-Path DNS -tietueet).
  * Siirry kohtaan <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Oma tili <i class="fa fa-angle-right"></i> Verkkotunnukset</a> <i class="fa fa-angle-right"></i> Asetukset <i class="fa fa-angle-right"></i> Lähtevän SMTP:n konfigurointi ja seuraa asennusohjeita.
* Lomavastaajaa ei voi ottaa käyttöön globaaleilla vanity-verkkotunnuksilla (esim. [kertakäyttöosoitteet](/disposable-addresses) eivät ole tuettuja).
* Lomavastaajaa ei voi ottaa käyttöön aliaksille, joissa on jokerimerkki/catch-all (`*`) tai säännöllisiä lausekkeita.

Toisin kuin postijärjestelmät kuten `postfix` (esim. jotka käyttävät `sieve`-lomavastaajasuodatinta) – Forward Email lisää automaattisesti DKIM-allekirjoituksesi, suojaa yhteysongelmilta lomavastausviestejä lähetettäessä (esim. yleisten SSL/TLS-yhteysongelmien ja vanhentuneiden palvelimien vuoksi) ja tukee jopa Open WKD:tä ja PGP-salausta lomavastausviesteille.

<!--
* Estääksemme väärinkäytön, jokaisesta lähetetystä lomavastausviestistä veloitetaan 1 lähtevän SMTP:n krediitti.
  * Kaikki maksulliset tilit sisältävät oletuksena 300 krediittiä päivässä. Jos tarvitset suuremman määrän, ota meihin yhteyttä.
-->

1. Lähetämme vain kerran joka 4. päivä jokaiselle [sallittujen listalla](#do-you-have-an-allowlist) olevalle lähettäjälle.

   * Redis-välimuistimme käyttää sormenjälkeä, joka muodostuu `alias_id`- ja `sender`-arvoista, missä `alias_id` on aliaksen MongoDB-tunnus ja `sender` on joko Lähettäjä-osoite (jos sallittu) tai Lähettäjä-osoitteen juuritunnus (jos ei sallittu). Yksinkertaisuuden vuoksi tämän sormenjäljen vanhenemisaika välimuistissa on asetettu 4 päiväksi.

   * Lähestymistapamme käyttää Lähettäjä-osoitteesta purettua juuritunnusta ei-sallittujen lähettäjien kohdalla estää väärinkäytöksiä suhteellisen tuntemattomilta lähettäjiltä (esim. haitallisilta toimijoilta) lomavastausviestien tulvittamiseksi.

2. Lähetämme vain, kun MAIL FROM ja/tai From eivät ole tyhjiä eivätkä sisällä (kirjaimista riippumatta) [postmaster-käyttäjänimeä](#what-are-postmaster-addresses) (sähköpostiosoitteen @-merkin edeltävä osa).

3. Emme lähetä, jos alkuperäisessä viestissä oli jokin seuraavista otsikoista (kirjaimista riippumatta):

   * `auto-submitted`-otsikko, jonka arvo ei ole `no`.
   * `x-auto-response-suppress`-otsikko, jonka arvo on `dr`, `autoreply`, `auto-reply`, `auto_reply` tai `all`.
   * `list-id`, `list-subscribe`, `list-unsubscribe`, `list-help`, `list-post`, `list-owner`, `list-archive`, `x-autoreply`, `x-autorespond` tai `x-auto-respond` -otsikko (arvosta riippumatta).
   * `precedence`-otsikko, jonka arvo on `bulk`, `autoreply`, `auto-reply`, `auto_reply` tai `list`.

4. Emme lähetä, jos MAIL FROM- tai From-sähköpostiosoite päättyy `+donotreply`, `-donotreply`, `+noreply` tai `-noreply`.

5. Emme lähetä, jos From-sähköpostiosoitteen käyttäjänimi oli `mdaemon` ja siinä oli kirjainkoolla merkityksetön `X-MDDSN-Message`-otsikko.

6. Emme lähetä, jos viestissä oli kirjainkoolla merkityksetön `content-type`-otsikko, jonka arvo oli `multipart/report`.

### Kuinka määritän SPF:n Forward Emailille {#how-do-i-set-up-spf-for-forward-email}

Käytä rekisteröijäsi DNS-hallintasivua ja lisää seuraava <strong class="notranslate">TXT</strong>-tietue:

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
    Jos käytät Gmailia (esim. Lähetä sähköpostina) tai G Suitea, sinun tulee lisätä yllä olevaan arvoon <code>include:_spf.google.com</code>, esimerkiksi:
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
    Jos käytät Microsoft Outlookia tai Live.comia, sinun on lisättävä <code>include:spf.protection.outlook.com</code> SPF <strong class="notranslate">TXT</strong> -tietueeseesi, esimerkiksi:
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
    Jos sinulla on jo samanlainen rivi, jossa on "v=spf1", sinun on lisättävä <code>include:spf.forwardemail.net</code> juuri ennen olemassa olevia "include:host.com" -tietueita ja ennen "-all" samassa rivissä, esimerkiksi:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
    <br /><br />
    Huomaa, että "-all" ja "~all" eroavat toisistaan. "-" tarkoittaa, että SPF-tarkistus epäonnistuu, jos se ei täsmää, ja "~" tarkoittaa, että SPF-tarkistus on pehmeä epäonnistuminen (SOFTFAIL). Suosittelemme käyttämään "-all" -menetelmää estämään verkkotunnuksen väärentämisen.
    <br /><br />
    Saatat myös joutua sisällyttämään SPF-tietueen sille palvelimelle, josta lähetät sähköpostia (esim. Outlook).
  </span>
</div>

### Kuinka asetan DKIM:n Forward Emailille {#how-do-i-set-up-dkim-for-forward-email}

Mene osoitteeseen <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Oma tili <i class="fa fa-angle-right"></i> Verkkotunnukset</a> <i class="fa fa-angle-right"></i> Asetukset <i class="fa fa-angle-right"></i> Lähtevän SMTP:n asetukset ja seuraa asennusohjeita.

### Kuinka asetan DMARC:n Forward Emailille {#how-do-i-set-up-dmarc-for-forward-email}

Mene osoitteeseen <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Oma tili <i class="fa fa-angle-right"></i> Verkkotunnukset</a> <i class="fa fa-angle-right"></i> Asetukset <i class="fa fa-angle-right"></i> Lähtevän SMTP:n asetukset ja seuraa asennusohjeita.

### Kuinka näen DMARC-raportit {#how-do-i-view-dmarc-reports}

Forward Email tarjoaa kattavan DMARC-raporttien hallintapaneelin, jonka avulla voit seurata sähköpostin todennus-suorituskykyä kaikilla verkkotunnuksillasi yhdestä käyttöliittymästä.

**Mitä DMARC-raportit ovat?**

DMARC (Domain-based Message Authentication, Reporting, and Conformance) -raportit ovat XML-tiedostoja, joita vastaanottavat sähköpostipalvelimet lähettävät ja jotka kertovat, miten sähköpostisi todennetaan. Nämä raportit auttavat sinua ymmärtämään:

* Kuinka monta sähköpostia verkkotunnuksestasi lähetetään
* Läpäisevätkö nämä sähköpostit SPF- ja DKIM-todennuksen
* Mitä toimenpiteitä vastaanottavat palvelimet tekevät (hyväksyvät, karanteeniin tai hylkäävät)
* Mitkä IP-osoitteet lähettävät sähköpostia verkkotunnuksesi puolesta

**Kuinka päästä käsiksi DMARC-raportteihin**

Mene osoitteeseen <a href="/my-account/dmarc-reports" class="alert-link" target="_blank" rel="noopener noreferrer">Oma tili <i class="fa fa-angle-right"></i> DMARC-raportit</a> nähdäksesi hallintapaneelisi. Voit myös tarkastella verkkotunnuskohtaisia raportteja osoitteessa <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Oma tili <i class="fa fa-angle-right"></i> Verkkotunnukset</a> napsauttamalla "DMARC"-painiketta minkä tahansa verkkotunnuksen vieressä.

**Hallintapaneelin ominaisuudet**

DMARC-raporttien hallintapaneeli tarjoaa:

* **Yhteenvetomittarit**: Vastaanotettujen raporttien kokonaismäärä, analysoitujen viestien kokonaismäärä, SPF-tarkistuksen osuus, DKIM-tarkistuksen osuus ja kokonaisläpäisyprosentti
* **Viestien määrä ajan kuluessa -kaavio**: Visuaalinen trendi sähköpostimäärästä ja todennusprosenteista viimeisen 30 päivän ajalta
* **Tarkistusten yhteenveto**: Donitsikaavio, joka näyttää SPF:n ja DKIM:n tarkistusten jakauman
* **Viestien käsittely**: Pinottu palkkikaavio, joka näyttää, miten vastaanottavat palvelimet käsittelivät sähköpostisi (hyväksyivät, laittoivat karanteeniin tai hylkäsivät)
* **Viimeisimmät raportit -taulukko**: Yksityiskohtainen lista yksittäisistä DMARC-raporteista suodattimineen ja sivutuksineen
* **Verkkotunnuksen suodatus**: Suodata raportteja tietyn verkkotunnuksen mukaan, kun hallinnoit useita verkkotunnuksia
**Miksi tämä on tärkeää**

Organisaatioille, jotka hallinnoivat useita domaineja (kuten yritykset, voittoa tavoittelemattomat järjestöt tai toimistot), DMARC-raportit ovat välttämättömiä:

* **Luvattomien lähettäjien tunnistamiseen**: Havaitse, jos joku väärentää domainiasi
* **Toimitettavuuden parantamiseen**: Varmista, että lailliset sähköpostisi läpäisevät todennuksen
* **Sähköpostin infrastruktuurin valvontaan**: Seuraa, mitkä palvelut ja IP-osoitteet lähettävät puolestasi
* **Säännösten noudattamiseen**: Säilytä näkyvyys sähköpostin todennukseen turvallisuustarkastuksia varten

Toisin kuin muut palvelut, jotka vaativat erillisiä DMARC-valvontatyökaluja, Forward Email sisältää DMARC-raporttien käsittelyn ja visualisoinnin osana tiliäsi ilman lisäkustannuksia.

**Vaatimukset**

* DMARC-raportit ovat saatavilla vain maksullisissa suunnitelmissa
* Domainillasi on oltava DMARC-konfiguraatio (katso [Kuinka asetan DMARC:n Forward Emailille](#how-do-i-set-up-dmarc-for-forward-email))
* Raportit kerätään automaattisesti, kun vastaanottavat sähköpostipalvelimet lähettävät ne määrittämääsi DMARC-raportointiosoitteeseen

**Viikoittaiset sähköpostiraportit**

Maksullisen suunnitelman käyttäjät saavat automaattisesti viikoittaiset DMARC-raporttien yhteenvedot sähköpostitse. Näissä sähköposteissa on:

* Yhteenvetotilastot kaikista domaineistasi
* SPF- ja DKIM-tarkistusten osumatarkkuudet
* Viestien käsittelyn jakauma (hyväksytty, karanteeniin asetettu, hylätty)
* Suurimmat raportointiorganisaatiot (Google, Microsoft, Yahoo jne.)
* IP-osoitteet, joilla on tarkistuksen ongelmia ja jotka saattavat vaatia huomiota
* Suorat linkit DMARC-raporttien hallintapaneeliin

Viikkoraportit lähetetään automaattisesti, eikä niitä voi poistaa käytöstä erikseen muista sähköposti-ilmoituksista.

### Kuinka yhdistän ja konfiguroin yhteystietoni {#how-do-i-connect-and-configure-my-contacts}

**Konfiguroidaksesi yhteystietosi, käytä CardDAV-URL-osoitetta:** `https://carddav.forwardemail.net` (tai yksinkertaisesti `carddav.forwardemail.net`, jos asiakasohjelmasi sallii sen)

### Kuinka yhdistän ja konfiguroin kalenterini {#how-do-i-connect-and-configure-my-calendars}

**Konfiguroidaksesi kalenterisi, käytä CalDAV-URL-osoitetta:** `https://caldav.forwardemail.net` (tai yksinkertaisesti `caldav.forwardemail.net`, jos asiakasohjelmasi sallii sen)

<img width="612" height="520" src="/img/faq/calendar-setup.png" alt="Forward Email Calendar CalDAV Thunderbird Example Setup" />

### Kuinka lisään lisää kalentereita ja hallinnoin olemassa olevia kalentereita {#how-do-i-add-more-calendars-and-manage-existing-calendars}

Jos haluat lisätä lisää kalentereita, lisää uusi kalenterin URL-osoite: `https://caldav.forwardemail.net/dav/principals/calendar-name` (**muista korvata `calendar-name` haluamallasi kalenterin nimellä**)

Voit muuttaa kalenterin nimeä ja väriä luomisen jälkeen – käytä vain suosikkikalenterisovellustasi (esim. Apple Mail tai [Thunderbird](https://thunderbird.net)).

### Kuinka yhdistän ja konfiguroin tehtävät ja muistutukset {#how-do-i-connect-and-configure-tasks-and-reminders}

**Konfiguroidaksesi tehtävät ja muistutukset, käytä samaa CalDAV-URL-osoitetta kuin kalentereissa:** `https://caldav.forwardemail.net` (tai yksinkertaisesti `caldav.forwardemail.net`, jos asiakasohjelmasi sallii sen)

Tehtävät ja muistutukset erotellaan automaattisesti kalenteritapahtumista omaksi "Muistutukset" tai "Tehtävät" -kalenterikokoelmaksi.

**Asennusohjeet alustakohtaisesti:**

**macOS/iOS:**

1. Lisää uusi CalDAV-tili Järjestelmäasetuksissa > Internet-tilit (tai Asetukset > Tilit iOS:llä)
2. Käytä palvelimena `caldav.forwardemail.net`
3. Syötä Forward Email -alias ja luotu salasana
4. Asennuksen jälkeen näet sekä "Kalenteri" että "Muistutukset" -kokoelmat
5. Käytä Muistutukset-sovellusta tehtävien luomiseen ja hallintaan

**Android Tasks.org -sovelluksella:**

1. Asenna Tasks.org Google Play Kaupasta tai F-Droidista
2. Mene Asetukset > Synkronointi > Lisää tili > CalDAV
3. Syötä palvelin: `https://caldav.forwardemail.net`
4. Syötä Forward Email -alias ja luotu salasana
5. Tasks.org löytää automaattisesti tehtäväkalenterisi

**Thunderbird:**

1. Asenna Lightning-lisäosa, jos sitä ei ole jo asennettu
2. Luo uusi kalenteri tyypillä "CalDAV"
3. Käytä URL-osoitetta: `https://caldav.forwardemail.net`
4. Syötä Forward Email -tunnuksesi
5. Sekä tapahtumat että tehtävät ovat käytettävissä kalenterin käyttöliittymässä

### Miksi en voi luoda tehtäviä macOS Muistutuksissa {#why-cant-i-create-tasks-in-macos-reminders}
Jos sinulla on ongelmia tehtävien luomisessa macOS Reminders -sovelluksessa, kokeile näitä vianmääritysvaiheita:

1. **Tarkista tilin asetukset**: Varmista, että CalDAV-tilisi on oikein määritetty käyttämään `caldav.forwardemail.net`

2. **Varmista erilliset kalenterit**: Tililläsi pitäisi näkyä sekä "Calendar" että "Reminders". Jos näet vain "Calendar", tehtävien tuki ei ehkä ole vielä täysin aktivoitu.

3. **Päivitä tili**: Kokeile poistaa ja lisätä CalDAV-tilisi uudelleen Järjestelmäasetukset > Internet-tilit -kohdassa

4. **Tarkista palvelinyhteys**: Testaa, että pääset selaimella osoitteeseen `https://caldav.forwardemail.net`

5. **Varmista tunnistetiedot**: Käytä oikeaa alias-sähköpostiosoitetta ja generoitu salasanaa (ei tilisi pääsalasanaa)

6. **Pakota synkronointi**: Reminders-sovelluksessa yritä luoda tehtävä ja päivitä sitten synkronointi manuaalisesti

**Yleisiä ongelmia:**

* **"Reminders calendar not found"**: Palvelin saattaa tarvita hetken luodakseen Reminders-kokoelman ensimmäisellä käyttökerralla
* **Tehtävät eivät synkronoidu**: Varmista, että molemmat laitteet käyttävät samoja CalDAV-tilin tunnistetietoja
* **Sekalainen sisältö**: Varmista, että tehtävät luodaan "Reminders"-kalenteriin, ei yleiseen "Calendar"-kalenteriin

### Kuinka asetan Tasks.orgin Androidille {#how-do-i-set-up-tasksorg-on-android}

Tasks.org on suosittu avoimen lähdekoodin tehtävienhallintasovellus, joka toimii erinomaisesti Forward Emailin CalDAV-tehtävätuen kanssa.

**Asennus ja määritys:**

1. **Asenna Tasks.org**:
   * Google Play Kaupasta: [Tasks.org](https://play.google.com/store/apps/details?id=org.tasks)
   * F-Droidista: [Tasks.org on F-Droid](https://f-droid.org/packages/org.tasks/)

2. **Määritä CalDAV-synkronointi**:
   * Avaa Tasks.org
   * Mene ☰ Valikko > Asetukset > Synkronointi
   * Napauta "Lisää tili"
   * Valitse "CalDAV"

3. **Syötä Forward Emailin asetukset**:
   * **Palvelimen URL**: `https://caldav.forwardemail.net`
   * **Käyttäjätunnus**: Forward Email -alias (esim. `sinä@omainen.com`)
   * **Salasana**: Alias-kohtainen generoitu salasana
   * Napauta "Lisää tili"

4. **Tilin haku**:
   * Tasks.org löytää automaattisesti tehtäväkalenterisi
   * Näet "Reminders"-kokoelman ilmestyvän
   * Napauta "Tilaa" ottaaksesi tehtäväkalenterin synkronoinnin käyttöön

5. **Testaa synkronointi**:
   * Luo testitehtävä Tasks.orgissa
   * Tarkista, että se näkyy muissa CalDAV-asiakkaissa (kuten macOS Reminders)
   * Varmista, että muutokset synkronoituvat molempiin suuntiin

**Saatavilla olevat ominaisuudet:**

* ✅ Tehtävien luonti ja muokkaus
* ✅ Eräpäivät ja muistutukset
* ✅ Tehtävien suoritus ja tila
* ✅ Prioriteettitasot
* ✅ Alitehtävät ja tehtävähierarkia
* ✅ Tunnisteet ja kategoriat
* ✅ Kaksisuuntainen synkronointi muiden CalDAV-asiakkaiden kanssa

**Vianmääritys:**

* Jos tehtäväkalentereita ei näy, kokeile päivittää manuaalisesti Tasks.orgin asetuksissa
* Varmista, että palvelimella on vähintään yksi tehtävä (voit luoda sellaisen ensin macOS Remindersissa)
* Tarkista verkkoyhteys `caldav.forwardemail.net`-osoitteeseen

### Kuinka asetan SRS:n Forward Emailille {#how-do-i-set-up-srs-for-forward-email}

Määritämme automaattisesti [Sender Rewriting Scheme](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme) ("SRS") – sinun ei tarvitse tehdä tätä itse.

### Kuinka asetan MTA-STS:n Forward Emailille {#how-do-i-set-up-mta-sts-for-forward-email}

Katso lisätietoja [MTA-STS-osastostamme](#do-you-support-mta-sts).

### Kuinka lisään profiilikuvan sähköpostiosoitteeseeni {#how-do-i-add-a-profile-picture-to-my-email-address}

Jos käytät Gmailia, noudata alla olevia ohjeita:

1. Mene osoitteeseen <https://google.com> ja kirjaudu ulos kaikista sähköpostitileistä
2. Klikkaa "Kirjaudu sisään" ja valitse avattavasta valikosta "muu tili"
3. Valitse "Käytä toista tiliä"
4. Valitse "Luo tili"
5. Valitse "Käytä nykyistä sähköpostiosoitettani sen sijaan"
6. Syötä mukautetun verkkotunnuksesi sähköpostiosoite
7. Nouda vahvistussähköposti, joka lähetettiin sähköpostiosoitteeseesi
8. Syötä tämän sähköpostin vahvistuskoodi
9. Täytä profiilitiedot uudelle Google-tilillesi
10. Hyväksy kaikki tietosuojan ja käyttöehtojen politiikat
11. Mene osoitteeseen <https://google.com>, klikkaa oikeassa yläkulmassa profiilikuvakettasi ja valitse "muuta"
12. Lataa uusi kuva tai avatar tilillesi
13. Muutosten leviämiseen kuluu noin 1–2 tuntia, mutta joskus se tapahtuu hyvin nopeasti.
14. Lähetä testisähköposti, ja profiilikuva pitäisi näkyä.
## Edistyneet ominaisuudet {#advanced-features}

### Tuetteko uutiskirjeitä tai markkinointisähköpostiin liittyviä postituslistoja {#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email}

Kyllä, voit lukea lisää osoitteesta <https://forwardemail.net/guides/newsletter-with-listmonk>.

Huomioithan, että IP-maineen ylläpitämiseksi ja toimitettavuuden varmistamiseksi Forward Emailillä on manuaalinen tarkistusprosessi kunkin verkkotunnuksen osalta **uutiskirjeiden hyväksyntää** varten. Lähetä sähköpostia osoitteeseen <support@forwardemail.net> tai avaa [tukipyyntö](https://forwardemail.net/help) hyväksyntää varten. Tämä kestää tyypillisesti alle 24 tuntia, ja useimmat pyynnöt käsitellään 1–2 tunnin sisällä. Lähitulevaisuudessa pyrimme tekemään tämän prosessin välittömäksi lisättyjen roskapostin valvontojen ja hälytysten avulla. Tämä prosessi varmistaa, että sähköpostisi saavuttavat vastaanottajan postilaatikon eivätkä viestisi merkitseydy roskapostiksi.

### Tuetteko sähköpostin lähettämistä API:n kautta {#do-you-support-sending-email-with-api}

Kyllä, toukokuusta 2023 lähtien tuemme sähköpostin lähettämistä API:n kautta lisäominaisuutena kaikille maksaville käyttäjille.

<div class="alert my-3 alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tärkeää:
  </strong>
  <span>
    Varmistathan, että olet lukenut <a href="/terms" class="alert-link" target="_blank">käyttöehdot</a>, <a href="/privacy" class="alert-link" target="_blank">tietosuojakäytännön</a> ja <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">lähtö-SMTP-rajoitukset</a> &ndash; käyttöäsi pidetään hyväksyntänä ja sopimuksena.
  </span>
</div>

Tutustu API-dokumentaatiomme kohtaan [Sähköpostit](/email-api#outbound-emails) vaihtoehtojen, esimerkkien ja lisätietojen saamiseksi.

Lähettääksesi lähtevää sähköpostia API:n kautta, sinun on käytettävä API-tunnustasi, joka löytyy kohdasta [Oma turvallisuus](/my-account/security).

### Tuetteko sähköpostin vastaanottamista IMAPin kautta {#do-you-support-receiving-email-with-imap}

Kyllä, 16. lokakuuta 2023 alkaen tuemme sähköpostin vastaanottamista IMAPin kautta lisäominaisuutena kaikille maksaville käyttäjille.  **Lue syventävä artikkelimme** siitä, [miten salattu SQLite-postilaatikon tallennusominaisuutemme toimii](/blog/docs/best-quantum-safe-encrypted-email-service).

<div id="imap-instructions">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tärkeää:
  </strong>
  <span>
    Varmistathan, että olet lukenut <a href="/terms" class="alert-link" target="_blank">käyttöehdot</a> ja <a href="/privacy" class="alert-link" target="_blank">tietosuojakäytännön</a> &ndash; käyttöäsi pidetään hyväksyntänä ja sopimuksena.
  </span>
</div>

1. Luo uusi alias verkkotunnuksellesi kohdassa <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Oma tili <i class="fa fa-angle-right"></i> Verkkotunnukset</a> <i class="fa fa-angle-right"></i> Aliakset (esim. <code><hello@example.com></code>)

2. Klikkaa <strong class="text-success"><i class="fa fa-key"></i> Luo salasana</strong> juuri luodun aliaksen vieressä. Kopioi salasana leikepöydällesi ja säilytä se turvallisesti.

3. Lisää tai määritä tili sähköpostisovelluksessasi käyttäen juuri luomaasi aliasosoitetta (esim. <code><hello@example.com></code>)
   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Vinkki:
     </strong>
     <span>Suosittelemme käyttämään <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbirdiä</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobilea</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mailia</a> tai <a href="/blog/open-source" class="alert-link" target="_blank">avoimen lähdekoodin ja yksityisyyteen keskittyvää vaihtoehtoa</a>.</span>
   </div>

4. Kun sinulta kysytään IMAP-palvelimen nimeä, syötä `imap.forwardemail.net`

5. Kun sinulta kysytään IMAP-palvelimen porttia, syötä `993` (SSL/TLS) – katso tarvittaessa [vaihtoehtoiset IMAP-portit](/faq#what-are-your-imap-server-configuration-settings)
   <div class="alert my-3 alert-warning">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Vinkki:
     </strong>
     <span>Jos käytät Thunderbirdiä, varmista että "Yhteyden suojaus" on asetettu "SSL/TLS" ja todennusmenetelmäksi "Normaali salasana".</span>
   </div>
6. Kun sinulta pyydetään IMAP-palvelimen salasanaa, liitä salasana, jonka sait kohdassa 2 yllä <strong class="text-success"><i class="fa fa-key"></i> Luo salasana</strong>

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

### Tuetteko POP3:ta {#do-you-support-pop3}

Kyllä, 4. joulukuuta 2023 alkaen tuemme [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol) -lisäosaa kaikille maksaville käyttäjille.  **Lue syvällinen artikkelimme** siitä, [miten salattu SQLite-postilaatikon tallennusominaisuutemme toimii](/blog/docs/best-quantum-safe-encrypted-email-service).

<div id="pop3-instructions">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tärkeää:
  </strong>
  <span>
    Varmistathan, että olet lukenut <a href="/terms" class="alert-link" target="_blank">käyttöehdot</a> ja <a href="/privacy" class="alert-link" target="_blank">tietosuojakäytännön</a> &ndash; palvelun käyttö katsotaan hyväksynnäksi ja sopimukseksi.
  </span>
</div>

1. Luo uusi alias domainillesi kohdassa <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Oma tili <i class="fa fa-angle-right"></i> Domainit</a> <i class="fa fa-angle-right"></i> Aliakset (esim. <code><hello@example.com></code>)

2. Klikkaa <strong class="text-success"><i class="fa fa-key"></i> Luo salasana</strong> juuri luodun aliaksen vieressä. Kopioi salasana leikepöydälle ja säilytä se turvallisesti.

3. Lisää tai määritä tili sähköpostisovelluksessasi käyttäen uutta aliastasi (esim. <code><hello@example.com></code>)
   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Vinkki:
     </strong>
     <span>Suosittelemme käyttämään <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbirdiä</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobilea</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mailia</a> tai <a href="/blog/open-source" class="alert-link" target="_blank">avoimen lähdekoodin ja yksityisyyteen keskittyvää vaihtoehtoa</a>.</span>
   </div>

4. Kun sinulta pyydetään POP3-palvelimen nimeä, kirjoita `pop3.forwardemail.net`

5. Kun sinulta pyydetään POP3-palvelimen porttia, kirjoita `995` (SSL/TLS) – katso tarvittaessa [vaihtoehtoiset POP3-portit](/faq#what-are-your-pop3-server-configuration-settings)
   <div class="alert my-3 alert-warning">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Vinkki:
     </strong>
     <span>Jos käytät Thunderbirdiä, varmista että "Yhteyden suojaus" on asetettu "SSL/TLS" ja Todennusmenetelmä on "Normaali salasana".</span>
   </div>

6. Kun sinulta pyydetään POP3-palvelimen salasanaa, liitä salasana, jonka sait kohdassa 2 yllä <strong class="text-success"><i class="fa fa-key"></i> Luo salasana</strong>

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

### Tuetteko kalentereita (CalDAV) {#do-you-support-calendars-caldav}

Kyllä, 5. helmikuuta 2024 alkaen olemme lisänneet tämän ominaisuuden. Palvelimemme on `caldav.forwardemail.net` ja sitä valvotaan myös <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">tilasivullamme</a>.
Se tukee sekä IPv4- että IPv6-protokollia ja on saatavilla portin `443` (HTTPS) kautta.

| Kirjautuminen | Esimerkki                  | Kuvaus                                                                                                                                                                                   |
| ------------ | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Käyttäjätunnus | `user@example.com`         | Sähköpostiosoite aliakselle, joka on olemassa kyseiselle domainille kohdassa <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Oma tili <i class="fa fa-angle-right"></i> Domainit</a>. |
| Salasana    | `************************` | Aliaskohtaisesti luotu salasana.                                                                                                                                                          |

Kalenterituen käyttämiseksi **käyttäjän** on oltava aliaksen sähköpostiosoite, joka on olemassa kyseiselle domainille kohdassa <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Oma tili <i class="fa fa-angle-right"></i> Domainit</a> – ja **salasanan** on oltava aliaskohtaisesti luotu salasana.

### Tuetteko tehtäviä ja muistutuksia (CalDAV VTODO) {#do-you-support-tasks-and-reminders-caldav-vtodo}

Kyllä, 14. lokakuuta 2025 alkaen olemme lisänneet CalDAV VTODO -tuet tehtäville ja muistutuksille. Tämä käyttää samaa palvelinta kuin kalenteritukemme: `caldav.forwardemail.net`.

CalDAV-palvelimemme tukee sekä kalenteritapahtumia (VEVENT) että tehtäviä (VTODO) komponentteina käyttäen **yhdistettyjä kalentereita**. Tämä tarkoittaa, että jokainen kalenteri voi sisältää sekä tapahtumia että tehtäviä, tarjoten maksimaalisen joustavuuden ja yhteensopivuuden kaikkien CalDAV-asiakkaiden välillä.

**Miten kalenterit ja listat toimivat:**

* **Jokainen kalenteri tukee sekä tapahtumia että tehtäviä** – Voit lisätä tapahtumia, tehtäviä tai molempia mihin tahansa kalenteriin
* **Apple Reminders -listat** – Jokainen Apple Remindersissa luomasi lista muuttuu erilliseksi kalenteriksi palvelimella
* **Useita kalentereita** – Voit luoda niin monta kalenteria kuin tarvitset, jokaisella oma nimi, väri ja järjestely
* **Ristiin-asiakas synkronointi** – Tehtävät ja tapahtumat synkronoituvat saumattomasti kaikkien yhteensopivien asiakkaiden välillä

**Tuetut tehtäväasiakkaat:**

* **macOS Reminders** – Täysi natiivituki tehtävien luomiselle, muokkaukselle, suorittamiselle ja synkronoinnille
* **iOS Reminders** – Täysi natiivituki kaikilla iOS-laitteilla
* **Tasks.org (Android)** – Suosittu avoimen lähdekoodin tehtävienhallinta CalDAV-synkronoinnilla
* **Thunderbird** – Tehtävä- ja kalenterituki työpöytäsähköpostiohjelmassa
* **Mikä tahansa CalDAV-yhteensopiva tehtävienhallintaohjelma** – Standardin VTODO-komponentin tuki

**Tuetut tehtäväominaisuudet:**

* Tehtävien luonti, muokkaus ja poisto
* Eräpäivät ja aloituspäivät
* Tehtävän suoritusstatus (NEEDS-ACTION, IN-PROCESS, COMPLETED, CANCELLED)
* Tehtävien prioriteettitasot
* Toistuvat tehtävät
* Tehtävien kuvaukset ja muistiinpanot
* Monilaitteinen synkronointi
* Alitehtävät RELATED-TO-ominaisuudella
* Tehtävien muistutukset VALARMilla

Kirjautumistiedot ovat samat kuin kalenterituen kohdalla:

| Kirjautuminen | Esimerkki                  | Kuvaus                                                                                                                                                                                   |
| ------------ | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Käyttäjätunnus | `user@example.com`         | Sähköpostiosoite aliakselle, joka on olemassa kyseiselle domainille kohdassa <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Oma tili <i class="fa fa-angle-right"></i> Domainit</a>. |
| Salasana    | `************************` | Aliaskohtaisesti luotu salasana.                                                                                                                                                          |

**Tärkeitä huomioita:**

* **Jokainen Reminders-lista on erillinen kalenteri** – Kun luot uuden listan Apple Remindersissa, se luo uuden kalenterin CalDAV-palvelimelle
* **Thunderbird-käyttäjät** – Sinun täytyy tilata manuaalisesti jokainen kalenteri/lista, jonka haluat synkronoida, tai käyttää kalenterin kotisivun URL-osoitetta: `https://caldav.forwardemail.net/dav/your-email@domain.com/`
* **Apple-käyttäjät** – Kalenterin löytyminen tapahtuu automaattisesti, joten kaikki kalenterisi ja listasi näkyvät Calendar.appissa ja Reminders.appissa
* **Yhdistetyt kalenterit** – Kaikki kalenterit tukevat sekä tapahtumia että tehtäviä, tarjoten joustavuutta datan järjestämiseen
### Tuetko yhteystietoja (CardDAV) {#do-you-support-contacts-carddav}

Kyllä, 12. kesäkuuta 2025 alkaen olemme lisänneet tämän ominaisuuden. Palvelimemme on `carddav.forwardemail.net` ja sitä valvotaan myös <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">tilasivullamme</a>.

Se tukee sekä IPv4- että IPv6-protokollia ja on käytettävissä portin `443` (HTTPS) kautta.

| Kirjautuminen | Esimerkki                  | Kuvaus                                                                                                                                                                                   |
| ------------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Käyttäjätunnus | `user@example.com`         | Sähköpostiosoite aliakselle, joka on olemassa kyseiselle domainille kohdassa <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Oma tili <i class="fa fa-angle-right"></i> Domainit</a>. |
| Salasana      | `************************` | Aliaskohtaisesti luotu salasana.                                                                                                                                                          |

Jotta voit käyttää yhteystukitoimintoa, **käyttäjän** on oltava sähköpostiosoite aliakselle, joka on olemassa kyseiselle domainille kohdassa <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Oma tili <i class="fa fa-angle-right"></i> Domainit</a> – ja **salasanan** on oltava aliaskohtaisesti luotu salasana.

### Tuetko sähköpostin lähettämistä SMTP:llä {#do-you-support-sending-email-with-smtp}

Kyllä, toukokuusta 2023 alkaen tuemme sähköpostin lähettämistä SMTP:n kautta lisäominaisuutena kaikille maksaville käyttäjille.

<div id="smtp-instructions">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tärkeää:
  </strong>
  <span>
    Varmistathan, että olet lukenut <a href="/terms" class="alert-link" target="_blank">käyttöehdot</a>, <a href="/privacy" class="alert-link" target="_blank">tietosuojakäytännön</a> ja <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">lähtö-SMTP-rajoitukset</a> &ndash; palvelun käyttö katsotaan hyväksynnäksi ja sopimukseksi.
  </span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tärkeää:
  </strong>
  <span>
    Jos käytät Gmailia, tutustu ohjeeseemme <a class="alert-link" href="/guides/send-mail-as-gmail-custom-domain">Lähetä sähköpostia Gmailin mukautetulla domainilla</a>. Jos olet kehittäjä, tutustu <a class="alert-link" href="/email-api#outbound-emails" target="_blank">sähköpostin API-dokumentaatioon</a>.
  </span>
</div>

1. Siirry kohtaan <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Oma tili <i class="fa fa-angle-right"></i> Domainit</a> <i class="fa fa-angle-right"></i> Asetukset <i class="fa fa-angle-right"></i> Lähtö-SMTP-asetukset ja seuraa asennusohjeita

2. Luo uusi alias domainillesi kohdassa <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Oma tili <i class="fa fa-angle-right"></i> Domainit</a> <i class="fa fa-angle-right"></i> Aliakset (esim. <code><hello@example.com></code>)

3. Klikkaa <strong class="text-success"><i class="fa fa-key"></i> Luo salasana</strong> juuri luodun aliaksen vieressä. Kopioi salasana leikepöydälle ja säilytä se turvallisesti.

4. Lisää tai määritä sähköpostisovelluksessasi tili uudella aliaksellasi (esim. <code><hello@example.com></code>)
   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Vinkki:
     </strong>
     <span>Suosittelemme käyttämään <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbirdiä</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobilea</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mailia</a> tai <a href="/blog/open-source" class="alert-link" target="_blank">avoimen lähdekoodin ja yksityisyyttä korostavaa vaihtoehtoa</a>.</span>
   </div>
5. Kun sinulta kysytään SMTP-palvelimen nimeä, kirjoita `smtp.forwardemail.net`

6. Kun sinulta kysytään SMTP-palvelimen porttia, kirjoita `465` (SSL/TLS) – katso tarvittaessa [vaihtoehtoiset SMTP-portit](/faq#what-are-your-smtp-server-configuration-settings)
   <div class="alert my-3 alert-warning">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Vinkki:
     </strong>
     <span>Jos käytät Thunderbirdiä, varmista, että "Yhteyden suojaus" on asetettu "SSL/TLS" ja Todennusmenetelmä on asetettu "Normaali salasana".</span>
   </div>

7. Kun sinulta kysytään SMTP-palvelimen salasanaa, liitä salasana kohdasta <strong class="text-success"><i class="fa fa-key"></i> Luo salasana</strong> yllä kohdassa 3

8. **Tallenna asetuksesi ja lähetä ensimmäinen testisähköpostisi** – jos sinulla on ongelmia, <a href="/help">ota meihin yhteyttä</a>

<div class="alert my-3 alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tärkeää:
  </strong>
  <span>
    Huomioithan, että IP-maineen ylläpitämiseksi ja toimitettavuuden varmistamiseksi meillä on manuaalinen tarkastusprosessi lähtö-SMTP:n hyväksynnälle domain-kohtaisesti. Tämä kestää tyypillisesti alle 24 tuntia, ja useimmat pyynnöt käsitellään 1–2 tunnin sisällä. Lähitulevaisuudessa pyrimme tekemään tämän prosessin välittömäksi lisättyjen roskapostin valvontojen ja hälytysten avulla. Tämä prosessi varmistaa, että sähköpostisi saavuttavat vastaanottajan postilaatikon eivätkä viestisi merkitseydy roskapostiksi.
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

### Tuetteko OpenPGP/MIMEä, päästä päähän -salausta ("E2EE") ja Web Key Directoryä ("WKD") {#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd}

Kyllä, tuemme [OpenPGP:tä](https://en.wikipedia.org/wiki/Pretty_Good_Privacy#OpenPGP), [päästä päähän -salausta ("E2EE")](https://en.wikipedia.org/wiki/End-to-end_encryption) sekä julkisten avainten löytämistä käyttämällä [Web Key Directoryä ("WKD")](https://wiki.gnupg.org/WKD). Voit konfiguroida OpenPGP:n käyttämällä [keys.openpgp.org](https://keys.openpgp.org/about/usage#wkd-as-a-service) tai [isännöidä omia avaimiasi itse](https://wiki.gnupg.org/WKDHosting) (katso [tämä gist WKD-palvelimen asennuksesta](https://gist.github.com/kafene/0a6e259996862d35845784e6e5dbfc79)).

* WKD-haut välimuistitetaan tunnin ajaksi varmistaaksemme sähköpostin ajantasaisen toimituksen → siksi jos lisäät, muutat tai poistat WKD-avaimesi, lähetä meille sähköpostia osoitteeseen `support@forwardemail.net` sähköpostiosoitteesi kanssa, jotta voimme manuaalisesti tyhjentää välimuistin.
* Tuemme PGP-salausta viesteille, jotka välitetään WKD-haun kautta tai käyttämällä ladattua PGP-avainta käyttöliittymässämme.
* Ladatut avaimet ovat etusijalla niin kauan kuin PGP-valintaruutu on käytössä/ruksattu.
* Webhookeille lähetetyt viestit eivät tällä hetkellä ole PGP-salattuja.
* Jos sinulla on useita aliaksia, jotka vastaavat tiettyä välitysohjetta (esim. regex/wildcard/tarkka yhdistelmä) ja jos useampi näistä sisältää ladatun PGP-avaimen ja PGP on valittuna → lähetämme sinulle virheilmoituksen sähköpostitse emmekä salaa viestiä ladatulla PGP-avaimellasi. Tämä on hyvin harvinaista ja koskee yleensä vain edistyneitä käyttäjiä, joilla on monimutkaiset alias-säännöt.
* **PGP-salausta ei sovelleta sähköpostin välitykseen MX-palvelimemme kautta, jos lähettäjällä on DMARC-käytäntö "reject". Jos tarvitset PGP-salauksen *kaikissa* viesteissä, suosittelemme käyttämään IMAP-palveluamme ja konfiguroimaan PGP-avaimesi aliaksellesi saapuvaa postia varten.**

**Voit tarkistaa Web Key Directory -asetuksesi osoitteessa <https://wkd.chimbosonic.com/> (avoin lähdekoodi) tai <https://www.webkeydirectory.com/> (proprietaarinen).**

<div class="alert my-3 alert-success">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Automaattinen salaus:
  </strong>
  <span>Jos käytät <a href="#do-you-support-sending-email-with-smtp" class="alert-link">lähtö-SMTP-palveluamme</a> ja lähetät salaamattomia viestejä, yritämme automaattisesti salata viestit vastaanottajakohtaisesti käyttäen <a class="alert-link" href="https://wiki.gnupg.org/WKD">Web Key Directoryä ("WKD")</a>.</span>
</div>
<div class="alert alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tärkeää:
  </strong>
  <span>
    Sinun on noudatettava kaikkia seuraavia vaiheita ottaaksesi OpenPGP:n käyttöön omalla verkkotunnuksellasi.
  </span>
</div>

1. Lataa ja asenna alla sähköpostiohjelmasi suosittelema lisäosa:

   | Sähköpostiohjelma | Alusta  | Suositeltu lisäosa                                                                                                                                                                    | Huomautukset                                                                                                                                                                                                                                                                                                                                                                                                                             |
   | ----------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | Thunderbird       | Työpöytä | [Määritä OpenPGP Thunderbirdissä](https://support.mozilla.org/en-US/kb/openpgp-thunderbird-howto-and-faq#w_i-have-never-used-openpgp-with-thunderbird-before-how-do-i-setup-openpgp) | Thunderbird tukee OpenPGP:tä sisäänrakennetusti.                                                                                                                                                                                                                                                                                                                                                                                        |
   | Gmail             | Selain  | [Mailvelope](https://mailvelope.com/) tai [FlowCrypt](https://flowcrypt.com/download) (proprietary license)                                                                            | Gmail ei tue OpenPGP:tä, mutta voit ladata avoimen lähdekoodin lisäosan [Mailvelope](https://mailvelope.com/) tai [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                                                           |
   | Apple Mail        | macOS   | [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation)                                                                                          | Apple Mail ei tue OpenPGP:tä, mutta voit ladata avoimen lähdekoodin lisäosan [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation).                                                                                                                                                                                                                                                                |
   | Apple Mail        | iOS     | [PGPro](https://github.com/opensourceios/PGPro/) tai [FlowCrypt](https://apps.apple.com/us/app/flowcrypt-encrypted-email/id1591754995) (proprietary license)                           | Apple Mail ei tue OpenPGP:tä, mutta voit ladata avoimen lähdekoodin lisäosan [PGPro](https://github.com/opensourceios/PGPro/) tai [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                                           |
   | Outlook           | Windows | [gpg4win](https://www.gpg4win.de/index.html)                                                                                                                                          | Outlookin työpöytäsähköpostiohjelma ei tue OpenPGP:tä, mutta voit ladata avoimen lähdekoodin lisäosan [gpg4win](https://www.gpg4win.de/index.html).                                                                                                                                                                                                                                                                                       |
   | Outlook           | Selain  | [Mailvelope](https://mailvelope.com/) tai [FlowCrypt](https://flowcrypt.com/download) (proprietary license)                                                                            | Outlookin selainpohjainen sähköpostiohjelma ei tue OpenPGP:tä, mutta voit ladata avoimen lähdekoodin lisäosan [Mailvelope](https://mailvelope.com/) tai [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                       |
   | Android           | Mobiili | [OpenKeychain](https://www.openkeychain.org/) tai [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email)                                                       | [Android-sähköpostiohjelmat](/blog/open-source/android-email-clients) kuten [Thunderbird Mobile](https://www.thunderbird.net/en-US/mobile/) ja [FairEmail](https://github.com/M66B/FairEmail) tukevat avoimen lähdekoodin lisäosaa [OpenKeychain](https://www.openkeychain.org/). Vaihtoehtoisesti voit käyttää avoimen lähdekoodin (proprietary licensing) lisäosaa [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email). |
   | Google Chrome     | Selain  | [Mailvelope](https://mailvelope.com/) tai [FlowCrypt](https://flowcrypt.com/download) (proprietary license)                                                                            | Voit ladata avoimen lähdekoodin selaimen lisäosan [Mailvelope](https://mailvelope.com/) tai [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                                                                                |
   | Mozilla Firefox   | Selain  | [Mailvelope](https://mailvelope.com/) tai [FlowCrypt](https://flowcrypt.com/download) (proprietary license)                                                                            | Voit ladata avoimen lähdekoodin selaimen lisäosan [Mailvelope](https://mailvelope.com/) tai [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                                                                                |
   | Microsoft Edge    | Selain  | [Mailvelope](https://mailvelope.com/)                                                                                                                                                 | Voit ladata avoimen lähdekoodin selaimen lisäosan [Mailvelope](https://mailvelope.com/).                                                                                                                                                                                                                                                                                                                                                 |
   | Brave             | Selain  | [Mailvelope](https://mailvelope.com/) tai [FlowCrypt](https://flowcrypt.com/download) (proprietary license)                                                                            | Voit ladata avoimen lähdekoodin selaimen lisäosan [Mailvelope](https://mailvelope.com/) tai [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                                                                                |
   | Balsa             | Työpöytä | [Määritä OpenPGP Balsassa](https://www.mynetcologne.de/~nc-dreszal/balsa/balsa23-secure-mail.html#USING)                                                                              | Balsa tukee OpenPGP:tä sisäänrakennetusti.                                                                                                                                                                                                                                                                                                                                                                                             |
   | KMail             | Työpöytä | [Määritä OpenPGP KMailissa](https://userbase.kde.org/KMail/PGP_MIME)                                                                                                                 | KMail tukee OpenPGP:tä sisäänrakennetusti.                                                                                                                                                                                                                                                                                                                                                                                             |
   | GNOME Evolution   | Työpöytä | [Määritä OpenPGP Evolutionissa](https://help.gnome.org/users/evolution/stable/mail-encryption.html.en)                                                                               | GNOME Evolution tukee OpenPGP:tä sisäänrakennetusti.                                                                                                                                                                                                                                                                                                                                                                                   |
   | Terminal          | Työpöytä | [Määritä gpg Terminalissa](https://docs.github.com/en/authentication/managing-commit-signature-verification/generating-a-new-gpg-key#generating-a-gpg-key)                           | Voit käyttää avointa lähdekoodia olevaa [gpg-komentorivityökalua](https://www.gnupg.org/download/) uuden avaimen luomiseen komentoriviltä.                                                                                                                                                                                                                                                                                               |
2. Avaa lisäosa, luo julkinen avaimesi ja määritä sähköpostiohjelmasi käyttämään sitä.

3. Lataa julkinen avaimesi osoitteessa <https://keys.openpgp.org/upload>.

   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Vinkki:
     </strong>
     <span>Voit käydä osoitteessa <a class="alert-link" href="https://keys.openpgp.org/manage">https://keys.openpgp.org/manage</a hallinnoidaksesi avaintasi tulevaisuudessa.</span>
   </div>

   <div class="alert my-3 alert-secondary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Valinnainen lisäosa:
     </strong>
     <span>
       Jos käytät <a class="alert-link" href="/blog/docs/best-quantum-safe-encrypted-email-service">salattua tallennustamme (IMAP/POP3)</a> ja haluat, että <i>kaikki</i> sähköpostit, jotka tallennetaan (jo salattuun) SQLite-tietokantaasi, salataan julkisella avaimeksesi, siirry kohtaan <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Oma tili <i class="fa fa-angle-right"></i> Verkkotunnukset</a> <i class="fa fa-angle-right"></i> Aliakset (esim. <code>hello@example.com</code>) <i class="fa fa-angle-right"></i> Muokkaa <i class="fa fa-angle-right"></i> OpenPGP ja lataa julkinen avaimesi.
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
     <span>Jos aliaksesi käyttää <a class="alert-link" href="/disposable-addresses" target="_blank">vanity-/kertakäyttöverkkotunnuksiamme</a> (esim. <code>hideaddress.net</code>), voit ohittaa tämän vaiheen.</span>
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

### Tuetteko S/MIME-salausta {#do-you-support-smime-encryption}

Kyllä, tuemme [S/MIME (Secure/Multipurpose Internet Mail Extensions)](https://en.wikipedia.org/wiki/S/MIME) salausta kuten määritelty [RFC 8551](https://datatracker.ietf.org/doc/html/rfc8551) -standardissa. S/MIME tarjoaa päästä päähän -salauksen X.509-sertifikaattien avulla, joita tukevat laajasti yritysten sähköpostiohjelmat.

Tuemme sekä RSA- että ECC (Elliptic Curve Cryptography) -sertifikaatteja:

* **RSA-sertifikaatit**: vähintään 2048 bittiä, suositus 4096 bittiä
* **ECC-sertifikaatit**: P-256, P-384 ja P-521 NIST-käyrät

S/MIME-salauksen määrittäminen aliaksellesi:

1. Hanki S/MIME-sertifikaatti luotettavalta varmenteen myöntäjältä (CA) tai luo itse allekirjoitettu sertifikaatti testaukseen.

   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Vinkki:
     </strong>
     <span>Ilmaisia S/MIME-sertifikaatteja on saatavilla palveluntarjoajilta kuten <a class="alert-link" href="https://www.actalis.com/s-mime-certificates.aspx">Actalis</a> tai <a class="alert-link" href="https://extrassl.actalis.com/portal/uapub/freemail">Actalis Free S/MIME</a>.</span>
   </div>

2. Vie sertifikaattisi PEM-muodossa (vain julkinen sertifikaatti, ei yksityistä avainta).

3. Siirry kohtaan <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Oma tili <i class="fa fa-angle-right"></i> Verkkotunnukset</a> <i class="fa fa-angle-right"></i> Aliakset (esim. <code><hello@example.com></code>) <i class="fa fa-angle-right"></i> Muokkaa <i class="fa fa-angle-right"></i> S/MIME ja lataa julkinen sertifikaattisi.
4. Kun asetukset on määritetty, kaikki alias-osoitteeseesi tulevat sähköpostit salataan S/MIME-varmenteellasi ennen tallentamista tai edelleenlähetystä.

   <div class="alert my-3 alert-secondary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Huomautus:
     </strong>
     <span>
       S/MIME-salaus kohdistuu saapuviin viesteihin, joita ei ole jo salattu. Jos viesti on jo salattu OpenPGP:llä tai S/MIME:llä, sitä ei salata uudelleen.
     </span>
   </div>

   <div class="alert my-3 alert-warning">
     <i class="fa fa-exclamation-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tärkeää:
     </strong>
     <span>
       S/MIME-salausta ei sovelleta sähköpostin edelleenlähetykseen MX-palvelimemme kautta, jos lähettäjällä oli DMARC-käytäntö hylkää. Jos tarvitset S/MIME-salauksen <em>kaikissa</em> viesteissä, suosittelemme käyttämään IMAP-palveluamme ja määrittämään S/MIME-varmenteesi aliasillesi saapuvaa postia varten.
     </span>
   </div>

Seuraavat sähköpostiohjelmat tukevat sisäänrakennettua S/MIME:tä:

| Sähköpostiohjelma | Alusta  | Huomautukset                                                                                                         |
| ----------------- | ------- | ------------------------------------------------------------------------------------------------------------------- |
| Apple Mail        | macOS   | Sisäänrakennettu S/MIME-tuki. Mene kohtaan Mail > Preferences > Accounts > tilisi > Trust määrittääksesi varmenteet.  |
| Apple Mail        | iOS     | Sisäänrakennettu S/MIME-tuki. Mene kohtaan Settings > Mail > Accounts > tilisi > Advanced > S/MIME määrittääksesi.   |
| Microsoft Outlook | Windows | Sisäänrakennettu S/MIME-tuki. Mene kohtaan File > Options > Trust Center > Trust Center Settings > Email Security.  |
| Microsoft Outlook | macOS   | Sisäänrakennettu S/MIME-tuki. Mene kohtaan Tools > Accounts > Advanced > Security määrittääksesi.                   |
| Thunderbird       | Desktop | Sisäänrakennettu S/MIME-tuki. Mene kohtaan Account Settings > End-To-End Encryption > S/MIME määrittääksesi.         |
| GNOME Evolution   | Desktop | Sisäänrakennettu S/MIME-tuki. Mene kohtaan Edit > Preferences > Mail Accounts > tilisi > Security määrittääksesi.    |
| KMail             | Desktop | Sisäänrakennettu S/MIME-tuki. Mene kohtaan Settings > Configure KMail > Identities > identiteettisi > Cryptography.  |

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Onnittelut!
    </strong>
    <span>
      Olet onnistuneesti määrittänyt S/MIME-salauksen aliasillesi.
    </span>
  </div>
</div>

### Tuetko Sieve-sähköpostisuodatusta {#do-you-support-sieve-email-filtering}

Kyllä! Tuemme [Sieve](https://en.wikipedia.org/wiki/Sieve_\(mail_filtering_language\)) -sähköpostisuodatusta kuten määritelty [RFC 5228](https://datatracker.ietf.org/doc/html/rfc5228) -standardissa. Sieve on tehokas, standardoitu palvelinpuolen sähköpostisuodatuskieli, jonka avulla voit automaattisesti järjestellä, suodattaa ja vastata saapuviin viesteihin.

#### Tuetut Sieve-laajennukset {#supported-sieve-extensions}

Tuemme laajaa valikoimaa Sieve-laajennuksia:

| Laajennus                   | RFC                                                                                     | Kuvaus                                           |
| --------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------ |
| `fileinto`                  | [RFC 5228](https://datatracker.ietf.org/doc/html/rfc5228)                               | Tallenna viestit tiettyihin kansioihin           |
| `reject` / `ereject`        | [RFC 5429](https://datatracker.ietf.org/doc/html/rfc5429)                               | Hylkää viestit virheilmoituksella                |
| `vacation`                  | [RFC 5230](https://datatracker.ietf.org/doc/html/rfc5230)                               | Automaattiset poissaolovastaukset                 |
| `vacation-seconds`          | [RFC 6131](https://datatracker.ietf.org/doc/html/rfc6131)                               | Tarkemmat poissaolovastauksen aikavälit           |
| `imap4flags`                | [RFC 5232](https://datatracker.ietf.org/doc/html/rfc5232)                               | Aseta IMAP-liput (\Seen, \Flagged jne.)           |
| `envelope`                  | [RFC 5228](https://datatracker.ietf.org/doc/html/rfc5228)                               | Testaa kuoren lähettäjä/vastaanottaja             |
| `body`                      | [RFC 5173](https://datatracker.ietf.org/doc/html/rfc5173)                               | Testaa viestin sisältö                            |
| `variables`                 | [RFC 5229](https://datatracker.ietf.org/doc/html/rfc5229)                               | Tallenna ja käytä muuttujia skripteissä           |
| `relational`                | [RFC 5231](https://datatracker.ietf.org/doc/html/rfc5231)                               | Relaatiovertailut (suurempi kuin, pienempi kuin)  |
| `comparator-i;ascii-numeric`| [RFC 4790](https://datatracker.ietf.org/doc/html/rfc4790)                               | Numeraaliset vertailut                            |
| `copy`                      | [RFC 3894](https://datatracker.ietf.org/doc/html/rfc3894)                               | Kopioi viestit uudelleenohjauksen aikana          |
| `editheader`                | [RFC 5293](https://datatracker.ietf.org/doc/html/rfc5293)                               | Lisää tai poista viestin otsikoita                 |
| `date`                      | [RFC 5260](https://datatracker.ietf.org/doc/html/rfc5260)                               | Testaa päivämäärä/aika-arvoja                      |
| `index`                     | [RFC 5260](https://datatracker.ietf.org/doc/html/rfc5260)                               | Pääsy tiettyihin otsikon esiintymiin               |
| `regex`                     | [draft-ietf-sieve-regex](https://datatracker.ietf.org/doc/html/draft-ietf-sieve-regex)  | Säännöllisten lausekkeiden vastaavuus             |
| `enotify`                   | [RFC 5435](https://datatracker.ietf.org/doc/html/rfc5435)                               | Lähetä ilmoituksia (esim. mailto:)                 |
| `environment`               | [RFC 5183](https://datatracker.ietf.org/doc/html/rfc5183)                               | Pääsy ympäristötietoihin                           |
| `mailbox`                   | [RFC 5490](https://datatracker.ietf.org/doc/html/rfc5490)                               | Testaa postilaatikon olemassaolo, luo postilaatikoita |
| `special-use`               | [RFC 8579](https://datatracker.ietf.org/doc/html/rfc8579)                               | Tallenna erityiskäyttöisiin postilaatikoihin (\Junk, \Trash) |
| `duplicate`                 | [RFC 7352](https://datatracker.ietf.org/doc/html/rfc7352)                               | Tunnista kaksoiskappaleet                          |
| `ihave`                     | [RFC 5463](https://datatracker.ietf.org/doc/html/rfc5463)                               | Testaa laajennuksen saatavuus                       |
| `subaddress`                | [RFC 5233](https://datatracker.ietf.org/doc/html/rfc5233)                               | Pääsy käyttäjän + yksityiskohtaisiin osoiteosiin   |
#### Laajennuksia, joita ei tueta {#extensions-not-supported}

Seuraavia laajennuksia ei tällä hetkellä tueta:

| Laajennus                                                      | Syy                                                                |
| -------------------------------------------------------------- | ----------------------------------------------------------------- |
| `include`                                                      | Turvariski (skriptin injektointi) ja vaatii globaalin skriptin tallennuksen |
| `mboxmetadata` / `servermetadata`                              | Vaatii IMAP METADATA -laajennuksen tuen                          |
| `foreverypart` / `mime` / `extracttext` / `replace` / `enclose` | Monimutkainen MIME-puun käsittely ei ole vielä toteutettu         |

#### Esimerkkisieve-skriptit {#example-sieve-scripts}

**Tallenna uutiskirjeet kansioon:**

```sieve
require ["fileinto"];

if header :contains "List-Id" "newsletter" {
    fileinto "Newsletters";
}
```

**Automaattivastaus lomalla ollessa:**

```sieve
require ["vacation"];

vacation :days 7 :subject "Out of Office"
    "Olen tällä hetkellä poissa toimistolta ja vastaan palattuani.";
```

**Merkitse viestit tärkeiltä lähettäjiltä:**

```sieve
require ["imap4flags"];

if address :is "from" "boss@example.com" {
    setflag "\\Flagged";
}
```

**Hylkää roskaposti, jolla on tietyt aiheet:**

```sieve
require ["reject"];

if header :contains "subject" ["lottery", "winner", "urgent transfer"] {
    reject "Viesti hylätty roskapostisisällön vuoksi.";
}
```

#### Sieve-skriptien hallinta {#managing-sieve-scripts}

Voit hallita Sieve-skriptejäsi useilla tavoilla:

1. **Verkkokäyttöliittymä**: Mene osoitteeseen <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Oma tili <i class="fa fa-angle-right"></i> Domainit</a> <i class="fa fa-angle-right"></i> Aliakset <i class="fa fa-angle-right"></i> Sieve-skriptit luodaksesi ja hallitaksesi skriptejä.

2. **ManageSieve-protokolla**: Yhdistä millä tahansa ManageSieve-yhteensopivalla asiakkaalla (kuten Thunderbirdin Sieve-lisäosa tai [sieve-connect](https://github.com/philpennock/sieve-connect)) osoitteeseen `imap.forwardemail.net`. Käytä porttia `2190` STARTTLS:llä (suositeltu useimmille asiakkaille) tai porttia `4190` implisiittisellä TLS:llä.

3. **API**: Käytä [REST APIamme](/api#sieve-scripts) hallinnoidaksesi skriptejä ohjelmallisesti.

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Huomio:
  </strong>
  <span>
    Sieve-suodatus kohdistuu saapuviin viesteihin ennen niiden tallentamista postilaatikkoosi. Skriptit suoritetaan prioriteettijärjestyksessä, ja ensimmäinen vastaava toiminto määrittää, miten viesti käsitellään.
  </span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Turvallisuus:
  </strong>
  <span>
    Turvallisuussyistä uudelleenohjaustoiminnot on rajoitettu 10:een skriptiä kohden ja 100:aan päivässä. Lomavastausten määrää rajoitetaan väärinkäytön estämiseksi.
  </span>
</div>

### Tuetteko MTA-STS:n {#do-you-support-mta-sts}

Kyllä, 2. maaliskuuta 2023 alkaen tuemme [MTA-STS:ää](https://www.hardenize.com/blog/mta-sts). Voit käyttää [tätä mallia](https://github.com/jpawlowski/mta-sts.template) ottaaksesi sen käyttöön omalla domainillasi.

Konfiguraatiomme löytyy julkisesti GitHubista osoitteesta <https://github.com/forwardemail/mta-sts.forwardemail.net>.

### Tuetteko passkeyjä ja WebAuthnia {#do-you-support-passkeys-and-webauthn}

Kyllä! 13. joulukuuta 2023 alkaen olemme lisänneet tuen passkeyille [korkean kysynnän vuoksi](https://github.com/orgs/forwardemail/discussions/182).

Passkeyt mahdollistavat turvallisen kirjautumisen ilman salasanaa ja kaksivaiheista tunnistautumista.

Voit vahvistaa henkilöllisyytesi kosketuksella, kasvojentunnistuksella, laitepohjaisella salasanalla tai PIN-koodilla.

Sallimme hallita jopa 30 passkeytä kerrallaan, jotta voit kirjautua helposti kaikilla laitteillasi.

Lisätietoja passkeyistä seuraavista linkeistä:

* [Kirjaudu sovelluksiin ja verkkosivustoille passkeyillä](https://support.google.com/android/answer/14124480?hl=en) (Google)
* [Käytä passkeyjä kirjautuaksesi sovelluksiin ja verkkosivustoille iPhonessa](https://support.apple.com/guide/iphone/use-passkeys-to-sign-in-to-apps-and-websites-iphf538ea8d0/ios) (Apple)
* [Wikipedia-artikkeli Passkeyistä](https://en.wikipedia.org/wiki/Passkey_\(credential\))
### Tuetteko sähköpostin parhaita käytäntöjä {#do-you-support-email-best-practices}

Kyllä. Meillä on sisäänrakennettu tuki SPF:lle, DKIM:lle, DMARC:lle, ARC:lle ja SRS:lle kaikissa suunnitelmissa. Olemme myös tehneet laajasti yhteistyötä näiden spesifikaatioiden alkuperäisten tekijöiden ja muiden sähköpostiasiantuntijoiden kanssa varmistaaksemme täydellisyyden ja korkean toimitettavuuden.

### Tuetteko bounce-webhookkeja {#do-you-support-bounce-webhooks}

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Vinkki:
  </strong>
    Etsitkö dokumentaatiota sähköpostin webhookeista? Katso <a href="/faq#do-you-support-webhooks" class="alert-link">Tuetteko webhookkeja?</a> saadaksesi lisätietoja.
  <span>
  </span>
</div>

Kyllä, 14. elokuuta 2024 alkaen olemme lisänneet tämän ominaisuuden. Voit nyt mennä Oma tili → Domainit → Asetukset → Bounce Webhook URL ja määrittää `http://` tai `https://` URL-osoitteen, johon lähetämme `POST`-pyynnön aina, kun lähtevä SMTP-sähköposti palautuu.

Tämä on hyödyllistä lähtevän SMTP-liikenteesi hallintaan ja seurantaan – ja sitä voidaan käyttää tilaajien ylläpitoon, poistumisten hallintaan ja palautusten havaitsemiseen.

Bounce-webhookin tietokuorma lähetetään JSON-muodossa seuraavilla ominaisuuksilla:

* `email_id` (String) - sähköpostin tunniste, joka vastaa sähköpostia Oma tili → Sähköpostit (lähtevä SMTP)
* `list_id` (String) - `List-ID`-otsikon (kirjaimista riippumaton) arvo, jos sellainen on, alkuperäisestä lähtevästä sähköpostista
* `list_unsubscribe` (String) - `List-Unsubscribe`-otsikon (kirjaimista riippumaton) arvo, jos sellainen on, alkuperäisestä lähtevästä sähköpostista
* `feedback_id` (String) - `Feedback-ID`-otsikon (kirjaimista riippumaton) arvo, jos sellainen on, alkuperäisestä lähtevästä sähköpostista
* `recipient` (String) - vastaanottajan sähköpostiosoite, joka palautui tai aiheutti virheen
* `message` (String) - yksityiskohtainen virheilmoitus palautuksesta
* `response` (String) - SMTP-vastausviesti
* `response_code` (Number) - jäsennelty SMTP-vastauskoodi
* `truth_source` (String) - jos vastauskoodi on luotettavasta lähteestä, tämä arvo sisältää juuriverkkotunnuksen (esim. `google.com` tai `yahoo.com`)
* `bounce` (Object) - objekti, joka sisältää seuraavat ominaisuudet, jotka kuvaavat palautuksen ja hylkäyksen tilaa
  * `action` (String) - palautustoiminto (esim. `"reject"`)
  * `message` (String) - palautuksen syy (esim. `"Message Sender Blocked By Receiving Server"`)
  * `category` (String) - palautuksen kategoria (esim. `"block"`)
  * `code` (Number) - palautuksen tilakoodi (esim. `554`)
  * `status` (String) - palautuskoodi vastausviestistä (esim. `5.7.1`)
  * `line` (Number) - jäsennelty rivinumero, jos sellainen on, [Zone-MTA bounce parse listasta](https://github.com/zone-eu/zone-mta/blob/master/config/bounces.txt) (esim. `526`)
* `headers` (Object) - avain-arvoparit lähtevän sähköpostin otsikoista
* `bounced_at` (String) - [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601) -muotoinen päivämäärä, jolloin palautusvirhe tapahtui

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

Tässä muutama lisähuomio bounce-webhookeista:

* Jos webhookin tietokuormassa on `list_id`, `list_unsubscribe` tai `feedback_id` -arvo, sinun tulisi tarvittaessa ryhtyä toimenpiteisiin poistaaksesi `recipient` listalta.
  * Jos `bounce.category` -arvo oli jokin `"block"`, `"recipient"`, `"spam"` tai `"virus"`, sinun tulisi ehdottomasti poistaa käyttäjä listalta.
* Jos sinun täytyy varmistaa webhookin tietokuormat (varmistaa, että ne todella tulevat palvelimeltamme), voit [ratkaista etäasiakkaan IP-osoitteen isäntänimen käänteishaulla](https://nodejs.org/api/dns.html#dnspromisesreverseip) – sen pitäisi olla `smtp.forwardemail.net`.
  * Voit myös tarkistaa IP-osoitteen [julkaistujen IP-osoitteidemme](#what-are-your-servers-ip-addresses) joukosta.
  * Mene Oma tili → Domainit → Asetukset → Webhook Signature Payload Verification Key saadaksesi webhook-avaimesi.
    * Voit vaihtaa tämän avaimen milloin tahansa turvallisuussyistä.
    * Laske ja vertaa `X-Webhook-Signature` -arvoa webhook-pyynnöstämme laskettuun runkoarvoon tämän avaimen avulla. Esimerkki tästä löytyy [tästä Stack Overflow -vastauksesta](https://stackoverflow.com/a/68885281).
  * Katso keskustelua osoitteessa <https://github.com/forwardemail/free-email-forwarding/issues/235> saadaksesi lisätietoja.
* Odotamme enintään `5` sekuntia, että webhook-päätepisteesi vastaa `200`-tilakoodilla, ja yritämme uudelleen enintään `1` kerran.
* Jos havaitsemme, että bounce-webhook-URL-osoitteessasi on virhe, kun yritämme lähettää pyyntöä, lähetämme sinulle kohteliaisuussähköpostin kerran viikossa.
### Tuetko webhooksia {#do-you-support-webhooks}

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Vinkki:
  </strong>
    Etsitkö dokumentaatiota bounce-webhookeista? Katso <a href="/faq#do-you-support-bounce-webhooks" class="alert-link">Tuetko bounce-webhookeja?</a> saadaksesi lisätietoa.
  <span>
  </span>
</div>

Kyllä, 15. toukokuuta 2020 alkaen olemme lisänneet tämän ominaisuuden. Voit yksinkertaisesti lisätä webhookin(t) aivan kuten lisäisit vastaanottajan! Varmista, että webhookin URL-osoitteessa on etuliitteenä "http" tai "https" -protokolla.

<div class="alert my-3 alert-danger">
  <i class="fa fa-stop-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Parannettu tietosuoja:
  </strong>
  <span>
    Jos olet maksullisella tilauksella (johon sisältyy parannettu tietosuoja), siirry kohtaan <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Oma tili <i class="fa fa-angle-right"></i> Domainit</a> ja napsauta "Alias" domainisi vieressä konfiguroidaksesi webhookisi. Jos haluat tietää lisää maksullisista tilauksista, katso <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Hinnoittelu</a>-sivumme. Muussa tapauksessa voit jatkaa alla olevien ohjeiden seuraamista.
  </span>
</div>

Jos olet ilmaistilauksella, lisää yksinkertaisesti uusi DNS <strong class="notranslate">TXT</strong> -tietue alla olevan esimerkin mukaisesti:

Esimerkiksi, jos haluan, että kaikki sähköpostit, jotka menevät osoitteeseen `alias@example.com`, ohjataan uuteen [request bin](https://requestbin.com/r/en8pfhdgcculn?inspect) testipäätteeseen:

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

Tai ehkä haluat, että kaikki sähköpostit, jotka menevät osoitteeseen `example.com`, ohjataan tähän päätepisteeseen:

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

**Tässä on lisähuomioita webhookeista:**

* Jos sinun täytyy varmistaa webhookin hyötykuormat (että ne todella tulevat palvelimeltamme), voit [ratkaista etäasiakkaan IP-osoitteen asiakasnimellä käänteishaulla](https://nodejs.org/api/dns.html#dnspromisesreverseip) – sen pitäisi olla joko `mx1.forwardemail.net` tai `mx2.forwardemail.net`.
  * Voit myös tarkistaa IP:n [julkaistujen IP-osoitteidemme](#what-are-your-servers-ip-addresses) joukosta.
  * Jos olet maksullisella tilauksella, siirry Oma tili → Domainit → Asetukset → Webhook Signature Payload Verification Key saadaksesi webhook-avaimesi.
    * Voit vaihtaa tämän avaimen milloin tahansa turvallisuussyistä.
    * Laske ja vertaa `X-Webhook-Signature` -arvoa webhook-pyynnöstämme laskettuun kehon arvoon tämän avaimen avulla. Esimerkki tästä löytyy [tästä Stack Overflow -vastauksesta](https://stackoverflow.com/a/68885281).
  * Katso keskustelua osoitteessa <https://github.com/forwardemail/free-email-forwarding/issues/235> saadaksesi lisätietoa.
* Jos webhook ei vastaa `200`-tilakoodilla, tallennamme sen vastauksen [virhelokiin](#do-you-store-error-logs) – mikä on hyödyllistä virheenkorjauksessa.
* Webhook HTTP -pyynnöt yritetään uudelleen enintään 3 kertaa joka SMTP-yhteyden yrityksessä, ja jokaisella POST-pyynnöllä on 60 sekunnin maksimiaikakatkaisu. **Huomaa, että tämä ei tarkoita, että yritämme vain 3 kertaa**, vaan yritämme jatkuvasti ajan myötä lähettämällä SMTP-koodin 421 (joka tarkoittaa lähettäjälle "yritä myöhemmin") kolmannen epäonnistuneen HTTP POST -yrityksen jälkeen. Tämä tarkoittaa, että sähköpostia yritetään uudelleen jatkuvasti päivien ajan, kunnes saavutetaan 200-tilakoodi.
* Yritämme automaattisesti uudelleen oletustilakoodien ja virhekoodejen perusteella, joita käytetään [superagentin retry-menetelmässä](https://ladjs.github.io/superagent/#retrying-requests) (olemme ylläpitäjiä).
* Ryhmittelemme webhook HTTP -pyynnöt samaan päätepisteeseen yhdeksi pyynnöksi useiden sijaan resurssien säästämiseksi ja vasteajan nopeuttamiseksi. Esimerkiksi, jos lähetät sähköpostin osoitteisiin <webhook1@example.com>, <webhook2@example.com> ja <webhook3@example.com>, ja kaikki on konfiguroitu osumaan täsmälleen samaan päätepisteen URL-osoitteeseen, tehdään vain yksi pyyntö. Ryhmittely tehdään täsmällisen päätepisteen vastaavuuden perusteella.
* Huomaa, että käytämme [mailparser](https://nodemailer.com/extras/mailparser/) -kirjaston "simpleParser"-menetelmää viestin jäsentämiseen JSON-yhteensopivaksi objektiksi.
* Raaka sähköpostiarvo String-muodossa annetaan ominaisuutena "raw".
* Todennustulokset annetaan ominaisuuksina "dkim", "spf", "arc", "dmarc" ja "bimi".
* Jäsennelty sähköpostin otsikko annetaan ominaisuutena "headers" – mutta huomaa myös, että voit käyttää "headerLines" helpompaan iteraatioon ja jäsentämiseen.
* Tämän webhookin ryhmitellyt vastaanottajat annetaan ominaisuutena "recipients".
* SMTP-istuntotiedot annetaan ominaisuutena "session". Tämä sisältää tietoja viestin lähettäjästä, viestin saapumisajasta, HELO:sta ja asiakasnimestä. Asiakasnimen arvo `session.clientHostname` on joko FQDN (käänteisen PTR-haun tulos) tai se on `session.remoteAddress` hakasulkeissa (esim. `"[127.0.0.1]"`).
* Jos tarvitset nopean tavan saada `X-Original-To` -arvo, voit käyttää `session.recipient` -arvoa (katso esimerkki alla). Otsikko `X-Original-To` on otsikko, jonka lisäämme viesteihin virheenkorjausta varten alkuperäisellä vastaanottajalla (ennen naamioitua edelleenlähetystä).
* Jos haluat poistaa `attachments`- ja/tai `raw`-ominaisuudet hyötykuormasta, lisää yksinkertaisesti `?attachments=false`, `?raw=false` tai `?attachments=false&raw=false` webhook-päätepisteesi URL-osoitteeseen kyselymerkkijonona (esim. `https://example.com/webhook?attachments=false&raw=false`).
* Jos liitteitä on, ne lisätään `attachments`-taulukkoon Buffer-arvoina. Voit jäsentää ne takaisin sisällöksi käyttämällä JavaScript-pohjaista lähestymistapaa, kuten:
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
    Tip:
  </strong>
    Curious what the webhook request looks like from forwarded emails?  We've included an example below for you!
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

### Tuetko säännöllisiä lausekkeita eli regexiä {#do-you-support-regular-expressions-or-regex}

Kyllä, 27. syyskuuta 2021 alkaen olemme lisänneet tämän ominaisuuden. Voit yksinkertaisesti kirjoittaa säännöllisiä lausekkeita ("regex") aliasien vastaavuuden tarkistamiseen ja korvausten tekemiseen.

Säännöllisiä lausekkeita tukevat aliasit alkavat `/`-merkillä ja päättyvät `/`-merkkiin, ja niiden vastaanottajat ovat sähköpostiosoitteita tai webhookkeja. Vastaanottajat voivat myös sisältää regex-korvaustuen (esim. `$1`, `$2`).

Tuemme kahta säännöllisen lausekkeen lippua, `i` ja `g`. Kirjainkoon huomioimaton lippu `i` on pysyvä oletus ja se on aina voimassa. Globaalin lipun `g` voit lisätä itse liittämällä lopussa olevan `/`-merkin perään `/g`.

Huomaa, että tuemme myös <a href="#can-i-disable-specific-aliases">poistetut alias-ominaisuutemme</a> vastaanottajaosassa regex-tuen yhteydessä.

Säännöllisiä lausekkeita ei tueta <a href="/disposable-addresses" target="_blank">globaalien vanity-domainien</a> kohdalla (koska se voisi olla tietoturvariski).

<div class="alert my-3 alert-danger">
  <i class="fa fa-stop-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Parannettu tietosuoja:
  </strong>
  <span>
    Jos käytössäsi on maksullinen suunnitelma (joka sisältää parannetun tietosuojan), siirry kohtaan <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Oma tili <i class="fa fa-angle-right"></i> Domainit</a> ja napsauta "Aliasit" domainisi vieressä konfiguroidaksesi aliaksia, mukaan lukien säännöllisiä lausekkeita sisältävät. Jos haluat lisätietoja maksullisista suunnitelmista, katso <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Hinnoittelu</a>-sivumme.
  </span>
</div>

#### Esimerkkejä parannetusta tietosuojasta {#examples-for-enhanced-privacy-protection}

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Alias-nimi</th>
      <th>Vaikutus</th>
      <th>Testi</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>/^(linus|torvalds)$/</code></td>
      <td>Sähköpostit osoitteisiin `linus@example.com` tai `torvalds@example.com`</td>
      <td>(<a href="https://regexr.com/8gb8n" class="alert-link">katso testi RegExrissä</a>)</td>
    </tr>
    <tr>
      <td><code>/^24highst(reet)$/</code></td>
      <td>Sähköpostit osoitteisiin `24highst@example.com` tai `24highstreet@example.com`</td>
      <td>(<a href="https://regexr.com/8g9rb" class="alert-link">katso testi RegExrissä</a>)</td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Vinkki:
  </strong>
    Testataksesi näitä osoitteessa <a href="https://regexr.com" class="alert-link">RegExr</a>, kirjoita lauseke ylälaatikkoon ja kirjoita sitten esimerkkialias tekstikenttään alapuolelle. Jos se vastaa, se muuttuu siniseksi.
  <span>
  </span>
</div>

#### Esimerkkejä ilmaiselle suunnitelmalle {#examples-for-the-free-plan}

Jos käytössäsi on ilmainen suunnitelma, lisää vain uusi DNS <strong class="notranslate">TXT</strong>-tietue käyttäen yhtä tai useampaa alla annetuista esimerkeistä:

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Yksinkertainen esimerkki:</strong> Jos haluan, että kaikki sähköpostit, jotka menevät osoitteisiin `linus@example.com` tai `torvalds@example.com`, välitetään osoitteeseen `user@gmail.com`:
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
  <strong>Etunimi Sukunimi -korvausesimerkki:</strong> Kuvittele, että kaikki yrityksesi sähköpostiosoitteet ovat muotoa `etunimi.sukunimi@example.com`. Jos haluan, että kaikki sähköpostit, jotka menevät muotoon `etunimi.sukunimi@example.com`, välitetään osoitteeseen `etunimi.sukunimi@company.com` korvaustuen kanssa (<a href="https://regexr.com/66hnu" class="alert-link">katso testi RegExrissä</a>):
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
      <td><code>forward-email=/^([A-Za-z]+)+\.([A-Za-z]+)+$/:$1.$2@company.com</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Plus-merkin suodatuskorvausesimerkki:</strong> Jos haluan, että kaikki sähköpostit, jotka menevät osoitteisiin `info@example.com` tai `support@example.com`, ohjautuvat osoitteisiin `user+info@gmail.com` tai `user+support@gmail.com` vastaavasti (korvaustuen kanssa) (<a href="https://regexr.com/66ho7" class="alert-link">katso testi RegExrissä</a>):
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
      <td><code>forward-email=/^(support|info)$/:user+$1@gmail.com</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Webhook-kyselymerkkijonon korvausesimerkki:</strong> Ehkä haluat, että kaikki `example.com`-osoitteeseen menevät sähköpostit menevät <a href="#do-you-support-webhooks" class="alert-link">webhookiin</a> ja niillä on dynaaminen kyselymerkkijonon avain "to", jonka arvona on sähköpostiosoitteen käyttäjänimi (<a href="https://regexr.com/66ho4" class="alert-link">katso testi RegExrissä</a>):
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
  <strong>Hiljaisen hylkäyksen esimerkki:</strong> Jos haluat, että kaikki tiettyä mallia vastaavat sähköpostit poistetaan käytöstä ja hylätään hiljaisesti (lähettäjälle näyttää siltä kuin viesti olisi lähetetty onnistuneesti, mutta se ei mene minnekään) tilakoodilla `250` (katso <a href="#can-i-disable-specific-aliases" class="alert-link">Voinko poistaa käytöstä tiettyjä aliaksia</a>), käytä yksinkertaisesti samaa lähestymistapaa yhdellä huutomerkillä "!". Tämä ilmoittaa lähettäjälle, että viesti toimitettiin onnistuneesti, mutta se ei oikeasti mennyt minnekään (esim. mustaan aukkoon tai `/dev/null`).
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
  <strong>Pehmeän hylkäyksen esimerkki:</strong> Jos haluat, että kaikki tiettyä mallia vastaavat sähköpostit poistetaan käytöstä ja hylätään pehmeästi tilakoodilla `421` (katso <a href="#can-i-disable-specific-aliases" class="alert-link">Voinko poistaa käytöstä tiettyjä aliaksia</a>), käytä yksinkertaisesti samaa lähestymistapaa kahdella huutomerkillä "!!". Tämä ilmoittaa lähettäjälle, että hänen tulee yrittää lähettää sähköposti uudelleen, ja tämän aliaksen sähköposteja yritetään uudelleen noin 5 päivän ajan ja sitten ne hylätään pysyvästi.
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
  <strong>Kova hylkäysesimerkki:</strong> Jos haluat, että kaikki tiettyä mallia vastaavat sähköpostit poistetaan käytöstä ja hylätään kovasti tilakoodilla `550` (katso <a href="#can-i-disable-specific-aliases" class="alert-link">Voinko poistaa käytöstä tiettyjä aliaksia</a>), käytä yksinkertaisesti samaa lähestymistapaa kolmella huutomerkillä "!!!". Tämä ilmoittaa lähettäjälle pysyvästä virheestä, eikä sähköposteja yritetä uudelleen, vaan ne hylätään tämän aliaksen osalta.
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
    Oletko utelias, miten kirjoittaa säännöllinen lauseke tai tarvitsetko testata korvaustasi? Voit mennä ilmaiseen säännöllisten lausekkeiden testauspalveluun <a href="https://regexr.com" class="alert-link">RegExr</a> osoitteessa <a href="https://regexr.com/" class="alert-link">https://regexr.com</a>.
  <span>
  </span>
</div>

### Mitkä ovat lähtevän SMTP:n rajasi {#what-are-your-outbound-smtp-limits}

Rajoitamme käyttäjiä ja domaineja 300 lähtevään SMTP-viestiin päivässä. Tämä vastaa keskimäärin yli 9000 sähköpostia kalenterikuukaudessa. Jos sinun tarvitsee ylittää tämä määrä tai sinulla on jatkuvasti suuria sähköposteja, ota yhteyttä [meihin](https://forwardemail.net/help).

### Tarvitsenko hyväksynnän SMTP:n käyttöönottoon {#do-i-need-approval-to-enable-smtp}

Kyllä, huomioithan, että IP-maineen ylläpitämiseksi ja toimitettavuuden varmistamiseksi Forward Emailillä on manuaalinen tarkastusprosessi domainikohtaisesti lähtevän SMTP:n hyväksyntää varten. Lähetä sähköpostia osoitteeseen <support@forwardemail.net> tai avaa [tukipyyntö](https://forwardemail.net/help) hyväksyntää varten. Tämä kestää tyypillisesti alle 24 tuntia, ja useimmat pyynnöt käsitellään 1-2 tunnin sisällä. Lähitulevaisuudessa pyrimme tekemään tämän prosessin välittömäksi lisättyjen roskapostin valvontojen ja hälytysten avulla. Tämä prosessi varmistaa, että sähköpostisi saavuttavat postilaatikon eivätkä viestisi päädy roskapostiksi.

### Mitkä ovat SMTP-palvelimen asetukset {#what-are-your-smtp-server-configuration-settings}

Palvelimemme on `smtp.forwardemail.net` ja sitä valvotaan myös <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">tilasivullamme</a>.

Se tukee sekä IPv4- että IPv6-yhteyksiä ja on saatavilla porteissa `465` ja `2465` SSL/TLS:lle (suositeltu) sekä `587`, `2587`, `2525` ja `25` TLS:lle (STARTTLS).

**Lokakuusta 2025 alkaen** tuemme nyt **perinteisiä TLS 1.0** -yhteyksiä porteissa `2455` (SSL/TLS) ja `2555` (STARTTLS) vanhemmille laitteille, kuten tulostimille, skannereille, kameroille ja perinteisille sähköpostiohjelmille, jotka eivät tue nykyaikaisia TLS-versioita. Nämä portit ovat vaihtoehto Gmailille, Yahoolle, Outlookille ja muille palveluntarjoajille, jotka ovat lopettaneet vanhempien TLS-protokollien tuen.

> \[!CAUTION]
> **Perinteisen TLS 1.0 tuen portit (2455 ja 2555)**: Nämä portit käyttävät vanhentunutta TLS 1.0 -protokollaa, jolla on tunnettuja tietoturva-aukkoja (BEAST, POODLE). Käytä näitä portteja vain, jos laitteesi ei ehdottomasti pysty tukemaan TLS 1.2:ta tai uudempaa. Suosittelemme vahvasti laiteohjelmiston päivittämistä tai siirtymistä nykyaikaisiin sähköpostiohjelmiin aina kun mahdollista. Nämä portit on tarkoitettu vain perinteisen laitteiston yhteensopivuuteen (vanhat tulostimet, skannerit, kamerat, IoT-laitteet).

|                                     Protokolla                                     | Isäntä                  |            Portit            |        IPv4        |        IPv6        | Huomautukset                           |
| :--------------------------------------------------------------------------------: | ----------------------- | :-------------------------: | :----------------: | :----------------: | ------------------------------------ |
|                              `SSL/TLS` **Suositeltu**                             | `smtp.forwardemail.net` |        `465`, `2465`        | :white_check_mark: | :white_check_mark: | Nykyaikainen TLS 1.2+ (Suositeltu)   |
|         `TLS` ([STARTTLS](https://wikipedia.org/wiki/Opportunistic_TLS))          | `smtp.forwardemail.net` | `587`, `2587`, `2525`, `25` | :white_check_mark: | :white_check_mark: | Tuettu (suosi SSL/TLS-porttia `465`)  |
|                             `SSL/TLS` **Vain perinteinen**                         | `smtp.forwardemail.net` |            `2455`           | :white_check_mark: | :white_check_mark: | :warning: TLS 1.0 vain vanhoille laitteille |
| `TLS` ([STARTTLS](https://wikipedia.org/wiki/Opportunistic_TLS)) **Vain perinteinen** | `smtp.forwardemail.net` |            `2555`           | :white_check_mark: | :white_check_mark: | :warning: TLS 1.0 vain vanhoille laitteille |
| Kirjautuminen | Esimerkki                  | Kuvaus                                                                                                                                                                                   |
| ------------ | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Käyttäjätunnus | `user@example.com`         | Sähköpostiosoite aliakselle, joka on olemassa kyseiselle domainille kohdassa <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Oma tili <i class="fa fa-angle-right"></i> Domainit</a>. |
| Salasana    | `************************` | Alias                                                                                                                                                                                    |

Jotta voi lähettää lähtevää sähköpostia SMTP:n kautta, **SMTP-käyttäjän** on oltava aliaksen sähköpostiosoite, joka on olemassa kyseiselle domainille kohdassa <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Oma tili <i class="fa fa-angle-right"></i> Domainit</a> – ja **SMTP-salasanan** on oltava aliaskohtaisesti luotu salasana.

Katso ohjeet vaihe vaiheelta kohdasta [Tuetteko sähköpostin lähettämistä SMTP:llä](#do-you-support-sending-email-with-smtp).

### Mitkä ovat IMAP-palvelimen asetukset {#what-are-your-imap-server-configuration-settings}

Palvelimemme on `imap.forwardemail.net` ja sitä valvotaan myös <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">tilasivullamme</a>.

Se tukee sekä IPv4- että IPv6-protokollia ja on käytettävissä porteissa `993` ja `2993` SSL/TLS-yhteydelle.

|         Protokolla        | Isäntänimi               |     Portit    |        IPv4        |        IPv6        |
| :-----------------------: | ------------------------ | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **Suositeltu**  | `imap.forwardemail.net`  | `993`, `2993` | :white_check_mark: | :white_check_mark: |

| Kirjautuminen | Esimerkki                  | Kuvaus                                                                                                                                                                                   |
| ------------ | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Käyttäjätunnus | `user@example.com`         | Sähköpostiosoite aliakselle, joka on olemassa kyseiselle domainille kohdassa <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Oma tili <i class="fa fa-angle-right"></i> Domainit</a>. |
| Salasana    | `************************` | Aliaskohtaisesti luotu salasana.                                                                                                                                                         |

Jotta voi muodostaa yhteyden IMAP:iin, **IMAP-käyttäjän** on oltava aliaksen sähköpostiosoite, joka on olemassa kyseiselle domainille kohdassa <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Oma tili <i class="fa fa-angle-right"></i> Domainit</a> – ja **IMAP-salasanan** on oltava aliaskohtaisesti luotu salasana.

Katso ohjeet vaihe vaiheelta kohdasta [Tuetteko sähköpostin vastaanottamista IMAP:lla](#do-you-support-receiving-email-with-imap).

### Mitkä ovat POP3-palvelimen asetukset {#what-are-your-pop3-server-configuration-settings}

Palvelimemme on `pop3.forwardemail.net` ja sitä valvotaan myös <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">tilasivullamme</a>.

Se tukee sekä IPv4- että IPv6-protokollia ja on käytettävissä porteissa `995` ja `2995` SSL/TLS-yhteydelle.

|         Protokolla        | Isäntänimi               |     Portit    |        IPv4        |        IPv6        |
| :-----------------------: | ------------------------ | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **Suositeltu**  | `pop3.forwardemail.net`  | `995`, `2995` | :white_check_mark: | :white_check_mark: |
| Kirjautuminen | Esimerkki                 | Kuvaus                                                                                                                                                                                   |
| ------------ | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Käyttäjätunnus | `user@example.com`        | Alias-sähköpostiosoite, joka on olemassa kyseiselle domainille kohdassa <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Oma tili <i class="fa fa-angle-right"></i> Domainit</a>. |
| Salasana     | `************************` | Alias-kohtainen generoitu salasana.                                                                                                                                                      |

POP3-yhteyden muodostamiseksi **POP3-käyttäjän** on oltava aliasin sähköpostiosoite, joka on olemassa kyseiselle domainille kohdassa <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Oma tili <i class="fa fa-angle-right"></i> Domainit</a> – ja **IMAP-salasanan** on oltava alias-kohtainen generoitu salasana.

Katso vaiheittaiset ohjeet kohdasta [Tuetteko POP3:ta](#do-you-support-pop3).

### Kuinka määritän sähköpostin automaattisen tunnistuksen domainilleni {#how-do-i-set-up-email-autodiscovery-for-my-domain}

Sähköpostin automaattinen tunnistus mahdollistaa sähköpostiohjelmien, kuten **Thunderbirdin**, **Apple Mailin**, **Microsoft Outlookin** ja mobiililaitteiden, automaattisen oikeiden IMAP-, SMTP-, POP3-, CalDAV- ja CardDAV-palvelinasetusten tunnistamisen, kun käyttäjä lisää sähköpostitilinsä. Tämä määritellään standardeissa [RFC 6186](https://www.rfc-editor.org/rfc/rfc6186.html) (sähköposti) ja [RFC 6764](https://www.rfc-editor.org/rfc/rfc6764.html) (CalDAV/CardDAV) ja käyttää DNS SRV -tietueita.

Forward Email julkaisee automaattisen tunnistuksen tietueet osoitteessa `forwardemail.net`. Voit joko lisätä SRV-tietueet suoraan domainillesi tai käyttää yksinkertaisempaa CNAME-menetelmää.

#### Vaihtoehto A: CNAME-tietueet (yksinkertaisin) {#option-a-cname-records-simplest}

Lisää nämä kaksi CNAME-tietuetta domainisi DNS:ään. Tämä ohjaa automaattisen tunnistuksen Forward Emailin palvelimille:

|  Tyyppi | Nimi/Isäntä    | Kohde/Arvo                    |
| :-----: | -------------- | ----------------------------- |
| CNAME   | `autoconfig`   | `autoconfig.forwardemail.net` |
| CNAME   | `autodiscover` | `autodiscover.forwardemail.net` |

`autoconfig`-tietuetta käyttävät **Thunderbird** ja muut Mozilla-pohjaiset asiakasohjelmat. `autodiscover`-tietuetta käyttää **Microsoft Outlook**.

#### Vaihtoehto B: SRV-tietueet (suora) {#option-b-srv-records-direct}

Jos haluat lisätä tietueet suoraan (tai DNS-palveluntarjoajasi ei tue CNAME-tietueita alidomaineissa), lisää nämä SRV-tietueet domainillesi:

| Tyyppi | Nimi/Isäntä         | Prioriteetti | Paino | Portti | Kohde/Arvo                 | Tarkoitus                              |
| :-----:| ------------------- | :----------: | :---: | :----: | -------------------------- | ------------------------------------- |
| SRV    | `_imaps._tcp`       |      0       |   1   |  993   | `imap.forwardemail.net`    | IMAP SSL/TLS:n yli (suositeltu)       |
| SRV    | `_imap._tcp`        |      0       |   0   |   0    | `.`                        | Tavallinen IMAP pois käytöstä         |
| SRV    | `_submissions._tcp` |      0       |   1   |  465   | `smtp.forwardemail.net`    | SMTP-lähetys (SSL/TLS, suositeltu)    |
| SRV    | `_submission._tcp`  |      5       |   1   |  587   | `smtp.forwardemail.net`    | SMTP-lähetys (STARTTLS)                |
| SRV    | `_pop3s._tcp`       |     10       |   1   |  995   | `pop3.forwardemail.net`    | POP3 SSL/TLS:n yli                    |
| SRV    | `_pop3._tcp`        |      0       |   0   |   0    | `.`                        | Tavallinen POP3 pois käytöstä         |
| SRV    | `_caldavs._tcp`     |      0       |   1   |  443   | `caldav.forwardemail.net`  | CalDAV TLS:n yli (kalenterit)         |
| SRV    | `_caldav._tcp`      |      0       |   0   |   0    | `.`                        | Tavallinen CalDAV pois käytöstä       |
| SRV    | `_carddavs._tcp`    |      0       |   1   |  443   | `carddav.forwardemail.net` | CardDAV TLS:n yli (yhteystiedot)      |
| SRV    | `_carddav._tcp`     |      0       |   0   |   0    | `.`                        | Tavallinen CardDAV pois käytöstä      |
> \[!NOTE]
> IMAP:llä on alhaisempi prioriteettiarvo (0) kuin POP3:lla (10), mikä kertoo sähköpostiohjelmille, että IMAP:ia tulisi suosia POP3:n sijaan, kun molemmat ovat käytettävissä. Kohteella `.` (yksi piste) olevat tietueet osoittavat, että kyseisten protokollien selväkieliset (salauksettomat) versiot on tarkoituksellisesti poistettu käytöstä [RFC 6186 kohdan 3.4](https://www.rfc-editor.org/rfc/rfc6186.html#section-3.4) mukaisesti. CalDAV- ja CardDAV SRV-tietueet noudattavat [RFC 6764](https://www.rfc-editor.org/rfc/rfc6764.html) -määritystä kalenterin ja yhteystietojen automaattiseen löytämiseen.

#### Mitkä sähköpostiohjelmat tukevat automaattista löytämistä? {#which-email-clients-support-autodiscovery}

| Asiakas            | Sähköposti                                       | CalDAV/CardDAV                             |
| ------------------ | ------------------------------------------------ | ------------------------------------------ |
| Thunderbird        | `autoconfig` CNAME- tai SRV-tietueet            | `autoconfig` XML- tai SRV-tietueet (RFC 6764) |
| Apple Mail (macOS) | SRV-tietueet (RFC 6186)                          | SRV-tietueet (RFC 6764)                     |
| Apple Mail (iOS)   | SRV-tietueet (RFC 6186)                          | SRV-tietueet (RFC 6764)                     |
| Microsoft Outlook  | `autodiscover` CNAME- tai `_autodiscover._tcp` SRV | Ei tuettu                                |
| GNOME (Evolution)  | SRV-tietueet (RFC 6186)                          | SRV-tietueet (RFC 6764)                     |
| KDE (KMail)        | SRV-tietueet (RFC 6186)                          | SRV-tietueet (RFC 6764)                     |
| eM Client          | `autoconfig` tai `autodiscover`                  | SRV-tietueet (RFC 6764)                     |

> \[!TIP]
> Parhaan yhteensopivuuden varmistamiseksi kaikkien asiakkaiden kanssa suosittelemme käyttämään **Vaihtoehto A** (CNAME-tietueet) yhdistettynä **Vaihtoehto B** SRV-tietueisiin. Pelkkä CNAME-lähestymistapa kattaa suurimman osan sähköpostiohjelmista. CalDAV/CardDAV SRV-tietueet varmistavat, että kalenteri- ja yhteystieto-ohjelmat voivat myös automaattisesti löytää palvelinasetuksesi.


## Turvallisuus {#security-1}

### Edistyneet palvelimen koventamistekniikat {#advanced-server-hardening-techniques}

> \[!TIP]
> Lue lisää turvallisuusinfraamme [turvallisuussivultamme](/security).

Forward Email toteuttaa lukuisia palvelimen koventamistekniikoita varmistaakseen infrastruktuurimme ja tietojesi turvallisuuden:

1. **Verkon turvallisuus**:
   * IP-taulukkopalomuuri tiukoin säännöin
   * Fail2ban brute force -suojaukseen
   * Säännölliset turvallisuustarkastukset ja tunkeutumistestaus
   * Vain VPN:n kautta tapahtuva hallinnollinen pääsy

2. **Järjestelmän koventaminen**:
   * Minimipakettien asennus
   * Säännölliset turvallisuuspäivitykset
   * SELinux pakottavassa tilassa
   * Root SSH -käytön poiskytkentä
   * Vain avainpohjainen todennus

3. **Sovellusturvallisuus**:
   * Content Security Policy (CSP) -otsikot
   * HTTPS Strict Transport Security (HSTS)
   * XSS-suojausotsikot
   * Kehysasetukset ja referrer-politiikkaotsikot
   * Säännölliset riippuvuustarkastukset

4. **Tietosuoja**:
   * Koko levyn salaus LUKS:lla
   * Turvallinen avainhallinta
   * Säännölliset salatut varmuuskopiot
   * Tietojen minimointikäytännöt

5. **Valvonta ja reagointi**:
   * Reaaliaikainen tunkeutumisen havaitseminen
   * Automaattinen turvallisuusskannaus
   * Keskitetty lokitus ja analyysi
   * Tapahtumien käsittelyprosessit

> \[!IMPORTANT]
> Turvallisuuskäytäntömme päivitetään jatkuvasti vastaamaan uusia uhkia ja haavoittuvuuksia.

> \[!TIP]
> Maksimaalisen turvallisuuden saavuttamiseksi suosittelemme käyttämään palveluamme OpenPGP:n kautta tapahtuvan päästä-päähän -salauksen kanssa.

### Onko teillä SOC 2 tai ISO 27001 -sertifikaatteja {#do-you-have-soc-2-or-iso-27001-certifications}

> \[!NOTE]
> Forward Email toimii sertifioitujen alihankkijoiden tarjoamalla infrastruktuurilla varmistaakseen alan standardien noudattamisen.

Forward Email ei suoraan omista SOC 2 Type II tai ISO 27001 -sertifikaatteja. Palvelu toimii kuitenkin sertifioitujen alihankkijoiden tarjoamalla infrastruktuurilla:

* **DigitalOcean**: SOC 2 Type II ja SOC 3 Type II -sertifioitu (auditoinut Schellman & Company LLC), ISO 27001 sertifioitu useissa datakeskuksissa. Lisätiedot: <https://www.digitalocean.com/trust/certification-reports>
* **Vultr**: SOC 2+ (HIPAA) sertifioitu, ISO/IEC -sertifikaatit: 20000-1:2018, 27001:2022, 27017:2015, 27018:2019. Lisätietoja: <https://www.vultr.com/legal/compliance/>

* **DataPacket**: SOC 2 -yhteensopiva (ota suoraan yhteyttä DataPacketiin saadaksesi sertifikaatin), yritystason infrastruktuuripalveluntarjoaja (Denverin sijainti). Lisätietoja: <https://www.datapacket.com/datacenters/denver>

Forward Email noudattaa alan parhaita käytäntöjä turvallisuustarkastuksissa ja tekee säännöllisesti yhteistyötä riippumattomien tietoturvatutkijoiden kanssa. Lähde: <https://forwardemail.net/technical-whitepaper.pdf#page=36>

### Käytättekö TLS-salausta sähköpostin edelleenlähetyksessä {#do-you-use-tls-encryption-for-email-forwarding}

Kyllä. Forward Email vaatii tiukasti TLS 1.2+ -yhteyksiä kaikissa yhteyksissä (HTTPS, SMTP, IMAP, POP3) ja toteuttaa MTA-STS:n parannetun TLS-tuen takaamiseksi. Toteutus sisältää:

* TLS 1.2+ -vaatimus kaikissa sähköpostiyhteyksissä
* ECDHE (Elliptic Curve Diffie-Hellman Ephemeral) avaintenvaihto täydellisen eteenpäin suojauksen takaamiseksi
* Modernit salausalgoritmit säännöllisillä tietoturvapäivityksillä
* HTTP/2 -tuki parannetun suorituskyvyn ja tietoturvan vuoksi
* HSTS (HTTP Strict Transport Security) esilatauksella suurissa selaimissa
* **MTA-STS (Mail Transfer Agent Strict Transport Security)** tiukkaan TLS-vaatimusten noudattamiseen

Lähde: <https://forwardemail.net/technical-whitepaper.pdf#page=25>

**MTA-STS:n toteutus**: Forward Email toteuttaa tiukan MTA-STS-vaatimusten noudattamisen koodipohjassa. Kun TLS-virheitä ilmenee ja MTA-STS on käytössä, järjestelmä palauttaa 421 SMTP -tilakoodit varmistaakseen, että sähköpostit yritetään lähettää uudelleen myöhemmin sen sijaan, että ne toimitettaisiin turvattomasti. Toteutuksen yksityiskohdat:

* TLS-virheiden tunnistus: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-tls-error.js>
* MTA-STS:n noudattaminen send-email -apufunktiossa: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/send-email.js>

Kolmannen osapuolen validointi: <https://www.hardenize.com/report/forwardemail.net/1750312779> näyttää "Good" -arvostelut kaikille TLS- ja siirtoturvatoimenpiteille.

### Säilytättekö sähköpostin todennusotsikot {#do-you-preserve-email-authentication-headers}

Kyllä. Forward Email toteuttaa ja säilyttää kattavasti sähköpostin todennusotsikot:

* **SPF (Sender Policy Framework)**: Oikein toteutettu ja säilytetty
* **DKIM (DomainKeys Identified Mail)**: Täysi tuki asianmukaisella avainhallinnalla
* **DMARC**: Politiikan noudattaminen sähköposteille, jotka epäonnistuvat SPF- tai DKIM-tarkistuksessa
* **ARC**: Vaikka ei ole erikseen kuvattu, palvelun täydelliset yhteensopivuuspisteet viittaavat kattavaan todennusotsikoiden käsittelyyn

Lähde: <https://forwardemail.net/technical-whitepaper.pdf#page=31>

Validointi: Internet.nl Mail Test näyttää 100/100 pistettä erityisesti "SPF, DKIM ja DMARC" -toteutuksesta. Hardenize-arviointi vahvistaa "Good" -arvostelut SPF:lle ja DMARC:lle: <https://www.hardenize.com/report/forwardemail.net/1750312779>

### Säilytättekö alkuperäiset sähköpostin otsikot ja estättekö väärentämisen {#do-you-preserve-original-email-headers-and-prevent-spoofing}

> \[!TIP]
> Forward Email toteuttaa kehittyneen väärentämisen eston sähköpostin väärinkäytön estämiseksi.

Forward Email säilyttää alkuperäiset sähköpostin otsikot samalla kun se toteuttaa kattavan väärentämisen eston MX-koodipohjassa:

* **Otsikoiden säilyttäminen**: Alkuperäiset todennusotsikot säilytetään edelleenlähetyksen aikana
* **Väärentämisen esto**: DMARC-politiikan noudattaminen estää otsikoiden väärentämisen hylkäämällä sähköpostit, jotka epäonnistuvat SPF- tai DKIM-tarkistuksessa
* **Otsikkojen injektoinnin estäminen**: Syötteen validointi ja puhdistus striptags-kirjastoa käyttäen
* **Edistynyt suojaus**: Kehittynyt kalastelun tunnistus väärentämisen havaitsemisella, esiintymisen estolla ja käyttäjien ilmoitusjärjestelmillä

**MX:n toteutuksen yksityiskohdat**: Sähköpostin ydinkäsittelylogiikka hoidetaan MX-palvelimen koodipohjassa, erityisesti:

* Pääasiallinen MX-datan käsittelijä: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>
* Satunnaisten sähköpostien suodatus (väärentämisen esto): <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-arbitrary.js>

`isArbitrary`-apufunktio toteuttaa kehittyneitä väärentämisen estosääntöjä, mukaan lukien verkkotunnuksen esiintymisen tunnistus, estetyt lauseet ja erilaiset kalastelumallit.
### Kuinka suojaudutte roskapostilta ja väärinkäytöksiltä {#how-do-you-protect-against-spam-and-abuse}

Forward Email toteuttaa kattavan monikerroksisen suojauksen:

* **Nopeusrajoitus**: Käytössä todennusyrityksissä, API-päätepisteissä ja SMTP-yhteyksissä
* **Resurssien eristäminen**: Käyttäjien välillä estämään vaikutukset suurten käyttäjien toiminnasta
* **DDoS-suojaus**: Monikerroksinen suojaus DataPacketin Shield-järjestelmän ja Cloudflaren kautta
* **Automaattinen skaalaus**: Dynaaminen resurssien säätö kysynnän mukaan
* **Väärinkäytösten ehkäisy**: Käyttäjäkohtaiset väärinkäytön estotarkastukset ja hash-pohjainen estäminen haitalliselle sisällölle
* **Sähköpostin todennus**: SPF-, DKIM-, DMARC-protokollat kehittyneellä kalastelun tunnistuksella

Lähteet:

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver> (DDoS-suojauksen tiedot)
* <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/abuse-prevention-by-user-id.js>

### Tallennatteko sähköpostisisältöä levylle {#do-you-store-email-content-on-disk}

> \[!IMPORTANT]
> Forward Email käyttää nollatietoisarkkitehtuuria, joka estää sähköpostisisällön kirjoittamisen levylle.

* **Nollatietoisarkkitehtuuri**: Yksilöllisesti salatut SQLite-postilaatikot tarkoittavat, että Forward Email ei pääse käsiksi sähköpostisisältöön
* **Muistipohjainen käsittely**: Sähköpostin käsittely tapahtuu kokonaan muistissa, vältetään levylle tallentamista
* **Ei sisällön lokitusta**: "Emme kirjaa tai tallenna sähköpostisisältöä tai metatietoja levylle"
* **Suojaus hiekkalaatikossa**: Salausavaimia ei koskaan tallenneta levylle selväkielisinä

**MX-koodipohjan todiste**: MX-palvelin käsittelee sähköpostit kokonaan muistissa ilman sisällön kirjoittamista levylle. Pääasiallinen sähköpostinkäsittelyä hoitava käsittelijä osoittaa tämän muistipohjaisen lähestymistavan: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

Lähteet:

* <https://forwardemail.net/technical-whitepaper.pdf#page=10> (Tiivistelmä)
* <https://forwardemail.net/technical-whitepaper.pdf#page=59> (Nollatietoisarkkitehtuurin tiedot)
* <https://forwardemail.net/technical-whitepaper.pdf#page=21> (Hiekkalaatikossa tapahtuva salaus)

### Voiko sähköpostisisältö paljastua järjestelmän kaatuessa {#can-email-content-be-exposed-during-system-crashes}

Ei. Forward Email toteuttaa kattavat turvatoimet kaatumiseen liittyvän datan paljastumisen estämiseksi:

* **Core dump -tiedostot pois käytöstä**: Estää muistin paljastumisen kaatumistilanteissa
* **Swap-muisti pois käytöstä**: Täysin pois käytöstä estämään arkaluontoisen datan poimimisen swap-tiedostoista
* **Muistipohjainen arkkitehtuuri**: Sähköpostisisältö on olemassa vain haihtuvassa muistissa käsittelyn aikana
* **Salausavainten suojaus**: Avaimia ei koskaan tallenneta levylle selväkielisinä
* **Fyysinen suojaus**: LUKS v2 -salatut levyt estävät fyysisen pääsyn dataan
* **USB-tallennus pois käytöstä**: Estää luvattoman datan poiminnan

**Virheenkäsittely järjestelmäongelmissa**: Forward Email käyttää apufunktioita `isCodeBug` ja `isTimeoutError` varmistaakseen, että jos tietokantayhteysongelmia, DNS-verkkoyhteys-/estolistojen ongelmia tai ylävirran yhteysongelmia ilmenee, järjestelmä palauttaa 421 SMTP -tilakoodit varmistaen, että sähköpostit yritetään lähettää uudelleen myöhemmin sen sijaan, että ne katoaisivat tai paljastuisivat.

Toteutuksen yksityiskohdat:

* Virheiden luokittelu: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js>
* Aikakatkaisujen virheenkäsittely MX-käsittelyssä: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

Lähde: <https://forwardemail.net/technical-whitepaper.pdf#page=15>

### Kuka pääsee sähköpostiinfrastruktuuriinne käsiksi {#who-has-access-to-your-email-infrastructure}

Forward Email toteuttaa kattavat käyttöoikeuksien hallinnat minimissään 2-3 hengen insinööriryhmän pääsyyn tiukkojen 2FA-vaatimusten kanssa:

* **Roolipohjainen käyttöoikeuksien hallinta**: Tiimitileille resurssipohjaisilla oikeuksilla
* **Vähimmän oikeuden periaate**: Käytössä kaikissa järjestelmissä
* **Tehtävien erottelu**: Operatiivisten roolien välillä
* **Käyttäjähallinta**: Eri deploy- ja devops-käyttäjät erillisillä oikeuksilla
* **Root-kirjautuminen pois käytöstä**: Pakottaa pääsyn asianmukaisesti todennetuilla tileillä
* **Tiukka 2FA**: Ei SMS-pohjaista 2FA:ta MiTM-hyökkäysriskin vuoksi – vain sovellus- tai laitepohjaiset tunnisteet
* **Kattava auditointilokitus**: Arkaluontoisen datan sensuroinnilla
* **Automaattinen poikkeavuuksien tunnistus**: Epätavallisten käyttökuvioiden havaitsemiseksi
* **Säännölliset turvallisuustarkastukset**: Käyttöoikeuslokeista
* **Evil Maid -hyökkäyksen esto**: USB-tallennus pois käytöstä ja muut fyysiset turvatoimet
Lähteet:

* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (Valtuutuksen hallinta)
* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (Verkon turvallisuus)
* <https://forwardemail.net/technical-whitepaper.pdf#page=15> (Pahantahtoisen siivoojan hyökkäyksen estäminen)

### Mitä infrastruktuuripalveluntarjoajia käytätte {#what-infrastructure-providers-do-you-use}

> \[!IMPORTANT]
> Forward Email käyttää useita infrastruktuurin alihankkijoita, joilla on kattavat vaatimustenmukaisuustodistukset.

Täydelliset tiedot löytyvät GDPR-vaatimustenmukaisuussivultamme: <https://forwardemail.net/gdpr>

**Ensisijaiset infrastruktuurin alihankkijat:**

| Palveluntarjoaja | Tietosuojakehyksen sertifioitu | GDPR-vaatimustenmukaisuussivu                                                             |
| ---------------- | ------------------------------ | ------------------------------------------------------------------------------------------ |
| **Cloudflare**   | ✅ Kyllä                       | <https://www.cloudflare.com/trust-hub/gdpr/>                                              |
| **DataPacket**   | ❌ Ei                         | <https://www.datapacket.com/privacy-policy>                                               |
| **DigitalOcean** | ❌ Ei                         | <https://www.digitalocean.com/legal/gdpr>                                                 |
| **GitHub**       | ✅ Kyllä                      | <https://docs.github.com/en/site-policy/privacy-policies/github-data-protection-agreement> |
| **Vultr**        | ❌ Ei                         | <https://www.vultr.com/legal/eea-gdpr-privacy/>                                           |

**Yksityiskohtaiset sertifikaatit:**

**DigitalOcean**

* SOC 2 Type II & SOC 3 Type II (tarkastanut Schellman & Company LLC)
* ISO 27001 -sertifioitu useissa datakeskuksissa
* PCI-DSS -yhteensopiva
* CSA STAR Level 1 -sertifioitu
* APEC CBPR PRP -sertifioitu
* Lisätiedot: <https://www.digitalocean.com/trust/certification-reports>

**Vultr**

* SOC 2+ (HIPAA) -sertifioitu
* PCI Merchant -yhteensopiva
* CSA STAR Level 1 -sertifioitu
* ISO/IEC 20000-1:2018, 27001:2022, 27017:2015, 27018:2019
* Lisätiedot: <https://www.vultr.com/legal/compliance/>

**DataPacket**

* SOC 2 -yhteensopiva (ota suoraan yhteyttä DataPacketiin sertifikaatin saamiseksi)
* Yritystason infrastruktuuri (Denverin sijainti)
* DDoS-suojaus Shield-tietoturvapinon kautta
* 24/7 tekninen tuki
* Globaali verkosto 58 datakeskuksessa
* Lisätiedot: <https://www.datapacket.com/datacenters/denver>

**GitHub**

* Tietosuojakehyksen sertifioitu (EU-USA, Sveitsi-USA ja UK-laajennus)
* Lähdekoodin isännöinti, CI/CD ja projektinhallinta
* GitHubin tietosuojan suojaussopimus saatavilla
* Lisätiedot: <https://docs.github.com/en/site-policy/privacy-policies/github-data-protection-agreement>

**Maksunvälittäjät:**

* **Stripe**: Tietosuojakehyksen sertifioitu - <https://stripe.com/legal/privacy-center>
* **PayPal**: Ei DPF-sertifioitu - <https://www.paypal.com/uk/legalhub/privacy-full>

### Tarjoatteko tietojenkäsittelysopimusta (DPA) {#do-you-offer-a-data-processing-agreement-dpa}

Kyllä, Forward Email tarjoaa kattavan tietojenkäsittelysopimuksen (DPA), joka voidaan allekirjoittaa yrityssopimuksemme yhteydessä. Kopio DPA:stamme on saatavilla osoitteessa: <https://forwardemail.net/dpa>

**DPA:n tiedot:**

* Kattaa GDPR-vaatimustenmukaisuuden sekä EU-USA/Sveitsi-USA Privacy Shield -kehykset
* Hyväksytään automaattisesti hyväksyttäessä käyttöehtomme
* Ei erillistä allekirjoitusta vakio-DPA:lle
* Räätälöidyt DPA-järjestelyt saatavilla Enterprise-lisenssin kautta

**GDPR-vaatimustenmukaisuuden kehys:**
DPA:ssamme kuvataan GDPR:n sekä kansainvälisten tietojen siirron vaatimustenmukaisuus. Täydelliset tiedot löytyvät osoitteesta: <https://forwardemail.net/gdpr>

Yritysasiakkaille, jotka tarvitsevat räätälöityjä DPA-ehtoja tai erityisiä sopimusjärjestelyjä, nämä voidaan hoitaa **Enterprise License ($250/kuukausi)** -ohjelmamme kautta.

### Miten käsittelette tietomurtotiedotteet {#how-do-you-handle-data-breach-notifications}

> \[!NOTE]
> Forward Emailin nollatietoinen arkkitehtuuri rajoittaa merkittävästi tietomurron vaikutuksia.
* **Rajoitettu tietojen paljastuminen**: Ei pääsyä salattuun sähköpostisisältöön nollatietoperiaatteen vuoksi
* **Vähäinen tietojen keruu**: Vain perusrekisteröityjätiedot ja rajalliset IP-lokit turvallisuutta varten
* **Alikäsittelijäkehykset**: DigitalOcean, GitHub ja Vultr ylläpitävät GDPR-yhteensopivia häiriötilanteiden käsittelymenettelyjä

**GDPR-edustajatiedot:**
Forward Email on nimennyt GDPR-edustajat artiklan 27 mukaisesti:

**EU-edustaja:**
Osano International Compliance Services Limited  
ATTN: LFHC  
3 Dublin Landings, North Wall Quay  
Dublin 1, D01C4E0

**UK-edustaja:**
Osano UK Compliance LTD  
ATTN: LFHC  
42-46 Fountain Street, Belfast  
Antrim, BT1 - 5EF

Yritysasiakkaille, jotka tarvitsevat erityisiä häiriöilmoitus-SLA-sopimuksia, nämä tulisi käsitellä osana **Enterprise License** -sopimusta.

Lähteet:

* <https://forwardemail.net/technical-whitepaper.pdf#page=59>
* <https://forwardemail.net/gdpr>

### Tarjoatteko testausympäristön {#do-you-offer-a-test-environment}

Forward Emailin tekninen dokumentaatio ei nimenomaisesti kuvaa erillistä hiekkalaatikkotilaa. Mahdollisia testausmenetelmiä ovat kuitenkin:

* **Itseisännöintivaihtoehto**: Kattavat itseisännöintimahdollisuudet testausympäristöjen luomiseen
* **API-rajapinta**: Mahdollisuus ohjelmalliseen konfiguraatioiden testaamiseen
* **Avoin lähdekoodi**: 100 % avoimen lähdekoodin koodi antaa asiakkaille mahdollisuuden tutkia edelleenlähetyslogiikkaa
* **Useat domainit**: Useiden domainien tuki voi mahdollistaa testidomainien luomisen

Yritysasiakkaille, jotka tarvitsevat virallisia hiekkalaatikkotoimintoja, tämä tulisi käsitellä osana **Enterprise License** -järjestelyä.

Lähde: <https://github.com/forwardemail/forwardemail.net> (Kehitysympäristön tiedot)

### Tarjoatteko valvonta- ja hälytystyökaluja {#do-you-provide-monitoring-and-alerting-tools}

Forward Email tarjoaa reaaliaikaista valvontaa joillakin rajoituksilla:

**Saatavilla:**

* **Reaaliaikainen toimituksen valvonta**: Julkisesti näkyvät suorituskykymittarit suurille sähköpostipalveluntarjoajille
* **Automaattinen hälytys**: Insinööriryhmä saa ilmoituksen, kun toimitusaika ylittää 10 sekuntia
* **Läpinäkyvä valvonta**: 100 % avoimen lähdekoodin valvontajärjestelmät
* **Infrastruktuurin valvonta**: Automaattinen poikkeamien havaitseminen ja kattava auditointilokitus

**Rajoitukset:**

* Asiakasrajapinnan webhookit tai API-pohjaiset toimitustilailmoitukset eivät ole nimenomaisesti dokumentoituja

Yritysasiakkaille, jotka tarvitsevat yksityiskohtaisia toimitustilailmoituksia webhookien kautta tai räätälöityjä valvontaintegraatioita, nämä ominaisuudet voivat olla saatavilla **Enterprise License** -järjestelyjen kautta.

Lähteet:

* <https://forwardemail.net> (Reaaliaikaisen valvonnan näyttö)
* <https://github.com/forwardemail/forwardemail.net> (Valvonnan toteutus)

### Miten varmistatte korkean käytettävyyden {#how-do-you-ensure-high-availability}

> \[!IMPORTANT]  
> Forward Email toteuttaa kattavan redundanssin useiden infrastruktuuritoimittajien välillä.

* **Hajautettu infrastruktuuri**: Useita toimittajia (DigitalOcean, Vultr, DataPacket) eri maantieteellisillä alueilla  
* **Maantieteellinen kuormantasapaino**: Cloudflare-pohjainen maantieteellisesti sijoitettu kuormantasapaino automaattisella varajärjestelmällä  
* **Automaattinen skaalaus**: Dynaaminen resurssien säätö kysynnän mukaan  
* **Monikerroksinen DDoS-suojaus**: DataPacketin Shield-järjestelmän ja Cloudflaren kautta  
* **Palvelinredundanssi**: Useita palvelimia per alue automaattisella varajärjestelmällä  
* **Tietokannan replikaatio**: Reaaliaikainen tietojen synkronointi useiden sijaintien välillä  
* **Valvonta ja hälytys**: 24/7 valvonta automaattisella häiriötilanteiden käsittelyllä

**Käytettävyystakuu**: 99,9 %+ palvelun saatavuus läpinäkyvällä valvonnalla osoitteessa <https://forwardemail.net>

Lähteet:

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver>

### Oletteko yhteensopivia kansallisen puolustuslupauslain (NDAA) kohdan 889 kanssa {#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa}

> \[!IMPORTANT]  
> Forward Email on täysin yhteensopiva kohdan 889 kanssa huolellisen infrastruktuurikumppaneiden valinnan ansiosta.

Kyllä, Forward Email on **kohdan 889 mukainen**. Kansallisen puolustuslupauslain (NDAA) kohta 889 kieltää valtion virastoja käyttämästä tai sopimasta tahojen kanssa, jotka käyttävät tietoliikenne- ja videovalvontalaitteita tietyiltä yrityksiltä (Huawei, ZTE, Hikvision, Dahua ja Hytera).
**Kuinka Forward Email saavuttaa Section 889 -vaatimustenmukaisuuden:**

Forward Email luottaa yksinomaan kahteen keskeiseen infrastruktuuripalveluntarjoajaan, jotka eivät kumpikaan käytä Section 889 kieltämää laitteistoa:

1. **Cloudflare**: Pääkumppanimme verkkopalveluissa ja sähköpostin turvallisuudessa
2. **DataPacket**: Pääpalveluntarjoajamme palvelininfrastruktuurissa (käyttäen yksinomaan Arista Networks- ja Cisco-laitteita)
3. **Varapalveluntarjoajat**: Varapalveluntarjoajamme Digital Ocean ja Vultr ovat lisäksi kirjallisesti vahvistettu Section 889 -vaatimustenmukaisiksi.

**Cloudflaren sitoutuminen**: Cloudflare toteaa nimenomaisesti kolmannen osapuolen toimintakoodissaan, etteivät he käytä telekommunikaatiolaitteita, videovalvontatuotteita tai palveluita mistään Section 889 kieltämistä tahoista.

**Hallinnon käyttötapaus**: Section 889 -vaatimustenmukaisuutemme vahvistettiin, kun **US Naval Academy** valitsi Forward Emailin turvallisiin sähköpostin edelleenlähetystarpeisiinsa, vaatiessaan dokumentaatiota liittovaltion vaatimustenmukaisuudestamme.

Täydelliset tiedot hallinnon vaatimustenmukaisuuskehyksestämme, mukaan lukien laajemmat liittovaltion säädökset, löydät kattavasta tapaustutkimuksestamme: [Liittovaltion hallinnon sähköpostipalvelu Section 889 -vaatimustenmukainen](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)


## Järjestelmä- ja tekniset tiedot {#system-and-technical-details}

### Tallennatteko sähköposteja ja niiden sisältöjä {#do-you-store-emails-and-their-contents}

Emme, emme kirjoita levyille emmekä tallenna lokitietoja – paitsi [virheiden osalta](#do-you-store-error-logs) ja [lähtö-SMTP:n osalta](#do-you-support-sending-email-with-smtp) (katso [Tietosuojakäytäntömme](/privacy)).

Kaikki tapahtuu muistissa ja [lähdekoodimme on GitHubissa](https://github.com/forwardemail).

### Kuinka sähköpostin edelleenlähetysjärjestelmänne toimii {#how-does-your-email-forwarding-system-work}

Sähköposti perustuu [SMTP-protokollaan](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol). Tämä protokolla koostuu palvelimelle lähetettävistä komennoista (yleisimmin portissa 25). Aluksi muodostetaan yhteys, sitten lähettäjä ilmoittaa, kuka on lähettäjä ("MAIL FROM"), sen jälkeen minne viesti menee ("RCPT TO") ja lopuksi sähköpostin otsikot ja itse viestin sisältö ("DATA"). Sähköpostin edelleenlähetysjärjestelmämme kulku kuvataan alla suhteessa kuhunkin SMTP-protokollan komentoon:

* Alkuperäinen yhteys (ei komentoa, esim. `telnet example.com 25`) – Tämä on alkuperäinen yhteys. Tarkistamme lähettäjät, jotka eivät ole [sallittujen listallamme](#do-you-have-an-allowlist), [kieltolistamme](#do-you-have-a-denylist) mukaan. Lopuksi, jos lähettäjä ei ole sallittujen listalla, tarkistamme, onko hän [harmaalistattu](#do-you-have-a-greylist).

* `HELO` – Tämä on tervehdys, jolla tunnistetaan lähettäjän FQDN, IP-osoite tai sähköpostinkäsittelijän nimi. Tätä arvoa voidaan väärentää, joten emme luota tähän tietoon vaan käytämme yhteyden IP-osoitteen käänteistä isäntänimen hakua.

* `MAIL FROM` – Tämä ilmaisee sähköpostin kuoren lähettäjäosoitteen. Jos arvo annetaan, sen on oltava kelvollinen RFC 5322 -sähköpostiosoite. Tyhjät arvot ovat sallittuja. Tarkistamme tässä [takaisinsyötön](#how-do-you-protect-against-backscatter) ja myös MAIL FROM -osoitteen [kieltolistamme](#do-you-have-a-denylist) mukaan. Lopuksi tarkistamme sallittujen listalla olemattomat lähettäjät nopeusrajoituksen osalta (katso lisätietoja kohdista [Nopeusrajoitus](#do-you-have-rate-limiting) ja [sallittu lista](#do-you-have-an-allowlist)).

* `RCPT TO` – Tämä ilmaisee sähköpostin vastaanottajan tai vastaanottajat. Näiden on oltava kelvollisia RFC 5322 -sähköpostiosoitteita. Sallitamme enintään 50 kuoren vastaanottajaa viestiä kohden (tämä eroaa sähköpostin "To"-otsikosta). Tarkistamme myös kelvollisen [Sender Rewriting Scheme](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme) ("SRS") -osoitteen suojautuaksemme väärentämiseltä SRS-verkkotunnuksemme avulla.

* `DATA` – Tämä on palvelumme ydinosa, joka käsittelee sähköpostin. Katso alla oleva osio [Kuinka käsittelette sähköpostin edelleenlähetystä varten](#how-do-you-process-an-email-for-forwarding) saadaksesi lisätietoja.
### Kuinka käsittelet sähköpostin edelleenlähetystä varten {#how-do-you-process-an-email-for-forwarding}

Tässä osiossa kuvataan prosessimme liittyen SMTP-protokollan komentoon `DATA` kohdassa [Miten sähköpostin edelleenlähetysjärjestelmänne toimii](#how-does-your-email-forwarding-system-work) yllä – se kertoo, miten käsittelemme sähköpostin otsikot, sisällön, turvallisuuden, määritämme, minne se täytyy toimittaa, ja miten käsittelemme yhteydet.

1. Jos viesti ylittää enimmäiskoon 50 Mt, se hylätään virhekoodilla 552.

2. Jos viestissä ei ollut "From"-otsikkoa tai jos "From"-otsikon arvot eivät olleet kelvollisia RFC 5322 -sähköpostiosoitteita, se hylätään virhekoodilla 550.

3. Jos viestissä oli yli 25 "Received"-otsikkoa, se todettiin olevan jumissa uudelleenohjaussilmukassa, ja se hylätään virhekoodilla 550.

4. Käyttäen sähköpostin sormenjälkeä (katso osio [Fingerprinting](#how-do-you-determine-an-email-fingerprint)), tarkistamme, onko viestin uudelleenyritystä yritetty yli 5 päivän ajan (mikä vastaa [postfixin oletuskäyttäytymistä](http://www.postfix.org/postconf.5.html#maximal_queue_lifetime)), ja jos näin on, se hylätään virhekoodilla 550.

5. Tallennamme muistiin tulokset sähköpostin skannauksesta käyttäen [Spam Scanner](https://spamscanner.net) -palvelua.

6. Jos Spam Scanner antoi mielivaltaisia tuloksia, viesti hylätään virhekoodilla 554. Mielivaltaiset tulokset sisältävät tällä hetkellä vain GTUBE-testin. Lisätietoja löytyy osoitteesta <https://spamassassin.apache.org/gtube/>.

7. Lisäämme viestiin seuraavat otsikot virheenkorjauksen ja väärinkäytösten estämisen vuoksi:

   * `Received` – lisäämme tämän standardin Received-otsikon alkuperäisen IP-osoitteen ja isännän, siirtotyypin, TLS-yhteystiedot, päivämäärän/kellonajan ja vastaanottajan.
   * `X-Original-To` – viestin alkuperäinen vastaanottaja:
     * Tämä on hyödyllinen sen määrittämiseen, minne sähköposti alun perin toimitettiin (Received-otsikon lisäksi).
     * Tämä lisätään vastaanottajakohtaisesti IMAP- ja/tai maskatun edelleenlähetyksen yhteydessä (yksityisyyden suojaamiseksi).
   * `X-Forward-Email-Website` – sisältää linkin verkkosivuillemme <https://forwardemail.net>
   * `X-Forward-Email-Version` – nykyinen [SemVer](https://semver.org/) -versio `package.json` -tiedostosta koodipohjastamme.
   * `X-Forward-Email-Session-ID` – istunnon tunnus debug-tarkoituksiin (käytössä vain ei-tuotantoympäristöissä).
   * `X-Forward-Email-Sender` – pilkuin eroteltu lista, joka sisältää alkuperäisen envelope MAIL FROM -osoitteen (jos se ei ollut tyhjä), käänteisen PTR-asiakkaan FQDN:n (jos olemassa) ja lähettäjän IP-osoitteen.
   * `X-Forward-Email-ID` – soveltuu vain lähtevään SMTP:hen ja vastaa sähköpostin tunnusta, joka on tallennettu Oma tili → Sähköpostit -osiossa.
   * `X-Report-Abuse` – arvolla `abuse@forwardemail.net`.
   * `X-Report-Abuse-To` – arvolla `abuse@forwardemail.net`.
   * `X-Complaints-To` – arvolla `abuse@forwardemail.net`.

8. Tarkistamme viestin [DKIM](https://en.wikipedia.org/wiki/DomainKeys_Identified_Mail), [SPF](https://en.wikipedia.org/wiki/Sender_Policy_Framework), [ARC](https://en.wikipedia.org/wiki/Authenticated_Received_Chain) ja [DMARC](https://en.wikipedia.org/wiki/DMARC) -määritysten mukaisesti.

   * Jos viesti epäonnistui DMARC-tarkistuksessa ja domainilla oli hylkäyspolitiikka (esim. `p=reject` [oli DMARC-politiikassa](https://wikipedia.org/wiki/DMARC)), se hylätään virhekoodilla 550. Tyypillisesti DMARC-politiikka löytyy `_dmarc`-aliverkkotunnuksen <strong class="notranslate">TXT</strong>-tietueesta (esim. `dig _dmarc.example.com txt`).
   * Jos viesti epäonnistui SPF-tarkistuksessa ja domainilla oli tiukka hylkäyspolitiikka (esim. `-all` SPF-politiikassa verrattuna `~all` tai ilman politiikkaa), se hylätään virhekoodilla 550. Tyypillisesti SPF-politiikka löytyy juuriverkkotunnuksen <strong class="notranslate">TXT</strong>-tietueesta (esim. `dig example.com txt`). Katso tästä osiosta lisätietoja [sähköpostin lähettämisestä Gmailin kautta](#can-i-send-mail-as-in-gmail-with-this) liittyen SPF:ään.
9. Nyt käsittelemme viestin vastaanottajat, jotka on kerätty `RCPT TO` -komennosta kohdassa [Miten sähköpostin edelleenlähetysjärjestelmäsi toimii](#how-does-your-email-forwarding-system-work) yllä. Jokaiselle vastaanottajalle suoritamme seuraavat toiminnot:

   * Haemme <strong class="notranslate">TXT</strong>-tietueet verkkotunnuksen nimelle (osa `@`-merkin jälkeen, esim. `example.com` jos sähköpostiosoite oli `test@example.com`). Esimerkiksi, jos verkkotunnus on `example.com`, teemme DNS-haun kuten `dig example.com txt`.
   * Jäsennämme kaikki <strong class="notranslate">TXT</strong>-tietueet, jotka alkavat joko `forward-email=` (ilmaiset suunnitelmat) tai `forward-email-site-verification=` (maksulliset suunnitelmat). Huomaa, että jäsennämme molemmat, jotta sähköposteja voidaan käsitellä käyttäjän vaihtaessa suunnitelmaa ylös- tai alaspäin.
   * Näistä jäsennetyistä <strong class="notranslate">TXT</strong>-tietueista käymme läpi ne poimiaksemme edelleenlähetyskonfiguraation (kuten on kuvattu kohdassa [Miten aloitan ja asetan sähköpostin edelleenlähetyksen](#how-do-i-get-started-and-set-up-email-forwarding) yllä). Huomaa, että tuemme vain yhtä `forward-email-site-verification=` -arvoa, ja jos niitä on useampi, syntyy 550-virhe ja lähettäjä saa palautteen tästä vastaanottajasta.
   * Rekursiivisesti käymme läpi poimitun edelleenlähetyskonfiguraation määrittääksemme globaalin edelleenlähetyksen, regex-pohjaisen edelleenlähetyksen ja kaikki muut tuetut edelleenlähetyskonfiguraatiot – jotka tunnetaan nyt nimellä "Edelleenlähetysosoitteet".
   * Jokaiselle Edelleenlähetysosoitteelle tuemme yhtä rekursiivista hakua (joka aloittaa tämän sarjan toimintoja annetulle osoitteelle). Jos rekursiivinen osuma löytyy, vanhempi tulos poistetaan Edelleenlähetysosoitteista ja lapset lisätään.
   * Edelleenlähetysosoitteet jäsennetään ainutlaatuisuuden varmistamiseksi (koska emme halua lähettää duplikaatteja yhdelle osoitteelle tai luoda tarpeettomia SMTP-asiakas-yhteyksiä).
   * Jokaiselle Edelleenlähetysosoitteelle haemme sen verkkotunnuksen API-päätepisteestämme `/v1/max-forwarded-addresses` (määrittääksemme, kuinka monelle osoitteelle verkkotunnus saa edelleenlähettää sähköpostia aliasia kohden, esim. oletuksena 10 – katso kohta [rajoituksesta edelleenlähetyksen määrälle aliasia kohden](#is-there-a-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias)). Jos tämä raja ylittyy, syntyy 550-virhe ja lähettäjä saa palautteen tästä vastaanottajasta.
   * Haemme alkuperäisen vastaanottajan asetukset API-päätepisteestämme `/v1/settings`, joka tukee haun maksullisille käyttäjille (varalla ilmaisille käyttäjille). Tämä palauttaa konfiguraatio-olion edistyneille asetuksille `port` (Numero, esim. `25`), `has_adult_content_protection` (Boolean), `has_phishing_protection` (Boolean), `has_executable_protection` (Boolean) ja `has_virus_protection` (Boolean).
   * Näiden asetusten perusteella tarkistamme sitten Roskapostiskannerin tulokset ja jos virheitä ilmenee, viesti hylätään 554-virhekoodilla (esim. jos `has_virus_protection` on käytössä, tarkistamme Roskapostiskannerin tulokset virusten varalta). Huomaa, että kaikki ilmaiset käyttäjät ovat oletuksena valinneet tarkistukset aikuisviestien, kalastelun, suoritettavien tiedostojen ja virusten varalta. Oletuksena myös kaikki maksulliset käyttäjät ovat valinneet nämä, mutta tätä asetusta voi muuttaa Verkkotunnuksen asetussivulla Forward Email -hallintapaneelissa).

10. Jokaisen käsitellyn vastaanottajan Edelleenlähetysosoitteille suoritamme sitten seuraavat toiminnot:

    * Osoite tarkistetaan [kieltolistaltamme](#do-you-have-a-denylist), ja jos se löytyy listalta, syntyy 421-virhekoodi (ilmoittaa lähettäjälle yrittää uudelleen myöhemmin).
    * Jos osoite on webhook, asetamme Boolean-arvon tulevia toimintoja varten (katso alla – ryhmittelemme samanlaiset webhookit yhdeksi POST-pyynnöksi useiden sijaan toimituksessa).
    * Jos osoite on sähköpostiosoite, jäsennämme isäntänimen tulevia toimintoja varten (katso alla – ryhmittelemme samanlaiset isännät yhdeksi yhteydeksi useiden yksittäisten sijaan toimituksessa).
11. Jos vastaanottajia ei ole eikä palautuksia ole, vastaamme virheellä 550 "Virheelliset vastaanottajat".

12. Jos vastaanottajia on, käymme ne läpi (ryhmiteltyinä saman isännän mukaan) ja toimitamme sähköpostit. Katso alla oleva osio [Miten käsittelette sähköpostin toimitusongelmia](#how-do-you-handle-email-delivery-issues) saadaksesi lisätietoa.

    * Jos sähköpostien lähetyksessä tapahtuu virheitä, tallennamme ne muistiin myöhempää käsittelyä varten.
    * Otamme sähköpostien lähetyksestä mahdollisesti saadun alhaisimman virhekoodin ja käytämme sitä vastauksena `DATA`-komentoon. Tämä tarkoittaa, että toimittamattomat sähköpostit yritetään yleensä lähettää uudelleen alkuperäisen lähettäjän toimesta, mutta jo toimitettuja sähköposteja ei lähetetä uudelleen seuraavalla viestin lähetyskerralla (koska käytämme [Sormenjälkitunnistusta](#how-do-you-determine-an-email-fingerprint)).
    * Jos virheitä ei tapahtunut, lähetämme 250 onnistuneen SMTP-vastauksen tilakoodin.
    * Palautus määritellään kaikeksi toimitusyritykseksi, joka johtaa tilakoodiin >= 500 (pysyvät virheet).

13. Jos palautuksia ei tapahtunut (pysyviä virheitä), palautamme SMTP-vastauksen tilakoodin, joka on alhaisin ei-pysyvien virheiden koodista (tai 250 onnistuneen tilakoodin, jos ei ollut virheitä).

14. Jos palautuksia tapahtui, lähetämme palautussähköpostit taustalla sen jälkeen, kun olemme palauttaneet lähettäjälle alhaisimman kaikista virhekoodeista. Jos alin virhekoodi on >= 500, emme kuitenkaan lähetä palautussähköposteja. Tämä johtuu siitä, että muuten lähettäjät saisivat kaksoispalautussähköpostin (esim. yhden omasta lähtevän MTA:staan, kuten Gmailista – ja myös yhden meiltä). Katso osio [Miten suojaudutte backscatterilta](#how-do-you-protect-against-backscatter) saadaksesi lisätietoa.

### Miten käsittelette sähköpostin toimitusongelmia {#how-do-you-handle-email-delivery-issues}

Huomaa, että teemme "Friendly-From" -uudelleenkirjoituksen sähköposteihin vain, jos lähettäjän DMARC-käytäntö ei läpäise ja mikään DKIM-allekirjoitus ei ole kohdistettu "From"-otsikkoon. Tämä tarkoittaa, että muutamme viestin "From"-otsikkoa, asetamme "X-Original-From" ja asetamme myös "Reply-To"-otsikon, jos sitä ei vielä ollut. Uudelleenkirjoituksen jälkeen uudelleenallekirjoitamme myös ARC-leiman viestiin.

Käytämme myös älykästä virheilmoitusten jäsentämistä kaikilla pinon tasoilla – koodissamme, DNS-pyynnöissä, Node.js:n sisäisissä toiminnoissa, HTTP-pyynnöissä (esim. 408, 413 ja 429 kartoitetaan SMTP-vastaukseksi 421, jos vastaanottaja on webhook) ja sähköpostipalvelimen vastauksissa (esim. vastaukset, joissa on "defer" tai "slowdown", yritetään uudelleen 421-virheinä).

Logiikkamme on helppokäyttöinen ja se yrittää uudelleen myös SSL/TLS-virheiden, yhteysongelmien ja muiden tilanteiden kohdalla. Tavoitteena on maksimoida toimitettavuus kaikille vastaanottajille edelleenlähetyskonfiguraatiossa.

Jos vastaanottaja on webhook, sallimme 60 sekunnin aikakatkaisun pyynnön suorittamiselle ja enintään 3 uudelleenyritystä (eli yhteensä 4 pyyntöä ennen epäonnistumista). Huomaa, että jäsennämme oikein virhekoodit 408, 413 ja 429 ja kartoitamme ne SMTP-vastaukseksi 421.

Jos vastaanottaja on sähköpostiosoite, yritämme lähettää sähköpostin opportunistisen TLS:n avulla (yritämme käyttää STARTTLS:ää, jos se on vastaanottajan sähköpostipalvelimella saatavilla). Jos SSL/TLS-virhe tapahtuu lähetyksen aikana, yritämme lähettää sähköpostin ilman TLS:ää (ilman STARTTLS:ää).

Jos DNS- tai yhteysvirheitä tapahtuu, palautamme `DATA`-komentoon SMTP-vastauksen tilakoodilla 421, muuten jos virheitä on >= 500-tasolla, palautukset lähetetään.

Jos havaitsemme, että sähköpostipalvelin, johon yritämme toimittaa, on estänyt yhden tai useamman sähköpostivälityspalvelimemme IP-osoitteen (esim. roskapostin torjuntateknologian vuoksi), lähetämme lähettäjälle SMTP-vastauksen tilakoodilla 421, jotta viestiä yritetään myöhemmin uudelleen (ja saamme hälytyksen ongelmasta, jotta voimme toivottavasti ratkaista sen ennen seuraavaa yritystä).

### Miten käsittelette IP-osoitteidenne estämisen {#how-do-you-handle-your-ip-addresses-becoming-blocked}
Seuraamme säännöllisesti kaikkia suuria DNS-kieltolistoja, ja jos jokin sähköpostivaihtomme ("MX") IP-osoitteista on listattu suuressa kieltolistassa, poistamme sen kyseisestä DNS A -tietueen pyörivästä kierrosta, jos mahdollista, kunnes ongelma on ratkaistu.

Kirjoitushetkellä meidät on listattu myös useisiin DNS-sallintalistoihin, ja otamme kieltolistojen seurannan vakavasti. Jos havaitset ongelmia ennen kuin ehditään ne ratkaista, ilmoitathan niistä kirjallisesti osoitteeseen <support@forwardemail.net>.

IP-osoitteemme ovat julkisesti saatavilla, [katso alla oleva osio saadaksesi lisätietoja](#what-are-your-servers-ip-addresses).

### Mitkä ovat postmaster-osoitteet {#what-are-postmaster-addresses}

Väärin ohjattujen palautusten ja lomavastausviestien lähettämisen estämiseksi valvomattomiin tai olemattomiin postilaatikoihin ylläpidämme listaa mailer-daemon-tyyppisistä käyttäjänimistä:

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
* [ja kaikki no-reply-osoitteet](#what-are-no-reply-addresses)

Katso [RFC 5320 Section 4.6](https://datatracker.ietf.org/doc/html/rfc5230#section-4.6) saadaksesi lisätietoa siitä, miten tällaisia listoja käytetään tehokkaiden sähköpostijärjestelmien luomiseksi.

### Mitkä ovat no-reply-osoitteet {#what-are-no-reply-addresses}

Sähköpostikäyttäjänimet, jotka vastaavat jotakin seuraavista (kirjaimista riippumatta), katsotaan no-reply-osoitteiksi:

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

Tätä listaa ylläpidetään [avoimen lähdekoodin projektina GitHubissa](https://github.com/forwardemail/reserved-email-addresses-list).

### Mitkä ovat palvelimesi IP-osoitteet {#what-are-your-servers-ip-addresses}

Julkaisemme IP-osoitteemme osoitteessa <https://forwardemail.net/ips>.

### Onko teillä sallintalistaa {#do-you-have-an-allowlist}

Kyllä, meillä on [lista oletuksena sallituista verkkotunnusten päätteistä](#what-domain-name-extensions-are-allowlisted-by-default) sekä dynaaminen, välimuistissa oleva ja pyörivä sallintalista, joka perustuu [tiukkoihin kriteereihin](#what-is-your-allowlist-criteria).

Kaikki maksavien asiakkaiden käyttämät verkkotunnukset, sähköpostit ja IP-osoitteet tarkistetaan automaattisesti kieltolistamme mukaan tunnin välein – mikä hälyttää ylläpitäjät, jotka voivat tarvittaessa puuttua asiaan manuaalisesti.

Lisäksi, jos jokin verkkotunnuksistasi tai sen sähköpostiosoitteista on kieltolistattu (esim. roskapostin, virusten tai jäljittelyhyökkäysten vuoksi) – verkkotunnuksen ylläpitäjät (sinä) ja tiimimme ylläpitäjät saavat siitä välittömästi ilmoituksen sähköpostitse. Suosittelemme vahvasti, että [määrität DMARCin](#how-do-i-set-up-dmarc-for-forward-email) tämän estämiseksi.

### Mitkä verkkotunnusten päätteet ovat oletuksena sallittuja {#what-domain-name-extensions-are-allowlisted-by-default}

Seuraavat verkkotunnusten päätteet katsotaan oletuksena sallituiksi (riippumatta siitä, ovatko ne Umbrella Popularity Listillä vai eivät):

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
  <li class="list-inline-item"><code class="notranslate">parliament.nz</code></li>
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
Lisäksi nämä [brändi- ja yritystason ylätason verkkotunnukset](https://en.wikipedia.org/wiki/List_of_Internet_top-level_domains#Brand_and_corporate_top-level_domains) ovat oletuksena sallittuja (esim. `apple` kohteelle `applecard.apple` Apple Card -pankkitiliotteille):

<ul class="list-inline">
  <li class="list-inline-item"><code class="notranslate">aaa</code></li>
  <li class="list-inline-item"><code class="notranslate">aarp</code></li>
  <li class="list-inline-item"><code class="notranslate">abarth</code></li>
  <li class="list-inline-item"><code class="notranslate">abb</code></li>
  <li class="list-inline-item"><code class="notranslate">abbott</code></li>
  <li class="list-inline-item"><code class="notranslate">abbvie</code></li>
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
  <li class="list-inline-item"><code class="notranslate">apple</code></li>
  <li class="list-inline-item"><code class="notranslate">aquarelle</code></li>
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
  <li class="list-inline-item"><code class="notranslate">basketball</code></li>
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
  <!--<li class="list-inline-item"><code class="notranslate">bond</code></li>-->
  <li class="list-inline-item"><code class="notranslate">booking</code></li>
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
  <li class="list-inline-item"><code class="notranslate">caravan</code></li>
  <li class="list-inline-item"><code class="notranslate">cartier</code></li>
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
  <li class="list-inline-item"><code class="notranslate">citadel</code></li>
  <li class="list-inline-item"><code class="notranslate">citi</code></li>
  <li class="list-inline-item"><code class="notranslate">citic</code></li>
  <li class="list-inline-item"><code class="notranslate">clubmed</code></li>
  <li class="list-inline-item"><code class="notranslate">comcast</code></li>
  <li class="list-inline-item"><code class="notranslate">commbank</code></li>
  <li class="list-inline-item"><code class="notranslate">creditunion</code></li>
  <li class="list-inline-item"><code class="notranslate">crown</code></li>
  <li class="list-inline-item"><code class="notranslate">crs</code></li>
  <li class="list-inline-item"><code class="notranslate">csc</code></li>
  <li class="list-inline-item"><code class="notranslate">cuisinella</code></li>
  <li class="list-inline-item"><code class="notranslate">dabur</code></li>
  <li class="list-inline-item"><code class="notranslate">datsun</code></li>
  <li class="list-inline-item"><code class="notranslate">dealer</code></li>
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
  <li class="list-inline-item"><code class="notranslate">firestone</code></li>
  <li class="list-inline-item"><code class="notranslate">firmdale</code></li>
  <li class="list-inline-item"><code class="notranslate">flickr</code></li>
  <li class="list-inline-item"><code class="notranslate">flir</code></li>
  <li class="list-inline-item"><code class="notranslate">flsmidth</code></li>
  <li class="list-inline-item"><code class="notranslate">ford</code></li>
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
  <li class="list-inline-item"><code class="notranslate">genting</code></li>
  <li class="list-inline-item"><code class="notranslate">giving</code></li>
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
  <li class="list-inline-item"><code class="notranslate">liaison</code></li>
  <li class="list-inline-item"><code class="notranslate">lexus</code></li>
  <li class="list-inline-item"><code class="notranslate">lidl</code></li>
  <li class="list-inline-item"><code class="notranslate">lifestyle</code></li>
  <li class="list-inline-item"><code class="notranslate">lilly</code></li>
  <li class="list-inline-item"><code class="notranslate">lincoln</code></li>
  <li class="list-inline-item"><code class="notranslate">linde</code></li>
  <li class="list-inline-item"><code class="notranslate">lipsy</code></li>
  <li class="list-inline-item"><code class="notranslate">lixil</code></li>
  <li class="list-inline-item"><code class="notranslate">locus</code></li>
  <li class="list-inline-item"><code class="notranslate">lotte</code></li>
  <li class="list-inline-item"><code class="notranslate">lpl</code></li>
  <li class="list-inline-item"><code class="notranslate">lplfinancial</code></li>
  <li class="list-inline-item"><code class="notranslate">lundbeck</code></li>
  <li class="list-inline-item"><code class="notranslate">lupin</code></li>
  <li class="list-inline-item"><code class="notranslate">macys</code></li>
  <li class="list-inline-item"><code class="notranslate">maif</code></li>
  <li class="list-inline-item"><code class="notranslate">man</code></li>
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
  <li class="list-inline-item"><code class="notranslate">mutual</code></li>
  <li class="list-inline-item"><code class="notranslate">nadex</code></li>
  <li class="list-inline-item"><code class="notranslate">nationwide</code></li>
  <li class="list-inline-item"><code class="notranslate">natura</code></li>
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
  <li class="list-inline-item"><code class="notranslate">office</code></li>
  <li class="list-inline-item"><code class="notranslate">omega</code></li>
  <li class="list-inline-item"><code class="notranslate">oracle</code></li>
  <li class="list-inline-item"><code class="notranslate">orange</code></li>
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
  <li class="list-inline-item"><code class="notranslate">play</code></li>
  <li class="list-inline-item"><code class="notranslate">playstation</code></li>
  <li class="list-inline-item"><code class="notranslate">pohl</code></li>
  <li class="list-inline-item"><code class="notranslate">politie</code></li>
  <li class="list-inline-item"><code class="notranslate">praxi</code></li>
  <li class="list-inline-item"><code class="notranslate">prod</code></li>
  <li class="list-inline-item"><code class="notranslate">progressive</code></li>
  <li class="list-inline-item"><code class="notranslate">pru</code></li>
  <li class="list-inline-item"><code class="notranslate">prudential</code></li>
  <li class="list-inline-item"><code class="notranslate">pwc</code></li>
  <!--<li class="list-inline-item"><code class="notranslate">quest</code></li>-->
  <li class="list-inline-item"><code class="notranslate">qvc</code></li>
  <li class="list-inline-item"><code class="notranslate">redstone</code></li>
  <li class="list-inline-item"><code class="notranslate">reliance</code></li>
  <li class="list-inline-item"><code class="notranslate">rexroth</code></li>
  <li class="list-inline-item"><code class="notranslate">ricoh</code></li>
  <li class="list-inline-item"><code class="notranslate">rmit</code></li>
  <li class="list-inline-item"><code class="notranslate">rocher</code></li>
  <li class="list-inline-item"><code class="notranslate">rogers</code></li>
  <li class="list-inline-item"><code class="notranslate">rwe</code></li>
  <li class="list-inline-item"><code class="notranslate">safety</code></li>
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
  <li class="list-inline-item"><code class="notranslate">schwarz</code></li>
  <li class="list-inline-item"><code class="notranslate">scjohnson</code></li>
  <li class="list-inline-item"><code class="notranslate">scor</code></li>
  <li class="list-inline-item"><code class="notranslate">seat</code></li>
  <li class="list-inline-item"><code class="notranslate">sener</code></li>
  <li class="list-inline-item"><code class="notranslate">ses</code></li>
  <li class="list-inline-item"><code class="notranslate">sew</code></li>
  <li class="list-inline-item"><code class="notranslate">seven</code></li>
  <li class="list-inline-item"><code class="notranslate">sfr</code></li>
  <li class="list-inline-item"><code class="notranslate">seek</code></li>
  <li class="list-inline-item"><code class="notranslate">shangrila</code></li>
  <li class="list-inline-item"><code class="notranslate">sharp</code></li>
  <li class="list-inline-item"><code class="notranslate">shaw</code></li>
  <li class="list-inline-item"><code class="notranslate">shell</code></li>
  <li class="list-inline-item"><code class="notranslate">shriram</code></li>
  <li class="list-inline-item"><code class="notranslate">sina</code></li>
  <li class="list-inline-item"><code class="notranslate">sky</code></li>
  <li class="list-inline-item"><code class="notranslate">skype</code></li>
  <li class="list-inline-item"><code class="notranslate">smart</code></li>
  <li class="list-inline-item"><code class="notranslate">sncf</code></li>
  <li class="list-inline-item"><code class="notranslate">softbank</code></li>
  <li class="list-inline-item"><code class="notranslate">sohu</code></li>
  <li class="list-inline-item"><code class="notranslate">sony</code></li>
  <li class="list-inline-item"><code class="notranslate">spiegel</code></li>
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
  <li class="list-inline-item"><code class="notranslate">total</code></li>
  <li class="list-inline-item"><code class="notranslate">toyota</code></li>
  <li class="list-inline-item"><code class="notranslate">travelchannel</code></li>
  <li class="list-inline-item"><code class="notranslate">travelers</code></li>
  <li class="list-inline-item"><code class="notranslate">tui</code></li>
  <li class="list-inline-item"><code class="notranslate">tvs</code></li>
  <li class="list-inline-item"><code class="notranslate">ubs</code></li>
  <li class="list-inline-item"><code class="notranslate">unicom</code></li>
  <li class="list-inline-item"><code class="notranslate">uol</code></li>
  <li class="list-inline-item"><code class="notranslate">ups</code></li>
  <li class="list-inline-item"><code class="notranslate">vanguard</code></li>
  <li class="list-inline-item"><code class="notranslate">verisign</code></li>
  <li class="list-inline-item"><code class="notranslate">vig</code></li>
  <li class="list-inline-item"><code class="notranslate">viking</code></li>
  <li class="list-inline-item"><code class="notranslate">virgin</code></li>
  <li class="list-inline-item"><code class="notranslate">visa</code></li>
  <li class="list-inline-item"><code class="notranslate">vista</code></li>
  <li class="list-inline-item"><code class="notranslate">vistaprint</code></li>
  <li class="list-inline-item"><code class="notranslate">vivo</code></li>
  <li class="list-inline-item"><code class="notranslate">volkswagen</code></li>
  <li class="list-inline-item"><code class="notranslate">volvo</code></li>
  <li class="list-inline-item"><code class="notranslate">walmart</code></li>
  <li class="list-inline-item"><code class="notranslate">walter</code></li>
  <li class="list-inline-item"><code class="notranslate">weatherchannel</code></li>
  <li class="list-inline-item"><code class="notranslate">weber</code></li>
  <li class="list-inline-item"><code class="notranslate">weir</code></li>
  <li class="list-inline-item"><code class="notranslate">williamhill</code></li>
  <li class="list-inline-item"><code class="notranslate">windows</code></li>
  <li class="list-inline-item"><code class="notranslate">wme</code></li>
  <li class="list-inline-item"><code class="notranslate">wolterskluwer</code></li>
  <li class="list-inline-item"><code class="notranslate">woodside</code></li>
  <li class="list-inline-item"><code class="notranslate">wtc</code></li>
  <li class="list-inline-item"><code class="notranslate">xbox</code></li>
  <li class="list-inline-item"><code class="notranslate">xerox</code></li>
  <li class="list-inline-item"><code class="notranslate">xfinity</code></li>
  <li class="list-inline-item"><code class="notranslate">yahoo</code></li>
  <li class="list-inline-item"><code class="notranslate">yamaxun</code></li>
  <li class="list-inline-item"><code class="notranslate">yandex</code></li>
  <li class="list-inline-item"><code class="notranslate">yodobashi</code></li>
  <li class="list-inline-item"><code class="notranslate">youtube</code></li>
  <li class="list-inline-item"><code class="notranslate">zappos</code></li>
  <li class="list-inline-item"><code class="notranslate">zara</code></li>
  <li class="list-inline-item"><code class="notranslate">zippo</code></li>
</ul>
18. maaliskuuta 2025 alkaen olemme myös lisänneet nämä Ranskan merentakaiset alueet tälle listalle ([tämän GitHub-pyynnön mukaan](https://github.com/forwardemail/forwardemail.net/issues/327)):

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

Lokakuussa 2025 olemme myös lisänneet <code class="notranslate">cz</code> (Tšekin tasavalta) kysynnän vuoksi.

Emme nimenomaisesti sisällyttäneet `ru` ja `ua` johtuen korkeasta roskapostitoiminnasta.

### Mikä on sallittujen listasi kriteeri {#what-is-your-allowlist-criteria}

Meillä on staattinen lista [oletuksena sallituista verkkotunnuspäätteistä](#what-domain-name-extensions-are-allowlisted-by-default) – ja ylläpidämme myös dynaamista, välimuistissa olevaa, jatkuvasti päivittyvää sallittujen listaa seuraavien tiukkojen kriteerien perusteella:

* Lähettäjän juuritunnuksen on oltava [verkkotunnuspääte, joka vastaa ilmaisen suunnitelmamme tarjoamaa listaa](#what-domain-name-extensions-can-be-used-for-free) (lisättynä `biz` ja `info`). Sisällytämme myös osittaiset vastaavuudet `edu`, `gov` ja `mil` kuten `xyz.gov.au` ja `xyz.edu.au`.
* Lähettäjän juuritunnuksen on oltava Umbrella Popularity Listin ([UPL](http://s3-us-west-1.amazonaws.com/umbrella-static/index.html "Umbrella Popularity List")) 100 000 suosituimman ainutlaatuisen juuritunnuksen joukossa.
* Lähettäjän juuritunnuksen on oltava UPL:n ainutlaatuisten juuritunnusten 50 000 parhaan joukossa, jotka esiintyvät vähintään 4 viimeisen 7 päivän aikana (~50 %+).
* Lähettäjän juuritunnusta ei saa olla Cloudflaren [luokiteltu](https://radar.cloudflare.com/categorization-feedback/) aikuisviihteeksi tai haittaohjelmaksi.
* Lähettäjän juuritunnuksella on oltava joko A- tai MX-tietueet asetettuna.
* Lähettäjän juuritunnuksella on oltava joko A-tietue(t), MX-tietue(t), DMARC-tietue, jossa on `p=reject` tai `p=quarantine`, tai SPF-tietue, jossa on `-all` tai `~all` -merkintä.

Jos nämä kriteerit täyttyvät, lähettäjän juuritunnus tallennetaan välimuistiin 7 päiväksi. Huomaa, että automaattinen tehtävämme suoritetaan päivittäin – tämä on siis jatkuvasti päivittyvä sallittujen listan välimuisti, joka päivittyy päivittäin.

Automaattinen tehtävämme lataa edelliset 7 päivää UPL-tiedostoja muistiin, purkaa ne ja jäsentää ne muistin sisällä yllä mainittujen tiukkojen kriteerien mukaisesti.

Suosittuja verkkotunnuksia tämän kirjoitushetken mukaan, kuten Google, Yahoo, Microsoft, Amazon, Meta, Twitter, Netflix, Spotify ja muita – sisältyvät tietenkin listalle.
Jos olet lähettäjä, joka ei ole sallittujen listallamme, ensimmäisellä kerralla, kun FQDN-juurialueesi tai IP-osoitteesi lähettää sähköpostin, sinulle asetetaan [nopeusrajoitus](#do-you-have-rate-limiting) ja sinut [harmaalistataan](#do-you-have-a-greylist). Huomaa, että tämä on sähköpostistandardiin otettu yleinen käytäntö. Useimmat sähköpostipalvelimet yrittävät uudelleen, jos ne saavat nopeusrajoitus- tai harmaalistavirheen (esim. 421- tai 4xx-tason virhekoodi).

**Huomaa, että tietyt lähettäjät kuten `a@gmail.com`, `b@xyz.edu` ja `c@gov.au` voidaan silti [estää](#do-you-have-a-denylist)** (esim. jos havaitsemme automaattisesti roskapostia, tietojenkalastelua tai haittaohjelmia näiltä lähettäjiltä).

### Mitä verkkotunnuksen päätteitä voi käyttää ilmaiseksi {#what-domain-name-extensions-can-be-used-for-free}

31. maaliskuuta 2023 alkaen otimme käyttöön uuden yleisen roskapostisäännön käyttäjiemme ja palvelumme suojaamiseksi.

Tämä uusi sääntö sallii seuraavien verkkotunnuksen päätteiden käytön vain ilmaisessa suunnitelmassamme:

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
  <li class="list-inline-item"><code class="notranslate">ax</code></li>
  <li class="list-inline-item"><code class="notranslate">ba</code></li>
  <li class="list-inline-item"><code class="notranslate">be</code></li>
  <li class="list-inline-item"><code class="notranslate">bg</code></li>
  <li class="list-inline-item"><code class="notranslate">br</code></li>
  <li class="list-inline-item"><code class="notranslate">by</code></li>
  <li class="list-inline-item"><code class="notranslate">bzh</code></li>
  <li class="list-inline-item"><code class="notranslate">ca</code></li>
  <li class="list-inline-item"><code class="notranslate">cat</code></li>
  <li class="list-inline-item"><code class="notranslate">cc</code></li>
  <li class="list-inline-item"><code class="notranslate">cd</code></li>
  <li class="list-inline-item"><code class="notranslate">ch</code></li>
  <li class="list-inline-item"><code class="notranslate">ck</code></li>
  <li class="list-inline-item"><code class="notranslate">co</code></li>
  <li class="list-inline-item"><code class="notranslate">com</code></li>
  <li class="list-inline-item"><code class="notranslate">de</code></li>
  <li class="list-inline-item"><code class="notranslate">dev</code></li>
  <li class="list-inline-item"><code class="notranslate">dj</code></li>
  <li class="list-inline-item"><code class="notranslate">dk</code></li>
  <li class="list-inline-item"><code class="notranslate">ee</code></li>
  <li class="list-inline-item"><code class="notranslate">es</code></li>
  <li class="list-inline-item"><code class="notranslate">eu</code></li>
  <li class="list-inline-item"><code class="notranslate">family</code></li>
  <li class="list-inline-item"><code class="notranslate">fi</code></li>
  <li class="list-inline-item"><code class="notranslate">fm</code></li>
  <li class="list-inline-item"><code class="notranslate">fo</code></li>
  <li class="list-inline-item"><code class="notranslate">fr</code></li>
  <li class="list-inline-item"><code class="notranslate">gf</code></li>
  <li class="list-inline-item"><code class="notranslate">gg</code></li>
  <li class="list-inline-item"><code class="notranslate">gi</code></li>
  <li class="list-inline-item"><code class="notranslate">gl</code></li>
  <li class="list-inline-item"><code class="notranslate">gp</code></li>
  <li class="list-inline-item"><code class="notranslate">gr</code></li>
  <li class="list-inline-item"><code class="notranslate">hr</code></li>
  <li class="list-inline-item"><code class="notranslate">hu</code></li>
  <li class="list-inline-item"><code class="notranslate">id</code></li>
  <li class="list-inline-item"><code class="notranslate">ie</code></li>
  <li class="list-inline-item"><code class="notranslate">il</code></li>
  <li class="list-inline-item"><code class="notranslate">im</code></li>
  <li class="list-inline-item"><code class="notranslate">in</code></li>
  <li class="list-inline-item"><code class="notranslate">io</code></li>
  <li class="list-inline-item"><code class="notranslate">ir</code></li>
  <li class="list-inline-item"><code class="notranslate">is</code></li>
  <li class="list-inline-item"><code class="notranslate">it</code></li>
  <li class="list-inline-item"><code class="notranslate">je</code></li>
  <li class="list-inline-item"><code class="notranslate">jp</code></li>
  <li class="list-inline-item"><code class="notranslate">ke</code></li>
  <li class="list-inline-item"><code class="notranslate">kr</code></li>
  <li class="list-inline-item"><code class="notranslate">la</code></li>
  <li class="list-inline-item"><code class="notranslate">li</code></li>
  <li class="list-inline-item"><code class="notranslate">lt</code></li>
  <li class="list-inline-item"><code class="notranslate">lu</code></li>
  <li class="list-inline-item"><code class="notranslate">lv</code></li>
  <li class="list-inline-item"><code class="notranslate">ly</code></li>
  <li class="list-inline-item"><code class="notranslate">mc</code></li>
  <li class="list-inline-item"><code class="notranslate">md</code></li>
  <li class="list-inline-item"><code class="notranslate">me</code></li>
  <li class="list-inline-item"><code class="notranslate">mk</code></li>
  <li class="list-inline-item"><code class="notranslate">mn</code></li>
  <li class="list-inline-item"><code class="notranslate">mq</code></li>
  <li class="list-inline-item"><code class="notranslate">ms</code></li>
  <li class="list-inline-item"><code class="notranslate">mt</code></li>
  <li class="list-inline-item"><code class="notranslate">mu</code></li>
  <li class="list-inline-item"><code class="notranslate">mx</code></li>
  <li class="list-inline-item"><code class="notranslate">nc</code></li>
  <li class="list-inline-item"><code class="notranslate">net</code></li>
  <li class="list-inline-item"><code class="notranslate">ni</code></li>
  <li class="list-inline-item"><code class="notranslate">nl</code></li>
  <li class="list-inline-item"><code class="notranslate">no</code></li>
  <li class="list-inline-item"><code class="notranslate">nu</code></li>
  <li class="list-inline-item"><code class="notranslate">nz</code></li>
  <li class="list-inline-item"><code class="notranslate">org</code></li>
  <li class="list-inline-item"><code class="notranslate">pf</code></li>
  <li class="list-inline-item"><code class="notranslate">pl</code></li>
  <li class="list-inline-item"><code class="notranslate">pm</code></li>
  <li class="list-inline-item"><code class="notranslate">pr</code></li>
  <li class="list-inline-item"><code class="notranslate">pt</code></li>
  <li class="list-inline-item"><code class="notranslate">pw</code></li>
  <li class="list-inline-item"><code class="notranslate">re</code></li>
  <li class="list-inline-item"><code class="notranslate">ro</code></li>
  <li class="list-inline-item"><code class="notranslate">rs</code></li>
  <li class="list-inline-item"><code class="notranslate">sc</code></li>
  <li class="list-inline-item"><code class="notranslate">se</code></li>
  <li class="list-inline-item"><code class="notranslate">sh</code></li>
  <li class="list-inline-item"><code class="notranslate">si</code></li>
  <li class="list-inline-item"><code class="notranslate">sk</code></li>
  <li class="list-inline-item"><code class="notranslate">sm</code></li>
  <li class="list-inline-item"><code class="notranslate">sr</code></li>
  <li class="list-inline-item"><code class="notranslate">st</code></li>
  <li class="list-inline-item"><code class="notranslate">tc</code></li>
  <li class="list-inline-item"><code class="notranslate">tf</code></li>
  <li class="list-inline-item"><code class="notranslate">tm</code></li>
  <li class="list-inline-item"><code class="notranslate">to</code></li>
  <li class="list-inline-item"><code class="notranslate">tv</code></li>
  <li class="list-inline-item"><code class="notranslate">uk</code></li>
  <li class="list-inline-item"><code class="notranslate">us</code></li>
  <li class="list-inline-item"><code class="notranslate">uz</code></li>
  <li class="list-inline-item"><code class="notranslate">va</code></li>
  <li class="list-inline-item"><code class="notranslate">vc</code></li>
  <li class="list-inline-item"><code class="notranslate">vg</code></li>
  <li class="list-inline-item"><code class="notranslate">vu</code></li>
  <li class="list-inline-item"><code class="notranslate">wf</code></li>
  <li class="list-inline-item"><code class="notranslate">ws</code></li>
  <li class="list-inline-item"><code class="notranslate">xyz</code></li>
  <li class="list-inline-item"><code class="notranslate">yt</code></li>
  <li class="list-inline-item"><code class="notranslate">za</code></li>
</ul>
### Onko teillä harmaalista {#do-you-have-a-greylist}

Kyllä, meillä on käytössä hyvin löysä [sähköpostin harmaalistaus](https://en.wikipedia.org/wiki/Greylisting_\(email\)) -käytäntö. Harmaalista koskee vain lähettäjiä, jotka eivät ole sallittujen listalla, ja se säilyy välimuistissamme 30 päivää.

Uuden lähettäjän kohdalla tallennamme Redis-tietokantaamme avaimen 30 päiväksi, jonka arvona on heidän ensimmäisen pyynnön saapumisaika. Hylkäämme heidän sähköpostinsa tilakoodilla 450 ja hyväksymme sen vasta, kun 5 minuuttia on kulunut.

Jos he ovat odottaneet onnistuneesti 5 minuuttia tästä alkuperäisestä saapumisajasta, heidän sähköpostinsa hyväksytään eikä heille lähetetä tätä 450-tilakoodia.

Avain koostuu joko FQDN-juuriverkkotunnuksesta tai lähettäjän IP-osoitteesta. Tämä tarkoittaa, että mikä tahansa aliverkkotunnus, joka läpäisee harmaalistan, läpäisee myös juuriverkkotunnuksen, ja päinvastoin (tätä tarkoitamme "hyvin löysällä" käytännöllä).

Esimerkiksi, jos sähköposti tulee osoitteesta `test.example.com` ennen kuin näemme sähköpostia osoitteesta `example.com`, niin kaikki sähköpostit osoitteista `test.example.com` ja/tai `example.com` joutuvat odottamaan 5 minuuttia yhteyden alkuperäisestä saapumisajasta. Emme pakota sekä `test.example.com` että `example.com` odottamaan kumpaakin omaa 5 minuutin jaksoaan (harmaalistakäytäntömme koskee juuriverkkotunnuksen tasoa).

Huomaa, että harmaalista ei koske ketään lähettäjää, joka on meidän [sallittujen listalla](#do-you-have-an-allowlist) (esim. Meta, Amazon, Netflix, Google, Microsoft tämän kirjoitushetken mukaan).

### Onko teillä estolista {#do-you-have-a-denylist}

Kyllä, ylläpidämme omaa estolistaa, jota päivitämme automaattisesti reaaliajassa ja manuaalisesti havaitun roskapostin ja haitallisen toiminnan perusteella.

Noudamme myös kaikki IP-osoitteet UCEPROTECT-tason 1 estolistalta osoitteesta <http://wget-mirrors.uceprotect.net/rbldnsd-all/dnsbl-1.uceprotect.net.gz> tunnin välein ja syötämme ne estolistallemme 7 päivän voimassaoloajalla.

Estolistalla olevat lähettäjät saavat 421-virhekoodin (joka kertoo lähettäjälle yrittää uudelleen myöhemmin), jos he [eivät ole sallittujen listalla](#do-you-have-an-allowlist).

Käyttämällä 421-tilakoodia 554:n sijaan mahdolliset väärät positiiviset voidaan lieventää reaaliajassa, ja viesti voidaan toimittaa onnistuneesti seuraavalla yrityksellä.

**Tämä on suunniteltu toisin kuin muissa sähköpostipalveluissa**, joissa estolistalle joutuminen aiheuttaa kovaa ja pysyvää virhettä. Lähettäjien pyytäminen yrittämään viestejä uudelleen (erityisesti suurilta organisaatioilta) on usein vaikeaa, joten tämä lähestymistapa antaa noin 5 päivää alkuperäisestä sähköpostiyrityksestä joko lähettäjän, vastaanottajan tai meidän puuttua asiaan (pyytämällä estolistalta poistamista).

Kaikki estolistalta poistopyynnöt valvotaan reaaliajassa ylläpitäjien toimesta (esim. jotta toistuvat väärät positiiviset voidaan pysyvästi sallia ylläpitäjien toimesta).

Estolistalta poistopyynnöt voi tehdä osoitteessa <https://forwardemail.net/denylist>. Maksullisten käyttäjien poistopyynnöt käsitellään välittömästi, kun taas maksuttomien käyttäjien on odotettava ylläpitäjien käsittelyä.

Lähettäjät, joiden havaitaan lähettävän roskapostia tai virusmateriaalia, lisätään estolistalle seuraavasti:

1. [Alkuperäinen viestin sormenjälki](#how-do-you-determine-an-email-fingerprint) harmaalistataan, kun roskaposti tai estolista havaitaan "luotetulta" lähettäjältä (esim. `gmail.com`, `microsoft.com`, `apple.com`).
   * Jos lähettäjä oli sallittujen listalla, viesti harmaalistataan tunniksi.
   * Jos lähettäjä ei ole sallittujen listalla, viesti harmaalistataan kuudeksi tunniksi.
2. Jäsennämme estolistan avaimet lähettäjän ja viestin tiedoista, ja jokaiselle näistä avaimista luomme (jos ei vielä ole olemassa) laskurin, kasvatamme sitä yhdellä ja välimuistimme sen 24 tunniksi.
   * Sallittujen lähettäjien osalta:
     * Lisää avain kirjekuoren "MAIL FROM" -sähköpostiosoitteelle, jos sillä oli läpäisevä SPF tai ei SPF:tä, eikä se ollut [postimestarin käyttäjänimi](#what-are-postmaster-addresses) tai [ei-vastaus-käyttäjänimi](#what-are-no-reply-addresses).
     * Jos "From"-otsikko oli sallittu, lisää avain "From"-otsikon sähköpostiosoitteelle, jos sillä oli läpäisevä SPF tai läpäisevä ja kohdistettu DKIM.
     * Jos "From"-otsikko ei ollut sallittu, lisää avain "From"-otsikon sähköpostiosoitteelle ja sen juuriverkkotunnukselle.
   * Ei-sallittujen lähettäjien osalta:
     * Lisää avain kirjekuoren "MAIL FROM" -sähköpostiosoitteelle, jos sillä oli läpäisevä SPF.
     * Jos "From"-otsikko oli sallittu, lisää avain "From"-otsikon sähköpostiosoitteelle, jos sillä oli läpäisevä SPF tai läpäisevä ja kohdistettu DKIM.
     * Jos "From"-otsikko ei ollut sallittu, lisää avain "From"-otsikon sähköpostiosoitteelle ja sen juuriverkkotunnukselle.
     * Lisää avain lähettäjän etä-IP-osoitteelle.
     * Lisää avain lähettäjän IP-osoitteen käänteisen haun perusteella saadulle isäntänimelle (jos on).
     * Lisää avain lähettäjän isäntänimen juuriverkkotunnukselle (jos on ja jos se eroaa isäntänimestä).
3. Jos laskuri saavuttaa arvon 5 ei-sallitetulle lähettäjälle ja avaimelle, estolistalle lisätään avain 30 päiväksi ja sähköposti lähetetään väärinkäytöstiimillemme. Nämä luvut voivat muuttua ja päivitykset näkyvät täällä valvontamme mukaan.
4. Jos laskuri saavuttaa arvon 10 sallittujen lähettäjälle ja avaimelle, estolistalle lisätään avain 7 päiväksi ja sähköposti lähetetään väärinkäytöstiimillemme. Nämä luvut voivat muuttua ja päivitykset näkyvät täällä valvontamme mukaan.
> **HUOM:** Lähitulevaisuudessa otamme käyttöön maineen seurannan. Maineen seuranta laskee sen sijaan, milloin lähettäjä tulee kieltolistalle prosenttiosuuden perusteella (toisin kuin yllä mainittu yksinkertainen laskuri).

### Onko teillä nopeusrajoituksia {#do-you-have-rate-limiting}

Lähettäjän nopeusrajoitus perustuu joko lähettäjän IP-osoitteen käänteisen PTR-haun perusteella saatavaan juuriverkkotunnukseen – tai jos sitä ei saada, käytetään yksinkertaisesti lähettäjän IP-osoitetta. Huomaa, että viittaamme tähän alla nimellä `Sender`.

MX-palvelimillamme on päivittäiset rajat saapuville sähköposteille, jotka vastaanotetaan [salattuun IMAP-tallennukseen](/blog/docs/best-quantum-safe-encrypted-email-service):

* Sen sijaan, että rajoittaisimme saapuvia sähköposteja yksittäisen aliaksen perusteella (esim. `you@yourdomain.com`), rajoitamme aliaksen verkkotunnuksen mukaan (esim. `yourdomain.com`). Tämä estää `Senders`-lähettäjiä tulvimasta kaikkien aliasten postilaatikoita yhdellä kertaa.
* Meillä on yleisiä rajoja, jotka koskevat kaikkia `Senders`-lähettäjiä palvelussamme riippumatta vastaanottajasta:
  * `Senders`, joita pidämme "luotettuina" totuuden lähteinä (esim. `gmail.com`, `microsoft.com`, `apple.com`), saavat lähettää enintään 100 GB päivässä.
  * [Sallittuihin listoihin](#do-you-have-an-allowlist) kuuluvat `Senders` saavat lähettää enintään 10 GB päivässä.
  * Kaikki muut `Senders` saavat lähettää enintään 1 GB ja/tai 1000 viestiä päivässä.
* Meillä on erityinen raja kullekin `Sender`-lähettäjälle ja `yourdomain.com`-verkkotunnukselle, joka on 1 GB ja/tai 1000 viestiä päivässä.

MX-palvelimet rajoittavat myös viestien edelleenlähetystä yhdelle tai useammalle vastaanottajalle nopeusrajoituksen avulla – mutta tämä koskee vain `Senders`-lähettäjiä, jotka eivät ole [sallitulla listalla](#do-you-have-an-allowlist):

* Sallitut ovat enintään 100 yhteyttä tunnissa per `Sender`-lähettäjän ratkaistu FQDN-juuriverkkotunnus (tai) `Sender`-lähettäjän etä-IP-osoite (jos käänteistä PTR:tä ei ole), ja per kuoren vastaanottaja. Tallennamme nopeusrajoituksen avaimen kryptografisena tiivisteenä Redis-tietokantaamme.

* Jos lähetät sähköpostia järjestelmämme kautta, varmista, että kaikilla IP-osoitteillasi on käänteinen PTR-tietue (muuten jokainen ainutlaatuinen FQDN-juuriverkkotunnus tai IP-osoite, josta lähetät, rajoitetaan).

* Huomaa, että jos lähetät suositun järjestelmän, kuten Amazon SES:n kautta, et joudu nopeusrajoituksen piiriin, koska (kirjoitushetkellä) Amazon SES on sallittujen listalla.

* Jos lähetät verkkotunnuksesta kuten `test.abc.123.example.com`, nopeusrajoitus kohdistuu `example.com`-verkkotunnukseen. Monet roskapostittajat käyttävät satoja aliverkkotunnuksia kiertääkseen yleisiä roskapostisuodattimia, jotka rajoittavat vain ainutlaatuisia isäntänimiä eivätkä ainutlaatuisia FQDN-juuriverkkotunnuksia.

* `Senders`, jotka ylittävät nopeusrajoituksen, hylätään 421-virheellä.

IMAP- ja SMTP-palvelimemme rajoittavat aliaksiasi enintään `60` samanaikaiseen yhteyteen kerrallaan.

MX-palvelimemme rajoittavat [ei-sallittuja](#do-you-have-an-allowlist) lähettäjiä muodostamasta yli 10 samanaikaista yhteyttä (laskurin välimuistin vanhenemisaika on 3 minuuttia, mikä vastaa socket-yhteyden aikakatkaisua 3 minuuttia).

### Kuinka suojaudutte backscatterilta {#how-do-you-protect-against-backscatter}

Väärin ohjatut palautteet tai palautesähköpostit (tunnetaan nimellä "[Backscatter](https://en.wikipedia.org/wiki/Backscatter_\(email\))") voivat aiheuttaa negatiivisen maineen lähettäjän IP-osoitteille.

Suojaudumme backscatterilta kahdella tavalla, jotka on kuvattu seuraavissa osioissa [Estä palautteet tunnetuilta MAIL FROM -roskapostittajilta](#prevent-bounces-from-known-mail-from-spammers) ja [Estä tarpeettomat palautteet suojautuaksesi backscatterilta](#prevent-unnecessary-bounces-to-protect-against-backscatter) alla.

### Estä palautteet tunnetuilta MAIL FROM -roskapostittajilta {#prevent-bounces-from-known-mail-from-spammers}

Haemme listan [Backscatter.org](https://www.backscatterer.org/) -sivustolta (jota ylläpitää [UCEPROTECT](https://www.uceprotect.net/)) osoitteesta <http://wget-mirrors.uceprotect.net/rbldnsd-all/ips.backscatterer.org.gz> tunnin välein ja syötämme sen Redis-tietokantaamme (vertaamme myös etukäteen eroja; jos IP-osoitteita on poistettu, ne huomioidaan).
Jos MAIL FROM on tyhjä TAI vastaa (kirjainkoolla ei ole merkitystä) mitä tahansa [postmaster-osoitteista](#what-are-postmaster-addresses) (sähköpostiosoitteen @-merkin edeltävä osa), tarkistamme, vastaako lähettäjän IP osoite jotakin tältä listalta.

Jos lähettäjän IP on listattu (eikä ole meidän [sallittujen listallamme](#do-you-have-an-allowlist)), lähetämme 554-virheen viestillä `The IP ${session.remoteAddress} is blocked by https://www.backscatterer.org/index.php?target=test&ip=${session.remoteAddress}`. Saamme hälytyksen, jos lähettäjä on sekä Backscatterer-listalla että sallittujen listalla, jotta voimme tarvittaessa ratkaista ongelman.

Tässä osiossa kuvatut tekniikat noudattavat "SAFE MODE" -suositusta osoitteessa <https://www.backscatterer.org/?target=usage> – jossa tarkistamme lähettäjän IP:n vain, jos tietyt ehdot on jo täytetty.

### Estä tarpeettomat palautukset suojautuaksesi backscatterilta {#prevent-unnecessary-bounces-to-protect-against-backscatter}

Palautukset ovat sähköposteja, jotka ilmoittavat sähköpostin edelleenlähetyksen epäonnistuneen kokonaan vastaanottajalle, eikä sähköpostia yritetä uudelleen.

Yleinen syy Backscatterer-listalle päätymiseen on väärin ohjatut palautukset tai palautusroskaposti, joten meidän on suojattava tätä muutamalla tavalla:

1. Lähetämme vain, kun tapahtuu >= 500-virhekoodin virheitä (kun edelleenlähetykset ovat epäonnistuneet, esim. Gmail vastaa 500-tason virheellä).

2. Lähetämme vain kerran ja vain yhden kerran (käytämme laskettua palautuksen sormenjälkeä ja tallennamme sen välimuistiin estääksemme kaksoislähetykset). Palautuksen sormenjälki on avain, joka muodostuu viestin sormenjäljestä yhdistettynä palautusosoitteen ja virhekoodin hajautukseen). Katso osio [Fingerprinting](#how-do-you-determine-an-email-fingerprint) saadaksesi lisätietoa viestin sormenjäljen laskemisesta. Onnistuneesti lähetetyt palautuksen sormenjäljet vanhenevat 7 päivän kuluttua Redis-välimuistissamme.

3. Lähetämme vain, kun MAIL FROM ja/tai From ei ole tyhjä eikä sisällä (kirjainkoolla ei ole merkitystä) [postmaster-käyttäjänimeä](#what-are-postmaster-addresses) (sähköpostiosoitteen @-merkin edeltävä osa).

4. Emme lähetä, jos alkuperäisessä viestissä oli jokin seuraavista otsikoista (kirjainkoolla ei ole merkitystä):

   * Otsikko `auto-submitted`, jonka arvo ei ole `no`.
   * Otsikko `x-auto-response-suppress`, jonka arvo on `dr`, `autoreply`, `auto-reply`, `auto_reply` tai `all`
   * Otsikko `list-id`, `list-subscribe`, `list-unsubscribe`, `list-help`, `list-post`, `list-owner`, `list-archive`, `x-autoreply`, `x-autorespond` tai `x-auto-respond` (arvosta riippumatta).
   * Otsikko `precedence`, jonka arvo on `bulk`, `autoreply`, `auto-reply`, `auto_reply` tai `list`.

5. Emme lähetä, jos MAIL FROM- tai From-sähköpostiosoite päättyy `+donotreply`, `-donotreply`, `+noreply` tai `-noreply`.

6. Emme lähetä, jos From-sähköpostiosoitteen käyttäjänimi oli `mdaemon` ja siinä oli kirjainkoolla erotteleva otsikko `X-MDDSN-Message`.

7. Emme lähetä, jos oli kirjainkoolla erotteleva `content-type`-otsikko `multipart/report`.

### Kuinka määritätte sähköpostin sormenjäljen {#how-do-you-determine-an-email-fingerprint}

Sähköpostin sormenjälkeä käytetään sähköpostin ainutlaatuisuuden määrittämiseen ja estämään kaksoisviestien toimitus sekä [kaksoispalautusten](#prevent-unnecessary-bounces-to-protect-against-backscatter) lähettäminen.

Sormenjälki lasketaan seuraavasta listasta:

* Asiakkaan ratkaistu FQDN-isäntänimi tai IP-osoite
* `Message-ID`-otsikon arvo (jos on)
* `Date`-otsikon arvo (jos on)
* `From`-otsikon arvo (jos on)
* `To`-otsikon arvo (jos on)
* `Cc`-otsikon arvo (jos on)
* `Subject`-otsikon arvo (jos on)
* `Body`-arvo (jos on)

### Voinko edelleenlähettää sähköposteja muille porteille kuin 25 (esim. jos ISP on estänyt portin 25) {#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25}

Kyllä, 5. toukokuuta 2020 alkaen olemme lisänneet tämän ominaisuuden. Tällä hetkellä ominaisuus on domain-kohtainen, ei alias-kohtainen. Jos tarvitset alias-kohtaisuutta, ota meihin yhteyttä ja kerro tarpeistasi.

<div class="alert my-3 alert-danger">
  <i class="fa fa-stop-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Parannettu tietosuoja:
  </strong>
  <span>
    Jos olet maksullisella tilauksella (joka sisältää parannetun tietosuojan), siirry osoitteeseen <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Oma tili <i class="fa fa-angle-right"></i> Domainit</a>, klikkaa "Aseta" domainisi vieressä ja sitten "Asetukset". Jos haluat lisätietoja maksullisista tilauksista, katso <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Hinnoittelu</a>-sivumme. Muussa tapauksessa voit jatkaa alla olevien ohjeiden seuraamista.
  </span>
</div>
Jos olet ilmaisella suunnitelmalla, lisää vain uusi DNS <strong class="notranslate">TXT</strong> -tietue alla kuvatulla tavalla, mutta vaihda portti 25:stä haluamaasi porttiin.

Esimerkiksi, jos haluan, että kaikki `example.com`-osoitteeseen menevät sähköpostit välitetään alias-vastaanottajien SMTP-porttiin 1337 portin 25 sijaan:

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
    Yleisin tilanne mukautetun porttiohjauksen asetuksissa on, kun haluat välittää kaikki example.com-osoitteeseen menevät sähköpostit eri porttiin example.com:ssa kuin SMTP:n standardi portti 25. Tämän asettamiseksi lisää vain seuraava <strong class="notranslate">TXT</strong> catch-all -tietue.
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

### Tukeeko se plus + -merkkiä Gmail-aliasissa {#does-it-support-the-plus--symbol-for-gmail-aliases}

Kyllä, ehdottomasti.

### Tukeeko se aliverkkotunnuksia {#does-it-support-sub-domains}

Kyllä, ehdottomasti. Sen sijaan, että käyttäisit "@", ".", tai tyhjää nimen/isännän/aliasin kohdalla, käytät vain aliverkkotunnuksen nimeä arvona.

Jos haluat, että `foo.example.com` välittää sähköpostit, syötä `foo` nimen/isännän/aliasin arvoksi DNS-asetuksissasi (sekä MX- että <strong class="notranslate">TXT</strong> -tietueissa).

### Välittääkö tämä sähköpostini otsikot {#does-this-forward-my-emails-headers}

Kyllä, ehdottomasti.

### Onko tämä hyvin testattu {#is-this-well-tested}

Kyllä, siihen on kirjoitettu testejä [ava](https://github.com/avajs/ava) -kirjastolla ja sillä on myös koodikattavuus.

### Välitättekö SMTP-vastausviestit ja -koodit {#do-you-pass-along-smtp-response-messages-and-codes}

Kyllä, ehdottomasti. Esimerkiksi jos lähetät sähköpostia osoitteeseen `hello@example.com` ja se on rekisteröity välitettäväksi osoitteeseen `user@gmail.com`, niin SMTP-vastausviesti ja -koodi "gmail.com" SMTP-palvelimelta palautetaan sen sijaan, että ne tulisivat välityspalvelimelta "mx1.forwardemail.net" tai "mx2.forwardemail.net".

### Miten estätte roskapostittajat ja varmistatte hyvän sähköpostin välityksen maineen {#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation}

Katso yllä olevat osiot [Miten sähköpostin välitysjärjestelmänne toimii](#how-does-your-email-forwarding-system-work), [Miten käsittelette sähköpostin toimitusongelmia](#how-do-you-handle-email-delivery-issues) ja [Miten käsittelette IP-osoitteiden estämisen](#how-do-you-handle-your-ip-addresses-becoming-blocked).

### Miten suoritatte DNS-kyselyt verkkotunnuksille {#how-do-you-perform-dns-lookups-on-domain-names}

Loimme avoimen lähdekoodin ohjelmistoprojektin :tangerine: [Tangerine](https://github.com/forwardemail/tangerine) ja käytämme sitä DNS-kyselyihin. Oletuksena käytettävät DNS-palvelimet ovat `1.1.1.1` ja `1.0.0.1`, ja DNS-kyselyt tehdään [DNS over HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") -protokollalla sovelluskerroksessa.

:tangerine: [Tangerine](https://github.com/tangerine) käyttää oletuksena [CloudFlaren yksityisyyttä korostavaa kuluttajille suunnattua DNS-palvelua][cloudflare-dns].


## Tili ja laskutus {#account-and-billing}

### Tarjoatteko rahat takaisin -takuun maksullisissa suunnitelmissa {#do-you-offer-a-money-back-guarantee-on-paid-plans}

Kyllä! Automaattiset hyvitykset tapahtuvat, kun päivität, alennat tai peruutat tilisi 30 päivän kuluessa siitä, kun suunnitelmasi alkoi. Tämä koskee vain ensikertaisia asiakkaita.
### Jos vaihdan suunnitelmaa, hinnoitteletteko suhteellisesti ja hyvitättekö erotuksen {#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference}

Emme hinnoittele suhteellisesti emmekä hyvitä erotusta, kun vaihdat suunnitelmaa. Sen sijaan muutamme jäljellä olevan keston nykyisen suunnitelmasi päättymispäivästä lähimpään suhteelliseen kestoon uudelle suunnitelmallesi (pyöristetty alaspäin kuukauden tarkkuudella).

Huomaa, että jos päivität tai alennat maksullisten suunnitelmien välillä 30 päivän sisällä maksullisen suunnitelman aloittamisesta, hyvitetään automaattisesti koko nykyisen suunnitelman summa.

### Voinko käyttää tätä sähköpostin edelleenlähetyspalvelua vain "varapalvelimena" tai "varavaihtoehtona" MX-palvelimena {#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server}

Ei, sitä ei suositella, koska voit käyttää vain yhtä sähköpostinvaihtopalvelinta kerrallaan. Varavaihtoehtoja ei yleensä yritetä uudelleen prioriteettivirheiden ja sähköpostipalvelimien MX-prioriteetin tarkistuksen noudattamatta jättämisen vuoksi.

### Voinko poistaa käytöstä tiettyjä aliaksia {#can-i-disable-specific-aliases}

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tärkeää:
  </strong>
  <span>
    Jos olet maksullisella suunnitelmalla, sinun tulee mennä <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Oma tili <i class="fa fa-angle-right"></i> Domainit</a> <i class="fa fa-angle-right"></i> Aliakset <i class="fa fa-angle-right"></i> Muokkaa aliasta <i class="fa fa-angle-right"></i> Poista valinta "Aktiivinen" -valintaruudusta <i class="fa fa-angle-right"></i> Jatka.
  </span>
</div>

Kyllä, muokkaa vain DNS-<strong class="notranslate">TXT</strong>-tietuetta ja lisää aliaksen eteen yksi, kaksi tai kolme huutomerkkiä (katso alla).

Huomaa, että sinun *tulisi* säilyttää ":"-merkintä, koska se on tarpeen, jos päätät joskus ottaa tämän pois käytöstä (ja sitä käytetään myös tuonnissa, jos päivität johonkin maksullisista suunnitelmistamme).

**Hiljainen hylkäys (lähettäjälle näyttää siltä, että viesti lähetettiin onnistuneesti, mutta viesti ei mene minnekään) (tilakoodi `250`):** Jos lisäät aliaksen eteen "!" (yksi huutomerkki), se palauttaa lähettäjälle onnistuneen tilakoodin `250`, mutta sähköpostit eivät mene minnekään (esim. mustaan aukkoon tai `/dev/null`).

**Pehmeä hylkäys (tilakoodi `421`):** Jos lisäät aliaksen eteen "!!" (kaksi huutomerkkiä), se palauttaa lähettäjälle pehmeän virhetilakoodin `421`, ja sähköposteja yritetään usein uudelleen jopa 5 päivän ajan ennen hylkäystä ja palautusta.

**Kova hylkäys (tilakoodi `550`):** Jos lisäät aliaksen eteen "!!!" (kolme huutomerkkiä), se palauttaa lähettäjälle pysyvän virhetilakoodin `550` ja sähköpostit hylätään ja palautetaan.

Esimerkiksi, jos haluan, että kaikki sähköpostit, jotka menevät osoitteeseen `alias@example.com`, lakkaavat kulkemasta osoitteeseen `user@gmail.com` ja hylätään ja palautetaan (esim. käytä kolmea huutomerkkiä):

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
    Voit myös kirjoittaa edelleenlähetettävän vastaanottajan osoitteen uudelleen yksinkertaisesti "nobody@forwardemail.net", jolloin se ohjautuu kenellekään alla olevan esimerkin mukaisesti.
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
    Jos haluat lisää turvallisuutta, voit myös poistaa osan ":user@gmail.com" (tai ":nobody@forwardemail.net"), jolloin jäljelle jää vain "!!!alias" kuten alla olevassa esimerkissä.
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

### Voinko edelleenlähettää sähköposteja useille vastaanottajille {#can-i-forward-emails-to-multiple-recipients}

Kyllä, ehdottomasti. Määritä vain useita vastaanottajia <strong class="notranslate">TXT</strong>-tietueissasi.

Esimerkiksi, jos haluan, että sähköposti, joka menee osoitteeseen `hello@example.com`, edelleenlähetetään osoitteisiin `user+a@gmail.com` ja `user+b@gmail.com`, <strong class="notranslate">TXT</strong>-tietueeni näyttäisi tältä:

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

Tai voit määrittää ne kahdella erillisellä rivillä, kuten tässä:

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

Se on sinun päätettävissäsi!

### Voinko määrittää useita globaaleja catch-all-vastaanottajia {#can-i-have-multiple-global-catch-all-recipients}

Kyllä, voit. Määritä vain useita globaaleja catch-all-vastaanottajia <strong class="notranslate">TXT</strong>-tietueissasi.

Esimerkiksi, jos haluan, että jokainen sähköposti, joka menee osoitteeseen `*@example.com` (tähti tarkoittaa jokerimerkkiä eli catch-all), edelleenlähetetään osoitteisiin `user+a@gmail.com` ja `user+b@gmail.com`, <strong class="notranslate">TXT</strong>-tietueeni näyttäisi tältä:

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

Tai voit määrittää ne kahdella erillisellä rivillä, kuten tässä:

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
Se on sinun päätettävissäsi!

### Onko alias-kohtaiselle edelleenlähetettävien sähköpostiosoitteiden määrälle enimmäisrajaa {#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias}

Kyllä, oletusraja on 10. Tämä EI tarkoita, että voit käyttää vain 10 aliasia verkkotunnuksellasi. Voit käyttää niin monta aliasia kuin haluat (rajoittamaton määrä). Se tarkoittaa, että voit edelleenlähettää yhden aliasin vain 10 ainutlaatuiseen sähköpostiosoitteeseen. Voisit esimerkiksi käyttää `hello:user+1@gmail.com`, `hello:user+2@gmail.com`, `hello:user+3@gmail.com`, … (1-10) – ja kaikki sähköpostit osoitteeseen `hello@example.com` edelleenlähetettäisiin osoitteisiin `user+1@gmail.com`, `user+2@gmail.com`, `user+3@gmail.com`, … (1-10).

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Vinkki:
  </strong>
  <span>
    Tarvitsetko yli 10 vastaanottajaa aliasia kohden? Lähetä meille sähköpostia, niin voimme mielellämme nostaa tilisi rajaa.
  </span>
</div>

### Voinko edelleenlähettää sähköposteja rekursiivisesti {#can-i-recursively-forward-emails}

Kyllä, voit, mutta sinun on silti noudatettava enimmäisrajaa. Jos sinulla on `hello:linus@example.com` ja `linus:user@gmail.com`, niin sähköpostit osoitteeseen `hello@example.com` edelleenlähetetään osoitteisiin `linus@example.com` ja `user@gmail.com`. Huomaa, että virhe tapahtuu, jos yrität edelleenlähettää sähköposteja rekursiivisesti yli enimmäisrajan.

### Voivatko ihmiset rekisteröidä tai poistaa sähköpostin edelleenlähetyksen ilman lupaasi {#can-people-unregister-or-register-my-email-forwarding-without-my-permission}

Käytämme MX- ja <strong class="notranslate">TXT</strong>-tietueiden vahvistusta, joten jos lisäät tämän palvelun vastaavat MX- ja <strong class="notranslate">TXT</strong>-tietueet, olet rekisteröitynyt. Jos poistat ne, olet poistunut rekisteristä. Omistat verkkotunnuksesi ja DNS-hallinnan, joten jos joku pääsee niihin käsiksi, se on ongelma.

### Miten tämä on ilmaista {#how-is-it-free}

Forward Email tarjoaa ilmaisen tason yhdistämällä avoimen lähdekoodin kehityksen, tehokkaan infrastruktuurin ja valinnaiset maksulliset suunnitelmat, jotka tukevat palvelua.

Ilmainen tasomme tukee:

1. **Avoimen lähdekoodin kehitys**: Koodipohjamme on avoin, mikä mahdollistaa yhteisön panokset ja läpinäkyvän toiminnan.

2. **Tehokas infrastruktuuri**: Olemme optimoineet järjestelmämme käsittelemään sähköpostin edelleenlähetystä mahdollisimman vähäisillä resursseilla.

3. **Maksulliset premium-suunnitelmat**: Käyttäjät, jotka tarvitsevat lisäominaisuuksia kuten SMTP-lähetyksen, IMAP-vastaanoton tai parannetut yksityisyysasetukset, tilaavat maksulliset suunnitelmamme.

4. **Kohtuulliset käyttörajat**: Ilmaisella tasolla on reilut käyttöpolitiikat väärinkäytösten estämiseksi.

> \[!NOTE]
> Olemme sitoutuneet pitämään perussähköpostin edelleenlähetyksen ilmaisena samalla kun tarjoamme premium-ominaisuuksia käyttäjille, joilla on edistyneempiä tarpeita.

> \[!TIP]
> Jos pidät palveluamme arvokkaana, harkitse maksulliseen suunnitelmaan siirtymistä tukemaan jatkuvaa kehitystä ja ylläpitoa.

### Mikä on suurin sallittu sähköpostin koko {#what-is-the-max-email-size-limit}

Oletuksena sallimme 50 Mt kokoisen viestin, joka sisältää sisällön, otsikot ja liitteet. Huomaa, että palvelut kuten Gmail ja Outlook sallivat vain 25 Mt kokoisen viestin, ja jos ylität tämän rajan lähetettäessä näiden palveluntarjoajien osoitteisiin, saat virheilmoituksen.

Virhe palautetaan oikealla vastauskoodilla, jos tiedostokokoraja ylittyy.

### Tallennatteko sähköpostilokeja {#do-you-store-logs-of-emails}

Emme kirjoita levyille emmekä tallenna lokeja – [virheiden poikkeuksella](#do-you-store-error-logs) ja [lähtö-SMTP:llä](#do-you-support-sending-email-with-smtp) (katso [Tietosuojakäytäntömme](/privacy)).

Kaikki tapahtuu muistissa ja [lähdekoodimme on GitHubissa](https://github.com/forwardemail).

### Tallennatteko virhelokeja {#do-you-store-error-logs}

**Kyllä. Voit tarkastella virhelokeja kohdassa [Oma tili → Lokit](/my-account/logs) tai [Oma tili → Verkkotunnukset](/my-account/domains).**

Helmikuusta 2023 alkaen tallennamme virhelokit `4xx` ja `5xx` SMTP-vastauskoodeille 7 päivän ajaksi – jotka sisältävät SMTP-virheen, kirjekuoren ja sähköpostin otsikot (emme **tallenna** sähköpostin sisältöä emmekä liitteitä).
Virhelokit antavat sinulle mahdollisuuden tarkistaa puuttuvat tärkeät sähköpostit ja lieventää roskapostin väärien positiivisten tunnistusten vaikutuksia [sinun domaineillasi](/my-account/domains). Ne ovat myös erinomainen resurssi [sähköpostin webhookien](#do-you-support-webhooks) ongelmien vianmääritykseen (koska virhelokit sisältävät webhook-päätepisteen vastauksen).

Virhelokit [nopeusrajoituksille](#do-you-have-rate-limiting) ja [harmaalistaukselle](#do-you-have-a-greylist) eivät ole saatavilla, koska yhteys päättyy aikaisin (esim. ennen `RCPT TO` ja `MAIL FROM` -komentojen lähettämistä).

Katso lisätietoja [Tietosuojakäytännöstämme](/privacy).

### Luetko sähköpostejani {#do-you-read-my-emails}

Ei, ehdottomasti ei. Katso [Tietosuojakäytäntömme](/privacy).

Monet muut sähköpostin edelleenlähetyspalvelut tallentavat ja voisivat mahdollisesti lukea sähköpostisi. Ei ole mitään syytä, miksi edelleenlähetettyjä sähköposteja pitäisi tallentaa levylle – ja siksi suunnittelimme ensimmäisen avoimen lähdekoodin ratkaisun, joka käsittelee kaiken muistissa.

Uskomme, että sinulla on oikeus yksityisyyteen ja kunnioitamme sitä tiukasti. Palvelimelle asennettu koodi on [avoimen lähdekoodin ohjelmisto GitHubissa](https://github.com/forwardemail) läpinäkyvyyden ja luottamuksen rakentamiseksi.

### Voinko lähettää sähköpostia Gmailissa tämän avulla "lähettäen sähköpostia" {#can-i-send-mail-as-in-gmail-with-this}

Kyllä! 2. lokakuuta 2018 alkaen olemme lisänneet tämän ominaisuuden. Katso yllä oleva [Ohje: Kuinka lähettää sähköpostia Gmaililla] (#how-to-send-mail-as-using-gmail)!

Sinun tulisi myös asettaa SPF-tietue Gmailille DNS-konfiguraatiossasi <strong class="notranslate">TXT</strong>-tietueeseen.

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tärkeää:
  </strong>
  <span>
    Jos käytät Gmailia (esim. Lähetä sähköpostia nimellä) tai G Suitea, sinun tulee lisätä <code>include:_spf.google.com</code> SPF-<strong class="notranslate">TXT</strong>-tietueeseesi, esimerkiksi:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
  </span>
</div>

### Voinko lähettää sähköpostia Outlookissa tämän avulla "lähettäen sähköpostia" {#can-i-send-mail-as-in-outlook-with-this}

Kyllä! 2. lokakuuta 2018 alkaen olemme lisänneet tämän ominaisuuden. Katso alla Microsoftin kaksi linkkiä:

* <https://support.office.com/en-us/article/add-or-remove-an-email-alias-in-outlook-com-459b1989-356d-40fa-a689-8f285b13f1f2>
* <https://support.office.com/en-us/article/send-email-from-a-different-address-in-outlook-com-ccba89cb-141c-4a36-8c56-6d16a8556d2e>

Sinun tulisi myös asettaa SPF-tietue Outlookille DNS-konfiguraatiossasi <strong class="notranslate">TXT</strong>-tietueeseen.

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tärkeää:
  </strong>
  <span>
    Jos käytät Microsoft Outlookia tai Live.comia, sinun tulee lisätä <code>include:spf.protection.outlook.com</code> SPF-<strong class="notranslate">TXT</strong>-tietueeseesi, esimerkiksi:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:spf.protection.outlook.com -all</code>
  </span>
</div>

### Voinko lähettää sähköpostia Apple Mailissa ja iCloud Mailissa tämän avulla "lähettäen sähköpostia" {#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this}

Jos olet iCloud+-tilaaja, voit käyttää omaa domainia. [Palvelumme on myös yhteensopiva Apple Mailin kanssa](#apple-mail).

Katso lisätietoja osoitteesta <https://support.apple.com/en-us/102540>.

### Voinko edelleenlähettää rajattomasti sähköposteja tämän avulla {#can-i-forward-unlimited-emails-with-this}

Kyllä, mutta "suhteellisen tuntemattomat" lähettäjät rajoitetaan 100 yhteyteen tunnissa per isäntänimi tai IP-osoite. Katso yllä olevat kohdat [Nopeusrajoituksista](#do-you-have-rate-limiting) ja [Harmaalistauksesta](#do-you-have-a-greylist).

"Suhteellisen tuntemattomilla" tarkoitetaan lähettäjiä, jotka eivät ole [sallittujen listalla](#do-you-have-an-allowlist).

Jos tämä raja ylittyy, lähetämme 421-vastauskoodin, joka kertoo lähettäjän sähköpostipalvelimelle yrittää uudelleen myöhemmin.

### Tarjoatteko rajattomasti domaineja yhdellä hinnalla {#do-you-offer-unlimited-domains-for-one-price}

Kyllä. Riippumatta siitä, millä suunnitelmalla olet, maksat vain yhden kuukausimaksun – joka kattaa kaikki domainisi.
### Mitä maksutapoja hyväksytte {#which-payment-methods-do-you-accept}

Forward Email hyväksyy seuraavat kertaluonteiset tai kuukausi-/neljännesvuosi-/vuosimaksutavat:

1. **Luotto-/pankkikortit/pankkisiirrot**: Visa, Mastercard, American Express, Discover, JCB, Diners Club jne.
2. **PayPal**: Yhdistä PayPal-tilisi helppoja maksuja varten
3. **Kryptovaluutta**: Hyväksymme maksuja Stripe:n stablecoin-maksuilla Ethereum-, Polygon- ja Solana-verkoissa

> \[!NOTE]
> Tallennamme palvelimillemme rajoitetusti maksutietoja, jotka sisältävät vain maksutunnisteet ja viitteet [Stripe](https://stripe.com/global) ja [PayPal](https://www.paypal.com) -tapahtuma-, asiakas-, tilaus- ja maksu-ID:ihin.

> \[!TIP]
> Maksimaalisen yksityisyyden saavuttamiseksi harkitse kryptovaluuttamaksujen käyttöä.

Kaikki maksut käsitellään turvallisesti Stripe:n tai PayPalin kautta. Maksutietojasi ei koskaan tallenneta palvelimillemme.


## Lisäresurssit {#additional-resources}

> \[!TIP]
> Alla olevat artikkelimme päivitetään säännöllisesti uusilla oppailla, vinkeillä ja teknisillä tiedoilla. Tarkista usein uusin sisältö.

* [Tapaustutkimukset & Kehittäjädokumentaatio](/blog/docs)
* [Resurssit](/resources)
* [Oppaat](/guides)

[gmail-2fa]: https://myaccount.google.com/signinoptions/two-step-verification

[cloudflare-dns]: https://blog.cloudflare.com/announcing-1111/
