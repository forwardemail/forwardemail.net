# E-mail odporny na ataki kwantowe: Jak wykorzystujemy szyfrowane skrzynki pocztowe SQLite, aby zapewnić bezpieczeństwo Twojej poczty e-mail {#quantum-resistant-email-how-we-use-encrypted-sqlite-mailboxes-to-keep-your-email-safe}

<img loading="lazy" src="/img/articles/quantum.webp" alt="" class="rounded-lg" />

## Spis treści {#table-of-contents}

* [Przedmowa](#foreword)
* [Porównanie dostawców usług e-mail](#email-service-provider-comparison)
* [Jak to działa?](#how-does-it-work)
* [Technologie](#technologies)
  * [Bazy danych](#databases)
  * [Bezpieczeństwo](#security)
  * [Skrzynki pocztowe](#mailboxes)
  * [Współbieżność](#concurrency)
  * [Kopie zapasowe](#backups)
  * [Szukaj](#search)
  * [Projektowanie](#projects)
  * [Dostawcy](#providers)
* [Myśli](#thoughts)
  * [Zasady](#principles)
  * [Eksperymenty](#experiments)
  * [Brak alternatyw](#lack-of-alternatives)
  * [Wypróbuj funkcję Forward Email](#try-out-forward-email)

## Przedmowa {#foreword}

> \[!IMPORTANT]
> Our email service is [100% open-source](https://github.com/forwardemail) and privacy-focused through secure and encrypted SQLite mailboxes.

Dopóki nie uruchomiliśmy [Obsługa IMAP](/faq#do-you-support-receiving-email-with-imap), do przechowywania trwałych danych używaliśmy MongoDB.

Ta technologia jest niesamowita i nadal z niej korzystamy – jednak aby móc korzystać z szyfrowania danych w stanie spoczynku w MongoDB, należy skorzystać z usług dostawcy oferującego MongoDB Enterprise, takiego jak Digital Ocean lub Mongo Atlas – lub zapłacić za licencję korporacyjną (i w związku z tym narazić się na opóźnienia ze strony zespołu sprzedaży).

Nasz zespół w [Przekaż dalej e-mail](https://forwardemail.net) potrzebował przyjaznego dla programistów, skalowalnego, niezawodnego i szyfrowanego rozwiązania do przechowywania danych dla skrzynek pocztowych IMAP. Jako programiści open source, korzystanie z technologii, za którą trzeba zapłacić licencję, aby uzyskać dostęp do funkcji szyfrowania w stanie spoczynku, było sprzeczne z [nasze zasady](#principles) – dlatego eksperymentowaliśmy, badaliśmy i opracowaliśmy nowe rozwiązanie od podstaw, aby sprostać tym potrzebom.

Zamiast używać wspólnej bazy danych do przechowywania skrzynek pocztowych, przechowujemy i szyfrujemy skrzynki pocztowe indywidualnie za pomocą hasła (które znasz tylko Ty). **Nasza usługa poczty e-mail jest tak bezpieczna, że jeśli zapomnisz hasła, stracisz skrzynkę pocztową** (i będziesz musiał ją odzyskać za pomocą kopii zapasowych offline lub zacząć od nowa).

Czytaj dalej, ponieważ poniżej szczegółowo omawiamy [porównanie dostawców usług poczty e-mail](#email-service-provider-comparison), [Jak działa nasza usługa](#how-does-it-work), [Nasz zestaw technologii](#technologies) i inne.

## Porównanie dostawców usług poczty e-mail {#email-service-provider-comparison}

Jesteśmy jedynym w 100% otwartym i dbającym o prywatność dostawcą usług poczty e-mail, który przechowuje indywidualnie zaszyfrowane skrzynki pocztowe SQLite, oferuje nieograniczoną liczbę domen, aliasów i użytkowników oraz obsługuje wychodzące protokoły SMTP, IMAP i POP3:

**W przeciwieństwie do innych dostawców poczty e-mail, nie musisz płacić za przechowywanie danych na podstawie domeny lub aliasu w Forward Email.** Przechowywanie danych jest współdzielone na całym koncie – więc jeśli masz wiele niestandardowych nazw domen i wiele aliasów na każdej z nich, to jesteśmy dla Ciebie idealnym rozwiązaniem. Pamiętaj, że nadal możesz egzekwować limity przechowywania danych, jeśli chcesz, na podstawie domeny lub aliasu.

<a href="/blog/best-email-service" target="_blank" class="btn btn-lg bg-success text-white btn-block btn-success">Przeczytaj porównanie usług poczty e-mail <i class="fa fa-search-plus"></i></a>

## Jak to działa {#how-does-it-work}

1. Korzystając z klienta poczty e-mail, takiego jak Apple Mail, Thunderbird, Gmail lub Outlook, łączysz się z naszymi bezpiecznymi serwerami [IMAP](/faq#do-you-support-receiving-email-with-imap), używając swojej nazwy użytkownika i hasła:

* Twoja nazwa użytkownika to pełny alias z Twoją domeną, np. `hello@example.com`.
* Twoje hasło jest generowane losowo i wyświetlane tylko przez 30 sekund po kliknięciu <strong class="text-success"><i class="fa fa-key"></i>Generuj hasło</strong> z <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Moje konto <i class="fa fa-angle-right"></i> Domeny</a> <i class="fa fa-angle-right"></i> Aliasy.

2. Po nawiązaniu połączenia Twój klient poczty e-mail wyśle [Polecenia protokołu IMAP](https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol) na nasz serwer IMAP, aby synchronizować Twoją skrzynkę pocztową. Obejmuje to pisanie i przechowywanie wersji roboczych wiadomości e-mail oraz inne czynności, które możesz wykonywać (np. oznaczanie wiadomości jako ważnej lub oznaczanie jej jako spamu/wiadomości-śmieci).

3. Serwery wymiany poczty (powszechnie znane jako serwery „MX”) odbierają nowe wiadomości przychodzące i zapisują je w Twojej skrzynce pocztowej. Gdy to nastąpi, Twój klient poczty e-mail otrzyma powiadomienie i zsynchronizuje skrzynkę. Nasze serwery wymiany poczty mogą przekierować Twoją pocztę do jednego lub kilku odbiorców (w tym [webhooki](/faq#do-you-support-webhooks)), przechowywać ją w szyfrowanym serwerze IMAP u nas, **lub w obu tych miejscach**!

> \[!TIP]
> Chcesz dowiedzieć się więcej? Przeczytaj [jak skonfigurować przekierowanie poczty e-mail](/faq#how-do-i-get-started-and-set-up-email-forwarding), [jak działa nasza usługa wymiany poczty](/faq#how-does-your-email-forwarding-system-work) lub obejrzyj [nasi przewodnicy](/guides).

4. W tle nasz projekt bezpiecznego przechowywania wiadomości e-mail działa na dwa sposoby, aby zapewnić szyfrowanie skrzynek pocztowych i zapewnić do nich dostęp tylko Tobie:

* Gdy otrzymasz nową wiadomość od nadawcy, nasze serwery pocztowe zapisują ją w indywidualnej, tymczasowej i zaszyfrowanej skrzynce pocztowej.

     ```mermaid
     sequenceDiagram
         autonumber
         actor Sender
         Sender->>MX: Inbound message received for your alias (e.g. you@yourdomain.com).
         MX->>SQLite: Message is stored in a temporary mailbox.
         Note over MX,SQLite: Forwards to other recipients and webhooks configured.
         MX->>Sender: Success!
     ```

* Gdy łączysz się z naszym serwerem IMAP za pomocą swojego klienta poczty e-mail, Twoje hasło jest szyfrowane w pamięci i używane do odczytu i zapisu w Twojej skrzynce pocztowej. Twoja skrzynka pocztowa może być odczytywana i zapisywana tylko za pomocą tego hasła. Pamiętaj, że ponieważ jesteś jedyną osobą znającą to hasło, **tylko Ty** możesz czytać i zapisywać w swojej skrzynce pocztowej, gdy uzyskujesz do niej dostęp. Następnym razem, gdy Twój klient poczty e-mail spróbuje sprawdzić pocztę lub synchronizacje, Twoje nowe wiadomości zostaną przeniesione z tej tymczasowej skrzynki pocztowej i zapisane w Twoim rzeczywistym pliku skrzynki pocztowej przy użyciu podanego przez Ciebie hasła. Pamiętaj, że ta tymczasowa skrzynka pocztowa jest później czyszczona i usuwana, tak aby wiadomości znajdowały się tylko w Twojej chronionej hasłem skrzynce pocztowej.

* **Jeśli jesteś połączony z IMAP (np. używając klienta poczty e-mail, takiego jak Apple Mail lub Thunderbird), nie musimy zapisywać do tymczasowej pamięci dyskowej. Zamiast tego pobierane i używane jest Twoje zaszyfrowane hasło IMAP w pamięci. W czasie rzeczywistym, gdy wiadomość próbuje zostać do Ciebie dostarczona, wysyłamy żądanie WebSocket do wszystkich serwerów IMAP, pytając je, czy mają aktywną sesję dla Ciebie (to jest część pobierania), a następnie przekazujemy to zaszyfrowane hasło w pamięci – więc nie musimy zapisywać do tymczasowej skrzynki pocztowej, możemy zapisywać do Twojej rzeczywistej zaszyfrowanej skrzynki pocztowej, używając Twojego zaszyfrowanego hasła.**

     ```mermaid
     sequenceDiagram
         autonumber
         actor You
         You->>IMAP: You connect to IMAP server using an email client.
         IMAP->>SQLite: Transfer message from temporary mailbox to your alias' mailbox.
         Note over IMAP,SQLite: Your alias' mailbox is only available in-memory using IMAP password.
         SQLite->>IMAP: Retrieves messages as requested by email client.
         IMAP->>You: Success!
     ```

5. [Kopie zapasowe Twoich zaszyfrowanych skrzynek pocztowych](#backups) są tworzone codziennie. Możesz również w dowolnym momencie zażądać nowej kopii zapasowej lub pobrać najnowszą kopię z <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Moje konto <i class="fa fa-angle-right"></i> Domeny</a> <i class="fa fa-angle-right"></i> Aliasy. Jeśli zdecydujesz się na przejście na inną usługę poczty e-mail, możesz łatwo migrować, pobierać, eksportować i usuwać skrzynki pocztowe i kopie zapasowe w dowolnym momencie.

## Technologie {#technologies}

### Bazy danych {#databases}

Rozważaliśmy inne możliwe warstwy przechowywania danych, jednak żadna nie spełniła naszych wymagań w takim stopniu, jak SQLite:

| Baza danych | Szyfrowanie w stanie spoczynku | [Sandboxed](https://en.wikipedia.org/wiki/Sandbox_\(computer_security\)) Skrzynki pocztowe | Licencja | [Used Everywhere](https://www.sqlite.org/mostdeployed.html) |
| ------------------------------------------------------ | :-----------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------: | :---------------------------------------------------------: | :---------------------------------------------------------: |
| **[SQLite](https://www.sqlite.org/index.html)** :gwiazdka: | :white_check_mark: Tak z [SQLite3MultipleCiphers](https://github.com/utelle/SQLite3MultipleCiphers) | :biały_znacznik_sprawdzenia: | :white_check_mark: Domena publiczna | :biały_znacznik_sprawdzenia: |
| [MongoDB](https://www.mongodb.com/) | :x: ["Available in MongoDB Enterprise only"](https://www.mongodb.com/docs/manual/core/security-encryption-at-rest/) | :x: Relacyjna baza danych | :x: AGPL i `SSPL-1.0` | :X: |
| [rqlite](https://github.com/rqlite/rqlite) | :x: [Network only](https://github.com/rqlite/rqlite/issues/1406) | :x: Relacyjna baza danych | :white_check_mark: `MIT` | :X: |
| [dqlite](https://dqlite.io/) | :x: [Untested and not yet supported?](https://github.com/canonical/dqlite/issues/32) | :x: [Untested and not yet supported?](https://github.com/canonical/dqlite/issues/32) | :white_check_mark: `LGPL-3.0-only` | :X: |
| [PostgreSQL](https://www.postgresql.org/) | :white_check_mark: [Yes](https://www.postgresql.org/docs/current/encryption-options.html) | :x: Relacyjna baza danych | :white_check_mark: `PostgreSQL` (podobnie jak `BSD` lub `MIT`) | :X: |
| [MariaDB](https://mariadb.com/) | :white_check_mark: [For InnoDB only](https://mariadb.com/kb/en/data-at-rest-encryption-overview/#which-storage-engines-does-mariadb-encryption-support) | :x: Relacyjna baza danych | :white_check_mark: `GPLv2` i `BUSL-1.1` | :X: |
| [CockroachDB](https://www.cockroachlabs.com/product/) | :x: [Enterprise-only feature](https://www.cockroachlabs.com/docs/v23.1/enterprise-licensing) | :x: Relacyjna baza danych | :x: `BUSL-1.1` i inni | :X: |

> Oto [wpis na blogu porównujący kilka opcji przechowywania danych w bazach danych SQLite](https://gcore.com/learning/comparing-litestream-rqlite-dqlite/) w tabeli powyżej.

### Bezpieczeństwo {#security}

Zawsze korzystamy z szyfrowania [szyfrowanie w stanie spoczynku](https://en.wikipedia.org/wiki/Data_at_rest) ([AES-256](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard)), [szyfrowanie w trakcie przesyłania](https://en.wikipedia.org/wiki/Data_in_transit) ([TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security)), [DNS przez HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) („DoH”) z użyciem :tangerine: [Mandarynka](https://tangeri.ne) oraz [sqleet](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/) ([ChaCha20-Poly1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)) w skrzynkach pocztowych. Dodatkowo stosujemy dwuskładnikowe uwierzytelnianie oparte na tokenach (w przeciwieństwie do SMS-ów, które są podejrzane o [ataki typu man-in-the-middle](https://en.wikipedia.org/wiki/Man-in-the-middle_attack)), rotację kluczy SSH z wyłączonym dostępem do roota, wyłączny dostęp do serwerów przez zastrzeżone adresy IP i wiele innych.

W przypadku [atak złej pokojówki](https://en.wikipedia.org/wiki/Evil_maid_attack) lub nieuczciwego pracownika zewnętrznego dostawcy, **Twoja skrzynka pocztowa nadal będzie mogła zostać otwarta tylko za pomocą wygenerowanego hasła**. Zapewniamy, że nie korzystamy z usług żadnych zewnętrznych dostawców poza naszymi dostawcami serwerów obsługujących skargi SOC typu 2, takimi jak Cloudflare, DataPacket, Digital Ocean i Vultr.

Naszym celem jest, aby było jak najmniej [pojedynczy punkt awarii](https://en.wikipedia.org/wiki/Single_point_of_failure).

### Skrzynki pocztowe {#mailboxes}

> **tldr;** Nasze serwery IMAP korzystają z indywidualnie szyfrowanych baz danych SQLite dla każdej Twojej skrzynki pocztowej.

[SQLite jest niezwykle popularny](https://www.sqlite.org/mostdeployed.html) osadzona baza danych – jest obecnie uruchomiona na Twoim telefonie i komputerze – [i używany przez niemal wszystkie główne technologie](https://www.sqlite.org/famous.html).

Na przykład na naszych szyfrowanych serwerach znajduje się skrzynka pocztowa bazy danych SQLite dla `linux@example.com`, `info@example.com`, `hello@example.com` itd. – po jednej dla każdego pliku bazy danych `.sqlite`. Nie nadajemy plikom bazy danych nazw odpowiadających adresom e-mail – zamiast tego używamy identyfikatorów obiektów BSON i unikalnych identyfikatorów UUID, które nie ujawniają, do kogo należy skrzynka ani pod jakim adresem e-mail jest przypisana (np. `353a03f21e534321f5d6e267.sqlite`).

Każda z tych baz danych jest szyfrowana za pomocą Twojego hasła (które znasz tylko Ty) za pomocą [sqleet](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/) ([ChaCha20-Poly1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)). Oznacza to, że Twoje skrzynki pocztowe są indywidualnie szyfrowane, autonomiczne ([piaskownicy](https://en.wikipedia.org/wiki/Sandbox_\(computer_security\)) i przenośne.

Dopracowaliśmy SQLite za pomocą następującego [PRAGMA](https://www.sqlite.org/pragma.html):

| `PRAGMA` | Zamiar |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cipher=chacha20` | [ChaCha20-Poly1305 SQLite database encryption](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/). Więcej informacji można znaleźć w sekcji `better-sqlite3-multiple-ciphers` pod [Projects](#projects). |
| `key="****************"` | To jest Twoje odszyfrowane hasło, dostępne tylko w pamięci, które jest przesyłane przez połączenie IMAP Twojego klienta poczty e-mail z naszym serwerem. Nowe instancje bazy danych są tworzone i zamykane dla każdej sesji odczytu i zapisu (w celu zapewnienia środowiska testowego i izolacji). |
| `journal_model=WAL` | Zapis dziennika z wyprzedzeniem ("[WAL](https://www.sqlite.org/wal.html)") [which boosts performance and allows concurrent read access](https://litestream.io/tips/#wal-journal-mode). |
| `busy_timeout=5000` | Zapobiega błędom blokady zapisu [while other writes are taking place](https://litestream.io/tips/#busy-timeout). |
| `synchronous=NORMAL` | Zwiększa trwałość transakcji [without data corruption risk](https://litestream.io/tips/#synchronous-pragma). |
| `foreign_keys=ON` | Wymusza egzekwowanie odwołań do kluczy obcych (np. relacji z jednej tabeli do drugiej). [By default this is not turned on in SQLite](https://www.sqlite.org/foreignkeys.html), ale w celu zapewnienia walidacji i integralności danych powinno być włączone. |
| `encoding='UTF-8'` | [Default encoding](https://www.sqlite.org/pragma.html#pragma_encoding) służy do zapewnienia bezpieczeństwa programistom. |

> Wszystkie inne wartości domyślne pochodzą z bazy SQLite, zgodnie ze specyfikacją [oficjalna dokumentacja PRAGMA](https://www.sqlite.org/pragma.html#pragma_auto_vacuum).

### Współbieżność {#concurrency}

> **tldr;** Używamy `WebSocket` do równoczesnego odczytu i zapisu w zaszyfrowanych skrzynkach pocztowych SQLite.

#### Odczytuje {#reads}

Twój klient poczty e-mail w telefonie może rozwiązywać adres `imap.forwardemail.net` na jeden z naszych adresów IP Digital Ocean, a Twój klient na komputerze stacjonarnym może rozwiązywać oddzielny adres IP z zupełnie innego adresu [dostawca](#providers).

Niezależnie od tego, z którym serwerem IMAP łączy się Twój klient poczty e-mail, chcemy, aby połączenie odczytywało Twoją bazę danych w czasie rzeczywistym z 100% dokładnością. Odbywa się to za pośrednictwem WebSockets.

#### Zapisuje {#writes}

Zapisywanie do bazy danych wygląda nieco inaczej – ponieważ SQLite jest osadzoną bazą danych, a skrzynka pocztowa domyślnie znajduje się w pojedynczym pliku.

Rozważaliśmy opcje takie jak `litestream`, `rqlite` i `dqlite` – jednak żadna z nich nie spełniła naszych wymagań.

Aby wykonywać operacje zapisu z włączonym logowaniem z wyprzedzeniem („[WAL](https://www.sqlite.org/wal.html)”), musimy upewnić się, że tylko jeden serwer („Główny”) jest za to odpowiedzialny. [WAL](https://www.sqlite.org/wal.html) znacznie przyspiesza współbieżność i umożliwia działanie jednego serwera zapisującego i wielu serwerów odczytujących.

Serwer podstawowy działa na serwerach danych z zamontowanymi woluminami zawierającymi zaszyfrowane skrzynki pocztowe. Z punktu widzenia dystrybucji, wszystkie serwery IMAP za `imap.forwardemail.net` można uznać za serwery pomocnicze („Dodatkowe”).

Realizujemy dwustronną komunikację za pomocą [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket):

* Serwery podstawowe korzystają z instancji serwera [ws](https://github.com/websockets/ws) o nazwie `WebSocketServer`.
* Serwery pomocnicze korzystają z instancji klienta [ws](https://github.com/websockets/ws) o nazwie [websocket-jak-obiecano](https://github.com/vitalets/websocket-as-promised) i [ponowne łączenie-websocket](https://github.com/opensumi/reconnecting-websocket). Te dwa wrappery zapewniają, że `WebSocket` ponownie nawiąże połączenie i będzie mógł wysyłać i odbierać dane dla określonych operacji zapisu w bazie danych.

### Kopie zapasowe {#backups}

> **tldr;** Kopie zapasowe zaszyfrowanych skrzynek pocztowych są tworzone codziennie. Możesz również natychmiast poprosić o nową kopię zapasową lub pobrać najnowszą kopię zapasową w dowolnym momencie z <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Moje konto <i class="fa fa-angle-right"></i> Domeny</a> <i class="fa fa-angle-right"></i> Aliasy.

W przypadku kopii zapasowych po prostu uruchamiamy polecenie SQLite `VACUUM INTO` każdego dnia podczas przetwarzania polecenia IMAP, które wykorzystuje zaszyfrowane hasło z połączenia IMAP w pamięci. Kopie zapasowe są przechowywane, jeśli nie zostanie wykryta żadna istniejąca kopia zapasowa lub jeśli skrót [SHA-256](https://en.wikipedia.org/wiki/SHA-2) w pliku uległ zmianie w porównaniu z najnowszą kopią zapasową.

Należy pamiętać, że używamy polecenia `VACUUM INTO`, a nie wbudowanego polecenia `backup`, ponieważ jeśli strona zostanie zmodyfikowana podczas działania polecenia `backup`, musi ona zacząć od nowa. Polecenie `VACUUM INTO` utworzy migawkę. Więcej informacji można znaleźć w komentarzach do [GitHub](https://github.com/benbjohnson/litestream.io/issues/56) i [Wiadomości hakerskie](https://news.ycombinator.com/item?id=31387556).

Dodatkowo używamy `VACUUM INTO` zamiast `backup`, ponieważ polecenie `backup` pozostawiłoby bazę danych niezaszyfrowaną na krótki czas, aż do wywołania `rekey` (więcej informacji można znaleźć w tym artykule na GitHubie: [komentarz](https://github.com/m4heshd/better-sqlite3-multiple-ciphers/issues/46#issuecomment-1468018927)).

Serwer pomocniczy wyda serwerowi podstawowemu polecenie wykonania kopii zapasowej za pośrednictwem połączenia `WebSocket`. Serwer podstawowy otrzyma następnie polecenie wykonania tej czynności i następnie:

1. Połącz się z zaszyfrowaną skrzynką pocztową.
2. Uzyskaj blokadę zapisu.
3. Uruchom punkt kontrolny WAL za pomocą `wal_checkpoint(PASSIVE)`.
4. Uruchom polecenie SQLite `VACUUM INTO`.
5. Upewnij się, że skopiowany plik można otworzyć za pomocą zaszyfrowanego hasła (zabezpieczenie/zabezpieczenie przed fałszywym hasłem).
6. Prześlij go do Cloudflare R2 w celu przechowywania (lub do własnego dostawcy, jeśli określono inaczej).

<!--
7. Skompresuj powstały plik kopii zapasowej za pomocą kodu `gzip`.
8. Prześlij go do Cloudflare R2 w celu przechowywania (lub do swojego dostawcy, jeśli go wskazałeś).
-->

Pamiętaj, że Twoje skrzynki pocztowe są szyfrowane – i chociaż wdrożyliśmy ograniczenia IP i inne środki uwierzytelniania dla komunikacji WebSocket – w przypadku ataku hakera możesz być pewien, że jeśli ładunek WebSocket nie będzie miał Twojego hasła IMAP, nie będzie mógł otworzyć Twojej bazy danych.

Aktualnie przechowywana jest tylko jedna kopia zapasowa dla każdej skrzynki pocztowej, jednak w przyszłości możemy zaoferować odzyskiwanie danych w określonym momencie („[PITR](https://en.wikipedia.org/wiki/Point-in-time_recovery)”).

### Wyszukaj {#search}

Nasze serwery IMAP obsługują polecenie `SEARCH` przy użyciu złożonych zapytań, wyrażeń regularnych i nie tylko.

Szybką wydajność wyszukiwania zapewniają [FTS5](https://www.sqlite.org/fts5.html) i [sqlite-wyrażenie regularne](https://github.com/asg017/sqlite-regex#sqlite-regex).

Wartości `Date` przechowujemy w skrzynkach pocztowych SQLite jako ciągi [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601) za pośrednictwem [Date.prototype.toISOString](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString) (z uwzględnieniem strefy czasowej UTC w celu zapewnienia prawidłowego działania porównań równości).

Indeksy są również przechowywane dla wszystkich nieruchomości wymienionych w zapytaniach wyszukiwania.

### Projekty {#projects}

Poniżej znajduje się tabela przedstawiająca projekty, których używamy w naszym kodzie źródłowym i procesie rozwoju (posortowane alfabetycznie):

| Projekt | Zamiar |
| --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Ansible](https://www.ansible.com/) | Platforma automatyzacji DevOps umożliwiająca łatwą konserwację, skalowanie i zarządzanie całą naszą flotą serwerów. |
| [Bree](https://github.com/breejs/bree) | Harmonogram zadań dla Node.js i JavaScript z cronem, datami, ms, later i przyjazną dla człowieka obsługą. |
| [Cabin](https://github.com/cabinjs/cabin) | Przyjazna dla programistów biblioteka do rejestrowania zdarzeń w JavaScript i Node.js, która dba o bezpieczeństwo i prywatność. |
| [Lad](https://github.com/ladjs/lad) | Struktura Node.js, na której opiera się cała nasza architektura i projekt inżynieryjny z wykorzystaniem MVC i nie tylko. |
| [MongoDB](https://www.mongodb.com/) | Rozwiązanie bazy danych NoSQL, którego używamy do przechowywania wszystkich danych poza skrzynkami pocztowymi (np. konta, ustawień, domen i konfiguracji aliasów). |
| [Mongoose](https://github.com/Automattic/mongoose) | Modelowanie dokumentów obiektowych (ODM) MongoDB, którego używamy w całym naszym stosie. Napisaliśmy specjalne pomocniki, które pozwalają nam po prostu kontynuować korzystanie z **Mongoose z SQLite** :tada: |
| [Node.js](https://nodejs.org/en) | Node.js to środowisko wykonawcze JavaScript o otwartym kodzie źródłowym, wieloplatformowe, na którym działają wszystkie nasze procesy serwerowe. |
| [Nodemailer](https://github.com/nodemailer/nodemailer) | Pakiet Node.js do wysyłania e-maili, tworzenia połączeń i nie tylko. Jesteśmy oficjalnym sponsorem tego projektu. |
| [Redis](https://redis.io/) | Baza danych w pamięci podręcznej do buforowania, kanałów publikacji/subskrypcji i żądań DNS przez HTTPS. |
| [SQLite3MultipleCiphers](https://github.com/utelle/SQLite3MultipleCiphers) | Rozszerzenie szyfrowania dla SQLite umożliwiające szyfrowanie całych plików bazy danych (w tym zapisu z wyprzedzeniem ("[WAL](https://www.sqlite.org/wal.html)"), dziennika, wycofywania, …). |
| [SQLiteStudio](https://github.com/pawelsalawa/sqlitestudio) | Edytor Visual SQLite (którego również można używać) do testowania, pobierania i przeglądania skrzynek pocztowych dla programistów. |
| [SQLite](https://www.sqlite.org/about.html) | Wbudowana warstwa bazy danych zapewniająca skalowalną, autonomiczną, szybką i odporną pamięć masową IMAP. |
| [Spam Scanner](https://github.com/spamscanner/spamscanner) | Narzędzie Node.js do ochrony przed spamem, filtrowania wiadomości e-mail i phishingiem (nasza alternatywa dla [Spam Assassin](https://spamassassin.apache.org/) i [rspamd](https://github.com/rspamd/rspamd)). |
| [Tangerine](https://tangeri.ne) | Żądania DNS przez HTTPS z użyciem Node.js i buforowanie z użyciem Redis – co zapewnia globalną spójność i wiele więcej. |
| [Thunderbird](https://www.thunderbird.net/) | Nasz zespół programistów używa go (i również go zaleca) jako **preferowanego klienta poczty e-mail do użytku z funkcją Forward Email**. |
| [UTM](https://github.com/utmapp/UTM) | Nasz zespół programistów tworzy maszyny wirtualne dla systemów iOS i macOS, aby testować różne programy pocztowe (równolegle) z naszymi serwerami IMAP i SMTP. |
| [Ubuntu](https://ubuntu.com/download/server) | Nowoczesny, serwerowy system operacyjny oparty na systemie Linux, typu open source, na którym opiera się cała nasza infrastruktura. |
| [WildDuck](https://github.com/nodemailer/wildduck) | Biblioteka serwera IMAP – zobacz jej notatki na temat [attachment de-duplication](https://github.com/nodemailer/wildduck/blob/master/docs/in-depth/attachment-deduplication.md) i [IMAP protocol support](https://github.com/nodemailer/wildduck/blob/master/docs/in-depth/protocol-support.md). |
| [better-sqlite3-multiple-ciphers](https://github.com/m4heshd/better-sqlite3-multiple-ciphers) | Szybka i prosta biblioteka API dla Node.js umożliwiająca programową interakcję z SQLite3. |
| [email-templates](https://github.com/forwardemail/email-templates) | Przyjazna dla programistów platforma poczty e-mail umożliwiająca tworzenie, podgląd i wysyłanie niestandardowych wiadomości e-mail (np. powiadomień o kontach i innych). |
| [json-sql-enhanced](https://github.com/forwardemail/json-sql-enhanced) | Konstruktor zapytań SQL wykorzystujący składnię w stylu Mongo. Oszczędza to czas naszemu zespołowi programistów, ponieważ możemy kontynuować pisanie w stylu Mongo w całym stosie, z podejściem niezależnym od bazy danych. **Pomaga również unikać ataków typu SQL injection poprzez użycie parametrów zapytania.** |
| [knex-schema-inspector](https://github.com/knex/knex-schema-inspector) | Narzędzie SQL do wyodrębniania informacji o istniejącym schemacie bazy danych. Pozwala nam to łatwo sprawdzić, czy wszystkie indeksy, tabele, kolumny, ograniczenia i inne elementy są prawidłowe i zgodne z kodem `1:1`. Napisaliśmy nawet zautomatyzowane pomocniki do dodawania nowych kolumn i indeksów w przypadku zmian w schematach bazy danych (z niezwykle szczegółowym alertem o błędach). |
| [knex](https://github.com/knex/knex) | Konstruktor zapytań SQL, którego używamy wyłącznie do migracji baz danych i walidacji schematu za pomocą `knex-schema-inspector`. |
| [mandarin](https://github.com/ladjs/mandarin) | Automatyczne tłumaczenie frazy [i18n](https://en.wikipedia.org/wiki/Internationalization_and_localization) ze wsparciem dla języka Markdown przy użyciu [Google Cloud Translation API](https://cloud.google.com/translate/docs/reference/rest). |
| [mx-connect](https://github.com/zone-eu/mx-connect) | Pakiet Node.js do rozwiązywania i nawiązywania połączeń z serwerami MX oraz obsługi błędów. |
| [pm2](https://github.com/Unitech/pm2) | Menedżer procesów produkcyjnych Node.js z wbudowanym modułem równoważenia obciążenia ([fine-tuned](https://github.com/Unitech/pm2/issues/5145#issuecomment-1737764214) dla wydajności). |
| [smtp-server](https://github.com/nodemailer/smtp-server) | Biblioteka serwera SMTP – używamy jej w naszej wymianie poczty („MX”) i serwerach SMTP wychodzących. |
| [ImapTest](https://www.imapwiki.org/ImapTest) | Przydatne narzędzie do testowania serwerów IMAP pod kątem zgodności z testami porównawczymi i specyfikacją RFC protokołu IMAP. Projekt ten został stworzony przez zespół [Dovecot](https://en.wikipedia.org/wiki/Dovecot_\(software\) (aktywny serwer IMAP i POP3 o otwartym kodzie źródłowym od lipca 2002 roku). Dokładnie przetestowaliśmy nasz serwer IMAP za pomocą tego narzędzia. |

> Inne projekty, z których korzystamy, znajdziesz w [nasz kod źródłowy na GitHub](https://github.com/forwardemail).

### Dostawcy {#providers}

| Dostawca | Zamiar |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| [Cloudflare](https://www.cloudflare.com/) | Dostawca DNS, kontrole stanu, moduły równoważenia obciążenia i pamięć masowa kopii zapasowych wykorzystująca [Cloudflare R2](https://developers.cloudflare.com/r2). |
| [Digital Ocean](https://m.do.co/c/a7fe489d1b27) | Dedykowany serwer hostingowy i zarządzane bazy danych. |
| [Vultr](https://www.vultr.com/?ref=7429848) | Hosting na serwerze dedykowanym. |
| [DataPacket](https://www.datapacket.com) | Hosting na serwerze dedykowanym. |

## Myśli {#thoughts}

### Zasady {#principles}

Funkcja Forward Email została zaprojektowana zgodnie z poniższymi zasadami:

1. Zawsze bądź przyjazny dla programistów, dbaj o bezpieczeństwo i prywatność oraz bądź transparentny.
2. Przestrzegaj zasad [MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller), [Unix](https://en.wikipedia.org/wiki/Unix_philosophy), [KISS](https://en.wikipedia.org/wiki/KISS_principle), [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself), [YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it), [Dwanaście czynników](https://12factor.net/), [Brzytwa Ockhama](https://en.wikipedia.org/wiki/Occam%27s_razor) i [testowanie psów](https://en.wikipedia.org/wiki/Eating_your_own_dog_food)
3. Kieruj swoją ofertę do programistów, którzy są oszczędni, mają problemy z bootstrappingiem i [ramen-opłacalny](http://www.paulgraham.com/ramenprofitable.html)

### Eksperymenty {#experiments}

> **tldr;** Ostatecznie korzystanie ze zgodnej ze standardem S3 pamięci masowej obiektów i/lub tabel wirtualnych jest technicznie niewykonalne ze względu na kwestie wydajnościowe i podatne na błędy z powodu ograniczeń pamięci.

Przeprowadziliśmy kilka eksperymentów w celu opracowania ostatecznego rozwiązania SQLite, jak opisano powyżej.

Jednym z nich było wypróbowanie [rclone]() i SQLite w połączeniu z warstwą pamięci masowej zgodną z S3.

Ten eksperyment pozwolił nam lepiej zrozumieć i odkryć skrajne przypadki związane z wykorzystaniem rclone, SQLite i [VFS](https://en.wikipedia.org/wiki/Virtual_file_system):

* Jeśli włączysz flagę `--vfs-cache-mode writes` za pomocą rclone, odczyty będą poprawne, natomiast zapisy będą buforowane.
* Jeśli masz wiele serwerów IMAP rozproszonych globalnie, pamięć podręczna będzie na nich wyłączona, chyba że masz jednego zapisującego i wielu nasłuchujących (np. podejście pub/sub).
* Jest to niezwykle skomplikowane, a dodanie takiej dodatkowej złożoności spowoduje powstanie większej liczby pojedynczych punktów awarii.
* Dostawcy pamięci masowej kompatybilni z S3 nie obsługują częściowych zmian plików – co oznacza, że każda zmiana pliku `.sqlite` spowoduje całkowitą zmianę i ponowne przesłanie bazy danych.
* Istnieją inne rozwiązania, takie jak `rsync`, ale nie koncentrują się one na obsłudze dziennika zapisu z wyprzedzeniem („[WAL](https://www.sqlite.org/wal.html)”) – dlatego ostatecznie przyjrzeliśmy się rozwiązaniu Litestream. Na szczęście nasze szyfrowanie już szyfruje pliki [WAL](https://www.sqlite.org/wal.html) za nas, więc nie musimy polegać na Litestream. Nie byliśmy jednak jeszcze pewni, czy Litestream sprawdzi się w zastosowaniach produkcyjnych i poniżej zamieściliśmy kilka uwag na ten temat.
* Użycie opcji `--vfs-cache-mode writes` (*jedynego* sposobu użycia SQLite zamiast `rclone` do zapisu) spowoduje próbę skopiowania całej bazy danych od podstaw do pamięci – obsługa jednej skrzynki pocztowej o rozmiarze 10 GB jest akceptowalna, jednak obsługa wielu skrzynek pocztowych o bardzo dużej pojemności spowoduje, że serwery IMAP napotkają ograniczenia pamięci oraz błędy `ENOMEM`, błędy segmentacji i uszkodzenia danych.
* Próba użycia SQLite [Wirtualne stoły](https://www.sqlite.org/vtab.html) (np. za pomocą [s3db](https://github.com/jrhy/s3db)) w celu przechowywania danych na żywo na warstwie pamięci masowej zgodnej z S3 spowoduje pojawienie się kilku dodatkowych problemów:
* Odczyt i zapis będą bardzo powolne, ponieważ punkty końcowe interfejsu API S3 będą musiały zostać poddane metodom HTTP `GET`, `PUT`, `HEAD` i `POST`.
* Testy programistyczne wykazały, że przekroczenie 500 tys.–1 mln rekordów w internecie światłowodowym jest nadal ograniczone przez przepustowość zapisu i odczytu dla dostawców zgodnych z S3. Na przykład nasi programiści uruchomili pętle `for`, aby wykonać zarówno sekwencyjne instrukcje SQL `INSERT`, jak i te, które zapisywały duże ilości danych. W obu przypadkach wydajność była zdumiewająco niska.
* Tabele wirtualne **nie mogą mieć indeksów**, instrukcje `ALTER TABLE` i [Inny](https://stackoverflow.com/a/12507650) [ograniczenia](https://sqlite.org/lang_createvtab.html) – co prowadzi do opóźnień sięgających nawet 1-2 minut lub więcej, w zależności od ilości danych.
* Obiekty były przechowywane w postaci niezaszyfrowanej, a natywne wsparcie szyfrowania nie jest łatwo dostępne.
* Przeanalizowaliśmy również użycie [sqlite-s3vfs](https://github.com/uktrade/sqlite-s3vfs), które jest podobne pod względem koncepcyjnym i technicznym do poprzedniego punktu (a zatem ma te same problemy). Jedną z możliwości byłoby użycie niestandardowego kodu kompilacji `sqlite3` z szyfrowaniem, takim jak [wxSQLite3](https://github.com/utelle/wxsqlite3) (którego obecnie używamy w naszym rozwiązaniu powyżej) za pośrednictwem [edycja pliku instalacyjnego](https://github.com/rogerbinns/apsw/blob/a870bda57ce28704f028af44c392b9a458e702be/setup.py#L268-L276).
* Innym potencjalnym podejściem byłoby użycie [rozszerzenie multipleksu](https://www.sqlite.org/src/doc/trunk/src/test_multiplex.c), jednak ma to ograniczenie do 32 GB i wymagałoby skomplikowanych procesów kompilacji i programowania.
* Wymagane są instrukcje `ALTER TABLE` (co całkowicie wyklucza użycie tabel wirtualnych). Potrzebujemy instrukcji `ALTER TABLE`, aby nasz hook z `knex-schema-inspector` działał poprawnie – co gwarantuje, że dane nie zostaną uszkodzone, a pobrane wiersze będą mogły zostać przekonwertowane na prawidłowe dokumenty zgodnie z definicjami schematu `mongoose` (który obejmuje ograniczenia, typy zmiennych i walidację dowolnych danych).
* Prawie wszystkie projekty zgodne z S3 związane z SQLite w społeczności open source są napisane w Pythonie (a nie w JavaScript, którego używamy w 100% naszego stosu).
* Biblioteki kompresji, takie jak [sqlite-zstd](https://github.com/phiresky/sqlite-zstd) (patrz [uwagi](https://news.ycombinator.com/item?id=32303762)), wyglądają obiecująco, ale [może nie być jeszcze gotowy do użytku produkcyjnego](https://github.com/phiresky/sqlite-zstd#usage). Zamiast tego kompresja po stronie aplikacji w przypadku typów danych, takich jak `String`, `Object`, `Map`, `Array`, `Set` i `Buffer`, będzie czystszym i łatwiejszym podejściem (i łatwiejszym do migracji, ponieważ możemy przechowywać flagę lub kolumnę `Boolean` – lub nawet użyć `PRAGMA` `user_version=1` do kompresji lub `user_version=0` bez kompresji jako metadanych bazy danych). * Na szczęście w naszym serwerze IMAP zaimplementowaliśmy już deduplikację załączników – dlatego każda wiadomość z tym samym załącznikiem nie będzie przechowywała kopii – zamiast tego pojedynczy załącznik jest przechowywany dla wielu wiadomości i wątków w skrzynce pocztowej (a następnie wykorzystywany jest odnośnik zewnętrzny).
* Projekt Litestream, który jest rozwiązaniem do replikacji i tworzenia kopii zapasowych SQLite, jest bardzo obiecujący i najprawdopodobniej będziemy z niego korzystać w przyszłości.
* Nie chcemy dyskredytować autorów – ponieważ od ponad dekady cenimy ich pracę i wkład w rozwój oprogramowania open source – jednak z rzeczywistego wykorzystania wynika, że istnieją [może być dużo bólów głowy](https://github.com/benbjohnson/litestream/issues) i [potencjalna utrata danych w wyniku użytkowania](https://github.com/benbjohnson/litestream/issues/218).
* Przywracanie kopii zapasowych musi być bezproblemowe i proste. Korzystanie z rozwiązania takiego jak MongoDB z `mongodump` i `mongoexport` jest nie tylko żmudne, ale również czasochłonne i ma złożoną konfigurację.
* Bazy danych SQLite upraszczają sprawę (to pojedynczy plik).
* Chcieliśmy zaprojektować rozwiązanie, w którym użytkownicy mogą zabrać swoją skrzynkę pocztową i wyjść w dowolnym momencie.
* Proste polecenia Node.js do `fs.unlink('mailbox.sqlite'))` powodują trwałe usunięcie danych z pamięci dyskowej.
* Możemy również użyć API zgodnego z S3 z HTTP `DELETE`, aby łatwo usuwać migawki i kopie zapasowe dla użytkowników.
* SQLite był najprostszym, najszybszym i najbardziej ekonomicznym rozwiązaniem.

### Brak alternatyw {#lack-of-alternatives}

O ile nam wiadomo, żadna inna usługa poczty elektronicznej nie jest w ten sposób zaprojektowana i nie jest udostępniana na zasadzie open source.

*Uważamy, że może to być spowodowane* tym, że istniejące usługi poczty e-mail korzystają ze starszej technologii w środowisku produkcyjnym, takiej jak [kod spaghetti](https://en.wikipedia.org/wiki/Spaghetti_code) :spaghetti:.

Większość, jeśli nie wszyscy, dostawcy usług poczty elektronicznej korzystają z zamkniętego kodu źródłowego lub reklamują się jako oprogramowanie typu open source, **ale w rzeczywistości tylko ich interfejs użytkownika jest typu open source.**

**Najbardziej wrażliwa część poczty e-mail** (faktyczna interakcja przechowywania/IMAP/SMTP) **odbywa się po stronie zaplecza (serwera), a *nie* po stronie front-endu (klienta)**.

### Wypróbuj opcję Przekaż dalej wiadomość e-mail {#try-out-forward-email}

Zarejestruj się już dziś na <https://forwardemail.net>! :rocket: