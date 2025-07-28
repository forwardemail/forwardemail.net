# Vlastní hostování {#self-hosted}

__CHRÁNĚNÁ_URL_41__ Obsah {__CHRÁNĚNÁ_URL_42__

* [Začínáme](#getting-started)
* [Požadavky](#requirements)
  * [Cloud-init / User-data](#cloud-init--user-data)
* [Instalovat](#install)
  * [Debug instalační skript](#debug-install-script)
  * [Výzvy](#prompts)
  * [Počáteční nastavení (Možnost 1)](#initial-setup-option-1)
* [Služby](#services)
  * [Důležité cesty k souborům](#important-file-paths)
* [Konfigurace](#configuration)
  * [Počáteční nastavení DNS](#initial-dns-setup)
* [Přihlášení](#onboarding)
* [Testování](#testing)
  * [Vytvoření prvního aliasu](#creating-your-first-alias)
  * [Odeslání / Příjem vašeho prvního e-mailu](#sending--receiving-your-first-email)
* [Odstraňování problémů](#troubleshooting)
  * [Jaké je základní autorizační uživatelské jméno a heslo](#what-is-the-basic-auth-username-and-password)
  * [Jak poznám, co běží](#how-do-i-know-what-is-running)
  * [Jak poznám, že něco neběží, že by to mělo být](#how-do-i-know-if-something-isnt-running-that-should-be)
  * [Jak najdu protokoly](#how-do-i-find-logs)
  * [Proč mi vyprší časový limit odchozích e-mailů](#why-are-my-outgoing-emails-timing-out)

## Začínáme {#getting-started}

Naše e-mailové řešení s vlastním hostitelem, stejně jako všechny naše produkty, je 100% open source – jak frontend, tak backend. To znamená:

1. **Naprostá transparentnost**: Každý řádek kódu, který zpracovává vaše e-maily, je k dispozici pro veřejnou kontrolu.
2. **Příspěvky komunity**: Kdokoli může přispět vylepšeními nebo opravit problémy.
3. **Zabezpečení prostřednictvím otevřenosti**: Zranitelnosti může identifikovat a opravit globální komunita.
4. **Žádná vázanost na dodavatele**: Nikdy nejste závislí na existenci naší společnosti.

Celá kódová základna je k dispozici na GitHubu na adrese <https://github.com/forwardemail/forwardemail.net>, licencovaná pod licencí MIT.

Architektura obsahuje kontejnery pro:

* SMTP server pro odchozí e-maily
* IMAP/POP3 servery pro načítání e-mailů
* Webové rozhraní pro správu
* Databáze pro ukládání konfigurace
* Redis pro ukládání do mezipaměti a výkon
* SQLite pro bezpečné a šifrované ukládání poštovních schránek

> \[!NOTE]
> Be sure to check out our [self-hosted blog](https://forwardemail.net/blog/docs/self-hosted-solution)
>
> And for those interested in a more broken down step-by-step version see our [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) or [Debian](https://forwardemail.net/guides/selfhosted-on-debian) based guides.

## Požadavky {#requirements}

Před spuštěním instalačního skriptu se ujistěte, že máte následující:

* **Operační systém**: Server založený na Linuxu (aktuálně podporuje Ubuntu 22.04+).
* **Zdroje**: 1 virtuální procesor a 2 GB RAM
* **Root přístup**: Administrátorská oprávnění pro spouštění příkazů.
* **Název domény**: Vlastní doména připravená pro konfiguraci DNS.
* **Čistá IP adresa**: Zajistěte, aby váš server měl čistou IP adresu bez předchozí spamové reputace kontrolou černých listů. Více informací [zde](#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation).
* Veřejná IP adresa s podporou portu 25
* Možnost nastavení [reverzní PTR](https://www.cloudflare.com/learning/dns/dns-records/dns-ptr-record/)
* Podpora IPv4 a IPv6

> \[!TIP]
> See our list of [awesome mail server providers](https://github.com/forwardemail/awesome-mail-server-providers)

### Cloudová inicializace / Uživatelská data {#cloud-init--user-data}

Většina cloudových dodavatelů podporuje konfiguraci cloud-init, když je zřízen virtuální privátní server (VPS). Je to skvělý způsob, jak nastavit některé soubory a proměnné prostředí předem pro použití logikou počátečního nastavení skriptů, což obejde nutnost žádat během běhu skriptu o další informace.

**Možnosti**

* `EMAIL` - e-mail používaný pro připomenutí vypršení platnosti certbotu
* `DOMAIN` - vlastní doména (např. `example.com`) používaná pro nastavení vlastního hostingu
* `AUTH_BASIC_USERNAME` - uživatelské jméno použité při prvním nastavení k ochraně webu
* `AUTH_BASIC_PASSWORD` - heslo použité při prvním nastavení k ochraně webu
* `/root/.cloudflare.ini` - (**pouze uživatelé Cloudflare**) konfigurační soubor cloudflare používaný certbotem pro konfiguraci DNS. Vyžaduje nastavení API tokenu pomocí `dns_cloudflare_api_token`. Více informací [zde](https://certbot-dns-cloudflare.readthedocs.io/en/stable/).

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

__CHRÁNĚNÁ_URL_50__ Nainstalujte {__CHRÁNĚNÁ_URL_51__

Spuštěním následujícího příkazu na serveru stáhněte a spusťte instalační skript:

```sh
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

### Ladicí instalační skript {#debug-install-script}

Pro podrobný výstup přidejte před instalační skript `DEBUG=true`:

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

* **Počáteční nastavení**: Stáhněte si nejnovější kód pro přesměrování e-mailů, nakonfigurujte prostředí, vyžádejte si vlastní doménu a nastavte všechny potřebné certifikáty, klíče a tajné klíče.
* **Nastavení zálohování**: Nastaví cron pro zálohování MongoDB a Redis pomocí úložiště kompatibilního s S3 pro bezpečné a vzdálené ukládání. Samostatně bude při přihlášení zálohován sqlite, pokud dojde ke změnám pro bezpečné a šifrované zálohy.
* **Nastavení upgradu**: Nastaví cron pro vyhledávání nočních aktualizací, které bezpečně obnoví a restartují komponenty infrastruktury.
* **Obnovení certifikátů**: Pro SSL certifikáty se používá Certbot / lets encrypt a klíče vyprší každé 3 měsíce. Tím se obnoví certifikáty pro vaši doménu a umístí se do potřebné složky, aby je mohly spotřebovat související komponenty. Viz [důležité cesty k souborům](#important-file-paths)
* **Obnovení ze zálohy**: Spustí MongoDB a Redis pro obnovení ze zálohovaných dat.

### Počáteční nastavení (možnost 1) {#initial-setup-option-1}

Pro začátek vyberte možnost `1. Initial setup`.

Po dokončení byste měli vidět zprávu o úspěchu. Můžete dokonce spustit `docker ps` a sledovat, jak se komponenty roztočily. Více informací o komponentách níže.

__CHRÁNĚNÁ_URL_58__ Služby {__CHRÁNĚNÁ_URL_59__

| Název služby | Výchozí port | Popis |
| ------------ | :----------: | ------------------------------------------------------ |
| Web | `443` | Webové rozhraní pro všechny administrátorské interakce |
| API | `4000` | Vrstva API na abstraktní databáze |
| Bree | Žádný | Úkol na pozadí a úkol běžec |
| SMTP | `465/587` | Server SMTP pro odchozí poštu |
| SMTP Bree | Žádný | Úloha na pozadí SMTP |
| MX | `2525` | Výměna pošty pro příchozí e-maily a přeposílání e-mailů |
| IMAP | `993/2993` | Server IMAP pro správu příchozí pošty a poštovní schránky |
| POP3 | `995/2995` | POP3 server pro správu příchozích e-mailů a poštovních schránek |
| SQLite | `3456` | SQLite server pro interakce s databází sqlite |
| SQLite Bree | Žádný | Práce na pozadí SQLite |
| CalDAV | `5000` | CalDAV server pro správu kalendářů |
| CardDAV | `6000` | CardDAV server pro správu kalendářů |
| MongoDB | `27017` | Databáze MongoDB pro správu většiny dat |
| Redis | `6379` | Redis pro ukládání do mezipaměti a správu stavu |
| SQLite | Žádný | Databáze SQLite pro šifrované poštovní schránky |

### Důležité cesty k souborům {#important-file-paths}

Poznámka: *Cesta k hostiteli* níže je relativní vzhledem k `/root/forwardemail.net/self-hosting/`.

| Komponent | Hostitelská cesta | Cesta kontejneru |
| ---------------------- | :-------------------: | ---------------------------- |
| MongoDB | `./mongo-backups` | `/backups` |
| Redis | `./redis-data` | `/data` |
| Sqlite | `./sqlite-data` | `/mnt/{SQLITE_STORAGE_PATH}` |
| Env soubor | `./.env` | `/app/.env` |
| SSL certifikáty/klíče | `./ssl` | `/app/ssl/` |
| Soukromý klíč | `./ssl/privkey.pem` | `/app/ssl/privkey.pem` |
| Certifikát celého řetězu | `./ssl/fullchain.pem` | `/app/ssl/fullchain.pem` |
| Certifikáty CA | `./ssl/cert.pem` | `/app/ssl/cert.pem` |
| Soukromý klíč DKIM | `./ssl/dkim.key` | `/app/ssl/dkim.key` |

> \[!IMPORTANT]
> Save the `.env` file securely. It is critical for recovery in case of failure.
> You can find this in `/root/forwardemail.net/self-hosting/.env`.

__CHRÁNĚNÁ_URL_62__ Konfigurace {__CHRÁNĚNÁ_URL_63__

### Počáteční nastavení DNS {#initial-dns-setup}

U vámi zvoleného poskytovatele DNS nakonfigurujte příslušné záznamy DNS. Upozorňujeme, že vše v závorkách (`<>`) je dynamické a je třeba jej aktualizovat vaší hodnotou.

| Typ | Jméno | Obsah | TTL |
| ----- | ------------------ | ----------------------------- | ---- |
| A | "@", "." nebo prázdné | <ip_address> | auto |
| CNAME | api | <název_domény> | auto |
| CNAME | caldav | <název_domény> | auto |
| CNAME | karta | <název_domény> | auto |
| CNAME | fe-odskočí | <název_domény> | auto |
| CNAME | imap | <název_domény> | auto |
| CNAME | mx | <název_domény> | auto |
| CNAME | pop3 | <název_domény> | auto |
| CNAME | smtp | <název_domény> | auto |
| MX | "@", "." nebo prázdné | mx.<název_domény> (priorita 0) | auto |
| TXT | "@", "." nebo prázdné | "v=spf1 a -all" | auto |

#### Reverzní DNS / PTR záznam {#reverse-dns--ptr-record}

Reverzní DNS (rDNS) nebo záznamy reverzního ukazatele (PTR záznamy) jsou pro e-mailové servery nezbytné, protože pomáhají ověřit legitimitu serveru odesílajícího e-mail. Každý poskytovatel cloudu to dělá jinak, takže budete muset vyhledat, jak přidat „Reverse DNS“ k mapování hostitele a IP na odpovídající název hostitele. Nejspíše v síťové části poskytovatele.

#### Port 25 blokován {#port-25-blocked}

Někteří poskytovatelé internetových služeb a poskytovatelé cloudu blokují číslo 25, aby se vyhnuli špatným aktérům. K otevření portu 25 pro SMTP / odchozí e-maily možná budete muset zadat lístek podpory.

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
> No information is sent outside of your server. The self hosted option and initial account is just for the admin login and web view to manage domains, aliases and related email configurations.

__CHRÁNĚNÁ_URL_72__ Testování {__CHRÁNĚNÁ_URL_73__

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

* Použijte e-mailového klienta, jako je Thunderbird. * Zadejte alias a vygenerované heslo. * Nakonfigurujte nastavení **IMAP** a **SMTP** odpovídajícím způsobem.

#### Nastavení e-mailového serveru {#email-server-settings}

Uživatelské jméno: `<alias name>`

| Typ | Název hostitele | Přístav | Zabezpečení připojení | Autentizace |
| ---- | ------------------ | ---- | ------------------- | --------------- |
| SMTP | smtp.<název_domény> | 465 | SSL / TLS | Normální heslo |
| IMAP | imap.<název_domény> | 993 | SSL / TLS | Normální heslo |

### Odesílání / příjem vašeho prvního e-mailu {#sending--receiving-your-first-email}

Po konfiguraci byste měli být schopni odesílat a přijímat e-maily na svou nově vytvořenou a hostovanou e-mailovou adresu!

## Řešení problémů {#troubleshooting}

#### Proč to nefunguje mimo Ubuntu a Debian {#why-doesnt-this-work-outside-of-ubuntu-and-debian}

Momentálně hledáme podporu pro MacOS a budeme hledat i další. Pokud chcete, aby byla podporována i jiná platforma, otevřete prosím [diskuse](https://github.com/orgs/forwardemail/discussions) nebo přispějte.

#### Proč selhává výzva certbot acme {#why-is-the-certbot-acme-challenge-failing}

Nejčastějším problémem je, že certbot / letsencrypt někdy požaduje **2** výzvy. Musíte se ujistit, že přidáte **OBA** txt záznamy.

Příklad:
Můžete vidět dvě výzvy, jako je tato:
\_acme-challenge.example.com -> "randomstring1"
\_acme-challenge.example.com -> "randomstring2"

Je také možné, že šíření DNS nebylo dokončeno. Můžete použít nástroje jako: `https://toolbox.googleapps.com/apps/dig/#TXT/_acme-challenge.<your_domain>`. To vám dá představu, zda by se změny vašeho TXT záznamu měly projevit. Je také možné, že lokální DNS cache na vašem hostiteli stále používá starou, zastaralou hodnotu nebo nezachytila nedávné změny.

Další možností je použít automatické změny DNS serveru Cerbot nastavením souboru `/root/.cloudflare.ini` s API tokenem ve vašem cloud-init / user-data při počátečním nastavení VPS nebo vytvořením tohoto souboru a opětovným spuštěním skriptu. Tím se změny DNS a aktualizace vyvolají automaticky.

### Jaké je základní uživatelské jméno a heslo pro autorizaci {#what-is-the-basic-auth-username-and-password}

Pro vlastní hosting přidáváme vyskakovací okno s nativním ověřováním v prohlížeči s jednoduchým uživatelským jménem (`admin`) a heslem (náhodně vygenerovaným při počátečním nastavení). Toto heslo přidáváme pouze jako ochranu pro případ, že by vás automatizace / scraperové nějakým způsobem předběhli k první registraci na webu. Toto heslo najdete po počátečním nastavení v souboru `.env` v adresářích `AUTH_BASIC_USERNAME` a `AUTH_BASIC_PASSWORD`.

### Jak zjistím, co je spuštěno {#how-do-i-know-what-is-running}

Můžete spustit `docker ps` a zobrazit všechny spuštěné kontejnery, které jsou spouštěny ze souboru `docker-compose-self-hosting.yml`. Můžete také spustit `docker ps -a` a zobrazit vše (včetně kontejnerů, které neběží).

### Jak poznám, že něco, co by mělo být spuštěno, nefunguje {#how-do-i-know-if-something-isnt-running-that-should-be}

Všechno (včetně kontejnerů, které nejsou spuštěny) můžete zobrazit spuštěním příkazu `docker ps -a`. Může se zobrazit protokol ukončení nebo poznámka.

### Jak najdu protokoly {#how-do-i-find-logs}

Další protokoly můžete získat pomocí `docker logs -f <container_name>`. Pokud došlo k nějakému ukončení, pravděpodobně to souvisí s nesprávně nakonfigurovaným souborem `.env`.

Ve webovém rozhraní si můžete prohlédnout protokoly odchozích e-mailů a chyb `/admin/emails` a `/admin/logs`.

### Proč mi vypršel časový limit odchozích e-mailů {#why-are-my-outgoing-emails-timing-out}

Pokud se při připojování k serveru MX zobrazí zpráva jako Vypršel časový limit připojení..., možná budete muset zkontrolovat, zda není blokován port 25. Je běžné, že poskytovatelé internetových služeb nebo poskytovatelé cloudu to ve výchozím nastavení blokují, kde možná budete muset požádat o podporu / podat tiket, aby se to otevřelo.

#### Jaké nástroje mám použít k testování osvědčených postupů pro konfiguraci e-mailu a reputace IP adres {#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation}

Podívejte se na náš __CHRÁNĚNÝ_LINK_124__.