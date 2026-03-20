# Najczęściej Zadawane Pytania {#frequently-asked-questions}

<img loading="lazy" src="/img/articles/faq.webp" alt="Forward Email najczęściej zadawane pytania" class="rounded-lg" />


## Spis treści {#table-of-contents}

* [Szybki start](#quick-start)
* [Wprowadzenie](#introduction)
  * [Czym jest Forward Email](#what-is-forward-email)
  * [Kto korzysta z Forward Email](#who-uses-forward-email)
  * [Jaka jest historia Forward Email](#what-is-forward-emails-history)
  * [Jak szybka jest ta usługa](#how-fast-is-this-service)
* [Klienci poczty](#email-clients)
  * [Thunderbird](#thunderbird)
  * [Microsoft Outlook](#microsoft-outlook)
  * [Apple Mail](#apple-mail)
  * [eM Client](#em-client)
  * [Urządzenia mobilne](#mobile-devices)
  * [Konfiguracja Sendmail SMTP Relay](#sendmail-smtp-relay-configuration)
  * [Konfiguracja Exim4 SMTP Relay](#exim4-smtp-relay-configuration)
  * [Konfiguracja klienta msmtp SMTP](#msmtp-smtp-client-configuration)
  * [Klienci poczty wiersza poleceń](#command-line-email-clients)
  * [Konfiguracja poczty w Windows](#windows-email-configuration)
  * [Konfiguracja Postfix SMTP Relay](#postfix-smtp-relay-configuration)
  * [Jak wysyłać mail jako za pomocą Gmail](#how-to-send-mail-as-using-gmail)
  * [Jaki jest darmowy przewodnik legacy dla Send Mail As za pomocą Gmail](#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail)
  * [Zaawansowana konfiguracja routingu Gmail](#advanced-gmail-routing-configuration)
  * [Zaawansowana konfiguracja routingu Outlook](#advanced-outlook-routing-configuration)
* [Rozwiązywanie problemów](#troubleshooting)
  * [Dlaczego nie otrzymuję moich testowych maili](#why-am-i-not-receiving-my-test-emails)
  * [Jak skonfigurować klienta poczty do pracy z Forward Email](#how-do-i-configure-my-email-client-to-work-with-forward-email)
  * [Dlaczego moje maile trafiają do Spam i Kosz i jak sprawdzić reputację domeny](#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation)
  * [Co zrobić, jeśli otrzymuję spam](#what-should-i-do-if-i-receive-spam-emails)
  * [Dlaczego moje testowe maile wysłane do mnie w Gmail pokazują się jako "podejrzane"](#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious)
  * [Czy mogę usunąć via forwardemail dot net w Gmail](#can-i-remove-the-via-forwardemail-dot-net-in-gmail)
* [Zarządzanie danymi](#data-management)
  * [Gdzie znajdują się wasze serwery](#where-are-your-servers-located)
  * [Jak eksportować i tworzyć kopie zapasowe mojej skrzynki pocztowej](#how-do-i-export-and-backup-my-mailbox)
  * [Jak importować i migrować moją istniejącą skrzynkę pocztową](#how-do-i-import-and-migrate-my-existing-mailbox)
  * [Jak używać własnej pamięci zgodnej z S3 do kopii zapasowych](#how-do-i-use-my-own-s3-compatible-storage-for-backups)
  * [Jak konwertować kopie zapasowe SQLite na pliki EML](#how-do-i-convert-sqlite-backups-to-eml-files)
  * [Czy wspieracie self-hosting](#do-you-support-self-hosting)
* [Konfiguracja poczty](#email-configuration)
  * [Jak zacząć i ustawić przekazywanie maili](#how-do-i-get-started-and-set-up-email-forwarding)
  * [Czy mogę używać wielu wymian MX i serwerów do zaawansowanego przekazywania](#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding)
  * [Jak ustawić autoresponder urlopowy (out of office auto-responder)](#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder)
  * [Jak ustawić SPF dla Forward Email](#how-do-i-set-up-spf-for-forward-email)
  * [Jak ustawić DKIM dla Forward Email](#how-do-i-set-up-dkim-for-forward-email)
  * [Jak ustawić DMARC dla Forward Email](#how-do-i-set-up-dmarc-for-forward-email)
  * [Jak przeglądać raporty DMARC](#how-do-i-view-dmarc-reports)
  * [Jak połączyć i skonfigurować kontakty](#how-do-i-connect-and-configure-my-contacts)
  * [Jak połączyć i skonfigurować kalendarze](#how-do-i-connect-and-configure-my-calendars)
  * [Jak dodać więcej kalendarzy i zarządzać istniejącymi](#how-do-i-add-more-calendars-and-manage-existing-calendars)
  * [Jak połączyć i skonfigurować zadania i przypomnienia](#how-do-i-connect-and-configure-tasks-and-reminders)
  * [Dlaczego nie mogę tworzyć zadań w macOS Reminders](#why-cant-i-create-tasks-in-macos-reminders)
  * [Jak ustawić Tasks.org na Androidzie](#how-do-i-set-up-tasksorg-on-android)
  * [Jak ustawić SRS dla Forward Email](#how-do-i-set-up-srs-for-forward-email)
  * [Jak ustawić MTA-STS dla Forward Email](#how-do-i-set-up-mta-sts-for-forward-email)
  * [Jak dodać zdjęcie profilowe do mojego adresu email](#how-do-i-add-a-profile-picture-to-my-email-address)
* [Zaawansowane funkcje](#advanced-features)
  * [Czy wspieracie newslettery lub listy mailingowe do celów marketingowych](#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email)
  * [Czy wspieracie wysyłanie maili przez API](#do-you-support-sending-email-with-api)
  * [Czy wspieracie odbieranie maili przez IMAP](#do-you-support-receiving-email-with-imap)
  * [Czy wspieracie POP3](#do-you-support-pop3)
  * [Czy wspieracie kalendarze (CalDAV)](#do-you-support-calendars-caldav)
  * [Czy wspieracie zadania i przypomnienia (CalDAV VTODO)](#do-you-support-tasks-and-reminders-caldav-vtodo)
  * [Czy wspieracie kontakty (CardDAV)](#do-you-support-contacts-carddav)
  * [Czy wspieracie wysyłanie maili przez SMTP](#do-you-support-sending-email-with-smtp)
  * [Czy wspieracie OpenPGP/MIME, szyfrowanie end-to-end ("E2EE") i Web Key Directory ("WKD")](#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd)
  * [Czy wspieracie szyfrowanie S/MIME](#do-you-support-smime-encryption)
  * [Czy wspieracie filtrowanie maili Sieve](#do-you-support-sieve-email-filtering)
  * [Czy wspieracie MTA-STS](#do-you-support-mta-sts)
  * [Czy wspieracie passkeys i WebAuthn](#do-you-support-passkeys-and-webauthn)
  * [Czy wspieracie najlepsze praktyki email](#do-you-support-email-best-practices)
  * [Czy wspieracie webhooki bounce](#do-you-support-bounce-webhooks)
  * [Czy wspieracie webhooki](#do-you-support-webhooks)
  * [Czy wspieracie wyrażenia regularne lub regex](#do-you-support-regular-expressions-or-regex)
  * [Jakie są wasze limity SMTP wychodzącego](#what-are-your-outbound-smtp-limits)
  * [Czy potrzebuję zgody, aby włączyć SMTP](#do-i-need-approval-to-enable-smtp)
  * [Jakie są ustawienia konfiguracji serwera SMTP](#what-are-your-smtp-server-configuration-settings)
  * [Jakie są ustawienia konfiguracji serwera IMAP](#what-are-your-imap-server-configuration-settings)
  * [Jakie są ustawienia konfiguracji serwera POP3](#what-are-your-pop3-server-configuration-settings)
  * [Jak ustawić autodiscovery poczty dla mojej domeny](#how-do-i-set-up-email-autodiscovery-for-my-domain)
* [Bezpieczeństwo](#security-1)
  * [Zaawansowane techniki wzmacniania serwera](#advanced-server-hardening-techniques)
  * [Czy posiadacie certyfikaty SOC 2 lub ISO 27001](#do-you-have-soc-2-or-iso-27001-certifications)
  * [Czy używacie szyfrowania TLS do przekazywania maili](#do-you-use-tls-encryption-for-email-forwarding)
  * [Czy zachowujecie nagłówki uwierzytelniania maili](#do-you-preserve-email-authentication-headers)
  * [Czy zachowujecie oryginalne nagłówki maili i zapobiegacie spoofingowi](#do-you-preserve-original-email-headers-and-prevent-spoofing)
  * [Jak chronicie przed spamem i nadużyciami](#how-do-you-protect-against-spam-and-abuse)
  * [Czy przechowujecie zawartość maili na dysku](#do-you-store-email-content-on-disk)
  * [Czy zawartość maili może zostać ujawniona podczas awarii systemu](#can-email-content-be-exposed-during-system-crashes)
  * [Kto ma dostęp do waszej infrastruktury mailowej](#who-has-access-to-your-email-infrastructure)
  * [Jakich dostawców infrastruktury używacie](#what-infrastructure-providers-do-you-use)
  * [Czy oferujecie umowę o przetwarzaniu danych (DPA)](#do-you-offer-a-data-processing-agreement-dpa)
  * [Jak radzicie sobie z powiadomieniami o naruszeniach danych](#how-do-you-handle-data-breach-notifications)
  * [Czy oferujecie środowisko testowe](#do-you-offer-a-test-environment)
  * [Czy zapewniacie narzędzia monitoringu i alertów](#do-you-provide-monitoring-and-alerting-tools)
  * [Jak zapewniacie wysoką dostępność](#how-do-you-ensure-high-availability)
  * [Czy jesteście zgodni z Sekcją 889 ustawy NDAA (National Defense Authorization Act)](#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa)
* [Szczegóły systemowe i techniczne](#system-and-technical-details)
  * [Czy przechowujecie maile i ich zawartość](#do-you-store-emails-and-their-contents)
  * [Jak działa wasz system przekazywania maili](#how-does-your-email-forwarding-system-work)
  * [Jak przetwarzacie mail do przekazania](#how-do-you-process-an-email-for-forwarding)
  * [Jak radzicie sobie z problemami dostarczania maili](#how-do-you-handle-email-delivery-issues)
  * [Jak radzicie sobie z blokowaniem waszych adresów IP](#how-do-you-handle-your-ip-addresses-becoming-blocked)
  * [Czym są adresy postmaster](#what-are-postmaster-addresses)
  * [Czym są adresy no-reply](#what-are-no-reply-addresses)
  * [Jakie są adresy IP waszych serwerów](#what-are-your-servers-ip-addresses)
  * [Czy macie listę dozwolonych](#do-you-have-an-allowlist)
  * [Jakie rozszerzenia nazw domen są domyślnie dozwolone](#what-domain-name-extensions-are-allowlisted-by-default)
  * [Jakie są kryteria waszej listy dozwolonych](#what-is-your-allowlist-criteria)
  * [Jakie rozszerzenia nazw domen można używać za darmo](#what-domain-name-extensions-can-be-used-for-free)
  * [Czy macie listę szarą](#do-you-have-a-greylist)
  * [Czy macie listę odmów](#do-you-have-a-denylist)
  * [Czy macie ograniczenia szybkości](#do-you-have-rate-limiting)
  * [Jak chronicie przed backscatter](#how-do-you-protect-against-backscatter)
  * [Zapobieganie odbiciom od znanych spamerów MAIL FROM](#prevent-bounces-from-known-mail-from-spammers)
  * [Zapobieganie niepotrzebnym odbiciom w celu ochrony przed backscatter](#prevent-unnecessary-bounces-to-protect-against-backscatter)
  * [Jak określacie odcisk palca maila](#how-do-you-determine-an-email-fingerprint)
  * [Czy mogę przekazywać maile na porty inne niż 25 (np. jeśli mój ISP zablokował port 25)](#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25)
  * [Czy obsługuje symbol plus + dla aliasów Gmail](#does-it-support-the-plus--symbol-for-gmail-aliases)
  * [Czy obsługuje subdomeny](#does-it-support-sub-domains)
  * [Czy to przekazuje nagłówki moich maili](#does-this-forward-my-emails-headers)
  * [Czy to jest dobrze przetestowane](#is-this-well-tested)
  * [Czy przekazujecie wiadomości i kody odpowiedzi SMTP](#do-you-pass-along-smtp-response-messages-and-codes)
  * [Jak zapobiegacie spammerom i zapewniacie dobrą reputację przekazywania maili](#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation)
  * [Jak wykonujecie zapytania DNS na nazwach domen](#how-do-you-perform-dns-lookups-on-domain-names)
* [Konto i rozliczenia](#account-and-billing)
  * [Czy oferujecie gwarancję zwrotu pieniędzy na płatnych planach](#do-you-offer-a-money-back-guarantee-on-paid-plans)
  * [Jeśli zmienię plan, czy proporcjonalnie zwracacie różnicę](#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference)
  * [Czy mogę używać tej usługi przekazywania maili jako serwera MX "fallback" lub "fallover"](#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server)
  * [Czy mogę wyłączyć konkretne aliasy](#can-i-disable-specific-aliases)
  * [Czy mogę przekazywać maile do wielu odbiorców](#can-i-forward-emails-to-multiple-recipients)
  * [Czy mogę mieć wielu globalnych odbiorców catch-all](#can-i-have-multiple-global-catch-all-recipients)
  * [Czy istnieje maksymalny limit liczby adresów email, na które mogę przekazywać per alias](#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias)
  * [Czy mogę rekurencyjnie przekazywać maile](#can-i-recursively-forward-emails)
  * [Czy ludzie mogą rejestrować lub wyrejestrowywać moje przekazywanie maili bez mojej zgody](#can-people-unregister-or-register-my-email-forwarding-without-my-permission)
  * [Jak to jest darmowe](#how-is-it-free)
  * [Jaki jest maksymalny rozmiar maila](#what-is-the-max-email-size-limit)
  * [Czy przechowujecie logi maili](#do-you-store-logs-of-emails)
  * [Czy przechowujecie logi błędów](#do-you-store-error-logs)
  * [Czy czytacie moje maile](#do-you-read-my-emails)
  * [Czy mogę "wysyłać mail jako" w Gmail z tym](#can-i-send-mail-as-in-gmail-with-this)
  * [Czy mogę "wysyłać mail jako" w Outlook z tym](#can-i-send-mail-as-in-outlook-with-this)
  * [Czy mogę "wysyłać mail jako" w Apple Mail i iCloud Mail z tym](#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this)
  * [Czy mogę przekazywać nieograniczoną liczbę maili z tym](#can-i-forward-unlimited-emails-with-this)
  * [Czy oferujecie nieograniczoną liczbę domen za jedną cenę](#do-you-offer-unlimited-domains-for-one-price)
  * [Jakie metody płatności akceptujecie](#which-payment-methods-do-you-accept)
* [Dodatkowe zasoby](#additional-resources)
## Szybki start {#quick-start}

Aby rozpocząć korzystanie z Forward Email:

1. **Utwórz konto** na [forwardemail.net/register](https://forwardemail.net/register)

2. **Dodaj i zweryfikuj swoją domenę** w [Moje konto → Domeny](/my-account/domains)

3. **Dodaj i skonfiguruj aliasy/skrzynki e-mail** w [Moje konto → Domeny](/my-account/domains) → Aliasy

4. **Przetestuj konfigurację** wysyłając e-mail na jeden z nowych aliasów

> \[!TIP]
> Zmiany DNS mogą propagować się globalnie do 24-48 godzin, choć często zaczynają działać znacznie szybciej.

> \[!IMPORTANT]
> Dla lepszej dostarczalności zalecamy skonfigurowanie rekordów [SPF](#how-do-i-set-up-spf-for-forward-email), [DKIM](#how-do-i-set-up-dkim-for-forward-email) oraz [DMARC](#how-do-i-set-up-dmarc-for-forward-email).


## Wprowadzenie {#introduction}

### Czym jest Forward Email {#what-is-forward-email}

> \[!NOTE]
> Forward Email jest idealny dla osób prywatnych, małych firm i programistów, którzy chcą profesjonalnych adresów e-mail bez kosztów i utrzymania pełnego hostingu poczty.

Forward Email to **pełnoprawny dostawca usług e-mail** oraz **dostawca hostingu e-mail dla niestandardowych nazw domen**.

To jedyna darmowa i otwartoźródłowa usługa, która pozwala korzystać z adresów e-mail na własnej domenie bez skomplikowanej konfiguracji i utrzymania własnego serwera pocztowego.

Nasza usługa przekierowuje e-maile wysłane na Twoją niestandardową domenę do Twojego istniejącego konta e-mail – a nawet możesz używać nas jako dedykowanego dostawcy hostingu e-mail.

Kluczowe cechy Forward Email:

* **E-mail na własnej domenie**: Korzystaj z profesjonalnych adresów e-mail z własną nazwą domeny
* **Darmowy plan**: Podstawowe przekierowywanie e-maili bez opłat
* **Zwiększona prywatność**: Nie czytamy Twoich e-maili ani nie sprzedajemy Twoich danych
* **Open Source**: Cały nasz kod jest dostępny na GitHub
* **Wsparcie SMTP, IMAP i POP3**: Pełne możliwości wysyłania i odbierania e-maili
* **Szyfrowanie end-to-end**: Obsługa OpenPGP/MIME
* **Własne aliasy catch-all**: Twórz nieograniczoną liczbę aliasów e-mail

Możesz porównać nas z ponad 56 innymi dostawcami usług e-mail na [naszej stronie porównawczej usług e-mail](/blog/best-email-service).

> \[!TIP]
> Dowiedz się więcej o Forward Email, czytając nasz darmowy [Technical Whitepaper](/technical-whitepaper.pdf)

### Kto korzysta z Forward Email {#who-uses-forward-email}

Świadczymy hosting i przekierowywanie e-maili dla ponad 500 000 domen oraz następujących znanych użytkowników:

| Klient                                  | Studium przypadku                                                                                         |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| U.S. Naval Academy                      | [:page_facing_up: Studium przypadku](/blog/docs/federal-government-email-service-section-889-compliant)   |
| Canonical                               | [:page_facing_up: Studium przypadku](/blog/docs/canonical-ubuntu-email-enterprise-case-study)             |
| Netflix Games                           |                                                                                                          |
| The Linux Foundation                    | [:page_facing_up: Studium przypadku](/blog/docs/linux-foundation-email-enterprise-case-study)             |
| The PHP Foundation                      |                                                                                                          |
| Fox News Radio                          |                                                                                                          |
| Disney Ad Sales                         |                                                                                                          |
| jQuery                                  | [:page_facing_up: Studium przypadku](/blog/docs/linux-foundation-email-enterprise-case-study)             |
| LineageOS                               |                                                                                                          |
| Ubuntu                                  | [:page_facing_up: Studium przypadku](/blog/docs/canonical-ubuntu-email-enterprise-case-study)             |
| Kubuntu                                 | [:page_facing_up: Studium przypadku](/blog/docs/canonical-ubuntu-email-enterprise-case-study)             |
| Lubuntu                                 | [:page_facing_up: Studium przypadku](/blog/docs/canonical-ubuntu-email-enterprise-case-study)             |
| The University of Cambridge             | [:page_facing_up: Studium przypadku](/blog/docs/alumni-email-forwarding-university-case-study)            |
| The University of Maryland              | [:page_facing_up: Studium przypadku](/blog/docs/alumni-email-forwarding-university-case-study)            |
| The University of Washington            | [:page_facing_up: Studium przypadku](/blog/docs/alumni-email-forwarding-university-case-study)            |
| Tufts University                        | [:page_facing_up: Studium przypadku](/blog/docs/alumni-email-forwarding-university-case-study)            |
| Swarthmore College                      | [:page_facing_up: Studium przypadku](/blog/docs/alumni-email-forwarding-university-case-study)            |
| Government of South Australia           |                                                                                                          |
| Government of Dominican Republic        |                                                                                                          |
| Fly<span>.</span>io                     |                                                                                                          |
| RCD Hotels                              |                                                                                                          |
| Isaac Z. Schlueter (npm)                | [:page_facing_up: Studium przypadku](/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem) |
| David Heinemeier Hansson (Ruby on Rails) |                                                                                                          |
### Jaka jest historia Forward Email {#what-is-forward-emails-history}

Więcej o Forward Email możesz dowiedzieć się na [naszej stronie O nas](/about).

### Jak szybka jest ta usługa {#how-fast-is-this-service}

> \[!NOTE]
> Nasz system jest zaprojektowany pod kątem szybkości i niezawodności, z wieloma redundantnymi serwerami, aby zapewnić szybkie dostarczanie Twoich wiadomości.

Forward Email dostarcza wiadomości z minimalnym opóźnieniem, zazwyczaj w ciągu kilku sekund od otrzymania.

Metryki wydajności:

* **Średni czas dostarczenia**: Mniej niż 5-10 sekund od otrzymania do przekazania ([zobacz naszą stronę monitoringu Time to Inbox "TTI"](/tti))
* **Dostępność**: Ponad 99,9% czasu działania usługi
* **Globalna infrastruktura**: Serwery strategicznie rozmieszczone dla optymalnego routingu
* **Automatyczne skalowanie**: Nasz system skaluję się w okresach wzmożonego ruchu e-mailowego

Działamy w czasie rzeczywistym, w przeciwieństwie do innych dostawców, którzy polegają na opóźnionych kolejkach.

Nie zapisujemy na dysku ani nie przechowujemy logów – z [wyjątkiem błędów](#do-you-store-error-logs) oraz [wychodzącego SMTP](#do-you-support-sending-email-with-smtp) (zobacz naszą [Politykę prywatności](/privacy)).

Wszystko odbywa się w pamięci operacyjnej, a [nasz kod źródłowy jest na GitHub](https://github.com/forwardemail).


## Klienci poczty {#email-clients}

### Thunderbird {#thunderbird}

1. Utwórz nowy alias i wygeneruj hasło w panelu Forward Email
2. Otwórz Thunderbird i przejdź do **Edycja → Ustawienia kont → Akcje konta → Dodaj konto pocztowe**
3. Wprowadź swoje imię, adres Forward Email oraz hasło
4. Kliknij **Konfiguruj ręcznie** i wpisz:
   * Przychodzące: IMAP, `imap.forwardemail.net`, port 993, SSL/TLS
   * Wychodzące: SMTP, `smtp.forwardemail.net`, port 465, SSL/TLS (zalecane; port 587 z STARTTLS jest również obsługiwany)
5. Kliknij **Gotowe**

### Microsoft Outlook {#microsoft-outlook}

1. Utwórz nowy alias i wygeneruj hasło w panelu Forward Email
2. Przejdź do **Plik → Dodaj konto**
3. Wprowadź swój adres Forward Email i kliknij **Połącz**
4. Wybierz **Opcje zaawansowane** i zaznacz **Pozwól mi skonfigurować konto ręcznie**
5. Wybierz **IMAP** i wpisz:
   * Przychodzące: `imap.forwardemail.net`, port 993, SSL
   * Wychodzące: `smtp.forwardemail.net`, port 465, SSL/TLS (zalecane; port 587 z STARTTLS jest również obsługiwany)
   * Nazwa użytkownika: Twój pełny adres e-mail
   * Hasło: Twoje wygenerowane hasło
6. Kliknij **Połącz**

### Apple Mail {#apple-mail}

1. Utwórz nowy alias i wygeneruj hasło w panelu Forward Email
2. Przejdź do **Poczta → Preferencje → Konta → +**
3. Wybierz **Inne konto pocztowe**
4. Wprowadź swoje imię, adres Forward Email oraz hasło
5. W ustawieniach serwera wpisz:
   * Przychodzące: `imap.forwardemail.net`
   * Wychodzące: `smtp.forwardemail.net`
   * Nazwa użytkownika: Twój pełny adres e-mail
   * Hasło: Twoje wygenerowane hasło
6. Kliknij **Zaloguj się**

### eM Client {#em-client}

1. Utwórz nowy alias i wygeneruj hasło w panelu Forward Email
2. Otwórz eM Client i przejdź do **Menu → Konta → + Dodaj konto**
3. Kliknij na **Poczta**, a następnie wybierz **Inne**
4. Wprowadź swój adres Forward Email i kliknij **Dalej**
5. Wprowadź następujące ustawienia serwera:
   * **Serwer przychodzący**: `imap.forwardemail.net`
   * **Serwer wychodzący**: `smtp.forwardemail.net`
6. Wprowadź swój pełny adres e-mail jako **Nazwa użytkownika** oraz wygenerowane hasło jako **Hasło** dla obu serwerów.
7. eM Client przetestuje połączenie. Po pomyślnym teście kliknij **Dalej**.
8. Wprowadź swoje imię i wybierz nazwę konta.
9. Kliknij **Zakończ**.

### Urządzenia mobilne {#mobile-devices}

Dla iOS:

1. Przejdź do **Ustawienia → Poczta → Konta → Dodaj konto → Inne**
2. Stuknij **Dodaj konto pocztowe** i wprowadź swoje dane
3. W ustawieniach serwera użyj tych samych ustawień IMAP i SMTP co powyżej

Dla Androida:

1. Przejdź do **Ustawienia → Konta → Dodaj konto → Osobiste (IMAP)**
2. Wprowadź swój adres Forward Email i hasło
3. W ustawieniach serwera użyj tych samych ustawień IMAP i SMTP co powyżej

### Konfiguracja Sendmail SMTP Relay {#sendmail-smtp-relay-configuration}

Możesz skonfigurować Sendmail do przekazywania wiadomości przez serwery SMTP Forward Email. Jest to powszechna konfiguracja dla systemów legacy lub aplikacji korzystających z Sendmail.
<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Szacowany czas konfiguracji:</strong>
  <span>Mniej niż 20 minut</span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Ważne:
  </strong>
  <span>
    Wymaga to płatnego planu z włączonym dostępem SMTP.
  </span>
</div>

#### Konfiguracja {#configuration}

1. Edytuj plik `sendmail.mc`, zazwyczaj znajdujący się w `/etc/mail/sendmail.mc`:

   ```bash
   sudo nano /etc/mail/sendmail.mc
   ```

2. Dodaj następujące linie, aby zdefiniować smart host i uwierzytelnianie:

   ```
   define(`SMART_HOST', `smtp.forwardemail.net')dnl
   define(`RELAY_MAILER_ARGS', `TCP $h 465')dnl
   define(`confAUTH_MECHANISMS', `EXTERNAL GSSAPI DIGEST-MD5 CRAM-MD5 LOGIN PLAIN')dnl
   FEATURE(`authinfo',`hash -o /etc/mail/authinfo.db')dnl
   ```

3. Utwórz plik uwierzytelniania `/etc/mail/authinfo`:

   ```bash
   sudo nano /etc/mail/authinfo
   ```

4. Dodaj swoje dane uwierzytelniające Forward Email do pliku `authinfo`:

   ```
   AuthInfo:smtp.forwardemail.net "U:your-alias@yourdomain.com" "P:your-generated-password" "M:PLAIN"
   ```

5. Wygeneruj bazę danych uwierzytelniania i zabezpiecz pliki:

   ```bash
   sudo makemap hash /etc/mail/authinfo < /etc/mail/authinfo
   sudo chmod 600 /etc/mail/authinfo /etc/mail/authinfo.db
   ```

6. Odbuduj konfigurację Sendmail i zrestartuj usługę:

   ```bash
   sudo make -C /etc/mail
   sudo systemctl restart sendmail
   ```

#### Testowanie {#testing}

Wyślij testowy e-mail, aby zweryfikować konfigurację:

```bash
echo "Test email from Sendmail" | mail -s "Sendmail Test" recipient@example.com
```

### Konfiguracja Exim4 SMTP Relay {#exim4-smtp-relay-configuration}

Exim4 to popularny MTA na systemach opartych na Debianie. Możesz go skonfigurować do używania Forward Email jako smarthosta.

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Szacowany czas konfiguracji:</strong>
  <span>Mniej niż 15 minut</span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Ważne:
  </strong>
  <span>
    Wymaga to płatnego planu z włączonym dostępem SMTP.
  </span>
</div>

#### Konfiguracja {#configuration-1}

1. Uruchom narzędzie konfiguracyjne Exim4:

   ```bash
   sudo dpkg-reconfigure exim4-config
   ```

2. Wybierz następujące opcje:
   * **Ogólny typ konfiguracji poczty:** poczta wysyłana przez smarthost; odbierana przez SMTP lub fetchmail
   * **Nazwa systemowa poczty:** your.hostname
   * **Adresy IP do nasłuchiwania na przychodzące połączenia SMTP:** 127.0.0.1 ; ::1
   * **Inne miejsca docelowe, dla których akceptowana jest poczta:** (pozostaw puste)
   * **Domeny, dla których ma być przekazywana poczta:** (pozostaw puste)
   * **Adres IP lub nazwa hosta wychodzącego smarthosta:** smtp.forwardemail.net::465
   * **Ukryć lokalną nazwę poczty w wychodzącej poczcie?** Nie
   * **Minimalizować liczbę zapytań DNS (Dial-on-Demand)?** Nie
   * **Metoda dostarczania lokalnej poczty:** format Mbox w /var/mail/
   * **Podzielić konfigurację na małe pliki?** Nie

3. Edytuj plik `passwd.client`, aby dodać swoje dane uwierzytelniające:

   ```bash
   sudo nano /etc/exim4/passwd.client
   ```

4. Dodaj następującą linię:

   ```
   smtp.forwardemail.net:your-alias@yourdomain.com:your-generated-password
   ```

5. Zaktualizuj konfigurację i zrestartuj Exim4:

   ```bash
   sudo update-exim4.conf
   sudo systemctl restart exim4
   ```

#### Testowanie {#testing-1}

Wyślij testowy e-mail:

```bash
echo "Test from Exim4" | mail -s "Exim4 Test" recipient@example.com
```

### Konfiguracja klienta SMTP msmtp {#msmtp-smtp-client-configuration}

msmtp to lekki klient SMTP, który jest przydatny do wysyłania e-maili ze skryptów lub aplikacji wiersza poleceń.

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Szacowany czas konfiguracji:</strong>
  <span>Mniej niż 10 minut</span>
</div>
<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Ważne:
  </strong>
  <span>
    Wymaga to płatnego planu z włączonym dostępem SMTP.
  </span>
</div>

#### Konfiguracja {#configuration-2}

1. Utwórz lub edytuj plik konfiguracyjny msmtp w `~/.msmtprc`:

   ```bash
   nano ~/.msmtprc
   ```

2. Dodaj następującą konfigurację:

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

3. Ustaw odpowiednie uprawnienia dla pliku konfiguracyjnego:

   ```bash
   chmod 600 ~/.msmtprc
   ```

#### Testowanie {#testing-2}

Wyślij testowy e-mail:

```bash
echo "This is a test email from msmtp" | msmtp -a default recipient@example.com
```

### Klienci poczty wiersza poleceń {#command-line-email-clients}

Popularnych klientów poczty wiersza poleceń, takich jak [Mutt](https://gitlab.com/muttmua/mutt), [NeoMutt](https://neomutt.org) i [Alpine](https://alpine.x10.mx/alpine/release/), można skonfigurować do korzystania z serwerów SMTP Forward Email do wysyłania poczty. Konfiguracja będzie podobna do ustawień `msmtp`, gdzie podajesz dane serwera SMTP oraz swoje dane uwierzytelniające w odpowiednich plikach konfiguracyjnych (`.muttrc`, `.neomuttrc` lub `.pinerc`).

### Konfiguracja poczty w Windows {#windows-email-configuration}

Dla użytkowników Windows można skonfigurować popularnych klientów poczty, takich jak **Microsoft Outlook** i **eM Client**, używając ustawień IMAP i SMTP podanych w Twoim koncie Forward Email. Do użytku w wierszu poleceń lub skryptach można użyć cmdletu PowerShell `Send-MailMessage` (choć jest on uważany za przestarzały) lub lekkiego narzędzia SMTP relay, takiego jak [E-MailRelay](https://github.com/graeme-walker/emailrelay).

### Konfiguracja relaya SMTP Postfix {#postfix-smtp-relay-configuration}

Możesz skonfigurować Postfix do przekazywania wiadomości e-mail przez serwery SMTP Forward Email. Jest to przydatne dla aplikacji serwerowych, które muszą wysyłać e-maile.

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Szacowany czas konfiguracji:</strong>
  <span>Mniej niż 15 minut</span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Ważne:
  </strong>
  <span>
    Wymaga to płatnego planu z włączonym dostępem SMTP.
  </span>
</div>

#### Instalacja {#installation}

1. Zainstaluj Postfix na swoim serwerze:

```bash
# Ubuntu/Debian
sudo apt update && sudo apt install postfix

# CentOS/RHEL
sudo yum install postfix

# macOS
brew install postfix
```

2. Podczas instalacji wybierz "Internet Site" jako typ konfiguracji.

#### Konfiguracja {#configuration-3}

1. Edytuj główny plik konfiguracyjny Postfix:

```bash
sudo nano /etc/postfix/main.cf
```

2. Dodaj lub zmodyfikuj następujące ustawienia:

```
# Konfiguracja relaya SMTP
relayhost = [smtp.forwardemail.net]:465
smtp_tls_wrappermode = yes
smtp_tls_security_level = encrypt
smtp_sasl_auth_enable = yes
smtp_sasl_password_maps = hash:/etc/postfix/sasl_passwd
smtp_sasl_security_options = noanonymous
smtp_tls_CAfile = /etc/ssl/certs/ca-certificates.crt
```

3. Utwórz plik z hasłem SASL:

```bash
sudo nano /etc/postfix/sasl_passwd
```

4. Dodaj swoje dane uwierzytelniające Forward Email:

```
[smtp.forwardemail.net]:465 your-alias@yourdomain.com:your-generated-password
```

5. Zabezpiecz i zahashuj plik z hasłem:

```bash
sudo chmod 600 /etc/postfix/sasl_passwd
sudo postmap /etc/postfix/sasl_passwd
```

6. Uruchom ponownie Postfix:

```bash
sudo systemctl restart postfix
```

#### Testowanie {#testing-3}

Przetestuj konfigurację, wysyłając testowy e-mail:

```bash
echo "Test email body" | mail -s "Test Subject" recipient@example.com
```

### Jak wysyłać pocztę jako za pomocą Gmail {#how-to-send-mail-as-using-gmail}
<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Szacowany czas konfiguracji:</strong>
  <span>Mniej niż 10 minut</span>
</div>

<div class="alert mb-3 alert-success">
  <i class="fa fa-bullhorn font-weight-bold"></i>
  <strong class="font-weight-bold">
    Rozpoczęcie:
  </strong>
  <span>
    Jeśli postępowałeś zgodnie z instrukcjami powyżej w sekcji <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">Jak zacząć i skonfigurować przekazywanie e-maili</a>, możesz kontynuować czytanie poniżej.
  </span>
</div>

<div id="send-mail-as-content">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Ważne:
  </strong>
  <span>
    Upewnij się, że przeczytałeś nasze <a href="/terms" class="alert-link" target="_blank">Warunki</a>, <a href="/privacy" class="alert-link" target="_blank">Politykę prywatności</a> oraz <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Limity SMTP wychodzącego</a> &ndash; korzystanie oznacza akceptację i zgodę.
  </span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Ważne:
  </strong>
  <span>
    Jeśli jesteś programistą, zapoznaj się z naszą <a class="alert-link" href="/email-api#outbound-emails" target="_blank">dokumentacją API e-mail</a>.
  </span>
</div>

1. Przejdź do <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Moje konto <i class="fa fa-angle-right"></i> Domeny</a> <i class="fa fa-angle-right"></i> Ustawienia <i class="fa fa-angle-right"></i> Konfiguracja SMTP wychodzącego i postępuj zgodnie z instrukcjami konfiguracji

2. Utwórz nowy alias dla swojej domeny w sekcji <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Moje konto <i class="fa fa-angle-right"></i> Domeny</a> <i class="fa fa-angle-right"></i> Aliasy (np. <code><hello@example.com></code>)

3. Kliknij na <strong class="text-success"><i class="fa fa-key"></i> Wygeneruj hasło</strong> obok nowo utworzonego aliasu. Skopiuj do schowka i bezpiecznie przechowuj wygenerowane hasło wyświetlone na ekranie.

4. Przejdź do [Gmail](https://gmail.com) i w sekcji [Ustawienia <i class="fa fa-angle-right"></i> Konta i import <i class="fa fa-angle-right"></i> Wyślij pocztę jako](https://mail.google.com/mail/u/0/#settings/accounts), kliknij "Dodaj inny adres e-mail"

5. Gdy pojawi się pole "Nazwa", wpisz nazwę, która ma być widoczna jako nadawca (np. "Linus Torvalds").

6. Gdy pojawi się pole "Adres e-mail", wpisz pełny adres e-mail aliasu, który utworzyłeś w sekcji <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Moje konto <i class="fa fa-angle-right"></i> Domeny</a> <i class="fa fa-angle-right"></i> Aliasy (np. <code><hello@example.com></code>)

7. Odznacz opcję "Traktuj jako alias"

8. Kliknij "Następny krok", aby kontynuować

9. Gdy pojawi się pole "Serwer SMTP", wpisz <code>smtp.forwardemail.net</code> i zmień port na <code>465</code>

10. Gdy pojawi się pole "Nazwa użytkownika", wpisz pełny adres e-mail aliasu, który utworzyłeś w sekcji <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Moje konto <i class="fa fa-angle-right"></i> Domeny</a> <i class="fa fa-angle-right"></i> Aliasy (np. <code><hello@example.com></code>)

11. Gdy pojawi się pole "Hasło", wklej hasło z <strong class="text-success"><i class="fa fa-key"></i> Wygeneruj hasło</strong> z kroku 3 powyżej

12. Wybierz opcję "Bezpieczne połączenie za pomocą SSL"

13. Kliknij "Dodaj konto", aby kontynuować

14. Otwórz nową kartę w [Gmail](https://gmail.com) i poczekaj na przyjście wiadomości weryfikacyjnej (otrzymasz kod weryfikacyjny potwierdzający, że jesteś właścicielem adresu e-mail, z którego próbujesz "Wysyłać pocztę jako")

15. Gdy wiadomość przyjdzie, skopiuj i wklej kod weryfikacyjny w polu, które pojawiło się w poprzednim kroku
16. Gdy to zrobisz, wróć do wiadomości e-mail i kliknij link, aby „potwierdzić żądanie”. Najprawdopodobniej będziesz musiał wykonać ten krok oraz poprzedni, aby e-mail został poprawnie skonfigurowany.

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Gratulacje!
    </strong>
    <span>
      Pomyślnie ukończyłeś wszystkie kroki.
    </span>
  </div>
</div>

</div>

### Czym jest przewodnik legacy free dla Send Mail As przy użyciu Gmaila {#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail}

<div class="alert my-3 alert-danger"><i class="fa fa-stop-circle font-weight-bold"></i> <strong class="font-weight-bold">Ważne:</strong> Ten przewodnik legacy free jest przestarzały od maja 2023, ponieważ <a class="alert-link" href="/faq#do-you-support-sending-email-with-smtp">obecnie wspieramy wychodzący SMTP</a>. Jeśli użyjesz poniższego przewodnika, to <a class="alert-link" href="/faq#can-i-remove-the-via-forwardemail-dot-net-in-gmail">spowoduje, że Twoje wychodzące e-maile</a> będą wyświetlać w Gmailu "<span class="notranslate text-danger font-weight-bold">via forwardemail dot net</span>".</a></div>

<div class="alert mb-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Szacowany czas konfiguracji:</strong>
  <span>Mniej niż 10 minut</span>
</div>

<div class="alert mb-3 alert-success">
  <i class="fa fa-bullhorn font-weight-bold"></i>
  <strong class="font-weight-bold">
    Rozpoczęcie:
  </strong>
  <span>
    Jeśli postępowałeś zgodnie z instrukcjami powyżej w sekcji <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">Jak zacząć i skonfigurować przekazywanie e-maili</a>, możesz kontynuować czytanie poniżej.
  </span>
</div>

<div class="mx-auto lazyframe lazyframe-bordered border border-themed mb-3" data-vendor="youtube_nocookie" title="How to Send Mail As using Gmail" data-src="https://www.youtube-nocookie.com/embed/MEheS8gM4Xs?autoplay=0"></div>

<div id="legacy-free-guide">

1. Musisz mieć włączoną [Dwuskładnikową weryfikację Gmaila][gmail-2fa], aby to działało. Odwiedź <https://www.google.com/landing/2step/>, jeśli nie masz jej włączonej.

2. Gdy Dwuskładnikowa weryfikacja jest włączona (lub jeśli już była włączona), odwiedź <https://myaccount.google.com/apppasswords>.

3. Gdy zostaniesz poproszony o „Wybierz aplikację i urządzenie, dla którego chcesz wygenerować hasło aplikacji”:
   * Wybierz „Mail” z rozwijanego menu „Wybierz aplikację”
   * Wybierz „Inne” z rozwijanego menu „Wybierz urządzenie”
   * Gdy pojawi się pole tekstowe, wpisz adres e-mail swojej niestandardowej domeny, z której przekierowujesz (np. <code><hello@example.com></code> - pomoże Ci to śledzić, jeśli używasz tej usługi dla wielu kont)

4. Skopiuj automatycznie wygenerowane hasło do schowka
   <div class="alert my-3 alert-warning">
     <i class="fa fa-exclamation-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Ważne:
     </strong>
     <span>
       Jeśli korzystasz z G Suite, odwiedź panel administratora <a class="alert-link" href="https://admin.google.com/AdminHome#ServiceSettings/service=email&subtab=filters" rel="noopener noreferrer" target="_blank">Aplikacje <i class="fa fa-angle-right"></i> G Suite <i class="fa fa-angle-right"></i> Ustawienia Gmaila <i class="fa fa-angle-right"></i> Ustawienia</a> i upewnij się, że zaznaczono „Zezwalaj użytkownikom na wysyłanie poczty przez zewnętrzny serwer SMTP...”. Zmiana ta wymaga kilku minut na aktywację, więc prosimy o cierpliwość.
     </span>
   </div>

5. Przejdź do [Gmail](https://gmail.com) i w sekcji [Ustawienia <i class="fa fa-angle-right"></i> Konta i import <i class="fa fa-angle-right"></i> Wyślij pocztę jako](https://mail.google.com/mail/u/0/#settings/accounts) kliknij „Dodaj inny adres e-mail”

6. Gdy zostaniesz poproszony o „Imię”, wpisz nazwę, która ma być widoczna jako nadawca (np. „Linus Torvalds”)

7. Gdy zostaniesz poproszony o „Adres e-mail”, wpisz adres e-mail z niestandardowej domeny, którego użyłeś powyżej (np. <code><hello@example.com></code>)
8. Odznacz "Treat as an alias"

9. Kliknij "Next Step", aby kontynuować

10. Gdy pojawi się prośba o "SMTP Server", wpisz <code>smtp.gmail.com</code> i pozostaw port jako <code>587</code>

11. Gdy pojawi się prośba o "Username", wpisz część swojego adresu Gmail bez części <span>gmail.com</span> (np. tylko "user", jeśli mój e-mail to <span><user@gmail.com></span>)
    <div class="alert my-3 alert-primary">
      <i class="fa fa-info-circle font-weight-bold"></i>
      <strong class="font-weight-bold">
        Ważne:
      </strong>
      <span>
        Jeśli pole "Username" zostanie wypełnione automatycznie, to <u><strong>będziesz musiał to zmienić</strong></u> na część nazwy użytkownika swojego adresu Gmail.
      </span>
    </div>

12. Gdy pojawi się prośba o "Password", wklej ze schowka hasło, które wygenerowałeś w kroku 2 powyżej

13. Pozostaw zaznaczone pole wyboru "Secured connection using TLS"

14. Kliknij "Add Account", aby kontynuować

15. Otwórz nową kartę w [Gmail](https://gmail.com) i poczekaj na przyjście wiadomości weryfikacyjnej (otrzymasz kod weryfikacyjny potwierdzający, że jesteś właścicielem adresu e-mail, z którego próbujesz "Wysyłać jako")

16. Gdy wiadomość przyjdzie, skopiuj i wklej kod weryfikacyjny w oknie, które pojawiło się w poprzednim kroku

17. Po wykonaniu tego wróć do e-maila i kliknij link, aby "potwierdzić żądanie". Najprawdopodobniej będziesz musiał wykonać ten krok oraz poprzedni, aby e-mail został poprawnie skonfigurowany.

</div>

### Zaawansowana konfiguracja trasowania Gmail {#advanced-gmail-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Szacowany czas konfiguracji:</strong>
  <span>15-30 minut</span>
</div>

Jeśli chcesz skonfigurować zaawansowane trasowanie w Gmail, tak aby aliasy, które nie odpowiadają skrzynce pocztowej, były przekierowywane do serwerów pocztowych Forward Email, wykonaj następujące kroki:

1. Zaloguj się do konsoli administratora Google pod adresem [admin.google.com](https://admin.google.com)
2. Przejdź do **Apps → Google Workspace → Gmail → Routing**
3. Kliknij **Add Route** i skonfiguruj następujące ustawienia:

**Ustawienia pojedynczego odbiorcy:**

* Wybierz "Change envelope recipient" i wpisz swój główny adres Gmail
* Zaznacz "Add X-Gm-Original-To header with original recipient"

**Wzorce odbiorcy koperty:**

* Dodaj wzorzec, który pasuje do wszystkich nieistniejących skrzynek pocztowych (np. `.*@yourdomain.com`)

**Ustawienia serwera pocztowego:**

* Wybierz "Route to host" i wpisz `mx1.forwardemail.net` jako serwer podstawowy
* Dodaj `mx2.forwardemail.net` jako serwer zapasowy
* Ustaw port na 25
* Wybierz "Require TLS" dla bezpieczeństwa

4. Kliknij **Save**, aby utworzyć trasę

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Ważne:
  </strong>
  <span>
    Ta konfiguracja będzie działać tylko dla kont Google Workspace z własnymi domenami, nie dla zwykłych kont Gmail.
  </span>
</div>

### Zaawansowana konfiguracja trasowania Outlook {#advanced-outlook-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Szacowany czas konfiguracji:</strong>
  <span>15-30 minut</span>
</div>

Dla użytkowników Microsoft 365 (dawniej Office 365), którzy chcą skonfigurować zaawansowane trasowanie, tak aby aliasy, które nie odpowiadają skrzynce pocztowej, były przekierowywane do serwerów pocztowych Forward Email:

1. Zaloguj się do centrum administracyjnego Microsoft 365 pod adresem [admin.microsoft.com](https://admin.microsoft.com)
2. Przejdź do **Exchange → Mail flow → Rules**
3. Kliknij **Add a rule** i wybierz **Create a new rule**
4. Nazwij swoją regułę (np. "Forward non-existent mailboxes to Forward Email")
5. W sekcji **Apply this rule if** wybierz:
   * "The recipient address matches..."
   * Wpisz wzorzec pasujący do wszystkich adresów w Twojej domenie (np. `*@yourdomain.com`)
6. W sekcji **Do the following** wybierz:
   * "Redirect the message to..."
   * Wybierz "The following mail server"
   * Wpisz `mx1.forwardemail.net` i port 25
   * Dodaj `mx2.forwardemail.net` jako serwer zapasowy
7. W sekcji **Except if** wybierz:
   * "The recipient is..."
   * Dodaj wszystkie istniejące skrzynki pocztowe, które nie powinny być przekierowywane
8. Ustaw priorytet reguły, aby działała po innych regułach przepływu poczty
9. Kliknij **Save**, aby aktywować regułę
## Rozwiązywanie problemów {#troubleshooting}

### Dlaczego nie otrzymuję moich testowych e-maili {#why-am-i-not-receiving-my-test-emails}

Jeśli wysyłasz testowy e-mail do siebie, może on nie pojawić się w Twojej skrzynce odbiorczej, ponieważ ma ten sam nagłówek "Message-ID".

Jest to powszechnie znany problem, który dotyczy także usług takich jak Gmail.  <a href="https://support.google.com/a/answer/1703601">Oto oficjalna odpowiedź Gmail dotycząca tego problemu</a>.

Jeśli nadal masz problemy, najprawdopodobniej jest to kwestia propagacji DNS.  Będziesz musiał poczekać trochę dłużej i spróbować ponownie (lub spróbować ustawić niższą wartość TTL dla swoich rekordów <strong class="notranslate">TXT</strong>).

**Nadal masz problemy?**  Prosimy <a href="/help">skontaktuj się z nami</a>, abyśmy mogli pomóc w zbadaniu problemu i znalezieniu szybkiego rozwiązania.

### Jak skonfigurować klienta poczty e-mail do pracy z Forward Email {#how-do-i-configure-my-email-client-to-work-with-forward-email}

<div class="mb-3">
  Nasza usługa działa z popularnymi klientami poczty e-mail, takimi jak:
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
  Twoja nazwa użytkownika to adres e-mail Twojego aliasu, a hasło pochodzi z <strong class="text-success"><i class="fa fa-key"></i> Generate Password</strong> ("Normal Password").
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Wskazówka:
  </strong>
  <span>Jeśli używasz Thunderbirda, upewnij się, że "Connection security" jest ustawione na "SSL/TLS", a metoda uwierzytelniania na "Normal password".</span>
</div>

| Typ  |         Nazwa hosta         |         Protokół         |                                            Porty                                            |
| :---: | :-------------------------: | :----------------------: | :-----------------------------------------------------------------------------------------: |
| IMAP | `imap.forwardemail.net`      |  SSL/TLS **Preferowane** |                                      `993` i `2993`                                        |
| SMTP | `smtp.forwardemail.net`      | SSL/TLS **Zalecane**     | `465` i `2465` dla SSL/TLS (zalecane) lub `587`, `2587`, `2525` oraz `25` dla STARTTLS      |

### Dlaczego moje e-maile trafiają do folderów Spam i Niechciane oraz jak mogę sprawdzić reputację mojej domeny {#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation}
Ta sekcja przeprowadzi Cię przez sytuację, gdy Twoja poczta wychodząca korzysta z naszych serwerów SMTP (np. `smtp.forwardemail.net`) (lub jest przekazywana przez `mx1.forwardemail.net` lub `mx2.forwardemail.net`) i trafia do folderu Spam lub Niechciane u odbiorców.

Regularnie monitorujemy nasze [adresy IP](#what-are-your-servers-ip-addresses) względem [wszystkich renomowanych list DNS denylists](#how-do-you-handle-your-ip-addresses-becoming-blocked), **dlatego najprawdopodobniej jest to problem specyficzny dla reputacji domeny**.

E-maile mogą trafiać do folderów spam z kilku powodów:

1. **Brak uwierzytelnienia**: Skonfiguruj rekordy [SPF](#how-do-i-set-up-spf-for-forward-email), [DKIM](#how-do-i-set-up-dkim-for-forward-email) oraz [DMARC](#how-do-i-set-up-dmarc-for-forward-email).

2. **Reputacja domeny**: Nowe domeny często mają neutralną reputację, dopóki nie zbudują historii wysyłkowej.

3. **Wyzwalacze treści**: Niektóre słowa lub frazy mogą uruchamiać filtry antyspamowe.

4. **Wzorce wysyłki**: Nagłe zwiększenie ilości wysyłanych e-maili może wyglądać podejrzanie.

Możesz spróbować użyć jednego lub więcej z tych narzędzi, aby sprawdzić reputację i kategoryzację swojej domeny:

#### Narzędzia do sprawdzania reputacji i list blokujących {#reputation-and-blocklist-check-tools}

| Nazwa narzędzia                            | URL                                                          | Typ                    |
| ------------------------------------------ | ------------------------------------------------------------ | ---------------------- |
| Cloudflare Domain Categorization Feedback  | <https://radar.cloudflare.com/domains/feedback>              | Kategoryzacja          |
| Spamhaus IP and Domain Reputation Checker  | <https://check.spamhaus.org/>                                | DNSBL                  |
| Cisco Talos IP and Domain Reputation Center| <https://talosintelligence.com/reputation_center>            | Reputacja              |
| Barracuda IP and Domain Reputation Lookup  | <https://www.barracudacentral.org/lookups/lookup-reputation> | DNSBL                  |
| MX Toolbox Blacklist Check                 | <https://mxtoolbox.com/blacklists.aspx>                      | Lista blokująca        |
| Google Postmaster Tools                    | <https://www.gmail.com/postmaster/>                          | Reputacja              |
| Yahoo Sender Hub                           | <https://senders.yahooinc.com/>                              | Reputacja              |
| MultiRBL.valli.org Blacklist Check         | <https://multirbl.valli.org/lookup/>                         | DNSBL                  |
| Sender Score                               | <https://senderscore.org/act/blocklist-remover/>             | Reputacja              |
| Invaluement                                | <https://www.invaluement.com/lookup/>                        | DNSBL                  |
| SURBL                                      | <https://www.surbl.org/>                                     | DNSBL                  |
| SpamCop                                    | <https://www.spamcop.net/bl.shtml>                           | DNSBL                  |
| UCEPROTECT's Levels 1, 2, and 3            | <https://www.uceprotect.net/en/rblcheck.php>                 | DNSBL                  |
| UCEPROTECT's backscatterer.org             | <https://www.backscatterer.org/>                             | Ochrona przed backscatter |
| UCEPROTECT's whitelisted.org               | <https://www.whitelisted.org/> (wymaga opłaty)               | DNSWL                  |

#### Formularze zgłoszeń usunięcia IP według dostawcy {#ip-removal-request-forms-by-provider}

Jeśli Twój adres IP został zablokowany przez konkretnego dostawcę poczty, użyj odpowiedniego formularza usunięcia lub kontaktu poniżej:

| Dostawca                              | Formularz usunięcia / Kontakt                                                                                 | Uwagi                                         |
| ------------------------------------- | -------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| Google/Gmail                         | <https://support.google.com/mail/contact/bulk_send_new>                                                        | Formularz kontaktowy dla nadawców masowych    |
| Microsoft (Outlook/Office 365/Hotmail)| <https://sender.office.com>                                                                                    | Portal do usuwania IP Office 365               |
| Yahoo/AOL/Verizon                    | <https://senders.yahooinc.com/>                                                                                | Yahoo Sender Hub                              |
| Apple/iCloud                       | <https://ipcheck.proofpoint.com/>                                                                              | Apple korzysta z Proofpoint dla reputacji IP  |
| Proofpoint                         | <https://ipcheck.proofpoint.com/>                                                                              | Sprawdzenie i usuwanie IP w Proofpoint        |
| Barracuda Networks                 | <https://www.barracudacentral.org/lookups/lookup-reputation>                                                   | Sprawdzenie i usuwanie reputacji Barracuda    |
| Cloudmark                        | <https://csi.cloudmark.com/en/reset/>                                                                          | Żądanie resetu Cloudmark CSI                   |
| GoDaddy/SecureServer               | <https://unblock.secureserver.net>                                                                             | Formularz odblokowania IP GoDaddy              |
| Comcast/Xfinity                  | <https://spa.xfinity.com/report>                                                                               | Żądanie usunięcia IP Comcast                   |
| Charter/Spectrum                 | <https://www.spectrum.net/support/internet/understanding-email-error-codes>                                    | Kontakt z pomocą Spectrum w celu usunięcia     |
| AT&T                               | `abuse_rbl@abuse-att.net`                                                                                      | E-mail do zgłoszenia usunięcia                 |
| Cox Communications               | `unblock.request@cox.net`                                                                                      | E-mail do zgłoszenia usunięcia                 |
| CenturyLink/Lumen                | `abuse@centurylink.com`                                                                                        | Korzysta z Cloudfilter                         |
| Windstream                       | `abuse@windstream.net`                                                                                         | E-mail do zgłoszenia usunięcia                 |
| t-online.de (Niemcy)             | `tobr@rx.t-online.de`                                                                                          | E-mail do zgłoszenia usunięcia                 |
| Orange France                   | <https://postmaster.orange.fr/>                                                                                | Formularz kontaktowy lub e-mail `abuse@orange.fr` |
| GMX                              | <https://postmaster.gmx.net/en/contact>                                                                        | Formularz kontaktowy GMX                        |
| Mail.ru                          | <https://postmaster.mail.ru/>                                                                                  | Portal postmaster Mail.ru                       |
| Yandex                           | <https://postmaster.yandex.ru/>                                                                                | Portal postmaster Yandex                        |
| QQ Mail (Tencent)                | <https://open.mail.qq.com/>                                                                                    | Wniosek o whitelistę QQ Mail (chiński)         |
| Netease (163.com)                | <https://mail.163.com/postmaster/>                                                                             | Portal postmaster Netease                       |
| Alibaba/Aliyun/HiChina           | <https://www.alibabacloud.com/help/en/alibaba-mail/>                                                           | Kontakt przez konsolę Alibaba Cloud             |
| Amazon SES                      | <https://docs.aws.amazon.com/ses/latest/dg/faqs-dnsbls.html>                                                   | Konsola AWS SES > Usuwanie z list blokujących  |
| SendGrid                       | <https://support.sendgrid.com/>                                                                                | Kontakt z pomocą SendGrid                       |
| Mimecast                       | <https://community.mimecast.com/>                                                                              | Korzysta z zewnętrznych RBL - kontaktuj się z konkretnym RBL |
| Fastmail                       | <https://www.fastmail.com/support/>                                                                            | Kontakt z pomocą Fastmail                       |
| Zoho                           | <https://help.zoho.com/portal/en/kb/campaigns/faqs/campaign-review/articles/how-do-i-delist-my-ip-address>     | Kontakt z pomocą Zoho                           |
| ProtonMail                     | <https://proton.me/support/contact>                                                                            | Kontakt z pomocą Proton                         |
| Tutanota                       | <https://tutanota.com/support>                                                                                 | Kontakt z pomocą Tutanota                       |
| Hushmail                      | <https://www.hushmail.com/support/>                                                                            | Kontakt z pomocą Hushmail                       |
| Mailbox.org                   | <https://mailbox.org/en/support>                                                                               | Kontakt z pomocą Mailbox.org                     |
| Posteo                        | <https://posteo.de/en/site/contact>                                                                            | Kontakt z pomocą Posteo                         |
| DuckDuckGo Email              | <https://duckduckgo.com/email/support>                                                                         | Kontakt z pomocą DuckDuckGo                     |
| Sonic.net                    | <https://www.sonic.com/support>                                                                                | Kontakt z pomocą Sonic                          |
| Telus                        | <https://www.telus.com/en/support>                                                                             | Kontakt z pomocą Telus                          |
| Vodafone Germany             | <https://www.vodafone.de/hilfe/>                                                                               | Kontakt z pomocą Vodafone                       |
| Xtra (Spark NZ)              | <https://www.spark.co.nz/help/>                                                                                 | Kontakt z pomocą Spark NZ                       |
| UOL/BOL (Brazylia)           | <https://ajuda.uol.com.br/>                                                                                    | Kontakt z pomocą UOL (portugalski)              |
| Libero (Włochy)              | <https://aiuto.libero.it/>                                                                                     | Kontakt z pomocą Libero (włoski)                |
| Telenet (Belgia)             | <https://www2.telenet.be/en/support/>                                                                          | Kontakt z pomocą Telenet                        |
| Facebook/WhatsApp            | <https://www.facebook.com/business/help>                                                                       | Kontakt z pomocą biznesowym Facebooka          |
| LinkedIn                    | <https://www.linkedin.com/help/linkedin>                                                                       | Kontakt z pomocą LinkedIn                       |
| Groups.io                   | <https://groups.io/helpcenter>                                                                                 | Kontakt z pomocą Groups.io                      |
| Earthlink/Vade Secure       | <https://sendertool.vadesecure.com/en/>                                                                        | Narzędzie nadawcy Vade Secure                   |
| Cloudflare Email Security   | <https://www.cloudflare.com/products/zero-trust/email-security/>                                               | Kontakt z pomocą Cloudflare                     |
| Hornetsecurity/Expurgate    | <https://www.hornetsecurity.com/>                                                                              | Kontakt z pomocą Hornetsecurity                 |
| SpamExperts/Antispamcloud   | <https://www.spamexperts.com/>                                                                                 | Kontakt przez dostawcę hostingu                 |
| Mail2World                 | <https://www.mail2world.com/support/>                                                                          | Kontakt z pomocą Mail2World                      |
> \[!TIP]
> Zacznij od niskiej liczby wysokiej jakości e-maili, aby zbudować pozytywną reputację przed wysyłką większych ilości.

> \[!IMPORTANT]
> Jeśli Twoja domena znajduje się na czarnej liście, każda lista ma własny proces usuwania. Sprawdź ich strony internetowe, aby uzyskać instrukcje.

> \[!TIP]
> Jeśli potrzebujesz dodatkowej pomocy lub zauważysz, że jesteśmy błędnie oznaczeni jako spam przez konkretnego dostawcę usług e-mail, prosimy <a href="/help">skontaktuj się z nami</a>.

### Co powinienem zrobić, jeśli otrzymuję spam {#what-should-i-do-if-i-receive-spam-emails}

Powinieneś wypisać się z listy mailingowej (jeśli to możliwe) i zablokować nadawcę.

Prosimy nie zgłaszać wiadomości jako spam, lecz przekazać ją do naszego ręcznie moderowanego i skoncentrowanego na prywatności systemu zapobiegania nadużyciom.

**Adres e-mail, na który należy przesyłać spam, to:** <abuse@forwardemail.net>

### Dlaczego moje testowe e-maile wysłane do mnie w Gmailu są oznaczane jako "podejrzane" {#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious}

Jeśli widzisz ten komunikat o błędzie w Gmailu, gdy wysyłasz test do siebie lub gdy osoba, z którą korespondujesz za pomocą aliasu, widzi od Ciebie e-mail po raz pierwszy, to **proszę się nie martwić** – jest to wbudowana funkcja bezpieczeństwa Gmaila.

Możesz po prostu kliknąć "Wygląda na bezpieczne". Na przykład, jeśli wyślesz wiadomość testową korzystając z funkcji wysyłania jako (do kogoś innego), ta osoba nie zobaczy tego komunikatu.

Jeśli jednak zobaczy, to dlatego, że zwykle widziała Twoje e-maile pochodzące z <john@gmail.com> zamiast <john@customdomain.com> (to tylko przykład). Gmail ostrzega użytkowników, aby upewnić się, że wszystko jest bezpieczne, nie ma obejścia tego.

### Czy mogę usunąć via forwardemail dot net w Gmailu {#can-i-remove-the-via-forwardemail-dot-net-in-gmail}

Ten temat dotyczy [powszechnie znanego problemu w Gmailu, gdzie obok nazwy nadawcy pojawiają się dodatkowe informacje](https://support.google.com/mail/answer/1311182).

Od maja 2023 roku wspieramy wysyłanie e-maili przez SMTP jako dodatek dla wszystkich płatnych użytkowników – co oznacza, że możesz usunąć <span class="notranslate">via forwardemail dot net</span> w Gmailu.

Zwróć uwagę, że ten temat FAQ jest specyficzny dla osób korzystających z funkcji [Jak wysyłać pocztę jako w Gmailu](#how-to-send-mail-as-using-gmail).

Proszę zobacz sekcję [Czy wspieracie wysyłanie e-maili przez SMTP](#do-you-support-sending-email-with-smtp) dla instrukcji konfiguracji.


## Zarządzanie danymi {#data-management}

### Gdzie znajdują się Wasze serwery {#where-are-your-servers-located}

> \[!TIP]
> Wkrótce możemy ogłosić lokalizację naszego centrum danych w UE, hostowanego pod adresem [forwardemail.eu](https://forwardemail.eu). Subskrybuj dyskusję na <https://github.com/orgs/forwardemail/discussions/336>, aby otrzymywać aktualizacje.

Nasze serwery znajdują się głównie w Denver, Kolorado – zobacz <https://forwardemail.net/ips> dla pełnej listy adresów IP.

Możesz dowiedzieć się o naszych podwykonawcach na stronach [RODO](/gdpr), [DPA](/dpa) oraz [Prywatność](/privacy).

### Jak wyeksportować i wykonać kopię zapasową mojej skrzynki pocztowej {#how-do-i-export-and-backup-my-mailbox}

W każdej chwili możesz wyeksportować swoje skrzynki pocztowe w formatach [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions), [Mbox](https://en.wikipedia.org/wiki/Mbox) lub zaszyfrowanym formacie [SQLite](https://en.wikipedia.org/wiki/SQLite).

Przejdź do <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Moje konto <i class="fa fa-angle-right"></i> Domeny</a> <i class="fa fa-angle-right"></i> Aliasy <i class="fa fa-angle-right"></i> Pobierz kopię zapasową i wybierz preferowany format eksportu.

Po zakończeniu otrzymasz link do pobrania eksportu na swój e-mail.

Zwróć uwagę, że link do pobrania eksportu wygasa po 4 godzinach ze względów bezpieczeństwa.

Jeśli potrzebujesz przejrzeć wyeksportowane formaty EML lub Mbox, te narzędzia open-source mogą być przydatne:

| Nazwa           | Format | Platforma    | GitHub URL                                          |
| --------------- | :----: | ----------- | --------------------------------------------------- |
| MBox Viewer     |  Mbox  | Windows     | <https://github.com/eneam/mboxviewer>               |
| mbox-web-viewer |  Mbox  | Wszystkie   | <https://github.com/PHMRanger/mbox-web-viewer>      |
| EmlReader       |   EML  | Windows     | <https://github.com/ayamadori/EmlReader>            |
| Email viewer    |   EML  | VSCode      | <https://github.com/joelharkes/vscode_email_viewer> |
| eml-reader      |   EML  | Wszystkie   | <https://github.com/s0ph1e/eml-reader>              |
Additionally if you need to convert a Mbox file to EML file, then you can use <https://github.com/noelmartinon/mboxzilla>.

### Jak zaimportować i przenieść moją istniejącą skrzynkę pocztową {#how-do-i-import-and-migrate-my-existing-mailbox}

Możesz łatwo zaimportować swoją pocztę do Forward Email (np. używając [Thunderbird](https://www.thunderbird.net)) korzystając z poniższych instrukcji:

<div class="alert alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Ważne:
  </strong>
  <span>
    Musisz wykonać wszystkie poniższe kroki, aby zaimportować swoją istniejącą pocztę.
  </span>
</div>

1. Eksportuj swoją pocztę od obecnego dostawcy:

   | Dostawca poczty | Format eksportu                               | Instrukcje eksportu                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
   | -------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | Gmail          | MBOX                                           | <https://takeout.google.com/settings/takeout/custom/gmail>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
   | Outlook        | PST                                            | <div class="alert my-3 alert-danger"><i class="fa fa-info-circle font-weight-bold"></i> <strong class="font-weight-bold">Wskazówka:</strong> <span>Jeśli używasz Outlooka (<a href="https://support.microsoft.com/en-us/office/back-up-your-email-e5845b0b-1aeb-424f-924c-aa1c33b18833#:~:text=Select%20File%20%3E%20Open%20%26%20Export%20%3E,back%20up%20and%20select%20Next." class="alert-link">format eksportu PST</a>), możesz po prostu postępować zgodnie z instrukcjami w sekcji "Inne" poniżej. Jednakże podaliśmy poniżej linki do konwersji PST na format MBOX/EML w zależności od systemu operacyjnego:<ul class="mb-0 mt-3"><li><a class="alert-link" href="https://github.com/BaselineIT/Zinkuba/releases/download/release-1.2/Zinkuba.App.exe">Zinkuba dla Windows</a> (<a class="alert-link" href="https://github.com/BaselineIT/Zinkuba?tab=readme-ov-file#zinkuba">GitHub</a>)</li><li><a class="alert-link" href="https://cygwin.com/packages/summary/readpst.html">readpst dla Windows cygwin</a> – (np. <code>readpst -u -o $OUT_DIR $IN_DIR</code> zamieniając <code>$OUT_DIR</code> i <code>$IN_DIR</code> na ścieżki katalogu wyjściowego i wejściowego odpowiednio).</li><li><a class="alert-link" href="https://manpages.ubuntu.com/manpages/trusty/man1/readpst.1.html">readpst dla Ubuntu/Linux</a> – (np. <code>sudo apt-get install readpst</code> a następnie <code>readpst -u -o $OUT_DIR $IN_DIR</code>, zamieniając <code>$OUT_DIR</code> i <code>$IN_DIR</code> na ścieżki katalogu wyjściowego i wejściowego odpowiednio).</li><li><a class="alert-link" href="https://formulae.brew.sh/formula/libpst">readpst dla macOS (przez brew)</a> – (np. <code>brew install libpst</code> a następnie <code>readpst -u -o $OUT_DIR $IN_DIR</code>, zamieniając <code>$OUT_DIR</code> i <code>$IN_DIR</code> na ścieżki katalogu wyjściowego i wejściowego odpowiednio).</li><li><a class="alert-link" href="https://github.com/juanirm/pst-converter/tree/master?tab=readme-ov-file#pst-converter">PST Converter dla Windows (GitHub)</a></li></ul><br /></span></div> |
   | Apple Mail     | MBOX                                           | <https://support.apple.com/guide/mail/import-or-export-mailboxes-mlhlp1030/mac#apd37a3190755974>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
   | Fastmail       | EML                                            | <https://www.fastmail.help/hc/en-us/articles/360060590573-Download-all-your-data#downloadmail>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
   | Proton Mail    | MBOX/EML                                       | <https://proton.me/support/export-emails-import-export-app>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
   | Tutanota       | EML                                            | <https://github.com/crepererum-oss/tatutanatata>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
   | Gandi          | EML                                            | <https://docs.gandi.net/en/gandimail/common_operations/backup_email.html#contents>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
   | Zoho           | EML                                            | <https://www.zoho.com/mail/help/import-export-emails.html#alink2>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
   | Inne           | [Użyj Thunderbird](https://www.thunderbird.net) | Skonfiguruj swoje istniejące konto e-mail w Thunderbird, a następnie użyj wtyczki [ImportExportTools NG](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/), aby eksportować i importować swoją pocztę.  **Możesz także po prostu kopiować/wklejać lub przeciągać upuszczać wiadomości między kontami.**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
2. Pobierz, zainstaluj i otwórz [Thunderbird](https://www.thunderbird.net).

3. Utwórz nowe konto, używając pełnego adresu e-mail swojego aliasu (np. <code><you@yourdomain.com></code>) oraz wygenerowanego hasła.  <strong>Jeśli nie masz jeszcze wygenerowanego hasła, to <a href="/faq#do-you-support-receiving-email-with-imap" target="_blank">zapoznaj się z naszymi instrukcjami konfiguracji</a></strong>.

4. Pobierz i zainstaluj wtyczkę [ImportExportTools NG](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/) do Thunderbirda.

5. Utwórz nowy lokalny folder w Thunderbirdzie, a następnie kliknij go prawym przyciskiem myszy → wybierz opcję `ImportExportTools NG` → wybierz `Import mbox file` (dla formatu eksportu MBOX) – lub – `Import messages` / `Import all messages from a directory` (dla formatu eksportu EML).

6. Przeciągnij i upuść wiadomości z lokalnego folderu do nowego (lub istniejącego) folderu IMAP w Thunderbirdzie, do którego chcesz przesłać wiadomości w pamięci IMAP w naszej usłudze.  Zapewni to ich kopię zapasową online w naszym zaszyfrowanym magazynie SQLite.

   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Wskazówka:
     </strong>
     <span>
       Jeśli masz wątpliwości, jak importować do Thunderbirda, możesz zapoznać się z oficjalnymi instrukcjami na <a class="alert-link" href="https://kb.mozillazine.org/Importing_folders">https://kb.mozillazine.org/Importing_folders</a> oraz <a class="alert-link" href="https://github.com/thunderbird/import-export-tools-ng/wiki">https://github.com/thunderbird/import-export-tools-ng/wiki</a>.
     </span>
   </div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Ważne:
  </strong>
  <span>
    Po zakończeniu procesu eksportu i importu możesz również chcieć włączyć przekazywanie na swoim istniejącym koncie e-mail oraz ustawić autoresponder, który powiadomi nadawców o nowym adresie e-mail (np. jeśli wcześniej korzystałeś z Gmaila, a teraz używasz e-maila z własną domeną).
  </span>
</div>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Gratulacje!
    </strong>
    <span>
      Pomyślnie ukończyłeś wszystkie kroki.
    </span>
  </div>
</div>

### Jak korzystać z własnej pamięci zgodnej z S3 do kopii zapasowych {#how-do-i-use-my-own-s3-compatible-storage-for-backups}

Użytkownicy planów płatnych mogą skonfigurować własnego dostawcę pamięci zgodnej z [S3](https://en.wikipedia.org/wiki/Amazon_S3) na poziomie domeny dla kopii zapasowych IMAP/SQLite.  Oznacza to, że zaszyfrowane kopie zapasowe skrzynki pocztowej mogą być przechowywane na Twojej własnej infrastrukturze zamiast (lub oprócz) naszej domyślnej pamięci.

Obsługiwani dostawcy to m.in. [Amazon S3](https://aws.amazon.com/s3/), [Cloudflare R2](https://developers.cloudflare.com/r2/), [MinIO](https://github.com/minio/minio), [Backblaze B2](https://www.backblaze.com/cloud-storage), [DigitalOcean Spaces](https://www.digitalocean.com/products/spaces) oraz każda inna usługa zgodna z S3.

#### Konfiguracja {#setup}

1. Utwórz **prywatny** bucket u swojego dostawcy zgodnego z S3.  Bucket nie może być publicznie dostępny.
2. Utwórz dane dostępowe (access key ID oraz secret access key) z uprawnieniami do odczytu i zapisu w bucketcie.
3. Przejdź do <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Moje konto <i class="fa fa-angle-right"></i> Domeny</a> <i class="fa fa-angle-right"></i> Zaawansowane ustawienia <i class="fa fa-angle-right"></i> Własna pamięć zgodna z S3.
4. Zaznacz **"Włącz własną pamięć zgodną z S3"** i wypełnij adres endpoint, access key ID, secret access key, region oraz nazwę bucketu.
5. Kliknij **"Testuj połączenie"**, aby zweryfikować dane dostępowe, dostęp do bucketu oraz uprawnienia do zapisu.
6. Kliknij **"Zapisz"**, aby zastosować ustawienia.

#### Jak działają kopie zapasowe {#how-backups-work}

Kopie zapasowe są uruchamiane automatycznie dla każdego podłączonego aliasu IMAP.  Serwer IMAP sprawdza wszystkie aktywne połączenia co godzinę i uruchamia kopię zapasową dla każdego podłączonego aliasu.  Mechanizm blokady oparty na Redis zapobiega uruchamianiu duplikatów kopii zapasowych w odstępie krótszym niż 30 minut, a faktyczna kopia zapasowa jest pomijana, jeśli pomyślna kopia została już wykonana w ciągu ostatnich 24 godzin (chyba że kopia została wyraźnie zażądana przez użytkownika do pobrania).
Kopie zapasowe można również wywołać ręcznie, klikając **"Download Backup"** dla dowolnego aliasu na pulpicie nawigacyjnym. Ręczne kopie zapasowe zawsze są wykonywane niezależnie od 24-godzinnego okna czasowego.

Proces tworzenia kopii zapasowej przebiega następująco:

1. Baza danych SQLite jest kopiowana za pomocą `VACUUM INTO`, co tworzy spójny zrzut bez przerywania aktywnych połączeń i zachowuje szyfrowanie bazy danych.
2. Plik kopii zapasowej jest weryfikowany poprzez jego otwarcie, aby potwierdzić, że szyfrowanie jest nadal ważne.
3. Obliczany jest skrót SHA-256 i porównywany z istniejącą kopią zapasową w magazynie. Jeśli skróty się zgadzają, przesyłanie jest pomijane (brak zmian od ostatniej kopii zapasowej).
4. Kopia zapasowa jest przesyłana do S3 za pomocą przesyłania wieloczęściowego przez bibliotekę [@aws-sdk/lib-storage](https://github.com/aws/aws-sdk-js-v3/tree/main/lib/lib-storage).
5. Generowany jest podpisany URL do pobrania (ważny przez 4 godziny), który jest wysyłany e-mailem do użytkownika.

#### Formaty kopii zapasowych {#backup-formats}

Obsługiwane są trzy formaty kopii zapasowych:

| Format   | Rozszerzenie | Opis                                                                       |
| -------- | ------------ | -------------------------------------------------------------------------- |
| `sqlite` | `.sqlite`    | Surowy zaszyfrowany zrzut bazy danych SQLite (domyślny dla automatycznych kopii IMAP) |
| `mbox`   | `.zip`       | Chroniony hasłem ZIP zawierający skrzynkę pocztową w formacie mbox          |
| `eml`    | `.zip`       | Chroniony hasłem ZIP zawierający pojedyncze pliki `.eml` dla każdej wiadomości |

> **Wskazówka:** Jeśli masz pliki kopii zapasowej `.sqlite` i chcesz przekonwertować je lokalnie na pliki `.eml`, użyj naszego samodzielnego narzędzia CLI **[convert-sqlite-to-eml](#how-do-i-convert-sqlite-backups-to-eml-files)**. Działa na Windows, Linux i macOS i nie wymaga połączenia z siecią.

#### Nazewnictwo plików i struktura kluczy {#file-naming-and-key-structure}

Podczas korzystania z **niestandardowego magazynu S3**, pliki kopii zapasowych są przechowywane z prefiksem znacznika czasu w formacie [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601), dzięki czemu każda kopia jest zachowywana jako osobny obiekt. Daje to pełną historię kopii zapasowych w Twoim własnym koszu.

Format klucza to:

```
{ISO 8601 timestamp}-{alias_id}.{extension}
```

Na przykład:

```
2025-03-01T12:00:00.000Z-65a31c53c36b75ed685f3fda.sqlite
2025-03-01T12:00:00.000Z-65a31c53c36b75ed685f3fda.zip
2025-03-02T12:00:00.000Z-65a31c53c36b75ed685f3fda.sqlite
```

`alias_id` to MongoDB ObjectId aliasu. Możesz go znaleźć na stronie ustawień aliasu lub przez API.

Podczas korzystania z **domyślnego (systemowego) magazynu**, klucz jest płaski (np. `65a31c53c36b75ed685f3fda.sqlite`) i każda kopia nadpisuje poprzednią.

> **Uwaga:** Ponieważ niestandardowy magazyn S3 zachowuje wszystkie wersje kopii zapasowych, zużycie przestrzeni będzie rosło z czasem. Zalecamy skonfigurowanie [zasad cyklu życia](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html) w Twoim koszu, aby automatycznie usuwać stare kopie zapasowe (np. usuwać obiekty starsze niż 30 lub 90 dni).

#### Własność danych i polityka usuwania {#data-ownership-and-deletion-policy}

Twój niestandardowy kosz S3 jest całkowicie pod Twoją kontrolą. My **nigdy nie usuwamy ani nie modyfikujemy** plików w Twoim niestandardowym koszu S3 — ani gdy alias zostanie usunięty, ani gdy domena zostanie usunięta, ani podczas jakichkolwiek operacji porządkowych. Zapisujemy tylko nowe pliki kopii zapasowych do Twojego kosza.

Oznacza to:

* **Usunięcie aliasu** — Gdy usuwasz alias, usuwamy kopię zapasową tylko z naszego domyślnego systemowego magazynu. Wszelkie kopie wcześniej zapisane w Twoim niestandardowym koszu S3 pozostają nienaruszone.
* **Usunięcie domeny** — Usunięcie domeny nie wpływa na pliki w Twoim niestandardowym koszu.
* **Zarządzanie retencją** — Jesteś odpowiedzialny za zarządzanie przestrzenią w swoim koszu, w tym za konfigurowanie zasad cyklu życia do usuwania starych kopii zapasowych.

Jeśli wyłączysz niestandardowy magazyn S3 lub przełączysz się z powrotem na nasz domyślny magazyn, istniejące pliki w Twoim koszu zostaną zachowane. Przyszłe kopie zapasowe będą po prostu zapisywane w naszym domyślnym magazynie.

#### Bezpieczeństwo {#security}

* Twój identyfikator klucza dostępu i tajny klucz dostępu są **szyfrowane w spoczynku** za pomocą [AES-256-GCM](https://en.wikipedia.org/wiki/Galois/Counter_Mode) przed zapisaniem w naszej bazie danych. Są odszyfrowywane tylko podczas działania, gdy wykonywane są operacje tworzenia kopii zapasowej.
* Automatycznie weryfikujemy, że Twój kosz **nie jest publicznie dostępny**. Jeśli wykryjemy publiczny kosz, konfiguracja zostanie odrzucona podczas zapisu. Jeśli podczas tworzenia kopii zapasowej wykryjemy publiczny dostęp, wracamy do naszego domyślnego magazynu i powiadamiamy wszystkich administratorów domeny e-mailem.
* Poświadczenia są weryfikowane podczas zapisu za pomocą wywołania [HeadBucket](https://docs.aws.amazon.com/AmazonS3/latest/API/API_HeadBucket.html), aby upewnić się, że kosz istnieje i poświadczenia są poprawne. Jeśli weryfikacja się nie powiedzie, niestandardowy magazyn S3 jest automatycznie wyłączany.
* Każdy plik kopii zapasowej zawiera skrót SHA-256 w metadanych S3, który jest używany do wykrywania niezmienionych baz danych i pomijania zbędnych przesłań.
#### Powiadomienia o błędach {#error-notifications}

Jeśli kopia zapasowa nie powiedzie się podczas korzystania z niestandardowego magazynu S3 (np. z powodu wygasłych poświadczeń lub problemu z łącznością), wszyscy administratorzy domeny zostaną powiadomieni e-mailem. Powiadomienia te są ograniczone do jednej wiadomości na 6 godzin, aby zapobiec duplikatom alertów. Jeśli podczas tworzenia kopii zapasowej wykryto, że Twój bucket jest publicznie dostępny, administratorzy zostaną powiadomieni raz dziennie.

#### API {#api}

Możesz również skonfigurować niestandardowy magazyn S3 za pomocą API:

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

Aby przetestować połączenie za pomocą API:

```sh
curl -X POST https://api.forwardemail.net/v1/domains/example.com/test-s3-connection \
  -u API_TOKEN:
```

### Jak przekonwertować kopie zapasowe SQLite na pliki EML {#how-do-i-convert-sqlite-backups-to-eml-files}

Jeśli pobierasz lub przechowujesz kopie zapasowe SQLite (zarówno z naszego domyślnego magazynu, jak i z własnego [niestandardowego bucketu S3](#how-do-i-use-my-own-s3-compatible-storage-for-backups)), możesz przekonwertować je na standardowe pliki `.eml` za pomocą naszego samodzielnego narzędzia CLI **[convert-sqlite-to-eml](https://github.com/forwardemail/forwardemail.net/tree/master/tools/convert-sqlite-to-eml)**. Pliki EML można otworzyć w dowolnym kliencie poczty ([Thunderbird](https://www.thunderbird.net/), [Outlook](https://www.microsoft.com/en-us/microsoft-365/outlook/email-and-calendar-software-microsoft-outlook), [Apple Mail](https://support.apple.com/mail) itd.) lub zaimportować do innych serwerów pocztowych.

#### Instalacja {#installation-1}

Możesz pobrać gotowy plik binarny (nie wymaga [Node.js](https://github.com/nodejs/node)) lub uruchomić go bezpośrednio za pomocą [Node.js](https://github.com/nodejs/node):

**Gotowe pliki binarne** — Pobierz najnowsze wydanie dla swojej platformy z [GitHub Releases](https://github.com/forwardemail/forwardemail.net/releases):

| Platforma | Architektura  | Plik                                 |
| -------- | ------------- | ------------------------------------ |
| Linux    | x64           | `convert-sqlite-to-eml-linux-x64`    |
| Linux    | arm64         | `convert-sqlite-to-eml-linux-arm64`  |
| macOS    | Apple Silicon | `convert-sqlite-to-eml-darwin-arm64` |
| Windows  | x64           | `convert-sqlite-to-eml-win-x64.exe`  |

> **Użytkownicy macOS:** Po pobraniu może być konieczne usunięcie atrybutu kwarantanny przed uruchomieniem pliku binarnego:
>
> ```bash
> sudo xattr -rd com.apple.quarantine ./convert-sqlite-to-eml-darwin-arm64
> ```
>
> (Zamień `./convert-sqlite-to-eml-darwin-arm64` na rzeczywistą ścieżkę do pobranego pliku.)

> **Użytkownicy Linux:** Po pobraniu może być konieczne nadanie plikowi binarnemu uprawnień do wykonywania:
>
> ```bash
> chmod +x ./convert-sqlite-to-eml-linux-x64
> ```
>
> (Zamień `./convert-sqlite-to-eml-linux-x64` na rzeczywistą ścieżkę do pobranego pliku.)

**Ze źródła** (wymaga [Node.js](https://github.com/nodejs/node) >= 18):

```bash
cd tools/convert-sqlite-to-eml
npm install
node index.js
```

#### Użycie {#usage}

Narzędzie obsługuje tryb interaktywny i nieinteraktywny.

**Tryb interaktywny** — uruchom bez argumentów, a zostaniesz poproszony o podanie wszystkich danych:

```bash
./convert-sqlite-to-eml
```

```
  Forward Email - Konwersja kopii zapasowej SQLite na EML
  =============================================

  Ścieżka do pliku kopii zapasowej SQLite: /path/to/backup.sqlite
  Hasło IMAP/aliasu: ********
  Ścieżka wyjściowa ZIP [/path/to/backup-2025-03-01T12-00-00-000Z.zip]:
```

**Tryb nieinteraktywny** — przekaż argumenty za pomocą flag wiersza poleceń do skryptów i automatyzacji:

```bash
./convert-sqlite-to-eml \
  --path /path/to/backup.sqlite \
  --password "your-imap-password" \
  --output /path/to/output.zip
```

| Flaga                | Opis                                                                          |
| ------------------- | ------------------------------------------------------------------------------ |
| `--path <path>`     | Ścieżka do zaszyfrowanego pliku kopii zapasowej SQLite                         |
| `--password <pass>` | Hasło IMAP/aliasu do odszyfrowania                                            |
| `--output <path>`   | Ścieżka wyjściowa dla pliku ZIP (domyślnie: automatycznie generowana z timestampem ISO 8601) |
| `--help`            | Pokaż komunikat pomocy                                                        |
#### Format wyjściowy {#output-format}

Narzędzie generuje archiwum ZIP chronione hasłem (szyfrowane AES-256), zawierające:

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

Pliki EML są zorganizowane według folderów skrzynki pocztowej. Hasło do ZIP jest takie samo jak Twoje hasło IMAP/aliasu. Każdy plik `.eml` to standardowa wiadomość e-mail zgodna z [RFC 5322](https://datatracker.ietf.org/doc/html/rfc5322) z pełnymi nagłówkami, treścią i załącznikami odtworzonymi z bazy danych SQLite.

#### Jak to działa {#how-it-works}

1. Otwiera zaszyfrowaną bazę danych SQLite za pomocą Twojego hasła IMAP/aliasu (obsługuje szyfry [ChaCha20](https://en.wikipedia.org/wiki/ChaCha20-Poly1305) oraz [AES-256-CBC](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard)).
2. Odczytuje tabelę Mailboxes, aby poznać strukturę folderów.
3. Dla każdej wiadomości dekoduje mimeTree (przechowywane jako skompresowany JSON za pomocą [Brotli](https://github.com/google/brotli)) z tabeli Messages.
4. Odtwarza pełny plik EML, przechodząc po drzewie MIME i pobierając treści załączników z tabeli Attachments.
5. Pakuje wszystko do archiwum ZIP chronionego hasłem, używając [archiver-zip-encrypted](https://github.com/artem-silaev/archiver-zip-encrypted).

### Czy wspieracie samodzielne hostowanie {#do-you-support-self-hosting}

Tak, od marca 2025 roku wspieramy opcję samodzielnego hostowania. Przeczytaj wpis na blogu [tutaj](https://forwardemail.net/blog/docs/self-hosted-solution). Zapoznaj się z [przewodnikiem dla samodzielnego hostowania](https://forwardemail.net/self-hosted), aby zacząć. Dla zainteresowanych bardziej szczegółową wersją krok po kroku mamy nasze przewodniki oparte na [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) lub [Debian](https://forwardemail.net/guides/selfhosted-on-debian).

## Konfiguracja e-mail {#email-configuration}

### Jak zacząć i skonfigurować przekazywanie e-maili {#how-do-i-get-started-and-set-up-email-forwarding}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Szacowany czas konfiguracji:</strong>
  <span>Mniej niż 10 minut</span>
</div>

<div class="alert my-3 alert-success">
  <i class="fa fa-bullhorn font-weight-bold"></i>
  <strong class="font-weight-bold">
    Rozpoczęcie:
  </strong>
  <span>
    Uważnie przeczytaj i wykonaj kroki od pierwszego do ósmego podane poniżej. Upewnij się, że zastąpiłeś adres e-mail <code>user@gmail.com</code> adresem, na który chcesz przekazywać wiadomości (jeśli nie jest już poprawny). Podobnie upewnij się, że zastąpiłeś <code>example.com</code> swoją własną nazwą domeny (jeśli nie jest już poprawna).
  </span>
</div>

<ol>
  <li class="mb-2 mb-md-3 mb-lg-5">Jeśli już zarejestrowałeś swoją nazwę domeny gdzieś indziej, musisz całkowicie pominąć ten krok i przejść do kroku drugiego! W przeciwnym razie możesz <a href="/domain-registration" rel="noopener noreferrer">kliknąć tutaj, aby zarejestrować swoją domenę</a>.</li>
  <li class="mb-2 mb-md-3 mb-lg-5">
  Czy pamiętasz, gdzie zarejestrowałeś swoją domenę? Gdy już to sobie przypomnisz, postępuj zgodnie z poniższymi instrukcjami:

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Ważne:
  </strong>
  <span>
    Musisz otworzyć nową kartę i zalogować się do swojego rejestratora domen. Możesz łatwo kliknąć na swój "Rejestrator" poniżej, aby to zrobić automatycznie. W tej nowej karcie musisz przejść do strony zarządzania DNS u swojego rejestratora – poniżej w kolumnie "Kroki konfiguracji" podaliśmy krok po kroku, jak to zrobić. Gdy już znajdziesz się na tej stronie w nowej karcie, możesz wrócić do tej karty i przejść do kroku trzeciego poniżej.
    <strong class="font-weight-bold">Nie zamykaj jeszcze otwartej karty; będzie Ci potrzebna w kolejnych krokach!</strong>
  </span>
</div>

<table id="table-dns-management-by-registrar" class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Rejestrator</th>
      <th>Kroki konfiguracji</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://login.ionos.com/">1&amp;1</a></td>
      <td>Zaloguj się <i class="fa fa-angle-right"></i> Centrum domen <i class="fa fa-angle-right"></i> (Wybierz swoją domenę) <i class="fa fa-angle-right"></i> Edytuj ustawienia DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon Route 53</a></td>
      <td>Zaloguj się <i class="fa fa-angle-right"></i> Hosted Zones <i class="fa fa-angle-right"></i> (Wybierz swoją domenę)</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>
      <td>Zaloguj się <i class="fa fa-angle-right"></i> Moje serwery <i class="fa fa-angle-right"></i> Zarządzanie domeną <i class="fa fa-angle-right"></i> Menedżer DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.bluehost.com/help/article/dns-management-add-edit-or-delete-dns-entries">Bluehost</a></td>
      <td>DLA ROCK: Zaloguj się <i class="fa fa-angle-right"></i> Domeny <i class="fa fa-angle-right"></i> (Kliknij ikonę ▼ obok zarządzania) <i class="fa fa-angle-right"></i> DNS
      <br />
      DLA LEGACY: Zaloguj się <i class="fa fa-angle-right"></i> Domeny <i class="fa fa-angle-right"></i> Edytor strefy <i class="fa fa-angle-right"></i> (Wybierz swoją domenę)</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://dash.cloudflare.com/login">Cloudflare</a></td>
      <td>Zaloguj się <i class="fa fa-angle-right"></i> DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://cp.dnsmadeeasy.com/">DNS Made Easy</a></td>
      <td>Zaloguj się <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> (Wybierz swoją domenę)</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://dnsimple.com/dashboard">DNSimple</a></td>
      <td>Zaloguj się <i class="fa fa-angle-right"></i> (Wybierz swoją domenę)  <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> Zarządzaj</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://cloud.digitalocean.com/login">Digital Ocean</a></td>
      <td>Zaloguj się <i class="fa fa-angle-right"></i> Networking <i class="fa fa-angle-right"></i> Domeny <i class="fa fa-angle-right"></i> (Wybierz swoją domenę) <i class="fa fa-angle-right"></i> Więcej <i class="fa fa-angle-right"></i> Zarządzaj domeną</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.domain.com/help/article/dns-management-how-to-update-dns-records">Domain.com</a></td>
      <td>Zaloguj się <i class="fa fa-angle-right"></i> W widoku kart kliknij zarządzaj przy swojej domenie <i class="fa fa-angle-right"></i> W widoku listy kliknij ikonę koła zębatego <i class="fa fa-angle-right"></i> DNS i serwery nazw <i class="fa fa-angle-right"></i> Rekordy DNS</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://www.domains.com/">Domains.com</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=WnU0Gp-Y-es"><i class="fa fa-play-circle"></i> Oglądaj</a>
      </td>
      <td>Zaloguj się <i class="fa fa-angle-right"></i> (Wybierz swoją domenę) <i class="fa fa-angle-right"></i> Zarządzaj <i class="fa fa-angle-right"></i> (kliknij ikonę koła zębatego) <i class="fa fa-angle-right"></i> Kliknij na DNS i serwery nazw w menu po lewej</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://panel.dreamhost.com/">DreamHost</a></td>
      <td>Zaloguj się <i class="fa fa-angle-right"></i> Panel <i class="fa fa-angle-right"></i> Domeny <i class="fa fa-angle-right"></i> Zarządzaj domenami <i class="fa fa-angle-right"></i> DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://portal.dynect.net/login/">Dyn</a></td>
      <td>Zaloguj się <i class="fa fa-angle-right"></i> Przegląd <i class="fa fa-angle-right"></i> Zarządzaj <i class="fa fa-angle-right"></i> Prosty edytor <i class="fa fa-angle-right"></i> Rekordy</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://id.gandi.net/en/login">Gandi</a></td>
      <td>Zaloguj się <i class="fa fa-angle-right"></i> (Wybierz swoją domenę) <i class="fa fa-angle-right"></i> Zarządzanie <i class="fa fa-angle-right"></i> Edytuj strefę</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://sso.godaddy.com">GoDaddy</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=G7g8FiZL5D8"><i class="fa fa-play-circle"></i> Oglądaj</a>
      </td>
      <td>Zaloguj się <i class="fa fa-angle-right"></i> Zarządzaj moimi domenami <i class="fa fa-angle-right"></i> (Wybierz swoją domenę) <i class="fa fa-angle-right"></i> Zarządzaj DNS</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://domains.google.com/registrar">Google Domains</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=01iHjbIN5CQ"><i class="fa fa-play-circle"></i> Oglądaj</a>
      </td>
      <td>Zaloguj się <i class="fa fa-angle-right"></i> (Wybierz swoją domenę) <i class="fa fa-angle-right"></i> Konfiguruj DNS</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://www.namecheap.com/myaccount/login/">Namecheap</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=no62GCzMn7E"><i class="fa fa-play-circle"></i> Oglądaj</a>
      </td>
      <td>Zaloguj się <i class="fa fa-angle-right"></i> Lista domen <i class="fa fa-angle-right"></i> (Wybierz swoją domenę) <i class="fa fa-angle-right"></i> Zarządzaj <i class="fa fa-angle-right"></i> Zaawansowany DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://app.netlify.com/">Netlify</a></td>
      <td>Zaloguj się <i class="fa fa-angle-right"></i> (Wybierz swoją domenę) <i class="fa fa-angle-right"></i> Skonfiguruj Netlify DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.networksolutions.com/manage-it/index.jsp">Network Solutions</a></td>
      <td>Zaloguj się <i class="fa fa-angle-right"></i> Menedżer konta <i class="fa fa-angle-right"></i> Moje nazwy domen <i class="fa fa-angle-right"></i> (Wybierz swoją domenę) <i class="fa fa-angle-right"></i> Zarządzaj <i class="fa fa-angle-right"></i> Zmień miejsce wskazywania domeny <i class="fa fa-angle-right"></i> Zaawansowany DNS</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://accounts.shopify.com/store-login">Shopify</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=G1NR8CIdv2M"><i class="fa fa-play-circle"></i> Oglądaj</a>
      </td>
      <td>Zaloguj się <i class="fa fa-angle-right"></i> Zarządzane domeny <i class="fa fa-angle-right"></i> (Wybierz swoją domenę) <i class="fa fa-angle-right"></i> Ustawienia DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://support.squarespace.com/hc/en-us/articles/214767107">Squarespace</a></td>
      <td>Zaloguj się <i class="fa fa-angle-right"></i> Menu główne <i class="fa fa-angle-right"></i> Ustawienia <i class="fa fa-angle-right"></i> Domeny <i class="fa fa-angle-right"></i> (Wybierz swoją domenę) <i class="fa fa-angle-right"></i>
Zaawansowane ustawienia <i class="fa fa-angle-right"></i> Rekordy niestandardowe</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://vercel.com/docs/now-cli?utm_source=zeit-dashboard&utm_medium=web&utm_campaign=configure-dns#commands/dns">Vercel's Now</a></td>
      <td>Używając CLI "now" <i class="fa fa-angle-right"></i> <code>now dns add [domain] '@' MX [record-value] [priority]</code></td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.weebly.com/app/help/us/en/topics/manage-dns-records">Weebly</a></td>
      <td>Zaloguj się <i class="fa fa-angle-right"></i> Strona domen <i class="fa fa-angle-right"></i> (Wybierz swoją domenę) <i class="fa fa-angle-right"></i> DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://support.wix.com/en/article/adding-dns-records-in-your-wix-account">Wix</a></td>
      <td>Zaloguj się <i class="fa fa-angle-right"></i> Strona domen <i class="fa fa-angle-right"></i> (Kliknij ikonę <i class="fa fa-ellipsis-h"></i>) <i class="fa fa-angle-right"></i> Wybierz Zarządzaj rekordami DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.enom.com/login.aspx?page=%2fmyaccount%2fdefault.aspx&amp;">eNom</a></td>
      <td>Zaloguj się <i class="fa fa-angle-right"></i> Domeny <i class="fa fa-angle-right"></i> Moje domeny</td>
    </tr>
    <tr>
      <td>Inne</td>
      <td>
        <div class="alert mb-0 alert-warning"><i class="fa fa-exclamation-circle font-weight-bold"></i> <strong class="font-weight-bold">Ważne:</strong> Nie widzisz tutaj nazwy swojego rejestratora? Po prostu wyszukaj w Internecie "jak zmienić rekordy DNS na $REGISTRAR" (zastępując $REGISTRAR nazwą swojego rejestratora – np. "jak zmienić rekordy DNS na GoDaddy", jeśli używasz GoDaddy).</div>
      </td>
    </tr>
  </tbody>
</table>
</li>
<li class="mb-2 mb-md-3 mb-lg-5">Korzystając ze strony zarządzania DNS swojego rejestratora (tej drugiej otwartej karty), ustaw następujące rekordy "MX":</li>
<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Ważne:
  </strong>
  <span>
    Zwróć uwagę, że NIE powinno być ustawionych innych rekordów MX. Oba poniższe rekordy MUSZĄ istnieć. Upewnij się, że nie ma literówek; oraz że masz poprawnie zapisane zarówno mx1, jak i mx2. Jeśli istniały już rekordy MX, usuń je całkowicie.
    Wartość "TTL" nie musi wynosić 3600, może być niższa lub wyższa, jeśli to konieczne.
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nazwa/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Priorytet</th>
      <th>Odpowiedź/Wartość</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", lub puste</em></td>
      <td class="text-center">3600</td>
      <td>MX</td>
      <td>0</td>
      <td><code>mx1.forwardemail.net</code></td>
    </tr>
    <tr>
      <td><em>"@", ".", lub puste</em></td>
      <td class="text-center">3600</td>
      <td>MX</td>
      <td>0</td>
      <td><code>mx2.forwardemail.net</code></td>
    </tr>
  </tbody>
</table>

</li><li class="mb-2 mb-md-3 mb-lg-5" id="dns-configuration-options">Korzystając ze strony zarządzania DNS u swojego rejestratora (druga otwarta karta), ustaw następujące rekord(y) <strong class="notranslate">TXT</strong>:

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Ważne:
  </strong>
  <span>
    Jeśli korzystasz z płatnego planu, musisz całkowicie pominąć ten krok i przejść do kroku piątego! Jeśli nie masz płatnego planu, Twoje przekierowane adresy będą publicznie wyszukiwalne – przejdź do <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Moje konto <i class="fa fa-angle-right"></i> Domeny</a> i jeśli chcesz, uaktualnij swoją domenę do płatnego planu. Jeśli chcesz dowiedzieć się więcej o płatnych planach, zobacz naszą stronę <a rel="noopener noreferrer" href="/private-business-email" class="alert-link">Cennik</a>. W przeciwnym razie możesz kontynuować, wybierając jedną lub więcej kombinacji z opcji od A do F wymienionych poniżej.
  </span>
</div>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Opcja A:
  </strong>
  <span>
    Jeśli przekierowujesz wszystkie e-maile ze swojej domeny (np. "all@example.com", "hello@example.com" itd.) na konkretny adres "user@gmail.com":
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nazwa/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Odpowiedź/Wartość</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", lub puste</em></td>
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
    Wskazówka:
  </strong>
  <span>
    Upewnij się, że zastąpiłeś powyższe wartości w kolumnie "Wartość" swoim własnym adresem e-mail. Wartość "TTL" nie musi wynosić 3600, może być niższa lub wyższa, jeśli to konieczne. Niższa wartość czasu życia ("TTL") zapewni szybsze propagowanie przyszłych zmian w rekordach DNS w Internecie – pomyśl o tym jak o czasie, przez jaki będzie przechowywana w pamięci podręcznej (w sekundach). Możesz dowiedzieć się więcej o <a href="https://en.wikipedia.org/wiki/Time_to_live#DNS_records" rel="noopener noreferrer" target="_blank" class="alert-link">TTL na Wikipedii</a>.
  </span>
</div>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Opcja B:
  </strong>
  <span>
    Jeśli chcesz przekierować tylko pojedynczy adres e-mail (np. <code>hello@example.com</code> na <code>user@gmail.com</code>; spowoduje to również automatyczne przekierowanie "hello+test@example.com" na "user+test@gmail.com"):
  </span>
</div>
<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nazwa/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Odpowiedź/Wartość</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", lub puste</em></td>
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
    Opcja C:
  </strong>
  <span>
    Jeśli przekierowujesz wiele adresów e-mail, powinieneś je oddzielić przecinkiem:
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nazwa/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Odpowiedź/Wartość</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", lub puste</em></td>
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
    Opcja D:
  </strong>
  <span>
    Możesz ustawić nieskończoną liczbę przekierowań e-mail – upewnij się tylko, że pojedyncza linia nie przekracza 255 znaków i każda linia zaczyna się od "forward-email=". Poniżej znajduje się przykład:
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nazwa/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Odpowiedź/Wartość</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", lub puste</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=hello:user@gmail.com,support:user@gmail.com</code>
      </td>
    </tr>
    <tr>
      <td><em>"@", ".", lub puste</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=help:user@gmail.com,foo:user@gmail.com</code>
      </td>
    </tr>
    <tr>
      <td><em>"@", ".", lub puste</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=orders:user@gmail.com,baz:user@gmail.com</code>
      </td>
    </tr>
    <tr>
      <td><em>"@", ".", lub puste</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td>
        <code>forward-email=info:user@gmail.com,beep:user@gmail.com</code>
      </td>
    </tr>
    <tr>
      <td><em>"@", ".", lub puste</em></td>
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
    Opcja E:
  </strong>
  <span>
    Możesz również określić nazwę domeny w swoim rekordzie <strong class="notranslate">TXT</strong>, aby mieć globalne przekierowanie aliasów (np. "user@example.com" zostanie przekierowany na "user@example.net"):
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nazwa/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Odpowiedź/Wartość</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", lub puste</em></td>
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
    Opcja F:
  </strong>
  <span>
    Możesz nawet używać webhooków jako globalnego lub indywidualnego aliasu do przekierowywania e-maili. Zobacz przykład i pełną sekcję o webhookach zatytułowaną <a href="#do-you-support-webhooks" class="alert-link">Czy wspieracie webhooki</a> poniżej.
  </span>
</div>
<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nazwa/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Odpowiedź/Wartość</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", lub puste</em></td>
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
    Opcja G:
  </strong>
  <span>
    Możesz nawet używać wyrażeń regularnych ("regex") do dopasowywania aliasów i obsługi podstawień do których mają być przekazywane e-maile. Zobacz przykłady i pełną sekcję o regex zatytułowaną <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">Czy obsługujecie wyrażenia regularne lub regex</a> poniżej.
  </span>
</div>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Potrzebujesz zaawansowanego regex z podstawieniami?</strong> Zobacz przykłady i pełną sekcję o regex zatytułowaną <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">Czy obsługujecie wyrażenia regularne lub regex</a> poniżej.
</div>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Prosty przykład:</strong> Jeśli chcę, aby wszystkie e-maile wysyłane na `linus@example.com` lub `torvalds@example.com` były przekazywane na `user@gmail.com`:
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nazwa/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Odpowiedź/Wartość</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", lub puste</em></td>
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
    Ważne:
  </strong>
  <span>
    Reguły przekazywania catch-all można również opisać jako "fall-through" (przechodzenie dalej).
    Oznacza to, że przychodzące e-maile, które pasują do co najmniej jednej konkretnej reguły przekazywania, będą używane zamiast catch-all.
    Konkretne reguły obejmują adresy e-mail i wyrażenia regularne.
    <br /><br />
    Na przykład:
    <br />
    <code>forward-email=hello:first@gmail.com,second@gmail.com</code>
    <br />
    E-maile wysłane na <code>hello@example.com</code> **nie** będą przekazywane na <code>second@gmail.com</code> (catch-all) z tą konfiguracją, a zamiast tego zostaną dostarczone tylko do <code>first@gmail.com</code>.
  </span>
</div>

---

</li><li class="mb-2 mb-md-3 mb-lg-5">Korzystając ze strony zarządzania DNS u swojego rejestratora (drugiej otwartej zakładki), dodatkowo ustaw następujący rekord <strong class="notranslate">TXT</strong>:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nazwa/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Odpowiedź/Wartość</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", lub puste</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>v=spf1 a include:spf.forwardemail.net -all</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Ważne:
  </strong>
  <span>
    Jeśli używasz Gmaila (np. Wyślij jako) lub G Suite, musisz dodać <code>include:_spf.google.com</code> do powyższej wartości, na przykład:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
  </span>
</div>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Wskazówka:
  </strong>
  <span>
    Jeśli masz już podobną linię z "v=spf1", musisz dodać <code>include:spf.forwardemail.net</code> tuż przed istniejącymi rekordami "include:host.com" i przed "-all" w tej samej linii, na przykład:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
    <br /><br />
    Zwróć uwagę, że istnieje różnica między "-all" a "~all". "-" oznacza, że sprawdzenie SPF powinno NIE POWIEŚĆ SIĘ, jeśli nie pasuje, a "~" oznacza, że sprawdzenie SPF powinno mieć SOFTFAIL. Zalecamy używanie podejścia "-all", aby zapobiec fałszowaniu domeny.
    <br /><br />
    Możesz również potrzebować dołączyć rekord SPF dla hosta, z którego wysyłasz pocztę (np. Outlook).
  </span>
</div>
</li><li class="mb-2 mb-md-3 mb-lg-5">Zweryfikuj swoje rekordy DNS za pomocą naszego narzędzia "Verify Records" dostępnego w <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Moje konto <i class="fa fa-angle-right"></i> Domeny</a> <i class="fa fa-angle-right"></i> Konfiguracja.

</li><li class="mb-2 mb-md-3 mb-lg-5">Wyślij testowy e-mail, aby potwierdzić, że działa.  Zauważ, że propagacja rekordów DNS może zająć trochę czasu.

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Wskazówka:
  </strong>
  <span>
  </span>
    Jeśli nie otrzymujesz testowych e-maili lub otrzymujesz testowy e-mail z komunikatem "Uważaj na tę wiadomość", zobacz odpowiedzi na <a href="#why-am-i-not-receiving-my-test-emails" class="alert-link">Dlaczego nie otrzymuję moich testowych e-maili</a> oraz <a href="#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious" class="alert-link">Dlaczego moje testowe e-maile wysłane do mnie w Gmailu są oznaczane jako "podejrzane"</a>.
</div>

</li><li class="mb-2 mb-md-3 mb-lg-5">Jeśli chcesz "Wysyłać pocztę jako" z Gmaila, musisz <strong><a href="https://www.youtube.com/watch?v=MEheS8gM4Xs" target="_blank" rel="noopener noreferrer">obejrzeć ten film</a></strong> lub postępować zgodnie z krokami w sekcji <a href="#how-to-send-mail-as-using-gmail">Jak wysyłać pocztę jako za pomocą Gmaila</a> poniżej.

</li></ol>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Gratulacje!
    </strong>
    <span>
      Pomyślnie ukończyłeś wszystkie kroki.
    </span>
  </div>
</div>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Wskazówka:
  </strong>
  <span>
    Poniżej znajdują się opcjonalne dodatki. Zwróć uwagę, że te dodatki są całkowicie opcjonalne i mogą nie być konieczne. Chcieliśmy przynajmniej dostarczyć Ci dodatkowych informacji, jeśli zajdzie taka potrzeba.
  </span>
</div>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Opcjonalny dodatek:
  </strong>
  <span>
    Jeśli korzystasz z funkcji <a class="alert-link" href="#how-to-send-mail-as-using-gmail">Jak wysyłać pocztę jako za pomocą Gmaila</a>, możesz chcieć dodać siebie do listy dozwolonych. Zobacz <a class="alert-link" href="https://support.google.com/a/answer/60752?hl=en" target="_blank" rel="noopener noreferrer">te instrukcje Gmaila</a> na ten temat.
  </span>
</div>

### Czy mogę używać wielu wymian MX i serwerów do zaawansowanego przekazywania {#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding}

Tak, ale **w rekordach DNS powinien być wymieniony tylko jeden serwer MX**.

Nie próbuj używać "Priorytetu" jako sposobu konfiguracji wielu serwerów MX.

Zamiast tego musisz skonfigurować istniejący serwer MX tak, aby przekazywał pocztę dla wszystkich aliasów niepasujących do naszych serwerów (`mx1.forwardemail.net` i/lub `mx2.forwardemail.net`).

Jeśli korzystasz z Google Workspace i chcesz przekazywać wszystkie aliasy niepasujące do naszej usługi, zobacz <https://support.google.com/a/answer/6297084>.

Jeśli korzystasz z Microsoft 365 (Outlook) i chcesz przekazywać wszystkie aliasy niepasujące do naszej usługi, zobacz <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/use-connectors-to-configure-mail-flow/set-up-connectors-to-route-mail> oraz <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/manage-mail-flow-for-multiple-locations>.

### Jak ustawić autoresponder urlopowy (automatyczną odpowiedź poza biurem) {#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder}

Przejdź do <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Moje konto <i class="fa fa-angle-right"></i> Domeny</a> <i class="fa fa-angle-right"></i> Aliasy i utwórz lub edytuj alias, dla którego chcesz skonfigurować autoresponder urlopowy.
Masz możliwość skonfigurowania daty rozpoczęcia, daty zakończenia, tematu i wiadomości oraz włączania lub wyłączania tego w dowolnym momencie:

* Obecnie obsługiwane są tematy i wiadomości w formacie tekstowym (używamy wewnętrznie pakietu `striptags` do usuwania wszelkiego HTML).
* Temat jest ograniczony do 100 znaków.
* Wiadomość jest ograniczona do 1000 znaków.
* Konfiguracja wymaga ustawienia Outbound SMTP (np. konieczne będzie skonfigurowanie rekordów DNS DKIM, DMARC i Return-Path).
  * Przejdź do <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Moje konto <i class="fa fa-angle-right"></i> Domeny</a> <i class="fa fa-angle-right"></i> Ustawienia <i class="fa fa-angle-right"></i> Konfiguracja Outbound SMTP i postępuj zgodnie z instrukcjami konfiguracji.
* Odpowiedź wakacyjna nie może być włączona na globalnych domenach vanity (np. [adresy jednorazowe](/disposable-addresses) nie są obsługiwane).
* Odpowiedź wakacyjna nie może być włączona dla aliasów z symbolem wieloznacznym/catch-all (`*`) ani wyrażeń regularnych.

W przeciwieństwie do systemów pocztowych takich jak `postfix` (np. używających rozszerzenia filtra vacation `sieve`) – Forward Email automatycznie dodaje Twój podpis DKIM, zabezpiecza przed problemami z połączeniem podczas wysyłania odpowiedzi wakacyjnych (np. z powodu powszechnych problemów z połączeniem SSL/TLS i starszych serwerów), a nawet obsługuje Open WKD i szyfrowanie PGP dla odpowiedzi wakacyjnych.

<!--
* Aby zapobiec nadużyciom, za każdą wysłaną wiadomość odpowiedzi wakacyjnej zostanie odjęty 1 kredyt SMTP wychodzącego.
  * Wszystkie płatne konta domyślnie zawierają 300 kredytów dziennie. Jeśli potrzebujesz większej ilości, skontaktuj się z nami.
-->

1. Wysyłamy tylko raz na 4 dni do każdego [dozwolonego](#do-you-have-an-allowlist) nadawcy.

   * Nasza pamięć podręczna Redis używa odcisku palca `alias_id` i `sender`, gdzie `alias_id` to identyfikator aliasu w MongoDB, a `sender` to adres From (jeśli jest dozwolony) lub domena główna w adresie From (jeśli nie jest dozwolony). Dla uproszczenia czas wygaśnięcia tego odcisku w pamięci podręcznej ustawiono na 4 dni.

   * Nasze podejście polegające na użyciu domeny głównej wyodrębnionej z adresu From dla nadawców niedozwolonych zapobiega nadużyciom ze strony stosunkowo nieznanych nadawców (np. złośliwych aktorów) zalewających wiadomościami odpowiedzi wakacyjnych.

2. Wysyłamy tylko wtedy, gdy MAIL FROM i/lub From nie jest puste i nie zawiera (bez rozróżniania wielkości liter) [nazwy użytkownika postmastera](#what-are-postmaster-addresses) (część przed @ w adresie e-mail).

3. Nie wysyłamy, jeśli oryginalna wiadomość zawierała którykolwiek z następujących nagłówków (bez rozróżniania wielkości liter):

   * Nagłówek `auto-submitted` z wartością różną od `no`.
   * Nagłówek `x-auto-response-suppress` z wartością `dr`, `autoreply`, `auto-reply`, `auto_reply` lub `all`.
   * Nagłówek `list-id`, `list-subscribe`, `list-unsubscribe`, `list-help`, `list-post`, `list-owner`, `list-archive`, `x-autoreply`, `x-autorespond` lub `x-auto-respond` (bez względu na wartość).
   * Nagłówek `precedence` z wartością `bulk`, `autoreply`, `auto-reply`, `auto_reply` lub `list`.

4. Nie wysyłamy, jeśli adres MAIL FROM lub From kończy się na `+donotreply`, `-donotreply`, `+noreply` lub `-noreply`.

5. Nie wysyłamy, jeśli część nazwy użytkownika adresu From to `mdaemon` i zawierał nagłówek `X-MDDSN-Message` (bez rozróżniania wielkości liter).

6. Nie wysyłamy, jeśli istniał nagłówek `content-type` o wartości `multipart/report` (bez rozróżniania wielkości liter).

### Jak skonfigurować SPF dla Forward Email {#how-do-i-set-up-spf-for-forward-email}

Korzystając ze strony zarządzania DNS u swojego rejestratora, ustaw następujący rekord <strong class="notranslate">TXT</strong>:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nazwa/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Odpowiedź/Wartość</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", lub puste</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>v=spf1 a include:spf.forwardemail.net -all</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Ważne:
  </strong>
  <span>
    Jeśli używasz Gmaila (np. funkcji Wyślij jako) lub G Suite, musisz dodać <code>include:_spf.google.com</code> do powyższej wartości, na przykład:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
  </span>
</div>
<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Ważne:
  </strong>
  <span>
    Jeśli korzystasz z Microsoft Outlook lub Live.com, musisz dodać <code>include:spf.protection.outlook.com</code> do swojego rekordu SPF <strong class="notranslate">TXT</strong>, na przykład:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:spf.protection.outlook.com -all</code>
  </span>
</div>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Wskazówka:
  </strong>
  <span>
    Jeśli masz już podobną linię z "v=spf1", musisz dodać <code>include:spf.forwardemail.net</code> tuż przed istniejącymi rekordami "include:host.com" i przed "-all" w tej samej linii, na przykład:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
    <br /><br />
    Zwróć uwagę, że istnieje różnica między "-all" a "~all". "-" oznacza, że sprawdzenie SPF powinno NIE POWIEŚĆ SIĘ, jeśli nie pasuje, a "~" oznacza, że sprawdzenie SPF powinno mieć SOFTFAIL. Zalecamy użycie podejścia "-all", aby zapobiec fałszowaniu domeny.
    <br /><br />
    Może być również konieczne uwzględnienie rekordu SPF dla hosta, z którego wysyłasz pocztę (np. Outlook).
  </span>
</div>

### Jak skonfigurować DKIM dla Forward Email {#how-do-i-set-up-dkim-for-forward-email}

Przejdź do <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Moje konto <i class="fa fa-angle-right"></i> Domeny</a> <i class="fa fa-angle-right"></i> Ustawienia <i class="fa fa-angle-right"></i> Konfiguracja SMTP wychodzącego i postępuj zgodnie z instrukcjami konfiguracji.

### Jak skonfigurować DMARC dla Forward Email {#how-do-i-set-up-dmarc-for-forward-email}

Przejdź do <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Moje konto <i class="fa fa-angle-right"></i> Domeny</a> <i class="fa fa-angle-right"></i> Ustawienia <i class="fa fa-angle-right"></i> Konfiguracja SMTP wychodzącego i postępuj zgodnie z instrukcjami konfiguracji.

### Jak przeglądać raporty DMARC {#how-do-i-view-dmarc-reports}

Forward Email oferuje kompleksowy panel raportów DMARC, który pozwala monitorować wydajność uwierzytelniania poczty dla wszystkich Twoich domen z jednego miejsca.

**Czym są raporty DMARC?**

Raporty DMARC (Domain-based Message Authentication, Reporting, and Conformance) to pliki XML wysyłane przez serwery odbierające pocztę, które informują, jak Twoje e-maile są uwierzytelniane. Raporty te pomagają zrozumieć:

* Ile wiadomości jest wysyłanych z Twojej domeny
* Czy te wiadomości przechodzą uwierzytelnianie SPF i DKIM
* Jakie działania podejmują serwery odbierające (akceptują, kwarantanna lub odrzucają)
* Które adresy IP wysyłają pocztę w imieniu Twojej domeny

**Jak uzyskać dostęp do raportów DMARC**

Przejdź do <a href="/my-account/dmarc-reports" class="alert-link" target="_blank" rel="noopener noreferrer">Moje konto <i class="fa fa-angle-right"></i> Raporty DMARC</a>, aby zobaczyć swój panel. Możesz także uzyskać dostęp do raportów dla konkretnej domeny z <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Moje konto <i class="fa fa-angle-right"></i> Domeny</a>, klikając przycisk "DMARC" obok wybranej domeny.

**Funkcje panelu**

Panel raportów DMARC oferuje:

* **Podsumowanie metryk**: Łączna liczba otrzymanych raportów, liczba analizowanych wiadomości, wskaźnik zgodności SPF, wskaźnik zgodności DKIM oraz ogólny wskaźnik powodzenia
* **Wykres wiadomości w czasie**: Wizualny trend wolumenu poczty i wskaźników uwierzytelniania w ciągu ostatnich 30 dni
* **Podsumowanie zgodności**: Wykres pierścieniowy pokazujący rozkład zgodności SPF vs DKIM
* **Rozporządzenie wiadomości**: Wykres słupkowy pokazujący, jak serwery odbierające traktowały Twoje wiadomości (zaakceptowane, poddane kwarantannie lub odrzucone)
* **Tabela ostatnich raportów**: Szczegółowa lista pojedynczych raportów DMARC z możliwością filtrowania i paginacji
* **Filtrowanie domen**: Filtrowanie raportów według konkretnej domeny podczas zarządzania wieloma domenami
**Dlaczego to jest ważne**

Dla organizacji zarządzających wieloma domenami (takimi jak przedsiębiorstwa, organizacje non-profit czy agencje), raporty DMARC są niezbędne do:

* **Identyfikacji nieautoryzowanych nadawców**: Wykrywanie, czy ktoś podszywa się pod Twoją domenę
* **Poprawy dostarczalności**: Zapewnienie, że Twoje legalne e-maile przechodzą uwierzytelnianie
* **Monitorowania infrastruktury e-mailowej**: Śledzenie, które usługi i adresy IP wysyłają wiadomości w Twoim imieniu
* **Zgodności**: Utrzymanie widoczności uwierzytelniania e-maili na potrzeby audytów bezpieczeństwa

W przeciwieństwie do innych usług, które wymagają oddzielnych narzędzi do monitorowania DMARC, Forward Email zawiera przetwarzanie i wizualizację raportów DMARC jako część Twojego konta bez dodatkowych kosztów.

**Wymagania**

* Raporty DMARC są dostępne tylko dla planów płatnych
* Twoja domena musi mieć skonfigurowany DMARC (zobacz [Jak skonfigurować DMARC dla Forward Email](#how-do-i-set-up-dmarc-for-forward-email))
* Raporty są automatycznie zbierane, gdy serwery odbierające pocztę wysyłają je na skonfigurowany adres raportowania DMARC

**Cotygodniowe raporty e-mail**

Użytkownicy planów płatnych automatycznie otrzymują cotygodniowe podsumowania raportów DMARC drogą mailową. Te e-maile zawierają:

* Statystyki podsumowujące dla wszystkich Twoich domen
* Wskaźniki zgodności SPF i DKIM
* Podział statusów wiadomości (zaakceptowane, poddane kwarantannie, odrzucone)
* Najważniejsze organizacje raportujące (Google, Microsoft, Yahoo itd.)
* Adresy IP z problemami zgodności, które mogą wymagać uwagi
* Bezpośrednie linki do panelu raportów DMARC

Cotygodniowe raporty są wysyłane automatycznie i nie można ich wyłączyć oddzielnie od innych powiadomień e-mail.

### Jak połączyć i skonfigurować kontakty {#how-do-i-connect-and-configure-my-contacts}

**Aby skonfigurować kontakty, użyj adresu CardDAV:** `https://carddav.forwardemail.net` (lub po prostu `carddav.forwardemail.net`, jeśli Twój klient na to pozwala)

### Jak połączyć i skonfigurować kalendarze {#how-do-i-connect-and-configure-my-calendars}

**Aby skonfigurować kalendarz, użyj adresu CalDAV:** `https://caldav.forwardemail.net` (lub po prostu `caldav.forwardemail.net`, jeśli Twój klient na to pozwala)

<img width="612" height="520" src="/img/faq/calendar-setup.png" alt="Forward Email Calendar CalDAV Thunderbird Example Setup" />

### Jak dodać więcej kalendarzy i zarządzać istniejącymi kalendarzami {#how-do-i-add-more-calendars-and-manage-existing-calendars}

Jeśli chcesz dodać dodatkowe kalendarze, po prostu dodaj nowy adres kalendarza: `https://caldav.forwardemail.net/dav/principals/calendar-name` (**pamiętaj, aby zastąpić `calendar-name` nazwą wybranego kalendarza**)

Możesz zmienić nazwę i kolor kalendarza po jego utworzeniu – wystarczy użyć preferowanej aplikacji kalendarza (np. Apple Mail lub [Thunderbird](https://thunderbird.net)).

### Jak połączyć i skonfigurować zadania i przypomnienia {#how-do-i-connect-and-configure-tasks-and-reminders}

**Aby skonfigurować zadania i przypomnienia, użyj tego samego adresu CalDAV co dla kalendarzy:** `https://caldav.forwardemail.net` (lub po prostu `caldav.forwardemail.net`, jeśli Twój klient na to pozwala)

Zadania i przypomnienia będą automatycznie oddzielone od wydarzeń kalendarza do własnej kolekcji kalendarzy "Przypomnienia" lub "Zadania".

**Instrukcje konfiguracji według platformy:**

**macOS/iOS:**

1. Dodaj nowe konto CalDAV w Preferencjach systemowych > Konta internetowe (lub Ustawienia > Konta na iOS)
2. Użyj `caldav.forwardemail.net` jako serwera
3. Wprowadź swój alias Forward Email i wygenerowane hasło
4. Po konfiguracji zobaczysz kolekcje "Kalendarz" i "Przypomnienia"
5. Używaj aplikacji Przypomnienia do tworzenia i zarządzania zadaniami

**Android z Tasks.org:**

1. Zainstaluj Tasks.org ze sklepu Google Play lub F-Droid
2. Przejdź do Ustawienia > Synchronizacja > Dodaj konto > CalDAV
3. Wprowadź serwer: `https://caldav.forwardemail.net`
4. Wprowadź swój alias Forward Email i wygenerowane hasło
5. Tasks.org automatycznie wykryje Twoje kalendarze z zadaniami

**Thunderbird:**

1. Zainstaluj dodatek Lightning, jeśli jeszcze nie jest zainstalowany
2. Utwórz nowy kalendarz typu "CalDAV"
3. Użyj adresu URL: `https://caldav.forwardemail.net`
4. Wprowadź swoje dane uwierzytelniające Forward Email
5. Zarówno wydarzenia, jak i zadania będą dostępne w interfejsie kalendarza

### Dlaczego nie mogę tworzyć zadań w macOS Przypomnienia {#why-cant-i-create-tasks-in-macos-reminders}
Jeśli masz problemy z tworzeniem zadań w macOS Reminders, wypróbuj następujące kroki rozwiązywania problemów:

1. **Sprawdź konfigurację konta**: Upewnij się, że Twoje konto CalDAV jest poprawnie skonfigurowane z `caldav.forwardemail.net`

2. **Zweryfikuj oddzielne kalendarze**: Powinieneś widzieć zarówno "Calendar", jak i "Reminders" na swoim koncie. Jeśli widzisz tylko "Calendar", wsparcie dla zadań może nie być jeszcze w pełni aktywowane.

3. **Odśwież konto**: Spróbuj usunąć i ponownie dodać swoje konto CalDAV w Preferencjach systemowych > Konta internetowe

4. **Sprawdź łączność z serwerem**: Przetestuj, czy możesz uzyskać dostęp do `https://caldav.forwardemail.net` w przeglądarce

5. **Zweryfikuj dane logowania**: Upewnij się, że używasz poprawnego aliasu e-mail i wygenerowanego hasła (nie hasła do konta)

6. **Wymuś synchronizację**: W aplikacji Reminders spróbuj utworzyć zadanie, a następnie ręcznie odświeżyć synchronizację

**Typowe problemy:**

* **"Reminders calendar not found"**: Serwer może potrzebować chwili, aby utworzyć kolekcję Reminders przy pierwszym dostępie
* **Zadania się nie synchronizują**: Sprawdź, czy oba urządzenia używają tych samych danych logowania do konta CalDAV
* **Mieszane treści**: Upewnij się, że zadania są tworzone w kalendarzu "Reminders", a nie w ogólnym "Calendar"

### Jak skonfigurować Tasks.org na Androidzie {#how-do-i-set-up-tasksorg-on-android}

Tasks.org to popularny otwartoźródłowy menedżer zadań, który doskonale współpracuje z obsługą zadań CalDAV Forward Email.

**Instalacja i konfiguracja:**

1. **Zainstaluj Tasks.org**:
   * Z Google Play Store: [Tasks.org](https://play.google.com/store/apps/details?id=org.tasks)
   * Z F-Droid: [Tasks.org on F-Droid](https://f-droid.org/packages/org.tasks/)

2. **Skonfiguruj synchronizację CalDAV**:
   * Otwórz Tasks.org
   * Przejdź do ☰ Menu > Ustawienia > Synchronizacja
   * Stuknij "Dodaj konto"
   * Wybierz "CalDAV"

3. **Wprowadź ustawienia Forward Email**:
   * **URL serwera**: `https://caldav.forwardemail.net`
   * **Nazwa użytkownika**: Twój alias Forward Email (np. `you@yourdomain.com`)
   * **Hasło**: Wygenerowane hasło specyficzne dla aliasu
   * Stuknij "Dodaj konto"

4. **Odkrywanie konta**:
   * Tasks.org automatycznie wykryje Twoje kalendarze zadań
   * Powinieneś zobaczyć kolekcję "Reminders"
   * Stuknij "Subskrybuj", aby włączyć synchronizację kalendarza zadań

5. **Test synchronizacji**:
   * Utwórz testowe zadanie w Tasks.org
   * Sprawdź, czy pojawi się w innych klientach CalDAV (np. macOS Reminders)
   * Zweryfikuj, czy zmiany synchronizują się w obie strony

**Dostępne funkcje:**

* ✅ Tworzenie i edycja zadań
* ✅ Terminy i przypomnienia
* ✅ Zakończenie zadania i status
* ✅ Poziomy priorytetów
* ✅ Podzadania i hierarchia zadań
* ✅ Tagi i kategorie
* ✅ Synchronizacja dwukierunkowa z innymi klientami CalDAV

**Rozwiązywanie problemów:**

* Jeśli nie pojawiają się kalendarze zadań, spróbuj ręcznie odświeżyć w ustawieniach Tasks.org
* Upewnij się, że masz przynajmniej jedno zadanie utworzone na serwerze (możesz najpierw utworzyć je w macOS Reminders)
* Sprawdź łączność sieciową z `caldav.forwardemail.net`

### Jak skonfigurować SRS dla Forward Email {#how-do-i-set-up-srs-for-forward-email}

Automatycznie konfigurujemy [Sender Rewriting Scheme](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme) ("SRS") – nie musisz robić tego samodzielnie.

### Jak skonfigurować MTA-STS dla Forward Email {#how-do-i-set-up-mta-sts-for-forward-email}

Prosimy o zapoznanie się z [naszą sekcją o MTA-STS](#do-you-support-mta-sts) w celu uzyskania dodatkowych informacji.

### Jak dodać zdjęcie profilowe do mojego adresu e-mail {#how-do-i-add-a-profile-picture-to-my-email-address}

Jeśli korzystasz z Gmaila, wykonaj poniższe kroki:

1. Przejdź na <https://google.com> i wyloguj się ze wszystkich kont e-mail
2. Kliknij "Zaloguj się", a w rozwijanym menu wybierz "inne konto"
3. Wybierz "Użyj innego konta"
4. Wybierz "Utwórz konto"
5. Wybierz "Użyj zamiast tego mojego obecnego adresu e-mail"
6. Wprowadź swój adres e-mail z własnej domeny
7. Odbierz wiadomość weryfikacyjną wysłaną na Twój adres e-mail
8. Wprowadź kod weryfikacyjny z tej wiadomości
9. Uzupełnij informacje profilowe dla nowego konta Google
10. Zaakceptuj wszystkie polityki prywatności i warunki użytkowania
11. Przejdź na <https://google.com>, kliknij ikonę profilu w prawym górnym rogu i kliknij przycisk "zmień"
12. Prześlij nowe zdjęcie lub awatar dla swojego konta
13. Zmiany zostaną wprowadzone w ciągu około 1-2 godzin, choć czasem mogą nastąpić bardzo szybko.
14. Wyślij testowego e-maila, a zdjęcie profilowe powinno się pojawić.
## Zaawansowane funkcje {#advanced-features}

### Czy obsługujecie newslettery lub listy mailingowe do celów marketingowych {#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email}

Tak, więcej informacji znajdziesz na <https://forwardemail.net/guides/newsletter-with-listmonk>.

Należy pamiętać, że aby utrzymać reputację IP i zapewnić dostarczalność, Forward Email posiada ręczny proces weryfikacji na poziomie domeny dla **zatwierdzania newsletterów**. Napisz na <support@forwardemail.net> lub otwórz [zgłoszenie pomocy](https://forwardemail.net/help) w celu zatwierdzenia. Zazwyczaj zajmuje to mniej niż 24 godziny, a większość zgłoszeń jest rozpatrywana w ciągu 1-2 godzin. W niedalekiej przyszłości planujemy uczynić ten proces natychmiastowym dzięki dodatkowym kontrolom antyspamowym i powiadomieniom. Proces ten zapewnia, że Twoje e-maile trafiają do skrzynki odbiorczej i nie są oznaczane jako spam.

### Czy obsługujecie wysyłanie e-maili przez API {#do-you-support-sending-email-with-api}

Tak, od maja 2023 roku obsługujemy wysyłanie e-maili przez API jako dodatek dla wszystkich płatnych użytkowników.

<div class="alert my-3 alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Ważne:
  </strong>
  <span>
    Prosimy o zapoznanie się z naszymi <a href="/terms" class="alert-link" target="_blank">Warunkami</a>, <a href="/privacy" class="alert-link" target="_blank">Polityką prywatności</a> oraz <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Limitami SMTP wychodzącymi</a> – korzystanie oznacza akceptację i zgodę.
  </span>
</div>

Zapoznaj się z sekcją dotyczącą [E-maili](/email-api#outbound-emails) w naszej dokumentacji API, aby poznać opcje, przykłady i więcej informacji.

Aby wysyłać e-maile wychodzące za pomocą naszego API, musisz użyć swojego tokena API dostępnego w [Moje bezpieczeństwo](/my-account/security).

### Czy obsługujecie odbieranie e-maili przez IMAP {#do-you-support-receiving-email-with-imap}

Tak, od 16 października 2023 roku obsługujemy odbieranie e-maili przez IMAP jako dodatek dla wszystkich płatnych użytkowników.  **Prosimy o przeczytanie naszego szczegółowego artykułu** na temat [jak działa nasza funkcja szyfrowanego przechowywania skrzynki pocztowej SQLite](/blog/docs/best-quantum-safe-encrypted-email-service).

<div id="imap-instructions">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Ważne:
  </strong>
  <span>
    Prosimy o zapoznanie się z naszymi <a href="/terms" class="alert-link" target="_blank">Warunkami</a> oraz <a href="/privacy" class="alert-link" target="_blank">Polityką prywatności</a> – korzystanie oznacza akceptację i zgodę.
  </span>
</div>

1. Utwórz nowy alias dla swojej domeny w <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Moje konto <i class="fa fa-angle-right"></i> Domeny</a> <i class="fa fa-angle-right"></i> Aliasy (np. <code><hello@example.com></code>)

2. Kliknij na <strong class="text-success"><i class="fa fa-key"></i> Wygeneruj hasło</strong> obok nowo utworzonego aliasu. Skopiuj do schowka i bezpiecznie przechowaj wygenerowane hasło wyświetlone na ekranie.

3. Używając preferowanej aplikacji e-mail, dodaj lub skonfiguruj konto z nowo utworzonym aliasem (np. <code><hello@example.com></code>)
   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Wskazówka:
     </strong>
     <span>Zalecamy używanie <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a> lub <a href="/blog/open-source" class="alert-link" target="_blank">alternatywy open-source i skoncentrowanej na prywatności</a>.</span>
   </div>

4. Gdy zostaniesz poproszony o nazwę serwera IMAP, wpisz `imap.forwardemail.net`

5. Gdy zostaniesz poproszony o port serwera IMAP, wpisz `993` (SSL/TLS) – w razie potrzeby zobacz [alternatywne porty IMAP](/faq#what-are-your-imap-server-configuration-settings)
   <div class="alert my-3 alert-warning">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Wskazówka:
     </strong>
     <span>Jeśli używasz Thunderbirda, upewnij się, że "Bezpieczeństwo połączenia" jest ustawione na "SSL/TLS", a metoda uwierzytelniania na "Normalne hasło".</span>
   </div>
6. When prompted for IMAP server password, paste the password from <strong class="text-success"><i class="fa fa-key"></i> Generate Password</strong> in step 2 above

7. **Zapisz swoje ustawienia** – jeśli masz problemy, prosimy <a href="/help">skontaktuj się z nami</a>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Gratulacje!
    </strong>
    <span>
      Pomyślnie ukończyłeś wszystkie kroki.
    </span>
  </div>
</div>

</div>

### Czy obsługujecie POP3 {#do-you-support-pop3}

Tak, od 4 grudnia 2023 obsługujemy [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol) jako dodatek dla wszystkich płatnych użytkowników.  **Prosimy przeczytać nasz szczegółowy artykuł** o [tym, jak działa nasza funkcja szyfrowanego przechowywania skrzynki pocztowej SQLite](/blog/docs/best-quantum-safe-encrypted-email-service).

<div id="pop3-instructions">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Ważne:
  </strong>
  <span>
    Prosimy upewnić się, że przeczytałeś nasze <a href="/terms" class="alert-link" target="_blank">Warunki</a> oraz <a href="/privacy" class="alert-link" target="_blank">Politykę prywatności</a> &ndash; korzystanie oznacza akceptację i zgodę.
  </span>
</div>

1. Utwórz nowy alias dla swojej domeny w <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Moje konto <i class="fa fa-angle-right"></i> Domeny</a> <i class="fa fa-angle-right"></i> Aliasy (np. <code><hello@example.com></code>)

2. Kliknij na <strong class="text-success"><i class="fa fa-key"></i> Generate Password</strong> obok nowo utworzonego aliasu. Skopiuj do schowka i bezpiecznie przechowuj wygenerowane hasło wyświetlone na ekranie.

3. Korzystając z preferowanej aplikacji pocztowej, dodaj lub skonfiguruj konto z nowo utworzonym aliasem (np. <code><hello@example.com></code>)
   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Wskazówka:
     </strong>
     <span>Zalecamy używanie <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a> lub <a href="/blog/open-source" class="alert-link" target="_blank">alternatywy open-source i skupionej na prywatności</a>.</span>
   </div>

4. Gdy zostaniesz poproszony o nazwę serwera POP3, wpisz `pop3.forwardemail.net`

5. Gdy zostaniesz poproszony o port serwera POP3, wpisz `995` (SSL/TLS) – w razie potrzeby zobacz [alternatywne porty POP3](/faq#what-are-your-pop3-server-configuration-settings)
   <div class="alert my-3 alert-warning">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Wskazówka:
     </strong>
     <span>Jeśli używasz Thunderbirda, upewnij się, że "Bezpieczeństwo połączenia" jest ustawione na "SSL/TLS", a metoda uwierzytelniania na "Normalne hasło".</span>
   </div>

6. When prompted for POP3 server password, paste the password from <strong class="text-success"><i class="fa fa-key"></i> Generate Password</strong> in step 2 above

7. **Zapisz swoje ustawienia** – jeśli masz problemy, prosimy <a href="/help">skontaktuj się z nami</a>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Gratulacje!
    </strong>
    <span>
      Pomyślnie ukończyłeś wszystkie kroki.
    </span>
  </div>
</div>

</div>

### Czy obsługujecie kalendarze (CalDAV) {#do-you-support-calendars-caldav}

Tak, od 5 lutego 2024 dodaliśmy tę funkcję. Nasz serwer to `caldav.forwardemail.net` i jest również monitorowany na naszej <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">stronie statusu</a>.
Obsługuje zarówno IPv4, jak i IPv6 i jest dostępny przez port `443` (HTTPS).

| Login    | Przykład                   | Opis                                                                                                                                                                                     |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nazwa użytkownika | `user@example.com`         | Adres e-mail aliasu, który istnieje dla domeny w <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Moje konto <i class="fa fa-angle-right"></i> Domeny</a>.           |
| Hasło    | `************************` | Wygenerowane hasło specyficzne dla aliasu.                                                                                                                                               |

Aby korzystać z obsługi kalendarza, **użytkownik** musi być adresem e-mail aliasu, który istnieje dla domeny w <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Moje konto <i class="fa fa-angle-right"></i> Domeny</a> – a **hasło** musi być wygenerowanym hasłem specyficznym dla aliasu.

### Czy obsługujecie zadania i przypomnienia (CalDAV VTODO) {#do-you-support-tasks-and-reminders-caldav-vtodo}

Tak, od 14 października 2025 dodaliśmy obsługę CalDAV VTODO dla zadań i przypomnień. Używa to tego samego serwera co nasza obsługa kalendarza: `caldav.forwardemail.net`.

Nasz serwer CalDAV obsługuje zarówno wydarzenia kalendarza (VEVENT), jak i komponenty zadań (VTODO) korzystając z **zunifikowanych kalendarzy**. Oznacza to, że każdy kalendarz może zawierać zarówno wydarzenia, jak i zadania, zapewniając maksymalną elastyczność i kompatybilność ze wszystkimi klientami CalDAV.

**Jak działają kalendarze i listy:**

* **Każdy kalendarz obsługuje zarówno wydarzenia, jak i zadania** – Możesz dodawać wydarzenia, zadania lub oba do dowolnego kalendarza
* **Listy Apple Reminders** – Każda lista utworzona w Apple Reminders staje się osobnym kalendarzem na serwerze
* **Wiele kalendarzy** – Możesz tworzyć dowolną liczbę kalendarzy, każdy z własną nazwą, kolorem i organizacją
* **Synchronizacja między klientami** – Zadania i wydarzenia synchronizują się bezproblemowo między wszystkimi kompatybilnymi klientami

**Obsługiwane klienty zadań:**

* **macOS Reminders** – Pełna natywna obsługa tworzenia, edycji, ukończenia i synchronizacji zadań
* **iOS Reminders** – Pełna natywna obsługa na wszystkich urządzeniach iOS
* **Tasks.org (Android)** – Popularny otwartoźródłowy menedżer zadań z synchronizacją CalDAV
* **Thunderbird** – Obsługa zadań i kalendarza w desktopowym kliencie poczty
* **Każdy menedżer zadań kompatybilny z CalDAV** – Standardowa obsługa komponentu VTODO

**Obsługiwane funkcje zadań:**

* Tworzenie, edycja i usuwanie zadań
* Terminy i daty rozpoczęcia
* Status ukończenia zadania (NEEDS-ACTION, IN-PROCESS, COMPLETED, CANCELLED)
* Poziomy priorytetu zadań
* Zadania cykliczne
* Opisy i notatki do zadań
* Synchronizacja na wielu urządzeniach
* Podzadania z właściwością RELATED-TO
* Przypomnienia zadań z VALARM

Dane logowania są takie same jak dla obsługi kalendarza:

| Login    | Przykład                   | Opis                                                                                                                                                                                     |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nazwa użytkownika | `user@example.com`         | Adres e-mail aliasu, który istnieje dla domeny w <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Moje konto <i class="fa fa-angle-right"></i> Domeny</a>.           |
| Hasło    | `************************` | Wygenerowane hasło specyficzne dla aliasu.                                                                                                                                               |

**Ważne uwagi:**

* **Każda lista w Reminders to osobny kalendarz** – Gdy tworzysz nową listę w Apple Reminders, tworzy się nowy kalendarz na serwerze CalDAV
* **Użytkownicy Thunderbirda** – Musisz ręcznie subskrybować każdy kalendarz/listę, którą chcesz synchronizować, lub użyć adresu URL katalogu kalendarza: `https://caldav.forwardemail.net/dav/your-email@domain.com/`
* **Użytkownicy Apple** – Odkrywanie kalendarzy odbywa się automatycznie, więc wszystkie Twoje kalendarze i listy pojawią się w Calendar.app i Reminders.app
* **Zunifikowane kalendarze** – Wszystkie kalendarze obsługują zarówno wydarzenia, jak i zadania, dając Ci elastyczność w organizacji danych
### Czy obsługujecie kontakty (CardDAV) {#do-you-support-contacts-carddav}

Tak, od 12 czerwca 2025 dodaliśmy tę funkcję. Nasz serwer to `carddav.forwardemail.net` i jest również monitorowany na naszej <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">stronie statusu</a>.

Obsługuje zarówno IPv4, jak i IPv6 i jest dostępny na porcie `443` (HTTPS).

| Login    | Przykład                  | Opis                                                                                                                                                                                     |
| -------- | ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nazwa użytkownika | `user@example.com`         | Adres e-mail aliasu, który istnieje dla domeny w <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Moje konto <i class="fa fa-angle-right"></i> Domeny</a>.          |
| Hasło    | `************************` | Wygenerowane hasło specyficzne dla aliasu.                                                                                                                                               |

Aby korzystać z obsługi kontaktów, **użytkownik** musi być adresem e-mail aliasu, który istnieje dla domeny w <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Moje konto <i class="fa fa-angle-right"></i> Domeny</a> – a **hasło** musi być wygenerowanym hasłem specyficznym dla aliasu.

### Czy obsługujecie wysyłanie e-maili przez SMTP {#do-you-support-sending-email-with-smtp}

Tak, od maja 2023 wspieramy wysyłanie e-maili przez SMTP jako dodatek dla wszystkich płatnych użytkowników.

<div id="smtp-instructions">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Ważne:
  </strong>
  <span>
    Prosimy upewnić się, że przeczytali Państwo nasze <a href="/terms" class="alert-link" target="_blank">Warunki</a>, <a href="/privacy" class="alert-link" target="_blank">Politykę prywatności</a> oraz <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Limity SMTP wychodzącego</a> – korzystanie oznacza akceptację i zgodę.
  </span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Ważne:
  </strong>
  <span>
    Jeśli korzystasz z Gmaila, zapoznaj się z naszym <a class="alert-link" href="/guides/send-mail-as-gmail-custom-domain">przewodnikiem Wysyłaj jako z Gmail</a>. Jeśli jesteś programistą, zapoznaj się z naszymi <a class="alert-link" href="/email-api#outbound-emails" target="_blank">dokumentami API e-mail</a>.
  </span>
</div>

1. Przejdź do <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Moje konto <i class="fa fa-angle-right"></i> Domeny</a> <i class="fa fa-angle-right"></i> Ustawienia <i class="fa fa-angle-right"></i> Konfiguracja SMTP wychodzącego i postępuj zgodnie z instrukcjami konfiguracji

2. Utwórz nowy alias dla swojej domeny w <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Moje konto <i class="fa fa-angle-right"></i> Domeny</a> <i class="fa fa-angle-right"></i> Aliasy (np. <code><hello@example.com></code>)

3. Kliknij na <strong class="text-success"><i class="fa fa-key"></i> Wygeneruj hasło</strong> obok nowo utworzonego aliasu. Skopiuj do schowka i bezpiecznie przechowuj wygenerowane hasło wyświetlone na ekranie.

4. Korzystając z preferowanej aplikacji e-mail, dodaj lub skonfiguruj konto z nowo utworzonym aliasem (np. <code><hello@example.com></code>)
   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Wskazówka:
     </strong>
     <span>Zalecamy korzystanie z <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a> lub <a href="/blog/open-source" class="alert-link" target="_blank">alternatywy open-source i skoncentrowanej na prywatności</a>.</span>
   </div>
5. Gdy zostaniesz poproszony o nazwę serwera SMTP, wpisz `smtp.forwardemail.net`

6. Gdy zostaniesz poproszony o port serwera SMTP, wpisz `465` (SSL/TLS) – zobacz [alternatywne porty SMTP](/faq#what-are-your-smtp-server-configuration-settings) w razie potrzeby
   <div class="alert my-3 alert-warning">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Wskazówka:
     </strong>
     <span>Jeśli używasz Thunderbirda, upewnij się, że "Bezpieczeństwo połączenia" jest ustawione na "SSL/TLS", a metoda uwierzytelniania na "Normalne hasło".</span>
   </div>

7. Gdy zostaniesz poproszony o hasło do serwera SMTP, wklej hasło z <strong class="text-success"><i class="fa fa-key"></i> Wygeneruj hasło</strong> w kroku 3 powyżej

8. **Zapisz swoje ustawienia i wyślij pierwszy testowy e-mail** – jeśli masz problemy, prosimy <a href="/help">skontaktuj się z nami</a>

<div class="alert my-3 alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Ważne:
  </strong>
  <span>
    Prosimy pamiętać, że aby utrzymać reputację IP i zapewnić dostarczalność, mamy ręczny proces weryfikacji na poziomie domeny dla zatwierdzania wychodzącego SMTP. Zazwyczaj trwa to mniej niż 24 godziny, a większość zgłoszeń jest rozpatrywana w ciągu 1-2 godzin. W niedalekiej przyszłości planujemy uczynić ten proces natychmiastowym, z dodatkowymi kontrolami antyspamowymi i powiadomieniami. Proces ten zapewnia, że Twoje e-maile trafiają do skrzynki odbiorczej, a Twoje wiadomości nie są oznaczane jako spam.
  </span>
</div>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Gratulacje!
    </strong>
    <span>
      Pomyślnie ukończyłeś wszystkie kroki.
    </span>
  </div>
</div>

</div>

### Czy obsługujecie OpenPGP/MIME, szyfrowanie end-to-end ("E2EE") oraz Web Key Directory ("WKD") {#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd}

Tak, obsługujemy [OpenPGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy#OpenPGP), [szyfrowanie end-to-end ("E2EE")](https://en.wikipedia.org/wiki/End-to-end_encryption) oraz wyszukiwanie kluczy publicznych za pomocą [Web Key Directory ("WKD")](https://wiki.gnupg.org/WKD). Możesz skonfigurować OpenPGP korzystając z [keys.openpgp.org](https://keys.openpgp.org/about/usage#wkd-as-a-service) lub [samodzielnie hostować własne klucze](https://wiki.gnupg.org/WKDHosting) (odwołaj się do [tego gista dotyczącego konfiguracji serwera WKD](https://gist.github.com/kafene/0a6e259996862d35845784e6e5dbfc79)).

* Wyszukiwania WKD są buforowane przez 1 godzinę, aby zapewnić terminową dostawę e-maili → dlatego jeśli dodasz, zmienisz lub usuniesz swój klucz WKD, prosimy o wysłanie do nas e-maila na `support@forwardemail.net` z Twoim adresem e-mail, abyśmy mogli ręcznie wyczyścić pamięć podręczną.
* Obsługujemy szyfrowanie PGP dla wiadomości przekazywanych za pomocą wyszukiwania WKD lub przy użyciu przesłanego klucza PGP w naszym interfejsie.
* Przesłane klucze mają pierwszeństwo, o ile pole wyboru PGP jest włączone/zaznaczone.
* Wiadomości wysyłane do webhooków nie są obecnie szyfrowane za pomocą PGP.
* Jeśli masz wiele aliasów pasujących do danego adresu przekazywania (np. kombinacja regex/wildcard/dokładne dopasowanie) i jeśli więcej niż jeden z nich zawiera przesłany klucz PGP i ma zaznaczone PGP → wtedy wyślemy Ci e-mail z alertem o błędzie i nie zaszyfrujemy wiadomości Twoim przesłanym kluczem PGP. Jest to bardzo rzadkie i zwykle dotyczy zaawansowanych użytkowników z złożonymi regułami aliasów.
* **Szyfrowanie PGP nie będzie stosowane do przekazywania e-maili przez nasze serwery MX, jeśli nadawca miał politykę DMARC ustawioną na reject. Jeśli potrzebujesz szyfrowania PGP na *wszystkie* wiadomości, sugerujemy korzystanie z naszej usługi IMAP i skonfigurowanie klucza PGP dla swojego aliasu dla poczty przychodzącej.**

**Możesz zweryfikować swoją konfigurację Web Key Directory na <https://wkd.chimbosonic.com/> (open-source) lub <https://www.webkeydirectory.com/> (własnościowe).**

<div class="alert my-3 alert-success">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Automatyczne szyfrowanie:
  </strong>
  <span>Jeśli korzystasz z naszej <a href="#do-you-support-sending-email-with-smtp" class="alert-link">usługi SMTP wychodzącego</a> i wysyłasz nieszyfrowane wiadomości, automatycznie podejmiemy próbę zaszyfrowania wiadomości na podstawie odbiorcy, korzystając z <a class="alert-link" href="https://wiki.gnupg.org/WKD">Web Key Directory ("WKD")</a>.</span>
</div>
<div class="alert alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Ważne:
  </strong>
  <span>
    Musisz wykonać wszystkie poniższe kroki, aby włączyć OpenPGP dla własnej nazwy domeny.
  </span>
</div>

1. Pobierz i zainstaluj zalecany wtyczkę klienta poczty e-mail poniżej:

   | Klient poczty  | Platforma | Zalecana wtyczka                                                                                                                                                                      | Uwagi                                                                                                                                                                                                                                                                                                                                                                                                                                   |
   | -------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | Thunderbird    | Desktop  | [Skonfiguruj OpenPGP w Thunderbird](https://support.mozilla.org/en-US/kb/openpgp-thunderbird-howto-and-faq#w_i-have-never-used-openpgp-with-thunderbird-before-how-do-i-setup-openpgp) | Thunderbird ma wbudowane wsparcie dla OpenPGP.                                                                                                                                                                                                                                                                                                                                                                                          |
   | Gmail          | Przeglądarka | [Mailvelope](https://mailvelope.com/) lub [FlowCrypt](https://flowcrypt.com/download) (licencja własnościowa)                                                                        | Gmail nie obsługuje OpenPGP, jednak możesz pobrać otwartoźródłową wtyczkę [Mailvelope](https://mailvelope.com/) lub [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                                                          |
   | Apple Mail     | macOS    | [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation)                                                                                        | Apple Mail nie obsługuje OpenPGP, jednak możesz pobrać otwartoźródłową wtyczkę [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation).                                                                                                                                                                                                                                                               |
   | Apple Mail     | iOS      | [PGPro](https://github.com/opensourceios/PGPro/) lub [FlowCrypt](https://apps.apple.com/us/app/flowcrypt-encrypted-email/id1591754995) (licencja własnościowa)                     | Apple Mail nie obsługuje OpenPGP, jednak możesz pobrać otwartoźródłową wtyczkę [PGPro](https://github.com/opensourceios/PGPro/) lub [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                                          |
   | Outlook        | Windows  | [gpg4win](https://www.gpg4win.de/index.html)                                                                                                                                        | Klient poczty Outlook na komputerze nie obsługuje OpenPGP, jednak możesz pobrać otwartoźródłową wtyczkę [gpg4win](https://www.gpg4win.de/index.html).                                                                                                                                                                                                                                                                                      |
   | Outlook        | Przeglądarka | [Mailvelope](https://mailvelope.com/) lub [FlowCrypt](https://flowcrypt.com/download) (licencja własnościowa)                                                                        | Klient poczty Outlook w przeglądarce nie obsługuje OpenPGP, jednak możesz pobrać otwartoźródłową wtyczkę [Mailvelope](https://mailvelope.com/) lub [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                            |
   | Android        | Mobile   | [OpenKeychain](https://www.openkeychain.org/) lub [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email)                                                   | [Klienci poczty na Androida](/blog/open-source/android-email-clients) tacy jak [Thunderbird Mobile](https://www.thunderbird.net/en-US/mobile/) i [FairEmail](https://github.com/M66B/FairEmail) obsługują otwartoźródłową wtyczkę [OpenKeychain](https://www.openkeychain.org/). Alternatywnie możesz użyć otwartoźródłowej (licencja własnościowa) wtyczki [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email). |
   | Google Chrome  | Przeglądarka | [Mailvelope](https://mailvelope.com/) lub [FlowCrypt](https://flowcrypt.com/download) (licencja własnościowa)                                                                        | Możesz pobrać otwartoźródłowe rozszerzenie przeglądarki [Mailvelope](https://mailvelope.com/) lub [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                                                                             |
   | Mozilla Firefox| Przeglądarka | [Mailvelope](https://mailvelope.com/) lub [FlowCrypt](https://flowcrypt.com/download) (licencja własnościowa)                                                                        | Możesz pobrać otwartoźródłowe rozszerzenie przeglądarki [Mailvelope](https://mailvelope.com/) lub [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                                                                             |
   | Microsoft Edge | Przeglądarka | [Mailvelope](https://mailvelope.com/)                                                                                                                                               | Możesz pobrać otwartoźródłowe rozszerzenie przeglądarki [Mailvelope](https://mailvelope.com/).                                                                                                                                                                                                                                                                                                                                            |
   | Brave          | Przeglądarka | [Mailvelope](https://mailvelope.com/) lub [FlowCrypt](https://flowcrypt.com/download) (licencja własnościowa)                                                                        | Możesz pobrać otwartoźródłowe rozszerzenie przeglądarki [Mailvelope](https://mailvelope.com/) lub [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                                                                             |
   | Balsa          | Desktop  | [Skonfiguruj OpenPGP w Balsa](https://www.mynetcologne.de/~nc-dreszal/balsa/balsa23-secure-mail.html#USING)                                                                          | Balsa ma wbudowane wsparcie dla OpenPGP.                                                                                                                                                                                                                                                                                                                                                                                                 |
   | KMail          | Desktop  | [Skonfiguruj OpenPGP w KMail](https://userbase.kde.org/KMail/PGP_MIME)                                                                                                               | KMail ma wbudowane wsparcie dla OpenPGP.                                                                                                                                                                                                                                                                                                                                                                                                 |
   | GNOME Evolution| Desktop  | [Skonfiguruj OpenPGP w Evolution](https://help.gnome.org/users/evolution/stable/mail-encryption.html.en)                                                                             | GNOME Evolution ma wbudowane wsparcie dla OpenPGP.                                                                                                                                                                                                                                                                                                                                                                                       |
   | Terminal       | Desktop  | [Skonfiguruj gpg w Terminalu](https://docs.github.com/en/authentication/managing-commit-signature-verification/generating-a-new-gpg-key#generating-a-gpg-key)                       | Możesz użyć otwartoźródłowego [narzędzia gpg w wierszu poleceń](https://www.gnupg.org/download/), aby wygenerować nowy klucz z poziomu terminala.                                                                                                                                                                                                                                                                                         |
2. Otwórz wtyczkę, utwórz swój klucz publiczny i skonfiguruj klienta poczty, aby go używał.

3. Prześlij swój klucz publiczny na <https://keys.openpgp.org/upload>.

   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Wskazówka:
     </strong>
     <span>Możesz odwiedzić <a class="alert-link" href="https://keys.openpgp.org/manage">https://keys.openpgp.org/manage</a>, aby zarządzać swoim kluczem w przyszłości.</span>
   </div>

   <div class="alert my-3 alert-secondary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Opcjonalny dodatek:
     </strong>
     <span>
       Jeśli korzystasz z naszej usługi <a class="alert-link" href="/blog/docs/best-quantum-safe-encrypted-email-service">zaszyfrowanego magazynu (IMAP/POP3)</a> i chcesz, aby <i>cała</i> poczta przechowywana w twojej (już zaszyfrowanej) bazie danych SQLite była szyfrowana twoim kluczem publicznym, przejdź do <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Moje konto <i class="fa fa-angle-right"></i> Domeny</a> <i class="fa fa-angle-right"></i> Aliasów (np. <code>hello@example.com</code>) <i class="fa fa-angle-right"></i> Edytuj <i class="fa fa-angle-right"></i> OpenPGP i prześlij swój klucz publiczny.
     </span>
   </div>

4. Dodaj nowy rekord `CNAME` do swojej domeny (np. `example.com`):

   <table class="table table-striped table-hover my-3">
     <thead class="thead-dark">
       <tr>
         <th>Nazwa/Host/Alias</th>
         <th class="text-center">TTL</th>
         <th>Typ</th>
         <th>Odpowiedź/Wartość</th>
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
       Wskazówka:
     </strong>
     <span>Jeśli twój alias korzysta z naszych <a class="alert-link" href="/disposable-addresses" target="_blank">domen vanity/jednorazowych</a> (np. <code>hideaddress.net</code>), możesz pominąć ten krok.</span>
   </div>

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Gratulacje!
    </strong>
    <span>
      Pomyślnie ukończyłeś wszystkie kroki.
    </span>
  </div>
</div>

### Czy wspieracie szyfrowanie S/MIME {#do-you-support-smime-encryption}

Tak, wspieramy szyfrowanie [S/MIME (Secure/Multipurpose Internet Mail Extensions)](https://en.wikipedia.org/wiki/S/MIME) zgodnie z definicją w [RFC 8551](https://datatracker.ietf.org/doc/html/rfc8551). S/MIME zapewnia szyfrowanie end-to-end przy użyciu certyfikatów X.509, które są szeroko wspierane przez korporacyjne klienty poczty.

Obsługujemy zarówno certyfikaty RSA, jak i ECC (kryptografia krzywych eliptycznych):

* **Certyfikaty RSA**: minimum 2048 bitów, zalecane 4096 bitów
* **Certyfikaty ECC**: krzywe NIST P-256, P-384 i P-521

Aby skonfigurować szyfrowanie S/MIME dla swojego aliasu:

1. Uzyskaj certyfikat S/MIME od zaufanego Urzędu Certyfikacji (CA) lub wygeneruj certyfikat samopodpisany do testów.

   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Wskazówka:
     </strong>
     <span>Darmowe certyfikaty S/MIME są dostępne u dostawców takich jak <a class="alert-link" href="https://www.actalis.com/s-mime-certificates.aspx">Actalis</a> lub <a class="alert-link" href="https://extrassl.actalis.com/portal/uapub/freemail">Actalis Free S/MIME</a>.</span>
   </div>

2. Eksportuj swój certyfikat w formacie PEM (tylko certyfikat publiczny, nie klucz prywatny).

3. Przejdź do <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Moje konto <i class="fa fa-angle-right"></i> Domeny</a> <i class="fa fa-angle-right"></i> Aliasów (np. <code><hello@example.com></code>) <i class="fa fa-angle-right"></i> Edytuj <i class="fa fa-angle-right"></i> S/MIME i prześlij swój certyfikat publiczny.
4. Po skonfigurowaniu wszystkie przychodzące e-maile na Twój alias będą szyfrowane za pomocą certyfikatu S/MIME przed ich przechowywaniem lub przekazywaniem dalej.

   <div class="alert my-3 alert-secondary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Uwaga:
     </strong>
     <span>
       Szyfrowanie S/MIME jest stosowane do przychodzących wiadomości, które nie są już zaszyfrowane. Jeśli wiadomość jest już zaszyfrowana za pomocą OpenPGP lub S/MIME, nie będzie ponownie szyfrowana.
     </span>
   </div>

   <div class="alert my-3 alert-warning">
     <i class="fa fa-exclamation-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Ważne:
     </strong>
     <span>
       Szyfrowanie S/MIME nie będzie stosowane do przekazywania e-maili przez nasze serwery MX, jeśli nadawca miał politykę DMARC ustawioną na reject. Jeśli potrzebujesz szyfrowania S/MIME dla <em>wszystkich</em> wiadomości, sugerujemy korzystanie z naszego serwisu IMAP i skonfigurowanie certyfikatu S/MIME dla Twojego aliasu dla poczty przychodzącej.
     </span>
   </div>

Następujące klienty poczty mają wbudowane wsparcie dla S/MIME:

| Klient poczty     | Platforma | Uwagi                                                                                                               |
| ----------------- | -------- | ------------------------------------------------------------------------------------------------------------------- |
| Apple Mail        | macOS    | Wbudowane wsparcie S/MIME. Przejdź do Mail > Preferences > Accounts > Twoje konto > Trust, aby skonfigurować certyfikaty.      |
| Apple Mail        | iOS      | Wbudowane wsparcie S/MIME. Przejdź do Settings > Mail > Accounts > Twoje konto > Advanced > S/MIME, aby skonfigurować.          |
| Microsoft Outlook | Windows  | Wbudowane wsparcie S/MIME. Przejdź do File > Options > Trust Center > Trust Center Settings > Email Security, aby skonfigurować. |
| Microsoft Outlook | macOS    | Wbudowane wsparcie S/MIME. Przejdź do Tools > Accounts > Advanced > Security, aby skonfigurować.                                 |
| Thunderbird       | Desktop  | Wbudowane wsparcie S/MIME. Przejdź do Account Settings > End-To-End Encryption > S/MIME, aby skonfigurować.                      |
| GNOME Evolution   | Desktop  | Wbudowane wsparcie S/MIME. Przejdź do Edit > Preferences > Mail Accounts > Twoje konto > Security, aby skonfigurować.           |
| KMail             | Desktop  | Wbudowane wsparcie S/MIME. Przejdź do Settings > Configure KMail > Identities > Twoja tożsamość > Cryptography, aby skonfigurować. |

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Gratulacje!
    </strong>
    <span>
      Pomyślnie skonfigurowałeś szyfrowanie S/MIME dla swojego aliasu.
    </span>
  </div>
</div>

### Czy obsługujecie filtrowanie e-maili Sieve {#do-you-support-sieve-email-filtering}

Tak! Obsługujemy filtrowanie e-maili za pomocą [Sieve](https://en.wikipedia.org/wiki/Sieve_\(mail_filtering_language\)) zgodnie z definicją w [RFC 5228](https://datatracker.ietf.org/doc/html/rfc5228). Sieve to potężny, ustandaryzowany język skryptowy do filtrowania poczty po stronie serwera, który pozwala automatycznie organizować, filtrować i odpowiadać na przychodzące wiadomości.

#### Obsługiwane rozszerzenia Sieve {#supported-sieve-extensions}

Obsługujemy szeroki zestaw rozszerzeń Sieve:

| Rozszerzenie                | RFC                                                                                     | Opis                                            |
| --------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------ |
| `fileinto`                  | [RFC 5228](https://datatracker.ietf.org/doc/html/rfc5228)                              | Przenoszenie wiadomości do określonych folderów |
| `reject` / `ereject`        | [RFC 5429](https://datatracker.ietf.org/doc/html/rfc5429)                              | Odrzucanie wiadomości z komunikatem o błędzie   |
| `vacation`                  | [RFC 5230](https://datatracker.ietf.org/doc/html/rfc5230)                              | Automatyczne odpowiedzi urlopowe/poza biurem    |
| `vacation-seconds`          | [RFC 6131](https://datatracker.ietf.org/doc/html/rfc6131)                              | Precyzyjne interwały odpowiedzi urlopowej       |
| `imap4flags`                | [RFC 5232](https://datatracker.ietf.org/doc/html/rfc5232)                              | Ustawianie flag IMAP (\Seen, \Flagged itd.)     |
| `envelope`                  | [RFC 5228](https://datatracker.ietf.org/doc/html/rfc5228)                              | Testowanie nadawcy/odbiorcy koperty             |
| `body`                      | [RFC 5173](https://datatracker.ietf.org/doc/html/rfc5173)                              | Testowanie zawartości treści wiadomości          |
| `variables`                 | [RFC 5229](https://datatracker.ietf.org/doc/html/rfc5229)                              | Przechowywanie i używanie zmiennych w skryptach |
| `relational`                | [RFC 5231](https://datatracker.ietf.org/doc/html/rfc5231)                              | Porównania relacyjne (większy niż, mniejszy niż) |
| `comparator-i;ascii-numeric`| [RFC 4790](https://datatracker.ietf.org/doc/html/rfc4790)                              | Porównania numeryczne                            |
| `copy`                      | [RFC 3894](https://datatracker.ietf.org/doc/html/rfc3894)                              | Kopiowanie wiadomości podczas przekierowywania  |
| `editheader`                | [RFC 5293](https://datatracker.ietf.org/doc/html/rfc5293)                              | Dodawanie lub usuwanie nagłówków wiadomości     |
| `date`                      | [RFC 5260](https://datatracker.ietf.org/doc/html/rfc5260)                              | Testowanie wartości daty/czasu                   |
| `index`                     | [RFC 5260](https://datatracker.ietf.org/doc/html/rfc5260)                              | Dostęp do konkretnych wystąpień nagłówków       |
| `regex`                     | [draft-ietf-sieve-regex](https://datatracker.ietf.org/doc/html/draft-ietf-sieve-regex) | Dopasowywanie wyrażeń regularnych                |
| `enotify`                   | [RFC 5435](https://datatracker.ietf.org/doc/html/rfc5435)                              | Wysyłanie powiadomień (np. mailto:)              |
| `environment`               | [RFC 5183](https://datatracker.ietf.org/doc/html/rfc5183)                              | Dostęp do informacji o środowisku                 |
| `mailbox`                   | [RFC 5490](https://datatracker.ietf.org/doc/html/rfc5490)                              | Testowanie istnienia skrzynek, tworzenie skrzynek|
| `special-use`               | [RFC 8579](https://datatracker.ietf.org/doc/html/rfc8579)                              | Przenoszenie do specjalnych skrzynek (\Junk, \Trash) |
| `duplicate`                 | [RFC 7352](https://datatracker.ietf.org/doc/html/rfc7352)                              | Wykrywanie duplikatów wiadomości                 |
| `ihave`                     | [RFC 5463](https://datatracker.ietf.org/doc/html/rfc5463)                              | Testowanie dostępności rozszerzenia               |
| `subaddress`                | [RFC 5233](https://datatracker.ietf.org/doc/html/rfc5233)                              | Dostęp do części adresu user+detail               |
#### Rozszerzenia Nieobsługiwane {#extensions-not-supported}

Następujące rozszerzenia nie są obecnie obsługiwane:

| Rozszerzenie                                                   | Powód                                                               |
| -------------------------------------------------------------- | ------------------------------------------------------------------ |
| `include`                                                      | Ryzyko bezpieczeństwa (wstrzyknięcie skryptu) i wymaga globalnego magazynu skryptów |
| `mboxmetadata` / `servermetadata`                              | Wymaga wsparcia rozszerzenia IMAP METADATA                         |
| `foreverypart` / `mime` / `extracttext` / `replace` / `enclose` | Złożona manipulacja drzewem MIME nie została jeszcze zaimplementowana |

#### Przykładowe Skrypty Sieve {#example-sieve-scripts}

**Przenoszenie newsletterów do folderu:**

```sieve
require ["fileinto"];

if header :contains "List-Id" "newsletter" {
    fileinto "Newsletters";
}
```

**Automatyczna odpowiedź podczas urlopu:**

```sieve
require ["vacation"];

vacation :days 7 :subject "Out of Office"
    "Obecnie jestem poza biurem i odpowiem po powrocie.";
```

**Oznaczanie wiadomości od ważnych nadawców:**

```sieve
require ["imap4flags"];

if address :is "from" "boss@example.com" {
    setflag "\\Flagged";
}
```

**Odrzucanie spamu z określonymi tematami:**

```sieve
require ["reject"];

if header :contains "subject" ["lottery", "winner", "urgent transfer"] {
    reject "Wiadomość odrzucona z powodu zawartości spamu.";
}
```

#### Zarządzanie Skryptami Sieve {#managing-sieve-scripts}

Możesz zarządzać swoimi skryptami Sieve na kilka sposobów:

1. **Interfejs WWW**: Przejdź do <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Moje Konto <i class="fa fa-angle-right"></i> Domeny</a> <i class="fa fa-angle-right"></i> Aliasów <i class="fa fa-angle-right"></i> Skrypty Sieve, aby tworzyć i zarządzać skryptami.

2. **Protokół ManageSieve**: Połącz się za pomocą dowolnego klienta kompatybilnego z ManageSieve (np. dodatku Sieve do Thunderbirda lub [sieve-connect](https://github.com/philpennock/sieve-connect)) do `imap.forwardemail.net`. Użyj portu `2190` z STARTTLS (zalecane dla większości klientów) lub portu `4190` z implicit TLS.

3. **API**: Użyj naszego [REST API](/api#sieve-scripts), aby programowo zarządzać skryptami.

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Uwaga:
  </strong>
  <span>
    Filtrowanie Sieve jest stosowane do przychodzących wiadomości przed ich zapisaniem w skrzynce pocztowej. Skrypty są wykonywane według priorytetu, a pierwsza pasująca akcja decyduje o sposobie obsługi wiadomości.
  </span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Bezpieczeństwo:
  </strong>
  <span>
    Ze względów bezpieczeństwa akcje przekierowania są ograniczone do 10 na skrypt i 100 dziennie. Odpowiedzi urlopowe są ograniczone, aby zapobiec nadużyciom.
  </span>
</div>

### Czy obsługujecie MTA-STS {#do-you-support-mta-sts}

Tak, od 2 marca 2023 obsługujemy [MTA-STS](https://www.hardenize.com/blog/mta-sts). Możesz użyć [tego szablonu](https://github.com/jpawlowski/mta-sts.template), jeśli chcesz włączyć go na swojej domenie.

Nasza konfiguracja jest publicznie dostępna na GitHub pod adresem <https://github.com/forwardemail/mta-sts.forwardemail.net>.

### Czy obsługujecie passkeys i WebAuthn {#do-you-support-passkeys-and-webauthn}

Tak! Od 13 grudnia 2023 dodaliśmy wsparcie dla passkeys [ze względu na duże zapotrzebowanie](https://github.com/orgs/forwardemail/discussions/182).

Passkeys pozwalają na bezpieczne logowanie bez konieczności używania hasła i uwierzytelniania dwuskładnikowego.

Możesz potwierdzić swoją tożsamość za pomocą dotyku, rozpoznawania twarzy, hasła urządzenia lub PIN-u.

Pozwalamy zarządzać do 30 passkeys jednocześnie, dzięki czemu możesz łatwo logować się ze wszystkich swoich urządzeń.

Dowiedz się więcej o passkeys pod następującymi linkami:

* [Logowanie do aplikacji i stron internetowych za pomocą passkeys](https://support.google.com/android/answer/14124480?hl=en) (Google)
* [Używanie passkeys do logowania się do aplikacji i stron internetowych na iPhonie](https://support.apple.com/guide/iphone/use-passkeys-to-sign-in-to-apps-and-websites-iphf538ea8d0/ios) (Apple)
* [Artykuł Wikipedii o Passkeys](https://en.wikipedia.org/wiki/Passkey_\(credential\))
### Czy wspieracie najlepsze praktyki emailowe {#do-you-support-email-best-practices}

Tak. Mamy wbudowane wsparcie dla SPF, DKIM, DMARC, ARC i SRS we wszystkich planach. Współpracowaliśmy również intensywnie z oryginalnymi autorami tych specyfikacji oraz innymi ekspertami od emaili, aby zapewnić perfekcję i wysoką dostarczalność.

### Czy wspieracie webhooki odbić (bounce) {#do-you-support-bounce-webhooks}

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Wskazówka:
  </strong>
    Szukasz dokumentacji dotyczącej webhooków emailowych? Zobacz <a href="/faq#do-you-support-webhooks" class="alert-link">Czy wspieracie webhooki?</a> aby uzyskać więcej informacji.
  <span>
  </span>
</div>

Tak, od 14 sierpnia 2024 dodaliśmy tę funkcję. Możesz teraz przejść do Moje Konto → Domeny → Ustawienia → URL webhooka odbić i skonfigurować adres `http://` lub `https://`, na który będziemy wysyłać żądanie `POST` za każdym razem, gdy wychodzące emaile SMTP zostaną odrzucone.

Jest to przydatne do zarządzania i monitorowania wychodzących emaili SMTP – i może być używane do utrzymania subskrybentów, rezygnacji oraz wykrywania wystąpienia odbić.

Dane webhooka odbicia są wysyłane jako JSON z następującymi właściwościami:

* `email_id` (String) - ID emaila odpowiadające emailowi w Moje Konto → Emaile (wychodzące SMTP)
* `list_id` (String) - wartość nagłówka `List-ID` (niezależna od wielkości liter), jeśli istnieje, z oryginalnego wychodzącego emaila
* `list_unsubscribe` (String) - wartość nagłówka `List-Unsubscribe` (niezależna od wielkości liter), jeśli istnieje, z oryginalnego wychodzącego emaila
* `feedback_id` (String) - wartość nagłówka `Feedback-ID` (niezależna od wielkości liter), jeśli istnieje, z oryginalnego wychodzącego emaila
* `recipient` (String) - adres email odbiorcy, który został odrzucony lub wystąpił błąd
* `message` (String) - szczegółowa wiadomość o błędzie odbicia
* `response` (String) - wiadomość odpowiedzi SMTP
* `response_code` (Number) - sparsowany kod odpowiedzi SMTP
* `truth_source` (String) - jeśli kod odpowiedzi pochodził z zaufanego źródła, ta wartość będzie zawierać nazwę domeny głównej (np. `google.com` lub `yahoo.com`)
* `bounce` (Object) - obiekt zawierający następujące właściwości opisujące odbicie i status odrzucenia
  * `action` (String) - akcja odbicia (np. `"reject"`)
  * `message` (String) - powód odbicia (np. `"Message Sender Blocked By Receiving Server"`)
  * `category` (String) - kategoria odbicia (np. `"block"`)
  * `code` (Number) - kod statusu odbicia (np. `554`)
  * `status` (String) - kod odbicia z wiadomości odpowiedzi (np. `5.7.1`)
  * `line` (Number) - sparsowany numer linii, jeśli istnieje, [z listy parsowania odbić Zone-MTA](https://github.com/zone-eu/zone-mta/blob/master/config/bounces.txt) (np. `526`)
* `headers` (Object) - pary klucz-wartość nagłówków dla wychodzącego emaila
* `bounced_at` (String) - data w formacie [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601), kiedy wystąpił błąd odbicia

Na przykład:

```json
{
  "email_id": "66bcce793ef7b2a0928e14ba",
  "recipient": "example@gmail.com",
  "message": "Konto email, do którego próbowałeś dotrzeć, przekroczyło limit.",
  "response": "552 5.2.2 Konto email, do którego próbowałeś dotrzeć, przekroczyło limit.",
  "response_code": 552,
  "truth_source": "google.com",
  "bounce": {
    "action": "reject",
    "message": "Skrzynka Gmail jest pełna",
    "category": "capacity",
    "code": 552,
    "status": "5.2.2",
    "line": 300
  },
  "headers": {},
  "bounced_at": "2024-08-24T01:50:02.828Z"
}
```

Oto kilka dodatkowych uwag dotyczących webhooków odbić:

* Jeśli ładunek webhooka zawiera wartość `list_id`, `list_unsubscribe` lub `feedback_id`, powinieneś podjąć odpowiednie działania, aby w razie potrzeby usunąć `recipient` z listy.
  * Jeśli wartość `bounce.category` była jedną z `"block"`, `"recipient"`, `"spam"` lub `"virus"`, zdecydowanie powinieneś usunąć użytkownika z listy.
* Jeśli potrzebujesz zweryfikować ładunki webhooków (aby upewnić się, że faktycznie pochodzą z naszego serwera), możesz [rozwiązać adres IP klienta zdalnego na nazwę hosta za pomocą odwrotnego wyszukiwania](https://nodejs.org/api/dns.html#dnspromisesreverseip) – powinno to być `smtp.forwardemail.net`.
  * Możesz również sprawdzić IP względem [naszych opublikowanych adresów IP](#what-are-your-servers-ip-addresses).
  * Przejdź do Moje Konto → Domeny → Ustawienia → Klucz weryfikacji podpisu ładunku webhooka, aby uzyskać swój klucz webhooka.
    * Możesz w każdej chwili obrócić ten klucz ze względów bezpieczeństwa.
    * Oblicz i porównaj wartość `X-Webhook-Signature` z naszego żądania webhooka z obliczoną wartością ciała przy użyciu tego klucza. Przykład, jak to zrobić, jest dostępny w [tym poście na Stack Overflow](https://stackoverflow.com/a/68885281).
  * Zobacz dyskusję na <https://github.com/forwardemail/free-email-forwarding/issues/235> dla dodatkowych informacji.
* Będziemy czekać do `5` sekund na odpowiedź Twojego endpointu webhooka ze statusem `200`, a następnie podejmiemy do `1` próby ponownego wysłania.
* Jeśli wykryjemy, że Twój URL webhooka odbić ma błąd podczas próby wysłania do niego żądania, wyślemy Ci uprzejmy email raz w tygodniu.
### Czy obsługujecie webhooki {#do-you-support-webhooks}

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Wskazówka:
  </strong>
    Szukasz dokumentacji dotyczącej webhooków odbić? Zobacz <a href="/faq#do-you-support-bounce-webhooks" class="alert-link">Czy obsługujecie webhooki odbić?</a> aby uzyskać więcej informacji.
  <span>
  </span>
</div>

Tak, od 15 maja 2020 dodaliśmy tę funkcję. Możesz po prostu dodać webhook(i) dokładnie tak, jak dodajesz dowolnego odbiorcę! Upewnij się, że w adresie URL webhooka jest prefiks protokołu "http" lub "https".

<div class="alert my-3 alert-danger">
  <i class="fa fa-stop-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Zwiększona ochrona prywatności:
  </strong>
  <span>
    Jeśli korzystasz z płatnego planu (który oferuje zwiększoną ochronę prywatności), przejdź do <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Moje konto <i class="fa fa-angle-right"></i> Domeny</a> i kliknij "Alias" obok swojej domeny, aby skonfigurować webhooki. Jeśli chcesz dowiedzieć się więcej o płatnych planach, zobacz naszą stronę <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Cennik</a>. W przeciwnym razie możesz kontynuować zgodnie z poniższymi instrukcjami.
  </span>
</div>

Jeśli korzystasz z darmowego planu, po prostu dodaj nowy rekord DNS <strong class="notranslate">TXT</strong> jak pokazano poniżej:

Na przykład, jeśli chcę, aby wszystkie e-maile wysyłane na `alias@example.com` były przekazywane do nowego testowego punktu końcowego [request bin](https://requestbin.com/r/en8pfhdgcculn?inspect):

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nazwa/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Odpowiedź/Wartość</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", lub puste</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=alias:https://requestbin.com/r/en8pfhdgcculn</code></td>
    </tr>
  </tbody>
</table>

Lub może chcesz, aby wszystkie e-maile wysyłane na `example.com` były przekazywane do tego punktu końcowego:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nazwa/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Odpowiedź/Wartość</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", lub puste</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=https://requestbin.com/r/en8pfhdgcculn</code></td>
    </tr>
  </tbody>
</table>

**Oto dodatkowe uwagi dotyczące webhooków:**

* Jeśli musisz zweryfikować ładunek webhooka (aby upewnić się, że faktycznie pochodzi z naszego serwera), możesz [rozwiązać zdalny adres IP klienta na nazwę hosta klienta za pomocą odwrotnego wyszukiwania](https://nodejs.org/api/dns.html#dnspromisesreverseip) – powinien to być `mx1.forwardemail.net` lub `mx2.forwardemail.net`.
  * Możesz także sprawdzić IP względem [naszych opublikowanych adresów IP](#what-are-your-servers-ip-addresses).
  * Jeśli korzystasz z płatnego planu, przejdź do Moje konto → Domeny → Ustawienia → Klucz weryfikacji podpisu ładunku webhooka, aby uzyskać swój klucz webhooka.
    * Możesz w dowolnym momencie zmienić ten klucz ze względów bezpieczeństwa.
    * Oblicz i porównaj wartość `X-Webhook-Signature` z naszego żądania webhooka z obliczoną wartością ciała przy użyciu tego klucza. Przykład, jak to zrobić, jest dostępny w [tym poście na Stack Overflow](https://stackoverflow.com/a/68885281).
  * Zobacz dyskusję na <https://github.com/forwardemail/free-email-forwarding/issues/235> dla dodatkowych informacji.
* Jeśli webhook nie odpowie kodem statusu `200`, przechowamy jego odpowiedź w [utworzonym dzienniku błędów](#do-you-store-error-logs) – co jest przydatne do debugowania.
* Żądania HTTP webhooka będą ponawiane do 3 razy przy każdej próbie połączenia SMTP, z maksymalnym czasem oczekiwania 60 sekund na każde żądanie POST do punktu końcowego. **Uwaga, to nie oznacza, że ponawia tylko 3 razy**, faktycznie będzie ponawiać ciągle w czasie, wysyłając kod SMTP 421 (co oznacza dla nadawcy "spróbuj ponownie później") po 3 nieudanych próbach żądania HTTP POST. Oznacza to, że e-mail będzie ponawiany przez wiele dni, aż zostanie osiągnięty kod statusu 200.
* Będziemy automatycznie ponawiać na podstawie domyślnych kodów statusu i błędów używanych w [metodzie retry biblioteki superagent](https://ladjs.github.io/superagent/#retrying-requests) (jesteśmy jej opiekunami).
* Grupujemy żądania HTTP webhooków do tego samego punktu końcowego w jedno żądanie zamiast wielu, aby oszczędzać zasoby i przyspieszyć czas odpowiedzi. Na przykład, jeśli wyślesz e-mail na <webhook1@example.com>, <webhook2@example.com> i <webhook3@example.com>, a wszystkie są skonfigurowane do trafienia do tego samego *dokładnego* adresu URL punktu końcowego, zostanie wykonane tylko jedno żądanie. Grupujemy według dokładnego dopasowania punktu końcowego z użyciem ścisłej równości.
* Zauważ, że używamy metody "simpleParser" z biblioteki [mailparser](https://nodemailer.com/extras/mailparser/) do parsowania wiadomości na obiekt przyjazny JSON.
* Surowa wartość e-maila jako String jest dostępna pod właściwością "raw".
* Wyniki uwierzytelniania są dostępne jako właściwości "dkim", "spf", "arc", "dmarc" i "bimi".
* Parsowane nagłówki e-maila są dostępne pod właściwością "headers" – ale możesz też użyć "headerLines" dla łatwiejszej iteracji i parsowania.
* Grupowani odbiorcy dla tego webhooka są zgrupowani razem i dostępni pod właściwością "recipients".
* Informacje o sesji SMTP są dostępne pod właściwością "session". Zawiera to informacje o nadawcy wiadomości, czasie przybycia wiadomości, HELO i nazwie hosta klienta. Wartość nazwy hosta klienta jako `session.clientHostname` to albo FQDN (z odwrotnego wyszukiwania PTR) albo `session.remoteAddress` opakowany w nawiasy (np. `"[127.0.0.1]"`).
* Jeśli potrzebujesz szybkiego sposobu na uzyskanie wartości `X-Original-To`, możesz użyć wartości `session.recipient` (zobacz przykład poniżej). Nagłówek `X-Original-To` to nagłówek, który dodajemy do wiadomości do debugowania z oryginalnym odbiorcą (przed maskowanym przekierowaniem) wiadomości.
* Jeśli chcesz usunąć właściwości `attachments` i/lub `raw` z ciała ładunku, po prostu dodaj `?attachments=false`, `?raw=false` lub `?attachments=false&raw=false` do adresu URL punktu końcowego webhooka jako parametr zapytania (np. `https://example.com/webhook?attachments=false&raw=false`).
* Jeśli są załączniki, zostaną dołączone do tablicy `attachments` jako wartości Buffer. Możesz je ponownie sparsować do zawartości za pomocą podejścia w JavaScript, na przykład:
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

### Czy obsługujecie wyrażenia regularne lub regex {#do-you-support-regular-expressions-or-regex}

Tak, od 27 września 2021 dodaliśmy tę funkcję. Możesz po prostu pisać wyrażenia regularne („regex”) do dopasowywania aliasów i wykonywania podstawień.

Aliasami obsługującymi wyrażenia regularne są te, które zaczynają się od `/` i kończą na `/`, a ich odbiorcami są adresy e-mail lub webhooki. Odbiorcy mogą również zawierać wsparcie dla podstawień regex (np. `$1`, `$2`).

Obsługujemy dwa flagi wyrażeń regularnych, w tym `i` i `g`. Flaga ignorująca wielkość liter `i` jest domyślnie włączona na stałe i zawsze wymuszona. Flaga globalna `g` może być dodana przez Ciebie poprzez dołączenie `/g` na końcu wyrażenia.

Zauważ, że wspieramy również naszą <a href="#can-i-disable-specific-aliases">funkcję wyłączania aliasów</a> dla części odbiorcy w ramach wsparcia regex.

Wyrażenia regularne nie są obsługiwane na <a href="/disposable-addresses" target="_blank">globalnych domenach vanity</a> (ponieważ mogłoby to stanowić lukę bezpieczeństwa).

<div class="alert my-3 alert-danger">
  <i class="fa fa-stop-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Zwiększona ochrona prywatności:
  </strong>
  <span>
    Jeśli korzystasz z płatnego planu (który oferuje zwiększoną ochronę prywatności), przejdź do <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Moje konto <i class="fa fa-angle-right"></i> Domeny</a> i kliknij „Aliasy” obok swojej domeny, aby skonfigurować aliasy, w tym te z wyrażeniami regularnymi. Jeśli chcesz dowiedzieć się więcej o płatnych planach, zobacz naszą stronę <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Cennik</a>.
  </span>
</div>

#### Przykłady dla zwiększonej ochrony prywatności {#examples-for-enhanced-privacy-protection}

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nazwa aliasu</th>
      <th>Efekt</th>
      <th>Test</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>/^(linus|torvalds)$/</code></td>
      <td>E-maile do `linus@example.com` lub `torvalds@example.com`</td>
      <td>(<a href="https://regexr.com/8gb8n" class="alert-link">zobacz test na RegExr</a>)</td>
    </tr>
    <tr>
      <td><code>/^24highst(reet)$/</code></td>
      <td>E-maile do `24highst@example.com` lub `24highstreet@example.com`</td>
      <td>(<a href="https://regexr.com/8g9rb" class="alert-link">zobacz test na RegExr</a>)</td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Wskazówka:
  </strong>
    Aby przetestować je na <a href="https://regexr.com" class="alert-link">RegExr</a>, wpisz wyrażenie w górnym polu, a następnie wpisz przykładowy alias w polu tekstowym poniżej. Jeśli pasuje, pole zmieni kolor na niebieski.
  <span>
  </span>
</div>

#### Przykłady dla darmowego planu {#examples-for-the-free-plan}

Jeśli korzystasz z darmowego planu, po prostu dodaj nowy rekord DNS <strong class="notranslate">TXT</strong> używając jednego lub więcej z poniższych przykładów:

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Prosty przykład:</strong> Jeśli chcę, aby wszystkie e-maile wysyłane do `linus@example.com` lub `torvalds@example.com` były przekazywane na `user@gmail.com`:
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nazwa/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Odpowiedź/Wartość</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", lub puste</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(linus|torvalds)$/:user@gmail.com</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Przykład podstawienia imienia i nazwiska:</strong> Załóżmy, że wszystkie adresy e-mail w Twojej firmie mają wzór `firstname.lastname@example.com`. Jeśli chcę, aby wszystkie e-maile wysyłane do wzoru `firstname.lastname@example.com` były przekazywane na `firstname.lastname@company.com` z obsługą podstawień (<a href="https://regexr.com/66hnu" class="alert-link">zobacz test na RegExr</a>):
</div>
<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nazwa/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Odpowiedź/Wartość</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", lub puste</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^([A-Za-z]+)+\.([A-Za-z]+)+$/:$1.$2@company.com</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Przykład filtrowania z symbolem plusa:</strong> Jeśli chcę, aby wszystkie e-maile wysyłane na `info@example.com` lub `support@example.com` były przekierowywane odpowiednio na `user+info@gmail.com` lub `user+support@gmail.com` (z obsługą podstawienia) (<a href="https://regexr.com/66ho7" class="alert-link">zobacz test na RegExr</a>):
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nazwa/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Odpowiedź/Wartość</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", lub puste</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(support|info)$/:user+$1@gmail.com</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Przykład podstawienia ciągu zapytania webhook:</strong> Być może chcesz, aby wszystkie e-maile wysyłane na `example.com` trafiały do <a href="#do-you-support-webhooks" class="alert-link">webhooka</a> i miały dynamiczny klucz ciągu zapytania "to" z wartością będącą częścią nazwy użytkownika adresu e-mail (<a href="https://regexr.com/66ho4" class="alert-link">zobacz test na RegExr</a>):
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nazwa/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Odpowiedź/Wartość</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", lub puste</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(.*?)$/:https://example.com/webhook?username=$1</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Przykład cichego odrzucenia:</strong> Jeśli chcesz, aby wszystkie e-maile pasujące do określonego wzoru były wyłączone i cicho odrzucane (dla nadawcy wygląda to, jakby wiadomość została wysłana pomyślnie, ale faktycznie nigdzie nie trafia) ze statusem `250` (zobacz <a href="#can-i-disable-specific-aliases" class="alert-link">Czy mogę wyłączyć konkretne aliasy</a>), po prostu użyj tego samego podejścia z pojedynczym wykrzyknikiem "!". Oznacza to dla nadawcy, że wiadomość została pomyślnie dostarczona, ale faktycznie nigdzie nie trafiła (np. czarna dziura lub `/dev/null`).
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nazwa/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Odpowiedź/Wartość</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", lub puste</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(linus|torvalds)$/:!</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Przykład miękkiego odrzucenia:</strong> Jeśli chcesz, aby wszystkie e-maile pasujące do określonego wzoru były wyłączone i miękko odrzucane ze statusem `421` (zobacz <a href="#can-i-disable-specific-aliases" class="alert-link">Czy mogę wyłączyć konkretne aliasy</a>), po prostu użyj tego samego podejścia z podwójnym wykrzyknikiem "!!". Oznacza to dla nadawcy, aby spróbował ponownie wysłać e-mail, a wiadomości do tego aliasu będą ponawiane przez około 5 dni, a następnie odrzucone na stałe.
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nazwa/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Odpowiedź/Wartość</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", lub puste</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(linus|torvalds)$/:!!</code></td>
    </tr>
  </tbody>
</table>
<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Przykład twardego odrzucenia:</strong> Jeśli chcesz, aby wszystkie e-maile pasujące do określonego wzoru były wyłączone i twardo odrzucone ze statusem `550` (zobacz <a href="#can-i-disable-specific-aliases" class="alert-link">Czy mogę wyłączyć konkretne aliasy</a>), po prostu użyj tego samego podejścia z potrójnym wykrzyknikiem "!!!". Oznacza to dla nadawcy błąd trwały i e-maile nie będą ponawiane, zostaną odrzucone dla tego aliasu.
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nazwa/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Odpowiedź/Wartość</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", lub puste</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=/^(linus|torvalds)$/:!!!</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Wskazówka:
  </strong>
    Zastanawiasz się, jak napisać wyrażenie regularne lub potrzebujesz przetestować swoją zamianę? Możesz skorzystać z darmowej strony do testowania wyrażeń regularnych <a href="https://regexr.com" class="alert-link">RegExr</a> pod adresem <a href="https://regexr.com/" class="alert-link">https://regexr.com</a>.
  <span>
  </span>
</div>

### Jakie są Twoje limity wychodzącej poczty SMTP {#what-are-your-outbound-smtp-limits}

Ograniczamy użytkowników i domeny do 300 wychodzących wiadomości SMTP na 1 dzień. To średnio ponad 9000 e-maili w miesiącu kalendarzowym. Jeśli potrzebujesz przekroczyć tę ilość lub masz stale duże wiadomości, prosimy o [kontakt z nami](https://forwardemail.net/help).

### Czy potrzebuję zgody, aby włączyć SMTP {#do-i-need-approval-to-enable-smtp}

Tak, prosimy pamiętać, że aby utrzymać reputację IP i zapewnić dostarczalność, Forward Email ma ręczny proces weryfikacji na poziomie domeny dla zatwierdzenia wychodzącego SMTP. Napisz na <support@forwardemail.net> lub otwórz [zgłoszenie pomocy](https://forwardemail.net/help) w celu uzyskania zgody. Zazwyczaj zajmuje to mniej niż 24 godziny, a większość zgłoszeń jest rozpatrywana w ciągu 1-2 godzin. W niedalekiej przyszłości planujemy uczynić ten proces natychmiastowym z dodatkowymi kontrolami antyspamowymi i alertami. Proces ten zapewnia, że Twoje e-maile trafiają do skrzynki odbiorczej i nie są oznaczane jako spam.

### Jakie są ustawienia konfiguracyjne Twojego serwera SMTP {#what-are-your-smtp-server-configuration-settings}

Nasz serwer to `smtp.forwardemail.net` i jest również monitorowany na naszej <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">stronie statusu</a>.

Obsługuje zarówno IPv4, jak i IPv6 i jest dostępny na portach `465` i `2465` dla SSL/TLS (zalecane) oraz `587`, `2587`, `2525` i `25` dla TLS (STARTTLS).

**Od października 2025** obsługujemy teraz **starsze połączenia TLS 1.0** na portach `2455` (SSL/TLS) i `2555` (STARTTLS) dla starszych urządzeń takich jak drukarki, skanery, kamery i starsze klienty poczty, które nie obsługują nowoczesnych wersji TLS. Te porty są alternatywą dla Gmaila, Yahoo, Outlooka i innych dostawców, którzy zaprzestali wsparcia dla starszych protokołów TLS.

> \[!CAUTION]
> **Wsparcie dla starszego TLS 1.0 (porty 2455 i 2555)**: Te porty używają przestarzałego protokołu TLS 1.0, który ma znane luki bezpieczeństwa (BEAST, POODLE). Używaj tych portów tylko, jeśli Twoje urządzenie absolutnie nie może obsłużyć TLS 1.2 lub wyższego. Zalecamy zdecydowanie aktualizację oprogramowania urządzenia lub przejście na nowoczesne klienty poczty, gdy to możliwe. Te porty są przeznaczone wyłącznie do kompatybilności ze starszym sprzętem (stare drukarki, skanery, kamery, urządzenia IoT).

|                                     Protokół                                     | Nazwa hosta             |            Porty            |        IPv4        |        IPv6        | Uwagi                                  |
| :------------------------------------------------------------------------------: | ----------------------- | :-------------------------: | :----------------: | :----------------: | -------------------------------------- |
|                              `SSL/TLS` **Preferowany**                           | `smtp.forwardemail.net` |        `465`, `2465`        | :white_check_mark: | :white_check_mark: | Nowoczesny TLS 1.2+ (zalecany)         |
|         `TLS` ([STARTTLS](https://wikipedia.org/wiki/Opportunistic_TLS))         | `smtp.forwardemail.net` | `587`, `2587`, `2525`, `25` | :white_check_mark: | :white_check_mark: | Obsługiwany (preferuj port SSL/TLS `465`) |
|                             `SSL/TLS` **Tylko starszy**                          | `smtp.forwardemail.net` |            `2455`           | :white_check_mark: | :white_check_mark: | :warning: TLS 1.0 tylko dla starych urządzeń |
| `TLS` ([STARTTLS](https://wikipedia.org/wiki/Opportunistic_TLS)) **Tylko starszy** | `smtp.forwardemail.net` |            `2555`           | :white_check_mark: | :white_check_mark: | :warning: TLS 1.0 tylko dla starych urządzeń |
| Login    | Przykład                  | Opis                                                                                                                                                                                     |
| -------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Username | `user@example.com`        | Adres e-mail aliasu, który istnieje dla domeny w <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Moje konto <i class="fa fa-angle-right"></i> Domeny</a>.           |
| Password | `************************` | Alias                                                                                                                                                                                    |

Aby wysyłać wiadomości e-mail za pomocą SMTP, **użytkownik SMTP** musi być adresem e-mail aliasu, który istnieje dla domeny w <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Moje konto <i class="fa fa-angle-right"></i> Domeny</a> – a **hasło SMTP** musi być hasłem wygenerowanym specyficznie dla aliasu.

Proszę zapoznać się z [Czy obsługujecie wysyłanie e-maili przez SMTP](#do-you-support-sending-email-with-smtp) aby uzyskać instrukcje krok po kroku.

### Jakie są ustawienia konfiguracyjne serwera IMAP {#what-are-your-imap-server-configuration-settings}

Nasz serwer to `imap.forwardemail.net` i jest również monitorowany na naszej <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">stronie statusu</a>.

Obsługuje zarówno IPv4, jak i IPv6 i jest dostępny na portach `993` oraz `2993` dla SSL/TLS.

|         Protokół         | Nazwa hosta             |     Porty     |        IPv4        |        IPv6        |
| :---------------------: | ----------------------- | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **Preferowany** | `imap.forwardemail.net` | `993`, `2993` | :white_check_mark: | :white_check_mark: |

| Login    | Przykład                  | Opis                                                                                                                                                                                     |
| -------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Username | `user@example.com`        | Adres e-mail aliasu, który istnieje dla domeny w <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Moje konto <i class="fa fa-angle-right"></i> Domeny</a>.           |
| Password | `************************` | Hasło wygenerowane specyficznie dla aliasu.                                                                                                                                               |

Aby połączyć się przez IMAP, **użytkownik IMAP** musi być adresem e-mail aliasu, który istnieje dla domeny w <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Moje konto <i class="fa fa-angle-right"></i> Domeny</a> – a **hasło IMAP** musi być hasłem wygenerowanym specyficznie dla aliasu.

Proszę zapoznać się z [Czy obsługujecie odbieranie e-maili przez IMAP](#do-you-support-receiving-email-with-imap) aby uzyskać instrukcje krok po kroku.

### Jakie są ustawienia konfiguracyjne serwera POP3 {#what-are-your-pop3-server-configuration-settings}

Nasz serwer to `pop3.forwardemail.net` i jest również monitorowany na naszej <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">stronie statusu</a>.

Obsługuje zarówno IPv4, jak i IPv6 i jest dostępny na portach `995` oraz `2995` dla SSL/TLS.

|         Protokół         | Nazwa hosta             |     Porty     |        IPv4        |        IPv6        |
| :---------------------: | ----------------------- | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **Preferowany** | `pop3.forwardemail.net` | `995`, `2995` | :white_check_mark: | :white_check_mark: |
| Login    | Przykład                  | Opis                                                                                                                                                                                     |
| -------- | ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Username | `user@example.com`        | Adres e-mail aliasu, który istnieje dla domeny w <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Moje Konto <i class="fa fa-angle-right"></i> Domeny</a>.           |
| Password | `************************`| Wygenerowane hasło specyficzne dla aliasu.                                                                                                                                               |

Aby połączyć się przez POP3, **użytkownik POP3** musi być adresem e-mail aliasu, który istnieje dla domeny w <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Moje Konto <i class="fa fa-angle-right"></i> Domeny</a> – a **hasło IMAP** musi być wygenerowanym hasłem specyficznym dla aliasu.

Proszę zapoznać się z [Czy obsługujecie POP3](#do-you-support-pop3) aby uzyskać instrukcje krok po kroku.

### Jak skonfigurować autodiscovery poczty dla mojej domeny {#how-do-i-set-up-email-autodiscovery-for-my-domain}

Autodiscovery poczty pozwala klientom pocztowym takim jak **Thunderbird**, **Apple Mail**, **Microsoft Outlook** oraz urządzeniom mobilnym automatycznie wykrywać poprawne ustawienia serwerów IMAP, SMTP, POP3, CalDAV i CardDAV, gdy użytkownik dodaje swoje konto e-mail. Jest to zdefiniowane przez [RFC 6186](https://www.rfc-editor.org/rfc/rfc6186.html) (poczta) oraz [RFC 6764](https://www.rfc-editor.org/rfc/rfc6764.html) (CalDAV/CardDAV) i wykorzystuje rekordy DNS SRV.

Forward Email publikuje rekordy autodiscovery na `forwardemail.net`. Możesz dodać rekordy SRV bezpośrednio do swojej domeny lub użyć prostszego podejścia z CNAME.

#### Opcja A: rekordy CNAME (najprostsze) {#option-a-cname-records-simplest}

Dodaj te dwa rekordy CNAME do DNS swojej domeny. To deleguje autodiscovery na serwery Forward Email:

|  Typ  | Nazwa/Host    | Cel/Wartość                   |
| :---: | ------------- | ----------------------------- |
| CNAME | `autoconfig`  | `autoconfig.forwardemail.net` |
| CNAME | `autodiscover`| `autodiscover.forwardemail.net` |

Rekord `autoconfig` jest używany przez **Thunderbird** i innych klientów opartych na Mozilli. Rekord `autodiscover` jest używany przez **Microsoft Outlook**.

#### Opcja B: rekordy SRV (bezpośrednie) {#option-b-srv-records-direct}

Jeśli wolisz dodać rekordy bezpośrednio (lub twój dostawca DNS nie obsługuje CNAME na subdomenach), dodaj te rekordy SRV do swojej domeny:

| Typ | Nazwa/Host           | Priorytet | Waga | Port | Cel/Wartość               | Przeznaczenie                             |
| :--:| -------------------- | :-------: | :---:| :--: | ------------------------- | ----------------------------------------- |
| SRV | `_imaps._tcp`        |     0     |  1   |  993 | `imap.forwardemail.net`   | IMAP przez SSL/TLS (preferowane)          |
| SRV | `_imap._tcp`         |     0     |  0   |  0   | `.`                       | IMAP w postaci zwykłego tekstu wyłączony  |
| SRV | `_submissions._tcp`  |     0     |  1   |  465 | `smtp.forwardemail.net`   | Wysyłanie SMTP (SSL/TLS, zalecane)         |
| SRV | `_submission._tcp`   |     5     |  1   |  587 | `smtp.forwardemail.net`   | Wysyłanie SMTP (STARTTLS)                  |
| SRV | `_pop3s._tcp`        |    10     |  1   |  995 | `pop3.forwardemail.net`   | POP3 przez SSL/TLS                         |
| SRV | `_pop3._tcp`         |     0     |  0   |  0   | `.`                       | POP3 w postaci zwykłego tekstu wyłączony  |
| SRV | `_caldavs._tcp`      |     0     |  1   |  443 | `caldav.forwardemail.net` | CalDAV przez TLS (kalendarze)              |
| SRV | `_caldav._tcp`       |     0     |  0   |  0   | `.`                       | CalDAV w postaci zwykłego tekstu wyłączony|
| SRV | `_carddavs._tcp`     |     0     |  1   |  443 | `carddav.forwardemail.net`| CardDAV przez TLS (kontakty)                |
| SRV | `_carddav._tcp`      |     0     |  0   |  0   | `.`                       | CardDAV w postaci zwykłego tekstu wyłączony|
> \[!NOTE]
> IMAP ma niższą wartość priorytetu (0) niż POP3 (10), co wskazuje klientom poczty, aby preferowali IMAP zamiast POP3, gdy oba są dostępne. Rekordy z celem `.` (pojedyncza kropka) oznaczają, że wersje tekstowe (niezaszyfrowane) tych protokołów są celowo wyłączone zgodnie z [RFC 6186 Sekcja 3.4](https://www.rfc-editor.org/rfc/rfc6186.html#section-3.4). Rekordy SRV CalDAV i CardDAV są zgodne z [RFC 6764](https://www.rfc-editor.org/rfc/rfc6764.html) dla automatycznego wykrywania kalendarza i kontaktów.

#### Które klienty poczty obsługują automatyczne wykrywanie? {#which-email-clients-support-autodiscovery}

| Klient             | Poczta                                           | CalDAV/CardDAV                             |
| ------------------ | ------------------------------------------------ | ------------------------------------------ |
| Thunderbird        | rekordy `autoconfig` CNAME lub SRV                | rekordy `autoconfig` XML lub SRV (RFC 6764) |
| Apple Mail (macOS) | rekordy SRV (RFC 6186)                           | rekordy SRV (RFC 6764)                     |
| Apple Mail (iOS)   | rekordy SRV (RFC 6186)                           | rekordy SRV (RFC 6764)                     |
| Microsoft Outlook  | rekordy `autodiscover` CNAME lub `_autodiscover._tcp` SRV | Nieobsługiwane                            |
| GNOME (Evolution)  | rekordy SRV (RFC 6186)                           | rekordy SRV (RFC 6764)                     |
| KDE (KMail)        | rekordy SRV (RFC 6186)                           | rekordy SRV (RFC 6764)                     |
| eM Client          | `autoconfig` lub `autodiscover`                   | rekordy SRV (RFC 6764)                     |

> \[!TIP]
> Dla najlepszej kompatybilności ze wszystkimi klientami zalecamy użycie **Opcji A** (rekordy CNAME) w połączeniu z rekordami SRV z **Opcji B**. Podejście CNAME samo w sobie obejmuje większość klientów poczty. Rekordy SRV CalDAV/CardDAV zapewniają, że klienci kalendarza i kontaktów również mogą automatycznie wykrywać ustawienia serwera.


## Bezpieczeństwo {#security-1}

### Zaawansowane techniki wzmacniania serwera {#advanced-server-hardening-techniques}

> \[!TIP]
> Dowiedz się więcej o naszej infrastrukturze bezpieczeństwa na [naszej stronie Bezpieczeństwo](/security).

Forward Email wdraża liczne techniki wzmacniania serwera, aby zapewnić bezpieczeństwo naszej infrastruktury i Twoich danych:

1. **Bezpieczeństwo sieci**:
   * zapora IP tables z rygorystycznymi regułami
   * Fail2ban do ochrony przed atakami brute force
   * regularne audyty bezpieczeństwa i testy penetracyjne
   * dostęp administracyjny tylko przez VPN

2. **Wzmacnianie systemu**:
   * minimalna instalacja pakietów
   * regularne aktualizacje bezpieczeństwa
   * SELinux w trybie wymuszającym
   * wyłączony dostęp root przez SSH
   * tylko uwierzytelnianie kluczem

3. **Bezpieczeństwo aplikacji**:
   * nagłówki Content Security Policy (CSP)
   * HTTPS Strict Transport Security (HSTS)
   * nagłówki ochrony przed XSS
   * nagłówki opcji ramki i polityki referera
   * regularne audyty zależności

4. **Ochrona danych**:
   * pełne szyfrowanie dysku za pomocą LUKS
   * bezpieczne zarządzanie kluczami
   * regularne kopie zapasowe z szyfrowaniem
   * praktyki minimalizacji danych

5. **Monitorowanie i reagowanie**:
   * wykrywanie włamań w czasie rzeczywistym
   * automatyczne skanowanie bezpieczeństwa
   * scentralizowane logowanie i analiza
   * procedury reagowania na incydenty

> \[!IMPORTANT]
> Nasze praktyki bezpieczeństwa są stale aktualizowane, aby przeciwdziałać nowym zagrożeniom i podatnościom.

> \[!TIP]
> Dla maksymalnego bezpieczeństwa zalecamy korzystanie z naszej usługi z szyfrowaniem end-to-end za pomocą OpenPGP.

### Czy posiadacie certyfikaty SOC 2 lub ISO 27001 {#do-you-have-soc-2-or-iso-27001-certifications}

> \[!NOTE]
> Forward Email działa na infrastrukturze dostarczanej przez certyfikowanych podwykonawców, aby zapewnić zgodność ze standardami branżowymi.

Forward Email nie posiada bezpośrednio certyfikatów SOC 2 Type II ani ISO 27001. Jednak usługa działa na infrastrukturze dostarczanej przez certyfikowanych podwykonawców:

* **DigitalOcean**: certyfikaty SOC 2 Type II i SOC 3 Type II (audytowane przez Schellman & Company LLC), certyfikat ISO 27001 w wielu centrach danych. Szczegóły: <https://www.digitalocean.com/trust/certification-reports>
* **Vultr**: certyfikaty SOC 2+ (HIPAA), ISO/IEC: 20000-1:2018, 27001:2022, 27017:2015, 27018:2019. Szczegóły: <https://www.vultr.com/legal/compliance/>

* **DataPacket**: zgodność z SOC 2 (skontaktuj się bezpośrednio z DataPacket, aby uzyskać certyfikat), dostawca infrastruktury klasy korporacyjnej (lokalizacja Denver). Szczegóły: <https://www.datapacket.com/datacenters/denver>

Forward Email stosuje najlepsze praktyki branżowe dotyczące audytów bezpieczeństwa i regularnie współpracuje z niezależnymi badaczami bezpieczeństwa. Źródło: <https://forwardemail.net/technical-whitepaper.pdf#page=36>

### Czy używacie szyfrowania TLS do przekazywania e-maili {#do-you-use-tls-encryption-for-email-forwarding}

Tak. Forward Email rygorystycznie wymusza TLS 1.2+ dla wszystkich połączeń (HTTPS, SMTP, IMAP, POP3) oraz implementuje MTA-STS dla wzmocnionego wsparcia TLS. Implementacja obejmuje:

* Wymuszanie TLS 1.2+ dla wszystkich połączeń e-mail
* Wymianę kluczy ECDHE (Elliptic Curve Diffie-Hellman Ephemeral) dla idealnej tajności przekazu
* Nowoczesne zestawy szyfrów z regularnymi aktualizacjami bezpieczeństwa
* Wsparcie HTTP/2 dla lepszej wydajności i bezpieczeństwa
* HSTS (HTTP Strict Transport Security) z preładowaniem w głównych przeglądarkach
* **MTA-STS (Mail Transfer Agent Strict Transport Security)** dla ścisłego wymuszania TLS

Źródło: <https://forwardemail.net/technical-whitepaper.pdf#page=25>

**Implementacja MTA-STS**: Forward Email wdraża ścisłe wymuszanie MTA-STS w kodzie. Gdy występują błędy TLS i MTA-STS jest wymuszane, system zwraca kody statusu SMTP 421, aby zapewnić ponowne próby wysłania wiadomości później, zamiast dostarczać je w sposób niebezpieczny. Szczegóły implementacji:

* Wykrywanie błędów TLS: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-tls-error.js>
* Wymuszanie MTA-STS w helperze send-email: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/send-email.js>

Weryfikacja zewnętrzna: <https://www.hardenize.com/report/forwardemail.net/1750312779> pokazuje oceny "Good" dla wszystkich środków bezpieczeństwa TLS i transportu.

### Czy zachowujecie nagłówki uwierzytelniania e-maili {#do-you-preserve-email-authentication-headers}

Tak. Forward Email kompleksowo implementuje i zachowuje nagłówki uwierzytelniania e-maili:

* **SPF (Sender Policy Framework)**: poprawnie zaimplementowany i zachowany
* **DKIM (DomainKeys Identified Mail)**: pełne wsparcie z właściwym zarządzaniem kluczami
* **DMARC**: egzekwowanie polityki dla wiadomości, które nie przejdą walidacji SPF lub DKIM
* **ARC**: choć nie jest to szczegółowo opisane, doskonałe wyniki zgodności usługi sugerują kompleksowe zarządzanie nagłówkami uwierzytelniania

Źródło: <https://forwardemail.net/technical-whitepaper.pdf#page=31>

Weryfikacja: test Internet.nl Mail Test pokazuje wynik 100/100 specjalnie dla implementacji "SPF, DKIM i DMARC". Ocena Hardenize potwierdza oceny "Good" dla SPF i DMARC: <https://www.hardenize.com/report/forwardemail.net/1750312779>

### Czy zachowujecie oryginalne nagłówki e-maili i zapobiegacie podszywaniu się {#do-you-preserve-original-email-headers-and-prevent-spoofing}

> \[!TIP]
> Forward Email wdraża zaawansowaną ochronę anty-podszywczą, aby zapobiegać nadużyciom e-mailowym.

Forward Email zachowuje oryginalne nagłówki e-maili, jednocześnie implementując kompleksową ochronę anty-podszywczą poprzez kod bazowy MX:

* **Zachowanie nagłówków**: oryginalne nagłówki uwierzytelniania są utrzymywane podczas przekazywania
* **Ochrona anty-podszywcza**: egzekwowanie polityki DMARC zapobiega podszywaniu się pod nagłówki przez odrzucanie wiadomości, które nie przejdą walidacji SPF lub DKIM
* **Zapobieganie wstrzykiwaniu nagłówków**: walidacja i oczyszczanie danych wejściowych za pomocą biblioteki striptags
* **Zaawansowana ochrona**: zaawansowane wykrywanie phishingu z detekcją podszywania się, zapobieganiem podszywaniu i systemami powiadamiania użytkownika

**Szczegóły implementacji MX**: Główna logika przetwarzania e-maili jest obsługiwana przez kod serwera MX, konkretnie:

* Główny handler danych MX: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>
* Filtrowanie dowolnych e-maili (anty-podszywanie): <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-arbitrary.js>

Helper `isArbitrary` implementuje zaawansowane reguły anty-podszywcze, w tym wykrywanie podszywania się pod domenę, blokowane frazy oraz różne wzorce phishingowe.
### Jak chronicie się przed spamem i nadużyciami {#how-do-you-protect-against-spam-and-abuse}

Forward Email wdraża kompleksową wielowarstwową ochronę:

* **Ograniczanie szybkości**: Stosowane do prób uwierzytelniania, punktów końcowych API oraz połączeń SMTP
* **Izolacja zasobów**: Między użytkownikami, aby zapobiec wpływowi użytkowników o dużym wolumenie
* **Ochrona przed DDoS**: Wielowarstwowa ochrona dzięki systemowi Shield firmy DataPacket oraz Cloudflare
* **Automatyczne skalowanie**: Dynamiczne dostosowanie zasobów w zależności od zapotrzebowania
* **Zapobieganie nadużyciom**: Sprawdzanie nadużyć specyficzne dla użytkownika oraz blokowanie oparte na hashach dla złośliwych treści
* **Uwierzytelnianie e-maili**: Protokoły SPF, DKIM, DMARC z zaawansowanym wykrywaniem phishingu

Źródła:

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver> (szczegóły ochrony DDoS)
* <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/abuse-prevention-by-user-id.js>

### Czy przechowujecie zawartość e-maili na dysku {#do-you-store-email-content-on-disk}

> \[!IMPORTANT]
> Forward Email używa architektury zero-knowledge, która zapobiega zapisywaniu zawartości e-maili na dysku.

* **Architektura zero-knowledge**: Indywidualnie szyfrowane skrzynki SQLite oznaczają, że Forward Email nie ma dostępu do zawartości e-maili
* **Przetwarzanie w pamięci**: Przetwarzanie e-maili odbywa się całkowicie w pamięci, bez zapisu na dysku
* **Brak logowania zawartości**: „Nie logujemy ani nie przechowujemy zawartości e-maili ani metadanych na dysku”
* **Szyfrowanie w piaskownicy**: Klucze szyfrowania nigdy nie są przechowywane na dysku w postaci jawnej

**Dowód w kodzie MX**: Serwer MX przetwarza e-maile całkowicie w pamięci, bez zapisu zawartości na dysku. Główny handler przetwarzania e-maili demonstruje to podejście w pamięci: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

Źródła:

* <https://forwardemail.net/technical-whitepaper.pdf#page=10> (Streszczenie)
* <https://forwardemail.net/technical-whitepaper.pdf#page=59> (Szczegóły zero-knowledge)
* <https://forwardemail.net/technical-whitepaper.pdf#page=21> (Szyfrowanie w piaskownicy)

### Czy zawartość e-maili może zostać ujawniona podczas awarii systemu {#can-email-content-be-exposed-during-system-crashes}

Nie. Forward Email wdraża kompleksowe zabezpieczenia przed ujawnieniem danych w wyniku awarii:

* **Wyłączone core dumpy**: Zapobiega ujawnieniu pamięci podczas awarii
* **Wyłączona pamięć swap**: Całkowicie wyłączona, aby zapobiec wydobyciu wrażliwych danych z plików swap
* **Architektura w pamięci**: Zawartość e-maili istnieje tylko w pamięci ulotnej podczas przetwarzania
* **Ochrona kluczy szyfrowania**: Klucze nigdy nie są przechowywane na dysku w postaci jawnej
* **Bezpieczeństwo fizyczne**: Dyski szyfrowane LUKS v2 zapobiegają fizycznemu dostępowi do danych
* **Wyłączone USB**: Zapobiega nieautoryzowanemu wydobyciu danych

**Obsługa błędów systemowych**: Forward Email używa funkcji pomocniczych `isCodeBug` i `isTimeoutError`, aby zapewnić, że w przypadku problemów z łącznością z bazą danych, problemów z DNS, siecią/blokadą lub problemów z łącznością upstream system zwraca kody statusu SMTP 421, co gwarantuje, że e-maile zostaną ponownie wysłane później, zamiast zostać utracone lub ujawnione.

Szczegóły implementacji:

* Klasyfikacja błędów: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js>
* Obsługa błędów timeout w przetwarzaniu MX: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

Źródło: <https://forwardemail.net/technical-whitepaper.pdf#page=15>

### Kto ma dostęp do waszej infrastruktury e-mailowej {#who-has-access-to-your-email-infrastructure}

Forward Email wdraża kompleksowe kontrole dostępu dla minimalnego 2-3 osobowego zespołu inżynierów z rygorystycznymi wymaganiami 2FA:

* **Kontrola dostępu oparta na rolach**: Dla kont zespołu z uprawnieniami opartymi na zasobach
* **Zasada najmniejszych uprawnień**: Stosowana we wszystkich systemach
* **Segregacja obowiązków**: Między rolami operacyjnymi
* **Zarządzanie użytkownikami**: Oddzielni użytkownicy deploy i devops z odrębnymi uprawnieniami
* **Wyłączone logowanie root**: Wymusza dostęp przez odpowiednio uwierzytelnione konta
* **Rygorystyczne 2FA**: Brak 2FA opartego na SMS z powodu ryzyka ataków MiTM – tylko aplikacje lub tokeny sprzętowe
* **Kompleksowe logowanie audytu**: Z redakcją danych wrażliwych
* **Automatyczne wykrywanie anomalii**: Dla nietypowych wzorców dostępu
* **Regularne przeglądy bezpieczeństwa**: Logów dostępu
* **Zapobieganie atakom typu Evil Maid**: Wyłączone USB i inne środki bezpieczeństwa fizycznego
Źródła:

* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (Kontrole autoryzacji)
* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (Bezpieczeństwo sieci)
* <https://forwardemail.net/technical-whitepaper.pdf#page=15> (Zapobieganie atakom typu evil maid)

### Jakich dostawców infrastruktury używacie {#what-infrastructure-providers-do-you-use}

> \[!IMPORTANT]
> Forward Email korzysta z wielu podwykonawców infrastruktury posiadających kompleksowe certyfikaty zgodności.

Pełne szczegóły dostępne są na naszej stronie zgodności z RODO: <https://forwardemail.net/gdpr>

**Główni podwykonawcy infrastruktury:**

| Dostawca        | Certyfikat ram prywatności danych | Strona zgodności z RODO                                                                |
| --------------- | --------------------------------- | -------------------------------------------------------------------------------------- |
| **Cloudflare**  | ✅ Tak                            | <https://www.cloudflare.com/trust-hub/gdpr/>                                           |
| **DataPacket**  | ❌ Nie                            | <https://www.datapacket.com/privacy-policy>                                            |
| **DigitalOcean**| ❌ Nie                            | <https://www.digitalocean.com/legal/gdpr>                                              |
| **GitHub**      | ✅ Tak                            | <https://docs.github.com/en/site-policy/privacy-policies/github-data-protection-agreement> |
| **Vultr**       | ❌ Nie                            | <https://www.vultr.com/legal/eea-gdpr-privacy/>                                        |

**Szczegółowe certyfikaty:**

**DigitalOcean**

* SOC 2 Type II & SOC 3 Type II (audytowane przez Schellman & Company LLC)
* Certyfikat ISO 27001 w wielu centrach danych
* Zgodność z PCI-DSS
* Certyfikat CSA STAR Poziom 1
* Certyfikat APEC CBPR PRP
* Szczegóły: <https://www.digitalocean.com/trust/certification-reports>

**Vultr**

* Certyfikat SOC 2+ (HIPAA)
* Zgodność z PCI Merchant
* Certyfikat CSA STAR Poziom 1
* ISO/IEC 20000-1:2018, 27001:2022, 27017:2015, 27018:2019
* Szczegóły: <https://www.vultr.com/legal/compliance/>

**DataPacket**

* Zgodność z SOC 2 (kontakt bezpośredni z DataPacket w celu uzyskania certyfikatu)
* Infrastruktura klasy enterprise (lokalizacja Denver)
* Ochrona DDoS przez stos cyberbezpieczeństwa Shield
* Całodobowe wsparcie techniczne
* Globalna sieć obejmująca 58 centrów danych
* Szczegóły: <https://www.datapacket.com/datacenters/denver>

**GitHub**

* Certyfikat Data Privacy Framework (EU-U.S., Swiss-U.S. oraz rozszerzenie UK)
* Hosting kodu źródłowego, CI/CD oraz zarządzanie projektami
* Dostępna Umowa o Ochronie Danych GitHub
* Szczegóły: <https://docs.github.com/en/site-policy/privacy-policies/github-data-protection-agreement>

**Procesory płatności:**

* **Stripe**: Certyfikat Data Privacy Framework - <https://stripe.com/legal/privacy-center>
* **PayPal**: Brak certyfikatu DPF - <https://www.paypal.com/uk/legalhub/privacy-full>

### Czy oferujecie Umowę o Przetwarzaniu Danych (DPA) {#do-you-offer-a-data-processing-agreement-dpa}

Tak, Forward Email oferuje kompleksową Umowę o Przetwarzaniu Danych (DPA), którą można podpisać wraz z naszą umową korporacyjną. Kopia naszej DPA jest dostępna pod adresem: <https://forwardemail.net/dpa>

**Szczegóły DPA:**

* Obejmuje zgodność z RODO oraz ramy EU-US/Swiss-US Privacy Shield
* Automatycznie akceptowana przy akceptacji naszych Warunków Usługi
* Nie wymaga osobnego podpisu dla standardowej DPA
* Możliwość indywidualnych ustaleń DPA w ramach Licencji Enterprise

**Ramowy system zgodności z RODO:**
Nasza DPA szczegółowo opisuje zgodność z RODO oraz międzynarodowe wymagania dotyczące transferu danych. Pełne informacje dostępne są pod adresem: <https://forwardemail.net/gdpr>

Dla klientów korporacyjnych wymagających indywidualnych warunków DPA lub specyficznych ustaleń umownych, można to załatwić w ramach naszego programu **Enterprise License (250 USD/miesiąc)**.

### Jak radzicie sobie z powiadomieniami o naruszeniach danych {#how-do-you-handle-data-breach-notifications}

> \[!NOTE]
> Architektura zero-knowledge Forward Email znacząco ogranicza skutki naruszeń.
* **Ograniczona ekspozycja danych**: Brak dostępu do zaszyfrowanej zawartości e-maili dzięki architekturze zero-knowledge
* **Minimalne zbieranie danych**: Tylko podstawowe informacje o subskrybentach oraz ograniczone logi IP dla bezpieczeństwa
* **Ramowe umowy z podwykonawcami**: DigitalOcean, GitHub i Vultr utrzymują procedury reagowania na incydenty zgodne z RODO

**Informacje o przedstawicielu RODO:**
Forward Email wyznaczył przedstawicieli RODO zgodnie z artykułem 27:

**Przedstawiciel UE:**
Osano International Compliance Services Limited
ATTN: LFHC
3 Dublin Landings, North Wall Quay
Dublin 1, D01C4E0

**Przedstawiciel Wielkiej Brytanii:**
Osano UK Compliance LTD
ATTN: LFHC
42-46 Fountain Street, Belfast
Antrim, BT1 - 5EF

Dla klientów korporacyjnych wymagających określonych SLA dotyczących powiadomień o naruszeniach, kwestie te powinny być omówione w ramach umowy o **Licencję Enterprise**.

Źródła:

* <https://forwardemail.net/technical-whitepaper.pdf#page=59>
* <https://forwardemail.net/gdpr>

### Czy oferujecie środowisko testowe {#do-you-offer-a-test-environment}

Dokumentacja techniczna Forward Email nie opisuje wyraźnie dedykowanego trybu sandbox. Potencjalne podejścia do testowania obejmują:

* **Opcja samodzielnego hostingu**: Kompleksowe możliwości samodzielnego hostingu do tworzenia środowisk testowych
* **Interfejs API**: Możliwość programowego testowania konfiguracji
* **Open Source**: 100% otwarty kod pozwala klientom na analizę logiki przekierowań
* **Wiele domen**: Obsługa wielu domen może umożliwić tworzenie domen testowych

Dla klientów korporacyjnych wymagających formalnych możliwości sandbox, kwestie te powinny być omówione w ramach umowy o **Licencję Enterprise**.

Źródło: <https://github.com/forwardemail/forwardemail.net> (Szczegóły środowiska deweloperskiego)

### Czy zapewniacie narzędzia do monitoringu i alertów {#do-you-provide-monitoring-and-alerting-tools}

Forward Email oferuje monitoring w czasie rzeczywistym z pewnymi ograniczeniami:

**Dostępne:**

* **Monitoring dostarczania w czasie rzeczywistym**: Publicznie widoczne metryki wydajności dla głównych dostawców e-maili
* **Automatyczne alerty**: Zespół inżynierów powiadamiany, gdy czas dostarczenia przekracza 10 sekund
* **Przejrzysty monitoring**: 100% otwarte systemy monitoringu
* **Monitoring infrastruktury**: Automatyczne wykrywanie anomalii i kompleksowe logowanie audytowe

**Ograniczenia:**

* Brak wyraźnej dokumentacji dotyczącej webhooków dla klientów lub powiadomień o statusie dostarczenia przez API

Dla klientów korporacyjnych wymagających szczegółowych webhooków statusu dostarczenia lub niestandardowych integracji monitoringu, te możliwości mogą być dostępne w ramach umów o **Licencję Enterprise**.

Źródła:

* <https://forwardemail.net> (Wyświetlanie monitoringu w czasie rzeczywistym)
* <https://github.com/forwardemail/forwardemail.net> (Implementacja monitoringu)

### Jak zapewniacie wysoką dostępność {#how-do-you-ensure-high-availability}

> \[!IMPORTANT]
> Forward Email wdraża kompleksową redundancję w wielu dostawcach infrastruktury.

* **Rozproszona infrastruktura**: Wielu dostawców (DigitalOcean, Vultr, DataPacket) w różnych regionach geograficznych
* **Geograficzne równoważenie obciążenia**: Równoważenie obciążenia oparte na lokalizacji geograficznej Cloudflare z automatycznym przełączaniem awaryjnym
* **Automatyczne skalowanie**: Dynamiczne dostosowanie zasobów w zależności od zapotrzebowania
* **Wielowarstwowa ochrona DDoS**: Poprzez system Shield DataPacket oraz Cloudflare
* **Redundancja serwerów**: Wiele serwerów na region z automatycznym przełączaniem awaryjnym
* **Replikacja baz danych**: Synchronizacja danych w czasie rzeczywistym w wielu lokalizacjach
* **Monitoring i alerty**: Całodobowy monitoring z automatycznym reagowaniem na incydenty

**Zobowiązanie do dostępności**: Ponad 99,9% dostępności usługi z przejrzystym monitoringiem dostępnym na <https://forwardemail.net>

Źródła:

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver>

### Czy jesteście zgodni z Sekcją 889 ustawy National Defense Authorization Act (NDAA) {#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa}

> \[!IMPORTANT]
> Forward Email jest w pełni zgodny z Sekcją 889 dzięki starannemu doborowi partnerów infrastrukturalnych.

Tak, Forward Email jest **zgodny z Sekcją 889**. Sekcja 889 ustawy National Defense Authorization Act (NDAA) zabrania agencjom rządowym korzystania lub zawierania umów z podmiotami używającymi sprzętu telekomunikacyjnego i do nadzoru wideo od określonych firm (Huawei, ZTE, Hikvision, Dahua i Hytera).
**Jak Forward Email spełnia wymogi Sekcji 889:**

Forward Email opiera się wyłącznie na dwóch kluczowych dostawcach infrastruktury, z których żaden nie używa sprzętu zabronionego przez Sekcję 889:

1. **Cloudflare**: Nasz główny partner w zakresie usług sieciowych i bezpieczeństwa poczty elektronicznej
2. **DataPacket**: Nasz główny dostawca infrastruktury serwerowej (wyłącznie z użyciem sprzętu Arista Networks i Cisco)
3. **Dostawcy zapasowi**: Nasi dostawcy zapasowi Digital Ocean i Vultr dodatkowo potwierdzili na piśmie zgodność z Sekcją 889.

**Zobowiązanie Cloudflare**: Cloudflare wyraźnie stwierdza w swoim Kodeksie Postępowania dla Stron Trzecich, że nie używa sprzętu telekomunikacyjnego, produktów do nadzoru wideo ani usług od żadnych podmiotów zabronionych przez Sekcję 889.

**Przypadek użycia rządowego**: Nasza zgodność z Sekcją 889 została potwierdzona, gdy **US Naval Academy** wybrała Forward Email do swoich potrzeb w zakresie bezpiecznego przekazywania poczty elektronicznej, wymagając dokumentacji naszych federalnych standardów zgodności.

Aby poznać pełne szczegóły dotyczące naszego rządowego systemu zgodności, w tym szerszych przepisów federalnych, przeczytaj nasze obszerne studium przypadku: [Federal Government Email Service Section 889 Compliant](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)


## Szczegóły systemowe i techniczne {#system-and-technical-details}

### Czy przechowujecie e-maile i ich zawartość {#do-you-store-emails-and-their-contents}

Nie, nie zapisujemy na dysku ani nie przechowujemy logów – z [wyjątkiem błędów](#do-you-store-error-logs) oraz [wychodzącego SMTP](#do-you-support-sending-email-with-smtp) (zobacz naszą [Politykę Prywatności](/privacy)).

Wszystko odbywa się w pamięci operacyjnej, a [nasz kod źródłowy jest dostępny na GitHub](https://github.com/forwardemail).

### Jak działa wasz system przekazywania e-maili {#how-does-your-email-forwarding-system-work}

Poczta elektroniczna opiera się na [protokole SMTP](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol). Ten protokół składa się z poleceń wysyłanych do serwera (najczęściej działającego na porcie 25). Najpierw następuje połączenie, następnie nadawca wskazuje, od kogo jest wiadomość ("MAIL FROM"), potem dokąd jest wysyłana ("RCPT TO"), a na końcu nagłówki i treść samego e-maila ("DATA"). Przebieg naszego systemu przekazywania e-maili opisano poniżej względem każdego polecenia protokołu SMTP:

* Połączenie początkowe (bez nazwy polecenia, np. `telnet example.com 25`) – To jest połączenie początkowe. Sprawdzamy nadawców, którzy nie znajdują się na naszej [liście dozwolonych](#do-you-have-an-allowlist) względem naszej [listy zablokowanych](#do-you-have-a-denylist). Na koniec, jeśli nadawca nie jest na liście dozwolonych, sprawdzamy, czy nie został [szarylistowany](#do-you-have-a-greylist).

* `HELO` – To polecenie służy do powitania i identyfikacji FQDN nadawcy, adresu IP lub nazwy obsługi poczty. Ta wartość może być sfałszowana, więc nie polegamy na tych danych, zamiast tego używamy odwrotnego wyszukiwania nazwy hosta dla adresu IP połączenia.

* `MAIL FROM` – To polecenie wskazuje adres nadawcy koperty e-maila. Jeśli podana jest wartość, musi to być poprawny adres e-mail zgodny z RFC 5322. Puste wartości są dozwolone. Tutaj [sprawdzamy backscatter](#how-do-you-protect-against-backscatter) oraz porównujemy MAIL FROM z naszą [listą zablokowanych](#do-you-have-a-denylist). Na koniec sprawdzamy nadawców spoza listy dozwolonych pod kątem limitów szybkości (zobacz sekcję o [limitowaniu szybkości](#do-you-have-rate-limiting) i [liście dozwolonych](#do-you-have-an-allowlist) dla więcej informacji).

* `RCPT TO` – To polecenie wskazuje odbiorcę(-ów) e-maila. Muszą to być poprawne adresy e-mail zgodne z RFC 5322. Zezwalamy na maksymalnie 50 odbiorców koperty na wiadomość (co różni się od nagłówka "Do" w e-mailu). Sprawdzamy również poprawność adresu zgodnego z [Sender Rewriting Scheme](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme) ("SRS") w celu ochrony przed podszywaniem się przy użyciu naszej domeny SRS.

* `DATA` – To jest kluczowa część naszej usługi, która przetwarza e-mail. Zobacz sekcję [Jak przetwarzacie e-mail do przekazywania](#how-do-you-process-an-email-for-forwarding) poniżej, aby uzyskać więcej informacji.
### Jak przetwarzasz e-mail do przekazania dalej {#how-do-you-process-an-email-for-forwarding}

Ta sekcja opisuje nasz proces związany z poleceniem protokołu SMTP `DATA` w sekcji [Jak działa Twój system przekazywania e-maili](#how-does-your-email-forwarding-system-work) powyżej – to sposób, w jaki przetwarzamy nagłówki e-maila, treść, zabezpieczenia, ustalamy, gdzie musi zostać dostarczony, oraz jak obsługujemy połączenia.

1. Jeśli wiadomość przekracza maksymalny rozmiar 50 MB, zostaje odrzucona z kodem błędu 552.

2. Jeśli wiadomość nie zawierała nagłówka "From" lub jeśli jakakolwiek z wartości w nagłówku "From" nie była prawidłowym adresem e-mail zgodnym z RFC 5322, zostaje odrzucona z kodem błędu 550.

3. Jeśli wiadomość miała więcej niż 25 nagłówków "Received", uznano, że utknęła w pętli przekierowań i zostaje odrzucona z kodem błędu 550.

4. Korzystając z odcisku palca e-maila (zobacz sekcję o [Fingerprinting](#how-do-you-determine-an-email-fingerprint)), sprawdzimy, czy próbowano ponowić wysłanie wiadomości przez ponad 5 dni (co odpowiada [domyślnemu zachowaniu postfixa](http://www.postfix.org/postconf.5.html#maximal_queue_lifetime)), i jeśli tak, zostanie odrzucona z kodem błędu 550.

5. Przechowujemy w pamięci wyniki skanowania e-maila za pomocą [Spam Scanner](https://spamscanner.net).

6. Jeśli pojawiły się jakiekolwiek arbitralne wyniki ze Spam Scanner, wiadomość zostaje odrzucona z kodem błędu 554. Arbitralne wyniki obejmują w chwili pisania test GTUBE. Zobacz <https://spamassassin.apache.org/gtube/> dla większej ilości informacji.

7. Dodajemy do wiadomości następujące nagłówki w celach debugowania i zapobiegania nadużyciom:

   * `Received` – dodajemy ten standardowy nagłówek Received z adresem IP i hostem źródłowym, typem transmisji, informacjami o połączeniu TLS, datą/czasem oraz odbiorcą.
   * `X-Original-To` – oryginalny odbiorca wiadomości:
     * Przydatne do ustalenia, gdzie e-mail został pierwotnie dostarczony (oprócz nagłówka "Received").
     * Dodawane indywidualnie dla każdego odbiorcy w czasie IMAP i/lub maskowanego przekazywania (w celu ochrony prywatności).
   * `X-Forward-Email-Website` – zawiera link do naszej strony <https://forwardemail.net>
   * `X-Forward-Email-Version` – aktualna wersja [SemVer](https://semver.org/) z `package.json` naszej bazy kodu.
   * `X-Forward-Email-Session-ID` – wartość ID sesji używana do celów debugowania (dotyczy tylko środowisk nieprodukcyjnych).
   * `X-Forward-Email-Sender` – lista oddzielona przecinkami zawierająca oryginalny adres MAIL FROM koperty (jeśli nie był pusty), odwrócony PTR klienta FQDN (jeśli istnieje) oraz adres IP nadawcy.
   * `X-Forward-Email-ID` – dotyczy tylko wychodzącego SMTP i koreluje z ID e-maila przechowywanym w Moje Konto → E-maile
   * `X-Report-Abuse` – z wartością `abuse@forwardemail.net`.
   * `X-Report-Abuse-To` – z wartością `abuse@forwardemail.net`.
   * `X-Complaints-To` – z wartością `abuse@forwardemail.net`.

8. Następnie sprawdzamy wiadomość pod kątem [DKIM](https://en.wikipedia.org/wiki/DomainKeys_Identified_Mail), [SPF](https://en.wikipedia.org/wiki/Sender_Policy_Framework), [ARC](https://en.wikipedia.org/wiki/Authenticated_Received_Chain) oraz [DMARC](https://en.wikipedia.org/wiki/DMARC).

   * Jeśli wiadomość nie przeszła DMARC, a domena miała politykę odrzucenia (np. `p=reject` [było w polityce DMARC](https://wikipedia.org/wiki/DMARC)), zostaje odrzucona z kodem błędu 550. Zazwyczaj politykę DMARC dla domeny można znaleźć w rekordzie <strong class="notranslate">TXT</strong> subdomeny `_dmarc` (np. `dig _dmarc.example.com txt`).
   * Jeśli wiadomość nie przeszła SPF, a domena miała politykę twardego odrzucenia (np. `-all` było w polityce SPF zamiast `~all` lub braku polityki), zostaje odrzucona z kodem błędu 550. Zazwyczaj politykę SPF dla domeny można znaleźć w rekordzie <strong class="notranslate">TXT</strong> domeny głównej (np. `dig example.com txt`). Zobacz tę sekcję, aby uzyskać więcej informacji o [wysyłaniu maili jako w Gmailu](#can-i-send-mail-as-in-gmail-with-this) dotyczących SPF.
9. Teraz przetwarzamy odbiorców wiadomości zebranych z polecenia `RCPT TO` w sekcji [Jak działa Twój system przekazywania e-maili](#how-does-your-email-forwarding-system-work) powyżej. Dla każdego odbiorcy wykonujemy następujące operacje:

   * Wyszukujemy rekordy <strong class="notranslate">TXT</strong> nazwy domeny (część po symbolu `@`, np. `example.com` jeśli adres e-mail to `test@example.com`). Na przykład, jeśli domena to `example.com`, wykonujemy zapytanie DNS takie jak `dig example.com txt`.
   * Parsujemy wszystkie rekordy <strong class="notranslate">TXT</strong>, które zaczynają się od `forward-email=` (plany darmowe) lub `forward-email-site-verification=` (plany płatne). Zauważ, że parsujemy oba, aby obsłużyć e-maile podczas gdy użytkownik zmienia plan na wyższy lub niższy.
   * Z tych sparsowanych rekordów <strong class="notranslate">TXT</strong> iterujemy, aby wyodrębnić konfigurację przekazywania (jak opisano w sekcji [Jak zacząć i skonfigurować przekazywanie e-maili](#how-do-i-get-started-and-set-up-email-forwarding) powyżej). Zauważ, że obsługujemy tylko jedną wartość `forward-email-site-verification=`, a jeśli podano więcej niż jedną, wystąpi błąd 550, a nadawca otrzyma zwrotkę dla tego odbiorcy.
   * Rekurencyjnie iterujemy po wyodrębnionej konfiguracji przekazywania, aby określić globalne przekazywanie, przekazywanie oparte na wyrażeniach regularnych oraz wszystkie inne obsługiwane konfiguracje przekazywania – które są teraz znane jako nasze "Adresy Przekazywania".
   * Dla każdego Adresu Przekazywania obsługujemy jedno rekurencyjne wyszukiwanie (które rozpocznie tę serię operacji na podanym adresie). Jeśli znaleziono dopasowanie rekurencyjne, wynik nadrzędny zostanie usunięty z Adresów Przekazywania, a dzieci dodane.
   * Adresy Przekazywania są analizowane pod kątem unikalności (ponieważ nie chcemy wysyłać duplikatów na jeden adres ani generować dodatkowych niepotrzebnych połączeń klienta SMTP).
   * Dla każdego Adresu Przekazywania sprawdzamy jego nazwę domeny za pomocą naszego punktu końcowego API `/v1/max-forwarded-addresses` (aby określić, do ilu adresów domena może przekazywać e-maile na alias, np. domyślnie 10 – zobacz sekcję o [maksymalnym limicie przekazywania na alias](#is-there-a-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias)). Jeśli limit zostanie przekroczony, wystąpi błąd 550, a nadawca otrzyma zwrotkę dla tego odbiorcy.
   * Sprawdzamy ustawienia oryginalnego odbiorcy za pomocą naszego punktu końcowego API `/v1/settings`, który obsługuje wyszukiwanie dla użytkowników płatnych (z fallbackiem dla użytkowników darmowych). Zwraca to obiekt konfiguracji dla zaawansowanych ustawień `port` (Liczba, np. `25`), `has_adult_content_protection` (Boolean), `has_phishing_protection` (Boolean), `has_executable_protection` (Boolean) oraz `has_virus_protection` (Boolean).
   * Na podstawie tych ustawień sprawdzamy wyniki skanera spamu i jeśli wystąpią jakiekolwiek błędy, wiadomość zostaje odrzucona z kodem błędu 554 (np. jeśli `has_virus_protection` jest włączone, sprawdzamy wyniki skanera spamu pod kątem wirusów). Zauważ, że wszyscy użytkownicy planu darmowego są domyślnie objęci kontrolami treści dla dorosłych, phishingu, plików wykonywalnych i wirusów. Domyślnie wszyscy użytkownicy planów płatnych również są objęci tymi kontrolami, ale konfigurację tę można zmienić na stronie Ustawienia domeny w panelu Forward Email).

10. Dla każdego przetworzonego Adresu Przekazywania odbiorcy wykonujemy następujące operacje:

    * Adres jest sprawdzany względem naszej [listy blokowanych](#do-you-have-a-denylist), a jeśli jest na niej wymieniony, wystąpi błąd 421 (wskazuje nadawcy, aby spróbował ponownie później).
    * Jeśli adres jest webhookiem, ustawiamy wartość Boolean dla przyszłych operacji (patrz poniżej – grupujemy podobne webhooki, aby wykonać jedno żądanie POST zamiast wielu dla dostarczenia).
    * Jeśli adres jest adresem e-mail, parsujemy hosta dla przyszłych operacji (patrz poniżej – grupujemy podobne hosty, aby nawiązać jedno połączenie zamiast wielu indywidualnych połączeń dla dostarczenia).
11. Jeśli nie ma odbiorców i nie ma zwrotów, odpowiadamy błędem 550 „Nieprawidłowi odbiorcy”.

12. Jeśli są odbiorcy, to iterujemy po nich (pogrupowanych według tego samego hosta) i dostarczamy e-maile.  Zobacz sekcję [Jak radzicie sobie z problemami z dostarczaniem e-maili](#how-do-you-handle-email-delivery-issues) poniżej, aby uzyskać więcej informacji.

    * Jeśli podczas wysyłania e-maili wystąpią jakiekolwiek błędy, to przechowujemy je w pamięci do późniejszego przetworzenia.
    * Weźmiemy najniższy kod błędu (jeśli wystąpił) z wysyłania e-maili – i użyjemy go jako kodu odpowiedzi na polecenie `DATA`.  Oznacza to, że e-maile niedostarczone będą zazwyczaj ponawiane przez oryginalnego nadawcę, natomiast e-maile, które zostały już dostarczone, nie będą ponownie wysyłane przy następnym wysłaniu wiadomości (ponieważ używamy [Fingerprinting](#how-do-you-determine-an-email-fingerprint)).
    * Jeśli nie wystąpiły żadne błędy, to wyślemy kod statusu SMTP 250 oznaczający powodzenie.
    * Zwrot (bounce) jest definiowany jako każda próba dostarczenia, która skutkuje kodem statusu >= 500 (błędy trwałe).

13. Jeśli nie wystąpiły zwroty (błędy trwałe), to zwrócimy kod statusu SMTP najniższego błędu z błędów nietrwałych (lub kod 250 oznaczający powodzenie, jeśli takich nie było).

14. Jeśli wystąpiły zwroty, to wyślemy e-maile zwrotne w tle po zwróceniu nadawcy najniższego ze wszystkich kodów błędów.  Jednak jeśli najniższy kod błędu jest >= 500, to nie wysyłamy żadnych e-maili zwrotnych.  Dzieje się tak, ponieważ w przeciwnym razie nadawcy otrzymaliby podwójny e-mail zwrotny (np. jeden od ich wychodzącego MTA, takiego jak Gmail – oraz jeden od nas).  Zobacz sekcję [Jak chronicie się przed backscatter](#how-do-you-protect-against-backscatter) poniżej, aby uzyskać więcej informacji.

### Jak radzicie sobie z problemami z dostarczaniem e-maili {#how-do-you-handle-email-delivery-issues}

Zauważ, że dokonujemy „Friendly-From” rewrite na e-mailach tylko wtedy, gdy polityka DMARC nadawcy nie była spełniona ORAZ żadne podpisy DKIM nie były zgodne z nagłówkiem „From”.  Oznacza to, że zmienimy nagłówek „From” w wiadomości, ustawimy „X-Original-From” oraz ustawimy „Reply-To”, jeśli nie było go wcześniej.  Ponadto ponownie zapieczętujemy pieczęć ARC na wiadomości po zmianie tych nagłówków.

Używamy również inteligentnego parsowania komunikatów o błędach na każdym poziomie naszego stosu – w naszym kodzie, zapytaniach DNS, wewnętrznych mechanizmach Node.js, zapytaniach HTTP (np. 408, 413 i 429 są mapowane na kod odpowiedzi SMTP 421, jeśli odbiorcą jest webhook) oraz odpowiedziach serwera pocztowego (np. odpowiedzi zawierające „defer” lub „slowdown” będą ponawiane jako błędy 421).

Nasza logika jest odporna na błędy i będzie również ponawiać próby w przypadku błędów SSL/TLS, problemów z połączeniem i innych.  Celem odporności na błędy jest maksymalizacja dostarczalności do wszystkich odbiorców w konfiguracji przekazywania.

Jeśli odbiorcą jest webhook, to zezwalamy na 60 sekundowy timeout na zakończenie żądania z maksymalnie 3 ponownymi próbami (czyli łącznie 4 żądania przed uznaniem za niepowodzenie).  Zauważ, że poprawnie parsujemy kody błędów 408, 413 i 429 i mapujemy je na kod odpowiedzi SMTP 421.

W przeciwnym razie, jeśli odbiorcą jest adres e-mail, to spróbujemy wysłać e-mail z TLS oportunistycznym (próbujemy użyć STARTTLS, jeśli jest dostępny na serwerze pocztowym odbiorcy).  Jeśli podczas próby wysłania e-maila wystąpi błąd SSL/TLS, to spróbujemy wysłać e-mail bez TLS (bez użycia STARTTLS).

Jeśli wystąpią jakiekolwiek błędy DNS lub połączenia, to zwrócimy na polecenie `DATA` kod odpowiedzi SMTP 421, w przeciwnym razie jeśli wystąpią błędy na poziomie >= 500, to zostaną wysłane zwroty.

Jeśli wykryjemy, że serwer pocztowy, do którego próbujemy dostarczyć, zablokował jeden lub więcej naszych adresów IP wymiany poczty (np. przez dowolną technologię, której używają do opóźniania spamerów), to wyślemy kod odpowiedzi SMTP 421, aby nadawca mógł ponowić wysłanie wiadomości później (i zostaniemy o tym powiadomieni, abyśmy mogli spróbować rozwiązać problem przed następną próbą).

### Jak radzicie sobie z blokowaniem waszych adresów IP {#how-do-you-handle-your-ip-addresses-becoming-blocked}
Rutynowo monitorujemy wszystkie główne listy odmów DNS i jeśli którykolwiek z naszych adresów IP wymiany poczty ("MX") zostanie umieszczony na głównej liście odmów, wycofamy go z odpowiedniego rekordu DNS A round robin, jeśli to możliwe, aż do rozwiązania problemu.

W chwili pisania tego tekstu jesteśmy również umieszczeni na kilku listach dozwolonych DNS i traktujemy monitorowanie list odmów bardzo poważnie. Jeśli zauważysz jakiekolwiek problemy zanim będziemy mieli szansę je rozwiązać, prosimy o powiadomienie nas na piśmie pod adresem <support@forwardemail.net>.

Nasze adresy IP są publicznie dostępne, [zobacz tę sekcję poniżej, aby uzyskać więcej informacji](#what-are-your-servers-ip-addresses).

### Co to są adresy postmaster {#what-are-postmaster-addresses}

Aby zapobiec błędnie skierowanym odbiciom i wysyłaniu wiadomości automatycznych o nieobecności do nieobsługiwanych lub nieistniejących skrzynek pocztowych, utrzymujemy listę nazw użytkowników podobnych do mailer-daemon:

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
* [oraz każdy adres no-reply](#what-are-no-reply-addresses)

Zobacz [RFC 5320 Sekcja 4.6](https://datatracker.ietf.org/doc/html/rfc5230#section-4.6) aby uzyskać więcej informacji o tym, jak listy takie jak te są używane do tworzenia efektywnych systemów e-mail.

### Co to są adresy no-reply {#what-are-no-reply-addresses}

Nazwy użytkowników e-mail równe któremukolwiek z poniższych (niezależnie od wielkości liter) są uważane za adresy no-reply:

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

Ta lista jest utrzymywana [jako projekt open-source na GitHub](https://github.com/forwardemail/reserved-email-addresses-list).

### Jakie są adresy IP Twojego serwera {#what-are-your-servers-ip-addresses}

Publikujemy nasze adresy IP pod adresem <https://forwardemail.net/ips>.

### Czy macie listę dozwolonych {#do-you-have-an-allowlist}

Tak, mamy [listę rozszerzeń nazw domen](#what-domain-name-extensions-are-allowlisted-by-default), które są domyślnie dozwolone oraz dynamiczną, buforowaną i rotacyjną listę dozwolonych opartą na [ścisłych kryteriach](#what-is-your-allowlist-criteria).

Wszystkie domeny, e-maile i adresy IP używane przez płacących klientów są automatycznie sprawdzane co godzinę względem naszej listy odmów – co powiadamia administratorów, którzy mogą ręcznie interweniować w razie potrzeby.

Dodatkowo, jeśli któraś z Twoich domen lub jej adresów e-mail zostanie umieszczona na liście odmów (np. za wysyłanie spamu, wirusów lub z powodu ataków podszywania się) – wtedy administratorzy domen (Ty) oraz nasi administratorzy zespołu zostaną natychmiast powiadomieni e-mailem. Zdecydowanie zalecamy, abyś [skonfigurował DMARC](#how-do-i-set-up-dmarc-for-forward-email), aby temu zapobiec.

### Jakie rozszerzenia nazw domen są domyślnie dozwolone {#what-domain-name-extensions-are-allowlisted-by-default}

Następujące rozszerzenia nazw domen są uważane za domyślnie dozwolone (bez względu na to, czy znajdują się na liście popularności Umbrella, czy nie):

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
Dodatkowo te [markowe i korporacyjne domeny najwyższego poziomu](https://en.wikipedia.org/wiki/List_of_Internet_top-level_domains#Brand_and_corporate_top-level_domains) są domyślnie na liście dozwolonych (np. `apple` dla `applecard.apple` dla wyciągów bankowych Apple Card):

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
Od 18 marca 2025 roku dodaliśmy również te francuskie terytoria zamorskie do tej listy ([zgodnie z tym zgłoszeniem na GitHub](https://github.com/forwardemail/forwardemail.net/issues/327)):

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

Od 8 lipca 2025 roku dodaliśmy te kraje specyficzne dla Europy:

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

W październiku 2025 roku dodaliśmy również <code class="notranslate">cz</code> (Czechy) ze względu na zapotrzebowanie.

Specjalnie nie uwzględniliśmy `ru` i `ua` z powodu wysokiej aktywności spamu.

### Jakie są kryteria Twojej listy dozwolonych {#what-is-your-allowlist-criteria}

Posiadamy statyczną listę [domen najwyższego poziomu domyślnie dozwolonych](#what-domain-name-extensions-are-allowlisted-by-default) – a także utrzymujemy dynamiczną, buforowaną, ciągłą listę dozwolonych domen opartą na następujących surowych kryteriach:

* Główna domena nadawcy musi być z [domeny najwyższego poziomu, która jest dostępna w naszej darmowej ofercie](#what-domain-name-extensions-can-be-used-for-free) (z dodatkiem `biz` i `info`). Uwzględniamy także częściowe dopasowania `edu`, `gov` i `mil`, takie jak `xyz.gov.au` i `xyz.edu.au`.
* Główna domena nadawcy musi znajdować się wśród 100 000 unikalnych domen głównych według wyników z [Umbrella Popularity List](http://s3-us-west-1.amazonaws.com/umbrella-static/index.html "Umbrella Popularity List") ("UPL").
* Główna domena nadawcy musi znajdować się wśród 50 000 najlepszych wyników unikalnych domen głównych pojawiających się w co najmniej 4 z ostatnich 7 dni UPL (~50%+).
* Główna domena nadawcy nie może być [skategoryzowana](https://radar.cloudflare.com/categorization-feedback/) jako zawierająca treści dla dorosłych lub malware przez Cloudflare.
* Główna domena nadawcy musi mieć ustawione rekordy A lub MX.
* Główna domena nadawcy musi mieć rekord(y) A, rekord(y) MX, rekord DMARC z `p=reject` lub `p=quarantine`, albo rekord SPF z kwalifikatorem `-all` lub `~all`.

Jeśli kryteria te są spełnione, główna domena nadawcy będzie buforowana przez 7 dni. Należy zauważyć, że nasz automatyczny proces działa codziennie – dlatego jest to ciągła, codziennie aktualizowana lista dozwolonych domen.

Nasz automatyczny proces pobiera poprzednie 7 dni UPL do pamięci, rozpakowuje je, a następnie analizuje w pamięci zgodnie z powyższymi surowymi kryteriami.

Popularne domeny w chwili pisania tego tekstu, takie jak Google, Yahoo, Microsoft, Amazon, Meta, Twitter, Netflix, Spotify i inne – oczywiście są uwzględnione.
Jeśli jesteś nadawcą, który nie znajduje się na naszej liście dozwolonych, to za pierwszym razem, gdy Twoja domena główna FQDN lub adres IP wyśle e-mail, zostaniesz [ograniczony pod względem szybkości](#do-you-have-rate-limiting) i [umieszczony na szarej liście](#do-you-have-a-greylist). Należy zauważyć, że jest to standardowa praktyka przyjęta jako standard e-mailowy. Większość klientów serwerów pocztowych spróbuje ponowić wysyłkę, jeśli otrzyma błąd ograniczenia szybkości lub szarej listy (np. kod statusu błędu 421 lub poziomu 4xx).

**Należy zauważyć, że konkretni nadawcy, tacy jak `a@gmail.com`, `b@xyz.edu` i `c@gov.au`, mogą nadal być [umieszczani na liście blokowanych](#do-you-have-a-denylist)** (np. jeśli automatycznie wykryjemy spam, phishing lub złośliwe oprogramowanie od tych nadawców).

### Jakie rozszerzenia nazw domen można używać za darmo {#what-domain-name-extensions-can-be-used-for-free}

Od 31 marca 2023 roku wprowadziliśmy nową ogólną zasadę antyspamową, aby chronić naszych użytkowników i usługę.

Ta nowa zasada pozwala na używanie tylko następujących rozszerzeń nazw domen w naszym darmowym planie:

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
### Czy masz szarą listę {#do-you-have-a-greylist}

Tak, stosujemy bardzo łagodną politykę [szarego listowania e-maili](https://en.wikipedia.org/wiki/Greylisting_\(email\)). Szare listowanie dotyczy tylko nadawców, którzy nie znajdują się na naszej liście dozwolonych i jest przechowywane w naszej pamięci podręcznej przez 30 dni.

Dla każdego nowego nadawcy przechowujemy klucz w naszej bazie Redis przez 30 dni z wartością ustawioną na czas pierwszego przyjścia ich żądania. Następnie odrzucamy ich e-mail z kodem statusu ponownej próby 450 i pozwalamy na jego przejście dopiero po upływie 5 minut.

Jeśli nadawca pomyślnie odczeka 5 minut od tego początkowego czasu przyjścia, jego e-maile zostaną zaakceptowane i nie otrzyma on kodu statusu 450.

Klucz składa się z pełnej nazwy domeny (FQDN) lub adresu IP nadawcy. Oznacza to, że każda subdomena, która przejdzie przez szarą listę, również przejdzie dla domeny głównej i odwrotnie (to właśnie mamy na myśli mówiąc o „bardzo łagodnej” polityce).

Na przykład, jeśli e-mail pochodzi z `test.example.com` zanim zobaczymy e-mail z `example.com`, to każdy e-mail z `test.example.com` i/lub `example.com` będzie musiał odczekać 5 minut od początkowego czasu przyjścia połączenia. Nie wymagamy, aby zarówno `test.example.com`, jak i `example.com` czekały osobno swoje 5 minut (nasza polityka szarego listowania stosuje się na poziomie domeny głównej).

Należy zauważyć, że szare listowanie nie dotyczy żadnego nadawcy z naszej [listy dozwolonych](#do-you-have-an-allowlist) (np. Meta, Amazon, Netflix, Google, Microsoft na moment pisania tego tekstu).

### Czy masz czarną listę {#do-you-have-a-denylist}

Tak, prowadzimy własną czarną listę i aktualizujemy ją automatycznie w czasie rzeczywistym oraz ręcznie na podstawie wykrytej aktywności spamowej i złośliwej.

Pobieramy również wszystkie adresy IP z czarnej listy UCEPROTECT Level 1 pod adresem <http://wget-mirrors.uceprotect.net/rbldnsd-all/dnsbl-1.uceprotect.net.gz> co godzinę i dodajemy je do naszej czarnej listy z okresem ważności 7 dni.

Nadawcy znajdujący się na czarnej liście otrzymają kod błędu 421 (wskazuje nadawcy, aby spróbował ponownie później), jeśli [nie znajdują się na liście dozwolonych](#do-you-have-an-allowlist).

Używając kodu statusu 421 zamiast 554, potencjalne fałszywe alarmy mogą być łagodzone w czasie rzeczywistym, a następnie wiadomość może zostać pomyślnie dostarczona przy kolejnej próbie.

**To jest zaprojektowane inaczej niż w innych usługach pocztowych**, gdzie jeśli zostaniesz umieszczony na liście blokującej, następuje twarda i trwała odmowa. Często trudno jest poprosić nadawców o ponowne wysłanie wiadomości (zwłaszcza z dużych organizacji), dlatego takie podejście daje około 5 dni od pierwszej próby wysłania e-maila, aby nadawca, odbiorca lub my mogli zareagować i rozwiązać problem (poprzez żądanie usunięcia z czarnej listy).

Wszystkie prośby o usunięcie z czarnej listy są monitorowane w czasie rzeczywistym przez administratorów (np. aby powtarzające się fałszywe alarmy mogły być trwale dodane do listy dozwolonych przez administratorów).

Prośby o usunięcie z czarnej listy można składać pod adresem <https://forwardemail.net/denylist>. Użytkownicy płatni mają swoje prośby o usunięcie przetwarzane natychmiast, podczas gdy użytkownicy niepłatni muszą czekać na przetworzenie przez administratorów.

Nadawcy wykryci jako wysyłający spam lub zawartość wirusową będą dodawani do czarnej listy według następującego schematu:

1. [Początkowy odcisk wiadomości](#how-do-you-determine-an-email-fingerprint) jest szary listowany po wykryciu spamu lub umieszczeniu na liście blokującej od „zaufanego” nadawcy (np. `gmail.com`, `microsoft.com`, `apple.com`).
   * Jeśli nadawca był na liście dozwolonych, wiadomość jest szaro listowana przez 1 godzinę.
   * Jeśli nadawca nie jest na liście dozwolonych, wiadomość jest szaro listowana przez 6 godzin.
2. Parsujemy klucze czarnej listy z informacji o nadawcy i wiadomości, i dla każdego z tych kluczy tworzymy (jeśli jeszcze nie istnieje) licznik, zwiększamy go o 1 i przechowujemy w pamięci podręcznej przez 24 godziny.
   * Dla nadawców z listy dozwolonych:
     * Dodajemy klucz dla adresu e-mail „MAIL FROM” z koperty, jeśli przeszedł SPF lub nie miał SPF, i nie był [adresatem postmaster](#what-are-postmaster-addresses) ani [adresatem no-reply](#what-are-no-reply-addresses).
     * Jeśli nagłówek „From” był na liście dozwolonych, dodajemy klucz dla adresu e-mail z nagłówka „From”, jeśli przeszedł SPF lub przeszedł i był zgodny z DKIM.
     * Jeśli nagłówek „From” nie był na liście dozwolonych, dodajemy klucz dla adresu e-mail z nagłówka „From” oraz jego głównej nazwy domeny.
   * Dla nadawców niebędących na liście dozwolonych:
     * Dodajemy klucz dla adresu e-mail „MAIL FROM” z koperty, jeśli przeszedł SPF.
     * Jeśli nagłówek „From” był na liście dozwolonych, dodajemy klucz dla adresu e-mail z nagłówka „From”, jeśli przeszedł SPF lub przeszedł i był zgodny z DKIM.
     * Jeśli nagłówek „From” nie był na liście dozwolonych, dodajemy klucz dla adresu e-mail z nagłówka „From” oraz jego głównej nazwy domeny.
     * Dodajemy klucz dla zdalnego adresu IP nadawcy.
     * Dodajemy klucz dla nazwy hosta klienta uzyskanej przez odwrotne wyszukiwanie z adresu IP nadawcy (jeśli istnieje).
     * Dodajemy klucz dla domeny głównej nazwy hosta klienta (jeśli istnieje i różni się od nazwy hosta klienta).
3. Jeśli licznik osiągnie 5 dla nadawcy i klucza niebędącego na liście dozwolonych, to blokujemy ten klucz na 30 dni i wysyłamy e-mail do naszego zespołu ds. nadużyć. Te wartości mogą się zmieniać, a aktualizacje będą tutaj odzwierciedlane podczas monitorowania nadużyć.
4. Jeśli licznik osiągnie 10 dla nadawcy i klucza z listy dozwolonych, to blokujemy ten klucz na 7 dni i wysyłamy e-mail do naszego zespołu ds. nadużyć. Te wartości mogą się zmieniać, a aktualizacje będą tutaj odzwierciedlane podczas monitorowania nadużyć.
> **UWAGA:** W niedalekiej przyszłości wprowadzimy monitorowanie reputacji. Monitorowanie reputacji będzie obliczać, kiedy zablokować nadawcę na podstawie progu procentowego (zamiast prostego licznika, jak opisano powyżej).

### Czy masz ograniczenia szybkości {#do-you-have-rate-limiting}

Ograniczenia szybkości nadawcy dotyczą albo domeny głównej wyciągniętej z odwrotnego wyszukiwania PTR na adresie IP nadawcy – albo jeśli to nie daje wyniku, to po prostu używa adresu IP nadawcy.  Zwróć uwagę, że poniżej odnosimy się do tego jako `Nadawca`.

Nasze serwery MX mają dzienne limity na przychodzącą pocztę otrzymywaną dla [zaszyfrowanego przechowywania IMAP](/blog/docs/best-quantum-safe-encrypted-email-service):

* Zamiast ograniczać szybkość przychodzącej poczty na poziomie pojedynczego aliasu (np. `you@yourdomain.com`) – ograniczamy szybkość według samej domeny aliasu (np. `yourdomain.com`). Zapobiega to zalewaniu skrzynek wszystkich aliasów w Twojej domenie przez `Nadawców` naraz.
* Mamy ogólne limity, które dotyczą wszystkich `Nadawców` w naszej usłudze niezależnie od odbiorcy:
  * `Nadawcy`, których uważamy za "zaufane" źródło prawdy (np. `gmail.com`, `microsoft.com`, `apple.com`) mają limit wysyłki 100 GB dziennie.
  * `Nadawcy`, którzy są [na liście dozwolonych](#do-you-have-an-allowlist) mają limit wysyłki 10 GB dziennie.
  * Wszyscy inni `Nadawcy` mają limit wysyłki 1 GB i/lub 1000 wiadomości dziennie.
* Mamy specyficzny limit na `Nadawcę` i `yourdomain.com` wynoszący 1 GB i/lub 1000 wiadomości dziennie.

Serwery MX ograniczają także wiadomości przekazywane do jednego lub więcej odbiorców poprzez ograniczenia szybkości – ale dotyczy to tylko `Nadawców` nie znajdujących się na [liście dozwolonych](#do-you-have-an-allowlist):

* Zezwalamy na maksymalnie 100 połączeń na godzinę, na `Nadawcę` rozpoznaną po FQDN domeny głównej (lub) adres IP `Nadawcy` (jeśli brak odwrotnego PTR), oraz na odbiorcę koperty. Klucz do ograniczenia szybkości przechowujemy jako skrót kryptograficzny w naszej bazie Redis.

* Jeśli wysyłasz e-maile przez nasz system, upewnij się, że masz ustawiony odwrotny PTR dla wszystkich swoich adresów IP (w przeciwnym razie każdy unikalny FQDN domeny głównej lub adres IP, z którego wysyłasz, będzie ograniczany).

* Zwróć uwagę, że jeśli wysyłasz przez popularny system taki jak Amazon SES, nie będziesz ograniczany, ponieważ (w chwili pisania tego tekstu) Amazon SES jest na naszej liście dozwolonych.

* Jeśli wysyłasz z domeny takiej jak `test.abc.123.example.com`, limit szybkości będzie nałożony na `example.com`. Wielu spamerów używa setek subdomen, aby obejść powszechne filtry antyspamowe, które ograniczają szybkość tylko dla unikalnych nazw hostów, a nie unikalnych domen głównych FQDN.

* `Nadawcy`, którzy przekroczą limit szybkości, zostaną odrzuceni z błędem 421.

Nasze serwery IMAP i SMTP ograniczają Twoje aliasy do maksymalnie `60` jednoczesnych połączeń.

Nasze serwery MX ograniczają [nie-dozwolonych](#do-you-have-an-allowlist) nadawców do nawiązywania nie więcej niż 10 jednoczesnych połączeń (z 3-minutowym wygaśnięciem pamięci podręcznej licznika, co odpowiada naszemu limitowi czasu socketu 3 minuty).

### Jak chronicie się przed backscatter {#how-do-you-protect-against-backscatter}

Nieprawidłowo skierowane odbicia lub spam odbiciowy (znany jako "[Backscatter](https://en.wikipedia.org/wiki/Backscatter_\(email\))") mogą powodować negatywną reputację adresów IP nadawców.

Podejmujemy dwa kroki, aby chronić przed backscatter, które są szczegółowo opisane w poniższych sekcjach [Zapobieganie odbiciom od znanych spamerów MAIL FROM](#prevent-bounces-from-known-mail-from-spammers) oraz [Zapobieganie niepotrzebnym odbiciom w celu ochrony przed backscatter](#prevent-unnecessary-bounces-to-protect-against-backscatter).

### Zapobieganie odbiciom od znanych spamerów MAIL FROM {#prevent-bounces-from-known-mail-from-spammers}

Pobieramy listę z [Backscatter.org](https://www.backscatterer.org/) (zasilaną przez [UCEPROTECT](https://www.uceprotect.net/)) pod adresem <http://wget-mirrors.uceprotect.net/rbldnsd-all/ips.backscatterer.org.gz> co godzinę i wprowadzamy ją do naszej bazy Redis (porównujemy też różnice z wyprzedzeniem; na wypadek usunięcia jakichkolwiek IP, które należy uwzględnić).
Jeśli MAIL FROM jest pusty LUB jest równy (niezależnie od wielkości liter) któremukolwiek z [adresów postmaster](#what-are-postmaster-addresses) (część przed @ w adresie e-mail), wtedy sprawdzamy, czy adres IP nadawcy pasuje do któregoś z tej listy.

Jeśli adres IP nadawcy jest na liście (i nie znajduje się na naszej [liście dozwolonych](#do-you-have-an-allowlist)), wysyłamy błąd 554 z komunikatem `The IP ${session.remoteAddress} is blocked by https://www.backscatterer.org/index.php?target=test&ip=${session.remoteAddress}`. Zostaniemy powiadomieni, jeśli nadawca znajduje się zarówno na liście Backscatterer, jak i na naszej liście dozwolonych, abyśmy mogli rozwiązać problem, jeśli zajdzie taka potrzeba.

Techniki opisane w tej sekcji są zgodne z zaleceniem "TRYB BEZPIECZNY" na <https://www.backscatterer.org/?target=usage> – gdzie sprawdzamy adres IP nadawcy tylko wtedy, gdy spełnione zostały określone warunki.

### Zapobieganie niepotrzebnym odbiciom w celu ochrony przed backscatter {#prevent-unnecessary-bounces-to-protect-against-backscatter}

Odbicia to e-maile, które wskazują, że przekierowanie e-maila całkowicie nie powiodło się u odbiorcy i e-mail nie będzie ponawiany.

Częstą przyczyną znalezienia się na liście Backscatterer są błędnie skierowane odbicia lub spam odbiciowy, dlatego musimy chronić się przed tym na kilka sposobów:

1. Wysyłamy tylko wtedy, gdy wystąpią błędy o kodzie >= 500 (gdy próby przekierowania e-maili zakończyły się niepowodzeniem, np. Gmail odpowiada błędem na poziomie 500).

2. Wysyłamy tylko raz i tylko raz (używamy obliczanego klucza odcisku odbicia i przechowujemy go w pamięci podręcznej, aby zapobiec wysyłaniu duplikatów). Odcisk odbicia to klucz będący odciskiem wiadomości połączonym z haszem adresu odbicia i jego kodu błędu). Zobacz sekcję o [odciskach palców](#how-do-you-determine-an-email-fingerprint) dla lepszego zrozumienia, jak obliczany jest odcisk wiadomości. Pomyślnie wysłane odciski odbić wygasają po 7 dniach w naszej pamięci Redis.

3. Wysyłamy tylko wtedy, gdy MAIL FROM i/lub From nie jest pusty i nie zawiera (niezależnie od wielkości liter) [nazwy użytkownika postmaster](#what-are-postmaster-addresses) (część przed @ w adresie e-mail).

4. Nie wysyłamy, jeśli oryginalna wiadomość miała którykolwiek z następujących nagłówków (niezależnie od wielkości liter):

   * Nagłówek `auto-submitted` z wartością różną od `no`.
   * Nagłówek `x-auto-response-suppress` z wartością `dr`, `autoreply`, `auto-reply`, `auto_reply` lub `all`
   * Nagłówek `list-id`, `list-subscribe`, `list-unsubscribe`, `list-help`, `list-post`, `list-owner`, `list-archive`, `x-autoreply`, `x-autorespond` lub `x-auto-respond` (bez względu na wartość).
   * Nagłówek `precedence` z wartością `bulk`, `autoreply`, `auto-reply`, `auto_reply` lub `list`.

5. Nie wysyłamy, jeśli adres e-mail MAIL FROM lub From kończy się na `+donotreply`, `-donotreply`, `+noreply` lub `-noreply`.

6. Nie wysyłamy, jeśli część nazwy użytkownika adresu From to `mdaemon` i posiadał nagłówek `X-MDDSN-Message` (niezależnie od wielkości liter).

7. Nie wysyłamy, jeśli istniał nagłówek `content-type` o wartości `multipart/report` (niezależnie od wielkości liter).

### Jak określasz odcisk palca e-maila {#how-do-you-determine-an-email-fingerprint}

Odcisk palca e-maila służy do określenia unikalności wiadomości i zapobiegania dostarczaniu duplikatów oraz wysyłaniu [duplikatów odbić](#prevent-unnecessary-bounces-to-protect-against-backscatter).

Odcisk palca jest obliczany na podstawie następującej listy:

* Rozwiązana nazwa FQDN klienta lub adres IP
* Wartość nagłówka `Message-ID` (jeśli istnieje)
* Wartość nagłówka `Date` (jeśli istnieje)
* Wartość nagłówka `From` (jeśli istnieje)
* Wartość nagłówka `To` (jeśli istnieje)
* Wartość nagłówka `Cc` (jeśli istnieje)
* Wartość nagłówka `Subject` (jeśli istnieje)
* Wartość `Body` (jeśli istnieje)

### Czy mogę przekierowywać e-maile na porty inne niż 25 (np. jeśli mój ISP zablokował port 25) {#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25}

Tak, od 5 maja 2020 dodaliśmy tę funkcję. Obecnie funkcja jest specyficzna dla domeny, a nie dla aliasu. Jeśli potrzebujesz, aby była specyficzna dla aliasu, skontaktuj się z nami, aby poinformować nas o swoich potrzebach.

<div class="alert my-3 alert-danger">
  <i class="fa fa-stop-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Zwiększona ochrona prywatności:
  </strong>
  <span>
    Jeśli korzystasz z płatnego planu (który oferuje zwiększoną ochronę prywatności), przejdź do <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Moje konto <i class="fa fa-angle-right"></i> Domeny</a>, kliknij "Konfiguruj" obok swojej domeny, a następnie kliknij "Ustawienia". Jeśli chcesz dowiedzieć się więcej o płatnych planach, zobacz naszą stronę <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Cennik</a>. W przeciwnym razie możesz kontynuować zgodnie z poniższymi instrukcjami.
  </span>
</div>
Jeśli korzystasz z darmowego planu, po prostu dodaj nowy rekord DNS <strong class="notranslate">TXT</strong> jak pokazano poniżej, ale zmień port z 25 na wybrany przez siebie port.

Na przykład, jeśli chcę, aby wszystkie e-maile trafiające do `example.com` były przekazywane do portu SMTP aliasów odbiorców 1337 zamiast 25:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nazwa/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Odpowiedź/Wartość</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", lub puste</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email-port=1337</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Wskazówka:
  </strong>
    Najczęstszym scenariuszem konfiguracji przekierowania na niestandardowy port jest sytuacja, gdy chcesz przekierować wszystkie e-maile trafiające do example.com na inny port w example.com, niż standardowy port SMTP 25. Aby to ustawić, po prostu dodaj następujący rekord <strong class="notranslate">TXT</strong> catch-all.
  <span>
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nazwa/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Odpowiedź/Wartość</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", lub puste</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=example.com</code></td>
    </tr>
  </tbody>
</table>

### Czy obsługuje symbol plus + dla aliasów Gmaila {#does-it-support-the-plus--symbol-for-gmail-aliases}

Tak, absolutnie.

### Czy obsługuje subdomeny {#does-it-support-sub-domains}

Tak, absolutnie. Zamiast używać "@", ".", lub pustego pola jako nazwy/hosta/aliasa, po prostu użyj nazwy subdomeny jako wartości.

Jeśli chcesz, aby `foo.example.com` przekazywało e-maile, wpisz `foo` jako wartość nazwy/hosta/aliasa w ustawieniach DNS (zarówno dla rekordów MX, jak i <strong class="notranslate">TXT</strong>).

### Czy przekazuje nagłówki moich e-maili {#does-this-forward-my-emails-headers}

Tak, absolutnie.

### Czy jest to dobrze przetestowane {#is-this-well-tested}

Tak, posiada testy napisane za pomocą [ava](https://github.com/avajs/ava) oraz ma pokrycie kodu.

### Czy przekazujecie wiadomości i kody odpowiedzi SMTP {#do-you-pass-along-smtp-response-messages-and-codes}

Tak, absolutnie. Na przykład, jeśli wysyłasz e-mail do `hello@example.com` i jest on zarejestrowany do przekierowania na `user@gmail.com`, to wiadomość i kod odpowiedzi SMTP z serwera SMTP "gmail.com" zostaną zwrócone zamiast z serwera proxy na "mx1.forwardemail.net" lub "mx2.forwardemail.net".

### Jak zapobiegacie spamowi i zapewniacie dobrą reputację przekazywania e-maili {#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation}

Zobacz nasze sekcje dotyczące [Jak działa wasz system przekazywania e-maili](#how-does-your-email-forwarding-system-work), [Jak radzicie sobie z problemami z dostarczaniem e-maili](#how-do-you-handle-email-delivery-issues) oraz [Jak radzicie sobie z blokowaniem waszych adresów IP](#how-do-you-handle-your-ip-addresses-becoming-blocked) powyżej.

### Jak wykonujecie zapytania DNS dla nazw domen {#how-do-you-perform-dns-lookups-on-domain-names}

Stworzyliśmy projekt oprogramowania open-source :tangerine: [Tangerine](https://github.com/forwardemail/tangerine) i używamy go do zapytań DNS. Domyślne serwery DNS to `1.1.1.1` i `1.0.0.1`, a zapytania DNS są wykonywane przez [DNS over HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") na warstwie aplikacji.

:tangerine: [Tangerine](https://github.com/tangerine) domyślnie korzysta z [usługi DNS dla konsumentów z priorytetem prywatności CloudFlare][cloudflare-dns].


## Konto i rozliczenia {#account-and-billing}

### Czy oferujecie gwarancję zwrotu pieniędzy na płatnych planach {#do-you-offer-a-money-back-guarantee-on-paid-plans}

Tak! Automatyczne zwroty następują, gdy uaktualnisz, obniżysz plan lub anulujesz konto w ciągu 30 dni od rozpoczęcia planu. Dotyczy to tylko klientów korzystających z usługi po raz pierwszy.
### Jeśli zmienię plan, czy naliczacie proporcjonalnie i zwracacie różnicę {#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference}

Nie naliczamy proporcjonalnie ani nie zwracamy różnicy przy zmianie planu. Zamiast tego przeliczamy pozostały czas od daty wygaśnięcia Twojego obecnego planu na najbliższy odpowiadający czas trwania nowego planu (zaokrąglany w dół do miesiąca).

Zauważ, że jeśli przejdziesz na wyższy lub niższy płatny plan w ciągu 30 dni od rozpoczęcia pierwszego płatnego planu, automatycznie zwrócimy pełną kwotę za Twój obecny plan.

### Czy mogę używać tej usługi przekazywania e-maili jako serwera MX "awaryjnego" lub "zapasowego" {#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server}

Nie, nie jest to zalecane, ponieważ można używać tylko jednego serwera wymiany poczty na raz. Serwery zapasowe zwykle nigdy nie są ponownie próbowane z powodu błędnych konfiguracji priorytetów oraz serwerów pocztowych, które nie respektują sprawdzania priorytetu wymiany MX.

### Czy mogę wyłączyć konkretne aliasy {#can-i-disable-specific-aliases}

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Ważne:
  </strong>
  <span>
    Jeśli korzystasz z płatnego planu, musisz przejść do <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Moje konto <i class="fa fa-angle-right"></i> Domeny</a> <i class="fa fa-angle-right"></i> Aliasy <i class="fa fa-angle-right"></i> Edytuj alias <i class="fa fa-angle-right"></i> Odznacz pole "Aktywny" <i class="fa fa-angle-right"></i> Kontynuuj.
  </span>
</div>

Tak, wystarczy edytować swój rekord DNS <strong class="notranslate">TXT</strong> i poprzedzić alias jednym, dwoma lub trzema wykrzyknikami (patrz poniżej).

Zauważ, że *powinieneś* zachować mapowanie ":", ponieważ jest to wymagane, jeśli kiedykolwiek zdecydujesz się to wyłączyć (jest też używane podczas importu, jeśli przejdziesz na jeden z naszych płatnych planów).

**Dla cichego odrzucenia (dla nadawcy wygląda, jakby wiadomość została wysłana pomyślnie, ale faktycznie nigdzie nie trafia) (kod statusu `250`):** Jeśli poprzedzisz alias pojedynczym wykrzyknikiem "!", zwróci on nadawcom próbującym wysłać na ten adres kod statusu `250` oznaczający sukces, ale same e-maile nie zostaną dostarczone (np. czarna dziura lub `/dev/null`).

**Dla miękkiego odrzucenia (kod statusu `421`):** Jeśli poprzedzisz alias podwójnym wykrzyknikiem "!!", zwróci on nadawcom próbującym wysłać na ten adres kod błędu `421`, a e-maile będą często ponawiane przez okres do 5 dni przed odrzuceniem i zwrotem.

**Dla twardego odrzucenia (kod statusu `550`):** Jeśli poprzedzisz alias potrójnym wykrzyknikiem "!!!", zwróci on nadawcom próbującym wysłać na ten adres trwały błąd `550`, a e-maile zostaną odrzucone i zwrócone.

Na przykład, jeśli chcę, aby wszystkie e-maile wysyłane na `alias@example.com` przestały być przekazywane do `user@gmail.com` i zostały odrzucone oraz zwrócone (np. użyj trzech wykrzykników):

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nazwa/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Odpowiedź/Wartość</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", lub puste</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=!!!alias:user@gmail.com</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Wskazówka:
  </strong>
  <span>
    Możesz też przepisać adres odbiorcy przekazywanego na po prostu "nobody@forwardemail.net", co spowoduje skierowanie go do nikogo, jak w poniższym przykładzie.
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nazwa/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Odpowiedź/Wartość</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", lub puste</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=!!!alias:nobody@forwardemail.net</code></td>
    </tr>
  </tbody>
</table>
<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Wskazówka:
  </strong>
  <span>
    Jeśli chcesz zwiększyć bezpieczeństwo, możesz również usunąć część ":user@gmail.com" (lub ":nobody@forwardemail.net"), pozostawiając tylko "!!!alias", jak w poniższym przykładzie.
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nazwa/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Odpowiedź/Wartość</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", lub puste</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=!!!alias</code></td>
    </tr>
  </tbody>
</table>

### Czy mogę przekazywać e-maile do wielu odbiorców {#can-i-forward-emails-to-multiple-recipients}

Tak, oczywiście. Wystarczy określić wielu odbiorców w swoich rekordach <strong class="notranslate">TXT</strong>.

Na przykład, jeśli chcę, aby e-mail wysłany na `hello@example.com` był przekazywany do `user+a@gmail.com` oraz `user+b@gmail.com`, mój rekord <strong class="notranslate">TXT</strong> wyglądałby tak:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nazwa/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Odpowiedź/Wartość</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", lub puste</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code class="cursor-initial" data-original-title="" title="">forward-email=hello:user+a@gmail.com,hello:user+b@gmail.com</code></td>
    </tr>
  </tbody>
</table>

Lub możesz określić je w dwóch oddzielnych liniach, na przykład tak:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nazwa/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Odpowiedź/Wartość</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", lub puste</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=hello:user+a@gmail.com</code></td>
    </tr>
    <tr>
      <td><em>"@", ".", lub puste</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=hello:user+b@gmail.com</code></td>
    </tr>
  </tbody>
</table>

Decyzja należy do Ciebie!

### Czy mogę mieć wielu globalnych odbiorców catch-all {#can-i-have-multiple-global-catch-all-recipients}

Tak, możesz. Wystarczy określić wielu globalnych odbiorców catch-all w swoich rekordach <strong class="notranslate">TXT</strong>.

Na przykład, jeśli chcę, aby każdy e-mail wysłany na `*@example.com` (gwiazdka oznacza wildcard, czyli catch-all) był przekazywany do `user+a@gmail.com` oraz `user+b@gmail.com`, mój rekord <strong class="notranslate">TXT</strong> wyglądałby tak:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nazwa/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Odpowiedź/Wartość</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", lub puste</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=user+a@gmail.com,user+b@gmail.com</code></td>
    </tr>
  </tbody>
</table>

Lub możesz określić je w dwóch oddzielnych liniach, na przykład tak:

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nazwa/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Typ</th>
      <th>Odpowiedź/Wartość</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", lub puste</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=user+a@gmail.com</code></td>
    </tr>
    <tr>
      <td><em>@, ".", lub puste</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=user+b@gmail.com</code></td>
    </tr>
  </tbody>
</table>
To zależy od Ciebie!

### Czy istnieje maksymalny limit liczby adresów e-mail, na które mogę przekierować alias {#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias}

Tak, domyślny limit to 10. To NIE oznacza, że możesz mieć tylko 10 aliasów na swojej domenie. Możesz mieć dowolną liczbę aliasów (nieograniczoną ilość). Oznacza to, że możesz przekierować jeden alias na 10 unikalnych adresów e-mail. Możesz mieć `hello:user+1@gmail.com`, `hello:user+2@gmail.com`, `hello:user+3@gmail.com`, … (od 1 do 10) – i wszystkie e-maile wysłane na `hello@example.com` będą przekierowywane na `user+1@gmail.com`, `user+2@gmail.com`, `user+3@gmail.com`, … (od 1 do 10).

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Wskazówka:
  </strong>
  <span>
    Potrzebujesz więcej niż 10 odbiorców na alias? Napisz do nas e-mail, a chętnie zwiększymy limit Twojego konta.
  </span>
</div>

### Czy mogę rekurencyjnie przekierowywać e-maile {#can-i-recursively-forward-emails}

Tak, możesz, jednak musisz nadal przestrzegać maksymalnego limitu. Jeśli masz `hello:linus@example.com` oraz `linus:user@gmail.com`, to e-maile wysłane na `hello@example.com` będą przekierowywane na `linus@example.com` oraz `user@gmail.com`. Zwróć uwagę, że zostanie zgłoszony błąd, jeśli spróbujesz rekurencyjnie przekierować e-maile poza maksymalny limit.

### Czy ludzie mogą wyrejestrować lub zarejestrować moje przekierowanie e-mail bez mojej zgody {#can-people-unregister-or-register-my-email-forwarding-without-my-permission}

Używamy weryfikacji rekordów MX i <strong class="notranslate">TXT</strong>, więc jeśli dodasz odpowiednie rekordy MX i <strong class="notranslate">TXT</strong> tej usługi, to jesteś zarejestrowany. Jeśli je usuniesz, to jesteś wyrejestrowany. Posiadasz własność swojej domeny i zarządzanie DNS, więc jeśli ktoś ma do tego dostęp, to jest to problem.

### Jak to jest darmowe {#how-is-it-free}

Forward Email oferuje darmowy plan dzięki połączeniu rozwoju open source, efektywnej infrastruktury oraz opcjonalnych płatnych planów wspierających usługę.

Nasz darmowy plan jest wspierany przez:

1. **Rozwój Open Source**: Nasz kod jest otwarty, co pozwala na wkład społeczności i transparentne działanie.

2. **Efektywną Infrastrukturę**: Optymalizujemy nasze systemy, aby obsługiwać przekierowywanie e-maili przy minimalnym zużyciu zasobów.

3. **Płatne Plany Premium**: Użytkownicy potrzebujący dodatkowych funkcji, takich jak wysyłanie SMTP, odbieranie IMAP czy zaawansowane opcje prywatności, subskrybują nasze płatne plany.

4. **Rozsądne Limity Użytkowania**: Darmowy plan ma uczciwe zasady użytkowania, aby zapobiegać nadużyciom.

> \[!NOTE]
> Zobowiązujemy się do utrzymania podstawowego przekierowywania e-maili za darmo, oferując jednocześnie funkcje premium dla użytkowników o bardziej zaawansowanych potrzebach.

> \[!TIP]
> Jeśli uważasz naszą usługę za wartościową, rozważ przejście na płatny plan, aby wspierać dalszy rozwój i utrzymanie.

### Jaki jest maksymalny rozmiar e-maila {#what-is-the-max-email-size-limit}

Domyślnie limit rozmiaru to 50MB, co obejmuje treść, nagłówki i załączniki. Zwróć uwagę, że usługi takie jak Gmail i Outlook dopuszczają tylko limit 25MB, a jeśli przekroczysz ten limit wysyłając do adresów u tych dostawców, otrzymasz komunikat o błędzie.

Zwracany jest błąd z odpowiednim kodem odpowiedzi, jeśli przekroczysz limit rozmiaru pliku.

### Czy przechowujecie logi e-maili {#do-you-store-logs-of-emails}

Nie, nie zapisujemy na dysku ani nie przechowujemy logów – z [wyjątkiem błędów](#do-you-store-error-logs) oraz [wychodzącego SMTP](#do-you-support-sending-email-with-smtp) (zobacz naszą [Politykę Prywatności](/privacy)).

Wszystko odbywa się w pamięci, a [nasz kod źródłowy jest na GitHub](https://github.com/forwardemail).

### Czy przechowujecie logi błędów {#do-you-store-error-logs}

**Tak. Możesz uzyskać dostęp do logów błędów w [Moje Konto → Logi](/my-account/logs) lub [Moje Konto → Domeny](/my-account/domains).**

Od lutego 2023 przechowujemy logi błędów dla kodów odpowiedzi SMTP `4xx` i `5xx` przez okres 7 dni – zawierają one błąd SMTP, kopertę i nagłówki e-mail (nie przechowujemy treści e-maila ani załączników).
Dzienniki błędów pozwalają sprawdzić brakujące ważne e-maile i ograniczyć fałszywe pozytywy spamu dla [Twoich domen](/my-account/domains). Są również świetnym źródłem do debugowania problemów z [webhookami e-mail](#do-you-support-webhooks) (ponieważ dzienniki błędów zawierają odpowiedź punktu końcowego webhooka).

Dzienniki błędów dla [ograniczeń szybkości](#do-you-have-rate-limiting) i [szarej listy](#do-you-have-a-greylist) nie są dostępne, ponieważ połączenie kończy się wcześniej (np. przed przesłaniem poleceń `RCPT TO` i `MAIL FROM`).

Zobacz naszą [Politykę prywatności](/privacy) po więcej informacji.

### Czy czytacie moje e-maile {#do-you-read-my-emails}

Nie, absolutnie nie. Zobacz naszą [Politykę prywatności](/privacy).

Wiele innych usług przekazywania e-maili przechowuje i potencjalnie może czytać Twoje e-maile. Nie ma powodu, aby przekazywane e-maile były zapisywane na dysku – dlatego zaprojektowaliśmy pierwsze rozwiązanie open-source, które wszystko robi w pamięci.

Wierzymy, że powinieneś mieć prawo do prywatności i ściśle je szanujemy. Kod wdrożony na serwerze to [oprogramowanie open-source na GitHub](https://github.com/forwardemail) dla przejrzystości i budowania zaufania.

### Czy mogę "wysyłać e-maile jako" w Gmailu z tym {#can-i-send-mail-as-in-gmail-with-this}

Tak! Od 2 października 2018 dodaliśmy tę funkcję. Zobacz [Jak wysyłać e-maile jako za pomocą Gmaila](#how-to-send-mail-as-using-gmail) powyżej!

Powinieneś również ustawić rekord SPF dla Gmaila w konfiguracji DNS w rekordzie <strong class="notranslate">TXT</strong>.

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Ważne:
  </strong>
  <span>
    Jeśli używasz Gmaila (np. Wyślij e-mail jako) lub G Suite, musisz dodać <code>include:_spf.google.com</code> do swojego rekordu SPF <strong class="notranslate">TXT</strong>, na przykład:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
  </span>
</div>

### Czy mogę "wysyłać e-maile jako" w Outlooku z tym {#can-i-send-mail-as-in-outlook-with-this}

Tak! Od 2 października 2018 dodaliśmy tę funkcję. Po prostu zapoznaj się z tymi dwoma linkami od Microsoft poniżej:

* <https://support.office.com/en-us/article/add-or-remove-an-email-alias-in-outlook-com-459b1989-356d-40fa-a689-8f285b13f1f2>
* <https://support.office.com/en-us/article/send-email-from-a-different-address-in-outlook-com-ccba89cb-141c-4a36-8c56-6d16a8556d2e>

Powinieneś również ustawić rekord SPF dla Outlooka w konfiguracji DNS w rekordzie <strong class="notranslate">TXT</strong>.

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Ważne:
  </strong>
  <span>
    Jeśli używasz Microsoft Outlook lub Live.com, musisz dodać <code>include:spf.protection.outlook.com</code> do swojego rekordu SPF <strong class="notranslate">TXT</strong>, na przykład:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:spf.protection.outlook.com -all</code>
  </span>
</div>

### Czy mogę "wysyłać e-maile jako" w Apple Mail i iCloud Mail z tym {#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this}

Jeśli jesteś subskrybentem iCloud+, możesz używać własnej domeny. [Nasza usługa jest również kompatybilna z Apple Mail](#apple-mail).

Proszę zobaczyć <https://support.apple.com/en-us/102540> po więcej informacji.

### Czy mogę przekazywać nieograniczoną liczbę e-maili z tym {#can-i-forward-unlimited-emails-with-this}

Tak, jednak "stosunkowo nieznani" nadawcy są ograniczeni do 100 połączeń na godzinę na nazwę hosta lub IP. Zobacz sekcję o [ograniczeniach szybkości](#do-you-have-rate-limiting) i [szarej liście](#do-you-have-a-greylist) powyżej.

Przez "stosunkowo nieznanych" rozumiemy nadawców, którzy nie znajdują się na [liście dozwolonych](#do-you-have-an-allowlist).

Jeśli limit zostanie przekroczony, wysyłamy kod odpowiedzi 421, który mówi serwerowi nadawcy, aby spróbował ponownie później.

### Czy oferujecie nieograniczoną liczbę domen za jedną cenę {#do-you-offer-unlimited-domains-for-one-price}

Tak. Niezależnie od wybranego planu, zapłacisz tylko jedną miesięczną stawkę – która obejmuje wszystkie Twoje domeny.
### Jakie metody płatności akceptujecie {#which-payment-methods-do-you-accept}

Forward Email akceptuje następujące jednorazowe lub miesięczne/kwartalne/roczne metody płatności:

1. **Karty kredytowe/debetowe/przelewy bankowe**: Visa, Mastercard, American Express, Discover, JCB, Diners Club itp.
2. **PayPal**: Połącz swoje konto PayPal, aby ułatwić płatności
3. **Kryptowaluty**: Akceptujemy płatności za pośrednictwem stablecoinów Stripe na sieciach Ethereum, Polygon i Solana

> \[!NOTE]
> Przechowujemy ograniczone informacje o płatnościach na naszych serwerach, które obejmują jedynie identyfikatory płatności oraz odniesienia do [Stripe](https://stripe.com/global) i [PayPal](https://www.paypal.com) transakcji, klientów, subskrypcji i ID płatności.

> \[!TIP]
> Dla maksymalnej prywatności rozważ użycie płatności kryptowalutami.

Wszystkie płatności są przetwarzane bezpiecznie przez Stripe lub PayPal. Twoje dane płatnicze nigdy nie są przechowywane na naszych serwerach.


## Dodatkowe zasoby {#additional-resources}

> \[!TIP]
> Nasze poniższe artykuły są regularnie aktualizowane o nowe przewodniki, wskazówki i informacje techniczne. Sprawdzaj je często, aby być na bieżąco.

* [Studia przypadków i dokumentacja dla programistów](/blog/docs)
* [Zasoby](/resources)
* [Przewodniki](/guides)

[gmail-2fa]: https://myaccount.google.com/signinoptions/two-step-verification

[cloudflare-dns]: https://blog.cloudflare.com/announcing-1111/
