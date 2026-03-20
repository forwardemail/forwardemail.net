# Často kladené otázky {#frequently-asked-questions}

<img loading="lazy" src="/img/articles/faq.webp" alt="Forward Email často kladené otázky" class="rounded-lg" />


## Obsah {#table-of-contents}

* [Rychlý start](#quick-start)
* [Úvod](#introduction)
  * [Co je Forward Email](#what-is-forward-email)
  * [Kdo používá Forward Email](#who-uses-forward-email)
  * [Jaká je historie Forward Email](#what-is-forward-emails-history)
  * [Jak rychlá je tato služba](#how-fast-is-this-service)
* [Emailoví klienti](#email-clients)
  * [Thunderbird](#thunderbird)
  * [Microsoft Outlook](#microsoft-outlook)
  * [Apple Mail](#apple-mail)
  * [eM Client](#em-client)
  * [Mobilní zařízení](#mobile-devices)
  * [Konfigurace Sendmail SMTP Relay](#sendmail-smtp-relay-configuration)
  * [Konfigurace Exim4 SMTP Relay](#exim4-smtp-relay-configuration)
  * [Konfigurace msmtp SMTP klienta](#msmtp-smtp-client-configuration)
  * [Emailoví klienti příkazové řádky](#command-line-email-clients)
  * [Konfigurace emailu ve Windows](#windows-email-configuration)
  * [Konfigurace Postfix SMTP Relay](#postfix-smtp-relay-configuration)
  * [Jak odesílat poštu jako pomocí Gmail](#how-to-send-mail-as-using-gmail)
  * [Co je starý bezplatný průvodce pro Send Mail As pomocí Gmail](#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail)
  * [Pokročilá konfigurace směrování Gmail](#advanced-gmail-routing-configuration)
  * [Pokročilá konfigurace směrování Outlook](#advanced-outlook-routing-configuration)
* [Řešení problémů](#troubleshooting)
  * [Proč nedostávám své testovací emaily](#why-am-i-not-receiving-my-test-emails)
  * [Jak nakonfigurovat emailového klienta pro práci s Forward Email](#how-do-i-configure-my-email-client-to-work-with-forward-email)
  * [Proč moje emaily končí ve spamu a jak mohu zkontrolovat reputaci mé domény](#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation)
  * [Co mám dělat, když dostávám spamové emaily](#what-should-i-do-if-i-receive-spam-emails)
  * [Proč jsou moje testovací emaily zaslané sobě v Gmail označeny jako "podezřelé"](#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious)
  * [Mohu odstranit "via forwardemail dot net" v Gmail](#can-i-remove-the-via-forwardemail-dot-net-in-gmail)
* [Správa dat](#data-management)
  * [Kde jsou vaše servery umístěny](#where-are-your-servers-located)
  * [Jak exportovat a zálohovat svou poštovní schránku](#how-do-i-export-and-backup-my-mailbox)
  * [Jak importovat a migrovat svou stávající poštovní schránku](#how-do-i-import-and-migrate-my-existing-mailbox)
  * [Jak používat vlastní S3-kompatibilní úložiště pro zálohy](#how-do-i-use-my-own-s3-compatible-storage-for-backups)
  * [Jak převést SQLite zálohy na EML soubory](#how-do-i-convert-sqlite-backups-to-eml-files)
  * [Podporujete self-hosting](#do-you-support-self-hosting)
* [Konfigurace emailu](#email-configuration)
  * [Jak začít a nastavit přeposílání emailů](#how-do-i-get-started-and-set-up-email-forwarding)
  * [Mohu použít více MX výměn a serverů pro pokročilé přeposílání](#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding)
  * [Jak nastavit automatickou odpověď na dovolenou (out of office auto-responder)](#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder)
  * [Jak nastavit SPF pro Forward Email](#how-do-i-set-up-spf-for-forward-email)
  * [Jak nastavit DKIM pro Forward Email](#how-do-i-set-up-dkim-for-forward-email)
  * [Jak nastavit DMARC pro Forward Email](#how-do-i-set-up-dmarc-for-forward-email)
  * [Jak zobrazit DMARC zprávy](#how-do-i-view-dmarc-reports)
  * [Jak připojit a nakonfigurovat kontakty](#how-do-i-connect-and-configure-my-contacts)
  * [Jak připojit a nakonfigurovat kalendáře](#how-do-i-connect-and-configure-my-calendars)
  * [Jak přidat více kalendářů a spravovat stávající kalendáře](#how-do-i-add-more-calendars-and-manage-existing-calendars)
  * [Jak připojit a nakonfigurovat úkoly a připomínky](#how-do-i-connect-and-configure-tasks-and-reminders)
  * [Proč nemohu vytvářet úkoly v macOS Připomínkách](#why-cant-i-create-tasks-in-macos-reminders)
  * [Jak nastavit Tasks.org na Androidu](#how-do-i-set-up-tasksorg-on-android)
  * [Jak nastavit SRS pro Forward Email](#how-do-i-set-up-srs-for-forward-email)
  * [Jak nastavit MTA-STS pro Forward Email](#how-do-i-set-up-mta-sts-for-forward-email)
  * [Jak přidat profilový obrázek k mé emailové adrese](#how-do-i-add-a-profile-picture-to-my-email-address)
* [Pokročilé funkce](#advanced-features)
  * [Podporujete newslettery nebo mailing listy pro marketingové emaily](#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email)
  * [Podporujete odesílání emailů přes API](#do-you-support-sending-email-with-api)
  * [Podporujete příjem emailů přes IMAP](#do-you-support-receiving-email-with-imap)
  * [Podporujete POP3](#do-you-support-pop3)
  * [Podporujete kalendáře (CalDAV)](#do-you-support-calendars-caldav)
  * [Podporujete úkoly a připomínky (CalDAV VTODO)](#do-you-support-tasks-and-reminders-caldav-vtodo)
  * [Podporujete kontakty (CardDAV)](#do-you-support-contacts-carddav)
  * [Podporujete odesílání emailů přes SMTP](#do-you-support-sending-email-with-smtp)
  * [Podporujete OpenPGP/MIME, end-to-end šifrování ("E2EE") a Web Key Directory ("WKD")](#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd)
  * [Podporujete S/MIME šifrování](#do-you-support-smime-encryption)
  * [Podporujete Sieve filtrování emailů](#do-you-support-sieve-email-filtering)
  * [Podporujete MTA-STS](#do-you-support-mta-sts)
  * [Podporujete passkeys a WebAuthn](#do-you-support-passkeys-and-webauthn)
  * [Podporujete nejlepší praktiky emailu](#do-you-support-email-best-practices)
  * [Podporujete bounce webhooks](#do-you-support-bounce-webhooks)
  * [Podporujete webhooks](#do-you-support-webhooks)
  * [Podporujete regulární výrazy nebo regex](#do-you-support-regular-expressions-or-regex)
  * [Jaké jsou vaše limity pro odchozí SMTP](#what-are-your-outbound-smtp-limits)
  * [Potřebuji schválení pro povolení SMTP](#do-i-need-approval-to-enable-smtp)
  * [Jaká jsou nastavení konfigurace vašeho SMTP serveru](#what-are-your-smtp-server-configuration-settings)
  * [Jaká jsou nastavení konfigurace vašeho IMAP serveru](#what-are-your-imap-server-configuration-settings)
  * [Jaká jsou nastavení konfigurace vašeho POP3 serveru](#what-are-your-pop3-server-configuration-settings)
  * [Jak nastavit autodiscovery emailu pro mou doménu](#how-do-i-set-up-email-autodiscovery-for-my-domain)
* [Bezpečnost](#security-1)
  * [Pokročilé techniky zpevnění serveru](#advanced-server-hardening-techniques)
  * [Máte certifikace SOC 2 nebo ISO 27001](#do-you-have-soc-2-or-iso-27001-certifications)
  * [Používáte TLS šifrování pro přeposílání emailů](#do-you-use-tls-encryption-for-email-forwarding)
  * [Zachováváte hlavičky autentizace emailu](#do-you-preserve-email-authentication-headers)
  * [Zachováváte původní hlavičky emailu a zabraňujete spoofingu](#do-you-preserve-original-email-headers-and-prevent-spoofing)
  * [Jak chráníte proti spamu a zneužití](#how-do-you-protect-against-spam-and-abuse)
  * [Ukládáte obsah emailů na disk](#do-you-store-email-content-on-disk)
  * [Může být obsah emailu vystaven při havárii systému](#can-email-content-be-exposed-during-system-crashes)
  * [Kdo má přístup k vaší emailové infrastruktuře](#who-has-access-to-your-email-infrastructure)
  * [Jaké poskytovatele infrastruktury používáte](#what-infrastructure-providers-do-you-use)
  * [Nabízíte smlouvu o zpracování dat (DPA)](#do-you-offer-a-data-processing-agreement-dpa)
  * [Jak řešíte oznámení o narušení dat](#how-do-you-handle-data-breach-notifications)
  * [Nabízíte testovací prostředí](#do-you-offer-a-test-environment)
  * [Poskytujete nástroje pro monitorování a upozornění](#do-you-provide-monitoring-and-alerting-tools)
  * [Jak zajišťujete vysokou dostupnost](#how-do-you-ensure-high-availability)
  * [Jste v souladu s oddílem 889 zákona o národní obraně (NDAA)](#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa)
* [Systémové a technické detaily](#system-and-technical-details)
  * [Ukládáte emaily a jejich obsah](#do-you-store-emails-and-their-contents)
  * [Jak funguje váš systém přeposílání emailů](#how-does-your-email-forwarding-system-work)
  * [Jak zpracováváte email pro přeposílání](#how-do-you-process-an-email-for-forwarding)
  * [Jak řešíte problémy s doručením emailů](#how-do-you-handle-email-delivery-issues)
  * [Jak řešíte blokování vašich IP adres](#how-do-you-handle-your-ip-addresses-becoming-blocked)
  * [Co jsou adresy postmaster](#what-are-postmaster-addresses)
  * [Co jsou adresy no-reply](#what-are-no-reply-addresses)
  * [Jaké jsou IP adresy vašich serverů](#what-are-your-servers-ip-addresses)
  * [Máte allowlist](#do-you-have-an-allowlist)
  * [Jaké doménové přípony jsou ve výchozím nastavení na allowlistu](#what-domain-name-extensions-are-allowlisted-by-default)
  * [Jaká jsou kritéria pro váš allowlist](#what-is-your-allowlist-criteria)
  * [Jaké doménové přípony lze používat zdarma](#what-domain-name-extensions-can-be-used-for-free)
  * [Máte greylist](#do-you-have-a-greylist)
  * [Máte denylist](#do-you-have-a-denylist)
  * [Máte omezení rychlosti (rate limiting)](#do-you-have-rate-limiting)
  * [Jak chráníte proti backscatter](#how-do-you-protect-against-backscatter)
  * [Zabraňujete bounce od známých spammerů MAIL FROM](#prevent-bounces-from-known-mail-from-spammers)
  * [Zabraňujete zbytečným bounce pro ochranu proti backscatter](#prevent-unnecessary-bounces-to-protect-against-backscatter)
  * [Jak určujete otisk emailu (email fingerprint)](#how-do-you-determine-an-email-fingerprint)
  * [Mohu přeposílat emaily na porty jiné než 25 (např. pokud můj ISP zablokoval port 25)](#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25)
  * [Podporuje to symbol plus + pro Gmail aliasy](#does-it-support-the-plus--symbol-for-gmail-aliases)
  * [Podporuje to subdomény](#does-it-support-sub-domains)
  * [Přeposílá to hlavičky mého emailu](#does-this-forward-my-emails-headers)
  * [Je to dobře otestované](#is-this-well-tested)
  * [Přenášíte SMTP odpovědi a kódy](#do-you-pass-along-smtp-response-messages-and-codes)
  * [Jak zabraňujete spammerům a zajišťujete dobrou reputaci přeposílání emailů](#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation)
  * [Jak provádíte DNS dotazy na doménová jména](#how-do-you-perform-dns-lookups-on-domain-names)
* [Účet a fakturace](#account-and-billing)
  * [Nabízíte záruku vrácení peněz u placených plánů](#do-you-offer-a-money-back-guarantee-on-paid-plans)
  * [Pokud přejdu na jiný plán, provádíte poměrné vrácení peněz](#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference)
  * [Mohu používat tuto službu přeposílání emailů jako "fallback" nebo "fallover" MX server](#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server)
  * [Mohu zakázat konkrétní aliasy](#can-i-disable-specific-aliases)
  * [Mohu přeposílat emaily na více příjemců](#can-i-forward-emails-to-multiple-recipients)
  * [Mohu mít více globálních catch-all příjemců](#can-i-have-multiple-global-catch-all-recipients)
  * [Existuje maximální limit počtu emailových adres, na které mohu přeposílat za alias](#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias)
  * [Mohu přeposílat emaily rekurzivně](#can-i-recursively-forward-emails)
  * [Mohou lidé odregistrovat nebo registrovat mé přeposílání emailů bez mého svolení](#can-people-unregister-or-register-my-email-forwarding-without-my-permission)
  * [Jak je to zdarma](#how-is-it-free)
  * [Jaký je maximální limit velikosti emailu](#what-is-the-max-email-size-limit)
  * [Ukládáte logy emailů](#do-you-store-logs-of-emails)
  * [Ukládáte logy chyb](#do-you-store-error-logs)
  * [Čtete mé emaily](#do-you-read-my-emails)
  * [Mohu "odesílat poštu jako" v Gmail s tímto](#can-i-send-mail-as-in-gmail-with-this)
  * [Mohu "odesílat poštu jako" v Outlook s tímto](#can-i-send-mail-as-in-outlook-with-this)
  * [Mohu "odesílat poštu jako" v Apple Mail a iCloud Mail s tímto](#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this)
  * [Mohu přeposílat neomezené množství emailů s tímto](#can-i-forward-unlimited-emails-with-this)
  * [Nabízíte neomezené domény za jednu cenu](#do-you-offer-unlimited-domains-for-one-price)
  * [Jaké způsoby platby přijímáte](#which-payment-methods-do-you-accept)
* [Další zdroje](#additional-resources)
## Rychlý start {#quick-start}

Pro začátek s Forward Email:

1. **Vytvořte si účet** na [forwardemail.net/register](https://forwardemail.net/register)

2. **Přidejte a ověřte svou doménu** v [Můj účet → Domény](/my-account/domains)

3. **Přidejte a nakonfigurujte e-mailové aliasy/schránky** v [Můj účet → Domény](/my-account/domains) → Aliasy

4. **Otestujte své nastavení** odesláním e-mailu na jeden z vašich nových aliasů

> \[!TIP]
> Změny DNS mohou trvat až 24-48 hodin, než se globálně projeví, i když často se projeví mnohem dříve.

> \[!IMPORTANT]
> Pro lepší doručitelnost doporučujeme nastavit záznamy [SPF](#how-do-i-set-up-spf-for-forward-email), [DKIM](#how-do-i-set-up-dkim-for-forward-email) a [DMARC](#how-do-i-set-up-dmarc-for-forward-email).


## Úvod {#introduction}

### Co je Forward Email {#what-is-forward-email}

> \[!NOTE]
> Forward Email je ideální pro jednotlivce, malé firmy a vývojáře, kteří chtějí profesionální e-mailové adresy bez nákladů a údržby plnohodnotného e-mailového hostingu.

Forward Email je **plnohodnotný poskytovatel e-mailových služeb** a **poskytovatel e-mailového hostingu pro vlastní domény**.

Je to jediná bezplatná a open-source služba, která vám umožní používat e-mailové adresy s vlastní doménou bez složitosti nastavování a správy vlastního e-mailového serveru.

Naše služba přeposílá e-maily zaslané na vaši vlastní doménu do vašeho stávajícího e-mailového účtu – a můžete nás dokonce používat jako svého dedikovaného poskytovatele e-mailového hostingu.

Klíčové vlastnosti Forward Email:

* **E-mail s vlastní doménou**: Používejte profesionální e-mailové adresy s vlastní doménou
* **Bezplatná úroveň**: Základní přeposílání e-mailů zdarma
* **Zvýšené soukromí**: Nečteme vaše e-maily ani neprodáváme vaše data
* **Open Source**: Celý náš kód je dostupný na GitHubu
* **Podpora SMTP, IMAP a POP3**: Plné možnosti odesílání a přijímání e-mailů
* **End-to-End šifrování**: Podpora OpenPGP/MIME
* **Vlastní catch-all aliasy**: Vytvářejte neomezené množství e-mailových aliasů

Můžete nás porovnat s více než 56 dalšími poskytovateli e-mailových služeb na [naší stránce srovnání e-mailů](/blog/best-email-service).

> \[!TIP]
> Více o Forward Email se dozvíte v našem bezplatném [Technickém whitepaperu](/technical-whitepaper.pdf)

### Kdo používá Forward Email {#who-uses-forward-email}

Poskytujeme e-mailový hosting a službu přeposílání e-mailů pro více než 500 000 domén a tyto významné uživatele:

| Zákazník                                | Případová studie                                                                                          |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| U.S. Naval Academy                       | [:page_facing_up: Případová studie](/blog/docs/federal-government-email-service-section-889-compliant)   |
| Canonical                                | [:page_facing_up: Případová studie](/blog/docs/canonical-ubuntu-email-enterprise-case-study)             |
| Netflix Games                            |                                                                                                          |
| The Linux Foundation                     | [:page_facing_up: Případová studie](/blog/docs/linux-foundation-email-enterprise-case-study)             |
| The PHP Foundation                       |                                                                                                          |
| Fox News Radio                           |                                                                                                          |
| Disney Ad Sales                          |                                                                                                          |
| jQuery                                   | [:page_facing_up: Případová studie](/blog/docs/linux-foundation-email-enterprise-case-study)             |
| LineageOS                                |                                                                                                          |
| Ubuntu                                   | [:page_facing_up: Případová studie](/blog/docs/canonical-ubuntu-email-enterprise-case-study)             |
| Kubuntu                                  | [:page_facing_up: Případová studie](/blog/docs/canonical-ubuntu-email-enterprise-case-study)             |
| Lubuntu                                  | [:page_facing_up: Případová studie](/blog/docs/canonical-ubuntu-email-enterprise-case-study)             |
| The University of Cambridge              | [:page_facing_up: Případová studie](/blog/docs/alumni-email-forwarding-university-case-study)            |
| The University of Maryland               | [:page_facing_up: Případová studie](/blog/docs/alumni-email-forwarding-university-case-study)            |
| The University of Washington             | [:page_facing_up: Případová studie](/blog/docs/alumni-email-forwarding-university-case-study)            |
| Tufts University                         | [:page_facing_up: Případová studie](/blog/docs/alumni-email-forwarding-university-case-study)            |
| Swarthmore College                       | [:page_facing_up: Případová studie](/blog/docs/alumni-email-forwarding-university-case-study)            |
| Government of South Australia            |                                                                                                          |
| Government of Dominican Republic         |                                                                                                          |
| Fly<span>.</span>io                      |                                                                                                          |
| RCD Hotels                               |                                                                                                          |
| Isaac Z. Schlueter (npm)                 | [:page_facing_up: Případová studie](/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem) |
| David Heinemeier Hansson (Ruby on Rails) |                                                                                                          |
### Jaká je historie Forward Email {#what-is-forward-emails-history}

Více o Forward Email se můžete dozvědět na [naší stránce O nás](/about).

### Jak rychlá je tato služba {#how-fast-is-this-service}

> \[!NOTE]
> Náš systém je navržen pro rychlost a spolehlivost, s několika redundantními servery, které zajišťují, že vaše e-maily jsou doručeny okamžitě.

Forward Email doručuje zprávy s minimálním zpožděním, obvykle během několika sekund od přijetí.

Výkonnostní metriky:

* **Průměrná doba doručení**: Méně než 5-10 sekund od přijetí po přeposlání ([viz naše stránka monitorování Čas do schránky "TTI"](/tti))
* **Dostupnost služby**: 99,9 %+
* **Globální infrastruktura**: Servery strategicky umístěné pro optimální směrování
* **Automatické škálování**: Náš systém se škáluje během špiček v e-mailovém provozu

Pracujeme v reálném čase, na rozdíl od jiných poskytovatelů, kteří spoléhají na zpožděné fronty.

Nezapisujeme na disk ani neukládáme logy – s [výjimkou chyb](#do-you-store-error-logs) a [odchozího SMTP](#do-you-support-sending-email-with-smtp) (viz naše [Zásady ochrany osobních údajů](/privacy)).

Vše probíhá v paměti a [náš zdrojový kód je na GitHubu](https://github.com/forwardemail).


## E-mailoví klienti {#email-clients}

### Thunderbird {#thunderbird}

1. Vytvořte nový alias a vygenerujte heslo ve vašem Forward Email dashboardu
2. Otevřete Thunderbird a přejděte na **Úpravy → Nastavení účtu → Akce účtu → Přidat e-mailový účet**
3. Zadejte své jméno, Forward Email adresu a heslo
4. Klikněte na **Konfigurovat ručně** a zadejte:
   * Příchozí: IMAP, `imap.forwardemail.net`, port 993, SSL/TLS
   * Odchozí: SMTP, `smtp.forwardemail.net`, port 465, SSL/TLS (doporučeno; port 587 s STARTTLS je také podporován)
5. Klikněte na **Hotovo**

### Microsoft Outlook {#microsoft-outlook}

1. Vytvořte nový alias a vygenerujte heslo ve vašem Forward Email dashboardu
2. Přejděte na **Soubor → Přidat účet**
3. Zadejte svou Forward Email adresu a klikněte na **Připojit**
4. Zvolte **Pokročilé možnosti** a vyberte **Nechte mě nastavit účet ručně**
5. Vyberte **IMAP** a zadejte:
   * Příchozí: `imap.forwardemail.net`, port 993, SSL
   * Odchozí: `smtp.forwardemail.net`, port 465, SSL/TLS (doporučeno; port 587 s STARTTLS je také podporován)
   * Uživatelské jméno: Vaše celá e-mailová adresa
   * Heslo: Vámi vygenerované heslo
6. Klikněte na **Připojit**

### Apple Mail {#apple-mail}

1. Vytvořte nový alias a vygenerujte heslo ve vašem Forward Email dashboardu
2. Přejděte na **Mail → Předvolby → Účty → +**
3. Vyberte **Jiný e-mailový účet**
4. Zadejte své jméno, Forward Email adresu a heslo
5. Pro nastavení serveru zadejte:
   * Příchozí: `imap.forwardemail.net`
   * Odchozí: `smtp.forwardemail.net`
   * Uživatelské jméno: Vaše celá e-mailová adresa
   * Heslo: Vámi vygenerované heslo
6. Klikněte na **Přihlásit se**

### eM Client {#em-client}

1. Vytvořte nový alias a vygenerujte heslo ve vašem Forward Email dashboardu
2. Otevřete eM Client a přejděte na **Menu → Účty → + Přidat účet**
3. Klikněte na **Mail** a poté vyberte **Jiný**
4. Zadejte svou Forward Email adresu a klikněte na **Další**
5. Zadejte následující nastavení serveru:
   * **Příchozí server**: `imap.forwardemail.net`
   * **Odchozí server**: `smtp.forwardemail.net`
6. Zadejte svou celou e-mailovou adresu jako **Uživatelské jméno** a vámi vygenerované heslo jako **Heslo** pro oba servery.
7. eM Client otestuje připojení. Po úspěšném testu klikněte na **Další**.
8. Zadejte své jméno a vyberte název účtu.
9. Klikněte na **Dokončit**.

### Mobilní zařízení {#mobile-devices}

Pro iOS:

1. Přejděte na **Nastavení → Mail → Účty → Přidat účet → Jiný**
2. Klepněte na **Přidat e-mailový účet** a zadejte své údaje
3. Pro nastavení serveru použijte stejná nastavení IMAP a SMTP jako výše

Pro Android:

1. Přejděte na **Nastavení → Účty → Přidat účet → Osobní (IMAP)**
2. Zadejte svou Forward Email adresu a heslo
3. Pro nastavení serveru použijte stejná nastavení IMAP a SMTP jako výše

### Konfigurace Sendmail SMTP Relay {#sendmail-smtp-relay-configuration}

Můžete nakonfigurovat Sendmail tak, aby přeposílal e-maily přes SMTP servery Forward Email. Toto je běžné nastavení pro starší systémy nebo aplikace, které spoléhají na Sendmail.
<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Odhadovaný čas nastavení:</strong>
  <span>Méně než 20 minut</span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Důležité:
  </strong>
  <span>
    Toto vyžaduje placený plán s povoleným přístupem k SMTP.
  </span>
</div>

#### Konfigurace {#configuration}

1. Upravte svůj soubor `sendmail.mc`, který se obvykle nachází v `/etc/mail/sendmail.mc`:

   ```bash
   sudo nano /etc/mail/sendmail.mc
   ```

2. Přidejte následující řádky pro definování smart hosta a autentizace:

   ```
   define(`SMART_HOST', `smtp.forwardemail.net')dnl
   define(`RELAY_MAILER_ARGS', `TCP $h 465')dnl
   define(`confAUTH_MECHANISMS', `EXTERNAL GSSAPI DIGEST-MD5 CRAM-MD5 LOGIN PLAIN')dnl
   FEATURE(`authinfo',`hash -o /etc/mail/authinfo.db')dnl
   ```

3. Vytvořte autentizační soubor `/etc/mail/authinfo`:

   ```bash
   sudo nano /etc/mail/authinfo
   ```

4. Přidejte své přihlašovací údaje Forward Email do souboru `authinfo`:

   ```
   AuthInfo:smtp.forwardemail.net "U:your-alias@yourdomain.com" "P:your-generated-password" "M:PLAIN"
   ```

5. Vygenerujte autentizační databázi a zabezpečte soubory:

   ```bash
   sudo makemap hash /etc/mail/authinfo < /etc/mail/authinfo
   sudo chmod 600 /etc/mail/authinfo /etc/mail/authinfo.db
   ```

6. Přestavte konfiguraci Sendmail a restartujte službu:

   ```bash
   sudo make -C /etc/mail
   sudo systemctl restart sendmail
   ```

#### Testování {#testing}

Pošlete testovací e-mail pro ověření konfigurace:

```bash
echo "Testovací e-mail ze Sendmailu" | mail -s "Test Sendmail" recipient@example.com
```

### Konfigurace Exim4 SMTP Relay {#exim4-smtp-relay-configuration}

Exim4 je populární MTA na systémech založených na Debianu. Můžete jej nakonfigurovat tak, aby používal Forward Email jako smarthost.

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Odhadovaný čas nastavení:</strong>
  <span>Méně než 15 minut</span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Důležité:
  </strong>
  <span>
    Toto vyžaduje placený plán s povoleným přístupem k SMTP.
  </span>
</div>

#### Konfigurace {#configuration-1}

1. Spusťte konfigurační nástroj Exim4:

   ```bash
   sudo dpkg-reconfigure exim4-config
   ```

2. Vyberte následující možnosti:
   * **Obecný typ konfigurace pošty:** pošta odesílaná přes smarthost; přijímána přes SMTP nebo fetchmail
   * **Název systémové pošty:** your.hostname
   * **IP adresy pro příjem SMTP připojení:** 127.0.0.1 ; ::1
   * **Další cíle, pro které je pošta přijímána:** (ponechat prázdné)
   * **Domény, pro které se přeposílá pošta:** (ponechat prázdné)
   * **IP adresa nebo název hostitele odchozího smarthostu:** smtp.forwardemail.net::465
   * **Skrýt lokální název pošty v odchozí poště?** Ne
   * **Minimalizovat počet DNS dotazů (Dial-on-Demand)?** Ne
   * **Metoda doručení lokální pošty:** formát Mbox v /var/mail/
   * **Rozdělit konfiguraci do malých souborů?** Ne

3. Upravte soubor `passwd.client` a přidejte své přihlašovací údaje:

   ```bash
   sudo nano /etc/exim4/passwd.client
   ```

4. Přidejte následující řádek:

   ```
   smtp.forwardemail.net:your-alias@yourdomain.com:your-generated-password
   ```

5. Aktualizujte konfiguraci a restartujte Exim4:

   ```bash
   sudo update-exim4.conf
   sudo systemctl restart exim4
   ```

#### Testování {#testing-1}

Pošlete testovací e-mail:

```bash
echo "Test z Exim4" | mail -s "Test Exim4" recipient@example.com
```

### Konfigurace SMTP klienta msmtp {#msmtp-smtp-client-configuration}

msmtp je lehký SMTP klient, který je užitečný pro odesílání e-mailů ze skriptů nebo příkazové řádky.

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Odhadovaný čas nastavení:</strong>
  <span>Méně než 10 minut</span>
</div>
<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Důležité:
  </strong>
  <span>
    Toto vyžaduje placený plán s povoleným přístupem k SMTP.
  </span>
</div>

#### Konfigurace {#configuration-2}

1. Vytvořte nebo upravte konfigurační soubor msmtp na `~/.msmtprc`:

   ```bash
   nano ~/.msmtprc
   ```

2. Přidejte následující konfiguraci:

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

3. Nastavte správná oprávnění pro konfigurační soubor:

   ```bash
   chmod 600 ~/.msmtprc
   ```

#### Testování {#testing-2}

Odešlete testovací e-mail:

```bash
echo "This is a test email from msmtp" | msmtp -a default recipient@example.com
```

### E-mailoví klienti příkazové řádky {#command-line-email-clients}

Populární e-mailoví klienti příkazové řádky jako [Mutt](https://gitlab.com/muttmua/mutt), [NeoMutt](https://neomutt.org) a [Alpine](https://alpine.x10.mx/alpine/release/) lze nakonfigurovat pro použití SMTP serverů Forward Email pro odesílání pošty. Konfigurace bude podobná nastavení `msmtp`, kde zadáte údaje o SMTP serveru a své přihlašovací údaje do příslušných konfiguračních souborů (`.muttrc`, `.neomuttrc` nebo `.pinerc`).

### Konfigurace e-mailu ve Windows {#windows-email-configuration}

Pro uživatele Windows můžete nakonfigurovat populární e-mailové klienty jako **Microsoft Outlook** a **eM Client** pomocí IMAP a SMTP nastavení poskytnutých ve vašem účtu Forward Email. Pro použití v příkazové řádce nebo skriptech můžete použít PowerShell cmdlet `Send-MailMessage` (i když je považován za zastaralý) nebo lehký SMTP relay nástroj jako [E-MailRelay](https://github.com/graeme-walker/emailrelay).

### Konfigurace Postfix SMTP relé {#postfix-smtp-relay-configuration}

Můžete nakonfigurovat Postfix tak, aby přeposílal e-maily přes SMTP servery Forward Email. To je užitečné pro serverové aplikace, které potřebují odesílat e-maily.

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Odhadovaný čas nastavení:</strong>
  <span>Méně než 15 minut</span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Důležité:
  </strong>
  <span>
    Toto vyžaduje placený plán s povoleným přístupem k SMTP.
  </span>
</div>

#### Instalace {#installation}

1. Nainstalujte Postfix na váš server:

```bash
# Ubuntu/Debian
sudo apt update && sudo apt install postfix

# CentOS/RHEL
sudo yum install postfix

# macOS
brew install postfix
```

2. Během instalace vyberte "Internet Site" při výzvě k typu konfigurace.

#### Konfigurace {#configuration-3}

1. Upravte hlavní konfigurační soubor Postfixu:

```bash
sudo nano /etc/postfix/main.cf
```

2. Přidejte nebo upravte tyto nastavení:

```
# Konfigurace SMTP relé
relayhost = [smtp.forwardemail.net]:465
smtp_tls_wrappermode = yes
smtp_tls_security_level = encrypt
smtp_sasl_auth_enable = yes
smtp_sasl_password_maps = hash:/etc/postfix/sasl_passwd
smtp_sasl_security_options = noanonymous
smtp_tls_CAfile = /etc/ssl/certs/ca-certificates.crt
```

3. Vytvořte soubor s hesly SASL:

```bash
sudo nano /etc/postfix/sasl_passwd
```

4. Přidejte své přihlašovací údaje Forward Email:

```
[smtp.forwardemail.net]:465 your-alias@yourdomain.com:your-generated-password
```

5. Zabezpečte a zahashujte soubor s hesly:

```bash
sudo chmod 600 /etc/postfix/sasl_passwd
sudo postmap /etc/postfix/sasl_passwd
```

6. Restartujte Postfix:

```bash
sudo systemctl restart postfix
```

#### Testování {#testing-3}

Otestujte konfiguraci odesláním testovacího e-mailu:

```bash
echo "Test email body" | mail -s "Test Subject" recipient@example.com
```

### Jak odesílat poštu jako pomocí Gmailu {#how-to-send-mail-as-using-gmail}
<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Odhadovaný čas nastavení:</strong>
  <span>Méně než 10 minut</span>
</div>

<div class="alert mb-3 alert-success">
  <i class="fa fa-bullhorn font-weight-bold"></i>
  <strong class="font-weight-bold">
    Začínáme:
  </strong>
  <span>
    Pokud jste postupovali podle pokynů výše v <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">Jak začít a nastavit přeposílání e-mailů</a>, můžete pokračovat ve čtení níže.
  </span>
</div>

<div id="send-mail-as-content">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Důležité:
  </strong>
  <span>
    Ujistěte se, že jste si přečetli naše <a href="/terms" class="alert-link" target="_blank">Podmínky</a>, <a href="/privacy" class="alert-link" target="_blank">Zásady ochrany osobních údajů</a> a <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Limity odchozího SMTP</a> &ndash; vaše používání je považováno za potvrzení a souhlas.
  </span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Důležité:
  </strong>
  <span>
    Pokud jste vývojář, podívejte se na naši <a class="alert-link" href="/email-api#outbound-emails" target="_blank">dokumentaci API pro e-maily</a>.
  </span>
</div>

1. Přejděte na <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Můj účet <i class="fa fa-angle-right"></i> Domény</a> <i class="fa fa-angle-right"></i> Nastavení <i class="fa fa-angle-right"></i> Konfigurace odchozího SMTP a postupujte podle pokynů pro nastavení

2. Vytvořte nový alias pro svou doménu v <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Můj účet <i class="fa fa-angle-right"></i> Domény</a> <i class="fa fa-angle-right"></i> Aliasy (např. <code><hello@example.com></code>)

3. Klikněte na <strong class="text-success"><i class="fa fa-key"></i> Vygenerovat heslo</strong> vedle nově vytvořeného aliasu. Zkopírujte do schránky a bezpečně uložte zobrazené heslo.

4. Přejděte na [Gmail](https://gmail.com) a v [Nastavení <i class="fa fa-angle-right"></i> Účty a import <i class="fa fa-angle-right"></i> Odesílat poštu jako](https://mail.google.com/mail/u/0/#settings/accounts) klikněte na "Přidat další e-mailovou adresu"

5. Když budete vyzváni k zadání "Jména", zadejte jméno, které chcete, aby se zobrazovalo jako odesílatel (např. "Linus Torvalds").

6. Když budete vyzváni k zadání "E-mailové adresy", zadejte plnou e-mailovou adresu aliasu, který jste vytvořili v <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Můj účet <i class="fa fa-angle-right"></i> Domény</a> <i class="fa fa-angle-right"></i> Aliasy (např. <code><hello@example.com></code>)

7. Zrušte zaškrtnutí "Považovat za alias"

8. Klikněte na "Další krok" pro pokračování

9. Když budete vyzváni k zadání "SMTP serveru", zadejte <code>smtp.forwardemail.net</code> a změňte port na <code>465</code>

10. Když budete vyzváni k zadání "Uživatelského jména", zadejte plnou e-mailovou adresu aliasu, který jste vytvořili v <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Můj účet <i class="fa fa-angle-right"></i> Domény</a> <i class="fa fa-angle-right"></i> Aliasy (např. <code><hello@example.com></code>)

11. Když budete vyzváni k zadání "Hesla", vložte heslo z <strong class="text-success"><i class="fa fa-key"></i> Vygenerovat heslo</strong> z kroku 3 výše

12. Vyberte možnost "Zabezpečené připojení pomocí SSL"

13. Klikněte na "Přidat účet" pro pokračování

14. Otevřete novou kartu na [Gmail](https://gmail.com) a počkejte na příchod ověřovacího e-mailu (obdržíte ověřovací kód, který potvrzuje, že jste vlastníkem e-mailové adresy, ze které se pokoušíte odesílat poštu)

15. Jakmile dorazí, zkopírujte a vložte ověřovací kód do výzvy, kterou jste obdrželi v předchozím kroku
16. Jakmile to uděláte, vraťte se do e-mailu a klikněte na odkaz „potvrdit žádost“. Pravděpodobně budete muset provést tento krok i předchozí krok, aby byl e-mail správně nakonfigurován.

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Gratulujeme!
    </strong>
    <span>
      Úspěšně jste dokončili všechny kroky.
    </span>
  </div>
</div>

</div>

### Co je to legacy free průvodce pro Send Mail As pomocí Gmailu {#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail}

<div class="alert my-3 alert-danger"><i class="fa fa-stop-circle font-weight-bold"></i> <strong class="font-weight-bold">Důležité:</strong> Tento legacy free průvodce je od května 2023 zastaralý, protože <a class="alert-link" href="/faq#do-you-support-sending-email-with-smtp">nyní podporujeme odchozí SMTP</a>. Pokud použijete níže uvedený průvodce, <a class="alert-link" href="/faq#can-i-remove-the-via-forwardemail-dot-net-in-gmail">způsobí to, že váš odchozí e-mail</a> bude v Gmailu zobrazovat „<span class="notranslate text-danger font-weight-bold">via forwardemail dot net</span>“.</a></div>

<div class="alert mb-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Odhadovaný čas nastavení:</strong>
  <span>Méně než 10 minut</span>
</div>

<div class="alert mb-3 alert-success">
  <i class="fa fa-bullhorn font-weight-bold"></i>
  <strong class="font-weight-bold">
    Začínáme:
  </strong>
  <span>
    Pokud jste postupovali podle pokynů výše v části <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">Jak začít a nastavit přeposílání e-mailů</a>, můžete pokračovat ve čtení níže.
  </span>
</div>

<div class="mx-auto lazyframe lazyframe-bordered border border-themed mb-3" data-vendor="youtube_nocookie" title="Jak odesílat poštu jako pomocí Gmailu" data-src="https://www.youtube-nocookie.com/embed/MEheS8gM4Xs?autoplay=0"></div>

<div id="legacy-free-guide">

1. Musíte mít povolenou [dvojfaktorovou autentizaci Gmailu][gmail-2fa], aby to fungovalo. Navštivte <https://www.google.com/landing/2step/>, pokud ji nemáte povolenou.

2. Jakmile je dvojfaktorová autentizace povolena (nebo pokud ji již máte povolenou), navštivte <https://myaccount.google.com/apppasswords>.

3. Když budete vyzváni k „Výběru aplikace a zařízení, pro které chcete vygenerovat heslo aplikace“:
   * Vyberte „Mail“ v rozbalovacím seznamu „Vyberte aplikaci“
   * Vyberte „Jiné“ v rozbalovacím seznamu „Vyberte zařízení“
   * Když budete vyzváni k zadání textu, zadejte e-mailovou adresu vaší vlastní domény, ze které přeposíláte (např. <code><hello@example.com></code> – pomůže vám to sledovat, pokud tuto službu používáte pro více účtů)

4. Zkopírujte heslo, které se automaticky vygeneruje, do schránky
   <div class="alert my-3 alert-warning">
     <i class="fa fa-exclamation-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Důležité:
     </strong>
     <span>
       Pokud používáte G Suite, navštivte svůj administrátorský panel <a class="alert-link" href="https://admin.google.com/AdminHome#ServiceSettings/service=email&subtab=filters" rel="noopener noreferrer" target="_blank">Aplikace <i class="fa fa-angle-right"></i> G Suite <i class="fa fa-angle-right"></i> Nastavení pro Gmail <i class="fa fa-angle-right"></i> Nastavení</a> a ujistěte se, že je zaškrtnuto „Povolit uživatelům odesílat poštu přes externí SMTP server...“. Aktivace této změny může chvíli trvat, proto prosím počkejte několik minut.
     </span>
   </div>

5. Přejděte na [Gmail](https://gmail.com) a v [Nastavení <i class="fa fa-angle-right"></i> Účty a import <i class="fa fa-angle-right"></i> Odesílat poštu jako](https://mail.google.com/mail/u/0/#settings/accounts) klikněte na „Přidat další e-mailovou adresu“

6. Když budete vyzváni k zadání „Jména“, zadejte jméno, které chcete, aby se zobrazovalo jako odesílatel (např. „Linus Torvalds“)

7. Když budete vyzváni k zadání „E-mailové adresy“, zadejte e-mailovou adresu s vlastní doménou, kterou jste použili výše (např. <code><hello@example.com></code>)
8. Zrušte zaškrtnutí "Treat as an alias"

9. Klikněte na "Next Step" pro pokračování

10. Když budete vyzváni k zadání "SMTP Server", zadejte <code>smtp.gmail.com</code> a ponechte port jako <code>587</code>

11. Když budete vyzváni k zadání "Username", zadejte část své Gmailové adresy bez části <span>gmail.com</span> (např. jen "user", pokud je můj e-mail <span><user@gmail.com></span>)
    <div class="alert my-3 alert-primary">
      <i class="fa fa-info-circle font-weight-bold"></i>
      <strong class="font-weight-bold">
        Důležité:
      </strong>
      <span>
        Pokud je část "Username" automaticky vyplněna, pak <u><strong>ji budete muset změnit</strong></u> na uživatelskou část vaší Gmailové adresy.
      </span>
    </div>

12. Když budete vyzváni k zadání "Password", vložte ze schránky heslo, které jste vygenerovali v kroku 2 výše

13. Nechte zaškrtnutou volbu "Secured connection using TLS"

14. Klikněte na "Add Account" pro pokračování

15. Otevřete novou kartu na [Gmail](https://gmail.com) a počkejte na příchod ověřovacího e-mailu (obdržíte ověřovací kód, který potvrzuje, že jste vlastníkem e-mailové adresy, ze které se pokoušíte "Send Mail As")

16. Jakmile dorazí, zkopírujte a vložte ověřovací kód do výzvy, kterou jste obdrželi v předchozím kroku

17. Poté se vraťte k e-mailu a klikněte na odkaz pro "confirm the request". Pravděpodobně budete muset provést tento krok i předchozí, aby byl e-mail správně nakonfigurován.

</div>

### Pokročilá konfigurace směrování Gmailu {#advanced-gmail-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Odhadovaný čas nastavení:</strong>
  <span>15-30 minut</span>
</div>

Pokud chcete nastavit pokročilé směrování v Gmailu tak, aby aliasy, které neodpovídají žádné schránce, byly přeposílány na mail servery Forward Email, postupujte podle těchto kroků:

1. Přihlaste se do své Google Admin konzole na [admin.google.com](https://admin.google.com)
2. Přejděte na **Apps → Google Workspace → Gmail → Routing**
3. Klikněte na **Add Route** a nakonfigurujte následující nastavení:

**Nastavení pro jednoho příjemce:**

* Vyberte "Change envelope recipient" a zadejte svou primární Gmailovou adresu
* Zaškrtněte "Add X-Gm-Original-To header with original recipient"

**Vzory příjemců obálky:**

* Přidejte vzor, který odpovídá všem neexistujícím schránkám (např. `.*@yourdomain.com`)

**Nastavení e-mailového serveru:**

* Vyberte "Route to host" a zadejte `mx1.forwardemail.net` jako primární server
* Přidejte `mx2.forwardemail.net` jako záložní server
* Nastavte port na 25
* Vyberte "Require TLS" pro zabezpečení

4. Klikněte na **Save** pro vytvoření směrování

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Důležité:
  </strong>
  <span>
    Tato konfigurace bude fungovat pouze pro účty Google Workspace s vlastními doménami, nikoli pro běžné Gmailové účty.
  </span>
</div>

### Pokročilá konfigurace směrování Outlooku {#advanced-outlook-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Odhadovaný čas nastavení:</strong>
  <span>15-30 minut</span>
</div>

Pro uživatele Microsoft 365 (dříve Office 365), kteří chtějí nastavit pokročilé směrování tak, aby aliasy, které neodpovídají žádné schránce, byly přeposílány na mail servery Forward Email:

1. Přihlaste se do administrátorského centra Microsoft 365 na [admin.microsoft.com](https://admin.microsoft.com)
2. Přejděte na **Exchange → Mail flow → Rules**
3. Klikněte na **Add a rule** a vyberte **Create a new rule**
4. Pojmenujte pravidlo (např. "Forward non-existent mailboxes to Forward Email")
5. V části **Apply this rule if** vyberte:
   * "The recipient address matches..."
   * Zadejte vzor, který odpovídá všem adresám ve vaší doméně (např. `*@yourdomain.com`)
6. V části **Do the following** vyberte:
   * "Redirect the message to..."
   * Zvolte "The following mail server"
   * Zadejte `mx1.forwardemail.net` a port 25
   * Přidejte `mx2.forwardemail.net` jako záložní server
7. V části **Except if** vyberte:
   * "The recipient is..."
   * Přidejte všechny existující schránky, které nemají být přeposílány
8. Nastavte prioritu pravidla tak, aby se spouštělo po ostatních pravidlech pro tok pošty
9. Klikněte na **Save** pro aktivaci pravidla
## Řešení problémů {#troubleshooting}

### Proč nedostávám své testovací e-maily {#why-am-i-not-receiving-my-test-emails}

Pokud si posíláte testovací e-mail sami sobě, nemusí se zobrazit ve vaší doručené poště, protože má stejný záhlaví "Message-ID".

Toto je široce známý problém, který ovlivňuje také služby jako Gmail.  <a href="https://support.google.com/a/answer/1703601">Zde je oficiální odpověď Gmailu týkající se tohoto problému</a>.

Pokud problémy přetrvávají, pravděpodobně jde o problém s propagací DNS. Budete muset počkat o něco déle a zkusit to znovu (nebo zkusit nastavit nižší hodnotu TTL u svých <strong class="notranslate">TXT</strong> záznamů).

**Stále máte problémy?**  Prosím <a href="/help">kontaktujte nás</a>, abychom mohli pomoci problém vyšetřit a najít rychlé řešení.

### Jak nakonfigurovat svůj e-mailový klient pro práci s Forward Email {#how-do-i-configure-my-email-client-to-work-with-forward-email}

<div class="mb-3">
  Naše služba funguje s populárními e-mailovými klienty, jako jsou:
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
  Vaše uživatelské jméno je e-mailová adresa vašeho aliasu a heslo je z <strong class="text-success"><i class="fa fa-key"></i> Generate Password</strong> („Normální heslo“).
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tip:
  </strong>
  <span>Pokud používáte Thunderbird, ujistěte se, že „Zabezpečení připojení“ je nastaveno na „SSL/TLS“ a metoda ověřování je nastavena na „Normální heslo“.</span>
</div>

| Typ  |         Hostname        |         Protokol        |                                            Porty                                           |
| :--: | :---------------------: | :---------------------: | :----------------------------------------------------------------------------------------: |
| IMAP | `imap.forwardemail.net` |  SSL/TLS **preferováno**  |                                      `993` a `2993`                                      |
| SMTP | `smtp.forwardemail.net` | SSL/TLS **doporučeno** | `465` a `2465` pro SSL/TLS (doporučeno) nebo `587`, `2587`, `2525` a `25` pro STARTTLS |

### Proč moje e-maily končí ve spamu a nevyžádané poště a jak mohu zkontrolovat reputaci své domény {#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation}
Tato sekce vás provede, pokud váš odchozí e-mail používá naše SMTP servery (např. `smtp.forwardemail.net`) (nebo je přeposílán přes `mx1.forwardemail.net` nebo `mx2.forwardemail.net`) a je doručován do složky Spam nebo Nevyžádaná pošta příjemců.

Pravidelně monitorujeme naše [IP adresy](#what-are-your-servers-ip-addresses) proti [všem renomovaným DNS blacklistům](#how-do-you-handle-your-ip-addresses-becoming-blocked), **proto je velmi pravděpodobné, že se jedná o problém specifický pro reputaci domény**.

E-maily mohou skončit ve složkách spamu z několika důvodů:

1. **Chybějící autentizace**: Nastavte záznamy [SPF](#how-do-i-set-up-spf-for-forward-email), [DKIM](#how-do-i-set-up-dkim-for-forward-email) a [DMARC](#how-do-i-set-up-dmarc-for-forward-email).

2. **Reputace domény**: Nové domény často mají neutrální reputaci, dokud si nevytvoří historii odesílání.

3. **Spouštěče obsahu**: Některá slova nebo fráze mohou spustit spamové filtry.

4. **Vzor odesílání**: Náhlé zvýšení objemu e-mailů může vypadat podezřele.

Můžete zkusit použít jeden nebo více z těchto nástrojů ke kontrole reputace a kategorizace vaší domény:

#### Nástroje pro kontrolu reputace a blacklistů {#reputation-and-blocklist-check-tools}

| Název nástroje                              | URL                                                          | Typ                    |
| ------------------------------------------- | ------------------------------------------------------------ | ---------------------- |
| Cloudflare Domain Categorization Feedback   | <https://radar.cloudflare.com/domains/feedback>              | Kategorizace           |
| Spamhaus IP and Domain Reputation Checker   | <https://check.spamhaus.org/>                                | DNSBL                  |
| Cisco Talos IP and Domain Reputation Center | <https://talosintelligence.com/reputation_center>            | Reputace               |
| Barracuda IP and Domain Reputation Lookup   | <https://www.barracudacentral.org/lookups/lookup-reputation> | DNSBL                  |
| MX Toolbox Blacklist Check                  | <https://mxtoolbox.com/blacklists.aspx>                      | Blacklist              |
| Google Postmaster Tools                     | <https://www.gmail.com/postmaster/>                          | Reputace               |
| Yahoo Sender Hub                            | <https://senders.yahooinc.com/>                              | Reputace               |
| MultiRBL.valli.org Blacklist Check          | <https://multirbl.valli.org/lookup/>                         | DNSBL                  |
| Sender Score                                | <https://senderscore.org/act/blocklist-remover/>             | Reputace               |
| Invaluement                                 | <https://www.invaluement.com/lookup/>                        | DNSBL                  |
| SURBL                                       | <https://www.surbl.org/>                                     | DNSBL                  |
| SpamCop                                     | <https://www.spamcop.net/bl.shtml>                           | DNSBL                  |
| UCEPROTECT's Levels 1, 2, and 3             | <https://www.uceprotect.net/en/rblcheck.php>                 | DNSBL                  |
| UCEPROTECT's backscatterer.org              | <https://www.backscatterer.org/>                             | Ochrana proti backscatteru |
| UCEPROTECT's whitelisted.org                | <https://www.whitelisted.org/> (vyžaduje poplatek)           | DNSWL                  |

#### Formuláře pro žádost o odstranění IP podle poskytovatele {#ip-removal-request-forms-by-provider}

Pokud byla vaše IP adresa zablokována konkrétním poskytovatelem e-mailu, použijte příslušný formulář pro odstranění nebo kontakt níže:

| Poskytovatel                           | Formulář pro odstranění / Kontakt                                                                                     | Poznámky                                     |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| Google/Gmail                           | <https://support.google.com/mail/contact/bulk_send_new>                                                    | Formulář pro kontakt hromadných odesílatelů |
| Microsoft (Outlook/Office 365/Hotmail) | <https://sender.office.com>                                                                                | Portál pro odstranění IP z Office 365       |
| Yahoo/AOL/Verizon                      | <https://senders.yahooinc.com/>                                                                            | Yahoo Sender Hub                             |
| Apple/iCloud                           | <https://ipcheck.proofpoint.com/>                                                                          | Apple používá Proofpoint pro reputaci IP    |
| Proofpoint                             | <https://ipcheck.proofpoint.com/>                                                                          | Kontrola a odstranění IP u Proofpoint       |
| Barracuda Networks                     | <https://www.barracudacentral.org/lookups/lookup-reputation>                                               | Kontrola reputace a odstranění u Barracuda  |
| Cloudmark                              | <https://csi.cloudmark.com/en/reset/>                                                                      | Žádost o reset u Cloudmark CSI               |
| GoDaddy/SecureServer                   | <https://unblock.secureserver.net>                                                                         | Formulář pro odblokování IP u GoDaddy        |
| Comcast/Xfinity                        | <https://spa.xfinity.com/report>                                                                           | Žádost o odstranění IP u Comcast             |
| Charter/Spectrum                       | <https://www.spectrum.net/support/internet/understanding-email-error-codes>                                | Kontaktujte podporu Spectrum pro odstranění  |
| AT&T                                   | `abuse_rbl@abuse-att.net`                                                                                  | E-mail pro žádost o odstranění               |
| Cox Communications                     | `unblock.request@cox.net`                                                                                  | E-mail pro žádost o odstranění               |
| CenturyLink/Lumen                      | `abuse@centurylink.com`                                                                                    | Používá Cloudfilter                          |
| Windstream                             | `abuse@windstream.net`                                                                                     | E-mail pro žádost o odstranění               |
| t-online.de (Německo)                  | `tobr@rx.t-online.de`                                                                                      | E-mail pro žádost o odstranění               |
| Orange France                          | <https://postmaster.orange.fr/>                                                                            | Použijte kontaktní formulář nebo e-mail `abuse@orange.fr` |
| GMX                                    | <https://postmaster.gmx.net/en/contact>                                                                    | Kontaktní formulář GMX postmastera           |
| Mail.ru                                | <https://postmaster.mail.ru/>                                                                              | Portál Mail.ru postmastera                    |
| Yandex                                 | <https://postmaster.yandex.ru/>                                                                            | Portál Yandex postmastera                     |
| QQ Mail (Tencent)                      | <https://open.mail.qq.com/>                                                                                | Žádost o zařazení na whitelist QQ Mail (čínsky) |
| Netease (163.com)                      | <https://mail.163.com/postmaster/>                                                                         | Portál Netease postmastera                    |
| Alibaba/Aliyun/HiChina                 | <https://www.alibabacloud.com/help/en/alibaba-mail/>                                                       | Kontakt přes konzoli Alibaba Cloud            |
| Amazon SES                             | <https://docs.aws.amazon.com/ses/latest/dg/faqs-dnsbls.html>                                               | Konzole AWS SES > Odstranění z blacklistu    |
| SendGrid                               | <https://support.sendgrid.com/>                                                                            | Kontaktujte podporu SendGrid                  |
| Mimecast                               | <https://community.mimecast.com/>                                                                          | Používá třetí strany RBL - kontaktujte konkrétní RBL |
| Fastmail                               | <https://www.fastmail.com/support/>                                                                        | Kontaktujte podporu Fastmail                  |
| Zoho                                   | <https://help.zoho.com/portal/en/kb/campaigns/faqs/campaign-review/articles/how-do-i-delist-my-ip-address> | Kontaktujte podporu Zoho                      |
| ProtonMail                             | <https://proton.me/support/contact>                                                                        | Kontaktujte podporu Proton                     |
| Tutanota                               | <https://tutanota.com/support>                                                                             | Kontaktujte podporu Tutanota                   |
| Hushmail                               | <https://www.hushmail.com/support/>                                                                        | Kontaktujte podporu Hushmail                   |
| Mailbox.org                            | <https://mailbox.org/en/support>                                                                           | Kontaktujte podporu Mailbox.org                |
| Posteo                                 | <https://posteo.de/en/site/contact>                                                                        | Kontaktujte podporu Posteo                      |
| DuckDuckGo Email                       | <https://duckduckgo.com/email/support>                                                                     | Kontaktujte podporu DuckDuckGo                  |
| Sonic.net                              | <https://www.sonic.com/support>                                                                            | Kontaktujte podporu Sonic                       |
| Telus                                  | <https://www.telus.com/en/support>                                                                         | Kontaktujte podporu Telus                       |
| Vodafone Germany                       | <https://www.vodafone.de/hilfe/>                                                                           | Kontaktujte podporu Vodafone                    |
| Xtra (Spark NZ)                        | <https://www.spark.co.nz/help/>                                                                            | Kontaktujte podporu Spark NZ                    |
| UOL/BOL (Brazílie)                     | <https://ajuda.uol.com.br/>                                                                                | Kontaktujte podporu UOL (portugalsky)          |
| Libero (Itálie)                       | <https://aiuto.libero.it/>                                                                                 | Kontaktujte podporu Libero (italsky)           |
| Telenet (Belgie)                      | <https://www2.telenet.be/en/support/>                                                                      | Kontaktujte podporu Telenet                      |
| Facebook/WhatsApp                      | <https://www.facebook.com/business/help>                                                                   | Kontaktujte podporu Facebook business           |
| LinkedIn                               | <https://www.linkedin.com/help/linkedin>                                                                   | Kontaktujte podporu LinkedIn                     |
| Groups.io                              | <https://groups.io/helpcenter>                                                                             | Kontaktujte podporu Groups.io                    |
| Earthlink/Vade Secure                  | <https://sendertool.vadesecure.com/en/>                                                                    | Nástroj odesílatele Vade Secure                  |
| Cloudflare Email Security              | <https://www.cloudflare.com/products/zero-trust/email-security/>                                           | Kontaktujte podporu Cloudflare                   |
| Hornetsecurity/Expurgate               | <https://www.hornetsecurity.com/>                                                                          | Kontaktujte podporu Hornetsecurity               |
| SpamExperts/Antispamcloud              | <https://www.spamexperts.com/>                                                                             | Kontakt přes poskytovatele hostingu              |
| Mail2World                             | <https://www.mail2world.com/support/>                                                                      | Kontaktujte podporu Mail2World                    |
> \[!TIP]
> Začněte s nízkým objemem vysoce kvalitních e-mailů, abyste si vybudovali pozitivní reputaci před odesíláním ve větších objemech.

> \[!IMPORTANT]
> Pokud je vaše doména na černé listině, každá černá listina má svůj vlastní proces odstranění. Zkontrolujte jejich webové stránky pro pokyny.

> \[!TIP]
> Pokud potřebujete další pomoc nebo zjistíte, že jsme falešně označeni jako spam určitým poskytovatelem e-mailových služeb, prosím <a href="/help">kontaktujte nás</a>.

### Co mám dělat, když obdržím spamové e-maily {#what-should-i-do-if-i-receive-spam-emails}

Měli byste se odhlásit z e-mailového seznamu (pokud je to možné) a zablokovat odesílatele.

Prosím, neoznamujte zprávu jako spam, ale přepošlete ji našemu ručně spravovanému a na ochranu soukromí zaměřenému systému prevence zneužití.

**E-mailová adresa, na kterou přeposílat spam, je:** <abuse@forwardemail.net>

### Proč se mé testovací e-maily zaslané sobě v Gmailu zobrazují jako „podezřelé“ {#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious}

Pokud vidíte tuto chybovou zprávu v Gmailu, když si pošlete test sami sobě, nebo když osoba, které posíláte e-mail s vaším aliasem, vidí od vás e-mail poprvé, **prosím, nebojte se** – jedná se o vestavěnou bezpečnostní funkci Gmailu.

Jednoduše klikněte na „Vypadá to bezpečně“. Například pokud byste poslali testovací zprávu pomocí funkce odeslat jako (někomu jinému), tato zpráva se nezobrazí.

Pokud se jim však tato zpráva zobrazí, je to proto, že byli zvyklí vidět vaše e-maily přicházet z <john@gmail.com> místo <john@customdomain.com> (jen příklad). Gmail uživatele upozorní, aby se ujistil, že je vše v pořádku, a to bez možnosti obejití.

### Mohu odstranit „via forwardemail dot net“ v Gmailu {#can-i-remove-the-via-forwardemail-dot-net-in-gmail}

Toto téma souvisí s [dobře známým problémem v Gmailu, kdy se vedle jména odesílatele zobrazují další informace](https://support.google.com/mail/answer/1311182).

Od května 2023 podporujeme odesílání e-mailů přes SMTP jako doplněk pro všechny placené uživatele – což znamená, že můžete odstranit <span class="notranslate">via forwardemail dot net</span> v Gmailu.

Upozorňujeme, že toto FAQ je specifické pro ty, kteří používají funkci [Jak odesílat poštu jako pomocí Gmailu](#how-to-send-mail-as-using-gmail).

Pro pokyny k nastavení si prosím přečtěte sekci [Podporujete odesílání e-mailů přes SMTP](#do-you-support-sending-email-with-smtp).


## Správa dat {#data-management}

### Kde se nacházejí vaše servery {#where-are-your-servers-located}

> \[!TIP]
> Brzy můžeme oznámit naši lokalitu datového centra v EU hostovanou pod [forwardemail.eu](https://forwardemail.eu). Přihlaste se k odběru diskuse na <https://github.com/orgs/forwardemail/discussions/336> pro aktualizace.

Naše servery se nacházejí převážně v Denveru, Colorado – kompletní seznam IP adres najdete na <https://forwardemail.net/ips>.

O našich subzpracovatelích se můžete dozvědět na našich stránkách [GDPR](/gdpr), [DPA](/dpa) a [Ochrana soukromí](/privacy).

### Jak exportovat a zálohovat svou poštovní schránku {#how-do-i-export-and-backup-my-mailbox}

Kdykoli můžete exportovat své poštovní schránky ve formátech [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions), [Mbox](https://en.wikipedia.org/wiki/Mbox) nebo šifrovaných [SQLite](https://en.wikipedia.org/wiki/SQLite).

Přejděte na <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Můj účet <i class="fa fa-angle-right"></i> Domény</a> <i class="fa fa-angle-right"></i> Aliasy <i class="fa fa-angle-right"></i> Stáhnout zálohu a vyberte preferovaný typ exportu.

Po dokončení exportu vám bude zaslán odkaz ke stažení.

Upozorňujeme, že odkaz ke stažení exportu vyprší po 4 hodinách z bezpečnostních důvodů.

Pokud potřebujete prohlédnout exportované formáty EML nebo Mbox, mohou být užitečné tyto open-source nástroje:

| Název           | Formát | Platforma    | GitHub URL                                          |
| --------------- | :----: | ----------- | --------------------------------------------------- |
| MBox Viewer     |  Mbox  | Windows     | <https://github.com/eneam/mboxviewer>               |
| mbox-web-viewer |  Mbox  | Všechny platformy | <https://github.com/PHMRanger/mbox-web-viewer>      |
| EmlReader       |   EML  | Windows     | <https://github.com/ayamadori/EmlReader>            |
| Email viewer    |   EML  | VSCode      | <https://github.com/joelharkes/vscode_email_viewer> |
| eml-reader      |   EML  | Všechny platformy | <https://github.com/s0ph1e/eml-reader>              |
Additionally if you need to convert a Mbox file to EML file, then you can use <https://github.com/noelmartinon/mboxzilla>.

### Jak importovat a migrovat svou stávající poštovní schránku {#how-do-i-import-and-migrate-my-existing-mailbox}

Svůj e-mail můžete snadno importovat do Forward Email (např. pomocí [Thunderbirdu](https://www.thunderbird.net)) podle níže uvedených pokynů:

<div class="alert alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Důležité:
  </strong>
  <span>
    Musíte dodržet všechny následující kroky, abyste mohli importovat svůj stávající e-mail.
  </span>
</div>

1. Exportujte svůj e-mail od svého stávajícího poskytovatele e-mailu:

   | Poskytovatel e-mailu | Formát exportu                                | Pokyny k exportu                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
   | -------------------- | --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | Gmail                | MBOX                                          | <https://takeout.google.com/settings/takeout/custom/gmail>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
   | Outlook              | PST                                           | <div class="alert my-3 alert-danger"><i class="fa fa-info-circle font-weight-bold"></i> <strong class="font-weight-bold">Tip:</strong> <span>Pokud používáte Outlook (<a href="https://support.microsoft.com/en-us/office/back-up-your-email-e5845b0b-1aeb-424f-924c-aa1c33b18833#:~:text=Select%20File%20%3E%20Open%20%26%20Export%20%3E,back%20up%20and%20select%20Next." class="alert-link">formát exportu PST</a>), můžete jednoduše postupovat podle pokynů v části "Jiné" níže. Nicméně níže jsme poskytli odkazy na převod PST do formátu MBOX/EML podle vašeho operačního systému:<ul class="mb-0 mt-3"><li><a class="alert-link" href="https://github.com/BaselineIT/Zinkuba/releases/download/release-1.2/Zinkuba.App.exe">Zinkuba pro Windows</a> (<a class="alert-link" href="https://github.com/BaselineIT/Zinkuba?tab=readme-ov-file#zinkuba">GitHub</a>)</li><li><a class="alert-link" href="https://cygwin.com/packages/summary/readpst.html">readpst pro Windows cygwin</a> – (např. <code>readpst -u -o $OUT_DIR $IN_DIR</code> s nahrazením <code>$OUT_DIR</code> a <code>$IN_DIR</code> cestami k výstupnímu a vstupnímu adresáři).</li><li><a class="alert-link" href="https://manpages.ubuntu.com/manpages/trusty/man1/readpst.1.html">readpst pro Ubuntu/Linux</a> – (např. <code>sudo apt-get install readpst</code> a poté <code>readpst -u -o $OUT_DIR $IN_DIR</code>, s nahrazením <code>$OUT_DIR</code> a <code>$IN_DIR</code> cestami k výstupnímu a vstupnímu adresáři).</li><li><a class="alert-link" href="https://formulae.brew.sh/formula/libpst">readpst pro macOS (přes brew)</a> – (např. <code>brew install libpst</code> a poté <code>readpst -u -o $OUT_DIR $IN_DIR</code>, s nahrazením <code>$OUT_DIR</code> a <code>$IN_DIR</code> cestami k výstupnímu a vstupnímu adresáři).</li><li><a class="alert-link" href="https://github.com/juanirm/pst-converter/tree/master?tab=readme-ov-file#pst-converter">PST Converter pro Windows (GitHub)</a></li></ul><br /></span></div> |
   | Apple Mail           | MBOX                                          | <https://support.apple.com/guide/mail/import-or-export-mailboxes-mlhlp1030/mac#apd37a3190755974>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
   | Fastmail             | EML                                           | <https://www.fastmail.help/hc/en-us/articles/360060590573-Download-all-your-data#downloadmail>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
   | Proton Mail          | MBOX/EML                                      | <https://proton.me/support/export-emails-import-export-app>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
   | Tutanota             | EML                                           | <https://github.com/crepererum-oss/tatutanatata>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
   | Gandi                | EML                                           | <https://docs.gandi.net/en/gandimail/common_operations/backup_email.html#contents>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
   | Zoho                 | EML                                           | <https://www.zoho.com/mail/help/import-export-emails.html#alink2>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
   | Jiné                 | [Použijte Thunderbird](https://www.thunderbird.net) | Nastavte svůj stávající e-mailový účet v Thunderbirdu a poté použijte plugin [ImportExportTools NG](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/) k exportu a importu svého e-mailu.  **Také můžete jednoduše zkopírovat/vložit nebo přetáhnout e-maily mezi účty.**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
2. Stáhněte, nainstalujte a otevřete [Thunderbird](https://www.thunderbird.net).

3. Vytvořte nový účet pomocí plné e-mailové adresy vašeho aliasu (např. <code><you@yourdomain.com></code>) a vašeho vygenerovaného hesla.  <strong>Pokud ještě nemáte vygenerované heslo, pak <a href="/faq#do-you-support-receiving-email-with-imap" target="_blank">se podívejte na naše pokyny k nastavení</a></strong>.

4. Stáhněte a nainstalujte Thunderbird plugin [ImportExportTools NG](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/).

5. V Thunderbirdu vytvořte novou lokální složku, poté na ni klikněte pravým tlačítkem → vyberte možnost `ImportExportTools NG` → zvolte `Import mbox file` (pro exportní formát MBOX) – nebo – `Import messages` / `Import all messages from a directory` (pro exportní formát EML).

6. Přetáhněte zprávy z lokální složky do nové (nebo existující) IMAP složky v Thunderbirdu, do které chcete zprávy nahrát do IMAP úložiště u naší služby.  Tím zajistíte, že budou zálohovány online v našem SQLite šifrovaném úložišti.

   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tip:
     </strong>
     <span>
       Pokud si nejste jisti, jak importovat do Thunderbirdu, můžete se podívat na oficiální pokyny na <a class="alert-link" href="https://kb.mozillazine.org/Importing_folders">https://kb.mozillazine.org/Importing_folders</a> a <a class="alert-link" href="https://github.com/thunderbird/import-export-tools-ng/wiki">https://github.com/thunderbird/import-export-tools-ng/wiki</a>.
     </span>
   </div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Důležité:
  </strong>
  <span>
    Po dokončení exportu a importu možná budete chtít také povolit přeposílání na vašem stávajícím e-mailovém účtu a nastavit automatickou odpověď, která upozorní odesílatele, že máte novou e-mailovou adresu (např. pokud jste dříve používali Gmail a nyní používáte e-mail s vlastní doménou).
  </span>
</div>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Gratulujeme!
    </strong>
    <span>
      Úspěšně jste dokončili všechny kroky.
    </span>
  </div>
</div>

### Jak mohu používat vlastní S3-kompatibilní úložiště pro zálohy {#how-do-i-use-my-own-s3-compatible-storage-for-backups}

Uživatelé placených plánů si mohou nakonfigurovat vlastního poskytovatele úložiště kompatibilního s [S3](https://en.wikipedia.org/wiki/Amazon_S3) na bázi jednotlivých domén pro zálohy IMAP/SQLite.  To znamená, že vaše šifrované zálohy poštovní schránky mohou být uloženy na vaší vlastní infrastruktuře místo (nebo kromě) našeho výchozího úložiště.

Podporovaní poskytovatelé zahrnují [Amazon S3](https://aws.amazon.com/s3/), [Cloudflare R2](https://developers.cloudflare.com/r2/), [MinIO](https://github.com/minio/minio), [Backblaze B2](https://www.backblaze.com/cloud-storage), [DigitalOcean Spaces](https://www.digitalocean.com/products/spaces) a jakoukoli jinou službu kompatibilní se S3.

#### Nastavení {#setup}

1. Vytvořte **soukromý** bucket u vašeho S3-kompatibilního poskytovatele. Bucket nesmí být veřejně přístupný.
2. Vytvořte přístupové údaje (access key ID a secret access key) s oprávněními pro čtení/zápis do bucketu.
3. Přejděte na <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Můj účet <i class="fa fa-angle-right"></i> Domény</a> <i class="fa fa-angle-right"></i> Pokročilá nastavení <i class="fa fa-angle-right"></i> Vlastní S3-kompatibilní úložiště.
4. Zaškrtněte **"Povolit vlastní S3-kompatibilní úložiště"** a vyplňte URL koncového bodu, access key ID, secret access key, region a název bucketu.
5. Klikněte na **"Testovat připojení"** pro ověření vašich přihlašovacích údajů, přístupu k bucketu a oprávnění k zápisu.
6. Klikněte na **"Uložit"** pro aplikaci nastavení.

#### Jak fungují zálohy {#how-backups-work}

Zálohy jsou automaticky spouštěny pro každý připojený IMAP alias. IMAP server kontroluje všechny aktivní připojení jednou za hodinu a spouští zálohu pro každý připojený alias. Zámek založený na Redis zabraňuje spuštění duplicitních záloh během 30 minut od sebe a skutečná záloha je přeskočena, pokud byla úspěšná záloha dokončena během posledních 24 hodin (pokud záloha nebyla explicitně požadována uživatelem ke stažení).
Zálohy lze také spustit ručně kliknutím na **"Stáhnout zálohu"** u jakéhokoli aliasu na ovládacím panelu. Ruční zálohy se vždy spustí bez ohledu na 24hodinové okno.

Proces zálohování funguje následovně:

1. SQLite databáze je zkopírována pomocí `VACUUM INTO`, což vytvoří konzistentní snímek bez přerušení aktivních připojení a zachová šifrování databáze.
2. Záložní soubor je ověřen otevřením, aby se potvrdilo, že šifrování je stále platné.
3. Vypočítá se SHA-256 hash a porovná se s existující zálohou v úložišti. Pokud se hash shoduje, nahrávání se přeskočí (žádné změny od poslední zálohy).
4. Záloha je nahrána do S3 pomocí multipart upload přes knihovnu [@aws-sdk/lib-storage](https://github.com/aws/aws-sdk-js-v3/tree/main/lib/lib-storage).
5. Je vygenerována podepsaná URL pro stažení (platná 4 hodiny) a odeslána uživateli e-mailem.

#### Formáty záloh {#backup-formats}

Jsou podporovány tři formáty záloh:

| Formát   | Přípona  | Popis                                                                       |
| -------- | -------- | --------------------------------------------------------------------------- |
| `sqlite` | `.sqlite`| Surový šifrovaný snímek SQLite databáze (výchozí pro automatické IMAP zálohy)|
| `mbox`   | `.zip`   | ZIP chráněný heslem obsahující poštovní schránku ve formátu mbox            |
| `eml`    | `.zip`   | ZIP chráněný heslem obsahující jednotlivé `.eml` soubory pro každou zprávu  |

> **Tip:** Pokud máte záložní soubory `.sqlite` a chcete je lokálně převést na `.eml` soubory, použijte náš samostatný CLI nástroj **[convert-sqlite-to-eml](#how-do-i-convert-sqlite-backups-to-eml-files)**. Funguje na Windows, Linuxu i macOS a nevyžaduje síťové připojení.

#### Pojmenování souborů a struktura klíčů {#file-naming-and-key-structure}

Při použití **vlastního S3 úložiště** jsou záložní soubory ukládány s prefixem časového razítka ve formátu [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601), takže každá záloha je uchována jako samostatný objekt. To vám poskytuje kompletní historii záloh ve vašem vlastním bucketu.

Formát klíče je:

```
{ISO 8601 timestamp}-{alias_id}.{extension}
```

Například:

```
2025-03-01T12:00:00.000Z-65a31c53c36b75ed685f3fda.sqlite
2025-03-01T12:00:00.000Z-65a31c53c36b75ed685f3fda.zip
2025-03-02T12:00:00.000Z-65a31c53c36b75ed685f3fda.sqlite
```

`alias_id` je MongoDB ObjectId aliasu. Najdete ho na stránce nastavení aliasu nebo přes API.

Při použití **výchozího (systémového) úložiště** je klíč plochý (např. `65a31c53c36b75ed685f3fda.sqlite`) a každá záloha přepíše tu předchozí.

> **Poznámka:** Protože vlastní S3 úložiště uchovává všechny verze záloh, využití úložiště bude časem růst. Doporučujeme nastavit [pravidla životního cyklu](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html) ve vašem bucketu pro automatické vypršení starých záloh (např. mazání objektů starších než 30 nebo 90 dní).

#### Vlastnictví dat a politika mazání {#data-ownership-and-deletion-policy}

Váš vlastní S3 bucket je zcela pod vaší kontrolou. My **nikdy nemažeme ani neměníme** soubory ve vašem vlastním S3 bucketu — ani při smazání aliasu, ani při odebrání domény, ani během jakýchkoli úklidových operací. Pouze zapisujeme nové záložní soubory do vašeho bucketu.

To znamená:

* **Smazání aliasu** — Když smažete alias, odstraníme zálohu pouze z našeho výchozího systémového úložiště. Jakékoli zálohy dříve uložené ve vašem vlastním S3 bucketu zůstanou nedotčeny.
* **Odebrání domény** — Odebrání domény neovlivní soubory ve vašem vlastním bucketu.
* **Správa uchovávání** — Za správu úložiště ve vašem vlastním bucketu odpovídáte vy, včetně nastavení pravidel životního cyklu pro vypršení starých záloh.

Pokud zakážete vlastní S3 úložiště nebo přepnete zpět na naše výchozí úložiště, existující soubory ve vašem bucketu zůstanou zachovány. Budoucí zálohy budou jednoduše ukládány do našeho výchozího úložiště.

#### Bezpečnost {#security}

* Vaše přístupové ID a tajný přístupový klíč jsou **zašifrovány v klidu** pomocí [AES-256-GCM](https://cs.wikipedia.org/wiki/Galois/Counter_Mode) před uložením do naší databáze. Jsou dešifrovány pouze za běhu při provádění zálohovacích operací.
* Automaticky ověřujeme, že váš bucket **není veřejně přístupný**. Pokud je detekován veřejný bucket, konfigurace bude při ukládání odmítnuta. Pokud je veřejný přístup zjištěn v době zálohy, přepneme na naše výchozí úložiště a všechny správce domény upozorníme e-mailem.
* Přihlašovací údaje jsou ověřovány při ukládání pomocí volání [HeadBucket](https://docs.aws.amazon.com/AmazonS3/latest/API/API_HeadBucket.html), aby se zajistilo, že bucket existuje a údaje jsou správné. Pokud ověření selže, vlastní S3 úložiště je automaticky deaktivováno.
* Každý záložní soubor obsahuje SHA-256 hash v metadatech S3, který se používá k detekci nezměněných databází a přeskočení zbytečných nahrání.
#### Oznámení o chybách {#error-notifications}

Pokud záloha selže při použití vašeho vlastního úložiště S3 (např. kvůli vypršení platnosti přihlašovacích údajů nebo problému s připojením), všichni správci domény budou upozorněni e-mailem. Tato oznámení jsou omezena na jednu zprávu každých 6 hodin, aby se zabránilo duplicitním upozorněním. Pokud je váš bucket při zálohování detekován jako veřejně přístupný, správci budou upozorněni jednou denně.

#### API {#api}

Vlastní úložiště S3 můžete také nakonfigurovat přes API:

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

Pro otestování připojení přes API:

```sh
curl -X POST https://api.forwardemail.net/v1/domains/example.com/test-s3-connection \
  -u API_TOKEN:
```

### Jak převést SQLite zálohy na EML soubory {#how-do-i-convert-sqlite-backups-to-eml-files}

Pokud si stáhnete nebo uložíte SQLite zálohy (buď z našeho výchozího úložiště, nebo z vašeho vlastního [vlastního S3 bucketu](#how-do-i-use-my-own-s3-compatible-storage-for-backups)), můžete je převést na standardní `.eml` soubory pomocí našeho samostatného CLI nástroje **[convert-sqlite-to-eml](https://github.com/forwardemail/forwardemail.net/tree/master/tools/convert-sqlite-to-eml)**. EML soubory lze otevřít v libovolném e-mailovém klientu ([Thunderbird](https://www.thunderbird.net/), [Outlook](https://www.microsoft.com/en-us/microsoft-365/outlook/email-and-calendar-software-microsoft-outlook), [Apple Mail](https://support.apple.com/mail) atd.) nebo importovat do jiných poštovních serverů.

#### Instalace {#installation-1}

Můžete si stáhnout předkompilovaný binární soubor (není potřeba [Node.js](https://github.com/nodejs/node)) nebo jej spustit přímo s [Node.js](https://github.com/nodejs/node):

**Předkompilované binárky** — Stáhněte si nejnovější verzi pro vaši platformu z [GitHub Releases](https://github.com/forwardemail/forwardemail.net/releases):

| Platforma | Architektura  | Soubor                               |
| --------- | ------------- | ----------------------------------- |
| Linux     | x64           | `convert-sqlite-to-eml-linux-x64`    |
| Linux     | arm64         | `convert-sqlite-to-eml-linux-arm64`  |
| macOS     | Apple Silicon | `convert-sqlite-to-eml-darwin-arm64` |
| Windows   | x64           | `convert-sqlite-to-eml-win-x64.exe`  |

> **Uživatelé macOS:** Po stažení možná budete muset odstranit karanténní atribut před spuštěním binárky:
>
> ```bash
> sudo xattr -rd com.apple.quarantine ./convert-sqlite-to-eml-darwin-arm64
> ```
>
> (Nahraďte `./convert-sqlite-to-eml-darwin-arm64` skutečnou cestou ke staženému souboru.)

> **Uživatelé Linuxu:** Po stažení možná budete muset nastavit binárku jako spustitelnou:
>
> ```bash
> chmod +x ./convert-sqlite-to-eml-linux-x64
> ```
>
> (Nahraďte `./convert-sqlite-to-eml-linux-x64` skutečnou cestou ke staženému souboru.)

**Ze zdroje** (vyžaduje [Node.js](https://github.com/nodejs/node) >= 18):

```bash
cd tools/convert-sqlite-to-eml
npm install
node index.js
```

#### Použití {#usage}

Nástroj podporuje jak interaktivní, tak neinteraktivní režim.

**Interaktivní režim** — spusťte bez argumentů a budete vyzváni k zadání všech vstupů:

```bash
./convert-sqlite-to-eml
```

```
  Forward Email - Převod SQLite zálohy na EML
  ===========================================

  Cesta k SQLite záložnímu souboru: /path/to/backup.sqlite
  IMAP/alias heslo: ********
  Výstupní cesta ZIP [/path/to/backup-2025-03-01T12-00-00-000Z.zip]:
```

**Neinteraktivní režim** — předávejte argumenty přes příkazové přepínače pro skriptování a automatizaci:

```bash
./convert-sqlite-to-eml \
  --path /path/to/backup.sqlite \
  --password "your-imap-password" \
  --output /path/to/output.zip
```

| Přepínač            | Popis                                                                          |
| ------------------- | ------------------------------------------------------------------------------ |
| `--path <path>`     | Cesta k zašifrovanému SQLite záložnímu souboru                                 |
| `--password <pass>` | IMAP/alias heslo pro dešifrování                                               |
| `--output <path>`   | Výstupní cesta pro ZIP soubor (výchozí: automaticky generováno s ISO 8601 časem) |
| `--help`            | Zobrazit nápovědu                                                             |
#### Výstupní formát {#output-format}

Nástroj vytváří ZIP archiv chráněný heslem (šifrovaný AES-256), který obsahuje:

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

Soubory EML jsou uspořádány podle složek poštovní schránky. Heslo k ZIP archivu je stejné jako vaše heslo k IMAPu/přezdívce. Každý soubor `.eml` je standardní [RFC 5322](https://datatracker.ietf.org/doc/html/rfc5322) emailová zpráva s kompletními hlavičkami, textem těla a přílohami rekonstruovanými ze SQLite databáze.

#### Jak to funguje {#how-it-works}

1. Otevírá zašifrovanou SQLite databázi pomocí vašeho hesla k IMAPu/přezdívce (podporuje šifry [ChaCha20](https://en.wikipedia.org/wiki/ChaCha20-Poly1305) i [AES-256-CBC](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard)).
2. Čte tabulku Mailboxes pro zjištění struktury složek.
3. Pro každou zprávu dekóduje mimeTree (uložený jako JSON komprimovaný pomocí [Brotli](https://github.com/google/brotli)) z tabulky Messages.
4. Rekonstruuje celý EML procházením MIME stromu a načítáním těla příloh z tabulky Attachments.
5. Vše zabalí do ZIP archivu chráněného heslem pomocí [archiver-zip-encrypted](https://github.com/artem-silaev/archiver-zip-encrypted).

### Podporujete self-hosting {#do-you-support-self-hosting}

Ano, od března 2025 podporujeme možnost self-hostingu. Přečtěte si blog [zde](https://forwardemail.net/blog/docs/self-hosted-solution). Začněte s [návodem pro self-hosting](https://forwardemail.net/self-hosted). A pro zájemce o podrobnější krok za krokem verzi máme naše návody založené na [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) nebo [Debianu](https://forwardemail.net/guides/selfhosted-on-debian).


## Konfigurace e-mailu {#email-configuration}

### Jak začít a nastavit přeposílání e-mailů {#how-do-i-get-started-and-set-up-email-forwarding}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Odhadovaný čas nastavení:</strong>
  <span>Méně než 10 minut</span>
</div>

<div class="alert my-3 alert-success">
  <i class="fa fa-bullhorn font-weight-bold"></i>
  <strong class="font-weight-bold">
    Začínáme:
  </strong>
  <span>
    Pečlivě si přečtěte a dodržujte kroky jedna až osm uvedené níže. Nezapomeňte nahradit e-mailovou adresu <code>user@gmail.com</code> adresou, na kterou chcete e-maily přeposílat (pokud již není správná). Stejně tak nahraďte <code>example.com</code> vaší vlastní doménou (pokud již není správná).
  </span>
</div>

<ol>
  <li class="mb-2 mb-md-3 mb-lg-5">Pokud jste již někde zaregistrovali svou doménu, tento krok úplně přeskočte a pokračujte krokem dvě! Jinak můžete <a href="/domain-registration" rel="noopener noreferrer">kliknout zde a zaregistrovat svou doménu</a>.</li>
  <li class="mb-2 mb-md-3 mb-lg-5">
  Pamatujete si, kde jste doménu zaregistrovali? Jakmile si to vzpomenete, postupujte podle níže uvedených pokynů:

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Důležité:
  </strong>
  <span>
    Musíte otevřít novou záložku a přihlásit se ke svému registrátorovi domény. Můžete jednoduše kliknout na svého "Registrátora" níže, čímž se to automaticky provede. V této nové záložce musíte přejít na stránku správy DNS u svého registrátora – a níže v sloupci "Kroky konfigurace" jsme poskytli podrobný návod krok za krokem. Jakmile se dostanete na tuto stránku v nové záložce, můžete se vrátit do této záložky a pokračovat krokem tři níže.
    <strong class="font-weight-bold">Zatím nezavírejte otevřenou záložku; budete ji potřebovat pro další kroky!</strong>
  </span>
</div>

<table id="table-dns-management-by-registrar" class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Registrátor</th>
      <th>Kroky konfigurace</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://login.ionos.com/">1&amp;1</a></td>
      <td>Přihlaste se <i class="fa fa-angle-right"></i> Centrum domén <i class="fa fa-angle-right"></i> (Vyberte svou doménu) <i class="fa fa-angle-right"></i> Upravit nastavení DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon Route 53</a></td>
      <td>Přihlaste se <i class="fa fa-angle-right"></i> Hostované zóny <i class="fa fa-angle-right"></i> (Vyberte svou doménu)</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>
      <td>Přihlaste se <i class="fa fa-angle-right"></i> Moje servery <i class="fa fa-angle-right"></i> Správa domén <i class="fa fa-angle-right"></i> Správce DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.bluehost.com/help/article/dns-management-add-edit-or-delete-dns-entries">Bluehost</a></td>
      <td>PRO ROCK: Přihlaste se <i class="fa fa-angle-right"></i> Domény <i class="fa fa-angle-right"></i> (Klikněte na ikonu ▼ vedle správy) <i class="fa fa-angle-right"></i> DNS
      <br />
      PRO LEGACY: Přihlaste se <i class="fa fa-angle-right"></i> Domény <i class="fa fa-angle-right"></i> Editor zón <i class="fa fa-angle-right"></i> (Vyberte svou doménu)</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://dash.cloudflare.com/login">Cloudflare</a></td>
      <td>Přihlaste se <i class="fa fa-angle-right"></i> DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://cp.dnsmadeeasy.com/">DNS Made Easy</a></td>
      <td>Přihlaste se <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> (Vyberte svou doménu)</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://dnsimple.com/dashboard">DNSimple</a></td>
      <td>Přihlaste se <i class="fa fa-angle-right"></i> (Vyberte svou doménu)  <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> Spravovat</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://cloud.digitalocean.com/login">Digital Ocean</a></td>
      <td>Přihlaste se <i class="fa fa-angle-right"></i> Síťování <i class="fa fa-angle-right"></i> Domény <i class="fa fa-angle-right"></i> (Vyberte svou doménu) <i class="fa fa-angle-right"></i> Více <i class="fa fa-angle-right"></i> Spravovat doménu</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.domain.com/help/article/dns-management-how-to-update-dns-records">Domain.com</a></td>
      <td>Přihlaste se <i class="fa fa-angle-right"></i> V zobrazení karet klikněte na správu své domény <i class="fa fa-angle-right"></i> V seznamu klikněte na ikonu ozubeného kola <i class="fa fa-angle-right"></i> DNS a nameservery <i class="fa fa-angle-right"></i> DNS záznamy</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://www.domains.com/">Domains.com</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=WnU0Gp-Y-es"><i class="fa fa-play-circle"></i> Sledujte</a>
      </td>
      <td>Přihlaste se <i class="fa fa-angle-right"></i> (Vyberte svou doménu) <i class="fa fa-angle-right"></i> Spravovat <i class="fa fa-angle-right"></i> (klikněte na ikonu ozubeného kola) <i class="fa fa-angle-right"></i> Klikněte na DNS &amp; Nameservers v levém menu</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://panel.dreamhost.com/">DreamHost</a></td>
      <td>Přihlaste se <i class="fa fa-angle-right"></i> Panel <i class="fa fa-angle-right"></i> Domény <i class="fa fa-angle-right"></i> Spravovat domény <i class="fa fa-angle-right"></i> DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://portal.dynect.net/login/">Dyn</a></td>
      <td>Přihlaste se <i class="fa fa-angle-right"></i> Přehled <i class="fa fa-angle-right"></i> Spravovat <i class="fa fa-angle-right"></i> Jednoduchý editor <i class="fa fa-angle-right"></i> Záznamy</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://id.gandi.net/en/login">Gandi</a></td>
      <td>Přihlaste se <i class="fa fa-angle-right"></i> (Vyberte svou doménu) <i class="fa fa-angle-right"></i> Správa <i class="fa fa-angle-right"></i> Upravit zónu</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://sso.godaddy.com">GoDaddy</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=G7g8FiZL5D8"><i class="fa fa-play-circle"></i> Sledujte</a>
      </td>
      <td>Přihlaste se <i class="fa fa-angle-right"></i> Spravovat mé domény <i class="fa fa-angle-right"></i> (Vyberte svou doménu) <i class="fa fa-angle-right"></i> Spravovat DNS</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://domains.google.com/registrar">Google Domains</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=01iHjbIN5CQ"><i class="fa fa-play-circle"></i> Sledujte</a>
      </td>
      <td>Přihlaste se <i class="fa fa-angle-right"></i> (Vyberte svou doménu) <i class="fa fa-angle-right"></i> Konfigurovat DNS</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://www.namecheap.com/myaccount/login/">Namecheap</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=no62GCzMn7E"><i class="fa fa-play-circle"></i> Sledujte</a>
      </td>
      <td>Přihlaste se <i class="fa fa-angle-right"></i> Seznam domén <i class="fa fa-angle-right"></i> (Vyberte svou doménu) <i class="fa fa-angle-right"></i> Spravovat <i class="fa fa-angle-right"></i> Pokročilý DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://app.netlify.com/">Netlify</a></td>
      <td>Přihlaste se <i class="fa fa-angle-right"></i> (Vyberte svou doménu) <i class="fa fa-angle-right"></i> Nastavit Netlify DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.networksolutions.com/manage-it/index.jsp">Network Solutions</a></td>
      <td>Přihlaste se <i class="fa fa-angle-right"></i> Správce účtu <i class="fa fa-angle-right"></i> Moje domény <i class="fa fa-angle-right"></i> (Vyberte svou doménu) <i class="fa fa-angle-right"></i> Spravovat <i class="fa fa-angle-right"></i> Změnit cílovou adresu domény <i class="fa fa-angle-right"></i> Pokročilý DNS</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://accounts.shopify.com/store-login">Shopify</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=G1NR8CIdv2M"><i class="fa fa-play-circle"></i> Sledujte</a>
      </td>
      <td>Přihlaste se <i class="fa fa-angle-right"></i> Spravované domény <i class="fa fa-angle-right"></i> (Vyberte svou doménu) <i class="fa fa-angle-right"></i> Nastavení DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://support.squarespace.com/hc/en-us/articles/214767107">Squarespace</a></td>
      <td>Přihlaste se <i class="fa fa-angle-right"></i> Hlavní menu <i class="fa fa-angle-right"></i> Nastavení <i class="fa fa-angle-right"></i> Domény <i class="fa fa-angle-right"></i> (Vyberte svou doménu) <i class="fa fa-angle-right"></i>
Pokročilá nastavení <i class="fa fa-angle-right"></i> Vlastní záznamy</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://vercel.com/docs/now-cli?utm_source=zeit-dashboard&utm_medium=web&utm_campaign=configure-dns#commands/dns">Vercel's Now</a></td>
      <td>Použijte CLI "now" <i class="fa fa-angle-right"></i> <code>now dns add [domain] '@' MX [record-value] [priority]</code></td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.weebly.com/app/help/us/en/topics/manage-dns-records">Weebly</a></td>
      <td>Přihlaste se <i class="fa fa-angle-right"></i> Stránka domén <i class="fa fa-angle-right"></i> (Vyberte svou doménu) <i class="fa fa-angle-right"></i> DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://support.wix.com/en/article/adding-dns-records-in-your-wix-account">Wix</a></td>
      <td>Přihlaste se <i class="fa fa-angle-right"></i> Stránka domén <i class="fa fa-angle-right"></i> (Klikněte na ikonu <i class="fa fa-ellipsis-h"></i>) <i class="fa fa-angle-right"></i> Vyberte Spravovat DNS záznamy</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.enom.com/login.aspx?page=%2fmyaccount%2fdefault.aspx&amp;">eNom</a></td>
      <td>Přihlaste se <i class="fa fa-angle-right"></i> Domény <i class="fa fa-angle-right"></i> Moje domény</td>
    </tr>
    <tr>
      <td>Jiný</td>
      <td>
        <div class="alert mb-0 alert-warning"><i class="fa fa-exclamation-circle font-weight-bold"></i> <strong class="font-weight-bold">Důležité:</strong> Nevidíte zde svého registrátora? Jednoduše vyhledejte na internetu "jak změnit DNS záznamy u $REGISTRATORA" (nahraďte $REGISTRATORA názvem svého registrátora – např. "jak změnit DNS záznamy u GoDaddy", pokud používáte GoDaddy).</div>
      </td>
    </tr>
  </tbody>
</table>
</li>
<li class="mb-2 mb-md-3 mb-lg-5">Pomocí stránky správy DNS u svého registrátora (tu druhou otevřenou záložku) nastavte následující "MX" záznamy:
<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Důležité:
  </strong>
  <span>
    Upozorňujeme, že nesmí být nastaveny žádné jiné MX záznamy. Oba níže uvedené záznamy MUSÍ existovat. Ujistěte se, že nejsou žádné překlepy; a že máte správně napsané oba mx1 a mx2. Pokud již existovaly nějaké MX záznamy, prosím, úplně je smažte.
    Hodnota "TTL" nemusí být 3600, může být nižší nebo vyšší, pokud je to nutné.
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Priority</th>
      <th>Answer/Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", nebo prázdné</em></td>
      <td class="text-center">3600</td>
      <td>MX</td>
      <td>0</td>
      <td><code>mx1.forwardemail.net</code></td>
    </tr>
    <tr>
      <td><em>"@", ".", nebo prázdné</em></td>
      <td class="text-center">3600</td>
      <td>MX</td>
      <td>0</td>
      <td><code>mx2.forwardemail.net</code></td>
    </tr>
  </tbody>
</table>

</li><li class="mb-2 mb-md-3 mb-lg-5" id="dns-configuration-options">Použijte stránku pro správu DNS u vašeho registrátora (druhý otevřený panel) a nastavte následující <strong class="notranslate">TXT</strong> záznam(y):

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Důležité:
  </strong>
  <span>
    Pokud máte placený tarif, tento krok úplně přeskočte a pokračujte k pátému kroku! Pokud nemáte placený tarif, vaše přeposílané adresy budou veřejně vyhledatelné – přejděte na <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Můj účet <i class="fa fa-angle-right"></i> Domény</a> a případně upgradujte svou doménu na placený tarif. Pokud chcete vědět více o placených tarifech, podívejte se na naši stránku <a rel="noopener noreferrer" href="/private-business-email" class="alert-link">Ceník</a>. Jinak můžete pokračovat a vybrat jednu nebo více kombinací z možností A až F uvedených níže.
  </span>
</div>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Možnost A:
  </strong>
  <span>
    Pokud přeposíláte všechny e-maily z vaší domény (např. "all@example.com", "hello@example.com" atd.) na konkrétní adresu "user@gmail.com":
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Answer/Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", nebo prázdné</em></td>
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
    Tip:
  </strong>
  <span>
    Nezapomeňte nahradit hodnoty výše ve sloupci "Hodnota" svou vlastní e-mailovou adresou. Hodnota "TTL" nemusí být 3600, může být nižší nebo vyšší, pokud je to nutné. Nižší hodnota "TTL" zajistí, že jakékoliv budoucí změny vašich DNS záznamů se rychleji rozšíří po internetu – představte si to jako dobu, po kterou bude hodnota uložena v paměti (v sekundách). Více se o <a href="https://en.wikipedia.org/wiki/Time_to_live#DNS_records" rel="noopener noreferrer" target="_blank" class="alert-link">TTL na Wikipedii</a> dozvíte zde.
  </span>
</div>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Možnost B:
  </strong>
  <span>
    Pokud potřebujete přeposlat pouze jednu e-mailovou adresu (např. <code>hello@example.com</code> na <code>user@gmail.com</code>; toto také automaticky přepošle "hello+test@example.com" na "user+test@gmail.com"):
  </span>
</div>
<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Jméno/Hostitel/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Odpověď/Hodnota</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", nebo prázdné</em></td>
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
    Možnost C:
  </strong>
  <span>
    Pokud přeposíláte více e-mailů, budete je chtít oddělit čárkou:
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Jméno/Hostitel/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Odpověď/Hodnota</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", nebo prázdné</em></td>
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
    Možnost D:
  </strong>
  <span>
    Můžete mít nastaven nekonečný počet přeposílacích e-mailů – jen se ujistěte, že nepřekročíte 255 znaků v jednom řádku a každý řádek začíná "forward-email=". Níže je uveden příklad:
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Jméno/Hostitel/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Odpověď/Hodnota</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", nebo prázdné</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=hello:user@gmail.com,support:user@gmail.com</code>
      </td>
    </tr>
    <tr>
      <td><em>"@", ".", nebo prázdné</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=help:user@gmail.com,foo:user@gmail.com</code>
      </td>
    </tr>
    <tr>
      <td><em>"@", ".", nebo prázdné</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=orders:user@gmail.com,baz:user@gmail.com</code>
      </td>
    </tr>
    <tr>
      <td><em>"@", ".", nebo prázdné</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=info:user@gmail.com,beep:user@gmail.com</code>
      </td>
    </tr>
    <tr>
      <td><em>"@", ".", nebo prázdné</em></td>
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
    Možnost E:
  </strong>
  <span>
    Můžete také zadat doménové jméno ve svém <strong class="notranslate">TXT</strong> záznamu pro globální přeposílání aliasů (např. "user@example.com" bude přeposílán na "user@example.net"):
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Jméno/Hostitel/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Odpověď/Hodnota</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", nebo prázdné</em></td>
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
    Možnost F:
  </strong>
  <span>
    Můžete dokonce použít webhooks jako globální nebo individuální alias pro přeposílání e-mailů. Podívejte se na příklad a celou sekci o webhooks nazvanou <a href="#do-you-support-webhooks" class="alert-link">Podporujete webhooks</a> níže.
  </span>
</div>
<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Jméno/Hostitel/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Odpověď/Hodnota</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", nebo prázdné</em></td>
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
    Možnost G:
  </strong>
  <span>
    Můžete dokonce použít regulární výrazy ("regex") pro párování aliasů a pro zpracování náhrad, kam přeposílat e-maily. Viz příklady a celá sekce o regexech s názvem <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">Podporujete regulární výrazy nebo regex</a> níže.
  </span>
</div>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Potřebujete pokročilý regex s náhradou?</strong> Viz příklady a celá sekce o regexech s názvem <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">Podporujete regulární výrazy nebo regex</a> níže.
</div>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Jednoduchý příklad:</strong> Pokud chci, aby všechny e-maily, které jdou na `linus@example.com` nebo `torvalds@example.com`, byly přeposílány na `user@gmail.com`:
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Jméno/Hostitel/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Odpověď/Hodnota</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", nebo prázdné</em></td>
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
    Důležité:
  </strong>
  <span>
    Pravidla přeposílání typu catch-all lze také popsat jako "propadnutí".
    To znamená, že příchozí e-maily, které odpovídají alespoň jednomu konkrétnímu pravidlu přeposílání, budou použity místo catch-all.
    Konkrétní pravidla zahrnují e-mailové adresy a regulární výrazy.
    <br /><br />
    Například:
    <br />
    <code>forward-email=hello:first@gmail.com,second@gmail.com</code>
    <br />
    E-maily zaslané na <code>hello@example.com</code> NEbudou přeposílány na <code>second@gmail.com</code> (catch-all) s touto konfigurací, a místo toho budou doručeny pouze na <code>first@gmail.com</code>.
  </span>
</div>

---

</li><li class="mb-2 mb-md-3 mb-lg-5">Pomocí stránky pro správu DNS vašeho registrátora (druhý otevřený panel), navíc nastavte následující <strong class="notranslate">TXT</strong> záznam:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Jméno/Hostitel/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Odpověď/Hodnota</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", nebo prázdné</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>v=spf1 a include:spf.forwardemail.net -all</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Důležité:
  </strong>
  <span>
    Pokud používáte Gmail (např. Odesílat jako) nebo G Suite, budete muset přidat <code>include:_spf.google.com</code> k výše uvedené hodnotě, například:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
  </span>
</div>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tip:
  </strong>
  <span>
    Pokud již máte podobný řádek s "v=spf1", budete muset přidat <code>include:spf.forwardemail.net</code> těsně před jakékoliv existující záznamy "include:host.com" a před "-all" ve stejném řádku, například:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
    <br /><br />
    Všimněte si, že je rozdíl mezi "-all" a "~all". "-" znamená, že kontrola SPF by měla selhat, pokud neodpovídá, a "~" znamená, že kontrola SPF by měla být SOFTFAIL. Doporučujeme použít přístup "-all" k prevenci padělání domény.
    <br /><br />
    Možná budete také muset zahrnout SPF záznam pro hostitele, ze kterého odesíláte poštu (např. Outlook).
  </span>
</div>
</li><li class="mb-2 mb-md-3 mb-lg-5">Ověřte své DNS záznamy pomocí našeho nástroje „Ověřit záznamy“, který je k dispozici na <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Můj účet <i class="fa fa-angle-right"></i> Domény</a> <i class="fa fa-angle-right"></i> Nastavení.

</li><li class="mb-2 mb-md-3 mb-lg-5">Pošlete testovací e-mail, abyste potvrdili, že vše funguje. Vezměte prosím na vědomí, že může chvíli trvat, než se vaše DNS záznamy rozšíří.

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tip:
  </strong>
  <span>
  </span>
    Pokud nedostáváte testovací e-maily, nebo obdržíte testovací e-mail s upozorněním „Buďte opatrní s touto zprávou“, podívejte se na odpovědi na <a href="#why-am-i-not-receiving-my-test-emails" class="alert-link">Proč nedostávám své testovací e-maily</a> a <a href="#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious" class="alert-link">Proč jsou mé testovací e-maily zaslané sobě v Gmailu označeny jako „podezřelé“</a>.
</div>

</li><li class="mb-2 mb-md-3 mb-lg-5">Pokud chcete „Odesílat poštu jako“ z Gmailu, budete muset <strong><a href="https://www.youtube.com/watch?v=MEheS8gM4Xs" target="_blank" rel="noopener noreferrer">shlédnout toto video</a></strong> nebo postupovat podle kroků v části <a href="#how-to-send-mail-as-using-gmail">Jak odesílat poštu jako pomocí Gmailu</a> níže.

</li></ol>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Gratulujeme!
    </strong>
    <span>
      Úspěšně jste dokončili všechny kroky.
    </span>
  </div>
</div>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tip:
  </strong>
  <span>
    Níže jsou uvedeny volitelné doplňky. Vezměte prosím na vědomí, že tyto doplňky jsou zcela volitelné a nemusí být nutné. Chtěli jsme vám alespoň poskytnout další informace, pokud by byly potřeba.
  </span>
</div>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Volitelný doplněk:
  </strong>
  <span>
    Pokud používáte funkci <a class="alert-link" href="#how-to-send-mail-as-using-gmail">Jak odesílat poštu jako pomocí Gmailu</a>, možná budete chtít přidat sebe do seznamu povolených. Podívejte se na <a class="alert-link" href="https://support.google.com/a/answer/60752?hl=en" target="_blank" rel="noopener noreferrer">tento návod od Gmailu</a> k tomuto tématu.
  </span>
</div>

### Mohu používat více MX výměníků a serverů pro pokročilé přeposílání {#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding}

Ano, ale **ve svých DNS záznamech byste měli mít uveden pouze jeden MX výměník**.

Nepokoušejte se používat „Prioritu“ jako způsob konfigurace více MX výměníků.

Místo toho musíte nakonfigurovat svůj stávající MX výměník tak, aby přeposílal poštu pro všechny neodpovídající aliasy na výměníky naší služby (`mx1.forwardemail.net` a/nebo `mx2.forwardemail.net`).

Pokud používáte Google Workspace a chcete přeposílat všechny neodpovídající aliasy na naši službu, podívejte se na <https://support.google.com/a/answer/6297084>.

Pokud používáte Microsoft 365 (Outlook) a chcete přeposílat všechny neodpovídající aliasy na naši službu, podívejte se na <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/use-connectors-to-configure-mail-flow/set-up-connectors-to-route-mail> a <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/manage-mail-flow-for-multiple-locations>.

### Jak nastavit automatickou odpověď během dovolené (out of office auto-responder) {#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder}

Přejděte na <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Můj účet <i class="fa fa-angle-right"></i> Domény</a> <i class="fa fa-angle-right"></i> Aliasy a vytvořte nebo upravte alias, pro který chcete nastavit automatickou odpověď během dovolené.
Máte možnost nastavit počáteční datum, koncové datum, předmět a zprávu a kdykoli je povolit nebo zakázat:

* Aktuálně jsou podporovány pouze prostý text předmětu a zprávy (interně používáme balíček `striptags` k odstranění jakéhokoli HTML).
* Předmět je omezen na 100 znaků.
* Zpráva je omezena na 1000 znaků.
* Nastavení vyžaduje konfiguraci odchozího SMTP (např. budete muset nastavit DKIM, DMARC a DNS záznamy Return-Path).
  * Přejděte na <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Můj účet <i class="fa fa-angle-right"></i> Domény</a> <i class="fa fa-angle-right"></i> Nastavení <i class="fa fa-angle-right"></i> Konfigurace odchozího SMTP a postupujte podle pokynů k nastavení.
* Odpověď na dovolenou nelze povolit na globálních vanity doménách (např. [jednorázové adresy](/disposable-addresses) nejsou podporovány).
* Odpověď na dovolenou nelze povolit pro aliasy s wildcard/catch-all (`*`) ani regulárními výrazy.

Na rozdíl od poštovních systémů jako `postfix` (např. které používají rozšíření filtru dovolené `sieve`) – Forward Email automaticky přidává váš DKIM podpis, zajišťuje odolnost vůči problémům s připojením při odesílání odpovědí na dovolenou (např. kvůli běžným problémům s SSL/TLS připojením a starším udržovaným serverům) a dokonce podporuje Open WKD a PGP šifrování pro odpovědi na dovolenou.

<!--
* Aby se zabránilo zneužití, za každou odeslanou zprávu odpovědi na dovolenou bude odečten jeden kredit odchozího SMTP.
  * Všechny placené účty mají ve výchozím nastavení 300 kreditů denně. Pokud potřebujete větší množství, kontaktujte nás.
-->

1. Odesíláme pouze jednou za 4 dny každému [povolnému](#do-you-have-an-allowlist) odesílateli.

   * Naše Redis cache používá otisk prstu `alias_id` a `sender`, kde `alias_id` je MongoDB ID aliasu a `sender` je buď adresa From (pokud je povolená) nebo kořenová doména v adrese From (pokud není povolená). Pro jednoduchost je doba platnosti tohoto otisku v cache nastavena na 4 dny.

   * Náš přístup používající kořenovou doménu analyzovanou z adresy From pro nepovolené odesílatele zabraňuje zneužití od relativně neznámých odesílatelů (např. škodlivých aktérů) zaplavujících odpovědi na dovolenou.

2. Odesíláme pouze pokud MAIL FROM a/nebo From není prázdný a neobsahuje (bez ohledu na velikost písmen) [uživatelské jméno postmastera](#what-are-postmaster-addresses) (část před @ v e-mailu).

3. Neodesíláme, pokud původní zpráva obsahovala některý z následujících hlaviček (bez ohledu na velikost písmen):

   * Hlavička `auto-submitted` s hodnotou odlišnou od `no`.
   * Hlavička `x-auto-response-suppress` s hodnotou `dr`, `autoreply`, `auto-reply`, `auto_reply` nebo `all`.
   * Hlavička `list-id`, `list-subscribe`, `list-unsubscribe`, `list-help`, `list-post`, `list-owner`, `list-archive`, `x-autoreply`, `x-autorespond` nebo `x-auto-respond` (bez ohledu na hodnotu).
   * Hlavička `precedence` s hodnotou `bulk`, `autoreply`, `auto-reply`, `auto_reply` nebo `list`.

4. Neodesíláme, pokud e-mailová adresa MAIL FROM nebo From končí na `+donotreply`, `-donotreply`, `+noreply` nebo `-noreply`.

5. Neodesíláme, pokud uživatelská část e-mailové adresy From byla `mdaemon` a obsahovala bez ohledu na velikost písmen hlavičku `X-MDDSN-Message`.

6. Neodesíláme, pokud byla bez ohledu na velikost písmen hlavička `content-type` s hodnotou `multipart/report`.

### Jak nastavit SPF pro Forward Email {#how-do-i-set-up-spf-for-forward-email}

Pomocí stránky pro správu DNS u vašeho registrátora nastavte následující <strong class="notranslate">TXT</strong> záznam:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Název/Hostitel/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Odpověď/Hodnota</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", nebo prázdné</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>v=spf1 a include:spf.forwardemail.net -all</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Důležité:
  </strong>
  <span>
    Pokud používáte Gmail (např. Odesílat poštu jako) nebo G Suite, budete muset k výše uvedené hodnotě přidat <code>include:_spf.google.com</code>, například:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
  </span>
</div>
<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Důležité:
  </strong>
  <span>
    Pokud používáte Microsoft Outlook nebo Live.com, musíte do svého SPF <strong class="notranslate">TXT</strong> záznamu přidat <code>include:spf.protection.outlook.com</code>, například:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:spf.protection.outlook.com -all</code>
  </span>
</div>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tip:
  </strong>
  <span>
    Pokud již máte podobný řádek s "v=spf1", musíte přidat <code>include:spf.forwardemail.net</code> těsně před jakékoliv existující záznamy "include:host.com" a před "-all" ve stejném řádku, například:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
    <br /><br />
    Všimněte si, že je rozdíl mezi "-all" a "~all". "-" znamená, že SPF kontrola by měla selhat, pokud nesouhlasí, a "~" znamená, že SPF kontrola by měla být SOFTFAIL. Doporučujeme použít přístup "-all" k prevenci padělání domény.
    <br /><br />
    Možná budete také muset zahrnout SPF záznam pro hostitele, ze kterého odesíláte poštu (např. Outlook).
  </span>
</div>

### Jak nastavit DKIM pro Forward Email {#how-do-i-set-up-dkim-for-forward-email}

Přejděte na <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Můj účet <i class="fa fa-angle-right"></i> Domény</a> <i class="fa fa-angle-right"></i> Nastavení <i class="fa fa-angle-right"></i> Konfigurace odchozího SMTP a postupujte podle pokynů pro nastavení.

### Jak nastavit DMARC pro Forward Email {#how-do-i-set-up-dmarc-for-forward-email}

Přejděte na <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Můj účet <i class="fa fa-angle-right"></i> Domény</a> <i class="fa fa-angle-right"></i> Nastavení <i class="fa fa-angle-right"></i> Konfigurace odchozího SMTP a postupujte podle pokynů pro nastavení.

### Jak zobrazit DMARC zprávy {#how-do-i-view-dmarc-reports}

Forward Email poskytuje komplexní přehled DMARC zpráv, který vám umožní sledovat výkon autentizace e-mailů napříč všemi vašimi doménami z jednoho rozhraní.

**Co jsou DMARC zprávy?**

DMARC (Domain-based Message Authentication, Reporting, and Conformance) zprávy jsou XML soubory zasílané přijímajícími mail servery, které vám říkají, jak jsou vaše e-maily autentizovány. Tyto zprávy vám pomáhají pochopit:

* Kolik e-mailů je odesíláno z vaší domény
* Zda tyto e-maily procházejí SPF a DKIM autentizací
* Jaké akce přijímající servery provádějí (přijmout, karanténa nebo odmítnout)
* Které IP adresy odesílají e-maily jménem vaší domény

**Jak získat přístup k DMARC zprávám**

Přejděte na <a href="/my-account/dmarc-reports" class="alert-link" target="_blank" rel="noopener noreferrer">Můj účet <i class="fa fa-angle-right"></i> DMARC zprávy</a> pro zobrazení vašeho přehledu. Můžete také získat přístup ke zprávám specifickým pro doménu z <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Můj účet <i class="fa fa-angle-right"></i> Domény</a> kliknutím na tlačítko "DMARC" vedle libovolné domény.

**Funkce přehledu**

Přehled DMARC zpráv nabízí:

* **Souhrnné metriky**: Celkový počet přijatých zpráv, celkový počet analyzovaných zpráv, míra shody SPF, míra shody DKIM a celková míra úspěšnosti
* **Graf zpráv v čase**: Vizualizace trendu objemu e-mailů a míry autentizace za posledních 30 dní
* **Souhrn shody**: Kruhový graf zobrazující rozdělení shody SPF vs DKIM
* **Disposition zpráv**: Skládaný sloupcový graf ukazující, jak přijímající servery nakládaly s vašimi e-maily (přijaty, v karanténě nebo odmítnuty)
* **Tabulka posledních zpráv**: Podrobný seznam jednotlivých DMARC zpráv s filtrováním a stránkováním
* **Filtrování podle domény**: Filtrování zpráv podle konkrétní domény při správě více domén
**Proč je to důležité**

Pro organizace spravující více domén (jako jsou podniky, neziskové organizace nebo agentury) jsou DMARC reporty nezbytné pro:

* **Identifikaci neoprávněných odesílatelů**: Zjistit, zda někdo nefalšuje vaši doménu
* **Zlepšení doručitelnosti**: Zajistit, aby vaše legitimní e-maily prošly autentizací
* **Monitorování e-mailové infrastruktury**: Sledovat, které služby a IP adresy odesílají e-maily vaším jménem
* **Soulad s předpisy**: Udržovat přehled o autentizaci e-mailů pro bezpečnostní audity

Na rozdíl od jiných služeb, které vyžadují samostatné nástroje pro monitorování DMARC, Forward Email zahrnuje zpracování a vizualizaci DMARC reportů jako součást vašeho účtu bez dalších nákladů.

**Požadavky**

* DMARC reporty jsou dostupné pouze pro placené plány
* Vaše doména musí mít nakonfigurovaný DMARC (viz [Jak nastavit DMARC pro Forward Email](#how-do-i-set-up-dmarc-for-forward-email))
* Reporty jsou automaticky sbírány, když příchozí mail servery odesílají reporty na vaši nakonfigurovanou DMARC adresu pro reportování

**Týdenní e-mailové reporty**

Uživatelé placených plánů automaticky dostávají týdenní souhrnné DMARC reporty e-mailem. Tyto e-maily obsahují:

* Souhrnné statistiky pro všechny vaše domény
* Míru shody SPF a DKIM
* Rozdělení výsledků zpráv (přijato, karanténa, odmítnuto)
* Nejčastější reportující organizace (Google, Microsoft, Yahoo, atd.)
* IP adresy s problémy se shodou, které mohou vyžadovat pozornost
* Přímé odkazy na váš DMARC Reports dashboard

Týdenní reporty jsou odesílány automaticky a nelze je vypnout samostatně od ostatních e-mailových oznámení.

### Jak připojit a nakonfigurovat své kontakty {#how-do-i-connect-and-configure-my-contacts}

**Pro konfiguraci kontaktů použijte CardDAV URL:** `https://carddav.forwardemail.net` (nebo jednoduše `carddav.forwardemail.net`, pokud to váš klient umožňuje)

### Jak připojit a nakonfigurovat své kalendáře {#how-do-i-connect-and-configure-my-calendars}

**Pro konfiguraci kalendáře použijte CalDAV URL:** `https://caldav.forwardemail.net` (nebo jednoduše `caldav.forwardemail.net`, pokud to váš klient umožňuje)

<img width="612" height="520" src="/img/faq/calendar-setup.png" alt="Forward Email Calendar CalDAV Thunderbird Example Setup" />

### Jak přidat další kalendáře a spravovat stávající kalendáře {#how-do-i-add-more-calendars-and-manage-existing-calendars}

Pokud chcete přidat další kalendáře, stačí přidat novou URL kalendáře: `https://caldav.forwardemail.net/dav/principals/calendar-name` (**nezapomeňte nahradit `calendar-name` požadovaným názvem kalendáře**)

Název a barvu kalendáře můžete změnit po jeho vytvoření – použijte svůj preferovaný kalendářový program (např. Apple Mail nebo [Thunderbird](https://thunderbird.net)).

### Jak připojit a nakonfigurovat úkoly a připomínky {#how-do-i-connect-and-configure-tasks-and-reminders}

**Pro konfiguraci úkolů a připomínek použijte stejnou CalDAV URL jako pro kalendáře:** `https://caldav.forwardemail.net` (nebo jednoduše `caldav.forwardemail.net`, pokud to váš klient umožňuje)

Úkoly a připomínky budou automaticky odděleny od událostí kalendáře do samostatné kolekce kalendářů "Reminders" nebo "Tasks".

**Instrukce pro nastavení podle platformy:**

**macOS/iOS:**

1. Přidejte nový CalDAV účet v Systémových preferencích > Internetové účty (nebo Nastavení > Účty na iOS)
2. Použijte `caldav.forwardemail.net` jako server
3. Zadejte svůj Forward Email alias a vygenerované heslo
4. Po nastavení uvidíte kolekce "Calendar" a "Reminders"
5. Používejte aplikaci Připomínky pro vytváření a správu úkolů

**Android s Tasks.org:**

1. Nainstalujte Tasks.org z Google Play Store nebo F-Droid
2. Přejděte do Nastavení > Synchronizace > Přidat účet > CalDAV
3. Zadejte server: `https://caldav.forwardemail.net`
4. Zadejte svůj Forward Email alias a vygenerované heslo
5. Tasks.org automaticky najde vaše kalendáře úkolů

**Thunderbird:**

1. Nainstalujte doplněk Lightning, pokud již není nainstalován
2. Vytvořte nový kalendář typu "CalDAV"
3. Použijte URL: `https://caldav.forwardemail.net`
4. Zadejte své přihlašovací údaje Forward Email
5. Události i úkoly budou dostupné v kalendářovém rozhraní

### Proč nemohu vytvářet úkoly v macOS Připomínkách {#why-cant-i-create-tasks-in-macos-reminders}
Pokud máte potíže s vytvářením úkolů v macOS Připomínkách, vyzkoušejte tyto kroky pro řešení problémů:

1. **Zkontrolujte nastavení účtu**: Ujistěte se, že váš CalDAV účet je správně nakonfigurován s `caldav.forwardemail.net`

2. **Ověřte samostatné kalendáře**: Ve svém účtu byste měli vidět jak "Kalendář", tak "Připomínky". Pokud vidíte pouze "Kalendář", podpora úkolů nemusí být ještě plně aktivována.

3. **Obnovte účet**: Zkuste odebrat a znovu přidat svůj CalDAV účet v Systémových předvolbách > Internetové účty

4. **Zkontrolujte připojení k serveru**: Ověřte, že můžete v prohlížeči přistoupit na `https://caldav.forwardemail.net`

5. **Ověřte přihlašovací údaje**: Ujistěte se, že používáte správný alias e-mailu a vygenerované heslo (nikoli heslo k účtu)

6. **Vynucení synchronizace**: V aplikaci Připomínky zkuste vytvořit úkol a poté ručně obnovit synchronizaci

**Běžné problémy:**

* **"Kalendář Připomínek nenalezen"**: Server může potřebovat chvíli na vytvoření kolekce Připomínek při prvním přístupu
* **Úkoly se nesynchronizují**: Zkontrolujte, že obě zařízení používají stejné přihlašovací údaje CalDAV účtu
* **Smíšený obsah**: Ujistěte se, že úkoly jsou vytvářeny v kalendáři "Připomínky", nikoli v obecném "Kalendáři"

### Jak nastavit Tasks.org na Androidu {#how-do-i-set-up-tasksorg-on-android}

Tasks.org je populární open-source správce úkolů, který skvěle funguje s podporou úkolů CalDAV od Forward Email.

**Instalace a nastavení:**

1. **Nainstalujte Tasks.org**:
   * Z Google Play Store: [Tasks.org](https://play.google.com/store/apps/details?id=org.tasks)
   * Z F-Droid: [Tasks.org na F-Droid](https://f-droid.org/packages/org.tasks/)

2. **Nastavte synchronizaci CalDAV**:
   * Otevřete Tasks.org
   * Přejděte do ☰ Menu > Nastavení > Synchronizace
   * Klepněte na "Přidat účet"
   * Vyberte "CalDAV"

3. **Zadejte nastavení Forward Email**:
   * **URL serveru**: `https://caldav.forwardemail.net`
   * **Uživatelské jméno**: Váš alias Forward Email (např. `vy@vasedomena.cz`)
   * **Heslo**: Vaše alias-specifické vygenerované heslo
   * Klepněte na "Přidat účet"

4. **Objevování účtu**:
   * Tasks.org automaticky najde vaše kalendáře úkolů
   * Měli byste vidět kolekci "Připomínky"
   * Klepněte na "Odebírat" pro povolení synchronizace kalendáře úkolů

5. **Otestujte synchronizaci**:
   * Vytvořte testovací úkol v Tasks.org
   * Zkontrolujte, že se zobrazí v jiných CalDAV klientech (např. macOS Připomínky)
   * Ověřte, že změny se synchronizují obousměrně

**Dostupné funkce:**

* ✅ Vytváření a úprava úkolů
* ✅ Termíny a připomínky
* ✅ Dokončení úkolů a stav
* ✅ Úrovně priority
* ✅ Podúkoly a hierarchie úkolů
* ✅ Štítky a kategorie
* ✅ Obousměrná synchronizace s ostatními CalDAV klienty

**Řešení problémů:**

* Pokud se nezobrazují žádné kalendáře úkolů, zkuste ručně obnovit v nastavení Tasks.org
* Ujistěte se, že máte na serveru alespoň jeden vytvořený úkol (můžete ho nejprve vytvořit v macOS Připomínkách)
* Zkontrolujte síťové připojení k `caldav.forwardemail.net`

### Jak nastavit SRS pro Forward Email {#how-do-i-set-up-srs-for-forward-email}

Automaticky konfigurujeme [Sender Rewriting Scheme](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme) ("SRS") – nemusíte to dělat sami.

### Jak nastavit MTA-STS pro Forward Email {#how-do-i-set-up-mta-sts-for-forward-email}

Podrobnější informace naleznete v [naší sekci o MTA-STS](#do-you-support-mta-sts).

### Jak přidat profilovou fotku k mé e-mailové adrese {#how-do-i-add-a-profile-picture-to-my-email-address}

Pokud používáte Gmail, postupujte podle těchto kroků:

1. Přejděte na <https://google.com> a odhlaste se ze všech e-mailových účtů
2. Klikněte na "Přihlásit se" a v rozbalovacím menu vyberte "jiný účet"
3. Vyberte "Použít jiný účet"
4. Vyberte "Vytvořit účet"
5. Vyberte "Použít místo toho svou aktuální e-mailovou adresu"
6. Zadejte svou e-mailovou adresu s vlastní doménou
7. Získejte ověřovací e-mail zaslaný na vaši e-mailovou adresu
8. Zadejte ověřovací kód z tohoto e-mailu
9. Dokončete informace o profilu pro svůj nový Google účet
10. Souhlasíte se všemi zásadami ochrany soukromí a podmínkami použití
11. Přejděte na <https://google.com>, v pravém horním rohu klikněte na ikonu profilu a poté na tlačítko "změnit"
12. Nahrajte novou fotografii nebo avatar pro svůj účet
13. Změny se projeví přibližně za 1-2 hodiny, někdy mohou být velmi rychlé.
14. Pošlete testovací e-mail a profilová fotka by se měla zobrazit.
## Pokročilé funkce {#advanced-features}

### Podporujete newslettery nebo mailing listy pro marketingové e-maily {#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email}

Ano, více si můžete přečíst na <https://forwardemail.net/guides/newsletter-with-listmonk>.

Vezměte prosím na vědomí, že pro udržení reputace IP a zajištění doručitelnosti má Forward Email manuální proces schvalování na úrovni jednotlivých domén pro **schválení newsletteru**. Napište na <support@forwardemail.net> nebo otevřete [žádost o pomoc](https://forwardemail.net/help) pro schválení. Tento proces obvykle trvá méně než 24 hodin, většina žádostí je vyřízena během 1-2 hodin. V blízké budoucnosti plánujeme tento proces zautomatizovat s dalšími kontrolami spamu a upozorněními. Tento proces zajišťuje, že vaše e-maily dorazí do schránky a vaše zprávy nebudou označeny jako spam.

### Podporujete odesílání e-mailů přes API {#do-you-support-sending-email-with-api}

Ano, od května 2023 podporujeme odesílání e-mailů přes API jako doplněk pro všechny placené uživatele.

<div class="alert my-3 alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Důležité:
  </strong>
  <span>
    Ujistěte se, že jste si přečetli naše <a href="/terms" class="alert-link" target="_blank">Podmínky</a>, <a href="/privacy" class="alert-link" target="_blank">Zásady ochrany osobních údajů</a> a <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Limity odchozího SMTP</a> &ndash; vaše používání je považováno za potvrzení a souhlas.
  </span>
</div>

Podívejte se na naši sekci o [E-mailech](/email-api#outbound-emails) v dokumentaci API pro možnosti, příklady a další informace.

Pro odesílání odchozích e-mailů přes naše API musíte použít svůj API token dostupný v sekci [Moje bezpečnost](/my-account/security).

### Podporujete příjem e-mailů přes IMAP {#do-you-support-receiving-email-with-imap}

Ano, od 16. října 2023 podporujeme příjem e-mailů přes IMAP jako doplněk pro všechny placené uživatele.  **Přečtěte si prosím náš podrobný článek** o [tom, jak funguje naše šifrovaná SQLite schránka](/blog/docs/best-quantum-safe-encrypted-email-service).

<div id="imap-instructions">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Důležité:
  </strong>
  <span>
    Ujistěte se, že jste si přečetli naše <a href="/terms" class="alert-link" target="_blank">Podmínky</a> a <a href="/privacy" class="alert-link" target="_blank">Zásady ochrany osobních údajů</a> &ndash; vaše používání je považováno za potvrzení a souhlas.
  </span>
</div>

1. Vytvořte nový alias pro svou doménu v <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Můj účet <i class="fa fa-angle-right"></i> Domény</a> <i class="fa fa-angle-right"></i> Aliasy (např. <code><hello@example.com></code>)

2. Klikněte na <strong class="text-success"><i class="fa fa-key"></i> Vygenerovat heslo</strong> vedle nově vytvořeného aliasu. Zkopírujte do schránky a bezpečně uložte zobrazené heslo.

3. Ve své preferované e-mailové aplikaci přidejte nebo nakonfigurujte účet s nově vytvořeným aliasem (např. <code><hello@example.com></code>)
   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tip:
     </strong>
     <span>Doporučujeme používat <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a> nebo <a href="/blog/open-source" class="alert-link" target="_blank">otevřenou a soukromí zaměřenou alternativu</a>.</span>
   </div>

4. Když budete vyzváni k zadání názvu IMAP serveru, zadejte `imap.forwardemail.net`

5. Když budete vyzváni k zadání portu IMAP serveru, zadejte `993` (SSL/TLS) – v případě potřeby viz [alternativní IMAP porty](/faq#what-are-your-imap-server-configuration-settings)
   <div class="alert my-3 alert-warning">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tip:
     </strong>
     <span>Pokud používáte Thunderbird, ujistěte se, že "Zabezpečení připojení" je nastaveno na "SSL/TLS" a Metoda ověřování na "Normální heslo".</span>
   </div>
6. Když budete vyzváni k zadání hesla k IMAP serveru, vložte heslo z <strong class="text-success"><i class="fa fa-key"></i> Vygenerovat heslo</strong> v kroku 2 výše

7. **Uložte svá nastavení** – pokud máte problémy, prosím <a href="/help">kontaktujte nás</a>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Gratulujeme!
    </strong>
    <span>
      Úspěšně jste dokončili všechny kroky.
    </span>
  </div>
</div>

</div>

### Podporujete POP3 {#do-you-support-pop3}

Ano, od 4. prosince 2023 podporujeme [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol) jako doplněk pro všechny placené uživatele.  **Přečtěte si náš podrobný článek** o [tom, jak funguje naše šifrovaná SQLite schránka](/blog/docs/best-quantum-safe-encrypted-email-service).

<div id="pop3-instructions">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Důležité:
  </strong>
  <span>
    Ujistěte se, že jste si přečetli naše <a href="/terms" class="alert-link" target="_blank">Podmínky</a> a <a href="/privacy" class="alert-link" target="_blank">Zásady ochrany osobních údajů</a> &ndash; vaše používání je považováno za potvrzení a souhlas.
  </span>
</div>

1. Vytvořte nový alias pro vaši doménu v <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Můj účet <i class="fa fa-angle-right"></i> Domény</a> <i class="fa fa-angle-right"></i> Aliasy (např. <code><hello@example.com></code>)

2. Klikněte na <strong class="text-success"><i class="fa fa-key"></i> Vygenerovat heslo</strong> vedle nově vytvořeného aliasu.  Zkopírujte do schránky a bezpečně uložte zobrazené heslo.

3. Pomocí preferované e-mailové aplikace přidejte nebo nakonfigurujte účet s vaším nově vytvořeným aliasem (např. <code><hello@example.com></code>)
   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tip:
     </strong>
     <span>Doporučujeme používat <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a> nebo <a href="/blog/open-source" class="alert-link" target="_blank">otevřenou a soukromí zaměřenou alternativu</a>.</span>
   </div>

4. Když budete vyzváni k zadání názvu POP3 serveru, zadejte `pop3.forwardemail.net`

5. Když budete vyzváni k zadání portu POP3 serveru, zadejte `995` (SSL/TLS) – v případě potřeby viz [alternativní POP3 porty](/faq#what-are-your-pop3-server-configuration-settings)
   <div class="alert my-3 alert-warning">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tip:
     </strong>
     <span>Pokud používáte Thunderbird, ujistěte se, že "Zabezpečení připojení" je nastaveno na "SSL/TLS" a Metoda ověřování na "Normální heslo".</span>
   </div>

6. Když budete vyzváni k zadání hesla k POP3 serveru, vložte heslo z <strong class="text-success"><i class="fa fa-key"></i> Vygenerovat heslo</strong> v kroku 2 výše

7. **Uložte svá nastavení** – pokud máte problémy, prosím <a href="/help">kontaktujte nás</a>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Gratulujeme!
    </strong>
    <span>
      Úspěšně jste dokončili všechny kroky.
    </span>
  </div>
</div>

</div>

### Podporujete kalendáře (CalDAV) {#do-you-support-calendars-caldav}

Ano, od 5. února 2024 jsme tuto funkci přidali. Náš server je `caldav.forwardemail.net` a je také monitorován na naší <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">stavové stránce</a>.
Podporuje jak IPv4, tak IPv6 a je dostupný přes port `443` (HTTPS).

| Přihlášení | Příklad                    | Popis                                                                                                                                                                                    |
| ---------- | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Uživatelské jméno | `user@example.com`         | Emailová adresa aliasu, který existuje pro doménu na <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Můj účet <i class="fa fa-angle-right"></i> Domény</a>.          |
| Heslo      | `************************` | Alias-specifické generované heslo.                                                                                                                                                       |

Pro použití podpory kalendáře musí být **uživatel** emailovou adresou aliasu, který existuje pro doménu na <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Můj účet <i class="fa fa-angle-right"></i> Domény</a> – a **heslo** musí být alias-specifické generované heslo.

### Podporujete úkoly a připomínky (CalDAV VTODO) {#do-you-support-tasks-and-reminders-caldav-vtodo}

Ano, od 14. října 2025 jsme přidali podporu CalDAV VTODO pro úkoly a připomínky. Používá stejný server jako naše podpora kalendáře: `caldav.forwardemail.net`.

Náš CalDAV server podporuje jak kalendářové události (VEVENT), tak komponenty úkolů (VTODO) pomocí **sjednocených kalendářů**. To znamená, že každý kalendář může obsahovat jak události, tak úkoly, což poskytuje maximální flexibilitu a kompatibilitu se všemi CalDAV klienty.

**Jak kalendáře a seznamy fungují:**

* **Každý kalendář podporuje jak události, tak úkoly** – Můžete přidávat události, úkoly nebo obojí do libovolného kalendáře
* **Seznamy Apple Připomínek** – Každý seznam, který vytvoříte v Apple Připomínkách, se stane samostatným kalendářem na serveru
* **Více kalendářů** – Můžete vytvořit tolik kalendářů, kolik potřebujete, každý s vlastním názvem, barvou a organizací
* **Synchronizace mezi klienty** – Úkoly a události se bez problémů synchronizují mezi všemi kompatibilními klienty

**Podporovaní klienti úkolů:**

* **macOS Připomínky** – Plná nativní podpora vytváření, úprav, dokončení a synchronizace úkolů
* **iOS Připomínky** – Plná nativní podpora na všech iOS zařízeních
* **Tasks.org (Android)** – Oblíbený open-source správce úkolů s CalDAV synchronizací
* **Thunderbird** – Podpora úkolů a kalendáře v desktopovém emailovém klientu
* **Jakýkoli CalDAV-kompatibilní správce úkolů** – Standardní podpora komponenty VTODO

**Podporované funkce úkolů:**

* Vytváření, úprava a mazání úkolů
* Termíny a data zahájení
* Stav dokončení úkolu (NEEDS-ACTION, IN-PROCESS, COMPLETED, CANCELLED)
* Úrovně priority úkolů
* Opakující se úkoly
* Popisy a poznámky k úkolům
* Synchronizace na více zařízeních
* Podúkoly s vlastností RELATED-TO
* Připomínky úkolů s VALARM

Přihlašovací údaje jsou stejné jako pro podporu kalendáře:

| Přihlášení | Příklad                    | Popis                                                                                                                                                                                    |
| ---------- | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Uživatelské jméno | `user@example.com`         | Emailová adresa aliasu, který existuje pro doménu na <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Můj účet <i class="fa fa-angle-right"></i> Domény</a>.          |
| Heslo      | `************************` | Alias-specifické generované heslo.                                                                                                                                                       |

**Důležité poznámky:**

* **Každý seznam Připomínek je samostatný kalendář** – Když vytvoříte nový seznam v Apple Připomínkách, vytvoří se nový kalendář na CalDAV serveru
* **Uživatelé Thunderbirdu** – Budete muset ručně přihlásit každý kalendář/seznam, který chcete synchronizovat, nebo použít URL domovské stránky kalendáře: `https://caldav.forwardemail.net/dav/your-email@domain.com/`
* **Uživatelé Apple** – Objevování kalendářů probíhá automaticky, takže všechny vaše kalendáře a seznamy se zobrazí v Calendar.app a Reminders.app
* **Sjednocené kalendáře** – Všechny kalendáře podporují jak události, tak úkoly, což vám dává flexibilitu v organizaci vašich dat
### Podporujete kontakty (CardDAV) {#do-you-support-contacts-carddav}

Ano, od 12. června 2025 jsme tuto funkci přidali. Náš server je `carddav.forwardemail.net` a je také monitorován na naší <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">stavové stránce</a>.

Podporuje jak IPv4, tak IPv6 a je dostupný přes port `443` (HTTPS).

| Přihlášení | Příklad                    | Popis                                                                                                                                                                                    |
| ---------- | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Uživatelské jméno | `user@example.com`         | Emailová adresa aliasu, který existuje pro doménu na <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Můj účet <i class="fa fa-angle-right"></i> Domény</a>.          |
| Heslo      | `************************` | Alias-specifické generované heslo.                                                                                                                                                       |

Pro použití podpory kontaktů musí být **uživatel** emailová adresa aliasu, který existuje pro doménu na <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Můj účet <i class="fa fa-angle-right"></i> Domény</a> – a **heslo** musí být alias-specifické generované heslo.

### Podporujete odesílání emailů přes SMTP {#do-you-support-sending-email-with-smtp}

Ano, od května 2023 podporujeme odesílání emailů přes SMTP jako doplněk pro všechny placené uživatele.

<div id="smtp-instructions">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Důležité:
  </strong>
  <span>
    Ujistěte se, že jste si přečetli naše <a href="/terms" class="alert-link" target="_blank">Podmínky</a>, <a href="/privacy" class="alert-link" target="_blank">Zásady ochrany osobních údajů</a> a <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Limity odchozího SMTP</a> – vaše používání je považováno za potvrzení a souhlas.
  </span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Důležité:
  </strong>
  <span>
    Pokud používáte Gmail, podívejte se na náš <a class="alert-link" href="/guides/send-mail-as-gmail-custom-domain">návod Odesílat poštu jako s Gmail vlastním doménovým jménem</a>. Pokud jste vývojář, podívejte se na naše <a class="alert-link" href="/email-api#outbound-emails" target="_blank">dokumenty emailového API</a>.
  </span>
</div>

1. Přejděte na <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Můj účet <i class="fa fa-angle-right"></i> Domény</a> <i class="fa fa-angle-right"></i> Nastavení <i class="fa fa-angle-right"></i> Konfigurace odchozího SMTP a postupujte podle pokynů pro nastavení

2. Vytvořte nový alias pro vaši doménu v <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Můj účet <i class="fa fa-angle-right"></i> Domény</a> <i class="fa fa-angle-right"></i> Aliasy (např. <code><hello@example.com></code>)

3. Klikněte na <strong class="text-success"><i class="fa fa-key"></i> Vygenerovat heslo</strong> vedle nově vytvořeného aliasu. Zkopírujte do schránky a bezpečně uložte zobrazené generované heslo.

4. Pomocí preferované emailové aplikace přidejte nebo nakonfigurujte účet s vaším nově vytvořeným aliasem (např. <code><hello@example.com></code>)
   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tip:
     </strong>
     <span>Doporučujeme používat <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a> nebo <a href="/blog/open-source" class="alert-link" target="_blank">otevřenou a na soukromí zaměřenou alternativu</a>.</span>
   </div>
5. Když budete vyzváni k zadání názvu SMTP serveru, zadejte `smtp.forwardemail.net`

6. Když budete vyzváni k zadání portu SMTP serveru, zadejte `465` (SSL/TLS) – v případě potřeby viz [alternativní SMTP porty](/faq#what-are-your-smtp-server-configuration-settings)
   <div class="alert my-3 alert-warning">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tip:
     </strong>
     <span>Pokud používáte Thunderbird, ujistěte se, že je „Zabezpečení připojení“ nastaveno na „SSL/TLS“ a metoda ověřování na „Normální heslo“.</span>
   </div>

7. Když budete vyzváni k zadání hesla SMTP serveru, vložte heslo z <strong class="text-success"><i class="fa fa-key"></i> Vygenerovat heslo</strong> v kroku 3 výše

8. **Uložte svá nastavení a odešlete svůj první testovací e-mail** – pokud máte problémy, prosím <a href="/help">kontaktujte nás</a>

<div class="alert my-3 alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Důležité:
  </strong>
  <span>
    Vezměte prosím na vědomí, že pro udržení reputace IP a zajištění doručitelnosti máme manuální proces kontroly na základě jednotlivých domén pro schválení odchozího SMTP. Tento proces obvykle trvá méně než 24 hodin, přičemž většina žádostí je vyřízena během 1-2 hodin. V blízké budoucnosti plánujeme tento proces zrychlit na okamžitý s dalšími kontrolami spamu a upozorněními. Tento proces zajišťuje, že vaše e-maily dorazí do schránky a vaše zprávy nebudou označeny jako spam.
  </span>
</div>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Gratulujeme!
    </strong>
    <span>
      Úspěšně jste dokončili všechny kroky.
    </span>
  </div>
</div>

</div>

### Podporujete OpenPGP/MIME, end-to-end šifrování („E2EE“) a Web Key Directory („WKD“)? {#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd}

Ano, podporujeme [OpenPGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy#OpenPGP), [end-to-end šifrování („E2EE“)](https://en.wikipedia.org/wiki/End-to-end_encryption) a vyhledávání veřejných klíčů pomocí [Web Key Directory („WKD“)](https://wiki.gnupg.org/WKD). OpenPGP můžete nakonfigurovat pomocí [keys.openpgp.org](https://keys.openpgp.org/about/usage#wkd-as-a-service) nebo [hostovat vlastní klíče](https://wiki.gnupg.org/WKDHosting) (viz [tento gist pro nastavení WKD serveru](https://gist.github.com/kafene/0a6e259996862d35845784e6e5dbfc79)).

* Vyhledávání WKD je kešováno po dobu 1 hodiny, aby byla zajištěna včasná doručitelnost e-mailů → pokud přidáte, změníte nebo odstraníte svůj WKD klíč, zašlete nám prosím e-mail na `support@forwardemail.net` s vaší e-mailovou adresou, abychom mohli manuálně vymazat keš.
* Podporujeme PGP šifrování pro zprávy přeposílané přes WKD vyhledávání nebo pomocí nahraného PGP klíče v našem rozhraní.
* Nahrané klíče mají přednost, pokud je zaškrtnuto políčko PGP.
* Zprávy odeslané na webhooky momentálně nejsou šifrovány pomocí PGP.
* Pokud máte více aliasů, které odpovídají dané přeposílací adrese (např. kombinace regex/wildcard/přesná shoda) a pokud více z nich obsahuje nahraný PGP klíč a je zaškrtnuto PGP → zašleme vám chybové upozornění e-mailem a zprávu nezašifrujeme vaším nahraným PGP klíčem. Toto je velmi vzácné a obvykle se týká pokročilých uživatelů s komplexními pravidly aliasů.
* **PGP šifrování nebude aplikováno na přeposílání e-mailů přes naše MX servery, pokud odesílatel měl DMARC politiku reject. Pokud potřebujete PGP šifrování na *všechny* zprávy, doporučujeme použít naši IMAP službu a nakonfigurovat svůj PGP klíč pro váš alias pro příchozí poštu.**

**Svou konfiguraci Web Key Directory můžete ověřit na <https://wkd.chimbosonic.com/> (open-source) nebo <https://www.webkeydirectory.com/> (proprietární).**

<div class="alert my-3 alert-success">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Automatické šifrování:
  </strong>
  <span>Pokud používáte naši <a href="#do-you-support-sending-email-with-smtp" class="alert-link">odchozí SMTP službu</a> a odesíláte nešifrované zprávy, automaticky se pokusíme zprávy na základě příjemce zašifrovat pomocí <a class="alert-link" href="https://wiki.gnupg.org/WKD">Web Key Directory („WKD“)</a>.</span>
</div>
<div class="alert alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Důležité:
  </strong>
  <span>
    Musíte dodržet všechny následující kroky, abyste povolili OpenPGP pro vaši vlastní doménu.
  </span>
</div>

1. Stáhněte a nainstalujte doporučený plugin pro váš e-mailový klient níže:

   | E-mailový klient | Platforma | Doporučený plugin                                                                                                                                                                    | Poznámky                                                                                                                                                                                                                                                                                                                                                                                                                                    |
   | --------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | Thunderbird     | Desktop  | [Nastavení OpenPGP v Thunderbirdu](https://support.mozilla.org/en-US/kb/openpgp-thunderbird-howto-and-faq#w_i-have-never-used-openpgp-with-thunderbird-before-how-do-i-setup-openpgp) | Thunderbird má vestavěnou podporu pro OpenPGP.                                                                                                                                                                                                                                                                                                                                                                                            |
   | Gmail           | Prohlížeč | [Mailvelope](https://mailvelope.com/) nebo [FlowCrypt](https://flowcrypt.com/download) (proprietární licence)                                                                            | Gmail nepodporuje OpenPGP, ale můžete si stáhnout open-source plugin [Mailvelope](https://mailvelope.com/) nebo [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                                                    |
   | Apple Mail      | macOS    | [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation)                                                                                          | Apple Mail nepodporuje OpenPGP, ale můžete si stáhnout open-source plugin [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation).                                                                                                                                                                                                                                                       |
   | Apple Mail      | iOS      | [PGPro](https://github.com/opensourceios/PGPro/) nebo [FlowCrypt](https://apps.apple.com/us/app/flowcrypt-encrypted-email/id1591754995) (proprietární licence)                           | Apple Mail nepodporuje OpenPGP, ale můžete si stáhnout open-source plugin [PGPro](https://github.com/opensourceios/PGPro/) nebo [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                                    |
   | Outlook         | Windows  | [gpg4win](https://www.gpg4win.de/index.html)                                                                                                                                          | Desktopový e-mailový klient Outlook nepodporuje OpenPGP, ale můžete si stáhnout open-source plugin [gpg4win](https://www.gpg4win.de/index.html).                                                                                                                                                                                                                                                                                    |
   | Outlook         | Prohlížeč | [Mailvelope](https://mailvelope.com/) nebo [FlowCrypt](https://flowcrypt.com/download) (proprietární licence)                                                                            | Webový e-mailový klient Outlook nepodporuje OpenPGP, ale můžete si stáhnout open-source plugin [Mailvelope](https://mailvelope.com/) nebo [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                          |
   | Android         | Mobilní  | [OpenKeychain](https://www.openkeychain.org/) nebo [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email)                                                       | [Android mail klienti](/blog/open-source/android-email-clients) jako [Thunderbird Mobile](https://www.thunderbird.net/en-US/mobile/) a [FairEmail](https://github.com/M66B/FairEmail) oba podporují open-source plugin [OpenKeychain](https://www.openkeychain.org/). Alternativně můžete použít open-source (proprietární licence) plugin [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email). |
   | Google Chrome   | Prohlížeč | [Mailvelope](https://mailvelope.com/) nebo [FlowCrypt](https://flowcrypt.com/download) (proprietární licence)                                                                            | Můžete si stáhnout open-source rozšíření prohlížeče [Mailvelope](https://mailvelope.com/) nebo [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                                                                                 |
   | Mozilla Firefox | Prohlížeč | [Mailvelope](https://mailvelope.com/) nebo [FlowCrypt](https://flowcrypt.com/download) (proprietární licence)                                                                            | Můžete si stáhnout open-source rozšíření prohlížeče [Mailvelope](https://mailvelope.com/) nebo [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                                                                                 |
   | Microsoft Edge  | Prohlížeč | [Mailvelope](https://mailvelope.com/)                                                                                                                                                 | Můžete si stáhnout open-source rozšíření prohlížeče [Mailvelope](https://mailvelope.com/).                                                                                                                                                                                                                                                                                                                                                |
   | Brave           | Prohlížeč | [Mailvelope](https://mailvelope.com/) nebo [FlowCrypt](https://flowcrypt.com/download) (proprietární licence)                                                                            | Můžete si stáhnout open-source rozšíření prohlížeče [Mailvelope](https://mailvelope.com/) nebo [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                                                                                 |
   | Balsa           | Desktop  | [Nastavení OpenPGP v Balsa](https://www.mynetcologne.de/~nc-dreszal/balsa/balsa23-secure-mail.html#USING)                                                                            | Balsa má vestavěnou podporu pro OpenPGP.                                                                                                                                                                                                                                                                                                                                                                                                  |
   | KMail           | Desktop  | [Nastavení OpenPGP v KMail](https://userbase.kde.org/KMail/PGP_MIME)                                                                                                                 | KMail má vestavěnou podporu pro OpenPGP.                                                                                                                                                                                                                                                                                                                                                                                                  |
   | GNOME Evolution | Desktop  | [Nastavení OpenPGP v Evolution](https://help.gnome.org/users/evolution/stable/mail-encryption.html.en)                                                                               | GNOME Evolution má vestavěnou podporu pro OpenPGP.                                                                                                                                                                                                                                                                                                                                                                                        |
   | Terminál        | Desktop  | [Nastavení gpg v Terminálu](https://docs.github.com/en/authentication/managing-commit-signature-verification/generating-a-new-gpg-key#generating-a-gpg-key)                           | Můžete použít open-source [gpg příkazový nástroj](https://www.gnupg.org/download/) k vygenerování nového klíče z příkazové řádky.                                                                                                                                                                                                                                                                                                            |
2. Otevřete plugin, vytvořte svůj veřejný klíč a nakonfigurujte svůj e-mailový klient, aby jej používal.

3. Nahrajte svůj veřejný klíč na <https://keys.openpgp.org/upload>.

   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tip:
     </strong>
     <span>Můžete navštívit <a class="alert-link" href="https://keys.openpgp.org/manage">https://keys.openpgp.org/manage</a> pro správu svého klíče v budoucnu.</span>
   </div>

   <div class="alert my-3 alert-secondary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Volitelný doplněk:
     </strong>
     <span>
       Pokud používáte naši službu <a class="alert-link" href="/blog/docs/best-quantum-safe-encrypted-email-service">šifrovaného úložiště (IMAP/POP3)</a> a chcete, aby <i>všechny</i> e-maily uložené ve vaší (již zašifrované) databázi SQLite byly zašifrovány vaším veřejným klíčem, přejděte na <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Můj účet <i class="fa fa-angle-right"></i> Domény</a> <i class="fa fa-angle-right"></i> Alias (např. <code>hello@example.com</code>) <i class="fa fa-angle-right"></i> Upravit <i class="fa fa-angle-right"></i> OpenPGP a nahrajte svůj veřejný klíč.
     </span>
   </div>

4. Přidejte nový záznam `CNAME` do své domény (např. `example.com`):

   <table class="table table-striped table-hover my-3">
     <thead class="thead-dark">
       <tr>
         <th>Název/Hostitel/Alias</th>
         <th class="text-center">TTL</th>
         <th>Typ</th>
         <th>Odpověď/Hodnota</th>
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
       Tip:
     </strong>
     <span>Pokud váš alias používá naše <a class="alert-link" href="/disposable-addresses" target="_blank">vanity/jednorázové domény</a> (např. <code>hideaddress.net</code>), můžete tento krok přeskočit.</span>
   </div>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Gratulujeme!
    </strong>
    <span>
      Úspěšně jste dokončili všechny kroky.
    </span>
  </div>
</div>

### Podporujete šifrování S/MIME {#do-you-support-smime-encryption}

Ano, podporujeme šifrování [S/MIME (Secure/Multipurpose Internet Mail Extensions)](https://en.wikipedia.org/wiki/S/MIME) podle definice v [RFC 8551](https://datatracker.ietf.org/doc/html/rfc8551). S/MIME poskytuje end-to-end šifrování pomocí X.509 certifikátů, které jsou široce podporovány podnikových e-mailovými klienty.

Podporujeme jak RSA, tak ECC (Elliptic Curve Cryptography) certifikáty:

* **RSA certifikáty**: minimálně 2048 bitů, doporučeno 4096 bitů
* **ECC certifikáty**: křivky P-256, P-384 a P-521 podle NIST

Pro konfiguraci šifrování S/MIME pro váš alias:

1. Získejte S/MIME certifikát od důvěryhodné certifikační autority (CA) nebo vygenerujte samopodepsaný certifikát pro testování.

   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Tip:
     </strong>
     <span>Bezplatné S/MIME certifikáty jsou k dispozici u poskytovatelů jako <a class="alert-link" href="https://www.actalis.com/s-mime-certificates.aspx">Actalis</a> nebo <a class="alert-link" href="https://extrassl.actalis.com/portal/uapub/freemail">Actalis Free S/MIME</a>.</span>
   </div>

2. Exportujte svůj certifikát ve formátu PEM (pouze veřejný certifikát, nikoli soukromý klíč).

3. Přejděte na <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Můj účet <i class="fa fa-angle-right"></i> Domény</a> <i class="fa fa-angle-right"></i> Alias (např. <code><hello@example.com></code>) <i class="fa fa-angle-right"></i> Upravit <i class="fa fa-angle-right"></i> S/MIME a nahrajte svůj veřejný certifikát.
4. Po konfiguraci budou všechny příchozí e-maily na váš alias šifrovány pomocí vašeho S/MIME certifikátu před uložením nebo přeposláním.

   <div class="alert my-3 alert-secondary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Poznámka:
     </strong>
     <span>
       Šifrování S/MIME se aplikuje na příchozí zprávy, které již nejsou zašifrovány. Pokud je zpráva již zašifrována pomocí OpenPGP nebo S/MIME, nebude znovu zašifrována.
     </span>
   </div>

   <div class="alert my-3 alert-warning">
     <i class="fa fa-exclamation-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Důležité:
     </strong>
     <span>
       Šifrování S/MIME nebude aplikováno na přeposílání e-mailů přes naše MX servery, pokud odesílatel měl DMARC politiku reject. Pokud potřebujete šifrování S/MIME na <em>všechny</em> zprávy, doporučujeme použít náš IMAP servis a nakonfigurovat svůj S/MIME certifikát pro váš alias pro příchozí poštu.
     </span>
   </div>

Následující e-mailoví klienti mají vestavěnou podporu S/MIME:

| E-mailový klient  | Platforma | Poznámky                                                                                                           |
| ----------------- | -------- | ----------------------------------------------------------------------------------------------------------------- |
| Apple Mail        | macOS    | Vestavěná podpora S/MIME. Jděte do Mail > Preferences > Accounts > váš účet > Trust pro konfiguraci certifikátů.  |
| Apple Mail        | iOS      | Vestavěná podpora S/MIME. Jděte do Nastavení > Mail > Účty > váš účet > Pokročilé > S/MIME pro konfiguraci.        |
| Microsoft Outlook | Windows  | Vestavěná podpora S/MIME. Jděte do Soubor > Možnosti > Centrum zabezpečení > Nastavení centra zabezpečení > E-mailová bezpečnost pro konfiguraci. |
| Microsoft Outlook | macOS    | Vestavěná podpora S/MIME. Jděte do Nástroje > Účty > Pokročilé > Zabezpečení pro konfiguraci.                      |
| Thunderbird       | Desktop  | Vestavěná podpora S/MIME. Jděte do Nastavení účtu > End-To-End Encryption > S/MIME pro konfiguraci.               |
| GNOME Evolution   | Desktop  | Vestavěná podpora S/MIME. Jděte do Upravit > Předvolby > E-mailové účty > váš účet > Zabezpečení pro konfiguraci.  |
| KMail             | Desktop  | Vestavěná podpora S/MIME. Jděte do Nastavení > Konfigurace KMail > Identity > vaše identita > Kryptografie pro konfiguraci. |

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Gratulujeme!
    </strong>
    <span>
      Úspěšně jste nakonfigurovali šifrování S/MIME pro váš alias.
    </span>
  </div>
</div>

### Podporujete filtrování e-mailů Sieve {#do-you-support-sieve-email-filtering}

Ano! Podporujeme filtrování e-mailů pomocí [Sieve](https://en.wikipedia.org/wiki/Sieve_\(mail_filtering_language\)) dle definice v [RFC 5228](https://datatracker.ietf.org/doc/html/rfc5228). Sieve je výkonný, standardizovaný skriptovací jazyk pro serverové filtrování e-mailů, který vám umožňuje automaticky organizovat, filtrovat a reagovat na příchozí zprávy.

#### Podporované rozšíření Sieve {#supported-sieve-extensions}

Podporujeme rozsáhlou sadu rozšíření Sieve:

| Rozšíření                   | RFC                                                                                     | Popis                                            |
| --------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------ |
| `fileinto`                  | [RFC 5228](https://datatracker.ietf.org/doc/html/rfc5228)                              | Ukládat zprávy do specifických složek            |
| `reject` / `ereject`        | [RFC 5429](https://datatracker.ietf.org/doc/html/rfc5429)                              | Odmítnout zprávy s chybou                         |
| `vacation`                  | [RFC 5230](https://datatracker.ietf.org/doc/html/rfc5230)                              | Automatické odpovědi během dovolené / nepřítomnosti |
| `vacation-seconds`          | [RFC 6131](https://datatracker.ietf.org/doc/html/rfc6131)                              | Jemně nastavit intervaly odpovědí během dovolené  |
| `imap4flags`                | [RFC 5232](https://datatracker.ietf.org/doc/html/rfc5232)                              | Nastavit IMAP příznaky (\Seen, \Flagged, atd.)    |
| `envelope`                  | [RFC 5228](https://datatracker.ietf.org/doc/html/rfc5228)                              | Testovat odesílatele/příjemce v obálce            |
| `body`                      | [RFC 5173](https://datatracker.ietf.org/doc/html/rfc5173)                              | Testovat obsah těla zprávy                         |
| `variables`                 | [RFC 5229](https://datatracker.ietf.org/doc/html/rfc5229)                              | Ukládat a používat proměnné ve skriptech          |
| `relational`                | [RFC 5231](https://datatracker.ietf.org/doc/html/rfc5231)                              | Relační porovnání (větší než, menší než)          |
| `comparator-i;ascii-numeric`| [RFC 4790](https://datatracker.ietf.org/doc/html/rfc4790)                              | Číselná porovnání                                  |
| `copy`                      | [RFC 3894](https://datatracker.ietf.org/doc/html/rfc3894)                              | Kopírovat zprávy při přesměrování                  |
| `editheader`                | [RFC 5293](https://datatracker.ietf.org/doc/html/rfc5293)                              | Přidávat nebo mazat hlavičky zpráv                 |
| `date`                      | [RFC 5260](https://datatracker.ietf.org/doc/html/rfc5260)                              | Testovat datum/časové hodnoty                      |
| `index`                     | [RFC 5260](https://datatracker.ietf.org/doc/html/rfc5260)                              | Přistupovat ke konkrétním výskytům hlaviček        |
| `regex`                     | [draft-ietf-sieve-regex](https://datatracker.ietf.org/doc/html/draft-ietf-sieve-regex) | Porovnávání pomocí regulárních výrazů              |
| `enotify`                   | [RFC 5435](https://datatracker.ietf.org/doc/html/rfc5435)                              | Odesílat oznámení (např. mailto:)                  |
| `environment`               | [RFC 5183](https://datatracker.ietf.org/doc/html/rfc5183)                              | Přistupovat k informacím o prostředí                |
| `mailbox`                   | [RFC 5490](https://datatracker.ietf.org/doc/html/rfc5490)                              | Testovat existenci schránky, vytvářet schránky     |
| `special-use`               | [RFC 8579](https://datatracker.ietf.org/doc/html/rfc8579)                              | Ukládat do speciálních schránek (\Junk, \Trash)    |
| `duplicate`                 | [RFC 7352](https://datatracker.ietf.org/doc/html/rfc7352)                              | Detekovat duplicitní zprávy                         |
| `ihave`                     | [RFC 5463](https://datatracker.ietf.org/doc/html/rfc5463)                              | Testovat dostupnost rozšíření                        |
| `subaddress`                | [RFC 5233](https://datatracker.ietf.org/doc/html/rfc5233)                              | Přistupovat k částem adresy uživatele+detailu      |
#### Rozšíření nejsou podporována {#extensions-not-supported}

Následující rozšíření momentálně nejsou podporována:

| Rozšíření                                                      | Důvod                                                               |
| -------------------------------------------------------------- | ------------------------------------------------------------------ |
| `include`                                                      | Bezpečnostní riziko (injekce skriptu) a vyžaduje globální úložiště skriptů |
| `mboxmetadata` / `servermetadata`                              | Vyžaduje podporu rozšíření IMAP METADATA                           |
| `foreverypart` / `mime` / `extracttext` / `replace` / `enclose` | Komplexní manipulace s MIME stromem zatím není implementována      |

#### Příklad Sieve skriptů {#example-sieve-scripts}

**Uložení newsletterů do složky:**

```sieve
require ["fileinto"];

if header :contains "List-Id" "newsletter" {
    fileinto "Newsletters";
}
```

**Automatická odpověď během dovolené:**

```sieve
require ["vacation"];

vacation :days 7 :subject "Out of Office"
    "I am currently out of the office and will respond when I return.";
```

**Označení zpráv od důležitých odesílatelů:**

```sieve
require ["imap4flags"];

if address :is "from" "boss@example.com" {
    setflag "\\Flagged";
}
```

**Odmítnutí spamu s konkrétními předměty:**

```sieve
require ["reject"];

if header :contains "subject" ["lottery", "winner", "urgent transfer"] {
    reject "Message rejected due to spam content.";
}
```

#### Správa Sieve skriptů {#managing-sieve-scripts}

Své Sieve skripty můžete spravovat několika způsoby:

1. **Webové rozhraní**: Přejděte na <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Můj účet <i class="fa fa-angle-right"></i> Domény</a> <i class="fa fa-angle-right"></i> Alias <i class="fa fa-angle-right"></i> Sieve skripty pro vytváření a správu skriptů.

2. **Protokol ManageSieve**: Připojte se pomocí libovolného klienta kompatibilního s ManageSieve (například Sieve doplněk pro Thunderbird nebo [sieve-connect](https://github.com/philpennock/sieve-connect)) na `imap.forwardemail.net`. Použijte port `2190` se STARTTLS (doporučeno pro většinu klientů) nebo port `4190` s implicitním TLS.

3. **API**: Použijte naše [REST API](/api#sieve-scripts) pro programovou správu skriptů.

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Poznámka:
  </strong>
  <span>
    Sieve filtrování se aplikuje na příchozí zprávy před jejich uložením do vaší schránky. Skripty se vykonávají podle priority a první odpovídající akce určuje, jak bude zpráva zpracována.
  </span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Bezpečnost:
  </strong>
  <span>
    Z bezpečnostních důvodů jsou přesměrovací akce omezeny na 10 na skript a 100 za den. Odpovědi během dovolené jsou omezeny kvůli prevenci zneužití.
  </span>
</div>

### Podporujete MTA-STS {#do-you-support-mta-sts}

Ano, od 2. března 2023 podporujeme [MTA-STS](https://www.hardenize.com/blog/mta-sts). Můžete použít [tento šablonový soubor](https://github.com/jpawlowski/mta-sts.template), pokud chcete tuto funkci povolit na své doméně.

Naše konfigurace je veřejně dostupná na GitHubu na <https://github.com/forwardemail/mta-sts.forwardemail.net>.

### Podporujete passkeys a WebAuthn {#do-you-support-passkeys-and-webauthn}

Ano! Od 13. prosince 2023 jsme přidali podporu pro passkeys [kvůli vysoké poptávce](https://github.com/orgs/forwardemail/discussions/182).

Passkeys vám umožňují bezpečně se přihlásit bez nutnosti hesla a dvoufaktorové autentizace.

Svou identitu můžete ověřit pomocí dotyku, rozpoznání obličeje, hesla uloženého v zařízení nebo PINu.

Umožňujeme spravovat až 30 passkeys najednou, takže se můžete snadno přihlašovat ze všech svých zařízení.

Více o passkeys se dozvíte na následujících odkazech:

* [Přihlášení do aplikací a webů pomocí passkeys](https://support.google.com/android/answer/14124480?hl=en) (Google)
* [Použití passkeys pro přihlášení do aplikací a webů na iPhonu](https://support.apple.com/guide/iphone/use-passkeys-to-sign-in-to-apps-and-websites-iphf538ea8d0/ios) (Apple)
* [Článek na Wikipedii o Passkeys](https://en.wikipedia.org/wiki/Passkey_\(credential\))
### Podporujete nejlepší praktiky e-mailu {#do-you-support-email-best-practices}

Ano. Máme vestavěnou podporu pro SPF, DKIM, DMARC, ARC a SRS ve všech plánech. Také jsme úzce spolupracovali s původními autory těchto specifikací a dalšími odborníky na e-maily, abychom zajistili dokonalost a vysokou doručitelnost.

### Podporujete bounce webhooky {#do-you-support-bounce-webhooks}

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tip:
  </strong>
    Hledáte dokumentaci k e-mailovým webhookům? Podívejte se na <a href="/faq#do-you-support-webhooks" class="alert-link">Podporujete webhooky?</a> pro více informací.
  <span>
  </span>
</div>

Ano, od 14. srpna 2024 jsme tuto funkci přidali. Nyní můžete přejít do Můj účet → Domény → Nastavení → Bounce Webhook URL a nakonfigurovat `http://` nebo `https://` URL, na kterou budeme posílat `POST` požadavek vždy, když dojde k bounce u odchozích SMTP e-mailů.

To je užitečné pro správu a monitorování vašich odchozích SMTP – a může být použito k udržování odběratelů, odhlášení a detekci, kdy k bounce dojde.

Payloady bounce webhooku jsou odesílány jako JSON s těmito vlastnostmi:

* `email_id` (String) - ID e-mailu, které odpovídá e-mailu v Můj účet → E-maily (odchozí SMTP)
* `list_id` (String) - hodnota hlavičky `List-ID` (bez ohledu na velikost písmen), pokud existuje, z původního odchozího e-mailu
* `list_unsubscribe` (String) - hodnota hlavičky `List-Unsubscribe` (bez ohledu na velikost písmen), pokud existuje, z původního odchozího e-mailu
* `feedback_id` (String) - hodnota hlavičky `Feedback-ID` (bez ohledu na velikost písmen), pokud existuje, z původního odchozího e-mailu
* `recipient` (String) - e-mailová adresa příjemce, který bounce nebo chybu způsobil
* `message` (String) - podrobná chybová zpráva pro bounce
* `response` (String) - SMTP odpověď
* `response_code` (Number) - analyzovaný SMTP kód odpovědi
* `truth_source` (String) - pokud byl kód odpovědi z důvěryhodného zdroje, tato hodnota bude obsahovat kořenovou doménu (např. `google.com` nebo `yahoo.com`)
* `bounce` (Object) - objekt obsahující následující vlastnosti, které podrobně popisují stav bounce a odmítnutí
  * `action` (String) - akce bounce (např. `"reject"`)
  * `message` (String) - důvod bounce (např. `"Message Sender Blocked By Receiving Server"`)
  * `category` (String) - kategorie bounce (např. `"block"`)
  * `code` (Number) - stavový kód bounce (např. `554`)
  * `status` (String) - kód bounce z odpovědi (např. `5.7.1`)
  * `line` (Number) - analyzované číslo řádku, pokud existuje, [z Zone-MTA bounce parse list](https://github.com/zone-eu/zone-mta/blob/master/config/bounces.txt) (např. `526`)
* `headers` (Object) - klíč-hodnota hlaviček pro odchozí e-mail
* `bounced_at` (String) - datum ve formátu [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601), kdy došlo k chybě bounce

Například:

```json
{
  "email_id": "66bcce793ef7b2a0928e14ba",
  "recipient": "example@gmail.com",
  "message": "E-mailový účet, na který jste se pokusili doručit, překročil kvótu.",
  "response": "552 5.2.2 E-mailový účet, na který jste se pokusili doručit, překročil kvótu.",
  "response_code": 552,
  "truth_source": "google.com",
  "bounce": {
    "action": "reject",
    "message": "Gmailová schránka je plná",
    "category": "capacity",
    "code": 552,
    "status": "5.2.2",
    "line": 300
  },
  "headers": {},
  "bounced_at": "2024-08-24T01:50:02.828Z"
}
```

Zde je několik dalších poznámek ohledně bounce webhooků:

* Pokud payload webhooku obsahuje hodnotu `list_id`, `list_unsubscribe` nebo `feedback_id`, měli byste podle potřeby přijmout odpovídající opatření k odstranění `recipient` ze seznamu.
  * Pokud hodnota `bounce.category` byla jedna z `"block"`, `"recipient"`, `"spam"` nebo `"virus"`, pak byste uživatele rozhodně měli ze seznamu odstranit.
* Pokud potřebujete ověřit payloady webhooku (aby bylo zajištěno, že skutečně pocházejí z našeho serveru), můžete [vyřešit IP adresu vzdáleného klienta na hostname pomocí reverzního vyhledávání](https://nodejs.org/api/dns.html#dnspromisesreverseip) – měla by být `smtp.forwardemail.net`.
  * Můžete také zkontrolovat IP proti [našim zveřejněným IP adresám](#what-are-your-servers-ip-addresses).
  * Přejděte do Můj účet → Domény → Nastavení → Webhook Signature Payload Verification Key pro získání vašeho webhook klíče.
    * Tento klíč můžete kdykoli z bezpečnostních důvodů změnit.
    * Vypočítejte a porovnejte hodnotu `X-Webhook-Signature` z našeho webhook požadavku s vypočtenou hodnotou těla pomocí tohoto klíče. Příklad, jak to udělat, je k dispozici v [tomto příspěvku na Stack Overflow](https://stackoverflow.com/a/68885281).
  * Více informací najdete v diskusi na <https://github.com/forwardemail/free-email-forwarding/issues/235>.
* Budeme čekat až `5` sekund na odpověď vašeho webhook endpointu s kódem stavu `200` a pokusíme se odeslat požadavek znovu až `1` krát.
* Pokud zjistíme, že vaše bounce webhook URL má chybu při pokusu o odeslání požadavku, pošleme vám zdvořilý e-mail jednou týdně.
### Podporujete webhooks {#do-you-support-webhooks}

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tip:
  </strong>
    Hledáte dokumentaci k bounce webhookům? Podívejte se na <a href="/faq#do-you-support-bounce-webhooks" class="alert-link">Podporujete bounce webhooks?</a> pro více informací.
  <span>
  </span>
</div>

Ano, od 15. května 2020 jsme tuto funkci přidali. Můžete jednoduše přidat webhook(y) stejně jako u jakéhokoliv příjemce! Ujistěte se, že máte v URL webhooku předponu "http" nebo "https".

<div class="alert my-3 alert-danger">
  <i class="fa fa-stop-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Rozšířená ochrana soukromí:
  </strong>
  <span>
    Pokud jste na placeném plánu (který obsahuje rozšířenou ochranu soukromí), přejděte prosím do <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Můj účet <i class="fa fa-angle-right"></i> Domény</a> a klikněte na "Alias" vedle vaší domény pro konfiguraci webhooků. Pokud chcete vědět více o placených plánech, podívejte se na naši stránku <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Ceník</a>. Jinak můžete pokračovat podle níže uvedených instrukcí.
  </span>
</div>

Pokud jste na bezplatném plánu, jednoduše přidejte nový DNS <strong class="notranslate">TXT</strong> záznam, jak je uvedeno níže:

Například, pokud chci, aby všechny e-maily směřující na `alias@example.com` byly přeposílány na nový testovací endpoint [request bin](https://requestbin.com/r/en8pfhdgcculn?inspect):

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Název/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Odpověď/Hodnota</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", nebo prázdné</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=alias:https://requestbin.com/r/en8pfhdgcculn</code></td>
    </tr>
  </tbody>
</table>

Nebo chcete, aby všechny e-maily směřující na `example.com` byly přeposílány na tento endpoint:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Název/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Odpověď/Hodnota</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", nebo prázdné</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=https://requestbin.com/r/en8pfhdgcculn</code></td>
    </tr>
  </tbody>
</table>

**Zde jsou další poznámky týkající se webhooků:**

* Pokud potřebujete ověřit payload webhooku (aby bylo jisté, že skutečně pochází z našeho serveru), můžete [vyřešit IP adresu vzdáleného klienta nebo hostname pomocí reverzního vyhledávání](https://nodejs.org/api/dns.html#dnspromisesreverseip) – měla by být buď `mx1.forwardemail.net` nebo `mx2.forwardemail.net`.
  * Můžete také zkontrolovat IP adresu proti [našim publikovaným IP adresám](#what-are-your-servers-ip-addresses).
  * Pokud jste na placeném plánu, přejděte do Můj účet → Domény → Nastavení → Webhook Signature Payload Verification Key pro získání klíče webhooku.
    * Tento klíč můžete kdykoliv z bezpečnostních důvodů změnit.
    * Vypočítejte a porovnejte hodnotu `X-Webhook-Signature` z našeho webhook požadavku s vypočtenou hodnotou těla pomocí tohoto klíče. Příklad, jak to udělat, je dostupný na [tomto příspěvku na Stack Overflow](https://stackoverflow.com/a/68885281).
  * Více informací najdete v diskuzi na <https://github.com/forwardemail/free-email-forwarding/issues/235>.
* Pokud webhook neodpoví s kódem stavu `200`, uložíme jeho odpověď do [vytvořeného chybového logu](#do-you-store-error-logs) – což je užitečné pro ladění.
* HTTP požadavky webhooku se budou opakovat až 3x při každém pokusu o SMTP připojení, s maximálním timeoutem 60 sekund na POST požadavek na endpoint. **Poznámka: to neznamená, že se opakuje pouze 3x**, ve skutečnosti se bude opakovat kontinuálně v čase zasíláním SMTP kódu 421 (což odesílateli říká, aby to zkusil později) po 3. neúspěšném HTTP POST pokusu. To znamená, že e-mail se bude opakovaně pokoušet doručit dny, dokud nebude dosaženo kódu 200.
* Automaticky se opakují požadavky na základě výchozích stavových a chybových kódů používaných v [retry metodě superagent](https://ladjs.github.io/superagent/#retrying-requests) (jsme udržovateli).
* HTTP požadavky webhooku na stejný endpoint seskupujeme do jednoho požadavku místo více, abychom ušetřili zdroje a zrychlili odezvu. Například pokud pošlete e-mail na <webhook1@example.com>, <webhook2@example.com> a <webhook3@example.com>, a všechny jsou nastaveny na stejnou *přesnou* URL endpointu, bude proveden pouze jeden požadavek. Seskupujeme podle přesné shody endpointu se striktní rovností.
* Používáme metodu "simpleParser" z knihovny [mailparser](https://nodemailer.com/extras/mailparser/) pro parsování zprávy do JSON přátelského objektu.
* Hodnota surového e-mailu jako String je dostupná pod vlastností "raw".
* Výsledky autentizace jsou dostupné pod vlastnostmi "dkim", "spf", "arc", "dmarc" a "bimi".
* Parsované hlavičky e-mailu jsou dostupné pod vlastností "headers" – ale také můžete použít "headerLines" pro jednodušší iteraci a parsování.
* Seskupení příjemců pro tento webhook jsou seskupena a dostupná pod vlastností "recipients".
* Informace o SMTP relaci jsou dostupné pod vlastností "session". Obsahuje informace o odesílateli zprávy, čase příchodu zprávy, HELO a hostname klienta. Hodnota hostname klienta jako `session.clientHostname` je buď FQDN (z reverzního PTR vyhledávání) nebo `session.remoteAddress` zabalená v závorkách (např. `"[127.0.0.1]"`).
* Pokud potřebujete rychle získat hodnotu `X-Original-To`, můžete použít hodnotu `session.recipient` (viz příklad níže). Hlavička `X-Original-To` je hlavička, kterou přidáváme do zpráv pro ladění s původním příjemcem (před maskovaným přeposíláním) zprávy.
* Pokud potřebujete odstranit vlastnosti `attachments` a/nebo `raw` z těla payloadu, jednoduše přidejte `?attachments=false`, `?raw=false` nebo `?attachments=false&raw=false` jako querystring parametr do vašeho webhook endpointu (např. `https://example.com/webhook?attachments=false&raw=false`).
* Pokud jsou přiložené soubory, budou přidány do pole `attachments` jako hodnoty Buffer. Můžete je zpětně parsovat do obsahu pomocí přístupu v JavaScriptu, například:
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

### Podporujete regulární výrazy nebo regex {#do-you-support-regular-expressions-or-regex}

Ano, od 27. září 2021 jsme tuto funkci přidali. Můžete jednoduše psát regulární výrazy ("regex") pro shodu aliasů a provádění náhrad.

Alias podporující regulární výrazy jsou ty, které začínají `/` a končí `/` a jejich příjemci jsou e-mailové adresy nebo webhooky. Příjemci mohou také zahrnovat podporu náhrad regexem (např. `$1`, `$2`).

Podporujeme dva přepínače regulárních výrazů včetně `i` a `g`. Přepínač ignorující velikost písmen `i` je trvalý výchozí a je vždy vynucen. Globální přepínač `g` můžete přidat připojením `/g` na konec výrazu.

Všimněte si, že také podporujeme naši <a href="#can-i-disable-specific-aliases">funkci zakázaných aliasů</a> pro část příjemce s naší podporou regexu.

Regulární výrazy nejsou podporovány na <a href="/disposable-addresses" target="_blank">globálních vanity doménách</a> (protože by to mohlo být bezpečnostní riziko).

<div class="alert my-3 alert-danger">
  <i class="fa fa-stop-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Zvýšená ochrana soukromí:
  </strong>
  <span>
    Pokud máte placený tarif (který obsahuje zvýšenou ochranu soukromí), přejděte prosím na <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Můj účet <i class="fa fa-angle-right"></i> Domény</a> a klikněte na "Aliasy" vedle vaší domény pro konfiguraci aliasů, včetně těch s regulárními výrazy. Pokud se chcete dozvědět více o placených tarifech, navštivte naši stránku <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Ceník</a>.
  </span>
</div>

#### Příklady pro zvýšenou ochranu soukromí {#examples-for-enhanced-privacy-protection}

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Název aliasu</th>
      <th>Efekt</th>
      <th>Test</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>/^(linus|torvalds)$/</code></td>
      <td>E-maily na `linus@example.com` nebo `torvalds@example.com`</td>
      <td>(<a href="https://regexr.com/8gb8n" class="alert-link">zobrazit test na RegExr</a>)</td>
    </tr>
    <tr>
      <td><code>/^24highst(reet)$/</code></td>
      <td>E-maily na `24highst@example.com` nebo `24highstreet@example.com`</td>
      <td>(<a href="https://regexr.com/8g9rb" class="alert-link">zobrazit test na RegExr</a>)</td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tip:
  </strong>
    Pro testování na <a href="https://regexr.com" class="alert-link">RegExr</a> napište výraz do horního pole a poté zadejte příklad aliasu do textového pole níže. Pokud výraz sedí, pole zmodrá.
  <span>
  </span>
</div>

#### Příklady pro bezplatný tarif {#examples-for-the-free-plan}

Pokud jste na bezplatném tarifu, jednoduše přidejte nový DNS <strong class="notranslate">TXT</strong> záznam pomocí jednoho nebo více níže uvedených příkladů:

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Jednoduchý příklad:</strong> Pokud chci, aby všechny e-maily směřující na `linus@example.com` nebo `torvalds@example.com` byly přeposílány na `user@gmail.com`:
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Název/Hostitel/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Odpověď/Hodnota</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", nebo prázdné</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(linus|torvalds)$/:user@gmail.com</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Příklad náhrady jména a příjmení:</strong> Představte si, že všechny e-mailové adresy vaší firmy mají vzor `firstname.lastname@example.com`. Pokud chci, aby všechny e-maily směřující na vzor `firstname.lastname@example.com` byly přeposílány na `firstname.lastname@company.com` s podporou náhrad (<a href="https://regexr.com/66hnu" class="alert-link">zobrazit test na RegExr</a>):
</div>
<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Jméno/Hostitel/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Odpověď/Hodnota</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", nebo prázdné</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^([A-Za-z]+)+\.([A-Za-z]+)+$/:$1.$2@company.com</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Příklad filtrování substituce se symbolem plus:</strong> Pokud chci, aby všechny e-maily, které jdou na `info@example.com` nebo `support@example.com`, byly přeposílány na `user+info@gmail.com` nebo `user+support@gmail.com` (s podporou substituce) (<a href="https://regexr.com/66ho7" class="alert-link">zobrazit test na RegExr</a>):
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Jméno/Hostitel/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Odpověď/Hodnota</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", nebo prázdné</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(support|info)$/:user+$1@gmail.com</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Příklad substituce dotazovacího řetězce webhooku:</strong> Možná chcete, aby všechny e-maily, které jdou na `example.com`, šly na <a href="#do-you-support-webhooks" class="alert-link">webhook</a> a měly dynamický klíč dotazovacího řetězce "to" s hodnotou uživatelské části e-mailové adresy (<a href="https://regexr.com/66ho4" class="alert-link">zobrazit test na RegExr</a>):
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Jméno/Hostitel/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Odpověď/Hodnota</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", nebo prázdné</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(.*?)$/:https://example.com/webhook?username=$1</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Příklad tichého odmítnutí:</strong> Pokud chcete, aby všechny e-maily odpovídající určitému vzoru byly zakázány a tichounce odmítnuty (odesílateli se zobrazí, jako by zpráva byla úspěšně odeslána, ale ve skutečnosti nikam neputuje) se stavovým kódem `250` (viz <a href="#can-i-disable-specific-aliases" class="alert-link">Mohu zakázat konkrétní aliasy</a>), pak jednoduše použijte stejný přístup s jedním vykřičníkem "!". To odesílateli naznačuje, že zpráva byla úspěšně doručena, ale ve skutečnosti nikam neputovala (např. černá díra nebo `/dev/null`).
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Jméno/Hostitel/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Odpověď/Hodnota</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", nebo prázdné</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(linus|torvalds)$/:!</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Příklad měkkého odmítnutí:</strong> Pokud chcete, aby všechny e-maily odpovídající určitému vzoru byly zakázány a měkce odmítnuty se stavovým kódem `421` (viz <a href="#can-i-disable-specific-aliases" class="alert-link">Mohu zakázat konkrétní aliasy</a>), pak jednoduše použijte stejný přístup se dvěma vykřičníky "!!". To odesílateli naznačuje, aby svůj e-mail zkusil znovu, a e-maily na tento alias budou znovu zkoušeny přibližně 5 dní a poté trvale odmítnuty.
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Jméno/Hostitel/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Odpověď/Hodnota</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", nebo prázdné</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(linus|torvalds)$/:!!</code></td>
    </tr>
  </tbody>
</table>
<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Příklad tvrdého odmítnutí:</strong> Pokud chcete, aby všechny e-maily odpovídající určitému vzoru byly zakázány a tvrdě odmítnuty s kódem stavu `550` (viz <a href="#can-i-disable-specific-aliases" class="alert-link">Mohu zakázat konkrétní aliasy</a>), použijte jednoduše stejný přístup s trojitým vykřičníkem "!!!". To odesílateli signalizuje trvalou chybu a e-maily nebudou znovu odesílány, budou pro tento alias odmítnuty.
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Název/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Odpověď/Hodnota</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", nebo prázdné</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(linus|torvalds)$/:!!!</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tip:
  </strong>
    Zajímá vás, jak napsat regulární výraz nebo potřebujete otestovat svou náhradu? Můžete navštívit bezplatný web pro testování regulárních výrazů <a href="https://regexr.com" class="alert-link">RegExr</a> na adrese <a href="https://regexr.com/" class="alert-link">https://regexr.com</a>.
  <span>
  </span>
</div>

### Jaké jsou vaše limity pro odchozí SMTP {#what-are-your-outbound-smtp-limits}

Omezujeme uživatele a domény na 300 odchozích SMTP zpráv za 1 den. To v průměru znamená více než 9000 e-mailů za kalendářní měsíc. Pokud potřebujete tento počet překročit nebo máte konzistentně velké e-maily, prosím [kontaktujte nás](https://forwardemail.net/help).

### Potřebuji schválení pro povolení SMTP {#do-i-need-approval-to-enable-smtp}

Ano, mějte prosím na paměti, že pro udržení reputace IP a zajištění doručitelnosti má Forward Email manuální proces schvalování odchozího SMTP na základě jednotlivých domén. Napište na <support@forwardemail.net> nebo otevřete [žádost o pomoc](https://forwardemail.net/help) pro schválení. Tento proces obvykle trvá méně než 24 hodin, většina žádostí je vyřízena během 1-2 hodin. V blízké budoucnosti plánujeme tento proces zautomatizovat s dalšími kontrolami spamu a upozorněními. Tento proces zajišťuje, že vaše e-maily dorazí do schránky a vaše zprávy nebudou označeny jako spam.

### Jaká jsou nastavení vašeho SMTP serveru {#what-are-your-smtp-server-configuration-settings}

Náš server je `smtp.forwardemail.net` a je také monitorován na naší <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">stavové stránce</a>.

Podporuje jak IPv4, tak IPv6 a je dostupný na portech `465` a `2465` pro SSL/TLS (doporučeno) a `587`, `2587`, `2525` a `25` pro TLS (STARTTLS).

**Od října 2025** nyní podporujeme **legacy TLS 1.0** připojení na portech `2455` (SSL/TLS) a `2555` (STARTTLS) pro starší zařízení jako tiskárny, skenery, kamery a starší e-mailové klienty, které nemohou podporovat moderní verze TLS. Tyto porty jsou poskytovány jako alternativa k Gmailu, Yahoo, Outlooku a dalším poskytovatelům, kteří přestali podporovat starší TLS protokoly.

> \[!CAUTION]
> **Podpora legacy TLS 1.0 (porty 2455 a 2555)**: Tyto porty používají zastaralý protokol TLS 1.0, který má známé bezpečnostní zranitelnosti (BEAST, POODLE). Používejte tyto porty pouze pokud vaše zařízení absolutně nemůže podporovat TLS 1.2 nebo vyšší. Důrazně doporučujeme aktualizovat firmware zařízení nebo přejít na moderní e-mailové klienty, kdykoli je to možné. Tyto porty jsou určeny výhradně pro kompatibilitu se starším hardwarem (staré tiskárny, skenery, kamery, IoT zařízení).

|                                     Protokol                                     | Hostname                |            Porty            |        IPv4        |        IPv6        | Poznámky                               |
| :------------------------------------------------------------------------------: | ----------------------- | :-------------------------: | :----------------: | :----------------: | -------------------------------------- |
|                              `SSL/TLS` **Doporučeno**                            | `smtp.forwardemail.net` |        `465`, `2465`        | :white_check_mark: | :white_check_mark: | Moderní TLS 1.2+ (doporučeno)          |
|         `TLS` ([STARTTLS](https://wikipedia.org/wiki/Opportunistic_TLS))         | `smtp.forwardemail.net` | `587`, `2587`, `2525`, `25` | :white_check_mark: | :white_check_mark: | Podporováno (preferujte SSL/TLS port `465`) |
|                             `SSL/TLS` **Pouze legacy**                           | `smtp.forwardemail.net` |            `2455`           | :white_check_mark: | :white_check_mark: | :warning: TLS 1.0 pouze pro stará zařízení |
| `TLS` ([STARTTLS](https://wikipedia.org/wiki/Opportunistic_TLS)) **Pouze legacy** | `smtp.forwardemail.net` |            `2555`           | :white_check_mark: | :white_check_mark: | :warning: TLS 1.0 pouze pro stará zařízení |
| Přihlášení | Příklad                    | Popis                                                                                                                                                                                    |
| --------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Uživatelské jméno | `user@example.com`         | Emailová adresa aliasu, který existuje pro doménu v <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Můj účet <i class="fa fa-angle-right"></i> Domény</a>.          |
| Heslo     | `************************` | Alias                                                                                                                                                                                    |

Pro odesílání odchozí pošty přes SMTP musí být **SMTP uživatel** emailová adresa aliasu, který existuje pro doménu v <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Můj účet <i class="fa fa-angle-right"></i> Domény</a> – a **SMTP heslo** musí být alias-specifické generované heslo.

Podívejte se na [Podporujete odesílání emailů přes SMTP](#do-you-support-sending-email-with-smtp) pro podrobné instrukce krok za krokem.

### Jaké jsou vaše konfigurační nastavení IMAP serveru {#what-are-your-imap-server-configuration-settings}

Náš server je `imap.forwardemail.net` a je také monitorován na naší <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">stavové stránce</a>.

Podporuje jak IPv4, tak IPv6 a je dostupný na portech `993` a `2993` pro SSL/TLS.

|         Protokol         | Hostitel                 |     Porty     |        IPv4        |        IPv6        |
| :---------------------: | ----------------------- | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **Preferováno** | `imap.forwardemail.net` | `993`, `2993` | :white_check_mark: | :white_check_mark: |

| Přihlášení | Příklad                    | Popis                                                                                                                                                                                    |
| --------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Uživatelské jméno | `user@example.com`         | Emailová adresa aliasu, který existuje pro doménu v <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Můj účet <i class="fa fa-angle-right"></i> Domény</a>.          |
| Heslo     | `************************` | Alias-specifické generované heslo.                                                                                                                                                       |

Pro připojení přes IMAP musí být **IMAP uživatel** emailová adresa aliasu, který existuje pro doménu v <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Můj účet <i class="fa fa-angle-right"></i> Domény</a> – a **IMAP heslo** musí být alias-specifické generované heslo.

Podívejte se na [Podporujete přijímání emailů přes IMAP](#do-you-support-receiving-email-with-imap) pro podrobné instrukce krok za krokem.

### Jaké jsou vaše konfigurační nastavení POP3 serveru {#what-are-your-pop3-server-configuration-settings}

Náš server je `pop3.forwardemail.net` a je také monitorován na naší <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">stavové stránce</a>.

Podporuje jak IPv4, tak IPv6 a je dostupný na portech `995` a `2995` pro SSL/TLS.

|         Protokol         | Hostitel                 |     Porty     |        IPv4        |        IPv6        |
| :---------------------: | ----------------------- | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **Preferováno** | `pop3.forwardemail.net` | `995`, `2995` | :white_check_mark: | :white_check_mark: |
| Přihlášení | Příklad                   | Popis                                                                                                                                                                                    |
| --------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Uživatelské jméno | `user@example.com`         | Emailová adresa aliasu, který existuje pro doménu na <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Můj účet <i class="fa fa-angle-right"></i> Domény</a>.          |
| Heslo     | `************************` | Alias-specifické generované heslo.                                                                                                                                                        |

Pro připojení přes POP3 musí být **uživatel POP3** emailová adresa aliasu, který existuje pro doménu na <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Můj účet <i class="fa fa-angle-right"></i> Domény</a> – a **heslo IMAP** musí být alias-specifické generované heslo.

Podívejte se na [Podporujete POP3](#do-you-support-pop3) pro podrobné instrukce krok za krokem.

### Jak nastavit automatické zjišťování emailu pro mou doménu {#how-do-i-set-up-email-autodiscovery-for-my-domain}

Automatické zjišťování emailu umožňuje emailovým klientům jako jsou **Thunderbird**, **Apple Mail**, **Microsoft Outlook** a mobilním zařízením automaticky detekovat správná nastavení serverů IMAP, SMTP, POP3, CalDAV a CardDAV, když uživatel přidá svůj emailový účet. Toto je definováno v [RFC 6186](https://www.rfc-editor.org/rfc/rfc6186.html) (email) a [RFC 6764](https://www.rfc-editor.org/rfc/rfc6764.html) (CalDAV/CardDAV) a využívá DNS SRV záznamy.

Forward Email publikuje autodiscovery záznamy na `forwardemail.net`. Můžete buď přidat SRV záznamy přímo do své domény, nebo použít jednodušší přístup s CNAME.

#### Možnost A: CNAME záznamy (nejjednodušší) {#option-a-cname-records-simplest}

Přidejte tyto dva CNAME záznamy do DNS vaší domény. Tím delegujete autodiscovery na servery Forward Email:

|  Typ  | Název/Hostitel | Cíl/Hodnota                   |
| :---: | -------------- | ----------------------------- |
| CNAME | `autoconfig`   | `autoconfig.forwardemail.net` |
| CNAME | `autodiscover` | `autodiscover.forwardemail.net` |

Záznam `autoconfig` používá **Thunderbird** a další klienti založení na Mozille. Záznam `autodiscover` používá **Microsoft Outlook**.

#### Možnost B: SRV záznamy (přímé) {#option-b-srv-records-direct}

Pokud dáváte přednost přidání záznamů přímo (nebo váš DNS poskytovatel nepodporuje CNAME na subdoménách), přidejte tyto SRV záznamy do své domény:

| Typ | Název/Hostitel      | Priorita | Váha | Port | Cíl/Hodnota                | Účel                                  |
| :--: | ------------------ | :------: | :--: | :--: | -------------------------- | ------------------------------------ |
|  SRV | `_imaps._tcp`      |     0    |  1   |  993 | `imap.forwardemail.net`    | IMAP přes SSL/TLS (doporučeno)       |
|  SRV | `_imap._tcp`       |     0    |  0   |   0  | `.`                        | Nešifrovaný IMAP zakázán             |
|  SRV | `_submissions._tcp`|     0    |  1   |  465 | `smtp.forwardemail.net`    | SMTP odesílání (SSL/TLS, doporučeno) |
|  SRV | `_submission._tcp` |     5    |  1   |  587 | `smtp.forwardemail.net`    | SMTP odesílání (STARTTLS)             |
|  SRV | `_pop3s._tcp`      |    10    |  1   |  995 | `pop3.forwardemail.net`    | POP3 přes SSL/TLS                    |
|  SRV | `_pop3._tcp`       |     0    |  0   |   0  | `.`                        | Nešifrovaný POP3 zakázán             |
|  SRV | `_caldavs._tcp`    |     0    |  1   |  443 | `caldav.forwardemail.net`  | CalDAV přes TLS (kalendáře)           |
|  SRV | `_caldav._tcp`     |     0    |  0   |   0  | `.`                        | Nešifrovaný CalDAV zakázán           |
|  SRV | `_carddavs._tcp`   |     0    |  1   |  443 | `carddav.forwardemail.net` | CardDAV přes TLS (kontakty)           |
|  SRV | `_carddav._tcp`    |     0    |  0   |   0  | `.`                        | Nešifrovaný CardDAV zakázán          |
> \[!NOTE]
> IMAP má nižší hodnotu priority (0) než POP3 (10), což říká e-mailovým klientům, aby preferovaly IMAP před POP3, pokud jsou obě dostupné. Záznamy s cílem `.` (jedna tečka) označují, že nešifrované (plaintext) verze těchto protokolů jsou záměrně zakázány podle [RFC 6186 Section 3.4](https://www.rfc-editor.org/rfc/rfc6186.html#section-3.4). SRV záznamy CalDAV a CardDAV dodržují [RFC 6764](https://www.rfc-editor.org/rfc/rfc6764.html) pro automatické zjišťování kalendářů a kontaktů.

#### Které e-mailové klienty podporují automatické zjišťování? {#which-email-clients-support-autodiscovery}

| Klient             | E-mail                                            | CalDAV/CardDAV                             |
| ------------------ | ------------------------------------------------ | ------------------------------------------ |
| Thunderbird        | `autoconfig` CNAME nebo SRV záznamy              | `autoconfig` XML nebo SRV záznamy (RFC 6764) |
| Apple Mail (macOS) | SRV záznamy (RFC 6186)                            | SRV záznamy (RFC 6764)                     |
| Apple Mail (iOS)   | SRV záznamy (RFC 6186)                            | SRV záznamy (RFC 6764)                     |
| Microsoft Outlook  | `autodiscover` CNAME nebo `_autodiscover._tcp` SRV | Nepodporováno                             |
| GNOME (Evolution)  | SRV záznamy (RFC 6186)                            | SRV záznamy (RFC 6764)                     |
| KDE (KMail)        | SRV záznamy (RFC 6186)                            | SRV záznamy (RFC 6764)                     |
| eM Client          | `autoconfig` nebo `autodiscover`                  | SRV záznamy (RFC 6764)                     |

> \[!TIP]
> Pro nejlepší kompatibilitu napříč všemi klienty doporučujeme použít **Možnost A** (CNAME záznamy) v kombinaci se SRV záznamy z **Možnosti B**. Pouze přístup s CNAME pokrývá většinu e-mailových klientů. SRV záznamy CalDAV/CardDAV zajistí, že klienti kalendářů a kontaktů také automaticky najdou nastavení vašeho serveru.


## Bezpečnost {#security-1}

### Pokročilé techniky zpevnění serveru {#advanced-server-hardening-techniques}

> \[!TIP]
> Více o naší bezpečnostní infrastruktuře se dozvíte na [naší stránce Bezpečnost](/security).

Forward Email implementuje řadu technik zpevnění serveru, aby zajistil bezpečnost naší infrastruktury a vašich dat:

1. **Síťová bezpečnost**:
   * Firewall IP tables s přísnými pravidly
   * Fail2ban pro ochranu proti hrubé síle
   * Pravidelné bezpečnostní audity a penetrační testy
   * Administrativní přístup pouze přes VPN

2. **Zpevnění systému**:
   * Minimální instalace balíčků
   * Pravidelné bezpečnostní aktualizace
   * SELinux v režimu enforcing
   * Zakázaný root SSH přístup
   * Autentizace pouze na základě klíčů

3. **Bezpečnost aplikací**:
   * Hlavičky Content Security Policy (CSP)
   * HTTPS Strict Transport Security (HSTS)
   * Hlavičky pro ochranu proti XSS
   * Hlavičky pro nastavení rámců a referrer policy
   * Pravidelné audity závislostí

4. **Ochrana dat**:
   * Kompletní šifrování disku pomocí LUKS
   * Bezpečná správa klíčů
   * Pravidelné zálohy s šifrováním
   * Praktiky minimalizace dat

5. **Monitorování a reakce**:
   * Detekce průniků v reálném čase
   * Automatizované bezpečnostní skenování
   * Centralizované logování a analýza
   * Postupy reakce na incidenty

> \[!IMPORTANT]
> Naše bezpečnostní postupy jsou průběžně aktualizovány, aby řešily nové hrozby a zranitelnosti.

> \[!TIP]
> Pro maximální bezpečnost doporučujeme používat naši službu s end-to-end šifrováním přes OpenPGP.

### Máte certifikace SOC 2 nebo ISO 27001 {#do-you-have-soc-2-or-iso-27001-certifications}

> \[!NOTE]
> Forward Email běží na infrastruktuře poskytované certifikovanými subdodavateli, aby byla zajištěna shoda s průmyslovými standardy.

Forward Email přímo nevlastní certifikace SOC 2 Type II nebo ISO 27001. Služba však běží na infrastruktuře poskytované certifikovanými subdodavateli:

* **DigitalOcean**: certifikace SOC 2 Type II a SOC 3 Type II (auditováno Schellman & Company LLC), ISO 27001 certifikace na několika datových centrech. Podrobnosti: <https://www.digitalocean.com/trust/certification-reports>
* **Vultr**: certifikace SOC 2+ (HIPAA), certifikace ISO/IEC: 20000-1:2018, 27001:2022, 27017:2015, 27018:2019. Podrobnosti: <https://www.vultr.com/legal/compliance/>

* **DataPacket**: v souladu se SOC 2 (kontaktujte přímo DataPacket pro získání certifikace), poskytovatel infrastruktury na podnikové úrovni (lokalita Denver). Podrobnosti: <https://www.datapacket.com/datacenters/denver>

Forward Email dodržuje nejlepší průmyslové postupy pro bezpečnostní audity a pravidelně spolupracuje s nezávislými bezpečnostními výzkumníky. Zdroj: <https://forwardemail.net/technical-whitepaper.pdf#page=36>

### Používáte TLS šifrování pro přeposílání e-mailů {#do-you-use-tls-encryption-for-email-forwarding}

Ano. Forward Email přísně vyžaduje TLS 1.2+ pro všechna připojení (HTTPS, SMTP, IMAP, POP3) a implementuje MTA-STS pro rozšířenou podporu TLS. Implementace zahrnuje:

* Vynucení TLS 1.2+ pro všechna e-mailová připojení
* ECDHE (Elliptic Curve Diffie-Hellman Ephemeral) výměnu klíčů pro perfektní forward secrecy
* Moderní šifrovací sady s pravidelnými bezpečnostními aktualizacemi
* Podporu HTTP/2 pro lepší výkon a bezpečnost
* HSTS (HTTP Strict Transport Security) s přednačtením v hlavních prohlížečích
* **MTA-STS (Mail Transfer Agent Strict Transport Security)** pro přísné vynucení TLS

Zdroj: <https://forwardemail.net/technical-whitepaper.pdf#page=25>

**Implementace MTA-STS**: Forward Email implementuje přísné vynucení MTA-STS v kódu. Když dojde k chybám TLS a MTA-STS je vynucováno, systém vrací stavové kódy SMTP 421, aby zajistil, že e-maily budou později znovu odeslány místo toho, aby byly doručeny nezabezpečeně. Podrobnosti implementace:

* Detekce chyb TLS: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-tls-error.js>
* Vynucení MTA-STS v pomocném skriptu send-email: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/send-email.js>

Ověření třetí stranou: <https://www.hardenize.com/report/forwardemail.net/1750312779> ukazuje hodnocení „Good“ pro všechna opatření týkající se TLS a bezpečnosti přenosu.

### Zachováváte hlavičky autentizace e-mailů {#do-you-preserve-email-authentication-headers}

Ano. Forward Email komplexně implementuje a zachovává hlavičky autentizace e-mailů:

* **SPF (Sender Policy Framework)**: správně implementováno a zachováno
* **DKIM (DomainKeys Identified Mail)**: plná podpora s řádnou správou klíčů
* **DMARC**: vynucování politiky pro e-maily, které neprojdou validací SPF nebo DKIM
* **ARC**: i když není explicitně uvedeno, perfektní skóre služby naznačuje komplexní zacházení s autentizačními hlavičkami

Zdroj: <https://forwardemail.net/technical-whitepaper.pdf#page=31>

Ověření: Internet.nl Mail Test ukazuje skóre 100/100 konkrétně za implementaci „SPF, DKIM a DMARC“. Hodnocení Hardenize potvrzuje hodnocení „Good“ pro SPF a DMARC: <https://www.hardenize.com/report/forwardemail.net/1750312779>

### Zachováváte původní hlavičky e-mailů a zabraňujete spoofingu {#do-you-preserve-original-email-headers-and-prevent-spoofing}

> \[!TIP]
> Forward Email implementuje sofistikovanou ochranu proti spoofingu, aby zabránil zneužití e-mailů.

Forward Email zachovává původní hlavičky e-mailů a zároveň implementuje komplexní ochranu proti spoofingu prostřednictvím MX kódu:

* **Zachování hlaviček**: původní autentizační hlavičky jsou zachovány během přeposílání
* **Ochrana proti spoofingu**: vynucování politiky DMARC zabraňuje spoofingu hlaviček tím, že odmítá e-maily, které neprojdou validací SPF nebo DKIM
* **Prevence vkládání hlaviček**: validace vstupu a sanitizace pomocí knihovny striptags
* **Pokročilá ochrana**: sofistikovaná detekce phishingu s detekcí spoofingu, prevencí napodobování a systémem upozornění uživatelů

**Detaily implementace MX**: Hlavní logika zpracování e-mailů je řešena v kódu MX serveru, konkrétně:

* Hlavní MX zpracovatel dat: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>
* Filtrování libovolných e-mailů (anti-spoofing): <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-arbitrary.js>

Pomocný skript `isArbitrary` implementuje sofistikovaná pravidla proti spoofingu včetně detekce napodobování domény, blokovaných frází a různých phishingových vzorců.
### Jak se chráníte proti spamu a zneužití {#how-do-you-protect-against-spam-and-abuse}

Forward Email implementuje komplexní vícevrstvou ochranu:

* **Omezení rychlosti**: Aplikováno na pokusy o autentizaci, API endpointy a SMTP připojení
* **Izolace zdrojů**: Mezi uživateli, aby se zabránilo dopadu uživatelů s vysokým objemem
* **Ochrana proti DDoS**: Vícevrstvá ochrana prostřednictvím systému Shield od DataPacket a Cloudflare
* **Automatické škálování**: Dynamické přizpůsobení zdrojů podle poptávky
* **Prevence zneužití**: Kontroly prevence zneužití specifické pro uživatele a blokování na základě hashů pro škodlivý obsah
* **Autentizace e-mailů**: Protokoly SPF, DKIM, DMARC s pokročilou detekcí phishingu

Zdroje:

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver> (detaily ochrany proti DDoS)
* <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/abuse-prevention-by-user-id.js>

### Ukládáte obsah e-mailů na disk {#do-you-store-email-content-on-disk}

> \[!IMPORTANT]
> Forward Email používá architekturu zero-knowledge, která zabraňuje zápisu obsahu e-mailů na disk.

* **Architektura zero-knowledge**: Individuálně šifrované SQLite schránky znamenají, že Forward Email nemůže přistupovat k obsahu e-mailů
* **Zpracování v paměti**: Zpracování e-mailů probíhá zcela v paměti, bez ukládání na disk
* **Žádné logování obsahu**: „Neukládáme ani nezaznamenáváme obsah e-mailů nebo metadata na disk“
* **Sandboxované šifrování**: Šifrovací klíče nikdy nejsou uloženy na disku v prostém textu

**Důkaz z kódu MX**: MX server zpracovává e-maily zcela v paměti bez zápisu obsahu na disk. Hlavní handler pro zpracování e-mailů demonstruje tento přístup v paměti: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

Zdroje:

* <https://forwardemail.net/technical-whitepaper.pdf#page=10> (Abstrakt)
* <https://forwardemail.net/technical-whitepaper.pdf#page=59> (Detaily zero-knowledge)
* <https://forwardemail.net/technical-whitepaper.pdf#page=21> (Sandboxované šifrování)

### Může být obsah e-mailu vystaven při haváriích systému {#can-email-content-be-exposed-during-system-crashes}

Ne. Forward Email implementuje komplexní opatření proti vystavení dat při haváriích:

* **Core dumps zakázány**: Zabraňuje vystavení paměti při haváriích
* **Swap paměť zakázána**: Kompletně zakázána, aby se zabránilo získání citlivých dat ze swap souborů
* **Architektura v paměti**: Obsah e-mailu existuje pouze v nestálé paměti během zpracování
* **Ochrana šifrovacích klíčů**: Klíče nikdy nejsou uloženy na disku v prostém textu
* **Fyzická bezpečnost**: Disky šifrované LUKS v2 zabraňují fyzickému přístupu k datům
* **USB úložiště zakázáno**: Zabraňuje neoprávněnému získání dat

**Zpracování chyb systémových problémů**: Forward Email používá pomocné funkce `isCodeBug` a `isTimeoutError`, aby zajistil, že pokud dojde k problémům s připojením k databázi, DNS síťovým/blokovacím problémům nebo problémům s upstream připojením, systém vrátí SMTP stavový kód 421, aby bylo zajištěno, že e-maily budou později znovu odeslány místo ztráty nebo vystavení.

Detaily implementace:

* Klasifikace chyb: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js>
* Zpracování timeout chyb v MX: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

Zdroj: <https://forwardemail.net/technical-whitepaper.pdf#page=15>

### Kdo má přístup k vaší e-mailové infrastruktuře {#who-has-access-to-your-email-infrastructure}

Forward Email implementuje komplexní přístupová práva pro svůj minimální 2-3 členný inženýrský tým s přísnými požadavky na 2FA:

* **Řízení přístupu na základě rolí**: Pro týmové účty s oprávněními založenými na zdrojích
* **Princip nejmenších práv**: Aplikován ve všech systémech
* **Oddělení povinností**: Mezi operačními rolemi
* **Správa uživatelů**: Oddělení uživatelů pro nasazení a devops s odlišnými oprávněními
* **Root login zakázán**: Nutí přístup přes řádně autentizované účty
* **Přísné 2FA**: Žádné SMS 2FA kvůli riziku MiTM útoků – pouze aplikace nebo hardwarové tokeny
* **Komplexní auditní logování**: S redakcí citlivých dat
* **Automatická detekce anomálií**: Pro neobvyklé vzory přístupu
* **Pravidelné bezpečnostní kontroly**: Přístupových logů
* **Prevence útoku Evil Maid**: USB úložiště zakázáno a další fyzická bezpečnostní opatření
Zdroje:

* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (Řízení autorizace)
* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (Síťová bezpečnost)
* <https://forwardemail.net/technical-whitepaper.pdf#page=15> (Prevence útoku „evil maid“)

### Jaké poskytovatele infrastruktury používáte {#what-infrastructure-providers-do-you-use}

> \[!IMPORTANT]
> Forward Email používá více subprocesorů infrastruktury s komplexními certifikacemi souladu.

Kompletní podrobnosti jsou k dispozici na naší stránce souladu s GDPR: <https://forwardemail.net/gdpr>

**Hlavní subprocesoři infrastruktury:**

| Poskytovatel    | Certifikace rámce ochrany osobních údajů | Stránka souladu s GDPR                                                                    |
| --------------- | ---------------------------------------- | ----------------------------------------------------------------------------------------- |
| **Cloudflare**  | ✅ Ano                                   | <https://www.cloudflare.com/trust-hub/gdpr/>                                             |
| **DataPacket**  | ❌ Ne                                    | <https://www.datapacket.com/privacy-policy>                                              |
| **DigitalOcean**| ❌ Ne                                    | <https://www.digitalocean.com/legal/gdpr>                                                |
| **GitHub**      | ✅ Ano                                   | <https://docs.github.com/en/site-policy/privacy-policies/github-data-protection-agreement>|
| **Vultr**       | ❌ Ne                                    | <https://www.vultr.com/legal/eea-gdpr-privacy/>                                          |

**Podrobné certifikace:**

**DigitalOcean**

* SOC 2 Type II & SOC 3 Type II (auditováno Schellman & Company LLC)
* ISO 27001 certifikace ve více datových centrech
* Soulad s PCI-DSS
* Certifikace CSA STAR Level 1
* Certifikace APEC CBPR PRP
* Podrobnosti: <https://www.digitalocean.com/trust/certification-reports>

**Vultr**

* Certifikace SOC 2+ (HIPAA)
* Soulad s PCI Merchant
* Certifikace CSA STAR Level 1
* ISO/IEC 20000-1:2018, 27001:2022, 27017:2015, 27018:2019
* Podrobnosti: <https://www.vultr.com/legal/compliance/>

**DataPacket**

* Soulad se SOC 2 (kontaktujte přímo DataPacket pro získání certifikace)
* Infrastruktura podnikové úrovně (lokalita Denver)
* Ochrana proti DDoS pomocí kybernetického stacku Shield
* Technická podpora 24/7
* Globální síť přes 58 datových center
* Podrobnosti: <https://www.datapacket.com/datacenters/denver>

**GitHub**

* Certifikace rámce ochrany osobních údajů (EU-USA, Švýcarsko-USA a rozšíření UK)
* Hosting zdrojového kódu, CI/CD a řízení projektů
* K dispozici GitHub Data Protection Agreement
* Podrobnosti: <https://docs.github.com/en/site-policy/privacy-policies/github-data-protection-agreement>

**Zpracovatelé plateb:**

* **Stripe**: Certifikace rámce ochrany osobních údajů - <https://stripe.com/legal/privacy-center>
* **PayPal**: Není certifikován DPF - <https://www.paypal.com/uk/legalhub/privacy-full>

### Nabízíte smlouvu o zpracování údajů (DPA) {#do-you-offer-a-data-processing-agreement-dpa}

Ano, Forward Email nabízí komplexní smlouvu o zpracování údajů (DPA), kterou lze podepsat v rámci naší podnikové smlouvy. Kopie naší DPA je k dispozici na: <https://forwardemail.net/dpa>

**Podrobnosti DPA:**

* Pokrývá soulad s GDPR a rámce EU-USA/Švýcarsko-USA Privacy Shield
* Automaticky přijímána při souhlasu s našimi Podmínkami služby
* Pro standardní DPA není vyžadován samostatný podpis
* Možnosti vlastních DPA dohod dostupné prostřednictvím Enterprise License

**Rámec souladu s GDPR:**
Naše DPA podrobně popisuje soulad s GDPR i mezinárodními požadavky na přenos dat. Kompletní informace jsou k dispozici na: <https://forwardemail.net/gdpr>

Pro podnikové zákazníky vyžadující vlastní podmínky DPA nebo specifické smluvní ujednání lze tyto řešit prostřednictvím našeho programu **Enterprise License (250 USD/měsíc)**.

### Jak řešíte oznámení o narušení bezpečnosti dat {#how-do-you-handle-data-breach-notifications}

> \[!NOTE]
> Architektura Forward Email s nulovými znalostmi výrazně omezuje dopad narušení.
* **Omezené vystavení dat**: Nelze přistupovat k šifrovanému obsahu e-mailů díky architektuře zero-knowledge
* **Minimální sběr dat**: Pouze základní informace o odběratelích a omezené IP záznamy pro bezpečnost
* **Rámce subprocesorů**: DigitalOcean, GitHub a Vultr udržují postupy reakce na incidenty v souladu s GDPR

**Informace o zástupci GDPR:**
Forward Email jmenoval zástupce GDPR v souladu s článkem 27:

**Zástupce EU:**
Osano International Compliance Services Limited
ATTN: LFHC
3 Dublin Landings, North Wall Quay
Dublin 1, D01C4E0

**Zástupce UK:**
Osano UK Compliance LTD
ATTN: LFHC
42-46 Fountain Street, Belfast
Antrim, BT1 - 5EF

Pro podnikové zákazníky vyžadující specifické SLA pro oznámení o porušení by měly být tyto podmínky projednány jako součást **Enterprise License** smlouvy.

Zdroje:

* <https://forwardemail.net/technical-whitepaper.pdf#page=59>
* <https://forwardemail.net/gdpr>

### Nabízíte testovací prostředí {#do-you-offer-a-test-environment}

Technická dokumentace Forward Email explicitně nepopisuje vyhrazený sandbox režim. Potenciální přístupy k testování však zahrnují:

* **Možnost vlastního hostingu**: Komplexní možnosti vlastního hostingu pro vytváření testovacích prostředí
* **API rozhraní**: Potenciál pro programové testování konfigurací
* **Open Source**: 100% otevřený zdrojový kód umožňuje zákazníkům prozkoumat logiku přeposílání
* **Více domén**: Podpora více domén může umožnit vytvoření testovací domény

Pro podnikové zákazníky vyžadující formální sandbox funkce by to mělo být projednáno jako součást **Enterprise License** dohody.

Zdroj: <https://github.com/forwardemail/forwardemail.net> (Detaily vývojového prostředí)

### Poskytujete nástroje pro monitorování a upozorňování {#do-you-provide-monitoring-and-alerting-tools}

Forward Email poskytuje monitorování v reálném čase s určitými omezeními:

**Dostupné:**

* **Monitorování doručení v reálném čase**: Veřejně viditelné výkonnostní metriky pro hlavní poskytovatele e-mailů
* **Automatické upozornění**: Inženýrský tým je upozorněn, když doba doručení přesáhne 10 sekund
* **Transparentní monitorování**: 100% open-source monitorovací systémy
* **Monitorování infrastruktury**: Automatické detekce anomálií a komplexní auditní záznamy

**Omezení:**

* Webhooky pro zákazníky nebo notifikace o stavu doručení přes API nejsou explicitně dokumentovány

Pro podnikové zákazníky vyžadující podrobné webhooky o stavu doručení nebo vlastní monitorovací integrace mohou být tyto funkce dostupné prostřednictvím **Enterprise License** dohod.

Zdroje:

* <https://forwardemail.net> (Zobrazení monitorování v reálném čase)
* <https://github.com/forwardemail/forwardemail.net> (Implementace monitorování)

### Jak zajišťujete vysokou dostupnost {#how-do-you-ensure-high-availability}

> \[!IMPORTANT]
> Forward Email implementuje komplexní redundanci napříč více poskytovateli infrastruktury.

* **Distribuovaná infrastruktura**: Více poskytovatelů (DigitalOcean, Vultr, DataPacket) napříč geografickými oblastmi
* **Geografické vyvažování zátěže**: Geo-lokalizované vyvažování zátěže založené na Cloudflare s automatickým přepnutím
* **Automatické škálování**: Dynamické přizpůsobení zdrojů podle poptávky
* **Vícevrstvá ochrana proti DDoS**: Prostřednictvím systému Shield od DataPacket a Cloudflare
* **Redundance serverů**: Více serverů na region s automatickým přepnutím
* **Replikace databáze**: Synchronizace dat v reálném čase napříč více lokalitami
* **Monitorování a upozorňování**: 24/7 monitorování s automatickou reakcí na incidenty

**Závazek dostupnosti**: 99,9 %+ dostupnost služby s transparentním monitorováním na <https://forwardemail.net>

Zdroje:

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver>

### Jste v souladu s oddílem 889 zákona o národní obraně (NDAA) {#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa}

> \[!IMPORTANT]
> Forward Email je plně v souladu s oddílem 889 díky pečlivému výběru partnerů infrastruktury.

Ano, Forward Email je **v souladu s oddílem 889**. Oddíl 889 zákona o národní obraně (NDAA) zakazuje vládním agenturám používat nebo uzavírat smlouvy s entitami, které používají telekomunikační a video dohledové zařízení od specifických společností (Huawei, ZTE, Hikvision, Dahua a Hytera).
**Jak Forward Email dosahuje souladu s částí 889:**

Forward Email spoléhá výhradně na dva klíčové poskytovatele infrastruktury, z nichž žádný nepoužívá zařízení zakázaná podle části 889:

1. **Cloudflare**: Náš hlavní partner pro síťové služby a zabezpečení e-mailů
2. **DataPacket**: Náš hlavní poskytovatel serverové infrastruktury (výhradně používající zařízení Arista Networks a Cisco)
3. **Záložní poskytovatelé**: Naši záložní poskytovatelé Digital Ocean a Vultr jsou navíc písemně potvrzeni jako splňující požadavky části 889.

**Závazek Cloudflare**: Cloudflare výslovně uvádí ve svém Kodexu chování třetích stran, že nepoužívají telekomunikační zařízení, produkty video dohledu ani služby od žádných subjektů zakázaných podle části 889.

**Případ použití ve vládě**: Náš soulad s částí 889 byl ověřen, když **US Naval Academy** vybrala Forward Email pro své potřeby bezpečného přeposílání e-mailů, vyžadující dokumentaci našich federálních standardů souladu.

Pro úplné informace o našem rámci vládního souladu, včetně širších federálních předpisů, si přečtěte naši komplexní případovou studii: [Federální vládní e-mailová služba v souladu s částí 889](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)


## Systémové a technické detaily {#system-and-technical-details}

### Uchováváte e-maily a jejich obsah {#do-you-store-emails-and-their-contents}

Ne, neukládáme na disk ani neuchováváme logy – s [výjimkou chyb](#do-you-store-error-logs) a [odchozího SMTP](#do-you-support-sending-email-with-smtp) (viz naše [Zásady ochrany osobních údajů](/privacy)).

Vše probíhá v paměti a [náš zdrojový kód je na GitHubu](https://github.com/forwardemail).

### Jak funguje váš systém přeposílání e-mailů {#how-does-your-email-forwarding-system-work}

E-mail využívá [SMTP protokol](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol). Tento protokol se skládá z příkazů zasílaných serveru (nejčastěji běžícímu na portu 25). Nejprve se naváže spojení, pak odesílatel uvede, odkud je pošta ("MAIL FROM"), následně kam směřuje ("RCPT TO") a nakonec hlavičky a samotné tělo e-mailu ("DATA"). Průběh našeho systému přeposílání e-mailů je popsán vzhledem ke každému příkazu SMTP protokolu níže:

* Počáteční spojení (bez názvu příkazu, např. `telnet example.com 25`) – Toto je počáteční spojení. Kontrolujeme odesílatele, kteří nejsou na naší [povoleném seznamu](#do-you-have-an-allowlist), vůči našemu [zakázanému seznamu](#do-you-have-a-denylist). Nakonec, pokud odesílatel není na povoleném seznamu, zkontrolujeme, zda nebyl [zařazen do šedého seznamu](#do-you-have-a-greylist).

* `HELO` – Tento příkaz slouží jako pozdrav k identifikaci FQDN odesílatele, IP adresy nebo názvu mailového handleru. Tato hodnota může být falšována, proto na ni nespoléháme a místo toho používáme reverzní vyhledávání hostname IP adresy spojení.

* `MAIL FROM` – Tento příkaz označuje adresu odesílatele v obálce e-mailu. Pokud je zadána hodnota, musí být platná e-mailová adresa podle RFC 5322. Prázdné hodnoty jsou povoleny. Zde [kontrolujeme zpětný odraz](#how-do-you-protect-against-backscatter) a také kontrolujeme MAIL FROM vůči našemu [zakázanému seznamu](#do-you-have-a-denylist). Nakonec kontrolujeme odesílatele, kteří nejsou na povoleném seznamu, kvůli omezení rychlosti (viz sekce o [omezení rychlosti](#do-you-have-rate-limiting) a [povoleném seznamu](#do-you-have-an-allowlist) pro více informací).

* `RCPT TO` – Tento příkaz označuje příjemce e-mailu. Musí to být platné e-mailové adresy podle RFC 5322. Povolujeme maximálně 50 příjemců v obálce na zprávu (to se liší od hlavičky "To" v e-mailu). Také zde kontrolujeme platnou adresu podle [Sender Rewriting Scheme](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme) ("SRS") k ochraně proti falšování s naší doménou SRS.

* `DATA` – Toto je jádro naší služby, které zpracovává e-mail. Pro více informací viz sekce [Jak zpracováváte e-mail pro přeposílání](#how-do-you-process-an-email-for-forwarding) níže.
### Jak zpracováváte e-mail pro přeposílání {#how-do-you-process-an-email-for-forwarding}

Tato sekce popisuje náš proces související s příkazem protokolu SMTP `DATA` v sekci [Jak funguje váš systém přeposílání e-mailů](#how-does-your-email-forwarding-system-work) výše – jak zpracováváme hlavičky e-mailu, tělo, zabezpečení, určujeme, kam má být doručen, a jak řešíme připojení.

1. Pokud zpráva překročí maximální velikost 50 MB, je odmítnuta s chybovým kódem 552.

2. Pokud zpráva neobsahovala hlavičku "From" nebo pokud některá z hodnot v hlavičce "From" nebyla platná e-mailová adresa podle RFC 5322, je odmítnuta s chybovým kódem 550.

3. Pokud zpráva obsahovala více než 25 hlaviček "Received", bylo zjištěno, že uvízla v přesměrovacím cyklu, a je odmítnuta s chybovým kódem 550.

4. Pomocí otisku e-mailu (viz sekce o [Fingerprintingu](#how-do-you-determine-an-email-fingerprint)) zkontrolujeme, zda se zpráva nepokusila o opakované doručení déle než 5 dní (což odpovídá [výchozímu chování postfixu](http://www.postfix.org/postconf.5.html#maximal_queue_lifetime)), a pokud ano, je odmítnuta s chybovým kódem 550.

5. Výsledky skenování e-mailu pomocí [Spam Scanner](https://spamscanner.net) ukládáme v paměti.

6. Pokud byly nalezeny jakékoli arbitrážní výsledky ze Spam Scanneru, je zpráva odmítnuta s chybovým kódem 554. Arbitrážní výsledky v době psaní zahrnují pouze test GTUBE. Více informací naleznete na <https://spamassassin.apache.org/gtube/>.

7. Přidáme do zprávy následující hlavičky pro účely ladění a prevence zneužití:

   * `Received` – přidáme standardní hlavičku Received s původní IP a hostitelem, typem přenosu, informacemi o TLS připojení, datem/časem a příjemcem.
   * `X-Original-To` – původní příjemce zprávy:
     * Toto je užitečné pro určení, kam byl e-mail původně doručen (kromě hlavičky "Received").
     * Přidává se pro každého příjemce zvlášť v době IMAP a/nebo maskovaného přeposílání (za účelem ochrany soukromí).
   * `X-Forward-Email-Website` – obsahuje odkaz na naše webové stránky <https://forwardemail.net>
   * `X-Forward-Email-Version` – aktuální [SemVer](https://semver.org/) verze z `package.json` našeho kódu.
   * `X-Forward-Email-Session-ID` – hodnota ID relace používaná pro ladění (platí pouze v neprodukčních prostředích).
   * `X-Forward-Email-Sender` – čárkou oddělený seznam obsahující původní adresu MAIL FROM obálky (pokud nebyla prázdná), reverzní PTR klienta FQDN (pokud existuje) a IP adresu odesílatele.
   * `X-Forward-Email-ID` – platí pouze pro odchozí SMTP a koreluje s ID e-mailu uloženým v Můj účet → E-maily
   * `X-Report-Abuse` – s hodnotou `abuse@forwardemail.net`.
   * `X-Report-Abuse-To` – s hodnotou `abuse@forwardemail.net`.
   * `X-Complaints-To` – s hodnotou `abuse@forwardemail.net`.

8. Následně kontrolujeme zprávu na [DKIM](https://en.wikipedia.org/wiki/DomainKeys_Identified_Mail), [SPF](https://en.wikipedia.org/wiki/Sender_Policy_Framework), [ARC](https://en.wikipedia.org/wiki/Authenticated_Received_Chain) a [DMARC](https://en.wikipedia.org/wiki/DMARC).

   * Pokud zpráva neprošla DMARC a doména měla politiku odmítnutí (např. `p=reject` [bylo v DMARC politice](https://wikipedia.org/wiki/DMARC)), je odmítnuta s chybovým kódem 550. Obvykle lze DMARC politiku domény najít v `_dmarc` subdoméně <strong class="notranslate">TXT</strong> záznamu (např. `dig _dmarc.example.com txt`).
   * Pokud zpráva neprošla SPF a doména měla tvrdou politiku selhání (např. `-all` bylo v SPF politice na rozdíl od `~all` nebo žádné politiky), je odmítnuta s chybovým kódem 550. Obvykle lze SPF politiku domény najít v <strong class="notranslate">TXT</strong> záznamu pro kořenovou doménu (např. `dig example.com txt`). Více informací o [odesílání pošty jako v Gmailu](#can-i-send-mail-as-in-gmail-with-this) týkající se SPF naleznete v této sekci.
9. Nyní zpracováváme příjemce zprávy, jak byli shromážděni z příkazu `RCPT TO` v sekci [Jak funguje váš systém přeposílání e-mailů](#how-does-your-email-forwarding-system-work) výše. Pro každého příjemce provádíme následující operace:

   * Vyhledáme <strong class="notranslate">TXT</strong> záznamy doménového jména (část za symbolem `@`, např. `example.com`, pokud byla e-mailová adresa `test@example.com`). Například pokud je doména `example.com`, provedeme DNS dotaz jako `dig example.com txt`.
   * Analyzujeme všechny <strong class="notranslate">TXT</strong> záznamy, které začínají buď `forward-email=` (bezplatné plány) nebo `forward-email-site-verification=` (placené plány). Všimněte si, že analyzujeme oba, abychom mohli zpracovávat e-maily během upgradu nebo downgradu plánu uživatelem.
   * Z těchto analyzovaných <strong class="notranslate">TXT</strong> záznamů iterujeme, abychom extrahovali konfiguraci přeposílání (jak je popsáno v sekci [Jak začít a nastavit přeposílání e-mailů](#how-do-i-get-started-and-set-up-email-forwarding) výše). Všimněte si, že podporujeme pouze jednu hodnotu `forward-email-site-verification=`, a pokud je jich více, dojde k chybě 550 a odesílatel obdrží odmítnutí pro tohoto příjemce.
   * Rekurzivně iterujeme přes extrahovanou konfiguraci přeposílání, abychom určili globální přeposílání, přeposílání založené na regulárních výrazech a všechny ostatní podporované konfigurace přeposílání – které jsou nyní známy jako naše "Přeposílací adresy".
   * Pro každou Přeposílací adresu podporujeme jedno rekurzivní vyhledávání (které spustí tuto sérii operací znovu pro danou adresu). Pokud je nalezena rekurzivní shoda, rodičovský výsledek bude odstraněn z Přeposílacích adres a děti přidány.
   * Přeposílací adresy jsou analyzovány na jedinečnost (protože nechceme posílat duplicitní zprávy na jednu adresu nebo vytvářet zbytečné další SMTP klientské připojení).
   * Pro každou Přeposílací adresu vyhledáme její doménové jméno pomocí našeho API endpointu `/v1/max-forwarded-addresses` (abychom zjistili, kolika adresám může doména přeposílat e-maily na alias, např. výchozích 10 – viz sekce o [maximálním limitu přeposílání na alias](#is-there-a-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias)). Pokud je tento limit překročen, dojde k chybě 550 a odesílatel obdrží odmítnutí pro tohoto příjemce.
   * Vyhledáme nastavení původního příjemce pomocí našeho API endpointu `/v1/settings`, který podporuje vyhledávání pro placené uživatele (s fallbackem pro bezplatné uživatele). Toto vrací konfigurační objekt pro pokročilá nastavení `port` (Číslo, např. `25`), `has_adult_content_protection` (Boolean), `has_phishing_protection` (Boolean), `has_executable_protection` (Boolean) a `has_virus_protection` (Boolean).
   * Na základě těchto nastavení pak kontrolujeme výsledky Spam Scanneru a pokud dojde k jakýmkoli chybám, zpráva je odmítnuta s chybovým kódem 554 (např. pokud je povolena ochrana proti virům `has_virus_protection`, kontrolujeme výsledky Spam Scanneru na viry). Všimněte si, že všichni uživatelé bezplatného plánu jsou automaticky zapojeni do kontrol proti obsahu pro dospělé, phishingu, spustitelným souborům a virům. Výchozí nastavení pro všechny uživatele placených plánů je také zapojení, ale toto nastavení lze změnit na stránce Nastavení domény v dashboardu Forward Email).

10. Pro každou zpracovanou Přeposílací adresu příjemce pak provádíme následující operace:

    * Adresa je zkontrolována proti našemu [denylistu](#do-you-have-a-denylist), a pokud je na seznamu, dojde k chybě 421 (signalizuje odesílateli, aby to zkusil později znovu).
    * Pokud je adresa webhook, nastavíme Boolean pro budoucí operace (viz níže – seskupujeme podobné webhooky, abychom provedli jeden POST požadavek místo více pro doručení).
    * Pokud je adresa e-mailová adresa, analyzujeme hostitele pro budoucí operace (viz níže – seskupujeme podobné hostitele, abychom vytvořili jedno připojení místo více jednotlivých připojení pro doručení).
11. Pokud nejsou žádní příjemci a nejsou žádné odmítnutí (bounces), odpovíme chybou 550 „Neplatní příjemci“.

12. Pokud jsou příjemci, pak je procházíme (seskupené podle stejného hostitele) a doručujeme e-maily. Viz sekce [Jak řešíte problémy s doručováním e-mailů](#how-do-you-handle-email-delivery-issues) níže pro více informací.

    * Pokud během odesílání e-mailů dojde k nějakým chybám, uložíme je do paměti pro pozdější zpracování.
    * Vezmeme nejnižší chybový kód (pokud nějaký je) z odesílání e-mailů – a použijeme ho jako odpověď na příkaz `DATA`. To znamená, že e-maily, které nebyly doručeny, budou obvykle znovu odeslány původním odesílatelem, zatímco e-maily, které již byly doručeny, nebudou při dalším odeslání zprávy znovu odeslány (protože používáme [Fingerprinting](#how-do-you-determine-an-email-fingerprint)).
    * Pokud nedošlo k žádným chybám, pošleme úspěšný SMTP stavový kód 250.
    * Bounce je definován jako jakýkoli pokus o doručení, který skončí stavovým kódem >= 500 (trvalé chyby).

13. Pokud nedošlo k žádným bounce (trvalým chybám), vrátíme SMTP stavový kód nejnižšího chybového kódu z netrvalých chyb (nebo 250 úspěšný stavový kód, pokud žádné nebyly).

14. Pokud došlo k bounce, pošleme bounce e-maily na pozadí poté, co vrátíme odesílateli nejnižší ze všech chybových kódů. Pokud je však nejnižší chybový kód >= 500, žádné bounce e-maily neodesíláme. Je to proto, že pokud bychom je poslali, odesílatelé by obdrželi dvojitou bounce zprávu (např. jednu od svého odchozího MTA, jako je Gmail – a také jednu od nás). Viz sekce [Jak se chráníte proti backscatteru](#how-do-you-protect-against-backscatter) níže pro více informací.

### Jak řešíte problémy s doručováním e-mailů {#how-do-you-handle-email-delivery-issues}

Vezměte na vědomí, že provedeme přepis „Friendly-From“ na e-mailech pouze tehdy, pokud DMARC politika odesílatele neprošla A žádné DKIM podpisy nebyly zarovnány s hlavičkou „From“. To znamená, že upravíme hlavičku „From“ ve zprávě, nastavíme „X-Original-From“ a také nastavíme „Reply-To“, pokud již nebyl nastaven. Po úpravě těchto hlaviček také znovu uzavřeme ARC pečeť na zprávě.

Používáme také chytré parsování chybových zpráv na všech úrovních našeho stacku – v našem kódu, DNS požadavcích, interních funkcích Node.js, HTTP požadavcích (např. 408, 413 a 429 jsou mapovány na SMTP odpověď 421, pokud je příjemcem webhook) a odpovědích mail serveru (např. odpovědi s „defer“ nebo „slowdown“ budou znovu zkoušeny jako chyby 421).

Naše logika je odolná vůči chybám a také opakuje pokusy při chybách SSL/TLS, problémech s připojením a dalších. Cílem této odolnosti je maximalizovat doručitelnost ke všem příjemcům v konfiguraci přeposílání.

Pokud je příjemcem webhook, povolíme timeout 60 sekund pro dokončení požadavku s až 3 opakováními (tedy celkem 4 požadavky před selháním). Vezměte na vědomí, že správně parsujeme chybové kódy 408, 413 a 429 a mapujeme je na SMTP odpověď 421.

Pokud je příjemcem e-mailová adresa, pokusíme se odeslat e-mail s oportunistickým TLS (pokoušíme se použít STARTTLS, pokud je dostupný na mail serveru příjemce). Pokud během odesílání e-mailu dojde k chybě SSL/TLS, pokusíme se e-mail odeslat bez TLS (bez použití STARTTLS).

Pokud dojde k chybám DNS nebo připojení, vrátíme příkazu `DATA` SMTP odpověď 421, jinak pokud jsou chyby na úrovni >= 500, budou odeslány bounce zprávy.

Pokud zjistíme, že mail server, kterému se pokoušíme doručit, má zablokovanou jednu nebo více našich IP adres mail exchange (např. technologií, kterou používají k odkládání spammerů), pošleme SMTP odpověď 421, aby odesílatel mohl zprávu později znovu odeslat (a jsme upozorněni na problém, abychom ho mohli doufejme vyřešit před dalším pokusem).

### Jak řešíte zablokování vašich IP adres {#how-do-you-handle-your-ip-addresses-becoming-blocked}
Pravidelně monitorujeme všechny hlavní DNS denylisty a pokud jsou některé z našich IP adres mailových výměn ("MX") uvedeny v hlavním denylistu, pokud je to možné, odstraníme je z příslušného DNS A záznamu round robin, dokud nebude problém vyřešen.

V době psaní tohoto textu jsme také uvedeni v několika DNS allowlistech a bereme monitorování denylistů vážně. Pokud zaznamenáte nějaké problémy dříve, než je budeme mít možnost vyřešit, prosím, informujte nás písemně na <support@forwardemail.net>.

Naše IP adresy jsou veřejně dostupné, [viz tuto sekci níže pro více informací](#what-are-your-servers-ip-addresses).

### Co jsou adresy postmaster {#what-are-postmaster-addresses}

Abychom zabránili nesprávně směrovaným odrazům a odesílání zpráv o dovolené na nehlídané nebo neexistující poštovní schránky, udržujeme seznam uživatelských jmen podobných mailer-daemon:

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
* [a jakákoli adresa no-reply](#what-are-no-reply-addresses)

Pro více informací o tom, jak jsou takové seznamy používány k vytváření efektivních e-mailových systémů, viz [RFC 5320 Sekce 4.6](https://datatracker.ietf.org/doc/html/rfc5230#section-4.6).

### Co jsou adresy no-reply {#what-are-no-reply-addresses}

Uživatelská jména e-mailů odpovídající kterémukoli z následujících (bez ohledu na velikost písmen) jsou považována za adresy no-reply:

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

Tento seznam je udržován [jako open-source projekt na GitHubu](https://github.com/forwardemail/reserved-email-addresses-list).

### Jaké jsou IP adresy vašich serverů {#what-are-your-servers-ip-addresses}

Naše IP adresy zveřejňujeme na <https://forwardemail.net/ips>.

### Máte allowlist {#do-you-have-an-allowlist}

Ano, máme [seznam doménových přípon](#what-domain-name-extensions-are-allowlisted-by-default), které jsou ve výchozím nastavení na allowlistu, a dynamický, cachovaný a rotující allowlist založený na [přísných kritériích](#what-is-your-allowlist-criteria).

Všechny domény, e-maily a IP adresy používané platícími zákazníky jsou automaticky kontrolovány proti našemu denylistu každou hodinu – což upozorňuje administrátory, kteří mohou v případě potřeby ručně zasáhnout.

Navíc, pokud je některá z vašich domén nebo jejích e-mailových adres uvedena na denylistu (např. kvůli odesílání spamu, virů nebo kvůli útokům na napodobování) – budou administrátoři domény (vy) a naši týmoví administrátoři okamžitě upozorněni e-mailem. Důrazně doporučujeme, abyste [nastavili DMARC](#how-do-i-set-up-dmarc-for-forward-email), aby se tomu zabránilo.

### Jaké doménové přípony jsou ve výchozím nastavení na allowlistu {#what-domain-name-extensions-are-allowlisted-by-default}

Následující doménové přípony jsou považovány za ve výchozím nastavení na allowlistu (bez ohledu na to, zda jsou na Umbrella Popularity Listu nebo ne):

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
Navíc jsou tyto [značkové a korporátní domény nejvyšší úrovně](https://en.wikipedia.org/wiki/List_of_Internet_top-level_domains#Brand_and_corporate_top-level_domains) ve výchozím nastavení na seznamu povolených (např. `apple` pro `applecard.apple` pro výpisy z bankovního účtu Apple Card):

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
K 18. březnu 2025 jsme také přidali tyto francouzské zámořské území do tohoto seznamu ([podle tohoto požadavku na GitHubu](https://github.com/forwardemail/forwardemail.net/issues/327)):

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

K 8. červenci 2025 jsme přidali tyto evropské země:

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

V říjnu 2025 jsme také přidali <code class="notranslate">cz</code> (Česká republika) na základě poptávky.

Specificky jsme nezahrnuli `ru` a `ua` kvůli vysoké aktivitě spamu.

### Jaká jsou vaše kritéria pro allowlist {#what-is-your-allowlist-criteria}

Máme statický seznam [doménových přípon, které jsou ve výchozím nastavení na allowlistu](#what-domain-name-extensions-are-allowlisted-by-default) – a také udržujeme dynamický, cachovaný, průběžný allowlist založený na následujících přísných kritériích:

* Kořenová doména odesílatele musí být z [doménové přípony, která odpovídá seznamu, který nabízíme v našem bezplatném plánu](#what-domain-name-extensions-can-be-used-for-free) (s přidáním `biz` a `info`). Také zahrnujeme částečné shody `edu`, `gov` a `mil`, například `xyz.gov.au` a `xyz.edu.au`.
* Kořenová doména odesílatele musí být v top 100 000 unikátních kořenových domén podle výsledků z [Umbrella Popularity List](http://s3-us-west-1.amazonaws.com/umbrella-static/index.html "Umbrella Popularity List") ("UPL").
* Kořenová doména odesílatele musí být v top 50 000 výsledcích unikátních kořenových domén, které se objevily alespoň ve 4 z posledních 7 dnů UPL (~50 %+).
* Kořenová doména odesílatele nesmí být [kategorizována](https://radar.cloudflare.com/categorization-feedback/) jako obsah pro dospělé nebo malware podle Cloudflare.
* Kořenová doména odesílatele musí mít nastavené buď A nebo MX záznamy.
* Kořenová doména odesílatele musí mít buď A záznam(y), MX záznam(y), DMARC záznam s `p=reject` nebo `p=quarantine`, nebo SPF záznam s kvalifikátorem `-all` nebo `~all`.

Pokud jsou tato kritéria splněna, kořenová doména odesílatele bude cachována po dobu 7 dnů. Upozorňujeme, že náš automatizovaný proces běží denně – jedná se tedy o průběžný allowlist cache, který se denně aktualizuje.

Náš automatizovaný proces stáhne posledních 7 dnů UPL do paměti, rozbalí je a poté je zpracuje v paměti podle výše uvedených přísných kritérií.

Populární domény v době psaní tohoto textu, jako Google, Yahoo, Microsoft, Amazon, Meta, Twitter, Netflix, Spotify a další – jsou samozřejmě zahrnuty.
Pokud jste odesílatel, který není na našem seznamu povolených, pak při prvním odeslání e-mailu z vaší FQDN kořenové domény nebo IP adresy budete [omezeni rychlostí](#do-you-have-rate-limiting) a [zařazeni na šedý seznam](#do-you-have-a-greylist). Upozorňujeme, že se jedná o standardní postup přijatý jako e-mailový standard. Většina e-mailových serverů se pokusí o opakování odeslání, pokud obdrží chybu omezení rychlosti nebo chybu šedého seznamu (např. stavový kód chyby 421 nebo 4xx).

**Upozorňujeme, že konkrétní odesílatelé jako `a@gmail.com`, `b@xyz.edu` a `c@gov.au` mohou být stále [zařazeni na seznam blokovaných](#do-you-have-a-denylist)** (např. pokud automaticky detekujeme spam, phishing nebo malware od těchto odesílatelů).

### Jaké doménové přípony lze používat zdarma {#what-domain-name-extensions-can-be-used-for-free}

K 31. březnu 2023 jsme zavedli nové obecné pravidlo proti spamu na ochranu našich uživatelů a služby.

Toto nové pravidlo umožňuje používat na našem bezplatném plánu pouze následující doménové přípony:

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
### Máte šedý seznam {#do-you-have-a-greylist}

Ano, používáme velmi volnou politiku [šedého seznamu e-mailů](https://en.wikipedia.org/wiki/Greylisting_\(email\)). Šedý seznam se vztahuje pouze na odesílatele, kteří nejsou na našem povoleném seznamu, a v naší cache zůstává po dobu 30 dnů.

Pro každého nového odesílatele uložíme klíč v naší databázi Redis na 30 dní s hodnotou nastavenou na čas prvního příchodu jejich požadavku. Poté jejich e-mail odmítneme s kódem stavu 450 a povolíme jeho průchod až po uplynutí 5 minut.

Pokud úspěšně počkají 5 minut od tohoto počátečního času příchodu, jejich e-maily budou přijaty a neobdrží tento stavový kód 450.

Klíč se skládá buď z FQDN kořenové domény, nebo z IP adresy odesílatele. To znamená, že jakákoli subdoména, která projde šedým seznamem, projde také pro kořenovou doménu, a naopak (to je to, co myslíme „velmi volnou“ politikou).

Například pokud přijde e-mail z `test.example.com` dříve, než uvidíme e-mail z `example.com`, pak každý e-mail z `test.example.com` a/nebo `example.com` bude muset počkat 5 minut od počátečního času příchodu spojení. Nevyžadujeme, aby `test.example.com` a `example.com` čekaly každá své vlastní 5minutové období (naše politika šedého seznamu se vztahuje na úrovni kořenové domény).

Vezměte na vědomí, že šedý seznam se nevztahuje na žádného odesílatele na našem [povoleném seznamu](#do-you-have-an-allowlist) (např. Meta, Amazon, Netflix, Google, Microsoft v době psaní tohoto textu).

### Máte černý seznam {#do-you-have-a-denylist}

Ano, provozujeme vlastní černý seznam, který aktualizujeme automaticky v reálném čase a ručně na základě detekovaného spamu a škodlivé aktivity.

Také každou hodinu stahujeme všechny IP adresy z UCEPROTECT Level 1 černého seznamu na <http://wget-mirrors.uceprotect.net/rbldnsd-all/dnsbl-1.uceprotect.net.gz> a přidáváme je do našeho černého seznamu s platností 7 dní.

Odesílatelé nalezení v černém seznamu obdrží chybový kód 421 (signalizuje odesílateli, aby to zkusil později znovu), pokud [nejsou na povoleném seznamu](#do-you-have-an-allowlist).

Použitím stavového kódu 421 místo 554 lze potenciální falešné poplachy zmírnit v reálném čase a zpráva může být úspěšně doručena při dalším pokusu.

**Toto je navrženo odlišně než u jiných poštovních služeb**, kde pokud jste na bloklistu, dojde k tvrdému a trvalému selhání. Často je obtížné požádat odesílatele, aby zprávy znovu odeslali (zejména z velkých organizací), a proto tento přístup dává přibližně 5 dní od prvního pokusu odeslání e-mailu, aby odesílatel, příjemce nebo my mohli zasáhnout a problém vyřešit (například požádat o odstranění z černého seznamu).

Všechny žádosti o odstranění z černého seznamu jsou sledovány v reálném čase administrátory (např. aby opakující se falešné poplachy mohly být trvale povoleny administrátory).

Žádosti o odstranění z černého seznamu lze podat na <https://forwardemail.net/denylist>. Placení uživatelé mají své žádosti o odstranění zpracovány okamžitě, zatímco neplacení uživatelé musí čekat na zpracování administrátory.

Odesílatelé, u kterých je detekováno odesílání spamu nebo virů, budou přidáni do černého seznamu následujícím způsobem:

1. [Počáteční otisk zprávy](#how-do-you-determine-an-email-fingerprint) je zařazen do šedého seznamu při detekci spamu nebo bloklistu od „důvěryhodného“ odesílatele (např. `gmail.com`, `microsoft.com`, `apple.com`).
   * Pokud byl odesílatel na povoleném seznamu, zpráva je zařazena do šedého seznamu na 1 hodinu.
   * Pokud odesílatel není na povoleném seznamu, zpráva je zařazena do šedého seznamu na 6 hodin.
2. Parsujeme klíče černého seznamu z informací o odesílateli a zprávě, a pro každý z těchto klíčů vytvoříme (pokud již neexistuje) čítač, zvýšíme ho o 1 a uložíme do cache na 24 hodin.
   * Pro odesílatele na povoleném seznamu:
     * Přidáme klíč pro e-mailovou adresu v obálce „MAIL FROM“, pokud prošla SPF nebo neměla SPF, a nebyla [postmaster uživatelské jméno](#what-are-postmaster-addresses) nebo [no-reply uživatelské jméno](#what-are-no-reply-addresses).
     * Pokud byl hlavičkový údaj „From“ na povoleném seznamu, přidáme klíč pro e-mailovou adresu v hlavičce „From“, pokud prošla SPF nebo prošla a byla zarovnána DKIM.
     * Pokud hlavičkový údaj „From“ nebyl na povoleném seznamu, přidáme klíč pro e-mailovou adresu v hlavičce „From“ a její kořenovou analyzovanou doménu.
   * Pro odesílatele mimo povolený seznam:
     * Přidáme klíč pro e-mailovou adresu v obálce „MAIL FROM“, pokud prošla SPF.
     * Pokud byl hlavičkový údaj „From“ na povoleném seznamu, přidáme klíč pro e-mailovou adresu v hlavičce „From“, pokud prošla SPF nebo prošla a byla zarovnána DKIM.
     * Pokud hlavičkový údaj „From“ nebyl na povoleném seznamu, přidáme klíč pro e-mailovou adresu v hlavičce „From“ a její kořenovou analyzovanou doménu.
     * Přidáme klíč pro vzdálenou IP adresu odesílatele.
     * Přidáme klíč pro klientské vyřešené hostname reverzním vyhledáním z IP adresy odesílatele (pokud existuje).
     * Přidáme klíč pro kořenovou doménu klientského vyřešeného hostname (pokud existuje a liší se od klientského vyřešeného hostname).
3. Pokud čítač dosáhne hodnoty 5 pro odesílatele mimo povolený seznam a klíč, pak klíč zařadíme do černého seznamu na 30 dní a e-mail je odeslán našemu týmu pro zneužití. Tyto hodnoty se mohou měnit a aktualizace budou zde reflektovány, jak budeme sledovat zneužití.
4. Pokud čítač dosáhne hodnoty 10 pro odesílatele na povoleném seznamu a klíč, pak klíč zařadíme do černého seznamu na 7 dní a e-mail je odeslán našemu týmu pro zneužití. Tyto hodnoty se mohou měnit a aktualizace budou zde reflektovány, jak budeme sledovat zneužití.
> **POZNÁMKA:** V blízké budoucnosti zavedeme monitorování reputace. Monitorování reputace bude místo jednoduchého čítače, jak je uvedeno výše, počítat, kdy odesílatele zařadit na seznam blokovaných na základě procentuálního prahu.

### Máte omezení rychlosti {#do-you-have-rate-limiting}

Omezení rychlosti odesílatele je buď podle kořenové domény získané z reverzního PTR záznamu na IP adrese odesílatele – nebo pokud to nepřinese výsledek, pak se jednoduše použije IP adresa odesílatele. Níže se na to odkazujeme jako na `Sender`.

Naše MX servery mají denní limity pro příchozí poštu přijatou pro [šifrované IMAP úložiště](/blog/docs/best-quantum-safe-encrypted-email-service):

* Místo omezení rychlosti příchozí pošty na základě jednotlivých aliasů (např. `you@yourdomain.com`) – omezujeme rychlost podle domény aliasu samotné (např. `yourdomain.com`). To zabraňuje tomu, aby `Senders` zaplavovali schránky všech aliasů napříč vaší doménou najednou.
* Máme obecné limity, které platí pro všechny `Senders` v naší službě bez ohledu na příjemce:
  * `Senders`, které považujeme za "důvěryhodné" jako zdroj pravdy (např. `gmail.com`, `microsoft.com`, `apple.com`), jsou omezeny na odeslání 100 GB za den.
  * `Senders`, kteří jsou [na seznamu povolených](#do-you-have-an-allowlist), jsou omezeni na odeslání 10 GB za den.
  * Všichni ostatní `Senders` jsou omezeni na odeslání 1 GB a/nebo 1000 zpráv za den.
* Máme specifický limit na `Sender` a `yourdomain.com` ve výši 1 GB a/nebo 1000 zpráv denně.

MX servery také omezují zprávy přeposílané jednomu nebo více příjemcům pomocí omezení rychlosti – ale to platí pouze pro `Senders`, kteří nejsou na [seznamu povolených](#do-you-have-an-allowlist):

* Povolujeme maximálně 100 připojení za hodinu na jednoho `Sendera` podle vyřešené kořenové domény FQDN (nebo) IP adresy odesílatele (pokud není k dispozici reverzní PTR), a na příjemce v obálce. Klíč pro omezení rychlosti ukládáme jako kryptografický hash v naší databázi Redis.

* Pokud odesíláte e-maily přes náš systém, ujistěte se, že máte nastavený reverzní PTR pro všechny své IP adresy (jinak bude omezení rychlosti aplikováno na každou unikátní kořenovou doménu FQDN nebo IP adresu, ze které odesíláte).

* Všimněte si, že pokud odesíláte přes populární systém jako Amazon SES, nebudete omezeni rychlostí, protože (v době psaní tohoto textu) je Amazon SES uveden na našem seznamu povolených.

* Pokud odesíláte z domény jako `test.abc.123.example.com`, pak bude omezení rychlosti uplatněno na `example.com`. Mnoho spammerů používá stovky subdomén, aby obešli běžné spamové filtry, které omezují rychlost pouze podle unikátních hostnames, nikoli podle unikátních kořenových domén FQDN.

* `Senders`, kteří překročí limit rychlosti, budou odmítnuti s chybou 421.

Naše IMAP a SMTP servery omezují vaše aliasy na maximálně `60` současných připojení najednou.

Naše MX servery omezují [nepovolené](#do-you-have-an-allowlist) odesílatele na maximálně 10 současných připojení (s vypršením cache čítače po 3 minutách, což odpovídá našemu timeoutu socketu 3 minuty).

### Jak chráníte proti backscatteru {#how-do-you-protect-against-backscatter}

Chybně směrované odrazy nebo bounce spam (známý jako "[Backscatter](https://en.wikipedia.org/wiki/Backscatter_\(email\))") může způsobit negativní reputaci IP adres odesílatelů.

Proti backscatteru podnikáme dva kroky, které jsou podrobně popsány v následujících sekcích [Zabraňte odrazům od známých spammerů MAIL FROM](#prevent-bounces-from-known-mail-from-spammers) a [Zabraňte zbytečným odrazům k ochraně proti backscatteru](#prevent-unnecessary-bounces-to-protect-against-backscatter).

### Zabraňte odrazům od známých spammerů MAIL FROM {#prevent-bounces-from-known-mail-from-spammers}

Stahujeme seznam z [Backscatter.org](https://www.backscatterer.org/) (poháněno [UCEPROTECT](https://www.uceprotect.net/)) na <http://wget-mirrors.uceprotect.net/rbldnsd-all/ips.backscatterer.org.gz> každou hodinu a vkládáme ho do naší databáze Redis (také porovnáváme rozdíly předem; pro případ, že by byly odstraněny nějaké IP, které je třeba respektovat).
Pokud je MAIL FROM prázdný NEBO je roven (bez ohledu na velikost písmen) některé z [postmaster adres](#what-are-postmaster-addresses) (část před @ v e-mailu), pak kontrolujeme, zda IP odesílatele odpovídá některé z této seznamu.

Pokud je IP odesílatele uvedena (a není v našem [allowlistu](#do-you-have-an-allowlist)), pak pošleme chybu 554 s hlášením `The IP ${session.remoteAddress} is blocked by https://www.backscatterer.org/index.php?target=test&ip=${session.remoteAddress}`. Budeme upozorněni, pokud je odesílatel jak na seznamu Backscatterer, tak v našem allowlistu, abychom mohli případně problém vyřešit.

Techniky popsané v této sekci dodržují doporučení "SAFE MODE" na <https://www.backscatterer.org/?target=usage> – kde kontrolujeme IP odesílatele pouze pokud již byly splněny určité podmínky.

### Prevence zbytečných odrazů pro ochranu proti backscatteru {#prevent-unnecessary-bounces-to-protect-against-backscatter}

Odrazy jsou e-maily, které indikují, že přeposílání e-mailu příjemci zcela selhalo a e-mail nebude znovu odesílán.

Běžným důvodem zařazení na seznam Backscatterer jsou nesprávně směrované odrazy nebo spam odrazů, proto se musíme chránit několika způsoby:

1. Odesíláme pouze při chybách s kódem >= 500 (když e-maily, které se pokoušely přeposlat, selhaly, např. Gmail odpoví chybou na úrovni 500).

2. Odesíláme pouze jednou a pouze jednou (používáme vypočítaný klíč otisku odrazu a ukládáme jej do cache, abychom zabránili odesílání duplicit). Otisk odrazu je klíč, který je otiskem zprávy spojeným s hashem odrazové adresy a jejího chybového kódu). Viz sekce o [otiscích](#how-do-you-determine-an-email-fingerprint) pro podrobnější informace o výpočtu otisku zprávy. Úspěšně odeslané otisky odrazů vyprší po 7 dnech v naší Redis cache.

3. Odesíláme pouze pokud MAIL FROM a/nebo From není prázdný a neobsahuje (bez ohledu na velikost písmen) [postmaster uživatelské jméno](#what-are-postmaster-addresses) (část před @ v e-mailu).

4. Neodesíláme, pokud původní zpráva obsahovala některý z následujících hlaviček (bez ohledu na velikost písmen):

   * Hlavička `auto-submitted` s hodnotou odlišnou od `no`.
   * Hlavička `x-auto-response-suppress` s hodnotou `dr`, `autoreply`, `auto-reply`, `auto_reply` nebo `all`
   * Hlavička `list-id`, `list-subscribe`, `list-unsubscribe`, `list-help`, `list-post`, `list-owner`, `list-archive`, `x-autoreply`, `x-autorespond` nebo `x-auto-respond` (bez ohledu na hodnotu).
   * Hlavička `precedence` s hodnotou `bulk`, `autoreply`, `auto-reply`, `auto_reply` nebo `list`.

5. Neodesíláme, pokud e-mailová adresa MAIL FROM nebo From končí na `+donotreply`, `-donotreply`, `+noreply` nebo `-noreply`.

6. Neodesíláme, pokud uživatelská část e-mailové adresy From byla `mdaemon` a obsahovala bez ohledu na velikost písmen hlavičku `X-MDDSN-Message`.

7. Neodesíláme, pokud byla bez ohledu na velikost písmen hlavička `content-type` s hodnotou `multipart/report`.

### Jak určujete otisk e-mailu {#how-do-you-determine-an-email-fingerprint}

Otisk e-mailu se používá k určení jedinečnosti e-mailu a k zabránění doručení duplicitních zpráv a odesílání [duplicitních odrazů](#prevent-unnecessary-bounces-to-protect-against-backscatter).

Otisk se vypočítává z následujícího seznamu:

* Klientem vyřešený FQDN hostname nebo IP adresa
* Hodnota hlavičky `Message-ID` (pokud existuje)
* Hodnota hlavičky `Date` (pokud existuje)
* Hodnota hlavičky `From` (pokud existuje)
* Hodnota hlavičky `To` (pokud existuje)
* Hodnota hlavičky `Cc` (pokud existuje)
* Hodnota hlavičky `Subject` (pokud existuje)
* Hodnota těla zprávy (pokud existuje)

### Mohu přeposílat e-maily na porty jiné než 25 (např. pokud můj ISP zablokoval port 25) {#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25}

Ano, od 5. května 2020 jsme tuto funkci přidali. V současné době je funkce specifická pro doménu, nikoli pro alias. Pokud potřebujete, aby byla specifická pro alias, kontaktujte nás a sdělte nám své potřeby.

<div class="alert my-3 alert-danger">
  <i class="fa fa-stop-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Rozšířená ochrana soukromí:
  </strong>
  <span>
    Pokud jste na placeném plánu (který nabízí rozšířenou ochranu soukromí), přejděte prosím na <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Můj účet <i class="fa fa-angle-right"></i> Domény</a>, klikněte na "Nastavení" vedle vaší domény a poté klikněte na "Nastavení". Pokud se chcete dozvědět více o placených plánech, navštivte naši stránku <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Ceník</a>. Jinak můžete pokračovat podle níže uvedených pokynů.
  </span>
</div>
Pokud jste na bezplatném plánu, jednoduše přidejte nový DNS <strong class="notranslate">TXT</strong> záznam, jak je uvedeno níže, ale změňte port z 25 na port dle vašeho výběru.

Například, pokud chci, aby všechny e-maily směřující na `example.com` byly přeposílány na SMTP port alias příjemců 1337 místo 25:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Jméno/Hostitel/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Odpověď/Hodnota</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", nebo prázdné</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email-port=1337</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tip:
  </strong>
    Nejčastější scénář pro nastavení přesměrování na vlastní port je, když chcete přeposílat všechny e-maily směřující na example.com na jiný port na example.com než standardní SMTP port 25. Pro nastavení jednoduše přidejte následující <strong class="notranslate">TXT</strong> catch-all záznam.
  <span>
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Jméno/Hostitel/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Odpověď/Hodnota</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", nebo prázdné</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=example.com</code></td>
    </tr>
  </tbody>
</table>

### Podporuje to symbol plus + pro Gmail aliasy {#does-it-support-the-plus--symbol-for-gmail-aliases}

Ano, rozhodně.

### Podporuje to subdomény {#does-it-support-sub-domains}

Ano, rozhodně. Místo použití "@", ".", nebo prázdného jako jména/hostitele/aliasu jednoduše použijete název subdomény jako hodnotu.

Pokud chcete, aby `foo.example.com` přeposílal e-maily, zadejte `foo` jako hodnotu jména/hostitele/aliasu ve vašem DNS nastavení (pro oba MX i <strong class="notranslate">TXT</strong> záznamy).

### Přeposílá to hlavičky mých e-mailů {#does-this-forward-my-emails-headers}

Ano, rozhodně.

### Je to dobře otestované {#is-this-well-tested}

Ano, jsou napsány testy pomocí [ava](https://github.com/avajs/ava) a také je zde pokrytí kódu.

### Předáváte SMTP odpovědní zprávy a kódy {#do-you-pass-along-smtp-response-messages-and-codes}

Ano, rozhodně. Například pokud posíláte e-mail na `hello@example.com` a je registrován k přeposílání na `user@gmail.com`, SMTP odpověď a kód ze SMTP serveru "gmail.com" bude vrácena místo proxy serveru na "mx1.forwardemail.net" nebo "mx2.forwardemail.net".

### Jak zabraňujete spammerům a zajišťujete dobrou reputaci přeposílání e-mailů {#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation}

Podívejte se na naše sekce o [Jak funguje váš systém přeposílání e-mailů](#how-does-your-email-forwarding-system-work), [Jak řešíte problémy s doručováním e-mailů](#how-do-you-handle-email-delivery-issues) a [Jak řešíte blokování vašich IP adres](#how-do-you-handle-your-ip-addresses-becoming-blocked) výše.

### Jak provádíte DNS dotazy na doménová jména {#how-do-you-perform-dns-lookups-on-domain-names}

Vytvořili jsme open-source softwarový projekt :tangerine: [Tangerine](https://github.com/forwardemail/tangerine) a používáme ho pro DNS dotazy. Výchozí DNS servery jsou `1.1.1.1` a `1.0.0.1`, a DNS dotazy probíhají přes [DNS over HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") na aplikační vrstvě.

:tangerine: [Tangerine](https://github.com/tangerine) používá ve výchozím nastavení [CloudFlare službu DNS zaměřenou na soukromí uživatelů][cloudflare-dns].


## Účet a fakturace {#account-and-billing}

### Nabízíte záruku vrácení peněz u placených plánů {#do-you-offer-a-money-back-guarantee-on-paid-plans}

Ano! Automatické vrácení peněz probíhá při upgradu, downgradu nebo zrušení účtu do 30 dnů od začátku vašeho plánu. Toto platí pouze pro nové zákazníky.
### Pokud přepnu plán, provádíte poměrné rozúčtování a vracíte rozdíl {#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference}

Neposkytujeme poměrné rozúčtování ani nevracíme rozdíl při přepnutí plánu. Místo toho převedeme zbývající dobu od data vypršení platnosti vašeho stávajícího plánu na nejbližší odpovídající dobu pro váš nový plán (zaokrouhleno dolů na měsíc).

Vezměte na vědomí, že pokud upgradujete nebo downgradujete mezi placenými plány během 30denní lhůty od prvního zahájení placeného plánu, automaticky vám vrátíme plnou částku za váš stávající plán.

### Mohu tuto službu přeposílání e-mailů použít jako "fallback" nebo "fallover" MX server {#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server}

Ne, nedoporučuje se to, protože můžete používat pouze jeden mail exchange server najednou. Fallbacky se obvykle nikdy nepokoušejí znovu kvůli nesprávnému nastavení priority a mail servery často nerešpektují kontrolu priority MX výměny.

### Mohu zakázat konkrétní aliasy {#can-i-disable-specific-aliases}

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Důležité:
  </strong>
  <span>
    Pokud máte placený plán, musíte přejít na <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Můj účet <i class="fa fa-angle-right"></i> Domény</a> <i class="fa fa-angle-right"></i> Aliasy <i class="fa fa-angle-right"></i> Upravit alias <i class="fa fa-angle-right"></i> Zrušit zaškrtnutí políčka "Aktivní" <i class="fa fa-angle-right"></i> Pokračovat.
  </span>
</div>

Ano, jednoduše upravte svůj DNS <strong class="notranslate">TXT</strong> záznam a před alias přidejte jednu, dvě nebo tři vykřičníky (viz níže).

Všimněte si, že *máte* zachovat mapování ":" protože je to vyžadováno, pokud se někdy rozhodnete tuto funkci vypnout (a také se používá při importu, pokud upgradujete na jeden z našich placených plánů).

**Pro tiché odmítnutí (odesílateli se zobrazí, jako by zpráva byla úspěšně odeslána, ale ve skutečnosti nikam neputuje) (stavový kód `250`):** Pokud před alias přidáte "!" (jediný vykřičník), vrátí se odesílatelům, kteří se pokusí odeslat na tuto adresu, úspěšný stavový kód `250`, ale samotné e-maily nikam nepůjdou (např. černá díra nebo `/dev/null`).

**Pro měkké odmítnutí (stavový kód `421`):** Pokud před alias přidáte "!!" (dvojitý vykřičník), vrátí se odesílatelům, kteří se pokusí odeslat na tuto adresu, měkká chybová odpověď s kódem `421` a e-maily budou často opakovaně zkoušeny až po dobu 5 dnů před odmítnutím a vrácením.

**Pro tvrdé odmítnutí (stavový kód `550`):** Pokud před alias přidáte "!!!" (trojitý vykřičník), vrátí se odesílatelům, kteří se pokusí odeslat na tuto adresu, trvalá chybová odpověď s kódem `550` a e-maily budou odmítnuty a vráceny.

Například pokud chci, aby všechny e-maily směřující na `alias@example.com` přestaly procházet na `user@gmail.com` a byly odmítnuty a vráceny (např. použít tři vykřičníky):

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Název/Hostitel/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Odpověď/Hodnota</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", nebo prázdné</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=!!!alias:user@gmail.com</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tip:
  </strong>
  <span>
    Můžete také přepsat adresu přeposílaného příjemce jednoduše na "nobody@forwardemail.net", což ji nasměruje na nikoho, jak je uvedeno v příkladu níže.
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Název/Hostitel/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Odpověď/Hodnota</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", nebo prázdné</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=!!!alias:nobody@forwardemail.net</code></td>
    </tr>
  </tbody>
</table>
<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tip:
  </strong>
  <span>
    Pokud chcete zvýšenou bezpečnost, můžete také odstranit část ":user@gmail.com" (nebo ":nobody@forwardemail.net"), takže zůstane pouze "!!!alias", jak je uvedeno v příkladu níže.
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Answer/Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", nebo prázdné</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=!!!alias</code></td>
    </tr>
  </tbody>
</table>

### Mohu přeposílat e-maily na více příjemců {#can-i-forward-emails-to-multiple-recipients}

Ano, rozhodně. Stačí uvést více příjemců ve vašich <strong class="notranslate">TXT</strong> záznamech.

Například, pokud chci, aby e-mail, který přijde na `hello@example.com`, byl přeposlán na `user+a@gmail.com` a `user+b@gmail.com`, pak by můj <strong class="notranslate">TXT</strong> záznam vypadal takto:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Answer/Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", nebo prázdné</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code class="cursor-initial" data-original-title="" title="">forward-email=hello:user+a@gmail.com,hello:user+b@gmail.com</code></td>
    </tr>
  </tbody>
</table>

Nebo je můžete uvést ve dvou samostatných řádcích, například takto:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Answer/Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", nebo prázdné</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=hello:user+a@gmail.com</code></td>
    </tr>
    <tr>
      <td><em>"@", ".", nebo prázdné</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=hello:user+b@gmail.com</code></td>
    </tr>
  </tbody>
</table>

Je to na vás!

### Mohu mít více globálních příjemců pro zachytávání všech e-mailů {#can-i-have-multiple-global-catch-all-recipients}

Ano, můžete. Stačí uvést více globálních příjemců pro zachytávání všech e-mailů ve vašich <strong class="notranslate">TXT</strong> záznamech.

Například, pokud chci, aby každý e-mail, který přijde na `*@example.com` (hvězdička znamená zástupný znak, tedy zachytávání všech), byl přeposlán na `user+a@gmail.com` a `user+b@gmail.com`, pak by můj <strong class="notranslate">TXT</strong> záznam vypadal takto:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Answer/Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", nebo prázdné</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=user+a@gmail.com,user+b@gmail.com</code></td>
    </tr>
  </tbody>
</table>

Nebo je můžete uvést ve dvou samostatných řádcích, například takto:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Answer/Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", nebo prázdné</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=user+a@gmail.com</code></td>
    </tr>
    <tr>
      <td><em>@, ".", nebo prázdné</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=user+b@gmail.com</code></td>
    </tr>
  </tbody>
</table>
Je to na vás!

### Existuje maximální limit počtu e-mailových adres, na které mohu přeposílat na jeden alias {#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias}

Ano, výchozí limit je 10. To NEZNAMENÁ, že můžete mít na své doméně pouze 10 aliasů. Můžete mít tolik aliasů, kolik chcete (neomezené množství). Znamená to, že můžete přeposílat jeden alias maximálně na 10 unikátních e-mailových adres. Můžete mít například `hello:user+1@gmail.com`, `hello:user+2@gmail.com`, `hello:user+3@gmail.com`, … (od 1 do 10) – a všechny e-maily na `hello@example.com` budou přeposílány na `user+1@gmail.com`, `user+2@gmail.com`, `user+3@gmail.com`, … (od 1 do 10).

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tip:
  </strong>
  <span>
    Potřebujete více než 10 příjemců na jeden alias? Pošlete nám e-mail a rádi vám zvýšíme limit vašeho účtu.
  </span>
</div>

### Mohu e-maily přeposílat rekurzivně {#can-i-recursively-forward-emails}

Ano, můžete, ale stále musíte dodržovat maximální limit. Pokud máte `hello:linus@example.com` a `linus:user@gmail.com`, pak e-maily na `hello@example.com` budou přeposílány na `linus@example.com` a `user@gmail.com`. Upozorňujeme, že pokud se pokusíte rekurzivně přeposílat e-maily nad maximální limit, bude vyhozena chyba.

### Mohou lidé odregistrovat nebo zaregistrovat mé přeposílání e-mailů bez mého svolení {#can-people-unregister-or-register-my-email-forwarding-without-my-permission}

Používáme ověřování pomocí MX a <strong class="notranslate">TXT</strong> záznamů, takže pokud přidáte příslušné MX a <strong class="notranslate">TXT</strong> záznamy této služby, jste zaregistrováni. Pokud je odstraníte, jste odregistrováni. Vlastníte svou doménu a správu DNS, takže pokud má někdo přístup k tomu, je to problém.

### Jak je to zdarma {#how-is-it-free}

Forward Email nabízí bezplatnou úroveň díky kombinaci open-source vývoje, efektivní infrastruktury a volitelných placených plánů, které službu podporují.

Naše bezplatná úroveň je podporována:

1. **Open Source vývojem**: Náš kód je open source, což umožňuje příspěvky komunity a transparentní provoz.

2. **Efektivní infrastrukturou**: Optimalizovali jsme naše systémy pro přeposílání e-mailů s minimálními zdroji.

3. **Placenými prémiovými plány**: Uživatelé, kteří potřebují další funkce jako SMTP odesílání, IMAP příjem nebo rozšířené možnosti soukromí, si předplácejí naše placené plány.

4. **Rozumnými limity používání**: Bezplatná úroveň má férové zásady používání, aby se zabránilo zneužití.

> \[!NOTE]
> Zavazujeme se udržovat základní přeposílání e-mailů zdarma a zároveň nabízet prémiové funkce pro uživatele s pokročilejšími potřebami.

> \[!TIP]
> Pokud považujete naši službu za užitečnou, zvažte upgrade na placený plán, abyste podpořili další vývoj a údržbu.

### Jaký je maximální limit velikosti e-mailu {#what-is-the-max-email-size-limit}

Výchozí limit velikosti je 50 MB, což zahrnuje obsah, hlavičky a přílohy. Upozorňujeme, že služby jako Gmail a Outlook umožňují pouze limit 25 MB, a pokud tento limit při odesílání na adresy u těchto poskytovatelů překročíte, obdržíte chybovou zprávu.

Pokud je překročen limit velikosti souboru, je vrácena chyba s odpovídajícím kódem odpovědi.

### Uchováváte záznamy o e-mailech {#do-you-store-logs-of-emails}

Ne, nezapisujeme na disk ani neukládáme záznamy – s [výjimkou chyb](#do-you-store-error-logs) a [odchozího SMTP](#do-you-support-sending-email-with-smtp) (viz naše [Zásady ochrany osobních údajů](/privacy)).

Vše probíhá v paměti a [náš zdrojový kód je na GitHubu](https://github.com/forwardemail).

### Uchováváte záznamy o chybách {#do-you-store-error-logs}

**Ano. K chybovým záznamům máte přístup v [Můj účet → Záznamy](/my-account/logs) nebo [Můj účet → Domény](/my-account/domains).**

Od února 2023 uchováváme záznamy chyb pro SMTP odpovědi s kódy `4xx` a `5xx` po dobu 7 dnů – které obsahují SMTP chybu, obálku a hlavičky e-mailu (neukládáme tělo e-mailu ani přílohy).
Chybové záznamy vám umožňují zkontrolovat chybějící důležité e-maily a zmírnit falešně pozitivní označení spamu pro [vaše domény](/my-account/domains). Jsou také skvělým zdrojem pro ladění problémů s [email webhooks](#do-you-support-webhooks) (protože chybové záznamy obsahují odpověď webhook endpointu).

Chybové záznamy pro [omezení rychlosti](#do-you-have-rate-limiting) a [greylisting](#do-you-have-a-greylist) nejsou přístupné, protože spojení končí dříve (např. před přenosem příkazů `RCPT TO` a `MAIL FROM`).

Pro více informací si přečtěte naši [Zásady ochrany osobních údajů](/privacy).

### Čtete mé e-maily {#do-you-read-my-emails}

Ne, rozhodně ne. Viz naše [Zásady ochrany osobních údajů](/privacy).

Mnoho jiných služeb pro přeposílání e-mailů ukládá a potenciálně by mohlo číst vaše e-maily. Neexistuje žádný důvod, proč by přeposílané e-maily měly být ukládány na disk – a proto jsme navrhli první open-source řešení, které vše provádí v paměti.

Věříme, že byste měli mít právo na soukromí a toto právo přísně respektujeme. Kód, který je nasazen na server, je [open-source software na GitHubu](https://github.com/forwardemail) pro transparentnost a budování důvěry.

### Mohu s tímto „odesílat poštu jako“ v Gmailu {#can-i-send-mail-as-in-gmail-with-this}

Ano! Od 2. října 2018 jsme tuto funkci přidali. Viz [Jak odesílat poštu jako pomocí Gmailu](#how-to-send-mail-as-using-gmail) výše!

Také byste měli nastavit SPF záznam pro Gmail ve vaší DNS konfiguraci v <strong class="notranslate">TXT</strong> záznamu.

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Důležité:
  </strong>
  <span>
    Pokud používáte Gmail (např. Send Mail As) nebo G Suite, musíte do svého SPF <strong class="notranslate">TXT</strong> záznamu přidat <code>include:_spf.google.com</code>, například:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
  </span>
</div>

### Mohu s tímto „odesílat poštu jako“ v Outlooku {#can-i-send-mail-as-in-outlook-with-this}

Ano! Od 2. října 2018 jsme tuto funkci přidali. Jednoduše si prohlédněte tyto dva odkazy od Microsoftu níže:

* <https://support.office.com/en-us/article/add-or-remove-an-email-alias-in-outlook-com-459b1989-356d-40fa-a689-8f285b13f1f2>
* <https://support.office.com/en-us/article/send-email-from-a-different-address-in-outlook-com-ccba89cb-141c-4a36-8c56-6d16a8556d2e>

Také byste měli nastavit SPF záznam pro Outlook ve vaší DNS konfiguraci v <strong class="notranslate">TXT</strong> záznamu.

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Důležité:
  </strong>
  <span>
    Pokud používáte Microsoft Outlook nebo Live.com, musíte do svého SPF <strong class="notranslate">TXT</strong> záznamu přidat <code>include:spf.protection.outlook.com</code>, například:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:spf.protection.outlook.com -all</code>
  </span>
</div>

### Mohu s tímto „odesílat poštu jako“ v Apple Mail a iCloud Mail {#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this}

Pokud jste předplatitelem iCloud+, můžete použít vlastní doménu. [Naše služba je také kompatibilní s Apple Mail](#apple-mail).

Pro více informací navštivte <https://support.apple.com/en-us/102540>.

### Mohu s tímto přeposílat neomezené množství e-mailů {#can-i-forward-unlimited-emails-with-this}

Ano, nicméně „relativně neznámí“ odesílatelé jsou omezeni na 100 připojení za hodinu na hostname nebo IP. Viz sekce o [omezení rychlosti](#do-you-have-rate-limiting) a [greylistingu](#do-you-have-a-greylist) výše.

„Relativně neznámí“ znamená odesílatele, kteří se neobjevují v [povolovacím seznamu](#do-you-have-an-allowlist).

Pokud je tento limit překročen, odesíláme kód odpovědi 421, který říká odesílajícímu mail serveru, aby to zkusil později znovu.

### Nabízíte neomezený počet domén za jednu cenu {#do-you-offer-unlimited-domains-for-one-price}

Ano. Bez ohledu na to, jaký plán máte, zaplatíte pouze jednu měsíční sazbu – která pokrývá všechny vaše domény.
### Jaké způsoby platby akceptujete {#which-payment-methods-do-you-accept}

Forward Email přijímá následující jednorázové nebo měsíční/čtvrtletní/roční způsoby platby:

1. **Kreditní/debetní karty/bankovní převody**: Visa, Mastercard, American Express, Discover, JCB, Diners Club atd.
2. **PayPal**: Připojte svůj účet PayPal pro snadné platby
3. **Kryptoměny**: Přijímáme platby prostřednictvím Stripe stablecoin plateb na sítích Ethereum, Polygon a Solana

> \[!NOTE]
> Na našich serverech uchováváme omezené platební informace, které zahrnují pouze identifikátory plateb a odkazy na [Stripe](https://stripe.com/global) a [PayPal](https://www.paypal.com) transakce, zákazníky, předplatné a ID plateb.

> \[!TIP]
> Pro maximální soukromí zvažte použití plateb kryptoměnami.

Všechny platby jsou bezpečně zpracovávány prostřednictvím Stripe nebo PayPal. Vaše platební údaje nikdy nejsou uloženy na našich serverech.


## Další zdroje {#additional-resources}

> \[!TIP]
> Naše níže uvedené články jsou pravidelně aktualizovány o nové návody, tipy a technické informace. Často se sem vraťte pro nejnovější obsah.

* [Případové studie a dokumentace pro vývojáře](/blog/docs)
* [Zdroje](/resources)
* [Návody](/guides)

[gmail-2fa]: https://myaccount.google.com/signinoptions/two-step-verification

[cloudflare-dns]: https://blog.cloudflare.com/announcing-1111/
