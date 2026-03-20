# Polityka Prywatności {#privacy-policy}

<img loading="lazy" src="/img/articles/privacy.webp" alt="Polityka prywatności Forward Email" class="rounded-lg" />


## Spis Treści {#table-of-contents}

* [Zastrzeżenie](#disclaimer)
* [Informacje, których nie zbieramy](#information-not-collected)
* [Informacje zbierane](#information-collected)
  * [Informacje o koncie](#account-information)
  * [Przechowywanie e-maili](#email-storage)
  * [Logi błędów](#error-logs)
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
* [Udostępniane informacje](#information-shared)
* [Usuwanie informacji](#information-removal)
* [Dodatkowe ujawnienia](#additional-disclosures)


## Zastrzeżenie {#disclaimer}

Prosimy o zapoznanie się z naszymi [Warunkami](/terms), które mają zastosowanie na całej stronie.


## Informacje, których nie zbieramy {#information-not-collected}

**Z wyjątkiem [logów błędów](#error-logs), [wychodzących e-maili SMTP](#outbound-smtp-emails) oraz w przypadku wykrycia spamu lub złośliwej aktywności (np. w celu ograniczania szybkości):**

* Nie przechowujemy żadnych przekazywanych e-maili na dysku ani w bazach danych.
* Nie przechowujemy żadnych metadanych dotyczących przekazywanych e-maili na dysku ani w bazach danych.
* Nie przechowujemy żadnych logów ani adresów IP na dysku ani w bazach danych.
* Nie korzystamy z żadnych zewnętrznych usług analitycznych ani telemetrycznych.


## Informacje zbierane {#information-collected}

Dla przejrzystości, w każdej chwili możesz <a href="https://github.com/forwardemail" target="_blank" rel="noopener noreferrer">przejrzeć nasz kod źródłowy</a>, aby zobaczyć, jak poniższe informacje są zbierane i wykorzystywane.

**Wyłącznie w celu funkcjonalności i poprawy naszych usług, zbieramy i bezpiecznie przechowujemy następujące informacje:**

### Informacje o koncie {#account-information}

* Przechowujemy Twój adres e-mail, który nam podajesz.
* Przechowujemy nazwy Twoich domen, aliasy oraz konfiguracje, które nam podajesz.
* Wszelkie dodatkowe informacje, które dobrowolnie nam przekazujesz, takie jak komentarze lub pytania przesłane do nas e-mailem lub na naszej stronie <a href="/help">pomocy</a>.

**Atrybucja rejestracji** (przechowywana na stałe na Twoim koncie):

Gdy tworzysz konto, przechowujemy następujące informacje, aby zrozumieć, jak użytkownicy znajdują naszą usługę:

* Domenę strony odsyłającej (nie pełny URL)
* Pierwszą stronę, którą odwiedziłeś na naszej stronie
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

* Nieudane próby uwierzytelnienia są śledzone na adres IP w Redis.
* Dane te wygasają automatycznie (zazwyczaj w ciągu 24 godzin).
* Służy do zapobiegania atakom brute-force na konta użytkowników.


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

* Przechowujemy ciasteczko w sesji dla ruchu na Twojej stronie.
* Ciasteczka są HTTP-only, podpisane i korzystają z ochrony SameSite.
* Ciasteczka sesyjne wygasają po 30 dniach nieaktywności.
* Nie tworzymy sesji dla botów ani crawlerów.
* Używamy ciasteczek do:
  * Uwierzytelniania i stanu logowania
  * Funkcji "zapamiętaj mnie" w uwierzytelnianiu dwuskładnikowym
  * Wiadomości flash i powiadomień
## Analytics {#analytics}

Używamy własnego systemu analitycznego skoncentrowanego na prywatności, aby zrozumieć, jak korzystane są nasze usługi. System ten został zaprojektowany z prywatnością jako podstawową zasadą:

**Czego NIE zbieramy:**

* Nie przechowujemy adresów IP
* Nie używamy plików cookie ani trwałych identyfikatorów do analityki
* Nie korzystamy z żadnych zewnętrznych usług analitycznych
* Nie śledzimy użytkowników w ciągu dni ani sesji

**Co ZBIERAMY (anonimizowane):**

* Zagregowane odsłony stron i użycie usług (SMTP, IMAP, POP3, API itp.)
* Typ przeglądarki i systemu operacyjnego (parsowane z user agenta, surowe dane są usuwane)
* Typ urządzenia (desktop, mobile, tablet)
* Domenę odsyłającą (nie pełny URL)
* Typ klienta poczty dla protokołów mailowych (np. Thunderbird, Outlook)

**Przechowywanie danych:**

* Dane analityczne są automatycznie usuwane po 30 dniach
* Identyfikatory sesji rotują codziennie i nie mogą być używane do śledzenia użytkowników w ciągu dni


## Informacje Udostępniane {#information-shared}

Nie udostępniamy Twoich informacji żadnym podmiotom trzecim.

Możemy być zobowiązani do spełnienia sądowych żądań prawnych (ale pamiętaj, że [nie zbieramy informacji wymienionych powyżej w sekcji "Informacje Nie Zbierane"](#information-not-collected), więc nie będziemy w stanie ich dostarczyć).


## Usuwanie Informacji {#information-removal}

Jeśli w dowolnym momencie chcesz usunąć informacje, które nam przekazałeś, przejdź do <a href="/my-account/security">Moje Konto > Bezpieczeństwo</a> i kliknij "Usuń Konto".

Ze względu na zapobieganie nadużyciom, Twoje konto może wymagać ręcznej weryfikacji usunięcia przez naszych administratorów, jeśli usuniesz je w ciągu 5 dni od pierwszej płatności.

Proces ten zwykle trwa mniej niż 24 godziny i został wprowadzony, ponieważ użytkownicy spamowali naszą usługą, a następnie szybko usuwali konta – co uniemożliwiało nam zablokowanie ich odcisku metody płatności w Stripe.


## Dodatkowe Informacje {#additional-disclosures}

Ta strona jest chroniona przez Cloudflare, a jej [Polityka Prywatności](https://www.cloudflare.com/privacypolicy/) oraz [Regulamin](https://www.cloudflare.com/website-terms/) mają zastosowanie.
