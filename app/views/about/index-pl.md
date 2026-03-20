# O Forward Email {#about-forward-email}

<img loading="lazy" src="/img/articles/about.webp" alt="Zespół i historia firmy Forward Email" class="rounded-lg" />

# O Forward Email {#about-forward-email-1}


## Spis treści {#table-of-contents}

* [Przegląd](#overview)
* [Założyciel i misja](#founder-and-mission)
* [Oś czasu](#timeline)
  * [2017 - Założenie i start](#2017---founding-and-launch)
  * [2018 - Infrastruktura i integracja](#2018---infrastructure-and-integration)
  * [2019 - Rewolucja wydajności](#2019---performance-revolution)
  * [2020 - Skupienie na prywatności i bezpieczeństwie](#2020---privacy-and-security-focus)
  * [2021 - Modernizacja platformy](#2021---platform-modernization)
  * [2023 - Rozbudowa infrastruktury i funkcji](#2023---infrastructure-and-feature-expansion)
  * [2024 - Optymalizacja usług i zaawansowane funkcje](#2024---service-optimization-and-advanced-features)
  * [2025 - Ulepszenia prywatności i wsparcie protokołów {#2025---privacy-enhancements-and-protocol-support}](#2025---privacy-enhancements-and-protocol-support-2025---privacy-enhancements-and-protocol-support)
  * [2026 - Zgodność z RFC i zaawansowane filtrowanie {#2026---rfc-compliance-and-advanced-filtering}](#2026---rfc-compliance-and-advanced-filtering-2026---rfc-compliance-and-advanced-filtering)
* [Podstawowe zasady](#core-principles)
* [Aktualny status](#current-status)


## Przegląd {#overview}

> \[!TIP]
> Aby poznać szczegóły techniczne dotyczące naszej architektury, implementacji zabezpieczeń i planów rozwoju, zobacz [Technical Whitepaper](https://forwardemail.net/technical-whitepaper.pdf).

Forward Email to [bezpłatna i otwartoźródłowa](https://en.wikipedia.org/wiki/Free_and_open-source "Free and open-source") usługa [przekazywania e-maili](https://en.wikipedia.org/wiki/Email_forwarding "Email forwarding") skoncentrowana na [prawie użytkownika do prywatności](https://en.wikipedia.org/wiki/Right_to_privacy "Right to privacy"). To, co zaczęło się w 2017 roku jako proste rozwiązanie do przekazywania e-maili, rozwinęło się w kompleksową platformę e-mailową oferującą nieograniczoną liczbę niestandardowych nazw domen, nieograniczoną liczbę adresów e-mail i aliasów, nieograniczoną liczbę jednorazowych adresów e-mail, ochronę przed spamem i phishingiem, zaszyfrowane przechowywanie skrzynek oraz liczne zaawansowane funkcje.

Usługa jest utrzymywana i własnością oryginalnego zespołu założycieli – projektantów i programistów. Została zbudowana w 100% na oprogramowaniu open-source wykorzystującym [JavaScript](https://en.wikipedia.org/wiki/JavaScript "JavaScript"), [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js"), [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System"), [HTTPS](https://en.wikipedia.org/wiki/HTTPS "HTTPS"), [TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security "TLS") oraz [SMTP](https://en.wikipedia.org/wiki/SMTP "SMTP").


## Założyciel i misja {#founder-and-mission}

Forward Email został założony przez **Nicholasa Baugh** w 2017 roku. Według [Technical Whitepaper Forward Email](https://forwardemail.net/technical-whitepaper.pdf), Baugh początkowo szukał niedrogiego i prostego rozwiązania umożliwiającego korzystanie z e-maili na domenach dla swoich projektów pobocznych. Po zbadaniu dostępnych opcji zaczął tworzyć własne rozwiązanie i 2 października 2017 roku zakupił domenę `forwardemail.net`.

Misja Forward Email wykracza poza świadczenie usług e-mailowych — ma na celu zmianę podejścia branży do prywatności i bezpieczeństwa e-maili. Podstawowe wartości firmy to przejrzystość, kontrola użytkownika oraz ochrona prywatności poprzez techniczne wdrożenia, a nie tylko obietnice polityczne.


## Oś czasu {#timeline}

### 2017 - Założenie i start {#2017---founding-and-launch}

**2 października 2017**: Nicholas Baugh zakupił domenę `forwardemail.net` po poszukiwaniu niedrogich rozwiązań e-mailowych dla swoich projektów pobocznych.

**5 listopada 2017**: Baugh stworzył plik JavaScript o długości 634 linii używając [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js") do przekazywania e-maili dla dowolnej niestandardowej nazwy domeny. Ta początkowa implementacja została opublikowana jako open-source na [GitHub](https://github.com/forwardemail), a usługa została uruchomiona przy użyciu GitHub Pages.
**Listopad 2017**: Forward Email oficjalnie uruchomiony po wstępnej wersji. Wczesna wersja była czysto oparta na DNS, bez rejestracji konta czy procesu rejestracji — po prostu plik README napisany w Markdown z instrukcjami. Użytkownicy mogli skonfigurować przekazywanie poczty, ustawiając rekordy MX wskazujące na `mx1.forwardemail.net` i `mx2.forwardemail.net` oraz dodając rekord TXT z `forward-email=user@gmail.com`.

Prostota i skuteczność tego rozwiązania przyciągnęły uwagę znanych programistów, w tym [Davida Heinemeiera Hanssona](https://dhh.dk) (twórcy Ruby on Rails), który do dziś korzysta z Forward Email na swojej domenie `dhh.dk`.

### 2018 - Infrastruktura i integracja {#2018---infrastructure-and-integration}

**Kwiecień 2018**: Gdy [Cloudflare](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") uruchomił swoją [usługę DNS dla konsumentów z priorytetem prywatności](https://blog.cloudflare.com/announcing-1111/), Forward Email zmienił dostawcę obsługi zapytań [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System") z [OpenDNS](https://en.wikipedia.org/wiki/OpenDNS "OpenDNS") na [Cloudflare](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare"), demonstrując zaangażowanie firmy w wybór infrastruktury skoncentrowanej na prywatności.

**Październik 2018**: Forward Email umożliwił użytkownikom funkcję "Wyślij jako" z [Gmail](https://en.wikipedia.org/wiki/Gmail "Gmail") i [Outlook](https://en.wikipedia.org/wiki/Outlook "Outlook"), rozszerzając możliwości integracji z popularnymi dostawcami poczty.

### 2019 - Rewolucja wydajności {#2019---performance-revolution}

**Maj 2019**: Forward Email wydał wersję v2, która stanowiła gruntowny przepis od początkowych wersji. Ta aktualizacja skupiła się na poprawie [wydajności](https://en.wikipedia.org/wiki/Software_performance_testing "Software performance testing") poprzez wykorzystanie [strumieni](https://en.wikipedia.org/wiki/Streams "Streams") w [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js"), tworząc fundament pod skalowalność platformy.

### 2020 - Skupienie na prywatności i bezpieczeństwie {#2020---privacy-and-security-focus}

**Luty 2020**: Forward Email wprowadził plan Enhanced Privacy Protection, pozwalający użytkownikom wyłączyć ustawianie publicznych wpisów rekordów DNS z aliasami konfiguracji przekazywania poczty. Dzięki temu planowi informacje o aliasach e-mail użytkownika są ukryte przed publicznym wyszukiwaniem w Internecie. Firma wprowadziła także funkcję umożliwiającą włączanie lub wyłączanie konkretnych aliasów, które nadal mogą pojawiać się jako ważne adresy e-mail i zwracać poprawne [kody statusu SMTP](https://en.wikipedia.org/wiki/List_of_SMTP_server_return_codes "List of SMTP server return codes"), przy czym wiadomości są natychmiast odrzucane (podobnie jak przekierowanie wyjścia do [/dev/null](https://en.wikipedia.org/wiki/Null_device "Null device")).

**Kwiecień 2020**: Po wielu przeszkodach z istniejącymi rozwiązaniami do wykrywania spamu, które nie respektowały polityki prywatności Forward Email, firma wydała pierwszą wersję alfa Spam Scanner. To całkowicie darmowe i otwarte źródłowo rozwiązanie do [filtrowania antyspamowego](https://en.wikipedia.org/wiki/Anti-spam_techniques "Anti-spam techniques") wykorzystuje podejście [filtra spamu Naive Bayes](https://en.wikipedia.org/wiki/Naive_Bayes_spam_filtering "Naive Bayes spam filtering") połączone z ochroną przed [phishingiem](https://en.wikipedia.org/wiki/Phishing "Phishing") oraz [atakami homografów IDN](https://en.wikipedia.org/wiki/IDN_homograph_attack "IDN homograph attack"). Forward Email wprowadził również [uwierzytelnianie dwuskładnikowe](https://en.wikipedia.org/wiki/Multi-factor_authentication "Multi-factor authentication") (2FA) z wykorzystaniem [jednorazowych haseł](https://en.wikipedia.org/wiki/One-time_password "One-time password") (OTP) dla zwiększenia bezpieczeństwa konta.

**Maj 2020**: Forward Email umożliwił niestandardowe [przekierowanie portów](https://en.wikipedia.org/wiki/Port_forwarding "Port forwarding") jako obejście dla użytkowników, którzy chcieli ominąć blokady portów nałożone przez ich [ISP](https://en.wikipedia.org/wiki/Internet_service_provider "Internet service provider"). Firma udostępniła także swój [bezpłatny RESTful API do przekazywania poczty](email-api) z pełną dokumentacją oraz przykładami zapytań i odpowiedzi w czasie rzeczywistym, wraz z obsługą webhooków.
**Sierpień 2020**: Forward Email dodał wsparcie dla systemu uwierzytelniania poczty elektronicznej [Authenticated Received Chain](arc) ("ARC"), co dodatkowo wzmocniło bezpieczeństwo i dostarczalność wiadomości e-mail.

**23 listopada 2020**: Forward Email oficjalnie wystartował poza programem beta, co stanowiło ważny kamień milowy w rozwoju platformy.

### 2021 - Modernizacja platformy {#2021---platform-modernization}

**Luty 2021**: Forward Email zrefaktoryzował swoją bazę kodu, usuwając wszystkie zależności od [Pythona](https://en.wikipedia.org/wiki/Python_\(programming_language\) "Python (programming language)"), co pozwoliło na całkowite przejście stosu technologicznego na [JavaScript](https://en.wikipedia.org/wiki/JavaScript "JavaScript") i [Node.js](https://en.wikipedia.org/wiki/Node.js). Ta decyzja architektoniczna była zgodna z zaangażowaniem firmy w utrzymanie spójnego, otwartoźródłowego stosu technologicznego.

**27 września 2021**: Forward Email [dodał wsparcie](email-forwarding-regex-pattern-filter) dla aliasów przekierowań e-mail, które mogą dopasowywać się do [wyrażeń regularnych](https://en.wikipedia.org/wiki/Regular_expression "Regular expression"), oferując użytkownikom bardziej zaawansowane możliwości routingu wiadomości.

### 2023 - Rozbudowa infrastruktury i funkcji {#2023---infrastructure-and-feature-expansion}

**Styczeń 2023**: Forward Email uruchomił przeprojektowaną i zoptymalizowaną pod kątem szybkości ładowania stron witrynę, poprawiając doświadczenie użytkownika i wydajność.

**Luty 2023**: Firma dodała wsparcie dla [logów błędów](/faq#do-you-store-error-logs) oraz wprowadziła [tryb ciemny](https://en.wikipedia.org/wiki/Light-on-dark_color_scheme) w schemacie kolorów strony, odpowiadając na preferencje użytkowników i potrzeby dostępności.

**Marzec 2023**: Forward Email wydał [Tangerine](https://github.com/forwardemail/tangerine#readme) i zintegrował go w całej swojej infrastrukturze, umożliwiając korzystanie z [DNS over HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") na warstwie aplikacji. Firma dodała także wsparcie dla [MTA-STS](/faq#do-you-support-mta-sts) oraz przeszła z [hCaptcha](/) na [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile).

**Kwiecień 2023**: Forward Email wdrożył i w pełni zautomatyzował całkowicie nową infrastrukturę. Cała usługa zaczęła działać na globalnie zrównoważonym obciążeniem i DNS opartym na bliskości z kontrolą stanu i przełączaniem awaryjnym przy użyciu [Cloudflare](https://cloudflare.com), zastępując poprzednie podejście round-robin DNS. Firma przeszła na **serwery bare metal** u wielu dostawców, w tym [Vultr](https://www.vultr.com/?ref=429848) i [Digital Ocean](https://m.do.co/c/a7cecd27e071), obaj dostawcy zgodni z SOC 2 Type 1. Bazy danych MongoDB i Redis zostały przeniesione do konfiguracji klastrowych z węzłami głównymi i zapasowymi dla wysokiej dostępności, szyfrowaniem SSL end-to-end, szyfrowaniem danych w spoczynku oraz odzyskiwaniem punktowym (PITR).

**Maj 2023**: Forward Email uruchomił funkcję **wychodzącego SMTP** dla [wysyłania e-maili przez SMTP](/faq#do-you-support-sending-email-with-smtp) oraz [wysyłania e-maili przez API](/faq#do-you-support-sending-email-with-api). Funkcja ta zawiera wbudowane zabezpieczenia zapewniające wysoką dostarczalność, nowoczesny i solidny system kolejkowania i ponawiania prób oraz [obsługuje logi błędów w czasie rzeczywistym](/faq#do-you-store-error-logs).

**Listopad 2023**: Forward Email uruchomił funkcję [**zaszyfrowanego przechowywania skrzynki pocztowej**](/blog/docs/best-quantum-safe-encrypted-email-service) dla [wsparcia IMAP](/faq#do-you-support-receiving-email-with-imap), co stanowi znaczący postęp w prywatności i bezpieczeństwie poczty elektronicznej.

**Grudzień 2023**: Firma [dodała wsparcie](/faq#do-you-support-pop3) dla [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol), [passkey i WebAuthn](/faq#do-you-support-passkeys-and-webauthn), monitorowania [time to inbox](/faq#i) oraz [OpenPGP dla przechowywania IMAP](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd).

### 2024 - Optymalizacja usługi i zaawansowane funkcje {#2024---service-optimization-and-advanced-features}

**Luty 2024**: Forward Email [dodał wsparcie dla kalendarzy (CalDAV)](/faq#do-you-support-calendars-caldav), rozszerzając możliwości platformy poza pocztę elektroniczną o synchronizację kalendarza.
**Marzec do lipca 2024**: Forward Email wprowadził istotne optymalizacje i ulepszenia swoich usług IMAP, POP3 oraz CalDAV, mające na celu uczynienie ich serwisu tak szybkim, jeśli nie szybszym, niż alternatywy.

**Lipiec 2024**: Firma [dodała wsparcie dla iOS Push](https://github.com/nodemailer/wildduck/issues/711#issuecomment-2254114016), aby rozwiązać problem braku wsparcia dla polecenia IMAP `IDLE` w Apple Mail na iOS, umożliwiając powiadomienia w czasie rzeczywistym na urządzeniach Apple iOS. Forward Email dodał również monitorowanie czasu dotarcia do skrzynki odbiorczej ("TTI") dla własnej usługi oraz Yahoo/AOL, a także zaczął pozwalać użytkownikom na szyfrowanie całego rekordu DNS TXT nawet w darmowym planie. Na prośbę z [dyskusji Privacy Guides](https://discuss.privacyguides.net/t/forward-email-email-provider/13370) oraz [zgłoszeń na GitHub](https://github.com/forwardemail/forwardemail.net/issues/254), firma dodała możliwość, aby aliasy mogły cicho odrzucać `250`, miękko odrzucać `421` lub twardo odrzucać `550` po wyłączeniu.

**Sierpień 2024**: Forward Email dodał wsparcie dla eksportu skrzynek pocztowych w formatach [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions) oraz [Mbox](https://en.wikipedia.org/wiki/Mbox) (oprócz istniejącego formatu eksportu [SQLite](https://en.wikipedia.org/wiki/SQLite)). [Dodano wsparcie dla podpisów webhooków](https://forwardemail.net/faq#do-you-support-bounce-webhooks), a firma zaczęła pozwalać użytkownikom na wysyłanie newsletterów, ogłoszeń i marketingu e-mailowego przez swój serwis SMTP wychodzący. Wprowadzono również kwoty przechowywania dla IMAP/POP3/CalDAV na poziomie domeny oraz aliasów.

### 2025 - Ulepszenia prywatności i wsparcie protokołów {#2025---privacy-enhancements-and-protocol-support} {#2025---privacy-enhancements-and-protocol-support-2025---privacy-enhancements-and-protocol-support}

**Wrzesień 2024 do stycznia 2025**: Forward Email [dodał bardzo oczekiwaną funkcję autorespondera wakacyjnego oraz szyfrowanie OpenPGP/WKD dla przekazywania poczty](https://discuss.privacyguides.net/t/forward-email-email-provider/13370/254), rozwijając już wdrożone możliwości szyfrowanego przechowywania skrzynek pocztowych.

**21 stycznia 2025**: Najlepszy przyjaciel założyciela, "Jack", jego wierny towarzysz, spokojnie odszedł w wieku prawie 11 lat. Jack [zawsze będzie pamiętany](https://github.com/forwardemail/forwardemail.net/commit/994ce771f0338cbe77f10bd613989e0924883f9b) za niezachwianą towarzyskość, która wspierała powstanie Forward Email. [Techniczny dokument Forward Email](https://forwardemail.net/technical-whitepaper.pdf) jest mu dedykowany, uznając jego rolę w rozwoju usługi.

**Luty 2025**: Forward Email zmienił dostawcę głównego centrum danych na [DataPacket](https://www.datapacket.com), wdrażając niestandardowy, wydajnościowy sprzęt bare-metal, aby jeszcze bardziej zwiększyć niezawodność i szybkość usługi.

**Marzec 2025**: Oficjalne wydanie wersji 1.0 Forward Email.

**Kwiecień 2025**: Opublikowano pierwszą wersję [Technicznego dokumentu Forward Email](https://forwardemail.net/technical-whitepaper.pdf), a firma zaczęła akceptować płatności w kryptowalutach.

**Maj 2025**: Usługa uruchomiła nową dokumentację API korzystającą z [Scalar](https://github.com/scalar/scalar).

**Czerwiec 2025**: Forward Email uruchomił wsparcie dla protokołu [CardDAV](/faq#do-you-support-contacts-carddav), rozszerzając możliwości platformy o synchronizację kontaktów obok istniejących usług poczty i kalendarza.

**Sierpień 2025**: Platforma dodała wsparcie dla [CalDAV VTODO/zadań](https://en.wikipedia.org/wiki/ICalendar#To-do_\(VTODO\)), umożliwiając zarządzanie zadaniami obok wydarzeń kalendarza.

**Listopad 2025**: Zwiększono bezpieczeństwo platformy poprzez migrację z PBKDF2 na [Argon2id](https://en.wikipedia.org/wiki/Argon2) do hashowania haseł oraz migrację infrastruktury z Redis na [Valkey](https://github.com/valkey-io/valkey).

**Grudzień 2025**: Wydano wersję 2.0, wprowadzając wsparcie dla [REQUIRETLS (RFC 8689)](/rfc#requiretls-support) wymuszającego szyfrowanie TLS na transporcie e-mail oraz aktualizację do [OpenPGP.js](https://github.com/openpgpjs/openpgpjs) w wersji 6.
### 2026 - Zgodność z RFC i Zaawansowane Filtrowanie {#2026---rfc-compliance-and-advanced-filtering} {#2026---rfc-compliance-and-advanced-filtering-2026---rfc-compliance-and-advanced-filtering}

**Styczeń 2026**: Forward Email opublikował kompleksowy [dokument zgodności z protokołami RFC](/blog/docs/email-protocols-rfc-compliance-imap-smtp-pop3-comparison) oraz dodał wsparcie dla [szyfrowania S/MIME (RFC 8551)](/faq#do-you-support-smime-encryption) i kompleksowego [filtrowania wiadomości Sieve (RFC 5228)](/faq#do-you-support-sieve-email-filtering) z obsługą protokołu [ManageSieve (RFC 5804)](/faq#do-you-support-sieve-email-filtering). REST API zostało również rozszerzone do 39 punktów końcowych.

**Luty 2026**: Oficjalny, otwartoźródłowy klient webmail został uruchomiony pod adresem [mail.forwardemail.net](https://mail.forwardemail.net) ([kod źródłowy na GitHub](https://github.com/forwardemail/mail.forwardemail.net)). Platforma dodała także wsparcie dla [rozszerzeń CalDAV Scheduling (RFC 6638)](https://www.rfc-editor.org/rfc/rfc6638), [DANE/TLSA (RFC 6698)](https://en.wikipedia.org/wiki/DNS-based_Authentication_of_Named_Entities) oraz [Domain Connect](https://domainconnect.org) umożliwiającego konfigurację DNS jednym kliknięciem. Uruchomiono powiadomienia push w czasie rzeczywistym dla IMAP, CalDAV i CardDAV z wykorzystaniem WebSockets.

**Marzec 2026**: Dodano wsparcie dla niestandardowej, per-domenowej pamięci masowej kompatybilnej z S3 oraz narzędzie wiersza poleceń do zarządzania nią. Rozpoczęto prace nad wieloplatformowymi aplikacjami desktopowymi i mobilnymi dla macOS, Windows, Linux, iOS i Android, korzystającymi z tego samego otwartoźródłowego kodu webmail, budowanymi za pomocą [Tauri](https://tauri.app).


## Podstawowe Zasady {#core-principles}

Od początku istnienia Forward Email konsekwentnie realizuje zasady prywatności i bezpieczeństwa:

**Filozofia 100% Open-Source**: W przeciwieństwie do konkurentów, którzy udostępniają jedynie frontend, pozostawiając backend zamknięty, Forward Email udostępnia cały swój kod — zarówno frontend, jak i backend — do publicznej weryfikacji na [GitHub](https://github.com/forwardemail).

**Projektowanie z myślą o prywatności**: Od pierwszego dnia Forward Email stosuje unikalne podejście przetwarzania w pamięci, które unika zapisywania wiadomości na dysku, co odróżnia go od konwencjonalnych usług e-mail przechowujących wiadomości w bazach danych lub systemach plików.

**Ciągła innowacja**: Usługa rozwinęła się z prostego rozwiązania do przekazywania e-maili do kompleksowej platformy e-mailowej z funkcjami takimi jak szyfrowane skrzynki pocztowe, szyfrowanie odporne na komputery kwantowe oraz wsparcie dla standardowych protokołów, w tym SMTP, IMAP, POP3 i CalDAV.

**Przejrzystość**: Udostępnianie całego kodu jako open-source, umożliwiając użytkownikom weryfikację deklaracji dotyczących prywatności, zamiast polegać wyłącznie na marketingowych zapewnieniach.

**Kontrola użytkownika**: Umożliwienie użytkownikom wyboru, w tym możliwość samodzielnego hostowania całej platformy, jeśli tego sobie życzą.


## Aktualny Stan {#current-status}

Na marzec 2026 Forward Email obsługuje ponad 500 000 domen na całym świecie, w tym znane organizacje i liderów branży, takich jak:

* **Firmy technologiczne**: Canonical (Ubuntu), Netflix Games, The Linux Foundation, The PHP Foundation, jQuery, LineageOS
* **Organizacje medialne**: Fox News Radio, Disney Ad Sales
* **Instytucje edukacyjne**: Uniwersytet Cambridge, Uniwersytet Maryland, Uniwersytet Waszyngtoński, Tufts University, Swarthmore College
* **Instytucje rządowe**: Rząd Australii Południowej, Rząd Dominikany
* **Inne organizacje**: RCD Hotels, Fly<span>.</span>io
* **Znani deweloperzy**: Isaac Z. Schlueter (twórca npm), David Heinemeier Hansson (twórca Ruby on Rails)

Platforma nadal się rozwija, regularnie wprowadzając nowe funkcje i ulepszenia infrastruktury, utrzymując pozycję jedynej w 100% otwartoźródłowej, szyfrowanej, skoncentrowanej na prywatności, przejrzystej i odpornej na komputery kwantowe usługi e-mail dostępnej obecnie na rynku.

<img loading="lazy" src="/img/articles/about-footer.webp" alt="Forward Email privacy-focused email service" class="rounded-lg" />
