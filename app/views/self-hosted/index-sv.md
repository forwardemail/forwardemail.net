# Självhostad {#self-hosted}

## Innehållsförteckning {#table-of-contents}

* [Komma igång](#getting-started)
* [Krav](#requirements)
  * [Molninitiering / Användardata](#cloud-init--user-data)
* [Installera](#install)
  * [Felsök installationsskript](#debug-install-script)
  * [Uppmaningar](#prompts)
  * [Initial installation (alternativ 1)](#initial-setup-option-1)
* [Tjänster](#services)
  * [Viktiga filsökvägar](#important-file-paths)
* [Konfiguration](#configuration)
  * [Initial DNS-konfiguration](#initial-dns-setup)
* [Onboarding](#onboarding)
* [Testning](#testing)
  * [Skapa ditt första alias](#creating-your-first-alias)
  * [Skicka/ta emot ditt första e-postmeddelande](#sending--receiving-your-first-email)
* [Felsökning](#troubleshooting)
  * [Vad är det grundläggande användarnamnet och lösenordet för autentisering](#what-is-the-basic-auth-username-and-password)
  * [Hur vet jag vad som körs](#how-do-i-know-what-is-running)
  * [Hur vet jag om något som borde fungera inte fungerar?](#how-do-i-know-if-something-isnt-running-that-should-be)
  * [Hur hittar jag loggar](#how-do-i-find-logs)
  * [Varför tar mina utgående e-postmeddelanden tidsgränsen](#why-are-my-outgoing-emails-timing-out)

## Komma igång {#getting-started}

Vår egenhostade e-postlösning, liksom alla våra produkter, är 100 % öppen källkod – både frontend och backend. Det betyder:

1. **Fullständig transparens**: Varje kodrad som behandlar dina e-postmeddelanden är tillgänglig för offentlig granskning
2. **Bidrag från communityn**: Vem som helst kan bidra med förbättringar eller åtgärda problem
3. **Säkerhet genom öppenhet**: Sårbarheter kan identifieras och åtgärdas av en global community
4. **Ingen leverantörslåsning**: Du är aldrig beroende av vårt företags existens

Hela kodbasen finns tillgänglig på GitHub på <https://github.com/forwardemail/forwardemail.net>, licensierad under MIT-licensen.

Arkitekturen inkluderar containrar för:

* SMTP-server för utgående e-post
* IMAP/POP3-servrar för hämtning av e-post
* Webbgränssnitt för administration
* Databas för konfigurationslagring
* Redis för cachning och prestanda
* SQLite för säker, krypterad brevlådelagring

> \[!NOTE]
> Se till att kolla in vår [egenhostad blogg](https://forwardemail.net/blog/docs/self-hosted-solution)
>
> Och för de som är intresserade av en mer detaljerad steg-för-steg-version, se våra [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu)- eller [Debian](https://forwardemail.net/guides/selfhosted-on-debian)-baserade guider.

## Krav {#requirements}

Innan du kör installationsskriptet, se till att du har följande:

* **Operativsystem**: En Linux-baserad server (med stöd för närvarande Ubuntu 22.04+).
* **Resurser**: 1 vCPU och 2 GB RAM
* **Root-åtkomst**: Administratörsbehörighet för att köra kommandon.
* **Domännamn**: En anpassad domän redo för DNS-konfiguration.
* **Ren IP**: Säkerställ att din server har en ren IP-adress utan tidigare skräppostrykte genom att kontrollera svarta listor. Mer information [här](#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation).
* Offentlig IP-adress med stöd för port 25
* Möjlighet att ställa in [omvänd PTR](https://www.cloudflare.com/learning/dns/dns-records/dns-ptr-record/)
* Stöd för IPv4 och IPv6

> \[!TIP]
> Se vår lista över [fantastiska e-postserverleverantörer](https://github.com/forwardemail/awesome-mail-server-providers)

### Molninitiering / Användardata {#cloud-init--user-data}

De flesta molnleverantörer stöder en molninitieringskonfiguration för när den virtuella privata servern (VPS) provisioneras. Detta är ett bra sätt att ställa in vissa filer och miljövariabler i förväg för användning av skriptets initiala installationslogik, vilket kringgår behovet av att fråga medan skriptet körs efter ytterligare information.

**Alternativ**

* `EMAIL` - e-postadress som används för påminnelser om att certbot har förfallit
* `DOMAIN` - anpassad domän (t.ex. `example.com`) som används för installation av egen webbhotell
* `AUTH_BASIC_USERNAME` - användarnamn som används vid första installationen för att skydda webbplatsen
* `AUTH_BASIC_PASSWORD` - lösenord som används vid första installationen för att skydda webbplatsen
* `/root/.cloudflare.ini` - (**Endast Cloudflare-användare**) Cloudflare-konfigurationsfil som används av certbot för DNS-konfiguration. Det kräver att du ställer in din API-token via `dns_cloudflare_api_token`. Läs mer [här](https://certbot-dns-cloudflare.readthedocs.io/en/stable/).

Exempel:

```sh
#cloud-config
write_files:
  - path: /root/.cloudflare.ini
    content: |
      dns_cloudflare_api_token = "xxx"
    owner: root:root
    permissions: '0600'
  - path: /etc/profile.d/env.sh
    content: |
      export EMAIL="test@myemail.com"
      export DOMAIN="mydomain.com"

runcmd:
  - chmod +x /etc/profile.d/env.sh
```

## Installera {#install}

Kör följande kommando på din server för att ladda ner och köra installationsskriptet:

```sh
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

### Felsök installationsskript {#debug-install-script}

Lägg till `DEBUG=true` framför installationsskriptet för utförlig utdata:

```sh
DEBUG=true bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

### Uppmaningar {#prompts}

```sh
1. Initial setup
2. Setup Backups
3. Setup Auto Upgrades
4. Renew certificates
5. Restore from Backup
6. Help
7. Exit
```

* **Initial installation**: Ladda ner den senaste koden för vidarebefordran av e-post, konfigurera miljön, fråga efter din anpassade domän och konfigurera alla nödvändiga certifikat, nycklar och hemligheter.
* **Konfigurera säkerhetskopiering**: Konfigurerar en cron för att säkerhetskopiera mongoDB och redis med hjälp av en S3-kompatibel lagring för säker fjärrlagring. Separat kommer sqlite att säkerhetskopieras vid inloggning om det finns ändringar för säkra, krypterade säkerhetskopior.
* **Konfigurera uppgradering**: Konfigurera en cron för att leta efter nattliga uppdateringar som säkert kommer att återuppbygga och starta om infrastrukturkomponenter.
* **Förnya certifikat**: Certbot / lets encrypt används för SSL-certifikat och nycklarna löper ut var tredje månad. Detta kommer att förnya certifikaten för din domän och placera dem i den nödvändiga mappen för relaterade komponenter att använda. Se [viktiga filsökvägar](#important-file-paths)
* **Återställ från säkerhetskopia**: Kommer att utlösa mongodb och redis för att återställa från säkerhetskopiadata.

### Initial installation (alternativ 1) {#initial-setup-option-1}

Välj alternativet `1. Initial setup` för att börja.

När det är klart bör du se ett meddelande om att det lyckades. Du kan till och med köra `docker ps` för att se komponenterna starta. Mer information om komponenterna nedan.

## Tjänster {#services}

| Tjänstens namn | Standardport | Beskrivning |
| ------------ | :----------: | ------------------------------------------------------ |
| Web | `443` | Webbgränssnitt för alla administrativa interaktioner |
| API | `4000` | API-lager till abstrakta databaser |
| Bree | Ingen | Bakgrundsjobb och uppgiftslöpare |
| SMTP | `465/587` | SMTP-server för utgående e-post |
| SMTP Bree | Ingen | SMTP-bakgrundsjobb |
| MX | `2525` | E-postutbyte för inkommande e-post och vidarebefordran av e-post |
| IMAP | `993/2993` | IMAP-server för hantering av inkommande e-post och brevlådor |
| POP3 | `995/2995` | POP3-server för hantering av inkommande e-post och brevlådor |
| SQLite | `3456` | SQLite-server för interaktioner med SQLite-databaser |
| SQLite Bree | Ingen | SQLite-bakgrundsjobb |
| CalDAV | `5000` | CalDAV-server för kalenderhantering |
| CardDAV | `6000` | CardDAV-server för kalenderhantering |
| MongoDB | `27017` | MongoDB-databas för det mesta av datahanteringen |
| Redis | `6379` | Redis för cachning och tillståndshantering |
| SQLite | Ingen | SQLite-databas(er) för krypterade brevlådor |

### Viktiga filsökvägar {#important-file-paths}

Obs: *Värdsökvägen* nedan är relativ till `/root/forwardemail.net/self-hosting/`.

| Komponent | Värdsökväg | Containersökväg |
| ---------------------- | :-------------------: | ---------------------------- |
| MongoDB | `./mongo-backups` | `/backups` |
| Redis | `./redis-data` | `/data` |
| Sqlite | `./sqlite-data` | `/mnt/{SQLITE_STORAGE_PATH}` |
| Env-fil | `./.env` | `/app/.env` |
| SSL-certifikat/nycklar | `./ssl` | `/app/ssl/` |
| Privat nyckel | `./ssl/privkey.pem` | `/app/ssl/privkey.pem` |
| Fullständigt kedjecertifikat | `./ssl/fullchain.pem` | `/app/ssl/fullchain.pem` |
| Certifierade certifikatutfärdare | `./ssl/cert.pem` | `/app/ssl/cert.pem` |
| DKIM privat nyckel | `./ssl/dkim.key` | `/app/ssl/dkim.key` |

> \[!IMPORTANT]
> Spara `.env`-filen säkert. Den är avgörande för återställning vid fel.
> Du hittar den i `/root/forwardemail.net/self-hosting/.env`.

## Konfiguration {#configuration}

### Initial DNS-konfiguration {#initial-dns-setup}

Konfigurera lämpliga DNS-poster i din valda DNS-leverantör. Observera att allt inom parentes (`<>`) är dynamiskt och måste uppdateras med ditt värde.

| Typ | Namn | Innehåll | TTL |
| ----- | ------------------ | ----------------------------- | ---- |
| A | "@", "." eller tomt | <ip_adress> | bil |
| CNAME | API | <domännamn> | bil |
| CNAME | caldav | <domännamn> | bil |
| CNAME | carddav | <domännamn> | bil |
| CNAME | fe-studsar | <domännamn> | bil |
| CNAME | imap | <domännamn> | bil |
| CNAME | mx | <domännamn> | bil |
| CNAME | pop3 | <domännamn> | bil |
| CNAME | smtp | <domännamn> | bil |
| MX | "@", "." eller tomt | mx.<domännamn> (prioritet 0) | bil |
| TXT | "@", "." eller tomt | "v=spf1 a -all" | bil |

#### Omvänd DNS/PTR-post {#reverse-dns--ptr-record}

Omvänd DNS (rDNS) eller reverse pointer-poster (PTR-poster) är viktiga för e-postservrar eftersom de hjälper till att verifiera legitimiteten hos servern som skickar e-postmeddelandet. Varje molnleverantör gör detta på olika sätt, så du måste söka efter hur du lägger till "Omvänd DNS" för att mappa värden och IP-adressen till motsvarande värdnamn. Troligtvis i leverantörens nätverkssektion.

#### Port 25 Blockerad {#port-25-blocked}

Vissa internetleverantörer och molnleverantörer blockerar port 25 för att undvika dåliga aktörer. Du kan behöva skicka in ett supportärende för att öppna port 25 för SMTP/utgående e-post.

## Introduktion {#onboarding}

1. Öppna landningssidan Navigera till https\://\<domännamn> och ersätt \<domännamn> med domänen som är konfigurerad i dina DNS-inställningar. Du bör se landningssidan för vidarebefordran av e-post.

2. Logga in och registrera din domän

* Logga in med en giltig e-postadress och lösenord.
* Ange domännamnet du vill konfigurera (detta måste matcha DNS-konfigurationen).
* Följ anvisningarna för att lägga till de obligatoriska **MX**- och **TXT**-posterna för verifiering.

3. Slutför installationen

* När du har verifierat, gå till sidan Alias för att skapa ditt första alias.

* Du kan även konfigurera **SMTP för utgående e-post** i **Domäninställningar**. Detta kräver ytterligare DNS-poster.

> \[!NOTE]
> Ingen information skickas utanför din server. Alternativet med egen host och det initiala kontot är endast för administratörsinloggning och webbvy för att hantera domäner, alias och relaterade e-postkonfigurationer.

## Testning {#testing}

### Skapar ditt första alias {#creating-your-first-alias}

1. Navigera till sidan Alias
Öppna sidan för aliashantering:

```sh
https://<domain_name>/en/my-account/domains/<domain_name>/aliases
```

2. Lägg till ett nytt alias

* Klicka på **Lägg till alias** (uppe till höger).
* Ange aliasnamnet och justera e-postinställningarna efter behov.
* (Valfritt) Aktivera stöd för **IMAP/POP3/CalDAV/CardDAV** genom att markera kryssrutan.
* Klicka på **Skapa alias**.

3. Ange ett lösenord

* Klicka på **Generera lösenord** för att skapa ett säkert lösenord.

* Detta lösenord krävs för att logga in på din e-postklient.

4. Konfigurera din e-postklient

* Använd en e-postklient som Thunderbird.
* Ange aliasnamnet och det genererade lösenordet.
* Konfigurera inställningarna för **IMAP** och **SMTP** därefter.

#### Inställningar för e-postserver {#email-server-settings}

Användarnamn: `<alias name>`

| Typ | Värdnamn | Hamn | Anslutningssäkerhet | Autentisering |
| ---- | ------------------ | ---- | ------------------- | --------------- |
| SMTP | smtp.<domännamn> | 465 | SSL / TLS | Vanligt lösenord |
| IMAP | imap.<domännamn> | 993 | SSL / TLS | Vanligt lösenord |

### Skickar/tar emot ditt första e-postmeddelande {#sending--receiving-your-first-email}

När du väl har konfigurerat det borde du kunna skicka och ta emot e-post till din nyskapade och självhostade e-postadress!

## Felsökning {#troubleshooting}

#### Varför fungerar inte detta utanför Ubuntu och Debian {#why-doesnt-this-work-outside-of-ubuntu-and-debian}

Vi undersöker för närvarande möjligheten att stödja MacOS och kommer att se till att andra kan användas. Öppna en [diskussion](https://github.com/orgs/forwardemail/discussions) eller bidra om du vill att andra ska få stöd.

#### Varför misslyckas certbot acme-utmaningen {#why-is-the-certbot-acme-challenge-failing}

Den vanligaste fallgroparna är att certbot / letsencrypt ibland begär **2** utmaningar. Du måste se till att lägga till **BÅDA** txt-posterna.

Exempel:
Du kan se två utmaningar som denna:
\_acme-challenge.example.com -> "randomstring1"
\_acme-challenge.example.com -> "randomstring2"

Det är också möjligt att DNS-spridningen inte har slutförts. Du kan använda verktyg som: `https://toolbox.googleapps.com/apps/dig/#TXT/_acme-challenge.<your_domain>`. Detta ger dig en uppfattning om dina TXT-poständringar ska återspeglas. Det är också möjligt att den lokala DNS-cachen på din värd fortfarande använder ett gammalt, inaktuellt värde eller inte har registrerat de senaste ändringarna.

Ett annat alternativ är att använda de automatiska Cerbot DNS-ändringarna genom att ställa in `/root/.cloudflare.ini`-filen med API-token i din cloud-init / user-data vid den första VPS-installationen eller skapa den här filen och köra skriptet igen. Detta kommer att hantera DNS-ändringarna och utmana uppdateringar automatiskt.

### Vad är det grundläggande användarnamnet och lösenordet för autentisering {#what-is-the-basic-auth-username-and-password}}

För egen webbhotell lägger vi till ett popup-fönster för förstagångsautentisering av webbläsaren med ett enkelt användarnamn (`admin`) och lösenord (slumpmässigt genererat vid den första installationen). Vi lägger bara till detta som ett skydd ifall automatisering/skrapning på något sätt hindrar dig från att registrera dig på webben. Du hittar detta lösenord efter den första installationen i din `.env`-fil under `AUTH_BASIC_USERNAME` och `AUTH_BASIC_PASSWORD`.

### Hur vet jag vad som körs {#how-do-i-know-what-is-running}

Du kan köra `docker ps` för att se alla aktiva containrar som skapas från `docker-compose-self-hosting.yml`-filen. Du kan också köra `docker ps -a` för att se allt (inklusive containrar som inte körs).

### Hur vet jag om något inte körs som borde vara {#how-do-i-know-if-something-isnt-running-that-should-be}

Du kan köra `docker ps -a` för att se allt (inklusive containrar som inte körs). Du kan se en avslutningslogg eller anteckning.

### Hur hittar jag loggar {#how-do-i-find-logs}

Du kan hämta fler loggar via `docker logs -f <container_name>`. Om något avslutades är det troligtvis relaterat till att `.env`-filen är felaktigt konfigurerad.

I webbgränssnittet kan du visa `/admin/emails` och `/admin/logs` för loggar för utgående e-post respektive felloggar.

### Varför tar mina utgående e-postmeddelanden slut {#why-are-my-outgoing-emails-timing-out}

Om du ser ett meddelande som "Anslutningen överskred vid anslutning till MX-server..." kan du behöva kontrollera om port 25 är blockerad. Det är vanligt att internetleverantörer eller molnleverantörer blockerar detta som standard, och du kan behöva kontakta supporten/skicka ett ärende för att få det öppnat.

#### Vilka verktyg ska jag använda för att testa bästa praxis för e-postkonfiguration och IP-rykte {#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation}

Ta en titt på vår [Vanliga frågor här](/faq#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation).