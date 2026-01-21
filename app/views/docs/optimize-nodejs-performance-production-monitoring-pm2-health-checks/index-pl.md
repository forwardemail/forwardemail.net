# Jak zoptymalizować infrastrukturę produkcyjną Node.js: najlepsze praktyki {#how-to-optimize-nodejs-production-infrastructure-best-practices}

<img loading="lazy" src="/img/articles/nodejs-performance.webp" alt="Node.js performance optimization guide" class="rounded-lg" />

## Spis treści {#table-of-contents}

* [Przedmowa](#foreword)
* [Nasza rewolucja w optymalizacji wydajności pojedynczego rdzenia o 573%](#our-573-single-core-performance-optimization-revolution)
  * [Dlaczego optymalizacja wydajności pojedynczego rdzenia ma znaczenie dla Node.js](#why-single-core-performance-optimization-matters-for-nodejs)
  * [Powiązane treści](#related-content)
* [Konfiguracja środowiska produkcyjnego Node.js: Nasz zestaw technologii](#nodejs-production-environment-setup-our-technology-stack)
  * [Menedżer pakietów: pnpm dla wydajności produkcji](#package-manager-pnpm-for-production-efficiency)
  * [Framework internetowy: Koa dla nowoczesnej produkcji Node.js](#web-framework-koa-for-modern-nodejs-production)
  * [Przetwarzanie zadań w tle: Bree dla niezawodności produkcji](#background-job-processing-bree-for-production-reliability)
  * [Obsługa błędów: @hapi/boom dla niezawodności produkcji](#error-handling-hapiboom-for-production-reliability)
* [Jak monitorować aplikacje Node.js w środowisku produkcyjnym](#how-to-monitor-nodejs-applications-in-production)
  * [Monitorowanie produkcji Node.js na poziomie systemu](#system-level-nodejs-production-monitoring)
  * [Monitorowanie na poziomie aplikacji dla środowiska produkcyjnego Node.js](#application-level-monitoring-for-nodejs-production)
  * [Monitorowanie specyficzne dla aplikacji](#application-specific-monitoring)
* [Monitorowanie produkcji Node.js za pomocą kontroli stanu PM2](#nodejs-production-monitoring-with-pm2-health-checks)
  * [Nasz system kontroli stanu PM2](#our-pm2-health-check-system)
  * [Nasza konfiguracja produkcji PM2](#our-pm2-production-configuration)
  * [Automatyczne wdrażanie PM2](#automated-pm2-deployment)
* [System obsługi i klasyfikacji błędów produkcyjnych](#production-error-handling-and-classification-system)
  * [Nasza implementacja isCodeBug dla produkcji](#our-iscodebug-implementation-for-production)
  * [Integracja z naszym rejestrowaniem produkcji](#integration-with-our-production-logging)
  * [Powiązane treści](#related-content-1)
* [Zaawansowane debugowanie wydajności z v8-profiler-next i cpupro](#advanced-performance-debugging-with-v8-profiler-next-and-cpupro)
  * [Nasze podejście do profilowania w produkcji Node.js](#our-profiling-approach-for-nodejs-production)
  * [Jak wdrażamy analizę migawek sterty](#how-we-implement-heap-snapshot-analysis)
  * [Przepływ pracy debugowania wydajności](#performance-debugging-workflow)
  * [Zalecana implementacja dla Twojej aplikacji Node.js](#recommended-implementation-for-your-nodejs-application)
  * [Integracja z naszym monitorowaniem produkcji](#integration-with-our-production-monitoring)
* [Bezpieczeństwo infrastruktury produkcyjnej Node.js](#nodejs-production-infrastructure-security)
  * [Bezpieczeństwo na poziomie systemu dla produkcji Node.js](#system-level-security-for-nodejs-production)
  * [Bezpieczeństwo aplikacji dla aplikacji Node.js](#application-security-for-nodejs-applications)
  * [Automatyzacja bezpieczeństwa infrastruktury](#infrastructure-security-automation)
  * [Nasza treść dotycząca bezpieczeństwa](#our-security-content)
* [Architektura bazy danych dla aplikacji Node.js](#database-architecture-for-nodejs-applications)
  * [Implementacja SQLite dla środowiska produkcyjnego Node.js](#sqlite-implementation-for-nodejs-production)
  * [Implementacja MongoDB dla środowiska produkcyjnego Node.js](#mongodb-implementation-for-nodejs-production)
* [Przetwarzanie zadań w tle produkcji Node.js](#nodejs-production-background-job-processing)
  * [Nasza konfiguracja serwera Bree do produkcji](#our-bree-server-setup-for-production)
  * [Przykłady pracy produkcyjnej](#production-job-examples)
  * [Nasze wzorce harmonogramowania zadań dla produkcji Node.js](#our-job-scheduling-patterns-for-nodejs-production)
* [Automatyczna konserwacja aplikacji produkcyjnych Node.js](#automated-maintenance-for-production-nodejs-applications)
  * [Nasza realizacja oczyszczania](#our-cleanup-implementation)
  * [Zarządzanie przestrzenią dyskową dla produkcji Node.js](#disk-space-management-for-nodejs-production)
  * [Automatyzacja konserwacji infrastruktury](#infrastructure-maintenance-automation)
* [Przewodnik po wdrażaniu Node.js w środowisku produkcyjnym](#nodejs-production-deployment-implementation-guide)
  * [Zapoznaj się z naszym aktualnym kodem, aby poznać najlepsze praktyki produkcyjne](#study-our-actual-code-for-production-best-practices)
  * [Ucz się z naszych wpisów na blogu](#learn-from-our-blog-posts)
  * [Automatyzacja infrastruktury dla produkcji Node.js](#infrastructure-automation-for-nodejs-production)
  * [Nasze studia przypadków](#our-case-studies)
* [Podsumowanie: Najlepsze praktyki wdrażania Node.js w środowisku produkcyjnym](#conclusion-nodejs-production-deployment-best-practices)
* [Kompletna lista zasobów dla środowiska produkcyjnego Node.js](#complete-resource-list-for-nodejs-production)
  * [Nasze podstawowe pliki wdrożeniowe](#our-core-implementation-files)
  * [Nasze wdrożenia serwerowe](#our-server-implementations)
  * [Automatyzacja naszej infrastruktury](#our-infrastructure-automation)
  * [Nasze wpisy na blogu technicznym](#our-technical-blog-posts)
  * [Nasze studia przypadków przedsiębiorstw](#our-enterprise-case-studies)

## Przedmowa {#foreword}

W Forward Email spędziliśmy lata doskonaląc konfigurację naszego środowiska produkcyjnego Node.js. Ten kompleksowy przewodnik przedstawia nasze sprawdzone w boju najlepsze praktyki wdrażania Node.js w środowisku produkcyjnym, koncentrując się na optymalizacji wydajności, monitorowaniu oraz wnioskach, jakie wyciągnęliśmy, skalując aplikacje Node.js do obsługi milionów transakcji dziennie.

## Nasza rewolucja w optymalizacji wydajności pojedynczego rdzenia o 573% {#our-573-single-core-performance-optimization-revolution}

Po migracji z procesorów Intel na AMD Ryzen osiągnęliśmy **573% wzrost wydajności** w naszych aplikacjach Node.js. Nie była to jedynie drobna optymalizacja – radykalnie zmieniła ona sposób działania naszych aplikacji Node.js w środowisku produkcyjnym i pokazuje, jak ważna jest optymalizacja wydajności pojedynczego rdzenia dla każdej aplikacji Node.js.

> \[!TIP]
> W przypadku najlepszych praktyk wdrażania Node.js w środowisku produkcyjnym, wybór sprzętu ma kluczowe znaczenie. Wybraliśmy hosting DataPacket ze względu na dostępność procesorów AMD Ryzen, ponieważ wydajność pojedynczego rdzenia jest kluczowa dla aplikacji Node.js, ponieważ wykonywanie JavaScript jest jednowątkowe.

### Dlaczego optymalizacja wydajności pojedynczego rdzenia ma znaczenie dla Node.js {#why-single-core-performance-optimization-matters-for-nodejs}

Migracja z procesorów Intel na procesory AMD Ryzen przyniosła następujące efekty:

* **573% poprawa wydajności** w przetwarzaniu żądań (udokumentowane w [(problem #1519](https://github.com/forwardemail/status.forwardemail.net/issues/1519#issuecomment-2652177671 z naszej strony ze stanem w GitHubie))
* **Wyeliminowanie opóźnień przetwarzania** do niemal natychmiastowych odpowiedzi (wspomniane w [problemie #298](https://github.com/forwardemail/forwardemail.net/issues/298 z GitHubu))
* **Lepszy stosunek ceny do wydajności** dla środowisk produkcyjnych Node.js
* **Krótsze czasy reakcji** we wszystkich naszych punktach końcowych aplikacji

Wzrost wydajności był tak znaczący, że obecnie uważamy procesory AMD Ryzen za niezbędne dla każdego poważnego wdrożenia produkcyjnego Node.js, niezależnie od tego, czy uruchamiasz aplikacje internetowe, API, mikrousługi, czy jakiekolwiek inne obciążenie Node.js.

### Powiązane treści {#related-content}

Aby uzyskać więcej informacji na temat naszych opcji infrastrukturalnych, sprawdź:

* [Najlepsza usługa przekierowania poczty e-mail](https://forwardemail.net/blog/docs/best-email-forwarding-service) – Porównania wydajności
* [Rozwiązanie hostowane samodzielnie](https://forwardemail.net/blog/docs/self-hosted-solution) – Zalecenia sprzętowe

## Konfiguracja środowiska produkcyjnego Node.js: Nasz zestaw technologii {#nodejs-production-environment-setup-our-technology-stack}

Nasze najlepsze praktyki wdrażania Node.js w środowisku produkcyjnym obejmują przemyślane wybory technologiczne oparte na wieloletnim doświadczeniu w produkcji. Oto, z czego korzystamy i dlaczego te wybory mają zastosowanie w każdej aplikacji Node.js:

### Menedżer pakietów: pnpm dla wydajności produkcyjnej {#package-manager-pnpm-for-production-efficiency}

**Czego używamy:** [`pnpm`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json) (wersja przypięta)

Wybraliśmy pnpm zamiast npm i yarn do konfiguracji naszego środowiska produkcyjnego Node.js, ponieważ:

* **Krótszy czas instalacji** w potokach CI/CD
* **Efektywność wykorzystania miejsca na dysku** dzięki twardym linkom
* **Ścisłe rozwiązywanie zależności** zapobiegające powstawaniu zależności fantomowych
* **Lepsza wydajność** we wdrożeniach produkcyjnych

> \[!NOTE]
> W ramach naszych najlepszych praktyk wdrażania Node.js w środowisku produkcyjnym przypinamy dokładne wersje kluczowych narzędzi, takich jak pnpm, aby zapewnić spójne działanie we wszystkich środowiskach i na komputerach członków zespołu.

**Szczegóły implementacji:**

* [Nasza konfiguracja package.json](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [Nasz wpis na blogu o ekosystemie NPM](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)

### Framework internetowy: Koa dla nowoczesnej produkcji Node.js {#web-framework-koa-for-modern-nodejs-production}

**Czego używamy:**

* [`@koa/router`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@koa/multer`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/koa-simple-ratelimit`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Wybraliśmy Koa zamiast Express dla naszej infrastruktury produkcyjnej Node.js ze względu na nowoczesną obsługę async/await i bardziej przejrzystą strukturę oprogramowania pośredniczącego. Nasz założyciel, Nick Baugh, przyczynił się do rozwoju zarówno Express, jak i Koa, zapewniając nam dogłębną wiedzę na temat obu frameworków pod kątem zastosowań produkcyjnych.

Wzorce te mają zastosowanie niezależnie od tego, czy tworzysz interfejsy API REST, serwery GraphQL, aplikacje internetowe czy mikrousługi.

**Nasze przykłady implementacji:**

* [Konfiguracja serwera WWW](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [Konfiguracja serwera API](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Przewodnik po wdrażaniu formularzy kontaktowych](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)

### Przetwarzanie zadań w tle: Bree dla niezawodności produkcji {#background-job-processing-bree-for-production-reliability}

**Czego używamy:** harmonogram [`bree`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Stworzyliśmy i utrzymujemy Bree, ponieważ istniejące harmonogramy zadań nie spełniały naszych potrzeb w zakresie obsługi wątków roboczych i nowoczesnych funkcji JavaScript w produkcyjnych środowiskach Node.js. Dotyczy to każdej aplikacji Node.js, która wymaga przetwarzania w tle, zaplanowanych zadań lub wątków roboczych.

**Nasze przykłady implementacji:**

* [Konfiguracja serwera Bree](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [Wszystkie nasze definicje stanowisk](https://github.com/forwardemail/forwardemail.net/tree/master/jobs)
* [Zadanie kontroli stanu PM2](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)
* [Wdrażanie prac czyszczących](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

### Obsługa błędów: @hapi/boom dla niezawodności produkcji {#error-handling-hapiboom-for-production-reliability}

**Czego używamy:** [`@hapi/boom`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Używamy @hapi/boom do ustrukturyzowanej obsługi błędów w naszych aplikacjach produkcyjnych Node.js. Ten wzorzec sprawdza się w każdej aplikacji Node.js, która wymaga spójnej obsługi błędów.

**Nasze przykłady implementacji:**

* [Pomocnik klasyfikacji błędów](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
* [Implementacja rejestratora](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

## Jak monitorować aplikacje Node.js w środowisku produkcyjnym {#how-to-monitor-nodejs-applications-in-production}

Nasze podejście do monitorowania aplikacji Node.js w środowisku produkcyjnym ewoluowało przez lata uruchamiania aplikacji na dużą skalę. Wdrażamy monitorowanie na wielu warstwach, aby zapewnić niezawodność i wydajność każdego typu aplikacji Node.js.

### Monitorowanie produkcji Node.js na poziomie systemu {#system-level-nodejs-production-monitoring}

**Nasza podstawowa implementacja:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

**Czego używamy:** [`node-os-utils`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Nasze progi monitorowania produkcji (na podstawie naszego rzeczywistego kodu produkcyjnego):

* **Limit rozmiaru sterty 2 GB** z automatycznymi alertami
* **Próg ostrzegawczy 25% wykorzystania pamięci**
* **Próg ostrzegawczy 80% wykorzystania procesora**
* **Próg ostrzegawczy 75% wykorzystania dysku**

> \[!WARNING]
> Te progi działają dla naszej konkretnej konfiguracji sprzętowej. Podczas wdrażania monitorowania produkcji Node.js, zapoznaj się z naszą implementacją monitor-server.js, aby zrozumieć dokładną logikę i dostosować wartości do swojej konfiguracji.

### Monitorowanie na poziomie aplikacji dla środowiska produkcyjnego Node.js {#application-level-monitoring-for-nodejs-production}

**Nasza klasyfikacja błędu:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

Ten pomocnik rozróżnia:

* **Rzeczywiste błędy w kodzie** wymagające natychmiastowej uwagi
* **Błędy użytkownika**, które są oczekiwanym zachowaniem
* **Awarie usług zewnętrznych**, na które nie mamy wpływu

Ten wzorzec ma zastosowanie w przypadku dowolnej aplikacji Node.js — aplikacji internetowych, interfejsów API, mikrousług i usług działających w tle.

**Nasza implementacja rejestrowania:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

Wdrażamy kompleksową redagowanie pól w celu ochrony poufnych informacji, jednocześnie zachowując przydatne możliwości debugowania w naszym środowisku produkcyjnym Node.js.

### Monitorowanie specyficzne dla aplikacji {#application-specific-monitoring}

**Nasze implementacje serwerowe:**

* [Serwer SMTP](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)
* [Serwer IMAP](https://github.com/forwardemail/forwardemail.net/blob/master/imap.js)
* [Serwer POP3](https://github.com/forwardemail/forwardemail.net/blob/master/pop3.js)

**Monitorowanie kolejek:** Wprowadzamy limity kolejek 5 GB i 180-sekundowe limity czasu dla przetwarzania żądań, aby zapobiec wyczerpaniu zasobów. Te wzorce dotyczą każdej aplikacji Node.js z kolejkami lub przetwarzaniem w tle.

## Monitorowanie produkcji Node.js za pomocą kontroli stanu PM2 {#nodejs-production-monitoring-with-pm2-health-checks}

Udoskonaliliśmy konfigurację naszego środowiska produkcyjnego Node.js, wykorzystując PM2 przez lata doświadczeń w produkcji. Nasze kontrole stanu PM2 są niezbędne do utrzymania niezawodności każdej aplikacji Node.js.

### Nasz system kontroli stanu PM2 {#our-pm2-health-check-system}

**Nasza podstawowa implementacja:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

Nasze monitorowanie produkcji Node.js z kontrolą stanu PM2 obejmuje:

* **Uruchamia się co 20 minut** poprzez harmonogram cron
* **Wymaga minimum 15 minut sprawności** przed uznaniem procesu za prawidłowy
* **Sprawdza stan procesu i zużycie pamięci**
* **Automatycznie restartuje nieudane procesy**
* **Zapobiega pętlom restartów** poprzez inteligentne sprawdzanie stanu

> \[!CAUTION]
> Zgodnie z najlepszymi praktykami wdrażania Node.js w środowisku produkcyjnym, wymagamy co najmniej 15 minut nieprzerwanej pracy, zanim uznamy proces za sprawny, aby uniknąć pętli restartów. Zapobiega to kaskadowym awariom, gdy procesy mają problemy z pamięcią lub innymi problemami.

### Nasza konfiguracja produkcji PM2 {#our-pm2-production-configuration}

**Konfiguracja naszego ekosystemu:** Zapoznaj się z plikami startowymi naszego serwera w celu konfiguracji środowiska produkcyjnego Node.js:

* [Serwer WWW](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [Serwer API](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Harmonogram Bree](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [Serwer SMTP](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)

Wzorce te mają zastosowanie niezależnie od tego, czy uruchamiasz aplikacje Express, serwery Koa, interfejsy API GraphQL czy dowolną inną aplikację Node.js.

### Automatyczne wdrażanie PM2 {#automated-pm2-deployment}

**Wdrażanie PM2:** [`ansible/playbooks/node.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

Całą konfigurację PM2 automatyzujemy za pomocą Ansible, aby zapewnić spójne wdrożenia produkcyjne Node.js na wszystkich naszych serwerach.

## System obsługi i klasyfikacji błędów produkcyjnych {#production-error-handling-and-classification-system}

Jedną z naszych najważniejszych praktyk wdrażania Node.js w środowisku produkcyjnym jest inteligentna klasyfikacja błędów, która ma zastosowanie w każdej aplikacji Node.js:

### Nasza implementacja isCodeBug dla produkcji {#our-iscodebug-implementation-for-production}

**Źródło:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

Ten pomocnik zapewnia inteligentną klasyfikację błędów dla aplikacji Node.js w środowisku produkcyjnym, aby:

* **Priorytetyzacja rzeczywistych błędów** nad błędami użytkownika
* **Poprawa reakcji na incydenty** poprzez skupienie się na rzeczywistych problemach
* **Zmniejszenie zmęczenia alertami** z powodu przewidywanych błędów użytkownika
* **Lepsze zrozumienie** problemów generowanych przez aplikację w porównaniu z problemami generowanymi przez użytkownika

Ten wzorzec sprawdza się w przypadku każdej aplikacji Node.js — niezależnie od tego, czy tworzysz witryny e-commerce, platformy SaaS, interfejsy API czy mikrousługi.

### Integracja z naszym rejestrowaniem produkcji {#integration-with-our-production-logging}

**Nasza integracja rejestratora:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

Nasz rejestrator używa `isCodeBug` do określania poziomów alertów i redagowania pól, dzięki czemu otrzymujemy powiadomienia o rzeczywistych problemach, jednocześnie filtrując szum w naszym środowisku produkcyjnym Node.js.

### Powiązana treść {#related-content-1}

Dowiedz się więcej o naszych wzorcach obsługi błędów:

* [Budowanie niezawodnego systemu płatności](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal) – Wzorce obsługi błędów
* [Ochrona prywatności poczty e-mail](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation) – Obsługa błędów bezpieczeństwa

## Zaawansowane debugowanie wydajności z v8-profiler-next i cpupro {#advanced-performance-debugging-with-v8-profiler-next-and-cpupro}

Używamy zaawansowanych narzędzi profilujących do analizy migawek sterty i debugowania problemów z OOM (brak pamięci), wąskich gardeł wydajnościowych oraz problemów z pamięcią Node.js w naszym środowisku produkcyjnym. Narzędzia te są niezbędne w przypadku każdej aplikacji Node.js, w której występują wycieki pamięci lub problemy z wydajnością.

### Nasze podejście do profilowania w środowisku produkcyjnym Node.js {#our-profiling-approach-for-nodejs-production}

**Narzędzia, które polecamy:**

* [`v8-profiler-next`](https://www.npmjs.com/package/v8-profiler-next) – Do generowania migawek sterty i profili procesora
* [`cpupro`](https://github.com/discoveryjs/cpupro) – Do analizowania profili procesora i migawek sterty

> \[!TIP]
> Używamy v8-profiler-next i cpupro razem, aby stworzyć kompletny proces debugowania wydajności dla naszych aplikacji Node.js. Ta kombinacja pomaga nam identyfikować wycieki pamięci, wąskie gardła wydajnościowe i optymalizować nasz kod produkcyjny.

### Jak wdrażamy analizę migawek sterty {#how-we-implement-heap-snapshot-analysis}

**Nasza implementacja monitorowania:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

Nasz monitoring produkcji obejmuje automatyczne generowanie migawek sterty w przypadku przekroczenia progów pamięci. Pomaga nam to debugować problemy z brakiem pamięci (OOM), zanim spowodują one awarie aplikacji.

**Kluczowe wzorce implementacji:**

* **Automatyczne migawki**, gdy rozmiar stosu przekroczy próg 2 GB
* **Profilowanie oparte na sygnałach** do analizy na żądanie w środowisku produkcyjnym
* **Zasady przechowywania** do zarządzania pamięcią masową migawek
* **Integracja z naszymi zadaniami czyszczenia** w celu automatycznej konserwacji

### Przepływ pracy debugowania wydajności {#performance-debugging-workflow}

**Zapoznaj się z naszą rzeczywistą implementacją:**

* [Monitoruj implementację serwera](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js) – Monitorowanie sterty i generowanie migawek
* [Praca porządkowa](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js) – Przechowywanie i czyszczenie migawek
* [Integracja rejestratora](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js) – Rejestrowanie wydajności

### Zalecana implementacja dla Twojej aplikacji Node.js {#recommended-implementation-for-your-nodejs-application}

**Do analizy migawek sterty:**

1. **Zainstaluj v8-profiler-next** do generowania migawek
2. **Użyj cpupro** do analizy wygenerowanych migawek
3. **Wdróż progi monitorowania** podobne do naszego monitor-server.js
4. **Skonfiguruj automatyczne czyszczenie** do zarządzania pamięcią masową migawek
5. **Utwórz procedury obsługi sygnałów** do profilowania na żądanie w środowisku produkcyjnym

**Do profilowania procesora:**

1. **Generuj profile procesora** w okresach dużego obciążenia
2. **Analizuj za pomocą cpupro** w celu identyfikacji wąskich gardeł
3. **Skup się na ścieżkach krytycznych** i możliwościach optymalizacji
4. **Monitoruj przed/po** poprawkach wydajności

> \[!WARNING]
> Generowanie migawek sterty i profili procesora może mieć wpływ na wydajność. Zalecamy wdrożenie ograniczania przepustowości i włączanie profilowania tylko podczas badania konkretnych problemów lub w okresach konserwacji.

### Integracja z naszym monitorowaniem produkcji {#integration-with-our-production-monitoring}

Nasze narzędzia profilowania integrują się z naszą szerszą strategią monitorowania:

* **Automatyczne wyzwalanie** na podstawie progów pamięci/procesora
* **Integracja alertów** w przypadku wykrycia problemów z wydajnością
* **Analiza historyczna** w celu śledzenia trendów wydajności w czasie
* **Korelacja z metrykami aplikacji** w celu kompleksowego debugowania

Dzięki temu podejściu udało nam się zidentyfikować i rozwiązać problemy z wyciekami pamięci, zoptymalizować ścieżki często występującego kodu i utrzymać stabilną wydajność w naszym środowisku produkcyjnym Node.js.

## Bezpieczeństwo infrastruktury produkcyjnej Node.js {#nodejs-production-infrastructure-security}

Wdrażamy kompleksowe zabezpieczenia naszej infrastruktury produkcyjnej Node.js poprzez automatyzację Ansible. Te praktyki dotyczą każdej aplikacji Node.js:

### Bezpieczeństwo na poziomie systemu dla środowiska produkcyjnego Node.js {#system-level-security-for-nodejs-production}

**Nasza implementacja Ansible:** [`ansible/playbooks/security.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)

Nasze kluczowe środki bezpieczeństwa dla środowisk produkcyjnych Node.js:

* **Wyłączona wymiana**, aby zapobiec zapisywaniu poufnych danych na dysku
* **Wyłączona funkcja zrzutu pamięci**, aby zapobiec zrzutom pamięci zawierającym poufne informacje
* **Zablokowana pamięć USB**, aby zapobiec nieautoryzowanemu dostępowi do danych
* **Dostrajanie parametrów jądra** pod kątem bezpieczeństwa i wydajności

> \[!WARNING]
> Podczas wdrażania najlepszych praktyk wdrażania produkcyjnego Node.js, wyłączenie wymiany może spowodować zamknięcie aplikacji z powodu braku pamięci, jeśli przekroczy ona dostępną pamięć RAM. Uważnie monitorujemy wykorzystanie pamięci i odpowiednio dobieramy rozmiar naszych serwerów.

### Bezpieczeństwo aplikacji dla aplikacji Node.js {#application-security-for-nodejs-applications}

**Nasza redakcja pola dziennika:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

Usuwamy wrażliwe pola z logów, w tym hasła, tokeny, klucze API i dane osobowe. Chroni to prywatność użytkowników, jednocześnie zachowując możliwości debugowania w dowolnym środowisku produkcyjnym Node.js.

### Automatyzacja bezpieczeństwa infrastruktury {#infrastructure-security-automation}

**Nasza kompletna konfiguracja Ansible dla środowiska produkcyjnego Node.js:**

* [Podręcznik bezpieczeństwa](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Zarządzanie kluczami SSH](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/ssh-keys.yml)
* [Zarządzanie certyfikatami](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/certificates.yml)
* [Konfiguracja DKIM](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/dkim.yml)

### Nasza treść dotycząca bezpieczeństwa {#our-security-content}

Dowiedz się więcej o naszym podejściu do kwestii bezpieczeństwa:

* [Najlepsze firmy audytorskie](https://forwardemail.net/blog/docs/best-security-audit-companies)
* [Szyfrowana poczta e-mail Quantum Safe](https://forwardemail.net/blog/docs/best-quantum-safe-encrypted-email-service)
* [Dlaczego warto korzystać z oprogramowania Open Source do zabezpieczania poczty e-mail](https://forwardemail.net/blog/docs/why-open-source-email-security-privacy)

## Architektura bazy danych dla aplikacji Node.js {#database-architecture-for-nodejs-applications}

Wykorzystujemy hybrydowe podejście do baz danych zoptymalizowane pod kątem naszych aplikacji Node.js. Te wzorce można dostosować do dowolnej aplikacji Node.js:

### Implementacja SQLite dla środowiska produkcyjnego Node.js {#sqlite-implementation-for-nodejs-production}

**Czego używamy:**

* [`better-sqlite3`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`better-sqlite3-multiple-ciphers`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

**Nasza konfiguracja:** [`ansible/playbooks/sqlite.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

W naszych aplikacjach Node.js do obsługi danych specyficznych dla użytkownika używamy bazy SQLite, ponieważ zapewnia ona:

* **Izolacja danych** dla każdego użytkownika/najemcy
* **Lepsza wydajność** w przypadku zapytań pojedynczego użytkownika
* **Uproszczone tworzenie kopii zapasowych** i migracja
* **Mniejsza złożoność** w porównaniu z bazami danych współdzielonymi

Ten wzorzec sprawdza się w aplikacjach SaaS, systemach wielodostępnych i dowolnych aplikacjach Node.js wymagających izolacji danych.

### Implementacja MongoDB dla środowiska produkcyjnego Node.js {#mongodb-implementation-for-nodejs-production}

**Czego używamy:**

* [`@ladjs/mongoose`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/mongoose-error-messages`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@zainundin/mongoose-factory`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

**Nasza implementacja konfiguracji:** [`helpers/setup-mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/setup-mongoose.js)

**Nasza konfiguracja:** [`config/mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/config/mongoose.js)

W naszym środowisku produkcyjnym Node.js do obsługi danych aplikacji używamy MongoDB, ponieważ zapewnia ono:

* **Elastyczny schemat** dla ewoluujących struktur danych
* **Lepsza wydajność** dla złożonych zapytań
* **Możliwości skalowania poziomego**
* **Bogaty język zapytań**

> \[!NOTE]
> Nasze hybrydowe podejście optymalizuje się pod kątem konkretnego przypadku użycia. Przeanalizuj rzeczywiste wzorce wykorzystania bazy danych w kodzie, aby dowiedzieć się, czy to podejście spełnia potrzeby Twojej aplikacji Node.js.

## Przetwarzanie zadań w tle w środowisku produkcyjnym Node.js {#nodejs-production-background-job-processing}

Zbudowaliśmy naszą architekturę zadań w tle wokół Bree, aby zapewnić niezawodne wdrożenie produkcyjne Node.js. Dotyczy to każdej aplikacji Node.js wymagającej przetwarzania w tle:

### Nasza konfiguracja serwera Bree do produkcji {#our-bree-server-setup-for-production}

**Nasza główna implementacja:** [`bree.js`](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)

**Nasze wdrożenie Ansible:** [`ansible/playbooks/bree.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/bree.yml)

### Przykłady stanowisk produkcyjnych {#production-job-examples}

**Monitorowanie stanu zdrowia:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

**Automatyzacja czyszczenia:** [`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

**Wszystkie nasze oferty pracy:** [Przeglądaj nasz kompletny katalog ofert pracy](https://github.com/forwardemail/forwardemail.net/tree/master/jobs)

Wzorce te mają zastosowanie do dowolnej aplikacji Node.js, która wymaga:

* Zaplanowane zadania (przetwarzanie danych, raporty, czyszczenie)
* Przetwarzanie w tle (zmiana rozmiaru obrazu, wysyłanie wiadomości e-mail, import danych)
* Monitorowanie stanu i konserwacja
* Wykorzystanie wątków roboczych do zadań intensywnie wykorzystujących procesor

### Nasze wzorce harmonogramowania zadań dla środowiska produkcyjnego Node.js {#our-job-scheduling-patterns-for-nodejs-production}

Zapoznaj się z naszymi aktualnymi schematami harmonogramowania pracy w naszym katalogu ofert pracy, aby zrozumieć:

* Jak wdrażamy harmonogramowanie podobne do crona w środowisku produkcyjnym Node.js
* Nasza obsługa błędów i logika ponawiania prób
* Jak wykorzystujemy wątki robocze do zadań intensywnie wykorzystujących procesor

## Automatyczna konserwacja aplikacji produkcyjnych Node.js {#automated-maintenance-for-production-nodejs-applications}

Wdrażamy proaktywną konserwację, aby zapobiegać typowym problemom produkcyjnym Node.js. Poniższe wzorce dotyczą każdej aplikacji Node.js:

### Nasza implementacja oczyszczania {#our-cleanup-implementation}

**Źródło:** [`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

Nasze zautomatyzowane utrzymanie aplikacji produkcyjnych Node.js ma na celu:

* **Pliki tymczasowe** starsze niż 24 godziny
* **Pliki dziennika** przekraczające limity przechowywania
* **Pliki pamięci podręcznej** i dane tymczasowe
* **Przesłane pliki**, które nie są już potrzebne
* **Migawki sterty** z debugowania wydajności

Wzorce te mają zastosowanie do wszystkich aplikacji Node.js, które generują pliki tymczasowe, dzienniki lub dane w pamięci podręcznej.

### Zarządzanie przestrzenią dyskową dla środowiska produkcyjnego Node.js {#disk-space-management-for-nodejs-production}

**Nasze progi monitorowania:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

* **Limit kolejki** dla przetwarzania w tle
* **75% użycie dysku** próg ostrzegawczy
* **Automatyczne czyszczenie** po przekroczeniu progów

### Automatyzacja konserwacji infrastruktury {#infrastructure-maintenance-automation}

**Nasza automatyzacja Ansible dla produkcji Node.js:**

* [Wdrożenie środowiska](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/env.yml)
* [Zarządzanie kluczami wdrożeniowymi](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/deployment-keys.yml)

## Przewodnik po wdrażaniu Node.js w środowisku produkcyjnym {#nodejs-production-deployment-implementation-guide}

### Przeanalizuj nasz rzeczywisty kod, aby poznać najlepsze praktyki produkcyjne {#study-our-actual-code-for-production-best-practices}

**Rozpocznij konfigurację środowiska produkcyjnego Node.js od tych kluczowych plików:**

1. **Konfiguracja:** [`config/index.js`](https://github.com/forwardemail/forwardemail.net/blob/master/config/index.js)
2. **Monitorowanie:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)
3. **Obsługa błędów:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
4. **Logowanie:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
5. **Stan procesu:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

### Ucz się z naszych wpisów na blogu {#learn-from-our-blog-posts}

**Nasze przewodniki po implementacji technicznej dla środowiska produkcyjnego Node.js:**

* [Ekosystem pakietów NPM](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)
* [Budowanie systemów płatności](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal)
* [Wdrożenie prywatności poczty e-mail](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [Formularze kontaktowe JavaScript](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [Integracja z React Email](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)

### Automatyzacja infrastruktury dla środowiska produkcyjnego Node.js {#infrastructure-automation-for-nodejs-production}

**Nasze podręczniki Ansible do nauki wdrażania Node.js w środowisku produkcyjnym:**

* [Kompletny katalog podręczników](https://github.com/forwardemail/forwardemail.net/tree/master/ansible/playbooks)
* [Wzmocnienie bezpieczeństwa](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Konfiguracja Node.js](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

### Nasze studia przypadków {#our-case-studies}

**Nasze wdrożenia korporacyjne:**

* [Studium przypadku Linux Foundation](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [Studium przypadku Canonical Ubuntu](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [Przekierowywanie poczty elektronicznej absolwentów](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)

## Wnioski: Najlepsze praktyki wdrażania Node.js w środowisku produkcyjnym {#conclusion-nodejs-production-deployment-best-practices}

Nasza infrastruktura produkcyjna Node.js dowodzi, że aplikacje Node.js mogą osiągnąć niezawodność klasy korporacyjnej dzięki:

* **Sprawdzone rozwiązania sprzętowe** (AMD Ryzen dla optymalizacji wydajności pojedynczego rdzenia na poziomie 573%)
* **Przetestowany w boju monitoring produkcji Node.js** z określonymi progami i zautomatyzowanymi reakcjami
* **Inteligentna klasyfikacja błędów** w celu usprawnienia reakcji na incydenty w środowiskach produkcyjnych
* **Zaawansowane debugowanie wydajności** z v8-profiler-next i cpupro w celu zapobiegania niedoborowi zasobów (OOM)
* **Kompleksowe wzmocnienie bezpieczeństwa** dzięki automatyzacji Ansible
* **Hybrydowa architektura bazy danych** zoptymalizowana pod kątem potrzeb aplikacji
* **Automatyczna konserwacja** w celu zapobiegania typowym problemom produkcyjnym Node.js

**Kluczowy wniosek:** Zamiast stosować się do ogólnych, najlepszych praktyk, zapoznaj się z naszymi plikami implementacyjnymi i wpisami na blogu. Nasza baza kodu zawiera praktyczne wzorce wdrażania Node.js w środowisku produkcyjnym, które można dostosować do dowolnej aplikacji Node.js – aplikacji webowych, interfejsów API, mikrousług czy usług w tle.

## Kompletna lista zasobów dla środowiska produkcyjnego Node.js {#complete-resource-list-for-nodejs-production}

### Nasze podstawowe pliki implementacyjne {#our-core-implementation-files}

* [Konfiguracja główna](https://github.com/forwardemail/forwardemail.net/blob/master/config/index.js)
* [Zależności pakietów](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [Monitorowanie serwera](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)
* [Klasyfikacja błędów](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
* [System rejestrowania](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
* [Kontrole stanu PM2](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)
* [Automatyczne czyszczenie](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

### Nasze implementacje serwerowe {#our-server-implementations}

* [Serwer WWW](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [Serwer API](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Harmonogram Bree](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [Serwer SMTP](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)
* [Serwer IMAP](https://github.com/forwardemail/forwardemail.net/blob/master/imap.js)
* [Serwer POP3](https://github.com/forwardemail/forwardemail.net/blob/master/pop3.js)

### Nasza infrastruktura Automatyzacja {#our-infrastructure-automation}

* [Wszystkie nasze podręczniki Ansible](https://github.com/forwardemail/forwardemail.net/tree/master/ansible/playbooks)
* [Wzmocnienie bezpieczeństwa](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Konfiguracja Node.js](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)
* [Konfiguracja bazy danych](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

### Nasze wpisy na blogu technicznym {#our-technical-blog-posts}

* [Analiza ekosystemu NPM](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)
* [Wdrożenie systemu płatności](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal)
* [Przewodnik techniczny dotyczący prywatności w wiadomościach e-mail](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [Formularze kontaktowe JavaScript](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [Integracja z React Email](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)
* [Przewodnik po rozwiązaniach hostowanych samodzielnie](https://forwardemail.net/blog/docs/self-hosted-solution)

### Nasze studia przypadków przedsiębiorstw {#our-enterprise-case-studies}

* [Implementacja Linux Foundation](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [Studium przypadku Canonical Ubuntu](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [Zgodność z przepisami rządu federalnego](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)
* [Systemy poczty elektronicznej dla absolwentów](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)