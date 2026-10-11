# Przewodnik po poczcie webowej Forward Email {#forward-email-webmail-guide}

<p class="lead mt-3">
  <strong>TL;DR:</strong> <a href="https://mail.forwardemail.net" target="_blank" rel="noopener noreferrer">Poczta webowa</a> to miejsce, w którym czytasz i wysyłasz pocztę. <a href="/my-account/domains">Panel internetowy</a> to miejsce, w którym konfigurujesz domeny, aliasy i hasła. Do poczty webowej logujesz się adresem aliasu i hasłem wygenerowanym w panelu. Poczta webowa jest bezpłatna i <a href="/faq#do-you-offer-a-webmail-client">otwartoźródłowa</a>, a ta sama aplikacja działa w przeglądarce, na komputerze, na telefonie i w terminalu.
</p>


## Spis treści {#table-of-contents}

* [Gdzie znaleźć pocztę webową](#where-to-get-webmail)
* [Poczta webowa a panel internetowy](#webmail-and-the-web-dashboard)
* [Logowanie](#signing-in)
  * [Wygeneruj hasło aliasu](#generate-an-alias-password)
  * [Zaloguj się do poczty webowej](#sign-in-to-webmail)
* [Korzystanie z więcej niż jednego konta](#using-more-than-one-account)
  * [Wysyłanie jako inne zalogowane konto](#send-as-another-signed-in-account)
* [Wysyłanie z dowolnego adresu w Twojej domenie](#send-from-any-address-on-your-domain)
  * [Krok 1: Wygeneruj hasło catch-all w panelu](#step-1-generate-a-catch-all-password-in-the-dashboard)
  * [Krok 2: Zapisz je w poczcie webowej](#step-2-save-it-in-webmail)
  * [Krok 3: Wybierz adres podczas pisania wiadomości](#step-3-pick-the-address-when-you-compose)
  * [Co warto wiedzieć o wysyłaniu przez catch-all](#what-to-know-about-catch-all-sending)
* [Ustawienia poczty webowej w skrócie](#webmail-settings-at-a-glance)
* [Prywatność i App Lock](#privacy-and-app-lock)
* [Rozwiązywanie problemów](#troubleshooting)


## Gdzie znaleźć pocztę webową {#where-to-get-webmail}

| Platforma                        | Gdzie                                                                                                                         |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Przeglądarka                     | <a href="https://mail.forwardemail.net" target="_blank" rel="noopener noreferrer">mail.forwardemail.net</a> (bez instalacji) |
| Komputer (macOS, Windows, Linux) | Nasza <a href="/download">strona pobierania</a>                                                                               |
| Telefon (Android, iOS)           | Nasza <a href="/download">strona pobierania</a>                                                                               |
| Terminal                         | Polecenie `forwardemail`. Zobacz [Czy macie aplikację terminalową](/faq#do-you-have-a-terminal-app)                           |

Wszystkie są budowane z tego samego otwartoźródłowego projektu, więc wszystko w tym przewodniku dotyczy każdej z nich. Ustawienia i zapisane hasła są przechowywane na każdym urządzeniu osobno, więc skonfiguruj je na każdym urządzeniu, z którego korzystasz.


## Poczta webowa a panel internetowy {#webmail-and-the-web-dashboard}

Forward Email ma dwa osobne miejsca logowania, które używają różnych danych logowania:

|                           | Panel internetowy (forwardemail.net)                                                                  | Poczta webowa (mail.forwardemail.net i aplikacje)                                   |
| ------------------------- | ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| **Logowanie za pomocą**   | Adresu e-mail i hasła Twojego konta Forward Email (oraz 2FA lub klucza dostępu)                        | Adresu aliasu (np. `you@example.com`) i wygenerowanego dla niego hasła              |
| **Służy do**              | Dodawania domen, DNS, aliasów, płatności, członków zespołu, generowania haseł, Ustawień zaawansowanych | Czytania i wysyłania poczty, folderów, etykiet, wyszukiwania, kalendarza, kontaktów, filtrów |
| **Hasła tworzone tutaj**  | Hasła aliasów i hasła catch-all                                                                       | Brak. Poczta webowa używa haseł utworzonych w panelu                                |

Typowa konfiguracja wygląda tak:

1. W panelu dodaj swoją domenę i skonfiguruj DNS.
2. Utwórz alias z włączonym przechowywaniem IMAP (na przykład `you@example.com`).
3. Wygeneruj hasło dla tego aliasu.
4. Zaloguj się do poczty webowej tym aliasem i hasłem.

Aby wysyłać pocztę, Twoja domena musi też mieć włączony wychodzący SMTP w <a href="/my-account/domains">Moje konto <i class="fa fa-angle-right"></i> Domeny</a> <i class="fa fa-angle-right"></i> Ustawienia zaawansowane <i class="fa fa-angle-right"></i> Konfiguracja SMTP wychodzącego, tak samo jak w przypadku każdego innego klienta poczty.


## Logowanie {#signing-in}

### Wygeneruj hasło aliasu {#generate-an-alias-password}

1. Przejdź do <a href="/my-account/domains">Moje konto <i class="fa fa-angle-right"></i> Domeny</a> <i class="fa fa-angle-right"></i> Aliasy.
2. Obok aliasu kliknij **Wygeneruj hasło**.
3. Skopiuj hasło. Jest wyświetlane tylko raz.

To jest to samo hasło, którego używasz do IMAP, POP3, SMTP, CalDAV i CardDAV. Nie służy do logowania do panelu internetowego.

### Zaloguj się do poczty webowej {#sign-in-to-webmail}

Otwórz pocztę webową i wpisz pełny adres aliasu oraz wygenerowane hasło. Jeśli najpierw chcesz się tylko rozejrzeć, wypróbuj wersję demo z ekranu logowania.


## Korzystanie z więcej niż jednego konta {#using-more-than-one-account}

Możesz być zalogowany do kilku aliasów jednocześnie, nawet w różnych domenach. Przełączaj się między nimi w menu konta, a zarządzaj nimi w **Settings <i class="fa fa-angle-right"></i> General <i class="fa fa-angle-right"></i> Your accounts**. Konta są przechowywane na urządzeniu, na którym je dodano, i nie są synchronizowane.

### Wysyłanie jako inne zalogowane konto {#send-as-another-signed-in-account}

Podczas pisania wiadomości menu **From** pokazuje każde konto zalogowane na tym urządzeniu. Wybierz jedno, aby wysłać z tego adresu. Wiadomość jest wysyłana z własnym hasłem tego konta, a kopia trafia do folderu Wysłane (Sent) tego konta.


## Wysyłanie z dowolnego adresu w Twojej domenie {#send-from-any-address-on-your-domain}

Jeśli jesteś właścicielem domeny, możesz wysyłać z dowolnego adresu w tej domenie, na przykład `billing@example.com` lub `no-reply@example.com`, bez tworzenia aliasu i logowania się dla każdego z nich. Służy do tego **hasło catch-all** dla domeny.

**Nie** logujesz się do poczty webowej jako konto wieloznaczne ani catch-all i nie ma żadnej funkcji do włączenia. Zapisujesz hasło catch-all raz w ustawieniach poczty webowej, a potem menu **From** pozwala wpisać dowolny adres w tej domenie.

### Krok 1: Wygeneruj hasło catch-all w panelu {#step-1-generate-a-catch-all-password-in-the-dashboard}

1. Przejdź do <a href="/my-account/domains">Moje konto <i class="fa fa-angle-right"></i> Domeny</a> i wybierz swoją domenę.
2. Otwórz **Ustawienia zaawansowane** i znajdź **Hasła uniwersalne**.
3. Kliknij **Wygeneruj hasło**. Zostaw pole puste, aby otrzymać silne losowe hasło, i jeśli chcesz, dodaj opis (na przykład "Poczta webowa na moim laptopie").
4. Skopiuj hasło. Jest wyświetlane tylko raz.

Aby zobaczyć tę sekcję, musisz być administratorem domeny. Użyj **Zarządzaj hasłami** w tym samym miejscu, aby później wyświetlić lub usunąć hasła catch-all. Usunięte hasło przestaje działać wszędzie tam, gdzie zostało zapisane.

### Krok 2: Zapisz je w poczcie webowej {#step-2-save-it-in-webmail}

1. W poczcie webowej otwórz **Settings <i class="fa fa-angle-right"></i> General**.
2. Znajdź kartę **Send from any address**, tuż pod **Your accounts**.
3. Kliknij **Add catch-all password**.
4. Wpisz domenę (na przykład `example.com`) i wklej hasło catch-all.
5. Kliknij **Save**. Zobaczysz komunikat "You can now send from any address @example.com".

Możesz zapisać hasła dla dowolnej liczby domen. Aby usunąć jedno z nich, kliknij ikonę kosza obok niego.

### Krok 3: Wybierz adres podczas pisania wiadomości {#step-3-pick-the-address-when-you-compose}

1. Rozpocznij nową wiadomość.
2. Otwórz menu **From**. Pod zalogowanymi kontami znajduje się pozycja dla każdej zapisanej domeny: **Other address @example.com…**
3. Wybierz ją. Wiersz From zmienia się w pole tekstowe z `@example.com` na końcu.
4. Wpisz część przed @ (na przykład `billing`) i wyślij.

Wersje robocze zapamiętują wpisany adres, więc zapisana wersja robocza otwiera się ponownie z tym samym adresem From.

### Co warto wiedzieć o wysyłaniu przez catch-all {#what-to-know-about-catch-all-sending}

* **Może tylko wysyłać.** Hasło catch-all działa wyłącznie przy wysyłaniu. Nie może otworzyć skrzynki pocztowej, więc nie przeczytasz nim poczty dla `billing@example.com`. Aby czytać odpowiedzi, utwórz alias (lub alias catch-all przekazujący pocztę do Ciebie) dla tego adresu.
* **Kopie wysłanych wiadomości trafiają do konta, którego używasz.** Wiadomość wysłana jako `billing@example.com` trafia do folderu Wysłane (Sent) konta, z którego ją napisano.
* **Działa z każdego konta na urządzeniu.** Zapisane hasło nie jest powiązane z jednym zalogowanym kontem. Może go używać każde konto na tym urządzeniu.
* **Zostaje na tym urządzeniu.** Hasło jest przechowywane tylko na urządzeniu, na którym je zapisano. Nie jest synchronizowane, a parowanie urządzeń przez kod QR go nie kopiuje. Dodaj je ponownie na każdym urządzeniu.
* **App Lock je chroni.** Jeśli App Lock jest włączony, hasło jest szyfrowane razem z pozostałymi danymi lokalnymi, a pozycje **Other address** są ukryte, gdy aplikacja jest zablokowana.
* **Planowanie wysyłki nie jest dostępne** dla adresów wysyłanych za pomocą hasła catch-all, ponieważ to hasło nie może odczytać ani anulować zaplanowanej wiadomości. Wyślij od razu albo wyślij jako zalogowane konto.
* **Błędne hasło Cię nie wyloguje.** Jeśli hasło catch-all jest nieprawidłowe lub zostało usunięte w panelu, wysyłanie kończy się błędem, a Ty pozostajesz zalogowany.


## Ustawienia poczty webowej w skrócie {#webmail-settings-at-a-glance}

| Sekcja                 | Co obejmuje                                                                                       |
| ---------------------- | ------------------------------------------------------------------------------------------------- |
| **General**            | Twoje konta, wysyłanie z dowolnego adresu (hasła catch-all), powiadomienia, pamięć                |
| **Appearance**         | Motyw, układ, gęstość, domyślne ustawienia edytora, podpis, czcionka, linki zewnętrzne            |
| **Privacy & Security** | App Lock, szyfrowanie PGP, opcje prywatności, zgłaszanie spamu                                    |
| **Folders & Labels**   | Foldery specjalne, Twoje foldery, etykiety                                                        |
| **Filters**            | Filtry poczty dla zalogowanego aliasu                                                             |
| **Calendar**           | Początek tygodnia i zadania                                                                       |
| **Search**             | Indeksowanie wyszukiwania, stan indeksu, zapisane wyszukiwania, operatory wyszukiwania           |
| **Advanced**           | Pamięć skrzynki pocztowej, lokalna pamięć podręczna i resetowanie aplikacji                       |
| **Keyboard Shortcuts** | Wszystkie skróty                                                                                  |
| **About & Help**       | Wersja, pobieranie aplikacji na komputer, opinie i linki                                          |

Rzeczy należące do samej domeny lub aliasu, takie jak DNS, odbiorcy przekazywania, limity pamięci, autorespondery urlopowe, hasła catch-all i skanowanie spamu, ustawia się w <a href="/my-account/domains">panelu internetowym</a>.


## Prywatność i App Lock {#privacy-and-app-lock}

Poczta webowa przechowuje lokalną kopię Twojej poczty, dzięki czemu działa szybko i offline. **App Lock** (w **Settings <i class="fa fa-angle-right"></i> Privacy & Security**) szyfruje te dane lokalne, Twoje ustawienia i zapisane hasła na urządzeniu, a odblokowuje się kluczem dostępu lub kodem PIN. Poczta i aktualizacje na żywo przechodzą bezpośrednio między aplikacją a Forward Email, bez żadnych usług reklamowych ani śledzących pośrodku.


## Rozwiązywanie problemów {#troubleshooting}

**"Can't send as <name@example.com>: sign in to that account on this device again, or save its domain's catch-all password in Settings."**

Poczta webowa nie ma na tym urządzeniu hasła dla tego adresu. Zaloguj się do tego aliasu albo zapisz hasło catch-all domeny w **Settings <i class="fa fa-angle-right"></i> General <i class="fa fa-angle-right"></i> Send from any address**. Jeśli aplikacja jest zablokowana, najpierw ją odblokuj.

**W menu From brakuje pozycji "Other address".**

Sprawdź, czy zapisano hasło catch-all na tym urządzeniu i czy App Lock jest odblokowany.

**Wysyłanie z adresu catch-all kończy się błędem uwierzytelniania.**

Hasło catch-all mogło zostać usunięte lub błędnie wpisane. Wygeneruj nowe w panelu, a następnie usuń stare w poczcie webowej i dodaj nowe.

**Moje hasło do panelu nie działa w poczcie webowej.**

Poczta webowa wymaga hasła aliasu, a nie hasła do panelu. Zobacz [Wygeneruj hasło aliasu](#generate-an-alias-password).

Nadal masz problem? Zajrzyj do naszego <a href="/faq">FAQ</a> lub <a href="/help">skontaktuj się z nami</a>.
