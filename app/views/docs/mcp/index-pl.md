# Forward Email MCP Server {#forward-email-mcp-server}

<img loading="lazy" src="/img/articles/mcp.webp" alt="Forward Email MCP Server" class="rounded-lg" />

<p class="lead mt-3">
  <strong>TL;DR:</strong> Nasz <a href="https://github.com/forwardemail/mcp-server">otwartoźródłowy serwer MCP</a> pozwala asystentom AI takim jak Claude, ChatGPT, Cursor i Windsurf zarządzać Twoją pocztą, domenami, aliasami, kontaktami i kalendarzami za pomocą języka naturalnego. Wszystkie 68 punktów końcowych API jest udostępnionych jako narzędzia MCP. Działa lokalnie przez <code>npx @forwardemail/mcp-server</code> — Twoje dane uwierzytelniające nigdy nie opuszczają Twojego urządzenia.
</p>


## Spis treści {#table-of-contents}

* [Czym jest MCP?](#what-is-mcp)
* [Szybki start](#quick-start)
  * [Uzyskaj klucz API](#get-an-api-key)
  * [Claude Desktop](#claude-desktop)
  * [Cursor](#cursor)
  * [Windsurf](#windsurf)
  * [Inni klienci MCP](#other-mcp-clients)
* [Uwierzytelnianie](#authentication)
  * [Uwierzytelnianie kluczem API](#api-key-auth)
  * [Uwierzytelnianie aliasem](#alias-auth)
  * [Generowanie hasła aliasu](#generating-an-alias-password)
* [Wszystkie 68 narzędzi](#all-68-tools)
  * [Konto (uwierzytelnianie kluczem API lub aliasem)](#account-api-key-or-alias-auth)
  * [Domeny (klucz API)](#domains-api-key)
  * [Aliasy (klucz API)](#aliases-api-key)
  * [E-maile — SMTP wychodzący (klucz API; Send obsługuje oba)](#emails--outbound-smtp-api-key-send-supports-both)
  * [Wiadomości — IMAP (uwierzytelnianie aliasem)](#messages--imap-alias-auth)
  * [Foldery — IMAP (uwierzytelnianie aliasem)](#folders--imap-alias-auth)
  * [Kontakty — CardDAV (uwierzytelnianie aliasem)](#contacts--carddav-alias-auth)
  * [Kalendarze — CalDAV (uwierzytelnianie aliasem)](#calendars--caldav-alias-auth)
  * [Wydarzenia kalendarza — CalDAV (uwierzytelnianie aliasem)](#calendar-events--caldav-alias-auth)
  * [Skrypty Sieve (klucz API)](#sieve-scripts-api-key)
  * [Skrypty Sieve (uwierzytelnianie aliasem)](#sieve-scripts-alias-auth)
  * [Członkowie domeny i zaproszenia (klucz API)](#domain-members-and-invites-api-key)
  * [Hasła catch-all (klucz API)](#catch-all-passwords-api-key)
  * [Logi (klucz API)](#logs-api-key)
  * [Szyfrowanie (bez uwierzytelniania)](#encrypt-no-auth)
* [20 rzeczywistych zastosowań](#20-real-world-use-cases)
  * [1. Selekcja e-maili](#1-email-triage)
  * [2. Automatyzacja konfiguracji domeny](#2-domain-setup-automation)
  * [3. Masowe zarządzanie aliasami](#3-bulk-alias-management)
  * [4. Monitorowanie kampanii e-mailowych](#4-email-campaign-monitoring)
  * [5. Synchronizacja i porządkowanie kontaktów](#5-contact-sync-and-cleanup)
  * [6. Zarządzanie kalendarzem](#6-calendar-management)
  * [7. Automatyzacja skryptów Sieve](#7-sieve-script-automation)
  * [8. Wprowadzanie zespołu](#8-team-onboarding)
  * [9. Audyt bezpieczeństwa](#9-security-auditing)
  * [10. Konfiguracja przekazywania e-maili](#10-email-forwarding-setup)
  * [11. Wyszukiwanie i analiza skrzynki odbiorczej](#11-inbox-search-and-analysis)
  * [12. Organizacja folderów](#12-folder-organization)
  * [13. Rotacja haseł](#13-password-rotation)
  * [14. Szyfrowanie rekordów DNS](#14-dns-record-encryption)
  * [15. Analiza logów dostarczenia](#15-delivery-log-analysis)
  * [16. Zarządzanie wieloma domenami](#16-multi-domain-management)
  * [17. Konfiguracja catch-all](#17-catch-all-configuration)
  * [18. Zarządzanie zaproszeniami do domeny](#18-domain-invite-management)
  * [19. Testowanie przechowywania S3](#19-s3-storage-testing)
  * [20. Kompozycja szkiców e-maili](#20-email-draft-composition)
* [Przykładowe polecenia](#example-prompts)
* [Zmienne środowiskowe](#environment-variables)
* [Bezpieczeństwo](#security)
* [Użycie programistyczne](#programmatic-usage)
* [Open Source](#open-source)


## Czym jest MCP? {#what-is-mcp}

[Model Context Protocol](https://modelcontextprotocol.io) (MCP) to otwarty standard stworzony przez Anthropic, który pozwala modelom AI bezpiecznie wywoływać zewnętrzne narzędzia. Zamiast kopiować i wklejać odpowiedzi API do okna czatu, MCP daje modelowi bezpośredni, ustrukturyzowany dostęp do Twoich usług.

Nasz serwer MCP opakowuje całe [Forward Email API](/email-api) — każdy punkt końcowy, każdy parametr — i udostępnia je jako narzędzia, z których może korzystać każdy klient zgodny z MCP. Serwer działa lokalnie na Twoim urządzeniu, używając transportu stdio. Twoje dane uwierzytelniające pozostają w zmiennych środowiskowych i nigdy nie są wysyłane do modelu AI.


## Szybki start {#quick-start}

### Uzyskaj klucz API {#get-an-api-key}
1. Zaloguj się na swoje [konto Forward Email](/my-account/domains).
2. Przejdź do **Moje konto** → **Bezpieczeństwo** → **Klucze API**.
3. Wygeneruj nowy klucz API i skopiuj go.

### Claude Desktop {#claude-desktop}

Dodaj to do pliku konfiguracyjnego Claude Desktop:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "forwardemail": {
      "command": "npx",
      "args": ["-y", "@forwardemail/mcp-server"],
      "env": {
        "FORWARD_EMAIL_API_KEY": "your-api-key-here",
        "FORWARD_EMAIL_ALIAS_USER": "you@example.com",
        "FORWARD_EMAIL_ALIAS_PASSWORD": "your-generated-alias-password"
      }
    }
  }
}
```

Uruchom ponownie Claude Desktop. Powinieneś zobaczyć narzędzia Forward Email w selektorze narzędzi.

> **Uwaga:** Zmienne `FORWARD_EMAIL_ALIAS_USER` i `FORWARD_EMAIL_ALIAS_PASSWORD` są opcjonalne, ale wymagane dla narzędzi skrzynki pocztowej (wiadomości, foldery, kontakty, kalendarze). Szczegóły znajdziesz w sekcji [Uwierzytelnianie](#authentication).

### Cursor {#cursor}

Otwórz Ustawienia Cursor → MCP → Dodaj serwer:

```json
{
  "mcpServers": {
    "forwardemail": {
      "command": "npx",
      "args": ["-y", "@forwardemail/mcp-server"],
      "env": {
        "FORWARD_EMAIL_API_KEY": "your-api-key-here",
        "FORWARD_EMAIL_ALIAS_USER": "you@example.com",
        "FORWARD_EMAIL_ALIAS_PASSWORD": "your-generated-alias-password"
      }
    }
  }
}
```

### Windsurf {#windsurf}

Otwórz Ustawienia Windsurf → MCP → Dodaj serwer z tą samą konfiguracją co powyżej.

### Inni klienci MCP {#other-mcp-clients}

Każdy klient obsługujący transport MCP stdio będzie działał. Komenda to:

```sh
FORWARD_EMAIL_API_KEY=your-api-key \
  FORWARD_EMAIL_ALIAS_USER=you@example.com \
  FORWARD_EMAIL_ALIAS_PASSWORD=your-generated-alias-password \
  npx @forwardemail/mcp-server
```


## Uwierzytelnianie {#authentication}

API Forward Email używa **uwierzytelniania HTTP Basic** z dwoma różnymi typami poświadczeń w zależności od punktu końcowego. Serwer MCP obsługuje to automatycznie — wystarczy podać odpowiednie poświadczenia.

### Uwierzytelnianie kluczem API {#api-key-auth}

Większość punktów końcowych zarządzania (domeny, aliasy, wychodzące e-maile, logi) używa Twojego **klucza API** jako nazwy użytkownika Basic auth z pustym hasłem.

To ten sam klucz API, którego używasz dla REST API. Ustaw go przez zmienną środowiskową `FORWARD_EMAIL_API_KEY`.

### Uwierzytelnianie aliasem {#alias-auth}

Punkty końcowe skrzynki pocztowej (wiadomości, foldery, kontakty, kalendarze, skrypty sieve przypisane do aliasu) używają **poświadczeń aliasu** — adresu e-mail aliasu jako nazwy użytkownika oraz wygenerowanego hasła jako hasła.

Te punkty końcowe uzyskują dostęp do danych przypisanych do aliasu przez protokoły IMAP, CalDAV i CardDAV. Wymagają adresu e-mail aliasu i wygenerowanego hasła, a nie klucza API.

Poświadczenia aliasu możesz podać na dwa sposoby:

1. **Zmienne środowiskowe** (zalecane dla domyślnego aliasu): ustaw `FORWARD_EMAIL_ALIAS_USER` i `FORWARD_EMAIL_ALIAS_PASSWORD`.
2. **Parametry wywołania narzędzia**: przekaż `alias_username` i `alias_password` jako argumenty do dowolnego narzędzia wymagającego uwierzytelnienia aliasem. Nadpisują one zmienne środowiskowe, co jest przydatne przy pracy z wieloma aliasami.

### Generowanie hasła aliasu {#generating-an-alias-password}

Zanim użyjesz narzędzi uwierzytelnianych aliasem, musisz wygenerować hasło dla aliasu. Możesz to zrobić za pomocą narzędzia `generateAliasPassword` lub przez API:

```sh
curl -u "YOUR_API_KEY:" \
  https://api.forwardemail.net/v1/domains/example.com/aliases/ALIAS_ID/generate-password \
  -X POST
```

Odpowiedź zawiera pola `username` (adres e-mail aliasu) oraz `password`. Użyj ich jako poświadczeń aliasu.

> **Wskazówka:** Możesz też zapytać swojego asystenta AI: *"Wygeneruj hasło dla aliasu <user@example.com> na domenie example.com"* — wywoła on narzędzie `generateAliasPassword` i zwróci poświadczenia.

Poniższa tabela podsumowuje, jaką metodę uwierzytelniania wymaga każda grupa narzędzi:

| Grupa narzędzi                                                | Metoda uwierzytelniania   | Poświadczenia                                              |
| ------------------------------------------------------------- | ------------------------- | ---------------------------------------------------------- |
| Konto                                                         | Klucz API **lub** Alias   | Dowolna                                                    |
| Domeny, Aliasy, Członkowie domeny, Zaproszenia, Hasła Catch-All | Klucz API                 | `FORWARD_EMAIL_API_KEY`                                    |
| Wychodzące e-maile (lista, pobierz, usuń, limit)              | Klucz API                 | `FORWARD_EMAIL_API_KEY`                                    |
| Wysyłanie e-maili                                             | Klucz API **lub** Alias   | Dowolna                                                    |
| Wiadomości (IMAP)                                             | Alias                     | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Foldery (IMAP)                                                | Alias                     | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Kontakty (CardDAV)                                           | Alias                     | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Kalendarze (CalDAV)                                          | Alias                     | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Wydarzenia kalendarza (CalDAV)                              | Alias                     | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Skrypty Sieve (przypisane do domeny)                        | Klucz API                 | `FORWARD_EMAIL_API_KEY`                                    |
| Skrypty Sieve (przypisane do aliasu)                        | Alias                     | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Logi                                                         | Klucz API                 | `FORWARD_EMAIL_API_KEY`                                    |
| Szyfrowanie                                                  | Brak                      | Nie są potrzebne poświadczenia                             |
## Wszystkie 68 narzędzi {#all-68-tools}

Każde narzędzie odpowiada bezpośrednio punktowi końcowemu [Forward Email API](/email-api). Parametry używają tych samych nazw co dokumentacja API. Metoda uwierzytelniania jest podana w nagłówku każdej sekcji.

### Konto (uwierzytelnianie kluczem API lub aliasem) {#account-api-key-or-alias-auth}

Przy uwierzytelnianiu kluczem API zwracają informacje o Twoim koncie użytkownika. Przy uwierzytelnianiu aliasem zwracają informacje o aliasie/skrzynce, w tym limit pamięci i ustawienia.

| Narzędzie       | Punkt końcowy API   | Opis                         |
| --------------- | ------------------- | ---------------------------- |
| `getAccount`    | `GET /v1/account`   | Pobierz informacje o koncie  |
| `updateAccount` | `PUT /v1/account`   | Zaktualizuj ustawienia konta |

### Domeny (klucz API) {#domains-api-key}

| Narzędzie             | Punkt końcowy API                                | Opis                        |
| --------------------- | ------------------------------------------------ | ---------------------------- |
| `listDomains`         | `GET /v1/domains`                               | Wyświetl wszystkie domeny    |
| `createDomain`        | `POST /v1/domains`                              | Dodaj nową domenę            |
| `getDomain`           | `GET /v1/domains/:domain_id`                    | Pobierz szczegóły domeny     |
| `updateDomain`        | `PUT /v1/domains/:domain_id`                    | Zaktualizuj ustawienia domeny|
| `deleteDomain`        | `DELETE /v1/domains/:domain_id`                 | Usuń domenę                  |
| `verifyDomainRecords` | `GET /v1/domains/:domain_id/verify-records`    | Zweryfikuj rekordy DNS       |
| `verifySmtpRecords`   | `GET /v1/domains/:domain_id/verify-smtp`       | Zweryfikuj konfigurację SMTP |
| `testS3Connection`    | `POST /v1/domains/:domain_id/test-s3-connection` | Przetestuj niestandardowe przechowywanie S3 |

### Aliasy (klucz API) {#aliases-api-key}

| Narzędzie                | Punkt końcowy API                                                   | Opis                                         |
| ------------------------ | ------------------------------------------------------------------- | --------------------------------------------- |
| `listAliases`            | `GET /v1/domains/:domain_id/aliases`                               | Wyświetl aliasy dla domeny                     |
| `createAlias`            | `POST /v1/domains/:domain_id/aliases`                              | Utwórz nowy alias                             |
| `getAlias`               | `GET /v1/domains/:domain_id/aliases/:alias_id`                     | Pobierz szczegóły aliasu                      |
| `updateAlias`            | `PUT /v1/domains/:domain_id/aliases/:alias_id`                     | Zaktualizuj alias                            |
| `deleteAlias`            | `DELETE /v1/domains/:domain_id/aliases/:alias_id`                  | Usuń alias                                   |
| `generateAliasPassword`  | `POST /v1/domains/:domain_id/aliases/:alias_id/generate-password`  | Wygeneruj hasło IMAP/SMTP dla uwierzytelniania aliasu |

### E-maile — SMTP wychodzący (klucz API; Send obsługuje oba) {#emails--outbound-smtp-api-key-send-supports-both}

| Narzędzie       | Punkt końcowy API       | Uwierzytelnianie         | Opis                          |
| --------------- | ----------------------- | ------------------------ | ----------------------------- |
| `sendEmail`     | `POST /v1/emails`       | Klucz API lub alias      | Wyślij e-mail przez SMTP      |
| `listEmails`    | `GET /v1/emails`        | Klucz API                | Wyświetl e-maile wychodzące   |
| `getEmail`      | `GET /v1/emails/:id`    | Klucz API                | Pobierz szczegóły i status e-maila |
| `deleteEmail`   | `DELETE /v1/emails/:id` | Klucz API                | Usuń e-mail z kolejki         |
| `getEmailLimit` | `GET /v1/emails/limit`  | Klucz API                | Sprawdź limit wysyłki         |

Narzędzie `sendEmail` akceptuje `from`, `to`, `cc`, `bcc`, `subject`, `text`, `html` oraz `attachments`. Jest to to samo co punkt końcowy `POST /v1/emails`.

### Wiadomości — IMAP (uwierzytelnianie aliasem) {#messages--imap-alias-auth}

> **Wymaga danych uwierzytelniających aliasu.** Przekaż `alias_username` i `alias_password` lub ustaw zmienne środowiskowe `FORWARD_EMAIL_ALIAS_USER` i `FORWARD_EMAIL_ALIAS_PASSWORD`.
| Narzędzie       | Punkt końcowy API          | Opis                                |
| --------------- | -------------------------- | ---------------------------------- |
| `listMessages`  | `GET /v1/messages`         | Wyświetl i wyszukaj wiadomości w skrzynce pocztowej |
| `createMessage` | `POST /v1/messages`        | Utwórz szkic lub prześlij wiadomość |
| `getMessage`    | `GET /v1/messages/:id`     | Pobierz wiadomość według ID         |
| `updateMessage` | `PUT /v1/messages/:id`     | Aktualizuj flagi (przeczytane, oznaczone gwiazdką itp.) |
| `deleteMessage` | `DELETE /v1/messages/:id`  | Usuń wiadomość                     |

Narzędzie `listMessages` obsługuje ponad 15 parametrów wyszukiwania, w tym `subject`, `from`, `to`, `text`, `since`, `before`, `is_unread` oraz `has_attachment`. Zobacz [dokumentację API](/email-api) dla pełnej listy.

### Foldery — IMAP (uwierzytelnianie aliasem) {#folders--imap-alias-auth}

> **Wymaga danych uwierzytelniających aliasu.** Przekaż `alias_username` i `alias_password` lub ustaw zmienne środowiskowe `FORWARD_EMAIL_ALIAS_USER` i `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Narzędzie      | Punkt końcowy API         | Opis                     |
| -------------- | ------------------------- | ------------------------ |
| `listFolders`  | `GET /v1/folders`         | Wyświetl wszystkie foldery skrzynki |
| `createFolder` | `POST /v1/folders`        | Utwórz nowy folder       |
| `getFolder`    | `GET /v1/folders/:id`     | Pobierz szczegóły folderu |
| `updateFolder` | `PUT /v1/folders/:id`     | Zmień nazwę folderu      |
| `deleteFolder` | `DELETE /v1/folders/:id`  | Usuń folder              |

### Kontakty — CardDAV (uwierzytelnianie aliasem) {#contacts--carddav-alias-auth}

> **Wymaga danych uwierzytelniających aliasu.** Przekaż `alias_username` i `alias_password` lub ustaw zmienne środowiskowe `FORWARD_EMAIL_ALIAS_USER` i `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Narzędzie       | Punkt końcowy API         | Opis                    |
| --------------- | ------------------------- | ----------------------- |
| `listContacts`  | `GET /v1/contacts`        | Wyświetl wszystkie kontakty |
| `createContact` | `POST /v1/contacts`       | Utwórz nowy kontakt     |
| `getContact`    | `GET /v1/contacts/:id`    | Pobierz szczegóły kontaktu |
| `updateContact` | `PUT /v1/contacts/:id`    | Aktualizuj kontakt      |
| `deleteContact` | `DELETE /v1/contacts/:id` | Usuń kontakt            |

### Kalendarze — CalDAV (uwierzytelnianie aliasem) {#calendars--caldav-alias-auth}

> **Wymaga danych uwierzytelniających aliasu.** Przekaż `alias_username` i `alias_password` lub ustaw zmienne środowiskowe `FORWARD_EMAIL_ALIAS_USER` i `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Narzędzie        | Punkt końcowy API          | Opis                    |
| ---------------- | -------------------------- | ----------------------- |
| `listCalendars`  | `GET /v1/calendars`        | Wyświetl wszystkie kalendarze |
| `createCalendar` | `POST /v1/calendars`       | Utwórz nowy kalendarz   |
| `getCalendar`    | `GET /v1/calendars/:id`    | Pobierz szczegóły kalendarza |
| `updateCalendar` | `PUT /v1/calendars/:id`    | Aktualizuj kalendarz    |
| `deleteCalendar` | `DELETE /v1/calendars/:id` | Usuń kalendarz          |

### Wydarzenia kalendarza — CalDAV (uwierzytelnianie aliasem) {#calendar-events--caldav-alias-auth}

> **Wymaga danych uwierzytelniających aliasu.** Przekaż `alias_username` i `alias_password` lub ustaw zmienne środowiskowe `FORWARD_EMAIL_ALIAS_USER` i `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Narzędzie             | Punkt końcowy API               | Opis                   |
| --------------------- | ------------------------------ | ---------------------- |
| `listCalendarEvents`  | `GET /v1/calendar-events`      | Wyświetl wszystkie wydarzenia |
| `createCalendarEvent` | `POST /v1/calendar-events`     | Utwórz nowe wydarzenie |
| `getCalendarEvent`    | `GET /v1/calendar-events/:id`  | Pobierz szczegóły wydarzenia |
| `updateCalendarEvent` | `PUT /v1/calendar-events/:id`  | Aktualizuj wydarzenie  |
| `deleteCalendarEvent` | `DELETE /v1/calendar-events/:id` | Usuń wydarzenie       |

### Skrypty Sieve (klucz API) {#sieve-scripts-api-key}

Te używają ścieżek z zakresem domeny i uwierzytelniają się za pomocą klucza API.

| Narzędzie             | Punkt końcowy API                                                              | Opis                      |
| --------------------- | ----------------------------------------------------------------------------- | ------------------------- |
| `listSieveScripts`    | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve`                          | Wyświetl skrypty dla aliasu |
| `createSieveScript`   | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve`                         | Utwórz nowy skrypt        |
| `getSieveScript`      | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id`               | Pobierz szczegóły skryptu |
| `updateSieveScript`   | `PUT /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id`               | Aktualizuj skrypt         |
| `deleteSieveScript`   | `DELETE /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id`            | Usuń skrypt               |
| `activateSieveScript` | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id/activate`     | Aktywuj skrypt            |
### Skrypty Sieve (Alias Auth) {#sieve-scripts-alias-auth}

Te używają uwierzytelniania na poziomie aliasu. Przydatne do automatyzacji na poziomie aliasu bez potrzeby klucza API.

> **Wymaga poświadczeń aliasu.** Przekaż `alias_username` i `alias_password` lub ustaw zmienne środowiskowe `FORWARD_EMAIL_ALIAS_USER` i `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Narzędzie                      | Punkt końcowy API                            | Opis               |
| ------------------------------ | -------------------------------------------- | ------------------- |
| `listSieveScriptsAliasAuth`    | `GET /v1/sieve-scripts`                      | Lista skryptów      |
| `createSieveScriptAliasAuth`   | `POST /v1/sieve-scripts`                     | Utwórz skrypt       |
| `getSieveScriptAliasAuth`      | `GET /v1/sieve-scripts/:script_id`           | Pobierz szczegóły skryptu |
| `updateSieveScriptAliasAuth`   | `PUT /v1/sieve-scripts/:script_id`           | Aktualizuj skrypt   |
| `deleteSieveScriptAliasAuth`   | `DELETE /v1/sieve-scripts/:script_id`        | Usuń skrypt         |
| `activateSieveScriptAliasAuth` | `POST /v1/sieve-scripts/:script_id/activate` | Aktywuj skrypt      |

### Członkowie domeny i zaproszenia (Klucz API) {#domain-members-and-invites-api-key}

| Narzędzie             | Punkt końcowy API                                   | Opis                      |
| --------------------- | -------------------------------------------------- | -------------------------- |
| `updateDomainMember`  | `PUT /v1/domains/:domain_id/members/:member_id`    | Zmień rolę członka         |
| `removeDomainMember`  | `DELETE /v1/domains/:domain_id/members/:member_id` | Usuń członka               |
| `acceptDomainInvite`  | `GET /v1/domains/:domain_id/invites`               | Zaakceptuj oczekujące zaproszenie |
| `createDomainInvite`  | `POST /v1/domains/:domain_id/invites`              | Zaproś kogoś do domeny     |
| `removeDomainInvite`  | `DELETE /v1/domains/:domain_id/invites`            | Cofnij zaproszenie         |

### Hasła Catch-All (Klucz API) {#catch-all-passwords-api-key}

| Narzędzie                 | Punkt końcowy API                                              | Opis                        |
| ------------------------- | -------------------------------------------------------------- | ---------------------------- |
| `listCatchAllPasswords`   | `GET /v1/domains/:domain_id/catch-all-passwords`               | Lista haseł catch-all        |
| `createCatchAllPassword`  | `POST /v1/domains/:domain_id/catch-all-passwords`              | Utwórz hasło catch-all       |
| `deleteCatchAllPassword`  | `DELETE /v1/domains/:domain_id/catch-all-passwords/:token_id`  | Usuń hasło catch-all         |

### Logi (Klucz API) {#logs-api-key}

| Narzędzie       | Punkt końcowy API            | Opis                          |
| --------------- | ---------------------------- | ------------------------------ |
| `downloadLogs`  | `GET /v1/logs/download`      | Pobierz logi dostarczania e-maili |

### Szyfrowanie (Bez uwierzytelniania) {#encrypt-no-auth}

| Narzędzie        | Punkt końcowy API   | Opis                      |
| ---------------- | ------------------ | -------------------------- |
| `encryptRecord`  | `POST /v1/encrypt` | Zaszyfruj rekord DNS TXT  |

To narzędzie nie wymaga uwierzytelniania. Szyfruje rekordy przekierowań takie jak `forward-email=user@example.com` do użycia w rekordach DNS TXT.


## 20 Praktycznych Zastosowań {#20-real-world-use-cases}

Oto praktyczne sposoby użycia serwera MCP z Twoim asystentem AI:

### 1. Selekcja e-maili {#1-email-triage}

Poproś swojego AI o przeskanowanie skrzynki odbiorczej i podsumowanie nieprzeczytanych wiadomości. Może oznaczyć pilne e-maile, kategoryzować według nadawcy i przygotować odpowiedzi — wszystko za pomocą naturalnego języka. *(Wymaga poświadczeń aliasu do dostępu do skrzynki odbiorczej.)*

### 2. Automatyzacja konfiguracji domeny {#2-domain-setup-automation}

Konfigurujesz nową domenę? Poproś AI o utworzenie domeny, dodanie aliasów, weryfikację rekordów DNS i test konfiguracji SMTP. To, co normalnie zajmuje 10 minut klikania po panelach, staje się jedną rozmową.

### 3. Masowe zarządzanie aliasami {#3-bulk-alias-management}

Potrzebujesz utworzyć 20 aliasów dla nowego projektu? Opisz, czego potrzebujesz, a AI zajmie się powtarzalną pracą. Może tworzyć aliasy, ustawiać reguły przekierowań i generować hasła za jednym razem.
### 4. Monitorowanie kampanii e-mail {#4-email-campaign-monitoring}

Poproś swojego AI o sprawdzenie limitów wysyłki, wylistowanie ostatnich wysłanych wiadomości oraz raport o statusie dostarczenia. Przydatne do monitorowania stanu e-maili transakcyjnych.

### 5. Synchronizacja i czyszczenie kontaktów {#5-contact-sync-and-cleanup}

Użyj narzędzi CardDAV, aby wylistować wszystkie kontakty, znaleźć duplikaty, zaktualizować przestarzałe informacje lub masowo tworzyć kontakty ze skoroszytu, który wkleisz do czatu. *(Wymaga poświadczeń aliasu.)*

### 6. Zarządzanie kalendarzem {#6-calendar-management}

Twórz kalendarze, dodawaj wydarzenia, aktualizuj godziny spotkań i usuwaj odwołane wydarzenia — wszystko przez rozmowę. Narzędzia CalDAV obsługują pełne CRUD zarówno na kalendarzach, jak i wydarzeniach. *(Wymaga poświadczeń aliasu.)*

### 7. Automatyzacja skryptów Sieve {#7-sieve-script-automation}

Skrypty Sieve są potężne, ale składnia jest tajemnicza. Poproś swojego AI o napisanie skryptów Sieve: "Przefiltruj wszystkie e-maile od <billing@example.com> do folderu Billing" stanie się działającym skryptem bez konieczności zagłębiania się w specyfikację RFC 5228.

### 8. Wprowadzanie nowych członków zespołu {#8-team-onboarding}

Gdy do zespołu dołącza nowa osoba, poproś AI o utworzenie jej aliasu, wygenerowanie hasła, wysłanie powitalnego e-maila z danymi logowania oraz dodanie jej jako członka domeny. Jeden prompt, cztery wywołania API.

### 9. Audyt bezpieczeństwa {#9-security-auditing}

Poproś swojego AI o wylistowanie wszystkich domen, sprawdzenie statusu weryfikacji DNS, przegląd konfiguracji aliasów oraz identyfikację domen z nieweryfikowanymi rekordami. Szybkie sprawdzenie bezpieczeństwa w języku naturalnym.

### 10. Konfiguracja przekazywania e-maili {#10-email-forwarding-setup}

Konfigurujesz przekazywanie e-maili dla nowej domeny? Poproś AI o utworzenie domeny, dodanie aliasów przekierowujących, zaszyfrowanie rekordów DNS i weryfikację poprawności konfiguracji.

### 11. Wyszukiwanie i analiza skrzynki odbiorczej {#11-inbox-search-and-analysis}

Użyj narzędzi do wyszukiwania wiadomości, aby znaleźć konkretne e-maile: "Znajdź wszystkie e-maile od <john@example.com> z ostatnich 30 dni, które mają załączniki." Ponad 15 parametrów wyszukiwania czyni to potężnym narzędziem. *(Wymaga poświadczeń aliasu.)*

### 12. Organizacja folderów {#12-folder-organization}

Poproś swojego AI o utworzenie struktury folderów dla nowego projektu, przeniesienie wiadomości między folderami lub posprzątanie starych folderów, których już nie potrzebujesz. *(Wymaga poświadczeń aliasu.)*

### 13. Rotacja haseł {#13-password-rotation}

Generuj nowe hasła aliasów według harmonogramu. Poproś swojego AI o wygenerowanie nowego hasła dla każdego aliasu i raport z nowymi danymi logowania.

### 14. Szyfrowanie rekordów DNS {#14-dns-record-encryption}

Zaszyfruj swoje rekordy przekierowujące przed dodaniem ich do DNS. Narzędzie `encryptRecord` obsługuje to bez uwierzytelniania — przydatne do szybkich jednorazowych szyfrowań.

### 15. Analiza logów dostarczenia {#15-delivery-log-analysis}

Pobierz logi dostarczenia e-maili i poproś AI o analizę wskaźników odbić, identyfikację problematycznych odbiorców lub śledzenie czasów dostarczenia.

### 16. Zarządzanie wieloma domenami {#16-multi-domain-management}

Jeśli zarządzasz wieloma domenami, poproś AI o raport statusu: które domeny są zweryfikowane, które mają problemy, ile mają aliasów oraz jak wyglądają limity wysyłki.

### 17. Konfiguracja catch-all {#17-catch-all-configuration}

Skonfiguruj hasła catch-all dla domen, które muszą odbierać e-maile na dowolny adres. AI może tworzyć, wyświetlać i zarządzać tymi hasłami dla Ciebie.

### 18. Zarządzanie zaproszeniami do domeny {#18-domain-invite-management}

Zapraszaj członków zespołu do zarządzania domenami, sprawdzaj oczekujące zaproszenia i usuwaj wygasłe. Przydatne dla organizacji z wieloma administratorami domen.

### 19. Testowanie pamięci S3 {#19-s3-storage-testing}

Jeśli używasz niestandardowej pamięci S3 do kopii zapasowych e-maili, poproś AI o przetestowanie połączenia i weryfikację poprawności działania.

### 20. Tworzenie szkiców e-maili {#20-email-draft-composition}

Twórz szkice e-maili w swojej skrzynce bez ich wysyłania. Przydatne do przygotowywania wiadomości wymagających przeglądu przed wysłaniem lub do budowania szablonów e-maili. *(Wymaga poświadczeń aliasu.)*


## Przykładowe prompt-y {#example-prompts}

Oto prompt-y, których możesz użyć bezpośrednio z asystentem AI:

**Wysyłanie e-maila:**

> "Wyślij e-mail z <hello@mydomain.com> do <john@example.com> z tematem 'Spotkanie jutro' i treścią 'Cześć John, czy nadal spotykamy się o 14:00?'"
**Zarządzanie domenami:**

> "Wypisz wszystkie moje domeny i powiedz, które z nich mają niezweryfikowane rekordy DNS."

**Tworzenie aliasów:**

> "Utwórz nowy alias <support@mydomain.com>, który przekierowuje na mój osobisty e-mail."

**Wyszukiwanie w skrzynce odbiorczej (wymaga danych aliasu):**

> "Znajdź wszystkie nieprzeczytane e-maile z ostatniego tygodnia, które zawierają słowo 'invoice'."

**Kalendarz (wymaga danych aliasu):**

> "Utwórz kalendarz o nazwie 'Praca' i dodaj spotkanie na jutro o 14:00 pod nazwą 'Team Standup'."

**Skrypty Sieve:**

> "Napisz skrypt Sieve dla <info@mydomain.com>, który automatycznie odpowiada na e-maile wiadomością 'Dziękujemy za kontakt, odpowiemy w ciągu 24 godzin.'"

**Operacje masowe:**

> "Utwórz aliasy dla sales@, support@, billing@ oraz info@ na mydomain.com, wszystkie przekierowujące na <team@mydomain.com>."

**Kontrola bezpieczeństwa:**

> "Sprawdź status weryfikacji DNS i SMTP dla wszystkich moich domen i powiedz, czy coś wymaga uwagi."

**Generowanie hasła aliasu:**

> "Wygeneruj hasło dla aliasu <user@example.com>, abym mógł uzyskać dostęp do mojej skrzynki odbiorczej."


## Zmienne środowiskowe {#environment-variables}

| Zmienna                       | Wymagana | Domyślna                      | Opis                                                                          |
| ------------------------------ | -------- | ------------------------------ | ------------------------------------------------------------------------------ |
| `FORWARD_EMAIL_API_KEY`        | Tak      | —                              | Twój klucz API Forward Email (używany jako nazwa użytkownika Basic auth dla punktów końcowych API) |
| `FORWARD_EMAIL_ALIAS_USER`     | Nie      | —                              | Adres e-mail aliasu dla punktów końcowych skrzynki (np. `user@example.com`)    |
| `FORWARD_EMAIL_ALIAS_PASSWORD` | Nie      | —                              | Wygenerowane hasło aliasu dla punktów końcowych skrzynki                       |
| `FORWARD_EMAIL_API_URL`        | Nie      | `https://api.forwardemail.net` | Podstawowy URL API (dla self-hostingu lub testów)                             |


## Bezpieczeństwo {#security}

Serwer MCP działa lokalnie na Twoim komputerze. Oto jak działa bezpieczeństwo:

* **Twoje dane uwierzytelniające pozostają lokalne.** Zarówno Twój klucz API, jak i dane aliasu są odczytywane ze zmiennych środowiskowych i używane do uwierzytelniania żądań API przez HTTP Basic auth. Nigdy nie są wysyłane do modelu AI.
* **Transport stdio.** Serwer komunikuje się z klientem AI przez stdin/stdout. Nie są otwierane żadne porty sieciowe.
* **Brak przechowywania danych.** Serwer jest bezstanowy. Nie buforuje, nie loguje ani nie przechowuje żadnych danych Twojej poczty.
* **Open source.** Cały kod jest dostępny na [GitHub](https://github.com/forwardemail/mcp-server). Możesz przejrzeć każdy wiersz.


## Użycie programistyczne {#programmatic-usage}

Możesz także używać serwera jako biblioteki:

```js
const { McpServer } = require('@forwardemail/mcp-server');

const server = new McpServer({
  apiKey: 'your-api-key',
  aliasUser: 'user@example.com',
  aliasPassword: 'generated-alias-password',
});

server.listen();
```


## Open Source {#open-source}

Forward Email MCP Server jest [otwartoźródłowy na GitHub](https://github.com/forwardemail/mcp-server) na licencji BUSL-1.1. Wierzymy w przejrzystość. Jeśli znajdziesz błąd lub chcesz funkcję, [zgłoś problem](https://github.com/forwardemail/mcp-server/issues).
