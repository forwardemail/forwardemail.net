# Często zadawane pytania {#frequently-asked-questions}

<img loading="lazy" src="/img/articles/faq.webp" alt="" class="rounded-lg" />

## Spis treści {#table-of-contents}

* [Szybki start](#quick-start)
* [Wstęp](#introduction)
  * [Co to jest przekazywanie wiadomości e-mail](#what-is-forward-email)
  * [Kto korzysta z funkcji Forward Email](#who-uses-forward-email)
  * [Czym jest historia Forward Email](#what-is-forward-emails-history)
  * [Jak szybka jest ta usługa?](#how-fast-is-this-service)
* [Klienci poczty e-mail](#email-clients)
  * [Ptak piorunowy](#thunderbird)
  * [Microsoft Outlook](#microsoft-outlook)
  * [Poczta Apple](#apple-mail)
  * [Urządzenia mobilne](#mobile-devices)
  * [Jak wysłać wiadomość e-mail za pomocą Gmaila](#how-to-send-mail-as-using-gmail)
  * [Jaki jest darmowy przewodnik po funkcji Wyślij pocztę jako za pomocą Gmaila?](#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail)
  * [Zaawansowana konfiguracja routingu Gmaila](#advanced-gmail-routing-configuration)
  * [Zaawansowana konfiguracja routingu programu Outlook](#advanced-outlook-routing-configuration)
* [Rozwiązywanie problemów](#troubleshooting)
  * [Dlaczego nie otrzymuję wiadomości e-mail testowych?](#why-am-i-not-receiving-my-test-emails)
  * [Jak skonfigurować klienta poczty e-mail do współpracy z funkcją przekazywania wiadomości e-mail?](#how-do-i-configure-my-email-client-to-work-with-forward-email)
  * [Dlaczego moje wiadomości e-mail trafiają do folderu Spam i Wiadomości-śmieci oraz jak mogę sprawdzić reputację mojej domeny](#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation)
  * [Co powinienem zrobić, jeśli otrzymuję wiadomości spam?](#what-should-i-do-if-i-receive-spam-emails)
  * [Dlaczego moje testowe wiadomości e-mail wysyłane do mnie w Gmailu są oznaczone jako „podejrzane”](#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious)
  * [Czy mogę usunąć domenę via forwardemail dot net z Gmaila?](#can-i-remove-the-via-forwardemail-dot-net-in-gmail)
* [Zarządzanie danymi](#data-management)
  * [Gdzie znajdują się wasze serwery?](#where-are-your-servers-located)
  * [Jak wyeksportować i wykonać kopię zapasową mojej skrzynki pocztowej?](#how-do-i-export-and-backup-my-mailbox)
  * [Jak zaimportować i przenieść istniejącą skrzynkę pocztową?](#how-do-i-import-and-migrate-my-existing-mailbox)
  * [Czy wspierasz samodzielne hostowanie?](#do-you-support-self-hosting)
* [Konfiguracja poczty e-mail](#email-configuration)
  * [Jak rozpocząć i skonfigurować przekazywanie wiadomości e-mail](#how-do-i-get-started-and-set-up-email-forwarding)
  * [Czy mogę używać wielu serwerów i central MX do zaawansowanego przekierowywania?](#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding)
  * [Jak skonfigurować automatyczną odpowiedź na wiadomość o nieobecności w biurze?](#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder)
  * [Jak skonfigurować SPF do przekazywania wiadomości e-mail](#how-do-i-set-up-spf-for-forward-email)
  * [Jak skonfigurować DKIM do przekazywania wiadomości e-mail](#how-do-i-set-up-dkim-for-forward-email)
  * [Jak skonfigurować DMARC do przekazywania wiadomości e-mail](#how-do-i-set-up-dmarc-for-forward-email)
  * [Jak połączyć i skonfigurować moje kontakty](#how-do-i-connect-and-configure-my-contacts)
  * [Jak podłączyć i skonfigurować kalendarze](#how-do-i-connect-and-configure-my-calendars)
  * [Jak dodać więcej kalendarzy i zarządzać istniejącymi kalendarzami](#how-do-i-add-more-calendars-and-manage-existing-calendars)
  * [Jak skonfigurować SRS do przekazywania wiadomości e-mail](#how-do-i-set-up-srs-for-forward-email)
  * [Jak skonfigurować MTA-STS do przekazywania wiadomości e-mail](#how-do-i-set-up-mta-sts-for-forward-email)
  * [Jak dodać zdjęcie profilowe do mojego adresu e-mail](#how-do-i-add-a-profile-picture-to-my-email-address)
* [Zaawansowane funkcje](#advanced-features)
  * [Czy obsługujesz newslettery lub listy mailingowe w celu wysyłania wiadomości e-mail związanych z marketingiem?](#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email)
  * [Czy obsługujesz wysyłanie wiadomości e-mail za pomocą API?](#do-you-support-sending-email-with-api)
  * [Czy obsługujesz odbieranie wiadomości e-mail za pomocą protokołu IMAP?](#do-you-support-receiving-email-with-imap)
  * [Czy obsługujesz POP3?](#do-you-support-pop3)
  * [Czy obsługujesz kalendarze (CalDAV)?](#do-you-support-calendars-caldav)
  * [Czy obsługujesz kontakty (CardDAV)](#do-you-support-contacts-carddav)
  * [Czy obsługujesz wysyłanie wiadomości e-mail za pomocą protokołu SMTP?](#do-you-support-sending-email-with-smtp)
  * [Czy obsługujesz OpenPGP/MIME, szyfrowanie typu end-to-end („E2EE”) i katalog kluczy internetowych („WKD”)?](#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd)
  * [Czy wspierasz MTA-STS?](#do-you-support-mta-sts)
  * [Czy obsługujecie klucze dostępu i WebAuthn?](#do-you-support-passkeys-and-webauthn)
  * [Czy wspierasz najlepsze praktyki dotyczące poczty e-mail?](#do-you-support-email-best-practices)
  * [Czy obsługujesz odbicia webhooków?](#do-you-support-bounce-webhooks)
  * [Czy obsługujesz webhooki?](#do-you-support-webhooks)
  * [Czy obsługujesz wyrażenia regularne lub wyrażenia regularne?](#do-you-support-regular-expressions-or-regex)
  * [Jakie są Twoje limity wychodzącego SMTP?](#what-are-your-outbound-smtp-limits)
  * [Czy potrzebuję zgody, aby włączyć SMTP](#do-i-need-approval-to-enable-smtp)
  * [Jakie są ustawienia konfiguracji serwera SMTP?](#what-are-your-smtp-server-configuration-settings)
  * [Jakie są ustawienia konfiguracji serwera IMAP?](#what-are-your-imap-server-configuration-settings)
  * [Jakie są ustawienia konfiguracji serwera POP3?](#what-are-your-pop3-server-configuration-settings)
  * [Konfiguracja przekaźnika SMTP Postfix](#postfix-smtp-relay-configuration)
* [Bezpieczeństwo](#security)
  * [Zaawansowane techniki utwardzania serwera](#advanced-server-hardening-techniques)
  * [Czy posiadasz certyfikaty SOC 2 lub ISO 27001?](#do-you-have-soc-2-or-iso-27001-certifications)
  * [Czy używasz szyfrowania TLS do przekazywania wiadomości e-mail?](#do-you-use-tls-encryption-for-email-forwarding)
  * [Czy zachowujesz nagłówki uwierzytelniania poczty e-mail?](#do-you-preserve-email-authentication-headers)
  * [Czy zachowujesz oryginalne nagłówki wiadomości e-mail i zapobiegasz podszywaniu się?](#do-you-preserve-original-email-headers-and-prevent-spoofing)
  * [Jak chronić się przed spamem i nadużyciami](#how-do-you-protect-against-spam-and-abuse)
  * [Czy przechowujesz treść wiadomości e-mail na dysku?](#do-you-store-email-content-on-disk)
  * [Czy treść wiadomości e-mail może zostać ujawniona podczas awarii systemu?](#can-email-content-be-exposed-during-system-crashes)
  * [Kto ma dostęp do Twojej infrastruktury poczty e-mail](#who-has-access-to-your-email-infrastructure)
  * [Z jakich dostawców infrastruktury korzystasz?](#what-infrastructure-providers-do-you-use)
  * [Czy oferujecie Umowę o przetwarzaniu danych (DPA)](#do-you-offer-a-data-processing-agreement-dpa)
  * [Jak radzicie sobie z powiadomieniami o naruszeniu danych?](#how-do-you-handle-data-breach-notifications)
  * [Czy oferujecie środowisko testowe?](#do-you-offer-a-test-environment)
  * [Czy udostępniacie narzędzia do monitorowania i powiadamiania?](#do-you-provide-monitoring-and-alerting-tools)
  * [Jak zapewnić wysoką dostępność?](#how-do-you-ensure-high-availability)
  * [Czy przestrzegasz sekcji 889 Ustawy o autoryzacji wydatków na obronę narodową (NDAA)?](#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa)
* [Szczegóły systemowe i techniczne](#system-and-technical-details)
  * [Czy przechowujesz wiadomości e-mail i ich zawartość?](#do-you-store-emails-and-their-contents)
  * [Jak działa Twój system przekazywania poczty e-mail](#how-does-your-email-forwarding-system-work)
  * [Jak przetworzyć wiadomość e-mail w celu jej przekazania?](#how-do-you-process-an-email-for-forwarding)
  * [Jak radzisz sobie z problemami z dostarczaniem wiadomości e-mail?](#how-do-you-handle-email-delivery-issues)
  * [Jak sobie radzisz z blokowaniem adresów IP?](#how-do-you-handle-your-ip-addresses-becoming-blocked)
  * [Czym są adresy naczelników poczty?](#what-are-postmaster-addresses)
  * [Czym są adresy bez odpowiedzi](#what-are-no-reply-addresses)
  * [Jakie są adresy IP Twojego serwera](#what-are-your-servers-ip-addresses)
  * [Czy masz listę dozwolonych?](#do-you-have-an-allowlist)
  * [Jakie rozszerzenia nazw domen są domyślnie umieszczane na liście dozwolonych](#what-domain-name-extensions-are-allowlisted-by-default)
  * [Jakie są kryteria listy dozwolonych?](#what-is-your-allowlist-criteria)
  * [Jakie rozszerzenia nazw domen można używać bezpłatnie](#what-domain-name-extensions-can-be-used-for-free)
  * [Czy masz szarą listę?](#do-you-have-a-greylist)
  * [Czy masz listę odrzuconych?](#do-you-have-a-denylist)
  * [Czy masz ograniczenie prędkości?](#do-you-have-rate-limiting)
  * [Jak chronić się przed rozproszeniem wstecznym](#how-do-you-protect-against-backscatter)
  * [Zapobiegaj odrzuceniom od znanych spamerów MAIL FROM](#prevent-bounces-from-known-mail-from-spammers)
  * [Zapobiegaj niepotrzebnym odbiciom, aby chronić się przed rozproszeniem wstecznym](#prevent-unnecessary-bounces-to-protect-against-backscatter)
  * [Jak ustalić odcisk palca poczty e-mail](#how-do-you-determine-an-email-fingerprint)
  * [Czy mogę przekierowywać wiadomości e-mail na inne porty niż 25 (np. jeśli mój dostawca usług internetowych zablokował port 25)?](#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25)
  * [Czy obsługuje symbol plus + dla aliasów Gmaila?](#does-it-support-the-plus--symbol-for-gmail-aliases)
  * [Czy obsługuje subdomeny?](#does-it-support-sub-domains)
  * [Czy to przekazuje nagłówki moich wiadomości e-mail?](#does-this-forward-my-emails-headers)
  * [Czy to jest dobrze przetestowane?](#is-this-well-tested)
  * [Czy przekazujesz wiadomości i kody odpowiedzi SMTP?](#do-you-pass-along-smtp-response-messages-and-codes)
  * [Jak zapobiegać spamowaniu i dbać o dobrą reputację w zakresie przekazywania wiadomości e-mail](#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation)
  * [Jak przeprowadzać wyszukiwania DNS w nazwach domen](#how-do-you-perform-dns-lookups-on-domain-names)
* [Konto i rozliczenia](#account-and-billing)
  * [Czy oferujecie gwarancję zwrotu pieniędzy w przypadku planów płatnych?](#do-you-offer-a-money-back-guarantee-on-paid-plans)
  * [Czy w przypadku zmiany planu rozliczycie różnicę i zwrócicie mi różnicę?](#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference)
  * [Czy mogę używać tej usługi przekierowania poczty elektronicznej jako „zapasowego” lub „zapasowego” serwera MX?](#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server)
  * [Czy mogę wyłączyć określone aliasy?](#can-i-disable-specific-aliases)
  * [Czy mogę przekazywać wiadomości e-mail do wielu odbiorców?](#can-i-forward-emails-to-multiple-recipients)
  * [Czy mogę mieć wielu globalnych odbiorców typu catch-all?](#can-i-have-multiple-global-catch-all-recipients)
  * [Czy istnieje maksymalny limit liczby adresów e-mail, na które mogę przekierować wiadomości na alias?](#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias)
  * [Czy mogę rekurencyjnie przekazywać dalej wiadomości e-mail?](#can-i-recursively-forward-emails)
  * [Czy ludzie mogą wyrejestrować lub zarejestrować przekierowanie mojej poczty e-mail bez mojej zgody?](#can-people-unregister-or-register-my-email-forwarding-without-my-permission)
  * [Jak to jest darmowe?](#how-is-it-free)
  * [Jaki jest maksymalny limit rozmiaru wiadomości e-mail?](#what-is-the-max-email-size-limit)
  * [Czy przechowujesz logi wiadomości e-mail?](#do-you-store-logs-of-emails)
  * [Czy przechowujesz dzienniki błędów?](#do-you-store-error-logs)
  * [Czytasz moje e-maile?](#do-you-read-my-emails)
  * [Czy mogę za pomocą tej funkcji w Gmailu wysłać wiadomość jako?](#can-i-send-mail-as-in-gmail-with-this)
  * [Czy mogę „wysyłać pocztę jako” w programie Outlook za pomocą tego](#can-i-send-mail-as-in-outlook-with-this)
  * [Czy mogę za pomocą tego programu „wysyłać pocztę jako” w aplikacjach Apple Mail i iCloud Mail?](#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this)
  * [Czy mogę przesyłać nieograniczoną liczbę wiadomości e-mail za pomocą tego](#can-i-forward-unlimited-emails-with-this)
  * [Czy oferujecie nieograniczoną liczbę domen za jedną cenę?](#do-you-offer-unlimited-domains-for-one-price)
  * [Jakie metody płatności akceptujecie?](#which-payment-methods-do-you-accept)
* [Dodatkowe zasoby](#additional-resources)

## Szybki start {#quick-start}

Aby rozpocząć korzystanie z funkcji przekazywania wiadomości e-mail:

1. **Utwórz konto** na [forwardemail.net/register](https://forwardemail.net/register)

2. **Dodaj i zweryfikuj swoją domenę** w [Moje konto → Domeny](/my-account/domains)

3. **Dodaj i skonfiguruj aliasy e-mail/skrzynki pocztowe** w [Moje konto → Domeny](/my-account/domains) → Aliasy

4. **Przetestuj swoją konfigurację**, wysyłając wiadomość e-mail na jeden ze swoich nowych aliasów

> \[!TIP]
> DNS changes can take up to 24-48 hours to propagate globally, though they often take effect much sooner.

> \[!IMPORTANT]
> For enhanced deliverability, we recommend setting up [SPF](#how-do-i-set-up-spf-for-forward-email), [DKIM](#how-do-i-set-up-dkim-for-forward-email), and [DMARC](#how-do-i-set-up-dmarc-for-forward-email) records.

## Wprowadzenie {#introduction}

### Co to jest przekazywanie wiadomości e-mail do {#what-is-forward-email}

> \[!NOTE]
> Forward Email is perfect for individuals, small businesses, and developers who want professional email addresses without the cost and maintenance of a full email hosting solution.

Forward Email to **dostawca kompleksowych usług poczty elektronicznej** i **dostawca hostingu poczty elektronicznej dla niestandardowych nazw domen**.

Jest to jedyna darmowa i otwartoźródłowa usługa, która umożliwia korzystanie z niestandardowych adresów e-mail w domenie bez konieczności konfigurowania i utrzymywania własnego serwera pocztowego.

Nasza usługa przekierowuje wiadomości e-mail wysyłane do Twojej domeny na istniejące konto e-mail. Możesz nawet wykorzystać nas jako dedykowanego dostawcę hostingu poczty e-mail.

Główne cechy usługi Forward Email:

* **Niestandardowa domena e-mail**: Używaj profesjonalnych adresów e-mail z własną nazwą domeny
* **Bezpłatny poziom**: Podstawowe przekazywanie wiadomości e-mail bez żadnych kosztów
* **Rozszerzona prywatność**: Nie czytamy Twoich wiadomości e-mail ani nie sprzedajemy Twoich danych
* **Open Source**: Cała nasza baza kodów jest dostępna w GitHub
* **Obsługa SMTP, IMAP i POP3**: Pełne możliwości wysyłania i odbierania wiadomości e-mail
* **Szyfrowanie typu end-to-end**: Obsługa OpenPGP/MIME
* **Niestandardowe aliasy typu catch-all**: Twórz nieograniczoną liczbę aliasów e-mail

Możesz porównać nas z ponad 56 innymi dostawcami usług poczty e-mail na [nasza strona porównania e-maili](/blog/best-email-service).

> \[!TIP]
> Learn more about Forward Email by reading our free [Technical Whitepaper](/technical-whitepaper.pdf)

### Kto korzysta z funkcji Przekaż dalej wiadomość e-mail {#who-uses-forward-email}

Oferujemy hosting poczty elektronicznej i usługę przekierowywania poczty elektronicznej dla ponad 500 000 domen, a wśród naszych użytkowników znajdują się:

| Klient | Studium przypadku |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Akademia Marynarki Wojennej Stanów Zjednoczonych | [:page_facing_up: Case Study](/blog/docs/federal-government-email-service-section-889-compliant) |
| Kanoniczny | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| Gry Netflix |  |
| Fundacja Linux | [:page_facing_up: Case Study](/blog/docs/linux-foundation-email-enterprise-case-study) |
| Fundacja PHP |  |
| Radio Fox News |  |
| Sprzedaż reklam Disneya |  |
| jQuery | [:page_facing_up: Case Study](/blog/docs/linux-foundation-email-enterprise-case-study) |
| LineageOS |  |
| Ubuntu | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| W człowieczeństwie | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| Lubuntu | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| Uniwersytet Cambridge | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| Uniwersytet Maryland | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| Uniwersytet Waszyngtoński | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| Uniwersytet Tufts | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| Kolegium Swarthmore | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| Rząd Australii Południowej |  |
| Rząd Republiki Dominikańskiej |  |
| Fly<span>.</span>io |  |
| Hotele RCD |  |
| Isaac Z. Schlueter (npm) | [:page_facing_up: Case Study](/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem) |
| David Heinemeier Hansson (Ruby on Rails) |  |

### Co to jest historia Forward Email {#what-is-forward-emails-history}

Więcej informacji na temat funkcji Forward Email można znaleźć na stronie [nasza strona O nas](/about).

### Jak szybka jest ta usługa {#how-fast-is-this-service}

> \[!NOTE]
> Our system is designed for speed and reliability, with multiple redundant servers to ensure your emails are delivered promptly.

Funkcja Forward Email dostarcza wiadomości z minimalnym opóźnieniem, zazwyczaj w ciągu kilku sekund od ich otrzymania.

Wskaźniki wydajności:

* **Średni czas dostawy**: Mniej niż 5-10 sekund od otrzymania do przekazania ([zobacz naszą stronę monitorującą czas dotarcia do skrzynki odbiorczej „TTI”](/tti))
* **Czas sprawności**: Dostępność usługi na poziomie ponad 99,9%
* **Globalna infrastruktura**: Serwery strategicznie rozmieszczone w celu zapewnienia optymalnego routingu
* **Automatyczne skalowanie**: Nasz system skaluje się w okresach szczytowego zapotrzebowania na pocztę e-mail

Działamy w czasie rzeczywistym, w przeciwieństwie do innych dostawców, którzy polegają na opóźnionych kolejkach.

Nie zapisujemy danych na dysku ani nie przechowujemy logów – za pomocą [wyjątek od błędów](#do-you-store-error-logs) i [wychodzący SMTP](#do-you-support-sending-email-with-smtp) (zobacz nasz [Polityka prywatności](/privacy)).

Wszystko odbywa się w pamięci i jest [nasz kod źródłowy znajduje się na GitHubie](https://github.com/forwardemail).

## Klienci poczty e-mail {#email-clients}

### Thunderbird {#thunderbird}

1. Utwórz nowy alias i wygeneruj hasło w panelu Przekaż dalej e-mail.
2. Otwórz Thunderbirda i przejdź do **Edycja → Ustawienia konta → Akcje konta → Dodaj konto pocztowe**.
3. Wprowadź swoje imię i nazwisko, adres Przekaż dalej e-mail i hasło.
4. Kliknij **Konfiguruj ręcznie** i wprowadź:
* Przychodzące: IMAP, `imap.forwardemail.net`, port 993, SSL/TLS
* Wychodzące: SMTP, `smtp.forwardemail.net`, port 587, STARTTLS
5. Kliknij **Gotowe**.

### Microsoft Outlook {#microsoft-outlook}

1. Utwórz nowy alias i wygeneruj hasło w panelu Przekierowania poczty e-mail.
2. Przejdź do **Plik → Dodaj konto**.
3. Wprowadź swój adres Przekierowania poczty e-mail i kliknij **Połącz**.
4. Wybierz **Opcje zaawansowane** i zaznacz **Pozwól mi skonfigurować konto ręcznie**.
5. Wybierz **IMAP** i wprowadź:
* Przychodzące: `imap.forwardemail.net`, port 993, SSL.
* Wychodzące: `smtp.forwardemail.net`, port 587, TLS.
* Nazwa użytkownika: Twój pełny adres e-mail.
* Hasło: Wygenerowane hasło.
6. Kliknij **Połącz**.

### Apple Mail {#apple-mail}

1. Utwórz nowy alias i wygeneruj hasło w panelu Przekazywania poczty e-mail.
2. Przejdź do **Poczta → Preferencje → Konta → +**
3. Wybierz **Inne konto pocztowe**
4. Wprowadź swoje imię i nazwisko, adres Przekazywania poczty e-mail i hasło.
5. W ustawieniach serwera wprowadź:
* Przychodzące: `imap.forwardemail.net`
* Wychodzące: `smtp.forwardemail.net`
* Nazwa użytkownika: Twój pełny adres e-mail
* Hasło: Wygenerowane hasło.
6. Kliknij **Zaloguj się**

### Urządzenia mobilne {#mobile-devices}

Dla systemu iOS:

1. Przejdź do **Ustawienia → Poczta → Konta → Dodaj konto → Inne**
2. Kliknij **Dodaj konto pocztowe** i wprowadź swoje dane
3. W przypadku ustawień serwera użyj tych samych ustawień IMAP i SMTP, co powyżej

Dla Androida:

1. Przejdź do **Ustawienia → Konta → Dodaj konto → Osobiste (IMAP)**
2. Wprowadź adres e-mail do przekazywania dalej i hasło
3. W przypadku ustawień serwera użyj tych samych ustawień IMAP i SMTP, co powyżej

### Jak wysłać pocztę za pomocą Gmaila {#how-to-send-mail-as-using-gmail}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Szacowany czas konfiguracji:</strong>
<span>Mniej niż 10 minut</span>
</div>

<div class="alert mb-3 alert-success">
<i class="fa fa-bullhorn font-weight-bold"></i>
<strong class="font-weight-bold">
Pierwsze kroki:
</strong>
<span>
Jeśli wykonałeś(-aś) powyższe instrukcje w sekcji <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">Jak rozpocząć i skonfigurować przekierowanie poczty e-mail</a>, możesz kontynuować czytanie poniżej.
</span>
</div>

<div id="wyślij-pocztę-jako-treść">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Ważne:
</strong>
<span>
Upewnij się, że zapoznałeś się z naszymi <a href="/terms" class="alert-link" target="_blank">Warunkami</a>, <a href="/privacy" class="alert-link" target="_blank">Polityką prywatności</a> oraz <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Limitami SMTP wychodzącego</a> – korzystanie z nich jest równoznaczne z potwierdzeniem i wyrażeniem zgody.
</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Ważne:
</strong>
<span>
Jeśli jesteś programistą, zapoznaj się z naszą <a class="alert-link" href="/email-api#outbound-emails" target="_blank">dokumentacją API poczty e-mail</a>.
</span>
</div>

1. Przejdź do <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Moje konto <i class="fa fa-angle-right"></i> Domeny</a> <i class="fa fa-angle-right"></i> Ustawienia <i class="fa fa-angle-right"></i> Konfiguracja wychodzącego SMTP i postępuj zgodnie z instrukcjami konfiguracji

2. Utwórz nowy alias dla swojej domeny w sekcji <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Moje konto <i class="fa fa-angle-right"></i> Domeny</a> <i class="fa fa-angle-right"></i> Aliasy (np. <code><hello@example.com></code>)

3. Kliknij <strong class="text-success"><i class="fa fa-key"></i>Generuj hasło</strong> obok nowo utworzonego aliasu. Skopiuj do schowka i bezpiecznie przechowuj wygenerowane hasło pokazane na ekranie.

4. Przejdź do [Gmail](https://gmail.com) i w sekcji [Ustawienia <i class="fa fa-angle-right"></i> Konta i import <i class="fa fa-angle-right"></i> Wyślij pocztę jako](https://mail.google.com/mail/u/0/#settings/accounts) kliknij „Dodaj inny adres e-mail”

5. Gdy zostaniesz poproszony o podanie „Nazwy”, wpisz nazwę, pod którą chcesz, aby Twój e-mail był widoczny w polu „Od” (np. „Linus Torvalds”).

6. Gdy zostaniesz poproszony o podanie „Adresu e-mail”, wprowadź pełny adres e-mail aliasu utworzonego w sekcji <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Moje konto <i class="fa fa-angle-right"></i> Domeny</a> <i class="fa fa-angle-right"></i> Aliasy (np. <code><hello@example.com></code>)

7. Odznacz „Traktuj jako alias”

8. Kliknij „Następny krok”, aby kontynuować

9. Gdy zostaniesz poproszony o „Serwer SMTP”, wpisz <code>smtp.forwardemail.net</code> i pozostaw port <code>587</code>

10. Gdy zostaniesz poproszony o podanie „Nazwy użytkownika”, wprowadź pełny adres e-mail aliasu utworzonego w sekcji <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Moje konto <i class="fa fa-angle-right"></i> Domeny</a> <i class="fa fa-angle-right"></i> Aliasy (np. <code><hello@example.com></code>)

11. Gdy zostaniesz poproszony o „Hasło”, wklej hasło z <strong class="text-success"><i class="fa fa-key"></i>Generuj hasło</strong> w kroku 3 powyżej

12. Pozostaw zaznaczoną opcję „Połączenie zabezpieczone przy użyciu protokołu TLS”

13. Kliknij „Dodaj konto”, aby kontynuować

14. Otwórz nową kartę [Gmail](https://gmail.com) i poczekaj na otrzymanie wiadomości e-mail z potwierdzeniem (otrzymasz kod weryfikacyjny potwierdzający, że jesteś właścicielem adresu e-mail, którego próbujesz użyć do wysłania wiadomości jako „Wyślij pocztę”).

15. Po otrzymaniu kodu weryfikacyjnego skopiuj go i wklej w wyświetlonym oknie w poprzednim kroku.

16. Po wykonaniu tej czynności wróć do wiadomości e-mail i kliknij łącze, aby „potwierdzić żądanie”. Najprawdopodobniej będziesz musiał wykonać ten krok i poprzedni krok, aby wiadomość e-mail została poprawnie skonfigurowana.

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

### Jaki jest starszy, bezpłatny przewodnik dotyczący funkcji Wyślij pocztę jako za pomocą Gmaila {#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail}

<div class="alert my-3 alert-danger"><i class="fa fa-stop-circle font-weight-bold"></i> <strong class="font-weight-bold">Ważne:</strong> Ten bezpłatny, starszy przewodnik jest przestarzały od maja 2023 r., ponieważ <a class="alert-link" href="/faq#do-you-support-sending-email-with-smtp">we obsługuje teraz wychodzący SMTP</a>. Jeśli skorzystasz z poniższego przewodnika, <a class="alert-link" href="/faq#can-i-remove-the-via-forwardemail-dot-net-in-gmail">this spowoduje, że w wiadomościach wychodzących</a> w Gmailu pojawi się komunikat „<span class="notranslate text-danger font-weight-bold">via forwardemail dot net</span>”.</a></div>

<div class="alert mb-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Szacowany czas konfiguracji:</strong>
<span>Mniej niż 10 minut</span>
</div>

<div class="alert mb-3 alert-success">
<i class="fa fa-bullhorn font-weight-bold"></i>
<strong class="font-weight-bold">
Pierwsze kroki:
</strong>
<span>
Jeśli wykonałeś(-aś) powyższe instrukcje w sekcji <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">Jak rozpocząć i skonfigurować przekierowanie poczty e-mail</a>, możesz kontynuować czytanie poniżej.
</span>
</div>

<div class="mx-auto lazyframe lazyframe-bordinated border border-themed mb-3" data-vendor="youtube_nocookie" title="Jak wysłać pocztę jako za pomocą Gmaila" data-src="https://www.youtube-nocookie.com/embed/MEheS8gM4Xs?autoplay=0"></div>

<div id="legacy-free-guide">

1. Aby to zadziałało, musisz mieć włączoną funkcję [uwierzytelniania dwuskładnikowego w Gmailu][gmail-2fa]. Jeśli nie masz jej włączonej, odwiedź stronę <https://www.google.com/landing/2step/>.

2. Po włączeniu uwierzytelniania dwuskładnikowego (lub jeśli było już włączone), przejdź na stronę <https://myaccount.google.com/apppasswords>.

3. Gdy pojawi się monit „Wybierz aplikację i urządzenie, dla którego chcesz wygenerować hasło aplikacji”:
* Wybierz „Poczta” z listy rozwijanej „Wybierz aplikację”
* Wybierz „Inne” z listy rozwijanej „Wybierz urządzenie”
* Gdy pojawi się monit o wprowadzenie tekstu, wprowadź adres e-mail swojej domeny niestandardowej, z której przekierowujesz (np. <code><hello@example.com></code> — pomoże Ci to śledzić, jeśli używasz tej usługi dla wielu kont)

4. Skopiuj hasło do schowka, który jest generowany automatycznie.
<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Ważne:
</strong>
<span>
Jeśli korzystasz z G Suite, przejdź do panelu administracyjnego <a class="alert-link" href="https://admin.google.com/AdminHome#ServiceSettings/service=email&subtab=filters" rel="noopener noreferrer" target="_blank">Aplikacje <i class="fa fa-angle-right"></i> G Suite <i class="fa fa-angle-right"></i> Ustawienia Gmaila <i class="fa fa-angle-right"></i> Ustawienia</a> i upewnij się, że zaznaczono opcję „Zezwalaj użytkownikom na wysyłanie poczty przez zewnętrzny serwer SMTP...”. Wprowadzenie tej zmiany może potrwać kilka minut, dlatego prosimy o odczekanie kilku minut.
</span>
</div>

5. Przejdź do [Gmail](https://gmail.com) i w sekcji [Ustawienia <i class="fa fa-angle-right"></i> Konta i import <i class="fa fa-angle-right"></i> Wyślij pocztę jako](https://mail.google.com/mail/u/0/#settings/accounts) kliknij „Dodaj inny adres e-mail”

6. Gdy zostaniesz poproszony o podanie „Nazwy”, wpisz nazwę, pod którą chcesz, aby Twój e-mail był widoczny jako „Od” (np. „Linus Torvalds”)

7. Gdy zostaniesz poproszony o podanie „Adresu e-mail”, wprowadź adres e-mail z niestandardową domeną, której użyłeś powyżej (np. <code><hello@example.com></code>)

8. Odznacz „Traktuj jako alias”

9. Kliknij „Następny krok”, aby kontynuować

10. Gdy zostaniesz poproszony o „Serwer SMTP”, wpisz <code>smtp.gmail.com</code> i pozostaw port <code>587</code>

11. Gdy zostaniesz poproszony o „Nazwę użytkownika”, wprowadź część swojego adresu Gmail bez części <span>gmail.com</span> (np. po prostu „user”, jeśli mój adres e-mail to <span><user@gmail.com></span>)
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Ważne:
</strong>
<span>
Jeśli część „Nazwa użytkownika” jest wypełniana automatycznie, <u><strong>musisz ją</strong></u> zmienić na część nazwy użytkownika swojego adresu Gmail.
</span>
</div>

12. Gdy zostaniesz poproszony o „Hasło”, wklej ze schowka hasło wygenerowane w kroku 2 powyżej

13. Pozostaw zaznaczoną opcję „Połączenie zabezpieczone przy użyciu protokołu TLS”

14. Kliknij „Dodaj konto”, aby kontynuować

15. Otwórz nową kartę [Gmail](https://gmail.com) i poczekaj na e-mail weryfikacyjny (otrzymasz kod weryfikacyjny potwierdzający, że jesteś właścicielem adresu e-mail, którego próbujesz użyć do wysłania wiadomości jako „Wyślij pocztę”).

16. Po otrzymaniu kodu weryfikacyjnego skopiuj go i wklej w wyświetlonym oknie w poprzednim kroku.

17. Gdy to zrobisz, wróć do wiadomości e-mail i kliknij link, aby „potwierdzić żądanie”. Najprawdopodobniej będziesz musiał wykonać ten krok i poprzedni krok, aby wiadomość e-mail została poprawnie skonfigurowana.

</div>

### Zaawansowana konfiguracja routingu Gmaila {#advanced-gmail-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Szacowany czas konfiguracji:</strong>
<span>15-30 minut</span>
</div>

Jeśli chcesz skonfigurować zaawansowane kierowanie w Gmailu tak, aby aliasy niepasujące do żadnej skrzynki pocztowej były przekierowywane do wymiany poczty e-mail usługi Forward Email, wykonaj następujące czynności:

1. Zaloguj się do konsoli administracyjnej Google pod adresem [admin.google.com](https://admin.google.com)
2. Przejdź do **Aplikacje → Google Workspace → Gmail → Routing**
3. Kliknij **Dodaj trasę** i skonfiguruj następujące ustawienia:

**Ustawienia pojedynczego odbiorcy:**

* Wybierz „Zmień odbiorcę koperty” i wprowadź swój główny adres Gmail
* Zaznacz „Dodaj nagłówek X-Gm-Original-To z oryginalnym odbiorcą”

**Wzory adresatów kopert:**

* Dodaj wzorzec, który pasuje do wszystkich nieistniejących skrzynek pocztowych (np. `.*@yourdomain.com`)

**Ustawienia serwera e-mail:**

* Wybierz „Trasa do hosta” i wprowadź `mx1.forwardemail.net` jako serwer główny
* Dodaj `mx2.forwardemail.net` jako serwer zapasowy
* Ustaw port na 25
* Wybierz „Wymagaj TLS” dla bezpieczeństwa

4. Kliknij **Zapisz**, aby utworzyć trasę

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Ważne:
</strong>
<span>
Ta konfiguracja będzie działać tylko na kontach Google Workspace z niestandardowymi domenami, a nie na zwykłych kontach Gmail.
</span>
</div>

### Zaawansowana konfiguracja routingu programu Outlook {#advanced-outlook-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Szacowany czas konfiguracji:</strong>
<span>15-30 minut</span>
</div>

Użytkownicy usługi Microsoft 365 (dawniej Office 365) chcący skonfigurować zaawansowane kierowanie, tak aby aliasy niepasujące do skrzynki pocztowej były przekierowywane do wymiany poczty e-mail usługi Forward Email:

1. Zaloguj się do centrum administracyjnego usługi Microsoft 365 pod adresem [admin.microsoft.com](https://admin.microsoft.com)
2. Przejdź do **Exchange → Przepływ poczty → Reguły**
3. Kliknij **Dodaj regułę** i wybierz **Utwórz nową regułę**
4. Nadaj nazwę regule (np. „Przekieruj nieistniejące skrzynki pocztowe do opcji Przekaż dalej pocztę e-mail”)
5. W obszarze **Zastosuj tę regułę, jeśli** wybierz:
* „Adres odbiorcy pasuje do…”
* Wprowadź wzorzec pasujący do wszystkich adresów w Twojej domenie (np. `*@yourdomain.com`)
6. W obszarze **Wykonaj następujące czynności** wybierz:
* „Przekieruj wiadomość do…”
* Wybierz „Następujący serwer poczty”
* Wprowadź `mx1.forwardemail.net` i port 25
* Dodaj `mx2.forwardemail.net` jako serwer zapasowy
7. W obszarze **Z wyjątkiem sytuacji, gdy** wybierz:
* „Odbiorca to…”
* Dodaj wszystkie istniejące skrzynki pocztowe, które nie powinny być przekazywane dalej
8. Ustaw priorytet reguły, aby upewnić się, że będzie ona uruchamiana po innych regułach przepływu poczty
9. Kliknij **Zapisz**, aby aktywować regułę

## Rozwiązywanie problemów {#troubleshooting}

### Dlaczego nie otrzymuję wiadomości testowych {#why-am-i-not-receiving-my-test-emails}

Jeśli wysyłasz wiadomość testową do samego siebie, może ona nie pojawić się w skrzynce odbiorczej, ponieważ będzie miała ten sam nagłówek „Message-ID”.

Jest to powszechnie znany problem, który dotyczy również takich usług jak Gmail. <a href="https://support.google.com/a/answer/1703601">Here to oficjalna odpowiedź Gmaila dotycząca tego problemu</a>.

Jeśli nadal masz problemy, to najprawdopodobniej jest to problem z propagacją DNS. Będziesz musiał poczekać trochę dłużej i spróbować ponownie (lub spróbować ustawić niższą wartość TTL w rekordach <strong class="notranslate">TXT</strong>).

**Nadal masz problemy?** Prosimy o <a href="/help">skontaktowanie się z nami</a>, abyśmy mogli pomóc zbadać problem i szybko znaleźć rozwiązanie.

### Jak skonfigurować klienta poczty e-mail do współpracy z funkcją przekazywania wiadomości e-mail {#how-do-i-configure-my-email-client-to-work-with-forward-email}

<div class="mb-3">
Nasza usługa współpracuje z popularnymi klientami poczty e-mail, takimi jak:
<ul class="ml-1 h4 d-inline list-inline mb-0 pl-0">
<li class="list-inline-item"><a href="/blog/open-source/apple-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Apple&reg;</a></li>
<li class="list-inline-item"><a href="/blog/open-source/windows-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Windows&reg;</a></li>
<li class="list-inline-item"><a href="/blog/open-source/android-email-clients" target="_blank" class="badge badge-light bg-light tekst-ciemny"><i class="fab fa-android"></i> Android&trade;</a></li>
<li class="list-inline-item"><a href="/blog/open-source/linux-email-clients" target="_blank" class="odznaka odznaka-światło bg-światło tekst-ciemny"><i class="fab fa-linux"></i> Linux&reg;</a></li>
<li class="list-inline-item"><a href="/blog/open-source/desktop-email-clients" target="_blank" class="odznaka odznaka-światło bg-światło tekst-ciemny"><i class="fas fa-desktop"></i> Pulpit</a></li>
<li class="list-inline-item"><a href="/blog/open-source/mozilla-firefox-email-clients" target="_blank" class="odznaka odznaka-światło bg-światło tekst-ciemny"><i class="fab fa-firefox-browser"></i> Mozilla Firefox&reg;</a></li>
<li class="list-inline-item"><a href="/blog/open-source/safari-email-clients" target="_blank" class="odznaka-światło bg-światło tekst-ciemny">Safari&reg;</a></li>
<li class="list-inline-item"><a href="/blog/open-source/google-chrome-email-clients" target="_blank" class="odznaka-światło bg-światło tekst-ciemny"><i class="fab fa-chrome"></i> Google Chrome&reg;</a></li>
<li class="list-inline-item"><a href="/blog/open-source/terminal-email-clients" target="_blank" class="odznaka odznaka-światło bg-światło tekst-ciemny"><i class="fas fa-terminal"></i> Terminal</a></li>
</ul>
</div>

<div class="alert alert-primary">
Twoja nazwa użytkownika to adres e-mail Twojego aliasu, a hasło pochodzi z <strong class="text-success"><i class="fa fa-key"></i>Generuj hasło</strong> („Normalne hasło”).
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Wskazówka:
</strong>
<span>Jeśli używasz Thunderbirda, upewnij się, że „Zabezpieczenia połączenia” są ustawione na „SSL/TLS”, a metoda uwierzytelniania jest ustawiona na „Normalne hasło”.</span>
</div>

| Typ | Nazwa hosta | Protokół | Porty |
| :--: | :---------------------: | :-------------------------------------: | :----------------------------------------------------------------------------------: |
| IMAP | `imap.forwardemail.net` | SSL/TLS **Preferowane** | `993` i `2993` |
| SMTP | `smtp.forwardemail.net` | SSL/TLS **Preferowany** lub TLS (STARTTLS) | `465` i `2465` dla SSL/TLS (lub) `587`, `2587`, `2525` i `25` dla TLS (STARTTLS) |

### Dlaczego moje wiadomości e-mail trafiają do folderu Spam i Wiadomości-śmieci i jak mogę sprawdzić reputację mojej domeny {#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation}

Ta sekcja zawiera wskazówki, czy Twoja poczta wychodząca korzysta z naszych serwerów SMTP (np. `smtp.forwardemail.net`) (lub jest przekazywana za pośrednictwem `mx1.forwardemail.net` lub `mx2.forwardemail.net`) i trafia do folderu Spam lub Wiadomości-śmieci u odbiorców.

Rutynowo monitorujemy naszą domenę [Adresy IP](#what-are-your-servers-ip-addresses) pod kątem [wszystkie renomowane listy odrzucające DNS](#how-do-you-handle-your-ip-addresses-becoming-blocked), **więc najprawdopodobniej jest to problem związany z reputacją domeny**.

Wiadomości e-mail mogą trafiać do folderów ze spamem z kilku powodów:

1. **Brak uwierzytelnienia**: Skonfiguruj rekordy [SPF](#how-do-i-set-up-spf-for-forward-email), [DKIM](#how-do-i-set-up-dkim-for-forward-email) i [DMARC](#how-do-i-set-up-dmarc-for-forward-email).

2. **Reputacja domeny**: Nowe domeny często mają neutralną reputację, dopóki nie ugruntują historii wysyłania.

3. **Wyzwalacze treści**: Niektóre słowa lub frazy mogą aktywować filtry antyspamowe.

4. **Wzory wysyłania**: Nagłe zwiększenie liczby wiadomości e-mail może wyglądać podejrzanie.

Aby sprawdzić reputację i kategoryzację swojej domeny, możesz spróbować użyć jednego lub kilku z poniższych narzędzi:

| Nazwa narzędzia | URL | Typ |
| ------------------------------------------- | ---------------------------------------------------------------- | ---------------------- |
| Opinie na temat kategoryzacji domen Cloudflare | <https://radar.cloudflare.com/domains/feedback> | Kategoryzacja |
| Sprawdzanie reputacji domeny i adresu IP Spamhaus | <https://check.spamhaus.org/> | DNSBL |
| Centrum reputacji domen i adresów IP Cisco Talos | <https://talosintelligence.com/reputation_center> | Reputacja |
| Wyszukiwanie reputacji domeny i adresu IP Barracuda | <https://www.barracudacentral.org/lookups/lookup-reputation> | DNSBL |
| Sprawdzenie czarnej listy w MX Toolbox | <https://mxtoolbox.com/blacklists.aspx> | Czarna lista |
| Narzędzia Google Postmaster | <https://www.gmail.com/postmaster/> | Reputacja |
| Centrum nadawcze Yahoo | <https://senders.yahooinc.com/> | Reputacja |
| MultiRBL.valli.org Sprawdzenie czarnej listy | <https://multirbl.valli.org/lookup/> | DNSBL |
| Wynik nadawcy | <https://senderscore.org/act/blocklist-remover/> | Reputacja |
| Inwalizacja | <https://www.invaluement.com/lookup/> | DNSBL |
| SURBL | <https://www.surbl.org/> | DNSBL |
| Usuwanie praw własności intelektualnej Apple/Proofpoint | <https://ipcheck.proofpoint.com/> | Usuwanie |
| Usuwanie Cloudmark IP | <https://csi.cloudmark.com/en/reset/> | Usuwanie |
| SpamCop | <https://www.spamcop.net/bl.shtml> | DNSBL |
| Usuwanie adresów IP Microsoft Outlook i Office 365 | <https://sendersupport.olc.protection.outlook.com/pm/Postmaster> | Usuwanie |
| Poziomy 1, 2 i 3 UCEPROTECT | <https://www.uceprotect.net/en/rblcheck.php> | DNSBL |
| UCEPROTECT's backscatterer.org | <https://www.backscatterer.org/> | Ochrona przed rozpraszaniem wstecznym |
| UCEPROTECT's whitelisted.org | <https://www.whitelisted.org/> (wymaga opłaty) | DNSWL |
| AT&T | `abuse_rbl@abuse-att.net` | Usuwanie |
| AOL/Verizon (np. `[IPTS04]`) | <https://senders.yahooinc.com/> | Usuwanie |
| Komunikacja Coxa | `unblock.request@cox.net` | Usuwanie |
| t-online.de (niemiecki/T-Mobile) | `tobr@rx.t-online.de` | Usuwanie |

> \[!TIP]
> Start with a low volume of high-quality emails to build a positive reputation before sending in larger volumes.

> \[!IMPORTANT]
> If your domain is on a blacklist, each blacklist has its own removal process. Check their websites for instructions.

> \[!TIP]
> If you need additional help or find that we are false-positive listed as spam by a certain email service provider, then please <a href="/help">contact us</a>.

### Co powinienem zrobić, jeśli otrzymam wiadomość spam {#what-should-i-do-if-i-receive-spam-emails}

Powinieneś wypisać się z listy mailingowej (jeśli to możliwe) i zablokować nadawcę.

Prosimy nie zgłaszać wiadomości jako spamu, lecz przekazać ją do naszego ręcznie selekcjonowanego i dbającego o prywatność systemu zapobiegania nadużyciom.

**Adres e-mail, na który należy przesyłać spam to:** <abuse@forwardemail.net>

### Dlaczego moje testowe wiadomości e-mail wysyłane do mnie w Gmailu są oznaczone jako „podejrzane” {#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious}

Jeśli zobaczysz ten komunikat o błędzie w Gmailu, gdy wyślesz wiadomość testową do samego siebie lub gdy osoba, do której wysyłasz wiadomość z użyciem swojego aliasu, otrzyma od Ciebie wiadomość po raz pierwszy, **nie martw się** – jest to wbudowana funkcja bezpieczeństwa Gmaila.

Możesz po prostu kliknąć „Wygląda bezpiecznie”. Na przykład, jeśli wyślesz wiadomość testową za pomocą funkcji wysyłania poczty jako (do kogoś innego), to nie zobaczy on tej wiadomości.

Jednak jeśli zobaczą tę wiadomość, to dlatego, że przyzwyczaili się do tego, że Twoje wiadomości e-mail pochodzą z <john@gmail.com> zamiast <john@customdomain.com> (to tylko przykład). Gmail powiadomi użytkowników, aby upewnić się, że wszystko jest bezpieczne, na wszelki wypadek, nie ma obejścia.

### Czy mogę usunąć via forwardemail dot net z Gmaila {#can-i-remove-the-via-forwardemail-dot-net-in-gmail}

Ten temat jest powiązany z [powszechnie znany problem w Gmailu polegający na tym, że obok nazwy nadawcy pojawiają się dodatkowe informacje](https://support.google.com/mail/answer/1311182).

Od maja 2023 r. obsługujemy wysyłanie wiadomości e-mail za pomocą protokołu SMTP jako dodatek dla wszystkich użytkowników płacących – oznacza to, że możesz usunąć <span class="notranslate">via forwardemail dot net</span> w Gmailu.

Należy pamiętać, że ten temat FAQ dotyczy wyłącznie osób korzystających z funkcji [Jak wysłać wiadomość e-mail za pomocą Gmaila](#how-to-send-mail-as-using-gmail).

Instrukcje konfiguracji można znaleźć w sekcji [Czy obsługujesz wysyłanie wiadomości e-mail za pomocą protokołu SMTP?](#do-you-support-sending-email-with-smtp).

## Zarządzanie danymi {#data-management}

### Gdzie znajdują się Twoje serwery {#where-are-your-servers-located}

> \[!TIP]
> We may soon announce our EU datacenter location hosted under [forwardemail.eu](https://forwardemail.eu).  Subscribe to the discussion at <https://github.com/orgs/forwardemail/discussions/336> for updates.

Nasze serwery zlokalizowane są głównie w Denver, w stanie Kolorado – pełną listę adresów IP można znaleźć pod adresem <https://forwardemail.net/ips>.

Więcej informacji na temat naszych podprocesorów znajdziesz na naszych stronach [GDPR](/gdpr), [DPA](/dpa) i [Prywatność](/privacy).

### Jak wyeksportować i wykonać kopię zapasową mojej skrzynki pocztowej {#how-do-i-export-and-backup-my-mailbox}

W dowolnym momencie możesz wyeksportować swoje skrzynki pocztowe w formacie [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions), [Skrzynka pocztowa](https://en.wikipedia.org/wiki/Mbox) lub szyfrowanym [Sqlite](https://en.wikipedia.org/wiki/SQLite).

Przejdź do <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Moje konto <i class="fa fa-angle-right"></i> Domeny</a> <i class="fa fa-angle-right"></i> Aliasy <i class="fa fa-angle-right"></i> Pobierz kopię zapasową i wybierz preferowany format eksportu.

Po zakończeniu eksportu otrzymasz na adres e-mail link umożliwiający pobranie pliku.

Należy pamiętać, że ze względów bezpieczeństwa łącze umożliwiające eksportowanie plików wygasa po 4 godzinach.

Jeśli chcesz sprawdzić wyeksportowane pliki w formacie EML lub Mbox, przydatne mogą okazać się poniższe narzędzia typu open-source:

| Nazwa | Format | Platforma | Adres URL GitHub |
| --------------- | :----: | ------------- | --------------------------------------------------- |
| Przeglądarka MBox | Skrzynka pocztowa | Okna | <https://github.com/eneam/mboxviewer> |
| przeglądarka internetowa mbox | Skrzynka pocztowa | Wszystkie platformy | <https://github.com/PHMRanger/mbox-web-viewer> |
| EmlReader | EML | Okna | <https://github.com/ayamadori/EmlReader> |
| Przeglądarka poczty e-mail | EML | VSCode | <https://github.com/joelharkes/vscode_email_viewer> |
| czytnik eml | EML | Wszystkie platformy | <https://github.com/s0ph1e/eml-reader> |

Dodatkowo, jeśli musisz przekonwertować plik Mbox na plik EML, możesz użyć <https://github.com/noelmartinon/mboxzilla>.

### Jak zaimportować i przenieść istniejącą skrzynkę pocztową {#how-do-i-import-and-migrate-my-existing-mailbox}

Możesz łatwo zaimportować swoją pocztę do usługi Forward Email (np. używając [Ptak piorunowy](https://www.thunderbird.net)), postępując zgodnie z poniższymi instrukcjami:

<div class="alert alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Ważne:
</strong>
<span>
Aby zaimportować istniejącą wiadomość e-mail, należy wykonać wszystkie poniższe kroki.
</span>
</div>

1. Eksportuj swoją pocztę e-mail od swojego obecnego dostawcy poczty e-mail:

| Dostawca poczty e-mail | Format eksportu | Instrukcje eksportu |
| -------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Gmail | MBOX | <https://takeout.google.com/settings/takeout/custom/gmail> |
| Perspektywy | PST | <div class="alert my-3 alert-danger"><i class="fa fa-info-circle font-weight-bold"></i> <strong class="font-weight-bold">Wskazówka:</strong> <span>Jeśli używasz programu Outlook (<a href="https://support.microsoft.com/en-us/office/back-up-your-email-e5845b0b-1aeb-424f-924c-aa1c33b18833#:~:text=Select%20File%20%3E%20Open%20%26%20Export%20%3E,back%20up%20and%20select%20Next." class="alert-link">format eksportu PST</a>), możesz po prostu postępować zgodnie z instrukcjami podanymi poniżej w sekcji „Inne”. Poniżej zamieściliśmy linki do konwersji plików PST do formatu MBOX/EML w zależności od systemu operacyjnego:<ul class="mb-0 mt-3"><li><a class="alert-link" href="https://github.com/BaselineIT/Zinkuba/releases/download/release-1.2/Zinkuba.App.exe">Zinkuba dla systemu Windows</a> (<a class="alert-link" href="https://github.com/BaselineIT/Zinkuba?tab=readme-ov-file#zinkuba">GitHub</a>)</li><li><a class="alert-link" href="https://cygwin.com/packages/summary/readpst.html">readpst dla systemu Windows cygwin</a> – (np. <code>readpst -u -o $OUT_DIR $IN_DIR</code> zastępując <code>$OUT_DIR</code> i <code>$IN_DIR</code> odpowiednio ścieżkami do katalogu wyjściowego i wejściowego).</li><li><a class="alert-link" href="https://manpages.ubuntu.com/manpages/trusty/man1/readpst.1.html">readpst dla Ubuntu/Linux</a> – (np. <code>sudo apt-get install readpst</code> a następnie <code>readpst -u -o $OUT_DIR $IN_DIR</code>, zastępując <code>$OUT_DIR</code> i <code>$IN_DIR</code> odpowiednio ścieżkami do katalogu wyjściowego i wejściowego).</li><li><a class="alert-link" href="https://formulae.brew.sh/formula/libpst">readpst dla macOS (za pośrednictwem brew)</a> – (np. <code>brew install libpst</code> a następnie <code>readpst -u -o $OUT_DIR $IN_DIR</code>, zastępując <code>$OUT_DIR</code> i <code>$IN_DIR</code> odpowiednio ścieżkami do katalogu wyjściowego i wejściowego).</li><li><a class="alert-link" href="https://github.com/juanirm/pst-converter/tree/master?tab=readme-ov-file#pst-converter">Konwerter PST dla systemu Windows (GitHub)</a></li></ul><br /></span></div> |
| Poczta Apple | MBOX | <https://support.apple.com/guide/mail/import-or-export-mailboxes-mlhlp1030/mac#apd37a3190755974> |
| Szybka poczta | EML | <https://www.fastmail.help/hc/en-us/articles/360060590573-Pobierz-wszystkie-swoje-dane#downloadmail> |
| Proton Mail | MBOX/EML | <https://proton.me/support/export-emails-import-export-app> |
| Tutanota | EML | <https://github.com/crepererum-oss/tatutanatata> |
| Myśleć | EML | <https://docs.gandi.net/en/gandimail/common_operations/backup_email.html#contents> |
| Zoho | EML | <https://www.zoho.com/mail/help/import-export-emails.html#alink2> |
| Inny | [Use Thunderbird](https://www.thunderbird.net) | Skonfiguruj istniejące konto e-mail w Thunderbirdzie, a następnie użyj wtyczki [ImportExportTools NG](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/), aby eksportować i importować wiadomości e-mail. **Możesz też po prostu kopiować i wklejać lub przeciągać i upuszczać wiadomości e-mail między kontami.** |

2. Pobierz, zainstaluj i otwórz [Ptak piorunowy](https://www.thunderbird.net).

3. Utwórz nowe konto, używając pełnego adresu e-mail swojego aliasu (np. <code><ty@twojadomena.com></code>) i wygenerowanego hasła. <strong>Jeśli nie masz jeszcze wygenerowanego hasła, <a href="/faq#do-you-support-receiving-email-with-imap" target="_blank">zapoznaj się z naszymi instrukcjami konfiguracji</a></strong>.

4. Pobierz i zainstaluj wtyczkę [Narzędzia importu i eksportu](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/) Thunderbird.

5. Utwórz nowy folder lokalny w Thunderbirdzie, a następnie kliknij go prawym przyciskiem myszy → wybierz opcję `ImportExportTools NG` → wybierz `Import mbox file` (dla formatu eksportu MBOX) – lub – `Import messages` / `Import all messages from a directory` (dla formatu eksportu EML).

6. Przeciągnij i upuść z folderu lokalnego do nowego (lub istniejącego) folderu IMAP w Thunderbirdzie, do którego chcesz przesłać wiadomości w pamięci masowej IMAP za pomocą naszej usługi. Zapewni to ich kopię zapasową online w naszym szyfrowanym magazynie SQLite.

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Wskazówka:
</strong>
<span>
Jeśli nie wiesz, jak importować do Thunderbirda, zapoznaj się z oficjalnymi instrukcjami na stronach <a class="alert-link" href="https://kb.mozillazine.org/Importing_folders">https://kb.mozillazine.org/Importing_folders</a> i <a class="alert-link" href="https://github.com/thunderbird/import-export-tools-ng/wiki">https://github.com/thunderbird/import-export-tools-ng/wiki</a>.
</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Ważne:
</strong>
<span>
Po zakończeniu procesu eksportu i importu możesz również włączyć przekierowanie na swoim koncie e-mail i skonfigurować automatyczną odpowiedź, aby powiadomić nadawców o nowym adresie e-mail (np. jeśli wcześniej korzystałeś z Gmaila, a teraz używasz adresu e-mail z własną nazwą domeny).
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

### Czy wspierasz samodzielne hostowanie domeny {#do-you-support-self-hosting}

Tak, od marca 2025 roku obsługujemy opcję samodzielnego hostingu. Przeczytaj blog [Tutaj](https://forwardemail.net/blog/docs/self-hosted-solution). Sprawdź [przewodnik hostowany samodzielnie](https://forwardemail.net/self-hosted), aby rozpocząć. Osoby zainteresowane bardziej szczegółową wersją krok po kroku powinny zapoznać się z naszymi poradnikami opartymi na [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) lub [Debian](https://forwardemail.net/guides/selfhosted-on-debian).

## Konfiguracja poczty e-mail {#email-configuration}

### Jak rozpocząć i skonfigurować przekierowanie poczty e-mail {#how-do-i-get-started-and-set-up-email-forwarding}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Szacowany czas konfiguracji:</strong>
<span>Mniej niż 10 minut</span>
</div>

<div class="alert my-3 alert-success">
<i class="fa fa-bullhorn font-weight-bold"></i>
<strong class="font-weight-bold">
Rozpoczęcie pracy:
</strong>
<span>
Uważnie przeczytaj i wykonaj kroki od pierwszego do ósmego wymienione poniżej. Pamiętaj, aby zastąpić adres e-mail <code>user@gmail.com</code> adresem e-mail, na który chcesz przekierowywać wiadomości (jeśli nie jest on jeszcze prawidłowy). Podobnie, pamiętaj, aby zastąpić adres <code>example.com</code> własną nazwą domeny (jeśli nie jest on jeszcze prawidłowy).
</span>
</div>

<ol>
<li class="mb-2 mb-md-3 mb-lg-5">Jeśli zarejestrowałeś już swoją domenę w jakimś miejscu, musisz całkowicie pominąć ten krok i przejść do kroku drugiego! W przeciwnym razie możesz <a href="/domain-registration" rel="noopener noreferrer">kliknąć tutaj, aby zarejestrować swoją domenę</a>.</li>
<li class="mb-2 mb-md-3 mb-lg-5">
Czy pamiętasz, gdzie zarejestrowałeś swoją domenę? Gdy to zrobisz, postępuj zgodnie z poniższymi instrukcjami:

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Ważne:
</strong>
<span>
Musisz otworzyć nową kartę i zalogować się do swojego rejestratora domeny. Możesz łatwo kliknąć poniżej „Rejestrator”, aby automatycznie to zrobić. W tej nowej karcie musisz przejść do strony zarządzania DNS u swojego rejestratora – poniżej, w kolumnie „Kroki konfiguracji”, zamieściliśmy szczegółowe instrukcje nawigacyjne. Po przejściu na tę stronę w nowej karcie możesz wrócić do tej karty i przejść do kroku trzeciego poniżej.
<strong class="font-weight-bold">Nie zamykaj jeszcze otwartej karty; będzie Ci potrzebna do wykonania kolejnych kroków!</strong>
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
<td>Zaloguj się <i class="fa fa-angle-right"></i> Strefy hostowane <i class="fa fa-angle-right"></i> (Wybierz swoją domenę)</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>
<td>Zaloguj się <i class="fa fa-angle-right"></i> Moje serwery <i class="fa fa-angle-right"></i> Zarządzanie domenami <i class="fa fa-angle-right"></i> Menedżer DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.bluehost.com/help/article/dns-management-add-edit-or-delete-dns-entries">Bluehost</a></td>
<td>W PRZYPADKU ROCKA: Zaloguj się <i class="fa fa-angle-right"></i> Domeny <i class="fa fa-angle-right"></i> (Kliknij ikonę ▼ obok opcji zarządzania) <i class="fa fa-angle-right"></i> DNS
<br />
W PRZYPADKU STARSZEJ WERSJI: Zaloguj się <i class="fa fa-angle-right"></i> Domeny <i class="fa fa-angle-right"></i> Edytor strefy <i class="fa fa-angle-right"></i> (Wybierz swoją domenę)</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://dash.cloudflare.com/login">Cloudflare</a></td>
<td>Zaloguj się <i class="fa fa-angle-right"></i> DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://cp.dnsmadeeasy.com/">DNS Ułatwione</a></td>
<td>Zaloguj się <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> (Wybierz swoją domenę)</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://dnsimple.com/dashboard">DNSimple</a></td>
<td>Zaloguj się <i class="fa fa-angle-right"></i> (Wybierz swoją domenę) <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> Zarządzaj</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://cloud.digitalocean.com/login">Digital Ocean</a></td>
<td>Zaloguj się <i class="fa fa-angle-right"></i> Sieci <i class="fa fa-angle-right"></i> Domeny <i class="fa fa-angle-right"></i> (Wybierz swoją domenę) <i class="fa fa-angle-right"></i> Więcej <i class="fa fa-angle-right"></i> Zarządzaj domeną</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.domain.com/help/article/dns-management-how-to-update-dns-records">Domain.com</a></td>
<td>Zaloguj się <i class="fa fa-angle-right"></i> W widoku karty kliknij Zarządzaj swoją domeną <i class="fa fa-angle-right"></i> W widoku listy kliknij
ikonę koła zębatego <i class="fa fa-angle-right"></i> DNS i serwery nazw <i class="fa fa-angle-right"></i> Rekordy DNS</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://www.domains.com/">Domains.com</a>
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=WnU0Gp-Y-es"><i class="fa fa-play-circle"></i> Obserwuj</a>
</td>
<td>Zaloguj się <i class="fa fa-angle-right"></i> (Wybierz swoją domenę) <i class="fa fa-angle-right"></i> Zarządzaj <i class="fa fa-angle-right"></i> (kliknij ikonę koła zębatego) <i class="fa fa-angle-right"></i> Kliknij DNS i serwery nazw w Menu po lewej stronie</td>
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
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=G7g8FiZL5D8"><i class="fa fa-play-circle"></i> Obserwuj</a>
</td>
<td>Zaloguj się <i class="fa fa-angle-right"></i> Zarządzaj moimi domenami <i class="fa fa-angle-right"></i> (Wybierz swoją domenę) <i class="fa fa-angle-right"></i> Zarządzaj DNS</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://domains.google.com/registrar">Google Domeny</a>
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=01iHjbIN5CQ"><i class="fa fa-play-circle"></i> Obserwuj</a>
</td>
<td>Zaloguj się <i class="fa fa-angle-right"></i> (Wybierz swoją domenę) <i class="fa fa-angle-right"></i> Skonfiguruj DNS</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://www.namecheap.com/myaccount/login/">Namecheap</a>
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=no62GCzMn7E"><i class="fa fa-play-circle"></i> Obserwuj</a>
</td>
<td>Zaloguj się <i class="fa fa-angle-right"></i> Lista domen <i class="fa fa-angle-right"></i> (Wybierz swoją domenę) <i class="fa fa-angle-right"></i> Zarządzaj <i class="fa fa-angle-right"></i> Zaawansowany DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://app.netlify.com/">Netlify</a></td>
<td>Zaloguj się <i class="fa fa-angle-right"></i> (Wybierz swoją domenę) <i class="fa fa-angle-right"></i> Skonfiguruj DNS Netlify</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.networksolutions.com/manage-it/index.jsp">Network Rozwiązania</a></td>
<td>Zaloguj się <i class="fa fa-angle-right"></i> Menedżer konta <i class="fa fa-angle-right"></i> Moje nazwy domen <i class="fa fa-angle-right"></i> (Wybierz swoją domenę) <i class="fa fa-angle-right"></i> Zarządzaj <i class="fa fa-angle-right"></i> Zmień, na które adresy wskazuje domena <i class="fa fa-angle-right"></i> Zaawansowany DNS</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://accounts.shopify.com/store-login">Shopify</a>
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=G1NR8CIdv2M"><i class="fa fa-play-circle"></i> Obserwuj</a>
</td>
<td>Zaloguj się <i class="fa fa-angle-right"></i> Zarządzane domeny <i class="fa fa-angle-right"></i> (Wybierz swoją domenę) <i class="fa fa-angle-right"></i> Ustawienia DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://support.squarespace.com/hc/en-us/articles/214767107">Squarespace</a></td>
<td>Zaloguj się <i class="fa fa-angle-right"></i> Menu główne <i class="fa fa-angle-right"></i> Ustawienia <i class="fa fa-angle-right"></i> Domeny <i class="fa fa-angle-right"></i> (Wybierz swoją domenę) <i class="fa fa-angle-right"></i>
Ustawienia zaawansowane <i class="fa fa-angle-right"></i> Rekordy niestandardowe</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://vercel.com/docs/now-cli?utm_source=zeit-dashboard&utm_medium=web&utm_campaign=configure-dns#commands/dns">Vercel's Teraz</a></td>
<td>Korzystanie z wiersza poleceń „now” <i class="fa fa-angle-right"></i> <code>now dns add [domena] '@' MX [wartość-rekordu] [priorytet]</code></td>
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
<div class="alert mb-0 alert-warning"><i class="fa fa-exclamation-circle font-weight-bold"></i> <strong class="font-weight-bold">Ważne:</strong> Nie widzisz tutaj nazwy swojego rejestratora? Po prostu wyszukaj w internecie hasło „jak zmienić rekordy DNS w $REGISTRAR” (zastępując $REGISTRAR nazwą swojego rejestratora – np. „jak zmienić rekordy DNS w GoDaddy”, jeśli korzystasz z GoDaddy).</div>
</td>
</tr>
</tbody>
</table>
</li>
<li class="mb-2 mb-md-3 mb-lg-5">Korzystając ze strony zarządzania DNS swojego rejestratora (drugiej otwartej zakładki), ustaw następujące rekordy „MX”:

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Ważne:
</strong>
<span>
Pamiętaj, że NIE powinny być ustawione żadne inne rekordy MX. Oba poniższe rekordy MUSZĄ istnieć. Upewnij się, że nie ma literówek i że poprawnie wpisałeś/aś zarówno mx1, jak i mx2. Jeśli istniały już rekordy MX, usuń je całkowicie.
Wartość „TTL” nie musi wynosić 3600, w razie potrzeby może być niższa lub wyższa.
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
<td><em>"@", "." lub puste</em></td>
<td class="text-center">3600</td>
<td>MX</td>
<td>0</td>
<td><code>mx1.forwardemail.net</code></td>
</tr>
<tr>
<td><em>"@", "." lub puste</em></td>
<td class="text-center">3600</td>
<td>MX</td>
<td>0</td>
<td><code>mx2.forwardemail.net</code></td>
</tr>
</tbody>
</table>

</li><li class="mb-2 mb-md-3 mb-lg-5" id="dns-configuration-options">Korzystając ze strony zarządzania DNS swojego rejestratora (drugiej otwartej zakładki), ustaw następujące rekordy <strong class="notranslate">TXT</strong>:

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Ważne:
</strong>
<span>
Jeśli korzystasz z planu płatnego, musisz całkowicie pominąć ten krok i przejść do kroku piątego! Jeśli nie korzystasz z planu płatnego, Twoje przekierowane adresy będą publicznie dostępne – przejdź do <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mojego Konta <i class="fa fa-angle-right"></i>Domen</a> i w razie potrzeby zaktualizuj swoją domenę do planu płatnego. Aby dowiedzieć się więcej o planach płatnych, odwiedź naszą stronę <a rel="noopener noreferrer" href="/private-business-email" class="alert-link">Cennik</a>. W przeciwnym razie możesz wybrać jedną lub więcej kombinacji od Opcji A do Opcji F wymienionych poniżej.
</span>
</div>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Opcja A:
</strong>
<span>
Jeśli przekierowujesz wszystkie wiadomości e-mail ze swojej domeny (np. „all@example.com”, „hello@example.com” itd.) na konkretny adres „user@gmail.com”:
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
<td><em>"@", "." lub puste</em></td>
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
Upewnij się, że powyższe wartości w kolumnie „Wartość” zastąpiłeś swoim adresem e-mail. Wartość „TTL” nie musi wynosić 3600, w razie potrzeby może być niższa lub wyższa. Niższa wartość czasu życia („TTL”) zapewni szybszą propagację wszelkich przyszłych zmian w rekordach DNS w Internecie – wyobraź sobie, że to czas, przez jaki będą one przechowywane w pamięci podręcznej (w sekundach). Więcej informacji na temat <a href="https://en.wikipedia.org/wiki/Time_to_live#DNS_records" rel="noopener noreferrer" target="_blank" class="alert-link">TTL znajdziesz w Wikipedii</a>.
</span>
</div>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Opcja B:
</strong>
<span>
Jeśli chcesz przekierować tylko jeden adres e-mail (np. <code>hello@example.com</code> na <code>user@gmail.com</code>; spowoduje to również automatyczne przekierowanie wiadomości z adresu „hello+test@example.com” na adres „user+test@gmail.com”):
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
<td><em>"@", "." lub puste</em></td>
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
Jeśli przesyłasz dalej wiele wiadomości e-mail, rozdziel je przecinkami:
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
<td><em>"@", "." lub puste</em></td>
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
Możesz skonfigurować nieograniczoną liczbę przekierowań wiadomości e-mail – pamiętaj tylko, aby nie zawijać więcej niż 255 znaków w jednym wierszu i rozpoczynać każdy wiersz od „forward-email="”. Przykład znajduje się poniżej:
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
<td><em>"@", "." lub puste</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=hello:user@gmail.com,support:user@gmail.com</code>
</td>
</tr>
<tr>
<td><em>"@", "." lub puste</em></td>
<td class="text-center">3600</td>
<td class="notranslate">Tekst</td>
<td>
<code>forward-email=help:user@gmail.com,foo:user@gmail.com</code>
</td>
</tr>
<tr>
<td><em>"@", "." lub puste</em></td>
<td class="text-center">3600</td>
<td>
<code>forward-email=orders:user@gmail.com,baz:user@gmail.com</code>
</td>
</tr>
<tr>
<td><em>"@", "." lub puste</em></td>
<td class="text-center">3600</td>
<td class="notranslate">Tekst</td>
<td>
<code>forward-email=info:user@gmail.com,beep:user@gmail.com</code>
</td>
</tr>
<tr>
<td><em>"@", "." lub pusty</em></td>
<td class="text-center">3600</td>
<td class="notranslate">Tekst</td>
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
Możesz również określić nazwę domeny w rekordzie <strong class="notranslate">TXT</strong>, aby włączyć globalne przekierowywanie aliasów (np. „user@example.com” zostanie przekierowane na „user@example.net”):
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
<td><em>"@", "." lub puste</em></td>
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
Możesz nawet używać webhooków jako globalnych lub indywidualnych aliasów do przekazywania wiadomości e-mail. Zobacz przykład i pełną sekcję poświęconą webhookom zatytułowaną <a href="#do-you-support-webhooks" class="alert-link">Czy obsługujesz webhooki</a> poniżej.
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
<td><em>"@", "." lub puste</em></td>
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
Możesz nawet używać wyrażeń regularnych („regex”) do dopasowywania aliasów i obsługiwania podstawień, na które przekierowywane są wiadomości e-mail. Zobacz przykłady i pełną sekcję dotyczącą wyrażeń regularnych zatytułowaną <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">Czy obsługujesz wyrażenia regularne, czy wyrażenia regularne</a> poniżej.
</span>
</div>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Potrzebujesz zaawansowanego wyrażenia regularnego z podstawieniem?</strong> Zobacz przykłady i pełną sekcję dotyczącą wyrażeń regularnych zatytułowaną <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">Czy obsługujesz wyrażenia regularne, czy wyrażenia regularne</a> poniżej.
</div>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Prosty przykład:</strong> Jeśli chcę, aby wszystkie wiadomości e-mail kierowane na adres `linus@example.com` lub `torvalds@example.com` były przekazywane na adres `user@gmail.com`:
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
<td><em>"@", "." lub puste</em></td>
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
Reguły przekierowywania uniwersalnego można również określić jako „fall-through”.
Oznacza to, że wiadomości przychodzące, które pasują do co najmniej jednej konkretnej reguły przekierowywania, będą używane zamiast reguły uniwersalnej.
Do konkretnych reguł należą adresy e-mail i wyrażenia regularne.
<br /><br />
Na przykład:
<br />
<code>forward-email=hello:first@gmail.com,second@gmail.com</code>
<br />
Wiadomości e-mail wysłane na adres <code>hello@example.com</code> **NIE** będą przekazywane na adres <code>second@gmail.com</code> (catch-all) z tą konfiguracją, a zamiast tego będą dostarczane tylko na adres <code>first@gmail.com</code>.
</span>
</div>

---

</li><li class="mb-2 mb-md-3 mb-lg-5">Korzystając ze strony zarządzania DNS swojego rejestratora (drugiej otwartej zakładki), ustaw dodatkowo następujący rekord <strong class="notranslate">TXT</strong>:

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
<td><em>"@", "." lub puste</em></td>
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
Jeśli korzystasz z Gmaila (np. Wyślij jako) lub G Suite, musisz dodać <code>include:_spf.google.com</code> do powyższej wartości, na przykład:
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
Jeśli masz już podobny wiersz z „v=spf1”, musisz dodać <code>include:spf.forwardemail.net</code> tuż przed istniejącymi rekordami „include:host.com” i przed „-all” w tym samym wierszu, na przykład:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
<br /><br />
Należy pamiętać, że istnieje różnica między „-all” a „~all”. Znak „-” oznacza, że sprawdzenie SPF powinno zakończyć się niepowodzeniem, jeśli rekord nie zostanie dopasowany, a znak „~” oznacza, że sprawdzenie SPF powinno zakończyć się niepowodzeniem. Zalecamy użycie opcji „-all”, aby zapobiec fałszowaniu domeny.
<br /><br />
Może być również konieczne dołączenie rekordu SPF dla hosta, z którego wysyłasz pocztę (np. Outlook).
</span>
</div>

</li><li class="mb-2 mb-md-3 mb-lg-5">Zweryfikuj swoje rekordy DNS za pomocą naszego narzędzia „Weryfikuj rekordy”, dostępnego w <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Moje konto <i class="fa fa-angle-right"></i> Domeny</a> <i class="fa fa-angle-right"></i> Konfiguracja.

</li><li class="mb-2 mb-md-3 mb-lg-5">Wyślij e-mail testowy, aby sprawdzić, czy działa. Pamiętaj, że propagacja rekordów DNS może trochę potrwać.

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Wskazówka:
</strong>
<span>
</span>
Jeśli nie otrzymujesz e-maili testowych lub otrzymujesz e-mail testowy z informacją „Uważaj na tę wiadomość”, zapoznaj się z odpowiedziami na pytania <a href="#why-am-i-not-receiving-my-test-emails" class="alert-link">Dlaczego nie otrzymuję e-maili testowych</a> i <a href="#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious" class="alert-link">Dlaczego moje e-maile testowe są wysyłane do mnie w Gmailu jako „podejrzane”</a>.
</div>

</li><li class="mb-2 mb-md-3 mb-lg-5">Jeśli chcesz skorzystać z funkcji „Wyślij pocztę jako” w Gmailu, musisz <strong><a href="https://www.youtube.com/watch?v=MEheS8gM4Xs" target="_blank" rel="noopener noreferrer">obejrzeć ten film</a></strong> lub wykonać czynności opisane poniżej w sekcji <a href="#how-to-send-mail-as-using-gmail">How, aby wysłać pocztę jako przy użyciu Gmaila</a>.

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
Poniżej wymieniono opcjonalne dodatki. Należy pamiętać, że są one całkowicie opcjonalne i mogą nie być konieczne. Chcieliśmy przynajmniej przekazać Ci dodatkowe informacje, jeśli zajdzie taka potrzeba.
</span>
</div>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Opcjonalny dodatek:
</strong>
<span>
Jeśli korzystasz z funkcji <a class="alert-link" href="#how-to-send-mail-as-using-gmail">How do wysyłania wiadomości e-mail za pomocą Gmaila</a>, możesz dodać się do listy dozwolonych. Zobacz <a class="alert-link" href="https://support.google.com/a/answer/60752?hl=en" target="_blank" rel="noopener noreferrer">te instrukcje Gmaila</a> na ten temat.
</span>
</div>

### Czy mogę używać wielu serwerów wymiany MX i serwerów do zaawansowanego przekierowywania? {#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding}

Tak, ale **w swoich rekordach DNS powinieneś mieć wymienioną tylko jedną wymianę MX**.

Nie próbuj używać opcji „Priorytet” do konfigurowania wielu wymian MX.

Zamiast tego należy skonfigurować istniejącą wymianę MX w taki sposób, aby przekierowywała pocztę dla wszystkich niepasujących aliasów do wymiany danych naszej usługi (`mx1.forwardemail.net` i/lub `mx2.forwardemail.net`).

Jeśli korzystasz z usługi Google Workspace i chcesz przekierować wszystkie niepasujące aliasy do naszej usługi, zapoznaj się z informacjami w sekcji <https://support.google.com/a/answer/6297084>.

Jeśli używasz pakietu Microsoft 365 (Outlook) i chcesz przekierować wszystkie niepasujące aliasy do naszej usługi, zapoznaj się z informacjami <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/use-connectors-to-configure-mail-flow/set-up-connectors-to-route-mail> i <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/manage-mail-flow-for-multiple-locations>.

### Jak skonfigurować automatyczną odpowiedź informującą o nieobecności w biurze {#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder}

Przejdź do <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Moje konto <i class="fa fa-angle-right"></i> Domeny</a> <i class="fa fa-angle-right"></i> Aliasy i utwórz lub edytuj alias, dla którego chcesz skonfigurować automatyczną odpowiedź na wiadomość o nieobecności.

Możesz skonfigurować datę rozpoczęcia, datę zakończenia, temat i wiadomość oraz włączyć lub wyłączyć tę funkcję w dowolnym momencie:

* Temat i wiadomość w postaci zwykłego tekstu są obecnie obsługiwane (wewnętrznie używamy pakietu `striptags`, aby usunąć kod HTML).
* Temat jest ograniczony do 100 znaków.
* Wiadomość jest ograniczona do 1000 znaków.
* Konfiguracja wymaga konfiguracji wychodzącego SMTP (np. należy skonfigurować rekordy DKIM, DMARC i Return-Path DNS).
* Przejdź do <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Moje konto <i class="fa fa-angle-right"></i> Domeny</a> <i class="fa fa-angle-right"></i> Ustawienia <i class="fa fa-angle-right"></i> Konfiguracja wychodzącego SMTP i postępuj zgodnie z instrukcjami konfiguracji.
* Funkcji powiadamiania o nieobecności nie można włączyć dla globalnych nazw domen vanity (np. [adresy jednorazowe](/disposable-addresses) nie są obsługiwane).
* Funkcji powiadamiania o nieobecności nie można włączyć dla aliasów z symbolami wieloznacznymi/catch-all (`*`) ani wyrażeń regularnych.

W przeciwieństwie do systemów pocztowych, takich jak `postfix` (np. korzystających z rozszerzenia filtra urlopowego `sieve`) – Forward Email automatycznie dodaje podpis DKIM, zabezpiecza przed problemami z połączeniem podczas wysyłania odpowiedzi na nieobecności (np. z powodu typowych problemów z połączeniem SSL/TLS i starszych serwerów) i obsługuje nawet szyfrowanie Open WKD i PGP w przypadku odpowiedzi na nieobecności.

<!--
* Aby zapobiec nadużyciom, za każdą wysłaną wiadomość z informacją o nieobecności zostanie odjęty 1 kredyt SMTP na połączenia wychodzące.
* Wszystkie konta płatne domyślnie obejmują 300 kredytów dziennie. Jeśli potrzebujesz większej kwoty, skontaktuj się z nami.
-->

1. Wysyłamy wiadomość raz na 4 dni każdemu nadawcy [na liście dozwolonych](#do-you-have-an-allowlist) (podobnie jak w przypadku usługi Gmail).

* Nasza pamięć podręczna Redis używa odcisku palca `alias_id` i `sender`, gdzie `alias_id` to alias MongoDB ID, a `sender` to adres nadawcy (jeśli znajduje się na liście dozwolonych) lub domena główna w adresie nadawcy (jeśli nie znajduje się na liście dozwolonych). Dla uproszczenia okres ważności tego odcisku palca w pamięci podręcznej wynosi 4 dni.

* Nasze podejście polegające na wykorzystaniu domeny głównej analizowanej w adresie „Od” dla nadawców spoza listy dozwolonych zapobiega nadużyciom ze strony stosunkowo nieznanych nadawców (np. złośliwych podmiotów) polegającym na zalewaniu użytkowników wiadomościami typu „od teraz”.

2. Wysyłamy wiadomości e-mail wyłącznie w przypadku, gdy pola MAIL FROM i/lub From nie są puste i nie zawierają (bez względu na wielkość liter) znaku [nazwa użytkownika postmastera](#what-are-postmaster-addresses) (fragmentu znajdującego się przed znakiem @ w wiadomości e-mail).

3. Nie wysyłamy wiadomości, jeśli oryginalna wiadomość zawierała którykolwiek z poniższych nagłówków (bez względu na wielkość liter):

* Nagłówek `auto-submitted` o wartości innej niż `no`.
* Nagłówek kodu `x-auto-response-suppress` o wartości `dr`, `autoreply`, `auto-reply`, `auto_reply` lub `all`
* Nagłówek kodu `list-id`, `list-subscribe`, `list-unsubscribe`, `list-help`, `list-post`, `list-owner`, `list-archive`, `x-autoreply`, `x-autorespond` lub `x-auto-respond` (niezależnie od wartości).
* Nagłówek kodu `precedence` o wartości `bulk`, `autoreply`, `auto-reply`, `auto_reply` lub `list`.

4. Nie wysyłamy wiadomości, jeśli adres e-mail MAIL FROM lub From kończy się na `+donotreply`, `-donotreply`, `+noreply` lub `-noreply`.

5. Nie wysyłamy wiadomości, jeśli część nazwy użytkownika w adresie e-mail „Od” to `mdaemon` i ma ona nagłówek bez uwzględniania wielkości liter `X-MDDSN-Message`.

6. Nie wysyłamy, jeśli w nagłówku `content-type` w polu `multipart/report` występuje nagłówek bez uwzględniania wielkości liter.

### Jak skonfigurować SPF dla przekazywania wiadomości e-mail do domeny {#how-do-i-set-up-spf-for-forward-email}

Korzystając ze strony zarządzania DNS swojego rejestratora, ustaw następujący rekord <strong class="notranslate">TXT</strong>:

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
<td><em>"@", "." lub puste</em></td>
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
Jeśli korzystasz z Gmaila (np. Wyślij jako) lub G Suite, musisz dodać <code>include:_spf.google.com</code> do powyższej wartości, na przykład:
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
Jeśli korzystasz z programu Microsoft Outlook lub Live.com, musisz dodać <code>include:spf.protection.outlook.com</code> do rekordu SPF <strong class="notranslate">TXT</strong>, na przykład:
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
Jeśli masz już podobny wiersz z „v=spf1”, musisz dodać <code>include:spf.forwardemail.net</code> tuż przed istniejącymi rekordami „include:host.com” i przed „-all” w tym samym wierszu, na przykład:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
<br /><br />
Należy pamiętać, że istnieje różnica między „-all” a „~all”. Znak „-” oznacza, że sprawdzenie SPF powinno zakończyć się niepowodzeniem, jeśli rekord nie zostanie dopasowany, a znak „~” oznacza, że sprawdzenie SPF powinno zakończyć się niepowodzeniem. Zalecamy użycie opcji „-all”, aby zapobiec fałszowaniu domeny.
<br /><br />
Może być również konieczne dołączenie rekordu SPF dla hosta, z którego wysyłasz pocztę (np. Outlook).
</span>
</div>

### Jak skonfigurować DKIM dla przekazywania wiadomości e-mail do domeny {#how-do-i-set-up-dkim-for-forward-email}

Przejdź do <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Moje konto <i class="fa fa-angle-right"></i> Domeny</a> <i class="fa fa-angle-right"></i> Ustawienia <i class="fa fa-angle-right"></i> Konfiguracja wychodzącego SMTP i postępuj zgodnie z instrukcjami konfiguracji.

### Jak skonfigurować DMARC dla przekazywania wiadomości e-mail do domeny {#how-do-i-set-up-dmarc-for-forward-email}

Przejdź do <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Moje konto <i class="fa fa-angle-right"></i> Domeny</a> <i class="fa fa-angle-right"></i> Ustawienia <i class="fa fa-angle-right"></i> Konfiguracja wychodzącego SMTP i postępuj zgodnie z instrukcjami konfiguracji.

### Jak połączyć i skonfigurować kontakty {#how-do-i-connect-and-configure-my-contacts}

**Aby skonfigurować kontakty, użyj adresu URL CardDAV:** `https://carddav.forwardemail.net` (lub po prostu `carddav.forwardemail.net`, jeśli Twój klient na to pozwala)

### Jak połączyć i skonfigurować kalendarze {#how-do-i-connect-and-configure-my-calendars}

**Aby skonfigurować kalendarz, użyj adresu URL CalDAV:** `https://caldav.forwardemail.net` (lub po prostu `caldav.forwardemail.net`, jeśli Twój klient na to pozwala)

<img width="612" height="520" src="/img/faq/calendar-setup.png" alt="Przykładowa konfiguracja przekazywania wiadomości e-mail w kalendarzu CalDAV w Thunderbird" />

### Jak dodać więcej kalendarzy i zarządzać istniejącymi kalendarzami {#how-do-i-add-more-calendars-and-manage-existing-calendars}

Jeśli chcesz dodać więcej kalendarzy, po prostu wpisz nowy adres URL kalendarza: `https://caldav.forwardemail.net/dav/principals/calendar-name` (**pamiętaj, aby zastąpić `calendar-name` nazwą wybranego kalendarza**)

Możesz zmienić nazwę i kolor kalendarza po jego utworzeniu – wystarczy użyć preferowanej aplikacji kalendarzowej (np. Apple Mail lub [Ptak piorunowy](https://thunderbird.net)).

### Jak skonfigurować SRS dla przekazywania wiadomości e-mail do adresu {#how-do-i-set-up-srs-for-forward-email}

Automatycznie konfigurujemy [Schemat przepisywania nadawcy](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme) („SRS”) – nie musisz tego robić samodzielnie.

### Jak skonfigurować MTA-STS do przekazywania wiadomości e-mail {#how-do-i-set-up-mta-sts-for-forward-email}

Więcej informacji znajdziesz w dokumencie [nasza sekcja o MTA-STS](#do-you-support-mta-sts).

### Jak dodać zdjęcie profilowe do mojego adresu e-mail {#how-do-i-add-a-profile-picture-to-my-email-address}

Jeśli używasz Gmaila, wykonaj poniższe kroki:

1. Przejdź do <https://google.com> i wyloguj się ze wszystkich kont e-mail.
2. Kliknij „Zaloguj się”, a następnie z listy rozwijanej wybierz „inne konto”.
3. Wybierz „Użyj innego konta”.
4. Wybierz „Utwórz konto”.
5. Wybierz „Użyj mojego obecnego adresu e-mail”.
6. Wprowadź adres e-mail swojej domeny.
7. Odbierz wiadomość e-mail weryfikacyjną wysłaną na Twój adres e-mail.
8. Wprowadź kod weryfikacyjny z tej wiadomości.
9. Uzupełnij informacje o profilu nowego konta Google.
10. Zaakceptuj wszystkie zasady prywatności i warunki korzystania.
11. Przejdź do <https://google.com> i w prawym górnym rogu kliknij ikonę swojego profilu, a następnie przycisk „zmień”.
12. Prześlij nowe zdjęcie lub awatar dla swojego konta.
13. Wprowadzenie zmian zajmie około 1–2 godzin, ale czasami może nastąpić bardzo szybko. 14. Wyślij e-mail testowy, a zdjęcie profilowe powinno się pojawić.

## Funkcje zaawansowane {#advanced-features}

### Czy obsługujesz newslettery lub listy mailingowe w celu wysyłania wiadomości e-mail związanych z marketingiem? {#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email}

Tak, możesz przeczytać więcej na <https://forwardemail.net/guides/newsletter-with-listmonk>.

Prosimy pamiętać, że w celu utrzymania reputacji IP i zapewnienia skutecznej dostarczalności, Forward Email stosuje ręczny proces weryfikacji dla każdej domeny w celu **zatwierdzenia newslettera**. Prosimy o kontakt mailowy na adres <support@forwardemail.net> lub utworzenie konta [prośba o pomoc](https://forwardemail.net/help) w celu zatwierdzenia. Zazwyczaj trwa to mniej niż 24 godziny, a większość próśb jest rozpatrywana w ciągu 1-2 godzin. W najbliższej przyszłości planujemy skrócić ten proces, dodając dodatkowe mechanizmy kontroli spamu i alerty. Ten proces gwarantuje, że Twoje wiadomości e-mail dotrą do skrzynki odbiorczej i nie zostaną oznaczone jako spam.

### Czy obsługujesz wysyłanie wiadomości e-mail za pomocą API {#do-you-support-sending-email-with-api}

Tak, od maja 2023 r. obsługujemy wysyłanie wiadomości e-mail za pomocą API jako dodatek dla wszystkich użytkowników wersji płatnej.

<div class="alert my-3 alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Ważne:
</strong>
<span>
Upewnij się, że zapoznałeś się z naszymi <a href="/terms" class="alert-link" target="_blank">Warunkami</a>, <a href="/privacy" class="alert-link" target="_blank">Polityką prywatności</a> oraz <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Limitami SMTP wychodzącego</a> – korzystanie z usługi jest równoznaczne z potwierdzeniem i wyrażeniem zgody.
</span>
</div>

Aby poznać dostępne opcje, przykłady i więcej informacji, zapoznaj się z sekcją [E-maile](/email-api#outbound-emails) w naszej dokumentacji interfejsu API.

Aby wysyłać wiadomości e-mail za pomocą naszego interfejsu API, musisz użyć tokena API dostępnego pod adresem [Moje bezpieczeństwo](/my-account/security).

### Czy obsługujesz odbieranie wiadomości e-mail za pomocą protokołu IMAP {#do-you-support-receiving-email-with-imap}

Tak, od 16 października 2023 r. obsługujemy odbieranie wiadomości e-mail przez IMAP jako dodatek dla wszystkich użytkowników płacących. **Przeczytaj nasz szczegółowy artykuł** na temat [Jak działa nasza funkcja szyfrowanego przechowywania skrzynek pocztowych SQLite](/blog/docs/best-quantum-safe-encrypted-email-service).

<div id="instrukcje-imap">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Ważne:
</strong>
<span>
Upewnij się, że zapoznałeś się z naszym <a href="/terms" class="alert-link" target="_blank">Regulaminem</a> i <a href="/privacy" class="alert-link" target="_blank">Polityką prywatności</a> – korzystanie z serwisu jest równoznaczne z potwierdzeniem i wyrażeniem zgody.
</span>
</div>

1. Utwórz nowy alias dla swojej domeny w sekcji <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Moje konto <i class="fa fa-angle-right"></i> Domeny</a> <i class="fa fa-angle-right"></i> Aliasy (np. <code><hello@example.com></code>)

2. Kliknij <strong class="text-success"><i class="fa fa-key"></i>Generuj hasło</strong> obok nowo utworzonego aliasu. Skopiuj do schowka i bezpiecznie przechowuj wygenerowane hasło wyświetlone na ekranie.

3. Używając preferowanej aplikacji pocztowej, dodaj lub skonfiguruj konto z nowo utworzonym aliasem (np. <code><hello@example.com></code>).
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Wskazówka:
</strong>
<span>Zalecamy korzystanie z <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a> lub <a href="/blog/open-source" class="alert-link" target="_blank">alternatywa oparta na otwartym kodzie źródłowym i skupiona na prywatności</a>.</span>
</div>

4. Gdy zostaniesz poproszony o podanie nazwy serwera IMAP, wprowadź `imap.forwardemail.net`

5. Gdy pojawi się monit o podanie portu serwera IMAP, wpisz `993` (SSL/TLS) – w razie potrzeby zobacz [alternatywne porty IMAP](/faq#what-are-your-imap-server-configuration-settings)
<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Wskazówka:
</strong>
<span>Jeśli używasz Thunderbirda, upewnij się, że „Zabezpieczenia połączenia” są ustawione na „SSL/TLS”, a metoda uwierzytelniania jest ustawiona na „Normalne hasło”.</span>
</div>

6. Gdy pojawi się monit o podanie hasła serwera IMAP, wklej hasło z sekcji <strong class="text-success"><i class="fa fa-key"></i>Generuj hasło</strong> w kroku 2 powyżej.

7. **Zapisz ustawienia** – jeśli masz problemy, <a href="/help">skontaktuj się z nami</a>

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

### Czy obsługujesz POP3 {#do-you-support-pop3}

Tak, od 4 grudnia 2023 r. obsługujemy [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol) jako dodatek dla wszystkich użytkowników płacących. **Przeczytaj nasz szczegółowy artykuł** na temat [Jak działa nasza funkcja szyfrowanego przechowywania skrzynek pocztowych SQLite](/blog/docs/best-quantum-safe-encrypted-email-service).

<div id="instrukcje pop3">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Ważne:
</strong>
<span>
Upewnij się, że zapoznałeś się z naszym <a href="/terms" class="alert-link" target="_blank">Regulaminem</a> i <a href="/privacy" class="alert-link" target="_blank">Polityką prywatności</a> – korzystanie z serwisu jest równoznaczne z potwierdzeniem i wyrażeniem zgody.
</span>
</div>

1. Utwórz nowy alias dla swojej domeny w sekcji <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Moje konto <i class="fa fa-angle-right"></i> Domeny</a> <i class="fa fa-angle-right"></i> Aliasy (np. <code><hello@example.com></code>)

2. Kliknij <strong class="text-success"><i class="fa fa-key"></i>Generuj hasło</strong> obok nowo utworzonego aliasu. Skopiuj do schowka i bezpiecznie przechowuj wygenerowane hasło wyświetlone na ekranie.

3. Używając preferowanej aplikacji pocztowej, dodaj lub skonfiguruj konto z nowo utworzonym aliasem (np. <code><hello@example.com></code>).
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Wskazówka:
</strong>
<span>Zalecamy korzystanie z <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a> lub <a href="/blog/open-source" class="alert-link" target="_blank">alternatywa oparta na otwartym kodzie źródłowym i skupiona na prywatności</a>.</span>
</div>

4. Gdy zostaniesz poproszony o podanie nazwy serwera POP3, wprowadź `pop3.forwardemail.net`

5. Gdy pojawi się monit o podanie portu serwera POP3, wpisz `995` (SSL/TLS) – w razie potrzeby zobacz [alternatywne porty POP3](/faq#what-are-your-pop3-server-configuration-settings)
<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Wskazówka:
</strong>
<span>Jeśli używasz Thunderbirda, upewnij się, że „Zabezpieczenia połączenia” są ustawione na „SSL/TLS”, a metoda uwierzytelniania jest ustawiona na „Normalne hasło”.</span>
</div>

6. Gdy pojawi się monit o podanie hasła serwera POP3, wklej hasło z sekcji <strong class="text-success"><i class="fa fa-key"></i>Generuj hasło</strong> w kroku 2 powyżej.

7. **Zapisz ustawienia** – jeśli masz problemy, <a href="/help">skontaktuj się z nami</a>

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

### Czy obsługujesz kalendarze (CalDAV) {#do-you-support-calendars-caldav}

Tak, od 5 lutego 2024 r. dodaliśmy tę funkcję. Nasz serwer ma kod `caldav.forwardemail.net` i jest również monitorowany na naszej <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">stronie statusu</a>.

Obsługuje zarówno IPv4, jak i IPv6 i jest dostępny poprzez port `443` (HTTPS).

| Login | Przykład | Opis |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nazwa użytkownika | `user@example.com` | Adres e-mail aliasu istniejącego dla domeny w <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Moim koncie <i class="fa fa-angle-right"></i>Domenach</a>. |
| Hasło | `************************` | Wygenerowane hasło specyficzne dla aliasu. |

Aby korzystać z obsługi kalendarza, **użytkownik** musi być adresem e-mail aliasu istniejącego dla domeny w <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Moje konto <i class="fa fa-angle-right"></i> Domeny</a>, a **hasło** musi być hasłem wygenerowanym dla konkretnego aliasu.

### Czy obsługujesz kontakty (CardDAV) {#do-you-support-contacts-carddav}

Tak, od 12 czerwca 2025 r. dodaliśmy tę funkcję. Nasz serwer ma kod `carddav.forwardemail.net` i jest również monitorowany na naszej <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">stronie statusu</a>.

Obsługuje zarówno IPv4, jak i IPv6 i jest dostępny przez port `443` (HTTPS).

| Login | Przykład | Opis |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nazwa użytkownika | `user@example.com` | Adres e-mail aliasu istniejącego dla domeny w <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Moim koncie <i class="fa fa-angle-right"></i>Domenach</a>. |
| Hasło | `************************` | Wygenerowane hasło specyficzne dla aliasu. |

Aby skorzystać z pomocy dotyczącej kontaktów, **użytkownik** musi być adresem e-mail aliasu istniejącego dla domeny w <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Moje konto <i class="fa fa-angle-right"></i> Domeny</a>, a **hasło** musi być hasłem wygenerowanym dla konkretnego aliasu.

### Czy obsługujesz wysyłanie wiadomości e-mail za pomocą protokołu SMTP {#do-you-support-sending-email-with-smtp}

Tak, od maja 2023 roku obsługujemy wysyłanie wiadomości e-mail za pomocą protokołu SMTP jako dodatek dla wszystkich użytkowników płacących.

<div id="instrukcje-smtp">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Ważne:
</strong>
<span>
Upewnij się, że zapoznałeś się z naszymi <a href="/terms" class="alert-link" target="_blank">Warunkami</a>, <a href="/privacy" class="alert-link" target="_blank">Polityką prywatności</a> oraz <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Limitami SMTP wychodzącego</a> – korzystanie z nich jest równoznaczne z potwierdzeniem i wyrażeniem zgody.
</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Ważne:
</strong>
<span>
Jeśli korzystasz z Gmaila, zapoznaj się z naszym <a class="alert-link" href="/guides/send-mail-as-gmail-custom-domain">przewodnikiem „Wyślij pocztę jako Gmail”</a>. Jeśli jesteś programistą, zapoznaj się z naszą <a class="alert-link" href="/email-api#outbound-emails" target="_blank">dokumentacją API poczty e-mail</a>.
</span>
</div>

1. Przejdź do <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Moje konto <i class="fa fa-angle-right"></i> Domeny</a> <i class="fa fa-angle-right"></i> Ustawienia <i class="fa fa-angle-right"></i> Konfiguracja wychodzącego SMTP i postępuj zgodnie z instrukcjami konfiguracji

2. Utwórz nowy alias dla swojej domeny w sekcji <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Moje konto <i class="fa fa-angle-right"></i> Domeny</a> <i class="fa fa-angle-right"></i> Aliasy (np. <code><hello@example.com></code>)

3. Kliknij <strong class="text-success"><i class="fa fa-key"></i>Generuj hasło</strong> obok nowo utworzonego aliasu. Skopiuj do schowka i bezpiecznie przechowuj wygenerowane hasło pokazane na ekranie.

4. Używając preferowanej aplikacji pocztowej, dodaj lub skonfiguruj konto z nowo utworzonym aliasem (np. <code><hello@example.com></code>).
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Wskazówka:
</strong>
<span>Zalecamy korzystanie z <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a> lub <a href="/blog/open-source" class="alert-link" target="_blank">alternatywa oparta na otwartym kodzie źródłowym i skupiona na prywatności</a>.</span>
</div>

5. Gdy pojawi się monit o podanie nazwy serwera SMTP, wprowadź `smtp.forwardemail.net`

6. Gdy pojawi się monit o podanie portu serwera SMTP, wpisz `465` (SSL/TLS) – w razie potrzeby zobacz [alternatywne porty SMTP](/faq#what-are-your-smtp-server-configuration-settings)
<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Wskazówka:
</strong>
<span>Jeśli używasz Thunderbirda, upewnij się, że „Zabezpieczenia połączenia” są ustawione na „SSL/TLS”, a metoda uwierzytelniania jest ustawiona na „Normalne hasło”.</span>
</div>

7. Gdy pojawi się monit o podanie hasła serwera SMTP, wklej hasło z sekcji <strong class="text-success"><i class="fa fa-key"></i>Generuj hasło</strong> w kroku 3 powyżej.

8. **Zapisz ustawienia i wyślij pierwszy e-mail testowy** – jeśli masz problemy, <a href="/help">skontaktuj się z nami</a>

<div class="alert my-3 alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Ważne:
</strong>
<span>
Należy pamiętać, że w celu utrzymania reputacji adresów IP i zapewnienia dostarczalności, stosujemy ręczny proces weryfikacji dla każdej domeny w celu zatwierdzenia wychodzącego ruchu SMTP. Zazwyczaj trwa to mniej niż 24 godziny, a większość żądań jest rozpatrywana w ciągu 1-2 godzin. W najbliższej przyszłości planujemy skrócić ten proces dzięki dodatkowym kontrolom antyspamowym i alertom. Ten proces gwarantuje, że Twoje wiadomości e-mail trafią do skrzynki odbiorczej i nie zostaną oznaczone jako spam.
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

### Czy obsługujesz OpenPGP/MIME, szyfrowanie typu end-to-end („E2EE”) i katalog kluczy internetowych („WKD”)? {#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd}

Tak, obsługujemy [OtwórzPGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy#OpenPGP), [szyfrowanie typu end-to-end („E2EE”)](https://en.wikipedia.org/wiki/End-to-end_encryption) oraz wykrywanie kluczy publicznych za pomocą [Katalog kluczy internetowych („WKD”)](https://wiki.gnupg.org/WKD). Możesz skonfigurować OpenPGP za pomocą [keys.openpgp.org](https://keys.openpgp.org/about/usage#wkd-as-a-service) lub [hostuj własne klucze](https://wiki.gnupg.org/WKDHosting) (patrz [Ta sedno dotyczy konfiguracji serwera WKD](https://gist.github.com/kafene/0a6e259996862d35845784e6e5dbfc79)).

* Wyszukiwania WKD są buforowane przez 1 godzinę, aby zapewnić terminowe dostarczanie wiadomości e-mail → dlatego jeśli dodasz, zmienisz lub usuniesz klucz WKD, wyślij do nas wiadomość e-mail na adres `support@forwardemail.net`, podając swój adres e-mail, abyśmy mogli ręcznie wyczyścić pamięć podręczną.
* Obsługujemy szyfrowanie PGP dla wiadomości przekazywanych dalej za pomocą wyszukiwania WKD lub przy użyciu przesłanego klucza PGP w naszym interfejsie.
* Przesłane klucze mają pierwszeństwo, o ile pole wyboru PGP jest włączone/zaznaczone.
* Wiadomości wysyłane do webhooków nie są obecnie szyfrowane za pomocą PGP.
* Jeśli masz wiele aliasów pasujących do danego adresu przekierowania (np. kombinacja regex/wildcard/exact) i jeśli więcej niż jeden z nich zawiera przesłany klucz PGP i ma sprawdzoną zgodność z PGP →, wyślemy Ci wiadomość e-mail z ostrzeżeniem o błędzie i nie zaszyfrujemy wiadomości przesłanym kluczem PGP. Jest to bardzo rzadkie i zazwyczaj dotyczy tylko zaawansowanych użytkowników ze złożonymi regułami aliasów.
* **Szyfrowanie PGP nie będzie stosowane do przekazywania wiadomości e-mail przez nasze serwery MX, jeśli nadawca miał politykę odrzucania DMARC. Jeśli wymagasz szyfrowania PGP dla *wszystkich* wiadomości, zalecamy skorzystanie z naszej usługi IMAP i skonfigurowanie klucza PGP dla aliasu dla poczty przychodzącej.**

**Konfigurację katalogu kluczy internetowych można sprawdzić pod adresem <https://wkd.chimbosonic.com/> (oprogramowanie typu open source) lub <https://www.webkeydirectory.com/> (oprogramowanie własnościowe).**

<div class="alert my-3 alert-success">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Automatyczne szyfrowanie:
</strong>
<span>Jeśli korzystasz z naszej <a href="#do-you-support-sending-email-with-smtp" class="alert-link">usługi SMTP dla połączeń wychodzących</a> i wysyłasz niezaszyfrowane wiadomości, automatycznie podejmiemy próbę szyfrowania wiadomości dla każdego odbiorcy, używając <a class="alert-link" href="https://wiki.gnupg.org/WKD">Web Katalogu kluczy („WKD”)</a>.</span>
</div>

<div class="alert alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Ważne:
</strong>
<span>
Aby włączyć OpenPGP dla swojej niestandardowej nazwy domeny, musisz wykonać wszystkie poniższe kroki.
</span>
</div>

1. Pobierz i zainstaluj zalecaną wtyczkę swojego klienta poczty e-mail:

| Klient poczty e-mail | Platforma | Zalecana wtyczka | Notatki |
| --------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ptak piorunowy | Pulpit | [Configure OpenPGP in Thunderbird](https://support.mozilla.org/en-US/kb/openpgp-thunderbird-howto-and-faq#w_i-have-never-used-openpgp-with-thunderbird-before-how-do-i-setup-openpgp) | Thunderbird ma wbudowaną obsługę OpenPGP. |
| Gmail | Przeglądarka | [Mailvelope](https://mailvelope.com/) lub [FlowCrypt](https://flowcrypt.com/download) (licencja własnościowa) | Gmail nie obsługuje OpenPGP, możesz jednak pobrać wtyczkę typu open source [Mailvelope](https://mailvelope.com/) lub [FlowCrypt](https://flowcrypt.com/download). |
| Poczta Apple | macOS | [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation) | Apple Mail nie obsługuje OpenPGP, można jednak pobrać wtyczkę typu open source [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation). |
| Poczta Apple | iOS | [PGPro](https://github.com/opensourceios/PGPro/) lub [FlowCrypt](https://apps.apple.com/us/app/flowcrypt-encrypted-email/id1591754995) (licencja własnościowa) | Apple Mail nie obsługuje OpenPGP, ale możesz pobrać wtyczkę typu open source [PGPro](https://github.com/opensourceios/PGPro/) lub [FlowCrypt](https://flowcrypt.com/download). |
| Perspektywy | Okna | [gpg4win](https://www.gpg4win.de/index.html) | Klient poczty e-mail Outlook nie obsługuje standardu OpenPGP, można jednak pobrać wtyczkę typu open source [gpg4win](https://www.gpg4win.de/index.html). |
| Perspektywy | Przeglądarka | [Mailvelope](https://mailvelope.com/) lub [FlowCrypt](https://flowcrypt.com/download) (licencja własnościowa) | Klient poczty internetowej programu Outlook nie obsługuje standardu OpenPGP, można jednak pobrać wtyczkę typu open source [Mailvelope](https://mailvelope.com/) lub [FlowCrypt](https://flowcrypt.com/download). |
| Android | Przenośny | [OpenKeychain](https://www.openkeychain.org/) lub [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email) | [Android mail clients](/blog/open-source/android-email-clients), takie jak [Thunderbird Mobile](https://www.thunderbird.net/en-US/mobile/) i [FairEmail](https://github.com/M66B/FairEmail), obsługują wtyczkę open source [OpenKeychain](https://www.openkeychain.org/). Alternatywnie możesz użyć wtyczki open source (na licencji własnościowej) [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email). |
| Google Chrome | Przeglądarka | [Mailvelope](https://mailvelope.com/) lub [FlowCrypt](https://flowcrypt.com/download) (licencja własnościowa) | Możesz pobrać rozszerzenie przeglądarki o otwartym kodzie źródłowym [Mailvelope](https://mailvelope.com/) lub [FlowCrypt](https://flowcrypt.com/download). |
| Mozilla Firefox | Przeglądarka | [Mailvelope](https://mailvelope.com/) lub [FlowCrypt](https://flowcrypt.com/download) (licencja własnościowa) | Możesz pobrać rozszerzenie przeglądarki o otwartym kodzie źródłowym [Mailvelope](https://mailvelope.com/) lub [FlowCrypt](https://flowcrypt.com/download). |
| Microsoft Edge | Przeglądarka | [Mailvelope](https://mailvelope.com/) | Możesz pobrać rozszerzenie przeglądarki o otwartym kodzie źródłowym [Mailvelope](https://mailvelope.com/). |
| Odważny | Przeglądarka | [Mailvelope](https://mailvelope.com/) lub [FlowCrypt](https://flowcrypt.com/download) (licencja własnościowa) | Możesz pobrać rozszerzenie przeglądarki o otwartym kodzie źródłowym [Mailvelope](https://mailvelope.com/) lub [FlowCrypt](https://flowcrypt.com/download). |
| Balsa | Pulpit | [Configure OpenPGP in Balsa](https://www.mynetcologne.de/~nc-dreszal/balsa/balsa23-secure-mail.html#USING) | Balsa ma wbudowaną obsługę OpenPGP. |
| KMail | Pulpit | [Configure OpenPGP in KMail](https://userbase.kde.org/KMail/PGP_MIME) | KMail ma wbudowaną obsługę OpenPGP. |
| Ewolucja GNOME | Pulpit | [Configure OpenPGP in Evolution](https://help.gnome.org/users/evolution/stable/mail-encryption.html.en) | GNOME Evolution ma wbudowaną obsługę OpenPGP. |
| Terminal | Pulpit | [Configure gpg in Terminal](https://docs.github.com/en/authentication/managing-commit-signature-verification/generating-a-new-gpg-key#generating-a-gpg-key) | Do wygenerowania nowego klucza z poziomu wiersza poleceń możesz użyć kodu źródłowego [gpg command line tool](https://www.gnupg.org/download/). |

2. Otwórz wtyczkę, utwórz klucz publiczny i skonfiguruj swojego klienta poczty e-mail, aby go używać.

3. Prześlij swój klucz publiczny na adres <https://keys.openpgp.org/upload>.

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Wskazówka:
</strong>
<span>Możesz odwiedzić <a class="alert-link" href="https://keys.openpgp.org/manage">https://keys.openpgp.org/manage</a>, aby w przyszłości zarządzać swoim kluczem.</span>
</div>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Dodatek opcjonalny:
</strong>
<span>
Jeśli korzystasz z naszej usługi <a class="alert-link" href="/blog/docs/best-quantum-safe-encrypted-email-service">szyfrowanego przechowywania danych (IMAP/POP3)</a> i chcesz, aby <i>wszystkie</i> wiadomości e-mail przechowywane w Twojej (już zaszyfrowanej) bazie danych SQLite były szyfrowane Twoim kluczem publicznym, przejdź do <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Moje konto <i class="fa fa-angle-right"></i> Domeny</a> <i class="fa fa-angle-right"></i> Aliasy (np. <code>hello@example.com</code>) <i class="fa fa-angle-right"></i> Edytuj <i class="fa fa-angle-right"></i> OpenPGP i prześlij swój klucz publiczny.
</span>
</div>

4. Dodaj nowy rekord `CNAME` do swojej nazwy domeny (np. `example.com`):

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
<span>Jeśli Twój alias korzysta z naszych <a class="alert-link" href="/disposable-addresses" target="_blank">domen próżności/jednorazowych</a> (np. <code>hideaddress.net</code>), możesz pominąć ten krok.</span>
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

### Czy obsługujesz MTA-STS {#do-you-support-mta-sts}

Tak, od 2 marca 2023 r. obsługujemy [MTA-STS](https://www.hardenize.com/blog/mta-sts). Możesz użyć [ten szablon](https://github.com/jpawlowski/mta-sts.template), jeśli chcesz włączyć go w swojej domenie.

Naszą konfigurację można znaleźć publicznie na GitHub pod adresem <https://github.com/forwardemail/mta-sts.forwardemail.net>.

### Czy obsługujesz klucze dostępu i WebAuthn {#do-you-support-passkeys-and-webauthn}

Tak! Od 13 grudnia 2023 r. dodaliśmy obsługę kluczy dostępu [ze względu na duże zapotrzebowanie](https://github.com/orgs/forwardemail/discussions/182).

Klucze dostępu umożliwiają bezpieczne logowanie bez konieczności podawania hasła i uwierzytelniania dwuskładnikowego.

Możesz potwierdzić swoją tożsamość za pomocą dotyku, rozpoznawania twarzy, hasła przypisane do urządzenia lub kodu PIN.

Umożliwiamy jednoczesne zarządzanie maksymalnie 30 kluczami dostępu, dzięki czemu możesz z łatwością logować się na wszystkich swoich urządzeniach.

Więcej informacji o kluczach dostępu znajdziesz pod następującymi linkami:

* [Zaloguj się do aplikacji i witryn internetowych za pomocą kluczy dostępu](https://support.google.com/android/answer/14124480?hl=en) (Google)
* [Użyj kluczy dostępu, aby zalogować się do aplikacji i witryn internetowych na iPhonie](https://support.apple.com/guide/iphone/use-passkeys-to-sign-in-to-apps-and-websites-iphf538ea8d0/ios) (Apple)
* [Artykuł w Wikipedii na temat kluczy dostępu](https://en.wikipedia.org/wiki/Passkey_\(credential\))

### Czy wspierasz najlepsze praktyki dotyczące poczty e-mail {#do-you-support-email-best-practices}

Tak. Oferujemy wbudowaną obsługę SPF, DKIM, DMARC, ARC i SRS we wszystkich planach. Współpracowaliśmy również intensywnie z autorami tych specyfikacji i innymi ekspertami od poczty e-mail, aby zapewnić doskonałość i wysoką dostarczalność.

### Czy obsługujesz odbite webhooki {#do-you-support-bounce-webhooks}

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Wskazówka:
</strong>
Szukasz dokumentacji na temat webhooków e-mail? Więcej informacji znajdziesz w artykule <a href="/faq#do-you-support-webhooks" class="alert-link">Czy obsługujecie webhooki?</a>.
<span>
</span>
</div>

Tak, od 14 sierpnia 2024 r. dodaliśmy tę funkcję. Możesz teraz przejść do sekcji Moje konto → Domeny → Ustawienia → Adres URL webhooka odrzucenia i skonfigurować adres URL `http://` lub `https://`, na który będziemy wysyłać żądanie `POST` za każdym razem, gdy wychodzące wiadomości e-mail SMTP zostaną odrzucone.

Funkcja ta jest przydatna do zarządzania pocztą wychodzącą SMTP i monitorowania jej. Można jej używać do utrzymywania subskrybentów, rezygnacji z subskrypcji i wykrywania odrzuceń wiadomości.

Ładunki webhooków Bounce są wysyłane jako plik JSON z następującymi właściwościami:

* `email_id` (ciąg) — identyfikator e-mail odpowiadający wiadomości e-mail w sekcji Moje konto → Wiadomości e-mail (wychodzące SMTP)
* `list_id` (ciąg) — wartość nagłówka `List-ID` (bez uwzględniania wielkości liter), jeśli istnieje, z oryginalnej wiadomości e-mail wychodzącej
* `list_unsubscribe` (ciąg) — wartość nagłówka `List-Unsubscribe` (bez uwzględniania wielkości liter), jeśli istnieje, z oryginalnej wiadomości e-mail wychodzącej
* `feedback_id` (ciąg) — wartość nagłówka `Feedback-ID` (bez uwzględniania wielkości liter), jeśli istnieje, z oryginalnej wiadomości e-mail wychodzącej
* `recipient` (Ciąg) — adres e-mail odbiorcy, który zwrócił pocztę lub wystąpił błąd.
* `message` (Ciąg) — szczegółowy komunikat o błędzie dotyczącym zwrotu.
* `response` (Ciąg) — komunikat odpowiedzi SMTP.
* `response_code` (Liczba) — przeanalizowany kod odpowiedzi SMTP.
* `truth_source` (Ciąg) — jeśli kod odpowiedzi pochodził z zaufanego źródła, ta wartość zostanie uzupełniona nazwą domeny głównej (np. `google.com` lub `yahoo.com`).
* `bounce` (Obiekt) — obiekt zawierający następujące właściwości, które szczegółowo opisują status odrzucenia i odrzucenia
* `action` (Ciąg) — akcja odrzucenia (np. `"reject"`)
* `message` (Ciąg) — przyczyna odrzucenia (np. `"Message Sender Blocked By Receiving Server"`)
* `category` (Ciąg) — kategoria odrzucenia (np. `"block"`)
* `code` (Liczba) — kod statusu odrzucenia (np. `554`)
* `status` (Ciąg) — kod odrzucenia z wiadomości odpowiedzi (np. `5.7.1`)
* `line` (Liczba) — numer przeanalizowanego wiersza, jeśli istnieje, [z listy analiz zwrotów strefy-MTA](https://github.com/zone-eu/zone-mta/blob/master/config/bounces.txt) (np. `526`)
* `headers` (Obiekt) — para klucz-wartość nagłówków wiadomości e-mail wychodzącej
* `bounced_at` (Ciąg) — data w formacie [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601), oznaczająca wystąpienie błędu odrzucenia

Na przykład:

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

Oto kilka dodatkowych uwag dotyczących webhooków typu bounce:

* Jeśli ładunek webhooka zawiera wartość `list_id`, `list_unsubscribe` lub `feedback_id`, należy podjąć odpowiednie działania w celu usunięcia `recipient` z listy, jeśli jest to konieczne.
* Jeśli wartość `bounce.category` to `"block"`, `"recipient"`, `"spam"` lub `"virus"`, należy bezwzględnie usunąć użytkownika z listy.
* Jeśli chcesz zweryfikować ładunki webhooka (aby upewnić się, że faktycznie pochodzą z naszego serwera), możesz użyć [rozwiąż adres IP zdalnego klienta i nazwę hosta klienta, korzystając z wyszukiwania odwrotnego](https://nodejs.org/api/dns.html#dnspromisesreverseip) – powinno być `smtp.forwardemail.net`.
* Możesz również sprawdzić adres IP pod kątem [nasze opublikowane adresy IP](#what-are-your-servers-ip-addresses).
* Przejdź do Moje konto → Domeny → Ustawienia → Klucz weryfikacji ładunku podpisu webhooka, aby uzyskać klucz webhooka.
* Możesz w dowolnym momencie zmienić ten klucz ze względów bezpieczeństwa.
* Oblicz i porównaj wartość `X-Webhook-Signature` z naszego żądania webhooka z obliczoną wartością body za pomocą tego klucza. Przykład, jak to zrobić, jest dostępny pod adresem [ten post na Stack Overflow](https://stackoverflow.com/a/68885281).
* Więcej informacji znajdziesz w dyskusji pod adresem <https://github.com/forwardemail/free-email-forwarding/issues/235>.
* Będziemy czekać do `5` sekund, aż Twój punkt końcowy webhooka odpowie kodem stanu `200`, i będziemy ponawiać próbę do `1` razy.
* Jeśli wykryjemy błąd w adresie URL Twojego webhooka, z którego nastąpiło przekierowanie, podczas próby wysłania do niego żądania, wyślemy Ci e-mail z prośbą raz w tygodniu.

### Czy obsługujesz webhooki {#do-you-support-webhooks}

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Wskazówka:
</strong>
Szukasz dokumentacji na temat webhooków bounce? Zobacz <a href="/faq#do-you-support-bounce-webhooks" class="alert-link">Czy obsługujecie webhooki bounce?</a>, aby uzyskać więcej informacji.
<span>
</span>
</div>

Tak, od 15 maja 2020 roku dodaliśmy tę funkcję. Możesz po prostu dodać webhook(i) dokładnie tak, jak w przypadku każdego odbiorcy! Upewnij się, że w adresie URL webhooka znajduje się prefiks protokołu „http” lub „https”.

<div class="alert my-3 alert-danger">
<i class="fa fa-stop-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Zaawansowana ochrona prywatności:
</strong>
<span>
Jeśli korzystasz z planu płatnego (obejmującego zaawansowaną ochronę prywatności), przejdź do <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mojego konta <i class="fa fa-angle-right"></i>Domen</a> i kliknij „Aliasy” obok swojej domeny, aby skonfigurować webhooki. Aby dowiedzieć się więcej o planach płatnych, zapoznaj się z naszą stroną <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Cennik</a>. Możesz również postępować zgodnie z poniższymi instrukcjami.
</span>
</div>

Jeśli korzystasz z bezpłatnego planu, po prostu dodaj nowy rekord DNS <strong class="notranslate">TXT</strong>, jak pokazano poniżej:

Na przykład, jeśli chcę, aby wszystkie wiadomości e-mail kierowane na adres `alias@example.com` były przekazywane do nowego punktu końcowego testu [żądanie pojemnika](https://requestbin.com/r/en8pfhdgcculn?inspect):

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
<td><em>"@", "." lub puste</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=alias:https://requestbin.com/r/en8pfhdgcculn</code></td>
</tr>
</tbody>
</table>

A może chcesz, aby wszystkie wiadomości e-mail kierowane na adres `example.com` były przekazywane do tego punktu końcowego:

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
<td><em>"@", "." lub puste</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=https://requestbin.com/r/en8pfhdgcculn</code></td>
</tr>
</tbody>
</table>

**Oto dodatkowe uwagi dotyczące webhooków:**

* Jeśli chcesz zweryfikować ładunki webhooka (aby upewnić się, że faktycznie pochodzą z naszego serwera), możesz użyć [rozwiąż adres IP zdalnego klienta i nazwę hosta klienta, korzystając z wyszukiwania odwrotnego](https://nodejs.org/api/dns.html#dnspromisesreverseip) – powinno to być `mx1.forwardemail.net` lub `mx2.forwardemail.net`.
* Możesz również sprawdzić adres IP pod kątem [nasze opublikowane adresy IP](#what-are-your-servers-ip-addresses).
* Jeśli korzystasz z abonamentu płatnego, przejdź do sekcji Moje Konto → Domeny → Ustawienia → Klucz Weryfikacji Podpisu Ładunku Webhooka, aby uzyskać klucz webhooka.
* Możesz w dowolnym momencie zmienić ten klucz ze względów bezpieczeństwa.
* Oblicz i porównaj wartość `X-Webhook-Signature` z naszego żądania webhooka z obliczoną wartością body za pomocą tego klucza. Przykładowy sposób wykonania tej czynności jest dostępny pod adresem [ten post na Stack Overflow](https://stackoverflow.com/a/68885281).
* Więcej informacji można znaleźć w dyskusji pod adresem <https://github.com/forwardemail/free-email-forwarding/issues/235>.
* Jeśli webhook nie odpowie kodem stanu `200`, jego odpowiedź zostanie zapisana w [utworzono dziennik błędów](#do-you-store-error-logs) – co jest przydatne podczas debugowania.
* Żądania HTTP webhooka będą ponawiane do 3 razy przy każdej próbie połączenia SMTP, z maksymalnym limitem czasu 60 sekund na każde żądanie POST do punktu końcowego. **Należy pamiętać, że nie oznacza to, że webhook będzie ponawiał próby tylko 3 razy**, w rzeczywistości będzie ponawiał próby w sposób ciągły, wysyłając kod SMTP 421 (który wskazuje nadawcy ponowienie próby później) po trzeciej nieudanej próbie żądania HTTP POST. Oznacza to, że wiadomość e-mail będzie ponawiana nieprzerwanie przez dni, aż do osiągnięcia kodu stanu 200.
* Ponowimy próbę automatycznie na podstawie domyślnego statusu i kodów błędów użytych w [metoda ponawiania prób superagenta](https://ladjs.github.io/superagent/#retrying-requests) (jesteśmy opiekunami).
* Grupujemy żądania HTTP webhook do tego samego punktu końcowego w jednym żądaniu zamiast w wielu, aby oszczędzać zasoby i przyspieszyć czas odpowiedzi. Na przykład, jeśli wyślesz wiadomość e-mail na adresy <webhook1@example.com>, <webhook2@example.com> i <webhook3@example.com>, a wszystkie z nich są skonfigurowane tak, aby trafiały do *dokładnie* tego samego adresu URL punktu końcowego, zostanie wysłane tylko jedno żądanie. Grupujemy je według dokładnego dopasowania punktu końcowego ze ścisłą równością.
* Należy pamiętać, że używamy metody „simpleParser” biblioteki [parser poczty](https://nodemailer.com/extras/mailparser/) do parsowania wiadomości do obiektu zgodnego z JSON.
* Surowa wartość wiadomości e-mail jako ciąg znaków jest podawana jako właściwość „raw”.
* Wyniki uwierzytelniania są podawane jako właściwości „dkim”, „spf”, „arc”, „dmarc” i „bimi”.
* Przetworzone nagłówki wiadomości e-mail są podawane jako właściwość „headers” – ale pamiętaj, że możesz użyć właściwości „headerLines” dla łatwiejszej iteracji i analizy składniowej.
* Zgrupowani odbiorcy dla tego webhooka są grupowani i podawani jako właściwość „recipients”.
* Informacje o sesji SMTP są podawane jako właściwość „session”. Zawiera ona informacje o nadawcy wiadomości, czasie jej odebrania, HELO i nazwie hosta klienta. Wartość nazwy hosta klienta, `session.clientHostname`, to albo pełna nazwa domeny (z odwrotnego wyszukiwania PTR), albo `session.remoteAddress` ujęta w nawiasy kwadratowe (np. `"[127.0.0.1]"`).
* Jeśli potrzebujesz szybkiego sposobu na uzyskanie wartości `X-Original-To`, możesz użyć wartości `session.recipient` (zobacz przykład poniżej). Nagłówek `X-Original-To` to nagłówek, który dodajemy do wiadomości w celu debugowania z pierwotnym odbiorcą (przed przekierowaniem maskowanym) wiadomości.
* Jeśli chcesz usunąć właściwości `attachments` i/lub `raw` z treści ładunku, po prostu dodaj `?attachments=false`, `?raw=false` lub `?attachments=false&raw=false` do punktu końcowego webhooka jako parametr ciągu zapytania (np. `https://example.com/webhook?attachments=false&raw=false`).
* Jeśli istnieją załączniki, zostaną one dołączone do tablicy `attachments` z wartościami bufora. Możesz je ponownie przekształcić w treść, stosując podejście w JavaScript, takie jak:

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
Wskazówka:
</strong>
Ciekawi Cię, jak wygląda żądanie webhooka z przekazanych wiadomości e-mail? Poniżej zamieściliśmy przykład!
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

### Czy obsługujesz wyrażenia regularne lub wyrażenia regularne {#do-you-support-regular-expressions-or-regex}

Tak, od 27 września 2021 roku dodaliśmy tę funkcję. Możesz po prostu pisać wyrażenia regularne („regex”) w celu dopasowania aliasów i wykonywania podstawień.

Aliasy obsługiwane przez wyrażenia regularne to takie, które zaczynają się od `/` i kończą na `/`, a ich odbiorcami są adresy e-mail lub webhooki. Odbiorcy mogą również uwzględniać obsługę zastępowania wyrażeń regularnych (np. `$1`, `$2`).

Obsługujemy dwie flagi wyrażeń regularnych, w tym `i` i `g`. Flaga `i`, nie uwzględniająca wielkości liter, jest domyślna i zawsze egzekwowana. Globalną flagę `g` można dodać, dodając końcówkę `/` do `/g`.

Należy pamiętać, że w przypadku części odbiorcy obsługujemy także naszą <a href="#can-i-disable-specific-aliases">disabled funkcję aliasu</a> za pomocą wyrażeń regularnych.

Wyrażenia regularne nie są obsługiwane w <a href="/disposable-addresses" target="_blank">globalnych domenach vanity</a> (może to stanowić lukę w zabezpieczeniach).

<div class="alert my-3 alert-danger">
<i class="fa fa-stop-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Zaawansowana ochrona prywatności:
</strong>
<span>
Jeśli korzystasz z planu płatnego (obejmującego zaawansowaną ochronę prywatności), przejdź do <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mojego konta <i class="fa fa-angle-right"></i>Domen</a> i kliknij „Aliasy” obok swojej domeny, aby skonfigurować wyrażenia regularne. Aby dowiedzieć się więcej o planach płatnych, zapoznaj się z naszą stroną <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Cennik</a>. Możesz również postępować zgodnie z poniższymi instrukcjami.
</span>
</div>

Jeśli korzystasz z planu bezpłatnego, po prostu dodaj nowy rekord DNS <strong class="notranslate">TXT</strong>, korzystając z jednego lub kilku podanych poniżej przykładów:

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Prosty przykład:</strong> Jeśli chcę, aby wszystkie wiadomości e-mail kierowane na adres `linus@example.com` lub `torvalds@example.com` były przekazywane na adres `user@gmail.com`:
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
<td><em>"@", "." lub puste</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^(linus|torvalds)$/:user@gmail.com</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Przykład podstawiania imienia i nazwiska:</strong> Wyobraź sobie, że wszystkie firmowe adresy e-mail mają wzór `firstname.lastname@example.com`. Jeśli chcę, aby wszystkie wiadomości e-mail o wzorze `firstname.lastname@example.com` były przekierowywane na `firstname.lastname@company.com` z obsługą podstawiania (<a href="https://regexr.com/66hnu" class="alert-link">zobacz test w RegExr</a>):
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
<td><em>"@", "." lub puste</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^([A-Za-z]+)+\.([A-Za-z]+)+$/:$1.$2@company.com</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Przykład podstawiania filtrowania symboli plus:</strong> Jeśli chcę, aby wszystkie wiadomości e-mail kierowane na adres `info@example.com` lub `support@example.com` były przekazywane odpowiednio na adres `user+info@gmail.com` lub `user+support@gmail.com` (z obsługą podstawiania) (<a href="https://regexr.com/66ho7" class="alert-link">zobacz test w RegExr</a>):
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
<td><em>"@", "." lub puste</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^(support|info)$/:user+$1@gmail.com</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Przykład podstawiania ciągu zapytania w webhooku:</strong> Być może chcesz, aby wszystkie wiadomości e-mail kierowane do `example.com` trafiały do <a href="#do-you-support-webhooks" class="alert-link">webhooka</a> i miały dynamiczny klucz ciągu zapytania „do” z wartością będącą częścią nazwy użytkownika w adresie e-mail (<a href="https://regexr.com/66ho4" class="alert-link">view test on RegExr</a>):
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
<td><em>"@", "." lub puste</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^(.*?)$/:https://example.com/webhook?username=$1</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Przykład cichego odrzucenia:</strong> Jeśli chcesz, aby wszystkie wiadomości e-mail pasujące do określonego wzorca były wyłączane i odrzucane w trybie cichym (nadawca ma wrażenie, że wiadomość została wysłana pomyślnie, ale w rzeczywistości nie dociera do adresata) z kodem statusu `250` (zobacz <a href="#can-i-disable-specific-aliases" class="alert-link">Czy mogę wyłączyć określone aliasy</a>), po prostu zastosuj to samo podejście z pojedynczym wykrzyknikiem „!”. Informuje to nadawcę, że wiadomość została pomyślnie dostarczona, ale w rzeczywistości nie dotarła do adresata (np. czarna dziura lub `/dev/null`).
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
<td><em>"@", "." lub puste</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^(linus|torvalds)$/:!</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Przykład odrzucenia miękkiego:</strong> Jeśli chcesz, aby wszystkie wiadomości e-mail pasujące do określonego wzorca były wyłączane i odrzucane miękko z kodem statusu `421` (zobacz <a href="#can-i-disable-specific-aliases" class="alert-link">Czy mogę wyłączyć określone aliasy</a>), po prostu zastosuj to samo podejście z podwójnym wykrzyknikiem „!!”. To oznacza, że nadawca powinien spróbować ponownie wysłać wiadomość e-mail, a wiadomości na ten alias będą ponawiane przez około 5 dni, a następnie zostaną trwale odrzucone.
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
<td><em>"@", "." lub puste</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^(linus|torvalds)$/:!!</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Przykład twardego odrzucenia:</strong> Jeśli chcesz, aby wszystkie wiadomości e-mail pasujące do określonego wzorca były wyłączane i odrzucane z kodem statusu `550` (zobacz <a href="#can-i-disable-specific-aliases" class="alert-link">Czy mogę wyłączyć określone aliasy</a>), po prostu zastosuj to samo podejście z potrójnym wykrzyknikiem „!!!”. Informuje to nadawcę o trwałym błędzie i wiadomości e-mail nie będą ponawiane, tylko odrzucane dla tego aliasu.
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
<td><em>"@", "." lub puste</em></td>
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
Ciekawi Cię, jak napisać wyrażenie regularne lub chcesz przetestować swój zamiennik? Możesz odwiedzić bezpłatną stronę do testowania wyrażeń regularnych <a href="https://regexr.com" class="alert-link">RegExr</a> pod adresem <a href="https://regexr.com/" class="alert-link">https://regexr.com</a>.
<span>
</span>
</div>

### Jakie są Twoje limity wychodzącego SMTP {#what-are-your-outbound-smtp-limits}

Ograniczamy liczbę użytkowników i domen do 300 wychodzących wiadomości SMTP dziennie. To średnio ponad 9000 wiadomości e-mail w miesiącu kalendarzowym. Jeśli musisz przekroczyć tę liczbę lub regularnie wysyłasz duże wiadomości e-mail, prosimy o [Skontaktuj się z nami](https://forwardemail.net/help).

### Czy potrzebuję zgody, aby włączyć SMTP {#do-i-need-approval-to-enable-smtp}

Tak, prosimy pamiętać, że w celu utrzymania reputacji adresu IP i zapewnienia skutecznej dostarczalności, Forward Email stosuje ręczny proces weryfikacji dla każdej domeny w celu zatwierdzenia poczty wychodzącej SMTP. Prosimy o kontakt mailowy pod adresem <support@forwardemail.net> lub utworzenie konta [prośba o pomoc](https://forwardemail.net/help) w celu zatwierdzenia. Zazwyczaj zajmuje to mniej niż 24 godziny, a większość zgłoszeń jest rozpatrywana w ciągu 1-2 godzin. W najbliższej przyszłości planujemy skrócić ten proces, dodając dodatkowe mechanizmy kontroli spamu i alerty. Ten proces gwarantuje, że Twoje wiadomości e-mail trafią do skrzynki odbiorczej i nie zostaną oznaczone jako spam.

### Jakie są ustawienia konfiguracji serwera SMTP {#what-are-your-smtp-server-configuration-settings}

Nasz serwer ma kod `smtp.forwardemail.net` i jest również monitorowany na naszej <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">stronie statusu</a>.

Obsługuje zarówno IPv4, jak i IPv6 i jest dostępny na portach `465` i `2465` dla protokołu SSL/TLS oraz `587`, `2587`, `2525` i `25` dla protokołu TLS (STARTTLS).

| Protokół | Nazwa hosta | Porty | IPv4 | IPv6 |
| :--------------------------------------------------------------: | ----------------------- | :-------------------------: | :----------------: | :----------------: |
| `SSL/TLS` **Preferowany** | `smtp.forwardemail.net` | `465`, `2465` | :biały_znacznik_sprawdzenia: | :biały_znacznik_sprawdzenia: |
| `TLS` ([STARTTLS](https://wikipedia.org/wiki/Opportunistic_TLS)) | `smtp.forwardemail.net` | `587`, `2587`, `2525`, `25` | :biały_znacznik_sprawdzenia: | :biały_znacznik_sprawdzenia: |

| Login | Przykład | Opis |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nazwa użytkownika | `user@example.com` | Adres e-mail aliasu istniejącego dla domeny w <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Moim koncie <i class="fa fa-angle-right"></i>Domenach</a>. |
| Hasło | `************************` | Wygenerowane hasło specyficzne dla aliasu. |

Aby wysyłać wiadomości e-mail za pomocą protokołu SMTP, **użytkownik SMTP** musi być adresem e-mail aliasu istniejącego dla domeny w <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Moje konto <i class="fa fa-angle-right"></i> Domena</a>, a **hasło SMTP** musi być hasłem wygenerowanym dla danego aliasu.

Instrukcje krok po kroku znajdziesz w [Czy obsługujesz wysyłanie wiadomości e-mail za pomocą protokołu SMTP?](#do-you-support-sending-email-with-smtp).

### Jakie są ustawienia konfiguracji serwera IMAP {#what-are-your-imap-server-configuration-settings}

Nasz serwer ma kod `imap.forwardemail.net` i jest również monitorowany na naszej <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">stronie statusu</a>.

Obsługuje zarówno IPv4, jak i IPv6 i jest dostępny na portach `993` i `2993` dla protokołu SSL/TLS.

| Protokół | Nazwa hosta | Porty | IPv4 | IPv6 |
| :---------------------: | ----------------------- | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **Preferowany** | `imap.forwardemail.net` | `993`, `2993` | :biały_znacznik_sprawdzenia: | :biały_znacznik_sprawdzenia: |

| Login | Przykład | Opis |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nazwa użytkownika | `user@example.com` | Adres e-mail aliasu istniejącego dla domeny w <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Moim koncie <i class="fa fa-angle-right"></i>Domenach</a>. |
| Hasło | `************************` | Wygenerowane hasło specyficzne dla aliasu. |

Aby nawiązać połączenie za pomocą protokołu IMAP, **użytkownik IMAP** musi być adresem e-mail aliasu istniejącego dla domeny w <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Moje konto <i class="fa fa-angle-right"></i> Domeny</a>, a **hasło IMAP** musi być hasłem wygenerowanym dla danego aliasu.

Instrukcje krok po kroku znajdziesz w [Czy obsługujesz odbieranie wiadomości e-mail za pomocą protokołu IMAP?](#do-you-support-receiving-email-with-imap).

### Jakie są ustawienia konfiguracji serwera POP3 {#what-are-your-pop3-server-configuration-settings}

Nasz serwer ma kod `pop3.forwardemail.net` i jest również monitorowany na naszej <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">stronie statusu</a>.

Obsługuje zarówno IPv4, jak i IPv6 i jest dostępny na portach `995` i `2995` dla protokołu SSL/TLS.

| Protokół | Nazwa hosta | Porty | IPv4 | IPv6 |
| :---------------------: | ----------------------- | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **Preferowany** | `pop3.forwardemail.net` | `995`, `2995` | :biały_znacznik_sprawdzenia: | :biały_znacznik_sprawdzenia: |

| Login | Przykład | Opis |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nazwa użytkownika | `user@example.com` | Adres e-mail aliasu istniejącego dla domeny w <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Moim koncie <i class="fa fa-angle-right"></i>Domenach</a>. |
| Hasło | `************************` | Wygenerowane hasło specyficzne dla aliasu. |

Aby nawiązać połączenie za pomocą protokołu POP3, **użytkownik POP3** musi być adresem e-mail aliasu istniejącego dla domeny w <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Moje konto <i class="fa fa-angle-right"></i> Domeny</a>, a **hasło IMAP** musi być hasłem wygenerowanym dla konkretnego aliasu.

Instrukcje krok po kroku znajdziesz w [Czy obsługujesz POP3?](#do-you-support-pop3).

### Konfiguracja przekaźnika SMTP Postfix {#postfix-smtp-relay-configuration}

Możesz skonfigurować Postfix do przekazywania wiadomości e-mail przez serwery SMTP Forward Email. Jest to przydatne dla aplikacji serwerowych, które muszą wysyłać wiadomości e-mail.

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
Wymaga płatnego planu z włączonym dostępem SMTP.
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

2. Podczas instalacji, gdy pojawi się monit o podanie typu konfiguracji, wybierz opcję „Witryna internetowa”.

#### Konfiguracja {#configuration}

1. Edytuj główny plik konfiguracyjny Postfix:

```bash
sudo nano /etc/postfix/main.cf
```

2. Dodaj lub zmień następujące ustawienia:

```
# SMTP relay configuration
relayhost = [smtp.forwardemail.net]:587
smtp_use_tls = yes
smtp_sasl_auth_enable = yes
smtp_sasl_password_maps = hash:/etc/postfix/sasl_passwd
smtp_sasl_security_options = noanonymous
smtp_tls_CAfile = /etc/ssl/certs/ca-certificates.crt
```

3. Utwórz plik hasła SASL:

```bash
sudo nano /etc/postfix/sasl_passwd
```

4. Dodaj swoje dane uwierzytelniające do przekazywania poczty e-mail:

```
[smtp.forwardemail.net]:587 your-alias@yourdomain.com:your-generated-password
```

5. Zabezpiecz i zahaszuj plik z hasłem:

```bash
sudo chmod 600 /etc/postfix/sasl_passwd
sudo postmap /etc/postfix/sasl_passwd
```

6. Uruchom ponownie Postfix:

```bash
sudo systemctl restart postfix
```

#### Testowanie {#testing}

Przetestuj swoją konfigurację wysyłając e-mail testowy:

```bash
echo "Test email body" | mail -s "Test Subject" recipient@example.com
```

## Bezpieczeństwo {#security}

### Zaawansowane techniki wzmacniania serwera {#advanced-server-hardening-techniques}

> \[!TIP]
> Learn more about our security infrastructure on [our Security page](/security).

Forward Email wdraża liczne techniki wzmacniania serwerów w celu zagwarantowania bezpieczeństwa naszej infrastruktury i Twoich danych:

1. **Bezpieczeństwo sieci**:
* Zapora sieciowa z tabelami IP i ścisłymi regułami
* Fail2ban do ochrony przed atakami brute force
* Regularne audyty bezpieczeństwa i testy penetracyjne
* Dostęp administracyjny tylko przez VPN

2. **Wzmocnienie systemu**:
* Minimalna instalacja pakietów
* Regularne aktualizacje zabezpieczeń
* SELinux w trybie wymuszania
* Wyłączony dostęp SSH dla roota
* Tylko uwierzytelnianie oparte na kluczach

3. **Bezpieczeństwo aplikacji**:
* Nagłówki polityki bezpieczeństwa treści (CSP)
* Ścisłe zabezpieczenia transportu HTTPS (HSTS)
* Nagłówki ochrony XSS
* Opcje ramek i nagłówki polityki odsyłającej
* Regularne audyty zależności

4. **Ochrona danych**:
* Pełne szyfrowanie dysku za pomocą LUKS
* Bezpieczne zarządzanie kluczami
* Regularne tworzenie kopii zapasowych z szyfrowaniem
* Praktyki minimalizacji danych

5. **Monitorowanie i reagowanie**:
* Wykrywanie włamań w czasie rzeczywistym
* Automatyczne skanowanie bezpieczeństwa
* Scentralizowane rejestrowanie i analiza
* Procedury reagowania na incydenty

> \[!IMPORTANT]
> Our security practices are continuously updated to address emerging threats and vulnerabilities.

> \[!TIP]
> For maximum security, we recommend using our service with end-to-end encryption via OpenPGP.

### Czy posiadasz certyfikaty SOC 2 lub ISO 27001 {#do-you-have-soc-2-or-iso-27001-certifications}

> \[!NOTE]
> Forward Email operates on infrastructure provided by certified subprocessors to ensure compliance with industry standards.

Forward Email nie posiada bezpośrednio certyfikatów SOC 2 Type II ani ISO 27001. Jednak usługa działa na infrastrukturze dostarczanej przez certyfikowanych podprocesorów:

* **DigitalOcean**: certyfikaty SOC 2 typu II i SOC 3 typu II (audytowane przez Schellman & Company LLC), certyfikat ISO 27001 w wielu centrach danych. Szczegóły: <https://www.digitalocean.com/trust/certification-reports>

* **Vultr**: Certyfikat SOC 2+ (HIPAA), certyfikaty ISO/IEC: 20000-1:2018, 27001:2022, 27017:2015, 27018:2019. Szczegóły: <https://www.vultr.com/legal/compliance/>

* **DataPacket**: Zgodny z SOC 2 (skontaktuj się bezpośrednio z DataPacket, aby uzyskać certyfikat), dostawca infrastruktury klasy korporacyjnej (lokalizacja w Denver). Szczegóły: <https://www.datapacket.com/datacenters/denver>

Forward Email stosuje najlepsze praktyki branżowe w zakresie audytów bezpieczeństwa i regularnie współpracuje z niezależnymi badaczami bezpieczeństwa. Źródło: <https://forwardemail.net/technical-whitepaper.pdf#page=36>

### Czy używasz szyfrowania TLS do przekazywania wiadomości e-mail {#do-you-use-tls-encryption-for-email-forwarding}

Tak. Forward Email ściśle wymusza TLS 1.2+ dla wszystkich połączeń (HTTPS, SMTP, IMAP, POP3) i implementuje MTA-STS w celu ulepszonego wsparcia TLS. Implementacja obejmuje:

* Egzekwowanie protokołu TLS 1.2+ dla wszystkich połączeń e-mail
* Wymiana kluczy ECDHE (Elliptic Curve Diffie-Hellman Ephemeral) dla idealnego utajnienia przekazywania
* Nowoczesne zestawy szyfrów z regularnymi aktualizacjami zabezpieczeń
* Obsługa protokołu HTTP/2 dla lepszej wydajności i bezpieczeństwa
* HSTS (HTTP Strict Transport Security) z preloadingiem w najpopularniejszych przeglądarkach
* **MTA-STS (Mail Transfer Agent Strict Transport Security)** dla ścisłego egzekwowania protokołu TLS

Źródło: <https://forwardemail.net/technical-whitepaper.pdf#page=25>

**Implementacja MTA-STS**: Funkcja Forward Email implementuje ścisłe egzekwowanie MTA-STS w bazie kodu. W przypadku wystąpienia błędów TLS i wymuszenia MTA-STS, system zwraca kody stanu SMTP 421, aby zapewnić późniejsze ponowne wysłanie wiadomości e-mail, a nie ich niezabezpieczone dostarczenie. Szczegóły implementacji:

* Wykrywanie błędów TLS: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-tls-error.js>
* Egzekwowanie protokołu MTA-STS w programie pomocniczym do wysyłania wiadomości e-mail: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/send-email.js>

Walidacja zewnętrzna: <https://www.hardenize.com/report/forwardemail.net/1750312779> wyświetla oceny „Dobre” dla wszystkich środków bezpieczeństwa TLS i transportu.

### Czy zachowujesz nagłówki uwierzytelniania wiadomości e-mail {#do-you-preserve-email-authentication-headers}

Tak. Forward Email kompleksowo implementuje i zachowuje nagłówki uwierzytelniania poczty e-mail:

* **SPF (Sender Policy Framework)**: Poprawnie wdrożone i zachowane
* **DKIM (DomainKeys Identified Mail)**: Pełne wsparcie z odpowiednim zarządzaniem kluczami
* **DMARC**: Egzekwowanie zasad dla wiadomości e-mail, które nie przeszły walidacji SPF lub DKIM
* **ARC**: Chociaż nie jest to szczegółowo opisane, doskonałe wyniki zgodności usługi sugerują kompleksową obsługę nagłówków uwierzytelniania

Źródło: <https://forwardemail.net/technical-whitepaper.pdf#page=31>

Walidacja: Test poczty Internet.nl wykazuje wynik 100/100, szczególnie w przypadku implementacji „SPF, DKIM i DMARC”. Ocena Hardenize potwierdza ocenę „Dobra” dla SPF i DMARC: <https://www.hardenize.com/report/forwardemail.net/1750312779>

### Czy zachowujesz oryginalne nagłówki wiadomości e-mail i zapobiegasz podszywaniu się pod {#do-you-preserve-original-email-headers-and-prevent-spoofing}

> \[!TIP]
> Forward Email implements sophisticated anti-spoofing protection to prevent email abuse.

Funkcja Forward Email zachowuje oryginalne nagłówki wiadomości e-mail, jednocześnie wdrażając kompleksową ochronę przed podszywaniem się za pomocą bazy kodu MX:

* **Zachowanie nagłówków**: Oryginalne nagłówki uwierzytelniające są zachowywane podczas przekazywania.
* **Anty-spoofing**: Egzekwowanie zasad DMARC zapobiega podszywaniu się pod nagłówki poprzez odrzucanie wiadomości e-mail, które nie przeszły walidacji SPF lub DKIM.
* **Zapobieganie wstrzykiwaniu nagłówków**: Walidacja i sanityzacja danych wejściowych za pomocą biblioteki striptags.
* **Zaawansowana ochrona**: Zaawansowane wykrywanie phishingu z wykrywaniem podszywania się, zapobieganiem podszywaniu się i systemami powiadomień użytkowników.

**Szczegóły implementacji MX**: Podstawową logiką przetwarzania wiadomości e-mail zajmuje się baza kodu serwera MX, a konkretnie:

* Główny moduł obsługi danych MX: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>
* Filtrowanie dowolnych wiadomości e-mail (zapobieganie podszywaniu się): <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-arbitrary.js>

Funkcja pomocnicza `isArbitrary` wdraża zaawansowane reguły zabezpieczające przed podszywaniem się, w tym wykrywanie podszywania się pod domenę, blokowanych fraz i różnych wzorców phishingu.

Źródło: <https://forwardemail.net/technical-whitepaper.pdf#page=32>

### Jak chronić się przed spamem i nadużyciami {#how-do-you-protect-against-spam-and-abuse}

Forward Email zapewnia kompleksową, wielowarstwową ochronę:

* **Ograniczanie przepustowości**: Stosowane do prób uwierzytelniania, punktów końcowych API i połączeń SMTP
* **Izolacja zasobów**: Między użytkownikami w celu zapobiegania wpływowi użytkowników o dużej liczbie połączeń
* **Ochrona przed atakami DDoS**: Wielowarstwowa ochrona za pośrednictwem systemu DataPacket Shield i Cloudflare
* **Automatyczne skalowanie**: Dynamiczne dostosowywanie zasobów w zależności od zapotrzebowania
* **Zapobieganie nadużyciom**: Kontrola nadużyć dla poszczególnych użytkowników i blokowanie złośliwej zawartości na podstawie hasha
* **Uwierzytelnianie wiadomości e-mail**: Protokoły SPF, DKIM, DMARC z zaawansowaną detekcją phishingu

Źródła:

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver> (szczegóły ochrony przed atakami DDoS)
* <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/abuse-prevention-by-user-id.js>

### Czy przechowujesz treść wiadomości e-mail na dysku {#do-you-store-email-content-on-disk}

> \[!IMPORTANT]
> Forward Email uses a zero-knowledge architecture that prevents email content from being written to disk.

* **Architektura Zero-Knowledge**: Indywidualnie szyfrowane skrzynki pocztowe SQLite uniemożliwiają dostęp do treści wiadomości e-mail.
* **Przetwarzanie w pamięci**: Przetwarzanie wiadomości e-mail odbywa się wyłącznie w pamięci, bez konieczności przechowywania danych na dysku.
* **Brak rejestrowania treści**: „Nie rejestrujemy ani nie przechowujemy treści wiadomości e-mail ani metadanych na dysku”.
* **Szyfrowanie w trybie sandboxingu**: Klucze szyfrujące nigdy nie są przechowywane na dysku w postaci zwykłego tekstu.

**Dowody z bazy kodu MX**: Serwer MX przetwarza wiadomości e-mail w całości w pamięci, bez zapisywania zawartości na dysku. Główny moduł obsługi wiadomości e-mail demonstruje to podejście oparte na pamięci: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

Źródła:

* <https://forwardemail.net/technical-whitepaper.pdf#page=10> (Streszczenie)
* <https://forwardemail.net/technical-whitepaper.pdf#page=59> (Szczegóły z zerową wiedzą)
* <https://forwardemail.net/technical-whitepaper.pdf#page=21> (Szyfrowanie w trybie sandbox)

### Czy treść wiadomości e-mail może zostać ujawniona podczas awarii systemu? {#can-email-content-be-exposed-during-system-crashes}

Nie. Funkcja Forward Email wdraża kompleksowe zabezpieczenia przed ujawnieniem danych w wyniku awarii:

* **Zrzuty pamięci wyłączone**: Zapobiega ujawnieniu pamięci podczas awarii
* **Pamięć wymiany wyłączona**: Całkowicie wyłączone, aby zapobiec wyodrębnianiu poufnych danych z plików wymiany
* **Architektura w pamięci**: Treść wiadomości e-mail znajduje się tylko w pamięci ulotnej podczas przetwarzania
* **Ochrona klucza szyfrującego**: Klucze nigdy nie są przechowywane na dysku w postaci zwykłego tekstu
* **Bezpieczeństwo fizyczne**: Szyfrowane dyski LUKS v2 uniemożliwiają fizyczny dostęp do danych
* **Magazyn USB wyłączony**: Zapobiega nieautoryzowanemu wyodrębnianiu danych

**Obsługa błędów w przypadku problemów systemowych**: Funkcja Forward Email korzysta z funkcji pomocniczych `isCodeBug` i `isTimeoutError`, aby zapewnić, że w przypadku wystąpienia problemów z łącznością z bazą danych, problemów z siecią DNS/listą blokowanych adresów lub problemów z łącznością nadrzędną, system zwróci kody stanu SMTP 421, aby zapewnić, że wiadomości e-mail zostaną ponowione później, a nie zostaną utracone lub ujawnione.

Szczegóły wdrożenia:

* Klasyfikacja błędu: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js>
* Obsługa błędów przekroczenia limitu czasu w przetwarzaniu MX: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

Źródło: <https://forwardemail.net/technical-whitepaper.pdf#page=15>

### Kto ma dostęp do Twojej infrastruktury poczty e-mail {#who-has-access-to-your-email-infrastructure}

Forward Email wdraża kompleksowe kontrole dostępu dla swojego minimalnego zespołu inżynierów składającego się z 2–3 osób, stosując rygorystyczne wymagania 2FA:

* **Kontrola dostępu oparta na rolach**: Dla kont zespołowych z uprawnieniami opartymi na zasobach
* **Zasada najmniejszych uprawnień**: Stosowana we wszystkich systemach
* **Podział obowiązków**: Między rolami operacyjnymi
* **Zarządzanie użytkownikami**: Oddziel użytkowników wdrożeń i DevOps z różnymi uprawnieniami
* **Logowanie root wyłączone**: Wymusza dostęp przez prawidłowo uwierzytelnione konta
* **Ścisłe uwierzytelnianie dwuskładnikowe**: Brak uwierzytelniania dwuskładnikowego opartego na SMS-ach ze względu na ryzyko ataków typu MiTM — tylko tokeny aplikacyjne lub sprzętowe
* **Kompleksowe rejestrowanie audytu**: Z redagowaniem danych wrażliwych
* **Automatyczne wykrywanie anomalii**: W przypadku nietypowych wzorców dostępu
* **Regularne przeglądy bezpieczeństwa**: Logów dostępu
* **Zapobieganie atakom Evil Maid**: Wyłączona pamięć USB i inne fizyczne środki bezpieczeństwa

Źródła:

* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (Kontrola autoryzacji)
* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (Bezpieczeństwo sieci)
* <https://forwardemail.net/technical-whitepaper.pdf#page=15> (Zapobieganie atakom Evil Maid)

### Z jakich dostawców infrastruktury korzystasz {#what-infrastructure-providers-do-you-use}

> \[!IMPORTANT]
> Forward Email uses multiple infrastructure subprocessors with comprehensive compliance certifications.

Pełne informacje są dostępne na naszej stronie dotyczącej zgodności z RODO: <https://forwardemail.net/gdpr>

**Główni podprocesorzy infrastruktury:**

| Dostawca | Certyfikowany w ramach ochrony danych osobowych | Strona zgodności z RODO |
| ---------------- | -------------------------------- | ----------------------------------------------- |
| **Cloudflare** | ✅ Tak | <https://www.cloudflare.com/trust-hub/gdpr/> |
| **Pakiet danych** | ❌ Nie | <https://www.datapacket.com/privacy-policy> |
| **CyfrowyOcean** | ❌ Nie | <https://www.digitalocean.com/legal/gdpr> |
| **Vultr** | ❌ Nie | <https://www.vultr.com/legal/eea-gdpr-privacy/> |

**Szczegółowe certyfikaty:**

**CyfrowyOcean**

* SOC 2 Typ II i SOC 3 Typ II (audytowane przez Schellman & Company LLC)
* Certyfikat ISO 27001 w wielu centrach danych
* Zgodność z PCI-DSS
* Certyfikat CSA STAR Poziom 1
* Certyfikat APEC CBPR PRP
* Szczegóły: <https://www.digitalocean.com/trust/certification-reports>

**Vultr**

* Certyfikat SOC 2+ (HIPAA)
* Zgodność ze standardem PCI Merchant
* Certyfikat CSA STAR Poziom 1
* ISO/IEC 20000-1:2018, 27001:2022, 27017:2015, 27018:2019
* Szczegóły: <https://www.vultr.com/legal/compliance/>

**Pakiet danych**

* Zgodność z SOC 2 (skontaktuj się bezpośrednio z DataPacket, aby uzyskać certyfikat)
* Infrastruktura klasy korporacyjnej (lokalizacja w Denver)
* Ochrona przed atakami DDoS za pośrednictwem pakietu cyberbezpieczeństwa Shield
* Całodobowe wsparcie techniczne
* Globalna sieć obejmująca 58 centrów danych
* Szczegóły: <https://www.datapacket.com/datacenters/denver>

**Przetwarzacze płatności:**

* **Stripe**: Certyfikat DPF - <https://stripe.com/legal/privacy-center>
* **PayPal**: Brak certyfikatu DPF - <https://www.paypal.com/uk/legalhub/privacy-full>

### Czy oferujecie umowę o przetwarzaniu danych (DPA) {#do-you-offer-a-data-processing-agreement-dpa}

Tak, Forward Email oferuje kompleksową Umowę o Przetwarzaniu Danych (DPA), którą można podpisać wraz z naszą umową korporacyjną. Kopia naszej Umowy DPA jest dostępna pod adresem: <https://forwardemail.net/dpa>

**Szczegóły DPA:**

* Obejmuje zgodność z RODO i ramami Tarczy Prywatności UE-USA/Szwajcaria-USA
* Automatycznie akceptowane po zaakceptowaniu naszych Warunków korzystania z usługi
* Nie jest wymagany oddzielny podpis w przypadku standardowej umowy DPA
* Dostępne są niestandardowe umowy DPA w ramach licencji Enterprise

**Ramy zgodności z RODO:**
Nasza umowa o przetwarzaniu danych szczegółowo opisuje zgodność z RODO, a także wymogi dotyczące międzynarodowego transferu danych. Pełne informacje są dostępne pod adresem: <https://forwardemail.net/gdpr>

Klienci korporacyjni potrzebujący niestandardowych warunków DPA lub szczególnych ustaleń umownych mogą skorzystać z naszego programu **Licencja Enterprise (250 USD/miesiąc)**.

### Jak radzisz sobie z powiadomieniami o naruszeniu danych {#how-do-you-handle-data-breach-notifications}

> \[!NOTE]
> Forward Email's zero-knowledge architecture significantly limits breach impact.

* **Ograniczone ujawnienie danych**: Brak dostępu do zaszyfrowanej treści wiadomości e-mail z powodu architektury zerowej wiedzy
* **Minimalne gromadzenie danych**: Tylko podstawowe informacje o subskrybentach i ograniczone dzienniki IP ze względów bezpieczeństwa
* **Struktury podprocesorów**: DigitalOcean i Vultr stosują procedury reagowania na incydenty zgodne z RODO

**Informacje o przedstawicielu ds. RODO:**
Forward Email wyznaczył przedstawicieli ds. RODO zgodnie z artykułem 27:

**Przedstawiciel UE:**
Osano International Compliance Services Limited
Do wiadomości: LFHC
3 Dublin Landings, North Wall Quay
Dublin 1, D01C4E0

**Przedstawiciel w Wielkiej Brytanii:**
Osano UK Compliance LTD
Do wiadomości: LFHC
42-46 Fountain Street, Belfast
Antrim, BT1-5EF

W przypadku klientów korporacyjnych wymagających konkretnych umów SLA dotyczących powiadamiania o naruszeniach, kwestie te należy omówić w ramach umowy **Licencji Enterprise**.

Źródła:

* <https://forwardemail.net/technical-whitepaper.pdf#page=59>
* <https://forwardemail.net/gdpr>

### Czy oferujecie środowisko testowe {#do-you-offer-a-test-environment}

Dokumentacja techniczna Forward Email nie opisuje wyraźnie dedykowanego trybu sandbox. Jednak potencjalne podejścia testowe obejmują:

* **Opcja samodzielnego hostingu**: Kompleksowe możliwości samodzielnego hostingu do tworzenia środowisk testowych
* **Interfejs API**: Możliwość programowego testowania konfiguracji
* **Open Source**: Kod w 100% open source umożliwia klientom badanie logiki przekierowań
* **Wiele domen**: Obsługa wielu domen może umożliwić tworzenie domen testowych

Klienci korporacyjni wymagający formalnych możliwości środowiska testowego powinni omówić tę kwestię w ramach umowy o **Licencję Enterprise**.

Źródło: <https://github.com/forwardemail/forwardemail.net> (Szczegóły środowiska programistycznego)

### Czy udostępniacie narzędzia do monitorowania i powiadamiania {#do-you-provide-monitoring-and-alerting-tools}

Forward Email umożliwia monitorowanie w czasie rzeczywistym, jednak ma pewne ograniczenia:

**Dostępny:**

* **Monitorowanie dostarczania w czasie rzeczywistym**: Publicznie widoczne wskaźniki wydajności dla głównych dostawców poczty e-mail
* **Automatyczne alerty**: Zespół inżynierów otrzymuje powiadomienia, gdy czas dostarczania przekroczy 10 sekund
* **Przejrzysty monitoring**: W 100% otwarte systemy monitorowania
* **Monitorowanie infrastruktury**: Automatyczne wykrywanie anomalii i kompleksowe rejestrowanie audytów

**Ograniczenia:**

* Webhooki skierowane do klientów lub powiadomienia o stanie dostawy oparte na interfejsie API nie są wyraźnie udokumentowane

Klienci korporacyjni potrzebujący szczegółowych informacji o stanie dostawy za pomocą webhooków lub niestandardowych integracji monitorowania mogą udostępnić te funkcje w ramach **Licencji Enterprise**.

Źródła:

* <https://forwardemail.net> (Wyświetlanie monitorowania w czasie rzeczywistym)
* <https://github.com/forwardemail/forwardemail.net> (Implementacja monitorowania)

### Jak zapewnić wysoką dostępność {#how-do-you-ensure-high-availability}

> \[!IMPORTANT]
> Forward Email implements comprehensive redundancy across multiple infrastructure providers.

* **Rozproszona infrastruktura**: Wielu dostawców (DigitalOcean, Vultr, DataPacket) w różnych regionach geograficznych
* **Geograficzne równoważenie obciążenia**: Geograficznie zlokalizowane równoważenie obciążenia oparte na Cloudflare z automatycznym przełączaniem awaryjnym
* **Automatyczne skalowanie**: Dynamiczne dostosowywanie zasobów w zależności od zapotrzebowania
* **Wielowarstwowa ochrona przed atakami DDoS**: Poprzez system Shield DataPacket i Cloudflare
* **Nadmiarowość serwerów**: Wiele serwerów w regionie z automatycznym przełączaniem awaryjnym
* **Replikacja bazy danych**: Synchronizacja danych w czasie rzeczywistym w wielu lokalizacjach
* **Monitorowanie i alerty**: Całodobowy monitoring z automatyczną reakcją na incydenty

**Zaangażowanie w zapewnienie dostępności**: dostępność usługi na poziomie 99,9%+ z przejrzystym monitorowaniem dostępnym pod adresem <https://forwardemail.net>

Źródła:

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver>

### Czy przestrzegasz postanowień sekcji 889 Ustawy o autoryzacji wydatków na obronę narodową (NDAA) {#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa}

> \[!IMPORTANT]
> Forward Email is fully compliant with Section 889 through careful selection of infrastructure partners.

Tak, funkcja Forward Email jest zgodna z **Sekcją 889**. Sekcja 889 Ustawy o autoryzacji wydatków na obronę narodową (NDAA) zabrania agencjom rządowym korzystania z usług lub zawierania umów z podmiotami wykorzystującymi sprzęt telekomunikacyjny i do monitoringu wideo określonych firm (Huawei, ZTE, Hikvision, Dahua i Hytera).

**W jaki sposób funkcja Forward Email spełnia wymogi sekcji 889:**

Forward Email opiera się wyłącznie na dwóch kluczowych dostawcach infrastruktury, z których żaden nie używa sprzętu zabronionego na mocy sekcji 889:

1. **Cloudflare**: Nasz główny partner w zakresie usług sieciowych i bezpieczeństwa poczty e-mail
2. **DataPacket**: Nasz główny dostawca infrastruktury serwerowej (wykorzystujący wyłącznie sprzęt Arista Networks i Cisco)
3. **Dostawcy kopii zapasowych**: Nasi dostawcy kopii zapasowych, Digital Ocean i Vultr, posiadają dodatkowo pisemne potwierdzenie zgodności z sekcją 889.

**Zobowiązanie Cloudflare**: Cloudflare wyraźnie oświadcza w swoim Kodeksie postępowania dla stron trzecich, że nie korzysta ze sprzętu telekomunikacyjnego, produktów do monitoringu wideo ani usług podmiotów objętych zakazem określonym w Sekcji 889.

**Przypadek zastosowania w rządzie**: Nasza zgodność z sekcją 889 została potwierdzona, gdy **Akademia Marynarki Wojennej Stanów Zjednoczonych** wybrała usługę Forward Email w celu zapewnienia bezpiecznego przekazywania wiadomości e-mail, co wymagało udokumentowania naszych federalnych standardów zgodności.

Aby uzyskać szczegółowe informacje na temat naszych ram zgodności z przepisami rządowymi, w tym szerszych przepisów federalnych, przeczytaj nasze kompleksowe studium przypadku: [Usługa poczty elektronicznej rządu federalnego zgodna z sekcją 889](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)

## Szczegóły systemowe i techniczne {#system-and-technical-details}

### Czy przechowujesz wiadomości e-mail i ich zawartość pod adresem {#do-you-store-emails-and-their-contents}

Nie, nie zapisujemy danych na dysku ani nie przechowujemy logów – za pomocą [wyjątek od błędów](#do-you-store-error-logs) i [wychodzący SMTP](#do-you-support-sending-email-with-smtp) (zobacz nasz [Polityka prywatności](/privacy)).

Wszystko odbywa się w pamięci i jest [nasz kod źródłowy znajduje się na GitHubie](https://github.com/forwardemail).

### Jak działa system przekazywania poczty e-mail {#how-does-your-email-forwarding-system-work}

Poczta e-mail opiera się na protokole [Protokół SMTP](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol). Protokół ten składa się z poleceń wysyłanych do serwera (działającego najczęściej na porcie 25). Nawiązywane jest połączenie początkowe, następnie nadawca wskazuje, od kogo pochodzi wiadomość („MAIL FROM”), dokąd jest ona kierowana („RCPT TO”), a na końcu nagłówki i treść samej wiadomości („DATA”). Poniżej opisano przepływ działania naszego systemu przekierowywania wiadomości e-mail w odniesieniu do każdego polecenia protokołu SMTP:

* Połączenie początkowe (bez nazwy polecenia, np. `telnet example.com 25`) – To jest połączenie początkowe. Sprawdzamy nadawców, którzy nie znajdują się na naszej liście [lista dozwolonych](#do-you-have-an-allowlist), pod kątem [lista odrzucających](#do-you-have-a-denylist). Na koniec, jeśli nadawca nie znajduje się na naszej liście dozwolonych, sprawdzamy, czy został on [na szarej liście](#do-you-have-a-greylist).

* `HELO` – Oznacza powitanie identyfikujące pełną nazwę domeny (FQDN), adres IP lub nazwę programu obsługi poczty nadawcy. Tę wartość można podrobić, dlatego nie polegamy na tych danych i zamiast tego używamy odwrotnego wyszukiwania nazwy hosta adresu IP połączenia.

* `MAIL FROM` – Wskazuje adres nadawcy w kopercie wiadomości e-mail. Jeśli wprowadzono wartość, musi to być prawidłowy adres e-mail zgodny ze standardem RFC 5322. Dozwolone są wartości puste. Używamy [sprawdź rozproszenie wsteczne](#how-do-you-protect-against-backscatter), a także sprawdzamy adres MAIL FROM pod kątem [lista odrzucających](#do-you-have-a-denylist). Na koniec sprawdzamy nadawców, którzy nie znajdują się na liście dozwolonych, pod kątem ograniczenia przepustowości (więcej informacji można znaleźć w sekcjach [Ograniczanie szybkości transmisji](#do-you-have-rate-limiting) i [lista dozwolonych](#do-you-have-an-allowlist)).

* `RCPT TO` – Wskazuje adresatów wiadomości e-mail. Muszą to być prawidłowe adresy e-mail zgodne ze standardem RFC 5322. Dopuszczamy maksymalnie 50 adresatów w kopercie na wiadomość (to co innego niż nagłówek „Do” w wiadomości e-mail). Sprawdzamy również, czy adres [Schemat przepisywania nadawcy](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme) („SRS”) jest prawidłowy, aby chronić przed podszywaniem się pod naszą domenę SRS.

* `DATA` – To podstawowa część naszej usługi, która przetwarza wiadomości e-mail. Więcej informacji znajdziesz w sekcji [Jak przetworzyć wiadomość e-mail w celu jej przekazania?](#how-do-you-process-an-email-for-forwarding) poniżej.

### Jak przetworzyć wiadomość e-mail w celu przekazania jej do adresu {#how-do-you-process-an-email-for-forwarding}

W tej sekcji opisano nasz proces związany z poleceniem protokołu SMTP `DATA` w sekcji [Jak działa Twój system przekazywania poczty e-mail](#how-does-your-email-forwarding-system-work) powyżej – w ten sposób przetwarzamy nagłówki, treść i zabezpieczenia wiadomości e-mail, określamy miejsce, do którego wiadomość ma zostać dostarczona, a także jak obsługujemy połączenia.

1. Jeśli wiadomość przekroczy maksymalny rozmiar 50 MB, zostanie odrzucona z kodem błędu 552.

2. Jeśli wiadomość nie zawiera nagłówka „From” lub jeśli którakolwiek z wartości w nagłówku „From” nie jest prawidłowym adresem e-mail zgodnym ze standardem RFC 5322, wiadomość zostaje odrzucona z kodem błędu 550.

3. Jeśli wiadomość miała więcej niż 25 nagłówków „Received”, oznacza to, że utknęła w pętli przekierowań i zostaje odrzucona z kodem błędu 550.

4. Korzystając z odcisku palca wiadomości e-mail (zobacz sekcję dotyczącą [Pobieranie odcisków palców](#how-do-you-determine-an-email-fingerprint)), sprawdzimy, czy wiadomość była ponownie wysyłana przez co najmniej 5 dni (co odpowiada [domyślne zachowanie postfiksu](http://www.postfix.org/postconf.5.html#maximal_queue_lifetime)). Jeśli tak, wiadomość zostanie odrzucona z kodem błędu 550.

5. Wyniki skanowania poczty elektronicznej zapisujemy w pamięci za pomocą [Skaner spamu](https://spamscanner.net).

6. Jeśli wystąpiły jakiekolwiek arbitralne wyniki ze skanera spamu, zostaną one odrzucone z kodem błędu 554. W momencie pisania tego tekstu arbitralne wyniki obejmują tylko test GTUBE. Więcej informacji można znaleźć w <https://spamassassin.apache.org/gtube/>.

7. Do wiadomości dodamy następujące nagłówki w celu debugowania i zapobiegania nadużyciom:

* `Received` – dodajemy standardowy nagłówek „Received” z adresem IP nadawcy i hostem, typem transmisji, informacjami o połączeniu TLS, datą/godziną i odbiorcą.

* `X-Original-To` – pierwotny odbiorca wiadomości:
* Jest to przydatne do określenia, do kogo wiadomość e-mail została pierwotnie dostarczona (oprócz nagłówka „Received”).
* Jest to dodawane dla każdego odbiorcy w momencie przesyłania wiadomości IMAP i/lub maskowanego przekierowania (w celu ochrony prywatności).

* `X-Forward-Email-Website` – zawiera link do naszej strony internetowej <https://forwardemail.net>
* `X-Forward-Email-Version` – aktualna wersja [SemVer](https://semver.org/) z `package.json` z naszej bazy kodu.
* `X-Forward-Email-Session-ID` — wartość identyfikatora sesji używana do celów debugowania (dotyczy tylko środowisk nieprodukcyjnych).

* `X-Forward-Email-Sender` — lista oddzielona przecinkami zawierająca oryginalny adres MAIL FROM w kopercie (jeśli nie był pusty), pełną nazwę domeny klienta odwrotnego PTR (jeśli istnieje) oraz adres IP nadawcy.

* `X-Forward-Email-ID` — dotyczy tylko wychodzącego SMTP i odpowiada identyfikatorowi e-mail zapisanemu w sekcji Moje Konto → Wiadomości e-mail.

* `X-Report-Abuse` — z wartością `abuse@forwardemail.net`.

* `X-Report-Abuse-To` — z wartością `abuse@forwardemail.net`.

* `X-Complaints-To` - o wartości `abuse@forwardemail.net`.

8. Następnie sprawdzamy komunikat dla [DKIM](https://en.wikipedia.org/wiki/DomainKeys_Identified_Mail), [SPF](https://en.wikipedia.org/wiki/Sender_Policy_Framework), [ARC](https://en.wikipedia.org/wiki/Authenticated_Received_Chain) i [DMARC](https://en.wikipedia.org/wiki/DMARC).

* Jeśli wiadomość nie przeszła kontroli DMARC, a domena miała politykę odrzucenia (np. `p=reject` [był w polityce DMARC](https://wikipedia.org/wiki/DMARC)), zostanie ona odrzucona z kodem błędu 550. Zazwyczaj politykę DMARC dla domeny można znaleźć w rekordzie <strong class="notranslate">TXT</strong> subdomeny `_dmarc` (np. `dig _dmarc.example.com txt`).
* Jeśli wiadomość nie przeszła kontroli SPF, a domena miała politykę twardego błędu (np. `-all` w polityce SPF, a nie `~all` lub nie miała żadnej polityki), zostanie ona odrzucona z kodem błędu 550. Zazwyczaj politykę SPF dla domeny można znaleźć w rekordzie <strong class="notranslate">TXT</strong> dla domeny głównej (np. `dig example.com txt`). Więcej informacji na temat [wysyłanie poczty jak w Gmailu](#can-i-send-mail-as-in-gmail-with-this) w kontekście SPF można znaleźć w tej sekcji.

9. Teraz przetwarzamy odbiorców wiadomości zebranych z polecenia `RCPT TO` w sekcji [Jak działa Twój system przekazywania poczty e-mail](#how-does-your-email-forwarding-system-work) powyżej. Dla każdego odbiorcy wykonujemy następujące operacje:

* Przeszukujemy rekordy <strong class="notranslate">TXT</strong> nazwy domeny (część po symbolu `@`, np. `example.com`, jeśli adres e-mail to `test@example.com`). Na przykład, jeśli domeną jest `example.com`, przeprowadzamy wyszukiwanie DNS, takie jak `dig example.com txt`.
* Analizujemy wszystkie rekordy <strong class="notranslate">TXT</strong>, które zaczynają się od `forward-email=` (plany bezpłatne) lub `forward-email-site-verification=` (plany płatne). Należy pamiętać, że analizujemy oba rekordy, aby przetwarzać wiadomości e-mail, gdy użytkownik zmienia plan na wyższy lub niższy.
* Na podstawie tych przeanalizowanych rekordów <strong class="notranslate">TXT</strong> iterujemy je, aby wyodrębnić konfigurację przekierowania (zgodnie z opisem w sekcji [Jak rozpocząć i skonfigurować przekazywanie wiadomości e-mail](#how-do-i-get-started-and-set-up-email-forwarding) powyżej). Należy pamiętać, że obsługujemy tylko jedną wartość `forward-email-site-verification=`, a jeśli zostanie podana więcej niż jedna, wystąpi błąd 550, a nadawca otrzyma wiadomość zwrotną dla tego odbiorcy.
* Rekurencyjnie iterujemy wyodrębnioną konfigurację przekierowania, aby określić przekierowanie globalne, przekierowanie oparte na wyrażeniach regularnych i wszystkie inne obsługiwane konfiguracje przekierowania – które są teraz znane jako nasze „Adresy przekierowania”.
* Dla każdego adresu przekierowania obsługujemy jedno wyszukiwanie rekurencyjne (które rozpocznie tę serię operacji od nowa na danym adresie). Jeśli zostanie znalezione dopasowanie rekurencyjne, wynik nadrzędny zostanie usunięty z adresów przekierowania, a adresy podrzędne zostaną dodane.
* Adresy przekierowania są analizowane pod kątem unikalności (ponieważ nie chcemy wysyłać duplikatów na jeden adres ani generować dodatkowych, niepotrzebnych połączeń klientów SMTP).
* Dla każdego adresu przekierowania sprawdzamy jego nazwę domeny w naszym punkcie końcowym API `/v1/max-forwarded-addresses` (aby określić, na ile adresów domena może przekierowywać wiadomości e-mail na alias, np. domyślnie 10 – patrz sekcja [maksymalny limit przekazywania na alias](#is-there-a-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias)). Przekroczenie tego limitu spowoduje błąd 550, a nadawca otrzyma wiadomość zwrotną dla tego odbiorcy.
* Sprawdzamy ustawienia pierwotnego odbiorcy w naszym punkcie końcowym API `/v1/settings`, który obsługuje wyszukiwanie dla użytkowników płatnych (z opcją awaryjną dla użytkowników bezpłatnych). Zwraca obiekt konfiguracji dla ustawień zaawansowanych dla `port` (liczba, np. `25`), `has_adult_content_protection` (wartość logiczna), `has_phishing_protection` (wartość logiczna), `has_executable_protection` (wartość logiczna) i `has_virus_protection` (wartość logiczna).
* Na podstawie tych ustawień sprawdzamy następnie wyniki skanowania spamu i jeśli wystąpią jakiekolwiek błędy, wiadomość jest odrzucana z kodem błędu 554 (np. jeśli włączona jest opcja `has_virus_protection`, sprawdzamy wyniki skanowania spamu pod kątem wirusów). Należy pamiętać, że wszyscy użytkownicy planu bezpłatnego zostaną objęci kontrolą pod kątem treści dla dorosłych, phishingu, plików wykonywalnych i wirusów. Domyślnie wszyscy użytkownicy planu płatnego również są objęci tą kontrolą, ale tę konfigurację można zmienić na stronie Ustawienia dla domeny w panelu Przekazywanie wiadomości e-mail.

10. Dla każdego przetworzonego Adresu Przekierowującego odbiorcy wykonujemy następnie następujące operacje:

* Adres jest sprawdzany pod kątem naszego [lista odrzucających](#do-you-have-a-denylist) i jeśli znajduje się na liście, wystąpi błąd 421 (wskazujący nadawcy, aby spróbował ponownie później).
* Jeśli adres jest webhookiem, ustawiamy wartość logiczną na potrzeby przyszłych operacji (patrz poniżej – grupujemy podobne webhooki, aby utworzyć jedno żądanie POST zamiast wielu w celu dostarczenia).
* Jeśli adres jest adresem e-mail, analizujemy hosta pod kątem przyszłych operacji (patrz poniżej – grupujemy podobne hosty, aby utworzyć jedno połączenie zamiast wielu pojedynczych połączeń w celu dostarczenia).

11. Jeśli nie ma odbiorców i nie ma zwrotów, wówczas wyświetlamy błąd 550: „Nieprawidłowi odbiorcy”.

12. Jeśli istnieją odbiorcy, iterujemy ich (zgrupowanych przez tego samego hosta) i dostarczamy e-maile. Więcej informacji znajdziesz w sekcji [Jak radzisz sobie z problemami z dostarczaniem wiadomości e-mail?](#how-do-you-handle-email-delivery-issues) poniżej.

* Jeśli podczas wysyłania wiadomości e-mail wystąpią jakiekolwiek błędy, zostaną one zapisane w pamięci do późniejszego przetworzenia.
* Będziemy brać najniższy kod błędu (jeśli taki istnieje) z wysyłania wiadomości e-mail i używać go jako kodu odpowiedzi na polecenie `DATA`. Oznacza to, że wiadomości e-mail, które nie zostały dostarczone, będą zazwyczaj ponownie wysyłane przez pierwotnego nadawcę, natomiast wiadomości, które zostały już dostarczone, nie zostaną ponownie wysłane przy następnym wysyłaniu wiadomości (ponieważ używamy [Pobieranie odcisków palców](#how-do-you-determine-an-email-fingerprint)).
* Jeśli nie wystąpią żadne błędy, wyślemy kod odpowiedzi SMTP 250 z potwierdzeniem pomyślnego dostarczenia.
* Za odrzucenie uznaje się każdą próbę dostarczenia wiadomości, która skutkuje kodem statusu ≥ 500 (trwałe błędy).

13. Jeśli nie wystąpiły żadne odbicia (awarie trwałe), zwrócimy kod statusu odpowiedzi SMTP o najniższym kodzie błędu spośród awarii nietrwałych (lub kod statusu pomyślnego 250, jeśli nie wystąpiły żadne awarie).

14. Jeśli wystąpiły odbicia, wyślemy w tle e-maile z informacją o odbiciu po zwróceniu nadawcy najniższego ze wszystkich kodów błędu. Jeśli jednak najniższy kod błędu jest >= 500, nie wyślemy żadnych e-maili z informacją o odbiciu. Dzieje się tak, ponieważ w takim przypadku nadawcy otrzymaliby podwójne odbicia (np. jeden z ich wychodzącego MTA, takiego jak Gmail – i jeden od nas). Więcej informacji znajdziesz w sekcji [Jak chronić się przed rozproszeniem wstecznym](#how-do-you-protect-against-backscatter) poniżej.

### Jak radzisz sobie z problemami z dostarczaniem wiadomości e-mail {#how-do-you-handle-email-delivery-issues}

Należy zauważyć, że wykonamy przepisanie „Friendly-From” w wiadomościach e-mail tylko wtedy, gdy polityka DMARC nadawcy nie przejdzie ORAZ żadne podpisy DKIM nie zostaną wyrównane z nagłówkiem „From”. Oznacza to, że zmienimy nagłówek „From” w wiadomości, ustawimy „X-Original-From”, a także ustawimy „Reply-To”, jeśli nie został już ustawiony. Ponownie zapieczętujemy również pieczęć ARC w wiadomości po zmianie tych nagłówków.

Wykorzystujemy również inteligentną analizę składniową komunikatów o błędach na każdym poziomie naszego stosu – w naszym kodzie, żądaniach DNS, wewnętrznych zasobach Node.js, żądaniach HTTP (np. 408, 413 i 429 są mapowane na kod odpowiedzi SMTP 421, jeśli odbiorcą jest webhook) oraz odpowiedziach serwera pocztowego (np. odpowiedzi z komunikatami „defer” lub „slowdown” będą ponawiane jako błędy 421).

Nasza logika jest odporna na błędy i będzie ponawiać próby w przypadku błędów SSL/TLS, problemów z połączeniem i innych. Celem odporności na błędy jest maksymalizacja dostarczalności do wszystkich odbiorców w konfiguracji przekierowania.

Jeśli odbiorcą jest webhook, zezwolimy na 60-sekundowy limit czasu na realizację żądania, z maksymalnie 3 powtórzeniami (czyli łącznie 4 żądania przed wystąpieniem błędu). Należy zauważyć, że poprawnie analizujemy kody błędów 408, 413 i 429 i mapujemy je na kod odpowiedzi SMTP 421.

W przeciwnym razie, jeśli odbiorcą jest adres e-mail, spróbujemy wysłać wiadomość z oportunistycznym protokołem TLS (próbujemy użyć protokołu STARTTLS, jeśli jest dostępny na serwerze pocztowym odbiorcy). Jeśli podczas próby wysłania wiadomości wystąpi błąd SSL/TLS, spróbujemy wysłać wiadomość bez protokołu TLS (bez użycia protokołu STARTTLS).

Jeśli wystąpią jakiekolwiek błędy DNS lub połączenia, wówczas polecenie `DATA` zwróci kod odpowiedzi SMTP równy 421. W przeciwnym razie, jeśli wystąpią błędy na poziomie >= 500, zostaną wysłane powiadomienia zwrotne.

Jeśli wykryjemy, że serwer poczty e-mail, do którego próbujemy dostarczyć wiadomość, ma zablokowany jeden lub więcej adresów IP naszej poczty (np. przez technologię, której używa do odrzucania spamerów), wyślemy nadawcy kod odpowiedzi SMTP 421, aby mógł on spróbować wysłać wiadomość później (zostaniemy powiadomieni o problemie, co pozwoli nam go rozwiązać przed kolejną próbą).

### Jak sobie radzisz z blokowaniem adresów IP {#how-do-you-handle-your-ip-addresses-becoming-blocked}

Rutynowo monitorujemy wszystkie główne listy blokowanych serwerów DNS i jeśli którykolwiek z naszych adresów IP wymiany poczty („MX”) znajdzie się na głównej liście blokowanych serwerów DNS, usuniemy go, jeśli to możliwe, z odpowiedniej rundy sprawdzania rekordów DNS A, aż do momentu rozwiązania problemu.

W chwili pisania tego tekstu jesteśmy również wymienieni na kilku listach dozwolonych DNS i poważnie traktujemy listy blokowania monitorowania. Jeśli zauważysz jakiekolwiek problemy, zanim zdążymy je rozwiązać, prosimy o kontakt pisemny na adres <support@forwardemail.net>.

Nasze adresy IP są publicznie dostępne, [zobacz tę sekcję poniżej, aby uzyskać więcej informacji](#what-are-your-servers-ip-addresses).

### Co to są adresy naczelników poczty {#what-are-postmaster-addresses}

Aby zapobiec błędnym odrzuceniom wiadomości i wysyłaniu wiadomości z informacją o nieobecności do niemonitorowanych lub nieistniejących skrzynek pocztowych, utrzymujemy listę nazw użytkowników przypominających demony pocztowe:

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
* [i każdy adres, na który nie ma odpowiedzi](#what-are-no-reply-addresses)

Więcej informacji na temat tego, jak listy takie służą do tworzenia wydajnych systemów poczty e-mail, można znaleźć w dokumencie [RFC 5320 Sekcja 4.6](https://datatracker.ietf.org/doc/html/rfc5230#section-4.6).

### Co to są adresy bez odpowiedzi {#what-are-no-reply-addresses}

Nazwy użytkowników poczty e-mail zawierające którykolwiek z poniższych znaków (bez uwzględniania wielkości liter) są uznawane za adresy, na które nie można wysyłać odpowiedzi:

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

Ta lista jest utrzymywana jako [jako projekt typu open source na GitHub](https://github.com/forwardemail/reserved-email-addresses-list).

### Jakie są adresy IP Twojego serwera {#what-are-your-servers-ip-addresses}

Nasze adresy IP publikujemy pod adresem <https://forwardemail.net/ips>.

### Czy masz listę dozwolonych adresów {#do-you-have-an-allowlist}?

Tak, mamy [lista rozszerzeń nazw domen](#what-domain-name-extensions-are-allowlisted-by-default), które domyślnie znajdują się na liście dozwolonych, a także dynamiczną, buforowaną i toczącą się listę dozwolonych opartą na [surowe kryteria](#what-is-your-allowlist-criteria).

Wszystkie adresy e-mail, domeny i odbiorcy pochodzący od klientów korzystających z planów płatnych są automatycznie dodawane do naszej listy dozwolonych.

### Jakie rozszerzenia nazw domen są domyślnie umieszczane na liście dozwolonych adresów: {#what-domain-name-extensions-are-allowlisted-by-default}

Następujące rozszerzenia nazw domen są domyślnie uznawane za umieszczone na liście dozwolonych (niezależnie od tego, czy znajdują się na liście popularności Umbrella, czy nie):

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
<li class="list-inline-item"><code class="notranslate">zdrowie.nz</code></li>
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

Ponadto te [domeny najwyższego poziomu marek i korporacji](https://en.wikipedia.org/wiki/List_of_Internet_top-level_domains#Brand_and_corporate_top-level_domains) są domyślnie umieszczone na liście dozwolonych (np. `apple` dla `applecard.apple` w przypadku wyciągów bankowych z karty Apple Card):

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
<li class="list-inline-item"><code class="notranslate">Airbus</code></li>
<li class="list-inline-item"><code class="notranslate">Airtel</code></li>
<li class="list-inline-item"><code class="notranslate">Akdn</code></li>
<li class="list-inline-item"><code class="notranslate">Alfaromeo</code></li>
<li class="list-inline-item"><code class="notranslate">Alibaba</code></li>
<li class="list-inline-item"><code class="notranslate">Alipay</code></li>
<li class="list-inline-item"><code class="notranslate">Allfinanz</code></li>
<li class="list-inline-item"><code class="notranslate">Allstate</code></li>
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
<li class="list-inline-item"><code class="notranslate">koszykówka</code></li>
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
<li class="list-inline-item"><code class="notranslate">rezerwacja</code></li>
<li class="list-inline-item"><code class="notranslate">bosch</code></li>
<li class="list-inline-item"><code class="notranslate">bostik</code></li>
<li class="list-inline-item"><code class="notranslate">bradesco</code></li>
<li class="list-inline-item"><code class="notranslate">bridgestone</code></li>
<li class="list-inline-item"><code class="notranslate">brother</code></li>
<li class="list-inline-item"><code class="notranslate">bugatti</code></li>
<li class="list-inline-item"><code class="notranslate">cal</code></li>
<li class="list-inline-item"><code class="notranslate">calvinklein</code></li>
<li class="list-inline-item"><code class="notranslate">kanon</code></li>
<li class="list-inline-item"><code class="notranslate">kanon</code></li>
<li class="list-inline-item"><code class="notranslate">przyczepa kempingowa</code></li>
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
<li class="list-inline-item"><code class="notranslate">korona</code></li>
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
<li class="list-inline-item"><code class="notranslate">Eurowizja</code></li>
<li class="list-inline-item"><code class="notranslate">everbank</code></li>
<li class="list-inline-item"><code class="notranslate">ekstraspace</code></li>
<li class="list-inline-item"><code class="notranslate">fage</code></li>
<li class="list-inline-item"><code class="notranslate">sprzyjające wiatry</code></li>
<li class="list-inline-item"><code class="notranslate">rolnicy</code></li>
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
<li class="list-inline-item"><code class="notranslate">darowanie</code></li>
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
<li class="list-inline-item"><code class="notranslate">Kerryhotels</code></li>
<li class="list-inline-item"><code class="notranslate">Kerrylogistics</code></li>
<li class="list-inline-item"><code class="notranslate">Kerryproperties</code></li>
<li class="list-inline-item"><code class="notranslate">Kfh</code></li>
<li class="list-inline-item"><code class="notranslate">KiA</code></li>
<li class="list-inline-item"><code class="notranslate">Kindle</code></li>
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
<li class="list-inline-item"><code class="notranslate">łącznik</code></li>
<li class="list-inline-item"><code class="notranslate">lexus</code></li>
<li class="list-inline-item"><code class="notranslate">lidl</code></li>
<li class="list-inline-item"><code class="notranslate">styl życia</code></li>
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
<li class="list-inline-item"><code class="notranslate">łubin</code></li>
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
<li class="list-inline-item"><code class="notranslate">wzajemne</code></li>
<li class="list-inline-item"><code class="notranslate">nadex</code></li>
<li class="list-inline-item"><code class="notranslate">ogólnopolski</code></li>
<li class="list-inline-item"><code class="notranslate">natura</code></ li>
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
<li class="list-inline-item"><code class="notranslate">biuro</code></li>
<li class="list-inline-item"><code class="notranslate">omega</code></li>
<li class="list-inline-item"><code class="notranslate">oracle</code></li>
<li class="list-inline-item"><code class="notranslate">pomarańczowy</code></li>
<li class="list-inline-item"><code class="notranslate">otsuka</code></li>
<!--<li class="list-inline-item"><code class="notranslate">ovh</code></li>-->
<li class="list-inline-item"><code class="notranslate">panasonic</code></li>
<li class="list-inline-item"><code class="notranslate">pccw</code></li>
<li class="list-inline-item"><code class="notranslate">pfizer</code></li>
<li class="list-inline-item"><code class="notranslate">philips</code></li>
<li class="list-inline-item"><code class="notranslate">piaget</code></li>
<li class="list-inline-item"><code class="notranslate">pictet</code></li>
<li class="list-inline-item"><code class="notranslate">ping</code></li>
<li class="list-inline-item"><code class="notranslate">pionier</code></li>
<li class="list-inline-item"><code class="notranslate">play</code></li>
<li class="list-inline-item"><code class="notranslate">playstation</code></li>
<li class="list-inline-item"><code class="notranslate">pohl</code></li>
<li class="list-inline-item"><code class="notranslate">polityka</code></li>
<li class="list-inline-item"><code class="notranslate">praktyka</code></li>
<li class="list-inline-item"><code class="notranslate">produkcja</code></li>
<li class="list-inline-item"><code class="notranslate">progresywny</code></li>
<li class="list-inline-item"><code class="notranslate">prudential</code></li>
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
<li class="list-inline-item"><code class="notranslate">bezpieczeństwo</code></li>
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
<li class="list-inline-item"><code class="notranslate">siedzenie</code></li>
<li class="list-inline-item"><code class="notranslate">siedzenie</code></li>
<li class="list-inline-item"><code class="notranslate">siedzenie</code></li>
<li class="list-inline-item"><code class="notranslate">szycie</code></li>
<li class="list-inline-item"><code class="notranslate">siedem</code></li>
<li class="list-inline-item"><code class="notranslate">sfr</code></li>
<li class="list-inline-item"><code class="notranslate">szukanie</code></li>
<li class="list-inline-item"><code class="notranslate">shangrila</code></li>
<li class="list-inline-item"><code class="notranslate">ostry</code></li>
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
<li class="list-inline-item"><code class="notranslate">razem</code></li>
<li class="list-inline-item"><code class="notranslate">toyota</code></li>
<li class="list-inline-item"><code class="notranslate">travelchannel</code></li>
<li class="list-inline-item"><code class="notranslate">podróżni</code></li>
<li class="list-inline-item"><code class="notranslate">tui</code></li>
<li class="list-inline-item"><code class="notranslate">telewizory</code></li>
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

Od 18 marca 2025 r. dodaliśmy do tej listy również następujące francuskie terytoria zamorskie ([zgodnie z tą prośbą GitHub](https://github.com/forwardemail/forwardemail.net/issues/327)):

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

Od 8 lipca 2025 r. dodaliśmy następujące kraje europejskie:

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

Celowo nie uwzględniliśmy `cz`, `ru` i `ua` ze względu na dużą aktywność spamu.

### Jakie są kryteria listy dozwolonych {#what-is-your-allowlist-criteria}

Mamy statyczną listę [rozszerzenia nazw domen domyślnie umieszczone na liście dozwolonych](#what-domain-name-extensions-are-allowlisted-by-default) – a także utrzymujemy dynamiczną, buforowaną, aktualizowaną listę dozwolonych na podstawie następujących rygorystycznych kryteriów:

* Domena główna nadawcy musi być [rozszerzenie nazwy domeny zgodne z listą, którą oferujemy w naszym darmowym planie](#what-domain-name-extensions-can-be-used-for-free) (z dodatkiem `biz` i `info`). Uwzględniamy również częściowe dopasowania `edu`, `gov` i `mil`, takie jak `xyz.gov.au` i `xyz.edu.au`.
* Domena główna nadawcy musi znajdować się wśród 100 000 najlepszych wyników analizy unikalnych domen głównych z [Lista popularności parasoli](http://s3-us-west-1.amazonaws.com/umbrella-static/index.html "Umbrella Popularity List") („UPL”).
* Domena główna nadawcy musi znajdować się w czołówce 50 000 wyników z unikalnych domen głównych pojawiających się w co najmniej 4 z ostatnich 7 dni w UPL (\~50%+).
* Domena główna nadawcy nie może być oznaczona [skategoryzowany](https://radar.cloudflare.com/categorization-feedback/) jako treść dla dorosłych lub złośliwe oprogramowanie przez Cloudflare.
* Domena główna nadawcy musi mieć ustawiony rekord A lub MX.
* Domena główna nadawcy musi mieć rekord(y) A, rekord(y) MX, rekord DMARC z kwalifikatorem `p=reject` lub `p=quarantine` albo rekord SPF z kwalifikatorem `-all` lub `~all`.

Jeśli to kryterium zostanie spełnione, domena główna nadawcy będzie buforowana przez 7 dni. Należy pamiętać, że nasze zadanie automatyczne jest uruchamiane codziennie – dlatego jest to bufor listy dozwolonych, który jest aktualizowany codziennie.

Nasze automatyczne zadanie pobierze zapisane w pamięci pliki UPL z ostatnich 7 dni, rozpakuje je, a następnie przeanalizuje pamięć zgodnie ze ścisłymi kryteriami podanymi powyżej.

Oczywiście uwzględniono domeny popularne w chwili pisania tego tekstu, takie jak Google, Yahoo, Microsoft, Amazon, Meta, Twitter, Netflix, Spotify i wiele innych.

Jeśli jesteś nadawcą spoza naszej listy dozwolonych, to gdy Twoja domena główna FQDN lub adres IP po raz pierwszy wyśle wiadomość e-mail, zostaniesz oznaczony jako [ograniczona stawka](#do-you-have-rate-limiting) i [na szarej liście](#do-you-have-a-greylist). Należy pamiętać, że jest to standardowa praktyka przyjęta w e-mailach. Większość klientów serwerów pocztowych podejmie próbę ponownego wysłania wiadomości, jeśli wystąpi błąd limitu przepustowości lub błąd szarej listy (np. kod błędu 421 lub 4xx).

**Należy pamiętać, że konkretni nadawcy, tacy jak `a@gmail.com`, `b@xyz.edu` i `c@gov.au` nadal mogą być objęci ochroną [odrzucony](#do-you-have-a-denylist)** (np. jeśli automatycznie wykryjemy spam, phishing lub złośliwe oprogramowanie od tych nadawców).

### Jakie rozszerzenia nazw domen można używać bezpłatnie {#what-domain-name-extensions-can-be-used-for-free}

Od 31 marca 2023 r. wprowadziliśmy nową, ogólną zasadę dotyczącą spamu, aby chronić naszych użytkowników i usługi.

Nowa zasada zezwala na używanie w ramach naszego bezpłatnego planu wyłącznie następujących rozszerzeń nazw domen:

<ul class="list-inline">
<li class="list-inline-item"><code class="notranslate">ac</code></li>
<li class="list-inline-item"><code class="notranslate">ad</code></li>
<li class="list-inline-item"><code class="notranslate">ag</code></li>
<li class="list-inline-item"><code class="notranslate">ai</code></li>
<li class="list-inline-item"><code class="notranslate">al</code></li>
<li class="list-inline-item"><code class="notranslate">am</code></li>
<li class="list-inline-item"><code class="notranslate">app</code></li>
<li class="list-inline-item"><code class="notranslate">jak</code></li>
<li class="list-inline-item"><code class="notranslate">w</code></li>
<li class="list-inline-item"><code class="notranslate">au</code></li>
<li class="list-inline-item"><code class="notranslate">ba</code></li>
<li class="list-inline-item"><code class="notranslate">być</code></li>
<li class="list-inline-item"><code class="notranslate">br</code></li>
<li class="list-inline-item"><code class="notranslate">przez</code></li>
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
<li class="list-inline-item"><code class="notranslate">rodzina</code></li>
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
<li class="list-inline-item"><code class="notranslate">it</code></li>
<li class="list-inline-item"><code class="notranslate">je</code></li>
<li class="list-inline-item"><code class="notranslate">jp</code></li>
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
<li class="list-inline-item"><code class="notranslate">no</code></li>
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
<li class="list-inline-item"><code class="notranslate">to</code></li>
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

### Czy masz szarą listę {#do-you-have-a-greylist}

Tak, stosujemy bardzo luźną politykę [szara lista e-maili](https://en.wikipedia.org/wiki/Greylisting_\(email\)). Szara lista dotyczy tylko nadawców spoza naszej listy dozwolonych i jest przechowywana w pamięci podręcznej przez 30 dni.

Dla każdego nowego nadawcy przechowujemy klucz w naszej bazie danych Redis przez 30 dni, którego wartość jest ustawiona na początkowy czas nadejścia pierwszego żądania. Następnie odrzucamy jego wiadomość e-mail z kodem statusu ponownej próby 450 i zezwalamy na jej przesłanie dopiero po upływie 5 minut.

Jeśli odczekali pomyślnie 5 minut od początkowego czasu przybycia, ich wiadomości e-mail zostaną zaakceptowane i nie otrzymają kodu statusu 450.

Klucz składa się z domeny głównej FQDN lub adresu IP nadawcy. Oznacza to, że każda subdomena, która przejdzie przez szarą listę, będzie również uznawana za domenę główną i odwrotnie (to właśnie rozumiemy przez „bardzo luźną” politykę).

Na przykład, jeśli wiadomość e-mail pochodzi z adresu `test.example.com`, zanim zobaczymy wiadomość pochodzącą z adresu `example.com`, to każda wiadomość e-mail z adresu `test.example.com` i/lub `example.com` będzie musiała odczekać 5 minut od momentu nawiązania połączenia. Nie powodujemy, aby wiadomości `test.example.com` i `example.com` odczekiwały osobno 5 minut (nasza polityka szarej listy obowiązuje na poziomie domeny głównej).

Należy pamiętać, że umieszczenie na szarej liście nie dotyczy żadnego nadawcy w domenie [lista dozwolonych](#do-you-have-an-allowlist) (np. Meta, Amazon, Netflix, Google, Microsoft w chwili pisania tego tekstu).

### Czy masz listę zablokowanych {#do-you-have-a-denylist}

Tak, prowadzimy własną listę blokowanych adresów e-mail i aktualizujemy ją automatycznie w czasie rzeczywistym oraz ręcznie na podstawie wykrytego spamu i szkodliwej aktywności.

Co godzinę pobieramy również wszystkie adresy IP z listy zablokowanych adresów UCEPROTECT poziomu 1 pod adresem <http://wget-mirrors.uceprotect.net/rbldnsd-all/dnsbl-1.uceprotect.net.gz> i umieszczamy je na naszej liście zablokowanych adresów z 7-dniowym okresem ważności.

Nadawcy znajdujący się na liście zablokowanych otrzymają kod błędu 421 (pozwalający nadawcy spróbować ponownie później), jeśli [nie są na liście dozwolonych](#do-you-have-an-allowlist).

Dzięki użyciu kodu stanu 421 zamiast kodu stanu 554 możliwe jest ograniczenie potencjalnych fałszywych alarmów w czasie rzeczywistym, dzięki czemu wiadomość może zostać pomyślnie dostarczona przy kolejnej próbie.

**To rozwiązanie zostało zaprojektowane w przeciwieństwie do innych usług pocztowych**, gdzie umieszczenie na czarnej liście powoduje trwałą i poważną awarię. Często trudno jest poprosić nadawców o ponowienie próby wysłania wiadomości (zwłaszcza od dużych organizacji), dlatego takie podejście daje około 5 dni od pierwszej próby wysłania wiadomości e-mail nadawcy, odbiorcy lub nam na interwencję i rozwiązanie problemu (poprzez żądanie usunięcia z listy zablokowanych).

Wszystkie prośby o usunięcie z listy zabronionych są monitorowane na bieżąco przez administratorów (np. w celu umożliwienia administratorom trwałego umieszczenia powtarzających się fałszywych alarmów na liście dozwolonych).

Prośby o usunięcie z listy zabronionych można składać pod adresem <https://forwardemail.net/denylist>. Prośby użytkowników płacących o usunięcie z listy zabronionych są przetwarzane natychmiastowo, natomiast użytkownicy niepłacący muszą czekać na przetworzenie ich prośby przez administratorów.

Nadawcy, u których wykryto wysyłanie spamu lub wirusów, zostaną dodani do listy zablokowanych w następujący sposób:

1. Wiadomość [początkowy odcisk wiadomości](#how-do-you-determine-an-email-fingerprint) jest umieszczana na szarej liście po wykryciu spamu lub na liście blokowanych od „zaufanego” nadawcy (np. `gmail.com`, `microsoft.com`, `apple.com`).
* Jeśli nadawca znajduje się na liście dozwolonych, wiadomość jest umieszczana na szarej liście przez 1 godzinę.
* Jeśli nadawca nie znajduje się na liście dozwolonych, wiadomość jest umieszczana na szarej liście przez 6 godzin.
2. Analizujemy klucze listy blokowanych na podstawie informacji od nadawcy i wiadomości, a dla każdego z tych kluczy tworzymy (jeśli jeszcze nie istnieje) licznik, zwiększamy go o 1 i przechowujemy w pamięci podręcznej przez 24 godziny.
* Dla nadawców z listy dozwolonych:
* Dodaj klucz dla adresu e-mail „MAIL FROM” w kopercie, jeśli miał on pozytywny lub negatywny SPF i nie był [nazwa użytkownika postmastera](#what-are-postmaster-addresses) ani [nazwa użytkownika bez odpowiedzi](#what-are-no-reply-addresses).
* Jeśli nagłówek „From” znajdował się na liście dozwolonych, dodaj klucz dla adresu e-mail w nagłówku „From”, jeśli miał on pozytywny SPF lub zgodny i zgodny DKIM.
* Jeśli nagłówek „From” nie znajdował się na liście dozwolonych, dodaj klucz dla adresu e-mail w nagłówku „From” i jego głównej nazwy domeny po analizie składniowej.
* Dla nadawców spoza listy dozwolonych:
* Dodaj klucz dla adresu e-mail „MAIL FROM” w kopercie, jeśli miał on pozytywny SPF.
* Jeśli nagłówek „From” znajdował się na liście dozwolonych, dodaj klucz dla adresu e-mail w nagłówku „From”, jeśli miał on pozytywny SPF lub zgodny i zgodny DKIM. * Jeśli nagłówek „Od” nie znajduje się na liście dozwolonych, dodaj klucz dla adresu e-mail w nagłówku „Od” i jego głównej nazwy domeny.
* Dodaj klucz dla zdalnego adresu IP nadawcy.
* Dodaj klucz dla nazwy hosta klienta rozpoznanej metodą odwrotnego wyszukiwania z adresu IP nadawcy (jeśli istnieje).
* Dodaj klucz dla domeny głównej rozpoznanej nazwy hosta klienta (jeśli istnieje i jeśli różni się ona od rozpoznanej nazwy hosta klienta).
3. Jeśli licznik osiągnie 5 dla nadawcy i klucza spoza listy dozwolonych, klucz zostanie zablokowany na 30 dni, a do naszego zespołu ds. nadużyć zostanie wysłana wiadomość e-mail. Liczby te mogą ulec zmianie, a aktualizacje będą uwzględniane tutaj w miarę monitorowania nadużyć.
4. Jeśli licznik osiągnie 10 dla nadawcy i klucza z listy dozwolonych, klucz zostanie zablokowany na 7 dni, a do naszego zespołu ds. nadużyć zostanie wysłana wiadomość e-mail. Liczby te mogą ulec zmianie, a aktualizacje będą uwzględniane tutaj w miarę monitorowania nadużyć.

> **UWAGA:** W najbliższej przyszłości wprowadzimy monitorowanie reputacji. Monitorowanie reputacji będzie zamiast tego obliczać moment odrzucenia nadawcy na podstawie progu procentowego (w przeciwieństwie do prostego licznika, o którym mowa powyżej).

### Czy masz ograniczenie przepustowości {#do-you-have-rate-limiting}

Ograniczanie przepustowości nadawcy odbywa się albo poprzez domenę główną analizowaną w odwrotnym wyszukiwaniu PTR adresu IP nadawcy – albo, jeśli to nie daje rezultatu, po prostu wykorzystuje adres IP nadawcy. Należy pamiętać, że poniżej nazywamy to `Sender`.

Nasze serwery MX mają dzienne limity dla poczty przychodzącej odbieranej dla [szyfrowane przechowywanie IMAP](/blog/docs/best-quantum-safe-encrypted-email-service):

* Zamiast ograniczać przepustowość poczty przychodzącej odbieranej na podstawie pojedynczego aliasu (np. `you@yourdomain.com`) – ograniczamy przepustowość na podstawie nazwy domeny aliasu (np. `yourdomain.com`). Zapobiega to jednoczesnemu zalewaniu skrzynek odbiorczych wszystkich aliasów w domenie przez `Senders`. * Mamy ogólne limity, które dotyczą wszystkich kodów `Senders` w ramach naszej usługi, niezależnie od odbiorcy:
* Kody `Senders`, które uważamy za „godne zaufania” jako źródło informacji (np. `gmail.com`, `microsoft.com`, `apple.com`), są ograniczone do wysyłania 100 GB dziennie.
* Kody `Senders`, które są [na liście dozwolonych](#do-you-have-an-allowlist), są ograniczone do wysyłania 10 GB dziennie.
* Wszystkie pozostałe kody `Senders` są ograniczone do wysyłania 1 GB i/lub 1000 wiadomości dziennie.
* Mamy konkretny limit na `Sender` i `yourdomain.com` wynoszący 1 GB i/lub 1000 wiadomości dziennie.

Serwery MX ograniczają również wiadomości przesyłane dalej do jednego lub większej liczby odbiorców za pomocą limitowania przepustowości – dotyczy to jednak tylko `Senders`, a nie [lista dozwolonych](#do-you-have-an-allowlist):

* Dopuszczamy maksymalnie 100 połączeń na godzinę, na każdą rozpoznaną domenę główną FQDN `Sender` (lub) zdalny adres IP `Sender` (jeśli odwrotny PTR jest niedostępny) i na każdego odbiorcę w kopercie. Klucz do limitowania przepustowości przechowujemy jako kryptograficzny skrót w naszej bazie danych Redis.

* Jeśli wysyłasz wiadomości e-mail za pośrednictwem naszego systemu, upewnij się, że masz skonfigurowany odwrotny PTR dla wszystkich adresów IP (w przeciwnym razie każda unikatowa domena główna FQDN lub adres IP, z którego wysyłasz wiadomości, będzie podlegać ograniczeniom przepustowości).

* Należy pamiętać, że jeśli wysyłasz wiadomości za pośrednictwem popularnego systemu, takiego jak Amazon SES, nie będą Cię obowiązywać żadne ograniczenia prędkości, ponieważ (w momencie pisania tego tekstu) Amazon SES znajduje się na naszej liście dozwolonych.

* Jeśli wysyłasz z domeny takiej jak `test.abc.123.example.com`, limit przepustowości zostanie nałożony na `example.com`. Wielu spamerów używa setek subdomen, aby obejść popularne filtry spamu, które ograniczają przepustowość tylko dla unikalnych nazw hostów, a nie dla unikalnych domen głównych FQDN.

* `Senders` przekraczające limit szybkości zostaną odrzucone z błędem 421.

Nasze serwery IMAP i SMTP ograniczają liczbę równoczesnych połączeń Twoich aliasów do `60`.

Nasze serwery MX ograniczają nadawcom [nie znajduje się na liście dozwolonych](#do-you-have-an-allowlist) możliwość nawiązywania więcej niż 10 równoczesnych połączeń (z 3-minutowym wygaśnięciem pamięci podręcznej licznika, co odzwierciedla nasz 3-minutowy limit czasu gniazda).

### Jak zabezpieczyć się przed rozpraszaniem wstecznym {#how-do-you-protect-against-backscatter}

Błędnie skierowane wiadomości zwrotne lub spam zwrotny (znany jako „[Rozproszenie wsteczne](https://en.wikipedia.org/wiki/Backscatter_\(email\))”) mogą spowodować negatywną reputację adresów IP nadawcy.

Podejmujemy dwa kroki w celu ochrony przed rozpraszaniem wstecznym, które zostały szczegółowo opisane w sekcjach [Zapobiegaj odrzuceniom od znanych spamerów MAIL FROM](#prevent-bounces-from-known-mail-from-spammers) i [Zapobiegaj niepotrzebnym odbiciom, aby chronić się przed rozproszeniem wstecznym](#prevent-unnecessary-bounces-to-protect-against-backscatter) poniżej.

### Zapobiegaj odrzuceniom wiadomości od znanych spamerów MAIL FROM {#prevent-bounces-from-known-mail-from-spammers}

Co godzinę pobieramy listę z [Backscatter.org](https://www.backscatterer.org/) (obsługiwaną przez [UCEPROTECT](https://www.uceprotect.net/)) pod adresem <http://wget-mirrors.uceprotect.net/rbldnsd-all/ips.backscatterer.org.gz> i wprowadzamy ją do naszej bazy danych Redis (porównujemy też różnice z wyprzedzeniem, na wypadek gdyby usunięto jakiekolwiek adresy IP, które powinny zostać uwzględnione).

Jeśli pole MAIL FROM jest puste LUB jest równe (bez uwzględniania wielkości liter) dowolnemu z elementów [adresy naczelników poczty](#what-are-postmaster-addresses) (część znajdująca się przed znakiem @ w wiadomości e-mail), sprawdzamy, czy adres IP nadawcy pasuje do jednego z tych na tej liście.

Jeśli adres IP nadawcy znajduje się na liście (i nie ma go w naszym [lista dozwolonych](#do-you-have-an-allowlist)), wysyłamy błąd 554 z komunikatem `The IP ${session.remoteAddress} is blocked by https://www.backscatterer.org/index.php?target=test&ip=${session.remoteAddress}`. Otrzymamy powiadomienie, jeśli nadawca znajduje się zarówno na liście backscattererów, jak i na naszej liście dozwolonych, aby w razie potrzeby móc rozwiązać problem.

Techniki opisane w tej sekcji są zgodne z zaleceniem „TRYBU BEZPIECZNEGO” w punkcie <https://www.backscatterer.org/?target=usage>, w którym adres IP nadawcy jest sprawdzany tylko wtedy, gdy spełnione są określone warunki.

### Zapobiegaj niepotrzebnym odbiciom, aby chronić się przed rozproszeniem wstecznym {#prevent-unnecessary-bounces-to-protect-against-backscatter}

Zwroty to wiadomości e-mail oznaczające, że przekazanie wiadomości e-mail do odbiorcy nie powiodło się i wiadomość nie zostanie ponowiona.

Częstą przyczyną znalezienia się na liście Backscatterer są błędnie skierowane wiadomości zwrotne lub spam zwrotny, dlatego musimy się przed tym zabezpieczyć na kilka sposobów:

1. Wysyłamy wiadomości tylko wtedy, gdy wystąpią błędy o kodzie statusu >= 500 (gdy próba przekazania wiadomości e-mail zakończyła się niepowodzeniem, np. gdy Gmail odpowiada błędem poziomu 500).

2. Wysyłamy tylko raz i tylko raz (używamy obliczonego klucza odcisku zwrotnego i przechowujemy go w pamięci podręcznej, aby zapobiec wysyłaniu duplikatów). Odcisk zwrotny to klucz, który jest odciskiem wiadomości połączonym z hashem adresu zwrotnego i jego kodem błędu. Więcej informacji na temat obliczania odcisku zwrotnego wiadomości można znaleźć w sekcji [Pobieranie odcisków palców](#how-do-you-determine-an-email-fingerprint). Pomyślnie wysłane odciski zwrotne wiadomości wygasają po 7 dniach w pamięci podręcznej Redis.

3. Wysyłamy wiadomości tylko wtedy, gdy pola MAIL FROM i/lub From nie są puste i nie zawierają (bez względu na wielkość liter) znaku [nazwa użytkownika postmastera](#what-are-postmaster-addresses) (fragmentu znajdującego się przed znakiem @ w wiadomości e-mail).

4. Nie wysyłamy wiadomości, jeśli oryginalna wiadomość zawierała którykolwiek z poniższych nagłówków (bez względu na wielkość liter):

* Nagłówek `auto-submitted` o wartości innej niż `no`.
* Nagłówek kodu `x-auto-response-suppress` o wartości `dr`, `autoreply`, `auto-reply`, `auto_reply` lub `all`
* Nagłówek kodu `list-id`, `list-subscribe`, `list-unsubscribe`, `list-help`, `list-post`, `list-owner`, `list-archive`, `x-autoreply`, `x-autorespond` lub `x-auto-respond` (niezależnie od wartości).
* Nagłówek kodu `precedence` o wartości `bulk`, `autoreply`, `auto-reply`, `auto_reply` lub `list`.

5. Nie wysyłamy wiadomości, jeśli adres e-mail MAIL FROM lub From kończy się na `+donotreply`, `-donotreply`, `+noreply` lub `-noreply`.

6. Nie wysyłamy wiadomości, jeśli część nazwy użytkownika w adresie e-mail „Od” to `mdaemon` i ma ona nagłówek bez uwzględniania wielkości liter `X-MDDSN-Message`.

7. Nie wysyłamy, jeśli w nagłówku `multipart/report` znajduje się nagłówek `content-type` bez uwzględniania wielkości liter.

### Jak ustalić odcisk palca adresu e-mail {#how-do-you-determine-an-email-fingerprint}

Odcisk palca wiadomości e-mail służy do określania unikalności wiadomości i zapobiegania dostarczaniu duplikatów wiadomości oraz wysyłaniu [duplikaty odbić](#prevent-unnecessary-bounces-to-protect-against-backscatter).

Odcisk palca obliczany jest na podstawie następującej listy:

* Nazwa hosta FQDN lub adres IP rozwiązany przez klienta
* `Message-ID` wartość nagłówka (jeśli istnieje)
* `Date` wartość nagłówka (jeśli istnieje)
* `From` wartość nagłówka (jeśli istnieje)
* `To` wartość nagłówka (jeśli istnieje)
* `Cc` wartość nagłówka (jeśli istnieje)
* `Subject` wartość nagłówka (jeśli istnieje)
* `Body` wartość (jeśli istnieje)

### Czy mogę przekierowywać wiadomości e-mail na porty inne niż 25 (np. jeśli mój dostawca usług internetowych zablokował port 25)? {#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25}

Tak, od 5 maja 2020 roku dodaliśmy tę funkcję. Obecnie jest ona specyficzna dla domeny, a nie dla aliasu. Jeśli potrzebujesz, aby była specyficzna dla aliasu, skontaktuj się z nami i poinformuj nas o swoich potrzebach.

<div class="alert my-3 alert-danger">
<i class="fa fa-stop-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Zaawansowana ochrona prywatności:
</strong>
<span>
Jeśli korzystasz z planu płatnego (który oferuje zaawansowaną ochronę prywatności), przejdź do <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Mojego konta <i class="fa fa-angle-right"></i>Domeny</a>, kliknij „Konfiguracja” obok swojej domeny, a następnie „Ustawienia”. Aby dowiedzieć się więcej o planach płatnych, zapoznaj się z naszą stroną <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Cennik</a>. Możesz również postępować zgodnie z poniższymi instrukcjami.
</span>
</div>

Jeśli masz darmowy plan, po prostu dodaj nowy rekord DNS <strong class="notranslate">TXT</strong>, jak pokazano poniżej, ale zmień port z 25 na port wybrany przez siebie.

Na przykład, jeśli chcę, aby wszystkie wiadomości e-mail kierowane na adres `example.com` były przekierowywane na port SMTP aliasu odbiorcy o numerze 1337 zamiast 25:

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
<td><em>"@", "." lub puste</em></td>
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
Najczęstszym scenariuszem konfiguracji niestandardowego przekierowania portów jest sytuacja, gdy chcesz przekierować wszystkie wiadomości e-mail kierowane do example.com na inny port w example.com, inny niż standardowy port SMTP 25. Aby to skonfigurować, wystarczy dodać następujący rekord <strong class="notranslate">TXT</strong> catch-all.
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
<td><em>"@", "." lub puste</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=example.com</code></td>
</tr>
</tbody>
</table>

### Czy obsługuje symbol plus + dla aliasów Gmaila {#does-it-support-the-plus--symbol-for-gmail-aliases}

Tak, oczywiście.

### Czy obsługuje subdomeny {#does-it-support-sub-domains}

Tak, zdecydowanie. Zamiast używać znaku „@”, „.” lub pustego pola jako nazwy/hosta/aliasu, po prostu użyj nazwy subdomeny jako wartości.

Jeśli chcesz, aby kod `foo.example.com` przekazywał wiadomości e-mail, wprowadź `foo` jako wartość nazwy/hosta/aliasu w ustawieniach DNS (zarówno dla rekordów MX, jak i <strong class="notranslate">TXT</strong>).

### Czy to przekazuje nagłówki mojej wiadomości e-mail {#does-this-forward-my-emails-headers}

Tak, oczywiście.

### Czy to dobrze przetestowany {#is-this-well-tested}

Tak, ma testy napisane przy użyciu [ava](https://github.com/avajs/ava) i ma także pokrycie kodu.

### Czy przekazujesz wiadomości i kody odpowiedzi SMTP {#do-you-pass-along-smtp-response-messages-and-codes}

Tak, absolutnie. Na przykład, jeśli wysyłasz wiadomość e-mail na adres `hello@example.com` i jest ona zarejestrowana do przekierowania na adres `user@gmail.com`, to zamiast serwera proxy „mx1.forwardemail.net” lub „mx2.forwardemail.net” zostanie zwrócona odpowiedź SMTP i kod z serwera SMTP „gmail.com”.

### Jak zapobiegać spamowi i zapewnić dobrą reputację w zakresie przekazywania wiadomości e-mail {#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation}

Zobacz nasze sekcje [Jak działa Twój system przekazywania poczty e-mail](#how-does-your-email-forwarding-system-work), [Jak radzisz sobie z problemami z dostarczaniem wiadomości e-mail?](#how-do-you-handle-email-delivery-issues) i [Jak sobie radzisz z blokowaniem adresów IP?](#how-do-you-handle-your-ip-addresses-becoming-blocked) powyżej.

### Jak przeprowadzać wyszukiwania DNS w nazwach domen {#how-do-you-perform-dns-lookups-on-domain-names}

Stworzyliśmy projekt oprogramowania open source :tangerine: [Mandarynka](https://github.com/forwardemail/tangerine) i używamy go do wyszukiwań DNS. Domyślnie używane serwery DNS to `1.1.1.1` i `1.0.0.1`, a zapytania DNS są przesyłane przez [DNS przez HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) („DoH”) na poziomie aplikacji.

:tangerine: [Mandarynka](https://github.com/tangerine) domyślnie korzysta z [prywatnej usługi DNS dla konsumentów CloudFlare][cloudflare-dns].

## Konto i rozliczenia {#account-and-billing}

### Czy oferujecie gwarancję zwrotu pieniędzy w przypadku planów płatnych {#do-you-offer-a-money-back-guarantee-on-paid-plans}

Tak! Zwroty kosztów następują automatycznie po zmianie planu na wyższy, niższy lub anulowaniu konta w ciągu 30 dni od daty rozpoczęcia planu. Dotyczy to tylko nowych klientów.

### Czy w przypadku zmiany planu doliczacie proporcjonalnie i zwracacie różnicę? {#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference}

Nie dokonujemy proporcjonalnego rozliczenia ani zwrotu różnicy, gdy zmieniasz plany. Zamiast tego zamieniamy pozostały czas trwania od daty wygaśnięcia Twojego obecnego planu na najbliższy względny czas trwania dla Twojego nowego planu (zaokrąglony w dół według miesiąca).

Należy pamiętać, że jeśli w ciągu 30 dni od rozpoczęcia płatnego planu dokonasz zmiany na wyższy lub niższy plan, automatycznie zwrócimy Ci pełną kwotę z bieżącego planu.

### Czy mogę używać tej usługi przekierowania poczty e-mail jako „zapasowego” lub „zapasowego” serwera MX {#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server}

Nie, nie jest to zalecane, ponieważ można korzystać tylko z jednego serwera wymiany poczty na raz. Zazwyczaj próby powrotu do poprzedniej wersji nie są powtarzane z powodu błędnej konfiguracji priorytetów i braku respektowania przez serwery pocztowe sprawdzania priorytetów MX Exchange.

### Czy mogę wyłączyć określone aliasy {#can-i-disable-specific-aliases}

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Ważne:
</strong>
<span>
Jeśli korzystasz z abonamentu płatnego, przejdź do <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Moje konto <i class="fa fa-angle-right"></i> Domeny</a> <i class="fa fa-angle-right"></i> Aliasy <i class="fa fa-angle-right"></i> Edytuj alias <i class="fa fa-angle-right"></i> Odznacz pole wyboru „Aktywny” <i class="fa fa-angle-right"></i> Kontynuuj.
</span>
</div>

Tak, po prostu edytuj rekord DNS <strong class="notranslate">TXT</strong> i dodaj prefiks aliasu w postaci jednego, dwóch lub trzech wykrzykników (patrz poniżej).

Należy pamiętać, że *należy* zachować mapowanie „:”, ponieważ będzie ono wymagane, jeśli zdecydujesz się wyłączyć tę opcję (i będzie ono również używane podczas importowania w przypadku uaktualnienia do jednego z naszych płatnych planów).

**W przypadku cichego odrzucenia (nadawca uważa, że wiadomość została wysłana pomyślnie, ale w rzeczywistości nie trafia do nikogo) (kod statusu `250`):** Jeśli do aliasu dodasz prefiks „!” (pojedynczy wykrzyknik), nadawcy próbujący wysłać wiadomość na ten adres zwrócą kod statusu powodzenia `250`, ale same wiadomości e-mail nie trafią do nikogo (np. do czarnej dziury lub `/dev/null`).

**W przypadku odrzucenia miękkiego (kod statusu `421`):** Jeśli do aliasu dodasz prefiks "!!" (podwójny wykrzyknik), nadawcy próbujący wysłać wiadomość na ten adres zwrócą kod statusu błędu miękkiego `421`. Wiadomości będą często ponawiane nawet do 5 dni przed odrzuceniem i zwróceniem.

**W przypadku twardego odrzucenia (kod statusu `550`):** Jeśli do aliasu dodasz prefiks „!!!” (trzy wykrzykniki), nadawcy próbujący wysłać wiadomość na ten adres zwrócą stały kod statusu błędu `550`, a wiadomości e-mail zostaną odrzucone i niedostarczone.

Na przykład, jeśli chcę, aby wszystkie wiadomości e-mail kierowane na adres `alias@example.com` przestały trafiać na adres `user@gmail.com` i były odrzucane i odsyłane (np. za pomocą trzech wykrzykników):

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
<td><em>"@", "." lub puste</em></td>
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
Możesz również zmienić adres przekierowanego odbiorcy na po prostu „nobody@forwardemail.net”, co spowoduje przekierowanie wiadomości do „nobody”, jak w poniższym przykładzie.
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
<td><em>"@", "." lub puste</em></td>
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
Jeśli zależy Ci na zwiększeniu bezpieczeństwa, możesz również usunąć część „:user@gmail.com” (lub „:nobody@forwardemail.net”), pozostawiając tylko „!!!alias”, jak w poniższym przykładzie.
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
<td><em>"@", "." lub puste</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=!!!alias</code></td>
</tr>
</tbody>
</table>

### Czy mogę przekazywać wiadomości e-mail do wielu odbiorców? {#can-i-forward-emails-to-multiple-recipients}

Tak, oczywiście. Wystarczy określić wielu odbiorców w rekordach <strong class="notranslate">TXT</strong>.

Na przykład, jeśli chcę, aby wiadomość e-mail kierowana na adres `hello@example.com` została przekierowana na adresy `user+a@gmail.com` i `user+b@gmail.com`, mój rekord <strong class="notranslate">TXT</strong> wyglądałby następująco:

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
<td><em>"@", "." lub puste</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code class="cursor-initial" data-original-title="" title="">forward-email=hello:user+a@gmail.com,hello:user+b@gmail.com</code></td>
</tr>
</tbody>
</table>

Można je również określić w dwóch oddzielnych wierszach, w ten sposób:

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
<td><em>"@", "." lub puste</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=hello:user+a@gmail.com</code></td>
</tr>
<tr>
<td><em>"@", "." lub puste</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=hello:user+b@gmail.com</code></td>
</tr>
</tbody>
</table>

To zależy od Ciebie!

### Czy mogę mieć wielu globalnych odbiorców typu catch-all {#can-i-have-multiple-global-catch-all-recipients}

Tak, możesz. Wystarczy określić wielu globalnych odbiorców typu catch-all w rekordach <strong class="notranslate">TXT</strong>.

Na przykład, jeśli chcę, aby każda wiadomość e-mail kierowana na adres `*@example.com` (gwiazdka oznacza symbol wieloznaczny, czyli ogólny) była przekierowywana na adresy `user+a@gmail.com` i `user+b@gmail.com`, to mój rekord <strong class="notranslate">TXT</strong> wyglądałby następująco:

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
<td><em>"@", "." lub puste</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=user+a@gmail.com,user+b@gmail.com</code></td>
</tr>
</tbody>
</table>

Można je również określić w dwóch oddzielnych wierszach, w ten sposób:

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
<td><em>"@", "." lub puste</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=user+a@gmail.com</code></td>
</tr>
<tr>
<td><em>@, "." lub puste</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=user+b@gmail.com</code></td>
</tr>
</tbody>
</table>

To zależy od Ciebie!

### Czy istnieje maksymalny limit liczby adresów e-mail, na które mogę przekierować wiadomości na alias {#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias}?

Tak, domyślny limit to 10. NIE oznacza to, że możesz mieć tylko 10 aliasów dla swojej nazwy domeny. Możesz mieć dowolną liczbę aliasów (bez ograniczeń). Oznacza to, że możesz przekierować tylko jeden alias na 10 unikalnych adresów e-mail. Możesz mieć `hello:user+1@gmail.com`, `hello:user+2@gmail.com`, `hello:user+3@gmail.com`, … (od 1 do 10) – a wszystkie wiadomości e-mail wysłane na adres `hello@example.com` zostaną przekierowane na adres `user+1@gmail.com`, `user+2@gmail.com`, `user+3@gmail.com`, … (od 1 do 10).

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Wskazówka:
</strong>
<span>
Potrzebujesz więcej niż 10 odbiorców na alias? Wyślij nam e-mail, a chętnie zwiększymy limit Twoich kont.
</span>
</div>

### Czy mogę rekurencyjnie przekazywać dalej wiadomości e-mail {#can-i-recursively-forward-emails}

Tak, możesz, jednak nadal musisz przestrzegać maksymalnego limitu. Jeśli masz `hello:linus@example.com` i `linus:user@gmail.com`, wiadomości e-mail wysłane na adres `hello@example.com` zostaną przekierowane na adresy `linus@example.com` i `user@gmail.com`. Pamiętaj, że próba rekurencyjnego przekierowania wiadomości e-mail przekraczających maksymalny limit spowoduje wygenerowanie błędu.

### Czy ludzie mogą wyrejestrować lub zarejestrować przekierowanie mojej poczty e-mail bez mojej zgody? {#can-people-unregister-or-register-my-email-forwarding-without-my-permission}

Korzystamy z weryfikacji rekordów MX i <strong class="notranslate">TXT</strong>, dlatego jeśli dodasz odpowiednie rekordy MX i <strong class="notranslate">TXT</strong> tej usługi, zostaniesz zarejestrowany. Jeśli je usuniesz, zostaniesz wyrejestrowany. Jesteś właścicielem swojej domeny i masz prawo do zarządzania DNS, więc jeśli ktoś ma do nich dostęp, stanowi to problem.

### Jak to możliwe, że {#how-is-it-free} jest darmowy?

Forward Email oferuje bezpłatny poziom dzięki połączeniu rozwoju oprogramowania typu open source, wydajnej infrastruktury i opcjonalnych płatnych planów, które wspierają tę usługę.

Nasz bezpłatny poziom jest obsługiwany przez:

1. **Rozwój oprogramowania typu Open Source**: Nasz kod źródłowy jest oprogramowaniem typu Open Source, co pozwala na wkład społeczności i transparentne działanie.

2. **Wydajna infrastruktura**: Zoptymalizowaliśmy nasze systemy, aby obsługiwać przekazywanie wiadomości e-mail przy minimalnym zaangażowaniu zasobów.

3. **Płatne plany Premium**: Użytkownicy potrzebujący dodatkowych funkcji, takich jak wysyłanie SMTP, odbieranie IMAP lub rozszerzone opcje prywatności, subskrybują nasze płatne plany.

4. **Ograniczenia rozsądnego użytkowania**: W ramach bezpłatnej wersji obowiązują zasady uczciwego użytkowania, które zapobiegają nadużyciom.

> \[!NOTE]
> We're committed to keeping basic email forwarding free while offering premium features for users with more advanced needs.

> \[!TIP]
> If you find our service valuable, consider upgrading to a paid plan to support ongoing development and maintenance.

### Jaki jest maksymalny limit rozmiaru wiadomości e-mail {#what-is-the-max-email-size-limit}

Domyślnie obowiązuje limit rozmiaru 50 MB, który obejmuje treść, nagłówki i załączniki. Należy pamiętać, że usługi takie jak Gmail i Outlook dopuszczają jedynie limit rozmiaru 25 MB, a jeśli przekroczysz limit wysyłając wiadomość na adresy tych dostawców, otrzymasz komunikat o błędzie.

W przypadku przekroczenia limitu rozmiaru pliku zwracany jest błąd z właściwym kodem odpowiedzi.

### Czy przechowujesz logi wiadomości e-mail {#do-you-store-logs-of-emails}

Nie, nie zapisujemy danych na dysku ani nie przechowujemy logów – za pomocą [wyjątek od błędów](#do-you-store-error-logs) i [wychodzący SMTP](#do-you-support-sending-email-with-smtp) (zobacz nasz [Polityka prywatności](/privacy)).

Wszystko odbywa się w pamięci i jest [nasz kod źródłowy znajduje się na GitHubie](https://github.com/forwardemail).

### Czy przechowujesz dzienniki błędów {#do-you-store-error-logs}

**Tak. Dostęp do dzienników błędów można uzyskać pod adresem [Moje konto → Dzienniki](/my-account/logs) lub [Moje konto → Domeny](/my-account/domains).**

Od lutego 2023 r. przechowujemy dzienniki błędów dla kodów odpowiedzi SMTP `4xx` i `5xx` przez okres 7 dni. Zawierają one błąd SMTP, kopertę i nagłówki wiadomości e-mail (**nie** przechowujemy treści wiadomości e-mail ani załączników).

Dzienniki błędów pozwalają sprawdzić, czy nie brakuje ważnych wiadomości e-mail i ograniczyć fałszywe alarmy spamu dla [Twoje domeny](/my-account/domains). Są również doskonałym źródłem informacji do debugowania problemów z [webhooki e-mail](#do-you-support-webhooks) (ponieważ dzienniki błędów zawierają odpowiedź punktu końcowego webhooka).

Rejestry błędów dla [ograniczanie szybkości](#do-you-have-rate-limiting) i [szara lista](#do-you-have-a-greylist) nie są dostępne, ponieważ połączenie kończy się przedwcześnie (np. przed przesłaniem poleceń `RCPT TO` i `MAIL FROM`).

Więcej informacji znajdziesz na stronie [Polityka prywatności](/privacy).

### Czy czytasz moje e-maile {#do-you-read-my-emails}

Nie, absolutnie nie. Zobacz nasz [Polityka prywatności](/privacy).

Wiele innych usług przekierowywania poczty elektronicznej przechowuje i potencjalnie odczytuje Twoje wiadomości. Nie ma powodu, dla którego przekierowane wiadomości e-mail musiałyby być przechowywane na dysku – dlatego stworzyliśmy pierwsze rozwiązanie open source, które robi to wszystko w pamięci.

Wierzymy, że przysługuje Ci prawo do prywatności i ściśle je szanujemy. Kod wdrożony na serwerze ma certyfikat [oprogramowanie typu open source na GitHub](https://github.com/forwardemail), co zapewnia transparentność i buduje zaufanie.

### Czy mogę „wysyłać pocztę jako” w Gmailu za pomocą tego {#can-i-send-mail-as-in-gmail-with-this}

Tak! Od 2 października 2018 roku dodaliśmy tę funkcję. Zobacz [Jak wysłać wiadomość e-mail za pomocą Gmaila](#how-to-send-mail-as-using-gmail) powyżej!

Powinieneś również ustawić rekord SPF dla Gmaila w rekordzie <strong class="notranslate">TXT</strong> konfiguracji DNS.

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Ważne:
</strong>
<span>
Jeśli korzystasz z Gmaila (np. Wyślij jako) lub G Suite, musisz dodać <code>include:_spf.google.com</code> do rekordu SPF <strong class="notranslate">TXT</strong>, na przykład:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
</span>
</div>

### Czy mogę „wysyłać pocztę jako” w programie Outlook za pomocą tego adresu {#can-i-send-mail-as-in-outlook-with-this}

Tak! Od 2 października 2018 roku dodaliśmy tę funkcję. Wystarczy przejrzeć te dwa linki od firmy Microsoft poniżej:

* <https://support.office.com/en-us/article/add-or-remove-an-email-alias-in-outlook-com-459b1989-356d-40fa-a689-8f285b13f1f2>
* <https://support.office.com/en-us/article/send-email-from-a-different-address-in-outlook-com-ccba89cb-141c-4a36-8c56-6d16a8556d2e>

Powinieneś również ustawić rekord SPF dla programu Outlook w rekordzie <strong class="notranslate">TXT</strong> konfiguracji DNS.

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Ważne:
</strong>
<span>
Jeśli korzystasz z programu Microsoft Outlook lub Live.com, musisz dodać <code>include:spf.protection.outlook.com</code> do rekordu SPF <strong class="notranslate">TXT</strong>, na przykład:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:spf.protection.outlook.com -all</code>
</span>
</div>

### Czy mogę „wysyłać pocztę jako” w Apple Mail i iCloud Mail za pomocą tego {#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this}

Jeśli jesteś subskrybentem iCloud+, możesz użyć domeny niestandardowej. [Nasza usługa jest również kompatybilna z Apple Mail](#apple-mail).

Więcej informacji znajdziesz na stronie <https://support.apple.com/en-us/102540>.

### Czy mogę przekazywać nieograniczoną liczbę wiadomości e-mail za pomocą tego adresu {#can-i-forward-unlimited-emails-with-this}

Tak, jednak „stosunkowo nieznani” nadawcy mają limit 100 połączeń na godzinę na nazwę hosta lub adres IP. Zobacz sekcję [Ograniczanie szybkości transmisji](#do-you-have-rate-limiting) i [Szara lista](#do-you-have-a-greylist) powyżej.

Przez „stosunkowo nieznanych” rozumiemy nadawców, którzy nie pojawiają się w [lista dozwolonych](#do-you-have-an-allowlist).

Jeśli limit ten zostanie przekroczony, wysyłamy kod odpowiedzi 421, który informuje serwer pocztowy nadawcy, że należy spróbować ponownie później.

### Czy oferujecie nieograniczoną liczbę domen za jedną cenę {#do-you-offer-unlimited-domains-for-one-price}

Tak. Niezależnie od wybranego planu, płacisz tylko jedną miesięczną opłatę – obejmującą wszystkie Twoje domeny.

### Jakie metody płatności akceptujecie w serwisie {#which-payment-methods-do-you-accept}

Forward Email akceptuje następujące metody płatności jednorazowej lub miesięcznej/kwartalnej/rocznej:

1. **Karty kredytowe/debetowe/przelewy bankowe**: Visa, Mastercard, American Express, Discover, JCB, Diners Club itp.
2. **PayPal**: Połącz swoje konto PayPal, aby ułatwić płatności
3. **Kryptowaluty**: Akceptujemy płatności za pośrednictwem stablecoinów Stripe w sieciach Ethereum, Polygon i Solana

> \[!NOTE]
> We store limited payment information on our servers, which only includes payment identifiers and references to [Stripe](https://stripe.com/global) and [PayPal](https://www.paypal.com) transaction, customer, subscription, and payment ID's.

> \[!TIP]
> For maximum privacy, consider using cryptocurrency payments.

Wszystkie płatności są przetwarzane bezpiecznie za pośrednictwem Stripe lub PayPal. Twoje dane płatnicze nigdy nie są przechowywane na naszych serwerach.

## Dodatkowe zasoby {#additional-resources}

> \[!TIP]
> Our articles below are regularly updated with new guides, tips, and technical information. Check back often for the latest content.

* [Studia przypadków i dokumentacja dla programistów](/blog/docs)
* [Zasoby](/resources)
* [Przewodniki](/guides)

[gmail-2fa]: https://myaccount.google.com/signinoptions/two-step-verification

[cloudflare-dns]: https://blog.cloudflare.com/announcing-1111/