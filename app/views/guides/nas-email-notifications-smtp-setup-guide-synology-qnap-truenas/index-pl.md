# Kompletny przewodnik po konfiguracji e-mail na NAS z Forward Email {#complete-guide-to-nas-email-setup-with-forward-email}

Konfiguracja powiadomień e-mail na Twoim NAS nie powinna być uciążliwa. Niezależnie od tego, czy masz Synology, QNAP, czy nawet Raspberry Pi, ten przewodnik pomoże Twojemu urządzeniu komunikować się z Forward Email, abyś faktycznie wiedział, kiedy coś pójdzie nie tak.

Większość urządzeń NAS może wysyłać alerty e-mail dotyczące awarii dysków, ostrzeżeń o temperaturze, zakończenia kopii zapasowej i zdarzeń związanych z bezpieczeństwem. Problem? Wielu dostawców usług e-mail stało się bardziej wymagających pod względem bezpieczeństwa, a starsze urządzenia często nie nadążają. Tu wkracza Forward Email – wspieramy zarówno nowoczesne, jak i starsze urządzenia.

Ten przewodnik obejmuje konfigurację e-mail dla ponad 75 dostawców NAS z instrukcjami krok po kroku, informacjami o kompatybilności i wskazówkami dotyczącymi rozwiązywania problemów. Bez względu na to, jakiego urządzenia używasz, sprawimy, że Twoje powiadomienia będą działać.


## Spis treści {#table-of-contents}

