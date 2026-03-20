# Listmonk s Forward Email pro bezpečné doručování newsletterů {#listmonk-with-forward-email-for-secure-newsletter-delivery}


## Obsah {#table-of-contents}

* [Přehled](#overview)
* [Proč Listmonk a Forward Email](#why-listmonk-and-forward-email)
* [Požadavky](#prerequisites)
* [Instalace](#installation)
  * [1. Aktualizujte svůj server](#1-update-your-server)
  * [2. Nainstalujte závislosti](#2-install-dependencies)
  * [3. Stáhněte konfiguraci Listmonk](#3-download-listmonk-configuration)
  * [4. Nakonfigurujte firewall (UFW)](#4-configure-firewall-ufw)
  * [5. Nakonfigurujte přístup přes HTTPS](#5-configure-https-access)
  * [6. Spusťte Listmonk](#6-start-listmonk)
  * [7. Nakonfigurujte Forward Email SMTP v Listmonk](#7-configure-forward-email-smtp-in-listmonk)
  * [8. Nakonfigurujte zpracování bounce](#8-configure-bounce-processing)
* [Testování](#testing)
  * [Vytvořte mailing list](#create-a-mailing-list)
  * [Přidejte odběratele](#add-subscribers)
  * [Vytvořte a odešlete kampaň](#create-and-send-a-campaign)
* [Ověření](#verification)
* [Poznámky pro vývojáře](#developer-notes)
* [Závěr](#conclusion)


## Přehled {#overview}

Tento průvodce poskytuje vývojářům krok za krokem instrukce pro nastavení [Listmonk](https://listmonk.app/), výkonného open-source správce newsletterů a mailing listů, pro použití [Forward Email](https://forwardemail.net/) jako jeho SMTP poskytovatele. Tato kombinace vám umožní efektivně spravovat kampaně a zároveň zajistit bezpečné, soukromé a spolehlivé doručování e-mailů.

* **Listmonk**: Spravuje odběratele, organizaci seznamů, tvorbu kampaní a sledování výkonu.
* **Forward Email**: Funguje jako bezpečný SMTP server, který zajišťuje skutečné odesílání e-mailů s vestavěnými bezpečnostními funkcemi jako SPF, DKIM, DMARC a TLS šifrování.

Integrací těchto dvou nástrojů si zachováte plnou kontrolu nad svými daty a infrastrukturou a zároveň využijete robustní doručovací systém Forward Email.


## Proč Listmonk a Forward Email {#why-listmonk-and-forward-email}

* **Open Source**: Listmonk i principy za Forward Email kladou důraz na transparentnost a kontrolu. Listmonk hostujete sami a vlastníte svá data.
* **Zaměření na soukromí**: Forward Email je postaven s důrazem na soukromí, minimalizuje uchovávání dat a zaměřuje se na bezpečný přenos.
* **Nákladová efektivita**: Listmonk je zdarma a Forward Email nabízí štědré bezplatné tarify a cenově dostupné placené plány, což z toho dělá řešení šetrné k rozpočtu.
* **Škálovatelnost**: Listmonk je vysoce výkonný a infrastruktura Forward Email je navržena pro spolehlivé doručování ve velkém měřítku.
* **Přátelské k vývojářům**: Listmonk nabízí robustní API a Forward Email poskytuje jednoduchou SMTP integraci a webhooky.


## Požadavky {#prerequisites}

Než začnete, ujistěte se, že máte následující:

* Virtuální privátní server (VPS) s aktuální linuxovou distribucí (doporučen Ubuntu 20.04+) s minimálně 1 CPU a 1GB RAM (doporučeno 2GB).
  * Potřebujete poskytovatele? Podívejte se na [doporučený seznam VPS](https://github.com/forwardemail/awesome-mail-server-providers).
* Doménové jméno, které vlastníte (vyžaduje přístup k DNS).
* Aktivní účet u [Forward Email](https://forwardemail.net/).
* Root nebo `sudo` přístup k vašemu VPS.
* Základní znalost práce s linuxovým příkazovým řádkem.


## Instalace {#installation}

Tyto kroky vás provedou instalací Listmonk pomocí Dockeru a Docker Compose na vašem VPS.

### 1. Aktualizujte svůj server {#1-update-your-server}

Ujistěte se, že seznam balíčků a nainstalované balíčky jsou aktuální.

```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Nainstalujte závislosti {#2-install-dependencies}

Nainstalujte Docker, Docker Compose a UFW (Uncomplicated Firewall).

```bash
sudo apt install -y docker.io docker-compose ufw
```

### 3. Stáhněte konfiguraci Listmonk {#3-download-listmonk-configuration}

Vytvořte adresář pro Listmonk a stáhněte oficiální soubor `docker-compose.yml`.

```bash
mkdir listmonk && cd listmonk
curl -Lo docker-compose.yml https://raw.githubusercontent.com/knadh/listmonk/master/docker-compose.yml
```

Tento soubor definuje kontejner aplikace Listmonk a jeho požadovaný kontejner databáze PostgreSQL.
### 4. Konfigurace firewallu (UFW) {#4-configure-firewall-ufw}

Povolte nezbytný provoz (SSH, HTTP, HTTPS) přes firewall. Pokud váš SSH běží na nestandardním portu, upravte to podle potřeby.

```bash
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
```

Potvrďte povolení firewallu, když budete vyzváni.

### 5. Konfigurace přístupu přes HTTPS {#5-configure-https-access}

Provoz Listmonk přes HTTPS je zásadní pro bezpečnost. Máte dvě hlavní možnosti:

#### Možnost A: Použití Cloudflare proxy (doporučeno pro jednoduchost) {#option-a-using-cloudflare-proxy-recommended-for-simplicity}

Pokud je DNS vaší domény spravováno Cloudflare, můžete využít jejich proxy funkci pro snadné HTTPS.

1. **Nasměrujte DNS**: Vytvořte v Cloudflare `A` záznam pro váš Listmonk subdoménu (např. `listmonk.vasedomena.com`), který bude směřovat na IP adresu vašeho VPS. Ujistěte se, že **Proxy status** je nastaven na **Proxied** (oranžová obloha).
2. **Upravte Docker Compose**: Editujte soubor `docker-compose.yml`, který jste stáhli:
   ```bash
   sed -i 's/9000:9000/80:9000/' docker-compose.yml
   ```
   Tím se Listmonk zpřístupní interně na portu 80, který Cloudflare může proxyovat a zabezpečit pomocí HTTPS.

#### Možnost B: Použití reverzní proxy (Nginx, Caddy, atd.) {#option-b-using-a-reverse-proxy-nginx-caddy-etc}

Alternativně můžete na svém VPS nastavit reverzní proxy jako Nginx nebo Caddy, která bude řešit ukončení HTTPS a proxy požadavky na Listmonk (který běží na portu 9000 ve výchozím nastavení).

* Zachovejte výchozí `ports: - "127.0.0.1:9000:9000"` v `docker-compose.yml`, aby byl Listmonk přístupný pouze lokálně.
* Nakonfigurujte zvolenou reverzní proxy, aby naslouchala na portech 80 a 443, řešila získání SSL certifikátu (např. přes Let's Encrypt) a přeposílala provoz na `http://127.0.0.1:9000`.
* Podrobná konfigurace reverzní proxy přesahuje rozsah tohoto návodu, ale online je k dispozici mnoho tutoriálů.

### 6. Spuštění Listmonk {#6-start-listmonk}

Přejděte zpět do adresáře `listmonk` (pokud tam ještě nejste) a spusťte kontejnery v odpojeném režimu.

```bash
cd ~/listmonk # Nebo do adresáře, kde jste uložili docker-compose.yml
docker compose up -d
```

Docker stáhne potřebné image a spustí kontejnery aplikace Listmonk a databáze. Poprvé to může trvat minutu nebo dvě.

✅ **Přístup k Listmonk**: Nyní byste měli mít přístup k webovému rozhraní Listmonk přes doménu, kterou jste nastavili (např. `https://listmonk.vasedomena.com`).

### 7. Konfigurace Forward Email SMTP v Listmonk {#7-configure-forward-email-smtp-in-listmonk}

Dále nastavte Listmonk tak, aby odesílal e-maily pomocí vašeho účtu Forward Email.

1. **Povolení SMTP ve Forward Email**: Ujistěte se, že jste v dashboardu Forward Email vygenerovali SMTP přihlašovací údaje. Pokud ne, postupujte podle [návodu Forward Email pro odesílání e-mailů s vlastní doménou přes SMTP](https://forwardemail.net/en/guides/send-email-with-custom-domain-smtp).
2. **Konfigurace Listmonk**: Přihlaste se do administrace Listmonk.
   * Přejděte do **Nastavení -> SMTP**.

   * Listmonk má vestavěnou podporu pro Forward Email. Vyberte **ForwardEmail** ze seznamu poskytovatelů, nebo zadejte ručně následující údaje:

     | Nastavení        | Hodnota                                                                                                            |
     | :---------------- | :----------------------------------------------------------------------------------------------------------------- |
     | **Hostitel**      | `smtp.forwardemail.net`                                                                                            |
     | **Port**          | `465`                                                                                                              |
     | **Autentizační protokol** | `LOGIN`                                                                                                      |
     | **Uživatelské jméno** | Vaše Forward Email **SMTP uživatelské jméno**                                                                   |
     | **Heslo**         | Vaše Forward Email **SMTP heslo**                                                                                  |
     | **TLS**           | `SSL/TLS`                                                                                                          |
     | **Odesílatel (From e-mail)** | Vámi požadovaná adresa odesílatele (např. `newsletter@vasedomena.com`). Ujistěte se, že tato doména je nakonfigurována ve Forward Email. |
* **Důležité**: Vždy používejte port `465` s `SSL/TLS` pro zabezpečená připojení s Forward Email (doporučeno). Port `587` s STARTTLS je také podporován, ale SSL/TLS je preferováno.

   * Klikněte na **Uložit**.
3. **Odeslat testovací e-mail**: Použijte tlačítko "Odeslat testovací e-mail" na stránce nastavení SMTP. Zadejte adresu příjemce, ke které máte přístup, a klikněte na **Odeslat**. Ověřte, že e-mail dorazí do schránky příjemce.

### 8. Konfigurace zpracování nedoručených zpráv {#8-configure-bounce-processing}

Zpracování nedoručených zpráv umožňuje Listmonku automaticky řešit e-maily, které nebyly doručeny (např. kvůli neplatným adresám). Forward Email poskytuje webhook pro oznámení Listmonku o nedoručených zprávách.

#### Nastavení Forward Email {#forward-email-setup}

1. Přihlaste se do svého [Forward Email Dashboard](https://forwardemail.net/).
2. Přejděte do **Domény**, vyberte doménu, kterou používáte pro odesílání, a otevřete její stránku **Nastavení**.
3. Sjeďte dolů do sekce **Bounce Webhook URL**.
4. Zadejte následující URL, přičemž `<your_listmonk_domain>` nahraďte skutečnou doménou nebo subdoménou, kde je vaše instance Listmonk dostupná:
   ```sh
   https://<your_listmonk_domain>/webhooks/service/forwardemail
   ```
   *Příklad*: `https://listmonk.yourdomain.com/webhooks/service/forwardemail`
5. Pokračujte dále dolů do sekce **Webhook Signature Payload Verification Key**.
6. **Zkopírujte** vygenerovaný ověřovací klíč. Budete ho potřebovat v Listmonku.
7. Uložte změny v nastavení domény ve Forward Email.

#### Nastavení Listmonk {#listmonk-setup}

1. V administraci Listmonku přejděte do **Nastavení -> Nedoručené zprávy (Bounces)**.
2. Povolit **Povolit zpracování nedoručených zpráv**.
3. Povolit **Povolit webhooky pro nedoručené zprávy**.
4. Sjeďte dolů do sekce **Poskytovatelé webhooků**.
5. Povolit **Forward Email**.
6. Vložte **Webhook Signature Payload Verification Key**, který jste zkopírovali z Forward Email dashboardu, do pole **Forward Email Key**.
7. Klikněte na **Uložit** ve spodní části stránky.
8. Zpracování nedoručených zpráv je nyní nakonfigurováno! Když Forward Email zjistí nedoručenou zprávu pro e-mail odeslaný Listmonkem, oznámí to vaší instanci Listmonk přes webhook a Listmonk označí odběratele odpovídajícím způsobem.
9. Dokončete níže uvedené kroky v [Testování](#testing), abyste ověřili, že vše funguje správně.


## Testování {#testing}

Zde je rychlý přehled základních funkcí Listmonku:

### Vytvoření mailing listu {#create-a-mailing-list}

* Přejděte do **Seznamy** v postranním panelu.
* Klikněte na **Nový seznam**.
* Vyplňte údaje (Název, Typ: Veřejný/Soukromý, Popis, Štítky) a **Uložit**.

### Přidání odběratelů {#add-subscribers}

* Přejděte do sekce **Odběratelé**.
* Odběratele můžete přidat:
  * **Ručním zadáním**: Klikněte na **Nový odběratel**.
  * **Importem**: Klikněte na **Importovat odběratele** pro nahrání CSV souboru.
  * **API**: Použijte Listmonk API pro programové přidávání.
* Při vytváření nebo importu přiřaďte odběratele k jednomu nebo více seznamům.
* **Doporučený postup**: Používejte proces double opt-in. Nastavíte ho v **Nastavení -> Opt-in & Předplatné**.

### Vytvoření a odeslání kampaně {#create-and-send-a-campaign}

* Přejděte do **Kampaně** -> **Nová kampaň**.
* Vyplňte údaje kampaně (Název, Předmět, Odesílatel, Seznam(y), na které se má odeslat).
* Vyberte typ obsahu (Rich Text/HTML, Prostý text, Raw HTML).
* Sestavte obsah e-mailu. Můžete použít šablonové proměnné jako `{{ .Subscriber.Email }}` nebo `{{ .Subscriber.FirstName }}`.
* **Vždy nejprve odešlete testovací e-mail!** Použijte možnost "Odeslat test" pro náhled e-mailu ve vaší schránce.
* Jakmile jste spokojeni, klikněte na **Spustit kampaň** pro okamžité odeslání nebo ji naplánujte na později.


## Ověření {#verification}

* **SMTP doručení**: Pravidelně odesílejte testovací e-maily přes stránku nastavení SMTP v Listmonku a testovací kampaně, abyste zajistili správné doručení e-mailů.
* **Zpracování nedoručených zpráv**: Odešlete testovací kampaň na známou neplatnou e-mailovou adresu (např. `bounce-test@yourdomain.com`, pokud nemáte skutečnou, výsledky se mohou lišit). Po krátké době zkontrolujte statistiky kampaně v Listmonku, zda je nedoručená zpráva zaznamenána.
* **Hlavičky e-mailů**: Použijte nástroje jako [Mail-Tester](https://www.mail-tester.com/) nebo ručně zkontrolujte hlavičky e-mailů, zda SPF, DKIM a DMARC procházejí, což indikuje správné nastavení přes Forward Email.
* **Logy Forward Email**: Pokud máte podezření na problémy s doručením vycházející ze SMTP serveru, zkontrolujte logy ve vašem Forward Email dashboardu.
## Vývojářské poznámky {#developer-notes}

* **Šablonování**: Listmonk používá Go templating engine. Pro pokročilou personalizaci prozkoumejte jeho dokumentaci: `{{ .Subscriber.Attribs.your_custom_field }}`.
* **API**: Listmonk poskytuje komplexní REST API pro správu seznamů, odběratelů, kampaní, šablon a dalšího. Odkaz na dokumentaci API najdete v patičce vaší instance Listmonk.
* **Vlastní pole**: Definujte vlastní pole odběratelů v **Nastavení -> Pole odběratelů** pro ukládání dalších dat.
* **Webhooks**: Kromě bounce zpráv může Listmonk odesílat webhooks i pro jiné události (např. přihlášení), což umožňuje integraci s dalšími systémy.


## Závěr {#conclusion}

Integrací self-hosted síly Listmonk s bezpečným a soukromí respektujícím doručováním Forward Email vytvoříte robustní a etickou platformu pro e-mailový marketing. Plně si zachováte vlastnictví dat o svém publiku a zároveň využijete vysokou doručitelnost a automatizované bezpečnostní funkce.

Toto řešení nabízí škálovatelnou, nákladově efektivní a vývojářsky přívětivou alternativu k proprietárním e-mailovým službám, která dokonale ladí s filosofií open-source softwaru a ochranou uživatelského soukromí.

Přejeme šťastné odesílání! 🚀
