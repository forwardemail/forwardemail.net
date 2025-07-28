# Samodzielnie hostowany {#self-hosted}

## Spis treści {#table-of-contents}

* [Pierwsze kroki](#getting-started)
* [Wymagania](#requirements)
  * [Cloud-init / Dane użytkownika](#cloud-init--user-data)
* [Zainstalować](#install)
  * [Skrypt instalacyjny debugowania](#debug-install-script)
  * [Monity](#prompts)
  * [Konfiguracja początkowa (opcja 1)](#initial-setup-option-1)
* [Usługi](#services)
  * [Ważne ścieżki plików](#important-file-paths)
* [Konfiguracja](#configuration)
  * [Początkowa konfiguracja DNS](#initial-dns-setup)
* [Proces wdrażania do firmy nowego pracownika](#onboarding)
* [Testowanie](#testing)
  * [Tworzenie pierwszego aliasu](#creating-your-first-alias)
  * [Wysyłanie/odbieranie pierwszej wiadomości e-mail](#sending--receiving-your-first-email)
* [Rozwiązywanie problemów](#troubleshooting)
  * [Jaka jest podstawowa nazwa użytkownika i hasło uwierzytelniające?](#what-is-the-basic-auth-username-and-password)
  * [Skąd mam wiedzieć, co jest uruchomione?](#how-do-i-know-what-is-running)
  * [Skąd mam wiedzieć, czy coś nie działa, chociaż powinno?](#how-do-i-know-if-something-isnt-running-that-should-be)
  * [Jak znaleźć dzienniki?](#how-do-i-find-logs)
  * [Dlaczego moje wychodzące wiadomości e-mail przestają działać?](#why-are-my-outgoing-emails-timing-out)

## Rozpoczęcie pracy {#getting-started}

Nasze samodzielnie hostowane rozwiązanie poczty e-mail, podobnie jak wszystkie nasze produkty, jest w 100% open-source — zarówno front-end, jak i back-end. Oznacza to:

1. **Pełna przejrzystość**: Każda linijka kodu przetwarzająca Twoje wiadomości e-mail jest dostępna do publicznej kontroli
2. **Wkład społeczności**: Każdy może wnieść ulepszenia lub naprawić problemy
3. **Bezpieczeństwo dzięki otwartości**: Luki mogą zostać zidentyfikowane i naprawione przez globalną społeczność
4. **Brak uzależnienia od dostawcy**: Nigdy nie jesteś zależny od istnienia naszej firmy

Cały kod źródłowy jest dostępny na platformie GitHub pod adresem <https://github.com/forwardemail/forwardemail.net>, na licencji MIT.

Architektura obejmuje kontenery dla:

* Serwer SMTP do poczty wychodzącej
* Serwery IMAP/POP3 do pobierania poczty
* Interfejs internetowy do administracji
* Baza danych do przechowywania konfiguracji
* Redis do buforowania i wydajności
* SQLite do bezpiecznego, szyfrowanego przechowywania skrzynek pocztowych

> \[!NOTE]
> Be sure to check out our [self-hosted blog](https://forwardemail.net/blog/docs/self-hosted-solution)
>
> And for those interested in a more broken down step-by-step version see our [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) or [Debian](https://forwardemail.net/guides/selfhosted-on-debian) based guides.

## Wymagania {#requirements}

Przed uruchomieniem skryptu instalacyjnego upewnij się, że masz następujące elementy:

* **System operacyjny**: Serwer oparty na systemie Linux (obecnie obsługuje Ubuntu 22.04+).
* **Zasoby**: 1 procesor wirtualny i 2 GB pamięci RAM
* **Dostęp root**: Uprawnienia administracyjne do wykonywania poleceń.
* **Nazwa domeny**: Niestandardowa domena gotowa do konfiguracji DNS.
* **Czysty adres IP**: Upewnij się, że Twój serwer ma czysty adres IP bez wcześniejszej reputacji spamu, sprawdzając czarne listy. Więcej informacji: [Tutaj](#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation).
* Publiczny adres IP z obsługą portu 25
* Możliwość ustawienia [odwrotny PTR](https://www.cloudflare.com/learning/dns/dns-records/dns-ptr-record/)
* Obsługa IPv4 i IPv6

> \[!TIP]
> See our list of [awesome mail server providers](https://github.com/forwardemail/awesome-mail-server-providers)

### Inicjalizacja w chmurze / dane użytkownika {#cloud-init--user-data}

Większość dostawców chmury obsługuje konfigurację cloud-init na czas, gdy wirtualny serwer prywatny (VPS) jest dostarczany. To świetny sposób na wcześniejsze ustawienie niektórych plików i zmiennych środowiskowych do wykorzystania przez początkową logikę konfiguracji skryptów, co ominie potrzebę wyświetlania monitu podczas działania skryptu w celu uzyskania dodatkowych informacji.

**Opcje**

* `EMAIL` — adres e-mail używany do przypomnień o wygaśnięciu certyfikatu Certbot
* `DOMAIN` — domena niestandardowa (np. `example.com`) używana do konfiguracji hostingu własnego
* `AUTH_BASIC_USERNAME` — nazwa użytkownika używana podczas pierwszej konfiguracji w celu ochrony witryny
* `AUTH_BASIC_PASSWORD` — hasło używane podczas pierwszej konfiguracji w celu ochrony witryny
* `/root/.cloudflare.ini` — (**tylko dla użytkowników Cloudflare**) plik konfiguracyjny Cloudflare używany przez Certbot do konfiguracji DNS. Wymaga ustawienia tokena API za pomocą `dns_cloudflare_api_token`. Dowiedz się więcej o [Tutaj](https://certbot-dns-cloudflare.readthedocs.io/en/stable/).

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

## Zainstaluj {#install}

Uruchom następujące polecenie na swoim serwerze, aby pobrać i uruchomić skrypt instalacyjny:

```sh
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

### Skrypt instalacyjny debugowania {#debug-install-script}

Aby uzyskać szczegółowe dane wyjściowe, dodaj `DEBUG=true` przed skryptem instalacyjnym:

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

* **Konfiguracja początkowa**: Pobierz najnowszy kod do przekazywania wiadomości e-mail, skonfiguruj środowisko, wyświetl monit o podanie domeny niestandardowej i skonfiguruj wszystkie niezbędne certyfikaty, klucze i sekrety.
* **Konfiguracja kopii zapasowej**: Skonfiguruje cron do tworzenia kopii zapasowych mongoDB i Redis przy użyciu magazynu zgodnego z S3, zapewniającego bezpieczne, zdalne przechowywanie danych. Osobno, po zalogowaniu, zostanie utworzona kopia zapasowa SQLite, jeśli zostaną wprowadzone zmiany, aby zapewnić bezpieczne, szyfrowane kopie zapasowe.
* **Konfiguracja aktualizacji**: Skonfiguruje cron do wyszukiwania nocnych aktualizacji, które bezpiecznie odbudują i ponownie uruchomią komponenty infrastruktury.
* **Odnawianie certyfikatów**: Certbot / lets encrypt jest używany do certyfikatów SSL, a klucze wygasają co 3 miesiące. Spowoduje to odnowienie certyfikatów dla Twojej domeny i umieszczenie ich w odpowiednim folderze, aby mogły być wykorzystane przez powiązane komponenty. Zobacz [ważne ścieżki plików](#important-file-paths)
* **Przywracanie z kopii zapasowej**: Uruchomi mongoDB i Redis w celu przywrócenia danych z kopii zapasowej.

### Konfiguracja początkowa (opcja 1) {#initial-setup-option-1}

Aby rozpocząć, wybierz opcję `1. Initial setup`.

Po zakończeniu powinien pojawić się komunikat o powodzeniu. Możesz nawet uruchomić `docker ps`, aby zobaczyć, które komponenty zostały uruchomione. Więcej informacji o komponentach poniżej.

## Usługi {#services}

| Nazwa usługi | Domyślny port | Opis |
| ------------ | :----------: | ------------------------------------------------------ |
| Sieć | `443` | Interfejs internetowy do wszystkich interakcji administracyjnych |
| API | `4000` | Warstwa API do abstrakcyjnych baz danych |
| Bree | Nic | Praca w tle i wykonawca zadań |
| SMTP | `465/587` | Serwer SMTP dla poczty wychodzącej |
| SMTP Bree | Nic | Praca w tle SMTP |
| MX | `2525` | Wymiana poczty dla poczty przychodzącej i przekazywanie poczty e-mail |
| IMAP | `993/2993` | Serwer IMAP do zarządzania pocztą przychodzącą i skrzynką pocztową |
| POP3 | `995/2995` | Serwer POP3 do zarządzania pocztą przychodzącą i skrzynką pocztową |
| Sqlite | `3456` | Serwer SQLite do interakcji z bazami danych SQLite |
| SQLite Bree | Nic | Praca w tle w programie SQLite |
| CalDAV | `5000` | Serwer CalDAV do zarządzania kalendarzem |
| KartaDAV | `6000` | Serwer CardDAV do zarządzania kalendarzem |
| MongoDB | `27017` | Baza danych MongoDB do większości zastosowań w zarządzaniu danymi |
| Redis | `6379` | Redis do buforowania i zarządzania stanem |
| Sqlite | Nic | Bazy danych SQLite dla szyfrowanych skrzynek pocztowych |

### Ważne ścieżki plików {#important-file-paths}

Uwaga: *Ścieżka hosta* poniżej jest względna do `/root/forwardemail.net/self-hosting/`.

| Część | Ścieżka hosta | Ścieżka kontenera |
| ---------------------- | :-------------------: | ---------------------------- |
| MongoDB | `./mongo-backups` | `/backups` |
| Redis | `./redis-data` | `/data` |
| Sqlite | `./sqlite-data` | `/mnt/{SQLITE_STORAGE_PATH}` |
| Plik env | `./.env` | `/app/.env` |
| Certyfikaty/klucze SSL | `./ssl` | `/app/ssl/` |
| Klucz prywatny | `./ssl/privkey.pem` | `/app/ssl/privkey.pem` |
| Pełny certyfikat łańcucha | `./ssl/fullchain.pem` | `/app/ssl/fullchain.pem` |
| Certyfikowani CA | `./ssl/cert.pem` | `/app/ssl/cert.pem` |
| Klucz prywatny DKIM | `./ssl/dkim.key` | `/app/ssl/dkim.key` |

> \[!IMPORTANT]
> Save the `.env` file securely. It is critical for recovery in case of failure.
> You can find this in `/root/forwardemail.net/self-hosting/.env`.

## Konfiguracja {#configuration}

### Początkowa konfiguracja DNS {#initial-dns-setup}

Skonfiguruj odpowiednie rekordy DNS u wybranego dostawcy DNS. Zwróć uwagę, że wszystkie wartości w nawiasach (`<>`) są dynamiczne i należy je zaktualizować o wybraną wartość.

| Typ | Nazwa | Treść | TTL |
| ----- | ------------------ | ----------------------------- | ---- |
| A | „@”, „.” lub puste miejsce | <adres_ip> | automatyczny |
| CNAME | API | <nazwa_domeny> | automatyczny |
| CNAME | kaldav | <nazwa_domeny> | automatyczny |
| CNAME | kartadav | <nazwa_domeny> | automatyczny |
| CNAME | fe-odbicia | <nazwa_domeny> | automatyczny |
| CNAME | imap | <nazwa_domeny> | automatyczny |
| CNAME | mx | <nazwa_domeny> | automatyczny |
| CNAME | pop3 | <nazwa_domeny> | automatyczny |
| CNAME | Smtp | <nazwa_domeny> | automatyczny |
| MX | „@”, „.” lub puste miejsce | mx.<nazwa_domeny> (priorytet 0) | automatyczny |
| TXT | „@”, „.” lub puste miejsce | "v=spf1 a -wszystko" | automatyczny |

#### Odwrotny rekord DNS/PTR {#reverse-dns--ptr-record}

Odwrotny DNS (rDNS) lub odwrotne rekordy wskaźnika (PTR records) są niezbędne dla serwerów poczty e-mail, ponieważ pomagają zweryfikować legalność serwera wysyłającego wiadomość e-mail. Każdy dostawca chmury robi to inaczej, więc musisz sprawdzić, jak dodać „Odwrotny DNS”, aby zmapować hosta i adres IP na odpowiadającą mu nazwę hosta. Najprawdopodobniej w sekcji sieciowej dostawcy.

#### Port 25 zablokowany {#port-25-blocked}

Niektórzy dostawcy usług internetowych i usług w chmurze blokują 25, aby uniknąć złych aktorów. Może być konieczne złożenie zgłoszenia pomocy technicznej w celu otwarcia portu 25 dla SMTP / poczty wychodzącej.

## Wdrażanie {#onboarding}

1. Otwórz stronę docelową
Przejdź do https\://\<nazwa_domeny>, zastępując \<nazwa_domeny> domeną skonfigurowaną w ustawieniach DNS. Powinna wyświetlić się strona docelowa „Przekieruj e-mail”.

2. Zaloguj się i włącz swoją domenę

* Zaloguj się za pomocą prawidłowego adresu e-mail i hasła.
* Wprowadź nazwę domeny, którą chcesz skonfigurować (musi być zgodna z konfiguracją DNS).
* Postępuj zgodnie z instrukcjami, aby dodać wymagane rekordy **MX** i **TXT** w celu weryfikacji.

3. Zakończ konfigurację

* Po weryfikacji przejdź na stronę Aliasy, aby utworzyć swój pierwszy alias.
* Opcjonalnie skonfiguruj **SMTP dla poczty wychodzącej** w **Ustawieniach domeny**. Wymaga to dodatkowych rekordów DNS.

> \[!NOTE]
> No information is sent outside of your server. The self hosted option and initial account is just for the admin login and web view to manage domains, aliases and related email configurations.

## Testowanie {#testing}

### Tworzenie pierwszego aliasu {#creating-your-first-alias}

1. Przejdź do strony Aliasy
Otwórz stronę zarządzania aliasami:

```sh
https://<domain_name>/en/my-account/domains/<domain_name>/aliases
```

2. Dodaj nowy alias

* Kliknij **Dodaj alias** (prawy górny róg).
* Wprowadź nazwę aliasu i dostosuj ustawienia poczty e-mail według potrzeb.
* (Opcjonalnie) Włącz obsługę **IMAP/POP3/CalDAV/CardDAV**, zaznaczając pole wyboru.
* Kliknij **Utwórz alias.**

3. Ustaw hasło

* Kliknij **Generuj hasło**, aby utworzyć bezpieczne hasło.
* To hasło będzie wymagane do zalogowania się do klienta poczty e-mail.

4. Skonfiguruj swojego klienta poczty e-mail

* Użyj klienta poczty e-mail, takiego jak Thunderbird.
* Wprowadź nazwę aliasu i wygenerowane hasło.
* Skonfiguruj odpowiednio ustawienia **IMAP** i **SMTP**.

#### Ustawienia serwera e-mail {#email-server-settings}

Nazwa użytkownika: `<alias name>`

| Typ | Nazwa hosta | Port | Bezpieczeństwo połączenia | Uwierzytelnianie |
| ---- | ------------------ | ---- | ------------------- | --------------- |
| SMTP | smtp.<nazwa_domeny> | 465 | SSL / TLS | Normalne hasło |
| IMAP | imap.<nazwa_domeny> | 993 | SSL / TLS | Normalne hasło |

### Wysyłanie/odbieranie pierwszej wiadomości e-mail {#sending--receiving-your-first-email}

Po skonfigurowaniu będziesz mieć możliwość wysyłania i odbierania wiadomości e-mail na nowo utworzony i samodzielnie hostowany adres e-mail!

## Rozwiązywanie problemów {#troubleshooting}

#### Dlaczego to nie działa poza Ubuntu i Debian {#why-doesnt-this-work-outside-of-ubuntu-and-debian}

Aktualnie szukamy wsparcia dla systemu macOS i będziemy szukać wsparcia dla innych. Otwórz [dyskusja](https://github.com/orgs/forwardemail/discussions) lub przekaż nam swoją opinię, jeśli chcesz, aby inni również otrzymali wsparcie.

#### Dlaczego wyzwanie certbot acme kończy się niepowodzeniem {#why-is-the-certbot-acme-challenge-failing}

Najczęstszą pułapką jest to, że certbot / letsencrypt czasami żąda **2** wyzwań. Musisz upewnić się, że dodałeś **OBA** rekordy txt.

Przykład:
Możesz zobaczyć dwa wyzwania takie jak to:
\_acme-challenge.example.com -> "randomstring1"
\_acme-challenge.example.com -> "randomstring2"

Możliwe jest również, że propagacja DNS nie została ukończona. Możesz użyć narzędzi takich jak: `https://toolbox.googleapps.com/apps/dig/#TXT/_acme-challenge.<your_domain>`. To pozwoli Ci zorientować się, czy zmiany w rekordzie TXT powinny zostać uwzględnione. Możliwe jest również, że lokalna pamięć podręczna DNS na Twoim hoście nadal używa starej, nieaktualnej wartości lub nie wykryła ostatnich zmian.

Inną opcją jest użycie zautomatyzowanych zmian DNS w Cerbocie poprzez ustawienie pliku `/root/.cloudflare.ini` z tokenem API w pliku cloud-init/user-data podczas początkowej konfiguracji VPS lub utworzenie tego pliku i ponowne uruchomienie skryptu. Spowoduje to automatyczne zarządzanie zmianami DNS i aktualizacjami wyzwań.

### Jaka jest podstawowa nazwa użytkownika i hasło autoryzacji {#what-is-the-basic-auth-username-and-password}

W przypadku hostingu własnego dodajemy wyskakujące okienko uwierzytelniania w przeglądarce, zawierające prostą nazwę użytkownika (`admin`) i hasło (generowane losowo podczas początkowej konfiguracji). Dodajemy je tylko jako zabezpieczenie na wypadek, gdyby automatyzacja/scrapery w jakiś sposób wyprzedziły Cię w rejestracji w środowisku internetowym. Hasło to znajdziesz po początkowej konfiguracji w pliku `.env` w sekcjach `AUTH_BASIC_USERNAME` i `AUTH_BASIC_PASSWORD`.

### Jak mogę dowiedzieć się, co jest uruchomione w domenie {#how-do-i-know-what-is-running}

Możesz uruchomić `docker ps`, aby zobaczyć wszystkie uruchomione kontenery, które są uruchamiane z pliku `docker-compose-self-hosting.yml`. Możesz również uruchomić `docker ps -a`, aby zobaczyć wszystko (w tym kontenery, które nie są uruchomione).

### Jak mogę sprawdzić, czy coś nie działa, mimo że powinno być {#how-do-i-know-if-something-isnt-running-that-should-be}

Możesz uruchomić `docker ps -a`, aby zobaczyć wszystko (w tym kontenery, które nie są uruchomione). Możesz zobaczyć dziennik wyjścia lub notatkę.

### Jak znaleźć logi {#how-do-i-find-logs}

Więcej logów można uzyskać za pomocą `docker logs -f <container_name>`. Jeśli coś się wydarzyło, prawdopodobnie jest to związane z nieprawidłową konfiguracją pliku `.env`.

W interfejsie internetowym można przeglądać dzienniki wiadomości e-mail wychodzących i dzienniki błędów `/admin/emails` i `/admin/logs`.

### Dlaczego moje wiadomości e-mail wychodzące przekraczają limit czasu {#why-are-my-outgoing-emails-timing-out}

Jeśli widzisz komunikat, taki jak Przekroczono limit czasu połączenia podczas łączenia się z serwerem MX..., być może musisz sprawdzić, czy port 25 jest zablokowany. Dostawcy usług internetowych lub dostawcy usług w chmurze często blokują to domyślnie, więc może być konieczne skontaktowanie się z pomocą techniczną / złożenie zgłoszenia, aby to otworzyć.

#### Jakich narzędzi powinienem używać do testowania najlepszych praktyk konfiguracji poczty e-mail i reputacji adresów IP {#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation}

Spójrz na nasz [FAQ tutaj](/faq#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation).