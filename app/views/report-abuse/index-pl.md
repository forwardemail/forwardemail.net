# Zgłoś nadużycie {#report-abuse}

<img loading="lazy" src="/img/articles/report-abuse.webp" alt="Report abuse and spam to Forward Email" class="rounded-lg" />

## Spis treści {#table-of-contents}

* [Zastrzeżenie](#disclaimer)
* [Jak zgłosić nadużycie](#how-to-submit-an-abuse-report)
* [Dla ogółu społeczeństwa](#for-the-general-public)
* [Dla organów ścigania](#for-law-enforcement)
  * [Jakie informacje są dostępne](#what-information-is-available)
  * [Jakie informacje nie są dostępne](#what-information-is-not-available)
  * [Organy ścigania z siedzibą w Stanach Zjednoczonych](#law-enforcement-based-in-the-united-states)
  * [Organy ścigania działające poza Stanami Zjednoczonymi](#law-enforcement-based-outside-of-the-united-states)
  * [Prośby o pomoc w nagłych wypadkach w organach ścigania](#law-enforcement-emergency-requests)
  * [Żądania organów ścigania mogą spowodować powiadomienie dotyczące konta](#law-enforcement-requests-may-trigger-account-notices)
  * [Wnioski organów ścigania o zachowanie informacji](#law-enforcement-requests-to-preserve-information)
  * [Proces doręczania aktów oskarżenia](#law-enforcement-serving-process)

## Zastrzeżenie {#disclaimer}

Proszę odnieść się do naszego [Warunki](/terms), ponieważ dotyczy ono całej witryny.

## Jak zgłosić nadużycie {#how-to-submit-an-abuse-report}

Sprawdzamy zgłoszenia nadużyć i rozpatrujemy wnioski o udostępnienie informacji dla obiektów [ogół społeczeństwa](#for-the-general-public) i [egzekwowanie prawa](#for-law-enforcement) indywidualnie, wysyłając wiadomość e-mail.

Zgłoszenia nadużyć i prośby o informacje dotyczące użytkowników, adresów e-mail, adresów IP i/lub domen są dalej określane zbiorczo jako „Konto”.

Nasz adres e-mail, na który można się skontaktować w sprawie Twojej prośby lub zgłoszenia dotyczącego nadużycia, to: `abuse@forwardemail.net`

Aby uzyskać więcej informacji, które mogą Cię dotyczyć, przeczytaj poniższe sekcje.

## Dla ogółu społeczeństwa {#for-the-general-public}

<u>**Jeśli Tobie lub komuś innemu grozi bezpośrednie niebezpieczeństwo, prosimy o natychmiastowy kontakt z policją i służbami ratunkowymi.**</u>

<u>**Aby odzyskać utracony dostęp do swojego konta lub pomóc powstrzymać osobę działającą w złej wierze, powinieneś zasięgnąć profesjonalnej porady prawnej.**</u>

Jeśli padłeś ofiarą nadużycia z konta korzystającego z naszych usług, prosimy o przesłanie zgłoszenia e-mailem na adres podany powyżej. Jeśli Twoje konto zostało przejęte przez osobę nieuczciwą (np. Twoja domena niedawno wygasła i została ponownie zarejestrowana przez osobę trzecią, a następnie wykorzystana do nadużyć), prosimy o przesłanie zgłoszenia na powyższy adres e-mail, podając dokładne dane konta (np. nazwę domeny). Możemy pomóc w odzyskaniu dostępu do konta po potwierdzeniu Twojego poprzedniego właściciela. Pamiętaj, że nie jesteśmy uprawnieni do udzielenia Ci pomocy w odzyskaniu dostępu do konta.

Twój przedstawiciel prawny może doradzić Ci kontakt z organami ścigania, właścicielem Twojego konta (np. rejestratorem nazwy domeny, stroną internetową, na której zarejestrowałeś nazwę domeny) i/lub skierować Cię do [Strona ICANN na temat utraconych domen](https://www.icann.org/resources/pages/lost-domain-names).

## Dla organów ścigania {#for-law-enforcement}

W przypadku większości wniosków nasza możliwość ujawnienia informacji jest regulowana przez [Ustawa o ochronie prywatności w komunikacji elektronicznej](https://bja.ojp.gov/program/it/privacy-civil-liberties/authorities/statutes/1285) ([Wikipedia](https://en.wikipedia.org/wiki/Electronic_Communications_Privacy_Act)), [18 U.S.C. 2701](https://www.govinfo.gov/link/uscode/18/2701) i następne („ECPA”). ECPA nakazuje nam ujawnianie określonych informacji o użytkownikach organom ścigania wyłącznie w odpowiedzi na określone rodzaje wniosków prawnych, w tym wezwania sądowe, nakazy sądowe i nakazy przeszukania.

Jeśli jesteś członkiem organów ścigania i poszukujesz informacji dotyczących Konta, we wniosku należy podać informacje o Koncie oraz zakres daty i godziny. Nie możemy przetwarzać wniosków o charakterze zbyt ogólnym i/lub niejasnym – robimy to w celu ochrony danych i zaufania naszych użytkowników, a przede wszystkim w celu zapewnienia bezpieczeństwa ich danych.

Jeśli Twoja prośba zasygnalizuje nam naruszenie zasad [Warunki](/terms), wówczas przetworzymy ją zgodnie z naszymi wewnętrznymi najlepszymi praktykami postępowania w przypadku nadużyć – pamiętaj, że w niektórych przypadkach może to skutkować zawieszeniem i/lub zablokowaniem konta.

**Ponieważ nie jesteśmy rejestratorem nazw domen**, jeśli chcesz uzyskać informacje o historycznych rekordach DNS dotyczących danej nazwy domeny, skontaktuj się z rejestratorem, który jej odpowiada. Usługi takie jak [Security Trails]() mogą umożliwiać wyszukiwanie historycznych rekordów, ale bardziej szczegółowe i dokładne informacje może dostarczyć rejestrator. Aby ustalić, kto jest rejestratorem nazwy domeny i/lub właścicielem serwerów nazw DNS dla danej domeny, przydatne mogą być narzędzia `dig` i `whois` (np. `whois example.com` lub `dig example.com ns`). Możesz sprawdzić, czy konto korzysta z planu płatnego, czy bezpłatnego w naszej usłudze, przeprowadzając wyszukiwanie rekordów DNS (np. `dig example.com mx` i `dig example.com txt`). Jeśli rekordy MX nie zwrócą wartości takich jak `mx1.forwardemail.net` i `mx2.forwardemail.net`, oznacza to, że domena nie korzysta z naszej usługi. Jeśli rekordy TXT zwrócą adres e-mail w postaci zwykłego tekstu (np. `forward-email=user@example.com`), oznacza to, że domena ma docelowy adres przekierowania poczty e-mail. Jeśli zamiast tego zwrócą wartość taką jak `forward-email-site-verification=XXXXXXXXXX`, oznacza to, że korzysta ona z planu płatnego, a konfiguracja przekierowania jest przechowywana w naszej bazie danych pod identyfikatorem `whois`0. Aby uzyskać więcej informacji na temat działania naszej usługi na poziomie DNS, zapoznaj się z naszym `whois`1.

### Jakie informacje są dostępne {#what-information-is-available}

Prosimy o zapoznanie się z naszą Polityką Prywatności dla konta [Zebrane informacje](/privacy#information-collected). Konta mają prawo do usuwania swoich danych z naszego systemu zgodnie z przepisami dotyczącymi przechowywania danych i prywatności; prosimy o zapoznanie się z naszą Polityką Prywatności dla konta [Usuwanie informacji](/privacy#information-removal). Oznacza to, że żądane informacje mogą być niedostępne w momencie żądania z powodu usunięcia konta.

### Jakie informacje nie są dostępne {#what-information-is-not-available}

Proszę zapoznać się z naszą sekcją Polityki prywatności dla [Informacje nie zostały zebrane](/privacy#information-not-collected).

### Organy ścigania z siedzibą w Stanach Zjednoczonych {#law-enforcement-based-in-the-united-states}

W przypadku [z wyjątkiem sytuacji awaryjnych](#law-enforcement-emergency-requests) udostępniamy informacje o koncie wyłącznie po otrzymaniu ważnego wezwania sądowego, nakazu sądowego ECPA US i/lub nakazu przeszukania.

Możemy również zażądać [powiadom konto](#law-enforcement-requests-may-trigger-account-notices) od organów ścigania, chyba że zabrania nam tego prawo lub nakaz sądowy.

Jeśli otrzymamy ważne wezwanie sądowe, nakaz sądowy ECPA i/lub nakaz przeszukania, wówczas przekażemy stosowne i dostępne informacje w miarę naszych najlepszych możliwości.

### Organy ścigania spoza Stanów Zjednoczonych {#law-enforcement-based-outside-of-the-united-states}

Wymagamy, aby wnioski kierowane do organów ścigania spoza Stanów Zjednoczonych były doręczane za pośrednictwem jednego z następujących kanałów:

* Sąd Stanów Zjednoczonych.
* Organ egzekucyjny działający zgodnie z procedurami [Traktat o wzajemnej pomocy prawnej Stanów Zjednoczonych](https://www.justice.gov/criminal-oia/file/1498806/download) ([Wikipedia](https://en.wikipedia.org/wiki/Mutual_legal_assistance_treaty)) („MLAT”).
* Nakaz wydany przez rząd zagraniczny, który podlega umowie wykonawczej, którą Prokurator Generalny Stanów Zjednoczonych ustalił i poświadczył Kongresowi, spełniając wymogi [18 U.S.C. 2523](https://www.govinfo.gov/link/uscode/18/2523).

### Prośby o pomoc w nagłych wypadkach w organach ścigania {#law-enforcement-emergency-requests}

Zgodnie z prawem obowiązującym w Stanach Zjednoczonych (np. zgodnie z [18 U.S.C. §2702 (b)(8)](https://www.law.cornell.edu/uscode/text/18/2702#:\~:text=\(8\)do podmiotu rządowego, jeśli dostawca w dobrej wierze uważa, że sytuacja awaryjna obejmująca niebezpieczeństwo śmierci lub poważne obrażenia fizyczne jakiejkolwiek osoby wymaga niezwłocznego ujawnienia informacji dotyczących sytuacji awaryjnej) i [§ 2702 (c)](https://www.law.cornell.edu/uscode/text/18/2702#:\~:text=\(c\)Wyjątki%20dotyczące%20ujawnienia%20rekordów%20klientów.%E2%80%94Dostawca%20opisany%20w%20podsekcji%20\(a\)%20może%20ujawnić%20rekord%20lub%20inne%20informacje%20dotyczące%20abonenta%20lub%20klienta%20takiej%20usługi%20\(nie%20uwzględniając%20treści%20komunikacji%20objętych%20podsekcją%20\(a\)\(1\)%20lub%20\(a\)\(2\)\)%E2%80%94)), gdy w dobrej wierze i po niezależnej weryfikacji wnioskodawcy – możemy ujawnić i udostępnić informacje o koncie organom ścigania bez wezwania sądowego, nakazu sądowego ECPA i/lub nakazu przeszukania, jeśli uznamy, że niezwłoczne podjęcie takich działań jest konieczne w celu zapobieżenia śmierci lub poważnym obrażeniom fizycznym.

Wymagamy, aby wnioski o udostępnienie danych w nagłych wypadkach („EDR”) były przesyłane pocztą elektroniczną i zawierały wszystkie istotne informacje, aby zapewnić szybką i sprawną obsługę.

Należy pamiętać, że jesteśmy świadomi zaawansowanych ataków polegających na podszywaniu się, phishingu i podszywaniu się pod inne osoby za pośrednictwem poczty e-mail (zobacz np. [ten artykuł z The Guardian](https://www.theguardian.com/technology/2022/apr/04/us-law-enforcement-agencies-access-your-data-apple-meta#:\~:text=A%20hack%20using%20a%20forged%20legal%20request%20that%20exposed%20consumer%20data%20collected%20by%20Apple%20and%20Meta%20shed%20light%20on%20the%20reach%20of%20the%20law)).

Nasza polityka przetwarzania EDR jest następująca:

1. Niezależnie sprawdź metadane nagłówka wiadomości e-mail (np. DKIM/SPF/DMARC) (lub ich brak) w celu weryfikacji.

2. Dołożymy wszelkich starań, działając w dobrej wierze (w razie potrzeby podejmując wielokrotne próby), aby niezależnie skontaktować się telefonicznie z wnioskodawcą w celu potwierdzenia autentyczności wniosku. Na przykład, możemy sprawdzić stronę internetową `.gov` związaną z jurysdykcją, z której pochodzi wniosek, a następnie zadzwonić do urzędu z publicznie dostępnego numeru telefonu, aby zweryfikować wniosek.

### Żądania organów ścigania mogą powodować powiadomienia dotyczące konta {#law-enforcement-requests-may-trigger-account-notices}

Możemy powiadomić Konto i przekazać mu kopię żądania organów ścigania, które go dotyczy, chyba że zabrania nam tego prawo lub nakaz sądowy (np. [18 U.S.C. 2705(b)](https://www.govinfo.gov/link/uscode/18/2705)). W takich przypadkach, jeśli ma to zastosowanie, możemy powiadomić Konto po wygaśnięciu nakazu zachowania poufności.

Jeśli żądanie udostępnienia informacji przez organy ścigania okaże się zasadne, wówczas [zachować niezbędne i żądane informacje o koncie](#law-enforcement-requests-to-preserve-information) i dołożymy wszelkich starań, aby skontaktować się z właścicielem konta za pośrednictwem jego zarejestrowanego i zweryfikowanego adresu e-mail (np. w ciągu 7 dni kalendarzowych). Jeśli otrzymamy sprzeciw w odpowiednim czasie (np. w ciągu 7 dni kalendarzowych), wstrzymamy udostępnianie informacji o koncie i będziemy kontynuować postępowanie prawne w razie konieczności.

### Wnioski organów ścigania o zachowanie informacji {#law-enforcement-requests-to-preserve-information}

Będziemy honorować uzasadnione prośby organów ścigania o zachowanie informacji dotyczących Konta zgodnie z [18 U.S.C. 2703(f)](https://www.govinfo.gov/link/uscode/18/2703). Należy pamiętać, że zachowanie danych jest ograniczone wyłącznie do danych konkretnie żądanych i aktualnie dostępnych.

### Organy ścigania doręczają dokumenty {#law-enforcement-serving-process}

Wymagamy, aby wszystkie ważne żądania organów ścigania zawierały ważny i działający adres e-mail, na który będziemy mogli korespondować i przesyłać żądane informacje drogą elektroniczną.

Wszystkie prośby należy wysyłać na adres e-mail podany powyżej w polu [Jak zgłosić nadużycie](#how-to-submit-an-abuse-report).

Wszystkie wnioski organów ścigania muszą zostać wysłane na papierze firmowym danej agencji lub departamentu (np. jako zeskanowany załącznik w formacie PDF) z oficjalnego i właściwego adresu e-mail i podpisane.

Jeśli dotyczy to [prośba o pomoc w nagłych wypadkach](#law-enforcement-emergency-requests), w temacie wiadomości e-mail wpisz „Awaryjne zgłoszenie do organów ścigania”.

Prosimy pamiętać, że rozpatrzenie Twojego wniosku i udzielenie na niego odpowiedzi może zająć nam co najmniej dwa tygodnie.