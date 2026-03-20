# Gyakran Ismételt Kérdések {#frequently-asked-questions}

<img loading="lazy" src="/img/articles/faq.webp" alt="Forward Email gyakran ismételt kérdések" class="rounded-lg" />


## Tartalomjegyzék {#table-of-contents}

* [Gyors Kezdés](#quick-start)
* [Bevezetés](#introduction)
  * [Mi az a Forward Email](#what-is-forward-email)
  * [Ki használja a Forward Emailt](#who-uses-forward-email)
  * [Mi a Forward Email története](#what-is-forward-emails-history)
  * [Milyen gyors ez a szolgáltatás](#how-fast-is-this-service)
* [Email Kliensek](#email-clients)
  * [Thunderbird](#thunderbird)
  * [Microsoft Outlook](#microsoft-outlook)
  * [Apple Mail](#apple-mail)
  * [eM Client](#em-client)
  * [Mobil Eszközök](#mobile-devices)
  * [Sendmail SMTP Relay Beállítás](#sendmail-smtp-relay-configuration)
  * [Exim4 SMTP Relay Beállítás](#exim4-smtp-relay-configuration)
  * [msmtp SMTP Ügyfél Beállítás](#msmtp-smtp-client-configuration)
  * [Parancssoros Email Kliensek](#command-line-email-clients)
  * [Windows Email Beállítás](#windows-email-configuration)
  * [Postfix SMTP Relay Beállítás](#postfix-smtp-relay-configuration)
  * [Hogyan küldjek levelet Gmail használatával](#how-to-send-mail-as-using-gmail)
  * [Mi a régi ingyenes útmutató a Gmail használatával történő levélküldéshez](#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail)
  * [Fejlett Gmail irányítási beállítások](#advanced-gmail-routing-configuration)
  * [Fejlett Outlook irányítási beállítások](#advanced-outlook-routing-configuration)
* [Hibaelhárítás](#troubleshooting)
  * [Miért nem kapom meg a teszt emailjeimet](#why-am-i-not-receiving-my-test-emails)
  * [Hogyan állítsam be az email kliensemet a Forward Email használatához](#how-do-i-configure-my-email-client-to-work-with-forward-email)
  * [Miért kerülnek az emailjeim a Spam és Levélszemét mappába, és hogyan ellenőrizhetem a domain hírnevemet](#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation)
  * [Mit tegyek, ha spam emailt kapok](#what-should-i-do-if-i-receive-spam-emails)
  * [Miért jelennek meg a Gmailben magamnak küldött teszt emailjeim "gyanús" jelzéssel](#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious)
  * [Eltávolíthatom a via forwardemail dot net-et Gmailben](#can-i-remove-the-via-forwardemail-dot-net-in-gmail)
* [Adatkezelés](#data-management)
  * [Hol találhatók a szervereitek](#where-are-your-servers-located)
  * [Hogyan exportálhatom és készíthetek biztonsági mentést a postaládámról](#how-do-i-export-and-backup-my-mailbox)
  * [Hogyan importálhatom és migrálhatom a meglévő postaládámat](#how-do-i-import-and-migrate-my-existing-mailbox)
  * [Hogyan használhatom saját S3-kompatibilis tárhelyemet biztonsági mentésekhez](#how-do-i-use-my-own-s3-compatible-storage-for-backups)
  * [Hogyan konvertálhatom az SQLite biztonsági mentéseket EML fájlokká](#how-do-i-convert-sqlite-backups-to-eml-files)
  * [Támogatjátok az önálló üzemeltetést](#do-you-support-self-hosting)
* [Email Beállítások](#email-configuration)
  * [Hogyan kezdjem el és állítsam be az email továbbítást](#how-do-i-get-started-and-set-up-email-forwarding)
  * [Használhatok több MX cserélőt és szervert fejlett továbbításhoz](#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding)
  * [Hogyan állítsak be szabadságválaszt (irodán kívüli automatikus válaszadó)](#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder)
  * [Hogyan állítsam be az SPF-et a Forward Emailhez](#how-do-i-set-up-spf-for-forward-email)
  * [Hogyan állítsam be a DKIM-et a Forward Emailhez](#how-do-i-set-up-dkim-for-forward-email)
  * [Hogyan állítsam be a DMARC-ot a Forward Emailhez](#how-do-i-set-up-dmarc-for-forward-email)
  * [Hogyan tekinthetem meg a DMARC jelentéseket](#how-do-i-view-dmarc-reports)
  * [Hogyan csatlakoztassam és állítsam be a kapcsolataimat](#how-do-i-connect-and-configure-my-contacts)
  * [Hogyan csatlakoztassam és állítsam be a naptáraimat](#how-do-i-connect-and-configure-my-calendars)
  * [Hogyan adjak hozzá több naptárt és kezeljem a meglévőket](#how-do-i-add-more-calendars-and-manage-existing-calendars)
  * [Hogyan csatlakoztassam és állítsam be a feladatokat és emlékeztetőket](#how-do-i-connect-and-configure-tasks-and-reminders)
  * [Miért nem tudok feladatokat létrehozni a macOS Emlékeztetőkben](#why-cant-i-create-tasks-in-macos-reminders)
  * [Hogyan állítsam be a Tasks.org-ot Androidon](#how-do-i-set-up-tasksorg-on-android)
  * [Hogyan állítsam be az SRS-t a Forward Emailhez](#how-do-i-set-up-srs-for-forward-email)
  * [Hogyan állítsam be az MTA-STS-t a Forward Emailhez](#how-do-i-set-up-mta-sts-for-forward-email)
  * [Hogyan adjak profilképet az email címemhez](#how-do-i-add-a-profile-picture-to-my-email-address)
* [Fejlett Funkciók](#advanced-features)
  * [Támogatjátok a hírleveleket vagy marketing célú levelezőlistákat](#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email)
  * [Támogatjátok az API-n keresztüli email küldést](#do-you-support-sending-email-with-api)
  * [Támogatjátok az IMAP-on keresztüli email fogadást](#do-you-support-receiving-email-with-imap)
  * [Támogatjátok a POP3-at](#do-you-support-pop3)
  * [Támogatjátok a naptárakat (CalDAV)](#do-you-support-calendars-caldav)
  * [Támogatjátok a feladatokat és emlékeztetőket (CalDAV VTODO)](#do-you-support-tasks-and-reminders-caldav-vtodo)
  * [Támogatjátok a kapcsolatokat (CardDAV)](#do-you-support-contacts-carddav)
  * [Támogatjátok az SMTP-n keresztüli email küldést](#do-you-support-sending-email-with-smtp)
  * [Támogatjátok az OpenPGP/MIME-t, a végpontok közötti titkosítást ("E2EE") és a Web Key Directory-t ("WKD")](#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd)
  * [Támogatjátok az S/MIME titkosítást](#do-you-support-smime-encryption)
  * [Támogatjátok a Sieve email szűrést](#do-you-support-sieve-email-filtering)
  * [Támogatjátok az MTA-STS-t](#do-you-support-mta-sts)
  * [Támogatjátok a passkey-ket és a WebAuthn-t](#do-you-support-passkeys-and-webauthn)
  * [Támogatjátok az email legjobb gyakorlatait](#do-you-support-email-best-practices)
  * [Támogatjátok a visszapattanási webhookokat](#do-you-support-bounce-webhooks)
  * [Támogatjátok a webhookokat](#do-you-support-webhooks)
  * [Támogatjátok a reguláris kifejezéseket vagy regex-et](#do-you-support-regular-expressions-or-regex)
  * [Mik az SMTP kimenő korlátaitok](#what-are-your-outbound-smtp-limits)
  * [Szükséges engedély az SMTP engedélyezéséhez](#do-i-need-approval-to-enable-smtp)
  * [Mik az SMTP szerver beállításai](#what-are-your-smtp-server-configuration-settings)
  * [Mik az IMAP szerver beállításai](#what-are-your-imap-server-configuration-settings)
  * [Mik a POP3 szerver beállításai](#what-are-your-pop3-server-configuration-settings)
  * [Hogyan állítsam be az email automatikus felismerést a domainemhez](#how-do-i-set-up-email-autodiscovery-for-my-domain)
* [Biztonság](#security-1)
  * [Fejlett szerver megerősítési technikák](#advanced-server-hardening-techniques)
  * [Van SOC 2 vagy ISO 27001 tanúsítványotok](#do-you-have-soc-2-or-iso-27001-certifications)
  * [Használtok TLS titkosítást az email továbbításhoz](#do-you-use-tls-encryption-for-email-forwarding)
  * [Megőrzitek az email hitelesítési fejlécet](#do-you-preserve-email-authentication-headers)
  * [Megőrzitek az eredeti email fejlécet és megakadályozzátok a hamisítást](#do-you-preserve-original-email-headers-and-prevent-spoofing)
  * [Hogyan védekeztek a spam és visszaélések ellen](#how-do-you-protect-against-spam-and-abuse)
  * [Tároltok email tartalmat lemezen](#do-you-store-email-content-on-disk)
  * [Kiszivároghat az email tartalom rendszerösszeomlás esetén](#can-email-content-be-exposed-during-system-crashes)
  * [Kik férnek hozzá az email infrastruktúrátokhoz](#who-has-access-to-your-email-infrastructure)
  * [Milyen infrastruktúra szolgáltatókat használtok](#what-infrastructure-providers-do-you-use)
  * [Kínáltok adatfeldolgozási megállapodást (DPA)](#do-you-offer-a-data-processing-agreement-dpa)
  * [Hogyan kezelitek az adatvédelmi incidens értesítéseket](#how-do-you-handle-data-breach-notifications)
  * [Kínáltok teszt környezetet](#do-you-offer-a-test-environment)
  * [Biztosítotok monitorozó és riasztó eszközöket](#do-you-provide-monitoring-and-alerting-tools)
  * [Hogyan biztosítjátok a magas rendelkezésre állást](#how-do-you-ensure-high-availability)
  * [Megfeleltek a Nemzeti Védelmi Engedélyezési Törvény (NDAA) 889. szakaszának](#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa)
* [Rendszer és Technikai Részletek](#system-and-technical-details)
  * [Tároltok email-eket és azok tartalmát](#do-you-store-emails-and-their-contents)
  * [Hogyan működik az email továbbító rendszeretek](#how-does-your-email-forwarding-system-work)
  * [Hogyan dolgoztok fel egy emailt továbbításra](#how-do-you-process-an-email-for-forwarding)
  * [Hogyan kezelitek az email kézbesítési problémákat](#how-do-you-handle-email-delivery-issues)
  * [Hogyan kezelitek, ha az IP címeitek blokkolva lesznek](#how-do-you-handle-your-ip-addresses-becoming-blocked)
  * [Mik a postmaster címek](#what-are-postmaster-addresses)
  * [Mik a no-reply címek](#what-are-no-reply-addresses)
  * [Mik a szerveretek IP címei](#what-are-your-servers-ip-addresses)
  * [Van engedélyező listátok](#do-you-have-an-allowlist)
  * [Milyen domain név kiterjesztések vannak alapértelmezetten engedélyezve](#what-domain-name-extensions-are-allowlisted-by-default)
  * [Mi az engedélyező lista kritériuma](#what-is-your-allowlist-criteria)
  * [Milyen domain név kiterjesztések használhatók ingyenesen](#what-domain-name-extensions-can-be-used-for-free)
  * [Van szürkelistátok](#do-you-have-a-greylist)
  * [Van tiltólistátok](#do-you-have-a-denylist)
  * [Van korlátozás a forgalomra](#do-you-have-rate-limiting)
  * [Hogyan védekeztek a visszapattanás ellen](#how-do-you-protect-against-backscatter)
  * [Megakadályozzátok a visszapattanásokat ismert MAIL FROM spammerek esetén](#prevent-bounces-from-known-mail-from-spammers)
  * [Megakadályozzátok a felesleges visszapattanásokat a visszapattanás elleni védelem érdekében](#prevent-unnecessary-bounces-to-protect-against-backscatter)
  * [Hogyan határozzátok meg egy email ujjlenyomatát](#how-do-you-determine-an-email-fingerprint)
  * [Továbbíthatok emailt más portokra, mint a 25 (pl. ha az ISP-m blokkolta a 25-ös portot)](#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25)
  * [Támogatja a plusz + jelet Gmail aliasokhoz](#does-it-support-the-plus--symbol-for-gmail-aliases)
  * [Támogatja az aldomain-eket](#does-it-support-sub-domains)
  * [Továbbítja az email fejlécet](#does-this-forward-my-emails-headers)
  * [Jól tesztelt](#is-this-well-tested)
  * [Átadja az SMTP válasz üzeneteket és kódokat](#do-you-pass-along-smtp-response-messages-and-codes)
  * [Hogyan akadályozzátok meg a spammereket és biztosítjátok a jó email továbbítási hírnevet](#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation)
  * [Hogyan végeztek DNS lekérdezéseket domain nevekre](#how-do-you-perform-dns-lookups-on-domain-names)
* [Fiók és Számlázás](#account-and-billing)
  * [Kínáltok pénzvisszafizetési garanciát a fizetős csomagokra](#do-you-offer-a-money-back-guarantee-on-paid-plans)
  * [Ha váltok csomagot, arányosan visszatérítitek a különbözetet](#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference)
  * [Használhatom ezt az email továbbító szolgáltatást "tartalék" vagy "átváltó" MX szerverként](#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server)
  * [Letilthatok konkrét aliasokat](#can-i-disable-specific-aliases)
  * [Továbbíthatok emailt több címzettnek](#can-i-forward-emails-to-multiple-recipients)
  * [Lehet több globális catch-all címzettem](#can-i-have-multiple-global-catch-all-recipients)
  * [Van maximális limit az aliasonként továbbítható email címek számára](#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias)
  * [Továbbíthatok emailt rekurzívan](#can-i-recursively-forward-emails)
  * [Lehet valaki engedély nélkül regisztrálni vagy leiratkozni az email továbbításomról](#can-people-unregister-or-register-my-email-forwarding-without-my-permission)
  * [Hogyan ingyenes](#how-is-it-free)
  * [Mi az email maximális méretkorlátja](#what-is-the-max-email-size-limit)
  * [Tároltok email naplókat](#do-you-store-logs-of-emails)
  * [Tároltok hibajelentési naplókat](#do-you-store-error-logs)
  * [Olvassátok az emailjeimet](#do-you-read-my-emails)
  * [Tudok "küldeni levélként" Gmailben ezzel](#can-i-send-mail-as-in-gmail-with-this)
  * [Tudok "küldeni levélként" Outlookban ezzel](#can-i-send-mail-as-in-outlook-with-this)
  * [Tudok "küldeni levélként" Apple Mailben és iCloud Mailben ezzel](#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this)
  * [Továbbíthatok korlátlan emailt ezzel](#can-i-forward-unlimited-emails-with-this)
  * [Kínáltok korlátlan domaineket egy áron](#do-you-offer-unlimited-domains-for-one-price)
  * [Milyen fizetési módokat fogadtok el](#which-payment-methods-do-you-accept)
* [További Források](#additional-resources)
## Gyors kezdés {#quick-start}

A Forward Email használatának megkezdéséhez:

1. **Hozzon létre egy fiókot** a [forwardemail.net/register](https://forwardemail.net/register) oldalon

2. **Adja hozzá és igazolja domainjét** a [Saját fiók → Domainok](/my-account/domains) menüpont alatt

3. **Adjon hozzá és konfiguráljon e-mail aliasokat/postafiókokat** a [Saját fiók → Domainok](/my-account/domains) → Aliasok alatt

4. **Tesztelje beállításait** úgy, hogy küld egy e-mailt az egyik új aliasára

> \[!TIP]
> A DNS-változások globális propagálása 24-48 órát is igénybe vehet, bár gyakran sokkal hamarabb érvénybe lépnek.

> \[!IMPORTANT]
> A jobb kézbesíthetőség érdekében javasoljuk a [SPF](#how-do-i-set-up-spf-for-forward-email), [DKIM](#how-do-i-set-up-dkim-for-forward-email) és [DMARC](#how-do-i-set-up-dmarc-for-forward-email) rekordok beállítását.


## Bevezetés {#introduction}

### Mi az a Forward Email {#what-is-forward-email}

> \[!NOTE]
> A Forward Email tökéletes egyének, kisvállalkozások és fejlesztők számára, akik professzionális e-mail címeket szeretnének költségek és teljes e-mail tárhely megoldás karbantartása nélkül.

A Forward Email egy **teljes körű e-mail szolgáltató** és **egyedi domain nevekhez e-mail tárhely szolgáltató**.

Ez az egyetlen ingyenes és nyílt forráskódú szolgáltatás, amely lehetővé teszi, hogy egyedi domain e-mail címeket használjon anélkül, hogy saját e-mail szervert kellene beállítania és karbantartania.

Szolgáltatásunk továbbítja az Ön egyedi domainjére küldött e-maileket a meglévő e-mail fiókjába – és akár dedikált e-mail tárhely szolgáltatóként is használhat minket.

A Forward Email főbb jellemzői:

* **Egyedi domain e-mail**: Használjon professzionális e-mail címeket saját domain nevével
* **Ingyenes szint**: Alapvető e-mail továbbítás díjmentesen
* **Fokozott adatvédelem**: Nem olvassuk el az e-mailjeit, és nem adjuk el adatait
* **Nyílt forráskód**: Teljes kódunk elérhető a GitHubon
* **SMTP, IMAP és POP3 támogatás**: Teljes körű e-mail küldési és fogadási képességek
* **Végpontok közötti titkosítás**: OpenPGP/MIME támogatás
* **Egyedi Catch-All aliasok**: Korlátlan e-mail alias létrehozása

Összehasonlíthat minket több mint 56 másik e-mail szolgáltatóval a [Email összehasonlító oldalunkon](/blog/best-email-service).

> \[!TIP]
> Tudjon meg többet a Forward Emailről ingyenes [Műszaki fehér könyvünk](/technical-whitepaper.pdf) elolvasásával

### Kik használják a Forward Emailt {#who-uses-forward-email}

E-mail tárhelyet és továbbítási szolgáltatást nyújtunk több mint 500 000 domainnek és az alábbi ismert felhasználóknak:

| Ügyfél                                  | Esettanulmány                                                                                           |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| U.S. Naval Academy                      | [:page_facing_up: Esettanulmány](/blog/docs/federal-government-email-service-section-889-compliant)    |
| Canonical                               | [:page_facing_up: Esettanulmány](/blog/docs/canonical-ubuntu-email-enterprise-case-study)              |
| Netflix Games                           |                                                                                                        |
| The Linux Foundation                    | [:page_facing_up: Esettanulmány](/blog/docs/linux-foundation-email-enterprise-case-study)              |
| The PHP Foundation                      |                                                                                                        |
| Fox News Radio                          |                                                                                                        |
| Disney Ad Sales                         |                                                                                                        |
| jQuery                                  | [:page_facing_up: Esettanulmány](/blog/docs/linux-foundation-email-enterprise-case-study)              |
| LineageOS                              |                                                                                                        |
| Ubuntu                                 | [:page_facing_up: Esettanulmány](/blog/docs/canonical-ubuntu-email-enterprise-case-study)              |
| Kubuntu                                | [:page_facing_up: Esettanulmány](/blog/docs/canonical-ubuntu-email-enterprise-case-study)              |
| Lubuntu                                | [:page_facing_up: Esettanulmány](/blog/docs/canonical-ubuntu-email-enterprise-case-study)              |
| The University of Cambridge             | [:page_facing_up: Esettanulmány](/blog/docs/alumni-email-forwarding-university-case-study)             |
| The University of Maryland              | [:page_facing_up: Esettanulmány](/blog/docs/alumni-email-forwarding-university-case-study)             |
| The University of Washington            | [:page_facing_up: Esettanulmány](/blog/docs/alumni-email-forwarding-university-case-study)             |
| Tufts University                      | [:page_facing_up: Esettanulmány](/blog/docs/alumni-email-forwarding-university-case-study)             |
| Swarthmore College                    | [:page_facing_up: Esettanulmány](/blog/docs/alumni-email-forwarding-university-case-study)             |
| Government of South Australia           |                                                                                                        |
| Government of Dominican Republic        |                                                                                                        |
| Fly<span>.</span>io                     |                                                                                                        |
| RCD Hotels                            |                                                                                                        |
| Isaac Z. Schlueter (npm)                | [:page_facing_up: Esettanulmány](/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem) |
| David Heinemeier Hansson (Ruby on Rails) |                                                                                                        |
### Mi a Forward Email története {#what-is-forward-emails-history}

További információkat a Forward Emailről a [Rólunk oldalunkon](/about) talál.

### Milyen gyors ez a szolgáltatás {#how-fast-is-this-service}

> \[!NOTE]
> Rendszerünk a sebességre és megbízhatóságra van tervezve, több redundáns szerverrel, hogy az e-mailek gyorsan kézbesítésre kerüljenek.

A Forward Email minimális késéssel továbbítja az üzeneteket, általában néhány másodpercen belül a beérkezéstől számítva.

Teljesítménymutatók:

* **Átlagos kézbesítési idő**: kevesebb, mint 5-10 másodperc a beérkezéstől a továbbításig ([lásd a Beérkező idő "TTI" monitorozó oldalunkat](/tti))
* **Üzemidő**: 99,9%+ szolgáltatás elérhetőség
* **Globális infrastruktúra**: stratégiailag elhelyezett szerverek az optimális útvonal érdekében
* **Automatikus skálázás**: rendszerünk a csúcsidőszakokban skálázódik

Valós időben működünk, ellentétben más szolgáltatókkal, amelyek késleltetett sorokat használnak.

Nem írunk lemezre vagy tárolunk naplókat – kivéve a [hibákat](#do-you-store-error-logs) és a [kimenő SMTP-t](#do-you-support-sending-email-with-smtp) (lásd az [Adatvédelmi irányelveinket](/privacy)).

Minden memóriában történik, és [a forráskódunk elérhető a GitHubon](https://github.com/forwardemail).


## E-mail kliensek {#email-clients}

### Thunderbird {#thunderbird}

1. Hozz létre egy új álnevet és generálj jelszót a Forward Email irányítópultodon
2. Nyisd meg a Thunderbirdöt, majd menj a **Szerkesztés → Fiókbeállítások → Fiókműveletek → E-mail fiók hozzáadása** menüpontra
3. Írd be a neved, a Forward Email címed és a jelszavad
4. Kattints a **Kézi beállítás** gombra, és add meg:
   * Bejövő: IMAP, `imap.forwardemail.net`, 993-as port, SSL/TLS
   * Kimenő: SMTP, `smtp.forwardemail.net`, 465-ös port, SSL/TLS (ajánlott; 587-es port STARTTLS-sel is támogatott)
5. Kattints a **Kész** gombra

### Microsoft Outlook {#microsoft-outlook}

1. Hozz létre egy új álnevet és generálj jelszót a Forward Email irányítópultodon
2. Menj a **Fájl → Fiók hozzáadása** menüpontra
3. Írd be a Forward Email címed és kattints a **Csatlakozás** gombra
4. Válaszd az **Speciális beállítások** lehetőséget, majd a **Fiókom kézi beállítása** opciót
5. Válaszd az **IMAP**-ot és add meg:
   * Bejövő: `imap.forwardemail.net`, 993-as port, SSL
   * Kimenő: `smtp.forwardemail.net`, 465-ös port, SSL/TLS (ajánlott; 587-es port STARTTLS-sel is támogatott)
   * Felhasználónév: Teljes e-mail címed
   * Jelszó: A generált jelszavad
6. Kattints a **Csatlakozás** gombra

### Apple Mail {#apple-mail}

1. Hozz létre egy új álnevet és generálj jelszót a Forward Email irányítópultodon
2. Menj a **Mail → Beállítások → Fiókok → +** menüpontra
3. Válaszd az **Egyéb e-mail fiók** lehetőséget
4. Írd be a neved, a Forward Email címed és a jelszavad
5. A szerverbeállításokhoz add meg:
   * Bejövő: `imap.forwardemail.net`
   * Kimenő: `smtp.forwardemail.net`
   * Felhasználónév: Teljes e-mail címed
   * Jelszó: A generált jelszavad
6. Kattints a **Bejelentkezés** gombra

### eM Client {#em-client}

1. Hozz létre egy új álnevet és generálj jelszót a Forward Email irányítópultodon
2. Nyisd meg az eM Clientet, majd menj a **Menü → Fiókok → + Fiók hozzáadása** menüpontra
3. Kattints a **Levelezés** lehetőségre, majd válaszd az **Egyéb** opciót
4. Írd be a Forward Email címed és kattints a **Tovább** gombra
5. Add meg a következő szerverbeállításokat:
   * **Bejövő szerver**: `imap.forwardemail.net`
   * **Kimenő szerver**: `smtp.forwardemail.net`
6. Írd be teljes e-mail címedet **Felhasználónévként**, és a generált jelszavadat **Jelszóként** mind a bejövő, mind a kimenő szerverhez.
7. Az eM Client teszteli a kapcsolatot. Ha sikeres, kattints a **Tovább** gombra.
8. Írd be a neved és válassz fióknevet.
9. Kattints a **Befejezés** gombra.

### Mobil eszközök {#mobile-devices}

iOS esetén:

1. Menj a **Beállítások → Mail → Fiókok → Fiók hozzáadása → Egyéb** menüpontra
2. Koppints a **Mail fiók hozzáadása** lehetőségre és írd be az adataidat
3. A szerverbeállításokhoz használd a fent megadott IMAP és SMTP beállításokat

Android esetén:

1. Menj a **Beállítások → Fiókok → Fiók hozzáadása → Személyes (IMAP)** menüpontra
2. Írd be a Forward Email címed és jelszavad
3. A szerverbeállításokhoz használd a fent megadott IMAP és SMTP beállításokat

### Sendmail SMTP Relay konfiguráció {#sendmail-smtp-relay-configuration}

Beállíthatod a Sendmailt, hogy a Forward Email SMTP szerverein keresztül továbbítsa az e-maileket. Ez egy gyakori konfiguráció régebbi rendszerek vagy Sendmailre támaszkodó alkalmazások esetén.
<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Becsült beállítási idő:</strong>
  <span>Kevesebb, mint 20 perc</span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Fontos:
  </strong>
  <span>
    Ehhez fizetős csomag szükséges SMTP-hozzáféréssel.
  </span>
</div>

#### Konfiguráció {#configuration}

1. Szerkessze a `sendmail.mc` fájlt, amely általában az `/etc/mail/sendmail.mc` helyen található:

   ```bash
   sudo nano /etc/mail/sendmail.mc
   ```

2. Adja hozzá a következő sorokat az okos hoszt és az autentikáció meghatározásához:

   ```
   define(`SMART_HOST', `smtp.forwardemail.net')dnl
   define(`RELAY_MAILER_ARGS', `TCP $h 465')dnl
   define(`confAUTH_MECHANISMS', `EXTERNAL GSSAPI DIGEST-MD5 CRAM-MD5 LOGIN PLAIN')dnl
   FEATURE(`authinfo',`hash -o /etc/mail/authinfo.db')dnl
   ```

3. Hozza létre az autentikációs fájlt `/etc/mail/authinfo` néven:

   ```bash
   sudo nano /etc/mail/authinfo
   ```

4. Adja hozzá a Forward Email hitelesítő adatait az `authinfo` fájlhoz:

   ```
   AuthInfo:smtp.forwardemail.net "U:your-alias@yourdomain.com" "P:your-generated-password" "M:PLAIN"
   ```

5. Generálja az autentikációs adatbázist és állítsa be a fájlok jogosultságait:

   ```bash
   sudo makemap hash /etc/mail/authinfo < /etc/mail/authinfo
   sudo chmod 600 /etc/mail/authinfo /etc/mail/authinfo.db
   ```

6. Építse újra a Sendmail konfigurációt és indítsa újra a szolgáltatást:

   ```bash
   sudo make -C /etc/mail
   sudo systemctl restart sendmail
   ```

#### Tesztelés {#testing}

Küldjön egy teszt e-mailt a konfiguráció ellenőrzéséhez:

```bash
echo "Teszt e-mail Sendmailből" | mail -s "Sendmail teszt" recipient@example.com
```

### Exim4 SMTP Relay konfiguráció {#exim4-smtp-relay-configuration}

Az Exim4 egy népszerű MTA Debian-alapú rendszereken. Beállítható úgy, hogy a Forward Email-t használja smarthostként.

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Becsült beállítási idő:</strong>
  <span>Kevesebb, mint 15 perc</span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Fontos:
  </strong>
  <span>
    Ehhez fizetős csomag szükséges SMTP-hozzáféréssel.
  </span>
</div>

#### Konfiguráció {#configuration-1}

1. Futtassa az Exim4 konfigurációs eszközt:

   ```bash
   sudo dpkg-reconfigure exim4-config
   ```

2. Válassza ki a következő opciókat:
   * **Általános levélkonfiguráció típusa:** levél küldése smarthoston keresztül; fogadás SMTP vagy fetchmail által
   * **Rendszer levelezési neve:** your.hostname
   * **IP-címek, amelyeken az SMTP bejövő kapcsolatokra figyel:** 127.0.0.1 ; ::1
   * **Egyéb célállomások, amelyeknek elfogadott a levél:** (hagyja üresen)
   * **Tartományok, amelyeknek továbbít levelet:** (hagyja üresen)
   * **Kimenő smarthost IP-címe vagy hosztneve:** smtp.forwardemail.net::465
   * **Rejtse el a helyi levelezési nevet a kimenő levelekben?** Nem
   * **Minimalizálja a DNS-lekérdezések számát (Dial-on-Demand)?** Nem
   * **Helyi levelek kézbesítési módja:** Mbox formátum a /var/mail/ könyvtárban
   * **Ossza fel a konfigurációt kis fájlokra?** Nem

3. Szerkessze a `passwd.client` fájlt a hitelesítő adatok hozzáadásához:

   ```bash
   sudo nano /etc/exim4/passwd.client
   ```

4. Adja hozzá a következő sort:

   ```
   smtp.forwardemail.net:your-alias@yourdomain.com:your-generated-password
   ```

5. Frissítse a konfigurációt és indítsa újra az Exim4-et:

   ```bash
   sudo update-exim4.conf
   sudo systemctl restart exim4
   ```

#### Tesztelés {#testing-1}

Küldjön egy teszt e-mailt:

```bash
echo "Teszt Exim4-ből" | mail -s "Exim4 teszt" recipient@example.com
```

### msmtp SMTP kliens konfiguráció {#msmtp-smtp-client-configuration}

Az msmtp egy könnyű SMTP kliens, amely hasznos e-mailek küldésére szkriptekből vagy parancssori alkalmazásokból.

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Becsült beállítási idő:</strong>
  <span>Kevesebb, mint 10 perc</span>
</div>
<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Fontos:
  </strong>
  <span>
    Ehhez fizetős csomag szükséges, amelyen engedélyezve van az SMTP hozzáférés.
  </span>
</div>

#### Konfiguráció {#configuration-2}

1. Hozza létre vagy szerkessze az msmtp konfigurációs fájlt a `~/.msmtprc` helyen:

   ```bash
   nano ~/.msmtprc
   ```

2. Adja hozzá a következő konfigurációt:

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

3. Állítsa be a konfigurációs fájl megfelelő jogosultságait:

   ```bash
   chmod 600 ~/.msmtprc
   ```

#### Tesztelés {#testing-2}

Küldjön egy teszt e-mailt:

```bash
echo "Ez egy teszt e-mail az msmtp-től" | msmtp -a default recipient@example.com
```

### Parancssoros e-mail kliensek {#command-line-email-clients}

Népszerű parancssoros e-mail kliensek, mint a [Mutt](https://gitlab.com/muttmua/mutt), [NeoMutt](https://neomutt.org) és az [Alpine](https://alpine.x10.mx/alpine/release/) konfigurálhatók a Forward Email SMTP szervereinek használatára az e-mailek küldéséhez. A konfiguráció hasonló lesz az `msmtp` beállításhoz, ahol megadja az SMTP szerver adatait és hitelesítő adatait a megfelelő konfigurációs fájlokban (`.muttrc`, `.neomuttrc` vagy `.pinerc`).

### Windows e-mail konfiguráció {#windows-email-configuration}

Windows felhasználók számára népszerű e-mail kliensek, mint a **Microsoft Outlook** és az **eM Client** konfigurálhatók az IMAP és SMTP beállításokkal, amelyeket a Forward Email fiókjában talál. Parancssoros vagy szkriptelési célokra használhatja a PowerShell `Send-MailMessage` parancsát (bár ez elavultnak számít), vagy egy könnyű SMTP relay eszközt, például az [E-MailRelay](https://github.com/graeme-walker/emailrelay)-t.

### Postfix SMTP relay konfiguráció {#postfix-smtp-relay-configuration}

Beállíthatja a Postfixet, hogy a Forward Email SMTP szerverein keresztül továbbítsa az e-maileket. Ez hasznos szerveralkalmazások számára, amelyeknek e-maileket kell küldeniük.

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Becsült beállítási idő:</strong>
  <span>Kevesebb, mint 15 perc</span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Fontos:
  </strong>
  <span>
    Ehhez fizetős csomag szükséges, amelyen engedélyezve van az SMTP hozzáférés.
  </span>
</div>

#### Telepítés {#installation}

1. Telepítse a Postfixet a szerverére:

```bash
# Ubuntu/Debian
sudo apt update && sudo apt install postfix

# CentOS/RHEL
sudo yum install postfix

# macOS
brew install postfix
```

2. A telepítés során válassza az "Internet Site" opciót, amikor a konfiguráció típusát kéri.

#### Konfiguráció {#configuration-3}

1. Szerkessze a Postfix fő konfigurációs fájlját:

```bash
sudo nano /etc/postfix/main.cf
```

2. Adja hozzá vagy módosítsa ezeket a beállításokat:

```
# SMTP relay konfiguráció
relayhost = [smtp.forwardemail.net]:465
smtp_tls_wrappermode = yes
smtp_tls_security_level = encrypt
smtp_sasl_auth_enable = yes
smtp_sasl_password_maps = hash:/etc/postfix/sasl_passwd
smtp_sasl_security_options = noanonymous
smtp_tls_CAfile = /etc/ssl/certs/ca-certificates.crt
```

3. Hozza létre a SASL jelszó fájlt:

```bash
sudo nano /etc/postfix/sasl_passwd
```

4. Adja hozzá a Forward Email hitelesítő adatait:

```
[smtp.forwardemail.net]:465 your-alias@yourdomain.com:your-generated-password
```

5. Biztosítsa és hash-elje a jelszó fájlt:

```bash
sudo chmod 600 /etc/postfix/sasl_passwd
sudo postmap /etc/postfix/sasl_passwd
```

6. Indítsa újra a Postfixet:

```bash
sudo systemctl restart postfix
```

#### Tesztelés {#testing-3}

Tesztelje a konfigurációt egy teszt e-mail küldésével:

```bash
echo "Teszt e-mail törzse" | mail -s "Teszt tárgy" recipient@example.com
```

### Hogyan küldjünk levelet Gmail használatával {#how-to-send-mail-as-using-gmail}
<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Becsült beállítási idő:</strong>
  <span>Kevesebb, mint 10 perc</span>
</div>

<div class="alert mb-3 alert-success">
  <i class="fa fa-bullhorn font-weight-bold"></i>
  <strong class="font-weight-bold">
    Kezdés:
  </strong>
  <span>
    Ha követte a fenti utasításokat a <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">Hogyan kezdjek hozzá és állítsam be az e-mail továbbítást</a> alatt, akkor folytathatja az olvasást alább.
  </span>
</div>

<div id="send-mail-as-content">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Fontos:
  </strong>
  <span>
    Kérjük, győződjön meg róla, hogy elolvasta a <a href="/terms" class="alert-link" target="_blank">Felhasználási feltételeinket</a>, <a href="/privacy" class="alert-link" target="_blank">Adatvédelmi irányelveinket</a>, és az <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">SMTP-kimeneti korlátokat</a> – az Ön használata a feltételek elfogadásának és egyetértésének minősül.
  </span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Fontos:
  </strong>
  <span>
    Ha fejlesztő, kérjük, tekintse meg az <a class="alert-link" href="/email-api#outbound-emails" target="_blank">email API dokumentációt</a>.
  </span>
</div>

1. Menjen a <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Saját fiók <i class="fa fa-angle-right"></i> Domain-ek</a> <i class="fa fa-angle-right"></i> Beállítások <i class="fa fa-angle-right"></i> Kimenő SMTP konfiguráció és kövesse a beállítási utasításokat

2. Hozzon létre egy új alias-t a domainje alatt a <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Saját fiók <i class="fa fa-angle-right"></i> Domain-ek</a> <i class="fa fa-angle-right"></i> Aliasok menüpontban (pl. <code><hello@example.com></code>)

3. Kattintson a <strong class="text-success"><i class="fa fa-key"></i> Jelszó generálása</strong> gombra az újonnan létrehozott alias mellett. Másolja a vágólapjára, és biztonságosan tárolja a képernyőn megjelenő generált jelszót.

4. Menjen a [Gmail](https://gmail.com) oldalra, és a [Beállítások <i class="fa fa-angle-right"></i> Fiókok és importálás <i class="fa fa-angle-right"></i> Küldés másik e-mail címről](https://mail.google.com/mail/u/0/#settings/accounts) menüpont alatt kattintson az „Új e-mail cím hozzáadása” gombra

5. Amikor a „Név” mező megjelenik, írja be azt a nevet, amelyet szeretne, hogy az e-mailje „Feladóként” mutasson (pl. „Linus Torvalds”).

6. Amikor az „E-mail cím” mező megjelenik, írja be annak az aliasnak a teljes e-mail címét, amelyet a <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Saját fiók <i class="fa fa-angle-right"></i> Domain-ek</a> <i class="fa fa-angle-right"></i> Aliasok alatt hozott létre (pl. <code><hello@example.com></code>)

7. Törölje a jelölést a „Kezelés aliaszként” opcióból

8. Kattintson a „Következő lépés” gombra a folytatáshoz

9. Amikor az „SMTP szerver” mező megjelenik, írja be: <code>smtp.forwardemail.net</code> és állítsa a portot <code>465</code>-re

10. Amikor a „Felhasználónév” mező megjelenik, írja be annak az aliasnak a teljes e-mail címét, amelyet a <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Saját fiók <i class="fa fa-angle-right"></i> Domain-ek</a> <i class="fa fa-angle-right"></i> Aliasok alatt hozott létre (pl. <code><hello@example.com></code>)

11. Amikor a „Jelszó” mező megjelenik, illessze be a 3. lépésben a <strong class="text-success"><i class="fa fa-key"></i> Jelszó generálása</strong> gombbal kapott jelszót

12. Válassza ki az „SSL használatával biztonságos kapcsolat” rádiógombot

13. Kattintson a „Fiók hozzáadása” gombra a folytatáshoz

14. Nyisson meg egy új lapot a [Gmail](https://gmail.com) oldalon, és várja meg, amíg megérkezik az ellenőrző e-mail (kapni fog egy ellenőrző kódot, amely megerősíti, hogy Ön a tulajdonosa annak az e-mail címnek, amelyről „Küldés másként” próbál)

15. Amint megérkezik, másolja ki és illessze be az ellenőrző kódot a korábbi lépésben megjelenő kérés mezőjébe
16. Miután ezzel végeztél, térj vissza az e-mailhez, és kattints a "kérés megerősítése" linkre. Valószínűleg ezt a lépést és az előzőt is meg kell tenned ahhoz, hogy az e-mail helyesen legyen konfigurálva.

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Gratulálunk!
    </strong>
    <span>
      Sikeresen befejezted az összes lépést.
    </span>
  </div>
</div>

</div>

### Mi az a legacy free útmutató a Send Mail As használatához Gmailen keresztül {#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail}

<div class="alert my-3 alert-danger"><i class="fa fa-stop-circle font-weight-bold"></i> <strong class="font-weight-bold">Fontos:</strong> Ez a legacy free útmutató 2023 májusa óta elavult, mivel <a class="alert-link" href="/faq#do-you-support-sending-email-with-smtp">most már támogatjuk a kimenő SMTP-t</a>. Ha az alábbi útmutatót használod, akkor <a class="alert-link" href="/faq#can-i-remove-the-via-forwardemail-dot-net-in-gmail">ez azt eredményezi, hogy a kimenő e-mailed</a> a Gmailben "<span class="notranslate text-danger font-weight-bold">via forwardemail dot net</span>" felirattal jelenik meg.</a></div>

<div class="alert mb-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Becsült beállítási idő:</strong>
  <span>Kevesebb, mint 10 perc</span>
</div>

<div class="alert mb-3 alert-success">
  <i class="fa fa-bullhorn font-weight-bold"></i>
  <strong class="font-weight-bold">
    Kezdés:
  </strong>
  <span>
    Ha követted a fentiekben a <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">Hogyan kezdjek hozzá és állítsam be az e-mail továbbítást</a> című utasításokat, akkor folytathatod az olvasást alább.
  </span>
</div>

<div class="mx-auto lazyframe lazyframe-bordered border border-themed mb-3" data-vendor="youtube_nocookie" title="Hogyan küldjünk levelet Gmailen keresztül Send Mail As használatával" data-src="https://www.youtube-nocookie.com/embed/MEheS8gM4Xs?autoplay=0"></div>

<div id="legacy-free-guide">

1. Ehhez szükséged van a [Gmail kétlépcsős azonosításának][gmail-2fa] engedélyezésére. Látogass el a <https://www.google.com/landing/2step/> oldalra, ha még nincs engedélyezve.

2. Miután a kétlépcsős azonosítás engedélyezve lett (vagy ha már korábban engedélyezve volt), látogass el a <https://myaccount.google.com/apppasswords> oldalra.

3. Amikor megkérdezi, hogy "Válaszd ki az alkalmazást és az eszközt, amelyhez alkalmazásjelszót szeretnél generálni":
   * Válaszd ki a "Mail" opciót az "Alkalmazás kiválasztása" legördülő menüből
   * Válaszd ki az "Egyéb" opciót az "Eszköz kiválasztása" legördülő menüből
   * Amikor szöveges bevitelt kér, írd be a továbbított egyedi domainhez tartozó e-mail címedet (pl. <code><hello@example.com></code> - ez segít nyomon követni, ha több fiókhoz használod ezt a szolgáltatást)

4. Másold ki a vágólapodra az automatikusan generált jelszót
   <div class="alert my-3 alert-warning">
     <i class="fa fa-exclamation-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Fontos:
     </strong>
     <span>
       Ha G Suite-ot használsz, látogass el az admin panelre <a class="alert-link" href="https://admin.google.com/AdminHome#ServiceSettings/service=email&subtab=filters" rel="noopener noreferrer" target="_blank">Alkalmazások <i class="fa fa-angle-right"></i> G Suite <i class="fa fa-angle-right"></i> Gmail beállítások <i class="fa fa-angle-right"></i> Beállítások</a>, és győződj meg róla, hogy be van jelölve az "Engedélyezd a felhasználóknak, hogy küldjenek levelet külső SMTP szerveren keresztül..." opció. Ennek a változásnak az aktiválásához eltarthat néhány percig, kérjük, várj türelemmel.
     </span>
   </div>

5. Lépj be a [Gmail](https://gmail.com) fiókodba, és a [Beállítások <i class="fa fa-angle-right"></i> Fiókok és importálás <i class="fa fa-angle-right"></i> Levél küldése másik címről](https://mail.google.com/mail/u/0/#settings/accounts) menüpont alatt kattints az "Újabb e-mail cím hozzáadása" gombra

6. Amikor a "Név" mező megjelenik, írd be azt a nevet, amelyet szeretnél, hogy az e-mailed "Feladóként" mutasson (pl. "Linus Torvalds")

7. Amikor az "E-mail cím" mező megjelenik, írd be az előzőekben használt egyedi domainhez tartozó e-mail címet (pl. <code><hello@example.com></code>)
8. Töröld a jelölést a „Treat as an alias” opcióból

9. Kattints a „Next Step” gombra a folytatáshoz

10. Amikor az „SMTP Server” megadására kér, írd be a <code>smtp.gmail.com</code>-ot, és hagyd a portot <code>587</code>-en

11. Amikor a „Username” megadására kér, írd be a Gmail címed azon részét, amely nem tartalmazza a <span>gmail.com</span> részt (pl. csak „user”, ha az email címem <span><user@gmail.com></span>)
    <div class="alert my-3 alert-primary">
      <i class="fa fa-info-circle font-weight-bold"></i>
      <strong class="font-weight-bold">
        Fontos:
      </strong>
      <span>
        Ha a „Username” mező automatikusan kitöltődik, akkor <u><strong>ezt meg kell változtatnod</strong></u> a Gmail címed felhasználónév részére.
      </span>
    </div>

12. Amikor a „Password” megadására kér, illeszd be a vágólapról a 2. lépésben generált jelszót

13. Hagyd bejelölve a „Secured connection using TLS” rádiógombot

14. Kattints az „Add Account” gombra a folytatáshoz

15. Nyiss meg egy új fület a [Gmail](https://gmail.com) oldalon, és várd meg, amíg megérkezik az ellenőrző email (kapni fogsz egy ellenőrző kódot, amely igazolja, hogy te vagy az email cím tulajdonosa, amelyről a „Send Mail As” funkciót próbálod beállítani)

16. Amint megérkezik, másold ki és illeszd be az ellenőrző kódot a korábbi lépésben megjelenő kérés mezőbe

17. Miután ezt megtetted, térj vissza az emailhez, és kattints a „confirm the request” linkre. Valószínűleg ezt a lépést és az előzőt is el kell végezned ahhoz, hogy az email helyesen legyen konfigurálva.

</div>

### Haladó Gmail útválasztási beállítások {#advanced-gmail-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Becsült beállítási idő:</strong>
  <span>15-30 perc</span>
</div>

Ha szeretnél haladó útválasztást beállítani Gmailben úgy, hogy az aliasok, amelyek nem egyeznek meg egy postafiókkal, továbbítódjanak a Forward Email levelezőszervereire, kövesd az alábbi lépéseket:

1. Jelentkezz be a Google Admin konzolba a [admin.google.com](https://admin.google.com) címen
2. Navigálj az **Apps → Google Workspace → Gmail → Routing** menüpontra
3. Kattints az **Add Route** gombra, és állítsd be a következőket:

**Egyedi címzett beállítások:**

* Válaszd a „Change envelope recipient” opciót, és írd be a fő Gmail címedet
* Jelöld be az „Add X-Gm-Original-To header with original recipient” opciót

**Boríték címzett minták:**

* Adj hozzá egy mintát, amely lefedi az összes nem létező postafiókot (pl. `.*@yourdomain.com`)

**Email szerver beállítások:**

* Válaszd a „Route to host” opciót, és add meg elsődleges szerverként az `mx1.forwardemail.net` címet
* Add hozzá a `mx2.forwardemail.net` címet tartalék szerverként
* Állítsd be a portot 25-re
* Válaszd a „Require TLS” opciót a biztonság érdekében

4. Kattints a **Save** gombra az útvonal létrehozásához

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Fontos:
  </strong>
  <span>
    Ez a beállítás csak Google Workspace fiókoknál működik egyedi domainekkel, nem pedig normál Gmail fiókoknál.
  </span>
</div>

### Haladó Outlook útválasztási beállítások {#advanced-outlook-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Becsült beállítási idő:</strong>
  <span>15-30 perc</span>
</div>

Microsoft 365 (korábban Office 365) felhasználók számára, akik haladó útválasztást szeretnének beállítani úgy, hogy az aliasok, amelyek nem egyeznek meg egy postafiókkal, továbbítódjanak a Forward Email levelezőszervereire:

1. Jelentkezz be a Microsoft 365 admin központba a [admin.microsoft.com](https://admin.microsoft.com) címen
2. Navigálj az **Exchange → Mail flow → Rules** menüpontra
3. Kattints az **Add a rule** gombra, majd válaszd a **Create a new rule** opciót
4. Nevezd el a szabályt (pl. „Forward non-existent mailboxes to Forward Email”)
5. Az **Apply this rule if** résznél válaszd:
   * „The recipient address matches...”
   * Írj be egy mintát, amely lefedi az összes címet a domaineden (pl. `*@yourdomain.com`)
6. A **Do the following** résznél válaszd:
   * „Redirect the message to...”
   * Válaszd a „The following mail server” opciót
   * Írd be az `mx1.forwardemail.net` címet és a 25-ös portot
   * Add hozzá a `mx2.forwardemail.net` címet tartalék szerverként
7. Az **Except if** résznél válaszd:
   * „The recipient is...”
   * Add meg az összes meglévő postafiókot, amelyeket nem szeretnél továbbítani
8. Állítsd be a szabály prioritását, hogy más levelezési szabályok után fusson le
9. Kattints a **Save** gombra a szabály aktiválásához
## Hibakeresés {#troubleshooting}

### Miért nem kapom meg a teszt e-mailjeimet? {#why-am-i-not-receiving-my-test-emails}

Ha magadnak küldesz teszt e-mailt, akkor az nem biztos, hogy megjelenik a beérkező levelek között, mert ugyanazzal a "Message-ID" fejléc értékkel rendelkezik.

Ez egy széles körben ismert probléma, amely érinti például a Gmail szolgáltatást is.  <a href="https://support.google.com/a/answer/1703601">Itt található a hivatalos Gmail válasz erre a problémára</a>.

Ha továbbra is problémáid vannak, akkor valószínűleg DNS propagációs gond áll fenn. Várnod kell egy kicsit, majd próbáld újra (vagy próbálj meg alacsonyabb TTL értéket beállítani a <strong class="notranslate">TXT</strong> rekordjaidnál).

**Még mindig problémáid vannak?**  Kérjük, <a href="/help">lépj kapcsolatba velünk</a>, hogy segíthessünk kivizsgálni a problémát és gyors megoldást találni.

### Hogyan állítsam be az e-mail kliensemet, hogy működjön a Forward Email szolgáltatással? {#how-do-i-configure-my-email-client-to-work-with-forward-email}

<div class="mb-3">
  Szolgáltatásunk népszerű e-mail kliensekkel működik együtt, mint például:
  <ul class="ml-1 h4 d-inline list-inline mb-0 pl-0">
    <li class="list-inline-item"><a href="/blog/open-source/apple-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Apple&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/windows-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Windows&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/android-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-android"></i> Android&trade;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/linux-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-linux"></i> Linux&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/desktop-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fas fa-desktop"></i> Desktop</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/mozilla-firefox-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-firefox-browser"></i> Mozilla Firefox&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/safari-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Safari&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/google-chrome-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-chrome"></i> Google Chrome&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/terminal-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fas fa-terminal"></i> Terminal</a></li>
  </ul>
</div>

<div class="alert alert-primary">
  A felhasználóneved az alias e-mail címed, a jelszó pedig a <strong class="text-success"><i class="fa fa-key"></i> Generate Password</strong> ("Normál jelszó") gombbal generált jelszó.
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tipp:
  </strong>
  <span>Ha Thunderbirdöt használsz, akkor győződj meg róla, hogy a "Kapcsolat biztonsága" "SSL/TLS"-re van állítva, az azonosítási mód pedig "Normál jelszó".</span>
</div>

| Típus |         Hosztnév        |         Protokoll        |                                            Portok                                           |
| :----: | :---------------------: | :---------------------: | :----------------------------------------------------------------------------------------: |
| IMAP | `imap.forwardemail.net` |  SSL/TLS **ajánlott**  |                                      `993` és `2993`                                      |
| SMTP | `smtp.forwardemail.net` | SSL/TLS **ajánlott** | `465` és `2465` SSL/TLS-hez (ajánlott) vagy `587`, `2587`, `2525`, és `25` STARTTLS-hez |

### Miért kerülnek az e-mailjeim a Spam és Levélszemét mappába, és hogyan ellenőrizhetem a domain hírnevemet? {#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation}
Ez a szakasz útmutatást ad, ha a kimenő leveleid a mi SMTP szervereinken keresztül mennek (pl. `smtp.forwardemail.net`) (vagy továbbítva az `mx1.forwardemail.net` vagy `mx2.forwardemail.net` szervereken keresztül), és a címzettek Spam vagy Levélszemét mappájába érkeznek.

Rendszeresen ellenőrizzük [IP címeinket](#what-are-your-servers-ip-addresses) [minden elismert DNS tiltólistával](#how-do-you-handle-your-ip-addresses-becoming-blocked), **ezért valószínűleg domain-hírnévvel kapcsolatos probléma áll fenn**.

A levelek több okból is a spam mappába kerülhetnek:

1. **Hitelesítés hiánya**: Állítsd be a [SPF](#how-do-i-set-up-spf-for-forward-email), [DKIM](#how-do-i-set-up-dkim-for-forward-email) és [DMARC](#how-do-i-set-up-dmarc-for-forward-email) rekordokat.

2. **Domain hírnév**: Az új domainek gyakran semleges hírnévvel rendelkeznek, amíg nem építenek fel küldési előzményt.

3. **Tartalmi kiváltók**: Bizonyos szavak vagy kifejezések kiválthatják a spam szűrőket.

4. **Küldési minták**: A hirtelen megnövekedett levélmennyiség gyanúsnak tűnhet.

Próbálhatod az alábbi eszközök egyikét vagy többet használni a domain hírnevének és kategorizálásának ellenőrzésére:

#### Hírnév és Tiltólista Ellenőrző Eszközök {#reputation-and-blocklist-check-tools}

| Eszköz neve                                | URL                                                          | Típus                  |
| ------------------------------------------ | ------------------------------------------------------------ | ---------------------- |
| Cloudflare Domain Categorization Feedback  | <https://radar.cloudflare.com/domains/feedback>              | Kategorizálás          |
| Spamhaus IP és Domain Hírnév Ellenőrző    | <https://check.spamhaus.org/>                                | DNSBL                  |
| Cisco Talos IP és Domain Hírnév Központ    | <https://talosintelligence.com/reputation_center>            | Hírnév                 |
| Barracuda IP és Domain Hírnév Lekérdezés  | <https://www.barracudacentral.org/lookups/lookup-reputation> | DNSBL                  |
| MX Toolbox Tiltólista Ellenőrzés           | <https://mxtoolbox.com/blacklists.aspx>                      | Tiltólista             |
| Google Postmaster Eszközök                  | <https://www.gmail.com/postmaster/>                          | Hírnév                 |
| Yahoo Sender Hub                            | <https://senders.yahooinc.com/>                              | Hírnév                 |
| MultiRBL.valli.org Tiltólista Ellenőrzés  | <https://multirbl.valli.org/lookup/>                         | DNSBL                  |
| Sender Score                                | <https://senderscore.org/act/blocklist-remover/>             | Hírnév                 |
| Invaluement                                 | <https://www.invaluement.com/lookup/>                        | DNSBL                  |
| SURBL                                       | <https://www.surbl.org/>                                     | DNSBL                  |
| SpamCop                                     | <https://www.spamcop.net/bl.shtml>                           | DNSBL                  |
| UCEPROTECT szintek 1, 2 és 3                | <https://www.uceprotect.net/en/rblcheck.php>                 | DNSBL                  |
| UCEPROTECT backscatterer.org                 | <https://www.backscatterer.org/>                             | Backscatter védelem    |
| UCEPROTECT whitelisted.org                   | <https://www.whitelisted.org/> (díjköteles)                   | DNSWL                  |

#### IP Eltávolítási Kérelem Űrlapok Szolgáltatónként {#ip-removal-request-forms-by-provider}

Ha az IP címedet egy adott e-mail szolgáltató blokkolta, használd a megfelelő eltávolítási űrlapot vagy az alábbi elérhetőségeket:

| Szolgáltató                            | Eltávolítási űrlap / Kapcsolat                                                                                 | Megjegyzések                                 |
| ------------------------------------- | -------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| Google/Gmail                         | <https://support.google.com/mail/contact/bulk_send_new>                                                        | Tömeges küldő kapcsolatfelvételi űrlap       |
| Microsoft (Outlook/Office 365/Hotmail) | <https://sender.office.com>                                                                                    | Office 365 IP eltávolító portál               |
| Yahoo/AOL/Verizon                    | <https://senders.yahooinc.com/>                                                                                | Yahoo Sender Hub                             |
| Apple/iCloud                       | <https://ipcheck.proofpoint.com/>                                                                              | Az Apple a Proofpoint-et használja IP hírnévhez |
| Proofpoint                         | <https://ipcheck.proofpoint.com/>                                                                              | Proofpoint IP ellenőrzés és eltávolítás      |
| Barracuda Networks                 | <https://www.barracudacentral.org/lookups/lookup-reputation>                                                   | Barracuda hírnév lekérdezés és eltávolítás   |
| Cloudmark                        | <https://csi.cloudmark.com/en/reset/>                                                                          | Cloudmark CSI visszaállítási kérelem          |
| GoDaddy/SecureServer               | <https://unblock.secureserver.net>                                                                             | GoDaddy IP feloldási kérelem űrlap            |
| Comcast/Xfinity                  | <https://spa.xfinity.com/report>                                                                               | Comcast IP eltávolítási kérelem               |
| Charter/Spectrum                 | <https://www.spectrum.net/support/internet/understanding-email-error-codes>                                    | Spectrum támogatás elérése eltávolításhoz    |
| AT&T                               | `abuse_rbl@abuse-att.net`                                                                                      | E-mail eltávolítási kérelemhez                |
| Cox Communications               | `unblock.request@cox.net`                                                                                      | E-mail eltávolítási kérelemhez                |
| CenturyLink/Lumen                | `abuse@centurylink.com`                                                                                        | Cloudfilter használata                        |
| Windstream                       | `abuse@windstream.net`                                                                                         | E-mail eltávolítási kérelemhez                |
| t-online.de (Németország)         | `tobr@rx.t-online.de`                                                                                          | E-mail eltávolítási kérelemhez                |
| Orange France                    | <https://postmaster.orange.fr/>                                                                                | Kapcsolatfelvételi űrlap vagy `abuse@orange.fr` e-mail |
| GMX                             | <https://postmaster.gmx.net/en/contact>                                                                        | GMX postmaster kapcsolatfelvételi űrlap       |
| Mail.ru                         | <https://postmaster.mail.ru/>                                                                                  | Mail.ru postmaster portál                      |
| Yandex                          | <https://postmaster.yandex.ru/>                                                                                | Yandex postmaster portál                       |
| QQ Mail (Tencent)                | <https://open.mail.qq.com/>                                                                                    | QQ Mail fehérlista kérelem (kínai)            |
| Netease (163.com)                | <https://mail.163.com/postmaster/>                                                                             | Netease postmaster portál                      |
| Alibaba/Aliyun/HiChina           | <https://www.alibabacloud.com/help/en/alibaba-mail/>                                                           | Kapcsolat az Alibaba Cloud konzolon keresztül |
| Amazon SES                      | <https://docs.aws.amazon.com/ses/latest/dg/faqs-dnsbls.html>                                                   | AWS SES konzol > Tiltólista eltávolítás       |
| SendGrid                       | <https://support.sendgrid.com/>                                                                                | SendGrid ügyfélszolgálat                       |
| Mimecast                       | <https://community.mimecast.com/>                                                                              | Harmadik féltől származó RBL-ek használata - konkrét RBL kapcsolat |
| Fastmail                       | <https://www.fastmail.com/support/>                                                                            | Fastmail ügyfélszolgálat                       |
| Zoho                           | <https://help.zoho.com/portal/en/kb/campaigns/faqs/campaign-review/articles/how-do-i-delist-my-ip-address>     | Zoho ügyfélszolgálat                           |
| ProtonMail                     | <https://proton.me/support/contact>                                                                            | Proton ügyfélszolgálat                         |
| Tutanota                       | <https://tutanota.com/support>                                                                                 | Tutanota ügyfélszolgálat                       |
| Hushmail                      | <https://www.hushmail.com/support/>                                                                            | Hushmail ügyfélszolgálat                       |
| Mailbox.org                   | <https://mailbox.org/en/support>                                                                               | Mailbox.org ügyfélszolgálat                    |
| Posteo                        | <https://posteo.de/en/site/contact>                                                                            | Posteo ügyfélszolgálat                         |
| DuckDuckGo Email              | <https://duckduckgo.com/email/support>                                                                         | DuckDuckGo ügyfélszolgálat                     |
| Sonic.net                    | <https://www.sonic.com/support>                                                                                | Sonic ügyfélszolgálat                          |
| Telus                        | <https://www.telus.com/en/support>                                                                             | Telus ügyfélszolgálat                          |
| Vodafone Germany             | <https://www.vodafone.de/hilfe/>                                                                               | Vodafone ügyfélszolgálat                       |
| Xtra (Spark NZ)              | <https://www.spark.co.nz/help/>                                                                                | Spark NZ ügyfélszolgálat                       |
| UOL/BOL (Brazília)           | <https://ajuda.uol.com.br/>                                                                                    | UOL ügyfélszolgálat (portugál)                 |
| Libero (Olaszország)          | <https://aiuto.libero.it/>                                                                                     | Libero ügyfélszolgálat (olasz)                 |
| Telenet (Belgium)            | <https://www2.telenet.be/en/support/>                                                                          | Telenet ügyfélszolgálat                        |
| Facebook/WhatsApp            | <https://www.facebook.com/business/help>                                                                       | Facebook üzleti ügyfélszolgálat                 |
| LinkedIn                    | <https://www.linkedin.com/help/linkedin>                                                                       | LinkedIn ügyfélszolgálat                       |
| Groups.io                   | <https://groups.io/helpcenter>                                                                                 | Groups.io ügyfélszolgálat                      |
| Earthlink/Vade Secure       | <https://sendertool.vadesecure.com/en/>                                                                        | Vade Secure küldő eszköz                       |
| Cloudflare Email Security   | <https://www.cloudflare.com/products/zero-trust/email-security/>                                               | Cloudflare ügyfélszolgálat                      |
| Hornetsecurity/Expurgate    | <https://www.hornetsecurity.com/>                                                                              | Hornetsecurity ügyfélszolgálat                  |
| SpamExperts/Antispamcloud   | <https://www.spamexperts.com/>                                                                                 | Hosting szolgáltatón keresztüli kapcsolat      |
| Mail2World                 | <https://www.mail2world.com/support/>                                                                          | Mail2World ügyfélszolgálat                      |
> \[!TIP]
> Kezdjen alacsony mennyiségű, magas minőségű e-mailekkel, hogy pozitív hírnevet építsen ki, mielőtt nagyobb mennyiségben küldene.

> \[!IMPORTANT]
> Ha a domainje szerepel egy feketelistán, minden feketelistának megvan a saját eltávolítási folyamata. Ellenőrizze a weboldalaikat az utasításokért.

> \[!TIP]
> Ha további segítségre van szüksége, vagy úgy találja, hogy tévesen spamként van listázva egy bizonyos e-mail szolgáltató által, kérjük, <a href="/help">lépjen kapcsolatba velünk</a>.

### Mit tegyek, ha spam e-maileket kapok {#what-should-i-do-if-i-receive-spam-emails}

Le kell iratkoznia a levelezőlistáról (ha lehetséges), és le kell tiltania a feladót.

Kérjük, ne jelentsen be üzenetet spamként, hanem továbbítsa azt a kézzel válogatott és adatvédelmi szempontból fókuszált visszaélés-megelőző rendszerünknek.

**A spam továbbítására szolgáló e-mail cím:** <abuse@forwardemail.net>

### Miért jelennek meg a saját magamnak küldött teszt e-mailek a Gmailben „gyanúsként”? {#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious}

Ha ezt a hibaüzenetet látja a Gmailben, amikor magának küld tesztet, vagy amikor az aliasával e-mailt váltó személy először látja az Ön e-mailjét, akkor **kérjük, ne aggódjon** – ez a Gmail beépített biztonsági funkciója.

Egyszerűen kattintson a „Biztonságosnak tűnik” gombra. Például, ha a „küldés másként” funkcióval küldene tesztüzenetet (valaki másnak), akkor ők nem fogják látni ezt az üzenetet.

Ha mégis látják ezt az üzenetet, az azért van, mert általában az <john@gmail.com> címről szoktak e-maileket kapni Öntől, nem pedig a <john@customdomain.com> címről (ez csak egy példa). A Gmail figyelmezteti a felhasználókat, hogy megbizonyosodjon arról, hogy minden biztonságos, nincs megkerülő megoldás.

### Eltávolíthatom a via forwardemail dot net megjelenést a Gmailben? {#can-i-remove-the-via-forwardemail-dot-net-in-gmail}

Ez a téma kapcsolódik egy [széles körben ismert Gmail problémához, ahol extra információ jelenik meg a feladó neve mellett](https://support.google.com/mail/answer/1311182).

2023 májusa óta támogatjuk az SMTP-vel történő e-mail küldést kiegészítőként minden fizetős felhasználó számára – ami azt jelenti, hogy eltávolíthatja a <span class="notranslate">via forwardemail dot net</span> megjelenést a Gmailben.

Vegye figyelembe, hogy ez a GYIK téma kifejezetten azoknak szól, akik a [Hogyan küldjünk levelet Gmail használatával](#how-to-send-mail-as-using-gmail) funkciót használják.

Kérjük, tekintse meg a [Támogatják-e az SMTP-vel történő e-mail küldést](#do-you-support-sending-email-with-smtp) szakaszt a konfigurációs utasításokért.


## Adatkezelés {#data-management}

### Hol találhatók a szervereik? {#where-are-your-servers-located}

> \[!TIP]
> Hamarosan bejelenthetjük az EU adatközpontunk helyszínét, amely a [forwardemail.eu](https://forwardemail.eu) alatt működik. Iratkozzon fel a beszélgetésre a <https://github.com/orgs/forwardemail/discussions/336> címen a frissítésekért.

Szervereink elsősorban Denverben, Colorado államban találhatók – a teljes IP-cím listánkat lásd a <https://forwardemail.net/ips> oldalon.

A feldolgozó alvállalkozóinkról a [GDPR](/gdpr), [DPA](/dpa) és [Adatvédelem](/privacy) oldalainkon tájékozódhat.

### Hogyan exportálhatom és készíthetek biztonsági mentést a postafiókomról? {#how-do-i-export-and-backup-my-mailbox}

Bármikor exportálhatja postafiókjait [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions), [Mbox](https://en.wikipedia.org/wiki/Mbox) vagy titkosított [SQLite](https://en.wikipedia.org/wiki/SQLite) formátumban.

Lépjen a <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Fiókom <i class="fa fa-angle-right"></i> Domain-ek</a> <i class="fa fa-angle-right"></i> Aliasok <i class="fa fa-angle-right"></i> Biztonsági mentés letöltése menüpontra, és válassza ki a kívánt export formátumot.

Az exportálás befejezése után e-mailben kap egy letöltési linket.

Megjegyzés: a biztonsági okokból ez a letöltési link 4 óra után lejár.

Ha meg szeretné tekinteni az exportált EML vagy Mbox formátumokat, ezek az open-source eszközök hasznosak lehetnek:

| Név             | Formátum | Platform      | GitHub URL                                          |
| --------------- | :------: | ------------- | -------------------------------------------------- |
| MBox Viewer     |  Mbox    | Windows       | <https://github.com/eneam/mboxviewer>              |
| mbox-web-viewer |  Mbox    | Minden platform | <https://github.com/PHMRanger/mbox-web-viewer>    |
| EmlReader       |   EML    | Windows       | <https://github.com/ayamadori/EmlReader>           |
| Email viewer    |   EML    | VSCode        | <https://github.com/joelharkes/vscode_email_viewer>|
| eml-reader      |   EML    | Minden platform | <https://github.com/s0ph1e/eml-reader>             |
Additionally if you need to convert a Mbox file to EML file, then you can use <https://github.com/noelmartinon/mboxzilla>.

### Hogyan importáljam és migráljam a meglévő postafiókomat {#how-do-i-import-and-migrate-my-existing-mailbox}

Könnyedén importálhatja az e-mailjeit a Forward Email szolgáltatásba (például [Thunderbird](https://www.thunderbird.net) használatával) az alábbi utasítások szerint:

<div class="alert alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Fontos:
  </strong>
  <span>
    Az e-mailje meglévő importálásához kövesse az alábbi összes lépést.
  </span>
</div>

1. Exportálja az e-mailjeit a meglévő e-mail szolgáltatójától:

   | E-mail szolgáltató | Export formátum                                | Exportálási utasítások                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
   | ------------------ | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | Gmail              | MBOX                                           | <https://takeout.google.com/settings/takeout/custom/gmail>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
   | Outlook            | PST                                            | <div class="alert my-3 alert-danger"><i class="fa fa-info-circle font-weight-bold"></i> <strong class="font-weight-bold">Tipp:</strong> <span>Ha Outlookot használ (<a href="https://support.microsoft.com/en-us/office/back-up-your-email-e5845b0b-1aeb-424f-924c-aa1c33b18833#:~:text=Select%20File%20%3E%20Open%20%26%20Export%20%3E,back%20up%20and%20select%20Next." class="alert-link">PST export formátum</a>), akkor egyszerűen követheti az alábbi "Egyéb" részben található utasításokat. Azonban az alábbi linkeken megtalálja a PST MBOX/EML formátumba konvertálásának lehetőségeit az operációs rendszerének megfelelően:<ul class="mb-0 mt-3"><li><a class="alert-link" href="https://github.com/BaselineIT/Zinkuba/releases/download/release-1.2/Zinkuba.App.exe">Zinkuba Windowsra</a> (<a class="alert-link" href="https://github.com/BaselineIT/Zinkuba?tab=readme-ov-file#zinkuba">GitHub</a>)</li><li><a class="alert-link" href="https://cygwin.com/packages/summary/readpst.html">readpst Windows cygwinhez</a> – (pl. <code>readpst -u -o $OUT_DIR $IN_DIR</code>, ahol a <code>$OUT_DIR</code> és <code>$IN_DIR</code> az output és input könyvtárak elérési útjai).</li><li><a class="alert-link" href="https://manpages.ubuntu.com/manpages/trusty/man1/readpst.1.html">readpst Ubuntu/Linuxhoz</a> – (pl. <code>sudo apt-get install readpst</code>, majd <code>readpst -u -o $OUT_DIR $IN_DIR</code>, ahol a <code>$OUT_DIR</code> és <code>$IN_DIR</code> az output és input könyvtárak elérési útjai).</li><li><a class="alert-link" href="https://formulae.brew.sh/formula/libpst">readpst macOS-hez (brew segítségével)</a> – (pl. <code>brew install libpst</code>, majd <code>readpst -u -o $OUT_DIR $IN_DIR</code>, ahol a <code>$OUT_DIR</code> és <code>$IN_DIR</code> az output és input könyvtárak elérési útjai).</li><li><a class="alert-link" href="https://github.com/juanirm/pst-converter/tree/master?tab=readme-ov-file#pst-converter">PST Converter Windowsra (GitHub)</a></li></ul><br /></span></div> |
   | Apple Mail         | MBOX                                           | <https://support.apple.com/guide/mail/import-or-export-mailboxes-mlhlp1030/mac#apd37a3190755974>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
   | Fastmail           | EML                                            | <https://www.fastmail.help/hc/en-us/articles/360060590573-Download-all-your-data#downloadmail>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
   | Proton Mail        | MBOX/EML                                       | <https://proton.me/support/export-emails-import-export-app>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
   | Tutanota           | EML                                            | <https://github.com/crepererum-oss/tatutanatata>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
   | Gandi              | EML                                            | <https://docs.gandi.net/en/gandimail/common_operations/backup_email.html#contents>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
   | Zoho               | EML                                            | <https://www.zoho.com/mail/help/import-export-emails.html#alink2>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
   | Egyéb              | [Használja a Thunderbirdöt](https://www.thunderbird.net) | Állítsa be meglévő e-mail fiókját a Thunderbirdben, majd használja az [ImportExportTools NG](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/) bővítményt az e-mailek exportálásához és importálásához.  **Lehet, hogy egyszerűen másolással/beillesztéssel vagy húzással is át tudja vinni az e-maileket egyik fiókból a másikba.**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
2. Töltse le, telepítse és nyissa meg a [Thunderbird](https://www.thunderbird.net) programot.

3. Hozzon létre egy új fiókot az alias teljes e-mail címével (pl. <code><you@yourdomain.com></code>) és a generált jelszavával.  <strong>Ha még nincs generált jelszava, akkor <a href="/faq#do-you-support-receiving-email-with-imap" target="_blank">tekintse meg a beállítási útmutatónkat</a></strong>.

4. Töltse le és telepítse a [ImportExportTools NG](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/) Thunderbird bővítményt.

5. Hozzon létre egy új helyi mappát a Thunderbirdben, majd kattintson rá jobb gombbal → válassza az `ImportExportTools NG` opciót → válassza az `Import mbox file` lehetőséget (MBOX export formátum esetén) – vagy – az `Import messages` / `Import all messages from a directory` lehetőséget (EML export formátum esetén).

6. Húzza át a helyi mappából az üzeneteket egy új (vagy meglévő) IMAP mappába a Thunderbirdben, ahová az üzeneteket fel szeretné tölteni az IMAP tárhelyre a szolgáltatásunkkal.  Ez biztosítja, hogy az üzenetek online biztonsági mentésre kerüljenek az SQLite titkosított tárolónkban.

   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tipp:
     </strong>
     <span>
       Ha bizonytalan, hogyan importáljon Thunderbirdbe, akkor hivatkozhat a hivatalos útmutatókra a <a class="alert-link" href="https://kb.mozillazine.org/Importing_folders">https://kb.mozillazine.org/Importing_folders</a> és a <a class="alert-link" href="https://github.com/thunderbird/import-export-tools-ng/wiki">https://github.com/thunderbird/import-export-tools-ng/wiki</a> oldalakon.
     </span>
   </div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Fontos:
  </strong>
  <span>
    Miután befejezte az exportálási és importálási folyamatot, érdemes lehet engedélyezni a továbbítást a meglévő e-mail fiókján, és beállítani egy automatikus válaszadót, amely értesíti a küldőket, hogy új e-mail címe van (pl. ha korábban Gmailt használt, és most egy egyedi domain névvel rendelkező e-mailt használ).
  </span>
</div>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Gratulálunk!
    </strong>
    <span>
      Sikeresen végrehajtotta az összes lépést.
    </span>
  </div>
</div>

### Hogyan használhatom a saját S3-kompatibilis tárolómat biztonsági mentésekhez {#how-do-i-use-my-own-s3-compatible-storage-for-backups}

A fizetős csomagok felhasználói domainenként konfigurálhatják saját [S3](https://en.wikipedia.org/wiki/Amazon_S3)-kompatibilis tárolószolgáltatójukat az IMAP/SQLite biztonsági mentésekhez. Ez azt jelenti, hogy a titkosított postaláda biztonsági mentései a saját infrastruktúrájukon tárolhatók az alapértelmezett tárolónk helyett (vagy mellett).

A támogatott szolgáltatók közé tartozik az [Amazon S3](https://aws.amazon.com/s3/), [Cloudflare R2](https://developers.cloudflare.com/r2/), [MinIO](https://github.com/minio/minio), [Backblaze B2](https://www.backblaze.com/cloud-storage), [DigitalOcean Spaces](https://www.digitalocean.com/products/spaces) és bármely más S3-kompatibilis szolgáltatás.

#### Beállítás {#setup}

1. Hozzon létre egy **privát** tárolót (bucket) az S3-kompatibilis szolgáltatójánál. A tároló nem lehet nyilvánosan elérhető.
2. Hozzon létre hozzáférési adatokat (hozzáférési kulcsazonosító és titkos hozzáférési kulcs) olvasási/írási jogosultsággal a tárolóhoz.
3. Lépjen a <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Saját fiók <i class="fa fa-angle-right"></i> Domain nevek</a> <i class="fa fa-angle-right"></i> Speciális beállítások <i class="fa fa-angle-right"></i> Egyedi S3-kompatibilis tároló oldalra.
4. Jelölje be az **„Egyedi S3-kompatibilis tároló engedélyezése”** opciót, és töltse ki a végpont URL-jét, hozzáférési kulcsazonosítóját, titkos hozzáférési kulcsát, régióját és a tároló nevét.
5. Kattintson a **„Kapcsolat tesztelése”** gombra a hitelesítő adatok, a tároló elérése és az írási jogosultságok ellenőrzéséhez.
6. Kattintson a **„Mentés”** gombra a beállítások alkalmazásához.

#### Hogyan működnek a biztonsági mentések {#how-backups-work}

A biztonsági mentések automatikusan indulnak minden csatlakoztatott IMAP alias esetén. Az IMAP szerver óránként egyszer ellenőrzi az összes aktív kapcsolatot, és biztonsági mentést indít minden csatlakoztatott alias számára. Egy Redis-alapú zárolás megakadályozza, hogy 30 percen belül ismétlődő biztonsági mentések fussanak, és a tényleges biztonsági mentés kihagyásra kerül, ha az elmúlt 24 órában már sikeres mentés történt (kivéve, ha a mentést a felhasználó kifejezetten letöltés céljából kérte).
A biztonsági mentések manuálisan is elindíthatók a műszerfalon bármelyik alias mellett a **"Biztonsági mentés letöltése"** gombra kattintva. A manuális biztonsági mentések mindig lefutnak, függetlenül a 24 órás időablaktól.

A biztonsági mentés folyamata a következő:

1. Az SQLite adatbázis `VACUUM INTO` használatával kerül másolásra, amely megszakítás nélkül hoz létre egy konzisztens pillanatképet, és megőrzi az adatbázis titkosítását.
2. A biztonsági mentés fájl megnyitásával ellenőrzésre kerül, hogy a titkosítás továbbra is érvényes-e.
3. Egy SHA-256 hash kerül kiszámításra és összehasonlításra a tárolt meglévő biztonsági mentéssel. Ha a hash megegyezik, a feltöltés kihagyásra kerül (nincs változás az utolsó mentés óta).
4. A biztonsági mentés az [@aws-sdk/lib-storage](https://github.com/aws/aws-sdk-js-v3/tree/main/lib/lib-storage) könyvtár segítségével multipart feltöltéssel kerül feltöltésre az S3-ra.
5. Egy aláírt letöltési URL (4 órán át érvényes) generálódik és e-mailben elküldésre kerül a felhasználónak.

#### Biztonsági mentési formátumok {#backup-formats}

Három biztonsági mentési formátum támogatott:

| Formátum | Kiterjesztés | Leírás                                                                 |
| -------- | ------------ | --------------------------------------------------------------------- |
| `sqlite` | `.sqlite`    | Nyers titkosított SQLite adatbázis pillanatkép (alapértelmezett automatikus IMAP mentésekhez) |
| `mbox`   | `.zip`       | Jelszóval védett ZIP, amely a postaládát mbox formátumban tartalmazza |
| `eml`    | `.zip`       | Jelszóval védett ZIP, amely egyedi `.eml` fájlokat tartalmaz üzenetenként |

> **Tipp:** Ha rendelkezel `.sqlite` biztonsági mentési fájlokkal és helyben szeretnéd őket `.eml` fájlokká konvertálni, használd önálló CLI eszközünket, a **[convert-sqlite-to-eml](#how-do-i-convert-sqlite-backups-to-eml-files)**-t. Ez Windows, Linux és macOS rendszereken működik, és nem igényel hálózati kapcsolatot.

#### Fájlnév és kulcs szerkezet {#file-naming-and-key-structure}

Egyedi S3 tároló használata esetén a biztonsági mentési fájlok [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601) időbélyeg előtaggal kerülnek tárolásra, így minden mentés külön objektumként megőrződik. Ez teljes biztonsági mentési előzményt biztosít a saját tárolódban.

A kulcs formátuma:

```
{ISO 8601 időbélyeg}-{alias_id}.{kiterjesztés}
```

Például:

```
2025-03-01T12:00:00.000Z-65a31c53c36b75ed685f3fda.sqlite
2025-03-01T12:00:00.000Z-65a31c53c36b75ed685f3fda.zip
2025-03-02T12:00:00.000Z-65a31c53c36b75ed685f3fda.sqlite
```

Az `alias_id` az alias MongoDB ObjectId-ja. Megtalálhatod az alias beállítási oldalán vagy az API-n keresztül.

Alapértelmezett (rendszer) tároló használata esetén a kulcs lapos (pl. `65a31c53c36b75ed685f3fda.sqlite`), és minden mentés felülírja az előzőt.

> **Megjegyzés:** Mivel az egyedi S3 tároló megőrzi az összes biztonsági mentés verziót, a tárolóhasználat idővel növekedni fog. Ajánljuk, hogy konfigurálj [élettartam-szabályokat](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html) a tárolódon, hogy automatikusan lejárjanak a régi mentések (pl. töröld a 30 vagy 90 napnál régebbi objektumokat).

#### Adattulajdon és törlési szabályzat {#data-ownership-and-deletion-policy}

Az egyedi S3 tárolód teljes mértékben a te irányításod alatt áll. Mi **soha nem törlünk vagy módosítunk** fájlokat az egyedi S3 tárolódban — sem alias törléskor, sem domain eltávolításakor, sem bármilyen takarítási művelet során. Csak új biztonsági mentési fájlokat írunk a tárolódba.

Ez azt jelenti:

* **Alias törlés** — Amikor törölsz egy alias-t, csak az alapértelmezett rendszer tárolóból töröljük a biztonsági mentést. Az egyedi S3 tárolóban korábban írt mentések érintetlenek maradnak.
* **Domain eltávolítás** — A domain eltávolítása nem érinti az egyedi tároló fájljait.
* **Megőrzés kezelése** — A tároló kezeléséért, beleértve az élettartam-szabályok beállítását a régi mentések lejáratására, te vagy felelős a saját tárolódban.

Ha letiltod az egyedi S3 tárolót vagy visszaváltasz az alapértelmezett tárolóra, a tárolódban lévő meglévő fájlok megőrződnek. A jövőbeni mentések egyszerűen az alapértelmezett tárolóba kerülnek.

#### Biztonság {#security}

* A hozzáférési kulcsazonosító és titkos kulcs **titkosítva van tároláskor** [AES-256-GCM](https://en.wikipedia.org/wiki/Galois/Counter_Mode) használatával, mielőtt az adatbázisunkba kerülne. Csak futásidőben kerülnek visszafejtésre a biztonsági mentési műveletek során.
* Automatikusan ellenőrizzük, hogy a tárolód **nem nyilvánosan elérhető**. Ha nyilvános tárolót észlelünk, a konfiguráció mentéskor elutasításra kerül. Ha nyilvános hozzáférés észlelhető a mentés idején, visszatérünk az alapértelmezett tárolóra, és e-mailben értesítjük az összes domain adminisztrátort.
* A hitelesítő adatok mentéskor egy [HeadBucket](https://docs.aws.amazon.com/AmazonS3/latest/API/API_HeadBucket.html) hívással kerülnek ellenőrzésre, hogy a tároló létezik és a hitelesítő adatok helyesek-e. Sikertelen ellenőrzés esetén az egyedi S3 tároló automatikusan letiltásra kerül.
* Minden biztonsági mentési fájl tartalmaz egy SHA-256 hash-t az S3 metaadataiban, amelyet az változatlan adatbázisok felismerésére és a felesleges feltöltések kihagyására használunk.
#### Hibajelzések {#error-notifications}

Ha egy mentés sikertelen a saját egyedi S3 tároló használatakor (pl. lejárt hitelesítő adatok vagy kapcsolódási probléma miatt), az összes domain adminisztrátor e-mailben értesítést kap. Ezek az értesítések óránként legfeljebb egyszer küldhetők az ismétlődő riasztások elkerülése érdekében. Ha a mentés idején a vödör nyilvánosan elérhetőnek van észlelve, az adminisztrátorok naponta egyszer kapnak értesítést.

#### API {#api}

Az egyedi S3 tárolót az API-n keresztül is konfigurálhatja:

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

A kapcsolat tesztelése az API-n keresztül:

```sh
curl -X POST https://api.forwardemail.net/v1/domains/example.com/test-s3-connection \
  -u API_TOKEN:
```

### Hogyan konvertálhatom az SQLite mentéseket EML fájlokká {#how-do-i-convert-sqlite-backups-to-eml-files}

Ha letölti vagy tárolja az SQLite mentéseket (akár az alapértelmezett tárolónkból, akár a saját [egyedi S3 vödréből](#how-do-i-use-my-own-s3-compatible-storage-for-backups)), azokat a szabványos `.eml` fájlokká alakíthatja a különálló CLI eszközünkkel, a **[convert-sqlite-to-eml](https://github.com/forwardemail/forwardemail.net/tree/master/tools/convert-sqlite-to-eml)** segítségével. Az EML fájlok bármelyik e-mail klienssel megnyithatók ([Thunderbird](https://www.thunderbird.net/), [Outlook](https://www.microsoft.com/en-us/microsoft-365/outlook/email-and-calendar-software-microsoft-outlook), [Apple Mail](https://support.apple.com/mail) stb.), vagy importálhatók más levelezőszerverekbe.

#### Telepítés {#installation-1}

Letölthet egy előre elkészített binárist (nem szükséges [Node.js](https://github.com/nodejs/node)) vagy futtathatja közvetlenül [Node.js](https://github.com/nodejs/node) segítségével:

**Előre elkészített binárisok** — Töltse le a legfrissebb kiadást a platformjához a [GitHub Releases](https://github.com/forwardemail/forwardemail.net/releases) oldalról:

| Platform | Architektúra  | Fájl                                 |
| -------- | ------------- | ------------------------------------ |
| Linux    | x64           | `convert-sqlite-to-eml-linux-x64`    |
| Linux    | arm64         | `convert-sqlite-to-eml-linux-arm64`  |
| macOS    | Apple Silicon | `convert-sqlite-to-eml-darwin-arm64` |
| Windows  | x64           | `convert-sqlite-to-eml-win-x64.exe`  |

> **macOS felhasználók:** A letöltés után előfordulhat, hogy el kell távolítani a karantén attribútumot a bináris futtatása előtt:
>
> ```bash
> sudo xattr -rd com.apple.quarantine ./convert-sqlite-to-eml-darwin-arm64
> ```
>
> (Cserélje ki a `./convert-sqlite-to-eml-darwin-arm64` részt a letöltött fájl tényleges elérési útjára.)

> **Linux felhasználók:** A letöltés után előfordulhat, hogy futtathatóvá kell tenni a binárist:
>
> ```bash
> chmod +x ./convert-sqlite-to-eml-linux-x64
> ```
>
> (Cserélje ki a `./convert-sqlite-to-eml-linux-x64` részt a letöltött fájl tényleges elérési útjára.)

**Forrásból** ([Node.js](https://github.com/nodejs/node) >= 18 szükséges):

```bash
cd tools/convert-sqlite-to-eml
npm install
node index.js
```

#### Használat {#usage}

Az eszköz támogatja az interaktív és nem interaktív módot is.

**Interaktív mód** — argumentumok nélkül futtatva minden bemenetre kérdez:

```bash
./convert-sqlite-to-eml
```

```
  Forward Email - SQLite mentés konvertálása EML-be
  ================================================

  SQLite mentés fájl elérési útja: /path/to/backup.sqlite
  IMAP/alias jelszó: ********
  Kimeneti ZIP elérési út [/path/to/backup-2025-03-01T12-00-00-000Z.zip]:
```

**Nem interaktív mód** — parancssori kapcsolókkal adhat meg argumentumokat szkriptekhez és automatizáláshoz:

```bash
./convert-sqlite-to-eml \
  --path /path/to/backup.sqlite \
  --password "your-imap-password" \
  --output /path/to/output.zip
```

| Kapcsoló             | Leírás                                                                        |
| -------------------- | ----------------------------------------------------------------------------- |
| `--path <path>`      | Az titkosított SQLite mentés fájl elérési útja                                |
| `--password <pass>`  | IMAP/alias jelszó a dekódoláshoz                                              |
| `--output <path>`    | A ZIP fájl kimeneti elérési útja (alapértelmezett: ISO 8601 időbélyeggel generált) |
| `--help`             | Súgó üzenet megjelenítése                                                     |
#### Kimeneti formátum {#output-format}

Az eszköz egy jelszóval védett ZIP archívumot készít (AES-256 titkosítással), amely tartalmazza:

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

Az EML fájlok a postaláda mappái szerint vannak rendszerezve. A ZIP jelszó megegyezik az IMAP/alias jelszavaddal. Minden `.eml` fájl egy szabványos [RFC 5322](https://datatracker.ietf.org/doc/html/rfc5322) e-mail üzenet teljes fejlécével, törzsszövegével és a SQLite adatbázisból rekonstruált csatolmányokkal.

#### Hogyan működik {#how-it-works}

1. Megnyitja a titkosított SQLite adatbázist az IMAP/alias jelszavaddal (támogatja mind a [ChaCha20](https://en.wikipedia.org/wiki/ChaCha20-Poly1305), mind az [AES-256-CBC](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard) titkosítást).
2. Beolvassa a Mailboxes táblát a mappaszerkezet feltérképezéséhez.
3. Minden üzenethez dekódolja a mimeTree-t (amely [Brotli](https://github.com/google/brotli) tömörítésű JSON formátumban van tárolva) a Messages táblából.
4. Rekonstruálja a teljes EML-t a MIME fa bejárásával és a csatolmányok törzsének lekérésével az Attachments táblából.
5. Mindent egy jelszóval védett ZIP archívumba csomagol a [archiver-zip-encrypted](https://github.com/artem-silaev/archiver-zip-encrypted) segítségével.

### Támogatjátok az önálló üzemeltetést? {#do-you-support-self-hosting}

Igen, 2025 márciusa óta támogatjuk az önálló üzemeltetési lehetőséget. Olvasd el a blogot [itt](https://forwardemail.net/blog/docs/self-hosted-solution). Nézd meg az [önálló üzemeltetési útmutatót](https://forwardemail.net/self-hosted) a kezdéshez. Azok számára, akik részletesebb, lépésről lépésre bontott verziót szeretnének, elérhetőek az [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) és [Debian](https://forwardemail.net/guides/selfhosted-on-debian) alapú útmutatók.


## E-mail beállítás {#email-configuration}

### Hogyan kezdjek hozzá és állítsam be az e-mail továbbítást? {#how-do-i-get-started-and-set-up-email-forwarding}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Becsült beállítási idő:</strong>
  <span>Kevesebb, mint 10 perc</span>
</div>

<div class="alert my-3 alert-success">
  <i class="fa fa-bullhorn font-weight-bold"></i>
  <strong class="font-weight-bold">
    Kezdés:
  </strong>
  <span>
    Figyelmesen olvasd el és kövesd az alábbi egytől nyolcig felsorolt lépéseket. Mindig cseréld ki a <code>user@gmail.com</code> e-mail címet arra az e-mail címre, amelyre továbbítani szeretnéd az üzeneteket (ha még nem pontos). Hasonlóképpen cseréld ki az <code>example.com</code> domaint a saját egyedi domain nevedre (ha még nem pontos).
  </span>
</div>

<ol>
  <li class="mb-2 mb-md-3 mb-lg-5">Ha már regisztráltad a domain neved valahol, akkor ezt a lépést teljesen át kell ugrani, és lépj a második lépésre! Ellenkező esetben <a href="/domain-registration" rel="noopener noreferrer">kattints ide a domain neved regisztrálásához</a>.</li>
  <li class="mb-2 mb-md-3 mb-lg-5">
  Emlékszel, hol regisztráltad a domain neved? Ha igen, akkor kövesd az alábbi utasításokat:

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Fontos:
  </strong>
  <span>
    Nyiss meg egy új fület, és jelentkezz be a domain regisztrátorodhoz. Egyszerűen kattinthatsz az alábbi "Regisztrátor" linkre, hogy automatikusan megnyíljon. Ebben az új fülben navigálj el a DNS kezelő oldalra a regisztrátornál – az alábbi "Lépések a beállításhoz" oszlopban megtalálod a részletes navigációs lépéseket. Miután eljutottál erre az oldalra az új fülön, visszatérhetsz ehhez a fülhöz, és folytathatod a harmadik lépéssel.
    <strong class="font-weight-bold">Ne zárd be még az újonnan megnyitott fület; szükséged lesz rá a további lépésekhez!</strong>
  </span>
</div>

<table id="table-dns-management-by-registrar" class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Regisztrátor</th>
      <th>Lépések a beállításhoz</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://login.ionos.com/">1&amp;1</a></td>
      <td>Jelentkezz be <i class="fa fa-angle-right"></i> Domainközpont <i class="fa fa-angle-right"></i> (Válaszd ki a domained) <i class="fa fa-angle-right"></i> DNS beállítások szerkesztése</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon Route 53</a></td>
      <td>Jelentkezz be <i class="fa fa-angle-right"></i> Hosted Zones <i class="fa fa-angle-right"></i> (Válaszd ki a domained)</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>
      <td>Jelentkezz be <i class="fa fa-angle-right"></i> Saját szerverek <i class="fa fa-angle-right"></i> Domain kezelés <i class="fa fa-angle-right"></i> DNS kezelő</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.bluehost.com/help/article/dns-management-add-edit-or-delete-dns-entries">Bluehost</a></td>
      <td>ROCK: Jelentkezz be <i class="fa fa-angle-right"></i> Domain-ek <i class="fa fa-angle-right"></i> (Kattints a ▼ ikonra a kezelő mellett) <i class="fa fa-angle-right"></i> DNS
      <br />
      LEGACY: Jelentkezz be <i class="fa fa-angle-right"></i> Domain-ek <i class="fa fa-angle-right"></i> Zóna szerkesztő <i class="fa fa-angle-right"></i> (Válaszd ki a domained)</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://dash.cloudflare.com/login">Cloudflare</a></td>
      <td>Jelentkezz be <i class="fa fa-angle-right"></i> DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://cp.dnsmadeeasy.com/">DNS Made Easy</a></td>
      <td>Jelentkezz be <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> (Válaszd ki a domained)</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://dnsimple.com/dashboard">DNSimple</a></td>
      <td>Jelentkezz be <i class="fa fa-angle-right"></i> (Válaszd ki a domained)  <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> Kezelés</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://cloud.digitalocean.com/login">Digital Ocean</a></td>
      <td>Jelentkezz be <i class="fa fa-angle-right"></i> Hálózat <i class="fa fa-angle-right"></i> Domain-ek <i class="fa fa-angle-right"></i> (Válaszd ki a domained) <i class="fa fa-angle-right"></i> Továbbiak <i class="fa fa-angle-right"></i> Domain kezelése</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.domain.com/help/article/dns-management-how-to-update-dns-records">Domain.com</a></td>
      <td>Jelentkezz be <i class="fa fa-angle-right"></i> Kártyanézetben kattints a kezelőre a domainednél <i class="fa fa-angle-right"></i> Listanézetben kattints a fogaskerék ikonra <i class="fa fa-angle-right"></i> DNS és névszerverek <i class="fa fa-angle-right"></i> DNS rekordok</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://www.domains.com/">Domains.com</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=WnU0Gp-Y-es"><i class="fa fa-play-circle"></i> Nézd meg</a>
      </td>
      <td>Jelentkezz be <i class="fa fa-angle-right"></i> (Válaszd ki a domained) <i class="fa fa-angle-right"></i> Kezelés <i class="fa fa-angle-right"></i> (kattints a fogaskerék ikonra) <i class="fa fa-angle-right"></i> Kattints a DNS és névszerverek menüpontra a bal oldali menüben</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://panel.dreamhost.com/">DreamHost</a></td>
      <td>Jelentkezz be <i class="fa fa-angle-right"></i> Panel <i class="fa fa-angle-right"></i> Domain-ek <i class="fa fa-angle-right"></i> Domain kezelése <i class="fa fa-angle-right"></i> DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://portal.dynect.net/login/">Dyn</a></td>
      <td>Jelentkezz be <i class="fa fa-angle-right"></i> Áttekintés <i class="fa fa-angle-right"></i> Kezelés <i class="fa fa-angle-right"></i> Egyszerű szerkesztő <i class="fa fa-angle-right"></i> Rekordok</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://id.gandi.net/en/login">Gandi</a></td>
      <td>Jelentkezz be <i class="fa fa-angle-right"></i> (Válaszd ki a domained) <i class="fa fa-angle-right"></i> Kezelés <i class="fa fa-angle-right"></i> Zóna szerkesztése</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://sso.godaddy.com">GoDaddy</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=G7g8FiZL5D8"><i class="fa fa-play-circle"></i> Nézd meg</a>
      </td>
      <td>Jelentkezz be <i class="fa fa-angle-right"></i> Domainjeim kezelése <i class="fa fa-angle-right"></i> (Válaszd ki a domained) <i class="fa fa-angle-right"></i> DNS kezelése</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://domains.google.com/registrar">Google Domains</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=01iHjbIN5CQ"><i class="fa fa-play-circle"></i> Nézd meg</a>
      </td>
      <td>Jelentkezz be <i class="fa fa-angle-right"></i> (Válaszd ki a domained) <i class="fa fa-angle-right"></i> DNS konfigurálása</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://www.namecheap.com/myaccount/login/">Namecheap</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=no62GCzMn7E"><i class="fa fa-play-circle"></i> Nézd meg</a>
      </td>
      <td>Jelentkezz be <i class="fa fa-angle-right"></i> Domain lista <i class="fa fa-angle-right"></i> (Válaszd ki a domained) <i class="fa fa-angle-right"></i> Kezelés <i class="fa fa-angle-right"></i> Haladó DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://app.netlify.com/">Netlify</a></td>
      <td>Jelentkezz be <i class="fa fa-angle-right"></i> (Válaszd ki a domained) <i class="fa fa-angle-right"></i> Netlify DNS beállítása</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.networksolutions.com/manage-it/index.jsp">Network Solutions</a></td>
      <td>Jelentkezz be <i class="fa fa-angle-right"></i> Fiókkezelő <i class="fa fa-angle-right"></i> Domain neveim <i class="fa fa-angle-right"></i> (Válaszd ki a domained) <i class="fa fa-angle-right"></i> Kezelés <i class="fa fa-angle-right"></i> Domain céljának módosítása <i class="fa fa-angle-right"></i> Haladó DNS</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://accounts.shopify.com/store-login">Shopify</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=G1NR8CIdv2M"><i class="fa fa-play-circle"></i> Nézd meg</a>
      </td>
      <td>Jelentkezz be <i class="fa fa-angle-right"></i> Kezelt domain-ek <i class="fa fa-angle-right"></i> (Válaszd ki a domained) <i class="fa fa-angle-right"></i> DNS beállítások</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://support.squarespace.com/hc/en-us/articles/214767107">Squarespace</a></td>
      <td>Jelentkezz be <i class="fa fa-angle-right"></i> Főmenü <i class="fa fa-angle-right"></i> Beállítások <i class="fa fa-angle-right"></i> Domain-ek <i class="fa fa-angle-right"></i> (Válaszd ki a domained) <i class="fa fa-angle-right"></i>
Haladó beállítások <i class="fa fa-angle-right"></i> Egyedi rekordok</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://vercel.com/docs/now-cli?utm_source=zeit-dashboard&utm_medium=web&utm_campaign=configure-dns#commands/dns">Vercel's Now</a></td>
      <td>"now" CLI használata <i class="fa fa-angle-right"></i> <code>now dns add [domain] '@' MX [record-value] [priority]</code></td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.weebly.com/app/help/us/en/topics/manage-dns-records">Weebly</a></td>
      <td>Jelentkezz be <i class="fa fa-angle-right"></i> Domain oldal <i class="fa fa-angle-right"></i> (Válaszd ki a domained) <i class="fa fa-angle-right"></i> DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://support.wix.com/en/article/adding-dns-records-in-your-wix-account">Wix</a></td>
      <td>Jelentkezz be <i class="fa fa-angle-right"></i> Domain oldal <i class="fa fa-angle-right"></i> (Kattints a <i class="fa fa-ellipsis-h"></i> ikonra) <i class="fa fa-angle-right"></i> Válaszd a DNS rekordok kezelése lehetőséget</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.enom.com/login.aspx?page=%2fmyaccount%2fdefault.aspx&amp;">eNom</a></td>
      <td>Jelentkezz be <i class="fa fa-angle-right"></i> Domain-ek <i class="fa fa-angle-right"></i> Saját domain-ek</td>
    </tr>
    <tr>
      <td>Más</td>
      <td>
        <div class="alert mb-0 alert-warning"><i class="fa fa-exclamation-circle font-weight-bold"></i> <strong class="font-weight-bold">Fontos:</strong> Nem találod a regisztrátorod nevét a listában? Egyszerűen keress rá az interneten a "hogyan változtassuk meg a DNS rekordokat $REGISTRÁTOR-nál" kifejezésre (ahol $REGISTRÁTOR helyére a regisztrátorod nevét írd, pl. "hogyan változtassuk meg a DNS rekordokat GoDaddy-nál", ha GoDaddy-t használsz).</div>
      </td>
    </tr>
  </tbody>
</table>
</li>
<li class="mb-2 mb-md-3 mb-lg-5">A regisztrátorod DNS kezelő oldalán (a másik megnyitott fülön) állítsd be a következő "MX" rekordokat:
<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Fontos:
  </strong>
  <span>
    Vegye figyelembe, hogy NEM lehet más MX rekord beállítva. Mindkét alább látható rekordnak LÉTEZNIE KELL. Győződjön meg róla, hogy nincs elírás; és hogy mind a mx1, mind az mx2 helyesen van írva. Ha már léteztek MX rekordok, kérjük, törölje őket teljesen.
    A "TTL" értéknek nem kell feltétlenül 3600-nak lennie, szükség esetén lehet alacsonyabb vagy magasabb érték is.
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Név/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Típus</th>
      <th>Prioritás</th>
      <th>Válasz/Érték</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", vagy üres</em></td>
      <td class="text-center">3600</td>
      <td>MX</td>
      <td>0</td>
      <td><code>mx1.forwardemail.net</code></td>
    </tr>
    <tr>
      <td><em>"@", ".", vagy üres</em></td>
      <td class="text-center">3600</td>
      <td>MX</td>
      <td>0</td>
      <td><code>mx2.forwardemail.net</code></td>
    </tr>
  </tbody>
</table>

</li><li class="mb-2 mb-md-3 mb-lg-5" id="dns-configuration-options">Használja a regisztrátor DNS kezelő oldalát (a másik megnyitott fülön), és állítsa be a következő <strong class="notranslate">TXT</strong> rekord(oka)t:

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Fontos:
  </strong>
  <span>
    Ha fizetős csomagon van, akkor ezt a lépést teljesen ki kell hagynia, és lépjen az ötödik lépésre! Ha nem fizetős csomagon van, akkor az átirányított címek nyilvánosan kereshetőek lesznek – menjen a <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Saját fiók <i class="fa fa-angle-right"></i> Domain-ek</a> oldalra, és ha szeretné, frissítse a domainjét fizetős csomagra. Ha többet szeretne megtudni a fizetős csomagokról, nézze meg a <a rel="noopener noreferrer" href="/private-business-email" class="alert-link">Árazás</a> oldalunkat. Egyébként folytathatja az alább felsorolt A-tól F-ig terjedő lehetőségek közül egy vagy több kombináció kiválasztásával.
  </span>
</div>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    A lehetőség:
  </strong>
  <span>
    Ha az összes e-mailt a domainjéről (pl. "all@example.com", "hello@example.com" stb.) egy adott címre, például "user@gmail.com"-ra továbbítja:
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Név/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Típus</th>
      <th>Válasz/Érték</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", vagy üres</em></td>
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
    Tipp:
  </strong>
  <span>
    Győződjön meg róla, hogy a fenti "Érték" oszlopban szereplő értékeket a saját e-mail címére cseréli. A "TTL" értéknek nem kell feltétlenül 3600-nak lennie, szükség esetén lehet alacsonyabb vagy magasabb érték is. Az alacsonyabb TTL érték biztosítja, hogy a DNS rekordok jövőbeni változásai gyorsabban terjedjenek el az interneten – gondoljon erre úgy, mint arra, hogy mennyi ideig lesz memóriában (másodpercekben). További információkat talál a <a href="https://en.wikipedia.org/wiki/Time_to_live#DNS_records" rel="noopener noreferrer" target="_blank" class="alert-link">TTL-ről a Wikipédián</a>.
  </span>
</div>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    B lehetőség:
  </strong>
  <span>
    Ha csak egyetlen e-mail címet kell továbbítania (pl. <code>hello@example.com</code> címről <code>user@gmail.com</code> címre; ez automatikusan továbbítja a "hello+test@example.com" címet is "user+test@gmail.com"-ra):
  </span>
</div>
<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Név/Gép/Alias</th>
      <th class="text-center">TTL</th>
      <th>Típus</th>
      <th>Válasz/Érték</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", vagy üres</em></td>
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
    C lehetőség:
  </strong>
  <span>
    Ha több e-mailt továbbítasz, akkor vesszővel kell elválasztanod őket:
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Név/Gép/Alias</th>
      <th class="text-center">TTL</th>
      <th>Típus</th>
      <th>Válasz/Érték</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", vagy üres</em></td>
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
    D lehetőség:
  </strong>
  <span>
    Végtelen számú továbbító e-mailt beállíthatsz – csak ügyelj arra, hogy egy sorban ne legyen több mint 255 karakter, és minden sort "forward-email=" kezdetűvel indíts. Az alábbi példa mutatja:
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Név/Gép/Alias</th>
      <th class="text-center">TTL</th>
      <th>Típus</th>
      <th>Válasz/Érték</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", vagy üres</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=hello:user@gmail.com,support:user@gmail.com</code>
      </td>
    </tr>
    <tr>
      <td><em>"@", ".", vagy üres</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=help:user@gmail.com,foo:user@gmail.com</code>
      </td>
    </tr>
    <tr>
      <td><em>"@", ".", vagy üres</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=orders:user@gmail.com,baz:user@gmail.com</code>
      </td>
    </tr>
    <tr>
      <td><em>"@", ".", vagy üres</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=info:user@gmail.com,beep:user@gmail.com</code>
      </td>
    </tr>
    <tr>
      <td><em>"@", ".", vagy üres</em></td>
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
    E lehetőség:
  </strong>
  <span>
    Megadhatsz egy domain nevet is a <strong class="notranslate">TXT</strong> rekordodban, hogy globális alias továbbítást állíts be (pl. a "user@example.com" továbbítva lesz a "user@example.net" címre):
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Név/Gép/Alias</th>
      <th class="text-center">TTL</th>
      <th>Típus</th>
      <th>Válasz/Érték</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", vagy üres</em></td>
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
    F lehetőség:
  </strong>
  <span>
    Még webhookokat is használhatsz globális vagy egyéni aliasokként az e-mailek továbbításához. Lásd az alábbi példát és a webhookokról szóló teljes szakaszt a <a href="#do-you-support-webhooks" class="alert-link">Támogatjátok a webhookokat?</a> cím alatt.
  </span>
</div>
<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Név/Gép/Alias</th>
      <th class="text-center">TTL</th>
      <th>Típus</th>
      <th>Válasz/Érték</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", vagy üres</em></td>
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
    G opció:
  </strong>
  <span>
    Használhatsz akár reguláris kifejezéseket ("regex") az aliasok egyeztetésére és az e-mailek továbbításának kezelésére. Lásd az alábbi példákat és a teljes regex szakaszt <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">Támogatjátok a reguláris kifejezéseket vagy regexet?</a>.
  </span>
</div>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Haladó regex helyettesítéssel?</strong> Lásd az alábbi példákat és a teljes regex szakaszt <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">Támogatjátok a reguláris kifejezéseket vagy regexet?</a>.
</div>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Egyszerű példa:</strong> Ha azt szeretném, hogy minden `linus@example.com` vagy `torvalds@example.com` címre érkező e-mail továbbítódjon a `user@gmail.com` címre:
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Név/Gép/Alias</th>
      <th class="text-center">TTL</th>
      <th>Típus</th>
      <th>Válasz/Érték</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", vagy üres</em></td>
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
    Fontos:
  </strong>
  <span>
    A catch-all továbbítási szabályokat "átengedő" szabályként is lehet értelmezni.
    Ez azt jelenti, hogy a bejövő e-mailek, amelyek legalább egy konkrét továbbítási szabálynak megfelelnek, azt a szabályt használják a catch-all helyett.
    A konkrét szabályok közé tartoznak az e-mail címek és a reguláris kifejezések.
    <br /><br />
    Például:
    <br />
    <code>forward-email=hello:first@gmail.com,second@gmail.com</code>
    <br />
    Az <code>hello@example.com</code> címre küldött e-mailek **nem** lesznek továbbítva a <code>second@gmail.com</code> (catch-all) címre ezzel a beállítással, hanem csak a <code>first@gmail.com</code> címre érkeznek meg.
  </span>
</div>

---

</li><li class="mb-2 mb-md-3 mb-lg-5">Használd a regisztrátorod DNS kezelő oldalát (a másik megnyitott fülön), és állítsd be a következő <strong class="notranslate">TXT</strong> rekordot is:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Név/Gép/Alias</th>
      <th class="text-center">TTL</th>
      <th>Típus</th>
      <th>Válasz/Érték</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", vagy üres</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>v=spf1 a include:spf.forwardemail.net -all</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Fontos:
  </strong>
  <span>
    Ha Gmailt (pl. Küldés másként) vagy G Suite-ot használsz, akkor a fenti értékhez hozzá kell fűznöd a <code>include:_spf.google.com</code> részt, például:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
  </span>
</div>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tipp:
  </strong>
  <span>
    Ha már van hasonló "v=spf1" sorod, akkor a <code>include:spf.forwardemail.net</code> részt a meglévő "include:host.com" rekordok elé és a sor végén lévő "-all" elé kell beszúrnod, például:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
    <br /><br />
    Fontos különbség van a "-all" és a "~all" között. A "-" azt jelzi, hogy az SPF ellenőrzés HIBÁS lesz, ha nem egyezik, míg a "~" azt, hogy az SPF ellenőrzés SOFTFAIL lesz. Ajánlott a "-all" használata a domain hamisítás megelőzésére.
    <br /><br />
    Előfordulhat, hogy az SPF rekordot a levelező szerveredhez (pl. Outlook) is hozzá kell adnod.
  </span>
</div>
</li><li class="mb-2 mb-md-3 mb-lg-5">Ellenőrizze DNS rekordjait a "Rekordok ellenőrzése" eszközünkkel, amely elérhető a <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Saját fiók <i class="fa fa-angle-right"></i> Domain-ek</a> <i class="fa fa-angle-right"></i> Beállítás menüpont alatt.

</li><li class="mb-2 mb-md-3 mb-lg-5">Küldjön egy teszt e-mailt, hogy megerősítse, működik. Vegye figyelembe, hogy a DNS rekordok terjedése eltarthat egy ideig.

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tipp:
  </strong>
  <span>
  </span>
    Ha nem kap teszt e-maileket, vagy olyan teszt e-mailt kap, amely azt írja, hogy "Legyen óvatos ezzel az üzenettel", akkor nézze meg a válaszokat a <a href="#why-am-i-not-receiving-my-test-emails" class="alert-link">Miért nem kapom meg a teszt e-maileimet</a> és a <a href="#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious" class="alert-link">Miért jelennek meg a Gmailben magamnak küldött teszt e-mailek "gyanúsként"</a> kérdésekre.
</div>

</li><li class="mb-2 mb-md-3 mb-lg-5">Ha szeretne a Gmailből "Levél küldése másként" funkciót használni, akkor <strong><a href="https://www.youtube.com/watch?v=MEheS8gM4Xs" target="_blank" rel="noopener noreferrer">nézze meg ezt a videót</a></strong>, vagy kövesse az alábbi <a href="#how-to-send-mail-as-using-gmail">Levél küldése másként Gmail használatával</a> lépéseit.

</li></ol>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Gratulálunk!
    </strong>
    <span>
      Sikeresen végrehajtotta az összes lépést.
    </span>
  </div>
</div>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tipp:
  </strong>
  <span>
    Az opcionális kiegészítők alább találhatók. Vegye figyelembe, hogy ezek a kiegészítők teljesen opcionálisak, és nem feltétlenül szükségesek. Csak azért adtuk meg őket, hogy szükség esetén további információval szolgáljunk.
  </span>
</div>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Opcionális kiegészítő:
  </strong>
  <span>
    Ha használja a <a class="alert-link" href="#how-to-send-mail-as-using-gmail">Levél küldése másként Gmail használatával</a> funkciót, akkor érdemes lehet felvennie magát egy engedélyezési listára. Erről további információt talál a <a class="alert-link" href="https://support.google.com/a/answer/60752?hl=en" target="_blank" rel="noopener noreferrer">Gmail útmutatójában</a>.
  </span>
</div>

### Használhatok több MX cserehelyet és szervert a fejlett továbbításhoz? {#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding}

Igen, de **DNS rekordjaiban csak egy MX cserehelyet szabad megadnia**.

Ne próbálja meg a "Prioritás" beállítást több MX cserehely konfigurálására használni.

Ehelyett konfigurálnia kell meglévő MX cserehelyét úgy, hogy az összes nem egyező alias leveleit továbbítsa szolgáltatásunk cserehelyeire (`mx1.forwardemail.net` és/vagy `mx2.forwardemail.net`).

Ha Google Workspace-t használ, és szeretné az összes nem egyező alias leveleit szolgáltatásunkhoz továbbítani, akkor nézze meg a <https://support.google.com/a/answer/6297084> oldalt.

Ha Microsoft 365-öt (Outlook) használ, és szeretné az összes nem egyező alias leveleit szolgáltatásunkhoz továbbítani, akkor nézze meg a <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/use-connectors-to-configure-mail-flow/set-up-connectors-to-route-mail> és a <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/manage-mail-flow-for-multiple-locations> oldalakat.

### Hogyan állítsak be szabadságválaszt (irodán kívüli automatikus válaszadó) {#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder}

Lépjen a <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Saját fiók <i class="fa fa-angle-right"></i> Domain-ek</a> <i class="fa fa-angle-right"></i> Aliasok menüpontra, és hozzon létre vagy szerkesszen egy alias-t, amelyhez szabadságválaszt szeretne beállítani.
Lehetőséged van beállítani egy kezdő dátumot, befejező dátumot, tárgyat és üzenetet, valamint bármikor engedélyezni vagy letiltani azt:

* Jelenleg csak egyszerű szöveges tárgy és üzenet támogatott (belsejében a `striptags` csomagot használjuk az esetleges HTML eltávolítására).
* A tárgy legfeljebb 100 karakter hosszú lehet.
* Az üzenet legfeljebb 1000 karakter hosszú lehet.
* A beállításhoz szükséges a kimenő SMTP konfiguráció (pl. be kell állítanod a DKIM, DMARC és Return-Path DNS rekordokat).
  * Lépj a <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Saját fiók <i class="fa fa-angle-right"></i> Domain-ek</a> <i class="fa fa-angle-right"></i> Beállítások <i class="fa fa-angle-right"></i> Kimenő SMTP konfiguráció oldalra, és kövesd a beállítási utasításokat.
* A szabadságválaszoló nem engedélyezhető globális vanity domain neveken (pl. a [eldobható címek](/disposable-addresses) nem támogatottak).
* A szabadságválaszoló nem engedélyezhető wildcard/catch-all (`*`) vagy reguláris kifejezéseket tartalmazó aliasokra.

Ellentétben olyan levelezőrendszerekkel, mint a `postfix` (pl. amelyek a `sieve` szabadság szűrő kiterjesztést használják) – a Forward Email automatikusan hozzáadja a DKIM aláírásodat, megbízhatóan kezeli a kapcsolat problémákat a szabadságválaszok küldésekor (pl. gyakori SSL/TLS kapcsolat problémák és régebbi szerverek esetén), és még támogatja az Open WKD és PGP titkosítást is a szabadságválaszokhoz.

<!--
* A visszaélések megelőzése érdekében minden elküldött szabadságválasz üzenet után 1 kimenő SMTP kredit kerül levonásra.
  * Minden fizetős fiók alapértelmezés szerint napi 300 kreditet tartalmaz. Ha nagyobb mennyiségre van szükséged, kérjük, lépj kapcsolatba velünk.
-->

1. Csak egyszer küldünk minden [engedélyezett](#do-you-have-an-allowlist) feladónak 4 naponta (ami hasonló a Gmail viselkedéséhez).

   * Redis gyorsítótárunk az `alias_id` és `sender` ujjlenyomatát használja, ahol az `alias_id` az alias MongoDB azonosítója, a `sender` pedig vagy a Feladó címe (ha engedélyezett), vagy a Feladó címének gyökér domainje (ha nem engedélyezett). Egyszerűség kedvéért ennek az ujjlenyomatnak a lejárati ideje a gyorsítótárban 4 napra van állítva.

   * Az a megközelítés, hogy a nem engedélyezett feladók esetén a Feladó címében elemzett gyökér domaint használjuk, megakadályozza, hogy viszonylag ismeretlen feladók (pl. rosszindulatú szereplők) túlterheljék a szabadságválaszoló üzeneteket.

2. Csak akkor küldünk, ha a MAIL FROM és/vagy a Feladó nem üres, és nem tartalmaz (kis- és nagybetűtől függetlenül) [postmaster felhasználónevet](#what-are-postmaster-addresses) (az emailben az @ előtti részt).

3. Nem küldünk, ha az eredeti üzenet tartalmazta az alábbi fejlécet (kis- és nagybetűtől függetlenül):

   * `auto-submitted` fejléc, amely értéke nem `no`.
   * `x-auto-response-suppress` fejléc, amely értéke `dr`, `autoreply`, `auto-reply`, `auto_reply` vagy `all`.
   * `list-id`, `list-subscribe`, `list-unsubscribe`, `list-help`, `list-post`, `list-owner`, `list-archive`, `x-autoreply`, `x-autorespond` vagy `x-auto-respond` fejléc (értéktől függetlenül).
   * `precedence` fejléc, amely értéke `bulk`, `autoreply`, `auto-reply`, `auto_reply` vagy `list`.

4. Nem küldünk, ha a MAIL FROM vagy a Feladó email cím `+donotreply`, `-donotreply`, `+noreply` vagy `-noreply` végződésű.

5. Nem küldünk, ha a Feladó email cím felhasználó része `mdaemon` volt, és tartalmazott egy kis- és nagybetűtől független `X-MDDSN-Message` fejlécet.

6. Nem küldünk, ha volt kis- és nagybetűtől független `content-type` fejléc `multipart/report` értékkel.

### Hogyan állítsam be az SPF-et a Forward Emailhez {#how-do-i-set-up-spf-for-forward-email}

A regisztrátorod DNS kezelő oldalán állítsd be a következő <strong class="notranslate">TXT</strong> rekordot:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Név/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Típus</th>
      <th>Válasz/Érték</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", vagy üres</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>v=spf1 a include:spf.forwardemail.net -all</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Fontos:
  </strong>
  <span>
    Ha Gmailt (pl. Küldés másként) vagy G Suite-ot használsz, akkor a fenti értékhez hozzá kell fűznöd az <code>include:_spf.google.com</code> részt, például:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
  </span>
</div>
<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Fontos:
  </strong>
  <span>
    Ha Microsoft Outlookot vagy Live.com-ot használ, hozzá kell adnia az <code>include:spf.protection.outlook.com</code> elemet az SPF <strong class="notranslate">TXT</strong> rekordjához, például:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:spf.protection.outlook.com -all</code>
  </span>
</div>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tipp:
  </strong>
  <span>
    Ha már van hasonló "v=spf1" sor, akkor az <code>include:spf.forwardemail.net</code> elemet az összes meglévő "include:host.com" rekord elé és a "-all" elé ugyanabban a sorban kell beszúrni, például:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
    <br /><br />
    Vegye figyelembe, hogy különbség van a "-all" és a "~all" között. A "-" azt jelzi, hogy az SPF ellenőrzésnek MEG KELL SIKERÜLNIE, különben HIBÁZIK, míg a "~" azt jelzi, hogy az SPF ellenőrzés SOFTFAIL lesz. Ajánljuk a "-all" használatát a domain hamisítás megelőzésére.
    <br /><br />
    Előfordulhat, hogy az SPF rekordot a levelet küldő hosztra (pl. Outlook) is be kell illeszteni.
  </span>
</div>

### Hogyan állítsam be a DKIM-et a Forward Emailhez {#how-do-i-set-up-dkim-for-forward-email}

Lépjen a <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Fiókom <i class="fa fa-angle-right"></i> Domainjeim</a> <i class="fa fa-angle-right"></i> Beállítások <i class="fa fa-angle-right"></i> Kimenő SMTP konfiguráció menüpontra, és kövesse a beállítási utasításokat.

### Hogyan állítsam be a DMARC-ot a Forward Emailhez {#how-do-i-set-up-dmarc-for-forward-email}

Lépjen a <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Fiókom <i class="fa fa-angle-right"></i> Domainjeim</a> <i class="fa fa-angle-right"></i> Beállítások <i class="fa fa-angle-right"></i> Kimenő SMTP konfiguráció menüpontra, és kövesse a beállítási utasításokat.

### Hogyan tekinthetem meg a DMARC jelentéseket {#how-do-i-view-dmarc-reports}

A Forward Email átfogó DMARC jelentés kezelőfelületet biztosít, amely lehetővé teszi, hogy egyetlen felületen figyelje az összes domainje e-mail hitelesítési teljesítményét.

**Mik azok a DMARC jelentések?**

A DMARC (Domain-based Message Authentication, Reporting, and Conformance) jelentések XML fájlok, amelyeket a fogadó levelezőszerverek küldenek, és tájékoztatnak arról, hogyan hitelesítik az e-mailjeit. Ezek a jelentések segítenek megérteni:

* Hány e-mailt küldenek a domainjéről
* Átmennek-e ezek az e-mailek SPF és DKIM hitelesítésen
* Milyen intézkedéseket tesznek a fogadó szerverek (elfogadás, karantén, elutasítás)
* Mely IP-címek küldenek e-mailt a domainje nevében

**Hogyan férhetek hozzá a DMARC jelentésekhez**

Lépjen a <a href="/my-account/dmarc-reports" class="alert-link" target="_blank" rel="noopener noreferrer">Fiókom <i class="fa fa-angle-right"></i> DMARC jelentések</a> oldalra a kezelőfelület megtekintéséhez. Domainenkénti jelentésekhez a <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Fiókom <i class="fa fa-angle-right"></i> Domainjeim</a> oldalon kattintson a "DMARC" gombra bármely domain mellett.

**A kezelőfelület funkciói**

A DMARC jelentések kezelőfelülete a következőket nyújtja:

* **Összefoglaló mutatók**: Összes beérkezett jelentés, elemzett üzenetek száma, SPF illeszkedési arány, DKIM illeszkedési arány és általános sikerességi arány
* **Üzenetek időbeli alakulása diagram**: Az elmúlt 30 nap e-mail mennyiségének és hitelesítési arányainak vizuális trendje
* **Illeszkedési összefoglaló**: Kördiagram az SPF és DKIM illeszkedés megoszlásáról
* **Üzenetkezelés**: Halmozott oszlopdiagram arról, hogyan kezelte a fogadó szerver az e-maileket (elfogadva, karanténba helyezve vagy elutasítva)
* **Legutóbbi jelentések táblázata**: Részletes lista az egyéni DMARC jelentésekről szűréssel és lapozással
* **Domain szűrés**: Szűrje a jelentéseket adott domain szerint, ha több domaint kezel
**Miért Fontos Ez**

Több domaint kezelő szervezetek számára (például vállalatok, non-profit szervezetek vagy ügynökségek) a DMARC jelentések elengedhetetlenek a következőkhöz:

* **Jogtalan küldők azonosítása**: Felismerni, ha valaki a domained nevében hamisít
* **Kézbesíthetőség javítása**: Biztosítani, hogy a jogos e-mailek átmenjenek az hitelesítésen
* **E-mail infrastruktúra figyelése**: Követni, mely szolgáltatások és IP-címek küldenek a nevedben
* **Megfelelőség**: Átláthatóság fenntartása az e-mail hitelesítésben biztonsági auditokhoz

Ellentétben más szolgáltatásokkal, amelyek külön DMARC figyelő eszközöket igényelnek, a Forward Email tartalmazza a DMARC jelentések feldolgozását és megjelenítését az fiókod részeként, további költség nélkül.

**Követelmények**

* A DMARC jelentések csak fizetős csomagokhoz érhetők el
* A domainednek DMARC konfiguráltnak kell lennie (lásd [Hogyan állítsam be a DMARC-ot a Forward Emailhez](#how-do-i-set-up-dmarc-for-forward-email))
* A jelentések automatikusan gyűjtődnek, amikor a fogadó levelezőszerverek elküldik azokat a beállított DMARC jelentési címre

**Heti E-mail Jelentések**

A fizetős csomagok felhasználói automatikusan heti DMARC jelentés összefoglalókat kapnak e-mailben. Ezek az e-mailek tartalmazzák:

* Összefoglaló statisztikák az összes domainedről
* SPF és DKIM igazodási arányok
* Üzenet státusz bontás (elfogadott, karanténba helyezett, elutasított)
* Legtöbb jelentést küldő szervezetek (Google, Microsoft, Yahoo, stb.)
* IP-címek, amelyeknél igazodási problémák lehetnek, és figyelmet igényelhetnek
* Közvetlen linkek a DMARC Jelentések irányítópultjához

A heti jelentések automatikusan érkeznek, és nem kapcsolhatók ki külön az egyéb e-mail értesítésektől.

### Hogyan csatlakoztassam és konfiguráljam a kapcsolataimat {#how-do-i-connect-and-configure-my-contacts}

**A kapcsolatok konfigurálásához használd a következő CardDAV URL-t:** `https://carddav.forwardemail.net` (vagy egyszerűen `carddav.forwardemail.net`, ha az ügyfeled ezt engedi)

### Hogyan csatlakoztassam és konfiguráljam a naptáraimat {#how-do-i-connect-and-configure-my-calendars}

**A naptár konfigurálásához használd a következő CalDAV URL-t:** `https://caldav.forwardemail.net` (vagy egyszerűen `caldav.forwardemail.net`, ha az ügyfeled ezt engedi)

<img width="612" height="520" src="/img/faq/calendar-setup.png" alt="Forward Email Calendar CalDAV Thunderbird Example Setup" />

### Hogyan adjak hozzá több naptárt és kezeljem a meglévő naptárakat {#how-do-i-add-more-calendars-and-manage-existing-calendars}

Ha további naptárakat szeretnél hozzáadni, egyszerűen adj hozzá egy új naptár URL-t: `https://caldav.forwardemail.net/dav/principals/calendar-name` (**ne felejtsd el a `calendar-name` részt a kívánt naptár nevére cserélni**)

A naptár nevét és színét a létrehozás után is megváltoztathatod – csak használd a kedvenc naptár alkalmazásodat (pl. Apple Mail vagy [Thunderbird](https://thunderbird.net)).

### Hogyan csatlakoztassam és konfiguráljam a feladatokat és emlékeztetőket {#how-do-i-connect-and-configure-tasks-and-reminders}

**A feladatok és emlékeztetők konfigurálásához használd ugyanazt a CalDAV URL-t, mint a naptárakhoz:** `https://caldav.forwardemail.net` (vagy egyszerűen `caldav.forwardemail.net`, ha az ügyfeled ezt engedi)

A feladatok és emlékeztetők automatikusan elkülönülnek a naptári eseményektől, saját "Emlékeztetők" vagy "Feladatok" naptár gyűjteménybe.

**Beállítási útmutató platformonként:**

**macOS/iOS:**

1. Adj hozzá egy új CalDAV fiókot a Rendszerbeállítások > Internetes fiókok menüben (vagy Beállítások > Fiókok iOS-en)
2. Használd a `caldav.forwardemail.net` szervert
3. Add meg a Forward Email aliasodat és a generált jelszót
4. A beállítás után megjelenik mind a "Naptár", mind az "Emlékeztetők" gyűjtemény
5. Használd az Emlékeztetők alkalmazást a feladatok létrehozásához és kezeléséhez

**Android Tasks.org alkalmazással:**

1. Telepítsd a Tasks.org alkalmazást a Google Play Áruházból vagy F-Droidból
2. Menj a Beállítások > Szinkronizáció > Fiók hozzáadása > CalDAV menübe
3. Add meg a szervert: `https://caldav.forwardemail.net`
4. Add meg a Forward Email aliasodat és a generált jelszót
5. A Tasks.org automatikusan megtalálja a feladat naptárakat

**Thunderbird:**

1. Telepítsd a Lightning bővítményt, ha még nincs telepítve
2. Hozz létre egy új naptárat "CalDAV" típusúként
3. Használd az URL-t: `https://caldav.forwardemail.net`
4. Add meg a Forward Email hitelesítő adataidat
5. Az események és feladatok is elérhetők lesznek a naptár felületen

### Miért nem tudok feladatokat létrehozni a macOS Emlékeztetők alkalmazásban {#why-cant-i-create-tasks-in-macos-reminders}
Ha problémáid vannak feladatok létrehozásával a macOS Emlékeztetők alkalmazásban, próbáld ki az alábbi hibaelhárítási lépéseket:

1. **Fiók beállításának ellenőrzése**: Győződj meg róla, hogy a CalDAV fiókod megfelelően van konfigurálva a `caldav.forwardemail.net` címmel

2. **Külön naptárak ellenőrzése**: Látnod kell mind a „Naptár”, mind az „Emlékeztetők” elemet a fiókodban. Ha csak a „Naptár” látható, akkor a feladattámogatás még nem aktiválódott teljesen.

3. **Fiók frissítése**: Próbáld meg eltávolítani, majd újra hozzáadni a CalDAV fiókodat a Rendszerbeállítások > Internetes fiókok menüben

4. **Szerverkapcsolat ellenőrzése**: Teszteld, hogy el tudod-e érni a `https://caldav.forwardemail.net` címet a böngésződben

5. **Hitelesítő adatok ellenőrzése**: Győződj meg róla, hogy a helyes alias e-mail címet és a generált jelszót használod (nem a fiók jelszavát)

6. **Szinkronizálás kényszerítése**: Az Emlékeztetők alkalmazásban próbálj meg létrehozni egy feladatot, majd manuálisan frissíteni a szinkront

**Gyakori problémák:**

* **„Emlékeztető naptár nem található”**: A szervernek eltarthat egy pillanatig, amíg az első hozzáféréskor létrehozza az Emlékeztetők gyűjteményt
* **Feladatok nem szinkronizálódnak**: Ellenőrizd, hogy mindkét eszköz ugyanazt a CalDAV fiók hitelesítő adatokat használja
* **Vegyes tartalom**: Győződj meg róla, hogy a feladatokat az „Emlékeztetők” naptárban hozod létre, nem az általános „Naptár”-ban

### Hogyan állítsam be a Tasks.org alkalmazást Androidon {#how-do-i-set-up-tasksorg-on-android}

A Tasks.org egy népszerű, nyílt forráskódú feladatkezelő, amely kiválóan működik a Forward Email CalDAV feladattámogatásával.

**Telepítés és beállítás:**

1. **Tasks.org telepítése**:
   * Google Play Áruházból: [Tasks.org](https://play.google.com/store/apps/details?id=org.tasks)
   * F-Droidról: [Tasks.org az F-Droidon](https://f-droid.org/packages/org.tasks/)

2. **CalDAV szinkronizáció beállítása**:
   * Nyisd meg a Tasks.org-ot
   * Menj a ☰ Menü > Beállítások > Szinkronizáció menüpontra
   * Koppints az „Fiók hozzáadása” gombra
   * Válaszd a „CalDAV” lehetőséget

3. **Forward Email beállításainak megadása**:
   * **Szerver URL**: `https://caldav.forwardemail.net`
   * **Felhasználónév**: A Forward Email aliasod (pl. `te@domained.hu`)
   * **Jelszó**: Az aliashoz generált jelszó
   * Koppints az „Fiók hozzáadása” gombra

4. **Fiók felfedezése**:
   * A Tasks.org automatikusan megtalálja a feladatnaptáraidat
   * Látnod kell az „Emlékeztetők” gyűjteményt
   * Koppints a „Feliratkozás” gombra a feladatnaptár szinkronizálásának engedélyezéséhez

5. **Szinkronizáció tesztelése**:
   * Hozz létre egy tesztfeladatot a Tasks.org-ban
   * Ellenőrizd, hogy megjelenik-e más CalDAV kliensekben (például macOS Emlékeztetők)
   * Győződj meg róla, hogy a változások kétirányúan szinkronizálódnak

**Elérhető funkciók:**

* ✅ Feladat létrehozása és szerkesztése
* ✅ Határidők és emlékeztetők
* ✅ Feladatok teljesítése és állapota
* ✅ Prioritási szintek
* ✅ Alkategóriák és feladathierarchia
* ✅ Címkék és kategóriák
* ✅ Kétirányú szinkronizáció más CalDAV kliensekkel

**Hibaelhárítás:**

* Ha nem jelennek meg feladatnaptárak, próbáld meg manuálisan frissíteni a Tasks.org beállításaiban
* Győződj meg róla, hogy legalább egy feladat létre van hozva a szerveren (először létrehozhatsz egyet a macOS Emlékeztetőkben)
* Ellenőrizd a hálózati kapcsolatot a `caldav.forwardemail.net` címmel

### Hogyan állítsam be az SRS-t a Forward Emailhez {#how-do-i-set-up-srs-for-forward-email}

Az [Sender Rewriting Scheme](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme) („SRS”) automatikusan be van állítva – neked nem kell ezt külön megtenned.

### Hogyan állítsam be az MTA-STS-t a Forward Emailhez {#how-do-i-set-up-mta-sts-for-forward-email}

Kérjük, tekintsd meg [az MTA-STS-ről szóló szakaszunkat](#do-you-support-mta-sts) további információkért.

### Hogyan adjak profilképet az e-mail címemhez {#how-do-i-add-a-profile-picture-to-my-email-address}

Ha Gmailt használsz, kövesd az alábbi lépéseket:

1. Lépj a <https://google.com> oldalra, és jelentkezz ki minden e-mail fiókból
2. Kattints a „Bejelentkezés” gombra, majd a legördülő menüből válaszd az „egyéb fiók” lehetőséget
3. Válaszd az „Egy másik fiók használata” opciót
4. Válaszd a „Fiók létrehozása” lehetőséget
5. Válaszd a „Jelenlegi e-mail címem használata helyette” opciót
6. Add meg a saját domaines e-mail címedet
7. Vedd át a megerősítő e-mailt, amit erre a címre küldtek
8. Írd be a megerősítő kódot az e-mailből
9. Töltsd ki az új Google fiókod profiladatait
10. Fogadd el az összes Adatvédelmi és Használati feltételt
11. Lépj vissza a <https://google.com> oldalra, a jobb felső sarokban kattints a profil ikonodra, majd a „módosítás” gombra
12. Tölts fel egy új képet vagy avatárt a fiókodhoz
13. A változások körülbelül 1-2 órán belül érvénybe lépnek, de néha nagyon gyorsan is megtörténhetnek
14. Küldj egy teszt e-mailt, és a profilképnek meg kell jelennie.
## Haladó funkciók {#advanced-features}

### Támogatjátok a hírleveleket vagy marketing célú levelezőlistákat? {#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email}

Igen, bővebben olvashatsz róla a <https://forwardemail.net/guides/newsletter-with-listmonk> oldalon.

Kérjük, vedd figyelembe, hogy az IP-hírnév megőrzése és a kézbesíthetőség biztosítása érdekében a Forward Email kézi felülvizsgálati folyamatot alkalmaz domainenként a **hírlevél jóváhagyásához**. Küldj e-mailt a <support@forwardemail.net> címre vagy nyiss egy [segítségkérést](https://forwardemail.net/help) a jóváhagyáshoz. Ez általában kevesebb, mint 24 órát vesz igénybe, a legtöbb kérés 1-2 órán belül teljesül. A közeljövőben célunk, hogy ezt a folyamatot azonnalivá tegyük további spam-ellenőrzésekkel és riasztásokkal. Ez a folyamat biztosítja, hogy az e-mailek eljussanak a beérkező levelek közé, és az üzenetek ne kerüljenek spamként megjelölésre.

### Támogatjátok az e-mailek küldését API-n keresztül? {#do-you-support-sending-email-with-api}

Igen, 2023 májusa óta támogatjuk az e-mailek küldését API-n keresztül, mint kiegészítő szolgáltatást minden fizetős felhasználó számára.

<div class="alert my-3 alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Fontos:
  </strong>
  <span>
    Kérjük, győződj meg róla, hogy elolvastad a <a href="/terms" class="alert-link" target="_blank">Felhasználási feltételeinket</a>, az <a href="/privacy" class="alert-link" target="_blank">Adatvédelmi irányelveinket</a>, valamint az <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">SMTP-korlátokat</a> – a használatoddal ezek elfogadását és tudomásul vételét jelented.
  </span>
</div>

Kérjük, tekintsd meg az API dokumentációnk [E-mailek](/email-api#outbound-emails) szakaszát a lehetőségek, példák és további információk érdekében.

Az API-n keresztüli kimenő e-mail küldéshez használd az [Saját biztonságom](/my-account/security) alatt elérhető API tokenedet.

### Támogatjátok az e-mailek fogadását IMAP-on keresztül? {#do-you-support-receiving-email-with-imap}

Igen, 2023. október 16-tól támogatjuk az e-mailek fogadását IMAP-on keresztül, mint kiegészítő szolgáltatást minden fizetős felhasználó számára.  **Kérjük, olvasd el részletes cikkünket** arról, [hogyan működik a titkosított SQLite postafiók tárolási funkciónk](/blog/docs/best-quantum-safe-encrypted-email-service).

<div id="imap-instructions">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Fontos:
  </strong>
  <span>
    Kérjük, győződj meg róla, hogy elolvastad a <a href="/terms" class="alert-link" target="_blank">Felhasználási feltételeinket</a> és az <a href="/privacy" class="alert-link" target="_blank">Adatvédelmi irányelveinket</a> – a használatoddal ezek elfogadását és tudomásul vételét jelented.
  </span>
</div>

1. Hozz létre egy új alias-t a domainedhez a <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Saját fiók <i class="fa fa-angle-right"></i> Domain-ek</a> <i class="fa fa-angle-right"></i> Aliasok alatt (pl. <code><hello@example.com></code>)

2. Kattints a <strong class="text-success"><i class="fa fa-key"></i> Jelszó generálása</strong> gombra az újonnan létrehozott alias mellett. Másold a vágólapodra, és biztonságosan tárold a képernyőn megjelenő jelszót.

3. A kedvenc e-mail alkalmazásodban adj hozzá vagy konfigurálj egy fiókot az új alias-szal (pl. <code><hello@example.com></code>)
   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tipp:
     </strong>
     <span>Ajánljuk a <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, a <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, az <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a> vagy <a href="/blog/open-source" class="alert-link" target="_blank">egy nyílt forráskódú és adatvédelmi szempontból fókuszált alternatíva</a> használatát.</span>
   </div>

4. Amikor az IMAP szerver nevét kéri, írd be: `imap.forwardemail.net`

5. Amikor az IMAP szerver portját kéri, írd be: `993` (SSL/TLS) – szükség esetén lásd az [alternatív IMAP portokat](/faq#what-are-your-imap-server-configuration-settings)
   <div class="alert my-3 alert-warning">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tipp:
     </strong>
     <span>Ha Thunderbird-öt használsz, győződj meg róla, hogy a "Kapcsolat biztonsága" "SSL/TLS"-re van állítva, az "Hitelesítési mód" pedig "Normál jelszó".</span>
   </div>
6. Amikor az IMAP szerver jelszavát kéri, illessze be a jelszót a fenti 2. lépésben található <strong class="text-success"><i class="fa fa-key"></i> Jelszó generálása</strong> gombbal

7. **Mentse el a beállításokat** – ha problémái vannak, kérjük, <a href="/help">lépjen kapcsolatba velünk</a>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Gratulálunk!
    </strong>
    <span>
      Sikeresen végrehajtotta az összes lépést.
    </span>
  </div>
</div>

</div>

### Támogatják a POP3-at? {#do-you-support-pop3}

Igen, 2023. december 4-től minden fizetős felhasználó számára elérhető kiegészítőként támogatjuk a [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol) protokollt. **Kérjük, olvassa el részletes cikkünket** arról, [hogyan működik a titkosított SQLite leveleződoboz tárolási funkciónk](/blog/docs/best-quantum-safe-encrypted-email-service).

<div id="pop3-instructions">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Fontos:
  </strong>
  <span>
    Kérjük, győződjön meg róla, hogy elolvasta a <a href="/terms" class="alert-link" target="_blank">Felhasználási feltételeinket</a> és az <a href="/privacy" class="alert-link" target="_blank">Adatvédelmi irányelveinket</a> – a használatával elfogadja és egyetért azokkal.
  </span>
</div>

1. Hozzon létre egy új alias-t a domainje alatt a <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Saját fiók <i class="fa fa-angle-right"></i> Domain-ek</a> <i class="fa fa-angle-right"></i> Aliasok menüpontban (pl. <code><hello@example.com></code>)

2. Kattintson a frissen létrehozott alias mellett található <strong class="text-success"><i class="fa fa-key"></i> Jelszó generálása</strong> gombra. Másolja a vágólapra, és biztonságosan tárolja a képernyőn megjelenő jelszót.

3. A kedvenc levelezőprogramjában adjon hozzá vagy konfiguráljon egy fiókot az új alias-szal (pl. <code><hello@example.com></code>)
   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tipp:
     </strong>
     <span>Ajánljuk a <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, a <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, az <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a> vagy <a href="/blog/open-source" class="alert-link" target="_blank">egy nyílt forráskódú és adatvédelmi szempontból előnyös alternatíva</a> használatát.</span>
   </div>

4. Amikor a POP3 szerver nevét kéri, írja be: `pop3.forwardemail.net`

5. Amikor a POP3 szerver portját kéri, írja be: `995` (SSL/TLS) – szükség esetén lásd az [alternatív POP3 portokat](/faq#what-are-your-pop3-server-configuration-settings)
   <div class="alert my-3 alert-warning">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tipp:
     </strong>
     <span>Ha Thunderbirdöt használ, győződjön meg róla, hogy a "Kapcsolat biztonsága" "SSL/TLS"-re van állítva, az "Hitelesítési mód" pedig "Normál jelszó".</span>
   </div>

6. Amikor a POP3 szerver jelszavát kéri, illessze be a fenti 2. lépésben található <strong class="text-success"><i class="fa fa-key"></i> Jelszó generálása</strong> gombbal létrehozott jelszót

7. **Mentse el a beállításokat** – ha problémái vannak, kérjük, <a href="/help">lépjen kapcsolatba velünk</a>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Gratulálunk!
    </strong>
    <span>
      Sikeresen végrehajtotta az összes lépést.
    </span>
  </div>
</div>

</div>

### Támogatják a naptárakat (CalDAV)? {#do-you-support-calendars-caldav}

Igen, 2024. február 5-től elérhető ez a funkció. A szerverünk címe `caldav.forwardemail.net`, és elérhető a <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">állapotoldalunkon</a> is.
Támogatja mind az IPv4-et, mind az IPv6-ot, és elérhető a `443` porton (HTTPS).

| Bejelentkezés | Példa                     | Leírás                                                                                                                                                                                   |
| ------------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Felhasználónév | `user@example.com`        | Egy alias e-mail címe, amely létezik a domainhez a <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Saját fiók <i class="fa fa-angle-right"></i> Domain-ek</a> alatt. |
| Jelszó        | `************************` | Alias-specifikus generált jelszó.                                                                                                                                                        |

A naptártámogatás használatához a **felhasználónévnek** az alias e-mail címének kell lennie, amely létezik a domainhez a <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Saját fiók <i class="fa fa-angle-right"></i> Domain-ek</a> alatt – és a **jelszónak** alias-specifikus generált jelszónak kell lennie.

### Támogatják a feladatokat és emlékeztetőket (CalDAV VTODO) {#do-you-support-tasks-and-reminders-caldav-vtodo}

Igen, 2025. október 14-től hozzáadtuk a CalDAV VTODO támogatást a feladatokhoz és emlékeztetőkhöz. Ez ugyanazt a szervert használja, mint a naptártámogatásunk: `caldav.forwardemail.net`.

A CalDAV szerverünk támogatja mind a naptári eseményeket (VEVENT), mind a feladatokat (VTODO) **egységes naptárak** használatával. Ez azt jelenti, hogy minden naptár tartalmazhat eseményeket és feladatokat is, maximális rugalmasságot és kompatibilitást biztosítva minden CalDAV kliens számára.

**Hogyan működnek a naptárak és listák:**

* **Minden naptár támogatja az eseményeket és a feladatokat is** – Bármelyik naptárhoz hozzáadhatsz eseményeket, feladatokat vagy mindkettőt
* **Apple Emlékeztetők listák** – Minden lista, amit az Apple Emlékeztetőkben létrehozol, külön naptárként jelenik meg a szerveren
* **Több naptár** – Annyi naptárat hozhatsz létre, amennyire szükséged van, mindegyik saját névvel, színnel és szervezéssel
* **Kliens-közi szinkronizáció** – A feladatok és események zökkenőmentesen szinkronizálódnak minden kompatibilis kliens között

**Támogatott feladatkezelő kliensek:**

* **macOS Emlékeztetők** – Teljes natív támogatás a feladat létrehozásához, szerkesztéséhez, befejezéséhez és szinkronizálásához
* **iOS Emlékeztetők** – Teljes natív támogatás minden iOS eszközön
* **Tasks.org (Android)** – Népszerű nyílt forráskódú feladatkezelő CalDAV szinkronnal
* **Thunderbird** – Feladat- és naptártámogatás az asztali e-mail kliensben
* **Bármely CalDAV-kompatibilis feladatkezelő** – Szabványos VTODO komponens támogatás

**Támogatott feladatfunkciók:**

* Feladat létrehozása, szerkesztése és törlése
* Határidők és kezdő dátumok
* Feladat állapota (NEEDS-ACTION, IN-PROCESS, COMPLETED, CANCELLED)
* Feladat prioritási szintek
* Ismétlődő feladatok
* Feladat leírások és jegyzetek
* Több eszköz közötti szinkronizáció
* Alkategóriák RELATED-TO tulajdonsággal
* Feladat emlékeztetők VALARM-mal

A bejelentkezési adatok megegyeznek a naptártámogatáséval:

| Bejelentkezés | Példa                     | Leírás                                                                                                                                                                                   |
| ------------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Felhasználónév | `user@example.com`        | Egy alias e-mail címe, amely létezik a domainhez a <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Saját fiók <i class="fa fa-angle-right"></i> Domain-ek</a> alatt. |
| Jelszó        | `************************` | Alias-specifikus generált jelszó.                                                                                                                                                        |

**Fontos megjegyzések:**

* **Minden Emlékeztetők lista külön naptár** – Amikor új listát hozol létre az Apple Emlékeztetőkben, az új naptárat hoz létre a CalDAV szerveren
* **Thunderbird felhasználók** – Minden naptárra/listára manuálisan kell feliratkozni, amelyet szinkronizálni szeretnél, vagy használhatod a naptár fő URL-jét: `https://caldav.forwardemail.net/dav/your-email@domain.com/`
* **Apple felhasználók** – A naptárak automatikusan felfedeződnek, így minden naptárad és listád megjelenik a Calendar.app és a Reminders.app alkalmazásban
* **Egységes naptárak** – Minden naptár támogatja az eseményeket és a feladatokat is, így rugalmasan szervezheted az adataidat
### Támogatjátok a névjegyeket (CardDAV) {#do-you-support-contacts-carddav}

Igen, 2025. június 12-től hozzáadtuk ezt a funkciót. A szerverünk a `carddav.forwardemail.net`, és a <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">állapotoldalunkon</a> is figyeljük.

Mind IPv4-et, mind IPv6-ot támogat, és a `443` (HTTPS) porton érhető el.

| Bejelentkezés | Példa                     | Leírás                                                                                                                                                                                   |
| ------------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Felhasználónév | `user@example.com`        | Egy alias e-mail címe, amely létezik a domainhez a <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Saját fiók <i class="fa fa-angle-right"></i> Domain-ek</a> alatt. |
| Jelszó        | `************************` | Alias-specifikus generált jelszó.                                                                                                                                                        |

A névjegyek támogatásának használatához a **felhasználónévnek** az alias e-mail címének kell lennie, amely létezik a domainhez a <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Saját fiók <i class="fa fa-angle-right"></i> Domain-ek</a> alatt – és a **jelszónak** alias-specifikus generált jelszónak kell lennie.

### Támogatjátok az e-mailek küldését SMTP-vel? {#do-you-support-sending-email-with-smtp}

Igen, 2023 májusa óta támogatjuk az SMTP-vel történő e-mail küldést kiegészítőként minden fizetős felhasználó számára.

<div id="smtp-instructions">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Fontos:
  </strong>
  <span>
    Kérjük, győződjön meg róla, hogy elolvasta a <a href="/terms" class="alert-link" target="_blank">Felhasználási feltételeinket</a>, az <a href="/privacy" class="alert-link" target="_blank">Adatvédelmi irányelveinket</a>, és az <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">SMTP-korlátokat</a> – a használatával elismeri és elfogadja ezeket.
  </span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Fontos:
  </strong>
  <span>
    Ha Gmailt használ, kérjük, tekintse meg a <a class="alert-link" href="/guides/send-mail-as-gmail-custom-domain">Küldés Gmail egyéni domainként útmutatónkat</a>. Ha fejlesztő, akkor tekintse meg az <a class="alert-link" href="/email-api#outbound-emails" target="_blank">e-mail API dokumentációt</a>.
  </span>
</div>

1. Lépjen a <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Saját fiók <i class="fa fa-angle-right"></i> Domain-ek</a> <i class="fa fa-angle-right"></i> Beállítások <i class="fa fa-angle-right"></i> Kimenő SMTP konfiguráció oldalra, és kövesse a beállítási utasításokat

2. Hozzon létre egy új alias-t a domainje alatt a <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Saját fiók <i class="fa fa-angle-right"></i> Domain-ek</a> <i class="fa fa-angle-right"></i> Aliasok menüpontban (pl. <code><hello@example.com></code>)

3. Kattintson a <strong class="text-success"><i class="fa fa-key"></i> Jelszó generálása</strong> gombra az újonnan létrehozott alias mellett. Másolja a vágólapjára, és biztonságosan tárolja a képernyőn megjelenő generált jelszót.

4. A kedvenc e-mail alkalmazásával adjon hozzá vagy konfiguráljon egy fiókot az új aliasával (pl. <code><hello@example.com></code>)
   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tipp:
     </strong>
     <span>Ajánljuk a <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a> vagy <a href="/blog/open-source" class="alert-link" target="_blank">egy nyílt forráskódú és adatvédelmi szempontból fókuszált alternatíva</a> használatát.</span>
   </div>
5. Amikor az SMTP szerver nevét kéri, írja be: `smtp.forwardemail.net`

6. Amikor az SMTP szerver portját kéri, írja be: `465` (SSL/TLS) – szükség esetén lásd az [alternatív SMTP portokat](/faq#what-are-your-smtp-server-configuration-settings)
   <div class="alert my-3 alert-warning">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tipp:
     </strong>
     <span>Ha Thunderbirdöt használ, győződjön meg róla, hogy a "Kapcsolat biztonsága" "SSL/TLS"-re van állítva, azonosítási módszer pedig "Normál jelszó".</span>
   </div>

7. Amikor az SMTP szerver jelszavát kéri, illessze be a 3. lépésben fent a <strong class="text-success"><i class="fa fa-key"></i> Jelszó generálása</strong> alatt létrehozott jelszót

8. **Mentse el a beállításokat, és küldje el az első teszt e-mailt** – ha problémája van, kérjük, <a href="/help">lépjen kapcsolatba velünk</a>

<div class="alert my-3 alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Fontos:
  </strong>
  <span>
    Kérjük, vegye figyelembe, hogy az IP-hírnév fenntartása és a kézbesíthetőség biztosítása érdekében manuális felülvizsgálati folyamatot alkalmazunk domainenként az SMTP kimenő engedélyezéséhez. Ez általában kevesebb, mint 24 órát vesz igénybe, a legtöbb kérelmet 1-2 órán belül teljesítjük. A közeljövőben célunk, hogy ezt a folyamatot azonnalivá tegyük további spam-ellenőrzésekkel és riasztásokkal. Ez a folyamat biztosítja, hogy az e-mailjei eljussanak a beérkező levelek közé, és az üzenetei ne kerüljenek spamként megjelölésre.
  </span>
</div>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Gratulálunk!
    </strong>
    <span>
      Sikeresen végrehajtotta az összes lépést.
    </span>
  </div>
</div>

</div>

### Támogatják az OpenPGP/MIME-t, a végpontok közötti titkosítást ("E2EE") és a Web Key Directory-t ("WKD")? {#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd}

Igen, támogatjuk az [OpenPGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy#OpenPGP), a [végpontok közötti titkosítást ("E2EE")](https://en.wikipedia.org/wiki/End-to-end_encryption), valamint a nyilvános kulcsok felfedezését a [Web Key Directory ("WKD")](https://wiki.gnupg.org/WKD) segítségével. Az OpenPGP-t konfigurálhatja a [keys.openpgp.org](https://keys.openpgp.org/about/usage#wkd-as-a-service) oldalon, vagy [önállóan is hosztolhatja a kulcsait](https://wiki.gnupg.org/WKDHosting) (lásd [ezt a gist-et a WKD szerver beállításához](https://gist.github.com/kafene/0a6e259996862d35845784e6e5dbfc79)).

* A WKD lekérdezések 1 órán keresztül vannak gyorsítótárazva a gyors e-mail kézbesítés érdekében → ezért ha hozzáad, módosít vagy eltávolít egy WKD kulcsot, kérjük, küldjön nekünk e-mailt a `support@forwardemail.net` címre az e-mail címével, hogy manuálisan törölhessük a gyorsítótárat.
* Támogatjuk a PGP titkosítást azokra az üzenetekre, amelyeket WKD lekérdezés vagy az általunk biztosított felületen feltöltött PGP kulcs segítségével továbbítanak.
* A feltöltött kulcsok elsőbbséget élveznek, amíg a PGP jelölőnégyzet be van kapcsolva/be van pipálva.
* A webhookokra küldött üzenetek jelenleg nem titkosítottak PGP-vel.
* Ha egy adott továbbítási címhez több alias is illeszkedik (pl. regex/wildcard/pontos kombináció), és ezek közül több tartalmaz feltöltött PGP kulcsot és be van kapcsolva a PGP → akkor hibajelző e-mailt küldünk, és nem titkosítjuk az üzenetet a feltöltött PGP kulccsal. Ez nagyon ritka, és általában csak haladó felhasználók összetett alias szabályaira vonatkozik.
* **A PGP titkosítás nem kerül alkalmazásra az MX szervereinken keresztüli e-mail továbbítás esetén, ha a feladó DMARC szabálya reject volt. Ha *minden* levélre PGP titkosítást igényel, javasoljuk az IMAP szolgáltatásunk használatát, és konfigurálja PGP kulcsát az aliasához a bejövő levelekhez.**

**A Web Key Directory beállítását ellenőrizheti a <https://wkd.chimbosonic.com/> (nyílt forráskódú) vagy a <https://www.webkeydirectory.com/> (proprietáris) oldalakon.**

<div class="alert my-3 alert-success">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Automatikus titkosítás:
  </strong>
  <span>Ha a <a href="#do-you-support-sending-email-with-smtp" class="alert-link">kimenő SMTP szolgáltatásunkat</a> használja, és titkosítatlan üzeneteket küld, akkor automatikusan megpróbáljuk az üzeneteket címzettenként titkosítani a <a class="alert-link" href="https://wiki.gnupg.org/WKD">Web Key Directory ("WKD")</a> segítségével.</span>
</div>
<div class="alert alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Fontos:
  </strong>
  <span>
    Az OpenPGP engedélyezéséhez a saját domain nevedhez az alábbi lépéseket mindenképpen követned kell.
  </span>
</div>

1. Töltsd le és telepítsd az alábbiakban az e-mail kliensed által ajánlott bővítményt:

   | E-mail kliens   | Platform | Ajánlott bővítmény                                                                                                                                                                    | Megjegyzések                                                                                                                                                                                                                                                                                                                                                                                                                             |
   | --------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | Thunderbird     | Asztali  | [OpenPGP konfigurálása Thunderbirdben](https://support.mozilla.org/en-US/kb/openpgp-thunderbird-howto-and-faq#w_i-have-never-used-openpgp-with-thunderbird-before-how-do-i-setup-openpgp) | A Thunderbird beépített támogatást nyújt az OpenPGP-hez.                                                                                                                                                                                                                                                                                                                                                                                 |
   | Gmail           | Böngésző | [Mailvelope](https://mailvelope.com/) vagy [FlowCrypt](https://flowcrypt.com/download) (proprietary license)                                                                            | A Gmail nem támogatja az OpenPGP-t, azonban letöltheted a nyílt forráskódú [Mailvelope](https://mailvelope.com/) vagy [FlowCrypt](https://flowcrypt.com/download) bővítményt.                                                                                                                                                                                                                                                               |
   | Apple Mail      | macOS    | [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation)                                                                                          | Az Apple Mail nem támogatja az OpenPGP-t, azonban letöltheted a nyílt forráskódú [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation) bővítményt.                                                                                                                                                                                                                                                    |
   | Apple Mail      | iOS      | [PGPro](https://github.com/opensourceios/PGPro/) vagy [FlowCrypt](https://apps.apple.com/us/app/flowcrypt-encrypted-email/id1591754995) (proprietary license)                           | Az Apple Mail nem támogatja az OpenPGP-t, azonban letöltheted a nyílt forráskódú [PGPro](https://github.com/opensourceios/PGPro/) vagy [FlowCrypt](https://flowcrypt.com/download) bővítményt.                                                                                                                                                                                                                                             |
   | Outlook         | Windows  | [gpg4win](https://www.gpg4win.de/index.html)                                                                                                                                          | Az Outlook asztali levelezőkliense nem támogatja az OpenPGP-t, azonban letöltheted a nyílt forráskódú [gpg4win](https://www.gpg4win.de/index.html) bővítményt.                                                                                                                                                                                                                                                                           |
   | Outlook         | Böngésző | [Mailvelope](https://mailvelope.com/) vagy [FlowCrypt](https://flowcrypt.com/download) (proprietary license)                                                                            | Az Outlook webes levelezőkliense nem támogatja az OpenPGP-t, azonban letöltheted a nyílt forráskódú [Mailvelope](https://mailvelope.com/) vagy [FlowCrypt](https://flowcrypt.com/download) bővítményt.                                                                                                                                                                                                                                     |
   | Android         | Mobil    | [OpenKeychain](https://www.openkeychain.org/) vagy [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email)                                                       | Az [Android levelezőkliensek](/blog/open-source/android-email-clients), mint például a [Thunderbird Mobile](https://www.thunderbird.net/en-US/mobile/) és a [FairEmail](https://github.com/M66B/FairEmail) támogatják a nyílt forráskódú [OpenKeychain](https://www.openkeychain.org/) bővítményt. Alternatívaként használhatod a nyílt forráskódú (proprietary licencelésű) [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email) bővítményt is. |
   | Google Chrome   | Böngésző | [Mailvelope](https://mailvelope.com/) vagy [FlowCrypt](https://flowcrypt.com/download) (proprietary license)                                                                            | Letöltheted a nyílt forráskódú böngészőbővítményt, a [Mailvelope](https://mailvelope.com/) vagy [FlowCrypt](https://flowcrypt.com/download) bővítményt.                                                                                                                                                                                                                                                                                   |
   | Mozilla Firefox | Böngésző | [Mailvelope](https://mailvelope.com/) vagy [FlowCrypt](https://flowcrypt.com/download) (proprietary license)                                                                            | Letöltheted a nyílt forráskódú böngészőbővítményt, a [Mailvelope](https://mailvelope.com/) vagy [FlowCrypt](https://flowcrypt.com/download) bővítményt.                                                                                                                                                                                                                                                                                   |
   | Microsoft Edge  | Böngésző | [Mailvelope](https://mailvelope.com/)                                                                                                                                                 | Letöltheted a nyílt forráskódú böngészőbővítményt, a [Mailvelope](https://mailvelope.com/) bővítményt.                                                                                                                                                                                                                                                                                                                                   |
   | Brave           | Böngésző | [Mailvelope](https://mailvelope.com/) vagy [FlowCrypt](https://flowcrypt.com/download) (proprietary license)                                                                            | Letöltheted a nyílt forráskódú böngészőbővítményt, a [Mailvelope](https://mailvelope.com/) vagy [FlowCrypt](https://flowcrypt.com/download) bővítményt.                                                                                                                                                                                                                                                                                   |
   | Balsa           | Asztali  | [OpenPGP konfigurálása Balsában](https://www.mynetcologne.de/~nc-dreszal/balsa/balsa23-secure-mail.html#USING)                                                                         | A Balsa beépített támogatást nyújt az OpenPGP-hez.                                                                                                                                                                                                                                                                                                                                                                                       |
   | KMail           | Asztali  | [OpenPGP konfigurálása KMailben](https://userbase.kde.org/KMail/PGP_MIME)                                                                                                             | A KMail beépített támogatást nyújt az OpenPGP-hez.                                                                                                                                                                                                                                                                                                                                                                                       |
   | GNOME Evolution | Asztali  | [OpenPGP konfigurálása Evolutionben](https://help.gnome.org/users/evolution/stable/mail-encryption.html.en)                                                                            | A GNOME Evolution beépített támogatást nyújt az OpenPGP-hez.                                                                                                                                                                                                                                                                                                                                                                             |
   | Terminál        | Asztali  | [gpg konfigurálása Terminálban](https://docs.github.com/en/authentication/managing-commit-signature-verification/generating-a-new-gpg-key#generating-a-gpg-key)                      | Használhatod a nyílt forráskódú [gpg parancssori eszközt](https://www.gnupg.org/download/) új kulcs generálásához parancssorból.                                                                                                                                                                                                                                                                                                         |
2. Nyissa meg a bővítményt, hozza létre a nyilvános kulcsát, és állítsa be az e-mail kliensét, hogy azt használja.

3. Töltse fel a nyilvános kulcsát a <https://keys.openpgp.org/upload> címen.

   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tipp:
     </strong>
     <span>Ellátogathat a <a class="alert-link" href="https://keys.openpgp.org/manage">https://keys.openpgp.org/manage</a> oldalra, hogy a jövőben kezelje a kulcsát.</span>
   </div>

   <div class="alert my-3 alert-secondary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Opcionális kiegészítő:
     </strong>
     <span>
       Ha használja a <a class="alert-link" href="/blog/docs/best-quantum-safe-encrypted-email-service">titkosított tárolás (IMAP/POP3)</a> szolgáltatásunkat, és szeretné, hogy <i>minden</i> e-mail, amely az (már titkosított) SQLite adatbázisában tárolódik, a nyilvános kulcsával legyen titkosítva, akkor lépjen a <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Saját fiók <i class="fa fa-angle-right"></i> Tartományok</a> <i class="fa fa-angle-right"></i> Átirányítások (pl. <code>hello@example.com</code>) <i class="fa fa-angle-right"></i> Szerkesztés <i class="fa fa-angle-right"></i> OpenPGP menüpontra, és töltse fel a nyilvános kulcsát.
     </span>
   </div>

4. Adjon hozzá egy új `CNAME` rekordot a domain nevéhez (pl. `example.com`):

   <table class="table table-striped table-hover my-3">
     <thead class="thead-dark">
       <tr>
         <th>Név/Host/Átirányítás</th>
         <th class="text-center">TTL</th>
         <th>Típus</th>
         <th>Válasz/Érték</th>
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
       Tipp:
     </strong>
     <span>Ha az átirányítása a <a class="alert-link" href="/disposable-addresses" target="_blank">vanity/eldobható domaineket</a> használ (pl. <code>hideaddress.net</code>), akkor ezt a lépést kihagyhatja.</span>
   </div>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Gratulálunk!
    </strong>
    <span>
      Sikeresen végrehajtotta az összes lépést.
    </span>
  </div>
</div>

### Támogatják az S/MIME titkosítást {#do-you-support-smime-encryption}

Igen, támogatjuk az [S/MIME (Secure/Multipurpose Internet Mail Extensions)](https://en.wikipedia.org/wiki/S/MIME) titkosítást az [RFC 8551](https://datatracker.ietf.org/doc/html/rfc8551) szabvány szerint. Az S/MIME végpontok közötti titkosítást biztosít X.509 tanúsítványok használatával, amelyet széles körben támogatnak a vállalati e-mail kliensek.

Támogatjuk mind az RSA, mind az ECC (Elliptic Curve Cryptography) tanúsítványokat:

* **RSA tanúsítványok**: minimum 2048 bit, ajánlott 4096 bit
* **ECC tanúsítványok**: P-256, P-384 és P-521 NIST görbék

Az S/MIME titkosítás beállításához az átirányításához:

1. Szerezzen be egy S/MIME tanúsítványt egy megbízható tanúsítványkiadótól (CA), vagy generáljon egy önaláírt tanúsítványt teszteléshez.

   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tipp:
     </strong>
     <span>Ingyenes S/MIME tanúsítványok elérhetők olyan szolgáltatóktól, mint az <a class="alert-link" href="https://www.actalis.com/s-mime-certificates.aspx">Actalis</a> vagy az <a class="alert-link" href="https://extrassl.actalis.com/portal/uapub/freemail">Actalis Free S/MIME</a>.</span>
   </div>

2. Exportálja a tanúsítványát PEM formátumban (csak a nyilvános tanúsítványt, a privát kulcsot nem).

3. Lépjen a <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Saját fiók <i class="fa fa-angle-right"></i> Tartományok</a> <i class="fa fa-angle-right"></i> Átirányítások (pl. <code><hello@example.com></code>) <i class="fa fa-angle-right"></i> Szerkesztés <i class="fa fa-angle-right"></i> S/MIME menüpontra, és töltse fel a nyilvános tanúsítványát.
4. Miután beállította, az aliasára érkező összes bejövő e-mail titkosítva lesz az Ön S/MIME tanúsítványával, mielőtt tárolásra vagy továbbításra kerülne.

   <div class="alert my-3 alert-secondary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Megjegyzés:
     </strong>
     <span>
       Az S/MIME titkosítás azokra a bejövő üzenetekre vonatkozik, amelyek még nincsenek titkosítva. Ha egy üzenet már OpenPGP vagy S/MIME titkosítással rendelkezik, azt nem titkosítjuk újra.
     </span>
   </div>

   <div class="alert my-3 alert-warning">
     <i class="fa fa-exclamation-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Fontos:
     </strong>
     <span>
       Az S/MIME titkosítás nem kerül alkalmazásra az e-mailek továbbítására a mi MX szervereinken keresztül, ha a feladó DMARC szabályzata elutasítás (reject) volt. Ha <em>minden</em> levélre szüksége van S/MIME titkosításra, akkor javasoljuk, hogy használja IMAP szolgáltatásunkat, és állítsa be az S/MIME tanúsítványát az aliasához a bejövő levelekhez.
     </span>
   </div>

A következő e-mail kliensek beépített S/MIME támogatással rendelkeznek:

| E-mail kliens     | Platform | Megjegyzések                                                                                                         |
| ----------------- | -------- | ------------------------------------------------------------------------------------------------------------------- |
| Apple Mail        | macOS    | Beépített S/MIME támogatás. Menjen a Mail > Preferences > Accounts > az Ön fiókja > Trust menüponthoz a tanúsítványok beállításához.      |
| Apple Mail        | iOS      | Beépített S/MIME támogatás. Menjen a Settings > Mail > Accounts > az Ön fiókja > Advanced > S/MIME menüponthoz a beállításhoz.          |
| Microsoft Outlook | Windows  | Beépített S/MIME támogatás. Menjen a File > Options > Trust Center > Trust Center Settings > Email Security menüponthoz a beállításhoz. |
| Microsoft Outlook | macOS    | Beépített S/MIME támogatás. Menjen a Tools > Accounts > Advanced > Security menüponthoz a beállításhoz.                                 |
| Thunderbird       | Desktop  | Beépített S/MIME támogatás. Menjen a Account Settings > End-To-End Encryption > S/MIME menüponthoz a beállításhoz.                      |
| GNOME Evolution   | Desktop  | Beépített S/MIME támogatás. Menjen a Edit > Preferences > Mail Accounts > az Ön fiókja > Security menüponthoz a beállításhoz.           |
| KMail             | Desktop  | Beépített S/MIME támogatás. Menjen a Settings > Configure KMail > Identities > az Ön identitása > Cryptography menüponthoz a beállításhoz. |

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Gratulálunk!
    </strong>
    <span>
      Sikeresen beállította az S/MIME titkosítást az aliasához.
    </span>
  </div>
</div>

### Támogatják a Sieve e-mail szűrést? {#do-you-support-sieve-email-filtering}

Igen! Támogatjuk a [Sieve](https://en.wikipedia.org/wiki/Sieve_\(mail_filtering_language\)) e-mail szűrést az [RFC 5228](https://datatracker.ietf.org/doc/html/rfc5228) szerint. A Sieve egy hatékony, szabványosított szkriptnyelv szerveroldali e-mail szűréshez, amely lehetővé teszi, hogy automatikusan rendszerezze, szűrje és válaszoljon a bejövő üzenetekre.

#### Támogatott Sieve kiterjesztések {#supported-sieve-extensions}

Átfogó Sieve kiterjesztés készletet támogatunk:

| Kiterjesztés                | RFC                                                                                   | Leírás                                          |
| --------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------ |
| `fileinto`                  | [RFC 5228](https://datatracker.ietf.org/doc/html/rfc5228)                             | Üzenetek fájlba helyezése adott mappákba        |
| `reject` / `ereject`        | [RFC 5429](https://datatracker.ietf.org/doc/html/rfc5429)                             | Üzenetek elutasítása hibával                      |
| `vacation`                  | [RFC 5230](https://datatracker.ietf.org/doc/html/rfc5230)                             | Automatikus szabadság/külső válaszok             |
| `vacation-seconds`          | [RFC 6131](https://datatracker.ietf.org/doc/html/rfc6131)                             | Finomhangolt szabadság válasz intervallumok      |
| `imap4flags`                | [RFC 5232](https://datatracker.ietf.org/doc/html/rfc5232)                             | IMAP zászlók beállítása (\Seen, \Flagged, stb.) |
| `envelope`                  | [RFC 5228](https://datatracker.ietf.org/doc/html/rfc5228)                             | Boríték feladó/címzett tesztelése                 |
| `body`                      | [RFC 5173](https://datatracker.ietf.org/doc/html/rfc5173)                             | Üzenet törzstartalom tesztelése                   |
| `variables`                 | [RFC 5229](https://datatracker.ietf.org/doc/html/rfc5229)                             | Változók tárolása és használata szkriptekben     |
| `relational`                | [RFC 5231](https://datatracker.ietf.org/doc/html/rfc5231)                             | Relációs összehasonlítások (nagyobb, kisebb)     |
| `comparator-i;ascii-numeric`| [RFC 4790](https://datatracker.ietf.org/doc/html/rfc4790)                             | Numerikus összehasonlítások                        |
| `copy`                      | [RFC 3894](https://datatracker.ietf.org/doc/html/rfc3894)                             | Üzenetek másolása átirányítás közben               |
| `editheader`                | [RFC 5293](https://datatracker.ietf.org/doc/html/rfc5293)                             | Üzenet fejléc hozzáadása vagy törlése              |
| `date`                      | [RFC 5260](https://datatracker.ietf.org/doc/html/rfc5260)                             | Dátum/idő értékek tesztelése                       |
| `index`                     | [RFC 5260](https://datatracker.ietf.org/doc/html/rfc5260)                             | Meghatározott fejléc előfordulások elérése        |
| `regex`                     | [draft-ietf-sieve-regex](https://datatracker.ietf.org/doc/html/draft-ietf-sieve-regex)| Reguláris kifejezés egyezés                        |
| `enotify`                   | [RFC 5435](https://datatracker.ietf.org/doc/html/rfc5435)                             | Értesítések küldése (pl. mailto:)                  |
| `environment`               | [RFC 5183](https://datatracker.ietf.org/doc/html/rfc5183)                             | Környezeti információk elérése                      |
| `mailbox`                   | [RFC 5490](https://datatracker.ietf.org/doc/html/rfc5490)                             | Postafiók létezésének tesztelése, postafiókok létrehozása |
| `special-use`               | [RFC 8579](https://datatracker.ietf.org/doc/html/rfc8579)                             | Speciális használatú postafiókokba fájlba helyezés (\Junk, \Trash) |
| `duplicate`                 | [RFC 7352](https://datatracker.ietf.org/doc/html/rfc7352)                             | Duplikált üzenetek felismerése                     |
| `ihave`                     | [RFC 5463](https://datatracker.ietf.org/doc/html/rfc5463)                             | Kiterjesztés elérhetőségének tesztelése            |
| `subaddress`                | [RFC 5233](https://datatracker.ietf.org/doc/html/rfc5233)                             | Felhasználó+részlet címrészek elérése              |
#### Nem támogatott kiterjesztések {#extensions-not-supported}

A következő kiterjesztések jelenleg nem támogatottak:

| Kiterjesztés                                                   | Ok                                                                  |
| -------------------------------------------------------------- | ------------------------------------------------------------------ |
| `include`                                                      | Biztonsági kockázat (szkript befecskendezés) és globális szkript tárolást igényel |
| `mboxmetadata` / `servermetadata`                              | IMAP METADATA kiterjesztés támogatást igényel                      |
| `foreverypart` / `mime` / `extracttext` / `replace` / `enclose` | Összetett MIME fa kezelés még nincs megvalósítva                   |

#### Példa Sieve szkriptek {#example-sieve-scripts}

**Hírlevelek mappába helyezése:**

```sieve
require ["fileinto"];

if header :contains "List-Id" "newsletter" {
    fileinto "Newsletters";
}
```

**Automatikus válasz szabadság alatt:**

```sieve
require ["vacation"];

vacation :days 7 :subject "Out of Office"
    "Jelenleg nem vagyok az irodában, és visszatérésem után válaszolok.";
```

**Fontos feladótól érkező üzenetek megjelölése:**

```sieve
require ["imap4flags"];

if address :is "from" "boss@example.com" {
    setflag "\\Flagged";
}
```

**Spam elutasítása meghatározott tárgyakkal:**

```sieve
require ["reject"];

if header :contains "subject" ["lottery", "winner", "urgent transfer"] {
    reject "Az üzenet spam tartalom miatt elutasítva.";
}
```

#### Sieve szkriptek kezelése {#managing-sieve-scripts}

Sieve szkripteket többféleképpen kezelhet:

1. **Webes felület**: Lépjen a <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Fiókom <i class="fa fa-angle-right"></i> Tartományok</a> <i class="fa fa-angle-right"></i> Átirányítások <i class="fa fa-angle-right"></i> Sieve szkriptek oldalra a szkriptek létrehozásához és kezeléséhez.

2. **ManageSieve protokoll**: Csatlakozzon bármilyen ManageSieve-kompatibilis klienssel (például Thunderbird Sieve bővítményével vagy a [sieve-connect](https://github.com/philpennock/sieve-connect) eszközzel) az `imap.forwardemail.net` címre. Használja a `2190` portot STARTTLS-sel (ajánlott a legtöbb kliens számára) vagy a `4190` portot implicit TLS-sel.

3. **API**: Használja a [REST API](/api#sieve-scripts) felületünket a szkriptek programozott kezeléséhez.

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Megjegyzés:
  </strong>
  <span>
    A Sieve szűrés a bejövő üzenetekre vonatkozik, mielőtt azok a postaládába kerülnének. A szkriptek prioritás szerint futnak, és az első egyező művelet határozza meg az üzenet kezelését.
  </span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Biztonság:
  </strong>
  <span>
    Biztonsági okokból az átirányítási műveletek szkriptenként legfeljebb 10, naponta pedig 100 alkalommal engedélyezettek. A szabadság alatti válaszok korlátozottak a visszaélések megelőzése érdekében.
  </span>
</div>

### Támogatják az MTA-STS-t? {#do-you-support-mta-sts}

Igen, 2023. március 2-től támogatjuk az [MTA-STS](https://www.hardenize.com/blog/mta-sts) protokollt. Használhatja [ezt a sablont](https://github.com/jpawlowski/mta-sts.template), ha engedélyezni szeretné a tartományán.

Konfigurációnk nyilvánosan elérhető a GitHubon: <https://github.com/forwardemail/mta-sts.forwardemail.net>.

### Támogatják a passkey-eket és a WebAuthn-t? {#do-you-support-passkeys-and-webauthn}

Igen! 2023. december 13-tól támogatjuk a passkey-eket [a nagy érdeklődés miatt](https://github.com/orgs/forwardemail/discussions/182).

A passkey-ek lehetővé teszik a biztonságos bejelentkezést jelszó és kétfaktoros hitelesítés nélkül.

Azonosításra használhat érintést, arcfelismerést, eszközalapú jelszót vagy PIN-kódot.

Egyszerre akár 30 passkey-t is kezelhet, így könnyedén bejelentkezhet az összes eszközéről.

További információk a passkey-ekről az alábbi linkeken:

* [Bejelentkezés alkalmazásokba és weboldalakra passkey-ekkel](https://support.google.com/android/answer/14124480?hl=en) (Google)
* [Passkey-k használata iPhone-on alkalmazásokba és weboldalakra való bejelentkezéshez](https://support.apple.com/guide/iphone/use-passkeys-to-sign-in-to-apps-and-websites-iphf538ea8d0/ios) (Apple)
* [Passkey-k a Wikipédián](https://en.wikipedia.org/wiki/Passkey_\(credential\))
### Támogatjátok az email legjobb gyakorlatait? {#do-you-support-email-best-practices}

Igen. Beépített támogatást nyújtunk az SPF, DKIM, DMARC, ARC és SRS protokollokhoz minden csomagban. Emellett szorosan együttműködtünk ezen szabványok eredeti szerzőivel és más email szakértőkkel a tökéletesség és a magas kézbesíthetőség biztosítása érdekében.

### Támogatjátok a bounce webhookokat? {#do-you-support-bounce-webhooks}

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tipp:
  </strong>
    Dokumentációt keresel az email webhookokról? Nézd meg a <a href="/faq#do-you-support-webhooks" class="alert-link">Támogatjátok a webhookokat?</a> részt további információkért.
  <span>
  </span>
</div>

Igen, 2024. augusztus 14-től elérhető ez a funkció. Mostantól a Saját fiók → Domain-ek → Beállítások → Bounce Webhook URL menüpontban beállíthatsz egy `http://` vagy `https://` URL-t, amelyre minden kimenő SMTP email visszapattanásakor `POST` kérést küldünk.

Ez hasznos az SMTP kimenő levelezésed kezeléséhez és figyeléséhez – használható feliratkozók karbantartására, leiratkozás kezelésére és a visszapattanások észlelésére.

A bounce webhook payload JSON formátumban érkezik az alábbi tulajdonságokkal:

* `email_id` (String) - az email azonosítója, amely megfelel a Saját fiók → Email-ek (kimenő SMTP) részben található emailnek
* `list_id` (String) - az eredeti kimenő email `List-ID` fejlécének (kis- és nagybetűtől független) értéke, ha van ilyen
* `list_unsubscribe` (String) - az eredeti kimenő email `List-Unsubscribe` fejlécének (kis- és nagybetűtől független) értéke, ha van ilyen
* `feedback_id` (String) - az eredeti kimenő email `Feedback-ID` fejlécének (kis- és nagybetűtől független) értéke, ha van ilyen
* `recipient` (String) - a visszapattant vagy hibás címzett email címe
* `message` (String) - részletes hibaüzenet a visszapattanásról
* `response` (String) - az SMTP válaszüzenet
* `response_code` (Number) - az SMTP válaszkód értelmezett száma
* `truth_source` (String) - ha a válaszkód megbízható forrásból származik, itt a gyökér domain neve jelenik meg (pl. `google.com` vagy `yahoo.com`)
* `bounce` (Object) - egy objektum, amely a visszapattanás és elutasítás részleteit tartalmazza az alábbi tulajdonságokkal
  * `action` (String) - visszapattanási művelet (pl. `"reject"`)
  * `message` (String) - visszapattanási ok (pl. `"Message Sender Blocked By Receiving Server"`)
  * `category` (String) - visszapattanási kategória (pl. `"block"`)
  * `code` (Number) - visszapattanási státuszkód (pl. `554`)
  * `status` (String) - visszapattanási kód a válaszüzenetből (pl. `5.7.1`)
  * `line` (Number) - értelmezett sor száma, ha van, [a Zone-MTA bounce elemző listából](https://github.com/zone-eu/zone-mta/blob/master/config/bounces.txt) (pl. `526`)
* `headers` (Object) - kulcs-érték pár a kimenő email fejlécéből
* `bounced_at` (String) - [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601) formátumú dátum, amikor a visszapattanási hiba történt

Például:

```json
{
  "email_id": "66bcce793ef7b2a0928e14ba",
  "recipient": "example@gmail.com",
  "message": "Az email fiók, amelyet el szerettél volna érni, túllépte a kvótát.",
  "response": "552 5.2.2 Az email fiók, amelyet el szerettél volna érni, túllépte a kvótát.",
  "response_code": 552,
  "truth_source": "google.com",
  "bounce": {
    "action": "reject",
    "message": "A Gmail postaláda tele van",
    "category": "capacity",
    "code": 552,
    "status": "5.2.2",
    "line": 300
  },
  "headers": {},
  "bounced_at": "2024-08-24T01:50:02.828Z"
}
```

Néhány további megjegyzés a bounce webhookokkal kapcsolatban:

* Ha a webhook payload tartalmaz `list_id`, `list_unsubscribe` vagy `feedback_id` értéket, akkor szükség esetén megfelelő lépéseket kell tenned a `recipient` eltávolítására a listáról.
  * Ha a `bounce.category` értéke `"block"`, `"recipient"`, `"spam"` vagy `"virus"` volt, akkor mindenképpen el kell távolítanod a felhasználót a listáról.
* Ha ellenőrizni szeretnéd a webhook payloadokat (hogy valóban a szerverünkről érkeznek-e), akkor [oldd meg a távoli kliens IP címének kliens hosztnevét egy visszakereséssel](https://nodejs.org/api/dns.html#dnspromisesreverseip) – ennek `smtp.forwardemail.net`-nek kell lennie.
  * Ellenőrizheted az IP-t a [közzétett IP címeink](#what-are-your-servers-ip-addresses) között is.
  * Menj a Saját fiók → Domain-ek → Beállítások → Webhook Signature Payload Verification Key menüponthoz, hogy megszerezd a webhook kulcsodat.
    * Ezt a kulcsot bármikor megváltoztathatod biztonsági okokból.
    * Számítsd ki és hasonlítsd össze az `X-Webhook-Signature` értéket a webhook kérésből a kulccsal számított törzzsel. Ennek egy példája elérhető [ebben a Stack Overflow bejegyzésben](https://stackoverflow.com/a/68885281).
  * További információkért lásd a vitát a <https://github.com/forwardemail/free-email-forwarding/issues/235> oldalon.
* Maximum `5` másodpercig várjuk, hogy a webhook végpontod `200` státuszkóddal válaszoljon, és legfeljebb `1` alkalommal próbálkozunk újra.
* Ha észleljük, hogy a bounce webhook URL-ed hibát jelez, amikor kérés küldése történik, akkor hetente egyszer udvariassági emailt küldünk neked.
### Támogatjátok a webhookokat? {#do-you-support-webhooks}

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tipp:
  </strong>
    Bounce webhookokról keresel dokumentációt? Nézd meg a <a href="/faq#do-you-support-bounce-webhooks" class="alert-link">Támogatjátok a bounce webhookokat?</a> részt további információkért.
  <span>
  </span>
</div>

Igen, 2020. május 15-től elérhető ez a funkció. Egyszerűen hozzáadhatsz webhook(oka)t ugyanúgy, mint bármelyik címzettet! Kérjük, győződj meg róla, hogy a webhook URL-je "http" vagy "https" protokollal kezdődik.

<div class="alert my-3 alert-danger">
  <i class="fa fa-stop-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Fokozott adatvédelem:
  </strong>
  <span>
    Ha fizetős csomagod van (amely fokozott adatvédelmet kínál), akkor kérjük, menj a <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Saját fiók <i class="fa fa-angle-right"></i> Domain-ek</a> oldalra, és kattints a domained melletti "Aliasok" gombra a webhookok konfigurálásához. Ha többet szeretnél megtudni a fizetős csomagokról, nézd meg az <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Árazás</a> oldalunkat. Egyébként folytathatod az alábbi utasításokat.
  </span>
</div>

Ha ingyenes csomagod van, akkor egyszerűen adj hozzá egy új DNS <strong class="notranslate">TXT</strong> rekordot az alábbi módon:

Például, ha azt szeretném, hogy minden az `alias@example.com` címre érkező email továbbítódjon egy új [request bin](https://requestbin.com/r/en8pfhdgcculn?inspect) teszt végpontra:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Név/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Típus</th>
      <th>Válasz/Érték</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", vagy üres</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=alias:https://requestbin.com/r/en8pfhdgcculn</code></td>
    </tr>
  </tbody>
</table>

Vagy talán azt szeretnéd, hogy minden az `example.com` címre érkező email erre a végpontra továbbítódjon:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Név/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Típus</th>
      <th>Válasz/Érték</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", vagy üres</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=https://requestbin.com/r/en8pfhdgcculn</code></td>
    </tr>
  </tbody>
</table>

**Íme további megjegyzések a webhookokkal kapcsolatban:**

* Ha ellenőrizned kell a webhook payloadokat (hogy biztosan a mi szerverünkről érkeznek-e), akkor [oldd meg a távoli kliens IP címének kliens hosztnevét fordított lekérdezéssel](https://nodejs.org/api/dns.html#dnspromisesreverseip) – ennek `mx1.forwardemail.net` vagy `mx2.forwardemail.net` kell legyen.
  * Ellenőrizheted az IP-t a [közzétett IP címeinkkel](#what-are-your-servers-ip-addresses) is.
  * Ha fizetős csomagod van, akkor menj a Saját fiók → Domain-ek → Beállítások → Webhook aláírás payload ellenőrző kulcs oldalra a webhook kulcsod megszerzéséhez.
    * Biztonsági okokból bármikor megváltoztathatod ezt a kulcsot.
    * Számítsd ki és hasonlítsd össze az `X-Webhook-Signature` értéket a webhook kérésből a kulccsal számított törzsértékkel. Egy példa erre elérhető ezen a [Stack Overflow bejegyzésen](https://stackoverflow.com/a/68885281).
  * További információkért lásd a <https://github.com/forwardemail/free-email-forwarding/issues/235> vitát.
* Ha egy webhook nem válaszol `200` státuszkóddal, akkor a válaszát eltároljuk a [hiba naplóban](#do-you-store-error-logs) – ami hasznos a hibakereséshez.
* A webhook HTTP kérések legfeljebb 3-szor próbálkoznak minden SMTP kapcsolat kísérlet során, 60 másodperces maximális időkorláttal endpoint POST kérésenként. **Fontos megjegyezni, hogy ez nem azt jelenti, hogy csak 3-szor próbálkozik**, valójában folyamatosan próbálkozik az idő múlásával, SMTP 421-es kódot küldve (ami azt jelzi a küldőnek, hogy próbálja újra később) a 3. sikertelen HTTP POST kérés után. Ez azt jelenti, hogy az email napokig folyamatosan próbálkozik, amíg 200 státuszkódot nem kap.
* Automatikusan újrapróbálkozunk az alapértelmezett státusz és hibakódok alapján, amelyeket a [superagent retry metódusa](https://ladjs.github.io/superagent/#retrying-requests) használ (mi vagyunk a karbantartók).
* Egyesítjük ugyanarra az endpointra irányuló webhook HTTP kéréseket egyetlen kérésbe (nem több külön kérés), hogy erőforrást takarítsunk meg és gyorsítsuk a válaszidőt. Például, ha emailt küldesz a <webhook1@example.com>, <webhook2@example.com> és <webhook3@example.com> címekre, és mindegyik ugyanarra a *pontos* végpont URL-re van konfigurálva, akkor csak egy kérés lesz elküldve. Az egyesítés pontos végpont egyezés alapján történik, szigorú egyenlőséggel.
* Megjegyzendő, hogy a [mailparser](https://nodemailer.com/extras/mailparser/) könyvtár "simpleParser" metódusát használjuk az üzenet JSON-barát objektummá alakításához.
* A nyers email érték Stringként a "raw" tulajdonságban található.
* Az autentikációs eredmények a "dkim", "spf", "arc", "dmarc" és "bimi" tulajdonságokban vannak.
* A feldolgozott email fejléc a "headers" tulajdonságban található – de megjegyzendő, hogy a "headerLines" is használható egyszerűbb iteráláshoz és feldolgozáshoz.
* A webhookhoz tartozó csoportosított címzettek a "recipients" tulajdonságban vannak.
* Az SMTP munkamenet információi a "session" tulajdonságban találhatók. Ez tartalmazza az üzenet küldőjének adatait, az üzenet érkezési idejét, a HELO-t és a kliens hosztnevét. A kliens hoszt neve `session.clientHostname` értékként vagy a teljesen minősített domain név (fordított PTR lekérdezésből), vagy a `session.remoteAddress` zárójelezve (pl. `"[127.0.0.1]"`).
* Ha gyorsan szeretnéd lekérdezni az `X-Original-To` értékét, használhatod a `session.recipient` értékét (lásd az alábbi példát). Az `X-Original-To` egy olyan fejléc, amelyet hibakereséshez adunk az üzenetekhez az eredeti címzett (maszkolt továbbítás előtt) megjelenítésére.
* Ha el szeretnéd távolítani az `attachments` és/vagy `raw` tulajdonságokat a payload törzsből, egyszerűen add hozzá a `?attachments=false`, `?raw=false` vagy `?attachments=false&raw=false` lekérdezési paramétereket a webhook végpontod URL-jéhez (pl. `https://example.com/webhook?attachments=false&raw=false`).
* Ha vannak csatolmányok, azok a `attachments` tömbhöz lesznek hozzáfűzve Buffer értékekkel. Ezeket vissza tudod alakítani tartalommá JavaScript segítségével, például:
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

### Támogatjátok a reguláris kifejezéseket vagy regexet? {#do-you-support-regular-expressions-or-regex}

Igen, 2021. szeptember 27-től hozzáadtuk ezt a funkciót. Egyszerűen írhat reguláris kifejezéseket ("regex") az aliasok egyezéséhez és helyettesítések végrehajtásához.

A reguláris kifejezést támogató aliasok azok, amelyek `/`-vel kezdődnek és `/`-vel végződnek, és a címzettek email címek vagy webhookok. A címzettek tartalmazhatnak regex helyettesítést is (pl. `$1`, `$2`).

Két reguláris kifejezés zászlót támogatunk, az `i` és a `g`-t. Az `i` kis- és nagybetűket nem érzékelő zászló állandó alapértelmezett, és mindig érvényesül. A globális `g` zászlót Ön adhatja hozzá azzal, hogy a záró `/` után `/g`-t ír.

Megjegyzendő, hogy a regex támogatásunkkal a címzett részhez támogatjuk az <a href="#can-i-disable-specific-aliases">letiltott alias funkciót</a> is.

A reguláris kifejezések nem támogatottak a <a href="/disposable-addresses" target="_blank">globális vanity domaineken</a> (mivel ez biztonsági kockázatot jelenthet).

<div class="alert my-3 alert-danger">
  <i class="fa fa-stop-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Fokozott adatvédelmi védelem:
  </strong>
  <span>
    Ha fizetős csomagon van (amely fokozott adatvédelmi védelmet tartalmaz), kérjük, menjen a <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Saját fiók <i class="fa fa-angle-right"></i> Domain-ek</a> oldalra, és kattintson a domainje melletti "Aliasok" gombra az aliasok konfigurálásához, beleértve a reguláris kifejezéseket is. Ha többet szeretne megtudni a fizetős csomagokról, nézze meg a <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Árazás</a> oldalunkat.
  </span>
</div>

#### Példák a fokozott adatvédelmi védelemhez {#examples-for-enhanced-privacy-protection}

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Alias név</th>
      <th>Hatás</th>
      <th>Teszt</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>/^(linus|torvalds)$/</code></td>
      <td>E-mailek a `linus@example.com` vagy `torvalds@example.com` címekre</td>
      <td>(<a href="https://regexr.com/8gb8n" class="alert-link">teszt megtekintése a RegExr-en</a>)</td>
    </tr>
    <tr>
      <td><code>/^24highst(reet)$/</code></td>
      <td>E-mailek a `24highst@example.com` vagy `24highstreet@example.com` címekre</td>
      <td>(<a href="https://regexr.com/8g9rb" class="alert-link">teszt megtekintése a RegExr-en</a>)</td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tipp:
  </strong>
    Ezeket a <a href="https://regexr.com" class="alert-link">RegExr</a> oldalon tesztelheti, írja be a kifejezést a felső mezőbe, majd egy példány alias-t az alatta lévő szövegmezőbe. Ha egyezik, kék színű lesz.
  <span>
  </span>
</div>

#### Példák az ingyenes csomaghoz {#examples-for-the-free-plan}

Ha az ingyenes csomagon van, egyszerűen adjon hozzá egy új DNS <strong class="notranslate">TXT</strong> rekordot az alábbi példák egyikével vagy többel:

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Egyszerű példa:</strong> Ha azt szeretném, hogy minden email, amely a `linus@example.com` vagy `torvalds@example.com` címekre érkezik, továbbítódjon a `user@gmail.com` címre:
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Név/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Típus</th>
      <th>Válasz/Érték</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", vagy üres</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(linus|torvalds)$/:user@gmail.com</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Keresztnév Vezetéknév helyettesítési példa:</strong> Tegyük fel, hogy az összes céges email címe a `firstname.lastname@example.com` mintát követi. Ha azt szeretném, hogy minden email, amely a `firstname.lastname@example.com` mintára érkezik, továbbítódjon a `firstname.lastname@company.com` címre helyettesítési támogatással (<a href="https://regexr.com/66hnu" class="alert-link">teszt megtekintése a RegExr-en</a>):
</div>
<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Név/Gép/Alias</th>
      <th class="text-center">TTL</th>
      <th>Típus</th>
      <th>Válasz/Érték</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", vagy üres</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^([A-Za-z]+)+\.([A-Za-z]+)+$/:$1.$2@company.com</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Plusz szimbólum szűrés helyettesítési példa:</strong> Ha azt szeretném, hogy minden email, ami az `info@example.com` vagy `support@example.com` címre érkezik, továbbítódjon a `user+info@gmail.com` vagy `user+support@gmail.com` címre (helyettesítési támogatással) (<a href="https://regexr.com/66ho7" class="alert-link">teszt megtekintése RegExr-en</a>):
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Név/Gép/Alias</th>
      <th class="text-center">TTL</th>
      <th>Típus</th>
      <th>Válasz/Érték</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", vagy üres</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(support|info)$/:user+$1@gmail.com</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Webhook lekérdezési karakterlánc helyettesítési példa:</strong> Talán azt szeretnéd, hogy minden email, ami az `example.com` címre érkezik, egy <a href="#do-you-support-webhooks" class="alert-link">webhookhoz</a> menjen, és dinamikus lekérdezési kulcsa legyen "to", amelynek értéke az email cím felhasználónév része (<a href="https://regexr.com/66ho4" class="alert-link">teszt megtekintése RegExr-en</a>):
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Név/Gép/Alias</th>
      <th class="text-center">TTL</th>
      <th>Típus</th>
      <th>Válasz/Érték</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", vagy üres</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(.*?)$/:https://example.com/webhook?username=$1</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Csendes elutasítás példa:</strong> Ha azt szeretnéd, hogy minden email, ami egy bizonyos mintának megfelel, le legyen tiltva és csendesen elutasítva legyen (a feladó számára úgy tűnik, mintha az üzenet sikeresen elküldésre került volna, de valójában sehová sem jut el) `250` státuszkóddal (lásd <a href="#can-i-disable-specific-aliases" class="alert-link">Lehet-e letiltani bizonyos aliasokat</a>), akkor egyszerűen használd ugyanazt a megközelítést egyetlen felkiáltójellel "!". Ez azt jelzi a feladónak, hogy az üzenet sikeresen kézbesítve lett, de valójában sehová sem jutott (pl. fekete lyuk vagy `/dev/null`).
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Név/Gép/Alias</th>
      <th class="text-center">TTL</th>
      <th>Típus</th>
      <th>Válasz/Érték</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", vagy üres</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(linus|torvalds)$/:!</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Lágy elutasítás példa:</strong> Ha azt szeretnéd, hogy minden email, ami egy bizonyos mintának megfelel, le legyen tiltva és lágy elutasítással legyen visszautasítva `421` státuszkóddal (lásd <a href="#can-i-disable-specific-aliases" class="alert-link">Lehet-e letiltani bizonyos aliasokat</a>), akkor egyszerűen használd ugyanazt a megközelítést dupla felkiáltójellel "!!". Ez azt jelzi a feladónak, hogy próbálja újra elküldeni az emailt, és az ilyen aliasra érkező emaileket körülbelül 5 napig újrapróbálják, majd véglegesen elutasítják.
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Név/Gép/Alias</th>
      <th class="text-center">TTL</th>
      <th>Típus</th>
      <th>Válasz/Érték</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", vagy üres</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(linus|torvalds)$/:!!</code></td>
    </tr>
  </tbody>
</table>
<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Kemény elutasítás példája:</strong> Ha azt szeretné, hogy egy bizonyos mintának megfelelő összes e-mail le legyen tiltva és kemény elutasítással, `550` státuszkóddal visszautasítva legyen (lásd <a href="#can-i-disable-specific-aliases" class="alert-link">Lehet-e letiltani bizonyos aliasokat</a>), akkor egyszerűen használja ugyanazt a megközelítést három felkiáltójellel "!!!". Ez azt jelzi a küldőnek, hogy állandó hiba történt, és az e-mailek nem próbálkoznak újra, el lesznek utasítva ezen alias esetén.
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Név/Gép/Alias</th>
      <th class="text-center">TTL</th>
      <th>Típus</th>
      <th>Válasz/Érték</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", vagy üres</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(linus|torvalds)$/:!!!</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tipp:
  </strong>
    Kíváncsi, hogyan írjon reguláris kifejezést, vagy tesztelni szeretné a helyettesítést? Látogasson el az ingyenes reguláris kifejezés tesztelő weboldalra, a <a href="https://regexr.com" class="alert-link">RegExr</a>-re a <a href="https://regexr.com/" class="alert-link">https://regexr.com</a> címen.
  <span>
  </span>
</div>

### Mik az Önök kimenő SMTP korlátai {#what-are-your-outbound-smtp-limits}

Felhasználókat és domaineket napi 300 kimenő SMTP üzenetre korlátozunk. Ez havi átlagban több mint 9000 e-mailt jelent. Ha ennél többre van szüksége, vagy rendszeresen nagy méretű e-maileket küld, kérjük, [vegye fel velünk a kapcsolatot](https://forwardemail.net/help).

### Szükséges engedély az SMTP engedélyezéséhez? {#do-i-need-approval-to-enable-smtp}

Igen, kérjük, vegye figyelembe, hogy az IP-hírnév megőrzése és a kézbesíthetőség biztosítása érdekében a Forward Email manuális felülvizsgálati folyamatot alkalmaz domainenként a kimenő SMTP engedélyezéséhez. Küldjön e-mailt a <support@forwardemail.net> címre vagy nyisson egy [segítségkérést](https://forwardemail.net/help) az engedélyezéshez. Ez általában kevesebb, mint 24 órát vesz igénybe, a legtöbb kérés 1-2 órán belül teljesül. A közeljövőben célunk, hogy ezt a folyamatot azonnalivá tegyük további spam-ellenőrzésekkel és riasztásokkal. Ez a folyamat biztosítja, hogy az Ön e-mailjei eljussanak a beérkező levelek közé, és az üzenetek ne kerüljenek spam mappába.

### Mik az SMTP szerver konfigurációs beállításai? {#what-are-your-smtp-server-configuration-settings}

Szerverünk a `smtp.forwardemail.net`, amelyet a <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">állapotoldalunkon</a> is figyelünk.

Támogatja az IPv4 és IPv6 protokollokat, és elérhető a `465` és `2465` portokon SSL/TLS-hez (ajánlott), valamint a `587`, `2587`, `2525` és `25` portokon TLS-hez (STARTTLS).

**2025 októberétől** támogatjuk a **régi TLS 1.0** kapcsolatokat a `2455` (SSL/TLS) és `2555` (STARTTLS) portokon régebbi eszközök, például nyomtatók, szkennerek, kamerák és régi e-mail kliensek számára, amelyek nem támogatják a modern TLS verziókat. Ezek a portok alternatívát kínálnak a Gmail, Yahoo, Outlook és más szolgáltatók számára, amelyek megszüntették a régebbi TLS protokollok támogatását.

> \[!CAUTION]
> **Régi TLS 1.0 támogatás (2455 és 2555 portok)**: Ezek a portok az elavult TLS 1.0 protokollt használják, amely ismert biztonsági sebezhetőségekkel rendelkezik (BEAST, POODLE). Csak akkor használja ezeket a portokat, ha az eszköze feltétlenül nem támogatja a TLS 1.2 vagy újabb verziókat. Erősen ajánljuk az eszköz firmware-ének frissítését vagy modern e-mail kliensek használatát, amikor csak lehetséges. Ezek a portok kizárólag régi hardverek kompatibilitására szolgálnak (régi nyomtatók, szkennerek, kamerák, IoT eszközök).

|                                     Protokoll                                     | Hosztnév                 |            Portok            |        IPv4        |        IPv6        | Megjegyzések                           |
| :------------------------------------------------------------------------------: | ------------------------ | :--------------------------: | :----------------: | :----------------: | ------------------------------------- |
|                              `SSL/TLS` **Ajánlott**                             | `smtp.forwardemail.net`  |        `465`, `2465`         | :white_check_mark: | :white_check_mark: | Modern TLS 1.2+ (Ajánlott)            |
|         `TLS` ([STARTTLS](https://wikipedia.org/wiki/Opportunistic_TLS))         | `smtp.forwardemail.net`  | `587`, `2587`, `2525`, `25`  | :white_check_mark: | :white_check_mark: | Támogatott (előnyben részesítendő az SSL/TLS `465` port) |
|                             `SSL/TLS` **Csak régi**                             | `smtp.forwardemail.net`  |            `2455`            | :white_check_mark: | :white_check_mark: | :warning: TLS 1.0 csak régi eszközöknek |
| `TLS` ([STARTTLS](https://wikipedia.org/wiki/Opportunistic_TLS)) **Csak régi**   | `smtp.forwardemail.net`  |            `2555`            | :white_check_mark: | :white_check_mark: | :warning: TLS 1.0 csak régi eszközöknek |
| Bejelentkezés | Példa                     | Leírás                                                                                                                                                                                   |
| ------------ | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Felhasználónév | `user@example.com`        | Egy alias e-mail címe, amely létezik a domainhez a <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Saját fiók <i class="fa fa-angle-right"></i> Domain-ek</a> alatt. |
| Jelszó       | `************************` | Alias                                                                                                                                                                                    |

Ahhoz, hogy SMTP-vel küldjön kimenő e-mailt, az **SMTP felhasználónév** az alias e-mail címe kell legyen, amely létezik a domainhez a <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Saját fiók <i class="fa fa-angle-right"></i> Domain-ek</a> alatt – és az **SMTP jelszó** alias-specifikusan generált jelszó kell legyen.

Kérjük, tekintse meg a [Támogatják az e-mail küldést SMTP-vel](#do-you-support-sending-email-with-smtp) részt a lépésről lépésre szóló útmutatásért.

### Mik az IMAP szerver konfigurációs beállításai {#what-are-your-imap-server-configuration-settings}

A szerverünk `imap.forwardemail.net`, és a <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">állapotoldalunkon</a> is figyeljük.

Támogatja az IPv4 és IPv6 protokollokat, és elérhető a `993` és `2993` portokon SSL/TLS kapcsolaton keresztül.

|         Protokoll        | Hosztnév                 |     Portok    |        IPv4        |        IPv6        |
| :----------------------: | ------------------------ | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **Előnyben**   | `imap.forwardemail.net`  | `993`, `2993` | :white_check_mark: | :white_check_mark: |

| Bejelentkezés | Példa                     | Leírás                                                                                                                                                                                   |
| ------------ | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Felhasználónév | `user@example.com`        | Egy alias e-mail címe, amely létezik a domainhez a <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Saját fiók <i class="fa fa-angle-right"></i> Domain-ek</a> alatt. |
| Jelszó       | `************************` | Alias-specifikusan generált jelszó.                                                                                                                                                       |

Ahhoz, hogy IMAP-pal csatlakozzon, az **IMAP felhasználónév** az alias e-mail címe kell legyen, amely létezik a domainhez a <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Saját fiók <i class="fa fa-angle-right"></i> Domain-ek</a> alatt – és az **IMAP jelszó** alias-specifikusan generált jelszó kell legyen.

Kérjük, tekintse meg a [Támogatják az e-mail fogadást IMAP-pal](#do-you-support-receiving-email-with-imap) részt a lépésről lépésre szóló útmutatásért.

### Mik az POP3 szerver konfigurációs beállításai {#what-are-your-pop3-server-configuration-settings}

A szerverünk `pop3.forwardemail.net`, és a <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">állapotoldalunkon</a> is figyeljük.

Támogatja az IPv4 és IPv6 protokollokat, és elérhető a `995` és `2995` portokon SSL/TLS kapcsolaton keresztül.

|         Protokoll        | Hosztnév                 |     Portok    |        IPv4        |        IPv6        |
| :----------------------: | ------------------------ | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **Előnyben**   | `pop3.forwardemail.net`  | `995`, `2995` | :white_check_mark: | :white_check_mark: |
| Bejelentkezés | Példa                     | Leírás                                                                                                                                                                                  |
| ------------ | ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Felhasználónév | `user@example.com`        | Egy alias e-mail címe, amely létezik a domainhez a <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Saját fiók <i class="fa fa-angle-right"></i> Domain-ek</a> alatt. |
| Jelszó       | `************************` | Alias-specifikus generált jelszó.                                                                                                                                                       |

Ahhoz, hogy POP3-mal csatlakozzon, a **POP3 felhasználónév** az alias e-mail címe kell legyen, amely létezik a domainhez a <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Saját fiók <i class="fa fa-angle-right"></i> Domain-ek</a> alatt – és az **IMAP jelszó** alias-specifikus generált jelszó kell legyen.

Kérjük, tekintse meg a [Támogatjátok a POP3-at](#do-you-support-pop3) részt a lépésről lépésre szóló útmutatóért.

### Hogyan állíthatom be az e-mail automatikus felismerést a domainemhez {#how-do-i-set-up-email-autodiscovery-for-my-domain}

Az e-mail automatikus felismerés lehetővé teszi az olyan e-mail kliensek számára, mint a **Thunderbird**, **Apple Mail**, **Microsoft Outlook** és mobil eszközök, hogy automatikusan felismerjék a helyes IMAP, SMTP, POP3, CalDAV és CardDAV szerverbeállításokat, amikor a felhasználó hozzáadja az e-mail fiókját. Ezt az [RFC 6186](https://www.rfc-editor.org/rfc/rfc6186.html) (e-mail) és az [RFC 6764](https://www.rfc-editor.org/rfc/rfc6764.html) (CalDAV/CardDAV) szabványok definiálják, és DNS SRV rekordokat használnak.

A Forward Email autodiscovery rekordokat tesz közzé a `forwardemail.net` domainen. Vagy közvetlenül hozzáadhat SRV rekordokat a domainjéhez, vagy használhat egy egyszerűbb CNAME megoldást.

#### A lehetőség: CNAME rekordok (legkönnyebb) {#option-a-cname-records-simplest}

Adja hozzá ezt a két CNAME rekordot a domain DNS-éhez. Ez az autodiscovery-t a Forward Email szervereire delegálja:

|  Típus | Név/Host       | Cél/Érték                      |
| :----: | -------------- | ------------------------------ |
| CNAME  | `autoconfig`   | `autoconfig.forwardemail.net`  |
| CNAME  | `autodiscover` | `autodiscover.forwardemail.net` |

Az `autoconfig` rekordot a **Thunderbird** és más Mozilla-alapú kliensek használják. Az `autodiscover` rekordot a **Microsoft Outlook** használja.

#### B lehetőség: SRV rekordok (közvetlen) {#option-b-srv-records-direct}

Ha inkább közvetlenül szeretné hozzáadni a rekordokat (vagy a DNS szolgáltatója nem támogatja a CNAME-t az aldomainen), adja hozzá ezeket az SRV rekordokat a domainjéhez:

| Típus | Név/Host           | Prioritás | Súly | Port | Cél/Érték                  | Cél                                   |
| :----: | ------------------ | :-------: | :---: | :--: | -------------------------- | ------------------------------------ |
| SRV   | `_imaps._tcp`       |     0     |  1    |  993 | `imap.forwardemail.net`    | IMAP SSL/TLS-en keresztül (ajánlott) |
| SRV   | `_imap._tcp`        |     0     |  0    |   0  | `.`                        | Egyszerű szöveges IMAP letiltva      |
| SRV   | `_submissions._tcp` |     0     |  1    |  465 | `smtp.forwardemail.net`    | SMTP beküldés (SSL/TLS, ajánlott)    |
| SRV   | `_submission._tcp`  |     5     |  1    |  587 | `smtp.forwardemail.net`    | SMTP beküldés (STARTTLS)              |
| SRV   | `_pop3s._tcp`       |    10     |  1    |  995 | `pop3.forwardemail.net`    | POP3 SSL/TLS-en keresztül             |
| SRV   | `_pop3._tcp`        |     0     |  0    |   0  | `.`                        | Egyszerű szöveges POP3 letiltva      |
| SRV   | `_caldavs._tcp`     |     0     |  1    |  443 | `caldav.forwardemail.net`  | CalDAV TLS-en keresztül (naptárak)   |
| SRV   | `_caldav._tcp`      |     0     |  0    |   0  | `.`                        | Egyszerű szöveges CalDAV letiltva    |
| SRV   | `_carddavs._tcp`    |     0     |  1    |  443 | `carddav.forwardemail.net` | CardDAV TLS-en keresztül (névjegyek) |
| SRV   | `_carddav._tcp`     |     0     |  0    |   0  | `.`                        | Egyszerű szöveges CardDAV letiltva   |
> \[!NOTE]
> Az IMAP alacsonyabb prioritású értékkel rendelkezik (0), mint a POP3 (10), ami azt jelzi az e-mail klienseknek, hogy ha mindkettő elérhető, akkor az IMAP-et részesítsék előnyben a POP3 helyett. Azok a rekordok, amelyek célpontja `.` (egyetlen pont), azt jelzik, hogy ezen protokollok titkosítatlan (plaintext) verziói szándékosan le vannak tiltva az [RFC 6186 3.4 szakasza](https://www.rfc-editor.org/rfc/rfc6186.html#section-3.4) szerint. A CalDAV és CardDAV SRV rekordok a naptár- és névjegy automatikus felfedezéshez az [RFC 6764](https://www.rfc-editor.org/rfc/rfc6764.html) szabványt követik.

#### Mely e-mail kliensek támogatják az automatikus felfedezést? {#which-email-clients-support-autodiscovery}

| Kliens             | E-mail                                           | CalDAV/CardDAV                             |
| ------------------ | ------------------------------------------------ | ------------------------------------------ |
| Thunderbird        | `autoconfig` CNAME vagy SRV rekordok             | `autoconfig` XML vagy SRV rekordok (RFC 6764) |
| Apple Mail (macOS) | SRV rekordok (RFC 6186)                           | SRV rekordok (RFC 6764)                     |
| Apple Mail (iOS)   | SRV rekordok (RFC 6186)                           | SRV rekordok (RFC 6764)                     |
| Microsoft Outlook  | `autodiscover` CNAME vagy `_autodiscover._tcp` SRV | Nem támogatott                             |
| GNOME (Evolution)  | SRV rekordok (RFC 6186)                           | SRV rekordok (RFC 6764)                     |
| KDE (KMail)        | SRV rekordok (RFC 6186)                           | SRV rekordok (RFC 6764)                     |
| eM Client          | `autoconfig` vagy `autodiscover`                  | SRV rekordok (RFC 6764)                     |

> \[!TIP]
> A legjobb kompatibilitás érdekében minden klienssel javasoljuk az **A opció** (CNAME rekordok) használatát az **B opció** SRV rekordjaival kombinálva. A CNAME megközelítés önmagában lefedi a legtöbb e-mail klienst. A CalDAV/CardDAV SRV rekordok biztosítják, hogy a naptár- és névjegy kliensek is automatikusan felfedezhessék a szerver beállításait.


## Biztonság {#security-1}

### Fejlett szerverbiztosítási technikák {#advanced-server-hardening-techniques}

> \[!TIP]
> Tudjon meg többet biztonsági infrastruktúránkról a [Biztonsági oldalunkon](/security).

A Forward Email számos szerverbiztosítási technikát alkalmaz infrastruktúránk és adatai védelme érdekében:

1. **Hálózatbiztonság**:
   * IP tables tűzfal szigorú szabályokkal
   * Fail2ban a brute force támadások ellen
   * Rendszeres biztonsági auditok és behatolás-tesztelések
   * Csak VPN-en keresztüli adminisztratív hozzáférés

2. **Rendszerbiztosítás**:
   * Minimális csomagtelepítés
   * Rendszeres biztonsági frissítések
   * SELinux érvényesítő módban
   * Root SSH hozzáférés letiltva
   * Csak kulcs alapú hitelesítés

3. **Alkalmazásbiztonság**:
   * Content Security Policy (CSP) fejlécek
   * HTTPS Strict Transport Security (HSTS)
   * XSS elleni védelmi fejlécek
   * Frame opciók és referrer policy fejlécek
   * Rendszeres függőség auditok

4. **Adatvédelem**:
   * Teljes lemezes titkosítás LUKS-szal
   * Biztonságos kulcskezelés
   * Rendszeres titkosított biztonsági mentések
   * Adatminimalizálási gyakorlatok

5. **Megfigyelés és reagálás**:
   * Valós idejű behatolás-észlelés
   * Automatikus biztonsági szkennelés
   * Központosított naplózás és elemzés
   * Eseménykezelési eljárások

> \[!IMPORTANT]
> Biztonsági gyakorlatainkat folyamatosan frissítjük az új fenyegetések és sebezhetőségek kezelésére.

> \[!TIP]
> Maximális biztonság érdekében javasoljuk szolgáltatásunk használatát végpontok közötti titkosítással OpenPGP segítségével.

### Van SOC 2 vagy ISO 27001 tanúsítványuk? {#do-you-have-soc-2-or-iso-27001-certifications}

> \[!NOTE]
> A Forward Email olyan infrastruktúrán működik, amelyet tanúsított alvállalkozók biztosítanak az iparági szabványoknak való megfelelés érdekében.

A Forward Email közvetlenül nem rendelkezik SOC 2 Type II vagy ISO 27001 tanúsítványokkal. Azonban a szolgáltatás tanúsított alvállalkozók által biztosított infrastruktúrán működik:

* **DigitalOcean**: SOC 2 Type II és SOC 3 Type II tanúsított (a Schellman & Company LLC auditálta), ISO 27001 tanúsított több adatközpontban. Részletek: <https://www.digitalocean.com/trust/certification-reports>
* **Vultr**: SOC 2+ (HIPAA) tanúsított, ISO/IEC tanúsítványok: 20000-1:2018, 27001:2022, 27017:2015, 27018:2019. Részletek: <https://www.vultr.com/legal/compliance/>

* **DataPacket**: SOC 2 kompatibilis (a tanúsítvány megszerzéséhez közvetlenül a DataPackethez kell fordulni), vállalati szintű infrastruktúra szolgáltató (Denver helyszín). Részletek: <https://www.datapacket.com/datacenters/denver>

A Forward Email követi az iparági legjobb gyakorlatokat a biztonsági auditok terén, és rendszeresen együttműködik független biztonsági kutatókkal. Forrás: <https://forwardemail.net/technical-whitepaper.pdf#page=36>

### Használnak TLS titkosítást az e-mailek továbbításához? {#do-you-use-tls-encryption-for-email-forwarding}

Igen. A Forward Email szigorúan érvényesíti a TLS 1.2+ használatát minden kapcsolathoz (HTTPS, SMTP, IMAP, POP3), és megvalósítja az MTA-STS-t a továbbfejlesztett TLS támogatás érdekében. A megvalósítás tartalmazza:

* TLS 1.2+ érvényesítése minden e-mail kapcsolathoz
* ECDHE (Elliptic Curve Diffie-Hellman Ephemeral) kulcscsere a tökéletes előre titoktartásért
* Modern titkosító készletek rendszeres biztonsági frissítésekkel
* HTTP/2 támogatás a jobb teljesítmény és biztonság érdekében
* HSTS (HTTP Strict Transport Security) előtöltéssel a főbb böngészőkben
* **MTA-STS (Mail Transfer Agent Strict Transport Security)** a szigorú TLS érvényesítéshez

Forrás: <https://forwardemail.net/technical-whitepaper.pdf#page=25>

**MTA-STS megvalósítás**: A Forward Email szigorú MTA-STS érvényesítést valósít meg a kódbázisban. Amikor TLS hibák lépnek fel és az MTA-STS érvényesítve van, a rendszer 421 SMTP státuszkódokat ad vissza, hogy az e-mailek később újrapróbálkozzanak, ahelyett, hogy biztonságtalanul kézbesülnének. A megvalósítás részletei:

* TLS hiba észlelés: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-tls-error.js>
* MTA-STS érvényesítés a send-email segédfüggvényben: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/send-email.js>

Harmadik fél általi validáció: <https://www.hardenize.com/report/forwardemail.net/1750312779> "Jó" értékeléseket mutat minden TLS és szállítási biztonsági intézkedésre.

### Megőrzik az e-mail hitelesítési fejlécet? {#do-you-preserve-email-authentication-headers}

Igen. A Forward Email átfogóan megvalósítja és megőrzi az e-mail hitelesítési fejléceket:

* **SPF (Sender Policy Framework)**: Megfelelően megvalósított és megőrzött
* **DKIM (DomainKeys Identified Mail)**: Teljes támogatás megfelelő kulcskezeléssel
* **DMARC**: Házirend érvényesítés az SPF vagy DKIM ellenőrzésen megbukó e-mailek esetén
* **ARC**: Bár nincs kifejezetten részletezve, a szolgáltatás tökéletes megfelelési pontszámai átfogó hitelesítési fejléc kezelést sugallnak

Forrás: <https://forwardemail.net/technical-whitepaper.pdf#page=31>

Validáció: Az Internet.nl Mail Test 100/100 pontszámot mutat kifejezetten az "SPF, DKIM és DMARC" megvalósításra. A Hardenize értékelés "Jó" minősítést ad az SPF és DMARC esetén: <https://www.hardenize.com/report/forwardemail.net/1750312779>

### Megőrzik az eredeti e-mail fejléceket és megakadályozzák a hamisítást? {#do-you-preserve-original-email-headers-and-prevent-spoofing}

> \[!TIP]
> A Forward Email kifinomult hamisítás elleni védelmet valósít meg az e-mail visszaélések megelőzésére.

A Forward Email megőrzi az eredeti e-mail fejléceket, miközben átfogó hamisítás elleni védelmet valósít meg az MX kódbázison keresztül:

* **Fejléc megőrzése**: Az eredeti hitelesítési fejlécek megmaradnak a továbbítás során
* **Hamisítás elleni védelem**: A DMARC házirend érvényesítése megakadályozza a fejléc hamisítást azáltal, hogy elutasítja az SPF vagy DKIM ellenőrzésen megbukó e-maileket
* **Fejléc injekció megelőzése**: Bemeneti érvényesítés és tisztítás a striptags könyvtár használatával
* **Fejlett védelem**: Kifinomult adathalászat felismerés hamisítás és személyesítés elleni védelemmel, valamint felhasználói értesítési rendszerekkel

**MX megvalósítás részletei**: Az alapvető e-mail feldolgozó logikát az MX szerver kódbázisa kezeli, különösen:

* Fő MX adatkezelő: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>
* Tetszőleges e-mail szűrés (hamisítás elleni): <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-arbitrary.js>

Az `isArbitrary` segédfüggvény kifinomult hamisítás elleni szabályokat valósít meg, beleértve a domain személyesítés, tiltott kifejezések és különféle adathalász minták felismerését.
### Hogyan védik meg a spam és visszaélések ellen {#how-do-you-protect-against-spam-and-abuse}

A Forward Email átfogó, többrétegű védelmet valósít meg:

* **Korlátozott sebesség**: Alkalmazva hitelesítési kísérletekre, API végpontokra és SMTP kapcsolatokra
* **Erőforrás izoláció**: Felhasználók között, hogy megakadályozza a nagy forgalmú felhasználók hatását
* **DDoS védelem**: Többrétegű védelem a DataPacket Shield rendszerén és a Cloudflare-en keresztül
* **Automatikus skálázás**: Dinamikus erőforrás-igazítás a kereslet alapján
* **Visszaélés megelőzés**: Felhasználóspecifikus visszaélés-megelőző ellenőrzések és hash-alapú blokkolás rosszindulatú tartalom esetén
* **E-mail hitelesítés**: SPF, DKIM, DMARC protokollok fejlett adathalászat-észleléssel

Források:

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver> (DDoS védelem részletei)
* <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/abuse-prevention-by-user-id.js>

### Tárolnak-e e-mail tartalmat lemezen {#do-you-store-email-content-on-disk}

> \[!IMPORTANT]
> A Forward Email nulla-tudású architektúrát használ, amely megakadályozza, hogy az e-mail tartalom lemezre íródjon.

* **Nulla-tudású architektúra**: Egyénileg titkosított SQLite postaládák, így a Forward Email nem fér hozzá az e-mail tartalomhoz
* **Memóriában történő feldolgozás**: Az e-mailek feldolgozása teljes egészében memóriában történik, elkerülve a lemezhasználatot
* **Nincs tartalom naplózás**: „Nem naplózunk vagy tárolunk e-mail tartalmat vagy metaadatokat lemezen”
* **Sandboxolt titkosítás**: A titkosítási kulcsok soha nem tárolódnak lemezen tiszta szövegként

**MX kódalap bizonyíték**: Az MX szerver az e-maileket teljes egészében memóriában dolgozza fel, anélkül, hogy a tartalmat lemezre írna. A fő e-mail feldolgozó kezelő ezt a memóriában történő megközelítést mutatja be: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

Források:

* <https://forwardemail.net/technical-whitepaper.pdf#page=10> (Összefoglaló)
* <https://forwardemail.net/technical-whitepaper.pdf#page=59> (Nulla-tudás részletek)
* <https://forwardemail.net/technical-whitepaper.pdf#page=21> (Sandboxolt titkosítás)

### Kiszivároghat-e az e-mail tartalom rendszerösszeomlás esetén {#can-email-content-be-exposed-during-system-crashes}

Nem. A Forward Email átfogó védelmi intézkedéseket alkalmaz az összeomlás miatti adatkiszivárgás ellen:

* **Core dumpok letiltva**: Megakadályozza a memória kiszivárgását összeomláskor
* **Swap memória letiltva**: Teljesen letiltva, hogy megakadályozza az érzékeny adatok kinyerését a swap fájlokból
* **Memóriában történő architektúra**: Az e-mail tartalom csak a feldolgozás ideje alatt létezik a volatilis memóriában
* **Titkosítási kulcs védelem**: A kulcsok soha nem tárolódnak lemezen tiszta szövegként
* **Fizikai biztonság**: LUKS v2 titkosított lemezek megakadályozzák az adatok fizikai elérését
* **USB tároló letiltva**: Megakadályozza az illetéktelen adatkinyerést

**Hibakezelés rendszerproblémák esetén**: A Forward Email `isCodeBug` és `isTimeoutError` segédfüggvényeket használ annak biztosítására, hogy ha bármilyen adatbázis-kapcsolódási probléma, DNS hálózati/blokkolási probléma vagy upstream kapcsolódási probléma lép fel, a rendszer 421 SMTP státuszkódot ad vissza, így az e-mailek később újrapróbálkoznak, nem vesznek el vagy nem szivárognak ki.

Megvalósítási részletek:

* Hibakategorizálás: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js>
* Timeout hiba kezelése MX feldolgozásban: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

Forrás: <https://forwardemail.net/technical-whitepaper.pdf#page=15>

### Kik férnek hozzá az e-mail infrastruktúrához {#who-has-access-to-your-email-infrastructure}

A Forward Email átfogó hozzáférés-ellenőrzést valósít meg minimális, 2-3 fős mérnöki csapatának hozzáférésére szigorú 2FA követelményekkel:

* **Szerepkör alapú hozzáférés-vezérlés**: Csapatfiókokhoz erőforrás-alapú jogosultságokkal
* **Legkisebb jogosultság elve**: Minden rendszerben alkalmazva
* **Feladatok szétválasztása**: Működési szerepek között
* **Felhasználókezelés**: Külön telepítő és devops felhasználók eltérő jogosultságokkal
* **Root bejelentkezés letiltva**: Hozzáférés csak megfelelően hitelesített fiókokon keresztül
* **Szigorú 2FA**: Nincs SMS alapú 2FA a MiTM támadások kockázata miatt – csak alkalmazás alapú vagy hardver tokenek
* **Átfogó audit naplózás**: Érzékeny adatok maszkolásával
* **Automatizált anomália észlelés**: Szokatlan hozzáférési mintákra
* **Rendszeres biztonsági felülvizsgálatok**: Hozzáférési naplókról
* **Evil Maid támadás elleni védelem**: USB tároló letiltva és egyéb fizikai biztonsági intézkedések
Források:

* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (Engedélyezési szabályok)
* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (Hálózatbiztonság)
* <https://forwardemail.net/technical-whitepaper.pdf#page=15> (Evil maid támadás megelőzése)

### Milyen infrastruktúra szolgáltatókat használnak {#what-infrastructure-providers-do-you-use}

> \[!IMPORTANT]
> A Forward Email több infrastruktúra alvállalkozót használ átfogó megfelelőségi tanúsítványokkal.

A teljes részletek elérhetők a GDPR megfelelőségi oldalunkon: <https://forwardemail.net/gdpr>

**Elsődleges infrastruktúra alvállalkozók:**

| Szolgáltató     | Adatvédelmi keretrendszer tanúsítva | GDPR megfelelőségi oldal                                                                 |
| --------------- | ----------------------------------- | ---------------------------------------------------------------------------------------- |
| **Cloudflare**  | ✅ Igen                             | <https://www.cloudflare.com/trust-hub/gdpr/>                                            |
| **DataPacket**  | ❌ Nem                             | <https://www.datapacket.com/privacy-policy>                                              |
| **DigitalOcean**| ❌ Nem                             | <https://www.digitalocean.com/legal/gdpr>                                                |
| **GitHub**      | ✅ Igen                             | <https://docs.github.com/en/site-policy/privacy-policies/github-data-protection-agreement> |
| **Vultr**       | ❌ Nem                             | <https://www.vultr.com/legal/eea-gdpr-privacy/>                                          |

**Részletes tanúsítványok:**

**DigitalOcean**

* SOC 2 Type II & SOC 3 Type II (a Schellman & Company LLC auditálta)
* ISO 27001 tanúsítvány több adatközpontban
* PCI-DSS megfelelőség
* CSA STAR 1. szintű tanúsítvány
* APEC CBPR PRP tanúsítvány
* Részletek: <https://www.digitalocean.com/trust/certification-reports>

**Vultr**

* SOC 2+ (HIPAA) tanúsítvány
* PCI kereskedői megfelelőség
* CSA STAR 1. szintű tanúsítvány
* ISO/IEC 20000-1:2018, 27001:2022, 27017:2015, 27018:2019
* Részletek: <https://www.vultr.com/legal/compliance/>

**DataPacket**

* SOC 2 megfelelőség (tanúsítvány beszerzéséhez közvetlenül a DataPackethez kell fordulni)
* Vállalati szintű infrastruktúra (Denver helyszín)
* DDoS védelem a Shield kiberbiztonsági csomagon keresztül
* 24/7 technikai támogatás
* Globális hálózat 58 adatközponttal
* Részletek: <https://www.datapacket.com/datacenters/denver>

**GitHub**

* Adatvédelmi keretrendszer tanúsítva (EU-USA, Svájc-USA és UK kiterjesztés)
* Forráskód tárolás, CI/CD és projektmenedzsment
* GitHub Adatvédelmi Megállapodás elérhető
* Részletek: <https://docs.github.com/en/site-policy/privacy-policies/github-data-protection-agreement>

**Fizetési feldolgozók:**

* **Stripe**: Adatvédelmi keretrendszer tanúsítva - <https://stripe.com/legal/privacy-center>
* **PayPal**: Nem DPF tanúsított - <https://www.paypal.com/uk/legalhub/privacy-full>

### Kínálnak adatfeldolgozási megállapodást (DPA)? {#do-you-offer-a-data-processing-agreement-dpa}

Igen, a Forward Email átfogó Adatfeldolgozási Megállapodást (DPA) kínál, amely aláírható vállalati szerződésünk részeként. A DPA másolata elérhető itt: <https://forwardemail.net/dpa>

**DPA részletek:**

* Lefedi a GDPR megfelelést és az EU-USA/Svájc-USA Privacy Shield keretrendszereket
* Automatikusan elfogadott a Szolgáltatási Feltételeink elfogadásakor
* A szabványos DPA-hoz nincs szükség külön aláírásra
* Egyedi DPA megállapodások elérhetők vállalati licenc keretében

**GDPR megfelelőségi keretrendszer:**
DPA-nk részletezi a GDPR-nak és a nemzetközi adatátviteli követelményeknek való megfelelést. Teljes információ elérhető itt: <https://forwardemail.net/gdpr>

Vállalati ügyfelek számára, akik egyedi DPA feltételeket vagy specifikus szerződéses megállapodásokat igényelnek, ezek a **Vállalati Licenc ($250/hónap)** programunkon keresztül kezelhetők.

### Hogyan kezelik az adatvédelmi incidensek értesítését? {#how-do-you-handle-data-breach-notifications}

> \[!NOTE]
> A Forward Email nulla tudású architektúrája jelentősen korlátozza a biztonsági incidens hatását.
* **Korlátozott adatközlés**: Nem fér hozzá titkosított e-mail tartalomhoz a nulla-tudás architektúra miatt
* **Minimális adatgyűjtés**: Csak alapvető előfizetői információk és korlátozott IP-naplók biztonsági célokra
* **Alvállalkozói keretrendszerek**: A DigitalOcean, GitHub és Vultr GDPR-kompatibilis incidenskezelési eljárásokat tart fenn

**GDPR képviselői információk:**
A Forward Email a 27. cikknek megfelelően GDPR képviselőket nevezett ki:

**EU képviselő:**
Osano International Compliance Services Limited  
ATTN: LFHC  
3 Dublin Landings, North Wall Quay  
Dublin 1, D01C4E0

**UK képviselő:**
Osano UK Compliance LTD  
ATTN: LFHC  
42-46 Fountain Street, Belfast  
Antrim, BT1 - 5EF

Vállalati ügyfelek számára, akik specifikus adatvédelmi incidens értesítési SLA-kat igényelnek, ezekről az **Enterprise License** megállapodás részeként kell egyeztetni.

Források:

* <https://forwardemail.net/technical-whitepaper.pdf#page=59>
* <https://forwardemail.net/gdpr>

### Kínálnak tesztkörnyezetet {#do-you-offer-a-test-environment}

A Forward Email műszaki dokumentációja nem ír le kifejezetten dedikált sandbox módot. Azonban a lehetséges tesztelési megközelítések a következők:

* **Önmagad általi hosztolás lehetősége**: Teljes körű önálló hosztolási képességek tesztkörnyezetek létrehozásához
* **API interfész**: Konfigurációk programozott tesztelésének lehetősége
* **Nyílt forráskód**: 100%-ban nyílt forráskódú kód lehetővé teszi az ügyfelek számára az átirányítási logika vizsgálatát
* **Több domain támogatása**: Több domain támogatása teszt domain létrehozását is lehetővé teheti

Vállalati ügyfelek számára, akik formális sandbox képességeket igényelnek, ezt az **Enterprise License** megállapodás részeként kell egyeztetni.

Forrás: <https://github.com/forwardemail/forwardemail.net> (Fejlesztői környezet részletei)

### Biztosítanak monitorozó és riasztó eszközöket {#do-you-provide-monitoring-and-alerting-tools}

A Forward Email valós idejű monitorozást biztosít bizonyos korlátozásokkal:

**Elérhető:**

* **Valós idejű kézbesítési monitorozás**: Nyilvánosan látható teljesítménymutatók a főbb e-mail szolgáltatók esetében
* **Automatikus riasztás**: A mérnöki csapat értesítése, ha a kézbesítési idő meghaladja a 10 másodpercet
* **Átlátható monitorozás**: 100%-ban nyílt forráskódú monitorozó rendszerek
* **Infrastruktúra monitorozás**: Automatikus anomáliaészlelés és átfogó audit naplózás

**Korlátozások:**

* Ügyféloldali webhookok vagy API-alapú kézbesítési státusz értesítések nem dokumentáltak kifejezetten

Vállalati ügyfelek számára, akik részletes kézbesítési státusz webhookokat vagy egyedi monitorozási integrációkat igényelnek, ezek a képességek elérhetők lehetnek **Enterprise License** megállapodások keretében.

Források:

* <https://forwardemail.net> (Valós idejű monitorozás megjelenítése)
* <https://github.com/forwardemail/forwardemail.net> (Monitorozás megvalósítása)

### Hogyan biztosítják a magas rendelkezésre állást {#how-do-you-ensure-high-availability}

> \[!IMPORTANT]
> A Forward Email átfogó redundanciát valósít meg több infrastruktúra szolgáltató között.

* **Elosztott infrastruktúra**: Több szolgáltató (DigitalOcean, Vultr, DataPacket) földrajzi régiók szerint
* **Földrajzi terheléselosztás**: Cloudflare alapú földrajzi hely szerinti terheléselosztás automatikus failover-rel
* **Automatikus skálázás**: Dinamikus erőforrás-igazítás a kereslet alapján
* **Többrétegű DDoS védelem**: A DataPacket Shield rendszerén és a Cloudflare-en keresztül
* **Szerver redundancia**: Több szerver régiónként automatikus failover-rel
* **Adatbázis replikáció**: Valós idejű adat szinkronizáció több helyszín között
* **Monitorozás és riasztás**: 0-24 órás monitorozás automatikus incidenskezeléssel

**Üzemidő vállalás**: 99,9%+ szolgáltatás rendelkezésre állás átlátható monitorozással elérhető a <https://forwardemail.net> címen

Források:

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver>

### Megfelelnek a Nemzeti Védelmi Engedélyezési Törvény (NDAA) 889. szakaszának? {#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa}

> \[!IMPORTANT]
> A Forward Email teljes mértékben megfelel a 889. szakasznak az infrastruktúra partnerek gondos kiválasztásával.

Igen, a Forward Email **megfelel a 889. szakasznak**. A Nemzeti Védelmi Engedélyezési Törvény (NDAA) 889. szakasza megtiltja a kormányzati szerveknek, hogy olyan entitásokkal használjanak vagy szerződjenek, amelyek telekommunikációs és videó megfigyelő berendezéseket használnak bizonyos cégektől (Huawei, ZTE, Hikvision, Dahua és Hytera).
**Hogyan éri el a Forward Email a 889-es szakasz szerinti megfelelést:**

A Forward Email kizárólag két kulcsfontosságú infrastruktúra szolgáltatóra támaszkodik, egyikük sem használ a 889-es szakasz által tiltott berendezéseket:

1. **Cloudflare**: Elsődleges partnerünk hálózati szolgáltatások és e-mail biztonság terén
2. **DataPacket**: Elsődleges szolgáltatónk a szerver infrastruktúrához (kizárólag Arista Networks és Cisco berendezéseket használva)
3. **Biztonsági szolgáltatók**: A Digital Ocean és Vultr biztonsági szolgáltatóink írásban is megerősítették, hogy megfelelnek a 889-es szakasznak.

**A Cloudflare elkötelezettsége**: A Cloudflare kifejezetten kijelenti a Harmadik Fél Magatartási Kódexében, hogy nem használ távközlési berendezéseket, videó megfigyelő termékeket vagy szolgáltatásokat a 889-es szakasz által tiltott entitásoktól.

**Kormányzati felhasználási eset**: A 889-es szakasz szerinti megfelelőségünket az is igazolta, hogy a **US Naval Academy** a Forward Emailt választotta biztonságos e-mail továbbítási igényeihez, amelyhez dokumentációt kértek szövetségi megfelelőségi szabványainkról.

A kormányzati megfelelőségi keretrendszerünkről, beleértve a szélesebb szövetségi szabályozásokat is, részletesen olvashat a következő átfogó esettanulmányban: [Szövetségi kormányzati e-mail szolgáltatás 889-es szakasz szerinti megfelelőséggel](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)


## Rendszer- és műszaki részletek {#system-and-technical-details}

### Tárolnak-e e-maileket és azok tartalmát {#do-you-store-emails-and-their-contents}

Nem, nem írunk lemezre és nem tárolunk naplókat – kivéve a [hibákat](#do-you-store-error-logs) és a [kimenő SMTP-t](#do-you-support-sending-email-with-smtp) (lásd az [Adatvédelmi irányelveinket](/privacy)).

Minden a memóriában történik, és [a forráskódunk elérhető a GitHubon](https://github.com/forwardemail).

### Hogyan működik az e-mail továbbító rendszerük {#how-does-your-email-forwarding-system-work}

Az e-mail az [SMTP protokollra](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol) támaszkodik. Ez a protokoll parancsokból áll, amelyeket egy szervernek küldenek (leggyakrabban a 25-ös porton fut). Először létrejön a kapcsolat, majd a küldő jelzi, hogy kitől érkezik az üzenet ("MAIL FROM"), ezt követi a címzett ("RCPT TO"), végül az e-mail fejléc és törzs ("DATA"). Az e-mail továbbító rendszerünk folyamata az egyes SMTP parancsokhoz viszonyítva az alábbiak szerint alakul:

* Kezdeti kapcsolat (parancsnév nélkül, pl. `telnet example.com 25`) – Ez a kezdeti kapcsolat. Ellenőrizzük azokat a küldőket, akik nincsenek az [engedélyező listánkon](#do-you-have-an-allowlist) a [tiltó listánk](#do-you-have-a-denylist) alapján. Végül, ha a küldő nincs az engedélyező listán, akkor megnézzük, hogy [szürkelistán](#do-you-have-a-greylist) vannak-e.

* `HELO` – Ez egy üdvözlés, amely a küldő FQDN-jét, IP-címét vagy levelező kezelő nevét azonosítja. Ez az érték hamisítható, ezért nem támaszkodunk erre az adatra, helyette a kapcsolat IP-címének fordított hosztnév lekérdezését használjuk.

* `MAIL FROM` – Ez az e-mail boríték küldő címét jelzi. Ha érték van megadva, az érvényes RFC 5322 e-mail cím kell legyen. Üres értékek megengedettek. Itt [ellenőrizzük a visszapattanást](#how-do-you-protect-against-backscatter), és a MAIL FROM-ot összevetjük a [tiltó listánkkal](#do-you-have-a-denylist). Végül az engedélyező listán nem szereplő küldőket sebességkorlátozás alá vetjük (lásd a [Sebességkorlátozás](#do-you-have-rate-limiting) és az [engedélyező lista](#do-you-have-an-allowlist) szakaszokat további információkért).

* `RCPT TO` – Ez az e-mail címzett(ek)et jelzi. Ezeknek érvényes RFC 5322 e-mail címeknek kell lenniük. Üzenetenként legfeljebb 50 boríték címzettet engedélyezünk (ez eltér az e-mail "To" fejlécétől). Itt ellenőrizzük a [Sender Rewriting Scheme](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme) ("SRS") érvényes címét is, hogy megvédjük a hamisítást az SRS domain nevünkkel.

* `DATA` – Ez a szolgáltatásunk magja, amely feldolgozza az e-mailt. Részletesebb betekintésért lásd az alábbi [Hogyan dolgoznak fel egy e-mailt továbbításra](#how-do-you-process-an-email-for-forwarding) szakaszt.
### Hogyan dolgoz fel egy e-mailt továbbításra {#how-do-you-process-an-email-for-forwarding}

Ez a szakasz leírja az SMTP protokoll `DATA` parancsához kapcsolódó folyamatunkat a fentebb található [Hogyan működik az e-mail továbbító rendszer](#how-does-your-email-forwarding-system-work) szakaszban – ez az, ahogyan feldolgozzuk egy e-mail fejlécét, törzsét, biztonságát, meghatározzuk, hová kell kézbesíteni, és hogyan kezeljük a kapcsolatokat.

1. Ha az üzenet meghaladja az 50 MB maximális méretet, akkor 552-es hibakóddal elutasításra kerül.

2. Ha az üzenet nem tartalmazott "From" fejlécet, vagy ha a "From" fejléc bármely értéke nem volt érvényes RFC 5322 e-mail cím, akkor 550-es hibakóddal elutasításra kerül.

3. Ha az üzenet több mint 25 "Received" fejlécet tartalmazott, akkor úgy ítéltük meg, hogy egy átirányítási ciklusban ragadt, és 550-es hibakóddal elutasításra kerül.

4. Az e-mail ujjlenyomatának felhasználásával (lásd a [Fingerprinting](#how-do-you-determine-an-email-fingerprint) szakaszt), ellenőrizzük, hogy az üzenetet megpróbálták-e újraküldeni több mint 5 napig (ami megfelel a [postfix alapértelmezett viselkedésének](http://www.postfix.org/postconf.5.html#maximal_queue_lifetime)), és ha igen, akkor 550-es hibakóddal elutasításra kerül.

5. Memóriában tároljuk az e-mail szkennelésének eredményeit a [Spam Scanner](https://spamscanner.net) használatával.

6. Ha bármilyen tetszőleges eredmény született a Spam Scannerből, akkor 554-es hibakóddal elutasításra kerül. A tetszőleges eredmények jelenleg csak a GTUBE tesztet tartalmazzák a jelen írás idején. További információkért lásd: <https://spamassassin.apache.org/gtube/>.

7. A következő fejléceket adjuk hozzá az üzenethez hibakeresési és visszaélés-megelőzési célból:

   * `Received` – hozzáadjuk ezt a szabványos Received fejlécet az eredeti IP-vel és hosttal, átvitel típusával, TLS kapcsolat információval, dátummal/idővel és címzettel.
   * `X-Original-To` – az üzenet eredeti címzettje:
     * Ez hasznos annak meghatározásához, hogy az e-mailt eredetileg hová kézbesítették (a "Received" fejléc mellett).
     * Ezt címzettenként adjuk hozzá az IMAP és/vagy maszkolt továbbítás idején (a magánélet védelme érdekében).
   * `X-Forward-Email-Website` – tartalmaz egy linket a weboldalunkra: <https://forwardemail.net>
   * `X-Forward-Email-Version` – a kódbázisunk `package.json` fájljából származó aktuális [SemVer](https://semver.org/) verzió.
   * `X-Forward-Email-Session-ID` – egy munkamenetazonosító érték hibakeresési célokra (csak nem éles környezetben alkalmazandó).
   * `X-Forward-Email-Sender` – vesszővel elválasztott lista, amely tartalmazza az eredeti boríték MAIL FROM címét (ha nem volt üres), a visszafelé mutató PTR kliens FQDN-jét (ha létezik), és a feladó IP-címét.
   * `X-Forward-Email-ID` – ez csak a kimenő SMTP-re vonatkozik, és megfelel a My Account → Emails alatt tárolt e-mail azonosítónak.
   * `X-Report-Abuse` – értéke `abuse@forwardemail.net`.
   * `X-Report-Abuse-To` – értéke `abuse@forwardemail.net`.
   * `X-Complaints-To` – értéke `abuse@forwardemail.net`.

8. Ezután ellenőrizzük az üzenetet [DKIM](https://en.wikipedia.org/wiki/DomainKeys_Identified_Mail), [SPF](https://en.wikipedia.org/wiki/Sender_Policy_Framework), [ARC](https://en.wikipedia.org/wiki/Authenticated_Received_Chain) és [DMARC](https://en.wikipedia.org/wiki/DMARC) szempontjából.

   * Ha az üzenet megbukott a DMARC vizsgálaton, és a domain rendelkezett elutasítási szabállyal (pl. `p=reject` [a DMARC szabályzatban](https://wikipedia.org/wiki/DMARC)), akkor 550-es hibakóddal elutasításra kerül. Egy domain DMARC szabályzata általában a `_dmarc` aldomain <strong class="notranslate">TXT</strong> rekordjában található (pl. `dig _dmarc.example.com txt`).
   * Ha az üzenet megbukott az SPF vizsgálaton, és a domain kemény elutasítási szabállyal rendelkezett (pl. az SPF szabályzatban `-all` szerepelt a `~all` vagy a szabályzat hiánya helyett), akkor 550-es hibakóddal elutasításra kerül. Egy domain SPF szabályzata általában a gyökérdomain <strong class="notranslate">TXT</strong> rekordjában található (pl. `dig example.com txt`). További információkért lásd a [levelek küldése Gmailben](#can-i-send-mail-as-in-gmail-with-this) szakaszt az SPF kapcsán.
9. Most feldolgozzuk az üzenet címzettjeit, amelyeket az `RCPT TO` parancsból gyűjtöttünk össze a fentebb található [Hogyan működik az e-mail továbbító rendszered](#how-does-your-email-forwarding-system-work) szakaszban. Minden egyes címzettnél a következő műveleteket végezzük el:

   * Lekérdezzük a domain név <strong class="notranslate">TXT</strong> rekordjait (az `@` jel utáni rész, pl. `example.com`, ha az e-mail cím `test@example.com` volt). Például, ha a domain `example.com`, akkor egy DNS lekérdezést végzünk, például `dig example.com txt`.
   * Feldolgozzuk az összes olyan <strong class="notranslate">TXT</strong> rekordot, amely `forward-email=` (ingyenes csomagok) vagy `forward-email-site-verification=` (fizetős csomagok) kezdettel rendelkezik. Megjegyzés: mindkettőt feldolgozzuk, hogy kezelni tudjuk az e-maileket, miközben a felhasználó csomagot vált vagy visszalép.
   * Ezekből a feldolgozott <strong class="notranslate">TXT</strong> rekordokból végigiterálunk, hogy kinyerjük a továbbítási konfigurációt (ahogy azt a fentebb található [Hogyan kezdjek hozzá és állítsam be az e-mail továbbítást](#how-do-i-get-started-and-set-up-email-forwarding) szakaszban leírtuk). Megjegyzés: csak egy `forward-email-site-verification=` értéket támogatunk, és ha többet adnak meg, akkor 550-es hibakód lép fel, és a feladó visszapattanást kap erre a címzettre.
   * Rekurzívan végigiterálunk a kinyert továbbítási konfiguráción, hogy meghatározzuk a globális továbbítást, a reguláris kifejezés alapú továbbítást, és minden más támogatott továbbítási konfigurációt – amelyek mostantól "Továbbítási Címek" néven ismertek.
   * Minden Továbbítási Címhez egy rekurzív lekérdezést támogatunk (ami elindítja ezen műveletsorozatot az adott címen). Ha rekurzív egyezést találunk, akkor a szülő eredményt eltávolítjuk a Továbbítási Címek közül, és a gyerekeket hozzáadjuk.
   * A Továbbítási Címeket egyediség szempontjából feldolgozzuk (mivel nem akarunk duplikált címekre küldeni vagy felesleges SMTP kliens kapcsolatokat létrehozni).
   * Minden Továbbítási Címhez lekérdezzük a domain nevét az API végpontunkon `/v1/max-forwarded-addresses` (hogy meghatározzuk, hány címre engedélyezett a domain az e-mail továbbítást aliasonként, pl. alapértelmezés szerint 10 – lásd a [maximum korlát az aliasonként továbbítható e-mail címek számára](#is-there-a-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias) szakaszt). Ha ez a korlát túllépésre kerül, akkor 550-es hibakód lép fel, és a feladó visszapattanást kap erre a címzettre.
   * Lekérdezzük az eredeti címzett beállításait az API végpontunkon `/v1/settings`, amely támogatja a fizetős felhasználók lekérdezését (ingyenes felhasználók számára tartalék megoldással). Ez visszaad egy konfigurációs objektumot az alábbi fejlett beállításokkal: `port` (Szám, pl. `25`), `has_adult_content_protection` (Logikai), `has_phishing_protection` (Logikai), `has_executable_protection` (Logikai), és `has_virus_protection` (Logikai).
   * Ezek alapján a beállítások alapján ellenőrizzük a Spam Szűrő eredményeket, és ha bármilyen hiba előfordul, az üzenetet elutasítjuk 554-es hibakóddal (pl. ha a `has_virus_protection` engedélyezve van, akkor ellenőrizzük a Spam Szűrő eredményeit vírusokra). Megjegyzés: minden ingyenes csomagos felhasználó automatikusan be van kapcsolva az ellenőrzésekre felnőtt tartalom, adathalászat, futtatható fájlok és vírusok tekintetében. Alapértelmezés szerint minden fizetős felhasználó is be van kapcsolva, de ez a konfiguráció módosítható a domain Beállítások oldalán a Forward Email irányítópulton.

10. Minden feldolgozott címzett Továbbítási Címeihez a következő műveleteket végezzük el:

    * A címet ellenőrizzük a [tiltólistánk](#do-you-have-a-denylist), és ha szerepel rajta, akkor 421-es hibakód lép fel (ami azt jelzi a feladónak, hogy próbálkozzon később újra).
    * Ha a cím webhook, akkor egy logikai változót állítunk be a későbbi műveletekhez (lásd lentebb – hasonló webhookokat csoportosítunk, hogy egy POST kérést küldjünk több helyett a kézbesítéshez).
    * Ha a cím e-mail cím, akkor a hosztot feldolgozzuk a későbbi műveletekhez (lásd lentebb – hasonló hosztokat csoportosítunk, hogy egy kapcsolatot hozzunk létre több egyéni kapcsolat helyett a kézbesítéshez).
11. Ha nincsenek címzettek és nincsenek visszapattanások, akkor egy 550-es hibával válaszolunk: "Érvénytelen címzettek".

12. Ha vannak címzettek, akkor végigiterálunk rajtuk (ugyanazon gazdagép szerint csoportosítva), és kézbesítjük az e-maileket. További részletekért lásd az alábbi [Hogyan kezelitek az e-mail kézbesítési problémákat](#how-do-you-handle-email-delivery-issues) szakaszt.

    * Ha bármilyen hiba történik az e-mailek küldése közben, akkor azokat memóriában tároljuk későbbi feldolgozásra.
    * A legalacsonyabb hibakódot (ha van) vesszük az e-mailek küldése során – és ezt használjuk válaszkódként a `DATA` parancshoz. Ez azt jelenti, hogy a nem kézbesített e-maileket általában az eredeti feladó újrapróbálja, míg a már kézbesített e-maileket nem küldjük újra a következő üzenetküldéskor (mivel használjuk a [Ujjlenyomat-képzést](#how-do-you-determine-an-email-fingerprint)).
    * Ha nem történt hiba, akkor 250-es sikeres SMTP válaszkódot küldünk.
    * Visszapattanásnak minősül minden kézbesítési kísérlet, amely >= 500-as státuszkóddal végződik (állandó hibák).

13. Ha nem történt visszapattanás (állandó hiba), akkor az SMTP válaszkód a nem állandó hibák közül a legalacsonyabb hibakód lesz (vagy 250-es sikeres státuszkód, ha nem volt hiba).

14. Ha visszapattanások történtek, akkor háttérben küldjük ki a visszapattanó e-maileket, miután visszaadtuk a feladónak az összes hibakód közül a legalacsonyabbat. Ha azonban a legalacsonyabb hibakód >= 500, akkor nem küldünk visszapattanó e-maileket. Ennek oka, hogy ha küldenénk, akkor a feladók dupla visszapattanó e-mailt kapnának (például egyet a saját kimenő MTA-juktól, mint a Gmail – és egyet tőlünk). További részletekért lásd az alábbi [Hogyan védekeztek a visszacsatolás ellen](#how-do-you-protect-against-backscatter) szakaszt.

### Hogyan kezelitek az e-mail kézbesítési problémákat {#how-do-you-handle-email-delivery-issues}

Megjegyzendő, hogy "Friendly-From" átírást csak akkor végzünk az e-maileken, ha a feladó DMARC szabályzata nem teljesült ÉS egyetlen DKIM aláírás sem volt összhangban a "From" fejlécével. Ez azt jelenti, hogy módosítjuk az üzenet "From" fejlécét, beállítjuk az "X-Original-From" fejlécet, és ha még nem volt beállítva, akkor egy "Reply-To" fejlécet is hozzáadunk. Az ARC pecsétet is újra lezárjuk az üzeneten ezeknek a fejléceknek a módosítása után.

Minden szinten okos hibafeldolgozást alkalmazunk – a kódunkban, DNS lekérdezéseknél, Node.js belső működésében, HTTP kéréseknél (pl. 408, 413 és 429 kódokat 421 SMTP válaszkódra térképezünk, ha a címzett webhook), és a levelezőszerver válaszainál (pl. "defer" vagy "slowdown" válaszokat 421 hibaként újrapróbálunk).

A logikánk egyszerű és megbízható, és újrapróbálkozást végez SSL/TLS hibák, kapcsolódási problémák és egyéb esetekben is. A cél az, hogy maximalizáljuk a kézbesíthetőséget minden címzett számára egy továbbító konfiguráció esetén.

Ha a címzett webhook, akkor engedélyezünk 60 másodperces időkorlátot a kérés befejezésére, legfeljebb 3 újrapróbálkozással (összesen 4 kérés sikertelenség előtt). Megjegyzendő, hogy helyesen értelmezzük a 408, 413 és 429 hibakódokat, és azokat 421 SMTP válaszkódra térképezzük.

Ha a címzett e-mail cím, akkor megpróbáljuk az e-mailt opportunisztikus TLS-sel küldeni (megpróbáljuk használni a STARTTLS-t, ha elérhető a címzett levelezőszerverén). Ha SSL/TLS hiba történik az e-mail küldése közben, akkor megpróbáljuk TLS nélkül elküldeni az e-mailt (STARTTLS használata nélkül).

Ha bármilyen DNS vagy kapcsolódási hiba történik, akkor a `DATA` parancsnál 421-es SMTP válaszkódot adunk vissza, egyébként ha >= 500-as hibák vannak, akkor visszapattanókat küldünk.

Ha észleljük, hogy egy e-mail szerver, amelyhez kézbesíteni próbálunk, blokkolja az egyik vagy több levelező IP címünket (például bármilyen technológia miatt, amit a spammerek visszatartására használnak), akkor 421-es SMTP válaszkódot küldünk, hogy a feladó később újrapróbálhassa az üzenetet (és értesülünk a problémáról, hogy remélhetőleg megoldhassuk a következő próbálkozás előtt).

### Hogyan kezelitek, ha az IP címeitek blokkolva lesznek {#how-do-you-handle-your-ip-addresses-becoming-blocked}
Rendszeresen figyeljük az összes jelentős DNS tiltólistát, és ha bármelyik levelezési csere ("MX") IP-címünk szerepel egy jelentős tiltólistán, akkor lehetőség szerint eltávolítjuk azt a releváns DNS A rekord körforgásból, amíg a probléma meg nem oldódik.

A jelen írás idején több DNS engedélyező listán is szereplünk, és komolyan vesszük a tiltólisták figyelését. Ha bármilyen problémát észlel, mielőtt mi meg tudnánk oldani, kérjük, írásban értesítsen minket a <support@forwardemail.net> címen.

IP-címeink nyilvánosan elérhetők, [lásd az alábbi szakaszt további információért](#what-are-your-servers-ip-addresses).

### Mik azok a postmaster címek {#what-are-postmaster-addresses}

A tévesen továbbított visszapattanások és az automatikus válaszadó üzenetek nem felügyelt vagy nem létező postafiókoknak történő küldésének megakadályozása érdekében fenntartunk egy listát mailer-daemon jellegű felhasználónevekről:

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
* [és bármely no-reply cím](#what-are-no-reply-addresses)

További információért lásd az [RFC 5320 4.6 szakaszát](https://datatracker.ietf.org/doc/html/rfc5230#section-4.6), amely bemutatja, hogyan használják az ilyen listákat hatékony e-mail rendszerek létrehozásához.

### Mik azok a no-reply címek {#what-are-no-reply-addresses}

Az alábbi (kis- és nagybetűtől független) e-mail felhasználónevek bármelyike no-reply címnek minősül:

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

Ezt a listát [nyílt forráskódú projektként tartjuk karban a GitHubon](https://github.com/forwardemail/reserved-email-addresses-list).

### Mik az Ön szerverének IP-címei {#what-are-your-servers-ip-addresses}

IP-címeinket közzétesszük a <https://forwardemail.net/ips> címen.

### Van engedélyező listája? {#do-you-have-an-allowlist}

Igen, van egy [alapértelmezés szerint engedélyezett domain névkiterjesztések listája](#what-domain-name-extensions-are-allowlisted-by-default), valamint egy dinamikus, gyorsítótárazott és folyamatosan frissülő engedélyező listánk, amely [szigorú kritériumokon](#what-is-your-allowlist-criteria) alapul.

Minden fizetős ügyfél által használt domain, e-mail és IP-cím automatikusan óránként ellenőrizve van a tiltólistánkon – amely riasztja az adminisztrátorokat, akik szükség esetén manuálisan beavatkozhatnak.

Ezen felül, ha valamelyik domainje vagy annak e-mail címei tiltólistára kerülnek (például spamküldés, vírusok vagy személyiséglopási támadások miatt) – akkor a domain adminisztrátorokat (Önt) és a mi csapatunk adminisztrátorait azonnal e-mailben értesítjük. Erősen ajánljuk, hogy [állítsa be a DMARC-ot](#how-do-i-set-up-dmarc-for-forward-email) ennek megelőzésére.

### Mely domain névkiterjesztések vannak alapértelmezés szerint engedélyezve {#what-domain-name-extensions-are-allowlisted-by-default}

Az alábbi domain névkiterjesztések alapértelmezés szerint engedélyezettnek számítanak (függetlenül attól, hogy szerepelnek-e az Umbrella Popularity Listán vagy sem):

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
Ezen felül ezek a [márka- és vállalati legfelső szintű domainek](https://en.wikipedia.org/wiki/List_of_Internet_top-level_domains#Brand_and_corporate_top-level_domains) alapértelmezés szerint engedélyezettek (pl. `apple` az `applecard.apple` esetén az Apple Card bankszámlakivonatokhoz):

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
2025. március 18-tól ezeket a francia tengerentúli területeket is hozzáadtuk ehhez a listához ([a GitHub kérés alapján](https://github.com/forwardemail/forwardemail.net/issues/327)):

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

2025. július 8-tól ezeket a kizárólag Európára jellemző országokat adtuk hozzá:

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

2025 októberében a <code class="notranslate">cz</code> (Csehország) is hozzáadásra került a kereslet miatt.

Kifejezetten nem vettük fel a `ru` és `ua` domaineket a magas spam aktivitás miatt.

### Mi az engedélyezési listád kritériuma {#what-is-your-allowlist-criteria}

Van egy statikus lista a [alapértelmezetten engedélyezett domain név kiterjesztésekről](#what-domain-name-extensions-are-allowlisted-by-default) – és fenntartunk egy dinamikus, gyorsítótárazott, gördülő engedélyezési listát az alábbi szigorú kritériumok alapján:

* A feladó gyökérdomainjének olyan [domain név kiterjesztésnek kell lennie, amely megfelel az ingyenes csomagunkban kínált listának](#what-domain-name-extensions-can-be-used-for-free) (a `biz` és `info` hozzáadásával). Tartalmazzuk továbbá az `edu`, `gov` és `mil` részleges egyezéseket is, például `xyz.gov.au` és `xyz.edu.au`.
* A feladó gyökérdomainjének az [Umbrella Popularity List](http://s3-us-west-1.amazonaws.com/umbrella-static/index.html "Umbrella Popularity List") ("UPL") 100 000 legnépszerűbb egyedi gyökérdomainje között kell lennie.
* A feladó gyökérdomainjének az UPL-ben az elmúlt 7 napból legalább 4 napban meg kell jelennie, és a top 50 000 eredmény között kell lennie (kb. 50%+).
* A feladó gyökérdomainjének nem szabad a Cloudflare által [felnőtt tartalomként vagy rosszindulatú programként kategorizáltnak](https://radar.cloudflare.com/categorization-feedback/) lennie.
* A feladó gyökérdomainjének rendelkeznie kell A vagy MX rekorddal.
* A feladó gyökérdomainjének rendelkeznie kell A rekord(ok)kal, MX rekord(ok)kal, DMARC rekorddal `p=reject` vagy `p=quarantine` értékkel, vagy SPF rekorddal `-all` vagy `~all` minősítővel.

Ha ezek a kritériumok teljesülnek, akkor a feladó gyökérdomainjét 7 napra gyorsítótárazzuk. Megjegyzendő, hogy az automatizált folyamatunk naponta fut – tehát ez egy gördülő engedélyezési lista gyorsítótár, amely naponta frissül.

Az automatizált folyamat letölti az előző 7 nap UPL-jeit memóriába, kicsomagolja azokat, majd a fentiek szerinti szigorú kritériumok alapján elemzi őket memóriában.

Az írás idején népszerű domainek, mint a Google, Yahoo, Microsoft, Amazon, Meta, Twitter, Netflix, Spotify és még sok más természetesen beletartoznak.
Ha Ön olyan feladó, aki nincs az engedélyezett listánkon, akkor amikor először küld e-mailt az FQDN gyökérdomainje vagy IP-címe, akkor [rate limited](#do-you-have-rate-limiting) és [greylisted](#do-you-have-a-greylist) lesz. Vegye figyelembe, hogy ez egy szabványos gyakorlat, amelyet e-mail szabványként alkalmaznak. A legtöbb e-mail szerver kliens megpróbálja újraküldeni az üzenetet, ha rate limit vagy greylist hibát kap (pl. 421 vagy 4xx szintű hibakód).

**Vegye figyelembe, hogy bizonyos feladók, mint például `a@gmail.com`, `b@xyz.edu` és `c@gov.au` továbbra is lehetnek [denylisted](#do-you-have-a-denylist)** (például ha automatikusan észleljük a spameket, adathalászatot vagy rosszindulatú programokat ezekről a feladókról).

### Milyen domain névkiterjesztések használhatók ingyenesen {#what-domain-name-extensions-can-be-used-for-free}

2023. március 31-től új, átfogó spam szabályt vezettünk be felhasználóink és szolgáltatásunk védelme érdekében.

Ez az új szabály csak az alábbi domain névkiterjesztések használatát engedélyezi az ingyenes csomagunkban:

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
### Van szürkelista {#do-you-have-a-greylist}

Igen, nagyon laza [email szürkelista](https://en.wikipedia.org/wiki/Greylisting_\(email\)) szabályzatot alkalmazunk. A szürkelista csak az engedélyező listánkon nem szereplő feladókra vonatkozik, és 30 napig marad a gyorsítótárunkban.

Bármely új feladó esetén eltárolunk egy kulcsot a Redis adatbázisunkban 30 napra, amelynek értéke az első kérésük kezdeti érkezési ideje. Ezután elutasítjuk az e-mailjüket egy 450-es újrapróbálkozási státuszkóddal, és csak akkor engedjük át, ha eltelt 5 perc.

Ha sikeresen megvárják az 5 percet a kezdeti érkezési időtől számítva, akkor az e-mailjeiket elfogadjuk, és nem kapják meg a 450-es státuszkódot.

A kulcs vagy a teljesen minősített domain név (FQDN) gyökérdomainje, vagy a feladó IP-címe. Ez azt jelenti, hogy bármely aldomain, amely átmegy a szürkelistán, a gyökérdomain esetében is átmegy, és fordítva (ezt értjük nagyon laza szabályzat alatt).

Például, ha egy e-mail a `test.example.com`-ról érkezik, mielőtt látnánk e-mailt az `example.com`-ról, akkor bármely e-mail a `test.example.com`-ról és/vagy az `example.com`-ról 5 percet kell várjon a kapcsolat kezdeti érkezési idejétől számítva. Nem váratjuk meg külön-külön a `test.example.com`-ot és az `example.com`-ot 5-5 percig (a szürkelistázási szabályzatunk a gyökérdomain szintjén érvényes).

Megjegyzendő, hogy a szürkelista nem vonatkozik az [engedélyező listánkon](#do-you-have-an-allowlist) szereplő feladókra (pl. Meta, Amazon, Netflix, Google, Microsoft a jelen írás idején).

### Van tiltólista {#do-you-have-a-denylist}

Igen, saját tiltólistát működtetünk, amelyet automatikusan, valós időben és manuálisan frissítünk a spam és rosszindulatú tevékenység észlelése alapján.

Minden órában lehúzzuk az összes IP-címet az UCEPROTECT 1. szintű tiltólistájáról a <http://wget-mirrors.uceprotect.net/rbldnsd-all/dnsbl-1.uceprotect.net.gz> címen, és 7 napos lejárattal betápláljuk a tiltólistánkba.

A tiltólistán szereplő feladók 421-es hibakódot kapnak (ami azt jelzi a feladónak, hogy próbálja újra később), ha [nincsenek engedélyezve](#do-you-have-an-allowlist).

A 421-es státuszkód használatával a 554-es helyett a potenciális téves riasztások valós időben enyhíthetők, és az üzenet sikeresen kézbesíthető a következő próbálkozáskor.

**Ez eltér más levelező szolgáltatásoktól**, ahol ha blokkolólistára kerülsz, kemény és végleges hiba történik. Gyakran nehéz a feladókat újrapróbálkozásra kérni (különösen nagy szervezetektől), ezért ez a megközelítés nagyjából 5 napot ad az első e-mail próbálkozástól számítva, hogy a feladó, a címzett vagy mi közbeléphessünk és megoldjuk a problémát (pl. tiltólista eltávolítás kérésével).

Minden tiltólista eltávolítási kérelmet valós időben figyelnek az adminok (pl. hogy az ismétlődő téves riasztásokat az adminok véglegesen engedélyezhessék).

Tiltólista eltávolítási kérelmek kérhetők a <https://forwardemail.net/denylist> címen. A fizetős felhasználók kérelmei azonnal feldolgozásra kerülnek, míg a nem fizetősöknek várniuk kell az adminok feldolgozására.

Azokat a feladókat, akik spameket vagy vírusos tartalmat küldenek, a következő módon tesszük tiltólistára:

1. Az [elsődleges üzenet ujjlenyomatát](#how-do-you-determine-an-email-fingerprint) szürkelistázzuk, ha spam vagy blokkolólista kerül észlelésre egy „megbízható” feladótól (pl. `gmail.com`, `microsoft.com`, `apple.com`).
   * Ha a feladó engedélyezett volt, az üzenet 1 órára szürkelistázva lesz.
   * Ha a feladó nem engedélyezett, az üzenet 6 órára szürkelistázva lesz.
2. A tiltólista kulcsokat a feladótól és az üzenettől származó információkból kinyerjük, és mindegyikhez létrehozunk (ha még nem létezik) egy számlálót, amelyet 1-gyel növelünk, és 24 órára gyorsítótárazunk.
   * Engedélyezett feladók esetén:
     * Hozzáadunk egy kulcsot a boríték „MAIL FROM” e-mail címéhez, ha az SPF-je megfelelt vagy nem volt SPF, és nem [postmaster felhasználónév](#what-are-postmaster-addresses) vagy [no-reply felhasználónév](#what-are-no-reply-addresses).
     * Ha a „From” fejléc engedélyezett volt, akkor hozzáadunk egy kulcsot a „From” fejléc e-mail címéhez, ha az SPF-je megfelelt vagy megfelelt és DKIM-je igazolt volt.
     * Ha a „From” fejléc nem volt engedélyezett, akkor hozzáadunk egy kulcsot a „From” fejléc e-mail címéhez és annak gyökér elemzett domain nevéhez.
   * Nem engedélyezett feladók esetén:
     * Hozzáadunk egy kulcsot a boríték „MAIL FROM” e-mail címéhez, ha az SPF-je megfelelt.
     * Ha a „From” fejléc engedélyezett volt, akkor hozzáadunk egy kulcsot a „From” fejléc e-mail címéhez, ha az SPF-je megfelelt vagy megfelelt és DKIM-je igazolt volt.
     * Ha a „From” fejléc nem volt engedélyezett, akkor hozzáadunk egy kulcsot a „From” fejléc e-mail címéhez és annak gyökér elemzett domain nevéhez.
     * Hozzáadunk egy kulcsot a feladó távoli IP-címéhez.
     * Hozzáadunk egy kulcsot a feladó IP-címéből visszakeresett kliens feloldott hosztnévhez (ha van).
     * Hozzáadunk egy kulcsot a kliens feloldott hosztnevének gyökér domainjéhez (ha van, és eltér a kliens feloldott hosztnevétől).
3. Ha a számláló eléri az 5-öt egy nem engedélyezett feladó és kulcs esetén, akkor 30 napra tiltólistára tesszük a kulcsot, és e-mailt küldünk a visszaélés kezelő csapatunknak. Ezek a számok változhatnak, és a frissítések itt lesznek tükrözve, miközben figyeljük a visszaéléseket.
4. Ha a számláló eléri a 10-et egy engedélyezett feladó és kulcs esetén, akkor 7 napra tiltólistára tesszük a kulcsot, és e-mailt küldünk a visszaélés kezelő csapatunknak. Ezek a számok változhatnak, és a frissítések itt lesznek tükrözve, miközben figyeljük a visszaéléseket.
> **MEGJEGYZÉS:** A közeljövőben bevezetjük a hírnévfigyelést. A hírnévfigyelés a küldő tiltólistára vételét egy százalékos küszöbérték alapján fogja kiszámítani (a fent említett egyszerű számláló helyett).

### Van korlátozás a küldési sebességre {#do-you-have-rate-limiting}

A küldői sebességkorlátozás vagy a küldő IP-címének visszafelé PTR lekérdezéséből kinyert gyökérdomain alapján történik – vagy ha ez nem ad eredményt, akkor egyszerűen a küldő IP-címét használja. Megjegyezzük, hogy ezt alább `Sender`-ként említjük.

MX szervereink napi korlátokat állítanak be a bejövő levelekre, amelyeket [titkosított IMAP tárolásra](/blog/docs/best-quantum-safe-encrypted-email-service) fogadnak:

* Ahelyett, hogy egyedi aliasokra (pl. `you@yourdomain.com`) korlátoznánk a bejövő levelek sebességét, az alias domain neve alapján korlátozunk (pl. `yourdomain.com`). Ez megakadályozza, hogy a `Sender`-ek egyszerre elárasszák az összes alias postaládáját a domainen belül.
* Általános korlátok vonatkoznak minden `Sender`-re a szolgáltatásunkban, függetlenül a címzettől:
  * Azokat a `Sender`-eket, amelyeket "megbízhatónak" tekintünk (pl. `gmail.com`, `microsoft.com`, `apple.com`), napi 100 GB küldésre korlátozzuk.
  * Azokat a `Sender`-eket, amelyek [engedélyezettek](#do-you-have-an-allowlist), napi 10 GB küldésre korlátozzuk.
  * Minden más `Sender` napi 1 GB és/vagy 1000 üzenet küldésére korlátozott.
* Egyedi korlát van beállítva minden `Sender` és `yourdomain.com` esetén napi 1 GB és/vagy 1000 üzenet küldésére.

Az MX szerverek a továbbított üzeneteket is korlátozzák sebességkorlátozással – de ez csak azokra a `Sender`-ekre vonatkozik, amelyek nincsenek rajta a [engedélyezett listán](#do-you-have-an-allowlist):

* Óránként legfeljebb 100 kapcsolat engedélyezett, `Sender`-enként, a feloldott FQDN gyökérdomain vagy a `Sender` távoli IP-címe (ha nincs visszafelé PTR), és az átvevő boríték címzettje szerint. A sebességkorlátozás kulcsát kriptográfiai hash-ként tároljuk Redis adatbázisunkban.

* Ha a rendszerünkön keresztül küldesz e-mailt, kérjük, győződj meg róla, hogy minden IP-címedhez be van állítva visszafelé PTR (különben minden egyedi FQDN gyökérdomain vagy IP-cím, amiről küldesz, külön korlátozás alá esik).

* Megjegyzendő, hogy ha olyan népszerű rendszeren keresztül küldesz, mint az Amazon SES, akkor nem leszel korlátozva, mivel (a jelen írás idején) az Amazon SES szerepel az engedélyezett listánkon.

* Ha olyan domainről küldesz, mint például `test.abc.123.example.com`, akkor a korlátozás az `example.com`-ra vonatkozik. Sok spamküldő több száz aldomain-t használ, hogy megkerülje azokat a spam szűrőket, amelyek csak egyedi hosztneveket korlátoznak, nem pedig egyedi FQDN gyökérdomain-eket.

* Azok a `Sender`-ek, amelyek túllépik a sebességkorlátot, 421-es hibával lesznek elutasítva.

IMAP és SMTP szervereink korlátozzák, hogy aliasaid egyszerre ne legyenek több mint `60` egyidejű kapcsolattal.

MX szervereink korlátozzák a [nem engedélyezett](#do-you-have-an-allowlist) küldőket, hogy ne létesíthessenek 10-nél több egyidejű kapcsolatot (a számláló 3 perces gyorsítótár lejárattal, amely tükrözi a 3 perces socket időtúllépést).

### Hogyan védekeztek a visszapattanó levelek ellen {#how-do-you-protect-against-backscatter}

A tévesen érkező visszapattanó levelek vagy visszapattanó spam (ismertebb nevén "[Backscatter](https://en.wikipedia.org/wiki/Backscatter_\(email\))") negatív hírnevet okozhat a küldő IP-címeknek.

Két lépést teszünk a visszapattanó levelek elleni védelem érdekében, amelyeket az alábbi szakaszok részleteznek: [Ismert MAIL FROM spamküldők visszapattanóinak megakadályozása](#prevent-bounces-from-known-mail-from-spammers) és [Felesleges visszapattanók megakadályozása a visszapattanó levelek elleni védelem érdekében](#prevent-unnecessary-bounces-to-protect-against-backscatter).

### Ismert MAIL FROM spamküldők visszapattanóinak megakadályozása {#prevent-bounces-from-known-mail-from-spammers}

Az adatbázist a [Backscatter.org](https://www.backscatterer.org/) (amelyet a [UCEPROTECT](https://www.uceprotect.net/) működtet) oldalról töltjük le óránként a <http://wget-mirrors.uceprotect.net/rbldnsd-all/ips.backscatterer.org.gz> címen, és betápláljuk Redis adatbázisunkba (előzetesen összehasonlítjuk a különbségeket is, hogy tiszteletben tartsuk az esetlegesen eltávolított IP-ket).
Ha a MAIL FROM üres VAGY megegyezik (kis- és nagybetűtől függetlenül) bármelyik [postmaster címmel](#what-are-postmaster-addresses) (az emailben az @ előtti rész), akkor ellenőrizzük, hogy a feladó IP-címe szerepel-e ezen a listán.

Ha a feladó IP-címe szerepel a listán (és nincs az [engedélyezett listánkon](#do-you-have-an-allowlist)), akkor egy 554-es hibát küldünk a következő üzenettel: `The IP ${session.remoteAddress} is blocked by https://www.backscatterer.org/index.php?target=test&ip=${session.remoteAddress}`. Értesítést kapunk, ha egy feladó mind a Backscatterer listán, mind az engedélyezett listánkon szerepel, hogy szükség esetén megoldhassuk a problémát.

A jelen szakaszban leírt technikák megfelelnek a <https://www.backscatterer.org/?target=usage> oldalon található "SAFE MODE" ajánlásnak – ahol csak akkor ellenőrizzük a feladó IP-címét, ha bizonyos feltételek már teljesültek.

### Felesleges visszapattanások megelőzése a backscatter elleni védelem érdekében {#prevent-unnecessary-bounces-to-protect-against-backscatter}

A visszapattanások olyan e-mailek, amelyek azt jelzik, hogy az e-mail továbbítása a címzettnek teljesen meghiúsult, és az e-mailt nem próbálják újra elküldeni.

A Backscatterer listára kerülés egyik gyakori oka a tévesen irányított visszapattanások vagy visszapattanó spam, ezért ezt többféleképpen kell védenünk:

1. Csak akkor küldünk, ha >= 500-as státuszkódú hibák fordulnak elő (amikor a továbbítani próbált e-mailek meghiúsultak, pl. a Gmail 500-as szintű hibával válaszol).

2. Csak egyszer küldünk, és csak egyszer (egy kiszámított visszapattanási ujjlenyomat kulcsot használunk, és eltároljuk a gyorsítótárban, hogy megakadályozzuk a duplikált küldést). A visszapattanási ujjlenyomat egy kulcs, amely az üzenet ujjlenyomatából és a visszapattanási cím és hibakódjának hash-éből áll össze. További részletekért lásd a [Fingerprinting](#how-do-you-determine-an-email-fingerprint) szakaszt az üzenet ujjlenyomatának kiszámításáról. A sikeresen elküldött visszapattanási ujjlenyomatok 7 nap után lejárnak a Redis gyorsítótárunkban.

3. Csak akkor küldünk, ha a MAIL FROM és/vagy a From nem üres, és nem tartalmaz (kis- és nagybetűtől függetlenül) [postmaster felhasználónevet](#what-are-postmaster-addresses) (az emailben az @ előtti rész).

4. Nem küldünk, ha az eredeti üzenet bármelyik alábbi fejlécet tartalmazta (kis- és nagybetűtől függetlenül):

   * `auto-submitted` fejléc, amelynek értéke nem `no`.
   * `x-auto-response-suppress` fejléc, amelynek értéke `dr`, `autoreply`, `auto-reply`, `auto_reply` vagy `all`.
   * `list-id`, `list-subscribe`, `list-unsubscribe`, `list-help`, `list-post`, `list-owner`, `list-archive`, `x-autoreply`, `x-autorespond` vagy `x-auto-respond` fejléc (értéktől függetlenül).
   * `precedence` fejléc, amelynek értéke `bulk`, `autoreply`, `auto-reply`, `auto_reply` vagy `list`.

5. Nem küldünk, ha a MAIL FROM vagy a From e-mail cím `+donotreply`, `-donotreply`, `+noreply` vagy `-noreply` végződésű.

6. Nem küldünk, ha a From e-mail cím felhasználóneve `mdaemon` volt, és volt egy kis- és nagybetűtől független `X-MDDSN-Message` fejléc.

7. Nem küldünk, ha volt egy kis- és nagybetűtől független `content-type` fejléc, amely `multipart/report` értékű volt.

### Hogyan határozzuk meg egy e-mail ujjlenyomatát {#how-do-you-determine-an-email-fingerprint}

Az e-mail ujjlenyomatát az e-mail egyediségének meghatározására használjuk, és hogy megakadályozzuk az ismétlődő üzenetek kézbesítését és a [duplikált visszapattanások](#prevent-unnecessary-bounces-to-protect-against-backscatter) elküldését.

Az ujjlenyomat a következő elemekből kerül kiszámításra:

* A kliens által feloldott FQDN hosztnév vagy IP-cím
* `Message-ID` fejléc értéke (ha van)
* `Date` fejléc értéke (ha van)
* `From` fejléc értéke (ha van)
* `To` fejléc értéke (ha van)
* `Cc` fejléc értéke (ha van)
* `Subject` fejléc értéke (ha van)
* `Body` értéke (ha van)

### Tudok-e e-maileket továbbítani más portokra, mint a 25 (pl. ha az internetszolgáltatóm blokkolta a 25-ös portot) {#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25}

Igen, 2020. május 5-től elérhető ez a funkció. Jelenleg a funkció domain-specifikus, nem alias-specifikus. Ha alias-specifikus megoldásra van szüksége, kérjük, vegye fel velünk a kapcsolatot, hogy jelezze igényeit.

<div class="alert my-3 alert-danger">
  <i class="fa fa-stop-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Fokozott adatvédelmi védelem:
  </strong>
  <span>
    Ha fizetős csomagon van (amely fokozott adatvédelmi védelmet tartalmaz), kérjük, látogasson el a <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Saját fiók <i class="fa fa-angle-right"></i> Domain-ek</a> oldalra, kattintson a domainje melletti "Beállítások" gombra, majd a "Beállítások" fülre. Ha többet szeretne megtudni a fizetős csomagokról, tekintse meg a <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Árazás</a> oldalunkat. Egyébként folytathatja az alábbi utasítások követését.
  </span>
</div>
Ha az ingyenes csomagon vagy, akkor egyszerűen adj hozzá egy új DNS <strong class="notranslate">TXT</strong> rekordot az alábbiak szerint, de változtasd meg a portot 25-ről a választott portra.

Például, ha azt szeretném, hogy az összes `example.com`-ra érkező e-mail az alias címzettek SMTP portjára, 1337-re továbbítódjon a 25 helyett:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Név/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Típus</th>
      <th>Válasz/Érték</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", vagy üres</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email-port=1337</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tipp:
  </strong>
    A leggyakoribb eset egyedi port továbbítás beállítására az, amikor az összes example.com-ra érkező e-mailt egy másik portra szeretnéd továbbítani az example.com-on belül, nem pedig az SMTP szabványos 25-ös portjára. Ehhez egyszerűen add hozzá a következő <strong class="notranslate">TXT</strong> catch-all rekordot.
  <span>
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Név/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Típus</th>
      <th>Válasz/Érték</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", vagy üres</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=example.com</code></td>
    </tr>
  </tbody>
</table>

### Támogatja a plusz + jelet a Gmail aliasokhoz? {#does-it-support-the-plus--symbol-for-gmail-aliases}

Igen, abszolút.

### Támogatja az aldomain-eket? {#does-it-support-sub-domains}

Igen, abszolút. Ahelyett, hogy "@", ".", vagy üres értéket használnál név/host/alias mezőben, egyszerűen az aldomain nevet kell megadnod értékként.

Ha például a `foo.example.com`-ra szeretnéd továbbítani az e-maileket, akkor a DNS beállításaidban (mind az MX, mind a <strong class="notranslate">TXT</strong> rekordoknál) a név/host/alias értékeként `foo`-t add meg.

### Továbbítja az e-mail fejlécét? {#does-this-forward-my-emails-headers}

Igen, abszolút.

### Jól tesztelt ez a rendszer? {#is-this-well-tested}

Igen, vannak tesztek írva [ava](https://github.com/avajs/ava) segítségével, és kódlefedettség is rendelkezésre áll.

### Átadja az SMTP válaszüzeneteket és kódokat? {#do-you-pass-along-smtp-response-messages-and-codes}

Igen, abszolút. Például, ha egy `hello@example.com` címre küldesz e-mailt, és az tovább van irányítva a `user@gmail.com` címre, akkor az SMTP válaszüzenet és kód a "gmail.com" SMTP szervertől érkezik vissza, nem pedig a "mx1.forwardemail.net" vagy "mx2.forwardemail.net" proxy szervertől.

### Hogyan akadályozzátok meg a spammereket és biztosítjátok a jó e-mail továbbítási hírnevet? {#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation}

Lásd a fentebb található [Hogyan működik az e-mail továbbító rendszeretek](#how-does-your-email-forwarding-system-work), [Hogyan kezelitek az e-mail kézbesítési problémákat](#how-do-you-handle-email-delivery-issues), és [Hogyan kezelitek, ha az IP címeitek blokkolva lesznek](#how-do-you-handle-your-ip-addresses-becoming-blocked) szakaszokat.

### Hogyan végzitek a DNS lekérdezéseket domain neveken? {#how-do-you-perform-dns-lookups-on-domain-names}

Létrehoztunk egy nyílt forráskódú szoftverprojektet :tangerine: [Tangerine](https://github.com/forwardemail/tangerine) néven, és ezt használjuk DNS lekérdezésekhez. Az alapértelmezett DNS szerverek a `1.1.1.1` és `1.0.0.1`, és a DNS lekérdezések [DNS over HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") protokollon keresztül történnek az alkalmazás rétegben.

:tangerine: [Tangerine](https://github.com/tangerine) alapértelmezés szerint a [CloudFlare adatvédelmi szempontból elsődleges fogyasztói DNS szolgáltatását][cloudflare-dns] használja.


## Fiók és Számlázás {#account-and-billing}

### Van pénzvisszafizetési garancia a fizetős csomagokra? {#do-you-offer-a-money-back-guarantee-on-paid-plans}

Igen! Automatikus visszatérítés történik, ha 30 napon belül frissítesz, visszalépsz vagy törlöd a fiókodat a csomagod első indítása óta. Ez csak az első alkalommal vásárló ügyfelekre vonatkozik.
### Ha váltok a csomagok között, akkor arányosítotok és visszatérítitek a különbözetet? {#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference}

Nem arányosítunk és nem térítünk vissza különbözetet, amikor csomagot váltasz. Ehelyett az aktuális csomagod lejárati dátumától számított fennmaradó időtartamot átváltjuk az új csomagodhoz legközelebbi relatív időtartamra (hónapokra lefelé kerekítve).

Fontos megjegyezni, hogy ha 30 napon belül váltasz fizetős csomagok között az első fizetős csomagod elindítása óta, akkor automatikusan visszatérítjük az aktuális csomagod teljes összegét.

### Használhatom ezt az e-mail továbbító szolgáltatást „tartalék” vagy „átváltó” MX szerverként? {#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server}

Nem, ez nem ajánlott, mivel egyszerre csak egy levelezőszervert lehet használni. A tartalék szervereket általában soha nem próbálják újra a prioritási hibák miatt, és a levelezőszerverek nem tartják be az MX prioritás ellenőrzést.

### Kikapcsolhatok bizonyos aliasokat? {#can-i-disable-specific-aliases}

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Fontos:
  </strong>
  <span>
    Ha fizetős csomagod van, akkor a <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Saját fiók <i class="fa fa-angle-right"></i> Domain-ek</a> <i class="fa fa-angle-right"></i> Aliasok <i class="fa fa-angle-right"></i> Alias szerkesztése <i class="fa fa-angle-right"></i> Az „Aktív” jelölőnégyzet törlése <i class="fa fa-angle-right"></i> Folytatás menüpontot kell használnod.
  </span>
</div>

Igen, egyszerűen szerkeszd a DNS <strong class="notranslate">TXT</strong> rekordodat, és az alias elé tegyél egy, kettő vagy három felkiáltójelet (lásd lent).

Fontos, hogy megőrizd a ":" elválasztót, mert erre szükség van, ha később ki akarod kapcsolni ezt a funkciót (és importáláskor is használatos, ha fizetős csomagra váltasz).

**Csendes elutasítás esetén (a küldő úgy látja, mintha az üzenet sikeresen elküldésre került volna, de valójában nem jut el sehova) (állapotkód `250`):** Ha az alias elé egy "!" (egyszeres felkiáltójel) kerül, akkor a küldőknek `250` státuszkódot ad vissza, de az e-mailek nem jutnak el sehova (pl. fekete lyuk vagy `/dev/null`).

**Lágy elutasítás esetén (állapotkód `421`):** Ha az alias elé "!!" (kettős felkiáltójel) kerül, akkor a küldőknek `421` lágy hibakódot ad vissza, és az e-maileket akár 5 napig újrapróbálják, mielőtt elutasítják és visszapattintják.

**Kemény elutasítás esetén (állapotkód `550`):** Ha az alias elé "!!!" (három felkiáltójel) kerül, akkor a küldőknek `550` állandó hibakódot ad vissza, és az e-maileket elutasítják és visszapattintják.

Például, ha azt szeretném, hogy az összes `alias@example.com` címre érkező e-mail ne jusson el a `user@gmail.com` címre, hanem elutasításra és visszapattanásra kerüljön (három felkiáltójel használatával):

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Név/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Típus</th>
      <th>Válasz/Érték</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", vagy üres</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=!!!alias:user@gmail.com</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tipp:
  </strong>
  <span>
    Át is írhatod a továbbított címzett címét egyszerűen "nobody@forwardemail.net"-re, ami az alábbi példában látható módon senkihez irányítja az üzenetet.
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Név/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Típus</th>
      <th>Válasz/Érték</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", vagy üres</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=!!!alias:nobody@forwardemail.net</code></td>
    </tr>
  </tbody>
</table>
<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tipp:
  </strong>
  <span>
    Ha fokozott biztonságot szeretnél, akkor eltávolíthatod a ":user@gmail.com" (vagy ":nobody@forwardemail.net") részt is, így csak a "!!!alias" marad, ahogy az alábbi példában.
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Név/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Típus</th>
      <th>Válasz/Érték</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", vagy üres</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=!!!alias</code></td>
    </tr>
  </tbody>
</table>

### Tudok több címzettnek is továbbítani e-maileket {#can-i-forward-emails-to-multiple-recipients}

Igen, természetesen. Csak adj meg több címzettet a <strong class="notranslate">TXT</strong> rekordjaidban.

Például, ha azt szeretném, hogy a `hello@example.com` címre érkező e-mail továbbítódjon a `user+a@gmail.com` és a `user+b@gmail.com` címekre, akkor a <strong class="notranslate">TXT</strong> rekordom így nézne ki:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Név/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Típus</th>
      <th>Válasz/Érték</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", vagy üres</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code class="cursor-initial" data-original-title="" title="">forward-email=hello:user+a@gmail.com,hello:user+b@gmail.com</code></td>
    </tr>
  </tbody>
</table>

Vagy megadhatod őket két külön sorban is, például így:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Név/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Típus</th>
      <th>Válasz/Érték</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", vagy üres</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=hello:user+a@gmail.com</code></td>
    </tr>
    <tr>
      <td><em>"@", ".", vagy üres</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=hello:user+b@gmail.com</code></td>
    </tr>
  </tbody>
</table>

Rajtad múlik!

### Lehet több globális catch-all címzett is {#can-i-have-multiple-global-catch-all-recipients}

Igen, lehet. Csak adj meg több globális catch-all címzettet a <strong class="notranslate">TXT</strong> rekordjaidban.

Például, ha azt szeretném, hogy minden `*@example.com` címre érkező e-mail (az asterisk azt jelenti, hogy ez egy helyettesítő karakter, azaz catch-all) továbbítódjon a `user+a@gmail.com` és a `user+b@gmail.com` címekre, akkor a <strong class="notranslate">TXT</strong> rekordom így nézne ki:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Név/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Típus</th>
      <th>Válasz/Érték</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", vagy üres</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=user+a@gmail.com,user+b@gmail.com</code></td>
    </tr>
  </tbody>
</table>

Vagy megadhatod őket két külön sorban is, például így:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Név/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Típus</th>
      <th>Válasz/Érték</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", vagy üres</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=user+a@gmail.com</code></td>
    </tr>
    <tr>
      <td><em>@, ".", vagy üres</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=user+b@gmail.com</code></td>
    </tr>
  </tbody>
</table>
Rajtad múlik!

### Van-e maximális korlát arra, hogy hány email címet továbbíthatok aliasonként {#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias}

Igen, az alapértelmezett korlát 10. Ez NEM azt jelenti, hogy csak 10 aliasod lehet a domain neveden. Annyi aliasod lehet, amennyit csak szeretnél (korlátlan mennyiség). Ez azt jelenti, hogy egy alias csak 10 egyedi email címre továbbítható. Lehet például `hello:user+1@gmail.com`, `hello:user+2@gmail.com`, `hello:user+3@gmail.com`, … (1-től 10-ig) – és a `hello@example.com`-ra érkező emailek továbbításra kerülnek a `user+1@gmail.com`, `user+2@gmail.com`, `user+3@gmail.com`, … (1-től 10-ig) címekre.

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tipp:
  </strong>
  <span>
    Több mint 10 címzett aliasonként? Küldj nekünk egy emailt, és örömmel növeljük a fiókod korlátját.
  </span>
</div>

### Tudok-e rekurzívan továbbítani emaileket {#can-i-recursively-forward-emails}

Igen, tudsz, azonban továbbra is be kell tartanod a maximális korlátot. Ha van `hello:linus@example.com` és `linus:user@gmail.com`, akkor a `hello@example.com`-ra érkező emailek továbbításra kerülnek a `linus@example.com` és a `user@gmail.com` címekre. Figyelem, hibaüzenet jelenik meg, ha megpróbálsz a maximális korláton túl rekurzívan továbbítani emaileket.

### Tudnak-e az emberek engedélyem nélkül leiratkozni vagy regisztrálni az email továbbításomat {#can-people-unregister-or-register-my-email-forwarding-without-my-permission}

MX és <strong class="notranslate">TXT</strong> rekord ellenőrzést használunk, ezért ha hozzáadod a szolgáltatás megfelelő MX és <strong class="notranslate">TXT</strong> rekordjait, akkor regisztrált vagy. Ha eltávolítod őket, akkor le vagy iratkozva. A domain és DNS kezelés a te tulajdonodban van, így ha valaki hozzáfér ehhez, az problémát jelent.

### Hogyan lehet ingyenes {#how-is-it-free}

A Forward Email ingyenes szintet kínál nyílt forráskódú fejlesztés, hatékony infrastruktúra és opcionális fizetős csomagok kombinációján keresztül, amelyek támogatják a szolgáltatást.

Az ingyenes szintünket az alábbiak támogatják:

1. **Nyílt forráskódú fejlesztés**: A kódunk nyílt forráskódú, lehetővé téve a közösségi hozzájárulásokat és átlátható működést.

2. **Hatékony infrastruktúra**: Optimalizáltuk rendszereinket, hogy minimális erőforrásokkal kezeljék az email továbbítást.

3. **Fizetős prémium csomagok**: Azok a felhasználók, akik további funkciókat, például SMTP küldést, IMAP fogadást vagy fejlettebb adatvédelmi lehetőségeket igényelnek, előfizetnek fizetős csomagjainkra.

4. **Ésszerű használati korlátok**: Az ingyenes szint tisztességes használati szabályokat tartalmaz az visszaélések megelőzésére.

> \[!NOTE]
> Elkötelezettek vagyunk amellett, hogy az alap email továbbítás ingyenes maradjon, miközben prémium funkciókat kínálunk a fejlettebb igényű felhasználóknak.

> \[!TIP]
> Ha értékesnek találod a szolgáltatásunkat, fontold meg a fizetős csomagra való váltást, hogy támogasd a folyamatos fejlesztést és karbantartást.

### Mi az email méretkorlátja {#what-is-the-max-email-size-limit}

Alapértelmezés szerint 50MB méretkorlát van, amely tartalmazza a tartalmat, fejlécet és csatolmányokat. Figyelem, olyan szolgáltatások, mint a Gmail és az Outlook csak 25MB méretkorlátot engedélyeznek, és ha ezt túlléped, amikor ezekhez a szolgáltatókhoz küldesz, hibaüzenetet kapsz.

Hiba megfelelő válaszkóddal visszaadásra kerül, ha a fájlméret-korlátot túllépik.

### Tároltok-e email naplókat {#do-you-store-logs-of-emails}

Nem, nem írunk lemezre és nem tárolunk naplókat – az [hibák kivételével](#do-you-store-error-logs) és az [SMTP küldés esetén](#do-you-support-sending-email-with-smtp) (lásd a [Adatvédelmi Szabályzatunkat](/privacy)).

Minden memóriában történik, és [a forráskódunk elérhető a GitHubon](https://github.com/forwardemail).

### Tároltok-e hibanaplókat {#do-you-store-error-logs}

**Igen. A hibanaplók elérhetők a [Saját fiók → Naplók](/my-account/logs) vagy a [Saját fiók → Domain-ek](/my-account/domains) alatt.**

2023 februárjától a `4xx` és `5xx` SMTP válaszkódokra vonatkozó hibanaplókat 7 napig tároljuk – amelyek tartalmazzák az SMTP hibát, borítékot és az email fejlécet (az email törzsét és csatolmányokat **nem** tároljuk).
A hibanaplók lehetővé teszik, hogy ellenőrizze a hiányzó fontos e-maileket, és csökkentse a spam hamis pozitív eredményeit a [domainjeihez](/my-account/domains). Emellett nagyszerű források a [e-mail webhookok] (#do-you-support-webhooks) hibakereséséhez (mivel a hibanaplók tartalmazzák a webhook végpont válaszát).

A [sebességkorlátozás] (#do-you-have-rate-limiting) és a [szürkelista] (#do-you-have-a-greylist) hibanaplói nem elérhetők, mivel a kapcsolat korán megszakad (pl. mielőtt az `RCPT TO` és `MAIL FROM` parancsok továbbíthatók lennének).

További információért lásd az [Adatvédelmi irányelveinket](/privacy).

### Elolvassa az e-mailjeimet? {#do-you-read-my-emails}

Nem, egyáltalán nem. Lásd az [Adatvédelmi irányelveinket](/privacy).

Sok más e-mail továbbító szolgáltatás tárolja és potenciálisan elolvashatja az e-mailjeit. Nincs ok arra, hogy a továbbított e-maileket lemezre tárolják – ezért terveztük meg az első nyílt forráskódú megoldást, amely mindent memóriában kezel.

Úgy véljük, hogy joga van a magánélethez, és ezt szigorúan tiszteletben tartjuk. A szerverre telepített kód [nyílt forráskódú szoftver a GitHubon](https://github.com/forwardemail) az átláthatóság és a bizalom építése érdekében.

### Tudok "küldeni e-mailt másként" Gmailben ezzel? {#can-i-send-mail-as-in-gmail-with-this}

Igen! 2018. október 2-től elérhető ez a funkció. Lásd fent a [Hogyan küldjünk e-mailt másként Gmail használatával](#how-to-send-mail-as-using-gmail) részt!

Állítsa be a Gmail SPF rekordját is a DNS konfigurációjában <strong class="notranslate">TXT</strong> rekordként.

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Fontos:
  </strong>
  <span>
    Ha Gmailt (pl. Küldés másként) vagy G Suite-ot használ, akkor hozzá kell adnia a <code>include:_spf.google.com</code> elemet az SPF <strong class="notranslate">TXT</strong> rekordjához, például:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
  </span>
</div>

### Tudok "küldeni e-mailt másként" Outlookban ezzel? {#can-i-send-mail-as-in-outlook-with-this}

Igen! 2018. október 2-től elérhető ez a funkció. Egyszerűen tekintse meg az alábbi két Microsoft linket:

* <https://support.office.com/en-us/article/add-or-remove-an-email-alias-in-outlook-com-459b1989-356d-40fa-a689-8f285b13f1f2>
* <https://support.office.com/en-us/article/send-email-from-a-different-address-in-outlook-com-ccba89cb-141c-4a36-8c56-6d16a8556d2e>

Állítsa be az Outlook SPF rekordját is a DNS konfigurációjában <strong class="notranslate">TXT</strong> rekordként.

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Fontos:
  </strong>
  <span>
    Ha Microsoft Outlookot vagy Live.com-ot használ, hozzá kell adnia a <code>include:spf.protection.outlook.com</code> elemet az SPF <strong class="notranslate">TXT</strong> rekordjához, például:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:spf.protection.outlook.com -all</code>
  </span>
</div>

### Tudok "küldeni e-mailt másként" Apple Mailben és iCloud Mailben ezzel? {#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this}

Ha iCloud+ előfizető vagy, használhatsz egyéni domaint. [Szolgáltatásunk kompatibilis az Apple Mail-lel is](#apple-mail).

További információért lásd: <https://support.apple.com/en-us/102540>.

### Tudok korlátlan e-maileket továbbítani ezzel? {#can-i-forward-unlimited-emails-with-this}

Igen, azonban a "viszonylag ismeretlen" küldőket óránként 100 kapcsolatban korlátozzuk hostnévenként vagy IP-címenként. Lásd a fentiekben a [Sebességkorlátozás](#do-you-have-rate-limiting) és [Szürkelista](#do-you-have-a-greylist) részeket.

A "viszonylag ismeretlen" alatt azokat a küldőket értjük, akik nem szerepelnek az [engedélyező listán] (#do-you-have-an-allowlist).

Ha ezt a korlátot túllépik, 421-es válaszkódot küldünk, amely azt jelzi a küldő levelezőszerverének, hogy próbálkozzon később újra.

### Kínálnak korlátlan domaineket egy áron? {#do-you-offer-unlimited-domains-for-one-price}

Igen. Függetlenül attól, hogy melyik csomagot választja, csak egy havi díjat fizet – amely az összes domainjét lefedi.
### Milyen fizetési módokat fogadnak el {#which-payment-methods-do-you-accept}

A Forward Email az alábbi egyszeri vagy havi/negyedéves/éves fizetési módokat fogadja el:

1. **Hitel-/Bankkártyák/Banki átutalások**: Visa, Mastercard, American Express, Discover, JCB, Diners Club stb.
2. **PayPal**: Csatlakoztassa PayPal-fiókját a könnyű fizetéshez
3. **Kriptovaluta**: Elfogadunk fizetéseket a Stripe stabilcoin fizetésein keresztül az Ethereum, Polygon és Solana hálózatokon

> \[!NOTE]
> Korlátozott fizetési információkat tárolunk a szervereinken, amelyek csak fizetési azonosítókat és hivatkozásokat tartalmaznak a [Stripe](https://stripe.com/global) és [PayPal](https://www.paypal.com) tranzakciók, ügyfelek, előfizetések és fizetések azonosítóihoz.

> \[!TIP]
> A maximális adatvédelem érdekében fontolja meg a kriptovaluta fizetések használatát.

Minden fizetés biztonságosan történik a Stripe vagy a PayPal rendszerein keresztül. A fizetési adatait soha nem tároljuk a szervereinken.


## További források {#additional-resources}

> \[!TIP]
> Az alábbi cikkeinket rendszeresen frissítjük új útmutatókkal, tippekkel és műszaki információkkal. Gyakran nézzen vissza a legfrissebb tartalomért.

* [Esettanulmányok és fejlesztői dokumentáció](/blog/docs)
* [Források](/resources)
* [Útmutatók](/guides)

[gmail-2fa]: https://myaccount.google.com/signinoptions/two-step-verification

[cloudflare-dns]: https://blog.cloudflare.com/announcing-1111/
