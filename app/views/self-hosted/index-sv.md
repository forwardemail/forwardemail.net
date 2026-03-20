# Självhostat {#self-hosted}


## Innehållsförteckning {#table-of-contents}

* [Komma igång](#getting-started)
* [Krav](#requirements)
  * [Cloud-init / User-data](#cloud-init--user-data)
* [Installera](#install)
  * [Felsöka installationsskript](#debug-install-script)
  * [Frågor](#prompts)
  * [Initial konfiguration (Alternativ 1)](#initial-setup-option-1)
* [Tjänster](#services)
  * [Viktiga filsökvägar](#important-file-paths)
* [Konfiguration](#configuration)
  * [Initial DNS-konfiguration](#initial-dns-setup)
* [Onboarding](#onboarding)
* [Testning](#testing)
  * [Skapa din första alias](#creating-your-first-alias)
  * [Skicka / ta emot ditt första e-postmeddelande](#sending--receiving-your-first-email)
* [Felsökning](#troubleshooting)
  * [Vad är användarnamn och lösenord för basic auth](#what-is-the-basic-auth-username-and-password)
  * [Hur vet jag vad som körs](#how-do-i-know-what-is-running)
  * [Hur vet jag om något inte körs som det borde](#how-do-i-know-if-something-isnt-running-that-should-be)
  * [Hur hittar jag loggar](#how-do-i-find-logs)
  * [Varför tidsavbryts mina utgående e-postmeddelanden](#why-are-my-outgoing-emails-timing-out)


## Komma igång {#getting-started}

Vår självhostade e-postlösning, liksom alla våra produkter, är 100 % öppen källkod—både frontend och backend. Det innebär:

1. **Fullständig transparens**: Varje kodrad som hanterar dina e-postmeddelanden är tillgänglig för allmän granskning
2. **Gemenskapsbidrag**: Vem som helst kan bidra med förbättringar eller åtgärda problem
3. **Säkerhet genom öppenhet**: Sårbarheter kan identifieras och åtgärdas av en global gemenskap
4. **Ingen leverantörslåsning**: Du är aldrig beroende av vårt företags existens

Hela kodbasen finns tillgänglig på GitHub på <https://github.com/forwardemail/forwardemail.net>, licensierad under MIT-licensen.

Arkitekturen inkluderar containrar för:

* SMTP-server för utgående e-post
* IMAP/POP3-servrar för e-posthämtning
* Webbgränssnitt för administration
* Databas för konfigurationslagring
* Redis för caching och prestanda
* SQLite för säker, krypterad brevlådelagring

> \[!NOTE]
> Se till att kolla in vår [självhostade blogg](https://forwardemail.net/blog/docs/self-hosted-solution)
>
> Och för de som är intresserade av en mer nedbruten steg-för-steg-version, se våra [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) eller [Debian](https://forwardemail.net/guides/selfhosted-on-debian) baserade guider.


## Krav {#requirements}

Innan du kör installationsskriptet, säkerställ att du har följande:

* **Operativsystem**: En Linux-baserad server (för närvarande stöd för Ubuntu 22.04+).
* **Resurser**: 1 vCPU och 2GB RAM
* **Root-åtkomst**: Administratörsrättigheter för att köra kommandon.
* **Domännamn**: En egen domän redo för DNS-konfiguration.
* **Ren IP**: Säkerställ att din server har en ren IP-adress utan tidigare spamrykte genom att kontrollera svartlistor. Mer info [här](#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation).
* Publik IP-adress med port 25-stöd
* Möjlighet att ställa in [reverse PTR](https://www.cloudflare.com/learning/dns/dns-records/dns-ptr-record/)
* Stöd för IPv4 och IPv6

> \[!TIP]
> Se vår lista över [fantastiska mailserver-leverantörer](https://github.com/forwardemail/awesome-mail-server-providers)

### Cloud-init / User-data {#cloud-init--user-data}

De flesta molnleverantörer stödjer en cloud-init-konfiguration för när den virtuella privata servern (VPS) provisioneras. Detta är ett utmärkt sätt att förinställa vissa filer och miljövariabler för användning av skriptets initiala installationslogik, vilket gör att man slipper bli tillfrågad om ytterligare information under skriptets körning.

**Alternativ**

* `EMAIL` - e-post som används för certbot-påminnelser om certifikatets utgång
* `DOMAIN` - egen domän (t.ex. `example.com`) som används för självhostad installation
* `AUTH_BASIC_USERNAME` - användarnamn som används vid första installationen för att skydda sidan
* `AUTH_BASIC_PASSWORD` - lösenord som används vid första installationen för att skydda sidan
* `/root/.cloudflare.ini` - (**Endast Cloudflare-användare**) Cloudflare-konfigurationsfil som används av certbot för DNS-konfiguration. Kräver att du anger din API-token via `dns_cloudflare_api_token`. Läs mer [här](https://certbot-dns-cloudflare.readthedocs.io/en/stable/).
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

Lägg till `DEBUG=true` framför installationsskriptet för detaljerad utdata:

```sh
DEBUG=true bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

### Frågor {#prompts}

```sh
1. Initial setup
2. Setup Backups
3. Setup Auto Upgrades
4. Renew certificates
5. Restore from Backup
6. Help
7. Exit
```

* **Initial setup**: Ladda ner den senaste forward email-koden, konfigurera miljön, fråga efter din anpassade domän och ställ in alla nödvändiga certifikat, nycklar och hemligheter.
* **Setup Backup**: Kommer att ställa in en cron för att säkerhetskopiera mongoDB och redis med en S3-kompatibel lagring för säker, fjärrlagring. Separat kommer sqlite att säkerhetskopieras vid inloggning om det finns ändringar för säkra, krypterade säkerhetskopior.
* **Setup Upgrade**: Ställer in en cron för att söka efter nattliga uppdateringar som säkert kommer att bygga om och starta om infrastrukturkomponenter.
* **Renew certificates**: Certbot / lets encrypt används för SSL-certifikat och nycklar som går ut var tredje månad. Detta kommer att förnya certifikaten för din domän och placera dem i nödvändig mapp för relaterade komponenter att använda. Se [viktiga filsökvägar](#important-file-paths)
* **Restore from backup**: Kommer att trigga mongodb och redis att återställa från säkerhetskopieringsdata.

### Initial Setup (Alternativ 1) {#initial-setup-option-1}

Välj alternativ `1. Initial setup` för att börja.

När det är klart bör du se ett lyckat meddelande. Du kan även köra `docker ps` för att se **de** komponenter som startats. Mer information om komponenter nedan.


## Tjänster {#services}

| Tjänstnamn  |         Standardport        | Beskrivning                                            |
| ------------ | :-------------------------: | ------------------------------------------------------ |
| Web          |            `443`            | Webbgränssnitt för all administrativ interaktion      |
| API          |            `4000`           | API-lager för att abstrahera databaser                 |
| Bree         |             Ingen           | Bakgrundsjobb och uppgiftskörare                        |
| SMTP         | `465` (rekommenderat) / `587` | SMTP-server för utgående e-post                         |
| SMTP Bree    |             Ingen           | SMTP bakgrundsjobb                                      |
| MX           |            `2525`           | Mail exchange för inkommande e-post och vidarebefordran |
| IMAP         |          `993/2993`         | IMAP-server för inkommande e-post och mailboxhantering |
| POP3         |          `995/2995`         | POP3-server för inkommande e-post och mailboxhantering |
| SQLite       |            `3456`           | SQLite-server för interaktioner med sqlite-databaser   |
| SQLite Bree  |             Ingen           | SQLite bakgrundsjobb                                    |
| CalDAV       |            `5000`           | CalDAV-server för kalenderhantering                     |
| CardDAV      |            `6000`           | CardDAV-server för kalenderhantering                    |
| MongoDB      |           `27017`           | MongoDB-databas för mest datahantering                  |
| Redis        |            `6379`           | Redis för caching och tillståndshantering               |
| SQLite       |             Ingen           | SQLite-databas(er) för krypterade mailboxar             |

### Viktiga filsökvägar {#important-file-paths}

Obs: *Host path* nedan är relativ till `/root/forwardemail.net/self-hosting/`.

| Komponent              |       Host path       | Container path               |
| ---------------------- | :-------------------: | ---------------------------- |
| MongoDB                |   `./mongo-backups`   | `/backups`                   |
| Redis                  |     `./redis-data`    | `/data`                      |
| Sqlite                 |    `./sqlite-data`    | `/mnt/{SQLITE_STORAGE_PATH}` |
| Env-fil                |        `./.env`       | `/app/.env`                  |
| SSL-certifikat/nycklar |        `./ssl`        | `/app/ssl/`                  |
| Privat nyckel          |  `./ssl/privkey.pem`  | `/app/ssl/privkey.pem`       |
| Full kedja certifikat  | `./ssl/fullchain.pem` | `/app/ssl/fullchain.pem`     |
| CA-certifikat          |    `./ssl/cert.pem`   | `/app/ssl/cert.pem`          |
| DKIM privat nyckel     |    `./ssl/dkim.key`   | `/app/ssl/dkim.key`          |
> \[!IMPORTANT]
> Spara `.env`-filen säkert. Den är avgörande för återställning vid fel.
> Du hittar den i `/root/forwardemail.net/self-hosting/.env`.


## Konfiguration {#configuration}

### Initial DNS-konfiguration {#initial-dns-setup}

Hos din valda DNS-leverantör, konfigurera de lämpliga DNS-posterna. Observera att allt inom hakparenteser (`<>`) är dynamiskt och måste uppdateras med ditt värde.

| Typ   | Namn               | Innehåll                     | TTL  |
| ----- | ------------------ | ---------------------------- | ---- |
| A     | "@", ".", eller tom | <ip_address>                 | auto |
| CNAME | api                | <domain_name>                | auto |
| CNAME | caldav             | <domain_name>                | auto |
| CNAME | carddav            | <domain_name>                | auto |
| CNAME | fe-bounces         | <domain_name>                | auto |
| CNAME | imap               | <domain_name>                | auto |
| CNAME | mx                 | <domain_name>                | auto |
| CNAME | pop3               | <domain_name>                | auto |
| CNAME | smtp               | <domain_name>                | auto |
| MX    | "@", ".", eller tom | mx.<domain_name> (prioritet 0) | auto |
| TXT   | "@", ".", eller tom | "v=spf1 a -all"              | auto |

#### Reverse DNS / PTR-post {#reverse-dns--ptr-record}

Reverse DNS (rDNS) eller omvända pekarposter (PTR-poster) är viktiga för e-postservrar eftersom de hjälper till att verifiera legitimiteten hos servern som skickar e-post. Varje molnleverantör gör detta på olika sätt, så du behöver ta reda på hur man lägger till "Reverse DNS" för att koppla värden och IP till dess motsvarande värdnamn. Oftast finns detta i leverantörens nätverkssektion.

#### Port 25 blockerad {#port-25-blocked}

Vissa internetleverantörer och molnleverantörer blockerar port 25 för att undvika missbruk. Du kan behöva skicka in en supportförfrågan för att öppna port 25 för SMTP / utgående e-post.


## Onboarding {#onboarding}

1. Öppna Landningssidan
   Navigera till https\://\<domain_name>, och ersätt \<domain_name> med domänen som konfigurerats i dina DNS-inställningar. Du bör se Forward Email:s landningssida.

2. Logga in och registrera din domän

* Logga in med en giltig e-postadress och lösenord.
* Ange domännamnet du vill konfigurera (detta måste stämma överens med DNS-konfigurationen).
* Följ instruktionerna för att lägga till de nödvändiga **MX** och **TXT**-posterna för verifiering.

3. Slutför installationen

* När verifieringen är klar, gå till sidan för Aliaser för att skapa din första alias.
* Valfritt: konfigurera **SMTP för utgående e-post** i **Domäninställningar**. Detta kräver ytterligare DNS-poster.

> \[!NOTE]
> Ingen information skickas utanför din server. Självhostade alternativet och det initiala kontot är endast för administratörsinloggning och webbvy för att hantera domäner, alias och relaterade e-postkonfigurationer.


## Testning {#testing}

### Skapa din första alias {#creating-your-first-alias}

1. Navigera till sidan för Aliaser
   Öppna sidan för alias-hantering:

```sh
https://<domain_name>/en/my-account/domains/<domain_name>/aliases
```

2. Lägg till en ny alias

* Klicka på **Lägg till alias** (uppe till höger).
* Ange aliasnamnet och justera e-postinställningarna efter behov.
* (Valfritt) Aktivera stöd för **IMAP/POP3/CalDAV/CardDAV** genom att markera kryssrutan.
* Klicka på **Skapa alias.**

3. Ange ett lösenord

* Klicka på **Generera lösenord** för att skapa ett säkert lösenord.
* Detta lösenord krävs för att logga in i din e-postklient.

4. Konfigurera din e-postklient

* Använd en e-postklient som Thunderbird.
* Ange aliasnamnet och det genererade lösenordet.
* Konfigurera **IMAP** och **SMTP** inställningarna därefter.

#### Inställningar för e-postserver {#email-server-settings}

Användarnamn: `<alias name>`

| Typ  | Värdnamn           | Port | Anslutningssäkerhet | Autentisering  |
| ---- | ------------------ | ---- | ------------------- | -------------- |
| SMTP | smtp.<domain_name> | 465  | SSL / TLS           | Normalt lösenord |
| IMAP | imap.<domain_name> | 993  | SSL / TLS           | Normalt lösenord |

### Skicka / ta emot ditt första e-postmeddelande {#sending--receiving-your-first-email}

När det är konfigurerat bör du kunna skicka och ta emot e-post till din nyss skapade och självhostade e-postadress!
## Felsökning {#troubleshooting}

#### Varför fungerar detta inte utanför Ubuntu och Debian {#why-doesnt-this-work-outside-of-ubuntu-and-debian}

Vi arbetar för närvarande med att stödja MacOS och kommer att titta på andra system. Vänligen öppna en [diskussion](https://github.com/orgs/forwardemail/discussions) eller bidra om du vill se stöd för andra system.

#### Varför misslyckas certbot acme-utmaningen {#why-is-the-certbot-acme-challenge-failing}

Den vanligaste fallgropen är att certbot / letsencrypt ibland begär **2** utmaningar. Du måste vara säker på att lägga till **BÅDA** txt-posterna.

Exempel:
Du kan se två utmaningar som dessa:
\_acme-challenge.example.com -> "randomstring1"
\_acme-challenge.example.com -> "randomstring2"

Det är också möjligt att DNS-propagationen inte har slutförts. Du kan använda verktyg som: `https://toolbox.googleapps.com/apps/dig/#TXT/_acme-challenge.<your_domain>`. Detta ger dig en uppfattning om dina TXT-poständringar bör ha reflekterats. Det är också möjligt att lokal DNS-cache på din värd fortfarande använder ett gammalt, föråldrat värde eller inte har plockat upp de senaste ändringarna.

Ett annat alternativ är att använda de automatiserade certbot DNS-ändringarna genom att ställa in filen `/root/.cloudflare.ini` med API-token i din cloud-init / user-data vid initial VPS-installation eller skapa denna fil och köra skriptet igen. Detta hanterar DNS-ändringarna och utmaningsuppdateringarna automatiskt.

### Vad är användarnamn och lösenord för basic auth {#what-is-the-basic-auth-username-and-password}

För självhosting lägger vi till en första gångs webbläsarens inbyggda autentiseringspopup med ett enkelt användarnamn (`admin`) och lösenord (slumpmässigt genererat vid initial installation). Vi lägger till detta som ett skydd ifall automation / skript på något sätt hinner före dig med att registrera sig på webbupplevelsen. Du kan hitta detta lösenord efter initial installation i din `.env`-fil under `AUTH_BASIC_USERNAME` och `AUTH_BASIC_PASSWORD`.

### Hur vet jag vad som körs {#how-do-i-know-what-is-running}

Du kan köra `docker ps` för att se alla körande containrar som startas från filen `docker-compose-self-hosting.yml`. Du kan också köra `docker ps -a` för att se allt (inklusive containrar som inte körs).

### Hur vet jag om något inte körs som borde göra det {#how-do-i-know-if-something-isnt-running-that-should-be}

Du kan köra `docker ps -a` för att se allt (inklusive containrar som inte körs). Du kan se en exit-logg eller notering.

### Hur hittar jag loggar {#how-do-i-find-logs}

Du kan få fler loggar via `docker logs -f <container_name>`. Om något har avslutats är det troligtvis relaterat till att `.env`-filen är felkonfigurerad.

Inom webbgränssnittet kan du visa `/admin/emails` och `/admin/logs` för utgående e-postloggar respektive fel-loggar.

### Varför tidsavbryts mina utgående e-postmeddelanden {#why-are-my-outgoing-emails-timing-out}

Om du ser ett meddelande som Connection timed out when connecting to MX server... kan du behöva kontrollera om port 25 är blockerad. Det är vanligt att internetleverantörer eller molnleverantörer blockerar denna som standard och du kan behöva kontakta support / skicka in en förfrågan för att få den öppnad.

#### Vilka verktyg bör jag använda för att testa bästa praxis för e-postkonfiguration och IP-rykte {#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation}

Ta en titt på vår [FAQ här](/faq#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation).