* [Dlaczego potrzebujesz powiadomień e-mail na NAS](#why-you-need-nas-email-notifications)
* [Problem z TLS (i jak go rozwiązujemy)](#the-tls-problem-and-how-we-fix-it)
* [Ustawienia SMTP Forward Email](#forward-email-smtp-settings)
* [Kompleksowa macierz kompatybilności dostawców NAS](#comprehensive-nas-provider-compatibility-matrix)
* [Konfiguracja e-mail Synology NAS](#synology-nas-email-configuration)
  * [Kroki konfiguracji](#configuration-steps)
* [Konfiguracja e-mail QNAP NAS](#qnap-nas-email-configuration)
  * [Kroki konfiguracji](#configuration-steps-1)
  * [Typowe problemy QNAP i ich rozwiązywanie](#common-qnap-troubleshooting-issues)
* [Konfiguracja legacy ReadyNAS](#readynas-legacy-configuration)
  * [Kroki konfiguracji legacy](#legacy-configuration-steps)
  * [Rozwiązywanie problemów ReadyNAS](#readynas-troubleshooting)
* [Konfiguracja TerraMaster NAS](#terramaster-nas-configuration)
* [Konfiguracja ASUSTOR NAS](#asustor-nas-configuration)
* [Konfiguracja Buffalo TeraStation](#buffalo-terastation-configuration)
* [Konfiguracja Western Digital My Cloud](#western-digital-my-cloud-configuration)
* [Konfiguracja e-mail TrueNAS](#truenas-email-configuration)
* [Konfiguracja OpenMediaVault](#openmediavault-configuration)
* [Konfiguracja Raspberry Pi NAS](#raspberry-pi-nas-configuration)
  * [Początkowa konfiguracja Raspberry Pi](#initial-raspberry-pi-setup)
  * [Konfiguracja udostępniania plików Samba](#samba-file-sharing-configuration)
  * [Konfiguracja serwera FTP](#ftp-server-setup)
  * [Konfiguracja powiadomień e-mail](#email-notification-configuration)
  * [Zaawansowane funkcje Raspberry Pi NAS](#advanced-raspberry-pi-nas-features)
  * [Rozwiązywanie problemów z e-mail na Raspberry Pi](#raspberry-pi-email-troubleshooting)
  * [Optymalizacja wydajności](#performance-optimization)
  * [Aspekty bezpieczeństwa](#security-considerations)


## Dlaczego potrzebujesz powiadomień e-mail na NAS {#why-you-need-nas-email-notifications}

Twój NAS monitoruje mnóstwo rzeczy – stan dysków, temperaturę, problemy z siecią, zdarzenia związane z bezpieczeństwem. Bez alertów e-mail problemy mogą pozostać niezauważone przez tygodnie, co może prowadzić do utraty danych lub naruszeń bezpieczeństwa.

Powiadomienia e-mail dają Ci natychmiastowe alerty, gdy dyski zaczynają się psuć, ostrzegają o nieautoryzowanych próbach dostępu, potwierdzają pomyślne kopie zapasowe i informują o stanie systemu. Forward Email zapewnia, że te krytyczne powiadomienia faktycznie do Ciebie dotrą.


## Problem z TLS (i jak go rozwiązujemy) {#the-tls-problem-and-how-we-fix-it}

Sprawa wygląda tak: jeśli Twój NAS został wyprodukowany przed 2020 rokiem, prawdopodobnie obsługuje tylko TLS 1.0. Gmail, Outlook i większość dostawców zrezygnowało z obsługi tego protokołu już dawno temu. Twoje urządzenie próbuje wysłać e-mail, jest odrzucane i zostajesz na ciemno.

Forward Email rozwiązuje to dzięki wsparciu dla dwóch portów. Nowoczesne urządzenia korzystają z naszych standardowych portów (`465` i `587`), podczas gdy starsze urządzenia mogą używać naszych portów legacy (`2455` i `2555`), które nadal obsługują TLS 1.0.

> \[!IMPORTANT]
> Forward Email wspiera zarówno nowoczesne, jak i legacy urządzenia NAS dzięki strategii dwóch portów. Używaj portów 465/587 dla nowoczesnych urządzeń z obsługą TLS 1.2+, a portów 2455/2555 dla starszych urządzeń obsługujących tylko TLS 1.0.


## Ustawienia SMTP Forward Email {#forward-email-smtp-settings}
Oto, co musisz wiedzieć o naszej konfiguracji SMTP:

**Dla nowoczesnych urządzeń NAS (2020+):** Używaj `smtp.forwardemail.net` z portem `465` (SSL/TLS) lub portem `587` (STARTTLS). Działają one z aktualnym oprogramowaniem sprzętowym, które obsługuje TLS 1.2+.

**Dla starszych urządzeń NAS:** Używaj `smtp.forwardemail.net` z portem `2455` (SSL/TLS) lub portem `2555` (STARTTLS). Obsługują one TLS 1.0 dla starszych urządzeń.

**Uwierzytelnianie:** Użyj swojego aliasu Forward Email jako nazwy użytkownika oraz wygenerowanego hasła z [Moje konto -> Domeny -> Aliasy](https://forwardemail.net/my-account/domains) (nie hasła do konta).

> \[!CAUTION]
> Nigdy nie używaj hasła do logowania na konto do uwierzytelniania SMTP. Zawsze używaj wygenerowanego hasła z [Moje konto -> Domeny -> Aliasy](https://forwardemail.net/my-account/domains) do konfiguracji NAS.

> \[!TIP]
> Sprawdź wersję oprogramowania sprzętowego swojego urządzenia NAS oraz obsługę TLS przed konfiguracją. Większość urządzeń wyprodukowanych po 2020 roku obsługuje nowoczesne protokoły TLS, podczas gdy starsze urządzenia zazwyczaj wymagają portów kompatybilnych z starszymi wersjami.


## Kompleksowa macierz kompatybilności dostawców NAS {#comprehensive-nas-provider-compatibility-matrix}

Poniższa macierz zawiera szczegółowe informacje o kompatybilności głównych dostawców NAS, w tym poziomy wsparcia TLS, status oprogramowania sprzętowego oraz zalecane ustawienia konfiguracji Forward Email.

| Dostawca NAS    | Aktualne modele | Obsługa TLS | Status oprogramowania | Zalecane porty | Typowe problemy                                                                                                                                         | Przewodnik konfiguracji / Zrzuty ekranu                                                                                                         |
| --------------- | --------------- | ----------- | --------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Synology        | DSM 7.x         | TLS 1.2+    | Aktywny               | `465`, `587`   | [Konfiguracja STARTTLS](https://community.synology.com/enu/forum/2/post/124584)                                                                        | [Konfiguracja powiadomień e-mail DSM](https://kb.synology.com/en-af/DSM/help/DSM/AdminCenter/system_notification_email)                        |
| QNAP            | QTS 5.x         | TLS 1.2+    | Aktywny               | `465`, `587`   | [Błędy Centrum powiadomień](https://www.qnap.com/en/how-to/faq/article/email-notifications-fail-after-updating-to-qts-524%E2%80%93fixed-in-qts-525)    | [Konfiguracja serwera e-mail QTS](https://docs.qnap.com/operating-system/qts/5.1.x/en-us/configuring-an-email-notification-server-EB4E6D7F.html) |
| Raspberry Pi    | Raspberry Pi OS | TLS 1.2+    | Aktywny               | `465`, `587`   | [Problemy z rozwiązywaniem DNS](https://www.raspberrypi.org/forums/viewtopic.php?t=294014)                                                            | [Przewodnik konfiguracji e-mail Raspberry Pi](#raspberry-pi-nas-configuration)                                                                 |
| ASUSTOR         | ADM 4.x         | TLS 1.2+    | Aktywny               | `465`, `587`   | [Weryfikacja certyfikatu](https://forum.asustor.com/viewtopic.php?f=134&t=12345)                                                                       | [Konfiguracja powiadomień ASUSTOR](https://www.asustor.com/en/online/online_help?id=8)                                                         |
| TerraMaster     | TOS 6.x         | TLS 1.2     | Aktywny               | `465`, `587`   | [Uwierzytelnianie SMTP](https://www.terra-master.com/global/forum/)                                                                                     | [Konfiguracja e-mail TerraMaster](https://www.terra-master.com/global/support/download.php)                                                     |
| TrueNAS         | SCALE/CORE      | TLS 1.2+    | Aktywny               | `465`, `587`   | [Konfiguracja certyfikatu SSL](https://www.truenas.com/community/threads/email-notifications-not-working.95234/)                                       | [Przewodnik konfiguracji e-mail TrueNAS](https://www.truenas.com/docs/scale/scaletutorials/systemsettings/general/settingupsystememail/)         |
| Buffalo         | TeraStation     | TLS 1.2     | Ograniczony           | `465`, `587`   | [Kompatybilność oprogramowania sprzętowego](https://buffaloamericas.com/knowledge-base/configuring-email-notifications-on-a-ts3010-or-ts5010-series-terastation) | [Konfiguracja e-mail TeraStation](https://buffaloamericas.com/knowledge-base/configuring-email-notifications-on-a-ts3010-or-ts5010-series-terastation) |
| Western Digital | My Cloud OS 5   | TLS 1.2     | Ograniczony           | `465`, `587`   | [Kompatybilność starszych systemów](https://community.wd.com/t/my-cloud-email-notifications-not-working/265432)                                       | [Konfiguracja e-mail My Cloud](https://support-en.wd.com/app/answers/detailweb/a_id/10222)                                                     |
| OpenMediaVault  | OMV 7.x         | TLS 1.2+    | Aktywny               | `465`, `587`   | [Zależności wtyczek](https://forum.openmediavault.org/index.php?thread/42156-email-notifications-not-working/)                                         | [Konfiguracja powiadomień OMV](https://docs.openmediavault.org/en/latest/administration/general/notifications.html)                            |
| Netgear ReadyNAS| OS 6.x          | Tylko TLS 1.0 | Wycofany             | `2455`, `2555` | [Wsparcie dla starszego TLS](https://kb.netgear.com/23066/How-do-I-manage-my-email-alert-contacts-on-my-ReadyNAS-OS-6-storage-system)                   | [Konfiguracja alertów e-mail ReadyNAS](https://kb.netgear.com/23066/How-do-I-manage-my-email-alert-contacts-on-my-ReadyNAS-OS-6-storage-system)  |
| Drobo           | Dashboard       | TLS 1.2     | Wycofany              | `465`, `587`   | [Ograniczone wsparcie](https://myprojects.drobo.com/support/)                                                                                        | [Powiadomienia e-mail Drobo](https://www.drobo.com/support/)                                                                                     |
Ta macierz pokazuje wyraźny podział między nowoczesnymi, aktywnie utrzymywanymi systemami NAS a urządzeniami starszymi, które wymagają specjalnych rozważań dotyczących kompatybilności. Większość obecnych urządzeń NAS obsługuje nowoczesne standardy TLS i może korzystać z głównych portów SMTP Forward Email bez żadnej specjalnej konfiguracji.


## Konfiguracja poczty Synology NAS {#synology-nas-email-configuration}

Urządzenia Synology z DSM są dość proste w konfiguracji. Obsługują nowoczesny TLS, więc możesz używać naszych standardowych portów bez problemów.

> \[!NOTE]
> Synology DSM 7.x oferuje najbardziej rozbudowane funkcje powiadomień e-mail. Starsze wersje DSM mogą mieć ograniczone opcje konfiguracji.

### Kroki konfiguracji {#configuration-steps}

1. **Uzyskaj dostęp do interfejsu webowego DSM** wpisując adres IP urządzenia NAS lub identyfikator QuickConnect w przeglądarce internetowej.

2. **Przejdź do Panelu sterowania** i wybierz sekcję „Powiadomienia”, następnie kliknij zakładkę „E-mail”, aby uzyskać dostęp do opcji konfiguracji poczty.

3. **Włącz powiadomienia e-mail** zaznaczając pole wyboru „Włącz powiadomienia e-mail”.

4. **Skonfiguruj serwer SMTP** wpisując `smtp.forwardemail.net` jako adres serwera.

5. **Ustaw konfigurację portu** na port 465 dla połączeń SSL/TLS (zalecane). Alternatywnie obsługiwany jest port 587 z STARTTLS.

6. **Skonfiguruj uwierzytelnianie** wybierając „Wymagane uwierzytelnianie SMTP” i wpisując swój alias Forward Email w polu nazwy użytkownika.

7. **Wprowadź hasło** korzystając z hasła wygenerowanego w [Moje konto -> Domeny -> Aliasy](https://forwardemail.net/my-account/domains).

8. **Skonfiguruj adresy odbiorców** wpisując do pięciu adresów e-mail, które mają otrzymywać powiadomienia.

9. **Skonfiguruj filtrowanie powiadomień** aby kontrolować, które zdarzenia wywołują alerty e-mail, zapobiegając przeciążeniu powiadomieniami, a jednocześnie zapewniając raportowanie krytycznych zdarzeń.

10. **Przetestuj konfigurację** używając wbudowanej funkcji testowej DSM, aby zweryfikować poprawność ustawień i prawidłową komunikację z serwerami Forward Email.

> \[!TIP]
> Synology pozwala na różne typy powiadomień dla różnych odbiorców, co daje elastyczność w dystrybucji alertów w zespole.


## Konfiguracja poczty QNAP NAS {#qnap-nas-email-configuration}

Urządzenia QNAP z QTS świetnie współpracują z Forward Email. Obsługują nowoczesny TLS i mają wygodny interfejs webowy do konfiguracji.

> \[!IMPORTANT]
> QNAP QTS 5.2.4 miał znany problem z powiadomieniami e-mail, który został [naprawiony w QTS 5.2.5](https://www.qnap.com/en/how-to/faq/article/email-notifications-fail-after-updating-to-qts-524%E2%80%93fixed-in-qts-525). Upewnij się, że masz zaktualizowane oprogramowanie, aby uniknąć problemów z powiadomieniami.

### Kroki konfiguracji {#configuration-steps-1}

1. **Uzyskaj dostęp do interfejsu webowego urządzenia QNAP** wpisując jego adres IP w przeglądarce internetowej.

2. **Przejdź do Panelu sterowania** i wybierz „Konto usługi i parowanie urządzeń”, następnie kliknij sekcję „E-mail”, aby rozpocząć konfigurację poczty.

3. **Kliknij „Dodaj usługę SMTP”** aby utworzyć nową konfigurację e-mail.

4. **Skonfiguruj serwer SMTP** wpisując `smtp.forwardemail.net` jako adres serwera SMTP.

5. **Wybierz odpowiedni protokół zabezpieczeń** – wybierz „SSL/TLS” z portem `465` (zalecane). Port `587` z STARTTLS jest również obsługiwany.

6. **Skonfiguruj numer portu** – zalecany jest port `465` z SSL/TLS. Port `587` z STARTTLS jest dostępny jako alternatywa.

7. **Wprowadź dane uwierzytelniające** używając swojego aliasu Forward Email jako nazwy użytkownika oraz wygenerowanego hasła z [Moje konto -> Domeny -> Aliasy](https://forwardemail.net/my-account/domains).

8. **Skonfiguruj informacje nadawcy** wpisując opisową nazwę w polu „Od”, np. „System QNAP NAS” lub nazwę hosta urządzenia.

9. **Skonfiguruj adresy odbiorców** dla różnych typów powiadomień. QNAP pozwala na konfigurację wielu grup odbiorców dla różnych typów alertów.

10. **Przetestuj konfigurację** używając wbudowanej funkcji testu e-mail QNAP, aby zweryfikować poprawność wszystkich ustawień.

> \[!TIP]
> Jeśli napotkasz [problemy z konfiguracją SMTP Gmail](https://forum.qnap.com/viewtopic.php?t=152466), te same kroki rozwiązywania problemów dotyczą Forward Email. Upewnij się, że uwierzytelnianie jest poprawnie włączone, a dane uwierzytelniające są prawidłowe.
> \[!NOTE]
> Urządzenia QNAP obsługują zaawansowane harmonogramy powiadomień, pozwalając na skonfigurowanie cichych godzin, podczas których powiadomienia niekrytyczne są tłumione. Jest to szczególnie przydatne w środowiskach biznesowych.

### Najczęstsze problemy z QNAP {#common-qnap-troubleshooting-issues}

Jeśli Twoje urządzenie QNAP [nie wysyła powiadomień e-mail](https://www.reddit.com/r/qnap/comments/1dc6z03/qnap_nas_will_not_send_notification_emails/), sprawdź następujące kwestie:

* Zweryfikuj, czy dane do logowania Forward Email są poprawne
* Upewnij się, że adres serwera SMTP to dokładnie `smtp.forwardemail.net`
* Potwierdź, że port odpowiada Twojej metodzie szyfrowania (`465` dla SSL/TLS jest zalecany; `587` dla STARTTLS jest również obsługiwany)
* Sprawdź, czy Twoja [konfiguracja serwera SMTP](https://www.qnap.com/en/how-to/faq/article/why-does-notification-center-fail-to-send-emails-to-my-smtp-server) pozwala na połączenie


## Konfiguracja Legacy ReadyNAS {#readynas-legacy-configuration}

Urządzenia Netgear ReadyNAS stawiają unikalne wyzwania ze względu na zakończone wsparcie firmware oraz oparcie na przestarzałych protokołach TLS 1.0. Jednak wsparcie portów legacy w Forward Email zapewnia, że te urządzenia mogą nadal niezawodnie wysyłać powiadomienia e-mail.

> \[!CAUTION]
> ReadyNAS OS 6.x obsługuje tylko TLS 1.0, co wymaga użycia portów kompatybilnych z legacy Forward Email `2455` i `2555`. Nowoczesne porty `465` i `587` nie będą działać z tymi urządzeniami.

### Kroki konfiguracji legacy {#legacy-configuration-steps}

1. **Uzyskaj dostęp do interfejsu webowego ReadyNAS** wpisując adres IP urządzenia w przeglądarce internetowej.

2. **Przejdź do System > Settings > Alerts**, aby uzyskać dostęp do sekcji konfiguracji e-mail.

3. **Skonfiguruj serwer SMTP**, wpisując `smtp.forwardemail.net` jako adres serwera.

4. **Ustaw konfigurację portu** na `2455` dla połączeń SSL/TLS lub `2555` dla połączeń STARTTLS – są to porty kompatybilne z legacy Forward Email.

5. **Włącz uwierzytelnianie** i wpisz swój alias Forward Email jako nazwę użytkownika oraz wygenerowane hasło z [Moje konto -> Domeny -> Aliasy](https://forwardemail.net/my-account/domains).

6. **Skonfiguruj informacje nadawcy** z opisowym adresem „Od”, aby zidentyfikować urządzenie ReadyNAS.

7. **Dodaj adresy e-mail odbiorców** używając przycisku + w sekcji kontaktów e-mail.

8. **Przetestuj konfigurację**, aby upewnić się, że połączenie legacy TLS działa poprawnie.

> \[!IMPORTANT]
> Urządzenia ReadyNAS wymagają portów legacy, ponieważ nie mogą nawiązać bezpiecznych połączeń przy użyciu nowoczesnych protokołów TLS. Jest to [znane ograniczenie](https://kb.netgear.com/23066/How-do-I-manage-my-email-alert-contacts-on-my-ReadyNAS-OS-6-storage-system) zakończonego wsparcia firmware.

### Rozwiązywanie problemów ReadyNAS {#readynas-troubleshooting}

Typowe problemy z konfiguracją e-mail ReadyNAS obejmują:

* **Niezgodność wersji TLS**: Upewnij się, że używasz portów `2455` lub `2555`, a nie nowoczesnych portów
* **Błędy uwierzytelniania**: Zweryfikuj poprawność danych logowania Forward Email
* **Problemy z łącznością sieciową**: Sprawdź, czy ReadyNAS może połączyć się z `smtp.forwardemail.net`
* **Ograniczenia firmware**: Niektóre starsze modele ReadyNAS mogą mieć dodatkowe [wymagania dotyczące konfiguracji HTTPS](https://kb.netgear.com/23100/How-do-I-configure-HTTPS-HTTP-with-SSL-encryption-settings-on-my-ReadyNAS-OS-6-storage-system)

Urządzenia ReadyNAS z systemem OS 6.x i wcześniejszymi wersjami obsługują tylko połączenia TLS 1.0, które większość nowoczesnych dostawców poczty już nie akceptuje. Dedykowane porty legacy Forward Email (2455 i 2555) specjalnie wspierają te starsze protokoły, zapewniając ciągłość działania dla użytkowników ReadyNAS.

Aby skonfigurować e-mail na urządzeniach ReadyNAS, uzyskaj dostęp do interfejsu webowego urządzenia przez jego adres IP. Przejdź do sekcji System i wybierz „Powiadomienia”, aby uzyskać opcje konfiguracji e-mail.

W sekcji konfiguracji e-mail włącz powiadomienia e-mail i wpisz smtp.forwardemail.net jako serwer SMTP. To jest kluczowe – używaj portów kompatybilnych z legacy Forward Email zamiast standardowych portów SMTP.

Dla połączeń SSL/TLS skonfiguruj port 2455 zamiast standardowego portu 465 (zalecane). Dla połączeń STARTTLS użyj portu 2555 zamiast portu 587. Te specjalne porty utrzymują kompatybilność z TLS 1.0, zapewniając najlepsze dostępne zabezpieczenia dla urządzeń legacy.
Wprowadź swój alias Forward Email jako nazwę użytkownika oraz wygenerowane hasło do uwierzytelniania. Urządzenia ReadyNAS obsługują uwierzytelnianie SMTP, które jest wymagane do połączeń Forward Email.

Skonfiguruj adres e-mail nadawcy oraz adresy odbiorców zgodnie z wymaganiami powiadomień. ReadyNAS pozwala na wiele adresów odbiorców, co umożliwia rozsyłanie alertów do różnych członków zespołu lub kont e-mail.

Dokładnie przetestuj konfigurację, ponieważ urządzenia ReadyNAS mogą nie dostarczać szczegółowych komunikatów o błędach w przypadku niepowodzenia konfiguracji. Jeśli standardowe testy nie działają, sprawdź, czy używasz właściwych portów legacy (2455 lub 2555) zamiast nowoczesnych portów SMTP.

Weź pod uwagę kwestie bezpieczeństwa związane z używaniem starszych protokołów TLS. Chociaż porty legacy Forward Email zapewniają najlepsze dostępne zabezpieczenia dla starszych urządzeń, zaleca się aktualizację do nowoczesnego systemu NAS z obsługą aktualnych protokołów TLS, jeśli to możliwe.


## Konfiguracja TerraMaster NAS {#terramaster-nas-configuration}

Urządzenia TerraMaster działające na TOS 6.x obsługują nowoczesne TLS i dobrze współpracują ze standardowymi portami Forward Email.

> \[!NOTE]
> TerraMaster TOS 6.x oferuje rozbudowane funkcje powiadomień e-mail. Upewnij się, że masz najnowsze oprogramowanie układowe dla najlepszej kompatybilności.

1. **Dostęp do ustawień systemowych**
   * Zaloguj się do interfejsu webowego TerraMaster
   * Przejdź do **Panel sterowania** > **Powiadomienia**

2. **Konfiguracja ustawień SMTP**
   * Serwer: `smtp.forwardemail.net`
   * Port: `465` (SSL/TLS, zalecany) lub `587` (STARTTLS)
   * Nazwa użytkownika: Twój alias Forward Email
   * Hasło: Wygenerowane hasło z [My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains)

3. **Włącz powiadomienia**
   * Zaznacz typy powiadomień, które chcesz otrzymywać
   * Przetestuj konfigurację za pomocą wbudowanej funkcji testowej

> \[!TIP]
> Urządzenia TerraMaster najlepiej działają z portem `465` dla połączeń SSL/TLS (zalecane). Jeśli napotkasz problemy, obsługiwany jest również port `587` z STARTTLS.


## Konfiguracja ASUSTOR NAS {#asustor-nas-configuration}

Urządzenia ASUSTOR z ADM 4.x mają solidne wsparcie powiadomień e-mail i działają bezproblemowo z Forward Email.

> \[!NOTE]
> ASUSTOR ADM 4.x zawiera zaawansowane opcje filtrowania powiadomień. Możesz dostosować, które zdarzenia wywołują alerty e-mail.

1. **Otwórz ustawienia powiadomień**
   * Wejdź do interfejsu webowego ADM
   * Przejdź do **Ustawienia** > **Powiadomienia**

2. **Skonfiguruj SMTP**
   * Serwer SMTP: `smtp.forwardemail.net`
   * Port: `465` (SSL/TLS, zalecany) lub `587` (STARTTLS)
   * Uwierzytelnianie: Włączone
   * Nazwa użytkownika: Twój alias Forward Email
   * Hasło: Wygenerowane hasło z [My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains)

3. **Konfiguracja typów alertów**
   * Wybierz, które zdarzenia systemowe mają wywoływać e-maile
   * Skonfiguruj adresy odbiorców
   * Przetestuj konfigurację

> \[!IMPORTANT]
> Urządzenia ASUSTOR wymagają wyraźnego włączenia uwierzytelniania w ustawieniach SMTP. Nie zapomnij zaznaczyć tej opcji.


## Konfiguracja Buffalo TeraStation {#buffalo-terastation-configuration}

Urządzenia Buffalo TeraStation mają ograniczone, ale funkcjonalne możliwości powiadomień e-mail. Konfiguracja jest prosta, gdy wiesz, gdzie szukać.

> \[!CAUTION]
> Aktualizacje oprogramowania układowego Buffalo TeraStation są rzadkie. Upewnij się, że używasz najnowszego dostępnego firmware dla swojego modelu przed konfiguracją e-mail.

1. **Dostęp do konfiguracji webowej**
   * Połącz się z interfejsem webowym TeraStation
   * Przejdź do **System** > **Powiadomienia**

2. **Konfiguracja ustawień e-mail**
   * Serwer SMTP: `smtp.forwardemail.net`
   * Port: `465` (SSL/TLS, zalecany) lub `587` (STARTTLS)
   * Nazwa użytkownika: Twój alias Forward Email
   * Hasło: Wygenerowane hasło z [My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains)
   * Włącz szyfrowanie SSL/TLS

3. **Ustaw preferencje powiadomień**
   * Wybierz, które zdarzenia wywołują e-maile (błędy dysku, alerty temperatury itp.)
   * Wprowadź adresy odbiorców
   * Zapisz i przetestuj konfigurację

> \[!NOTE]
> Niektóre starsze modele TeraStation mogą mieć ograniczone opcje konfiguracji SMTP. Sprawdź dokumentację swojego modelu, aby poznać szczegółowe możliwości.
## Konfiguracja Western Digital My Cloud {#western-digital-my-cloud-configuration}

Urządzenia Western Digital My Cloud działające na OS 5 obsługują powiadomienia e-mail, choć interfejs może być nieco ukryty w ustawieniach.

> \[!WARNING]
> Western Digital zakończył wsparcie dla wielu modeli My Cloud. Sprawdź, czy Twoje urządzenie nadal otrzymuje aktualizacje oprogramowania przed poleganiem na powiadomieniach e-mail w przypadku krytycznych alertów.

1. **Przejdź do Ustawień**
   * Otwórz panel My Cloud w przeglądarce
   * Przejdź do **Ustawienia** > **Ogólne** > **Powiadomienia**

2. **Skonfiguruj dane SMTP**
   * Serwer poczty: `smtp.forwardemail.net`
   * Port: `465` (SSL/TLS, zalecany) lub `587` (STARTTLS)
   * Nazwa użytkownika: Twój alias Forward Email
   * Hasło: Wygenerowane hasło z [Moje konto -> Domeny -> Aliasy](https://forwardemail.net/my-account/domains)
   * Włącz szyfrowanie

3. **Ustaw typy alertów**
   * Wybierz kategorie powiadomień (alerty systemowe, stan dysku itp.)
   * Dodaj adresy e-mail odbiorców
   * Przetestuj konfigurację e-mail

> \[!TIP]
> Zalecamy używanie portu `465` z SSL/TLS. Jeśli napotkasz problemy, port `587` z STARTTLS jest również obsługiwany.


## Konfiguracja e-mail TrueNAS {#truenas-email-configuration}

TrueNAS (zarówno SCALE, jak i CORE) oferuje doskonałe wsparcie powiadomień e-mail z rozbudowanymi opcjami konfiguracji.

> \[!NOTE]
> TrueNAS zapewnia jedne z najbardziej kompleksowych funkcji powiadomień e-mail wśród systemów NAS. Możesz skonfigurować szczegółowe reguły alertów i wielu odbiorców.

1. **Dostęp do ustawień systemowych**
   * Zaloguj się do interfejsu webowego TrueNAS
   * Przejdź do **System** > **E-mail**

2. **Skonfiguruj ustawienia SMTP**
   * Serwer poczty wychodzącej: `smtp.forwardemail.net`
   * Port serwera poczty: `465` (zalecany) lub `587`
   * Bezpieczeństwo: SSL/TLS (dla 465, zalecane) lub STARTTLS (dla 587)
   * Nazwa użytkownika: Twój alias Forward Email
   * Hasło: Wygenerowane hasło z [Moje konto -> Domeny -> Aliasy](https://forwardemail.net/my-account/domains)

3. **Ustaw alerty**
   * Przejdź do **System** > **Usługi alertów**
   * Skonfiguruj, które alerty mają być wysyłane e-mailem
   * Ustaw adresy odbiorców i poziomy alertów
   * Przetestuj konfigurację za pomocą wbudowanej funkcji testowej

> \[!IMPORTANT]
> TrueNAS pozwala na konfigurację różnych poziomów alertów (INFO, NOTICE, WARNING, ERROR, CRITICAL). Wybierz odpowiednie poziomy, aby uniknąć spamu e-mailowego, jednocześnie zapewniając raportowanie krytycznych problemów.


## Konfiguracja OpenMediaVault {#openmediavault-configuration}

OpenMediaVault oferuje solidne możliwości powiadomień e-mail przez swój interfejs webowy. Proces konfiguracji jest przejrzysty i prosty.

> \[!NOTE]
> System powiadomień OpenMediaVault opiera się na wtyczkach. Upewnij się, że masz zainstalowaną i włączoną wtyczkę powiadomień e-mail.

1. **Dostęp do ustawień powiadomień**
   * Otwórz interfejs webowy OpenMediaVault
   * Przejdź do **System** > **Powiadomienia** > **E-mail**

2. **Skonfiguruj parametry SMTP**
   * Serwer SMTP: `smtp.forwardemail.net`
   * Port: `465` (SSL/TLS, zalecany) lub `587` (STARTTLS)
   * Nazwa użytkownika: Twój alias Forward Email
   * Hasło: Wygenerowane hasło z [Moje konto -> Domeny -> Aliasy](https://forwardemail.net/my-account/domains)
   * Włącz SSL/TLS

3. **Ustaw reguły powiadomień**
   * Przejdź do **System** > **Powiadomienia** > **Powiadomienia**
   * Skonfiguruj, które zdarzenia systemowe mają wywoływać wysyłkę e-maili
   * Ustaw adresy odbiorców
   * Przetestuj funkcjonalność e-mail

> \[!TIP]
> OpenMediaVault pozwala na konfigurację harmonogramów powiadomień. Możesz ustawić godziny ciszy lub ograniczyć częstotliwość powiadomień, aby nie być przytłoczonym alertami.


## Konfiguracja Raspberry Pi NAS {#raspberry-pi-nas-configuration}

Raspberry Pi stanowi doskonały punkt startowy do funkcji NAS, oferując ekonomiczne rozwiązanie dla domów i małych biur. Konfiguracja Raspberry Pi jako urządzenia NAS obejmuje ustawienie protokołów udostępniania plików, powiadomień e-mail oraz niezbędnych usług sieciowych.

> \[!TIP]
> Dla entuzjastów Raspberry Pi zdecydowanie polecamy uzupełnienie konfiguracji NAS o [PiKVM](https://pikvm.org/) do zdalnego zarządzania serwerem oraz [Pi-hole](https://pi-hole.net/) do blokowania reklam w całej sieci i zarządzania DNS. Te narzędzia tworzą kompleksowe środowisko domowego laboratorium.
### Początkowa konfiguracja Raspberry Pi {#initial-raspberry-pi-setup}

Przed skonfigurowaniem usług NAS upewnij się, że Twój Raspberry Pi działa na najnowszym systemie Raspberry Pi OS i ma odpowiednią pojemność pamięci. Wysokiej jakości karta microSD (klasy 10 lub wyższej) lub dysk SSD USB 3.0 zapewniają lepszą wydajność i niezawodność operacji NAS.

1. **Zaktualizuj system** uruchamiając `sudo apt update && sudo apt upgrade -y`, aby upewnić się, że wszystkie pakiety są aktualne.

2. **Włącz dostęp SSH** za pomocą `sudo systemctl enable ssh && sudo systemctl start ssh` do zdalnej administracji.

3. **Skonfiguruj statyczne adresowanie IP** edytując plik `/etc/dhcpcd.conf`, aby zapewnić stały dostęp do sieci.

4. **Skonfiguruj zewnętrzną pamięć** poprzez podłączenie i montowanie dysków USB lub konfigurację macierzy RAID dla redundancji danych.

### Konfiguracja udostępniania plików Samba {#samba-file-sharing-configuration}

Samba zapewnia udostępnianie plików kompatybilne z Windows, dzięki czemu Twój Raspberry Pi jest dostępny z dowolnego urządzenia w sieci. Proces konfiguracji obejmuje instalację Samby, tworzenie udziałów i ustawianie uwierzytelniania użytkowników.

Zainstaluj Sambę za pomocą `sudo apt install samba samba-common-bin` i skonfiguruj główny plik konfiguracyjny w `/etc/samba/smb.conf`. Utwórz katalogi udostępnione i ustaw odpowiednie uprawnienia za pomocą `sudo mkdir -p /srv/samba/shared && sudo chmod 755 /srv/samba/shared`.

Skonfiguruj udziały Samby, dodając sekcje do pliku konfiguracyjnego dla każdego katalogu udostępnionego. Skonfiguruj uwierzytelnianie użytkowników za pomocą `sudo smbpasswd -a username`, aby utworzyć hasła specyficzne dla Samby do dostępu sieciowego.

> \[!IMPORTANT]
> Zawsze używaj silnych haseł dla użytkowników Samby i rozważ włączenie dostępu gościa tylko dla folderów nie zawierających wrażliwych danych. Zapoznaj się z [oficjalną dokumentacją Samby](https://www.samba.org/samba/docs/current/man-html/smb.conf.5.html) w celu zaawansowanych konfiguracji bezpieczeństwa.

### Konfiguracja serwera FTP {#ftp-server-setup}

FTP zapewnia inną metodę dostępu do plików, szczególnie przydatną do automatycznych kopii zapasowych i zdalnego zarządzania plikami. Zainstaluj i skonfiguruj vsftpd (Very Secure FTP Daemon) dla niezawodnych usług FTP.

Zainstaluj vsftpd za pomocą `sudo apt install vsftpd` i skonfiguruj usługę, edytując plik `/etc/vsftpd.conf`. Włącz dostęp lokalnych użytkowników, skonfiguruj ustawienia trybu pasywnego i ustaw odpowiednie ograniczenia bezpieczeństwa.

Utwórz użytkowników FTP i skonfiguruj uprawnienia dostępu do katalogów. Rozważ użycie SFTP (SSH File Transfer Protocol) zamiast tradycyjnego FTP dla zwiększonego bezpieczeństwa, ponieważ szyfruje on całą transmisję danych.

> \[!CAUTION]
> Tradycyjny FTP przesyła hasła w postaci niezaszyfrowanej. Zawsze używaj SFTP lub skonfiguruj FTP z szyfrowaniem TLS dla bezpiecznych transferów plików. Zapoznaj się z [najlepszymi praktykami bezpieczeństwa vsftpd](https://security.appspot.com/vsftpd.html) przed wdrożeniem.

### Konfiguracja powiadomień e-mail {#email-notification-configuration}

Skonfiguruj swój Raspberry Pi NAS do wysyłania powiadomień e-mail o zdarzeniach systemowych, alertach dotyczących pamięci i statusie zakończenia kopii zapasowych. Wymaga to instalacji i konfiguracji agenta transferu poczty oraz integracji z Forward Email.

Zainstaluj `msmtp` jako lekki klient SMTP za pomocą `sudo apt install msmtp msmtp-mta`. Utwórz plik konfiguracyjny w `/etc/msmtprc` z następującymi ustawieniami:

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

Skonfiguruj powiadomienia systemowe, ustawiając zadania cron i skrypty monitorujące system, które używają `msmtp` do wysyłania alertów. Utwórz skrypty monitorujące przestrzeń dyskową, alerty temperaturowe oraz powiadomienia o zakończeniu kopii zapasowej.

### Zaawansowane funkcje Raspberry Pi NAS {#advanced-raspberry-pi-nas-features}

Rozszerz swój Raspberry Pi NAS o dodatkowe usługi i możliwości monitorowania. Zainstaluj i skonfiguruj narzędzia do monitorowania sieci, rozwiązania do automatycznych kopii zapasowych oraz usługi zdalnego dostępu.

Skonfiguruj [Nextcloud](https://nextcloud.com/) dla funkcjonalności podobnej do chmury z dostępem do plików przez przeglądarkę, synchronizacją kalendarza i funkcjami współpracy. Zainstaluj za pomocą Dockera lub oficjalnego przewodnika instalacji Nextcloud dla Raspberry Pi.
Skonfiguruj automatyczne kopie zapasowe za pomocą `rsync` i `cron`, aby tworzyć zaplanowane kopie krytycznych danych. Skonfiguruj powiadomienia e-mail o zakończeniu tworzenia kopii zapasowej oraz alerty o błędach, korzystając z konfiguracji Forward Email.

Wdroż monitorowanie sieci za pomocą narzędzi takich jak [Nagios](https://www.nagios.org/) lub [Zabbix](https://www.zabbix.com/), aby monitorować stan systemu, łączność sieciową oraz dostępność usług.

> \[!NOTE]
> Dla użytkowników zarządzających infrastrukturą sieciową, rozważ integrację [Switchbot](https://www.reddit.com/r/pikvm/comments/skhxkm/pikvm_with_switchbot/) z Twoją konfiguracją PiKVM w celu zdalnej kontroli fizycznych przełączników. Ten [przewodnik integracji w Pythonie](https://www.reddit.com/r/pikvm/comments/skhxkm/pikvm_with_switchbot/) zawiera szczegółowe instrukcje automatyzacji zarządzania urządzeniami fizycznymi.

### Rozwiązywanie problemów z e-mailem na Raspberry Pi {#raspberry-pi-email-troubleshooting}

Typowe problemy z konfiguracją e-mail na Raspberry Pi obejmują problemy z rozwiązywaniem DNS, ograniczenia zapory sieciowej oraz błędy uwierzytelniania. Lekka natura systemów Raspberry Pi może czasami powodować problemy z czasem połączeń SMTP.

Jeśli powiadomienia e-mail nie działają, sprawdź plik dziennika `msmtp` pod adresem `/var/log/msmtp.log` w poszukiwaniu szczegółowych komunikatów o błędach. Zweryfikuj, czy Twoje dane uwierzytelniające Forward Email są poprawne oraz czy Raspberry Pi może rozwiązać `smtp.forwardemail.net`.

Przetestuj funkcjonalność e-mail za pomocą polecenia w terminalu: `echo "Test message" | msmtp recipient@example.com`. To pomaga wyizolować problemy konfiguracyjne od problemów specyficznych dla aplikacji.

Skonfiguruj poprawne ustawienia DNS w pliku `/etc/resolv.conf`, jeśli napotkasz problemy z rozwiązywaniem DNS. Rozważ użycie publicznych serwerów DNS, takich jak `8.8.8.8` lub `1.1.1.1`, jeśli lokalny DNS jest zawodny.

### Optymalizacja wydajności {#performance-optimization}

Optymalizuj wydajność swojego Raspberry Pi NAS poprzez właściwą konfigurację pamięci masowej, ustawień sieciowych oraz zasobów systemowych. Używaj wysokiej jakości urządzeń pamięci masowej i skonfiguruj odpowiednie opcje systemu plików dla swojego zastosowania.

Włącz bootowanie przez USB 3.0 dla lepszej wydajności pamięci masowej, jeśli korzystasz z dysków zewnętrznych. Skonfiguruj podział pamięci GPU za pomocą `sudo raspi-config`, aby przydzielić więcej RAM do operacji systemowych zamiast do przetwarzania grafiki.

Monitoruj wydajność systemu za pomocą narzędzi takich jak `htop`, `iotop` i `nethogs`, aby zidentyfikować wąskie gardła i zoptymalizować wykorzystanie zasobów. Rozważ aktualizację do Raspberry Pi 4 z 8GB RAM dla wymagających zastosowań NAS.

Wdroż odpowiednie rozwiązania chłodzące, aby zapobiec termicznemu ograniczaniu wydajności podczas intensywnych operacji. Monitoruj temperaturę CPU za pomocą `/opt/vc/bin/vcgencmd measure_temp` i zapewnij odpowiednią wentylację.

### Aspekty bezpieczeństwa {#security-considerations}

Zabezpiecz swój Raspberry Pi NAS, wdrażając odpowiednie kontrole dostępu, środki bezpieczeństwa sieci oraz regularne aktualizacje zabezpieczeń. Zmień domyślne hasła, wyłącz niepotrzebne usługi i skonfiguruj reguły zapory sieciowej.

Zainstaluj i skonfiguruj `fail2ban`, aby chronić się przed atakami brute force na SSH i inne usługi. Skonfiguruj automatyczne aktualizacje zabezpieczeń za pomocą `unattended-upgrades`, aby krytyczne poprawki bezpieczeństwa były stosowane na bieżąco.

Skonfiguruj segmentację sieci, aby izolować NAS od innych urządzeń sieciowych, jeśli to możliwe. Używaj dostępu VPN do połączeń zdalnych zamiast bezpośredniego wystawiania usług do internetu.

Regularnie twórz kopie zapasowe konfiguracji i danych Raspberry Pi, aby zapobiec utracie danych w wyniku awarii sprzętu lub incydentów bezpieczeństwa. Testuj procedury przywracania kopii zapasowych, aby zapewnić możliwość odzyskania danych.

Konfiguracja Raspberry Pi NAS stanowi doskonałą podstawę do nauki koncepcji przechowywania sieciowego, jednocześnie dostarczając praktyczną funkcjonalność dla środowisk domowych i małych biur. Połączenie z Forward Email zapewnia niezawodne dostarczanie powiadomień o monitoringu systemu i alertach konserwacyjnych.
