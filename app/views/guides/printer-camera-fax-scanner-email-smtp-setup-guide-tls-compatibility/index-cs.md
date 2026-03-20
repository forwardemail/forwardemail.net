# Kompletní průvodce nastavením e-mailu pro tiskárny, kamery, faxy a skenery {#complete-guide-to-printer-camera-fax--scanner-email-setup}

Vaše kancelářské zařízení potřebuje odesílat e-maily – tiskárny upozorňují na stav toneru, IP kamery informují o detekci pohybu, faxové přístroje hlásí stav přenosu a skenery potvrzují zpracování dokumentů. Problém? Většina poskytovatelů e-mailů přestala podporovat starší zařízení, což znamená, že vaše zařízení nemohou odesílat oznámení.

[Microsoft Office 365 ukončil podporu TLS 1.0 a TLS 1.1 v lednu 2022](https://learn.microsoft.com/en-us/troubleshoot/exchange/email-delivery/fix-issues-with-printers-scanners-and-lob-applications-that-send-email-using-off), což způsobilo přerušení e-mailové komunikace u tisíců zařízení. Mnoho tiskáren, kamer a faxů vyrobených před rokem 2020 podporuje pouze tyto starší protokoly a nelze je aktualizovat.

Forward Email toto řeší podporou jak moderních, tak i starších zařízení. Máme vyhrazené porty pro současné zařízení a speciální porty pro starší zařízení, která nelze upgradovat.

> \[!IMPORTANT]
> Forward Email podporuje jak moderní, tak i starší zařízení díky naší strategii s dvojím portem. Použijte port `465` (SSL/TLS, doporučeno) nebo `587` (STARTTLS) pro moderní zařízení s podporou TLS 1.2+, a porty `2455`/`2555` pro starší zařízení, která podporují pouze TLS 1.0.


## Obsah {#table-of-contents}

* [Vysvětlení problému s TLS](#the-tls-problem-explained)
* [Přehled konfigurace SMTP ve Forward Email](#forward-email-smtp-configuration-overview)
* [Komplexní matice kompatibility zařízení](#comprehensive-device-compatibility-matrix)
* [Konfigurace e-mailu pro tiskárny HP](#hp-printer-email-configuration)
  * [Moderní tiskárny HP (2020 a novější)](#modern-hp-printers-2020-and-later)
  * [Starší tiskárny HP (modely před rokem 2020)](#legacy-hp-printers-pre-2020-models)
* [Konfigurace e-mailu pro tiskárny Canon](#canon-printer-email-configuration)
  * [Současné tiskárny Canon](#current-canon-printers)
  * [Starší tiskárny Canon](#legacy-canon-printers)
* [Konfigurace e-mailu pro tiskárny Brother](#brother-printer-email-configuration)
  * [Konfigurace série Brother MFC](#brother-mfc-series-configuration)
  * [Řešení problémů s e-mailem Brother](#troubleshooting-brother-email-issues)
* [Konfigurace e-mailu pro IP kamery Foscam](#foscam-ip-camera-email-configuration)
  * [Pochopení omezení e-mailu Foscam](#understanding-foscam-email-limitations)
  * [Kroky konfigurace e-mailu Foscam](#foscam-email-configuration-steps)
  * [Pokročilá konfigurace Foscam](#advanced-foscam-configuration)
* [Konfigurace e-mailu pro bezpečnostní kamery Hikvision](#hikvision-security-camera-email-configuration)
  * [Konfigurace moderních kamer Hikvision](#modern-hikvision-camera-configuration)
  * [Konfigurace starších kamer Hikvision](#legacy-hikvision-camera-configuration)
* [Konfigurace e-mailu pro bezpečnostní kamery Dahua](#dahua-security-camera-email-configuration)
  * [Nastavení e-mailu pro kamery Dahua](#dahua-camera-email-setup)
  * [Konfigurace e-mailu pro NVR Dahua](#dahua-nvr-email-configuration)
* [Konfigurace e-mailu pro multifunkční zařízení Xerox](#xerox-multifunction-device-email-configuration)
  * [Nastavení e-mailu pro Xerox MFD](#xerox-mfd-email-setup)
* [Konfigurace e-mailu pro multifunkční zařízení Ricoh](#ricoh-multifunction-device-email-configuration)
  * [Konfigurace moderních Ricoh MFD](#modern-ricoh-mfd-configuration)
  * [Konfigurace starších zařízení Ricoh](#legacy-ricoh-device-configuration)
* [Řešení běžných problémů s konfigurací](#troubleshooting-common-configuration-issues)
  * [Problémy s autentizací a přihlašovacími údaji](#authentication-and-credential-issues)
  * [Problémy s TLS a šifrováním](#tls-and-encryption-problems)
  * [Problémy s připojením k síti](#network-connectivity-issues)
  * [Výzvy specifické pro konfiguraci zařízení](#device-specific-configuration-challenges)
* [Bezpečnostní aspekty a osvědčené postupy](#security-considerations-and-best-practices)
  * [Správa přihlašovacích údajů](#credential-management)
  * [Síťová bezpečnost](#network-security)
  * [Zveřejňování informací](#information-disclosure)
  * [Monitorování a údržba](#monitoring-and-maintenance)
* [Závěr](#conclusion)
## Vysvětlení problému s TLS {#the-tls-problem-explained}

Stalo se toto: bezpečnost e-mailů se zpřísnila, ale vaše zařízení o tom nedostala zprávu. Moderní vybavení podporuje TLS 1.2 a vyšší, ale starší zařízení jsou uvězněna u TLS 1.0. Většina poskytovatelů e-mailu přestala podporovat TLS 1.0, takže se vaše zařízení nemohou připojit.

To ovlivňuje reálný provoz – bezpečnostní kamery nemohou během incidentů posílat upozornění, tiskárny nemohou varovat před údržbou a potvrzení faxů se ztrácejí. Konfigurace [SMTP serveru Forward Email](https://forwardemail.net/en/faq#what-are-your-smtp-server-configuration-settings) nabízí více portů, aby vše fungovalo.

> \[!TIP]
> Před konfigurací zkontrolujte verzi firmwaru a podporu TLS vašeho zařízení. Většina zařízení vyrobených po roce 2020 podporuje moderní protokoly TLS, zatímco starší zařízení obvykle vyžadují porty pro kompatibilitu s legacy protokoly.


## Přehled konfigurace SMTP Forward Email {#forward-email-smtp-configuration-overview}

Forward Email poskytuje komplexní SMTP službu navrženou speciálně k řešení jedinečných výzev konfigurace e-mailů na zařízeních. Naše infrastruktura podporuje více typů připojení a úrovní zabezpečení, což zajišťuje kompatibilitu jak s nejmodernějším vybavením, tak se staršími zařízeními, která jsou stále v aktivním provozu.

Pro moderní zařízení s podporou TLS 1.2 a vyšší používejte náš primární SMTP server na smtp.forwardemail.net s portem 465 pro SSL/TLS připojení (doporučeno) nebo portem 587 pro STARTTLS připojení. Tyto porty poskytují bezpečnost na úrovni podniků a jsou kompatibilní se všemi aktuálními verzemi firmwaru zařízení.

Starší zařízení, která podporují pouze TLS 1.0, mohou využít naše specializované kompatibilní porty. Port 2455 poskytuje SSL/TLS připojení s podporou TLS 1.0, zatímco port 2555 nabízí STARTTLS s kompatibilitou legacy protokolů. Tyto porty udržují co nejvyšší možnou bezpečnost a zároveň zajišťují pokračující funkčnost staršího vybavení.

Pro všechna připojení je vyžadována autentizace pomocí vašeho aliasu Forward Email jako uživatelského jména a vygenerovaného hesla z [Můj účet -> Domény -> Aliasy](https://forwardemail.net/my-account/domains). Tento přístup poskytuje robustní zabezpečení a zároveň širokou kompatibilitu s různými autentizačními systémy zařízení.

> \[!CAUTION]
> Nikdy nepoužívejte heslo svého účtu pro SMTP autentizaci. Vždy používejte vygenerované heslo z [Můj účet -> Domény -> Aliasy](https://forwardemail.net/my-account/domains) pro konfiguraci zařízení.


## Komplexní matice kompatibility zařízení {#comprehensive-device-compatibility-matrix}

Pochopení, která zařízení vyžadují podporu legacy protokolů a která moderní konfiguraci, pomáhá zjednodušit proces nastavení a zajišťuje spolehlivé doručování e-mailů v celém ekosystému vašich zařízení.

| Kategorie zařízení        | Podpora moderního TLS | Vyžaduje legacy TLS | Doporučené porty | Běžné problémy                                                                                                                                      | Průvodce nastavením / screenshoty                                                                                                                |
| ------------------------ | --------------------- | ------------------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| HP tiskárny (2020+)      | ✅ TLS 1.2+            | ❌                  | `465`, `587`     | [Ověření certifikátu](https://h30434.www3.hp.com/t5/Scanning-Faxing-Copying/Scan-to-E-Mail-newer-MFP-Pro-printers-SMTP-Certificate/td-p/9194707) | [Průvodce nastavením HP LaserJet Pro MFP](https://support.hp.com/us-en/document/ish_6185297-6063300-16)                                           |
| HP tiskárny (před 2020)  | ❌                     | ✅ pouze TLS 1.0    | `2455`, `2555`   | [Omezení firmwaru](https://www.reddit.com/r/sysadmin/comments/1gnpac4/printers_dont_have_tls_settings/)                                            | [Průvodce funkcí Scan to Email](https://support.hp.com/us-en/document/ish_6518575-6518545-16)                                                     |
| Canon tiskárny (současné)| ✅ TLS 1.2+            | ❌                  | `465`, `587`     | [Nastavení autentizace](https://community.usa.canon.com/t5/Office-Printers/MF733CDW-Cannot-Scan-to-Email-with-SMTP-Auth-Error-806/td-p/265358)    | [Průvodce autentizací SMTP Canon](https://oip.manual.canon/USRMA-0320-zz-CS-enUV/contents/1T0003111775.html)                                      |
| Canon tiskárny (legacy)  | ❌                     | ✅ pouze TLS 1.0    | `2455`, `2555`   | [Problémy s certifikátem](https://community.usa.canon.com/t5/Office-Printers/MF735cx-quot-Register-quot-Certificate-produces-error/td-p/245443)   | [Pokročilý průvodce nastavením e-mailu](https://oip.manual.canon/USRMA-0163-zz-CS-enGB/contents/08025025.html)                                   |
| Brother tiskárny (současné)| ✅ TLS 1.2+          | ❌                  | `465`, `587`     | [Konfigurace portu](https://www.reddit.com/r/techsupport/comments/1548u4o/brother_printer_not_taking_scan_to_email_config/)                       | [Průvodce nastavením SMTP Brother](https://support.brother.com/g/b/faqend.aspx?c=us&lang=en&prod=mfcl2690dw_us&faqid=faq00100234_512)           |
| Epson tiskárny (současné)| ✅ TLS 1.2+            | ❌                  | `465`, `587`     | Přístup k webovému rozhraní                                                                                                                        | [Nastavení e-mailových upozornění Epson](https://download4.epson.biz/sec_pubs/l6580_series/useg/en/GUID-5FED5794-3E76-4DE9-8B9D-EBD8F60F231C.htm) |
| Foscam IP kamery         | ❌                     | ✅ pouze TLS 1.0    | `2455`, `2555`   | [Ověření certifikátu](https://ipcamtalk.com/threads/foscam-ip-cameras-stopped-sending-email-in-motion-detection.80152/)                           | [FAQ nastavení e-mailu Foscam](https://www.foscam.com/faqs/view.html?id=63)                                                                     |
| Hikvision (2020+)        | ✅ TLS 1.2+            | ❌                  | `465`, `587`     | Požadavky na SSL                                                                                                                                   | [Průvodce nastavením e-mailu Hikvision](https://www.hikvision.com/content/dam/hikvision/ca/how-to-document/How-to-setup-email-on-Hikvision-nvr-dvr.pdf) |
| Hikvision (legacy)       | ❌                     | ✅ pouze TLS 1.0    | `2455`, `2555`   | Aktualizace firmwaru                                                                                                                                | [Konfigurace legacy Hikvision](https://www.hikvision.com/content/dam/hikvision/ca/how-to-document/How-to-setup-email-on-Hikvision-nvr-dvr.pdf)  |
| Dahua kamery (současné) | ✅ TLS 1.2+            | ❌                  | `465`, `587`     | Autentizace                                                                                                                                         | [Wiki nastavení e-mailu Dahua](https://dahuawiki.com/Email/Email_Notifications_Setup_GMail)                                                     |
| Xerox MFD (současné)     | ✅ TLS 1.2+            | ❌                  | `465`, `587`     | [Konfigurace TLS](https://www.support.xerox.com/en-us/article/KB0032169)                                                                           | [Průvodce konfigurací TLS Xerox](https://www.support.xerox.com/en-us/article/KB0032169)                                                          |
| Ricoh MFD (současné)     | ✅ TLS 1.2+            | ❌                  | `465`, `587`     | Nastavení SSL                                                                                                                                       | [Konfigurace e-mailu Ricoh](https://www.ricoh.com/info/2025/0526_1)                                                                             |
| Ricoh MFD (legacy)       | ❌                     | ✅ pouze TLS 1.0    | `2455`, `2555`   | [Problémy se základní autentizací](https://www.ricoh.com/info/2025/0526_1)                                                                         | [Legacy nastavení Ricoh](https://www.ricoh.com/info/2025/0526_1)                                                                                |
Tato matice poskytuje rychlý přehled pro určení vhodného konfiguračního přístupu pro vaše konkrétní zařízení. V případě pochybností začněte s moderními porty a v případě problémů s připojením přejděte na starší porty.

> \[!NOTE]
> Věk zařízení není vždy spolehlivým ukazatelem podpory TLS. Někteří výrobci zpětně implementovali podporu TLS 1.2 do starších modelů prostřednictvím aktualizací firmwaru, zatímco jiní přestali podporovat starší produkty.


## Konfigurace e-mailu tiskáren HP {#hp-printer-email-configuration}

Tiskárny HP představují jednu z největších instalovaných základen síťově připojených tiskových zařízení, s modely od současné řady LaserJet Pro s plnou podporou TLS 1.3 až po starší modely, které podporují pouze TLS 1.0. Proces konfigurace se výrazně liší mezi moderními a staršími zařízeními, což vyžaduje různé přístupy pro optimální kompatibilitu.

### Moderní tiskárny HP (2020 a novější) {#modern-hp-printers-2020-and-later}

Moderní tiskárny HP zahrnují řadu LaserJet Pro MFP M404, Color LaserJet Pro MFP M479 a novější modely, které podporují aktuální standardy TLS. Tato zařízení poskytují komplexní možnosti e-mailových oznámení prostřednictvím rozhraní HP Embedded Web Server (EWS).

1. **Přístup k webovému rozhraní tiskárny** zadáním IP adresy tiskárny do webového prohlížeče. IP adresu najdete vytištěním stránky s konfigurací sítě z ovládacího panelu tiskárny.

2. **Přejděte na záložku Síť (Network)** a vyberte „E-mailový server“ nebo „Nastavení SMTP“ podle modelu tiskárny. Některé tiskárny HP tyto nastavení organizují pod „Systém“ > „E-mailová upozornění“.

3. **Nakonfigurujte nastavení SMTP serveru** zadáním `smtp.forwardemail.net` jako adresy serveru. Vyberte „SSL/TLS“ jako metodu šifrování a zadejte číslo portu `465` pro nejspolehlivější připojení.

4. **Nastavte ověřování** povolením SMTP autentizace a zadáním vašeho aliasu Forward Email jako uživatelského jména. Použijte heslo vygenerované z [Můj účet -> Domény -> Aliasy](https://forwardemail.net/my-account/domains), nikoli heslo k vašemu účtu.

5. **Nakonfigurujte informace o odesílateli** zadáním vašeho aliasu Forward Email jako adresy „Od“ a popisného jména, například „HP Printer - Office“, které pomůže identifikovat zdroj oznámení.

6. **Nastavte adresy příjemců** přidáním až pěti e-mailových adres, které mají přijímat oznámení z tiskárny. Tiskárny HP umožňují odesílat různé typy oznámení různým příjemcům.

7. **Otestujte konfiguraci** pomocí vestavěné funkce testu e-mailu tiskárny. Tiskárna odešle testovací zprávu, aby ověřila správnost nastavení a funkčnost komunikace se servery Forward Email.

> \[!TIP]
> Tiskárny HP často ukládají do mezipaměti DNS dotazy. Pokud narazíte na problémy s připojením, restartujte tiskárnu po konfiguraci, aby se vymazaly uložené DNS záznamy.

### Starší tiskárny HP (modely před rokem 2020) {#legacy-hp-printers-pre-2020-models}

Starší tiskárny HP, včetně LaserJet Pro MFP M277 a podobných modelů, často podporují pouze TLS 1.0 a vyžadují speciální konfiguraci pro práci s moderními poskytovateli e-mailů. Tato zařízení často zobrazují chyby „TLS certificate verification failed“ při pokusu o připojení na standardní SMTP porty.

1. **Přístup k Embedded Web Serveru tiskárny** zadáním IP adresy tiskárny do webového prohlížeče. Starší tiskárny HP mohou vyžadovat Internet Explorer nebo režim kompatibility pro plnou funkčnost.

2. **Přejděte do nastavení sítě nebo systému** a najděte sekci konfigurace „E-mail“ nebo „SMTP“. Přesné umístění se liší podle modelu a verze firmwaru.

3. **Nakonfigurujte starší SMTP nastavení Forward Email** zadáním smtp.forwardemail.net jako adresy serveru. Toto je zásadní – použijte port 2455 pro SSL/TLS připojení nebo port 2555 pro STARTTLS připojení místo standardních portů.

4. **Nastavte ověřování** povolením SMTP autentizace a zadáním vašeho aliasu Forward Email jako uživatelského jména. Pro autentizaci použijte vygenerované heslo Forward Email.

5. **Pečlivě nakonfigurujte nastavení šifrování**. Vyberte „SSL/TLS“, pokud používáte port 2455, nebo „STARTTLS“, pokud používáte port 2555. Některé starší tiskárny HP mohou tyto možnosti označovat jinak.
6. **Nastavte informace o odesílateli a příjemci** pomocí vašeho aliasu Forward Email jako adresy odesílatele a nakonfigurujte odpovídající adresy příjemců pro oznámení.

7. **Otestujte konfiguraci** pomocí testovací funkce tiskárny. Pokud test selže s chybami certifikátu, ověřte, že používáte správné legacy porty (2455 nebo 2555) místo standardních SMTP portů.

> \[!CAUTION]
> Legacy tiskárny HP nemusí dostávat aktualizace firmwaru, které řeší problémy s kompatibilitou TLS. Pokud konfigurace stále selhává, zvažte použití lokálního SMTP relay serveru jako mezikroku.


## Konfigurace e-mailu pro tiskárny Canon {#canon-printer-email-configuration}

Tiskárny Canon nabízejí robustní možnosti e-mailových oznámení napříč jejich produktovými řadami imageRUNNER, PIXMA a MAXIFY. Moderní zařízení Canon podporují komplexní konfigurace TLS, zatímco starší modely mohou vyžadovat specifická nastavení kompatibility pro fungování s aktuálními poskytovateli e-mailů.

### Současné tiskárny Canon {#current-canon-printers}

Moderní tiskárny Canon poskytují rozsáhlé funkce e-mailových oznámení prostřednictvím webového rozhraní Remote UI, podporující vše od základních upozornění o stavu až po podrobné notifikace správy zařízení.

1. **Přístup k Remote UI** zadáním IP adresy tiskárny do webového prohlížeče. Tiskárny Canon obvykle používají webové rozhraní pro všechny síťové konfigurační úlohy.

2. **Přejděte do Nastavení/Registrace** a vyberte „Správa zařízení“ z menu. Hledejte „Nastavení e-mailových oznámení“ nebo podobné možnosti v závislosti na modelu tiskárny.

3. **Nakonfigurujte SMTP server** kliknutím na „Přidat cíl“ a zadáním smtp.forwardemail.net jako adresy serveru. Vyberte „SSL“ nebo „TLS“ jako metodu šifrování.

4. **Nastavte číslo portu** na 465 pro SSL/TLS připojení (doporučeno) nebo 587 pro STARTTLS připojení. Tiskárny Canon jasně rozlišují tyto metody šifrování ve svém rozhraní.

5. **Nakonfigurujte autentizaci** povolením SMTP autentizace a zadáním vašeho aliasu Forward Email jako uživatelského jména. Použijte heslo vygenerované z [Můj účet -> Domény -> Aliasy](https://forwardemail.net/my-account/domains).

6. **Nastavte informace o odesílateli** zadáním vašeho aliasu Forward Email jako adresy odesílatele a nakonfigurujte popisné zobrazované jméno pro snadnou identifikaci oznámení.

7. **Nakonfigurujte typy oznámení** výběrem událostí, které mají spouštět e-mailová upozornění. Tiskárny Canon podporují detailní kontrolu nad typy oznámení, včetně chybových stavů, upozornění na údržbu a bezpečnostních událostí.

8. **Otestujte konfiguraci e-mailu** pomocí vestavěné testovací funkce Canon. Tiskárna odešle testovací oznámení pro ověření správné konfigurace a konektivity.

> \[!NOTE]
> Tiskárny Canon často poskytují podrobné chybové zprávy, které mohou pomoci při řešení problémů s konfigurací. Věnujte pozornost specifickým chybovým kódům pro rychlejší vyřešení problému.

### Legacy tiskárny Canon {#legacy-canon-printers}

Starší tiskárny Canon mohou mít omezenou podporu TLS a vyžadují pečlivou konfiguraci pro fungování s moderními poskytovateli e-mailů. Tato zařízení často potřebují legacy kompatibilní SMTP nastavení pro zachování funkčnosti e-mailových oznámení.

1. **Přístup k webovému rozhraní tiskárny** pomocí IP adresy zařízení. Legacy tiskárny Canon mohou vyžadovat specifická nastavení kompatibility prohlížeče pro plnou funkčnost.

2. **Přejděte do sekce konfigurace e-mailu** přes menu správy zařízení nebo nastavení sítě. Přesná cesta se liší podle modelu a verze firmwaru.

3. **Nakonfigurujte legacy SMTP nastavení Forward Email** zadáním smtp.forwardemail.net jako adresy serveru a použitím portu 2455 pro SSL připojení nebo portu 2555 pro STARTTLS připojení.

4. **Pečlivě nastavte autentizaci** povolením SMTP autentizace a použitím vašeho aliasu Forward Email a vygenerovaného hesla. Legacy tiskárny Canon mohou mít specifické požadavky na autentizaci.

5. **Nakonfigurujte šifrování** výběrem odpovídající TLS možnosti pro zvolený port. Ujistěte se, že metoda šifrování odpovídá konfiguraci portu (SSL pro 2455, STARTTLS pro 2555).
6. **Otestujte konfiguraci** a sledujte chyby ověřování certifikátu. Pokud problémy přetrvávají, ověřte, že používáte porty kompatibilní se staršími verzemi Forward Email místo standardních SMTP portů.

> \[!WARNING]
> Některé starší tiskárny Canon nemusí podporovat ověřování certifikátu serveru. Ačkoli to snižuje bezpečnost, může to být nezbytné pro pokračující funkčnost e-mailů na starších zařízeních.


## Konfigurace e-mailu tiskáren Brother {#brother-printer-email-configuration}

Tiskárny Brother, zejména série MFC a DCP, poskytují rozsáhlé možnosti skenování do e-mailu a notifikací. Mnoho uživatelů však hlásí potíže s konfigurací e-mailové funkce, zejména u Office 365 a dalších moderních poskytovatelů e-mailů, kteří zrušili podporu starších metod autentizace.

### Konfigurace série Brother MFC {#brother-mfc-series-configuration}

Multifunkční tiskárny Brother nabízejí rozsáhlé e-mailové funkce, ale konfigurace může být složitá kvůli různým možnostem autentizace a šifrování.

1. **Přístup k webovému rozhraní tiskárny** zadáním IP adresy tiskárny do webového prohlížeče. Tiskárny Brother poskytují komplexní webový konfigurační systém.

2. **Přejděte do nastavení sítě** a vyberte „Email/IFAX“ nebo „Scan to Email“ podle modelu tiskárny. Některé tiskárny Brother tyto nastavení řadí pod „Nastavení správce“.

3. **Nakonfigurujte nastavení SMTP serveru** zadáním smtp.forwardemail.net jako adresy serveru. Tiskárny Brother podporují šifrování SSL/TLS i STARTTLS.

4. **Nastavte správný port a šifrování** výběrem portu 465 se šifrováním SSL/TLS (doporučeno) nebo portu 587 se šifrováním STARTTLS. Tiskárny Brother tyto možnosti jasně označují ve svém rozhraní.

5. **Nakonfigurujte SMTP autentizaci** povolením autentizace a zadáním vašeho aliasu Forward Email jako uživatelského jména. Použijte heslo vygenerované v [Můj účet -> Domény -> Aliasy](https://forwardemail.net/my-account/domains).

6. **Nastavte informace o odesílateli** konfigurací vašeho aliasu Forward Email jako adresy odesílatele a přidejte popisné jméno pro identifikaci tiskárny v e-mailových notifikacích.

7. **Nakonfigurujte nastavení skenování do e-mailu** vytvořením položek v adresáři a výchozích nastavení skenování. Tiskárny Brother umožňují rozsáhlé přizpůsobení parametrů skenování a správy příjemců.

8. **Otestujte jak e-mailové notifikace, tak funkci skenování do e-mailu**, abyste zajistili kompletní konfiguraci. Tiskárny Brother poskytují samostatné testovací funkce pro různé e-mailové funkce.

> \[!TIP]
> Tiskárny Brother často vyžadují aktualizace firmwaru k vyřešení problémů s konfigurací e-mailu. Před řešením problémů s připojením zkontrolujte dostupnost aktualizací.

### Řešení problémů s e-mailem Brother {#troubleshooting-brother-email-issues}

Tiskárny Brother často čelí specifickým problémům s konfigurací, které lze vyřešit cílenými postupy řešení problémů.

Pokud vaše tiskárna Brother při testování konfigurace e-mailu zobrazuje chyby „Authentication Failed“, ověřte, že používáte svůj alias Forward Email (nikoli e-mail účtu) jako uživatelské jméno a heslo vygenerované v [Můj účet -> Domény -> Aliasy](https://forwardemail.net/my-account/domains). Tiskárny Brother jsou zvláště citlivé na formátování autentizačních údajů.

U tiskáren, které nepřijímají nastavení skenování do e-mailu, zkuste konfiguraci provést přes webové rozhraní místo ovládacího panelu tiskárny. Webové rozhraní často poskytuje podrobnější chybové zprávy a možnosti konfigurace.

Při chybách připojení SSL/TLS ověřte, že používáte správnou kombinaci portu a šifrování. Tiskárny Brother vyžadují přesnou shodu mezi číslem portu a metodou šifrování – port 465 musí používat SSL/TLS (doporučeno), zatímco port 587 musí používat STARTTLS.

> \[!CAUTION]
> Některé modely tiskáren Brother mají známé problémy s konkrétními konfiguracemi SMTP serveru. Pokud standardní konfigurace selže, konzultujte dokumentaci podpory Brother pro modelově specifická řešení.
## Konfigurace e-mailu pro Foscam IP kameru {#foscam-ip-camera-email-configuration}

Foscam IP kamery představují jednu z nejnáročnějších kategorií zařízení pro konfiguraci e-mailu kvůli jejich širokému používání zastaralých TLS protokolů a omezené dostupnosti aktualizací firmwaru. Většina Foscam kamer, včetně populárních modelů jako řada R2, podporuje pouze TLS 1.0 a nelze je aktualizovat na podporu moderních šifrovacích standardů.

### Pochopení omezení e-mailu u Foscam {#understanding-foscam-email-limitations}

Foscam kamery představují jedinečné výzvy, které vyžadují specifické konfigurační přístupy. Nejčastější chybovou zprávou je „TLS certificate verification failed: unable to get local issuer certificate“, což znamená, že kamera nemůže ověřit moderní SSL certifikáty používané většinou poskytovatelů e-mailu.

Tento problém vyplývá z několika faktorů: zastaralé úložiště certifikátů, které nelze aktualizovat, omezená podpora TLS protokolů, která končí na TLS 1.0, a omezení firmwaru, která brání upgradu bezpečnostních protokolů. Navíc mnoho modelů Foscam dosáhlo konce životnosti a již nedostává aktualizace firmwaru, které by mohly tyto problémy kompatibility řešit.

Legacy SMTP porty Forward Email tyto omezení řeší tím, že zachovávají kompatibilitu s TLS 1.0 a zároveň poskytují co nejvyšší možnou bezpečnost pro tato starší zařízení.

### Kroky konfigurace e-mailu pro Foscam {#foscam-email-configuration-steps}

Konfigurace e-mailových oznámení na Foscam kamerách vyžaduje pečlivou pozornost při výběru portu a nastavení šifrování, aby bylo možné obejít omezení TLS zařízení.

1. **Přístup do webového rozhraní kamery** zadáním IP adresy kamery do webového prohlížeče. Foscam kamery obvykle používají port 88 pro webový přístup (např. <http://192.168.1.100:88>).

2. **Přejděte do nabídky Nastavení** a vyberte „Mail Service“ nebo „Email Settings“ podle modelu vaší kamery. Některé Foscam kamery tyto nastavení řadí pod „Alarm“ > „Mail Service“.

3. **Nakonfigurujte SMTP server** zadáním smtp.forwardemail.net jako adresy serveru. Toto je zásadní – nepoužívejte SMTP servery běžných poskytovatelů e-mailu, protože již nepodporují TLS 1.0.

4. **Nastavte port a šifrování** výběrem portu 2455 pro SSL šifrování nebo portu 2555 pro STARTTLS šifrování. Toto jsou legacy kompatibilní porty Forward Email speciálně navržené pro zařízení jako Foscam kamery.

5. **Nakonfigurujte autentizaci** povolením SMTP autentizace a zadáním vašeho aliasu Forward Email jako uživatelského jména. Použijte heslo vygenerované v [Můj účet -> Domény -> Aliasy](https://forwardemail.net/my-account/domains).

6. **Nastavte informace o odesílateli a příjemci** konfigurací vašeho aliasu Forward Email jako adresy odesílatele a přidáním adres příjemců pro detekci pohybu a systémová upozornění.

7. **Nakonfigurujte spouštěče oznámení** nastavením citlivosti detekce pohybu, plánů nahrávání a dalších událostí, které by měly spustit e-mailová oznámení.

8. **Otestujte konfiguraci e-mailu** pomocí vestavěné testovací funkce Foscam. Pokud test uspěje, měli byste obdržet testovací e-mail potvrzující správnou konfiguraci.

> \[!IMPORTANT]
> Foscam kamery vyžadují legacy porty Forward Email (2455 nebo 2555) kvůli omezením TLS 1.0. Standardní SMTP porty s těmito zařízeními nefungují.

### Pokročilá konfigurace Foscam {#advanced-foscam-configuration}

Pro uživatele vyžadující sofistikovanější nastavení oznámení nabízejí Foscam kamery další možnosti konfigurace, které mohou zlepšit schopnosti bezpečnostního monitoringu.

Nakonfigurujte zóny detekce pohybu ke snížení falešných poplachů definováním konkrétních oblastí zorného pole kamery, které by měly spouštět oznámení. To zabraňuje zbytečným e-mailům způsobeným environmentálními faktory, jako jsou pohybující se stromy nebo projíždějící vozidla.

Nastavte plány nahrávání, které odpovídají vašim monitorovacím potřebám, aby byla e-mailová oznámení odesílána během vhodných časových období. Foscam kamery mohou během specifikovaných hodin potlačit oznámení, aby se předešlo nočním upozorněním na méně důležité události.
Nakonfigurujte více příjemců pro různé typy upozornění, což vám umožní směrovat upozornění na detekci pohybu bezpečnostnímu personálu a zároveň zasílat upozornění na údržbu systému IT pracovníkům.

> \[!TIP]
> Kamery Foscam mohou generovat značné množství e-mailů, pokud je detekce pohybu příliš citlivá. Začněte s konzervativními nastaveními a upravujte je podle charakteristik vašeho prostředí.


## Konfigurace e-mailu bezpečnostních kamer Hikvision {#hikvision-security-camera-email-configuration}

Kamery Hikvision představují významnou část globálního trhu bezpečnostních kamer, s modely od základních IP kamer až po pokročilé systémy dohledu s umělou inteligencí. Proces konfigurace e-mailu se výrazně liší mezi novějšími modely s moderní podporou TLS a staršími zařízeními, která vyžadují kompatibilní řešení.

### Moderní konfigurace kamer Hikvision {#modern-hikvision-camera-configuration}

Současné kamery Hikvision s nejnovějšími verzemi firmwaru podporují TLS 1.2+ a poskytují komplexní možnosti e-mailových oznámení prostřednictvím svého webového rozhraní.

1. **Přístup do webového rozhraní kamery** zadáním IP adresy kamery do webového prohlížeče. Kamery Hikvision obvykle používají standardní HTTP/HTTPS porty pro webový přístup.

2. **Přejděte do Konfigurace** a vyberte „Síť“ > „Pokročilá nastavení“ > „E-mail“ v menu. Přesná cesta se může lišit v závislosti na modelu kamery a verzi firmwaru.

3. **Nakonfigurujte SMTP server** zadáním smtp.forwardemail.net jako adresy serveru. Kamery Hikvision vyžadují specifické nastavení SSL pro správnou funkci e-mailu.

4. **Nastavte šifrování na SSL** a port 465. Kamery Hikvision nepodporují STARTTLS, proto je doporučené nastavení SSL šifrování na portu 465 pro kompatibilitu s Forward Email.

5. **Povolte SMTP autentizaci** a zadejte svůj Forward Email alias jako uživatelské jméno. Pro autentizaci použijte heslo vygenerované v [Můj účet -> Domény -> Aliasy](https://forwardemail.net/my-account/domains).

6. **Nakonfigurujte informace o odesílateli** nastavením vašeho Forward Email aliasu jako adresy odesílatele a přidejte popisné jméno pro identifikaci kamery v e-mailových oznámeních.

7. **Nastavte adresy příjemců** přidáním e-mailových adres, které mají dostávat bezpečnostní upozornění, oznámení o detekci pohybu a aktualizace stavu systému.

8. **Nakonfigurujte spouštěče událostí** nastavením detekce pohybu, detekce překročení čáry, detekce vniknutí a dalších událostí, které mají generovat e-mailová oznámení.

9. **Otestujte konfiguraci e-mailu** pomocí vestavěné testovací funkce Hikvision pro ověření správné konektivity a autentizace se servery Forward Email.

> \[!NOTE]
> Kamery Hikvision vyžadují nejnovější verze firmwaru pro správnou podporu SSL a TLS šifrování. Před konfigurací e-mailu zkontrolujte aktualizace firmwaru.

### Konfigurace starších kamer Hikvision {#legacy-hikvision-camera-configuration}

Starší kamery Hikvision mohou mít omezenou podporu TLS a vyžadují legacy kompatibilní SMTP porty Forward Email pro zachování funkčnosti e-mailu.

1. **Přístup do webového rozhraní kamery** a přejděte do sekce konfigurace e-mailu. Starší kamery Hikvision mohou mít odlišnou strukturu menu než současné modely.

2. **Nakonfigurujte legacy SMTP nastavení Forward Email** zadáním smtp.forwardemail.net jako adresy serveru a použitím portu 2455 pro SSL připojení.

3. **Nastavte autentizaci** pomocí vašeho Forward Email aliasu a vygenerovaného hesla. Starší kamery Hikvision mohou mít specifické požadavky nebo omezení na autentizaci.

4. **Nakonfigurujte nastavení šifrování** výběrem SSL šifrování odpovídající legacy portu. Ujistěte se, že metoda šifrování odpovídá požadavkům portu 2455.

5. **Otestujte konfiguraci** a sledujte případné chyby připojení. Starší kamery Hikvision mohou poskytovat omezené hlášení chyb, což ztěžuje řešení problémů.

> \[!WARNING]
> Starší kamery Hikvision mohou mít známé bezpečnostní zranitelnosti. Zajistěte, aby byla tato zařízení správně izolována v síti a pokud možno zvažte upgrade na aktuální modely.
## Konfigurace e-mailu bezpečnostních kamer Dahua {#dahua-security-camera-email-configuration}

Kamery Dahua poskytují robustní možnosti e-mailových oznámení napříč jejich rozsáhlou produktovou řadou, od základních IP kamer až po pokročilé systémy dohledu s umělou inteligencí. Proces konfigurace je obecně přímočarý u moderních zařízení s komplexní podporou aktuálních standardů TLS.

### Nastavení e-mailu kamer Dahua {#dahua-camera-email-setup}

Kamery Dahua nabízejí uživatelsky přívětivou konfiguraci e-mailu prostřednictvím svého webového rozhraní s dobrou kompatibilitou pro moderní SMTP standardy.

1. **Přístup k webovému rozhraní kamery** zadáním IP adresy kamery do webového prohlížeče. Kamery Dahua obvykle poskytují intuitivní webové konfigurační systémy.

2. **Přejděte do Nastavení** a vyberte „Síť“ > „E-mail“ v konfiguračním menu. Kamery Dahua organizují nastavení e-mailu v samostatné sekci pro snadný přístup.

3. **Nakonfigurujte SMTP server** zadáním smtp.forwardemail.net jako adresy serveru. Kamery Dahua podporují šifrovací metody SSL i STARTTLS.

4. **Nastavte port a šifrování** výběrem portu 465 s šifrováním SSL/TLS (doporučeno) nebo portu 587 se šifrováním STARTTLS.

5. **Povolte SMTP autentizaci** a zadejte svůj Forward Email alias jako uživatelské jméno. Použijte heslo vygenerované v [Můj účet -> Domény -> Aliasy](https://forwardemail.net/my-account/domains).

6. **Nakonfigurujte informace o odesílateli** nastavením svého Forward Email aliasu jako adresy odesílatele a přidáním popisného jména pro identifikaci zdroje kamery.

7. **Nastavte adresy příjemců** přidáním e-mailových adres pro různé typy oznámení. Kamery Dahua podporují více příjemců pro různé typy upozornění.

8. **Nakonfigurujte spouštěče událostí** nastavením detekce pohybu, upozornění na manipulaci a dalších bezpečnostních událostí, které by měly generovat e-mailová oznámení.

9. **Otestujte funkčnost e-mailu** pomocí vestavěné testovací funkce Dahua pro ověření správné konfigurace a konektivity.

> \[!TIP]
> Kamery Dahua často poskytují podrobné konfigurační návody prostřednictvím své wiki dokumentace. Konzultujte [návod na nastavení e-mailu Dahua](https://dahuawiki.com/Email/Email_Notifications_Setup_GMail) pro instrukce specifické pro model.

### Konfigurace e-mailu Dahua NVR {#dahua-nvr-email-configuration}

Síťové videorekordéry Dahua (NVR) poskytují centralizovanou správu e-mailových oznámení pro více kamer, což umožňuje efektivní administraci rozsáhlých dohledových systémů.

1. **Přístup k webovému rozhraní NVR** zadáním IP adresy NVR do webového prohlížeče. Dahua NVR poskytují komplexní rozhraní pro správu systémové konfigurace.

2. **Přejděte do konfigurace e-mailu** výběrem „Nastavení“ > „Síť“ > „E-mail“ v hlavním menu. NVR obvykle organizují nastavení e-mailu na systémové úrovni.

3. **Nakonfigurujte nastavení SMTP serveru** zadáním smtp.forwardemail.net jako adresy serveru a výběrem portu 465 s šifrováním SSL/TLS (doporučeno) nebo portu 587 se STARTTLS.

4. **Nastavte autentizaci** pomocí svého Forward Email aliasu a vygenerovaného hesla. NVR podporují standardní metody SMTP autentizace.

5. **Nakonfigurujte plány oznámení** nastavením časových období, kdy by měla být e-mailová oznámení aktivní. To pomáhá řídit objem oznámení mimo pracovní dobu.

6. **Nastavte oznámení založená na událostech** konfigurací, které události kamer by měly spouštět e-mailová upozornění. NVR umožňují detailní kontrolu nad spouštěči oznámení napříč více kamerami.

7. **Otestujte systémovou konfiguraci e-mailu** pro zajištění správné funkčnosti u všech připojených kamer a monitorovacích systémů.


## Konfigurace e-mailu multifunkčních zařízení Xerox {#xerox-multifunction-device-email-configuration}

Multifunkční zařízení Xerox poskytují podnikové možnosti e-mailových oznámení s komplexní podporou TLS a pokročilými konfiguračními možnostmi. Moderní zařízení Xerox podporují aktuální bezpečnostní standardy a zároveň zachovávají kompatibilitu s různými síťovými prostředími.

### Nastavení e-mailu Xerox MFD {#xerox-mfd-email-setup}

Multifunkční zařízení Xerox nabízejí sofistikovanou konfiguraci e-mailu prostřednictvím svého webového administrativního rozhraní, podporující jak základní oznámení, tak pokročilou integraci pracovních postupů.
1. **Přístup k webovému rozhraní zařízení** zadáním IP adresy zařízení do webového prohlížeče. Zařízení Xerox obvykle poskytují komplexní webové administrační nástroje.

2. **Přejděte do Vlastností** a vyberte „Připojení“ > „Protokoly“ > „SMTP“ v konfiguračním menu. Zařízení Xerox organizují nastavení e-mailu v sekci konfigurace protokolů.

3. **Nakonfigurujte SMTP server** zadáním smtp.forwardemail.net jako adresy serveru. Zařízení Xerox podporují konfigurovatelné verze TLS a metody šifrování.

4. **Nastavte konfiguraci TLS** výběrem TLS 1.2 nebo vyšší jako minimálně podporované verze. Zařízení Xerox umožňují správcům nastavit specifické požadavky na TLS pro zvýšenou bezpečnost.

5. **Nakonfigurujte port a šifrování** nastavením portu 465 pro SSL/TLS připojení (doporučeno) nebo portu 587 pro STARTTLS připojení.

6. **Nastavte SMTP autentizaci** povolením autentizace a zadáním vašeho aliasu Forward Email jako uživatelského jména. Použijte heslo vygenerované z [Můj účet -> Domény -> Aliasy](https://forwardemail.net/my-account/domains).

7. **Nakonfigurujte informace o odesílateli** nastavením vašeho aliasu Forward Email jako adresy odesílatele a konfigurací vhodných adres pro odpověď pro správu oznámení.

8. **Nastavte typy oznámení** konfigurací, které události zařízení by měly spouštět e-mailová upozornění, včetně oznámení o údržbě, chybových stavů a bezpečnostních událostí.

9. **Otestujte konfiguraci e-mailu** pomocí komplexního testovacího systému Xerox pro ověření správné konektivity a autentizace.

> \[!NOTE]
> Zařízení Xerox poskytují podrobné možnosti konfigurace TLS, které umožňují jemné doladění bezpečnostních nastavení. Konzultujte [Xeroxův průvodce konfigurací TLS](https://www.support.xerox.com/en-us/article/KB0032169) pro pokročilé bezpečnostní požadavky.


## Konfigurace e-mailu multifunkčního zařízení Ricoh {#ricoh-multifunction-device-email-configuration}

Multifunkční zařízení Ricoh nabízejí robustní e-mailové funkce napříč širokou produktovou řadou, od základních kancelářských tiskáren po pokročilé produkční systémy. Nicméně, [Ricoh oznámil významné změny](https://www.ricoh.com/info/2025/0526_1) související s ukončením základní autentizace Microsoftu, které ovlivňují funkčnost e-mailu.

### Moderní konfigurace Ricoh MFD {#modern-ricoh-mfd-configuration}

Současná zařízení Ricoh podporují moderní standardy TLS a poskytují komplexní možnosti e-mailových oznámení prostřednictvím svého webového rozhraní.

1. **Přístup k webovému rozhraní zařízení** zadáním IP adresy zařízení do webového prohlížeče. Zařízení Ricoh poskytují intuitivní webové konfigurační systémy.

2. **Přejděte do konfigurace e-mailu** výběrem „Systémová nastavení“ > „Nástroje správce“ > „Síť“ > „E-mail“ v menu.

3. **Nakonfigurujte SMTP server** zadáním smtp.forwardemail.net jako adresy serveru. Zařízení Ricoh podporují jak SSL, tak STARTTLS metody šifrování.

4. **Povolte SSL na stránce SMTP serveru** pro aktivaci TLS šifrování. Rozhraní Ricoh může být nejasné, ale povolení SSL je vyžadováno pro zabezpečenou e-mailovou funkčnost.

5. **Nastavte číslo portu** na 465 pro SSL/TLS připojení (doporučeno) nebo 587 pro STARTTLS připojení. Ujistěte se, že metoda šifrování odpovídá vybranému portu.

6. **Nakonfigurujte SMTP autentizaci** povolením autentizace a zadáním vašeho aliasu Forward Email jako uživatelského jména. Použijte heslo vygenerované z [Můj účet -> Domény -> Aliasy](https://forwardemail.net/my-account/domains).

7. **Nastavte informace o odesílateli** konfigurací vašeho aliasu Forward Email jako adresy odesílatele a přidáním vhodných identifikačních údajů.

8. **Nakonfigurujte typy oznámení** nastavením scan-to-email, upozornění zařízení a oznámení o údržbě podle vašich provozních požadavků.

9. **Otestujte funkčnost e-mailu** pomocí vestavěného testovacího systému Ricoh pro ověření správné konfigurace a konektivity.

> \[!IMPORTANT]
> Zařízení Ricoh ovlivněná změnami základní autentizace Microsoftu vyžadují aktualizované metody autentizace. Ujistěte se, že firmware vašeho zařízení podporuje moderní autentizaci, nebo použijte kompatibilní funkce Forward Email.
### Konfigurace starších zařízení Ricoh {#legacy-ricoh-device-configuration}

Starší zařízení Ricoh mohou vyžadovat legacy-kompatibilní SMTP porty Forward Email kvůli omezené podpoře TLS a omezením metod autentizace.

1. **Přístup do webového rozhraní zařízení** a přejděte do sekce konfigurace e-mailu. Starší zařízení Ricoh mohou mít odlišnou strukturu menu než současné modely.

2. **Nakonfigurujte legacy SMTP nastavení Forward Email** zadáním smtp.forwardemail.net jako adresy serveru a použitím portu 2455 pro SSL připojení.

3. **Povolte SSL šifrování** tak, aby odpovídalo konfiguraci legacy portu. Ujistěte se, že nastavení šifrování odpovídá požadavkům portu 2455.

4. **Nastavte autentizaci** pomocí vašeho aliasu Forward Email a vygenerovaného hesla. Starší zařízení Ricoh mohou mít specifická omezení autentizace.

5. **Otestujte konfiguraci** a sledujte chyby autentizace nebo připojení. Starší zařízení mohou poskytovat omezené chybové hlášení pro řešení problémů.


## Řešení běžných problémů s konfigurací {#troubleshooting-common-configuration-issues}

Konfigurace e-mailu na zařízení může narazit na různé problémy kvůli síťovým nastavením, problémům s autentizací nebo nekompatibilitě protokolů. Pochopení běžných problémů a jejich řešení pomáhá zajistit spolehlivé doručování oznámení napříč vaším ekosystémem zařízení.

### Problémy s autentizací a přihlašovacími údaji {#authentication-and-credential-issues}

Selhání autentizace představuje nejčastější problém konfigurace e-mailu u všech typů zařízení. Tyto problémy obvykle vyplývají z nesprávného použití přihlašovacích údajů, nesouladu metod autentizace nebo problémů s konfigurací účtu.

Ověřte, že používáte svůj alias Forward Email jako uživatelské jméno, nikoli e-mailovou adresu účtu nebo přihlašovací údaje. Mnoho zařízení je citlivých na formát uživatelského jména a vyžaduje přesnou shodu s vaším nakonfigurovaným aliasem.

Ujistěte se, že používáte vygenerované heslo z [Můj účet -> Domény -> Aliasy](https://forwardemail.net/my-account/domains) místo přihlašovacího hesla k účtu. SMTP autentizace vyžaduje specifické vygenerované heslo z bezpečnostních důvodů a použití nesprávných údajů povede k selhání autentizace.

Zkontrolujte, zda má váš účet Forward Email povolený správný přístup k SMTP a zda jsou správně nastaveny požadavky na dvoufaktorovou autentizaci. Některé konfigurace účtu mohou omezovat přístup k SMTP, dokud není správně aktivován.

> \[!TIP]
> Pokud autentizace stále selhává, vygenerujte nové SMTP heslo z [Můj účet -> Domény -> Aliasy](https://forwardemail.net/my-account/domains) a aktualizujte konfiguraci zařízení s novými údaji.

### Problémy s TLS a šifrováním {#tls-and-encryption-problems}

Problémy související s TLS často nastávají, když zařízení používají nepodporované šifrovací protokoly nebo když je nesoulad mezi konfigurací portu a nastavením šifrování.

U moderních zařízení, která mají chyby TLS, ověřte, že používáte správnou kombinaci portu a šifrování: port 465 s SSL/TLS (doporučeno) nebo port 587 s STARTTLS. Tato nastavení musí přesně odpovídat pro úspěšné připojení.

Starší zařízení, která zobrazují chyby ověřování certifikátu, by měla používat kompatibilní porty Forward Email (2455 nebo 2555) místo standardních SMTP portů. Tyto porty zachovávají kompatibilitu s TLS 1.0 a zároveň poskytují odpovídající zabezpečení pro starší zařízení.

Pokud ověřování certifikátu na starších zařízeních stále selhává, zkontrolujte, zda zařízení umožňuje vypnutí ověřování certifikátu. I když to snižuje bezpečnost, může to být nezbytné pro pokračující funkčnost na zařízeních, která nelze aktualizovat.

> \[!CAUTION]
> Vypnutí ověřování certifikátu snižuje bezpečnost a mělo by být použito pouze jako poslední možnost u starších zařízení, která nelze aktualizovat nebo nahradit.

### Problémy s připojením k síti {#network-connectivity-issues}

Problémy související se sítí mohou zabránit zařízením v dosažení SMTP serverů Forward Email i při správné konfiguraci.

Ověřte, že vaše síť umožňuje odchozí připojení na nakonfigurované SMTP porty. Firewally ve firmě nebo restriktivní síťové politiky mohou blokovat určité porty, což vyžaduje úpravu pravidel firewallu nebo alternativní konfiguraci portů.
Zkontrolujte rozlišení DNS tím, že zajistíte, aby vaše zařízení mohla rozlišit smtp.forwardemail.net na správné IP adresy. Problémy s DNS mohou způsobit selhání připojení i při jinak funkční síťové konektivitě.

Otestujte síťovou konektivitu pomocí nástrojů pro diagnostiku sítě na zařízení, pokud jsou k dispozici. Mnoho moderních zařízení poskytuje vestavěné možnosti testování sítě, které mohou pomoci identifikovat problémy s připojením.

Zvažte latenci sítě a nastavení časových limitů, pokud jsou zařízení umístěna na pomalých nebo sítích s vysokou latencí. Některá zařízení mohou vyžadovat úpravy časových limitů pro spolehlivé doručení e-mailů.

### Výzvy specifické pro konfiguraci zařízení {#device-specific-configuration-challenges}

Různí výrobci zařízení implementují funkce e-mailu různými způsoby, což vede k výzvám specifickým pro výrobce, které vyžadují cílená řešení.

Tiskárny HP mohou ukládat do mezipaměti DNS dotazy a po změnách konfigurace vyžadují restart. Pokud problémy s připojením přetrvávají po konfiguraci, restartujte tiskárnu, aby se vymazaly uložené síťové informace.

Tiskárny Brother jsou zvláště citlivé na formátování autentizačních údajů a pro spolehlivou konfiguraci může být nutné nastavení přes webové rozhraní místo ovládacího panelu zařízení.

Kamery Foscam vyžadují specifické nastavení portů kvůli omezením TLS a nemusí poskytovat podrobné chybové zprávy pro řešení problémů. Ujistěte se, že pro tato zařízení používáte legacy porty Forward Email (2455 nebo 2555).

Kamery Hikvision vyžadují SSL šifrování a nepodporují STARTTLS, což omezuje možnosti konfigurace na port 465 s SSL/TLS šifrováním.

> \[!NOTE]
> Při řešení problémů specifických pro zařízení konzultujte dokumentaci výrobce ohledně známých omezení nebo požadavků na konfiguraci, které mohou ovlivnit funkčnost e-mailu.


## Bezpečnostní úvahy a osvědčené postupy {#security-considerations-and-best-practices}

Konfigurace e-mailových oznámení na síťových zařízeních zahrnuje několik bezpečnostních aspektů, které pomáhají chránit vaše systémy a zároveň udržovat spolehlivé doručování oznámení. Dodržování bezpečnostních osvědčených postupů zabraňuje neoprávněnému přístupu a zajišťuje vhodné zveřejnění informací v oznámeních.

### Správa přihlašovacích údajů {#credential-management}

Používejte silná, jedinečná hesla pro svůj účet Forward Email a pokud je to možné, povolte dvoufaktorové ověřování. Vygenerované SMTP heslo by mělo být považováno za citlivý údaj a bezpečně uloženo v konfiguracích zařízení.

Pravidelně kontrolujte a měňte SMTP hesla, zejména po personálních změnách nebo bezpečnostních incidentech. Forward Email umožňuje regeneraci hesla bez ovlivnění ostatních funkcí účtu.

Pokud je to možné, vyhněte se používání sdílených přihlašovacích údajů napříč více zařízeními. I když Forward Email podporuje připojení více zařízení se stejnými údaji, individuální přihlašovací údaje pro zařízení poskytují lepší bezpečnostní izolaci a možnosti auditu.

Bezpečně dokumentujte přihlašovací údaje zařízení a zahrňte je do systému správy přihlašovacích údajů vaší organizace. Správná dokumentace zajistí, že konfigurace e-mailu lze udržovat a aktualizovat podle potřeby.

### Síťová bezpečnost {#network-security}

Implementujte vhodné segmentování sítě, aby byla zařízení izolována od ostatních síťových zdrojů, přičemž zachovejte nezbytnou konektivitu pro e-mailová oznámení a legitimní přístup.

Nakonfigurujte pravidla firewallu tak, aby povolovala potřebný SMTP provoz a blokovala zbytečný přístup do sítě. Zařízení obvykle potřebují pouze odchozí přístup na SMTP servery Forward Email pro funkčnost oznámení.

Monitorujte síťový provoz ze zařízení, abyste identifikovali neobvyklé vzory nebo neoprávněné pokusy o komunikaci. Neočekávaná síťová aktivita může naznačovat bezpečnostní problémy vyžadující vyšetřování.

Zvažte použití VLAN nebo vyhrazených síťových segmentů pro správu zařízení včetně e-mailových oznámení, aby byla zajištěna další bezpečnostní izolace.

### Zveřejňování informací {#information-disclosure}

Zkontrolujte obsah e-mailových oznámení, aby neobsahovala citlivé informace, které by mohly být užitečné pro útočníky. Některá zařízení zahrnují podrobné systémové informace, síťové konfigurace nebo cesty k souborům v e-mailových oznámeních.
Nakonfigurujte filtrování oznámení tak, aby omezovalo typy informací zahrnutých v e-mailových upozorněních. Mnoho zařízení umožňuje přizpůsobení obsahu oznámení tak, aby bylo dosaženo rovnováhy mezi užitečnými informacemi a bezpečnostními požadavky.

Implementujte vhodné zásady uchovávání a zpracování e-mailů pro oznámení zařízení. Bezpečnostní oznámení může být nutné uchovávat pro účely souladu s předpisy nebo forenzní analýzy.

Zvažte citlivost e-mailových adres příjemců a zajistěte, aby byla oznámení zasílána pouze oprávněným osobám, které potřebují přístup k informacím.

### Monitoring a údržba {#monitoring-and-maintenance}

Pravidelně testujte konfigurace e-mailových oznámení, aby byla zajištěna jejich trvalá funkčnost. Periodické testování pomáhá odhalit odchylky v konfiguraci, změny v síti nebo problémy se službou dříve, než ovlivní doručení kritických upozornění.

Sledujte vzory e-mailových oznámení pro známky podezřelé aktivity nebo pokusy o neoprávněný přístup. Neobvyklé objemy oznámení nebo neočekávané systémové události mohou naznačovat bezpečnostní problémy.

Udržujte firmware zařízení aktuální, pokud je to možné, aby byly zachovány současné bezpečnostní standardy a podpora protokolů. I když některá zařízení dosáhla konce životnosti, aplikace dostupných bezpečnostních aktualizací pomáhá chránit před známými zranitelnostmi.

Implementujte záložní metody oznámení pro kritická upozornění, pokud je to možné. I když jsou e-mailová oznámení spolehlivá, mít alternativní mechanismy upozornění poskytuje redundanci pro nejdůležitější systémové události.


## Závěr {#conclusion}

Konfigurace spolehlivých e-mailových oznámení napříč různorodými ekosystémy zařízení vyžaduje pochopení složitého prostředí kompatibility TLS, metod autentizace a požadavků specifických pro výrobce. Komplexní SMTP služba Forward Email řeší tyto výzvy tím, že poskytuje jak moderní bezpečnostní standardy pro současná zařízení, tak i zpětnou kompatibilitu pro starší vybavení, které nelze aktualizovat.

Postupy konfigurace uvedené v této příručce poskytují podrobné, krok za krokem instrukce pro hlavní kategorie zařízení, což zajišťuje, že správci mohou nastavit spolehlivá e-mailová oznámení bez ohledu na konkrétní kombinaci zařízení. Dvojportová strategie Forward Email konkrétně řeší krizi kompatibility TLS, která postihuje miliony nasazených zařízení, a poskytuje praktické řešení, které zachovává bezpečnost a zároveň zajišťuje pokračující funkčnost.

Pravidelné testování a údržba konfigurací e-mailových oznámení zajišťuje trvalou spolehlivost a pomáhá odhalit potenciální problémy dříve, než ovlivní doručení kritických upozornění. Dodržování bezpečnostních osvědčených postupů a pokynů pro řešení problémů v této příručce pomáhá udržovat bezpečné a spolehlivé systémy oznámení, které informují správce o stavu zařízení a bezpečnostních událostech.

Ať už spravujete malou kancelář s různými značkami tiskáren a kamer, nebo dohlížíte na podnikové prostředí se stovkami zařízení, Forward Email poskytuje infrastrukturu a kompatibilitu potřebnou pro spolehlivá e-mailová oznámení. Zaměření na kompatibilitu zařízení spolu s komplexní dokumentací a podporou zajišťuje, že kritická systémová upozornění k vám dorazí právě tehdy, když je nejvíce potřebujete.

Pro další podporu při konfiguraci e-mailů zařízení nebo dotazy ohledně kompatibility Forward Email s konkrétním vybavením navštivte náš [FAQ o konfiguraci SMTP serveru](https://forwardemail.net/en/faq#what-are-your-smtp-server-configuration-settings) nebo kontaktujte náš tým podpory. Jsme odhodláni pomoci vám udržet spolehlivá e-mailová oznámení napříč všemi zařízeními připojenými k síti, bez ohledu na jejich stáří nebo omezení výrobce.
