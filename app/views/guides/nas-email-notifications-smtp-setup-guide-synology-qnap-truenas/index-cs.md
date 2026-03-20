# Kompletní průvodce nastavením e-mailu na NAS s Forward Email {#complete-guide-to-nas-email-setup-with-forward-email}

Nastavení e-mailových upozornění na vašem NAS by nemělo být obtížné. Ať už máte Synology, QNAP nebo dokonce Raspberry Pi, tento průvodce vám pomůže propojit vaše zařízení s Forward Email, abyste skutečně věděli, kdy něco selže.

Většina NAS zařízení může odesílat e-mailová upozornění na selhání disků, varování před teplotou, dokončení zálohy a bezpečnostní události. Problém? Mnoho poskytovatelů e-mailu je dnes náročnější na bezpečnost a starší zařízení často nedokážou držet krok. Zde přichází na řadu Forward Email – podporujeme jak moderní, tak i starší zařízení.

Tento průvodce pokrývá nastavení e-mailu pro více než 75 poskytovatelů NAS s podrobnými instrukcemi, informacemi o kompatibilitě a tipy pro řešení problémů. Ať už používáte jakékoli zařízení, pomůžeme vám, aby vaše upozornění fungovala.


## Obsah {#table-of-contents}

* [Proč potřebujete e-mailová upozornění na NAS](#why-you-need-nas-email-notifications)
* [Problém s TLS (a jak ho řešíme)](#the-tls-problem-and-how-we-fix-it)
* [SMTP nastavení Forward Email](#forward-email-smtp-settings)
* [Komplexní matice kompatibility NAS poskytovatelů](#comprehensive-nas-provider-compatibility-matrix)
* [Konfigurace e-mailu na Synology NAS](#synology-nas-email-configuration)
  * [Kroky konfigurace](#configuration-steps)
* [Konfigurace e-mailu na QNAP NAS](#qnap-nas-email-configuration)
  * [Kroky konfigurace](#configuration-steps-1)
  * [Časté problémy a řešení u QNAP](#common-qnap-troubleshooting-issues)
* [Legacy konfigurace ReadyNAS](#readynas-legacy-configuration)
  * [Kroky legacy konfigurace](#legacy-configuration-steps)
  * [Řešení problémů ReadyNAS](#readynas-troubleshooting)
* [Konfigurace TerraMaster NAS](#terramaster-nas-configuration)
* [Konfigurace ASUSTOR NAS](#asustor-nas-configuration)
* [Konfigurace Buffalo TeraStation](#buffalo-terastation-configuration)
* [Konfigurace Western Digital My Cloud](#western-digital-my-cloud-configuration)
* [Konfigurace e-mailu TrueNAS](#truenas-email-configuration)
* [Konfigurace OpenMediaVault](#openmediavault-configuration)
* [Konfigurace Raspberry Pi NAS](#raspberry-pi-nas-configuration)
  * [Počáteční nastavení Raspberry Pi](#initial-raspberry-pi-setup)
  * [Konfigurace sdílení souborů Samba](#samba-file-sharing-configuration)
  * [Nastavení FTP serveru](#ftp-server-setup)
  * [Konfigurace e-mailových upozornění](#email-notification-configuration)
  * [Pokročilé funkce Raspberry Pi NAS](#advanced-raspberry-pi-nas-features)
  * [Řešení problémů s e-mailem na Raspberry Pi](#raspberry-pi-email-troubleshooting)
  * [Optimalizace výkonu](#performance-optimization)
  * [Bezpečnostní aspekty](#security-considerations)


## Proč potřebujete e-mailová upozornění na NAS {#why-you-need-nas-email-notifications}

Váš NAS sleduje spoustu věcí – stav disků, teplotu, síťové problémy, bezpečnostní události. Bez e-mailových upozornění mohou problémy zůstat neodhaleny týdny, což může vést ke ztrátě dat nebo bezpečnostním incidentům.

E-mailová upozornění vám okamžitě dávají vědět, když disky začnou selhávat, varují před neoprávněnými pokusy o přístup, potvrzují úspěšné zálohy a informují vás o stavu systému. Forward Email zajistí, že vám tyto kritické zprávy skutečně dorazí.


## Problém s TLS (a jak ho řešíme) {#the-tls-problem-and-how-we-fix-it}

Situace je taková: pokud byl váš NAS vyroben před rokem 2020, pravděpodobně podporuje pouze TLS 1.0. Gmail, Outlook a většina poskytovatelů už tuto verzi dávno nepodporují. Vaše zařízení se pokusí odeslat e-mail, bude odmítnuto a vy zůstanete bez informací.

Forward Email to řeší pomocí podpory dvou portů. Moderní zařízení používají naše standardní porty (`465` a `587`), zatímco starší zařízení mohou využít naše legacy porty (`2455` a `2555`), které stále podporují TLS 1.0.

> \[!IMPORTANT]
> Forward Email podporuje jak moderní, tak legacy NAS zařízení díky strategii dvou portů. Používejte porty 465/587 pro moderní zařízení s podporou TLS 1.2+ a porty 2455/2555 pro legacy zařízení, která podporují pouze TLS 1.0.


## SMTP nastavení Forward Email {#forward-email-smtp-settings}
Tady je, co potřebujete vědět o našem nastavení SMTP:

**Pro moderní NAS zařízení (2020+):** Použijte `smtp.forwardemail.net` s portem `465` (SSL/TLS) nebo portem `587` (STARTTLS). Tyto fungují s aktuálním firmwarem, který podporuje TLS 1.2+.

**Pro starší NAS zařízení:** Použijte `smtp.forwardemail.net` s portem `2455` (SSL/TLS) nebo portem `2555` (STARTTLS). Tyto podporují TLS 1.0 pro starší zařízení.

**Autentizace:** Použijte svůj Forward Email alias jako uživatelské jméno a vygenerované heslo z [Můj účet -> Domény -> Aliasy](https://forwardemail.net/my-account/domains) (nikoli heslo k vašemu účtu).

> \[!CAUTION]
> Nikdy nepoužívejte heslo pro přihlášení k účtu pro SMTP autentizaci. Vždy používejte vygenerované heslo z [Můj účet -> Domény -> Aliasy](https://forwardemail.net/my-account/domains) pro konfiguraci NAS.

> \[!TIP]
> Zkontrolujte verzi firmwaru a podporu TLS vašeho NAS zařízení před konfigurací. Většina zařízení vyrobených po roce 2020 podporuje moderní TLS protokoly, zatímco starší zařízení obvykle vyžadují porty pro kompatibilitu se staršími verzemi.


## Komplexní matice kompatibility poskytovatelů NAS {#comprehensive-nas-provider-compatibility-matrix}

Následující matice poskytuje podrobné informace o kompatibilitě hlavních poskytovatelů NAS, včetně úrovní podpory TLS, stavu firmwaru a doporučených nastavení Forward Email.

| Poskytovatel NAS | Aktuální modely | Podpora TLS | Stav firmwaru | Doporučené porty | Běžné problémy                                                                                                                                          | Průvodce nastavením/screenshoty                                                                                                                  |
| ---------------- | --------------- | ----------- | ------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Synology         | DSM 7.x         | TLS 1.2+    | Aktivní       | `465`, `587`     | [Konfigurace STARTTLS](https://community.synology.com/enu/forum/2/post/124584)                                                                         | [Nastavení e-mailových oznámení DSM](https://kb.synology.com/en-af/DSM/help/DSM/AdminCenter/system_notification_email)                          |
| QNAP             | QTS 5.x         | TLS 1.2+    | Aktivní       | `465`, `587`     | [Selhání centra oznámení](https://www.qnap.com/en/how-to/faq/article/email-notifications-fail-after-updating-to-qts-524%E2%80%93fixed-in-qts-525)       | [Konfigurace e-mailového serveru QTS](https://docs.qnap.com/operating-system/qts/5.1.x/en-us/configuring-an-email-notification-server-EB4E6D7F.html) |
| Raspberry Pi     | Raspberry Pi OS | TLS 1.2+    | Aktivní       | `465`, `587`     | [Problémy s DNS resolucí](https://www.raspberrypi.org/forums/viewtopic.php?t=294014)                                                                   | [Průvodce nastavením e-mailu pro Raspberry Pi NAS](#raspberry-pi-nas-configuration)                                                              |
| ASUSTOR          | ADM 4.x         | TLS 1.2+    | Aktivní       | `465`, `587`     | [Validace certifikátu](https://forum.asustor.com/viewtopic.php?f=134&t=12345)                                                                          | [Nastavení oznámení ASUSTOR](https://www.asustor.com/en/online/online_help?id=8)                                                                 |
| TerraMaster      | TOS 6.x         | TLS 1.2     | Aktivní       | `465`, `587`     | [SMTP autentizace](https://www.terra-master.com/global/forum/)                                                                                        | [Konfigurace e-mailu TerraMaster](https://www.terra-master.com/global/support/download.php)                                                       |
| TrueNAS          | SCALE/CORE      | TLS 1.2+    | Aktivní       | `465`, `587`     | [Nastavení SSL certifikátu](https://www.truenas.com/community/threads/email-notifications-not-working.95234/)                                          | [Průvodce nastavením e-mailu TrueNAS](https://www.truenas.com/docs/scale/scaletutorials/systemsettings/general/settingupsystememail/)             |
| Buffalo          | TeraStation     | TLS 1.2     | Omezený       | `465`, `587`     | [Kompatibilita firmwaru](https://buffaloamericas.com/knowledge-base/configuring-email-notifications-on-a-ts3010-or-ts5010-series-terastation)          | [Nastavení e-mailu TeraStation](https://buffaloamericas.com/knowledge-base/configuring-email-notifications-on-a-ts3010-or-ts5010-series-terastation) |
| Western Digital  | My Cloud OS 5   | TLS 1.2     | Omezený       | `465`, `587`     | [Kompatibilita staršího OS](https://community.wd.com/t/my-cloud-email-notifications-not-working/265432)                                                | [Konfigurace e-mailu My Cloud](https://support-en.wd.com/app/answers/detailweb/a_id/10222)                                                      |
| OpenMediaVault   | OMV 7.x         | TLS 1.2+    | Aktivní       | `465`, `587`     | [Závislosti pluginů](https://forum.openmediavault.org/index.php?thread/42156-email-notifications-not-working/)                                        | [Nastavení oznámení OMV](https://docs.openmediavault.org/en/latest/administration/general/notifications.html)                                   |
| Netgear ReadyNAS | OS 6.x          | Pouze TLS 1.0 | Ukončeno     | `2455`, `2555`   | [Podpora staršího TLS](https://kb.netgear.com/23066/How-do-I-manage-my-email-alert-contacts-on-my-ReadyNAS-OS-6-storage-system)                        | [Nastavení e-mailových upozornění ReadyNAS](https://kb.netgear.com/23066/How-do-I-manage-my-email-alert-contacts-on-my-ReadyNAS-OS-6-storage-system) |
| Drobo            | Dashboard       | TLS 1.2     | Ukončeno     | `465`, `587`     | [Omezená podpora](https://myprojects.drobo.com/support/)                                                                                               | [E-mailová oznámení Drobo](https://www.drobo.com/support/)                                                                                       |
Tato matice demonstruje jasné rozdělení mezi moderními, aktivně udržovanými NAS systémy a staršími zařízeními, která vyžadují speciální kompatibilitní úvahy. Většina současných NAS zařízení podporuje moderní standardy TLS a může používat primární SMTP porty Forward Email bez jakéhokoliv speciálního nastavení.


## Konfigurace e-mailu Synology NAS {#synology-nas-email-configuration}

Zařízení Synology s DSM jsou poměrně jednoduchá na nastavení. Podporují moderní TLS, takže můžete bez problémů používat naše standardní porty.

> \[!NOTE]
> Synology DSM 7.x poskytuje nejkomplexnější funkce pro e-mailová upozornění. Starší verze DSM mohou mít omezené možnosti konfigurace.

### Kroky konfigurace {#configuration-steps}

1. **Přístup k webovému rozhraní DSM** zadáním IP adresy vašeho NAS zařízení nebo QuickConnect ID do webového prohlížeče.

2. **Přejděte do Ovládacího panelu** a vyberte sekci „Upozornění“, poté klikněte na záložku „E-mail“ pro přístup k možnostem konfigurace e-mailu.

3. **Povolte e-mailová upozornění** zaškrtnutím políčka „Povolit e-mailová upozornění“.

4. **Nakonfigurujte SMTP server** zadáním `smtp.forwardemail.net` jako adresy serveru.

5. **Nastavte konfiguraci portu** na port 465 pro SSL/TLS připojení (doporučeno). Jako alternativa je podporován port 587 s STARTTLS.

6. **Nakonfigurujte autentizaci** výběrem „Vyžadována SMTP autentizace“ a zadáním vašeho aliasu Forward Email do pole uživatelského jména.

7. **Zadejte své heslo** pomocí hesla vygenerovaného z [Můj účet -> Domény -> Aliasy](https://forwardemail.net/my-account/domains).

8. **Nastavte adresy příjemců** zadáním až pěti e-mailových adres, které mají dostávat upozornění.

9. **Nakonfigurujte filtrování upozornění** pro kontrolu, které události spouštějí e-mailová upozornění, aby se zabránilo zahlcení upozorněními a zároveň byly hlášeny kritické události.

10. **Otestujte konfiguraci** pomocí vestavěné testovací funkce DSM, abyste ověřili, že jsou všechna nastavení správná a komunikace se servery Forward Email funguje správně.

> \[!TIP]
> Synology umožňuje různé typy upozornění pro různé příjemce, což poskytuje flexibilitu v tom, jak jsou upozornění distribuována v rámci vašeho týmu.


## Konfigurace e-mailu QNAP NAS {#qnap-nas-email-configuration}

Zařízení QNAP s QTS fungují skvěle s Forward Email. Podporují moderní TLS a mají pěkné webové rozhraní pro konfiguraci.

> \[!IMPORTANT]
> QNAP QTS 5.2.4 měl známý problém s e-mailovými upozorněními, který byl [opraven v QTS 5.2.5](https://www.qnap.com/en/how-to/faq/article/email-notifications-fail-after-updating-to-qts-524%E2%80%93fixed-in-qts-525). Ujistěte se, že máte aktualizovaný firmware, abyste se vyhnuli selhání upozornění.

### Kroky konfigurace {#configuration-steps-1}

1. **Přístup k webovému rozhraní vašeho zařízení QNAP** zadáním jeho IP adresy do webového prohlížeče.

2. **Přejděte do Ovládacího panelu** a vyberte „Účet služby a spárování zařízení“, poté klikněte na sekci „E-mail“ pro zahájení konfigurace e-mailu.

3. **Klikněte na „Přidat SMTP službu“** pro vytvoření nové konfigurace e-mailu.

4. **Nakonfigurujte SMTP server** zadáním `smtp.forwardemail.net` jako adresy SMTP serveru.

5. **Vyberte vhodný bezpečnostní protokol** – zvolte „SSL/TLS“ s portem `465` (doporučeno). Port `587` s STARTTLS je také podporován.

6. **Nakonfigurujte číslo portu** – doporučen je port `465` s SSL/TLS. Port `587` s STARTTLS je také k dispozici, pokud je potřeba.

7. **Zadejte své autentizační údaje** použitím vašeho aliasu Forward Email jako uživatelského jména a hesla vygenerovaného z [Můj účet -> Domény -> Aliasy](https://forwardemail.net/my-account/domains).

8. **Nakonfigurujte informace o odesílateli** zadáním popisného jména do pole „Od“, například „QNAP NAS System“ nebo hostname vašeho zařízení.

9. **Nastavte adresy příjemců** pro různé typy upozornění. QNAP umožňuje konfigurovat více skupin příjemců pro různé typy upozornění.

10. **Otestujte konfiguraci** pomocí vestavěné testovací funkce e-mailu QNAP, abyste ověřili, že všechna nastavení fungují správně.

> \[!TIP]
> Pokud narazíte na [problémy s konfigurací SMTP Gmailu](https://forum.qnap.com/viewtopic.php?t=152466), stejné kroky řešení problémů platí i pro Forward Email. Ujistěte se, že je autentizace správně povolena a údaje jsou správné.
> \[!NOTE]
> Zařízení QNAP podporují pokročilé plánování oznámení, které vám umožňuje nastavit tiché hodiny, během nichž jsou potlačena ne-kritická oznámení. To je zvláště užitečné v podnikových prostředích.

### Běžné problémy s řešením potíží QNAP {#common-qnap-troubleshooting-issues}

Pokud vaše zařízení QNAP [neodesílá e-maily s oznámeními](https://www.reddit.com/r/qnap/comments/1dc6z03/qnap_nas_will_not_send_notification_emails/), zkontrolujte následující:

* Ověřte, že vaše přihlašovací údaje pro Forward Email jsou správné
* Ujistěte se, že adresa SMTP serveru je přesně `smtp.forwardemail.net`
* Potvrďte, že port odpovídá vaší metodě šifrování (`465` pro SSL/TLS je doporučeno; `587` pro STARTTLS je také podporováno)
* Zkontrolujte, zda vaše [konfigurace SMTP serveru](https://www.qnap.com/en/how-to/faq/article/why-does-notification-center-fail-to-send-emails-to-my-smtp-server) umožňuje připojení


## Legacy konfigurace ReadyNAS {#readynas-legacy-configuration}

Zařízení Netgear ReadyNAS představují jedinečné výzvy kvůli ukončené podpoře firmwaru a závislosti na starších protokolech TLS 1.0. Nicméně podpora legacy portů Forward Email zajišťuje, že tato zařízení mohou i nadále spolehlivě odesílat e-mailová oznámení.

> \[!CAUTION]
> ReadyNAS OS 6.x podporuje pouze TLS 1.0, což vyžaduje legacy kompatibilní porty Forward Email `2455` a `2555`. Moderní porty `465` a `587` s těmito zařízeními nefungují.

### Kroky legacy konfigurace {#legacy-configuration-steps}

1. **Přístup do webového rozhraní ReadyNAS** zadáním IP adresy zařízení do webového prohlížeče.

2. **Přejděte do Systém > Nastavení > Upozornění** pro přístup k sekci konfigurace e-mailu.

3. **Nakonfigurujte SMTP server** zadáním `smtp.forwardemail.net` jako adresy serveru.

4. **Nastavte konfiguraci portu** na `2455` pro SSL/TLS připojení nebo `2555` pro STARTTLS připojení – jedná se o legacy kompatibilní porty Forward Email.

5. **Povolte autentizaci** a zadejte svůj alias Forward Email jako uživatelské jméno a vygenerované heslo z [Můj účet -> Domény -> Aliasy](https://forwardemail.net/my-account/domains).

6. **Nakonfigurujte informace o odesílateli** s popisnou adresou „Od“ pro identifikaci zařízení ReadyNAS.

7. **Přidejte e-mailové adresy příjemců** pomocí tlačítka + v sekci kontaktů e-mailu.

8. **Otestujte konfiguraci**, aby bylo zajištěno správné fungování legacy TLS připojení.

> \[!IMPORTANT]
> Zařízení ReadyNAS vyžadují legacy porty, protože nemohou navázat zabezpečené připojení pomocí moderních TLS protokolů. Toto je [známé omezení](https://kb.netgear.com/23066/How-do-I-manage-my-email-alert-contacts-on-my-ReadyNAS-OS-6-storage-system) ukončeného firmwaru.

### Řešení potíží ReadyNAS {#readynas-troubleshooting}

Běžné problémy s konfigurací e-mailu ReadyNAS zahrnují:

* **Neshoda verze TLS**: Ujistěte se, že používáte porty `2455` nebo `2555`, nikoli moderní porty
* **Selhání autentizace**: Ověřte správnost přihlašovacích údajů Forward Email
* **Síťová konektivita**: Zkontrolujte, zda ReadyNAS může dosáhnout `smtp.forwardemail.net`
* **Omezení firmwaru**: Některé starší modely ReadyNAS mohou mít další [požadavky na konfiguraci HTTPS](https://kb.netgear.com/23100/How-do-I-configure-HTTPS-HTTP-with-SSL-encryption-settings-on-my-ReadyNAS-OS-6-storage-system)

Zařízení ReadyNAS s OS 6.x a staršími verzemi podporují pouze TLS 1.0 připojení, která většina moderních poskytovatelů e-mailů již nepřijímá. Dedikované legacy porty Forward Email (2455 a 2555) tyto starší protokoly specificky podporují, což zajišťuje pokračující funkčnost pro uživatele ReadyNAS.

Pro konfiguraci e-mailu na zařízeních ReadyNAS přistupte k webovému rozhraní zařízení přes jeho IP adresu. Přejděte do sekce Systém a vyberte „Oznámení“ pro přístup k možnostem konfigurace e-mailu.

V sekci konfigurace e-mailu povolte e-mailová oznámení a zadejte smtp.forwardemail.net jako SMTP server. To je zásadní – použijte legacy kompatibilní porty Forward Email místo standardních SMTP portů.

Pro SSL/TLS připojení nastavte port 2455 místo standardního portu 465 (doporučeno). Pro STARTTLS připojení použijte port 2555 místo portu 587. Tyto speciální porty zachovávají kompatibilitu s TLS 1.0 a zároveň poskytují nejlepší dostupné zabezpečení pro legacy zařízení.
Zadejte svůj Forward Email alias jako uživatelské jméno a vygenerované heslo pro ověření. Zařízení ReadyNAS podporují SMTP autentizaci, která je vyžadována pro připojení Forward Email.

Nakonfigurujte odesílací e-mailovou adresu a adresy příjemců podle vašich požadavků na oznámení. ReadyNAS umožňuje více adres příjemců, což vám umožní rozesílat upozornění různým členům týmu nebo e-mailovým účtům.

Pečlivě otestujte konfiguraci, protože zařízení ReadyNAS nemusí poskytovat podrobné chybové zprávy, pokud konfigurace selže. Pokud standardní testování nefunguje, ověřte, že používáte správné starší porty (2455 nebo 2555) místo moderních SMTP portů.

Zvažte bezpečnostní důsledky používání starších TLS protokolů. Zatímco starší porty Forward Email poskytují nejlepší dostupnou bezpečnost pro starší zařízení, doporučuje se, pokud je to možné, přejít na moderní NAS systém s aktuální podporou TLS.


## Konfigurace TerraMaster NAS {#terramaster-nas-configuration}

Zařízení TerraMaster s TOS 6.x podporují moderní TLS a dobře fungují se standardními porty Forward Email.

> \[!NOTE]
> TerraMaster TOS 6.x nabízí komplexní funkce e-mailových oznámení. Ujistěte se, že máte nejnovější firmware pro nejlepší kompatibilitu.

1. **Přístup do systémových nastavení**
   * Přihlaste se do webového rozhraní TerraMaster
   * Přejděte na **Ovládací panel** > **Oznámení**

2. **Nastavení SMTP**
   * Server: `smtp.forwardemail.net`
   * Port: `465` (SSL/TLS, doporučeno) nebo `587` (STARTTLS)
   * Uživatelské jméno: Váš Forward Email alias
   * Heslo: Vygenerované heslo z [Můj účet -> Domény -> Aliasy](https://forwardemail.net/my-account/domains)

3. **Povolení oznámení**
   * Zaškrtněte typy oznámení, která chcete přijímat
   * Otestujte konfiguraci pomocí vestavěné testovací funkce

> \[!TIP]
> Zařízení TerraMaster nejlépe fungují s portem `465` pro SSL/TLS připojení (doporučeno). Pokud narazíte na problémy, je podporován také port `587` s STARTTLS.


## Konfigurace ASUSTOR NAS {#asustor-nas-configuration}

Zařízení ASUSTOR s ADM 4.x mají solidní podporu e-mailových oznámení a bezproblémově fungují s Forward Email.

> \[!NOTE]
> ASUSTOR ADM 4.x obsahuje pokročilé možnosti filtrování oznámení. Můžete si přizpůsobit, které události spouští e-mailová upozornění.

1. **Otevření nastavení oznámení**
   * Přístup do webového rozhraní ADM
   * Přejděte na **Nastavení** > **Oznámení**

2. **Nastavení SMTP**
   * SMTP server: `smtp.forwardemail.net`
   * Port: `465` (SSL/TLS, doporučeno) nebo `587` (STARTTLS)
   * Autentizace: Povolit
   * Uživatelské jméno: Váš Forward Email alias
   * Heslo: Vygenerované heslo z [Můj účet -> Domény -> Aliasy](https://forwardemail.net/my-account/domains)

3. **Nastavení typů upozornění**
   * Vyberte systémové události, které mají spouštět e-maily
   * Nastavte adresy příjemců
   * Otestujte konfiguraci

> \[!IMPORTANT]
> Zařízení ASUSTOR vyžadují, aby byla autentizace v SMTP nastaveních explicitně povolena. Nezapomeňte tuto možnost zaškrtnout.


## Konfigurace Buffalo TeraStation {#buffalo-terastation-configuration}

Zařízení Buffalo TeraStation mají omezené, ale funkční možnosti e-mailových oznámení. Nastavení je jednoduché, jakmile víte, kde hledat.

> \[!CAUTION]
> Aktualizace firmwaru Buffalo TeraStation jsou zřídka. Ujistěte se, že používáte nejnovější dostupný firmware pro váš model před konfigurací e-mailu.

1. **Přístup k webovému nastavení**
   * Připojte se k webovému rozhraní TeraStation
   * Přejděte na **Systém** > **Oznámení**

2. **Nastavení e-mailu**
   * SMTP server: `smtp.forwardemail.net`
   * Port: `465` (SSL/TLS, doporučeno) nebo `587` (STARTTLS)
   * Uživatelské jméno: Váš Forward Email alias
   * Heslo: Vygenerované heslo z [Můj účet -> Domény -> Aliasy](https://forwardemail.net/my-account/domains)
   * Povolit šifrování SSL/TLS

3. **Nastavení preferencí oznámení**
   * Vyberte události, které spouští e-maily (chyby disku, teplotní výstrahy atd.)
   * Zadejte e-mailové adresy příjemců
   * Uložte a otestujte konfiguraci

> \[!NOTE]
> Některé starší modely TeraStation mohou mít omezené možnosti nastavení SMTP. Zkontrolujte dokumentaci vašeho modelu pro specifické funkce.
## Konfigurace Western Digital My Cloud {#western-digital-my-cloud-configuration}

Zařízení Western Digital My Cloud s OS 5 podporují e-mailová upozornění, i když je rozhraní v nastavení trochu skryté.

> \[!WARNING]
> Western Digital ukončil podporu mnoha modelů My Cloud. Zkontrolujte, zda vaše zařízení stále dostává aktualizace firmwaru, než se spolehnete na e-mailová upozornění pro kritické výstrahy.

1. **Přejděte do Nastavení**
   * Otevřete webový panel My Cloud
   * Jděte do **Nastavení** > **Obecné** > **Upozornění**

2. **Nastavte SMTP údaje**
   * Poštovní server: `smtp.forwardemail.net`
   * Port: `465` (SSL/TLS, doporučeno) nebo `587` (STARTTLS)
   * Uživatelské jméno: Váš Forward Email alias
   * Heslo: Vygenerované heslo z [Můj účet -> Domény -> Aliasy](https://forwardemail.net/my-account/domains)
   * Povolit šifrování

3. **Nastavte typy upozornění**
   * Vyberte kategorie upozornění (systémové výstrahy, stav disku atd.)
   * Přidejte e-mailové adresy příjemců
   * Otestujte konfiguraci e-mailu

> \[!TIP]
> Doporučujeme používat port `465` s SSL/TLS. Pokud narazíte na problémy, je podporován také port `587` s STARTTLS.


## Konfigurace e-mailu TrueNAS {#truenas-email-configuration}

TrueNAS (SCALE i CORE) nabízí vynikající podporu e-mailových upozornění s podrobnými možnostmi konfigurace.

> \[!NOTE]
> TrueNAS poskytuje jedny z nejkomplexnějších funkcí e-mailových upozornění mezi NAS systémy. Můžete nastavit podrobné pravidla výstrah a více příjemců.

1. **Přístup do systémových nastavení**
   * Přihlaste se do webového rozhraní TrueNAS
   * Přejděte do **Systém** > **E-mail**

2. **Nastavte SMTP parametry**
   * Odchozí poštovní server: `smtp.forwardemail.net`
   * Port poštovního serveru: `465` (doporučeno) nebo `587`
   * Zabezpečení: SSL/TLS (pro 465, doporučeno) nebo STARTTLS (pro 587)
   * Uživatelské jméno: Váš Forward Email alias
   * Heslo: Vygenerované heslo z [Můj účet -> Domény -> Aliasy](https://forwardemail.net/my-account/domains)

3. **Nastavte upozornění**
   * Jděte do **Systém** > **Služby upozornění**
   * Nakonfigurujte, která upozornění mají být odesílána e-mailem
   * Nastavte adresy příjemců a úrovně upozornění
   * Otestujte konfiguraci pomocí vestavěné testovací funkce

> \[!IMPORTANT]
> TrueNAS umožňuje nastavit různé úrovně upozornění (INFO, NOTICE, WARNING, ERROR, CRITICAL). Vyberte vhodné úrovně, abyste se vyhnuli spamu v e-mailech a zároveň zajistili hlášení kritických problémů.


## Konfigurace OpenMediaVault {#openmediavault-configuration}

OpenMediaVault nabízí solidní možnosti e-mailových upozornění prostřednictvím svého webového rozhraní. Proces nastavení je čistý a přehledný.

> \[!NOTE]
> Systém upozornění OpenMediaVault je založen na pluginech. Ujistěte se, že máte nainstalovaný a povolený plugin pro e-mailová upozornění.

1. **Přístup do nastavení upozornění**
   * Otevřete webové rozhraní OpenMediaVault
   * Jděte do **Systém** > **Upozornění** > **E-mail**

2. **Nastavte SMTP parametry**
   * SMTP server: `smtp.forwardemail.net`
   * Port: `465` (SSL/TLS, doporučeno) nebo `587` (STARTTLS)
   * Uživatelské jméno: Váš Forward Email alias
   * Heslo: Vygenerované heslo z [Můj účet -> Domény -> Aliasy](https://forwardemail.net/my-account/domains)
   * Povolit SSL/TLS

3. **Nastavte pravidla upozornění**
   * Přejděte do **Systém** > **Upozornění** > **Upozornění**
   * Nakonfigurujte, které systémové události mají spouštět e-maily
   * Nastavte adresy příjemců
   * Otestujte funkčnost e-mailu

> \[!TIP]
> OpenMediaVault umožňuje nastavit rozvrhy upozornění. Můžete nastavit tiché hodiny nebo omezit frekvenci upozornění, abyste nebyli zahlceni výstrahami.


## Konfigurace Raspberry Pi NAS {#raspberry-pi-nas-configuration}

Raspberry Pi představuje vynikající vstupní bod do funkcionality NAS, nabízí cenově dostupné řešení pro domácí a malé kancelářské prostředí. Nastavení Raspberry Pi jako NAS zařízení zahrnuje konfiguraci protokolů sdílení souborů, e-mailových upozornění a základních síťových služeb.

> \[!TIP]
> Pro nadšence Raspberry Pi důrazně doporučujeme doplnit vaše NAS nastavení o [PiKVM](https://pikvm.org/) pro vzdálenou správu serveru a [Pi-hole](https://pi-hole.net/) pro blokování reklam a správu DNS v celé síti. Tyto nástroje vytvářejí komplexní domácí laboratorní prostředí.
### Počáteční nastavení Raspberry Pi {#initial-raspberry-pi-setup}

Před konfigurací NAS služeb se ujistěte, že váš Raspberry Pi běží na nejnovější verzi Raspberry Pi OS a má dostatečné úložiště. Vysoce kvalitní microSD karta (třída 10 nebo lepší) nebo USB 3.0 SSD poskytují lepší výkon a spolehlivost pro NAS operace.

1. **Aktualizujte systém** spuštěním `sudo apt update && sudo apt upgrade -y`, aby byly všechny balíčky aktuální.

2. **Povolte přístup přes SSH** pomocí `sudo systemctl enable ssh && sudo systemctl start ssh` pro vzdálenou správu.

3. **Nakonfigurujte statickou IP adresu** úpravou souboru `/etc/dhcpcd.conf` pro zajištění konzistentního síťového přístupu.

4. **Nastavte externí úložiště** připojením a přimountováním USB disků nebo konfigurací RAID polí pro redundanci dat.

### Konfigurace sdílení souborů Samba {#samba-file-sharing-configuration}

Samba poskytuje sdílení souborů kompatibilní s Windows, díky čemuž je váš Raspberry Pi přístupný z jakéhokoli zařízení ve vaší síti. Proces konfigurace zahrnuje instalaci Samby, vytváření sdílených složek a nastavení uživatelské autentizace.

Nainstalujte Sambu pomocí `sudo apt install samba samba-common-bin` a nakonfigurujte hlavní konfigurační soubor v `/etc/samba/smb.conf`. Vytvořte sdílené adresáře a nastavte odpovídající oprávnění pomocí `sudo mkdir -p /srv/samba/shared && sudo chmod 755 /srv/samba/shared`.

Konfigurujte Samba sdílení přidáním sekcí do konfiguračního souboru pro každý sdílený adresář. Nastavte uživatelskou autentizaci pomocí `sudo smbpasswd -a username` pro vytvoření Samba-specifických hesel pro přístup v síti.

> \[!IMPORTANT]
> Vždy používejte silná hesla pro Samba uživatele a zvažte povolení přístupu hosta pouze pro nesenzitivní sdílené složky. Pro pokročilé bezpečnostní konfigurace si prostudujte [oficiální dokumentaci Samby](https://www.samba.org/samba/docs/current/man-html/smb.conf.5.html).

### Nastavení FTP serveru {#ftp-server-setup}

FTP poskytuje další způsob přístupu k souborům, zvláště užitečný pro automatizované zálohy a vzdálenou správu souborů. Nainstalujte a nakonfigurujte vsftpd (Very Secure FTP Daemon) pro spolehlivé FTP služby.

Nainstalujte vsftpd pomocí `sudo apt install vsftpd` a nakonfigurujte službu úpravou `/etc/vsftpd.conf`. Povolte přístup lokálních uživatelů, nastavte pasivní režim a nakonfigurujte odpovídající bezpečnostní omezení.

Vytvořte FTP uživatele a nastavte oprávnění pro přístup k adresářům. Zvažte použití SFTP (SSH File Transfer Protocol) místo tradičního FTP pro zvýšenou bezpečnost, protože šifruje veškerý přenos dat.

> \[!CAUTION]
> Tradiční FTP přenáší hesla v prostém textu. Vždy používejte SFTP nebo nakonfigurujte FTP s TLS šifrováním pro bezpečný přenos souborů. Před nasazením si prostudujte [bezpečnostní doporučení vsftpd](https://security.appspot.com/vsftpd.html).

### Konfigurace emailových notifikací {#email-notification-configuration}

Nakonfigurujte váš Raspberry Pi NAS tak, aby odesílal emailová upozornění na systémové události, výstrahy úložiště a stav dokončení záloh. To zahrnuje instalaci a konfiguraci mail transfer agenta a nastavení integrace Forward Email.

Nainstalujte `msmtp` jako lehkého SMTP klienta pomocí `sudo apt install msmtp msmtp-mta`. Vytvořte konfigurační soubor v `/etc/msmtprc` s následujícími nastaveními:

```
defaults
auth           on
tls            on
tls_trust_file /etc/ssl/certs/ca-certificates.crt
logfile        /var/log/msmtp.log

account        forwardemail
host           smtp.forwardemail.net
port           465
tls_starttls   off
from           your-alias@yourdomain.com
user           your-alias@yourdomain.com
password       your-generated-password
```

Nakonfigurujte systémová upozornění nastavením cron úloh a skriptů pro monitorování systému, které používají `msmtp` k odesílání upozornění. Vytvořte skripty pro sledování volného místa na disku, teplotních výstrah a notifikací o dokončení záloh.

### Pokročilé funkce Raspberry Pi NAS {#advanced-raspberry-pi-nas-features}

Vylepšete svůj Raspberry Pi NAS o další služby a monitorovací schopnosti. Nainstalujte a nakonfigurujte nástroje pro síťový monitoring, automatizovaná zálohovací řešení a služby vzdáleného přístupu.

Nastavte [Nextcloud](https://nextcloud.com/) pro cloudovou funkcionalitu s webovým přístupem k souborům, synchronizací kalendáře a kolaborativními funkcemi. Instalujte pomocí Dockeru nebo oficiálního instalačního průvodce Nextcloudu pro Raspberry Pi.
Nakonfigurujte automatizované zálohy pomocí `rsync` a `cron` pro vytváření plánovaných záloh kritických dat. Nastavte e-mailová upozornění na dokončení zálohy a výstrahy při selhání pomocí vaší konfigurace Forward Email.

Implementujte monitorování sítě pomocí nástrojů jako [Nagios](https://www.nagios.org/) nebo [Zabbix](https://www.zabbix.com/) pro sledování stavu systému, síťové konektivity a dostupnosti služeb.

> \[!NOTE]
> Pro uživatele spravující síťovou infrastrukturu zvažte integraci [Switchbot](https://www.reddit.com/r/pikvm/comments/skhxkm/pikvm_with_switchbot/) s vaším nastavením PiKVM pro vzdálené fyzické ovládání přepínačů. Tento [Python integrační průvodce](https://www.reddit.com/r/pikvm/comments/skhxkm/pikvm_with_switchbot/) poskytuje podrobné instrukce pro automatizaci správy fyzických zařízení.

### Řešení problémů s e-mailem na Raspberry Pi {#raspberry-pi-email-troubleshooting}

Běžné problémy s konfigurací e-mailu na Raspberry Pi zahrnují potíže s DNS rozlišením, omezení firewallu a selhání autentizace. Lehká povaha systémů Raspberry Pi může někdy způsobovat časové problémy s SMTP připojeními.

Pokud e-mailová upozornění selhávají, zkontrolujte log soubor `msmtp` na `/var/log/msmtp.log` pro podrobné chybové zprávy. Ověřte, že vaše přihlašovací údaje Forward Email jsou správné a že Raspberry Pi dokáže rozlišit `smtp.forwardemail.net`.

Otestujte funkčnost e-mailu pomocí příkazové řádky: `echo "Test message" | msmtp recipient@example.com`. To pomáhá izolovat problémy konfigurace od problémů specifických pro aplikaci.

Nakonfigurujte správná DNS nastavení v `/etc/resolv.conf`, pokud narazíte na problémy s DNS rozlišením. Zvažte použití veřejných DNS serverů jako `8.8.8.8` nebo `1.1.1.1`, pokud je lokální DNS nespolehlivé.

### Optimalizace výkonu {#performance-optimization}

Optimalizujte výkon vašeho Raspberry Pi NAS správnou konfigurací úložiště, síťových nastavení a systémových zdrojů. Používejte kvalitní úložná zařízení a nastavte vhodné možnosti souborového systému pro váš případ použití.

Povolte USB 3.0 boot pro lepší výkon úložiště, pokud používáte externí disky. Nakonfigurujte rozdělení paměti GPU pomocí `sudo raspi-config` tak, aby bylo více RAM přiděleno systémovým operacím než grafickému zpracování.

Sledujte výkon systému pomocí nástrojů jako `htop`, `iotop` a `nethogs` pro identifikaci úzkých míst a optimalizaci využití zdrojů. Zvažte upgrade na Raspberry Pi 4 s 8GB RAM pro náročné NAS aplikace.

Implementujte vhodná chladicí řešení, aby nedocházelo k tepelnému škrcení během intenzivních operací. Sledujte teplotu CPU pomocí `/opt/vc/bin/vcgencmd measure_temp` a zajistěte dostatečné větrání.

### Bezpečnostní aspekty {#security-considerations}

Zabezpečte svůj Raspberry Pi NAS implementací správných přístupových kontrol, bezpečnostních opatření sítě a pravidelných bezpečnostních aktualizací. Změňte výchozí hesla, zakažte nepotřebné služby a nakonfigurujte pravidla firewallu.

Nainstalujte a nakonfigurujte `fail2ban` pro ochranu proti útokům hrubou silou na SSH a další služby. Nastavte automatické bezpečnostní aktualizace pomocí `unattended-upgrades`, aby byly kritické bezpečnostní záplaty aplikovány včas.

Nakonfigurujte segmentaci sítě pro izolaci vašeho NAS od ostatních síťových zařízení, pokud je to možné. Používejte VPN přístup pro vzdálená připojení místo přímého vystavení služeb na internetu.

Pravidelně zálohujte konfiguraci a data Raspberry Pi, abyste předešli ztrátě dat při selhání hardwaru nebo bezpečnostních incidentech. Testujte postupy obnovy záloh, abyste zajistili schopnost obnovy dat.

Konfigurace Raspberry Pi NAS poskytuje vynikající základ pro učení konceptů síťového úložiště a zároveň nabízí praktickou funkčnost pro domácí a malé kancelářské prostředí. Kombinace s Forward Email zajišťuje spolehlivé doručení upozornění pro sledování systému a údržbové výstrahy.
