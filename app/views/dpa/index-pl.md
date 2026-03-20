# Umowa o Przetwarzaniu Danych {#data-processing-agreement}

<!-- v1.0 from <https://github.com/CommonPaper/DPA> -->

<img loading="lazy" src="/img/articles/dpa.webp" alt="Forward Email data processing agreement" class="rounded-lg" />


## Spis Treści {#table-of-contents}

* [Kluczowe Terminy](#key-terms)
* [Zmiany w Umowie](#changes-to-the-agreement)
* [1. Relacje między Podmiotem Przetwarzającym a Podmiotem Przetwarzającym Danych](#1-processor-and-subprocessor-relationships)
  * [1. Dostawca jako Podmiot Przetwarzający](#1-provider-as-processor)
  * [2. Dostawca jako Podmiot Przetwarzający Danych](#2-provider-as-subprocessor)
* [2. Przetwarzanie](#2-processing)
  * [1. Szczegóły Przetwarzania](#1-processing-details)
  * [2. Instrukcje Przetwarzania](#2-processing-instructions)
  * [3. Przetwarzanie przez Dostawcę](#3-processing-by-provider)
  * [4. Przetwarzanie przez Klienta](#4-customer-processing)
  * [5. Zgoda na Przetwarzanie](#5-consent-to-processing)
  * [6. Podmioty Przetwarzające Danych](#6-subprocessors)
* [3. Ograniczone Transfery](#3-restricted-transfers)
  * [1. Autoryzacja](#1-authorization)
  * [2. Transfery poza EOG](#2-ex-eea-transfers)
  * [3. Transfery poza UK](#3-ex-uk-transfers)
  * [4. Inne Transfery Międzynarodowe](#4-other-international-transfers)
* [4. Reakcja na Incydenty Bezpieczeństwa](#4-security-incident-response)
* [5. Audyt i Raporty](#5-audit--reports)
  * [1. Prawa Audytu](#1-audit-rights)
  * [2. Raporty Bezpieczeństwa](#2-security-reports)
  * [3. Należyta Staranność Bezpieczeństwa](#3-security-due-diligence)
* [6. Koordynacja i Współpraca](#6-coordination--cooperation)
  * [1. Odpowiedź na Zapytania](#1-response-to-inquiries)
  * [2. DPIA i DTIA](#2-dpias-and-dtias)
* [7. Usuwanie Danych Osobowych Klienta](#7-deletion-of-customer-personal-data)
  * [1. Usuwanie przez Klienta](#1-deletion-by-customer)
  * [2. Usuwanie po Wygaśnięciu Umowy](#2-deletion-at-dpa-expiration)
* [8. Ograniczenie Odpowiedzialności](#8-limitation-of-liability)
  * [1. Limity Odpowiedzialności i Zrzeczenie się Roszczeń](#1-liability-caps-and-damages-waiver)
  * [2. Roszczenia Stron Powiązanych](#2-related-party-claims)
  * [3. Wyjątki](#3-exceptions)
* [9. Konflikty między Dokumentami](#9-conflicts-between-documents)
* [10. Okres Obowiązywania Umowy](#10-term-of-agreement)
* [11. Prawo Właściwe i Wybrane Sądy](#11-governing-law-and-chosen-courts)
* [12. Relacja z Dostawcą Usług](#12-service-provider-relationship)
* [13. Definicje](#13-definitions)
* [Podziękowania](#credits)


## Kluczowe Terminy {#key-terms}

| Termin                                     | Wartość                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <strong>Umowa</strong>                      | Niniejsza DPA uzupełnia [Warunki Świadczenia Usług](/terms)                                                                                                                                                                                                                                                                                                                                                                                                                        |
| <strong>Zatwierdzeni Podmioty Przetwarzające Danych</strong> | [Cloudflare](https://cloudflare.com) (USA; dostawca DNS, sieci i bezpieczeństwa), [DataPacket](https://www.datapacket.com/) (USA/UK; dostawca hostingu), [Digital Ocean](https://digitalocean.com) (USA; dostawca hostingu), [GitHub](https://github.com) (USA; hosting kodu źródłowego, CI/CD i zarządzanie projektami), [Vultr](https://www.vultr.com) (USA; dostawca hostingu), [Stripe](https://stripe.com) (USA; procesor płatności), [PayPal](https://paypal.com) (USA; procesor płatności) |
| <strong>Kontakt Bezpieczeństwa Dostawcy</strong> | <a href="mailto:security@forwardemail.net"><security@forwardemail.net></a>                                                                                                                                                                                                                                                                                                                                                                                                        |
| <strong>Polityka Bezpieczeństwa</strong>   | Zobacz [naszą Politykę Bezpieczeństwa na GitHub](https://github.com/forwardemail/forwardemail.net/security/policy)                                                                                                                                                                                                                                                                                                                                                                |
| <strong>Prawo Właściwe</strong>             | Stan Delaware, Stany Zjednoczone                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
## Zmiany w Umowie {#changes-to-the-agreement}

Niniejszy dokument jest pochodną [Common Paper DPA Standard Terms (Wersja 1.0)](https://commonpaper.com/standards/data-processing-agreement/1.0) i wprowadzono następujące zmiany:

1. [Prawo właściwe i wybrane sądy](#11-governing-law-and-chosen-courts) zostały uwzględnione jako sekcja poniżej z określonym powyżej `Państwem właściwym`.
2. [Relacja Dostawca Usług](#12-service-provider-relationship) została uwzględniona jako sekcja poniżej.


## 1. Relacje między Administratorem a Podmiotem przetwarzającym {#1-processor-and-subprocessor-relationships}

### 1. Dostawca jako Podmiot przetwarzający {#1-provider-as-processor}

W sytuacjach, gdy <strong>Klient</strong> jest Administratorem Danych Osobowych Klienta, <strong>Dostawca</strong> będzie uważany za Podmiot przetwarzający, który przetwarza Dane Osobowe w imieniu <strong>Klienta</strong>.

### 2. Dostawca jako Podmiot przetwarzający dane dalej {#2-provider-as-subprocessor}

W sytuacjach, gdy <strong>Klient</strong> jest Podmiotem przetwarzającym Dane Osobowe Klienta, <strong>Dostawca</strong> będzie uważany za Podmiot przetwarzający dane dalej Danych Osobowych Klienta.


## 2. Przetwarzanie {#2-processing}

### 1. Szczegóły przetwarzania {#1-processing-details}

Załącznik I(B) na Stronie tytułowej opisuje przedmiot, charakter, cel i czas trwania tego Przetwarzania, a także <strong>Kategorie Danych Osobowych</strong> zbieranych oraz <strong>Kategorie Podmiotów danych</strong>.

### 2. Instrukcje dotyczące przetwarzania {#2-processing-instructions}

<strong>Klient</strong> zleca <strong>Dostawcy</strong> przetwarzanie Danych Osobowych Klienta: (a) w celu świadczenia i utrzymania Usługi; (b) zgodnie z dalszymi specyfikacjami wynikającymi z korzystania z Usługi przez <strong>Klienta</strong>; (c) zgodnie z dokumentacją w <strong>Umowie</strong>; oraz (d) zgodnie z innymi pisemnymi instrukcjami przekazanymi przez <strong>Klienta</strong> i potwierdzonymi przez <strong>Dostawcę</strong> dotyczącymi przetwarzania Danych Osobowych Klienta na mocy niniejszej DPA. <strong>Dostawca</strong> będzie przestrzegać tych instrukcji, chyba że prawo obowiązujące zabrania mu tego. <strong>Dostawca</strong> niezwłocznie poinformuje <strong>Klienta</strong>, jeśli nie będzie w stanie wykonać instrukcji dotyczących przetwarzania. <strong>Klient</strong> wydał i będzie wydawał tylko instrukcje zgodne z obowiązującym prawem.

### 3. Przetwarzanie przez Dostawcę {#3-processing-by-provider}

<strong>Dostawca</strong> będzie przetwarzać Dane Osobowe Klienta wyłącznie zgodnie z niniejszą DPA, w tym szczegółami na Stronie tytułowej. Jeśli <strong>Dostawca</strong> zaktualizuje Usługę, aby zaktualizować istniejące lub dodać nowe produkty, funkcje lub funkcjonalności, <strong>Dostawca</strong> może zmienić <strong>Kategorie Podmiotów danych</strong>, <strong>Kategorie Danych Osobowych</strong>, <strong>Dane szczególnej kategorii</strong>, <strong>Ograniczenia lub zabezpieczenia dotyczące danych szczególnej kategorii</strong>, <strong>Częstotliwość transferu</strong>, <strong>Charakter i cel przetwarzania</strong> oraz <strong>Czas trwania przetwarzania</strong> w razie potrzeby, aby odzwierciedlić aktualizacje, powiadamiając <strong>Klienta</strong> o aktualizacjach i zmianach.

### 4. Przetwarzanie przez Klienta {#4-customer-processing}

Gdy <strong>Klient</strong> jest Podmiotem przetwarzającym, a <strong>Dostawca</strong> jest Podmiotem przetwarzającym dane dalej, <strong>Klient</strong> będzie przestrzegać wszystkich obowiązujących przepisów prawa dotyczących przetwarzania Danych Osobowych Klienta. Umowa <strong>Klienta</strong> z jego Administratorem będzie podobnie wymagać od <strong>Klienta</strong> przestrzegania wszystkich obowiązujących przepisów prawa dotyczących <strong>Klienta</strong> jako Podmiotu przetwarzającego. Ponadto <strong>Klient</strong> będzie przestrzegać wymagań dotyczących Podmiotu przetwarzającego dane dalej zawartych w umowie <strong>Klienta</strong> z jego Administratorem.

### 5. Zgoda na przetwarzanie {#5-consent-to-processing}

<strong>Klient</strong> przestrzegał i będzie nadal przestrzegać wszystkich obowiązujących przepisów o ochronie danych dotyczących przekazywania Danych Osobowych Klienta <strong>Dostawcy</strong> i/lub Usłudze, w tym dokonywania wszystkich ujawnień, uzyskiwania wszystkich zgód, zapewniania odpowiedniego wyboru oraz wdrażania odpowiednich zabezpieczeń wymaganych przez obowiązujące przepisy o ochronie danych.
### 6. Podprocesorzy {#6-subprocessors}

a. <strong>Dostawca</strong> nie będzie udostępniać, przekazywać ani przekazywać żadnych danych osobowych Klienta podprocesorowi, chyba że <strong>Klient</strong> zatwierdził podprocesora. Aktualna lista <strong>Zatwierdzonych Podprocesorów</strong> zawiera tożsamości podprocesorów, ich kraj lokalizacji oraz przewidywane zadania przetwarzania. <strong>Dostawca</strong> poinformuje <strong>Klienta</strong> co najmniej na 10 dni roboczych wcześniej i na piśmie o wszelkich planowanych zmianach w <strong>Zatwierdzonych Podprocesorach</strong>, czy to przez dodanie, czy zastąpienie podprocesora, co pozwala <strong>Klientowi</strong> mieć wystarczająco dużo czasu na zgłoszenie sprzeciwu wobec zmian przed rozpoczęciem korzystania z nowych podprocesorów przez <strong>Dostawcę</strong>. <strong>Dostawca</strong> przekaże <strong>Klientowi</strong> informacje niezbędne do umożliwienia <strong>Klientowi</strong> skorzystania z prawa do sprzeciwu wobec zmiany <strong>Zatwierdzonych Podprocesorów</strong>. <strong>Klient</strong> ma 30 dni od powiadomienia o zmianie <strong>Zatwierdzonych Podprocesorów</strong> na zgłoszenie sprzeciwu, w przeciwnym razie <strong>Klient</strong> zostanie uznany za akceptującego zmiany. Jeśli <strong>Klient</strong> zgłosi sprzeciw wobec zmiany w ciągu 30 dni od powiadomienia, <strong>Klient</strong> i <strong>Dostawca</strong> będą współpracować w dobrej wierze, aby rozwiązać sprzeciw lub obawy <strong>Klienta</strong>.

b. Przy angażowaniu podprocesora <strong>Dostawca</strong> będzie posiadał pisemną umowę z podprocesorem, która zapewnia, że podprocesor uzyskuje dostęp i używa danych osobowych Klienta (i) w zakresie niezbędnym do wykonania powierzonych mu obowiązków, oraz (ii) zgodnie z warunkami <strong>Umowy</strong>.

c. Jeśli RODO ma zastosowanie do przetwarzania danych osobowych Klienta, (i) obowiązki ochrony danych opisane w niniejszej DPA (zgodnie z art. 28 ust. 3 RODO, jeśli ma zastosowanie) są również nakładane na podprocesora, oraz (ii) umowa <strong>Dostawcy</strong> z podprocesorem będzie zawierać te obowiązki, w tym szczegóły dotyczące tego, jak <strong>Dostawca</strong> i jego podprocesor będą koordynować odpowiedzi na zapytania lub żądania dotyczące przetwarzania danych osobowych Klienta. Ponadto <strong>Dostawca</strong> udostępni na żądanie <strong>Klienta</strong> kopię swoich umów (w tym wszelkich aneksów) z podprocesorami. W zakresie niezbędnym do ochrony tajemnic handlowych lub innych informacji poufnych, w tym danych osobowych, <strong>Dostawca</strong> może przed udostępnieniem kopii zredagować tekst swojej umowy z podprocesorem.

d. <strong>Dostawca</strong> pozostaje w pełni odpowiedzialny za wszystkie obowiązki powierzane podprocesorom, w tym za działania i zaniechania podprocesorów w zakresie przetwarzania danych osobowych Klienta. <strong>Dostawca</strong> powiadomi Klienta o wszelkich niepowodzeniach podprocesorów w wypełnianiu istotnych obowiązków dotyczących danych osobowych Klienta na podstawie umowy między <strong>Dostawcą</strong> a podprocesorem.


## 3. Ograniczone transfery {#3-restricted-transfers}

### 1. Upoważnienie {#1-authorization}

<strong>Klient</strong> zgadza się, że <strong>Dostawca</strong> może przekazywać dane osobowe Klienta poza EOG, Wielką Brytanię lub inne odpowiednie terytorium geograficzne, jeśli jest to konieczne do świadczenia Usługi. Jeśli <strong>Dostawca</strong> przekazuje dane osobowe Klienta do terytorium, dla którego Komisja Europejska lub inny właściwy organ nadzorczy nie wydał decyzji o adekwatności, <strong>Dostawca</strong> wdroży odpowiednie zabezpieczenia dla transferu danych osobowych Klienta do tego terytorium zgodnie z obowiązującymi przepisami o ochronie danych.

### 2. Transfery spoza EOG {#2-ex-eea-transfers}

<strong>Klient</strong> i <strong>Dostawca</strong> zgadzają się, że jeśli RODO chroni transfer danych osobowych Klienta, transfer odbywa się od <strong>Klienta</strong> z terytorium EOG do <strong>Dostawcy</strong> spoza EOG, a transfer nie jest regulowany decyzją o adekwatności wydaną przez Komisję Europejską, to zawierając niniejszą DPA, <strong>Klient</strong> i <strong>Dostawca</strong> uznają, że podpisali SCC EOG oraz ich załączniki, które są włączone przez odniesienie. Każdy taki transfer odbywa się na podstawie SCC EOG, które są uzupełniane w następujący sposób:
a. Moduł Drugi (Administrator do Podmiotu Przetwarzającego) EEA SCC ma zastosowanie, gdy <strong>Klient</strong> jest Administratorem, a <strong>Dostawca</strong> przetwarza Dane Osobowe Klienta dla <strong>Klienta</strong> jako Podmiot Przetwarzający.

b. Moduł Trzeci (Podmiot Przetwarzający do Podmiotu Podprzetwarzającego) EEA SCC ma zastosowanie, gdy <strong>Klient</strong> jest Podmiotem Przetwarzającym, a <strong>Dostawca</strong> przetwarza Dane Osobowe Klienta w imieniu <strong>Klienta</strong> jako Podmiot Podprzetwarzający.

c. Dla każdego modułu obowiązuje następujące (jeśli ma zastosowanie):

1. Opcjonalna klauzula dokująca w Klauzuli 7 nie ma zastosowania;

2. W Klauzuli 9 obowiązuje Opcja 2 (ogólne pisemne upoważnienie), a minimalny okres wcześniejszego powiadomienia o zmianach Podpodmiotu Przetwarzającego wynosi 10 dni roboczych;

3. W Klauzuli 11 opcjonalny język nie ma zastosowania;

4. Wszystkie nawiasy kwadratowe w Klauzuli 13 są usunięte;

5. W Klauzuli 17 (Opcja 1) EEA SCC będą regulowane przez prawo <strong>Państwa Członkowskiego Regulującego</strong>;

6. W Klauzuli 18(b) spory będą rozstrzygane przez sądy <strong>Państwa Członkowskiego Regulującego</strong>; oraz

7. Strona tytułowa niniejszej DPA zawiera informacje wymagane w Załączniku I, Załączniku II oraz Załączniku III EEA SCC.

### 3. Transfery spoza UK {#3-ex-uk-transfers}

<strong>Klient</strong> i <strong>Dostawca</strong> zgadzają się, że jeśli UK GDPR chroni transfer Danych Osobowych Klienta, transfer odbywa się od <strong>Klienta</strong> z terytorium Zjednoczonego Królestwa do <strong>Dostawcy</strong> poza terytorium Zjednoczonego Królestwa, a transfer nie jest regulowany decyzją o adekwatności wydaną przez Sekretarza Stanu Zjednoczonego Królestwa, to zawierając niniejszą DPA, <strong>Klient</strong> i <strong>Dostawca</strong> uznają, że podpisali UK Addendum oraz ich Załączniki, które są włączone przez odniesienie. Każdy taki transfer odbywa się na podstawie UK Addendum, które jest wypełnione w następujący sposób:

a. Sekcja 3.2 niniejszej DPA zawiera informacje wymagane w Tabeli 2 UK Addendum.

b. Tabela 4 UK Addendum jest zmodyfikowana następująco: Żadna ze stron nie może zakończyć UK Addendum zgodnie z Sekcją 19 UK Addendum; w zakresie, w jakim ICO wyda zaktualizowane Zatwierdzone Addendum na podstawie Sekcji 18 UK Addendum, strony będą działać w dobrej wierze, aby odpowiednio zmienić niniejszą DPA.

c. Strona tytułowa zawiera informacje wymagane przez Załącznik 1A, Załącznik 1B, Załącznik II oraz Załącznik III UK Addendum.

### 4. Inne transfery międzynarodowe {#4-other-international-transfers}

W przypadku transferów Danych Osobowych, gdzie prawo szwajcarskie (a nie prawo żadnego państwa członkowskiego EOG ani Zjednoczonego Królestwa) ma zastosowanie do międzynarodowego charakteru transferu, odniesienia do RODO w Klauzuli 4 EEA SCC są, w zakresie wymaganym prawnie, zmienione na odniesienia do Szwajcarskiej Federalnej Ustawy o Ochronie Danych lub jej następcy, a pojęcie organu nadzorczego będzie obejmować Szwajcarskiego Federalnego Komisarza ds. Ochrony Danych i Informacji.

## 4. Reakcja na incydenty bezpieczeństwa {#4-security-incident-response}

1. Po uzyskaniu informacji o jakimkolwiek Incydencie Bezpieczeństwa, <strong>Dostawca</strong> będzie: (a) powiadamiać <strong>Klienta</strong> bez zbędnej zwłoki, gdy to możliwe, ale nie później niż 72 godziny po uzyskaniu informacji o Incydencie Bezpieczeństwa; (b) dostarczać terminowe informacje o Incydencie Bezpieczeństwa w miarę ich poznawania lub na rozsądne żądanie <strong>Klienta</strong>; oraz (c) niezwłocznie podejmować rozsądne kroki w celu ograniczenia i zbadania Incydentu Bezpieczeństwa. Powiadomienie lub reakcja <strong>Dostawcy</strong> na Incydent Bezpieczeństwa zgodnie z niniejszą DPA nie będzie interpretowane jako przyznanie się przez <strong>Dostawcę</strong> do jakiejkolwiek winy lub odpowiedzialności za Incydent Bezpieczeństwa.

## 5. Audyt i raporty {#5-audit--reports}

### 1. Prawa audytu {#1-audit-rights}

<strong>Dostawca</strong> przekaże <strong>Klientowi</strong> wszelkie informacje rozsądnie niezbędne do wykazania zgodności z niniejszą DPA oraz umożliwi i przyczyni się do audytów, w tym inspekcji przeprowadzanych przez <strong>Klienta</strong>, w celu oceny zgodności <strong>Dostawcy</strong> z niniejszą DPA. Jednakże <strong>Dostawca</strong> może ograniczyć dostęp do danych lub informacji, jeśli dostęp <strong>Klienta</strong> do tych informacji negatywnie wpłynąłby na prawa własności intelektualnej <strong>Dostawcy</strong>, zobowiązania dotyczące poufności lub inne zobowiązania wynikające z Obowiązujących Przepisów Prawa. <strong>Klient</strong> przyjmuje do wiadomości i zgadza się, że będzie wykonywał swoje prawa audytu na podstawie niniejszej DPA oraz wszelkich praw audytu przyznanych przez Obowiązujące Przepisy o Ochronie Danych wyłącznie poprzez nakazanie <strong>Dostawcy</strong> spełnienia wymagań dotyczących raportowania i należytej staranności określonych poniżej. <strong>Dostawca</strong> będzie przechowywał dokumentację potwierdzającą zgodność z niniejszą DPA przez 3 lata po zakończeniu obowiązywania DPA.
### 2. Raporty Bezpieczeństwa {#2-security-reports}

<strong>Klient</strong> przyjmuje do wiadomości, że <strong>Dostawca</strong> jest regularnie audytowany pod kątem standardów określonych w <strong>Polityce Bezpieczeństwa</strong> przez niezależnych audytorów zewnętrznych. Na pisemne żądanie, <strong>Dostawca</strong> przekaże <strong>Klientowi</strong>, na zasadzie poufności, streszczenie swojej aktualnej wówczas Raportu, aby <strong>Klient</strong> mógł zweryfikować zgodność <strong>Dostawcy</strong> ze standardami określonymi w <strong>Polityce Bezpieczeństwa</strong>.

### 3. Należyta Staranność w Zakresie Bezpieczeństwa {#3-security-due-diligence}

Oprócz Raportu, <strong>Dostawca</strong> odpowie na uzasadnione żądania informacji składane przez <strong>Klienta</strong> w celu potwierdzenia zgodności <strong>Dostawcy</strong> z niniejszą DPA, w tym odpowiedzi na kwestionariusze dotyczące bezpieczeństwa informacji, należytej staranności i audytu, lub poprzez udzielenie dodatkowych informacji o swoim programie bezpieczeństwa informacji. Wszystkie takie żądania muszą być składane na piśmie i kierowane do <strong>Kontakt Bezpieczeństwa Dostawcy</strong> i mogą być składane tylko raz w roku.


## 6. Koordynacja i Współpraca {#6-coordination--cooperation}

### 1. Odpowiedź na Zapytania {#1-response-to-inquiries}

Jeśli <strong>Dostawca</strong> otrzyma jakiekolwiek zapytanie lub żądanie od kogokolwiek innego dotyczące Przetwarzania Danych Osobowych Klienta, <strong>Dostawca</strong> powiadomi <strong>Klienta</strong> o tym żądaniu i <strong>Dostawca</strong> nie udzieli odpowiedzi na to żądanie bez uprzedniej zgody <strong>Klienta</strong>. Przykładami takich zapytań i żądań są nakaz sądowy, administracyjny lub organu regulacyjnego dotyczący Danych Osobowych Klienta, gdy powiadomienie <strong>Klienta</strong> nie jest zabronione przez Obowiązujące Prawo, lub żądanie od osoby, której dane dotyczą. Jeśli Obowiązujące Prawo na to pozwala, <strong>Dostawca</strong> będzie postępować zgodnie z uzasadnionymi instrukcjami <strong>Klienta</strong> dotyczącymi tych żądań, w tym udzielać aktualizacji statusu i innych informacji racjonalnie żądanych przez <strong>Klienta</strong>. Jeśli osoba, której dane dotyczą, złoży ważne żądanie na podstawie Obowiązujących Przepisów o Ochronie Danych dotyczące usunięcia lub rezygnacji z przekazywania Danych Osobowych Klienta <strong>Dostawcy</strong>, <strong>Dostawca</strong> pomoże <strong>Klientowi</strong> w realizacji tego żądania zgodnie z Obowiązującym Prawem o Ochronie Danych. <strong>Dostawca</strong> będzie współpracować i udzielać uzasadnionej pomocy <strong>Klientowi</strong>, na koszt <strong>Klienta</strong>, w każdej odpowiedzi prawnej lub innym działaniu proceduralnym podjętym przez <strong>Klienta</strong> w odpowiedzi na żądanie osoby trzeciej dotyczące Przetwarzania Danych Osobowych Klienta przez <strong>Dostawcę</strong> na mocy niniejszej DPA.

### 2. DPIA i DTIA {#2-dpias-and-dtias}

Jeśli jest to wymagane przez Obowiązujące Przepisy o Ochronie Danych, <strong>Dostawca</strong> rozsądnie pomoże <strong>Klientowi</strong> w przeprowadzeniu wszelkich obowiązkowych ocen skutków dla ochrony danych lub ocen skutków transferu danych oraz konsultacji z odpowiednimi organami ochrony danych, biorąc pod uwagę charakter Przetwarzania i Dane Osobowe Klienta.


## 7. Usuwanie Danych Osobowych Klienta {#7-deletion-of-customer-personal-data}

### 1. Usuwanie przez Klienta {#1-deletion-by-customer}

<strong>Dostawca</strong> umożliwi <strong>Klientowi</strong> usunięcie Danych Osobowych Klienta w sposób zgodny z funkcjonalnością Usług. <strong>Dostawca</strong> zastosuje się do tego polecenia tak szybko, jak to rozsądnie możliwe, z wyjątkiem sytuacji, gdy dalsze przechowywanie Danych Osobowych Klienta jest wymagane przez Obowiązujące Prawo.

### 2. Usuwanie po Wygaśnięciu DPA {#2-deletion-at-dpa-expiration}

a. Po wygaśnięciu DPA, <strong>Dostawca</strong> zwróci lub usunie Dane Osobowe Klienta na polecenie <strong>Klienta</strong>, chyba że dalsze przechowywanie Danych Osobowych Klienta jest wymagane lub dozwolone przez Obowiązujące Prawo. Jeśli zwrot lub zniszczenie jest niewykonalne lub zabronione przez Obowiązujące Prawo, <strong>Dostawca</strong> podejmie rozsądne starania, aby zapobiec dalszemu Przetwarzaniu Danych Osobowych Klienta i będzie nadal chronić Dane Osobowe Klienta pozostające w jego posiadaniu, opiece lub kontroli. Na przykład, Obowiązujące Prawo może wymagać, aby <strong>Dostawca</strong> kontynuował hostowanie lub Przetwarzanie Danych Osobowych Klienta.
b. Jeśli <strong>Klient</strong> i <strong>Dostawca</strong> zawarli EEA SCCs lub UK Addendum jako część niniejszej DPA, <strong>Dostawca</strong> przekaże <strong>Klientowi</strong> certyfikat usunięcia Danych Osobowych opisany w Klauzuli 8.1(d) oraz Klauzuli 8.5 EEA SCCs tylko wtedy, gdy <strong>Klient</strong> o to poprosi.


## 8. Ograniczenie odpowiedzialności {#8-limitation-of-liability}

### 1. Limity odpowiedzialności i zrzeczenie się odszkodowań {#1-liability-caps-and-damages-waiver}

**W maksymalnym zakresie dozwolonym przez Obowiązujące przepisy o ochronie danych, całkowita łączna odpowiedzialność każdej ze stron wobec drugiej strony wynikająca z lub związana z niniejszą DPA będzie podlegać zrzeczeniom, wyłączeniom i ograniczeniom odpowiedzialności określonym w <strong>Umowie</strong>.**

### 2. Roszczenia osób trzecich {#2-related-party-claims}

**Wszelkie roszczenia wobec <strong>Dostawcy</strong> lub jego podmiotów powiązanych wynikające z lub związane z niniejszą DPA mogą być wnoszone wyłącznie przez podmiot <strong>Klienta</strong>, który jest stroną <strong>Umowy</strong>.**

### 3. Wyjątki {#3-exceptions}

1. Niniejsza DPA nie ogranicza żadnej odpowiedzialności wobec osoby fizycznej w zakresie praw tej osoby do ochrony danych zgodnie z Obowiązującymi przepisami o ochronie danych. Ponadto niniejsza DPA nie ogranicza żadnej odpowiedzialności między stronami za naruszenia EEA SCCs lub UK Addendum.


## 9. Konflikty między dokumentami {#9-conflicts-between-documents}

1. Niniejsza DPA stanowi część i uzupełnienie Umowy. W przypadku jakiejkolwiek niespójności między niniejszą DPA, <strong>Umową</strong> lub ich częściami, część wymieniona wcześniej będzie miała pierwszeństwo nad częścią wymienioną później w odniesieniu do tej niespójności: (1) EEA SCCs lub UK Addendum, (2) niniejsza DPA, oraz (3) <strong>Umowa</strong>.


## 10. Okres obowiązywania Umowy {#10-term-of-agreement}

Niniejsza DPA rozpoczyna się w momencie, gdy <strong>Dostawca</strong> i <strong>Klient</strong> uzgodnią Stronę tytułową DPA oraz podpiszą lub elektronicznie zaakceptują <strong>Umowę</strong> i będzie obowiązywać do wygaśnięcia lub rozwiązania <strong>Umowy</strong>. Jednakże <strong>Dostawca</strong> i <strong>Klient</strong> pozostaną podlegali zobowiązaniom wynikającym z niniejszej DPA oraz Obowiązującym przepisom o ochronie danych do momentu, gdy <strong>Klient</strong> przestanie przekazywać Dane Osobowe Klienta <strong>Dostawcy</strong>, a <strong>Dostawca</strong> przestanie przetwarzać Dane Osobowe Klienta.


## 11. Prawo właściwe i wybrane sądy {#11-governing-law-and-chosen-courts}

Niezależnie od klauzul dotyczących prawa właściwego lub podobnych w <strong>Umowie</strong>, wszelkie interpretacje i spory dotyczące niniejszej DPA będą regulowane przez prawo <strong>Państwa Właściwego</strong> bez względu na jego przepisy kolizyjne. Ponadto, niezależnie od klauzul dotyczących wyboru forum, jurysdykcji lub podobnych w <strong>Umowie</strong>, strony zgadzają się wnieść wszelkie spory prawne, działania lub postępowania dotyczące niniejszej DPA do sądów <strong>Państwa Właściwego</strong> i każda ze stron nieodwołalnie poddaje się wyłącznej jurysdykcji tych sądów.


## 12. Relacja dostawcy usług {#12-service-provider-relationship}

W zakresie, w jakim ma zastosowanie California Consumer Privacy Act, Cal. Civ. Code § 1798.100 i następne ("CCPA"), strony potwierdzają i zgadzają się, że <strong>Dostawca</strong> jest dostawcą usług i otrzymuje Dane Osobowe od <strong>Klienta</strong> w celu świadczenia Usługi zgodnie z <strong>Umową</strong>, co stanowi cel biznesowy. <strong>Dostawca</strong> nie będzie sprzedawać żadnych Danych Osobowych dostarczonych przez <strong>Klienta</strong> na podstawie <strong>Umowy</strong>. Ponadto <strong>Dostawca</strong> nie będzie przechowywać, używać ani ujawniać żadnych Danych Osobowych dostarczonych przez <strong>Klienta</strong> na podstawie <strong>Umowy</strong> poza niezbędnym zakresem świadczenia Usługi dla <strong>Klienta</strong>, jak określono w <strong>Umowie</strong>, lub zgodnie z Obowiązującymi przepisami o ochronie danych. <strong>Dostawca</strong> potwierdza, że rozumie ograniczenia wynikające z tego paragrafu.
## 13. Definicje {#13-definitions}

1. **„Obowiązujące przepisy”** oznaczają przepisy prawa, zasady, regulacje, orzeczenia sądowe oraz inne wiążące wymogi właściwego organu rządowego, które mają zastosowanie do lub regulują stronę.

2. **„Obowiązujące przepisy o ochronie danych”** oznaczają Obowiązujące przepisy, które regulują sposób, w jaki Usługa może przetwarzać lub wykorzystywać dane osobowe, dane osobowe identyfikujące osobę lub inny podobny termin.

3. **„Administrator”** będzie miał znaczenie nadane w Obowiązujących przepisach o ochronie danych dla firmy, która określa cel i zakres Przetwarzania danych osobowych.

4. **„Strona tytułowa”** oznacza dokument podpisany lub elektronicznie zaakceptowany przez strony, który zawiera niniejsze Standardowe Warunki DPA oraz identyfikuje <strong>Dostawcę</strong>, <strong>Klienta</strong> oraz przedmiot i szczegóły przetwarzania danych.

5. **„Dane osobowe Klienta”** oznaczają dane osobowe, które <strong>Klient</strong> przesyła lub udostępnia <strong>Dostawcy</strong> w ramach Usługi i które są regulowane przez niniejsze DPA.

6. **„DPA”** oznacza niniejsze Standardowe Warunki DPA, Stronę tytułową pomiędzy <strong>Dostawcą</strong> a <strong>Klientem</strong> oraz polityki i dokumenty wymienione lub załączone do Strony tytułowej.

7. **„Standardowe klauzule umowne EOG”** oznaczają standardowe klauzule umowne załączone do Decyzji wykonawczej Komisji Europejskiej 2021/914 z dnia 4 czerwca 2021 r. dotyczącej standardowych klauzul umownych dla transferu danych osobowych do państw trzecich zgodnie z rozporządzeniem (UE) 2016/679 Parlamentu Europejskiego i Rady.

8. **„Europejski Obszar Gospodarczy”** lub **„EOG”** oznacza państwa członkowskie Unii Europejskiej, Norwegię, Islandię i Liechtenstein.

9. **„RODO”** oznacza rozporządzenie Unii Europejskiej 2016/679 wdrożone przez prawo lokalne w odpowiednim państwie członkowskim EOG.

10. **„Dane osobowe”** będą miały znaczenie nadane w Obowiązujących przepisach o ochronie danych dla informacji osobowych, danych osobowych lub innego podobnego terminu.

11. **„Przetwarzanie”** lub **„Przetwarzać”** będą miały znaczenie nadane w Obowiązujących przepisach o ochronie danych dla dowolnego użycia lub wykonania operacji komputerowej na danych osobowych, w tym metodami automatycznymi.

12. **„Podmiot przetwarzający”** będzie miał znaczenie nadane w Obowiązujących przepisach o ochronie danych dla firmy, która przetwarza dane osobowe w imieniu Administratora.

13. **„Raport”** oznacza raporty audytowe przygotowane przez inną firmę zgodnie ze standardami określonymi w Polityce bezpieczeństwa w imieniu Dostawcy.

14. **„Ograniczony transfer”** oznacza (a) w przypadku stosowania RODO, transfer danych osobowych z EOG do kraju spoza EOG, który nie podlega decyzji Komisji Europejskiej o odpowiednim poziomie ochrony; oraz (b) w przypadku stosowania brytyjskiego RODO, transfer danych osobowych z Wielkiej Brytanii do innego kraju, który nie podlega regulacjom dotyczącym odpowiedniości przyjętym na mocy sekcji 17A brytyjskiej ustawy o ochronie danych z 2018 roku.

15. **„Incydent bezpieczeństwa”** oznacza naruszenie danych osobowych, jak zdefiniowano w artykule 4 RODO.

16. **„Usługa”** oznacza produkt i/lub usługi opisane w <strong>Umowie</strong>.

17. **„Dane szczególnej kategorii”** będą miały znaczenie nadane w artykule 9 RODO.

18. **„Podprzetwarzający”** będzie miał znaczenie nadane w Obowiązujących przepisach o ochronie danych dla firmy, która za zgodą i akceptacją Administratora wspiera Podmiot przetwarzający w przetwarzaniu danych osobowych w imieniu Administratora.

19. **„Brytyjskie RODO”** oznacza rozporządzenie Unii Europejskiej 2016/679 wdrożone przez sekcję 3 brytyjskiej ustawy o wyjściu z Unii Europejskiej (Withdrawal) z 2018 roku w Wielkiej Brytanii.

20. **„Dodatek UK”** oznacza międzynarodowy dodatek do transferu danych do standardowych klauzul umownych EOG wydany przez Komisarza ds. Informacji dla stron dokonujących Ograniczonych transferów na podstawie S119A(1) ustawy o ochronie danych z 2018 roku.


## Kredyty {#credits}

Niniejszy dokument jest pochodną [Common Paper DPA Standard Terms (Wersja 1.0)](https://commonpaper.com/standards/data-processing-agreement/1.0) i jest licencjonowany na podstawie [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
