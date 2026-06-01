# Tietoa Forward Emailista {#about-forward-email}

<img loading="lazy" src="/img/articles/about.webp" alt="Forward Email -tiimi ja yrityksen tarina" class="rounded-lg" />

# Tietoa Forward Emailista {#about-forward-email-1}


## Sisällysluettelo {#table-of-contents}

* [Yleiskatsaus](#overview)
* [Perustaja ja missio](#founder-and-mission)
* [Aikajana](#timeline)
  * [2017 - Perustaminen ja lanseeraus](#2017---founding-and-launch)
  * [2018 - Infrastruktuuri ja integraatio](#2018---infrastructure-and-integration)
  * [2019 - Suorituskykymurros](#2019---performance-revolution)
  * [2020 - Yksityisyys- ja turvallisuuskeskittymä](#2020---privacy-and-security-focus)
  * [2021 - Alustan modernisointi](#2021---platform-modernization)
  * [2023 - Infrastruktuurin ja ominaisuuksien laajennus](#2023---infrastructure-and-feature-expansion)
  * [2024 - Palvelun optimointi ja edistyneet ominaisuudet](#2024---service-optimization-and-advanced-features)
  * [2025 - Yksityisyyden parannukset ja protokollatuki {#2025---privacy-enhancements-and-protocol-support}](#2025---privacy-enhancements-and-protocol-support-2025---privacy-enhancements-and-protocol-support)
  * [2026 - RFC-yhteensopivuus ja edistynyt suodatus {#2026---rfc-compliance-and-advanced-filtering}](#2026---rfc-compliance-and-advanced-filtering-2026---rfc-compliance-and-advanced-filtering)
* [Keskeiset periaatteet](#core-principles)
* [Nykytila](#current-status)


## Yleiskatsaus {#overview}

> \[!TIP]
> Teknisiä yksityiskohtia arkkitehtuuristamme, turvallisuusratkaisuistamme ja tiekartastamme varten katso [Tekninen valkoinen kirja](https://forwardemail.net/technical-whitepaper.pdf).

Forward Email on [ilmainen ja avoimen lähdekoodin](https://en.wikipedia.org/wiki/Free_and_open-source "Free and open-source") [sähköpostin edelleenlähetyspalvelu](https://en.wikipedia.org/wiki/Email_forwarding "Email forwarding"), joka keskittyy käyttäjän [yksityisyyden suojaan](https://en.wikipedia.org/wiki/Right_to_privacy "Right to privacy"). Vuonna 2017 yksinkertaisena sähköpostin edelleenlähetysratkaisuna alkanut palvelu on kehittynyt kattavaksi sähköpostialustaksi, joka tarjoaa rajattomasti omia verkkotunnuksia, rajattomasti sähköpostiosoitteita ja aliaksia, rajattomasti kertakäyttöisiä sähköpostiosoitteita, roskaposti- ja tietojenkalastelusuojausta, salatun postilaatikon tallennuksen sekä lukuisia edistyneitä ominaisuuksia.

Palvelua ylläpitää ja omistaa sen alkuperäinen perustajatiimi, joka koostuu suunnittelijoista ja kehittäjistä. Se on rakennettu 100 % avoimen lähdekoodin ohjelmistoilla käyttäen [JavaScriptiä](https://en.wikipedia.org/wiki/JavaScript "JavaScript"), [Node.js:ää](https://en.wikipedia.org/wiki/Node.js "Node.js"), [DNS:ää](https://en.wikipedia.org/wiki/Domain_Name_System "Domain Name System"), [HTTPS:ää](https://en.wikipedia.org/wiki/HTTPS "HTTPS"), [TLS:ää](https://en.wikipedia.org/wiki/Transport_Layer_Security "TLS") ja [SMTP:tä](https://en.wikipedia.org/wiki/SMTP "SMTP").


## Perustaja ja missio {#founder-and-mission}

Forward Emailin perusti **Nicholas Baugh** vuonna 2017. [Forward Emailin teknisen valkoisen kirjan](https://forwardemail.net/technical-whitepaper.pdf) mukaan Baugh etsi aluksi kustannustehokasta ja yksinkertaista ratkaisua sähköpostin käyttöönottoon verkkotunnuksilleen sivuprojekteissaan. Saatuaan tietoa saatavilla olevista vaihtoehdoista hän alkoi koodata omaa ratkaisuaan ja osti verkkotunnuksen `forwardemail.net` 2. lokakuuta 2017.

Forward Emailin missio ulottuu sähköpostipalveluiden tarjoamista pidemmälle — se pyrkii muuttamaan alan lähestymistapaa sähköpostin yksityisyyteen ja turvallisuuteen. Yrityksen keskeisiä arvoja ovat läpinäkyvyys, käyttäjän hallinta ja yksityisyyden suoja teknisten toteutusten kautta, ei pelkästään politiikkalupausten avulla.


## Aikajana {#timeline}

### 2017 - Perustaminen ja lanseeraus {#2017---founding-and-launch}

**2. lokakuuta 2017**: Nicholas Baugh osti verkkotunnuksen `forwardemail.net` tutustuttuaan kustannustehokkaisiin sähköpostiratkaisuihin sivuprojektejaan varten.

**5. marraskuuta 2017**: Baugh loi 634 rivin JavaScript-tiedoston käyttäen [Node.js:ää](https://en.wikipedia.org/wiki/Node.js "Node.js") edelleenlähettääkseen sähköposteja mille tahansa omalle verkkotunnukselle. Tämä alkuperäinen toteutus julkaistiin avoimen lähdekoodin projektina [GitHubissa](https://github.com/forwardemail) ja palvelu lanseerattiin GitHub Pagesin avulla.
**Marraskuu 2017**: Forward Email julkaistiin virallisesti alkuperäisen julkaisun jälkeen. Varhainen versio perustui pelkästään DNS:ään ilman tilin rekisteröintiä tai kirjautumisprosessia—pelkkä README-tiedosto kirjoitettuna Markdownilla ohjeineen. Käyttäjät pystyivät määrittämään sähköpostin edelleenlähetyksen konfiguroimalla MX-tietueet osoittamaan `mx1.forwardemail.net` ja `mx2.forwardemail.net` -osoitteisiin sekä lisäämällä TXT-tietueen, jossa oli `forward-email=user@gmail.com`.

Ratkaisun yksinkertaisuus ja tehokkuus herättivät huomiota merkittävien kehittäjien keskuudessa, mukaan lukien [David Heinemeier Hansson](https://dhh.dk) (Ruby on Railsin luoja), joka käyttää edelleen Forward Emailia omalla `dhh.dk`-verkkotunnuksellaan tähän päivään asti.

### 2018 - Infrastruktuuri ja integraatio {#2018---infrastructure-and-integration}

**Huhtikuu 2018**: Kun [Cloudflare](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") julkaisi [yksityisyyttä korostavan kuluttajille suunnatun DNS-palvelunsa](https://blog.cloudflare.com/announcing-1111/), Forward Email vaihtoi käyttämään [Cloudflarea](https://en.wikipedia.org/wiki/Cloudflare "Cloudflare") [OpenDNS:n](https://en.wikipedia.org/wiki/OpenDNS "OpenDNS") sijaan DNS-kyselyiden käsittelyssä, osoittaen yrityksen sitoutumisen yksityisyyttä painottaviin infrastruktuurivalintoihin.

**Lokakuu 2018**: Forward Email mahdollisti käyttäjille "Lähetä sähköpostina" -toiminnon [Gmailin](https://en.wikipedia.org/wiki/Gmail "Gmail") ja [Outlookin](https://en.wikipedia.org/wiki/Outlook "Outlook") kanssa, laajentaen integraatiomahdollisuuksia suosittujen sähköpostipalveluntarjoajien kanssa.

### 2019 - Suorituskykyvallankumous {#2019---performance-revolution}

**Toukokuu 2019**: Forward Email julkaisi v2-version, joka edusti merkittävää uudelleenkirjoitusta alkuperäisistä versioista. Tämä päivitys keskittyi [suorituskyvyn](https://en.wikipedia.org/wiki/Software_performance_testing "Software performance testing") parantamiseen hyödyntämällä [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js") [streamsejä](https://en.wikipedia.org/wiki/Streams "Streams"), luoden perustan alustan skaalautuvuudelle.

### 2020 - Yksityisyys- ja turvallisuuspainotus {#2020---privacy-and-security-focus}

**Helmikuu 2020**: Forward Email julkaisi Enhanced Privacy Protection -suunnitelman, jonka avulla käyttäjät voivat poistaa julkisten DNS-tietueiden asettamisen sähköpostin edelleenlähetyksen konfigurointialiaaseille. Tämän suunnitelman kautta käyttäjän sähköpostialiaasitiedot piilotetaan julkiselta haettavuudelta internetissä. Yritys julkaisi myös ominaisuuden, jolla tietyt aliasit voidaan ottaa käyttöön tai poistaa käytöstä, mutta ne voivat silti näkyä kelvollisina sähköpostiosoitteina ja palauttaa onnistuneita [SMTP-tilakoodeja](https://en.wikipedia.org/wiki/List_of_SMTP_server_return_codes "List of SMTP server return codes"), jolloin sähköpostit hylätään välittömästi (vastaavasti kuin ohjattaessa tulostus [/dev/null](https://en.wikipedia.org/wiki/Null_device "Null device") -laitteeseen).

**Huhtikuu 2020**: Kohdatessaan lukuisia esteitä olemassa olevien roskapostintunnistusratkaisujen kanssa, jotka eivät kunnioittaneet Forward Emailin tietosuojakäytäntöä, yritys julkaisi ensimmäisen alfa-version Spam Scannerista. Tämä täysin ilmainen ja avoimen lähdekoodin [roskapostisuodatus](https://en.wikipedia.org/wiki/Anti-spam_techniques "Anti-spam techniques") -ratkaisu käyttää [Naive Bayes -roskapostisuodatinta](https://en.wikipedia.org/wiki/Naive_Bayes_spam_filtering "Naive Bayes spam filtering") yhdistettynä [phishing-suojaukseen](https://en.wikipedia.org/wiki/Phishing "Phishing") ja [IDN-homografihyökkäyssuojaukseen](https://en.wikipedia.org/wiki/IDN_homograph_attack "IDN homograph attack"). Forward Email julkaisi myös [kaksivaiheisen tunnistautumisen](https://en.wikipedia.org/wiki/Multi-factor_authentication "Multi-factor authentication") (2FA) käyttäen [kertakäyttösalasanoja](https://en.wikipedia.org/wiki/One-time_password "One-time password") (OTP) tilien turvallisuuden parantamiseksi.

**Toukokuu 2020**: Forward Email mahdollisti mukautetun [porttien edelleenlähetyksen](https://en.wikipedia.org/wiki/Port_forwarding "Port forwarding") kiertotienä käyttäjille, jotka halusivat ohittaa [ISP:n](https://en.wikipedia.org/wiki/Internet_service_provider "Internet service provider") porttien eston. Yritys julkaisi myös [Free Email Forwarding RESTful API:n](email-api) täydellisellä dokumentaatiolla ja reaaliaikaisilla pyyntö- ja vastausesimerkeillä sekä tuella webhookeille.
**Elokuu 2020**: Forward Email lisäsi tuen [Authenticated Received Chain](arc) ("ARC") -sähköpostin todennusjärjestelmälle, vahvistaen entisestään sähköpostin turvallisuutta ja toimitettavuutta.

**23. marraskuuta 2020**: Forward Email julkaistiin julkisesti beta-ohjelmansa jälkeen, mikä merkitsi merkittävää virstanpylvästä alustan kehityksessä.

### 2021 - Alustan modernisointi {#2021---platform-modernization}

**Helmikuu 2021**: Forward Email uudisti koodipohjansa poistaakseen kaikki [Python](https://en.wikipedia.org/wiki/Python_\(programming_language\) "Python (programming language)")-riippuvuudet, mahdollistaen pinon muuttumisen 100 %:sti [JavaScriptiksi](https://en.wikipedia.org/wiki/JavaScript "JavaScript") ja [Node.js:ksi](https://en.wikipedia.org/wiki/Node.js). Tämä arkkitehtoninen päätös oli linjassa yrityksen sitoutumisen kanssa ylläpitää johdonmukaista, avoimen lähdekoodin teknologiapinoa.

**27. syyskuuta 2021**: Forward Email [lisäsi tuen](email-forwarding-regex-pattern-filter) sähköpostin edelleenlähetysaliaksille, jotka vastaavat [säännöllisiä lausekkeita](https://en.wikipedia.org/wiki/Regular_expression "Regular expression"), tarjoten käyttäjille kehittyneempiä sähköpostin reititysominaisuuksia.

### 2023 - Infrastruktuurin ja ominaisuuksien laajennus {#2023---infrastructure-and-feature-expansion}

**Tammikuu 2023**: Forward Email julkaisi uudistetun ja sivunopeudeltaan optimoidun verkkosivuston, parantaen käyttäjäkokemusta ja suorituskykyä.

**Helmikuu 2023**: Yritys lisäsi tuen [virhelokeille](/faq#do-you-store-error-logs) ja otti käyttöön [tumma tila](https://en.wikipedia.org/wiki/Light-on-dark_color_scheme) -värimaailman verkkosivustolle, vastaten käyttäjien mieltymyksiin ja saavutettavuustarpeisiin.

**Maaliskuu 2023**: Forward Email julkaisi [Tangerinen](https://github.com/forwardemail/tangerine#readme) ja integroi sen koko infrastruktuuriinsa, mahdollistaen [DNS over HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") käytön sovelluskerroksessa. Yritys lisäsi myös tuen [MTA-STS:lle](/faq#do-you-support-mta-sts) ja vaihtoi [hCaptcha:sta](/) [Cloudflare Turnstileen](https://developers.cloudflare.com/turnstile).

**Huhtikuu 2023**: Forward Email toteutti ja automatisoi täysin uuden infrastruktuurin. Koko palvelu alkoi toimia maailmanlaajuisesti kuormantasatulla ja läheisyyteen perustuvalla DNS:llä, jossa on terveystarkastukset ja varajärjestelmä [Cloudflaren](https://cloudflare.com) avulla, korvaten aiemman round-robin DNS -menetelmän. Yritys siirtyi käyttämään **bare metal** -palvelimia useiden tarjoajien kautta, mukaan lukien [Vultr](https://www.vultr.com/?ref=429848) ja [Digital Ocean](https://m.do.co/c/a7cecd27e071), jotka molemmat ovat SOC 2 Type 1 -sertifioituja palveluntarjoajia. MongoDB- ja Redis-tietokannat siirrettiin klusteroituihin kokoonpanoihin, joissa on ensisijaiset ja varasolmukkeet korkean käytettävyyden, päästä päähän -SSL-salauksen, levossa olevan salauksen ja pisteaikapalautuksen (PITR) mahdollistamiseksi.

**Toukokuu 2023**: Forward Email julkaisi **lähtö-SMTP**-ominaisuutensa [sähköpostin lähettämiseen SMTP:llä](/faq#do-you-support-sending-email-with-smtp) ja [API-pyyntöjen kautta](/faq#do-you-support-sending-email-with-api). Tämä ominaisuus sisältää sisäänrakennetut turvamekanismit korkean toimitettavuuden varmistamiseksi, modernin ja vankan jonotus- ja uudelleenyritysjärjestelmän sekä [tuen virhelokeille reaaliajassa](/faq#do-you-store-error-logs).

**Marraskuu 2023**: Forward Email julkaisi [**salatun postilaatikon tallennuksen**](/blog/docs/best-quantum-safe-encrypted-email-service) ominaisuuden [IMAP-tuen](/faq#do-you-support-receiving-email-with-imap) yhteydessä, mikä edustaa merkittävää edistysaskelta sähköpostin yksityisyydessä ja turvallisuudessa.

**Joulukuu 2023**: Yritys [lisäsi tuen](/faq#do-you-support-pop3) [POP3:lle](https://en.wikipedia.org/wiki/Post_Office_Protocol), [passkeyille ja WebAuthnille](/faq#do-you-support-passkeys-and-webauthn), [saapumisajan seurantaan](/faq#i) sekä [OpenPGP:lle IMAP-tallennuksessa](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd).

### 2024 - Palvelun optimointi ja edistyneet ominaisuudet {#2024---service-optimization-and-advanced-features}

**Helmikuu 2024**: Forward Email [lisäsi kalenterituen (CalDAV)](/faq#do-you-support-calendars-caldav), laajentaen alustan kyvykkyyksiä sähköpostin lisäksi kalenterisynkronointiin.
**Maaliskuusta heinäkuuhun 2024**: Forward Email julkaisi merkittäviä optimointeja ja parannuksia IMAP-, POP3- ja CalDAV-palveluihinsa, tavoitteenaan tehdä palvelustaan yhtä nopea tai nopeampi kuin vaihtoehdot.

**Heinäkuu 2024**: Yritys [lisäsi iOS Push -tuen](https://github.com/nodemailer/wildduck/issues/711#issuecomment-2254114016) vastatakseen Apple Mailin iOS-versiosta puuttuvaan IMAP `IDLE` -komennon tukeen, mahdollistaen reaaliaikaiset ilmoitukset Apple iOS -laitteille. Forward Email lisäsi myös saapuvan postin ("TTI") seurannan omalle palvelulleen sekä Yahoo/AOL:lle, ja alkoi sallia käyttäjien salata koko DNS TXT -tietueensa myös ilmaisessa suunnitelmassa. Kuten pyydettiin [Privacy Guides -keskusteluissa](https://discuss.privacyguides.net/t/forward-email-email-provider/13370) ja [GitHub-ongelmissa](https://github.com/forwardemail/forwardemail.net/issues/254), yritys lisäsi mahdollisuuden, että aliakset voivat joko hiljaisesti hylätä `250`, pehmeästi hylätä `421` tai kovasti hylätä `550` kun ne on poistettu käytöstä.

**Elokuu 2024**: Forward Email lisäsi tuen postilaatikoiden vientiin [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions) ja [Mbox](https://en.wikipedia.org/wiki/Mbox) -muodoissa (olemassa olevan [SQLite](https://en.wikipedia.org/wiki/SQLite) vientimuodon lisäksi). [Webhook-allekirjoitustuki lisättiin](https://forwardemail.net/faq#do-you-support-bounce-webhooks), ja yritys alkoi sallia käyttäjien lähettää uutiskirjeitä, ilmoituksia ja sähköpostimarkkinointia ulospäin menevän SMTP-palvelunsa kautta. IMAP/POP3/CalDAV -palveluille toteutettiin myös koko verkkotunnuksen ja alias-kohtaiset tallennuskiintiöt.

### 2025 - Yksityisyyden parannukset ja protokollatuki {#2025---privacy-enhancements-and-protocol-support} {#2025---privacy-enhancements-and-protocol-support-2025---privacy-enhancements-and-protocol-support}

**Syyskuusta 2024 tammikuuhun 2025**: Forward Email [lisäsi erittäin toivotun lomavastaajan ominaisuuden ja OpenPGP/WKD-salauksen sähköpostin edelleenlähetykseen](https://discuss.privacyguides.net/t/forward-email-email-provider/13370/254), rakentaen jo toteutettujen salattujen postilaatikoiden tallennusmahdollisuuksien päälle.

**21. tammikuuta 2025**: Perustajan paras ystävä "Jack", hänen uskollinen koirakumppaninsa, nukkui rauhallisesti pois lähes 11 vuoden iässä. Jack [muistetaan aina](https://github.com/forwardemail/forwardemail.net/commit/994ce771f0338cbe77f10bd613989e0924883f9b) hänen horjumattomasta seurastaan, joka tuki Forward Emailin luomista. [Forward Emailin tekninen valkoinen kirja](https://forwardemail.net/technical-whitepaper.pdf) on omistettu Jackille, tunnustaen hänen roolinsa palvelun kehityksessä.

**Helmikuu 2025**: Forward Email vaihtoi uudeksi ensisijaiseksi datakeskustarjoajakseen [DataPacketin](https://www.datapacket.com), ottaen käyttöön räätälöityä, suorituskykyyn keskittyvää bare-metal-laitteistoa palvelun luotettavuuden ja nopeuden parantamiseksi.

**Maaliskuu 2025**: Forward Emailin versio 1.0 julkaistiin virallisesti.

**Huhtikuu 2025**: Ensimmäinen versio [Forward Emailin teknisestä valkoisesta kirjasta](https://forwardemail.net/technical-whitepaper.pdf) julkaistiin, ja yritys alkoi hyväksyä kryptovaluuttamaksuja.

**Toukokuu 2025**: Palvelu julkaisi uuden API-dokumentaation käyttäen [Scalar](https://github.com/scalar/scalar) -työkalua.

**Kesäkuu 2025**: Forward Email julkaisi tuen [CardDAV-protokollalle](/faq#do-you-support-contacts-carddav), laajentaen alustan kykyjä sisältämään yhteystietojen synkronoinnin sähköpostin ja kalenteripalveluiden lisäksi.

**Elokuu 2025**: Alusta lisäsi [CalDAV VTODO/tehtävät -tuet](https://en.wikipedia.org/wiki/ICalendar#To-do_\(VTODO\)), mahdollistaen tehtävien hallinnan kalenteritapahtumien rinnalla.

**Marraskuu 2025**: Alustan turvallisuutta parannettiin siirtymällä PBKDF2:sta [Argon2id](https://en.wikipedia.org/wiki/Argon2) -salasanahajautukseen, ja infrastruktuuri siirrettiin Redisistä [Valkeyhin](https://github.com/valkey-io/valkey).

**Joulukuu 2025**: Versio 2.0 julkaistiin, tuoden mukanaan [REQUIRETLS (RFC 8689)](/rfc#requiretls-support) -tuet pakotetulle TLS-salaukselle sähköpostin siirrossa sekä päivityksen [OpenPGP.js](https://github.com/openpgpjs/openpgpjs) versioon 6.
### 2026 - RFC-yhteensopivuus ja edistynyt suodatus {#2026---rfc-compliance-and-advanced-filtering} {#2026---rfc-compliance-and-advanced-filtering-2026---rfc-compliance-and-advanced-filtering}

**Tammikuu 2026**: Forward Email julkaisi kattavan [RFC-protokollan yhteensopivuusasiakirjan](/blog/docs/email-protocols-rfc-compliance-imap-smtp-pop3-comparison) ja lisäsi tuen [S/MIME-salaukselle (RFC 8551)](/faq#do-you-support-smime-encryption) sekä kattavalle [Sieve-sähköpostisuodatukselle (RFC 5228)](/faq#do-you-support-sieve-email-filtering) [ManageSieve-protokollan (RFC 5804)](/faq#do-you-support-sieve-email-filtering) tuella. REST API laajeni myös 39 päätepisteeseen.

**Helmikuu 2026**: Virallinen, avoimen lähdekoodin webmail-asiakas julkaistiin osoitteessa [mail.forwardemail.net](https://mail.forwardemail.net) ([lähdekoodi GitHubissa](https://github.com/forwardemail/mail.forwardemail.net)). Alusta lisäsi myös tuen [CalDAV-aikataululaajennuksille (RFC 6638)](https://www.rfc-editor.org/rfc/rfc6638), [DANE/TLSA:lle (RFC 6698)](https://en.wikipedia.org/wiki/DNS-based_Authentication_of_Named_Entities) ja [Domain Connectille](https://domainconnect.org) yhden klikkauksen DNS-asetuksissa. Reaaliaikaiset push-ilmoitukset IMAPille, CalDAVille ja CardDAVille otettiin käyttöön WebSocketien avulla.

**Maaliskuu 2026**: Tuki verkkotunnaskohtaiselle mukautetulle S3-yhteensopivalle tallennustilalle lisättiin, samoin kuin komentorivityökalu hallintaan. Työ aloitettiin monialustaisiin työpöytä- ja mobiilisovelluksiin macOS:lle, Windowsille, Linuxille, iOS:lle ja Androidille käyttäen samaa avoimen lähdekoodin webmail-koodipohjaa, rakennettuna [Tauri](https://tauri.app) -työkalulla.


## Perusperiaatteet {#core-principles}

Perustamisestaan lähtien Forward Email on pitänyt tiukasti kiinni yksityisyyden ja turvallisuuden periaatteista:

**100 % avoimen lähdekoodin filosofia**: Toisin kuin kilpailijat, jotka julkaisevat vain käyttöliittymänsä avoimena lähdekoodina ja pitävät taustajärjestelmän suljettuna, Forward Email on tehnyt koko koodikantansa—sekä käyttöliittymän että taustajärjestelmän—julkisesti tarkasteltavaksi [GitHubissa](https://github.com/forwardemail).

**Yksityisyys ensin -suunnittelu**: Alusta alkaen Forward Email on käyttänyt ainutlaatuista muistissa tapahtuvaa käsittelytapaa, joka välttää sähköpostien tallentamisen levylle, erottaen sen perinteisistä sähköpostipalveluista, jotka tallentavat viestit tietokantoihin tai tiedostojärjestelmiin.

**Jatkuva innovaatio**: Palvelu on kehittynyt yksinkertaisesta sähköpostin edelleenlähetyksestä kattavaksi sähköpostialustaksi, joka sisältää ominaisuuksia kuten salatut postilaatikot, kvanttivarmuuden tarjoavan salauksen sekä tuen standardiprotokollille kuten SMTP, IMAP, POP3 ja CalDAV.

**Läpinäkyvyys**: Kaikki koodi on avoimesti saatavilla ja tarkasteltavissa, mikä takaa käyttäjille mahdollisuuden varmistaa yksityisyysväitteet pelkän markkinointipuheen sijaan.

**Käyttäjän hallinta**: Käyttäjille tarjotaan valinnanvapautta, mukaan lukien mahdollisuus itse isännöidä koko alustaa halutessaan.


## Nykytila {#current-status}

Maaliskuuhun 2026 mennessä Forward Email palvelee yli 500 000 verkkotunnusta maailmanlaajuisesti, mukaan lukien merkittäviä organisaatioita ja alan johtajia kuten:

* **Teknologiayritykset**: Canonical (Ubuntu), Netflix Games, The Linux Foundation, The PHP Foundation, jQuery, LineageOS
* **Mediayritykset**: Fox News Radio, Disney Ad Sales
* **Koulutuslaitokset**: Cambridgen yliopisto, Marylandin yliopisto, Washingtonin yliopisto, Tuftsin yliopisto, Swarthmore College
* **Julkiset tahot**: Etelä-Australian hallitus, Dominikaanisen tasavallan hallitus
* **Muut organisaatiot**: RCD Hotels, Fly<span>.</span>io
* **Merkittävät kehittäjät**: Isaac Z. Schlueter (npm:n luoja), David Heinemeier Hansson (Ruby on Railsin luoja)

Alusta kehittyy jatkuvasti säännöllisten ominaisuusjulkaisujen ja infrastruktuurin parannusten myötä, säilyttäen asemansa ainoana 100 % avoimen lähdekoodin, salatun, yksityisyyteen keskittyvän, läpinäkyvän ja kvanttivarmuuden tarjoavan sähköpostipalveluna tänä päivänä.

<img loading="lazy" src="/img/articles/about-footer.webp" alt="Forward Email yksityisyyteen keskittyvä sähköpostipalvelu" class="rounded-lg" />
