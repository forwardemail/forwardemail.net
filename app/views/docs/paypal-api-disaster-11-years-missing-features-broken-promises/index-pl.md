# 11-letnia katastrofa API w PayPal: jak stworzyliśmy obejścia, podczas gdy oni ignorowali programistów {#paypals-11-year-api-disaster-how-we-built-workarounds-while-they-ignored-developers}

<img loading="lazy" src="/img/articles/pypl-disaster.webp" alt="" class="rounded-lg" />

<p class="lead mt-3">W Forward Email mamy do czynienia z zepsutymi interfejsami API PayPal od ponad dekady. To, co zaczęło się jako drobne frustracje, przerodziło się w kompletną katastrofę, która zmusiła nas do zbudowania własnych obejść, zablokowania ich szablonów phishingowych i ostatecznie zatrzymania wszystkich płatności PayPal podczas krytycznej migracji konta.</p>
<p class="lead mt-3">To historia 11 lat ignorowania przez PayPal podstawowych potrzeb programistów, podczas gdy my próbowaliśmy wszystkiego, aby ich platforma działała.</p>

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

A oto, co nas zadziwia: PayPal oferuje rozliczenia subskrypcyjne od 2014 r., ale nigdy nie umożliwił sprzedawcom oferowania własnych subskrypcji.

Pomyśl o tym przez sekundę. Możesz tworzyć subskrypcje, możesz je anulować, jeśli masz ID, ale nie możesz uzyskać listy wszystkich aktywnych subskrypcji dla swojego konta. To tak, jakby mieć bazę danych bez instrukcji SELECT.

Potrzebujemy tego do podstawowych operacji biznesowych:

* Obsługa klienta (gdy ktoś wysyła e-mail z pytaniem o subskrypcję)
* Sprawozdawczość finansowa i uzgadnianie
* Automatyczne zarządzanie fakturowaniem
* Zgodność i audyt

Ale PayPal? Oni po prostu... nigdy go nie zbudowali.

## 2014-2017: Problem się pojawia {#2014-2017-the-problem-emerges}

Problem z listą subskrypcji pojawił się po raz pierwszy na forach społeczności PayPal w 2017 r. Deweloperzy zadawali oczywiste pytanie: „Jak uzyskać listę wszystkich moich subskrypcji?”

Odpowiedź PayPal? Cisza.

Członkowie społeczności zaczęli się irytować:

> „Bardzo dziwne pominięcie, jeśli sprzedawca nie może wymienić wszystkich aktywnych Umów. Jeśli identyfikator Umowy zostanie utracony, oznacza to, że tylko użytkownik może anulować lub zawiesić umowę”. - leafspider

> „+1. Minęły prawie 3 lata.” - laudukang (co oznacza, że problem istniał od \~2014)

