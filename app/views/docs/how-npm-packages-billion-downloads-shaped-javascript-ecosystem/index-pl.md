# Dekada wpływu: jak nasze pakiety npm osiągnęły miliard pobrań i ukształtowały JavaScript {#a-decade-of-impact-how-our-npm-packages-hit-1-billion-downloads-and-shaped-javascript}

<img loading="lazy" src="/img/articles/npm.webp" alt="NPM packages billion downloads ecosystem" class="rounded-lg" />

## Spis treści {#table-of-contents}

* [Przedmowa](#foreword)
* [Pionierzy, którzy nam zaufali: Isaac Z. Schlueter i Forward Email](#the-pioneers-who-trust-us-isaac-z-schlueter-and-forward-email)
  * [Od powstania npm do przywództwa Node.js](#from-npms-creation-to-nodejs-leadership)
* [Architekt stojący za kodem: podróż Nicka Baugha](#the-architect-behind-the-code-nick-baughs-journey)
  * [Ekspresowy Komitet Techniczny i Kluczowe Wkłady](#express-technical-committee-and-core-contributions)
  * [Wkłady do Koa Framework](#koa-framework-contributions)
  * [Od indywidualnego współpracownika do lidera organizacji](#from-individual-contributor-to-organization-leader)
* [Nasze organizacje GitHub: ekosystemy innowacji](#our-github-organizations-ecosystems-of-innovation)
  * [Cabin: Ustrukturyzowane rejestrowanie dla nowoczesnych aplikacji](#cabin-structured-logging-for-modern-applications)
  * [Skaner spamu: walka z nadużyciami poczty e-mail](#spam-scanner-fighting-email-abuse)
  * [Bree: Nowoczesne planowanie zadań z wątkami roboczymi](#bree-modern-job-scheduling-with-worker-threads)
  * [Przekaż dalej e-mail: infrastruktura poczty e-mail typu open source](#forward-email-open-source-email-infrastructure)
  * [Lad: Niezbędne narzędzia i narzędzia Koa](#lad-essential-koa-utilities-and-tools)
  * [Upptime: Monitorowanie czasu sprawności oprogramowania Open Source](#upptime-open-source-uptime-monitoring)
* [Nasz wkład w ekosystem poczty elektronicznej Forward](#our-contributions-to-the-forward-email-ecosystem)
  * [Od opakowań do produkcji](#from-packages-to-production)
  * [Pętla sprzężenia zwrotnego](#the-feedback-loop)
* [Podstawowe zasady usługi Forward Email: podstawa doskonałości](#forward-emails-core-principles-a-foundation-for-excellence)
  * [Zawsze przyjazne dla programistów, skoncentrowane na bezpieczeństwie i transparentne](#always-developer-friendly-security-focused-and-transparent)
  * [Przestrzeganie sprawdzonych zasad tworzenia oprogramowania](#adherence-to-time-tested-software-development-principles)
  * [Skierowany do ambitnych, początkujących programistów](#targeting-the-scrappy-bootstrapped-developer)
  * [Zasady w praktyce: baza kodów do przesyłania wiadomości e-mail](#principles-in-practice-the-forward-email-codebase)
  * [Prywatność w fazie projektowania](#privacy-by-design)
  * [Zrównoważony Open Source](#sustainable-open-source)
* [Liczby nie kłamią: nasze oszałamiające statystyki pobierania npm](#the-numbers-dont-lie-our-staggering-npm-download-statistics)
  * [Nasz wpływ z lotu ptaka](#a-birds-eye-view-of-our-impact)
  * [Codzienny wpływ na skalę](#daily-impact-at-scale)
  * [Poza surowymi liczbami](#beyond-the-raw-numbers)
* [Wspieranie ekosystemu: nasze sponsorowanie projektów Open Source](#supporting-the-ecosystem-our-open-source-sponsorships)
  * [Andris Reinman: Pionier infrastruktury poczty elektronicznej](#andris-reinman-email-infrastructure-pioneer)
  * [Sindre Sorhus: Twórca pakietu narzędziowego](#sindre-sorhus-utility-package-mastermind)
* [Odkrywanie luk w zabezpieczeniach ekosystemu JavaScript](#uncovering-security-vulnerabilities-in-the-javascript-ecosystem)
  * [Ratunek Koa-Router](#the-koa-router-rescue)
  * [Rozwiązywanie luk w zabezpieczeniach ReDoS](#addressing-redos-vulnerabilities)
  * [Wspieranie bezpieczeństwa Node.js i Chromium](#advocating-for-nodejs-and-chromium-security)
  * [Zabezpieczanie infrastruktury npm](#securing-npm-infrastructure)
* [Nasz wkład w ekosystem poczty elektronicznej Forward](#our-contributions-to-the-forward-email-ecosystem-1)
  * [Ulepszanie podstawowej funkcjonalności Nodemailera](#enhancing-nodemailers-core-functionality)
  * [Udoskonalanie uwierzytelniania poczty e-mail za pomocą Mailauth](#advancing-email-authentication-with-mailauth)
  * [Kluczowe ulepszenia czasu sprawności](#key-upptime-enhancements)
* [Spoiwo, które spaja wszystko w całość: niestandardowy kod na dużą skalę](#the-glue-that-holds-it-all-together-custom-code-at-scale)
  * [Ogromny wysiłek rozwojowy](#a-massive-development-effort)
  * [Integracja podstawowych zależności](#core-dependencies-integration)
  * [Infrastruktura DNS z Tangerine i mx-connect](#dns-infrastructure-with-tangerine-and-mx-connect)
* [Wpływ na przedsiębiorstwa: od oprogramowania typu open source do rozwiązań o znaczeniu krytycznym](#enterprise-impact-from-open-source-to-mission-critical-solutions)
  * [Studia przypadków dotyczące infrastruktury poczty e-mail o znaczeniu krytycznym](#case-studies-in-mission-critical-email-infrastructure)
* [Dekada Open Source: Spojrzenie w przyszłość](#a-decade-of-open-source-looking-forward)

## Przedmowa {#foreword}

W świecie [JavaScript](https://en.wikipedia.org/wiki/JavaScript) i [Node.js](https://en.wikipedia.org/wiki/Node.js) niektóre pakiety są niezbędne – pobierane miliony razy dziennie i napędzające aplikacje na całym świecie. Za tymi narzędziami stoją programiści skupieni na jakości open source. Dzisiaj pokażemy, jak nasz zespół pomaga w tworzeniu i utrzymywaniu pakietów npm, które stały się kluczowymi elementami ekosystemu JavaScript.

## Pionierzy, którzy nam zaufali: Isaac Z. Schlueter i Forward Email {#the-pioneers-who-trust-us-isaac-z-schlueter-and-forward-email}

Jesteśmy dumni, że mamy użytkownika [Isaac Z. Schlueter](https://izs.me/) ([GitHub: isaacs](https://github.com/isaacs)). Isaac stworzył [npm](https://en.wikipedia.org/wiki/Npm_\(software\) i pomógł zbudować [Node.js](https://en.wikipedia.org/wiki/Node.js). Jego zaufanie do Forward Email pokazuje, że koncentrujemy się na jakości i bezpieczeństwie. Isaac używa Forward Email w kilku domenach, w tym izs.me.

Wpływ Isaaca na JavaScript jest ogromny. W 2009 roku był jednym z pierwszych, którzy dostrzegli potencjał Node.js, współpracując z [Ryan Dahl](https://en.wikipedia.org/wiki/Ryan_Dahl), twórcą tej platformy. Jak powiedział Isaac w [wywiad dla magazynu Increment](https://increment.com/development/interview-with-isaac-z-schlueter-ceo-of-npm/): „W samym środku tej bardzo małej społeczności ludzi próbujących znaleźć sposób na stworzenie JavaScriptu po stronie serwera, Ryan Dahl stworzył Node, który był po prostu właściwym podejściem. Dołożyłem do tego swoje trzy grosze i zaangażowałem się w połowie 2009 roku”.

> \[!NOTE]
> Dla zainteresowanych historią Node.js dostępne są doskonałe filmy dokumentalne, które przedstawiają jego rozwój, w tym [Historia Node.js](https://www.youtube.com/watch?v=LB8KwiiUGy0) i [10 rzeczy, których żałuję w Node.js – Ryan Dahl](https://www.youtube.com/watch?v=jo_B4LTHi3I). Film Ryana Dahla [osobista strona internetowa](https://tinyclouds.org/) również zawiera cenne spostrzeżenia na temat jego twórczości.

### Od powstania npm do przywództwa Node.js {#from-npms-creation-to-nodejs-leadership}

Isaac stworzył npm we wrześniu 2009 roku, a pierwsza użyteczna wersja została wydana na początku 2010 roku. Ten menedżer pakietów wypełnił kluczową potrzebę Node.js, umożliwiając programistom łatwe udostępnianie i ponowne wykorzystywanie kodu. Według [Strona Wikipedii o Node.js](https://en.wikipedia.org/wiki/Node.js): „W styczniu 2010 roku wprowadzono menedżera pakietów dla środowiska Node.js o nazwie npm. Menedżer pakietów umożliwia programistom publikowanie i udostępnianie pakietów Node.js wraz z towarzyszącym im kodem źródłowym i został zaprojektowany w celu uproszczenia instalacji, aktualizacji i deinstalacji pakietów”.

Kiedy Ryan Dahl zrezygnował z pracy nad Node.js w styczniu 2012 roku, Isaac objął stanowisko lidera projektu. Jak wspomniano na [jego podsumowanie](https://izs.me/resume), „kierował rozwojem kilku fundamentalnych interfejsów API Node.js, w tym systemu modułów CommonJS, interfejsów API systemu plików i strumieni” oraz „przez 2 lata pełnił funkcję BDFL (Dobrego Dyktatora na Całe Życie) projektu, zapewniając stale rosnącą jakość i niezawodność procesu kompilacji dla wersji Node.js od v0.6 do v0.10”.

Isaac przeprowadził Node.js przez kluczowy okres rozwoju, ustanawiając standardy, które do dziś kształtują tę platformę. Później, w 2014 roku, założył npm, Inc., aby wspierać rejestr npm, którym wcześniej samodzielnie zarządzał.

Dziękujemy Isaacowi za jego ogromny wkład w rozwój języka JavaScript i nadal korzystamy z wielu stworzonych przez niego pakietów. Jego praca zmieniła sposób, w jaki tworzymy oprogramowanie i jak miliony programistów na całym świecie udostępniają kod.

## Architekt stojący za kodem: podróż Nicka Baugha {#the-architect-behind-the-code-nick-baughs-journey}

Sercem naszego sukcesu open source jest Nick Baugh, założyciel i właściciel Forward Email. Jego praca w JavaScript trwa już prawie 20 lat i ukształtowała sposób, w jaki niezliczeni programiści tworzą aplikacje. Jego doświadczenie w open source świadczy zarówno o umiejętnościach technicznych, jak i o przywództwie w społeczności.

### Ekspresowy Komitet Techniczny i Główne Wkłady {#express-technical-committee-and-core-contributions}

Doświadczenie Nicka w zakresie frameworków internetowych zapewniło mu miejsce na liście [Ekspresowy Komitet Techniczny](https://expressjs.com/en/resources/community.html), gdzie pomagał w rozwoju jednego z najczęściej używanych frameworków Node.js. Nick jest teraz wymieniony jako nieaktywny członek na liście [Strona społeczności Express](https://expressjs.com/en/resources/community.html).

> \[!IMPORTANT]
> Express został pierwotnie stworzony przez TJ Holowaychuka, płodnego współtwórcę oprogramowania open source, który ukształtował znaczną część ekosystemu Node.js. Jesteśmy wdzięczni TJ za fundamentalną pracę i szanujemy jego [decyzja o zrobieniu przerwy](https://news.ycombinator.com/item?id=37687017) za jego obszerny wkład w rozwój oprogramowania open source.

Jako członek [Ekspresowy Komitet Techniczny](https://expressjs.com/en/resources/community.html), Nick wykazał się dużą dbałością o szczegóły, np. przy wyjaśnianiu dokumentacji `req.originalUrl` i rozwiązywaniu problemów z obsługą formularzy wieloczęściowych.

### Wkłady Koa Framework {#koa-framework-contributions}

Praca Nicka z [Struktura Koa](https://github.com/koajs/koa) – nowoczesną, lżejszą alternatywą dla Express, również stworzoną przez TJ Holowaychuka – jest kolejnym dowodem jego zaangażowania w tworzenie lepszych narzędzi do tworzenia stron internetowych. Jego wkład w Koa obejmuje zarówno zgłaszanie problemów, jak i rozwiązywanie kodów poprzez żądania ściągnięcia, obsługę błędów, zarządzanie typami treści oraz ulepszanie dokumentacji.

Jego praca w Express i Koa zapewnia mu unikalny wgląd w rozwój stron internetowych w Node.js, pomagając naszemu zespołowi tworzyć pakiety, które dobrze współpracują z wieloma ekosystemami frameworków.

### Od indywidualnego współpracownika do lidera organizacji {#from-individual-contributor-to-organization-leader}

To, co zaczęło się od pomocy w istniejących projektach, przerodziło się w tworzenie i utrzymywanie całych ekosystemów pakietów. Nick założył wiele organizacji GitHub – w tym [Kabina](https://github.com/cabinjs), [Skaner spamu](https://github.com/spamscanner), [Przekaż dalej e-mail](https://github.com/forwardemail), [Chłopak](https://github.com/ladjs) i [Bree](https://github.com/breejs) – z których każda rozwiązywała specyficzne potrzeby społeczności JavaScript.

Ta zmiana z osoby pracującej na lidera pokazuje wizję Nicka dotyczącą dobrze zaprojektowanego oprogramowania, które rozwiązuje rzeczywiste problemy. Organizując powiązane pakiety w ramach wyspecjalizowanych organizacji GitHub, zbudował ekosystemy narzędzi, które współpracują ze sobą, zachowując jednocześnie modułowość i elastyczność dla szerszej społeczności programistów.

## Nasze organizacje GitHub: Ekosystemy innowacji {#our-github-organizations-ecosystems-of-innovation}

Organizujemy naszą pracę nad projektami open source wokół wyspecjalizowanych organizacji GitHub, z których każda zajmuje się rozwiązywaniem konkretnych problemów w JavaScript. Taka struktura tworzy spójne rodziny pakietów, które dobrze ze sobą współpracują, zachowując jednocześnie modułowość.

### Kabina: Ustrukturyzowane rejestrowanie dla nowoczesnych aplikacji {#cabin-structured-logging-for-modern-applications}

[Organizacja kabiny](https://github.com/cabinjs) to nasza wersja prostego, wydajnego rejestrowania aplikacji. Główny pakiet [`cabin`](https://github.com/cabinjs/cabin) ma prawie 900 gwiazdek w serwisie GitHub i ponad 100 000 pobrań tygodniowo\[^1]. Cabin zapewnia ustrukturyzowane rejestrowanie, które współpracuje z popularnymi usługami, takimi jak Sentry, LogDNA i Papertrail.

Cechą charakterystyczną Cabin jest przemyślany system API i wtyczek. Pakiety wsparcia, takie jak [`axe`](https://github.com/cabinjs/axe) dla oprogramowania pośredniczącego Express i [`parse-request`](https://github.com/cabinjs/parse-request) do analizy żądań HTTP, świadczą o naszym zaangażowaniu w tworzenie kompleksowych rozwiązań, a nie izolowanych narzędzi.

Na szczególną uwagę zasługuje pakiet [`bson-objectid`](https://github.com/cabinjs/bson-objectid), który w ciągu zaledwie dwóch miesięcy został pobrany ponad 1,7 miliona razy\[^2]. Ta prosta implementacja MongoDB ObjectID stała się rozwiązaniem dla programistów potrzebujących identyfikatorów bez pełnych zależności od MongoDB.

### Skaner spamu: walka z nadużyciami w zakresie poczty e-mail {#spam-scanner-fighting-email-abuse}

Pakiet [Organizacja Spam Scanner](https://github.com/spamscanner) pokazuje nasze zaangażowanie w rozwiązywanie rzeczywistych problemów. Główny pakiet [`spamscanner`](https://github.com/spamscanner/spamscanner) zapewnia zaawansowaną detekcję spamu w wiadomościach e-mail, ale to pakiet [`url-regex-safe`](https://github.com/spamscanner/url-regex-safe) cieszy się ogromnym zainteresowaniem.

Pakiet `url-regex-safe`, pobrany ponad 1,2 miliona razy w ciągu dwóch miesięcy\[^3], naprawia krytyczne luki w zabezpieczeniach w innych wyrażeniach regularnych do wykrywania adresów URL. Ten pakiet pokazuje nasze podejście do open source: znajdowanie typowego problemu (w tym przypadku luk w zabezpieczeniach [Ponów](https://en.wikipedia.org/wiki/ReDoS) w walidacji adresów URL), tworzenie solidnego rozwiązania i jego staranne utrzymywanie.

### Bree: Nowoczesne planowanie zadań z wątkami roboczymi {#bree-modern-job-scheduling-with-worker-threads}

[Organizacja Bree](https://github.com/breejs) to nasza odpowiedź na powszechny problem Node.js: niezawodne planowanie zadań. Główny pakiet [`bree`](https://github.com/breejs/bree), z ponad 3100 gwiazdkami na GitHubie, oferuje nowoczesny harmonogram zadań wykorzystujący wątki robocze Node.js, co zapewnia lepszą wydajność i niezawodność.

> \[!NOTE]
> Bree powstała po tym, jak pomogliśmy w utrzymaniu [Porządek obrad](https://github.com/agenda/agenda), wykorzystując zdobyte doświadczenia do stworzenia lepszego harmonogramu zadań. Nasze wkłady w Agenda pomogły nam znaleźć sposoby na usprawnienie harmonogramu zadań.

Co wyróżnia Bree na tle innych harmonogramów, takich jak Agenda:

* **Brak zależności zewnętrznych**: W przeciwieństwie do Agenda, która wymaga MongoDB, Bree nie wymaga Redis ani MongoDB do zarządzania stanem zadań.
* **Wątki robocze**: Bree wykorzystuje wątki robocze Node.js do obsługi procesów w trybie sandbox, co zapewnia lepszą izolację i wydajność.
* **Proste API**: Bree oferuje szczegółową kontrolę w połączeniu z prostotą, ułatwiając implementację złożonych harmonogramów.
* **Wbudowane wsparcie**: Funkcje takie jak łagodne przeładowywanie, zadania cron, daty i godziny przyjazne dla użytkownika są domyślnie uwzględnione.

Bree jest kluczowym elementem [forwardemail.net](https://github.com/forwardemail/forwardemail.net), obsługującym krytyczne zadania w tle, takie jak przetwarzanie wiadomości e-mail, czyszczenie i planowana konserwacja. Wykorzystanie Bree w Forward Email świadczy o naszym zaangażowaniu w korzystanie z własnych narzędzi w środowisku produkcyjnym, zapewniając ich wysokie standardy niezawodności.

Korzystamy również z innych świetnych pakietów wątków roboczych, takich jak [basen](https://github.com/piscinajs/piscina), oraz klientów HTTP, takich jak [jedenaście](https://github.com/nodejs/undici), i cenimy je. Piscina, podobnie jak Bree, wykorzystuje wątki robocze Node.js do wydajnego przetwarzania zadań. Dziękujemy [Matthew Hill](https://github.com/mcollina), który opiekuje się zarówno undici, jak i pisciną, za jego znaczący wkład w rozwój Node.js. Matteo zasiada w Komitecie Sterującym ds. Technicznych Node.js i znacznie usprawnił działanie klienta HTTP w Node.js.

### Przekaż dalej wiadomość e-mail: Infrastruktura poczty e-mail typu open source {#forward-email-open-source-email-infrastructure}

Naszym najbardziej ambitnym projektem jest [Przekaż dalej e-mail](https://github.com/forwardemail), usługa poczty e-mail o otwartym kodzie źródłowym, która zapewnia przekierowywanie wiadomości e-mail, przechowywanie ich i usługi API. Główne repozytorium ma ponad 1100 gwiazdek na GitHubie\[^4], co świadczy o uznaniu społeczności dla tej alternatywy dla zastrzeżonych usług poczty e-mail.

Pakiet [`preview-email`](https://github.com/forwardemail/preview-email) tej organizacji, z ponad 2,5 milionami pobrań w ciągu dwóch miesięcy\[^5], stał się niezbędnym narzędziem dla programistów pracujących z szablonami wiadomości e-mail. Zapewniając prosty sposób podglądu wiadomości e-mail w trakcie tworzenia, rozwiązuje on częsty problem związany z tworzeniem aplikacji obsługujących pocztę e-mail.

### Lad: Niezbędne narzędzia i narzędzia Koa {#lad-essential-koa-utilities-and-tools}

[Organizacja chłopaków](https://github.com/ladjs) zawiera zbiór niezbędnych narzędzi i narzędzi, których głównym celem jest udoskonalenie ekosystemu frameworka Koa. Pakiety te rozwiązują typowe problemy w tworzeniu stron internetowych i zostały zaprojektowane tak, aby bezproblemowo ze sobą współpracować, zachowując jednocześnie użyteczność.

#### koa-better-error-handler: Ulepszona obsługa błędów dla Koa {#koa-better-error-handler-improved-error-handling-for-koa}

[`koa-better-error-handler`](https://github.com/ladjs/koa-better-error-handler) oferuje lepsze rozwiązanie obsługi błędów w aplikacjach Koa. Dzięki ponad 50 gwiazdkom na GitHubie, ten pakiet sprawia, że `ctx.throw` generuje przyjazne dla użytkownika komunikaty o błędach, jednocześnie rozwiązując kilka ograniczeń wbudowanego mechanizmu obsługi błędów Koa:

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

* Lokalne uwierzytelnianie za pomocą poczty e-mail
* Logowanie za pomocą Apple
* Uwierzytelnianie GitHub
* Uwierzytelnianie Google
* Uwierzytelnianie za pomocą jednorazowego hasła (OTP)

Pakiet jest wysoce konfigurowalny, umożliwiając programistom dostosowywanie nazw pól i fraz do wymagań aplikacji. Został zaprojektowany z myślą o płynnej integracji z Mongoose w zakresie zarządzania użytkownikami, co czyni go idealnym rozwiązaniem dla aplikacji opartych na platformie Koa, które wymagają solidnego uwierzytelniania.

#### graceful: Eleganckie zamykanie aplikacji {#graceful-elegant-application-shutdown}

[`@ladjs/graceful`](https://github.com/ladjs/graceful) rozwiązuje krytyczny problem płynnego zamykania aplikacji Node.js. Ten pakiet, z ponad 70 gwiazdkami na GitHubie, gwarantuje, że Twoja aplikacja może zostać zamknięta bez utraty danych i zawieszania połączeń. Najważniejsze funkcje obejmują:

* Obsługa płynnego zamykania serwerów HTTP (Express/Koa/Fastify)
* Czyste zamykanie połączeń z bazami danych (MongoDB/Mongoose)
* Prawidłowe zamykanie klientów Redis
* Obsługa harmonogramów zadań Bree
* Obsługa niestandardowych procedur zamykania
* Konfigurowalne ustawienia limitu czasu
* Integracja z systemami logowania

Ten pakiet jest niezbędny w aplikacjach produkcyjnych, w których nieoczekiwane wyłączenia mogą prowadzić do utraty lub uszkodzenia danych. Dzięki wdrożeniu odpowiednich procedur wyłączania, `@ladjs/graceful` pomaga zapewnić niezawodność i stabilność aplikacji.

### Czas sprawności: Monitorowanie czasu sprawności oprogramowania Open Source {#upptime-open-source-uptime-monitoring}

[Organizacja czasu sprawności](https://github.com/upptime) reprezentuje nasze zaangażowanie w transparentne monitorowanie oprogramowania typu open source. Główne repozytorium [`upptime`](https://github.com/upptime/upptime) ma ponad 13 000 gwiazdek w serwisie GitHub, co czyni je jednym z najpopularniejszych projektów, w które się angażujemy. Upptime oferuje monitor czasu pracy i stronę statusu, oparte na systemie GitHub, które działają całkowicie bez serwera.

Używamy Upptime do naszej własnej strony statusu pod adresem <https://status.forwardemail.net>, a kod źródłowy jest dostępny pod adresem <https://github.com/forwardemail/status.forwardemail.net>.

To co wyróżnia Upptime to jego architektura:

* **100% Open Source**: Każdy komponent jest w pełni open source i konfigurowalny.
* **Obsługiwane przez GitHub**: Wykorzystuje działania, zgłoszenia i strony GitHub, tworząc rozwiązanie do monitorowania bezserwerowego.
* **Serwer nie jest wymagany**: W przeciwieństwie do tradycyjnych narzędzi do monitorowania, Upptime nie wymaga uruchamiania ani utrzymywania serwera.
* **Automatyczna strona stanu**: Generuje atrakcyjną stronę stanu, którą można hostować na stronach GitHub.
* **Zaawansowane powiadomienia**: Integruje się z różnymi kanałami powiadomień, w tym e-mailem, SMS-em i Slackiem.

Aby ulepszyć doświadczenia naszych użytkowników, zintegrowaliśmy [@octokit/core](https://github.com/octokit/core.js/) z bazą kodu forwardemail.net, aby wyświetlać aktualizacje statusu i zgłoszenia incydentów w czasie rzeczywistym bezpośrednio na naszej stronie internetowej. Ta integracja zapewnia naszym użytkownikom przejrzystość w przypadku jakichkolwiek problemów w całym naszym stosie (strona internetowa, API, MongoDB, Redis, SQLite, SMTP, POP3, IMAP, Bree itp.), oferując natychmiastowe powiadomienia, zmiany ikon odznak, kolory ostrzeżeń i wiele innych.

Biblioteka @octokit/core pozwala nam pobierać dane w czasie rzeczywistym z naszego repozytorium Upptime GitHub, przetwarzać je i wyświetlać w przyjazny dla użytkownika sposób. W przypadku awarii lub spadku wydajności dowolnej usługi, użytkownicy są natychmiast powiadamiani za pomocą wskaźników wizualnych, bez konieczności opuszczania aplikacji głównej. Ta płynna integracja gwarantuje, że nasi użytkownicy zawsze mają aktualne informacje o stanie naszego systemu, zwiększając transparentność i zaufanie.

Rozwiązanie Uptime zostało wdrożone przez setki organizacji poszukujących przejrzystego i niezawodnego sposobu monitorowania swoich usług i informowania użytkowników o ich statusie. Sukces projektu pokazuje siłę tworzenia narzędzi wykorzystujących istniejącą infrastrukturę (w tym przypadku GitHub) do rozwiązywania typowych problemów w nowy sposób.

## Nasz wkład w ekosystem poczty elektronicznej Forward {#our-contributions-to-the-forward-email-ecosystem}

Chociaż z naszych pakietów open source korzystają programiści na całym świecie, stanowią one również fundament naszej własnej usługi Forward Email. Ta podwójna rola – zarówno twórców, jak i użytkowników tych narzędzi – daje nam unikalną perspektywę ich praktycznego zastosowania i napędza ciągłe doskonalenie.

### Od pakietów do produkcji {#from-packages-to-production}

Droga od pojedynczych pakietów do spójnego systemu produkcyjnego wymaga starannej integracji i rozbudowy. W przypadku Forward Email proces ten obejmuje:

* **Rozszerzenia niestandardowe**: Tworzenie rozszerzeń dedykowanych dla poczty e-mail do naszych pakietów open source, które spełniają nasze unikalne wymagania.
* **Wzorce integracji**: Opracowywanie wzorców interakcji tych pakietów w środowisku produkcyjnym.
* **Optymalizacja wydajności**: Identyfikowanie i usuwanie wąskich gardeł wydajnościowych, które pojawiają się dopiero na dużą skalę.
* **Wzmocnienie bezpieczeństwa**: Dodawanie dodatkowych warstw zabezpieczeń, specyficznych dla obsługi poczty e-mail i ochrony danych użytkowników.

Praca ta to tysiące godzin pracy nad rozwojem wykraczającym poza same podstawowe pakiety, czego efektem jest solidna, bezpieczna usługa poczty e-mail wykorzystująca najlepsze cechy naszych projektów typu open source.

### Pętla sprzężenia zwrotnego {#the-feedback-loop}

Być może najcenniejszym aspektem korzystania z własnych pakietów w środowisku produkcyjnym jest generowana przez nie pętla sprzężenia zwrotnego. Kiedy napotykamy ograniczenia lub skrajne przypadki w Forward Email, nie tylko je łatamy lokalnie, ale także ulepszamy pakiety bazowe, co przynosi korzyści zarówno naszej usłudze, jak i szerszej społeczności.

Podejście to doprowadziło do licznych udoskonaleń:

* **Łagodne wyłączanie Bree**: Konieczność wdrożenia funkcji Forward Email bez przestojów doprowadziła do ulepszonych funkcji łagodnego wyłączania w Bree.
* **Rozpoznawanie wzorców przez Spam Scanner**: Rzeczywiste wzorce spamu napotkane w Forward Email wpłynęły na algorytmy wykrywania Spam Scanner.
* **Optymalizacja wydajności Cabin**: Duża liczba logowań w środowisku produkcyjnym ujawniła możliwości optymalizacji w Cabin, które przynoszą korzyści wszystkim użytkownikom.

Dzięki utrzymywaniu tego pozytywnego cyklu między naszą pracą w modelu open source a usługą produkcyjną, mamy pewność, że nasze pakiety pozostają praktycznymi, sprawdzonymi w boju rozwiązaniami, a nie teoretycznymi implementacjami.

## Podstawowe zasady przesyłania wiadomości e-mail: podstawa doskonałości {#forward-emails-core-principles-a-foundation-for-excellence}

Usługa Forward Email została zaprojektowana zgodnie z zestawem podstawowych zasad, którymi kierujemy się przy podejmowaniu wszystkich decyzji programistycznych. Zasady te, szczegółowo opisane w [strona internetowa](/blog/docs/best-quantum-safe-encrypted-email-service#principles), gwarantują, że nasza usługa pozostaje przyjazna dla programistów, bezpieczna i dba o prywatność użytkowników.

### Zawsze przyjazne dla programistów, skoncentrowane na bezpieczeństwie i transparentne {#always-developer-friendly-security-focused-and-transparent}

Naszą nadrzędną zasadą jest tworzenie oprogramowania przyjaznego dla programistów, przy jednoczesnym zachowaniu najwyższych standardów bezpieczeństwa i prywatności. Wierzymy, że doskonałość techniczna nigdy nie powinna odbywać się kosztem użyteczności, a transparentność buduje zaufanie w naszej społeczności.

Zasada ta przejawia się w naszej szczegółowej dokumentacji, jasnych komunikatach o błędach i otwartej komunikacji zarówno o sukcesach, jak i wyzwaniach. Udostępniając cały nasz kod źródłowy jako open source, zachęcamy do analizy i współpracy, wzmacniając zarówno nasze oprogramowanie, jak i cały ekosystem.

### Przestrzeganie sprawdzonych zasad tworzenia oprogramowania {#adherence-to-time-tested-software-development-principles}

Stosujemy się do kilku sprawdzonych zasad tworzenia oprogramowania, które od dziesięcioleci dowodzą swojej wartości:

* **[MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)**: Rozdzielenie problemów poprzez wzorzec Model-Widok-Kontroler
* **[Filozofia Unixa](https://en.wikipedia.org/wiki/Unix_philosophy)**: Tworzenie modułowych komponentów, które dobrze spełniają jedną funkcję
* **[KISS](https://en.wikipedia.org/wiki/KISS_principle)**: Prostota i przejrzystość
* **[DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)**: Nie powtarzaj się, promując ponowne wykorzystanie kodu
* **[YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it)**: Nie będzie Ci to potrzebne, unikając przedwczesnej optymalizacji
* **[Dwanaście czynników](https://12factor.net/)**: Przestrzeganie najlepszych praktyk tworzenia nowoczesnych, skalowalnych aplikacji
* **[Brzytwa Ockhama](https://en.wikipedia.org/wiki/Occam%27s_razor)**: Wybór najprostszego rozwiązania spełniającego wymagania
* **[Dogfooding](https://en.wikipedia.org/wiki/Eating_your_own_dog_food)**: Intensywne korzystanie z naszych własnych produktów

Te zasady to nie tylko koncepcje teoretyczne – są one wpisane w nasze codzienne praktyki programistyczne. Na przykład, nasze przywiązanie do filozofii Unix jest widoczne w sposobie, w jaki strukturujemy nasze pakiety npm: małe, skoncentrowane moduły, które można łączyć w celu rozwiązywania złożonych problemów.

### Skierowany do programistów Scrappy i Bootstrapped {#targeting-the-scrappy-bootstrapped-developer}

Skupiamy się szczególnie na deweloperach, którzy są ambitni, bootstrappingowi i [ramen-opłacalny](https://www.paulgraham.com/ramenprofitable.html). Ta koncentracja kształtuje wszystko, od naszego modelu cenowego po decyzje techniczne. Rozumiemy wyzwania związane z tworzeniem produktów przy ograniczonych zasobach, ponieważ sami tego doświadczyliśmy.

Ta zasada jest szczególnie ważna w naszym podejściu do open source. Tworzymy i utrzymujemy pakiety, które rozwiązują rzeczywiste problemy programistów bez budżetów korporacyjnych, udostępniając potężne narzędzia każdemu, niezależnie od posiadanych zasobów.

### Zasady w praktyce: baza kodów wiadomości e-mail {#principles-in-practice-the-forward-email-codebase}

Zasady te są wyraźnie widoczne w kodzie Forward Email. Nasz plik package.json ujawnia przemyślany zestaw zależności, z których każda została dobrana tak, aby odpowiadała naszym podstawowym wartościom:

* Pakiety skoncentrowane na bezpieczeństwie, takie jak `mailauth` do uwierzytelniania poczty e-mail
* Przyjazne dla programistów narzędzia, takie jak `preview-email`, ułatwiające debugowanie
* Modułowe komponenty, takie jak różne narzędzia `p-*` firmy Sindre Sorhus

Dzięki konsekwentnemu przestrzeganiu tych zasad udało nam się stworzyć usługę, której programiści mogą zaufać w kwestii infrastruktury poczty e-mail — jest ona bezpieczna, niezawodna i zgodna z wartościami społeczności open source.

### Prywatność w fazie projektowania {#privacy-by-design}

Prywatność nie jest kwestią drugorzędną ani cechą marketingową usługi Forward Email — jest to fundamentalna zasada projektowania, która wpływa na każdy aspekt naszej usługi i kodu:

* **Szyfrowanie bez dostępu**: Wdrożyliśmy systemy, które technicznie uniemożliwiają nam odczytywanie wiadomości e-mail użytkowników.
* **Minimalne gromadzenie danych**: Gromadzimy tylko dane niezbędne do świadczenia naszych usług i nic więcej.
* **Przejrzysta polityka**: Nasza polityka prywatności jest napisana jasnym, zrozumiałym językiem, bez żargonu prawniczego.
* **Weryfikacja Open Source**: Nasza baza kodu open source pozwala badaczom bezpieczeństwa weryfikować nasze oświadczenia dotyczące prywatności.

Zaangażowanie to obejmuje również nasze pakiety open source, które od podstaw projektujemy z uwzględnieniem najlepszych praktyk bezpieczeństwa i prywatności.

### Zrównoważony projekt Open Source {#sustainable-open-source}

Wierzymy, że oprogramowanie open source potrzebuje zrównoważonych modeli, aby móc się rozwijać w dłuższej perspektywie. Nasze podejście obejmuje:

* **Wsparcie komercyjne**: Oferujemy najwyższej jakości wsparcie i usługi związane z naszymi narzędziami open source.
* **Zrównoważone licencjonowanie**: Korzystamy z licencji, które chronią zarówno wolności użytkowników, jak i zrównoważony rozwój projektu.
* **Zaangażowanie społeczności**: Aktywna współpraca z twórcami w celu budowania wspierającej społeczności.
* **Przejrzyste plany rozwoju**: Udostępniamy nasze plany rozwoju, aby umożliwić użytkownikom odpowiednie planowanie.

Koncentrując się na zrównoważonym rozwoju, dbamy o to, aby nasze projekty typu open source mogły się z czasem rozwijać i udoskonalać, zamiast popadać w zaniedbanie.

## Liczby nie kłamią: nasze oszałamiające statystyki pobierania npm {#the-numbers-dont-lie-our-staggering-npm-download-statistics}

Mówiąc o wpływie oprogramowania open source, statystyki pobrań stanowią namacalny miernik akceptacji i zaufania. Wiele pakietów, którymi się opiekujemy, osiągnęło skalę, jaką osiąga niewiele projektów open source, a łączna liczba pobrań sięga miliardów.

![Najpopularniejsze pakiety npm według pobrań](/img/art/top_packages_bar_chart.svg)

> \[!IMPORTANT]
> Chociaż z dumą pomagamy w utrzymaniu wielu często pobieranych pakietów w ekosystemie JavaScript, chcemy podkreślić, że wiele z nich zostało pierwotnie stworzonych przez innych utalentowanych programistów. Pakiety takie jak superagent i supertest zostały pierwotnie stworzone przez TJ Holowaychuka, którego bogaty wkład w rozwój oprogramowania open source odegrał kluczową rolę w kształtowaniu ekosystemu Node.js.

### Widok z lotu ptaka na nasz wpływ {#a-birds-eye-view-of-our-impact}

W ciągu zaledwie dwóch miesięcy od lutego do marca 2025 r. przedstawiamy najlepsze pakiety, do których się przyczyniamy i które pomagają nam utrzymać rekordowo wysokie liczby pobrań:

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
* **__PROTECTED_LINK_259__0**: 1 124 686 pobrań\[^40]
* **__PROTECTED_LINK_259__1**: 1 200 000 pobrań\[^11]
* **__PROTECTED_LINK_259__2**: 894 666 pobrań\[^41]
* **__PROTECTED_LINK_259__3**: 839 585 pobrań\[^42]
* **__PROTECTED_LINK_259__4**: 145 000 pobrań\[^12]
* **__PROTECTED_LINK_259__5**: 24 270 pobrań\[^30]

> \[!NOTE]
> Kilka innych pakietów, w których utrzymaniu pomagamy, ale których nie stworzyliśmy, ma jeszcze większą liczbę pobrań, w tym `form-data` (ponad 738 mln pobrań), `toidentifier` (ponad 309 mln pobrań), `stackframe` (ponad 116 mln pobrań) i `error-stack-parser` (ponad 113 mln pobrań). Jesteśmy zaszczyceni, że możemy przyczynić się do rozwoju tych pakietów, szanując jednocześnie pracę ich oryginalnych autorów.

To nie tylko imponujące liczby – to prawdziwi programiści rozwiązujący rzeczywiste problemy za pomocą kodu, który pomagamy utrzymywać. Każde pobranie to przykład, w którym te pakiety pomogły komuś stworzyć coś wartościowego, od projektów hobbystycznych po aplikacje korporacyjne używane przez miliony.

![Dystrybucja kategorii pakietów](/img/art/category_pie_chart.svg)

### Dzienny wpływ na skalę {#daily-impact-at-scale}

Codzienne wzorce pobierania wskazują na stałe, wysokie wykorzystanie, ze szczytami sięgającymi milionów pobrań dziennie\[^13]. Ta spójność świadczy o stabilności i niezawodności tych pakietów – programiści nie tylko je testują, ale integrują je ze swoimi podstawowymi procesami i polegają na nich każdego dnia.

Tygodniowe wzorce pobrań pokazują jeszcze bardziej imponujące liczby, stale oscylujące wokół dziesiątek milionów pobrań tygodniowo\[^14]. Stanowi to ogromny ślad w ekosystemie JavaScript, a te pakiety działają w środowiskach produkcyjnych na całym świecie.

### Poza surowymi liczbami {#beyond-the-raw-numbers}

Choć same statystyki pobrań są imponujące, to jednak świadczą o głębszym zaufaniu, jakim społeczność darzy te pakiety. Utrzymywanie pakietów na tak dużą skalę wymaga nieustannego zaangażowania w:

* **Wsteczna kompatybilność**: Zmiany muszą być starannie rozważone, aby uniknąć awarii istniejących implementacji.
* **Bezpieczeństwo**: Ponieważ miliony aplikacji zależą od tych pakietów, luki w zabezpieczeniach mogą mieć daleko idące konsekwencje.
* **Wydajność**: W tej skali nawet drobne ulepszenia wydajności mogą przynieść znaczące korzyści.
* **Dokumentacja**: Przejrzysta, wyczerpująca dokumentacja jest niezbędna dla pakietów używanych przez programistów na każdym poziomie doświadczenia.

Stały wzrost liczby pobrań na przestrzeni lat odzwierciedla sukces w dotrzymywaniu tych zobowiązań i budowaniu zaufania wśród społeczności programistów poprzez niezawodne, dobrze utrzymywane pakiety.

## Wspieranie ekosystemu: Nasze sponsorowanie oprogramowania typu open source {#supporting-the-ecosystem-our-open-source-sponsorships}

> \[!TIP]
> Zrównoważony rozwój oprogramowania typu open source nie polega wyłącznie na dostarczaniu kodu, ale również na wspieraniu programistów, którzy utrzymują krytyczną infrastrukturę.

Oprócz naszego bezpośredniego wkładu w ekosystem JavaScript, z dumą sponsorujemy wybitnych twórców Node.js, których praca stanowi fundament wielu nowoczesnych aplikacji. Nasze sponsoringi obejmują:

### Andris Reinman: Pionier infrastruktury poczty e-mail {#andris-reinman-email-infrastructure-pioneer}

[Andris Reinman](https://github.com/andris9) jest twórcą [Nodemailer](https://github.com/nodemailer/nodemailer), najpopularniejszej biblioteki do wysyłania wiadomości e-mail dla Node.js, z ponad 14 milionami pobrań tygodniowo\[^15]. Jego prace obejmują również inne kluczowe komponenty infrastruktury poczty e-mail, takie jak [Serwer SMTP](https://github.com/nodemailer/smtp-server), [Parser poczty](https://github.com/nodemailer/mailparser) i [Dzika Kaczka](https://github.com/nodemailer/wildduck).

Nasze wsparcie finansowe pozwala nam zapewnić ciągłą konserwację i rozwój tych niezbędnych narzędzi, które wspomagają komunikację e-mailową w niezliczonych aplikacjach Node.js, w tym w naszej własnej usłudze Forward Email.

### Sindre Sorhus: Twórca pakietu narzędziowego {#sindre-sorhus-utility-package-mastermind}

[Sindre Sorhus](https://github.com/sindresorhus) jest jednym z najbardziej aktywnych twórców oprogramowania open source w ekosystemie JavaScript, z ponad 1000 pakietami npm na swoim koncie. Jego narzędzia, takie jak [p-map](https://github.com/sindresorhus/p-map), [p-ponów](https://github.com/sindresorhus/p-retry) i [jest-strumieniem](https://github.com/sindresorhus/is-stream), to podstawowe elementy składowe używane w całym ekosystemie Node.js.

Sponsorując pracę Sindre, wspieramy rozwój tych kluczowych narzędzi, które zwiększają wydajność i niezawodność programowania w języku JavaScript.

Te sponsoringi odzwierciedlają nasze zaangażowanie w szerszy ekosystem open source. Zdajemy sobie sprawę, że nasz sukces opiera się na fundamencie, który stworzyli ci i inni współtwórcy, i jesteśmy zdeterminowani, aby zapewnić stabilność całego ekosystemu.

## Odkrywanie luk w zabezpieczeniach ekosystemu JavaScript {#uncovering-security-vulnerabilities-in-the-javascript-ecosystem}

Nasze zaangażowanie w rozwój oprogramowania open source wykracza poza samo tworzenie funkcji i obejmuje identyfikację i usuwanie luk w zabezpieczeniach, które mogą mieć wpływ na miliony programistów. Kilka z naszych najważniejszych osiągnięć w ekosystemie JavaScript dotyczyło kwestii bezpieczeństwa.

### Ratunek dla routera Koa {#the-koa-router-rescue}

W lutym 2019 roku Nick zidentyfikował krytyczny problem z utrzymaniem popularnego pakietu koa-router. Zgodnie z [poinformowano w Hacker News](https://news.ycombinator.com/item?id=19156707), pakiet został porzucony przez swojego pierwotnego opiekuna, co spowodowało brak rozwiązania luk w zabezpieczeniach i brak aktualizacji dla społeczności.

> \[!WARNING]
> Porzucone pakiety z lukami w zabezpieczeniach stanowią poważne zagrożenie dla całego ekosystemu, zwłaszcza gdy są pobierane miliony razy tygodniowo.

W odpowiedzi Nick stworzył pakiet [@koa/router](https://github.com/koajs/router) i pomógł powiadomić społeczność o zaistniałej sytuacji. Od tamtej pory opiekuje się tym kluczowym pakietem, zapewniając użytkownikom Koa bezpieczne i dobrze utrzymane rozwiązanie do routingu.

### Rozwiązywanie luk w zabezpieczeniach ReDoS {#addressing-redos-vulnerabilities}

W 2020 roku Nick zidentyfikował i naprawił krytyczną lukę w zabezpieczeniach [Odmowa usługi za pomocą wyrażeń regularnych (ReDoS)](https://en.wikipedia.org/wiki/ReDoS) w powszechnie używanym pakiecie `url-regex`. Ta luka ([SNYK-JS-URLREGEX-569472](https://security.snyk.io/vuln/SNYK-JS-URLREGEX-569472)) mogła umożliwić atakującym spowodowanie odmowy usługi poprzez podanie specjalnie spreparowanych danych wejściowych, które powodowały katastrofalne cofnięcie się w wyrażeniu regularnym.

Zamiast po prostu załatać istniejący pakiet, Nick stworzył [`url-regex-safe`](https://github.com/spamscanner/url-regex-safe), całkowicie przepisaną implementację, która usuwa lukę w zabezpieczeniach, zachowując jednocześnie zgodność z oryginalnym API. Opublikował również [kompleksowy wpis na blogu](/blog/docs/url-regex-javascript-node-js), w którym wyjaśnił lukę w zabezpieczeniach i wskazał sposób jej ograniczenia.

Niniejsza praca stanowi przykład naszego podejścia do kwestii bezpieczeństwa: nie tylko rozwiązywanie problemów, ale także edukowanie społeczności i oferowanie solidnych alternatyw, które zapobiegną podobnym problemom w przyszłości.

### Wspieranie bezpieczeństwa Node.js i Chromium {#advocating-for-nodejs-and-chromium-security}

Nick aktywnie działał również na rzecz poprawy bezpieczeństwa w szerszym ekosystemie. W sierpniu 2020 roku zidentyfikował istotny problem bezpieczeństwa w Node.js związany z obsługą nagłówków HTTP, który został zgłoszony w [Rejestr](https://www.theregister.com/2020/08/18/nodejs_chromium_patch/).

Ten problem, wynikający z poprawki w Chromium, mógł potencjalnie umożliwić atakującym ominięcie zabezpieczeń. Reprezentacja Nicka pomogła zapewnić szybkie rozwiązanie problemu, chroniąc miliony aplikacji Node.js przed potencjalną eksploatacją.

### Zabezpieczanie infrastruktury npm {#securing-npm-infrastructure}

Jeszcze w tym samym miesiącu Nick zidentyfikował kolejny krytyczny problem bezpieczeństwa, tym razem w infrastrukturze poczty e-mail npm. Jak zgłoszono w [Rejestr](https://www.theregister.com/2020/08/25/nodejs_dmarc_phishing/), npm nieprawidłowo implementował protokoły uwierzytelniania poczty e-mail DMARC, SPF i DKIM, co potencjalnie umożliwiało atakującym wysyłanie wiadomości phishingowych, które wyglądały na pochodzące z npm.

Raport Nicka doprowadził do udoskonalenia zabezpieczeń poczty e-mail w npm, chroniąc miliony programistów, którzy polegają na npm w zarządzaniu pakietami, przed potencjalnymi atakami phishingowymi.

## Nasz wkład w ekosystem poczty elektronicznej Forward {#our-contributions-to-the-forward-email-ecosystem-1}

Usługa Forward Email opiera się na kilku kluczowych projektach open source, takich jak Nodemailer, WildDuck i mailauth. Nasz zespół wniósł znaczący wkład w te projekty, pomagając w identyfikacji i naprawie poważnych problemów wpływających na dostarczanie i bezpieczeństwo wiadomości e-mail.

### Ulepszanie podstawowej funkcjonalności Nodemailera {#enhancing-nodemailers-core-functionality}

[Nodemailer](https://github.com/nodemailer/nodemailer) stanowi podstawę wysyłania wiadomości e-mail w Node.js, a nasz wkład pomógł uczynić go bardziej niezawodnym:

* **Ulepszenia serwera SMTP**: Naprawiliśmy błędy parsowania, problemy z obsługą strumieni i problemy z konfiguracją TLS w komponencie serwera SMTP\[^16]\[^17].
* **Ulepszenia parsera poczty**: Naprawiliśmy błędy dekodowania sekwencji znaków i problemy z parserem, które mogły powodować błędy przetwarzania wiadomości e-mail\[^18]\[^19].

Dzięki temu wkładowi Nodemailer pozostaje niezawodną podstawą do przetwarzania wiadomości e-mail w aplikacjach Node.js, w tym do przekazywania wiadomości e-mail.

### Udoskonalanie uwierzytelniania poczty e-mail za pomocą Mailauth {#advancing-email-authentication-with-mailauth}

[Mailauth](https://github.com/postalsys/mailauth) zapewnia krytyczną funkcjonalność uwierzytelniania wiadomości e-mail, a nasz wkład znacząco poprawił jej możliwości:

* **Ulepszenia weryfikacji DKIM**: Odkryliśmy i zgłosiliśmy, że X/Twitter ma problemy z pamięcią podręczną DNS, powodujące błędy DKIM dla wiadomości wychodzących, zgłaszając to na Hacker One\[^20].
* **Ulepszenia DMARC i ARC**: Naprawiliśmy problemy z weryfikacją DMARC i ARC, które mogły prowadzić do nieprawidłowych wyników uwierzytelniania\[^21]\[^22].
* **Optymalizacja wydajności**: Wprowadziliśmy optymalizacje, które poprawiają wydajność procesów uwierzytelniania wiadomości e-mail\[^23]\[^24]\[^25]\[^26].

Dzięki tym usprawnieniom uwierzytelnianie poczty e-mail jest dokładne i niezawodne, chroniąc użytkowników przed atakami typu phishing i spoofing.

### Kluczowe ulepszenia czasu sprawności {#key-upptime-enhancements}

Nasz wkład w Upptime obejmuje:

* **Monitorowanie certyfikatów SSL**: Dodaliśmy funkcjonalność monitorowania wygasania certyfikatów SSL, zapobiegając nieoczekiwanym przestojom spowodowanym wygaśnięciem certyfikatów\[^27].
* **Obsługa wielu numerów SMS**: Wprowadziliśmy obsługę powiadamiania wielu członków zespołu za pośrednictwem wiadomości SMS o wystąpieniu incydentów, co skraca czas reakcji\[^28].
* **Poprawki w sprawdzaniu IPv6**: Usunęliśmy problemy z sprawdzaniem łączności IPv6, zapewniając dokładniejsze monitorowanie w nowoczesnych środowiskach sieciowych\[^29].
* **Obsługa trybu ciemnego/jasnego**: Dodaliśmy obsługę motywów, aby poprawić komfort korzystania ze stron statusu\[^31].
* **Lepsza obsługa TCP-Ping**: Ulepszyliśmy funkcjonalność TCP-Ping, aby zapewnić bardziej niezawodne testowanie połączenia\[^32].

Udoskonalenia te nie tylko usprawniają monitorowanie statusu usługi Forward Email, ale są dostępne dla całej społeczności użytkowników Upptime, co pokazuje nasze zaangażowanie w udoskonalanie narzędzi, od których jesteśmy zależni.

## Spoiwo, które spaja wszystko w całość: niestandardowy kod w dużej skali {#the-glue-that-holds-it-all-together-custom-code-at-scale}

Chociaż nasze pakiety npm i wkład w istniejące projekty są znaczące, to niestandardowy kod, który integruje te komponenty, prawdziwie ukazuje nasze techniczne doświadczenie. Baza kodu Forward Email to efekt dekady pracy rozwojowej, sięgającej 2017 roku, kiedy projekt rozpoczął się jako [bezpłatne przekazywanie poczty e-mail](https://github.com/forwardemail/free-email-forwarding), zanim został scalony z monorepozytorium.

### Ogromny wysiłek rozwojowy {#a-massive-development-effort}

Skala tego niestandardowego kodu integracyjnego jest imponująca:

* **Łączny wkład**: Ponad 3217 zatwierdzeń
* **Rozmiar bazy kodu**: Ponad 421 545 linii kodu w plikach JavaScript, Pug, CSS i JSON\[^33]

To tysiące godzin pracy programistycznej, sesji debugowania i optymalizacji wydajności. To „sekretny składnik”, który przekształca pojedyncze pakiety w spójną, niezawodną usługę, z której codziennie korzystają tysiące klientów.

### Integracja podstawowych zależności {#core-dependencies-integration}

Baza kodu Forward Email integruje liczne zależności w spójną całość:

* **Przetwarzanie wiadomości e-mail**: Integruje Nodemailer do wysyłania, serwer SMTP do odbierania i Mailparser do analizy
* **Uwierzytelnianie**: Używa Mailauth do weryfikacji DKIM, SPF, DMARC i ARC
* **Rozpoznawanie DNS**: Wykorzystuje Tangerine do DNS-over-HTTPS z globalnym buforowaniem
* **Połączenie MX**: Wykorzystuje mx-connect z integracją Tangerine w celu zapewnienia niezawodnych połączeń z serwerami pocztowymi
* **Planowanie zadań**: Wykorzystuje Bree do niezawodnego przetwarzania zadań w tle z wątkami roboczymi
* **Tworzenie szablonów**: Wykorzystuje szablony wiadomości e-mail do ponownego wykorzystywania arkuszy stylów ze strony internetowej w komunikacji z klientami
* **Przechowywanie wiadomości e-mail**: Implementuje indywidualnie szyfrowane skrzynki pocztowe SQLite przy użyciu lepszych szyfrów wielokrotnych SQLite3 z szyfrowaniem ChaCha20-Poly1305 dla zapewnienia kwantowo bezpiecznej prywatności, zapewniając pełną izolację między użytkownikami i tylko użytkownik ma dostęp do swojej skrzynki pocztowej

Każda z tych integracji wymaga starannego rozważenia przypadków brzegowych, wpływu na wydajność i kwestii bezpieczeństwa. Rezultatem jest solidny system, który niezawodnie obsługuje miliony transakcji e-mail. Nasza implementacja SQLite wykorzystuje również msgpackr do wydajnej serializacji binarnej oraz WebSockets (za pośrednictwem WS) do aktualizacji statusu w czasie rzeczywistym w całej naszej infrastrukturze.

### Infrastruktura DNS z Tangerine i mx-connect {#dns-infrastructure-with-tangerine-and-mx-connect}

Kluczowym elementem infrastruktury Forward Email jest nasz system rozpoznawania nazw domen (DNS), zbudowany wokół dwóch kluczowych pakietów:

* **[Mandarynka](https://github.com/forwardemail/nodejs-dns-over-https-tangerine)**: Nasza implementacja Node.js DNS-over-HTTPS stanowi natychmiastową alternatywę dla standardowego resolvera DNS, z wbudowanymi ponawianiem prób, limitami czasu, inteligentną rotacją serwerów i obsługą buforowania.

* **[mx-connect](https://github.com/zone-eu/mx-connect)**: Ten pakiet nawiązuje połączenia TCP z serwerami MX, przyjmując domenę docelową lub adres e-mail, rozwiązując odpowiednie serwery MX i łącząc się z nimi w kolejności priorytetów.

Zintegrowaliśmy Tangerine z mx-connect za pośrednictwem [żądanie ściągnięcia #4](https://github.com/zone-eu/mx-connect/pull/4), zapewniające DNS warstwy aplikacji dla żądań HTTP w całym systemie Forward Email. Zapewnia to globalne buforowanie dla DNS na dużą skalę, ze spójnością 1:1 w dowolnym regionie, aplikacji lub procesie – co jest kluczowe dla niezawodnego dostarczania wiadomości e-mail w systemie rozproszonym.

## Wpływ na przedsiębiorstwa: Od oprogramowania Open Source do rozwiązań o znaczeniu krytycznym {#enterprise-impact-from-open-source-to-mission-critical-solutions}

Ukoronowaniem naszej dziesięcioletniej podróży w rozwoju oprogramowania open source było umożliwienie Forward Email obsługi nie tylko indywidualnych programistów, ale także dużych przedsiębiorstw i instytucji edukacyjnych, które stanowią trzon ruchu open source.

### Studia przypadków dotyczące infrastruktury poczty e-mail o znaczeniu krytycznym {#case-studies-in-mission-critical-email-infrastructure}

Nasze zaangażowanie w niezawodność, prywatność i zasady open source sprawiło, że Forward Email stał się zaufanym wyborem dla organizacji o wysokich wymaganiach dotyczących poczty e-mail:

* **Instytucje edukacyjne**: Jak szczegółowo opisano w naszym [studium przypadku przekierowywania wiadomości e-mail absolwentów](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study). Duże uniwersytety polegają na naszej infrastrukturze, aby utrzymywać stałe kontakty z setkami tysięcy absolwentów za pośrednictwem niezawodnych usług przekazywania wiadomości e-mail.

* **Rozwiązania Linux dla przedsiębiorstw**: [Studium przypadku korporacyjnej poczty e-mail Canonical Ubuntu](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study) pokazuje, w jaki sposób nasze podejście oparte na otwartym kodzie źródłowym idealnie wpisuje się w potrzeby dostawców systemu Linux dla przedsiębiorstw, oferując im niezbędną przejrzystość i kontrolę.

* **Fundacje Open Source**: Być może najbardziej potwierdzającym potwierdzeniem jest nasza współpraca z Fundacją Linux, udokumentowana w dokumencie [Studium przypadku przedsiębiorstwa poczty elektronicznej Linux Foundation](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study), gdzie nasza usługa umożliwia komunikację w ramach organizacji nadzorującej rozwój Linuksa.

Istnieje piękna symetria w tym, jak nasze pakiety open source, starannie utrzymywane przez wiele lat, umożliwiły nam stworzenie usługi poczty elektronicznej, która obecnie wspiera społeczności i organizacje promujące oprogramowanie open source. Ta pełna droga – od dostarczania pojedynczych pakietów po tworzenie infrastruktury poczty elektronicznej klasy korporacyjnej dla liderów open source – stanowi ostateczne potwierdzenie słuszności naszego podejścia do tworzenia oprogramowania.

## Dekada Open Source: Spojrzenie w przyszłość {#a-decade-of-open-source-looking-forward}

Kiedy wspominamy dekadę naszych działań w ramach open source i myślimy o kolejnych dziesięciu latach, jesteśmy pełni wdzięczności dla społeczności, która wspierała naszą pracę, a jednocześnie z entuzjazmem myślimy o tym, co przyniesie przyszłość.

Nasza droga od indywidualnych twórców pakietów do opiekunów kompleksowej infrastruktury poczty elektronicznej wykorzystywanej przez duże przedsiębiorstwa i fundacje open source była niezwykła. To dowód na siłę rozwoju oprogramowania open source i wpływ, jaki przemyślane, dobrze utrzymane oprogramowanie może mieć na szerszy ekosystem.

W nadchodzących latach zobowiązujemy się do:

* **Ciągłe utrzymywanie i ulepszanie naszych istniejących pakietów**, aby zapewnić, że pozostają one niezawodnymi narzędziami dla programistów na całym świecie.
* **Rozszerzanie naszego wkładu w projekty infrastruktury krytycznej**, szczególnie w obszarze poczty e-mail i bezpieczeństwa.
* **Rozszerzanie możliwości Forward Email** przy jednoczesnym zachowaniu naszego zaangażowania w ochronę prywatności, bezpieczeństwo i transparentność.
* **Wspieranie nowego pokolenia twórców oprogramowania open source** poprzez mentoring, sponsoring i zaangażowanie społeczności.

Wierzymy, że przyszłość tworzenia oprogramowania jest otwarta, oparta na współpracy i oparta na zaufaniu. Kontynuując dostarczanie wysokiej jakości pakietów skoncentrowanych na bezpieczeństwie do ekosystemu JavaScript, mamy nadzieję odegrać choć niewielką rolę w budowaniu tej przyszłości.

Dziękujemy wszystkim, którzy korzystali z naszych pakietów, wspierali nasze projekty, zgłaszali problemy lub po prostu dzielili się informacjami o naszej pracy. Dzięki Waszemu wsparciu ta dekada sukcesów stała się możliwa i z niecierpliwością czekamy na to, co wspólnie uda nam się osiągnąć w ciągu najbliższych dziesięciu lat.

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
\[^26]: <https://github.com/nodemailer/smtp-server/issues/node-v12-requires-tls-min>0
\[^27]: Na podstawie problemów z GitHub w repozytorium Upptime
\[^28]: Na podstawie problemów z GitHub w repozytorium Upptime
\[^29]: Na podstawie problemów z GitHub w repozytorium Upptime
\[^30]: Statystyki pobierania npm dla bree, luty-marzec 2025
\[^31]: Na podstawie żądań ściągnięcia z GitHub do Upptime
\[^32]: Na podstawie żądań ściągnięcia z GitHub do Upptime
\[^34]: Statystyki pobierania npm dla koa, luty-marzec 2025
\[^35]: statystyki pobierania npm dla @koa/router, luty-marzec 2025
\[^36]: statystyki pobierania npm dla koa-router, luty-marzec 2025
\[^37]: statystyki pobierania npm dla url-regex, luty-marzec 2025
\[^38]: statystyki pobierania npm dla @breejs/later, luty-marzec 2025
\[^39]: statystyki pobierania npm dla szablonów e-mail, luty-marzec 2025
\[^40]: statystyki pobierania npm dla ścieżek pobierania, luty-marzec 2025
\[^41]: statystyki pobierania npm dla zmiennych parsowania dotenv, luty-marzec 2025
\[^42]: statystyki pobierania npm dla @koa/multer, luty-marzec 2025