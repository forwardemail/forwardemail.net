# Polityka prywatności {#privacy-policy}

<img loading="lazy" src="/img/articles/privacy.webp" alt="Forward Email privacy policy" class="rounded-lg" />

## Spis treści {#table-of-contents}

* [Zastrzeżenie](#disclaimer)
* [Informacje nie zostały zebrane](#information-not-collected)
* [Zebrane informacje](#information-collected)
* [Udostępniane informacje](#information-shared)
* [Usuwanie informacji](#information-removal)
* [Dodatkowe ujawnienia](#additional-disclosures)

## Zastrzeżenie {#disclaimer}

Proszę odnieść się do naszego [Warunki](/terms), ponieważ dotyczy ono całej witryny.

## Informacje nie zostały zebrane {#information-not-collected}

**Z wyjątkiem [błędy](/faq#do-you-store-error-logs), [wychodzące wiadomości e-mail SMTP](/faq#do-you-support-sending-email-with-smtp) i/lub wykrycia spamu lub złośliwej aktywności (np. w celu ograniczenia przepustowości):**

* Nie przechowujemy żadnych przesłanych wiadomości e-mail na dysku ani w bazach danych.
* Nie przechowujemy żadnych metadanych dotyczących wiadomości e-mail na dysku ani w bazach danych.
* Nie przechowujemy żadnych logów ani adresów IP na dysku ani w bazach danych.

## Zebrane informacje {#information-collected}

Aby zapewnić przejrzystość, w każdej chwili możesz <a href="https://github.com/forwardemail" target="_blank" rel="noopener noreferrer">zobaczyć nasz kod źródłowy</a>, aby zobaczyć, w jaki sposób gromadzone i wykorzystywane są poniższe informacje:

**Wyłącznie w celu zapewnienia funkcjonalności i poprawy jakości naszych usług zbieramy i bezpiecznie przechowujemy następujące informacje:**

* Przechowujemy wiadomości e-mail i informacje z kalendarza w [zaszyfrowana baza danych SQLite](/blog/docs/best-quantum-safe-encrypted-email-service) wyłącznie w celu zapewnienia dostępu IMAP/POP3/CalDAV/CardDAV oraz funkcjonalności skrzynki pocztowej.
* Należy pamiętać, że jeśli korzystasz wyłącznie z naszych usług przekierowania wiadomości e-mail, wiadomości nie są przechowywane na dysku ani w bazie danych, jak opisano w [Informacje nie zostały zebrane](#information-not-collected).
* Nasze usługi przekierowania wiadomości e-mail działają wyłącznie w pamięci (bez zapisu na dysku ani w bazach danych).
* Dane przechowywane w pamięci IMAP/POP3/CalDAV/CardDAV są szyfrowane w stanie spoczynku, szyfrowane w trakcie przesyłania i przechowywane na zaszyfrowanym dysku LUKS.
* Kopie zapasowe pamięci IMAP/POP3/CalDAV/CardDAV są szyfrowane w stanie spoczynku, szyfrowane w trakcie przesyłania i przechowywane na [Cloudflare R2](https://www.cloudflare.com/developer-platform/r2/).
* Przechowujemy plik cookie w sesji dla ruchu w witrynie. * Przechowujemy Twój adres e-mail, który nam przekazujesz.
* Przechowujemy Twoje nazwy domen, aliasy i konfiguracje, które nam przekazujesz.
* Przechowujemy kody odpowiedzi SMTP `4xx` i `5xx` [dzienniki błędów](/faq#do-you-store-error-logs) przez 7 dni.
* Przechowujemy kod [wychodzące wiadomości e-mail SMTP](/faq#do-you-support-sending-email-with-smtp) przez \~30 dni.
* Ta długość różni się w zależności od nagłówka „Data”, ponieważ zezwalamy na wysyłanie wiadomości e-mail w przyszłości, jeśli istnieje przyszły nagłówek „Data”. * **Pamiętaj, że po pomyślnym dostarczeniu wiadomości e-mail lub wystąpieniu trwałego błędu, usuniemy jej treść.**
* Jeśli chcesz skonfigurować przechowywanie treści wiadomości wychodzącej SMTP dłużej niż domyślnie 0 dni (po pomyślnym dostarczeniu lub wystąpieniu trwałego błędu), przejdź do Ustawień zaawansowanych dla swojej domeny i wprowadź wartość od `0` do `30`.
* Niektórzy użytkownicy chętnie korzystają z funkcji podglądu [Moje konto > E-maile](/my-account/emails), aby zobaczyć, jak renderowane są ich wiadomości e-mail, dlatego obsługujemy konfigurowalny okres przechowywania.
* Pamiętaj, że obsługujemy również __PROTECTED_LINK_30__0.
* Wszelkie dodatkowe informacje, które dobrowolnie nam przekazujesz, takie jak komentarze lub pytania przesłane do nas e-mailem lub na naszej stronie <a href="/help">pomocy</a>.

## Udostępniono informacje {#information-shared}

Nie udostępniamy Twoich danych żadnym stronom trzecim. Nie korzystamy również z usług analitycznych ani telemetrycznych innych firm.

Być może będziemy musieli zastosować się do nakazów prawnych nakazanych przez sąd i na pewno to zrobimy (należy jednak pamiętać o [nie gromadzimy informacji wymienionych powyżej w sekcji „Informacje niegromadzone”](#information-not-collected), ponieważ w takim przypadku nie będziemy mogli go udostępnić).

## Usuwanie informacji {#information-removal}

Jeśli w dowolnym momencie zechcesz usunąć informacje, które nam przekazałeś, przejdź do <a href="/my-account/security">Moje konto > Bezpieczeństwo</a> i kliknij „Usuń konto”.

Ze względu na działania mające na celu zapobieganie nadużyciom i ich łagodzenie, Twoje konto może wymagać ręcznego usunięcia przez naszych administratorów, jeśli usuniesz je w ciągu 5 dni od pierwszej płatności.

Proces ten trwa zazwyczaj mniej niż 24 godziny i został wprowadzony, ponieważ użytkownicy wysyłali spam za pomocą naszej usługi, a następnie szybko usuwali swoje konta – co uniemożliwiło nam zablokowanie ich odcisków palców metod płatności w Stripe.

## Dodatkowe ujawnienia {#additional-disclosures}

Ta witryna jest chroniona przez Cloudflare i obowiązują jej uprawnienia [Polityka prywatności](https://www.cloudflare.com/privacypolicy/) i [Warunki korzystania z usługi](https://www.cloudflare.com/website-terms/).