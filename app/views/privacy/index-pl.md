# Polityka Prywatności {#privacy-policy}

<!-- <img loading="lazy" src="/img/articles/privacy.webp" alt="Polityka prywatności Forward Email" class="rounded-lg" /> -->


## Spis Treści {#table-of-contents}

* [Zastrzeżenie](#disclaimer)
* [Informacje, których nie zbieramy](#information-not-collected)
* [Informacje zbierane](#information-collected)
  * [Informacje o koncie](#account-information)
  * [Przechowywanie e-maili](#email-storage)
  * [Logi błędów](#error-logs)
  * [Logi serwera](#server-logs)
  * [Wychodzące e-maile SMTP](#outbound-smtp-emails)
* [Tymczasowe przetwarzanie danych](#temporary-data-processing)
  * [Ograniczanie szybkości](#rate-limiting)
  * [Śledzenie połączeń](#connection-tracking)
  * [Próby uwierzytelniania](#authentication-attempts)
* [Logi audytu](#audit-logs)
  * [Zmiany konta](#account-changes)
  * [Zmiany ustawień domeny](#domain-settings-changes)
* [Pliki cookie i sesje](#cookies-and-sessions)
* [Analizy](#analytics)
* [Aplikacje i webmail](#apps-and-webmail)
  * [Dane na Twoim urządzeniu](#data-on-your-device)
  * [Dane, które aplikacje do nas wysyłają](#data-the-apps-send-us)
  * [Powiadomienia push](#push-notifications)
  * [Obrazy i linki w e-mailach](#images-and-links-in-emails)
  * [Inne połączenia](#other-connections)
* [Udostępniane informacje](#information-shared)
* [Usuwanie informacji](#information-removal)
* [Dodatkowe ujawnienia](#additional-disclosures)


## Zastrzeżenie {#disclaimer}

Prosimy o zapoznanie się z naszymi [Warunkami](/terms), które mają zastosowanie na całej stronie.


## Informacje, których nie zbieramy {#information-not-collected}

**Z wyjątkiem informacji wyraźnie opisanych w niniejszej polityce (w tym [dzienników błędów](#error-logs), [dzienników serwera](#server-logs), [wychodzących wiadomości e-mail SMTP](#outbound-smtp-emails), [informacji o koncie](#account-information), [tymczasowego przetwarzania danych](#temporary-data-processing), [dzienników audytu](#audit-logs), [plików cookie i sesji](#cookies-and-sessions), [analityki](#analytics) oraz [aplikacji i webmaila](#apps-and-webmail)):**

* Nie przechowujemy żadnych przekazywanych wiadomości e-mail w pamięci dyskowej ani w bazach danych.
* Nie przechowujemy żadnych metadanych dotyczących przekazywanych wiadomości e-mail w pamięci dyskowej ani w bazach danych.
* Z wyjątkiem przypadków wyraźnie opisanych w niniejszej polityce, nie przechowujemy dzienników ani adresów IP w pamięci dyskowej ani w bazach danych.
* Nie korzystamy z żadnych usług analitycznych ani telemetrycznych stron trzecich.


## Informacje zbierane {#information-collected}

Dla przejrzystości, w każdej chwili możesz <a href="https://github.com/forwardemail" target="_blank" rel="noopener noreferrer">przejrzeć nasz kod źródłowy</a>, aby zobaczyć, jak poniższe informacje są zbierane i wykorzystywane.

**Wyłącznie w celu funkcjonalności i poprawy naszych usług, zbieramy i bezpiecznie przechowujemy następujące informacje:**

### Informacje o koncie {#account-information}

* Przechowujemy Twój adres e-mail, który nam udostępniasz.
* Przechowujemy Twoje nazwy domen, aliasy i konfiguracje, które nam udostępniasz.
* Przechowujemy ograniczone metadane dotyczące bezpieczeństwa konta, niezbędne do ochrony Twojego konta i zarządzania dostępem, w tym identyfikatory aktywnych sesji w witrynie, liczniki nieudanych prób logowania oraz znacznik czasu ostatniej próby logowania.
* Wszelkie dodatkowe informacje, które dobrowolnie nam przekazujesz, takie jak komentarze lub pytania przesłane do nas pocztą e-mail lub na naszej stronie <a href="/help">pomocy</a>.


**Atrybucja rejestracji** (przechowywana na stałe na Twoim koncie):

Gdy tworzysz konto, przechowujemy następujące informacje, aby zrozumieć, jak użytkownicy znajdują naszą usługę:

* Domenę strony odsyłającej (nie pełny URL)
* Pierwszą stronę, którą odwiedziłeś na naszej stronie, z wartościami w jej ścieżce, takimi jak nazwy domen, identyfikatory i tokeny, zamienionymi na symbole zastępcze
* Parametry kampanii UTM, jeśli są obecne w URL

### Przechowywanie e-maili {#email-storage}

* Przechowujemy e-maile i informacje kalendarzowe w Twojej [zaszyfrowanej bazie SQLite](/blog/docs/best-quantum-safe-encrypted-email-service) wyłącznie dla dostępu IMAP/POP3/CalDAV/CardDAV oraz funkcjonalności skrzynki pocztowej.
  * Zauważ, że jeśli korzystasz tylko z naszych usług przekazywania e-maili, to żadne e-maile nie są przechowywane na dysku ani w bazie danych, jak opisano w sekcji [Informacje, których nie zbieramy](#information-not-collected).
  * Nasze usługi przekazywania e-maili działają wyłącznie w pamięci (bez zapisu na dysku ani w bazach danych).
  * Przechowywanie IMAP/POP3/CalDAV/CardDAV jest szyfrowane w stanie spoczynku, szyfrowane podczas transmisji i przechowywane na dysku zaszyfrowanym LUKS.
  * Kopie zapasowe Twojego przechowywania IMAP/POP3/CalDAV/CardDAV są szyfrowane w stanie spoczynku, szyfrowane podczas transmisji i przechowywane na [Cloudflare R2](https://www.cloudflare.com/developer-platform/r2/).

### Logi błędów {#error-logs}

* Przechowujemy logi błędów SMTP z kodami odpowiedzi `4xx` i `5xx` [logi błędów](/faq#do-you-store-error-logs) przez 7 dni.
* Logi błędów zawierają błąd SMTP, kopertę i nagłówki e-maila (nie przechowujemy treści e-maila ani załączników).
* Logi błędów mogą zawierać adresy IP i nazwy hostów serwerów wysyłających w celach debugowania.
* Logi błędów dotyczące [ograniczania szybkości](/faq#do-you-have-rate-limiting) i [szarej listy](/faq#do-you-have-a-greylist) nie są dostępne, ponieważ połączenie kończy się wcześniej (np. przed przesłaniem poleceń `RCPT TO` i `MAIL FROM`).
* Przechowujemy również przez 7 dni logi błędów dotyczące nieudanych lub zbyt długo trwających żądań do witryny i API oraz błędów na naszych serwerach IMAP, POP3, CalDAV i CardDAV.
* Te logi mogą zawierać adres IP, URL żądania (w tym parametry zapytania, np. wyszukiwane frazy), nagłówki żądania, takie jak user agent, oraz konto lub alias, którego dotyczą.
* Hasła, tokeny API, pliki cookie i treści żądań są usuwane z tych logów przed zapisaniem.

### Logi serwera {#server-logs}

* Dla każdego żądania do witryny i API nasze serwery zapisują w logu wiersz, który może zawierać adres IP, metodę i URL żądania (w tym parametry zapytania), nagłówki żądania, status odpowiedzi oraz zalogowane konto.
* Używamy tych logów do wykrywania i naprawiania problemów oraz do powstrzymywania nadużyć i przechowujemy je maksymalnie przez 30 dni.

### Outbound SMTP Emails {#outbound-smtp-emails}

* Przechowujemy [wychodzące e-maile SMTP](/faq#do-you-support-sending-email-with-smtp) przez około 30 dni.
  * Ten okres zależy od nagłówka "Date"; ponieważ pozwalamy na wysyłanie e-maili z datą w przyszłości, jeśli istnieje nagłówek "Date" ustawiony na przyszłość.
  * **Zauważ, że po pomyślnym dostarczeniu e-maila lub wystąpieniu trwałego błędu, usuwamy i oczyszczamy treść wiadomości.**
  * Jeśli chcesz skonfigurować przechowywanie treści wychodzących wiadomości SMTP na dłużej niż domyślne 0 dni (po pomyślnym dostarczeniu lub trwałym błędzie), przejdź do Zaawansowanych ustawień dla swojej domeny i wpisz wartość między `0` a `30`.
  * Niektórzy użytkownicy lubią korzystać z funkcji podglądu [Moje konto > E-maile](/my-account/emails), aby zobaczyć, jak ich e-maile są renderowane, dlatego wspieramy konfigurowalny okres przechowywania.
  * Zauważ, że wspieramy również [OpenPGP/E2EE](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd).


## Temporary Data Processing {#temporary-data-processing}

Następujące dane są przetwarzane tymczasowo w pamięci lub Redis i **nie** są przechowywane na stałe:

### Rate Limiting {#rate-limiting}

* Adresy IP są tymczasowo używane w Redis do celów ograniczania szybkości.
* Dane o ograniczeniach wygasają automatycznie (zazwyczaj w ciągu 24 godzin).
* Zapobiega to nadużyciom i zapewnia uczciwe korzystanie z naszych usług.

### Connection Tracking {#connection-tracking}

* Liczba jednoczesnych połączeń jest śledzona na adres IP w Redis.
* Dane te wygasają automatycznie po zamknięciu połączeń lub po krótkim czasie.
* Służy do zapobiegania nadużyciom połączeń i zapewnienia dostępności usługi.

### Authentication Attempts {#authentication-attempts}

* Nieudane próby uwierzytelnienia są śledzone dla każdego adresu IP w Redis.
* Przechowujemy również ograniczone metadane uwierzytelniania na poziomie konta, w tym liczniki nieudanych prób logowania oraz znacznik czasu ostatniej próby logowania.
* Dane o próbach uwierzytelnienia oparte na Redis wygasają automatycznie (zazwyczaj w ciągu 24 godzin).
* Służy do zapobiegania atakom typu brute-force na konta użytkowników.


## Audit Logs {#audit-logs}

Aby pomóc Ci monitorować i zabezpieczać konto oraz domeny, prowadzimy dzienniki audytu dla niektórych zmian. Dzienniki te są używane do wysyłania powiadomień e-mail do właścicieli kont i administratorów domen.

### Account Changes {#account-changes}

* Śledzimy zmiany ważnych ustawień konta (np. uwierzytelnianie dwuskładnikowe, nazwa wyświetlana, strefa czasowa).
* Po wykryciu zmian wysyłamy powiadomienie e-mail na zarejestrowany adres e-mail.
* Wrażliwe pola (np. hasło, tokeny API, klucze odzyskiwania) są śledzone, ale ich wartości są ukrywane w powiadomieniach.
* Wpisy w dzienniku audytu są usuwane po wysłaniu powiadomienia e-mail.

### Domain Settings Changes {#domain-settings-changes}

Dla domen z wieloma administratorami zapewniamy szczegółowe logowanie audytu, aby pomóc zespołom śledzić zmiany konfiguracji:

**Co śledzimy:**

* Zmiany ustawień domeny (np. webhooki odbić, filtrowanie spamu, konfiguracja DKIM)
* Kto dokonał zmiany (adres e-mail użytkownika)
* Kiedy zmiana została dokonana (znacznik czasu)
* Adres IP, z którego dokonano zmiany
* Ciąg user-agenta przeglądarki/klienta

**Jak to działa:**

* Wszyscy administratorzy domeny otrzymują jedno skonsolidowane powiadomienie e-mail, gdy zmieniają się ustawienia.
* Powiadomienie zawiera tabelę pokazującą każdą zmianę wraz z użytkownikiem, który ją wykonał, jego adresem IP i znacznikiem czasu.
* Wrażliwe pola (np. klucze webhooków, tokeny API, prywatne klucze DKIM) są śledzone, ale ich wartości są ukrywane.
* Informacje o user-agencie są zawarte w zwijanym dziale "Szczegóły techniczne".
* Wpisy w dzienniku audytu są usuwane po wysłaniu powiadomienia e-mail.

**Dlaczego to zbieramy:**

* Aby pomóc administratorom domen utrzymać nadzór nad bezpieczeństwem
* Aby umożliwić zespołom audyt, kto dokonał zmian konfiguracyjnych
* Aby pomóc w rozwiązywaniu problemów, jeśli wystąpią nieoczekiwane zmiany
* Aby zapewnić odpowiedzialność za wspólne zarządzanie domeną


## Cookies and Sessions {#cookies-and-sessions}

* Przechowujemy podpisane pliki cookie tylko HTTP i dane sesji po stronie serwera dla Twojego ruchu w witrynie.
* Pliki cookie wykorzystują ochronę SameSite.
* Przechowujemy identyfikatory aktywnych sesji w witrynie na Twoim koncie w celu obsługi funkcji takich jak "wyloguj inne urządzenia" i unieważniania sesji w związku z bezpieczeństwem.
* Sesyjne pliki cookie wygasają po 30 dniach braku aktywności.
* Nie tworzymy sesji dla botów ani robotów indeksujących.
* Używamy plików cookie i sesji do:
  * Uwierzytelniania i stanu logowania
  * Funkcji "zapamiętaj mnie" przy uwierzytelnianiu dwuskładnikowym
  * Komunikatów flash i powiadomień
  * [Analityki](#analytics): pierwsza strona Twojej wizyty, domena odsyłająca, parametry kampanii (UTM) i liczba odsłon


## Analytics {#analytics}

Używamy własnego systemu analitycznego skoncentrowanego na prywatności, aby zrozumieć, jak korzystane są nasze usługi. System ten został zaprojektowany z prywatnością jako podstawową zasadą:

**Czego NIE zbieramy:**

* Nie przechowujemy adresów IP
* Nie ustawiamy osobnego pliku cookie do analityki
* Nie korzystamy z żadnych zewnętrznych usług analitycznych
* Nie śledzimy odwiedzających na przestrzeni wielu dni ani sesji, gdy nie są zalogowani

**Co ZBIERAMY:**

* Zagregowane odsłony stron i użycie usług (SMTP, IMAP, POP3, API itp.)
* Typ i wersję przeglądarki oraz systemu operacyjnego (parsowane z user agenta, surowe dane są usuwane)
* Typ urządzenia (desktop, mobile, tablet)
* Domenę odsyłającą (nie pełny URL) i parametry kampanii (UTM)
* Typ klienta poczty dla protokołów mailowych (np. Thunderbird, Outlook)
* Ścieżkę żądanej strony lub API, w której wartości takie jak nazwy domen, identyfikatory i tokeny są zamienione na symbole zastępcze, oraz informację, czy żądanie się powiodło
* W przypadku wizyt w witrynie pierwszą stronę wizyty i liczbę odsłon, przechowywane w Twojej sesji (zobacz [Pliki cookie i sesje](#cookies-and-sessions))
* Gdy jesteś zalogowany, identyfikator Twojego konta, aliasu lub domeny, abyśmy mogli zobaczyć, jak używane są poszczególne usługi, i rozwiązywać problemy

**Przechowywanie danych:**

* Zdarzenia analityczne są automatycznie usuwane po 30 dniach
* Sumy godzinowe, które nie są powiązane z żadnym kontem, są przechowywane przez 90 dni
* Identyfikatory sesji rotują codziennie i nie mogą być używane do śledzenia odwiedzających na przestrzeni wielu dni


## Aplikacje i webmail {#apps-and-webmail}

Ta sekcja dotyczy naszych aplikacji pocztowych na systemy iOS, Android, macOS, Windows i Linux oraz naszego webmaila pod adresem <a href="https://mail.forwardemail.net" target="_blank" rel="noopener noreferrer">mail.forwardemail.net</a>, które korzystają z tego samego kodu. Aplikacje nie zawierają kodu reklamowego ani śledzącego, ani analityki stron trzecich.

### Dane na Twoim urządzeniu {#data-on-your-device}

* Aplikacje przechowują Twoje e-maile, kontakty, kalendarze, ustawienia i dane logowania na Twoim urządzeniu, aby szybko się ładowały i działały offline.
* Jeśli włączysz App Lock, aplikacja szyfruje zapisaną treść e-maili, kontakty i dane logowania kluczem chronionym Twoim kodem PIN lub kluczem dostępu. Daty, foldery, etykiety i flagi pozostają niezaszyfrowane, aby aplikacja mogła sortować i liczyć Twoje e-maile.
* Wylogowanie się z konta usuwa jego dane z Twojego urządzenia.

### Dane, które aplikacje do nas wysyłają {#data-the-apps-send-us}

* Adres e-mail Twojego aliasu i hasło, wysyłane z każdym żądaniem, aby Cię zalogować.
* E-maile, kontakty, kalendarze, etykiety i filtry, które wysyłasz, tworzysz lub zmieniasz. E-maile, kontakty i kalendarze przechowujemy zgodnie z opisem w sekcji [Przechowywanie e-maili](#email-storage), a wysyłane przez Ciebie e-maile zgodnie z opisem w sekcji [Wychodzące e-maile SMTP](#outbound-smtp-emails).
* Twoje wyszukiwane frazy, abyśmy mogli przeszukać Twoją skrzynkę pocztową na naszych serwerach. Wyszukiwane frazy są częścią URL żądania, więc mogą pojawić się w [logach błędów](#error-logs) i [logach serwera](#server-logs).
* Opinie, które zdecydujesz się wysłać z aplikacji. Trafiają one e-mailem z Twojego aliasu do naszego zespołu wsparcia razem z danymi diagnostycznymi, które postanowisz dołączyć.
* E-maile zgłoszone przez Ciebie jako spam, które aplikacja przekazuje naszemu zespołowi ds. nadużyć (lub na inny adres podany w ustawieniach).

### Powiadomienia push {#push-notifications}

* Gdy zezwolisz na powiadomienia, aplikacja zarejestruje u nas token push. Przechowujemy go wraz z platformą, aliasem i kontem, których dotyczy, czasem jego ostatniego dostarczenia oraz nazwą urządzenia pobraną z user agenta aplikacji. Nazwa ta zawiera wersję Twojego systemu operacyjnego, a w systemie Android także model Twojego urządzenia.
* Token push przechowujemy maksymalnie przez jeden rok od jego ostatniego użycia. Usuwamy go wcześniej, gdy wylogujesz się z aplikacji, gdy dostarczenie nie powiedzie się trzy razy z rzędu, gdy zmieni się hasło aliasu, gdy usuniesz alias albo swoje konto lub gdy alias przejdzie na innego właściciela.
* W systemach iOS i macOS powiadomienia są przesyłane przez Apple Push Notification service. W naszej aplikacji na Android z Google Play są przesyłane przez Firebase Cloud Messaging. Powiadomienia o nowych e-mailach zawierają nazwę i adres nadawcy, temat, krótki podgląd i nazwę folderu, także w przypadku e-maili, które przychodzą bez alertu, na przykład e-maili umieszczanych w folderze Wiadomości-śmieci lub Wysłane. Gdy zmieniają się e-maile, kalendarze lub kontakty, wysyłamy również ciche powiadomienia z identyfikatorami, ale bez treści e-maili, aby aplikacja pozostawała aktualna.
* W przypadku [UnifiedPush](https://unifiedpush.org/) w systemie Android oraz powiadomień w przeglądarce internetowej każde powiadomienie jest szyfrowane tak, aby tylko Twoje urządzenie mogło je odczytać.
* Nasza aplikacja na Android z Google Play zawiera Firebase Cloud Messaging, który przesyła do Google identyfikator instalacji Firebase, wersję aplikacji oraz dane o urządzeniu i SDK. Nasza wolna od Google aplikacja na Android z serwisu GitHub nie zawiera Firebase.

### Obrazy i linki w e-mailach {#images-and-links-in-emails}

* Obrazy w e-mailach są ładowane z serwerów nadawcy, które mogą zobaczyć Twój adres IP i czas załadowania obrazów.
* Aplikacje domyślnie blokują piksele śledzące. Możesz też zablokować wszystkie obrazy zewnętrzne w sekcji Settings > Privacy & Security, a następnie ładować je osobno dla każdego e-maila.
* Linki w e-mailach otwierają się w Twojej przeglądarce internetowej.

### Inne połączenia {#other-connections}

* Nasz webmail pyta GitHub o swoją najnowszą wersję, gdy się ładuje, gdy do niego wracasz i co 10 minut, dopóki jest otwarty. About & Help pyta GitHub o najnowsze wydanie desktopowe, a aplikacje desktopowe sprawdzają w serwisie GitHub dostępność aktualizacji. Przy tych żądaniach GitHub otrzymuje Twój adres IP.


## Informacje Udostępniane {#information-shared}

Nie udostępniamy Twoich informacji żadnym podmiotom trzecim, z wyjątkiem dostawców usług obsługujących części naszej usługi, takich jak Cloudflare (ochrona witryny i zaszyfrowane kopie zapasowe), Stripe i PayPal (płatności), oraz usług dostarczających powiadomienia push na Twoje urządzenia (zobacz [Powiadomienia push](#push-notifications)).

Możemy być zobowiązani do spełnienia sądowych żądań prawnych (ale pamiętaj, że [nie zbieramy informacji wymienionych powyżej w sekcji "Informacje Nie Zbierane"](#information-not-collected), więc nie będziemy w stanie ich dostarczyć).


## Usuwanie Informacji {#information-removal}

Jeśli w dowolnym momencie chcesz usunąć informacje, które nam przekazałeś, przejdź do <a href="/my-account/security">Moje Konto > Bezpieczeństwo</a> i kliknij "Usuń Konto".

Ze względu na zapobieganie nadużyciom, Twoje konto może wymagać ręcznej weryfikacji usunięcia przez naszych administratorów, jeśli usuniesz je w ciągu 5 dni od pierwszej płatności.

Proces ten zwykle trwa mniej niż 24 godziny i został wprowadzony, ponieważ użytkownicy spamowali naszą usługą, a następnie szybko usuwali konta – co uniemożliwiało nam zablokowanie ich odcisku metody płatności w Stripe.

Usunięcie konta powoduje również usunięcie domen, którymi administrujesz, Twoich aliasów oraz zarejestrowanych dla nich tokenów push. Sam rekord konta pozostaje, przy czym adres e-mail, dane rozliczeniowe, hasło i klucze dostępu zostają z niego usunięte oraz uwierzytelnianie dwuskładnikowe i token API zostają unieważnione, a zapisy jego płatności przechowujemy na potrzeby zwrotów i księgowości. Logi i dane analityczne odnoszące się do Twojego konta są usuwane w terminach opisanych powyżej.

Aby usunąć dane aplikacji z urządzenia, wyloguj się z aplikacji lub ją odinstaluj.


## Dodatkowe Informacje {#additional-disclosures}

Ta strona jest chroniona przez Cloudflare, a jej [Polityka Prywatności](https://www.cloudflare.com/privacypolicy/) oraz [Regulamin](https://www.cloudflare.com/website-terms/) mają zastosowanie.
