# Samodzielnie hostowany {#self-hosted}

## Spis treści {#table-of-contents}

* [Rozpoczęcie pracy](#getting-started)
* [Wymagania](#requirements)
  * [Cloud-init / dane użytkownika](#cloud-init--user-data)
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
  * [Jaka jest podstawowa nazwa użytkownika i hasło autoryzacyjne?](#what-is-the-basic-auth-username-and-password)
  * [Skąd mam wiedzieć, co jest uruchomione?](#how-do-i-know-what-is-running)
  * [Skąd mam wiedzieć, czy coś nie działa, mimo że powinno?](#how-do-i-know-if-something-isnt-running-that-should-be)
  * [Jak znaleźć dzienniki?](#how-do-i-find-logs)
  * [Dlaczego moje wiadomości e-mail wychodzące przekroczą limit czasu?](#why-are-my-outgoing-emails-timing-out)

## Rozpoczęcie pracy {#getting-started}

Nasze samodzielnie hostowane rozwiązanie poczty e-mail, podobnie jak wszystkie nasze produkty, jest w 100% open source – zarówno front-end, jak i back-end. Oznacza to:

1. **Pełna przejrzystość**: Każda linijka kodu przetwarzająca Twoje wiadomości e-mail jest dostępna do publicznej kontroli.
2. **Wkład społeczności**: Każdy może wprowadzać ulepszenia lub naprawiać problemy.
3. **Bezpieczeństwo dzięki otwartości**: Luki w zabezpieczeniach mogą zostać zidentyfikowane i naprawione przez globalną społeczność.
4. **Brak uzależnienia od jednego dostawcy**: Nigdy nie jesteś zależny od istnienia naszej firmy.

Cały kod źródłowy jest dostępny na platformie GitHub pod adresem <https://github.com/forwardemail/forwardemail.net>, i podlega licencji MIT.

Architektura obejmuje kontenery dla:

* Serwer SMTP do poczty wychodzącej
* Serwery IMAP/POP3 do pobierania poczty
* Interfejs webowy do administracji
* Baza danych do przechowywania konfiguracji
* Redis do buforowania i poprawy wydajności
* SQLite do bezpiecznego, szyfrowanego przechowywania skrzynek pocztowych

> \[!NOTE]
> Koniecznie sprawdź nasz [blog z własnym hostingiem](https://forwardemail.net/blog/docs/self-hosted-solution)
>
> A osoby zainteresowane bardziej szczegółową wersją krok po kroku zapoznaj się z naszymi przewodnikami opartymi na [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) lub [Debian](https://forwardemail.net/guides/selfhosted-on-debian).

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
> Zobacz naszą listę [niesamowici dostawcy serwerów pocztowych](https://github.com/forwardemail/awesome-mail-server-providers)

### Inicjalizacja chmury / dane użytkownika {#cloud-init--user-data}

Większość dostawców usług w chmurze obsługuje konfigurację cloud-init podczas konfiguracji wirtualnego serwera prywatnego (VPS). To doskonały sposób na wcześniejsze skonfigurowanie niektórych plików i zmiennych środowiskowych do użycia przez logikę konfiguracji początkowej skryptów, co pozwala uniknąć konieczności wyświetlania monitu o dodatkowe informacje podczas działania skryptu.

**Opcje**

* `EMAIL` — adres e-mail używany do przypomnień o wygaśnięciu certyfikatu Certbot
* `DOMAIN` — domena niestandardowa (np. `example.com`) używana do konfiguracji hostingu własnego
* `AUTH_BASIC_USERNAME` — nazwa użytkownika używana podczas pierwszej konfiguracji w celu ochrony witryny
* `AUTH_BASIC_PASSWORD` — hasło używane podczas pierwszej konfiguracji w celu ochrony witryny
* `/root/.cloudflare.ini` — (**Tylko dla użytkowników Cloudflare**) plik konfiguracyjny Cloudflare używany przez Certbot do konfiguracji DNS. Wymaga ustawienia tokenu API za pomocą `dns_cloudflare_api_token`. Dowiedz się więcej o [Tutaj](https://certbot-dns-cloudflare.readthedocs.io/en/stable/).

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

### Skrypt instalacji debugowania {#debug-install-script}

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

Po zakończeniu powinien pojawić się komunikat o powodzeniu. Możesz nawet uruchomić `docker ps`, aby zobaczyć **uruchomione** komponenty. Więcej informacji o komponentach poniżej.

## Usługi {#services}

| Nazwa usługi | Domyślny port | Opis |
| ------------ | :----------: | ------------------------------------------------------ |
| Sieć | `443` | Interfejs internetowy do wszystkich interakcji administracyjnych |
| API | `4000` | Warstwa API do abstrakcyjnych baz danych |
| Bree | Nic | Praca w tle i wykonawca zadań |
| SMTP | `465/587` | Serwer SMTP dla poczty wychodzącej |
| SMTP Bree | Nic | Zadanie SMTP w tle |
| MX | `2525` | Wymiana poczty dla poczty przychodzącej i przekazywanie poczty e-mail |
| IMAP | `993/2993` | Serwer IMAP do zarządzania pocztą przychodzącą i skrzynkami pocztowymi |
| POP3 | `995/2995` | Serwer POP3 do zarządzania pocztą przychodzącą i skrzynką pocztową |
| SQLite | `3456` | Serwer SQLite do interakcji z bazami danych SQLite |
| SQLite Bree | Nic | Praca w tle SQLite |
| CalDAV | `5000` | Serwer CalDAV do zarządzania kalendarzem |
| CardDAV | `6000` | Serwer CardDAV do zarządzania kalendarzem |
| MongoDB | `27017` | Baza danych MongoDB do większości zastosowań w zarządzaniu danymi |
| Redis | `6379` | Redis do buforowania i zarządzania stanem |
| SQLite | Nic | Bazy danych SQLite dla szyfrowanych skrzynek pocztowych |

### Ważne ścieżki plików {#important-file-paths}

Uwaga: *Ścieżka hosta* poniżej jest względna w stosunku do `/root/forwardemail.net/self-hosting/`.

| Część | Ścieżka hosta | Ścieżka kontenera |
| ---------------------- | :-------------------: | ---------------------------- |
| MongoDB | `./mongo-backups` | `/backups` |
| Redis | `./redis-data` | `/data` |
| SQLite | `./sqlite-data` | `/mnt/{SQLITE_STORAGE_PATH}` |
| Plik Env | `./.env` | `/app/.env` |
| Certyfikaty/klucze SSL | `./ssl` | `/app/ssl/` |
| Klucz prywatny | `./ssl/privkey.pem` | `/app/ssl/privkey.pem` |
| Pełny certyfikat łańcucha | `./ssl/fullchain.pem` | `/app/ssl/fullchain.pem` |
| Certyfikowani CA | `./ssl/cert.pem` | `/app/ssl/cert.pem` |
| Klucz prywatny DKIM | `./ssl/dkim.key` | `/app/ssl/dkim.key` |

> \[!IMPORTANT]
> Zapisz bezpiecznie plik `.env`. Jest on niezbędny do odzyskania danych w przypadku awarii.
> Znajdziesz go w pliku `/root/forwardemail.net/self-hosting/.env`.

## Konfiguracja {#configuration}

### Początkowa konfiguracja DNS {#initial-dns-setup}

Skonfiguruj odpowiednie rekordy DNS u wybranego dostawcy DNS. Pamiętaj, że wszystkie wartości w nawiasach (`<>`) są dynamiczne i należy je zaktualizować o Twoją wartość.

| Typ | Nazwa | Treść | TTL |
| ----- | ------------------ | ----------------------------- | ---- |
| A | „@”, „.” lub puste miejsce | <adres_ip> | automatyczny |
| CNAME | API | <nazwa_domeny> | automatyczny |
| CNAME | Caldav | <nazwa_domeny> | automatyczny |
| CNAME | carddav | <nazwa_domeny> | automatyczny |
| CNAME | fe-odbicia | <nazwa_domeny> | automatyczny |
| CNAME | imap | <nazwa_domeny> | automatyczny |
| CNAME | mx | <nazwa_domeny> | automatyczny |
| CNAME | pop3 | <nazwa_domeny> | automatyczny |
| CNAME | SMTP | <nazwa_domeny> | automatyczny |
| MX | „@”, „.” lub puste miejsce | mx.<nazwa_domeny> (priorytet 0) | automatyczny |
| TXT | „@”, „.” lub puste miejsce | "v=spf1 a -all" | automatyczny |

#### Odwrotny rekord DNS/PTR {#reverse-dns--ptr-record}

Odwrotny DNS (rDNS) lub rekordy wskaźników odwrotnych (PTR) są niezbędne dla serwerów poczty e-mail, ponieważ pomagają zweryfikować wiarygodność serwera wysyłającego wiadomość e-mail. Każdy dostawca usług w chmurze robi to inaczej, dlatego należy sprawdzić, jak dodać „Odwrotny DNS”, aby zmapować hosta i adres IP na odpowiadającą mu nazwę hosta. Najprawdopodobniej w sekcji sieciowej dostawcy.

#### Port 25 zablokowany {#port-25-blocked}

Niektórzy dostawcy usług internetowych i chmury blokują port 25, aby uniknąć oszustów. Może być konieczne zgłoszenie do pomocy technicznej w celu otwarcia portu 25 dla SMTP / poczty wychodzącej.

## Wdrażanie {#onboarding}

1. Otwórz stronę docelową
Przejdź do https\://\<nazwa_domeny>, zastępując \<nazwa_domeny> domeną skonfigurowaną w ustawieniach DNS. Powinna wyświetlić się strona docelowa „Przekieruj e-mail”.

2. Zaloguj się i zarejestruj swoją domenę

* Zaloguj się, używając prawidłowego adresu e-mail i hasła.
* Wprowadź nazwę domeny, którą chcesz skonfigurować (musi być zgodna z konfiguracją DNS).
* Postępuj zgodnie z instrukcjami, aby dodać wymagane rekordy **MX** i **TXT** w celu weryfikacji.

3. Zakończ konfigurację

* Po weryfikacji przejdź do strony Aliasy, aby utworzyć swój pierwszy alias.
* Opcjonalnie skonfiguruj **SMTP dla poczty wychodzącej** w **Ustawieniach domeny**. Wymaga to dodatkowych rekordów DNS.

> \[!NOTE]
> Żadne informacje nie są wysyłane poza Twój serwer. Opcja samodzielnego hostingu i konto początkowe służą jedynie do logowania administratora i widoku internetowego do zarządzania domenami, aliasami i powiązanymi konfiguracjami poczty e-mail.

## Testowanie {#testing}

### Tworzenie pierwszego aliasu {#creating-your-first-alias}

1. Przejdź do strony Aliasy
Otwórz stronę zarządzania aliasami:

```sh
https://<domain_name>/en/my-account/domains/<domain_name>/aliases
```

2. Dodaj nowy alias

* Kliknij **Dodaj alias** (w prawym górnym rogu).
* Wprowadź nazwę aliasu i dostosuj ustawienia poczty e-mail w razie potrzeby.
* (Opcjonalnie) Włącz obsługę **IMAP/POP3/CalDAV/CardDAV**, zaznaczając pole wyboru.
* Kliknij **Utwórz alias.**

3. Ustaw hasło

* Kliknij **Wygeneruj hasło**, aby utworzyć bezpieczne hasło.
* To hasło będzie wymagane do zalogowania się do klienta poczty e-mail.

4. Skonfiguruj swojego klienta poczty e-mail

* Użyj klienta poczty e-mail, takiego jak Betterbird.
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

#### Dlaczego to nie działa poza Ubuntu i Debianem {#why-doesnt-this-work-outside-of-ubuntu-and-debian}

Aktualnie szukamy wsparcia dla systemu macOS i będziemy szukać innych. Otwórz [dyskusja](https://github.com/orgs/forwardemail/discussions) lub przekaż nam swój wkład, jeśli chcesz, aby inni również byli obsługiwani.

#### Dlaczego wyzwanie certbot acme kończy się niepowodzeniem {#why-is-the-certbot-acme-challenge-failing}

Najczęstszą pułapką jest to, że certbot/letsencrypt czasami żąda **2** wyzwań. Należy upewnić się, że dodano **OBA** rekordy txt.

Przykład:
Możesz zobaczyć dwa takie wyzwania:
\_acme-challenge.example.com -> "losowy ciąg1"
\_acme-challenge.example.com -> "losowy ciąg2"

Możliwe jest również, że propagacja DNS nie została ukończona. Możesz użyć narzędzi takich jak: `https://toolbox.googleapps.com/apps/dig/#TXT/_acme-challenge.<your_domain>`. To pozwoli Ci zorientować się, czy zmiany w rekordzie TXT powinny zostać uwzględnione. Możliwe jest również, że lokalna pamięć podręczna DNS na Twoim hoście nadal używa starej, nieaktualnej wartości lub nie wykryła ostatnich zmian.

Inną opcją jest użycie zautomatyzowanych zmian DNS w Cerbocie poprzez ustawienie pliku `/root/.cloudflare.ini` z tokenem API w pliku cloud-init/user-data podczas początkowej konfiguracji VPS lub utworzenie tego pliku i ponowne uruchomienie skryptu. Spowoduje to automatyczne zarządzanie zmianami DNS i aktualizacjami wyzwań.

### Jaka jest podstawowa nazwa użytkownika i hasło autoryzacji {#what-is-the-basic-auth-username-and-password}

W przypadku hostingu własnego dodajemy wyskakujące okienko uwierzytelniania w przeglądarce, zawierające prostą nazwę użytkownika (`admin`) i hasło (generowane losowo podczas początkowej konfiguracji). Dodajemy je tylko jako zabezpieczenie na wypadek, gdyby automatyzacja/scrapery w jakiś sposób wyprzedziły Cię w rejestracji w środowisku internetowym. Hasło to znajdziesz po początkowej konfiguracji w pliku `.env` w `AUTH_BASIC_USERNAME` i `AUTH_BASIC_PASSWORD`.

### Skąd mam wiedzieć, co jest uruchomione w {#how-do-i-know-what-is-running}

Możesz uruchomić `docker ps`, aby zobaczyć wszystkie uruchomione kontenery, które są uruchamiane z pliku `docker-compose-self-hosting.yml`. Możesz również uruchomić `docker ps -a`, aby zobaczyć wszystko (w tym kontenery, które nie są uruchomione).

### Skąd mam wiedzieć, czy coś nie działa, mimo że powinno być {#how-do-i-know-if-something-isnt-running-that-should-be}

Możesz uruchomić `docker ps -a`, aby zobaczyć wszystko (w tym kontenery, które nie są uruchomione). Możesz zobaczyć dziennik wyjścia lub notatkę.

### Jak znaleźć dzienniki {#how-do-i-find-logs}

Więcej logów można uzyskać za pomocą `docker logs -f <container_name>`. Jeśli coś się wydarzyło, prawdopodobnie jest to związane z nieprawidłową konfiguracją pliku `.env`.

W interfejsie internetowym można przeglądać dzienniki wiadomości e-mail wychodzących i dzienniki błędów `/admin/emails` i `/admin/logs`.

### Dlaczego moje wiadomości e-mail wychodzące przekraczają limit czasu {#why-are-my-outgoing-emails-timing-out}

Jeśli podczas łączenia się z serwerem MX pojawi się komunikat „Przekroczono limit czasu połączenia”, może być konieczne sprawdzenie, czy port 25 nie jest zablokowany. Dostawcy usług internetowych i usług chmurowych często blokują tę opcję domyślnie, dlatego może być konieczne skontaktowanie się z pomocą techniczną lub zgłoszenie problemu.

#### Jakich narzędzi powinienem używać do testowania najlepszych praktyk konfiguracji poczty e-mail i reputacji adresów IP {#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation}

Przyjrzyj się naszemu [FAQ tutaj](/faq#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation).