# Umowa o przetwarzaniu danych {#data-processing-agreement}

<!-- v1.0 z <https://github.com/CommonPaper/DPA> -->

<img loading="lazy" src="/img/articles/dpa.webp" alt="Forward Email data processing agreement" class="rounded-lg" />

## Spis treści {#table-of-contents}

* [Terminy kluczowe](#key-terms)
* [Zmiany w Umowie](#changes-to-the-agreement)
* [1. Relacje między podmiotem przetwarzającym a podmiotem podprzetwarzającym](#1-processor-and-subprocessor-relationships)
  * [1. Dostawca jako podmiot przetwarzający](#1-provider-as-processor)
  * [2. Dostawca jako podprocesor](#2-provider-as-subprocessor)
* [2. Przetwarzanie](#2-processing)
  * [1. Szczegóły przetwarzania](#1-processing-details)
  * [2. Instrukcje przetwarzania](#2-processing-instructions)
  * [3. Przetwarzanie przez Dostawcę](#3-processing-by-provider)
  * [4. Przetwarzanie klienta](#4-customer-processing)
  * [5. Zgoda na przetwarzanie](#5-consent-to-processing)
  * [6. Podprocesory](#6-subprocessors)
* [3. Ograniczone transfery](#3-restricted-transfers)
  * [1. Autoryzacja](#1-authorization)
  * [2. Transfery poza EOG](#2-ex-eea-transfers)
  * [3. Transfery poza Wielką Brytanię](#3-ex-uk-transfers)
  * [4. Inne transfery międzynarodowe](#4-other-international-transfers)
* [4. Reagowanie na incydenty bezpieczeństwa](#4-security-incident-response)
* [5. Audyt i raporty](#5-audit--reports)
  * [1. Prawa audytowe](#1-audit-rights)
  * [2. Raporty bezpieczeństwa](#2-security-reports)
  * [3. Należyta staranność w zakresie bezpieczeństwa](#3-security-due-diligence)
* [6. Koordynacja i współpraca](#6-coordination--cooperation)
  * [1. Odpowiedź na zapytania](#1-response-to-inquiries)
  * [2. Oceny skutków dla ochrony danych (DPIA) i oceny skutków dla ochrony danych (DTIA)](#2-dpias-and-dtias)
* [7. Usuwanie danych osobowych klienta](#7-deletion-of-customer-personal-data)
  * [1. Usunięcie przez Klienta](#1-deletion-by-customer)
  * [2. Usunięcie po wygaśnięciu DPA](#2-deletion-at-dpa-expiration)
* [8. Ograniczenie odpowiedzialności](#8-limitation-of-liability)
  * [1. Limity odpowiedzialności i zrzeczenie się odszkodowania](#1-liability-caps-and-damages-waiver)
  * [2. Roszczenia podmiotów powiązanych](#2-related-party-claims)
  * [3. Wyjątki](#3-exceptions)
* [9. Konflikty między dokumentami](#9-conflicts-between-documents)
* [10. Okres obowiązywania umowy](#10-term-of-agreement)
* [11. Prawo właściwe i sądy wybrane](#11-governing-law-and-chosen-courts)
* [12. Relacja z dostawcą usług](#12-service-provider-relationship)
* [13. Definicje](#13-definitions)
* [Kredyty](#credits)

## Terminy kluczowe {#key-terms}

| Termin | Wartość |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <strong>Umowa</strong> | Niniejsza umowa DPA stanowi uzupełnienie [Terms of Service](/terms) |
| <strong>Zatwierdzeni podprocesorzy</strong> | [Cloudflare](https://cloudflare.com) (USA; dostawca usług DNS, sieci i zabezpieczeń), [DataPacket](https://www.datapacket.com/) (USA/Wielka Brytania; dostawca hostingu), [Digital Ocean](https://digitalocean.com) (USA; dostawca hostingu), [Vultr](https://www.vultr.com) (USA; dostawca hostingu), [Stripe](https://stripe.com) (USA; podmiot przetwarzający płatności), [PayPal](https://paypal.com) (USA; podmiot przetwarzający płatności) |
| <strong>Kontakt do dostawcy usług bezpieczeństwa</strong> | <a href="mailto:security@forwardemail.net"><security@forwardemail.net></a> |
| <strong>Polityka bezpieczeństwa</strong> | Wyświetl [our Security Policy on GitHub](https://github.com/forwardemail/forwardemail.net/security/policy) |
| <strong>Państwo rządzące</strong> | Stan Delaware, Stany Zjednoczone |

## Zmiany w Umowie {#changes-to-the-agreement}

Niniejszy dokument jest pochodną dokumentu [Standardowe warunki umowy DPA (wersja 1.0)](https://commonpaper.com/standards/data-processing-agreement/1.0) i wprowadzono w nim następujące zmiany:

1. [Prawo właściwe i wybrane sądy](#11-governing-law-and-chosen-courts) został dodany jako sekcja poniżej, a `Governing State` został zidentyfikowany powyżej.
2. [Relacja z dostawcą usług](#12-service-provider-relationship) został dodany jako sekcja poniżej.

## 1. Relacje między podmiotami przetwarzającymi i podprocesorami {#1-processor-and-subprocessor-relationships}

### 1. Dostawca jako podmiot przetwarzający {#1-provider-as-processor}

W sytuacjach, w których <strong>Klient</strong> jest Administratorem Danych Osobowych Klienta, <strong>Dostawca</strong> będzie uznawany za Podmiot Przetwarzający, który Przetwarza Dane Osobowe w imieniu <strong>Klienta</strong>.

### 2. Dostawca jako podprocesor {#2-provider-as-subprocessor}

W sytuacjach, gdy <strong>Klient</strong> jest podmiotem przetwarzającym dane osobowe Klienta, <strong>Dostawca</strong> będzie uznawany za podwykonawcę podmiotu przetwarzającego dane osobowe Klienta.

## 2. Przetwarzanie {#2-processing}

### 1. Szczegóły przetwarzania {#1-processing-details}

Załącznik I(B) na stronie tytułowej opisuje przedmiot, charakter, cel i czas trwania przetwarzania, a także <strong>Kategorie gromadzonych danych osobowych</strong> i <strong>Kategorie osób, których dane dotyczą</strong>.

### 2. Instrukcje przetwarzania {#2-processing-instructions}

<strong>Klient</strong> zleca <strong>Dostawcy</strong> Przetwarzanie Danych Osobowych Klienta: (a) w celu świadczenia i utrzymywania Usługi; (b) zgodnie z dalszymi ustaleniami w trakcie korzystania przez <strong>Klienta</strong> z Usługi; (c) zgodnie z dokumentacją w <strong>Umowie</strong>; oraz (d) zgodnie z dokumentacją w innych pisemnych instrukcjach udzielonych przez <strong>Klienta</strong> i potwierdzonych przez <strong>Dostawcę</strong> dotyczących Przetwarzania Danych Osobowych Klienta na mocy niniejszej Umowy o Ochronie Danych Osobowych. <strong>Dostawca</strong> będzie przestrzegał tych instrukcji, chyba że zabraniają mu tego obowiązujące przepisy prawa. <strong>Dostawca</strong> niezwłocznie poinformuje <strong>Klienta</strong>, jeśli nie będzie w stanie zastosować się do instrukcji Przetwarzania. <strong>Klient</strong> wydał i będzie wydawał wyłącznie instrukcje zgodne z obowiązującymi przepisami prawa.

### 3. Przetwarzanie przez dostawcę {#3-processing-by-provider}

<strong>Dostawca</strong> będzie przetwarzał Dane Osobowe Klienta wyłącznie zgodnie z niniejszą Umową o przetwarzaniu danych (DPA), w tym ze szczegółami zawartymi na Stronie tytułowej. Jeśli <strong>Dostawca</strong> zaktualizuje Usługę w celu aktualizacji istniejących lub dodania nowych produktów, funkcji lub funkcjonalności, <strong>Dostawca</strong> może zmienić <strong>Kategorie Osób, których Dane dotyczą</strong>, <strong>Kategorie Danych Osobowych</strong>, <strong>Dane Szczególnej Kategorii</strong>, <strong>Ograniczenia lub Zabezpieczenia Danych Szczególnej Kategorii</strong>, <strong>Częstotliwość Przekazywania</strong>, <strong>Charakter i Cel Przetwarzania</strong> oraz <strong>Czas Przetwarzania</strong> w zakresie niezbędnym do odzwierciedlenia aktualizacji, powiadamiając <strong>Klienta</strong> o aktualizacjach i zmianach.

### 4. Przetwarzanie klienta {#4-customer-processing}

W przypadku, gdy <strong>Klient</strong> jest Podmiotem Przetwarzającym, a <strong>Dostawca</strong> jest Podmiotem Podprzetwarzającym, <strong>Klient</strong> będzie przestrzegać wszystkich Obowiązujących Przepisów Prawa mających zastosowanie do Przetwarzania Danych Osobowych Klienta przez <strong>Klienta</strong>. Umowa <strong>Klienta</strong> z jego Administratorem będzie również wymagać od <strong>Klienta</strong> przestrzegania wszystkich Obowiązujących Przepisów Prawa mających zastosowanie do <strong>Klienta</strong> jako Podmiotu Przetwarzającego. Ponadto <strong>Klient</strong> będzie przestrzegać wymogów Podmiotu Podprzetwarzającego zawartych w umowie <strong>Klienta</strong> z jego Administratorem.

### 5. Zgoda na przetwarzanie {#5-consent-to-processing}

<strong>Klient</strong> przestrzegał i będzie nadal przestrzegał wszystkich Obowiązujących przepisów o ochronie danych w zakresie udostępniania Danych osobowych Klienta <strong>Dostawcy</strong> i/lub Usługi, w tym dokonywania wszystkich ujawnień, uzyskiwania wszystkich zgód, zapewniania odpowiednich możliwości wyboru i wdrażania odpowiednich zabezpieczeń wymaganych na mocy Obowiązujących przepisów o ochronie danych.

### 6. Podprocesory {#6-subprocessors}

a. <strong>Dostawca</strong> nie będzie dostarczał, przekazywał ani przekazywał żadnych Danych Osobowych Klienta Podmiotowi Przetwarzającemu, chyba że <strong>Klient</strong> zatwierdzi Podmiot Przetwarzający. Aktualna lista <strong>Zatwierdzonych Podmiotów Przetwarzających</strong> zawiera tożsamość Podmiotów Przetwarzających, ich kraj zamieszkania oraz przewidywane zadania Przetwarzania. <strong>Dostawca</strong> poinformuje <strong>Klienta</strong> na piśmie co najmniej 10 dni roboczych wcześniej o wszelkich planowanych zmianach w <strong>Zatwierdzonych Podmiotach Przetwarzających</strong>, niezależnie od tego, czy nastąpi dodanie, czy zastąpienie Podmiotu Przetwarzającego, co pozwoli <strong>Klientowi</strong> na wyrażenie sprzeciwu wobec zmian, zanim <strong>Dostawca</strong> zacznie korzystać z nowych Podmiotów Przetwarzających. <strong>Dostawca</strong> przekaże <strong>Klientowi</strong> informacje niezbędne do umożliwienia Klientowi</strong> skorzystania z prawa do sprzeciwu wobec zmiany <strong>Zatwierdzonych Podmiotów Przetwarzających</strong>. <strong>Klient</strong> ma 30 dni od powiadomienia o zmianie <strong>Zatwierdzonych Podmiotów Przetwarzających</strong> na zgłoszenie sprzeciwu, w przeciwnym razie uznaje się, że <strong>Klient</strong> akceptuje zmiany. Jeżeli <strong>Klient</strong> zgłosi sprzeciw wobec zmiany w ciągu 30 dni od powiadomienia, <strong>Klient</strong> i <strong>Dostawca</strong> będą współpracować w dobrej wierze w celu rozwiązania sprzeciwu lub wątpliwości <strong>Klienta</strong>.

b. W przypadku angażowania Podmiotu Przetwarzającego, <strong>Dostawca</strong> zawrze z Podmiotem Przetwarzającym pisemną umowę, która zagwarantuje, że Podmiot Przetwarzający będzie uzyskiwał dostęp do Danych Osobowych Klienta i korzystał z nich wyłącznie (i) w zakresie wymaganym do wykonania zobowiązań podzleconych mu podwykonawcom oraz (ii) zgodnie z warunkami <strong>Umowy</strong>.

c. Jeżeli RODO ma zastosowanie do Przetwarzania Danych Osobowych Klienta, (i) obowiązki ochrony danych opisane w niniejszym DPA (o których mowa w art. 28 ust. 3 RODO, jeśli ma to zastosowanie) są również nakładane na Podmiot Przetwarzający oraz (ii) umowa <strong>Dostawcy</strong> z Podmiotem Przetwarzającym będzie uwzględniać te obowiązki, w tym szczegółowe informacje o tym, w jaki sposób <strong>Dostawca</strong> i jego Podmiot Przetwarzający będą współpracować w celu udzielania odpowiedzi na zapytania lub prośby dotyczące Przetwarzania Danych Osobowych Klienta. Ponadto <strong>Dostawca</strong> udostępni na żądanie <strong>Klienta</strong> kopię swoich umów (wraz z wszelkimi zmianami) ze swoimi Podmiotami Przetwarzającymi. W zakresie niezbędnym do ochrony tajemnic handlowych lub innych poufnych informacji, w tym danych osobowych, <strong>Dostawca</strong> może zredagować tekst swojej umowy z Podmiotem Przetwarzającym przed udostępnieniem kopii.

d. <strong>Dostawca</strong> ponosi pełną odpowiedzialność za wszystkie zobowiązania zlecone podwykonawcom, w tym za działania i zaniechania podwykonawców w zakresie przetwarzania danych osobowych klienta. <strong>Dostawca</strong> powiadomi Klienta o każdym przypadku niewypełnienia przez podwykonawców istotnych zobowiązań dotyczących danych osobowych klienta wynikających z umowy pomiędzy <strong>Dostawcą</strong> a podwykonawcą.

## 3. Ograniczone transfery {#3-restricted-transfers}

### 1. Autoryzacja {#1-authorization}

<strong>Klient</strong> wyraża zgodę na to, że <strong>Dostawca</strong> może przekazywać Dane Osobowe Klienta poza EOG, Wielką Brytanię lub inne odpowiednie terytorium geograficzne, w zakresie niezbędnym do świadczenia Usługi. Jeżeli <strong>Dostawca</strong> przekaże Dane Osobowe Klienta na terytorium, dla którego Komisja Europejska lub inny właściwy organ nadzorczy nie wydał decyzji stwierdzającej odpowiedni stopień ochrony, <strong>Dostawca</strong> wdroży odpowiednie zabezpieczenia dotyczące przekazywania Danych Osobowych Klienta na to terytorium, zgodnie z obowiązującymi przepisami o ochronie danych.

### 2. Transfery z byłego EOG {#2-ex-eea-transfers}

<strong>Klient</strong> i <strong>Dostawca</strong> zgadzają się, że jeśli RODO chroni przekazywanie Danych Osobowych Klienta, przekazywanie odbywa się od <strong>Klienta</strong> z obszaru EOG do <strong>Dostawcy</strong> spoza EOG i przekazywanie nie jest regulowane decyzją Komisji Europejskiej w sprawie adekwatności, wówczas poprzez zawarcie niniejszej Umowy o Ochronie Danych, <strong>Klient</strong> i <strong>Dostawca</strong> uznawani są za podpisujących Standardy Ubezpieczeń EOG wraz z załącznikami, które są włączone przez odniesienie. Każde takie przekazanie odbywa się zgodnie ze Standardami Ubezpieczeń EOG, które są uzupełniane w następujący sposób:

a. Moduł drugi (Od administratora do podmiotu przetwarzającego) Standardowych Klauzuli Umownych EOG ma zastosowanie, gdy <strong>Klient</strong> jest administratorem, a <strong>Dostawca</strong> przetwarza dane osobowe klienta dla <strong>Klienta</strong> jako podmiot przetwarzający.

b. Moduł trzeci (Podmiot przetwarzający do podprzetwarzającego) Standardowych Klauzuli Umownych EOG ma zastosowanie, gdy <strong>Klient</strong> jest Podmiotem przetwarzającym, a <strong>Dostawca</strong> przetwarza Dane osobowe Klienta w imieniu <strong>Klienta</strong> jako Podprzetwarzający.

c. W przypadku każdego modułu obowiązuje (jeśli ma to zastosowanie):

1. Opcjonalna klauzula dokowania zawarta w klauzuli 7 nie ma zastosowania;

2. W przypadku Klauzuli 9 zastosowanie ma Opcja 2 (ogólne pisemne upoważnienie), a minimalny okres na wcześniejsze powiadomienie o zmianach Podmiotu Przetwarzającego wynosi 10 dni roboczych;

3. W klauzuli 11 język opcjonalny nie ma zastosowania;

4. Usuwa się wszystkie nawiasy kwadratowe w punkcie 13;

5. W punkcie 17 (Opcja 1) Standardowe klauzule umowne EOG będą podlegać prawu <strong>Państwa członkowskiego sprawującego władzę</strong>;

6. W przypadku postanowień ust. 18 lit. b) spory będą rozstrzygane przez sądy <strong>Państwa członkowskiego sprawującego władzę</strong>; i

7. Strona tytułowa niniejszej Umowy o ochronie danych osobowych zawiera informacje wymagane w Załączniku I, Załączniku II i Załączniku III Standardów Ubezpieczeń EOG.

### 3. Transfery poza Wielką Brytanię {#3-ex-uk-transfers}

<strong>Klient</strong> i <strong>Dostawca</strong> zgadzają się, że jeśli brytyjskie rozporządzenie RODO chroni transfer Danych Osobowych Klienta, transfer odbywa się od <strong>Klienta</strong> z terytorium Zjednoczonego Królestwa do <strong>Dostawcy</strong> spoza Zjednoczonego Królestwa i transfer nie jest regulowany decyzją o adekwatności podjętą przez Sekretarza Stanu Zjednoczonego Królestwa, wówczas poprzez zawarcie niniejszej Umowy o Ochronie Danych, <strong>Klient</strong> i <strong>Dostawca</strong> są uznawani za podpisujących Aneks do Umowy o Ochronie Danych Osobowych Zjednoczonego Królestwa wraz z załącznikami, które są włączone przez odniesienie. Każde takie przeniesienie odbywa się zgodnie z Aneksem do Umowy o Ochronie Danych Osobowych Zjednoczonego Królestwa, który jest uzupełniony w następujący sposób:

a. Sekcja 3.2 niniejszej Umowy o przetwarzaniu danych osobowych zawiera informacje wymagane w Tabeli 2 Aneksu dla Wielkiej Brytanii.

b. Tabela 4 Aneksu dla Wielkiej Brytanii zostaje zmieniona w następujący sposób: Żadna ze stron nie może wypowiedzieć Aneksu dla Wielkiej Brytanii zgodnie z postanowieniami Sekcji 19 Aneksu dla Wielkiej Brytanii; w zakresie, w jakim ICO wyda zmieniony Zatwierdzony Aneks na podstawie Sekcji 18 Aneksu dla Wielkiej Brytanii, strony będą działać w dobrej wierze, aby odpowiednio zmienić niniejszą Umowę o partnerstwie gospodarczym.

c. Strona tytułowa zawiera informacje wymagane w Załączniku 1A, Załączniku 1B, Załączniku II i Załączniku III Dodatku dla Wielkiej Brytanii.

### 4. Inne przelewy międzynarodowe {#4-other-international-transfers}

W przypadku przekazywania danych osobowych, w przypadku którego do międzynarodowego charakteru przekazywania stosuje się prawo szwajcarskie (a nie prawo żadnego państwa członkowskiego EOG ani Zjednoczonego Królestwa), odniesienia do RODO w klauzuli 4 Standardowych Klauzul Ochronnych EOG zostają, w zakresie wymaganym prawnie, zmienione na odniesienia do szwajcarskiej federalnej ustawy o ochronie danych lub jej następcy, a koncepcja organu nadzorczego będzie obejmować szwajcarskiego federalnego komisarza ds. ochrony danych i informacji.

## 4. Reakcja na incydenty bezpieczeństwa {#4-security-incident-response}

1. Po uzyskaniu wiedzy o jakimkolwiek Incydencie Bezpieczeństwa, <strong>Dostawca</strong>: (a) powiadomi <strong>Klienta</strong> bez zbędnej zwłoki, jeśli to możliwe, jednak nie później niż 72 godziny po uzyskaniu wiedzy o Incydencie Bezpieczeństwa; (b) przekaże aktualne informacje o Incydencie Bezpieczeństwa, w miarę jak będzie on znany lub na uzasadnione żądanie <strong>Klienta</strong>; oraz (c) niezwłocznie podejmie uzasadnione kroki w celu ograniczenia i zbadania Incydentu Bezpieczeństwa. Powiadomienie <strong>Dostawcy</strong> o Incydencie Bezpieczeństwa lub reakcja na Incydent Bezpieczeństwa zgodnie z wymogami niniejszej Umowy o przetwarzaniu danych nie będą interpretowane jako potwierdzenie przez <strong>Dostawcę</strong> jakiejkolwiek winy lub odpowiedzialności za Incydent Bezpieczeństwa.

## 5. Audyt i raporty {#5-audit--reports}

### 1. Uprawnienia audytu {#1-audit-rights}

<strong>Dostawca</strong> przekaże <strong>Klientowi</strong> wszelkie informacje w uzasadniony sposób niezbędne do wykazania zgodności z niniejszą Umową o ochronie danych osobowych (DPA), a także umożliwi i przyczyni się do przeprowadzenia audytów, w tym inspekcji przeprowadzanych przez <strong>Klienta</strong>, w celu oceny zgodności <strong>Dostawcy</strong> z niniejszą Umową o ochronie danych osobowych. <strong>Dostawca</strong> może jednak ograniczyć dostęp do danych lub informacji, jeśli dostęp <strong>Klienta</strong> do informacji mógłby negatywnie wpłynąć na prawa własności intelektualnej <strong>Dostawcy</strong>, zobowiązania do zachowania poufności lub inne zobowiązania wynikające z Obowiązujących Przepisów. <strong>Klient</strong> przyjmuje do wiadomości i zgadza się, że będzie korzystał ze swoich praw do audytu wynikających z niniejszej Umowy o ochronie danych osobowych oraz wszelkich praw do audytu przyznanych przez Obowiązujące Przepisy o Ochronie Danych Osobowych wyłącznie poprzez polecenie <strong>Dostawcy</strong> przestrzegania poniższych wymogów dotyczących raportowania i należytej staranności. <strong>Dostawca</strong> będzie przechowywać dokumentację dotyczącą przestrzegania postanowień niniejszej Umowy o przetwarzaniu danych przez 3 lata od zakończenia obowiązywania Umowy o przetwarzaniu danych.

### 2. Raporty bezpieczeństwa {#2-security-reports}

<strong>Klient</strong> przyjmuje do wiadomości, że <strong>Dostawca</strong> jest regularnie audytowany pod kątem standardów określonych w <strong>Polityce Bezpieczeństwa</strong> przez niezależnych audytorów zewnętrznych. Na pisemną prośbę <strong>Dostawca</strong> przekaże <strong>Klientowi</strong>, w sposób poufny, skróconą kopię swojego aktualnego Raportu, aby <strong>Klient</strong> mógł zweryfikować zgodność <strong>Dostawcy</strong> ze standardami określonymi w <strong>Polityce Bezpieczeństwa</strong>.

### 3. Należyta staranność w zakresie bezpieczeństwa {#3-security-due-diligence}

Oprócz Raportu, <strong>Dostawca</strong> odpowie na uzasadnione prośby o informacje składane przez <strong>Klienta</strong> w celu potwierdzenia przestrzegania przez <strong>Dostawcę</strong> niniejszej Umowy o ochronie danych, w tym odpowiedzi na pytania dotyczące bezpieczeństwa informacji, należytej staranności i kwestionariuszy audytowych, lub poprzez udzielenie dodatkowych informacji na temat programu bezpieczeństwa informacji. Wszystkie takie prośby muszą być sporządzone w formie pisemnej i przekazane <strong>Kontaktowi ds. Bezpieczeństwa Dostawcy</strong>, a ich składanie może odbywać się tylko raz w roku.

## 6. Koordynacja i współpraca {#6-coordination--cooperation}

### 1. Odpowiedź na zapytania {#1-response-to-inquiries}

Jeśli <strong>Dostawca</strong> otrzyma jakiekolwiek zapytanie lub prośbę od kogokolwiek innego dotyczące Przetwarzania Danych Osobowych Klienta, <strong>Dostawca</strong> powiadomi <strong>Klienta</strong> o tym zapytaniu i nie odpowie na nie bez uprzedniej zgody <strong>Klienta</strong>. Przykładami takich zapytań i próśb są nakaz sądowy, administracyjny lub regulacyjny dotyczący Danych Osobowych Klienta, o ile powiadomienie <strong>Klienta</strong> nie jest zabronione przez Obowiązujące Prawo, lub żądanie osoby, której dane dotyczą. Jeżeli jest to dozwolone przez Obowiązujące Prawo, <strong>Dostawca</strong> zastosuje się do uzasadnionych instrukcji <strong>Klienta</strong> dotyczących tych próśb, w tym do przekazywania aktualizacji statusu i innych informacji zasadnie żądanych przez <strong>Klienta</strong>. Jeżeli osoba, której dane dotyczą, złoży uzasadniony wniosek na podstawie Obowiązujących Przepisów o Ochronie Danych o usunięciu lub rezygnacji z udostępniania przez <strong>Klienta</strong> Danych Osobowych Klienta <strong>Dostawcy</strong>, <strong>Dostawca</strong> pomoże <strong>Klientowi</strong> w spełnieniu wniosku zgodnie z Obowiązującymi Przepisami o Ochronie Danych. <strong>Dostawca</strong> będzie współpracować z <strong>Klientem</strong> i zapewni mu uzasadnioną pomoc, na koszt <strong>Klienta</strong>, w przypadku wszelkich odpowiedzi prawnych lub innych działań proceduralnych podejmowanych przez <strong>Klienta</strong> w odpowiedzi na wniosek strony trzeciej dotyczący przetwarzania przez <strong>Dostawcę</strong> Danych Osobowych Klienta na mocy niniejszej Umowy o Ochronie Danych.

### 2. Oceny skutków dla ochrony danych (DPIA) i oceny skutków dla ochrony danych (DTIA) {#2-dpias-and-dtias}

Jeżeli wymagają tego obowiązujące przepisy o ochronie danych, <strong>Dostawca</strong> w rozsądnym stopniu pomoże <strong>Klientowi</strong> w przeprowadzeniu obowiązkowych ocen skutków dla ochrony danych lub ocen skutków dla przekazywania danych oraz konsultacji z właściwymi organami ochrony danych, biorąc pod uwagę charakter Przetwarzania i Danych osobowych Klienta.

## 7. Usuwanie danych osobowych klienta {#7-deletion-of-customer-personal-data}

### 1. Usunięcie przez Klienta {#1-deletion-by-customer}

<strong>Dostawca</strong> umożliwi <strong>Klientowi</strong> usunięcie Danych Osobowych Klienta w sposób zgodny z funkcjonalnością Usług. <strong>Dostawca</strong> zastosuje się do tego polecenia tak szybko, jak będzie to praktycznie możliwe, chyba że obowiązujące prawo wymaga dalszego przechowywania Danych Osobowych Klienta.

### 2. Usunięcie po wygaśnięciu DPA {#2-deletion-at-dpa-expiration}

a. Po wygaśnięciu Umowy o przetwarzaniu danych osobowych, <strong>Dostawca</strong> zwróci lub usunie Dane Osobowe Klienta na polecenie <strong>Klienta</strong>, chyba że dalsze przechowywanie Danych Osobowych Klienta jest wymagane lub dozwolone przez Obowiązujące Prawo. Jeżeli zwrot lub zniszczenie Danych Osobowych Klienta jest niewykonalne lub zabronione przez Obowiązujące Prawo, <strong>Dostawca</strong> dołoży uzasadnionych starań, aby zapobiec dalszemu Przetwarzaniu Danych Osobowych Klienta i będzie nadal chronić Dane Osobowe Klienta pozostające w jego posiadaniu, pieczy lub kontroli. Na przykład Obowiązujące Prawo może wymagać od <strong>Dostawcy</strong> dalszego hostowania lub Przetwarzania Danych Osobowych Klienta.

b. Jeżeli <strong>Klient</strong> i <strong>Dostawca</strong> przystąpili do Standardów Ubezpieczeń EOG lub Aneksu dla Wielkiej Brytanii w ramach niniejszej Umowy o ochronie danych osobowych, <strong>Dostawca</strong> wyda <strong>Klientowi</strong> certyfikat usunięcia Danych Osobowych opisany w Klauzuli 8.1(d) i Klauzuli 8.5 Standardów Ubezpieczeń EOG wyłącznie na prośbę <strong>Klienta</strong>.

## 8. Ograniczenie odpowiedzialności {#8-limitation-of-liability}

### 1. Limity odpowiedzialności i zrzeczenie się odszkodowań {#1-liability-caps-and-damages-waiver}

**W maksymalnym zakresie dozwolonym na mocy obowiązujących przepisów o ochronie danych, całkowita skumulowana odpowiedzialność każdej ze stron wobec drugiej strony wynikająca z niniejszej Umowy o ochronie danych osobowych lub z nią związana będzie podlegać zrzeczeniom, wyłączeniom i ograniczeniom odpowiedzialności określonym w <strong>Umowie</strong>.**

### 2. Roszczenia podmiotów powiązanych {#2-related-party-claims}

**Wszelkie roszczenia wobec <strong>Dostawcy</strong> lub jego Podmiotów stowarzyszonych wynikające z niniejszej Umowy o partnerstwie gospodarczym lub z nią związane mogą być wnoszone wyłącznie przez <strong>Klienta</strong> będącego stroną <strong>Umowy</strong>.**

### 3. Wyjątki {#3-exceptions}

1. Niniejsza Umowa o Ochronie Danych Osobowych nie ogranicza odpowiedzialności osoby fizycznej za jej prawa do ochrony danych osobowych wynikające z Obowiązujących Przepisów o Ochronie Danych Osobowych. Ponadto, niniejsza Umowa o Ochronie Danych Osobowych nie ogranicza odpowiedzialności stron za naruszenia Standardów Ubezpieczeń EOG ani Dodatku dla Wielkiej Brytanii.

## 9. Konflikty między dokumentami {#9-conflicts-between-documents}

1. Niniejsza Umowa o Porozumieniu o Poufności stanowi część Umowy i ją uzupełnia. W przypadku jakichkolwiek rozbieżności między niniejszą Umową o Poufności, <strong>Umową</strong> lub którąkolwiek z ich części, część wymieniona wcześniej będzie miała pierwszeństwo przed częścią wymienioną później w zakresie tych rozbieżności: (1) Standardami Umów EOG lub Dodatkiem dla Wielkiej Brytanii, (2) niniejszą Umową o Porozumieniu o Poufności, a następnie (3) <strong>Umową</strong>.

## 10. Okres obowiązywania umowy {#10-term-of-agreement}

Niniejsza Umowa o Porozumieniu ...

## 11. Prawo właściwe i wybrane sądy {#11-governing-law-and-chosen-courts}

Niezależnie od prawa właściwego lub podobnych klauzul <strong>Umowy</strong>, wszelkie interpretacje i spory dotyczące niniejszej Umowy DPA będą podlegać prawu <strong>Państwa Właściwego</strong>, bez względu na jego przepisy kolizyjne. Ponadto, niezależnie od wyboru forum, jurysdykcji lub podobnych klauzul <strong>Umowy</strong>, strony zgadzają się wnosić wszelkie pozwy, działania lub postępowania dotyczące niniejszej Umowy DPA do sądów <strong>Państwa Właściwego</strong>, a każda ze stron nieodwołalnie poddaje się wyłącznej jurysdykcji sądów <strong>Państwa Właściwego</strong>.

## 12. Relacja dostawcy usług {#12-service-provider-relationship}

W zakresie, w jakim ma zastosowanie ustawa California Consumer Privacy Act, Kodeks cywilny Kalifornii § 1798.100 i następne („CCPA”), strony przyjmują do wiadomości i zgadzają się, że <strong>Dostawca</strong> jest dostawcą usług i otrzymuje Dane Osobowe od <strong>Klienta</strong> w celu świadczenia Usługi zgodnie z postanowieniami <strong>Umowy</strong>, co stanowi cel biznesowy. <strong>Dostawca</strong> nie będzie sprzedawał żadnych Danych Osobowych przekazanych przez <strong>Klienta</strong> na mocy <strong>Umowy</strong>. Ponadto <strong>Dostawca</strong> nie będzie przechowywał, wykorzystywał ani ujawniał żadnych Danych Osobowych przekazanych przez <strong>Klienta</strong> na mocy <strong>Umowy</strong>, z wyjątkiem sytuacji niezbędnych do świadczenia Usługi dla <strong>Klienta</strong>, zgodnie z postanowieniami <strong>Umowy</strong> lub zgodnie z obowiązującymi przepisami o ochronie danych. <strong>Dostawca</strong> oświadcza, że rozumie ograniczenia zawarte w niniejszym paragrafie.

## 13. Definicje {#13-definitions}

1. **Obowiązujące przepisy prawa** oznaczają przepisy prawa, zasady, regulacje, zarządzenia sądowe i inne wiążące wymogi właściwych organów rządowych, które mają zastosowanie do strony lub regulują jej działalność.

2. **Obowiązujące przepisy o ochronie danych** oznaczają obowiązujące przepisy, które regulują sposób, w jaki Usługa może przetwarzać lub wykorzystywać dane osobowe danej osoby, dane osobowe, dane umożliwiające identyfikację osoby lub inne podobne terminy.

3. Termin „Administrator” ma znaczenie nadane mu w obowiązujących przepisach o ochronie danych osobowych w odniesieniu do spółki, która ustala cel i zakres przetwarzania danych osobowych.

4. **„Strona tytułowa”** oznacza dokument podpisany lub elektronicznie zaakceptowany przez strony, który zawiera niniejsze Standardowe warunki DPA i identyfikuje <strong>Dostawcę</strong>, <strong>Klienta</strong> oraz przedmiot i szczegóły przetwarzania danych.

5. **„Dane osobowe Klienta”** oznaczają Dane osobowe, które <strong>Klient</strong> przesyła lub dostarcza <strong>Dostawcy</strong> w ramach Usługi i które podlegają niniejszej Umowie o przetwarzaniu danych.

6. **„DPA”** oznacza niniejsze Standardowe Warunki DPA, Stronę tytułową pomiędzy <strong>Dostawcą</strong> a <strong>Klientem</strong> oraz zasady i dokumenty, do których odniesiono się na Stronie tytułowej lub które są do niej załączone.

7. **„Standardowe klauzule umowne EOG”** oznaczają standardowe klauzule umowne załączone do decyzji wykonawczej Komisji Europejskiej 2021/914 z dnia 4 czerwca 2021 r. w sprawie standardowych klauzul umownych dotyczących przekazywania danych osobowych do państw trzecich zgodnie z rozporządzeniem Parlamentu Europejskiego i Rady (UE) 2016/679.

8. **„Europejski Obszar Gospodarczy”** lub **„EOG”** oznacza państwa członkowskie Unii Europejskiej, Norwegię, Islandię i Liechtenstein.

9. **„RODO”** oznacza Rozporządzenie Unii Europejskiej 2016/679 wdrożone prawem lokalnym w danym państwie członkowskim EOG.

10. Termin „Dane osobowe” ma znaczenie nadane mu w obowiązujących przepisach o ochronie danych osobowych w odniesieniu do informacji osobowych, danych osobowych lub innych podobnych terminów.

11. Termin „Przetwarzanie” lub „Proces” ma znaczenie nadane w obowiązujących przepisach o ochronie danych w odniesieniu do jakiegokolwiek wykorzystania lub wykonania operacji komputerowej na Danych osobowych, w tym przy użyciu metod automatycznych.

12. Termin „Podmiot przetwarzający” ma znaczenie nadane mu w obowiązujących przepisach o ochronie danych osobowych w odniesieniu do firmy przetwarzającej dane osobowe w imieniu Administratora.

13. **„Raport”** oznacza raporty z audytu sporządzone przez inną firmę zgodnie ze standardami określonymi w Polityce Bezpieczeństwa w imieniu Dostawcy.

14. **„Ograniczone przekazywanie”** oznacza (a) w przypadku zastosowania RODO, przekazywanie danych osobowych z EOG do kraju spoza EOG, który nie podlega ustaleniu odpowiedniego stopnia ochrony przez Komisję Europejską; oraz (b) w przypadku zastosowania brytyjskiego RODO, przekazywanie danych osobowych ze Zjednoczonego Królestwa do dowolnego innego kraju, który nie podlega przepisom dotyczącym odpowiedniego stopnia ochrony przyjętym zgodnie z Sekcją 17A Ustawy o ochronie danych osobowych w Wielkiej Brytanii z 2018 r.

15. **Incydent bezpieczeństwa** oznacza naruszenie danych osobowych w rozumieniu artykułu 4 RODO.

16. **Usługa** oznacza produkt i/lub usługi opisane w <strong>Umowie</strong>.

17. **Dane szczególnej kategorii** mają znaczenie nadane w artykule 9 RODO.

18. Termin „Podprocesor” ma znaczenie nadane mu w obowiązujących przepisach o ochronie danych w odniesieniu do firmy, która za zgodą i akceptacją Kontrolera pomaga Podmiotowi Przetwarzającemu w Przetwarzaniu Danych Osobowych w imieniu Kontrolera.

19. **„RODO w Wielkiej Brytanii”** oznacza Rozporządzenie Unii Europejskiej 2016/679 wdrożone na mocy sekcji 3 Ustawy Zjednoczonego Królestwa o wystąpieniu z Unii Europejskiej z 2018 r. w Zjednoczonym Królestwie.

20. **„Dodatek brytyjski”** oznacza międzynarodowy dodatek dotyczący transferu danych do Standardów Umownych EOG, wydany przez Komisarza ds. Informacji dla Stron dokonujących ograniczonych transferów danych na mocy art. 119A(1) Ustawy o ochronie danych z 2018 r.

## Kredyty {#credits}

Niniejszy dokument jest pochodną dokumentu [Standardowe warunki umowy DPA (wersja 1.0)](https://commonpaper.com/standards/data-processing-agreement/1.0) i jest licencjonowany na zasadach [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).