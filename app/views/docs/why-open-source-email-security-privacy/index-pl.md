# Dlaczego poczta e-mail typu open source to przyszłość: zaleta przesyłania dalej wiadomości e-mail {#why-open-source-email-is-the-future-the-forward-email-advantage}

<img loading="lazy" src="/img/articles/open-source.webp" alt="" class="rounded-lg" />

## Spis treści {#table-of-contents}

* [Przedmowa](#foreword)
* [Zaleta Open Source: coś więcej niż tylko marketing](#the-open-source-advantage-more-than-just-marketing)
  * [Co oznacza prawdziwe oprogramowanie typu Open Source](#what-true-open-source-means)
  * [Problem zaplecza: gdzie większość usług poczty e-mail typu „open source” zawodzi](#the-backend-problem-where-most-open-source-email-services-fall-short)
* [Przekaż dalej e-mail: 100% Open Source, Front-end I Back-end](#forward-email-100-open-source-frontend-and-backend)
  * [Nasze wyjątkowe podejście techniczne](#our-unique-technical-approach)
* [Opcja samodzielnego hostingu: wolność wyboru](#the-self-hosting-option-freedom-of-choice)
  * [Dlaczego wspieramy samodzielne hostingi](#why-we-support-self-hosting)
  * [Rzeczywistość samodzielnego hostingu poczty e-mail](#the-reality-of-self-hosting-email)
* [Dlaczego nasza płatna usługa ma sens (mimo że jest to oprogramowanie typu open source)](#why-our-paid-service-makes-sense-even-though-were-open-source)
  * [Porównanie kosztów](#cost-comparison)
  * [Najlepsze z obu światów](#the-best-of-both-worlds)
* [Oszustwo o zamkniętym źródle: czego Proton i Tutanota ci nie powiedzą](#the-closed-source-deception-what-proton-and-tutanota-dont-tell-you)
  * [Twierdzenia o otwartym kodzie źródłowym Proton Mail](#proton-mails-open-source-claims)
  * [Podobne podejście Tutanota](#tutanotas-similar-approach)
  * [Debata na temat przewodników prywatności](#the-privacy-guides-debate)
* [Przyszłość to Open Source](#the-future-is-open-source)
  * [Dlaczego Open Source wygrywa](#why-open-source-is-winning)
* [Przełączanie na przekazywanie wiadomości e-mail](#making-the-switch-to-forward-email)
* [Wnioski: poczta e-mail typu open source dla prywatnej przyszłości](#conclusion-open-source-email-for-a-private-future)

## Przedmowa {#foreword}

W czasach, gdy obawy dotyczące prywatności cyfrowej są na najwyższym poziomie, usługi poczty e-mail, które wybieramy, mają większe znaczenie niż kiedykolwiek. Podczas gdy wielu dostawców twierdzi, że priorytetowo traktuje Twoją prywatność, istnieje zasadnicza różnica między tymi, którzy po prostu mówią o prywatności, a tymi, którzy naprawdę to robią. W Forward Email zbudowaliśmy naszą usługę na fundamencie całkowitej przejrzystości dzięki rozwojowi open source — nie tylko w naszych aplikacjach front-end, ale w całej naszej infrastrukturze.

W tym wpisie na blogu wyjaśniamy, dlaczego rozwiązania poczty e-mail typu open source są lepsze od alternatyw o zamkniętym kodzie źródłowym, w jaki sposób nasze podejście różni się od podejścia konkurencji, takiej jak Proton Mail i Tutanota, oraz dlaczego — pomimo naszego zaangażowania w opcje samodzielnego hostingu — nasza płatna usługa oferuje najlepszą wartość dla większości użytkowników.

## Zaleta oprogramowania typu open source: coś więcej niż tylko marketing {#the-open-source-advantage-more-than-just-marketing}

Termin „open source” stał się popularnym marketingowym słowem kluczowym w ostatnich latach, a globalny rynek usług open source ma według prognoz rosnąć w tempie CAGR przekraczającym 16% w latach 2024–2032\[^1]. Ale co oznacza bycie prawdziwie open source i dlaczego ma to znaczenie dla prywatności Twojej poczty e-mail?

### Co oznacza prawdziwe oprogramowanie typu open source {#what-true-open-source-means}

Oprogramowanie open-source udostępnia cały swój kod źródłowy każdemu do inspekcji, modyfikacji i ulepszania. Ta przejrzystość tworzy środowisko, w którym:

* Luki w zabezpieczeniach mogą być identyfikowane i naprawiane przez globalną społeczność programistów
* Roszczenia dotyczące prywatności mogą być weryfikowane poprzez niezależny przegląd kodu
* Użytkownicy nie są zamknięci w zastrzeżonych ekosystemach
* Innowacje następują szybciej dzięki wspólnym udoskonaleniom

Jeśli chodzi o pocztę e-mail — podstawę Twojej tożsamości online — taka przejrzystość nie jest tylko czymś przyjemnym; jest ona niezbędna dla zapewnienia prawdziwej prywatności i bezpieczeństwa.

### Problem z zapleczem: gdzie większość usług poczty e-mail typu „open source” zawodzi {#the-backend-problem-where-most-open-source-email-services-fall-short}

Tutaj robi się ciekawie. Wielu popularnych dostawców poczty e-mail „nastawionych na prywatność” reklamuje się jako open-source, ale istnieje zasadnicza różnica, której, jak mają nadzieję, nie zauważysz: **udostępniają open-source tylko swoje front-endy, a back-endy trzymają zamknięte**.

Co to oznacza? Frontend to to, co widzisz i z czym wchodzisz w interakcję — interfejs sieciowy lub aplikacja mobilna. Backend to miejsce, w którym odbywa się faktyczne przetwarzanie wiadomości e-mail — gdzie Twoje wiadomości są przechowywane, szyfrowane i przesyłane. Kiedy dostawca utrzymuje swoje backend jako zamknięte źródło:

1. Nie możesz zweryfikować, w jaki sposób Twoje wiadomości e-mail są faktycznie przetwarzane
2. Nie możesz potwierdzić, czy ich oświadczenia dotyczące prywatności są uzasadnione
3. Ufasz oświadczeniom marketingowym, a nie weryfikowalnemu kodowi
4. Luki w zabezpieczeniach mogą pozostać ukryte przed publiczną kontrolą

Jak podkreślono w dyskusjach na forach Privacy Guides, zarówno Proton Mail, jak i Tutanota twierdzą, że są open-source, ale ich back-endy pozostają zamknięte i zastrzeżone\[^2]. Tworzy to znaczną lukę zaufania — musisz uwierzyć w ich obietnice prywatności bez możliwości ich weryfikacji.

## Przekaż dalej wiadomość e-mail: 100% Open Source, front-end I back-end {#forward-email-100-open-source-frontend-and-backend}

W Forward Email przyjęliśmy zupełnie inne podejście. Cały nasz kod źródłowy – zarówno front-end, jak i back-end – jest dostępny na licencji open source i każdy może go sprawdzić pod adresem <https://github.com/forwardemail/forwardemail.net>.

Oznacza to:

1. **Całkowita przejrzystość**: Każda linijka kodu przetwarzająca Twoje wiadomości e-mail jest dostępna do publicznej kontroli.
2. **Weryfikowalna prywatność**: Nasze oświadczenia dotyczące prywatności nie są gadką marketingową — to weryfikowalne fakty, które każdy może potwierdzić, badając nasz kod.
3. **Bezpieczeństwo oparte na społeczności**: Nasze bezpieczeństwo jest wzmocnione przez zbiorową wiedzę specjalistyczną globalnej społeczności programistów.
4. **Brak ukrytej funkcjonalności**: To, co widzisz, to to, co dostajesz — bez ukrytego śledzenia, bez tajnych tylnych furtek.

### Nasze wyjątkowe podejście techniczne {#our-unique-technical-approach}

Nasze zaangażowanie w ochronę prywatności wykracza poza bycie open-source. Wdrożyliśmy kilka innowacji technicznych, które nas wyróżniają:

#### Indywidualnie szyfrowane skrzynki pocztowe SQLite {#individually-encrypted-sqlite-mailboxes}

W przeciwieństwie do tradycyjnych dostawców poczty e-mail, którzy korzystają ze współdzielonych baz danych relacyjnych (gdzie pojedyncze naruszenie mogłoby ujawnić dane wszystkich użytkowników), my używamy indywidualnie zaszyfrowanych plików SQLite dla każdej skrzynki pocztowej. Oznacza to:

* Każda skrzynka pocztowa jest osobnym zaszyfrowanym plikiem
* Dostęp do danych jednego użytkownika nie daje dostępu innym
* Nawet nasi pracownicy nie mogą uzyskać dostępu do Twoich danych — to podstawowa decyzja projektowa

Jak wyjaśniliśmy w dyskusjach na temat Przewodników po prywatności:

> „Współdzielone relacyjne bazy danych (np. MongoDB, SQL Server, PostgreSQL, Oracle, MySQL itd.) wymagają logowania (z nazwą użytkownika/hasłem) w celu nawiązania połączenia z bazą danych. Oznacza to, że każdy, kto ma to hasło, może zapytać bazę danych o cokolwiek. Czy to będzie nieuczciwy pracownik, czy atak złej pokojówki. Oznacza to również, że dostęp do danych jednego użytkownika oznacza również dostęp do danych wszystkich innych. Z drugiej strony, SQLite można uznać za współdzieloną bazę danych, ale sposób, w jaki jej używamy (każda skrzynka pocztowa = indywidualny plik SQLite), sprawia, że jest ona piaskownicą”.\[^3]

#### Szyfrowanie odporne na kwantowe {#quantum-resistant-encryption}

Podczas gdy inni dostawcy wciąż nadrabiają zaległości, my wdrożyliśmy już metody szyfrowania odporne na ataki kwantowe, aby zabezpieczyć prywatność Twojej poczty e-mail przed nowymi zagrożeniami ze strony komputerów kwantowych.

#### Brak zależności od stron trzecich {#no-third-party-dependencies}

W przeciwieństwie do konkurentów, którzy polegają na usługach takich jak Amazon SES w zakresie dostarczania wiadomości e-mail, zbudowaliśmy całą infrastrukturę wewnętrznie. Eliminuje to potencjalne wycieki prywatności za pośrednictwem usług stron trzecich i daje nam pełną kontrolę nad całym procesem przesyłania wiadomości e-mail.

## Opcja samodzielnego hostingu: swoboda wyboru {#the-self-hosting-option-freedom-of-choice}

Jednym z najpotężniejszych aspektów oprogramowania open-source jest swoboda, jaką zapewnia. Dzięki Forward Email nigdy nie jesteś zamknięty — możesz samodzielnie hostować całą naszą platformę, jeśli chcesz.

### Dlaczego wspieramy hosting własny {#why-we-support-self-hosting}

Wierzymy w dawanie użytkownikom pełnej kontroli nad ich danymi. Dlatego uczyniliśmy całą naszą platformę samowystarczalną z kompleksową dokumentacją i przewodnikami konfiguracji. To podejście:

* Zapewnia maksymalną kontrolę użytkownikom o zacięciu technicznym
* Eliminuje potrzebę zaufania nam jako dostawcy usług
* Umożliwia dostosowanie do konkretnych wymagań
* Zapewnia, że usługa może być kontynuowana, nawet jeśli nasza firma nie

### Rzeczywistość samodzielnego hostingu poczty e-mail {#the-reality-of-self-hosting-email}

Chociaż samodzielne hostingowanie jest świetną opcją, ważne jest, aby zrozumieć, jakie są rzeczywiste koszty:

#### Koszty finansowe {#financial-costs}

* Koszty VPS lub serwera: 5–50 USD/miesiąc za podstawową konfigurację\[^4]
* Rejestracja i odnawianie domeny: 10–20 USD/rok
* Certyfikaty SSL (choć Let's Encrypt oferuje bezpłatne opcje)
* Potencjalne koszty usług monitorowania i rozwiązań tworzenia kopii zapasowych

#### Koszty czasu {#time-costs}

* Konfiguracja początkowa: Kilka godzin do kilku dni, w zależności od wiedzy technicznej
* Bieżąca konserwacja: 5-10 godzin miesięcznie na aktualizacje, poprawki zabezpieczeń i rozwiązywanie problemów\[^5]
* Krzywa uczenia się: Zrozumienie protokołów poczty e-mail, najlepszych praktyk bezpieczeństwa i administrowania serwerem

#### Wyzwania techniczne {#technical-challenges}

* Problemy z dostarczalnością wiadomości e-mail (wiadomości oznaczane jako spam)
* Nadążanie za zmieniającymi się standardami bezpieczeństwa
* Zapewnienie wysokiej dostępności i niezawodności
* Skuteczne zarządzanie filtrowaniem spamu

Jak powiedział jeden doświadczony hoster: „E-mail jest usługą towarową... Tańsze jest hostowanie poczty u \[dostawcy] niż wydawanie pieniędzy *i* czasu na samodzielne hostowanie”.\[^6]

## Dlaczego nasza płatna usługa ma sens (mimo że jest to oprogramowanie typu open source) {#why-our-paid-service-makes-sense-even-though-were-open-source}

Biorąc pod uwagę wyzwania związane z hostingiem własnym, nasza płatna usługa oferuje to, co najlepsze z obu światów: przejrzystość i bezpieczeństwo oprogramowania typu open source oraz wygodę i niezawodność usługi zarządzanej.

### Porównanie kosztów {#cost-comparison}

Biorąc pod uwagę koszty finansowe i czasowe, nasza płatna usługa oferuje wyjątkową wartość:

* **Całkowity koszt samodzielnego hostingu**: 56–252 USD/miesiąc (w tym koszty serwera i wycena czasu)
* **Płatne plany Forward Email**: 3–9 USD/miesiąc

Nasza płatna usługa zapewnia:

* Profesjonalne zarządzanie i konserwacja
* Ugruntowana reputacja IP dla lepszej dostarczalności
* Regularne aktualizacje zabezpieczeń i monitorowanie
* Wsparcie w przypadku wystąpienia problemów
* Wszystkie korzyści prywatności naszego podejścia open-source

### Najlepsze z obu światów {#the-best-of-both-worlds}

Wybierając opcję Przekaż dalej e-mail, otrzymujesz:

1. **Weryfikowalna prywatność**: Nasza baza kodu open source oznacza, że możesz zaufać naszym zapewnieniom o prywatności
2. **Profesjonalne zarządzanie**: Nie musisz stawać się ekspertem od serwerów e-mail
3. **Opłacalność**: Niższy całkowity koszt niż w przypadku samodzielnego hostingu
4. **Wolność od blokady**: Opcja samodzielnego hostingu zawsze pozostaje dostępna

## Oszustwo zamkniętego źródła: czego Proton i Tutanota ci nie powiedzą {#the-closed-source-deception-what-proton-and-tutanota-dont-tell-you}

Przyjrzyjmy się bliżej, czym nasze podejście różni się od podejścia popularnych dostawców poczty e-mail, którzy „nastawiają się na prywatność”.

### Twierdzenia o otwartym kodzie źródłowym Proton Mail {#proton-mails-open-source-claims}

Proton Mail reklamuje się jako open-source, ale dotyczy to tylko ich aplikacji front-end. Ich back-end — gdzie Twoje wiadomości e-mail są faktycznie przetwarzane i przechowywane — pozostaje zamkniętym kodem źródłowym\[^7]. Oznacza to:

* Nie możesz sprawdzić, jak obsługiwane są Twoje wiadomości e-mail
* Musisz zaufać ich zapewnieniom o prywatności bez weryfikacji
* Luki w zabezpieczeniach ich zaplecza pozostają ukryte przed publiczną kontrolą
* Jesteś zamknięty w ich ekosystemie bez opcji samodzielnego hostingu

### Podobne podejście Tutanota {#tutanotas-similar-approach}

Podobnie jak Proton Mail, Tutanota udostępnia tylko swój front-end jako open-source, a swój back-end jako zastrzeżony\[^8]. Mają te same problemy z zaufaniem:

* Brak możliwości weryfikacji oświadczeń o prywatności zaplecza
* Ograniczona przejrzystość rzeczywistego przetwarzania wiadomości e-mail
* Potencjalne problemy z bezpieczeństwem ukryte przed opinią publiczną
* Uzależnienie od dostawcy bez opcji samodzielnego hostingu

### Debata na temat przewodników dotyczących prywatności {#the-privacy-guides-debate}

Te ograniczenia nie pozostały niezauważone w społeczności prywatności. W dyskusjach na temat przewodników prywatności podkreśliliśmy tę krytyczną różnicę:

> „Stwierdza, że zarówno Protonmail, jak i Tuta są zamkniętymi źródłami. Ponieważ ich zaplecze jest rzeczywiście zamknięte.”\[^9]

Stwierdziliśmy również:

> „Nie przeprowadzono żadnych publicznie udostępnionych audytów infrastruktury zaplecza żadnego z obecnie wymienionych dostawców usług poczty e-mail PG ani nie udostępniono żadnych fragmentów kodu źródłowego dotyczącego sposobu przetwarzania poczty przychodzącej”.\[^10]

Ten brak przejrzystości stwarza fundamentalny problem zaufania. Bez back-endów open-source użytkownicy są zmuszeni przyjmować oświadczenia o prywatności na wiarę, a nie na weryfikację.

## Przyszłość to oprogramowanie typu open source {#the-future-is-open-source}

Trend w kierunku rozwiązań open-source przyspiesza w całym przemyśle oprogramowania. Według ostatnich badań:

* Rynek oprogramowania typu open source rośnie z 41,83 miliardów dolarów w 2024 r. do 48,92 miliardów dolarów w 2025 r.\[^11]
* 80% firm zgłasza wzrost wykorzystania oprogramowania typu open source w ciągu ostatniego roku\[^12]
* Przewiduje się, że adopcja oprogramowania typu open source będzie nadal szybko się rozwijać

Ten wzrost odzwierciedla fundamentalną zmianę w sposobie myślenia o bezpieczeństwie oprogramowania i prywatności. W miarę jak użytkownicy stają się bardziej świadomi prywatności, zapotrzebowanie na weryfikowalną prywatność za pośrednictwem rozwiązań typu open source będzie tylko rosło.

### Dlaczego Open Source wygrywa {#why-open-source-is-winning}

Zalety oprogramowania typu open source stają się coraz bardziej oczywiste:

1. **Bezpieczeństwo dzięki przejrzystości**: Kod open-source może być sprawdzany przez tysiące ekspertów, a nie tylko przez wewnętrzny zespół
2. **Szybsza innowacja**: Współpraca przy rozwoju przyspiesza udoskonalanie
3. **Zaufanie dzięki weryfikacji**: Roszczenia można weryfikować, a nie przyjmować na wiarę
4. **Wolność od uzależnienia od dostawcy**: Użytkownicy zachowują kontrolę nad swoimi danymi i usługami
5. **Wsparcie społeczności**: Globalna społeczność pomaga identyfikować i rozwiązywać problemy

## Przełączanie na przekazywanie wiadomości e-mail {#making-the-switch-to-forward-email}

Przejście na usługę Forward Email jest proste, niezależnie od tego, czy korzystasz z usług popularnego dostawcy, takiego jak Gmail, czy innej usługi nastawionej na prywatność, takiej jak Proton Mail lub Tutanota.

Nasze usługi oferują:

* Nieograniczona liczba domen i aliasów
* Obsługa standardowych protokołów (SMTP, IMAP, POP3) bez zastrzeżonych mostów
* Bezproblemowa integracja z istniejącymi klientami poczty e-mail
* Prosty proces konfiguracji z kompleksową dokumentacją
* Przystępne plany cenowe zaczynające się już od 3 USD/miesiąc

## Wnioski: Otwarta poczta e-mail dla prywatnej przyszłości {#conclusion-open-source-email-for-a-private-future}

W świecie, w którym prywatność cyfrowa jest coraz bardziej zagrożona, przejrzystość rozwiązań open-source zapewnia kluczową ochronę. W Forward Email jesteśmy dumni, że jesteśmy liderami dzięki naszemu w pełni open-source'owemu podejściu do prywatności poczty e-mail.

W przeciwieństwie do konkurentów, którzy tylko częściowo przyjmują open-source, udostępniliśmy całą naszą platformę — front-end i back-end — do publicznej kontroli. To zobowiązanie do przejrzystości, w połączeniu z naszym innowacyjnym podejściem technicznym, zapewnia poziom weryfikowalnej prywatności, którego alternatywy z zamkniętym kodem źródłowym po prostu nie mogą dorównać.

Niezależnie od tego, czy zdecydujesz się na korzystanie z naszych usług zarządzanych, czy na samodzielny hosting naszej platformy, możesz liczyć na bezpieczeństwo, prywatność i spokój ducha, jakie daje prawdziwie open source'owa poczta e-mail.

Przyszłość poczty e-mail jest otwarta, przejrzysta i skupiona na prywatności. Przyszłość to Forward Email.

\[^1]: SNS Insider. „Rynek usług Open Source był wyceniany na 28,6 mld USD w 2023 r. i do 2032 r. osiągnie wartość 114,8 mld USD, rosnąc w tempie CAGR na poziomie 16,70% do 2032 r.” [Raport o wielkości i analizie rynku usług Open Source 2032](https://www.snsinsider.com/reports/open-source-services-market-3322)

\[^2]: Społeczność przewodników po prywatności. „Przekaż dalej e-mail (dostawca poczty e-mail) – Rozwój witryny / Sugestie dotyczące narzędzi”. [Dyskusja na temat przewodników prywatności](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^3]: Społeczność przewodników po prywatności. „Przekaż dalej e-mail (dostawca poczty e-mail) – Rozwój witryny / Sugestie dotyczące narzędzi”. [Dyskusja na temat przewodników prywatności](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^4]: RunCloud. „Generalnie, za podstawowy wirtualny serwer prywatny (VPS) do obsługi serwera poczty e-mail można zapłacić od 5 do 50 dolarów miesięcznie”. [10 najlepszych samodzielnie hostowanych platform serwerów pocztowych do wykorzystania w 2025 r.](https://runcloud.io/blog/best-self-hosted-email-server)

\[^5]: Forum Mail-in-a-Box. „Konserwacja zajęła mi w tym czasie może 16 godzin...” [Samodzielny serwer pocztowy jest źle widziany](https://discourse.mailinabox.email/t/self-hosting-mail-server-frowned-upon/4143)

\[^6]: Reddit r/selfhosted. „TL:DR: Ponieważ wszystko jest hostowane samodzielnie, BĘDZIE TO WYMAGAŁO TWOJEGO CZASU. Jeśli nie masz na to czasu, zawsze lepiej pozostać przy hostingu…” [Samodzielne hostowanie serwera poczty e-mail? Dlaczego lub dlaczego nie? Co jest popularne?](https://www.reddit.com/r/selfhosted/comments/1etb8jh/selfhosting_an_email_server_why_or_why_not_whats/)

\[^7]: Przekaż dalej e-mail. „Proton Mail twierdzi, że jest open source, ale ich back-end w rzeczywistości jest zamknięty.” [Porównanie Tutanota i Proton Mail (2025)](https://forwardemail.net/blog/tutanota-vs-proton-mail-email-service-comparison)

\[^8]: Przekaż dalej e-mail. „Tutanota twierdzi, że jest open source, ale ich back-end jest w rzeczywistości zamknięty”. [Porównanie Proton Mail i Tutanota (2025)](https://forwardemail.net/blog/proton-mail-vs-tutanota-email-service-comparison)

\[^9]: Społeczność przewodników po prywatności. „Stwierdzono, że zarówno Protonmail, jak i Tuta są oprogramowaniem o zamkniętym kodzie źródłowym. Ponieważ ich zaplecze rzeczywiście jest oprogramowaniem o zamkniętym kodzie źródłowym”. [Przekaż dalej e-mail (dostawca poczty e-mail) - Rozwój witryny / Sugestie dotyczące narzędzi](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^10]: Społeczność przewodników po prywatności. „Nie przeprowadzono żadnych publicznie udostępnionych audytów infrastruktury zaplecza żadnego z obecnie wymienionych dostawców usług poczty e-mail PG ani nie udostępniono żadnych fragmentów kodu źródłowego opisujących sposób przetwarzania przez nich poczty przychodzącej”. [Przekaż dalej e-mail (dostawca poczty e-mail) - Rozwój witryny / Sugestie dotyczące narzędzi](https://discuss.privacyguides.net/t/forward-email-email-provider/13370?page=9)

\[^11]: IBM. „Rynek oprogramowania open source wzrośnie z 41,83 mld USD w 2024 r. do 48,92 mld USD w 2025 r.” [Czym jest oprogramowanie Open Source?](https://www.ibm.com/think/topics/open-source)

\[^12]: PingCAP. „Biorąc pod uwagę, że 80% firm zgłosiło wzrost wykorzystania technologii open source w ciągu ostatniego roku, to...” [Nowe trendy w społecznościach Open Source 2024](https://www.pingcap.com/article/emerging-trends-open-source-communities-2024/)