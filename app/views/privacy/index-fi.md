# Tietosuojakäytäntö {#privacy-policy}

<img loading="lazy" src="/img/articles/privacy.webp" alt="Forward Email privacy policy" class="rounded-lg" />

## Sisällysluettelo {#table-of-contents}

* [Vastuuvapauslauseke](#disclaimer)
* [Tietoja ei kerätä](#information-not-collected)
* [Kerätyt tiedot](#information-collected)
* [Jaetut tiedot](#information-shared)
* [Tietojen poistaminen](#information-removal)
* [Lisätiedot](#additional-disclosures)

## Vastuuvapauslauseke {#disclaimer}

Ole hyvä ja noudata [Ehdot](/terms) -asetustamme, koska se koskee koko sivustoa.

## Tietoja ei kerätty {#information-not-collected}

**Lukuun ottamatta [virheet](/faq#do-you-store-error-logs):aa ja [lähtevät SMTP-sähköpostit](/faq#do-you-support-sending-email-with-smtp):ää ja/tai roskapostin tai haitallisen toiminnan havaitsemista (esim. lähetysnopeuden rajoittamiseksi):**

* Emme tallenna edelleenlähetettyjä sähköposteja levylle emmekä tietokantoihin.
* Emme tallenna sähköposteja koskevia metatietoja levylle emmekä tietokantoihin.
* Emme tallenna lokeja tai IP-osoitteita levylle emmekä tietokantoihin.

## Kerätyt tiedot {#information-collected}

Läpinäkyvyyden vuoksi voit milloin tahansa <a href="https://github.com/forwardemail" target="_blank" rel="noopener noreferrer">tarkastella lähdekoodiamme</a> ja nähdä, miten alla olevia tietoja kerätään ja käytetään:

**Toimivuuden varmistamiseksi ja palvelumme parantamiseksi keräämme ja tallennamme turvallisesti seuraavat tiedot:**

* Tallennamme sähköpostit ja kalenteritiedot [salattu SQLite-tietokanta](/blog/docs/best-quantum-safe-encrypted-email-service)-tallennustilaan ainoastaan IMAP/POP3/CalDAV/CardDAV-käyttöoikeuttasi ja postilaatikkotoimintojasi varten.
* Huomaa, että jos käytät vain sähköpostin edelleenlähetyspalveluitamme, sähköposteja ei tallenneta levylle tai tietokantaan, kuten [Tietoja ei kerätä](#information-not-collected)-tallennustilassa on kuvattu.
* Sähköpostin edelleenlähetyspalvelumme toimivat vain muistissa (ei kirjoitusta levylle tai tietokantoihin).
* IMAP/POP3/CalDAV/CardDAV-tallennustila salataan levossa ja siirron aikana, ja se tallennetaan LUKS-salatulle levylle.
* IMAP/POP3/CalDAV/CardDAV-tallennustilan varmuuskopiot salataan levossa ja siirron aikana, ja ne tallennetaan [Cloudflare R2](https://www.cloudflare.com/developer-platform/r2/)-tallennustilaan.
* Tallennamme evästeen istuntoon verkkosivustosi liikennettä varten.
* Tallennamme meille antamasi sähköpostiosoitteen.
* Tallennamme meille antamasi verkkotunnukset, aliakset ja määritykset. * Säilytämme `4xx`- ja `5xx`-SMTP-vastauskoodit [virhelokit](/faq#do-you-store-error-logs) 7 päivän ajan.
* Säilytämme [lähtevät SMTP-sähköpostit](/faq#do-you-support-sending-email-with-smtp)-koodia ~30 päivän ajan.
* Tämä pituus vaihtelee "Date"-otsikon mukaan, koska sallimme sähköpostien lähettämisen tulevaisuudessa, jos tuleva "Date"-otsikko on olemassa.
* **Huomaa, että kun sähköposti on toimitettu onnistuneesti tai siinä on pysyvä virhe, sensuroimme ja tyhjennämme viestin rungon.**
* Jos haluat määrittää lähtevän SMTP-sähköpostiviestisi rungon säilytettäväksi pidempään kuin oletusarvoinen 0 päivää (onnistuneen toimituksen tai pysyvän virheen jälkeen), siirry verkkotunnuksesi lisäasetuksiin ja anna arvo väliltä `0` ja `30`.
* Jotkut käyttäjät käyttävät mielellään [Oma tili > Sähköpostit](/my-account/emails)-esikatselutoimintoa nähdäkseen, miten heidän sähköpostinsa renderöidään, joten tuemme määritettävää säilytysaikaa.
* Huomaa, että tuemme myös __PROTECTED_LINK_30__0-koodia. * Kaikki lisätiedot, jotka annat meille vapaaehtoisesti, kuten sähköpostitse tai <a href="/help">ohjesivullamme</a> lähettämäsi kommentit tai kysymykset.

## Jaetut tiedot {#information-shared}

Emme jaa tietojasi kolmansille osapuolille. Emme myöskään käytä kolmannen osapuolen analytiikka- tai telemetriaohjelmistopalveluita.

Meidän on ehkä noudatettava ja noudatammekin tuomioistuimen määräämiä oikeudellisia pyyntöjä (mutta muista [Emme kerää yllä kohdassa "Tietoja ei kerätä" mainittuja tietoja.](#information-not-collected), joten emme voi aluksi toimittaa sitä).

## Tietojen poisto {#information-removal}

Jos haluat milloin tahansa poistaa meille antamiasi tietoja, siirry kohtaan <a href="/my-account/security">Oma tili > Tietoturva</a> ja napsauta "Poista tili".

Väärinkäytösten estämiseksi ja vähentämiseksi tilisi poistaminen manuaalisesti saatetaan tarkistaa järjestelmänvalvojien toimesta, jos poistat sen viiden päivän kuluessa ensimmäisestä maksustasi.

Tämä prosessi kestää yleensä alle 24 tuntia, ja se otettiin käyttöön, koska käyttäjät lähettivät roskapostia palveluumme ja poistivat sitten tilinsä nopeasti – mikä esti meitä estämästä heidän maksutapansa sormenjälkeä/sormenjälkiä Stripessä.

## Lisätiedot {#additional-disclosures}

Tämä sivusto on suojattu Cloudflaren avulla, ja sen [Tietosuojakäytäntö](https://www.cloudflare.com/privacypolicy/)- ja [Palveluehdot](https://www.cloudflare.com/website-terms/)-ominaisuudet ovat voimassa.