# Tietoja sähköpostin edelleenlähettämisestä {#about-forward-email}

<img loading="laiska" src="/img/articles/about.webp" alt="" class="rounded-lg" />

# About Forward Email {#about-forward-email-1}

## Sisällysluettelo {#table-of-contents}

* [Yleiskatsaus](#overview)
* [Perustaja ja missio](#founder-and-mission)
* [Aikajana](#timeline)
  * [2017 - Perustaminen ja lanseeraus](#2017---founding-and-launch)
  * [2018 - Infrastruktuuri ja integraatio](#2018---infrastructure-and-integration)
  * [2019 - Suorituskyvyn vallankumous](#2019---performance-revolution)
  * [2020 - Tietosuoja ja tietoturva keskittyvät](#2020---privacy-and-security-focus)
  * [2021 - Alustan modernisointi](#2021---platform-modernization)
  * [2023 - Infrastruktuurin ja ominaisuuksien laajennus](#2023---infrastructure-and-feature-expansion)
  * [2024 - Palvelun optimointi ja lisäominaisuudet](#2024---service-optimization-and-advanced-features)
  * [2025 - Jatkuvaa innovaatiota](#2025---continued-innovation)
* [Keskeiset periaatteet](#core-principles)
* [Nykyinen tila](#current-status)

## Overview {#overview}

> \[!TIP]
> For technical details about our architecture, security implementations, and roadmap, see the [Technical Whitepaper](https://forwardemail.net/technical-whitepaper.pdf).

Sähköpostin edelleenlähetys on [ilmainen ja avoimen lähdekoodin](https://en.wikipedia.org/wiki/Free_and_open-source "Free and open-source") [sähköpostin edelleenlähetys](https://en.wikipedia.org/wiki/Email_forwarding "Email forwarding") palvelu, joka keskittyy käyttäjän [oikeus yksityisyyteen](https://en.wikipedia.org/wiki/Right_to_privacy "Right to privacy") tarpeisiin. Yksinkertaisena sähköpostin edelleenlähetysratkaisuna vuonna 2017 alkanut palvelu on kehittynyt kattavaksi sähköpostialustaksi, joka tarjoaa rajattomasti mukautettuja verkkotunnuksia, rajattomasti sähköpostiosoitteita ja aliaksia, rajattomasti kertakäyttöisiä sähköpostiosoitteita, roskaposti- ja tietojenkalastelusuojauksen, salatun postilaatikon tallennuksen ja lukuisia edistyneitä ominaisuuksia.

Palvelua ylläpitää ja omistaa sen alkuperäinen perustajatiimi, joka koostuu suunnittelijoista ja kehittäjistä. Se on rakennettu 100 % avoimen lähdekoodin ohjelmistoilla käyttäen [JavaScript](https://en.wikipedia.org/wiki/JavaScript "JavaScript"), [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js"), [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System"), [HTTPS](https://en.wikipedia.org/wiki/HTTPS "HTTPS"), [TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security "TLS") ja [SMTP](https://en.wikipedia.org/wiki/SMTP "SMTP").

## Founder and Mission {#founder-and-mission}

Forward Email was founded by **Nicholas Baugh** in 2017. According to the [Sähköpostin edelleenlähetyksen tekninen raportti](https://forwardemail.net/technical-whitepaper.pdf), Baugh was initially searching for a cost-effective and simple solution for enabling email on domain names for his side-projects. After researching available options, he began coding his own solution and purchased the domain `forwardemail.net` on October 2, 2017.

Forward Emailin missio ulottuu sähköpostipalveluiden tarjoamisen ulkopuolelle – se pyrkii mullistamaan alan lähestymistavan sähköpostin yksityisyyteen ja tietoturvaan. Yrityksen ydinarvoihin kuuluvat läpinäkyvyys, käyttäjien hallinta ja yksityisyyden suoja teknisen toteutuksen kautta pelkkien käytäntölupausten sijaan.

## Aikajana {#timeline}

### 2017 - Perustaminen ja lanseeraus {#2017---founding-and-launch}

**2. lokakuuta 2017**: Nicholas Baugh osti verkkotunnuksen `forwardemail.net` tutkittuaan kustannustehokkaita sähköpostiratkaisuja sivuprojekteilleen.

**5. marraskuuta 2017**: Baugh loi 634-rivisen JavaScript-tiedoston käyttäen [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js")-palvelua sähköpostien edelleenlähettämiseen mille tahansa mukautetulle verkkotunnukselle. Tämä alustava toteutus julkaistiin avoimen lähdekoodin palveluna [GitHub](https://github.com/forwardemail)-palvelulle, ja palvelu lanseerattiin GitHub Pagesin avulla.

**Marraskuu 2017**: Sähköpostin edelleenlähetys julkaistiin virallisesti alkuperäisen julkaisun jälkeen. Varhainen versio oli puhtaasti DNS-pohjainen ilman tilin rekisteröintiä tai rekisteröitymisprosessia – se oli vain Markdownilla kirjoitettu README-tiedosto ohjeineen. Käyttäjät pystyivät määrittämään sähköpostin edelleenlähetyksen määrittämällä MX-tietueet osoittamaan `mx1.forwardemail.net` ja `mx2.forwardemail.net` ja lisäämällä TXT-tietueen `forward-email=user@gmail.com` -komennolla.

Tämän ratkaisun yksinkertaisuus ja tehokkuus herättivät merkittävien kehittäjien huomion, mukaan lukien [David Heinemeier Hansson](https://dhh.dk) (Ruby on Railsin luoja), joka jatkaa sähköpostin edelleenlähetyksen käyttöä verkkotunnuksellaan `dhh.dk`.

### 2018 - Infrastruktuuri ja integraatio {#2018---infrastructure-and-integration}

**Huhtikuu 2018**: Kun [Cloudflare](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") julkaisi [yksityisyyttä ensisijaisesti huomioiva kuluttajille suunnattu DNS-palvelu](https://blog.cloudflare.com/announcing-1111/) -palvelunsa, sähköpostin edelleenlähetyspalvelu vaihtoi [OpenDNS](https://en.wikipedia.org/wiki/OpenDNS "OpenDNS") -palvelusta [Cloudflare](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") -palveluun [DNS](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System") -hakujen käsittelyssä, mikä osoittaa yrityksen sitoutumisen yksityisyyttä suojaaviin infrastruktuurivalintoihin.

**Lokakuu 2018**: Sähköpostin edelleenlähetys mahdollisti käyttäjille "Lähetä sähköposti osoitteena" -ominaisuuden [Gmail](https://en.wikipedia.org/wiki/Gmail "Gmail") ja [Näkymät](https://en.wikipedia.org/wiki/Outlook "Outlook") -palveluissa, mikä laajensi integrointimahdollisuuksia suosittujen sähköpostipalveluntarjoajien kanssa.

### 2019 - Suorituskyvyn vallankumous {#2019---performance-revolution}

**Toukokuu 2019**: Forward Email julkaisi version 2, joka edusti merkittävää uudelleenkirjoitusta alkuperäisiin versioihin verrattuna. Tämä päivitys keskittyi [suorituskyky](https://en.wikipedia.org/wiki/Software_performance_testing "Software performance testing") parannuksiin [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js"):n [purot](https://en.wikipedia.org/wiki/Streams "Streams") -version avulla, mikä loi perustan alustan skaalautuvuudelle.

### 2020 - Tietosuoja ja tietoturva keskittyvät {#2020---privacy-and-security-focus}

**Helmikuu 2020**: Forward Email julkaisi Enhanced Privacy Protection -paketin, jonka avulla käyttäjät voivat poistaa käytöstä julkisten DNS-tietueiden asettamisen sähköpostin edelleenlähetysmääritysaliaksiensa yhteydessä. Tämän paketin avulla käyttäjän sähköpostialiasten tiedot piilotetaan julkisesti internetistä haettavilta. Yritys julkaisi myös ominaisuuden, jolla voi ottaa käyttöön tai poistaa käytöstä tiettyjä aliaksia, mutta ne voivat silti näkyä kelvollisina sähköpostiosoitteina ja palauttaa onnistuneen [SMTP-tilakoodit](https://en.wikipedia.org/wiki/List_of_SMTP_server_return_codes "List of SMTP server return codes") -koodin, jolloin sähköpostit hylätään välittömästi (samanlainen kuin tulosteen piippu [/dev/null](https://en.wikipedia.org/wiki/Null_device "Null device") -osoitteeseen).

**Huhtikuu 2020**: Kohdattuaan lukemattomia esteitä olemassa olevilla roskapostintunnistusratkaisuilla, jotka eivät kunnioittaneet Forward Emailin tietosuojakäytäntöä, yritys julkaisi roskapostiskannerin ensimmäisen alfa-version. Tämä täysin ilmainen ja avoimen lähdekoodin [roskapostin suodatus](https://en.wikipedia.org/wiki/Anti-spam_techniques "Anti-spam techniques") ratkaisu käyttää [Naiivi Bayes-roskapostisuodatin](https://en.wikipedia.org/wiki/Naive_Bayes_spam_filtering "Naive Bayes spam filtering") lähestymistapaa yhdistettynä [tietojenkalastelunesto](https://en.wikipedia.org/wiki/Phishing "Phishing") ja [IDN-homografihyökkäys](https://en.wikipedia.org/wiki/IDN_homograph_attack "IDN homograph attack") suojaukseen. Forward Email julkaisi myös [kaksivaiheinen todennus](https://en.wikipedia.org/wiki/Multi-factor_authentication "Multi-factor authentication") (2FA) käyttäen [kertakäyttöiset salasanat](https://en.wikipedia.org/wiki/One-time_password "One-time password") (OTP) -suojausta tilin turvallisuuden parantamiseksi.

**Toukokuu 2020**: Sähköpostin edelleenlähetys mahdollisti mukautetun [porttiohjaus](https://en.wikipedia.org/wiki/Port_forwarding "Port forwarding") -ominaisuuden kiertotavana, jolla käyttäjät pystyivät kiertämään [ISP](https://en.wikipedia.org/wiki/Internet_service_provider "Internet service provider") -ominaisuuden porttiestoja. Yritys julkaisi myös [Ilmainen sähköpostin edelleenlähetys RESTful-rajapinta](email-api) -ominaisuuden, joka sisältää täydellisen dokumentaation ja reaaliaikaisia pyyntö- ja vastausesimerkkejä sekä tuen webhookeille.

**Elokuu 2020**: Sähköpostin edelleenlähetystoimintoon lisättiin tuki [Todennettu vastaanotettu ketju](arc) ("ARC") sähköpostin todennusjärjestelmälle, mikä vahvisti entisestään sähköpostin tietoturvaa ja toimitettavuutta.

**23. marraskuuta 2020**: Forward Email julkaisi julkisesti beta-ohjelmansa, mikä on merkittävä virstanpylväs alustan kehityksessä.

### 2021 - Alustan modernisointi {#2021---platform-modernization}

**Helmikuu 2021**: Forward Email refaktoroi koodikantaansa poistaakseen kaikki [Python](https://en.wikipedia.org/wiki/Python_\(programming_language\) ("Python (ohjelmointikieli)") -riippuvuudet, jolloin heidän koodipinostaan tuli 100 % [JavaScript](https://en.wikipedia.org/wiki/JavaScript "JavaScript") ja [Node.js](https://en.wikipedia.org/wiki/Node.js). Tämä arkkitehtoninen päätös oli linjassa yrityksen sitoutumisen kanssa ylläpitää yhtenäistä, avoimen lähdekoodin teknologiapinoa.

**27. syyskuuta 2021**: Sähköpostin edelleenlähetys [lisätty tuki](email-forwarding-regex-pattern-filter) sähköpostin edelleenlähetysaliasten osalta vastaamaan [säännölliset lausekkeet](https://en.wikipedia.org/wiki/Regular_expression "Regular expression"), mikä tarjoaa käyttäjille kehittyneempiä sähköpostin reititysominaisuuksia.

### 2023 - Infrastruktuurin ja ominaisuuksien laajennus {#2023---infrastructure-and-feature-expansion}

**Tammikuu 2023**: Forward Email julkaisi uudelleensuunnitellun ja sivun latausnopeudelle optimoidun verkkosivuston, joka parantaa käyttökokemusta ja suorituskykyä.

**Helmikuu 2023**: Yritys lisäsi tuen [virhelokit](/faq#do-you-store-error-logs):lle ja otti käyttöön [tumma tila](https://en.wikipedia.org/wiki/Light-on-dark_color_scheme) -verkkosivuston värimaailman, joka vastaa käyttäjien mieltymyksiin ja esteettömyystarpeisiin.

**Maaliskuu 2023**: Forward Email julkaisi [Mandariini](https://github.com/forwardemail/tangerine#readme) -protokollan ja integroi sen koko infrastruktuuriinsa, mikä mahdollisti [DNS HTTPS:n kautta](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") -protokollan käytön sovellustasolla. Yritys lisäsi myös tuen [MTA-STS](/faq#do-you-support-mta-sts) -protokollalle ja vaihtoi [hCaptcha](/) -protokollasta [Cloudflare-kääntöportti](https://developers.cloudflare.com/turnstile) -protokollaan.

**Huhtikuu 2023**: Forward Email otti käyttöön ja automatisoi täysin uuden infrastruktuurin. Koko palvelu alkoi toimia globaalisti kuormituksen tasaavalla ja läheisyysperusteisella DNS:llä, jossa oli terveystarkistuksia ja vikasietoisuutta [Cloudflare](https://cloudflare.com) -palvelun avulla, korvaten aiemman round-robin DNS-lähestymistavan. Yritys siirtyi **paljaisiin metallipalvelimiin** useiden palveluntarjoajien kautta, mukaan lukien [Vultr](https://www.vultr.com/?ref=429848) ja [Digitaalinen valtameri](https://m.do.co/c/a7cecd27e071), jotka molemmat ovat SOC 2 Type 1 -yhteensopivia. MongoDB- ja Redis-tietokannat siirrettiin klusteroituihin kokoonpanoihin, joissa oli ensisijaiset ja varasolmut korkean käytettävyyden, kokonaisvaltaisen SSL-salauksen, lepotilassa tapahtuvan salauksen ja ajankohtaisen palautuksen (PITR) takaamiseksi.

**Toukokuu 2023**: Forward Email julkaisi **lähtevän SMTP-viestinnän** ominaisuutensa [sähköpostin lähettäminen SMTP:n avulla](/faq#do-you-support-sending-email-with-smtp) ja [sähköpostin lähettäminen API:n avulla](/faq#do-you-support-sending-email-with-api) pyynnöille. Tämä ominaisuus sisältää sisäänrakennettuja suojaustoimenpiteitä korkean toimitettavuuden varmistamiseksi, modernin ja vankan jonotus- ja uudelleenyritysjärjestelmän sekä [tukee reaaliaikaisia virhelokien tallentamista](/faq#do-you-store-error-logs).

**Marraskuu 2023**: Forward Email julkaisi [**salattu postilaatikon tallennus**](/blog/docs/best-quantum-safe-encrypted-email-service) -ominaisuuden [IMAP-tuki](/faq#do-you-support-receiving-email-with-imap) -palvelulle, mikä edustaa merkittävää edistysaskelta sähköpostin yksityisyyden ja turvallisuuden parantamisessa.

**Joulukuu 2023**: Yritys [lisätty tuki](/faq#do-you-support-pop3) seuraaville: [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol), [salasanat ja WebAuthn](/faq#do-you-support-passkeys-and-webauthn), [aika postilaatikkoon](/faq#i) valvonta ja [OpenPGP IMAP-tallennusta varten](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd).

### 2024 - Palvelun optimointi ja lisäominaisuudet {#2024---service-optimization-and-advanced-features}

**Helmikuu 2024**: Sähköpostin edelleenlähetys [lisätty kalenterin (CalDAV) tuki](/faq#do-you-support-calendars-caldav), joka laajentaa alustan ominaisuuksia sähköpostin ulkopuolelle kattamaan myös kalenterin synkronoinnin.

**Maaliskuu–heinäkuu 2024**: Forward Email julkaisi merkittäviä optimointeja ja parannuksia IMAP-, POP3- ja CalDAV-palveluihinsa tavoitteenaan tehdä palvelustaan yhtä nopea, ellei jopa nopeampi, kuin vaihtoehdot.

**Heinäkuu 2024**: Yritys [lisätty iOS Push -tuki](https://github.com/nodemailer/wildduck/issues/711#issuecomment-2254114016) korjasi Apple Mail on iOS:n IMAP `IDLE` -komentotuen puutteen, mikä mahdollisti reaaliaikaiset ilmoitukset Apple iOS -laitteille. Sähköpostin edelleenlähetys lisäsi myös aikaa postilaatikon ("TTI") valvontaan omassa palvelussaan ja Yahoon/AOL:ssa ja alkoi sallia käyttäjien salata koko DNS TXT -tietueensa jopa ilmaisessa paketissa. Kuten [Tietosuojaoppaiden keskustelut](https://discuss.privacyguides.net/t/forward-email-email-provider/13370) ja [GitHub-ongelmat](https://github.com/forwardemail/forwardemail.net/issues/254) pyydettiin, yritys lisäsi aliaksille ominaisuuden joko hiljaisesti hylätä `250`, pehmeästi hylätä `421` tai kovasti hylätä `550`, kun se on poistettu käytöstä.

**Elokuu 2024**: Sähköpostin edelleenlähetys lisäsi tuen postilaatikoiden viennille [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions) ja [Mbox](https://en.wikipedia.org/wiki/Mbox) -muodoissa (olemassa olevan [SQLite](https://en.wikipedia.org/wiki/SQLite) -vientimuodon lisäksi). [Webhook-allekirjoitusten tuki lisättiin](https://forwardemail.net/faq#do-you-support-bounce-webhooks), ja yritys alkoi sallia käyttäjien lähettää uutiskirjeitä, ilmoituksia ja sähköpostimarkkinointia lähtevän SMTP-palvelunsa kautta. Myös verkkotunnuskohtaiset ja aliaskohtaiset tallennuskiintiöt IMAP/POP3/CalDAV-protokollille otettiin käyttöön.

### 2025 - Jatkuvaa innovaatiota {#2025---continued-innovation}

**Syyskuusta 2024 tammikuuhun 2025**: Sähköpostin edelleenlähetys [lisätty paljon pyydetty lomavastaajatoiminto ja OpenPGP/WKD-salauksen sähköpostin edelleenlähetystä varten](https://discuss.privacyguides.net/t/forward-email-email-provider/13370/254), joka hyödyntää heidän jo toteutettuja salattuja postilaatikoiden tallennusominaisuuksia.

**21. tammikuuta 2025**: Perustajan paras ystävä "Jack", hänen uskollinen koirakumppaninsa, menehtyi rauhallisesti lähes 11-vuotiaana. Jack [tullaan aina muistamaan](https://github.com/forwardemail/forwardemail.net/commit/994ce771f0338cbe77f10bd613989e0924883f9b) hänen horjumattomasta kumppanuudestaan, joka tuki Forward Emailin luomista. [Sähköpostin edelleenlähetyksen tekninen raportti](https://forwardemail.net/technical-whitepaper.pdf) on omistettu Jackille ja tunnustaa hänen roolinsa palvelun kehittämisessä.

**Helmikuu 2025**: Forward Email vaihtoi [DataPacket](https://www.datapacket.com):n uudeksi ensisijaiseksi datakeskuspalveluntarjoajakseen ja otti käyttöön räätälöityjä, suorituskykyyn keskittyviä, bare metal -laitteistoja parantaakseen palvelun luotettavuutta ja nopeutta entisestään.

**Kesäkuu 2025**: Forward Email julkaisi tuen [CardDAV-protokolla](/faq#do-you-support-contacts-carddav) -palvelulle, laajentaen alustan ominaisuuksia kattamaan yhteystietojen synkronoinnin olemassa olevien sähköposti- ja kalenteripalveluiden rinnalla.

## Keskeiset periaatteet {#core-principles}

Perustamisestaan lähtien Forward Email on pitänyt kiinni vankasta sitoutumisestaan yksityisyyden ja turvallisuuden periaatteisiin:

**100 % avoimen lähdekoodin filosofia**: Toisin kuin kilpailijat, jotka julkaisevat avoimen lähdekoodin vain käyttöliittymänsä ja pitävät taustajärjestelmät suljettuina, Forward Email on asettanut koko koodikantansa – sekä käyttöliittymän että taustajärjestelmän – julkisesti saataville osoitteessa [GitHub](https://github.com/forwardemail).

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

<img loading="laiska" src="/img/articles/about-footer.webp" alt="" class="rounded-lg" />