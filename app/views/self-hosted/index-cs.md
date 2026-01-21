# Samostatně hostované {#self-hosted}

## Obsah {#table-of-contents}

* [Začínáme](#getting-started)
* [Požadavky](#requirements)
  * [Cloudová inicializace / Uživatelská data](#cloud-init--user-data)
* [Instalovat](#install)
  * [Ladění instalačního skriptu](#debug-install-script)
  * [Výzvy](#prompts)
  * [Počáteční nastavení (možnost 1)](#initial-setup-option-1)
* [Služby](#services)
  * [Důležité cesty k souborům](#important-file-paths)
* [Konfigurace](#configuration)
  * [Počáteční nastavení DNS](#initial-dns-setup)
* [Nástupní proces](#onboarding)
* [Testování](#testing)
  * [Vytvoření prvního aliasu](#creating-your-first-alias)
  * [Odeslání / příjem vašeho prvního e-mailu](#sending--receiving-your-first-email)
* [Odstraňování problémů](#troubleshooting)
  * [Jaké je základní autorizační uživatelské jméno a heslo?](#what-is-the-basic-auth-username-and-password)
  * [Jak poznám, co běží](#how-do-i-know-what-is-running)
  * [Jak poznám, že něco, co by mělo fungovat, nefunguje?](#how-do-i-know-if-something-isnt-running-that-should-be)
  * [Jak najdu protokoly](#how-do-i-find-logs)
  * [Proč mi vyprší časový limit odchozích e-mailů](#why-are-my-outgoing-emails-timing-out)

## Začínáme {#getting-started}

Naše e-mailové řešení s vlastním hostingem, stejně jako všechny naše produkty, je 100% open-source – a to jak na frontendu, tak i na backendu. To znamená:

1. **Naprostá transparentnost**: Každý řádek kódu, který zpracovává vaše e-maily, je k dispozici pro veřejnou kontrolu.
2. **Příspěvky komunity**: Kdokoli může přispět vylepšeními nebo opravit problémy.
3. **Zabezpečení prostřednictvím otevřenosti**: Zranitelnosti může identifikovat a opravit globální komunita.
4. **Žádná vázanost na dodavatele**: Nikdy nejste závislí na existenci naší společnosti.

Celá kódová základna je k dispozici na GitHubu na adrese <https://github.com/forwardemail/forwardemail.net>, a je licencována pod licencí MIT.

Architektura zahrnuje kontejnery pro:

* SMTP server pro odchozí e-maily
* IMAP/POP3 servery pro načítání e-mailů
* Webové rozhraní pro správu
* Databáze pro ukládání konfigurace
* Redis pro ukládání do mezipaměti a výkon
* SQLite pro bezpečné a šifrované ukládání poštovních schránek

> \[!NOTE]
> Nezapomeňte se podívat na náš návod [blog s vlastním hostingem](https://forwardemail.net/blog/docs/self-hosted-solution)
>> A pro ty, kteří mají zájem o podrobnější návod krok za krokem, se podívejte na naše návody založené na návodu [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) nebo [Debian](https://forwardemail.net/guides/selfhosted-on-debian).

## Požadavky {#requirements}

Před spuštěním instalačního skriptu se ujistěte, že máte následující:

* **Operační systém**: Server založený na Linuxu (aktuálně podporuje Ubuntu 22.04+).
* **Zdroje**: 1 virtuální procesor a 2 GB RAM
* **Root přístup**: Administrátorská oprávnění pro spouštění příkazů.
* **Název domény**: Vlastní doména připravená pro konfiguraci DNS.
* **Čistá IP adresa**: Zajistěte, aby váš server měl čistou IP adresu bez předchozí spamové reputace, a to kontrolou černých listin. Více informací [zde](#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation).
* Veřejná IP adresa s podporou portu 25
* Možnost nastavení [reverzní PTR](https://www.cloudflare.com/learning/dns/dns-records/dns-ptr-record/)
* Podpora IPv4 a IPv6

> \[!TIP]
> Podívejte se na náš seznam [úžasní poskytovatelé poštovních serverů](https://github.com/forwardemail/awesome-mail-server-providers)

### Cloudová inicializace / Uživatelská data {#cloud-init--user-data}

Většina cloudových dodavatelů podporuje konfiguraci cloud-init pro případ, kdy je zřízen virtuální privátní server (VPS). To je skvělý způsob, jak předem nastavit některé soubory a proměnné prostředí pro použití logikou počátečního nastavení skriptů, což obejde nutnost dotazovat se během běhu skriptu na další informace.

**Možnosti**

* `EMAIL` - e-mail používaný pro připomenutí vypršení platnosti certbotu
* `DOMAIN` - vlastní doména (např. `example.com`) používaná pro nastavení vlastního hostingu
* `AUTH_BASIC_USERNAME` - uživatelské jméno použité při prvním nastavení k ochraně webu
* `AUTH_BASIC_PASSWORD` - heslo použité při prvním nastavení k ochraně webu
* `/root/.cloudflare.ini` - (**pouze pro uživatele Cloudflare**) konfigurační soubor cloudflare používaný certbotem pro konfiguraci DNS. Vyžaduje nastavení API tokenu pomocí `dns_cloudflare_api_token`. Více informací naleznete na [zde](https://certbot-dns-cloudflare.readthedocs.io/en/stable/).

Příklad:

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

## Nainstalovat {#install}

Spusťte na serveru následující příkaz pro stažení a spuštění instalačního skriptu:

```sh
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

### Ladicí instalační skript {#debug-install-script}

Pro podrobnější výstup přidejte před instalační skript `DEBUG=true`:

```sh
DEBUG=true bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

### Výzvy {#prompts}

```sh
1. Initial setup
2. Setup Backups
3. Setup Auto Upgrades
4. Renew certificates
5. Restore from Backup
6. Help
7. Exit
```

* **Počáteční nastavení**: Stáhněte si nejnovější kód pro přesměrování e-mailů, nakonfigurujte prostředí, vyžádejte si vlastní doménu a nastavte všechny potřebné certifikáty, klíče a tajné kódy.
* **Nastavení zálohování**: Nastaví cron pro zálohování MongoDB a Redis pomocí úložiště kompatibilního s S3 pro bezpečné a vzdálené ukládání. Samostatně bude při přihlášení zálohován sqlite, pokud dojde ke změnám pro bezpečné a šifrované zálohy.
* **Nastavení upgradu**: Nastaví cron pro vyhledávání nočních aktualizací, které bezpečně obnoví a restartují komponenty infrastruktury.
* **Obnovení certifikátů**: Pro SSL certifikáty se používá Certbot / lets encrypt a klíče vyprší každé 3 měsíce. Tím se obnoví certifikáty pro vaši doménu a umístí se do potřebné složky, aby je mohly spotřebovat související komponenty. Viz [důležité cesty k souborům](#important-file-paths)
* **Obnovit ze zálohy**: Spustí MongoDB a Redis pro obnovení ze zálohovaných dat.

### Počáteční nastavení (možnost 1) {#initial-setup-option-1}

Pro začátek vyberte možnost `1. Initial setup`.

Po dokončení byste měli vidět zprávu o úspěchu. Můžete dokonce spustit příkaz `docker ps` a sledovat, jak se komponenty roztočily. Více informací o komponentách níže.

## Služby {#services}

| Název služby | Výchozí port | Popis |
| ------------ | :----------: | ------------------------------------------------------ |
| Web | `443` | Webové rozhraní pro veškeré interakce administrátora |
| API | `4000` | Vrstva API pro abstraktní databáze |
| Bree | Žádný | Úloha na pozadí a spouštěč úloh |
| SMTP | `465/587` | SMTP server pro odchozí e-maily |
| SMTP Bree | Žádný | Úloha SMTP na pozadí |
| MX | `2525` | Výměna pošty pro příchozí e-maily a přeposílání e-mailů |
| IMAP | `993/2993` | IMAP server pro správu příchozích e-mailů a poštovních schránek |
| POP3 | `995/2995` | POP3 server pro správu příchozích e-mailů a poštovních schránek |
| SQLite | `3456` | SQLite server pro interakce s databází(emi) SQLite |
| SQLite Bree | Žádný | Úloha na pozadí SQLite |
| CalDAV | `5000` | CalDAV server pro správu kalendářů |
| CardDAV | `6000` | CardDAV server pro správu kalendářů |
| MongoDB | `27017` | Databáze MongoDB pro správu většiny dat |
| Redis | `6379` | Redis pro ukládání do mezipaměti a správu stavu |
| SQLite | Žádný | Databáze SQLite pro šifrované poštovní schránky |

### Důležité cesty k souborům {#important-file-paths}

Poznámka: *Cesta k hostiteli* níže je relativní vzhledem k `/root/forwardemail.net/self-hosting/`.

| Komponent | Cesta hostitele | Cesta kontejneru |
| ---------------------- | :-------------------: | ---------------------------- |
| MongoDB | `./mongo-backups` | `/backups` |
| Redis | `./redis-data` | `/data` |
| SQLite | `./sqlite-data` | `/mnt/{SQLITE_STORAGE_PATH}` |
| Soubor env | `./.env` | `/app/.env` |
| SSL certifikáty/klíče | `./ssl` | `/app/ssl/` |
| Soukromý klíč | `./ssl/privkey.pem` | `/app/ssl/privkey.pem` |
| Certifikát celého řetězce | `./ssl/fullchain.pem` | `/app/ssl/fullchain.pem` |
| Certifikované certifikační autority | `./ssl/cert.pem` | `/app/ssl/cert.pem` |
| Soukromý klíč DKIM | `./ssl/dkim.key` | `/app/ssl/dkim.key` |

> \[!IMPORTANT]
> Soubor `.env` bezpečně uložte. Je nezbytný pro obnovení v případě selhání.
> Najdete ho v souboru `/root/forwardemail.net/self-hosting/.env`.

## Konfigurace {#configuration}

### Počáteční nastavení DNS {#initial-dns-setup}

U vámi zvoleného poskytovatele DNS nakonfigurujte příslušné záznamy DNS. Upozorňujeme, že vše v závorkách (`<>`) je dynamické a je třeba jej aktualizovat vaší hodnotou.

| Typ | Jméno | Obsah | TTL |
| ----- | ------------------ | ----------------------------- | ---- |
| A | „@“, „.“, nebo prázdné | <ip_adresa> | auto |
| CNAME | API | <název_domény> | auto |
| CNAME | Caldav | <název_domény> | auto |
| CNAME | karta | <název_domény> | auto |
| CNAME | fe-odrazy | <název_domény> | auto |
| CNAME | IMAP | <název_domény> | auto |
| CNAME | mx | <název_domény> | auto |
| CNAME | pop3 | <název_domény> | auto |
| CNAME | smtp | <název_domény> | auto |
| MX | „@“, „.“, nebo prázdné | mx.<název_domény> (priorita 0) | auto |
| TXT | „@“, „.“, nebo prázdné | "v=spf1 a -všechny" | auto |

#### Reverzní záznam DNS / PTR {#reverse-dns--ptr-record}

Reverzní DNS (rDNS) nebo záznamy reverzního ukazatele (PTR) jsou pro e-mailové servery nezbytné, protože pomáhají ověřovat legitimitu serveru odesílajícího e-mail. Každý poskytovatel cloudových služeb to dělá jinak, takže budete muset vyhledat, jak přidat „Reverzní DNS“ pro mapování hostitele a IP adresy na odpovídající název hostitele. Nejpravděpodobněji v síťové sekci poskytovatele.

#### Port 25 blokován {#port-25-blocked}

Někteří poskytovatelé internetových služeb a cloudových služeb blokují port 25, aby se vyhnuli zlomyslným aktérům. Pro otevření portu 25 pro SMTP / odchozí e-maily může být nutné podat požadavek na podporu.

## Nástup {#onboarding}

1. Otevřete vstupní stránku
Přejděte na https\://\<název_domény> a nahraďte \<název_domény> doménou nakonfigurovanou v nastavení DNS. Měla by se zobrazit vstupní stránka pro přeposílání e-mailů.

2. Přihlaste se a zaregistrujte svou doménu

* Přihlaste se platným e-mailem a heslem.
* Zadejte název domény, který chcete nastavit (musí odpovídat konfiguraci DNS).
* Postupujte podle pokynů a přidejte požadované záznamy **MX** a **TXT** pro ověření.

3. Dokončete nastavení

* Po ověření přejděte na stránku Aliasy a vytvořte si svůj první alias.
* Volitelně můžete nakonfigurovat **SMTP pro odchozí e-maily** v **Nastavení domény**. To vyžaduje další záznamy DNS.

> \[!NOTE]
> Žádné informace nejsou odesílány mimo váš server. Možnost vlastního hostování a počáteční účet slouží pouze pro přihlášení administrátora a webové zobrazení pro správu domén, aliasů a souvisejících konfigurací e-mailů.

## Testování {#testing}

### Vytvoření vašeho prvního aliasu {#creating-your-first-alias}

1. Přejděte na stránku Aliasy
Otevřete stránku pro správu aliasů:

```sh
https://<domain_name>/en/my-account/domains/<domain_name>/aliases
```

2. Přidejte nový alias

* Klikněte na **Přidat alias** (vpravo nahoře).
* Zadejte alias a podle potřeby upravte nastavení e-mailu.
* (Volitelné) Zaškrtnutím políčka povolte podporu **IMAP/POP3/CalDAV/CardDAV**.
* Klikněte na **Vytvořit alias**.

3. Nastavte heslo

* Klikněte na **Generovat heslo** a vytvořte si bezpečné heslo.
* Toto heslo bude vyžadováno pro přihlášení do vašeho e-mailového klienta.

4. Nakonfigurujte si e-mailového klienta

* Použijte e-mailového klienta, jako je Betterbird. * Zadejte alias a vygenerované heslo. * Nakonfigurujte nastavení **IMAP** a **SMTP** odpovídajícím způsobem.

#### Nastavení e-mailového serveru {#email-server-settings}

Uživatelské jméno: `<alias name>`

| Typ | Název hostitele | Přístav | Zabezpečení připojení | Ověřování |
| ---- | ------------------ | ---- | ------------------- | --------------- |
| SMTP | smtp.<název_domény> | 465 | SSL / TLS | Normální heslo |
| IMAP | imap.<název_domény> | 993 | SSL / TLS | Normální heslo |

### Odesílání / příjem vašeho prvního e-mailu {#sending--receiving-your-first-email}

Po konfiguraci byste měli být schopni odesílat a přijímat e-maily na nově vytvořenou a samostatně hostovanou e-mailovou adresu!

## Řešení problémů {#troubleshooting}

#### Proč to nefunguje mimo Ubuntu a Debian {#why-doesnt-this-work-outside-of-ubuntu-and-debian}

Momentálně hledáme podporu pro MacOS a budeme se věnovat i dalším. Pokud chcete, aby byla podporována i jiná platforma, otevřete prosím soubor [diskuse](https://github.com/orgs/forwardemail/discussions) nebo přispějte.

#### Proč selhává výzva certbot acme {#why-is-the-certbot-acme-challenge-failing}

Nejčastějším problémem je, že certbot / letsencrypt někdy požaduje **2** výzvy. Musíte se ujistit, že přidáte **OBA** txt záznamy.

Příklad:
Můžete vidět dvě výzvy, jako je tato:
\_acme-challenge.example.com -> "randomstring1"
\_acme-challenge.example.com -> "randomstring2"

Je také možné, že šíření DNS nebylo dokončeno. Můžete použít nástroje jako: `https://toolbox.googleapps.com/apps/dig/#TXT/_acme-challenge.<your_domain>`. To vám dá představu, zda by se změny vašeho TXT záznamu měly projevit. Je také možné, že lokální DNS cache na vašem hostiteli stále používá starou, zastaralou hodnotu nebo nezachytila nedávné změny.

Další možností je použít automatické změny DNS serveru Cerbot nastavením souboru `/root/.cloudflare.ini` s tokenem API ve vašem cloud-init / user-data při počátečním nastavení VPS nebo vytvořením tohoto souboru a opětovným spuštěním skriptu. Tím se změny DNS a aktualizace vyvolají automaticky.

### Jaké je základní uživatelské jméno a heslo pro autorizaci {#what-is-the-basic-auth-username-and-password}

Pro vlastní hosting přidáváme vyskakovací okno s nativním ověřováním v prohlížeči s jednoduchým uživatelským jménem (`admin`) a heslem (náhodně vygenerovaným při počátečním nastavení). Toto heslo přidáváme pouze jako ochranu pro případ, že by vás automatizace / scraperové nějakým způsobem předběhli k první registraci na webu. Toto heslo najdete po počátečním nastavení v souboru `.env` v položkách `AUTH_BASIC_USERNAME` a `AUTH_BASIC_PASSWORD`.

### Jak zjistím, co je spuštěno {#how-do-i-know-what-is-running}

Můžete spustit příkaz `docker ps` a zobrazit všechny spuštěné kontejnery, které jsou spouštěny ze souboru `docker-compose-self-hosting.yml`. Můžete také spustit příkaz `docker ps -a` a zobrazit vše (včetně kontejnerů, které neběží).

### Jak zjistím, že něco, co by mělo být spuštěno, nefunguje {#how-do-i-know-if-something-isnt-running-that-should-be}

Můžete spustit příkaz `docker ps -a` a zobrazit tak vše (včetně kontejnerů, které neběží). Může se zobrazit protokol ukončení nebo poznámka.

### Jak najdu protokoly {#how-do-i-find-logs}

Další protokoly můžete získat pomocí souboru `docker logs -f <container_name>`. Pokud došlo k nějakému ukončení, pravděpodobně to souvisí s nesprávně nakonfigurovaným souborem `.env`.

Ve webovém rozhraní si můžete prohlédnout protokoly odchozích e-mailů `/admin/emails` a `/admin/logs`, respektive protokoly chyb.

### Proč mi vypršel časový limit odchozích e-mailů {#why-are-my-outgoing-emails-timing-out}

Pokud se při připojování k serveru MX zobrazí zpráva typu „Časový limit připojení vypršel...“, pak budete možná muset zkontrolovat, zda není port 25 blokován. Je běžné, že poskytovatelé internetových služeb nebo cloudových služeb tento port ve výchozím nastavení blokují, takže se budete muset obrátit na podporu / podat požadavek, abyste tuto možnost zpřístupnili.

#### Jaké nástroje mám použít k testování osvědčených postupů pro konfiguraci e-mailu a reputace IP adresy {#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation}

Podívejte se na náš [Často kladené otázky zde](/faq#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation).