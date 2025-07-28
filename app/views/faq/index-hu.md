# Gyakran Ismételt Kérdések {#frequently-asked-questions}

<img loading="lusta" src="/img/articles/faq.webp" alt="" class="lekerekített-lg" />

## Tartalomjegyzék {#table-of-contents}

* [Gyorsindítás](#quick-start)
* [Bevezetés](#introduction)
  * [Mi az az e-mail továbbítása?](#what-is-forward-email)
  * [Kik használják az e-mail továbbítását?](#who-uses-forward-email)
  * [Mi a Forward Email előzménye?](#what-is-forward-emails-history)
  * [Milyen gyors ez a szolgáltatás](#how-fast-is-this-service)
* [E-mail kliensek](#email-clients)
  * [Thunderbird](#thunderbird)
  * [Microsoft Outlook](#microsoft-outlook)
  * [Apple Mail](#apple-mail)
  * [Mobileszközök](#mobile-devices)
  * [Hogyan küldjünk levelet Gmail-ben más néven?](#how-to-send-mail-as-using-gmail)
  * [Mi a hagyományos, ingyenes útmutató a Gmailben küldött levelek más néven szolgáltatáshoz?](#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail)
  * [Speciális Gmail-útválasztási konfiguráció](#advanced-gmail-routing-configuration)
  * [Speciális Outlook útválasztási konfiguráció](#advanced-outlook-routing-configuration)
* [Hibaelhárítás](#troubleshooting)
  * [Miért nem kapom meg a teszt e-mailjeimet?](#why-am-i-not-receiving-my-test-emails)
  * [Hogyan tudom beállítani az e-mail kliensemet, hogy működjön az e-mail továbbítása funkcióval?](#how-do-i-configure-my-email-client-to-work-with-forward-email)
  * [Miért kerülnek az e-mailjeim a Spam és a Levélszemét mappába, és hogyan ellenőrizhetem a domainem hírnevét?](#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation)
  * [Mit tegyek, ha spam e-maileket kapok?](#what-should-i-do-if-i-receive-spam-emails)
  * [Miért jelennek meg a Gmailben a nekem küldött teszt e-mailek "gyanúsként"?](#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious)
  * [Eltávolíthatom a via forwardemail dot net feliratot a Gmailben?](#can-i-remove-the-via-forwardemail-dot-net-in-gmail)
* [Adatkezelés](#data-management)
  * [Hol találhatók a szervereitek?](#where-are-your-servers-located)
  * [Hogyan exportálhatom és készíthetek biztonsági másolatot a postaládámról?](#how-do-i-export-and-backup-my-mailbox)
  * [Hogyan importálhatom és migrálhatom a meglévő postaládámat?](#how-do-i-import-and-migrate-my-existing-mailbox)
  * [Támogatják az önálló tárhelyszolgáltatást?](#do-you-support-self-hosting)
* [E-mail konfiguráció](#email-configuration)
  * [Hogyan kezdjem el és állítsam be az e-mail-továbbítást?](#how-do-i-get-started-and-set-up-email-forwarding)
  * [Használhatok több MX központot és szervert a fejlett továbbításhoz?](#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding)
  * [Hogyan állíthatok be egy vakációs válaszadót (automatikus válaszadót a távollét esetén)?](#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder)
  * [Hogyan állíthatom be az SPF-et az e-mailek továbbításához](#how-do-i-set-up-spf-for-forward-email)
  * [Hogyan állíthatom be a DKIM-et az e-mailek továbbításához](#how-do-i-set-up-dkim-for-forward-email)
  * [Hogyan állíthatom be a DMARC-ot az e-mail továbbításához](#how-do-i-set-up-dmarc-for-forward-email)
  * [Hogyan csatlakoztathatom és konfigurálhatom a névjegyeimet?](#how-do-i-connect-and-configure-my-contacts)
  * [Hogyan csatlakoztathatom és konfigurálhatom a naptáraimat?](#how-do-i-connect-and-configure-my-calendars)
  * [Hogyan adhatok hozzá további naptárakat és hogyan kezelhetem a meglévő naptárakat?](#how-do-i-add-more-calendars-and-manage-existing-calendars)
  * [Hogyan állíthatom be az SRS-t az e-mailek továbbításához](#how-do-i-set-up-srs-for-forward-email)
  * [Hogyan állíthatom be az MTA-STS-t az e-mailek továbbításához?](#how-do-i-set-up-mta-sts-for-forward-email)
  * [Hogyan adhatok hozzá profilképet az e-mail címemhez](#how-do-i-add-a-profile-picture-to-my-email-address)
* [Speciális funkciók](#advanced-features)
  * [Támogatnak-e hírleveleket vagy levelezőlistákat marketinggel kapcsolatos e-mailekhez?](#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email)
  * [Támogatják az API-n keresztüli e-mail küldést?](#do-you-support-sending-email-with-api)
  * [Támogatja az IMAP-on keresztüli e-mail fogadást?](#do-you-support-receiving-email-with-imap)
  * [Támogatja a POP3-at?](#do-you-support-pop3)
  * [Támogatják a naptárakat (CalDAV)?](#do-you-support-calendars-caldav)
  * [Támogatják a névjegyeket (CardDAV)?](#do-you-support-contacts-carddav)
  * [Támogatják az SMTP-n keresztüli e-mail küldést?](#do-you-support-sending-email-with-smtp)
  * [Támogatják az OpenPGP/MIME-t, a végponttól végpontig terjedő titkosítást ("E2EE") és a Web Key Directory-t ("WKD")?](#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd)
  * [Támogatod az MTA-STS-t?](#do-you-support-mta-sts)
  * [Támogatják a jelszavakat és a WebAuthnt?](#do-you-support-passkeys-and-webauthn)
  * [Támogatja az e-mailes bevált gyakorlatokat?](#do-you-support-email-best-practices)
  * [Támogatják a bounce webhookokat?](#do-you-support-bounce-webhooks)
  * [Támogatod a webhookokat?](#do-you-support-webhooks)
  * [Támogatja a reguláris kifejezéseket vagy a regexeket?](#do-you-support-regular-expressions-or-regex)
  * [Mik a kimenő SMTP-korlátok?](#what-are-your-outbound-smtp-limits)
  * [Szükségem van jóváhagyásra az SMTP engedélyezéséhez?](#do-i-need-approval-to-enable-smtp)
  * [Mik az SMTP szerver konfigurációs beállításai?](#what-are-your-smtp-server-configuration-settings)
  * [Mik az IMAP szerver konfigurációs beállításai?](#what-are-your-imap-server-configuration-settings)
  * [Mik a POP3 szerver konfigurációs beállításai?](#what-are-your-pop3-server-configuration-settings)
  * [Postfix SMTP-továbbító konfiguráció](#postfix-smtp-relay-configuration)
* [Biztonság](#security)
  * [Speciális szervererősítési technikák](#advanced-server-hardening-techniques)
  * [Rendelkezik SOC 2 vagy ISO 27001 tanúsítvánnyal?](#do-you-have-soc-2-or-iso-27001-certifications)
  * [TLS titkosítást használsz az e-mail továbbításhoz?](#do-you-use-tls-encryption-for-email-forwarding)
  * [Megőrzik az e-mail hitelesítési fejléceket?](#do-you-preserve-email-authentication-headers)
  * [Megőrzi az eredeti e-mail fejléceket és megakadályozza a hamisítást?](#do-you-preserve-original-email-headers-and-prevent-spoofing)
  * [Hogyan védekezhetsz a spam és a visszaélések ellen?](#how-do-you-protect-against-spam-and-abuse)
  * [Tárolsz e-mail tartalmat lemezen?](#do-you-store-email-content-on-disk)
  * [Kiszivároghat-e az e-mailek tartalma rendszerösszeomlások esetén?](#can-email-content-be-exposed-during-system-crashes)
  * [Ki férhet hozzá az e-mail infrastruktúrájához?](#who-has-access-to-your-email-infrastructure)
  * [Milyen infrastruktúra-szolgáltatókat vesz igénybe?](#what-infrastructure-providers-do-you-use)
  * [Kínálnak adatfeldolgozási megállapodást (DPA)?](#do-you-offer-a-data-processing-agreement-dpa)
  * [Hogyan kezeli az adatvédelmi incidensekről szóló értesítéseket?](#how-do-you-handle-data-breach-notifications)
  * [Kínálnak tesztkörnyezetet?](#do-you-offer-a-test-environment)
  * [Biztosítanak-e monitorozó és riasztási eszközöket?](#do-you-provide-monitoring-and-alerting-tools)
  * [Hogyan biztosítható a magas rendelkezésre állás?](#how-do-you-ensure-high-availability)
  * [Megfelel a Nemzetvédelmi Engedélyezési Törvény (NDAA) 889. szakaszának?](#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa)
* [Rendszer és műszaki adatok](#system-and-technical-details)
  * [Tárolsz e-maileket és azok tartalmát?](#do-you-store-emails-and-their-contents)
  * [Hogyan működik az e-mail továbbító rendszered?](#how-does-your-email-forwarding-system-work)
  * [Hogyan dolgozzuk fel az e-maileket továbbításhoz?](#how-do-you-process-an-email-for-forwarding)
  * [Hogyan kezeled az e-mail kézbesítési problémákat](#how-do-you-handle-email-delivery-issues)
  * [Hogyan kezeled az IP-címeid blokkolását?](#how-do-you-handle-your-ip-addresses-becoming-blocked)
  * [Mik azok a postamesterek címei?](#what-are-postmaster-addresses)
  * [Mik azok a válasz nélküli címek?](#what-are-no-reply-addresses)
  * [Mik a szervered IP-címei?](#what-are-your-servers-ip-addresses)
  * [Van engedélyezőlistád?](#do-you-have-an-allowlist)
  * [Mely domainnév-kiterjesztések vannak alapértelmezés szerint engedélyezőlistán?](#what-domain-name-extensions-are-allowlisted-by-default)
  * [Mik az engedélyezőlistád kritériumai?](#what-is-your-allowlist-criteria)
  * [Milyen domain névkiterjesztések használhatók ingyenesen?](#what-domain-name-extensions-can-be-used-for-free)
  * [Van szürkelistád?](#do-you-have-a-greylist)
  * [Van tiltólistád?](#do-you-have-a-denylist)
  * [Van sebességkorlátozásod?](#do-you-have-rate-limiting)
  * [Hogyan védekezel a visszaverődés ellen?](#how-do-you-protect-against-backscatter)
  * [Ismert spammerektől érkező levelek visszapattanásának megakadályozása](#prevent-bounces-from-known-mail-from-spammers)
  * [Akadályozza meg a felesleges visszaverődéseket a visszaverődés elleni védelem érdekében](#prevent-unnecessary-bounces-to-protect-against-backscatter)
  * [Hogyan lehet meghatározni az e-mail ujjlenyomatot?](#how-do-you-determine-an-email-fingerprint)
  * [Átirányíthatok e-maileket a 25-östől eltérő portokra (pl. ha az internetszolgáltatóm blokkolta a 25-ös portot)?](#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25)
  * [Támogatja a plusz + szimbólumot a Gmail aliasokhoz?](#does-it-support-the-plus--symbol-for-gmail-aliases)
  * [Támogatja az aldoméneket?](#does-it-support-sub-domains)
  * [Ez továbbítja az e-mail fejléceit?](#does-this-forward-my-emails-headers)
  * [Ez jól tesztelt](#is-this-well-tested)
  * [Átadják az SMTP válaszüzeneteket és kódokat?](#do-you-pass-along-smtp-response-messages-and-codes)
  * [Hogyan előzhető meg a spammerek használata, és hogyan biztosítható a jó hírnév az e-mail továbbításában](#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation)
  * [Hogyan lehet DNS-keresést végezni domainneveken?](#how-do-you-perform-dns-lookups-on-domain-names)
* [Fiók és számlázás](#account-and-billing)
  * [Fizetős csomagokra kínálnak pénzvisszafizetési garanciát?](#do-you-offer-a-money-back-guarantee-on-paid-plans)
  * [Ha csomagot váltok, arányosan számolják el és visszatérítik a különbözetet?](#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference)
  * [Használhatom ezt az e-mail továbbító szolgáltatást csak "tartalék" vagy "tartalék" MX szerverként](#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server)
  * [Letilthatok bizonyos aliasokat?](#can-i-disable-specific-aliases)
  * [Továbbíthatok e-maileket több címzettnek](#can-i-forward-emails-to-multiple-recipients)
  * [Lehet több globális, mindent gyűjtő címzettem?](#can-i-have-multiple-global-catch-all-recipients)
  * [Van-e felső határa annak, hogy aliasonként hány e-mail címre továbbíthatok?](#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias)
  * [Rekurzívan továbbíthatok e-maileket?](#can-i-recursively-forward-emails)
  * [Leiratkozhatnak vagy regisztrálhatnak az e-mail továbbítóm az engedélyem nélkül?](#can-people-unregister-or-register-my-email-forwarding-without-my-permission)
  * [Hogy ingyenes?](#how-is-it-free)
  * [Mi a maximális e-mail méretkorlát?](#what-is-the-max-email-size-limit)
  * [Tárolnak e-mail naplókat?](#do-you-store-logs-of-emails)
  * [Tárolnak hibanaplókat?](#do-you-store-error-logs)
  * [Olvasod az e-mailjeimet?](#do-you-read-my-emails)
  * [Ezzel a Gmail-lel el tudom küldeni a levelet más néven?](#can-i-send-mail-as-in-gmail-with-this)
  * [Elküldhetem a levelet más néven az Outlookban ezzel a módszerrel?](#can-i-send-mail-as-in-outlook-with-this)
  * [Elküldhetem a levelet más néven az Apple Mailben és az iCloud Mailben ezzel a módszerrel?](#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this)
  * [Korlátlan számú e-mailt továbbíthatok ezzel?](#can-i-forward-unlimited-emails-with-this)
  * [Korlátlan számú domaint kínálnak egyetlen árért?](#do-you-offer-unlimited-domains-for-one-price)
  * [Milyen fizetési módokat fogadnak el](#which-payment-methods-do-you-accept)
* [További források](#additional-resources)

## Gyorsindítás {#quick-start}

Az e-mail továbbításának megkezdése:

1. **Fiók létrehozása** itt: [forwardemail.net/register](https://forwardemail.net/register)

2. **Adja hozzá és ellenőrizze a domainjét** a [Fiókom → Domainek](/my-account/domains) alatt

3. **E-mail aliasok/postafiókok hozzáadása és konfigurálása** a [Fiókom → Domainek](/my-account/domains) → Aliasok alatt

4. **Tesztelje a beállítását** egy új aliasra küldött e-maillel.

> \[!TIP]
> A DNS-módosítások globális bevezetése akár 24-48 órát is igénybe vehet, bár gyakran sokkal hamarabb lépnek hatályba.

> \[!IMPORTANT]
> A jobb kézbesítés érdekében javasoljuk a [SPF](#how-do-i-set-up-spf-for-forward-email), [DKIM](#how-do-i-set-up-dkim-for-forward-email) és [DMARC](#how-do-i-set-up-dmarc-for-forward-email) rekordok beállítását.

## Bevezetés {#introduction}

### Mi az az e-mail továbbítása? {#what-is-forward-email}

> \[!NOTE]
> Az e-mail továbbítása tökéletes megoldás magánszemélyek, kisvállalkozások és fejlesztők számára, akik professzionális e-mail címeket szeretnének egy teljes e-mail tárhelymegoldás költségei és karbantartása nélkül.

A Forward Email egy **teljes funkcionalitású e-mail szolgáltató** és **e-mail tárhelyszolgáltató egyéni domainnevekhez**.

Ez az egyetlen ingyenes és nyílt forráskódú szolgáltatás, amely lehetővé teszi egyéni domain e-mail címek használatát anélkül, hogy bonyolult lenne a saját e-mail szerver beállítása és karbantartása.

Szolgáltatásunk továbbítja az egyéni domainre küldött e-maileket a meglévő e-mail fiókjába – sőt, akár dedikált e-mail tárhelyszolgáltatóként is igénybe vehet minket.

Az e-mail továbbításának főbb jellemzői:

* **Egyéni domain e-mail**: Használjon professzionális e-mail címeket saját domainnevével
* **Ingyenes csomag**: Alapszintű e-mail-továbbítás ingyenesen
* **Fokozott adatvédelem**: Nem olvassuk el az e-mailjeit, és nem adjuk el az adatait
* **Nyílt forráskódú**: Teljes kódbázisunk elérhető a GitHubon
* **SMTP, IMAP és POP3 támogatás**: Teljes körű e-mail küldési és fogadási képességek
* **Végponttól végpontig terjedő titkosítás**: OpenPGP/MIME támogatás
* **Egyéni gyűjtőaliasok**: Korlátlan számú e-mail alias létrehozása

Összehasonlíthat minket több mint 56 másik e-mail szolgáltatóval a [az e-mail összehasonlító oldalunkon](/blog/best-email-service) oldalon.

> \[!TIP]
> Tudjon meg többet az e-mailek továbbításáról az ingyenes [Műszaki tanulmány](/technical-whitepaper.pdf) cikkünk elolvasásával.

### Ki használja az e-mail továbbítását {#who-uses-forward-email}

Több mint 500 000 domainnek és a következő jelentős felhasználóknak nyújtunk e-mail tárhely és e-mail továbbítási szolgáltatást:

| Vevő | Esettanulmány |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Amerikai Haditengerészeti Akadémia | [:page_facing_up: Case Study](/blog/docs/federal-government-email-service-section-889-compliant) |
| Kánoni | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| Netflix játékok |  |
| A Linux Alapítvány | [:page_facing_up: Case Study](/blog/docs/linux-foundation-email-enterprise-case-study) |
| A PHP Alapítvány |  |
| Fox Hírrádió |  |
| Disney hirdetésértékesítés |  |
| jQuery | [:page_facing_up: Case Study](/blog/docs/linux-foundation-email-enterprise-case-study) |
| LineageOS |  |
| Ubuntu | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| Ingyenes | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| Lubuntu | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| A Cambridge-i Egyetem | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| A Marylandi Egyetem | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| A Washingtoni Egyetem | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| Tufts Egyetem | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| Swarthmore Főiskola | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| Dél-Ausztrália kormánya |  |
| Dominikai Köztársaság kormánya |  |
| Repülj<span>.</span>io |  |
| RCD-szállodák |  |
| Isaac Z. Schlueter (npm) | [:page_facing_up: Case Study](/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem) |
| David Heinemeier Hansson (Ruby on Rails) |  |

### Mi a továbbított e-mail előzménye? {#what-is-forward-emails-history}

További információ az e-mailek továbbításáról a [a Rólunk oldalunk](/about) oldalon található.

### Milyen gyors ez a szolgáltatás? {#how-fast-is-this-service}

> \[!NOTE]
> Rendszerünket a sebességre és a megbízhatóságra terveztük, több redundáns szerverrel biztosítva az e-mailek gyors kézbesítését.

A Forward Email minimális késéssel, jellemzően a beérkezés után néhány másodpercen belül kézbesíti az üzeneteket.

Teljesítménymutatók:

* **Átlagos kézbesítési idő**: Kevesebb, mint 5-10 másodperc a kézhezvételtől a továbbításig ([Tekintse meg a Beérkezett üzenetekhez vezető idő (TTI) monitorozási oldalunkat](/tti))
* **Üzemidő**: A szolgáltatás elérhetősége 99,9%+
* **Globális infrastruktúra**: A szerverek stratégiailag elhelyezve vannak az optimális útvonaltervezés érdekében
* **Automatikus skálázás**: Rendszerünk a csúcsidőszakokban méreteződik az e-mailek terén

Valós időben működünk, ellentétben más szolgáltatókkal, akik a késleltetett sorokra hagyatkoznak.

Nem írunk lemezre és nem tárolunk naplókat – a [hibák kivételével](#do-you-store-error-logs) és [kimenő SMTP](#do-you-support-sending-email-with-smtp) paraméterekkel (lásd a [Adatvédelmi irányelvek](/privacy) paramétert).

Minden a memóriában és a [a forráskódunk a GitHubon található](https://github.com/forwardemail) alatt történik.

## E-mail kliensek {#email-clients}

IDEIGLENES_HELYTARTÓ_0 Thunderbird {IDEIGLENES_HELYTARTÓ_1

1. Hozz létre egy új aliast és generálj egy jelszót az E-mail továbbítása irányítópulton.
2. Nyisd meg a Thunderbirdöt, és menj a **Szerkesztés → Fiókbeállítások → Fiókműveletek → Levelezési fiók hozzáadása** menüpontra.
3. Add meg a neved, az E-mail továbbítási címed és a jelszavad.
4. Kattints a **Manuális konfigurálás** gombra, és írd be:
* Bejövő: IMAP, `imap.forwardemail.net`, port 993, SSL/TLS
* Kimenő: SMTP, `smtp.forwardemail.net`, port 587, STARTTLS
5. Kattints a **Kész** gombra.

### Microsoft Outlook {#microsoft-outlook}

1. Hozz létre egy új aliast és generálj egy jelszót az E-mail továbbítása irányítópulton.
2. Lépj a **Fájl → Fiók hozzáadása** menüpontra.
3. Add meg az E-mail továbbítási címedet, és kattints a **Csatlakozás** gombra.
4. Válaszd a **Speciális beállítások** lehetőséget, majd a **Fiókom manuális beállításának engedélyezése** lehetőséget.
5. Válaszd az **IMAP** lehetőséget, és írd be:
* Bejövő: `imap.forwardemail.net`, 993-as port, SSL
* Kimenő: `smtp.forwardemail.net`, 587-es port, TLS
* Felhasználónév: A teljes e-mail címed
* Jelszó: A generált jelszavad.
6. Kattints a **Csatlakozás** gombra.

### Apple Mail {#apple-mail}

1. Hozz létre egy új aliast és generálj egy jelszót az E-mail továbbítása irányítópulton.
2. Lépj a **Levelezés → Beállítások → Fiókok → +** menüpontra.
3. Válaszd az **Másik levelezési fiók** lehetőséget.
4. Add meg a neved, az e-mail továbbítási címed és a jelszavad.
5. A szerverbeállításokhoz írd be:
* Bejövő: `imap.forwardemail.net`
* Kimenő: `smtp.forwardemail.net`
* Felhasználónév: A teljes e-mail címed.
* Jelszó: A generált jelszavad.
6. Kattints a **Bejelentkezés** gombra.

### Mobileszközök {#mobile-devices}

iOS-hez:

1. Lépj a **Beállítások → Levelezés → Fiókok → Fiók hozzáadása → Egyéb** menüpontra.
2. Koppints a **Levelezési fiók hozzáadása** lehetőségre, és add meg az adataidat.
3. A szerverbeállításokhoz használd a fenti IMAP és SMTP beállításokat.

Androidra:

1. Lépjen a **Beállítások → Fiókok → Fiók hozzáadása → Személyes (IMAP)** menüpontra.
2. Adja meg a továbbítási e-mail címét és jelszavát.
3. A szerverbeállításokhoz használja a fenti IMAP és SMTP beállításokat.

### Hogyan küldjünk e-mailt más néven Gmailben {#how-to-send-mail-as-using-gmail}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Becsült beállítási idő:</strong>
<span>Kevesebb, mint 10 perc</span>
</div>

<div class="alert mb-3 alert-success">
<i class="fa fa-bullhorn font-weight-bold"></i>
<strong class="font-weight-bold">
Első lépések:
</strong>
<span>
Ha követte a fenti <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">Hogyan kezdhetem el és állíthatom be az e-mail-továbbítást</a> részben található utasításokat, akkor folytathatja az olvasást alább.
</span>
</div>

<div id="e-mail-tartalomként küldése">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Fontos:
</strong>
<span>
Kérjük, győződjön meg róla, hogy elolvasta a <a href="/terms" class="alert-link" target="_blank">Felhasználási Feltételeinket</a>, az <a href="/privacy" class="alert-link" target="_blank">Adatvédelmi irányelveinket</a> és a <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Kimenő SMTP-korlátainkat</a> – a használatot tudomásulvételnek és elfogadásnak tekintjük.
</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Fontos:
</strong>
<span>
Ha fejlesztő vagy, akkor tekintsd meg az <a class="alert-link" href="/email-api#outbound-emails" target="_blank">email API dokumentációnkat</a>.
</span>
</div>

1. Lépjen a <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Fiókom <i class="fa fa-angle-right"></i> Domainek</a> <i class="fa fa-angle-right"></i> Beállítások <i class="fa fa-angle-right"></i> Kimenő SMTP konfiguráció menüpontra, és kövesse a beállítási utasításokat.

2. Hozzon létre egy új aliast a domainjéhez a <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Fiókom <i class="fa fa-angle-right"></i> Domainek</a> <i class="fa fa-angle-right"></i> Aliasok (pl. <code><hello@example.com></code>) alatt.

3. Kattintson a <strong class="text-success"><i class="fa fa-key"></i>Jelszó generálása</strong> lehetőségre az újonnan létrehozott alias mellett. Másolja a vágólapra, és biztonságosan tárolja a képernyőn megjelenő generált jelszót.

4. Lépjen a [Gmail](https://gmail.com) oldalra, és a [Beállítások <i class="fa fa-angle-right"></i> Fiókok és importálás <i class="fa fa-angle-right"></i> E-mail küldése másként](https://mail.google.com/mail/u/0/#settings/accounts) alatt kattintson az „Újabb e-mail cím hozzáadása” lehetőségre.

5. Amikor a rendszer a „Név” megadását kéri, adja meg azt a nevet, amelyet az e-mail címként szeretne látni a „Feladó” mezőben (pl. „Linus Torvalds”).

6. Amikor a rendszer kéri az „E-mail cím” megadását, adja meg a <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Fiókom <i class="fa fa-angle-right"></i> Domainek</a> <i class="fa fa-angle-right"></i> Aliasok (pl. <code><hello@example.com></code>) alatt létrehozott alias teljes e-mail címét.

7. Töröld a jelölést az „Álnévként való kezelés” jelölőnégyzetből.

8. A folytatáshoz kattintson a „Következő lépés” gombra

9. Amikor a rendszer kéri az „SMTP-kiszolgáló” megadását, írja be az <code>smtp.forwardemail.net</code> címet, és hagyja a portot <code>587-en</code>.

10. Amikor a rendszer kéri a „Felhasználónév” megadását, adja meg a <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Fiókom <i class="fa fa-angle-right"></i> Domainek</a> <i class="fa fa-angle-right"></i> Aliasok (pl. <code><hello@example.com></code>) alatt létrehozott alias teljes e-mail címét.

11. Amikor a rendszer kéri a „Jelszó” megadását, illessze be a fenti 3. lépésben található <strong class="text-success"><i class="fa fa-key"></i>Jelszó generálása</strong> részből származó jelszót.

12. Hagyja bejelölve a „Biztonságos kapcsolat TLS használatával” választógombot.

13. A folytatáshoz kattintson a „Fiók hozzáadása” gombra

14. Nyisson meg egy új lapot a [Gmail](https://gmail.com) címen, és várja meg az ellenőrző e-mail megérkezését (kapni fog egy ellenőrző kódot, amely megerősíti, hogy Ön a „Küldés más néven” címmel elküldeni kívánt e-mail cím tulajdonosa).

15. Miután megérkezett, másolja ki és illessze be az ellenőrző kódot az előző lépésben kapott ablakba.

16. Miután ezt megtette, térjen vissza az e-mailhez, és kattintson a „kérés megerősítése” linkre. Valószínűleg ezt és az előző lépést is végre kell hajtania ahhoz, hogy az e-mail megfelelően konfigurálódjon.

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Gratulálunk!
</strong>
<span>
Sikeresen elvégezte az összes lépést.
</span>
</div>
</div>

</div>

### Mi a korábbi ingyenes útmutató a Gmailben küldött levelek más néven funkcióhoz? {#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail}

<div class="alert my-3 alert-danger"><i class="fa fa-stop-circle font-weight-bold"></i> <strong class="font-weight-bold">Fontos:</strong> Ez a korábbi ingyenes útmutató 2023 májusától elavult, mivel a <a class="alert-link" href="/faq#do-you-support-sending-email-with-smtp">we mostantól támogatja a kimenő SMTP-t</a>. Ha az alábbi útmutatót használja, akkor <a class="alert-link" href="/faq#can-i-remove-the-via-forwardemail-dot-net-in-gmail">this hatására a kimenő e-mailje</a> a következőképpen fog megjelenni a Gmailben: „<span class="notranslate text-danger font-weight-bold">via forwardemail dot net</span>”.</a></div>

<div class="alert mb-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Becsült beállítási idő:</strong>
<span>Kevesebb, mint 10 perc</span>
</div>

<div class="alert mb-3 alert-success">
<i class="fa fa-bullhorn font-weight-bold"></i>
<strong class="font-weight-bold">
Első lépések:
</strong>
<span>
Ha követte a fenti <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">Hogyan kezdhetem el és állíthatom be az e-mail-továbbítást</a> részben található utasításokat, akkor folytathatja az olvasást alább.
</span>
</div>

<div class="mx-auto lazyframe lazyframe-bordered border border-themed mb-3" data-vendor="youtube_nocookie" title="Hogyan küldjünk e-mailt más néven Gmaillel" data-src="https://www.youtube-nocookie.com/embed/MEheS8gM4Xs?autoplay=0"></div>

<div id="hagyománymentes-útmutató">

1. A működéshez engedélyezni kell a [Gmail kétfaktoros hitelesítését][gmail-2fa]. Ha nincs engedélyezve, látogassa meg a <https://www.google.com/landing/2step/> oldalt.

2. Miután engedélyezte a kétfaktoros hitelesítést (vagy ha már engedélyezte), látogasson el a <https://myaccount.google.com/apppasswords>. oldalra.

3. Amikor a rendszer kéri, hogy „Válassza ki az alkalmazást és az eszközt, amelyhez létre szeretné hozni az alkalmazás jelszavát”:
* Válassza a „Levelezés” lehetőséget az „Alkalmazás kiválasztása” legördülő menüben.
* Válassza az „Egyéb” lehetőséget az „Eszköz kiválasztása” legördülő menüben.
* Amikor a rendszer szövegbevitelt kér, adja meg az egyéni domain e-mail címét, amelyről átirányítja az e-maileket (pl. <kód><hello@example.com></kód> - ez segít nyomon követni, ha több fiókhoz is használja ezt a szolgáltatást).

4. Másolja a jelszót a vágólapra, amelyet a rendszer automatikusan generál.
<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Fontos:
</strong>
<span>
Ha G Suite csomagot használ, látogasson el az adminisztrációs felületre <a class="alert-link" href="https://admin.google.com/AdminHome#ServiceSettings/service=email&subtab=filters" rel="noopener noreferrer" target="_blank">Alkalmazások <i class="fa fa-angle-right"></i> G Suite <i class="fa fa-angle-right"></i> Gmail beállítások <i class="fa fa-angle-right"></i> Beállítások</a>, és jelölje be a „Felhasználók küldhetnek leveleket külső SMTP-kiszolgálón keresztül...” jelölőnégyzetet. A módosítás aktiválása némi késéssel járhat, ezért kérjük, várjon néhány percet.
</span>
</div>

5. Lépjen a [Gmail](https://gmail.com) oldalra, és a [Beállítások <i class="fa fa-angle-right"></i> Fiókok és importálás <i class="fa fa-angle-right"></i> E-mail küldése másként](https://mail.google.com/mail/u/0/#settings/accounts) alatt kattintson az „Újabb e-mail cím hozzáadása” lehetőségre.

6. Amikor a rendszer a „Név” megadását kéri, adja meg azt a nevet, amelyikkel az e-mail címét a „Feladó” mezőben látni szeretné (pl. „Linus Torvalds”).

7. Amikor a rendszer kéri az „E-mail cím” megadását, adja meg az e-mail címet a fent használt egyéni tartománnyal (pl. <kód><hello@example.com></kód>)

8. Töröld a jelölést az „Álnévként való kezelés” jelölőnégyzetből.

9. A folytatáshoz kattintson a „Következő lépés” gombra

10. Amikor a rendszer az „SMTP-kiszolgáló” megadását kéri, írja be az <code>smtp.gmail.com</code> címet, és hagyja a portot <code>587</code>-on.

11. Amikor a rendszer kéri a „Felhasználónév” megadását, adja meg Gmail-címének a <span>gmail.com</span> rész nélküli részét (pl. csak „felhasználó”, ha az e-mail címem <span><user@gmail.com></span>)
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Fontos:
</strong>
<span>
Ha a „Felhasználónév” rész automatikusan kitöltődik, akkor <u><strong>ezt kell módosítania</strong></u> Gmail-címe felhasználónév részére.
</span>
</div>

12. Amikor a rendszer a „Jelszó” megadását kéri, illessze be a vágólapról a fenti 2. lépésben létrehozott jelszót.

13. Hagyja bejelölve a „Biztonságos kapcsolat TLS használatával” választógombot.

14. A folytatáshoz kattintson a „Fiók hozzáadása” gombra

15. Nyisson meg egy új lapot a [Gmail](https://gmail.com) címen, és várja meg az ellenőrző e-mail megérkezését (kapni fog egy ellenőrző kódot, amely megerősíti, hogy Ön a „Küldés más néven” címmel elküldeni kívánt e-mail cím tulajdonosa).

16. Miután megérkezett, másolja ki és illessze be az ellenőrző kódot az előző lépésben kapott ablakba.

17. Miután ezt megtette, térjen vissza az e-mailhez, és kattintson a „kérés megerősítése” linkre. Valószínűleg ezt és az előző lépést is végre kell hajtania ahhoz, hogy az e-mail megfelelően konfigurálódjon.

</div>

### Speciális Gmail-útválasztási konfiguráció {#advanced-gmail-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Becsült beállítási idő:</strong>
<span>15-30 perc</span>
</div>

Ha speciális átirányítást szeretne beállítani a Gmailben, hogy a postaládához nem tartozó aliasok is továbbítsák az e-maileket a Forward Email levelezőcsoportjaiba, kövesse az alábbi lépéseket:

1. Jelentkezzen be a Google Felügyeleti konzolba a [admin.google.com](https://admin.google.com) címen.
2. Lépjen az **Alkalmazások → Google Workspace → Gmail → Útvonaltervezés** menüpontra.
3. Kattintson az **Útvonal hozzáadása** gombra, és konfigurálja a következő beállításokat:

**Egyetlen címzett beállításai:**

* Válassza a „Boríték címzettjének módosítása” lehetőséget, és adja meg elsődleges Gmail-címét.
* Jelölje be az „X-Gm-Original-To fejléc hozzáadása az eredeti címzetthez” lehetőséget.

**Boríték címzett minták:**

* Adjon hozzá egy mintát, amely illeszkedik az összes nem létező postaládához (pl. `.*@yourdomain.com`)

**E-mail szerver beállításai:**

* Válassza a „Route to host” (Útvonal a gazdagéphez) lehetőséget, és adja meg a `mx1.forwardemail.net` szervert elsődleges szerverként.
* Adja hozzá a `mx2.forwardemail.net` szervert tartalék szerverként.
* Állítsa a portot 25-re.
* Biztonsági okokból válassza a „TLS szükséges” lehetőséget.

4. Az útvonal létrehozásához kattintson a **Mentés** gombra.

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Fontos:
</strong>
<span>
Ez a konfiguráció csak egyéni domainnel rendelkező Google Workspace-fiókokkal működik, normál Gmail-fiókokkal nem.
</span>
</div>

### Speciális Outlook útválasztási konfiguráció {#advanced-outlook-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Becsült beállítási idő:</strong>
<span>15-30 perc</span>
</div>

Azoknak a Microsoft 365 (korábban Office 365) felhasználóknak, akik speciális átirányítást szeretnének beállítani, hogy a postaládának nem megfelelő aliasok továbbítsák az e-maileket a Forward Email levelezőcsoportjaiba:

1. Jelentkezzen be a Microsoft 365 felügyeleti központba a [admin.microsoft.com](https://admin.microsoft.com) címen.
2. Lépjen az **Exchange → Levelezési folyamat → Szabályok** menüpontra.
3. Kattintson a **Szabály hozzáadása** gombra, és válassza az **Új szabály létrehozása** lehetőséget.
4. Nevezze el a szabályt (pl. "Nem létező postaládák továbbítása a következő címre):
5. A **Szabály alkalmazása, ha** alatt válassza a következőt:
* "A címzett címe egyezik..."
* Adjon meg egy olyan mintát, amely megegyezik a domain összes címével (pl. `*@yourdomain.com`).
6. A **Tegye a következőket** alatt válassza a következőt:
* "Átirányítsa az üzenetet ide..."
* Válassza a "A következő levelezőkiszolgáló" lehetőséget.
* Adja meg a `mx1.forwardemail.net` címet és a 25-ös portot.
* Adja hozzá a `mx2.forwardemail.net` címet tartalékkiszolgálóként.
7. A **Kivéve, ha** alatt válassza a következőt:
* "A címzett..."
* Adja hozzá az összes meglévő postaládáját, amelyet nem kell továbbítani.
8. Állítsa be a szabály prioritását úgy, hogy az a többi levelezési folyamat szabálya után fusson.
9. Az aktiváláshoz kattintson a **Mentés** gombra. a szabály

## Hibaelhárítás {#troubleshooting}

### Miért nem kapom meg a teszt e-mailjeimet? {#why-am-i-not-receiving-my-test-emails}

Ha teszt e-mailt küldesz magadnak, akkor előfordulhat, hogy az nem jelenik meg a beérkező levelek mappádban, mert ugyanaz a „Message-ID” fejléc van benne.

Ez egy széles körben ismert probléma, és olyan szolgáltatásokat is érint, mint a Gmail. <a href="https://support.google.com/a/answer/1703601">Here a hivatalos Gmail válasz erre a problémára</a>.

Ha továbbra is problémákat tapasztal, akkor valószínűleg a DNS-terjesztéssel van a probléma. Várnia kell még egy kicsit, és újra kell próbálkoznia (vagy meg kell próbálnia alacsonyabb TTL-értéket beállítani a TXT rekordokban).

**Továbbra is problémákat tapasztal?** Kérjük, <a href="/help">lépjen kapcsolatba velünk</a>, hogy kivizsgálhassuk a problémát és gyors megoldást találhassunk.

### Hogyan konfigurálhatom az e-mail kliensemet az e-mail továbbításával való együttműködéshez? {#how-do-i-configure-my-email-client-to-work-with-forward-email}

<div class="mb-3">
Szolgáltatásunk olyan népszerű e-mail kliensekkel működik, mint:
<ul class="ml-1 h4 d-inline list-inline mb-0 pl-0">
<li class="list-inline-item"><a href="/blog/open-source/apple-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Apple&reg;</a></li>
<li class="list-inline-item"><a href="/blog/open-source/windows-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Windows&reg;</a></li>
<li class="list-inline-item"><a href="/blog/open-source/android-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-android"></i> Android&trade;</a></li>
<li class="list-inline-item"><a href="/blog/open-source/linux-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-linux"></i> Linux&reg;</a></li>
<li class="list-inline-item"><a href="/blog/open-source/desktop-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fas fa-desktop"></i> Asztali</a></li>
<li class="list-inline-item"><a href="/blog/open-source/mozilla-firefox-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-firefox-browser"></i> Mozilla Firefox</a></li>
<li class="list-inline-item"><a href="/blog/open-source/safari-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Safari</a></li>
<li class="list-inline-item"><a href="/blog/open-source/google-chrome-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-chrome"></i> Google Chrome</a></li>
<li class="list-inline-item"><a href="/blog/open-source/terminal-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fas fa-terminal"></i> Terminál</a></li>
</ul>
</div>

<div class="alert alert-primary">
A felhasználóneved az aliasod e-mail címe, a jelszavad pedig a <strong class="text-success"><i class="fa fa-key"></i>Jelszó generálása</strong> ("Normál jelszó") oldalról származik.
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tipp:
</strong>
<span>Thunderbird használata esetén győződjön meg arról, hogy a „Kapcsolat biztonsága” beállítás „SSL/TLS”, a hitelesítési módszer pedig „Normál jelszó” értékre van állítva.</span>
</div>

| Típus | Gazdagépnév | Jegyzőkönyv | kikötők |
| :--: | :---------------------: | :-------------------------------------: | :----------------------------------------------------------------------------------: |
| IMAP | `imap.forwardemail.net` | SSL/TLS **Előnyben részesített** | `993` és `2993` |
| SMTP | `smtp.forwardemail.net` | SSL/TLS **Előnyben részesített** vagy TLS (STARTTLS) | `465` és `2465` SSL/TLS esetén (vagy) `587`, `2587`, `2525` és `25` TLS esetén (STARTTLS) |

### Miért kerülnek az e-mailjeim a Spam és a Levélszemét mappába, és hogyan ellenőrizhetem a domainem hírnevét? {#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation}

Ez a szakasz útmutatást nyújt abban az esetben, ha a kimenő levelei az SMTP-szervereinket használják (pl. `smtp.forwardemail.net`) (vagy a `mx1.forwardemail.net` vagy `mx2.forwardemail.net` szerveren keresztül továbbítódnak), és a címzettek Spam vagy Levélszemét mappájába kerülnek kézbesítésre.

Rutinszerűen figyeljük a [IP-címek](#what-are-your-servers-ip-addresses)-nkat a [minden jó hírű DNS-tiltási lista](#how-do-you-handle-your-ip-addresses-becoming-blocked)-gyel szemben, **ezért valószínűleg egy domainre jellemző hírnévvel kapcsolatos problémáról van szó**.

Az e-mailek több okból is a spam mappába kerülhetnek:

1. **Hiányzó hitelesítés**: Állítsa be a [SPF](#how-do-i-set-up-spf-for-forward-email), [DKIM](#how-do-i-set-up-dkim-for-forward-email) és [DMARC](#how-do-i-set-up-dmarc-for-forward-email) rekordokat.

2. **Domain hírneve**: Az új domainek gyakran semleges hírnévvel rendelkeznek, amíg nem hoznak létre küldési előzményeket.

3. **Tartalomra utaló események**: Bizonyos szavak vagy kifejezések aktiválhatják a spamszűrőket.

4. **Küldési minták**: Az e-mailek mennyiségének hirtelen növekedése gyanúsnak tűnhet.

A következő eszközök közül egyet vagy többet is kipróbálhat domainje hírnevének és kategorizálásának ellenőrzésére:

| Eszköz neve | URL | Típus |
| ------------------------------------------- | ---------------------------------------------------------------- | ---------------------- |
| Cloudflare Domain Kategorizálás Visszajelzés | <https://radar.cloudflare.com/domains/feedback> | Kategorizálás |
| Spamhaus IP és domain hírnév-ellenőrző | <https://check.spamhaus.org/> | DNSBL |
| Cisco Talos IP és Domain Reputációs Központ | <https://talosintelligence.com/reputation_center> | Hírnév |
| Barracuda IP és domain hírnév keresése | <https://www.barracudacentral.org/lookups/lookup-reputation> | DNSBL |
| MX Toolbox feketelista ellenőrzése | <https://mxtoolbox.com/blacklists.aspx> | Feketelista |
| Google Postmaster Eszközök | <https://www.gmail.com/postmaster/> | Hírnév |
| Yahoo küldőközpont | <https://senders.yahooinc.com/> | Hírnév |
| MultiRBL.valli.org feketelista ellenőrzés | <https://multirbl.valli.org/lookup/> | DNSBL |
| Feladó pontszáma | <https://senderscore.org/act/blocklist-remover/> | Hírnév |
| Értékelés csökkenése | <https://www.invaluation.com/lookup/> | DNSBL |
| SURBL | <https://www.surbl.org/> | DNSBL |
| Apple/Proofpoint IP cím eltávolítása | <https://ipcheck.proofpoint.com/> | Eltávolítás |
| Cloudmark IP cím eltávolítása | <https://csi.cloudmark.com/en/reset/> | Eltávolítás |
| SpamCop | <https://www.spamcop.net/bl.shtml> | DNSBL |
| Microsoft Outlook és Office 365 IP-cím eltávolítása | <https://sendersupport.olc.protection.outlook.com/pm/Postmaster> | Eltávolítás |
| Az UCEPROTECT 1., 2. és 3. szintjei | <https://www.uceprotect.net/en/rblcheck.php> | DNSBL |
| UCEPROTECT backscatterer.org oldala | <https://www.backscatterer.org/> | Visszaszórás elleni védelem |
| Az UCEPROTECT whitelisted.org oldala | <https://www.whitelisted.org/> (díjköteles) | DNSWL |
| AT&T | `abuse_rbl@abuse-att.net` | Eltávolítás |
| AOL/Verizon (pl. `[IPTS04]`) | <https://senders.yahooinc.com/> | Eltávolítás |
| Cox Communications | `unblock.request@cox.net` | Eltávolítás |
| t-online.de (német/T-Mobile) | `tobr@rx.t-online.de` | Eltávolítás |

> \[!TIP]
> Kezdje kis mennyiségű, de kiváló minőségű e-mail küldésével, hogy pozitív hírnevet építsen ki, mielőtt nagyobb mennyiségben küldene e-mailt.

> \[!IMPORTANT]
> Ha a domainje feketelistán van, minden feketelistának megvan a saját eltávolítási folyamata. További utasításokért tekintse meg a feketelistára feltöltött weboldalaikat.

> \[!TIP]
> Ha további segítségre van szüksége, vagy ha egy adott e-mail szolgáltató tévesen spamként jelölt meg minket, kérjük, <a href="/help">lépjen kapcsolatba velünk</a>.

### Mit tegyek, ha spam e-maileket kapok? {#what-should-i-do-if-i-receive-spam-emails}

Le kell iratkoznod a levelezőlistáról (ha lehetséges), és blokkolnod kell a feladót.

Kérjük, ne jelentse az üzenetet spamként, hanem továbbítsa manuálisan összeállított és adatvédelmi szempontokat figyelembe vevő visszaélés-megelőző rendszerünknek.

**A spam továbbításához használandó e-mail cím:** <abuse@forwardemail.net>

### Miért jelennek meg a Gmailben küldött teszt e-mailjeim "gyanúsként"? {#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious}

Ha ezt a hibaüzenetet látod a Gmailben, amikor tesztüzenetet küldesz magadnak, vagy amikor egy olyan személy, akinek az aliasoddal kommunikálsz, először látja a tőled érkező e-mailt, akkor **ne aggódj** – ez a Gmail beépített biztonsági funkciója.

Egyszerűen rákattinthatsz a „Biztonságosnak tűnik” gombra. Például, ha egy tesztüzenetet küldenél a „Küldés másként” funkcióval (valaki másnak), akkor az illető nem fogja látni ezt az üzenetet.

Ha azonban látják ezt az üzenetet, az azért van, mert általában megszokták, hogy az e-mailek a <john@gmail.com> címről érkeznek a <john@customdomain.com> helyett (csak egy példa). A Gmail értesíti a felhasználókat, hogy megbizonyosodjon a dolgok biztonságáról, nincs megkerülő megoldás.

### Eltávolíthatom a via forwardemail dot net feliratot a Gmailben? {#can-i-remove-the-via-forwardemail-dot-net-in-gmail}

Ez a téma egy [A Gmailben széles körben ismert probléma, ahol a feladó neve mellett extra információk jelennek meg.](https://support.google.com/mail/answer/1311182) elemhez kapcsolódik.

2023 májusától minden fizetős felhasználó számára támogatjuk az SMTP-vel történő e-mail küldést kiegészítőként – ami azt jelenti, hogy eltávolíthatja a <span class="notranslate">via forwardemail dot net</span> funkciót a Gmailben.

Vegye figyelembe, hogy ez a GYIK téma kifejezetten a [Hogyan küldjünk levelet Gmail-ben más néven?](#how-to-send-mail-as-using-gmail) funkciót használóknak szól.

A konfigurációs utasításokat lásd a [Támogatják az SMTP-n keresztüli e-mail küldést?](#do-you-support-sending-email-with-smtp) című részben.

## Adatkezelés {#data-management}

### Hol találhatók a szerverei? {#where-are-your-servers-located}

> \[!TIP]
> Hamarosan bejelenthetjük a [forwardemail.eu](https://forwardemail.eu) alatt üzemeltetett EU-s adatközpontunk helyszínét. Iratkozzon fel a <https://github.com/orgs/forwardemail/discussions/336> oldalon található beszélgetésre a frissítésekért.

Szervereink elsősorban Denverben, Coloradóban találhatók – az IP-címek teljes listáját lásd: <https://forwardemail.net/ips>

Alfeldolgozóinkról a [GDPR](/gdpr), [DPA](/dpa) és [Magánélet](/privacy) oldalainkon tájékozódhat.

### Hogyan exportálhatom és készíthetek biztonsági másolatot a postaládámról? {#how-do-i-export-and-backup-my-mailbox}

Postaládáit bármikor exportálhatja [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions), [Mbox](https://en.wikipedia.org/wiki/Mbox) vagy titkosított [SQLite](https://en.wikipedia.org/wiki/SQLite) formátumban.

Lépjen a <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Fiókom <i class="fa fa-angle-right"></i> Domainek</a> <i class="fa fa-angle-right"></i> Aliasok <i class="fa fa-angle-right"></i> Biztonsági mentés letöltése menüpontra, és válassza ki a kívánt exportálási formátumot.

Amint elkészült az exportálás, e-mailben küldünk egy linket a letöltéshez.

Vegye figyelembe, hogy biztonsági okokból ez az exportálási letöltési link 4 óra elteltével lejár.

Ha meg kell vizsgálnia az exportált EML vagy Mbox formátumokat, akkor ezek a nyílt forráskódú eszközök hasznosak lehetnek:

| Név | Formátum | Platform | GitHub URL |
| --------------- | :----: | ------------- | --------------------------------------------------- |
| MBox-megjelenítő | Mbox | Ablakok | <https://github.com/eneam/mboxviewer> |
| mbox-web-viewer | Mbox | Minden platform | <https://github.com/PHMRanger/mbox-web-viewer> |
| EmlReader | EML | Ablakok | <https://github.com/ayamadori/EmlReader> |
| E-mail-megjelenítő | EML | VSCode | <https://github.com/joelharkes/vscode_email_viewer> |
| eml-olvasó | EML | Minden platform | <https://github.com/s0ph1e/eml-reader> |

Továbbá, ha egy Mbox fájlt EML fájllá kell konvertálnia, akkor használhatja a <https://github.com/noelmartinon/mboxzilla>.

### Hogyan importálhatom és migrálhatom a meglévő postaládámat? {#how-do-i-import-and-migrate-my-existing-mailbox}

Az alábbi utasításokat követve könnyedén importálhatja e-mailjeit a Forward Email szolgáltatásba (például a [Thunderbird](https://www.thunderbird.net) használatával):

<div class="alert alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Fontos:
</strong>
<span>
A meglévő e-mailek importálásához kövesse az alábbi lépéseket.
</span>
</div>

1. Exportálja e-mailjeit meglévő e-mail-szolgáltatójától:

| E-mail szolgáltató | Exportálási formátum | Exportálási utasítások |
| -------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Gmail | MBOX | <https://takeout.google.com/settings/takeout/custom/gmail> |
| Kilátások | PST | <div class="alert my-3 alert-danger"><i class="fa fa-info-circle font-weight-bold"></i> <strong class="font-weight-bold">Tipp:</strong> <span>Ha Outlookot használ (<a href="https://support.microsoft.com/en-us/office/back-up-your-email-e5845b0b-1aeb-424f-924c-aa1c33b18833#:~:text=Select%20File%20%3E%20Open%20%26%20Export%20%3E,back%20up%20and%20select%20Next." class="alert-link">PST exportálási formátum</a>), akkor egyszerűen kövesse az alábbi „Egyéb” részben található utasításokat. Az alábbiakban azonban linkeket adtunk meg a PST MBOX/EML formátumba konvertálásához az operációs rendszered alapján:<ul class="mb-0 mt-3"><li><a class="alert-link" href="https://github.com/BaselineIT/Zinkuba/releases/download/release-1.2/Zinkuba.App.exe">Zinkuba Windows rendszerhez</a> (<a class="alert-link" href="https://github.com/BaselineIT/Zinkuba?tab=readme-ov-file#zinkuba">GitHub</a>)</li><li><a class="alert-link" href="https://cygwin.com/packages/summary/readpst.html">readpst Windows cygwin rendszerhez</a> – (pl. <code>readpst -u -o $OUT_DIR $IN_DIR</code> a <code>$OUT_DIR</code> és a <code>$IN_DIR</code> helyére a kimeneti könyvtárat kell írni, és bemeneti könyvtár elérési útjai rendre).</li><li><a class="alert-link" href="https://manpages.ubuntu.com/manpages/trusty/man1/readpst.1.html">readpst Ubuntu/Linux rendszerhez</a> – (pl. <code>sudo apt-get install readpst</code>, majd <code>readpst -u -o $OUT_DIR $IN_DIR</code>, a <code>$OUT_DIR</code> és <code>$IN_DIR</code> helyére a kimeneti és a bemeneti könyvtár elérési útjait cserélve).</li><li><a class="alert-link" href="https://formulae.brew.sh/formula/libpst">readpst macOS rendszerhez (brew-n keresztül)</a> – (pl. <code>brew install libpst</code>, majd <code>readpst -u -o $OUT_DIR $IN_DIR</code>, a <code>$OUT_DIR</code> helyére cserélve és <code>$IN_DIR</code> a kimeneti és bemeneti könyvtár elérési útjával).</li><li><a class="alert-link" href="https://github.com/juanirm/pst-converter/tree/master?tab=readme-ov-file#pst-converter">PST konverter Windowshoz (GitHub)</a></li></ul><br /></span></div> |
| Apple Mail | MBOX | <https://support.apple.com/guide/mail/import-or-export-mailboxes-mlhlp1030/mac#apd37a3190755974> |
| Gyorsposta | EML | <https://www.fastmail.help/hc/en-us/articles/360060590573-Download-all-your-data#downloadmail> |
| Proton Mail | MBOX/EML | <https://proton.me/support/export-emails-import-export-app> |
| Tutanota | EML | <https://github.com/crepererum-oss/tatutanatata> |
| Gondol | EML | <https://docs.gandi.net/en/gandimail/common_operations/backup_email.html#contents> |
| Zoho | EML | <https://www.zoho.com/mail/help/import-export-emails.html#alink2> |
| Más | [Use Thunderbird](https://www.thunderbird.net) | Állítsd be a meglévő e-mail fiókodat a Thunderbirdben, majd használd a [ImportExportTools NG](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/) bővítményt az e-mailek exportálásához és importálásához. **Egyszerűen másolhatod/beillesztheted vagy áthúzhatod az e-maileket egyik fiókból a másikba.** |

2. Töltse le, telepítse és nyissa meg a [Thunderbird](https://www.thunderbird.net) fájlt.

3. Hozz létre egy új fiókot az aliasod teljes e-mail címével (pl. <code><you@yourdomain.com></code>) és a létrehozott jelszavaddal. <strong>Ha még nincs generált jelszavad, akkor <a href="/faq#do-you-support-receiving-email-with-imap" target="_blank">tekintsd meg a beállítási utasításainkat</a></strong>.

4. Töltse le és telepítse a [ImportExportEszközök OF](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/) Thunderbird bővítményt.

5. Hozz létre egy új helyi mappát a Thunderbirdben, majd kattints rá jobb gombbal → válaszd a `ImportExportTools NG` lehetőséget → válaszd a `Import mbox file` lehetőséget (MBOX exportformátumhoz) – vagy – `Import messages` / `Import all messages from a directory` lehetőséget (EML exportformátumhoz).

6. Húzd át az üzeneteket a helyi mappából egy új (vagy meglévő) IMAP-mappába a Thunderbirdben, amelybe feltölteni szeretnéd az üzeneteket az IMAP-tárhelyünkön keresztül. Ez biztosítja, hogy azok online biztonsági mentésre kerüljenek az SQLite titkosított tárhelyünkön.

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tipp:
</strong>
<span>
Ha nem tudod, hogyan importálj a Thunderbirdbe, akkor tekintsd meg a hivatalos utasításokat a <a class="alert-link" href="https://kb.mozillazine.org/Importing_folders">https://kb.mozillazine.org/Importing_folders</a> és a <a class="alert-link" href="https://github.com/thunderbird/import-export-tools-ng/wiki">https://github.com/thunderbird/import-export-tools-ng/wiki</a>."
</span> címeken.
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Fontos:
</strong>
<span>
Miután befejezte az exportálási és importálási folyamatot, érdemes lehet engedélyezni az átirányítást a meglévő e-mail fiókjában, és beállítani egy automatikus válaszadót, amely értesíti a feladókat az új e-mail címéről (pl. ha korábban Gmailt használt, és most egy egyéni domainnévvel rendelkező e-mailt használ).
</span>
</div>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Gratulálunk!
</strong>
<span>
Sikeresen elvégezte az összes lépést.
</span>
</div>
</div>

### Támogatja a saját tárhelyszolgáltatást? {#do-you-support-self-hosting}

Igen, 2025 márciusától támogatjuk az önállóan üzemeltetett megoldást. Olvasd el a [itt](https://forwardemail.net/blog/docs/self-hosted-solution) blogbejegyzést. Nézd meg a [saját üzemeltetésű idegenvezető](https://forwardemail.net/self-hosted)-et a kezdéshez. Azok számára pedig, akiket érdekel egy részletesebb, lépésről lépésre bemutatott verzió, tekintsd meg a [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) vagy [Debian](https://forwardemail.net/guides/selfhosted-on-debian) alapú útmutatóinkat.

## E-mail konfiguráció {#email-configuration}

### Hogyan kezdjem el és állítsam be az e-mail-továbbítást? {#how-do-i-get-started-and-set-up-email-forwarding}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Becsült beállítási idő:</strong>
<span>Kevesebb, mint 10 perc</span>
</div>

<div class="alert my-3 alert-success">
<i class="fa fa-bullhorn font-weight-bold"></i>
<strong class="font-weight-bold">
Első lépések:
</strong>
<span>
Figyelmesen olvassa el és kövesse az alábbi 1–8. lépéseket. Ügyeljen arra, hogy a <code>user@gmail.com</code> e-mail címet azzal az e-mail címmel cserélje ki, amelyre az e-maileket továbbítani szeretné (ha az még nem pontos). Hasonlóképpen ügyeljen arra, hogy az <code>example.com</code> részt az egyéni domain nevével cserélje ki (ha az még nem pontos).
</span>
</div>

<ol>
<li class="mb-2 mb-md-3 mb-lg-5">Ha már regisztráltad a domainneved valahol, akkor ezt a lépést teljesen ki kell hagynod, és a második lépésre kell ugranod! Ellenkező esetben <a href="/domain-registration" rel="noopener noreferrer">kattints ide a domainneved regisztrálásához</a>.</li>
<li class="mb-2 mb-md-3 mb-lg-5">
Emlékszel, hol regisztráltad a domainneved? Ha erre emlékszel, kövesd az alábbi utasításokat:

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Fontos:
</strong>
<span>
Új lapot kell nyitnia, és be kell jelentkeznie a domainregisztrátorához. Az alábbi „Regisztráló” gombra kattintva ezt automatikusan megteheti. Ezen az új lapon a regisztrátor DNS-kezelési oldalára kell navigálnia – a lépésenkénti navigációs lépéseket pedig alább, a „Konfigurálás lépései” oszlopban találja. Miután az új lapon erre az oldalra navigált, visszatérhet erre a lapra, és folytathatja a harmadik lépéssel.
<strong class="font-weight-bold">Ne zárja be még a megnyitott lapot; a későbbi lépésekhez szüksége lesz rá!</strong>
</span>
</div>

<table id="table-dns-management-by-registrar" class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Regisztrátor</th>
<th>Konfigurálás lépései</th>
</tr>
</thead>
<tbody>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://login.ionos.com/">1&amp;1</a></td>
<td>Bejelentkezés <i class="fa fa-angle-right"></i> Domain központ <i class="fa fa-angle-right"></i> (Válassza ki a domainjét) <i class="fa fa-angle-right"></i> DNS-beállítások szerkesztése</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon 53-as út</a></td>
<td>Bejelentkezés <i class="fa fa-angle-right"></i> Tárolt zónák <i class="fa fa-angle-right"></i> (Válassza ki a domainjét)</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>
<td>Bejelentkezés <i class="fa fa-angle-right"></i> Szervereim <i class="fa fa-angle-right"></i> Domainkezelés <i class="fa fa-angle-right"></i> DNS-kezelő</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.bluehost.com/help/article/dns-management-add-edit-or-delete-dns-entries">Bluehost</a></td>
<td>FOR ROCK: Bejelentkezés <i class="fa fa-angle-right"></i> Domainek <i class="fa fa-angle-right"></i> (Kattintson a mellette lévő ▼ ikonra a kezeléshez) <i class="fa" fa-angle-right"></i> DNS
<br /> RÉGI VERZIÓKHOZ: Bejelentkezés <i class="fa fa-angle-right"></i> Domainek <i class="fa fa-angle-right"></i> Zónaszerkesztő <i class="fa fa-angle-right"></i> (Válassza ki a domainjét)</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://dash.cloudflare.com/login">Cloudflare</a></td>"
<td>Bejelentkezés <i class="fa fa-angle-right"></i> DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://cp.dnsmadeeasy.com/">DNS Egyszerűen</a></td>
<td>Bejelentkezés <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> (Válassza ki a domainjét)</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://dnsimple.com/dashboard">DNSimple</a></td>
<td>Bejelentkezés <i class="fa fa-angle-right"></i> (Válassza ki a domainjét) <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> Kezelés</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://cloud.digitalocean.com/login">Digital Óceán</a></td>
<td>Bejelentkezés <i class="fa fa-angle-right"></i> Hálózatépítés <i class="fa fa-angle-right"></i> Domainek <i class="fa fa-angle-right"></i> (Válassza ki a domainjét) <i class="fa fa-angle-right"></i> Továbbiak <i class="fa fa-angle-right"></i> Domain kezelése</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.domain.com/help/article/dns-management-how-to-update-dns-records">Domain.com</a></td>
<td>Bejelentkezés <i class="fa fa-angle-right"></i> Kártyanézetben kattintson a domain kezelése lehetőségre <i class="fa fa-angle-right"></i> Listanézetben kattintson a fogaskerék ikonra <i class="fa fa-angle-right"></i> DNS és névszerverek <i class="fa fa-angle-right"></i> DNS-rekordok</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://www.domains.com/">Domains.com</a>"
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon0 class="fa fa-play-circle"></i> Figyelés</a>
</td>
<td>Bejelentkezés <i class="fa fa-angle-right"></i> (Válassza ki a domainjét) <i class="fa fa-angle-right"></i> Kezelés <i class="fa fa-angle-right"></i> (kattintson a fogaskerék ikonra) <i class="fa fa-angle-right"></i> Kattintson a DNS és névszerverek lehetőségre a bal oldali menüben</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon1
<td>Bejelentkezés <i class="fa fa-angle-right"></i> Panel <i class="fa fa-angle-right"></i> Domainek <i class="fa fa-angle-right"></i> Domainek kezelése <i class="fa fa-angle-right"></i> DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon2
<td>Bejelentkezés <i class="fa fa-angle-right"></i> Áttekintés <i class="fa fa-angle-right"></i> Kezelés <i class="fa fa-angle-right"></i> Egyszerű szerkesztő <i class="fa fa-angle-right"></i> Rekordok</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon3
<td>Bejelentkezés <i class="fa fa-angle-right"></i> (Válassza ki a domainjét) <i class="fa fa-angle-right"></i> Kezelés <i class="fa fa-angle-right"></i> Zóna szerkesztése</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon4
<br />
<a class="btn" btn-dark" rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon5 class="fa fa-play-circle"></i> Figyelés</a>
</td>
<td>Bejelentkezés <i class="fa fa-angle-right"></i> Saját domainek kezelése <i class="fa fa-angle-right"></i> (Válassza ki a domainjét) <i class="fa fa-angle-right"></i> DNS kezelése</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon6 Domainek</a>
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon7 class="fa fa-play-circle"></i> Figyelés</a>
</td>
<td>Bejelentkezés <i class="fa fa-angle-right"></i> (Válassza ki a domainjét) <i class="fa fa-angle-right"></i> DNS konfigurálása</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon8"
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon9 class="fa fa-play-circle"></i> Figyelés</a>
</td>
<td>Bejelentkezés <i class="fa fa-angle-right"></i> Domainlista <i class="fa fa-angle-right"></i> (Válassza ki a domainjét) <i class="fa fa-angle-right"></i> Kezelés <i class="fa fa-angle-right"></i> Speciális DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>0
<td>Bejelentkezés <i class="fa fa-angle-right"></i> (Válassza ki a domainjét) <i class="fa fa-angle-right"></i> Netlify DNS beállítása</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>1 Megoldások</a></td>
<td>Bejelentkezés <i class="fa fa-angle-right"></i> Fiókkezelő <i class="fa fa-angle-right"></i> Saját domainnevek <i class="fa fa-angle-right"></i> (Válassza ki a domainjét) <i class="fa fa-angle-right"></i> Kezelés <i class="fa fa-angle-right"></i> Domainpontok módosítása <i class="fa fa-angle-right"></i> Speciális DNS</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>2
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>3 class="fa fa-play-circle"></i> Figyelés</a>
</td>
<td>Bejelentkezés <i class="fa fa-angle-right"></i> Felügyelt domainek <i class="fa fa-angle-right"></i> (Válassza ki a domainjét) <i class="fa fa-angle-right"></i> DNS-beállítások</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>4
<td>Bejelentkezés <i class="fa fa-angle-right"></i> Főmenü <i class="fa fa-angle-right"></i> Beállítások <i class="fa fa-angle-right"></i> Domainek <i class="fa fa-angle-right"></i> (Válassza ki a domainjét) <i class="fa fa-angle-right"></i>
Speciális beállítások <i class="fa fa-angle-right"></i> Egyéni rekordok</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>5 Most</a></td>
<td>A "now" parancssori felület használata <i class="fa fa-angle-right"></i> <code>now dns add [domain] '@' MX [rekordérték] [prioritás]</code></td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>6"
<td>Bejelentkezés <i class="fa fa-angle-right"></i> Domainek oldal <i class="fa fa-angle-right"></i> (Válassza ki a domainjét) <i class="fa fa-angle-right"></i> DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>7"
<td>Bejelentkezés <i class="fa fa-angle-right"></i> Domainek oldal <i class="fa fa-angle-right"></i> (Kattintson a <i class="fa fa-ellipsis-h"></i> ikonra) <i class="fa fa-angle-right"></i> Válassza a DNS-rekordok kezelése lehetőséget</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>8"
<td>Bejelentkezés <i class="fa fa-angle-right"></i> Domainek <i class="fa fa-angle-right"></i> Saját domainek</td>
</tr>
<tr>
<td>Egyéb</td>
<td>
<div class="alert mb-0 alert-warning"><i class="fa fa-exclamation-circle font-weight-bold"></i> <strong class="font-weight-bold">Fontos:</strong> Nem találja a regisztrátor nevét itt? Egyszerűen keressen rá az interneten a "DNS-rekordok módosítása a $REGISTRAR oldalon" kifejezésre (a $REGISTRAR helyére írja be a regisztrátor nevét – pl. "DNS-rekordok módosítása a GoDaddy oldalon", ha GoDaddy-t használ).</div>
</td>
</tr>
</tbody>
</table>
</li>
<li class="mb-2 mb-md-3 mb-lg-5">A regisztrátor DNS-kezelési oldalán (a másik megnyitott lapon) állítsa be a következő "MX" rekordokat:

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Fontos:
</strong>
<span>
Vegye figyelembe, hogy NEM lehet más MX rekord beállítva. Mindkét alább látható rekordnak léteznie KELL. Győződjön meg arról, hogy nincsenek elgépelések; és hogy az mx1 és az mx2 is helyesen van leírva. Ha már léteztek MX rekordok, kérjük, törölje azokat teljesen.
A "TTL" értékének nem kell 3600-nak lennie, szükség esetén alacsonyabb vagy magasabb érték is lehet.
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Név/Gazdagép/Álnév</th>
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

</li><li class="mb-2 mb-md-3 mb-lg-5" id="dns-configuration-options">A regisztrátor DNS-kezelési oldalán (a másik megnyitott lapon) állítsa be a következő <strong class="notranslate">TXT</strong> rekord(oka)t:

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Fontos:
</strong>
<span>
Ha fizetős csomaggal rendelkezik, akkor ezt a lépést teljesen ki kell hagynia, és az ötödik lépéssel kell folytatnia! Ha nem fizetős csomaggal rendelkezik, akkor az átirányított címei nyilvánosan kereshetők lesznek – lépjen a <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Fiókom <i class="fa fa-angle-right"></i> Domainek</a> oldalra, és szükség esetén frissítse domainjét fizetős csomagra. Ha többet szeretne megtudni a fizetős csomagokról, tekintse meg az <a rel="noopener noreferrer" href="/private-business-email" class="alert-link">Árak</a> oldalunkat. Ellenkező esetben továbbra is választhat egy vagy több kombinációt az A-tól az F opcióig, amelyek alább felsoroltak. </span>
</div>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
A lehetőség:
</strong>
<span>
Ha a domainjéből érkező összes e-mailt (pl. "mind@example.com", "hello@example.com" stb.) egy adott "user@gmail.com" címre továbbítja:
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Név/Gép/Álnév</th>
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
A fenti értékeket az "Érték" oszlopban feltétlenül cserélje ki a saját e-mail címére. A "TTL" értéknek nem kell 3600-nak lennie, szükség esetén lehet alacsonyabb vagy magasabb érték is. Az alacsonyabb élettartam ("TTL") érték biztosítja, hogy a DNS-rekordokon végrehajtott jövőbeli módosítások gyorsabban terjedjenek az interneten – ezt úgy képzelje el, mint azt, hogy mennyi ideig lesznek gyorsítótárazva a memóriában (másodpercben). A <a href="https://en.wikipedia.org/wiki/Time_to_live#DNS_records" rel="noopener noreferrer" target="_blank" class="alert-link">TTL-ről a Wikipédián</a> olvashat bővebben.
</span>
</div>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
B. lehetőség:
</strong>
<span>
Ha csak egyetlen e-mail címet kell átirányítania (pl. <code>hello@example.com</code> a <code>user@gmail.com</code> címre; ez automatikusan átirányítja a "hello+test@example.com" címet is a "user+test@gmail.com" címre):
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Név/Gép/Álnév</th>
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
C. lehetőség:
</strong>
<span>
Ha több e-mailt továbbítasz, akkor vesszővel válaszd el őket:
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Név/Gép/Álnév</th>
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
D. lehetőség:
</strong>
<span>
Korlátlan számú továbbított e-mailt állíthat be – csak ügyeljen arra, hogy ne lépje túl a 255 karaktert egyetlen sorban, és minden sort a "forward-email=" kezdetűként kezdjen. Egy példa alább látható:
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Név/Gép/Álnév</th>
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
E. lehetőség:
</strong>
<span>
Megadhat egy domainnevet a <strong class="notranslate">TXT</strong> rekordjában is, hogy globális alias-továbbítást alkalmazzon (pl. a "user@example.com" a "user@example.net" címre lesz továbbítva):
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Név/Gazdagép/Álnév</th>
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
A webhookokat globális vagy egyéni aliasként is használhatod e-mailek továbbításához. Tekintsd meg a példát és a webhookokról szóló teljes részt <a href="#do-you-support-webhooks" class="alert-link">Támogatják a webhookokat?</a> címmel alább.
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Név/Gép/Álnév</th>
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
G lehetőség:
</strong>
<span>
Használhatsz reguláris kifejezéseket ("regex") is az aliasok egyeztetéséhez és a helyettesítések kezeléséhez, hogy e-maileket továbbíts. Tekintsd meg a példákat és a reguláris kifejezésekről szóló teljes szakaszt <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">Támogatott reguláris kifejezések vagy regexek</a> címmel alább.
</span>
</div>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Speciális reguláris kifejezésre van szüksége helyettesítéssel?</strong> Tekintse meg a példákat és a reguláris kifejezésekről szóló teljes szakaszt <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">Támogatott reguláris kifejezések vagy regexek</a> címmel alább.
</div>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Egyszerű példa:</strong> Ha azt szeretném, hogy a `linus@example.com` vagy `torvalds@example.com` címre érkező összes e-mail a `user@gmail.com` címre kerüljön át:
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Név/Gép/Álnév</th>
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
A gyűjtő-átirányítási szabályokat „áteresztő” szabályoknak is nevezhetjük.
Ez azt jelenti, hogy a gyűjtő-átirányítási szabály helyett azok a bejövő e-mailek lesznek használatban, amelyek legalább egy adott továbbítási szabálynak megfelelnek.

A specifikus szabályok közé tartoznak az e-mail címek és a reguláris kifejezések.
<br /><br />
Például:
<br />
<code>forward-email=hello:first@gmail.com,second@gmail.com</code>
<br />
A <code>hello@example.com</code> címre küldött e-mailek **nem** lesznek továbbítva a <code>second@gmail.com</code> címre (gyűjtő-átirányítás) ezzel a konfigurációval, hanem csak a <code>first@gmail.com</code> címre lesznek kézbesítve.
</span>
</div>

---

</li><li class="mb-2 mb-md-3 mb-lg-5">A regisztrátor DNS-kezelési oldalán (a másik megnyitott lapon) állítsa be a következő <strong class="notranslate">TXT</strong> rekordot is:

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Név/Gazdagép/Álnév</th>
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
Ha Gmailt (pl. E-mail küldése más néven) vagy G Suite-ot használ, akkor a fenti értékhez hozzá kell fűznie az <code>include:_spf.google.com</code> karakterláncot, például:
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
Ha már van egy hasonló sorod "v=spf1"-gyel, akkor hozzá kell fűznöd az <code>include:spf.forwardemail.net</code> részt közvetlenül a meglévő "include:host.com" rekordok elé és az "-all" elé ugyanabban a sorban, például:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
<br /><br />
Vegye figyelembe, hogy van különbség az "-all" és az "~all" között. A "-" azt jelzi, hogy az SPF-ellenőrzésnek SIKERTELENNEK kell lennie, ha nem egyezik, a "~" pedig azt jelzi, hogy az SPF-ellenőrzésnek SOFTFAIL-nek kell lennie. A domain-hamisítás megelőzése érdekében a "-all" megközelítés használatát javasoljuk. <br /><br />
Előfordulhat, hogy meg kell adnia annak a hosztnak az SPF-rekordját is, amelyről a leveleket küldi (pl. Outlook).
</span>
</div>

</li><li class="mb-2 mb-md-3 mb-lg-5">Ellenőrizze DNS-rekordjait a „Rekordok ellenőrzése” eszközünkkel, amely elérhető a <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Fiókom <i class="fa fa-angle-right"></i> Domainek</a> <i class="fa fa-angle-right"></i> Beállítás menüpontban.

</li><li class="mb-2 mb-md-3 mb-lg-5">Küldjön egy teszt e-mailt a működés megerősítéséhez. Vegye figyelembe, hogy a DNS-rekordok terjedése eltarthat egy ideig.

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tipp:
</strong>
<span>
</span>
Ha nem kap teszt e-maileket, vagy kap egy „Legyen óvatos ezzel az üzenettel” feliratú teszt e-mailt, akkor tekintse meg a <a href="#why-am-i-not-receiving-my-test-emails" class="alert-link">Miért nem kapom meg a teszt e-mailjeimet</a> és a <a href="#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious" class="alert-link">Miért jelennek meg a Gmailben nekem küldött teszt e-mailjeim „gyanúsként”</a> kérdésekre adott válaszokat.
</div>

</li><li class="mb-2 mb-md-3 mb-lg-5">Ha a Gmailből szeretnéd a „Küldés másként” funkciót használni, akkor <strong><a href="https://www.youtube.com/watch?v=MEheS8gM4Xs" target="_blank" rel="noopener noreferrer">nézd meg ezt a videót</a></strong>, vagy kövesd az alábbi <a href="#how-to-send-mail-as-using-gmail">How E-mail küldése másként Gmaillel</a> című rész lépéseit.

</li></ol>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Gratulálunk!
</strong>
<span>
Sikeresen elvégezte az összes lépést.
</span>
</div>
</div>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tipp:
</strong>
<span>
Az opcionális kiegészítők listája alább található. Fontos megjegyezni, hogy ezek a kiegészítők teljesen opcionálisak, és előfordulhat, hogy nem szükségesek. Legalább további információkat szerettünk volna nyújtani, ha szükséges.
</span>
</div>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Opcionális kiegészítő:
</strong>
<span>
Ha a <a class="alert-link" href="#how-to-send-mail-as-using-gmail">How Gmaillel küldött e-mailek más néven</a> funkciót használja, akkor érdemes lehet felvenni magát egy engedélyezőlistára. Lásd <a class="alert-link" href="https://support.google.com/a/answer/60752?hl=en" target="_blank" rel="noopener noreferrer">ezeket a Gmail által adott utasításokat</a> erről a témáról.
</span>
</div>

### Használhatok több MX-csereprogramot és szervert a speciális továbbításhoz? {#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding}

Igen, de **csak egy MX exchange-nek kell szerepelnie a DNS-rekordjaidban**.

Ne próbálja meg a „Prioritás” beállítást több MX-csere konfigurálására használni.

Ehelyett úgy kell konfigurálnia a meglévő MX exchange-jét, hogy az összes nem egyező aliashoz tartozó levelet továbbítsa a szolgáltatásunk exchange-jeire (`mx1.forwardemail.net` és/vagy `mx2.forwardemail.net`).

Ha a Google Workspace szolgáltatást használja, és az összes nem egyező aliast át szeretné továbbítani a szolgáltatásunknak, akkor tekintse meg a <https://support.google.com/a/answer/6297084>. részt.

Ha a Microsoft 365-öt (Outlook) használja, és az összes nem egyező aliast továbbítani szeretné a szolgáltatásunknak, akkor tekintse meg a <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/use-connectors-to-configure-mail-flow/set-up-connectors-to-route-mail> és a <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/manage-mail-flow-for-multiple-locations>. beállításokat.

### Hogyan állíthatok be egy vakációs válaszadót (automatikus válaszadót a távollét esetén)? {#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder}

Lépjen a <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Fiókom <i class="fa fa-angle-right"></i> Domainek</a> <i class="fa fa-angle-right"></i> Aliasok menüpontra, és hozza létre vagy szerkessze azt az aliast, amelyhez vakációs automatikus válaszüzenetet szeretne beállítani.

Lehetősége van beállítani a kezdési dátumot, a befejezési dátumot, a tárgyat és az üzenetet, és bármikor engedélyezni vagy letiltani ezeket:

* Jelenleg a sima szöveges tárgy és üzenet támogatott (a `striptags` csomagot belsőleg használjuk a HTML eltávolításához).
* A tárgy maximum 100 karakterből állhat.
* Az üzenet maximum 1000 karakterből állhat.
* A beállításhoz kimenő SMTP konfiguráció szükséges (pl. be kell állítania a DKIM, DMARC és a Return-Path DNS rekordokat).
* Lépjen a <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Fiókom <i class="fa fa-angle-right"></i> Domainek</a> <i class="fa fa-angle-right"></i> Beállítások <i class="fa fa-angle-right"></i> Kimenő SMTP konfiguráció menüpontra, és kövesse a beállítási utasításokat.
* A vakációs válaszadó nem engedélyezhető globális Vanity domainneveken (pl. a [eldobható címek](/disposable-addresses) nem támogatott).
* Az automatikus válaszadó nem engedélyezhető helyettesítő/gyűjtő karaktert (`*`) tartalmazó aliasok és reguláris kifejezések esetén.

A `postfix`-hoz hasonló levelezőrendszerekkel ellentétben (amelyek például a `sieve` vakáció szűrőbővítményt használják) a Forward Email automatikusan hozzáadja a DKIM aláírást, kiküszöböli a vakáció válaszok küldésekor felmerülő kapcsolódási problémákat (például a gyakori SSL/TLS kapcsolódási problémák és a régebbi, karbantartott szerverek miatt), sőt, az Open WKD és PGP titkosítást is támogatja a vakáció válaszokhoz.

<!--
* A visszaélések megelőzése érdekében minden elküldött vakációs válaszüzenet után 1 kimenő SMTP kreditet vonunk le.
* Minden fizetős fiók alapértelmezés szerint napi 300 kreditet tartalmaz. Ha nagyobb összegre van szüksége, kérjük, vegye fel velünk a kapcsolatot.
-->

1. [engedélyezőlistán](#do-you-have-an-allowlist) feladónként csak egyszer küldünk üzenetet 4 naponta (ami hasonló a Gmail viselkedéséhez).

* A Redis gyorsítótárunk a `alias_id` és `sender` ujjlenyomatát használja, ahol a `alias_id` a MongoDB alias azonosítója, a `sender` pedig vagy a feladó címe (ha engedélyezőlistán van), vagy a feladó címében található gyökértartomány (ha nincs engedélyezőlistán). Az egyszerűség kedvéért az ujjlenyomat lejárata a gyorsítótárban 4 napra van beállítva.

* Az a megközelítésünk, hogy a nem engedélyezett feladók esetében a feladó címében elemzett gyökérdomaint használjuk, megakadályozza, hogy viszonylag ismeretlen feladók (pl. rosszindulatú szereplők) elárasszák az automatikus válaszüzeneteket.

2. Csak akkor küldünk üzenetet, ha a MAIL FROM és/vagy a From nem üres, és nem tartalmaz (kis- és nagybetűket nem megkülönböztető) [postamester felhasználónév](#what-are-postmaster-addresses) értéket (a @ jel előtti részt az e-mailben).

3. Nem küldünk üzenetet, ha az eredeti üzenet a következő fejlécek bármelyikét tartalmazta (kis- és nagybetűk megkülönböztetése nélkül):

* A `auto-submitted` fejléce, amelynek értéke nem egyenlő a `no` értékével.
* A `x-auto-response-suppress` fejléce, amelynek értéke `dr`, `autoreply`, `auto-reply`, `auto_reply` vagy `all`
* A `list-id`, `list-subscribe`, `no`0, `no`1, `no`2, `no`3, `no`4, `no`5, `no`6 vagy `no`7 fejléce (értéktől függetlenül).
* A `no`8 fejléce, amelynek értéke `no`9, `x-auto-response-suppress`0, `x-auto-response-suppress`1, `x-auto-response-suppress`2 vagy `x-auto-response-suppress`3.

4. Nem küldünk üzenetet, ha a MAIL FROM vagy a From e-mail címe `+donotreply`, `-donotreply`, `+noreply` vagy `-noreply` végződésű.

5. Nem küldünk üzenetet, ha a Feladó e-mail címe felhasználónév része `mdaemon` volt, és a kis- és nagybetűket megkülönböztető fejléc `X-MDDSN-Message` volt.

6. Nem küldünk ``multipart/report`` fejlécet, amely kis- és nagybetűket nem megkülönböztető `content-type`.

### Hogyan állíthatom be az SPF-et az e-mailek továbbításához? {#how-do-i-set-up-spf-for-forward-email}

A regisztrátor DNS-kezelési oldalán állítsa be a következő <strong class="notranslate">TXT</strong> rekordot:

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Név/Gazdagép/Álnév</th>
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
Ha Gmailt (pl. E-mail küldése más néven) vagy G Suite-ot használ, akkor a fenti értékhez hozzá kell fűznie az <code>include:_spf.google.com</code> karakterláncot, például:
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
Ha Microsoft Outlookot vagy Live.com-ot használ, akkor hozzá kell fűznie az <code>include:spf.protection.outlook.com</code> címet az SPF <strong class="notranslate">TXT</strong> rekordjához, például:
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
Ha már van egy hasonló sorod "v=spf1"-gyel, akkor hozzá kell fűznöd az <code>include:spf.forwardemail.net</code> részt közvetlenül a meglévő "include:host.com" rekordok elé és az "-all" elé ugyanabban a sorban, például:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
<br /><br />
Vegye figyelembe, hogy van különbség az "-all" és az "~all" között. A "-" azt jelzi, hogy az SPF-ellenőrzésnek SIKERTELENNEK kell lennie, ha nem egyezik, a "~" pedig azt jelzi, hogy az SPF-ellenőrzésnek SOFTFAIL-nek kell lennie. A domain-hamisítás megelőzése érdekében a "-all" megközelítés használatát javasoljuk. <br /><br />
Előfordulhat, hogy meg kell adnia annak a hosztnak az SPF-rekordját is, amelyről a leveleket küldi (pl. Outlook).
</span>
</div>

### Hogyan állíthatom be a DKIM-et az e-mailek továbbításához? {#how-do-i-set-up-dkim-for-forward-email}

Lépjen a <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Fiókom <i class="fa fa-angle-right"></i> Domainek</a> <i class="fa fa-angle-right"></i> Beállítások <i class="fa fa-angle-right"></i> Kimenő SMTP konfiguráció menüpontra, és kövesse a beállítási utasításokat.

### Hogyan állíthatom be a DMARC-t az e-mailek továbbításához? {#how-do-i-set-up-dmarc-for-forward-email}

Lépjen a <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Fiókom <i class="fa fa-angle-right"></i> Domainek</a> <i class="fa fa-angle-right"></i> Beállítások <i class="fa fa-angle-right"></i> Kimenő SMTP konfiguráció menüpontra, és kövesse a beállítási utasításokat.

### Hogyan csatlakoztathatom és konfigurálhatom a névjegyeimet? {#how-do-i-connect-and-configure-my-contacts}

**A névjegyek konfigurálásához használd a következő CardDAV URL-címet:** `https://carddav.forwardemail.net` (vagy egyszerűen `carddav.forwardemail.net`, ha a kliens engedélyezi)

### Hogyan csatlakoztathatom és konfigurálhatom a naptáraimat? {#how-do-i-connect-and-configure-my-calendars}

**A naptár konfigurálásához használja a következő CalDAV URL-címet:** `https://caldav.forwardemail.net` (vagy egyszerűen `caldav.forwardemail.net`, ha az ügyfél engedélyezi)

<img width="612" height="520" src="/img/faq/calendar-setup.png" alt="E-mail továbbítása naptár CalDAV Thunderbird példa beállítás" />

### Hogyan adhatok hozzá további naptárakat és kezelhetem a meglévő naptárakat? {#how-do-i-add-more-calendars-and-manage-existing-calendars}

Ha további naptárakat szeretne hozzáadni, akkor csak adjon hozzá egy új naptár URL-címét: `https://caldav.forwardemail.net/dav/principals/calendar-name` (**a `calendar-name` részt feltétlenül cserélje le a kívánt naptár nevére**)

A naptár nevét és színét a létrehozás után módosíthatja – ehhez csak használja a kívánt naptáralkalmazást (pl. Apple Mail vagy [Thunderbird](https://thunderbird.net)).

### Hogyan állíthatom be az SRS-t az e-mailek továbbításához? {#how-do-i-set-up-srs-for-forward-email}

Automatikusan konfiguráljuk a [Feladó átírási sémája](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme) ("SRS") értéket – ezt Önnek nem kell megtennie.

### Hogyan állíthatom be az MTA-STS-t az e-mailek továbbításához? {#how-do-i-set-up-mta-sts-for-forward-email}

További információkért lásd a [az MTA-STS-ről szóló szekciónk](#do-you-support-mta-sts) oldalt.

### Hogyan adhatok hozzá profilképet az e-mail címemhez? {#how-do-i-add-a-profile-picture-to-my-email-address}

Ha Gmailt használsz, akkor kövesd az alábbi lépéseket:

1. Lépjen a <https://google.com> oldalra, és jelentkezzen ki az összes e-mail fiókból.
2. Kattintson a „Bejelentkezés” gombra, majd a legördülő menüben kattintson a „másik fiók” elemre.
3. Válassza a „Másik fiók használata” lehetőséget.
4. Válassza a „Fiók létrehozása” lehetőséget.
5. Válassza a „Jelenlegi e-mail címem használata” lehetőséget.
6. Adja meg az egyéni domainnevét, az e-mail címét.
7. Szerezze be az e-mail címére küldött ellenőrző e-mailt.
8. Írja be az e-mailben található ellenőrző kódot.
9. Töltse ki az új Google-fiókjához tartozó profiladatokat.
10. Fogadja el az összes adatvédelmi és felhasználási feltételre vonatkozó szabályzatot.
11. Lépjen a <https://google.com> oldalra, és a jobb felső sarokban kattintson a profil ikonjára, majd a „módosítás” gombra.
12. Töltsön fel egy új fotót vagy avatárt a fiókjához.
13. A változtatások életbe lépése körülbelül 1-2 órát vesz igénybe, de néha nagyon gyors is lehet.
14. Küldjön egy teszt e-mailt, és a profilfotónak meg kell jelennie.

## Speciális funkciók {#advanced-features}

### Támogatja a marketinggel kapcsolatos e-mailekhez kapcsolódó hírleveleket vagy levelezési listákat? {#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email}

Igen, bővebben olvashat itt: <https://forwardemail.net/guides/newsletter-with-listmonk>.

Kérjük, vegye figyelembe, hogy az IP-cím hírnevének megőrzése és a kézbesítés biztosítása érdekében a Forward Email manuális felülvizsgálati folyamatot alkalmaz domainenként a **hírlevél jóváhagyásához**. Küldjön e-mailt a <support@forwardemail.net> címre, vagy nyisson egy [segítségkérés](https://forwardemail.net/help) űrlapot jóváhagyásra. Ez általában kevesebb mint 24 órát vesz igénybe, a legtöbb kérést 1-2 órán belül teljesítjük. A közeljövőben további spam-ellenőrzésekkel és riasztásokkal szeretnénk ezt a folyamatot azonnalivá tenni. Ez a folyamat biztosítja, hogy e-mailjei eljussanak a beérkező levelek mappájába, és üzenetei ne legyenek spamként megjelölve.

### Támogatja az e-mailek küldését API-val? {#do-you-support-sending-email-with-api}

Igen, 2023 májusától minden fizetős felhasználó számára támogatjuk az API-n keresztüli e-mail küldést kiegészítőként.

<div class="alert my-3 alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Fontos:
</strong>
<span>
Kérjük, győződjön meg róla, hogy elolvasta a <a href="/terms" class="alert-link" target="_blank">Felhasználási Feltételeinket</a>, az <a href="/privacy" class="alert-link" target="_blank">Adatvédelmi irányelveinket</a> és a <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Kimenő SMTP-korlátainkat</a> – a használatot tudomásulvételnek és elfogadásnak tekintjük.
</span>
</div>

Kérjük, tekintse meg a [E-mailek](/email-api#outbound-emails)-ról szóló részt az API dokumentációnkban a lehetőségekért, példákért és további információkért.

Ahhoz, hogy kimenő e-maileket küldhessen API-nkon keresztül, a [Saját biztonság](/my-account/security) alatt elérhető API-tokent kell használnia.

### Támogatja az IMAP-on keresztüli e-mail fogadást? {#do-you-support-receiving-email-with-imap}

Igen, 2023. október 16-tól minden fizetős felhasználó számára kiegészítőként támogatjuk az IMAP-on keresztüli e-mail fogadást. **Kérjük, olvassa el részletes cikkünket** a [Hogyan működik a titkosított SQLite postaláda-tárolási funkciónk?](/blog/docs/best-quantum-safe-encrypted-email-service) oldalon.**

<div id="imap-utasítások">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Fontos:
</strong>
<span>
Kérjük, győződjön meg róla, hogy elolvasta a <a href="/terms" class="alert-link" target="_blank">Felhasználási Feltételeinket</a> és az <a href="/privacy" class="alert-link" target="_blank">Adatvédelmi irányelveinket</a> – a használatot tudomásulvételnek és elfogadásnak tekintjük.
</span>
</div>

1. Hozzon létre egy új aliast a domainjéhez a <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Fiókom <i class="fa fa-angle-right"></i> Domainek</a> <i class="fa fa-angle-right"></i> Aliasok (pl. <code><hello@example.com></code>) alatt.

2. Kattintson a <strong class="text-success"><i class="fa fa-key"></i>Jelszó generálása</strong> lehetőségre az újonnan létrehozott alias mellett. Másolja a vágólapra, és biztonságosan tárolja a képernyőn megjelenő generált jelszót.

3. A kívánt e-mail alkalmazás használatával adjon hozzá vagy konfiguráljon egy fiókot az újonnan létrehozott aliasával (pl. <code><hello@example.com></code>)
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tipp:
</strong>
<span>A <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a> vagy <a href="/blog/open-source" használatát javasoljuk. class="alert-link" target="_blank">egy nyílt forráskódú és adatvédelmet szem előtt tartó alternatíva</a>.</span>
</div>

4. Amikor a rendszer kéri az IMAP-kiszolgáló nevét, írja be: `imap.forwardemail.net`

5. Amikor a rendszer kéri az IMAP-kiszolgáló portjának megadását, írja be a `993` (SSL/TLS) értéket – szükség esetén lásd a [alternatív IMAP portok](/faq#what-are-your-imap-server-configuration-settings) részt.
<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tipp:
</strong>
<span>Thunderbird használata esetén győződjön meg arról, hogy a „Kapcsolat biztonsága” beállítás „SSL/TLS”, a hitelesítési módszer pedig „Normál jelszó” értékre van állítva.</span>
</div>

6. Amikor a rendszer kéri az IMAP-kiszolgáló jelszavát, illessze be a fenti 2. lépésben található <strong class="text-success"><i class="fa fa-key"></i>Jelszó generálása</strong> részben található jelszót.

7. **Mentsd el a beállításaidat** – ha problémád adódik, kérjük, <a href="/help">lépj velünk kapcsolatba</a>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Gratulálunk!
</strong>
<span>
Sikeresen elvégezte az összes lépést.
</span>
</div>
</div>

</div>

### Támogatja a POP3-at? {#do-you-support-pop3}

Igen, 2023. december 4-től támogatjuk a [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol) kiegészítőt minden fizetős felhasználó számára. **Kérjük, olvassa el részletes cikkünket** a [Hogyan működik a titkosított SQLite postaláda-tárolási funkciónk?](/blog/docs/best-quantum-safe-encrypted-email-service)-ről.**

<div id="pop3-utasítások">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Fontos:
</strong>
<span>
Kérjük, győződjön meg róla, hogy elolvasta a <a href="/terms" class="alert-link" target="_blank">Felhasználási Feltételeinket</a> és az <a href="/privacy" class="alert-link" target="_blank">Adatvédelmi irányelveinket</a> – a használatot tudomásulvételnek és elfogadásnak tekintjük.
</span>
</div>

1. Hozzon létre egy új aliast a domainjéhez a <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Fiókom <i class="fa fa-angle-right"></i> Domainek</a> <i class="fa fa-angle-right"></i> Aliasok (pl. <code><hello@example.com></code>) alatt.

2. Kattintson a <strong class="text-success"><i class="fa fa-key"></i>Jelszó generálása</strong> lehetőségre az újonnan létrehozott alias mellett. Másolja a vágólapra, és biztonságosan tárolja a képernyőn megjelenő generált jelszót.

3. A kívánt e-mail alkalmazás használatával adjon hozzá vagy konfiguráljon egy fiókot az újonnan létrehozott aliasával (pl. <code><hello@example.com></code>)
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tipp:
</strong>
<span>A <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a> vagy <a href="/blog/open-source" használatát javasoljuk. class="alert-link" target="_blank">egy nyílt forráskódú és adatvédelmet szem előtt tartó alternatíva</a>.</span>
</div>

4. Amikor a POP3-kiszolgáló nevét kéri a rendszer, írja be: `pop3.forwardemail.net`

5. Amikor a POP3 szerver portját kéri a rendszer, írja be a `995` (SSL/TLS) értéket – szükség esetén lásd a [alternatív POP3 portok](/faq#what-are-your-pop3-server-configuration-settings) részt.
<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tipp:
</strong>
<span>Thunderbird használata esetén győződjön meg arról, hogy a „Kapcsolat biztonsága” beállítás „SSL/TLS”, a hitelesítési módszer pedig „Normál jelszó” értékre van állítva.</span>
</div>

6. Amikor a rendszer kéri a POP3-kiszolgáló jelszavát, illessze be a fenti 2. lépésben található <strong class="text-success"><i class="fa fa-key"></i>Jelszó generálása</strong> részben található jelszót.

7. **Mentsd el a beállításaidat** – ha problémád adódik, kérjük, <a href="/help">lépj velünk kapcsolatba</a>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Gratulálunk!
</strong>
<span>
Sikeresen elvégezte az összes lépést.
</span>
</div>
</div>

</div>

### Támogatják a naptárakat (CalDAV)? {#do-you-support-calendars-caldav}

Igen, 2024. február 5-től hozzáadtuk ezt a funkciót. A szerverünk neve `caldav.forwardemail.net`, és a <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">állapotoldalunkon</a> is figyeljük.

Támogatja az IPv4-et és az IPv6-ot is, és a `443` (HTTPS) porton keresztül érhető el.

| Bejelentkezés | Példa | Leírás |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Felhasználónév | `user@example.com` | Egy olyan alias e-mail címe, amely létezik a domainhez a <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Fiókom <i class="fa fa-angle-right"></i>Domainek</a> oldalon. |
| Jelszó | `************************` | Alias-specifikusan generált jelszó. |

A naptártámogatás használatához a **felhasználó** e-mail címének meg kell egyeznie egy olyan alias e-mail címével, amely létezik a domainhez a <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Saját fiók <i class="fa fa-angle-right"></i>Domains</a> oldalon – a **jelszó** pedig egy alias-specifikusan generált jelszó kell, hogy legyen.

### Támogatja a névjegyeket (CardDAV)? {#do-you-support-contacts-carddav}

Igen, 2025. június 12-től hozzáadtuk ezt a funkciót. A szerverünk neve `carddav.forwardemail.net`, és a <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">állapotoldalunkon</a> is figyeljük.

Támogatja az IPv4-et és az IPv6-ot is, és a `443` (HTTPS) porton keresztül érhető el.

| Bejelentkezés | Példa | Leírás |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Felhasználónév | `user@example.com` | Egy olyan alias e-mail címe, amely létezik a domainhez a <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Fiókom <i class="fa fa-angle-right"></i>Domainek</a> oldalon. |
| Jelszó | `************************` | Alias-specifikusan generált jelszó. |

A kapcsolattartási támogatás használatához a **felhasználó** e-mail címének meg kell egyeznie egy olyan alias e-mail címével, amely létezik a domainhez a <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Fiókom <i class="fa fa-angle-right"></i>Domainek</a> oldalon – a **jelszó** pedig egy alias-specifikusan generált jelszó kell, hogy legyen.

### Támogatja az e-mailek küldését SMTP-n keresztül? {#do-you-support-sending-email-with-smtp}

Igen, 2023 májusától minden fizetős felhasználó számára támogatjuk az e-mailek küldését SMTP-vel kiegészítőként.

<div id="smtp-utasítások">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Fontos:
</strong>
<span>
Kérjük, győződjön meg róla, hogy elolvasta a <a href="/terms" class="alert-link" target="_blank">Felhasználási Feltételeinket</a>, az <a href="/privacy" class="alert-link" target="_blank">Adatvédelmi irányelveinket</a> és a <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Kimenő SMTP-korlátainkat</a> – a használatot tudomásulvételnek és elfogadásnak tekintjük.
</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Fontos:
</strong>
<span>
Ha Gmailt használ, akkor tekintse meg az <a class="alert-link" href="/guides/send-mail-as-gmail-custom-domain">E-mail küldése Gmaillel útmutatónkat</a>. Ha Ön fejlesztő, akkor tekintse meg az <a class="alert-link" href="/email-api#outbound-emails" target="_blank">e-mail API dokumentációnkat</a>.
</span>
</div>

1. Lépjen a <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Fiókom <i class="fa fa-angle-right"></i> Domainek</a> <i class="fa fa-angle-right"></i> Beállítások <i class="fa fa-angle-right"></i> Kimenő SMTP konfiguráció menüpontra, és kövesse a beállítási utasításokat.

2. Hozzon létre egy új aliast a domainjéhez a <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Fiókom <i class="fa fa-angle-right"></i> Domainek</a> <i class="fa fa-angle-right"></i> Aliasok (pl. <code><hello@example.com></code>) alatt.

3. Kattintson a <strong class="text-success"><i class="fa fa-key"></i>Jelszó generálása</strong> lehetőségre az újonnan létrehozott alias mellett. Másolja a vágólapra, és biztonságosan tárolja a képernyőn megjelenő generált jelszót.

4. A kívánt e-mail alkalmazás használatával adjon hozzá vagy konfiguráljon egy fiókot az újonnan létrehozott aliasával (pl. <code><hello@example.com></code>)
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tipp:
</strong>
<span>A <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a> vagy <a href="/blog/open-source" használatát javasoljuk. class="alert-link" target="_blank">egy nyílt forráskódú és adatvédelmet szem előtt tartó alternatíva</a>.</span>
</div>

5. Amikor a rendszer kéri az SMTP-kiszolgáló nevét, írja be: `smtp.forwardemail.net`

6. Amikor a rendszer kéri az SMTP-kiszolgáló portjának megadását, írja be a `465` (SSL/TLS) értéket – szükség esetén lásd a [alternatív SMTP portok](/faq#what-are-your-smtp-server-configuration-settings) részt.
<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tipp:
</strong>
<span>Thunderbird használata esetén győződjön meg arról, hogy a „Kapcsolat biztonsága” beállítás „SSL/TLS”, a hitelesítési módszer pedig „Normál jelszó” értékre van állítva.</span>
</div>

7. Amikor a rendszer kéri az SMTP-kiszolgáló jelszavát, illessze be a fenti 3. lépésben található <strong class="text-success"><i class="fa fa-key"></i>Jelszó generálása</strong> részben található jelszót.

8. **Mentsd el a beállításaidat, és küldd el az első teszt e-mailedet** – ha problémád adódik, kérjük, <a href="/help">lépj kapcsolatba velünk</a>

<div class="alert my-3 alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Fontos:
</strong>
<span>
Felhívjuk figyelmét, hogy az IP-cím hírnevének megőrzése és a kézbesítés biztosítása érdekében manuális felülvizsgálati folyamatot alkalmazunk domainenként a kimenő SMTP-jóváhagyáshoz. Ez általában kevesebb mint 24 órát vesz igénybe, a legtöbb kérést 1-2 órán belül teljesítjük. A közeljövőben további spam-ellenőrzésekkel és riasztásokkal szeretnénk ezt a folyamatot azonnalivá tenni. Ez a folyamat biztosítja, hogy e-mailjei eljussanak a beérkező levelek mappájába, és üzenetei ne legyenek spamként megjelölve.
</span>
</div>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Gratulálunk!
</strong>
<span>
Sikeresen elvégezte az összes lépést.
</span>
</div>
</div>

</div>

### Támogatja az OpenPGP/MIME-t, a végpontok közötti titkosítást ("E2EE") és a Web Key Directory-t ("WKD")? {#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd}

Igen, támogatjuk a [OpenPGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy#OpenPGP) és [végponttól végpontig terjedő titkosítás ("E2EE")](https://en.wikipedia.org/wiki/End-to-end_encryption) paramétereket, valamint a nyilvános kulcsok felderítését a [Webkulcs-könyvtár ("WKD")](https://wiki.gnupg.org/WKD) használatával. Az OpenPGP-t a [keys.openpgp.org](https://keys.openpgp.org/about/usage#wkd-as-a-service) vagy a [saját kulcsok tárolása](https://wiki.gnupg.org/WKDHosting) paraméterrel konfigurálhatja (lásd a [Ez a lényeg a WKD szerver beállításához](https://gist.github.com/kafene/0a6e259996862d35845784e6e5dbfc79) részt).

* A WKD keresések 1 órán át gyorsítótárazva vannak az időben történő e-mail kézbesítés biztosítása érdekében → ezért ha hozzáadja, módosítja vagy eltávolítja a WKD kulcsát, kérjük, küldjön nekünk e-mailt a `support@forwardemail.net` címre az e-mail címével, hogy manuálisan törölhessük a gyorsítótárat.
* Támogatjuk a PGP titkosítást azoknál az üzeneteknél, amelyeket WKD kereséssel vagy egy feltöltött PGP kulcs használatával továbbítunk a felületünkön.
* A feltöltött kulcsok érvényesek, amíg a PGP jelölőnégyzet be van jelölve.
* A webhookoknak küldött üzenetek jelenleg nincsenek PGP titkosítva.
* Ha több aliasa is megegyezik egy adott továbbítási címmel (pl. regex/helyettesítő karakter/pontos kombináció), és ha ezek közül több is tartalmaz feltöltött PGP kulcsot, és PGP ellenőrizve van → akkor hibaüzenetet küldünk Önnek, és nem titkosítjuk az üzenetet a feltöltött PGP kulccsal. Ez nagyon ritka, és általában csak a haladó felhasználókra vonatkozik, akik összetett alias szabályokkal rendelkeznek. * **A PGP titkosítás nem kerül alkalmazásra az MX szervereinken keresztül továbbított e-mailekre, ha a feladó DMARC-szabályzata elutasításra van beállítva. Ha PGP titkosítást igényel *minden* levélre, akkor javasoljuk az IMAP szolgáltatásunk használatát, és a bejövő levelekhez tartozó aliashoz konfigurálja a PGP kulcsot.**

**A Web Key Directory beállítását a <https://wkd.chimbosonic.com/> (nyílt forráskódú) vagy a <https://www.webkeydirectory.com/> (saját forráskódú) címen ellenőrizheti.**

<div class="alert my-3 alert-success">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Automatikus titkosítás:
</strong>
<span>Ha a <a href="#do-you-support-sending-email-with-smtp" class="alert-link">kimenő SMTP szolgáltatásunkat</a> használja, és titkosítatlan üzeneteket küld, akkor automatikusan megpróbáljuk titkosítani az üzeneteket címzettenként a <a class="alert-link" href="https://wiki.gnupg.org/WKD">Web kulcskönyvtár ("WKD")</a> használatával.</span>
</div>

<div class="alert alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Fontos:
</strong>
<span>
Az OpenPGP egyéni domainnevéhez való engedélyezéséhez kövesse az alábbi lépéseket.
</span>
</div>

1. Töltse le és telepítse az e-mail klienséhez ajánlott bővítményt az alábbiak szerint:

| E-mail kliens | Platform | Ajánlott bővítmény | Megjegyzések |
| --------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Thunderbird | Asztali | [Configure OpenPGP in Thunderbird](https://support.mozilla.org/en-US/kb/openpgp-thunderbird-howto-and-faq#w_i-have-never-used-openpgp-with-thunderbird-before-how-do-i-setup-openpgp) | A Thunderbird beépített OpenPGP-támogatással rendelkezik. |
| Gmail | Böngésző | [Mailvelope](https://mailvelope.com/) vagy [FlowCrypt](https://flowcrypt.com/download) (tulajdonjoggal védett licenc) | A Gmail nem támogatja az OpenPGP-t, de letöltheti a nyílt forráskódú [Mailvelope](https://mailvelope.com/) vagy [FlowCrypt](https://flowcrypt.com/download) bővítményt. |
| Apple Mail | macOS | [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation) | Az Apple Mail nem támogatja az OpenPGP-t, de letöltheted a nyílt forráskódú [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation) bővítményt. |
| Apple Mail | iOS | [PGPro](https://github.com/opensourceios/PGPro/) vagy [FlowCrypt](https://apps.apple.com/us/app/flowcrypt-encrypted-email/id1591754995) (tulajdonjoggal védett licenc) | Az Apple Mail nem támogatja az OpenPGP-t, de letöltheted a nyílt forráskódú [PGPro](https://github.com/opensourceios/PGPro/) vagy [FlowCrypt](https://flowcrypt.com/download) bővítményt. |
| Kilátások | Ablakok | [gpg4win](https://www.gpg4win.de/index.html) | Az Outlook asztali levelezőprogramja nem támogatja az OpenPGP-t, azonban letöltheti a nyílt forráskódú [gpg4win](https://www.gpg4win.de/index.html) bővítményt. |
| Kilátások | Böngésző | [Mailvelope](https://mailvelope.com/) vagy [FlowCrypt](https://flowcrypt.com/download) (tulajdonjoggal védett licenc) | Az Outlook webes levelezőprogramja nem támogatja az OpenPGP-t, azonban letöltheti a nyílt forráskódú [Mailvelope](https://mailvelope.com/) vagy [FlowCrypt](https://flowcrypt.com/download) bővítményt. |
| Android | Mozgó | [OpenKeychain](https://www.openkeychain.org/) vagy [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email) | A [Android mail clients](/blog/open-source/android-email-clients), mint például a [Thunderbird Mobile](https://www.thunderbird.net/en-US/mobile/) és a [FairEmail](https://github.com/M66B/FairEmail) is támogatja a [OpenKeychain](https://www.openkeychain.org/) nyílt forráskódú bővítményt. Alternatív megoldásként használhatja a [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email) nyílt forráskódú (saját licenccel rendelkező) bővítményt. |
| Google Chrome | Böngésző | [Mailvelope](https://mailvelope.com/) vagy [FlowCrypt](https://flowcrypt.com/download) (tulajdonjoggal védett licenc) | Letöltheted a [Mailvelope](https://mailvelope.com/) vagy a [FlowCrypt](https://flowcrypt.com/download) nyílt forráskódú böngészőbővítményt. |
| Mozilla Firefox | Böngésző | [Mailvelope](https://mailvelope.com/) vagy [FlowCrypt](https://flowcrypt.com/download) (tulajdonjoggal védett licenc) | Letöltheted a [Mailvelope](https://mailvelope.com/) vagy a [FlowCrypt](https://flowcrypt.com/download) nyílt forráskódú böngészőbővítményt. |
| Microsoft Edge | Böngésző | [Mailvelope](https://mailvelope.com/) | Letöltheted a [Mailvelope](https://mailvelope.com/) nyílt forráskódú böngészőbővítményt. |
| Bátor | Böngésző | [Mailvelope](https://mailvelope.com/) vagy [FlowCrypt](https://flowcrypt.com/download) (tulajdonjoggal védett licenc) | Letöltheted a [Mailvelope](https://mailvelope.com/) vagy a [FlowCrypt](https://flowcrypt.com/download) nyílt forráskódú böngészőbővítményt. |
| Balsafa | Asztali | [Configure OpenPGP in Balsa](https://www.mynetcologne.de/~nc-dreszal/balsa/balsa23-secure-mail.html#USING) | A Balsa beépített OpenPGP-támogatással rendelkezik. |
| KMail | Asztali | [Configure OpenPGP in KMail](https://userbase.kde.org/KMail/PGP_MIME) | A KMail beépített OpenPGP-támogatással rendelkezik. |
| GNOME Evolúció | Asztali | [Configure OpenPGP in Evolution](https://help.gnome.org/users/evolution/stable/mail-encryption.html.en) | A GNOME Evolution beépített OpenPGP-támogatással rendelkezik. |
| Terminál | Asztali | [Configure gpg in Terminal](https://docs.github.com/en/authentication/managing-commit-signature-verification/generating-a-new-gpg-key#generating-a-gpg-key) | A nyílt forráskódú [gpg command line tool](https://www.gnupg.org/download/) segítségével parancssorból hozhat létre új kulcsot. |

2. Nyisd meg a bővítményt, hozd létre a nyilvános kulcsodat, és állítsd be az e-mail kliensed a használatához.

3. Töltse fel a nyilvános kulcsát a <https://keys.openpgp.org/upload>. címre

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tipp:
</strong>
<span>A kulcsod kezeléséhez a <a class="alert-link" href="https://keys.openpgp.org/manage">https://keys.openpgp.org/manage</a>" címet használhatod.</span>
</div>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Opcionális kiegészítő:
</strong>
<span>
Ha a <a class="alert-link" href="/blog/docs/best-quantum-safe-encrypted-email-service">titkosított tárolási (IMAP/POP3)</a> szolgáltatásunkat használja, és azt szeretné, hogy <i>összes</i> a (már titkosított) SQLite adatbázisában tárolt e-mail titkosítva legyen a nyilvános kulcsával, akkor lépjen a <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Fiókom <i class="fa fa-angle-right"></i> Domainek</a> <i class="fa fa-angle-right"></i> Aliasok (pl. <code>hello@example.com</code>) <i class="fa fa-angle-right"></i> Szerkeszd az <i class="fa fa-angle-right"></i> OpenPGP-t és töltsd fel a nyilvános kulcsodat.
</span>
</div>

4. Adjon hozzá egy új `CNAME` rekordot a domainnevéhez (pl. `example.com`):

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Név/Gép/Álnév</th>
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
<span>Ha az aliasod a <a class="alert-link" href="/disposable-addresses" target="_blank">vanity/disposable domainjeinket</a> használja (pl. <code>hideaddress.net</code>), akkor kihagyhatod ezt a lépést.</span>
</div>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Gratulálunk!
</strong>
<span>
Sikeresen elvégezte az összes lépést.
</span>
</div>
</div>

### Támogatja az MTA-STS-t? {#do-you-support-mta-sts}

Igen, 2023. március 2-tól támogatjuk a [MTA-STS](https://www.hardenize.com/blog/mta-sts) hitelesítő adatot. Használhatja a [ez a sablon](https://github.com/jpawlowski/mta-sts.template) hitelesítő adatot, ha engedélyezni szeretné a domainjén.

A konfigurációnk nyilvánosan megtalálható a GitHubon a <https://github.com/forwardemail/mta-sts.forwardemail.net>. címen.

### Támogatják a jelszavakat és a WebAuthn-t? {#do-you-support-passkeys-and-webauthn}

Igen! 2023. december 13-tól támogatjuk a [a nagy kereslet miatt](https://github.com/orgs/forwardemail/discussions/182) jelszavakat.

A jelszavak lehetővé teszik a biztonságos bejelentkezést jelszó és kétfaktoros hitelesítés nélkül.

Személyazonosságát érintéssel, arcfelismeréssel, eszközalapú jelszóval vagy PIN-kóddal igazolhatja.

Akár 30 jelszó egyidejű kezelését is lehetővé tesszük, így könnyedén bejelentkezhetsz az összes eszközöddel.

További információ a jelszavakról az alábbi linkeken található:

* IDEIGLENES_HELYTARTÓ_0 (Google)
* IDEIGLENES_HELYTARTÓ_1 (Apple)
* IDEIGLENES_HELYTARTÓ_2)

### Támogatja az e-mailben bevált gyakorlatokat? {#do-you-support-email-best-practices}

Igen. Beépített SPF, DKIM, DMARC, ARC és SRS támogatással rendelkezünk minden csomagban. Emellett széles körben együttműködtünk ezen specifikációk eredeti szerzőivel és más e-mail szakértőkkel a tökéletesség és a magas kézbesítési pontosság biztosítása érdekében.

### Támogatják a webhookok visszapattanását? {#do-you-support-bounce-webhooks}

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tipp:
</strong>
Dokumentációt keres az e-mail webhookokról? További információkért lásd: <a href="/faq#do-you-support-webhooks" class="alert-link">Támogatják a webhookokat?</a>.
<span>
</span>
</div>

Igen, 2024. augusztus 14-től bevezettük ezt a funkciót. Mostantól a Fiókom → Domainek → Beállítások → Visszapattanó webhook URL menüpontban beállíthat egy `http://` vagy `https://` URL-címet, amelyre `POST` kérést küldünk, valahányszor a kimenő SMTP e-mailek visszapattannak.

Ez hasznos a kimenő SMTP-üzenetek kezeléséhez és figyeléséhez – és felhasználható a feliratkozók nyilvántartására, a leiratkozásra és a visszapattanások észlelésére.

A visszapattanó webhook hasznos adatai JSON formátumban kerülnek elküldésre a következő tulajdonságokkal:

* `email_id` (Karakterlánc) - az e-mail azonosítója, amely megfelel egy e-mailnek a Fiókom → E-mailek (kimenő SMTP) menüpontban.
* `list_id` (Karakterlánc) - a `List-ID` fejléc értéke (kis- és nagybetűket nem megkülönböztető), ha van ilyen, az eredeti kimenő e-mailből.
* `list_unsubscribe` (Karakterlánc) - a `List-Unsubscribe` fejléc értéke (kis- és nagybetűket nem megkülönböztető), ha van ilyen, az eredeti kimenő e-mailből.
* `feedback_id` (Karakterlánc) - a `Feedback-ID` fejléc értéke (kis- és nagybetűket nem megkülönböztető), ha van ilyen, az eredeti kimenő e-mailből.
* `recipient` (Karakterlánc) - a visszapattanó vagy hibás címzett e-mail címe.
* `message` (Karakterlánc) - a visszapattanó üzenet részletes hibaüzenete.
* `response` (Karakterlánc) - az SMTP válaszüzenete.
* `list_id`0 (Szám) - az elemzett SMTP válaszkód
* `list_id`1 (Karakterlánc) - ha a válaszkód megbízható forrásból származott, akkor ez az érték a gyökértartomány nevével lesz feltöltve (pl. `list_id`2 vagy `list_id`3)
* `list_id`4 (Objektum) - egy objektum, amely a következő tulajdonságokat tartalmazza, amelyek részletezik a visszapattanás és az elutasítás állapotát: * `list_id`5 (Karakterlánc) - visszapattanási művelet (pl. `list_id`6)
* `list_id`7 (Karakterlánc) - visszapattanás oka (pl. `list_id`8)
* `list_id`9 (Karakterlánc) - visszapattanás kategóriája (pl. `List-ID`0)
* `List-ID`1 (Szám) - visszapattanás állapotkódja (pl. `List-ID`2)
* `List-ID`3 (Karakterlánc) - a válaszból származó visszapattanási kód üzenet (pl. `List-ID`4)
* `List-ID`5 (Szám) - elemzett sor száma, ha van, `List-ID`6 (pl. `List-ID`7)
* `List-ID`8 (Objektum) - kulcsérték fejlécpár a kimenő e-mailhez
* `List-ID`9 (Karakterlánc) - `list_unsubscribe`0 formátumú dátum, amikor a visszapattanási hiba történt

Például:

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

Íme néhány további megjegyzés a visszapattanó webhookokkal kapcsolatban:

* Ha a webhook hasznos adata `list_id`, `list_unsubscribe` vagy `feedback_id` értéket tartalmaz, akkor tegye meg a megfelelő lépéseket a `recipient` eltávolításához a listából, ha szükséges.
* Ha a `bounce.category` értéke `"block"`, `"recipient"`, `"spam"` vagy `"virus"` volt, akkor mindenképpen távolítsa el a felhasználót a listából.
* Ha ellenőriznie kell a webhook hasznos adatait (hogy megbizonyosodjon arról, hogy valóban a szerverünkről érkeznek), akkor megteheti a [távoli kliens IP-címének és hostnevének feloldása fordított kereséssel](https://nodejs.org/api/dns.html#dnspromisesreverseip) értéket – annak `list_unsubscribe`0-nek kell lennie.
* Az IP-címet a `list_unsubscribe`1-gyel is összehasonlíthatja.
* A webhook kulcs megszerzéséhez lépjen a Fiókom → Tartományok → Beállítások → Webhook aláírás-adatcsomag-ellenőrző kulcs menüpontra.
* Biztonsági okokból ezt a kulcsot bármikor lecserélheti. * Számítsa ki és hasonlítsa össze a webhook kérésünkből származó `list_unsubscribe`2 értéket a kiszámított törzsértékkel a kulcs használatával. Egy példa erre a `list_unsubscribe`3 címen található.
* További információkért lásd a <`list_unsubscribe`4 címen található megbeszélést.
* Legfeljebb `list_unsubscribe`5 másodpercig várunk, amíg a webhook végpontja `list_unsubscribe`6 állapotkóddal válaszol, és legfeljebb `list_unsubscribe`7 másodpercig újra próbálkozunk.
* Ha azt észleljük, hogy a visszapattanó webhook URL-címében hiba van, miközben megpróbálunk kérést küldeni, akkor hetente egyszer küldünk Önnek egy udvariassági e-mailt.

### Támogatják a webhookokat? {#do-you-support-webhooks}

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tipp:
</strong>
Dokumentációt keres a visszapattanó webhookokról? További információkért lásd: <a href="/faq#do-you-support-bounce-webhooks" class="alert-link">Támogatják a visszapattanó webhookokat?</a>.
<span>
</span>
</div>

Igen, 2020. május 15-től bevezettük ezt a funkciót. Egyszerűen hozzáadhatsz webhook(okat) ugyanúgy, mint bármelyik címzettnél! Kérjük, győződj meg róla, hogy a webhook URL-címében szerepel a "http" vagy a "https" protokoll előtag.

<div class="alert my-3 alert-danger">
<i class="fa fa-stop-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Fokozott adatvédelem:
</strong>
<span>
Ha fizetős csomagot használ (amely fokozott adatvédelmet tartalmaz), akkor kérjük, lépjen a <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Fiókom <i class="fa fa-angle-right"></i> Domainek</a> oldalra, és kattintson a domainje melletti "Aliasok" lehetőségre a webhookok konfigurálásához. Ha többet szeretne megtudni a fizetős csomagokról, tekintse meg az <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Árak</a> oldalunkat. Ellenkező esetben továbbra is követheti az alábbi utasításokat.
</span>
</div>

Ha az ingyenes csomagot használod, akkor egyszerűen adj hozzá egy új DNS <strong class="notranslate">TXT</strong> rekordot az alábbiak szerint:

Például, ha azt szeretném, hogy a `alias@example.com` címre érkező összes e-mail egy új [kérésláda](https://requestbin.com/r/en8pfhdgcculn?inspect) tesztvégpontra kerüljön továbbításra:

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Név/Gazdagép/Álnév</th>
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

Vagy talán azt szeretné, hogy az összes `example.com` címre érkező e-mail erre a végpontra kerüljön továbbításra:

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Név/Gazdagép/Álnév</th>
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

**További megjegyzések a webhookokkal kapcsolatban:**

* Ha ellenőrizned kell a webhook hasznos adatait (hogy megbizonyosodj arról, hogy valóban a szerverünkről érkeznek), akkor használhatod a [távoli kliens IP-címének és hostnevének feloldása fordított kereséssel](https://nodejs.org/api/dns.html#dnspromisesreverseip) paramétert – ennek vagy `mx1.forwardemail.net`, vagy `mx2.forwardemail.net` kell lennie.
* Az IP-címet a [közzétett IP-címeink](#what-are-your-servers-ip-addresses) címmel is összehasonlíthatod.
* Ha fizetős csomaggal rendelkezel, akkor a webhook kulcsod megszerzéséhez menj a Saját fiók → Tartományok → Beállítások → Webhook aláírás-adatállomány-ellenőrző kulcs menüpontra.
* Biztonsági okokból ezt a kulcsot bármikor lecserélheted.
* Számítsd ki és hasonlítsd össze a webhook kérésünkből származó `X-Webhook-Signature` értéket a kulcs segítségével kiszámított törzsértékkel. Egy példa erre a [ez a Stack Overflow bejegyzés](https://stackoverflow.com/a/68885281) címen található.
* További információkért lásd a <https://github.com/forwardemail/free-email-forwarding/issues/235> címen található megbeszélést.
* Ha egy webhook nem válaszol `200` állapotkóddal, akkor a válaszát a [hibanapló létrehozva](#do-you-store-error-logs) címen tároljuk – ami hasznos a hibakereséshez. * A webhook HTTP-kérések minden SMTP-kapcsolati kísérlet után legfeljebb 3-szor próbálkoznak újra, végpontonkénti POST-kérések esetén legfeljebb 60 másodperces időtúllépéssel. **Megjegyzés: ez nem azt jelenti, hogy csak 3-szor próbálkozik újra**, hanem folyamatosan újrapróbálkozik egy 421-es SMTP-kód küldésével (ami jelzi a feladónak, hogy később próbálkozzon újra) a 3. sikertelen HTTP POST-kérési kísérlet után. Ez azt jelenti, hogy az e-mail napokig folyamatosan újrapróbálkozik, amíg el nem éri a 200-as állapotkódot.
* Automatikusan újrapróbálkozunk a [szuperügynök újrapróbálkozási metódusa](https://ladjs.github.io/superagent/#retrying-requests)-ben használt alapértelmezett állapot- és hibakódok alapján (mi karbantartók vagyunk).
* Az erőforrások megtakarítása és a válaszidő felgyorsítása érdekében az ugyanarra a végpontra irányuló webhook HTTP-kéréseket egy kérésbe csoportosítjuk (ahelyett, hogy többbe). Például, ha e-mailt küld a <webhook1@example.com>, <webhook2@example.com> és <webhook3@example.com> címekre, és ezek mindegyike úgy van konfigurálva, hogy *pontosan* ugyanarra a végpont URL-címre jusson, akkor csak egy kérés kerül elküldésre. Pontos végpont-egyeztetés és szigorú egyenlőség alapján csoportosítjuk az elemeket.
* Fontos megjegyezni, hogy a `mx1.forwardemail.net`0 könyvtár "simpleParser" metódusát használjuk az üzenet JSON-barát objektummá elemzéséhez.
* A nyers e-mail érték karakterláncként a "raw" tulajdonságban van megadva.
* A hitelesítési eredményeket a "dkim", "spf", "arc", "dmarc" és "bimi" tulajdonságokban adjuk meg.
* Az elemzett e-mail fejléceket a "headers" tulajdonságban adjuk meg – de a könnyebb iteráció és elemzés érdekében a "headerLines" is használható.
* A webhook csoportosított címzettjei csoportosítva vannak, és a "recipients" tulajdonságban vannak megadva.
* Az SMTP munkamenet adatait a "session" tulajdonságban adjuk meg. Ez információkat tartalmaz az üzenet küldőjéről, az üzenet érkezési idejéről, a HELO-ról és a kliens hostname-ről. A kliens hostname értéke, mint `mx1.forwardemail.net`1, vagy a teljes tartománynév (FQDN) (egy fordított PTR keresésből), vagy szögletes zárójelbe tett `mx1.forwardemail.net`2 (pl. `mx1.forwardemail.net`3).
* Ha gyorsan szeretné lekérdezni a `mx1.forwardemail.net`4 értékét, akkor használhatja a `mx1.forwardemail.net`5 értéket (lásd az alábbi példát). A `mx1.forwardemail.net`6 fejléc egy olyan fejléc, amelyet az üzenetekhez adunk hozzá az üzenet eredeti címzettjével (a maszkolt továbbítás előtt) történő hibakereséshez.
* Ha el kell távolítania a `mx1.forwardemail.net`7 és/vagy a `mx1.forwardemail.net`8 tulajdonságokat a hasznos adat törzséből, egyszerűen adja hozzá a `mx1.forwardemail.net`9, `mx2.forwardemail.net`0 vagy `mx2.forwardemail.net`1 tulajdonságokat a webhook végpontjához lekérdezési karakterlánc paraméterként (pl. `mx2.forwardemail.net`2).
* Ha vannak mellékletek, akkor azok a `mx2.forwardemail.net`3 tömbhöz lesznek hozzáfűzve a pufferértékekkel. Ezeket vissza lehet építeni tartalommá egy JavaScript-megközelítéssel, például:

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
Tipp:
</strong>
Kíváncsi, hogyan néz ki a webhook kérés a továbbított e-mailekből? Alább bemutatunk egy példát!
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

### Támogatja a reguláris kifejezéseket vagy a regexeket? {#do-you-support-regular-expressions-or-regex}

Igen, 2021. szeptember 27-től hozzáadtuk ezt a funkciót. Egyszerűen írhat reguláris kifejezéseket ("regex") az aliasok egyeztetéséhez és a helyettesítések végrehajtásához.

A reguláris kifejezéseket támogató aliasok azok, amelyek `/` karakterlánccal kezdődnek és `/` karakterlánccal végződnek, címzettjeik pedig e-mail címek vagy webhookok. A címzettek tartalmazhatnak reguláris kifejezések helyettesítésének támogatását is (pl. `$1`, `$2`).

Két reguláris kifejezés jelzőt támogatunk, a `i`-t és a `g`-et. A `i` kis- és nagybetűket nem megkülönböztető jelző állandó alapértelmezett beállítás, és mindig érvényesül. A `g` globális jelzőt Ön adhatja hozzá a `/` végéhez a `/g` hozzáfűzésével.

Vegye figyelembe, hogy a címzett részhez tartozó <a href="#can-i-disable-specific-aliases">disabled alias funkciót</a> is támogatjuk a reguláris kifejezések támogatásával.

A reguláris kifejezések nem támogatottak a <a href="/disposable-addresses" target="_blank">globális Vanity domaineken</a> (mivel ez biztonsági rés lehet).

<div class="alert my-3 alert-danger">
<i class="fa fa-stop-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Fokozott adatvédelem:
</strong>
<span>
Ha fizetős csomagot használ (amely fokozott adatvédelmet tartalmaz), akkor kérjük, lépjen a <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Fiókom <i class="fa fa-angle-right"></i> Domainek</a> oldalra, és kattintson a domainje melletti "Aliasok" lehetőségre a reguláris kifejezések konfigurálásához. Ha többet szeretne megtudni a fizetős csomagokról, tekintse meg az <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Árak</a> oldalunkat. Ellenkező esetben továbbra is követheti az alábbi utasításokat.
</span>
</div>

Ha az ingyenes csomagot használod, akkor egyszerűen adj hozzá egy új DNS <strong class="notranslate">TXT</strong> rekordot az alábbi példák közül egy vagy több felhasználásával:

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Egyszerű példa:</strong> Ha azt szeretném, hogy a `linus@example.com` vagy `torvalds@example.com` címre érkező összes e-mail a `user@gmail.com` címre kerüljön át:
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Név/Gép/Álnév</th>
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
<strong>Példa a keresztnév és a vezetéknév helyettesítésére:</strong> Képzelje el, hogy az összes céges e-mail címe a `firstname.lastname@example.com` mintájú. Ha azt szeretném, hogy az összes `firstname.lastname@example.com` mintájú e-mail a `firstname.lastname@company.com` címre kerüljön át helyettesítési támogatással (<a href="https://regexr.com/66hnu" class="alert-link">teszt megtekintése a RegExr-en</a>):
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Név/Gép/Álnév</th>
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
<strong>Plusz szimbólum szűrés helyettesítési példa:</strong> Ha azt szeretném, hogy az összes `info@example.com` vagy `support@example.com` címre érkező e-mail a `user+info@gmail.com` vagy `user+support@gmail.com` címre kerüljön (helyettesítési támogatással) (<a href="https://regexr.com/66ho7" class="alert-link">teszt megtekintése a RegExr-en</a>):
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Név/Gép/Álnév</th>
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
<strong>Webhook lekérdezési karakterlánc helyettesítési példa:</strong> Talán azt szeretné, hogy az összes `example.com`-ra kerülő e-mail egy <a href="#do-you-support-webhooks" class="alert-link">webhookba</a> kerüljön, és egy "to" dinamikus lekérdezési karakterlánc-kulccsal rendelkezzen, amelynek értéke az e-mail cím felhasználónév része (<a href="https://regexr.com/66ho4" class="alert-link">teszt megtekintése a RegExr-en</a>):
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Név/Gazdagép/Álnév</th>
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
<strong>Csendes elutasítási példa:</strong> Ha azt szeretné, hogy egy adott mintázatnak megfelelő összes e-mail letiltásra kerüljön, és csendesen elutasításra kerüljön (a feladó számára úgy tűnik, mintha az üzenet sikeresen elküldésre került volna, de valójában sehová sem jut el) `250` állapotkóddal (lásd: <a href="#can-i-disable-specific-aliases" class="alert-link">Letilthatok bizonyos aliasokat</a>), akkor egyszerűen használja ugyanazt a megközelítést egyetlen felkiáltójellel "!". Ez azt jelzi a feladónak, hogy az üzenet sikeresen kézbesítették, de valójában sehová sem jutott (pl. blackhole vagy `/dev/null`).
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Név/Gép/Álnév</th>
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
<strong>Példa a lágy elutasításra:</strong> Ha azt szeretné, hogy egy adott mintának megfelelő összes e-mail letiltásra és lágy elutasításra kerüljön `421` állapotkóddal (lásd: <a href="#can-i-disable-specific-aliases" class="alert-link">Letilthatok bizonyos aliasokat</a>), akkor egyszerűen használja ugyanazt a megközelítést dupla felkiáltójellel ("!!"). Ez azt jelzi a feladónak, hogy próbálja újra elküldeni az e-mailjét, és az erre az aliasra küldött e-maileket a rendszer körülbelül 5 napig újrapróbálja, majd véglegesen elutasítja.
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Név/Gép/Álnév</th>
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
<strong>Példa a végleges elutasításra:</strong> Ha azt szeretné, hogy egy adott mintának megfelelő összes e-mail letiltásra és végleges elutasításra kerüljön `550` állapotkóddal (lásd: <a href="#can-i-disable-specific-aliases" class="alert-link">Letilthatok bizonyos aliasokat</a>), akkor egyszerűen használja ugyanazt a megközelítést egy háromszoros felkiáltójellel ("!!!"). Ez egy állandó hibát jelez a feladónak, és az e-mailek nem fognak újrapróbálkozni, hanem elutasításra kerülnek ehhez az aliashoz.
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Név/Gép/Álnév</th>
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
Kíváncsi, hogyan írjon reguláris kifejezést, vagy tesztelnie kell a helyettesítőjét? Látogasson el az ingyenes reguláris kifejezések tesztelésével foglalkozó weboldalra: <a href="https://regexr.com" class="alert-link">RegExr</a> a <a href="https://regexr.com/" class="alert-link">https://regexr.com</a>.
<span>
</span>
</div>

### Mik a kimenő SMTP-korlátai? {#what-are-your-outbound-smtp-limits}

Naponta legfeljebb 300 kimenő SMTP üzenetet küldhetünk felhasználók és domainek számára. Ez átlagosan havonta több mint 9000 e-mailt jelent. Ha túl kell lépnie ezt a mennyiséget, vagy folyamatosan nagy mennyiségű e-mailt küld, akkor kérjük, [lépjen kapcsolatba velünk](https://forwardemail.net/help).

### Szükségem van jóváhagyásra az SMTP engedélyezéséhez? {#do-i-need-approval-to-enable-smtp}

Igen, kérjük, vegye figyelembe, hogy az IP-cím hírnevének megőrzése és a kézbesítés biztosítása érdekében a Forward Email manuális felülvizsgálati folyamatot alkalmaz domainenként a kimenő SMTP-jóváhagyáshoz. Küldjön e-mailt a <support@forwardemail.net> címre, vagy nyisson egy [segítségkérés](https://forwardemail.net/help) űrlapot jóváhagyásra. Ez általában kevesebb mint 24 órát vesz igénybe, a legtöbb kérést 1-2 órán belül teljesítjük. A közeljövőben további spam-ellenőrzésekkel és riasztásokkal szeretnénk ezt a folyamatot azonnalivá tenni. Ez a folyamat biztosítja, hogy e-mailjei eljussanak a beérkező levelek mappájába, és üzenetei ne legyenek spamként megjelölve.

### Mik az SMTP-kiszolgáló konfigurációs beállításai? {#what-are-your-smtp-server-configuration-settings}

A szerverünk `smtp.forwardemail.net`, és a <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">állapotoldalunkon</a> is figyeljük.

Támogatja az IPv4 és IPv6 protokollt is, és SSL/TLS esetén a `465` és `2465`, TLS (STARTTLS) esetén pedig a `587`, `2587`, `2525` és `25` portokon keresztül érhető el.

| Jegyzőkönyv | Gazdagépnév | kikötők | IPv4 | IPv6 |
| :--------------------------------------------------------------: | ----------------------- | :-------------------------: | :----------------: | :----------------: |
| `SSL/TLS` **Előnyben részesített** | `smtp.forwardemail.net` | `465`, `2465` | :fehér_pipa_jel: | :fehér_pipa_jel: |
| `TLS` ([STARTTLS](https://wikipedia.org/wiki/Opportunistic_TLS)) | `smtp.forwardemail.net` | `587`, `2587`, `2525`, `25` | :fehér_pipa_jel: | :fehér_pipa_jel: |

| Bejelentkezés | Példa | Leírás |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Felhasználónév | `user@example.com` | Egy olyan alias e-mail címe, amely létezik a domainhez a <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Fiókom <i class="fa fa-angle-right"></i>Domainek</a> oldalon. |
| Jelszó | `************************` | Alias-specifikusan generált jelszó. |

Ahhoz, hogy kimenő e-maileket küldhessen SMTP-n keresztül, az **SMTP felhasználó** e-mail címének meg kell egyeznie egy olyan alias e-mail címével, amely létezik a domainhez a <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Saját fiók <i class="fa fa-angle-right"></i>Domains</a> oldalon – és az **SMTP jelszó** egy alias-specifikusan generált jelszónak kell lennie.

A részletes utasításokért tekintse meg a [Támogatják az SMTP-n keresztüli e-mail küldést?](#do-you-support-sending-email-with-smtp) oldalt.

### Mik az IMAP-kiszolgáló konfigurációs beállításai? {#what-are-your-imap-server-configuration-settings}

A szerverünk `imap.forwardemail.net`, és a <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">állapotoldalunkon</a> is figyeljük.

Támogatja mind az IPv4-et, mind az IPv6-ot, és a `993` és `2993` portokon keresztül érhető el SSL/TLS esetén.

| Jegyzőkönyv | Gazdagépnév | kikötők | IPv4 | IPv6 |
| :---------------------: | ----------------------- | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **Előnyben részesített** | `imap.forwardemail.net` | `993`, `2993` | :fehér_pipa_jel: | :fehér_pipa_jel: |

| Bejelentkezés | Példa | Leírás |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Felhasználónév | `user@example.com` | Egy olyan alias e-mail címe, amely létezik a domainhez a <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Fiókom <i class="fa fa-angle-right"></i>Domainek</a> oldalon. |
| Jelszó | `************************` | Alias-specifikusan generált jelszó. |

Az IMAP-on keresztüli csatlakozáshoz az **IMAP felhasználó** mezőben a <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Saját fiók <i class="fa fa-angle-right"></i> Domains</a> oldalon található domainhez tartozó alias e-mail címének kell lennie – az **IMAP jelszó** pedig egy alias-specifikusan generált jelszó.

A részletes utasításokért tekintse meg a [Támogatja az IMAP-on keresztüli e-mail fogadást?](#do-you-support-receiving-email-with-imap) oldalt.

### Mik a POP3-kiszolgáló konfigurációs beállításai? {#what-are-your-pop3-server-configuration-settings}

A szerverünk `pop3.forwardemail.net`, és a <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">állapotoldalunkon</a> is figyeljük.

Támogatja mind az IPv4-et, mind az IPv6-ot, és a `995` és `2995` portokon keresztül érhető el SSL/TLS esetén.

| Jegyzőkönyv | Gazdagépnév | kikötők | IPv4 | IPv6 |
| :---------------------: | ----------------------- | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **Előnyben részesített** | `pop3.forwardemail.net` | `995`, `2995` | :fehér_pipa_jel: | :fehér_pipa_jel: |

| Bejelentkezés | Példa | Leírás |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Felhasználónév | `user@example.com` | Egy olyan alias e-mail címe, amely létezik a domainhez a <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Fiókom <i class="fa fa-angle-right"></i>Domainek</a> oldalon. |
| Jelszó | `************************` | Alias-specifikusan generált jelszó. |

A POP3 protokollhoz való csatlakozáshoz a **POP3 felhasználó** e-mail címének meg kell egyeznie egy olyan alias e-mail címével, amely létezik a domainhez a <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Fiókom <i class="fa fa-angle-right"></i>Domainek</a> menüpontban – az **IMAP jelszó** pedig egy alias-specifikusan generált jelszó kell, hogy legyen.

A részletes utasításokért tekintse meg a [Támogatja a POP3-at?](#do-you-support-pop3) oldalt.

### Postfix SMTP-továbbító konfiguráció {#postfix-smtp-relay-configuration}

A Postfix beállítható úgy, hogy az e-maileket a Forward Email SMTP-szerverein keresztül továbbítsa. Ez hasznos olyan szerveralkalmazások számára, amelyeknek e-maileket kell küldeniük.

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
Ehhez fizetős csomag szükséges, engedélyezett SMTP hozzáféréssel.
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

2. A telepítés során válassza az „Internetes oldal” lehetőséget, amikor a rendszer kéri a konfiguráció típusát.

#### konfiguráció {#configuration}

1. Szerkessze a fő Postfix konfigurációs fájlt:

```bash
sudo nano /etc/postfix/main.cf
```

2. Adja hozzá vagy módosítsa ezeket a beállításokat:

```
# SMTP relay configuration
relayhost = [smtp.forwardemail.net]:587
smtp_use_tls = yes
smtp_sasl_auth_enable = yes
smtp_sasl_password_maps = hash:/etc/postfix/sasl_passwd
smtp_sasl_security_options = noanonymous
smtp_tls_CAfile = /etc/ssl/certs/ca-certificates.crt
```

3. Hozza létre a SASL jelszófájlt:

```bash
sudo nano /etc/postfix/sasl_passwd
```

4. Adja meg az e-mail továbbítási hitelesítő adatait:

```
[smtp.forwardemail.net]:587 your-alias@yourdomain.com:your-generated-password
```

5. Biztosítsa és hashelje a jelszófájlt:

```bash
sudo chmod 600 /etc/postfix/sasl_passwd
sudo postmap /etc/postfix/sasl_passwd
```

6. Indítsa újra a Postfixet:

```bash
sudo systemctl restart postfix
```

#### Tesztelés {#testing}

Tesztelje a konfigurációt egy teszt e-mail küldésével:

```bash
echo "Test email body" | mail -s "Test Subject" recipient@example.com
```

## Biztonság {#security}

### Speciális szervervédelmi technikák {#advanced-server-hardening-techniques}

> \[!TIP]
> Tudjon meg többet biztonsági infrastruktúránkról a [a Biztonság oldalunkon](/security) oldalon.

A Forward Email számos szerverbiztonsági technikát alkalmaz infrastruktúránk és az Ön adatainak biztonságának garantálása érdekében:

1. **Hálózati biztonság**:
* Szigorú szabályokkal rendelkező IP-táblázatok tűzfala
* Fail2ban a brute force védelemért
* Rendszeres biztonsági auditok és penetrációs tesztelés
* Csak VPN-en keresztüli adminisztrátori hozzáférés

2. **Rendszerbiztonság**:
* Minimális csomagtelepítés
* Rendszeres biztonsági frissítések
* SELinux kényszerített módban
* Letiltott root SSH hozzáférés
* Csak kulcsalapú hitelesítés

3. **Alkalmazásbiztonság**:
* Tartalombiztonsági szabályzat (CSP) fejlécek
* HTTPS szigorú átviteli biztonság (HSTS)
* XSS védelmi fejlécek
* Keretbeállítások és hivatkozó szabályzat fejlécek
* Rendszeres függőségi auditok

4. **Adatvédelem**:
* Teljes lemeztitkosítás LUKS-szal
* Biztonságos kulcskezelés
* Rendszeres biztonsági mentések titkosítással
* Adatminimalizálási gyakorlatok

5. **Monitoring és reagálás**:
* Valós idejű behatolásérzékelés
* Automatizált biztonsági szkennelés
* Központosított naplózás és elemzés
* Incidensekre adott válaszadási eljárások

> \[!IMPORTANT]
> Biztonsági gyakorlatunkat folyamatosan frissítjük, hogy kezelni tudjuk az újonnan felmerülő fenyegetéseket és sebezhetőségeket.

> \[!TIP]
> A maximális biztonság érdekében azt javasoljuk, hogy szolgáltatásunkat végponttól végpontig terjedő titkosítással, OpenPGP-n keresztül használja.

### Rendelkezik SOC 2 vagy ISO 27001 tanúsítvánnyal? {#do-you-have-soc-2-or-iso-27001-certifications}

> \[!NOTE]
> A Forward Email tanúsított alfeldolgozók által biztosított infrastruktúrán működik az iparági szabványoknak való megfelelés biztosítása érdekében.

A Forward Email nem rendelkezik közvetlenül SOC 2 Type II vagy ISO 27001 tanúsítvánnyal. A szolgáltatás azonban tanúsított alfeldolgozók által biztosított infrastruktúrán működik:

* **DigitalOcean**: SOC 2 Type II és SOC 3 Type II tanúsítvánnyal rendelkezik (a Schellman & Company LLC auditálta), ISO 27001 tanúsítvánnyal rendelkezik több adatközpontban. Részletek: <https://www.digitalocean.com/trust/certification-reports>

* **Vultr**: SOC 2+ (HIPAA) tanúsítvánnyal rendelkezik, ISO/IEC tanúsítványok: 20000-1:2018, 27001:2022, 27017:2015, 27018:2019. Részletek: <https://www.vultr.com/legal/compliance/>

* **DataPacket**: SOC 2 kompatibilis (a tanúsítvány beszerzéséhez forduljon közvetlenül a DataPackethez), vállalati szintű infrastruktúra-szolgáltató (denveri helyszín). Részletek: <https://www.datapacket.com/datacenters/denver>

A Forward Email az iparági legjobb biztonsági audit gyakorlatokat követi, és rendszeresen együttműködik független biztonsági kutatókkal. Forrás: <https://forwardemail.net/technical-whitepaper.pdf#page=36>

### Használ TLS titkosítást az e-mail továbbításhoz? {#do-you-use-tls-encryption-for-email-forwarding}

Igen. A Forward Email szigorúan kikényszeríti a TLS 1.2+ használatát minden kapcsolatnál (HTTPS, SMTP, IMAP, POP3), és MTA-STS-t alkalmaz a fokozott TLS-támogatás érdekében. A megvalósítás a következőket tartalmazza:

* TLS 1.2+ kényszerítés minden e-mail kapcsolathoz
* ECDHE (Elliptic Curve Diffie-Hellman Ephemeral) kulcscsere a tökéletes továbbítási titkosságért
* Modern titkosítócsomagok rendszeres biztonsági frissítésekkel
* HTTP/2 támogatás a jobb teljesítmény és biztonság érdekében
* HSTS (HTTP Strict Transport Security) előre telepítve a főbb böngészőkben
* **MTA-STS (Mail Transfer Agent Strict Transport Security)** a szigorú TLS kényszerítésért

Forrás: <IDEIGLEN_HELYTARTÓS_0

**MTA-STS implementáció**: A Forward Email szigorú MTA-STS betartatást valósít meg a kódbázisban. Amikor TLS hibák történnek, és az MTA-STS betartatásra kerül, a rendszer 421 SMTP állapotkódot ad vissza, hogy az e-maileket később újrapróbálják elküldeni, ahelyett, hogy nem biztonságosan kézbesítenék őket. Implementáció részletei:

* TLS hibaészlelés: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-tls-error.js>
* MTA-STS kényszerítés a küldő e-mail segédben: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/send-email.js>

Harmadik fél általi ellenőrzés: A <https://www.hardenize.com/report/forwardemail.net/1750312779> „Jó” értékelést mutat az összes TLS és átviteli biztonsági intézkedésre.

### Megőrzi az e-mail hitelesítési fejléceket? {#do-you-preserve-email-authentication-headers}

Igen. A Forward Email átfogóan megvalósítja és megőrzi az e-mail hitelesítési fejléceket:

* **SPF (Sender Policy Framework)**: Megfelelően megvalósítva és megőrizve
* **DKIM (DomainKeys Identified Mail)**: Teljes körű támogatás megfelelő kulcskezeléssel
* **DMARC**: Szabályzat betartatása az SPF vagy DKIM validáción meg nem tudó e-mailek esetében
* **ARC**: Bár nem részletezve kifejezetten, a szolgáltatás tökéletes megfelelőségi pontszámai átfogó hitelesítési fejléckezelésre utalnak

Forrás: <IDEIGLEN_HELYTARTÓS_0

Érvényesítés: Az Internet.nl Mail Test 100/100-as pontszámot mutatott kifejezetten az "SPF, DKIM és DMARC" implementációra. A Hardenize értékelés megerősíti az SPF és a DMARC "Jó" értékelését: <https://www.hardenize.com/report/forwardemail.net/1750312779>

### Megőrzi az eredeti e-mail fejléceket és megakadályozza a hamisítást? {#do-you-preserve-original-email-headers-and-prevent-spoofing}

> \[!TIP]
> A Forward Email kifinomult hamisítás elleni védelmet biztosít az e-mailes visszaélések megelőzése érdekében.

A Forward Email megőrzi az eredeti e-mail fejléceket, miközben átfogó hamisítás elleni védelmet valósít meg az MX kódbázison keresztül:

* **Fejléc megőrzése**: Az eredeti hitelesítési fejlécek megmaradnak a továbbítás során.* **Hamisítás elleni védelem**: A DMARC szabályzat betartatása megakadályozza a fejléchamisítást azáltal, hogy elutasítja azokat az e-maileket, amelyek nem felelnek meg az SPF vagy DKIM ellenőrzésnek.
* **Fejléc befecskendezésének megakadályozása**: Beviteli adatok ellenőrzése és tisztítása a striptags könyvtár használatával.
* **Speciális védelem**: Kifinomult adathalászat-észlelés hamisításészleléssel, megszemélyesítés megelőzésével és felhasználói értesítési rendszerekkel.

**MX megvalósítás részletei**: Az alapvető e-mail-feldolgozási logikát az MX szerver kódbázisa kezeli, konkrétan:

* Fő MX adatkezelő: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>
* Tetszőleges e-mail szűrés (hamisítás elleni védelem): <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-arbitrary.js>

A `isArbitrary` segítő kifinomult hamisítás elleni szabályokat valósít meg, beleértve a domain-megszemélyesítés, a blokkolt kifejezések és a különféle adathalász minták észlelését.

Forrás: <IDEIGLEN_HELYTARTÓS_0

### Hogyan védekezik a spam és a visszaélések ellen? {#how-do-you-protect-against-spam-and-abuse}

A Forward Email átfogó, többrétegű védelmet valósít meg:

* **Sebességkorlátozás**: Hitelesítési kísérletekre, API végpontokra és SMTP kapcsolatokra vonatkozik.
* **Erőforrás-elkülönítés**: Felhasználók között a nagy volumenű felhasználók hatásának elkerülése érdekében.
* **DDoS-védelem**: Többrétegű védelem a DataPacket Shield rendszerével és a Cloudflare-rel.
* **Automatikus skálázás**: Dinamikus erőforrás-beállítás az igények alapján.
* **Visszaélések megelőzése**: Felhasználóspecifikus visszaélés-megelőzési ellenőrzések és hash-alapú blokkolás a rosszindulatú tartalmak esetén.
* **E-mail hitelesítés**: SPF, DKIM, DMARC protokollok fejlett adathalászat-észleléssel.

Források:

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver> (DDoS védelem részletei)
* <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/abuse-prevention-by-user-id.js>

### Tárolja az e-mail tartalmat a lemezen? {#do-you-store-email-content-on-disk}

> \[!IMPORTANT]
> Az e-mail továbbítása egy nulla tudású architektúrát használ, amely megakadályozza az e-mail tartalom lemezre írását.

* **Zero-Knowledge Architecture**: Az egyenként titkosított SQLite postaládák azt jelentik, hogy a Forward Email nem férhet hozzá az e-mailek tartalmához.
* **In-Memorie feldolgozás**: Az e-mailek feldolgozása teljes mértékben a memóriában történik, elkerülve a lemezes tárolást.
* **Nincs tartalomnaplózás**: „Nem naplózzuk és nem tároljuk az e-mailek tartalmát vagy metaadatait lemezen.”
* **Sandboxban titkosított titkosítás**: A titkosítási kulcsok soha nem tárolódnak lemezen egyszerű szövegként.

**MX kódbázis bizonyíték**: Az MX szerver teljes egészében a memóriában dolgozza fel az e-maileket anélkül, hogy a tartalmat lemezre írná. A fő e-mail-feldolgozó kezelő ezt a memórián belüli megközelítést mutatja be: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

Források:

* <https://forwardemail.net/technical-whitepaper.pdf#page=10> (Kivonat)
* <https://forwardemail.net/technical-whitepaper.pdf#page=59> (Nulla tudású részletek)
* <https://forwardemail.net/technical-whitepaper.pdf#page=21> (Tesztkörnyezetben titkosított)

### Kiszivároghat-e az e-mailek tartalma rendszerösszeomlások során? {#can-email-content-be-exposed-during-system-crashes}

Nem. A Forward Email átfogó védelmet nyújt a rendszerösszeomlással kapcsolatos adatszivárgás ellen:

* **Alapadatok kiíratása letiltva**: Megakadályozza a memória kiszivárgását összeomlások esetén.* **Swap memória letiltva**: Teljesen letiltva a swap fájlokból történő érzékeny adatok kinyerésének megakadályozása érdekében.* **Memórián belüli architektúra**: Az e-mail tartalom a feldolgozás során csak a felejtő memóriában létezik.* **Titkosítási kulcsvédelem**: A kulcsok soha nem tárolódnak a lemezen egyszerű szövegként.* **Fizikai biztonság**: A LUKS v2 titkosított lemezek megakadályozzák az adatokhoz való fizikai hozzáférést.* **USB-tároló letiltva**: Megakadályozza a jogosulatlan adatkinyerést.

**Hibakezelés rendszerhibák esetén**: Az e-mailek továbbítása a `isCodeBug` és `isTimeoutError` segédfüggvényeket használja annak biztosítására, hogy adatbázis-kapcsolati problémák, DNS-hálózati/tiltólistás problémák vagy upstream csatlakozási problémák esetén a rendszer 421-es SMTP állapotkódot adjon vissza, így biztosítva, hogy az e-mailek később újrapróbálkozzanak, ne pedig elveszjenek vagy ne legyenek elérhetőek.

Megvalósítás részletei:

* Hibabesorolás: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js>
* Időtúllépési hibakezelés az MX feldolgozásban: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

Forrás: <IDEIGLEN_HELYTARTÓS_0

### Ki férhet hozzá az e-mail infrastruktúrájához {#who-has-access-to-your-email-infrastructure}

A Forward Email átfogó hozzáférés-vezérlést alkalmaz a minimális, 2-3 fős mérnöki csapatához, szigorú 2FA-követelményekkel:

* **Szerepköralapú hozzáférés-vezérlés**: Erőforrás-alapú engedélyekkel rendelkező csapatfiókokhoz
* **Legkisebb jogosultság elve**: Minden rendszerben alkalmazva
* **Feladatok szétválasztása**: Az operatív szerepkörök között
* **Felhasználókezelés**: Különálló engedélyekkel rendelkező telepítési és devops felhasználók elkülönítése
* **Root bejelentkezés letiltva**: Megfelelően hitelesített fiókokon keresztüli hozzáférés kényszerítése
* **Szigorú 2FA**: Nincs SMS-alapú 2FA a MiTM támadások kockázata miatt - csak alkalmazásalapú vagy hardveres tokenek
* **Átfogó auditnaplózás**: Érzékeny adatok titkolásával
* **Automatizált anomáliaészlelés**: Szokatlan hozzáférési mintákhoz
* **Rendszeres biztonsági felülvizsgálatok**: Hozzáférési naplók esetében
* **Gonoszlány támadások megelőzése**: USB-tároló letiltva és egyéb fizikai biztonsági intézkedések

Források:

* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (Engedélyezési felügyelet)
* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (Hálózati biztonság)
* <https://forwardemail.net/technical-whitepaper.pdf#page=15> (Gonosz szobalány támadások megelőzése)

### Milyen infrastruktúra-szolgáltatókat vesz igénybe {#what-infrastructure-providers-do-you-use}

> \[!IMPORTANT]
> A Forward Email több, átfogó megfelelőségi tanúsítványokkal rendelkező infrastruktúra-alfeldolgozót használ.

A részletes információk a GDPR megfelelőségi oldalunkon találhatók: <https://forwardemail.net/gdpr>

**Elsődleges infrastruktúra alfeldolgozók:**

| Szolgáltató | Adatvédelmi Keretrendszer Tanúsított | GDPR megfelelőségi oldal |
| ---------------- | -------------------------------- | ----------------------------------------------- |
| **Felhőlobbanás** | ✅ Igen | <https://www.cloudflare.com/trust-hub/gdpr/> |
| **Adatcsomag** | ❌ Nem | <https://www.datapacket.com/privacy-policy> |
| **DigitalOcean** | ❌ Nem | <https://www.digitalocean.com/legal/gdpr> |
| **Vultr** | ❌ Nem | <https://www.vultr.com/legal/eea-gdpr-privacy/> |

**Részletes tanúsítványok:**

**DigitalOcean**

* SOC 2 Type II és SOC 3 Type II (Schellman & Company LLC auditálta)
* ISO 27001 tanúsítvánnyal rendelkezik több adatközpontban
* PCI-DSS kompatibilis
* CSA STAR 1. szintű tanúsítvánnyal rendelkezik
* APEC CBPR PRP tanúsítvánnyal rendelkezik
* Részletek: <https://www.digitalocean.com/trust/certification-reports>

**Vultr**

* SOC 2+ (HIPAA) tanúsítvánnyal rendelkezik
* PCI Merchant megfelelőség
* CSA STAR 1. szintű tanúsítvánnyal rendelkezik
* ISO/IEC 20000-1:2018, 27001:2022, 27017:2015, 27018:2019
* Részletek: <https://www.vultr.com/legal/compliance/>

**Adatcsomag**

* SOC 2 kompatibilis (a tanúsítvány megszerzéséhez forduljon közvetlenül a DataPackethez)
* Vállalati szintű infrastruktúra (denveri helyszín)
* DDoS védelem a Shield kiberbiztonsági rendszeren keresztül
* 24/7 technikai támogatás
* Globális hálózat 58 adatközpontban
* Részletek: <https://www.datapacket.com/datacenters/denver>

**Fizetési feldolgozók:**

* **Stripe**: Adatvédelmi keretrendszer tanúsítvánnyal rendelkezik - <https://stripe.com/legal/privacy-center>
* **PayPal**: Nem DPF tanúsítvánnyal rendelkezik - <https://www.paypal.com/uk/legalhub/privacy-full>

### Kínál adatfeldolgozási megállapodást (DPA)? {#do-you-offer-a-data-processing-agreement-dpa}

Igen, a Forward Email átfogó adatfeldolgozási megállapodást (DPA) kínál, amely aláírható vállalati szerződésünkkel együtt. A DPA másolata elérhető a következő címen: <https://forwardemail.net/dpa>

**DPA részletek:**

* Lefedi a GDPR-megfelelőséget és az EU-USA/Svájc-USA adatvédelmi pajzs keretrendszereket
* Automatikusan elfogadva a Szolgáltatási Feltételeink elfogadásakor
* A standard adatvédelmi megállapodáshoz nincs szükség külön aláírásra
* Egyedi adatvédelmi megállapodások elérhetők a vállalati licenc keretében

**GDPR megfelelőségi keretrendszer:**
Adatvédelmi nyilatkozatunk részletesen ismerteti a GDPR-nak való megfelelést, valamint a nemzetközi adatátviteli követelményeket. A teljes információ a következő címen érhető el: <https://forwardemail.net/gdpr>

Az egyedi DPA-feltételeket vagy konkrét szerződéses megállapodásokat igénylő vállalati ügyfelek ezeket a kérdéseket a **Vállalati licenc (250 USD/hó)** programunkon keresztül intézhetik.

### Hogyan kezeli az adatvédelmi incidensekről szóló értesítéseket? {#how-do-you-handle-data-breach-notifications}

> \[!NOTE]
> A Forward Email nulla tudású architektúrája jelentősen korlátozza az incidensek hatását.

* **Korlátozott adathozzáférés**: A nulla tudásalapú architektúra miatt nem férhet hozzá titkosított e-mail tartalomhoz.
* **Minimális adatgyűjtés**: Csak alapvető előfizetői információk és korlátozott IP-naplók biztonsági okokból.
* **Alfeldolgozói keretrendszerek**: A DigitalOcean és a Vultr GDPR-kompatibilis incidensekre adott válasz eljárásokat tart fenn.

**GDPR képviselői információk:**
A Forward Email a 27. cikknek megfelelően GDPR képviselőket nevezett ki:

**EU képviselő:**
Osano International Compliance Services Limited
Figyelem: LFHC
3 Dublin Landings, North Wall Quay
Dublin 1, D01C4E0

**Egyesült Királyságbeli képviselő:**
Osano UK Compliance LTD
Figyelem: LFHC
42-46 Fountain Street, Belfast
Antrim, BT1 - 5EF

Azoknak a vállalati ügyfeleknek, akik speciális adatvédelmi incidens értesítési szolgáltatási szerződéseket (SLA) igényelnek, ezeket egy **Vállalati licencszerződés** részeként kell megbeszélniük.

Források:

* <https://forwardemail.net/technical-whitepaper.pdf#page=59>
* <https://forwardemail.net/gdpr>

### Kínálnak tesztkörnyezetet? {#do-you-offer-a-test-environment}

A Forward Email technikai dokumentációja nem ír le explicit módon egy dedikált tesztkörnyezetet. A lehetséges tesztelési megközelítések azonban a következők:

* **Saját tárhely opció**: Átfogó saját tárhely funkciók tesztkörnyezetek létrehozásához
* **API interfész**: Lehetőség a konfigurációk programozott tesztelésére
* **Nyílt forráskód**: A 100%-ban nyílt forráskódú kód lehetővé teszi az ügyfelek számára a továbbítási logika vizsgálatát
* **Több domain**: Több domain támogatása lehetővé teheti a teszttartományok létrehozását

A hivatalos tesztkörnyezeti képességeket igénylő vállalati ügyfelek esetében ezt egy **Vállalati licenc** megállapodás részeként kell megbeszélni.

Forrás: <https://github.com/forwardemail/forwardemail.net> (Fejlesztési környezet részletei)

### Biztosítanak monitorozó és riasztási eszközöket? {#do-you-provide-monitoring-and-alerting-tools}

A Forward Email valós idejű felügyeletet biztosít bizonyos korlátozásokkal:

**Elérhető:**

* **Valós idejű kézbesítésfigyelés**: Nyilvánosan látható teljesítménymutatók a főbb e-mail-szolgáltatóktól
* **Automatikus riasztás**: A mérnöki csapat értesítést kap, ha a kézbesítési idő meghaladja a 10 másodpercet
* **Átlátható figyelés**: 100%-ban nyílt forráskódú figyelőrendszerek
* **Infrastruktúra-figyelés**: Automatizált anomáliadetektálás és átfogó auditnaplózás

**Korlátozások:**

* Az ügyfél felé irányuló webhookok vagy API-alapú kézbesítési állapotértesítések nincsenek explicit módon dokumentálva.

A részletes kézbesítési állapot webhookokat vagy egyéni monitorozási integrációkat igénylő vállalati ügyfelek számára ezek a funkciók **Vállalati licenc** megállapodásokon keresztül érhetők el.

Források:

* <https://forwardemail.net> (Valós idejű monitorozás megjelenítése)
* <https://github.com/forwardemail/forwardemail.net> (Monitoring megvalósítása)

### Hogyan biztosítható a magas rendelkezésre állás? {#how-do-you-ensure-high-availability}

> \[!IMPORTANT]
> A Forward Email átfogó redundanciát valósít meg több infrastruktúra-szolgáltató között.

* **Elosztott infrastruktúra**: Több szolgáltató (DigitalOcean, Vultr, DataPacket) földrajzi régiókban
* **Földrajzi terheléselosztás**: Cloudflare-alapú, geolokált terheléselosztás automatikus feladatátvétellel
* **Automatikus skálázás**: Dinamikus erőforrás-szabályozás az igények alapján
* **Többrétegű DDoS-védelem**: A DataPacket Shield rendszerén és a Cloudflare-en keresztül
* **Szerverredundancia**: Régiónként több szerver automatikus feladatátvétellel
* **Adatbázis-replikáció**: Valós idejű adatszinkronizálás több helyszínen
* **Monitoring és riasztás**: 24/7-es monitorozás automatikus incidensreagálási lehetőséggel

**Üzemidő-ígéret**: 99,9%-os+ szolgáltatás-elérhetőség átlátható monitorozással a <https://forwardemail.net> címen

Források:

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver>

### Megfelel a Nemzetvédelmi Engedélyezési Törvény (NDAA) 889. szakaszának? {#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa}

> \[!IMPORTANT]
> Az e-mail továbbítása teljes mértékben megfelel a 889. szakasznak az infrastruktúra-partnerek gondos kiválasztásának köszönhetően.

Igen, a Forward Email **megfelel a 889. szakasznak**. A Nemzetvédelmi Felhatalmazási Törvény (NDAA) 889. szakasza tiltja a kormányzati szerveknek, hogy meghatározott vállalatok (Huawei, ZTE, Hikvision, Dahua és Hytera) telekommunikációs és videomegfigyelő berendezéseit használják, vagy szerződést kössenek olyan szervezetekkel, amelyek ilyen berendezéseket használnak.

**Hogyan felel meg a 889. szakasznak az e-mail továbbítása?**

A Forward Email kizárólag két kulcsfontosságú infrastruktúra-szolgáltatóra támaszkodik, amelyek egyike sem használ a 889. szakasz által tiltott berendezéseket:

1. **Cloudflare**: Elsődleges partnerünk hálózati szolgáltatások és e-mail biztonság terén.
2. **DataPacket**: Elsődleges szolgáltatónk szerverinfrastruktúra terén (kizárólag Arista Networks és Cisco berendezéseket használva).
3. **Biztonsági mentési szolgáltatóink**: A Digital Ocean és a Vultr biztonsági mentési szolgáltatóinkról írásban is megerősítettük, hogy megfelelnek a 889. szakasz előírásainak.

**A Cloudflare kötelezettségvállalása**: A Cloudflare a harmadik félnek szóló magatartási kódexében kifejezetten kijelenti, hogy nem használ a 889. szakasz szerinti tiltott szervezetektől származó telekommunikációs berendezéseket, videomegfigyelő termékeket vagy szolgáltatásokat.

**Kormányzati felhasználási eset**: A 889-es szakasznak való megfelelésünket akkor igazolták, amikor az **USA Tengerészeti Akadémia** a Forward Email szolgáltatást választotta biztonságos e-mail-továbbítási igényeihez, és ehhez dokumentációt kellett kérnie a szövetségi megfelelőségi szabványainkról.

A kormányzati megfelelőségi keretrendszerünkkel, beleértve a tágabb szövetségi szabályozásokat is, kapcsolatos részletes információkért olvassa el átfogó esettanulmányunkat: [A szövetségi kormányzati e-mail szolgáltatás megfelel a 889. szakasznak](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)

## Rendszer és technikai részletek {#system-and-technical-details}

### Tárol e-maileket és azok tartalmát? {#do-you-store-emails-and-their-contents}

Nem, nem írunk lemezre és nem tárolunk naplókat – a [hibák kivételével](#do-you-store-error-logs) és [kimenő SMTP](#do-you-support-sending-email-with-smtp) paraméterekkel (lásd a [Adatvédelmi irányelvek](/privacy) paramétert).

Minden a memóriában és a [a forráskódunk a GitHubon található](https://github.com/forwardemail) alatt történik.

### Hogyan működik az e-mail továbbító rendszere? {#how-does-your-email-forwarding-system-work}

Az e-mail a [SMTP protokoll](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol) protokollra támaszkodik. Ez a protokoll egy szervernek küldött parancsokból áll (leggyakrabban a 25-ös porton fut). Létrejön egy kezdeti kapcsolat, majd a feladó jelzi, hogy kitől származik a levél ("MAIL FROM"), ezt követi a címzett ("RCPT TO"), végül pedig maga az e-mail fejlécei és törzse ("DATA"). Az e-mail továbbító rendszerünk folyamatát az alábbiakban ismertetjük az egyes SMTP protokollparancsokhoz viszonyítva:

* Kezdeti kapcsolat (parancsnév nélkül, pl. `telnet example.com 25`) - Ez a kezdeti kapcsolat. A [engedélyezőlista](#do-you-have-an-allowlist) listán nem szereplő feladókat a [tagadólista](#do-you-have-a-denylist) listánkkal összehasonlítjuk. Végül, ha egy feladó nincs az engedélyezőlistánkon, akkor ellenőrizzük, hogy szerepel-e a [szürkelistás](#do-you-have-a-greylist) listán.

* `HELO` – Ez egy üdvözlő üzenetet jelöl, amely a feladó teljes tartománynevét (FQDN), IP-címét vagy levélkezelő nevét azonosítja. Ez az érték hamisítható, ezért nem erre az adatra támaszkodunk, hanem a kapcsolat IP-címének fordított hostname-keresését használjuk.

* `MAIL FROM` - Ez az e-mail borítékfeladójának címét jelzi. Ha értéket adunk meg, annak érvényes RFC 5322 e-mail címnek kell lennie. Üres értékek megengedettek. Itt [ellenőrizze a visszaverődést](#how-do-you-protect-against-backscatter)-et adunk meg, és a MAIL FROM értékét is összevetjük a [tagadólista](#do-you-have-a-denylist)-vel. Végül a listán nem szereplő feladókat ellenőrizzük a sebességkorlátozás szempontjából (további információkért lásd a [Sebességkorlátozás](#do-you-have-rate-limiting) és [engedélyezőlista](#do-you-have-an-allowlist) szakaszt).

* `RCPT TO` – Ez jelzi az e-mail címzettjét/címzettjeit. Ezeknek érvényes RFC 5322 e-mail címeknek kell lenniük. Üzenetenként legfeljebb 50 borítékcímzettet engedélyezünk (ez eltér az e-mailek „Címzett” fejlécétől). Azt is ellenőrizzük, hogy érvényes [Feladó átírási sémája](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme) („SRS”) cím van-e megadva, hogy megvédjük az SRS domainnevünkkel való hamisítástól.

* `DATA` – Ez a szolgáltatásunk központi része, amely az e-maileket dolgozza fel. További információkért lásd a [Hogyan dolgozzuk fel az e-maileket továbbításhoz?](#how-do-you-process-an-email-for-forwarding) részt alább.

### Hogyan dolgozza fel az e-maileket továbbításhoz? {#how-do-you-process-an-email-for-forwarding}

Ez a szakasz a fenti [Hogyan működik az e-mail továbbító rendszered?](#how-does-your-email-forwarding-system-work) szakaszban ismertetett `DATA` SMTP protokollparancshoz kapcsolódó folyamatunkat ismerteti – ez azt jelenti, hogyan dolgozzuk fel az e-mailek fejléceit, törzsét, biztonságát, hogyan határozzuk meg, hová kell kézbesíteni az e-mailt, és hogyan kezeljük a kapcsolatokat.

1. Ha az üzenet mérete meghaladja az 50 MB-os maximális méretet, akkor a rendszer 552-es hibakóddal elutasítja.

2. Ha az üzenet nem tartalmazott „Feladó” fejlécet, vagy ha a „Feladó” fejlécben szereplő értékek bármelyike nem érvényes RFC 5322 e-mail cím volt, akkor a rendszer elutasítja az üzenetet 550-es hibakóddal.

3. Ha az üzenet több mint 25 „Received” fejlécet tartalmazott, akkor a rendszer megállapította, hogy átirányítási ciklusba ragadt, és 550-es hibakóddal elutasította.

4. Az e-mail ujjlenyomatának használatával (lásd a [Ujjlenyomatvétel](#how-do-you-determine-an-email-fingerprint) szakaszt) ellenőrizzük, hogy az üzenetet több mint 5 napja próbálták-e újraküldeni (ami megegyezik a [alapértelmezett utófix viselkedés](http://www.postfix.org/postconf.5.html#maximal_queue_lifetime) értékkel), és ha igen, akkor az 550-es hibakóddal elutasításra kerül.

5. Az e-mail szkennelésének eredményeit a [Spamkereső](https://spamscanner.net) használatával tároljuk a memóriában.

6. Ha a Spam Scanner bármilyen önkényes eredményt adott, akkor azt 554-es hibakóddal elutasítja. Az önkényes eredmények a cikk írásakor csak a GTUBE tesztet tartalmazzák. További információkért lásd a <https://spamassassin.apache.org/gtube/> bejegyzést.

7. Hibakeresési és visszaélés-megelőzési célokból a következő fejléceket adjuk hozzá az üzenethez:

* `Received` - ezt a szabványos Received fejlécet adjuk hozzá, amely tartalmazza a forrás IP-címét és gazdagépét, az átviteli típust, a TLS-kapcsolat adatait, a dátumot/időt és a címzettet.
* `X-Original-To` - az üzenet eredeti címzettje:
* Ez hasznos annak meghatározásához, hogy egy e-mail eredetileg hová lett kézbesítve (a "Received" fejlécen kívül).
* Ezt címzettenként adjuk hozzá IMAP és/vagy maszkolt továbbításkor (az adatvédelem érdekében).
* `X-Forward-Email-Website` - egy linket tartalmaz a <https://forwardemail.net> weboldalunkra
* `X-Forward-Email-Version` - a kódbázisunk `package.json` verziójából származó aktuális [SemVer](https://semver.org/) verzió.
* `X-Forward-Email-Session-ID` - egy munkamenet-azonosító érték, amelyet hibakeresési célokra használunk (csak nem termelési környezetekben érvényes).
* `X-Forward-Email-Sender` – vesszővel elválasztott lista, amely tartalmazza az eredeti boríték MAIL FROM címét (ha nem volt üres), a fordított PTR kliens FQDN-jét (ha létezik) és a feladó IP-címét.
* `X-Forward-Email-ID` – ez csak a kimenő SMTP-re vonatkozik, és a Saját fiók → E-mailek menüpontban tárolt e-mail azonosítóhoz kapcsolódik.
* `X-Original-To`0 – `X-Original-To`1 értékkel.
* `X-Original-To`2 – `X-Original-To`3 értékkel.
* `X-Original-To`4 – `X-Original-To`5 értékkel.

8. Ezután ellenőrizzük az üzenetet a [DKIM](https://en.wikipedia.org/wiki/DomainKeys_Identified_Mail), [SPF](https://en.wikipedia.org/wiki/Sender_Policy_Framework), [ARC](https://en.wikipedia.org/wiki/Authenticated_Received_Chain) és [DMARC](https://en.wikipedia.org/wiki/DMARC) értékekre vonatkozóan.

* Ha az üzenet nem sikerült a DMARC ellenőrzésen, és a domain elutasítási szabályzattal rendelkezett (pl. `p=reject` [szerepelt a DMARC szabályzatában](https://wikipedia.org/wiki/DMARC)), akkor 550-es hibakóddal elutasításra kerül. A domain DMARC szabályzata jellemzően a `_dmarc` aldomain <strong class="notranslate">TXT</strong> rekordjában található (pl. `dig _dmarc.example.com txt`).

* Ha az üzenet nem sikerült az SPF ellenőrzésen, és a domain hard fail szabályzattal rendelkezett (pl. a `-all` az SPF szabályzatban volt a `~all` helyett, vagy egyáltalán nem volt szabályzat), akkor 550-es hibakóddal elutasításra kerül. A domain SPF szabályzata jellemzően a gyökérdomain <strong class="notranslate">TXT</strong> rekordjában található (pl. `dig example.com txt`). A [levelek küldése a Gmailhez hasonlóan](#can-i-send-mail-as-in-gmail-with-this) szabályzattal kapcsolatos SPF-fel kapcsolatos további információkért lásd ezt a szakaszt.

9. Most feldolgozzuk az üzenet címzettjeit, amelyeket a `RCPT TO` parancs gyűjtött össze a fenti [Hogyan működik az e-mail továbbító rendszered?](#how-does-your-email-forwarding-system-work) szakaszban. Minden címzett esetében a következő műveleteket hajtjuk végre:

* Megkeressük a domainnév <strong class="notranslate">TXT</strong> rekordjait (a `@` szimbólum utáni részt, pl. `example.com`, ha az e-mail cím `test@example.com` volt). Például, ha a domain `example.com`, akkor DNS-keresést végzünk, például a `dig example.com txt`-et.
* Elemzünk minden olyan <strong class="notranslate">TXT</strong> rekordot, amely `forward-email=` (ingyenes csomagok) vagy `forward-email-site-verification=` (fizetős csomagok) karakterekkel kezdődik. Fontos megjegyezni, hogy mindkettőt elemezzük, hogy feldolgozhassuk az e-maileket, miközben a felhasználó csomagot frissít vagy lejjebb vált.
* Ezekből az elemzett <strong class="notranslate">TXT</strong> rekordokból átnézzük őket, hogy kinyerjük a továbbítási konfigurációt (a fenti [Hogyan kezdjem el és állítsam be az e-mail-továbbítást?](#how-do-i-get-started-and-set-up-email-forwarding) szakaszban leírtak szerint). Vegye figyelembe, hogy csak egy `forward-email-site-verification=` értéket támogatunk, és ha egynél többet adunk meg, akkor 550-es hiba történik, és a feladó visszapattanást kap ehhez a címzetthez.
* Rekurzívan végigmegyünk a kinyerett továbbítási konfiguráción, hogy meghatározzuk a globális továbbítást, a regex alapú továbbítást és az összes többi támogatott továbbítási konfigurációt – amelyeket mostantól "Továbbítási címeknek" nevezünk.
* Minden továbbítási címhez támogatunk egy rekurzív keresést (amely a megadott címen újraindítja ezt a műveletsorozatot). Ha rekurzív egyezést találunk, akkor a szülő eredményt eltávolítjuk a továbbítási címek közül, és a gyermekeket hozzáadjuk.
* A továbbítási címeket egyediség szempontjából elemezzük (mivel nem akarunk duplikátumokat küldeni egy címre, vagy további felesleges SMTP kliens kapcsolatokat létrehozni).
* Minden továbbítási címhez a domainnevet a `/v1/max-forwarded-addresses` API végpontunkhoz képest keressük (annak meghatározása érdekében, hogy a domain hány címre továbbíthat e-maileket aliasonként, pl. alapértelmezés szerint 10 – lásd a `example.com`0 szakaszt). Ha ezt a korlátot túllépjük, akkor 550-es hiba történik, és a feladó visszapattanó üzenetet kap az adott címzetthez.

* Az eredeti címzett beállításait a `example.com`1 API végpontunkhoz képest keressük, amely támogatja a fizetős felhasználók keresését (tartalékként az ingyenes felhasználók számára). Ez egy konfigurációs objektumot ad vissza a `example.com`2 (szám, pl. `example.com`3), `example.com`4 (logikai érték), `example.com`5 (logikai érték), `example.com`6 (logikai érték) és `example.com`7 (logikai érték) speciális beállításaihoz. * Ezen beállítások alapján összevetjük a Spam Scanner eredményeit, és ha bármilyen hiba történik, akkor az üzenetet 554-es hibakóddal elutasítjuk (pl. ha a `example.com`8 engedélyezve van, akkor a Spam Scanner eredményeit vírusok szempontjából ellenőrizzük). Fontos megjegyezni, hogy minden ingyenes csomag felhasználója feliratkozik a felnőtt tartalmak, az adathalászat, a futtatható fájlok és a vírusok elleni ellenőrzésekre. Alapértelmezés szerint minden fizetős csomag felhasználója is feliratkozik, de ez a konfiguráció módosítható a Beállítások oldalon egy domainhez az E-mail továbbítása irányítópulton).

10. Minden feldolgozott címzett továbbítási címéhez a következő műveleteket hajtjuk végre:

* A címet összevetjük a [tagadólista](#do-you-have-a-denylist) paraméterrel, és ha szerepelt a listában, akkor 421-es hibakód jelenik meg (ami azt jelzi a feladónak, hogy próbálkozzon újra később).
* Ha a cím egy webhook, akkor logikai értéket állítunk be a jövőbeli műveletekhez (lásd alább – hasonló webhookokat csoportosítunk, hogy egy POST kérést hozzunk létre a kézbesítéshez szükséges több helyett).
* Ha a cím egy e-mail cím, akkor a hosztot elemezzük a jövőbeli műveletekhez (lásd alább – hasonló hosztokat csoportosítunk, hogy egy kapcsolatot hozzunk létre a kézbesítéshez szükséges több egyedi kapcsolat helyett).

11. Ha nincsenek címzettek és nincsenek visszapattanások, akkor 550-es hibával válaszolunk: „Érvénytelen címzettek”.

12. Ha vannak címzettek, akkor végigmegyünk rajtuk (ugyanazon gazdagép által csoportosítva), és kézbesítjük az e-maileket. További információkért lásd a [Hogyan kezeled az e-mail kézbesítési problémákat](#how-do-you-handle-email-delivery-issues) részt alább.

* Ha bármilyen hiba történik az e-mailek küldése során, akkor azokat a memóriában tároljuk későbbi feldolgozás céljából.
* Az e-mailek küldéséből származó legalacsonyabb hibakódot (ha van ilyen) vesszük, és azt használjuk válaszkódként a `DATA` parancsra. Ez azt jelenti, hogy a kézbesítetlen e-maileket az eredeti feladó jellemzően újra megpróbálja elküldeni, míg a már kézbesített e-maileket a következő üzenetküldéskor nem küldjük el újra (mivel a [Ujjlenyomatvétel](#how-do-you-determine-an-email-fingerprint) parancsot használjuk).
* Ha nem történt hiba, akkor egy 250-es sikeres SMTP válaszállapotkódot küldünk.
* Visszapattanásnak tekintünk minden olyan kézbesítési kísérletet, amely >= 500 állapotkódot eredményez (állandó hibák).

13. Ha nem történt visszapattanás (állandó hibák), akkor a nem állandó hibák közül a legalacsonyabb hibakódú SMTP válaszállapotkódot adjuk vissza (vagy egy 250-es sikeres állapotkódot, ha nem történt hiba).

14. Ha előfordultak visszapattanások, akkor a háttérben küldünk visszapattanó e-maileket, miután a feladónak visszaküldtük a legalacsonyabb hibakódot. Ha azonban a legalacsonyabb hibakód >= 500, akkor nem küldünk visszapattanó e-maileket. Ez azért van, mert ha mégis, akkor a feladók dupla visszapattanó e-mailt kapnának (pl. egyet a kimenő MTA-juktól, például a Gmailtől – és egyet tőlünk is). További információkért lásd a [Hogyan védekezel a visszaverődés ellen?](#how-do-you-protect-against-backscatter) című részt alább.

### Hogyan kezeli az e-mail kézbesítési problémákat? {#how-do-you-handle-email-delivery-issues}

Vegye figyelembe, hogy az e-maileken csak akkor fogunk „Friendly-From” átírást végrehajtani, ha a feladó DMARC-szabályzata nem ment át, ÉS nem voltak DKIM-aláírások a „Feladó” fejléccel összhangban. Ez azt jelenti, hogy módosítjuk az üzenet „Feladó” fejlécét, beállítjuk az „X-Original-From”-ot, és beállítunk egy „Válaszcím”-et is, ha az még nem volt beállítva. A fejlécek módosítása után az üzenet ARC-pecsétjét is újra pecsételjük.

A hibaüzenetek intelligens elemzését a verem minden szintjén is használjuk – a kódunkban, a DNS-kérésekben, a Node.js belső kódjaiban, a HTTP-kérésekben (pl. a 408, 413 és 429 a 421-es SMTP-válaszkódhoz van leképezve, ha a címzett egy webhook), és a levelezőszerver válaszaiban (pl. a „defer” vagy „slowdown” válaszokat 421-es hibaként próbálja újra a rendszer).

A logikánk ál-biztos, és SSL/TLS hibák, kapcsolódási problémák és egyebek esetén is újrapróbálkozik. Az ál-biztosítás célja a kézbesítés maximalizálása minden címzett számára egy továbbítási konfiguráció esetén.

Ha a címzett egy webhook, akkor 60 másodperces időtúllépést engedélyezünk a kérés befejezéséhez, legfeljebb 3 újrapróbálkozással (tehát összesen 4 kérés hiba előtt). Fontos megjegyezni, hogy a 408-as, 413-as és 429-es hibakódokat helyesen elemezzük, és 421-es SMTP válaszkódhoz rendeljük őket.

Ellenkező esetben, ha a címzett egy e-mail cím, akkor megpróbáljuk opportunista TLS-sel elküldeni az e-mailt (a STARTTLS-t akkor próbáljuk meg használni, ha az elérhető a címzett levelezőszerverén). Ha SSL/TLS hiba történik az e-mail küldése során, akkor megpróbáljuk TLS nélkül elküldeni az e-mailt (STARTTLS használata nélkül).

Ha bármilyen DNS- vagy kapcsolódási hiba történik, akkor a `DATA` parancsnak 421-es SMTP válaszkódot küldünk vissza, ellenkező esetben, ha >= 500 szintű hibák vannak, akkor visszapattanásokat küldünk.

Ha azt észleljük, hogy egy olyan e-mail szerveren, amelyre kézbesíteni próbálunk, egy vagy több levelezési IP-címünk blokkolva van (pl. a spammerek elhalasztására használt technológia miatt), akkor egy 421-es SMTP válaszkódot küldünk a feladónak, hogy később próbálkozzon újra az üzenet elküldésével (és értesítést kapunk a problémáról, így remélhetőleg a következő próbálkozás előtt megoldhatjuk).

### Hogyan kezeli az IP-címek blokkolását? {#how-do-you-handle-your-ip-addresses-becoming-blocked}

Rendszeresen figyeljük az összes főbb DNS-tiltási listát, és ha bármelyik levelezési csere ("MX") IP-címünk szerepel egy fő tiltási listán, akkor lehetőség szerint eltávolítjuk a vonatkozó DNS A rekord körforgásos feldolgozásából, amíg a probléma meg nem oldódik.

Jelen sorok írásakor számos DNS-engedélyezőlistán is szerepelünk, és komolyan vesszük a tiltólisták figyelését. Ha bármilyen problémát észlel, mielőtt lehetőségünk lenne megoldani azokat, kérjük, írásban értesítsen minket a <support@forwardemail.net> címen.

Az IP-címeink nyilvánosan elérhetők, [további információkért lásd az alábbi részt](#what-are-your-servers-ip-addresses).

### Mik azok a postmaster címek? {#what-are-postmaster-addresses}

A téves címre küldött levelek és a nem figyelt vagy nem létező postaládákba küldött vakációs válaszüzenetek elkerülése érdekében listát vezetünk a levelező démonhoz hasonló felhasználónevekről:

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
* [és minden olyan cím, amelyre nem válaszolnak](#what-are-no-reply-addresses)

A [RFC 5320 4.6. szakasz](https://datatracker.ietf.org/doc/html/rfc5230#section-4.6) részben további információkat talál arról, hogyan használhatók az ilyen listák hatékony e-mail rendszerek létrehozásához.

### Mik azok a válasz nélküli címek? {#what-are-no-reply-addresses}

Az alábbi (kis- és nagybetűket nem megkülönböztető) e-mail felhasználónevek válasz nélküli címeknek minősülnek:

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

Ez a lista a [nyílt forráskódú projektként a GitHubon](https://github.com/forwardemail/reserved-email-addresses-list) azonosító alatt van karbantartva.

### Mik a szervered IP-címei? {#what-are-your-servers-ip-addresses}

IP-címeinket a <https://forwardemail.net/ips>. címen tesszük közzé.

### Van engedélyezőlistája? {#do-you-have-an-allowlist}

Igen, van egy [domain névkiterjesztések listája](#what-domain-name-extensions-are-allowlisted-by-default) elemünk, amely alapértelmezés szerint engedélyezőlistán szerepel, valamint egy dinamikus, gyorsítótárazott és gördülő engedélyezőlistánk, amely a [szigorú kritériumok](#what-is-your-allowlist-criteria) elemen alapul.

A fizetős csomaggal rendelkező ügyfelek összes e-mail címe, domainje és címzettje automatikusan felkerül az engedélyezőlistánkra.

### Mely domainnév-kiterjesztések vannak alapértelmezés szerint engedélyezőlistán {#what-domain-name-extensions-are-allowlisted-by-default}

A következő domainnév-kiterjesztéseket alapértelmezés szerint engedélyezőlistára helyezzük (függetlenül attól, hogy szerepelnek-e az Umbrella Népszerűségi Listán vagy sem):

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
<li class="list-inline-item"><code class="notranslate">parlament.nz</code></li>
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

Ezenkívül ezek a [márka- és vállalati legfelső szintű domainek](https://en.wikipedia.org/wiki/List_of_Internet_top-level_domains#Brand_and_corporate_top-level_domains) elemek alapértelmezés szerint engedélyezőlistán vannak (pl. `apple` a `applecard.apple` elemhez az Apple Card bankszámlakivonatainál):

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
<li class="list-inline-item"><code class="notranslate">alma</code></li>
<li class="list-inline-item"><code class="notranslate">akvarell</code></li>
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
<li class="list-inline-item"><code class="notranslate">kosárlabda</code></li>
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
<li class="list-inline-item"><code class="notranslate">kötvény</code></li>
<li class="list-inline-item"><code class="notranslate">foglalás</code></li>
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
<li class="list-inline-item"><code class="notranslate">lakókocsi</code></li>
<li class="list-inline-item"><code class="notranslate">kocsi</code></li>
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
<li class="list-inline-item"><code class="notranslate">fellegvár</code></li>
<li class="list-inline-item"><code class="notranslate">citi</code></li>
<li class="list-inline-item"><code class="notranslate">citic</code></li>
<li class="list-inline-item"><code class="notranslate">clubmed</code></li>
<li class="list-inline-item"><code class="notranslate">comcast</code></li>
<li class="list-inline-item"><code class="notranslate">commbank</code></li>
<li class="list-inline-item"><code class="notranslate">creditunion</code></li>
<li class="list-inline-item"><code class="notranslate">korona</code></li>
<li class="list-inline-item"><code class="notranslate">crs</code></li>
<li class="list-inline-item"><code class="notranslate">csc</code></li>
<li class="list-inline-item"><code class="notranslate">cuisinella</code></li>
<li class="list-inline-item"><code class="notranslate">dabur</code></li>
<li class="list-inline-item"><code class="notranslate">datsun</code></li>
<li class="list-inline-item"><code class="notranslate">kereskedő</code></li>
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
<li class="list-inline-item"><code class="notranslate">Guardian</code></li>
<li class="list-inline-item"><code class="notranslate">Gucci</code></li>
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
<li class="list-inline-item"><code class="notranslate">intel</code></li>
<li class="list-inline-item"><code class="notranslate">kód class="notranslate">intuit</code></li>
<li class="list-inline-item"><code class="notranslate">ipiranga</code></li>
<li class="list-inline-item"><code class="notranslate">iselect</code></li>
<li class="list-inline-item"><code class="notranslate">itau</code></li>
<li class="list-inline-item"><code class="notranslate">itv</code></li>
<li class="list-inline-item"><code class="notranslate">iveco</code></li>
<li class="list-inline-item"><code class="notranslate">jaguar</code></li>
<li class="list-inline-item"><code class="notranslate">java</code></li>
<li class="list-inline-item"><code class="notranslate">jcb</code></li>
<li class="list-inline-item"><code class="notranslate">jcp</code></li>
<li class="list-inline-item"><code class="notranslate">dzsip</code></li>
<li class="list-inline-item"><code class="notranslate">jpmorgan</code></li>
<li class="list-inline-item"><code class="notranslate">boróka</code></li>
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
<li class="list-inline-item"><code class="notranslate">életmód</code></li>
<li class="list-inline-item"><code class="notranslate">lilly</code></li>
<li class="list-inline-item"><code class="notranslate">lincoln</code></li>
<li class="list-inline-item"><code class="notranslate">linde</code></li>
<li class="list-inline-item"><code class="notranslate">lipsy</code></li>
<li class="list-inline-item"><code class="notranslate">lixil</code></li>
<li class="list-inline-item"><code class="notranslate">helyszín</code></li>
<li class="list-inline-item"><code class="notranslate">lotte</code></li>
<li class="list-inline-item"><code class="notranslate">lpl</code></li>
<li class="list-inline-item"><code class="notranslate">lplfinancial</code></li>
<li class="list-inline-item"><code class="notranslate">lundbeck</code></li>
<li class="list-inline-item"><code class="notranslate">lupin</code></li>
<li class="list-inline-item"><code class="notranslate">macys</code></li>
<li class="list-inline-item"><code class="notranslate">maif</code></li>
<li class="list-inline-item"><code class="notranslate">man</code></li>
<li class="list-inline-item"><code class="notranslate">mangó</code></li>
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
<li class="list-inline-item"><code class="notranslate">kölcsönös</code></li>
<li class="list-inline-item"><code class="notranslate">nadex</code></li>
<li class="list-inline-item"><code class="notranslate">országos</code></li>
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
<li class="list-inline-item"><code class="notranslate">office</code></li>
<li class="list-inline-item"><code class="notranslate">omega</code></li>
<li class="list-inline-item"><code class="notranslate">oracle</code></li>
<li class="list-inline-item"><code class="notranslate">narancs</code></li>
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
<li class="list-inline-item"><code class="notranslate">játék</code></li>
<li class="list-inline-item"><code class="notranslate">playstation</code></li>
<li class="list-inline-item"><code class="notranslate">politika</code></li>
<li class="list-inline-item"><code class="notranslate">politika</code></li>
<li class="list-inline-item"><code class="notranslate">gyakorlat</code></li>
<li class="list-inline-item"><code class="notranslate">termék</code></li>
<li class="list-inline-item"><code class="notranslate">progresszív</code></li>
<li class="list-inline-item"><code class="notranslate">gyakorlat</code></li>
<li class="list-inline-item"><code class="notranslate">gyakorlat</code></li> class="notranslate">prudenciális</code></li>
<li class="list-inline-item"><code class="notranslate">pwc</code></li>
<!--<li class="list-inline-item"><code class="notranslate">küldetés</code></li>-->
<li class="list-inline-item"><code class="notranslate">qvc</code></li>
<li class="list-inline-item"><code class="notranslate">redstone</code></li>
<li class="list-inline-item"><code class="notranslate">reliance</code></li>
<li class="list-inline-item"><code class="notranslate">rexroth</code></li>
<li class="list-inline-item"><code class="notranslate">ricoh</code></li>
<li class="list-inline-item"><code class="notranslate">rmit</code></li>
<li class="list-inline-item"><code class="notranslate">rocher</code></li>
<li class="list-inline-item"><code class="notranslate">rogers</code></li>
<li class="list-inline-item"><code class="notranslate">rwe</code></li>
<li class="list-inline-item"><code class="notranslate">biztonság</code></li>
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
<li class="list-inline-item"><code class="notranslate">fekete</code></li>
<li class="list-inline-item"><code class="notranslate">scjohnson</code></li>
<li class="list-inline-item"><code class="notranslate">pontszám</code></li>
<li class="list-inline-item"><code class="notranslate">ülés</code></li>
<li class="list-inline-item"><code class="notranslate">szenzor</code></li>
<li class="list-inline-item"><code class="notranslate">ülések</code></li>
<li class="list-inline-item"><code class="notranslate">ülések</code></li>
<li class="list-inline-item"><code class="notranslate">kódok</code></li>
<li class="list-inline-item"><code class="notranslate">varr</code></li>
<li class="list-inline-item"><code class="notranslate">hét</code></li>
<li class="list-inline-item"><code class="notranslate">sfr</code></li>
<li class="list-inline-item"><code class="notranslate">keresés</code></li>
<li class="list-inline-item"><code class="notranslate">shangrila</code></li>
<li class="list-inline-item"><code class="notranslate">éles</code></li>
<li class="list-inline-item"><code class="notranslate">shaw</code></li>
<li class="list-inline-item"><code class="notranslate">héj</code></li>
<li class="list-inline-item"><code class="notranslate">shriram</code></li>
<li class="list-inline-item"><code class="notranslate">sina</code></li>
<li class="list-inline-item"><code class="notranslate">sky</code></li>
<li class="list-inline-item"><code class="notranslate">skype</code></li>
<li class="list-inline-item"><code class="notranslate">smart</code></li>
<li class="list-inline-item"><code class="notranslate">sncf</code></li>
<li class="list-inline-item"><code class="notranslate">softbank</code></li>
<li class="list-inline-item"><code class="notranslate">sohu</code></li>
<li class="list-inline-item"><code class="notranslate">sony</code></li>
<li class="list-inline-item"><code class="notranslate">tükör</code></li>
<li class="list-inline-item"><code class="notranslate">stada</code></li>
<li class="list-inline-item"><code class="notranslate">kapcsok</code></li>
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
<li class="list-inline-item"><code class="notranslate">temacsek</code></li>
<li class="list-inline-item"><code class="notranslate">teva</code></li>
<li class="list-inline-item"><code class="notranslate">tiffany</code></li>
<li class="list-inline-item"><code class="notranslate">tjx</code></li>
<li class="list-inline-item"><code class="notranslate">toray</code></li>
<li class="list-inline-item"><code class="notranslate">toshiba</code></li>
<li class="list-inline-item"><code class="notranslate">total</code></li>
<li class="list-inline-item"><code class="notranslate">toyota</code></li>
<li class="list-inline-item"><code class="notranslate">travelchannel</code></li>
<li class="list-inline-item"><code class="notranslate">utazók</code></li>
<li class="list-inline-item"><code class="notranslate">tui</code></li>
<li class="list-inline-item"><code class="notranslate">tv-k</code></li>
<li class="list-inline-item"><code class="notranslate">ubs</code></li>
<li class="list-inline-item"><code class="notranslate">unicom</code></li>
<li class="list-inline-item"><code class="notranslate">uol</code></li>
<li class="list-inline-item"><code class="notranslate">ups</code></li>
<li class="list-inline-item"><code class="notranslate">avanguard</code></li>
<li class="list-inline-item"><code class="notranslate">verisign</code></li>
<li class="list-inline-item"><code class="notranslate">vig</code></li>
<li class="list-inline-item"><code class="notranslate">viking</code></li>
<li class="list-inline-item"><code class="notranslate">virgin</code></li>
<li class="list-inline-item"><code class="notranslate">visa</code></li>
<li class="list-inline-item"><code class="notranslate">vista</code></li>
<li class="list-inline-item"><code class="notranslate">vistaprint</code></li>
<li class="list-inline-item"><code class="notranslate">vivo</code></li>
<li class="list-inline-item"><code class="notranslate">volvo</code></li>
<li class="list-inline-item"><code class="notranslate">walmart</code></li>
<li class="list-inline-item"><code class="notranslate">walter</code></li>
<li class="list-inline-item"><code class="notranslate">időjáráscsatorna</code></li>
<li class="list-inline-item"><code class="notranslate">weber</code></li>
<li class="list-inline-item"><code class="notranslate">gát</code></li>
<li class="list-inline-item"><code class="notranslate">williamhill</code></li>
<li class="list-inline-item"><code class="notranslate">ablakok</code></li>
<li class="list-inline-item"><code class="notranslate">wme</code></li>
<li class="list-inline-item"><code class="notranslate">wolterskluwer</code></li>
<li class="list-inline-item"><code class="notranslate">erdőpart</code></li>
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

2025. március 18-tól a következő francia tengerentúli területeket is felvettük erre a listára ([ezen GitHub kérés alapján](https://github.com/forwardemail/forwardemail.net/issues/327)):

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

2025. július 8-tól a következő, Európa-specifikus országokat adtuk hozzá:

<ul class="list-inline">
<li class="list-inline-item"><code class="notranslate">ax</code></li>
<li class="list-inline-item"><code class="notranslate">bg</code></li>
<li class="list-inline-item"><code class="notranslate">a</code></li>
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

A magas spam aktivitás miatt kifejezetten kihagytuk a `cz`, `ru` és `ua` elemeket.

### Mik az engedélyezési lista kritériumai? {#what-is-your-allowlist-criteria}

Van egy statikus listánk a [alapértelmezés szerint engedélyezőlistán szereplő domainnév-kiterjesztések](#what-domain-name-extensions-are-allowlisted-by-default) elemekről – emellett egy dinamikus, gyorsítótárazott, gördülő engedélyezőlistát is fenntartunk a következő szigorú kritériumok alapján:

* A feladó gyökérdomainjének [olyan domain névkiterjesztés, amely megegyezik az ingyenes csomagunkban kínált listával](#what-domain-name-extensions-can-be-used-for-free) besorolásúnak kell lennie (a `biz` és `info` kiegészítésével). A `edu`, `gov` és `mil` részleges egyezéseit is belefoglaljuk, például a `xyz.gov.au` és a `xyz.edu.au` egyezéseket.
* A feladó gyökérdomainjének a [Esernyő Népszerűségi Lista](http://s3-us-west-1.amazonaws.com/umbrella-static/index.html "Umbrella Popularity List") ("UPL") elemzési eredményeinek első 100 000 egyedi gyökérdomainje között kell lennie.
* A feladó gyökérdomainjének az elmúlt 7 napból legalább 4-ben UPL-ekben megjelenő egyedi gyökérdomainekből származó első 50 000 találat között kell lennie (\~50%+).
* A feladó gyökérdomainje nem lehet [kategorizált](https://radar.cloudflare.com/categorization-feedback/) besorolású, mivel felnőtt tartalom vagy a Cloudflare által közzétett rosszindulatú program.
* A feladó gyökérdomainjének A vagy MX rekordokkal kell rendelkeznie. * A küldő gyökérdomainjének rendelkeznie kell A rekorddal/rekordokkal, MX rekorddal/rekordokkal, `biz`0 vagy `biz`1 minősítésű DMARC rekorddal, vagy `biz`2 vagy `biz`3 minősítésű SPF rekorddal.

Ha ez a feltétel teljesül, akkor a feladó gyökérdomainje 7 napig gyorsítótárazódik. Fontos megjegyezni, hogy az automatizált feladatunk naponta fut – ezért ez egy gördülő engedélyezőlista-gyorsítótár, amely naponta frissül.

Az automatizált feladatunk letölti az UPL memóriájában tárolt elmúlt 7 nap adatait, kicsomagolja azokat, majd a fenti szigorú kritériumok szerint elemzi a memóriában tárolt adatokat.

Az írás idején népszerű domainek, mint például a Google, a Yahoo, a Microsoft, az Amazon, a Meta, a Twitter, a Netflix, a Spotify és mások – természetesen szerepelnek.

Ha olyan feladó vagy, amely nem szerepel az engedélyezőlistánkon, akkor az első alkalommal, amikor az FQDN gyökérdomained vagy IP-címed e-mailt küld, a [korlátozott arány](#do-you-have-rate-limiting) és a [szürkelistás](#do-you-have-a-greylist) címed lesz. Fontos megjegyezni, hogy ez egy bevett gyakorlat az e-mail szabványok terén. A legtöbb e-mail szerver kliens megpróbálja újrapróbálkozni, ha sebességkorlátozási vagy szürkelistás hibát kap (pl. 421 vagy 4xx szintű hibakód).

**Fontos megjegyezni, hogy bizonyos feladók, mint például a `a@gmail.com`, `b@xyz.edu` és `c@gov.au` továbbra is lehetnek [elutasított listán](#do-you-have-a-denylist)** (pl. ha automatikusan észleljük az adott feladóktól származó spamet, adathalászatot vagy rosszindulatú programot).**

### Milyen domainnév-kiterjesztések használhatók ingyenesen {#what-domain-name-extensions-can-be-used-for-free}

2023. március 31-től új, általános spam-szabályozást léptettünk életbe felhasználóink és szolgáltatásunk védelme érdekében.

Ez az új szabály csak a következő domain névkiterjesztések használatát engedélyezi az ingyenes csomagunkban:

<ul class="list-inline">
<li class="list-inline-item"><code class="notranslate">ac</code></li>
<li class="list-inline-item"><code class="notranslate">hirdetés</code></li>
<li class="list-inline-item"><code class="notranslate">cím</code></li>
<li class="list-inline-item"><code class="notranslate">ai</code></li>
<li class="list-inline-item"><code class="notranslate">al</code></li>
<li class="list-inline-item"><code class="notranslate">am</code></li>
<li class="list-inline-item"><code class="notranslate">alkalmazás</code></li>
<li class="list-inline-item"><code class="notranslate">mint</code></li>
<li class="list-inline-item"><code class="notranslate">at</code></li>
<li class="list-inline-item"><code class="notranslate">au</code></li>
<li class="list-inline-item"><code class="notranslate">ba</code></li>
<li class="list-inline-item"><code class="notranslate">be</code></li>
<li class="list-inline-item"><code class="notranslate">br</code></li>
<li class="list-inline-item"><code class="notranslate">által</code></li>
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
<li class="list-inline-item"><code class="notranslate">dk</code></li>
<li class="list-inline-item"><code class="notranslate">ee</code></li>
<li class="list-inline-item"><code class="notranslate">es</code></li>
<li class="list-inline-item"><code class="notranslate">eu</code></li>
<li class="list-inline-item"><code class="notranslate">család</code></li>
<li class="list-inline-item"><code class="notranslate">fi</code></li>
<li class="list-inline-item"><code class="notranslate">fm</code></li>
<li class="list-inline-item"><code class="notranslate">fr</code></li>
<li class="list-inline-item"><code class="notranslate">gg</code></li>
<li class="list-inline-item"><code class="notranslate">gl</code></li>
<li class="list-inline-item"><code class="notranslate">id</code></li>
<li class="list-inline-item"><code class="notranslate">ie</code></li>
<li class="list-inline-item"><code class="notranslate">il</code></li>
<li class="list-inline-item"><code class="notranslate">im</code></li>
<li class="list-inline-item"><code class="notranslate">ban</code></li>
<li class="list-inline-item"><code class="notranslate">io</code></li>
<li class="list-inline-item"><code class="notranslate">ir</code></li>
<li class="list-inline-item"><code class="notranslate">ez</code></li>
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
<li class="list-inline-item"><code class="notranslate">nem</code></li>
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
<li class="list-inline-item"><code class="notranslate">a</code></li>-ba/-be
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

### Van szürkelistája? {#do-you-have-a-greylist}

Igen, egy nagyon laza [e-mail szürkelista](https://en.wikipedia.org/wiki/Greylisting_\(email\)) szabályzatot használunk. A szürkelista csak azokra a feladókra vonatkozik, akik nem szerepelnek az engedélyezőlistánkon, és 30 napig marad meg a gyorsítótárunkban.

Minden új küldő esetében 30 napig tárolunk egy kulcsot a Redis adatbázisunkban, amelynek értéke az első kérés érkezési időpontja. Ezután elutasítjuk az e-mailt egy 450-es újrapróbálkozási állapotkóddal, és csak 5 perc elteltével engedélyezzük az e-mail továbbítását.

Ha sikeresen vártak 5 percet ettől a kezdeti érkezési időtől számítva, akkor az e-mailjeiket elfogadjuk, és nem kapják meg ezt a 450-es állapotkódot.

A kulcs vagy az FQDN gyökérdomainjéből, vagy a küldő IP-címéből áll. Ez azt jelenti, hogy minden olyan aldomain, amely átmegy a szürkelistán, a gyökérdomain számára is átmegy, és fordítva (ezt értjük „nagyon laza” szabályzat alatt).

Például, ha egy `test.example.com` címről érkezik egy e-mail, mielőtt látnánk egy `example.com` címről érkező e-mailt, akkor a `test.example.com` és/vagy `example.com` címről érkező e-maileknek 5 percet kell várniuk a kapcsolat kezdeti érkezési idejétől számítva. Nem várjuk meg mind a `test.example.com`, mind a `example.com` címek esetében a saját 5 perces várakozási idejüket (a szürkelistázási szabályzatunk a gyökérdomain szintjén érvényes).

Vegye figyelembe, hogy a szürkelistázás nem vonatkozik a [engedélyezőlista](#do-you-have-an-allowlist) listán szereplő egyetlen feladóra sem (pl. Meta, Amazon, Netflix, Google, Microsoft a cikk írásakor).

### Van tiltólistája? {#do-you-have-a-denylist}

Igen, saját tiltólistát üzemeltetünk, amelyet automatikusan, valós időben, illetve manuálisan is frissítünk az észlelt spam és rosszindulatú tevékenységek alapján.

Óránként lekérjük az UCEPROTECT 1. szintű tiltólistájáról a <http://wget-mirrors.uceprotect.net/rbldnsd-all/dnsbl-1.uceprotect.net.gz> címen található összes IP-címet, és 7 napos lejárati idővel betápláljuk a tiltólistánkra.

A tiltólistán található feladók 421-es hibakódot kapnak (ami azt jelzi a feladónak, hogy később próbálkozzon újra), ha [nincsenek engedélyezőlistán](#do-you-have-an-allowlist).

A 421-es állapotkód 554-es állapotkód helyett történő használatával valós időben csökkenthető a potenciális téves riasztások száma, majd az üzenet a következő kísérletkor sikeresen kézbesíthető.

**Ez más levelezőszolgáltatásokkal ellentétben**, ahol ha tiltólistára kerülsz, az végleges és végleges hibát okoz. Gyakran nehéz megkérni a feladókat, hogy próbálják újra elküldeni az üzeneteket (különösen nagy szervezetek esetében), ezért ez a megközelítés nagyjából 5 napot biztosít az első e-mail-kísérlettől számítva, hogy a feladó, a címzett vagy mi közbelépjünk és orvosoljuk a problémát (a tiltólista eltávolításának kérésével).

Az összes tiltólistáról való eltávolítási kérelmet valós időben figyelik az adminisztrátorok (például azért, hogy az ismétlődő téves riasztásokat véglegesen engedélyezőlistára helyezhessék).

A tiltólistáról való eltávolítási kérelmeket a <https://forwardemail.net/denylist>. címen lehet kérni. A fizetős felhasználók tiltólistáról való eltávolítási kérelmeit azonnal feldolgozzuk, míg a nem fizető felhasználóknak meg kell várniuk, amíg az adminisztrátorok feldolgozzák a kérelmüket.

A spam vagy vírusos tartalom küldőként észlelt feladók a következő módon kerülnek fel a tiltólistára:

1. A [kezdeti üzenet ujjlenyomata](#how-do-you-determine-an-email-fingerprint) szürkelistára kerül, ha egy „megbízható” feladótól (pl. `gmail.com`, `microsoft.com`, `apple.com`) származó spam vagy tiltólistás üzenetet észlel.
* Ha a feladó engedélyezőlistán szerepelt, az üzenet 1 órán át szürkelistán van.
* Ha a feladó nincs engedélyezőlistán, az üzenet 6 órán át szürkelistán van.

2. A tiltólistás kulcsokat a feladótól és az üzenettől származó információkból elemezzük, és mindegyik kulcshoz létrehozunk (ha még nem létezik ilyen) egy számlálót, 1-gyel növeljük, és 24 órán át gyorsítótárazzuk.
* Engedélyezett feladók esetén:
* Adjunk hozzá egy kulcsot a „MAIL FROM” boríték e-mail címéhez, ha volt SPF-e vagy nem volt, és nem [egy postmaster felhasználónév](#what-are-postmaster-addresses) vagy [egy válasz nélküli felhasználónév](#what-are-no-reply-addresses) volt. * Ha a „Feladó” fejléc engedélyezőlistán szerepelt, akkor adjon hozzá egy kulcsot a „Feladó” fejlécben szereplő e-mail címhez, ha SPF-et adott, vagy DKIM-et adott át, és igazított.
* Ha a „Feladó” fejléc nem volt engedélyezőlistán, akkor adjon hozzá egy kulcsot a „Feladó” fejlécben szereplő e-mail címhez és annak gyökérelemzett domainnevéhez.
* Nem engedélyezőlistán szereplő feladók esetén:
* Adjon hozzá egy kulcsot a boríték „MAIL FROM” e-mail címéhez, ha SPF-et adott át.
* Ha a „Feladó” fejléc engedélyezőlistán szerepelt, akkor adjon hozzá egy kulcsot a „Feladó” fejlécben szereplő e-mail címhez, ha SPF-et adott, vagy DKIM-et adott át, és igazított.
* Ha a „Feladó” fejléc nem volt engedélyezőlistán, akkor adjon hozzá egy kulcsot a „Feladó” fejlécben szereplő e-mail címhez és annak gyökérelemzett domainnevéhez.
* Adjon hozzá egy kulcsot a feladó távoli IP-címéhez.
* Adjon hozzá egy kulcsot a kliens által feloldott hostname-hez a feladó IP-címéből fordított kereséssel (ha van ilyen).
* Adjon hozzá egy kulcsot a kliens által feloldott hostname gyökérdomainjéhez (ha van ilyen, és ha eltér a kliens által feloldott hostname-től). 3. Ha egy engedélyezőlistán nem szereplő feladó és kulcs számlálója eléri az 5-öt, akkor a kulcsot 30 napra tiltólistára tesszük, és e-mailt küldünk a visszaélésekkel foglalkozó csapatunknak. Ezek a számok változhatnak, és a frissítések itt jelennek meg, ahogy figyeljük a visszaéléseket.

4. Ha egy engedélyezőlistán szereplő feladó és kulcs számlálója eléri a 10-et, akkor a kulcsot 7 napra tiltólistára tesszük, és e-mailt küldünk a visszaélésekkel foglalkozó csapatunknak. Ezek a számok változhatnak, és a frissítések itt jelennek meg, ahogy figyeljük a visszaéléseket.

> **MEGJEGYZÉS:** A közeljövőben bevezetjük a reputációfigyelést. A reputációfigyelés ehelyett egy százalékos küszöbérték alapján számítja ki, hogy mikor kell egy feladót tiltólistára helyezni (szemben a fent említett alapvető számlálóval).

### Van sebességkorlátozása? {#do-you-have-rate-limiting}

A küldő átviteli sebességének korlátozása vagy a küldő IP-címére vonatkozó fordított PTR-keresésből elemzett gyökérdomain alapján történik – vagy ha ez nem hoz eredményt, akkor egyszerűen a küldő IP-címét használja. Megjegyzendő, hogy ezt a továbbiakban `Sender`-nak nevezzük.

MX szervereink napi korláttal rendelkeznek a [titkosított IMAP-tárhely](/blog/docs/best-quantum-safe-encrypted-email-service) számára fogadott bejövő levelekre vonatkozóan:

* A bejövő levelek aliasonkénti korlátozása helyett (pl. `you@yourdomain.com`) a korlátozást az alias domainneve alapján határozzuk meg (pl. `yourdomain.com`). Ez megakadályozza, hogy a `Senders` egyszerre elárassza a domain összes aliasának postaládáját.
* Általános korlátozások vonatkoznak az összes `Senders` aliasra a szolgáltatásunkban, függetlenül a címzetttől:
* Azok a `Senders` aliasok, amelyeket "megbízhatónak" tartunk, és amelyek igazságforrásként szolgálnak (pl. `gmail.com`, `microsoft.com`, `apple.com`), napi 100 GB-ra korlátozódnak.
* Azok a `Senders` aliasok, amelyek [engedélyezőlistán](#do-you-have-an-allowlist) aliasok, napi 10 GB-ra korlátozódnak.
* Az összes többi `yourdomain.com`0 alias napi 1 GB-ra és/vagy 1000 üzenetre korlátozódik. * `yourdomain.com`1 és `yourdomain.com`2 esetén napi 1 GB-os és/vagy 1000 üzenetes korlátozás van érvényben.

Az MX szerverek a sebességkorlátozás révén korlátozzák az üzenetek továbbítását egy vagy több címzettnek – de ez csak a `Senders`-ra vonatkozik, a [engedélyezőlista](#do-you-have-an-allowlist)-re nem:

* Óránként legfeljebb 100 kapcsolatot engedélyezünk `Sender` feloldott FQDN gyökértartományonként (vagy `Sender` távoli IP-címenként (ha nem áll rendelkezésre fordított PTR) és borítékcímzettenként. A sebességkorlátozás kulcsát kriptográfiai hashként tároljuk a Redis adatbázisunkban.

* Ha a rendszerünkön keresztül küld e-mailt, kérjük, győződjön meg arról, hogy minden IP-címéhez beállított fordított PTR-t (ellenkező esetben minden egyedi FQDN gyökértartomány vagy IP-cím, amelyről küld, sebességkorlátozás alá esik).

* Ne feledd, hogy ha egy népszerű rendszeren, például az Amazon SES-en keresztül küldesz, akkor nem lesznek rád vonatkozó díjkorlátozások, mivel (a cikk írásakor) az Amazon SES szerepel az engedélyezőlistánkon.

* Ha olyan domainről küldesz, mint a `test.abc.123.example.com`, akkor a sebességkorlát a `example.com` domainre lesz érvényben. Sok spammer több száz aldomaint használ a gyakori spamszűrők megkerülésére, amelyek csak az egyedi hostneveket korlátozzák az egyedi FQDN gyökérdomainekkel szemben.

* A sebességkorlátot túllépő `Senders` elemeket a rendszer 421-es hibával elutasítja.

IMAP és SMTP szervereink korlátozzák, hogy az aliasok egyszerre több mint `60` egyidejű kapcsolatot létesíthessenek.

MX szervereink korlátozzák a [nem engedélyezőlistás](#do-you-have-an-allowlist) küldőket abban, hogy 10-nél több egyidejű kapcsolatot hozzanak létre (a számláló 3 perces gyorsítótár-lejárati idővel rendelkezik, ami tükrözi a 3 perces socket-időtúllépésünket).

### Hogyan védekezel a visszaverődés ellen? {#how-do-you-protect-against-backscatter}

A rosszul irányított visszapattanó levelek vagy a visszapattanó spam (más néven „[Visszaszórás](https://en.wikipedia.org/wiki/Backscatter_\(email\)”) negatív hírnevet okozhatnak a feladó IP-címeinek.

Két lépést teszünk a visszaverődés elleni védelem érdekében, amelyeket a [Ismert spammerektől érkező levelek visszapattanásának megakadályozása](#prevent-bounces-from-known-mail-from-spammers) és a [Akadályozza meg a felesleges visszaverődéseket a visszaverődés elleni védelem érdekében](#prevent-unnecessary-bounces-to-protect-against-backscatter) szakaszokban részletesen ismertetünk.

### Ismert spammerektől érkező levelek visszapattanásának megakadályozása {#prevent-bounces-from-known-mail-from-spammers}

Óránként lekérjük a listát a [Backscatter.org](https://www.backscatterer.org/)-ból (a [UCEPROTECT](https://www.uceprotect.net/) által működtetve) a <http://wget-mirrors.uceprotect.net/rbldnsd-all/ips.backscatterer.org.gz> időpontban, és betápláljuk a Redis adatbázisunkba (előzetesen összehasonlítjuk a különbséget is; hátha eltávolítottunk olyan IP-címeket, amelyeket figyelembe kell venni).

Ha a MAIL FROM üres VAGY egyenlő (kis- és nagybetűket nem megkülönböztető) a [postamester címei](#what-are-postmaster-addresses) (az e-mailben a @ jel előtti rész) bármelyikével, akkor ellenőrizzük, hogy a feladó IP-címe megegyezik-e a listán szereplő valamelyikkel.

Ha a feladó IP-címe szerepel a listán (és nincs a [engedélyezőlista](#do-you-have-an-allowlist) listánkban), akkor 554-es hibát küldünk a `The IP ${session.remoteAddress} is blocked by https://www.backscatterer.org/index.php?target=test&ip=${session.remoteAddress}` üzenettel. Értesítést kapunk, ha egy feladó szerepel mind a Visszaszórás listáján, mind az engedélyezőlistánkon, így szükség esetén megoldhatjuk a problémát.

Az ebben a szakaszban leírt technikák a <https://www.backscatterer.org/?target=usage> helyen található „SAFE MODE” ajánlást követik, ahol csak akkor ellenőrizzük a küldő IP-címét, ha bizonyos feltételek már teljesültek.

### A felesleges visszaverődések megakadályozása a visszaverődés elleni védelem érdekében {#prevent-unnecessary-bounces-to-protect-against-backscatter}

A visszapattanó e-mailek olyan e-mailek, amelyek azt jelzik, hogy az e-mail továbbítása a címzettnek teljesen sikertelen volt, és az e-mailt nem próbálják meg újra elküldeni.

A visszapattanó levelek listájára való felkerülés gyakori oka a rosszul irányított visszapattanások vagy a visszapattanó spam, ezért néhány módon kell védekeznünk ez ellen:

1. Csak akkor küldünk üzenetet, ha >= 500 állapotkód-hiba fordul elő (amikor a továbbításra megpróbált e-mailek sikertelenek voltak, pl. a Gmail 500-as szintű hibával válaszol).

2. Csak egyszer és csak egyszer küldünk üzenetet (egy kiszámított visszapattanási ujjlenyomat-kulcsot használunk, és azt a gyorsítótárban tároljuk, hogy megakadályozzuk a duplikált küldést). A visszapattanási ujjlenyomat egy kulcs, amely az üzenet ujjlenyomata a visszapattanási cím hash-ével és a hibakóddal kombinálva). Az üzenet ujjlenyomatának kiszámításával kapcsolatos további információkért lásd a [Ujjlenyomatvétel](#how-do-you-determine-an-email-fingerprint) részt. A sikeresen elküldött visszapattanási ujjlenyomatok 7 nap után lejárnak a Redis gyorsítótárunkban.

3. Csak akkor küldünk üzenetet, ha a MAIL FROM és/vagy a From nem üres, és nem tartalmaz (kis- és nagybetűket nem megkülönböztető) [postamester felhasználónév](#what-are-postmaster-addresses) értéket (a @ jel előtti részt az e-mailben).

4. Nem küldünk üzenetet, ha az eredeti üzenet a következő fejlécek bármelyikét tartalmazta (kis- és nagybetűk megkülönböztetése nélkül):

* A `auto-submitted` fejléce, amelynek értéke nem egyenlő a `no` értékével.
* A `x-auto-response-suppress` fejléce, amelynek értéke `dr`, `autoreply`, `auto-reply`, `auto_reply` vagy `all`
* A `list-id`, `list-subscribe`, `no`0, `no`1, `no`2, `no`3, `no`4, `no`5, `no`6 vagy `no`7 fejléce (értéktől függetlenül).
* A `no`8 fejléce, amelynek értéke `no`9, `x-auto-response-suppress`0, `x-auto-response-suppress`1, `x-auto-response-suppress`2 vagy `x-auto-response-suppress`3.

5. Nem küldünk üzenetet, ha a MAIL FROM vagy a From e-mail címe `+donotreply`, `-donotreply`, `+noreply` vagy `-noreply` végződésű.

6. Nem küldünk üzenetet, ha a Feladó e-mail címe felhasználónév része `mdaemon` volt, és a kis- és nagybetűket megkülönböztető fejléc `X-MDDSN-Message` volt.

7. Nem küldünk ``multipart/report`` fejlécet, amely kis- és nagybetűket nem megkülönböztető `content-type` `fejlécet` tartalmazott.

### Hogyan lehet meghatározni egy e-mail ujjlenyomatot? {#how-do-you-determine-an-email-fingerprint}

Egy e-mail ujjlenyomatát az e-mail egyediségének meghatározására, valamint a duplikált üzenetek kézbesítésének és a [duplikált visszapattanások](#prevent-unnecessary-bounces-to-protect-against-backscatter) elküldésének megakadályozására használják.

Az ujjlenyomatot a következő lista alapján számítjuk ki:

* Kliens által feloldott FQDN hostname vagy IP-cím
* `Message-ID` fejlécérték (ha van)
* `Date` fejlécérték (ha van)
* `From` fejlécérték (ha van)
* `To` fejlécérték (ha van)
* `Cc` fejlécérték (ha van)
* `Subject` fejlécérték (ha van)
* `Body` érték (ha van)

### Átirányíthatok e-maileket a 25-östől eltérő portokra (pl. ha az internetszolgáltatóm blokkolta a 25-ös portot)? {#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25}

Igen, 2020. május 5-től bevezettük ezt a funkciót. Jelenleg a funkció domain-specifikus, nem pedig alias-specifikus. Ha alias-specifikusra van szüksége, kérjük, vegye fel velünk a kapcsolatot, hogy tájékoztasson minket igényeiről.

<div class="alert my-3 alert-danger">
<i class="fa fa-stop-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Fokozott adatvédelem:
</strong>
<span>
Ha fizetős csomagot használ (amely fokozott adatvédelmet tartalmaz), akkor kérjük, lépjen a <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Fiókom <i class="fa fa-angle-right"></i> Domainek</a> menüpontra, kattintson a domain melletti "Beállítások" gombra, majd a "Beállítások" gombra. Ha többet szeretne megtudni a fizetős csomagokról, tekintse meg az <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Árak</a> oldalunkat. Ellenkező esetben továbbra is követheti az alábbi utasításokat.
</span>
</div>

Ha az ingyenes csomagot használod, akkor egyszerűen adj hozzá egy új DNS <strong class="notranslate">TXT</strong> rekordot az alábbiak szerint, de a portot 25-ről az általad választott portra változtasd.

Például, ha azt szeretném, hogy a `example.com` címre érkező összes e-mail az alias címzettek 1337-es SMTP portjára, a 25-ös helyett kerüljön továbbításra:

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Név/Gép/Álnév</th>
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
Az egyéni porttovábbítás beállításának leggyakoribb esete, amikor az example.com címre érkező összes e-mailt az example.com címen található másik portra szeretné továbbítani, az SMTP szabvány szerinti 25-ös porttól eltérő portra. Ennek beállításához egyszerűen adja hozzá a következő <strong class="notranslate">TXT</strong> gyűjtőrekordot.
<span>
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Név/Gép/Álnév</th>
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

### Támogatja a plusz + szimbólumot a Gmail aliasokhoz? {#does-it-support-the-plus--symbol-for-gmail-aliases}

Igen, abszolút.

### Támogatja az aldoméneket? {#does-it-support-sub-domains}

Igen, feltétlenül. A név/gazdagép/alias értékének „@”, „.” vagy üres karaktere helyett egyszerűen az aldomain nevét kell használnia értékként.

Ha azt szeretné, hogy a `foo.example.com` továbbítsa az e-maileket, akkor a DNS-beállításokban név/gazdagép/alias értékként adja meg a `foo` értéket (mind az MX, mind a <strong class="notranslate">TXT</strong> rekordokhoz).

### Továbbítja ez az e-mail fejléceit? {#does-this-forward-my-emails-headers}

Igen, abszolút.

### Jól tesztelt ez a {#is-this-well-tested}}?

Igen, vannak benne [ava](https://github.com/avajs/ava)-val írt tesztek, és kódlefedettség is van.

### Átadja az SMTP válaszüzeneteket és kódokat? {#do-you-pass-along-smtp-response-messages-and-codes}

Igen, feltétlenül. Például, ha egy e-mailt küldesz a `hello@example.com` címre, és az regisztrálva van a `user@gmail.com` címre történő továbbításra, akkor a "gmail.com" SMTP-szerver SMTP-válaszüzenete és kódja fog visszaérkezni a "mx1.forwardemail.net" vagy "mx2.forwardemail.net" proxyszerver helyett.

### Hogyan előzhető meg a spammerek jelenléte, és hogyan biztosítható a jó hírnév az e-mail-továbbításban? {#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation}

Lásd a fenti [Hogyan működik az e-mail továbbító rendszered?](#how-does-your-email-forwarding-system-work), [Hogyan kezeled az e-mail kézbesítési problémákat](#how-do-you-handle-email-delivery-issues) és [Hogyan kezeled az IP-címeid blokkolását?](#how-do-you-handle-your-ip-addresses-becoming-blocked) részeket.

### Hogyan végez DNS-kereséseket a domainneveken? {#how-do-you-perform-dns-lookups-on-domain-names}

Létrehoztunk egy nyílt forráskódú szoftverprojektet, a :tangerine: [Mandarin](https://github.com/forwardemail/tangerine)-t, és ezt használjuk DNS-keresésekhez. Az alapértelmezett DNS-kiszolgálók a `1.1.1.1` és a `1.0.0.1`, a DNS-lekérdezések pedig a [DNS HTTPS-en keresztül](https://en.wikipedia.org/wiki/DNS_over_HTTPS)-on ("DoH") keresztül történnek az alkalmazási szinten.

:tangerine: A [Mandarin](https://github.com/tangerine) alapértelmezés szerint a CloudFlare adatvédelmet előtérbe helyező fogyasztói DNS-szolgáltatását használja][cloudflare-dns].

## Fiók és számlázás {#account-and-billing}

### Kínálnak pénzvisszafizetési garanciát fizetős csomagokra? {#do-you-offer-a-money-back-guarantee-on-paid-plans}

Igen! Automatikus visszatérítés történik, ha a csomag kezdetétől számított 30 napon belül frissítesz, alacsonyabb csomagra váltasz vagy lemondod a fiókodat. Ez csak az első alkalommal előfizetőkre vonatkozik.

### Ha csomagot váltok, arányosan számolják el és visszatérítik a különbözetet? {#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference}

Nem arányosítjuk és nem térítjük vissza a különbözetet csomagváltáskor. Ehelyett a meglévő csomag lejárati dátumától fennmaradó időtartamot átváltjuk az új csomag legközelebbi relatív időtartamára (hónapokra lefelé kerekítve).

Felhívjuk figyelmét, hogy ha a fizetős csomag kezdetétől számított 30 napon belül frissít vagy alacsonyabb tarifájú csomagra vált, akkor automatikusan visszatérítjük a meglévő csomag teljes összegét.

### Használhatom ezt az e-mail továbbító szolgáltatást csak „tartalék” vagy „tartalék” MX szerverként? {#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server}

Nem, ez nem ajánlott, mivel egyszerre csak egy levelezőszervert használhatsz. A tartalék megoldásokat általában soha nem próbálják újra a prioritási hibák és az MX exchange prioritás-ellenőrzését nem tartó levelezőszerverek miatt.

### Letilthatok bizonyos aliasokat {#can-i-disable-specific-aliases}

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Fontos:
</strong>
<span>
Ha fizetős csomaggal rendelkezel, akkor a <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Fiókom <i class="fa fa-angle-right"></i> Domainek</a> <i class="fa fa-angle-right"></i> Aliasok <i class="fa fa-angle-right"></i> Alias szerkesztése <i class="fa fa-angle-right"></i> Töröld a jelölést az "Aktív" jelölőnégyzetből <i class="fa fa-angle-right"></i> Folytatás menüpontban kell kiválasztanod.
</span>
</div>

Igen, egyszerűen szerkeszd a DNS <strong class="notranslate">TXT</strong> rekordodat, és az alias elé írj egy, kettő vagy három felkiáltójelet (lásd alább).

Fontos megjegyezni, hogy *érdemes* megőrizni a ":" leképezést, mivel erre szükség lesz, ha valaha is kikapcsolod ezt a funkciót (és ezt használjuk importáláshoz is, ha fizetős csomagokra frissítesz).

**Csendes elutasítás esetén (a feladó úgy tűnik, mintha az üzenet sikeresen elküldésre került volna, de valójában sehová sem jut) (állapotkód: `250`):** Ha egy alias elé "!" (egyetlen felkiáltójel) teszel, akkor a rendszer a `250` sikeres elutasítás állapotkódját adja vissza a címre küldeni próbáló feladóknak, de maguk az e-mailek sehová sem jutnak (pl. egy fekete lyukba vagy `/dev/null`-be).

**Lágy elutasítás esetén (állapotkód: `421`):** Ha egy alias elé "!!" (dupla felkiáltójel) kerül, akkor a címre üzenetet küldeni próbáló feladóknak a `421` lágy hibaállapotkódot adja vissza, és az e-maileket gyakran akár 5 napig is újrapróbálja a rendszer, mielőtt elutasítja és visszapattan.

**Kemény elutasítás esetén (`550` állapotkód):** Ha egy alias elé "!!!" (háromszoros felkiáltójel) teszel, akkor a rendszer a `550` állandó hibaállapotkódot adja vissza azoknak a feladóknak, akik erre a címre próbálnak üzenetet küldeni, és az e-mailek elutasításra kerülnek és visszapattannak.

Például, ha azt szeretném, hogy a `alias@example.com` címre érkező összes e-mail ne kerüljön át a `user@gmail.com` címre, és elutasításra kerüljön, majd visszapattanjon (pl. három felkiáltójelet használva):

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Név/Gép/Álnév</th>
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
A továbbított címzett címét átírhatod egyszerűen "nobody@forwardemail.net"-re is, ami a lenti példához hasonlóan a "nobody" címre irányítja át.
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Név/Gép/Álnév</th>
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
Ha nagyobb biztonságra van szüksége, akkor eltávolíthatja a ":user@gmail.com" (vagy ":nobody@forwardemail.net") részt is, így csak az "!!!alias" marad, ahogy az alábbi példában is látható.
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Név/Gép/Álnév</th>
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
<td><code>forward-email=!!!álnév</code></td>
</tr>
</tbody>
</table>

### Továbbíthatok e-maileket több címzettnek? {#can-i-forward-emails-to-multiple-recipients}

Igen, feltétlenül. Csak adjon meg több címzettet a <strong class="notranslate">TXT</strong> rekordjaiban.

Például, ha azt szeretném, hogy egy `hello@example.com` címre küldött e-mail továbbításra kerüljön a `user+a@gmail.com` és a `user+b@gmail.com` címre, akkor a <strong class="notranslate">TXT</strong> rekordom így nézne ki:

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Név/Gép/Álnév</th>
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

Vagy megadhatja őket két külön sorban, például így:

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Név/Gép/Álnév</th>
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

### Lehet több globális, mindent gyűjtő címzettem? {#can-i-have-multiple-global-catch-all-recipients}

Igen, megteheti. Ehhez csak több globális, mindent lefedő címzettet kell megadnia a <strong class="notranslate">TXT</strong> rekordjaiban.

Például, ha azt szeretném, hogy minden `*@example.com` címre (a csillag azt jelenti, hogy ez egy helyettesítő karakter, azaz gyűjtőcím) érkező e-mail továbbításra kerüljön a `user+a@gmail.com` és a `user+b@gmail.com` címre, akkor a <strong class="notranslate">TXT</strong> rekordom így nézne ki:

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Név/Gép/Álnév</th>
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

Vagy megadhatja őket két külön sorban, például így:

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Név/Gép/Álnév</th>
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

### Van-e maximális korlátja annak, hogy aliasonként hány e-mail címre továbbíthatok üzeneteket? {#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias}

Igen, az alapértelmezett korlát 10. Ez NEM azt jelenti, hogy csak 10 alias lehet a domainneveden. Annyi aliast használhatsz, amennyit csak szeretnél (korlátlan számú). Ez azt jelenti, hogy csak egy aliast továbbíthatsz 10 egyedi e-mail címre. Lehet `hello:user+1@gmail.com`, `hello:user+2@gmail.com`, `hello:user+3@gmail.com`, … (1-10 között) – és a `hello@example.com` címre küldött e-mailek a `user+1@gmail.com`, `user+2@gmail.com`, `user+3@gmail.com`, … (1-10 között) címekre lesznek továbbítva.

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tipp:
</strong>
<span>
Több mint 10 címzettre van szüksége aliasonként? Küldjön nekünk egy e-mailt, és örömmel megnöveljük a fióklimitjét.
</span>
</div>

### Rekurzívan továbbíthatom az e-maileket? {#can-i-recursively-forward-emails}

Igen, megteheti, de továbbra is be kell tartania a maximális korlátot. Ha a `hello:linus@example.com` és a `linus:user@gmail.com` is megvan, akkor a `hello@example.com` címre küldött e-mailek a `linus@example.com` és a `user@gmail.com` címre lesznek továbbítva. Vegye figyelembe, hogy hiba keletkezik, ha a maximális korláton túlmutató e-maileket próbál rekurzívan továbbítani.

### Regisztrálhatják vagy törölhetik az e-mail továbbítási regisztrációmat az engedélyem nélkül? {#can-people-unregister-or-register-my-email-forwarding-without-my-permission}

MX és <strong class="notranslate">TXT</strong> rekordok ellenőrzését használjuk, ezért ha hozzáadod a szolgáltatás megfelelő MX és <strong class="notranslate">TXT</strong> rekordjait, akkor regisztrált vagy. Ha eltávolítod őket, akkor a regisztrációd törlődik. A domained és a DNS-kezelésed a te tulajdonodban van, így ha valaki hozzáfér ehhez, az problémát jelent.

### Hogyhogy ingyenes? {#how-is-it-free}

A Forward Email ingyenes szintet kínál a nyílt forráskódú fejlesztés, a hatékony infrastruktúra és az opcionális fizetős csomagok kombinációján keresztül, amelyek támogatják a szolgáltatást.

Ingyenes csomagunkat a következők támogatják:

1. **Nyílt forráskódú fejlesztés**: Kódbázisunk nyílt forráskódú, ami lehetővé teszi a közösségi hozzájárulást és az átlátható működést.

2. **Hatékony infrastruktúra**: Optimalizáltuk rendszereinket, hogy minimális erőforrásokkal kezeljék az e-mail-továbbítást.

3. **Fizetős prémium csomagok**: Azok a felhasználók, akiknek további funkciókra van szükségük, például SMTP küldésre, IMAP fogadásra vagy fokozott adatvédelmi beállításokra, fizetős csomagjainkra fizetnek elő.

4. **Ésszerű használati korlátok**: Az ingyenes csomag méltányos használatra vonatkozó szabályzattal rendelkezik a visszaélések megelőzése érdekében.

> \[!NOTE]
> Elkötelezettek vagyunk aziránt, hogy az alapvető e-mail-továbbítást ingyenesen tartsuk, miközben prémium funkciókat kínálunk a haladóbb igényű felhasználók számára.

> \[!TIP]
> Ha hasznosnak találja szolgáltatásunkat, érdemes lehet fizetős csomagra váltani a folyamatos fejlesztés és karbantartás támogatása érdekében.

### Mi a maximális e-mail méretkorlát? {#what-is-the-max-email-size-limit}

Alapértelmezés szerint 50 MB-os méretkorlátot alkalmazunk, amely magában foglalja a tartalmat, a fejléceket és a mellékleteket. Fontos megjegyezni, hogy az olyan szolgáltatások, mint a Gmail és az Outlook, csak 25 MB-os méretkorlátot engedélyeznek, és ha túllépi ezt a korlátot, amikor ezeknek a szolgáltatóknak a címeire küld üzenetet, hibaüzenetet kap.

A fájlméret-korlát túllépése esetén a rendszer megfelelő válaszkóddal ellátott hibát ad vissza.

### Tárolnak naplókat az e-mailekről? {#do-you-store-logs-of-emails}

Nem, nem írunk lemezre és nem tárolunk naplókat – a [hibák kivételével](#do-you-store-error-logs) és [kimenő SMTP](#do-you-support-sending-email-with-smtp) paraméterekkel (lásd a [Adatvédelmi irányelvek](/privacy) paramétert).

Minden a memóriában és a [a forráskódunk a GitHubon található](https://github.com/forwardemail) alatt történik.

### Tárolja a hibanaplókat? {#do-you-store-error-logs}

**Igen. A hibanaplókat a [Fiókom → Naplók](/my-account/logs) vagy a [Fiókom → Domainek](/my-account/domains) alatt érheti el.**

2023 februárjától a `4xx` és `5xx` SMTP válaszkódokhoz tartozó hibanaplókat 7 napig tároljuk – ezek tartalmazzák az SMTP hibát, a borítékot és az e-mail fejléceket (az e-mail törzsét és a mellékleteket **nem** tároljuk).

A hibanaplók lehetővé teszik a hiányzó fontos e-mailek ellenőrzését és a [a domainjeid](/my-account/domains) esetében a spam téves riasztások mérséklését. Nagyszerű forrást jelentenek a [e-mail webhookok](#do-you-support-webhooks)-gyel kapcsolatos problémák hibakereséséhez is (mivel a hibanaplók tartalmazzák a webhook végpontjának válaszát).

A [sebességkorlátozás](#do-you-have-rate-limiting) és [szürkelistás](#do-you-have-a-greylist) hibanaplói nem érhetők el, mivel a kapcsolat korán véget ér (pl. mielőtt a `RCPT TO` és `MAIL FROM` parancsok továbbíthatók lennének).

További információkért lásd a [Adatvédelmi irányelvek](/privacy) oldalunkat.

### Olvasod az e-mailjeimet? {#do-you-read-my-emails}

Nem, egyáltalán nem. Lásd a [Adatvédelmi irányelvek](/privacy). pontot.

Sok más e-mail-továbbító szolgáltatás tárolja és potenciálisan el is tudja olvasni az e-mailjeidet. Nincs ok arra, hogy a továbbított e-maileket lemezen kell tárolni – ezért alkottuk meg az első nyílt forráskódú megoldást, amely mindezt a memóriában végzi.

Úgy gondoljuk, hogy jogod van a magánélethez, és ezt szigorúan tiszteletben is tartjuk. A szerverre telepített kód a [nyílt forráskódú szoftver a GitHubon](https://github.com/forwardemail) az átláthatóság és a bizalomépítés érdekében.

### Küldhetek e-mailt más néven a Gmailben ezzel a {#can-i-send-mail-as-in-gmail-with-this}_ ...

Igen! 2018. október 2-án hozzáadtuk ezt a funkciót. Lásd a fenti [Hogyan küldjünk levelet Gmail-ben más néven?](#how-to-send-mail-as-using-gmail) bejegyzést!

A DNS-konfigurációban a TXT rekordban is be kell állítania a Gmail SPF rekordját.

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Fontos:
</strong>
<span>
Ha Gmailt (pl. E-mail küldése más néven) vagy G Suite-ot használ, akkor hozzá kell fűznie az <code>include:_spf.google.com</code> címet az SPF <strong class="notranslate">TXT</strong> rekordjához, például:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
</span>
</div>

### Elküldhetem a levelet más néven az Outlookban ezzel a {#can-i-send-mail-as-in-outlook-with-this}} paraméterrel?

Igen! 2018. október 2-án hozzáadtuk ezt a funkciót. Ehhez egyszerűen tekintse meg az alábbi két linket a Microsofttól:

* <https://support.office.com/en-us/article/add-or-remove-an-email-alias-in-outlook-com-459b1989-356d-40fa-a689-8f285b13f1f2>
* <https://support.office.com/en-us/article/send-email-from-a-different-address-in-outlook-com-ccba89cb-141c-4a36-8c56-6d16a8556d2e>

A DNS-konfigurációban a <strong class="notranslate">TXT</strong> rekordban is be kell állítania az Outlook SPF-rekordját.

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Fontos:
</strong>
<span>
Ha Microsoft Outlookot vagy Live.com-ot használ, akkor hozzá kell fűznie az <code>include:spf.protection.outlook.com</code> címet az SPF <strong class="notranslate">TXT</strong> rekordjához, például:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:spf.protection.outlook.com -all</code>
</span>
</div>

### Elküldhetem-e a levelet más néven az Apple Mailben és az iCloud Mailben ezzel a {#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this}} fiókkal?

Ha előfizető az iCloud+ szolgáltatásra, használhat egyéni domaint. [Szolgáltatásunk az Apple Mail-lel is kompatibilis.](#apple-mail).

További információkért lásd: <https://support.apple.com/en-us/102540>

### Átküldhetek korlátlan számú e-mailt ezzel a {#can-i-forward-unlimited-emails-with-this}} címmel

Igen, azonban a „viszonylag ismeretlen” feladók esetében a kapcsolatok száma óránként maximum 100-ra korlátozódik hosztnevenként vagy IP-címenként. Lásd a fenti [Sebességkorlátozás](#do-you-have-rate-limiting) és [Szürkelistás](#do-you-have-a-greylist) szakaszt.

A „viszonylag ismeretlen” kifejezés alatt azokat a feladókat értjük, akik nem szerepelnek a [engedélyezőlista](#do-you-have-an-allowlist) mezőben.

Ha ezt a korlátot túllépik, egy 421-es válaszkódot küldünk, amely jelzi a küldő levelezőszerverének, hogy később próbálkozzon újra.

### Korlátlan számú domaint kínálnak egyetlen árért? {#do-you-offer-unlimited-domains-for-one-price}

Igen. Függetlenül attól, hogy melyik csomagot választja, csak egy havi díjat kell fizetnie – amely az összes domainjét lefedi.

### Milyen fizetési módokat fogad el? {#which-payment-methods-do-you-accept}

A Forward Email a következő egyszeri vagy havi/negyedéves/éves fizetési módokat fogadja el:

1. **Hitel-/betéti kártyák/banki átutalások**: Visa, Mastercard, American Express, Discover, JCB, Diners Club stb.
2. **PayPal**: Csatlakoztasd PayPal-fiókodat az egyszerű fizetéshez.
3. **Kriptovaluta**: Elfogadjuk a Stripe stabilérme-fizetéseit az Ethereum, Polygon és Solana hálózatokon.

> \[!NOTE]
> Korlátozott fizetési információkat tárolunk szervereinken, amelyek csak a fizetési azonosítókat, valamint a [Csík](https://stripe.com/global) és [PayPal](https://www.paypal.com) tranzakció-, ügyfél-, előfizetés- és fizetési azonosítókra való hivatkozásokat tartalmazzák.

> \[!TIP]
> A maximális adatvédelem érdekében érdemes kriptovalutával fizetni.

Minden fizetés biztonságosan történik Stripe-on vagy PayPal-on keresztül. A fizetési adataidat soha nem tároljuk a szervereinken.

## További források {#additional-resources}

> \[!TIP]
> Az alábbi cikkeink rendszeresen frissülnek új útmutatókkal, tippekkel és technikai információkkal. Látogasson vissza gyakran a legújabb tartalomért.

* [Esettanulmányok és fejlesztői dokumentáció](/blog/docs)
* [Erőforrás](/resources)
* [Útmutatók](/guides)

[gmail-2fa]: IDEIGLENES_HELYTARTOZÓ_0

[cloudflare-dns]: https://blog.cloudflare.com/announcing-1111/