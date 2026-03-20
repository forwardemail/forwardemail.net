# Email API {#email-api}


## Spis treści {#table-of-contents}

* [Biblioteki](#libraries)
* [Podstawowy URI](#base-uri)
* [Uwierzytelnianie](#authentication)
  * [Uwierzytelnianie tokenem API (zalecane dla większości punktów końcowych)](#api-token-authentication-recommended-for-most-endpoints)
  * [Uwierzytelnianie poświadczeniami aliasu (dla wychodzącej poczty)](#alias-credentials-authentication-for-outbound-email)
  * [Punkty końcowe tylko dla aliasów](#alias-only-endpoints)
* [Błędy](#errors)
* [Lokalizacja](#localization)
* [Paginacja](#pagination)
* [Logi](#logs)
  * [Pobierz logi](#retrieve-logs)
* [Konto](#account)
  * [Utwórz konto](#create-account)
  * [Pobierz konto](#retrieve-account)
  * [Aktualizuj konto](#update-account)
* [Kontakty aliasów (CardDAV)](#alias-contacts-carddav)
  * [Lista kontaktów](#list-contacts)
  * [Utwórz kontakt](#create-contact)
  * [Pobierz kontakt](#retrieve-contact)
  * [Aktualizuj kontakt](#update-contact)
  * [Usuń kontakt](#delete-contact)
* [Kalendarze aliasów (CalDAV)](#alias-calendars-caldav)
  * [Lista kalendarzy](#list-calendars)
  * [Utwórz kalendarz](#create-calendar)
  * [Pobierz kalendarz](#retrieve-calendar)
  * [Aktualizuj kalendarz](#update-calendar)
  * [Usuń kalendarz](#delete-calendar)
* [Wiadomości aliasów (IMAP/POP3)](#alias-messages-imappop3)
  * [Lista i wyszukiwanie wiadomości](#list-and-search-for-messages)
  * [Utwórz wiadomość](#create-message)
  * [Pobierz wiadomość](#retrieve-message)
  * [Aktualizuj wiadomość](#update-message)
  * [Usuń wiadomość](#delete-message)
* [Foldery aliasów (IMAP/POP3)](#alias-folders-imappop3)
  * [Lista folderów](#list-folders)
  * [Utwórz folder](#create-folder)
  * [Pobierz folder](#retrieve-folder)
  * [Aktualizuj folder](#update-folder)
  * [Usuń folder](#delete-folder)
  * [Kopiuj folder](#copy-folder)
* [Wychodzące e-maile](#outbound-emails)
  * [Pobierz limit wychodzących e-maili SMTP](#get-outbound-smtp-email-limit)
  * [Lista wychodzących e-maili SMTP](#list-outbound-smtp-emails)
  * [Utwórz wychodzący e-mail SMTP](#create-outbound-smtp-email)
  * [Pobierz wychodzący e-mail SMTP](#retrieve-outbound-smtp-email)
  * [Usuń wychodzący e-mail SMTP](#delete-outbound-smtp-email)
* [Domeny](#domains)
  * [Lista domen](#list-domains)
  * [Utwórz domenę](#create-domain)
  * [Pobierz domenę](#retrieve-domain)
  * [Weryfikuj rekordy domeny](#verify-domain-records)
  * [Weryfikuj rekordy SMTP domeny](#verify-domain-smtp-records)
  * [Lista haseł catch-all dla domeny](#list-domain-wide-catch-all-passwords)
  * [Utwórz hasło catch-all dla domeny](#create-domain-wide-catch-all-password)
  * [Usuń hasło catch-all dla domeny](#remove-domain-wide-catch-all-password)
  * [Aktualizuj domenę](#update-domain)
  * [Usuń domenę](#delete-domain)
* [Zaproszenia](#invites)
  * [Akceptuj zaproszenie do domeny](#accept-domain-invite)
  * [Utwórz zaproszenie do domeny](#create-domain-invite)
  * [Usuń zaproszenie do domeny](#remove-domain-invite)
* [Członkowie](#members)
  * [Aktualizuj członka domeny](#update-domain-member)
  * [Usuń członka domeny](#remove-domain-member)
* [Aliasy](#aliases)
  * [Generuj hasło aliasu](#generate-an-alias-password)
  * [Lista aliasów domeny](#list-domain-aliases)
  * [Utwórz nowy alias domeny](#create-new-domain-alias)
  * [Pobierz alias domeny](#retrieve-domain-alias)
  * [Aktualizuj alias domeny](#update-domain-alias)
  * [Usuń alias domeny](#delete-domain-alias)
* [Szyfrowanie](#encrypt)
  * [Szyfruj rekord TXT](#encrypt-txt-record)


## Biblioteki {#libraries}

Obecnie nie wydaliśmy jeszcze żadnych wrapperów API, ale planujemy to zrobić w niedalekiej przyszłości. Wyślij e-mail na <api@forwardemail.net>, jeśli chcesz zostać powiadomiony, gdy zostanie wydany wrapper API dla konkretnego języka programowania. W międzyczasie możesz użyć tych rekomendowanych bibliotek do zapytań HTTP w swojej aplikacji lub po prostu użyć [curl](https://stackoverflow.com/a/27442239/3586413), jak w poniższych przykładach.

| Język      | Biblioteka                                                             |
| ---------- | --------------------------------------------------------------------- |
| Ruby       | [Faraday](https://github.com/lostisland/faraday)                      |
| Python     | [requests](https://github.com/psf/requests)                           |
| Java       | [OkHttp](https://github.com/square/okhttp/)                           |
| PHP        | [guzzle](https://github.com/guzzle/guzzle)                            |
| JavaScript | [superagent](https://github.com/ladjs/superagent) (jesteśmy maintainerami) |
| Node.js    | [superagent](https://github.com/ladjs/superagent) (jesteśmy maintainerami) |
| Go         | [net/http](https://golang.org/pkg/net/http/)                          |
| .NET       | [RestSharp](https://github.com/restsharp/RestSharp)                   |
## Base URI {#base-uri}

Aktualna ścieżka bazowego URI HTTP to: `BASE_URI`.


## Uwierzytelnianie {#authentication}

Wszystkie punkty końcowe wymagają uwierzytelnienia za pomocą [Basic Authorization](https://en.wikipedia.org/wiki/Basic_access_authentication). Obsługujemy dwie metody uwierzytelniania:

### Uwierzytelnianie tokenem API (zalecane dla większości punktów końcowych) {#api-token-authentication-recommended-for-most-endpoints}

Ustaw swój [klucz API](https://forwardemail.net/my-account/security) jako wartość "username" z pustym hasłem:

```sh
curl BASE_URI/v1/account \
  -u API_TOKEN:
```

Zwróć uwagę na dwukropek (`:`) po tokenie API – wskazuje on na puste hasło w formacie Basic Auth.

### Uwierzytelnianie poświadczeniami aliasu (dla wychodzącej poczty e-mail) {#alias-credentials-authentication-for-outbound-email}

Punkt końcowy [Create outbound SMTP email](#create-outbound-smtp-email) obsługuje również uwierzytelnianie za pomocą adresu e-mail aliasu i [wygenerowanego hasła aliasu](/faq#do-you-support-receiving-email-with-imap):

```sh
curl -X POST BASE_URI/v1/emails \
  -u "alias@yourdomain.com:your_generated_password" \
  -d "to=recipient@example.com" \
  -d "subject=Hello" \
  -d "text=Test email"
```

Ta metoda jest przydatna podczas wysyłania e-maili z aplikacji, które już używają poświadczeń SMTP i umożliwia płynne przejście z SMTP na nasze API.

### Punkty końcowe tylko dla aliasów {#alias-only-endpoints}

Punkty końcowe [Alias Contacts](#alias-contacts-carddav), [Alias Calendars](#alias-calendars-caldav), [Alias Messages](#alias-messages-imappop3) oraz [Alias Folders](#alias-folders-imappop3) wymagają poświadczeń aliasu i nie obsługują uwierzytelniania tokenem API.

Nie martw się – poniżej znajdziesz przykłady, jeśli nie jesteś pewien, co to jest.


## Błędy {#errors}

Jeśli wystąpią jakiekolwiek błędy, ciało odpowiedzi żądania API będzie zawierać szczegółową wiadomość o błędzie.

| Kod  | Nazwa                 |
| ---- | --------------------- |
| 200  | OK                    |
| 400  | Nieprawidłowe żądanie |
| 401  | Nieautoryzowany       |
| 403  | Zabronione            |
| 404  | Nie znaleziono        |
| 429  | Zbyt wiele żądań      |
| 500  | Błąd wewnętrzny serwera |
| 501  | Niezaimplementowano   |
| 502  | Zła brama             |
| 503  | Usługa niedostępna    |
| 504  | Przekroczenie limitu czasu bramy |

> \[!TIP]
> Jeśli otrzymasz kod statusu 5xx (co nie powinno się zdarzyć), skontaktuj się z nami pod adresem <a href="mailto:api@forwardemail.net"><api@forwardemail.net></a>, a pomożemy Ci natychmiast rozwiązać problem.


## Lokalizacja {#localization}

Nasza usługa jest przetłumaczona na ponad 25 różnych języków. Wszystkie komunikaty odpowiedzi API są tłumaczone na ostatnio wykryty język użytkownika wykonującego żądanie API. Możesz to nadpisać, przekazując niestandardowy nagłówek `Accept-Language`. Zachęcamy do wypróbowania tego za pomocą rozwijanego menu języków na dole tej strony.


## Paginacja {#pagination}

> \[!NOTE]
> Od 1 listopada 2024 r. punkty końcowe API dla [List domains](#list-domains) oraz [List domain aliases](#list-domain-aliases) będą domyślnie zwracać maksymalnie `1000` wyników na stronę. Jeśli chcesz wcześniej skorzystać z tego zachowania, możesz dodać `?paginate=true` jako dodatkowy parametr zapytania do adresu URL punktu końcowego.

Paginacja jest obsługiwana przez wszystkie punkty końcowe API, które zwracają listy wyników.

Wystarczy podać właściwości zapytania `page` (oraz opcjonalnie `limit`).

Właściwość `page` powinna być liczbą większą lub równą `1`. Jeśli podasz `limit` (również liczbę), minimalna wartość to `10`, a maksymalna `50` (chyba że zaznaczono inaczej).

| Parametr zapytania    | Wymagany | Typ    | Opis                                                                                                                                                    |
| --------------------- | -------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `page`                | Nie      | Liczba | Strona wyników do zwrócenia. Jeśli nie zostanie określona, wartość `page` będzie `1`. Musi być liczbą większą lub równą `1`.                            |
| `limit`               | Nie      | Liczba | Liczba wyników do zwrócenia na stronę. Domyślnie `10`, jeśli nie zostanie określona. Musi być liczbą większą lub równą `1` i mniejszą lub równą `50`.    |
Aby określić, czy dostępne są kolejne wyniki, udostępniamy następujące nagłówki odpowiedzi HTTP (które można analizować, aby programowo paginować):

| Nagłówek odpowiedzi HTTP | Przykład                                                                                                                                                                                                                                                  | Opis                                                                                                                                                                                                                                                                                                                                                              |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `X-Page-Count`           | `X-Page-Count: 3`                                                                                                                                                                                                                                        | Całkowita liczba dostępnych stron.                                                                                                                                                                                                                                                                                                                               |
| `X-Page-Current`         | `X-Page-Current: 1`                                                                                                                                                                                                                                      | Aktualna strona zwróconych wyników (np. na podstawie parametru zapytania `page`).                                                                                                                                                                                                                                                                                  |
| `X-Page-Size`            | `X-Page-Size: 10`                                                                                                                                                                                                                                        | Całkowita liczba wyników na zwróconej stronie (np. na podstawie parametru zapytania `limit` oraz faktycznie zwróconych wyników).                                                                                                                                                                                                                                  |
| `X-Item-Count`           | `X-Item-Count: 30`                                                                                                                                                                                                                                       | Całkowita liczba dostępnych elementów we wszystkich stronach.                                                                                                                                                                                                                                                                                                    |
| `Link`                   | `Link: <https://api.forwardemail.net/v1/emails?page=1>; rel="prev", <https://api.forwardemail.net/v1/emails?page=3>; rel="next", <https://api.forwardemail.net/v1/emails?page=3; rel="last", https://api.forwardemail.net/v1/emails?page=1; rel="first"` | Udostępniamy nagłówek odpowiedzi HTTP `Link`, który można analizować jak pokazano w przykładzie. Jest to [podobne do GitHub](https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api#using-link-headers) (np. nie wszystkie wartości będą podane, jeśli nie są istotne lub dostępne, np. `"next"` nie będzie podany, jeśli nie ma kolejnej strony). |
> Przykładowe zapytanie:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/aliases?page=2&pagination=true \
  -u API_TOKEN:
```


## Logi {#logs}

### Pobierz logi {#retrieve-logs}

Nasze API umożliwia programowe pobieranie logów dla Twojego konta. Wysłanie zapytania do tego endpointu spowoduje przetworzenie wszystkich logów dla Twojego konta i przesłanie ich do Ciebie w załączniku (skompresowany plik [Gzip](https://en.wikipedia.org/wiki/Gzip) z arkuszem [CSV](https://en.wikipedia.org/wiki/Comma-separated_values)) po zakończeniu.

Pozwala to na tworzenie zadań w tle za pomocą [Cron job](https://en.wikipedia.org/wiki/Cron) lub korzystając z naszego [oprogramowania do harmonogramowania zadań Node.js Bree](https://github.com/breejs/bree), aby otrzymywać logi kiedy tylko chcesz. Zwróć uwagę, że ten endpoint jest ograniczony do `10` zapytań dziennie.

Załącznik ma nazwę w formacie małych liter `email-deliverability-logs-YYYY-MM-DD-h-mm-A-z.csv.gz`, a sam e-mail zawiera krótkie podsumowanie pobranych logów. Możesz także pobierać logi w dowolnym momencie z [Moje konto → Logi](/my-account/logs)

> `GET /v1/logs/download`

| Parametr w zapytaniu | Wymagany | Typ           | Opis                                                                                                                           |
| -------------------- | -------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `domain`             | Nie      | String (FQDN) | Filtrowanie logów według w pełni kwalifikowanej domeny ("FQDN"). Jeśli nie podasz tego parametru, pobrane zostaną logi ze wszystkich domen. |
| `q`                  | Nie      | String        | Wyszukiwanie logów według e-maila, domeny, nazwy aliasu, adresu IP lub daty (format `M/Y`, `M/D/YY`, `M-D`, `M-D-YY` lub `M.D.YY`). |
| `bounce_category`    | Nie      | String        | Wyszukiwanie logów według konkretnej kategorii odbicia (np. `blocklist`).                                                       |
| `response_code`      | Nie      | Number        | Wyszukiwanie logów według konkretnego kodu odpowiedzi błędu (np. `421` lub `550`).                                              |

> Przykładowe zapytanie:

```sh
curl BASE_URI/v1/logs/download \
  -u API_TOKEN:
```

> Przykładowe zadanie Cron (codziennie o północy):

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download -u API_TOKEN: &>/dev/null
```

Zwróć uwagę, że możesz użyć serwisów takich jak [Crontab.guru](https://crontab.guru/) do weryfikacji składni wyrażenia zadania cron.

> Przykładowe zadanie Cron (codziennie o północy **i z logami za poprzedni dzień**):

Dla MacOS:

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download?q=`date -v-1d -u "+%-m/%-d/%y"` -u API_TOKEN: &>/dev/null
```

Dla Linux i Ubuntu:

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download?q=`date --date "-1 days" -u "+%-m/%-d/%y"` -u API_TOKEN: &>/dev/null
```


## Konto {#account}

### Utwórz konto {#create-account}

> `POST /v1/account`

| Parametr w ciele | Wymagany | Typ            | Opis          |
| ---------------- | -------- | -------------- | ------------- |
| `email`          | Tak      | String (Email) | Adres e-mail  |
| `password`       | Tak      | String         | Hasło         |

> Przykładowe zapytanie:

```sh
curl -X POST BASE_URI/v1/account \
  -u API_TOKEN: \
  -d "email=EMAIL"
```

### Pobierz konto {#retrieve-account}

> `GET /v1/account`

> Przykładowe zapytanie:

```sh
curl BASE_URI/v1/account \
  -u API_TOKEN:
```

### Aktualizuj konto {#update-account}

> `PUT /v1/account`

| Parametr w ciele | Wymagany | Typ            | Opis                |
| ---------------- | -------- | -------------- | ------------------- |
| `email`          | Nie      | String (Email) | Adres e-mail        |
| `given_name`     | Nie      | String         | Imię                |
| `family_name`    | Nie      | String         | Nazwisko            |
| `avatar_url`     | Nie      | String (URL)   | Link do zdjęcia awatara |

> Przykładowe zapytanie:

```sh
curl -X PUT BASE_URI/v1/account \
  -u API_TOKEN: \
  -d "email=EMAIL"
```


## Kontakty aliasów (CardDAV) {#alias-contacts-carddav}

> \[!NOTE]
> W przeciwieństwie do innych endpointów API, te wymagają [Uwierzytelnienia](#authentication) z "username" równym nazwie użytkownika aliasu oraz "password" równym wygenerowanemu hasłu aliasu jako nagłówki Basic Authorization.
> \[!WARNING]
> Ta sekcja endpointów jest w trakcie opracowywania i zostanie udostępniona (mamy nadzieję) w 2024 roku. W międzyczasie prosimy o korzystanie z klienta IMAP z rozwijanego menu "Apps" w nawigacji naszej strony internetowej.

### Lista kontaktów {#list-contacts}

> `GET /v1/contacts`

**Wkrótce dostępne**

### Utwórz kontakt {#create-contact}

> `POST /v1/contacts`

**Wkrótce dostępne**

### Pobierz kontakt {#retrieve-contact}

> `GET /v1/contacts/:id`

**Wkrótce dostępne**

### Aktualizuj kontakt {#update-contact}

> `PUT /v1/contacts/:id`

**Wkrótce dostępne**

### Usuń kontakt {#delete-contact}

> `DELETE /v1/contacts/:id`

**Wkrótce dostępne**


## Alias Kalendarze (CalDAV) {#alias-calendars-caldav}

> \[!NOTE]
> W przeciwieństwie do innych endpointów API, te wymagają [Uwierzytelnienia](#authentication) z "username" równym nazwie użytkownika aliasu oraz "password" równym wygenerowanemu hasłu aliasu jako nagłówki Basic Authorization.

> \[!WARNING]
> Ta sekcja endpointów jest w trakcie opracowywania i zostanie udostępniona (mamy nadzieję) w 2024 roku. W międzyczasie prosimy o korzystanie z klienta IMAP z rozwijanego menu "Apps" w nawigacji naszej strony internetowej.

### Lista kalendarzy {#list-calendars}

> `GET /v1/calendars`

**Wkrótce dostępne**

### Utwórz kalendarz {#create-calendar}

> `POST /v1/calendars`

**Wkrótce dostępne**

### Pobierz kalendarz {#retrieve-calendar}

> `GET /v1/calendars/:id`

**Wkrótce dostępne**

### Aktualizuj kalendarz {#update-calendar}

> `PUT /v1/calendars/:id`

**Wkrótce dostępne**

### Usuń kalendarz {#delete-calendar}

> `DELETE /v1/calendars/:id`

**Wkrótce dostępne**


## Alias Wiadomości (IMAP/POP3) {#alias-messages-imappop3}

> \[!NOTE]
> W przeciwieństwie do innych endpointów API, te wymagają [Uwierzytelnienia](#authentication) z "username" równym nazwie użytkownika aliasu oraz "password" równym wygenerowanemu hasłu aliasu jako nagłówki Basic Authorization.

> \[!WARNING]
> Ta sekcja endpointów jest w trakcie opracowywania i zostanie udostępniona (mamy nadzieję) w 2024 roku. W międzyczasie prosimy o korzystanie z klienta IMAP z rozwijanego menu "Apps" w nawigacji naszej strony internetowej.

Proszę upewnić się, że wykonałeś instrukcje konfiguracji dla swojej domeny.

Instrukcje te można znaleźć w naszej sekcji FAQ [Czy obsługujecie odbieranie e-maili przez IMAP?](/faq#do-you-support-receiving-email-with-imap).

### Lista i wyszukiwanie wiadomości {#list-and-search-for-messages}

> `GET /v1/messages`

**Wkrótce dostępne**

### Utwórz wiadomość {#create-message}

> \[!NOTE]
> To **NIE** wyśle e-maila – po prostu doda wiadomość do folderu Twojej skrzynki pocztowej (np. jest to podobne do polecenia IMAP `APPEND`). Jeśli chcesz wysłać e-mail, zobacz [Utwórz wychodzący e-mail SMTP](#create-outbound-smtp-email) poniżej. Po utworzeniu wychodzącego e-maila SMTP możesz dołączyć jego kopię za pomocą tego endpointu do skrzynki aliasu w celach przechowywania.

> `POST /v1/messages`

**Wkrótce dostępne**

### Pobierz wiadomość {#retrieve-message}

> `GET /v1/messages/:id`

**Wkrótce dostępne**

### Aktualizuj wiadomość {#update-message}

> `PUT /v1/messages/:id`

**Wkrótce dostępne**

### Usuń wiadomość {#delete-message}

> `DELETE /v1/messages:id`

**Wkrótce dostępne**


## Alias Foldery (IMAP/POP3) {#alias-folders-imappop3}

> \[!TIP]
> Endpointy folderów z ścieżką folderu <code>/v1/folders/:path</code> jako ich endpointem są wymienne z ID folderu <code>:id</code>. Oznacza to, że możesz odwoływać się do folderu zarówno przez jego <code>path</code>, jak i <code>id</code>.

> \[!WARNING]
> Ta sekcja endpointów jest w trakcie opracowywania i zostanie udostępniona (mamy nadzieję) w 2024 roku. W międzyczasie prosimy o korzystanie z klienta IMAP z rozwijanego menu "Apps" w nawigacji naszej strony internetowej.

### Lista folderów {#list-folders}

> `GET /v1/folders`

**Wkrótce dostępne**

### Utwórz folder {#create-folder}

> `POST /v1/folders`

**Wkrótce dostępne**

### Pobierz folder {#retrieve-folder}

> `GET /v1/folders/:id`

**Wkrótce dostępne**

### Aktualizuj folder {#update-folder}

> `PUT /v1/folders/:id`

**Wkrótce dostępne**

### Usuń folder {#delete-folder}

> `DELETE /v1/folders/:id`

**Wkrótce dostępne**

### Kopiuj folder {#copy-folder}

> `POST /v1/folders/:id/copy`

**Wkrótce dostępne**


## Wychodzące e-maile {#outbound-emails}

Proszę upewnić się, że wykonałeś instrukcje konfiguracji dla swojej domeny.

Instrukcje te można znaleźć pod adresem [Moje konto → Domeny → Ustawienia → Konfiguracja wychodzącego SMTP](/my-account/domains). Musisz zapewnić konfigurację DKIM, Return-Path oraz DMARC dla wysyłania wychodzących wiadomości SMTP z Twojej domeny.
### Pobierz limit wychodzących wiadomości SMTP {#get-outbound-smtp-email-limit}

Jest to proste endpoint, który zwraca obiekt JSON zawierający `count` i `limit` dla liczby dziennych wychodzących wiadomości SMTP na konto.

> `GET /v1/emails/limit`

> Przykładowe zapytanie:

```sh
curl BASE_URI/v1/emails/limit \
  -u API_TOKEN:
```

### Lista wychodzących wiadomości SMTP {#list-outbound-smtp-emails}

Zwróć uwagę, że ten endpoint nie zwraca wartości właściwości dla `message`, `headers` ani `rejectedErrors` wiadomości email.

Aby zwrócić te właściwości i ich wartości, użyj proszę endpointu [Pobierz wiadomość](#retrieve-email) z ID wiadomości.

> `GET /v1/emails`

| Parametr w zapytaniu | Wymagany | Typ                       | Opis                                                                                                                                               |
| -------------------- | -------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `q`                  | Nie      | String (obsługuje RegExp) | Wyszukiwanie wiadomości po metadanych                                                                                                            |
| `domain`             | Nie      | String (obsługuje RegExp) | Wyszukiwanie wiadomości po nazwie domeny                                                                                                         |
| `sort`               | Nie      | String                    | Sortowanie po określonym polu (poprzedź pojedynczym myślnikiem `-`, aby sortować w odwrotnym kierunku). Domyślnie `created_at`, jeśli nie ustawiono. |
| `page`               | Nie      | Number                    | Zobacz [Paginacja](#pagination) dla więcej informacji                                                                                            |
| `limit`              | Nie      | Number                    | Zobacz [Paginacja](#pagination) dla więcej informacji                                                                                            |

> Przykładowe zapytanie:

```sh
curl BASE_URI/v1/emails?limit=1 \
  -u API_TOKEN:
```

### Utwórz wychodzącą wiadomość SMTP {#create-outbound-smtp-email}

Nasze API do tworzenia wiadomości jest inspirowane i wykorzystuje konfigurację opcji wiadomości Nodemailera. Prosimy odnieść się do [konfiguracji wiadomości Nodemailer](https://nodemailer.com/message/) dla wszystkich poniższych parametrów ciała.

Z wyjątkiem `envelope` i `dkim` (które ustawiamy automatycznie za Ciebie), obsługujemy wszystkie opcje Nodemailera. Automatycznie ustawiamy opcje `disableFileAccess` i `disableUrlAccess` na `true` ze względów bezpieczeństwa.

Powinieneś przekazać albo pojedynczą opcję `raw` z surową pełną wiadomością email wraz z nagłówkami **lub** przekazać poszczególne opcje parametrów ciała poniżej.

Ten endpoint API automatycznie zakoduje emoji, jeśli zostaną znalezione w nagłówkach (np. temat `Subject: 🤓 Hello` zostanie automatycznie przekonwertowany na `Subject: =?UTF-8?Q?=F0=9F=A4=93?= Hello`). Naszym celem było stworzenie bardzo przyjaznego dla programistów i odpornego na błędy API email.

**Uwierzytelnianie:** Ten endpoint obsługuje zarówno [uwierzytelnianie tokenem API](#api-token-authentication-recommended-for-most-endpoints), jak i [uwierzytelnianie poświadczeniami aliasu](#alias-credentials-authentication-for-outbound-email). Szczegóły znajdziesz w sekcji [Uwierzytelnianie](#authentication) powyżej.

> `POST /v1/emails`

| Parametr w ciele  | Wymagany | Typ              | Opis                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ----------------- | -------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `from`            | Nie      | String (Email)   | Adres email nadawcy (musi istnieć jako alias domeny).                                                                                                                                                                                                                                                                                                                                                                                                          |
| `to`              | Nie      | String lub Array | Lista odbiorców w nagłówku "To", rozdzielona przecinkami lub tablica odbiorców.                                                                                                                                                                                                                                                                                                                                                                                |
| `cc`              | Nie      | String lub Array | Lista odbiorców w nagłówku "Cc", rozdzielona przecinkami lub tablica odbiorców.                                                                                                                                                                                                                                                                                                                                                                                |
| `bcc`             | Nie      | String lub Array | Lista odbiorców w nagłówku "Bcc", rozdzielona przecinkami lub tablica odbiorców.                                                                                                                                                                                                                                                                                                                                                                               |
| `subject`         | Nie      | String           | Temat wiadomości email.                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `text`            | Nie      | String lub Buffer| Wersja tekstowa wiadomości.                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `html`            | Nie      | String lub Buffer| Wersja HTML wiadomości.                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `attachments`     | Nie      | Array            | Tablica obiektów załączników (zobacz [pola wspólne Nodemailera](https://nodemailer.com/message/#common-fields)).                                                                                                                                                                                                                                                                                                                                                 |
| `sender`          | Nie      | String           | Adres email dla nagłówka "Sender" (zobacz [bardziej zaawansowane pola Nodemailera](https://nodemailer.com/message/#more-advanced-fields)).                                                                                                                                                                                                                                                                                                                      |
| `replyTo`         | Nie      | String           | Adres email dla nagłówka "Reply-To".                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `inReplyTo`       | Nie      | String           | Message-ID, na który wiadomość odpowiada.                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `references`      | Nie      | String lub Array | Lista Message-ID rozdzielona spacjami lub tablica Message-ID.                                                                                                                                                                                                                                                                                                                                                                                                   |
| `attachDataUrls`  | Nie      | Boolean          | Jeśli `true`, konwertuje obrazy `data:` w treści HTML wiadomości na osadzone załączniki.                                                                                                                                                                                                                                                                                                                                                                        |
| `watchHtml`       | Nie      | String           | Specyficzna wersja HTML dla Apple Watch ([zgodnie z dokumentacją Nodemailera](https://nodemailer.com/message/#content-options]), najnowsze zegarki nie wymagają ustawiania tego).                                                                                                                                                                                                                                                                               |
| `amp`             | Nie      | String           | Specyficzna wersja HTML dla AMP4EMAIL (zobacz [przykład Nodemailera](https://nodemailer.com/message/#amp-example)).                                                                                                                                                                                                                                                                                                                                              |
| `icalEvent`       | Nie      | Object           | Wydarzenie iCalendar do użycia jako alternatywna treść wiadomości (zobacz [wydarzenia kalendarza Nodemailera](https://nodemailer.com/message/calendar-events/)).                                                                                                                                                                                                                                                                                                |
| `alternatives`    | Nie      | Array            | Tablica alternatywnej treści wiadomości (zobacz [alternatywne treści Nodemailera](https://nodemailer.com/message/alternatives/)).                                                                                                                                                                                                                                                                                                                                |
| `encoding`        | Nie      | String           | Kodowanie dla tekstu i HTML (domyślnie `"utf-8"`, obsługuje także `"hex"` i `"base64"`).                                                                                                                                                                                                                                                                                                                                                                         |
| `raw`             | Nie      | String lub Buffer| Niestandardowa wygenerowana wiadomość w formacie RFC822 do użycia (zamiast generowanej przez Nodemailera – zobacz [niestandardowe źródło Nodemailera](https://nodemailer.com/message/custom-source/)).                                                                                                                                                                                                                                                            |
| `textEncoding`    | Nie      | String           | Kodowanie wymuszane dla wartości tekstowych (może być `"quoted-printable"` lub `"base64"`). Domyślnie jest to najbliższa wykryta wartość (dla ASCII użyj `"quoted-printable"`).                                                                                                                                                                                                                                                                               |
| `priority`        | Nie      | String           | Poziom priorytetu wiadomości (może być `"high"`, `"normal"` (domyślnie) lub `"low"`). Wartość `"normal"` nie ustawia nagłówka priorytetu (to domyślne zachowanie). Jeśli ustawiono `"high"` lub `"low"`, nagłówki `X-Priority`, `X-MSMail-Priority` i `Importance` [zostaną ustawione odpowiednio](https://github.com/nodemailer/nodemailer/blob/19fce2dc4dcb83224acaf1cfc890d08126309594/lib/mailer/mail-message.js#L222-L240). |
| `headers`         | Nie      | Object lub Array | Obiekt lub tablica dodatkowych nagłówków do ustawienia (zobacz [niestandardowe nagłówki Nodemailera](https://nodemailer.com/message/custom-headers/)).                                                                                                                                                                                                                                                                                                         |
| `messageId`       | Nie      | String           | Opcjonalna wartość Message-ID dla nagłówka "Message-ID" (domyślna wartość zostanie automatycznie wygenerowana, jeśli nie ustawiono – wartość powinna [spełniać specyfikację RFC2822](https://stackoverflow.com/a/4031705)).                                                                                                                                                                                                                                        |
| `date`            | Nie      | String lub Date  | Opcjonalna wartość daty, która zostanie użyta, jeśli nagłówek Date będzie brakował po parsowaniu, w przeciwnym razie zostanie użyty aktualny czas UTC, jeśli nie ustawiono. Nagłówek daty nie może być więcej niż 30 dni do przodu względem aktualnego czasu.                                                                                                                                                                                               |
| `list`            | Nie      | Object           | Opcjonalny obiekt nagłówków `List-*` (zobacz [nagłówki list Nodemailera](https://nodemailer.com/message/list-headers/)).                                                                                                                                                                                                                                                                                                                                         |
> Przykładowe żądanie (token API):

```sh
curl -X POST BASE_URI/v1/emails \
  -u API_TOKEN: \
  -d "from=alias@DOMAIN_NAME" \
  -d "to=EMAIL" \
  -d "subject=test" \
  -d "text=test"
```

> Przykładowe żądanie (dane aliasu):

```sh
curl -X POST BASE_URI/v1/emails \
  -u "alias@DOMAIN_NAME:GENERATED_PASSWORD" \
  -d "from=alias@DOMAIN_NAME" \
  -d "to=EMAIL" \
  -d "subject=test" \
  -d "text=test"
```

> Przykładowe żądanie (surowy email):

```sh
curl -X POST BASE_URI/v1/emails \
  -u API_TOKEN: \
  -d "raw=`cat file.eml`"
```

### Pobierz wychodzący email SMTP {#retrieve-outbound-smtp-email}

> `GET /v1/emails/:id`

> Przykładowe żądanie:

```sh
curl BASE_URI/v1/emails/:id \
  -u API_TOKEN:
```

### Usuń wychodzący email SMTP {#delete-outbound-smtp-email}

Usunięcie emaila ustawi status na `"rejected"` (i w konsekwencji nie będzie przetwarzany w kolejce) tylko wtedy, gdy aktualny status to jeden z `"pending"`, `"queued"` lub `"deferred"`. Możemy automatycznie usuwać emaile po 30 dniach od ich utworzenia i/lub wysłania – dlatego powinieneś przechowywać kopię wychodzących emaili SMTP w swoim kliencie, bazie danych lub aplikacji. Możesz odwoływać się do naszej wartości ID emaila w swojej bazie danych, jeśli chcesz – ta wartość jest zwracana zarówno przez endpointy [Create email](#create-email), jak i [Retrieve email](#retrieve-email).

> `DELETE /v1/emails/:id`

> Przykładowe żądanie:

```sh
curl -X DELETE BASE_URI/v1/emails/:id \
  -u API_TOKEN:
```


## Domeny {#domains}

> \[!TIP]
> Endpointy domen z nazwą domeny <code>/v1/domains/:domain_name</code> jako ich endpointem są wymienne z ID domeny <code>:domain_id</code>. Oznacza to, że możesz odwoływać się do domeny albo przez jej <code>name</code>, albo przez <code>id</code>.

### Lista domen {#list-domains}

> \[!NOTE]
> Od 1 listopada 2024 endpointy API dla [List domains](#list-domains) i [List domain aliases](#list-domain-aliases) będą domyślnie zwracać maksymalnie `1000` wyników na stronę. Jeśli chcesz wcześniej skorzystać z tego zachowania, możesz dodać `?paginate=true` jako dodatkowy parametr zapytania do URL endpointu. Zobacz [Pagination](#pagination) po więcej informacji.

> `GET /v1/domains`

| Parametr zapytania     | Wymagany | Typ                       | Opis                                                                                                                                               |
| --------------------- | -------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `q`                   | Nie      | String (obsługuje RegExp) | Wyszukaj domeny po nazwie                                                                                                                         |
| `name`                | Nie      | String (obsługuje RegExp) | Wyszukaj domeny po nazwie                                                                                                                         |
| `sort`                | Nie      | String                    | Sortuj według konkretnego pola (poprzedź pojedynczym myślnikiem `-`, aby sortować w odwrotnym kierunku). Domyślnie `created_at`, jeśli nie ustawiono. |
| `page`                | Nie      | Number                    | Zobacz [Pagination](#pagination) po więcej informacji                                                                                            |
| `limit`               | Nie      | Number                    | Zobacz [Pagination](#pagination) po więcej informacji                                                                                            |

> Przykładowe żądanie:

```sh
curl BASE_URI/v1/domains \
  -u API_TOKEN:
```

### Utwórz domenę {#create-domain}

> `POST /v1/domains`

| Parametr w ciele żądania    | Wymagany | Typ                                           | Opis                                                                                                                                                                                                                                                                                                               |
| --------------------------- | -------- | --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `domain`                    | Tak      | String (FQDN lub IP)                          | W pełni kwalifikowana nazwa domeny ("FQDN") lub adres IP                                                                                                                                                                                                                                                          |
| `team_domain`               | Nie      | String (ID domeny lub nazwa domeny; FQDN)    | Automatycznie przypisz tę domenę do tego samego zespołu co inna domena. Oznacza to, że wszyscy członkowie z tej domeny zostaną przypisani jako członkowie zespołu, a `plan` zostanie automatycznie ustawiony na `team`. Możesz ustawić to na `"none"`, jeśli chcesz to wyraźnie wyłączyć, ale nie jest to konieczne. |
| `plan`                      | Nie      | String (enumeracja)                           | Typ planu (musi być `"free"`, `"enhanced_protection"` lub `"team"`, domyślnie `"free"` lub aktualny płatny plan użytkownika, jeśli jest)                                                                                                                                                                         |
| `catchall`                  | Nie      | String (adresy email rozdzielone) lub Boolean | Utwórz domyślny alias catch-all, domyślnie `true` (jeśli `true`, użyje adresu email użytkownika API jako odbiorcy, jeśli `false`, nie zostanie utworzony catch-all). Jeśli podano String, jest to lista adresów email rozdzielona (oddzielona znakiem nowej linii, spacją i/lub przecinkiem)                      |
| `has_adult_content_protection` | Nie      | Boolean                                       | Czy włączyć ochronę przed treściami dla dorosłych w skanerze spamu dla tej domeny                                                                                                                                                                                                                                   |
| `has_phishing_protection`   | Nie      | Boolean                                       | Czy włączyć ochronę przed phishingiem w skanerze spamu dla tej domeny                                                                                                                                                                                                                                               |
| `has_executable_protection` | Nie      | Boolean                                       | Czy włączyć ochronę przed plikami wykonywalnymi w skanerze spamu dla tej domeny                                                                                                                                                                                                                                     |
| `has_virus_protection`      | Nie      | Boolean                                       | Czy włączyć ochronę przed wirusami w skanerze spamu dla tej domeny                                                                                                                                                                                                                                                  |
| `has_recipient_verification`| Nie      | Boolean                                       | Globalna domyślna wartość domeny, czy wymagać od odbiorców aliasów kliknięcia w link weryfikacyjny emaila, aby wiadomości mogły przejść                                                                                                                                                                           |
| `ignore_mx_check`           | Nie      | Boolean                                       | Czy zignorować sprawdzanie rekordu MX domeny podczas weryfikacji. Jest to głównie dla użytkowników z zaawansowanymi regułami konfiguracji wymiany MX, którzy muszą zachować swoje istniejące rekordy MX i przekierować je do naszych.                                                                                 |
| `retention_days`            | Nie      | Number                                        | Liczba całkowita między `0` a `30`, odpowiadająca liczbie dni przechowywania wychodzących emaili SMTP po ich pomyślnym dostarczeniu lub trwałym błędzie. Domyślnie `0`, co oznacza, że wychodzące emaile SMTP są natychmiast usuwane i redagowane dla Twojego bezpieczeństwa.                                      |
| `bounce_webhook`            | Nie      | String (URL) lub Boolean (false)              | URL webhooka `http://` lub `https://` wybrany przez Ciebie, na który będą wysyłane webhooki odbić. Wykonamy żądanie `POST` do tego URL z informacjami o niepowodzeniach SMTP (np. miękkie lub twarde błędy – abyś mógł zarządzać swoimi subskrybentami i programowo zarządzać wychodzącymi emailami).                   |
| `max_quota_per_alias`       | Nie      | String                                        | Maksymalny limit pamięci dla aliasów na tej domenie. Wprowadź wartość taką jak "1 GB", która zostanie przetworzona przez [bytes](https://github.com/visionmedia/bytes.js).                                                                                                                                          |
> Przykładowe zapytanie:

```sh
curl -X POST BASE_URI/v1/domains \
  -u API_TOKEN: \
  -d domain=DOMAIN_NAME \
  -d plan=free
```

### Pobierz domenę {#retrieve-domain}

> `GET /v1/domains/DOMAIN_NAME`

> Przykładowe zapytanie:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME \
  -u API_TOKEN:
```

### Zweryfikuj rekordy domeny {#verify-domain-records}

> `GET /v1/domains/DOMAIN_NAME/verify-records`

> Przykładowe zapytanie:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/verify-records \
  -u API_TOKEN:
```

### Zweryfikuj rekordy SMTP domeny {#verify-domain-smtp-records}

> `GET /v1/domains/DOMAIN_NAME/verify-smtp`

> Przykładowe zapytanie:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/verify-smtp \
  -u API_TOKEN:
```

### Lista haseł catch-all dla całej domeny {#list-domain-wide-catch-all-passwords}

> `GET /v1/domains/DOMAIN_NAME/catch-all-passwords`

> Przykładowe zapytanie:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/catch-all-passwords \
  -u API_TOKEN:
```

### Utwórz hasło catch-all dla całej domeny {#create-domain-wide-catch-all-password}

> `POST /v1/domains/DOMAIN_NAME/catch-all-passwords`

| Parametr w ciele | Wymagany | Typ    | Opis                                                                                                                                                                                                                      |
| ---------------- | -------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `new_password`   | Nie      | String | Twoje własne nowe hasło do użycia jako hasło catch-all dla całej domeny.  Możesz pozostawić to pole puste lub całkowicie pominąć w ciele zapytania API, jeśli chcesz otrzymać losowo wygenerowane i silne hasło.             |
| `description`    | Nie      | String | Opis wyłącznie do celów organizacyjnych.                                                                                                                                                                                 |

> Przykładowe zapytanie:

```sh
curl BASE_URL/v1/domains/DOMAIN_NAME/catch-all-passwords \
  -u API_TOKEN:
```

### Usuń hasło catch-all dla całej domeny {#remove-domain-wide-catch-all-password}

> `DELETE /v1/domains/DOMAIN_NAME/catch-all-passwords/:token_id`

> Przykładowe zapytanie:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/catch-all-passwords/:token_id \
  -u API_TOKEN:
```

### Aktualizuj domenę {#update-domain}

> `PUT /v1/domains/DOMAIN_NAME`

| Parametr w ciele               | Wymagany | Typ                            | Opis                                                                                                                                                                                                                                                                                       |
| ----------------------------- | -------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `smtp_port`                   | Nie      | String lub Number              | Niestandardowy port do konfiguracji przekazywania SMTP (domyślnie `"25"`)                                                                                                                                                                                                                   |
| `has_adult_content_protection`| Nie      | Boolean                       | Czy włączyć ochronę przed treściami dla dorosłych w skanerze spamu dla tej domeny                                                                                                                                                                                                          |
| `has_phishing_protection`     | Nie      | Boolean                       | Czy włączyć ochronę przed phishingiem w skanerze spamu dla tej domeny                                                                                                                                                                                                                       |
| `has_executable_protection`   | Nie      | Boolean                       | Czy włączyć ochronę przed plikami wykonywalnymi w skanerze spamu dla tej domeny                                                                                                                                                                                                             |
| `has_virus_protection`        | Nie      | Boolean                       | Czy włączyć ochronę antywirusową w skanerze spamu dla tej domeny                                                                                                                                                                                                                           |
| `has_recipient_verification`  | Nie      | Boolean                       | Globalna domyślna wartość dla domeny określająca, czy odbiorcy aliasów muszą kliknąć link weryfikacyjny w e-mailu, aby wiadomości mogły być dostarczane                                                                                                                                   |
| `ignore_mx_check`             | Nie      | Boolean                       | Czy zignorować sprawdzanie rekordu MX dla domeny podczas weryfikacji.  Jest to głównie dla użytkowników z zaawansowanymi regułami konfiguracji wymiany MX, którzy muszą zachować istniejącą wymianę MX i przekierować ją do naszej.                                                        |
| `retention_days`              | Nie      | Number                        | Liczba całkowita między `0` a `30`, określająca liczbę dni przechowywania wychodzących wiadomości SMTP po ich pomyślnym dostarczeniu lub trwałym błędzie. Domyślnie `0`, co oznacza, że wychodzące wiadomości SMTP są natychmiast usuwane i redagowane dla Twojego bezpieczeństwa.          |
| `bounce_webhook`              | Nie      | String (URL) lub Boolean (false) | URL webhooka `http://` lub `https://` wybrany przez Ciebie, na który będą wysyłane webhooki zwrotne.  Wysłamy żądanie `POST` na ten URL z informacjami o niepowodzeniach wychodzących wiadomości SMTP (np. miękkie lub twarde błędy – abyś mógł zarządzać swoimi subskrybentami i programowo zarządzać wychodzącą pocztą). |
| `max_quota_per_alias`         | Nie      | String                        | Maksymalny limit pamięci dla aliasów na tej domenie.  Wprowadź wartość taką jak "1 GB", która zostanie przetworzona przez [bytes](https://github.com/visionmedia/bytes.js).                                                                                                               |
> Przykładowe żądanie:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME \
  -u API_TOKEN:
```

### Usuń domenę {#delete-domain}

> `DELETE /v1/domains/:domain_name`

> Przykładowe żądanie:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name \
  -u API_TOKEN:
```


## Zaproszenia {#invites}

### Zaakceptuj zaproszenie do domeny {#accept-domain-invite}

> `GET /v1/domains/:domain_name/invites`

> Przykładowe żądanie:

```sh
curl BASE_URI/v1/domains/:domain_name/invites \
  -u API_TOKEN:
```

### Utwórz zaproszenie do domeny {#create-domain-invite}

> `POST /v1/domains/DOMAIN_NAME/invites`

| Parametr w ciele | Wymagany | Typ                 | Opis                                                                                      |
| ---------------- | -------- | ------------------- | ----------------------------------------------------------------------------------------- |
| `email`          | Tak      | String (Email)      | Adres e-mail do zaproszenia na listę członków domeny                                     |
| `group`          | Tak      | String (enumerowalny) | Grupa, do której zostanie dodany użytkownik w członkostwie domeny (może to być `"admin"` lub `"user"`) |

> Przykładowe żądanie:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/invites \
  -u API_TOKEN: \
  -d "email=EMAIL" \
  -d group=admin
```

> \[!IMPORTANT]
> Jeśli użytkownik zapraszany jest już zaakceptowanym członkiem innych domen, których członkiem jest administrator zapraszający, zaproszenie zostanie automatycznie zaakceptowane i nie zostanie wysłany e-mail.

### Usuń zaproszenie do domeny {#remove-domain-invite}

> `DELETE /v1/domains/:domain_name/invites`

| Parametr w ciele | Wymagany | Typ           | Opis                                           |
| ---------------- | -------- | -------------- | ---------------------------------------------- |
| `email`          | Tak      | String (Email) | Adres e-mail do usunięcia z listy członków domeny |

> Przykładowe żądanie:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/invites \
  -u API_TOKEN:
```


## Członkowie {#members}

### Aktualizuj członka domeny {#update-domain-member}

> `PUT /v1/domains/DOMAIN_NAME/members/MEMBER_ID`

| Parametr w ciele | Wymagany | Typ                 | Opis                                                                                     |
| ---------------- | -------- | ------------------- | ---------------------------------------------------------------------------------------- |
| `group`          | Tak      | String (enumerowalny) | Grupa, do której zostanie zaktualizowany użytkownik w członkostwie domeny (może to być `"admin"` lub `"user"`) |

> Przykładowe żądanie:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME/members/MEMBER_ID \
  -u API_TOKEN:
```

### Usuń członka domeny {#remove-domain-member}

> `DELETE /v1/domains/:domain_name/members/:member_id`

> Przykładowe żądanie:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/members/:member_id \
  -u API_TOKEN:
```


## Aliasy {#aliases}

### Wygeneruj hasło aliasu {#generate-an-alias-password}

Zauważ, że jeśli nie wyślesz instrukcji e-mailem, nazwa użytkownika i hasło będą w ciele odpowiedzi JSON udanego żądania w formacie `{ username: 'alias@yourdomain.com', password: 'some-generated-password' }`.

> `POST /v1/domains/DOMAIN_NAME/aliases/ALIAS_ID/generate-password`

| Parametr w ciele      | Wymagany | Typ     | Opis                                                                                                                                                                                                                                                                                              |
| --------------------- | -------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `new_password`        | Nie      | String  | Twoje niestandardowe nowe hasło do użycia dla aliasu. Możesz pozostawić to pole puste lub całkowicie pominąć w ciele żądania API, jeśli chcesz otrzymać losowo wygenerowane i silne hasło.                                                                                                       |
| `password`            | Nie      | String  | Istniejące hasło aliasu, aby zmienić hasło bez usuwania istniejącej skrzynki IMAP (zobacz opcję `is_override` poniżej, jeśli nie masz już istniejącego hasła).                                                                                                                                     |
| `is_override`         | Nie      | Boolean | **UŻYWAJ Z OSTROŻNOŚCIĄ**: To całkowicie nadpisze istniejące hasło aliasu i bazę danych, trwale usuwając istniejącą pamięć IMAP i resetując bazę danych e-mail SQLite aliasu. Proszę wykonać kopię zapasową, jeśli to możliwe, jeśli masz istniejącą skrzynkę powiązaną z tym aliasem. |
| `emailed_instructions`| Nie      | String  | Adres e-mail, na który zostaną wysłane hasło aliasu i instrukcje konfiguracji.                                                                                                                                                                                                                   |
> Przykładowe zapytanie:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/aliases/ALIAS_ID/generate-password \
  -u API_TOKEN:
```

### Lista aliasów domeny {#list-domain-aliases}

> \[!NOTE]
> Od 1 listopada 2024 roku punkty końcowe API dla [List domains](#list-domains) oraz [List domain aliases](#list-domain-aliases) będą domyślnie zwracać maksymalnie `1000` wyników na stronę. Jeśli chcesz wcześniej włączyć to zachowanie, możesz dodać `?paginate=true` jako dodatkowy parametr zapytania do URL punktu końcowego. Zobacz [Pagination](#pagination) po więcej informacji.

> `GET /v1/domains/DOMAIN_NAME/aliases`

| Parametr zapytania      | Wymagany | Typ                       | Opis                                                                                                                                               |
| ---------------------- | -------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `q`                    | Nie      | String (obsługa RegExp)   | Wyszukaj aliasy w domenie po nazwie, etykiecie lub odbiorcy                                                                                       |
| `name`                 | Nie      | String (obsługa RegExp)   | Wyszukaj aliasy w domenie po nazwie                                                                                                              |
| `recipient`            | Nie      | String (obsługa RegExp)   | Wyszukaj aliasy w domenie po odbiorcy                                                                                                            |
| `sort`                 | Nie      | String                   | Sortuj według konkretnego pola (poprzedź pojedynczym myślnikiem `-`, aby sortować w odwrotnym kierunku). Domyślnie `created_at`, jeśli nie ustawiono. |
| `page`                 | Nie      | Number                   | Zobacz [Pagination](#pagination) po więcej informacji                                                                                             |
| `limit`                | Nie      | Number                   | Zobacz [Pagination](#pagination) po więcej informacji                                                                                             |

> Przykładowe zapytanie:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/aliases?pagination=true \
  -u API_TOKEN:
```

### Utwórz nowy alias domeny {#create-new-domain-alias}

> `POST /v1/domains/DOMAIN_NAME/aliases`

| Parametr w ciele zapytania    | Wymagany | Typ                                   | Opis                                                                                                                                                                                                                                                                                                                                                                                      |
| ----------------------------- | -------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `name`                        | Nie      | String                               | Nazwa aliasu (jeśli nie podano lub jest pusta, zostanie wygenerowany losowy alias)                                                                                                                                                                                                                                                                                                         |
| `recipients`                  | Nie      | String lub Array                     | Lista odbiorców (musi być to ciąg znaków rozdzielony znakami nowej linii/spacją/przecinkiem lub tablica poprawnych adresów email, w pełni kwalifikowanych nazw domen ("FQDN"), adresów IP i/lub URL webhooków – jeśli nie podano lub jest pusta tablica, jako odbiorca zostanie ustawiony adres email użytkownika wykonującego zapytanie API)                                                                 |
| `description`                 | Nie      | String                               | Opis aliasu                                                                                                                                                                                                                                                                                                                                                                               |
| `labels`                      | Nie      | String lub Array                     | Lista etykiet (musi być to ciąg znaków rozdzielony znakami nowej linii/spacją/przecinkiem lub tablica)                                                                                                                                                                                                                                                                                     |
| `has_recipient_verification`  | Nie      | Boolean                             | Wymagaj od odbiorców kliknięcia linku weryfikacyjnego w emailu, aby wiadomości mogły być przekazywane (domyślnie ustawienie domeny, jeśli nie ustawiono jawnie w ciele zapytania)                                                                                                                                                                                                           |
| `is_enabled`                  | Nie      | Boolean                             | Czy włączyć lub wyłączyć ten alias (jeśli wyłączony, wiadomości nie będą nigdzie kierowane, ale zwrócą poprawne kody statusu). Jeśli podano wartość, zostanie przekonwertowana na boolean za pomocą [boolean](https://github.com/thenativeweb/boolean#quick-start))                                                                                                                        |
| `error_code_if_disabled`      | Nie      | Number (może być `250`, `421` lub `550`) | Przychodzące wiadomości na ten alias zostaną odrzucone, jeśli `is_enabled` jest `false` z kodem `250` (ciche dostarczenie donikąd, np. czarna dziura lub `/dev/null`), `421` (odrzucenie tymczasowe; ponawianie przez około 5 dni) lub `550` (stała porażka i odrzucenie). Domyślnie `250`.                                                                                                  |
| `has_imap`                    | Nie      | Boolean                             | Czy włączyć lub wyłączyć przechowywanie IMAP dla tego aliasu (jeśli wyłączone, przychodzące wiadomości nie będą zapisywane w [przechowywaniu IMAP](/blog/docs/best-quantum-safe-encrypted-email-service). Jeśli podano wartość, zostanie przekonwertowana na boolean za pomocą [boolean](https://github.com/thenativeweb/boolean#quick-start))                                                         |
| `has_pgp`                     | Nie      | Boolean                             | Czy włączyć lub wyłączyć [szyfrowanie OpenPGP](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd) dla [zaszyfrowanego przechowywania email IMAP/POP3/CalDAV/CardDAV](/blog/docs/best-quantum-safe-encrypted-email-service) używając `public_key` aliasu.                                                                                                  |
| `public_key`                  | Nie      | String                               | Publiczny klucz OpenPGP w formacie ASCII Armor ([kliknij tutaj, aby zobaczyć przykład](/.well-known/openpgpkey/hu/mxqp8ogw4jfq83a58pn1wy1ccc1cx3f5.txt); np. klucz GPG dla `support@forwardemail.net`). Dotyczy tylko, jeśli `has_pgp` jest ustawione na `true`. [Dowiedz się więcej o szyfrowaniu end-to-end w naszym FAQ](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd). |
| `max_quota`                   | Nie      | String                               | Maksymalny limit przechowywania dla tego aliasu. Pozostaw puste, aby zresetować do aktualnego limitu domeny lub wpisz wartość, np. "1 GB", która zostanie przetworzona przez [bytes](https://github.com/visionmedia/bytes.js). Tę wartość mogą zmieniać tylko administratorzy domeny.                                                                                                         |
| `vacation_responder_is_enabled` | Nie      | Boolean                             | Czy włączyć lub wyłączyć automatyczną odpowiedź urlopową.                                                                                                                                                                                                                                                                                                                                  |
| `vacation_responder_start_date` | Nie      | String                               | Data rozpoczęcia automatycznej odpowiedzi urlopowej (jeśli włączona i nie ustawiono daty rozpoczęcia, zakłada się, że już trwa). Obsługujemy formaty dat takie jak `MM/DD/YYYY`, `YYYY-MM-DD` oraz inne formaty dzięki inteligentnemu parsowaniu za pomocą `dayjs`.                                                                                                                     |
| `vacation_responder_end_date`   | Nie      | String                               | Data zakończenia automatycznej odpowiedzi urlopowej (jeśli włączona i nie ustawiono daty zakończenia, zakłada się, że trwa bez końca i odpowiada zawsze). Obsługujemy formaty dat takie jak `MM/DD/YYYY`, `YYYY-MM-DD` oraz inne formaty dzięki inteligentnemu parsowaniu za pomocą `dayjs`.                                                                                                  |
| `vacation_responder_subject`    | Nie      | String                               | Temat w formacie tekstowym dla automatycznej odpowiedzi urlopowej, np. "Poza biurem". Używamy `striptags`, aby usunąć wszelki HTML.                                                                                                                                                                                                                                                        |
| `vacation_responder_message`    | Nie      | String                               | Treść wiadomości w formacie tekstowym dla automatycznej odpowiedzi urlopowej, np. "Będę poza biurem do lutego.". Używamy `striptags`, aby usunąć wszelki HTML.                                                                                                                                                                                                                              |
> Przykładowe żądanie:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/aliases \
  -u API_TOKEN:
```

### Pobierz alias domeny {#retrieve-domain-alias}

Możesz pobrać alias domeny za pomocą jego wartości `id` lub `name`.

> `GET /v1/domains/:domain_name/aliases/:alias_id`

> Przykładowe żądanie:

```sh
curl BASE_URI/v1/domains/:domain_name/aliases/:alias_id \
  -u API_TOKEN:
```

> `GET /v1/domains/:domain_name/aliases/:alias_name`

> Przykładowe żądanie:

```sh
curl BASE_URI/v1/domains/:domain_name/aliases/:alias_name \
  -u API_TOKEN:
```

### Aktualizuj alias domeny {#update-domain-alias}

> `PUT /v1/domains/DOMAIN_NAME/aliases/ALIAS_ID`

| Parametr w ciele                | Wymagany | Typ                                    | Opis                                                                                                                                                                                                                                                                                                                                                                                       |
| ------------------------------- | -------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`                          | Nie      | String                                 | Nazwa aliasu                                                                                                                                                                                                                                                                                                                                                                               |
| `recipients`                    | Nie      | String lub Tablica                     | Lista odbiorców (musi być ciągiem znaków rozdzielonym znakami nowej linii/spacją/przecinkiem lub tablicą zawierającą poprawne adresy e-mail, w pełni kwalifikowane nazwy domen ("FQDN"), adresy IP i/lub adresy URL webhooków)                                                                                                                                                                   |
| `description`                   | Nie      | String                                 | Opis aliasu                                                                                                                                                                                                                                                                                                                                                                                |
| `labels`                        | Nie      | String lub Tablica                     | Lista etykiet (musi być ciągiem znaków rozdzielonym znakami nowej linii/spacją/przecinkiem lub tablicą)                                                                                                                                                                                                                                                                                    |
| `has_recipient_verification`    | Nie      | Boolean                                | Wymaga od odbiorców kliknięcia linku weryfikacyjnego w e-mailu, aby wiadomości mogły być przekazywane dalej (domyślnie ustawienie domeny, jeśli nie jest wyraźnie określone w ciele żądania)                                                                                                                                                                                                 |
| `is_enabled`                    | Nie      | Boolean                                | Czy włączyć lub wyłączyć ten alias (jeśli wyłączony, e-maile nie będą kierowane nigdzie, ale zwrócą poprawne kody statusu). Jeśli wartość zostanie podana, zostanie przekonwertowana na boolean za pomocą [boolean](https://github.com/thenativeweb/boolean#quick-start))                                                                                                                   |
| `error_code_if_disabled`        | Nie      | Liczba (może być `250`, `421` lub `550`) | Przychodzące e-maile do tego aliasu zostaną odrzucone, jeśli `is_enabled` jest `false` z kodem `250` (ciche dostarczenie donikąd, np. czarna dziura lub `/dev/null`), `421` (odrzucenie tymczasowe; ponawianie próby przez około 5 dni) lub `550` (stała awaria i odrzucenie). Domyślnie `250`.                                                                                                   |
| `has_imap`                      | Nie      | Boolean                                | Czy włączyć lub wyłączyć przechowywanie IMAP dla tego aliasu (jeśli wyłączone, przychodzące e-maile nie będą zapisywane w [przechowywaniu IMAP](/blog/docs/best-quantum-safe-encrypted-email-service). Jeśli wartość zostanie podana, zostanie przekonwertowana na boolean za pomocą [boolean](https://github.com/thenativeweb/boolean#quick-start))                                                  |
| `has_pgp`                       | Nie      | Boolean                                | Czy włączyć lub wyłączyć [szyfrowanie OpenPGP](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd) dla [zaszyfrowanego przechowywania e-maili IMAP/POP3/CalDAV/CardDAV](/blog/docs/best-quantum-safe-encrypted-email-service) używając `public_key` aliasu.                                                                                                   |
| `public_key`                    | Nie      | String                                 | Publiczny klucz OpenPGP w formacie ASCII Armor ([kliknij tutaj, aby zobaczyć przykład](/.well-known/openpgpkey/hu/mxqp8ogw4jfq83a58pn1wy1ccc1cx3f5.txt); np. klucz GPG dla `support@forwardemail.net`). Dotyczy tylko, jeśli `has_pgp` jest ustawione na `true`. [Dowiedz się więcej o szyfrowaniu end-to-end w naszym FAQ](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd). |
| `max_quota`                     | Nie      | String                                 | Maksymalny limit pamięci dla tego aliasu. Pozostaw puste, aby zresetować do aktualnego limitu domeny lub wpisz wartość taką jak "1 GB", która zostanie przetworzona przez [bytes](https://github.com/visionmedia/bytes.js). Tę wartość mogą zmieniać tylko administratorzy domeny.                                                                                                         |
| `vacation_responder_is_enabled` | Nie      | Boolean                                | Czy włączyć lub wyłączyć automatyczną odpowiedź urlopową.                                                                                                                                                                                                                                                                                                                                 |
| `vacation_responder_start_date` | Nie      | String                                 | Data rozpoczęcia automatycznej odpowiedzi urlopowej (jeśli włączona i nie ustawiono daty rozpoczęcia, przyjmuje się, że już się rozpoczęła). Obsługujemy formaty dat takie jak `MM/DD/YYYY`, `YYYY-MM-DD` oraz inne formaty dzięki inteligentnemu parsowaniu za pomocą `dayjs`.                                                                                                         |
| `vacation_responder_end_date`   | Nie      | String                                 | Data zakończenia automatycznej odpowiedzi urlopowej (jeśli włączona i nie ustawiono daty zakończenia, przyjmuje się, że trwa ona bezterminowo). Obsługujemy formaty dat takie jak `MM/DD/YYYY`, `YYYY-MM-DD` oraz inne formaty dzięki inteligentnemu parsowaniu za pomocą `dayjs`.                                                                                                       |
| `vacation_responder_subject`    | Nie      | String                                 | Temat w formacie tekstowym dla automatycznej odpowiedzi urlopowej, np. "Poza biurem". Używamy `striptags`, aby usunąć wszelki HTML.                                                                                                                                                                                                                                                       |
| `vacation_responder_message`    | Nie      | String                                 | Treść wiadomości w formacie tekstowym dla automatycznej odpowiedzi urlopowej, np. "Będę poza biurem do lutego.". Używamy `striptags`, aby usunąć wszelki HTML.                                                                                                                                                                                                                             |
> Przykładowe zapytanie:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME/aliases/ALIAS_ID \
  -u API_TOKEN:
```

### Usuń alias domeny {#delete-domain-alias}

> `DELETE /v1/domains/:domain_name/aliases/:alias_id`

> Przykładowe zapytanie:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/aliases/:alias_id \
  -u API_TOKEN:
```


## Szyfruj {#encrypt}

Pozwalamy na szyfrowanie rekordów nawet w darmowym planie bez dodatkowych kosztów. Prywatność nie powinna być funkcją, powinna być wbudowana we wszystkie aspekty produktu. Na prośbę wielu użytkowników w [dyskusji Privacy Guides](https://discuss.privacyguides.net/t/forward-email-email-provider/13370) oraz na [naszych zgłoszeniach GitHub](https://github.com/forwardemail/forwardemail.net/issues/254) dodaliśmy tę funkcję.

### Szyfruj rekord TXT {#encrypt-txt-record}

> `POST /v1/encrypt`

| Parametr w ciele | Wymagany | Typ    | Opis                                         |
| ---------------- | -------- | ------ | -------------------------------------------- |
| `input`          | Tak      | String | Dowolny poprawny, niezaszyfrowany rekord TXT Forward Email |

> Przykładowe zapytanie:

```sh
curl -X POST BASE_URI/v1/encrypt \
  -d "input=user@gmail.com"
```
