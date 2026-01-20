# Tietoturvakäytännöt {#security-practices}

<img loading="lazy" src="/img/articles/security.webp" alt="Forward Email security practices" class="rounded-lg" />

## Sisällysluettelo {#table-of-contents}

* [Esipuhe](#foreword)
* [Infrastruktuurin turvallisuus](#infrastructure-security)
  * [Turvalliset datakeskukset](#secure-data-centers)
  * [Verkkoturvallisuus](#network-security)
* [Sähköpostin suojaus](#email-security)
  * [Salaus](#encryption)
  * [Todennus ja valtuutus](#authentication-and-authorization)
  * [Väärinkäytösten vastaiset toimenpiteet](#anti-abuse-measures)
* [Tietosuoja](#data-protection)
  * [Tietojen minimointi](#data-minimization)
  * [Varmuuskopiointi ja palautus](#backup-and-recovery)
* [Palveluntarjoajat](#service-providers)
* [Vaatimustenmukaisuus ja tilintarkastus](#compliance-and-auditing)
  * [Säännölliset turvallisuusarvioinnit](#regular-security-assessments)
  * [Vaatimustenmukaisuus](#compliance)
* [Tapahtumavaste](#incident-response)
* [Tietoturvakehityksen elinkaari](#security-development-lifecycle)
* [Palvelimen suojaus](#server-hardening)
* [Palvelutasosopimus](#service-level-agreement)
* [Avoimen lähdekoodin tietoturva](#open-source-security)
* [Työntekijöiden turvallisuus](#employee-security)
* [Jatkuva parantaminen](#continuous-improvement)
* [Lisäresurssit](#additional-resources)

## Esipuhe {#foreword}

Forward Emaililla turvallisuus on meille tärkeintä. Olemme ottaneet käyttöön kattavia turvatoimenpiteitä sähköpostiviestiesi ja henkilötietojesi suojaamiseksi. Tässä asiakirjassa esitetään turvallisuuskäytäntömme ja toimenpiteet, joilla varmistamme sähköpostisi luottamuksellisuuden, eheyden ja saatavuuden.

## Infrastruktuurin suojaus {#infrastructure-security}

### Suojatut datakeskukset {#secure-data-centers}

Infrastruktuurimme sijaitsee SOC 2 -yhteensopivissa datakeskuksissa, joissa on:

* 24/7 fyysinen turvallisuus ja valvonta
* Biometriset pääsynvalvontajärjestelmät
* Redundantti sähköjärjestelmä
* Edistynyt palonilmaisu ja -sammutus
* Ympäristön valvonta

### Verkkoturvallisuus {#network-security}

Toteutamme useita verkkoturvallisuuden kerroksia:

* Yritystason palomuurit tiukoilla käyttöoikeusluetteloilla
* DDoS-suojaus ja sen lieventäminen
* Säännöllinen verkon haavoittuvuuksien skannaus
* Tunkeutumisen havaitsemis- ja estojärjestelmät
* Liikenteen salaus kaikkien palvelun päätepisteiden välillä
* Porttiskannaussuojaus ja epäilyttävän toiminnan automaattinen esto

> \[!IMPORTANT]
> Kaikki siirrettävä data salataan TLS 1.2+ -salauksella ja moderneilla salausmenetelmillä.

## Sähköpostin suojaus {#email-security}

### Salaus {#encryption}

* **Tilankulkukerroksen suojaus (TLS)**: Kaikki sähköpostiliikenne salataan siirron aikana TLS 1.2:lla tai uudemmalla.
* **Päästä päähän -salaus**: Tuki OpenPGP/MIME- ja S/MIME-standardeille.
* **Tallennussalaus**: Kaikki tallennetut sähköpostit salataan lepotilassa ChaCha20-Poly1305-salauksella SQLite-tiedostoissa.
* **Täydellinen levyn salaus**: LUKS v2 -salaus koko levylle.
* **Kattava suojaus**: Toteutamme salauksen levossa, salauksen muistissa ja salauksen siirron aikana.

> \[!NOTE]
> Olemme maailman ensimmäinen ja ainoa sähköpostipalvelu, joka käyttää **[kvanttiherkät ja yksilöllisesti salatut SQLite-postilaatikot](https://forwardemail.net/en/blog/docs/best-quantum-safe-encrypted-email-service)**-palvelua.

### Todennus ja valtuutus {#authentication-and-authorization}

* **DKIM-allekirjoitus**: Kaikki lähtevät sähköpostit allekirjoitetaan DKIM:llä
* **SPF ja DMARC**: Täysi tuki SPF:lle ja DMARC:lle sähköpostihuijausten estämiseksi
* **MTA-STS**: Tuki MTA-STS:lle TLS-salauksen varmistamiseksi
* **Monivaiheinen todennus**: Saatavilla kaikille tileille

### Väärinkäytösten vastaiset toimenpiteet {#anti-abuse-measures}

* **Roskapostin suodatus**: Monikerroksinen roskapostin tunnistus koneoppimisen avulla
* **Virustarkistus**: Kaikkien liitteiden reaaliaikainen tarkistus
* **Nopeuden rajoittaminen**: Suojaus raa'alta voimalta ja luettelointihyökkäyksiltä
* **IP-maine**: Lähettävän IP-osoitteen maineen valvonta
* **Sisällön suodatus**: Haitallisten URL-osoitteiden ja tietojenkalasteluyritysten havaitseminen

## Tietosuoja {#data-protection}

### Tietojen minimointi {#data-minimization}

Noudatamme tiedon minimoinnin periaatetta:

* Keräämme vain palvelumme tarjoamiseen tarvittavat tiedot.
* Sähköpostin sisältö käsitellään muistissa, eikä sitä tallenneta pysyvästi, ellei IMAP/POP3-toimitus sitä vaadi.
* Lokit anonymisoidaan ja säilytetään vain niin kauan kuin on tarpeen.

### Varmuuskopiointi ja palautus {#backup-and-recovery}

* Automatisoidut päivittäiset varmuuskopiot salauksella
* Maantieteellisesti hajautettu varmuuskopiotallennustila
* Säännöllinen varmuuskopioiden palautuksen testaus
* Katastrofien jälkeiset palautusmenettelyt määritellyillä RPO- ja RTO-arvoilla

## Palveluntarjoajat {#service-providers}

Valitsemme palveluntarjoajamme huolellisesti varmistaaksemme, että ne täyttävät korkeat turvallisuusstandardimme. Alla on lueteltu kansainväliseen tiedonsiirtoon käyttämämme palveluntarjoajat ja niiden GDPR-vaatimustenmukaisuusstatus:

| Palveluntarjoaja | Tarkoitus | DPF-sertifioitu | GDPR-vaatimustenmukaisuussivu |
| --------------------------------------------- | ------------------------- | ------------- | ----------------------------------------------------------------- |
| [Cloudflare](https://www.cloudflare.com) | CDN, DDoS-suojaus, DNS | ✅ Kyllä | [Cloudflare GDPR](https://www.cloudflare.com/trust-hub/gdpr/) |
| [DataPacket](https://www.datapacket.com) | Palvelininfrastruktuuri | ❌ Ei | [DataPacket Privacy](https://www.datapacket.com/privacy-policy) |
| [Digital Ocean](https://www.digitalocean.com) | Pilvi-infrastruktuuri | ❌ Ei | [DigitalOcean GDPR](https://www.digitalocean.com/legal/gdpr) |
| [Vultr](https://www.vultr.com) | Pilvi-infrastruktuuri | ❌ Ei | [Vultr GDPR](https://www.vultr.com/legal/eea-gdpr-privacy/) |
| [Stripe](https://stripe.com) | Maksun käsittely | ✅ Kyllä | [Stripe Privacy Center](https://stripe.com/legal/privacy-center) |
| [PayPal](https://www.paypal.com) | Maksun käsittely | ❌ Ei | [PayPal Privacy](https://www.paypal.com/uk/legalhub/privacy-full) |

Käytämme näitä palveluntarjoajia varmistaaksemme luotettavan ja turvallisen palvelun toimituksen samalla, kun noudatamme kansainvälisiä tietosuojamääräyksiä. Kaikki tiedonsiirrot suoritetaan asianmukaisin suojatoimin henkilötietojesi suojaamiseksi.

## Vaatimustenmukaisuus ja auditointi {#compliance-and-auditing}

### Säännölliset tietoturva-arvioinnit {#regular-security-assessments}

Tiimimme valvoo, tarkistaa ja arvioi säännöllisesti koodikantaa, palvelimia, infrastruktuuria ja käytäntöjä. Toteutamme kattavan tietoturvaohjelman, joka sisältää:

* SSH-avainten säännöllinen kierrätys
* Jatkuva käyttölokien valvonta
* Automaattinen tietoturvaskannaus
* Ennakoiva haavoittuvuuksien hallinta
* Säännöllinen tietoturvakoulutus kaikille tiimin jäsenille

### Vaatimustenmukaisuus {#compliance}

* [GDPR](https://forwardemail.net/gdpr)-yhteensopivat tietojenkäsittelykäytännöt
* [Tietojenkäsittelysopimus (DPA)](https://forwardemail.net/dpa) saatavilla yritysasiakkaille
* CCPA-yhteensopivat tietosuojakäytännöt
* SOC 2 Type II -auditoidut prosessit

## Tapahtumavastaus {#incident-response}

Tietoturvapoikkeamien varautumissuunnitelmamme sisältää:

1. **Havaitseminen**: Automaattiset valvonta- ja hälytysjärjestelmät
2. **Eristäminen**: Vaikutuksen kohteena olevien järjestelmien välitön eristäminen
3. **Hävittämistoimenpiteet**: Uhan poistaminen ja perussyyanalyysi
4. **Palauttaminen**: Palveluiden turvallinen palauttaminen
5. **Ilmoitus**: Oikea-aikainen viestintä vaikutusten kohteena olevien käyttäjien kanssa
6. **Tapahtuman jälkeinen analyysi**: Kattava tarkastelu ja parantaminen

> \[!WARNING]
> Jos huomaat tietoturvahaavoittuvuuden, ilmoita siitä välittömästi osoitteeseen <security@forwardemail.net>.

## Tietoturvakehityksen elinkaari {#security-development-lifecycle}

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

Kaikki koodi käy läpi:

* Tietoturvavaatimusten kerääminen
* Uhkien mallintaminen suunnittelun aikana
* Turvalliset koodauskäytännöt
* Staattinen ja dynaaminen sovellusten tietoturvatestaus
* Koodin tarkastelu tietoturvapainotteisesti
* Riippuvuussuhteiden haavoittuvuuksien skannaus

## Palvelimen suojaus {#server-hardening}

[Ansible-kokoonpano](https://github.com/forwardemail/forwardemail.net/tree/master/ansible)-objektimme toteuttaa useita palvelimen suojaustoimenpiteitä:

* **USB-käyttö poistettu käytöstä**: Fyysiset portit on poistettu käytöstä lisäämällä usb-storage-ydinmoduuli mustalle listalle.* **Palomuurisäännöt**: Tiukat iptables-säännöt, jotka sallivat vain tarvittavat yhteydet.* **SSH-kovetus**: Vain avainpohjainen todennus, ei salasanakirjautumista, pääkäyttäjän kirjautuminen poistettu käytöstä.* **Palvelun eristäminen**: Jokainen palvelu toimii minimaalisilla vaadituilla oikeuksilla.* **Automaattiset päivitykset**: Tietoturvakorjaukset asennetaan automaattisesti.* **Suojattu käynnistys**: Vahvistettu käynnistysprosessi peukaloinnin estämiseksi.* **Ytimen koventaminen**: Suojatut ytimen parametrit ja sysctl-määritykset.* **Tiedostojärjestelmän rajoitukset**: noexec-, nosuid- ja nodev-liityntävaihtoehdot tarvittaessa.* **Ydinvedokset poistettu käytöstä**: Järjestelmä on määritetty estämään ydinvedokset tietoturvasyistä.* **Vaihto pois käytöstä**: Vaihtomuisti poistettu käytöstä tietovuotojen estämiseksi.* **Porttiskannauksen suojaus**: Porttiskannausyritysten automaattinen tunnistus ja esto.* **Läpinäkyvät valtavat sivut poistettu käytöstä**: THP poistettu käytöstä suorituskyvyn ja tietoturvan parantamiseksi.* **Järjestelmäpalvelun koventaminen**: Ei-välttämättömät palvelut, kuten Apport, poistettu käytöstä.* **Käyttäjä Hallinta**: Vähiten oikeuksien periaate, jossa on erilliset deploy- ja devops-käyttäjät
* **Tiedostokuvaajien rajoitukset**: Suuremmat rajoitukset paremman suorituskyvyn ja tietoturvan saavuttamiseksi

## Palvelutasosopimus {#service-level-agreement}

Ylläpidämme palvelun korkeaa käytettävyyttä ja luotettavuutta. Infrastruktuurimme on suunniteltu redundanssia ja vikasietoisuutta silmällä pitäen, jotta sähköpostipalvelusi pysyy toiminnassa. Vaikka emme julkaise virallista palvelutasosopimusta, olemme sitoutuneet:

* 99,9 %+ käyttöaika kaikille palveluille
* Nopea reagointi palvelun häiriöihin
* Läpinäkyvä viestintä häiriötilanteissa
* Säännöllinen ylläpito vähäisen liikenteen aikana

## Avoimen lähdekoodin suojaus {#open-source-security}

[avoimen lähdekoodin palvelu](https://github.com/forwardemail/forwardemail.net):na tietoturvamme hyötyy seuraavista eduista:

* Läpinäkyvä koodi, jota kuka tahansa voi auditoida
* Yhteisön johtamat tietoturvaparannukset
* Haavoittuvuuksien nopea tunnistaminen ja korjaaminen
* Ei tietoturvaa hämärän takia

## Työntekijän suojaus {#employee-security}

* Kaikkien työntekijöiden taustatarkastukset
* Tietoturvakoulutus
* Vähiten oikeuksiin perustuvan käyttöoikeuden periaate
* Säännöllinen tietoturvakoulutus

## Jatkuva parantaminen {#continuous-improvement}

Parannamme jatkuvasti tietoturvaamme seuraavilla tavoilla:

* Tietoturvatrendien ja uusien uhkien seuranta
* Tietoturvakäytäntöjen säännöllinen tarkastelu ja päivitykset
* Palaute tietoturvatutkijoilta ja käyttäjiltä
* Osallistuminen tietoturvayhteisöön

Jos haluat lisätietoja turvallisuuskäytännöistämme tai ilmoittaa turvallisuusongelmista, ota yhteyttä osoitteeseen <security@forwardemail.net>.

## Lisäresurssit {#additional-resources}

* [Tietosuojakäytäntö](https://forwardemail.net/en/privacy)
* [Palveluehdot](https://forwardemail.net/en/terms)
* [GDPR-vaatimustenmukaisuus](https://forwardemail.net/gdpr)
* [Tietojenkäsittelysopimus (DPA)](https://forwardemail.net/dpa)
* [Ilmoita väärinkäytöstä](https://forwardemail.net/en/report-abuse)
* [Tietoturvakäytäntö](https://github.com/forwardemail/.github/blob/main/SECURITY.md)
* [Security.txt](https://forwardemail.net/security.txt)
* [GitHub-arkisto](https://github.com/forwardemail/forwardemail.net)
* [FAQ](https://forwardemail.net/en/faq)