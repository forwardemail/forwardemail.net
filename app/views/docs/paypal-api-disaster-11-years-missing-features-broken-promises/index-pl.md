# 11-letnia katastrofa API PayPal: jak tworzyliśmy obejścia, podczas gdy oni ignorowali deweloperów {#paypals-11-year-api-disaster-how-we-built-workarounds-while-they-ignored-developers}

> \[!NOTE]
> **Sukces! PayPal w końcu dodał endpoint `GET /v1/billing/subscriptions`.**
>
> Po opublikowaniu tego wpisu i wysłaniu go do kierownictwa PayPal, ich zespoły wdrożyły długo oczekiwany endpoint do listowania subskrypcji. Zmiana pojawiła się gdzieś pomiędzy [25 czerwca 2025](https://web.archive.org/web/20250625121019/https://developer.paypal.com/docs/api/subscriptions/v1/) a [9 lipca 2025](https://web.archive.org/web/20250709102200/https://developer.paypal.com/docs/api/subscriptions/v1/).
>
> Jednak w prawdziwym stylu PayPal nigdy nas o tym nie powiadomili. O tej aktualizacji dowiedzieliśmy się sami dopiero w grudniu 2025, miesiące po cichym wdrożeniu funkcji.

<img loading="lazy" src="/img/articles/pypl-disaster.webp" alt="PayPal API disaster illustration" class="rounded-lg" />

<p class="lead mt-3">W Forward Email od ponad dekady zmagamy się z niedziałającymi API PayPal. To, co zaczęło się jako drobne frustracje, przerodziło się w kompletną katastrofę, która zmusiła nas do tworzenia własnych obejść, blokowania ich szablonów phishingowych i ostatecznie wstrzymania wszystkich płatności PayPal podczas krytycznej migracji konta.</p>
<p class="lead mt-3">To historia 11 lat ignorowania podstawowych potrzeb deweloperów przez PayPal, podczas gdy my robiliśmy wszystko, by ich platforma działała.</p>


## Spis treści {#table-of-contents}

* [Brakujący element: brak możliwości listowania subskrypcji](#the-missing-piece-no-way-to-list-subscriptions)
* [2014-2017: pojawienie się problemu](#2014-2017-the-problem-emerges)
* [2020: przekazujemy im obszerne uwagi](#2020-we-give-them-extensive-feedback)
  * [Lista 27 punktów uwag](#the-27-item-feedback-list)
  * [Zaangażowanie zespołów, złożone obietnice](#teams-got-involved-promises-were-made)
  * [Efekt? Nic.](#the-result-nothing)
* [Odejście kadry zarządzającej: jak PayPal stracił całą pamięć instytucjonalną](#the-executive-exodus-how-paypal-lost-all-institutional-memory)
* [2025: nowe kierownictwo, te same problemy](#2025-new-leadership-same-problems)
  * [Nowy CEO angażuje się](#the-new-ceo-gets-involved)
  * [Odpowiedź Michelle Gill](#michelle-gills-response)
  * [Nasza odpowiedź: koniec spotkań](#our-response-no-more-meetings)
  * [Przesadna odpowiedź Marty’ego Brodbecka](#marty-brodbecks-overengineering-response)
  * [Sprzeczność „proste CRUD”](#the-simple-crud-contradiction)
  * [Rozłączenie staje się jasne](#the-disconnect-becomes-clear)
* [Lata ignorowanych zgłoszeń błędów](#years-of-bug-reports-they-ignored)
  * [2016: wczesne skargi na UI/UX](#2016-early-uiux-complaints)
  * [2021: zgłoszenie błędu dotyczącego firmowego e-maila](#2021-business-email-bug-report)
  * [2021: sugestie ulepszeń UI](#2021-ui-improvement-suggestions)
  * [2021: awarie środowiska sandbox](#2021-sandbox-environment-failures)
  * [2021: system raportów całkowicie zepsuty](#2021-reports-system-completely-broken)
  * [2022: brakująca funkcja API podstawowego (znowu)](#2022-core-api-feature-missing-again)
* [Koszmar doświadczenia dewelopera](#the-developer-experience-nightmare)
  * [Zepsuty interfejs użytkownika](#broken-user-interface)
  * [Problemy z SDK](#sdk-problems)
  * [Naruszenia polityki bezpieczeństwa treści](#content-security-policy-violations)
  * [Chaos w dokumentacji](#documentation-chaos)
  * [Luki bezpieczeństwa](#security-vulnerabilities)
  * [Katastrofa zarządzania sesją](#session-management-disaster)
* [Lipiec 2025: ostatnia kropla](#july-2025-the-final-straw)
* [Dlaczego nie możemy po prostu zrezygnować z PayPal](#why-we-cant-just-drop-paypal)
* [Społecznościowe obejście](#the-community-workaround)
* [Blokowanie szablonów PayPal z powodu phishingu](#blocking-paypal-templates-due-to-phishing)
  * [Prawdziwy problem: szablony PayPal wyglądają jak oszustwa](#the-real-problem-paypals-templates-look-like-scams)
  * [Nasza implementacja](#our-implementation)
  * [Dlaczego musieliśmy zablokować PayPal](#why-we-had-to-block-paypal)
  * [Skala problemu](#the-scale-of-the-problem)
  * [Ironia](#the-irony)
  * [Realny wpływ: nowe oszustwa PayPal](#real-world-impact-novel-paypal-scams)
* [Odwrócony proces KYC PayPal](#paypals-backwards-kyc-process)
  * [Jak to powinno działać](#how-it-should-work)
  * [Jak PayPal faktycznie działa](#how-paypal-actually-works)
  * [Realny wpływ](#the-real-world-impact)
  * [Katastrofa migracji konta w lipcu 2025](#the-july-2025-account-migration-disaster)
  * [Dlaczego to ma znaczenie](#why-this-matters)
* [Jak robią to poprawnie inni dostawcy płatności](#how-every-other-payment-processor-does-it-right)
  * [Stripe](#stripe)
  * [Paddle](#paddle)
  * [Coinbase Commerce](#coinbase-commerce)
  * [Square](#square)
  * [Standard branżowy](#the-industry-standard)
  * [Co oferują inni dostawcy vs PayPal](#what-other-processors-provide-vs-paypal)
* [Systematyczne tuszowanie PayPal: uciszanie 6 milionów głosów](#paypals-systematic-cover-up-silencing-6-million-voices)
  * [Wielkie wymazanie](#the-great-erasure)
  * [Ratunek zewnętrzny](#the-third-party-rescue)
* [11-letnia katastrofa błędu przechwytywania: 1899 USD i rośnie](#the-11-year-capture-bug-disaster-1899-and-counting)
  * [Strata Forward Email 1899 USD](#forward-emails-1899-loss)
  * [Oryginalny raport z 2013: ponad 11 lat zaniedbań](#the-2013-original-report-11-years-of-negligence)
  * [Przyznanie z 2016: PayPal psuje własne SDK](#the-2016-admission-paypal-breaks-their-own-sdk)
  * [Eskalcja z 2024: nadal zepsute](#the-2024-escalation-still-broken)
  * [Katastrofa niezawodności webhooków](#the-webhook-reliability-disaster)
  * [Wzorzec systematycznego zaniedbania](#the-pattern-of-systematic-negligence)
  * [Niedokumentowany wymóg](#the-undocumented-requirement)
* [Szerszy wzorzec oszustw PayPal](#paypals-broader-pattern-of-deception)
  * [Działania Departamentu Usług Finansowych Nowego Jorku](#the-new-york-department-of-financial-services-action)
  * [Pozew Honey: przepisywanie linków afiliacyjnych](#the-honey-lawsuit-rewriting-affiliate-links)
  * [Koszt zaniedbań PayPal](#the-cost-of-paypals-negligence)
  * [Kłamstwo w dokumentacji](#the-documentation-lie)
* [Co to oznacza dla deweloperów](#what-this-means-for-developers)
## Brakujący element: brak możliwości wyświetlenia listy subskrypcji {#the-missing-piece-no-way-to-list-subscriptions}

Oto rzecz, która nas zaskakuje: PayPal oferuje rozliczenia subskrypcyjne od 2014 roku, ale nigdy nie udostępnili sprzedawcom sposobu na wyświetlenie własnych subskrypcji.

Pomyśl o tym przez chwilę. Możesz tworzyć subskrypcje, możesz je anulować, jeśli masz ID, ale nie możesz uzyskać listy wszystkich aktywnych subskrypcji na swoim koncie. To jak baza danych bez zapytania SELECT.

Potrzebujemy tego do podstawowych operacji biznesowych:

* Obsługa klienta (gdy ktoś pisze z pytaniem o swoją subskrypcję)
* Raportowanie finansowe i uzgadnianie
* Automatyczne zarządzanie rozliczeniami
* Zgodność i audyt

A PayPal? Oni po prostu... nigdy tego nie zbudowali.


## 2014-2017: Problem się pojawia {#2014-2017-the-problem-emerges}

Problem z listowaniem subskrypcji pojawił się po raz pierwszy na forach społeczności PayPal w 2017 roku. Programiści zadawali oczywiste pytanie: „Jak uzyskać listę wszystkich moich subskrypcji?”

Odpowiedź PayPal? Cisza.

Członkowie społeczności zaczęli się frustrować:

> „Bardzo dziwne pominięcie, jeśli sprzedawca nie może wyświetlić wszystkich aktywnych umów. Jeśli ID umowy zostanie utracone, oznacza to, że tylko użytkownik może anulować lub zawiesić umowę.” - leafspider

> „+1. Minęły prawie 3 lata.” - laudukang (co oznacza, że problem istniał od około 2014)

[Oryginalny post społecznościowy](https://web.archive.org/web/20201019142512/https://www.paypal-community.com/t5/REST-API-SDK/List-all-subscriptions/td-p/1147066) z 2017 roku pokazuje, jak programiści błagali o tę podstawową funkcjonalność. Odpowiedzią PayPal było zarchiwizowanie repozytorium, w którym zgłaszano problem.


## 2020: Dajemy im obszerne informacje zwrotne {#2020-we-give-them-extensive-feedback}

W październiku 2020 PayPal skontaktował się z nami na formalną sesję informacji zwrotnej. To nie była zwykła rozmowa – zorganizowali 45-minutowe spotkanie na Microsoft Teams z 8 dyrektorami PayPal, w tym Sri Shivanandą (CTO), Edwinem Aoki, Jimem Magats, Johnem Kunze i innymi.

### Lista 27 punktów informacji zwrotnej {#the-27-item-feedback-list}

Byliśmy przygotowani. Po 6 godzinach prób integracji z ich API, sporządziliśmy listę 27 konkretnych problemów. Mark Stuart z zespołu PayPal Checkout powiedział:

> Hej Nick, dzięki za podzielenie się z wszystkimi dzisiaj! Myślę, że to będzie katalizatorem, by uzyskać więcej wsparcia i inwestycji dla naszego zespołu, aby naprawić te rzeczy. Trudno było uzyskać tak bogate informacje zwrotne, jak te, które nam przekazałeś.

Informacje zwrotne nie były teoretyczne – pochodziły z rzeczywistych prób integracji:

1. **Generowanie tokena dostępu nie działa**:

> Generowanie tokena dostępu nie działa. Powinno być więcej niż tylko przykłady cURL.

2. **Brak interfejsu webowego do tworzenia subskrypcji**:

> Jak do diabła można tworzyć subskrypcje bez użycia cURL? Nie wydaje się, żeby istniał interfejs webowy do tego (jak ma Stripe)

Mark Stuart uznał problem z tokenem dostępu za szczególnie niepokojący:

> Zazwyczaj nie słyszymy o problemach z generowaniem tokena dostępu.

### Zaangażowanie zespołów, złożone obietnice {#teams-got-involved-promises-were-made}

W miarę odkrywania kolejnych problemów, PayPal dodawał do rozmowy kolejne zespoły. Darshan Raju z zespołu zarządzającego UI subskrypcji dołączył i powiedział:

> Uznajemy tę lukę. Będziemy ją śledzić i rozwiązywać. Jeszcze raz dzięki za Twoją opinię!

Sesja została opisana jako:

> szczere przejście przez Twoje doświadczenia

aby:

> uczynić PayPal tym, czym powinien być dla programistów.

### Efekt? Nic. {#the-result-nothing}

Pomimo formalnej sesji informacji zwrotnej, obszernej listy 27 punktów, zaangażowania wielu zespołów i obietnic:

> śledzenia i rozwiązywania

problemów, absolutnie nic nie zostało naprawione.


## Exodus kadry zarządzającej: jak PayPal stracił całą pamięć instytucjonalną {#the-executive-exodus-how-paypal-lost-all-institutional-memory}

Tu robi się naprawdę ciekawie. Każda osoba, która otrzymała naszą opinię z 2020 roku, opuściła PayPal:

**Zmiany w kierownictwie:**

* [Dan Schulman (CEO przez 9 lat) → Alex Chriss](https://www.fastcompany.com/90938418/paypal-ceo-alex-chriss-dan-schulman-what-to-know/) (wrzesień 2023)
* [Sri Shivananda (CTO, który organizował feedback) → JPMorgan Chase](https://www.pymnts.com/personnel/2024/jpmorgan-names-paypal-vet-shivananda-as-new-tech-chief/) (styczeń 2024)
**Liderzy Techniczni, Którzy Składali Obietnice, a Potem Odeszli:**

* **Mark Stuart** (obiecał, że feedback będzie "katalizatorem") → [Obecnie w Ripple](https://www.linkedin.com/in/markstuartsf)
* **Jim Magats** (18-letni weteran PayPal) → [CEO MX](https://www.cnbc.com/2022/07/28/paypal-veteran-jim-magats-is-named-ceo-of-mx-the-startup-that-connects-banks-and-fintech-players.html) (2022)
* **John Kunze** (VP Global Consumer Product) → [Na emeryturze](https://www.linkedin.com/in/john-kunze-5724a86) (2023)
* **Edwin Aoki** (jeden z ostatnich pozostających) → [Właśnie odszedł do Nasdaq](https://www.linkedin.com/posts/edwinaoki_apparently-i-just-cant-stay-awaythe-day-activity-7289388518487793664-j8OZ) (styczeń 2025)

PayPal stał się obrotowymi drzwiami, gdzie menedżerowie zbierają opinie od deweloperów, składają obietnice, a potem odchodzą do lepszych firm, takich jak JPMorgan, Ripple i inne fintechy.

To wyjaśnia, dlaczego odpowiedź na zgłoszenie na GitHub w 2025 roku wydawała się całkowicie oderwana od naszych opinii z 2020 roku – dosłownie wszyscy, którzy otrzymali te opinie, opuścili PayPal.


## 2025: Nowe Kierownictwo, Te Same Problemy {#2025-new-leadership-same-problems}

Przenieśmy się do 2025 roku, gdzie pojawia się dokładnie ten sam schemat. Po latach braku postępów, nowe kierownictwo PayPal ponownie się z nami kontaktuje.

### Nowy CEO Angażuje Się {#the-new-ceo-gets-involved}

30 czerwca 2025 roku zwróciliśmy się bezpośrednio do nowego CEO PayPal, Alexa Chrissa. Jego odpowiedź była krótka:

> Cześć Nick – Dziękuję za kontakt i feedback. Michelle (w kopii) jest odpowiedzialna wraz ze swoim zespołem za zaangażowanie i rozwiązanie tego z Tobą. Dzięki -A

### Odpowiedź Michelle Gill {#michelle-gills-response}

Michelle Gill, EVP i General Manager ds. Małych Firm i Usług Finansowych, odpowiedziała:

> Bardzo dziękuję Nick, przenoszę Alexa do ukrytej kopii. Pracujemy nad tym od Twojego wcześniejszego wpisu. Zadzwonimy do Ciebie przed końcem tygodnia. Proszę, prześlij mi swoje dane kontaktowe, aby jeden z moich kolegów mógł się z Tobą skontaktować. Michelle

### Nasza Odpowiedź: Koniec Spotkań {#our-response-no-more-meetings}

Odmówiliśmy kolejnego spotkania, wyjaśniając naszą frustrację:

> Dziękuję. Jednak nie czuję, że rozmowa telefoniczna cokolwiek zmieni. Oto dlaczego... Brałem udział w rozmowie w przeszłości i nic z tego nie wynikło. Straciłem ponad 2 godziny na rozmowy z całym zespołem i kierownictwem i nic się nie zmieniło... Mnóstwo maili w obie strony. Absolutnie nic nie zostało zrobione. Feedback nie poszedł nigdzie. Próbowałem przez lata, by mnie wysłuchano, a potem nic się nie działo.

### Przesadna Odpowiedź Marty'ego Brodbecka {#marty-brodbecks-overengineering-response}

Następnie skontaktował się Marty Brodbeck, który kieruje działem inżynierii konsumenckiej w PayPal:

> Cześć Nick, tu Marty Brodbeck. Kieruję całym działem inżynierii konsumenckiej w PayPal i prowadzę rozwój API dla firmy. Czy możemy się połączyć, aby omówić problem, z którym się zmagasz, i jak możemy pomóc?

Gdy wyjaśniliśmy prostą potrzebę endpointu do listowania subskrypcji, jego odpowiedź ujawniła dokładny problem:

> Dzięki Nick, jesteśmy w trakcie tworzenia pojedynczego API subskrypcji z pełnym SDK (obsługuje pełne zarządzanie błędami, śledzenie subskrypcji oparte na zdarzeniach, solidną dostępność), gdzie rozliczenia są również wydzielone jako osobne API dla sprzedawców, aby nie musieli orkiestracji między wieloma endpointami, by uzyskać pojedynczą odpowiedź.

To dokładnie niewłaściwe podejście. Nie potrzebujemy miesięcy skomplikowanej architektury. Potrzebujemy jednego prostego endpointu REST, który wyświetla subskrypcje – coś, co powinno istnieć od 2014 roku.

```http
GET /v1/billing/subscriptions
Authorization: Bearer {access_token}
```

### Sprzeczność "Prostego CRUD" {#the-simple-crud-contradiction}

Gdy zwróciliśmy uwagę, że to podstawowa funkcjonalność CRUD, która powinna istnieć od 2014 roku, odpowiedź Marty'ego była wymowna:

> Proste operacje CRUD są częścią podstawowego API, mój przyjacielu, więc nie zajmie to miesięcy rozwoju

SDK PayPal w TypeScript, które obecnie obsługuje tylko trzy endpointy po miesiącach pracy, wraz z jego historycznym harmonogramem, jasno pokazuje, że takie projekty wymagają więcej niż kilku miesięcy na ukończenie.
Ta odpowiedź pokazuje, że nie rozumie własnego API. Jeśli „proste operacje CRUD są częścią podstawowego API”, to gdzie jest punkt końcowy do listowania subskrypcji? Odpowiedzieliśmy:

> Jeśli „proste operacje CRUD są częścią podstawowego API”, to gdzie jest punkt końcowy do listowania subskrypcji? Programiści proszą o tę „prostą operację CRUD” od 2014 roku. Minęło 11 lat. Każdy inny procesor płatności miał tę podstawową funkcjonalność od pierwszego dnia.

### Rozłączenie staje się jasne {#the-disconnect-becomes-clear}

Wymiany z 2025 roku z Alexem Chriss, Michelle Gill i Martym Brodbeckiem pokazują tę samą dysfunkcję organizacyjną:

1. **Nowe kierownictwo nie zna wcześniejszych sesji feedbacku**
2. **Proponują te same nadmiernie skomplikowane rozwiązania**
3. **Nie rozumieją ograniczeń własnego API**
4. **Chcą więcej spotkań zamiast po prostu naprawić problem**

Ten schemat wyjaśnia, dlaczego zespoły PayPal w 2025 roku wydają się całkowicie odłączone od obszernego feedbacku przekazanego w 2020 roku – osoby, które otrzymały ten feedback, odeszły, a nowe kierownictwo powtarza te same błędy.


## Lata zgłoszeń błędów, które zignorowali {#years-of-bug-reports-they-ignored}

Nie tylko narzekaliśmy na brakujące funkcje. Aktywnie zgłaszaliśmy błędy i próbowaliśmy pomóc im się poprawić. Oto kompleksowa oś czasu udokumentowanych przez nas problemów:

### 2016: Wczesne skargi na UI/UX {#2016-early-uiux-complaints}

Już w 2016 roku publicznie zwracaliśmy się do kierownictwa PayPal, w tym Dana Schulmana, w sprawie problemów z interfejsem i użytecznością. To było 9 lat temu, a te same problemy z UI/UX utrzymują się do dziś.

### 2021: Zgłoszenie błędu dotyczącego e-maila biznesowego {#2021-business-email-bug-report}

W marcu 2021 zgłosiliśmy, że system e-mail biznesowy PayPal wysyłał niepoprawne powiadomienia o anulowaniu. Szablon e-maila miał błędnie renderowane zmienne, pokazując klientom mylące komunikaty.

Mark Stuart potwierdził problem:

> Dzięki Nick! Przechodzimy na BCC. @Prasy, czy Twój zespół jest odpowiedzialny za ten e-mail lub wie, kto jest? „Niftylettuce, LLC, nie będziemy już Cię obciążać” sugeruje, że jest pomyłka w adresacie i treści e-maila.

**Rezultat**: Naprawdę to naprawili! Mark Stuart potwierdził:

> Właśnie usłyszałem od zespołu powiadomień, że szablon e-maila został naprawiony i wdrożony. Doceniam, że się zgłosiłeś. Dziękuję!

To pokazuje, że POTRAFIĄ naprawiać rzeczy, gdy chcą – po prostu wybierają, by tego nie robić w większości przypadków.

### 2021: Sugestie ulepszeń UI {#2021-ui-improvement-suggestions}

W lutym 2021 przekazaliśmy szczegółowy feedback dotyczący ich interfejsu pulpitu, a konkretnie sekcji „Ostatnia aktywność PayPal”:

> Uważam, że pulpit na paypal.com, a szczególnie „Ostatnia aktywność PayPal”, wymaga ulepszeń. Nie powinno się pokazywać statusów „Utworzono” dla płatności cyklicznych o wartości 0 USD – to tylko dodaje mnóstwo dodatkowych linii i nie można łatwo na pierwszy rzut oka zobaczyć, ile dochodu generuje dzień/ostatnie dni.

Mark Stuart przekazał to do zespołu produktów konsumenckich:

> Dzięki! Nie jestem pewien, który zespół odpowiada za Aktywność, ale przekazałem to szefowi produktów konsumenckich, by znalazł właściwy zespół. Płatność cykliczna o wartości 0,00 USD wydaje się błędem. Powinna być prawdopodobnie odfiltrowana.

**Rezultat**: Nigdy nie naprawione. UI nadal pokazuje te bezużyteczne wpisy o wartości 0 USD.

### 2021: Problemy ze środowiskiem sandbox {#2021-sandbox-environment-failures}

W listopadzie 2021 zgłosiliśmy krytyczne problemy ze środowiskiem sandbox PayPal:

* Sekretne klucze API sandbox były losowo zmieniane i wyłączane
* Wszystkie konta testowe sandbox zostały usunięte bez powiadomienia
* Komunikaty o błędach przy próbie przeglądania szczegółów kont sandbox
* Przerywane błędy ładowania

> Z jakiegoś powodu mój sekret klucza API sandbox został zmieniony i wyłączony. Wszystkie moje stare konta testowe Sandbox zostały też usunięte.

> Czasami się ładują, a czasami nie. To jest niesamowicie frustrujące.

**Rezultat**: Brak odpowiedzi, brak naprawy. Programiści nadal mają problemy z niezawodnością sandboxa.

### 2021: System raportów całkowicie zepsuty {#2021-reports-system-completely-broken}
W maju 2021 roku zgłosiliśmy, że system pobierania raportów transakcji PayPala był całkowicie zepsuty:

> Wygląda na to, że pobieranie raportów nie działa teraz i nie działało przez cały dzień. Powinni też chyba wysyłać powiadomienie e-mail, jeśli się nie uda.

Wskazaliśmy również katastrofę w zarządzaniu sesją:

> Również jeśli jesteś nieaktywny podczas zalogowania do PayPala przez około 5 minut, zostajesz wylogowany. Więc kiedy odświeżasz przycisk obok raportu, którego status chcesz sprawdzić (po tym jak czekasz wieczność), to jest uciążliwe, że musisz się znowu zalogować.

Mark Stuart potwierdził problem z wygaśnięciem sesji:

> Pamiętam, że zgłaszałeś to wcześniej, że twoja sesja często wygasała i zakłócała twój proces rozwoju, gdy przełączałeś się między IDE a developer.paypal.com lub panelem sprzedawcy, a potem wracałeś i byłeś znowu wylogowany.

**Wynik**: Czas wygaśnięcia sesji nadal wynosi 60 sekund. System raportów nadal regularnie zawodzi.

### 2022: Brakująca funkcja podstawowego API (znowu) {#2022-core-api-feature-missing-again}

W styczniu 2022 ponownie eskalowaliśmy problem z listowaniem subskrypcji, tym razem z jeszcze większą ilością szczegółów o tym, jak ich dokumentacja była błędna:

> Nie ma GET, który listowałby wszystkie subskrypcje (wcześniej nazywane umowami rozliczeniowymi)

Odkryliśmy, że ich oficjalna dokumentacja była całkowicie nieprawdziwa:

> Dokumentacja API jest również całkowicie nieścisła. Myśleliśmy, że możemy obejść problem, pobierając na sztywno zakodowaną listę ID subskrypcji. Ale to nawet nie działa!

> Z oficjalnej dokumentacji tutaj... Mówi, że możesz to zrobić... Ale jest haczyk – nie ma nigdzie pola "Subscription ID", które można by zaznaczyć.

Christina Monti z PayPala odpowiedziała:

> Przepraszamy za frustracje spowodowane tymi błędnymi krokami, naprawimy to w tym tygodniu.

Sri Shivananda (CTO) podziękował nam:

> Dziękujemy za ciągłą pomoc w ulepszaniu nas. Bardzo doceniamy.

**Wynik**: Dokumentacja nigdy nie została poprawiona. Punkt końcowy do listowania subskrypcji nigdy nie został utworzony.


## Koszmar doświadczenia dewelopera {#the-developer-experience-nightmare}

Praca z API PayPala to jak cofnięcie się w czasie o 10 lat. Oto techniczne problemy, które udokumentowaliśmy:

### Zepsuty interfejs użytkownika {#broken-user-interface}

Panel deweloperski PayPala to katastrofa. Oto z czym się codziennie zmagamy:

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Interfejs PayPala jest tak zepsuty, że nie da się nawet zamknąć powiadomień
  </div></figcaption>
  <video class="lazyframe-bordered" loading="lazy" controls>
    <source src="/img/articles/pypl-notifications.mp4" type="video/mp4">
    Twoja przeglądarka nie obsługuje tagu wideo.
  </video>
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Panel deweloperski dosłownie zmusza cię do przesuwania suwaka, a potem wylogowuje po 60 sekundach
  </div></figcaption>
  <video class="lazyframe-bordered" loading="lazy" controls>
    <source src="/img/articles/pypl-kapture-1.mp4" type="video/mp4">
    Twoja przeglądarka nie obsługuje tagu wideo.
  </video>
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Kolejne katastrofy UI w interfejsie deweloperskim PayPala pokazujące zepsute przepływy pracy
  </div></figcaption>
  <video class="lazyframe-bordered" loading="lazy" controls>
    <source src="/img/articles/pypl-kapture-2.mp4" type="video/mp4">
    Twoja przeglądarka nie obsługuje tagu wideo.
  </video>
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Interfejs zarządzania subskrypcjami – interfejs jest tak zły, że musieliśmy polegać na kodzie do generowania produktów i planów subskrypcji
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-subscriptions.png" alt="Zrzut ekranu subskrypcji PayPala" class="rounded-lg" />
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Widok zepsutego interfejsu subskrypcji z brakującą funkcjonalnością (nie można łatwo tworzyć produktów/planów/subskrypcji – i wydaje się, że nie ma w ogóle sposobu na usunięcie produktów ani planów po ich utworzeniu w UI)
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-subscriptions-2.png" alt="Zrzut ekranu subskrypcji PayPala 2" class="rounded-lg" />
</figure>
<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Typowe komunikaty o błędach PayPal - zagmatwane i niepomocne
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-errors.png" alt="PayPal API error screenshot" class="rounded-lg" />
</figure>

### Problemy z SDK {#sdk-problems}

* Nie radzi sobie jednocześnie z płatnościami jednorazowymi i subskrypcjami bez skomplikowanych obejść polegających na zamianie i ponownym renderowaniu przycisków podczas ponownego ładowania SDK za pomocą tagów skryptów
* JavaScript SDK łamie podstawowe konwencje (nazwy klas z małych liter, brak sprawdzania instancji)
* Komunikaty o błędach nie wskazują, których pól brakuje
* Niespójne typy danych (wymagające kwot w formie łańcuchów znaków zamiast liczb)

### Naruszenia polityki bezpieczeństwa treści {#content-security-policy-violations}

Ich SDK wymaga unsafe-inline i unsafe-eval w Twojej CSP, **zmuszając Cię do kompromisu w kwestii bezpieczeństwa Twojej strony**.

### Chaos w dokumentacji {#documentation-chaos}

Sam Mark Stuart przyznał:

> Zgadzam się, że jest absurdalna ilość starych i nowych API. Naprawdę trudno znaleźć to, czego się szuka (nawet dla nas, którzy tu pracujemy).

### Luki w zabezpieczeniach {#security-vulnerabilities}

**Implementacja 2FA PayPal jest odwrotna**. Nawet z włączonymi aplikacjami TOTP, wymuszają weryfikację SMS - co naraża konta na ataki typu SIM swap. Jeśli masz włączone TOTP, powinno być używane wyłącznie. Zapasowym sposobem powinien być e-mail, a nie SMS.

### Katastrofa zarządzania sesją {#session-management-disaster}

**Ich panel deweloperski wylogowuje Cię po 60 sekundach bezczynności**. Próbuj robić cokolwiek produktywnego, a ciągle przechodzisz przez: logowanie → captcha → 2FA → wylogowanie → powtórz. Korzystasz z VPN? Powodzenia.

## Lipiec 2025: Ostatnia kropla {#july-2025-the-final-straw}

Po 11 latach tych samych problemów, punkt krytyczny nastąpił podczas rutynowej migracji konta. Musieliśmy przejść na nowe konto PayPal, aby dopasować je do nazwy naszej firmy "Forward Email LLC" dla czytelniejszej księgowości.

To, co miało być proste, zamieniło się w kompletną katastrofę:

* Początkowe testy pokazały, że wszystko działa poprawnie
* Kilka godzin później PayPal nagle zablokował wszystkie płatności subskrypcyjne bez powiadomienia
* Klienci nie mogli płacić, co powodowało zamieszanie i obciążenie wsparcia
* Wsparcie PayPal udzielało sprzecznych odpowiedzi twierdząc, że konta są zweryfikowane
* Zostaliśmy zmuszeni do całkowitego wstrzymania płatności PayPal

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Błąd, który widzieli klienci podczas próby zapłaty - brak wyjaśnień, brak logów, nic
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-something-went-wrong.png" alt="PayPal something went wrong error" class="rounded-lg" />
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Wsparcie PayPal twierdzące, że wszystko jest w porządku, podczas gdy płatności były całkowicie zepsute. Ostatnia wiadomość pokazuje, że „przywrócili niektóre funkcje”, ale nadal proszą o więcej nieokreślonych informacji - klasyczne przedstawienie wsparcia PayPal
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-help-center-1.png" alt="PayPal help center screenshot 1" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-help-center-2.png" alt="PayPal help center screenshot 2" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-help-center-3.png" alt="PayPal help center screenshot 3" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-help-center-4.png" alt="PayPal help center screenshot 4" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-help-center-5.png" alt="PayPal help center screenshot 5" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-help-center-6.png" alt="PayPal help center screenshot 6" class="rounded-lg" />
</figure>

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Proces weryfikacji tożsamości, który rzekomo „nic nie naprawił”
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-take-care-1.png" alt="PayPal take care screenshot 1" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-take-care-2.png" alt="PayPal take care screenshot 2" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-take-care-3.png" alt="PayPal take care screenshot 3" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-take-care-4.png" alt="PayPal take care screenshot 4" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-take-care-5.png" alt="PayPal take care screenshot 5" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-take-care-6.png" alt="PayPal take care screenshot 6" class="rounded-lg" />
  <img loading="lazy" src="/img/articles/pypl-take-care-7.png" alt="PayPal take care screenshot 7" class="rounded-lg" />
</figure>
<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Niejasna wiadomość i nadal brak rozwiązania. Zero informacji, powiadomień ani wskazówek, jakie dodatkowe informacje są potrzebne. Obsługa klienta milczy.
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-restored.png" alt="PayPal restored screenshot" class="rounded-lg" />
</figure>


## Dlaczego nie możemy po prostu zrezygnować z PayPal {#why-we-cant-just-drop-paypal}

Pomimo wszystkich tych problemów, nie możemy całkowicie zrezygnować z PayPal, ponieważ niektórzy klienci mają tylko PayPal jako opcję płatności. Jak powiedział jeden z klientów na naszej [stronie statusu](https://github.com/forwardemail/status.forwardemail.net/issues/1658#issuecomment-3026530515):

> PayPal jest moją jedyną opcją płatności

**Jesteśmy zmuszeni wspierać uszkodzoną platformę, ponieważ PayPal stworzył monopol płatniczy dla niektórych użytkowników.**


## Społecznościowe obejście problemu {#the-community-workaround}

Ponieważ PayPal nie udostępnia podstawowej funkcjonalności listowania subskrypcji, społeczność deweloperów stworzyła obejścia. Stworzyliśmy skrypt, który pomaga zarządzać subskrypcjami PayPal: [set-active-pypl-subscription-ids.js](https://github.com/forwardemail/forwardemail.net/blob/master/scripts/set-active-pypl-subscription-ids.js)

Ten skrypt odwołuje się do [społecznościowego gista](https://gist.github.com/titanism/955f0c21d53e8c98068c549fb79e75d4), gdzie deweloperzy dzielą się rozwiązaniami. Użytkownicy faktycznie [dziękują nam](https://gist.github.com/titanism/955f0c21d53e8c98068c549fb79e75d4?permalink_comment_id=5045775#gistcomment-5045775) za dostarczenie tego, co PayPal powinien był stworzyć lata temu.


## Blokowanie szablonów PayPal z powodu phishingu {#blocking-paypal-templates-due-to-phishing}

Problemy wykraczają poza API. Szablony mailowe PayPal są tak źle zaprojektowane, że musieliśmy wdrożyć specjalne filtrowanie w naszej usłudze e-mail, ponieważ są one nie do odróżnienia od prób phishingu.

### Prawdziwy problem: szablony PayPal wyglądają jak oszustwa {#the-real-problem-paypals-templates-look-like-scams}

Regularnie otrzymujemy zgłoszenia maili od PayPal, które wyglądają dokładnie jak próby phishingu. Oto rzeczywisty przykład z naszych raportów nadużyć:

**Temat:** `[Sandbox] TEST - New invoice from PaypalBilling434567 sandbox #A4D369E8-0001`

Ten e-mail został przesłany na `abuse@microsoft.com`, ponieważ wyglądał na próbę phishingu. Problem? Pochodził faktycznie ze środowiska testowego PayPal, ale ich projekt szablonu jest tak słaby, że wywołuje systemy wykrywania phishingu.

### Nasza implementacja {#our-implementation}

Możesz zobaczyć nasze specyficzne filtrowanie PayPal zaimplementowane w naszym [kodzie filtrowania e-maili](https://github.com/forwardemail/forwardemail.net/blob/3b45c70391b5b572b2568749d71be3f7198cd995/helpers/is-arbitrary.js#L151-L172):

```javascript
// check for paypal scam (very strict until PayPal resolves phishing on their end)
// (seems to only come from "outlook.com" and "paypal.com" hosts)
//
// X-Email-Type-Id = RT000238
// PPC001017
// RT000542 = gift message hack
// RT002947 = paypal invoice spam
// <https://www.bleepingcomputer.com/news/security/beware-paypal-new-address-fraud/>
//
if (
  session.originalFromAddressRootDomain === 'paypal.com' &&
  headers.hasHeader('x-email-type-id') &&
  ['PPC001017', 'RT000238', 'RT000542', 'RT002947'].includes(
    headers.getFirst('x-email-type-id')
  )
) {
  const err = new SMTPError(
    'Due to ongoing PayPal invoice spam, you must manually send an invoice link'
  );
  err.isCodeBug = true; // alert admins for inspection
  throw err;
}
```

### Dlaczego musieliśmy zablokować PayPal {#why-we-had-to-block-paypal}

Wdrożyliśmy to, ponieważ PayPal odmówił naprawy ogromnych problemów ze spamem/phishingiem/oszustwami pomimo naszych wielokrotnych zgłoszeń do ich zespołów ds. nadużyć. Konkretne typy maili, które blokujemy, to:

* **RT000238** - Podejrzane powiadomienia o fakturach
* **PPC001017** - Problemowe potwierdzenia płatności
* **RT000542** - Próby włamań związane z wiadomościami prezentowymi

### Skala problemu {#the-scale-of-the-problem}

Nasze logi filtrowania spamu pokazują ogromną ilość spamu z fakturami PayPal, którą przetwarzamy codziennie. Przykłady zablokowanych tematów to:

* "Invoice from PayPal Billing Team:- This charge will be auto-debited from your account. Please contact us immediately at \[PHONE]"
* "Invoice from \[COMPANY NAME] (\[ORDER-ID])"
* Wiele wariantów z różnymi numerami telefonów i fałszywymi numerami zamówień
Te e-maile często pochodzą z hostów `outlook.com`, ale wydają się pochodzić z legalnych systemów PayPala, co czyni je szczególnie niebezpiecznymi. E-maile przechodzą uwierzytelnianie SPF, DKIM i DMARC, ponieważ są wysyłane przez rzeczywistą infrastrukturę PayPala.

Nasze dzienniki techniczne pokazują, że te spamowe e-maile zawierają prawidłowe nagłówki PayPala:

* `X-Email-Type-Id: RT000238` (ten sam identyfikator, który blokujemy)
* `From: "service@paypal.com" <service@paypal.com>`
* Ważne podpisy DKIM z `paypal.com`
* Poprawne rekordy SPF wskazujące na serwery pocztowe PayPala

Tworzy to niemożliwą sytuację: legalne e-maile PayPala i spam mają identyczne cechy techniczne.

### Ironia {#the-irony}

PayPal, firma, która powinna przewodzić walce z oszustwami finansowymi, ma szablony e-maili tak źle zaprojektowane, że wywołują systemy antyphishingowe. Jesteśmy zmuszeni blokować legalne e-maile PayPala, ponieważ nie da się ich odróżnić od oszustw.

Jest to udokumentowane w badaniach bezpieczeństwa: [Uwaga na nowe oszustwo z adresem PayPal](https://www.bleepingcomputer.com/news/security/beware-paypal-new-address-feature-abused-to-send-phishing-emails/) – pokazujące, jak systemy PayPala są wykorzystywane do oszustw.

### Rzeczywisty wpływ: Nowatorskie oszustwa PayPal {#real-world-impact-novel-paypal-scams}

Problem wykracza poza słabe projektowanie szablonów. System faktur PayPala jest tak łatwo wykorzystywany, że oszuści regularnie nadużywają go do wysyłania wyglądających na legalne fałszywych faktur. Badacz bezpieczeństwa Gavin Anderegg opisał [Nowatorskie oszustwo PayPal](https://anderegg.ca/2023/02/01/a-novel-paypal-scam), gdzie oszuści wysyłają prawdziwe faktury PayPala, które przechodzą wszystkie kontrole uwierzytelniania:

> „Analizując źródło, e-mail wyglądał, jakby faktycznie pochodził z PayPala (SPF, DKIM i DMARC zostały pomyślnie zweryfikowane). Przycisk również prowadził do adresu URL wyglądającego na legalny PayPal... Zajęło mi chwilę, by zorientować się, że to był prawdziwy e-mail. Właśnie dostałem losową 'fakturę' od oszusta.”

<figure>
  <figcaption><div class="alert alert-danger small text-center">
  Zrzut ekranu pokazujący wiele fałszywych faktur PayPal zalewających skrzynkę odbiorczą, wszystkie wyglądające na legalne, ponieważ faktycznie pochodzą z systemów PayPala
  </div></figcaption>
  <img loading="lazy" src="/img/articles/pypl-paypal-scam.png" alt="Zrzut ekranu ostrzeżenia o oszustwie PayPal" class="rounded-lg" />
</figure>

Badacz zauważył:

> „Wygląda to też na funkcję ułatwiającą, którą PayPal powinien rozważyć zablokować. Natychmiast założyłem, że to jakiś rodzaj oszustwa i interesowały mnie tylko szczegóły techniczne. Wydaje się to zbyt łatwe do wykonania i obawiam się, że inni mogą się na to nabrać.”

To doskonale ilustruje problem: własne legalne systemy PayPala są tak źle zaprojektowane, że umożliwiają oszustwa, jednocześnie sprawiając, że legalne komunikaty wyglądają podejrzanie.

Co gorsza, wpłynęło to na naszą dostarczalność w Yahoo, co skutkowało skargami klientów oraz godzinami skrupulatnych testów i analiz wzorców.


## Cofnięty proces KYC PayPala {#paypals-backwards-kyc-process}

Jednym z najbardziej frustrujących aspektów platformy PayPal jest ich cofnięte podejście do zgodności i procedur Know Your Customer (KYC). W przeciwieństwie do każdego innego procesora płatności, PayPal pozwala deweloperom integrować swoje API i zaczynać pobieranie płatności w środowisku produkcyjnym przed ukończeniem właściwej weryfikacji.

### Jak to powinno działać {#how-it-should-work}

Każdy legalny procesor płatności stosuje tę logiczną sekwencję:

1. **Najpierw ukończyć weryfikację KYC**
2. **Zatwierdzić konto sprzedawcy**
3. **Zapewnić dostęp do produkcyjnego API**
4. **Pozwolić na pobieranie płatności**

Chroni to zarówno procesora płatności, jak i sprzedawcę, zapewniając zgodność przed przekazaniem pieniędzy.

### Jak PayPal faktycznie działa {#how-paypal-actually-works}

Proces PayPala jest całkowicie odwrócony:

1. **Natychmiast zapewnia dostęp do produkcyjnego API**
2. **Pozwala na pobieranie płatności przez godziny lub dni**
3. **Nagle blokuje płatności bez powiadomienia**
4. **Żąda dokumentacji KYC po tym, jak klienci już zostali dotknięci**
5. **Nie powiadamia sprzedawcy**
6. **Pozwala klientom odkryć problem i zgłosić go**
### Rzeczywisty wpływ na świat biznesu {#the-real-world-impact}

Ten odwrócony proces powoduje katastrofy dla firm:

* **Klienci nie mogą dokończyć zakupów** w okresach szczytowej sprzedaży
* **Brak wcześniejszego ostrzeżenia**, że wymagana jest weryfikacja
* **Brak powiadomień e-mail** gdy płatności są blokowane
* **Sprzedawcy dowiadują się o problemach od zdezorientowanych klientów**
* **Utrata przychodów** w krytycznych okresach działalności
* **Utrata zaufania klientów** gdy płatności tajemniczo nie przechodzą

### Katastrofa migracji kont w lipcu 2025 {#the-july-2025-account-migration-disaster}

Ten dokładny scenariusz miał miejsce podczas naszej rutynowej migracji kont w lipcu 2025. PayPal początkowo pozwalał na realizację płatności, a następnie nagle je blokował bez żadnego powiadomienia. Problem odkryliśmy dopiero, gdy klienci zaczęli zgłaszać, że nie mogą zapłacić.

Gdy kontaktowaliśmy się z pomocą techniczną, otrzymywaliśmy sprzeczne odpowiedzi dotyczące wymaganej dokumentacji, bez jasnego terminu rozwiązania. Zmuszeni byliśmy całkowicie wstrzymać płatności PayPal, co dezorientowało klientów, którzy nie mieli innych opcji płatności.

### Dlaczego to ma znaczenie {#why-this-matters}

Podejście PayPal do zgodności pokazuje fundamentalne niezrozumienie sposobu działania firm. Właściwa weryfikacja KYC powinna odbywać się **przed** integracją produkcyjną, a nie po tym, jak klienci już próbują zapłacić. Brak proaktywnej komunikacji w przypadku problemów pokazuje oderwanie PayPal od potrzeb sprzedawców.

Ten odwrócony proces jest symptomem szerszych problemów organizacyjnych PayPal: priorytetem są ich wewnętrzne procedury, a nie doświadczenie sprzedawców i klientów, co prowadzi do operacyjnych katastrof, które zniechęcają firmy do korzystania z ich platformy.


## Jak robią to poprawnie inni dostawcy płatności {#how-every-other-payment-processor-does-it-right}

Funkcjonalność listowania subskrypcji, której PayPal odmawia wdrożenia, jest standardem w branży od ponad dekady. Oto jak inni dostawcy płatności radzą sobie z tym podstawowym wymaganiem:

### Stripe {#stripe}

Stripe oferuje listowanie subskrypcji od momentu uruchomienia swojego API. Ich dokumentacja jasno pokazuje, jak pobrać wszystkie subskrypcje dla klienta lub konta sprzedawcy. To jest podstawowa funkcjonalność CRUD.

### Paddle {#paddle}

Paddle zapewnia kompleksowe API do zarządzania subskrypcjami, w tym listowanie, filtrowanie i paginację. Rozumieją, że sprzedawcy muszą widzieć swoje powtarzające się źródła przychodów.

### Coinbase Commerce {#coinbase-commerce}

Nawet dostawcy płatności kryptowalutowych, tacy jak Coinbase Commerce, oferują lepsze zarządzanie subskrypcjami niż PayPal.

### Square {#square}

API Square zawiera listowanie subskrypcji jako podstawową funkcję, a nie dodatek.

### Standard branżowy {#the-industry-standard}

Każdy nowoczesny dostawca płatności oferuje:

* Listowanie wszystkich subskrypcji
* Filtrowanie według statusu, daty, klienta
* Paginację dla dużych zbiorów danych
* Powiadomienia webhook o zmianach subskrypcji
* Kompletną dokumentację z działającymi przykładami

### Co oferują inni dostawcy vs PayPal {#what-other-processors-provide-vs-paypal}

**Stripe - Listowanie wszystkich subskrypcji:**

```http
GET https://api.stripe.com/v1/subscriptions
Authorization: Bearer sk_test_...

Response:
{
  "object": "list",
  "data": [
    {
      "id": "sub_1MowQVLkdIwHu7ixeRlqHVzs",
      "object": "subscription",
      "status": "active",
      "customer": "cus_Na6dX7aXxi11N4",
      "current_period_start": 1679609767,
      "current_period_end": 1682288167
    }
  ],
  "has_more": false
}
```

**Stripe - Filtrowanie według klienta:**

```http
GET https://api.stripe.com/v1/subscriptions?customer=cus_Na6dX7aXxi11N4
```

**Stripe - Filtrowanie według statusu:**

```http
GET https://api.stripe.com/v1/subscriptions?status=active
```

**PayPal - Co faktycznie otrzymujesz:**

```http
GET https://api.paypal.com/v1/billing/subscriptions/{id}
Authorization: Bearer access_token

# Możesz pobrać TYLKO JEDNĄ subskrypcję, jeśli znasz jej ID
# NIE MA endpointu do listowania wszystkich subskrypcji
# NIE MA możliwości wyszukiwania ani filtrowania
# Musisz samodzielnie śledzić wszystkie ID subskrypcji
```

**Dostępne endpointy PayPal:**

* `POST /v1/billing/subscriptions` - Utwórz subskrypcję
* `GET /v1/billing/subscriptions/{id}` - Pobierz JEDNĄ subskrypcję (jeśli znasz ID)
* `PATCH /v1/billing/subscriptions/{id}` - Aktualizuj subskrypcję
* `POST /v1/billing/subscriptions/{id}/cancel` - Anuluj subskrypcję
* `POST /v1/billing/subscriptions/{id}/suspend` - Zawieś subskrypcję
**Czego brakuje w PayPal:**

* ❌ Brak `GET /v1/billing/subscriptions` (lista wszystkich)
* ❌ Brak funkcji wyszukiwania
* ❌ Brak filtrowania według statusu, klienta, daty
* ❌ Brak wsparcia dla paginacji

PayPal jest jedynym dużym procesorem płatności, który zmusza programistów do ręcznego śledzenia identyfikatorów subskrypcji we własnych bazach danych.


## Systematyczne zatuszowanie PayPal: uciszenie 6 milionów głosów {#paypals-systematic-cover-up-silencing-6-million-voices}

W ruchu, który doskonale oddaje podejście PayPal do radzenia sobie z krytyką, niedawno całkowicie wyłączyli swoje forum społecznościowe, skutecznie uciszając ponad 6 milionów członków i usuwając setki tysięcy postów dokumentujących ich porażki.

### Wielkie wymazanie {#the-great-erasure}

Oryginalna społeczność PayPal na `paypal-community.com` liczyła **6 003 558 członków** i zawierała setki tysięcy postów, zgłoszeń błędów, skarg oraz dyskusji na temat problemów z API PayPal. Reprezentowało to ponad dekadę udokumentowanych dowodów na systematyczne problemy PayPal.

30 czerwca 2025 roku PayPal cicho wyłączył całe forum. Wszystkie linki `paypal-community.com` zwracają teraz błędy 404. Nie była to migracja ani aktualizacja.

### Ratunek ze strony zewnętrznej {#the-third-party-rescue}

Na szczęście usługa zewnętrzna pod adresem [ppl.lithium.com](https://ppl.lithium.com/) zachowała część treści, umożliwiając nam dostęp do dyskusji, które PayPal próbował ukryć. Jednak to zewnętrzne zachowanie jest niekompletne i może zniknąć w każdej chwili.

Ten wzorzec ukrywania dowodów nie jest nowością dla PayPal. Mają udokumentowaną historię:

* Usuwania krytycznych zgłoszeń błędów z publicznego widoku
* Zaprzestania wsparcia narzędzi dla programistów bez powiadomienia
* Zmian API bez odpowiedniej dokumentacji
* Uciszania dyskusji społeczności na temat ich porażek

Usunięcie forum to najbardziej bezczelna próba ukrycia ich systematycznych porażek przed publiczną kontrolą.


## 11-letnia katastrofa błędu przechwytywania: 1 899 USD i rośnie {#the-11-year-capture-bug-disaster-1899-and-counting}

Podczas gdy PayPal zajmował się organizowaniem sesji feedbacku i składaniem obietnic, ich podstawowy system przetwarzania płatności był fundamentalnie uszkodzony przez ponad 11 lat. Dowody są druzgocące.

### Strata Forward Email w wysokości 1 899 USD {#forward-emails-1899-loss}

W naszych systemach produkcyjnych odkryliśmy 108 płatności PayPal o łącznej wartości **1 899 USD**, które zostały utracone z powodu błędów przechwytywania PayPal. Te płatności wykazują spójny wzorzec:

* Otrzymano webhooki `CHECKOUT.ORDER.APPROVED`
* API przechwytywania PayPal zwracało błędy 404
* Zamówienia stały się niedostępne przez API PayPal

Nie jest możliwe ustalenie, czy klienci zostali obciążeni, ponieważ PayPal całkowicie ukrywa logi debugowania po 14 dniach i usuwa wszystkie dane z panelu dla identyfikatorów zamówień, które nie zostały przechwycone.

To dotyczy tylko jednej firmy. **Łączne straty tysięcy sprzedawców na przestrzeni ponad 11 lat prawdopodobnie sięgają milionów dolarów.**

**Powtórzymy to jeszcze raz: łączne straty tysięcy sprzedawców na przestrzeni ponad 11 lat prawdopodobnie sięgają milionów dolarów.**

Jedynym powodem, dla którego to odkryliśmy, jest to, że jesteśmy niesamowicie skrupulatni i oparci na danych.

### Oryginalny raport z 2013 roku: ponad 11 lat zaniedbań {#the-2013-original-report-11-years-of-negligence}

Najwcześniejszy udokumentowany raport tego dokładnego problemu pojawił się na [Stack Overflow w listopadzie 2013](https://stackoverflow.com/questions/19773755/keep-receiving-404-error-with-rest-api-when-doing-a-capture) ([archiwum](https://web.archive.org/web/20250708045416/https://stackoverflow.com/questions/19773755/keep-receiving-404-error-with-rest-api-when-doing-a-capture)):

> "Ciągłe otrzymywanie błędu 404 z REST API podczas próby przechwycenia"

Błąd zgłoszony w 2013 jest **identyczny** z tym, którego doświadczył Forward Email w 2024:

```json
{
  "name": "INVALID_RESOURCE_ID",
  "message": "The requested resource ID was not found",
  "information_link": "https://developer.paypal.com/webapps/developer/docs/api/#INVALID_RESOURCE_ID",
  "debug_id": "e56bae98dcc26"
}
```

Odpowiedź społeczności w 2013 była wymowna:

> "Obecnie zgłoszono problem z REST API. PayPal nad tym pracuje."
**Ponad 11 lat później, nadal „pracują nad tym.”**

### Przyznanie z 2016 roku: PayPal psuje własne SDK {#the-2016-admission-paypal-breaks-their-own-sdk}

W 2016 roku oficjalne repozytorium PayPala na GitHub dokumentowało [masowe niepowodzenia przechwytywania](https://github.com/paypal/PayPal-PHP-SDK/issues/660) dotyczące ich oficjalnego SDK PHP. Skala była zdumiewająca:

> „Od 20.09.2016 wszystkie próby przechwycenia PayPala kończą się błędem 'INVALID_RESOURCE_ID - Requested resource ID was not found.'. Między 19 a 20 września nie wprowadzono żadnych zmian w integracji API. **100% prób przechwycenia od 20.09 zwraca ten błąd.**”

Jeden z handlowców zgłosił:

> „Miałem **ponad 1400 nieudanych prób przechwycenia w ciągu ostatnich 24 godzin**, wszystkie z odpowiedzią błędu INVALID_RESOURCE_ID.”

Początkowa reakcja PayPala polegała na obwinianiu handlowca i skierowaniu go do wsparcia technicznego. Dopiero pod ogromną presją przyznali się do błędu:

> „Mam aktualizację od naszych programistów produktu. Zauważają w nagłówkach, które są wysyłane, że PayPal-Request-ID jest przesyłany z 42 znakami, ale **wydaje się, że niedawno wprowadzono zmianę ograniczającą ten identyfikator do zaledwie 38 znaków.**”

To przyznanie ujawnia systematyczną niedbałość PayPala:

1. **Wprowadzili nieudokumentowane zmiany łamiące kompatybilność**
2. **Zepsuli własne oficjalne SDK**
3. **Najpierw obwiniali handlowców**
4. **Przyznali się do błędu dopiero pod presją**

Nawet po „naprawieniu” problemu handlowcy zgłaszali:

> „Zaktualizowałem SDK do wersji v1.7.4 i **problem nadal występuje.**”

### Eskalacja w 2024 roku: Nadal zepsute {#the-2024-escalation-still-broken}

Najnowsze raporty z zachowanej społeczności PayPala pokazują, że problem faktycznie się pogorszył. [Dyskusja z września 2024](https://ppl.lithium.com/t5/REST-APIs/Receiving-APPROVED-Webhooks-for-Order-but-capture-leads-to-404/td-p/3176093) ([archiwum](https://web.archive.org/web/20250708045416/https://ppl.lithium.com/t5/REST-APIs/Receiving-APPROVED-Webhooks-for-Order-but-capture-leads-to-404/td-p/3176093)) dokumentuje dokładnie te same problemy:

> „Problem zaczął się pojawiać dopiero około 2 tygodnie temu i nie dotyczy wszystkich zamówień. **Znacznie częstszym problemem wydają się być błędy 404 przy przechwytywaniu.**”

Handlowiec opisuje ten sam wzorzec, którego doświadczył Forward Email:

> „Po próbie przechwycenia zamówienia PayPal zwraca 404. Przy pobieraniu szczegółów zamówienia: {'id': 'ID', 'intent': 'CAPTURE', 'status': 'COMPLETED', ..., 'final_capture': true, ...} **Nie ma żadnego śladu udanego przechwycenia po naszej stronie.**”

### Katastrofa niezawodności webhooków {#the-webhook-reliability-disaster}

Kolejna [zachowana dyskusja społeczności](https://ppl.lithium.com/t5/REST-APIs/Not-received-PAYMENT-CAPTURE-COMPLETED-when-had-captured/m-p/3042446) ujawnia, że system webhooków PayPala jest fundamentalnie zawodny:

> „Teoretycznie powinny być dwa zdarzenia (CHECKOUT.ORDER.APPROVED i PAYMENT.CAPTURE.COMPLETED) z webhooka. W praktyce **te dwa zdarzenia rzadko są odbierane natychmiast, PAYMENT.CAPTURE.COMPLETED najczęściej nie jest odbierane lub pojawia się dopiero po kilku godzinach.**”

Dla płatności subskrypcyjnych:

> „**'PAYMENT.SALE.COMPLETED' czasami nie jest odbierane lub dopiero po kilku godzinach.**”

Pytania handlowca ujawniają głębokość problemów z niezawodnością PayPala:

1. **„Dlaczego tak się dzieje?”** – system webhooków PayPala jest fundamentalnie zepsuty
2. **„Jeśli status zamówienia to 'COMPLETED', czy mogę założyć, że otrzymałem pieniądze?”** – handlowcy nie mogą ufać odpowiedziom API PayPala
3. **„Dlaczego w 'Event Logs->Webhook Events' nie można znaleźć żadnych logów?”** – nawet własny system logowania PayPala nie działa

### Wzorzec systematycznej niedbałości {#the-pattern-of-systematic-negligence}

Dowody obejmują ponad 11 lat i pokazują wyraźny wzorzec:

* **2013**: „PayPal nad tym pracuje”
* **2016**: PayPal przyznaje się do łamiącej zmiany, dostarcza wadliwą poprawkę
* **2024**: Te same dokładne błędy nadal występują, dotykając Forward Email i niezliczonych innych

To nie jest błąd – **to systematyczna niedbałość.** PayPal zna te krytyczne problemy z przetwarzaniem płatności od ponad dekady i konsekwentnie:
1. **Obwiniali sprzedawców za błędy PayPala**
2. **Wprowadzali nieudokumentowane zmiany łamiące kompatybilność**
3. **Dostarczali niewystarczające poprawki, które nie działają**
4. **Ignorowali wpływ finansowy na firmy**
5. **Ukrywali dowody poprzez usuwanie forów społecznościowych**

### Nieudokumentowany wymóg {#the-undocumented-requirement}

Nigdzie w oficjalnej dokumentacji PayPala nie wspomina się, że sprzedawcy muszą implementować logikę ponawiania prób dla operacji przechwytywania (capture). Ich dokumentacja stwierdza, że sprzedawcy powinni „przechwytywać natychmiast po zatwierdzeniu”, ale nie wspomina, że ich API losowo zwraca błędy 404 wymagające skomplikowanych mechanizmów ponawiania prób.

To zmusza każdego sprzedawcę do:

* Implementacji logiki ponawiania prób z wykładniczym opóźnieniem
* Obsługi niespójnej dostawy webhooków
* Budowy złożonych systemów zarządzania stanem
* Ręcznego monitorowania nieudanych przechwyceń

**Wszyscy inni dostawcy płatności oferują niezawodne API przechwytywania, które działają za pierwszym razem.**


## Szerszy wzorzec oszustw PayPala {#paypals-broader-pattern-of-deception}

Katastrofa z błędem przechwytywania to tylko jeden przykład systematycznego podejścia PayPala do oszukiwania klientów i ukrywania swoich porażek.

### Działanie Departamentu Usług Finansowych Nowego Jorku {#the-new-york-department-of-financial-services-action}

W styczniu 2025 roku Departament Usług Finansowych Nowego Jorku wydał [decyzję egzekucyjną przeciwko PayPalowi](https://www.dfs.ny.gov/system/files/documents/2025/01/ea20250123-paypal-inc.pdf) za praktyki wprowadzające w błąd, co pokazuje, że wzorzec oszustw PayPala wykracza daleko poza ich API.

To działanie regulacyjne pokazuje gotowość PayPala do stosowania praktyk wprowadzających w błąd w całym swoim biznesie, nie tylko w narzędziach dla programistów.

### Pozew Honey: Przepisywanie linków afiliacyjnych {#the-honey-lawsuit-rewriting-affiliate-links}

Przejęcie Honey przez PayPala doprowadziło do [pozewów twierdzących, że Honey przepisuje linki afiliacyjne](https://www.theverge.com/2024/12/23/24328767/honey-paypal-lawsuit-affiliate-commission-influencer), kradnąc prowizje twórcom treści i influencerom. To kolejna forma systematycznego oszustwa, gdzie PayPal zarabia, przekierowując przychody, które powinny trafiać do innych.

Wzorzec jest jasny:

1. **Błędy API**: Ukrywanie uszkodzonej funkcjonalności, obwinianie sprzedawców
2. **Cisza społeczności**: Usuwanie dowodów problemów
3. **Naruszenia regulacyjne**: Stosowanie praktyk wprowadzających w błąd
4. **Kradzież afiliacyjna**: Kradzież prowizji przez manipulacje techniczne

### Koszt zaniedbań PayPala {#the-cost-of-paypals-negligence}

Strata Forward Email w wysokości 1899 USD to tylko wierzchołek góry lodowej. Rozważ szerszy wpływ:

* **Pojedynczy sprzedawcy**: Tysiące tracące setki do tysięcy dolarów każdy
* **Klienci korporacyjni**: Potencjalnie miliony utraconych przychodów
* **Czas programistów**: Niezliczone godziny budowania obejść dla uszkodzonych API PayPala
* **Zaufanie klientów**: Firmy tracące klientów z powodu awarii płatności PayPala

Jeśli jedna mała usługa e-mailowa straciła prawie 2000 USD, a problem ten istnieje od ponad 11 lat i dotyczy tysięcy sprzedawców, łączna szkoda finansowa prawdopodobnie wynosi **setki milionów dolarów**.

### Kłamstwo dokumentacji {#the-documentation-lie}

Oficjalna dokumentacja PayPala konsekwentnie pomija krytyczne ograniczenia i błędy, na które natrafią sprzedawcy. Na przykład:

* **API przechwytywania**: Brak wzmianki, że błędy 404 są powszechne i wymagają logiki ponawiania prób
* **Niezawodność webhooków**: Brak wzmianki, że webhooki często są opóźnione o godziny
* **Lista subskrypcji**: Dokumentacja sugeruje, że lista jest możliwa, mimo braku endpointu
* **Limit czasu sesji**: Brak wzmianki o agresywnych limitach 60 sekund

To systematyczne pomijanie krytycznych informacji zmusza sprzedawców do odkrywania ograniczeń PayPala metodą prób i błędów w systemach produkcyjnych, często skutkując stratami finansowymi.


## Co to oznacza dla programistów {#what-this-means-for-developers}

Systematyczna niezdolność PayPala do zaspokojenia podstawowych potrzeb programistów przy jednoczesnym zbieraniu obszernego feedbacku pokazuje fundamentalny problem organizacyjny. Traktują zbieranie opinii jako substytut faktycznego naprawiania problemów.
Wzorzec jest jasny:

1. Programiści zgłaszają problemy  
2. PayPal organizuje sesje feedbackowe z kierownictwem  
3. Dostarczane są obszerne opinie  
4. Zespoły przyznają się do braków i obiecują „śledzić i rozwiązywać”  
5. Nic nie jest wdrażane  
6. Kierownictwo odchodzi do lepszych firm  
7. Nowe zespoły proszą o te same opinie  
8. Cykl się powtarza  

Tymczasem programiści są zmuszeni tworzyć obejścia, iść na kompromisy w kwestii bezpieczeństwa oraz radzić sobie z uszkodzonymi interfejsami tylko po to, by akceptować płatności.

Jeśli budujesz system płatności, ucz się na naszym doświadczeniu: zbuduj swój [podejście trifecta](https://forwardemail.net/en/blog/docs/building-reliable-payment-system-stripe-paypal) z wieloma procesorami, ale nie oczekuj, że PayPal zapewni podstawową funkcjonalność, której potrzebujesz. Planuj tworzyć obejścia od pierwszego dnia.

> Ten wpis dokumentuje nasze 11-letnie doświadczenie z API PayPala w Forward Email. Wszystkie przykłady kodu i linki pochodzą z naszych rzeczywistych systemów produkcyjnych. Nadal wspieramy płatności PayPal pomimo tych problemów, ponieważ niektórzy klienci nie mają innej opcji

<img loading="lazy" src="/img/articles/paypal-api-issues.webp" alt="Ilustracja katastrofy API PayPal" class="rounded-lg" />
