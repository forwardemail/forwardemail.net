# Dekada wpływu: jak nasze pakiety npm osiągnęły miliard pobrań i ukształtowały JavaScript {#a-decade-of-impact-how-our-npm-packages-hit-1-billion-downloads-and-shaped-javascript}

<img loading="lazy" src="/img/articles/npm.webp" alt="" class="rounded-lg" />

## Spis treści {#table-of-contents}

* [Przedmowa](#foreword)
* [Pionierzy, którzy nam zaufali: Isaac Z. Schlueter i Forward Email](#the-pioneers-who-trust-us-isaac-z-schlueter-and-forward-email)
  * [Od powstania npm do przywództwa Node.js](#from-npms-creation-to-nodejs-leadership)
* [Architekt za kodem: podróż Nicka Baugha](#the-architect-behind-the-code-nick-baughs-journey)
  * [Ekspresowy Komitet Techniczny i Główne Wkłady](#express-technical-committee-and-core-contributions)
  * [Wkłady do Koa Framework](#koa-framework-contributions)
  * [Od indywidualnego współpracownika do lidera organizacji](#from-individual-contributor-to-organization-leader)
* [Nasze organizacje GitHub: ekosystemy innowacji](#our-github-organizations-ecosystems-of-innovation)
  * [Cabin: Ustrukturyzowane rejestrowanie dla nowoczesnych aplikacji](#cabin-structured-logging-for-modern-applications)
  * [Skaner spamu: walka z nadużyciami poczty e-mail](#spam-scanner-fighting-email-abuse)
  * [Bree: Nowoczesne planowanie zadań z wątkami roboczymi](#bree-modern-job-scheduling-with-worker-threads)
  * [Przekaż dalej e-mail: Infrastruktura poczty e-mail typu open source](#forward-email-open-source-email-infrastructure)
  * [Lad: Niezbędne narzędzia i narzędzia Koa](#lad-essential-koa-utilities-and-tools)
  * [Upptime: Monitorowanie czasu pracy oprogramowania Open Source](#upptime-open-source-uptime-monitoring)
* [Nasz wkład w ekosystem poczty e-mail Forward](#our-contributions-to-the-forward-email-ecosystem)
  * [Od opakowań do produkcji](#from-packages-to-production)
  * [Pętla sprzężenia zwrotnego](#the-feedback-loop)
* [Podstawowe zasady Forward Email: Podstawa doskonałości](#forward-emails-core-principles-a-foundation-for-excellence)
  * [Zawsze przyjazne dla programistów, skoncentrowane na bezpieczeństwie i przejrzyste](#always-developer-friendly-security-focused-and-transparent)
  * [Przestrzeganie sprawdzonych zasad tworzenia oprogramowania](#adherence-to-time-tested-software-development-principles)
  * [Celowanie w Scrappy, Bootstrapped Developera](#targeting-the-scrappy-bootstrapped-developer)
  * [Zasady w praktyce: baza kodów Forward Email](#principles-in-practice-the-forward-email-codebase)
  * [Prywatność w fazie projektowania](#privacy-by-design)
  * [Zrównoważony Open Source](#sustainable-open-source)
* [Liczby nie kłamią: nasze oszałamiające statystyki pobierania npm](#the-numbers-dont-lie-our-staggering-npm-download-statistics)
  * [Nasz wpływ z lotu ptaka](#a-birds-eye-view-of-our-impact)
  * [Codzienny wpływ na skalę](#daily-impact-at-scale)
  * [Poza surowymi liczbami](#beyond-the-raw-numbers)
* [Wspieranie ekosystemu: nasze sponsorowanie oprogramowania typu open source](#supporting-the-ecosystem-our-open-source-sponsorships)
  * [Andris Reinman: Pionier infrastruktury poczty e-mail](#andris-reinman-email-infrastructure-pioneer)
  * [Sindre Sorhus: Twórca pakietu narzędziowego](#sindre-sorhus-utility-package-mastermind)
* [Odkrywanie luk w zabezpieczeniach ekosystemu JavaScript](#uncovering-security-vulnerabilities-in-the-javascript-ecosystem)
  * [Ratunek Koa-Router](#the-koa-router-rescue)
  * [Rozwiązywanie problemów z lukami w zabezpieczeniach ReDoS](#addressing-redos-vulnerabilities)
  * [Wspieranie bezpieczeństwa Node.js i Chromium](#advocating-for-nodejs-and-chromium-security)
  * [Zabezpieczanie infrastruktury npm](#securing-npm-infrastructure)
* [Nasz wkład w ekosystem poczty e-mail Forward](#our-contributions-to-the-forward-email-ecosystem-1)
  * [Ulepszanie podstawowej funkcjonalności Nodemailer](#enhancing-nodemailers-core-functionality)
  * [Udoskonalanie uwierzytelniania poczty e-mail za pomocą Mailauth](#advancing-email-authentication-with-mailauth)
  * [Kluczowe ulepszenia czasu sprawności](#key-upptime-enhancements)
* [Spoiwo, które trzyma wszystko w całości: niestandardowy kod na dużą skalę](#the-glue-that-holds-it-all-together-custom-code-at-scale)
  * [Ogromny wysiłek rozwojowy](#a-massive-development-effort)
  * [Integracja podstawowych zależności](#core-dependencies-integration)
  * [Infrastruktura DNS z Tangerine i mx-connect](#dns-infrastructure-with-tangerine-and-mx-connect)
* [Wpływ na przedsiębiorstwo: od rozwiązań Open Source do rozwiązań o znaczeniu krytycznym](#enterprise-impact-from-open-source-to-mission-critical-solutions)
  * [Studia przypadków dotyczące infrastruktury poczty e-mail o znaczeniu krytycznym](#case-studies-in-mission-critical-email-infrastructure)
* [Dekada Open Source: Spojrzenie w przyszłość](#a-decade-of-open-source-looking-forward)

## Przedmowa {#foreword}

W świecie [JavaScript](https://en.wikipedia.org/wiki/JavaScript) i [Node.js](https://en.wikipedia.org/wiki/Node.js) niektóre pakiety są niezbędne – pobierane miliony razy dziennie i napędzające aplikacje na całym świecie. Za tymi narzędziami stoją programiści skupieni na jakości open source. Dziś pokażemy, jak nasz zespół pomaga w tworzeniu i utrzymywaniu pakietów npm, które stały się kluczowymi elementami ekosystemu JavaScript.

## Pionierzy, którzy nam zaufali: Isaac Z. Schlueter i Forward Email {#the-pioneers-who-trust-us-isaac-z-schlueter-and-forward-email}

Jesteśmy dumni, że mamy użytkownika [Isaac Z. Schlüter](https://izs.me/) ([GitHub: isaacs](https://github.com/isaacs)). Isaac stworzył [npm](https://en.wikipedia.org/wiki/Npm_\(software\) i pomógł w budowie [Node.js](https://en.wikipedia.org/wiki/Node.js). Jego zaufanie do Forward Email pokazuje, że koncentrujemy się na jakości i bezpieczeństwie. Isaac używa Forward Email w kilku domenach, w tym izs.me.

Wpływ Isaaca na JavaScript jest ogromny. W 2009 roku był jednym z pierwszych, którzy dostrzegli potencjał Node.js, współpracując z [Ryan Dahl](https://en.wikipedia.org/wiki/Ryan_Dahl), twórcą tej platformy. Jak Isaac powiedział w [wywiad dla magazynu Increment](https://increment.com/development/interview-with-isaac-z-schlueter-ceo-of-npm/): „W samym środku tej bardzo małej społeczności ludzi próbujących znaleźć sposób na stworzenie JavaScriptu po stronie serwera, Ryan Dahl stworzył Node, który był po prostu właściwym podejściem. Dołożyłem do tego swoje trzy grosze i zaangażowałem się w połowie 2009 roku”.

> \[!NOTE]
> For those interested in the history of Node.js, there are excellent documentaries available that chronicle its development, including [The Story of Node.js](https://www.youtube.com/watch?v=LB8KwiiUGy0) and [10 Things I Regret About Node.js - Ryan Dahl](https://www.youtube.com/watch?v=jo_B4LTHi3I). Ryan Dahl's [personal website](https://tinyclouds.org/) also contains valuable insights into his work.

### Od powstania npm do przywództwa Node.js {#from-npms-creation-to-nodejs-leadership}

Isaac stworzył npm we wrześniu 2009 roku, a pierwsza użyteczna wersja została wydana na początku 2010 roku. Ten menedżer pakietów wypełnił kluczową potrzebę Node.js, umożliwiając programistom łatwe udostępnianie i ponowne wykorzystywanie kodu. Według [Strona Wikipedii o Node.js](https://en.wikipedia.org/wiki/Node.js): „W styczniu 2010 roku wprowadzono menedżera pakietów dla środowiska Node.js o nazwie npm. Menedżer pakietów umożliwia programistom publikowanie i udostępnianie pakietów Node.js wraz z towarzyszącym im kodem źródłowym i został zaprojektowany w celu uproszczenia instalacji, aktualizacji i deinstalacji pakietów”.

Kiedy Ryan Dahl zrezygnował z pracy nad Node.js w styczniu 2012 roku, Isaac przejął rolę lidera projektu. Jak wspomniano na [jego podsumowanie](https://izs.me/resume), „kierował rozwojem kilku fundamentalnych interfejsów API Node.js, w tym systemu modułów CommonJS, interfejsów API systemu plików i strumieni” oraz „przez 2 lata pełnił funkcję BDFL (Dobrego Dyktatora na Całe Życie) projektu, zapewniając stale rosnącą jakość i niezawodność procesu kompilacji dla wersji Node.js od v0.6 do v0.10”.

Isaac poprowadził Node.js przez kluczowy okres wzrostu, ustanawiając standardy, które nadal kształtują platformę. Później, w 2014 r., założył npm, Inc., aby wspierać rejestr npm, który wcześniej prowadził samodzielnie.

Dziękujemy Isaacowi za jego ogromny wkład w JavaScript i nadal korzystamy z wielu pakietów, które stworzył. Jego praca zmieniła sposób, w jaki tworzymy oprogramowanie i sposób, w jaki miliony programistów na całym świecie dzielą się kodem.

## Architekt stojący za kodem: podróż Nicka Baugha {#the-architect-behind-the-code-nick-baughs-journey}

Sercem naszego sukcesu open source jest Nick Baugh, założyciel i właściciel Forward Email. Jego praca w JavaScript obejmuje prawie 20 lat i ukształtowała sposób, w jaki niezliczeni programiści tworzą aplikacje. Jego podróż open source pokazuje zarówno umiejętności techniczne, jak i przywództwo społeczności.

### Ekspresowy Komitet Techniczny i Główne Wkłady {#express-technical-committee-and-core-contributions}

Ekspertyza Nicka w zakresie frameworków internetowych zapewniła mu miejsce na liście [Ekspresowy Komitet Techniczny](https://expressjs.com/en/resources/community.html), gdzie pomagał w rozwoju jednego z najczęściej używanych frameworków Node.js. Nick jest obecnie wymieniony jako nieaktywny członek na liście [Strona społeczności Express](https://expressjs.com/en/resources/community.html).

> \[!IMPORTANT]
> Express was originally created by TJ Holowaychuk, a prolific open source contributor who has shaped much of the Node.js ecosystem. We're grateful for TJ's foundational work and respect his [decision to take a break](https://news.ycombinator.com/item?id=37687017) from his extensive open source contributions.

Jako członek [Ekspresowy Komitet Techniczny](https://expressjs.com/en/resources/community.html) Nick wykazał się dużą dbałością o szczegóły, np. przy wyjaśnianiu dokumentacji `req.originalUrl` i rozwiązywaniu problemów z obsługą formularzy wieloczęściowych.

### Wkłady Koa Framework {#koa-framework-contributions}

Praca Nicka nad [Struktura Koa](https://github.com/koajs/koa) – nowoczesną, lżejszą alternatywą dla Expressa, również stworzoną przez TJ Holowaychuka – jest kolejnym dowodem jego zaangażowania w tworzenie lepszych narzędzi do tworzenia stron internetowych. Jego wkład w Koa obejmuje zarówno zgłaszanie problemów, jak i rozwiązywanie kodów poprzez żądania ściągnięcia, obsługę błędów, zarządzanie typami treści oraz ulepszanie dokumentacji.

Jego praca w Express i Koa zapewnia mu wyjątkowy wgląd w rozwój stron internetowych w Node.js, pomagając naszemu zespołowi tworzyć pakiety, które dobrze współpracują z wieloma ekosystemami frameworków.

### Od indywidualnego współpracownika do lidera organizacji {#from-individual-contributor-to-organization-leader}

To, co zaczęło się od pomocy istniejącym projektom, przerodziło się w tworzenie i utrzymywanie całych ekosystemów pakietów. Nick założył wiele organizacji GitHub – w tym [Kabina](https://github.com/cabinjs), [Skaner spamu](https://github.com/spamscanner), [Przekaż dalej e-mail](https://github.com/forwardemail), [Chłopak](https://github.com/ladjs) i [Bree](https://github.com/breejs) – każda z nich rozwiązywała specyficzne potrzeby społeczności JavaScript.

Ta zmiana z roli współpracownika na lidera pokazuje wizję Nicka dotyczącą dobrze zaprojektowanego oprogramowania, które rozwiązuje prawdziwe problemy. Organizując powiązane pakiety w ramach ukierunkowanych organizacji GitHub, zbudował ekosystemy narzędzi, które współpracują ze sobą, pozostając jednocześnie modułowymi i elastycznymi dla szerszej społeczności programistów.

## Nasze organizacje GitHub: Ekosystemy innowacji {#our-github-organizations-ecosystems-of-innovation}

Organizujemy naszą pracę open source wokół skoncentrowanych organizacji GitHub, z których każda rozwiązuje konkretne potrzeby w JavaScript. Ta struktura tworzy spójne rodziny pakietów, które dobrze ze sobą współpracują, pozostając jednocześnie modułowe.

### Cabin: Ustrukturyzowane rejestrowanie dla nowoczesnych aplikacji {#cabin-structured-logging-for-modern-applications}

[Organizacja kabiny](https://github.com/cabinjs) to nasza wersja prostego, wydajnego logowania aplikacji. Główny pakiet [`cabin`](https://github.com/cabinjs/cabin) ma prawie 900 gwiazdek w serwisie GitHub i ponad 100 000 pobrań tygodniowo\[^1]. Cabin zapewnia ustrukturyzowane logowanie, które współpracuje z popularnymi usługami, takimi jak Sentry, LogDNA i Papertrail.

Cechą charakterystyczną Cabin jest przemyślany system API i wtyczek. Pakiety wsparcia, takie jak [`axe`](https://github.com/cabinjs/axe) dla oprogramowania pośredniczącego Express i [`parse-request`](https://github.com/cabinjs/parse-request) do analizy żądań HTTP, świadczą o naszym zaangażowaniu w tworzenie kompleksowych rozwiązań, a nie izolowanych narzędzi.

Na szczególną uwagę zasługuje pakiet [`bson-objectid`](https://github.com/cabinjs/bson-objectid), który w ciągu zaledwie dwóch miesięcy został pobrany ponad 1,7 miliona razy\[^2]. Ta prosta implementacja MongoDB ObjectID stała się rozwiązaniem dla programistów potrzebujących identyfikatorów bez pełnych zależności od MongoDB.

### Skaner spamu: walka z nadużyciami w zakresie poczty e-mail {#spam-scanner-fighting-email-abuse}

Pakiet [Organizacja Spam Scanner](https://github.com/spamscanner) pokazuje nasze zaangażowanie w rozwiązywanie rzeczywistych problemów. Główny pakiet [`spamscanner`](https://github.com/spamscanner/spamscanner) zapewnia zaawansowaną detekcję spamu w wiadomościach e-mail, ale to pakiet [`url-regex-safe`](https://github.com/spamscanner/url-regex-safe) cieszy się ogromnym zainteresowaniem.

Pakiet `url-regex-safe`, pobrany ponad 1,2 miliona razy w ciągu dwóch miesięcy\[^3], naprawia krytyczne luki bezpieczeństwa w innych wyrażeniach regularnych do wykrywania adresów URL. Ten pakiet prezentuje nasze podejście do open source: znajdowanie typowego problemu (w tym przypadku luk [Ponowne wykonanie](https://en.wikipedia.org/wiki/ReDoS) w walidacji adresów URL), tworzenie solidnego rozwiązania i jego staranne utrzymywanie.

### Bree: Nowoczesne planowanie zadań z wątkami roboczymi {#bree-modern-job-scheduling-with-worker-threads}

[Organizacja Bree](https://github.com/breejs) to nasza odpowiedź na powszechny problem Node.js: niezawodne planowanie zadań. Główny pakiet [`bree`](https://github.com/breejs/bree), z ponad 3100 gwiazdkami na GitHubie, oferuje nowoczesny harmonogram zadań wykorzystujący wątki robocze Node.js dla lepszej wydajności i niezawodności.

> \[!NOTE]
> Bree was created after we helped maintain [Agenda](https://github.com/agenda/agenda), applying lessons learned to build a better job scheduler. Our Agenda contributions helped us find ways to improve job scheduling.

Czym Bree różni się od innych harmonogramów typu Agenda:

* **Brak zewnętrznych zależności**: W przeciwieństwie do Agenda, która potrzebuje MongoDB, Bree nie wymaga Redis ani MongoDB do zarządzania stanem zadania.
* **Wątki robocze**: Bree używa wątków roboczych Node.js do procesów sandboxowych, zapewniając lepszą izolację i wydajność.
* **Proste API**: Bree oferuje szczegółową kontrolę z prostotą, ułatwiając implementację złożonych potrzeb harmonogramowania.
* **Wbudowane wsparcie**: Rzeczy takie jak łagodne ponowne ładowanie, zadania cron, daty i przyjazne dla człowieka czasy są domyślnie uwzględnione.

Bree jest kluczowym elementem [forwardemail.net](https://github.com/forwardemail/forwardemail.net), obsługującym krytyczne zadania w tle, takie jak przetwarzanie wiadomości e-mail, czyszczenie i planowana konserwacja. Wykorzystanie Bree w Forward Email świadczy o naszym zaangażowaniu w korzystanie z własnych narzędzi w środowisku produkcyjnym, zapewniając ich wysokie standardy niezawodności.

Korzystamy również z innych świetnych pakietów wątków roboczych, takich jak [basen](https://github.com/piscinajs/piscina), i cenimy je, a także klientów HTTP, takich jak [jedenaście](https://github.com/nodejs/undici). Piscina, podobnie jak Bree, wykorzystuje wątki robocze Node.js do wydajnego przetwarzania zadań. Dziękujemy [Mateusz Wzgórze](https://github.com/mcollina), który opiekuje się zarówno undici, jak i pisciną, za jego znaczący wkład w rozwój Node.js. Matteo zasiada w Komitecie Sterującym Technicznym Node.js i znacznie usprawnił działanie klienta HTTP w Node.js.

### Przekaż dalej wiadomość e-mail: Infrastruktura poczty e-mail o otwartym kodzie źródłowym {#forward-email-open-source-email-infrastructure}

Naszym najbardziej ambitnym projektem jest [Przekaż dalej e-mail](https://github.com/forwardemail), usługa poczty e-mail o otwartym kodzie źródłowym, która zapewnia przekierowywanie wiadomości e-mail, ich przechowywanie i usługi API. Główne repozytorium ma ponad 1100 gwiazdek w serwisie GitHub\[^4], co świadczy o uznaniu społeczności dla tej alternatywy dla zastrzeżonych usług poczty e-mail.

Pakiet [`preview-email`](https://github.com/forwardemail/preview-email) tej organizacji, pobrany ponad 2,5 miliona razy w ciągu dwóch miesięcy\[^5], stał się niezbędnym narzędziem dla programistów pracujących z szablonami wiadomości e-mail. Zapewniając prosty sposób podglądu wiadomości e-mail w trakcie tworzenia, rozwiązuje on częsty problem związany z tworzeniem aplikacji obsługujących pocztę e-mail.

### Lad: Niezbędne narzędzia i narzędzia Koa {#lad-essential-koa-utilities-and-tools}

Pakiet [Organizacja chłopaków](https://github.com/ladjs) zawiera zbiór niezbędnych narzędzi i narzędzi, których głównym celem jest udoskonalenie ekosystemu frameworka Koa. Pakiety te rozwiązują typowe problemy w tworzeniu stron internetowych i zostały zaprojektowane tak, aby bezproblemowo ze sobą współpracować, zachowując jednocześnie użyteczność.

#### koa-better-error-handler: Ulepszona obsługa błędów dla Koa {#koa-better-error-handler-improved-error-handling-for-koa}

[`koa-better-error-handler`](https://github.com/ladjs/koa-better-error-handler) oferuje lepsze rozwiązanie obsługi błędów w aplikacjach Koa. Ten pakiet, z ponad 50 gwiazdkami na GitHubie, pozwala `ctx.throw` generować przyjazne dla użytkownika komunikaty o błędach, jednocześnie usuwając kilka ograniczeń wbudowanego mechanizmu obsługi błędów Koa:

* Wykrywa i poprawnie obsługuje błędy DNS Node.js, błędy Mongoose i błędy Redis
* Używa [Wysięgnik](https://github.com/hapijs/boom) do tworzenia spójnych, poprawnie sformatowanych odpowiedzi na błędy
* Zachowuje nagłówki (w przeciwieństwie do wbudowanego modułu obsługi Koa)
* Utrzymuje odpowiednie kody statusu zamiast domyślnej wartości 500
* Obsługuje wiadomości flash i zachowywanie sesji
* Dostarcza listy błędów HTML dla błędów walidacji
* Obsługuje wiele typów odpowiedzi (HTML, JSON i zwykły tekst)

Pakiet ten jest szczególnie cenny, gdy jest używany razem z [`koa-404-handler`](https://github.com/ladjs/koa-404-handler) w celu kompleksowego zarządzania błędami w aplikacjach Koa.

#### paszport: Autoryzacja dla Lad {#passport-authentication-for-lad}

[`@ladjs/passport`](https://github.com/ladjs/passport) rozszerza popularne oprogramowanie pośredniczące uwierzytelniania Passport.js o konkretne ulepszenia dla nowoczesnych aplikacji internetowych. Ten pakiet obsługuje wiele strategii uwierzytelniania od razu po instalacji:

* Lokalna autoryzacja za pomocą poczty e-mail
* Zaloguj się za pomocą Apple
* Autoryzacja GitHub
* Autoryzacja Google
* Autoryzacja za pomocą jednorazowego hasła (OTP)

Pakiet jest wysoce konfigurowalny, co pozwala deweloperom dostosowywać nazwy pól i frazy do wymagań aplikacji. Został zaprojektowany tak, aby bezproblemowo integrować się z Mongoose w celu zarządzania użytkownikami, co czyni go idealnym rozwiązaniem dla aplikacji opartych na Koa, które wymagają solidnego uwierzytelniania.

#### eleganckie: eleganckie zamykanie aplikacji {#graceful-elegant-application-shutdown}

[`@ladjs/graceful`](https://github.com/ladjs/graceful) rozwiązuje krytyczny problem płynnego zamykania aplikacji Node.js. Ten pakiet, z ponad 70 gwiazdkami na GitHubie, gwarantuje, że Twoja aplikacja może zostać zamknięta bez utraty danych i zawieszania połączeń. Najważniejsze funkcje obejmują:

* Obsługa łagodnego zamykania serwerów HTTP (Express/Koa/Fastify)
* Czyste zamykanie połączeń z bazą danych (MongoDB/Mongoose)
* Prawidłowe zamykanie klientów Redis
* Obsługa harmonogramów zadań Bree
* Obsługa niestandardowych programów obsługi zamykania
* Konfigurowalne ustawienia limitu czasu
* Integracja z systemami rejestrowania

Ten pakiet jest niezbędny w aplikacjach produkcyjnych, w których nieoczekiwane wyłączenia mogą prowadzić do utraty lub uszkodzenia danych. Dzięki wdrożeniu odpowiednich procedur wyłączania, `@ladjs/graceful` pomaga zapewnić niezawodność i stabilność aplikacji.

### Czas sprawności: Monitorowanie czasu sprawności oprogramowania Open Source {#upptime-open-source-uptime-monitoring}

[Organizacja czasu sprawności](https://github.com/upptime) reprezentuje nasze zaangażowanie w transparentne monitorowanie oprogramowania typu open source. Główne repozytorium [`upptime`](https://github.com/upptime/upptime) ma ponad 13 000 gwiazdek GitHub, co czyni je jednym z najpopularniejszych projektów, w które się angażujemy. Upptime oferuje monitor czasu pracy i stronę statusu, oparte na GitHub, które działają całkowicie bez serwera.

Używamy Upptime do naszej własnej strony statusu pod adresem <https://status.forwardemail.net>, a kod źródłowy jest dostępny pod adresem <https://github.com/forwardemail/status.forwardemail.net>.

Cechą wyróżniającą Upptime jest jego architektura:

* **100% Open Source**: Każdy komponent jest w pełni open source i konfigurowalny.
* **Obsługiwane przez GitHub**: Wykorzystuje działania, problemy i strony GitHub do rozwiązania do monitorowania bezserwerowego.
* **Brak wymogu serwera**: W przeciwieństwie do tradycyjnych narzędzi do monitorowania, Upptime nie wymaga uruchamiania ani utrzymywania serwera.
* **Automatyczna strona stanu**: Generuje piękną stronę stanu, którą można hostować na stronach GitHub.
* **Potężne powiadomienia**: Integruje się z różnymi kanałami powiadomień, w tym e-mailem, SMS-em i Slackiem.

Aby ulepszyć doświadczenia naszych użytkowników, zintegrowaliśmy [@octokit/core](https://github.com/octokit/core.js/) z bazą kodu forwardemail.net, aby wyświetlać aktualizacje statusu i informacje o incydentach w czasie rzeczywistym bezpośrednio na naszej stronie internetowej. Ta integracja zapewnia naszym użytkownikom przejrzystość w przypadku jakichkolwiek problemów w całym naszym stosie (strona internetowa, API, MongoDB, Redis, SQLite, SMTP, POP3, IMAP, Bree itp.), oferując natychmiastowe powiadomienia, zmiany ikon odznak, kolory ostrzeżeń i wiele innych.

Biblioteka @octokit/core pozwala nam pobierać dane w czasie rzeczywistym z naszego repozytorium Upptime GitHub, przetwarzać je i wyświetlać w sposób przyjazny dla użytkownika. Gdy jakakolwiek usługa ma przerwę lub obniżoną wydajność, użytkownicy są natychmiast powiadamiani za pomocą wskaźników wizualnych bez konieczności opuszczania głównej aplikacji. Ta płynna integracja zapewnia, że nasi użytkownicy zawsze mają aktualne informacje o stanie naszego systemu, zwiększając przejrzystość i zaufanie.

Upptime zostało przyjęte przez setki organizacji poszukujących przejrzystego, niezawodnego sposobu monitorowania swoich usług i komunikowania statusu użytkownikom. Sukces projektu pokazuje siłę budowania narzędzi, które wykorzystują istniejącą infrastrukturę (w tym przypadku GitHub), aby rozwiązywać typowe problemy na nowe sposoby.

## Nasz wkład w ekosystem poczty elektronicznej Forward {#our-contributions-to-the-forward-email-ecosystem}

Chociaż nasze pakiety open source są używane przez deweloperów na całym świecie, stanowią one również podstawę naszej własnej usługi Forward Email. Ta podwójna rola — zarówno twórców, jak i użytkowników tych narzędzi — daje nam unikalną perspektywę ich rzeczywistego zastosowania i napędza ciągłe doskonalenie.

### Od pakietów do produkcji {#from-packages-to-production}

Podróż od pojedynczych pakietów do spójnego systemu produkcyjnego wymaga starannej integracji i rozszerzenia. W przypadku Forward Email proces ten obejmuje:

* **Rozszerzenia niestandardowe**: Tworzenie rozszerzeń Forward Email-specific do naszych pakietów open source, które spełniają nasze wyjątkowe wymagania.
* **Wzory integracji**: Opracowywanie wzorców interakcji tych pakietów w środowisku produkcyjnym.
* **Optymalizacja wydajności**: Identyfikowanie i rozwiązywanie wąskich gardeł wydajności, które pojawiają się tylko na dużą skalę.
* **Wzmocnienie bezpieczeństwa**: Dodawanie dodatkowych warstw bezpieczeństwa specyficznych dla obsługi poczty e-mail i ochrony danych użytkowników.

Praca ta to tysiące godzin pracy nad rozwojem wykraczającym poza same podstawowe pakiety. Rezultatem jest niezawodna i bezpieczna usługa poczty e-mail wykorzystująca najlepsze elementy naszych rozwiązań typu open source.

### Pętla sprzężenia zwrotnego {#the-feedback-loop}

Być może najcenniejszym aspektem korzystania z naszych własnych pakietów w produkcji jest pętla sprzężenia zwrotnego, którą ona tworzy. Gdy napotykamy ograniczenia lub skrajne przypadki w Forward Email, nie tylko je łatamy lokalnie — ulepszamy podstawowe pakiety, co przynosi korzyści zarówno naszej usłudze, jak i szerszej społeczności.

Takie podejście doprowadziło do licznych udoskonaleń:

* **Łagodne wyłączanie Bree**: Potrzeba wdrożeń bez przestojów w Forward Email doprowadziła do ulepszonych możliwości łagodnego wyłączania w Bree.
* **Rozpoznawanie wzorców przez Spam Scanner**: Realistyczne wzorce spamu napotkane w Forward Email poinformowały algorytmy wykrywania Spam Scanner.
* **Optymalizacja wydajności Cabin**: Rejestrowanie dużej liczby danych w środowisku produkcyjnym ujawniło możliwości optymalizacji w Cabin, które przynoszą korzyści wszystkim użytkownikom.

Dzięki pielęgnowaniu tego pozytywnego cyklu między naszą pracą w modelu open source a usługą produkcyjną mamy pewność, że nasze pakiety pozostają praktycznymi, sprawdzonymi w boju rozwiązaniami, a nie teoretycznymi implementacjami.

## Podstawowe zasady przesyłania wiadomości e-mail: podstawa doskonałości {#forward-emails-core-principles-a-foundation-for-excellence}

Usługa Forward Email została zaprojektowana zgodnie z zestawem podstawowych zasad, którymi kierujemy się przy podejmowaniu wszystkich decyzji programistycznych. Zasady te, szczegółowo opisane w naszym [strona internetowa](/blog/docs/best-quantum-safe-encrypted-email-service#principles), gwarantują, że nasza usługa pozostaje przyjazna dla programistów, bezpieczna i dba o prywatność użytkowników.

### Zawsze przyjazne dla programistów, skoncentrowane na bezpieczeństwie i przejrzyste {#always-developer-friendly-security-focused-and-transparent}

Naszą pierwszą i najważniejszą zasadą jest tworzenie oprogramowania przyjaznego dla deweloperów, przy jednoczesnym zachowaniu najwyższych standardów bezpieczeństwa i prywatności. Wierzymy, że doskonałość techniczna nigdy nie powinna odbywać się kosztem użyteczności, a przejrzystość buduje zaufanie w naszej społeczności.

Zasada ta przejawia się w naszej szczegółowej dokumentacji, jasnych komunikatach o błędach i otwartej komunikacji zarówno o sukcesach, jak i wyzwaniach. Udostępniając cały nasz kod źródłowy jako open source, zachęcamy do kontroli i współpracy, wzmacniając zarówno nasze oprogramowanie, jak i szerszy ekosystem.

### Przestrzeganie sprawdzonych zasad tworzenia oprogramowania {#adherence-to-time-tested-software-development-principles}

Kierujemy się kilkoma sprawdzonymi zasadami tworzenia oprogramowania, których wartość została potwierdzona przez dziesięciolecia:

* **[MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)**: Rozdzielenie problemów poprzez wzorzec Model-Widok-Kontroler
* **[Filozofia Uniksa](https://en.wikipedia.org/wiki/Unix_philosophy)**: Tworzenie modułowych komponentów, które dobrze wykonują jedną funkcję
* **[KISS](https://en.wikipedia.org/wiki/KISS_principle)**: Prostota i przejrzystość
* **[DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)**: Nie powtarzaj się, promując ponowne wykorzystanie kodu
* **[YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it)**: Nie będziesz tego potrzebować, unikając przedwczesnej optymalizacji
* **[Dwanaście czynników](https://12factor.net/)**: Przestrzeganie najlepszych praktyk tworzenia nowoczesnych, skalowalnych aplikacji
* **[Brzytwa Ockhama](https://en.wikipedia.org/wiki/Occam%27s_razor)**: Wybór najprostszego rozwiązania spełniającego wymagania
* **[Testowanie psów](https://en.wikipedia.org/wiki/Eating_your_own_dog_food)**: Intensywne korzystanie z naszych własnych produktów

Te zasady nie są tylko teoretycznymi koncepcjami — są osadzone w naszych codziennych praktykach programistycznych. Na przykład nasze przywiązanie do filozofii Unix jest widoczne w sposobie, w jaki ustrukturyzowaliśmy nasze pakiety npm: małe, skoncentrowane moduły, które można ze sobą łączyć, aby rozwiązywać złożone problemy.

### Skierowany do programistów Scrappy, Bootstrapped {#targeting-the-scrappy-bootstrapped-developer}

Skupiamy się szczególnie na ambitnych, bootstrappingowych i [ramen-opłacalny](https://www.paulgraham.com/ramenprofitable.html) deweloperach. Ta koncentracja kształtuje wszystko, od naszego modelu cenowego po decyzje techniczne. Rozumiemy wyzwania związane z tworzeniem produktów przy ograniczonych zasobach, ponieważ sami tego doświadczyliśmy.

Ta zasada jest szczególnie ważna w naszym podejściu do open source. Tworzymy i utrzymujemy pakiety, które rozwiązują rzeczywiste problemy programistów bez budżetów korporacyjnych, udostępniając potężne narzędzia każdemu, niezależnie od zasobów.

### Zasady w praktyce: baza kodów poczty e-mail {#principles-in-practice-the-forward-email-codebase}

Zasady te są wyraźnie widoczne w bazie kodu Forward Email. Nasz plik package.json ujawnia przemyślany wybór zależności, z których każda została wybrana tak, aby odpowiadała naszym podstawowym wartościom:

* Pakiety skoncentrowane na bezpieczeństwie, takie jak `mailauth` do uwierzytelniania poczty e-mail
* Przyjazne dla programistów narzędzia, takie jak `preview-email`, ułatwiające debugowanie
* Modułowe komponenty, takie jak różne narzędzia `p-*` firmy Sindre Sorhus

Dzięki konsekwentnemu przestrzeganiu tych zasad udało nam się stworzyć usługę, której programiści mogą zaufać w kwestii infrastruktury poczty e-mail — jest ona bezpieczna, niezawodna i zgodna z wartościami społeczności open source.

### Prywatność w fazie projektowania {#privacy-by-design}

Prywatność nie jest kwestią drugorzędną ani cechą marketingową usługi Forward Email — to podstawowa zasada projektowania, która wpływa na każdy aspekt naszej usługi i kodu:

* **Szyfrowanie zerowego dostępu**: Wdrożyliśmy systemy, które technicznie uniemożliwiają nam odczytywanie wiadomości e-mail użytkowników.

* **Minimalne gromadzenie danych**: Gromadzimy tylko dane niezbędne do świadczenia naszych usług, nic więcej.

* **Przejrzyste zasady**: Nasza polityka prywatności jest napisana jasnym, zrozumiałym językiem bez prawniczego żargonu.

* **Weryfikacja Open Source**: Nasza baza kodu open source pozwala badaczom ds. bezpieczeństwa weryfikować nasze oświadczenia dotyczące prywatności.

To zobowiązanie dotyczy również naszych pakietów open source, które od podstaw projektujemy z uwzględnieniem najlepszych praktyk bezpieczeństwa i prywatności.

### Zrównoważony kod open source {#sustainable-open-source}

Wierzymy, że oprogramowanie open source potrzebuje zrównoważonych modeli, aby rozwijać się długoterminowo. Nasze podejście obejmuje:

* **Wsparcie komercyjne**: Oferowanie wsparcia premium i usług wokół naszych narzędzi open source.
* **Zrównoważone licencjonowanie**: Korzystanie z licencji, które chronią zarówno wolności użytkowników, jak i zrównoważony rozwój projektu.
* **Zaangażowanie społeczności**: Aktywne angażowanie współpracowników w celu zbudowania wspierającej społeczności.
* **Przejrzyste mapy drogowe**: Udostępnianie naszych planów rozwoju, aby umożliwić użytkownikom odpowiednie planowanie.

Koncentrując się na zrównoważonym rozwoju, dbamy o to, aby nasze projekty typu open source mogły się z czasem rozwijać i udoskonalać, zamiast popadać w zaniedbanie.

## Liczby nie kłamią: nasze oszałamiające statystyki pobierania npm {#the-numbers-dont-lie-our-staggering-npm-download-statistics}

Kiedy mówimy o wpływie oprogramowania open source, statystyki pobierania dostarczają namacalnego pomiaru adopcji i zaufania. Wiele pakietów, które pomagamy utrzymywać, osiągnęło skalę, jaką osiąga niewiele projektów open source, a łączna liczba pobrań wynosi miliardy.

![Najpopularniejsze pakiety npm według pobrań](/img/art/top_packages_bar_chart.svg)

> \[!IMPORTANT]
> While we're proud to help maintain several highly-downloaded packages in the JavaScript ecosystem, we want to acknowledge that many of these packages were originally created by other talented developers. Packages like superagent and supertest were originally created by TJ Holowaychuk, whose prolific contributions to open source have been instrumental in shaping the Node.js ecosystem.

### Nasz wpływ z lotu ptaka {#a-birds-eye-view-of-our-impact}

Tylko w ciągu dwóch miesięcy od lutego do marca 2025 r. nasze najlepsze pakiety, do których się przyczyniamy i które pomagają utrzymać, osiągnęły imponujące liczby pobrań:

* **[superagent](https://www.npmjs.com/package/superagent)**: 84 575 829 pobrań\[^7] (pierwotnie utworzone przez TJ Holowaychuk)
* **[super test](https://www.npmjs.com/package/supertest)**: 76 432 591 pobrań\[^8] (pierwotnie utworzone przez TJ Holowaychuk)
* **[Również](https://www.npmjs.com/package/koa)**: 28 539 295 pobrań\[^34] (pierwotnie utworzone przez TJ Holowaychuk)
* **[@koa/router](https://www.npmjs.com/package/@koa/router)**: 11 007 327 pobrań\[^35]
* **[router koa](https://www.npmjs.com/package/koa-router)**: 3 498 918 pobrań\[^36]
* **[wyrażenie regularne url](https://www.npmjs.com/package/url-regex)**: 2 819 520 pobrań\[^37]
* **[podgląd-e-maila](https://www.npmjs.com/package/preview-email)**: 2 500 000 pobrań\[^9]
* **[kabina](https://www.npmjs.com/package/cabin)**: 1 800 000 pobrań\[^10]
* **[@breejs/później](https://www.npmjs.com/package/@breejs/later)**: 1 709 938 pobrań\[^38]
* **[szablony e-maili](https://www.npmjs.com/package/email-templates)**: 1 128 139 pobrań\[^39]
* **[ścieżki pobierania](https://www.npmjs.com/package/get-paths)**: 1 124 686 pobrań\[^40]
* **[bezpieczny dla wyrażeń regularnych url](https://www.npmjs.com/package/url-regex-safe)**: 1 200 000 pobrań\[^11]
* **[dotenv-parse-zmienne](https://www.npmjs.com/package/dotenv-parse-variables)**: 894 666 pobrań\[^41]
* **[@koa/multer](https://www.npmjs.com/package/@koa/multer)**: 839 585 pobrań\[^42]
* **[skaner spamu](https://www.npmjs.com/package/spamscanner)**: 145 000 pobrań\[^12]
* **[wiatr](https://www.npmjs.com/package/bree)**: 24 270 pobrań\[^30]

> \[!NOTE]
> Several other packages we help maintain but didn't create have even higher download counts, including `form-data` (738M+ downloads), `toidentifier` (309M+ downloads), `stackframe` (116M+ downloads), and `error-stack-parser` (113M+ downloads). We're honored to contribute to these packages while respecting the work of their original authors.

To nie są tylko imponujące liczby — to prawdziwe liczby przedstawiające prawdziwych programistów rozwiązujących prawdziwe problemy za pomocą kodu, który pomagamy utrzymywać. Każde pobranie to przypadek, w którym te pakiety pomogły komuś zbudować coś znaczącego, od projektów hobbystycznych po aplikacje korporacyjne używane przez miliony.

![Dystrybucja kategorii pakietów](/img/art/category_pie_chart.svg)

### Dzienny wpływ na dużą skalę {#daily-impact-at-scale}

Codzienne wzorce pobierania ujawniają stałe, wysokie wykorzystanie, ze szczytami sięgającymi milionów pobrań dziennie\[^13]. Ta spójność świadczy o stabilności i niezawodności tych pakietów — programiści nie tylko je wypróbowują; integrują je ze swoimi podstawowymi przepływami pracy i polegają na nich dzień po dniu.

Tygodniowe wzorce pobierania pokazują jeszcze bardziej imponujące liczby, stale oscylując wokół dziesiątek milionów pobrań tygodniowo\[^14]. Stanowi to ogromny ślad w ekosystemie JavaScript, a te pakiety działają w środowiskach produkcyjnych na całym świecie.

### Poza surowymi liczbami {#beyond-the-raw-numbers}

Choć statystyki pobierania same w sobie są imponujące, opowiadają głębszą historię o zaufaniu, jakim społeczność darzy te pakiety. Utrzymywanie pakietów na taką skalę wymaga niezachwianego zaangażowania w:

* **Wsteczna kompatybilność**: Zmiany muszą być starannie rozważone, aby uniknąć zepsucia istniejących implementacji.
* **Bezpieczeństwo**: Ponieważ miliony aplikacji zależą od tych pakietów, luki w zabezpieczeniach mogą mieć daleko idące konsekwencje.
* **Wydajność**: W tej skali nawet niewielkie ulepszenia wydajności mogą przynieść znaczące korzyści łączne.
* **Dokumentacja**: Jasna, kompleksowa dokumentacja jest niezbędna dla pakietów używanych przez programistów na wszystkich poziomach doświadczenia.

Stały wzrost liczby pobrań na przestrzeni lat odzwierciedla sukces w dotrzymywaniu tych zobowiązań i budowaniu zaufania wśród społeczności programistów poprzez niezawodne, dobrze utrzymywane pakiety.

## Wspieranie ekosystemu: Nasze sponsorowanie oprogramowania typu open source {#supporting-the-ecosystem-our-open-source-sponsorships}

> \[!TIP]
> Open source sustainability isn't just about contributing code—it's also about supporting the developers who maintain critical infrastructure.

Oprócz naszego bezpośredniego wkładu w ekosystem JavaScript, jesteśmy dumni, że możemy sponsorować wybitnych współpracowników Node.js, których praca stanowi podstawę wielu nowoczesnych aplikacji. Nasze sponsoringi obejmują:

### Andris Reinman: Pionier infrastruktury poczty e-mail {#andris-reinman-email-infrastructure-pioneer}

[Andris Reinman](https://github.com/andris9) jest twórcą [Nodemailer](https://github.com/nodemailer/nodemailer), najpopularniejszej biblioteki do wysyłania wiadomości e-mail dla Node.js, z ponad 14 milionami pobrań tygodniowo\[^15]. Jego praca obejmuje również inne kluczowe komponenty infrastruktury poczty e-mail, takie jak [Serwer SMTP](https://github.com/nodemailer/smtp-server), [Parser poczty](https://github.com/nodemailer/mailparser) i [Dzika Kaczka](https://github.com/nodemailer/wildduck).

Nasze wsparcie finansowe pozwala nam zapewnić ciągłą konserwację i rozwój tych niezbędnych narzędzi, które wspomagają komunikację e-mailową w niezliczonych aplikacjach Node.js, w tym w naszej własnej usłudze Forward Email.

### Sindre Sorhus: Mistrz pakietów narzędziowych {#sindre-sorhus-utility-package-mastermind}

[Sindre Sorhus](https://github.com/sindresorhus) jest jednym z najbardziej aktywnych twórców oprogramowania open source w ekosystemie JavaScript, z ponad 1000 pakietami npm na swoim koncie. Jego narzędzia, takie jak [p-map](https://github.com/sindresorhus/p-map), [p-ponów](https://github.com/sindresorhus/p-retry) i [jest-strumieniem](https://github.com/sindresorhus/is-stream), to podstawowe elementy składowe używane w całym ekosystemie Node.js.

Sponsorując pracę Sindre, przyczyniamy się do utrzymania rozwoju tych ważnych narzędzi, które sprawiają, że tworzenie kodu JavaScript jest bardziej wydajne i niezawodne.

Te sponsorowania odzwierciedlają nasze zaangażowanie w szerszy ekosystem open source. Zdajemy sobie sprawę, że nasz własny sukces opiera się na fundamencie położonym przez tych i innych współpracowników, i jesteśmy oddani zapewnieniu trwałości całego ekosystemu.

## Odkrywanie luk w zabezpieczeniach ekosystemu JavaScript {#uncovering-security-vulnerabilities-in-the-javascript-ecosystem}

Nasze zaangażowanie w open source wykracza poza rozwój funkcji, obejmując identyfikację i usuwanie luk w zabezpieczeniach, które mogą mieć wpływ na miliony programistów. Kilka z naszych najważniejszych wkładów w ekosystem JavaScript dotyczyło kwestii bezpieczeństwa.

### Ratunek dla routera Koa {#the-koa-router-rescue}

W lutym 2019 roku Nick zidentyfikował krytyczny problem z utrzymaniem popularnego pakietu koa-router. Jak poinformował [poinformowano w Hacker News](https://news.ycombinator.com/item?id=19156707), pakiet został porzucony przez swojego pierwotnego opiekuna, co spowodowało brak naprawionych luk w zabezpieczeniach i brak aktualizacji dla społeczności.

> \[!WARNING]
> Abandoned packages with security vulnerabilities pose significant risks to the entire ecosystem, especially when they're downloaded millions of times weekly.

W odpowiedzi Nick stworzył [@koa/router](https://github.com/koajs/router) i pomógł powiadomić społeczność o zaistniałej sytuacji. Od tamtej pory opiekuje się tym kluczowym pakietem, zapewniając użytkownikom Koa bezpieczne i dobrze utrzymane rozwiązanie do routingu.

### Rozwiązywanie luk w zabezpieczeniach ReDoS {#addressing-redos-vulnerabilities}

W 2020 roku Nick zidentyfikował i naprawił krytyczną lukę w zabezpieczeniach [Atak typu „odmowa usługi” za pomocą wyrażeń regularnych (ReDoS)](https://en.wikipedia.org/wiki/ReDoS) w powszechnie używanym pakiecie `url-regex`. Ta luka ([SNYK-JS-URLREGEX-569472](https://security.snyk.io/vuln/SNYK-JS-URLREGEX-569472)) mogła umożliwić atakującym spowodowanie odmowy usługi poprzez podanie specjalnie spreparowanych danych wejściowych, które powodowały katastrofalne cofnięcie się w wyrażeniu regularnym.

Zamiast po prostu załatać istniejący pakiet, Nick stworzył [`url-regex-safe`](https://github.com/spamscanner/url-regex-safe), całkowicie przepisaną implementację, która usuwa lukę w zabezpieczeniach, zachowując jednocześnie zgodność z oryginalnym API. Opublikował również [kompleksowy wpis na blogu](/blog/docs/url-regex-javascript-node-js) wyjaśniający lukę w zabezpieczeniach i sposób jej ograniczenia.

Niniejsza praca przedstawia nasze podejście do kwestii bezpieczeństwa: nie tylko rozwiązywanie problemów, ale także edukowanie społeczności i oferowanie solidnych alternatyw, które zapobiegną podobnym problemom w przyszłości.

### Wspieranie bezpieczeństwa Node.js i Chromium {#advocating-for-nodejs-and-chromium-security}

Nick aktywnie działał również na rzecz poprawy bezpieczeństwa w szerszym ekosystemie. W sierpniu 2020 roku zidentyfikował istotny problem bezpieczeństwa w Node.js związany z obsługą nagłówków HTTP, który został zgłoszony w [Rejestr](https://www.theregister.com/2020/08/18/nodejs_chromium_patch/).

Ten problem, który wynikał z poprawki w Chromium, potencjalnie mógł pozwolić atakującym na ominięcie środków bezpieczeństwa. Orędownictwo Nicka pomogło zapewnić, że problem został rozwiązany szybko, chroniąc miliony aplikacji Node.js przed potencjalnym wykorzystaniem.

### Zabezpieczanie infrastruktury npm {#securing-npm-infrastructure}

Jeszcze w tym samym miesiącu Nick zidentyfikował kolejny krytyczny problem bezpieczeństwa, tym razem w infrastrukturze poczty e-mail npm. Jak doniesiono w artykule [Rejestr](https://www.theregister.com/2020/08/25/nodejs_dmarc_phishing/), npm nieprawidłowo implementował protokoły uwierzytelniania poczty e-mail DMARC, SPF i DKIM, co potencjalnie umożliwiało atakującym wysyłanie wiadomości phishingowych, które wyglądały na pochodzące z npm.

Raport Nicka doprowadził do udoskonalenia zabezpieczeń poczty e-mail w npm, chroniąc miliony programistów, którzy polegają na npm w zakresie zarządzania pakietami, przed potencjalnymi atakami phishingowymi.

## Nasz wkład w ekosystem poczty elektronicznej Forward {#our-contributions-to-the-forward-email-ecosystem-1}

Forward Email jest zbudowany na kilku ważnych projektach open source, w tym Nodemailer, WildDuck i mailauth. Nasz zespół wniósł znaczący wkład w te projekty, pomagając identyfikować i naprawiać głębokie problemy, które wpływają na dostarczanie wiadomości e-mail i bezpieczeństwo.

### Ulepszanie podstawowej funkcjonalności Nodemailera {#enhancing-nodemailers-core-functionality}

[Nodemailer](https://github.com/nodemailer/nodemailer) stanowi podstawę wysyłania wiadomości e-mail w Node.js, a nasz wkład pomógł uczynić go bardziej niezawodnym:

* **Ulepszenia serwera SMTP**: Naprawiliśmy błędy parsowania, problemy z obsługą strumienia i problemy z konfiguracją TLS w komponencie serwera SMTP\[^16]\[^17].
* **Ulepszenia parsera poczty**: Naprawiliśmy błędy dekodowania sekwencji znaków i problemy z parserem, które mogły powodować błędy przetwarzania wiadomości e-mail\[^18]\[^19].

Dzięki temu wkładowi Nodemailer pozostaje niezawodną podstawą do przetwarzania wiadomości e-mail w aplikacjach Node.js, w tym Forward Email.

### Udoskonalanie uwierzytelniania poczty e-mail za pomocą Mailauth {#advancing-email-authentication-with-mailauth}

[Poczta](https://github.com/postalsys/mailauth) zapewnia krytyczną funkcjonalność uwierzytelniania wiadomości e-mail, a nasze działania znacząco poprawiły jej możliwości:

* **Ulepszenia weryfikacji DKIM**: Odkryliśmy i zgłosiliśmy, że X/Twitter ma problemy z pamięcią podręczną DNS powodujące niepowodzenie DKIM dla wiadomości wychodzących, zgłaszając to na Hacker One\[^20].
* **Ulepszenia DMARC i ARC**: Naprawiliśmy problemy z weryfikacją DMARC i ARC, które mogły prowadzić do nieprawidłowych wyników uwierzytelniania\[^21]\[^22].
* **Optymalizacja wydajności**: Wprowadziliśmy optymalizacje, które poprawiają wydajność procesów uwierzytelniania poczty e-mail\[^23]\[^24]\[^25]\[^26].

Dzięki tym usprawnieniom uwierzytelnianie poczty e-mail jest dokładne i niezawodne, co chroni użytkowników przed atakami typu phishing i spoofing.

### Kluczowe ulepszenia czasu sprawności {#key-upptime-enhancements}

Nasz wkład w Upptime obejmuje:

* **Monitorowanie certyfikatów SSL**: Dodaliśmy funkcjonalność monitorowania wygasania certyfikatów SSL, zapobiegając nieoczekiwanym przestojom spowodowanym wygaśnięciem certyfikatów\[^27].
* **Obsługa wielu numerów SMS**: Wdrożyliśmy obsługę powiadamiania wielu członków zespołu za pośrednictwem wiadomości SMS w przypadku wystąpienia incydentów, co skraca czas reakcji\[^28].
* **Poprawki sprawdzania IPv6**: Naprawiliśmy problemy ze sprawdzaniem łączności IPv6, zapewniając dokładniejsze monitorowanie w nowoczesnych środowiskach sieciowych\[^29].
* **Obsługa trybu ciemnego/jasnego**: Dodaliśmy obsługę motywu, aby poprawić wrażenia użytkownika na stronach statusu\[^31].
* **Lepsza obsługa TCP-Ping**: Ulepszyliśmy funkcjonalność pingowania TCP, aby zapewnić bardziej niezawodne testowanie połączenia\[^32].

Udoskonalenia te nie tylko przynoszą korzyści w zakresie monitorowania statusu usługi Forward Email, ale są dostępne dla całej społeczności użytkowników Upptime, co pokazuje nasze zaangażowanie w udoskonalanie narzędzi, od których jesteśmy zależni.

## Spoiwo, które spaja wszystko w całość: niestandardowy kod na dużą skalę {#the-glue-that-holds-it-all-together-custom-code-at-scale}

Chociaż nasze pakiety npm i wkład w istniejące projekty są znaczące, to niestandardowy kod, który integruje te komponenty, prawdziwie ukazuje nasze techniczne doświadczenie. Baza kodu Forward Email to efekt dekady pracy rozwojowej, sięgającej 2017 roku, kiedy projekt rozpoczął się jako [bezpłatne przekazywanie poczty elektronicznej](https://github.com/forwardemail/free-email-forwarding), zanim został scalony w monorepozytorium.

### Ogromny wysiłek rozwojowy {#a-massive-development-effort}

Skala tego niestandardowego kodu integracyjnego jest imponująca:

* **Łączna liczba wpłat**: Ponad 3217 zatwierdzeń
* **Rozmiar bazy kodu**: Ponad 421 545 wierszy kodu w plikach JavaScript, Pug, CSS i JSON\[^33]

To tysiące godzin pracy rozwojowej, sesji debugowania i optymalizacji wydajności. To „tajny sos”, który przekształca poszczególne pakiety w spójną, niezawodną usługę, z której codziennie korzystają tysiące klientów.

### Integracja podstawowych zależności {#core-dependencies-integration}

Baza kodów Forward Email integruje liczne zależności w jedną, spójną całość:

* **Przetwarzanie poczty e-mail**: Integruje Nodemailer do wysyłania, serwer SMTP do odbierania i Mailparser do analizy
* **Uwierzytelnianie**: Używa Mailauth do weryfikacji DKIM, SPF, DMARC i ARC
* **Rozpoznawanie DNS**: Wykorzystuje Tangerine do DNS-over-HTTPS z globalnym buforowaniem
* **Połączenie MX**: Wykorzystuje mx-connect z integracją Tangerine do niezawodnych połączeń z serwerem pocztowym
* **Planowanie zadań**: Wykorzystuje Bree do niezawodnego przetwarzania zadań w tle z wątkami roboczymi
* **Tworzenie szablonów**: Wykorzystuje szablony e-mail do ponownego wykorzystania arkuszy stylów ze strony internetowej w komunikacji z klientami
* **Przechowywanie poczty e-mail**: Implementuje indywidualnie szyfrowane skrzynki pocztowe SQLite przy użyciu lepszych szyfrów sqlite3-multiple-ciphers z szyfrowaniem ChaCha20-Poly1305 w celu zapewnienia prywatności kwantowo bezpiecznej, zapewniając całkowitą izolację między użytkownikami i tylko użytkownik ma dostęp do swojej skrzynki pocztowej

Każda z tych integracji wymaga starannego rozważenia przypadków skrajnych, implikacji wydajnościowych i kwestii bezpieczeństwa. Rezultatem jest solidny system, który niezawodnie obsługuje miliony transakcji e-mail. Nasza implementacja SQLite wykorzystuje również msgpackr do wydajnej serializacji binarnej i WebSockets (za pośrednictwem ws) do aktualizacji statusu w czasie rzeczywistym w całej naszej infrastrukturze.

### Infrastruktura DNS z Tangerine i mx-connect {#dns-infrastructure-with-tangerine-and-mx-connect}

Kluczowym elementem infrastruktury Forward Email jest nasz system rozpoznawania nazw domen (DNS), zbudowany wokół dwóch kluczowych pakietów:

* **[Mandarynka](https://github.com/forwardemail/nodejs-dns-over-https-tangerine)**: Nasza implementacja Node.js DNS-over-HTTPS stanowi natychmiastową alternatywę dla standardowego resolvera DNS, z wbudowanymi ponawianiem prób, limitami czasu, inteligentną rotacją serwerów i obsługą buforowania.

* **[połączenie mx](https://github.com/zone-eu/mx-connect)**: Ten pakiet ustanawia połączenia TCP z serwerami MX, przyjmując domenę docelową lub adres e-mail, rozwiązując odpowiednie serwery MX i łącząc się z nimi w kolejności priorytetów.

Zintegrowaliśmy Tangerine z mx-connect za pośrednictwem [żądanie ściągnięcia #4](https://github.com/zone-eu/mx-connect/pull/4), zapewniające obsługę żądań DNS na poziomie aplikacji przez HTTP w całym systemie Forward Email. Zapewnia to globalne buforowanie dla DNS na dużą skalę, ze spójnością 1:1 w dowolnym regionie, aplikacji lub procesie – co jest kluczowe dla niezawodnego dostarczania wiadomości e-mail w systemie rozproszonym.

## Wpływ na przedsiębiorstwa: Od oprogramowania open source do rozwiązań o znaczeniu krytycznym {#enterprise-impact-from-open-source-to-mission-critical-solutions}

Ukoronowaniem naszej dziesięcioletniej podróży w rozwoju oprogramowania open source było umożliwienie Forward Email obsługi nie tylko indywidualnych programistów, ale także dużych przedsiębiorstw i instytucji edukacyjnych, które stanowią trzon samego ruchu open source.

### Studia przypadków dotyczące infrastruktury poczty elektronicznej o znaczeniu krytycznym {#case-studies-in-mission-critical-email-infrastructure}

Nasze zaangażowanie w niezawodność, prywatność i zasady open source sprawiły, że Forward Email stał się zaufanym wyborem dla organizacji o wysokich wymaganiach dotyczących poczty elektronicznej:

* **Placówki edukacyjne**: Jak szczegółowo opisano w naszym [studium przypadku przekazywania poczty elektronicznej absolwentom](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study), a duże uniwersytety polegają na naszej infrastrukturze, aby utrzymywać stałe kontakty z setkami tysięcy absolwentów za pośrednictwem niezawodnych usług przekazywania wiadomości e-mail.

* **Rozwiązania Linux dla przedsiębiorstw**: [Canonical Ubuntu email enterprise case study](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study) pokazuje, w jaki sposób nasze podejście oparte na otwartym kodzie źródłowym idealnie wpisuje się w potrzeby dostawców systemu Linux dla przedsiębiorstw, oferując im niezbędną przejrzystość i kontrolę.

* **Fundacje Open Source**: Być może najbardziej potwierdzającym potwierdzeniem jest nasza współpraca z Fundacją Linux, udokumentowana w dokumencie [Studium przypadku przedsiębiorstwa poczty e-mail Linux Foundation](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study), gdzie nasza usługa umożliwia komunikację w ramach organizacji nadzorującej rozwój Linuksa.

Istnieje piękna symetria w tym, jak nasze pakiety open source, starannie utrzymywane przez wiele lat, pozwoliły nam zbudować usługę poczty e-mail, która obecnie obsługuje te same społeczności i organizacje, które promują oprogramowanie open source. Ta pełna podróż w kółko — od dostarczania indywidualnych pakietów do zasilania infrastruktury poczty e-mail klasy korporacyjnej dla liderów open source — stanowi ostateczne potwierdzenie naszego podejścia do rozwoju oprogramowania.

## Dekada Open Source: Patrząc w przyszłość {#a-decade-of-open-source-looking-forward}

Gdy spoglądamy wstecz na dekadę naszych działań w ramach open source i myślimy o kolejnych dziesięciu latach, jesteśmy pełni wdzięczności dla społeczności, która wspierała naszą pracę, i podekscytowani tym, co przyniesie przyszłość.

Nasza podróż od indywidualnych współpracowników pakietów do opiekunów kompleksowej infrastruktury poczty e-mail używanej przez duże przedsiębiorstwa i fundacje open source była niezwykła. To dowód mocy rozwoju open source i wpływu, jaki przemyślane, dobrze utrzymane oprogramowanie może mieć na szerszy ekosystem.

W nadchodzących latach zobowiązujemy się do:

* **Ciągłe utrzymywanie i ulepszanie naszych istniejących pakietów**, aby zapewnić, że pozostają one niezawodnymi narzędziami dla programistów na całym świecie.
* **Rozszerzanie naszego wkładu w projekty infrastruktury krytycznej**, szczególnie w obszarze poczty e-mail i bezpieczeństwa.
* **Rozszerzanie możliwości Forward Email** przy jednoczesnym zachowaniu naszego zaangażowania w ochronę prywatności, bezpieczeństwo i transparentność.
* **Wspieranie nowego pokolenia twórców oprogramowania open source** poprzez mentoring, sponsoring i zaangażowanie społeczności.

Wierzymy, że przyszłość rozwoju oprogramowania jest otwarta, oparta na współpracy i oparta na zaufaniu. Kontynuując dostarczanie wysokiej jakości pakietów skoncentrowanych na bezpieczeństwie do ekosystemu JavaScript, mamy nadzieję odegrać niewielką rolę w budowaniu tej przyszłości.

Dziękujemy wszystkim, którzy korzystali z naszych pakietów, przyczynili się do naszych projektów, zgłaszali problemy lub po prostu rozpowszechniali informacje o naszej pracy. Twoje wsparcie umożliwiło tę dekadę wpływu i jesteśmy podekscytowani, widząc, co możemy wspólnie osiągnąć w ciągu następnych dziesięciu lat.

\[^1]: statystyki pobierania npm dla cabin, kwiecień 2025
\[^2]: statystyki pobierania npm dla bson-objectid, luty-marzec 2025
\[^3]: statystyki pobierania npm dla url-regex-safe, kwiecień 2025
\[^4]: liczba gwiazdek na GitHubie dla forwardemail/forwardemail.net w kwietniu 2025
\[^5]: statystyki pobierania npm dla preview-email, kwiecień 2025
\[^7]: statystyki pobierania npm dla superagent, luty-marzec 2025
\[^8]: statystyki pobierania npm dla supertest, luty-marzec 2025
\[^9]: statystyki pobierania npm dla preview-email, luty-marzec 2025
\[^10]: statystyki pobierania npm dla cabin, luty-marzec 2025
\[^11]: statystyki pobierania npm dla url-regex-safe, luty-marzec 2025
\[^12]: Statystyki pobierania npm dla spamscannera, luty-marzec 2025
\[^13]: Dzienne wzorce pobierania ze statystyk npm, kwiecień 2025
\[^14]: Tygodniowe wzorce pobierania ze statystyk npm, kwiecień 2025
\[^15]: Statystyki pobierania npm dla nodemailer, kwiecień 2025
\[^16]: <https://github.com/nodemailer/smtp-server/issues/155>
\[^17]: <https://github.com/nodemailer/smtp-server/issues/node-v12-requires-tls-min>
\[^18]: <https://github.com/nodemailer/mailparser/issues/261>
\[^19]: <https://github.com/nodemailer/nodemailer/issues/1102>
\[^20]: <https://github.com/postalsys/mailauth/issues/30>
\[^21]: <https://github.com/postalsys/mailauth/issues/58>
\[^22]: <https://github.com/postalsys/mailauth/issues/48>
\[^23]: <https://github.com/postalsys/mailauth/issues/74>
\[^24]: <https://github.com/postalsys/mailauth/issues/75>
\[^25]: <https://github.com/postalsys/mailauth/issues/60>
\[^26]: <https://github.com/postalsys/mailauth/issues/73>
\[^27]: Na podstawie problemów z GitHub w repozytorium Upptime
\[^28]: Na podstawie problemów z GitHub w repozytorium Upptime
\[^29]: Na podstawie problemów z GitHub w repozytorium Upptime
\[^30]: Statystyki pobierania npm dla bree, luty-marzec 2025 r.
\[^31]: Na podstawie żądań ściągnięcia z GitHub do Upptime
\[^32]: Na podstawie żądań ściągnięcia z GitHub do Upptime
\[^34]: Statystyki pobierania npm dla koa, luty-marzec 2025
\[^35]: Statystyki pobierania npm dla @koa/router, luty-marzec 2025
\[^36]: Statystyki pobierania npm dla koa-router, luty-marzec 2025
\[^37]: Statystyki pobierania npm dla url-regex, luty-marzec 2025
\[^38]: Statystyki pobierania npm dla @breejs/later, luty-marzec 2025
\[^39]: Statystyki pobierania npm dla szablonów e-mail, luty-marzec 2025
\[^40]: Statystyki pobierania npm dla ścieżek pobierania, luty-marzec 2025
\[^41]: Statystyki pobierania npm dla zmiennych parsowania dotenv, Luty-marzec 2025
\[^42]: statystyki pobierania npm dla @koa/multer, luty-marzec 2025