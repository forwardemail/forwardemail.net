# Tietoja sähköpostin edelleenlähetyksestä {#about-forward-email}

<img loading="lazy" src="/img/articles/about.webp" alt="Forward Email team and company story" class="rounded-lg" />

# Tietoja sähköpostin edelleenlähetyksestä {#about-forward-email-1}

## Sisällysluettelo {#table-of-contents}

* [Yleiskatsaus](#overview)
* [Perustaja ja missio](#founder-and-mission)
* [Aikajana](#timeline)
  * [2017 - Perustaminen ja lanseeraus](#2017---founding-and-launch)
  * [2018 - Infrastruktuuri ja integraatio](#2018---infrastructure-and-integration)
  * [2019 - Suorituskyvyn vallankumous](#2019---performance-revolution)
  * [2020 - Yksityisyyden ja turvallisuuden painopiste](#2020---privacy-and-security-focus)
  * [2021 - Alustan modernisointi](#2021---platform-modernization)
  * [2023 - Infrastruktuurin ja ominaisuuksien laajennus](#2023---infrastructure-and-feature-expansion)
  * [2024 - Palvelun optimointi ja edistyneet ominaisuudet](#2024---service-optimization-and-advanced-features)
  * [2025 - Yksityisyyden parannukset ja protokollatuki](#2025---privacy-enhancements-and-protocol-support)
  * [2026 - RFC-yhteensopivuus ja edistynyt suodatus](#2026---rfc-compliance-and-advanced-filtering)
* [Keskeiset periaatteet](#core-principles)
* [Nykyinen tila](#current-status)

## Yleiskatsaus {#overview}

> \[!TIP]
> Teknisiä tietoja arkkitehtuuristamme, tietoturvatoteutuksistamme ja etenemissuunnitelmastamme on kohdassa [Tekninen raportti](https://forwardemail.net/technical-whitepaper.pdf).

Sähköpostin edelleenlähetys on [ilmainen ja avoimen lähdekoodin](https://en.wikipedia.org/wiki/Free_and_open-source "Free and open-source") [sähköpostin edelleenlähetys](https://en.wikipedia.org/wiki/Email_forwarding "Email forwarding") -palvelu, joka keskittyy käyttäjän [oikeus yksityisyyteen](https://en.wikipedia.org/wiki/Right_to_privacy "Right to privacy")-tilille. Vuonna 2017 yksinkertaisena sähköpostin edelleenlähetysratkaisuna alkanut palvelu on kehittynyt kattavaksi sähköpostialustaksi, joka tarjoaa rajattomasti mukautettuja verkkotunnuksia, rajattomasti sähköpostiosoitteita ja aliaksia, rajattomasti kertakäyttöisiä sähköpostiosoitteita, roskaposti- ja tietojenkalastelusuojauksen, salatun postilaatikon tallennuksen ja lukuisia edistyneitä ominaisuuksia.

Palvelua ylläpitää ja omistaa sen alkuperäinen perustajatiimi, joka koostuu suunnittelijoista ja kehittäjistä. Se on rakennettu 100 % avoimen lähdekoodin ohjelmistolla käyttäen [JavaScript](https://en.wikipedia.org/wiki/JavaScript "JavaScript"):aa, [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js"):tä, [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System"):ta, [HTTPS](https://en.wikipedia.org/wiki/HTTPS "HTTPS"):a, [TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security "TLS"):ää ja [SMTP](https://en.wikipedia.org/wiki/SMTP "SMTP"):tä.

## Perustaja ja missio {#founder-and-mission}

**Nicholas Baugh** perusti Forward Emailin vuonna 2017. [Sähköpostin edelleenlähetyksen tekninen raportti](https://forwardemail.net/technical-whitepaper.pdf):n mukaan Baugh etsi aluksi kustannustehokasta ja yksinkertaista ratkaisua sähköpostin käyttöönottoon verkkotunnuksissa sivuprojekteissaan. Tutkittuaan saatavilla olevia vaihtoehtoja hän alkoi koodata omaa ratkaisuaan ja osti verkkotunnuksen `forwardemail.net` 2. lokakuuta 2017.

Forward Emailin missio ulottuu sähköpostipalveluiden tarjoamisen ulkopuolelle – se pyrkii mullistamaan alan lähestymistavan sähköpostin yksityisyyteen ja tietoturvaan. Yrityksen ydinarvoihin kuuluvat läpinäkyvyys, käyttäjien hallinta ja yksityisyyden suoja teknisen toteutuksen kautta pelkkien käytäntölupausten sijaan.

## Aikajana {#timeline}

### 2017 - Perustaminen ja lanseeraus {#2017---founding-and-launch}

**2. lokakuuta 2017**: Nicholas Baugh osti verkkotunnuksen `forwardemail.net` tutkittuaan kustannustehokkaita sähköpostiratkaisuja sivuprojekteilleen.

**5. marraskuuta 2017**: Baugh loi 634-rivisen JavaScript-tiedoston käyttämällä [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js")-palvelua sähköpostien edelleenlähettämiseen mille tahansa mukautetulle verkkotunnukselle. Tämä alustava toteutus julkaistiin avoimen lähdekoodin palveluna [GitHub](https://github.com/forwardemail):lle, ja palvelu käynnistettiin GitHub Pagesin avulla.

**Marraskuu 2017**: Sähköpostin edelleenlähetys julkaistiin virallisesti alkuperäisen julkaisun jälkeen. Varhainen versio oli puhtaasti DNS-pohjainen ilman tilin rekisteröintiä tai rekisteröitymisprosessia – se oli vain Markdownilla kirjoitettu README-tiedosto ohjeineen. Käyttäjät pystyivät määrittämään sähköpostin edelleenlähetyksen määrittämällä MX-tietueet osoittamaan `mx1.forwardemail.net`- ja `mx2.forwardemail.net`-tietueisiin ja lisäämällä TXT-tietueen `forward-email=user@gmail.com`-tietueella.

Tämän ratkaisun yksinkertaisuus ja tehokkuus herättivät huomiota merkittävien kehittäjien keskuudessa, mukaan lukien [David Heinemeier Hansson](https://dhh.dk) (Ruby on Railsin luoja), joka jatkaa sähköpostin edelleen lähettämistä verkkotunnuksellaan `dhh.dk`.

### 2018 - Infrastruktuuri ja integraatio {#2018---infrastructure-and-integration}

**Huhtikuu 2018**: Kun [Pilvimyrsky](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") julkaisi [yksityisyyttä ensisijaisesti huomioiva kuluttajille suunnattu DNS-palvelu](https://blog.cloudflare.com/announcing-1111/)-palvelunsa, Forward Email -palvelu vaihtoi [OpenDNS](https://en.wikipedia.org/wiki/OpenDNS "OpenDNS")-palvelusta [Pilvimyrsky](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare")-palveluun [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System")-hakujen käsittelyssä, mikä osoittaa yrityksen sitoutumisen yksityisyyttä suojaaviin infrastruktuurivalintoihin.

**Lokakuu 2018**: Sähköpostin edelleenlähetystoiminto mahdollisti käyttäjille sähköpostin lähettämisen osoitteena [Gmail](https://en.wikipedia.org/wiki/Gmail "Gmail")- ja [Näkymät](https://en.wikipedia.org/wiki/Outlook "Outlook")-ominaisuuksien avulla, mikä laajensi integrointimahdollisuuksia suosittujen sähköpostipalveluntarjoajien kanssa.

### 2019 - Suorituskyvyn vallankumous {#2019---performance-revolution}

**Toukokuu 2019**: Forward Email julkaisi version 2, joka edusti merkittävää uudelleenkirjoitusta alkuperäisiin versioihin verrattuna. Tämä päivitys keskittyi [suorituskyky](https://en.wikipedia.org/wiki/Software_performance_testing "Software performance testing")-version parannuksiin [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js")-version [purot](https://en.wikipedia.org/wiki/Streams "Streams")-version avulla, mikä loi perustan alustan skaalautuvuudelle.

### 2020 - Tietosuoja ja tietoturva keskittyvät {#2020---privacy-and-security-focus}

**Helmikuu 2020**: Forward Email julkaisi Enhanced Privacy Protection -paketin, jonka avulla käyttäjät voivat poistaa käytöstä julkisten DNS-tietueiden asettamisen sähköpostin edelleenlähetysmääritysaliaksiensa yhteydessä. Tämän paketin avulla käyttäjän sähköpostialiasten tiedot piilotetaan julkisesti internetistä haettavilta. Yritys julkaisi myös ominaisuuden, jolla voi ottaa käyttöön tai poistaa käytöstä tiettyjä aliaksia, mutta ne voivat silti näkyä kelvollisina sähköpostiosoitteina ja palauttaa onnistuneen [SMTP-tilakoodit](https://en.wikipedia.org/wiki/List_of_SMTP_server_return_codes "List of SMTP server return codes")-muuttujan, jolloin sähköpostit hylätään välittömästi (samanlainen kuin tulosteen piippu [/dev/null](https://en.wikipedia.org/wiki/Null_device "Null device")-muuttujan kautta).

**Huhtikuu 2020**: Kohdattuaan lukemattomia esteitä olemassa olevilla roskapostintunnistusratkaisuilla, jotka eivät kunnioittaneet Forward Emailin tietosuojakäytäntöä, yritys julkaisi roskapostiskannerin ensimmäisen alfa-version. Tämä täysin ilmainen ja avoimen lähdekoodin [roskapostin suodatus](https://en.wikipedia.org/wiki/Anti-spam_techniques "Anti-spam techniques")-ratkaisu käyttää [Naiivi Bayes-roskapostisuodatin](https://en.wikipedia.org/wiki/Naive_Bayes_spam_filtering "Naive Bayes spam filtering")-lähestymistapaa yhdistettynä [tietojenkalastelunesto](https://en.wikipedia.org/wiki/Phishing "Phishing")- ja [IDN-homografihyökkäys](https://en.wikipedia.org/wiki/IDN_homograph_attack "IDN homograph attack")-suojauksiin. Forward Email julkaisi myös [kaksivaiheinen todennus](https://en.wikipedia.org/wiki/Multi-factor_authentication "Multi-factor authentication") (2FA) -ratkaisun, joka käyttää [kertakäyttöiset salasanat](https://en.wikipedia.org/wiki/One-time_password "One-time password") (OTP) -suojausta tilin turvallisuuden parantamiseksi.

**Toukokuu 2020**: Sähköpostin edelleenlähetystoiminto salli mukautetun [porttiohjaus](https://en.wikipedia.org/wiki/Port_forwarding "Port forwarding")-ominaisuuden käytön kiertotapana käyttäjille, jotka halusivat kiertää [ISP](https://en.wikipedia.org/wiki/Internet_service_provider "Internet service provider")-ominaisuuden porttieston. Yritys julkaisi myös [Ilmainen sähköpostin edelleenlähetys RESTful-rajapinta](email-api)-ominaisuuden, joka sisältää täydellisen dokumentaation ja reaaliaikaiset pyyntö- ja vastausesimerkit sekä tuen webhookeille.

**Elokuu 2020**: Sähköpostin edelleenlähetystoimintoon lisättiin tuki [Todennettu vastaanotettu ketju](arc) ("ARC") -sähköpostin todennusjärjestelmälle, mikä vahvisti entisestään sähköpostin tietoturvaa ja toimitettavuutta.

**23. marraskuuta 2020**: Forward Email julkaisi julkisesti beta-ohjelmansa, mikä on merkittävä virstanpylväs alustan kehityksessä.

### 2021 - Alustan modernisointi {#2021---platform-modernization}

**Helmikuu 2021**: Forward Email refaktoroi koodikantaansa poistaakseen kaikki [Python](https://en.wikipedia.org/wiki/Python_\(programming_language\) ("Python (ohjelmointikieli)") -riippuvuudet, jolloin heidän koodipinostaan tuli 100 % [JavaScript](https://en.wikipedia.org/wiki/JavaScript "JavaScript") ja [Node.js](https://en.wikipedia.org/wiki/Node.js). Tämä arkkitehtoninen päätös oli linjassa yrityksen sitoutumisen kanssa ylläpitää yhtenäistä, avoimen lähdekoodin teknologiapinoa.

**27. syyskuuta 2021**: Lähetä sähköposti [lisätty tuki](email-forwarding-regex-pattern-filter) edelleenlähetysaliaseille vastaamaan [säännölliset lausekkeet](https://en.wikipedia.org/wiki/Regular_expression "Regular expression"):tä, mikä tarjoaa käyttäjille kehittyneempiä sähköpostin reititysominaisuuksia.

### 2023 - Infrastruktuurin ja ominaisuuksien laajennus {#2023---infrastructure-and-feature-expansion}

**Tammikuu 2023**: Forward Email julkaisi uudelleensuunnitellun ja sivun latausnopeudelle optimoidun verkkosivuston, joka parantaa käyttökokemusta ja suorituskykyä.

**Helmikuu 2023**: Yritys lisäsi tuen [virhelokit](/faq#do-you-store-error-logs):lle ja otti käyttöön [tumma tila](https://en.wikipedia.org/wiki/Light-on-dark_color_scheme)-verkkosivuston värimaailman, joka vastaa käyttäjien mieltymyksiin ja esteettömyystarpeisiin.

**Maaliskuu 2023**: Forward Email julkaisi [Mandariini](https://github.com/forwardemail/tangerine#readme):n ja integroi sen koko infrastruktuuriinsa, mikä mahdollisti [DNS HTTPS:n kautta](https://en.wikipedia.org/wiki/DNS_over_HTTPS):n ("DoH") käytön sovellustasolla. Yritys lisäsi myös tuen [MTA-STS](/faq#do-you-support-mta-sts):lle ja vaihtoi [hCaptcha](/):sta [Cloudflare-kääntöportti](https://developers.cloudflare.com/turnstile):ään.

**Huhtikuu 2023**: Forward Email otti käyttöön ja automatisoi täysin uuden infrastruktuurin. Koko palvelu alkoi toimia globaalisti kuormituksen tasaavalla ja läheisyysperusteisella DNS:llä, jossa käytettiin terveystarkistuksia ja vikasietoisuutta [Pilvimyrsky](https://cloudflare.com):lla, joka korvasi aiemman round-robin DNS-lähestymistavan. Yritys siirtyi **paljaisiin metallipalvelimiin** useiden palveluntarjoajien, mukaan lukien [Vultr](https://www.vultr.com/?ref=429848):n ja [Digitaalinen valtameri](https://m.do.co/c/a7cecd27e071):n, kautta, jotka molemmat ovat SOC 2 Type 1 -yhteensopivia. MongoDB- ja Redis-tietokannat siirrettiin klusteroituihin kokoonpanoihin, joissa oli ensisijaiset ja varasolmut korkean käytettävyyden, kokonaisvaltaisen SSL-salauksen, lepotilassa tapahtuvan salauksen ja ajankohtaisen palautuksen (PITR) takaamiseksi.

**Toukokuu 2023**: Forward Email julkaisi **lähtevän SMTP-viestien** ominaisuuden [sähköpostin lähettäminen SMTP:n avulla](/faq#do-you-support-sending-email-with-smtp)- ja [sähköpostin lähettäminen API:n avulla](/faq#do-you-support-sending-email-with-api)-pyynnöille. Tämä ominaisuus sisältää sisäänrakennettuja suojausmenetelmiä korkean toimitettavuuden varmistamiseksi, modernin ja vankan jonotus- ja uudelleenyritysjärjestelmän sekä [tukee reaaliaikaisia virhelokien tallentamista](/faq#do-you-store-error-logs)-ominaisuuden.

**Marraskuu 2023**: Forward Email julkaisi [**salattu postilaatikon tallennus**](/blog/docs/best-quantum-safe-encrypted-email-service)-ominaisuuden [IMAP-tuki](/faq#do-you-support-receiving-email-with-imap)-sähköpostille, mikä on merkittävä edistysaskel sähköpostin yksityisyyden ja turvallisuuden parantamisessa.

**Joulukuu 2023**: Yritys [lisätty tuki](/faq#do-you-support-pop3) [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol):n, [salasanat ja WebAuthn](/faq#do-you-support-passkeys-and-webauthn):n ja [aika postilaatikkoon](/faq#i):n valvonnalle sekä [OpenPGP IMAP-tallennusta varten](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd):lle.

### 2024 - Palvelun optimointi ja lisäominaisuudet {#2024---service-optimization-and-advanced-features}

**Helmikuu 2024**: Sähköpostin välitys [lisätty kalenterin (CalDAV) tuki](/faq#do-you-support-calendars-caldav), laajentaa alustan ominaisuuksia sähköpostin ulkopuolelle kattamaan myös kalenterin synkronoinnin.

**Maaliskuu–heinäkuu 2024**: Forward Email julkaisi merkittäviä optimointeja ja parannuksia IMAP-, POP3- ja CalDAV-palveluihinsa tavoitteenaan tehdä palvelustaan yhtä nopea, ellei jopa nopeampi, kuin vaihtoehdot.

**Heinäkuu 2024**: Yritys [lisätty iOS Push -tuki](https://github.com/nodemailer/wildduck/issues/711#issuecomment-2254114016) korjaa Apple Mail on iOS:n IMAP `IDLE` -komennon tuen puutteen ja mahdollistaa reaaliaikaiset ilmoitukset Apple iOS -laitteille. Forward Email lisäsi myös aikaa postilaatikon ("TTI") valvontaan omassa palvelussaan ja Yahoon/AOL:ssa ja alkoi sallia käyttäjien salata koko DNS-TXT-tietueensa jopa ilmaisessa paketissa. Kuten [Tietosuojaoppaiden keskustelut](https://discuss.privacyguides.net/t/forward-email-email-provider/13370) ja [GitHub-ongelmat](https://github.com/forwardemail/forwardemail.net/issues/254) pyysivät, yritys lisäsi aliaksille mahdollisuuden joko hylätä `250` hiljaisesti, hylätä `421` pehmeästi tai hylätä `550` pysyvästi, kun se on poistettu käytöstä.

**Elokuu 2024**: Sähköpostin edelleenlähetystoimintoon lisättiin tuki postilaatikoiden viennille [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions)- ja [Mbox](https://en.wikipedia.org/wiki/Mbox)-muodoissa (olemassa olevan [SQLite](https://en.wikipedia.org/wiki/SQLite)-vientimuodon lisäksi). [Webhook-allekirjoitusten tuki lisättiin](https://forwardemail.net/faq#do-you-support-bounce-webhooks)-muotoon, ja yritys alkoi sallia käyttäjien lähettää uutiskirjeitä, ilmoituksia ja sähköpostimarkkinointia lähtevän SMTP-palvelunsa kautta. Myös verkkotunnuskohtaiset ja aliaskohtaiset tallennuskiintiöt IMAP/POP3/CalDAV-protokollille otettiin käyttöön.

### 2025 - Yksityisyyden parannukset ja protokollatuki {#2025---privacy-enhancements-and-protocol-support}

**Syyskuu 2024 – tammikuu 2025**: Lähetä sähköposti edelleen [lisätty paljon pyydetty lomavastaajatoiminto ja OpenPGP/WKD-salauksen sähköpostin edelleenlähetystä varten](https://discuss.privacyguides.net/t/forward-email-email-provider/13370/254) jo toteutettujen salattujen postilaatikoiden tallennusominaisuuksien pohjalta.

**21. tammikuuta 2025**: Perustajan paras ystävä "Jack", hänen uskollinen koirakumppaninsa, menehtyi rauhallisesti lähes 11-vuotiaana. Jack [tullaan aina muistamaan](https://github.com/forwardemail/forwardemail.net/commit/994ce771f0338cbe77f10bd613989e0924883f9b) hänen horjumattomasta kumppanuudestaan, joka tuki Forward Emailin luomista. [Sähköpostin edelleenlähetyksen tekninen raportti](https://forwardemail.net/technical-whitepaper.pdf) on omistettu Jackille ja tunnustaa hänen roolinsa palvelun kehittämisessä.

**Helmikuu 2025**: Forward Email vaihtoi [DataPacket](https://www.datapacket.com):n uudeksi ensisijaiseksi datakeskuspalveluntarjoajakseen ja otti käyttöön räätälöityjä, suorituskykyyn keskittyviä, bare metal -laitteistoja parantaakseen palvelun luotettavuutta ja nopeutta entisestään.

**Kesäkuu 2025**: Forward Email julkaisi tuen [CardDAV-protokolla](/faq#do-you-support-contacts-carddav):lle, laajentaen alustan ominaisuuksia koskemaan yhteystietojen synkronointia olemassa olevien sähköposti- ja kalenteripalveluiden rinnalla.

### 2026 - RFC-yhteensopivuus ja edistynyt suodatus {#2026---rfc-compliance-and-advanced-filtering}

**Tammikuu 2026**: Forward Email julkaisi kattavan [RFC-protokollan yhteensopivuusdokumentin](/blog/docs/email-protocols-rfc-compliance-imap-smtp-pop3-comparison), joka kuvaa täydellisen standardituen SMTP:lle, IMAP:lle, POP3:lle ja CalDAV:lle. Alusta lisäsi myös [REQUIRETLS-tuen (RFC 8689)](/faq#requiretls-support) pakotettuun TLS-salaukseen sähköpostin kuljetuksessa, [S/MIME-salauksen (RFC 8551)](/faq#do-you-support-smime-encryption) turvalliseen viestien allekirjoitukseen ja salaukseen sekä kattavan [Sieve-sähköpostisuodatuksen (RFC 5228)](/faq#do-you-support-sieve-email-filtering) [ManageSieve-protokollan (RFC 5804)](/faq#do-you-support-sieve-email-filtering) tuella palvelinpuolen sähköpostisuodatukseen. [REST API](/email-api) laajennettiin 39 päätepisteeseen, jotka kattavat viestit, kansiot, yhteystiedot, kalenterit ja kalenteritapahtumat.

## Keskeiset periaatteet {#core-principles}

Perustamisestaan lähtien Forward Email on pitänyt kiinni vankasta sitoutumisestaan yksityisyyden ja turvallisuuden periaatteisiin:

**100 % avoimen lähdekoodin filosofia**: Toisin kuin kilpailijat, jotka tekevät avoimeksi vain käyttöliittymänsä ja pitävät taustajärjestelmät suljettuina, Forward Email on asettanut koko koodikantansa – sekä käyttöliittymän että taustajärjestelmän – julkisesti saataville [GitHub](https://github.com/forwardemail)-sivustolla.

**Tietosuoja ensin**: Forward Email otti alusta alkaen käyttöön ainutlaatuisen muistissa tapahtuvan käsittelyn, joka välttää sähköpostien kirjoittamisen levylle. Tämä erottaa sen perinteisistä sähköpostipalveluista, jotka tallentavat viestit tietokantoihin tai tiedostojärjestelmiin.

**Jatkuva innovaatio**: Palvelu on kehittynyt yksinkertaisesta sähköpostin edelleenlähetysratkaisusta kattavaksi sähköpostialustaksi, jossa on ominaisuuksia, kuten salatut postilaatikot, kvanttisuojattu salaus ja tuki standardiprotokollille, kuten SMTP, IMAP, POP3 ja CalDAV.

**Läpinäkyvyys**: Kaiken koodin tekeminen avoimeksi ja tarkasteltavaksi, mikä varmistaa, että käyttäjät voivat tarkistaa tietosuojaväitteet sen sijaan, että he vain luottaisivat markkinointilausuntoihin.

**Käyttäjän hallinta**: Tarjoaa käyttäjille vaihtoehtoja, mukaan lukien mahdollisuus isännöidä koko alustaa itse halutessaan.

## Nykyinen tila {#current-status}

Vuodesta 2025 lähtien Forward Email palvelee yli 500 000 verkkotunnusta maailmanlaajuisesti, mukaan lukien merkittäviä organisaatioita ja alan johtajia, kuten:

* **Teknologiayritykset**: Canonical (Ubuntu), Netflix Games, The Linux Foundation, The PHP Foundation, jQuery, LineageOS
* **Mediaorganisaatiot**: Fox News Radio, Disney Ad Sales
* **Oppilaitokset**: Cambridgen yliopisto, Marylandin yliopisto, Washingtonin yliopisto, Tuftsin yliopisto, Swarthmore College
* **Valtionhallinnon yksiköt**: Etelä-Australian hallitus, Dominikaanisen tasavallan hallitus
* **Muut organisaatiot**: RCD Hotels, Fly<span>.</span>io
* **Merkittäviä kehittäjiä**: Isaac Z. Schlueter (npm:n luoja), David Heinemeier Hansson (Ruby on Railsin luoja)

Alusta kehittyy jatkuvasti säännöllisten ominaisuusjulkaisujen ja infrastruktuuriparannusten myötä, säilyttäen asemansa ainoana tällä hetkellä saatavilla olevana 100 % avoimen lähdekoodin, salattuna, yksityisyyteen keskittyvänä, läpinäkyvänä ja kvanttiteknisesti kestävänä sähköpostipalveluna.

<img loading="lazy" src="/img/articles/about-footer.webp" alt="Forward Email privacy-focused email service" class="rounded-lg" />