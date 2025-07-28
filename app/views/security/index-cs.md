# Bezpečnostní postupy {#security-practices}

<img loading="lazy" src="/img/articles/security.webp" alt="" class="rounded-lg" />

__CHRÁNĚNÁ_URL_6__ Obsah {__CHRÁNĚNÁ_URL_7__

* [Předmluva](#foreword)
* [Zabezpečení infrastruktury](#infrastructure-security)
  * [Zabezpečená datová centra](#secure-data-centers)
  * [Zabezpečení sítě](#network-security)
* [Zabezpečení e-mailu](#email-security)
  * [Šifrování](#encryption)
  * [Autentizace a autorizace](#authentication-and-authorization)
  * [Opatření proti zneužívání](#anti-abuse-measures)
* [Ochrana dat](#data-protection)
  * [Minimalizace dat](#data-minimization)
  * [Zálohování a obnova](#backup-and-recovery)
* [Poskytovatelé služeb](#service-providers)
* [Compliance a audit](#compliance-and-auditing)
  * [Pravidelná bezpečnostní hodnocení](#regular-security-assessments)
  * [Dodržování](#compliance)
* [Odezva na incident](#incident-response)
* [Životní cyklus vývoje zabezpečení](#security-development-lifecycle)
* [Hardening serveru](#server-hardening)
* [Smlouva o úrovni služeb](#service-level-agreement)
* [Zabezpečení otevřeného zdroje](#open-source-security)
* [Zabezpečení zaměstnanců](#employee-security)
* [Neustálé zlepšování](#continuous-improvement)
* [Další zdroje](#additional-resources)

__CHRÁNĚNÁ_URL_8__ Předmluva {__CHRÁNĚNÁ_URL_9__

Ve společnosti Forward Email je bezpečnost naší nejvyšší prioritou. Zavedli jsme komplexní bezpečnostní opatření na ochranu vaší e-mailové komunikace a osobních údajů. Tento dokument popisuje naše bezpečnostní postupy a kroky, které podnikáme, abychom zajistili důvěrnost, integritu a dostupnost vašeho e-mailu.

## Zabezpečení infrastruktury {#infrastructure-security}

### Bezpečná datová centra {#secure-data-centers}

Naše infrastruktura je hostována v datových centrech vyhovujících SOC 2 s:

* Fyzická ostraha a dohled 24 hodin denně, 7 dní v týdnu
* Biometrické kontroly přístupu
* Redundantní napájecí systémy
* Pokročilá detekce a potlačení požáru
* Monitorování prostředí

__CHRÁNĚNÁ_URL_14__ Zabezpečení sítě {__CHRÁNĚNÁ_URL_15__

Implementujeme několik vrstev zabezpečení sítě:

* Firewally podnikové úrovně s přísnými seznamy kontroly přístupu
* Ochrana a zmírňování DDoS útoků
* Pravidelné skenování zranitelností sítě
* Systémy pro detekci a prevenci narušení
* Šifrování provozu mezi všemi koncovými body služby
* Ochrana skenováním portů s automatickým blokováním podezřelé aktivity

> \[!IMPORTANT]
> All data in transit is encrypted using TLS 1.2+ with modern cipher suites.

## Zabezpečení e-mailu {#email-security}

__CHRÁNĚNÁ_URL_18__ Šifrování {__CHRÁNĚNÁ_URL_19__

* **Transport Layer Security (TLS)**: Veškerý e-mailový provoz je šifrován během přenosu pomocí TLS 1.2 nebo vyššího
* **End-to-End Encryption**: Podpora standardů OpenPGP/MIME a S/MIME
* **Storage Encryption**: Všechny uložené e-maily jsou v klidovém stavu šifrovány pomocí šifrování ChaCha20-Poly1305 v souborech SQLite
* **Full Disk Encryption**: Šifrování LUKS v2 pro celý disk
* **Komplexní ochrana**: Implementujeme šifrování v klidovém stavu, šifrování v paměti a šifrování během přenosu

> \[!NOTE]
> We're the world's first and only email service to use **[quantum-resistant and individually encrypted SQLite mailboxes](https://forwardemail.net/en/blog/docs/best-quantum-safe-encrypted-email-service)**.

### Ověřování a autorizace {#authentication-and-authorization}

* **Podepisování DKIM**: Všechny odchozí e-maily jsou podepsány pomocí DKIM
* **SPF a DMARC**: Plná podpora SPF a DMARC pro prevenci falšování e-mailů
* **MTA-STS**: Podpora MTA-STS pro vynucení šifrování TLS
* **Multi-Factor Authentication**: Dostupné pro všechny přístupy k účtům

### Opatření proti zneužívání {#anti-abuse-measures}

* **Filtrování spamu**: Vícevrstvá detekce spamu pomocí strojového učení
* **Skenování virů**: Skenování všech příloh v reálném čase
* **Omezení rychlosti**: Ochrana před útoky hrubou silou a enumerací
* **Reputace IP adres**: Monitorování reputace odesílající IP adresy
* **Filtrování obsahu**: Detekce škodlivých URL adres a phishingových pokusů

## Ochrana osobních údajů {#data-protection}

### Minimalizace dat {#data-minimization}

Řídíme se zásadou minimalizace dat:

* Shromažďujeme pouze data nezbytná k poskytování našich služeb.
* Obsah e-mailů je zpracováván v paměti a není trvale ukládán, pokud není vyžadován pro doručování přes IMAP/POP3.
* Protokoly jsou anonymizovány a uchovávány pouze po nezbytně dlouhou dobu.

### Zálohování a obnova {#backup-and-recovery}

* Automatizované denní zálohy se šifrováním
* Geograficky distribuované úložiště záloh
* Pravidelné testování obnovy záloh
* Postupy obnovy po havárii s definovanými RPO a RTO

## Poskytovatelé služeb {#service-providers}

Pečlivě vybíráme naše poskytovatele služeb, abychom zajistili, že splňují naše vysoké bezpečnostní standardy. Níže jsou uvedeni poskytovatelé, které používáme pro mezinárodní přenos dat, a jejich stav souladu s GDPR:

| Poskytovatel | Účel | Certifikace DPF | Stránka souladu s GDPR |
| --------------------------------------------- | ------------------------- | ------------- | ----------------------------------------------------------------- |
| [Cloudflare](https://www.cloudflare.com) | CDN, ochrana DDoS, DNS | ✅ Ano | [Cloudflare GDPR](https://www.cloudflare.com/trust-hub/gdpr/) |
| [DataPacket](https://www.datapacket.com) | Serverová infrastruktura | ❌ Ne | [DataPacket Privacy](https://www.datapacket.com/privacy-policy) |
| [Digital Ocean](https://www.digitalocean.com) | Cloudová infrastruktura | ❌ Ne | [DigitalOcean GDPR](https://www.digitalocean.com/legal/gdpr) |
| [Vultr](https://www.vultr.com) | Cloudová infrastruktura | ❌ Ne | [Vultr GDPR](https://www.vultr.com/legal/eea-gdpr-privacy/) |
| [Stripe](https://stripe.com) | Zpracování plateb | ✅ Ano | [Stripe Privacy Center](https://stripe.com/legal/privacy-center) |
| [PayPal](https://www.paypal.com) | Zpracování plateb | ❌ Ne | [PayPal Privacy](https://www.paypal.com/uk/legalhub/privacy-full) |

Tyto poskytovatele využíváme k zajištění spolehlivého a bezpečného poskytování služeb při zachování souladu s mezinárodními předpisy na ochranu údajů. Všechny přenosy dat jsou prováděny s příslušnými bezpečnostními opatřeními na ochranu vašich osobních údajů.

## Dodržování předpisů a audit {#compliance-and-auditing}

### Pravidelná bezpečnostní hodnocení {#regular-security-assessments}

Náš tým pravidelně monitoruje, kontroluje a hodnotí kódovou základnu, servery, infrastrukturu a postupy. Zavádíme komplexní bezpečnostní program, který zahrnuje:

* Pravidelná rotace SSH klíčů
* Průběžné sledování přístupových protokolů
* Automatizované bezpečnostní skenování
* Proaktivní správa zranitelností
* Pravidelné bezpečnostní školení pro všechny členy týmu

### Soulad s předpisy {#compliance}

* [GDPR](https://forwardemail.net/gdpr) postupy nakládání s daty v souladu s [Smlouva o zpracování dat (DPA)](https://forwardemail.net/dpa)
* __PROTECTED_LINK_78__ k dispozici pro firemní zákazníky
* Kontroly ochrany osobních údajů v souladu s CCPA
* Auditované procesy SOC 2 typu II

## Reakce na incident {#incident-response}

Náš plán reakce na bezpečnostní incidenty zahrnuje:

1. **Detekce**: Automatizované monitorovací a varovné systémy
2. **Zadržení**: Okamžitá izolace postižených systémů
3. **Eradikace**: Odstranění hrozby a analýza hlavní příčiny
4. **Obnova**: Bezpečné obnovení služeb
5. **Oznámení**: Včasná komunikace s postiženými uživateli
6. **Analýza po incidentu**: Komplexní kontrola a vylepšení

> \[!WARNING]
> If you discover a security vulnerability, please report it immediately to <security@forwardemail.net>.

## Životní cyklus vývoje zabezpečení {#security-development-lifecycle}

```mermaid
flowchart LR
    A[Requirements] --> B[Design]
    B --> C[Implementation]
    C --> D[Verification]
    D --> E[Release]
    E --> F[Maintenance]
    F --> A
    B -.-> G[Threat Modeling]
    C -.-> H[Static Analysis]
    D -.-> I[Security Testing]
    E -.-> J[Final Security Review]
    F -.-> K[Vulnerability Management]
```

Veškerý kód prochází:

* Shromažďování bezpečnostních požadavků
* Modelování hrozeb během návrhu
* Bezpečné postupy kódování
* Statické a dynamické testování bezpečnosti aplikací
* Kontrola kódu se zaměřením na bezpečnost
* Skenování zranitelností závislostí

## Zajištění serveru {#server-hardening}

Naše [Možnost konfigurace](https://github.com/forwardemail/forwardemail.net/tree/master/ansible) implementuje řadu opatření na posílení zabezpečení serveru:

* **Přístup k USB zakázán**: Fyzické porty jsou zakázány zařazením modulu jádra usb-storage na černou listinu
* **Pravidla firewallu**: Přísná pravidla iptables povolující pouze nezbytná připojení
* **SSH Hardening**: Pouze ověřování založené na klíči, bez přihlášení heslem, přihlášení root zakázáno
* **Izolace služeb**: Každá služba běží s minimálními požadovanými oprávněními
* **Automatické aktualizace**: Bezpečnostní záplaty jsou aplikovány automaticky
* **Bezpečné spouštění**: Ověřený proces spouštění, aby se zabránilo neoprávněné manipulaci
* **Kernel Hardening**: Zabezpečené parametry jádra a konfigurace sysctl
* **Omezení souborového systému**: možnosti připojení noexec, nosuid a nodev, kde je to vhodné
* **Výpisy jádra zakázány**: Systém nakonfigurován tak, aby z bezpečnostních důvodů zabránil výpisům jádra
* **Swap zakázán**: Výměna paměti zakázána, aby se zabránilo úniku dat
* **Ochrana skenování portů**: Automatická detekce a blokování pokusů o skenování portů
* **Transparent Huge Pages zakázáno**: THP zakázáno pro lepší výkon a zabezpečení
* **System Service Hardening**: Nepodstatné služby, jako je Apport, zakázány
* **Správa uživatelů**: Princip nejnižších oprávnění s oddělenými uživateli pro nasazení a devops
* **Limity deskriptorů souborů**: Zvýšené limity pro lepší výkon a zabezpečení

## Smlouva o úrovni služeb {#service-level-agreement}

Udržujeme vysokou úroveň dostupnosti a spolehlivosti služeb. Naše infrastruktura je navržena s ohledem na redundanci a odolnost proti chybám, aby bylo zajištěno, že vaše e-mailová služba zůstane funkční. I když nezveřejňujeme formální dokument SLA, zavazujeme se:

* 99,9%+ dostupnost všech služeb
* Rychlá reakce na výpadky služeb
* Transparentní komunikace během incidentů
* Pravidelná údržba během období s nízkým provozem

## Zabezpečení s otevřeným zdrojovým kódem {#open-source-security}

Jako [open-source služba](https://github.com/forwardemail/forwardemail.net) naše zabezpečení těží z:

* Transparentní kód, který může auditovat kdokoli
* Vylepšení zabezpečení řízená komunitou
* Rychlá identifikace a oprava zranitelností
* Žádné zabezpečení kvůli neznámu

## Bezpečnost zaměstnanců {#employee-security}

* Prověrky všech zaměstnanců
* Bezpečnostní školení
* Princip nejnižších oprávnění přístupu
* Pravidelné bezpečnostní vzdělávání

## Neustálé zlepšování {#continuous-improvement}

Neustále zlepšujeme naši bezpečnost prostřednictvím:

* Monitorování bezpečnostních trendů a nově vznikajících hrozeb
* Pravidelná kontrola a aktualizace bezpečnostních zásad
* Zpětná vazba od bezpečnostních výzkumníků a uživatelů
* Účast v bezpečnostní komunitě

Pro více informací o našich bezpečnostních postupech nebo pro nahlášení bezpečnostních problémů kontaktujte prosím <security@forwardemail.net>.

## Další zdroje {#additional-resources}

* [Zásady ochrany osobních údajů](https://forwardemail.net/en/privacy)
* [Podmínky služby](https://forwardemail.net/en/terms)
* [Soulad s GDPR](https://forwardemail.net/gdpr)
* [Smlouva o zpracování dat (DPA)](https://forwardemail.net/dpa)
* [Nahlásit zneužití](https://forwardemail.net/en/report-abuse)
* [Bezpečnostní politika](https://github.com/forwardemail/.github/blob/main/SECURITY.md)
* [Security.txt](https://forwardemail.net/security.txt)
* [Úložiště GitHub](https://github.com/forwardemail/forwardemail.net)
* [FAQ](https://forwardemail.net/en/faq)