# Kompletny przewodnik po konfiguracji e-mail dla drukarek, kamer, faksów i skanerów {#complete-guide-to-printer-camera-fax--scanner-email-setup}

Twoje urządzenia biurowe muszą wysyłać e-maile – drukarki informują o poziomie tonera, kamery IP powiadamiają o wykryciu ruchu, faxy raportują status transmisji, a skanery potwierdzają przetwarzanie dokumentów. Problem? Większość dostawców poczty elektronicznej zrezygnowała ze wsparcia dla starszych urządzeń, pozostawiając Twoje sprzęty bez możliwości wysyłania powiadomień.

[Microsoft Office 365 zakończył wsparcie dla TLS 1.0 i TLS 1.1 w styczniu 2022 roku](https://learn.microsoft.com/en-us/troubleshoot/exchange/email-delivery/fix-issues-with-printers-scanners-and-lob-applications-that-send-email-using-off), co przerwało działanie poczty dla tysięcy urządzeń. Wiele drukarek, kamer i faksów wyprodukowanych przed 2020 rokiem obsługuje tylko te przestarzałe protokoły i nie można ich zaktualizować.

Forward Email rozwiązuje ten problem, obsługując zarówno nowoczesne, jak i starsze urządzenia. Mamy dedykowane porty dla aktualnego sprzętu oraz specjalne porty legacy dla starszych urządzeń, których nie da się zaktualizować.

> \[!IMPORTANT]
> Forward Email obsługuje zarówno nowoczesne, jak i starsze urządzenia dzięki strategii z dwoma portami. Używaj portu `465` (SSL/TLS, zalecany) lub `587` (STARTTLS) dla nowoczesnych urządzeń z obsługą TLS 1.2+, oraz portów `2455`/`2555` dla starszych urządzeń obsługujących tylko TLS 1.0.


## Spis treści {#table-of-contents}

* [Wyjaśnienie problemu TLS](#the-tls-problem-explained)
* [Przegląd konfiguracji SMTP Forward Email](#forward-email-smtp-configuration-overview)
* [Kompleksowa matryca kompatybilności urządzeń](#comprehensive-device-compatibility-matrix)
* [Konfiguracja e-mail drukarek HP](#hp-printer-email-configuration)
  * [Nowoczesne drukarki HP (2020 i później)](#modern-hp-printers-2020-and-later)
  * [Starsze drukarki HP (modele sprzed 2020)](#legacy-hp-printers-pre-2020-models)
* [Konfiguracja e-mail drukarek Canon](#canon-printer-email-configuration)
  * [Aktualne drukarki Canon](#current-canon-printers)
  * [Starsze drukarki Canon](#legacy-canon-printers)
* [Konfiguracja e-mail drukarek Brother](#brother-printer-email-configuration)
  * [Konfiguracja serii Brother MFC](#brother-mfc-series-configuration)
  * [Rozwiązywanie problemów z e-mailem Brother](#troubleshooting-brother-email-issues)
* [Konfiguracja e-mail kamer IP Foscam](#foscam-ip-camera-email-configuration)
  * [Zrozumienie ograniczeń e-mail Foscam](#understanding-foscam-email-limitations)
  * [Kroki konfiguracji e-mail Foscam](#foscam-email-configuration-steps)
  * [Zaawansowana konfiguracja Foscam](#advanced-foscam-configuration)
* [Konfiguracja e-mail kamer bezpieczeństwa Hikvision](#hikvision-security-camera-email-configuration)
  * [Konfiguracja nowoczesnych kamer Hikvision](#modern-hikvision-camera-configuration)
  * [Konfiguracja starszych kamer Hikvision](#legacy-hikvision-camera-configuration)
* [Konfiguracja e-mail kamer bezpieczeństwa Dahua](#dahua-security-camera-email-configuration)
  * [Konfiguracja e-mail kamer Dahua](#dahua-camera-email-setup)
  * [Konfiguracja e-mail rejestratorów Dahua NVR](#dahua-nvr-email-configuration)
* [Konfiguracja e-mail urządzeń wielofunkcyjnych Xerox](#xerox-multifunction-device-email-configuration)
  * [Konfiguracja e-mail MFD Xerox](#xerox-mfd-email-setup)
* [Konfiguracja e-mail urządzeń wielofunkcyjnych Ricoh](#ricoh-multifunction-device-email-configuration)
  * [Konfiguracja nowoczesnych MFD Ricoh](#modern-ricoh-mfd-configuration)
  * [Konfiguracja starszych urządzeń Ricoh](#legacy-ricoh-device-configuration)
* [Rozwiązywanie typowych problemów z konfiguracją](#troubleshooting-common-configuration-issues)
  * [Problemy z uwierzytelnianiem i poświadczeniami](#authentication-and-credential-issues)
  * [Problemy z TLS i szyfrowaniem](#tls-and-encryption-problems)
  * [Problemy z łącznością sieciową](#network-connectivity-issues)
  * [Wyzwania specyficzne dla konfiguracji urządzeń](#device-specific-configuration-challenges)
* [Zagadnienia bezpieczeństwa i najlepsze praktyki](#security-considerations-and-best-practices)
  * [Zarządzanie poświadczeniami](#credential-management)
  * [Bezpieczeństwo sieci](#network-security)
  * [Ujawnianie informacji](#information-disclosure)
  * [Monitorowanie i konserwacja](#monitoring-and-maintenance)
* [Podsumowanie](#conclusion)
## Problem TLS wyjaśniony {#the-tls-problem-explained}

Oto co się stało: bezpieczeństwo e-maili stało się bardziej rygorystyczne, ale Twoje urządzenia nie otrzymały tej informacji. Nowoczesny sprzęt obsługuje TLS 1.2+, ale starsze urządzenia utknęły na TLS 1.0. Większość dostawców poczty e-mail zrezygnowała z obsługi TLS 1.0, więc Twoje urządzenia nie mogą się połączyć.

Ma to wpływ na rzeczywiste operacje – kamery bezpieczeństwa nie mogą wysyłać alertów podczas incydentów, drukarki nie mogą ostrzegać o problemach z konserwacją, a potwierdzenia faksów znikają. Konfiguracja [serwera SMTP Forward Email](https://forwardemail.net/en/faq#what-are-your-smtp-server-configuration-settings) oferuje wiele portów, aby wszystko działało poprawnie.

> \[!TIP]
> Sprawdź wersję oprogramowania układowego urządzenia i obsługę TLS przed konfiguracją. Większość urządzeń wyprodukowanych po 2020 roku obsługuje nowoczesne protokoły TLS, podczas gdy starsze urządzenia zazwyczaj wymagają portów kompatybilnych z protokołami dziedziczonymi.


## Przegląd konfiguracji SMTP Forward Email {#forward-email-smtp-configuration-overview}

Forward Email oferuje kompleksową usługę SMTP zaprojektowaną specjalnie, aby sprostać unikalnym wyzwaniom konfiguracji e-mailowej urządzeń. Nasza infrastruktura obsługuje wiele typów połączeń i poziomów bezpieczeństwa, zapewniając kompatybilność zarówno z najnowocześniejszym sprzętem, jak i starszymi urządzeniami, które nadal są używane.

Dla nowoczesnych urządzeń z obsługą TLS 1.2+ używaj naszego głównego serwera SMTP pod adresem smtp.forwardemail.net z portem 465 dla połączeń SSL/TLS (zalecane) lub portem 587 dla połączeń STARTTLS. Te porty zapewniają bezpieczeństwo klasy korporacyjnej i są kompatybilne ze wszystkimi aktualnymi wersjami oprogramowania urządzeń.

Starsze urządzenia, które obsługują tylko TLS 1.0, mogą korzystać z naszych specjalnych portów kompatybilności. Port 2455 zapewnia połączenia SSL/TLS z obsługą TLS 1.0, natomiast port 2555 oferuje STARTTLS z kompatybilnością protokołu dziedziczonego. Te porty utrzymują najwyższy możliwy poziom bezpieczeństwa, jednocześnie zapewniając ciągłą funkcjonalność starszego sprzętu.

Uwierzytelnianie jest wymagane dla wszystkich połączeń z użyciem aliasu Forward Email jako nazwy użytkownika oraz wygenerowanego hasła z [Moje konto -> Domeny -> Aliasy](https://forwardemail.net/my-account/domains). Takie podejście zapewnia solidne bezpieczeństwo przy szerokiej kompatybilności z różnymi systemami uwierzytelniania urządzeń.

> \[!CAUTION]
> Nigdy nie używaj hasła do logowania na konto do uwierzytelniania SMTP. Zawsze używaj wygenerowanego hasła z [Moje konto -> Domeny -> Aliasy](https://forwardemail.net/my-account/domains) do konfiguracji urządzenia.


## Kompleksowa macierz kompatybilności urządzeń {#comprehensive-device-compatibility-matrix}

Zrozumienie, które urządzenia wymagają wsparcia dziedziczonego, a które nowoczesnej konfiguracji, pomaga usprawnić proces ustawiania i zapewnia niezawodne dostarczanie e-maili w całym ekosystemie urządzeń.

| Kategoria urządzenia      | Obsługa nowoczesnego TLS | Wymagany dziedziczony TLS | Zalecane porty  | Typowe problemy                                                                                                                                    | Przewodnik konfiguracji / Zrzuty ekranu                                                                                                          |
| ------------------------- | ------------------------ | ------------------------- | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Drukarki HP (2020+)       | ✅ TLS 1.2+               | ❌                         | `465`, `587`   | [Weryfikacja certyfikatu](https://h30434.www3.hp.com/t5/Scanning-Faxing-Copying/Scan-to-E-Mail-newer-MFP-Pro-printers-SMTP-Certificate/td-p/9194707) | [Przewodnik konfiguracji HP LaserJet Pro MFP](https://support.hp.com/us-en/document/ish_6185297-6063300-16)                                       |
| Drukarki HP (przed 2020)  | ❌                        | ✅ Tylko TLS 1.0          | `2455`, `2555` | [Ograniczenia oprogramowania układowego](https://www.reddit.com/r/sysadmin/comments/1gnpac4/printers_dont_have_tls_settings/)                      | [Przewodnik funkcji skanowania do e-maila](https://support.hp.com/us-en/document/ish_6518575-6518545-16)                                          |
| Drukarki Canon (aktualne) | ✅ TLS 1.2+               | ❌                         | `465`, `587`   | [Konfiguracja uwierzytelniania](https://community.usa.canon.com/t5/Office-Printers/MF733CDW-Cannot-Scan-to-Email-with-SMTP-Auth-Error-806/td-p/265358) | [Przewodnik uwierzytelniania SMTP Canon](https://oip.manual.canon/USRMA-0320-zz-CS-enUV/contents/1T0003111775.html)                             |
| Drukarki Canon (dziedziczone) | ❌                    | ✅ Tylko TLS 1.0          | `2455`, `2555` | [Problemy z certyfikatem](https://community.usa.canon.com/t5/Office-Printers/MF735cx-quot-Register-quot-Certificate-produces-error/td-p/245443)    | [Zaawansowany przewodnik ustawień e-mail](https://oip.manual.canon/USRMA-0163-zz-CS-enGB/contents/08025025.html)                                |
| Drukarki Brother (aktualne) | ✅ TLS 1.2+             | ❌                         | `465`, `587`   | [Konfiguracja portów](https://www.reddit.com/r/techsupport/comments/1548u4o/brother_printer_not_taking_scan_to_email_config/)                      | [Przewodnik konfiguracji SMTP Brother](https://support.brother.com/g/b/faqend.aspx?c=us&lang=en&prod=mfcl2690dw_us&faqid=faq00100234_512)       |
| Drukarki Epson (aktualne) | ✅ TLS 1.2+               | ❌                         | `465`, `587`   | Dostęp do interfejsu webowego                                                                                                                     | [Konfiguracja powiadomień e-mail Epson](https://download4.epson.biz/sec_pubs/l6580_series/useg/en/GUID-5FED5794-3E76-4DE9-8B9D-EBD8F60F231C.htm) |
| Kamery IP Foscam          | ❌                        | ✅ Tylko TLS 1.0          | `2455`, `2555` | [Weryfikacja certyfikatu](https://ipcamtalk.com/threads/foscam-ip-cameras-stopped-sending-email-in-motion-detection.80152/)                        | [FAQ konfiguracji e-mail Foscam](https://www.foscam.com/faqs/view.html?id=63)                                                                   |
| Hikvision (2020+)         | ✅ TLS 1.2+               | ❌                         | `465`, `587`   | Wymagania SSL                                                                                                                                      | [Przewodnik konfiguracji e-mail Hikvision](https://www.hikvision.com/content/dam/hikvision/ca/how-to-document/How-to-setup-email-on-Hikvision-nvr-dvr.pdf) |
| Hikvision (dziedziczone)  | ❌                        | ✅ Tylko TLS 1.0          | `2455`, `2555` | Aktualizacje oprogramowania układowego                                                                                                           | [Konfiguracja dziedziczona Hikvision](https://www.hikvision.com/content/dam/hikvision/ca/how-to-document/How-to-setup-email-on-Hikvision-nvr-dvr.pdf) |
| Kamery Dahua (aktualne)   | ✅ TLS 1.2+               | ❌                         | `465`, `587`   | Uwierzytelnianie                                                                                                                                   | [Wiki konfiguracji e-mail Dahua](https://dahuawiki.com/Email/Email_Notifications_Setup_GMail)                                                    |
| Xerox MFD (aktualne)      | ✅ TLS 1.2+               | ❌                         | `465`, `587`   | [Konfiguracja TLS](https://www.support.xerox.com/en-us/article/KB0032169)                                                                         | [Przewodnik konfiguracji TLS Xerox](https://www.support.xerox.com/en-us/article/KB0032169)                                                      |
| Ricoh MFD (aktualne)      | ✅ TLS 1.2+               | ❌                         | `465`, `587`   | Konfiguracja SSL                                                                                                                                   | [Konfiguracja e-mail Ricoh](https://www.ricoh.com/info/2025/0526_1)                                                                             |
| Ricoh MFD (dziedziczone)  | ❌                        | ✅ Tylko TLS 1.0          | `2455`, `2555` | [Problemy z podstawowym uwierzytelnianiem](https://www.ricoh.com/info/2025/0526_1)                                                               | [Konfiguracja dziedziczona Ricoh](https://www.ricoh.com/info/2025/0526_1)                                                                       |
Ta macierz zapewnia szybkie odniesienie do określenia odpowiedniego podejścia konfiguracyjnego dla Twoich konkretnych urządzeń. W razie wątpliwości zacznij od nowoczesnych portów i przejdź do portów starszych, jeśli wystąpią problemy z połączeniem.

> \[!NOTE]
> Wiek urządzenia nie zawsze jest wiarygodnym wskaźnikiem wsparcia TLS. Niektórzy producenci wprowadzili wsparcie TLS 1.2 do starszych modeli poprzez aktualizacje oprogramowania układowego, podczas gdy inni zaprzestali wsparcia dla starszych produktów.


## Konfiguracja e-mail drukarek HP {#hp-printer-email-configuration}

Drukarki HP stanowią jedną z największych baz zainstalowanych urządzeń drukujących podłączonych do sieci, z modelami od aktualnych serii LaserJet Pro z pełnym wsparciem TLS 1.3 po starsze modele obsługujące tylko TLS 1.0. Proces konfiguracji znacznie różni się między nowoczesnymi a starszymi urządzeniami, wymagając różnych podejść dla optymalnej kompatybilności.

### Nowoczesne drukarki HP (2020 i później) {#modern-hp-printers-2020-and-later}

Nowoczesne drukarki HP obejmują serię LaserJet Pro MFP M404, Color LaserJet Pro MFP M479 oraz nowsze modele obsługujące aktualne standardy TLS. Urządzenia te oferują kompleksowe możliwości powiadomień e-mail za pośrednictwem interfejsu HP Embedded Web Server (EWS).

1. **Uzyskaj dostęp do interfejsu webowego drukarki** wpisując adres IP drukarki w przeglądarce internetowej. Adres IP znajdziesz, drukując stronę konfiguracji sieci z panelu sterowania drukarki.

2. **Przejdź do zakładki Sieć** i wybierz „Serwer e-mail” lub „Ustawienia SMTP” w zależności od modelu drukarki. Niektóre drukarki HP organizują te ustawienia pod „System” > „Alerty e-mail”.

3. **Skonfiguruj ustawienia serwera SMTP** wpisując `smtp.forwardemail.net` jako adres serwera. Wybierz „SSL/TLS” jako metodę szyfrowania i wpisz `465` jako numer portu dla najbardziej niezawodnego połączenia.

4. **Skonfiguruj uwierzytelnianie** włączając uwierzytelnianie SMTP i wpisując swój alias Forward Email jako nazwę użytkownika. Użyj hasła wygenerowanego z [My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains), a nie hasła do logowania do konta.

5. **Skonfiguruj informacje nadawcy** wpisując swój alias Forward Email jako adres „Od” oraz opisową nazwę, np. „HP Printer - Office”, aby ułatwić identyfikację źródła powiadomień.

6. **Skonfiguruj adresy odbiorców** dodając do pięciu adresów e-mail, które mają otrzymywać powiadomienia z drukarki. Drukarki HP pozwalają wysyłać różne typy powiadomień do różnych odbiorców.

7. **Przetestuj konfigurację** używając wbudowanej funkcji testu e-mail w drukarce. Drukarka wyśle wiadomość testową, aby zweryfikować poprawność ustawień i prawidłową komunikację z serwerami Forward Email.

> \[!TIP]
> Drukarki HP często buforują zapytania DNS. Jeśli napotkasz problemy z połączeniem, zrestartuj drukarkę po konfiguracji, aby wyczyścić pamięć podręczną DNS.

### Starsze drukarki HP (modele sprzed 2020) {#legacy-hp-printers-pre-2020-models}

Starsze drukarki HP, w tym LaserJet Pro MFP M277 i podobne modele, często obsługują tylko TLS 1.0 i wymagają specjalnej konfiguracji, aby działać z nowoczesnymi dostawcami e-mail. Urządzenia te często wyświetlają błędy „TLS certificate verification failed” podczas próby połączenia ze standardowymi portami SMTP.

1. **Uzyskaj dostęp do Embedded Web Server drukarki** wpisując adres IP drukarki w przeglądarce internetowej. Starsze drukarki HP mogą wymagać Internet Explorera lub trybu zgodności dla pełnej funkcjonalności.

2. **Przejdź do ustawień Sieć lub System** i znajdź sekcję konfiguracji „E-mail” lub „SMTP”. Dokładna lokalizacja zależy od modelu i wersji oprogramowania układowego.

3. **Skonfiguruj starsze ustawienia SMTP Forward Email** wpisując smtp.forwardemail.net jako adres serwera. To jest kluczowe – użyj portu 2455 dla połączeń SSL/TLS lub portu 2555 dla połączeń STARTTLS zamiast standardowych portów.

4. **Skonfiguruj uwierzytelnianie** włączając uwierzytelnianie SMTP i wpisując swój alias Forward Email jako nazwę użytkownika. Do uwierzytelniania użyj wygenerowanego hasła Forward Email.

5. **Uważnie skonfiguruj ustawienia szyfrowania**. Wybierz „SSL/TLS” jeśli używasz portu 2455 lub „STARTTLS” jeśli używasz portu 2555. Niektóre starsze drukarki HP mogą inaczej nazywać te opcje.
6. **Ustaw informacje nadawcy i odbiorcy** używając aliasu Forward Email jako adresu nadawcy oraz konfigurując odpowiednie adresy odbiorców dla powiadomień.

7. **Przetestuj konfigurację** za pomocą funkcji testowej drukarki. Jeśli test zakończy się niepowodzeniem z błędami certyfikatu, sprawdź, czy używasz właściwych portów legacy (2455 lub 2555) zamiast standardowych portów SMTP.

> \[!CAUTION]
> Starsze drukarki HP mogą nie otrzymywać aktualizacji oprogramowania układowego rozwiązujących problemy z kompatybilnością TLS. Jeśli konfiguracja nadal się nie powodzi, rozważ użycie lokalnego serwera pośredniczącego SMTP jako rozwiązania tymczasowego.


## Konfiguracja e-mail drukarek Canon {#canon-printer-email-configuration}

Drukarki Canon oferują rozbudowane możliwości powiadomień e-mail w swoich liniach produktów imageRUNNER, PIXMA i MAXIFY. Nowoczesne urządzenia Canon obsługują kompleksowe konfiguracje TLS, podczas gdy modele legacy mogą wymagać specyficznych ustawień kompatybilności, aby działać z aktualnymi dostawcami poczty.

### Aktualne drukarki Canon {#current-canon-printers}

Nowoczesne drukarki Canon zapewniają rozbudowane funkcje powiadomień e-mail poprzez interfejs webowy Remote UI, obsługując wszystko od podstawowych alertów statusu po szczegółowe powiadomienia zarządzania urządzeniem.

1. **Uzyskaj dostęp do Remote UI** wpisując adres IP drukarki w przeglądarce internetowej. Drukarki Canon zazwyczaj korzystają z interfejsu webowego do wszystkich zadań konfiguracyjnych sieci.

2. **Przejdź do Ustawienia/Rejestracja** i wybierz „Zarządzanie urządzeniem” z menu. Poszukaj opcji „Ustawienia powiadomień e-mail” lub podobnych, zależnie od modelu drukarki.

3. **Skonfiguruj serwer SMTP** klikając „Dodaj miejsce docelowe” i wpisując smtp.forwardemail.net jako adres serwera. Wybierz „SSL” lub „TLS” jako metodę szyfrowania.

4. **Ustaw numer portu** na 465 dla połączeń SSL/TLS (zalecane) lub 587 dla połączeń STARTTLS. Drukarki Canon wyraźnie rozróżniają te metody szyfrowania w swoim interfejsie.

5. **Skonfiguruj uwierzytelnianie** włączając uwierzytelnianie SMTP i wpisując swój alias Forward Email jako nazwę użytkownika. Użyj hasła wygenerowanego z [Moje konto -> Domeny -> Aliasy](https://forwardemail.net/my-account/domains).

6. **Ustaw informacje nadawcy** wpisując swój alias Forward Email jako adres nadawcy oraz konfigurując opisową nazwę wyświetlaną dla łatwej identyfikacji powiadomień.

7. **Skonfiguruj typy powiadomień** wybierając, które zdarzenia mają wywoływać alerty e-mail. Drukarki Canon oferują szczegółową kontrolę nad typami powiadomień, w tym warunki błędów, alerty konserwacyjne i zdarzenia bezpieczeństwa.

8. **Przetestuj konfigurację e-mail** używając wbudowanej funkcji testowej Canon. Drukarka wyśle testowe powiadomienie, aby zweryfikować poprawność konfiguracji i łączność.

> \[!NOTE]
> Drukarki Canon często dostarczają szczegółowe komunikaty o błędach, które mogą pomóc w rozwiązywaniu problemów konfiguracyjnych. Zwróć uwagę na konkretne kody błędów dla szybszego rozwiązania problemu.

### Starsze drukarki Canon {#legacy-canon-printers}

Starsze drukarki Canon mogą mieć ograniczone wsparcie TLS i wymagać starannej konfiguracji, aby działać z nowoczesnymi dostawcami poczty. Te urządzenia często potrzebują ustawień SMTP kompatybilnych z legacy, aby utrzymać funkcjonalność powiadomień e-mail.

1. **Uzyskaj dostęp do interfejsu webowego drukarki** używając adresu IP urządzenia. Starsze drukarki Canon mogą wymagać specyficznych ustawień kompatybilności przeglądarki dla pełnej funkcjonalności.

2. **Przejdź do sekcji konfiguracji e-mail** przez menu zarządzania urządzeniem lub ustawień sieciowych. Dokładna ścieżka zależy od modelu i wersji oprogramowania układowego.

3. **Skonfiguruj legacy SMTP Forward Email** wpisując smtp.forwardemail.net jako adres serwera i używając portu 2455 dla połączeń SSL lub portu 2555 dla połączeń STARTTLS.

4. **Ustaw uwierzytelnianie ostrożnie** włączając uwierzytelnianie SMTP i używając swojego aliasu Forward Email oraz wygenerowanego hasła. Starsze drukarki Canon mogą mieć specyficzne wymagania dotyczące uwierzytelniania.

5. **Skonfiguruj ustawienia szyfrowania** wybierając odpowiednią opcję TLS dla wybranego portu. Upewnij się, że metoda szyfrowania odpowiada konfiguracji portu (SSL dla 2455, STARTTLS dla 2555).
6. **Przetestuj konfigurację** i monitoruj błędy walidacji certyfikatu. Jeśli problemy będą się utrzymywać, upewnij się, że używasz portów kompatybilnych z Forward Email, a nie standardowych portów SMTP.

> \[!WARNING]
> Niektóre starsze drukarki Canon mogą nie obsługiwać walidacji certyfikatu serwera. Choć zmniejsza to bezpieczeństwo, może być konieczne dla dalszej funkcjonalności poczty na starszych urządzeniach.


## Konfiguracja e-mail drukarek Brother {#brother-printer-email-configuration}

Drukarki Brother, szczególnie serie MFC i DCP, oferują rozbudowane możliwości skanowania do e-maila oraz powiadomień. Jednak wielu użytkowników zgłasza problemy z konfiguracją funkcji e-mail, zwłaszcza przy użyciu Office 365 i innych nowoczesnych dostawców poczty, którzy wycofali starsze metody uwierzytelniania.

### Konfiguracja serii Brother MFC {#brother-mfc-series-configuration}

Wielofunkcyjne drukarki Brother oferują szerokie możliwości e-mail, ale konfiguracja może być skomplikowana ze względu na różnorodność opcji uwierzytelniania i szyfrowania.

1. **Uzyskaj dostęp do interfejsu webowego drukarki** wpisując adres IP drukarki w przeglądarce internetowej. Drukarki Brother oferują rozbudowany system konfiguracji przez przeglądarkę.

2. **Przejdź do ustawień sieciowych** i wybierz „Email/IFAX” lub „Skanuj do e-maila” w zależności od modelu drukarki. Niektóre drukarki Brother grupują te ustawienia w „Ustawienia administratora”.

3. **Skonfiguruj ustawienia serwera SMTP** wpisując smtp.forwardemail.net jako adres serwera. Drukarki Brother obsługują zarówno szyfrowanie SSL/TLS, jak i STARTTLS.

4. **Ustaw odpowiedni port i szyfrowanie** wybierając port 465 z szyfrowaniem SSL/TLS (zalecane) lub port 587 z szyfrowaniem STARTTLS. Drukarki Brother wyraźnie oznaczają te opcje w interfejsie.

5. **Skonfiguruj uwierzytelnianie SMTP** włączając uwierzytelnianie i wpisując swój alias Forward Email jako nazwę użytkownika. Użyj hasła wygenerowanego z [Moje konto -> Domeny -> Aliasy](https://forwardemail.net/my-account/domains).

6. **Skonfiguruj informacje nadawcy** ustawiając swój alias Forward Email jako adres nadawcy oraz dodając opisową nazwę, która pozwoli zidentyfikować drukarkę w powiadomieniach e-mail.

7. **Skonfiguruj ustawienia skanowania do e-maila** tworząc wpisy w książce adresowej i domyślne ustawienia skanowania. Drukarki Brother pozwalają na szeroką personalizację parametrów skanowania i zarządzanie odbiorcami.

8. **Przetestuj zarówno powiadomienia e-mail, jak i funkcję skanowania do e-maila**, aby upewnić się, że konfiguracja jest kompletna. Drukarki Brother oferują oddzielne funkcje testowe dla różnych funkcji e-mail.

> \[!TIP]
> Drukarki Brother często wymagają aktualizacji firmware’u, aby rozwiązać problemy z konfiguracją e-mail. Sprawdź dostępność aktualizacji przed diagnozowaniem problemów z połączeniem.

### Rozwiązywanie problemów z e-mailem Brother {#troubleshooting-brother-email-issues}

Drukarki Brother często napotykają specyficzne problemy konfiguracyjne, które można rozwiązać za pomocą ukierunkowanych metod diagnostycznych.

Jeśli drukarka Brother wyświetla błędy „Authentication Failed” podczas testowania konfiguracji e-mail, upewnij się, że używasz swojego aliasu Forward Email (a nie adresu e-mail konta) jako nazwy użytkownika oraz hasła wygenerowanego z [Moje konto -> Domeny -> Aliasy](https://forwardemail.net/my-account/domains). Drukarki Brother są szczególnie wrażliwe na formatowanie danych uwierzytelniających.

W przypadku drukarek, które nie akceptują ustawień skanowania do e-maila, spróbuj skonfigurować je przez interfejs webowy zamiast panelu sterowania drukarki. Interfejs webowy często dostarcza bardziej szczegółowe komunikaty o błędach i opcje konfiguracji.

Przy błędach połączenia SSL/TLS sprawdź, czy używasz właściwej kombinacji portu i szyfrowania. Drukarki Brother wymagają dokładnego dopasowania numeru portu do metody szyfrowania – port 465 musi używać SSL/TLS (zalecane), natomiast port 587 musi używać STARTTLS.

> \[!CAUTION]
> Niektóre modele drukarek Brother mają znane problemy z określonymi konfiguracjami serwera SMTP. Jeśli standardowa konfiguracja zawiedzie, zapoznaj się z dokumentacją wsparcia Brother dotyczącą rozwiązań specyficznych dla modelu.
## Konfiguracja e-mail dla kamer IP Foscam {#foscam-ip-camera-email-configuration}

Kamery IP Foscam stanowią jedną z najbardziej wymagających kategorii urządzeń pod względem konfiguracji e-mail ze względu na powszechne użycie przestarzałych protokołów TLS oraz ograniczoną dostępność aktualizacji firmware. Większość kamer Foscam, w tym popularne modele z serii R2, obsługuje jedynie TLS 1.0 i nie można ich zaktualizować do obsługi nowoczesnych standardów szyfrowania.

### Zrozumienie ograniczeń e-mail w Foscam {#understanding-foscam-email-limitations}

Kamery Foscam stawiają unikalne wyzwania, które wymagają specyficznych podejść konfiguracyjnych. Najczęściej spotykanym komunikatem o błędzie jest „TLS certificate verification failed: unable to get local issuer certificate”, co oznacza, że kamera nie może zweryfikować nowoczesnych certyfikatów SSL używanych przez większość dostawców e-mail.

Problem ten wynika z kilku czynników: przestarzałych magazynów certyfikatów, których nie można zaktualizować, ograniczonej obsługi protokołu TLS do wersji 1.0 oraz ograniczeń firmware uniemożliwiających aktualizację protokołów bezpieczeństwa. Dodatkowo wiele modeli Foscam osiągnęło status end-of-life i nie otrzymuje już aktualizacji firmware, które mogłyby rozwiązać te problemy z kompatybilnością.

Legacy porty SMTP Forward Email specjalnie adresują te ograniczenia, utrzymując kompatybilność z TLS 1.0, jednocześnie zapewniając najwyższy możliwy poziom bezpieczeństwa dla tych starszych urządzeń.

### Kroki konfiguracji e-mail w Foscam {#foscam-email-configuration-steps}

Konfiguracja powiadomień e-mail na kamerach Foscam wymaga dokładnej uwagi przy wyborze portu i ustawieniach szyfrowania, aby obejść ograniczenia TLS urządzeń.

1. **Uzyskaj dostęp do interfejsu webowego kamery** wpisując adres IP kamery w przeglądarce internetowej. Kamery Foscam zazwyczaj używają portu 88 do dostępu webowego (np. <http://192.168.1.100:88>).

2. **Przejdź do menu Ustawienia** i wybierz „Mail Service” lub „Email Settings” w zależności od modelu kamery. Niektóre kamery Foscam organizują te ustawienia pod „Alarm” > „Mail Service”.

3. **Skonfiguruj serwer SMTP** wpisując smtp.forwardemail.net jako adres serwera. To jest kluczowe – nie używaj standardowych serwerów SMTP dostawców e-mail, ponieważ nie obsługują już TLS 1.0.

4. **Ustaw port i szyfrowanie** wybierając port 2455 dla szyfrowania SSL lub port 2555 dla szyfrowania STARTTLS. Są to legacy porty Forward Email specjalnie zaprojektowane dla urządzeń takich jak kamery Foscam.

5. **Skonfiguruj uwierzytelnianie** włączając uwierzytelnianie SMTP i wpisując swój alias Forward Email jako nazwę użytkownika. Użyj hasła wygenerowanego z [My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains).

6. **Ustaw informacje nadawcy i odbiorcy** konfigurując swój alias Forward Email jako adres nadawcy oraz dodając adresy odbiorców dla detekcji ruchu i alertów systemowych.

7. **Skonfiguruj wyzwalacze powiadomień** ustawiając czułość detekcji ruchu, harmonogramy nagrywania oraz inne zdarzenia, które powinny wywoływać powiadomienia e-mail.

8. **Przetestuj konfigurację e-mail** używając wbudowanej funkcji testowej Foscam. Jeśli test zakończy się sukcesem, powinieneś otrzymać testową wiadomość e-mail potwierdzającą poprawną konfigurację.

> \[!IMPORTANT]
> Kamery Foscam wymagają legacy portów Forward Email (2455 lub 2555) ze względu na ograniczenia TLS 1.0. Standardowe porty SMTP nie będą działać z tymi urządzeniami.

### Zaawansowana konfiguracja Foscam {#advanced-foscam-configuration}

Dla użytkowników wymagających bardziej zaawansowanych ustawień powiadomień, kamery Foscam oferują dodatkowe opcje konfiguracyjne, które mogą zwiększyć możliwości monitoringu bezpieczeństwa.

Skonfiguruj strefy detekcji ruchu, aby zmniejszyć liczbę fałszywych alarmów, definiując konkretne obszary pola widzenia kamery, które powinny wywoływać powiadomienia. Zapobiega to niepotrzebnym e-mailom spowodowanym przez czynniki środowiskowe, takie jak poruszające się drzewa czy przejeżdżające pojazdy.

Ustaw harmonogramy nagrywania zgodnie z potrzebami monitoringu, zapewniając, że powiadomienia e-mail będą wysyłane w odpowiednich godzinach. Kamery Foscam mogą tłumić powiadomienia w określonych godzinach, aby zapobiec alertom nocnym dla zdarzeń niekrytycznych.
Skonfiguruj wiele adresów odbiorców dla różnych typów alertów, co pozwala na kierowanie alertów wykrycia ruchu do personelu ochrony, a alertów konserwacji systemu do zespołu IT.

> \[!TIP]
> Kamery Foscam mogą generować znaczną ilość wiadomości e-mail, jeśli wykrywanie ruchu jest zbyt czułe. Zacznij od konserwatywnych ustawień i dostosuj je w oparciu o charakterystykę Twojego środowiska.


## Konfiguracja e-mail dla kamer bezpieczeństwa Hikvision {#hikvision-security-camera-email-configuration}

Kamery Hikvision stanowią znaczną część globalnego rynku kamer bezpieczeństwa, z modelami od podstawowych kamer IP po zaawansowane systemy nadzoru zasilane sztuczną inteligencją. Proces konfiguracji e-mail różni się znacznie między nowszymi modelami z nowoczesnym wsparciem TLS a starszymi urządzeniami wymagającymi obejść kompatybilności.

### Konfiguracja nowoczesnych kamer Hikvision {#modern-hikvision-camera-configuration}

Aktualne kamery Hikvision działające na najnowszych wersjach oprogramowania sprzętowego obsługują TLS 1.2+ i oferują kompleksowe możliwości powiadomień e-mail przez interfejs webowy.

1. **Uzyskaj dostęp do interfejsu webowego kamery** wpisując adres IP kamery w przeglądarce internetowej. Kamery Hikvision zazwyczaj używają standardowych portów HTTP/HTTPS do dostępu webowego.

2. **Przejdź do Konfiguracji** i wybierz „Sieć” > „Ustawienia zaawansowane” > „E-mail” w strukturze menu. Dokładna ścieżka może się różnić w zależności od modelu kamery i wersji oprogramowania.

3. **Skonfiguruj serwer SMTP** wpisując smtp.forwardemail.net jako adres serwera. Kamery Hikvision wymagają specyficznej konfiguracji SSL dla prawidłowego działania e-mail.

4. **Ustaw szyfrowanie na SSL** i skonfiguruj port 465. Kamery Hikvision nie obsługują STARTTLS, więc szyfrowanie SSL na porcie 465 jest zalecaną konfiguracją dla kompatybilności z Forward Email.

5. **Włącz uwierzytelnianie SMTP** i wpisz swój alias Forward Email jako nazwę użytkownika. Użyj hasła wygenerowanego z [Moje konto -> Domeny -> Aliasy](https://forwardemail.net/my-account/domains) do uwierzytelnienia.

6. **Skonfiguruj informacje nadawcy** ustawiając swój alias Forward Email jako adres nadawcy oraz dodając opisową nazwę, która pozwoli zidentyfikować kamerę w powiadomieniach e-mail.

7. **Skonfiguruj adresy odbiorców** dodając adresy e-mail, które mają otrzymywać alerty bezpieczeństwa, powiadomienia o wykryciu ruchu oraz aktualizacje statusu systemu.

8. **Skonfiguruj wyzwalacze zdarzeń** ustawiając wykrywanie ruchu, wykrywanie przekroczenia linii, wykrywanie wtargnięcia i inne zdarzenia, które powinny generować powiadomienia e-mail.

9. **Przetestuj konfigurację e-mail** używając wbudowanej funkcji testowej Hikvision, aby zweryfikować prawidłową łączność i uwierzytelnienie z serwerami Forward Email.

> \[!NOTE]
> Kamery Hikvision wymagają najnowszych wersji oprogramowania sprzętowego, aby prawidłowo obsługiwać szyfrowanie SSL i TLS. Sprawdź dostępność aktualizacji oprogramowania przed konfiguracją ustawień e-mail.

### Konfiguracja starszych kamer Hikvision {#legacy-hikvision-camera-configuration}

Starsze kamery Hikvision mogą mieć ograniczone wsparcie TLS i wymagać użycia portów SMTP kompatybilnych z trybem legacy Forward Email, aby utrzymać funkcjonalność e-mail.

1. **Uzyskaj dostęp do interfejsu webowego kamery** i przejdź do sekcji konfiguracji e-mail. Starsze kamery Hikvision mogą mieć inną strukturę menu niż obecne modele.

2. **Skonfiguruj legacy SMTP Forward Email** wpisując smtp.forwardemail.net jako adres serwera i używając portu 2455 dla połączeń SSL.

3. **Skonfiguruj uwierzytelnianie** używając swojego aliasu Forward Email i wygenerowanego hasła. Starsze kamery Hikvision mogą mieć specyficzne wymagania lub ograniczenia dotyczące uwierzytelniania.

4. **Skonfiguruj ustawienia szyfrowania** wybierając szyfrowanie SSL, aby dopasować konfigurację do portu legacy. Upewnij się, że metoda szyfrowania odpowiada wymaganiom portu 2455.

5. **Przetestuj konfigurację** i monitoruj błędy połączenia. Starsze kamery Hikvision mogą oferować ograniczone raportowanie błędów, co utrudnia rozwiązywanie problemów.

> \[!WARNING]
> Starsze kamery Hikvision mogą mieć znane luki bezpieczeństwa. Upewnij się, że te urządzenia są odpowiednio izolowane w Twojej sieci i rozważ aktualizację do nowszych modeli, gdy to możliwe.
## Konfiguracja e-mail dla kamer Dahua {#dahua-security-camera-email-configuration}

Kamery Dahua oferują solidne możliwości powiadomień e-mail w całej swojej szerokiej gamie produktów, od podstawowych kamer IP po zaawansowane systemy nadzoru zasilane sztuczną inteligencją. Proces konfiguracji jest zazwyczaj prosty dla nowoczesnych urządzeń, z pełnym wsparciem dla aktualnych standardów TLS.

### Konfiguracja e-mail kamer Dahua {#dahua-camera-email-setup}

Kamery Dahua oferują przyjazną konfigurację e-mail przez interfejs webowy, z dobrą kompatybilnością dla nowoczesnych standardów SMTP.

1. **Uzyskaj dostęp do interfejsu webowego kamery** wpisując adres IP kamery w przeglądarce internetowej. Kamery Dahua zazwyczaj oferują intuicyjne systemy konfiguracji oparte na przeglądarce.

2. **Przejdź do Setup** i wybierz „Network” > „Email” z menu konfiguracji. Kamery Dahua organizują ustawienia e-mail w dedykowanej sekcji dla łatwego dostępu.

3. **Skonfiguruj serwer SMTP** wpisując smtp.forwardemail.net jako adres serwera. Kamery Dahua obsługują zarówno metody szyfrowania SSL, jak i STARTTLS.

4. **Ustaw port i szyfrowanie** wybierając port 465 z szyfrowaniem SSL/TLS (zalecane) lub port 587 z szyfrowaniem STARTTLS.

5. **Włącz uwierzytelnianie SMTP** i wpisz swój alias Forward Email jako nazwę użytkownika. Użyj hasła wygenerowanego z [My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains).

6. **Skonfiguruj informacje nadawcy** ustawiając swój alias Forward Email jako adres nadawcy oraz dodając opisową nazwę, aby zidentyfikować źródło kamery.

7. **Ustaw adresy odbiorców** dodając adresy e-mail dla różnych typów powiadomień. Kamery Dahua obsługują wielu odbiorców dla różnych typów alertów.

8. **Skonfiguruj wyzwalacze zdarzeń** ustawiając detekcję ruchu, alerty manipulacji i inne zdarzenia bezpieczeństwa, które powinny generować powiadomienia e-mail.

9. **Przetestuj funkcjonalność e-mail** używając wbudowanej funkcji testowej Dahua, aby zweryfikować poprawną konfigurację i łączność.

> \[!TIP]
> Kamery Dahua często oferują szczegółowe przewodniki konfiguracyjne w swojej dokumentacji wiki. Zapoznaj się z [przewodnikiem konfiguracji e-mail Dahua](https://dahuawiki.com/Email/Email_Notifications_Setup_GMail) dla instrukcji specyficznych dla modelu.

### Konfiguracja e-mail rejestratora Dahua NVR {#dahua-nvr-email-configuration}

Rejestratory Dahua Network Video Recorders (NVR) zapewniają scentralizowane zarządzanie powiadomieniami e-mail dla wielu kamer, oferując efektywną administrację dużymi systemami nadzoru.

1. **Uzyskaj dostęp do interfejsu webowego NVR** wpisując adres IP NVR w przeglądarce internetowej. Rejestratory Dahua NVR oferują kompleksowe interfejsy zarządzania do konfiguracji systemowej.

2. **Przejdź do konfiguracji e-mail** wybierając „Setup” > „Network” > „Email” z głównego menu. NVR zazwyczaj organizują ustawienia e-mail na poziomie systemu.

3. **Skonfiguruj ustawienia serwera SMTP** wpisując smtp.forwardemail.net jako adres serwera oraz wybierając port 465 z szyfrowaniem SSL/TLS (zalecane) lub port 587 z STARTTLS.

4. **Skonfiguruj uwierzytelnianie** używając swojego aliasu Forward Email i wygenerowanego hasła. NVR obsługują standardowe metody uwierzytelniania SMTP.

5. **Skonfiguruj harmonogram powiadomień** ustawiając okresy czasu, kiedy powiadomienia e-mail powinny być aktywne. Pomaga to zarządzać ilością powiadomień poza godzinami pracy.

6. **Skonfiguruj powiadomienia oparte na zdarzeniach** definiując, które zdarzenia kamer powinny wywoływać alerty e-mail. NVR pozwalają na szczegółową kontrolę wyzwalaczy powiadomień dla wielu kamer.

7. **Przetestuj konfigurację e-mail na poziomie systemu** aby zapewnić prawidłowe działanie dla wszystkich podłączonych kamer i systemów monitoringu.


## Konfiguracja e-mail urządzeń wielofunkcyjnych Xerox {#xerox-multifunction-device-email-configuration}

Urządzenia wielofunkcyjne Xerox oferują korporacyjne możliwości powiadomień e-mail z pełnym wsparciem TLS oraz zaawansowanymi opcjami konfiguracji. Nowoczesne urządzenia Xerox wspierają aktualne standardy bezpieczeństwa, zachowując kompatybilność z różnymi środowiskami sieciowymi.

### Konfiguracja e-mail urządzeń wielofunkcyjnych Xerox {#xerox-mfd-email-setup}

Urządzenia wielofunkcyjne Xerox oferują zaawansowaną konfigurację e-mail przez webowy interfejs administracyjny, wspierając zarówno podstawowe powiadomienia, jak i zaawansowaną integrację przepływów pracy.
1. **Uzyskaj dostęp do interfejsu webowego urządzenia** poprzez wpisanie adresu IP urządzenia w przeglądarce internetowej. Urządzenia Xerox zazwyczaj oferują kompleksowe narzędzia administracji oparte na przeglądarce.

2. **Przejdź do Właściwości** i wybierz „Łączność” > „Protokoły” > „SMTP” z menu konfiguracji. Urządzenia Xerox organizują ustawienia e-mail w sekcji konfiguracji protokołów.

3. **Skonfiguruj serwer SMTP**, wpisując smtp.forwardemail.net jako adres serwera. Urządzenia Xerox obsługują konfigurowalne wersje TLS oraz metody szyfrowania.

4. **Ustaw konfigurację TLS**, wybierając TLS 1.2 lub wyższą jako minimalnie obsługiwaną wersję. Urządzenia Xerox pozwalają administratorom na konfigurację specyficznych wymagań TLS dla zwiększenia bezpieczeństwa.

5. **Skonfiguruj port i szyfrowanie**, ustawiając port 465 dla połączeń SSL/TLS (zalecane) lub port 587 dla połączeń STARTTLS.

6. **Skonfiguruj uwierzytelnianie SMTP**, włączając uwierzytelnianie i wpisując swój alias Forward Email jako nazwę użytkownika. Użyj hasła wygenerowanego z [Moje konto -> Domeny -> Aliasy](https://forwardemail.net/my-account/domains).

7. **Skonfiguruj informacje nadawcy**, ustawiając swój alias Forward Email jako adres nadawcy oraz konfigurując odpowiednie adresy do odpowiedzi dla zarządzania powiadomieniami.

8. **Skonfiguruj typy powiadomień**, definiując, które zdarzenia urządzenia powinny wywoływać alerty e-mail, w tym powiadomienia o konserwacji, błędach i zdarzeniach bezpieczeństwa.

9. **Przetestuj konfigurację e-mail** za pomocą kompleksowego systemu testowego Xerox, aby zweryfikować poprawność połączenia i uwierzytelnienia.

> \[!NOTE]
> Urządzenia Xerox oferują szczegółowe opcje konfiguracji TLS, które pozwalają na precyzyjne dostosowanie ustawień bezpieczeństwa. Zapoznaj się z [przewodnikiem konfiguracji TLS Xerox](https://www.support.xerox.com/en-us/article/KB0032169) dla zaawansowanych wymagań bezpieczeństwa.


## Konfiguracja e-mail urządzeń wielofunkcyjnych Ricoh {#ricoh-multifunction-device-email-configuration}

Urządzenia wielofunkcyjne Ricoh oferują rozbudowane możliwości e-mail w całej swojej szerokiej gamie produktów, od podstawowych drukarek biurowych po zaawansowane systemy produkcyjne. Jednakże [Ricoh ogłosił znaczące zmiany](https://www.ricoh.com/info/2025/0526_1) związane z zaprzestaniem podstawowego uwierzytelniania Microsoft, które wpływają na funkcjonalność e-mail.

### Nowoczesna konfiguracja Ricoh MFD {#modern-ricoh-mfd-configuration}

Aktualne urządzenia Ricoh obsługują nowoczesne standardy TLS i oferują kompleksowe możliwości powiadomień e-mail poprzez interfejs webowy.

1. **Uzyskaj dostęp do interfejsu webowego urządzenia** poprzez wpisanie adresu IP urządzenia w przeglądarce internetowej. Urządzenia Ricoh oferują intuicyjne systemy konfiguracji oparte na przeglądarce.

2. **Przejdź do konfiguracji e-mail** wybierając „Ustawienia systemu” > „Narzędzia administratora” > „Sieć” > „E-mail” z struktury menu.

3. **Skonfiguruj serwer SMTP**, wpisując smtp.forwardemail.net jako adres serwera. Urządzenia Ricoh obsługują zarówno metody szyfrowania SSL, jak i STARTTLS.

4. **Włącz SSL na stronie serwera SMTP**, aby aktywować szyfrowanie TLS. Interfejs Ricoh może być niejasny, ale włączenie SSL jest wymagane dla bezpiecznej funkcjonalności e-mail.

5. **Ustaw numer portu** na 465 dla połączeń SSL/TLS (zalecane) lub 587 dla połączeń STARTTLS. Upewnij się, że metoda szyfrowania odpowiada wybranemu portowi.

6. **Skonfiguruj uwierzytelnianie SMTP**, włączając uwierzytelnianie i wpisując swój alias Forward Email jako nazwę użytkownika. Użyj hasła wygenerowanego z [Moje konto -> Domeny -> Aliasy](https://forwardemail.net/my-account/domains).

7. **Skonfiguruj informacje nadawcy**, ustawiając swój alias Forward Email jako adres nadawcy oraz dodając odpowiednie informacje identyfikacyjne.

8. **Skonfiguruj typy powiadomień**, ustawiając skanowanie na e-mail, alerty urządzenia oraz powiadomienia o konserwacji zgodnie z wymaganiami operacyjnymi.

9. **Przetestuj funkcjonalność e-mail** za pomocą wbudowanego systemu testowego Ricoh, aby zweryfikować poprawność konfiguracji i połączenia.

> \[!IMPORTANT]
> Urządzenia Ricoh dotknięte zmianami Microsoft dotyczącymi podstawowego uwierzytelniania wymagają zaktualizowanych metod uwierzytelniania. Upewnij się, że oprogramowanie urządzenia obsługuje nowoczesne uwierzytelnianie lub skorzystaj z funkcji kompatybilności Forward Email.
### Konfiguracja starszych urządzeń Ricoh {#legacy-ricoh-device-configuration}

Starsze urządzenia Ricoh mogą wymagać użycia portów SMTP zgodnych z trybem legacy Forward Email ze względu na ograniczone wsparcie TLS oraz restrykcje dotyczące metod uwierzytelniania.

1. **Uzyskaj dostęp do interfejsu webowego urządzenia** i przejdź do sekcji konfiguracji poczty e-mail. Starsze urządzenia Ricoh mogą mieć inną strukturę menu niż obecne modele.

2. **Skonfiguruj legacy SMTP Forward Email**, wpisując smtp.forwardemail.net jako adres serwera oraz używając portu 2455 dla połączeń SSL.

3. **Włącz szyfrowanie SSL**, aby dopasować konfigurację do legacy portu. Upewnij się, że ustawienia szyfrowania odpowiadają wymaganiom portu 2455.

4. **Skonfiguruj uwierzytelnianie** używając swojego aliasu Forward Email oraz wygenerowanego hasła. Starsze urządzenia Ricoh mogą mieć specyficzne ograniczenia dotyczące uwierzytelniania.

5. **Przetestuj konfigurację** i monitoruj błędy uwierzytelniania lub połączenia. Starsze urządzenia mogą oferować ograniczone raportowanie błędów do celów diagnostycznych.


## Rozwiązywanie typowych problemów z konfiguracją {#troubleshooting-common-configuration-issues}

Konfiguracja poczty e-mail na urządzeniach może napotkać różne problemy związane z ustawieniami sieci, uwierzytelnianiem lub kompatybilnością protokołów. Znajomość typowych problemów i ich rozwiązań pomaga zapewnić niezawodne dostarczanie powiadomień w całym ekosystemie urządzeń.

### Problemy z uwierzytelnianiem i poświadczeniami {#authentication-and-credential-issues}

Błędy uwierzytelniania są najczęstszym problemem konfiguracji poczty e-mail we wszystkich typach urządzeń. Problemy te zwykle wynikają z nieprawidłowego użycia poświadczeń, niezgodności metod uwierzytelniania lub błędów w konfiguracji konta.

Zweryfikuj, czy używasz swojego aliasu Forward Email jako nazwy użytkownika, a nie adresu e-mail konta lub danych logowania. Wiele urządzeń jest wrażliwych na formatowanie nazwy użytkownika i wymaga dokładnego dopasowania do skonfigurowanego aliasu.

Upewnij się, że używasz wygenerowanego hasła z [Moje konto -> Domeny -> Aliasy](https://forwardemail.net/my-account/domains), a nie hasła do logowania do konta. Uwierzytelnianie SMTP wymaga specjalnego wygenerowanego hasła ze względów bezpieczeństwa, a użycie nieprawidłowych poświadczeń spowoduje błędy uwierzytelniania.

Sprawdź, czy Twoje konto Forward Email ma włączony odpowiedni dostęp SMTP oraz czy wymagania dotyczące uwierzytelniania dwuskładnikowego są poprawnie skonfigurowane. Niektóre konfiguracje kont mogą ograniczać dostęp SMTP do momentu właściwej aktywacji.

> \[!TIP]
> Jeśli uwierzytelnianie nadal się nie powodzi, wygeneruj ponownie hasło SMTP z [Moje konto -> Domeny -> Aliasy](https://forwardemail.net/my-account/domains) i zaktualizuj konfigurację urządzenia nowymi danymi.

### Problemy z TLS i szyfrowaniem {#tls-and-encryption-problems}

Problemy związane z TLS często pojawiają się, gdy urządzenia próbują używać nieobsługiwanych protokołów szyfrowania lub gdy występuje niezgodność między konfiguracją portu a ustawieniami szyfrowania.

W przypadku nowoczesnych urządzeń doświadczających błędów TLS, zweryfikuj, czy używasz właściwej kombinacji portu i szyfrowania: port 465 z SSL/TLS (zalecane) lub port 587 z STARTTLS. Ustawienia te muszą być dokładnie dopasowane, aby połączenia były udane.

Starsze urządzenia wyświetlające błędy walidacji certyfikatu powinny korzystać z portów kompatybilnych Forward Email (2455 lub 2555) zamiast standardowych portów SMTP. Porty te utrzymują kompatybilność z TLS 1.0, zapewniając odpowiednie bezpieczeństwo dla starszych urządzeń.

Jeśli walidacja certyfikatu nadal się nie powodzi na starszych urządzeniach, sprawdź, czy urządzenie pozwala wyłączyć walidację certyfikatu. Choć zmniejsza to bezpieczeństwo, może być konieczne dla dalszej funkcjonalności urządzeń, których nie można zaktualizować.

> \[!CAUTION]
> Wyłączenie walidacji certyfikatu zmniejsza bezpieczeństwo i powinno być stosowane tylko jako ostateczność dla starszych urządzeń, których nie można zaktualizować lub wymienić.

### Problemy z łącznością sieciową {#network-connectivity-issues}

Problemy sieciowe mogą uniemożliwiać urządzeniom nawiązanie połączenia z serwerami SMTP Forward Email, nawet jeśli ustawienia konfiguracji są poprawne.

Zweryfikuj, czy Twoja sieć pozwala na wychodzące połączenia na skonfigurowanych portach SMTP. Zapory sieciowe firmowe lub restrykcyjne polityki sieciowe mogą blokować niektóre porty, co wymaga dostosowania reguł zapory lub alternatywnej konfiguracji portów.
Sprawdź rozwiązywanie DNS, upewniając się, że Twoje urządzenia mogą rozwiązać smtp.forwardemail.net na poprawne adresy IP. Problemy z DNS mogą powodować niepowodzenia połączeń, nawet gdy łączność sieciowa działa poprawnie.

Przetestuj łączność sieciową za pomocą narzędzi diagnostycznych sieci dostępnych na urządzeniu, jeśli są dostępne. Wiele nowoczesnych urządzeń oferuje wbudowane możliwości testowania sieci, które mogą pomóc zidentyfikować problemy z łącznością.

Weź pod uwagę opóźnienia sieciowe i ustawienia timeout, jeśli urządzenia znajdują się w sieciach o wolnym lub wysokim opóźnieniu. Niektóre urządzenia mogą wymagać dostosowania timeoutów dla niezawodnej dostawy e-maili.

### Wyzwania konfiguracyjne specyficzne dla urządzeń {#device-specific-configuration-challenges}

Różni producenci urządzeń implementują funkcjonalność e-mail w różny sposób, co prowadzi do wyzwań konfiguracyjnych specyficznych dla producenta, które wymagają ukierunkowanych rozwiązań.

Drukarki HP mogą buforować zapytania DNS i wymagać restartu po zmianach konfiguracji. Jeśli problemy z połączeniem utrzymują się po konfiguracji, zrestartuj drukarkę, aby wyczyścić buforowane informacje sieciowe.

Drukarki Brother są szczególnie wrażliwe na formatowanie danych uwierzytelniających i mogą wymagać konfiguracji przez interfejs webowy zamiast panelu sterowania urządzenia dla niezawodnej konfiguracji.

Kamery Foscam wymagają specyficznej konfiguracji portów ze względu na ograniczenia TLS i mogą nie dostarczać szczegółowych komunikatów o błędach do diagnostyki. Upewnij się, że używasz portów legacy Forward Email (2455 lub 2555) dla tych urządzeń.

Kamery Hikvision wymagają szyfrowania SSL i nie obsługują STARTTLS, ograniczając opcje konfiguracji do portu 465 z szyfrowaniem SSL/TLS.

> \[!NOTE]
> Podczas rozwiązywania problemów specyficznych dla urządzeń, zapoznaj się z dokumentacją producenta dotyczącą znanych ograniczeń lub wymagań konfiguracyjnych, które mogą wpływać na funkcjonalność e-mail.


## Rozważania dotyczące bezpieczeństwa i najlepsze praktyki {#security-considerations-and-best-practices}

Konfiguracja powiadomień e-mail na urządzeniach sieciowych wiąże się z kilkoma aspektami bezpieczeństwa, które pomagają chronić Twoje systemy przy jednoczesnym utrzymaniu niezawodnej dostawy powiadomień. Stosowanie najlepszych praktyk bezpieczeństwa zapobiega nieautoryzowanemu dostępowi i zapewnia odpowiednie ujawnianie informacji w powiadomieniach.

### Zarządzanie poświadczeniami {#credential-management}

Używaj silnych, unikalnych haseł do konta Forward Email i włącz uwierzytelnianie dwuskładnikowe, jeśli jest dostępne. Wygenerowane hasło SMTP powinno być traktowane jako poufne poświadczenie i przechowywane bezpiecznie w konfiguracjach urządzeń.

Regularnie przeglądaj i zmieniaj hasła SMTP, szczególnie po zmianach personelu lub incydentach bezpieczeństwa. Forward Email umożliwia regenerację hasła bez wpływu na inne funkcje konta.

Unikaj używania współdzielonych poświadczeń na wielu urządzeniach, jeśli to możliwe. Chociaż Forward Email obsługuje wiele połączeń urządzeń z tymi samymi poświadczeniami, indywidualne poświadczenia dla urządzeń zapewniają lepszą izolację bezpieczeństwa i możliwości audytu.

Dokumentuj poświadczenia urządzeń w sposób bezpieczny i uwzględnij je w systemie zarządzania poświadczeniami Twojej organizacji. Właściwa dokumentacja zapewnia, że konfiguracje e-mail mogą być utrzymywane i aktualizowane w razie potrzeby.

### Bezpieczeństwo sieci {#network-security}

Wdroż odpowiednią segmentację sieci, aby izolować urządzenia od innych zasobów sieciowych, jednocześnie utrzymując niezbędną łączność dla powiadomień e-mail i legalnego dostępu.

Skonfiguruj reguły zapory sieciowej, aby zezwalać na niezbędny ruch SMTP, blokując jednocześnie niepotrzebny dostęp sieciowy. Urządzenia zazwyczaj potrzebują tylko dostępu wychodzącego do serwerów SMTP Forward Email dla funkcjonalności powiadomień.

Monitoruj ruch sieciowy z urządzeń, aby zidentyfikować nietypowe wzorce lub nieautoryzowane próby komunikacji. Niespodziewana aktywność sieciowa może wskazywać na problemy bezpieczeństwa wymagające dochodzenia.

Rozważ użycie VLAN-ów lub dedykowanych segmentów sieci dla ruchu zarządzania urządzeniami, w tym powiadomień e-mail, aby zapewnić dodatkową izolację bezpieczeństwa.

### Ujawnianie informacji {#information-disclosure}

Przejrzyj treść powiadomień e-mail, aby upewnić się, że nie zawierają wrażliwych informacji, które mogłyby być użyteczne dla atakujących. Niektóre urządzenia zawierają szczegółowe informacje o systemie, konfiguracjach sieciowych lub ścieżkach plików w wiadomościach powiadomień.
Skonfiguruj filtrowanie powiadomień, aby ograniczyć rodzaje informacji zawartych w alertach e-mail. Wiele urządzeń pozwala na dostosowanie treści powiadomień, aby zrównoważyć użyteczne informacje z wymaganiami bezpieczeństwa.

Wdroż odpowiednie polityki przechowywania i obsługi e-maili dla powiadomień urządzeń. Powiadomienia związane z bezpieczeństwem mogą wymagać przechowywania w celach zgodności lub dochodzeniowych.

Weź pod uwagę wrażliwość adresów e-mail odbiorców i upewnij się, że powiadomienia są wysyłane tylko do upoważnionych osób, które potrzebują dostępu do informacji.

### Monitoring i konserwacja {#monitoring-and-maintenance}

Regularnie testuj konfiguracje powiadomień e-mail, aby zapewnić ich ciągłą funkcjonalność. Okresowe testy pomagają wykryć odchylenia w konfiguracji, zmiany w sieci lub problemy z usługą, zanim wpłyną na dostarczanie krytycznych alertów.

Monitoruj wzorce powiadomień e-mail pod kątem oznak podejrzanej aktywności lub prób nieautoryzowanego dostępu. Niezwykłe ilości powiadomień lub nieoczekiwane zdarzenia systemowe mogą wskazywać na problemy z bezpieczeństwem.

Utrzymuj aktualne oprogramowanie układowe urządzeń, gdy to możliwe, aby zachować aktualne standardy bezpieczeństwa i wsparcie protokołów. Chociaż niektóre urządzenia osiągnęły status końca wsparcia, stosowanie dostępnych aktualizacji zabezpieczeń pomaga chronić przed znanymi lukami.

Wdroż alternatywne metody powiadamiania dla krytycznych alertów, gdy to możliwe. Chociaż powiadomienia e-mail są niezawodne, posiadanie alternatywnych mechanizmów alarmowania zapewnia redundancję dla najważniejszych zdarzeń systemowych.


## Podsumowanie {#conclusion}

Konfiguracja niezawodnych powiadomień e-mail w różnorodnych ekosystemach urządzeń wymaga zrozumienia złożonego krajobrazu kompatybilności TLS, metod uwierzytelniania oraz wymagań specyficznych dla producentów. Kompleksowa usługa SMTP Forward Email rozwiązuje te wyzwania, oferując zarówno nowoczesne standardy bezpieczeństwa dla aktualnych urządzeń, jak i kompatybilność wsteczną dla starszego sprzętu, którego nie można zaktualizować.

Procesy konfiguracyjne opisane w tym przewodniku zawierają szczegółowe, krok po kroku instrukcje dla głównych kategorii urządzeń, zapewniając administratorom możliwość ustanowienia niezawodnych powiadomień e-mail niezależnie od specyfiki ich sprzętu. Strategia dwuporowa Forward Email specjalnie adresuje kryzys kompatybilności TLS, który dotyka miliony wdrożonych urządzeń, oferując praktyczne rozwiązanie, które utrzymuje bezpieczeństwo przy jednoczesnym zapewnieniu ciągłej funkcjonalności.

Regularne testowanie i konserwacja konfiguracji powiadomień e-mail zapewnia ich ciągłą niezawodność i pomaga wykryć potencjalne problemy, zanim wpłyną na dostarczanie krytycznych alertów. Przestrzeganie najlepszych praktyk bezpieczeństwa oraz wskazówek dotyczących rozwiązywania problemów zawartych w tym przewodniku pomaga utrzymać bezpieczne, niezawodne systemy powiadomień, które informują administratorów o stanie urządzeń i zdarzeniach związanych z bezpieczeństwem.

Niezależnie od tego, czy zarządzasz małym biurem z mieszanymi markami drukarek i kamer, czy nadzorujesz środowisko korporacyjne z setkami urządzeń, Forward Email zapewnia infrastrukturę i kompatybilność potrzebną do niezawodnych powiadomień e-mail. Skupienie naszej usługi na kompatybilności urządzeń, w połączeniu z kompleksową dokumentacją i wsparciem, gwarantuje, że krytyczne alerty systemowe dotrą do Ciebie wtedy, gdy są najbardziej potrzebne.

W celu uzyskania dodatkowego wsparcia przy konfiguracji e-mail urządzeń lub pytań dotyczących kompatybilności Forward Email z konkretnym sprzętem, odwiedź naszą [często zadawane pytania dotyczące konfiguracji serwera SMTP](https://forwardemail.net/en/faq#what-are-your-smtp-server-configuration-settings) lub skontaktuj się z naszym zespołem wsparcia. Jesteśmy zobowiązani do pomocy w utrzymaniu niezawodnych powiadomień e-mail dla wszystkich Twoich urządzeń podłączonych do sieci, niezależnie od wieku czy ograniczeń producenta.
