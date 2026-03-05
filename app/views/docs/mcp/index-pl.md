# Serwer MCP Forward Email {#forward-email-mcp-server}

<img loading="lazy" src="/img/articles/mcp.webp" alt="Forward Email MCP MCP Server" class="rounded-lg" />

<p class="lead mt-3">
  <strong>TL;DR:</strong> Nasz <a href="https://github.com/forwardemail/mcp-server">serwer MCP o otwartym kodzie źródłowym</a> umożliwia asystentom AI, takim jak Claude, ChatGPT, Cursor i Windsurf, zarządzanie Twoją pocztą e-mail, domenami, aliasami, kontaktami i kalendarzami za pomocą języka naturalnego. Wszystkie 68 punktów końcowych API jest udostępnianych jako narzędzia MCP. Działa lokalnie za pomocą <code>npx @forwardemail/mcp-server</code> — Twoje dane uwierzytelniające nigdy nie opuszczają Twojej maszyny.
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
  * [Konto (klucz API lub uwierzytelnianie aliasem)](#account-api-key-or-alias-auth)
  * [Domeny (klucz API)](#domains-api-key)
  * [Aliasy (klucz API)](#aliases-api-key)
  * [Emaile — wychodzący SMTP (klucz API; wysyłanie obsługuje oba)](#emails--outbound-smtp-api-key-send-supports-both)
  * [Wiadomości — IMAP (uwierzytelnianie aliasem)](#messages--imap-alias-auth)
  * [Foldery — IMAP (uwierzytelnianie aliasem)](#folders--imap-alias-auth)
  * [Kontakty — CardDAV (uwierzytelnianie aliasem)](#contacts--carddav-alias-auth)
  * [Kalendarze — CalDAV (uwierzytelnianie aliasem)](#calendars--caldav-alias-auth)
  * [Wydarzenia kalendarza — CalDAV (uwierzytelnianie aliasem)](#calendar-events--caldav-alias-auth)
  * [Skrypty Sieve (klucz API)](#sieve-scripts-api-key)
  * [Skrypty Sieve (uwierzytelnianie aliasem)](#sieve-scripts-alias-auth)
  * [Członkowie domeny i zaproszenia (klucz API)](#domain-members-and-invites-api-key)
  * [Hasła Catch-All (klucz API)](#catch-all-passwords-api-key)
  * [Logi (klucz API)](#logs-api-key)
  * [Szyfrowanie (bez uwierzytelniania)](#encrypt-no-auth)
* [20 rzeczywistych przypadków użycia](#20-real-world-use-cases)
* [Przykładowe podpowiedzi](#example-prompts)
* [Zmienne środowiskowe](#environment-variables)
* [Bezpieczeństwo](#security)
* [Użycie programistyczne](#programmatic-usage)
* [Otwarty kod źródłowy](#open-source)


## Czym jest MCP? {#what-is-mcp}

[Model Context Protocol](https://modelcontextprotocol.io) (MCP) to otwarty standard stworzony przez Anthropic, który umożliwia modelom AI bezpieczne wywoływanie zewnętrznych narzędzi. Zamiast kopiować i wklejać odpowiedzi API do okna czatu, MCP zapewnia modelowi bezpośredni, ustrukturyzowany dostęp do Twoich usług.

Nasz serwer MCP opakowuje całe [API Forward Email](/email-api) — każdy punkt końcowy, każdy parametr — i udostępnia je jako narzędzia, których może używać każdy klient zgodny z MCP. Serwer działa lokalnie na Twojej maszynie, używając transportu stdio. Twoje dane uwierzytelniające pozostają w zmiennych środowiskowych i nigdy nie są wysyłane do modelu AI.


## Szybki start {#quick-start}

### Uzyskaj klucz API {#get-an-api-key}

1. Zaloguj się do swojego [konta Forward Email](/my-account/domains).
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

API Forward Email używa **uwierzytelniania HTTP Basic** z dwoma różnymi typami poświadczeń, w zależności od punktu końcowego. Serwer MCP obsługuje to automatycznie — wystarczy podać odpowiednie poświadczenia.

### Uwierzytelnianie kluczem API {#api-key-auth}

Większość punktów końcowych zarządzania (domeny, aliasy, wychodzące wiadomości e-mail, logi) używa Twojego **klucza API** jako nazwy użytkownika Basic auth z pustym hasłem.

Jest to ten sam klucz API, którego używasz do API REST. Ustaw go za pomocą zmiennej środowiskowej `FORWARD_EMAIL_API_KEY`.

### Uwierzytelnianie aliasem {#alias-auth}

Punkty końcowe skrzynki pocztowej (wiadomości, foldery, kontakty, kalendarze, skrypty Sieve o zakresie aliasu) używają **poświadczeń aliasu** — adresu e-mail aliasu jako nazwy użytkownika i wygenerowanego hasła jako hasła.

Te punkty końcowe uzyskują dostęp do danych dla poszczególnych aliasów za pośrednictwem protokołów IMAP, CalDAV i CardDAV. Wymagają one adresu e-mail aliasu i wygenerowanego hasła, a nie klucza API.

Poświadczenia aliasu możesz podać na dwa sposoby:

1. **Zmienne środowiskowe** (zalecane dla domyślnego aliasu): Ustaw `FORWARD_EMAIL_ALIAS_USER` i `FORWARD_EMAIL_ALIAS_PASSWORD`.
2. **Parametry wywołania narzędzia**: Przekaż `alias_username` i `alias_password` jako argumenty do dowolnego narzędzia uwierzytelniającego alias. Zastępują one zmienne środowiskowe, co jest przydatne podczas pracy z wieloma aliasami.

### Generowanie hasła aliasu {#generating-an-alias-password}

Zanim będziesz mógł używać narzędzi uwierzytelniających alias, musisz wygenerować hasło dla aliasu. Możesz to zrobić za pomocą narzędzia `generateAliasPassword` lub za pośrednictwem API:

```sh
curl -u "YOUR_API_KEY:" \
  https://api.forwardemail.net/v1/domains/example.com/aliases/ALIAS_ID/generate-password \
  -X POST
```

Odpowiedź zawiera pola `username` (adres e-mail aliasu) i `password`. Użyj ich jako poświadczeń aliasu.

> **Wskazówka:** Możesz również zapytać swojego asystenta AI: *"Wygeneruj hasło dla aliasu user@example.com w domenie example.com"* — wywoła on narzędzie `generateAliasPassword` i zwróci poświadczenia.

Poniższa tabela podsumowuje, która metoda uwierzytelniania jest wymagana dla każdej grupy narzędzi:

| Grupa narzędzi | Metoda uwierzytelniania | Poświadczenia |
|-----------|-------------|-------------|
| Konto | Klucz API **lub** uwierzytelnianie aliasem | Dowolne |
| Domeny, aliasy, członkowie domeny, zaproszenia, hasła catch-all | Klucz API | `FORWARD_EMAIL_API_KEY` |
| Wychodzące wiadomości e-mail (lista, pobieranie, usuwanie, limit) | Klucz API | `FORWARD_EMAIL_API_KEY` |
| Wysyłanie wiadomości e-mail | Klucz API **lub** uwierzytelnianie aliasem | Dowolne |
| Wiadomości (IMAP) | Uwierzytelnianie aliasem | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Foldery (IMAP) | Uwierzytelnianie aliasem | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Kontakty (CardDAV) | Uwierzytelnianie aliasem | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Kalendarze (CalDAV) | Uwierzytelnianie aliasem | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Wydarzenia kalendarza (CalDAV) | Uwierzytelnianie aliasem | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Skrypty Sieve (o zakresie domeny) | Klucz API | `FORWARD_EMAIL_API_KEY` |
| Skrypty Sieve (o zakresie aliasu) | Uwierzytelnianie aliasem | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Logi | Klucz API | `FORWARD_EMAIL_API_KEY` |
| Szyfrowanie | Brak | Nie są potrzebne poświadczenia |


## Wszystkie 68 narzędzi {#all-68-tools}

Każde narzędzie mapuje bezpośrednio do punktu końcowego [Forward Email API](/email-api). Parametry używają tych samych nazw co w dokumentacji API. Metoda uwierzytelniania jest zaznaczona w nagłówku każdej sekcji.

### Konto (klucz API lub uwierzytelnianie aliasem) {#account-api-key-or-alias-auth}

Z uwierzytelnianiem kluczem API, zwracają one informacje o Twoim koncie użytkownika. Z uwierzytelnianiem aliasem, zwracają informacje o aliasie/skrzynce pocztowej, w tym limit pamięci i ustawienia.

| Narzędzie | Punkt końcowy API | Opis |
|------|-------------|-------------|
| `getAccount` | `GET /v1/account` | Pobierz informacje o swoim koncie |
| `updateAccount` | `PUT /v1/account` | Zaktualizuj ustawienia swojego konta |

### Domeny (klucz API) {#domains-api-key}

| Narzędzie | Punkt końcowy API | Opis |
|------|-------------|-------------|
| `listDomains` | `GET /v1/domains` | Wyświetl wszystkie swoje domeny |
| `createDomain` | `POST /v1/domains` | Dodaj nową domenę |
| `getDomain` | `GET /v1/domains/:domain_id` | Pobierz szczegóły domeny |
| `updateDomain` | `PUT /v1/domains/:domain_id` | Zaktualizuj ustawienia domeny |
| `deleteDomain` | `DELETE /v1/domains/:domain_id` | Usuń domenę |
| `verifyDomainRecords` | `GET /v1/domains/:domain_id/verify-records` | Zweryfikuj rekordy DNS |
| `verifySmtpRecords` | `GET /v1/domains/:domain_id/verify-smtp` | Zweryfikuj konfigurację SMTP |
| `testS3Connection` | `POST /v1/domains/:domain_id/test-s3-connection` | Przetestuj niestandardowe przechowywanie S3 |

### Aliasy (klucz API) {#aliases-api-key}

| Narzędzie | Punkt końcowy API | Opis |
|------|-------------|-------------|
| `listAliases` | `GET /v1/domains/:domain_id/aliases` | Wyświetl aliasy dla domeny |
| `createAlias` | `POST /v1/domains/:domain_id/aliases` | Utwórz nowy alias |
| `getAlias` | `GET /v1/domains/:domain_id/aliases/:alias_id` | Pobierz szczegóły aliasu |
| `updateAlias` | `PUT /v1/domains/:domain_id/aliases/:alias_id` | Zaktualizuj alias |
| `deleteAlias` | `DELETE /v1/domains/:domain_id/aliases/:alias_id` | Usuń alias |
| `generateAliasPassword` | `POST /v1/domains/:domain_id/aliases/:alias_id/generate-password` | Wygeneruj hasło IMAP/SMTP do uwierzytelniania aliasu |

### Emaile — wychodzący SMTP (klucz API; wysyłanie obsługuje oba) {#emails--outbound-smtp-api-key-send-supports-both}

| Narzędzie | Punkt końcowy API | Uwierzytelnianie | Opis |
|------|-------------|------|-------------|
| `sendEmail` | `POST /v1/emails` | Klucz API lub uwierzytelnianie aliasem | Wyślij wiadomość e-mail przez SMTP |
| `listEmails` | `GET /v1/emails` | Klucz API | Wyświetl wychodzące wiadomości e-mail |
| `getEmail` | `GET /v1/emails/:id` | Klucz API | Pobierz szczegóły i status wiadomości e-mail |
| `deleteEmail` | `DELETE /v1/emails/:id` | Klucz API | Usuń wiadomość e-mail z kolejki |
| `getEmailLimit` | `GET /v1/emails/limit` | Klucz API | Sprawdź swój limit wysyłania |

Narzędzie `sendEmail` akceptuje `from`, `to`, `cc`, `bcc`, `subject`, `text`, `html` i `attachments`. Jest to to samo co punkt końcowy `POST /v1/emails`.

### Wiadomości — IMAP (uwierzytelnianie aliasem) {#messages--imap-alias-auth}

> **Wymaga poświadczeń aliasu.** Przekaż `alias_username` i `alias_password` lub ustaw zmienne środowiskowe `FORWARD_EMAIL_ALIAS_USER` i `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Narzędzie | Punkt końcowy API | Opis |
|------|-------------|-------------|
| `listMessages` | `GET /v1/messages` | Wyświetl i wyszukaj wiadomości w skrzynce pocztowej |
| `createMessage` | `POST /v1/messages` | Utwórz szkic lub prześlij wiadomość |
| `getMessage` | `GET /v1/messages/:id` | Pobierz wiadomość po ID |
| `updateMessage` | `PUT /v1/messages/:id` | Zaktualizuj flagi (przeczytane, oznaczone gwiazdką itp.) |
| `deleteMessage` | `DELETE /v1/messages/:id` | Usuń wiadomość |

Narzędzie `listMessages` obsługuje ponad 15 parametrów wyszukiwania, w tym `subject`, `from`, `to`, `text`, `since`, `before`, `is_unread` i `has_attachment`. Pełną listę znajdziesz w [dokumentacji API](/email-api).

### Foldery — IMAP (uwierzytelnianie aliasem) {#folders--imap-alias-auth}

> **Wymaga poświadczeń aliasu.** Przekaż `alias_username` i `alias_password` lub ustaw zmienne środowiskowe `FORWARD_EMAIL_ALIAS_USER` i `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Narzędzie | Punkt końcowy API | Opis |
|------|-------------|-------------|
| `listFolders` | `GET /v1/folders` | Wyświetl wszystkie foldery skrzynki pocztowej |
| `createFolder` | `POST /v1/folders` | Utwórz nowy folder |
| `getFolder` | `GET /v1/folders/:id` | Pobierz szczegóły folderu |
| `updateFolder` | `PUT /v1/folders/:id` | Zmień nazwę folderu |
| `deleteFolder` | `DELETE /v1/folders/:id` | Usuń folder |

### Kontakty — CardDAV (uwierzytelnianie aliasem) {#contacts--carddav-alias-auth}

> **Wymaga poświadczeń aliasu.** Przekaż `alias_username` i `alias_password` lub ustaw zmienne środowiskowe `FORWARD_EMAIL_ALIAS_USER` i `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Narzędzie | Punkt końcowy API | Opis |
|------|-------------|-------------|
| `listContacts` | `GET /v1/contacts` | Wyświetl wszystkie kontakty |
| `createContact` | `POST /v1/contacts` | Utwórz nowy kontakt |
| `getContact` | `GET /v1/contacts/:id` | Pobierz szczegóły kontaktu |
| `updateContact` | `PUT /v1/contacts/:id` | Zaktualizuj kontakt |
| `deleteContact` | `DELETE /v1/contacts/:id` | Usuń kontakt |

### Kalendarze — CalDAV (uwierzytelnianie aliasem) {#calendars--caldav-alias-auth}

> **Wymaga poświadczeń aliasu.** Przekaż `alias_username` i `alias_password` lub ustaw zmienne środowiskowe `FORWARD_EMAIL_ALIAS_USER` i `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Narzędzie | Punkt końcowy API | Opis |
|------|-------------|-------------|
| `listCalendars` | `GET /v1/calendars` | Wyświetl wszystkie kalendarze |
| `createCalendar` | `POST /v1/calendars` | Utwórz nowy kalendarz |
| `getCalendar` | `GET /v1/calendars/:id` | Pobierz szczegóły kalendarza |
| `updateCalendar` | `PUT /v1/calendars/:id` | Zaktualizuj kalendarz |
| `deleteCalendar` | `DELETE /v1/calendars/:id` | Usuń kalendarz |

### Wydarzenia kalendarza — CalDAV (uwierzytelnianie aliasem) {#calendar-events--caldav-alias-auth}

> **Wymaga poświadczeń aliasu.** Przekaż `alias_username` i `alias_password` lub ustaw zmienne środowiskowe `FORWARD_EMAIL_ALIAS_USER` i `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Narzędzie | Punkt końcowy API | Opis |
|------|-------------|-------------|
| `listCalendarEvents` | `GET /v1/calendar-events` | Wyświetl wszystkie wydarzenia |
| `createCalendarEvent` | `POST /v1/calendar-events` | Utwórz nowe wydarzenie |
| `getCalendarEvent` | `GET /v1/calendar-events/:id` | Pobierz szczegóły wydarzenia |
| `updateCalendarEvent` | `PUT /v1/calendar-events/:id` | Zaktualizuj wydarzenie |
| `deleteCalendarEvent` | `DELETE /v1/calendar-events/:id` | Usuń wydarzenie |

### Skrypty Sieve (klucz API) {#sieve-scripts-api-key}

Używają ścieżek o zakresie domeny i uwierzytelniają się za pomocą klucza API.

| Narzędzie | Punkt końcowy API | Opis |
|------|-------------|-------------|
| `listSieveScripts` | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve` | Wyświetl skrypty dla aliasu |
| `createSieveScript` | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve` | Utwórz nowy skrypt |
| `getSieveScript` | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id` | Pobierz szczegóły skryptu |
| `updateSieveScript` | `PUT /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id` | Zaktualizuj skrypt |
| `deleteSieveScript` | `DELETE /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id` | Usuń skrypt |
| `activateSieveScript` | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id/activate` | Aktywuj skrypt |

### Skrypty Sieve (uwierzytelnianie aliasem) {#sieve-scripts-alias-auth}

Używają uwierzytelniania na poziomie aliasu. Przydatne do automatyzacji dla poszczególnych aliasów bez potrzeby używania klucza API.

> **Wymaga poświadczeń aliasu.** Przekaż `alias_username` i `alias_password` lub ustaw zmienne środowiskowe `FORWARD_EMAIL_ALIAS_USER` i `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Narzędzie | Punkt końcowy API | Opis |
|------|-------------|-------------|
| `listSieveScriptsAliasAuth` | `GET /v1/sieve-scripts` | Wyświetl skrypty |
| `createSieveScriptAliasAuth` | `POST /v1/sieve-scripts` | Utwórz skrypt |
| `getSieveScriptAliasAuth` | `GET /v1/sieve-scripts/:script_id` | Pobierz szczegóły skryptu |
| `updateSieveScriptAliasAuth` | `PUT /v1/sieve-scripts/:script_id` | Zaktualizuj skrypt |
| `deleteSieveScriptAliasAuth` | `DELETE /v1/sieve-scripts/:script_id` | Usuń skrypt |
| `activateSieveScriptAliasAuth` | `POST /v1/sieve-scripts/:script_id/activate` | Aktywuj skrypt |

### Członkowie domeny i zaproszenia (klucz API) {#domain-members-and-invites-api-key}

| Narzędzie | Punkt końcowy API | Opis |
|------|-------------|-------------|
| `updateDomainMember` | `PUT /v1/domains/:domain_id/members/:member_id` | Zmień rolę członka |
| `removeDomainMember` | `DELETE /v1/domains/:domain_id/members/:member_id` | Usuń członka |
| `acceptDomainInvite` | `GET /v1/domains/:domain_id/invites` | Zaakceptuj oczekujące zaproszenie |
| `createDomainInvite` | `POST /v1/domains/:domain_id/invites` | Zaproś kogoś do domeny |
| `removeDomainInvite` | `DELETE /v1/domains/:domain_id/invites` | Odwołaj zaproszenie |

### Hasła Catch-All (klucz API) {#catch-all-passwords-api-key}

| Narzędzie | Punkt końcowy API | Opis |
|------|-------------|-------------|
| `listCatchAllPasswords` | `GET /v1/domains/:domain_id/catch-all-passwords` | Wyświetl hasła catch-all |
| `createCatchAllPassword` | `POST /v1/domains/:domain_id/catch-all-passwords` | Utwórz hasło catch-all |
| `deleteCatchAllPassword` | `DELETE /v1/domains/:domain_id/catch-all-passwords/:token_id` | Usuń hasło catch-all |

### Logi (klucz API) {#logs-api-key}

| Narzędzie | Punkt końcowy API | Opis |
|------|-------------|-------------|
| `downloadLogs` | `GET /v1/logs/download` | Pobierz logi dostarczania wiadomości e-mail |

### Szyfrowanie (bez uwierzytelniania) {#encrypt-no-auth}

| Narzędzie | Punkt końcowy API | Opis |
|------|-------------|-------------|
| `encryptRecord` | `POST /v1/encrypt` | Zaszyfruj rekord DNS TXT |

To narzędzie nie wymaga uwierzytelniania. Szyfruje rekordy przekierowań, takie jak `forward-email=user@example.com`, do użycia w rekordach DNS TXT.


## 20 rzeczywistych przypadków użycia {#20-real-world-use-cases}

Oto praktyczne sposoby użycia serwera MCP z Twoim asystentem AI:

### 1. Triage wiadomości e-mail {#email-triage}

Poproś swojego AI o przeskanowanie skrzynki odbiorczej i podsumowanie nieprzeczytanych wiadomości. Może on oznaczać pilne wiadomości e-mail, kategoryzować je według nadawcy i tworzyć odpowiedzi — wszystko za pomocą języka naturalnego. *(Wymaga poświadczeń aliasu do dostępu do skrzynki odbiorczej.)*

### 2. Automatyzacja konfiguracji domeny {#domain-setup-automation}

Konfigurujesz nową domenę? Poproś AI o utworzenie domeny, dodanie aliasów, zweryfikowanie rekordów DNS i przetestowanie konfiguracji SMTP. To, co normalnie zajmuje 10 minut klikania po panelach, staje się jedną rozmową.

### 3. Masowe zarządzanie aliasami {#bulk-alias-management}

Potrzebujesz utworzyć 20 aliasów dla nowego projektu? Opisz, czego potrzebujesz, a AI zajmie się powtarzalną pracą. Może tworzyć aliasy, ustawiać reguły przekierowań i generować hasła za jednym razem.

### 4. Monitorowanie kampanii e-mailowych {#email-campaign-monitoring}

Poproś swojego AI o sprawdzenie limitów wysyłania, wyświetlenie ostatnich wychodzących wiadomości e-mail i raportowanie statusu dostarczenia. Przydatne do monitorowania stanu transakcyjnych wiadomości e-mail.

### 5. Synchronizacja i czyszczenie kontaktów {#contact-sync-and-cleanup}

Użyj narzędzi CardDAV, aby wyświetlić wszystkie kontakty, znaleźć duplikaty, zaktualizować nieaktualne informacje lub masowo tworzyć kontakty z arkusza kalkulacyjnego, który wklejasz do czatu. *(Wymaga poświadczeń aliasu.)*

### 6. Zarządzanie kalendarzem {#calendar-management}

Twórz kalendarze, dodawaj wydarzenia, aktualizuj godziny spotkań i usuwaj anulowane wydarzenia — wszystko za pomocą rozmowy. Narzędzia CalDAV obsługują pełne operacje CRUD zarówno na kalendarzach, jak i wydarzeniach. *(Wymaga poświadczeń aliasu.)*

### 7. Automatyzacja skryptów Sieve {#sieve-script-automation}

Skrypty Sieve są potężne, ale ich składnia jest archaiczna. Poproś swojego AI o napisanie skryptów Sieve dla Ciebie: "Filtruj wszystkie wiadomości e-mail z billing@example.com do folderu Rozliczenia" staje się działającym skryptem bez dotykania specyfikacji RFC 5228.

### 8. Wprowadzanie nowego członka zespołu {#team-onboarding}

Gdy dołączy nowy członek zespołu, poproś AI o utworzenie jego aliasu, wygenerowanie hasła, wysłanie mu powitalnej wiadomości e-mail z danymi uwierzytelniającymi i dodanie go jako członka domeny. Jedna podpowiedź, cztery wywołania API.

### 9. Audyt bezpieczeństwa {#security-auditing}

Poproś swojego AI o wyświetlenie wszystkich domen, sprawdzenie statusu weryfikacji DNS, przejrzenie konfiguracji aliasów i zidentyfikowanie wszelkich domen z niezweryfikowanymi rekordami. Szybkie skanowanie bezpieczeństwa w języku naturalnym.

### 10. Konfiguracja przekierowania wiadomości e-mail {#email-forwarding-setup}

Konfigurujesz przekierowanie wiadomości e-mail dla nowej domeny? Poproś AI o utworzenie domeny, dodanie aliasów przekierowujących, zaszyfrowanie rekordów DNS i zweryfikowanie, czy wszystko jest poprawnie skonfigurowane.

### 11. Wyszukiwanie i analiza skrzynki odbiorczej {#inbox-search-and-analysis}

Użyj narzędzi do wyszukiwania wiadomości, aby znaleźć konkretne wiadomości e-mail: "Znajdź wszystkie wiadomości e-mail od john@example.com z ostatnich 30 dni, które mają załączniki." Ponad 15 parametrów wyszukiwania sprawia, że jest to potężne narzędzie. *(Wymaga poświadczeń aliasu.)*

### 12. Organizacja folderów {#folder-organization}

Poproś swojego AI o utworzenie struktury folderów dla nowego projektu, przenoszenie wiadomości między folderami lub czyszczenie starych folderów, których już nie potrzebujesz. *(Wymaga poświadczeń aliasu.)*

### 13. Rotacja haseł {#password-rotation}

Generuj nowe hasła aliasów zgodnie z harmonogramem. Poproś swojego AI o wygenerowanie nowego hasła dla każdego aliasu i zgłoszenie nowych poświadczeń.

### 14. Szyfrowanie rekordów DNS {#dns-record-encryption}

Zaszyfruj swoje rekordy przekierowań przed dodaniem ich do DNS. Narzędzie `encryptRecord` obsługuje to bez uwierzytelniania — przydatne do szybkich jednorazowych szyfrowań.

### 15. Analiza logów dostarczania {#delivery-log-analysis}

Pobierz logi dostarczania wiadomości e-mail i poproś AI o analizę wskaźników odrzuceń, identyfikację problematycznych odbiorców lub śledzenie czasów dostarczania.

### 16. Zarządzanie wieloma domenami {#multi-domain-management}

Jeśli zarządzasz wieloma domenami, poproś AI o raport statusu: które domeny są zweryfikowane, które mają problemy, ile aliasów ma każda z nich i jak wyglądają limity wysyłania.

### 17. Konfiguracja Catch-All {#catch-all-configuration}

Ustaw hasła catch-all dla domen, które muszą odbierać wiadomości e-mail na dowolny adres. AI może tworzyć, wyświetlać i zarządzać tymi hasłami dla Ciebie.

### 18. Zarządzanie zaproszeniami do domeny {#domain-invite-management}

Zaproś członków zespołu do zarządzania domenami, sprawdzaj oczekujące zaproszenia i usuwaj wygasłe. Przydatne dla organizacji z wieloma administratorami domen.

### 19. Testowanie przechowywania S3 {#s3-storage-testing}

Jeśli używasz niestandardowego przechowywania S3 do tworzenia kopii zapasowych wiadomości e-mail, poproś AI o przetestowanie połączenia i zweryfikowanie, czy działa poprawnie.

### 20. Tworzenie szkiców wiadomości e-mail {#email-draft-composition}

Twórz szkice wiadomości e-mail w swojej skrzynce pocztowej bez ich wysyłania. Przydatne do przygotowywania wiadomości e-mail, które wymagają przeglądu przed wysłaniem, lub do tworzenia szablonów wiadomości e-mail. *(Wymaga poświadczeń aliasu.)*


## Przykładowe podpowiedzi {#example-prompts}

Oto podpowiedzi, których możesz użyć bezpośrednio z Twoim asystentem AI:

**Wysyłanie wiadomości e-mail:**
> "Wyślij wiadomość e-mail z hello@mydomain.com do john@example.com z tematem 'Spotkanie jutro' i treścią 'Cześć John, czy nadal spotykamy się o 14:00?'"

**Zarządzanie domeną:**
> "Wyświetl wszystkie moje domeny i powiedz mi, które z nich mają niezweryfikowane rekordy DNS."

**Tworzenie aliasu:**
> "Utwórz nowy alias support@mydomain.com, który przekierowuje na mój osobisty adres e-mail."

**Wyszukiwanie w skrzynce odbiorczej (wymaga poświadczeń aliasu):**
> "Znajdź wszystkie nieprzeczytane wiadomości e-mail z ostatniego tygodnia, które wspominają o 'fakturze'."

**Kalendarz (wymaga poświadczeń aliasu):**
> "Utwórz kalendarz o nazwie 'Praca' i dodaj spotkanie na jutro o 14:00 o nazwie 'Codzienne spotkanie zespołu'."

**Skrypty Sieve:**
> "Napisz skrypt Sieve dla info@mydomain.com, który automatycznie odpowiada na wiadomości e-mail 'Dziękujemy za kontakt, odpowiemy w ciągu 24 godzin'."

**Operacje masowe:**
> "Utwórz aliasy dla sales@, support@, billing@ i info@ w mojej domenie mydomain.com, wszystkie przekierowujące na team@mydomain.com."

**Kontrola bezpieczeństwa:**
> "Sprawdź status weryfikacji DNS i SMTP dla wszystkich moich domen i powiedz mi, czy coś wymaga uwagi."

**Wygeneruj hasło aliasu:**
> "Wygeneruj hasło dla aliasu user@example.com, abym mógł uzyskać dostęp do mojej skrzynki odbiorczej."


## Zmienne środowiskowe {#environment-variables}

| Zmienna | Wymagane | Domyślne | Opis |
|----------|----------|---------|-------------|
| `FORWARD_EMAIL_API_KEY` | Tak | — | Twój klucz API Forward Email (używany jako nazwa użytkownika Basic auth dla punktów końcowych API-key) |
| `FORWARD_EMAIL_ALIAS_USER` | Nie | — | Adres e-mail aliasu dla punktów końcowych skrzynki pocztowej (np. `user@example.com`) |
| `FORWARD_EMAIL_ALIAS_PASSWORD` | Nie | — | Wygenerowane hasło aliasu dla punktów końcowych skrzynki pocztowej |
| `FORWARD_EMAIL_API_URL` | Nie | `https://api.forwardemail.net` | Podstawowy URL API (dla samodzielnego hostingu lub testowania) |


## Bezpieczeństwo {#security}

Serwer MCP działa lokalnie na Twojej maszynie. Oto jak działa bezpieczeństwo:

*   **Twoje poświadczenia pozostają lokalne.** Zarówno Twój klucz API, jak i poświadczenia aliasu są odczytywane ze zmiennych środowiskowych i używane do uwierzytelniania żądań API za pośrednictwem uwierzytelniania HTTP Basic. Nigdy nie są wysyłane do modelu AI.
*   **Transport stdio.** Serwer komunikuje się z klientem AI za pośrednictwem stdin/stdout. Nie są otwierane żadne porty sieciowe.
*   **Brak przechowywania danych.** Serwer jest bezstanowy. Nie buforuje, nie loguje ani nie przechowuje żadnych Twoich danych e-mail.
*   **Otwarty kod źródłowy.** Cały kod źródłowy znajduje się na [GitHubie](https://github.com/forwardemail/mcp-server). Możesz audytować każdą linię.


## Użycie programistyczne {#programmatic-usage}

Możesz również używać serwera jako biblioteki:

```js
const { McpServer } = require('@forwardemail/mcp-server');

const server = new McpServer({
  apiKey: 'your-api-key',
  aliasUser: 'user@example.com',
  aliasPassword: 'generated-alias-password',
});

server.listen();
```


## Otwarty kod źródłowy {#open-source}

Serwer MCP Forward Email jest [dostępny na GitHubie](https://github.com/forwardemail/mcp-server) na licencji BUSL-1.1. Wierzymy w przejrzystość. Jeśli znajdziesz błąd lub chcesz nową funkcję, [zgłoś problem](https://github.com/forwardemail/mcp-server/issues).

