# Quantum Resistant Email: Jak używamy zaszyfrowanych skrzynek SQLite, aby chronić Twoją pocztę {#quantum-resistant-email-how-we-use-encrypted-sqlite-mailboxes-to-keep-your-email-safe}

<img loading="lazy" src="/img/articles/quantum.webp" alt="Ilustracja bezpiecznej kwantowo zaszyfrowanej usługi e-mail" class="rounded-lg" />


## Spis treści {#table-of-contents}

* [Przedmowa](#foreword)
* [Porównanie dostawców usług e-mail](#email-service-provider-comparison)
* [Jak to działa](#how-does-it-work)
* [Technologie](#technologies)
  * [Bazy danych](#databases)
  * [Bezpieczeństwo](#security)
  * [Skrzynki pocztowe](#mailboxes)
  * [Współbieżność](#concurrency)
  * [Kopie zapasowe](#backups)
  * [Wyszukiwanie](#search)
  * [Projekty](#projects)
  * [Dostawcy](#providers)
* [Przemyślenia](#thoughts)
  * [Zasady](#principles)
  * [Eksperymenty](#experiments)
  * [Brak alternatyw](#lack-of-alternatives)
  * [Wypróbuj Forward Email](#try-out-forward-email)


## Przedmowa {#foreword}

> \[!IMPORTANT]
> Nasza usługa e-mail jest [w 100% open-source](https://github.com/forwardemail) i skupiona na prywatności dzięki bezpiecznym i zaszyfrowanym skrzynkom SQLite.

Do czasu wprowadzenia [wsparcia IMAP](/faq#do-you-support-receiving-email-with-imap) korzystaliśmy z MongoDB do trwałego przechowywania danych.

Ta technologia jest niesamowita i nadal jej używamy – ale aby mieć szyfrowanie danych w spoczynku (encryption-at-rest) w MongoDB, musisz korzystać z dostawcy oferującego MongoDB Enterprise, takiego jak Digital Ocean lub Mongo Atlas – albo zapłacić za licencję enterprise (a następnie zmagać się z opóźnieniami zespołu sprzedaży).

Nasz zespół w [Forward Email](https://forwardemail.net) potrzebował przyjaznego dla programistów, skalowalnego, niezawodnego i zaszyfrowanego rozwiązania do przechowywania skrzynek IMAP. Jako twórcy open-source, korzystanie z technologii, za którą trzeba płacić licencję, aby uzyskać funkcję szyfrowania danych w spoczynku, było sprzeczne z [naszymi zasadami](#principles) – dlatego eksperymentowaliśmy, badaliśmy i opracowaliśmy nowe rozwiązanie od podstaw, aby sprostać tym potrzebom.

Zamiast używać współdzielonej bazy danych do przechowywania Twoich skrzynek, indywidualnie przechowujemy i szyfrujemy Twoje skrzynki za pomocą Twojego hasła (które znasz tylko Ty). **Nasza usługa e-mail jest tak bezpieczna, że jeśli zapomnisz hasła, tracisz swoją skrzynkę** (i musisz odzyskać ją z kopii offline lub zacząć od nowa).

Czytaj dalej, aby poznać szczegóły wraz z [porównaniem dostawców usług e-mail](#email-service-provider-comparison), [jak działa nasza usługa](#how-does-it-work), [naszym stosie technologicznym](#technologies) i więcej.


## Porównanie dostawców usług e-mail {#email-service-provider-comparison}

Jesteśmy jedynym w 100% open-source i skupionym na prywatności dostawcą usług e-mail, który przechowuje indywidualnie zaszyfrowane skrzynki SQLite, oferuje nieograniczoną liczbę domen, aliasów i użytkowników oraz obsługuje wychodzący SMTP, IMAP i POP3:

**W przeciwieństwie do innych dostawców e-mail, nie musisz płacić za miejsce na dysku za każdą domenę lub alias w Forward Email.** Przestrzeń dyskowa jest współdzielona w całym Twoim koncie – więc jeśli masz wiele niestandardowych domen i wiele aliasów na każdej z nich, jesteśmy idealnym rozwiązaniem dla Ciebie. Możesz jednak wprowadzić limity przestrzeni na poziomie domeny lub aliasu, jeśli chcesz.

<a href="/blog/best-email-service" target="_blank" class="btn btn-lg bg-success text-white btn-block btn-success">Przeczytaj porównanie usług e-mail <i class="fa fa-search-plus"></i></a>


## Jak to działa {#how-does-it-work}

1. Korzystając z klienta poczty takiego jak Apple Mail, Thunderbird, Gmail lub Outlook – łączysz się z naszymi bezpiecznymi serwerami [IMAP](/faq#do-you-support-receiving-email-with-imap) używając swojej nazwy użytkownika i hasła:

   * Twoja nazwa użytkownika to pełny alias z domeną, np. `hello@example.com`.
   * Twoje hasło jest losowo generowane i wyświetlane tylko przez 30 sekund po kliknięciu <strong class="text-success"><i class="fa fa-key"></i> Wygeneruj hasło</strong> w <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Moje konto <i class="fa fa-angle-right"></i> Domeny</a> <i class="fa fa-angle-right"></i> Aliasy.
2. Po nawiązaniu połączenia, Twój klient poczty będzie wysyłał [polecenia protokołu IMAP](https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol) do naszego serwera IMAP, aby utrzymać synchronizację Twojej skrzynki pocztowej. Obejmuje to zapisywanie i przechowywanie szkiców wiadomości oraz inne działania, które możesz wykonywać (np. oznaczanie wiadomości jako Ważne lub oznaczanie wiadomości jako Spam/Śmieci).

3. Serwery wymiany poczty (powszechnie znane jako serwery "MX") odbierają nowe przychodzące wiadomości i przechowują je w Twojej skrzynce pocztowej. Gdy to nastąpi, Twój klient poczty zostanie powiadomiony i zsynchronizuje skrzynkę. Nasze serwery wymiany poczty mogą przekazywać Twoją pocztę do jednego lub więcej odbiorców (w tym [webhooków](/faq#do-you-support-webhooks)), przechowywać Twoją pocztę w zaszyfrowanym magazynie IMAP u nas, **lub oba te rozwiązania jednocześnie**!

   > \[!TIP]
   > Chcesz dowiedzieć się więcej? Przeczytaj [jak skonfigurować przekazywanie poczty](/faq#how-do-i-get-started-and-set-up-email-forwarding), [jak działa nasza usługa wymiany poczty](/faq#how-does-your-email-forwarding-system-work) lub zobacz [nasze przewodniki](/guides).

4. W tle, nasz bezpieczny projekt przechowywania poczty działa na dwa sposoby, aby utrzymać Twoje skrzynki zaszyfrowane i dostępne tylko dla Ciebie:

   * Gdy nowa poczta jest odbierana dla Ciebie od nadawcy, nasze serwery wymiany poczty zapisują ją w indywidualnej, tymczasowej i zaszyfrowanej skrzynce pocztowej dla Ciebie.

     ```mermaid
     sequenceDiagram
         autonumber
         actor Sender
         Sender->>MX: Otrzymano wiadomość przychodzącą dla Twojego aliasu (np. you@yourdomain.com).
         MX->>SQLite: Wiadomość jest zapisywana w tymczasowej skrzynce.
         Note over MX,SQLite: Przekazuje do innych odbiorców i skonfigurowanych webhooków.
         MX->>Sender: Sukces!
     ```

   * Gdy łączysz się z naszym serwerem IMAP za pomocą klienta poczty, Twoje hasło jest następnie szyfrowane w pamięci i używane do odczytu i zapisu w Twojej skrzynce. Twoja skrzynka może być odczytywana i zapisywana tylko za pomocą tego hasła. Pamiętaj, że ponieważ jesteś jedyną osobą posiadającą to hasło, **tylko Ty** możesz czytać i zapisywać w swojej skrzynce podczas jej używania. Następnym razem, gdy Twój klient poczty spróbuje sprawdzić pocztę lub zsynchronizować skrzynkę, nowe wiadomości zostaną przeniesione z tej tymczasowej skrzynki i zapisane w Twoim faktycznym pliku skrzynki przy użyciu podanego hasła. Zauważ, że ta tymczasowa skrzynka jest następnie usuwana, aby tylko Twoja chroniona hasłem skrzynka zawierała wiadomości.

   * **Jeśli jesteś połączony z IMAP (np. używając klienta poczty takiego jak Apple Mail lub Thunderbird), wtedy nie musimy zapisywać na tymczasowym dysku. Twoje zaszyfrowane w pamięci hasło IMAP jest pobierane i używane. W czasie rzeczywistym, gdy wiadomość próbuje zostać dostarczona do Ciebie, wysyłamy zapytanie WebSocket do wszystkich serwerów IMAP, pytając, czy mają aktywną sesję dla Ciebie (to jest część pobierania), a następnie przekazujemy to zaszyfrowane hasło w pamięci – dzięki temu nie musimy zapisywać do tymczasowej skrzynki, możemy zapisać do Twojej faktycznej zaszyfrowanej skrzynki używając Twojego zaszyfrowanego hasła.**

     ```mermaid
     sequenceDiagram
         autonumber
         actor You
         You->>IMAP: Łączysz się z serwerem IMAP używając klienta poczty.
         IMAP->>SQLite: Przenosi wiadomość z tymczasowej skrzynki do skrzynki Twojego aliasu.
         Note over IMAP,SQLite: Skrzynka Twojego aliasu jest dostępna tylko w pamięci przy użyciu hasła IMAP.
         SQLite->>IMAP: Pobiera wiadomości na żądanie klienta poczty.
         IMAP->>You: Sukces!
     ```

5. [Kopie zapasowe Twoich zaszyfrowanych skrzynek](#backups) są wykonywane codziennie. Możesz również w każdej chwili zażądać nowej kopii zapasowej lub pobrać najnowszą kopię z <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Moje konto <i class="fa fa-angle-right"></i> Domeny</a> <i class="fa fa-angle-right"></i> Aliasy. Jeśli zdecydujesz się przejść do innej usługi e-mail, możesz łatwo migrować, pobierać, eksportować i usuwać swoje skrzynki oraz kopie zapasowe w dowolnym momencie.


## Technologie {#technologies}

### Bazy danych {#databases}

Badaliśmy inne możliwe warstwy przechowywania baz danych, jednak żadna nie spełniła naszych wymagań tak dobrze jak SQLite:
| Baza danych                                            |                                                                    Szyfrowanie w spoczynku                                                                   |  [Skrzynki pocztowe w piaskownicy](https://en.wikipedia.org/wiki/Sandbox_\(computer_security\))  |                           Licencja                           | [Używane wszędzie](https://www.sqlite.org/mostdeployed.html) |
| ------------------------------------------------------ | :-----------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------: | :---------------------------------------------------------: | :---------------------------------------------------------: |
| **[SQLite](https://www.sqlite.org/index.html)** :star: |                          :white_check_mark: Tak z [SQLite3MultipleCiphers](https://github.com/utelle/SQLite3MultipleCiphers)                         |                                  :white_check_mark:                                  |               :white_check_mark: Public Domain              |                      :white_check_mark:                     |
| [MongoDB](https://www.mongodb.com/)                    |                   :x: ["Dostępne tylko w MongoDB Enterprise"](https://www.mongodb.com/docs/manual/core/security-encryption-at-rest/)                   |                                :x: Baza danych relacyjnych                               |                   :x: AGPL i `SSPL-1.0`                   |                             :x:                             |
| [rqlite](https://github.com/rqlite/rqlite)             |                                             :x: [Tylko sieciowe](https://github.com/rqlite/rqlite/issues/1406)                                            |                                :x: Baza danych relacyjnych                               |                   :white_check_mark: `MIT`                  |                             :x:                             |
| [dqlite](https://dqlite.io/)                           |                                   :x: [Nieprzetestowane i jeszcze nieobsługiwane?](https://github.com/canonical/dqlite/issues/32)                                  | :x: [Nieprzetestowane i jeszcze nieobsługiwane?](https://github.com/canonical/dqlite/issues/32) |              :white_check_mark: `LGPL-3.0-only`             |                             :x:                             |
| [PostgreSQL](https://www.postgresql.org/)              |                                :white_check_mark: [Tak](https://www.postgresql.org/docs/current/encryption-options.html)                                |                                :x: Baza danych relacyjnych                               | :white_check_mark: `PostgreSQL` (podobna do `BSD` lub `MIT`) |                             :x:                             |
| [MariaDB](https://mariadb.com/)                        | :white_check_mark: [Tylko dla InnoDB](https://mariadb.com/kb/en/data-at-rest-encryption-overview/#which-storage-engines-does-mariadb-encryption-support) |                                :x: Baza danych relacyjnych                               |          :white_check_mark: `GPLv2` i `BUSL-1.1`          |                             :x:                             |
| [CockroachDB](https://www.cockroachlabs.com/product/)  |                               :x: [Funkcja tylko w wersji Enterprise](https://www.cockroachlabs.com/docs/v23.1/enterprise-licensing)                              |                                :x: Baza danych relacyjnych                               |                  :x: `BUSL-1.1` i inne                  |                             :x:                             |

> Oto [post na blogu porównujący kilka opcji przechowywania baz danych SQLite](https://gcore.com/learning/comparing-litestream-rqlite-dqlite/) w powyższej tabeli.

### Bezpieczeństwo {#security}

Zawsze używamy [szyfrowania w spoczynku](https://en.wikipedia.org/wiki/Data_at_rest) ([AES-256](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard)), [szyfrowania w tranzycie](https://en.wikipedia.org/wiki/Data_in_transit) ([TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security)), [DNS przez HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") za pomocą :tangerine: [Tangerine](https://tangeri.ne), oraz szyfrowania [sqleet](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/) ([ChaCha20-Poly1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)) na skrzynkach pocztowych. Dodatkowo stosujemy uwierzytelnianie dwuskładnikowe oparte na tokenach (w przeciwieństwie do SMS, które jest podatne na [atak typu man-in-the-middle](https://en.wikipedia.org/wiki/Man-in-the-middle_attack)), rotację kluczy SSH z wyłączonym dostępem root, wyłączny dostęp do serwerów przez ograniczone adresy IP i inne.
W przypadku [ataku złej pokojówki](https://en.wikipedia.org/wiki/Evil_maid_attack) lub nieuczciwego pracownika z zewnętrznego dostawcy, **Twoja skrzynka pocztowa może być otwarta tylko za pomocą wygenerowanego przez Ciebie hasła**. Możesz być spokojny, nie polegamy na żadnych zewnętrznych dostawcach poza naszymi serwerami zgodnymi z SOC Type 2, dostarczanymi przez Cloudflare, DataPacket, Digital Ocean, GitHub i Vultr.

Naszym celem jest posiadanie jak najmniejszej liczby [pojedynczych punktów awarii](https://en.wikipedia.org/wiki/Single_point_of_failure).

### Skrzynki pocztowe {#mailboxes}

> **tldr;** Nasze serwery IMAP używają indywidualnie zaszyfrowanych baz danych SQLite dla każdej Twojej skrzynki pocztowej.

[SQLite to niezwykle popularna](https://www.sqlite.org/mostdeployed.html) wbudowana baza danych – obecnie działa na Twoim telefonie i komputerze – [i jest używana przez niemal wszystkie główne technologie](https://www.sqlite.org/famous.html).

Na przykład, na naszych zaszyfrowanych serwerach znajduje się baza danych SQLite dla skrzynki `linux@example.com`, `info@example.com`, `hello@example.com` i tak dalej – jedna dla każdej jako plik bazy danych `.sqlite`. Nie nazywamy plików baz danych nazwami adresów e-mail – zamiast tego używamy BSON ObjectID oraz unikalnych UUID generowanych, które nie ujawniają, do kogo należy skrzynka ani jaki jest adres e-mail (np. `353a03f21e534321f5d6e267.sqlite`).

Każda z tych baz danych jest sama w sobie zaszyfrowana za pomocą Twojego hasła (które znasz tylko Ty) przy użyciu [sqleet](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/) ([ChaCha20-Poly1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/)). Oznacza to, że Twoje skrzynki pocztowe są indywidualnie zaszyfrowane, samodzielne, [odizolowane](https://en.wikipedia.org/wiki/Sandbox_\(computer_security\)) i przenośne.

Dostosowaliśmy SQLite za pomocą następujących [PRAGMA](https://www.sqlite.org/pragma.html):

| `PRAGMA`                 | Cel                                                                                                                                                                                                                                                     |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cipher=chacha20`        | [Szyfrowanie bazy danych SQLite ChaCha20-Poly1305](https://utelle.github.io/SQLite3MultipleCiphers/docs/ciphers/cipher_chacha20/). Odwołanie do `better-sqlite3-multiple-ciphers` w sekcji [Projects](#projects) dla głębszego wglądu.                   |
| `key="****************"` | To jest Twoje odszyfrowane w pamięci hasło, które jest przesyłane przez połączenie IMAP Twojego klienta poczty do naszego serwera. Nowe instancje bazy danych są tworzone i zamykane dla każdej sesji odczytu i zapisu (aby zapewnić izolację i sandbox). |
| `journal_mode=WAL`       | Write-ahead-log ("[WAL](https://www.sqlite.org/wal.html)") [który zwiększa wydajność i pozwala na równoczesny dostęp do odczytu](https://litestream.io/tips/#wal-journal-mode).                                                                          |
| `busy_timeout=5000`      | Zapobiega błędom blokady zapisu [podczas gdy inne zapisy są wykonywane](https://litestream.io/tips/#busy-timeout).                                                                                                                                       |
| `synchronous=NORMAL`     | Zwiększa trwałość transakcji [bez ryzyka uszkodzenia danych](https://litestream.io/tips/#synchronous-pragma).                                                                                                                                           |
| `foreign_keys=ON`        | Wymusza przestrzeganie kluczy obcych (np. relacji między tabelami). [Domyślnie nie jest to włączone w SQLite](https://www.sqlite.org/foreignkeys.html), ale dla walidacji i integralności danych powinno być aktywne.                                      |
| `encoding='UTF-8'`       | [Domyślne kodowanie](https://www.sqlite.org/pragma.html#pragma_encoding) używane dla zapewnienia spójności programistycznej.                                                                                                                              |
> Wszystkie pozostałe domyślne ustawienia pochodzą z SQLite, zgodnie z [oficjalną dokumentacją PRAGMA](https://www.sqlite.org/pragma.html#pragma_auto_vacuum).

### Współbieżność {#concurrency}

> **w skrócie;** Używamy `WebSocket` do równoczesnego odczytu i zapisu w Twoich zaszyfrowanych skrzynkach pocztowych SQLite.

#### Odczyty {#reads}

Twój klient poczty na telefonie może rozwiązywać `imap.forwardemail.net` do jednego z naszych adresów IP Digital Ocean – a Twój klient na komputerze może rozwiązywać inny adres IP od innego [dostawcy](#providers).

Niezależnie od tego, do którego serwera IMAP łączy się Twój klient poczty, chcemy, aby połączenie odczytywało dane z Twojej bazy w czasie rzeczywistym z 100% dokładnością. Odbywa się to za pomocą WebSocketów.

#### Zapisy {#writes}

Zapisy do Twojej bazy danych są nieco inne – ponieważ SQLite jest bazą osadzoną, a Twoja skrzynka pocztowa domyślnie znajduje się w jednym pliku.

Badaliśmy opcje takie jak `litestream`, `rqlite` i `dqlite` poniżej – jednak żadna z nich nie spełniła naszych wymagań.

Aby wykonać zapisy z włączonym dziennikiem zapisu przed zapisem ("[WAL](https://www.sqlite.org/wal.html)"), musimy zapewnić, że tylko jeden serwer ("Primary") jest za to odpowiedzialny.  [WAL](https://www.sqlite.org/wal.html) znacznie przyspiesza współbieżność i pozwala na jednego pisarza i wielu czytelników.

Primary działa na serwerach danych z zamontowanymi wolumenami zawierającymi zaszyfrowane skrzynki pocztowe. Z punktu widzenia dystrybucji, można uznać wszystkie indywidualne serwery IMAP za `imap.forwardemail.net` za serwery wtórne ("Secondary").

Dwukierunkową komunikację realizujemy za pomocą [WebSocketów](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket):

* Serwery Primary używają instancji serwera `WebSocketServer` z [ws](https://github.com/websockets/ws).
* Serwery Secondary używają instancji klienta `WebSocket` z [ws](https://github.com/websockets/ws), opakowanego w [websocket-as-promised](https://github.com/vitalets/websocket-as-promised) oraz [reconnecting-websocket](https://github.com/opensumi/reconnecting-websocket). Te dwa wrappery zapewniają, że `WebSocket` łączy się ponownie i może wysyłać oraz odbierać dane dla konkretnych zapisów w bazie danych.

### Kopie zapasowe {#backups}

> **w skrócie;** Kopie zapasowe Twoich zaszyfrowanych skrzynek pocztowych są wykonywane codziennie. Możesz także natychmiast zażądać nowej kopii zapasowej lub pobrać najnowszą kopię w dowolnym momencie z <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Moje konto <i class="fa fa-angle-right"></i> Domeny</a> <i class="fa fa-angle-right"></i> Aliasów.

Do tworzenia kopii zapasowych codziennie podczas przetwarzania poleceń IMAP uruchamiamy po prostu polecenie SQLite `VACUUM INTO`, które wykorzystuje Twoje zaszyfrowane hasło z połączenia IMAP w pamięci. Kopie zapasowe są przechowywane, jeśli nie wykryto istniejącej kopii lub jeśli [SHA-256](https://en.wikipedia.org/wiki/SHA-2) skrót pliku zmienił się w porównaniu do najnowszej kopii zapasowej.

Zauważ, że używamy polecenia `VACUUM INTO` zamiast wbudowanego polecenia `backup`, ponieważ jeśli strona zostanie zmodyfikowana podczas operacji `backup`, to musi się ona rozpocząć od nowa. Polecenie `VACUUM INTO` wykonuje migawkę. Zobacz te komentarze na [GitHub](https://github.com/benbjohnson/litestream.io/issues/56) oraz [Hacker News](https://news.ycombinator.com/item?id=31387556) dla lepszego zrozumienia.

Dodatkowo używamy `VACUUM INTO` zamiast `backup`, ponieważ polecenie `backup` pozostawiłoby bazę danych nieszyfrowaną przez krótki czas, aż zostanie wywołane `rekey` (zobacz ten komentarz na GitHubie [comment](https://github.com/m4heshd/better-sqlite3-multiple-ciphers/issues/46#issuecomment-1468018927) dla wyjaśnienia).

Secondary poleci Primary przez połączenie `WebSocket` wykonanie kopii zapasowej – a Primary następnie otrzyma polecenie i wykona kolejno:

1. Połączy się z Twoją zaszyfrowaną skrzynką pocztową.
2. Uzyska blokadę zapisu.
3. Wykona punkt kontrolny WAL za pomocą `wal_checkpoint(PASSIVE)`.
4. Uruchomi polecenie SQLite `VACUUM INTO`.
5. Upewni się, że skopiowany plik można otworzyć za pomocą zaszyfrowanego hasła (zabezpieczenie/przeciwdziałanie błędom).
6. Prześle go do Cloudflare R2 do przechowywania (lub do Twojego własnego dostawcy, jeśli został określony).
<!--
7. Skompresuj powstały plik kopii zapasowej za pomocą `gzip`.
8. Prześlij go do Cloudflare R2 w celu przechowywania (lub do własnego dostawcy, jeśli jest określony).
-->

Pamiętaj, że Twoje skrzynki pocztowe są zaszyfrowane – i chociaż mamy ograniczenia IP oraz inne środki uwierzytelniania dla komunikacji WebSocket – w przypadku działania osoby niepowołanej możesz być pewien, że jeśli ładunek WebSocket nie zawiera Twojego hasła IMAP, nie może otworzyć Twojej bazy danych.

Obecnie przechowywana jest tylko jedna kopia zapasowa na skrzynkę pocztową, ale w przyszłości możemy zaoferować odzyskiwanie punktowe ("[PITR](https://en.wikipedia.org/wiki/Point-in-time_recovery)").

### Wyszukiwanie {#search}

Nasze serwery IMAP obsługują polecenie `SEARCH` z złożonymi zapytaniami, wyrażeniami regularnymi i innymi.

Szybka wydajność wyszukiwania jest możliwa dzięki [FTS5](https://www.sqlite.org/fts5.html) oraz [sqlite-regex](https://github.com/asg017/sqlite-regex#sqlite-regex).

Przechowujemy wartości `Date` w skrzynkach SQLite jako ciągi [ISO 8601](https://pl.wikipedia.org/wiki/ISO_8601) za pomocą [Date.prototype.toISOString](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString) (z czasem UTC, aby porównania równości działały poprawnie).

Indeksy są również przechowywane dla wszystkich właściwości, które występują w zapytaniach wyszukiwania.

### Projekty {#projects}

Oto tabela przedstawiająca projekty, których używamy w naszym kodzie źródłowym i procesie rozwoju (posortowane alfabetycznie):

| Projekt                                                                                       | Cel                                                                                                                                                                                                                                                                                                                                                              |
| --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Ansible](https://www.ansible.com/)                                                           | Platforma automatyzacji DevOps do łatwego utrzymania, skalowania i zarządzania całym naszym zestawem serwerów.                                                                                                                                                                                                                                                     |
| [Bree](https://github.com/breejs/bree)                                                        | Harmonogram zadań dla Node.js i JavaScript z obsługą cron, dat, ms, later oraz przyjaznym dla użytkownika wsparciem.                                                                                                                                                                                                                                               |
| [Cabin](https://github.com/cabinjs/cabin)                                                     | Przyjazna dla programistów biblioteka logowania JavaScript i Node.js z myślą o bezpieczeństwie i prywatności.                                                                                                                                                                                                                                                     |
| [Lad](https://github.com/ladjs/lad)                                                           | Framework Node.js, który napędza całą naszą architekturę i projekt inżynieryjny z MVC i innymi funkcjami.                                                                                                                                                                                                                                                         |
| [MongoDB](https://www.mongodb.com/)                                                           | Rozwiązanie bazy danych NoSQL, którego używamy do przechowywania wszystkich innych danych poza skrzynkami pocztowymi (np. Twoje konto, ustawienia, domeny i konfiguracje aliasów).                                                                                                                                                                                |
| [Mongoose](https://github.com/Automattic/mongoose)                                            | Modelowanie dokumentów obiektowych MongoDB ("ODM"), którego używamy w całym naszym stosie. Napisaliśmy specjalne pomocniki, które pozwalają nam po prostu dalej korzystać z **Mongoose z SQLite** :tada:                                                                                                                                                            |
| [Node.js](https://nodejs.org/en)                                                              | Node.js to otwarte, wieloplatformowe środowisko uruchomieniowe JavaScript, które obsługuje wszystkie nasze procesy serwerowe.                                                                                                                                                                                                                                     |
| [Nodemailer](https://github.com/nodemailer/nodemailer)                                        | Pakiet Node.js do wysyłania e-maili, tworzenia połączeń i innych. Jesteśmy oficjalnym sponsorem tego projektu.                                                                                                                                                                                                                                                    |
| [Redis](https://redis.io/)                                                                    | Baza danych w pamięci do buforowania, kanałów publikuj/subskrybuj oraz zapytań DNS przez HTTPS.                                                                                                                                                                                                                                                                   |
| [SQLite3MultipleCiphers](https://github.com/utelle/SQLite3MultipleCiphers)                    | Rozszerzenie szyfrowania dla SQLite pozwalające na szyfrowanie całych plików bazy danych (w tym write-ahead-log ("[WAL](https://www.sqlite.org/wal.html)"), dziennik, rollback, …).                                                                                                                                                                               |
| [SQLiteStudio](https://github.com/pawelsalawa/sqlitestudio)                                   | Wizualny edytor SQLite (który możesz również używać) do testowania, pobierania i przeglądania skrzynek pocztowych w trakcie rozwoju.                                                                                                                                                                                                                             |
| [SQLite](https://www.sqlite.org/about.html)                                                   | Wbudowana warstwa bazy danych dla skalowalnego, samodzielnego, szybkiego i odpornego magazynu IMAP.                                                                                                                                                                                                                                                              |
| [Spam Scanner](https://github.com/spamscanner/spamscanner)                                    | Narzędzie Node.js do ochrony przed spamem, filtrowania e-maili i zapobiegania phishingowi (nasza alternatywa dla [Spam Assassin](https://spamassassin.apache.org/) i [rspamd](https://github.com/rspamd/rspamd)).                                                                                                                                                   |
| [Tangerine](https://tangeri.ne)                                                               | Zapytania DNS przez HTTPS z Node.js i buforowaniem za pomocą Redis – co zapewnia globalną spójność i wiele więcej.                                                                                                                                                                                                                                                |
| [Thunderbird](https://www.thunderbird.net/)                                                   | Nasz zespół deweloperski używa tego (i również poleca) jako **preferowanego klienta poczty do używania z Forward Email**.                                                                                                                                                                                                                                         |
| [UTM](https://github.com/utmapp/UTM)                                                          | Nasz zespół deweloperski używa tego do tworzenia maszyn wirtualnych dla iOS i macOS, aby testować różne klientów poczty (równolegle) z naszymi serwerami IMAP i SMTP.                                                                                                                                                                                               |
| [Ubuntu](https://ubuntu.com/download/server)                                                  | Nowoczesny, otwartoźródłowy system operacyjny oparty na Linuksie, który napędza całą naszą infrastrukturę.                                                                                                                                                                                                                                                        |
| [WildDuck](https://github.com/nodemailer/wildduck)                                            | Biblioteka serwera IMAP – zobacz jej notatki o [deduplikacji załączników](https://github.com/nodemailer/wildduck/blob/master/docs/in-depth/attachment-deduplication.md) oraz [wsparciu protokołu IMAP](https://github.com/nodemailer/wildduck/blob/master/docs/in-depth/protocol-support.md).                                                                         |
| [better-sqlite3-multiple-ciphers](https://github.com/m4heshd/better-sqlite3-multiple-ciphers) | Szybka i prosta biblioteka API dla Node.js do programowej interakcji z SQLite3.                                                                                                                                                                                                                                                                                   |
| [email-templates](https://github.com/forwardemail/email-templates)                            | Przyjazny dla programistów framework do tworzenia, podglądu i wysyłania niestandardowych e-maili (np. powiadomień konta i innych).                                                                                                                                                                                                                                 |
| [json-sql-enhanced](https://github.com/forwardemail/json-sql-enhanced)                        | Budowniczy zapytań SQL używający składni w stylu Mongo. Oszczędza naszemu zespołowi deweloperskiemu czas, ponieważ możemy dalej pisać w stylu Mongo w całym stosie z podejściem niezależnym od bazy danych. **Pomaga również unikać ataków SQL injection poprzez użycie parametrów zapytań.**                                                                    |
| [knex-schema-inspector](https://github.com/knex/knex-schema-inspector)                        | Narzędzie SQL do wydobywania informacji o istniejącym schemacie bazy danych. Pozwala nam łatwo weryfikować, czy wszystkie indeksy, tabele, kolumny, ograniczenia i inne są poprawne i odpowiadają `1:1` temu, jak powinny być. Napisaliśmy nawet automatyczne pomocniki do dodawania nowych kolumn i indeksów, jeśli wprowadzane są zmiany w schematach baz danych (z bardzo szczegółowym alertowaniem błędów). |
| [knex](https://github.com/knex/knex)                                                          | Budowniczy zapytań SQL, którego używamy tylko do migracji bazy danych i walidacji schematu przez `knex-schema-inspector`.                                                                                                                                                                                                                                         |
| [mandarin](https://github.com/ladjs/mandarin)                                                 | Automatyczne tłumaczenie fraz [i18n](https://pl.wikipedia.org/wiki/Internacjonalizacja_i_lokalizacja) z obsługą Markdown za pomocą [Google Cloud Translation API](https://cloud.google.com/translate/docs/reference/rest).                                                                                                                                         |
| [mx-connect](https://github.com/zone-eu/mx-connect)                                           | Pakiet Node.js do rozwiązywania i nawiązywania połączeń z serwerami MX oraz obsługi błędów.                                                                                                                                                                                                                                                                        |
| [pm2](https://github.com/Unitech/pm2)                                                         | Menedżer procesów produkcyjnych Node.js z wbudowanym load balancerem ([dostrojony](https://github.com/Unitech/pm2/issues/5145#issuecomment-1737764214) pod kątem wydajności).                                                                                                                                                                                        |
| [smtp-server](https://github.com/nodemailer/smtp-server)                                      | Biblioteka serwera SMTP – używamy jej dla naszych serwerów wymiany poczty ("MX") i wychodzących SMTP.                                                                                                                                                                                                                                                             |
| [ImapTest](https://www.imapwiki.org/ImapTest)                                                 | Przydatne narzędzie do testowania serwerów IMAP pod kątem benchmarków i zgodności z protokołem IMAP według specyfikacji RFC. Projekt został stworzony przez zespół [Dovecot](https://pl.wikipedia.org/wiki/Dovecot_\(software\)) (aktywny otwartoźródłowy serwer IMAP i POP3 od lipca 2002). Intensywnie testowaliśmy nasz serwer IMAP tym narzędziem.                                    |
> Możesz znaleźć inne projekty, których używamy, w [naszym kodzie źródłowym na GitHub](https://github.com/forwardemail).

### Dostawcy {#providers}

| Dostawca                                        | Cel                                                                                                                          |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| [Cloudflare](https://www.cloudflare.com/)       | Dostawca DNS, kontrole stanu, load balancery oraz zapasowa pamięć masowa za pomocą [Cloudflare R2](https://developers.cloudflare.com/r2). |
| [GitHub](https://github.com/)                   | Hosting kodu źródłowego, CI/CD oraz zarządzanie projektami.                                                                  |
| [Digital Ocean](https://m.do.co/c/a7fe489d1b27) | Hosting dedykowanych serwerów i zarządzane bazy danych.                                                                       |
| [Vultr](https://www.vultr.com/?ref=7429848)     | Hosting dedykowanych serwerów.                                                                                                |
| [DataPacket](https://www.datapacket.com)        | Hosting dedykowanych serwerów.                                                                                                |


## Przemyślenia {#thoughts}

### Zasady {#principles}

Forward Email jest zaprojektowany zgodnie z następującymi zasadami:

1. Zawsze być przyjaznym dla programistów, skoncentrowanym na bezpieczeństwie i prywatności oraz transparentnym.
2. Przestrzegać [MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller), [Unix](https://en.wikipedia.org/wiki/Unix_philosophy), [KISS](https://en.wikipedia.org/wiki/KISS_principle), [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself), [YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it), [Twelve Factor](https://12factor.net/), [brzytwy Ockhama](https://en.wikipedia.org/wiki/Occam%27s_razor) oraz [dogfoodingu](https://en.wikipedia.org/wiki/Eating_your_own_dog_food)
3. Skierowany do zdeterminowanych, samofinansujących się i [ramen-profitable](http://www.paulgraham.com/ramenprofitable.html) programistów

### Eksperymenty {#experiments}

> **tldr;** Ostatecznie użycie obiektowej pamięci masowej kompatybilnej z S3 i/lub Wirtualnych Tabel nie jest technicznie wykonalne ze względów wydajnościowych i podatne na błędy z powodu ograniczeń pamięci.

Przeprowadziliśmy kilka eksperymentów prowadzących do naszego ostatecznego rozwiązania opartego na SQLite, jak omówiono powyżej.

Jednym z nich było próbowanie użycia [rclone]() i SQLite razem z warstwą pamięci masowej kompatybilną z S3.

Ten eksperyment pozwolił nam lepiej zrozumieć i odkryć przypadki brzegowe dotyczące rclone, SQLite oraz użycia [VFS](https://en.wikipedia.org/wiki/Virtual_file_system):

* Jeśli włączysz flagę `--vfs-cache-mode writes` w rclone, odczyty będą OK, jednak zapisy będą buforowane.
  * Jeśli masz wiele serwerów IMAP rozproszonych globalnie, wtedy cache będzie niezsynchronizowany między nimi, chyba że masz jednego pisarza i wielu słuchaczy (np. podejście pub/sub).
  * To jest niezwykle skomplikowane, a dodanie takiej dodatkowej złożoności spowoduje więcej pojedynczych punktów awarii.
  * Dostawcy pamięci masowej kompatybilnej z S3 nie obsługują częściowych zmian plików – co oznacza, że każda zmiana pliku `.sqlite` spowoduje całkowitą zmianę i ponowne przesłanie bazy danych.
  * Istnieją inne rozwiązania, takie jak `rsync`, ale nie są one skoncentrowane na wsparciu dziennika zapisu przed zapisem ("[WAL](https://www.sqlite.org/wal.html)") – dlatego ostatecznie rozważaliśmy Litestream. Na szczęście nasze szyfrowanie już szyfruje pliki [WAL](https://www.sqlite.org/wal.html), więc nie musimy polegać na Litestream w tym zakresie. Jednak nie byliśmy jeszcze pewni Litestream do użytku produkcyjnego i mamy kilka uwag poniżej.
  * Użycie opcji `--vfs-cache-mode writes` (jedyny sposób na użycie SQLite przez `rclone` do zapisu) spowoduje próbę skopiowania całej bazy danych od zera w pamięci – obsługa jednej skrzynki pocztowej o rozmiarze 10 GB jest OK, jednak obsługa wielu skrzynek o bardzo dużej pojemności spowoduje, że serwery IMAP napotkają ograniczenia pamięci i błędy `ENOMEM`, błędy segmentacji oraz uszkodzenia danych.
* Jeśli spróbujesz użyć SQLite [Wirtualnych Tabel](https://www.sqlite.org/vtab.html) (np. używając [s3db](https://github.com/jrhy/s3db)) aby mieć dane na warstwie pamięci masowej kompatybilnej z S3, napotkasz kilka dodatkowych problemów:
  * Odczyty i zapisy będą niezwykle wolne, ponieważ punkty końcowe API S3 będą musiały być wywoływane metodami HTTP `GET`, `PUT`, `HEAD` i `POST`.
  * Testy rozwojowe pokazały, że przekroczenie 500K-1M+ rekordów na łączu światłowodowym jest nadal ograniczone przepustowością zapisu i odczytu do dostawców kompatybilnych z S3. Na przykład nasi programiści uruchamiali pętle `for` wykonujące zarówno sekwencyjne instrukcje SQL `INSERT`, jak i masowe zapisy dużych ilości danych. W obu przypadkach wydajność była zdumiewająco niska.
  * Wirtualne tabele **nie mogą mieć indeksów**, instrukcji `ALTER TABLE` oraz [innych](https://stackoverflow.com/a/12507650) [ograniczeń](https://sqlite.org/lang_createvtab.html) – co prowadzi do opóźnień rzędu 1-2 minut lub więcej, w zależności od ilości danych.
  * Obiekty były przechowywane bez szyfrowania i nie ma natywnego wsparcia dla szyfrowania.
* Zbadaliśmy również użycie [sqlite-s3vfs](https://github.com/uktrade/sqlite-s3vfs), które jest koncepcyjnie i technicznie podobne do poprzedniego punktu (więc ma te same problemy). Możliwością byłoby użycie niestandardowej kompilacji `sqlite3` opakowanej szyfrowaniem, takiego jak [wxSQLite3](https://github.com/utelle/wxsqlite3) (którego obecnie używamy w naszym rozwiązaniu powyżej) poprzez [edycję pliku setup](https://github.com/rogerbinns/apsw/blob/a870bda57ce28704f028af44c392b9a458e702be/setup.py#L268-L276).
* Innym potencjalnym podejściem było użycie rozszerzenia [multiplex](https://www.sqlite.org/src/doc/trunk/src/test_multiplex.c), jednak ma ono ograniczenie do 32 GB i wymagałoby skomplikowanego budowania i problemów rozwojowych.
* Instrukcje `ALTER TABLE` są wymagane (więc to całkowicie wyklucza użycie Wirtualnych Tabel). Potrzebujemy instrukcji `ALTER TABLE`, aby nasz hook z `knex-schema-inspector` działał poprawnie – co zapewnia, że dane nie są uszkodzone, a pobrane wiersze mogą być konwertowane na poprawne dokumenty zgodnie z naszymi definicjami schematów `mongoose` (które obejmują ograniczenia, typy zmiennych i dowolną walidację danych).
* Prawie wszystkie projekty kompatybilne z S3 związane z SQLite w społeczności open-source są w Pythonie (a nie w JavaScript, którego używamy w 100% naszego stosu).
* Biblioteki kompresji takie jak [sqlite-zstd](https://github.com/phiresky/sqlite-zstd) (zobacz [komentarze](https://news.ycombinator.com/item?id=32303762)) wyglądają obiecująco, ale [mogą jeszcze nie być gotowe do produkcji](https://github.com/phiresky/sqlite-zstd#usage). Zamiast tego kompresja po stronie aplikacji na typach danych takich jak `String`, `Object`, `Map`, `Array`, `Set` i `Buffer` będzie czystszym i łatwiejszym podejściem (i łatwiejszym do migracji, ponieważ moglibyśmy przechowywać flagę `Boolean` lub kolumnę – lub nawet użyć `PRAGMA` `user_version=1` dla kompresji lub `user_version=0` dla braku kompresji jako metadanych bazy danych).
  * Na szczęście mamy już zaimplementowaną deduplikację załączników w naszej pamięci serwera IMAP – dlatego każda wiadomość z tym samym załącznikiem nie przechowuje kopii załącznika – zamiast tego pojedynczy załącznik jest przechowywany dla wielu wiadomości i wątków w skrzynce pocztowej (a następnie używane jest odniesienie obce).
* Projekt Litestream, który jest rozwiązaniem do replikacji i kopii zapasowych SQLite, jest bardzo obiecujący i najprawdopodobniej użyjemy go w przyszłości.
  * Nie chcemy umniejszać autorom – ponieważ kochamy ich pracę i wkład w open-source od ponad dekady – jednak z realnego użytkowania wynika, że [może być wiele problemów](https://github.com/benbjohnson/litestream/issues) i [potencjalnej utraty danych z użytkowania](https://github.com/benbjohnson/litestream/issues/218).
* Przywracanie kopii zapasowych musi być bezproblemowe i trywialne. Użycie rozwiązania takiego jak MongoDB z `mongodump` i `mongoexport` jest nie tylko uciążliwe, ale czasochłonne i ma złożoność konfiguracji.
  * Bazy danych SQLite to upraszcza (to pojedynczy plik).
  * Chcieliśmy zaprojektować rozwiązanie, w którym użytkownicy mogą w każdej chwili zabrać swoją skrzynkę pocztową i odejść.
    * Proste polecenia Node.js do `fs.unlink('mailbox.sqlite'))` i jest trwale usunięta z dysku.
    * Podobnie możemy użyć API kompatybilnego z S3 z HTTP `DELETE`, aby łatwo usuwać snapshoty i kopie zapasowe dla użytkowników.
  * SQLite było najprostszym, najszybszym i najbardziej opłacalnym rozwiązaniem.
### Brak alternatyw {#lack-of-alternatives}

Według naszej wiedzy, żadne inne usługi e-mail nie są zaprojektowane w ten sposób ani nie są open-source.

*Uważamy, że może to wynikać* z faktu, że istniejące usługi e-mail korzystają z technologii dziedzicznej w produkcji z [spaghetti code](https://en.wikipedia.org/wiki/Spaghetti_code) :spaghetti:.

Większość, jeśli nie wszyscy, obecni dostawcy usług e-mail są albo zamknięci, albo reklamują się jako open-source, **ale w rzeczywistości tylko ich front-end jest open-source.**

**Najbardziej wrażliwa część e-maila** (faktyczne przechowywanie/IMAP/SMTP) **jest wykonywana na back-endzie (serwerze), a *nie* na front-endzie (kliencie)**.

### Wypróbuj Forward Email {#try-out-forward-email}

Zarejestruj się już dziś na <https://forwardemail.net>! :rocket:
