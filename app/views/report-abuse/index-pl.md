# Zgłoś Nadużycie {#report-abuse}

<img loading="lazy" src="/img/articles/report-abuse.webp" alt="Zgłoś nadużycie i spam do Forward Email" class="rounded-lg" />


## Spis treści {#table-of-contents}

* [Zastrzeżenia](#disclaimer)
* [Jak zgłosić nadużycie](#how-to-submit-an-abuse-report)
* [Dla ogółu społeczeństwa](#for-the-general-public)
* [Dla organów ścigania](#for-law-enforcement)
  * [Jakie informacje są dostępne](#what-information-is-available)
  * [Jakie informacje nie są dostępne](#what-information-is-not-available)
  * [Organy ścigania z siedzibą w Stanach Zjednoczonych](#law-enforcement-based-in-the-united-states)
  * [Organy ścigania spoza Stanów Zjednoczonych](#law-enforcement-based-outside-of-the-united-states)
  * [Pilne prośby organów ścigania](#law-enforcement-emergency-requests)
  * [Prośby organów ścigania mogą wywołać powiadomienia o koncie](#law-enforcement-requests-may-trigger-account-notices)
  * [Prośby organów ścigania o zachowanie informacji](#law-enforcement-requests-to-preserve-information)
  * [Doręczanie dokumentów organom ścigania](#law-enforcement-serving-process)


## Zastrzeżenia {#disclaimer}

Prosimy o zapoznanie się z naszymi [Warunkami](/terms), które mają zastosowanie na całej stronie.


## Jak zgłosić nadużycie {#how-to-submit-an-abuse-report}

Przeglądamy zgłoszenia nadużyć oraz realizujemy prośby o informacje dla [ogółu społeczeństwa](#for-the-general-public) oraz [organów ścigania](#for-law-enforcement) indywidualnie, za pośrednictwem poczty elektronicznej.

Zgłoszenia nadużyć oraz prośby o informacje dotyczące użytkowników, e-maili, adresów IP i/lub domen są poniżej zbiorczo określane jako „Konto”.

Nasze adresy e-mail do kontaktu w sprawie zgłoszeń lub raportów dotyczących nadużyć to: `support@forwardemail.net`, `abuse@forwardemail.net` oraz `security@forwardemail.net`.

Prosimy o przesłanie kopii na wszystkie te adresy e-mail, jeśli to możliwe, oraz o wysyłanie przypomnień, jeśli nie odpowiemy w ciągu 24-48+ godzin.

Przeczytaj poniższe sekcje, aby uzyskać więcej informacji, które mogą Cię dotyczyć.


## Dla ogółu społeczeństwa {#for-the-general-public}

<u>**Jeśli Ty lub ktoś inny znajduje się w bezpośrednim niebezpieczeństwie, natychmiast skontaktuj się z policją i służbami ratunkowymi.**</u>

<u>**Powinieneś zasięgnąć profesjonalnej porady prawnej, aby odzyskać utracony dostęp do swojego Konta lub aby pomóc powstrzymać złośliwego aktora.**</u>

Jeśli jesteś ofiarą nadużycia ze strony Konta korzystającego z naszej usługi, prosimy o przesłanie raportu na powyższy adres e-mail. Jeśli Twoje Konto zostało przejęte przez złośliwego aktora (np. Twoja domena niedawno wygasła i została ponownie zarejestrowana przez osobę trzecią, a następnie użyta do nadużyć), prosimy o przesłanie raportu na powyższy adres e-mail z dokładnymi informacjami o Twoim Koncie (np. nazwą domeny). Możemy pomóc w [shadow banowaniu](https://en.wikipedia.org/wiki/Shadow_banning) Konta po potwierdzeniu Twojego wcześniejszego posiadania. Należy zauważyć, że nie mamy uprawnień do pomocy w odzyskaniu dostępu do Twojego Konta.

Twój przedstawiciel prawny może doradzić Ci kontakt z organami ścigania, właścicielem Konta (np. rejestratorem nazwy domeny; stroną, na której zarejestrowałeś domenę) i/lub skierować Cię do [strony ICANN dotyczącej utraconych domen](https://www.icann.org/resources/pages/lost-domain-names).


## Dla organów ścigania {#for-law-enforcement}

W przypadku większości próśb nasza możliwość ujawnienia informacji jest regulowana przez [Electronic Communications Privacy Act](https://bja.ojp.gov/program/it/privacy-civil-liberties/authorities/statutes/1285) ([Wikipedia](https://en.wikipedia.org/wiki/Electronic_Communications_Privacy_Act)), [18 U.S.C. 2701](https://www.govinfo.gov/link/uscode/18/2701) i nast., („ECPA”). ECPA nakłada na nas obowiązek ujawnienia określonych informacji o użytkownikach organom ścigania wyłącznie w odpowiedzi na określone rodzaje prawnych żądań, w tym wezwania sądowe, nakazy sądowe i nakazy przeszukania.

Jeśli jesteś członkiem organów ścigania i poszukujesz informacji dotyczących Konta, prosimy o dołączenie do swojego żądania informacji o Koncie oraz zakresu dat i godzin. Nie możemy przetwarzać zbyt ogólnych i/lub niejasnych żądań – ma to na celu ochronę danych i zaufania naszych użytkowników, a co najważniejsze – zapewnienie bezpieczeństwa ich danych.
Jeśli Twoja prośba sygnalizuje nam naruszenie naszych [Warunków](/terms), to przetworzymy ją zgodnie z naszymi wewnętrznymi najlepszymi praktykami dotyczącymi obsługi nadużyć – należy zauważyć, że w niektórych przypadkach może to skutkować zawieszeniem i/lub zablokowaniem Konta.

**Ponieważ nie jesteśmy rejestratorem nazw domen**, jeśli chcesz uzyskać informacje o historycznych rekordach DNS dotyczących nazwy domeny, powinieneś skontaktować się z konkretnym rejestratorem nazw domen odpowiadającym danej domenie. Usługi takie jak [Security Trails]() mogą udostępniać wyszukiwanie historycznych rekordów, ale bardziej szczegółowe i dokładne informacje mogą być dostarczone przez rejestratora. Aby ustalić, kto jest rejestratorem nazwy domeny i/lub właścicielem serwerów nazw DNS dla domeny, przydatne mogą być narzędzia `dig` i `whois` (np. `whois example.com` lub `dig example.com ns`). Możesz ustalić, czy Konto korzysta z planu płatnego czy darmowego w naszej usłudze, wykonując zapytanie o rekord DNS (np. `dig example.com mx` oraz `dig example.com txt`). Jeśli rekordy MX nie zwracają wartości takich jak `mx1.forwardemail.net` i `mx2.forwardemail.net`, oznacza to, że domena nie korzysta z naszej usługi. Jeśli rekordy TXT zwracają adres e-mail w postaci tekstu (np. `forward-email=user@example.com`), wskazuje to na adres docelowy przekierowania e-mail dla domeny. Jeśli zamiast tego zwraca wartość taką jak `forward-email-site-verification=XXXXXXXXXX`, oznacza to, że konto jest na planie płatnym, a konfiguracja przekierowania jest przechowywana w naszej bazie danych pod ID `XXXXXXXXXX`. Aby uzyskać więcej informacji o tym, jak działa nasza usługa na poziomie DNS, prosimy o zapoznanie się z naszym [FAQ](/faq).

### Jakie informacje są dostępne {#what-information-is-available}

Prosimy o zapoznanie się z sekcją Polityki Prywatności dotyczącą [Zbieranych Informacji](/privacy#information-collected). Konta mają prawo do usunięcia swoich informacji z naszego systemu zgodnie z przepisami dotyczącymi przechowywania danych i prywatności; prosimy o zapoznanie się z sekcją Polityki Prywatności dotyczącą [Usuwania Informacji](/privacy#information-removal). Oznacza to, że żądane informacje mogą nie być dostępne w momencie zgłoszenia z powodu usunięcia Konta.

### Jakie informacje nie są dostępne {#what-information-is-not-available}

Prosimy o zapoznanie się z sekcją Polityki Prywatności dotyczącą [Informacji Nie Zbieranych](/privacy#information-not-collected).

### Organy ścigania z siedzibą w Stanach Zjednoczonych {#law-enforcement-based-in-the-united-states}

Z [wyjątkiem sytuacji awaryjnych](#law-enforcement-emergency-requests), udostępniamy informacje o Koncie wyłącznie po otrzymaniu ważnego wezwania sądowego, nakazu sądowego ECPA USA i/lub nakazu przeszukania.

Możemy dodatkowo [powiadomić Konto](#law-enforcement-requests-may-trigger-account-notices) o żądaniu organów ścigania, chyba że prawo lub nakaz sądowy zabraniają nam tego.

Jeśli otrzymamy ważne wezwanie sądowe, nakaz sądowy ECPA i/lub nakaz przeszukania, przekażemy odpowiednie i dostępne informacje w najlepszym zakresie naszych możliwości.

### Organy ścigania spoza Stanów Zjednoczonych {#law-enforcement-based-outside-of-the-united-states}

Wymagamy, aby żądania od organów ścigania spoza Stanów Zjednoczonych były doręczane za pośrednictwem jednego z następujących:

* Sądu Stanów Zjednoczonych.
* Agencji egzekwującej prawo na podstawie procedur [traktatu o wzajemnej pomocy prawnej Stanów Zjednoczonych](https://www.justice.gov/criminal-oia/file/1498806/download) ([Wikipedia](https://en.wikipedia.org/wiki/Mutual_legal_assistance_treaty)) („MLAT”).
* Nakazu od rządu zagranicznego, który podlega umowie wykonawczej, którą Prokurator Generalny Stanów Zjednoczonych ustalił i poświadczył Kongresowi, że spełnia wymagania [18 U.S.C. 2523](https://www.govinfo.gov/link/uscode/18/2523).

### Żądania organów ścigania w sytuacjach awaryjnych {#law-enforcement-emergency-requests}

Zgodnie z prawem w Stanach Zjednoczonych (np. zgodnie z [18 U.S.C. §2702 (b)(8)](https://www.law.cornell.edu/uscode/text/18/2702#:\~:text=\(8\)to%20a%20governmental%20entity%2C%20if%20the%20provider%2C%20in%20good%20faith%2C%20believes%20that%20an%20emergency%20involving%20danger%20of%20death%20or%20serious%20physical%20injury%20to%20any%20person%20requires%20disclosure%20without%20delay%20of%20communications%20relating%20to%20the%20emergency%3B%20or) oraz [§2702 (c)](https://www.law.cornell.edu/uscode/text/18/2702#:\~:text=\(c\)Exceptions%20for%20Disclosure%20of%20Customer%20Records.%E2%80%94A%20provider%20described%20in%20subsection%20\(a\)%20may%20divulge%20a%20record%20or%20other%20information%20pertaining%20to%20a%20subscriber%20to%20or%20customer%20of%20such%20service%20\(not%20including%20the%20contents%20of%20communications%20covered%20by%20subsection%20\(a\)\(1\)%20or%20\(a\)\(2\)\)%E2%80%94)), gdy działamy w dobrej wierze i po niezależnej weryfikacji wnioskodawcy – możemy ujawnić i udostępnić informacje o Koncie organom ścigania bez wezwania sądowego, nakazu sądowego ECPA i/lub nakazu przeszukania, jeśli uznamy, że niezwłoczne działanie jest konieczne, aby zapobiec śmierci lub poważnemu uszkodzeniu ciała.
Wymagamy, aby awaryjne żądania danych („EDR”) były wysyłane za pośrednictwem e-maila i zawierały wszystkie istotne informacje, aby zapewnić terminowy i przyspieszony proces.

Należy zauważyć, że jesteśmy świadomi zaawansowanych ataków typu spoofing, phishing i podszywania się w e-mailach (np. zobacz [ten artykuł z The Guardian](https://www.theguardian.com/technology/2022/apr/04/us-law-enforcement-agencies-access-your-data-apple-meta#:\~:text=A%20hack%20using%20a%20forged%20legal%20request%20that%20exposed%20consumer%20data%20collected%20by%20Apple%20and%20Meta%20shed%20light%20on%20the%20reach%20of%20the%20law)).

Nasza polityka przetwarzania EDR jest następująca:

1. Niezależne badanie metadanych nagłówka e-maila (np. DKIM/SPF/DMARC) (lub ich braku) w celu weryfikacji.

2. Dokonanie najlepszego możliwego, w dobrej wierze, wysiłku (w razie potrzeby wielokrotne próby) w celu niezależnego kontaktu telefonicznego z wnioskodawcą – w celu potwierdzenia autentyczności żądania. Na przykład możemy zbadać stronę `.gov` związaną z jurysdykcją, z której pochodzi żądanie, a następnie zadzwonić do biura z ich publicznie podanym oficjalnym numerem telefonu, aby zweryfikować żądanie.

### Żądania organów ścigania mogą wywołać powiadomienia o koncie {#law-enforcement-requests-may-trigger-account-notices}

Możemy powiadomić Konto i dostarczyć mu kopię żądania organów ścigania dotyczącego tego konta, chyba że prawo lub nakaz sądowy zabrania nam tego (np. [18 U.S.C. 2705(b)](https://www.govinfo.gov/link/uscode/18/2705)). W takich przypadkach, jeśli ma to zastosowanie, możemy powiadomić Konto po wygaśnięciu zakazu ujawniania informacji.

Jeśli żądanie informacji przez organy ścigania jest ważne, to [zachowamy niezbędne i żądane informacje o Koncie](#law-enforcement-requests-to-preserve-information) oraz podejmiemy rozsądny wysiłek, aby skontaktować się z właścicielem Konta za pomocą jego zarejestrowanego i zweryfikowanego adresu e-mail (np. w ciągu 7 dni kalendarzowych). Jeśli otrzymamy terminowy sprzeciw (np. w ciągu 7 dni kalendarzowych), wstrzymamy udostępnianie informacji o Koncie i będziemy kontynuować proces prawny w razie potrzeby.

### Żądania organów ścigania dotyczące zachowania informacji {#law-enforcement-requests-to-preserve-information}

Będziemy honorować ważne żądania organów ścigania dotyczące zachowania informacji o Koncie zgodnie z [18 U.S.C. 2703(f)](https://www.govinfo.gov/link/uscode/18/2703). Należy zauważyć, że zachowanie danych jest ograniczone tylko do tego, co jest konkretnie żądane i obecnie dostępne.

### Doręczanie pism przez organy ścigania {#law-enforcement-serving-process}

Wymagamy, aby wszystkie ważne żądania organów ścigania zawierały ważny i funkcjonalny adres e-mail, na który możemy korespondować i elektronicznie przekazywać żądane informacje.

Wszystkie żądania powinny być wysyłane na adres e-mail podany w sekcji [Jak zgłosić nadużycie](#how-to-submit-an-abuse-report) powyżej.

Wszystkie żądania organów ścigania muszą być wysłane na papierze firmowym agencji lub departamentu (np. jako załącznik PDF ze skanem), z oficjalnego i odpowiedniego adresu e-mail oraz podpisane.

Jeśli dotyczy to [żądania awaryjnego](#law-enforcement-emergency-requests), prosimy o wpisanie w temacie e-maila „Emergency law enforcement request”.

Prosimy pamiętać, że może nam zająć co najmniej dwa tygodnie, aby móc przejrzeć i odpowiedzieć na Twoje żądanie.
