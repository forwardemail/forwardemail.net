# Poczta e-mail hostowana samodzielnie: zobowiązanie do korzystania z oprogramowania typu open source {#self-hosted-email-commitment-to-open-source}

<img loading="lazy" src="/img/articles/self-hosted.webp" alt="Self-hosted email solution illustration" class="rounded-lg" />

## Spis treści {#table-of-contents}

* [Przedmowa](#foreword)
* [Dlaczego poczta e-mail hostowana samodzielnie ma znaczenie](#why-self-hosted-email-matters)
  * [Problem z tradycyjnymi usługami poczty e-mail](#the-problem-with-traditional-email-services)
  * [Alternatywa dla hostingu własnego](#the-self-hosted-alternative)
* [Nasza implementacja w trybie samodzielnego hostingu: przegląd techniczny](#our-self-hosted-implementation-technical-overview)
  * [Architektura oparta na Dockerze zapewniająca prostotę i przenośność](#docker-based-architecture-for-simplicity-and-portability)
  * [Instalacja skryptu Bash: dostępność spotyka się z bezpieczeństwem](#bash-script-installation-accessibility-meets-security)
  * [Szyfrowanie kwantowe zapewniające prywatność na przyszłość](#quantum-safe-encryption-for-future-proof-privacy)
  * [Automatyczna konserwacja i aktualizacje](#automated-maintenance-and-updates)
* [Zaangażowanie w Open Source](#the-open-source-commitment)
* [Hosting własny a hosting zarządzany: wybór właściwego rozwiązania](#self-hosted-vs-managed-making-the-right-choice)
  * [Rzeczywistość samodzielnego hostingu poczty e-mail](#the-reality-of-self-hosting-email)
  * [Kiedy wybrać naszą usługę zarządzaną](#when-to-choose-our-managed-service)
* [Wprowadzenie do samodzielnego przekazywania poczty e-mail](#getting-started-with-self-hosted-forward-email)
  * [Wymagania systemowe](#system-requirements)
  * [Kroki instalacji](#installation-steps)
* [Przyszłość poczty e-mail hostowanej samodzielnie](#the-future-of-self-hosted-email)
* [Wnioski: Wolność poczty e-mail dla każdego](#conclusion-email-freedom-for-everyone)
* [Odniesienia](#references)

## Przedmowa {#foreword}

W dzisiejszym cyfrowym świecie poczta e-mail pozostaje podstawą naszej tożsamości i komunikacji online. Jednak wraz ze wzrostem obaw o prywatność wielu użytkowników staje przed trudnym wyborem: wygoda kosztem prywatności czy prywatność kosztem wygody. W Forward Email zawsze wierzyliśmy, że nie powinieneś musieć wybierać między tymi dwoma opcjami.

Z radością ogłaszamy dziś ważny kamień milowy w naszej podróży: uruchomienie naszego samodzielnie hostowanego rozwiązania poczty e-mail. Ta funkcja odzwierciedla nasze najgłębsze zaangażowanie w zasady open source, projektowanie zorientowane na prywatność i wzmacnianie pozycji użytkowników. Dzięki naszej opcji samodzielnego hostowania oddajemy pełną kontrolę nad komunikacją e-mailową w Twoje ręce.

W tym wpisie na blogu przedstawiamy filozofię stojącą za naszym rozwiązaniem hostowanym we własnym zakresie, jego techniczną implementację i wyjaśniamy, dlaczego jest ono ważne dla użytkowników, którzy cenią sobie prywatność i własność w komunikacji cyfrowej.

## Dlaczego poczta e-mail hostowana samodzielnie ma znaczenie {#why-self-hosted-email-matters}

Nasze rozwiązanie do samodzielnego hostingu poczty e-mail jest najwyraźniejszym wyrazem naszego przekonania, że prawdziwa prywatność oznacza kontrolę, a kontrola zaczyna się od oprogramowania open source. Dla użytkowników, którzy domagają się pełnej kontroli nad swoją komunikacją cyfrową, samodzielny hosting nie jest już marginalnym pomysłem, lecz podstawowym prawem. Z dumą podtrzymujemy to przekonanie, oferując w pełni otwartą, weryfikowalną platformę, którą możesz zarządzać na własnych warunkach.

### Problem z tradycyjnymi usługami poczty e-mail {#the-problem-with-traditional-email-services}

Tradycyjne usługi poczty elektronicznej stwarzają szereg podstawowych wyzwań dla użytkowników dbających o swoją prywatność:

1. **Wymagania dotyczące zaufania**: Musisz ufać dostawcy, że nie będzie uzyskiwał dostępu do Twoich danych, nie będzie ich analizował ani udostępniał.
2. **Scentralizowana kontrola**: Twój dostęp może zostać cofnięty w dowolnym momencie i z dowolnego powodu.
3. **Luka w zabezpieczeniach nadzoru**: Scentralizowane usługi są głównym celem nadzoru.
4. **Ograniczona przejrzystość**: Większość usług korzysta z zastrzeżonego oprogramowania o zamkniętym kodzie źródłowym.
5. **Uzależnienie od dostawcy**: Migracja z tych usług może być trudna lub niemożliwa.

Nawet dostawcy poczty elektronicznej „nastawieni na prywatność” często nie spełniają oczekiwań, udostępniając jedynie oprogramowanie front-endowe (tzw. open source), a jednocześnie utrzymując systemy back-endowe jako zastrzeżone i zamknięte. To tworzy istotną lukę w zaufaniu – jesteś proszony o wiarę w ich obietnice dotyczące prywatności, bez możliwości ich weryfikacji.

### Alternatywa dla hostingu własnego {#the-self-hosted-alternative}

Samodzielne hostowanie poczty e-mail zapewnia zupełnie inne podejście:

1. **Pełna kontrola**: Posiadasz i kontrolujesz całą infrastrukturę poczty e-mail.
2. **Weryfikowalna prywatność**: Cały system jest transparentny i podlega audytowi.
3. **Brak konieczności zaufania**: Nie musisz ufać osobom trzecim w kwestii komunikacji.
4. **Swoboda personalizacji**: Dostosuj system do swoich potrzeb.
5. **Odporność**: Twoja usługa będzie działać niezależnie od decyzji firmy.

Jak stwierdził jeden z użytkowników: „Samodzielne hostowanie poczty e-mail jest cyfrowym odpowiednikiem uprawy własnego jedzenia — wymaga więcej pracy, ale dokładnie wiem, co się w nim znajduje”.

## Nasza implementacja hostowana samodzielnie: Przegląd techniczny {#our-self-hosted-implementation-technical-overview}

Nasze rozwiązanie do samodzielnego hostingu poczty e-mail opiera się na tych samych zasadach prywatności, które obowiązują we wszystkich naszych produktach. Przyjrzyjmy się implementacji technicznej, która to umożliwia.

### Architektura oparta na Dockerze dla prostoty i przenośności {#docker-based-architecture-for-simplicity-and-portability}

Stworzyliśmy całą naszą infrastrukturę poczty elektronicznej w Dockerze, co ułatwia jej wdrożenie praktycznie na każdym systemie Linux. To kontenerowe podejście zapewnia kilka kluczowych korzyści:

1. **Uproszczone wdrożenie**: Pojedyncze polecenie konfiguruje całą infrastrukturę
2. **Spójne środowisko**: Eliminuje problemy typu „działa na moim komputerze”
3. **Izolowane komponenty**: Każda usługa działa we własnym kontenerze dla bezpieczeństwa
4. **Łatwe aktualizacje**: Proste polecenia do aktualizacji całego stosu
5. **Minimalne zależności**: Wymaga tylko Dockera i Docker Compose

Architektura obejmuje kontenery dla:

* Interfejs webowy do administracji
* Serwer SMTP do poczty wychodzącej
* Serwery IMAP/POP3 do pobierania poczty
* Serwer CalDAV do kalendarzy
* Serwer CardDAV do kontaktów
* Baza danych do przechowywania konfiguracji
* Redis do buforowania i poprawy wydajności
* SQLite do bezpiecznego, szyfrowanego przechowywania skrzynek pocztowych

> \[!NOTE]
> Koniecznie sprawdź nasz [przewodnik dla programistów hostujących samodzielnie](https://forwardemail.net/self-hosted)

### Instalacja skryptu powłoki Bash: dostępność spotyka się z bezpieczeństwem {#bash-script-installation-accessibility-meets-security}

Zaprojektowaliśmy proces instalacji tak, aby był jak najprostszy, przy jednoczesnym zachowaniu najlepszych praktyk bezpieczeństwa:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

To pojedyncze polecenie:

1. Weryfikuje wymagania systemowe
2. Przeprowadza przez proces konfiguracji
3. Konfiguruje rekordy DNS
4. Konfiguruje certyfikaty TLS
5. Wdraża kontenery Docker
6. Przeprowadza wstępne wzmocnienie zabezpieczeń

Dla tych, którzy obawiają się przesyłania skryptów do bash (i słusznie!), zachęcamy do zapoznania się ze skryptem przed jego uruchomieniem. Jest on w pełni open source i dostępny do wglądu.

### Szyfrowanie kwantowe zapewniające prywatność na przyszłość {#quantum-safe-encryption-for-future-proof-privacy}

Podobnie jak nasza usługa hostowana, nasze rozwiązanie hostowane samodzielnie implementuje szyfrowanie odporne na ataki kwantowe, wykorzystując ChaCha20-Poly1305 jako szyfr dla baz danych SQLite. Takie podejście chroni Twoje dane e-mail nie tylko przed obecnymi zagrożeniami, ale także przed przyszłymi atakami wykorzystującymi komputery kwantowe.

Każda skrzynka pocztowa jest przechowywana we własnym zaszyfrowanym pliku bazy danych SQLite, co zapewnia całkowitą izolację użytkowników — jest to znacząca zaleta w zakresie bezpieczeństwa w porównaniu z tradycyjnymi rozwiązaniami wykorzystującymi współdzielone bazy danych.

### Automatyczna konserwacja i aktualizacje {#automated-maintenance-and-updates}

Wbudowaliśmy kompleksowe narzędzia konserwacyjne bezpośrednio w rozwiązanie hostowane samodzielnie:

1. **Automatyczne kopie zapasowe**: Planowane kopie zapasowe wszystkich krytycznych danych
2. **Odnawianie certyfikatów**: Automatyczne zarządzanie certyfikatami Let's Encrypt
3. **Aktualizacje systemu**: Proste polecenie aktualizacji do najnowszej wersji
4. **Monitorowanie stanu**: Wbudowane kontrole zapewniające integralność systemu

Dostęp do tych narzędzi można uzyskać za pomocą prostego interaktywnego menu:

```bash
# script prompt

1. Initial setup
2. Setup Backups
3. Setup Auto Upgrades
4. Renew certificates
5. Restore from Backup
6. Help
7. Exit
```

## Zobowiązanie do otwartego oprogramowania {#the-open-source-commitment}

Nasze samodzielnie hostowane rozwiązanie poczty e-mail, podobnie jak wszystkie nasze produkty, jest w 100% open source – zarówno front-end, jak i back-end. Oznacza to:

1. **Pełna przejrzystość**: Każda linijka kodu przetwarzająca Twoje wiadomości e-mail jest dostępna do publicznej kontroli.
2. **Wkład społeczności**: Każdy może wprowadzać ulepszenia lub naprawiać problemy.
3. **Bezpieczeństwo dzięki otwartości**: Luki w zabezpieczeniach mogą zostać zidentyfikowane i naprawione przez globalną społeczność.
4. **Brak uzależnienia od jednego dostawcy**: Nigdy nie jesteś zależny od istnienia naszej firmy.

Cała baza kodu jest dostępna na GitHub pod adresem <https://github.com/forwardemail/forwardemail.net>.

## Hosting własny a hosting zarządzany: Dokonanie właściwego wyboru {#self-hosted-vs-managed-making-the-right-choice}

Choć z dumą oferujemy opcję samodzielnego hostingu, zdajemy sobie sprawę, że nie jest to odpowiedni wybór dla każdego. Samodzielne hostingowanie poczty e-mail wiąże się z realnymi obowiązkami i wyzwaniami:

### Rzeczywistość samodzielnego hostingu poczty e-mail {#the-reality-of-self-hosting-email}

#### Rozważania techniczne {#technical-considerations}

* **Zarządzanie serwerem**: Będziesz potrzebować serwera VPS lub dedykowanego.
* **Konfiguracja DNS**: Prawidłowa konfiguracja DNS ma kluczowe znaczenie dla dostarczalności.
* **Aktualizacje zabezpieczeń**: Aktualizowanie poprawek bezpieczeństwa jest niezbędne.
* **Zarządzanie spamem**: Będziesz musiał zarządzać filtrowaniem spamu.
* **Strategia tworzenia kopii zapasowych**: Wdrożenie niezawodnych kopii zapasowych to Twoja odpowiedzialność.

#### Inwestycja czasu {#time-investment}

* **Konfiguracja początkowa**: Czas na konfigurację, weryfikację i zapoznanie się z dokumentacją
* **Bieżąca konserwacja**: Sporadyczne aktualizacje i monitorowanie
* **Rozwiązywanie problemów**: Sporadyczny czas na rozwiązywanie problemów

#### Rozważania finansowe {#financial-considerations}

* **Koszty serwera**: 5–20 USD miesięcznie za podstawowy serwer VPS
* **Rejestracja domeny**: 10–20 USD rocznie
* **Wartość czasu**: Twoja inwestycja czasu ma realną wartość

### Kiedy wybrać naszą usługę zarządzaną {#when-to-choose-our-managed-service}

Dla wielu użytkowników nasza usługa zarządzana pozostaje najlepszym wyborem:

1. **Wygoda**: Zajmujemy się całą konserwacją, aktualizacjami i monitorowaniem
2. **Niezawodność**: Korzystaj z naszej sprawdzonej infrastruktury i wiedzy
3. **Wsparcie**: Uzyskaj pomoc w przypadku problemów
4. **Dostarczalność**: Wykorzystaj naszą ugruntowaną reputację w zakresie własności intelektualnej
5. **Opłacalność**: Biorąc pod uwagę koszty, nasza usługa jest często bardziej ekonomiczna

Obie opcje zapewniają takie same korzyści w zakresie prywatności i przejrzystości oprogramowania typu open source — różnica polega jedynie na tym, kto zarządza infrastrukturą.

## Wprowadzenie do samodzielnego przekazywania poczty e-mail {#getting-started-with-self-hosted-forward-email}

Gotowy przejąć kontrolę nad swoją infrastrukturą poczty e-mail? Oto jak zacząć:

### Wymagania systemowe {#system-requirements}

* Ubuntu 20.04 LTS lub nowszy (zalecany)
* Minimum 1 GB pamięci RAM (zalecane 2 GB+)
* Zalecane 20 GB pamięci masowej
* Kontrolowana przez Ciebie nazwa domeny
* Publiczny adres IP z obsługą portu 25
* Możliwość ustawienia [odwrotny PTR](https://www.cloudflare.com/learning/dns/dns-records/dns-ptr-record/)
* Obsługa IPv4 i IPv6

> \[!TIP]
> Polecamy kilku dostawców serwerów pocztowych pod adresem <https://forwardemail.net/blog/docs/best-mail-server-providers> (źródło pod adresem <https://github.com/forwardemail/awesome-mail-server-providers>)

### Kroki instalacji {#installation-steps}

1. **Uruchom skrypt instalacyjny**:
```bash
   bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
   ```

2. **Postępuj zgodnie z instrukcjami interaktywnymi**:
* Wprowadź nazwę swojej domeny
* Skonfiguruj dane logowania administratora
* Skonfiguruj rekordy DNS zgodnie z instrukcjami
* Wybierz preferowane opcje konfiguracji

3. **Weryfikacja instalacji**:
Po zakończeniu instalacji możesz sprawdzić, czy wszystko działa, wykonując następujące czynności:
* Sprawdź status kontenera: `docker ps`
* Wyślij testowy e-mail
* Zaloguj się do interfejsu internetowego

## Przyszłość poczty e-mail hostowanej samodzielnie {#the-future-of-self-hosted-email}

Nasze rozwiązanie z własnym hostingiem to dopiero początek. Zależy nam na ciągłym ulepszaniu tej oferty dzięki:

1. **Rozbudowane narzędzia administracyjne**: Bardziej wydajne zarządzanie przez Internet
2. **Dodatkowe opcje uwierzytelniania**: W tym obsługa sprzętowych kluczy bezpieczeństwa
3. **Zaawansowane monitorowanie**: Lepszy wgląd w stan i wydajność systemu
4. **Wdrożenie wieloserwerowe**: Opcje konfiguracji wysokiej dostępności
5. **Ulepszenia wprowadzane przez społeczność**: Uwzględnianie wkładu użytkowników

## Wniosek: Wolność poczty e-mail dla każdego {#conclusion-email-freedom-for-everyone}

Wprowadzenie na rynek naszego rozwiązania poczty e-mail z własnym hostingiem stanowi ważny krok w realizacji naszej misji, jaką jest dostarczanie transparentnych i zorientowanych na prywatność usług poczty e-mail. Niezależnie od tego, czy wybierzesz naszą usługę zarządzaną, czy opcję samodzielnego hostingu, skorzystasz z naszego niezachwianego zaangażowania w zasady open source i projektowanie z priorytetem prywatności.

Poczta e-mail jest zbyt ważna, by kontrolować ją za pomocą zamkniętych, zastrzeżonych systemów, które priorytetowo traktują gromadzenie danych, a nie prywatność użytkowników. Dzięki samodzielnie hostowanemu rozwiązaniu Forward Email z dumą oferujemy prawdziwą alternatywę – taką, która daje Ci pełną kontrolę nad Twoją komunikacją cyfrową.

Wierzymy, że prywatność to nie tylko zaleta, ale fundamentalne prawo. Dzięki naszej opcji hostingu poczty e-mail sprawiamy, że to prawo jest bardziej dostępne niż kiedykolwiek wcześniej.

Chcesz przejąć kontrolę nad swoją pocztą e-mail? [Zacznij już dziś](https://forwardemail.net/self-hosted) lub zapoznaj się z [Repozytorium GitHub](https://github.com/forwardemail/forwardemail.net), aby dowiedzieć się więcej.

## Odniesienia {#references}

\[1] Przekaż dalej e-mail do repozytorium GitHub: <https://github.com/forwardemail/forwardemail.net>

\[2] Dokumentacja hostowana samodzielnie: <https://forwardemail.net/en/self-hosted>

\[3] Implementacja techniczna prywatności poczty e-mail: <https://forwardemail.net/en/blog/docs/email-privacy-protection-technical-implementation>

\[4] Dlaczego otwarty kod pocztowy ma znaczenie: <https://forwardemail.net/en/blog/docs/why-open-source-email-security-privacy>