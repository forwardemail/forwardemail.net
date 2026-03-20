# Jak zoptymalizować infrastrukturę produkcyjną Node.js: najlepsze praktyki {#how-to-optimize-nodejs-production-infrastructure-best-practices}

<img loading="lazy" src="/img/articles/nodejs-performance.webp" alt="Node.js performance optimization guide" class="rounded-lg" />


## Spis treści {#table-of-contents}

* [Przedmowa](#foreword)
* [Nasza rewolucja optymalizacji wydajności pojedynczego rdzenia o 573%](#our-573-single-core-performance-optimization-revolution)
  * [Dlaczego optymalizacja wydajności pojedynczego rdzenia ma znaczenie dla Node.js](#why-single-core-performance-optimization-matters-for-nodejs)
  * [Powiązane treści](#related-content)
* [Konfiguracja środowiska produkcyjnego Node.js: nasz stos technologiczny](#nodejs-production-environment-setup-our-technology-stack)
  * [Menedżer pakietów: pnpm dla efektywności produkcyjnej](#package-manager-pnpm-for-production-efficiency)
  * [Framework webowy: Koa dla nowoczesnej produkcji Node.js](#web-framework-koa-for-modern-nodejs-production)
  * [Przetwarzanie zadań w tle: Bree dla niezawodności produkcyjnej](#background-job-processing-bree-for-production-reliability)
  * [Obsługa błędów: @hapi/boom dla niezawodności produkcyjnej](#error-handling-hapiboom-for-production-reliability)
* [Jak monitorować aplikacje Node.js w produkcji](#how-to-monitor-nodejs-applications-in-production)
  * [Monitorowanie produkcji Node.js na poziomie systemu](#system-level-nodejs-production-monitoring)
  * [Monitorowanie aplikacji na poziomie produkcji Node.js](#application-level-monitoring-for-nodejs-production)
  * [Monitorowanie specyficzne dla aplikacji](#application-specific-monitoring)
* [Monitorowanie produkcji Node.js za pomocą PM2 Health Checks](#nodejs-production-monitoring-with-pm2-health-checks)
  * [Nasz system kontroli stanu PM2](#our-pm2-health-check-system)
  * [Nasza konfiguracja produkcyjna PM2](#our-pm2-production-configuration)
  * [Zautomatyzowane wdrożenie PM2](#automated-pm2-deployment)
* [System obsługi i klasyfikacji błędów produkcyjnych](#production-error-handling-and-classification-system)
  * [Nasza implementacja isCodeBug dla produkcji](#our-iscodebug-implementation-for-production)
  * [Integracja z naszym logowaniem produkcyjnym](#integration-with-our-production-logging)
  * [Powiązane treści](#related-content-1)
* [Zaawansowane debugowanie wydajności z v8-profiler-next i cpupro](#advanced-performance-debugging-with-v8-profiler-next-and-cpupro)
  * [Nasze podejście do profilowania produkcji Node.js](#our-profiling-approach-for-nodejs-production)
  * [Jak implementujemy analizę zrzutów sterty](#how-we-implement-heap-snapshot-analysis)
  * [Przebieg debugowania wydajności](#performance-debugging-workflow)
  * [Zalecana implementacja dla Twojej aplikacji Node.js](#recommended-implementation-for-your-nodejs-application)
  * [Integracja z naszym monitorowaniem produkcji](#integration-with-our-production-monitoring)
* [Bezpieczeństwo infrastruktury produkcyjnej Node.js](#nodejs-production-infrastructure-security)
  * [Bezpieczeństwo systemowe dla produkcji Node.js](#system-level-security-for-nodejs-production)
  * [Bezpieczeństwo aplikacji dla aplikacji Node.js](#application-security-for-nodejs-applications)
  * [Automatyzacja bezpieczeństwa infrastruktury](#infrastructure-security-automation)
  * [Nasze treści dotyczące bezpieczeństwa](#our-security-content)
* [Architektura bazy danych dla aplikacji Node.js](#database-architecture-for-nodejs-applications)
  * [Implementacja SQLite dla produkcji Node.js](#sqlite-implementation-for-nodejs-production)
  * [Implementacja MongoDB dla produkcji Node.js](#mongodb-implementation-for-nodejs-production)
* [Przetwarzanie zadań w tle produkcji Node.js](#nodejs-production-background-job-processing)
  * [Nasza konfiguracja serwera Bree dla produkcji](#our-bree-server-setup-for-production)
  * [Przykłady zadań produkcyjnych](#production-job-examples)
  * [Nasze wzorce harmonogramowania zadań dla produkcji Node.js](#our-job-scheduling-patterns-for-nodejs-production)
* [Zautomatyzowana konserwacja aplikacji produkcyjnych Node.js](#automated-maintenance-for-production-nodejs-applications)
  * [Nasza implementacja czyszczenia](#our-cleanup-implementation)
  * [Zarządzanie miejscem na dysku dla produkcji Node.js](#disk-space-management-for-nodejs-production)
  * [Automatyzacja konserwacji infrastruktury](#infrastructure-maintenance-automation)
* [Przewodnik wdrożenia produkcyjnego Node.js](#nodejs-production-deployment-implementation-guide)
  * [Przeanalizuj nasz rzeczywisty kod dla najlepszych praktyk produkcyjnych](#study-our-actual-code-for-production-best-practices)
  * [Ucz się z naszych wpisów na blogu](#learn-from-our-blog-posts)
  * [Automatyzacja infrastruktury dla produkcji Node.js](#infrastructure-automation-for-nodejs-production)
  * [Nasze studia przypadków](#our-case-studies)
* [Podsumowanie: najlepsze praktyki wdrożenia produkcyjnego Node.js](#conclusion-nodejs-production-deployment-best-practices)
* [Kompletna lista zasobów dla produkcji Node.js](#complete-resource-list-for-nodejs-production)
  * [Nasze podstawowe pliki implementacyjne](#our-core-implementation-files)
  * [Nasze implementacje serwerów](#our-server-implementations)
  * [Nasza automatyzacja infrastruktury](#our-infrastructure-automation)
  * [Nasze techniczne wpisy na blogu](#our-technical-blog-posts)
  * [Nasze studia przypadków dla przedsiębiorstw](#our-enterprise-case-studies)
## Przedmowa {#foreword}

W Forward Email spędziliśmy lata na doskonaleniu naszego środowiska produkcyjnego Node.js. Ten kompleksowy przewodnik dzieli się naszymi sprawdzonymi najlepszymi praktykami wdrażania Node.js w produkcji, koncentrując się na optymalizacji wydajności, monitoringu oraz lekcjach, które wynieśliśmy podczas skalowania aplikacji Node.js do obsługi milionów codziennych transakcji.


## Nasza rewolucja optymalizacji wydajności pojedynczego rdzenia o 573% {#our-573-single-core-performance-optimization-revolution}

Kiedy przeszliśmy z procesorów Intel na AMD Ryzen, osiągnęliśmy **573% poprawę wydajności** w naszych aplikacjach Node.js. To nie była tylko drobna optymalizacja — zasadniczo zmieniła sposób działania naszych aplikacji Node.js w produkcji i pokazuje, jak ważna jest optymalizacja wydajności pojedynczego rdzenia dla każdej aplikacji Node.js.

> \[!TIP]
> W przypadku najlepszych praktyk wdrażania Node.js w produkcji wybór sprzętu jest kluczowy. Specjalnie wybraliśmy hosting DataPacket ze względu na dostępność AMD Ryzen, ponieważ wydajność pojedynczego rdzenia jest kluczowa dla aplikacji Node.js, gdyż wykonywanie JavaScript jest jednowątkowe.

### Dlaczego optymalizacja wydajności pojedynczego rdzenia ma znaczenie dla Node.js {#why-single-core-performance-optimization-matters-for-nodejs}

Nasza migracja z Intela na AMD Ryzen zaowocowała:

* **573% poprawą wydajności** w przetwarzaniu żądań (udokumentowane w [GitHub Issue #1519 na naszej stronie statusowej](https://github.com/forwardemail/status.forwardemail.net/issues/1519#issuecomment-2652177671))
* **Eliminacją opóźnień w przetwarzaniu** do niemal natychmiastowych odpowiedzi (wspomniane w [GitHub Issue #298](https://github.com/forwardemail/forwardemail.net/issues/298))
* **Lepszym stosunkiem ceny do wydajności** dla środowisk produkcyjnych Node.js
* **Poprawą czasów odpowiedzi** na wszystkich punktach końcowych naszych aplikacji

Wzrost wydajności był tak znaczący, że obecnie uważamy procesory AMD Ryzen za niezbędne dla każdego poważnego wdrożenia produkcyjnego Node.js, niezależnie od tego, czy uruchamiasz aplikacje webowe, API, mikrousługi czy inne obciążenia Node.js.

### Powiązane treści {#related-content}

Aby uzyskać więcej szczegółów na temat naszych wyborów infrastruktury, sprawdź:

* [Najlepsza usługa przekazywania e-maili](https://forwardemail.net/blog/docs/best-email-forwarding-service) – porównania wydajności
* [Rozwiązanie samodzielnie hostowane](https://forwardemail.net/blog/docs/self-hosted-solution) – rekomendacje sprzętowe


## Konfiguracja środowiska produkcyjnego Node.js: Nasz stos technologiczny {#nodejs-production-environment-setup-our-technology-stack}

Nasze najlepsze praktyki wdrażania Node.js w produkcji obejmują świadome wybory technologiczne oparte na wieloletnim doświadczeniu produkcyjnym. Oto co używamy i dlaczego te wybory mają zastosowanie do każdej aplikacji Node.js:

### Menedżer pakietów: pnpm dla efektywności produkcyjnej {#package-manager-pnpm-for-production-efficiency}

**Co używamy:** [`pnpm`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json) (przypięta wersja)

Wybraliśmy pnpm zamiast npm i yarn do naszego środowiska produkcyjnego Node.js, ponieważ:

* **Szybsze czasy instalacji** w pipeline’ach CI/CD
* **Efektywność miejsca na dysku** dzięki twardemu linkowaniu
* **Ścisłe rozwiązywanie zależności**, które zapobiega pojawianiu się ukrytych zależności
* **Lepsza wydajność** w wdrożeniach produkcyjnych

> \[!NOTE]
> W ramach naszych najlepszych praktyk wdrażania Node.js w produkcji przypinamy dokładne wersje kluczowych narzędzi, takich jak pnpm, aby zapewnić spójne zachowanie we wszystkich środowiskach i na maszynach członków zespołu.

**Szczegóły implementacji:**

* [Nasza konfiguracja package.json](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [Nasz wpis na blogu o ekosystemie NPM](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)

### Framework webowy: Koa dla nowoczesnej produkcji Node.js {#web-framework-koa-for-modern-nodejs-production}

**Co używamy:**

* [`@koa/router`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@koa/multer`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/koa-simple-ratelimit`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
Wybraliśmy Koa zamiast Express dla naszej infrastruktury produkcyjnej Node.js ze względu na nowoczesne wsparcie async/await oraz czyściejszą kompozycję middleware. Nasz założyciel Nick Baugh przyczynił się do rozwoju zarówno Express, jak i Koa, co dało nam głębokie zrozumienie obu frameworków pod kątem zastosowań produkcyjnych.

Te wzorce mają zastosowanie niezależnie od tego, czy budujesz REST API, serwery GraphQL, aplikacje webowe czy mikrousługi.

**Nasze przykłady implementacji:**

* [Konfiguracja serwera WWW](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [Konfiguracja serwera API](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Przewodnik implementacji formularzy kontaktowych](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)

### Przetwarzanie zadań w tle: Bree dla niezawodności produkcyjnej {#background-job-processing-bree-for-production-reliability}

**Co używamy:** [`bree`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json) scheduler

Stworzyliśmy i utrzymujemy Bree, ponieważ istniejące harmonogramy zadań nie spełniały naszych wymagań dotyczących wsparcia wątków roboczych oraz nowoczesnych funkcji JavaScript w środowiskach produkcyjnych Node.js. Dotyczy to każdej aplikacji Node.js, która potrzebuje przetwarzania w tle, zadań zaplanowanych lub wątków roboczych.

**Nasze przykłady implementacji:**

* [Konfiguracja serwera Bree](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [Wszystkie nasze definicje zadań](https://github.com/forwardemail/forwardemail.net/tree/master/jobs)
* [Zadanie kontroli stanu PM2](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)
* [Implementacja zadania sprzątającego](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

### Obsługa błędów: @hapi/boom dla niezawodności produkcyjnej {#error-handling-hapiboom-for-production-reliability}

**Co używamy:** [`@hapi/boom`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Używamy @hapi/boom do strukturalnych odpowiedzi błędów w naszych produkcyjnych aplikacjach Node.js. Ten wzorzec działa dla każdej aplikacji Node.js, która potrzebuje spójnej obsługi błędów.

**Nasze przykłady implementacji:**

* [Pomocnik klasyfikacji błędów](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
* [Implementacja loggera](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)


## Jak monitorować aplikacje Node.js w produkcji {#how-to-monitor-nodejs-applications-in-production}

Nasze podejście do monitorowania aplikacji Node.js w produkcji ewoluowało przez lata uruchamiania aplikacji na dużą skalę. Wdrażamy monitoring na wielu warstwach, aby zapewnić niezawodność i wydajność dla każdego typu aplikacji Node.js.

### Monitorowanie produkcyjne Node.js na poziomie systemu {#system-level-nodejs-production-monitoring}

**Nasza podstawowa implementacja:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

**Co używamy:** [`node-os-utils`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Nasze progi monitorowania produkcyjnego (z naszego rzeczywistego kodu produkcyjnego):

* **Limit rozmiaru sterty 2GB** z automatycznymi alertami
* **Próg ostrzeżenia 25% użycia pamięci**
* **Próg alertu 80% użycia CPU**
* **Próg ostrzeżenia 75% użycia dysku**

> \[!WARNING]
> Te progi działają dla naszej konkretnej konfiguracji sprzętowej. Przy wdrażaniu monitorowania produkcyjnego Node.js zapoznaj się z implementacją monitor-server.js, aby zrozumieć dokładną logikę i dostosować wartości do swojego środowiska.

### Monitorowanie produkcyjne Node.js na poziomie aplikacji {#application-level-monitoring-for-nodejs-production}

**Nasza klasyfikacja błędów:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

Ten pomocnik rozróżnia:

* **Rzeczywiste błędy w kodzie**, które wymagają natychmiastowej uwagi
* **Błędy użytkownika**, które są oczekiwanym zachowaniem
* **Awarię usług zewnętrznych**, których nie możemy kontrolować

Ten wzorzec ma zastosowanie do każdej aplikacji Node.js – aplikacji webowych, API, mikrousług lub usług działających w tle.
**Nasza implementacja logowania:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

Wprowadzamy kompleksowe zaciemnianie pól, aby chronić wrażliwe informacje, jednocześnie zachowując przydatne możliwości debugowania w naszym środowisku produkcyjnym Node.js.

### Monitorowanie specyficzne dla aplikacji {#application-specific-monitoring}

**Nasze implementacje serwerów:**

* [Serwer SMTP](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)
* [Serwer IMAP](https://github.com/forwardemail/forwardemail.net/blob/master/imap.js)
* [Serwer POP3](https://github.com/forwardemail/forwardemail.net/blob/master/pop3.js)

**Monitorowanie kolejki:** Wprowadzamy limity kolejki 5GB oraz timeouty 180 sekund na przetwarzanie żądań, aby zapobiec wyczerpaniu zasobów. Te wzorce mają zastosowanie do każdej aplikacji Node.js z kolejkami lub przetwarzaniem w tle.


## Monitorowanie produkcji Node.js z PM2 Health Checks {#nodejs-production-monitoring-with-pm2-health-checks}

Udoskonaliliśmy nasze środowisko produkcyjne Node.js z PM2 na podstawie wieloletniego doświadczenia produkcyjnego. Nasze health checki PM2 są niezbędne do utrzymania niezawodności w każdej aplikacji Node.js.

### Nasz system health checków PM2 {#our-pm2-health-check-system}

**Nasza podstawowa implementacja:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

Nasze monitorowanie produkcji Node.js z health checkami PM2 obejmuje:

* **Uruchamianie co 20 minut** za pomocą harmonogramu cron
* **Wymaga minimum 15 minut czasu działania** przed uznaniem procesu za zdrowy
* **Weryfikuje status procesu i zużycie pamięci**
* **Automatycznie restartuje nieudane procesy**
* **Zapobiega pętlom restartów** dzięki inteligentnemu sprawdzaniu stanu

> \[!CAUTION]
> Dla najlepszych praktyk wdrożenia produkcyjnego Node.js wymagamy 15+ minut czasu działania przed uznaniem procesu za zdrowy, aby uniknąć pętli restartów. Zapobiega to kaskadowym awariom, gdy procesy mają problemy z pamięcią lub inne problemy.

### Nasza konfiguracja produkcyjna PM2 {#our-pm2-production-configuration}

**Nasza konfiguracja ekosystemu:** Zapoznaj się z naszymi plikami startowymi serwera dla środowiska produkcyjnego Node.js:

* [Serwer WWW](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [Serwer API](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Harmonogram Bree](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [Serwer SMTP](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)

Te wzorce mają zastosowanie niezależnie od tego, czy uruchamiasz aplikacje Express, serwery Koa, API GraphQL czy inne aplikacje Node.js.

### Zautomatyzowane wdrożenie PM2 {#automated-pm2-deployment}

**Wdrożenie PM2:** [`ansible/playbooks/node.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

Automatyzujemy całe nasze środowisko PM2 za pomocą Ansible, aby zapewnić spójne wdrożenia produkcyjne Node.js na wszystkich naszych serwerach.


## System obsługi i klasyfikacji błędów produkcyjnych {#production-error-handling-and-classification-system}

Jedną z naszych najcenniejszych najlepszych praktyk wdrożenia produkcyjnego Node.js jest inteligentna klasyfikacja błędów, która ma zastosowanie do każdej aplikacji Node.js:

### Nasza implementacja isCodeBug dla produkcji {#our-iscodebug-implementation-for-production}

**Źródło:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

Ten helper zapewnia inteligentną klasyfikację błędów dla aplikacji Node.js w produkcji, aby:

* **Priorytetyzować rzeczywiste błędy** nad błędami użytkownika
* **Poprawić naszą reakcję na incydenty** poprzez skupienie się na prawdziwych problemach
* **Zmniejszyć zmęczenie alertami** wynikające z oczekiwanych błędów użytkownika
* **Lepsze zrozumienie** problemów aplikacji vs generowanych przez użytkownika

Ten wzorzec działa dla każdej aplikacji Node.js – niezależnie czy tworzysz strony e-commerce, platformy SaaS, API czy mikrousługi.

### Integracja z naszym logowaniem produkcyjnym {#integration-with-our-production-logging}

**Nasza integracja loggera:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
Nasz logger używa `isCodeBug` do określania poziomów alertów i redakcji pól, zapewniając, że otrzymujemy powiadomienia o prawdziwych problemach, jednocześnie filtrując szumy w naszym środowisku produkcyjnym Node.js.

### Powiązane treści {#related-content-1}

Dowiedz się więcej o naszych wzorcach obsługi błędów:

* [Budowanie niezawodnego systemu płatności](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal) - Wzorce obsługi błędów
* [Ochrona prywatności e-mail](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation) - Obsługa błędów bezpieczeństwa


## Zaawansowane debugowanie wydajności z v8-profiler-next i cpupro {#advanced-performance-debugging-with-v8-profiler-next-and-cpupro}

Używamy zaawansowanych narzędzi profilujących do analizy zrzutów sterty i debugowania problemów OOM (Out of Memory), wąskich gardeł wydajności oraz problemów z pamięcią Node.js w naszym środowisku produkcyjnym. Te narzędzia są niezbędne dla każdej aplikacji Node.js doświadczającej wycieków pamięci lub problemów z wydajnością.

### Nasze podejście do profilowania w produkcji Node.js {#our-profiling-approach-for-nodejs-production}

**Narzędzia, które polecamy:**

* [`v8-profiler-next`](https://www.npmjs.com/package/v8-profiler-next) - Do generowania zrzutów sterty i profili CPU
* [`cpupro`](https://github.com/discoveryjs/cpupro) - Do analizy profili CPU i zrzutów sterty

> \[!TIP]
> Używamy v8-profiler-next i cpupro razem, aby stworzyć kompletny workflow debugowania wydajności dla naszych aplikacji Node.js. To połączenie pomaga nam identyfikować wycieki pamięci, wąskie gardła wydajności i optymalizować nasz kod produkcyjny.

### Jak implementujemy analizę zrzutów sterty {#how-we-implement-heap-snapshot-analysis}

**Nasza implementacja monitoringu:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

Nasz monitoring produkcyjny obejmuje automatyczne generowanie zrzutów sterty, gdy przekroczone zostaną progi pamięci. Pomaga to debugować problemy OOM zanim spowodują awarie aplikacji.

**Kluczowe wzorce implementacji:**

* **Automatyczne zrzuty** gdy rozmiar sterty przekracza próg 2GB
* **Profilowanie na sygnał** do analizy na żądanie w produkcji
* **Polityki retencji** do zarządzania przechowywaniem zrzutów
* **Integracja z naszymi zadaniami czyszczącymi** do automatycznej konserwacji

### Workflow debugowania wydajności {#performance-debugging-workflow}

**Przeanalizuj naszą rzeczywistą implementację:**

* [Implementacja monitorowania serwera](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js) - Monitorowanie sterty i generowanie zrzutów
* [Zadanie czyszczące](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js) - Retencja i czyszczenie zrzutów
* [Integracja loggera](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js) - Logowanie wydajności

### Zalecana implementacja dla Twojej aplikacji Node.js {#recommended-implementation-for-your-nodejs-application}

**Do analizy zrzutów sterty:**

1. **Zainstaluj v8-profiler-next** do generowania zrzutów
2. **Użyj cpupro** do analizy wygenerowanych zrzutów
3. **Wdroż progi monitoringu** podobne do naszego monitor-server.js
4. **Skonfiguruj automatyczne czyszczenie** do zarządzania przechowywaniem zrzutów
5. **Utwórz obsługę sygnałów** do profilowania na żądanie w produkcji

**Do profilowania CPU:**

1. **Generuj profile CPU** podczas okresów dużego obciążenia
2. **Analizuj za pomocą cpupro** aby zidentyfikować wąskie gardła
3. **Skup się na gorących ścieżkach** i możliwościach optymalizacji
4. **Monitoruj przed i po** wprowadzeniu usprawnień wydajności

> \[!WARNING]
> Generowanie zrzutów sterty i profili CPU może wpływać na wydajność. Zalecamy wdrożenie ograniczeń i włączanie profilowania tylko podczas badania konkretnych problemów lub w oknach konserwacyjnych.

### Integracja z naszym monitoringiem produkcyjnym {#integration-with-our-production-monitoring}

Nasze narzędzia profilujące integrują się z naszą szerszą strategią monitoringu:

* **Automatyczne wyzwalanie** na podstawie progów pamięci/CPU
* **Integracja alertów** gdy wykrywane są problemy z wydajnością
* **Analiza historyczna** do śledzenia trendów wydajności w czasie
* **Korelacja z metrykami aplikacji** dla kompleksowego debugowania
To podejście pomogło nam zidentyfikować i rozwiązać wycieki pamięci, zoptymalizować gorące ścieżki kodu oraz utrzymać stabilną wydajność w naszym środowisku produkcyjnym Node.js.


## Bezpieczeństwo infrastruktury produkcyjnej Node.js {#nodejs-production-infrastructure-security}

Wdrażamy kompleksowe zabezpieczenia dla naszej infrastruktury produkcyjnej Node.js za pomocą automatyzacji Ansible. Te praktyki mają zastosowanie do każdej aplikacji Node.js:

### Bezpieczeństwo na poziomie systemu dla produkcji Node.js {#system-level-security-for-nodejs-production}

**Nasza implementacja Ansible:** [`ansible/playbooks/security.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)

Nasze kluczowe środki bezpieczeństwa dla środowisk produkcyjnych Node.js:

* **Wyłączona pamięć wymiany (swap)**, aby zapobiec zapisywaniu wrażliwych danych na dysku
* **Wyłączone zrzuty pamięci (core dumps)**, aby zapobiec wyciekom pamięci zawierającym wrażliwe informacje
* **Zablokowane pamięci USB**, aby zapobiec nieautoryzowanemu dostępowi do danych
* **Dostosowanie parametrów jądra** zarówno pod kątem bezpieczeństwa, jak i wydajności

> \[!WARNING]
> Podczas wdrażania najlepszych praktyk produkcyjnego wdrożenia Node.js wyłączenie pamięci wymiany może spowodować zabijanie procesów z powodu braku pamięci, jeśli aplikacja przekroczy dostępną pamięć RAM. Monitorujemy zużycie pamięci uważnie i odpowiednio dobieramy rozmiar naszych serwerów.

### Bezpieczeństwo aplikacji dla aplikacji Node.js {#application-security-for-nodejs-applications}

**Nasze redagowanie pól logów:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

Redagujemy wrażliwe pola w logach, w tym hasła, tokeny, klucze API oraz dane osobowe. Chroni to prywatność użytkowników, jednocześnie zachowując możliwości debugowania w każdym środowisku produkcyjnym Node.js.

### Automatyzacja bezpieczeństwa infrastruktury {#infrastructure-security-automation}

**Nasza kompletna konfiguracja Ansible dla produkcji Node.js:**

* [Playbook bezpieczeństwa](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Zarządzanie kluczami SSH](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/ssh-keys.yml)
* [Zarządzanie certyfikatami](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/certificates.yml)
* [Konfiguracja DKIM](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/dkim.yml)

### Nasze materiały dotyczące bezpieczeństwa {#our-security-content}

Dowiedz się więcej o naszym podejściu do bezpieczeństwa:

* [Najlepsze firmy audytujące bezpieczeństwo](https://forwardemail.net/blog/docs/best-security-audit-companies)
* [Kwantowo bezpieczna zaszyfrowana poczta](https://forwardemail.net/blog/docs/best-quantum-safe-encrypted-email-service)
* [Dlaczego otwarte oprogramowanie dla bezpieczeństwa poczty](https://forwardemail.net/blog/docs/why-open-source-email-security-privacy)


## Architektura bazy danych dla aplikacji Node.js {#database-architecture-for-nodejs-applications}

Używamy hybrydowego podejścia do baz danych zoptymalizowanego dla naszych aplikacji Node.js. Te wzorce można dostosować do każdej aplikacji Node.js:

### Implementacja SQLite dla produkcji Node.js {#sqlite-implementation-for-nodejs-production}

**Co używamy:**

* [`better-sqlite3`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`better-sqlite3-multiple-ciphers`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

**Nasza konfiguracja:** [`ansible/playbooks/sqlite.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

Używamy SQLite do danych specyficznych dla użytkownika w naszych aplikacjach Node.js, ponieważ zapewnia:

* **Izolację danych** dla każdego użytkownika/najemcy
* **Lepszą wydajność** dla zapytań jednoosobowych
* **Uproszczone tworzenie kopii zapasowych** i migracje
* **Zmniejszoną złożoność** w porównaniu do współdzielonych baz danych

Ten wzorzec sprawdza się dobrze w aplikacjach SaaS, systemach wielonajemcowych lub każdej aplikacji Node.js, która potrzebuje izolacji danych.

### Implementacja MongoDB dla produkcji Node.js {#mongodb-implementation-for-nodejs-production}

**Co używamy:**

* [`@ladjs/mongoose`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/mongoose-error-messages`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@zainundin/mongoose-factory`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
**Nasza implementacja konfiguracji:** [`helpers/setup-mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/setup-mongoose.js)

**Nasza konfiguracja:** [`config/mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/config/mongoose.js)

Używamy MongoDB do danych aplikacji w naszym środowisku produkcyjnym Node.js, ponieważ zapewnia:

* **Elastyczny schemat** dla ewoluujących struktur danych
* **Lepszą wydajność** dla złożonych zapytań
* **Możliwości skalowania poziomego**
* **Bogaty język zapytań**

> \[!NOTE]
> Nasze podejście hybrydowe optymalizuje się pod nasz konkretny przypadek użycia. Przeanalizuj rzeczywiste wzorce użycia bazy danych w kodzie, aby zrozumieć, czy to podejście pasuje do potrzeb Twojej aplikacji Node.js.


## Przetwarzanie zadań w tle w produkcji Node.js {#nodejs-production-background-job-processing}

Zbudowaliśmy naszą architekturę zadań w tle wokół Bree dla niezawodnego wdrożenia produkcyjnego Node.js. Dotyczy to każdej aplikacji Node.js, która potrzebuje przetwarzania w tle:

### Nasza konfiguracja serwera Bree dla produkcji {#our-bree-server-setup-for-production}

**Nasza główna implementacja:** [`bree.js`](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)

**Nasze wdrożenie Ansible:** [`ansible/playbooks/bree.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/bree.yml)

### Przykłady zadań produkcyjnych {#production-job-examples}

**Monitorowanie stanu:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

**Automatyczne sprzątanie:** [`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

**Wszystkie nasze zadania:** [Przeglądaj nasz kompletny katalog zadań](https://github.com/forwardemail/forwardemail.net/tree/master/jobs)

Te wzorce dotyczą każdej aplikacji Node.js, która potrzebuje:

* Zaplanowanych zadań (przetwarzanie danych, raporty, sprzątanie)
* Przetwarzania w tle (zmiana rozmiaru obrazów, wysyłanie e-maili, importy danych)
* Monitorowania stanu i konserwacji
* Wykorzystania wątków roboczych do zadań intensywnych obliczeniowo

### Nasze wzorce harmonogramowania zadań dla produkcji Node.js {#our-job-scheduling-patterns-for-nodejs-production}

Przeanalizuj nasze rzeczywiste wzorce harmonogramowania zadań w katalogu zadań, aby zrozumieć:

* Jak implementujemy harmonogramowanie podobne do cron w produkcji Node.js
* Naszą obsługę błędów i logikę ponawiania prób
* Jak używamy wątków roboczych do zadań intensywnych obliczeniowo


## Zautomatyzowana konserwacja dla produkcyjnych aplikacji Node.js {#automated-maintenance-for-production-nodejs-applications}

Wdrażamy proaktywną konserwację, aby zapobiegać typowym problemom produkcyjnym Node.js. Te wzorce dotyczą każdej aplikacji Node.js:

### Nasza implementacja sprzątania {#our-cleanup-implementation}

**Źródło:** [`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

Nasza zautomatyzowana konserwacja dla produkcyjnych aplikacji Node.js obejmuje:

* **Pliki tymczasowe** starsze niż 24 godziny
* **Pliki dziennika** przekraczające limity retencji
* **Pliki cache** i dane tymczasowe
* **Przesłane pliki**, które nie są już potrzebne
* **Zrzuty sterty** z debugowania wydajności

Te wzorce dotyczą każdej aplikacji Node.js, która generuje pliki tymczasowe, dzienniki lub dane cache.

### Zarządzanie miejscem na dysku dla produkcji Node.js {#disk-space-management-for-nodejs-production}

**Nasze progi monitorowania:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

* **Limity kolejki** dla przetwarzania w tle
* **Ostrzeżenie przy 75% wykorzystania dysku**
* **Automatyczne sprzątanie** po przekroczeniu progów

### Automatyzacja konserwacji infrastruktury {#infrastructure-maintenance-automation}

**Nasza automatyzacja Ansible dla produkcji Node.js:**

* [Wdrożenie środowiska](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/env.yml)
* [Zarządzanie kluczami wdrożeniowymi](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/deployment-keys.yml)


## Przewodnik po implementacji wdrożenia produkcyjnego Node.js {#nodejs-production-deployment-implementation-guide}
### Study Our Actual Code for Production Best Practices {#study-our-actual-code-for-production-best-practices}

**Zacznij od tych kluczowych plików do konfiguracji środowiska produkcyjnego Node.js:**

1. **Konfiguracja:** [`config/index.js`](https://github.com/forwardemail/forwardemail.net/blob/master/config/index.js)
2. **Monitorowanie:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)
3. **Obsługa błędów:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
4. **Logowanie:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
5. **Stan procesu:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

### Learn from Our Blog Posts {#learn-from-our-blog-posts}

**Nasze techniczne przewodniki wdrożeniowe dla produkcji Node.js:**

* [Ekosystem pakietów NPM](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)
* [Budowanie systemów płatności](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal)
* [Implementacja prywatności e-mail](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [Formularze kontaktowe w JavaScript](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [Integracja e-mail w React](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)

### Infrastructure Automation for Node.js Production {#infrastructure-automation-for-nodejs-production}

**Nasze playbooki Ansible do nauki wdrożenia produkcyjnego Node.js:**

* [Pełny katalog playbooków](https://github.com/forwardemail/forwardemail.net/tree/master/ansible/playbooks)
* [Wzmacnianie bezpieczeństwa](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Konfiguracja Node.js](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

### Our Case Studies {#our-case-studies}

**Nasze wdrożenia korporacyjne:**

* [Studium przypadku Linux Foundation](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [Studium przypadku Canonical Ubuntu](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [Przekierowanie e-mail dla absolwentów](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)


## Conclusion: Node.js Production Deployment Best Practices {#conclusion-nodejs-production-deployment-best-practices}

Nasza infrastruktura produkcyjna Node.js pokazuje, że aplikacje Node.js mogą osiągnąć niezawodność klasy korporacyjnej dzięki:

* **Sprawdzonym wyborom sprzętu** (AMD Ryzen dla 573% optymalizacji wydajności pojedynczego rdzenia)
* **Przetestowanemu monitorowaniu produkcji Node.js** z określonymi progami i automatycznymi reakcjami
* **Inteligentnej klasyfikacji błędów** w celu poprawy reakcji na incydenty w środowiskach produkcyjnych
* **Zaawansowanemu debugowaniu wydajności** z użyciem v8-profiler-next i cpupro dla zapobiegania OOM
* **Kompleksowemu wzmacnianiu bezpieczeństwa** poprzez automatyzację Ansible
* **Hybrydowej architekturze bazy danych** zoptymalizowanej pod potrzeby aplikacji
* **Automatycznej konserwacji** zapobiegającej typowym problemom produkcyjnym Node.js

**Kluczowa wskazówka:** Studiuj nasze rzeczywiste pliki implementacyjne i wpisy na blogu zamiast stosować ogólne najlepsze praktyki. Nasza baza kodu dostarcza wzorców z prawdziwego świata dla wdrożeń produkcyjnych Node.js, które można dostosować do każdej aplikacji Node.js – aplikacji webowych, API, mikrousług lub usług działających w tle.


## Complete Resource List for Node.js Production {#complete-resource-list-for-nodejs-production}

### Our Core Implementation Files {#our-core-implementation-files}

* [Główna konfiguracja](https://github.com/forwardemail/forwardemail.net/blob/master/config/index.js)
* [Zależności pakietów](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [Monitorowanie serwera](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)
* [Klasyfikacja błędów](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
* [System logowania](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
* [Kontrole stanu PM2](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)
* [Automatyczne czyszczenie](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)
### Nasze implementacje serwerów {#our-server-implementations}

* [Serwer WWW](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [Serwer API](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Harmonogram Bree](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [Serwer SMTP](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)
* [Serwer IMAP](https://github.com/forwardemail/forwardemail.net/blob/master/imap.js)
* [Serwer POP3](https://github.com/forwardemail/forwardemail.net/blob/master/pop3.js)

### Nasza automatyzacja infrastruktury {#our-infrastructure-automation}

* [Wszystkie nasze playbooki Ansible](https://github.com/forwardemail/forwardemail.net/tree/master/ansible/playbooks)
* [Wzmocnienie bezpieczeństwa](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Konfiguracja Node.js](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)
* [Konfiguracja bazy danych](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

### Nasze techniczne wpisy na blogu {#our-technical-blog-posts}

* [Analiza ekosystemu NPM](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)
* [Implementacja systemu płatności](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal)
* [Techniczny przewodnik po prywatności e-mail](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [Formularze kontaktowe w JavaScript](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [Integracja e-mail w React](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)
* [Przewodnik po rozwiązaniu self-hosted](https://forwardemail.net/blog/docs/self-hosted-solution)

### Nasze studia przypadków dla przedsiębiorstw {#our-enterprise-case-studies}

* [Implementacja Linux Foundation](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [Studium przypadku Canonical Ubuntu](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [Zgodność z przepisami rządu federalnego](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)
* [Systemy e-mail dla absolwentów](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)
