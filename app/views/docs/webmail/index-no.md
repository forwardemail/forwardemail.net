# Forward Email webmail-veiledning {#forward-email-webmail-guide}

<p class="lead mt-3">
  <strong>TL;DR:</strong> <a href="https://mail.forwardemail.net" target="_blank" rel="noopener noreferrer">Webmail</a> er der du leser og sender e-post. <a href="/my-account/domains">Nettdashbordet</a> er der du setter opp domener, aliaser og passord. Du logger på webmail med en aliasadresse og et passord generert i dashbordet. Webmail er gratis og <a href="/faq#do-you-offer-a-webmail-client">åpen kildekode</a>, og den samme appen kjører i nettleseren, på datamaskin, på mobil og i en terminal.
</p>


## Innholdsfortegnelse {#table-of-contents}

* [Hvor du får webmail](#where-to-get-webmail)
* [Webmail og nettdashbordet](#webmail-and-the-web-dashboard)
* [Pålogging](#signing-in)
  * [Generer et aliaspassord](#generate-an-alias-password)
  * [Logg på webmail](#sign-in-to-webmail)
* [Bruke mer enn én konto](#using-more-than-one-account)
  * [Send som en annen pålogget konto](#send-as-another-signed-in-account)
* [Send fra hvilken som helst adresse på domenet ditt](#send-from-any-address-on-your-domain)
  * [Trinn 1: Generer et catch-all-passord i dashbordet](#step-1-generate-a-catch-all-password-in-the-dashboard)
  * [Trinn 2: Lagre det i webmail](#step-2-save-it-in-webmail)
  * [Trinn 3: Velg adressen når du skriver](#step-3-pick-the-address-when-you-compose)
  * [Dette bør du vite om sending med catch-all](#what-to-know-about-catch-all-sending)
* [Webmail-innstillinger i korte trekk](#webmail-settings-at-a-glance)
* [Personvern og App Lock](#privacy-and-app-lock)
* [Feilsøking](#troubleshooting)


## Hvor du får webmail {#where-to-get-webmail}

| Plattform                          | Hvor                                                                                                                          |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Nettleser                          | <a href="https://mail.forwardemail.net" target="_blank" rel="noopener noreferrer">mail.forwardemail.net</a> (ingen installasjon) |
| Datamaskin (macOS, Windows, Linux) | Vår <a href="/download">nedlastingsside</a>                                                                                    |
| Mobil (Android, iOS)               | Vår <a href="/download">nedlastingsside</a>                                                                                    |
| Terminal                           | Kommandoen `forwardemail`. Se [Har dere en terminalapp](/faq#do-you-have-a-terminal-app)                                       |

Alle er bygget fra det samme åpen kildekode-prosjektet, så alt i denne veiledningen gjelder for hver av dem. Innstillinger og lagrede passord lagres på hver enhet, så sett dem opp på alle enhetene du bruker.


## Webmail og nettdashbordet {#webmail-and-the-web-dashboard}

Forward Email har to separate steder å logge på, og de bruker forskjellige påloggingsopplysninger:

|                            | Nettdashbord (forwardemail.net)                                                                    | Webmail (mail.forwardemail.net og appene)                                     |
| -------------------------- | -------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| **Logg på med**            | E-postadressen og passordet til Forward Email-kontoen din (pluss 2FA eller en passnøkkel)          | En aliasadresse (som `you@example.com`) og det genererte passordet for den    |
| **Brukes til**             | Legge til domener, DNS, aliaser, fakturering, teammedlemmer, generere passord, Avanserte innstillinger | Lese og sende e-post, mapper, etiketter, søk, kalender, kontakter, filtre |
| **Passord som lages her**  | Aliaspassord og catch-all-passord                                                                  | Ingen. Webmail bruker passordene du laget i dashbordet                        |

Et vanlig oppsett ser slik ut:

1. Legg til domenet ditt i dashbordet og sett opp DNS.
2. Opprett et alias med IMAP-lagring slått på (for eksempel `you@example.com`).
3. Generer et passord for det aliaset.
4. Logg på webmail med det aliaset og passordet.

For å sende e-post må domenet ditt også ha utgående SMTP slått på under <a href="/my-account/domains">Min konto <i class="fa fa-angle-right"></i> Domener</a> <i class="fa fa-angle-right"></i> Avanserte innstillinger <i class="fa fa-angle-right"></i> Utgående SMTP-konfigurasjon, på samme måte som for alle andre e-postklienter.


## Pålogging {#signing-in}

### Generer et aliaspassord {#generate-an-alias-password}

1. Gå til <a href="/my-account/domains">Min konto <i class="fa fa-angle-right"></i> Domener</a> <i class="fa fa-angle-right"></i> Aliaser.
2. Klikk **Generer passord** ved siden av aliaset.
3. Kopier passordet. Det vises bare én gang.

Dette er det samme passordet du ville brukt for IMAP, POP3, SMTP, CalDAV og CardDAV. Det kan ikke brukes til å logge på nettdashbordet.

### Logg på webmail {#sign-in-to-webmail}

Åpne webmail og skriv inn hele aliasadressen og det genererte passordet. Hvis du bare vil se deg rundt først, kan du prøve demoen fra påloggingsskjermen.


## Bruke mer enn én konto {#using-more-than-one-account}

Du kan være logget på flere aliaser samtidig, selv på forskjellige domener. Bytt mellom dem fra kontomenyen, og administrer dem i **Settings <i class="fa fa-angle-right"></i> General <i class="fa fa-angle-right"></i> Your accounts**. Kontoer lagres på enheten du la dem til på, og synkroniseres ikke.

### Send som en annen pålogget konto {#send-as-another-signed-in-account}

Når du skriver en melding, viser **From**-menyen alle kontoer som er pålogget på denne enheten. Velg én for å sende fra den adressen. Meldingen sendes med den kontoens eget passord, og kopien havner i Sendt-mappen (Sent) til den kontoen.


## Send fra hvilken som helst adresse på domenet ditt {#send-from-any-address-on-your-domain}

Hvis du eier et domene, kan du sende fra hvilken som helst adresse på det, for eksempel `billing@example.com` eller `no-reply@example.com`, uten å opprette et alias og logge på for hver av dem. Dette gjør du med et **catch-all-passord** for domenet.

Du logger **ikke** på webmail som en jokertegn- eller catch-all-konto, og det finnes ingen funksjon å slå på. Du lagrer catch-all-passordet én gang i webmail-innstillingene, og deretter lar **From**-menyen deg skrive inn hvilken som helst adresse på det domenet.

### Trinn 1: Generer et catch-all-passord i dashbordet {#step-1-generate-a-catch-all-password-in-the-dashboard}

1. Gå til <a href="/my-account/domains">Min konto <i class="fa fa-angle-right"></i> Domener</a> og velg domenet ditt.
2. Åpne **Avanserte innstillinger** og finn **Oppfangende passord**.
3. Klikk **Generer passord**. La feltet stå tomt for å få et sterkt tilfeldig passord, og legg gjerne til en beskrivelse (for eksempel "Webmail på laptopen min").
4. Kopier passordet. Det vises bare én gang.

Du må være administrator for domenet for å se denne delen. Bruk **Administrer passord** på samme sted for å se eller slette catch-all-passord senere. Hvis du sletter et, slutter det å virke overalt der det er lagret.

### Trinn 2: Lagre det i webmail {#step-2-save-it-in-webmail}

1. Åpne **Settings <i class="fa fa-angle-right"></i> General** i webmail.
2. Finn kortet som heter **Send from any address**, rett under **Your accounts**.
3. Klikk **Add catch-all password**.
4. Skriv inn domenet (for eksempel `example.com`) og lim inn catch-all-passordet.
5. Klikk **Save**. Du vil se "You can now send from any address @example.com".

Du kan lagre passord for så mange domener du vil. For å fjerne et, klikk på søppelbøtteikonet ved siden av det.

### Trinn 3: Velg adressen når du skriver {#step-3-pick-the-address-when-you-compose}

1. Start en ny melding.
2. Åpne **From**-menyen. Under de påloggede kontoene dine finnes det en oppføring for hvert lagrede domene: **Other address @example.com…**
3. Velg den. From-linjen blir til en tekstboks med `@example.com` etter seg.
4. Skriv inn delen før @ (for eksempel `billing`) og send.

Utkast husker adressen du skrev inn, så et lagret utkast åpnes igjen med den samme From-adressen.

### Dette bør du vite om sending med catch-all {#what-to-know-about-catch-all-sending}

* **Det kan bare sende.** Et catch-all-passord fungerer bare for sending. Det kan ikke åpne en postkasse, så du kan ikke lese e-post for `billing@example.com` med det. For å lese svar, opprett et alias (eller et catch-all-alias som videresender til deg) for den adressen.
* **Sendte kopier havner i kontoen du bruker.** En melding sendt som `billing@example.com` legges i Sendt-mappen (Sent) til kontoen du skrev den fra.
* **Det fungerer fra alle kontoer på enheten.** Det lagrede passordet er ikke knyttet til én pålogget konto. Alle kontoer på den enheten kan bruke det.
* **Det blir på denne enheten.** Passordet lagres bare på enheten der du lagret det. Det synkroniseres ikke, og QR-paring av enheter kopierer det ikke. Legg det til på nytt på hver enhet.
* **App Lock beskytter det.** Hvis App Lock er på, krypteres passordet sammen med resten av de lokale dataene dine, og **Other address**-oppføringene skjules mens appen er låst.
* **Planlagt sending er ikke tilgjengelig** for adresser som sendes med et catch-all-passord, fordi det passordet ikke kan lese tilbake eller avbryte en planlagt melding. Send med en gang, eller send som en pålogget konto.
* **Et feil passord logger deg ikke ut.** Hvis catch-all-passordet er feil eller er slettet i dashbordet, mislykkes sendingen med en feilmelding, og du forblir pålogget.


## Webmail-innstillinger i korte trekk {#webmail-settings-at-a-glance}

| Del                    | Hva den dekker                                                                          |
| ---------------------- | --------------------------------------------------------------------------------------- |
| **General**            | Kontoene dine, send fra hvilken som helst adresse (catch-all-passord), varsler, lagring |
| **Appearance**         | Tema, oppsett, tetthet, standarder for skriving, signatur, skrift, eksterne lenker       |
| **Privacy & Security** | App Lock, PGP-kryptering, personvernvalg, rapportering av spam                          |
| **Folders & Labels**   | Spesialmapper, mappene dine, etiketter                                                  |
| **Filters**            | E-postfiltre for det påloggede aliaset                                                  |
| **Calendar**           | Ukestart og oppgaver                                                                    |
| **Search**             | Søkeindeksering, indekshelse, lagrede søk, søkeoperatorer                               |
| **Advanced**           | Postkasselagring, lokal hurtigbuffer og tilbakestilling av appen                        |
| **Keyboard Shortcuts** | Alle hurtigtaster                                                                       |
| **About & Help**       | Versjon, nedlasting av datamaskinapp, tilbakemelding og lenker                          |

Ting som hører til selve domenet eller aliaset, som DNS, videresendingsmottakere, lagringsgrenser, fraværsmeldinger, catch-all-passord og spamskanning, angis i <a href="/my-account/domains">nettdashbordet</a>.


## Personvern og App Lock {#privacy-and-app-lock}

Webmail beholder en lokal kopi av e-posten din, slik at den er rask og fungerer frakoblet. **App Lock** (i **Settings <i class="fa fa-angle-right"></i> Privacy & Security**) krypterer de lokale dataene, innstillingene dine og de lagrede passordene dine på enheten, og låses opp med en passnøkkel eller en PIN-kode. E-post og sanntidsoppdateringer går direkte mellom appen og Forward Email, uten reklame- eller sporingstjenester imellom.


## Feilsøking {#troubleshooting}

**"Can't send as <name@example.com>: sign in to that account on this device again, or save its domain's catch-all password in Settings."**

Webmail har ikke noe passord for den adressen på denne enheten. Logg enten på det aliaset, eller lagre domenets catch-all-passord i **Settings <i class="fa fa-angle-right"></i> General <i class="fa fa-angle-right"></i> Send from any address**. Hvis appen er låst, lås den opp først.

**Oppføringen "Other address" mangler i From-menyen.**

Sjekk at du har lagret catch-all-passordet på denne enheten, og at App Lock er låst opp.

**Sending fra en catch-all-adresse mislykkes med en autentiseringsfeil.**

Catch-all-passordet kan ha blitt slettet eller skrevet feil. Generer et nytt i dashbordet, fjern deretter det gamle i webmail og legg til det nye.

**Dashbordpassordet mitt fungerer ikke i webmail.**

Webmail trenger et aliaspassord, ikke dashbordpassordet ditt. Se [Generer et aliaspassord](#generate-an-alias-password).

Står du fortsatt fast? Se vår <a href="/faq">FAQ</a> eller <a href="/help">kontakt oss</a>.
