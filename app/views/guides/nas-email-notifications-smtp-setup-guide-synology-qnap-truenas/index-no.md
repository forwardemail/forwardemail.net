# Komplett guide til NAS e-postoppsett med Forward Email {#complete-guide-to-nas-email-setup-with-forward-email}

Å sette opp e-postvarsler på din NAS skal ikke være vanskelig. Enten du har en Synology, QNAP, eller til og med en Raspberry Pi-oppsett, vil denne guiden få enheten din til å kommunisere med Forward Email slik at du faktisk vet når noe går galt.

De fleste NAS-enheter kan sende e-postvarsler for diskfeil, temperaturvarsler, fullførte sikkerhetskopier og sikkerhetshendelser. Problemet? Mange e-postleverandører har blitt kresne på sikkerhet, og eldre enheter klarer ofte ikke å følge med. Det er her Forward Email kommer inn – vi støtter både moderne og eldre enheter.

Denne guiden dekker e-postoppsett for over 75 NAS-leverandører med trinnvise instruksjoner, kompatibilitetsinformasjon og feilsøkingstips. Uansett hvilken enhet du bruker, får vi varslene dine til å fungere.


## Innholdsfortegnelse {#table-of-contents}

* [Hvorfor du trenger NAS e-postvarsler](#why-you-need-nas-email-notifications)
* [TLS-problemet (og hvordan vi fikser det)](#the-tls-problem-and-how-we-fix-it)
* [Forward Email SMTP-innstillinger](#forward-email-smtp-settings)
* [Omfattende kompatibilitetsmatrise for NAS-leverandører](#comprehensive-nas-provider-compatibility-matrix)
* [Synology NAS e-postkonfigurasjon](#synology-nas-email-configuration)
  * [Konfigurasjonstrinn](#configuration-steps)
* [QNAP NAS e-postkonfigurasjon](#qnap-nas-email-configuration)
  * [Konfigurasjonstrinn](#configuration-steps-1)
  * [Vanlige QNAP feilsøkingsproblemer](#common-qnap-troubleshooting-issues)
* [ReadyNAS Legacy-konfigurasjon](#readynas-legacy-configuration)
  * [Legacy konfigurasjonstrinn](#legacy-configuration-steps)
  * [ReadyNAS feilsøking](#readynas-troubleshooting)
* [TerraMaster NAS-konfigurasjon](#terramaster-nas-configuration)
* [ASUSTOR NAS-konfigurasjon](#asustor-nas-configuration)
* [Buffalo TeraStation-konfigurasjon](#buffalo-terastation-configuration)
* [Western Digital My Cloud-konfigurasjon](#western-digital-my-cloud-configuration)
* [TrueNAS e-postkonfigurasjon](#truenas-email-configuration)
* [OpenMediaVault-konfigurasjon](#openmediavault-configuration)
* [Raspberry Pi NAS-konfigurasjon](#raspberry-pi-nas-configuration)
  * [Første oppsett av Raspberry Pi](#initial-raspberry-pi-setup)
  * [Samba fil-deling konfigurasjon](#samba-file-sharing-configuration)
  * [FTP-serveroppsett](#ftp-server-setup)
  * [E-postvarslingskonfigurasjon](#email-notification-configuration)
  * [Avanserte Raspberry Pi NAS-funksjoner](#advanced-raspberry-pi-nas-features)
  * [Raspberry Pi e-postfeilsøking](#raspberry-pi-email-troubleshooting)
  * [Ytelsesoptimalisering](#performance-optimization)
  * [Sikkerhetshensyn](#security-considerations)


## Hvorfor du trenger NAS e-postvarsler {#why-you-need-nas-email-notifications}

Din NAS overvåker masse – diskhelse, temperatur, nettverksproblemer, sikkerhetshendelser. Uten e-postvarsler kan problemer gå ubemerket i flere uker, noe som potensielt kan føre til datatap eller sikkerhetsbrudd.

E-postvarsler gir deg umiddelbare varsler når disker begynner å feile, advarer om uautoriserte tilgangsforsøk, bekrefter vellykkede sikkerhetskopier og holder deg informert om systemets helse. Forward Email sørger for at disse kritiske varslene faktisk når deg.


## TLS-problemet (og hvordan vi fikser det) {#the-tls-problem-and-how-we-fix-it}

Slik er det: hvis NAS-en din ble laget før 2020, støtter den sannsynligvis bare TLS 1.0. Gmail, Outlook og de fleste leverandører sluttet å støtte det for flere år siden. Enheten din prøver å sende e-post, blir avvist, og du står i mørket.

Forward Email løser dette med støtte for to porter. Moderne enheter bruker våre standardporter (`465` og `587`), mens eldre enheter kan bruke våre legacy-porter (`2455` og `2555`) som fortsatt støtter TLS 1.0.

> \[!IMPORTANT]
> Forward Email støtter både moderne og eldre NAS-enheter gjennom vår dual-port-strategi. Bruk portene 465/587 for moderne enheter med TLS 1.2+ støtte, og portene 2455/2555 for eldre enheter som kun støtter TLS 1.0.


## Forward Email SMTP-innstillinger {#forward-email-smtp-settings}
Her er det du trenger å vite om vår SMTP-oppsett:

**For moderne NAS-enheter (2020+):** Bruk `smtp.forwardemail.net` med port `465` (SSL/TLS) eller port `587` (STARTTLS). Disse fungerer med nåværende firmware som støtter TLS 1.2+.

**For eldre NAS-enheter:** Bruk `smtp.forwardemail.net` med port `2455` (SSL/TLS) eller port `2555` (STARTTLS). Disse støtter TLS 1.0 for eldre enheter.

**Autentisering:** Bruk ditt Forward Email-alias som brukernavn og det genererte passordet fra [Min konto -> Domener -> Alias](https://forwardemail.net/my-account/domains) (ikke ditt kontopassord).

> \[!CAUTION]
> Bruk aldri ditt kontopåloggingspassord for SMTP-autentisering. Bruk alltid det genererte passordet fra [Min konto -> Domener -> Alias](https://forwardemail.net/my-account/domains) for NAS-konfigurasjon.

> \[!TIP]
> Sjekk firmwareversjonen og TLS-støtten på din NAS-enhet før konfigurasjon. De fleste enheter produsert etter 2020 støtter moderne TLS-protokoller, mens eldre enheter vanligvis krever porter for eldre kompatibilitet.


## Omfattende kompatibilitetsmatrise for NAS-leverandører {#comprehensive-nas-provider-compatibility-matrix}

Følgende matrise gir detaljert kompatibilitetsinformasjon for store NAS-leverandører, inkludert TLS-støttenivåer, firmwarestatus og anbefalte Forward Email-konfigurasjonsinnstillinger.

| NAS-leverandør   | Nåværende modeller | TLS-støtte | Firmwarestatus | Anbefalte porter | Vanlige problemer                                                                                                                                       | Oppsettsveiledning / Skjermbilder                                                                                                              |
| ---------------- | ------------------ | ---------- | -------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Synology         | DSM 7.x            | TLS 1.2+   | Aktiv          | `465`, `587`     | [STARTTLS-konfigurasjon](https://community.synology.com/enu/forum/2/post/124584)                                                                       | [DSM e-postvarsling oppsett](https://kb.synology.com/en-af/DSM/help/DSM/AdminCenter/system_notification_email)                                |
| QNAP             | QTS 5.x            | TLS 1.2+   | Aktiv          | `465`, `587`     | [Feil i varslingssenteret](https://www.qnap.com/en/how-to/faq/article/email-notifications-fail-after-updating-to-qts-524%E2%80%93fixed-in-qts-525)     | [QTS e-postserverkonfigurasjon](https://docs.qnap.com/operating-system/qts/5.1.x/en-us/configuring-an-email-notification-server-EB4E6D7F.html) |
| Raspberry Pi     | Raspberry Pi OS     | TLS 1.2+   | Aktiv          | `465`, `587`     | [DNS-oppløsningsproblemer](https://www.raspberrypi.org/forums/viewtopic.php?t=294014)                                                                   | [Raspberry Pi e-postoppsett guide](#raspberry-pi-nas-configuration)                                                                             |
| ASUSTOR          | ADM 4.x             | TLS 1.2+   | Aktiv          | `465`, `587`     | [Sertifikatvalidering](https://forum.asustor.com/viewtopic.php?f=134&t=12345)                                                                           | [ASUSTOR varslingsoppsett](https://www.asustor.com/en/online/online_help?id=8)                                                                  |
| TerraMaster      | TOS 6.x             | TLS 1.2    | Aktiv          | `465`, `587`     | [SMTP-autentisering](https://www.terra-master.com/global/forum/)                                                                                       | [TerraMaster e-postkonfigurasjon](https://www.terra-master.com/global/support/download.php)                                                     |
| TrueNAS          | SCALE/CORE          | TLS 1.2+   | Aktiv          | `465`, `587`     | [SSL-sertifikatoppsett](https://www.truenas.com/community/threads/email-notifications-not-working.95234/)                                              | [TrueNAS e-postoppsett guide](https://www.truenas.com/docs/scale/scaletutorials/systemsettings/general/settingupsystememail/)                     |
| Buffalo          | TeraStation         | TLS 1.2    | Begrenset     | `465`, `587`     | [Firmware-kompatibilitet](https://buffaloamericas.com/knowledge-base/configuring-email-notifications-on-a-ts3010-or-ts5010-series-terastation)          | [TeraStation e-postoppsett](https://buffaloamericas.com/knowledge-base/configuring-email-notifications-on-a-ts3010-or-ts5010-series-terastation)  |
| Western Digital  | My Cloud OS 5       | TLS 1.2    | Begrenset     | `465`, `587`     | [Eldre OS-kompatibilitet](https://community.wd.com/t/my-cloud-email-notifications-not-working/265432)                                                  | [My Cloud e-postkonfigurasjon](https://support-en.wd.com/app/answers/detailweb/a_id/10222)                                                      |
| OpenMediaVault   | OMV 7.x             | TLS 1.2+   | Aktiv          | `465`, `587`     | [Plugin-avhengigheter](https://forum.openmediavault.org/index.php?thread/42156-email-notifications-not-working/)                                        | [OMV varslingsoppsett](https://docs.openmediavault.org/en/latest/administration/general/notifications.html)                                   |
| Netgear ReadyNAS | OS 6.x              | TLS 1.0 kun| Utdaterte     | `2455`, `2555`   | [Eldre TLS-støtte](https://kb.netgear.com/23066/How-do-I-manage-my-email-alert-contacts-on-my-ReadyNAS-OS-6-storage-system)                            | [ReadyNAS e-postvarslingsoppsett](https://kb.netgear.com/23066/How-do-I-manage-my-email-alert-contacts-on-my-ReadyNAS-OS-6-storage-system)       |
| Drobo            | Dashboard           | TLS 1.2    | Utdaterte     | `465`, `587`     | [Begrenset støtte](https://myprojects.drobo.com/support/)                                                                                               | [Drobo e-postvarslinger](https://www.drobo.com/support/)                                                                                       |
Denne matrisen demonstrerer den klare inndelingen mellom moderne, aktivt vedlikeholdte NAS-systemer og eldre enheter som krever spesielle kompatibilitetsvurderinger. Flertallet av nåværende NAS-enheter støtter moderne TLS-standarder og kan bruke Forward Emails primære SMTP-porter uten noen spesiell konfigurasjon.


## Synology NAS E-postkonfigurasjon {#synology-nas-email-configuration}

Synology-enheter med DSM er ganske enkle å sette opp. De støtter moderne TLS, så du kan bruke våre standardporter uten problemer.

> \[!NOTE]
> Synology DSM 7.x tilbyr de mest omfattende funksjonene for e-postvarsling. Eldre DSM-versjoner kan ha begrensede konfigurasjonsmuligheter.

### Konfigurasjonstrinn {#configuration-steps}

1. **Åpne DSM-nettgrensesnittet** ved å skrive inn NAS-enhetens IP-adresse eller QuickConnect-ID i en nettleser.

2. **Gå til Kontrollpanel** og velg "Varsling"-seksjonen, deretter klikk på "E-post"-fanen for å få tilgang til e-postkonfigurasjonsalternativene.

3. **Aktiver e-postvarslinger** ved å merke av i boksen "Aktiver e-postvarslinger".

4. **Konfigurer SMTP-serveren** ved å skrive inn `smtp.forwardemail.net` som serveradresse.

5. **Sett portkonfigurasjonen** til port 465 for SSL/TLS-tilkoblinger (anbefalt). Port 587 med STARTTLS støttes også som et alternativ.

6. **Konfigurer autentisering** ved å velge "SMTP-autentisering kreves" og skrive inn ditt Forward Email-alias i brukernavnfeltet.

7. **Skriv inn passordet ditt** ved å bruke passordet generert fra [Min konto -> Domener -> Alias](https://forwardemail.net/my-account/domains).

8. **Sett opp mottakeradresser** ved å skrive inn opptil fem e-postadresser som skal motta varslinger.

9. **Konfigurer varslingsfiltrering** for å kontrollere hvilke hendelser som utløser e-postvarsler, for å unngå overflod av varsler samtidig som kritiske hendelser rapporteres.

10. **Test konfigurasjonen** ved å bruke DSMs innebygde testfunksjon for å verifisere at alle innstillinger er korrekte og at kommunikasjonen med Forward Emails servere fungerer som den skal.

> \[!TIP]
> Synology tillater forskjellige varslings typer for ulike mottakere, noe som gir fleksibilitet i hvordan varsler distribueres i teamet ditt.


## QNAP NAS E-postkonfigurasjon {#qnap-nas-email-configuration}

QNAP-enheter med QTS fungerer utmerket med Forward Email. De støtter moderne TLS og har et fint nettgrensesnitt for konfigurasjon.

> \[!IMPORTANT]
> QNAP QTS 5.2.4 hadde et kjent problem med e-postvarslinger som ble [fikset i QTS 5.2.5](https://www.qnap.com/en/how-to/faq/article/email-notifications-fail-after-updating-to-qts-524%E2%80%93fixed-in-qts-525). Sørg for at fastvaren din er oppdatert for å unngå varslingfeil.

### Konfigurasjonstrinn {#configuration-steps-1}

1. **Åpne QNAP-enhetens nettgrensesnitt** ved å skrive inn IP-adressen i en nettleser.

2. **Gå til Kontrollpanel** og velg "Service Account and Device Pairing", deretter klikk på "E-post"-seksjonen for å starte e-postkonfigurasjonen.

3. **Klikk på "Legg til SMTP-tjeneste"** for å opprette en ny e-postkonfigurasjon.

4. **Konfigurer SMTP-serveren** ved å skrive inn `smtp.forwardemail.net` som SMTP-serveradresse.

5. **Velg riktig sikkerhetsprotokoll** - velg "SSL/TLS" med port `465` (anbefalt). Port `587` med STARTTLS støttes også.

6. **Konfigurer portnummeret** - port `465` med SSL/TLS anbefales. Port `587` med STARTTLS er også tilgjengelig om nødvendig.

7. **Skriv inn autentiseringsinformasjonen** ved å bruke ditt Forward Email-alias som brukernavn og passordet generert fra [Min konto -> Domener -> Alias](https://forwardemail.net/my-account/domains).

8. **Konfigurer avsenderinformasjon** ved å skrive inn et beskrivende navn i "Fra"-feltet, for eksempel "QNAP NAS System" eller enhetens vertsnavn.

9. **Sett opp mottakeradresser** for ulike varslings typer. QNAP lar deg konfigurere flere mottakergrupper for forskjellige varseltyper.

10. **Test konfigurasjonen** ved å bruke QNAPs innebygde e-posttestfunksjon for å verifisere at alle innstillinger fungerer som de skal.

> \[!TIP]
> Hvis du støter på [Gmail SMTP-konfigurasjonsproblemer](https://forum.qnap.com/viewtopic.php?t=152466), gjelder de samme feilsøkingstrinnene for Forward Email. Sørg for at autentisering er riktig aktivert og at legitimasjonen er korrekt.
> \[!NOTE]
> QNAP-enheter støtter avansert varslingstidsplanlegging, som lar deg konfigurere stille timer når ikke-kritiske varsler undertrykkes. Dette er spesielt nyttig i forretningsmiljøer.

### Vanlige QNAP feilsøkingsproblemer {#common-qnap-troubleshooting-issues}

Hvis din QNAP-enhet [ikke klarer å sende varslings-e-poster](https://www.reddit.com/r/qnap/comments/1dc6z03/qnap_nas_will_not_send_notification_emails/), sjekk følgende:

* Bekreft at Forward Email-legitimasjonen din er korrekt
* Sørg for at SMTP-serveradressen er nøyaktig `smtp.forwardemail.net`
* Bekreft at porten samsvarer med krypteringsmetoden din (`465` for SSL/TLS anbefales; `587` for STARTTLS støttes også)
* Sjekk at din [SMTP-serverkonfigurasjon](https://www.qnap.com/en/how-to/faq/article/why-does-notification-center-fail-to-send-emails-to-my-smtp-server) tillater tilkoblingen


## ReadyNAS Legacy-konfigurasjon {#readynas-legacy-configuration}

Netgear ReadyNAS-enheter byr på unike utfordringer på grunn av avsluttet firmware-støtte og avhengighet av eldre TLS 1.0-protokoller. Likevel sikrer Forward Emails legacy-portstøtte at disse enhetene fortsatt kan sende e-postvarsler pålitelig.

> \[!CAUTION]
> ReadyNAS OS 6.x støtter kun TLS 1.0, som krever Forward Emails legacy-kompatible porter `2455` og `2555`. Moderne porter `465` og `587` fungerer ikke med disse enhetene.

### Legacy-konfigurasjonstrinn {#legacy-configuration-steps}

1. **Åpne ReadyNAS webgrensesnitt** ved å skrive inn enhetens IP-adresse i en nettleser.

2. **Naviger til System > Innstillinger > Varsler** for å få tilgang til e-postkonfigurasjonsseksjonen.

3. **Konfigurer SMTP-serveren** ved å skrive inn `smtp.forwardemail.net` som serveradresse.

4. **Sett portkonfigurasjonen** til enten `2455` for SSL/TLS-tilkoblinger eller `2555` for STARTTLS-tilkoblinger – disse er Forward Emails legacy-kompatible porter.

5. **Aktiver autentisering** og skriv inn ditt Forward Email-alias som brukernavn og ditt genererte passord fra [Min konto -> Domener -> Aliaser](https://forwardemail.net/my-account/domains).

6. **Konfigurer avsenderinformasjon** med en beskrivende "Fra"-adresse for å identifisere ReadyNAS-enheten.

7. **Legg til mottaker-e-postadresser** ved å bruke + knappen i e-postkontaktsseksjonen.

8. **Test konfigurasjonen** for å sikre at legacy TLS-tilkoblingen fungerer som den skal.

> \[!IMPORTANT]
> ReadyNAS-enheter krever legacy-portene fordi de ikke kan etablere sikre tilkoblinger med moderne TLS-protokoller. Dette er en [kjent begrensning](https://kb.netgear.com/23066/How-do-I-manage-my-email-alert-contacts-on-my-ReadyNAS-OS-6-storage-system) i den avsluttede firmwaren.

### ReadyNAS feilsøking {#readynas-troubleshooting}

Vanlige problemer med ReadyNAS e-postkonfigurasjon inkluderer:

* **TLS-versjonsavvik**: Sørg for at du bruker portene `2455` eller `2555`, ikke de moderne portene
* **Autentiseringsfeil**: Bekreft at Forward Email-legitimasjonen din er korrekt
* **Nettverkstilkobling**: Sjekk at ReadyNAS kan nå `smtp.forwardemail.net`
* **Firmware-begrensninger**: Noen eldre ReadyNAS-modeller kan ha ekstra [HTTPS-konfigurasjonskrav](https://kb.netgear.com/23100/How-do-I-configure-HTTPS-HTTP-with-SSL-encryption-settings-on-my-ReadyNAS-OS-6-storage-system)

ReadyNAS-enheter som kjører OS 6.x og tidligere versjoner støtter kun TLS 1.0-tilkoblinger, som de fleste moderne e-postleverandører ikke lenger godtar. Forward Emails dedikerte legacy-porter (2455 og 2555) støtter spesifikt disse eldre protokollene, og sikrer fortsatt funksjonalitet for ReadyNAS-brukere.

For å konfigurere e-post på ReadyNAS-enheter, åpne enhetens webgrensesnitt via IP-adressen. Naviger til System-delen og velg "Varsler" for å få tilgang til e-postkonfigurasjonsalternativene.

I e-postkonfigurasjonsseksjonen, aktiver e-postvarsler og skriv inn smtp.forwardemail.net som SMTP-server. Dette er avgjørende – bruk Forward Emails legacy-kompatible porter i stedet for standard SMTP-porter.

For SSL/TLS-tilkoblinger, konfigurer port 2455 i stedet for standardport 465 (anbefalt). For STARTTLS-tilkoblinger, bruk port 2555 i stedet for port 587. Disse spesialportene opprettholder TLS 1.0-kompatibilitet samtidig som de gir best mulig sikkerhet for legacy-enheter.
Skriv inn ditt Forward Email-alias som brukernavn og ditt genererte passord for autentisering. ReadyNAS-enheter støtter SMTP-autentisering, som kreves for Forward Email-tilkoblinger.

Konfigurer avsenderens e-postadresse og mottakeradresser i henhold til dine varslingsbehov. ReadyNAS tillater flere mottakeradresser, slik at du kan distribuere varsler til forskjellige teammedlemmer eller e-postkontoer.

Test konfigurasjonen nøye, da ReadyNAS-enheter kanskje ikke gir detaljerte feilmeldinger hvis konfigurasjonen mislykkes. Hvis standard testing ikke fungerer, kontroller at du bruker de riktige legacy-portene (2455 eller 2555) i stedet for moderne SMTP-porter.

Vurder sikkerhetsimplikasjonene ved bruk av legacy TLS-protokoller. Selv om Forward Emails legacy-porter gir den beste tilgjengelige sikkerheten for eldre enheter, anbefales det å oppgradere til et moderne NAS-system med nåværende TLS-støtte når det er mulig.


## TerraMaster NAS-konfigurasjon {#terramaster-nas-configuration}

TerraMaster-enheter som kjører TOS 6.x støtter moderne TLS og fungerer godt med Forward Emails standardporter.

> \[!NOTE]
> TerraMaster TOS 6.x tilbyr omfattende e-postvarslingsfunksjoner. Sørg for at fastvaren din er oppdatert for best kompatibilitet.

1. **Åpne systeminnstillinger**
   * Logg inn på TerraMaster webgrensesnitt
   * Gå til **Kontrollpanel** > **Varsling**

2. **Konfigurer SMTP-innstillinger**
   * Server: `smtp.forwardemail.net`
   * Port: `465` (SSL/TLS, anbefalt) eller `587` (STARTTLS)
   * Brukernavn: Ditt Forward Email-alias
   * Passord: Generert passord fra [Min konto -> Domener -> Aliaser](https://forwardemail.net/my-account/domains)

3. **Aktiver varslinger**
   * Kryss av for varseltypene du ønsker å motta
   * Test konfigurasjonen med den innebygde testfunksjonen

> \[!TIP]
> TerraMaster-enheter fungerer best med port `465` for SSL/TLS-tilkoblinger (anbefalt). Hvis du opplever problemer, støttes også port `587` med STARTTLS.


## ASUSTOR NAS-konfigurasjon {#asustor-nas-configuration}

ASUSTOR-enheter med ADM 4.x har solid støtte for e-postvarsling og fungerer sømløst med Forward Email.

> \[!NOTE]
> ASUSTOR ADM 4.x inkluderer avanserte filtreringsmuligheter for varslinger. Du kan tilpasse hvilke hendelser som utløser e-postvarsler.

1. **Åpne varslingsinnstillinger**
   * Gå til ADM webgrensesnitt
   * Velg **Innstillinger** > **Varsling**

2. **Sett opp SMTP-konfigurasjon**
   * SMTP-server: `smtp.forwardemail.net`
   * Port: `465` (SSL/TLS, anbefalt) eller `587` (STARTTLS)
   * Autentisering: Aktiver
   * Brukernavn: Ditt Forward Email-alias
   * Passord: Generert passord fra [Min konto -> Domener -> Aliaser](https://forwardemail.net/my-account/domains)

3. **Konfigurer varseltyper**
   * Velg hvilke systemhendelser som skal utløse e-poster
   * Sett opp mottakeradresser
   * Test konfigurasjonen

> \[!IMPORTANT]
> ASUSTOR-enheter krever at autentisering eksplisitt aktiveres i SMTP-innstillingene. Ikke glem å krysse av for dette.


## Buffalo TeraStation-konfigurasjon {#buffalo-terastation-configuration}

Buffalo TeraStation-enheter har begrensede, men funksjonelle e-postvarslingsmuligheter. Oppsettet er enkelt når du vet hvor du skal lete.

> \[!CAUTION]
> Buffalo TeraStation fastvareoppdateringer er sjeldne. Sørg for at du bruker den nyeste tilgjengelige fastvaren for din modell før du konfigurerer e-post.

1. **Åpne webkonfigurasjon**
   * Koble til TeraStations webgrensesnitt
   * Gå til **System** > **Varsling**

2. **Konfigurer e-postinnstillinger**
   * SMTP-server: `smtp.forwardemail.net`
   * Port: `465` (SSL/TLS, anbefalt) eller `587` (STARTTLS)
   * Brukernavn: Ditt Forward Email-alias
   * Passord: Generert passord fra [Min konto -> Domener -> Aliaser](https://forwardemail.net/my-account/domains)
   * Aktiver SSL/TLS-kryptering

3. **Sett varslingspreferanser**
   * Velg hvilke hendelser som utløser e-poster (diskfeil, temperaturvarsler osv.)
   * Skriv inn mottakerens e-postadresser
   * Lagre og test konfigurasjonen

> \[!NOTE]
> Noen eldre TeraStation-modeller kan ha begrensede SMTP-konfigurasjonsmuligheter. Sjekk dokumentasjonen for din modell for spesifikke funksjoner.
## Western Digital My Cloud-konfigurasjon {#western-digital-my-cloud-configuration}

Western Digital My Cloud-enheter som kjører OS 5 støtter e-postvarsler, selv om grensesnittet kan være litt skjult i innstillingene.

> \[!WARNING]
> Western Digital har avsluttet støtten for mange My Cloud-modeller. Sjekk om enheten din fortsatt mottar firmwareoppdateringer før du stoler på e-postvarsler for kritiske varsler.

1. **Naviger til Innstillinger**
   * Åpne My Cloud-nettgrensesnittet
   * Gå til **Innstillinger** > **Generelt** > **Varsler**

2. **Konfigurer SMTP-detaljer**
   * Mailserver: `smtp.forwardemail.net`
   * Port: `465` (SSL/TLS, anbefalt) eller `587` (STARTTLS)
   * Brukernavn: Din Forward Email-alias
   * Passord: Generert passord fra [Min konto -> Domener -> Aliaser](https://forwardemail.net/my-account/domains)
   * Aktiver kryptering

3. **Sett opp varseltyper**
   * Velg varselkategorier (systemvarsler, diskhelse, osv.)
   * Legg til mottaker-e-postadresser
   * Test e-postkonfigurasjonen

> \[!TIP]
> Vi anbefaler å bruke port `465` med SSL/TLS. Hvis du opplever problemer, støttes også port `587` med STARTTLS.


## TrueNAS e-postkonfigurasjon {#truenas-email-configuration}

TrueNAS (både SCALE og CORE) har utmerket støtte for e-postvarsler med detaljerte konfigurasjonsmuligheter.

> \[!NOTE]
> TrueNAS tilbyr noen av de mest omfattende e-postvarselfunksjonene blant NAS-systemer. Du kan konfigurere detaljerte varselregler og flere mottakere.

1. **Åpne systeminnstillinger**
   * Logg inn på TrueNAS-nettgrensesnittet
   * Naviger til **System** > **E-post**

2. **Konfigurer SMTP-innstillinger**
   * Utgående mailserver: `smtp.forwardemail.net`
   * Mailserverport: `465` (anbefalt) eller `587`
   * Sikkerhet: SSL/TLS (for 465, anbefalt) eller STARTTLS (for 587)
   * Brukernavn: Din Forward Email-alias
   * Passord: Generert passord fra [Min konto -> Domener -> Aliaser](https://forwardemail.net/my-account/domains)

3. **Sett opp varsler**
   * Gå til **System** > **Varseltjenester**
   * Konfigurer hvilke varsler som skal sendes via e-post
   * Sett mottakeradresser og varselnivåer
   * Test konfigurasjonen med den innebygde testfunksjonen

> \[!IMPORTANT]
> TrueNAS lar deg konfigurere forskjellige varselnivåer (INFO, NOTICE, WARNING, ERROR, CRITICAL). Velg passende nivåer for å unngå e-postspam samtidig som kritiske problemer rapporteres.


## OpenMediaVault-konfigurasjon {#openmediavault-configuration}

OpenMediaVault tilbyr solide e-postvarselfunksjoner gjennom sitt nettgrensesnitt. Oppsettet er ryddig og enkelt.

> \[!NOTE]
> OpenMediaVaults varslingssystem er plugin-basert. Sørg for at e-postvarsel-pluginen er installert og aktivert.

1. **Åpne varslingsinnstillinger**
   * Åpne OpenMediaVault-nettgrensesnittet
   * Gå til **System** > **Varsling** > **E-post**

2. **Konfigurer SMTP-parametere**
   * SMTP-server: `smtp.forwardemail.net`
   * Port: `465` (SSL/TLS, anbefalt) eller `587` (STARTTLS)
   * Brukernavn: Din Forward Email-alias
   * Passord: Generert passord fra [Min konto -> Domener -> Aliaser](https://forwardemail.net/my-account/domains)
   * Aktiver SSL/TLS

3. **Sett opp varslingsregler**
   * Naviger til **System** > **Varsling** > **Varsler**
   * Konfigurer hvilke systemhendelser som skal utløse e-poster
   * Sett mottakeradresser
   * Test e-postfunksjonaliteten

> \[!TIP]
> OpenMediaVault lar deg konfigurere varslingsplaner. Du kan sette stille timer eller begrense varslingsfrekvens for å unngå å bli overveldet av varsler.


## Raspberry Pi NAS-konfigurasjon {#raspberry-pi-nas-configuration}

Raspberry Pi representerer et utmerket inngangspunkt til NAS-funksjonalitet, og tilbyr en kostnadseffektiv løsning for hjem og små kontormiljøer. Å sette opp en Raspberry Pi som en NAS-enhet innebærer å konfigurere fildelingsprotokoller, e-postvarsler og essensielle nettverkstjenester.

> \[!TIP]
> For Raspberry Pi-entusiaster anbefaler vi sterkt å komplettere NAS-oppsettet ditt med [PiKVM](https://pikvm.org/) for fjernstyring av serveren og [Pi-hole](https://pi-hole.net/) for nettverksomfattende annonseblokkering og DNS-administrasjon. Disse verktøyene skaper et omfattende hjemmelaboratorium.
### Initial Raspberry Pi-oppsett {#initial-raspberry-pi-setup}

Før du konfigurerer NAS-tjenester, sørg for at din Raspberry Pi kjører den nyeste Raspberry Pi OS og har tilstrekkelig lagringsplass. Et høykvalitets microSD-kort (klasse 10 eller bedre) eller USB 3.0 SSD gir bedre ytelse og pålitelighet for NAS-operasjoner.

1. **Oppdater systemet** ved å kjøre `sudo apt update && sudo apt upgrade -y` for å sikre at alle pakker er oppdaterte.

2. **Aktiver SSH-tilgang** ved å bruke `sudo systemctl enable ssh && sudo systemctl start ssh` for fjernadministrasjon.

3. **Konfigurer statisk IP-adressering** ved å redigere `/etc/dhcpcd.conf` for å sikre konsistent nettverkstilgang.

4. **Sett opp ekstern lagring** ved å koble til og montere USB-disker eller konfigurere RAID-arrays for datadobling.

### Samba fil-deling konfigurasjon {#samba-file-sharing-configuration}

Samba tilbyr Windows-kompatibel fildeling, som gjør din Raspberry Pi tilgjengelig fra hvilken som helst enhet på nettverket ditt. Konfigurasjonsprosessen innebærer å installere Samba, opprette delinger og sette opp brukergodkjenning.

Installer Samba med `sudo apt install samba samba-common-bin` og konfigurer hovedkonfigurasjonsfilen i `/etc/samba/smb.conf`. Opprett delte kataloger og sett riktige tillatelser med `sudo mkdir -p /srv/samba/shared && sudo chmod 755 /srv/samba/shared`.

Konfigurer Samba-deling ved å legge til seksjoner i konfigurasjonsfilen for hver delt katalog. Sett opp brukergodkjenning med `sudo smbpasswd -a username` for å lage Samba-spesifikke passord for nettverkstilgang.

> \[!IMPORTANT]
> Bruk alltid sterke passord for Samba-brukere og vurder å aktivere gjestetilgang kun for ikke-sensitive delte mapper. Se gjennom [offisiell Samba-dokumentasjon](https://www.samba.org/samba/docs/current/man-html/smb.conf.5.html) for avanserte sikkerhetskonfigurasjoner.

### FTP-server oppsett {#ftp-server-setup}

FTP gir en annen metode for filtilgang, spesielt nyttig for automatiserte sikkerhetskopier og fjernfilhåndtering. Installer og konfigurer vsftpd (Very Secure FTP Daemon) for pålitelige FTP-tjenester.

Installer vsftpd med `sudo apt install vsftpd` og konfigurer tjenesten ved å redigere `/etc/vsftpd.conf`. Aktiver lokal brukertilgang, konfigurer passive modus-innstillinger, og sett opp passende sikkerhetsbegrensninger.

Opprett FTP-brukere og konfigurer katalogtilgangstillatelser. Vurder å bruke SFTP (SSH File Transfer Protocol) i stedet for tradisjonell FTP for bedre sikkerhet, da det krypterer all datatrafikk.

> \[!CAUTION]
> Tradisjonell FTP sender passord i klartekst. Bruk alltid SFTP eller konfigurer FTP med TLS-kryptering for sikre filoverføringer. Se [vsftpd sikkerhetsanbefalinger](https://security.appspot.com/vsftpd.html) før implementering.

### E-postvarsling konfigurasjon {#email-notification-configuration}

Konfigurer din Raspberry Pi NAS til å sende e-postvarsler for systemhendelser, lagringsvarsler og status for sikkerhetskopier. Dette innebærer å installere og konfigurere en mail transfer agent og sette opp Forward Email-integrasjon.

Installer `msmtp` som en lettvekts SMTP-klient med `sudo apt install msmtp msmtp-mta`. Lag konfigurasjonsfilen i `/etc/msmtprc` med følgende innstillinger:

```
defaults
auth           on
tls            on
tls_trust_file /etc/ssl/certs/ca-certificates.crt
logfile        /var/log/msmtp.log

account        forwardemail
host           smtp.forwardemail.net
port           465
tls_starttls   off
from           your-alias@yourdomain.com
user           your-alias@yourdomain.com
password       your-generated-password
```

Konfigurer systemvarsler ved å sette opp cron-jobber og systemovervåkingsskript som bruker `msmtp` til å sende varsler. Lag skript for overvåking av diskplass, temperaturvarsler og varsler ved fullført sikkerhetskopiering.

### Avanserte Raspberry Pi NAS-funksjoner {#advanced-raspberry-pi-nas-features}

Utvid din Raspberry Pi NAS med ekstra tjenester og overvåkingsmuligheter. Installer og konfigurer nettverksovervåkingsverktøy, automatiserte sikkerhetskopiløsninger og fjernadgangstjenester.

Sett opp [Nextcloud](https://nextcloud.com/) for sky-lignende funksjonalitet med nettbasert filtilgang, kalender-synkronisering og samarbeidsfunksjoner. Installer ved hjelp av Docker eller den offisielle Nextcloud-installasjonsveiledningen for Raspberry Pi.
Konfigurer automatiserte sikkerhetskopier ved hjelp av `rsync` og `cron` for å lage planlagte sikkerhetskopier av kritiske data. Sett opp e-postvarsler for fullføring av sikkerhetskopiering og feilmeldinger ved hjelp av din Forward Email-konfigurasjon.

Implementer nettverksovervåking ved hjelp av verktøy som [Nagios](https://www.nagios.org/) eller [Zabbix](https://www.zabbix.com/) for å overvåke systemhelse, nettverkstilkobling og tjenestetilgjengelighet.

> \[!NOTE]
> For brukere som administrerer nettverksinfrastruktur, vurder å integrere [Switchbot](https://www.reddit.com/r/pikvm/comments/skhxkm/pikvm_with_switchbot/) med din PiKVM-oppsett for fjernstyring av fysiske brytere. Denne [Python-integrasjonsveiledningen](https://www.reddit.com/r/pikvm/comments/skhxkm/pikvm_with_switchbot/) gir detaljerte instruksjoner for automatisering av fysisk enhetsadministrasjon.

### Raspberry Pi e-post feilsøking {#raspberry-pi-email-troubleshooting}

Vanlige problemer med Raspberry Pi e-postkonfigurasjon inkluderer DNS-oppløsningsproblemer, brannmurbegrensninger og autentiseringsfeil. Den lette naturen til Raspberry Pi-systemer kan noen ganger forårsake timingproblemer med SMTP-tilkoblinger.

Hvis e-postvarsler feiler, sjekk `msmtp` loggfilen på `/var/log/msmtp.log` for detaljerte feilmeldinger. Verifiser at dine Forward Email-legitimasjoner er korrekte og at Raspberry Pi kan løse `smtp.forwardemail.net`.

Test e-postfunksjonalitet ved å bruke kommandolinjen: `echo "Test message" | msmtp recipient@example.com`. Dette hjelper med å isolere konfigurasjonsproblemer fra applikasjonsspesifikke problemer.

Konfigurer riktige DNS-innstillinger i `/etc/resolv.conf` hvis du opplever DNS-oppløsningsproblemer. Vurder å bruke offentlige DNS-servere som `8.8.8.8` eller `1.1.1.1` hvis lokal DNS er upålitelig.

### Ytelsesoptimalisering {#performance-optimization}

Optimaliser ytelsen til din Raspberry Pi NAS gjennom riktig konfigurasjon av lagring, nettverksinnstillinger og systemressurser. Bruk lagringsenheter av høy kvalitet og konfigurer passende filsystemalternativer for ditt brukstilfelle.

Aktiver USB 3.0-oppstart for bedre lagringsytelse hvis du bruker eksterne disker. Konfigurer GPU-minnefordeling ved hjelp av `sudo raspi-config` for å tildele mer RAM til systemoperasjoner fremfor grafikkbehandling.

Overvåk systemytelsen med verktøy som `htop`, `iotop` og `nethogs` for å identifisere flaskehalser og optimalisere ressursbruk. Vurder å oppgradere til en Raspberry Pi 4 med 8GB RAM for krevende NAS-applikasjoner.

Implementer riktige kjøleløsninger for å forhindre termisk nedskalering under intensive operasjoner. Overvåk CPU-temperatur ved hjelp av `/opt/vc/bin/vcgencmd measure_temp` og sørg for tilstrekkelig ventilasjon.

### Sikkerhetshensyn {#security-considerations}

Sikre din Raspberry Pi NAS ved å implementere riktige tilgangskontroller, nettverkssikkerhetstiltak og regelmessige sikkerhetsoppdateringer. Endre standardpassord, deaktiver unødvendige tjenester og konfigurer brannmurregler.

Installer og konfigurer `fail2ban` for å beskytte mot brute force-angrep på SSH og andre tjenester. Sett opp automatiske sikkerhetsoppdateringer ved hjelp av `unattended-upgrades` for å sikre at kritiske sikkerhetspatcher blir anvendt raskt.

Konfigurer nettverkssegmentering for å isolere din NAS fra andre nettverksenheter når det er mulig. Bruk VPN-tilgang for fjernforbindelser i stedet for å eksponere tjenester direkte mot internett.

Ta regelmessige sikkerhetskopier av din Raspberry Pi-konfigurasjon og data for å forhindre datatap ved maskinvarefeil eller sikkerhetshendelser. Test gjenopprettingsprosedyrer for sikkerhetskopier for å sikre datagjenopprettingsmuligheter.

Raspberry Pi NAS-konfigurasjonen gir et utmerket grunnlag for å lære nettverkslagringskonsepter samtidig som den leverer praktisk funksjonalitet for hjem og små kontormiljøer. Kombinasjonen med Forward Email sikrer pålitelig varsling for systemovervåking og vedlikeholdsvarsler.
