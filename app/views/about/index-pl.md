# Informacje o przekazywaniu wiadomości e-mail {#about-forward-email}

<img loading="lazy" src="/img/articles/about.webp" alt="Forward Email team and company story" class="rounded-lg" />

# Informacje o przekazywaniu wiadomości e-mail {#about-forward-email-1}

## Spis treści {#table-of-contents}

* [Przegląd](#overview)
* [Założyciel i misja](#founder-and-mission)
* [Oś czasu](#timeline)
  * [2017 – Założenie i uruchomienie](#2017---founding-and-launch)
  * [2018 - Infrastruktura i integracja](#2018---infrastructure-and-integration)
  * [2019 – Rewolucja wydajności](#2019---performance-revolution)
  * [2020 – Prywatność i bezpieczeństwo w centrum uwagi](#2020---privacy-and-security-focus)
  * [2021 – Modernizacja platformy](#2021---platform-modernization)
  * [2023 – Rozszerzenie infrastruktury i funkcji](#2023---infrastructure-and-feature-expansion)
  * [2024 – Optymalizacja usług i zaawansowane funkcje](#2024---service-optimization-and-advanced-features)
  * [2025 - Ulepszenia prywatności i wsparcie protokołów](#2025---privacy-enhancements-and-protocol-support)
  * [2026 - Zgodność z RFC i zaawansowane filtrowanie](#2026---rfc-compliance-and-advanced-filtering)
* [Podstawowe zasady](#core-principles)
* [Aktualny status](#current-status)

## Przegląd {#overview}

> \[!TIP]
> Szczegóły techniczne dotyczące naszej architektury, wdrożeń zabezpieczeń i planu działania można znaleźć w dokumencie [Biała księga techniczna](https://forwardemail.net/technical-whitepaper.pdf).

Forward Email to usługa [darmowe i otwarte](https://en.wikipedia.org/wiki/Free_and_open-source "Free and open-source") [przekierowanie poczty elektronicznej](https://en.wikipedia.org/wiki/Email_forwarding "Email forwarding") skoncentrowana na [prawo do prywatności](https://en.wikipedia.org/wiki/Right_to_privacy "Right to privacy") użytkownika. To, co w 2017 roku zaczęło się jako proste rozwiązanie do przekierowywania wiadomości e-mail, przekształciło się w kompleksową platformę e-mail oferującą nieograniczoną liczbę niestandardowych nazw domen, nieograniczoną liczbę adresów e-mail i aliasów, nieograniczoną liczbę jednorazowych adresów e-mail, ochronę przed spamem i phishingiem, szyfrowane przechowywanie skrzynek pocztowych oraz liczne zaawansowane funkcje.

Usługa jest utrzymywana i zarządzana przez jej pierwotny zespół założycieli, projektantów i programistów. Została zbudowana w 100% w oparciu o oprogramowanie open source, wykorzystując [JavaScript](https://en.wikipedia.org/wiki/JavaScript "JavaScript"), [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js"), [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System"), [HTTPS](https://en.wikipedia.org/wiki/HTTPS "HTTPS"), [TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security "TLS") i [SMTP](https://en.wikipedia.org/wiki/SMTP "SMTP").

## Założyciel i misja {#founder-and-mission}

Firmę Forward Email założył **Nicholas Baugh** w 2017 roku. Według [Prześlij dalej e-mailem dokument techniczny](https://forwardemail.net/technical-whitepaper.pdf), Baugh początkowo szukał ekonomicznego i prostego rozwiązania umożliwiającego obsługę poczty e-mail na domenach w swoich projektach pobocznych. Po przeanalizowaniu dostępnych opcji, rozpoczął tworzenie własnego rozwiązania i 2 października 2017 roku kupił domenę `forwardemail.net`.

Misja Forward Email wykracza poza świadczenie usług poczty elektronicznej – jej celem jest transformacja podejścia branży do prywatności i bezpieczeństwa poczty elektronicznej. Do podstawowych wartości firmy należą transparentność, kontrola użytkowników i ochrona prywatności poprzez wdrażanie rozwiązań technicznych, a nie tylko obietnice polityczne.

## Oś czasu {#timeline}

### 2017 – Założenie i uruchomienie {#2017---founding-and-launch}

**2 października 2017 r.**: Nicholas Baugh kupił domenę `forwardemail.net` po przeanalizowaniu opłacalnych rozwiązań poczty e-mail dla swoich projektów pobocznych.

**5 listopada 2017 r.**: Baugh stworzył 634-liniowy plik JavaScript z wykorzystaniem [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js") do przekazywania wiadomości e-mail dla dowolnej niestandardowej nazwy domeny. Ta wstępna implementacja została opublikowana jako open-source dla [GitHub](https://github.com/forwardemail), a usługa została uruchomiona za pomocą GitHub Pages.

**Listopad 2017**: Usługa Forward Email została oficjalnie uruchomiona po premierze. Wczesna wersja była oparta wyłącznie na systemie DNS i nie wymagała rejestracji konta ani procesu logowania – wystarczył plik README napisany w Markdownie z instrukcjami. Użytkownicy mogli skonfigurować przekierowanie poczty e-mail, konfigurując rekordy MX tak, aby wskazywały na `mx1.forwardemail.net` i `mx2.forwardemail.net`, a następnie dodając rekord TXT z `forward-email=user@gmail.com`.

Prostota i skuteczność tego rozwiązania przykuła uwagę znanych programistów, w tym [Dawid Heinemeier Hansson](https://dhh.dk) (twórcy Ruby on Rails), który do dziś używa Forward Email w swojej domenie `dhh.dk`.

### 2018 - Infrastruktura i integracja {#2018---infrastructure-and-integration}

**Kwiecień 2018**: Kiedy [Cloudflare](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") uruchomił [usługa DNS dla konsumentów, która stawia na pierwszym miejscu prywatność](https://blog.cloudflare.com/announcing-1111/), Forward Email zrezygnował z używania [OpenDNS](https://en.wikipedia.org/wiki/OpenDNS "OpenDNS") na rzecz [Cloudflare](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") do obsługi wyszukiwań [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System"), co pokazuje zaangażowanie firmy w rozwiązania infrastrukturalne uwzględniające prywatność.

**Październik 2018**: Funkcja Forward Email umożliwia użytkownikom opcję „Wyślij wiadomość jako” za pomocą [Gmail](https://en.wikipedia.org/wiki/Gmail "Gmail") i [Perspektywy](https://en.wikipedia.org/wiki/Outlook "Outlook"), rozszerzając możliwości integracji z popularnymi dostawcami poczty e-mail.

### 2019 - Rewolucja wydajności {#2019---performance-revolution}

**Maj 2019**: Wydano Forward Email w wersji 2, co stanowiło gruntowną przeróbkę w stosunku do wersji pierwotnych. Ta aktualizacja koncentrowała się na ulepszeniach [wydajność](https://en.wikipedia.org/wiki/Software_performance_testing "Software performance testing") poprzez wykorzystanie [strumienie](https://en.wikipedia.org/wiki/Streams "Streams") z [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js"), tworząc fundament skalowalności platformy.

### 2020 - Skupienie na prywatności i bezpieczeństwie {#2020---privacy-and-security-focus}

**Luty 2020**: Forward Email wprowadził plan Enhanced Privacy Protection, umożliwiający użytkownikom wyłączenie ustawiania publicznych wpisów rekordów DNS w aliasach konfiguracji przekierowywania poczty e-mail. Dzięki temu planowi informacje o aliasach e-mail użytkownika są ukryte i nie można ich wyszukiwać publicznie w internecie. Firma wprowadziła również funkcję umożliwiającą włączanie lub wyłączanie określonych aliasów, przy jednoczesnym wyświetlaniu ich jako prawidłowych adresów e-mail i zwracaniu poprawnego [Kody statusu SMTP](https://en.wikipedia.org/wiki/List_of_SMTP_server_return_codes "List of SMTP server return codes"), a wiadomości e-mail są natychmiast odrzucane (podobnie jak w przypadku przekazywania danych do [/dev/null](https://en.wikipedia.org/wiki/Null_device "Null device")).

**Kwiecień 2020**: Po napotkaniu niezliczonych przeszkód w istniejących rozwiązaniach do wykrywania spamu, które nie respektowały polityki prywatności Forward Email, firma wydała pierwszą wersję alfa narzędzia Spam Scanner. To całkowicie darmowe i otwarte rozwiązanie [filtrowanie antyspamowe](https://en.wikipedia.org/wiki/Anti-spam_techniques "Anti-spam techniques") wykorzystuje podejście [Filtr spamu Naive Bayes](https://en.wikipedia.org/wiki/Naive_Bayes_spam_filtering "Naive Bayes spam filtering") w połączeniu z ochroną [anty-phishing](https://en.wikipedia.org/wiki/Phishing "Phishing") i [Atak homograficzny IDN](https://en.wikipedia.org/wiki/IDN_homograph_attack "IDN homograph attack"). Forward Email wydał również rozwiązanie [uwierzytelnianie dwuskładnikowe](https://en.wikipedia.org/wiki/Multi-factor_authentication "Multi-factor authentication") (2FA) wykorzystujące [hasła jednorazowe](https://en.wikipedia.org/wiki/One-time_password "One-time password") (OTP) w celu zwiększenia bezpieczeństwa konta.

**Maj 2020**: Forward Email umożliwił użytkownikom użycie niestandardowego [przekierowanie portów](https://en.wikipedia.org/wiki/Port_forwarding "Port forwarding") jako obejścia blokującego port przez [ISP](https://en.wikipedia.org/wiki/Internet_service_provider "Internet service provider"). Firma wydała również [Bezpłatne przekazywanie wiadomości e-mail za pomocą interfejsu API RESTful](email-api) z pełną dokumentacją i przykładami żądań i odpowiedzi w czasie rzeczywistym, a także obsługą webhooków.

**Sierpień 2020**: W usłudze Forward Email dodano obsługę systemu uwierzytelniania wiadomości e-mail [Uwierzytelniony otrzymany łańcuch](arc) („ARC”), co jeszcze bardziej zwiększyło bezpieczeństwo i skuteczność dostarczania wiadomości e-mail.

**23 listopada 2020 r.**: Platforma Forward Email została publicznie uruchomiona po zakończeniu programu beta, co stanowi ważny kamień milowy w rozwoju platformy.

### 2021 – Modernizacja platformy {#2021---platform-modernization}

**Luty 2021**: Firma Forward Email dokonała refaktoryzacji swojego kodu, usuwając wszystkie zależności [Pyton](https://en.wikipedia.org/wiki/Python_\(programming_language\) „Python (język programowania)”, dzięki czemu ich stos stał się w 100% oparty na [JavaScript](https://en.wikipedia.org/wiki/JavaScript "JavaScript") i [Node.js](https://en.wikipedia.org/wiki/Node.js). Ta decyzja architektoniczna była zgodna z zobowiązaniem firmy do utrzymania spójnego, otwartego stosu technologii.

**27 września 2021 r.**: Przekieruj wiadomość e-mail [dodano wsparcie](email-forwarding-regex-pattern-filter) na aliasy przekierowujące wiadomości e-mail, aby dopasować ją do [wyrażenia regularne](https://en.wikipedia.org/wiki/Regular_expression "Regular expression"), zapewniając użytkownikom bardziej zaawansowane możliwości kierowania wiadomościami e-mail.

### 2023 – Rozszerzenie infrastruktury i funkcji {#2023---infrastructure-and-feature-expansion}

**Styczeń 2023 r.**: Forward Email uruchomił nową, zoptymalizowaną pod kątem szybkości ładowania witrynę internetową, poprawiającą komfort użytkowania i wydajność.

**Luty 2023**: Firma dodała obsługę [dzienniki błędów](/faq#do-you-store-error-logs) i wdrożyła schemat kolorów witryny [tryb ciemny](https://en.wikipedia.org/wiki/Light-on-dark_color_scheme), odpowiadający preferencjom użytkowników i potrzebom w zakresie dostępności.

**Marzec 2023**: Firma Forward Email wydała [Mandarynka](https://github.com/forwardemail/tangerine#readme) i zintegrowała go z całą swoją infrastrukturą, umożliwiając korzystanie z [DNS przez HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) („DoH”) na poziomie aplikacji. Firma dodała również obsługę [MTA-STS](/faq#do-you-support-mta-sts) i przeszła z [hCaptcha](/) na [Bramka obrotowa Cloudflare](https://developers.cloudflare.com/turnstile).

**Kwiecień 2023**: Firma Forward Email wdrożyła i zautomatyzowała całkowicie nową infrastrukturę. Cała usługa zaczęła działać w oparciu o globalnie zrównoważony i oparty na bliskości system DNS z kontrolą stanu i przełączaniem awaryjnym za pomocą [Cloudflare](https://cloudflare.com), zastępując poprzednie podejście round-robin DNS. Firma przeszła na **serwery fizyczne** wielu dostawców, w tym [Vultr](https://www.vultr.com/?ref=429848) i [Cyfrowy Ocean](https://m.do.co/c/a7cecd27e071), oba zgodne z SOC 2 Type 1. Bazy danych MongoDB i Redis zostały przeniesione do konfiguracji klastrowych z węzłami podstawowymi i zapasowymi, co zapewnia wysoką dostępność, kompleksowe szyfrowanie SSL, szyfrowanie w stanie spoczynku i odzyskiwanie danych z punktu w czasie (PITR).

**Maj 2023**: Forward Email uruchomił funkcję **wychodzącego SMTP** dla żądań [wysyłanie wiadomości e-mail za pomocą SMTP](/faq#do-you-support-sending-email-with-smtp) i [wysyłanie wiadomości e-mail za pomocą API](/faq#do-you-support-sending-email-with-api). Funkcja ta obejmuje wbudowane zabezpieczenia zapewniające wysoką dostarczalność, nowoczesny i solidny system kolejkowania i ponawiania prób oraz [obsługuje dzienniki błędów w czasie rzeczywistym](/faq#do-you-store-error-logs).

**Listopad 2023**: Forward Email uruchomił funkcję [**zaszyfrowana skrzynka pocztowa**](/blog/docs/best-quantum-safe-encrypted-email-service) dla [Obsługa IMAP](/faq#do-you-support-receiving-email-with-imap), co stanowi znaczący postęp w zakresie prywatności i bezpieczeństwa wiadomości e-mail.

**Grudzień 2023**: Firma [dodano wsparcie](/faq#do-you-support-pop3) do monitorowania [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol), [klucze dostępu i WebAuthn](/faq#do-you-support-passkeys-and-webauthn), [czas na skrzynkę odbiorczą](/faq#i) i [OpenPGP dla pamięci masowej IMAP](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd).

### 2024 – Optymalizacja usług i zaawansowane funkcje {#2024---service-optimization-and-advanced-features}

**Luty 2024**: Przekaż dalej wiadomość e-mail [dodano obsługę kalendarza (CalDAV)](/faq#do-you-support-calendars-caldav), rozszerzając możliwości platformy poza pocztę e-mail o synchronizację kalendarza.

**Marzec–lipiec 2024 r.**: Firma Forward Email wprowadziła znaczące optymalizacje i udoskonalenia w swoich usługach IMAP, POP3 i CalDAV, których celem jest uczynienie ich usług równie szybkimi, jeśli nie szybszymi, niż alternatywne rozwiązania.

**Lipiec 2024**: Firma [dodano obsługę iOS Push](https://github.com/nodemailer/wildduck/issues/711#issuecomment-2254114016) rozwiązała problem braku obsługi polecenia IMAP `IDLE` w aplikacji Apple Mail na iOS, umożliwiając powiadomienia w czasie rzeczywistym dla urządzeń Apple iOS. Funkcja Forward Email dodała również monitorowanie czasu dotarcia do skrzynki odbiorczej („TTI”) dla własnej usługi oraz Yahoo/AOL, a także umożliwiła użytkownikom szyfrowanie całego rekordu DNS TXT, nawet w ramach darmowego planu. Zgodnie z prośbami zawartymi w [Dyskusje na temat przewodników dotyczących prywatności](https://discuss.privacyguides.net/t/forward-email-email-provider/13370) i [Problemy z GitHubem](https://github.com/forwardemail/forwardemail.net/issues/254), firma dodała możliwość cichego odrzucania `250`, miękkiego odrzucania `421` lub twardego odrzucania `550` przez aliasy po wyłączeniu.

**Sierpień 2024**: Forward Email dodał obsługę eksportu skrzynek pocztowych w formatach [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions) i [Mbox](https://en.wikipedia.org/wiki/Mbox) (oprócz istniejącego formatu eksportu [SQLite](https://en.wikipedia.org/wiki/SQLite)). W przypadku formatu [Dodano obsługę podpisu webhook](https://forwardemail.net/faq#do-you-support-bounce-webhooks) firma umożliwiła użytkownikom wysyłanie newsletterów, ogłoszeń i e-mail marketingowych za pośrednictwem usługi SMTP dla połączeń wychodzących. Wprowadzono również limity pamięci dla IMAP/POP3/CalDAV dla całej domeny i aliasów.

### 2025 - Ulepszenia prywatności i wsparcie protokołów {#2025---privacy-enhancements-and-protocol-support}

**Wrzesień 2024 r. – styczeń 2025 r.**: Przekaż dalej wiadomość e-mail [dodano bardzo oczekiwaną funkcję odpowiedzi na wiadomość o nieobecności i szyfrowanie OpenPGP/WKD do przekazywania wiadomości e-mail](https://discuss.privacyguides.net/t/forward-email-email-provider/13370/254), bazując na już wdrożonych możliwościach przechowywania szyfrowanych skrzynek pocztowych.

**21 stycznia 2025 r.**: Najlepszy przyjaciel założyciela, „Jack”, jego wierny psi towarzysz, odszedł spokojnie w wieku prawie 11 lat. Jackowi [zawsze będzie pamiętany](https://github.com/forwardemail/forwardemail.net/commit/994ce771f0338cbe77f10bd613989e0924883f9b) za jego niezachwiane wsparcie, które pomogło w powstaniu Forward Email. [Prześlij dalej e-mailem dokument techniczny](https://forwardemail.net/technical-whitepaper.pdf) jest dedykowane Jackowi, doceniając jego rolę w rozwoju usługi.

**Luty 2025**: Firma Forward Email przeszła na [Pakiet danych](https://www.datapacket.com), nowego głównego dostawcę centrów danych, wdrażając niestandardowy, skoncentrowany na wydajności sprzęt bare-metal w celu dalszego zwiększenia niezawodności i szybkości usług.

**Czerwiec 2025**: Forward Email wprowadził obsługę [Protokół CardDAV](/faq#do-you-support-contacts-carddav), rozszerzając możliwości platformy o synchronizację kontaktów obok istniejących usług poczty e-mail i kalendarza.

### 2026 - Zgodność z RFC i zaawansowane filtrowanie {#2026---rfc-compliance-and-advanced-filtering}

**Styczeń 2026**: Forward Email opublikował kompleksowy [dokument zgodności z protokołem RFC](/blog/docs/email-protocols-rfc-compliance-imap-smtp-pop3-comparison) szczegółowo opisujący pełne wsparcie standardów SMTP, IMAP, POP3 i CalDAV. Platforma dodała również [obsługę REQUIRETLS (RFC 8689)](/faq#requiretls-support) dla wymuszonego szyfrowania TLS w transporcie e-mail, [szyfrowanie S/MIME (RFC 8551)](/faq#do-you-support-smime-encryption) dla bezpiecznego podpisywania i szyfrowania wiadomości oraz kompleksowe [filtrowanie e-mail Sieve (RFC 5228)](/faq#do-you-support-sieve-email-filtering) z [protokołem ManageSieve (RFC 5804)](/faq#do-you-support-sieve-email-filtering) do filtrowania e-mail po stronie serwera. [REST API](/email-api) zostało rozszerzone do 39 punktów końcowych obejmujących wiadomości, foldery, kontakty, kalendarze i wydarzenia kalendarza.

## Zasady podstawowe {#core-principles}

Od początku swojego istnienia Forward Email niezmiennie przestrzega zasad prywatności i bezpieczeństwa:

**Filozofia w 100% Open Source**: W przeciwieństwie do konkurentów, którzy udostępniają kod źródłowy wyłącznie front-endów, a back-endy pozostają zamknięte, Forward Email udostępnił całą swoją bazę kodu — zarówno front-end, jak i back-end — do publicznego wglądu pod adresem [GitHub](https://github.com/forwardemail).

**Projekt stawiający prywatność na pierwszym miejscu**: Już od samego początku Forward Email korzystał z unikalnej metody przetwarzania w pamięci, która pozwala uniknąć zapisywania wiadomości e-mail na dysku, co odróżnia go od konwencjonalnych usług poczty e-mail, które przechowują wiadomości w bazach danych lub systemach plików.

**Ciągłe innowacje**: Usługa rozwinęła się z prostego rozwiązania do przekazywania wiadomości e-mail w kompleksową platformę poczty e-mail z funkcjami takimi jak szyfrowane skrzynki pocztowe, szyfrowanie odporne na ataki kwantowe i obsługa standardowych protokołów, w tym SMTP, IMAP, POP3 i CalDAV.

**Przejrzystość**: Udostępnianie całego kodu źródłowego i możliwość jego wglądu, co pozwala użytkownikom na weryfikację oświadczeń dotyczących prywatności, zamiast polegać wyłącznie na oświadczeniach marketingowych.

**Kontrola użytkownika**: Zapewnianie użytkownikom dodatkowych opcji, w tym możliwości samodzielnego hostowania całej platformy, jeśli zajdzie taka potrzeba.

## Aktualny status {#current-status}

Od 2025 roku Forward Email obsługuje ponad 500 000 domen na całym świecie, w tym znane organizacje i liderów branży, takich jak:

* **Firmy technologiczne**: Canonical (Ubuntu), Netflix Games, The Linux Foundation, The PHP Foundation, jQuery, LineageOS
* **Organizacje medialne**: Fox News Radio, Disney Ad Sales
* **Instytucje edukacyjne**: Uniwersytet Cambridge, Uniwersytet Maryland, Uniwersytet Waszyngtoński, Uniwersytet Tufts, Swarthmore College
* **Podmioty rządowe**: Rząd Australii Południowej, Rząd Republiki Dominikańskiej
* **Inne organizacje**: RCD Hotels, Fly<span>.</span>io
* **Znani programiści**: Isaac Z. Schlueter (twórca npm), David Heinemeier Hansson (twórca Ruby on Rails)

Platforma jest stale rozwijana dzięki regularnym aktualizacjom funkcji i udoskonaleniom infrastruktury, utrzymując swoją pozycję jedynej w 100% otwartej, szyfrowanej, nastawionej na prywatność, przejrzystej i odpornej na ataki kwantowe usługi poczty e-mail dostępnej obecnie na rynku.

<img loading="lazy" src="/img/articles/about-footer.webp" alt="Forward Email privacy-focused email service" class="rounded-lg" />