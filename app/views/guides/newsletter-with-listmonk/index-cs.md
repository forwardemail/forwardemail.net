# Listmonk s přesměrováním e-mailů pro bezpečné doručování newsletterů {#listmonk-with-forward-email-for-secure-newsletter-delivery}

## Obsah {#table-of-contents}

* [Přehled](#overview)
* [Proč Listmonk a přeposílání e-mailů](#why-listmonk-and-forward-email)
* [Předpoklady](#prerequisites)
* [Instalace](#installation)
  * [1. Aktualizujte svůj server](#1-update-your-server)
  * [2. Instalace závislostí](#2-install-dependencies)
  * [3. Stáhněte si konfiguraci Listmonku](#3-download-listmonk-configuration)
  * [4. Konfigurace firewallu (UFW)](#4-configure-firewall-ufw)
  * [5. Konfigurace přístupu HTTPS](#5-configure-https-access)
  * [6. Spusťte Listmonk](#6-start-listmonk)
  * [7. Konfigurace SMTP pro přeposílání e-mailů v Listmonku](#7-configure-forward-email-smtp-in-listmonk)
  * [8. Konfigurace zpracování odražených zpráv](#8-configure-bounce-processing)
* [Testování](#testing)
  * [Vytvořte si seznam adresátů](#create-a-mailing-list)
  * [Přidat odběratele](#add-subscribers)
  * [Vytvořit a odeslat kampaň](#create-and-send-a-campaign)
* [Ověření](#verification)
* [Poznámky pro vývojáře](#developer-notes)
* [Závěr](#conclusion)

## Přehled {#overview}

Tato příručka poskytuje vývojářům podrobné pokyny pro nastavení [Listmonk](https://listmonk.app/), výkonného open-source správce newsletterů a mailing listů, pro použití [Přeposlat e-mail](https://forwardemail.net/) jako poskytovatele SMTP. Tato kombinace vám umožňuje efektivně spravovat vaše kampaně a zároveň zajistit bezpečné, soukromé a spolehlivé doručování e-mailů.

* **Listmonk**: Zajišťuje správu odběratelů, organizaci seznamů, vytváření kampaní a sledování výkonu.
* **Přeposílání e-mailů**: Funguje jako zabezpečený SMTP server a zajišťuje samotné odesílání e-mailů s vestavěnými bezpečnostními funkcemi, jako je SPF, DKIM, DMARC a šifrování TLS.

Integrací těchto dvou služeb si zachováte plnou kontrolu nad svými daty a infrastrukturou a zároveň využijete robustní systém doručování Forward Email.

## Proč Listmonk a přeposílání e-mailů {#why-listmonk-and-forward-email}

* **Open Source**: Listmonk i principy Forward Email kladou důraz na transparentnost a kontrolu. Listmonk hostujete sami a vlastníte svá data.
* **Zaměřeno na soukromí**: Forward Email je postaven s ohledem na soukromí, minimalizuje uchovávání dat a zaměřuje se na bezpečný přenos.
* **Cenovo výhodné**: Listmonk je zdarma a Forward Email nabízí štědré bezplatné úrovně a cenově dostupné placené tarify, což z něj činí cenově dostupné řešení.
* **Škálovatelnost**: Listmonk je vysoce výkonný a infrastruktura Forward Email je navržena pro spolehlivé doručování ve velkém měřítku.
* **Přátelské k vývojářům**: Listmonk nabízí robustní API a Forward Email poskytuje přímočarou integraci SMTP a webhooky.

## Předpoklady {#prerequisites}

Než začnete, ujistěte se, že máte následující:

* Virtuální privátní server (VPS) s aktuální distribucí Linuxu (doporučeno Ubuntu 20.04+) s alespoň 1 CPU a 1 GB RAM (doporučeno 2 GB).
* Potřebujete poskytovatele? Podívejte se na [seznam doporučených VPS](https://github.com/forwardemail/awesome-mail-server-providers).
* Název domény, kterou spravujete (vyžadován přístup k DNS).
* Aktivní účet s [Přeposlat e-mail](https://forwardemail.net/).
* Přístup root nebo `sudo` k vašemu VPS.
* Základní znalost operací příkazového řádku Linuxu.

## Instalace {#installation}

Tyto kroky vás provedou instalací Listmonku pomocí Dockeru a Docker Compose na vašem VPS.

### 1. Aktualizujte svůj server {#1-update-your-server}

Ujistěte se, že seznam balíčků ve vašem systému a nainstalované balíčky jsou aktuální.

```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Instalace závislostí {#2-install-dependencies}

Nainstalujte Docker, Docker Compose a UFW (nekomplikovaný firewall).

```bash
sudo apt install -y docker.io docker-compose ufw
```

### 3. Stáhnout konfiguraci Listmonku {#3-download-listmonk-configuration}

Vytvořte adresář pro Listmonk a stáhněte si oficiální soubor `docker-compose.yml`.

```bash
mkdir listmonk && cd listmonk
curl -Lo docker-compose.yml https://raw.githubusercontent.com/knadh/listmonk/master/docker-compose.yml
```

Tento soubor definuje kontejner aplikace Listmonk a jeho požadovaný kontejner databáze PostgreSQL.

### 4. Konfigurace firewallu (UFW) {#4-configure-firewall-ufw}

Povolte nezbytný provoz (SSH, HTTP, HTTPS) přes firewall. Pokud váš SSH běží na nestandardním portu, upravte nastavení.

```bash
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
```

Po zobrazení výzvy potvrďte povolení brány firewall.

### 5. Konfigurace přístupu HTTPS {#5-configure-https-access}

Spuštění Listmonku přes HTTPS je pro bezpečnost zásadní. Máte dvě hlavní možnosti:

#### Možnost A: Použití proxy Cloudflare (doporučeno pro zjednodušení) {#option-a-using-cloudflare-proxy-recommended-for-simplicity}

Pokud DNS vaší domény spravuje Cloudflare, můžete pro snadné HTTPS využít jejich funkci proxy.

1. **DNS bodu**: Vytvořte v Cloudflare záznam `A` pro vaši subdoménu Listmonk (např. `listmonk.yourdomain.com`) odkazující na IP adresu vašeho VPS. Ujistěte se, že je **Stav proxy** nastaven na **Proxyed** (oranžový obláček).
2. **Upravit Docker Compose**: Upravte stažený soubor `docker-compose.yml`:
```bash
   sed -i 's/9000:9000/80:9000/' docker-compose.yml
   ```
Tím se Listmonk interně zpřístupní na portu 80, který pak Cloudflare může proxyovat a zabezpečit pomocí HTTPS.

#### Možnost B: Použití reverzní proxy (Nginx, Caddy atd.) {#option-b-using-a-reverse-proxy-nginx-caddy-etc}

Alternativně si můžete na svém VPS nastavit reverzní proxy, jako je Nginx nebo Caddy, pro zpracování HTTPS ukončení a proxy požadavků na Listmonk (ve výchozím nastavení běží na portu 9000).

* Ponechte výchozí hodnotu `ports: - "127.0.0.1:9000:9000"` v `docker-compose.yml`, aby byl Listmonk přístupný pouze lokálně.
* Nakonfigurujte zvolenou reverzní proxy tak, aby naslouchala na portech 80 a 443, zpracovávala získávání SSL certifikátů (např. přes Let's Encrypt) a přesměrovávala provoz na `http://127.0.0.1:9000`.
* Podrobné nastavení reverzní proxy přesahuje rámec této příručky, ale mnoho tutoriálů je k dispozici online.

### 6. Spusťte Listmonk {#6-start-listmonk}

Vraťte se do adresáře `listmonk` (pokud tam ještě nejste) a spusťte kontejnery v odpojeném režimu.

```bash
cd ~/listmonk # Or the directory where you saved docker-compose.yml
docker compose up -d
```

Docker stáhne potřebné obrazy a spustí aplikaci Listmonk a databázové kontejnery. Poprvé to může trvat minutu nebo dvě.

✅ **Přístup k Listmonku**: Nyní byste měli mít přístup k webovému rozhraní Listmonku prostřednictvím domény, kterou jste nakonfigurovali (např. `https://listmonk.yourdomain.com`).

### 7. Konfigurace SMTP pro přeposílání e-mailů v Listmonku {#7-configure-forward-email-smtp-in-listmonk}

Dále nakonfigurujte Listmonk tak, aby odesílal e-maily pomocí vašeho účtu Forward Email.

1. **Povolte SMTP v přeposílání e-mailů**: Ujistěte se, že jste si vygenerovali přihlašovací údaje SMTP v řídicím panelu účtu pro přeposílání e-mailů. Pokud jste tak ještě neučinili, postupujte podle pokynů [Průvodce přesměrováním e-mailů pro odesílání e-mailů s vlastní doménou přes SMTP](https://forwardemail.net/en/guides/send-email-with-custom-domain-smtp).
2. **Konfigurace Listmonk**: Přihlaste se do administrátorského panelu Listmonk.
* Přejděte do sekce **Nastavení -> SMTP**.

* Listmonk má vestavěnou podporu pro přeposílání e-mailů. Vyberte **ForwardEmail** ze seznamu poskytovatelů nebo ručně zadejte následující údaje:

| Prostředí | Hodnota |
| :---------------- | :------------------------------------------------------------------------------------------------------------------ |
| **Hostitel** | `smtp.forwardemail.net` |
| **Přístav** | `465` |
| **Autentizační protokol** | `LOGIN` |
| **Uživatelské jméno** | Váš e-mail pro přesměrování **Uživatelské jméno SMTP** |
| **Heslo** | Váš e-mail pro přesměrování **Heslo SMTP** |
| **TLS** | `SSL/TLS` |
| **Z e-mailu** | Vaše požadovaná adresa `From` (např. `newsletter@yourdomain.com`). Ujistěte se, že je tato doména nakonfigurována v části Přeposílání e-mailů. |

* **Důležité**: Pro zabezpečené připojení s přeposíláním e-mailů vždy používejte port `465` s portem `SSL/TLS`. Nepoužívejte STARTTLS (port 587).

* Klikněte na **Uložit**.
3. **Odeslat zkušební e-mail**: Použijte tlačítko „Odeslat zkušební e-mail“ na stránce nastavení SMTP. Zadejte adresu příjemce, ke které máte přístup, a klikněte na **Odeslat**. Ověřte, zda e-mail dorazil do schránky příjemce.

### 8. Konfigurace zpracování odeslaných zpráv {#8-configure-bounce-processing}

Zpracování nedoručených e-mailů umožňuje Listmonku automaticky zpracovat e-maily, které nemohly být doručeny (např. kvůli neplatným adresám). Funkce Forward Email poskytuje webhook, který Listmonk upozorní na nedoručené e-maily.

#### Nastavení přeposílání e-mailů {#forward-email-setup}

1. Přihlaste se do své [Panel pro přeposílání e-mailů](https://forwardemail.net/).
2. Přejděte do sekce **Domény**, vyberte doménu, kterou používáte pro odesílání, a přejděte na její stránku **Nastavení**.
3. Přejděte dolů do sekce **URL adresy webhooku pro odesílání**.
4. Zadejte následující URL adresu a nahraďte `<your_listmonk_domain>` skutečnou doménou nebo subdoménou, kde je vaše instance Listmonk dostupná:
```sh
   https://<your_listmonk_domain>/webhooks/service/forwardemail
   ```
*Příklad*: `https://listmonk.yourdomain.com/webhooks/service/forwardemail`
5. Přejděte dále dolů do sekce **Klíč pro ověření datové zátěže podpisu webhooku**.
6. **Zkopírujte** vygenerovaný ověřovací klíč. Budete ho potřebovat v Listmonku.
7. Uložte změny v nastavení domény pro přeposílání e-mailů.

#### Nastavení Listmonku {#listmonk-setup}

1. V administrátorském panelu Listmonk přejděte do **Nastavení -> Odmítnutí**.

2. Povolte **Povolit zpracování odmítnutí**.

3. Povolte **Povolit webhooky pro odmítnutí**.

4. Přejděte dolů do sekce **Poskytovatelé webhooků**.

5. Povolte **Přeposílání e-mailů**.

6. Vložte **Klíč pro ověření datové zátěže podpisu webhooku**, který jste zkopírovali z panelu Přeposílání e-mailů, do pole **Klíč pro přeposílání e-mailů**.

7. Klikněte na **Uložit** v dolní části stránky.

8. Zpracování odmítnutí je nyní nakonfigurováno! Když Přeposílání e-mailů zjistí odmítnutí e-mailu odeslaného službou Listmonk, upozorní vaši instanci Listmonk prostřednictvím webhooku a Listmonk odběratele odpovídajícím způsobem označí.

9. Dokončete níže uvedené kroky v [Testování](#testing), abyste se ujistili, že vše funguje.

## Testování {#testing}

Zde je rychlý přehled základních funkcí Listmonku:

### Vytvořit seznam adresátů {#create-a-mailing-list}

* V postranním panelu přejděte na **Seznamy**.
* Klikněte na **Nový seznam**.
* Vyplňte údaje (Název, Typ: Veřejný/Soukromý, Popis, Štítky) a **Uložit**.

### Přidat odběratele {#add-subscribers}

* Přejděte do sekce **Odběratelé**.
* Odběratele můžete přidat:
* **Ručně**: Klikněte na **Nový odběratel**.
* **Import**: Kliknutím na **Importovat odběratele** nahrajete soubor CSV.
* **API**: Pro programatické přidávání použijte rozhraní Listmonk API.
* Přiřaďte odběratele k jednomu nebo více seznamům během vytváření nebo importu.
* **Doporučený postup**: Použijte proces dvojitého přihlášení. Nastavte jej v části **Nastavení -> Přihlášení a odběry**.

### Vytvořit a odeslat kampaň {#create-and-send-a-campaign}

* Přejděte do **Kampaně** -> **Nová kampaň**.
* Vyplňte podrobnosti kampaně (Název, Předmět, E-mail odesílatele, Seznam(y) k odeslání).
* Vyberte typ obsahu (Rich Text/HTML, Prostý text, Neupravený HTML).
* Vytvořte obsah e-mailu. Můžete použít proměnné šablony, jako je `{{ .Subscriber.Email }}` nebo `{{ .Subscriber.FirstName }}`.
* **Vždy nejprve odešlete testovací e-mail!** Pomocí možnosti „Odeslat testovací“ si můžete zobrazit náhled e-mailu ve vaší schránce.
* Jakmile budete spokojeni, klikněte na **Spustit kampaň** a odešlete ji okamžitě nebo naplánujte na později.

## Ověření {#verification}

* **Doručování SMTP**: Pravidelně odesílejte testovací e-maily prostřednictvím stránky nastavení SMTP v Listmonku a testujte kampaně, abyste zajistili správné doručení e-mailů.
* **Ošetření nedoručených e-mailů**: Odešlete testovací kampaň na známou neplatnou e-mailovou adresu (např. `bounce-test@yourdomain.com`, pokud nemáte po ruce skutečnou, výsledky se však mohou lišit). Po krátké době zkontrolujte statistiky kampaně v Listmonku, abyste zjistili, zda je nedoručení zaznamenáno.
* **Záhlaví e-mailů**: Použijte nástroje jako [Tester pošty](https://www.mail-tester.com/) nebo ručně zkontrolujte záhlaví e-mailů, abyste ověřili, zda SPF, DKIM a DMARC procházejí, což naznačuje správné nastavení přesměrování e-mailů.
* **Protokoly přesměrování e-mailů**: Pokud máte podezření na problémy s doručováním pocházející ze serveru SMTP, zkontrolujte protokoly přesměrování e-mailů na řídicím panelu.

## Poznámky pro vývojáře {#developer-notes}

* **Šablony**: Listmonk používá šablonovací engine Go. Pro pokročilé možnosti personalizace si prohlédněte dokumentaci k němu: `{{ .Subscriber.Attribs.your_custom_field }}`.
* **API**: Listmonk poskytuje komplexní REST API pro správu seznamů, odběratelů, kampaní, šablon a dalších funkcí. Odkaz na dokumentaci k API najdete v patičce vaší instance Listmonk.
* **Vlastní pole**: Definujte vlastní pole pro odběratele v části **Nastavení -> Pole pro odběratele** pro ukládání dalších dat.
* **Webhooky**: Kromě nedoručených zpráv může Listmonk odesílat webhooky i pro jiné události (např. odběry), což umožňuje integraci s jinými systémy.

## Závěr {#conclusion}

Integrací samohostovaného serveru Listmonk s bezpečným a soukromí respektujícím doručováním Forward Email vytvoříte robustní a etickou platformu pro e-mailový marketing. Zachováváte si plné vlastnictví dat o svém publiku a zároveň těžíte z vysoké doručitelnosti a automatizovaných bezpečnostních funkcí.

Toto nastavení poskytuje škálovatelnou, cenově efektivní a pro vývojáře přátelskou alternativu k proprietárním e-mailovým službám, což je dokonale v souladu s étosem open source softwaru a ochrany soukromí uživatelů.

Šťastné odesílání! 🚀