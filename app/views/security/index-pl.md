# Praktyki bezpieczeństwa {#security-practices}

<img loading="lazy" src="/img/articles/security.webp" alt="" class="rounded-lg" />

## Spis treści {#table-of-contents}

* [Przedmowa](#foreword)
* [Bezpieczeństwo infrastruktury](#infrastructure-security)
  * [Bezpieczne centra danych](#secure-data-centers)
  * [Bezpieczeństwo sieci](#network-security)
* [Bezpieczeństwo poczty e-mail](#email-security)
  * [Szyfrowanie](#encryption)
  * [Uwierzytelnianie i autoryzacja](#authentication-and-authorization)
  * [Środki antyprzemocowe](#anti-abuse-measures)
* [Ochrona danych](#data-protection)
  * [Minimalizacja danych](#data-minimization)
  * [Kopie zapasowe i odzyskiwanie](#backup-and-recovery)
* [Dostawcy usług](#service-providers)
* [Zgodność i audyt](#compliance-and-auditing)
  * [Regularne oceny bezpieczeństwa](#regular-security-assessments)
  * [Zgodność](#compliance)
* [Reagowanie na incydenty](#incident-response)
* [Cykl rozwoju zabezpieczeń](#security-development-lifecycle)
* [Utwardzanie serwera](#server-hardening)
* [Umowa o poziomie usług](#service-level-agreement)
* [Bezpieczeństwo Open Source](#open-source-security)
* [Bezpieczeństwo pracowników](#employee-security)
* [Ciągłe doskonalenie](#continuous-improvement)
* [Dodatkowe zasoby](#additional-resources)

## Przedmowa {#foreword}

W Forward Email bezpieczeństwo jest naszym najwyższym priorytetem. Wdrożyliśmy kompleksowe środki bezpieczeństwa, aby chronić Twoją komunikację e-mailową i dane osobowe. Niniejszy dokument opisuje nasze praktyki bezpieczeństwa i kroki, które podejmujemy, aby zapewnić poufność, integralność i dostępność Twojej poczty e-mail.

## Bezpieczeństwo infrastruktury {#infrastructure-security}

### Bezpieczne centra danych {#secure-data-centers}

Nasza infrastruktura jest hostowana w centrach danych zgodnych ze standardem SOC 2, wyposażonych w:

* Całodobowa ochrona fizyczna i nadzór
* Biometryczna kontrola dostępu
* Nadmiarowe systemy zasilania
* Zaawansowane wykrywanie i gaszenie pożaru
* Monitorowanie środowiska

### Bezpieczeństwo sieci {#network-security}

Wdrażamy wielowarstwowe zabezpieczenia sieciowe:

* Zapory klasy korporacyjnej ze ścisłymi listami kontroli dostępu
* Ochrona i łagodzenie ataków DDoS
* Regularne skanowanie luk w sieci
* Systemy wykrywania i zapobiegania włamaniom
* Szyfrowanie ruchu między wszystkimi punktami końcowymi usługi
* Ochrona skanowania portów z automatycznym blokowaniem podejrzanej aktywności

> \[!IMPORTANT]
> All data in transit is encrypted using TLS 1.2+ with modern cipher suites.

## Bezpieczeństwo poczty e-mail {#email-security}

### Szyfrowanie {#encryption}

* **Transport Layer Security (TLS)**: Cały ruch e-mail jest szyfrowany w trakcie przesyłania przy użyciu protokołu TLS 1.2 lub nowszego
* **Szyfrowanie typu end-to-end**: Obsługa standardów OpenPGP/MIME i S/MIME
* **Szyfrowanie pamięci masowej**: Wszystkie przechowywane wiadomości e-mail są szyfrowane w stanie spoczynku przy użyciu szyfrowania ChaCha20-Poly1305 w plikach SQLite
* **Pełne szyfrowanie dysku**: Szyfrowanie LUKS v2 dla całego dysku
* **Kompleksowa ochrona**: Wdrażamy szyfrowanie w stanie spoczynku, szyfrowanie w pamięci i szyfrowanie w trakcie przesyłania

> \[!NOTE]
> We're the world's first and only email service to use **[quantum-resistant and individually encrypted SQLite mailboxes](https://forwardemail.net/en/blog/docs/best-quantum-safe-encrypted-email-service)**.

### Uwierzytelnianie i autoryzacja {#authentication-and-authorization}

* **Podpisywanie DKIM**: Wszystkie wiadomości wychodzące są podpisywane za pomocą DKIM
* **SPF i DMARC**: Pełne wsparcie dla SPF i DMARC w celu zapobiegania podszywaniu się pod e-mail
* **MTA-STS**: Wsparcie dla MTA-STS w celu wymuszenia szyfrowania TLS
* **Uwierzytelnianie wieloskładnikowe**: Dostępne dla wszystkich dostępów do kont

### Środki przeciwdziałania nadużyciom {#anti-abuse-measures}

* **Filtrowanie spamu**: Wielowarstwowe wykrywanie spamu z wykorzystaniem uczenia maszynowego
* **Skanowanie w poszukiwaniu wirusów**: Skanowanie wszystkich załączników w czasie rzeczywistym
* **Ograniczanie szybkości**: Ochrona przed atakami siłowymi i wyliczeniowymi
* **Reputacja IP**: Monitorowanie reputacji wysyłania IP
* **Filtrowanie treści**: Wykrywanie złośliwych adresów URL i prób phishingu

## Ochrona danych {#data-protection}

### Minimalizacja danych {#data-minimization}

Kierujemy się zasadą minimalizacji danych:

* Gromadzimy tylko dane niezbędne do świadczenia naszych usług
* Treść wiadomości e-mail jest przetwarzana w pamięci i nie jest trwale przechowywana, chyba że jest to wymagane do dostarczenia za pośrednictwem protokołu IMAP/POP3
* Dzienniki są anonimizowane i przechowywane tylko tak długo, jak jest to konieczne

### Kopia zapasowa i odzyskiwanie {#backup-and-recovery}

* Zautomatyzowane codzienne kopie zapasowe z szyfrowaniem
* Geograficznie rozproszone przechowywanie kopii zapasowych
* Regularne testowanie przywracania kopii zapasowych
* Procedury odzyskiwania po awarii z określonymi RPO i RTO

## Dostawcy usług {#service-providers}

Starannie wybieramy naszych dostawców usług, aby mieć pewność, że spełniają nasze wysokie standardy bezpieczeństwa. Poniżej wymieniono dostawców, z których korzystamy w zakresie międzynarodowego transferu danych, oraz ich status zgodności z GDPR:

| Dostawca | Zamiar | Certyfikowany DPF | Strona zgodności z RODO |
| --------------------------------------------- | ------------------------- | ------------- | ----------------------------------------------------------------- |
| [Cloudflare](https://www.cloudflare.com) | CDN, ochrona DDoS, DNS | ✅ Tak | [Cloudflare GDPR](https://www.cloudflare.com/trust-hub/gdpr/) |
| [DataPacket](https://www.datapacket.com) | Infrastruktura serwerowa | ❌ Nie | [DataPacket Privacy](https://www.datapacket.com/privacy-policy) |
| [Digital Ocean](https://www.digitalocean.com) | Infrastruktura chmurowa | ❌ Nie | [DigitalOcean GDPR](https://www.digitalocean.com/legal/gdpr) |
| [Vultr](https://www.vultr.com) | Infrastruktura chmurowa | ❌ Nie | [Vultr GDPR](https://www.vultr.com/legal/eea-gdpr-privacy/) |
| [Stripe](https://stripe.com) | Przetwarzanie płatności | ✅ Tak | [Stripe Privacy Center](https://stripe.com/legal/privacy-center) |
| [PayPal](https://www.paypal.com) | Przetwarzanie płatności | ❌ Nie | [PayPal Privacy](https://www.paypal.com/uk/legalhub/privacy-full) |

Korzystamy z tych dostawców, aby zapewnić niezawodne, bezpieczne świadczenie usług przy jednoczesnym zachowaniu zgodności z międzynarodowymi przepisami o ochronie danych. Wszystkie transfery danych są przeprowadzane z odpowiednimi zabezpieczeniami w celu ochrony Twoich danych osobowych.

## Zgodność i audyt {#compliance-and-auditing}

### Regularne oceny bezpieczeństwa {#regular-security-assessments}

Nasz zespół regularnie monitoruje, przegląda i ocenia bazę kodu, serwery, infrastrukturę i praktyki. Wdrażamy kompleksowy program bezpieczeństwa, który obejmuje:

* Regularna rotacja kluczy SSH
* Ciągły monitoring logów dostępu
* Automatyczne skanowanie bezpieczeństwa
* Proaktywne zarządzanie lukami w zabezpieczeniach
* Regularne szkolenia z zakresu bezpieczeństwa dla wszystkich członków zespołu

### Zgodność {#compliance}

* [GDPR](https://forwardemail.net/gdpr) praktyki przetwarzania danych zgodne z przepisami
* [Umowa o przetwarzaniu danych (DPA)](https://forwardemail.net/dpa) dostępne dla klientów biznesowych
* Kontrola prywatności zgodna z CCPA
* Procesy audytowane zgodnie z SOC 2 typu II

## Reakcja na incydenty {#incident-response}

Nasz plan reagowania na incydenty bezpieczeństwa obejmuje:

1. **Wykrywanie**: Zautomatyzowane systemy monitorowania i ostrzegania
2. **Ograniczanie**: Natychmiastowa izolacja dotkniętych systemów
3. **Eradykacja**: Usunięcie zagrożenia i analiza przyczyny źródłowej
4. **Odzyskiwanie**: Bezpieczne przywracanie usług
5. **Powiadomienie**: Terminowa komunikacja z dotkniętymi użytkownikami
6. **Analiza poincydencie**: Kompleksowy przegląd i udoskonalenie

> \[!WARNING]
> If you discover a security vulnerability, please report it immediately to <security@forwardemail.net>.

## Cykl rozwoju zabezpieczeń {#security-development-lifecycle}

```mermaid
flowchart LR
    A[Requirements] --> B[Design]
    B --> C[Implementation]
    C --> D[Verification]
    D --> E[Release]
    E --> F[Maintenance]
    F --> A
    B -.-> G[Threat Modeling]
    C -.-> H[Static Analysis]
    D -.-> I[Security Testing]
    E -.-> J[Final Security Review]
    F -.-> K[Vulnerability Management]
```

Cały kod przechodzi:

* Gromadzenie wymagań bezpieczeństwa
* Modelowanie zagrożeń podczas projektowania
* Bezpieczne praktyki kodowania
* Statyczne i dynamiczne testowanie bezpieczeństwa aplikacji
* Przegląd kodu ze szczególnym uwzględnieniem bezpieczeństwa
* Skanowanie podatności na zależności

## Wzmocnienie serwera {#server-hardening}

Nasz [Konfiguracja Ansible](https://github.com/forwardemail/forwardemail.net/tree/master/ansible) wdraża liczne środki wzmacniające serwer:

* **Dostęp USB wyłączony**: Porty fizyczne są wyłączane przez umieszczenie modułu jądra usb-storage na czarnej liście
* **Zasady zapory**: Surowe reguły iptables zezwalające tylko na niezbędne połączenia
* **Utrwalanie SSH**: Tylko uwierzytelnianie oparte na kluczach, brak logowania hasłem, logowanie root wyłączone
* **Izolacja usługi**: Każda usługa działa z minimalnymi wymaganymi uprawnieniami
* **Automatyczne aktualizacje**: Poprawki bezpieczeństwa są stosowane automatycznie
* **Bezpieczny rozruch**: Zweryfikowany proces rozruchu w celu zapobiegania manipulacjom
* **Utrwalanie jądra**: Bezpieczne parametry jądra i konfiguracje sysctl
* **Ograniczenia systemu plików**: Opcje montowania noexec, nosuid i nodev, jeśli są odpowiednie
* **Wyłączone zrzuty pamięci**: System skonfigurowany w celu zapobiegania zrzutom pamięci ze względów bezpieczeństwa
* **Wyłączona wymiana**: Wyłączona pamięć wymiany w celu zapobiegania wyciekom danych
* **Ochrona skanowania portów**: Automatyczne wykrywanie i blokowanie prób skanowania portów
* **Przezroczysty Ogromne strony wyłączone**: THP wyłączone w celu poprawy wydajności i bezpieczeństwa
* **Utwardzanie usług systemowych**: Usługi nieistotne, takie jak Apport wyłączone
* **Zarządzanie użytkownikami**: Zasada najmniejszych uprawnień z oddzielnymi użytkownikami wdrażania i devops
* **Limit deskryptora pliku**: Zwiększone limity w celu poprawy wydajności i bezpieczeństwa

## Umowa o poziomie usług {#service-level-agreement}

Utrzymujemy wysoki poziom dostępności i niezawodności usług. Nasza infrastruktura jest zaprojektowana pod kątem redundancji i tolerancji błędów, aby zapewnić, że Twoja usługa poczty e-mail pozostanie operacyjna. Chociaż nie publikujemy formalnego dokumentu SLA, zobowiązujemy się do:

* 99,9%+ czasu sprawności wszystkich usług
* Szybka reakcja na zakłócenia w świadczeniu usług
* Przejrzysta komunikacja w trakcie incydentów
* Regularna konserwacja w okresach niskiego ruchu

## Bezpieczeństwo Open Source {#open-source-security}

Jako [usługa typu open source](https://github.com/forwardemail/forwardemail.net) nasze bezpieczeństwo jest zapewnione dzięki:

* Przejrzysty kod, który może być audytowany przez każdego
* Ulepszenia bezpieczeństwa wprowadzane przez społeczność
* Szybka identyfikacja i łatanie luk
* Brak bezpieczeństwa poprzez niejasność

## Bezpieczeństwo pracowników {#employee-security}

* Kontrole przeszłości wszystkich pracowników
* Szkolenia w zakresie świadomości bezpieczeństwa
* Zasada dostępu z najmniejszymi uprawnieniami
* Regularne szkolenia w zakresie bezpieczeństwa

## Ciągłe doskonalenie {#continuous-improvement}

Ciągle udoskonalamy nasze standardy bezpieczeństwa poprzez:

* Monitorowanie trendów bezpieczeństwa i pojawiających się zagrożeń
* Regularny przegląd i aktualizacje zasad bezpieczeństwa
* Opinie od badaczy bezpieczeństwa i użytkowników
* Udział w społeczności bezpieczeństwa

Aby uzyskać więcej informacji na temat naszych praktyk bezpieczeństwa lub zgłosić obawy dotyczące bezpieczeństwa, skontaktuj się z nami pod adresem <security@forwardemail.net>.

## Dodatkowe zasoby {#additional-resources}

* [Polityka prywatności](https://forwardemail.net/en/privacy)
* [Warunki korzystania z usługi](https://forwardemail.net/en/terms)
* [Zgodność z RODO](https://forwardemail.net/gdpr)
* [Umowa o przetwarzaniu danych (DPA)](https://forwardemail.net/dpa)
* [Zgłoś nadużycie](https://forwardemail.net/en/report-abuse)
* [Polityka bezpieczeństwa](https://github.com/forwardemail/.github/blob/main/SECURITY.md)
* [Security.txt](https://forwardemail.net/security.txt)
* [Repozytorium GitHub](https://github.com/forwardemail/forwardemail.net)
* [FAQ](https://forwardemail.net/en/faq)