# Poczta e-mail hostowana samodzielnie: zobowiązanie do korzystania z oprogramowania typu open source {#self-hosted-email-commitment-to-open-source}

<img loading="lazy" src="/img/articles/self-hosted.webp" alt="" class="rounded-lg" />

## Spis treści {#table-of-contents}

* [Przedmowa](#foreword)
* [Dlaczego poczta e-mail hostowana samodzielnie ma znaczenie](#why-self-hosted-email-matters)
  * [Problem z tradycyjnymi usługami poczty e-mail](#the-problem-with-traditional-email-services)
  * [Alternatywa dla samodzielnego hostingu](#the-self-hosted-alternative)
* [Nasza implementacja z własnym hostingiem: przegląd techniczny](#our-self-hosted-implementation-technical-overview)
  * [Architektura oparta na Dockerze zapewniająca prostotę i przenośność](#docker-based-architecture-for-simplicity-and-portability)
  * [Instalacja skryptu powłoki Bash: dostępność spotyka się z bezpieczeństwem](#bash-script-installation-accessibility-meets-security)
  * [Szyfrowanie kwantowo-bezpieczne dla prywatności odpornej na przyszłość](#quantum-safe-encryption-for-future-proof-privacy)
  * [Automatyczna konserwacja i aktualizacje](#automated-maintenance-and-updates)
* [Zaangażowanie w Open Source](#the-open-source-commitment)
* [Samodzielnie hostowane kontra zarządzane: wybór właściwego rozwiązania](#self-hosted-vs-managed-making-the-right-choice)
  * [Rzeczywistość samodzielnego hostingu poczty e-mail](#the-reality-of-self-hosting-email)
  * [Kiedy wybrać naszą usługę zarządzaną](#when-to-choose-our-managed-service)
* [Pierwsze kroki z funkcją przekazywania poczty e-mail z własnym hostingiem](#getting-started-with-self-hosted-forward-email)
  * [Wymagania systemowe](#system-requirements)
  * [Kroki instalacji](#installation-steps)
* [Przyszłość poczty e-mail hostowanej samodzielnie](#the-future-of-self-hosted-email)
* [Wnioski: Wolność poczty e-mail dla każdego](#conclusion-email-freedom-for-everyone)
* [Odniesienia](#references)

## Przedmowa {#foreword}

W dzisiejszym cyfrowym krajobrazie e-mail pozostaje kręgosłupem naszej tożsamości i komunikacji online. Jednak wraz ze wzrostem obaw o prywatność wielu użytkowników staje przed trudnym wyborem: wygoda kosztem prywatności lub prywatność kosztem wygody. W Forward Email zawsze wierzyliśmy, że nie powinieneś wybierać między tymi dwoma.

Dzisiaj z radością ogłaszamy znaczący kamień milowy w naszej podróży: uruchomienie naszego samodzielnie hostowanego rozwiązania poczty e-mail. Ta funkcja odzwierciedla nasze najgłębsze zaangażowanie w zasady open source, projektowanie zorientowane na prywatność i wzmocnienie pozycji użytkownika. Dzięki naszej samodzielnie hostowanej opcji oddajemy pełną moc i kontrolę nad komunikacją e-mailową bezpośrednio w Twoje ręce.

W tym wpisie na blogu przyjrzymy się filozofii stojącej za naszym samodzielnie hostowanym rozwiązaniem, jego implementacji technicznej oraz temu, dlaczego jest ono ważne dla użytkowników, którzy cenią sobie zarówno prywatność, jak i własność w swojej komunikacji cyfrowej.

## Dlaczego poczta e-mail hostowana samodzielnie ma znaczenie {#why-self-hosted-email-matters}

Nasze rozwiązanie poczty e-mail z własnym hostingiem jest najwyraźniejszym wyrazem naszego przekonania, że prawdziwa prywatność oznacza kontrolę, a kontrola zaczyna się od oprogramowania typu open source. Dla użytkowników, którzy żądają pełnej własności nad swoją komunikacją cyfrową, samodzielne hostowanie nie jest już marginalnym pomysłem — to podstawowe prawo. Jesteśmy dumni, że możemy poprzeć to przekonanie, oferując w pełni otwartą, weryfikowalną platformę, którą możesz prowadzić na własnych warunkach.

### Problem z tradycyjnymi usługami poczty e-mail {#the-problem-with-traditional-email-services}

Tradycyjne usługi poczty elektronicznej stwarzają szereg podstawowych wyzwań dla użytkowników dbających o swoją prywatność:

1. **Wymagania dotyczące zaufania**: Musisz ufać dostawcy, że nie uzyska dostępu, nie przeanalizuje ani nie udostępni Twoich danych
2. **Centralna kontrola**: Twój dostęp może zostać odwołany w dowolnym momencie z dowolnego powodu
3. **Luka w zabezpieczeniach nadzoru**: Scentralizowane usługi są głównymi celami nadzoru
4. **Ograniczona przejrzystość**: Większość usług korzysta z zastrzeżonego, zamkniętego oprogramowania
5. **Uzależnienie od dostawcy**: Migracja z tych usług może być trudna lub niemożliwa

Nawet dostawcy poczty e-mail „skupiający się na prywatności” często zawodzą, udostępniając jedynie swoje aplikacje front-endowe jako open source, a jednocześnie utrzymując swoje systemy back-endowe jako zastrzeżone i zamknięte. Tworzy to znaczną lukę w zaufaniu — musisz uwierzyć w ich obietnice prywatności bez możliwości ich weryfikacji.

### Alternatywa dla hostingu własnego {#the-self-hosted-alternative}

Samodzielne hostowanie poczty e-mail wiąże się z zupełnie innym podejściem:

1. **Pełna kontrola**: Posiadasz i kontrolujesz całą infrastrukturę poczty e-mail
2. **Weryfikowalna prywatność**: Cały system jest przejrzysty i audytowalny
3. **Brak wymogu zaufania**: Nie musisz ufać osobom trzecim w kwestii komunikacji
4. **Swoboda dostosowywania**: Dostosuj system do swoich konkretnych potrzeb
5. **Odporność**: Twoja usługa będzie kontynuowana niezależnie od decyzji jakiejkolwiek firmy

Jak stwierdził jeden z użytkowników: „Samodzielne hostowanie poczty e-mail jest cyfrowym odpowiednikiem uprawy własnego jedzenia — wymaga więcej pracy, ale dokładnie wiem, co się w nim znajduje”.

## Nasza implementacja hostowana samodzielnie: Przegląd techniczny {#our-self-hosted-implementation-technical-overview}

Nasze rozwiązanie poczty e-mail hostowanej samodzielnie opiera się na tych samych zasadach prywatności, które kierują wszystkimi naszymi produktami. Przyjrzyjmy się implementacji technicznej, która to umożliwia.

### Architektura oparta na Dockerze zapewniająca prostotę i przenośność {#docker-based-architecture-for-simplicity-and-portability}

Spakowaliśmy całą naszą infrastrukturę poczty e-mail przy użyciu Dockera, co ułatwia jej wdrożenie w praktycznie każdym systemie opartym na Linuksie. To podejście kontenerowe zapewnia kilka kluczowych korzyści:

1. **Uproszczone wdrażanie**: Pojedyncze polecenie konfiguruje całą infrastrukturę
2. **Spójne środowisko**: Eliminuje problemy „działa na moim komputerze”
3. **Izolowane komponenty**: Każda usługa działa we własnym kontenerze w celu zapewnienia bezpieczeństwa
4. **Łatwe aktualizacje**: Proste polecenia do aktualizacji całego stosu
5. **Minimalne zależności**: Wymaga tylko Dockera i Docker Compose

Architektura obejmuje kontenery dla:

* Interfejs sieciowy do administracji
* Serwer SMTP do poczty wychodzącej
* Serwery IMAP/POP3 do pobierania poczty
* Serwer CalDAV do kalendarzy
* Serwer CardDAV do kontaktów
* Baza danych do przechowywania konfiguracji
* Redis do buforowania i wydajności
* SQLite do bezpiecznego, szyfrowanego przechowywania skrzynek pocztowych

> \[!NOTE]
> Be sure to check out our [self-hosted developer guide](https://forwardemail.net/self-hosted)

### Instalacja skryptu powłoki Bash: dostępność spotyka się z bezpieczeństwem {#bash-script-installation-accessibility-meets-security}

Zaprojektowaliśmy proces instalacji tak, aby był jak najprostszy, przy jednoczesnym zachowaniu najlepszych praktyk bezpieczeństwa:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

To jedno polecenie:

1. Weryfikuje wymagania systemowe
2. Przeprowadza przez konfigurację
3. Konfiguruje rekordy DNS
4. Konfiguruje certyfikaty TLS
5. Wdraża kontenery Docker
6. Wykonuje początkowe wzmocnienie zabezpieczeń

Dla tych, którzy martwią się o przesyłanie skryptów do bash (co jest słuszne!), zachęcamy do przejrzenia skryptu przed wykonaniem. Jest on w pełni open-source i dostępny do wglądu.

### Szyfrowanie kwantowe zapewniające prywatność na przyszłość {#quantum-safe-encryption-for-future-proof-privacy}

Podobnie jak nasza usługa hostowana, nasze rozwiązanie hostowane samodzielnie implementuje szyfrowanie odporne na kwantowe przy użyciu ChaCha20-Poly1305 jako szyfru dla baz danych SQLite. To podejście chroni Twoje dane e-mail nie tylko przed obecnymi zagrożeniami, ale także przed przyszłymi atakami na komputery kwantowe.

Każda skrzynka pocztowa jest przechowywana w osobnym zaszyfrowanym pliku bazy danych SQLite, co zapewnia całkowitą izolację użytkowników — jest to znacząca zaleta w zakresie bezpieczeństwa w porównaniu z tradycyjnymi rozwiązaniami wykorzystującymi współdzielone bazy danych.

### Automatyczna konserwacja i aktualizacje {#automated-maintenance-and-updates}

Wbudowaliśmy kompleksowe narzędzia konserwacyjne bezpośrednio w rozwiązanie hostowane samodzielnie:

1. **Automatyczne kopie zapasowe**: Zaplanowane kopie zapasowe wszystkich krytycznych danych
2. **Odnowienie certyfikatu**: Zautomatyzowane zarządzanie certyfikatami Let's Encrypt
3. **Aktualizacje systemu**: Proste polecenie do aktualizacji do najnowszej wersji
4. **Monitorowanie kondycji**: Wbudowane kontrole w celu zapewnienia integralności systemu

Dostęp do tych narzędzi jest możliwy poprzez proste interaktywne menu:

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

Nasze samodzielnie hostowane rozwiązanie poczty e-mail, podobnie jak wszystkie nasze produkty, jest w 100% open-source — zarówno front-end, jak i back-end. Oznacza to:

1. **Pełna przejrzystość**: Każda linijka kodu przetwarzająca Twoje wiadomości e-mail jest dostępna do publicznej kontroli
2. **Wkład społeczności**: Każdy może wnieść ulepszenia lub naprawić problemy
3. **Bezpieczeństwo dzięki otwartości**: Luki mogą zostać zidentyfikowane i naprawione przez globalną społeczność
4. **Brak uzależnienia od dostawcy**: Nigdy nie jesteś zależny od istnienia naszej firmy

Cała baza kodu jest dostępna na GitHub pod adresem <https://github.com/forwardemail/forwardemail.net>.

## Hosting własny a hosting zarządzany: Dokonanie właściwego wyboru {#self-hosted-vs-managed-making-the-right-choice}

Chociaż jesteśmy dumni, że oferujemy opcję samodzielnego hostowania, zdajemy sobie sprawę, że nie jest to właściwy wybór dla każdego. Samodzielne hostowanie poczty e-mail wiąże się z prawdziwymi obowiązkami i wyzwaniami:

### Rzeczywistość samodzielnego hostingu poczty e-mail {#the-reality-of-self-hosting-email}

#### Rozważania techniczne {#technical-considerations}

* **Zarządzanie serwerem**: Będziesz musiał utrzymywać serwer VPS lub dedykowany
* **Konfiguracja DNS**: Prawidłowa konfiguracja DNS jest krytyczna dla dostarczalności
* **Aktualizacje zabezpieczeń**: Bycie na bieżąco z poprawkami zabezpieczeń jest niezbędne
* **Zarządzanie spamem**: Będziesz musiał poradzić sobie z filtrowaniem spamu
* **Strategia tworzenia kopii zapasowych**: Wdrożenie niezawodnych kopii zapasowych jest Twoją odpowiedzialnością

#### Inwestycja czasu {#time-investment}

* **Konfiguracja początkowa**: Czas na konfigurację, weryfikację i przeczytanie dokumentacji
* **Bieżąca konserwacja**: Okazjonalne aktualizacje i monitorowanie
* **Rozwiązywanie problemów**: Okazjonalny czas na rozwiązywanie problemów

#### Rozważania finansowe {#financial-considerations}

* **Koszty serwera**: 5–20 USD/miesiąc za podstawowy VPS
* **Rejestracja domeny**: 10–20 USD/rok
* **Wartość czasu**: Twoja inwestycja czasu ma realną wartość

### Kiedy wybrać naszą usługę zarządzaną {#when-to-choose-our-managed-service}

Dla wielu użytkowników nasza usługa zarządzana pozostaje najlepszą opcją:

1. **Wygoda**: Zajmujemy się całą konserwacją, aktualizacjami i monitorowaniem
2. **Niezawodność**: Skorzystaj z naszej ugruntowanej infrastruktury i wiedzy
3. **Wsparcie**: Uzyskaj pomoc w przypadku wystąpienia problemów
4. **Dostarczalność**: Wykorzystaj naszą ugruntowaną reputację IP
5. **Opłacalność**: Gdy weźmiesz pod uwagę koszty czasu, nasza usługa jest często bardziej ekonomiczna

Obie opcje zapewniają takie same korzyści w zakresie prywatności i przejrzystości oprogramowania typu open source — różnica polega jedynie na tym, kto zarządza infrastrukturą.

## Rozpoczęcie korzystania z funkcji przekazywania poczty e-mail na własnym hostingu {#getting-started-with-self-hosted-forward-email}

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
> We recommend several mail server providers at <https://forwardemail.net/blog/docs/best-mail-server-providers> (source at <https://github.com/forwardemail/awesome-mail-server-providers>)

### Kroki instalacji {#installation-steps}

1. **Uruchom skrypt instalacyjny**:
```bash
   bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
   ```

2. **Postępuj zgodnie z instrukcjami interaktywnymi**:
* Wprowadź nazwę swojej domeny
* Skonfiguruj dane uwierzytelniające administratora
* Skonfiguruj rekordy DNS zgodnie z instrukcjami
* Wybierz preferowane opcje konfiguracji

3. **Weryfikacja instalacji**:
Po zakończeniu instalacji możesz sprawdzić, czy wszystko działa, wykonując następujące czynności:
* Sprawdzenie statusu kontenera: `docker ps`
* Wysłanie testowego e-maila
* Logowanie do interfejsu internetowego

## Przyszłość poczty e-mail hostowanej samodzielnie {#the-future-of-self-hosted-email}

Nasze rozwiązanie self-hosted to dopiero początek. Jesteśmy zobowiązani do ciągłego ulepszania tej oferty dzięki:

1. **Rozbudowane narzędzia administracyjne**: Bardziej wydajne zarządzanie oparte na sieci Web
2. **Dodatkowe opcje uwierzytelniania**: W tym obsługa kluczy bezpieczeństwa sprzętowego
3. **Zaawansowane monitorowanie**: Lepszy wgląd w stan i wydajność systemu
4. **Wdrożenie na wielu serwerach**: Opcje konfiguracji wysokiej dostępności
5. **Ulepszenia oparte na społeczności**: Włączanie wkładów od użytkowników

## Wnioski: Wolność poczty e-mail dla każdego {#conclusion-email-freedom-for-everyone}

Wprowadzenie naszego samodzielnie hostowanego rozwiązania poczty e-mail stanowi znaczący kamień milowy w naszej misji dostarczania zorientowanych na prywatność, przejrzystych usług poczty e-mail. Niezależnie od tego, czy wybierzesz naszą zarządzaną usługę, czy opcję samodzielnego hostowania, skorzystasz z naszego niezachwianego zaangażowania w zasady open source i projektowanie z priorytetem prywatności.

E-mail jest zbyt ważny, aby kontrolować go za pomocą zamkniętych, zastrzeżonych systemów, które stawiają zbieranie danych ponad prywatność użytkownika. Dzięki samodzielnie hostowanemu rozwiązaniu Forward Email jesteśmy dumni, że możemy zaoferować prawdziwą alternatywę — taką, która daje Ci pełną kontrolę nad Twoją komunikacją cyfrową.

Wierzymy, że prywatność to nie tylko cecha; to podstawowe prawo. A dzięki naszej opcji poczty e-mail hostowanej samodzielnie sprawiamy, że to prawo jest bardziej dostępne niż kiedykolwiek wcześniej.

Chcesz przejąć kontrolę nad swoją pocztą e-mail? [Zacznij już dziś](https://forwardemail.net/self-hosted) lub zapoznaj się z naszą ofertą [Repozytorium GitHub](https://github.com/forwardemail/forwardemail.net), aby dowiedzieć się więcej.

## Odniesienia {#references}

\[1] Przekaż dalej e-mail do repozytorium GitHub: <https://github.com/forwardemail/forwardemail.net>

\[2] Dokumentacja hostowana samodzielnie: <https://forwardemail.net/en/self-hosted>

\[3] Implementacja techniczna prywatności poczty e-mail: <https://forwardemail.net/en/blog/docs/email-privacy-protection-technical-implementation>

\[4] Dlaczego poczta e-mail typu open source ma znaczenie: <https://forwardemail.net/en/blog/docs/why-open-source-email-security-privacy>