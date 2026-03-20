# Self Hosted {#self-hosted}


## Spis treści {#table-of-contents}

* [Pierwsze kroki](#getting-started)
* [Wymagania](#requirements)
  * [Cloud-init / User-data](#cloud-init--user-data)
* [Instalacja](#install)
  * [Debugowanie skryptu instalacyjnego](#debug-install-script)
  * [Monity](#prompts)
  * [Początkowa konfiguracja (Opcja 1)](#initial-setup-option-1)
* [Usługi](#services)
  * [Ważne ścieżki plików](#important-file-paths)
* [Konfiguracja](#configuration)
  * [Początkowa konfiguracja DNS](#initial-dns-setup)
* [Onboarding](#onboarding)
* [Testowanie](#testing)
  * [Tworzenie pierwszego aliasu](#creating-your-first-alias)
  * [Wysyłanie / odbieranie pierwszego e-maila](#sending--receiving-your-first-email)
* [Rozwiązywanie problemów](#troubleshooting)
  * [Jaka jest nazwa użytkownika i hasło do podstawowej autoryzacji](#what-is-the-basic-auth-username-and-password)
  * [Jak sprawdzić, co jest uruchomione](#how-do-i-know-what-is-running)
  * [Jak sprawdzić, czy coś, co powinno działać, nie działa](#how-do-i-know-if-something-isnt-running-that-should-be)
  * [Jak znaleźć logi](#how-do-i-find-logs)
  * [Dlaczego moje wychodzące e-maile mają przekroczenie czasu](#why-are-my-outgoing-emails-timing-out)


## Pierwsze kroki {#getting-started}

Nasze rozwiązanie do samodzielnego hostingu poczty e-mail, podobnie jak wszystkie nasze produkty, jest w 100% open-source — zarówno frontend, jak i backend. Oznacza to:

1. **Pełna przejrzystość**: Każda linijka kodu przetwarzająca Twoje e-maile jest dostępna do publicznej weryfikacji
2. **Wkład społeczności**: Każdy może wnieść ulepszenia lub naprawić problemy
3. **Bezpieczeństwo dzięki otwartości**: Luki w zabezpieczeniach mogą być identyfikowane i naprawiane przez globalną społeczność
4. **Brak uzależnienia od dostawcy**: Nigdy nie jesteś zależny od istnienia naszej firmy

Cały kod źródłowy jest dostępny na GitHub pod adresem <https://github.com/forwardemail/forwardemail.net>, na licencji MIT.

Architektura obejmuje kontenery dla:

* serwera SMTP do wysyłania poczty
* serwerów IMAP/POP3 do odbioru poczty
* interfejsu webowego do administracji
* bazy danych do przechowywania konfiguracji
* Redis do cache i wydajności
* SQLite do bezpiecznego, zaszyfrowanego przechowywania skrzynek pocztowych

> \[!NOTE]
> Koniecznie sprawdź nasz [blog o samodzielnym hostingu](https://forwardemail.net/blog/docs/self-hosted-solution)
>
> A dla zainteresowanych bardziej szczegółową wersją krok po kroku zobacz nasze przewodniki oparte na [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) lub [Debian](https://forwardemail.net/guides/selfhosted-on-debian).


## Wymagania {#requirements}

Przed uruchomieniem skryptu instalacyjnego upewnij się, że masz:

* **System operacyjny**: Serwer oparty na Linuksie (obecnie wspierany Ubuntu 22.04+).
* **Zasoby**: 1 vCPU i 2GB RAM
* **Dostęp root**: Uprawnienia administracyjne do wykonywania poleceń.
* **Nazwa domeny**: Własna domena gotowa do konfiguracji DNS.
* **Czysty adres IP**: Upewnij się, że Twój serwer ma czysty adres IP bez wcześniejszej reputacji spamu, sprawdzając czarne listy. Więcej informacji [tutaj](#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation).
* Publiczny adres IP z obsługą portu 25
* Możliwość ustawienia [odwrotnego PTR](https://www.cloudflare.com/learning/dns/dns-records/dns-ptr-record/)
* Obsługa IPv4 i IPv6

> \[!TIP]
> Zobacz naszą listę [świetnych dostawców serwerów pocztowych](https://github.com/forwardemail/awesome-mail-server-providers)

### Cloud-init / User-data {#cloud-init--user-data}

Większość dostawców chmury obsługuje konfigurację cloud-init na etapie provisioningu wirtualnego serwera prywatnego (VPS). To świetny sposób, aby ustawić niektóre pliki i zmienne środowiskowe z wyprzedzeniem do wykorzystania przez logikę początkowej konfiguracji skryptu, co pozwoli uniknąć wyświetlania monitów o dodatkowe informacje podczas działania skryptu.

**Opcje**

* `EMAIL` - e-mail używany do przypomnień o wygaśnięciu certyfikatu certbot
* `DOMAIN` - własna domena (np. `example.com`) używana do konfiguracji samodzielnego hostingu
* `AUTH_BASIC_USERNAME` - nazwa użytkownika używana podczas pierwszej konfiguracji do zabezpieczenia strony
* `AUTH_BASIC_PASSWORD` - hasło używane podczas pierwszej konfiguracji do zabezpieczenia strony
* `/root/.cloudflare.ini` - (**tylko użytkownicy Cloudflare**) plik konfiguracyjny Cloudflare używany przez certbot do konfiguracji DNS. Wymaga ustawienia tokenu API przez `dns_cloudflare_api_token`. Więcej informacji [tutaj](https://certbot-dns-cloudflare.readthedocs.io/en/stable/).
Przykład:

```sh
#cloud-config
write_files:
  - path: /root/.cloudflare.ini
    content: |
      dns_cloudflare_api_token = "xxx"
    owner: root:root
    permissions: '0600'
  - path: /etc/profile.d/env.sh
    content: |
      export EMAIL="test@myemail.com"
      export DOMAIN="mydomain.com"

runcmd:
  - chmod +x /etc/profile.d/env.sh
```


## Instalacja {#install}

Uruchom następujące polecenie na swoim serwerze, aby pobrać i wykonać skrypt instalacyjny:

```sh
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

### Debugowanie skryptu instalacyjnego {#debug-install-script}

Dodaj `DEBUG=true` przed skryptem instalacyjnym, aby uzyskać szczegółowe informacje:

```sh
DEBUG=true bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

### Monity {#prompts}

```sh
1. Initial setup
2. Setup Backups
3. Setup Auto Upgrades
4. Renew certificates
5. Restore from Backup
6. Help
7. Exit
```

* **Initial setup**: Pobierz najnowszy kod forward email, skonfiguruj środowisko, poproś o własną domenę i skonfiguruj wszystkie niezbędne certyfikaty, klucze i sekrety.
* **Setup Backup**: Skonfiguruje cron do tworzenia kopii zapasowych mongoDB i redis za pomocą magazynu zgodnego z S3 dla bezpiecznego, zdalnego przechowywania. Osobno, sqlite będzie backupowany przy logowaniu, jeśli nastąpią zmiany, dla bezpiecznych, zaszyfrowanych kopii zapasowych.
* **Setup Upgrade**: Skonfiguruje cron do wyszukiwania nocnych aktualizacji, które bezpiecznie przebudują i zrestartują komponenty infrastruktury.
* **Renew certificates**: Certbot / lets encrypt jest używany do certyfikatów SSL, które wygasają co 3 miesiące. To odnowi certyfikaty dla Twojej domeny i umieści je w odpowiednim folderze, aby powiązane komponenty mogły je wykorzystać. Zobacz [ważne ścieżki plików](#important-file-paths)
* **Restore from backup**: Wywoła mongodb i redis do przywrócenia danych z kopii zapasowej.

### Początkowa konfiguracja (Opcja 1) {#initial-setup-option-1}

Wybierz opcję `1. Initial setup`, aby rozpocząć.

Po zakończeniu powinieneś zobaczyć komunikat o sukcesie. Możesz nawet uruchomić `docker ps`, aby zobaczyć **uruchomione** komponenty. Więcej informacji o komponentach poniżej.


## Usługi {#services}

| Nazwa usługi |         Domyślny port        | Opis                                                  |
| ------------ | :---------------------------: | ----------------------------------------------------- |
| Web          |            `443`              | Interfejs webowy do wszystkich interakcji administracyjnych |
| API          |            `4000`             | Warstwa API do abstrakcji baz danych                  |
| Bree         |             Brak              | Zadania w tle i runner zadań                           |
| SMTP         | `465` (zalecany) / `587`      | Serwer SMTP do wysyłania poczty                        |
| SMTP Bree    |             Brak              | Zadania w tle SMTP                                     |
| MX           |            `2525`             | Wymiana poczty do odbierania i przekazywania emaili  |
| IMAP         |          `993/2993`           | Serwer IMAP do odbierania poczty i zarządzania skrzynką |
| POP3         |          `995/2995`           | Serwer POP3 do odbierania poczty i zarządzania skrzynką |
| SQLite       |            `3456`             | Serwer SQLite do interakcji z bazą/bazami sqlite      |
| SQLite Bree  |             Brak              | Zadania w tle SQLite                                   |
| CalDAV       |            `5000`             | Serwer CalDAV do zarządzania kalendarzem              |
| CardDAV      |            `6000`             | Serwer CardDAV do zarządzania kalendarzem             |
| MongoDB      |           `27017`             | Baza danych MongoDB do większości zarządzania danymi  |
| Redis        |            `6379`             | Redis do cache i zarządzania stanem                    |
| SQLite       |             Brak              | Baza/bazy SQLite dla zaszyfrowanych skrzynek           |

### Ważne ścieżki plików {#important-file-paths}

Uwaga: *Ścieżka hosta* poniżej jest względem `/root/forwardemail.net/self-hosting/`.

| Komponent              |       Ścieżka hosta       | Ścieżka w kontenerze          |
| ---------------------- | :-----------------------: | ----------------------------- |
| MongoDB                |   `./mongo-backups`       | `/backups`                    |
| Redis                  |     `./redis-data`        | `/data`                       |
| Sqlite                 |    `./sqlite-data`        | `/mnt/{SQLITE_STORAGE_PATH}`  |
| Plik env               |        `./.env`           | `/app/.env`                   |
| Certyfikaty/klucze SSL |        `./ssl`            | `/app/ssl/`                   |
| Klucz prywatny         |  `./ssl/privkey.pem`      | `/app/ssl/privkey.pem`        |
| Pełny łańcuch certyfikatów | `./ssl/fullchain.pem` | `/app/ssl/fullchain.pem`      |
| Certyfikat CA          |    `./ssl/cert.pem`       | `/app/ssl/cert.pem`           |
| Prywatny klucz DKIM    |    `./ssl/dkim.key`       | `/app/ssl/dkim.key`           |
> \[!IMPORTANT]
> Zapisz plik `.env` w bezpiecznym miejscu. Jest on kluczowy do odzyskania w razie awarii.
> Znajdziesz go w `/root/forwardemail.net/self-hosting/.env`.


## Konfiguracja {#configuration}

### Początkowa konfiguracja DNS {#initial-dns-setup}

W wybranym dostawcy DNS skonfiguruj odpowiednie rekordy DNS. Zwróć uwagę, że wszystko w nawiasach (`<>`) jest dynamiczne i należy to zaktualizować własną wartością.

| Typ   | Nazwa              | Zawartość                    | TTL  |
| ----- | ------------------ | ---------------------------- | ---- |
| A     | "@", ".", lub puste| <ip_address>                 | auto |
| CNAME | api                | <domain_name>                | auto |
| CNAME | caldav             | <domain_name>                | auto |
| CNAME | carddav            | <domain_name>                | auto |
| CNAME | fe-bounces         | <domain_name>                | auto |
| CNAME | imap               | <domain_name>                | auto |
| CNAME | mx                 | <domain_name>                | auto |
| CNAME | pop3               | <domain_name>                | auto |
| CNAME | smtp               | <domain_name>                | auto |
| MX    | "@", ".", lub puste| mx.<domain_name> (priorytet 0) | auto |
| TXT   | "@", ".", lub puste| "v=spf1 a -all"              | auto |

#### Reverse DNS / rekord PTR {#reverse-dns--ptr-record}

Reverse DNS (rDNS) lub rekordy wskaźnikowe PTR są niezbędne dla serwerów pocztowych, ponieważ pomagają zweryfikować wiarygodność serwera wysyłającego wiadomość. Każdy dostawca chmury robi to inaczej, więc musisz sprawdzić, jak dodać "Reverse DNS", aby powiązać hosta i IP z odpowiadającą mu nazwą hosta. Najprawdopodobniej znajdziesz to w sekcji sieciowej dostawcy.

#### Port 25 zablokowany {#port-25-blocked}

Niektórzy dostawcy internetu i chmury blokują port 25, aby zapobiec działaniom niepożądanym. Może być konieczne zgłoszenie się do wsparcia technicznego, aby odblokować port 25 dla SMTP / wychodzącej poczty.


## Rozpoczęcie pracy {#onboarding}

1. Otwórz stronę startową
   Przejdź do https\://\<domain_name>, zastępując \<domain_name> domeną skonfigurowaną w ustawieniach DNS. Powinna pojawić się strona startowa Forward Email.

2. Zaloguj się i skonfiguruj swoją domenę

* Zaloguj się za pomocą ważnego adresu e-mail i hasła.
* Wprowadź nazwę domeny, którą chcesz skonfigurować (musi się zgadzać z konfiguracją DNS).
* Postępuj zgodnie z instrukcjami, aby dodać wymagane rekordy **MX** i **TXT** do weryfikacji.

3. Zakończ konfigurację

* Po weryfikacji przejdź do strony Aliasów, aby utworzyć swój pierwszy alias.
* Opcjonalnie skonfiguruj **SMTP dla wychodzącej poczty** w **Ustawieniach domeny**. Wymaga to dodatkowych rekordów DNS.

> \[!NOTE]
> Żadne informacje nie są wysyłane poza Twój serwer. Opcja self-hosted i początkowe konto służą tylko do logowania administratora i widoku webowego do zarządzania domenami, aliasami i powiązanymi konfiguracjami poczty.


## Testowanie {#testing}

### Tworzenie pierwszego aliasu {#creating-your-first-alias}

1. Przejdź do strony Aliasów
   Otwórz stronę zarządzania aliasami:

```sh
https://<domain_name>/en/my-account/domains/<domain_name>/aliases
```

2. Dodaj nowy alias

* Kliknij **Dodaj alias** (w prawym górnym rogu).
* Wprowadź nazwę aliasu i dostosuj ustawienia e-mail według potrzeb.
* (Opcjonalnie) Włącz wsparcie **IMAP/POP3/CalDAV/CardDAV** zaznaczając odpowiednie pole.
* Kliknij **Utwórz alias.**

3. Ustaw hasło

* Kliknij **Generuj hasło**, aby utworzyć bezpieczne hasło.
* To hasło będzie wymagane do logowania w kliencie poczty.

4. Skonfiguruj klienta poczty

* Użyj klienta poczty, np. Thunderbird.
* Wprowadź nazwę aliasu i wygenerowane hasło.
* Skonfiguruj odpowiednio ustawienia **IMAP** i **SMTP**.

#### Ustawienia serwera poczty {#email-server-settings}

Nazwa użytkownika: `<alias name>`

| Typ  | Nazwa hosta         | Port | Bezpieczeństwo połączenia | Uwierzytelnianie |
| ---- | ------------------- | ---- | ------------------------- | ---------------- |
| SMTP | smtp.<domain_name>  | 465  | SSL / TLS                 | Normalne hasło   |
| IMAP | imap.<domain_name>  | 993  | SSL / TLS                 | Normalne hasło   |

### Wysyłanie / odbieranie pierwszej wiadomości {#sending--receiving-your-first-email}

Po konfiguracji powinieneś móc wysyłać i odbierać wiadomości na nowo utworzony i samodzielnie hostowany adres e-mail!
## Rozwiązywanie problemów {#troubleshooting}

#### Dlaczego to nie działa poza Ubuntu i Debianem {#why-doesnt-this-work-outside-of-ubuntu-and-debian}

Obecnie pracujemy nad wsparciem dla MacOS i rozważymy inne systemy. Prosimy o otwarcie [dyskusji](https://github.com/orgs/forwardemail/discussions) lub wkład, jeśli chcesz zobaczyć wsparcie dla innych systemów.

#### Dlaczego wyzwanie certbot acme nie powiodło się {#why-is-the-certbot-acme-challenge-failing}

Najczęstszym problemem jest to, że certbot / letsencrypt czasami żąda **2** wyzwań. Musisz upewnić się, że dodałeś **OBYDWA** rekordy txt.

Przykład:
Możesz zobaczyć dwa wyzwania takie jak te:
\_acme-challenge.example.com -> "randomstring1"
\_acme-challenge.example.com -> "randomstring2"

Możliwe jest również, że propagacja DNS nie została zakończona. Możesz użyć narzędzi takich jak: `https://toolbox.googleapps.com/apps/dig/#TXT/_acme-challenge.<your_domain>`. Da Ci to pojęcie, czy zmiany rekordu TXT powinny być widoczne. Możliwe jest też, że lokalny cache DNS na Twoim hoście nadal używa starej, nieaktualnej wartości lub nie zauważył ostatnich zmian.

Inną opcją jest użycie automatycznych zmian DNS certbota poprzez ustawienie pliku `/root/.cloudflare.ini` z tokenem API w Twoim cloud-init / user-data podczas początkowej konfiguracji VPS lub utworzenie tego pliku i ponowne uruchomienie skryptu. To automatycznie zarządza zmianami DNS i aktualizacjami wyzwań.

### Jaka jest nazwa użytkownika i hasło do podstawowej autoryzacji {#what-is-the-basic-auth-username-and-password}

Dla samodzielnego hostingu dodajemy przy pierwszym uruchomieniu natywne okno uwierzytelniania przeglądarki z prostą nazwą użytkownika (`admin`) i hasłem (losowo wygenerowanym podczas początkowej konfiguracji). Dodajemy to jako zabezpieczenie na wypadek, gdyby automatyzacja / skrypty wyprzedziły Cię w pierwszym rejestrze w interfejsie webowym. To hasło znajdziesz po początkowej konfiguracji w pliku `.env` pod `AUTH_BASIC_USERNAME` i `AUTH_BASIC_PASSWORD`.

### Jak sprawdzić, co jest uruchomione {#how-do-i-know-what-is-running}

Możesz uruchomić `docker ps`, aby zobaczyć wszystkie działające kontenery, które są uruchamiane z pliku `docker-compose-self-hosting.yml`. Możesz też uruchomić `docker ps -a`, aby zobaczyć wszystko (w tym kontenery, które nie są uruchomione).

### Jak sprawdzić, czy coś, co powinno działać, nie działa {#how-do-i-know-if-something-isnt-running-that-should-be}

Możesz uruchomić `docker ps -a`, aby zobaczyć wszystko (w tym kontenery, które nie są uruchomione). Możesz zobaczyć log wyjścia lub notatkę.

### Jak znaleźć logi {#how-do-i-find-logs}

Możesz uzyskać więcej logów za pomocą `docker logs -f <container_name>`. Jeśli coś się zatrzymało, prawdopodobnie jest to związane z niepoprawną konfiguracją pliku `.env`.

W interfejsie webowym możesz przeglądać `/admin/emails` i `/admin/logs` odpowiednio dla logów wychodzących e-maili i logów błędów.

### Dlaczego moje wychodzące e-maile przekraczają limit czasu {#why-are-my-outgoing-emails-timing-out}

Jeśli widzisz komunikat typu Connection timed out when connecting to MX server..., może być konieczne sprawdzenie, czy port 25 nie jest zablokowany. Często dostawcy internetu lub usług chmurowych domyślnie blokują ten port i może być konieczne skontaktowanie się z pomocą techniczną / zgłoszenie zgłoszenia, aby go odblokować.

#### Jakie narzędzia powinienem użyć do testowania najlepszych praktyk konfiguracji e-mail i reputacji IP {#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation}

Spójrz na nasze [FAQ tutaj](/faq#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation).
