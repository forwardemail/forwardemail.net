# Často kladené otázky {#frequently-asked-questions}

<img loading="lazy" src="/img/articles/faq.webp" alt="" class="rounded-lg" />

__CHRÁNĚNÁ_URL_447__ Obsah {__CHRÁNĚNÁ_URL_448__

* [Rychlý start](#quick-start)
* [Zavedení](#introduction)
  * [Co je přeposílání e-mailů](#what-is-forward-email)
  * [Kdo používá přeposílaní e-mailů](#who-uses-forward-email)
  * [Jaká je historie přeposílání e-mailů](#what-is-forward-emails-history)
  * [Jak rychlá je tato služba](#how-fast-is-this-service)
* [E-mailoví klienti](#email-clients)
  * [Thunderbird](#thunderbird)
  * [Microsoft Outlook](#microsoft-outlook)
  * [Apple Mail](#apple-mail)
  * [Mobilní zařízení](#mobile-devices)
  * [Jak odesílat poštu jako pomocí Gmailu](#how-to-send-mail-as-using-gmail)
  * [Jaký je starší bezplatný průvodce pro odesílání pošty jako pomocí Gmailu](#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail)
  * [Pokročilá konfigurace směrování Gmailu](#advanced-gmail-routing-configuration)
  * [Pokročilá konfigurace směrování v Outlooku](#advanced-outlook-routing-configuration)
* [Odstraňování problémů](#troubleshooting)
  * [Proč nedostávám své testovací e-maily](#why-am-i-not-receiving-my-test-emails)
  * [Jak nakonfiguruji svého e-mailového klienta pro práci s přeposíláním e-mailů](#how-do-i-configure-my-email-client-to-work-with-forward-email)
  * [Proč mé e-maily přistávají ve spamu a nevyžádané poště a jak mohu zkontrolovat reputaci své domény](#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation)
  * [Co mám dělat, když dostanu spamové e-maily](#what-should-i-do-if-i-receive-spam-emails)
  * [Proč se mé testovací e-maily odeslané mně v Gmailu zobrazují jako „podezřelé“](#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious)
  * [Mohu odstranit via forwardemail dot net v Gmailu](#can-i-remove-the-via-forwardemail-dot-net-in-gmail)
* [Správa dat](#data-management)
  * [Kde se nacházejí vaše servery](#where-are-your-servers-located)
  * [Jak exportuji a zálohuji svou poštovní schránku](#how-do-i-export-and-backup-my-mailbox)
  * [Jak importuji a migruji svou stávající poštovní schránku](#how-do-i-import-and-migrate-my-existing-mailbox)
  * [Podporujete self-hosting](#do-you-support-self-hosting)
* [Konfigurace e-mailu](#email-configuration)
  * [Jak mohu začít a jak nastavit přeposílání e-mailů](#how-do-i-get-started-and-set-up-email-forwarding)
  * [Mohu použít více MX burz a serverů pro pokročilé předávání](#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding)
  * [Jak nastavím automatickou odpověď v nepřítomnosti (automatická odpověď mimo kancelář)](#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder)
  * [Jak nastavím SPF pro přeposílání e-mailů](#how-do-i-set-up-spf-for-forward-email)
  * [Jak nastavím DKIM pro přeposílání e-mailů](#how-do-i-set-up-dkim-for-forward-email)
  * [Jak nastavím DMARC pro přeposílání e-mailů](#how-do-i-set-up-dmarc-for-forward-email)
  * [Jak se připojím a nakonfiguruji své kontakty](#how-do-i-connect-and-configure-my-contacts)
  * [Jak se připojím a nakonfiguruji své kalendáře](#how-do-i-connect-and-configure-my-calendars)
  * [Jak mohu přidat další kalendáře a spravovat stávající kalendáře](#how-do-i-add-more-calendars-and-manage-existing-calendars)
  * [Jak nastavím SRS pro přeposílání e-mailů](#how-do-i-set-up-srs-for-forward-email)
  * [Jak nastavím MTA-STS pro přeposílání e-mailů](#how-do-i-set-up-mta-sts-for-forward-email)
  * [Jak přidám profilový obrázek ke své e-mailové adrese](#how-do-i-add-a-profile-picture-to-my-email-address)
* [Pokročilé funkce](#advanced-features)
  * [Podporujete rozesílání newsletterů nebo e-mailových adres pro marketingové e-maily?](#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email)
  * [Podporujete odesílání e-mailů pomocí API](#do-you-support-sending-email-with-api)
  * [Podporujete přijímání e-mailů pomocí protokolu IMAP](#do-you-support-receiving-email-with-imap)
  * [Podporujete POP3](#do-you-support-pop3)
  * [Podporujete kalendáře (CalDAV)](#do-you-support-calendars-caldav)
  * [Podporujete kontakty (CardDAV)?](#do-you-support-contacts-carddav)
  * [Podporujete odesílání e-mailů pomocí SMTP](#do-you-support-sending-email-with-smtp)
  * [Podporujete OpenPGP/MIME, end-to-end šifrování ("E2EE") a Web Key Directory ("WKD")](#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd)
  * [Podporujete MTA-STS](#do-you-support-mta-sts)
  * [Podporujete přístupové klíče a WebAuthn](#do-you-support-passkeys-and-webauthn)
  * [Podporujete doporučené postupy pro e-mail?](#do-you-support-email-best-practices)
  * [Podporujete bounce webhooky](#do-you-support-bounce-webhooks)
  * [Podporujete webhooky](#do-you-support-webhooks)
  * [Podporujete regulární výrazy nebo regulární výrazy](#do-you-support-regular-expressions-or-regex)
  * [Jaké jsou vaše odchozí limity SMTP](#what-are-your-outbound-smtp-limits)
  * [Potřebuji schválení k povolení SMTP?](#do-i-need-approval-to-enable-smtp)
  * [Jaká jsou nastavení konfigurace serveru SMTP](#what-are-your-smtp-server-configuration-settings)
  * [Jaká jsou nastavení konfigurace serveru IMAP](#what-are-your-imap-server-configuration-settings)
  * [Jaká jsou nastavení konfigurace serveru POP3](#what-are-your-pop3-server-configuration-settings)
  * [Konfigurace relé Postfixu SMTP](#postfix-smtp-relay-configuration)
* [Zabezpečení](#security)
  * [Pokročilé techniky zabezpečení serverů](#advanced-server-hardening-techniques)
  * [Máte certifikaci SOC 2 nebo ISO 27001?](#do-you-have-soc-2-or-iso-27001-certifications)
  * [Používáte šifrování TLS pro přeposílání e-mailů?](#do-you-use-tls-encryption-for-email-forwarding)
  * [Uchováváte hlavičky pro ověřování e-mailů?](#do-you-preserve-email-authentication-headers)
  * [Zachováváte původní záhlaví e-mailů a zabraňujete jejich falšování?](#do-you-preserve-original-email-headers-and-prevent-spoofing)
  * [Jak se chráníte před spamem a zneužitím](#how-do-you-protect-against-spam-and-abuse)
  * [Ukládáte obsah e-mailů na disk?](#do-you-store-email-content-on-disk)
  * [Může být obsah e-mailu odhalen během havárie systému?](#can-email-content-be-exposed-during-system-crashes)
  * [Kdo má přístup k vaší e-mailové infrastruktuře](#who-has-access-to-your-email-infrastructure)
  * [Jaké poskytovatele infrastruktury využíváte](#what-infrastructure-providers-do-you-use)
  * [Nabízíte smlouvu o zpracování osobních údajů (DPA)?](#do-you-offer-a-data-processing-agreement-dpa)
  * [Jak nakládáte s oznámeními o narušení dat](#how-do-you-handle-data-breach-notifications)
  * [Nabízíte testovací prostředí?](#do-you-offer-a-test-environment)
  * [Poskytujete nástroje pro monitorování a upozorňování?](#do-you-provide-monitoring-and-alerting-tools)
  * [Jak zajišťujete vysokou dostupnost](#how-do-you-ensure-high-availability)
  * [Dodržujete ustanovení § 889 zákona o zmocnění k národní obraně (NDAA)?](#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa)
* [Systémové a technické detaily](#system-and-technical-details)
  * [Ukládáte e-maily a jejich obsah](#do-you-store-emails-and-their-contents)
  * [Jak funguje váš systém pro přeposílání e-mailů](#how-does-your-email-forwarding-system-work)
  * [Jak zpracováváte e-mail pro přeposílání](#how-do-you-process-an-email-for-forwarding)
  * [Jak řešíte problémy s doručováním e-mailů](#how-do-you-handle-email-delivery-issues)
  * [Jak řešíte zablokování vašich IP adres](#how-do-you-handle-your-ip-addresses-becoming-blocked)
  * [Co jsou to poštovní adresy](#what-are-postmaster-addresses)
  * [Co jsou adresy bez odpovědi](#what-are-no-reply-addresses)
  * [Jaké jsou IP adresy vašeho serveru](#what-are-your-servers-ip-addresses)
  * [Máte povolený seznam](#do-you-have-an-allowlist)
  * [Jaké přípony doménových jmen jsou ve výchozím nastavení povoleny](#what-domain-name-extensions-are-allowlisted-by-default)
  * [Jaká jsou kritéria vašeho seznamu povolených](#what-is-your-allowlist-criteria)
  * [Jaké přípony doménových jmen lze používat zdarma](#what-domain-name-extensions-can-be-used-for-free)
  * [Máte greylist?](#do-you-have-a-greylist)
  * [Máte popírače?](#do-you-have-a-denylist)
  * [Máte omezení sazeb](#do-you-have-rate-limiting)
  * [Jak se chráníte před zpětným rozptylem](#how-do-you-protect-against-backscatter)
  * [Zabraňte vracení zpráv od známých POŠTA OD spammerů](#prevent-bounces-from-known-mail-from-spammers)
  * [Zabraňte zbytečným odskokům, abyste se chránili před zpětným rozptylem](#prevent-unnecessary-bounces-to-protect-against-backscatter)
  * [Jak určíte otisk e-mailu](#how-do-you-determine-an-email-fingerprint)
  * [Mohu přeposílat e-maily na jiné porty než 25 (např. když můj ISP zablokoval port 25)](#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25)
  * [Podporuje symbol plus + pro aliasy Gmailu](#does-it-support-the-plus--symbol-for-gmail-aliases)
  * [Podporuje subdomény](#does-it-support-sub-domains)
  * [Přeposílá to záhlaví mého e-mailu](#does-this-forward-my-emails-headers)
  * [Je to dobře vyzkoušeno](#is-this-well-tested)
  * [Předáváte spolu zprávy a kódy odpovědí SMTP](#do-you-pass-along-smtp-response-messages-and-codes)
  * [Jak zabráníte spammerům a zajistíte dobrou pověst přeposílání e-mailů](#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation)
  * [Jak provádíte vyhledávání DNS u doménových jmen](#how-do-you-perform-dns-lookups-on-domain-names)
* [Účet a fakturace](#account-and-billing)
  * [Nabízíte u placených plánů záruku vrácení peněz?](#do-you-offer-a-money-back-guarantee-on-paid-plans)
  * [Pokud změním plány, poměrné poměry a vrácení rozdílu](#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference)
  * [Mohu použít tuto službu pro přeposílání e-mailů jako "záložní" nebo "fallover" MX server](#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server)
  * [Mohu zakázat konkrétní aliasy](#can-i-disable-specific-aliases)
  * [Mohu přeposílat e-maily více příjemcům](#can-i-forward-emails-to-multiple-recipients)
  * [Mohu mít více globálních univerzálních příjemců](#can-i-have-multiple-global-catch-all-recipients)
  * [Existuje maximální limit počtu e-mailových adres, na které mohu přeposílat na alias?](#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias)
  * [Mohu rekurzivně přeposílat e-maily](#can-i-recursively-forward-emails)
  * [Mohou se lidé zrušit nebo zaregistrovat přeposílání mých e-mailů bez mého svolení](#can-people-unregister-or-register-my-email-forwarding-without-my-permission)
  * [Jak je to zdarma](#how-is-it-free)
  * [Jaký je maximální limit velikosti e-mailu](#what-is-the-max-email-size-limit)
  * [Ukládáte protokoly e-mailů](#do-you-store-logs-of-emails)
  * [Ukládáte protokoly chyb](#do-you-store-error-logs)
  * [Čteš moje emaily](#do-you-read-my-emails)
  * [Mohu s tímto "posílat poštu jako" v Gmailu](#can-i-send-mail-as-in-gmail-with-this)
  * [Mohu s tímto "posílat poštu jako" v aplikaci Outlook](#can-i-send-mail-as-in-outlook-with-this)
  * [Mohu s tímto "posílat poštu jako" v Apple Mail a iCloud Mail](#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this)
  * [Mohu s tímto přeposílat neomezené množství e-mailů](#can-i-forward-unlimited-emails-with-this)
  * [Nabízíte neomezené domény za jednu cenu](#do-you-offer-unlimited-domains-for-one-price)
  * [Jaké platební metody přijímáte](#which-payment-methods-do-you-accept)
* [Další zdroje](#additional-resources)

## Rychlý start {#quick-start}

Chcete-li začít s přeposíláním e-mailů:

1. **Vytvořte si účet** na adrese [forwardemail.net/register](https://forwardemail.net/register)

2. **Přidejte a ověřte svou doménu** pod [Můj účet → Domény](/my-account/domains)

3. **Přidejte a nakonfigurujte e-mailové aliasy/poštovní schránky** v sekci [Můj účet → Domény](/my-account/domains) → Aliasy

4. **Otestujte si nastavení** odesláním e-mailu na jednu z vašich nových aliasů

> \[!TIP]
> DNS changes can take up to 24-48 hours to propagate globally, though they often take effect much sooner.

> \[!IMPORTANT]
> For enhanced deliverability, we recommend setting up [SPF](#how-do-i-set-up-spf-for-forward-email), [DKIM](#how-do-i-set-up-dkim-for-forward-email), and [DMARC](#how-do-i-set-up-dmarc-for-forward-email) records.

__CHRÁNĚNÁ_URL_451__ Úvod {__CHRÁNĚNÁ_URL_452__

### Co je přeposílaný e-mail {#what-is-forward-email}

> \[!NOTE]
> Forward Email is perfect for individuals, small businesses, and developers who want professional email addresses without the cost and maintenance of a full email hosting solution.

Forward Email je **plnohodnotný poskytovatel e-mailových služeb** a **poskytovatel hostingu e-mailů pro vlastní doménová jména**.

Je to jediná bezplatná služba s otevřeným zdrojovým kódem, která vám umožňuje používat e-mailové adresy s vlastní doménou bez složitého nastavování a údržby vlastního e-mailového serveru.

Naše služba přeposílá e-maily odeslané na vaši vlastní doménu na váš stávající e-mailový účet – a můžete nás dokonce využít jako svého specializovaného poskytovatele hostingu e-mailů.

Klíčové vlastnosti přeposílaného e-mailu:

* **Vlastní e-mail s doménou**: Používejte profesionální e-mailové adresy s vaším vlastním názvem domény
* **Bezplatná úroveň**: Základní přeposílání e-mailů zdarma
* **Vylepšené soukromí**: Nečteme vaše e-maily ani neprodáváme vaše data
* **Open Source**: Celá naše kódová základna je k dispozici na GitHubu
* **Podpora SMTP, IMAP a POP3**: Plné možnosti odesílání a přijímání e-mailů
* **End-to-End šifrování**: Podpora OpenPGP/MIME
* **Vlastní aliasy Catch-All**: Vytvořte neomezený počet e-mailových aliasů

Můžete nás porovnat s více než 56 dalšími poskytovateli e-mailových služeb na [naše stránka porovnání e-mailů](/blog/best-email-service).

> \[!TIP]
> Learn more about Forward Email by reading our free [Technical Whitepaper](/technical-whitepaper.pdf)

### Kdo používá funkci Přeposílání e-mailů {#who-uses-forward-email}

Poskytujeme e-mailový hosting a službu přeposílání e-mailů více než 500 000 doménám a těmto významným uživatelům:

| Zákazník | Případová studie |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Americká námořní akademie | [:page_facing_up: Case Study](/blog/docs/federal-government-email-service-section-889-compliant) |
| Kanonický | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| Netflixové hry |  |
| Linux Foundation | [:page_facing_up: Case Study](/blog/docs/linux-foundation-email-enterprise-case-study) |
| Nadace PHP |  |
| Rádio Fox News |  |
| Prodej reklam Disney |  |
| jQuery | [:page_facing_up: Case Study](/blog/docs/linux-foundation-email-enterprise-case-study) |
| LineageOS |  |
| Ubuntu | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| V lidskosti | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| Lubuntu | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| University of Cambridge | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| University of Maryland | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| Washingtonská univerzita | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| Tuftsova univerzita | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| Swarthmore College | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| Vláda Jižní Austrálie |  |
| Vláda Dominikánské republiky |  |
| Fly<span>.</span>io |  |
| RCD hotely |  |
| Isaac Z. Schlueter (npm) | [:page_facing_up: Case Study](/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem) |
| David Heinemeier Hansson (Ruby on Rails) |  |

### Co je historie přeposílaných e-mailů {#what-is-forward-emails-history}

Více informací o přeposílání e-mailů naleznete na adrese [naše stránka O nás](/about).

### Jak rychlá je tato služba {#how-fast-is-this-service}

> \[!NOTE]
> Our system is designed for speed and reliability, with multiple redundant servers to ensure your emails are delivered promptly.

Funkce Forward Email doručuje zprávy s minimálním zpožděním, obvykle během několika sekund od přijetí.

Výkonnostní metriky:

* **Průměrná doba doručení**: Méně než 5–10 sekund od přijetí po přeposlání ([podívejte se na naši stránku pro sledování doby doručení „TTI“](/tti))
* **Provozní doba**: Dostupnost služby 99,9 %+
* **Globální infrastruktura**: Servery strategicky umístěné pro optimální směrování
* **Automatické škálování**: Náš systém se škáluje během e-mailové špičky

Pracujeme v reálném čase, na rozdíl od jiných poskytovatelů, kteří se spoléhají na zpožděné fronty.

Nezapisujeme na disk ani neukládáme protokoly – pomocí [výjimkou chyb](#do-you-store-error-logs) a [odchozí SMTP](#do-you-support-sending-email-with-smtp) (viz naše [Zásady ochrany osobních údajů](/privacy)).

Vše se děje v paměti a [náš zdrojový kód je na GitHubu](https://github.com/forwardemail).

## E-mailoví klienti {#email-clients}

__CHRÁNĚNÁ_URL_463__ Thunderbird {__CHRÁNĚNÁ_URL_464__

1. Vytvořte nový alias a vygenerujte heslo v panelu pro přesměrování e-mailů.
2. Otevřete Thunderbird a přejděte do sekce **Upravit → Nastavení účtu → Akce účtu → Přidat poštovní účet**.
3. Zadejte své jméno, adresu pro přesměrování e-mailů a heslo.
4. Klikněte na **Konfigurovat ručně** a zadejte:
* Příchozí: IMAP, `imap.forwardemail.net`, port 993, SSL/TLS
* Odchozí: SMTP, `smtp.forwardemail.net`, port 587, STARTTLS
5. Klikněte na **Hotovo**.

__CHRÁNĚNÁ_URL_465__ Microsoft Outlook {__CHRÁNĚNÁ_URL_466__

1. Vytvořte nový alias a vygenerujte heslo v panelu pro přesměrování e-mailů.
2. Přejděte do nabídky **Soubor → Přidat účet**.
3. Zadejte svou adresu pro přesměrování e-mailů a klikněte na **Připojit**.
4. Vyberte **Rozšířené možnosti** a vyberte **Ruční nastavení účtu**.
5. Vyberte **IMAP** a zadejte:
* Příchozí: `imap.forwardemail.net`, port 993, SSL
* Odchozí: `smtp.forwardemail.net`, port 587, TLS
* Uživatelské jméno: Vaše celá e-mailová adresa.
* Heslo: Vaše vygenerované heslo.
6. Klikněte na **Připojit**.

__CHRÁNĚNÁ_URL_467__ Apple Mail {__CHRÁNĚNÁ_URL_468__

1. Vytvořte nový alias a vygenerujte heslo v panelu Přeposílání e-mailů.
2. Přejděte do **Pošta → Předvolby → Účty → +**.
3. Vyberte **Jiný poštovní účet**.
4. Zadejte své jméno, adresu přeposílání e-mailů a heslo.
5. Pro nastavení serveru zadejte:
* Příchozí: `imap.forwardemail.net`
* Odchozí: `smtp.forwardemail.net`
* Uživatelské jméno: Vaše celá e-mailová adresa.
* Heslo: Vaše vygenerované heslo.
6. Klikněte na **Přihlásit se**.

__CHRÁNĚNÁ_URL_469__ Mobilní zařízení {__CHRÁNĚNÁ_URL_470__

Pro iOS:

1. Přejděte do **Nastavení → Pošta → Účty → Přidat účet → Jiné**
2. Klepněte na **Přidat poštovní účet** a zadejte své údaje
3. Pro nastavení serveru použijte stejná nastavení IMAP a SMTP jako výše

Pro Android:

1. Přejděte do **Nastavení → Účty → Přidat účet → Osobní (IMAP)**
2. Zadejte svou adresu a heslo pro přesměrování e-mailu
3. Pro nastavení serveru použijte stejná nastavení IMAP a SMTP jako výše

### Jak odesílat e-maily pomocí Gmailu {#how-to-send-mail-as-using-gmail}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Odhadovaná doba nastavení:</strong>
<span>Méně než 10 minut</span>
</div>

<div class="alert mb-3 alert-success">
<i class="fa fa-bullhorn font-weight-bold"></i>
<strong class="font-weight-bold">
Začínáme:
</strong>
<span>
Pokud jste postupovali podle výše uvedených pokynů v části <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">Jak začít a nastavit přeposílání e-mailů</a>, můžete pokračovat ve čtení níže.
</span>
</div>

<div id="odeslat-e-mail-jako-obsah">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Důležité:
</strong>
<span>
Ujistěte se, že jste si přečetli naše <a href="/terms" class="alert-link" target="_blank">Podmínky</a>, <a href="/privacy" class="alert-link" target="_blank">Zásady ochrany osobních údajů</a> a <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Limity odchozí SMTP</a> – vaše použití je považováno za potvrzení a souhlas.
</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Důležité:
</strong>
<span>
Pokud jste vývojář, podívejte se na naši <a class="alert-link" href="/email-api#outbound-emails" target="_blank">dokumentaci k e-mailovému API</a>.
</span>
</div>

1. Přejděte do sekce <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Můj účet <i class="fa fa-angle-right"></i> Domény</a> <i class="fa fa-angle-right"></i> Nastavení <i class="fa fa-angle-right"></i> Konfigurace odchozího SMTP a postupujte podle pokynů k nastavení.

2. Vytvořte nový alias pro svou doménu v sekci <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Můj účet <i class="fa fa-angle-right"></i> Domény</a> <i class="fa fa-angle-right"></i> Aliasy (např. <code><hello@example.com></code>)

3. Klikněte na <strong class="text-success"><i class="fa fa-key"></i>Generovat heslo</strong> vedle nově vytvořeného aliasu. Zkopírujte do schránky a bezpečně uložte vygenerované heslo zobrazené na obrazovce.

4. Přejděte na stránku [Gmail](https://gmail.com) a v části [Nastavení <i class="fa fa-angle-right"></i> Účty a import <i class="fa fa-angle-right"></i> Odeslat poštu jako](https://mail.google.com/mail/u/0/#settings/accounts) klikněte na tlačítko „Přidat další e-mailovou adresu“.

5. Po zobrazení výzvy k zadání jména zadejte jméno, pod kterým chcete, aby se váš e-mail zobrazoval jako odesílatel (např. „Linus Torvalds“).

6. Po zobrazení výzvy k zadání „E-mailové adresy“ zadejte úplnou e-mailovou adresu aliasu, který jste vytvořili v sekci <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Můj účet <i class="fa fa-angle-right"></i> Domény</a> <i class="fa fa-angle-right"></i> Aliasy (např. <code><hello@example.com></code>)

7. Zrušte zaškrtnutí políčka „Považovat za alias“.

8. Klikněte na tlačítko „Další krok“ pro pokračování.

9. Po zobrazení výzvy k zadání adresy „SMTP Server“ zadejte <code>smtp.forwardemail.net</code> a ponechte port <code>587</code>.

10. Po zobrazení výzvy k zadání uživatelského jména zadejte úplnou e-mailovou adresu aliasu, který jste vytvořili v sekci <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Můj účet <i class="fa fa-angle-right"></i> Domény</a> <i class="fa fa-angle-right"></i> Aliasy (např. <code><hello@example.com></code>)

11. Po zobrazení výzvy k zadání hesla vložte heslo z kroku 3 výše, které je uvedeno v části <strong class="text-success"><i class="fa fa-key"></i>Generovat heslo</strong>.

12. Nechte zaškrtnuté přepínač „Zabezpečené připojení pomocí TLS“.

13. Klikněte na tlačítko „Přidat účet“ pro pokračování.

14. Otevřete novou kartu na stránce [Gmail](https://gmail.com) a počkejte na doručení ověřovacího e-mailu (obdržíte ověřovací kód, který potvrdí, že jste vlastníkem e-mailové adresy, ze které se pokoušíte „Odesílat poštu jako“).

15. Jakmile dorazí, zkopírujte a vložte ověřovací kód do výzvy, kterou jste obdrželi v předchozím kroku.

16. Jakmile to uděláte, vraťte se do e-mailu a klikněte na odkaz pro „potvrzení požadavku“. S největší pravděpodobností budete muset provést tento a předchozí krok, aby byl e-mail správně nakonfigurován.

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

### Jaký je starší bezplatný průvodce pro odesílání pošty pomocí Gmailu {#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail}

<div class="alert my-3 alert-danger"><i class="fa fa-stop-circle font-weight-bold"></i> <strong class="font-weight-bold">Důležité:</strong> Tato starší bezplatná příručka je od května 2023 zastaralá, protože <a class="alert-link" href="/faq#do-you-support-sending-email-with-smtp">we nyní podporuje odchozí SMTP</a>. Pokud použijete níže uvedenou příručku, <a class="alert-link" href="/faq#can-i-remove-the-via-forwardemail-dot-net-in-gmail">this způsobí, že vaše odchozí e-mailová schránka</a> bude v Gmailu uvádět „<span class="notranslate text-danger font-weight-bold">via forwardemail dot net</span>“.</a></div>

<div class="alert mb-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Odhadovaná doba nastavení:</strong>
<span>Méně než 10 minut</span>
</div>

<div class="alert mb-3 alert-success">
<i class="fa fa-bullhorn font-weight-bold"></i>
<strong class="font-weight-bold">
Začínáme:
</strong>
<span>
Pokud jste postupovali podle výše uvedených pokynů v části <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">Jak začít a nastavit přeposílání e-mailů</a>, můžete pokračovat ve čtení níže.
</span>
</div>

<div class="mx-auto lazyframe lazyframe-bordered border border-themed mb-3" data-vendor="youtube_nocookie" title="Jak posílat e-maily jako v Gmailu" data-src="https://www.youtube-nocookie.com/embed/MEheS8gM4Xs?autoplay=0"></div>"

<div id="legacy-free-guide">

1. Aby to fungovalo, musíte mít povolené [dvoufaktorové ověřování Gmailu][gmail-2fa]. Pokud ho nemáte povolené, navštivte <https://www.google.com/landing/2step/>.

2. Jakmile je dvoufaktorové ověřování povoleno (nebo pokud jste ho již měli povolené), navštivte stránku <https://myaccount.google.com/apppasswords>.

3. Po zobrazení výzvy k výběru aplikace a zařízení, pro které chcete vygenerovat heslo aplikace:
* V rozbalovací nabídce „Vybrat aplikaci“ vyberte možnost „Pošta“.
* V rozbalovací nabídce „Vybrat zařízení“ vyberte možnost „Jiné“.
* Po zobrazení výzvy k zadání textu zadejte e-mailovou adresu vaší vlastní domény, ze které přesměrováváte e-maily (např. <code><hello@example.com></code> – to vám pomůže sledovat situaci, pokud tuto službu používáte pro více účtů).

4. Zkopírujte heslo do schránky, která se automaticky vygeneruje.
<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Důležité:
</strong>
<span>
Pokud používáte G Suite, přejděte do administrátorského panelu <a class="alert-link" href="https://admin.google.com/AdminHome#ServiceSettings/service=email&subtab=filters" rel="noopener noreferrer" target="_blank">Aplikace <i class="fa fa-angle-right"></i> G Suite <i class="fa fa-angle-right"></i> Nastavení pro Gmail <i class="fa fa-angle-right"></i> Nastavení</a> a nezapomeňte zaškrtnout políčko „Povolit uživatelům odesílat poštu prostřednictvím externího serveru SMTP...“. Aktivace této změny může trvat určitou dobu, proto prosím počkejte několik minut.
</span>
</div>

5. Přejděte na stránku [Gmail](https://gmail.com) a v části [Nastavení <i class="fa fa-angle-right"></i> Účty a import <i class="fa fa-angle-right"></i> Odeslat poštu jako](https://mail.google.com/mail/u/0/#settings/accounts) klikněte na „Přidat další e-mailovou adresu“.

6. Po zobrazení výzvy k zadání jména zadejte jméno, pod kterým chcete, aby se váš e-mail zobrazoval jako odesílatel (např. „Linus Torvalds“).

7. Po zobrazení výzvy k zadání „E-mailové adresy“ zadejte e-mailovou adresu s vlastní doménou, kterou jste použili výše (např. <code><hello@example.com></code>).

8. Zrušte zaškrtnutí políčka „Považovat za alias“.

9. Klikněte na tlačítko „Další krok“ pro pokračování.

10. Po zobrazení výzvy k zadání „SMTP serveru“ zadejte <code>smtp.gmail.com</code> a ponechte port <code>587</code>.

11. Po zobrazení výzvy k zadání „Uživatelského jména“ zadejte část své adresy Gmail bez části <span>gmail.com</span> (např. pouze „uživatel“, pokud je můj e-mail <span><uživatel@gmail.com></span>)
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Důležité:
</strong>
<span>
Pokud je část „Uživatelské jméno“ vyplněna automaticky, <u><strong>budete ji muset změnit</strong></u> na část s uživatelským jménem vaší adresy Gmail.
</span>
</div>

12. Po zobrazení výzvy k zadání hesla vložte ze schránky heslo, které jste vygenerovali v kroku 2 výše.

13. Nechte zaškrtnuté přepínač „Zabezpečené připojení pomocí TLS“.

14. Klikněte na tlačítko „Přidat účet“ pro pokračování.

15. Otevřete novou kartu na stránce [Gmail](https://gmail.com) a počkejte na doručení ověřovacího e-mailu (obdržíte ověřovací kód, který potvrdí, že jste vlastníkem e-mailové adresy, ze které se pokoušíte „Odesílat poštu jako“).

16. Jakmile dorazí, zkopírujte a vložte ověřovací kód do výzvy, kterou jste obdrželi v předchozím kroku.

17. Jakmile to uděláte, vraťte se do e-mailu a klikněte na odkaz pro „potvrzení požadavku“. S největší pravděpodobností budete muset provést tento a předchozí krok, aby byl e-mail správně nakonfigurován.

</div>

### Pokročilá konfigurace směrování Gmailu {#advanced-gmail-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Odhadovaná doba přípravy:</strong>
<span>15–30 minut</span>
</div>

Pokud chcete v Gmailu nastavit pokročilé směrování tak, aby aliasy, které neodpovídají poštovní schránce, přesměrovávaly e-maily na účty služby Forward Email, postupujte takto:

1. Přihlaste se do administrátorské konzole Google na adrese [admin.google.com](https://admin.google.com)
2. Přejděte do sekce **Aplikace → Google Workspace → Gmail → Směrování**
3. Klikněte na **Přidat trasu** a nakonfigurujte následující nastavení:

**Nastavení pro jednoho příjemce:**

* Vyberte možnost „Změnit příjemce obálky“ a zadejte svou primární adresu Gmail
* Zaškrtněte políčko „Přidat hlavičku X-Gm-Original-To s původním příjemcem“

**Vzory příjemců obálek:**

* Přidejte vzor, který odpovídá všem neexistujícím poštovním schránkám (např. `.*@yourdomain.com`)

**Nastavení e-mailového serveru:**

* Vyberte „Trasa k hostiteli“ a zadejte `mx1.forwardemail.net` jako primární server
* Přidejte `mx2.forwardemail.net` jako záložní server
* Nastavte port na 25
* Pro zabezpečení vyberte „Vyžadovat TLS“

4. Kliknutím na tlačítko **Uložit** vytvořte trasu.

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Důležité:
</strong>
<span>
Tato konfigurace bude fungovat pouze pro účty Google Workspace s vlastními doménami, nikoli pro běžné účty Gmail.
</span>
</div>

### Pokročilá konfigurace směrování Outlooku {#advanced-outlook-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Odhadovaná doba přípravy:</strong>
<span>15–30 minut</span>
</div>

Pro uživatele Microsoft 365 (dříve Office 365), kteří chtějí nastavit pokročilé směrování tak, aby aliasy, které neodpovídají poštovní schránce, přesměrovávaly poštu na účty služby Forward Email:

1. Přihlaste se do administračního centra Microsoft 365 na adrese [admin.microsoft.com](https://admin.microsoft.com)
2. Přejděte do sekce **Exchange → Tok pošty → Pravidla**
3. Klikněte na **Přidat pravidlo** a vyberte **Vytvořit nové pravidlo**
4. Pojmenujte pravidlo (např. „Přeposílání neexistujících poštovních schránek na Přeposílání e-mailů“)
5. V části **Použít toto pravidlo, pokud** vyberte:
* „Adresa příjemce odpovídá...“
* Zadejte vzor, který odpovídá všem adresám ve vaší doméně (např. `*@yourdomain.com`)
6. V části **Proveďte následující** vyberte:
* „Přesměrovat zprávu na...“
* Vyberte „Následující poštovní server“
* Zadejte `mx1.forwardemail.net` a port 25
* Přidejte `mx2.forwardemail.net` jako záložní server
7. V části **S výjimkou případů** vyberte:
* „Příjemce je...“
* Přidejte všechny stávající poštovní schránky, které by neměly být přeposláno
8. Nastavte prioritu pravidla, aby se spouštělo až po ostatních pravidlech toku pošty
9. Kliknutím na **Uložit** aktivujte pravidlo

## Řešení problémů {#troubleshooting}

### Proč nedostávám testovací e-maily {#why-am-i-not-receiving-my-test-emails}

Pokud si posíláte testovací e-mail, nemusí se vám zobrazit ve vaší doručené poště, protože má stejné záhlaví „ID zprávy“.

Toto je všeobecně známý problém, který se týká i služeb, jako je Gmail. <a href="https://support.google.com/a/answer/1703601">Here" je oficiální odpověď Gmailu ohledně tohoto problému</a>.

Pokud problémy přetrvávají, je pravděpodobné, že se jedná o problém s šířením DNS. Budete muset chvíli počkat a zkusit to znovu (nebo zkuste nastavit nižší hodnotu TTL pro vaše <strong class="notranslate">TXT</strong> záznamy).

**Stále máte problémy?** Prosím, <a href="/help">kontaktujte nás</a>, abychom vám mohli pomoci problém prošetřit a najít rychlé řešení.

### Jak nakonfiguruji svůj e-mailový klient pro práci s přeposíláním e-mailů {#how-do-i-configure-my-email-client-to-work-with-forward-email}

<div class="mb-3">
Naše služba funguje s oblíbenými e-mailovými klienty, jako například:
<ul class="ml-1 h4 d-inline list-inline mb-0 pl-0">
<li class="list-inline-item"><a href="/blog/open-source/apple-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Apple®</a></li>
<li class="list-inline-item"><a href="/blog/open-source/windows-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Windows®</a></li>
<li class="list-inline-item"><a href="/blog/open-source/android-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-android"></i> Android&trade;</a></li>
<li class="list-inline-item"><a href="/blog/open-source/linux-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-linux"></i> Linux&reg;</a></li>
<li class="list-inline-item"><a href="/blog/open-source/desktop-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fas fa-desktop"></i> Počítač</a></li>
<li class="list-inline-item"><a href="/blog/open-source/mozilla-firefox-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-firefox-browser"></i> Mozilla Firefox&reg;</a></li>
<li class="list-inline-item"><a href="/blog/open-source/safari-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Safari&reg;</a></li>
<li class="list-inline-item"><a href="/blog/open-source/google-chrome-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-chrome"></i> Google Chrome&reg;</a></li>
<li class="list-inline-item"><a href="/blog/open-source/terminal-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fas fa-terminal"></i> Terminál</a></li>
</ul>
</div>

<div class="alert alert-primary">
Vaše uživatelské jméno je e-mailová adresa vašeho aliasu a heslo je z <strong class="text-success"><i class="fa fa-key"></i>Generovat heslo</strong> („Normální heslo“).
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tip:
</strong>
<span>Pokud používáte Thunderbird, ujistěte se, že je „Zabezpečení připojení“ nastaveno na „SSL/TLS“ a metoda ověřování je nastavena na „Normální heslo“.</span>
</div>

| Typ | Název hostitele | Protokol | Porty |
| :--: | :---------------------: | :-------------------------------------: | :----------------------------------------------------------------------------------: |
| IMAP | `imap.forwardemail.net` | SSL/TLS **Preferováno** | __KÓD_BUŇKY_0__ a __KÓD_BUŇKY_1__ |
| SMTP | `smtp.forwardemail.net` | SSL/TLS **Preferováno** nebo TLS (STARTTLS) | `465` a `2465` pro SSL/TLS (nebo) `587`, `2587`, `2525` a `25` pro TLS (STARTTLS) |

### Proč se mé e-maily dostávají do složek Spam a Nevyžádaná pošta a jak si mohu zkontrolovat reputaci své domény {#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation}

Tato část vás provede informacemi o tom, zda vaše odchozí pošta používá naše SMTP servery (např. `smtp.forwardemail.net`) (nebo je přeposílána přes `mx1.forwardemail.net` nebo `mx2.forwardemail.net`) a je doručována do složky Spam nebo Nevyžádaná pošta příjemců.

Pravidelně monitorujeme naši [IP adresy](#what-are-your-servers-ip-addresses) oproti [všichni renomovaní denylisté DNS](#how-do-you-handle-your-ip-addresses-becoming-blocked), **proto se s největší pravděpodobností jedná o problém specifický pro reputaci domény**.

E-maily se mohou dostat do složky s nevyžádanou poštou z několika důvodů:

1. **Chybí ověření**: Nastavte záznamy [SPF](#how-do-i-set-up-spf-for-forward-email), [DKIM](#how-do-i-set-up-dkim-for-forward-email) a [DMARC](#how-do-i-set-up-dmarc-for-forward-email).

2. **Reputace domény**: Nové domény mají často neutrální reputaci, dokud si nevytvoří historii odesílání.

3. **Spouštěče obsahu**: Některá slova nebo fráze mohou spustit spamové filtry.

4. **Vzorce odesílání**: Náhlé zvýšení objemu e-mailů může vypadat podezřele.

Ke kontrole reputace a kategorizace vaší domény můžete zkusit použít jeden nebo více z těchto nástrojů:

| Název nástroje | URL | Typ |
| ------------------------------------------- | ---------------------------------------------------------------- | ---------------------- |
| Zpětná vazba kategorizace domény Cloudflare | <https://radar.cloudflare.com/domains/feedback> | Kategorizace |
| Spamhaus IP a kontrola reputace domény | <https://check.spamhaus.org/> | DNSBL |
| Cisco Talos IP and Domain Reputation Center | <https://talosintelligence.com/reputation_center> | Pověst |
| Barracuda IP a vyhledávání reputace domény | <https://www.barracudacentral.org/lookups/lookup-reputation> | DNSBL |
| Kontrola černé listiny MX Toolbox | <https://mxtoolbox.com/blacklists.aspx> | Černá listina |
| Google Postmaster Tools | <https://www.gmail.com/postmaster/> | Pověst |
| Yahoo Sender Hub | <https://senders.yahooinc.com/> | Pověst |
| Kontrola černé listiny MultiRBL.valli.org | <https://multirbl.valli.org/lookup/> | DNSBL |
| Skóre odesílatele | <https://senderscore.org/act/blocklist-remover/> | Pověst |
| Zhodnocení | <https://www.invaluement.com/lookup/> | DNSBL |
| SURBL | <https://www.surbl.org/> | DNSBL |
| Odstranění IP adresy Apple/Proofpoint | <https://ipcheck.proofpoint.com/> | Odstranění |
| Odstranění IP Cloudmark | <https://csi.cloudmark.com/en/reset/> | Odstranění |
| SpamCop | <https://www.spamcop.net/bl.shtml> | DNSBL |
| Odstranění IP adres Microsoft Outlook a Office 365 | <https://sendersupport.olc.protection.outlook.com/pm/Postmaster> | Odstranění |
| Úrovně 1, 2 a 3 UCEPROTECT | <https://www.uceprotect.net/en/rblcheck.php> | DNSBL |
| Backscatterer.org společnosti UCEPROTECT | <https://www.backscatterer.org/> | Ochrana proti zpětnému rozptylu |
| Whitelisted.org společnosti UCEPROTECT | <https://www.whitelisted.org/> (vyžaduje poplatek) | DNSWL |
| AT&T | `abuse_rbl@abuse-att.net` | Odstranění |
| AOL/Verizon (např. `[IPTS04]`) | <https://senders.yahooinc.com/> | Odstranění |
| Cox Communications | `unblock.request@cox.net` | Odstranění |
| t-online.de (německy/T-Mobile) | `tobr@rx.t-online.de` | Odstranění |

> \[!TIP]
> Start with a low volume of high-quality emails to build a positive reputation before sending in larger volumes.

> \[!IMPORTANT]
> If your domain is on a blacklist, each blacklist has its own removal process. Check their websites for instructions.

> \[!TIP]
> If you need additional help or find that we are false-positive listed as spam by a certain email service provider, then please <a href="/help">contact us</a>.

### Co mám dělat, když dostávám spamové e-maily {#what-should-i-do-if-i-receive-spam-emails}

Měli byste se odhlásit ze seznamu e-mailů (pokud je to možné) a zablokovat odesílatele.

Nenahlašujte prosím zprávu jako spam, ale přepošlete ji našemu ručně spravovanému a na soukromí zaměřenému systému prevence zneužití.

**E-mailová adresa pro přeposílání spamu je:** <abuse@forwardemail.net>

### Proč se testovací e-maily, které mi byly zasílány v Gmailu, zobrazují jako „podezřelé“ {#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious}

Pokud se vám v Gmailu zobrazí tato chybová zpráva, když si sami sobě posíláte testovací zprávu, nebo když osoba, které píšete e-mail pod vaší aliasem, poprvé uvidí váš e-mail, pak se **neobávejte** – jedná se o vestavěnou bezpečnostní funkci Gmailu.

Můžete jednoduše kliknout na „Vypadá bezpečně“.  Pokud byste například odeslali testovací zprávu pomocí funkce odeslat poštu jako (někomu jinému), tato zpráva se mu nezobrazí.

Pokud se jim ale tato zpráva zobrazí, je to proto, že byli zvyklí vídat vaše e-maily z adresy <john@gmail.com> místo <john@customdomain.com> (jen příklad). Gmail uživatele upozorní, aby se ujistil, že je vše v bezpečí, pro případ, že by to nebylo možné, neexistuje žádné alternativní řešení.

### Mohu v Gmailu odstranit funkci přes forwardemail dot net {#can-i-remove-the-via-forwardemail-dot-net-in-gmail}?

Toto téma souvisí s [široce známý problém v Gmailu, kdy se vedle jména odesílatele objevují další informace](https://support.google.com/mail/answer/1311182).

Od května 2023 podporujeme odesílání e-mailů s protokolem SMTP jako doplněk pro všechny platící uživatele – což znamená, že můžete v Gmailu odstranit funkci <span class="notranslate">přes forwardemail tečka net</span>.

Upozorňujeme, že toto téma s častými dotazy je určeno konkrétně pro uživatele funkce [Jak odesílat poštu jako pomocí Gmailu](#how-to-send-mail-as-using-gmail).

Pokyny ke konfiguraci naleznete v části [Podporujete odesílání e-mailů pomocí SMTP](#do-you-support-sending-email-with-smtp).

## Správa dat {#data-management}

### Kde se nacházejí vaše servery {#where-are-your-servers-located}

> \[!TIP]
> We may soon announce our EU datacenter location hosted under [forwardemail.eu](https://forwardemail.eu).  Subscribe to the discussion at <https://github.com/orgs/forwardemail/discussions/336> for updates.

Naše servery se nacházejí převážně v Denveru v Coloradu – kompletní seznam IP adres naleznete na <https://forwardemail.net/ips>.

O našich subzpracovatelích se můžete dozvědět na stránkách [GDPR](/gdpr), [DPA](/dpa) a [Soukromí](/privacy).

### Jak exportuji a zálohuji svou poštovní schránku {#how-do-i-export-and-backup-my-mailbox}

Své poštovní schránky můžete kdykoli exportovat ve formátech [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions), [Mbox](https://en.wikipedia.org/wiki/Mbox) nebo šifrovaných [SQLite](https://en.wikipedia.org/wiki/SQLite).

Přejděte do sekce <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Můj účet <i class="fa fa-angle-right"></i> Domény</a> <i class="fa fa-angle-right"></i> Aliasy <i class="fa fa-angle-right"></i> Stáhnout zálohu a vyberte preferovaný typ formátu exportu.

Po dokončení exportu vám bude zaslán odkaz na stažení exportu.

Upozorňujeme, že platnost tohoto odkazu ke stažení exportu z bezpečnostních důvodů vyprší po 4 hodinách.

Pokud potřebujete zkontrolovat exportované formáty EML nebo Mbox, mohou být užitečné tyto nástroje s otevřeným zdrojovým kódem:

| Jméno | Formát | Platforma | Adresa URL GitHubu |
| --------------- | :----: | ------------- | --------------------------------------------------- |
| Prohlížeč MBox | Mbox | Windows | <https://github.com/eneam/mboxviewer> |
| mbox-web-viewer | Mbox | Všechny platformy | <https://github.com/PHMRanger/mbox-web-viewer> |
| EmlReader | EML | Windows | <https://github.com/ayamadori/EmlReader> |
| Prohlížeč e-mailů | EML | VSCode | <https://github.com/joelharkes/vscode_email_viewer> |
| eml-reader | EML | Všechny platformy | <https://github.com/s0ph1e/eml-reader> |

Pokud potřebujete převést soubor Mbox do souboru EML, můžete použít <https://github.com/noelmartinon/mboxzilla>.

### Jak importuji a migruji svou stávající poštovní schránku {#how-do-i-import-and-migrate-my-existing-mailbox}

Svůj e-mail můžete snadno importovat do služby Forward Email (např. pomocí [Thunderbird](https://www.thunderbird.net)) podle níže uvedených pokynů:

<div class="alert alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Důležité:
</strong>
<span>
Pro import stávajícího e-mailu je nutné provést všechny následující kroky.
</span>
</div>

1. Exportujte e-maily od svého stávajícího poskytovatele e-mailových služeb:

| Poskytovatel e-mailu | Formát exportu | Pokyny pro export |
| -------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Gmail | MBOX | <https://takeout.google.com/settings/takeout/custom/gmail> |
| Výhled | PST | <div class="alert my-3 alert-danger"><i class="fa fa-info-circle font-weight-bold"></i> <strong class="font-weight-bold">Tip:</strong> <span>Pokud používáte Outlook (<a href="https://support.microsoft.com/en-us/office/back-up-your-email-e5845b0b-1aeb-424f-924c-aa1c33b18833#:~:text=Select%20File%20%3E%20Open%20%26%20Export%20%3E,back%20up%20and%20select%20Next." class="alert-link">formát exportu PST</a>), můžete jednoduše postupovat podle pokynů v části „Ostatní“ níže. Níže však uvádíme odkazy pro převod PST do formátu MBOX/EML v závislosti na vašem operačním systému:<ul class="mb-0 mt-3"><li><a class="alert-link" href="https://github.com/BaselineIT/Zinkuba/releases/download/release-1.2/Zinkuba.App.exe">Zinkuba pro Windows</a> (<a class="alert-link" href="https://github.com/BaselineIT/Zinkuba?tab=readme-ov-file#zinkuba">GitHub</a>)</li><li><a class="alert-link" href="https://cygwin.com/packages/summary/readpst.html">readpst pro Windows cygwin</a> – (např. <code>readpst -u -o $OUT_DIR $IN_DIR</code> nahrazením <code>$OUT_DIR</code> a <code>$IN_DIR</code> výstupním adresářem a vstupní cesty k adresářům).</li><li><a class="alert-link" href="https://manpages.ubuntu.com/manpages/trusty/man1/readpst.1.html">readpst pro Ubuntu/Linux</a> – (např. <code>sudo apt-get install readpst</code> a poté <code>readpst -u -o $OUT_DIR $IN_DIR</code>, nahrazením <code>$OUT_DIR</code> a <code>$IN_DIR</code> výstupními a vstupními cestami k adresářům).</li><li><a class="alert-link" href="https://formulae.brew.sh/formula/libpst">readpst pro macOS (přes brew)</a> – (např. <code>brew install libpst</code> a poté <code>readpst -u -o $OUT_DIR $IN_DIR</code>, nahrazením <code>$OUT_DIR</code> a <code>$IN_DIR</code> s cestami k výstupnímu adresáři a vstupnímu adresáři).</li><li><a class="alert-link" href="https://github.com/juanirm/pst-converter/tree/master?tab=readme-ov-file#pst-converter">PST Converter pro Windows (GitHub)</a></li></ul><br /></span></div> |
| Apple Mail | MBOX | <https://support.apple.com/guide/mail/import-or-export-mailboxes-mlhlp1030/mac#apd37a3190755974> |
| Fastmail | EML | <https://www.fastmail.help/hc/en-us/articles/360060590573-Download-all-your-data#downloadmail> |
| Protonová pošta | MBOX/EML | <https://proton.me/support/export-emails-import-export-app> |
| Tutanota | EML | <https://github.com/crepererum-oss/tatutanatata> |
| Přemýšlejte | EML | <https://docs.gandi.net/en/gandimail/common_operations/backup_email.html#contents> |
| Zoho | EML | <https://www.zoho.com/mail/help/import-export-emails.html#alink2> |
| Ostatní | [Use Thunderbird](https://www.thunderbird.net) | Nastavte si stávající e-mailový účet v Thunderbirdu a poté použijte plugin [ImportExportTools NG](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/) k exportu a importu e-mailů. **Můžete také jednoduše kopírovat/vkládat nebo přetahovat e-maily mezi účty.** |

2. Stáhněte, nainstalujte a otevřete soubor [Thunderbird](https://www.thunderbird.net).

3. Vytvořte si nový účet s použitím celé e-mailové adresy vašeho aliasu (např. <code><you@yourdomain.com></code>) a vygenerovaného hesla. <strong>Pokud ještě nemáte vygenerované heslo, <a href="/faq#do-you-support-receiving-email-with-imap" target="_blank">podívejte se na naše pokyny k nastavení</a></strong>.

4. Stáhněte a nainstalujte plugin Thunderbird s názvem [ImportExportTools OF](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/).

5. Vytvořte novou lokální složku v Thunderbirdu a poté na ni klikněte pravým tlačítkem myši → vyberte možnost `ImportExportTools NG` → zvolte `Import mbox file` (pro exportní formát MBOX) – nebo – `Import messages` / `Import all messages from a directory` (pro exportní formát EML).

6. Přetáhněte zprávy z lokální složky do nové (nebo existující) složky IMAP v Thunderbirdu, kam chcete nahrát zprávy v úložišti IMAP pomocí naší služby. Tím zajistíte jejich online zálohování pomocí našeho šifrovaného úložiště SQLite.

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tip:
</strong>
<span>
Pokud si nejste jisti, jak importovat do Thunderbirdu, můžete se podívat na oficiální pokyny na <a class="alert-link" href="https://kb.mozillazine.org/Importing_folders">https://kb.mozillazine.org/Importing_folders</a> a <a class="alert-link" href="https://github.com/thunderbird/import-export-tools-ng/wiki">https://github.com/thunderbird/import-export-tools-ng/wiki</a>."
</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Důležité:
</strong>
<span>
Po dokončení exportu a importu můžete také povolit přeposílání na svém stávajícím e-mailovém účtu a nastavit automatickou odpověď, která bude odesílatele upozorňovat, že máte novou e-mailovou adresu (např. pokud jste dříve používali Gmail a nyní používáte e-mail s vaší vlastní doménou).
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

### Podporujete vlastní hosting {#do-you-support-self-hosting}

Ano, od března 2025 podporujeme možnost vlastního hostování. Přečtěte si blog [zde](https://forwardemail.net/blog/docs/self-hosted-solution). Pro začátek se podívejte na [průvodce s vlastním hostitelem](https://forwardemail.net/self-hosted). A pro ty, kteří mají zájem o podrobnější návod krok za krokem, se podívejte na naše průvodce založené na [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) nebo [Debian](https://forwardemail.net/guides/selfhosted-on-debian).

## Konfigurace e-mailu {#email-configuration}

### Jak začít a nastavit přeposílání e-mailů {#how-do-i-get-started-and-set-up-email-forwarding}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Odhadovaná doba nastavení:</strong>
<span>Méně než 10 minut</span>
</div>

<div class="alert my-3 alert-success">
<i class="fa fa-bullhorn font-weight-bold"></i>
<strong class="font-weight-bold">
Začínáme:
</strong>
<span>
Pečlivě si přečtěte a postupujte podle kroků jedna až osm uvedených níže. Nezapomeňte nahradit e-mailovou adresu <code>user@gmail.com</code> e-mailovou adresou, na kterou chcete přeposílat e-maily (pokud již není přesná). Podobně nezapomeňte nahradit <code>example.com</code> vaším vlastním názvem domény (pokud již není přesný).
</span>
</div>

<ol>
<li class="mb-2 mb-md-3 mb-lg-5">Pokud jste si již někde zaregistrovali název své domény, musíte tento krok zcela přeskočit a přejít ke kroku dva! Jinak můžete <a href="/domain-registration" rel="noopener noreferrer">kliknout sem a zaregistrovat název své domény</a>.</li>
<li class="mb-2 mb-md-3 mb-lg-5">
Pamatujete si, kde jste si zaregistrovali svou doménu? Jakmile si to vzpomenete, postupujte podle níže uvedených pokynů:

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Důležité:
</strong>
<span>
Musíte otevřít novou kartu a přihlásit se k registrátorovi domény. Pro automatické přihlášení stačí kliknout níže na odkaz „Registrátor“. Na této nové kartě musíte přejít na stránku správy DNS u svého registrátora – níže ve sloupci „Kroky konfigurace“ naleznete podrobné kroky navigace. Jakmile se na tuto stránku v nové kartě dostanete, můžete se na tuto kartu vrátit a pokračovat krokem tři níže.
<strong class="font-weight-bold">Otevřenou kartu zatím nezavírejte; budete ji potřebovat pro budoucí kroky!</strong>
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
<td>Přihlásit se <i class="fa fa-angle-right"></i> Centrum domén <i class="fa fa-angle-right"></i> (Vyberte svou doménu) <i class="fa fa-angle-right"></i> Upravit nastavení DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon Trasa 53</a></td>
<td>Přihlásit se <i class="fa fa-angle-right"></i> Hostované zóny <i class="fa fa-angle-right"></i> (Vyberte svou doménu)</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>
<td>Přihlásit se <i class="fa fa-angle-right"></i> Moje servery <i class="fa fa-angle-right"></i> Správa domén <i class="fa fa-angle-right"></i> Správce DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.bluehost.com/help/article/dns-management-add-edit-or-delete-dns-entries">Bluehost</a></td>
<td>PRO ROCK: Přihlásit se <i class="fa fa-angle-right"></i> Domény <i class="fa fa-angle-right"></i> (Klikněte na ikonu ▼ vedle spravovat) <i class="fa fa-angle-right"></i> DNS
<br />
PRO STARŠÍ VERZI: Přihlásit se <i class="fa fa-angle-right"></i> Domény <i class="fa fa-angle-right"></i> Editor zón <i class="fa fa-angle-right"></i> (Vyberte svou doménu)</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://dash.cloudflare.com/login">Cloudflare</a></td>
<td>Přihlásit se <i class="fa fa-angle-right"></i> DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://cp.dnsmadeeasy.com/">DNS Snadné a snadné použití</a></td>
<td>Přihlásit se <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> (Vyberte vaše doména)</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://dnsimple.com/dashboard">DNSimple</a></td>
<td>Přihlásit se <i class="fa fa-angle-right"></i> (Vyberte svou doménu) <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> Spravovat</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://cloud.digitalocean.com/login">Digital Oceán</a></td>
<td>Přihlásit se <i class="fa fa-angle-right"></i> Sítě <i class="fa fa-angle-right"></i> Domény <i class="fa fa-angle-right"></i> (Vyberte svou doménu) <i class="fa fa-angle-right"></i> Více <i class="fa fa-angle-right"></i> Spravovat doménu</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.domain.com/help/article/dns-management-how-to-update-dns-records">Domain.com</a></td>
<td>Přihlásit se <i class="fa fa-angle-right"></i> V zobrazení karet klikněte na spravovat u vaší domény <i class="fa fa-angle-right"></i> V zobrazení seznamu klikněte na ikonu ozubeného kola <i class="fa fa-angle-right"></i> DNS a nameservery <i class="fa fa-angle-right"></i> Záznamy DNS</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://www.domains.com/">Domains.com</a>
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=WnU0Gp-Y-es"><i class="fa fa-play-circle"></i> Sledovat</a>
</td>
<td>Přihlásit se <i class="fa fa-angle-right"></i> (Vyberte svou doménu) <i class="fa fa-angle-right"></i> Spravovat <i class="fa fa-angle-right"></i> (klikněte na ikonu ozubeného kola) <i class="fa fa-angle-right"></i> Klikněte na DNS a nameservery v levé nabídce</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://panel.dreamhost.com/">DreamHost</a></td>
<td>Přihlásit se <i class="fa fa-angle-right"></i> Panel <i class="fa fa-angle-right"></i> Domény <i class="fa fa-angle-right"></i> Spravovat domény <i class="fa fa-angle-right"></i> DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://portal.dynect.net/login/">Dyn</a></td>
<td>Přihlásit se <i class="fa fa-angle-right"></i> Přehled <i class="fa fa-angle-right"></i> Správa <i class="fa fa-angle-right"></i> Jednoduchý editor <i class="fa fa-angle-right"></i> Záznamy</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://id.gandi.net/en/login">Gandi</a></td>
<td>Přihlásit se <i class="fa fa-angle-right"></i> (Vyberte svou doménu) <i class="fa fa-angle-right"></i> Správa <i class="fa fa-angle-right"></i> Upravit zónu</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://sso.godaddy.com">GoDaddy</a> <br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=G7g8FiZL5D8"><i class="fa fa-play-circle"></i> Sledovat</a>
</td>
<td>Přihlásit se <i class="fa fa-angle-right"></i> Spravovat mé domény <i class="fa fa-angle-right"></i> (Vyberte svou doménu) <i class="fa fa-angle-right"></i> Spravovat DNS</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://domains.google.com/registrar">Google Domény</a>
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=01iHjbIN5CQ"><i class="fa fa-play-circle"></i> Sledovat</a>
</td>
<td>Přihlásit se <i class="fa fa-angle-right"></i> (Vyberte svou doménu) <i class="fa fa-angle-right"></i> Konfigurovat DNS</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://www.namecheap.com/myaccount/login/">Namecheap</a>
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=no62GCzMn7E"><i class="fa fa-play-circle"></i> Sledovat</a>
</td>
<td>Přihlásit se <i class="fa fa-angle-right"></i> Seznam domén <i class="fa fa-angle-right"></i> (Vyberte svou doménu) <i class="fa fa-angle-right"></i> Spravovat <i class="fa fa-angle-right"></i> Pokročilé DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://app.netlify.com/">Netlify</a></td>
<td>Přihlásit se <i class="fa fa-angle-right"></i> (Vyberte svou doménu) <i class="fa fa-angle-right"></i> Nastavení DNS Netlify</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.networksolutions.com/manage-it/index.jsp">Network Řešení</a></td>
<td>Přihlásit se <i class="fa fa-angle-right"></i> Správce účtu <i class="fa fa-angle-right"></i> Moje doménová jména <i class="fa fa-angle-right"></i> (Vyberte svou doménu) <i class="fa fa-angle-right"></i> Spravovat <i class="fa fa-angle-right"></i> Změna směru domény <i class="fa fa-angle-right"></i> Pokročilé DNS</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://accounts.shopify.com/store-login">Shopify</a>
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=G1NR8CIdv2M"><i class="fa fa-play-circle"></i> Sledovat</a>
</td>
<td>Přihlásit se <i class="fa fa-angle-right"></i> Spravované domény <i class="fa fa-angle-right"></i> (Vyberte svou doménu) <i class="fa fa-angle-right"></i> Nastavení DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://support.squarespace.com/hc/en-us/articles/214767107">Squarespace</a></td>
<td>Přihlásit se <i class="fa fa-angle-right"></i> Domů <i class="fa fa-angle-right"></i> Nastavení <i class="fa fa-angle-right"></i> Domény <i class="fa fa-angle-right"></i> (Vyberte svou doménu) <i class="fa fa-angle-right"></i>
Pokročilá nastavení <i class="fa fa-angle-right"></i> Vlastní záznamy</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://vercel.com/docs/now-cli?utm_source=zeit-dashboard&utm_medium=web&utm_campaign=configure-dns#commands/dns">Vercel's Nyní</a></td>
<td>Použití CLI "now" <i class="fa fa-angle-right"></i> <code>now dns add [doména] '@' MX [hodnota záznamu] [priorita]</code></td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.weebly.com/app/help/us/en/topics/manage-dns-records">Weebly</a></td>
<td>Přihlásit se <i class="fa fa-angle-right"></i> Stránka Domény <i class="fa fa-angle-right"></i> (Vyberte svou doménu) <i class="fa fa-angle-right"></i> DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://support.wix.com/en/article/adding-dns-records-in-your-wix-account">Wix</a></td>
<td>Přihlásit se <i class="fa fa-angle-right"></i> Stránka Domény <i class="fa fa-angle-right"></i> (Klikněte na ikonu <i class="fa fa-ellipsis-h"></i>) <i class="fa fa-angle-right"></i> Vyberte Spravovat záznamy DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.enom.com/login.aspx?page=%2fmyaccount%2fdefault.aspx&amp;">eNom</a></td>
<td>Přihlásit se <i class="fa fa-angle-right"></i> Domény <i class="fa fa-angle-right"></i> Moje domény</td>
</tr>
<tr>
<td>Ostatní</td>
<td>
<div class="alert mb-0 alert-warning"><i class="fa fa-exclamation-circle font-weight-bold"></i> <strong class="font-weight-bold">Důležité:</strong> Nevidíte zde jméno svého registrátora? Jednoduše vyhledejte na internetu „jak změnit záznamy DNS na $REGISTRAR“ (nahraďte $REGISTRAR jménem svého registrátora – např. „jak změnit záznamy DNS na GoDaddy“, pokud používáte GoDaddy).</div>
</td>
</tr>
</tbody>
</table>
</li>
<li class="mb-2 mb-md-3 mb-lg-5">Na stránce správy DNS vašeho registrátora (druhá karta, kterou jste otevřeli) nastavte následující záznamy „MX“:

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Důležité:
</strong>
<span>
Upozorňujeme, že by neměly být nastaveny ŽÁDNÉ další záznamy MX. Oba níže uvedené záznamy MUSÍ existovat. Ujistěte se, že neobsahují žádné překlepy a že máte správně napsány záznamy mx1 i mx2. Pokud již záznamy MX existovaly, prosím, smažte je úplně.
Hodnota „TTL“ nemusí být 3600, v případě potřeby může být nižší nebo vyšší.
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Jméno/Hostitel/Alias</th>
<th class="text-center">TTL</th>
<th>Typ</th>
<th>Priorita</th>
<th>Odpověď/Hodnota</th>
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

</li><li class="mb-2 mb-md-3 mb-lg-5" id="dns-configuration-options">Na stránce správy DNS vašeho registrátora (druhá karta, kterou jste otevřeli) nastavte následující záznam(y) <strong class="notranslate">TXT</strong>:

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Důležité:
</strong>
<span>
Pokud máte placený tarif, musíte tento krok zcela přeskočit a přejít ke kroku pět! Pokud placený tarif nemáte, budou vaše přesměrované adresy veřejně vyhledatelné – přejděte do sekce <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Můj účet <i class="fa fa-angle-right"></i> Domény</a> a v případě potřeby upgradujte svou doménu na placený tarif. Pokud se chcete dozvědět více o placených tarifech, podívejte se na naši stránku <a rel="noopener noreferrer" href="/private-business-email" class="alert-link">Ceník</a>. Jinak můžete pokračovat ve výběru jedné nebo více kombinací z možností A až F uvedených níže.

</span>
</div>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Možnost A:
</strong>
<span>
Pokud přeposíláte všechny e-maily z vaší domény (např. „all@example.com“, „hello@example.com“ atd.) na konkrétní adresu „user@gmail.com“:
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
Nezapomeňte nahradit výše uvedené hodnoty ve sloupci „Hodnota“ svou vlastní e-mailovou adresou. Hodnota „TTL“ nemusí být 3600, v případě potřeby může být nižší nebo vyšší. Kratší hodnota doby platnosti („TTL“) zajistí, že se veškeré budoucí změny provedené v záznamech DNS rychleji rozšíří po celém internetu – představte si to jako dobu, po kterou budou záznamy ukládány do mezipaměti (v sekundách). Více informací o <a href="https://en.wikipedia.org/wiki/Time_to_live#DNS_records" rel="noopener noreferrer" target="_blank" class="alert-link">TTL naleznete na Wikipedii</a>.
</span>
</div>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Možnost B:
</strong>
<span>
Pokud potřebujete přeposlat pouze jednu e-mailovou adresu (např. <code>hello@example.com</code> na <code>user@gmail.com</code>; tímto se automaticky přepošle i „hello+test@example.com“ na „user+test@gmail.com“):
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
Pokud přeposíláte více e-mailů, oddělte je čárkou:
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
Můžete mít nastaveno nekonečné množství přesměrovaných e-mailů – jen se ujistěte, že nepřekročíte 255 znaků v jednom řádku a každý řádek začínáte řetězcem „forward-email=". Příklad je uveden níže:
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
Ve svém záznamu <strong class="notranslate">TXT</strong> můžete také zadat název domény, abyste měli globální přesměrování aliasů (např. „user@example.com“ bude přesměrováno na „user@example.net“):
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
Webhooky můžete dokonce použít jako globální nebo individuální alias pro přeposílání e-mailů. Viz příklad a celou sekci o webhoocích s názvem <a href="#do-you-support-webhooks" class="alert-link">Podporujete webhooky</a> níže.
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
Můžete dokonce použít regulární výrazy („regex“) pro porovnávání aliasů a pro zpracování substitucí pro přeposílání e-mailů. Viz příklady a celou sekci o regulárních výrazech s názvem <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">Podporujete regulární výrazy nebo regex?</a> níže.
</span>
</div>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Potřebujete pokročilý regulární výraz se substitucí?</strong> Viz příklady a celou sekci o regulárních výrazech s názvem <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">Podporujete regulární výrazy nebo regex</a> níže.</div>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Jednoduchý příklad:</strong> Pokud chci, aby všechny e-maily odeslané na adresu `linus@example.com` nebo `torvalds@example.com` byly přeposílány na adresu `user@gmail.com`:
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
Pravidla pro přesměrování typu „catch-all“ lze také popsat jako „fall-through“.
To znamená, že místo pravidel „catch-all“ budou použity příchozí e-maily, které splňují alespoň jedno konkrétní pravidlo pro přesměrování. Mezi konkrétní pravidla patří e-mailové adresy a regulární výrazy.
<br /><br />
Například:
<br />
<code>forward-email=hello:first@gmail.com,second@gmail.com</code>
<br />
E-maily odeslané na adresu <code>hello@example.com</code> nebudou s touto konfigurací **ne** přeposílány na adresu <code>second@gmail.com</code> (catch-all), ale budou doručeny pouze na adresu <code>first@gmail.com</code>.
</span>
</div>

---

</li><li class="mb-2 mb-md-3 mb-lg-5">Na stránce správy DNS vašeho registrátora (druhá karta, kterou jste otevřeli) navíc nastavte následující záznam <strong class="notranslate">TXT</strong>:

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
Pokud používáte Gmail (např. Odeslat poštu jako) nebo G Suite, budete muset k výše uvedené hodnotě přidat <code>include:_spf.google.com</code>, například:
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
Pokud již máte podobný řádek s "v=spf1", budete muset přidat <code>include:spf.forwardemail.net</code> těsně před všechny existující záznamy "include:host.com" a před "-all" ve stejném řádku, například:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
<br /><br />
Upozorňujeme, že mezi "-all" a "~all" je rozdíl. "-" označuje, že kontrola SPF by měla SELHAT, pokud se neshoduje, a "~" označuje, že kontrola SPF by měla SELHAT. Doporučujeme použít přístup "-all", abyste zabránili padělání domény.

<br /><br />
Možná budete muset také zahrnout SPF záznam pro hostitele, ze kterého odesíláte poštu (např. Outlook).
</span>
</div>

</li><li class="mb-2 mb-md-3 mb-lg-5">Ověřte si své DNS záznamy pomocí našeho nástroje „Ověřit záznamy“, který je k dispozici v sekci <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Můj účet <i class="fa fa-angle-right"></i> Domény</a> <i class="fa fa-angle-right"></i> Nastavení.

</li><li class="mb-2 mb-md-3 mb-lg-5">Odešlete zkušební e-mail, abyste ověřili, zda to funguje. Upozorňujeme, že šíření záznamů DNS může nějakou dobu trvat.

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tip:
</strong>
<span>
</span>
Pokud nedostáváte testovací e-maily nebo obdržíte testovací e-mail s textem „S touto zprávou buďte opatrní“, podívejte se na odpovědi na otázky <a href="#why-am-i-not-receiving-my-test-emails" class="alert-link">Proč nedostávám testovací e-maily</a> a <a href="#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious" class="alert-link">Proč se mi testovací e-maily posílané v Gmailu zobrazují jako „podezřelé“</a>.
</div>

</li><li class="mb-2 mb-md-3 mb-lg-5">Pokud chcete z Gmailu „odesílat poštu jako“, budete si muset <strong><a href="https://www.youtube.com/watch?v=MEheS8gM4Xs" target="_blank" rel="noopener noreferrer">shlédnout toto video</a></strong> nebo postupovat podle kroků v části <a href="#how-to-send-mail-as-using-gmail">How pro odesílání pošty jako pomocí Gmailu</a> níže.

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
Volitelné doplňky jsou uvedeny níže. Upozorňujeme, že tyto doplňky jsou zcela volitelné a nemusí být nutné. Chtěli jsme vám alespoň poskytnout doplňující informace, pokud je to nutné.
</span>
</div>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Volitelný doplněk:
</strong>
<span>
Pokud používáte funkci <a class="alert-link" href="#how-to-send-mail-as-using-gmail">How pro odesílání pošty jako z Gmailu</a>, můžete se přidat na seznam povolených. Viz <a class="alert-link" href="https://support.google.com/a/answer/60752?hl=en" target="_blank" rel="noopener noreferrer">tyto pokyny od Gmailu</a> k tomuto tématu.
</span>
</div>

### Mohu pro pokročilé přesměrování použít více ústředen a serverů MX {#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding}

Ano, ale **v záznamech DNS byste měli mít uvedenou pouze jednu MX směnárnu**.

Nepokoušejte se používat „Prioritu“ jako způsob konfigurace více MX burz.

Místo toho je nutné nakonfigurovat vaši stávající ústřednu MX tak, aby přeposílala poštu pro všechny neshodné aliasy na ústředny naší služby (`mx1.forwardemail.net` a/nebo `mx2.forwardemail.net`).

Pokud používáte Google Workspace a chcete do naší služby přesměrovat všechny neshodné aliasy, podívejte se na <https://support.google.com/a/answer/6297084>.

Pokud používáte Microsoft 365 (Outlook) a chcete všechny neshodné aliasy přesměrovat do naší služby, podívejte se na <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/use-connectors-to-configure-mail-flow/set-up-connectors-to-route-mail> a <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/manage-mail-flow-for-multiple-locations>.

### Jak nastavím automatickou odpověď v době dovolené (mimo kancelář) {#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder}

Přejděte do sekce <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Můj účet <i class="fa fa-angle-right"></i> Domény</a> <i class="fa fa-angle-right"></i> Aliasy a buď vytvořte, nebo upravte alias, pro který chcete nakonfigurovat automatickou odpověď o nepřítomnosti.

Máte možnost nakonfigurovat datum zahájení, datum ukončení, předmět a zprávu a kdykoli je povolit nebo zakázat:

* Předmět a zpráva v prostém textu jsou aktuálně podporovány (interně používáme balíček `striptags` k odstranění HTML kódu).
* Předmět je omezen na 100 znaků. * Zpráva je omezena na 1000 znaků.
* Nastavení vyžaduje konfiguraci odchozího SMTP (např. budete muset nastavit záznamy DNKIM, DMARC a Return-Path).
* Přejděte do sekce <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Můj účet <i class="fa fa-angle-right"></i> Domény</a> <i class="fa fa-angle-right"></i> Nastavení <i class="fa fa-angle-right"></i> Konfigurace odchozího SMTP a postupujte podle pokynů k nastavení.
* Odpověď na dovolenou nelze povolit na globálních doménových jménech (např. [adresy na jedno použití](/disposable-addresses) nejsou podporovány).
* Odpověď na dovolenou nelze povolit pro aliasy se zástupnými znaky/záznamy typu catch-all (`*`) ani pro regulární výrazy.

Na rozdíl od poštovních systémů, jako je `postfix` (např. které používají rozšíření filtru dovolené `sieve`) – Forward Email automaticky přidává váš podpis DKIM, chrání před falešnými problémy s připojením při odesílání odpovědí o dovolené (např. kvůli běžným problémům s připojením SSL/TLS a starším serverům) a dokonce podporuje šifrování Open WKD a PGP pro odpovědi o dovolené.

<!--* Aby se zabránilo zneužití, bude za každou odeslanou zprávu odpovědi o nepřítomnosti odečten 1 kredit pro odchozí poštu SMTP.
* Všechny placené účty standardně zahrnují 300 kreditů denně. Pokud potřebujete větší částku, kontaktujte nás.
-->

1. Odesíláme pouze jednou za [povoleno](#do-you-have-an-allowlist) odesílatele každé 4 dny (což je podobné chování Gmailu).

* Naše Redis cache používá otisk `alias_id` a `sender`, kde `alias_id` je alias MongoDB ID a `sender` je buď adresa odesílatele (pokud je na seznamu povolených), nebo kořenová doména v adrese odesílatele (pokud není na seznamu povolených). Pro zjednodušení je platnost tohoto otisku v cache nastavena na 4 dny.

* Náš přístup využívající kořenovou doménu analyzovanou v adrese odesílatele pro odesílatele, kteří nejsou na seznamu povolených, zabraňuje zneužití ze strany relativně neznámých odesílatelů (např. škodlivých aktérů) zahlcováním zpráv odpovědí v nepřítomnosti.

2. Zprávy odesíláme pouze tehdy, pokud pole OD a/nebo Od není prázdné a neobsahuje (bez rozlišování velkých a malých písmen) __CHRÁNĚNÝ_LINK_1039__ (část před znakem @ v e-mailu).

3. Neodesíláme, pokud původní zpráva obsahovala některou z následujících hlaviček (bez rozlišování velkých a malých písmen):

* Záhlaví `auto-submitted` s hodnotou odlišnou od `no`. * Záhlaví `x-auto-response-suppress` s hodnotou `dr`, `autoreply`, `auto-reply`, `auto_reply` nebo `all`
* Záhlaví `list-id`, `list-subscribe`, `list-unsubscribe`, `list-help`, `list-post`, `list-owner`, `list-archive`, `x-autoreply`, `x-autorespond` nebo `x-auto-respond` (bez ohledu na hodnotu).
* Záhlaví `precedence` s hodnotou `bulk`, `autoreply`, `auto-reply`, `auto_reply` nebo `list`.

4. Zprávy neodesíláme, pokud e-mailová adresa odesílatele nebo e-mailová adresa odesílatele končí kódy `+donotreply`, `-donotreply`, `+noreply` nebo `-noreply`.

5. Neodesíláme, pokud část uživatelského jména v e-mailové adrese odesílatele byla `mdaemon` a obsahovala hlavičku `X-MDDSN-Message`, která nerozlišovala velká a malá písmena.

6. Neodesíláme, pokud se v záhlaví `content-type` nerozlišují velká a malá písmena.

### Jak nastavím SPF pro přeposílání e-mailů {#how-do-i-set-up-spf-for-forward-email}

Na stránce správy DNS vašeho registrátora nastavte následující záznam <strong class="notranslate">TXT</strong>:

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
Pokud používáte Gmail (např. Odeslat poštu jako) nebo G Suite, budete muset k výše uvedené hodnotě přidat <code>include:_spf.google.com</code>, například:
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
Pokud používáte Microsoft Outlook nebo Live.com, budete muset do svého TXT záznamu SPF přidat řetězec <code>include:spf.protection.outlook.com</code>, například:
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
Pokud již máte podobný řádek s "v=spf1", budete muset přidat <code>include:spf.forwardemail.net</code> těsně před všechny existující záznamy "include:host.com" a před "-all" ve stejném řádku, například:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
<br /><br />
Upozorňujeme, že mezi "-all" a "~all" je rozdíl. "-" označuje, že kontrola SPF by měla SELHAT, pokud se neshoduje, a "~" označuje, že kontrola SPF by měla SELHAT. Doporučujeme použít přístup "-all", abyste zabránili padělání domény.

<br /><br />
Možná budete muset také zahrnout SPF záznam pro hostitele, ze kterého odesíláte poštu (např. Outlook).
</span>
</div>

### Jak nastavím DKIM pro přeposílání e-mailů {#how-do-i-set-up-dkim-for-forward-email}

Přejděte do sekce <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Můj účet <i class="fa fa-angle-right"></i> Domény</a> <i class="fa fa-angle-right"></i> Nastavení <i class="fa fa-angle-right"></i> Konfigurace odchozího SMTP a postupujte podle pokynů k nastavení.

### Jak nastavím DMARC pro přeposílání e-mailů {#how-do-i-set-up-dmarc-for-forward-email}

Přejděte do sekce <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Můj účet <i class="fa fa-angle-right"></i> Domény</a> <i class="fa fa-angle-right"></i> Nastavení <i class="fa fa-angle-right"></i> Konfigurace odchozího SMTP a postupujte podle pokynů k nastavení.

### Jak se připojím a nakonfiguruji své kontakty {#how-do-i-connect-and-configure-my-contacts}

**Pro konfiguraci kontaktů použijte URL adresu CardDAV:** `https://carddav.forwardemail.net` (nebo jednoduše `carddav.forwardemail.net`, pokud to váš klient umožňuje)

### Jak se připojím a nakonfiguruji své kalendáře {#how-do-i-connect-and-configure-my-calendars}

**Pro konfiguraci kalendáře použijte URL adresu CalDAV:** `https://caldav.forwardemail.net` (nebo jednoduše `caldav.forwardemail.net`, pokud to váš klient umožňuje)**

<img width="612" height="520" src="/img/faq/calendar-setup.png" alt="Příklad nastavení přeposílání e-mailů v kalendáři CalDAV v Thunderbirdu" />

### Jak přidám další kalendáře a spravuji stávající kalendáře {#how-do-i-add-more-calendars-and-manage-existing-calendars}

Pokud chcete přidat další kalendáře, stačí přidat novou URL adresu kalendáře: `https://caldav.forwardemail.net/dav/principals/calendar-name` (**nezapomeňte nahradit `calendar-name` požadovaným názvem kalendáře**)

Název a barvu kalendáře můžete po vytvoření změnit – stačí použít preferovanou aplikaci kalendáře (např. Apple Mail nebo [Thunderbird](https://thunderbird.net)).

### Jak nastavím SRS pro přeposílání e-mailů {#how-do-i-set-up-srs-for-forward-email}

Automaticky konfigurujeme [Schéma přepisování odesílatele](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme) („SRS“) – nemusíte to dělat sami.

### Jak nastavím MTA-STS pro přeposílání e-mailů {#how-do-i-set-up-mta-sts-for-forward-email}

Pro více informací se prosím podívejte na [naše sekce o MTA-STS](#do-you-support-mta-sts).

### Jak přidám profilový obrázek k mé e-mailové adrese {#how-do-i-add-a-profile-picture-to-my-email-address}

Pokud používáte Gmail, postupujte takto:

1. Přejděte na <https://google.com> a odhlaste se ze všech e-mailových účtů.
2. Klikněte na „Přihlásit se“ a v rozbalovací nabídce klikněte na „jiný účet“.
3. Vyberte „Použít jiný účet“.
4. Vyberte „Vytvořit účet“.
5. Vyberte „Použít místo toho mou aktuální e-mailovou adresu“.
6. Zadejte e-mailovou adresu s vaší vlastní doménou.
7. Získejte ověřovací e-mail odeslaný na vaši e-mailovou adresu.
8. Zadejte ověřovací kód z tohoto e-mailu.
9. Vyplňte informace o profilu pro váš nový účet Google.
10. Souhlasíte se všemi zásadami ochrany osobních údajů a podmínkami použití.
11. Přejděte na <https://google.com> a v pravém horním rohu klikněte na ikonu svého profilu a poté na tlačítko „změnit“.
12. Nahrajte novou fotografii nebo avatara pro váš účet.
13. Změny se projeví přibližně za 1–2 hodiny, ale někdy to může být velmi rychlé.
14. Odešlete zkušební e-mail a měla by se zobrazit profilová fotografie.

## Pokročilé funkce {#advanced-features}

### Podporujete zasílání newsletterů nebo e-mailových adres pro marketingové e-maily {#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email}?

Ano, více si můžete přečíst na <https://forwardemail.net/guides/newsletter-with-listmonk>.

Vezměte prosím na vědomí, že z důvodu zachování reputace IP adresy a zajištění doručitelnosti má Forward Email manuální proces kontroly **schválení newsletteru** pro každou doménu. Pro schválení pošlete e-mail na adresu <support@forwardemail.net> nebo otevřete [žádost o pomoc](https://forwardemail.net/help). To obvykle trvá méně než 24 hodin, přičemž většina žádostí je vyřízena do 1–2 hodin. V blízké budoucnosti se snažíme tento proces zefektivnit a přidat další kontroly spamu a upozornění. Tento proces zajišťuje, že se vaše e-maily dostanou do doručené pošty a vaše zprávy nebudou označeny jako spam.

### Podporujete odesílání e-mailů pomocí API {#do-you-support-sending-email-with-api}?

Ano, od května 2023 podporujeme odesílání e-mailů s API jako doplněk pro všechny platící uživatele.

<div class="alert my-3 alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Důležité:
</strong>
<span>
Ujistěte se, že jste si přečetli naše <a href="/terms" class="alert-link" target="_blank">Podmínky</a>, <a href="/privacy" class="alert-link" target="_blank">Zásady ochrany osobních údajů</a> a <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Limity odchozí SMTP</a> – vaše použití je považováno za potvrzení a souhlas.
</span>
</div>

Pro více informací si prosím prohlédněte sekci o [e-maily](/email-api#outbound-emails) v dokumentaci k API.

Abyste mohli odesílat odchozí e-maily pomocí našeho API, musíte použít svůj token API dostupný pod [Moje bezpečnost](/my-account/security).

### Podporujete příjem e-mailů přes IMAP {#do-you-support-receiving-email-with-imap}?

Ano, od 16. října 2023 podporujeme příjem e-mailů přes protokol IMAP jako doplněk pro všechny platící uživatele. **Přečtěte si prosím náš podrobný článek** o [jak funguje naše funkce úložiště šifrovaných schránek SQLite](/blog/docs/best-quantum-safe-encrypted-email-service).

<div id="imap-instructions">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Důležité:
</strong>
<span>
Ujistěte se, že jste si přečetli naše <a href="/terms" class="alert-link" target="_blank">Podmínky</a> a <a href="/privacy" class="alert-link" target="_blank">Zásady ochrany osobních údajů</a> – vaše použití je považováno za potvrzení a souhlas.
</span>
</div>

1. Vytvořte nový alias pro svou doménu v sekci <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Můj účet <i class="fa fa-angle-right"></i> Domény</a> <i class="fa fa-angle-right"></i> Aliasy (např. <code><hello@example.com></code>)

2. Klikněte na <strong class="text-success"><i class="fa fa-key"></i>Generovat heslo</strong> vedle nově vytvořeného aliasu. Zkopírujte do schránky a bezpečně uložte vygenerované heslo zobrazené na obrazovce.

3. Pomocí preferované e-mailové aplikace přidejte nebo nakonfigurujte účet s nově vytvořeným aliasem (např. <code><hello@example.com></code>)
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tip:
</strong>
<span>Doporučujeme používat <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a> nebo <a href="/blog/open-source" class="alert-link" target="_blank">alternativa s otevřeným zdrojovým kódem a zaměřená na soukromí</a>.</span>
</div>

4. Po zobrazení výzvy k zadání názvu serveru IMAP zadejte `imap.forwardemail.net`

5. Po zobrazení výzvy k zadání portu serveru IMAP zadejte `993` (SSL/TLS) – v případě potřeby viz [alternativní porty IMAP](/faq#what-are-your-imap-server-configuration-settings)
<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tip:
</strong>
<span>Pokud používáte Thunderbird, ujistěte se, že je „Zabezpečení připojení“ nastaveno na „SSL/TLS“ a metoda ověřování je nastavena na „Normální heslo“.</span>
</div>

6. Po zobrazení výzvy k zadání hesla k serveru IMAP vložte heslo z kroku 2 výše, které je uvedeno v části <strong class="text-success"><i class="fa fa-key"></i>Generovat heslo</strong>.

7. **Uložte si nastavení** – pokud máte problémy, <a href="/help">kontaktujte nás</a>

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

Ano, od 4. prosince 2023 podporujeme [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol) jako doplněk pro všechny platící uživatele. **Přečtěte si prosím náš podrobný článek** o [jak funguje naše funkce úložiště šifrovaných schránek SQLite](/blog/docs/best-quantum-safe-encrypted-email-service).

<div id="pop3-instructions">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Důležité:
</strong>
<span>
Ujistěte se, že jste si přečetli naše <a href="/terms" class="alert-link" target="_blank">Podmínky</a> a <a href="/privacy" class="alert-link" target="_blank">Zásady ochrany osobních údajů</a> – vaše použití je považováno za potvrzení a souhlas.
</span>
</div>

1. Vytvořte nový alias pro svou doménu v sekci <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Můj účet <i class="fa fa-angle-right"></i> Domény</a> <i class="fa fa-angle-right"></i> Aliasy (např. <code><hello@example.com></code>)

2. Klikněte na <strong class="text-success"><i class="fa fa-key"></i>Generovat heslo</strong> vedle nově vytvořeného aliasu. Zkopírujte do schránky a bezpečně uložte vygenerované heslo zobrazené na obrazovce.

3. Pomocí preferované e-mailové aplikace přidejte nebo nakonfigurujte účet s nově vytvořeným aliasem (např. <code><hello@example.com></code>)
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tip:
</strong>
<span>Doporučujeme používat <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a> nebo <a href="/blog/open-source" class="alert-link" target="_blank">alternativa s otevřeným zdrojovým kódem a zaměřená na soukromí</a>.</span>
</div>

4. Po zobrazení výzvy k zadání názvu serveru POP3 zadejte `pop3.forwardemail.net`

5. Po zobrazení výzvy k zadání portu serveru POP3 zadejte `995` (SSL/TLS) – v případě potřeby viz [alternativní porty POP3](/faq#what-are-your-pop3-server-configuration-settings)
<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tip:
</strong>
<span>Pokud používáte Thunderbird, ujistěte se, že je „Zabezpečení připojení“ nastaveno na „SSL/TLS“ a metoda ověřování je nastavena na „Normální heslo“.</span>
</div>

6. Po zobrazení výzvy k zadání hesla k serveru POP3 vložte heslo z kroku 2 výše, které je uvedeno v části <strong class="text-success"><i class="fa fa-key"></i>Generovat heslo</strong>.

7. **Uložte si nastavení** – pokud máte problémy, <a href="/help">kontaktujte nás</a>

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

Podporuje IPv4 i IPv6 a je k dispozici přes port `443` (HTTPS).

| Přihlášení | Příklad | Popis |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Uživatelské jméno | `user@example.com` | E-mailová adresa aliasu, který pro doménu existuje v sekci <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Můj účet <i class="fa fa-angle-right"></i> Domény</a>. |
| Heslo | `************************` | Vygenerované heslo pro konkrétní alias. |

Aby bylo možné používat podporu kalendáře, musí být **uživatel** e-mailová adresa aliasu, který pro doménu existuje v sekci <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Můj účet <i class="fa fa-angle-right"></i></i></a> Domény – a **heslo** musí být heslo vygenerované pro daný alias.

### Podporujete kontakty (CardDAV) {#do-you-support-contacts-carddav}

Ano, od 12. června 2025 jsme tuto funkci přidali. Náš server je `carddav.forwardemail.net` a je také monitorován na naší <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">stavové stránce</a>.

Podporuje IPv4 i IPv6 a je k dispozici přes port `443` (HTTPS).

| Přihlášení | Příklad | Popis |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Uživatelské jméno | `user@example.com` | E-mailová adresa aliasu, který pro doménu existuje v sekci <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Můj účet <i class="fa fa-angle-right"></i> Domény</a>. |
| Heslo | `************************` | Vygenerované heslo pro konkrétní alias. |

Aby bylo možné používat podporu kontaktů, musí být **uživatel** e-mailová adresa aliasu, který pro doménu existuje v sekci <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Můj účet <i class="fa fa-angle-right"></i></i></a> Domény – a **heslo** musí být heslo vygenerované pro daný alias.

### Podporujete odesílání e-mailů přes SMTP {#do-you-support-sending-email-with-smtp}?

Ano, od května 2023 podporujeme odesílání e-mailů s SMTP jako doplněk pro všechny platící uživatele.

<div id="smtp-instructions">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Důležité:
</strong>
<span>
Ujistěte se, že jste si přečetli naše <a href="/terms" class="alert-link" target="_blank">Podmínky</a>, <a href="/privacy" class="alert-link" target="_blank">Zásady ochrany osobních údajů</a> a <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Limity odchozí SMTP</a> – vaše použití je považováno za potvrzení a souhlas.
</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Důležité:
</strong>
<span>
Pokud používáte Gmail, přečtěte si naši <a class="alert-link" href="/guides/send-mail-as-gmail-custom-domain">příručku Odesílání pošty jako v Gmailu</a>. Pokud jste vývojář, přečtěte si naši <a class="alert-link" href="/email-api#outbound-emails" target="_blank">dokumentaci k e-mailovému API</a>.
</span>
</div>

1. Přejděte do sekce <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Můj účet <i class="fa fa-angle-right"></i> Domény</a> <i class="fa fa-angle-right"></i> Nastavení <i class="fa fa-angle-right"></i> Konfigurace odchozího SMTP a postupujte podle pokynů k nastavení.

2. Vytvořte nový alias pro svou doménu v sekci <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Můj účet <i class="fa fa-angle-right"></i> Domény</a> <i class="fa fa-angle-right"></i> Aliasy (např. <code><hello@example.com></code>)

3. Klikněte na <strong class="text-success"><i class="fa fa-key"></i>Generovat heslo</strong> vedle nově vytvořeného aliasu. Zkopírujte do schránky a bezpečně uložte vygenerované heslo zobrazené na obrazovce.

4. Pomocí preferované e-mailové aplikace přidejte nebo nakonfigurujte účet s nově vytvořeným aliasem (např. <code><hello@example.com></code>)
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tip:
</strong>
<span>Doporučujeme používat <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a> nebo <a href="/blog/open-source" class="alert-link" target="_blank">alternativa s otevřeným zdrojovým kódem a zaměřená na soukromí</a>.</span>
</div>

5. Po zobrazení výzvy k zadání názvu serveru SMTP zadejte `smtp.forwardemail.net`

6. Po zobrazení výzvy k zadání portu serveru SMTP zadejte `465` (SSL/TLS) – v případě potřeby viz [alternativní porty SMTP](/faq#what-are-your-smtp-server-configuration-settings)
<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tip:
</strong>
<span>Pokud používáte Thunderbird, ujistěte se, že je „Zabezpečení připojení“ nastaveno na „SSL/TLS“ a metoda ověřování je nastavena na „Normální heslo“.</span>
</div>

7. Po zobrazení výzvy k zadání hesla k serveru SMTP vložte heslo z kroku 3 výše, který je uveden v části <strong class="text-success"><i class="fa fa-key"></i>Generovat heslo</strong>.

8. **Uložte nastavení a odešlete první zkušební e-mail** – pokud máte problémy, <a href="/help">kontaktujte nás</a>

<div class="alert my-3 alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Důležité:
</strong>
<span>
Upozorňujeme, že abychom si zachovali reputaci IP adresy a zajistili doručitelnost, používáme manuální proces kontroly schválení odchozích SMTP zpráv pro každou doménu. Obvykle to trvá méně než 24 hodin a většina požadavků je vyřízena do 1–2 hodin. V blízké budoucnosti se snažíme tento proces zefektivnit a upozornit na spam. Tento proces zajišťuje, že se vaše e-maily dostanou do doručené pošty a vaše zprávy nebudou označeny jako spam.
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

### Podporujete OpenPGP/MIME, end-to-end šifrování („E2EE“) a webový adresář klíčů („WKD“) {#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd}

Ano, podporujeme [OpenPGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy#OpenPGP), [end-to-end šifrování ("E2EE")](https://en.wikipedia.org/wiki/End-to-end_encryption) a vyhledávání veřejných klíčů pomocí [Webový klíčový adresář ("WKD")](https://wiki.gnupg.org/WKD). OpenPGP můžete nakonfigurovat pomocí [keys.openpgp.org](https://keys.openpgp.org/about/usage#wkd-as-a-service) nebo [self-host své vlastní klíče](https://wiki.gnupg.org/WKDHosting) (viz [tato podstata pro nastavení serveru WKD](https://gist.github.com/kafene/0a6e259996862d35845784e6e5dbfc79)).

* Vyhledávání WKD jsou ukládána do mezipaměti po dobu 1 hodiny, aby bylo zajištěno včasné doručení e-mailů → Pokud tedy přidáte, změníte nebo odeberete svůj klíč WKD, napište nám prosím e-mail na adresu `support@forwardemail.net` se svou e-mailovou adresou, abychom mohli mezipaměť ručně vymazat.
* Podporujeme šifrování PGP pro zprávy, které jsou přeposílány prostřednictvím vyhledávání WKD nebo pomocí nahraného klíče PGP v našem rozhraní. * Nahrané klíče mají přednost, pokud je zaškrtnuto/povoleno políčko PGP.
* Zprávy odesílané na webhooky aktuálně nejsou šifrovány pomocí PGP.
* Pokud máte více aliasů, které odpovídají dané adrese pro přeposílání (např. regex/wildcard/exact combo) a pokud více než jeden z nich obsahuje nahraný klíč PGP a má zaškrtnuté políčko PGP → pak vám zašleme e-mail s upozorněním na chybu a zprávu nebudeme šifrovat pomocí vašeho nahraného klíče PGP. Toto je velmi vzácné a obvykle se týká pouze pokročilých uživatelů se složitými pravidly pro aliasy.
* **Šifrování PGP se nepoužije na přeposílání e-mailů přes naše MX servery, pokud odesílatel používal politiku odmítnutí DMARC. Pokud požadujete šifrování PGP pro *veškerou* poštu, doporučujeme použít naši službu IMAP a nakonfigurovat klíč PGP pro váš alias pro příchozí poštu.**

Nastavení adresáře webových klíčů můžete ověřit na adrese <https://wkd.chimbosonic.com/> (open source) nebo <https://www.webkeydirectory.com/> (proprietární).**

<div class="alert my-3 alert-success">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Automatické šifrování:
</strong>
<span>Pokud používáte naši <a href="#do-you-support-sending-email-with-smtp" class="alert-link">odchozí SMTP službu</a> a odesíláte nešifrované zprávy, automaticky se pokusíme zašifrovat zprávy pro každého příjemce pomocí <a class="alert-link" href="https://wiki.gnupg.org/WKD">Web adresáře klíčů („WKD“)</a>.</span>
</div>

<div class="alert alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Důležité:
</strong>
<span>
Chcete-li povolit OpenPGP pro váš vlastní název domény, musíte provést všechny následující kroky.
</span>
</div>

1. Stáhněte a nainstalujte níže doporučený plugin vašeho e-mailového klienta:

| E-mailový klient | Platforma | Doporučený plugin | Poznámky |
| --------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Thunderbird | Desktop | [Configure OpenPGP in Thunderbird](https://support.mozilla.org/en-US/kb/openpgp-thunderbird-howto-and-faq#w_i-have-never-used-openpgp-with-thunderbird-before-how-do-i-setup-openpgp) | Thunderbird má vestavěnou podporu pro OpenPGP. |
| Gmail | Prohlížeč | [Mailvelope](https://mailvelope.com/) nebo [FlowCrypt](https://flowcrypt.com/download) (vlastní licence) | Gmail nepodporuje OpenPGP, ale můžete si stáhnout plugin s otevřeným zdrojovým kódem [Mailvelope](https://mailvelope.com/) nebo [FlowCrypt](https://flowcrypt.com/download). |
| Apple Mail | macOS | [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation) | Apple Mail nepodporuje OpenPGP, ale můžete si stáhnout open-source plugin [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation). |
| Apple Mail | iOS | [PGPro](https://github.com/opensourceios/PGPro/) nebo [FlowCrypt](https://apps.apple.com/us/app/flowcrypt-encrypted-email/id1591754995) (vlastní licence) | Apple Mail nepodporuje OpenPGP, ale můžete si stáhnout open-source plugin [PGPro](https://github.com/opensourceios/PGPro/) nebo [FlowCrypt](https://flowcrypt.com/download). |
| Výhled | Windows | [gpg4win](https://www.gpg4win.de/index.html) | Poštovní klient Outlooku pro stolní počítače nepodporuje OpenPGP, ale můžete si stáhnout plugin s otevřeným zdrojovým kódem [gpg4win](https://www.gpg4win.de/index.html). |
| Výhled | Prohlížeč | [Mailvelope](https://mailvelope.com/) nebo [FlowCrypt](https://flowcrypt.com/download) (vlastní licence) | Webový poštovní klient Outlooku nepodporuje OpenPGP, ale můžete si stáhnout plugin s otevřeným zdrojovým kódem [Mailvelope](https://mailvelope.com/) nebo [FlowCrypt](https://flowcrypt.com/download). |
| Android | Mobilní | [OpenKeychain](https://www.openkeychain.org/) nebo [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email) | Pluginy [Android mail clients](/blog/open-source/android-email-clients), například [Thunderbird Mobile](https://www.thunderbird.net/en-US/mobile/) a [FairEmail](https://github.com/M66B/FairEmail), podporují open-source plugin [OpenKeychain](https://www.openkeychain.org/). Alternativně můžete použít open-source (proprietární licenci) plugin [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email). |
| Google Chrome | Prohlížeč | [Mailvelope](https://mailvelope.com/) nebo [FlowCrypt](https://flowcrypt.com/download) (vlastní licence) | Můžete si stáhnout open-source rozšíření prohlížeče [Mailvelope](https://mailvelope.com/) nebo [FlowCrypt](https://flowcrypt.com/download). |
| Mozilla Firefox | Prohlížeč | [Mailvelope](https://mailvelope.com/) nebo [FlowCrypt](https://flowcrypt.com/download) (vlastní licence) | Můžete si stáhnout open-source rozšíření prohlížeče [Mailvelope](https://mailvelope.com/) nebo [FlowCrypt](https://flowcrypt.com/download). |
| Microsoft Edge | Prohlížeč | [Mailvelope](https://mailvelope.com/) | Můžete si stáhnout open-source rozšíření prohlížeče [Mailvelope](https://mailvelope.com/). |
| Statečný | Prohlížeč | [Mailvelope](https://mailvelope.com/) nebo [FlowCrypt](https://flowcrypt.com/download) (vlastní licence) | Můžete si stáhnout open-source rozšíření prohlížeče [Mailvelope](https://mailvelope.com/) nebo [FlowCrypt](https://flowcrypt.com/download). |
| Balsa | Desktop | [Configure OpenPGP in Balsa](https://www.mynetcologne.de/~nc-dreszal/balsa/balsa23-secure-mail.html#USING) | Balsa má vestavěnou podporu pro OpenPGP. |
| KMail | Desktop | [Configure OpenPGP in KMail](https://userbase.kde.org/KMail/PGP_MIME) | KMail má vestavěnou podporu pro OpenPGP. |
| Evoluce GNOME | Desktop | [Configure OpenPGP in Evolution](https://help.gnome.org/users/evolution/stable/mail-encryption.html.en) | GNOME Evolution má vestavěnou podporu pro OpenPGP. |
| Terminál | Desktop | [Configure gpg in Terminal](https://docs.github.com/en/authentication/managing-commit-signature-verification/generating-a-new-gpg-key#generating-a-gpg-key) | K vygenerování nového klíče z příkazového řádku můžete použít open-source [gpg command line tool](https://www.gnupg.org/download/). |

2. Otevřete plugin, vytvořte si veřejný klíč a nakonfigurujte si e-mailového klienta tak, aby ho používal.

3. Nahrajte svůj veřejný klíč na <https://keys.openpgp.org/upload>.

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tip:
</strong>
<span>Svůj klíč můžete v budoucnu spravovat na adrese <a class="alert-link" href="https://keys.openpgp.org/manage">https://keys.openpgp.org/manage</a>".</span>
</div>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Volitelný doplněk:
</strong>
<span>
Pokud používáte naši službu <a class="alert-link" href="/blog/docs/best-quantum-safe-encrypted-email-service">šifrovaného úložiště (IMAP/POP3)</a> a chcete, aby <i>všechny</i> e-maily uložené ve vaší (již zašifrované) databázi SQLite byly šifrovány vaším veřejným klíčem, přejděte do sekce <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Můj účet <i class="fa fa-angle-right"></i> Domény</a> <i class="fa fa-angle-right"></i> Aliasy (např. <code>hello@example.com</code>) <i class="fa fa-angle-right"></i> Upravte <i class="fa fa-angle-right"></i> OpenPGP a nahrajte svůj veřejný klíč.
</span>
</div>

4. Přidejte k názvu vaší domény nový záznam `CNAME` (např. `example.com`):

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
<span>Pokud váš alias používá naše <a class="alert-link" href="/disposable-addresses" target="_blank">domény pro jednorázové použití</a> (např. <code>hideaddress.net</code>), můžete tento krok přeskočit.</span>
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

### Podporujete MTA-STS {#do-you-support-mta-sts}?

Ano, od 2. března 2023 podporujeme [MTA-STS](https://www.hardenize.com/blog/mta-sts). Pokud si přejete povolit [tuto šablonu](https://github.com/jpawlowski/mta-sts.template) ve své doméně, můžete použít __PROTECTED_LINK_1059__.

Naši konfiguraci lze veřejně nalézt na GitHubu na adrese <https://github.com/forwardemail/mta-sts.forwardemail.net>.

### Podporujete přístupové klíče a WebAuthn {#do-you-support-passkeys-and-webauthn}

Ano! Od 13. prosince 2023 jsme přidali podporu pro přístupové klíče [kvůli vysoké poptávce](https://github.com/orgs/forwardemail/discussions/182).

Přístupové klíče umožňují bezpečné přihlášení bez nutnosti zadání hesla a dvoufaktorové autentizace.

Svou identitu můžete ověřit dotykem, rozpoznáním obličeje, heslem na zařízení nebo PIN.

Umožňujeme vám spravovat až 30 přístupových klíčů najednou, takže se můžete snadno přihlásit do všech svých zařízení.

Další informace o přístupových klíčích naleznete na následujících odkazech:

* __CHRÁNĚNÝ_LINK_1061__ (Google)
* __CHRÁNĚNÝ_LINK_1062__ (Apple)
* __CHRÁNĚNÝ_LINK_1063__)

### Podporujete osvědčené postupy pro e-maily {#do-you-support-email-best-practices}

Ano. Máme vestavěnou podporu pro SPF, DKIM, DMARC, ARC a SRS napříč všemi plány. Také jsme intenzivně spolupracovali s původními autory těchto specifikací a dalšími odborníky na e-mail, abychom zajistili dokonalost a vysokou doručitelnost.

### Podporujete bounce webhooky {#do-you-support-bounce-webhooks}?

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tip:
</strong>
Hledáte dokumentaci k e-mailovým webhookům? Více informací naleznete v článku <a href="/faq#do-you-support-webhooks" class="alert-link">Podporujete webhooky?</a>.
<span>
</span>
</div>

Ano, od 14. srpna 2024 jsme tuto funkci přidali. Nyní můžete přejít do sekce Můj účet → Domény → Nastavení → URL adresa webhooku pro odmítnutí a nakonfigurovat URL adresu `http://` nebo `https://`, na kterou budeme odesílat požadavek `POST` vždy, když se odchozí SMTP e-maily odmítnou.

To je užitečné pro správu a sledování vašeho odchozího SMTP – a může být použito k udržování předplatitelů, odhlašování a zjišťování, kdykoli dojde k nedoručení.

Užitná zatížení webhooku Bounce se odesílají jako JSON s těmito vlastnostmi:

* `email_id` (Řetězec) - ID e-mailu, které odpovídá e-mailu v sekci Můj účet → E-maily (odchozí SMTP)
* `list_id` (Řetězec) - hodnota záhlaví `List-ID` (nerozlišuje velká a malá písmena), pokud existuje, z původního odchozího e-mailu
* `list_unsubscribe` (Řetězec) - hodnota záhlaví `List-Unsubscribe` (nerozlišuje velká a malá písmena), pokud existuje, z původního odchozího e-mailu
* `feedback_id` (Řetězec) - hodnota záhlaví `Feedback-ID` (nerozlišuje velká a malá písmena), pokud existuje, z původního odchozího e-mailu
* `recipient` (Řetězec) - e-mailová adresa příjemce, který byl vrácen nebo chybně odeslán
* `message` (Řetězec) - podrobná chybová zpráva o nedoručení
* `response` (Řetězec) - odpověď SMTP
* `response_code` (Číslo) - analyzovaný kód odpovědi SMTP
* `truth_source` (Řetězec) - pokud kód odpovědi pocházel z důvěryhodného zdroje, bude tato hodnota naplněna názvem kořenové domény (např. `google.com` nebo `yahoo.com`)
* `bounce` (Objekt) - objekt obsahující následující vlastnosti, které podrobně popisují stav nedoručení a odmítnutí
* `action` (Řetězec) - akce nedoručení (např. `"reject"`)
* `message` (Řetězec) - důvod odražení (např. `"Message Sender Blocked By Receiving Server"`)
* `category` (Řetězec) - kategorie odražení (např. `"block"`)
* `code` (Číslo) - kód stavu odražení (např. `554`)
* `status` (Řetězec) - kód odražení z odpovědi (např. `5.7.1`)
* `line` (Číslo) - číslo analyzovaného řádku, pokud existuje, [z Zone-MTA bounce parse seznamu](https://github.com/zone-eu/zone-mta/blob/master/config/bounces.txt) (např. `526`)
* `headers` (Objekt) – dvojice klíč-hodnota záhlaví pro odchozí e-mail
* `bounced_at` (Řetězec) – [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601) formátované datum, kdy došlo k chybě nedoručení

Například:

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

Zde je několik dalších poznámek týkajících se webhooků s nedoručením:

* Pokud datová část webhooku obsahuje hodnotu `list_id`, `list_unsubscribe` nebo `feedback_id`, měli byste v případě potřeby podniknout příslušné kroky k odstranění `recipient` ze seznamu.
* Pokud byla hodnota `bounce.category` jedna `"block"`, `"recipient"`, `"spam"` nebo `"virus"`, měli byste uživatele ze seznamu rozhodně odstranit.
* Pokud potřebujete ověřit obsah webhooku (abyste se ujistili, že skutečně pochází z našeho serveru), můžete použít [vyřešit IP adresu vzdáleného klienta název hostitele klienta pomocí zpětného vyhledávání](https://nodejs.org/api/dns.html#dnspromisesreverseip) – mělo by to být `smtp.forwardemail.net`. * Můžete také zkontrolovat IP adresu oproti [naše zveřejněné IP adresy](#what-are-your-servers-ip-addresses). * Přejděte do sekce Můj účet → Domény → Nastavení → Ověřovací klíč podpisu webhooku a získejte svůj klíč webhooku. * Tento klíč můžete z bezpečnostních důvodů kdykoli směnit. * Vypočítejte a porovnejte hodnotu `X-Webhook-Signature` z našeho požadavku webhooku s vypočítanou hodnotou těla pomocí tohoto klíče. Příklad, jak to provést, je k dispozici na adrese [tento příspěvek Stack Overflow](https://stackoverflow.com/a/68885281). * Další informace naleznete v diskusi na adrese <https://github.com/forwardemail/free-email-forwarding/issues/235>.
* Na odpověď vašeho webhooku s kódem stavu `5` sekund počkáme až `200` a pokus opakujeme až `1`krát.
* Pokud při pokusu o odeslání požadavku na vaši adresu URL webhooku pro odesílání zpráv zjistíme chybu, jednou týdně vám zašleme e-mail s upozorněním.

### Podporujete webhooky {#do-you-support-webhooks}

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tip:
</strong>
Hledáte dokumentaci k bounce webhookům? Více informací naleznete v článku <a href="/faq#do-you-support-bounce-webhooks" class="alert-link">Podporujete bounce webhooky?</a>.
<span>
</span>
</div>

Ano, od 15. května 2020 jsme tuto funkci přidali.  Můžete jednoduše přidat webhook(y) přesně jako u kteréhokoli příjemce!  Ujistěte se, že máte v adrese URL webhooku předponu „http“ nebo „https“.

<div class="alert my-3 alert-danger">
<i class="fa fa-stop-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Vylepšená ochrana soukromí:
</strong>
<span>
Pokud máte placený tarif (který nabízí vylepšenou ochranu soukromí), přejděte prosím do sekce <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Můj účet <i class="fa fa-angle-right"></i> Domény</a> a klikněte na „Aliasy“ vedle vaší domény pro konfiguraci webhooků. Pokud se chcete dozvědět více o placených tarifech, podívejte se na naši stránku <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Ceník</a>. Jinak můžete pokračovat podle níže uvedených pokynů.
</span>
</div>

Pokud máte bezplatný plán, jednoduše přidejte nový DNS záznam <strong class="notranslate">TXT</strong>, jak je uvedeno níže:

Například pokud chci, aby všechny e-maily odeslané na adresu `alias@example.com` byly přeposílány na nový testovací endpoint [poptávkový koš](https://requestbin.com/r/en8pfhdgcculn?inspect):

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
<td><code>forward-email=alias:https://requestbin.com/r/en8pfhdgcculn</code></td>
</tr>
</tbody>
</table>

Nebo chcete, aby všechny e-maily směřující na adresu `example.com` byly přeposílány na tento koncový bod:

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
<td><code>forward-email=https://requestbin.com/r/en8pfhdgcculn</code></td>
</tr>
</tbody>
</table>

**Zde jsou další poznámky týkající se webhooků:**

* Pokud potřebujete ověřit obsah webhooku (abyste se ujistili, že skutečně pochází z našeho serveru), můžete použít [vyřešit IP adresu vzdáleného klienta název hostitele klienta pomocí zpětného vyhledávání](https://nodejs.org/api/dns.html#dnspromisesreverseip) – mělo by to být buď `mx1.forwardemail.net` nebo `mx2.forwardemail.net`.
* Můžete také zkontrolovat IP adresu oproti [naše zveřejněné IP adresy](#what-are-your-servers-ip-addresses).
* Pokud máte placený tarif, přejděte do sekce Můj účet → Domény → Nastavení → Ověřovací klíč podpisu webhooku a získejte klíč webhooku.
* Tento klíč můžete z bezpečnostních důvodů kdykoli směnit.
* Vypočítejte a porovnejte hodnotu `X-Webhook-Signature` z našeho požadavku webhooku s vypočítanou hodnotou těla pomocí tohoto klíče. Příklad, jak to provést, je k dispozici na adrese [tento příspěvek Stack Overflow](https://stackoverflow.com/a/68885281). * Další informace naleznete v diskusi na adrese <https://github.com/forwardemail/free-email-forwarding/issues/235>.
* Pokud webhook neodpoví stavovým kódem `200`, uložíme jeho odpověď do [protokol chyb vytvořen](#do-you-store-error-logs) – což je užitečné pro ladění.
* HTTP požadavky webhooku se budou opakovat až 3krát při každém pokusu o připojení SMTP s maximálním časovým limitem 60 sekund na každý POST požadavek koncového bodu. **To neznamená, že se pokus opakuje pouze 3krát**, ve skutečnosti se pokusy opakují průběžně a po 3. neúspěšném pokusu o POST požadavek HTTP odešle SMTP kód 421 (což odesílateli signalizuje pozdější opakování). To znamená, že e-mail se bude opakovat nepřetržitě několik dní, dokud nedosáhne stavového kódu 200.
* Opakování se provede automaticky na základě výchozího stavu a chybových kódů použitých v [metoda opakování superagenta](https://ladjs.github.io/superagent/#retrying-requests) (jsme správci).
* HTTP požadavky webhooku na stejný koncový bod seskupujeme do jednoho požadavku (namísto více), abychom ušetřili zdroje a zrychlili dobu odezvy. Pokud například odešlete e-mail na adresy <webhook1@example.com>, <webhook2@example.com> a <webhook3@example.com> a všechny tyto adresy jsou nakonfigurovány tak, aby odpovídaly *přesné* URL koncového bodu, bude proveden pouze jeden požadavek. Seskupujeme pomocí přesného porovnávání koncových bodů s striktní rovností.
* Všimněte si, že k analýze zprávy do objektu kompatibilního s JSON používáme metodu „simpleParser“ z knihovny [mailparser](https://nodemailer.com/extras/mailparser/).
* Nezpracovaná hodnota e-mailu jako řetězec je zadána jako vlastnost „raw“.
* Výsledky ověřování jsou zadány jako vlastnosti „dkim“, „spf“, „arc“, „dmarc“ a „bimi“.
* Analyzované hlavičky e-mailů jsou zadány jako vlastnost „headers“ – ale také si všimněte, že pro snazší iteraci a analýzu můžete použít „headerLines“.
* Seskupení příjemci pro tento webhook jsou seskupeni a zadáni jako vlastnost „recipients“.
* Informace o relaci SMTP jsou uvedeny jako vlastnost „session“. Tato vlastnost obsahuje informace o odesílateli zprávy, čase příchodu zprávy, HELO a názvu hostitele klienta. Hodnota názvu hostitele klienta ve tvaru `session.clientHostname` je buď FQDN (z reverzního vyhledávání PTR), nebo je to `session.remoteAddress` uzavřená v hranatých závorkách (např. `"[127.0.0.1]"`).
* Pokud potřebujete rychlý způsob, jak získat hodnotu `X-Original-To`, můžete použít hodnotu `session.recipient` (viz příklad níže). Záhlaví `X-Original-To` je záhlaví, které přidáváme do zpráv pro ladění s původním příjemcem (před maskovaným přeposíláním) zprávy.
* Pokud potřebujete z těla datové části odstranit vlastnosti `attachments` a/nebo `raw`, jednoduše přidejte `?attachments=false`, `?raw=false` nebo `?attachments=false&raw=false` do koncového bodu webhooku jako parametr řetězce dotazu (např. `https://example.com/webhook?attachments=false&raw=false`).
* Pokud existují přílohy, budou připojeny k poli `attachments` s hodnotami vyrovnávací paměti. Můžete je analyzovat zpět do obsahu pomocí přístupu s JavaScriptem, například:

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
Zajímá vás, jak vypadá požadavek webhooku z přeposlaných e-mailů? Níže jsme pro vás uvedli příklad!
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

### Podporujete regulární výrazy nebo regex {#do-you-support-regular-expressions-or-regex}?

Ano, od 27. září 2021 jsme tuto funkci přidali.  Pro porovnávání aliasů a provádění náhrad můžete jednoduše napsat regulární výrazy („regulární výrazy“).

Aliasy podporované regulárními výrazy jsou ty, které začínají `/` a končí `/` a jejich příjemci jsou e-mailové adresy nebo webhooky. Příjemci mohou také zahrnovat podporu substituce regulárních výrazů (např. `$1`, `$2`).

Podporujeme dva příznaky regulárních výrazů, včetně `i` a `g`. Příznak `i` bez rozlišování velkých a malých písmen je trvalou výchozí hodnotou a je vždy vynucován. Globální příznak `g` můžete přidat připojením koncovky `/` k `/g`.

Upozorňujeme, že pro část příjemce s regulárními výrazy podporujeme také naši funkci <a href="#can-i-disable-specific-aliases">disabled alias</a>.

Regulární výrazy nejsou podporovány na <a href="/disposable-addresses" target="_blank">globálních doménách s jedinečným názvem</a> (protože by se mohlo jednat o bezpečnostní zranitelnost).

<div class="alert my-3 alert-danger">
<i class="fa fa-stop-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Vylepšená ochrana soukromí:
</strong>
<span>
Pokud máte placený tarif (který nabízí vylepšenou ochranu soukromí), přejděte prosím do sekce <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Můj účet <i class="fa fa-angle-right"></i> Domény</a> a klikněte na „Aliasy“ vedle vaší domény pro konfiguraci regulárních výrazů. Pokud se chcete dozvědět více o placených tarifech, podívejte se na naši stránku <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Ceník</a>. Jinak můžete pokračovat podle níže uvedených pokynů.
</span>
</div>

Pokud máte bezplatný plán, jednoduše přidejte nový DNS záznam <strong class="notranslate">TXT</strong> pomocí jednoho nebo více níže uvedených příkladů:

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Jednoduchý příklad:</strong> Pokud chci, aby všechny e-maily odeslané na adresu `linus@example.com` nebo `torvalds@example.com` byly přeposílány na adresu `user@gmail.com`:
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
<td><code>forward-email=/^(linus|torvalds)$/:user@gmail.com</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Příklad substituce křestního jména a příjmení:</strong> Představte si, že všechny e-mailové adresy vaší společnosti mají vzor `firstname.lastname@example.com`. Pokud chci, aby všechny e-maily, které směřují na vzor `firstname.lastname@example.com`, byly přeposílány na `firstname.lastname@company.com` s podporou substituce (<a href="https://regexr.com/66hnu" class="alert-link">zobrazit test na RegExr</a>):
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
<strong>Příklad substituce filtrování symbolem plus:</strong> Pokud chci, aby všechny e-maily odeslané na adresu `info@example.com` nebo `support@example.com` byly přeposílány na adresu `user+info@gmail.com` nebo `user+support@gmail.com` (s podporou substituce) (<a href="https://regexr.com/66ho7" class="alert-link">zobrazit test na RegExr</a>):
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
<strong>Příklad substituce řetězce dotazu webhookem:</strong> Možná chcete, aby všechny e-maily, které jdou na `example.com`, šly na <a href="#do-you-support-webhooks" class="alert-link">webhook</a> a měly dynamický klíč řetězce dotazu „komu“ s hodnotou uživatelského jména v části e-mailové adresy (<a href="https://regexr.com/66ho4" class="alert-link">zobrazit test na RegExr</a>):
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
<strong>Příklad tichého odmítnutí:</strong> Pokud chcete, aby všechny e-maily, které odpovídají určitému vzoru, byly zakázány a tiše odmítnuty (odesílateli se to jeví, jako by zpráva byla úspěšně odeslána, ale ve skutečnosti nikam nevede) se stavovým kódem `250` (viz <a href="#can-i-disable-specific-aliases" class="alert-link">Mohu zakázat konkrétní aliasy</a>), jednoduše použijte stejný přístup s jedním vykřičníkem "!". To odesílateli signalizuje, že zpráva byla úspěšně doručena, ale ve skutečnosti nikam nevede (např. blackhole nebo `/dev/null`).
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
<strong>Příklad softwarového odmítnutí:</strong> Pokud chcete, aby všechny e-maily, které odpovídají určitému vzoru, byly zakázány a softwarově odmítnuty se stavovým kódem `421` (viz <a href="#can-i-disable-specific-aliases" class="alert-link">Mohu zakázat konkrétní aliasy</a>), jednoduše použijte stejný přístup s dvojitým vykřičníkem "!!". Tím odesílateli signalizujete, aby se pokusil odeslat svůj e-mail znovu, a e-maily na tento alias budou opakovány přibližně 5 dní a poté trvale odmítnuty.</div>

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
<strong>Příklad tvrdého odmítnutí:</strong> Pokud chcete, aby všechny e-maily, které odpovídají určitému vzoru, byly zakázány a tvrdě odmítnuty se stavovým kódem `550` (viz <a href="#can-i-disable-specific-aliases" class="alert-link">Mohu zakázat konkrétní aliasy</a>), jednoduše použijte stejný přístup s trojitým vykřičníkem "!!!". Tím se odesílateli signalizuje trvalá chyba a e-maily se nebudou opakovat, budou pro tento alias odmítnuty.</div>

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
<td><code>forward-email=/^(linus|torvalds)$/:!!!</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tip:
</strong>
Zajímá vás, jak napsat regulární výraz, nebo potřebujete otestovat jeho náhradu? Můžete navštívit webové stránky pro bezplatné testování regulárních výrazů <a href="https://regexr.com" class="alert-link">RegExr</a> na adrese <a href="https://regexr.com/" class="alert-link">https://regexr.com</a>.
<span>
</span>
</div>

### Jaké jsou vaše limity odchozích SMTP protokolů {#what-are-your-outbound-smtp-limits}

Počet uživatelů a domén omezujeme na 300 odchozích SMTP zpráv za 1 den. To je v průměru více než 9000 e-mailů za kalendářní měsíc. Pokud potřebujete toto množství překročit nebo máte trvale velký objem e-mailů, prosím [kontaktujte nás](https://forwardemail.net/help).

### Potřebuji schválení k povolení SMTP {#do-i-need-approval-to-enable-smtp}

Ano, vezměte prosím na vědomí, že pro zachování reputace IP adresy a zajištění doručitelnosti má Forward Email manuální proces kontroly pro každou doménu pro schválení odchozích SMTP zpráv. Pro schválení pošlete e-mail na adresu <support@forwardemail.net> nebo otevřete [žádost o pomoc](https://forwardemail.net/help). To obvykle trvá méně než 24 hodin, přičemž většina požadavků je vyřízena do 1-2 hodin. V blízké budoucnosti se snažíme tento proces zefektivnit s dalšími kontrolami spamu a upozorněními. Tento proces zajišťuje, že se vaše e-maily dostanou do doručené pošty a vaše zprávy nebudou označeny jako spam.

### Jaké je nastavení konfigurace vašeho SMTP serveru {#what-are-your-smtp-server-configuration-settings}

Náš server je `smtp.forwardemail.net` a je také monitorován na naší <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">stavové stránce</a>.

Podporuje IPv4 i IPv6 a je k dispozici přes porty `465` a `2465` pro SSL/TLS a `587`, `2587`, `2525` a `25` pro TLS (STARTTLS).

| Protokol | Název hostitele | Porty | IPv4 | IPv6 |
| :--------------------------------------------------------------: | ----------------------- | :-------------------------: | :----------------: | :----------------: |
| `SSL/TLS` **Preferovaný** | `smtp.forwardemail.net` | `465`, `2465` | :white_check_mark: | :white_check_mark: |
| `TLS` ([STARTTLS](https://wikipedia.org/wiki/Opportunistic_TLS)) | `smtp.forwardemail.net` | `587`, `2587`, `2525`, `25` | :white_check_mark: | :white_check_mark: |

| Přihlášení | Příklad | Popis |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Uživatelské jméno | `user@example.com` | E-mailová adresa aliasu, který pro doménu existuje v sekci <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Můj účet <i class="fa fa-angle-right"></i> Domény</a>. |
| Heslo | `************************` | Vygenerované heslo pro konkrétní alias. |

Aby bylo možné odesílat odchozí e-maily pomocí protokolu SMTP, musí být **uživatel SMTP** e-mailová adresa aliasu, který pro doménu existuje na adrese <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Můj účet <i class="fa fa-angle-right"></i></i></a> Domény – a **heslo SMTP** musí být heslo vygenerované pro daný alias.

Podrobné pokyny naleznete na adrese [Podporujete odesílání e-mailů pomocí SMTP](#do-you-support-sending-email-with-smtp).

### Jaká jsou nastavení konfigurace vašeho serveru IMAP {#what-are-your-imap-server-configuration-settings}

Náš server je `imap.forwardemail.net` a je také monitorován na naší <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">stavové stránce</a>.

Podporuje IPv4 i IPv6 a je k dispozici přes porty `993` a `2993` pro SSL/TLS.

| Protokol | Název hostitele | Porty | IPv4 | IPv6 |
| :---------------------: | ----------------------- | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **Preferovaný** | `imap.forwardemail.net` | `993`, `2993` | :white_check_mark: | :white_check_mark: |

| Přihlášení | Příklad | Popis |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Uživatelské jméno | `user@example.com` | E-mailová adresa aliasu, který pro doménu existuje v sekci <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Můj účet <i class="fa fa-angle-right"></i> Domény</a>. |
| Heslo | `************************` | Vygenerované heslo pro konkrétní alias. |

Aby bylo možné se připojit pomocí protokolu IMAP, musí být **uživatel IMAP** e-mailová adresa aliasu, který pro doménu existuje na stránce <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Můj účet <i class="fa fa-angle-right"></i></i> Domény</a> – a **heslo IMAP** musí být heslo vygenerované pro daný alias.

Podrobné pokyny naleznete na adrese [Podporujete přijímání e-mailů pomocí protokolu IMAP](#do-you-support-receiving-email-with-imap).

### Jaké je nastavení konfigurace vašeho POP3 serveru {#what-are-your-pop3-server-configuration-settings}

Náš server je `pop3.forwardemail.net` a je také monitorován na naší <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">stavové stránce</a>.

Podporuje IPv4 i IPv6 a je k dispozici přes porty `995` a `2995` pro SSL/TLS.

| Protokol | Název hostitele | Porty | IPv4 | IPv6 |
| :---------------------: | ----------------------- | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **Preferovaný** | `pop3.forwardemail.net` | `995`, `2995` | :white_check_mark: | :white_check_mark: |

| Přihlášení | Příklad | Popis |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Uživatelské jméno | `user@example.com` | E-mailová adresa aliasu, který pro doménu existuje v sekci <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Můj účet <i class="fa fa-angle-right"></i> Domény</a>. |
| Heslo | `************************` | Vygenerované heslo pro konkrétní alias. |

Aby se bylo možné připojit pomocí POP3, musí být **uživatel POP3** e-mailová adresa aliasu, který pro doménu existuje v sekci <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Můj účet <i class="fa fa-angle-right"></i></i> Domény</a> – a **heslo IMAP** musí být heslo vygenerované pro daný alias.

Podrobné pokyny naleznete na adrese [Podporujete POP3](#do-you-support-pop3).

### Konfigurace relé SMTP Postfixu {#postfix-smtp-relay-configuration}

Postfix můžete nakonfigurovat tak, aby přenášel e-maily přes SMTP servery služby Forward Email. To je užitečné pro serverové aplikace, které potřebují odesílat e-maily.

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Odhadovaná doba nastavení:</strong>
<span>Méně než 15 minut</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Důležité: </strong>
<span>
Toto vyžaduje placený tarif s povoleným přístupem k SMTP.
</span>
</div>

Instalace {####

1. Nainstalujte Postfix na váš server:

```bash
# Ubuntu/Debian
sudo apt update && sudo apt install postfix

# CentOS/RHEL
sudo yum install postfix

# macOS
brew install postfix
```

2. Během instalace po zobrazení výzvy k zadání typu konfigurace vyberte možnost „Internetový server“.

__CHRÁNĚNÁ_URL_677__ Konfigurace {__CHRÁNĚNÁ_URL_678__

1. Upravte hlavní konfigurační soubor Postfixu:

```bash
sudo nano /etc/postfix/main.cf
```

2. Přidejte nebo upravte tato nastavení:

```
# SMTP relay configuration
relayhost = [smtp.forwardemail.net]:587
smtp_use_tls = yes
smtp_sasl_auth_enable = yes
smtp_sasl_password_maps = hash:/etc/postfix/sasl_passwd
smtp_sasl_security_options = noanonymous
smtp_tls_CAfile = /etc/ssl/certs/ca-certificates.crt
```

3. Vytvořte soubor s heslem SASL:

```bash
sudo nano /etc/postfix/sasl_passwd
```

4. Přidejte své přihlašovací údaje pro přeposílání e-mailu:

```
[smtp.forwardemail.net]:587 your-alias@yourdomain.com:your-generated-password
```

5. Zabezpečte a hashujte soubor s hesly:

```bash
sudo chmod 600 /etc/postfix/sasl_passwd
sudo postmap /etc/postfix/sasl_passwd
```

6. Restartujte Postfix:

```bash
sudo systemctl restart postfix
```

#### Testování {#testing}

Otestujte si konfiguraci odesláním testovacího e-mailu:

```bash
echo "Test email body" | mail -s "Test Subject" recipient@example.com
```

__CHRÁNĚNÁ_URL_681__ Zabezpečení {__CHRÁNĚNÁ_URL_682__

### Pokročilé techniky zabezpečení serveru {#advanced-server-hardening-techniques}

> \[!TIP]
> Learn more about our security infrastructure on [our Security page](/security).

Společnost Forward Email implementuje řadu technik posílení zabezpečení serveru, aby zajistila bezpečnost naší infrastruktury a vašich dat:

1. **Zabezpečení sítě**:
* Firewall s IP tabulkami a přísnými pravidly
* Fail2ban pro ochranu hrubou silou
* Pravidelné bezpečnostní audity a penetrační testy
* Administrativní přístup pouze přes VPN

2. **Zvýšení bezpečnosti systému**:
* Minimální instalace balíčků
* Pravidelné aktualizace zabezpečení
* SELinux v režimu vynucení
* Zakázán přístup root přes SSH
* Pouze ověřování na základě klíče

3. **Zabezpečení aplikací**:
* Záhlaví zásad zabezpečení obsahu (CSP)
* Zabezpečení HTTPS Strict Transport (HSTS)
* Záhlaví ochrany XSS
* Záhlaví možností rámců a zásad odkazujícího serveru
* Pravidelné audity závislostí

4. **Ochrana dat**:
* Šifrování celého disku pomocí LUKS
* Bezpečná správa klíčů
* Pravidelné zálohy se šifrováním
* Postupy minimalizace dat

5. **Monitorování a reakce**:
* Detekce narušení v reálném čase
* Automatizované bezpečnostní skenování
* Centralizované protokolování a analýza
* Postupy reakce na incidenty

> \[!IMPORTANT]
> Our security practices are continuously updated to address emerging threats and vulnerabilities.

> \[!TIP]
> For maximum security, we recommend using our service with end-to-end encryption via OpenPGP.

### Máte certifikaci SOC 2 nebo ISO 27001 {#do-you-have-soc-2-or-iso-27001-certifications}

> \[!NOTE]
> Forward Email operates on infrastructure provided by certified subprocessors to ensure compliance with industry standards.

Služba Forward Email přímo nevlastní certifikace SOC 2 Type II ani ISO 27001. Služba však funguje na infrastruktuře poskytované certifikovanými subzpracovateli:

* **DigitalOcean**: Certifikace SOC 2 typu II a SOC 3 typu II (auditováno společností Schellman & Company LLC), certifikace ISO 27001 v několika datových centrech. Podrobnosti: <https://www.digitalocean.com/trust/certification-reports>

* **Vultr**: Certifikace SOC 2+ (HIPAA), certifikace ISO/IEC: 20000-1:2018, 27001:2022, 27017:2015, 27018:2019. Podrobnosti: <https://www.vultr.com/legal/compliance/>

* **DataPacket**: V souladu s normou SOC 2 (certifikaci získáte přímo od DataPacket), poskytovatel infrastruktury podnikové úrovně (pobočka Denver). Podrobnosti: <https://www.datapacket.com/datacenters/denver>

Služba Forward Email se řídí osvědčenými postupy v oboru bezpečnostních auditů a pravidelně spolupracuje s nezávislými bezpečnostními výzkumníky. Zdroj: <https://forwardemail.net/technical-whitepaper.pdf#page=36>

### Používáte šifrování TLS pro přeposílání e-mailů {#do-you-use-tls-encryption-for-email-forwarding}

Ano. Funkce Forward Email striktně vynucuje TLS 1.2+ pro všechna připojení (HTTPS, SMTP, IMAP, POP3) a implementuje MTA-STS pro vylepšenou podporu TLS. Implementace zahrnuje:

* Vynucování TLS 1.2+ pro všechna e-mailová připojení
* Výměna klíčů ECDHE (Elliptic Curve Diffie-Hellman Ephemeral) pro dokonalé dopředné utajení
* Moderní šifrovací sady s pravidelnými aktualizacemi zabezpečení
* Podpora HTTP/2 pro lepší výkon a zabezpečení
* HSTS (HTTP Strict Transport Security) s předběžným načítáním v hlavních prohlížečích
* **MTA-STS (Mail Transfer Agent Strict Transport Security)** pro přísné vynucování TLS

Zdroj: <https://forwardemail.net/technical-whitepaper.pdf#page=25>

**Implementace MTA-STS**: Funkce Forward Email implementuje striktní vynucování protokolu MTA-STS v kódové základně. Když dojde k chybám TLS a je vynucen protokol MTA-STS, systém vrátí stavové kódy SMTP 421, aby se zajistilo, že e-maily budou později znovu odeslány, a nebudou doručeny nezabezpečeně. Podrobnosti implementace:

* Detekce chyb TLS: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-tls-error.js>
* Vynucení MTA-STS v pomocníkovi pro odesílání e-mailů: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/send-email.js>

Ověření třetí stranou: <https://www.hardenize.com/report/forwardemail.net/1750312779> ukazuje hodnocení „Dobré“ pro všechna opatření TLS a zabezpečení přenosu.

### Zachováváte hlavičky pro ověřování e-mailů {#do-you-preserve-email-authentication-headers}

Ano. Funkce Forward Email komplexně implementuje a zachovává hlavičky pro ověřování e-mailů:

* **SPF (Sender Policy Framework)**: Správně implementováno a zachováno
* **DKIM (DomainKeys Identified Mail)**: Plná podpora se správnou správou klíčů
* **DMARC**: Vynucování zásad pro e-maily, které neprojdou ověřením SPF nebo DKIM
* **ARC**: I když to není explicitně podrobně popsáno, perfektní skóre shody služby naznačuje komplexní zpracování ověřovacích hlaviček

Zdroj: <https://forwardemail.net/technical-whitepaper.pdf#page=31>

Ověření: Test pošty Internet.nl ukazuje skóre 100/100 konkrétně pro implementaci „SPF, DKIM a DMARC“. Hodnocení Hardenize potvrzuje hodnocení „Dobré“ pro SPF a DMARC: <https://www.hardenize.com/report/forwardemail.net/1750312779>

### Zachováváte původní záhlaví e-mailů a zabraňujete jejich falšování? {#do-you-preserve-original-email-headers-and-prevent-spoofing}

> \[!TIP]
> Forward Email implements sophisticated anti-spoofing protection to prevent email abuse.

Funkce Forward Email zachovává původní záhlaví e-mailů a zároveň implementuje komplexní ochranu proti falšování falešných profilů prostřednictvím kódové základny MX:

* **Zachování hlaviček**: Během přeposílání jsou zachovány původní ověřovací hlavičky.
* **Anti-Spoofing**: Vynucování zásad DMARC zabraňuje falšování hlaviček odmítnutím e-mailů, které neprojdou ověřením SPF nebo DKIM.
* **Prevence vkládání hlaviček**: Ověřování a sanitizace vstupů pomocí knihovny striptags.
* **Pokročilá ochrana**: Sofistikovaná detekce phishingu s detekcí falšování, ochranou před zosobněním a systémy upozorňování uživatelů.

**Detaily implementace MX**: Základní logiku zpracování e-mailů zajišťuje kódová základna serveru MX, konkrétně:

* Hlavní obslužný program pro data MX: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>
* Filtrování libovolných e-mailů (anti-spoofing): <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-arbitrary.js>

Pomocník `isArbitrary` implementuje sofistikovaná pravidla proti falšování identity, včetně detekce zosobnění domény, blokovaných frází a různých phishingových vzorců.

Zdroj: <https://forwardemail.net/technical-whitepaper.pdf#page=32>

### Jak se chráníte před spamem a zneužitím {#how-do-you-protect-against-spam-and-abuse}

Přeposílání e-mailů implementuje komplexní vícevrstvou ochranu:

* **Omezení rychlosti**: Aplikuje se na pokusy o ověření, koncové body API a SMTP připojení
* **Izolace zdrojů**: Mezi uživateli, aby se zabránilo dopadu od uživatelů s vysokým objemem útoků
* **Ochrana proti DDoS útokům**: Vícevrstvá ochrana prostřednictvím systému Shield od DataPacket a Cloudflare
* **Automatické škálování**: Dynamické úpravy zdrojů na základě poptávky
* **Prevence zneužití**: Kontroly prevence zneužití specifické pro daného uživatele a blokování škodlivého obsahu na základě hashů
* **Ověřování e-mailů**: Protokoly SPF, DKIM, DMARC s pokročilou detekcí phishingu

Zdroje:

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver> (podrobnosti o ochraně proti DDoS útokům)
* <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/abuse-prevention-by-user-id.js>

### Ukládáte obsah e-mailů na disk {#do-you-store-email-content-on-disk}?

> \[!IMPORTANT]
> Forward Email uses a zero-knowledge architecture that prevents email content from being written to disk.

* **Architektura s nulovými znalostmi**: Individuálně šifrované poštovní schránky SQLite znamenají, že služba Forward Email nemá přístup k obsahu e-mailů.
* **Zpracování v paměti**: Zpracování e-mailů probíhá výhradně v paměti, čímž se vyhýbá ukládání na disk.
* **Žádné protokolování obsahu**: „Obsah e-mailů ani metadata nezaznamenáváme ani neukládáme na disk.“
* **Šifrování v sandboxu**: Šifrovací klíče se nikdy neukládají na disk v prostém textu.

**Důkazy o kódu MX**: Server MX zpracovává e-maily výhradně v paměti, aniž by zapisoval obsah na disk. Hlavní obslužný program pro zpracování e-mailů demonstruje tento přístup v paměti: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

Zdroje:

* <https://forwardemail.net/technical-whitepaper.pdf#page=10> (Abstrakt)
* <https://forwardemail.net/technical-whitepaper.pdf#page=59> (Podrobnosti s nulovými znalostmi)
* <https://forwardemail.net/technical-whitepaper.pdf#page=21> (Šifrování v sandboxu)

### Může být obsah e-mailu odhalen během havárie systému {#can-email-content-be-exposed-during-system-crashes}

Ne. Funkce Forward Email implementuje komplexní ochranná opatření proti úniku dat souvisejícímu s havárií:

* **Výpisy jádra zakázány**: Zabraňuje expozici paměti během havárií
* **Výměnná paměť zakázána**: Zcela zakázáno, aby se zabránilo extrakci citlivých dat ze swapovacích souborů
* **Architektura v paměti**: Obsah e-mailů existuje během zpracování pouze v dočasné paměti
* **Ochrana šifrovacím klíčem**: Klíče se nikdy neukládají na disk v prostém textu
* **Fyzické zabezpečení**: Disky šifrované LUKS v2 zabraňují fyzickému přístupu k datům
* **Úložiště USB zakázáno**: Zabraňuje neoprávněné extrakci dat

**Ošetření chyb při systémových problémech**: Funkce Forward Email používá pomocné funkce `isCodeBug` a `isTimeoutError`, které zajišťují, že v případě problémů s připojením k databázi, problémů se sítí/blokovaným seznamem DNS nebo problémů s připojením k nadřazenému serveru systém vrátí stavové kódy SMTP 421, aby se zajistilo, že e-maily budou později znovu odeslány, a nebudou ztraceny nebo odhaleny.

Detaily implementace:

* Klasifikace chyby: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js>
* Zpracování chyby časového limitu při zpracování MX: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

Zdroj: <https://forwardemail.net/technical-whitepaper.pdf#page=15>

### Kdo má přístup k vaší e-mailové infrastruktuře {#who-has-access-to-your-email-infrastructure}

Společnost Forward Email implementuje komplexní řízení přístupu pro svůj minimální 2-3členný technický tým s přísnými požadavky na 2FA:

* **Řízení přístupu na základě rolí**: Pro týmové účty s oprávněními založenými na zdrojích
* **Princip nejnižších oprávnění**: Aplikuje se ve všech systémech
* **Oddělení povinností**: Mezi provozními rolemi
* **Správa uživatelů**: Odděluje uživatele pro nasazení a devop s odlišnými oprávněními
* **Přihlášení root zakázáno**: Vynucuje přístup prostřednictvím řádně ověřených účtů
* **Přísná 2FA**: Žádná 2FA založená na SMS kvůli riziku útoků MiTM – pouze tokeny založené na aplikacích nebo hardwarové tokeny
* **Komplexní protokolování auditu**: S redakcí citlivých dat
* **Automatická detekce anomálií**: Pro neobvyklé vzorce přístupu
* **Pravidelné kontroly zabezpečení**: Protokolů přístupu
* **Prevence útoků Evil Maid**: Zakázáno úložiště USB a další fyzická bezpečnostní opatření

Zdroje:

* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (Ovládání autorizace)
* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (Zabezpečení sítě)
* <https://forwardemail.net/technical-whitepaper.pdf#page=15> (Prevence útoku zlé služebné)

### Jaké poskytovatele infrastruktury využíváte {#what-infrastructure-providers-do-you-use}

> \[!IMPORTANT]
> Forward Email uses multiple infrastructure subprocessors with comprehensive compliance certifications.

Úplné informace naleznete na naší stránce s informacemi o souladu s GDPR: <https://forwardemail.net/gdpr>

**Subzpracovatelé primární infrastruktury:**

| Poskytovatel | Certifikace rámce ochrany osobních údajů | Stránka souladu s GDPR |
| ---------------- | -------------------------------- | ----------------------------------------------- |
| **Cloudflare** | ✅ Ano | <https://www.cloudflare.com/trust-hub/gdpr/> |
| **Datový paket** | ❌ Ne | <https://www.datapacket.com/privacy-policy> |
| **Digitální oceán** | ❌ Ne | <https://www.digitalocean.com/legal/gdpr> |
| **Vultr** | ❌ Ne | <https://www.vultr.com/legal/eea-gdpr-privacy/> |

**Podrobné certifikace:**

**Digitální oceán**

* SOC 2 Typ II a SOC 3 Typ II (auditováno společností Schellman & Company LLC)
* Certifikace ISO 27001 v několika datových centrech
* Splňuje normu PCI-DSS
* Certifikace CSA STAR úrovně 1
* Certifikace APEC CBPR PRP
* Podrobnosti: <https://www.digitalocean.com/trust/certification-reports>

**Vultr**

* Certifikace SOC 2+ (HIPAA)
* V souladu s PCI Merchant
* Certifikace CSA STAR úrovně 1
* ISO/IEC 20000-1:2018, 27001:2022, 27017:2015, 27018:2019
* Podrobnosti: <https://www.vultr.com/legal/compliance/>

**Datový paket**

* V souladu s normou SOC 2 (pro získání certifikace kontaktujte přímo DataPacket)
* Infrastruktura podnikové úrovně (pobočka v Denveru)
* Ochrana proti DDoS útokům prostřednictvím kybernetického bezpečnostního balíčku Shield
* Technická podpora 24 hodin denně, 7 dní v týdnu
* Globální síť v 58 datových centrech
* Podrobnosti: <https://www.datapacket.com/datacenters/denver>

**Platební zpracovatelé:**

* **Stripe**: Certifikováno pro rámec ochrany osobních údajů - <https://stripe.com/legal/privacy-center>
* **PayPal**: Není certifikováno pro DPF - <https://www.paypal.com/uk/legalhub/privacy-full>

### Nabízíte smlouvu o zpracování osobních údajů (DPA) {#do-you-offer-a-data-processing-agreement-dpa}

Ano, Forward Email nabízí komplexní Smlouvu o zpracování osobních údajů (DPA), kterou lze podepsat spolu s naší podnikovou smlouvou. Kopie naší DPA je k dispozici na adrese: <https://forwardemail.net/dpa>

**Podrobnosti o DPA:**

* Zahrnuje dodržování GDPR a rámce štítu na ochranu osobních údajů EU-USA/Švýcarsko-USA
* Automaticky akceptováno při souhlasu s našimi Podmínkami služby
* Pro standardní DPA není vyžadován samostatný podpis
* Vlastní ujednání o DPA jsou k dispozici prostřednictvím licence Enterprise License

**Rámec pro dodržování GDPR:**
Naše DPA podrobně popisuje dodržování GDPR a také požadavky na mezinárodní přenos dat. Úplné informace jsou k dispozici na adrese: <https://forwardemail.net/gdpr>

Pro firemní zákazníky, kteří vyžadují individuální podmínky DPA nebo specifická smluvní ujednání, je k dispozici náš program **Enterprise License (250 USD/měsíc)**.

### Jak nakládáte s oznámeními o narušení bezpečnosti dat {#how-do-you-handle-data-breach-notifications}

> \[!NOTE]
> Forward Email's zero-knowledge architecture significantly limits breach impact.

* **Omezené vystavení dat**: Kvůli architektuře s nulovými znalostmi nelze přistupovat k šifrovanému obsahu e-mailů.
* **Minimální sběr dat**: Pouze základní informace o odběrateli a omezené protokoly IP adres z bezpečnostních důvodů.
* **Frameworky pro subprocesory**: Společnosti DigitalOcean a Vultr udržují postupy pro reakci na incidenty v souladu s GDPR.

**Informace pro zástupce pro GDPR:**
Společnost Forward Email jmenovala zástupce pro GDPR v souladu s článkem 27:

**Zástupce pro EU:**
Osano International Compliance Services Limited
K rukám: LFHC
3 Dublin Landings, North Wall Quay
Dublin 1, D01C4E0

**Zástupce pro Spojené království:**
Osano UK Compliance LTD
K rukám: LFHC
42–46 Fountain Street, Belfast
Antrim, BT1–5EF

Pro firemní zákazníky, kteří vyžadují specifické SLA pro oznámení o narušení bezpečnosti, by měly být tyto smlouvy projednány v rámci **podnikové licenční smlouvy**.

Zdroje:

* <https://forwardemail.net/technical-whitepaper.pdf#page=59>
* <https://forwardemail.net/gdpr>

### Nabízíte testovací prostředí {#do-you-offer-a-test-environment}

Technická dokumentace k Forward Email explicitně nepopisuje vyhrazený režim sandboxu. Mezi možné testovací přístupy však patří:

* **Možnost vlastního hostování**: Komplexní možnosti vlastního hostování pro vytváření testovacích prostředí
* **Rozhraní API**: Potenciál pro programové testování konfigurací
* **Open Source**: 100% open source kód umožňuje zákazníkům zkoumat logiku přesměrování
* **Více domén**: Podpora více domén by mohla umožnit vytvoření testovacích domén

Pro podnikové zákazníky, kteří vyžadují formální sandboxové funkce, by to mělo být projednáno v rámci dohody o **podnikové licenci**.

Zdroj: <https://github.com/forwardemail/forwardemail.net> (Podrobnosti o vývojovém prostředí)

### Poskytujete nástroje pro monitorování a upozorňování {#do-you-provide-monitoring-and-alerting-tools}

Přeposílaní e-mailů umožňuje monitorování v reálném čase s určitými omezeními:

**K dispozici:**

* **Monitorování doručování v reálném čase**: Veřejně viditelné metriky výkonu pro hlavní poskytovatele e-mailu
* **Automatické upozornění**: Technický tým je upozorněn, když doba doručení překročí 10 sekund
* **Transparentní monitorování**: 100% open-source monitorovací systémy
* **Monitorování infrastruktury**: Automatická detekce anomálií a komplexní protokolování auditu

**Omezení:**

* Webhooky pro zákazníky ani oznámení o stavu doručení založená na API nejsou explicitně zdokumentována.

Pro firemní zákazníky, kteří vyžadují podrobné webové hooky s informacemi o stavu doručení nebo vlastní integrace monitorování, mohou být tyto funkce k dispozici prostřednictvím ujednání **Enterprise License**.

Zdroje:

* <https://forwardemail.net> (Zobrazení monitorování v reálném čase)
* <https://github.com/forwardemail/forwardemail.net> (Implementace monitorování)

### Jak zajišťujete vysokou dostupnost {#how-do-you-ensure-high-availability}

> \[!IMPORTANT]
> Forward Email implements comprehensive redundancy across multiple infrastructure providers.

* **Distribuovaná infrastruktura**: Více poskytovatelů (DigitalOcean, Vultr, DataPacket) napříč geografickými oblastmi
* **Geografické vyvažování zátěže**: Geograficky lokalizované vyvažování zátěže založené na Cloudflare s automatickým failoverem
* **Automatické škálování**: Dynamické úpravy zdrojů na základě poptávky
* **Vícevrstvá ochrana DDoS**: Prostřednictvím systému Shield od DataPacket a Cloudflare
* **Redundance serverů**: Více serverů v oblasti s automatickým failoverem
* **Replikace databáze**: Synchronizace dat v reálném čase napříč více lokalitami
* **Monitorování a upozorňování**: Nepřetržité monitorování s automatickou reakcí na incidenty

**Závazek dostupnosti**: Dostupnost služby 99,9 %+ s transparentním monitorováním dostupným na <https://forwardemail.net>

Zdroje:

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver>

### Splňujete požadavky § 889 zákona o zmocnění k národní obraně (NDAA) {#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa}

> \[!IMPORTANT]
> Forward Email is fully compliant with Section 889 through careful selection of infrastructure partners.

Ano, přeposílaní e-mailů je **v souladu s paragrafem 889**. Paragraf 889 zákona o zmocnění k národní obraně (NDAA) zakazuje vládním agenturám používat nebo uzavírat smlouvy se subjekty, které používají telekomunikační a video monitorovací zařízení od konkrétních společností (Huawei, ZTE, Hikvision, Dahua a Hytera).

**Jak přeposílaní e-mailů dosahuje souladu s paragrafem 889:**

Služba Forward Email se spoléhá výhradně na dva klíčové poskytovatele infrastruktury, z nichž ani jeden nepoužívá zařízení zakázané podle paragrafu 889:

1. **Cloudflare**: Náš hlavní partner pro síťové služby a zabezpečení e-mailů
2. **DataPacket**: Náš hlavní poskytovatel serverové infrastruktury (s využitím výhradně zařízení Arista Networks a Cisco)
3. **Poskytovatelé záloh**: Naši poskytovatelé záloh Digital Ocean a Vultr jsou navíc písemně potvrzeni jako splňující požadavky § 889.

**Závazek společnosti Cloudflare**: Společnost Cloudflare ve svém kodexu chování třetích stran výslovně uvádí, že nepoužívají telekomunikační zařízení, produkty pro video dohled ani služby od žádných subjektů zakázaných podle § 889.

**Případ použití ve státní správě**: Naše shoda s paragrafem 889 byla ověřena, když si **Námořní akademie USA** zvolila službu Forward Email pro své potřeby zabezpečeného přeposílání e-mailů, což vyžadovalo dokumentaci našich federálních standardů shody.

Úplné informace o našem rámci pro dodržování předpisů pro vládní orgány, včetně širších federálních předpisů, naleznete v naší komplexní případové studii: [E-mailová služba federální vlády v souladu se sekcí 889](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)

## Systémové a technické podrobnosti {#system-and-technical-details}

### Ukládáte e-maily a jejich obsah {#do-you-store-emails-and-their-contents}

Ne, nezapisujeme na disk ani neukládáme protokoly – pomocí [výjimkou chyb](#do-you-store-error-logs) a [odchozí SMTP](#do-you-support-sending-email-with-smtp) (viz naše [Zásady ochrany osobních údajů](/privacy)).

Vše se děje v paměti a [náš zdrojový kód je na GitHubu](https://github.com/forwardemail).

### Jak funguje váš systém pro přeposílání e-mailů {#how-does-your-email-forwarding-system-work}

E-mail se spoléhá na protokol [protokol SMTP](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol). Tento protokol se skládá z příkazů odesílaných na server (nejčastěji běží na portu 25). Probíhá počáteční připojení, poté odesílatel uvede, od koho e-mail pochází („MAIL FROM“), následuje adresa („RCPT TO“) a nakonec záhlaví a tělo samotného e-mailu („DATA“). Postup našeho systému pro přeposílání e-mailů je popsán níže pro každý příkaz protokolu SMTP:

* Počáteční připojení (bez názvu příkazu, např. `telnet example.com 25`) – Toto je počáteční připojení. Odesílatele, kteří nejsou v našem [seznam povolených](#do-you-have-an-allowlist), kontrolujeme s naším [popírač](#do-you-have-a-denylist). Nakonec, pokud odesílatel není v našem seznamu povolených adres, zkontrolujeme, zda byl [greylisted](#do-you-have-a-greylist).

* `HELO` – Toto označuje pozdrav, který identifikuje plně kvalifikované doménové jméno odesílatele, IP adresu nebo jméno obslužného programu pošty. Tato hodnota může být falešná, takže se na tato data nespoléháme a místo toho používáme zpětné vyhledávání názvu hostitele podle IP adresy připojení.

* `MAIL FROM` – Toto označuje adresu odesílatele na obálce e-mailu. Pokud je zadána hodnota, musí se jednat o platnou e-mailovou adresu podle standardu RFC 5322. Prázdné hodnoty jsou povoleny. Zde [zkontrolujte zpětný rozptyl](#how-do-you-protect-against-backscatter) a také kontrolujeme MAIL FROM s naším [popírač](#do-you-have-a-denylist). Nakonec kontrolujeme odesílatele, kteří nejsou na seznamu povolených, z hlediska omezení rychlosti (další informace naleznete v částech o [Omezení sazby](#do-you-have-rate-limiting) a [seznam povolených](#do-you-have-an-allowlist)).

* `RCPT TO` – Toto označuje příjemce (příjemce) e-mailu. Musí se jednat o platné e-mailové adresy dle standardu RFC 5322. Povolujeme maximálně 50 příjemců na obálku na zprávu (liší se od záhlaví „Komu“ v e-mailu). Také zde kontrolujeme platnou adresu [Schéma přepisování odesílatele](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme) („SRS“), abychom zabránili falšování pomocí naší domény SRS.

* `DATA` – Toto je základní část naší služby, která zpracovává e-mail. Více informací naleznete v části [Jak zpracováváte e-mail pro přeposílání](#how-do-you-process-an-email-for-forwarding) níže.

### Jak zpracujete e-mail k přeposlání {#how-do-you-process-an-email-for-forwarding}

Tato část popisuje náš proces související s příkazem protokolu SMTP `DATA` v části [Jak funguje váš systém pro přeposílání e-mailů](#how-does-your-email-forwarding-system-work) výše – jde o to, jak zpracováváme záhlaví e-mailu, tělo, zabezpečení, určujeme, kam má být doručen, a jak zpracováváme připojení.

1. Pokud zpráva překročí maximální velikost 50 MB, bude odmítnuta s chybovým kódem 552.

2. Pokud zpráva neobsahovala záhlaví „Od“ nebo pokud některá z hodnot v záhlaví „Od“ nebyla platnou e-mailovou adresou podle standardu RFC 5322, je odmítnuta s chybovým kódem 550.

3. Pokud zpráva obsahovala více než 25 hlaviček „Přijato“, bylo zjištěno, že uvízla ve smyčce přesměrování, a byla odmítnuta s chybovým kódem 550.

4. Pomocí otisku prstu e-mailu (viz část o [Snímání otisků prstů](#how-do-you-determine-an-email-fingerprint)) zkontrolujeme, zda se o opakované odeslání zprávy pokoušelo více než 5 dní (což odpovídá [výchozí chování postfixu](http://www.postfix.org/postconf.5.html#maximal_queue_lifetime)), a pokud ano, bude zpráva odmítnuta s chybovým kódem 550.

5. Výsledky skenování e-mailu ukládáme do paměti pomocí [Skener spamu](https://spamscanner.net).

6. Pokud Spam Scanner nalezne jakékoli náhodné výsledky, bude odmítnut s chybovým kódem 554. V době psaní tohoto textu zahrnují náhodné výsledky pouze test GTUBE. Více informací naleznete na <https://spamassassin.apache.org/gtube/>.

7. Pro účely ladění a prevence zneužití přidáme do zprávy následující záhlaví:

* `Received` - přidáváme tuto standardní hlavičku Received s IP adresou původu a hostitelem, typem přenosu, informacemi o připojení TLS, datem/časem a příjemcem.
* `X-Original-To` - původní příjemce zprávy:
* Toto je užitečné pro určení, kam byl e-mail původně doručen (kromě hlavičky „Received“).
* Toto se přidává pro každého příjemce v době IMAP a/nebo maskovaného přeposílání (za účelem ochrany soukromí).
* `X-Forward-Email-Website` - obsahuje odkaz na naše webové stránky <https://forwardemail.net>
* `X-Forward-Email-Version` - aktuální verze [SemVer](https://semver.org/) z `package.json` naší kódové základny.
* `X-Forward-Email-Session-ID` – hodnota ID relace používaná pro účely ladění (platí pouze v neprodukčním prostředí).
* `X-Forward-Email-Sender` – seznam oddělený čárkami obsahující původní adresu MAIL FROM obálky (pokud nebyla prázdná), reverzní plně kvalifikovaný název domény klienta PTR (pokud existuje) a IP adresu odesílatele.
* `X-Forward-Email-ID` – toto platí pouze pro odchozí SMTP a odpovídá ID e-mailu uloženému v sekci Můj účet → E-maily.
* `X-Report-Abuse` – s hodnotou `abuse@forwardemail.net`.
* `X-Report-Abuse-To` – s hodnotou `abuse@forwardemail.net`.
* `X-Complaints-To` - s hodnotou `abuse@forwardemail.net`.

8. Poté zkontrolujeme zprávu, zda neobsahuje [DKIM](https://en.wikipedia.org/wiki/DomainKeys_Identified_Mail), [SPF](https://en.wikipedia.org/wiki/Sender_Policy_Framework), [ARC](https://en.wikipedia.org/wiki/Authenticated_Received_Chain) a [DMARC](https://en.wikipedia.org/wiki/DMARC).

* Pokud zpráva neprošla testem DMARC a doména měla nastavenou politiku odmítnutí (např. `p=reject` [byl v politice DMARC](https://wikipedia.org/wiki/DMARC)), je odmítnuta s chybovým kódem 550. Politiku DMARC pro doménu lze obvykle nalézt v záznamu <strong class="notranslate">TXT</strong> subdomény `_dmarc` (např. `dig _dmarc.example.com txt`).
* Pokud zpráva neprošla testem SPF a doména měla politiku závažného selhání (např. `-all` byla v politice SPF na rozdíl od `~all` nebo neměla žádnou politiku), je odmítnuta s chybovým kódem 550. Zásady SPF pro doménu lze obvykle nalézt v záznamu <strong class="notranslate">TXT</strong> pro kořenovou doménu (např. `dig example.com txt`). Další informace o [odesílání pošty jako u Gmailu](#can-i-send-mail-as-in-gmail-with-this) týkající se SPF naleznete v této části.

9. Nyní zpracujeme příjemce zprávy, jak byli shromážděni z příkazu `RCPT TO` v sekci [Jak funguje váš systém pro přeposílání e-mailů](#how-does-your-email-forwarding-system-work) výše. Pro každého příjemce provedeme následující operace:

* Vyhledáváme záznamy <strong class="notranslate">TXT</strong> názvu domény (část za symbolem `@`, např. `example.com`, pokud byla e-mailová adresa `test@example.com`). Například, pokud je doména `example.com`, provedeme vyhledávání DNS, například `dig example.com txt`. * Analyzujeme všechny záznamy <strong class="notranslate">TXT</strong>, které začínají buď `forward-email=` (bezplatné tarify), nebo `forward-email-site-verification=` (placené tarify). Upozorňujeme, že analyzujeme oba, abychom mohli zpracovávat e-maily, když uživatel upgraduje nebo downgraduje tarify.
* Z těchto analyzovaných záznamů <strong class="notranslate">TXT</strong> je iterujeme, abychom extrahovali konfiguraci přesměrování (jak je popsáno v části [Jak mohu začít a jak nastavit přeposílání e-mailů](#how-do-i-get-started-and-set-up-email-forwarding) výše). Upozorňujeme, že podporujeme pouze jednu hodnotu `forward-email-site-verification=` a pokud je zadáno více než jedna, dojde k chybě 550 a odesílatel obdrží pro tohoto příjemce zprávu o nedoručení.
* Rekurzivně iterujeme extrahovanou konfiguraci přesměrování, abychom určili globální přesměrování, přesměrování založené na regulárních výrazech a všechny další podporované konfigurace přesměrování – které jsou nyní známé jako naše „Adresy pro přesměrování“.
* Pro každou adresu pro přesměrování podporujeme jedno rekurzivní vyhledávání (které spustí tuto sérii operací znovu na dané adrese). Pokud byla nalezena rekurzivní shoda, bude nadřazený výsledek z adres pro přesměrování odstraněn a budou přidány podřízené položky.
* Adresy pro přesměrování jsou analyzovány z hlediska jedinečnosti (protože nechceme posílat duplikáty na jednu adresu ani vytvářet dodatečná zbytečná připojení SMTP klientů).
* Pro každou adresu pro přesměrování vyhledáváme její název domény oproti našemu koncovému bodu API `/v1/max-forwarded-addresses` (abychom určili, na kolik adres je doména povolena přeposílat e-maily na alias, např. standardně 10 – viz část o [maximální limit přeposílání na alias](#is-there-a-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias)). Pokud je tento limit překročen, dojde k chybě 550 a odesílatel obdrží zprávu o nedoručení pro tohoto příjemce.
* Vyhledáváme nastavení původního příjemce oproti našemu koncovému bodu API `/v1/settings`, který podporuje vyhledávání pro platící uživatele (s možností pro bezplatné uživatele). Toto vrátí konfigurační objekt pro pokročilá nastavení pro `port` (číslo, např. `25`), `has_adult_content_protection` (logická hodnota), `has_phishing_protection` (logická hodnota), `has_executable_protection` (logická hodnota) a `has_virus_protection` (logická hodnota).
* Na základě těchto nastavení poté zkontrolujeme výsledky skeneru spamu a pokud se vyskytnou nějaké chyby, zpráva je odmítnuta s chybovým kódem 554 (např. pokud je povoleno `has_virus_protection`, zkontrolujeme výsledky skeneru spamu na přítomnost virů). Upozorňujeme, že všichni uživatelé bezplatného tarifu budou přihlášeni k kontrolám obsahu pro dospělé, phishingu, spustitelných souborů a virů. Ve výchozím nastavení jsou všichni uživatelé placeného tarifu také přihlášeni, ale tuto konfiguraci lze změnit na stránce Nastavení pro danou doménu v panelu Přeposílání e-mailů.

10. Pro každou zpracovanou adresu pro přesměrování příjemce poté provedeme následující operace:

* Adresa je porovnána s naším [popírač](#do-you-have-a-denylist) a pokud byla uvedena, zobrazí se chybový kód 421 (což odesílateli říká, aby to zkusil později).
* Pokud je adresa webhook, nastavíme booleovskou hodnotu pro budoucí operace (viz níže – podobné webhooky seskupujeme pro jeden POST požadavek oproti vícenásobným pro doručení).
* Pokud je adresa e-mailová adresa, analyzujeme hostitele pro budoucí operace (viz níže – podobné hostitele seskupujeme pro jedno připojení oproti vícenásobným pro doručení).

11. Pokud nejsou k dispozici žádní příjemci a nedorazí žádné zprávy, odpovíme chybou 550 s textem „Neplatní příjemci“.

12. Pokud existují příjemci, projdeme je (seskupené podle stejného hostitele) a doručíme e-maily. Více informací naleznete v části [Jak řešíte problémy s doručováním e-mailů](#how-do-you-handle-email-delivery-issues) níže.

* Pokud se při odesílání e-mailů vyskytnou nějaké chyby, uložíme je do paměti pro pozdější zpracování.
* Z odesílaných e-mailů vezmeme nejnižší kód chyby (pokud existuje) a použijeme ho jako kód odpovědi na příkaz `DATA`. To znamená, že nedoručené e-maily se obvykle pokusí odeslat znovu původním odesílatelem, ale e-maily, které již byly doručeny, nebudou při příštím odeslání zprávy znovu odeslány (protože používáme [Snímání otisků prstů](#how-do-you-determine-an-email-fingerprint)).
* Pokud nedošlo k žádným chybám, odešleme stavový kód odpovědi SMTP 250 successful.
* Za nedoručení se považuje jakýkoli pokus o doručení, jehož výsledkem je stavový kód >= 500 (trvalé selhání).

13. Pokud nedošlo k žádným nedoručitelným chybám (trvalé selhání), vrátíme stavový kód odpovědi SMTP s nejnižším kódem chyby z dočasných selhání (nebo stavový kód 250 successful, pokud k žádným nedošlo).

14. Pokud k nedoručení dojde, budeme na pozadí odesílat e-maily s nedoručenými zprávami po vrácení nejnižšího ze všech chybových kódů odesílateli. Pokud je však nejnižší chybový kód >= 500, pak žádné e-maily s nedoručenými zprávami neodesíláme. Je to proto, že kdybychom to udělali, odesílatelé by obdrželi dvojitý e-mail s nedoručenými zprávami (např. jeden od svého odchozího MTA, jako je Gmail, a také jeden od nás). Více informací naleznete v části [Jak se chráníte před zpětným rozptylem](#how-do-you-protect-against-backscatter) níže.

### Jak řešíte problémy s doručováním e-mailů {#how-do-you-handle-email-delivery-issues}

Všimněte si, že provedeme přepsání „Friendly-From“ v e-mailech tehdy a pouze tehdy, pokud zásady DMARC odesílatele neprošly A žádné podpisy DKIM nebyly zarovnány se záhlavím „Od“.  To znamená, že změníme hlavičku „Od“ zprávy, nastavíme „X-Original-From“ a také nastavíme „Odpovědět“, pokud již nebylo nastaveno.  Po změně těchto záhlaví také znovu zapečetíme pečeť ARC na zprávě.

Používáme také inteligentní analýzu chybových zpráv na všech úrovních našeho zásobníku – v našem kódu jsou požadavky DNS, interní soubory Node.js, požadavky HTTP (např. 408, 413 a 429 namapovány na kód odpovědi SMTP 421, pokud je příjemce webhook) a odpovědi poštovního serveru (např. odpovědi s reprízou1 „odložit“ 4 by byly2).

Naše logika je fiktivní a bude se také opakovat pro chyby SSL/TLS, problémy s připojením a další.  Cílem dummy-proofingu je maximalizovat doručitelnost pro všechny příjemce konfigurace předávání.

Pokud je příjemcem webhook, povolíme 60sekundový časový limit na dokončení požadavku s až 3 opakováními (takže celkem 4 požadavky před selháním).  Všimněte si, že správně analyzujeme chybové kódy 408, 413 a 429 a mapujeme je na kód odpovědi SMTP 421.

Pokud je příjemcem e-mailová adresa, pokusíme se odeslat e-mail s příležitostným protokolem TLS (pokusíme se použít STARTTLS, pokud je na poštovním serveru příjemce k dispozici).  Pokud při pokusu o odeslání e-mailu dojde k chybě SSL/TLS, pokusíme se odeslat e-mail bez protokolu TLS (bez použití STARTTLS).

Pokud dojde k chybám DNS nebo připojení, vrátíme příkazu `DATA` kód odpovědi SMTP s hodnotou 421. V opačném případě, pokud se vyskytne více než 500 chyb na úrovni, budou odeslány zprávy o nedoručení.

Pokud zjistíme, že e-mailový server, na který se pokoušíme doručit, má zablokovanou jednu nebo více IP adres pro výměnu pošty (např. jakoukoli technologií, kterou používají k odkládání spammerů), odešleme odesilateli kód odpovědi SMTP 421, aby mohl zprávu zopakovat později (a my jsme na problém upozorněni, takže jej snad můžeme vyřešit před dalším pokusem).

### Jak řešíte blokování vašich IP adres {#how-do-you-handle-your-ip-addresses-becoming-blocked}

Běžně monitorujeme všechny hlavní denylisty DNS, a pokud je některá z našich IP adres pro výměnu pošty ("MX") uvedena v hlavním seznamu odmítnutých, vytáhneme ji z příslušného koloběhu záznamu DNS A, pokud to bude možné, dokud nebude problém vyřešen.

V době psaní tohoto textu jsme také uvedeni na několika seznamech povolených DNS serverů a monitorování seznamů zakázaných serverů bereme vážně. Pokud narazíte na nějaké problémy dříve, než je budeme mít možnost vyřešit, informujte nás prosím písemně na adrese <support@forwardemail.net>.

Naše IP adresy jsou veřejně dostupné, [další informace naleznete v této části níže](#what-are-your-servers-ip-addresses).

### Co jsou adresy správců pošty {#what-are-postmaster-addresses}

Abychom zabránili chybně přesměrovaným bouncem a odesílání zpráv s odpovědí v nepřítomnosti do nemonitorovaných nebo neexistujících poštovních schránek, udržujeme seznam poštovních démonů, jako jsou uživatelská jména:

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
* [a jakoukoli adresu bez odpovědi](#what-are-no-reply-addresses)

Více informací o tom, jak se takové seznamy používají k vytváření efektivních e-mailových systémů, naleznete na [RFC 5320, oddíl 4.6](https://datatracker.ietf.org/doc/html/rfc5230#section-4.6).

### Co jsou adresy pro odesílání zpráv bez odpovědi {#what-are-no-reply-addresses}

E-mailová uživatelská jména rovnající se některému z následujících (nerozlišují se malá a velká písmena) jsou považována za adresy bez odpovědi:

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

Tento seznam je udržován pod heslem [jako open-source projekt na GitHubu](https://github.com/forwardemail/reserved-email-addresses-list).

### Jaké jsou IP adresy vašeho serveru {#what-are-your-servers-ip-addresses}

Naše IP adresy zveřejňujeme na adrese <https://forwardemail.net/ips>.

### Máte seznam povolených {#do-you-have-an-allowlist}

Ano, máme [seznam přípon doménových jmen](#what-domain-name-extensions-are-allowlisted-by-default), které jsou ve výchozím nastavení na seznamu povolených, a dynamický, uložený v mezipaměti a průběžný seznam povolených na základě [přísná kritéria](#what-is-your-allowlist-criteria).

Všechny e-maily, domény a příjemci od zákazníků s placenými plány jsou automaticky přidány do našeho seznamu povolených.

### Které přípony doménových jmen jsou ve výchozím nastavení povoleny {#what-domain-name-extensions-are-allowlisted-by-default}

Následující rozšíření názvů domén jsou ve výchozím nastavení považována za povolená (bez ohledu na to, zda jsou na seznamu Umbrella Popularity List nebo ne):

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
class="list-inline-item"><code class="notranslate">gob.mx</code></li>
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
<li class="list-inline-item"><code class="notranslate">gov.au</code></li>
<li class="list-inline-item"><code class="notranslate">gov.aw</code></li>
class="notranslate">gov.ax</code></li>
<li class="list-inline-item"><code class="notranslate">gov.az</code></li>
<li class="list-inline-item"><code class="notranslate">gov.bd</code></li>
<li class="list-inline-item"><code class="notranslate">gov.be</code></li>
<li class="list-inline-item"><code class="notranslate">gov.bg</code></li>
<li class="list-inline-item"><code class="notranslate">gov.bm</code></li>
<!--<li class="list-inline-item"><code class="notranslate">gov.br</code></li>-->
<li class="list-inline-item"><code class="notranslate">gov.by</code></li>
class="list-inline-item"><code class="notranslate">gov.cl</code></li>
<li class="list-inline-item"><code class="notranslate">gov.cn</code></li>
<li class="list-inline-item"><code class="notranslate">gov.co</code></li>
<li class="list-inline-item"><code class="notranslate">gov.cy</code></li>
<li class="list-inline-item"><code class="notranslate">gov.cz</code></li>
<li class="list-inline-item"><code class="notranslate">gov.dz</code></li>
<li class="list-inline-item"><code class="notranslate">gov.eg</code></li>
<li class="list-inline-item"><code class="notranslate">gov.fi</code></li>
class="list-inline-item"><code class="notranslate">gov.fk</code></li>
<li class="list-inline-item"><code class="notranslate">gov.gg</code></li>
<li class="list-inline-item"><code class="notranslate">gov.gr</code></li>
<li class="list-inline-item"><code class="notranslate">gov.hk</code></li>
<li class="list-inline-item"><code class="notranslate">gov.hr</code></li>
<li class="list-inline-item"><code class="notranslate">gov.hu</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ie</code></li>
<li class="list-inline-item"><code class="notranslate">gov.il</code></li>
class="list-inline-item"><code class="notranslate">gov.im</code></li>
<li class="list-inline-item"><code class="notranslate">gov.in</code></li>
<li class="list-inline-item"><code class="notranslate">gov.iq</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ir</code></li>
<li class="list-inline-item"><code class="notranslate">gov.it</code></li>
<li class="list-inline-item"><code class="notranslate">gov.je</code></li>
<li class="list-inline-item"><code class="notranslate">gov.kp</code></li>
<li class="list-inline-item"><code class="notranslate">gov.krd</code></li>
class="list-inline-item"><code class="notranslate">gov.ky</code></li>
<li class="list-inline-item"><code class="notranslate">gov.kz</code></li>
<li class="list-inline-item"><code class="notranslate">gov.lb</code></li>
<li class="list-inline-item"><code class="notranslate">gov.lk</code></li>
<li class="list-inline-item"><code class="notranslate">gov.lt</code></li>
<li class="list-inline-item"><code class="notranslate">gov.lv</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ma</code></li>
<li class="list-inline-item"><code class="notranslate">gov.mm</code></li>
class="list-inline-item"><code class="notranslate">gov.mo</code></li>
<li class="list-inline-item"><code class="notranslate">gov.mt</code></li>
<li class="list-inline-item"><code class="notranslate">gov.my</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ng</code></li>
<li class="list-inline-item"><code class="notranslate">gov.np</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ph</code></li>
<li class="list-inline-item"><code class="notranslate">gov.pk</code></li>
<li class="list-inline-item"><code class="notranslate">gov.pl</code></li>
class="list-inline-item"><code class="notranslate">gov.pt</code></li>
<li class="list-inline-item"><code class="notranslate">gov.py</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ro</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ru</code></li>
<li class="list-inline-item"><code class="notranslate">gov.scot</code></li>
<li class="list-inline-item"><code class="notranslate">gov.se</code></li>
<li class="list-inline-item"><code class="notranslate">gov.sg</code></li>
<li class="list-inline-item"><code class="notranslate">gov.si</code></li>
class="list-inline-item"><code class="notranslate">gov.sk</code></li>
<li class="list-inline-item"><code class="notranslate">gov.tr</code></li>
<li class="list-inline-item"><code class="notranslate">gov.tt</code></li>
<li class="list-inline-item"><code class="notranslate">gov.tw</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ua</code></li>
<li class="list-inline-item"><code class="notranslate">gov.uk</code></li>
<li class="list-inline-item"><code class="notranslate">gov.vn</code></li>
<li class="list-inline-item"><code class="notranslate">gov.wales</code></li>
class="list-inline-item"><code class="notranslate">gov.za</code></li>
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

Tyto [značkové a podnikové domény nejvyšší úrovně](https://en.wikipedia.org/wiki/List_of_Internet_top-level_domains#Brand_and_corporate_top-level_domains) jsou navíc ve výchozím nastavení povoleny (např. `apple` pro `applecard.apple` pro výpisy z bankovních karet Apple Card):

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
<li class="list-inline-item"><code class="notranslate">bananárská republika</code></li>
<li class="list-inline-item"><code class="notranslate">barclaycard</code></li>
<li class="list-inline-item"><code class="notranslate">barclays</code></li>
<li class="list-inline-item"><code class="notranslate">basketbal</code></li>
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
<li class="list-inline-item"><code class="notranslate">rezervace</code></li>
<li class="list-inline-item"><code class="notranslate">bosch</code></li>
<li class="list-inline-item"><code class="notranslate">bosch class="notranslate">bostik</code></li>
<li class="list-inline-item"><code class="notranslate">bradesco</code></li>
<li class="list-inline-item"><code class="notranslate">bridgestone</code></li>
<li class="list-inline-item"><code class="notranslate">brother</code></li>
<li class="list-inline-item"><code class="notranslate">bugatti</code></li>
<li class="list-inline-item"><code class="notranslate">cal</code></li>
<li class="list-inline-item"><code class="notranslate">calvinklein</code></li>
<li class="list-inline-item"><code class="notranslate">canon</code></li>
<li class="list-inline-item"><code class="notranslate">canon class="notranslate">capitalone</code></li>
<li class="list-inline-item"><code class="notranslate">karavan</code></li>
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
<li class="list-inline-item"><code class="notranslate">citadela</code></li>
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
<li class="list-inline-item"><code class="notranslate">prodejce</code></li>
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
<li class="list-inline-item"><code class="notranslate">Eurovize</code></li>
<li class="list-inline-item"><code class="notranslate">Everbank</code></li>
<li class="list-inline-item"><code class="notranslate">Extraspace</code></li>
<li class="list-inline-item"><code class="notranslate">Fage</code></li>
<li class="list-inline-item"><code class="notranslate">Fairwinds</code></li>
<li class="list-inline-item"><code class="notranslate">Farmers</code></li>
<li class="list-inline-item"><code class="notranslate">Fedex</code></li>
<li class="list-inline-item"><code class="notranslate">Ferrari</code></li>
<li class="list-inline-item"><code class="notranslate">Ferrari</code></li>
<li class="list-inline-item"><code class="notranslate">Ferrari</code></li> class="notranslate">ferrero</code></li>
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
<li class="list-inline-item"><code class="notranslate">google</code></li>
<li class="list-inline-item"><code class="notranslate">grainger</code></li>
<li class="list-inline-item"><code class="notranslate">gucci</code></li>
<li class="list-inline-item"><code class="notranslate">gucci</code></li>
<li class="list-inline-item"><code class="notranslate">hbo</code></li>
<li class="list-inline-item"><code class="notranslate">hdfc</code></li>
<li class="list-inline-item"><code class="notranslate">hdfcbank</code></li>
<li class="list-inline-item"><code class="notranslate">hermes</code></li>
<li class="list-inline-item"><code class="notranslate">hisamitsu</code></li>
<li class="list-inline-item"><code class="notranslate">Hitachi</code></li>
<li class="list-inline-item"><code class="notranslate">HKT</code></li>
<li class="list-inline-item"><code class="notranslate">Honda</code></li>
<li class="list-inline-item"><code class="notranslate">Honeywell</code></li>
<li class="list-inline-item"><code class="notranslate">Hotmail</code></li>
<li class="list-inline-item"><code class="notranslate">Hsbc</code></li>
<li class="list-inline-item"><code class="notranslate">Hughes</code></li>
<li class="list-inline-item"><code class="notranslate">Hyatt</code></li>
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
<li class="list-inline-item"><code class="notranslate">životní styl</code></li>
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
<li class="list-inline-item"><code class="notranslate">Mango</code></li>
<li class="list-inline-item"><code class="notranslate">Marriott</code></li>
<li class="list-inline-item"><code class="notranslate">Maserati</code></li>
<li class="list-inline-item"><code class="notranslate">Mattel</code></li>
<li class="list-inline-item"><code class="notranslate">Mckinsey</code></li>
<li class="list-inline-item"><code class="notranslate">Metlife</code></li>
<li class="list-inline-item"><code class="notranslate">Microsoft</code></li>
<li class="list-inline-item"><code class="notranslate">mini</code></li>
<li class="list-inline-item"><code class="notranslate">mini</code></li>
class="notranslate">mitsubishi</code></li>
<li class="list-inline-item"><code class="notranslate">mlb</code></li>
<li class="list-inline-item"><code class="notranslate">mma</code></li>
<li class="list-inline-item"><code class="notranslate">monash</code></li>
<li class="list-inline-item"><code class="notranslate">mormon</code></li>
<li class="list-inline-item"><code class="notranslate">moto</code></li>
<li class="list-inline-item"><code class="notranslate">movistar</code></li>
<li class="list-inline-item"><code class="notranslate">msd</code></li>
<li class="list-inline-item"><code class="notranslate">mtn</code></li>
<li class="list-inline-item"><code class="notranslate">mtr</code></li>
<li class="list-inline-item"><code class="notranslate">vzájemný</code></li>
<li class="list-inline-item"><code class="notranslate">nadex</code></li>
<li class="list-inline-item"><code class="notranslate">celostátní</code></li>
<li class="list-inline-item"><code class="notranslate">přírodní</code></ li>
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
<li class="list-inline-item"><code class="notranslate">hrát</code></li>
<li class="list-inline-item"><code class="notranslate">playstation</code></li>
<li class="list-inline-item"><code class="notranslate">pohl</code></li>
<li class="list-inline-item"><code class="notranslate">politika</code></li>
<li class="list-inline-item"><code class="notranslate">praxi</code></li>
<li class="list-inline-item"><code class="notranslate">produkce</code></li>
<li class="list-inline-item"><code class="notranslate">progresivní</code></li>
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
<li class="list-inline-item"><code class="notranslate">bezpečnost</code></li>
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
<li class="list-inline-item"><code class="notranslate">score</code></li>
<li class="list-inline-item"><code class="notranslate">sedadlo</code></li>
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
<li class="list-inline-item"><code class="notranslate">Spiegel</code></li>
<li class="list-inline-item"><code class="notranslate">stada</code></li>
<li class="list-inline-item"><code class="notranslate">sponky</code></li>
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
<li class="list-inline-item"><code class="notranslate">celkem</code></li>
<li class="list-inline-item"><code class="notranslate">toyota</code></li>
<li class="list-inline-item"><code class="notranslate">travelchannel</code></li>
<li class="list-inline-item"><code class="notranslate">cestovatelé</code></li>
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
<li class="list-inline-item"><code class="notranslate">Virgin</code></li>
<li class="list-inline-item"><code class="notranslate">Visa</code></li>
<li class="list-inline-item"><code class="notranslate">Vista</code></li>
<li class="list-inline-item"><code class="notranslate">Vistaprint</code></li>
<li class="list-inline-item"><code class="notranslate">Vivo</code></li>
<li class="list-inline-item"><code class="notranslate">Volkswagen</code></li>
<li class="list-inline-item"><code class="notranslate">Volvo</code></li>
<li class="list-inline-item"><code class="notranslate">Walmart</code></li>
class="list-inline-item"><code class="notranslate">walter</code></li>
<li class="list-inline-item"><code class="notranslate">meteorologický kanál</code></li>
<li class="list-inline-item"><code class="notranslate">weber</code></li>
<li class="list-inline-item"><code class="notranslate">jez</code></li>
<li class="list-inline-item"><code class="notranslate">williamhill</code></li>
<li class="list-inline-item"><code class="notranslate">okna</code></li>
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
class="list-inline-item"><code class="notranslate">yodobashi</code></li>
<li class="list-inline-item"><code class="notranslate">youtube</code></li>
<li class="list-inline-item"><code class="notranslate">zappos</code></li>
<li class="list-inline-item"><code class="notranslate">zara</code></li>
<li class="list-inline-item"><code class="notranslate">zippo</code></li>
</ul>

K 18. březnu 2025 jsme do tohoto seznamu přidali také tato francouzská zámořská území ([podle tohoto požadavku GitHubu](https://github.com/forwardemail/forwardemail.net/issues/327)):

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

K 8. červenci 2025 jsme přidali tyto země specifické pro Evropu:

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

Kvůli vysoké aktivitě spamu jsme konkrétně nezahrnuli `cz`, `ru` a `ua`.

### Jaká jsou kritéria vašeho seznamu povolených {#what-is-your-allowlist-criteria}

Máme statický seznam [rozšíření doménových jmen ve výchozím nastavení povoleno](#what-domain-name-extensions-are-allowlisted-by-default) – a také udržujeme dynamický, uložený v mezipaměti, průběžně aktualizovaný seznam povolených adres na základě následujících přísných kritérií:

* Kořenová doména odesílatele musí být typu [rozšíření názvu domény, které odpovídá seznamu, který nabízíme v našem bezplatném plánu](#what-domain-name-extensions-can-be-used-for-free) (s přidáním `biz` a `info`). Zahrnujeme také částečné shody `edu`, `gov` a `mil`, například `xyz.gov.au` a `xyz.edu.au`.
* Kořenová doména odesílatele musí být mezi 100 000 nejlepšími výsledky analyzovanými unikátními kořenovými doménami z [Seznam popularity deštníku](http://s3-us-west-1.amazonaws.com/umbrella-static/index.html "Umbrella Popularity List") („UPL“).
* Kořenová doména odesílatele musí být mezi 50 000 nejlepšími výsledky z unikátních kořenových domén, které se objevují alespoň ve 4 z posledních 7 dnů UPL (~50 %+).
* Kořenová doména odesílatele nesmí být [kategorizováno](https://radar.cloudflare.com/categorization-feedback/) označena jako obsah pro dospělé nebo malware službou Cloudflare.
* Kořenová doména odesílatele musí mít nastavené záznamy A nebo MX.
* Kořenová doména odesílatele musí mít záznam(y) A, záznam(y) MX, záznam DMARC s kvalifikátorem `p=reject` nebo `p=quarantine` nebo záznam SPF s kvalifikátorem `-all` nebo `~all`.

Pokud je toto kritérium splněno, bude kořenová doména odesílatele uložena do mezipaměti po dobu 7 dnů.  Všimněte si, že naše automatizovaná úloha běží denně – jedná se tedy o mezipaměť seznamu povolených, která se denně aktualizuje.

Naše automatizovaná úloha stáhne předchozích 7 dní z paměti UPL, rozbalí je a poté analyzuje v paměti podle přísných kritérií výše.

Populární domény v době psaní tohoto článku, jako je Google, Yahoo, Microsoft, Amazon, Meta, Twitter, Netflix, Spotify a další – jsou samozřejmě zahrnuty.

Pokud jste odesílatel, který není na našem seznamu povolených odesílatelů, pak při prvním odeslání e-mailu z vaší kořenové domény FQDN nebo IP adresy budete označeni jako [sazba omezena](#do-you-have-rate-limiting) a [greylisted](#do-you-have-a-greylist). Upozorňujeme, že se jedná o standardní postup přijatý jako e-mailový standard. Většina klientů e-mailových serverů se pokusí o opakování, pokud obdrží chybu týkající se limitu rychlosti nebo chyby na greylistu (např. stavový kód chyby úrovně 421 nebo 4xx).

**Upozorňujeme, že konkrétní odesílatelé, jako například `a@gmail.com`, `b@xyz.edu` a `c@gov.au`, mohou být stále [odepřen](#do-you-have-a-denylist)** (např. pokud od těchto odesílatelů automaticky detekujeme spam, phishing nebo malware).**

### Jaké doménové koncovky lze používat zdarma {#what-domain-name-extensions-can-be-used-for-free}

Od 31. března 2023 jsme pro ochranu našich uživatelů a služeb zavedli nové všeobecné pravidlo o spamu.

Toto nové pravidlo umožňuje v našem bezplatném plánu používat pouze následující přípony doménových jmen:

<ul class="list-inline">
<li class="list-inline-item"><code class="notranslate">ac</code></li>
<li class="list-inline-item"><code class="notranslate">ad</code></li>
<li class="list-inline-item"><code class="notranslate">ag</code></li>
<li class="list-inline-item"><code class="notranslate">ai</code></li>
<li class="list-inline-item"><code class="notranslate">al</code></li>
<li class="list-inline-item"><code class="notranslate">am</code></li>
<li class="list-inline-item"><code class="notranslate">app</code></li>
<li class="list-inline-item"><code class="notranslate">as</code></li>
<li class="list-inline-item"><code class="notranslate">zavináč</code></li>
<li class="list-inline-item"><code class="notranslate">au</code></li>
<li class="list-inline-item"><code class="notranslate">ba</code></li>
<li class="list-inline-item"><code class="notranslate">být</code></li>
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
<li class="list-inline-item"><code class="notranslate">dk</code></li>
<li class="list-inline-item"><code class="notranslate">ee</code></li>
<li class="list-inline-item"><code class="notranslate">es</code></li>
<li class="list-inline-item"><code class="notranslate">eu</code></li>
<li class="list-inline-item"><code class="notranslate">family</code></li>
<li class="list-inline-item"><code class="notranslate">fi</code></li>
<li class="list-inline-item"><code class="notranslate">fm</code></li>
<li class="list-inline-item"><code class="notranslate">fr</code></li>
<li class="list-inline-item"><code class="notranslate">gg</code></li>
<li class="list-inline-item"><code class="notranslate">gl</code></li>
<li class="list-inline-item"><code class="notranslate">id</code></li>
<li class="list-inline-item"><code class="notranslate">ie</code></li>
<li class="list-inline-item"><code class="notranslate">il</code></li>
<li class="list-inline-item"><code class="notranslate">im</code></li>
<li class="list-inline-item"><code class="notranslate">in</code></li>
<li class="list-inline-item"><code class="notranslate">io</code></li>
<li class="list-inline-item"><code class="notranslate">ir</code></li>
<li class="list-inline-item"><code class="notranslate">is</code></li>
<li class="list-inline-item"><code class="notranslate">to</code></li>
<li class="list-inline-item"><code class="notranslate">je</code></li>
<li class="list-inline-item"><code class="notranslate">jap</code></li>
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
<li class="list-inline-item"><code class="notranslate">ne</code></li>
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
<li class="list-inline-item"><code class="notranslate">do</code></li>
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

### Máte šedou listinu {#do-you-have-a-greylist}

Ano, používáme velmi laxní zásady [e-mailový greylisting](https://en.wikipedia.org/wiki/Greylisting_\(email\)). Greylisting se vztahuje pouze na odesílatele, kteří nejsou na našem seznamu povolených, a v naší mezipaměti zůstává 30 dní.

Pro každého nového odesílatele uložíme klíč v naší databázi Redis po dobu 30 dnů s hodnotou nastavenou na počáteční čas příchodu jeho prvního požadavku.  Poté jejich e-mail odmítneme se stavovým kódem opakování 450 a povolíme, aby prošel až po uplynutí 5 minut.

Pokud úspěšně počkali 5 minut od tohoto počátečního času příjezdu, budou jejich e-maily přijaty a tento stavový kód 450 neobdrží.

Klíč se skládá buď z kořenové domény FQDN, nebo z IP adresy odesílatele.  To znamená, že jakákoli subdoména, která projde greylistem, projde také kořenovou doménou a naopak (to je to, co máme na mysli „velmi laxní“ zásadou).

Pokud například e-mail přijde z adresy `test.example.com` dříve, než uvidíme e-mail z adresy `example.com`, pak jakýkoli e-mail z adresy `test.example.com` a/nebo `example.com` bude muset čekat 5 minut od doby, kdy se připojení začalo. Nepožadujeme, aby adresy `test.example.com` a `example.com` čekaly vlastní 5minutovou lhůtu (naše zásady greylistingu platí na úrovni kořenové domény).

Upozorňujeme, že greylisting se nevztahuje na žádného odesílatele na našem [seznam povolených](#do-you-have-an-allowlist) (v době psaní tohoto textu např. Meta, Amazon, Netflix, Google, Microsoft).

### Máte seznam zakázaných adres {#do-you-have-a-denylist}

Ano, provozujeme svůj vlastní seznam odmítnutí a aktualizujeme jej automaticky v reálném čase a ručně na základě zjištěného spamu a škodlivé aktivity.

Také každou hodinu získáváme všechny IP adresy ze seznamu zakázaných adres UCEPROTECT úrovně 1 na adrese <http://wget-mirrors.uceprotect.net/rbldnsd-all/dnsbl-1.uceprotect.net.gz> a vkládáme je do našeho seznamu zakázaných adres s platností 7 dní.

Odesílatelé nalezení v seznamu zakázaných adres obdrží chybový kód 421 (který odesílateli říká, aby to zkusil znovu později), pokud [nejsou povoleny](#do-you-have-an-allowlist).

Použitím stavového kódu 421 namísto stavového kódu 554 lze v reálném čase zmírnit potenciální falešné poplachy a poté zprávu úspěšně doručit při dalším pokusu.

**Toto je navrženo na rozdíl od jiných poštovních služeb**, kde pokud jste zařazeni na seznam blokovaných, dochází k trvalému a závažnému selhání. Často je obtížné požádat odesílatele o opakování pokusů o odeslání zprávy (zejména od velkých organizací), a proto tento přístup dává zhruba 5 dní od prvního pokusu o odeslání e-mailu, aby odesílatel, příjemce nebo my zasáhli a problém vyřešili (požádáním o odstranění ze seznamu blokovaných).

Všechny žádosti o odstranění ze seznamu odmítnutých správci sledují v reálném čase (např. aby mohli administrátoři trvale zařadit opakované falešně pozitivní výsledky).

Žádosti o odstranění ze seznamu zakázaných kontaktů lze podat na adrese <https://forwardemail.net/denylist>.. Platící uživatelé mají své žádosti o odstranění ze seznamu zakázaných kontaktů zpracované okamžitě, zatímco neplatící uživatelé musí čekat, až je administrátoři zpracují.

Odesílatelé, u kterých se zjistí, že odesílají spam nebo obsah virů, budou přidáni do seznamu odmítnutých následujícím způsobem:

1. Adresa [otisk první zprávy](#how-do-you-determine-an-email-fingerprint) je zařazena na šedou listinu po detekci spamu nebo blokování od „důvěryhodného“ odesílatele (např. `gmail.com`, `microsoft.com`, `apple.com`).
* Pokud byl odesílatel na seznamu povolených, zpráva je zařazena na šedou listinu po dobu 1 hodiny.
* Pokud odesílatel na seznamu povolených není, zpráva je zařazena na šedou listinu po dobu 6 hodin.
2. Z informací odesílatele a zprávy analyzujeme klíče seznamu zakázaných adres a pro každý z těchto klíčů vytvoříme (pokud žádný již neexistuje) čítač, zvýšíme ho o 1 a uložíme ho do mezipaměti po dobu 24 hodin.
* Pro odesílatele na seznamu povolených:
* Přidejte klíč pro e-mailovou adresu obálky „MAIL FROM“, pokud měla úspěšný SPF nebo žádný SPF a nebyla [uživatelské jméno správce pošty](#what-are-postmaster-addresses) ani [uživatelské jméno bez odpovědi](#what-are-no-reply-addresses).
* Pokud byla hlavička „From“ na seznamu povolených, přidejte klíč pro e-mailovou adresu záhlaví „From“, pokud měla úspěšný SPF nebo úspěšný a zarovnaný DKIM.
* Pokud hlavička „From“ nebyla na seznamu povolených, přidejte klíč pro e-mailovou adresu záhlaví „From“ a její kořenový analyzovaný název domény.
* Pro odesílatele, kteří nejsou na seznamu povolených:
* Přidejte klíč pro e-mailovou adresu obálky „MAIL FROM“, pokud měla úspěšný SPF.
* Pokud byla hlavička „From“ na seznamu povolených, přidejte klíč pro e-mailovou adresu záhlaví „From“, pokud měla úspěšný SPF nebo úspěšný a zarovnaný DKIM.
* Pokud hlavička „From“ na seznamu povolených nebyla, přidejte klíč pro e-mailovou adresu záhlaví „From“ a její kořenový analyzovaný název domény.
* Přidejte klíč pro vzdálenou IP adresu odesílatele.
* Přidejte klíč pro klientem vyřešený název hostitele zpětným vyhledáváním z IP adresy odesílatele (pokud existuje).
* Přidejte klíč pro kořenovou doménu klientem vyřešeného názvu hostitele (pokud existuje a pokud se liší od klientem vyřešeného názvu hostitele).
3. Pokud počítadlo dosáhne hodnoty 5 pro odesílatele a klíč, který není na seznamu povolených, pak klíč na 30 dní zamítneme a našemu týmu pro boj se zneužíváním je odeslán e-mail. Tato čísla se mohou změnit a aktualizace se zde projeví, protože sledujeme zneužití.
4. Pokud počítadlo dosáhne hodnoty 10 pro odesílatele a klíč na seznamu povolených, pak klíč na 7 dní zamítneme a našemu týmu pro boj se zneužíváním je odeslán e-mail. Tato čísla se mohou změnit a aktualizace se zde projeví, protože sledujeme zneužití.

> **POZNÁMKA:** V blízké budoucnosti zavedeme monitorování reputace. Monitorování reputace místo toho vypočítá, kdy odesílatele zakázat, na základě procentuálního prahu (na rozdíl od výše uvedeného základního počítadla).

### Máte omezení rychlosti {#do-you-have-rate-limiting}

Omezení rychlosti odesílatelů je buď provedeno kořenovou doménou parsovanou z reverzního vyhledávání PTR na IP adrese odesílatele – nebo pokud to nevrátí výsledek, pak se jednoduše použije IP adresa odesílatele. Všimněte si, že níže na to odkazujeme jako na `Sender`.

Naše MX servery mají denní limity pro příchozí poštu přijatou pro [šifrované úložiště IMAP](/blog/docs/best-quantum-safe-encrypted-email-service):

* Místo omezení rychlosti příchozí pošty přijaté na základě individuálního aliasu (např. `you@yourdomain.com`) – omezujeme rychlost podle samotného názvu domény aliasu (např. `yourdomain.com`). Tím se zabrání tomu, aby `Senders` zaplavil schránky všech aliasů ve vaší doméně najednou.
* Máme obecná omezení, která platí pro všechny `Senders` v naší službě bez ohledu na příjemce:
* `Senders`, které považujeme za „důvěryhodné“ jako zdroj pravdy (např. `gmail.com`, `microsoft.com`, `apple.com`), jsou omezeny na odesílání 100 GB za den.
* `Senders`, které jsou [povoleno](#do-you-have-an-allowlist), jsou omezeny na odesílání 10 GB denně.
* Všechny ostatní `Senders` jsou omezeny na odesílání 1 GB a/nebo 1000 zpráv denně.
* Máme specifický limit pro `Sender` a `yourdomain.com`, který je 1 GB a/nebo 1000 zpráv denně.

Servery MX také omezují přeposílání zpráv jednomu nebo více příjemcům pomocí omezení rychlosti – ale to platí pouze pro `Senders`, které nejsou na [seznam povolených](#do-you-have-an-allowlist):

* Povolujeme maximálně 100 připojení za hodinu, na jednu `Sender` vyřešenou kořenovou doménu FQDN (nebo) `Sender` vzdálenou IP adresu (pokud není k dispozici reverzní PTR) a na každého příjemce obálky. Klíč pro omezení rychlosti ukládáme jako kryptografický hash v naší databázi Redis.

* Pokud odesíláte e-maily prostřednictvím našeho systému, ujistěte se prosím, že máte pro všechny své IP adresy nastavené reverzní PTR (jinak bude každá unikátní kořenová doména FQDN nebo IP adresa, ze které odesíláte, omezena rychlostí).

* Upozorňujeme, že pokud odesíláte prostřednictvím populárního systému, jako je Amazon SES, nebudete omezeni sazbou, protože (v době psaní tohoto textu) je Amazon SES uveden na našem seznamu povolených plateb.

* Pokud odesíláte z domény, jako je například `test.abc.123.example.com`, pak bude limit rychlosti uvaleno na `example.com`. Mnoho spammerů používá stovky subdomén k obejití běžných spamových filtrů, které omezují rychlost pouze unikátních názvů hostitelů, nikoli unikátních kořenových domén FQDN.

* `Senders`, které překračují limit rychlosti, budou odmítnuty s chybou 421.

Naše servery IMAP a SMTP omezují počet souběžných připojení vašich aliasů na více než `60`.

Naše MX servery omezují odesílatele [nepovolené](#do-you-have-an-allowlist) na navazování více než 10 souběžných připojení (s 3minutovou platností mezipaměti pro čítač, která odráží náš 3minutový časový limit socketu).

### Jak se chráníte před zpětným rozptylem {#how-do-you-protect-against-backscatter}

Nesprávně směrované nedoručené zprávy nebo nedoručený spam (známý jako „[Zpětný rozptyl](https://en.wikipedia.org/wiki/Backscatter_\(email\))“) mohou způsobit negativní reputaci IP adres odesílatele.

Proti zpětnému rozptylu podnikáme dva kroky, které jsou podrobně popsány v následujících částech [Zabraňte vracení zpráv od známých POŠTA OD spammerů](#prevent-bounces-from-known-mail-from-spammers) a [Zabraňte zbytečným odskokům, abyste se chránili před zpětným rozptylem](#prevent-unnecessary-bounces-to-protect-against-backscatter) níže.

### Zabraňte nedoručení známých zpráv od spammerů {#prevent-bounces-from-known-mail-from-spammers}

Seznam každou hodinu získáváme z adresy [Backscatter.org](https://www.backscatterer.org/) (s podporou [UCEPROTECT](https://www.uceprotect.net/)) na adrese <http://wget-mirrors.uceprotect.net/rbldnsd-all/ips.backscatterer.org.gz> a vkládáme jej do naší databáze Redis (rozdíl také předem porovnáváme, pro případ, že by byly odstraněny nějaké IP adresy, které je třeba respektovat).

Pokud je pole MAIL FROM prázdné NEBO se rovná (bez rozlišování velkých a malých písmen) kterékoli z [adresy poštmistrů](#what-are-postmaster-addresses) (část před znakem @ v e-mailu), zkontrolujeme, zda se IP adresa odesílatele shoduje s některou z těchto adres.

Pokud je IP adresa odesílatele uvedena (a není v našem [seznam povolených](#do-you-have-an-allowlist)), odešleme chybu 554 se zprávou `The IP ${session.remoteAddress} is blocked by https://www.backscatterer.org/index.php?target=test&ip=${session.remoteAddress}`. Budeme upozorněni, pokud je odesílatel na seznamu Backscatterer i na našem seznamu povolených adres, abychom mohli problém v případě potřeby vyřešit.

Techniky popsané v této části se řídí doporučením „BEZPEČNÝ REŽIM“ na adrese <https://www.backscatterer.org/?target=usage> – kde kontrolujeme IP adresu odesílatele, pouze pokud již byly splněny určité podmínky.

### Zabraňte zbytečným odrazům, abyste zabránili zpětnému rozptylu {#prevent-unnecessary-bounces-to-protect-against-backscatter}

Bounce jsou e-maily, které indikují, že přeposlání e-mailu příjemci zcela selhalo a e-mail nebude opakován.

Běžným důvodem pro zařazení na seznam Backscatterer jsou nesprávně nasměrovaná vrácená oznámení nebo vrácený spam, takže se proti tomu musíme chránit několika způsoby:

1. Odesíláme pouze v případě, že se vyskytne >= 500 chyb se stavovým kódem (když selhaly pokusy o přeposlání e-mailů, např. Gmail odpoví chybou úrovně 500).

2. Odesíláme pouze jednou a pouze jednou (používáme vypočítaný klíč otisku nedoručené zprávy a ukládáme ho do mezipaměti, abychom zabránili odesílání duplikátů). Otisk nedoručené zprávy je klíč, který je kombinací otisku zprávy s hašem adresy nedoručené zprávy a jejím chybovým kódem). Více informací o tom, jak se otisk zprávy vypočítává, naleznete v části [Snímání otisků prstů](#how-do-you-determine-an-email-fingerprint). Úspěšně odeslané otisky nedoručené zprávy vyprší po 7 dnech v naší mezipaměti Redis.

3. Zprávy odesíláme pouze tehdy, pokud pole OD a/nebo Od není prázdné a neobsahuje (bez rozlišování velkých a malých písmen) __CHRÁNĚNÝ_LINK_1147__ (část před znakem @ v e-mailu).

4. Neodesíláme, pokud původní zpráva obsahovala některou z následujících hlaviček (bez rozlišování velkých a malých písmen):

* Záhlaví `auto-submitted` s hodnotou odlišnou od `no`. * Záhlaví `x-auto-response-suppress` s hodnotou `dr`, `autoreply`, `auto-reply`, `auto_reply` nebo `all`
* Záhlaví `list-id`, `list-subscribe`, `list-unsubscribe`, `list-help`, `list-post`, `list-owner`, `list-archive`, `x-autoreply`, `x-autorespond` nebo `x-auto-respond` (bez ohledu na hodnotu).
* Záhlaví `precedence` s hodnotou `bulk`, `autoreply`, `auto-reply`, `auto_reply` nebo `list`.

5. Zprávy neodesíláme, pokud e-mailová adresa odesílatele nebo e-mailová adresa odesílatele končí kódy `+donotreply`, `-donotreply`, `+noreply` nebo `-noreply`.

6. Neodesíláme, pokud část s uživatelským jménem v e-mailové adrese odesílatele byla `mdaemon` a obsahovala hlavičku `X-MDDSN-Message`, která nerozlišovala velká a malá písmena.

7. Neodesíláme, pokud se v záhlaví `content-type` s kódem `multipart/report` objevila hlavička bez rozlišování velkých a malých písmen.

### Jak zjistíte otisk prstu e-mailu {#how-do-you-determine-an-email-fingerprint}

Otisk e-mailu se používá k určení jedinečnosti e-mailu a k zabránění doručování duplicitních zpráv a odesílání [duplicitní odrazy](#prevent-unnecessary-bounces-to-protect-against-backscatter).

Otisk prstu se vypočítá z následujícího seznamu:

* Klientem vyřešený název hostitele FQDN nebo IP adresa
* Hodnota záhlaví `Message-ID` (pokud existuje)
* Hodnota záhlaví `Date` (pokud existuje)
* Hodnota záhlaví `From` (pokud existuje)
* Hodnota záhlaví `To` (pokud existuje)
* Hodnota záhlaví `Cc` (pokud existuje)
* Hodnota záhlaví `Subject` (pokud existuje)
* Hodnota `Body` (pokud existuje)

### Mohu přeposílat e-maily na jiné porty než 25 (např. pokud můj poskytovatel internetových služeb zablokoval port 25) {#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25}

Ano, od 5. května 2020 jsme tuto funkci přidali.  Právě teď je tato funkce specifická pro doménu, nikoli pro alias.  Pokud požadujete, aby byl alias-specifický, kontaktujte nás a sdělte nám své potřeby.

<div class="alert my-3 alert-danger">
<i class="fa fa-stop-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Vylepšená ochrana soukromí:
</strong>
<span>
Pokud máte placený tarif (který nabízí vylepšenou ochranu soukromí), přejděte prosím do sekce <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Můj účet <i class="fa fa-angle-right"></i> Domény</a>, klikněte na „Nastavení“ vedle vaší domény a poté klikněte na „Nastavení“. Pokud se chcete dozvědět více o placených tarifech, podívejte se na naši stránku <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Ceník</a>. Jinak můžete pokračovat podle níže uvedených pokynů.
</span>
</div>

Pokud máte bezplatný plán, jednoduše přidejte nový DNS záznam <strong class="notranslate">TXT</strong>, jak je uvedeno níže, ale změňte port z 25 na port dle vlastního výběru.

Například pokud chci, aby všechny e-maily směřující na adresu `example.com` byly přeposílány na port SMTP aliasu příjemců s hodnotou 1337 místo 25:

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
Nejběžnějším scénářem pro nastavení vlastního přesměrování portů je, když chcete přesměrovat všechny e-maily, které jdou na example.com, na jiný port na example.com, než je standard SMTP portu 25. Chcete-li to nastavit, jednoduše přidejte následující záznam <strong class="notranslate">TXT</strong>.
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

### Podporuje symbol plus + pro aliasy Gmailu {#does-it-support-the-plus--symbol-for-gmail-aliases}

Ano, naprosto.

### Podporuje subdomény {#does-it-support-sub-domains}

Ano, naprosto.  Namísto použití „@“, „.“ nebo prázdného místa jako názvu/hostitele/aliasu stačí jako hodnotu použít název subdomény.

Pokud chcete, aby `foo.example.com` přeposílal e-maily, zadejte v nastavení DNS jako hodnotu názvu/hostitele/aliasu `foo` (pro záznamy MX i <strong class="notranslate">TXT</strong>).

### Přeposílá toto záhlaví mých e-mailů {#does-this-forward-my-emails-headers}

Ano, naprosto.

### Je toto dobře otestované {#is-this-well-tested}

Ano, má testy napsané s [ava](https://github.com/avajs/ava) a také pokrytí kódu.

### Předáváte dále zprávy a kódy odpovědí SMTP {#do-you-pass-along-smtp-response-messages-and-codes}

Ano, samozřejmě. Pokud například odesíláte e-mail na adresu `hello@example.com` a je registrován pro přesměrování na `user@gmail.com`, pak se místo proxy serveru na adrese „mx1.forwardemail.net“ nebo „mx2.forwardemail.net“ vrátí odpověď SMTP a kód ze serveru SMTP „gmail.com“.

### Jak předcházíte spammerům a zajišťujete dobrou pověst v oblasti přeposílání e-mailů {#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation}

Viz naše sekce o [Jak funguje váš systém pro přeposílání e-mailů](#how-does-your-email-forwarding-system-work), [Jak řešíte problémy s doručováním e-mailů](#how-do-you-handle-email-delivery-issues) a [Jak řešíte zablokování vašich IP adres](#how-do-you-handle-your-ip-addresses-becoming-blocked) výše.

### Jak se provádí vyhledávání DNS u doménových jmen {#how-do-you-perform-dns-lookups-on-domain-names}

Vytvořili jsme open-source softwarový projekt :tangerine: [Mandarinka](https://github.com/forwardemail/tangerine) a používáme ho pro vyhledávání DNS. Výchozí DNS servery jsou `1.1.1.1` a `1.0.0.1` a DNS dotazy probíhají přes [DNS přes HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) („DoH“) na aplikační vrstvě.

:tangerine: [Mandarinka](https://github.com/tangerine) používá [standardně službu DNS pro spotřebitele od CloudFlare, která je zaměřena na ochranu soukromí][cloudflare-dns].

## Účet a fakturace {#account-and-billing}

### Nabízíte záruku vrácení peněz u placených tarifů {#do-you-offer-a-money-back-guarantee-on-paid-plans}?

Ano! K automatickému vrácení peněz dochází, když upgradujete, přejdete na nižší verzi nebo zrušíte svůj účet do 30 dnů od prvního spuštění plánu.  To platí pouze pro první zákazníky.

### Pokud změním tarif, provedete poměrnou sazbu a vrátíte rozdíl {#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference}

Při změně tarifu neprovádíme poměrnou sazbu ani nevracíme rozdíl. Místo toho převedeme zbývající dobu trvání z data vypršení platnosti vašeho stávajícího plánu na nejbližší relativní dobu trvání vašeho nového plánu (zaokrouhleno dolů na měsíc).

Upozorňujeme, že pokud upgradujete nebo přejdete na nižší verzi mezi placenými plány do 30 dnů od prvního spuštění placeného plánu, automaticky vám vrátíme celou částku z vašeho stávajícího plánu.

### Mohu tuto službu pro přeposílání e-mailů používat jako „záložní“ nebo „záložní“ MX server {#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server}

Ne, nedoporučuje se to, protože v jednu chvíli můžete používat pouze jeden server pro výměnu pošty.  Záložní opatření se obvykle nikdy nezkoušejí kvůli nesprávné konfiguraci priority a poštovní servery, které nerespektují kontrolu priority výměny MX.

### Mohu zakázat konkrétní aliasy {#can-i-disable-specific-aliases}

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Důležité:
</strong>
<span>
Pokud máte placený tarif, musíte přejít do sekce <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Můj účet <i class="fa fa-angle-right"></i> Domény</a> <i class="fa fa-angle-right"></i> Aliasy <i class="fa fa-angle-right"></i> Upravit alias <i class="fa fa-angle-right"></i> Zrušte zaškrtnutí políčka „Aktivní“ <i class="fa fa-angle-right"></i> Pokračovat.
</span>
</div>

Ano, jednoduše upravte svůj TXT záznam DNS a před alias přidejte jeden, dva nebo tři vykřičníky (viz níže).

Upozorňujeme, že byste *měli* zachovat mapování „:“, protože je to nutné, pokud se někdy rozhodnete tuto funkci vypnout (a také se používá pro import, pokud upgradujete na jeden z našich placených tarifů).

**Pro tiché odmítnutí (odesílateli se zdá, že zpráva byla úspěšně odeslána, ale ve skutečnosti nikam nevede) (stavový kód `250`):** Pokud před alias přidáte "!" (jeden vykřičník), vrátí odesílatelům, kteří se pokoušejí odeslat zprávu na tuto adresu, úspěšný stavový kód `250`, ale samotné e-maily nikam nevedou (např. černá díra nebo `/dev/null`).

**Pro měkké odmítnutí (stavový kód `421`):** Pokud před alias přidáte "!!" (dvojitý vykřičník), vrátí se odesílatelům, kteří se pokoušejí odeslat na tuto adresu, měkký chybový kód `421` a e-maily budou často znovu odesílány až 5 dní před odmítnutím a vrácením.

**Pro tvrdé odmítnutí (stavový kód `550`):** Pokud před alias uvedete "!!!" (trojitý vykřičník), vrátí se odesílatelům, kteří se pokoušejí odeslat na tuto adresu, trvalý chybový stavový kód `550` a e-maily budou odmítnuty a nedoručeny.

Například pokud chci, aby všechny e-maily, které směřují na adresu `alias@example.com`, přestaly procházet na adresu `user@gmail.com` a byly odmítnuty a nedoručeny (např. s použitím tří vykřičníků):

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
Adresu přeposílaného příjemce můžete také přepsat jednoduše na „nobody@forwardemail.net“, což ji přesměruje na nobody, jak je uvedeno v níže uvedeném příkladu.
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
Pokud chcete zvýšit zabezpečení, můžete také odstranit část „:user@gmail.com“ (nebo „:nobody@forwardemail.net“) a ponechat pouze „!!!alias“, jak je uvedeno v příkladu níže.
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
<td><code>forward-email=!!!alias</code></td>
</tr>
</tbody>
</table>

### Mohu přeposílat e-maily více příjemcům {#can-i-forward-emails-to-multiple-recipients}

Ano, samozřejmě. Stačí zadat více příjemců ve vašich záznamech <strong class="notranslate">TXT</strong>.

Například pokud chci, aby byl e-mail směřující na adresu `hello@example.com` přeposlán na adresy `user+a@gmail.com` a `user+b@gmail.com`, pak by můj záznam <strong class="notranslate">TXT</strong> vypadal takto:

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
<td><code class="cursor-initial" data-original-title="" title="">forward-email=hello:user+a@gmail.com,hello:user+b@gmail.com</code></td>
</tr>
</tbody>
</table>

Nebo je můžete zadat do dvou samostatných řádků, například takto:

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

### Mohu mít více globálních příjemců pro všechny adresy {#can-i-have-multiple-global-catch-all-recipients}

Ano, můžete. Stačí ve svých záznamech <strong class="notranslate">TXT</strong> zadat více globálních příjemců pro všechny adresy.

Například pokud chci, aby každý e-mail, který směřuje na adresu `*@example.com` (hvězdička znamená zástupný znak, tj. „catch-all“), byl přeposílán na adresy `user+a@gmail.com` a `user+b@gmail.com`, pak by můj záznam <strong class="notranslate">TXT</strong> vypadal takto:

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
<td><code>forward-email=user+a@gmail.com,user+b@gmail.com</code></td>
</tr>
</tbody>
</table>

Nebo je můžete zadat do dvou samostatných řádků, například takto:

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

### Existuje maximální limit pro počet e-mailových adres, na které mohu přeposlat e-maily na alias {#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias}?

Ano, výchozí limit je 10. To NEZNAMENÁ, že na vaší doméně můžete mít pouze 10 aliasů. Můžete mít libovolný počet aliasů (neomezený počet). To znamená, že můžete přeposlat pouze jeden alias na 10 unikátních e-mailových adres. Můžete mít `hello:user+1@gmail.com`, `hello:user+2@gmail.com`, `hello:user+3@gmail.com`, … (od 1 do 10) – a všechny e-maily na adresu `hello@example.com` budou přeposílány na `user+1@gmail.com`, `user+2@gmail.com`, `user+3@gmail.com`, … (od 1 do 10).

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Tip:
</strong>
<span>
Potřebujete více než 10 příjemců na alias? Pošlete nám e-mail a rádi vám zvýšíme limit účtů.
</span>
</div>

### Mohu rekurzivně přeposílat e-maily {#can-i-recursively-forward-emails}

Ano, můžete, ale stále musíte dodržovat maximální limit. Pokud máte `hello:linus@example.com` a `linus:user@gmail.com`, pak budou e-maily odeslané na adresu `hello@example.com` přeposílány na adresy `linus@example.com` a `user@gmail.com`. Upozorňujeme, že pokud se pokusíte rekurzivně přeposlat e-maily nad maximální limit, dojde k chybě.

### Mohou si lidé bez mého svolení odhlásit nebo zaregistrovat přeposílání e-mailů {#can-people-unregister-or-register-my-email-forwarding-without-my-permission}

Používáme ověřování záznamů MX a TXT, takže pokud přidáte příslušné záznamy MX a TXT této služby, budete zaregistrováni. Pokud je odstraníte, bude vaše registrace odregistrována. Máte vlastníky své domény a správu DNS, takže pokud k nim má někdo přístup, je to problém.

### Jak je to zdarma {#how-is-it-free}

Forward Email nabízí bezplatnou úroveň prostřednictvím kombinace vývoje s otevřeným zdrojovým kódem, efektivní infrastruktury a volitelných placených plánů, které službu podporují.

Naše bezplatná úroveň je podporována:

1. **Vývoj s otevřeným zdrojovým kódem**: Naše kódová základna je open source, což umožňuje příspěvky komunity a transparentní provoz.

2. **Efektivní infrastruktura**: Optimalizovali jsme naše systémy tak, aby zvládaly přeposílání e-mailů s minimálními zdroji.

3. **Placené prémiové tarify**: Uživatelé, kteří potřebují další funkce, jako je odesílání SMTP, příjem IMAP nebo rozšířené možnosti ochrany osobních údajů, se přihlásí k odběru našich placených tarifů.

4. **Přiměřené limity užívání**: Bezplatná úroveň má zásady spravedlivého užívání, které zabraňují zneužívání.

> \[!NOTE]
> We're committed to keeping basic email forwarding free while offering premium features for users with more advanced needs.

> \[!TIP]
> If you find our service valuable, consider upgrading to a paid plan to support ongoing development and maintenance.

### Jaký je maximální limit velikosti e-mailu {#what-is-the-max-email-size-limit}

Ve výchozím nastavení používáme limit velikosti 50 MB, který zahrnuje obsah, záhlaví a přílohy.  Upozorňujeme, že služby jako Gmail a Outlook umožňují limit velikosti pouze 25 MB, a pokud tento limit překročíte při odesílání na adresy u těchto poskytovatelů, zobrazí se chybová zpráva.

Pokud je překročen limit velikosti souboru, je vrácena chyba se správným kódem odezvy.

### Ukládáte protokoly e-mailů {#do-you-store-logs-of-emails}

Ne, nezapisujeme na disk ani neukládáme protokoly – pomocí [výjimkou chyb](#do-you-store-error-logs) a [odchozí SMTP](#do-you-support-sending-email-with-smtp) (viz naše [Zásady ochrany osobních údajů](/privacy)).

Vše se děje v paměti a [náš zdrojový kód je na GitHubu](https://github.com/forwardemail).

### Ukládáte protokoly chyb {#do-you-store-error-logs}

**Ano. K protokolům chyb máte přístup pod odkazem [Můj účet → Protokoly](/my-account/logs) nebo [Můj účet → Domény](/my-account/domains).**

Od února 2023 uchováváme protokoly chyb pro kódy odpovědí SMTP `4xx` a `5xx` po dobu 7 dnů – obsahují chybu SMTP, obálku a záhlaví e-mailu (tělo e-mailu ani přílohy **neukládáme**).

Chybové protokoly vám umožňují kontrolovat, zda nechybí důležité e-maily, a zmírňovat falešně pozitivní výsledky spamu pro [vaše domény](/my-account/domains). Jsou také skvělým zdrojem pro ladění problémů s [e-mailové webhooky](#do-you-support-webhooks) (protože chybové protokoly obsahují odpověď koncového bodu webhooku).

Chybové protokoly pro [omezení sazby](#do-you-have-rate-limiting) a [greylisting](#do-you-have-a-greylist) nejsou přístupné, protože připojení končí předčasně (např. před odesláním příkazů `RCPT TO` a `MAIL FROM`).

Pro více informací se podívejte na naši __CHRÁNĚNÝ_LINK_1166__.

### Čteš moje e-maily {#do-you-read-my-emails}

Ne, rozhodně ne. Viz náš __CHRÁNĚNÝ_LINK_1167__.

Mnoho dalších služeb pro přeposílání e-mailů ukládá a může potenciálně číst váš e-mail.  Neexistuje žádný důvod, proč by se přeposílané e-maily musely ukládat na diskové úložiště – a proto jsme navrhli první open-source řešení, které to vše dělá v paměti.

Věříme, že byste měli mít právo na soukromí, a striktně ho respektujeme. Kód nasazený na server je [open-source software na GitHubu](https://github.com/forwardemail) z důvodu transparentnosti a budování důvěry.

### Mohu v Gmailu s tímto {#can-i-send-mail-as-in-gmail-with-this} „odeslat poštu jako“?

Ano! Od 2. října 2018 jsme tuto funkci přidali. Viz [Jak odesílat poštu jako pomocí Gmailu](#how-to-send-mail-as-using-gmail) výše!

Také byste měli nastavit SPF záznam pro Gmail v konfiguračním záznamu DNS <strong class="notranslate">TXT</strong>.

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Důležité:
</strong>
<span>
Pokud používáte Gmail (např. Odeslat poštu jako) nebo G Suite, budete muset do svého TXT záznamu SPF přidat <code>include:_spf.google.com</code>, například:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
</span>
</div>

### Mohu v Outlooku s tímto {#can-i-send-mail-as-in-outlook-with-this} „odeslat poštu jako“?

Ano! Od 2. října 2018 jsme tuto funkci přidali.  Jednoduše si prohlédněte tyto dva odkazy od společnosti Microsoft níže:

* <https://support.office.com/en-us/article/add-or-remove-an-email-alias-in-outlook-com-459b1989-356d-40fa-a689-8f285b13f1f2>
* <https://support.office.com/en-us/article/send-email-from-a-different-address-in-outlook-com-ccba89cb-141c-4a36-8c56-6d16a8556d2e>

Také byste měli nastavit SPF záznam pro Outlook v konfiguračním záznamu DNS <strong class="notranslate">TXT</strong>.

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Důležité:
</strong>
<span>
Pokud používáte Microsoft Outlook nebo Live.com, budete muset do svého TXT záznamu SPF přidat řetězec <code>include:spf.protection.outlook.com</code>, například:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:spf.protection.outlook.com -all</code>
</span>
</div>

### Mohu v Apple Mailu a iCloud Mailu „odeslat poštu jako“ s tímto {#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this}

Pokud jste předplatitelem iCloud+, můžete použít vlastní doménu. [Naše služba je také kompatibilní s Apple Mail](#apple-mail).

Více informací naleznete na <https://support.apple.com/en-us/102540>.

### Mohu s touto adresou {#can-i-forward-unlimited-emails-with-this} přeposílat neomezený počet e-mailů?

Ano, nicméně „relativně neznámí“ odesílatelé mají omezenou rychlost 100 připojení za hodinu na název hostitele nebo IP adresu. Viz části o [Omezení sazby](#do-you-have-rate-limiting) a [Greylisting](#do-you-have-a-greylist) výše.

„Relativně neznámými“ máme na mysli odesílatele, kteří se neobjevují v [seznam povolených](#do-you-have-an-allowlist).

Pokud je tento limit překročen, odešleme kód odpovědi 421, který sděluje poštovnímu serveru odesílatele, aby to zkusil znovu později.

### Nabízíte neomezený počet domén za jednu cenu {#do-you-offer-unlimited-domains-for-one-price}

Ano. Bez ohledu na to, jaký tarif používáte, budete platit pouze jednu měsíční sazbu – která pokrývá všechny vaše domény.

### Které platební metody přijímáte {#which-payment-methods-do-you-accept}

Služba Forward Email akceptuje následující jednorázové nebo měsíční/čtvrtletní/roční platební metody:

1. **Kreditní/debetní karty/bankovní převody**: Visa, Mastercard, American Express, Discover, JCB, Diners Club atd.
2. **PayPal**: Propojte svůj účet PayPal pro snadné platby
3. **Kryptoměny**: Přijímáme platby prostřednictvím stablecoinů Stripe v sítích Ethereum, Polygon a Solana

> \[!NOTE]
> We store limited payment information on our servers, which only includes payment identifiers and references to [Stripe](https://stripe.com/global) and [PayPal](https://www.paypal.com) transaction, customer, subscription, and payment ID's.

> \[!TIP]
> For maximum privacy, consider using cryptocurrency payments.

Všechny platby jsou zpracovávány bezpečně prostřednictvím Stripe nebo PayPal. Vaše platební údaje nejsou nikdy uloženy na našich serverech.

## Další zdroje {#additional-resources}

> \[!TIP]
> Our articles below are regularly updated with new guides, tips, and technical information. Check back often for the latest content.

* [Případové studie a dokumentace pro vývojáře](/blog/docs)
* [Zdroje](/resources)
* [Průvodci](/guides)

[gmail-2fa]: __CHRÁNĚNÁ_URL_868__

[cloudflare-dns]: __CHRÁNĚNÁ_URL_869__