[oryginalny post społeczności](https://web.archive.org/web/20201019142512/https://www.paypal-community.com/t5/REST-API-SDK/List-all-subscriptions/td-p/1147066) z 2017 roku pokazuje, że programiści błagali o tę podstawową funkcjonalność. Odpowiedzią PayPala było zarchiwizowanie repozytorium, w którym użytkownicy zgłaszali problem.

## 2020: Udzielamy im obszernej informacji zwrotnej {#2020-we-give-them-extensive-feedback}

W październiku 2020 r. PayPal zwrócił się do nas z prośbą o formalną sesję opinii. Nie była to zwykła pogawędka — zorganizowali 45-minutową rozmowę w Microsoft Teams z 8 dyrektorami PayPal, w tym Sri Shivanandą (CTO), Edwinem Aoki, Jimem Magatsem, Johnem Kunze i innymi.

### Lista opinii składająca się z 27 elementów {#the-27-item-feedback-list}

Przyjechaliśmy przygotowani. Po 6 godzinach prób integracji z ich API, skompilowaliśmy 27 konkretnych problemów. Mark Stuart z zespołu PayPal Checkout powiedział:

> Hej Nick, dzięki za podzielenie się tym ze wszystkimi dzisiaj! Myślę, że to będzie katalizatorem do uzyskania większego wsparcia i inwestycji dla naszego zespołu, aby naprawić te rzeczy. Trudno było uzyskać tak bogate opinie, jak te, które nam zostawiłeś do tej pory.

Informacje zwrotne nie były teoretyczne – pochodziły z rzeczywistych prób integracji:

1. **Generowanie tokena dostępu nie działa**:

> Generowanie tokenów dostępu nie działa. Powinno być też więcej niż tylko przykłady cURL.

2. **Brak interfejsu internetowego do tworzenia subskrypcji**:

> Jak do cholery można tworzyć subskrypcje bez konieczności używania cURL? Wydaje się, że nie ma internetowego interfejsu użytkownika, który by to umożliwiał (jak Stripe)

Mark Stuart uważał, że problem z tokenem dostępowym jest szczególnie niepokojący:

> Zazwyczaj nie słyszymy o problemach związanych z generowaniem tokenów dostępu.

### Zespoły zaangażowały się, złożono obietnice {#teams-got-involved-promises-were-made}

W miarę jak odkrywaliśmy więcej problemów, PayPal dodawał do rozmowy kolejne zespoły. Darshan Raju z zespołu zarządzania subskrypcjami dołączył i powiedział:

> Uznaj lukę. Będziemy to śledzić i rozwiązywać. Jeszcze raz dziękujemy za opinię!

Sesja została opisana jako mająca na celu:

> szczery opis Twojego doświadczenia

Do:

> uczynić PayPal tym, czym powinien być dla programistów.

### Wynik? Nic. {#the-result-nothing}

Pomimo formalnej sesji informacyjnej, obszerna lista składająca się z 27 pozycji, zaangażowanie wielu zespołów i obietnice:

> śledzenie i adresowanie

problemów, absolutnie nic nie zostało naprawione.

## Exodus kadry kierowniczej: jak PayPal utracił całą pamięć instytucjonalną {#the-executive-exodus-how-paypal-lost-all-institutional-memory}

Tutaj robi się naprawdę ciekawie. Każda osoba, która otrzymała naszą opinię z 2020 r., opuściła PayPal:

**Zmiany w kierownictwie:**

* [Dan Schulman (CEO przez 9 lat) → Alex Chriss](https://www.fastcompany.com/90938418/paypal-ceo-alex-chriss-dan-schulman-what-to-know/) (wrzesień 2023)
* [Sri Shivananda (dyrektor techniczny, który zorganizował feedback) → JPMorgan Chase](https://www.pymnts.com/personnel/2024/jpmorgan-names-paypal-vet-shivananda-as-new-tech-chief/) (styczeń 2024)

**Liderzy techniczni, którzy złożyli obietnice, a potem odeszli:**

* **Mark Stuart** (obiecana opinia miała być „katalizatorem”) → [Teraz w Ripple](https://www.linkedin.com/in/markstuartsf)
* **Jim Magats** (weteran PayPala z 18-letnim stażem) → [Dyrektor generalny MX](https://www.cnbc.com/2022/07/28/paypal-veteran-jim-magats-is-named-ceo-of-mx-the-startup-that-connects-banks-and-fintech-players.html) (2022)
* **John Kunze** (wiceprezes ds. globalnych produktów konsumenckich) → [Emerytowany](https://www.linkedin.com/in/john-kunze-5724a86) (2023)
* **Edwin Aoki** (jeden z ostatnich pozostałych) → [Właśnie wyjechałem na Nasdaq](https://www.linkedin.com/posts/edwinaoki_apparently-i-just-cant-stay-awaythe-day-activity-7289388518487793664-j8OZ) (styczeń 2025)

PayPal stał się drzwiami obrotowymi, za pomocą których dyrektorzy zbierają opinie od programistów, składają obietnice, a następnie odchodzą do lepszych firm, takich jak JPMorgan, Ripple i inne firmy fintech.

To wyjaśnia, dlaczego odpowiedź GitHub na problem z 2025 r. wydawała się zupełnie oderwana od naszej opinii z 2020 r. — dosłownie każda osoba, która otrzymała tę opinię, opuściła PayPal.

## 2025: Nowe kierownictwo, te same problemy {#2025-new-leadership-same-problems}

Przewińmy do 2025 r., a pojawi się dokładnie ten sam schemat. Po latach bez postępu nowe kierownictwo PayPala znów się zwraca.

### Nowy dyrektor generalny angażuje się {#the-new-ceo-gets-involved}

30 czerwca 2025 r. zwróciliśmy się bezpośrednio do nowego CEO PayPal, Alexa Chrissa. Jego odpowiedź była krótka:

> Cześć Nick – Dziękuję za kontakt i opinię. Michelle (w kopii) jest na miejscu ze swoim zespołem, aby zaangażować się i wspólnie z Tobą to przepracować. Dzięki -A

### Odpowiedź Michelle Gill {#michelle-gills-response}

Michelle Gill, wiceprezes wykonawczy i dyrektor generalny ds. małych firm i usług finansowych, odpowiedziała:

> Dziękuję bardzo Nick, przenoszę Alex do UDW. Przyglądaliśmy się temu od czasu Twojego wcześniejszego posta. Zadzwonimy do Ciebie przed końcem tygodnia. Czy możesz przesłać mi swoje dane kontaktowe, aby któryś z moich współpracowników mógł się z Tobą skontaktować. Michelle

### Nasza odpowiedź: Koniec ze spotkaniami {#our-response-no-more-meetings}

Odrzuciliśmy kolejne spotkanie, tłumacząc nasze rozczarowanie:

> Dziękuję. Jednak nie wydaje mi się, żeby rozmowa telefoniczna cokolwiek dała. Oto dlaczego... Kiedyś rozmawiałem przez telefon i nic z tego nie wyszło. Straciłem ponad 2 godziny na rozmowy z całym zespołem i kierownictwem i nic nie zostało zrobione... Mnóstwo maili w tę i z powrotem. Absolutnie nic nie zrobiono. Opinie nie poszły nigdzie. Próbowałem przez lata, żeby mnie wysłuchano, a potem nic z tego nie wyszło.

### Odpowiedź Marty'ego Brodbecka na nadmierną inżynierię {#marty-brodbecks-overengineering-response}

Następnie odezwał się Marty Brodbeck, szef działu inżynierii konsumenckiej w firmie PayPal:

> Cześć Nick, tu Marty Brodbeck. Kieruję całą inżynierią konsumencką w PayPal i kierowałem rozwojem API dla firmy. Czy możemy się skontaktować w sprawie problemu, z którym się borykasz i jak możemy pomóc.

Gdy wyjaśniliśmy prostą potrzebę punktu końcowego listy subskrypcji, jego odpowiedź ujawniła dokładny problem:

> Dzięki Nick, jesteśmy w trakcie tworzenia pojedynczego interfejsu API subskrypcji z pełnym zestawem SDK (obsługującym pełną obsługę błędów, śledzenie subskrypcji na podstawie zdarzeń, solidny czas sprawności), w którym rozliczenia będą również oddzielone jako osobne API dla sprzedawców, zamiast konieczności koordynacji działań w wielu punktach końcowych w celu uzyskania jednej odpowiedzi.

To jest dokładnie złe podejście. Nie potrzebujemy miesięcy skomplikowanej architektury. Potrzebujemy jednego prostego punktu końcowego REST, który wymienia subskrypcje — czegoś, co powinno istnieć od 2014 r.

```http
GET /v1/billing/subscriptions
Authorization: Bearer {access_token}
```

### Sprzeczność „prostego CRUD” {#the-simple-crud-contradiction}

Gdy zwróciliśmy uwagę, że jest to podstawowa funkcjonalność CRUD, która powinna istnieć od 2014 r., odpowiedź Marty'ego była wymowna:

> Proste operacje CRUD są częścią podstawowego API, mój przyjacielu, więc nie zajmie to miesięcy rozwoju

Pakiet PayPal TypeScript SDK, który po miesiącach rozwoju obsługuje obecnie tylko trzy punkty końcowe, a także jego historyczny harmonogram, wyraźnie pokazują, że ukończenie takich projektów zajmuje więcej niż kilka miesięcy.

Ta odpowiedź pokazuje, że nie rozumie on własnego API. Jeśli „proste operacje CRUD są częścią podstawowego API”, to gdzie jest punkt końcowy listy subskrypcji? Odpowiedzieliśmy:

> Jeśli „proste operacje CRUD są częścią podstawowego API”, to gdzie jest punkt końcowy listy subskrypcji? Deweloperzy domagają się tej „prostej operacji CRUD” od 2014 r. Minęło 11 lat. Każdy inny procesor płatności ma tę podstawową funkcjonalność od pierwszego dnia.

### Rozłączenie staje się jasne {#the-disconnect-becomes-clear}

Rozmowy z Alexem Chrissem, Michelle Gill i Martym Brodbeckiem w 2025 r. pokazują tę samą dysfunkcję organizacyjną:

1. **Nowe kierownictwo nie ma wiedzy o poprzednich sesjach informacji zwrotnej**
2. **Proponują te same przekombinowane rozwiązania**
3. **Nie rozumieją własnych ograniczeń API**
4. **Chcą więcej spotkań zamiast po prostu rozwiązać problem**

Ten schemat wyjaśnia, dlaczego zespoły PayPal w 2025 r. zdają się zupełnie nie rozumieć obszernej informacji zwrotnej przekazanej w 2020 r. — osoby, które ją otrzymały, odeszły, a nowe kierownictwo powtarza te same błędy.

## Lata raportów o błędach, które zignorowali {#years-of-bug-reports-they-ignored}

Nie narzekaliśmy tylko na brakujące funkcje. Aktywnie zgłaszaliśmy błędy i staraliśmy się pomóc w ich ulepszeniu. Oto kompleksowa oś czasu problemów, które udokumentowaliśmy:

### 2016: Wczesne skargi dotyczące interfejsu użytkownika/doświadczenia użytkownika {#2016-early-uiux-complaints}

Nawet w 2016 r. publicznie zwracaliśmy się do kierownictwa PayPal, w tym do Dana Schulmana, o problemy z interfejsem i użytecznością. Było to 9 lat temu, a te same problemy z UI/UX nadal występują.

### 2021: Raport o błędzie w poczcie firmowej {#2021-business-email-bug-report}

W marcu 2021 r. poinformowaliśmy, że system poczty e-mail firmy PayPal wysyłał nieprawidłowe powiadomienia o anulowaniu. Szablon wiadomości e-mail zawierał zmienne renderowane nieprawidłowo, co powodowało wyświetlanie klientom mylących wiadomości.

Mark Stuart przyznał, że problem istnieje:

> Dzięki Nick! Przechodzę do BCC. @Prasy, czy twój zespół jest odpowiedzialny za tego e-maila, czy wiesz, kto jest? „Niftylettuce, LLC, nie będziemy już wystawiać rachunków” sugeruje mi, że doszło do pomyłki w adresacie i treści e-maila.

**Wynik**: Naprawili to! Mark Stuart potwierdził:

> Właśnie usłyszałem od zespołu ds. powiadomień, że szablon e-maila został naprawiony i wdrożony. Doceniam, że skontaktowałeś się z nami, aby to zgłosić. Dziękuję!

To pokazuje, że MOGĄ naprawić rzeczy, kiedy chcą – po prostu w przypadku większości problemów nie robią tego sami.

### 2021: Sugestie dotyczące ulepszeń interfejsu użytkownika {#2021-ui-improvement-suggestions}

W lutym 2021 r. udostępniliśmy szczegółowe informacje zwrotne na temat interfejsu użytkownika pulpitu nawigacyjnego, w szczególności sekcji „Ostatnia aktywność w serwisie PayPal”:

> Myślę, że panel na paypal.com, a konkretnie „PayPal Recent Activity” wymaga udoskonalenia. Nie sądzę, że powinieneś pokazywać wiersze statusu $0 Recurring payment „Created” – dodaje to tylko mnóstwo dodatkowych wierszy i nie możesz łatwo zobaczyć na pierwszy rzut oka, ile dochodu generujesz w ciągu dnia/kilku ostatnich dni.

Mark Stuart przesłał wiadomość do zespołu zajmującego się produktami konsumenckimi:

> Dzięki! Nie jestem pewien, który zespół odpowiada za Activity, ale przesłałem to do szefa produktów konsumenckich, aby znaleźć właściwy zespół. Płatność cykliczna w wysokości 0,00 USD wydaje się błędem. Prawdopodobnie powinna zostać odfiltrowana.

**Wynik**: Nigdy nie naprawiono. Interfejs użytkownika nadal pokazuje te bezużyteczne wpisy $0.

### 2021: Awarie środowiska piaskownicy {#2021-sandbox-environment-failures}

W listopadzie 2021 r. zgłosiliśmy krytyczne problemy ze środowiskiem testowym PayPal:

* Klucze tajnego API Sandbox zostały losowo zmienione i wyłączone
* Wszystkie konta testowe Sandbox zostały usunięte bez powiadomienia
* Komunikaty o błędach podczas próby wyświetlenia szczegółów konta Sandbox
* Sporadyczne awarie ładowania

> Z jakiegoś powodu mój klucz API tajnego sandboxa został zmieniony i wyłączony. Ponadto wszystkie moje stare konta testowe sandboxa zostały usunięte.

> Czasami ładują się, a czasami nie. To jest niesamowicie frustrujące.

**Wynik**: Brak odpowiedzi, brak poprawki. Deweloperzy nadal mają problemy z niezawodnością piaskownicy.

### 2021: System raportów jest całkowicie uszkodzony {#2021-reports-system-completely-broken}

W maju 2021 r. poinformowaliśmy, że system pobierania raportów o transakcjach PayPal jest całkowicie uszkodzony:

> Wygląda na to, że raportowanie pobierania nie działa teraz i nie działało przez cały dzień. Powinienem też prawdopodobnie otrzymać powiadomienie e-mail, jeśli się nie powiedzie.

Zwróciliśmy również uwagę na katastrofę w zarządzaniu sesjami:

> Również jeśli jesteś nieaktywny, będąc zalogowanym do PayPal przez około 5 minut, zostaniesz wylogowany. Więc kiedy odświeżysz przycisk ponownie obok raportu, którego status chcesz sprawdzić (po wiecznym czekaniu), to jest to cholernie trudne, żeby się ponownie zalogować.

Mark Stuart przyznał, że występuje problem z przekroczeniem limitu czasu sesji:

> Pamiętam, że kiedyś zgłaszałeś, że Twoja sesja często wygasała i zakłócała proces tworzenia oprogramowania, gdy przełączałeś się między środowiskiem IDE a developer.paypal.com lub panelem sprzedawcy, po czym wracałeś i znowu się wylogowywałeś.

**Wynik**: Limity czasu sesji nadal wynoszą 60 sekund. System raportów nadal regularnie zawodzi.

### 2022: Brak głównej funkcji API (ponownie) {#2022-core-api-feature-missing-again}

W styczniu 2022 r. ponownie zwróciliśmy uwagę na kwestię subskrypcji, tym razem podając jeszcze więcej szczegółów na temat błędów w dokumentacji:

> Nie ma GET, który wyświetlałby wszystkie subskrypcje (wcześniej nazywane umowami rozliczeniowymi)

Odkryliśmy, że ich oficjalna dokumentacja była całkowicie niedokładna:

> Dokumentacja API jest również całkowicie niedokładna. Myśleliśmy, że możemy obejść problem, pobierając zakodowaną na stałe listę identyfikatorów subskrypcji. Ale to nawet nie działa!

> Z oficjalnej dokumentacji tutaj... Jest tam napisane, że można to zrobić... A tu jest haczyk - nigdzie nie ma pola „Identyfikator subskrypcji”, które można by zaznaczyć.

Christina Monti z PayPal odpowiedziała:

> Przepraszamy za frustrację spowodowaną błędnym wykonaniem tych kroków. Poprawimy to w tym tygodniu.

Sri Shivananda (CTO) podziękował nam:

> Dziękujemy za stałą pomoc w czynieniu nas lepszymi. Bardzo doceniamy.

**Wynik**: Dokumentacja nigdy nie została naprawiona. Punkt końcowy listy subskrypcji nigdy nie został utworzony.

## Koszmar dla programistów {#the-developer-experience-nightmare}

Praca z API PayPala to jak cofnięcie się w czasie o 10 lat. Oto problemy techniczne, które udokumentowaliśmy:

### Uszkodzony interfejs użytkownika {#broken-user-interface}

Panel programisty PayPal to katastrofa. Oto, z czym mamy do czynienia na co dzień:

<figure>
<figcaption><div class="alert alert-danger small text-center">
Interfejs użytkownika PayPal jest tak zepsuty, że nie można nawet odrzucić powiadomień
</div></figcaption>
<video class="lazyframe-bordinated" loading="lazy" controls>
<source src="/img/articles/pypl-notifications.mp4" type="video/mp4">
Twoja przeglądarka nie obsługuje znacznika wideo.
</video>
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
Panel programisty dosłownie każe przeciągnąć suwak, a następnie wylogowuje po 60 sekundach
</div></figcaption>
<video class="lazyframe-bordinated" loading="lazy" controls>
<source src="/img/articles/pypl-kapture-1.mp4" type="video/mp4">
Twoja przeglądarka nie obsługuje znacznika wideo.
</video>
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
Więcej katastrof UI w interfejsie programisty PayPal pokazujących uszkodzone przepływy pracy
</div></figcaption>
<video class="lazyframe-bordinated" loading="lazy" controls>
<source src="/img/articles/pypl-kapture-2.mp4" type="video/mp4">
Twoja przeglądarka nie obsługuje znacznika wideo.
</video>
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
Interfejs zarządzania subskrypcjami — interfejs jest tak zły, że musieliśmy polegać na kodzie, aby generować produkty i plany subskrypcji
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-subscriptions.png" alt="" class="rounded-lg" />
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
Widok zepsutego interfejsu subskrypcji z brakującą funkcjonalnością (nie można łatwo tworzyć produktów/planów/subskrypcji &ndash; i nie wydaje się, aby istniał jakikolwiek sposób na usunięcie produktów ani planów po ich utworzeniu w interfejsie użytkownika)
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-subscriptions-2.png" alt="" class="rounded-lg" />
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
Typowe komunikaty o błędach PayPal - tajemnicze i nieprzydatne
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-errors.png" alt="" class="rounded-lg" />
</figure>

Problemy z pakietem SDK ### {#sdk-problems}

* Nie można obsługiwać jednorazowych płatności i subskrypcji bez skomplikowanych obejść obejmujących zamianę i ponowne renderowanie przycisków podczas ponownego ładowania zestawu SDK za pomocą znaczników skryptu
* Zestaw SDK JavaScript narusza podstawowe konwencje (nazwy klas małymi literami, brak sprawdzania instancji)
* Komunikaty o błędach nie wskazują, które pola są brakujące
* Niespójne typy danych (wymagające kwot w postaci ciągu zamiast liczb)

### Naruszenia zasad bezpieczeństwa treści {#content-security-policy-violations}

Ich zestaw SDK wymaga opcji unsafe-inline i unsafe-eval w CSP, **zmuszając Cię do naruszenia bezpieczeństwa Twojej witryny**.

### Chaos dokumentacji {#documentation-chaos}

Sam Mark Stuart przyznał:

> Zgadzam się, że jest absurdalnie dużo starszych i nowych API. Naprawdę trudno znaleźć, czego szukać (nawet dla nas, którzy tu pracujemy).

### Luki w zabezpieczeniach {#security-vulnerabilities}

**Implementacja 2FA w PayPal jest odwrotna**. Nawet z włączonymi aplikacjami TOTP wymuszają weryfikację SMS, co czyni konta podatnymi na ataki SIM swap. Jeśli masz włączony TOTP, powinien on używać go wyłącznie. Rozwiązaniem awaryjnym powinien być e-mail, a nie SMS.

### Katastrofa zarządzania sesją {#session-management-disaster}

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
<img loading="lazy" src="/img/articles/pypl-something-went-wrong.png" alt="" class="rounded-lg" />
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
Wsparcie PayPala twierdzi, że wszystko działało prawidłowo, podczas gdy płatności były całkowicie niedostępne. W ostatniej wiadomości piszą, że „przywrócili niektóre funkcje”, ale nadal proszą o więcej nieokreślonych informacji – typowy teatrzyk pomocy technicznej PayPal.
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-help-center-1.png" alt="" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-help-center-2.png" alt="" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-help-center-3.png" alt="" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-help-center-4.png" alt="" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-help-center-5.png" alt="" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-help-center-6.png" alt="" class="rounded-lg" />
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
Proces weryfikacji tożsamości, który rzekomo niczego nie „naprawił”
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-take-care-1.png" alt="" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-take-care-2.png" alt="" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-take-care-3.png" alt="" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-take-care-4.png" alt="" class="rounded-lg" />
<img loading="lazy" src="/img/articles/pypl-take-care-5.png" alt="" class="rounded-lg" />
<img loading="leniwy" src="/img/articles/pypl-take-care-6.png" alt="" class="rounded-lg" />
<img loading="leniwy" src="/img/articles/pypl-take-care-7.png" alt="" class="rounded-lg" />
</figure>

<figure>
<figcaption><div class="alert alert-danger small text-center">
Niejasny komunikat i nadal brak rozwiązania. Brak informacji, powiadomień i jakichkolwiek informacji o tym, jakie dodatkowe informacje są potrzebne. Obsługa klienta milczy.
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-restored.png" alt="" class="rounded-lg" />
</figure>

## Dlaczego nie możemy po prostu zrezygnować z PayPala {#why-we-cant-just-drop-paypal}

Pomimo tych wszystkich problemów nie możemy całkowicie zrezygnować z PayPala, ponieważ niektórzy klienci korzystają tylko z PayPala jako opcji płatności. Jak napisał jeden z klientów na naszym profilu [strona statusu](https://github.com/forwardemail/status.forwardemail.net/issues/1658#issuecomment-3026530515):

> PayPal jest moją jedyną opcją płatności

**Jesteśmy zmuszeni wspierać zepsutą platformę, ponieważ PayPal stworzył monopol płatniczy dla niektórych użytkowników.**

## Rozwiązanie problemu społeczności {#the-community-workaround}

Ponieważ PayPal nie oferuje podstawowej funkcjonalności listy subskrypcji, społeczność programistów opracowała obejścia. Stworzyliśmy skrypt, który pomaga zarządzać subskrypcjami PayPal: [set-active-pypl-subscription-ids.js](https://github.com/forwardemail/forwardemail.net/blob/master/scripts/set-active-pypl-subscription-ids.js)

Ten skrypt odwołuje się do [sedno społeczności](https://gist.github.com/titanism/955f0c21d53e8c98068c549fb79e75d4), gdzie programiści dzielą się rozwiązaniami. Użytkownicy są w rzeczywistości [dziękując nam](https://gist.github.com/titanism/955f0c21d53e8c98068c549fb79e75d4?permalink_comment_id=5045775#gistcomment-5045775) za udostępnienie tego, co PayPal powinien był stworzyć lata temu.

## Blokowanie szablonów PayPal z powodu phishingu {#blocking-paypal-templates-due-to-phishing}

Problemy wykraczają poza interfejsy API. Szablony wiadomości e-mail PayPal są tak źle zaprojektowane, że musieliśmy wdrożyć specjalne filtry w naszej usłudze e-mail, ponieważ nie da się ich odróżnić od prób phishingu.

### Prawdziwy problem: szablony PayPal wyglądają jak oszustwa {#the-real-problem-paypals-templates-look-like-scams}

Regularnie otrzymujemy zgłoszenia dotyczące e-maili PayPal, które wyglądają dokładnie jak próby phishingu. Oto przykład z naszych raportów o nadużyciach:

**Temat:** `[Sandbox] TEST - New invoice from PaypalBilling434567 sandbox #A4D369E8-0001`

Ta wiadomość została przesłana na adres `abuse@microsoft.com`, ponieważ wyglądała na próbę phishingu. Problem? W rzeczywistości pochodziła ze środowiska testowego PayPal, ale ich szablon jest tak słaby, że uruchamia systemy wykrywania phishingu.

### Nasza implementacja {#our-implementation}

Nasz filtr specyficzny dla systemu PayPal zaimplementowany jest w naszym [kod filtrujący e-maile](https://github.com/forwardemail/forwardemail.net/blob/3b45c70391b5b572b2568749d71be3f7198cd995/helpers/is-arbitrary.js#L151-L172):

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

### Wpływ na świat rzeczywisty: nowe oszustwa PayPal {#real-world-impact-novel-paypal-scams}

Problem wykracza poza kiepski projekt szablonu. System faktur PayPal jest tak łatwy do wykorzystania, że oszuści regularnie go wykorzystują, wysyłając pozornie fałszywe faktury. Badacz bezpieczeństwa Gavin Anderegg udokumentował przypadek [Nowe oszustwo PayPal](https://anderegg.ca/2023/02/01/a-novel-paypal-scam), w którym oszuści wysyłają prawdziwe faktury PayPal, które przechodzą wszystkie testy uwierzytelniania:

> „Po sprawdzeniu źródła okazało się, że e-mail rzeczywiście pochodzi z PayPala (zatwierdzono SPF, DKIM i DMARC). Przycisk zawierał również link do adresu URL, który wyglądał na legalny w serwisie PayPal... Dopiero po chwili dotarło do mnie, że to prawdziwy e-mail. Właśnie dostałem losową „fakturę” od oszusta”.

<figure>
<figcaption><div class="alert alert-danger small text-center">
Zrzut ekranu przedstawiający wiele fałszywych faktur PayPal zalewających skrzynkę odbiorczą, wszystkie wyglądające na autentyczne, ponieważ w rzeczywistości pochodzą z systemów PayPal.
</div></figcaption>
<img loading="lazy" src="/img/articles/pypl-paypal-scam.png" alt="" class="rounded-lg" />
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
* **Utrata przychodów** w okresach krytycznych dla firmy
* **Naruszenie zaufania klientów** w przypadku tajemniczych niepowodzeń płatności

### Katastrofa migracji kont w lipcu 2025 r. {#the-july-2025-account-migration-disaster}

Dokładnie taki scenariusz miał miejsce podczas naszej rutynowej migracji konta w lipcu 2025 roku. PayPal początkowo zezwalał na płatności, a potem nagle je zablokował bez powiadomienia. Problem odkryliśmy dopiero, gdy klienci zaczęli zgłaszać, że nie mogą zapłacić.

Kiedy skontaktowaliśmy się z pomocą techniczną, otrzymaliśmy sprzeczne odpowiedzi dotyczące potrzebnej dokumentacji, bez jasnego terminu rozwiązania problemu. Zmusiło nas to do całkowitego wstrzymania płatności PayPal, co wprowadziło klientów, którzy nie mieli innych opcji płatności, w błąd.

### Dlaczego to jest ważne {#why-this-matters}

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

### Co oferują inni procesorzy w porównaniu z PayPal {#what-other-processors-provide-vs-paypal}

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

### Ratunek zewnętrzny {#the-third-party-rescue}

Na szczęście zewnętrzna usługa [ppl.lithium.com](https://ppl.lithium.com/) zachowała część treści, umożliwiając nam dostęp do dyskusji, które PayPal próbował ukryć. Jednak ta zewnętrzna usługa jest niekompletna i może zniknąć w każdej chwili.

Ten schemat ukrywania dowodów nie jest nowy dla PayPala. Mają udokumentowaną historię:

* Usuwanie krytycznych raportów o błędach z widoku publicznego
* Wycofanie narzędzi programistycznych bez powiadomienia
* Zmiana interfejsów API bez odpowiedniej dokumentacji
* Uciszanie dyskusji społeczności na temat ich błędów

Zamknięcie forum stanowi jak dotąd najbardziej bezczelną próbę ukrycia przed opinią publiczną systematycznych zaniedbań.

## Katastrofa związana z 11-letnimi szkodnikami: 1899 dolarów i wciąż rośnie {#the-11-year-capture-bug-disaster-1899-and-counting}

Podczas gdy PayPal był zajęty organizowaniem sesji opinii i składaniem obietnic, ich główny system przetwarzania płatności był zasadniczo zepsuty od ponad 11 lat. Dowody są druzgocące.

### Strata w wysokości 1899 USD z tytułu przekazania wiadomości e-mail {#forward-emails-1899-loss}

W naszych systemach produkcyjnych odkryliśmy 108 płatności PayPal o łącznej wartości **1899 USD**, które zostały utracone z powodu błędów przechwytywania PayPal. Płatności te wykazują powtarzalny schemat:

* Otrzymano webhooki `CHECKOUT.ORDER.APPROVED`
* Interfejs API PayPala do przechwytywania zwrócił błąd 404
* Zamówienia stały się niedostępne za pośrednictwem interfejsu API PayPala

Nie da się ustalić, czy klienci zostali obciążeni opłatą, ponieważ PayPal całkowicie ukrywa dzienniki debugowania po 14 dniach i usuwa wszystkie dane z pulpitu nawigacyjnego dotyczące identyfikatorów zamówień, które nie zostały przechwycone.

Dotyczy to tylko jednej firmy. **Łączne straty tysięcy sprzedawców w ciągu ponad 11 lat prawdopodobnie wyniosą miliony dolarów.**

**Powtórzmy to jeszcze raz: łączne straty poniesione przez tysiące sprzedawców w ciągu ponad 11 lat prawdopodobnie wyniosą miliony dolarów.**

Odkryliśmy to tylko dlatego, że jesteśmy niesamowicie skrupulatni i opieramy się na danych.

### Oryginalny raport z 2013 r.: ponad 11 lat zaniedbań {#the-2013-original-report-11-years-of-negligence}

Najwcześniejszy udokumentowany raport na temat tego konkretnego problemu pojawia się pod adresem [Stack Overflow w listopadzie 2013 r.](https://stackoverflow.com/questions/19773755/keep-receiving-404-error-with-rest-api-when-doing-a-capture) ([zarchiwizowane](https://web.archive.org/web/20250708045416/https://stackoverflow.com/questions/19773755/keep-receiving-404-error-with-rest-api-when-doing-a-capture)):

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

### Wstęp 2016: PayPal łamie własny pakiet SDK {#the-2016-admission-paypal-breaks-their-own-sdk}

W 2016 roku repozytorium PayPala na GitHubie udokumentowało błąd [masowe awarie przechwytywania](https://github.com/paypal/PayPal-PHP-SDK/issues/660), który wpływał na ich oficjalny pakiet PHP SDK. Skala była oszałamiająca:

> „Od 20.09.2016 r. wszystkie próby przechwycenia danych przez PayPal kończyły się niepowodzeniem z komunikatem 'INVALID_RESOURCE_ID - Nie znaleziono żądanego identyfikatora zasobu'. Między 19.09 a 20.09 nic nie zmieniano w integracji API. **100% prób przechwycenia danych od 20.09 zwróciło ten błąd.**”

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

Ostatnie raporty z zachowanej społeczności PayPal pokazują, że problem w rzeczywistości się pogłębił. [Dyskusja z września 2024 r.](https://ppl.lithium.com/t5/REST-APIs/Receiving-APPROVED-Webhooks-for-Order-but-capture-leads-to-404/td-p/3176093) ([zarchiwizowane](https://web.archive.org/web/20250708045416/https://ppl.lithium.com/t5/REST-APIs/Receiving-APPROVED-Webhooks-for-Order-but-capture-leads-to-404/td-p/3176093)) dokumentuje dokładnie te same problemy:

> „Problem pojawił się dopiero około 2 tygodnie temu i nie dotyczy wszystkich zamówień. **Znacznie częściej występuje błąd 404 podczas przechwytywania.**”

Sprzedawca opisuje ten sam schemat działania, który wystąpił w przypadku przekazywania wiadomości e-mail:

> „Po próbie przechwycenia zamówienia PayPal zwraca błąd 404. Podczas pobierania szczegółów zamówienia: {'id': 'ID', 'intent': 'CAPTURE', 'status': 'COMPLETED', ..., 'final_capture': true, ...} **Nie ma żadnych śladów pomyślnego przechwycenia z naszej strony.**”

### Katastrofa niezawodności webhooków {#the-webhook-reliability-disaster}

Kolejny [zachowana dyskusja społeczności](https://ppl.lithium.com/t5/REST-APIs/Not-received-PAYMENT-CAPTURE-COMPLETED-when-had-captured/m-p/3042446) ujawnia, że system webhook PayPala jest zasadniczo zawodny:

> "Teoretycznie powinny być dwa zdarzenia (CHECKOUT.ORDER.APPROVED i PAYMENT.CAPTURE.COMPLETED) ze zdarzenia webhook. W rzeczywistości **te dwa zdarzenia rzadko są odbierane od razu, zdarzenia PAYMENT.CAPTURE.COMPLETED nie można odebrać w większości przypadków lub zostanie odebrane w ciągu kilku godzin.**"

W przypadku płatności abonamentowych:

> "**'PŁATNOŚĆ.SPRZEDAŻ.ZAKOŃCZONA' nie była czasami odbierana przez kilka godzin.**"

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

### Departament Usług Finansowych Nowego Jorku Akcja {#the-new-york-department-of-financial-services-action}

W styczniu 2025 r. Departament Usług Finansowych Nowego Jorku wydał nakaz [działania egzekucyjne przeciwko PayPal](https://www.dfs.ny.gov/system/files/documents/2025/01/ea20250123-paypal-inc.pdf) dotyczący nieuczciwych praktyk, co dowodzi, że schemat oszustw PayPala wykracza daleko poza jego interfejsy API.

Te działania regulacyjne pokazują, że PayPal jest skłonny do stosowania oszukańczych praktyk w całej swojej działalności, a nie tylko w narzędziach programistycznych.

### Pozew w sprawie miodu: przepisywanie linków afiliacyjnych {#the-honey-lawsuit-rewriting-affiliate-links}

Przejęcie Honey przez PayPal doprowadziło do [pozwy zarzucające Honey przepisywanie linków afiliacyjnych](https://www.theverge.com/2024/12/23/24328767/honey-paypal-lawsuit-affiliate-commission-influencer), czyli kradzieży prowizji od twórców treści i influencerów. To kolejna forma systematycznego oszustwa, w którym PayPal czerpie zyski z przekierowywania przychodów, które powinny trafić do innych.

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

Jeśli jedna mała usługa poczty e-mail straciła prawie 2000 dolarów, a problem ten istnieje od ponad 11 lat i dotyka tysiące sprzedawców, łączna strata finansowa prawdopodobnie wyniesie **setki milionów dolarów**.

### Kłamstwo w dokumentacji {#the-documentation-lie}

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

Jeśli tworzysz system płatności, skorzystaj z naszego doświadczenia: stwórz swój [podejście trifecta](https://forwardemail.net/en/blog/docs/building-reliable-payment-system-stripe-paypal) z wieloma procesorami, ale nie oczekuj, że PayPal zapewni Ci podstawową funkcjonalność, której potrzebujesz. Zaplanuj obejścia od samego początku.

> Ten wpis dokumentuje nasze 11-letnie doświadczenie z interfejsami API PayPal w Forward Email. Wszystkie przykłady kodu i linki pochodzą z naszych rzeczywistych systemów produkcyjnych. Pomimo tych problemów nadal obsługujemy płatności PayPal, ponieważ niektórzy klienci nie mają innego wyboru.

<img loading="lazy" src="/img/articles/paypal-api-issues.webp" alt="" class="rounded-lg" />