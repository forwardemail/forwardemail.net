# 11-letnia katastrofa API w PayPal: jak stworzyliśmy obejścia, podczas gdy oni ignorowali programistów {#paypals-11-year-api-disaster-how-we-built-workarounds-while-they-ignored-developers}

<img loading="lazy" src="/img/articles/pypl-disaster.webp" alt="PayPal API disaster illustration" class="rounded-lg" />

<p class="lead mt-3">W Forward Email od ponad dekady zmagamy się z niedziałającymi interfejsami API PayPala. To, co zaczęło się jako drobne problemy, przerodziło się w kompletną katastrofę, która zmusiła nas do opracowania własnych obejść, zablokowania szablonów phishingowych i ostatecznie wstrzymania wszystkich płatności PayPal podczas krytycznej migracji kont.</p>
<p class="lead mt-3">To historia 11 lat, w których PayPal ignorował podstawowe potrzeby programistów, podczas gdy my robiliśmy wszystko, aby ich platforma działała.</p>

## Spis treści {#table-of-contents}

* [Brakujący element: brak możliwości wystawienia subskrypcji](#the-missing-piece-no-way-to-list-subscriptions)
* [2014-2017: Problem się pojawia](#2014-2017-the-problem-emerges)
* [2020: Udzielamy im obszernej informacji zwrotnej](#2020-we-give-them-extensive-feedback)
  * [Lista opinii składająca się z 27 elementów](#the-27-item-feedback-list)
  * [Zespoły się zaangażowały, złożono obietnice](#teams-got-involved-promises-were-made)
  * [Wynik? Nic.](#the-result-nothing)
* [Exodus kadry kierowniczej: jak PayPal utracił całą pamięć instytucjonalną](#the-executive-exodus-how-paypal-lost-all-institutional-memory)
* [2025: Nowe kierownictwo, te same problemy](#2025-new-leadership-same-problems)
  * [Nowy dyrektor generalny angażuje się](#the-new-ceo-gets-involved)
  * [Odpowiedź Michelle Gill](#michelle-gills-response)
  * [Nasza odpowiedź: Koniec spotkań](#our-response-no-more-meetings)
  * [Nadmierna inżynieryjna odpowiedź Marty'ego Brodbecka](#marty-brodbecks-overengineering-response)
  * [Sprzeczność „Prostego CRUD”](#the-simple-crud-contradiction)
  * [Rozłączenie staje się jasne](#the-disconnect-becomes-clear)
* [Lata raportów o błędach, które ignorowali](#years-of-bug-reports-they-ignored)
  * [2016: Wczesne skargi dotyczące interfejsu użytkownika/doświadczenia użytkownika](#2016-early-uiux-complaints)
  * [2021: Raport o błędach w poczcie firmowej](#2021-business-email-bug-report)
  * [2021: Sugestie dotyczące ulepszeń interfejsu użytkownika](#2021-ui-improvement-suggestions)
  * [2021: Awarie środowiska piaskownicy](#2021-sandbox-environment-failures)
  * [2021: System raportów całkowicie zepsuty](#2021-reports-system-completely-broken)
  * [2022: Ponownie brakuje podstawowej funkcji API](#2022-core-api-feature-missing-again)
* [Koszmar dla programistów](#the-developer-experience-nightmare)
  * [Zepsuty interfejs użytkownika](#broken-user-interface)
  * [Problemy z zestawem SDK](#sdk-problems)
  * [Naruszenia zasad bezpieczeństwa treści](#content-security-policy-violations)
  * [Chaos dokumentacji](#documentation-chaos)
  * [Luki w zabezpieczeniach](#security-vulnerabilities)
  * [Zarządzanie sesją w przypadku katastrofy](#session-management-disaster)
* [Lipiec 2025: Ostatnia kropla](#july-2025-the-final-straw)
* [Dlaczego nie możemy po prostu zrezygnować z PayPala](#why-we-cant-just-drop-paypal)
* [Rozwiązanie problemu przez społeczność](#the-community-workaround)
* [Blokowanie szablonów PayPal z powodu phishingu](#blocking-paypal-templates-due-to-phishing)
  * [Prawdziwy problem: szablony PayPal wyglądają jak oszustwa](#the-real-problem-paypals-templates-look-like-scams)
  * [Nasza realizacja](#our-implementation)
  * [Dlaczego musieliśmy zablokować PayPal](#why-we-had-to-block-paypal)
  * [Skala problemu](#the-scale-of-the-problem)
  * [Ironia](#the-irony)
  * [Wpływ na świat rzeczywisty: nowe oszustwa PayPal](#real-world-impact-novel-paypal-scams)
* [Wsteczny proces KYC w PayPal](#paypals-backwards-kyc-process)
  * [Jak to powinno działać](#how-it-should-work)
  * [Jak właściwie działa PayPal](#how-paypal-actually-works)
  * [Wpływ na świat rzeczywisty](#the-real-world-impact)
  * [Katastrofa migracji kont w lipcu 2025 r.](#the-july-2025-account-migration-disaster)
  * [Dlaczego to ma znaczenie](#why-this-matters)
* [Jak każdy inny procesor płatności robi to dobrze](#how-every-other-payment-processor-does-it-right)
  * [Naszywka](#stripe)
  * [Wiosłować](#paddle)
  * [Coinbase Commerce](#coinbase-commerce)
  * [Kwadrat](#square)
  * [Standard branżowy](#the-industry-standard)
  * [Co oferują inni procesorzy w porównaniu z PayPal](#what-other-processors-provide-vs-paypal)
* [Systematyczne tuszowanie sprawy przez PayPal: uciszanie 6 milionów głosów](#paypals-systematic-cover-up-silencing-6-million-voices)
  * [Wielkie wymazanie](#the-great-erasure)
  * [Ratunek przez osoby trzecie](#the-third-party-rescue)
* [Katastrofa związana z łapaniem pluskiew trwająca 11 lat: 1899 dolarów i wciąż rośnie](#the-11-year-capture-bug-disaster-1899-and-counting)
  * [Strata Forward Email w wysokości 1899 USD](#forward-emails-1899-loss)
  * [Oryginalny raport z 2013 r.: ponad 11 lat zaniedbań](#the-2013-original-report-11-years-of-negligence)
  * [Wstęp 2016: PayPal psuje własny zestaw SDK](#the-2016-admission-paypal-breaks-their-own-sdk)
  * [Eskalacja 2024: Nadal nierozwiązana](#the-2024-escalation-still-broken)
  * [Katastrofa niezawodności webhooków](#the-webhook-reliability-disaster)
  * [Schemat systematycznego zaniedbania](#the-pattern-of-systematic-negligence)
  * [Nieudokumentowane wymaganie](#the-undocumented-requirement)
* [Szerszy schemat oszustw PayPala](#paypals-broader-pattern-of-deception)
  * [Działania Departamentu Usług Finansowych Nowego Jorku](#the-new-york-department-of-financial-services-action)
  * [Pozew w sprawie miodu: przepisywanie linków afiliacyjnych](#the-honey-lawsuit-rewriting-affiliate-links)
  * [Koszt zaniedbania PayPala](#the-cost-of-paypals-negligence)
  * [Kłamstwo dokumentacji](#the-documentation-lie)
* [Co to oznacza dla programistów](#what-this-means-for-developers)

## Brakujący element: brak możliwości wyświetlania subskrypcji {#the-missing-piece-no-way-to-list-subscriptions}

A oto, co nas zadziwia: PayPal oferuje rozliczenia subskrypcyjne od 2014 r., ale nigdy nie umożliwił sprzedawcom dodawania własnych subskrypcji.

Pomyśl o tym przez chwilę. Możesz tworzyć subskrypcje, możesz je anulować, jeśli masz identyfikator, ale nie możesz uzyskać listy wszystkich aktywnych subskrypcji dla swojego konta. To tak, jakbyś miał bazę danych bez instrukcji SELECT.

Potrzebujemy tego do podstawowych operacji biznesowych:

* Obsługa klienta (gdy ktoś wysyła e-mail z pytaniem o subskrypcję)
* Sprawozdawczość finansowa i uzgadnianie
* Automatyczne zarządzanie fakturami
* Zgodność i audyt

A PayPal? Oni po prostu... nigdy go nie stworzyli.

## 2014-2017: Problem się pojawia {#2014-2017-the-problem-emerges}

Problem z listą subskrypcji pojawił się po raz pierwszy na forach społecznościowych PayPala w 2017 roku. Deweloperzy zadawali oczywiste pytanie: „Jak mogę uzyskać listę wszystkich moich subskrypcji?”

Odpowiedź PayPala? Cisza.

Członkowie społeczności zaczęli się frustrować:

> „Bardzo dziwne pominięcie, jeśli sprzedawca nie może wyświetlić wszystkich aktywnych umów. Utrata identyfikatora umowy oznacza, że tylko użytkownik może anulować lub zawiesić umowę”. – leafspider

> „+1. Minęły prawie 3 lata.” – laudukang (co oznacza, że problem istnieje od \~2014 r.)

Raport [oryginalny post społeczności](https://web.archive.org/web/20201019142512/https://www.paypal-community.com/t5/REST-API-SDK/List-all-subscriptions/td-p/1147066) z 2017 roku pokazuje, że deweloperzy błagali o tę podstawową funkcjonalność. Odpowiedzią PayPala było zarchiwizowanie repozytorium, w którym użytkownicy zgłaszali problem.

## 2020: Udzielamy im obszernej informacji zwrotnej {#2020-we-give-them-extensive-feedback}

W październiku 2020 roku PayPal zwrócił się do nas z prośbą o formalną sesję konsultacyjną. Nie była to zwykła rozmowa – zorganizowano 45-minutową rozmowę w Microsoft Teams z udziałem 8 dyrektorów PayPal, w tym Sri Shivanandy (dyrektora ds. technologii), Edwina Aokiego, Jima Magatsa, Johna Kunze i innych.

### Lista opinii składająca się z 27 elementów {#the-27-item-feedback-list}

Przyjechaliśmy przygotowani. Po 6 godzinach prób integracji z ich API zebraliśmy 27 konkretnych zgłoszeń. Mark Stuart z zespołu PayPal Checkout powiedział:

> Hej Nick, dzięki za podzielenie się z nami tym dzisiaj! Myślę, że to będzie impulsem do pozyskania większego wsparcia i inwestycji dla naszego zespołu, aby móc zająć się tymi problemami. Trudno było uzyskać tak bogate opinie, jak te, które nam zostawiłeś.

Informacje zwrotne nie były teoretyczne – pochodziły z rzeczywistych prób integracji:

1. **Generowanie tokena dostępu nie działa**:

> Generowanie tokenów dostępu nie działa. Powinno być też więcej przykładów niż tylko cURL.

2. **Brak interfejsu internetowego do tworzenia subskrypcji**:

> Jak do cholery można tworzyć subskrypcje bez konieczności korzystania z cURL? Wygląda na to, że nie ma do tego interfejsu internetowego (takiego jak Stripe)

Mark Stuart uważał problem z tokenem dostępowym za szczególnie niepokojący:

> Zwykle nie słyszymy o problemach związanych z generowaniem tokenów dostępu.

### Zespoły zaangażowały się, złożono obietnice {#teams-got-involved-promises-were-made}

W miarę jak odkrywaliśmy kolejne problemy, PayPal dodawał kolejne zespoły do dyskusji. Dołączył do nas Darshan Raju z zespołu ds. interfejsu użytkownika w zarządzaniu subskrypcjami i powiedział:

> Zauważ lukę. Będziemy to monitorować i rozwiązywać. Jeszcze raz dziękujemy za opinię!

Sesja została opisana jako mająca na celu:

> szczery opis Twojego doświadczenia

Do:

> uczynić PayPal tym, czym powinien być dla programistów.

### Wynik? Nic. {#the-result-nothing}

Pomimo formalnej sesji przekazywania opinii, obszerna lista składająca się z 27 punktów, zaangażowanie wielu zespołów i obietnice:

> śledzenie i adresowanie

problemy, absolutnie nic nie zostało naprawione.

## Exodus kadry kierowniczej: jak PayPal utracił całą pamięć instytucjonalną {#the-executive-exodus-how-paypal-lost-all-institutional-memory}

I tu zaczyna się robić naprawdę ciekawie. Każda osoba, która otrzymała naszą opinię w 2020 roku, opuściła PayPal:

**Zmiany w kierownictwie:**

* [Dan Schulman (CEO przez 9 lat) → Alex Chriss](https://www.fastcompany.com/90938418/paypal-ceo-alex-chriss-dan-schulman-what-to-know/) (wrzesień 2023)
* [Sri Shivananda (dyrektor techniczny, który zorganizował feedback) → JPMorgan Chase](https://www.pymnts.com/personnel/2024/jpmorgan-names-paypal-vet-shivananda-as-new-tech-chief/) (styczeń 2024)

**Liderzy techniczni, którzy złożyli obietnice, a potem odeszli:**

* **Mark Stuart** (obiecana opinia miała być „katalizatorem”) → [Teraz w Ripple](https://www.linkedin.com/in/markstuartsf)
* **Jim Magats** (18-letni weteran PayPala) → [Dyrektor generalny MX](https://www.cnbc.com/2022/07/28/paypal-veteran-jim-magats-is-named-ceo-of-mx-the-startup-that-connects-banks-and-fintech-players.html) (2022)
* **John Kunze** (wiceprezes ds. globalnych produktów konsumenckich) → [Emerytowany](https://www.linkedin.com/in/john-kunze-5724a86) (2023)
* **Edwin Aoki** (jeden z ostatnich pozostałych) → [Właśnie wyjechałem na Nasdaq](https://www.linkedin.com/posts/edwinaoki_apparently-i-just-cant-stay-awaythe-day-activity-7289388518487793664-j8OZ) (styczeń 2025)

PayPal stał się miejscem, w którym dyrektorzy zbierają opinie od programistów, składają obietnice, a następnie odchodzą do lepszych firm, takich jak JPMorgan, Ripple i inne firmy fintech.

To wyjaśnia, dlaczego odpowiedź GitHub na problem z 2025 r. wydawała się zupełnie oderwana od naszej opinii z 2020 r. — dosłownie wszyscy, którzy otrzymali tę opinię, odeszli z PayPal.

## 2025: Nowe kierownictwo, te same problemy {#2025-new-leadership-same-problems}

Przenieśmy się do roku 2025, a pojawi się dokładnie ten sam schemat. Po latach bezskuteczności, nowe kierownictwo PayPala ponownie wyciąga rękę.

### Nowy dyrektor generalny angażuje się {#the-new-ceo-gets-involved}

30 czerwca 2025 roku zwróciliśmy się bezpośrednio do nowego prezesa PayPal, Alexa Chrissa. Jego odpowiedź była krótka:

> Cześć Nick – Dziękuję za kontakt i opinię. Michelle (w kopii) jest gotowa zaangażować swój zespół i wspólnie z Tobą rozwiązać ten problem. Dzięki -A

### Odpowiedź Michelle Gill {#michelle-gills-response}

Michelle Gill, wiceprezes wykonawczy i dyrektor generalny ds. małych firm i usług finansowych, odpowiedziała:

> Dziękuję bardzo, Nick, przeniosłem Alexa do UDW. Zajmowaliśmy się tym od czasu Twojego poprzedniego posta. Oddzwonimy do Ciebie przed końcem tygodnia. Czy możesz przesłać mi swoje dane kontaktowe, aby któryś z moich współpracowników mógł się z Tobą skontaktować? Michelle

### Nasza odpowiedź: Brak dalszych spotkań {#our-response-no-more-meetings}

Odrzuciliśmy kolejne spotkanie, tłumacząc naszą frustrację:

> Dziękuję. Nie wydaje mi się jednak, żeby rozmowa telefoniczna cokolwiek dała. Oto dlaczego... Kiedyś też rozmawiałem przez telefon i nic z tego nie wyszło. Straciłem ponad 2 godziny na rozmowy z całym zespołem i kierownictwem, a nic z tego nie wyszło... Mnóstwo maili w tę i z powrotem. Absolutnie nic. Informacje zwrotne nic nie dały. Latami starałem się, żeby mnie wysłuchano, a potem nic z tego nie wyszło.

### Odpowiedź Marty'ego Brodbecka na nadmierną inżynierię {#marty-brodbecks-overengineering-response}

Następnie odezwał się Marty Brodbeck, szef działu inżynierii konsumenckiej w firmie PayPal:

> Cześć Nick, tu Marty Brodbeck. Kieruję działem inżynierii konsumenckiej w PayPal i prowadzę rozwój API dla tej firmy. Czy mógłbyś nam opowiedzieć o problemie, z którym się borykasz i jak możemy Ci pomóc?

Gdy wyjaśniliśmy prostą potrzebę punktu końcowego listy subskrypcji, jego odpowiedź ujawniła dokładny problem:

> Dzięki Nick, jesteśmy w trakcie tworzenia pojedynczego interfejsu API subskrypcji z pełnym zestawem SDK (obsługującym pełną obsługę błędów, śledzenie subskrypcji na podstawie zdarzeń, solidny czas sprawności), w którym rozliczenia będą również oddzielone jako osobne API, z którego będą mogli korzystać sprzedawcy, zamiast konieczności organizowania wielu punktów końcowych w celu uzyskania jednej odpowiedzi.

To jest absolutnie błędne podejście. Nie potrzebujemy miesięcy skomplikowanej architektury. Potrzebujemy jednego prostego punktu końcowego REST, który wyświetla listę subskrypcji – czegoś, co powinno istnieć od 2014 roku.

```http
GET /v1/billing/subscriptions
Authorization: Bearer {access_token}
```

### Sprzeczność „Prostego CRUD” {#the-simple-crud-contradiction}

Gdy zwróciliśmy uwagę, że jest to podstawowa funkcjonalność CRUD, która powinna istnieć od 2014 r., odpowiedź Marty'ego była wymowna:

> Proste operacje CRUD są częścią podstawowego API, mój przyjacielu, więc nie zajmie to miesięcy rozwoju

Pakiet PayPal TypeScript SDK, który po miesiącach rozwoju obsługuje obecnie tylko trzy punkty końcowe, a także jego historyczny harmonogram, wyraźnie pokazują, że ukończenie takich projektów zajmuje więcej niż kilka miesięcy.

Ta odpowiedź pokazuje, że nie rozumie własnego API. Skoro „proste operacje CRUD są częścią podstawowego API”, to gdzie jest punkt końcowy listy subskrypcji? Odpowiedzieliśmy:

> Jeśli „proste operacje CRUD są częścią podstawowego API”, to gdzie jest punkt końcowy listy subskrypcji? Programiści domagają się tej „prostej operacji CRUD” od 2014 roku. Minęło 11 lat. Każdy inny procesor płatności ma tę podstawową funkcjonalność od samego początku.

### Rozłączenie staje się jasne {#the-disconnect-becomes-clear}

Rozmowy z Alexem Chrissem, Michelle Gill i Martym Brodbeckiem w 2025 r. pokazują tę samą dysfunkcję organizacyjną:

1. **Nowe kierownictwo nie ma wiedzy o poprzednich sesjach feedbackowych**
2. **Proponują te same przekombinowane rozwiązania**
3. **Nie rozumieją ograniczeń własnego API**
4. **Chcą więcej spotkań, zamiast po prostu rozwiązać problem**

Ten schemat wyjaśnia, dlaczego zespoły PayPal w 2025 r. zdają się zupełnie nie rozumieć obszernych opinii przekazanych w 2020 r. — osoby, które otrzymały te opinie, odeszły, a nowe kierownictwo powtarza te same błędy.

## Lata raportów o błędach, które zignorowali {#years-of-bug-reports-they-ignored}

Nie ograniczaliśmy się do narzekania na brakujące funkcje. Aktywnie zgłaszaliśmy błędy i staraliśmy się pomóc w ich poprawie. Oto szczegółowy harmonogram udokumentowanych przez nas problemów:

### 2016: Wczesne skargi dotyczące interfejsu użytkownika/doświadczenia użytkownika {#2016-early-uiux-complaints}

Już w 2016 roku publicznie kontaktowaliśmy się z kierownictwem PayPala, w tym z Danem Schulmanem, w sprawie problemów z interfejsem i użytecznością. To było 9 lat temu, a te same problemy z UI/UX wciąż występują.

### 2021: Raport o błędzie w poczcie firmowej {#2021-business-email-bug-report}

W marcu 2021 roku zgłosiliśmy, że system poczty firmowej PayPal wysyłał nieprawidłowe powiadomienia o anulowaniu. Szablon wiadomości e-mail zawierał nieprawidłowo renderowane zmienne, co powodowało wyświetlanie klientom mylących komunikatów.

Mark Stuart przyznał, że problem istnieje:

> Dzięki Nick! Przenoszę do UDW. @Prasy, czy Twój zespół jest odpowiedzialny za tego e-maila, czy wie, kto jest? Tekst „Niftylettuce, LLC, nie będziemy już wystawiać Ci rachunków” sugeruje, że doszło do pomyłki w adresacie i treści e-maila.

**Rezultat**: Naprawili to! Mark Stuart potwierdził:

> Właśnie dowiedziałem się od zespołu ds. powiadomień, że szablon e-maila został naprawiony i wdrożony. Dziękujemy za zgłoszenie. Dziękujemy!

To pokazuje, że MOGĄ naprawiać rzeczy, kiedy chcą – po prostu w przypadku większości problemów nie robią tego.

### 2021: Sugestie dotyczące ulepszeń interfejsu użytkownika {#2021-ui-improvement-suggestions}

W lutym 2021 r. udostępniliśmy szczegółowe informacje zwrotne na temat interfejsu użytkownika pulpitu nawigacyjnego, w szczególności sekcji „Ostatnia aktywność w serwisie PayPal”:

> Myślę, że panel na stronie paypal.com, a konkretnie „Ostatnia aktywność PayPal”, wymaga udoskonalenia. Nie sądzę, żebyście powinni wyświetlać status „Utworzono” dla płatności cyklicznej 0 USD – to tylko dodaje mnóstwo dodatkowych wierszy i nie da się łatwo sprawdzić na pierwszy rzut oka, ile dochodu wygenerowano w ciągu dnia/kilku ostatnich dni.

Mark Stuart przekazał tę informację zespołowi zajmującemu się produktami konsumenckimi:

> Dzięki! Nie jestem pewien, który zespół jest odpowiedzialny za tę aktywność, ale przesłałem sprawę do kierownika ds. produktów konsumenckich, aby znaleźć odpowiedni zespół. Płatność cykliczna w wysokości 0,00 USD wydaje się błędem. Prawdopodobnie powinna zostać odfiltrowana.

**Wynik**: Nigdy nie naprawiono. Interfejs użytkownika nadal wyświetla te bezużyteczne wpisy o wartości 0 USD.

### 2021: Awarie środowiska piaskownicy {#2021-sandbox-environment-failures}

W listopadzie 2021 r. zgłosiliśmy krytyczne problemy ze środowiskiem testowym PayPal:

* Klucze tajnego API Sandbox zostały losowo zmienione i wyłączone.
* Wszystkie konta testowe Sandbox zostały usunięte bez powiadomienia.
* Komunikaty o błędach podczas próby wyświetlenia szczegółów konta Sandbox.
* Sporadyczne awarie ładowania.

> Z jakiegoś powodu mój tajny klucz API w piaskownicy został zmieniony i wyłączony. Wszystkie moje stare konta testowe w piaskownicy zostały usunięte.

> Czasami ładują się dobrze, a czasami nie. To jest niesamowicie frustrujące.

**Rezultat**: Brak odpowiedzi, brak rozwiązania. Deweloperzy nadal borykają się z problemami z niezawodnością piaskownicy.

### 2021: System raportów jest całkowicie uszkodzony {#2021-reports-system-completely-broken}

W maju 2021 r. poinformowaliśmy, że system pobierania raportów o transakcjach w serwisie PayPal jest całkowicie uszkodzony:

> Wygląda na to, że raportowanie pobrań nie działa teraz i nie działało przez cały dzień. Prawdopodobnie powinniśmy też otrzymać powiadomienie e-mail, jeśli się nie powiedzie.

Zwróciliśmy również uwagę na katastrofę związaną z zarządzaniem sesjami:

> Jeśli nie będziesz aktywny i zalogujesz się do PayPal przez jakieś 5 minut, zostaniesz wylogowany. Więc kiedy odświeżysz przycisk obok raportu, którego status chcesz sprawdzić (po tym, jak będziesz czekać w nieskończoność), to będzie to uciążliwe, jeśli będziesz musiał się ponownie zalogować.

Mark Stuart przyznał, że wystąpił problem z przekroczeniem limitu czasu sesji:

> Pamiętam, że zgłaszałeś kiedyś, że Twoja sesja często wygasała i zakłócała proces tworzenia oprogramowania, gdy przełączałeś się między środowiskiem IDE a developer.paypal.com lub panelem sprzedawcy, po czym wracałeś i znów byłeś wylogowywany.

**Wynik**: Limity czasu sesji nadal wynoszą 60 sekund. System raportowania nadal regularnie zawodzi.

### 2022: Brak głównej funkcji API (ponownie) {#2022-core-api-feature-missing-again}

W styczniu 2022 r. ponownie zwróciliśmy uwagę na problem z listą subskrypcji, tym razem podając jeszcze więcej szczegółów na temat błędów w dokumentacji:

> Nie ma GET, który wyświetlałby wszystkie subskrypcje (wcześniej nazywane umowami rozliczeniowymi)

Odkryliśmy, że ich oficjalna dokumentacja była całkowicie niedokładna:

> Dokumentacja API jest również całkowicie niedokładna. Myśleliśmy, że możemy obejść ten problem, pobierając zakodowaną listę identyfikatorów subskrypcji. Ale to nawet nie działa!

> Z oficjalnej dokumentacji tutaj... Jest tam napisane, że można to zrobić... Ale jest haczyk - nigdzie nie ma pola „Identyfikator subskrypcji”, które można by zaznaczyć.

Christina Monti z PayPal odpowiedziała:

> Przepraszamy za frustracje spowodowane błędami w tych krokach. Poprawimy to w tym tygodniu.

Sri Shivananda (CTO) podziękował nam:

> Dziękujemy za nieustanne wsparcie w ulepszaniu nas. Bardzo to doceniamy.

**Rezultat**: Dokumentacja nigdy nie została naprawiona. Punkt końcowy listy subskrypcji nigdy nie został utworzony.

## Koszmar dla programistów {#the-developer-experience-nightmare}

Praca z interfejsami API PayPala to jak cofnięcie się w czasie o 10 lat. Oto udokumentowane przez nas problemy techniczne:

### Uszkodzony interfejs użytkownika {#broken-user-interface}

Panel programisty PayPal to katastrofa. Oto, z czym mamy do czynienia na co dzień:

<figure>
<figcaption><div class="alert alert-danger small text-center">
Interfejs użytkownika PayPala jest tak zepsuty, że nie można nawet odrzucić powiadomień.
</div></figcaption>
<video class="lazyframe-bordinated" loading="lazy" controls>
<source src="/img/articles/pypl-notifications.mp4" type="video/mp4">
Twoja przeglądarka nie obsługuje tagu wideo.
</video>
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
Panel programisty dosłownie każe przeciągnąć suwak, a następnie wylogowuje po 60 sekundach.
</div></figcaption>
<video class="lazyframe-bordinated" loading="lazy" controls>
<source src="/img/articles/pypl-kapture-1.mp4" type="video/mp4">
Twoja przeglądarka nie obsługuje tagu wideo.
</video>
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
Więcej awarii interfejsu użytkownika w interfejsie programisty PayPal, pokazujących uszkodzone przepływy pracy
</div></figcaption>
<video class="lazyframe-bordinated" loading="lazy" controls>
<source src="/img/articles/pypl-kapture-2.mp4" type="video/mp4">
Twoja przeglądarka nie obsługuje znacznika wideo.
</video>
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
Interfejs zarządzania subskrypcjami – interfejs jest tak słaby, że musieliśmy polegać na kodzie, aby generować produkty i plany subskrypcji.
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-subscriptions.png" alt="PayPal subscriptions screenshot" class="rounded-lg" />
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
Widok zepsutego interfejsu subskrypcji z brakującą funkcjonalnością (nie można łatwo tworzyć produktów/planów/subskrypcji – i wydaje się, że nie ma w ogóle możliwości usuwania produktów ani planów po ich utworzeniu w interfejsie użytkownika)
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-subscriptions-2.png" alt="PayPal subscriptions screenshot 2" class="rounded-lg" />
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
Typowe komunikaty o błędach PayPala – zagadkowe i nieprzydatne
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-errors.png" alt="PayPal API error screenshot" class="rounded-lg" />
</figure>

### Problemy z zestawem SDK {#sdk-problems}

* Nie można obsługiwać zarówno płatności jednorazowych, jak i subskrypcji bez skomplikowanych obejść polegających na zamianie i ponownym renderowaniu przycisków podczas ponownego ładowania zestawu SDK za pomocą znaczników skryptu.
* Zestaw SDK JavaScript narusza podstawowe konwencje (nazwy klas pisane małymi literami, brak sprawdzania instancji).
* Komunikaty o błędach nie wskazują, których pól brakuje.
* Niespójne typy danych (wymaganie wartości ciągów znaków zamiast liczb).

### Naruszenia zasad bezpieczeństwa treści {#content-security-policy-violations}

Ich zestaw SDK wymaga opcji unsafe-inline i unsafe-eval w CSP, **zmuszając Cię do naruszenia bezpieczeństwa Twojej witryny**.

### Chaos dokumentacji {#documentation-chaos}

Sam Mark Stuart przyznał:

> Zgadzam się, że jest absurdalnie dużo starych i nowych interfejsów API. Naprawdę trudno znaleźć to, czego szukać (nawet nam, którzy tu pracujemy).

### Luki w zabezpieczeniach {#security-vulnerabilities}

**Wdrożenie uwierzytelniania dwuskładnikowego w PayPalu jest odwrotne**. Nawet z włączonymi aplikacjami TOTP wymuszają one weryfikację SMS-em, co naraża konta na ataki polegające na zamianie kart SIM. Jeśli masz włączoną aplikację TOTP, powinna ona korzystać wyłącznie z niej. Wariantem awaryjnym powinien być e-mail, a nie SMS.

### Katastrofa zarządzania sesjami {#session-management-disaster}

**Ich panel programisty wylogowuje po 60 sekundach bezczynności**. Próbujesz zrobić cokolwiek produktywnego, a ciągle przechodzisz przez: logowanie → captcha → 2FA → wylogowanie → i tak w kółko. Korzystasz z VPN? Powodzenia.

## Lipiec 2025: Ostatnia kropla {#july-2025-the-final-straw}

Po 11 latach tych samych problemów, punkt krytyczny nadszedł podczas rutynowej migracji konta. Musieliśmy przejść na nowe konto PayPal, które odpowiadało nazwie naszej firmy „Forward Email LLC”, aby zapewnić przejrzystszą księgowość.

To, co powinno być proste, zamieniło się w kompletną katastrofę:

* Wstępne testy wykazały, że wszystko działa poprawnie.
* Kilka godzin później PayPal nagle zablokował wszystkie płatności subskrypcyjne bez powiadomienia.
* Klienci nie mogli płacić, co powodowało zamieszanie i obciążenie działu wsparcia.
* Dział wsparcia PayPal udzielał sprzecznych odpowiedzi, twierdząc, że konta zostały zweryfikowane.
* Byliśmy zmuszeni całkowicie wstrzymać płatności PayPal.

<figure>
<figcaption><div class="alert alert-danger small text-center">
Błąd, który widzieli klienci podczas próby płatności – brak wyjaśnienia, brak logów, nic
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-something-went-wrong.png" alt="PayPal something went wrong error" class="rounded-lg" />
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
Wsparcie PayPala twierdzi, że wszystko działało prawidłowo, podczas gdy płatności były całkowicie niedostępne. W ostatniej wiadomości piszą, że „przywrócili niektóre funkcje”, ale nadal proszą o więcej nieokreślonych informacji – typowy teatrzyk pomocy technicznej PayPal.
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
Proces weryfikacji tożsamości, który rzekomo niczego nie „naprawił”
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-take-care-1.png" alt="PayPal take care screenshot 1" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-take-care-2.png" alt="PayPal take care screenshot 2" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-take-care-3.png" alt="PayPal take care screenshot 3" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-take-care-4.png" alt="PayPal take care screenshot 4" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-take-care-5.png" alt="PayPal take care screenshot 5" class="rounded-lg" />
<img loading="leniwy" src="/img/articles/pypl-take-care-6.png" alt="PayPal take care screenshot 6" class="rounded-lg" />
<img loading="leniwy" src="/img/articles/pypl-take-care-7.png" alt="PayPal take care screenshot 7" class="rounded-lg" />
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
Niejasny komunikat i nadal brak rozwiązania. Brak informacji, powiadomień i jakichkolwiek informacji o tym, jakie dodatkowe informacje są potrzebne. Obsługa klienta milczy.
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-restored.png" alt="PayPal restored screenshot" class="rounded-lg" />
</figure>

## Dlaczego nie możemy po prostu zrezygnować z PayPala {#why-we-cant-just-drop-paypal}

Pomimo tych wszystkich problemów nie możemy całkowicie zrezygnować z PayPala, ponieważ niektórzy klienci korzystają tylko z PayPala jako opcji płatności. Jak napisał jeden z klientów na naszym [strona statusu](https://github.com/forwardemail/status.forwardemail.net/issues/1658#issuecomment-3026530515):

> PayPal jest moją jedyną opcją płatności

**Jesteśmy zmuszeni wspierać zepsutą platformę, ponieważ PayPal stworzył monopol płatniczy dla niektórych użytkowników.**

## Rozwiązanie problemu społeczności {#the-community-workaround}

Ponieważ PayPal nie zapewnia podstawowej funkcjonalności listy subskrypcji, społeczność programistów opracowała obejścia. Stworzyliśmy skrypt, który pomaga zarządzać subskrypcjami PayPal: [set-active-pypl-subscription-ids.js](https://github.com/forwardemail/forwardemail.net/blob/master/scripts/set-active-pypl-subscription-ids.js)

Ten skrypt odwołuje się do [sedno społeczności](https://gist.github.com/titanism/955f0c21d53e8c98068c549fb79e75d4), gdzie programiści dzielą się rozwiązaniami. Użytkownicy są w rzeczywistości [dziękując nam](https://gist.github.com/titanism/955f0c21d53e8c98068c549fb79e75d4?permalink_comment_id=5045775#gistcomment-5045775) za udostępnienie tego, co PayPal powinien był stworzyć lata temu.

## Blokowanie szablonów PayPal z powodu phishingu {#blocking-paypal-templates-due-to-phishing}

Problemy wykraczają poza interfejsy API. Szablony wiadomości e-mail PayPal są tak źle zaprojektowane, że musieliśmy wdrożyć specjalne filtry w naszej usłudze e-mail, ponieważ nie da się ich odróżnić od prób phishingu.

### Prawdziwy problem: szablony PayPal wyglądają jak oszustwa {#the-real-problem-paypals-templates-look-like-scams}

Regularnie otrzymujemy zgłoszenia dotyczące e-maili PayPal, które wyglądają dokładnie jak próby phishingu. Oto przykład z naszych raportów o nadużyciach:

**Temat:** `[Sandbox] TEST - New invoice from PaypalBilling434567 sandbox #A4D369E8-0001`

Ta wiadomość została przesłana na adres `abuse@microsoft.com`, ponieważ wyglądała na próbę phishingu. Problem? W rzeczywistości pochodziła ze środowiska testowego PayPal, ale ich szablon jest tak słaby, że uruchamia systemy wykrywania phishingu.

### Nasza implementacja {#our-implementation}

Nasze filtrowanie specyficzne dla systemu PayPal można zobaczyć w naszym [kod filtrujący e-maile](https://github.com/forwardemail/forwardemail.net/blob/3b45c70391b5b572b2568749d71be3f7198cd995/helpers/is-arbitrary.js#L151-L172):

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

Wdrożyliśmy to rozwiązanie, ponieważ PayPal odmówił naprawy ogromnej liczby problemów ze spamem, phishingiem i oszustwami, pomimo naszych wielokrotnych zgłoszeń do ich zespołów ds. nadużyć. Blokujemy następujące typy wiadomości e-mail:

* **RT000238** – Powiadomienia o podejrzanych fakturach
* **PPC001017** – Problematyczne potwierdzenia płatności
* **RT000542** – Próby włamania do wiadomości podarunkowych

### Skala problemu {#the-scale-of-the-problem}

Nasze dzienniki filtrowania spamu pokazują ogromną ilość spamu związanego z fakturami PayPal, który przetwarzamy każdego dnia. Przykłady zablokowanych tematów:

* „Faktura od zespołu ds. rozliczeń PayPal: Ta opłata zostanie automatycznie pobrana z Twojego konta. Prosimy o natychmiastowy kontakt pod numerem \[TELEFON]”
* „Faktura od \[NAZWA FIRMY] (\[ID ZAMÓWIENIA])”
* Wiele wersji z różnymi numerami telefonów i fałszywymi identyfikatorami zamówień

Te e-maile często pochodzą z hostów `outlook.com`, ale wydają się pochodzić z legalnych systemów PayPal, co czyni je szczególnie niebezpiecznymi. E-maile przechodzą uwierzytelnianie SPF, DKIM i DMARC, ponieważ są wysyłane za pośrednictwem rzeczywistej infrastruktury PayPal.

Nasze dzienniki techniczne pokazują, że te wiadomości spamowe zawierają prawidłowe nagłówki PayPal:

* `X-Email-Type-Id: RT000238` (ten sam identyfikator, który blokujemy)
* `From: "service@paypal.com" <service@paypal.com>`
* Prawidłowe podpisy DKIM z `paypal.com`
* Prawidłowe rekordy SPF pokazujące serwery pocztowe PayPal

Stwarza to sytuację bez wyjścia: legalne wiadomości e-mail od PayPal i spam mają identyczne parametry techniczne.

### Ironia {#the-irony}

PayPal, firma, która powinna przewodzić w walce z oszustwami finansowymi, ma tak źle zaprojektowane szablony wiadomości e-mail, że uruchamiają systemy antyphishingowe. Jesteśmy zmuszeni blokować legalne wiadomości e-mail od PayPal, ponieważ nie da się ich odróżnić od oszustw.

Zostało to udokumentowane w badaniach bezpieczeństwa: [Uważaj na oszustwa związane z nowym adresem PayPal](https://www.bleepingcomputer.com/news/security/beware-paypal-new-address-feature-abused-to-send-phishing-emails/) - pokazujących, w jaki sposób własne systemy PayPal są wykorzystywane do oszustw.

### Wpływ na świat rzeczywisty: Nowe oszustwa PayPal {#real-world-impact-novel-paypal-scams}

Problem wykracza poza samą kiepską konstrukcję szablonu. System faktur PayPal jest tak łatwy do wykorzystania, że oszuści regularnie go nadużywają, wysyłając pozornie fałszywe faktury. Badacz bezpieczeństwa Gavin Anderegg udokumentował błąd [Nowe oszustwo PayPal](https://anderegg.ca/2023/02/01/a-novel-paypal-scam), w którym oszuści wysyłają prawdziwe faktury PayPal, które przechodzą wszystkie testy uwierzytelniania:

> „Po sprawdzeniu źródła okazało się, że e-mail rzeczywiście pochodzi z PayPala (zatwierdzono SPF, DKIM i DMARC). Przycisk zawierał również link do adresu URL, który wyglądał na legalny w serwisie PayPal... Dopiero po chwili dotarło do mnie, że to prawdziwy e-mail. Właśnie dostałem losową „fakturę” od oszusta”.

<figure>
<figcaption><div class="alert alert-danger small text-center">
Zrzut ekranu przedstawiający wiele fałszywych faktur PayPal zalewających skrzynkę odbiorczą, wszystkie wyglądające na autentyczne, ponieważ w rzeczywistości pochodzą z systemów PayPal.
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-paypal-scam.png" alt="PayPal scam warning screenshot" class="rounded-lg" />
</figure>

Badacz zauważył:

> „Wydaje się to również funkcją ułatwiającą korzystanie z usługi, którą PayPal powinien rozważyć. Od razu założyłem, że to jakaś forma oszustwa i interesowały mnie tylko szczegóły techniczne. Wydaje się to zbyt łatwe do wykonania i obawiam się, że inni mogą się na to nabrać”.

To doskonale ilustruje istotę problemu: legalne systemy PayPal są tak źle zaprojektowane, że sprzyjają oszustwom, a jednocześnie sprawiają, że legalna komunikacja wygląda podejrzanie.

Co gorsza, miało to wpływ na naszą dostarczalność do Yahoo, co skutkowało skargami klientów i godzinami skrupulatnych testów oraz sprawdzania wzorców.

## Wsteczny proces KYC w PayPal {#paypals-backwards-kyc-process}

Jednym z najbardziej frustrujących aspektów platformy PayPal jest ich nieudolne podejście do zgodności i procedur KYC (Know Your Customer). W przeciwieństwie do innych operatorów płatności, PayPal pozwala programistom na integrację swoich interfejsów API i rozpoczęcie pobierania płatności w środowisku produkcyjnym przed zakończeniem właściwej weryfikacji.

### Jak to powinno działać {#how-it-should-work}

Każdy legalny operator płatności stosuje następującą logiczną sekwencję:

1. **Najpierw ukończ weryfikację KYC**
2. **Zatwierdź konto sprzedawcy**
3. **Udziel dostępu do API produkcyjnego**
4. **Zezwól na pobieranie płatności**

Zapewnia to ochronę zarówno podmiotu przetwarzającego płatności, jak i sprzedawcy, gwarantując zgodność z przepisami jeszcze przed przekazaniem pieniędzy.

### Jak właściwie działa PayPal {#how-paypal-actually-works}

Proces PayPal jest całkowicie odwrotny:

1. **Natychmiast zapewnij dostęp do API produkcyjnego**
2. **Zezwól na pobieranie płatności przez godziny lub dni**
3. **Nagłe zablokowanie płatności bez powiadomienia**
4. **Żądaj dokumentacji KYC, gdy klienci już zostaną dotknięci problemem**
5. **Nie powiadamiaj sprzedawcy**
6. **Pozwól klientom odkryć problem i zgłosić go**

### Wpływ na świat rzeczywisty {#the-real-world-impact}

Ten wsteczny proces powoduje katastrofy dla przedsiębiorstw:

* **Klienci nie mogą dokonywać zakupów** w okresach szczytowych
* **Brak wcześniejszego ostrzeżenia** o konieczności weryfikacji
* **Brak powiadomień e-mail** w przypadku zablokowania płatności
* **Sprzedawcy dowiadują się o problemach od zdezorientowanych klientów**
* **Utrata przychodów** w okresach krytycznych dla działalności firmy
* **Naruszenie zaufania klientów** w przypadku tajemniczych niepowodzeń płatności

### Katastrofa migracji kont w lipcu 2025 r. {#the-july-2025-account-migration-disaster}

Dokładnie taki scenariusz miał miejsce podczas naszej rutynowej migracji konta w lipcu 2025 roku. PayPal początkowo zezwalał na płatności, a potem nagle je zablokował bez powiadomienia. Problem odkryliśmy dopiero, gdy klienci zaczęli zgłaszać, że nie mogą zapłacić.

Kiedy skontaktowaliśmy się z pomocą techniczną, otrzymaliśmy sprzeczne odpowiedzi dotyczące potrzebnej dokumentacji, bez jasnego terminu rozwiązania problemu. Zmusiło nas to do całkowitego wstrzymania płatności PayPal, co wprowadziło klientów, którzy nie mieli innych opcji płatności, w błąd.

### Dlaczego to ma znaczenie {#why-this-matters}

Podejście PayPala do zgodności z przepisami świadczy o fundamentalnym niezrozumieniu sposobu działania firm. Prawidłowe KYC powinno zostać przeprowadzone **przed** integracją produkcyjną, a nie dopiero po tym, jak klienci próbują dokonać płatności. Brak proaktywnej komunikacji w przypadku wystąpienia problemów świadczy o oderwaniu PayPala od potrzeb sprzedawców.

Ten wsteczny proces jest symptomem szerszych problemów organizacyjnych PayPala: priorytetowo traktują oni swoje procesy wewnętrzne, nie doświadczenia sprzedawców i klientów, co prowadzi do katastrof operacyjnych, które powodują, że firmy odchodzą od tej platformy.

## Jak każdy inny procesor płatności robi to dobrze {#how-every-other-payment-processor-does-it-right}

Funkcja listy subskrypcji, której PayPal odmawia wdrożenia, jest standardem w branży od ponad dekady. Oto, jak inni operatorzy płatności radzą sobie z tym podstawowym wymaganiem:

### Pasek {#stripe}

Stripe ma listę subskrypcji od momentu uruchomienia swojego API. Dokumentacja jasno pokazuje, jak pobrać wszystkie subskrypcje dla konta klienta lub sprzedawcy. Jest to uważane za podstawową funkcjonalność CRUD.

### Wiosło {#paddle}

Paddle oferuje kompleksowe interfejsy API do zarządzania subskrypcjami, w tym funkcje listowania, filtrowania i paginacji. Rozumieją, że sprzedawcy muszą mieć wgląd w swoje cykliczne źródła przychodów.

### Coinbase Commerce {#coinbase-commerce}

Nawet procesory płatności kryptowalutowych, takie jak Coinbase Commerce, oferują lepsze zarządzanie subskrypcjami niż PayPal.

### Kwadrat {#square}

W interfejsie API firmy Square lista subskrypcji stanowi podstawową funkcję, a nie dodatek.

### Standard branżowy {#the-industry-standard}

Każdy nowoczesny procesor płatności zapewnia:

* Wyświetlanie listy wszystkich subskrypcji
* Filtrowanie według statusu, daty i klienta
* Paginacja dla dużych zbiorów danych
* Powiadomienia webhookowe o zmianach w subskrypcji
* Obszerna dokumentacja z przykładami działania

### Co zapewniają inni procesorzy w porównaniu z PayPal {#what-other-processors-provide-vs-paypal}

**Stripe – Wyświetl wszystkie subskrypcje:**

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

**Stripe - Filtruj według klienta:**

```http
GET https://api.stripe.com/v1/subscriptions?customer=cus_Na6dX7aXxi11N4
```

**Stripe - Filtruj według statusu:**

```http
GET https://api.stripe.com/v1/subscriptions?status=active
```

**PayPal – co tak naprawdę zyskujesz:**

```http
GET https://api.paypal.com/v1/billing/subscriptions/{id}
Authorization: Bearer access_token

# You can ONLY get ONE subscription if you already know the ID
# There is NO endpoint to list all subscriptions
# There is NO way to search or filter
# You must track all subscription IDs yourself
```

**Dostępne punkty końcowe PayPala:**

* `POST /v1/billing/subscriptions` – Utwórz subskrypcję
* `GET /v1/billing/subscriptions/{id}` – Uzyskaj JEDNĄ subskrypcję (jeśli znasz identyfikator)
* `PATCH /v1/billing/subscriptions/{id}` – Zaktualizuj subskrypcję
* `POST /v1/billing/subscriptions/{id}/cancel` – Anuluj subskrypcję
* `POST /v1/billing/subscriptions/{id}/suspend` – Zawieś subskrypcję

**Czego brakuje w PayPalu:**

* ❌ Brak `GET /v1/billing/subscriptions` (wyświetl wszystkie)
* ❌ Brak funkcji wyszukiwania
* ❌ Brak filtrowania według statusu, klienta i daty
* ❌ Brak obsługi paginacji

PayPal to jedyny duży operator płatności, który zmusza programistów do ręcznego śledzenia identyfikatorów subskrypcji we własnych bazach danych.

## Systematyczne tuszowanie sprawy przez PayPal: uciszanie 6 milionów głosów {#paypals-systematic-cover-up-silencing-6-million-voices}

Krokiem, który idealnie oddaje podejście PayPala do radzenia sobie z krytyką, było niedawne wyłączenie całego forum społecznościowego, co skutecznie uciszyło ponad 6 milionów członków i usunęło setki tysięcy postów dokumentujących ich błędy.

### Wielkie wymazanie {#the-great-erasure}

Oryginalna społeczność PayPal pod adresem `paypal-community.com` liczyła **6 003 558 członków** i zawierała setki tysięcy postów, raportów o błędach, skarg i dyskusji na temat awarii interfejsu API PayPal. Stanowiło to ponad dekadę udokumentowanych dowodów na systematyczne problemy PayPal.

30 czerwca 2025 roku PayPal po cichu wyłączył całe forum. Wszystkie linki `paypal-community.com` zwracają teraz błędy 404. Nie była to migracja ani aktualizacja.

### Ratunek innej firmy {#the-third-party-rescue}

Na szczęście zewnętrzna usługa o adresie [ppl.lithium.com](https://ppl.lithium.com/) zachowała część treści, umożliwiając nam dostęp do dyskusji, które PayPal próbował ukryć. Jednak ta zewnętrzna usługa jest niekompletna i może zniknąć w każdej chwili.

Ten schemat ukrywania dowodów nie jest nowy dla PayPala. Mają udokumentowaną historię:

* Usuwanie krytycznych raportów o błędach z widoku publicznego
* Wycofanie narzędzi programistycznych bez powiadomienia
* Zmiana interfejsów API bez odpowiedniej dokumentacji
* Uciszanie dyskusji społeczności na temat ich błędów

Zamknięcie forum stanowi jak dotąd najbardziej bezczelną próbę ukrycia przed opinią publiczną systematycznych zaniedbań.

## Katastrofa związana z 11-letnim przechwytywaniem pluskiew: 1899 USD i wciąż rośnie {#the-11-year-capture-bug-disaster-1899-and-counting}

Podczas gdy PayPal był zajęty organizowaniem sesji opinii i składaniem obietnic, ich główny system przetwarzania płatności był zasadniczo zepsuty od ponad 11 lat. Dowody są druzgocące.

### Strata w wysokości 1899 USD z tytułu przekazania wiadomości e-mail {#forward-emails-1899-loss}

W naszych systemach produkcyjnych odkryliśmy 108 płatności PayPal o łącznej wartości **1899 USD**, które zostały utracone z powodu błędów przechwytywania PayPal. Płatności te wykazują powtarzalny schemat:

* Otrzymano `CHECKOUT.ORDER.APPROVED` webhooków
* Interfejs API przechwytywania PayPal zwrócił błąd 404
* Zamówienia stały się niedostępne za pośrednictwem interfejsu API PayPal

Nie da się ustalić, czy klienci zostali obciążeni opłatą, ponieważ PayPal całkowicie ukrywa dzienniki debugowania po 14 dniach i usuwa wszystkie dane z pulpitu nawigacyjnego dotyczące identyfikatorów zamówień, które nie zostały przechwycone.

Dotyczy to tylko jednej firmy. **Łączne straty tysięcy sprzedawców w ciągu ponad 11 lat prawdopodobnie wyniosą miliony dolarów.**

**Powtórzmy to jeszcze raz: łączne straty poniesione przez tysiące sprzedawców w ciągu ponad 11 lat prawdopodobnie wyniosą miliony dolarów.**

Odkryliśmy to tylko dlatego, że jesteśmy niesamowicie skrupulatni i opieramy się na danych.

### Oryginalny raport z 2013 r.: ponad 11 lat zaniedbań {#the-2013-original-report-11-years-of-negligence}

Najwcześniejszy udokumentowany raport dotyczący tego konkretnego problemu pojawił się pod adresem [Stack Overflow w listopadzie 2013 r.](https://stackoverflow.com/questions/19773755/keep-receiving-404-error-with-rest-api-when-doing-a-capture) ([zarchiwizowane](https://web.archive.org/web/20250708045416/https://stackoverflow.com/questions/19773755/keep-receiving-404-error-with-rest-api-when-doing-a-capture)):

> „Ciągle pojawia się błąd 404 w interfejsie API REST podczas przechwytywania”

Błąd zgłoszony w 2013 r. jest **identyczny** z tym, którego doświadczyła usługa Forward Email w 2024 r.:

```json
{
  "name": "INVALID_RESOURCE_ID",
  "message": "The requested resource ID was not found",
  "information_link": "https://developer.paypal.com/webapps/developer/docs/api/#INVALID_RESOURCE_ID",
  "debug_id": "e56bae98dcc26"
}
```

Odpowiedź społeczności w 2013 r. była wymowna:

> „W tej chwili występuje zgłoszony problem z interfejsem API REST. PayPal pracuje nad jego rozwiązaniem”.

**Minęło ponad 11 lat, a oni nadal nad tym „pracują”.**

### Wstęp 2016: PayPal psuje własny pakiet SDK {#the-2016-admission-paypal-breaks-their-own-sdk}

W 2016 roku repozytorium PayPala na GitHubie udokumentowało błąd [masowe awarie przechwytywania](https://github.com/paypal/PayPal-PHP-SDK/issues/660), który wpływał na ich oficjalny pakiet PHP SDK. Skala problemu była oszałamiająca:

> „Od 20.09.2016 r. wszystkie próby przechwycenia danych przez PayPal kończyły się niepowodzeniem z komunikatem 'INVALID_RESOURCE_ID - Nie znaleziono żądanego identyfikatora zasobu'. Między 19.09 a 20.09 nic nie zmieniano w kwestii integracji API. **100% prób przechwycenia danych od 20.09 zwróciło ten błąd.**”

Jeden ze sprzedawców poinformował:

> „W ciągu ostatnich 24 godzin miałem **ponad 1400 nieudanych prób przechwycenia**, wszystkie z błędem INVALID_RESOURCE_ID”.

Pierwszą reakcją PayPala było zrzucenie winy na sprzedawcę i skierowanie go do pomocy technicznej. Dopiero po ogromnej presji firma przyznała się do winy:

> „Otrzymałem aktualizację od naszych programistów produktu. Zauważyli, że w nagłówkach, które są wysyłane, identyfikator PayPal-Request-ID składa się z 42 znaków, ale **wygląda na to, że niedawno wprowadzono zmianę, która ogranicza ten identyfikator do zaledwie 38 znaków.**”

To przyznanie się ujawnia systematyczne zaniedbanie ze strony PayPala:

1. **Wprowadzili nieudokumentowane zmiany powodujące przerwy w działaniu**
2. **Zepsuli własny oficjalny pakiet SDK**
3. **Najpierw obwinili sprzedawców**
4. **Przyznali się do błędu dopiero pod presją**

Nawet po „naprawieniu” problemu sprzedawcy zgłaszali:

> „Zaktualizowano pakiet SDK do wersji 1.7.4 i **problem nadal występuje.**”

### Eskalacja 2024: Nadal zepsuta {#the-2024-escalation-still-broken}

Ostatnie raporty z zachowanej społeczności PayPal pokazują, że problem faktycznie się pogłębił. [Dyskusja z września 2024 r.](https://ppl.lithium.com/t5/REST-APIs/Receiving-APPROVED-Webhooks-for-Order-but-capture-leads-to-404/td-p/3176093) ([zarchiwizowane](https://web.archive.org/web/20250708045416/https://ppl.lithium.com/t5/REST-APIs/Receiving-APPROVED-Webhooks-for-Order-but-capture-leads-to-404/td-p/3176093)) dokumentuje dokładnie te same problemy:

> „Problem pojawił się dopiero około 2 tygodnie temu i nie dotyczy wszystkich zamówień. **Znacznie częściej występuje błąd 404 podczas przechwytywania.**”

Sprzedawca opisuje ten sam schemat działania, który wystąpił w przypadku przekazywania wiadomości e-mail:

> „Po próbie przechwycenia zamówienia PayPal zwraca błąd 404. Podczas pobierania szczegółów zamówienia: {'id': 'ID', 'intent': 'CAPTURE', 'status': 'COMPLETED', ..., 'final_capture': true, ...} **Nie ma żadnych śladów pomyślnego przechwycenia z naszej strony.**”

### Katastrofa niezawodności webhooka {#the-webhook-reliability-disaster}

Kolejny [zachowana dyskusja społeczności](https://ppl.lithium.com/t5/REST-APIs/Not-received-PAYMENT-CAPTURE-COMPLETED-when-had-captured/m-p/3042446) ujawnia, że system webhooków PayPala jest zasadniczo zawodny:

> "Teoretycznie powinny być dwa zdarzenia (CHECKOUT.ORDER.APPROVED i PAYMENT.CAPTURE.COMPLETED) ze zdarzenia webhook. W rzeczywistości **te dwa zdarzenia rzadko są odbierane od razu, zdarzenia PAYMENT.CAPTURE.COMPLETED nie można odebrać w większości przypadków lub zostanie odebrane w ciągu kilku godzin.**"

W przypadku płatności abonamentowych:

> "**Płatność.sprzedaż.zakończona' czasami nie była odbierana przez kilka godzin.**"

Pytania sprzedawcy ujawniają skalę problemów z wiarygodnością PayPala:

1. **„Dlaczego tak się dzieje?”** – System webhooków PayPal jest zasadniczo zepsuty.
2. **„Jeśli status zamówienia to „ZAKOŃCZONE”, czy mogę założyć, że otrzymałem pieniądze?”** – Sprzedawcy nie mogą ufać odpowiedziom API PayPal.
3. **„Dlaczego w „Dziennikach zdarzeń -> Zdarzenia webhooków” nie można znaleźć żadnych logów?”** – Nawet własny system rejestrowania zdarzeń PayPal nie działa.

### Schemat systematycznego zaniedbania {#the-pattern-of-systematic-negligence}

Dowody obejmują okres ponad 11 lat i wyraźnie pokazują następujący schemat:

* **2013**: „PayPal nad tym pracuje”
* **2016**: PayPal przyznaje się do wprowadzenia zmian i udostępnia poprawkę
* **2024**: Nadal występują te same błędy, wpływające na funkcję Forward Email i niezliczone inne

To nie błąd – **to systematyczne zaniedbanie.** PayPal wiedział o tych krytycznych błędach w przetwarzaniu płatności od ponad dekady i konsekwentnie:

1. **Obwinianie sprzedawców za błędy w systemie PayPal**
2. **Wprowadzanie nieudokumentowanych, szkodliwych zmian**
3. **Dostarczanie niewystarczających, niedziałających poprawek**
4. **Ignorowanie wpływu finansowego na firmy**
5. **Ukrywanie dowodów poprzez zamykanie forów społecznościowych**

### Nieudokumentowane wymaganie {#the-undocumented-requirement}

Nigdzie w oficjalnej dokumentacji PayPala nie ma wzmianki o konieczności implementacji logiki ponawiania prób dla operacji przechwytywania. W dokumentacji stwierdzono, że sprzedawcy powinni „przechwytywać natychmiast po zatwierdzeniu”, ale nie wspomniano, że ich API losowo zwraca błędy 404, wymagające złożonych mechanizmów ponawiania prób.

Zmusza to każdego sprzedawcę do:

* Implementacja logiki ponawiania prób z wykładniczym wycofywaniem
* Obsługa niespójnego dostarczania webhooków
* Budowanie złożonych systemów zarządzania stanem
* Ręczne monitorowanie nieudanych przechwytów

**Każdy inny operator płatności zapewnia niezawodne interfejsy API do przechwytywania, które działają od razu.**

## Szerszy schemat oszustw PayPala {#paypals-broader-pattern-of-deception}

Katastrofa związana z przechwytywaniem błędów jest tylko jednym z przykładów systematycznej metody PayPala mającej na celu oszukiwanie klientów i ukrywanie swoich błędów.

### Departament Usług Finansowych Nowego Jorku Działanie {#the-new-york-department-of-financial-services-action}

W styczniu 2025 r. Departament Usług Finansowych Nowego Jorku wydał nakaz [działania egzekucyjne przeciwko PayPal](https://www.dfs.ny.gov/system/files/documents/2025/01/ea20250123-paypal-inc.pdf) dotyczący nieuczciwych praktyk, co dowodzi, że schemat oszustw PayPala wykracza daleko poza jego interfejsy API.

Te działania regulacyjne pokazują, że PayPal jest skłonny do stosowania oszukańczych praktyk w całej swojej działalności, a nie tylko w narzędziach programistycznych.

### Pozew w sprawie miodu: przepisywanie linków afiliacyjnych {#the-honey-lawsuit-rewriting-affiliate-links}

Przejęcie Honey przez PayPal doprowadziło do sytuacji, w której [pozwy zarzucające Honey przepisywanie linków afiliacyjnych](https://www.theverge.com/2024/12/23/24328767/honey-paypal-lawsuit-affiliate-commission-influencer), kradnie prowizje twórcom treści i influencerom. To kolejna forma systematycznego oszustwa, w którym PayPal czerpie zyski z przekierowywania przychodów, które powinny trafić do innych.

Wzór jest jasny:

1. **Awarie API**: Ukrywanie wadliwych funkcji, obwinianie sprzedawców
2. **Wyciszanie społeczności**: Usuwanie dowodów problemów
3. **Naruszenia przepisów**: Stosowanie nieuczciwych praktyk
4. **Kradzież afiliacyjna**: Kradzież prowizji poprzez manipulację techniczną

### Koszt zaniedbania PayPala {#the-cost-of-paypals-negligence}

Strata Forward Email w wysokości 1899 dolarów to zaledwie wierzchołek góry lodowej. Rozważ szerszy wpływ:

* **Sprzedawcy indywidualni**: Tysiące tracą setki, a nawet tysiące dolarów
* **Klienci korporacyjni**: Potencjalnie miliony utraconych przychodów
* **Czas programistów**: Niezliczone godziny poświęcone na tworzenie obejść dla wadliwych interfejsów API PayPal
* **Zaufanie klientów**: Firmy tracą klientów z powodu problemów z płatnościami PayPal

Jeśli jedna mała usługa poczty e-mail straciła prawie 2000 dolarów, a problem ten istnieje od ponad 11 lat i dotyka tysiące sprzedawców, łączna strata finansowa może wynieść **setki milionów dolarów**.

### Kłamstwo dokumentacji {#the-documentation-lie}

Oficjalna dokumentacja PayPala konsekwentnie pomija istotne ograniczenia i błędy, na które mogą natrafić sprzedawcy. Na przykład:

* **API przechwytywania**: Brak wzmianki o tym, że błędy 404 są częste i wymagają logiki ponawiania.
* **Niezawodność webhooków**: Brak wzmianki o tym, że webhooki często mają kilkugodzinne opóźnienia.
* **Lista subskrypcji**: Dokumentacja sugeruje, że lista jest możliwa, gdy nie istnieje żaden punkt końcowy.
* **Limit czasu sesji**: Brak wzmianki o agresywnych 60-sekundowych limitach czasu.

To systematyczne pomijanie istotnych informacji zmusza sprzedawców do odkrywania ograniczeń systemu PayPal metodą prób i błędów w systemach produkcyjnych, co często skutkuje stratami finansowymi.

## Co to oznacza dla programistów {#what-this-means-for-developers}

Systematyczne pomijanie przez PayPal podstawowych potrzeb programistów przy jednoczesnym zbieraniu obszernych opinii świadczy o fundamentalnym problemie organizacyjnym. PayPal traktuje zbieranie opinii jako substytut faktycznego rozwiązywania problemów.

Wzór jest jasny:

1. Deweloperzy zgłaszają problemy
2. PayPal organizuje sesje opinii z kadrą kierowniczą
3. Dostarczany jest obszerny feedback
4. Zespoły przyznają się do luk i obiecują „śledzić i rozwiązywać problemy”
5. Nic nie zostaje wdrożone
6. Kadra kierownicza odchodzi do lepszych firm
7. Nowe zespoły proszą o te same opinie
8. Cykl się powtarza

Tymczasem programiści są zmuszeni stosować obejścia, naruszać bezpieczeństwo i radzić sobie z niedziałającymi interfejsami użytkownika, aby móc akceptować płatności.

Jeśli tworzysz system płatności, skorzystaj z naszego doświadczenia: stwórz [podejście trifecta](https://forwardemail.net/en/blog/docs/building-reliable-payment-system-stripe-paypal) z wieloma procesorami, ale nie oczekuj, że PayPal zapewni Ci podstawową funkcjonalność, której potrzebujesz. Zaplanuj obejścia już od pierwszego dnia.

> Ten wpis dokumentuje nasze 11-letnie doświadczenie z interfejsami API PayPal w Forward Email. Wszystkie przykłady kodu i linki pochodzą z naszych rzeczywistych systemów produkcyjnych. Pomimo tych problemów nadal obsługujemy płatności PayPal, ponieważ niektórzy klienci nie mają innego wyboru.

<img loading="lazy" src="/img/articles/paypal-api-issues.webp" alt="PayPal API disaster illustration" class="rounded-lg" />