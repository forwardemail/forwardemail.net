# Self Hosted {#self-hosted}


## Obsah {#table-of-contents}

* [Začínáme](#getting-started)
* [Požadavky](#requirements)
  * [Cloud-init / User-data](#cloud-init--user-data)
* [Instalace](#install)
  * [Ladění instalačního skriptu](#debug-install-script)
  * [Výzvy](#prompts)
  * [Počáteční nastavení (Možnost 1)](#initial-setup-option-1)
* [Služby](#services)
  * [Důležité cesty k souborům](#important-file-paths)
* [Konfigurace](#configuration)
  * [Počáteční nastavení DNS](#initial-dns-setup)
* [Začlenění](#onboarding)
* [Testování](#testing)
  * [Vytvoření vašeho prvního aliasu](#creating-your-first-alias)
  * [Odeslání / Přijetí vašeho prvního e-mailu](#sending--receiving-your-first-email)
* [Řešení problémů](#troubleshooting)
  * [Jaké je uživatelské jméno a heslo pro základní autentizaci](#what-is-the-basic-auth-username-and-password)
  * [Jak zjistím, co běží](#how-do-i-know-what-is-running)
  * [Jak zjistím, jestli něco neběží, co by mělo](#how-do-i-know-if-something-isnt-running-that-should-be)
  * [Jak najdu logy](#how-do-i-find-logs)
  * [Proč moje odchozí e-maily vypršely časově](#why-are-my-outgoing-emails-timing-out)


## Začínáme {#getting-started}

Naše self-hosted e-mailové řešení, stejně jako všechny naše produkty, je 100% open-source — jak frontend, tak backend. To znamená:

1. **Úplná transparentnost**: Každý řádek kódu, který zpracovává vaše e-maily, je k dispozici k veřejné kontrole
2. **Příspěvky komunity**: Každý může přispět vylepšeními nebo opravit chyby
3. **Bezpečnost díky otevřenosti**: Zranitelnosti může identifikovat a opravit globální komunita
4. **Žádné závislosti na dodavateli**: Nikdy nejste závislí na existenci naší společnosti

Celý kód je dostupný na GitHubu na <https://github.com/forwardemail/forwardemail.net>, licencovaný pod MIT licencí.

Architektura zahrnuje kontejnery pro:

* SMTP server pro odchozí e-maily
* IMAP/POP3 servery pro příjem e-mailů
* Webové rozhraní pro správu
* Databázi pro ukládání konfigurace
* Redis pro cache a výkon
* SQLite pro bezpečné, šifrované úložiště poštovních schránek

> \[!NOTE]
> Nezapomeňte se podívat na náš [self-hosted blog](https://forwardemail.net/blog/docs/self-hosted-solution)
>
> A pro ty, kteří mají zájem o podrobnější krok za krokem verzi, viz naše průvodce založené na [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) nebo [Debian](https://forwardemail.net/guides/selfhosted-on-debian).


## Požadavky {#requirements}

Před spuštěním instalačního skriptu se ujistěte, že máte následující:

* **Operační systém**: Server založený na Linuxu (aktuálně podporujeme Ubuntu 22.04+).
* **Zdroje**: 1 vCPU a 2GB RAM
* **Root přístup**: Administrátorská práva pro spouštění příkazů.
* **Doména**: Vlastní doména připravená pro konfiguraci DNS.
* **Čistá IP**: Ujistěte se, že váš server má čistou IP adresu bez předchozí reputace spamu kontrolou blacklistů. Více informací [zde](#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation).
* Veřejná IP adresa s podporou portu 25
* Možnost nastavit [reverse PTR](https://www.cloudflare.com/learning/dns/dns-records/dns-ptr-record/)
* Podpora IPv4 a IPv6

> \[!TIP]
> Podívejte se na náš seznam [skvělých poskytovatelů mail serverů](https://github.com/forwardemail/awesome-mail-server-providers)

### Cloud-init / User-data {#cloud-init--user-data}

Většina cloudových poskytovatelů podporuje konfiguraci cloud-init pro případ, kdy je virtuální privátní server (VPS) provisionován. Je to skvělý způsob, jak předem nastavit některé soubory a proměnné prostředí pro použití v logice počátečního nastavení skriptu, což umožní obejít potřebu výzev během běhu skriptu pro další informace.

**Možnosti**

* `EMAIL` - e-mail používaný pro připomenutí expirace certbotu
* `DOMAIN` - vlastní doména (např. `example.com`) používaná pro nastavení self-hostingu
* `AUTH_BASIC_USERNAME` - uživatelské jméno používané při prvotním nastavení k ochraně stránky
* `AUTH_BASIC_PASSWORD` - heslo používané při prvotním nastavení k ochraně stránky
* `/root/.cloudflare.ini` - (**pouze uživatelé Cloudflare**) konfigurační soubor Cloudflare používaný certbotem pro DNS konfiguraci. Vyžaduje nastavení API tokenu přes `dns_cloudflare_api_token`. Více informací [zde](https://certbot-dns-cloudflare.readthedocs.io/en/stable/).
Example:

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

## Instalace {#install}

Spusťte následující příkaz na vašem serveru pro stažení a spuštění instalačního skriptu:

```sh
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

### Ladění instalačního skriptu {#debug-install-script}

Přidejte `DEBUG=true` před instalační skript pro podrobný výstup:

```sh
DEBUG=true bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

### Výzvy {#prompts}

```sh
1. Počáteční nastavení
2. Nastavení záloh
3. Nastavení automatických aktualizací
4. Obnovení certifikátů
5. Obnovení ze zálohy
6. Nápověda
7. Ukončit
```

* **Počáteční nastavení**: Stáhne nejnovější kód forward emailu, nakonfiguruje prostředí, vyzve vás k zadání vlastní domény a nastaví všechny potřebné certifikáty, klíče a tajné údaje.
* **Nastavení záloh**: Nastaví cron pro zálohování mongoDB a redis pomocí S3-kompatibilního úložiště pro bezpečné vzdálené uložení. Samostatně bude sqlite zálohován při přihlášení, pokud došlo ke změnám, pro bezpečné a šifrované zálohy.
* **Nastavení aktualizací**: Nastaví cron, který bude hledat noční aktualizace, které bezpečně přestaví a restartují komponenty infrastruktury.
* **Obnovení certifikátů**: Certbot / lets encrypt se používá pro SSL certifikáty a klíče, které vyprší každé 3 měsíce. Toto obnoví certifikáty pro vaši doménu a umístí je do potřebné složky, aby je mohly příslušné komponenty použít. Viz [důležité cesty k souborům](#important-file-paths)
* **Obnovení ze zálohy**: Spustí obnovení mongodb a redis ze záložních dat.

### Počáteční nastavení (volba 1) {#initial-setup-option-1}

Zvolte možnost `1. Počáteční nastavení` pro zahájení.

Po dokončení byste měli vidět zprávu o úspěchu. Můžete také spustit `docker ps` a zobrazit **běžící** komponenty. Více informací o komponentách níže.

## Služby {#services}

| Název služby |         Výchozí port        | Popis                                                  |
| ------------ | :-------------------------: | ------------------------------------------------------ |
| Web          |            `443`            | Webové rozhraní pro veškeré administrativní interakce |
| API          |            `4000`           | API vrstva pro abstrakci databází                      |
| Bree         |             Žádný           | Pozadí úloh a správce úkolů                            |
| SMTP         | `465` (doporučeno) / `587`  | SMTP server pro odchozí e-maily                        |
| SMTP Bree    |             Žádný           | SMTP pozadí úloh                                       |
| MX           |            `2525`           | Mail exchange pro příchozí e-maily a přeposílání      |
| IMAP         |          `993/2993`         | IMAP server pro příchozí e-maily a správu schránek    |
| POP3         |          `995/2995`         | POP3 server pro příchozí e-maily a správu schránek    |
| SQLite       |            `3456`           | SQLite server pro interakce s SQLite databázemi       |
| SQLite Bree  |             Žádný           | SQLite pozadí úloh                                     |
| CalDAV       |            `5000`           | CalDAV server pro správu kalendáře                     |
| CardDAV      |            `6000`           | CardDAV server pro správu kontaktů                      |
| MongoDB      |           `27017`           | MongoDB databáze pro většinu správy dat                |
| Redis        |            `6379`           | Redis pro cachování a správu stavu                      |
| SQLite       |             Žádný           | SQLite databáze pro šifrované schránky                 |

### Důležité cesty k souborům {#important-file-paths}

Poznámka: *Hostitelská cesta* níže je relativní k `/root/forwardemail.net/self-hosting/`.

| Komponenta             |       Hostitelská cesta       | Cesta v kontejneru           |
| ---------------------- | :---------------------------: | ---------------------------- |
| MongoDB                |   `./mongo-backups`           | `/backups`                   |
| Redis                  |     `./redis-data`            | `/data`                      |
| Sqlite                 |    `./sqlite-data`            | `/mnt/{SQLITE_STORAGE_PATH}` |
| Env soubor             |        `./.env`               | `/app/.env`                  |
| SSL certifikáty/klíče  |        `./ssl`                | `/app/ssl/`                  |
| Soukromý klíč          |  `./ssl/privkey.pem`          | `/app/ssl/privkey.pem`       |
| Certifikát plného řetězce | `./ssl/fullchain.pem`       | `/app/ssl/fullchain.pem`     |
| CA certifikát          |    `./ssl/cert.pem`           | `/app/ssl/cert.pem`          |
| DKIM soukromý klíč     |    `./ssl/dkim.key`           | `/app/ssl/dkim.key`          |
> \[!IMPORTANT]
> Uložte soubor `.env` bezpečně. Je klíčový pro obnovu v případě selhání.
> Najdete ho v `/root/forwardemail.net/self-hosting/.env`.


## Konfigurace {#configuration}

### Počáteční nastavení DNS {#initial-dns-setup}

Ve svém poskytovateli DNS nastavte příslušné DNS záznamy. Všimněte si, že vše v závorkách (`<>`) je dynamické a je potřeba to aktualizovat na vaši hodnotu.

| Typ   | Název              | Obsah                        | TTL  |
| ----- | ------------------ | ---------------------------- | ---- |
| A     | "@", ".", nebo prázdné | <ip_address>               | auto |
| CNAME | api                | <domain_name>                | auto |
| CNAME | caldav             | <domain_name>                | auto |
| CNAME | carddav            | <domain_name>                | auto |
| CNAME | fe-bounces         | <domain_name>                | auto |
| CNAME | imap               | <domain_name>                | auto |
| CNAME | mx                 | <domain_name>                | auto |
| CNAME | pop3               | <domain_name>                | auto |
| CNAME | smtp               | <domain_name>                | auto |
| MX    | "@", ".", nebo prázdné | mx.<domain_name> (priorita 0) | auto |
| TXT   | "@", ".", nebo prázdné | "v=spf1 a -all"            | auto |

#### Reverzní DNS / PTR záznam {#reverse-dns--ptr-record}

Reverzní DNS (rDNS) nebo reverzní ukazatelé (PTR záznamy) jsou nezbytné pro e-mailové servery, protože pomáhají ověřit legitimitu serveru odesílajícího e-mail. Každý poskytovatel cloudu to řeší jinak, proto si budete muset vyhledat, jak přidat "Reverzní DNS" pro mapování hostitele a IP na odpovídající hostname. Pravděpodobně to najdete v sekci síťových nastavení poskytovatele.

#### Port 25 zablokován {#port-25-blocked}

Někteří ISP a poskytovatelé cloudu blokují port 25, aby zabránili zneužití. Možná budete muset podat žádost na podporu, aby vám port 25 pro SMTP / odchozí e-maily otevřeli.


## Začínáme {#onboarding}

1. Otevřete vstupní stránku  
   Přejděte na https\://\<domain_name>, kde \<domain_name> nahraďte doménou nastavenou ve vašem DNS. Měla by se zobrazit vstupní stránka Forward Email.

2. Přihlaste se a nastavte svou doménu

* Přihlaste se platným e-mailem a heslem.
* Zadejte doménu, kterou chcete nastavit (musí odpovídat DNS konfiguraci).
* Postupujte podle pokynů pro přidání požadovaných **MX** a **TXT** záznamů pro ověření.

3. Dokončete nastavení

* Po ověření přejděte na stránku Aliasů a vytvořte svůj první alias.
* Volitelně nastavte **SMTP pro odchozí e-maily** v **Nastavení domény**. To vyžaduje další DNS záznamy.

> \[!NOTE]
> Žádné informace nejsou odesílány mimo váš server. Možnost self-hosting a počáteční účet slouží pouze pro přihlášení správce a webové rozhraní pro správu domén, aliasů a souvisejících e-mailových konfigurací.


## Testování {#testing}

### Vytvoření prvního aliasu {#creating-your-first-alias}

1. Přejděte na stránku Aliasů  
   Otevřete stránku správy aliasů:

```sh
https://<domain_name>/en/my-account/domains/<domain_name>/aliases
```

2. Přidejte nový alias

* Klikněte na **Přidat alias** (vpravo nahoře).
* Zadejte název aliasu a upravte nastavení e-mailu podle potřeby.
* (Volitelné) Povolit podporu **IMAP/POP3/CalDAV/CardDAV** zaškrtnutím políčka.
* Klikněte na **Vytvořit alias.**

3. Nastavte heslo

* Klikněte na **Vygenerovat heslo** pro vytvoření bezpečného hesla.
* Toto heslo bude potřeba pro přihlášení do vašeho e-mailového klienta.

4. Nakonfigurujte svůj e-mailový klient

* Použijte e-mailového klienta jako Thunderbird.
* Zadejte název aliasu a vygenerované heslo.
* Nakonfigurujte nastavení **IMAP** a **SMTP** podle potřeby.

#### Nastavení e-mailového serveru {#email-server-settings}

Uživatelské jméno: `<alias name>`

| Typ  | Hostname           | Port | Zabezpečení připojení | Autentizace     |
| ---- | ------------------ | ---- | --------------------- | --------------- |
| SMTP | smtp.<domain_name> | 465  | SSL / TLS             | Normální heslo  |
| IMAP | imap.<domain_name> | 993  | SSL / TLS             | Normální heslo  |

### Odeslání / přijetí prvního e-mailu {#sending--receiving-your-first-email}

Po konfiguraci byste měli být schopni odesílat a přijímat e-maily na vaši nově vytvořenou a self-hostovanou e-mailovou adresu!
## Řešení problémů {#troubleshooting}

#### Proč to nefunguje mimo Ubuntu a Debian {#why-doesnt-this-work-outside-of-ubuntu-and-debian}

Momentálně se snažíme podpořit MacOS a budeme se zaměřovat i na další systémy. Pokud byste chtěli vidět podporu dalších systémů, otevřete prosím [diskuzi](https://github.com/orgs/forwardemail/discussions) nebo přispějte.

#### Proč selhává certbot acme challenge {#why-is-the-certbot-acme-challenge-failing}

Nejčastější problém je, že certbot / letsencrypt někdy požaduje **2** výzvy. Musíte se ujistit, že přidáte **OBĚ** TXT záznamy.

Příklad:
Můžete vidět dvě výzvy takto:
\_acme-challenge.example.com -> "randomstring1"
\_acme-challenge.example.com -> "randomstring2"

Je také možné, že propagace DNS ještě není dokončena. Můžete použít nástroje jako: `https://toolbox.googleapps.com/apps/dig/#TXT/_acme-challenge.<your_domain>`. To vám dá představu, zda by se změny TXT záznamu měly již projevit. Je také možné, že lokální DNS cache na vašem hostiteli stále používá starou, zastaralou hodnotu nebo nezachytila nedávné změny.

Další možností je použít automatizované změny DNS certbotem nastavením souboru `/root/.cloudflare.ini` s API tokenem ve vašem cloud-init / user-data při počátečním nastavení VPS nebo tento soubor vytvořit a skript spustit znovu. To automaticky spravuje změny DNS a aktualizace výzev.

### Jaké je uživatelské jméno a heslo pro základní autentizaci {#what-is-the-basic-auth-username-and-password}

Pro vlastní hosting přidáváme při prvním přístupu v prohlížeči nativní autentizační vyskakovací okno s jednoduchým uživatelským jménem (`admin`) a heslem (náhodně generované při počátečním nastavení). Přidáváme to jako ochranu v případě, že by vás automatizace / scrapers předběhly a zaregistrovaly se první na webovém rozhraní. Toto heslo najdete po počátečním nastavení ve vašem `.env` souboru pod `AUTH_BASIC_USERNAME` a `AUTH_BASIC_PASSWORD`.

### Jak zjistím, co běží {#how-do-i-know-what-is-running}

Můžete spustit `docker ps` a zobrazit všechny běžící kontejnery, které jsou spuštěny z `docker-compose-self-hosting.yml` souboru. Můžete také spustit `docker ps -a` a zobrazit vše (včetně kontejnerů, které neběží).

### Jak zjistím, jestli něco neběží, co by mělo {#how-do-i-know-if-something-isnt-running-that-should-be}

Můžete spustit `docker ps -a` a zobrazit vše (včetně kontejnerů, které neběží). Můžete vidět výstupní log nebo poznámku.

### Jak najdu logy {#how-do-i-find-logs}

Více logů získáte pomocí `docker logs -f <container_name>`. Pokud něco skončilo, pravděpodobně to souvisí s nesprávnou konfigurací `.env` souboru.

V rámci webového rozhraní můžete zobrazit `/admin/emails` a `/admin/logs` pro logy odchozích emailů a chybové logy.

### Proč moje odchozí emaily vypršely časově {#why-are-my-outgoing-emails-timing-out}

Pokud vidíte zprávu jako Connection timed out when connecting to MX server..., možná budete muset zkontrolovat, zda není blokován port 25. Je běžné, že ISP nebo poskytovatelé cloudu tento port blokují ve výchozím nastavení, kde je potřeba kontaktovat podporu / podat tiket, aby byl port otevřen.

#### Jaké nástroje bych měl použít k testování správné konfigurace emailu a reputace IP {#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation}

Podívejte se na naši [FAQ zde](/faq#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation).
