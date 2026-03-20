# Dekada Wpływu: Jak Nasze Pakiety npm Osiągnęły 1 Miliard Pobran i Ukształtowały JavaScript {#a-decade-of-impact-how-our-npm-packages-hit-1-billion-downloads-and-shaped-javascript}

<img loading="lazy" src="/img/articles/npm.webp" alt="NPM packages billion downloads ecosystem" class="rounded-lg" />


## Spis Treści {#table-of-contents}

* [Przedmowa](#foreword)
* [Pionierzy, Którzy Nam Ufaą: Isaac Z. Schlueter i Forward Email](#the-pioneers-who-trust-us-isaac-z-schlueter-and-forward-email)
  * [Od Powstania npm do Przywództwa w Node.js](#from-npms-creation-to-nodejs-leadership)
* [Architekt Kodu: Podróż Nicka Baugha](#the-architect-behind-the-code-nick-baughs-journey)
  * [Komitet Techniczny Express i Wkład w Rdzeń](#express-technical-committee-and-core-contributions)
  * [Wkład w Framework Koa](#koa-framework-contributions)
  * [Od Indywidualnego Współtwórcy do Lidera Organizacji](#from-individual-contributor-to-organization-leader)
* [Nasze Organizacje na GitHub: Ekosystemy Innowacji](#our-github-organizations-ecosystems-of-innovation)
  * [Cabin: Strukturalne Logowanie dla Nowoczesnych Aplikacji](#cabin-structured-logging-for-modern-applications)
  * [Spam Scanner: Walka z Nadużyciami Email](#spam-scanner-fighting-email-abuse)
  * [Bree: Nowoczesne Harmonogramowanie Zadań z Worker Threads](#bree-modern-job-scheduling-with-worker-threads)
  * [Forward Email: Infrastruktura Email Open Source](#forward-email-open-source-email-infrastructure)
  * [Lad: Podstawowe Narzędzia i Utylity Koa](#lad-essential-koa-utilities-and-tools)
  * [Upptime: Monitorowanie Dostępności Open Source](#upptime-open-source-uptime-monitoring)
* [Nasz Wkład w Ekosystem Forward Email](#our-contributions-to-the-forward-email-ecosystem)
  * [Od Pakietów do Produkcji](#from-packages-to-production)
  * [Pętla Informacji Zwrotnej](#the-feedback-loop)
* [Podstawowe Zasady Forward Email: Fundament Doskonałości](#forward-emails-core-principles-a-foundation-for-excellence)
  * [Zawsze Przyjazne dla Programistów, Skoncentrowane na Bezpieczeństwie i Transparentne](#always-developer-friendly-security-focused-and-transparent)
  * [Przestrzeganie Sprawdzonych Zasad Rozwoju Oprogramowania](#adherence-to-time-tested-software-development-principles)
  * [Skierowane do Zdeterminowanego, Samofinansującego się Programisty](#targeting-the-scrappy-bootstrapped-developer)
  * [Zasady w Praktyce: Kod Forward Email](#principles-in-practice-the-forward-email-codebase)
  * [Prywatność przez Projektowanie](#privacy-by-design)
  * [Zrównoważone Open Source](#sustainable-open-source)
* [Liczby Nie Kłamią: Nasze Oszałamiające Statystyki Pobran npm](#the-numbers-dont-lie-our-staggering-npm-download-statistics)
  * [Widok z Lotu Ptaka na Nasz Wpływ](#a-birds-eye-view-of-our-impact)
  * [Codzienny Wpływ na Skalę](#daily-impact-at-scale)
  * [Poza Surowymi Liczbami](#beyond-the-raw-numbers)
* [Wsparcie Ekosystemu: Nasze Sponsoringi Open Source](#supporting-the-ecosystem-our-open-source-sponsorships)
  * [Andris Reinman: Pionier Infrastruktury Email](#andris-reinman-email-infrastructure-pioneer)
  * [Sindre Sorhus: Mistrz Pakietów Utylitarnych](#sindre-sorhus-utility-package-mastermind)
* [Odkrywanie Luk Bezpieczeństwa w Ekosystemie JavaScript](#uncovering-security-vulnerabilities-in-the-javascript-ecosystem)
  * [Ratunek dla Koa-Router](#the-koa-router-rescue)
  * [Rozwiązywanie Luk ReDoS](#addressing-redos-vulnerabilities)
  * [Promowanie Bezpieczeństwa Node.js i Chromium](#advocating-for-nodejs-and-chromium-security)
  * [Zabezpieczanie Infrastruktury npm](#securing-npm-infrastructure)
* [Nasz Wkład w Ekosystem Forward Email](#our-contributions-to-the-forward-email-ecosystem-1)
  * [Ulepszanie Rdzenia Nodemailer](#enhancing-nodemailers-core-functionality)
  * [Postępy w Uwierzytelnianiu Email z Mailauth](#advancing-email-authentication-with-mailauth)
  * [Kluczowe Ulepszenia Upptime](#key-upptime-enhancements)
* [Spoiwo Łączące Wszystko: Niestandardowy Kod na Skalę](#the-glue-that-holds-it-all-together-custom-code-at-scale)
  * [Ogromny Wysiłek Programistyczny](#a-massive-development-effort)
  * [Integracja Kluczowych Zależności](#core-dependencies-integration)
  * [Infrastruktura DNS z Tangerine i mx-connect](#dns-infrastructure-with-tangerine-and-mx-connect)
* [Wpływ na Przedsiębiorstwa: Od Open Source do Krytycznych Rozwiązań](#enterprise-impact-from-open-source-to-mission-critical-solutions)
  * [Studia Przypadków Krytycznej Infrastruktury Email](#case-studies-in-mission-critical-email-infrastructure)
* [Dekada Open Source: Patrząc w Przyszłość](#a-decade-of-open-source-looking-forward)
## Przedmowa {#foreword}

W świecie [JavaScript](https://en.wikipedia.org/wiki/JavaScript) i [Node.js](https://en.wikipedia.org/wiki/Node.js) niektóre pakiety są niezbędne — pobierane miliony razy dziennie i napędzające aplikacje na całym świecie. Za tymi narzędziami stoją deweloperzy skupieni na jakości open source. Dziś pokazujemy, jak nasz zespół pomaga budować i utrzymywać pakiety npm, które stały się kluczowymi elementami ekosystemu JavaScript.


## Pionierzy, którzy nam ufają: Isaac Z. Schlueter i Forward Email {#the-pioneers-who-trust-us-isaac-z-schlueter-and-forward-email}

Jesteśmy dumni, że użytkownikiem jest [Isaac Z. Schlueter](https://izs.me/) ([GitHub: isaacs](https://github.com/isaacs)). Isaac stworzył [npm](https://en.wikipedia.org/wiki/Npm_\(software\)) i pomógł budować [Node.js](https://en.wikipedia.org/wiki/Node.js). Jego zaufanie do Forward Email pokazuje nasze skupienie na jakości i bezpieczeństwie. Isaac korzysta z Forward Email dla kilku domen, w tym izs.me.

Wpływ Isaaca na JavaScript jest ogromny. W 2009 roku był jednym z pierwszych, którzy dostrzegli potencjał Node.js, współpracując z [Ryanem Dahlem](https://en.wikipedia.org/wiki/Ryan_Dahl), który stworzył tę platformę. Jak Isaac powiedział w [wywiadzie dla magazynu Increment](https://increment.com/development/interview-with-isaac-z-schlueter-ceo-of-npm/): „W środku tej bardzo małej społeczności grupy ludzi próbujących wymyślić, jak uruchomić JS po stronie serwera, Ryan Dahl wprowadził Node, co było po prostu bardzo wyraźnie właściwym podejściem. Postawiłem na to i bardzo zaangażowałem się mniej więcej w połowie 2009 roku.”

> \[!NOTE]
> Dla zainteresowanych historią Node.js dostępne są doskonałe filmy dokumentalne opisujące jego rozwój, w tym [The Story of Node.js](https://www.youtube.com/watch?v=LB8KwiiUGy0) oraz [10 Things I Regret About Node.js - Ryan Dahl](https://www.youtube.com/watch?v=jo_B4LTHi3I). Osobista strona Ryana Dahla [personal website](https://tinyclouds.org/) również zawiera cenne informacje o jego pracy.

### Od stworzenia npm do przywództwa w Node.js {#from-npms-creation-to-nodejs-leadership}

Isaac stworzył npm we wrześniu 2009 roku, a pierwsza użyteczna wersja została wydana na początku 2010 roku. Ten menedżer pakietów zaspokoił kluczową potrzebę w Node.js, pozwalając deweloperom łatwo dzielić się i ponownie wykorzystywać kod. Według [strony Wikipedii o Node.js](https://en.wikipedia.org/wiki/Node.js), „W styczniu 2010 roku wprowadzono menedżera pakietów dla środowiska Node.js o nazwie npm. Menedżer pakietów pozwala programistom publikować i udostępniać pakiety Node.js wraz z towarzyszącym kodem źródłowym i jest zaprojektowany, aby uprościć instalację, aktualizację i odinstalowywanie pakietów.”

Gdy Ryan Dahl wycofał się z Node.js w styczniu 2012 roku, Isaac przejął rolę lidera projektu. Jak podano w [jego CV](https://izs.me/resume), „Prowadził rozwój kilku fundamentalnych API jądra Node.js, w tym systemu modułów CommonJS, API systemu plików oraz strumieni” oraz „Pełnił rolę BDFL (Benevolent Dictator For Life) projektu przez 2 lata, zapewniając stale rosnącą jakość i niezawodny proces budowania dla wersji Node.js od v0.6 do v0.10.”

Isaac poprowadził Node.js przez kluczowy okres wzrostu, ustanawiając standardy, które nadal kształtują platformę. Później założył npm, Inc. w 2014 roku, aby wspierać rejestr npm, którym wcześniej zarządzał samodzielnie.

Dziękujemy Isaacowi za jego ogromny wkład w JavaScript i nadal korzystamy z wielu pakietów, które stworzył. Jego praca zmieniła sposób, w jaki budujemy oprogramowanie i jak miliony deweloperów na całym świecie dzielą się kodem.


## Architekt stojący za kodem: podróż Nicka Baugha {#the-architect-behind-the-code-nick-baughs-journey}

W sercu naszego sukcesu open source jest Nick Baugh, założyciel i właściciel Forward Email. Jego praca w JavaScript trwa niemal 20 lat i ukształtowała sposób, w jaki niezliczeni deweloperzy tworzą aplikacje. Jego droga w open source pokazuje zarówno umiejętności techniczne, jak i przywództwo w społeczności.

### Komitet techniczny Express i wkład w rdzeń {#express-technical-committee-and-core-contributions}

Ekspertyza Nicka w frameworku webowym zapewniła mu miejsce w [Komitecie Technicznym Express](https://expressjs.com/en/resources/community.html), gdzie pomagał przy jednym z najczęściej używanych frameworków Node.js. Nick jest obecnie wymieniony jako nieaktywny członek na [stronie społeczności Express](https://expressjs.com/en/resources/community.html).
> \[!IMPORTANT]
> Express został pierwotnie stworzony przez TJ Holowaychuka, płodnego współtwórcę open source, który ukształtował dużą część ekosystemu Node.js. Jesteśmy wdzięczni za fundamentalną pracę TJ i szanujemy jego [decyzję o przerwie](https://news.ycombinator.com/item?id=37687017) od jego rozległych wkładów w open source.

Jako członek [Komitetu Technicznego Express](https://expressjs.com/en/resources/community.html), Nick wykazał dużą dbałość o szczegóły w kwestiach takich jak wyjaśnienie dokumentacji `req.originalUrl` oraz naprawa problemów z obsługą formularzy multipart.

### Wkład w framework Koa {#koa-framework-contributions}

Praca Nicka z [frameworkiem Koa](https://github.com/koajs/koa) — nowoczesną, lżejszą alternatywą dla Express, również stworzoną przez TJ Holowaychuka — dodatkowo pokazuje jego zaangażowanie w lepsze narzędzia do tworzenia stron internetowych. Jego wkład w Koa obejmuje zarówno zgłoszenia problemów, jak i kod w postaci pull requestów, dotyczące obsługi błędów, zarządzania typami treści oraz ulepszeń dokumentacji.

Jego praca zarówno przy Express, jak i Koa daje mu unikalny wgląd w rozwój aplikacji webowych w Node.js, pomagając naszemu zespołowi tworzyć pakiety dobrze współpracujące z różnymi ekosystemami frameworków.

### Od indywidualnego współtwórcy do lidera organizacji {#from-individual-contributor-to-organization-leader}

To, co zaczęło się od pomocy istniejącym projektom, rozwinęło się w tworzenie i utrzymywanie całych ekosystemów pakietów. Nick założył wiele organizacji na GitHub — w tym [Cabin](https://github.com/cabinjs), [Spam Scanner](https://github.com/spamscanner), [Forward Email](https://github.com/forwardemail), [Lad](https://github.com/ladjs) oraz [Bree](https://github.com/breejs) — z których każda rozwiązuje konkretne potrzeby społeczności JavaScript.

Ta zmiana z współtwórcy na lidera pokazuje wizję Nicka dotyczącą dobrze zaprojektowanego oprogramowania, które rozwiązuje realne problemy. Organizując powiązane pakiety w wyspecjalizowanych organizacjach GitHub, zbudował ekosystemy narzędzi, które współpracują ze sobą, pozostając jednocześnie modułowe i elastyczne dla szerszej społeczności deweloperów.


## Nasze organizacje na GitHub: ekosystemy innowacji {#our-github-organizations-ecosystems-of-innovation}

Organizujemy naszą pracę open source wokół wyspecjalizowanych organizacji na GitHub, z których każda rozwiązuje konkretne potrzeby w JavaScript. Ta struktura tworzy spójne rodziny pakietów, które dobrze ze sobą współpracują, pozostając jednocześnie modułowe.

### Cabin: Strukturalne logowanie dla nowoczesnych aplikacji {#cabin-structured-logging-for-modern-applications}

[Organizacja Cabin](https://github.com/cabinjs) to nasze podejście do prostego, potężnego logowania aplikacji. Główny pakiet [`cabin`](https://github.com/cabinjs/cabin) ma prawie 900 gwiazdek na GitHub i ponad 100 000 pobrań tygodniowo\[^1]. Cabin zapewnia strukturalne logowanie, które współpracuje z popularnymi usługami takimi jak Sentry, LogDNA i Papertrail.

Co wyróżnia Cabin, to przemyślane API i system wtyczek. Wspierające pakiety, takie jak [`axe`](https://github.com/cabinjs/axe) dla middleware Express oraz [`parse-request`](https://github.com/cabinjs/parse-request) do parsowania żądań HTTP, pokazują nasze zaangażowanie w kompletne rozwiązania, a nie izolowane narzędzia.

Pakiet [`bson-objectid`](https://github.com/cabinjs/bson-objectid) zasługuje na szczególne wyróżnienie, z ponad 1,7 miliona pobrań w zaledwie dwa miesiące\[^2]. Ta lekka implementacja MongoDB ObjectID stała się wyborem dla deweloperów potrzebujących identyfikatorów bez pełnych zależności MongoDB.

### Spam Scanner: Walka z nadużyciami e-mailowymi {#spam-scanner-fighting-email-abuse}

[Organizacja Spam Scanner](https://github.com/spamscanner) pokazuje nasze zaangażowanie w rozwiązywanie realnych problemów. Główny pakiet [`spamscanner`](https://github.com/spamscanner/spamscanner) zapewnia zaawansowane wykrywanie spamu w e-mailach, ale to pakiet [`url-regex-safe`](https://github.com/spamscanner/url-regex-safe) zyskał niesamowitą popularność.

Z ponad 1,2 miliona pobrań w dwa miesiące\[^3], `url-regex-safe` naprawia krytyczne problemy bezpieczeństwa w innych wyrażeniach regularnych do wykrywania URL. Ten pakiet pokazuje nasze podejście do open source: znalezienie powszechnego problemu (w tym przypadku luk [ReDoS](https://en.wikipedia.org/wiki/ReDoS) w walidacji URL), stworzenie solidnego rozwiązania i jego staranna konserwacja.
### Bree: Nowoczesne planowanie zadań z użyciem wątków roboczych {#bree-modern-job-scheduling-with-worker-threads}

Organizacja [Bree](https://github.com/breejs) to nasza odpowiedź na powszechny problem w Node.js: niezawodne planowanie zadań. Główne pakiet [`bree`](https://github.com/breejs/bree), z ponad 3 100 gwiazdkami na GitHub, oferuje nowoczesny harmonogram zadań wykorzystujący wątki robocze Node.js dla lepszej wydajności i niezawodności.

> \[!NOTE]
> Bree powstało po tym, jak pomagaliśmy w utrzymaniu [Agenda](https://github.com/agenda/agenda), wykorzystując zdobyte doświadczenia do stworzenia lepszego harmonogramu zadań. Nasze wkłady w Agenda pomogły nam znaleźć sposoby na ulepszenie planowania zadań.

Co wyróżnia Bree na tle innych harmonogramów, takich jak Agenda:

* **Brak zewnętrznych zależności**: W przeciwieństwie do Agendy, która wymaga MongoDB, Bree nie potrzebuje Redis ani MongoDB do zarządzania stanem zadań.
* **Wątki robocze**: Bree wykorzystuje wątki robocze Node.js do uruchamiania procesów w piaskownicy, zapewniając lepszą izolację i wydajność.
* **Proste API**: Bree oferuje szczegółową kontrolę przy zachowaniu prostoty, co ułatwia implementację złożonych potrzeb planowania.
* **Wbudowane wsparcie**: Takie funkcje jak łagodne przeładowanie, zadania cron, daty i przyjazne dla człowieka czasy są domyślnie dostępne.

Bree jest kluczowym elementem [forwardemail.net](https://github.com/forwardemail/forwardemail.net), obsługując krytyczne zadania w tle, takie jak przetwarzanie e-maili, sprzątanie i zaplanowana konserwacja. Wykorzystanie Bree w Forward Email pokazuje nasze zaangażowanie w używanie własnych narzędzi w produkcji, zapewniając im wysokie standardy niezawodności.

Korzystamy również i doceniamy inne świetne pakiety wątków roboczych, takie jak [piscina](https://github.com/piscinajs/piscina) oraz klientów HTTP, jak [undici](https://github.com/nodejs/undici). Piscina, podobnie jak Bree, używa wątków roboczych Node.js do efektywnego przetwarzania zadań. Dziękujemy [Matteo Collina](https://github.com/mcollina), który utrzymuje zarówno undici, jak i piscina, za jego znaczący wkład w Node.js. Matteo zasiada w Komitecie Technicznym Node.js i znacznie poprawił możliwości klientów HTTP w Node.js.

### Forward Email: Open Source'owa infrastruktura e-mailowa {#forward-email-open-source-email-infrastructure}

Nasz najbardziej ambitny projekt to [Forward Email](https://github.com/forwardemail), open source'owa usługa e-mailowa oferująca przekazywanie, przechowywanie i usługi API dla e-maili. Główne repozytorium ma ponad 1 100 gwiazdek na GitHub\[^4], co świadczy o uznaniu społeczności dla tej alternatywy wobec zamkniętych usług e-mailowych.

Pakiet [`preview-email`](https://github.com/forwardemail/preview-email) z tej organizacji, z ponad 2,5 miliona pobrań w ciągu dwóch miesięcy\[^5], stał się niezbędnym narzędziem dla deweloperów pracujących z szablonami e-maili. Zapewniając prosty sposób podglądu e-maili podczas tworzenia, rozwiązuje powszechny problem w budowaniu aplikacji obsługujących e-maile.

### Lad: Niezbędne narzędzia i pomocniki dla Koa {#lad-essential-koa-utilities-and-tools}

Organizacja [Lad](https://github.com/ladjs) dostarcza zbiór niezbędnych narzędzi i pomocników, skupionych głównie na rozszerzaniu ekosystemu frameworka Koa. Te pakiety rozwiązują typowe wyzwania w tworzeniu aplikacji webowych i zostały zaprojektowane tak, aby działać bezproblemowo razem, pozostając jednocześnie użytecznymi niezależnie.

#### koa-better-error-handler: Ulepszone obsługiwanie błędów dla Koa {#koa-better-error-handler-improved-error-handling-for-koa}

[`koa-better-error-handler`](https://github.com/ladjs/koa-better-error-handler) oferuje lepsze rozwiązanie do obsługi błędów w aplikacjach Koa. Z ponad 50 gwiazdkami na GitHub, ten pakiet sprawia, że `ctx.throw` generuje przyjazne dla użytkownika komunikaty o błędach, jednocześnie rozwiązując kilka ograniczeń wbudowanego obsługiwacza błędów Koa:

* Wykrywa i poprawnie obsługuje błędy DNS Node.js, błędy Mongoose i błędy Redis
* Używa [Boom](https://github.com/hapijs/boom) do tworzenia spójnych, dobrze sformatowanych odpowiedzi błędów
* Zachowuje nagłówki (w przeciwieństwie do wbudowanego obsługiwacza Koa)
* Utrzymuje odpowiednie kody statusu zamiast domyślnego 500
* Wspiera wiadomości flash i zachowanie sesji
* Dostarcza listy błędów HTML dla błędów walidacji
* Obsługuje wiele typów odpowiedzi (HTML, JSON i zwykły tekst)
Ten pakiet jest szczególnie cenny w połączeniu z [`koa-404-handler`](https://github.com/ladjs/koa-404-handler) dla kompleksowego zarządzania błędami w aplikacjach Koa.

#### passport: Uwierzytelnianie dla Lad {#passport-authentication-for-lad}

[`@ladjs/passport`](https://github.com/ladjs/passport) rozszerza popularne middleware uwierzytelniające Passport.js o specyficzne ulepszenia dla nowoczesnych aplikacji internetowych. Ten pakiet obsługuje wiele strategii uwierzytelniania od razu po wyjęciu z pudełka:

* Uwierzytelnianie lokalne za pomocą e-maila
* Logowanie przez Apple
* Uwierzytelnianie GitHub
* Uwierzytelnianie Google
* Uwierzytelnianie za pomocą jednorazowego hasła (OTP)

Pakiet jest wysoce konfigurowalny, pozwalając programistom dostosować nazwy pól i frazy do wymagań ich aplikacji. Został zaprojektowany tak, aby integrować się bezproblemowo z Mongoose do zarządzania użytkownikami, co czyni go idealnym rozwiązaniem dla aplikacji opartych na Koa, które potrzebują solidnego uwierzytelniania.

#### graceful: Eleganckie zamykanie aplikacji {#graceful-elegant-application-shutdown}

[`@ladjs/graceful`](https://github.com/ladjs/graceful) rozwiązuje krytyczny problem eleganckiego zamykania aplikacji Node.js. Z ponad 70 gwiazdkami na GitHub, ten pakiet zapewnia, że Twoja aplikacja może zakończyć działanie czysto, bez utraty danych lub pozostawiania otwartych połączeń. Kluczowe cechy to:

* Wsparcie dla eleganckiego zamykania serwerów HTTP (Express/Koa/Fastify)
* Czyste zamknięcie połączeń z bazą danych (MongoDB/Mongoose)
* Poprawne zamknięcie klientów Redis
* Obsługa harmonogramów zadań Bree
* Wsparcie dla niestandardowych handlerów zamykania
* Konfigurowalne ustawienia timeoutu
* Integracja z systemami logowania

Ten pakiet jest niezbędny dla aplikacji produkcyjnych, gdzie nieoczekiwane zamknięcia mogą prowadzić do utraty lub uszkodzenia danych. Implementując właściwe procedury zamykania, `@ladjs/graceful` pomaga zapewnić niezawodność i stabilność Twojej aplikacji.

### Upptime: Otwarte monitorowanie dostępności {#upptime-open-source-uptime-monitoring}

Organizacja [Upptime](https://github.com/upptime) reprezentuje nasze zaangażowanie w transparentne, otwarte monitorowanie. Główne repozytorium [`upptime`](https://github.com/upptime/upptime) ma ponad 13 000 gwiazdek na GitHub, co czyni je jednym z najpopularniejszych projektów, do których się przyczyniamy. Upptime dostarcza monitor dostępności i stronę statusu opartą na GitHub, działającą całkowicie bez serwera.

Używamy Upptime dla naszej własnej strony statusu pod adresem <https://status.forwardemail.net> z kodem źródłowym dostępnym pod <https://github.com/forwardemail/status.forwardemail.net>.

Co wyróżnia Upptime, to jego architektura:

* **100% Open Source**: Każdy komponent jest w pełni otwarty i konfigurowalny.
* **Zasilany przez GitHub**: Wykorzystuje GitHub Actions, Issues i Pages do bezserwerowego rozwiązania monitorującego.
* **Bez potrzeby serwera**: W przeciwieństwie do tradycyjnych narzędzi monitorujących, Upptime nie wymaga uruchamiania ani utrzymywania serwera.
* **Automatyczna strona statusu**: Generuje piękną stronę statusu, którą można hostować na GitHub Pages.
* **Potężne powiadomienia**: Integruje się z różnymi kanałami powiadomień, w tym e-mail, SMS i Slack.

Aby poprawić doświadczenia naszych użytkowników, zintegrowaliśmy [@octokit/core](https://github.com/octokit/core.js/) z kodem forwardemail.net, aby wyświetlać aktualizacje statusu i incydenty w czasie rzeczywistym bezpośrednio na naszej stronie. Ta integracja zapewnia jasną przejrzystość dla naszych użytkowników w przypadku jakichkolwiek problemów w całym naszym stosie (Strona internetowa, API, MongoDB, Redis, SQLite, SMTP, POP3, IMAP, Bree itd.) z natychmiastowymi powiadomieniami toast, zmianami ikon odznak, kolorami ostrzegawczymi i innymi.

Biblioteka @octokit/core pozwala nam pobierać dane w czasie rzeczywistym z naszego repozytorium Upptime na GitHub, przetwarzać je i wyświetlać w przyjazny dla użytkownika sposób. Gdy jakakolwiek usługa ma awarię lub pogorszoną wydajność, użytkownicy są natychmiast powiadamiani za pomocą wskaźników wizualnych bez konieczności opuszczania głównej aplikacji. Ta bezproblemowa integracja zapewnia, że nasi użytkownicy zawsze mają aktualne informacje o stanie naszego systemu, zwiększając przejrzystość i zaufanie.

Upptime zostało przyjęte przez setki organizacji poszukujących przejrzystego, niezawodnego sposobu monitorowania swoich usług i komunikowania statusu użytkownikom. Sukces projektu pokazuje siłę budowania narzędzi wykorzystujących istniejącą infrastrukturę (w tym przypadku GitHub) do rozwiązywania powszechnych problemów w nowy sposób.
## Nasze wkłady w ekosystem Forward Email {#our-contributions-to-the-forward-email-ecosystem}

Chociaż nasze pakiety open source są używane przez programistów na całym świecie, stanowią one również podstawę naszej własnej usługi Forward Email. Ta podwójna rola — jako twórców i użytkowników tych narzędzi — daje nam unikalną perspektywę ich zastosowania w rzeczywistych warunkach i napędza ciągłe ulepszanie.

### Od pakietów do produkcji {#from-packages-to-production}

Droga od pojedynczych pakietów do spójnego systemu produkcyjnego wymaga starannej integracji i rozszerzeń. W przypadku Forward Email proces ten obejmuje:

* **Własne rozszerzenia**: Tworzenie rozszerzeń specyficznych dla Forward Email do naszych pakietów open source, które odpowiadają naszym unikalnym wymaganiom.
* **Wzorce integracji**: Opracowywanie wzorców interakcji tych pakietów w środowisku produkcyjnym.
* **Optymalizacje wydajności**: Identyfikowanie i eliminowanie wąskich gardeł wydajności, które pojawiają się dopiero na dużą skalę.
* **Wzmacnianie bezpieczeństwa**: Dodawanie dodatkowych warstw bezpieczeństwa specyficznych dla obsługi poczty i ochrony danych użytkowników.

Ta praca to tysiące godzin rozwoju wykraczającego poza same pakiety bazowe, co skutkuje solidną, bezpieczną usługą e-mail, która wykorzystuje najlepsze elementy naszych wkładów open source.

### Pętla informacji zwrotnej {#the-feedback-loop}

Być może najcenniejszym aspektem korzystania z naszych własnych pakietów w produkcji jest pętla informacji zwrotnej, którą tworzy. Gdy napotykamy ograniczenia lub przypadki brzegowe w Forward Email, nie tylko je lokalnie poprawiamy — ulepszamy podstawowe pakiety, przynosząc korzyści zarówno naszej usłudze, jak i szerszej społeczności.

To podejście doprowadziło do licznych ulepszeń:

* **Graceful Shutdown w Bree**: Potrzeba wdrożeń bez przestojów w Forward Email doprowadziła do ulepszenia możliwości łagodnego zamykania w Bree.
* **Rozpoznawanie wzorców w Spam Scanner**: Rzeczywiste wzorce spamu napotkane w Forward Email wpłynęły na algorytmy wykrywania w Spam Scanner.
* **Optymalizacje wydajności w Cabin**: Logowanie o dużej objętości w produkcji ujawniło możliwości optymalizacji w Cabin, które przynoszą korzyści wszystkim użytkownikom.

Utrzymując ten cnotliwy cykl między naszą pracą open source a usługą produkcyjną, zapewniamy, że nasze pakiety pozostają praktycznymi, sprawdzonymi rozwiązaniami, a nie teoretycznymi implementacjami.


## Podstawowe zasady Forward Email: fundament doskonałości {#forward-emails-core-principles-a-foundation-for-excellence}

Forward Email jest zaprojektowany zgodnie z zestawem podstawowych zasad, które kierują wszystkimi naszymi decyzjami rozwojowymi. Zasady te, szczegółowo opisane na naszej [stronie internetowej](/blog/docs/best-quantum-safe-encrypted-email-service#principles), zapewniają, że nasza usługa pozostaje przyjazna dla programistów, bezpieczna i skoncentrowana na prywatności użytkowników.

### Zawsze przyjazny dla programistów, skoncentrowany na bezpieczeństwie i transparentny {#always-developer-friendly-security-focused-and-transparent}

Naszą pierwszą i najważniejszą zasadą jest tworzenie oprogramowania przyjaznego dla programistów, przy jednoczesnym utrzymaniu najwyższych standardów bezpieczeństwa i prywatności. Wierzymy, że doskonałość techniczna nigdy nie powinna odbywać się kosztem użyteczności, a transparentność buduje zaufanie w naszej społeczności.

Ta zasada przejawia się w naszej szczegółowej dokumentacji, jasnych komunikatach o błędach oraz otwartej komunikacji zarówno o sukcesach, jak i wyzwaniach. Udostępniając cały nasz kod jako open source, zapraszamy do weryfikacji i współpracy, wzmacniając zarówno nasze oprogramowanie, jak i szerszy ekosystem.

### Przestrzeganie sprawdzonych zasad tworzenia oprogramowania {#adherence-to-time-tested-software-development-principles}

Stosujemy kilka ustalonych zasad tworzenia oprogramowania, które udowodniły swoją wartość przez dziesięciolecia:

* **[MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)**: Rozdzielanie odpowiedzialności za pomocą wzorca Model-Widok-Kontroler
* **[Filozofia Uniksa](https://en.wikipedia.org/wiki/Unix_philosophy)**: Tworzenie modułowych komponentów, które robią jedną rzecz dobrze
* **[KISS](https://en.wikipedia.org/wiki/KISS_principle)**: Zachowaj prostotę i przejrzystość
* **[DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)**: Nie powtarzaj się, promowanie ponownego użycia kodu
* **[YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it)**: Nie będziesz tego potrzebować, unikanie przedwczesnej optymalizacji
* **[Twelve Factor](https://12factor.net/)**: Stosowanie najlepszych praktyk budowania nowoczesnych, skalowalnych aplikacji
* **[Brzytwa Ockhama](https://en.wikipedia.org/wiki/Occam%27s_razor)**: Wybieranie najprostszych rozwiązań spełniających wymagania
* **[Dogfooding](https://en.wikipedia.org/wiki/Eating_your_own_dog_food)**: Intensywne korzystanie z własnych produktów
Te zasady to nie tylko teoretyczne koncepcje — są one wbudowane w nasze codzienne praktyki programistyczne. Na przykład, nasze przestrzeganie filozofii Unix jest widoczne w sposobie, w jaki zorganizowaliśmy nasze pakiety npm: małe, skoncentrowane moduły, które można łączyć, aby rozwiązywać złożone problemy.

### Skierowane do zdeterminowanego, samodzielnego programisty {#targeting-the-scrappy-bootstrapped-developer}

Specjalnie kierujemy się do zdeterminowanego, samodzielnego i [ramen-profitable](https://www.paulgraham.com/ramenprofitable.html) programisty. To skupienie kształtuje wszystko, od naszego modelu cenowego po decyzje techniczne. Rozumiemy wyzwania związane z budowaniem produktów przy ograniczonych zasobach, ponieważ sami przez to przeszliśmy.

Ta zasada jest szczególnie ważna w naszym podejściu do open source. Tworzymy i utrzymujemy pakiety, które rozwiązują rzeczywiste problemy programistów bez budżetów korporacyjnych, czyniąc potężne narzędzia dostępnymi dla wszystkich, niezależnie od ich zasobów.

### Zasady w praktyce: kod źródłowy Forward Email {#principles-in-practice-the-forward-email-codebase}

Te zasady są wyraźnie widoczne w kodzie źródłowym Forward Email. Nasz plik package.json ujawnia przemyślany dobór zależności, z których każda została wybrana tak, aby odpowiadać naszym podstawowym wartościom:

* Pakiety skoncentrowane na bezpieczeństwie, takie jak `mailauth` do uwierzytelniania e-maili
* Narzędzia przyjazne programistom, takie jak `preview-email` ułatwiające debugowanie
* Modularne komponenty, takie jak różne narzędzia `p-*` autorstwa Sindre Sorhusa

Dzięki konsekwentnemu przestrzeganiu tych zasad przez dłuższy czas zbudowaliśmy usługę, której programiści mogą zaufać w kwestii swojej infrastruktury e-mail — bezpieczną, niezawodną i zgodną z wartościami społeczności open source.

### Prywatność przez projektowanie {#privacy-by-design}

Prywatność nie jest dla Forward Email dodatkiem ani funkcją marketingową — to fundamentalna zasada projektowa, która wpływa na każdy aspekt naszej usługi i kodu:

* **Szyfrowanie zero-dostępu**: Wdrożyliśmy systemy, które technicznie uniemożliwiają nam czytanie e-maili użytkowników.
* **Minimalne zbieranie danych**: Zbieramy tylko dane niezbędne do świadczenia naszej usługi, nic więcej.
* **Przejrzyste polityki**: Nasza polityka prywatności jest napisana jasnym, zrozumiałym językiem, bez prawniczego żargonu.
* **Weryfikacja open source**: Nasz otwarty kod źródłowy pozwala badaczom bezpieczeństwa na weryfikację naszych deklaracji dotyczących prywatności.

To zobowiązanie rozciąga się na nasze pakiety open source, które są projektowane z najlepszymi praktykami bezpieczeństwa i prywatności od podstaw.

### Zrównoważony open source {#sustainable-open-source}

Wierzymy, że oprogramowanie open source potrzebuje zrównoważonych modeli, aby rozwijać się długoterminowo. Nasze podejście obejmuje:

* **Wsparcie komercyjne**: Oferowanie wsparcia premium i usług wokół naszych narzędzi open source.
* **Zrównoważone licencjonowanie**: Używanie licencji, które chronią zarówno wolności użytkowników, jak i trwałość projektu.
* **Zaangażowanie społeczności**: Aktywne angażowanie się w relacje z kontrybutorami, aby budować wspierającą społeczność.
* **Przejrzyste plany rozwoju**: Dzielenie się naszymi planami rozwojowymi, aby użytkownicy mogli odpowiednio planować.

Skupiając się na zrównoważonym rozwoju, zapewniamy, że nasze wkłady open source mogą nadal rosnąć i się rozwijać, zamiast popadać w zaniedbanie.


## Liczby nie kłamią: nasze oszałamiające statystyki pobrań npm {#the-numbers-dont-lie-our-staggering-npm-download-statistics}

Kiedy mówimy o wpływie oprogramowania open source, statystyki pobrań dostarczają namacalnego miernika adopcji i zaufania. Wiele pakietów, które pomagamy utrzymywać, osiągnęło skalę, której niewiele projektów open source kiedykolwiek się dorobiło, z łączną liczbą pobrań sięgającą miliardów.

![Top npm Packages by Downloads](/img/art/top_packages_bar_chart.svg)

> \[!IMPORTANT]
> Chociaż jesteśmy dumni z pomocy w utrzymaniu kilku wysoko pobieranych pakietów w ekosystemie JavaScript, chcemy podkreślić, że wiele z tych pakietów zostało pierwotnie stworzonych przez innych utalentowanych programistów. Pakiety takie jak superagent i supertest zostały pierwotnie stworzone przez TJ Holowaychuka, którego płodne wkłady w open source miały kluczowe znaczenie dla kształtowania ekosystemu Node.js.
### Ogólny obraz naszego wpływu {#a-birds-eye-view-of-our-impact}

W zaledwie dwumiesięcznym okresie od lutego do marca 2025 roku, najważniejsze pakiety, do których się przyczyniamy i które pomagamy utrzymywać, odnotowały oszałamiające liczby pobrań:

* **[superagent](https://www.npmjs.com/package/superagent)**: 84 575 829 pobrań\[^7] (pierwotnie stworzony przez TJ Holowaychuka)
* **[supertest](https://www.npmjs.com/package/supertest)**: 76 432 591 pobrań\[^8] (pierwotnie stworzony przez TJ Holowaychuka)
* **[koa](https://www.npmjs.com/package/koa)**: 28 539 295 pobrań\[^34] (pierwotnie stworzony przez TJ Holowaychuka)
* **[@koa/router](https://www.npmjs.com/package/@koa/router)**: 11 007 327 pobrań\[^35]
* **[koa-router](https://www.npmjs.com/package/koa-router)**: 3 498 918 pobrań\[^36]
* **[url-regex](https://www.npmjs.com/package/url-regex)**: 2 819 520 pobrań\[^37]
* **[preview-email](https://www.npmjs.com/package/preview-email)**: 2 500 000 pobrań\[^9]
* **[cabin](https://www.npmjs.com/package/cabin)**: 1 800 000 pobrań\[^10]
* **[@breejs/later](https://www.npmjs.com/package/@breejs/later)**: 1 709 938 pobrań\[^38]
* **[email-templates](https://www.npmjs.com/package/email-templates)**: 1 128 139 pobrań\[^39]
* **[get-paths](https://www.npmjs.com/package/get-paths)**: 1 124 686 pobrań\[^40]
* **[url-regex-safe](https://www.npmjs.com/package/url-regex-safe)**: 1 200 000 pobrań\[^11]
* **[dotenv-parse-variables](https://www.npmjs.com/package/dotenv-parse-variables)**: 894 666 pobrań\[^41]
* **[@koa/multer](https://www.npmjs.com/package/@koa/multer)**: 839 585 pobrań\[^42]
* **[spamscanner](https://www.npmjs.com/package/spamscanner)**: 145 000 pobrań\[^12]
* **[bree](https://www.npmjs.com/package/bree)**: 24 270 pobrań\[^30]

> \[!NOTE]
> Kilka innych pakietów, które pomagamy utrzymywać, ale których nie stworzyliśmy, ma jeszcze wyższe liczby pobrań, w tym `form-data` (ponad 738 mln pobrań), `toidentifier` (ponad 309 mln pobrań), `stackframe` (ponad 116 mln pobrań) oraz `error-stack-parser` (ponad 113 mln pobrań). Jesteśmy zaszczyceni, że możemy przyczyniać się do tych pakietów, szanując pracę ich oryginalnych autorów.

To nie tylko imponujące liczby — to prawdziwi programiści rozwiązujący realne problemy za pomocą kodu, który pomagamy utrzymywać. Każde pobranie to sytuacja, w której te pakiety pomogły komuś stworzyć coś znaczącego, od projektów hobbystycznych po aplikacje korporacyjne używane przez miliony.

![Package Categories Distribution](/img/art/category_pie_chart.svg)

### Codzienny wpływ na dużą skalę {#daily-impact-at-scale}

Codzienne wzorce pobrań pokazują stałe, wysokie użycie, z szczytami sięgającymi milionów pobrań dziennie\[^13]. Ta konsekwencja świadczy o stabilności i niezawodności tych pakietów — programiści nie tylko je wypróbowują; integrują je w swoich podstawowych procesach pracy i polegają na nich dzień po dniu.

Tygodniowe wzorce pobrań pokazują jeszcze bardziej imponujące liczby, utrzymujące się konsekwentnie na poziomie dziesiątek milionów pobrań tygodniowo\[^14]. To ogromny ślad w ekosystemie JavaScript, z tymi pakietami działającymi w środowiskach produkcyjnych na całym świecie.

### Poza samymi liczbami {#beyond-the-raw-numbers}

Choć statystyki pobrań są same w sobie imponujące, opowiadają głębszą historię o zaufaniu, jakim społeczność darzy te pakiety. Utrzymywanie pakietów na taką skalę wymaga niezachwianego zaangażowania w:

* **Zachowanie kompatybilności wstecznej**: Zmiany muszą być starannie rozważane, aby nie łamać istniejących implementacji.
* **Bezpieczeństwo**: Przy milionach aplikacji zależnych od tych pakietów, luki bezpieczeństwa mogą mieć dalekosiężne konsekwencje.
* **Wydajność**: Na taką skalę nawet drobne poprawki wydajności mogą przynieść znaczące korzyści łączne.
* **Dokumentację**: Jasna, kompleksowa dokumentacja jest niezbędna dla pakietów używanych przez programistów o różnym poziomie doświadczenia.

Stały wzrost liczby pobrań w czasie odzwierciedla sukces w realizacji tych zobowiązań, budując zaufanie społeczności programistów poprzez niezawodne, dobrze utrzymywane pakiety.
## Wspieranie ekosystemu: nasze sponsorstwa open source {#supporting-the-ecosystem-our-open-source-sponsorships}

> \[!TIP]
> Zrównoważony rozwój open source to nie tylko wkładanie kodu — to także wspieranie deweloperów, którzy utrzymują kluczową infrastrukturę.

Poza naszymi bezpośrednimi wkładami w ekosystem JavaScript, jesteśmy dumni ze sponsorowania wybitnych współtwórców Node.js, których praca stanowi fundament wielu nowoczesnych aplikacji. Nasze sponsorstwa obejmują:

### Andris Reinman: pionier infrastruktury e-mailowej {#andris-reinman-email-infrastructure-pioneer}

[Andris Reinman](https://github.com/andris9) jest twórcą [Nodemailer](https://github.com/nodemailer/nodemailer), najpopularniejszej biblioteki do wysyłania e-maili dla Node.js z ponad 14 milionami pobrań tygodniowo\[^15]. Jego praca obejmuje także inne kluczowe komponenty infrastruktury e-mailowej, takie jak [SMTP Server](https://github.com/nodemailer/smtp-server), [Mailparser](https://github.com/nodemailer/mailparser) oraz [WildDuck](https://github.com/nodemailer/wildduck).

Nasze sponsorstwo pomaga zapewnić dalsze utrzymanie i rozwój tych niezbędnych narzędzi, które napędzają komunikację e-mailową dla niezliczonych aplikacji Node.js, w tym naszej własnej usługi Forward Email.

### Sindre Sorhus: mistrz pakietów narzędziowych {#sindre-sorhus-utility-package-mastermind}

[Sindre Sorhus](https://github.com/sindresorhus) jest jednym z najbardziej płodnych współtwórców open source w ekosystemie JavaScript, z ponad 1000 pakietów npm na swoim koncie. Jego narzędzia, takie jak [p-map](https://github.com/sindresorhus/p-map), [p-retry](https://github.com/sindresorhus/p-retry) oraz [is-stream](https://github.com/sindresorhus/is-stream), są fundamentalnymi elementami wykorzystywanymi w całym ekosystemie Node.js.

Sponsorując pracę Sindre, pomagamy utrzymać rozwój tych kluczowych narzędzi, które czynią rozwój w JavaScript bardziej efektywnym i niezawodnym.

Te sponsorstwa odzwierciedlają nasze zaangażowanie w szerszy ekosystem open source. Uznajemy, że nasz własny sukces opiera się na fundamentach położonych przez tych i innych współtwórców, i jesteśmy oddani zapewnieniu zrównoważonego rozwoju całego ekosystemu.


## Odkrywanie luk bezpieczeństwa w ekosystemie JavaScript {#uncovering-security-vulnerabilities-in-the-javascript-ecosystem}

Nasze zaangażowanie w open source wykracza poza rozwój funkcji i obejmuje identyfikowanie oraz rozwiązywanie luk bezpieczeństwa, które mogą dotknąć miliony deweloperów. Kilka z naszych najważniejszych wkładów w ekosystem JavaScript dotyczyło właśnie bezpieczeństwa.

### Ratunek dla Koa-Router {#the-koa-router-rescue}

W lutym 2019 roku Nick zidentyfikował krytyczny problem z utrzymaniem popularnego pakietu koa-router. Jak [zgłosił na Hacker News](https://news.ycombinator.com/item?id=19156707), pakiet został porzucony przez pierwotnego opiekuna, pozostawiając luki bezpieczeństwa bez naprawy i społeczność bez aktualizacji.

> \[!WARNING]
> Porzucone pakiety z lukami bezpieczeństwa stanowią poważne zagrożenie dla całego ekosystemu, zwłaszcza gdy są pobierane miliony razy tygodniowo.

W odpowiedzi Nick stworzył [@koa/router](https://github.com/koajs/router) i pomógł ostrzec społeczność o sytuacji. Od tamtej pory utrzymuje ten kluczowy pakiet, zapewniając użytkownikom Koa bezpieczne i dobrze utrzymane rozwiązanie do routingu.

### Rozwiązywanie luk ReDoS {#addressing-redos-vulnerabilities}

W 2020 roku Nick zidentyfikował i załatał krytyczną lukę [Regular Expression Denial of Service (ReDoS)](https://en.wikipedia.org/wiki/ReDoS) w szeroko używanym pakiecie `url-regex`. Ta luka ([SNYK-JS-URLREGEX-569472](https://security.snyk.io/vuln/SNYK-JS-URLREGEX-569472)) mogła pozwolić atakującym na wywołanie odmowy usługi poprzez dostarczenie specjalnie spreparowanego wejścia, które powodowało katastrofalne cofanie się w wyrażeniu regularnym.

Zamiast po prostu załatać istniejący pakiet, Nick stworzył [`url-regex-safe`](https://github.com/spamscanner/url-regex-safe), całkowicie przepisane rozwiązanie, które usuwa lukę, zachowując kompatybilność z oryginalnym API. Opublikował także [obszerny wpis na blogu](/blog/docs/url-regex-javascript-node-js) wyjaśniający lukę i sposoby jej łagodzenia.
Ta praca pokazuje nasze podejście do bezpieczeństwa: nie tylko naprawianie problemów, ale także edukowanie społeczności oraz dostarczanie solidnych alternatyw, które zapobiegają podobnym problemom w przyszłości.

### Propagowanie bezpieczeństwa Node.js i Chromium {#advocating-for-nodejs-and-chromium-security}

Nick był również aktywny w propagowaniu ulepszeń bezpieczeństwa w szerszym ekosystemie. W sierpniu 2020 roku zidentyfikował poważny problem bezpieczeństwa w Node.js związany z obsługą nagłówków HTTP, o czym doniesiono w [The Register](https://www.theregister.com/2020/08/18/nodejs_chromium_patch/).

Problem ten, wynikający z poprawki w Chromium, mógł potencjalnie pozwolić atakującym na obejście środków bezpieczeństwa. Działania Nicka pomogły zapewnić szybkie rozwiązanie problemu, chroniąc miliony aplikacji Node.js przed potencjalnym wykorzystaniem.

### Zabezpieczanie infrastruktury npm {#securing-npm-infrastructure}

W tym samym miesiącu Nick zidentyfikował kolejny krytyczny problem bezpieczeństwa, tym razem w infrastrukturze e-mailowej npm. Jak podano w [The Register](https://www.theregister.com/2020/08/25/nodejs_dmarc_phishing/), npm nie wdrażał prawidłowo protokołów uwierzytelniania e-mail DMARC, SPF i DKIM, co mogło pozwolić atakującym na wysyłanie phishingowych wiadomości e-mail podszywających się pod npm.

Raport Nicka doprowadził do poprawy bezpieczeństwa e-mailowego npm, chroniąc miliony deweloperów korzystających z npm do zarządzania pakietami przed potencjalnymi atakami phishingowymi.


## Nasze wkłady w ekosystem Forward Email {#our-contributions-to-the-forward-email-ecosystem-1}

Forward Email jest zbudowany na bazie kilku kluczowych projektów open source, w tym Nodemailer, WildDuck i mailauth. Nasz zespół wniósł znaczący wkład w te projekty, pomagając identyfikować i naprawiać głębokie problemy wpływające na dostarczanie i bezpieczeństwo e-maili.

### Ulepszanie podstawowej funkcjonalności Nodemailer {#enhancing-nodemailers-core-functionality}

[Nodemailer](https://github.com/nodemailer/nodemailer) jest fundamentem wysyłania e-maili w Node.js, a nasze wkłady pomogły uczynić go bardziej niezawodnym:

* **Ulepszenia serwera SMTP**: Naprawiliśmy błędy parsowania, problemy z obsługą strumieni oraz konfiguracją TLS w komponencie serwera SMTP\[^16]\[^17].
* **Ulepszenia parsera wiadomości**: Rozwiązaliśmy błędy dekodowania sekwencji znaków oraz problemy z parserem adresów, które mogły powodować awarie przetwarzania e-maili\[^18]\[^19].

Te wkłady zapewniają, że Nodemailer pozostaje solidną podstawą do przetwarzania e-maili w aplikacjach Node.js, w tym Forward Email.

### Rozwój uwierzytelniania e-mail z Mailauth {#advancing-email-authentication-with-mailauth}

[Mailauth](https://github.com/postalsys/mailauth) dostarcza kluczową funkcjonalność uwierzytelniania e-mail, a nasze wkłady znacznie poprawiły jego możliwości:

* **Ulepszenia weryfikacji DKIM**: Odkryliśmy i zgłosiliśmy, że X/Twitter miał problemy z pamięcią podręczną DNS powodujące niepowodzenie DKIM dla ich wiadomości wychodzących, zgłaszając to na Hacker One\[^20].
* **Ulepszenia DMARC i ARC**: Naprawiliśmy problemy z weryfikacją DMARC i ARC, które mogły prowadzić do błędnych wyników uwierzytelniania\[^21]\[^22].
* **Optymalizacje wydajności**: Wnieśliśmy optymalizacje poprawiające wydajność procesów uwierzytelniania e-mail\[^23]\[^24]\[^25]\[^26].

Te ulepszenia pomagają zapewnić, że uwierzytelnianie e-mail jest dokładne i niezawodne, chroniąc użytkowników przed atakami phishingowymi i podszywaniem się.

### Kluczowe ulepszenia Upptime {#key-upptime-enhancements}

Nasze wkłady do Upptime obejmują:

* **Monitorowanie certyfikatów SSL**: Dodaliśmy funkcjonalność monitorowania wygaśnięcia certyfikatów SSL, zapobiegając nieoczekiwanym przestojom spowodowanym wygasłymi certyfikatami\[^27].
* **Wsparcie dla wielu numerów SMS**: Wdrożyliśmy wsparcie dla powiadamiania wielu członków zespołu przez SMS w przypadku incydentów, poprawiając czas reakcji\[^28].
* **Poprawki weryfikacji IPv6**: Naprawiliśmy problemy z kontrolą łączności IPv6, zapewniając dokładniejsze monitorowanie w nowoczesnych środowiskach sieciowych\[^29].
* **Wsparcie trybu ciemnego/jasnego**: Dodaliśmy wsparcie motywów, aby poprawić doświadczenie użytkownika na stronach statusu\[^31].
* **Lepsze wsparcie TCP-Ping**: Ulepszyliśmy funkcjonalność pingowania TCP, aby zapewnić bardziej niezawodne testowanie połączeń\[^32].
Te ulepszenia nie tylko korzystnie wpływają na monitorowanie statusu Forward Email, ale są dostępne dla całej społeczności użytkowników Upptime, co pokazuje nasze zaangażowanie w ulepszanie narzędzi, na których polegamy.


## Klej, który wszystko spaja: niestandardowy kod na dużą skalę {#the-glue-that-holds-it-all-together-custom-code-at-scale}

Chociaż nasze pakiety npm i wkład w istniejące projekty są znaczące, to niestandardowy kod integrujący te komponenty naprawdę pokazuje nasze umiejętności techniczne. Kod źródłowy Forward Email reprezentuje dekadę pracy rozwojowej, sięgającą 2017 roku, kiedy projekt rozpoczął się jako [free-email-forwarding](https://github.com/forwardemail/free-email-forwarding), zanim został scalony w monorepo.

### Ogromny wysiłek rozwojowy {#a-massive-development-effort}

Skala tego niestandardowego kodu integracyjnego jest imponująca:

* **Łączne wkłady**: Ponad 3,217 commitów
* **Rozmiar kodu**: Ponad 421,545 linii kodu w plikach JavaScript, Pug, CSS i JSON\[^33]

To reprezentuje tysiące godzin pracy programistycznej, sesji debugowania i optymalizacji wydajności. To „sekretny składnik”, który przekształca pojedyncze pakiety w spójną, niezawodną usługę używaną codziennie przez tysiące klientów.

### Integracja kluczowych zależności {#core-dependencies-integration}

Kod źródłowy Forward Email integruje liczne zależności w spójną całość:

* **Przetwarzanie e-maili**: Integruje Nodemailer do wysyłania, SMTP Server do odbierania oraz Mailparser do parsowania
* **Uwierzytelnianie**: Używa Mailauth do weryfikacji DKIM, SPF, DMARC i ARC
* **Rozwiązywanie DNS**: Wykorzystuje Tangerine do DNS-over-HTTPS z globalnym cache’em
* **Połączenie MX**: Korzysta z mx-connect z integracją Tangerine dla niezawodnych połączeń z serwerami pocztowymi
* **Harmonogram zadań**: Stosuje Bree do niezawodnego przetwarzania zadań w tle z użyciem wątków roboczych
* **Szablony**: Używa email-templates do ponownego wykorzystania arkuszy stylów ze strony internetowej w komunikacji z klientami
* **Przechowywanie e-maili**: Implementuje indywidualnie szyfrowane skrzynki pocztowe SQLite z użyciem better-sqlite3-multiple-ciphers z szyfrowaniem ChaCha20-Poly1305 dla kwantowo bezpiecznej prywatności, zapewniając całkowitą izolację między użytkownikami i dostęp do skrzynki tylko dla jej właściciela

Każda z tych integracji wymaga starannego rozważenia przypadków brzegowych, wpływu na wydajność i kwestii bezpieczeństwa. Efektem jest solidny system, który niezawodnie obsługuje miliony transakcji e-mailowych. Nasza implementacja SQLite wykorzystuje również msgpackr do efektywnej serializacji binarnej oraz WebSockety (poprzez ws) do aktualizacji statusu w czasie rzeczywistym w całej naszej infrastrukturze.

### Infrastruktura DNS z Tangerine i mx-connect {#dns-infrastructure-with-tangerine-and-mx-connect}

Kluczowym elementem infrastruktury Forward Email jest nasz system rozwiązywania DNS, oparty na dwóch kluczowych pakietach:

* **[Tangerine](https://github.com/forwardemail/nodejs-dns-over-https-tangerine)**: Nasza implementacja DNS-over-HTTPS dla Node.js zapewnia zamiennik standardowego resolvera DNS, z wbudowanymi ponownymi próbami, timeoutami, inteligentną rotacją serwerów i wsparciem cache.

* **[mx-connect](https://github.com/zone-eu/mx-connect)**: Ten pakiet nawiązuje połączenia TCP z serwerami MX, przyjmując docelową domenę lub adres e-mail, rozwiązując odpowiednie serwery MX i łącząc się z nimi w kolejności priorytetowej.

Zintegrowaliśmy Tangerine z mx-connect poprzez [pull request #4](https://github.com/zone-eu/mx-connect/pull/4), zapewniając DNS na poziomie aplikacji przez HTTP w całym Forward Email. Zapewnia to globalne cache DNS na dużą skalę z 1:1 spójnością w dowolnym regionie, aplikacji lub procesie — co jest kluczowe dla niezawodnej dostawy e-maili w systemie rozproszonym.


## Wpływ na przedsiębiorstwa: od open source do rozwiązań krytycznych dla misji {#enterprise-impact-from-open-source-to-mission-critical-solutions}

Kulminacja naszej dziesięcioletniej podróży w rozwoju open source umożliwiła Forward Email obsługę nie tylko indywidualnych programistów, ale także dużych przedsiębiorstw i instytucji edukacyjnych, które stanowią trzon samego ruchu open source.
### Studium przypadków w infrastrukturze e-mail krytycznej dla misji {#case-studies-in-mission-critical-email-infrastructure}

Nasze zaangażowanie w niezawodność, prywatność i zasady open source uczyniło Forward Email zaufanym wyborem dla organizacji o wymagających potrzebach e-mailowych:

* **Instytucje edukacyjne**: Jak szczegółowo opisano w naszym [studium przypadku przekierowywania e-maili dla absolwentów](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study), duże uniwersytety polegają na naszej infrastrukturze, aby utrzymywać dożywotnie kontakty ze setkami tysięcy absolwentów dzięki niezawodnym usługom przekierowywania e-maili.

* **Rozwiązania Enterprise Linux**: [Studium przypadku e-mailowe Canonical Ubuntu dla przedsiębiorstw](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study) pokazuje, jak nasze podejście open source idealnie odpowiada potrzebom dostawców Linuxa dla przedsiębiorstw, oferując im przejrzystość i kontrolę, których potrzebują.

* **Fundacje Open Source**: Być może najbardziej potwierdzające jest nasze partnerstwo z Linux Foundation, udokumentowane w [studium przypadku e-mailowym Linux Foundation dla przedsiębiorstw](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study), gdzie nasza usługa wspiera komunikację dla samej organizacji, która nadzoruje rozwój Linuxa.

Istnieje piękna symetria w tym, jak nasze pakiety open source, pielęgnowane przez wiele lat, pozwoliły nam zbudować usługę e-mailową, która teraz wspiera społeczności i organizacje promujące oprogramowanie open source. Ta pełna podróż — od wkładu w pojedyncze pakiety po zasilanie infrastruktury e-mailowej klasy enterprise dla liderów open source — stanowi ostateczne potwierdzenie naszego podejścia do rozwoju oprogramowania.


## Dekada Open Source: Patrząc w przyszłość {#a-decade-of-open-source-looking-forward}

Patrząc wstecz na dekadę wkładu w open source i w przyszłość kolejnych dziesięciu lat, jesteśmy pełni wdzięczności dla społeczności, która wspierała naszą pracę, oraz podekscytowania tym, co nadejdzie.

Nasza droga od pojedynczych kontrybutorów pakietów do opiekunów kompleksowej infrastruktury e-mailowej używanej przez duże przedsiębiorstwa i fundacje open source była niezwykła. To świadectwo siły rozwoju open source i wpływu, jaki może mieć przemyślane, dobrze utrzymane oprogramowanie na szerszy ekosystem.

W nadchodzących latach zobowiązujemy się do:

* **Kontynuowania utrzymania i ulepszania naszych istniejących pakietów**, zapewniając, że pozostaną niezawodnymi narzędziami dla programistów na całym świecie.
* **Rozszerzania naszych wkładów w krytyczne projekty infrastrukturalne**, szczególnie w obszarach e-mail i bezpieczeństwa.
* **Rozwijania możliwości Forward Email**, przy jednoczesnym zachowaniu naszego zobowiązania do prywatności, bezpieczeństwa i przejrzystości.
* **Wspierania nowego pokolenia kontrybutorów open source** poprzez mentoring, sponsoring i zaangażowanie społeczności.

Wierzymy, że przyszłość rozwoju oprogramowania jest otwarta, oparta na współpracy i zbudowana na fundamencie zaufania. Kontynuując dostarczanie wysokiej jakości, skoncentrowanych na bezpieczeństwie pakietów do ekosystemu JavaScript, mamy nadzieję odegrać małą rolę w budowaniu tej przyszłości.

Dziękujemy wszystkim, którzy korzystali z naszych pakietów, przyczyniali się do naszych projektów, zgłaszali problemy lub po prostu rozpowszechniali informacje o naszej pracy. Wasze wsparcie uczyniło możliwym tę dekadę wpływu i z niecierpliwością czekamy na to, co możemy osiągnąć razem w kolejnych dziesięciu latach.

\[^1]: statystyki pobrań npm dla cabin, kwiecień 2025  
\[^2]: statystyki pobrań npm dla bson-objectid, luty-marzec 2025  
\[^3]: statystyki pobrań npm dla url-regex-safe, kwiecień 2025  
\[^4]: liczba gwiazdek na GitHub dla forwardemail/forwardemail.net na kwiecień 2025  
\[^5]: statystyki pobrań npm dla preview-email, kwiecień 2025  
\[^7]: statystyki pobrań npm dla superagent, luty-marzec 2025  
\[^8]: statystyki pobrań npm dla supertest, luty-marzec 2025  
\[^9]: statystyki pobrań npm dla preview-email, luty-marzec 2025  
\[^10]: statystyki pobrań npm dla cabin, luty-marzec 2025  
\[^11]: statystyki pobrań npm dla url-regex-safe, luty-marzec 2025  
\[^12]: statystyki pobrań npm dla spamscanner, luty-marzec 2025  
\[^13]: dzienne wzorce pobrań z statystyk npm, kwiecień 2025  
\[^14]: tygodniowe wzorce pobrań z statystyk npm, kwiecień 2025  
\[^15]: statystyki pobrań npm dla nodemailer, kwiecień 2025  
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
\[^27]: Na podstawie zgłoszeń GitHub w repozytorium Upptime  
\[^28]: Na podstawie zgłoszeń GitHub w repozytorium Upptime  
\[^29]: Na podstawie zgłoszeń GitHub w repozytorium Upptime  
\[^30]: statystyki pobrań npm dla bree, luty-marzec 2025  
\[^31]: Na podstawie pull requestów GitHub do Upptime  
\[^32]: Na podstawie pull requestów GitHub do Upptime  
\[^34]: statystyki pobrań npm dla koa, luty-marzec 2025  
\[^35]: statystyki pobrań npm dla @koa/router, luty-marzec 2025  
\[^36]: statystyki pobrań npm dla koa-router, luty-marzec 2025  
\[^37]: statystyki pobrań npm dla url-regex, luty-marzec 2025  
\[^38]: statystyki pobrań npm dla @breejs/later, luty-marzec 2025  
\[^39]: statystyki pobrań npm dla email-templates, luty-marzec 2025  
\[^40]: statystyki pobrań npm dla get-paths, luty-marzec 2025  
\[^41]: statystyki pobrań npm dla dotenv-parse-variables, luty-marzec 2025  
\[^42]: statystyki pobrań npm dla @koa/multer, luty-marzec 2025
