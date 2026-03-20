# Listmonk z Forward Email dla bezpiecznej dostawy newsletterów {#listmonk-with-forward-email-for-secure-newsletter-delivery}


## Spis treści {#table-of-contents}

* [Przegląd](#overview)
* [Dlaczego Listmonk i Forward Email](#why-listmonk-and-forward-email)
* [Wymagania wstępne](#prerequisites)
* [Instalacja](#installation)
  * [1. Aktualizacja serwera](#1-update-your-server)
  * [2. Instalacja zależności](#2-install-dependencies)
  * [3. Pobranie konfiguracji Listmonk](#3-download-listmonk-configuration)
  * [4. Konfiguracja zapory (UFW)](#4-configure-firewall-ufw)
  * [5. Konfiguracja dostępu HTTPS](#5-configure-https-access)
  * [6. Uruchomienie Listmonk](#6-start-listmonk)
  * [7. Konfiguracja SMTP Forward Email w Listmonk](#7-configure-forward-email-smtp-in-listmonk)
  * [8. Konfiguracja przetwarzania odbić](#8-configure-bounce-processing)
* [Testowanie](#testing)
  * [Utwórz listę mailingową](#create-a-mailing-list)
  * [Dodaj subskrybentów](#add-subscribers)
  * [Utwórz i wyślij kampanię](#create-and-send-a-campaign)
* [Weryfikacja](#verification)
* [Notatki dla deweloperów](#developer-notes)
* [Podsumowanie](#conclusion)


## Przegląd {#overview}

Ten przewodnik dostarcza deweloperom krok po kroku instrukcje dotyczące konfiguracji [Listmonk](https://listmonk.app/), potężnego, otwartoźródłowego menedżera newsletterów i list mailingowych, aby używać [Forward Email](https://forwardemail.net/) jako dostawcy SMTP. To połączenie pozwala skutecznie zarządzać kampaniami, zapewniając jednocześnie bezpieczną, prywatną i niezawodną dostawę e-maili.

* **Listmonk**: Zarządza subskrybentami, organizacją list, tworzeniem kampanii i śledzeniem wyników.
* **Forward Email**: Działa jako bezpieczny serwer SMTP, obsługując faktyczne wysyłanie e-maili z wbudowanymi funkcjami bezpieczeństwa takimi jak SPF, DKIM, DMARC i szyfrowanie TLS.

Integrując te dwa rozwiązania, zachowujesz pełną kontrolę nad swoimi danymi i infrastrukturą, korzystając jednocześnie z solidnego systemu dostarczania Forward Email.


## Dlaczego Listmonk i Forward Email {#why-listmonk-and-forward-email}

* **Open Source**: Zarówno Listmonk, jak i zasady stojące za Forward Email podkreślają przejrzystość i kontrolę. Hostujesz Listmonk samodzielnie, posiadając swoje dane.
* **Skupienie na prywatności**: Forward Email został stworzony z myślą o prywatności, minimalizując przechowywanie danych i koncentrując się na bezpiecznej transmisji.
* **Ekonomiczne rozwiązanie**: Listmonk jest darmowy, a Forward Email oferuje hojne darmowe plany oraz przystępne cenowo plany płatne, co czyni to rozwiązanie przyjaznym dla budżetu.
* **Skalowalność**: Listmonk jest bardzo wydajny, a infrastruktura Forward Email zaprojektowana jest do niezawodnej dostawy na dużą skalę.
* **Przyjazne dla deweloperów**: Listmonk oferuje solidne API, a Forward Email zapewnia prostą integrację SMTP i webhooki.


## Wymagania wstępne {#prerequisites}

Przed rozpoczęciem upewnij się, że masz:

* Wirtualny serwer prywatny (VPS) z aktualną dystrybucją Linuksa (zalecany Ubuntu 20.04+) z co najmniej 1 CPU i 1GB RAM (zalecane 2GB).
  * Potrzebujesz dostawcy? Sprawdź [polecaną listę VPS](https://github.com/forwardemail/awesome-mail-server-providers).
* Nazwę domeny, którą kontrolujesz (wymagany dostęp do DNS).
* Aktywne konto w [Forward Email](https://forwardemail.net/).
* Dostęp root lub `sudo` do VPS.
* Podstawową znajomość operacji w linii poleceń Linuksa.


## Instalacja {#installation}

Te kroki przeprowadzą Cię przez instalację Listmonk za pomocą Dockera i Docker Compose na Twoim VPS.

### 1. Aktualizacja serwera {#1-update-your-server}

Upewnij się, że lista pakietów systemowych i zainstalowane pakiety są aktualne.

```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Instalacja zależności {#2-install-dependencies}

Zainstaluj Docker, Docker Compose oraz UFW (Uncomplicated Firewall).

```bash
sudo apt install -y docker.io docker-compose ufw
```

### 3. Pobranie konfiguracji Listmonk {#3-download-listmonk-configuration}

Utwórz katalog dla Listmonk i pobierz oficjalny plik `docker-compose.yml`.

```bash
mkdir listmonk && cd listmonk
curl -Lo docker-compose.yml https://raw.githubusercontent.com/knadh/listmonk/master/docker-compose.yml
```

Ten plik definiuje kontener aplikacji Listmonk oraz wymagany kontener bazy danych PostgreSQL.
### 4. Konfiguracja zapory sieciowej (UFW) {#4-configure-firewall-ufw}

Zezwól na niezbędny ruch (SSH, HTTP, HTTPS) przez zaporę sieciową. Jeśli Twój SSH działa na niestandardowym porcie, dostosuj to odpowiednio.

```bash
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
```

Potwierdź włączenie zapory, gdy zostaniesz o to poproszony.

### 5. Konfiguracja dostępu HTTPS {#5-configure-https-access}

Uruchomienie Listmonk przez HTTPS jest kluczowe dla bezpieczeństwa. Masz dwie główne opcje:

#### Opcja A: Użycie proxy Cloudflare (zalecane dla prostoty) {#option-a-using-cloudflare-proxy-recommended-for-simplicity}

Jeśli DNS Twojej domeny jest zarządzany przez Cloudflare, możesz skorzystać z ich funkcji proxy, aby łatwo uzyskać HTTPS.

1. **Wskaż DNS**: Utwórz rekord `A` w Cloudflare dla subdomeny Listmonk (np. `listmonk.twojadomena.com`) wskazujący na adres IP Twojego VPS. Upewnij się, że **Status proxy** jest ustawiony na **Proxied** (pomarańczowa chmura).
2. **Zmodyfikuj Docker Compose**: Edytuj plik `docker-compose.yml`, który pobrałeś:
   ```bash
   sed -i 's/9000:9000/80:9000/' docker-compose.yml
   ```
   Dzięki temu Listmonk będzie dostępny wewnętrznie na porcie 80, który Cloudflare może następnie proxyfikować i zabezpieczyć przez HTTPS.

#### Opcja B: Użycie reverse proxy (Nginx, Caddy itp.) {#option-b-using-a-reverse-proxy-nginx-caddy-etc}

Alternatywnie możesz skonfigurować reverse proxy, takie jak Nginx lub Caddy, na swoim VPS, aby obsługiwało zakończenie HTTPS i przekazywało żądania do Listmonk (domyślnie działającego na porcie 9000).

* Zachowaj domyślne `ports: - "127.0.0.1:9000:9000"` w `docker-compose.yml`, aby Listmonk był dostępny tylko lokalnie.
* Skonfiguruj wybrane reverse proxy, aby nasłuchiwało na portach 80 i 443, obsługiwało pozyskiwanie certyfikatów SSL (np. przez Let's Encrypt) i przekazywało ruch do `http://127.0.0.1:9000`.
* Szczegółowa konfiguracja reverse proxy wykracza poza zakres tego przewodnika, ale w internecie dostępnych jest wiele tutoriali.

### 6. Uruchomienie Listmonk {#6-start-listmonk}

Wróć do katalogu `listmonk` (jeśli jeszcze tam nie jesteś) i uruchom kontenery w trybie odłączonym.

```bash
cd ~/listmonk # Lub katalog, w którym zapisałeś docker-compose.yml
docker compose up -d
```

Docker pobierze niezbędne obrazy i uruchomi kontenery aplikacji Listmonk oraz bazy danych. Może to potrwać minutę lub dwie przy pierwszym uruchomieniu.

✅ **Dostęp do Listmonk**: Teraz powinieneś mieć dostęp do interfejsu webowego Listmonk pod skonfigurowaną domeną (np. `https://listmonk.twojadomena.com`).

### 7. Konfiguracja SMTP Forward Email w Listmonk {#7-configure-forward-email-smtp-in-listmonk}

Następnie skonfiguruj Listmonk do wysyłania e-maili za pomocą konta Forward Email.

1. **Włącz SMTP w Forward Email**: Upewnij się, że wygenerowałeś dane uwierzytelniające SMTP w panelu swojego konta Forward Email. Jeśli jeszcze tego nie zrobiłeś, postępuj zgodnie z [przewodnikiem Forward Email dotyczącym wysyłania e-maili z własną domeną przez SMTP](https://forwardemail.net/en/guides/send-email-with-custom-domain-smtp).
2. **Konfiguracja Listmonk**: Zaloguj się do panelu administracyjnego Listmonk.
   * Przejdź do **Ustawienia -> SMTP**.

   * Listmonk ma wbudowane wsparcie dla Forward Email. Wybierz **ForwardEmail** z listy dostawców lub ręcznie wpisz następujące dane:

     | Ustawienie       | Wartość                                                                                                             |
     | :---------------- | :------------------------------------------------------------------------------------------------------------------ |
     | **Host**          | `smtp.forwardemail.net`                                                                                             |
     | **Port**          | `465`                                                                                                               |
     | **Protokół uwierzytelniania** | `LOGIN`                                                                                                             |
     | **Nazwa użytkownika**      | Twój **nazwa użytkownika SMTP** z Forward Email                                                                   |
     | **Hasło**         | Twoje **hasło SMTP** z Forward Email                                                                                |
     | **TLS**           | `SSL/TLS`                                                                                                           |
     | **Adres nadawcy** | Twój pożądany adres `From` (np. `newsletter@twojadomena.com`). Upewnij się, że ta domena jest skonfigurowana w Forward Email. |
* **Ważne**: Zawsze używaj portu `465` z `SSL/TLS` dla bezpiecznych połączeń z Forward Email (zalecane). Port `587` z STARTTLS jest również obsługiwany, ale preferowany jest SSL/TLS.

   * Kliknij **Zapisz**.
3. **Wyślij testowy e-mail**: Użyj przycisku "Wyślij testowy e-mail" na stronie ustawień SMTP. Wprowadź adres odbiorcy, do którego masz dostęp, i kliknij **Wyślij**. Sprawdź, czy e-mail dotarł do skrzynki odbiorczej odbiorcy.

### 8. Konfiguracja przetwarzania odbić {#8-configure-bounce-processing}

Przetwarzanie odbić pozwala Listmonk automatycznie obsługiwać e-maile, które nie mogły zostać dostarczone (np. z powodu nieprawidłowych adresów). Forward Email udostępnia webhook do powiadamiania Listmonk o odbiciach.

#### Konfiguracja Forward Email {#forward-email-setup}

1. Zaloguj się do swojego [Panelu Forward Email](https://forwardemail.net/).
2. Przejdź do **Domains**, wybierz domenę, której używasz do wysyłki, i przejdź do jej strony **Settings**.
3. Przewiń do sekcji **Bounce Webhook URL**.
4. Wprowadź następujący URL, zastępując `<your_listmonk_domain>` faktyczną domeną lub subdomeną, pod którą dostępna jest Twoja instancja Listmonk:
   ```sh
   https://<your_listmonk_domain>/webhooks/service/forwardemail
   ```
   *Przykład*: `https://listmonk.yourdomain.com/webhooks/service/forwardemail`
5. Przewiń dalej do sekcji **Webhook Signature Payload Verification Key**.
6. **Skopiuj** wygenerowany klucz weryfikacyjny. Będziesz go potrzebować w Listmonk.
7. Zapisz zmiany w ustawieniach domeny Forward Email.

#### Konfiguracja Listmonk {#listmonk-setup}

1. W panelu administracyjnym Listmonk przejdź do **Settings -> Bounces**.
2. Włącz **Enable bounce processing**.
3. Włącz **Enable bounce webhooks**.
4. Przewiń do sekcji **Webhook Providers**.
5. Włącz **Forward Email**.
6. Wklej **Webhook Signature Payload Verification Key**, który skopiowałeś z panelu Forward Email, w pole **Forward Email Key**.
7. Kliknij **Save** na dole strony.
8. Przetwarzanie odbić jest teraz skonfigurowane! Gdy Forward Email wykryje odbicie dla e-maila wysłanego przez Listmonk, powiadomi Twoją instancję Listmonk za pomocą webhooka, a Listmonk odpowiednio oznaczy subskrybenta.
9. Wykonaj poniższe kroki w sekcji [Testowanie](#testing), aby upewnić się, że wszystko działa poprawnie.


## Testowanie {#testing}

Oto szybki przegląd podstawowych funkcji Listmonk:

### Utwórz listę mailingową {#create-a-mailing-list}

* Przejdź do **Lists** w pasku bocznym.
* Kliknij **New List**.
* Wypełnij szczegóły (Nazwa, Typ: Publiczna/ Prywatna, Opis, Tag'i) i **Zapisz**.

### Dodaj subskrybentów {#add-subscribers}

* Przejdź do sekcji **Subscribers**.
* Możesz dodać subskrybentów:
  * **Ręcznie**: Kliknij **New Subscriber**.
  * **Import**: Kliknij **Import Subscribers**, aby przesłać plik CSV.
  * **API**: Użyj API Listmonk do programowego dodawania.
* Przypisz subskrybentów do jednej lub więcej list podczas tworzenia lub importu.
* **Dobra praktyka**: Używaj procesu podwójnego potwierdzenia (double opt-in). Skonfiguruj to w **Settings -> Opt-in & Subscriptions**.

### Utwórz i wyślij kampanię {#create-and-send-a-campaign}

* Przejdź do **Campaigns** -> **New Campaign**.
* Wypełnij szczegóły kampanii (Nazwa, Temat, E-mail nadawcy, Lista(y) do wysyłki).
* Wybierz typ zawartości (Rich Text/HTML, Plain Text, Raw HTML).
* Stwórz treść e-maila. Możesz używać zmiennych szablonów, takich jak `{{ .Subscriber.Email }}` lub `{{ .Subscriber.FirstName }}`.
* **Zawsze najpierw wyślij testowy e-mail!** Użyj opcji "Wyślij test" aby zobaczyć podgląd e-maila w swojej skrzynce.
* Gdy będziesz zadowolony, kliknij **Start Campaign**, aby wysłać od razu lub zaplanuj na później.


## Weryfikacja {#verification}

* **Dostarczenie SMTP**: Regularnie wysyłaj testowe e-maile przez stronę ustawień SMTP Listmonk oraz testowe kampanie, aby upewnić się, że e-maile są poprawnie dostarczane.
* **Obsługa odbić**: Wyślij testową kampanię na znany nieprawidłowy adres e-mail (np. `bounce-test@yourdomain.com`, jeśli nie masz prawdziwego, choć wyniki mogą się różnić). Po krótkim czasie sprawdź statystyki kampanii w Listmonk, czy odbicie zostało zarejestrowane.
* **Nagłówki e-maili**: Użyj narzędzi takich jak [Mail-Tester](https://www.mail-tester.com/) lub ręcznie sprawdź nagłówki e-maili, aby zweryfikować, czy SPF, DKIM i DMARC przechodzą, co wskazuje na poprawną konfigurację przez Forward Email.
* **Logi Forward Email**: Sprawdź logi w panelu Forward Email, jeśli podejrzewasz problemy z dostarczaniem pochodzące z serwera SMTP.
## Notatki dla programistów {#developer-notes}

* **Szablony**: Listmonk korzysta z silnika szablonów Go. Zapoznaj się z jego dokumentacją, aby uzyskać zaawansowane możliwości personalizacji: `{{ .Subscriber.Attribs.your_custom_field }}`.
* **API**: Listmonk oferuje kompleksowe REST API do zarządzania listami, subskrybentami, kampaniami, szablonami i innymi funkcjami. Link do dokumentacji API znajdziesz w stopce swojej instancji Listmonk.
* **Pola niestandardowe**: Zdefiniuj niestandardowe pola subskrybenta w **Ustawienia -> Pola subskrybenta**, aby przechowywać dodatkowe dane.
* **Webhooki**: Oprócz informacji o odbiciach, Listmonk może wysyłać webhooki dla innych zdarzeń (np. subskrypcji), co umożliwia integrację z innymi systemami.


## Podsumowanie {#conclusion}

Integrując samodzielnie hostowaną moc Listmonk z bezpieczną, respektującą prywatność dostawą Forward Email, tworzysz solidną i etyczną platformę do email marketingu. Zachowujesz pełną kontrolę nad danymi swojej publiczności, jednocześnie korzystając z wysokiej dostarczalności i zautomatyzowanych funkcji bezpieczeństwa.

To rozwiązanie zapewnia skalowalną, opłacalną i przyjazną dla programistów alternatywę dla zamkniętych usług email, idealnie wpisując się w etos oprogramowania open-source i prywatności użytkowników.

Szczęśliwego wysyłania! 🚀
