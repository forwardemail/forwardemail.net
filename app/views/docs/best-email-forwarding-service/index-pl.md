# Jak Forward Email chroni Twoją prywatność, domenę i bezpieczeństwo: techniczne zagłębienie {#how-forward-email-protects-your-privacy-domain-and-security-the-technical-deep-dive}

<img loading="lazy" src="/img/articles/email-forwarding.webp" alt="Najlepsze porównanie usług przekazywania e-maili" class="rounded-lg" />


## Spis treści {#table-of-contents}

* [Przedmowa](#foreword)
* [Filozofia prywatności Forward Email](#the-forward-email-privacy-philosophy)
* [Implementacja SQLite: trwałość i przenośność Twoich danych](#sqlite-implementation-durability-and-portability-for-your-data)
* [Inteligentna kolejka i mechanizm ponawiania: zapewnienie dostarczenia e-maili](#smart-queue-and-retry-mechanism-ensuring-email-delivery)
* [Nieograniczone zasoby z inteligentnym ograniczaniem szybkości](#unlimited-resources-with-intelligent-rate-limiting)
* [Szyfrowanie w piaskownicy dla zwiększonego bezpieczeństwa](#sandboxed-encryption-for-enhanced-security)
* [Przetwarzanie e-maili w pamięci: brak zapisu na dysku dla maksymalnej prywatności](#in-memory-email-processing-no-disk-storage-for-maximum-privacy)
* [Szyfrowanie end-to-end z OpenPGP dla pełnej prywatności](#end-to-end-encryption-with-openpgp-for-complete-privacy)
* [Wielowarstwowa ochrona treści dla kompleksowego bezpieczeństwa](#multi-layered-content-protection-for-comprehensive-security)
* [Czym różnimy się od innych usług e-mail: techniczna przewaga prywatności](#how-we-differ-from-other-email-services-the-technical-privacy-advantage)
  * [Przejrzystość open source dla weryfikowalnej prywatności](#open-source-transparency-for-verifiable-privacy)
  * [Brak uzależnienia od dostawcy dla prywatności bez kompromisów](#no-vendor-lock-in-for-privacy-without-compromise)
  * [Dane w piaskownicy dla prawdziwej izolacji](#sandboxed-data-for-true-isolation)
  * [Przenośność i kontrola danych](#data-portability-and-control)
* [Techniczne wyzwania prywatnego przekazywania e-maili](#the-technical-challenges-of-privacy-first-email-forwarding)
  * [Zarządzanie pamięcią dla przetwarzania e-maili bez logów](#memory-management-for-no-logging-email-processing)
  * [Wykrywanie spamu bez analizy treści dla filtrowania z poszanowaniem prywatności](#spam-detection-without-content-analysis-for-privacy-preserving-filtering)
  * [Utrzymanie kompatybilności z projektem nastawionym na prywatność](#maintaining-compatibility-with-privacy-first-design)
* [Najlepsze praktyki prywatności dla użytkowników Forward Email](#privacy-best-practices-for-forward-email-users)
* [Podsumowanie: przyszłość prywatnego przekazywania e-maili](#conclusion-the-future-of-private-email-forwarding)


## Przedmowa {#foreword}

W dzisiejszym cyfrowym świecie prywatność e-maili stała się ważniejsza niż kiedykolwiek. W obliczu wycieków danych, obaw o nadzór i reklam ukierunkowanych na podstawie treści e-maili, użytkownicy coraz częściej poszukują rozwiązań, które stawiają prywatność na pierwszym miejscu. W Forward Email zbudowaliśmy naszą usługę od podstaw, mając prywatność jako fundament naszej architektury. Ten wpis na blogu przedstawia techniczne implementacje, które czynią naszą usługę jedną z najbardziej skoncentrowanych na prywatności rozwiązań do przekazywania e-maili dostępnych na rynku.


## Filozofia prywatności Forward Email {#the-forward-email-privacy-philosophy}

Zanim zagłębimy się w szczegóły techniczne, ważne jest, aby zrozumieć naszą podstawową filozofię prywatności: **Twoje e-maile należą do Ciebie i tylko do Ciebie**. Ta zasada kieruje każdą decyzją techniczną, którą podejmujemy, od sposobu obsługi przekazywania e-maili po implementację szyfrowania.

W przeciwieństwie do wielu dostawców e-maili, którzy skanują Twoje wiadomości w celach reklamowych lub przechowują je bezterminowo na swoich serwerach, Forward Email działa według radykalnie innego podejścia:

1. **Przetwarzanie wyłącznie w pamięci** – nie zapisujemy Twoich przekazywanych e-maili na dysku
2. **Brak przechowywania metadanych** – nie prowadzimy rejestrów, kto z kim się komunikuje
3. **100% open-source** – cały nasz kod jest przejrzysty i audytowalny
4. **Szyfrowanie end-to-end** – wspieramy OpenPGP dla naprawdę prywatnej komunikacji


## Implementacja SQLite: trwałość i przenośność Twoich danych {#sqlite-implementation-durability-and-portability-for-your-data}

Jedną z najważniejszych przewag prywatności Forward Email jest nasza starannie zaprojektowana implementacja [SQLite](https://en.wikipedia.org/wiki/SQLite). Dopracowaliśmy SQLite za pomocą specyficznych ustawień PRAGMA oraz [Write-Ahead Logging (WAL)](https://en.wikipedia.org/wiki/Write-ahead_logging), aby zapewnić zarówno trwałość, jak i przenośność Twoich danych, jednocześnie utrzymując najwyższe standardy prywatności i bezpieczeństwa.
Oto, jak zaimplementowaliśmy SQLite z [ChaCha20-Poly1305](https://en.wikipedia.org/wiki/ChaCha20-Poly1305) jako szyfrem dla kwantowo-odpornego szyfrowania:

```javascript
// Initialize the database with better-sqlite3-multiple-ciphers
const Database = require('better-sqlite3-multiple-ciphers');

// Set up encryption with ChaCha20-Poly1305 cipher
db.pragma(`key="${decrypt(session.user.password)}"`);

// Enable Write-Ahead Logging for durability and performance
db.pragma('journal_mode=WAL');

// Overwrite deleted content with zeros for privacy
db.pragma('secure_delete=ON');

// Enable auto vacuum for efficient storage management
db.pragma('auto_vacuum=FULL');

// Set busy timeout for handling concurrent access
db.pragma(`busy_timeout=${config.busyTimeout}`);

// Optimize synchronization for reliability
db.pragma('synchronous=NORMAL');

// Enable foreign key constraints for data integrity
db.pragma('foreign_keys=ON');

// Set UTF-8 encoding for international character support
db.pragma(`encoding='UTF-8'`);

// Optimize database performance
db.pragma('optimize=0x10002;');

// Use disk for temporary storage instead of memory
db.pragma('temp_store=1;');
```

Ta implementacja zapewnia, że Twoje dane są nie tylko bezpieczne, ale także przenośne. Możesz w każdej chwili zabrać swoją pocztę, eksportując ją w formatach [MBOX](https://en.wikipedia.org/wiki/Email#Storage), [EML](https://en.wikipedia.org/wiki/Email#Storage) lub SQLite. A gdy chcesz usunąć swoje dane, są one naprawdę usuwane – po prostu usuwamy pliki z dysku zamiast wykonywać polecenia SQL DELETE ROW, które mogą pozostawiać ślady w bazie danych.

Kwantowy aspekt szyfrowania naszej implementacji wykorzystuje ChaCha20-Poly1305 jako szyfr podczas inicjalizacji bazy danych, zapewniając silną ochronę przed obecnymi i przyszłymi zagrożeniami dla prywatności Twoich danych.


## Inteligentna kolejka i mechanizm ponawiania: zapewnienie dostarczenia e-maili {#smart-queue-and-retry-mechanism-ensuring-email-delivery}

Zamiast skupiać się wyłącznie na obsłudze nagłówków, zaimplementowaliśmy zaawansowaną inteligentną kolejkę i mechanizm ponawiania z naszą metodą `getBounceInfo`. System ten zapewnia, że Twoje e-maile mają najlepszą szansę na dostarczenie, nawet gdy pojawią się tymczasowe problemy.

```javascript
function getBounceInfo(err) {
  // Initialize bounce info with default values
  const bounceInfo = {
    action: err.responseCode >= 500 ? 'reject' : 'defer',
    category: err.category || 'other',
    message: err.message,
    code: err.responseCode || err.code
  };

  // Analyze error response to determine appropriate action
  const response = err.response || err.message || '';

  // Determine if the issue is temporary or permanent
  if (response.includes('temporarily deferred') ||
      response.includes('try again later')) {
    bounceInfo.action = 'defer';
  }

  // Categorize the bounce reason for appropriate handling
  if (response.includes('mailbox full')) {
    bounceInfo.category = 'full';
    bounceInfo.action = 'defer';
  } else if (response.includes('user unknown')) {
    bounceInfo.category = 'unknown';
  }

  return bounceInfo;
}
```

> \[!NOTE]
> To jest fragment metody `getBounceInfo`, a nie pełna, rozbudowana implementacja. Pełny kod możesz przejrzeć na [GitHub](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/get-bounce-info.js).

Ponawiamy dostarczanie poczty przez 5 dni, podobnie jak standardy branżowe takie jak [Postfix](https://en.wikipedia.org/wiki/Postfix_\(software\)), dając czas na rozwiązanie tymczasowych problemów. To podejście znacząco poprawia wskaźniki dostarczenia, jednocześnie zachowując prywatność.

Podobnie, po pomyślnym dostarczeniu e-maili SMTP wychodzących, redagujemy treść wiadomości. Jest to skonfigurowane w naszym systemie przechowywania z domyślnym okresem przechowywania wynoszącym 30 dni, który możesz dostosować w Zaawansowanych ustawieniach swojej domeny. Po tym okresie treść e-maila jest automatycznie redagowana i usuwana, pozostawiając jedynie zastępczą wiadomość:

```txt
This message was successfully sent. It has been redacted and purged for your security and privacy. If you would like to increase your message retention time, please go to the Advanced Settings page for your domain.
```
To podejście zapewnia, że wysłane przez Ciebie e-maile nie będą przechowywane w nieskończoność, co zmniejsza ryzyko naruszenia danych lub nieautoryzowanego dostępu do Twojej korespondencji.


## Nieograniczone zasoby z inteligentnym ograniczaniem szybkości {#unlimited-resources-with-intelligent-rate-limiting}

Chociaż Forward Email oferuje nieograniczoną liczbę domen i aliasów, wdrożyliśmy inteligentne ograniczanie szybkości, aby chronić nasz system przed nadużyciami i zapewnić uczciwe korzystanie wszystkim użytkownikom. Na przykład klienci niekorporacyjni mogą tworzyć do 50+ aliasów dziennie, co zapobiega spamowaniu i zalewaniu naszej bazy danych oraz pozwala naszym funkcjom ochrony i wykrywania nadużyć działać skutecznie.

```javascript
// Rate limiter implementation
const rateLimiter = new RateLimiter({
  // Configuration settings
});

// Check rate limits before processing
const limit = await rateLimiter.get({
  key: `domain:${domain.id}`,
  duration: ms('1d')
});

// Apply appropriate action based on limit status
if (limit.remaining <= 0) {
  // Handle rate limit exceeded
}
```

To zrównoważone podejście daje Ci elastyczność tworzenia tylu adresów e-mail, ile potrzebujesz do kompleksowego zarządzania prywatnością, jednocześnie utrzymując integralność i wydajność naszej usługi dla wszystkich użytkowników.


## Szyfrowanie w piaskownicy dla zwiększonego bezpieczeństwa {#sandboxed-encryption-for-enhanced-security}

Nasze unikalne podejście do szyfrowania w piaskownicy zapewnia kluczową przewagę bezpieczeństwa, którą wielu użytkowników pomija przy wyborze usługi e-mail. Przyjrzyjmy się, dlaczego izolacja danych, zwłaszcza e-maili, jest tak ważna.

Usługi takie jak Gmail i Proton najprawdopodobniej korzystają ze wspólnych [baz danych relacyjnych](https://en.wikipedia.org/wiki/Relational_database), co tworzy fundamentalną lukę bezpieczeństwa. W środowisku wspólnej bazy danych, jeśli ktoś uzyska dostęp do danych jednego użytkownika, potencjalnie ma też drogę do dostępu do danych innych użytkowników. Dzieje się tak, ponieważ wszystkie dane użytkowników znajdują się w tych samych tabelach bazy danych, oddzielone jedynie identyfikatorami użytkowników lub podobnymi znacznikami.

Forward Email stosuje zupełnie inne podejście z naszym szyfrowaniem w piaskownicy:

1. **Całkowita izolacja**: Dane każdego użytkownika są przechowywane w osobnym zaszyfrowanym pliku bazy danych SQLite, całkowicie odizolowanym od innych użytkowników
2. **Niezależne klucze szyfrowania**: Każda baza danych jest szyfrowana własnym unikalnym kluczem pochodzącym z hasła użytkownika
3. **Brak współdzielonego magazynu**: W przeciwieństwie do baz relacyjnych, gdzie wszystkie e-maile użytkowników mogą znajdować się w jednej tabeli "emails", nasze podejście zapewnia brak mieszania danych
4. **Obrona w głębi**: Nawet jeśli baza danych jednego użytkownika zostałaby w jakiś sposób naruszona, nie dałoby to dostępu do danych innych użytkowników

To podejście w piaskownicy jest podobne do przechowywania Twojej poczty w osobnym fizycznym sejfie, a nie w wspólnym magazynie z wewnętrznymi przegrodami. To fundamentalna różnica architektoniczna, która znacząco zwiększa Twoją prywatność i bezpieczeństwo.


## Przetwarzanie e-maili w pamięci: brak zapisu na dysku dla maksymalnej prywatności {#in-memory-email-processing-no-disk-storage-for-maximum-privacy}

W naszej usłudze przekazywania e-maili przetwarzamy wiadomości całkowicie w pamięci RAM i nigdy nie zapisujemy ich na dysku ani w bazach danych. Takie podejście zapewnia niezrównaną ochronę przed inwigilacją e-maili i zbieraniem metadanych.

Oto uproszczony opis działania naszego przetwarzania e-maili:

```javascript
async function onData(stream, _session, fn) {
  // Store clone of session since it gets modified/destroyed
  const session = JSON.parse(safeStringify(_session));

  try {
    // Process the email stream in memory
    const messageSplitter = new MessageSplitter({
      maxBytes: MAX_BYTES
    });
    stream.pipe(messageSplitter);
    const body = await getStream.buffer(messageSplitter);

    const { headers } = messageSplitter;

    // Update session object with useful debug info for error logs
    await updateSession.call(this, body, headers, session);

    // Process the email without storing to disk
    // [Processing code omitted for brevity]

    // Return success without persisting email data
    fn();
  } catch (err) {
    // Handle errors without storing sensitive information
    fn(err);
  }
}
```
To podejście oznacza, że nawet jeśli nasze serwery zostałyby naruszone, nie byłoby żadnych historycznych danych e-mailowych, do których mogliby mieć dostęp atakujący. Twoje e-maile po prostu przechodzą przez nasz system i są natychmiast przekazywane do miejsca docelowego, nie pozostawiając śladu. To podejście do przekazywania e-maili bez logowania jest podstawą ochrony Twojej komunikacji przed inwigilacją.


## Szyfrowanie end-to-end z OpenPGP dla pełnej prywatności {#end-to-end-encryption-with-openpgp-for-complete-privacy}

Dla użytkowników, którzy wymagają najwyższego poziomu ochrony prywatności przed inwigilacją e-maili, wspieramy [OpenPGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy) do szyfrowania end-to-end. W przeciwieństwie do wielu dostawców e-maili, którzy wymagają własnościowych mostków lub aplikacji, nasza implementacja działa ze standardowymi klientami poczty, czyniąc bezpieczną komunikację dostępną dla każdego.

Oto jak implementujemy szyfrowanie OpenPGP:

```javascript
async function encryptMessage(pubKeyArmored, raw, isArmored = true) {
  // [Initial validation code omitted for brevity]

  // Read the public key
  const pubKey = isArmored
    ? await openpgp.readKey({
        armoredKey: tools.prepareArmoredPubKey(pubKeyArmored),
        config: { tolerant: true }
      })
    : pubKeyArmored;

  if (!pubKey) throw new TypeError('Public key does not exist');

  // Perform the actual encryption using OpenPGP
  const ciphertext = await openpgp.encrypt({
    message: await openpgp.createMessage({
      binary: Buffer.concat([Buffer.from(bodyHeaders + '\r\n\r\n'), body])
    }),
    encryptionKeys: pubKey,
    format: 'armored',
    config: { minRSABits: 1024 }
  });

  // Format the encrypted message as a proper MIME message
  // [MIME formatting code omitted for brevity]

  return Buffer.concat([headers, breaker, Buffer.from(text)]);
}
```

Ta implementacja zapewnia, że Twoje e-maile są szyfrowane zanim opuszczą Twoje urządzenie i mogą być odszyfrowane tylko przez zamierzonego odbiorcę, utrzymując Twoją komunikację w prywatności nawet przed nami. Jest to niezbędne do ochrony wrażliwej korespondencji przed nieautoryzowanym dostępem i inwigilacją.


## Wielowarstwowa ochrona treści dla kompleksowego bezpieczeństwa {#multi-layered-content-protection-for-comprehensive-security}

Forward Email oferuje wiele warstw ochrony treści, które są domyślnie włączone, aby zapewnić kompleksowe bezpieczeństwo przed różnymi zagrożeniami:

1. **Ochrona przed treściami dla dorosłych** – Filtruje nieodpowiednie treści bez naruszania prywatności  
2. **Ochrona przed [phishingiem](https://en.wikipedia.org/wiki/Phishing)** – Blokuje próby wyłudzenia informacji, zachowując anonimowość  
3. **Ochrona przed plikami wykonywalnymi** – Zapobiega potencjalnie szkodliwym załącznikom bez skanowania treści  
4. **Ochrona przed [wirusami](https://en.wikipedia.org/wiki/Computer_virus)** – Skanuje pod kątem złośliwego oprogramowania, stosując techniki chroniące prywatność  

W przeciwieństwie do wielu dostawców, którzy oferują te funkcje jako opcjonalne, my uczyniliśmy je domyślnie włączonymi z możliwością wyłączenia, zapewniając, że wszyscy użytkownicy korzystają z tych zabezpieczeń. To podejście odzwierciedla nasze zaangażowanie zarówno w prywatność, jak i bezpieczeństwo, oferując równowagę, której wiele usług e-mail nie potrafi osiągnąć.


## Czym różnimy się od innych usług e-mail: techniczna przewaga prywatności {#how-we-differ-from-other-email-services-the-technical-privacy-advantage}

Porównując Forward Email z innymi usługami e-mail, kilka kluczowych różnic technicznych podkreśla nasze podejście z priorytetem na prywatność:

### Transparentność open source dla weryfikowalnej prywatności {#open-source-transparency-for-verifiable-privacy}

Podczas gdy wielu dostawców e-mail twierdzi, że jest open source, często ich kod backendowy pozostaje zamknięty. Forward Email jest w 100% [open source](https://en.wikipedia.org/wiki/Open_source), obejmując zarówno kod frontendowy, jak i backendowy. Ta transparentność pozwala na niezależny audyt bezpieczeństwa wszystkich komponentów, zapewniając, że nasze deklaracje dotyczące prywatności mogą być zweryfikowane przez każdego.

### Brak uzależnienia od dostawcy dla prywatności bez kompromisów {#no-vendor-lock-in-for-privacy-without-compromise}

Wielu dostawców skupionych na prywatności wymaga używania ich własnościowych aplikacji lub mostków. Forward Email działa z dowolnym standardowym klientem poczty za pomocą protokołów [IMAP](https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol), [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol) oraz [SMTP](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol), dając Ci swobodę wyboru preferowanego oprogramowania pocztowego bez kompromisów w zakresie prywatności.
### Sandboxed Data for True Isolation {#sandboxed-data-for-true-isolation}

W przeciwieństwie do usług korzystających ze współdzielonych baz danych, gdzie dane wszystkich użytkowników są mieszane, nasze podejście sandbox zapewnia całkowitą izolację danych każdego użytkownika. Ta fundamentalna różnica architektoniczna zapewnia znacznie silniejsze gwarancje prywatności niż większość usług e-mail.

### Data Portability and Control {#data-portability-and-control}

Wierzymy, że Twoje dane należą do Ciebie, dlatego ułatwiamy eksportowanie Twoich e-maili w standardowych formatach (MBOX, EML, SQLite) oraz prawdziwe usuwanie danych, kiedy tylko chcesz. Ten poziom kontroli jest rzadkością wśród dostawców e-mail, ale niezbędny dla prawdziwej prywatności.


## The Technical Challenges of Privacy-First Email Forwarding {#the-technical-challenges-of-privacy-first-email-forwarding}

Budowa usługi e-mail z priorytetem na prywatność wiąże się ze znaczącymi wyzwaniami technicznymi. Oto niektóre z przeszkód, które pokonaliśmy:

### Memory Management for No-Logging Email Processing {#memory-management-for-no-logging-email-processing}

Przetwarzanie e-maili w pamięci bez zapisu na dysku wymaga starannego zarządzania pamięcią, aby efektywnie obsłużyć duże natężenie ruchu e-mailowego. Wdrożyliśmy zaawansowane techniki optymalizacji pamięci, aby zapewnić niezawodną wydajność bez kompromisów w naszej polityce braku przechowywania danych, co jest kluczowym elementem naszej strategii ochrony prywatności.

### Spam Detection Without Content Analysis for Privacy-Preserving Filtering {#spam-detection-without-content-analysis-for-privacy-preserving-filtering}

Większość systemów wykrywania [spamu](https://en.wikipedia.org/wiki/Email_spam) opiera się na analizie treści e-maili, co stoi w sprzeczności z naszymi zasadami prywatności. Opracowaliśmy techniki identyfikacji wzorców spamu bez czytania zawartości Twoich wiadomości, osiągając równowagę między prywatnością a użytecznością, która zachowuje poufność Twojej korespondencji.

### Maintaining Compatibility with Privacy-First Design {#maintaining-compatibility-with-privacy-first-design}

Zapewnienie kompatybilności ze wszystkimi klientami e-mail przy jednoczesnym wdrażaniu zaawansowanych funkcji prywatności wymagało kreatywnych rozwiązań inżynieryjnych. Nasz zespół pracował niestrudzenie, aby prywatność była bezproblemowa, dzięki czemu nie musisz wybierać między wygodą a bezpieczeństwem podczas ochrony swojej korespondencji e-mailowej.


## Privacy Best Practices for Forward Email Users {#privacy-best-practices-for-forward-email-users}

Aby zmaksymalizować ochronę przed inwigilacją e-mailową i zwiększyć prywatność podczas korzystania z Forward Email, zalecamy następujące najlepsze praktyki:

1. **Używaj unikalnych aliasów dla różnych usług** - Twórz inny alias e-mailowy dla każdej usługi, na którą się rejestrujesz, aby zapobiec śledzeniu między usługami
2. **Włącz szyfrowanie OpenPGP** - W przypadku wrażliwej korespondencji korzystaj z szyfrowania end-to-end, aby zapewnić pełną prywatność
3. **Regularnie zmieniaj swoje aliasy e-mailowe** - Okresowo aktualizuj aliasy dla ważnych usług, aby zminimalizować długoterminowe gromadzenie danych
4. **Używaj silnych, unikalnych haseł** - Chroń swoje konto Forward Email silnym hasłem, aby zapobiec nieautoryzowanemu dostępowi
5. **Stosuj [anonimizację adresu IP](https://en.wikipedia.org/wiki/IP_address)** - Rozważ użycie [VPN](https://en.wikipedia.org/wiki/Virtual_private_network) w połączeniu z Forward Email dla pełnej anonimowości


## Conclusion: The Future of Private Email Forwarding {#conclusion-the-future-of-private-email-forwarding}

W Forward Email wierzymy, że prywatność to nie tylko funkcja — to fundamentalne prawo. Nasze implementacje techniczne odzwierciedlają to przekonanie, oferując przekierowywanie e-maili, które szanuje Twoją prywatność na każdym poziomie i chroni Cię przed inwigilacją e-mailową oraz zbieraniem metadanych.

W miarę jak rozwijamy i ulepszamy naszą usługę, nasze zobowiązanie do prywatności pozostaje niezachwiane. Nieustannie badamy nowe metody szyfrowania, eksplorujemy dodatkowe zabezpieczenia prywatności i udoskonalamy naszą bazę kodu, aby zapewnić możliwie najbezpieczniejsze doświadczenie e-mailowe.

Wybierając Forward Email, nie wybierasz tylko usługi e-mail — wspierasz wizję internetu, w którym prywatność jest domyślna, a nie wyjątkiem. Dołącz do nas w budowaniu bardziej prywatnej cyfrowej przyszłości, jeden e-mail na raz.
<!-- *Keywords: private email forwarding, email privacy protection, secure email service, open-source email, quantum-safe encryption, OpenPGP email, in-memory email processing, no-log email service, email metadata protection, email header privacy, end-to-end encrypted email, privacy-first email, anonymous email forwarding, email security best practices, email content protection, phishing protection, email virus scanning, privacy-focused email provider, secure email headers, email privacy implementation, protection from email surveillance, no-logging email forwarding, prevent email metadata leakage, email privacy techniques, IP address anonymization for email, private email aliases, email forwarding security, email privacy from advertisers, quantum-resistant email encryption, email privacy without compromise, SQLite email storage, sandboxed email encryption, data portability for email* -->

