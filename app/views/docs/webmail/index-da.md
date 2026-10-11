# Forward Email webmail-guide {#forward-email-webmail-guide}

<p class="lead mt-3">
  <strong>TL;DR:</strong> <a href="https://mail.forwardemail.net" target="_blank" rel="noopener noreferrer">Webmail</a> er der, hvor du læser og sender mail. <a href="/my-account/domains">Webdashboardet</a> er der, hvor du opsætter domæner, aliasser og adgangskoder. Du logger ind på webmail med en aliasadresse og en adgangskode, der er genereret i dashboardet. Webmail er gratis og <a href="/faq#do-you-offer-a-webmail-client">open source</a>, og den samme app kører i browseren, på computeren, på mobilen og i en terminal.
</p>


## Indholdsfortegnelse {#table-of-contents}

* [Hvor du får webmail](#where-to-get-webmail)
* [Webmail og webdashboardet](#webmail-and-the-web-dashboard)
* [Log ind](#signing-in)
  * [Generer en alias-adgangskode](#generate-an-alias-password)
  * [Log ind på webmail](#sign-in-to-webmail)
* [Brug af mere end én konto](#using-more-than-one-account)
  * [Send som en anden indlogget konto](#send-as-another-signed-in-account)
* [Send fra enhver adresse på dit domæne](#send-from-any-address-on-your-domain)
  * [Trin 1: Generer en catch-all-adgangskode i dashboardet](#step-1-generate-a-catch-all-password-in-the-dashboard)
  * [Trin 2: Gem den i webmail](#step-2-save-it-in-webmail)
  * [Trin 3: Vælg adressen, når du skriver](#step-3-pick-the-address-when-you-compose)
  * [Det skal du vide om catch-all-afsendelse](#what-to-know-about-catch-all-sending)
* [Webmail-indstillinger i overblik](#webmail-settings-at-a-glance)
* [Privatliv og App Lock](#privacy-and-app-lock)
* [Fejlfinding](#troubleshooting)


## Hvor du får webmail {#where-to-get-webmail}

| Platform                        | Hvor                                                                                                                       |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Browser                         | <a href="https://mail.forwardemail.net" target="_blank" rel="noopener noreferrer">mail.forwardemail.net</a> (ingen installation) |
| Computer (macOS, Windows, Linux) | Vores <a href="/download">downloadside</a>                                                                                |
| Mobil (Android, iOS)            | Vores <a href="/download">downloadside</a>                                                                                 |
| Terminal                        | Kommandoen `forwardemail`. Se [Har I en terminalapp](/faq#do-you-have-a-terminal-app)                                      |

Alle er bygget fra det samme open source-projekt, så alt i denne guide gælder for hver af dem. Indstillinger og gemte adgangskoder gemmes på hver enhed, så sæt dem op på alle de enheder, du bruger.


## Webmail og webdashboardet {#webmail-and-the-web-dashboard}

Forward Email har to separate steder at logge ind, og de bruger forskellige loginoplysninger:

|                               | Webdashboard (forwardemail.net)                                                                                | Webmail (mail.forwardemail.net og apps)                                         |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| **Log ind med**               | E-mail og adgangskode til din Forward Email-konto (plus 2FA eller en passkey)                                  | En aliasadresse (f.eks. `you@example.com`) og dens genererede adgangskode       |
| **Bruges til**                | Tilføjelse af domæner, DNS, aliasser, fakturering, teammedlemmer, generering af adgangskoder, Avancerede indstillinger | Læse og sende mail, mapper, etiketter, søgning, kalender, kontakter, filtre |
| **Adgangskoder oprettet her** | Alias-adgangskoder og catch-all-adgangskoder                                                                   | Ingen. Webmail bruger de adgangskoder, du har oprettet i dashboardet            |

En typisk opsætning ser sådan ud:

1. Tilføj dit domæne i dashboardet, og opsæt DNS.
2. Opret et alias med IMAP-lagring slået til (for eksempel `you@example.com`).
3. Generer en adgangskode til det alias.
4. Log ind på webmail med det alias og den adgangskode.

For at sende mail skal dit domæne også have udgående SMTP slået til under <a href="/my-account/domains">Min konto <i class="fa fa-angle-right"></i> Domæner</a> <i class="fa fa-angle-right"></i> Avancerede indstillinger <i class="fa fa-angle-right"></i> Udgående SMTP-konfiguration, ligesom for enhver anden e-mailklient.


## Log ind {#signing-in}

### Generer en alias-adgangskode {#generate-an-alias-password}

1. Gå til <a href="/my-account/domains">Min konto <i class="fa fa-angle-right"></i> Domæner</a> <i class="fa fa-angle-right"></i> Aliasser.
2. Klik på **Generer adgangskode** ud for aliasset.
3. Kopiér adgangskoden. Den vises kun én gang.

Det er den samme adgangskode, som du ville bruge til IMAP, POP3, SMTP, CalDAV og CardDAV. Den kan ikke bruges til at logge ind på webdashboardet.

### Log ind på webmail {#sign-in-to-webmail}

Åbn webmail, og indtast den fulde aliasadresse og den genererede adgangskode. Hvis du bare vil se dig omkring først, så prøv demoen fra loginskærmen.


## Brug af mere end én konto {#using-more-than-one-account}

Du kan være logget ind på flere aliasser på én gang, også på forskellige domæner. Skift mellem dem fra kontomenuen, og administrer dem under **Settings <i class="fa fa-angle-right"></i> General <i class="fa fa-angle-right"></i> Your accounts**. Konti gemmes på den enhed, hvor du tilføjede dem, og synkroniseres ikke.

### Send som en anden indlogget konto {#send-as-another-signed-in-account}

Når du skriver en besked, viser menuen **From** alle konti, der er logget ind på denne enhed. Vælg en for at sende som den adresse. Beskeden sendes med den kontos egen adgangskode, og kopien lægges i den kontos mappe Sendt.


## Send fra enhver adresse på dit domæne {#send-from-any-address-on-your-domain}

Hvis du ejer et domæne, kan du sende fra enhver adresse på det, f.eks. `billing@example.com` eller `no-reply@example.com`, uden at oprette et alias og logge ind for hver enkelt. Det gør du med en **catch-all-adgangskode** til domænet.

Du logger **ikke** ind på webmail som en wildcard- eller catch-all-konto, og der er ingen funktion, der skal slås til. Du gemmer catch-all-adgangskoden én gang i webmail-indstillingerne, og derefter kan du skrive enhver adresse på det domæne i From-menuen.

### Trin 1: Generer en catch-all-adgangskode i dashboardet {#step-1-generate-a-catch-all-password-in-the-dashboard}

1. Gå til <a href="/my-account/domains">Min konto <i class="fa fa-angle-right"></i> Domæner</a>, og vælg dit domæne.
2. Åbn **Avancerede indstillinger**, og find **Opfangende adgangskoder**.
3. Klik på **Generer adgangskode**. Lad feltet stå tomt for at få en stærk tilfældig adgangskode, og tilføj en beskrivelse, hvis du vil (for eksempel "Webmail på min bærbare").
4. Kopiér adgangskoden. Den vises kun én gang.

Du skal være administrator for domænet for at se dette afsnit. Brug **Administrer adgangskoder** samme sted til at se eller slette catch-all-adgangskoder senere. Sletter du en, holder den op med at virke alle steder, hvor den er gemt.

### Trin 2: Gem den i webmail {#step-2-save-it-in-webmail}

1. Åbn **Settings <i class="fa fa-angle-right"></i> General** i webmail.
2. Find kortet **Send from any address**, lige under **Your accounts**.
3. Klik på **Add catch-all password**.
4. Indtast domænet (for eksempel `example.com`), og indsæt catch-all-adgangskoden.
5. Klik på **Save**. Du vil se "You can now send from any address @example.com".

Du kan gemme adgangskoder til så mange domæner, du vil. Klik på skraldespandsikonet ved siden af en adgangskode for at fjerne den.

### Trin 3: Vælg adressen, når du skriver {#step-3-pick-the-address-when-you-compose}

1. Start en ny besked.
2. Åbn menuen **From**. Under dine indloggede konti er der en post for hvert gemt domæne: **Other address @example.com…**
3. Vælg den. From-linjen bliver til et tekstfelt med `@example.com` efter.
4. Skriv delen før @ (for eksempel `billing`), og send.

Kladder husker den adresse, du skrev, så en gemt kladde åbnes igen med den samme afsenderadresse.

### Det skal du vide om catch-all-afsendelse {#what-to-know-about-catch-all-sending}

* **Den kan kun sende.** En catch-all-adgangskode virker kun til at sende. Den kan ikke åbne en postkasse, så du kan ikke læse mail til `billing@example.com` med den. Opret et alias (eller et catch-all-alias, der videresender til dig) for den adresse for at læse svar.
* **Sendte kopier går til den konto, du bruger.** En besked sendt som `billing@example.com` lægges i mappen Sendt på den konto, du skrev den fra.
* **Den virker fra alle konti på enheden.** Den gemte adgangskode er ikke bundet til én indlogget konto. Alle konti på enheden kan bruge den.
* **Den bliver på denne enhed.** Adgangskoden gemmes kun på den enhed, hvor du gemte den. Den synkroniseres ikke, og parring af enheder via QR-kode kopierer den ikke. Tilføj den igen på hver enhed.
* **App Lock beskytter den.** Hvis App Lock er slået til, krypteres adgangskoden sammen med resten af dine lokale data, og posterne **Other address** skjules, mens appen er låst.
* **Planlagt afsendelse er ikke tilgængelig** for adresser, der sendes med en catch-all-adgangskode, fordi den adgangskode ikke kan læse en planlagt besked tilbage eller annullere den. Send med det samme, eller send som en indlogget konto.
* **En forkert adgangskode logger dig ikke ud.** Hvis catch-all-adgangskoden er forkert eller er slettet i dashboardet, mislykkes afsendelsen med en fejl, og du forbliver logget ind.


## Webmail-indstillinger i overblik {#webmail-settings-at-a-glance}

| Sektion                | Hvad den dækker                                                                              |
| ---------------------- | -------------------------------------------------------------------------------------------- |
| **General**            | Dine konti, send fra enhver adresse (catch-all-adgangskoder), notifikationer, lagerplads      |
| **Appearance**         | Tema, layout, tæthed, standarder for editoren, signatur, skrifttype, eksterne links          |
| **Privacy & Security** | App Lock, PGP-kryptering, privatlivsindstillinger, spamrapportering                          |
| **Folders & Labels**   | Specialmapper, dine mapper, etiketter                                                        |
| **Filters**            | Mailfiltre for det indloggede alias                                                          |
| **Calendar**           | Ugestart og opgaver                                                                          |
| **Search**             | Søgeindeksering, indekstilstand, gemte søgninger, søgeoperatorer                             |
| **Advanced**           | Postkasselager, lokal cache og nulstilling af appen                                          |
| **Keyboard Shortcuts** | Alle genveje                                                                                 |
| **About & Help**       | Version, download af desktopappen, feedback og links                                         |

Ting, der hører til selve domænet eller aliasset, som DNS, videresendelsesmodtagere, lagergrænser, autosvar ved fravær, catch-all-adgangskoder og spamscanning, indstilles i <a href="/my-account/domains">webdashboardet</a>.


## Privatliv og App Lock {#privacy-and-app-lock}

Webmail gemmer en lokal kopi af din mail, så den er hurtig og virker offline. **App Lock** (under **Settings <i class="fa fa-angle-right"></i> Privacy & Security**) krypterer disse lokale data, dine indstillinger og dine gemte adgangskoder på enheden og låses op med en passkey eller en PIN-kode. Mail og liveopdateringer går direkte mellem appen og Forward Email, uden reklame- eller sporingstjenester imellem.


## Fejlfinding {#troubleshooting}

**"Can't send as <name@example.com>: sign in to that account on this device again, or save its domain's catch-all password in Settings."**

Webmail har ingen adgangskode til den adresse på denne enhed. Log enten ind på det alias, eller gem domænets catch-all-adgangskode under **Settings <i class="fa fa-angle-right"></i> General <i class="fa fa-angle-right"></i> Send from any address**. Hvis appen er låst, så lås den op først.

**Posten "Other address" mangler i From-menuen.**

Tjek, at du har gemt catch-all-adgangskoden på denne enhed, og at App Lock er låst op.

**Afsendelse fra en catch-all-adresse mislykkes med en godkendelsesfejl.**

Catch-all-adgangskoden kan være slettet eller tastet forkert. Generer en ny i dashboardet, fjern derefter den gamle i webmail, og tilføj den nye.

**Min dashboard-adgangskode virker ikke i webmail.**

Webmail kræver en alias-adgangskode, ikke din dashboard-adgangskode. Se [Generer en alias-adgangskode](#generate-an-alias-password).

Sidder du stadig fast? Se vores <a href="/faq">FAQ</a> eller <a href="/help">kontakt os</a>.
