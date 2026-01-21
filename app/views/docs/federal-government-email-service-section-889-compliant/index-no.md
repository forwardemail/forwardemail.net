# Videresend e-post: Din løsning for videresending av e-post i samsvar med paragraf 889 {#forward-email-your-section-889-compliant-email-forwarding-solution}

<img loading="lazy" src="/img/articles/federal.webp" alt="Federal government email service Section 889 compliant" class="rounded-lg" />

## Innholdsfortegnelse {#table-of-contents}

* [Forord](#foreword)
* [Forstå samsvar med paragraf 889](#understanding-section-889-compliance)
* [Hvordan videresendt e-post oppnår samsvar med paragraf 889](#how-forward-email-achieves-section-889-compliance)
  * [Cloudflares forpliktelse](#cloudflares-commitment)
  * [DataPackets infrastruktur](#datapackets-infrastructure)
* [Utover paragraf 889: Bredere samsvar fra myndighetene](#beyond-section-889-broader-government-compliance)
* [Vår vei videre: Utvidelse av samsvarshorisonter](#our-path-forward-expanding-compliance-horizons)
* [Hvorfor dette er viktig for deg](#why-this-matters-for-you)
* [Sikker og kompatibel videresending av e-post starter her](#secure-compliant-email-forwarding-starts-here)
* [Referanser](#references)

## Forord {#foreword}

Hos Forward Email tror vi på enkel, sikker og privat videresending av e-post for alle. Vi vet at for mange organisasjoner, spesielt de som jobber med den amerikanske regjeringen, er samsvar ikke bare et moteord – det er en nødvendighet. Det er avgjørende å sikre overholdelse av **føderale forskrifter for e-post**. Derfor er vi stolte av å bekrefte at vår **sikre e-postvideresendingstjeneste** er bygget for å oppfylle strenge føderale krav, inkludert [Seksjon 889](https://www.acquisition.gov/Section-889-Policies) av [Lov om nasjonal forsvarsautorisasjon (NDAA)](https://en.wikipedia.org/wiki/National_Defense_Authorization_Act).

Vår forpliktelse til **samsvar med myndighetenes e-postregler** ble nylig omsatt i praksis da **US Naval Academy** henvendte seg til **Forward Email**. De krevde **sikre e-postvideresendingstjenester** og dokumentasjon som bekreftet at vi overholdt føderale forskrifter, inkludert **samsvar med paragraf 889**. Denne erfaringen fungerer som en verdifull casestudie, og demonstrerer vår beredskap og evne til å støtte statlig finansierte organisasjoner og oppfylle deres strenge krav. Denne forpliktelsen gjelder for alle våre brukere som søker en pålitelig, **personvernfokusert e-postløsning**.

## Forstå samsvar med paragraf 889 {#understanding-section-889-compliance}

Hva er paragraf 889? Enkelt sagt er det en amerikansk føderal lov som forbyr offentlige etater å bruke eller inngå kontrakter med enheter som bruker visse typer telekommunikasjons- og videoovervåkingsutstyr eller -tjenester fra bestemte selskaper (som Huawei, ZTE, Hikvision, Dahua og Hytera). Denne regelen, ofte assosiert med **Huawei-forbudet** og **ZTE-forbudet**, bidrar til å beskytte nasjonal sikkerhet.

> \[!NOTE]
> Paragraf 889 retter seg spesifikt mot utstyr og tjenester fra Huawei, ZTE, Hytera, Hikvision og Dahua, inkludert deres datterselskaper og tilknyttede selskaper.

For en **tjeneste for videresending av e-post for offentlige kontrakter** som **Videresend e-post**, betyr dette at ingen av våre underliggende infrastrukturleverandører bruker dette forbudte utstyret, noe som gjør oss i samsvar med **paragraf 889**.

## Hvordan videresendt e-post oppnår samsvar med paragraf 889 {#how-forward-email-achieves-section-889-compliance}

Så, **hvordan er Videresendt E-post i samsvar med Seksjon 889?** Vi oppnår dette gjennom nøye utvalg av våre infrastrukturpartnere. **Videresendt E-post** er utelukkende avhengig av to nøkkelleverandører for sin **Seksjon 889-kompatible infrastruktur**:

1. **[Cloudflare](https://www.cloudflare.com/):** Vår primære partner for nettverkstjenester og **Cloudflare e-postsikkerhet**.

2. **[Datapakke](https://datapacket.com/):** Vår primære leverandør for serverinfrastruktur (vi bruker [Digitalt hav](https://www.digitalocean.com/) og/eller [Vultr](https://www.vultr.com/) for failover og vil snart gå over til utelukkende å bruke DataPacket – vi bekreftet selvfølgelig samsvar med paragraf 889 skriftlig fra begge disse failover-leverandørene).

> \[!IMPORTANT]
> Vår utelukkende avhengighet av Cloudflare og DataPacket, som ikke bruker utstyr som er forbudt i henhold til paragraf 889, er hjørnesteinen i vår overholdelse av regelverket.

Både [Cloudflare](https://www.cloudflare.com/) og [Datapakke](https://datapacket.com/) er forpliktet til høye sikkerhetsstandarder og bruker ikke utstyr som er forbudt i henhold til paragraf 889. **Bruk av Cloudflare og DataPacket for samsvar med paragraf 889** er grunnleggende for tjenesten vår.

### Cloudflares forpliktelse {#cloudflares-commitment}

[Cloudflare](https://www.cloudflare.com/) tar eksplisitt opp **samsvar med paragraf 889** i sin **[Tredjeparts etiske retningslinjer](https://cf-assets.www.cloudflare.com/slt3lc6tev37/284hiWkCYNc49GQpAeBvGN/e137cdac96d1c4cd403c6b525831d284/Third_Party_Code_of_Conduct.pdf)**. De oppgir:

> «I henhold til paragraf 889 i den nasjonale forsvarsautorisasjonsloven (NDAA) bruker ikke Cloudflare, eller tillater på annen måte i sin forsyningskjede, telekommunikasjonsutstyr, videoovervåkingsprodukter eller -tjenester produsert eller levert av Huawei Technologies Company, ZTE Corporation, Hytera Communications Corporation, Hangzhou Hikvision Digital Technology Company eller Dahua Technology Company (eller datterselskaper eller tilknyttede selskaper av slike enheter).»

*(Kilde: Cloudflares tredjeparts etiske retningslinjer, hentet 29. april 2025)*

Denne klare uttalelsen bekrefter at [Cloudflares](https://www.cloudflare.com/)-infrastrukturen, som **Videresendt e-post** benytter seg av, oppfyller kravene i paragraf 889.

### DataPackets infrastruktur {#datapackets-infrastructure}

[Datapakke](https://datapacket.com/), vår serverleverandør, bruker nettverksutstyr utelukkende fra **Arista Networks** og **Cisco**. Verken Arista eller Cisco er blant selskapene som er forbudt i henhold til paragraf 889. Begge er etablerte leverandører som er mye brukt i sikre bedrifts- og myndighetsmiljøer, kjent for å overholde strenge sikkerhets- og samsvarsstandarder.

Ved å kun bruke [Cloudflare](https://www.cloudflare.com/) og [Datapakke](https://datapacket.com/), sikrer **Videresend e-post** at hele tjenesteleveringskjeden er fri for utstyr som er forbudt i henhold til paragraf 889, og gir **sikker videresending av e-post for føderale etater** og andre sikkerhetsbevisste brukere.

## Utover paragraf 889: Bredere samsvar med myndighetene {#beyond-section-889-broader-government-compliance}

Vår forpliktelse til **myndighetenes e-postsikkerhet** og samsvar med regelverket strekker seg utover paragraf 889. Selv om **Videresend e-post** i seg selv ikke direkte behandler eller lagrer sensitive myndighetsdata som [Kontrollert uklassifisert informasjon (CUI)](https://en.wikipedia.org/wiki/Controlled_Unclassified_Information) på samme måte som en stor SaaS-plattform ville gjort, er vår **åpen kildekode-arkitektur for videresending av e-post** og avhengigheten av sikre, kompatible leverandører i samsvar med prinsippene i andre viktige forskrifter:

* **[FAR (føderal anskaffelsesforskrift)](https://en.wikipedia.org/wiki/Federal_Acquisition_Regulation):** Ved å bruke kompatibel infrastruktur og tilby en enkel kommersiell tjeneste, tilbyr vi **FAR-kompatible e-postvideresendingsprinsipper** som er egnet for offentlige leverandører.
* **Personvernerklæringen og [FISMA](https://en.wikipedia.org/wiki/Federal_Information_Security_Management_Act_of\_2002):** Vi er **personvernfokuserte** av design, og tilbyr **Privacy Act-e-postprinsipper**. Vi lagrer ikke e-postene dine. E-poster videresendes direkte, noe som minimerer datahåndtering. Våre infrastrukturleverandører ([Cloudflare](https://www.cloudflare.com/), [Datapakke](https://datapacket.com/)) administrerer systemene sine i henhold til høye sikkerhetsstandarder som er i samsvar med **FISMA-kompatible e-postprinsipper**.
* **[HIPAA](https://en.wikipedia.org/wiki/Health_Insurance_Portability_and_Accountability_Act):** For organisasjoner som trenger **HIPAA-kompatibel e-postvideresending**, kan **Videresending av e-post** være en del av en kompatibel løsning. Siden vi ikke lagrer e-poster, ligger det primære samsvarsansvaret hos sluttpunkts-e-postsystemene. Vårt sikre transportlag støtter imidlertid HIPAA-krav når det brukes riktig.

> \[!WARNING]
> En [Avtale for forretningspartnere (BAA)](https://en.wikipedia.org/wiki/Business_associate_agreement) kan være nødvendig hos din endelige e-postleverandør, ikke selve **Videresend e-post**, ettersom vi ikke lagrer e-postinnholdet ditt (med mindre du bruker [vårt krypterte IMAP/POP3-lagringslag](/blog/docs/best-quantum-safe-encrypted-email-service)).

## Vår vei videre: Utvidelse av samsvarshorisonter {#our-path-forward-expanding-compliance-horizons}

Selv om vår samsvarsbestemmelser for paragraf 889 gir et avgjørende grunnlag, spesielt for føderale kontraktører, forstår vi at ulike organisasjoner og offentlige etater har ulike og utviklende regulatoriske behov. Hos **Videresend e-post** er åpenhet nøkkelen, og vi ønsker å dele vårt perspektiv på det bredere samsvarslandskapet og vår fremtidige retning.

Vi erkjenner viktigheten av rammeverk og regelverk som:

* **[System for tildelingshåndtering (SAM)](https://sam.gov/):** Essensielt for direkte føderal kontraktering.
* **[FAR (føderal anskaffelsesforskrift)](https://www.acquisition.gov/browse/index/far):** Inkluderer standardklausuler som [FAR 52.212-4](https://www.acquisition.gov/far/52.212-4) for kommersielle tjenester.
* **[DFARS (Tillegg til forsvarets føderale anskaffelsesforskrift)](https://en.wikipedia.org/wiki/Defense_Federal_Acquisition_Regulation_Supplement):** Spesielt [DFARS 252.239-7010](https://www.acquisition.gov/dfars/252.239-7010-cloud-computing-services.) for DoD-skytjenester.
* **[CMMC (sertifisering for modenhetsmodell for cybersikkerhet)](https://en.wikipedia.org/wiki/Cybersecurity_Maturity_Model_Certification):** Kreves for DoD-kontraktører som håndterer [Føderal kontraktsinformasjon (FCI)](https://en.wikipedia.org/wiki/Federal_Contract_Information) eller CUI.
* **[NIST SP 800-171](https://csrc.nist.gov/pubs/sp/800/171/r3/final):** Grunnlaget for CMMC nivå 2, fokusert på å beskytte CUI. ([NIST](https://en.wikipedia.org/wiki/National_Institute_of_Standards_and_Technology) - National Institute of Standards and Technology)
* **[FedRAMP (føderalt program for risiko- og autorisasjonsstyring)](https://en.wikipedia.org/wiki/FedRAMP):** Standarden for skytjenester som brukes av føderale etater.
* **__PROTECTED_LINK_77__0:** Det overordnede rammeverket for føderal informasjonssikkerhet.
* **__PROTECTED_LINK_77__1:** For håndtering av beskyttet helseinformasjon (PHI).

* **__PROTECTED_LINK_77__1:** For håndtering av beskyttet helseinformasjon (PHI). * **__PROTECTED_LINK_77__2:** For å beskytte elevenes utdanningsjournaler.
* **__PROTECTED_LINK_77__3:** For tjenester som omhandler barn under 13 år.

**Vår nåværende posisjon og fremtidige mål:**

**Videresend e-post** sitt kjernedesign – å være **personvernfokusert**, **åpen kildekode** og minimere datahåndtering (spesielt i vår grunnleggende **e-postvideresendingstjeneste**) – samsvarer godt med *prinsippene* bak mange av disse forskriftene. Våre eksisterende sikkerhetspraksiser (kryptering, støtte for moderne e-poststandarder) og samsvar med paragraf 889 gir et sterkt utgangspunkt.

Det er imidlertid en betydelig oppgave å oppnå formell sertifisering eller autorisasjon for rammeverk som **FedRAMP** eller **CMMC**. Det innebærer grundig dokumentasjon, implementering av spesifikke tekniske og prosedyremessige kontroller (ofte hundrevis av dem), uavhengige vurderinger (som [3PAO](https://www.fedramp.gov/glossary/#3pao) for FedRAMP – tredjeparts vurderingsorganisasjon) og kontinuerlig overvåking.

> \[!IMPORTANT]
> Samsvar handler ikke bare om teknologi; det handler om dokumenterte prosesser, retningslinjer og kontinuerlig årvåkenhet. Å oppnå sertifiseringer som FedRAMP eller CMMC krever betydelige investeringer og tid.

**Vår forpliktelse:**

Etter hvert som **Videresendt e-post** vokser og kundenes behov utvikler seg, er vi forpliktet til å utforske og forfølge relevante samsvarssertifiseringer. Dette inkluderer planer for:

1. **SAM-registrering:** For å legge til rette for direkte samarbeid med amerikanske føderale etater.

2. **Formalisering av prosesser:** Forbedring av vår interne dokumentasjon og prosedyrer for å samsvare med standarder som NIST SP 800-171, som danner grunnlaget for CMMC.

3. **Evaluering av FedRAMP-tiltak:** Vurdering av kravene og gjennomførbarheten av å søke FedRAMP-autorisasjon, sannsynligvis startende med en lav eller moderat grunnlinje, potensielt utnyttelse av [TO-SaaS](https://www.fedramp.gov/blog/fedramp-releases-low-impact-saas-baseline/)-modellen der det er aktuelt.

4. **Støtte spesifikke behov:** Håndtering av krav som HIPAA (potensielt gjennom BAA-er og spesifikke konfigurasjoner for lagrede data) og FERPA (gjennom passende kontraktsvilkår og kontroller) etter hvert som vi samarbeider mer med helse- og utdanningsinstitusjoner.

Denne reisen krever nøye planlegging og investeringer. Selv om vi ikke har umiddelbare tidslinjer for alle sertifiseringer, er det en viktig del av vår plan å styrke vår samsvarsposisjon for å møte behovene til myndigheter og regulerte industrier.

> \[!NOTE]
> Vi tror at vår **åpen kildekode**-natur gir unik åpenhet gjennom hele denne prosessen, slik at fellesskapet og kundene våre kan se vår forpliktelse på nært hold.

Vi vil fortsette å oppdatere fellesskapet vårt etter hvert som vi når viktige milepæler på vår compliance-reise.

## Hvorfor dette er viktig for deg {#why-this-matters-for-you}

Å velge en **Seksjon 889-kompatibel e-postvideresendingstjeneste** som **Videresend e-post** betyr:

* **Sinnesro:** Spesielt for offentlige etater, entreprenører og sikkerhetsbevisste organisasjoner.
* **Redusert risiko:** Unngår potensielle konflikter med **føderale forskrifter for e-post**.
* **Tillit:** Viser en forpliktelse til sikkerhet og integritet i forsyningskjeden.

**Videresend e-post** gir en enkel, pålitelig og *kompatibel* måte å administrere dine behov for **videresending av e-post** for det tilpassede domenet ditt.

## Sikker og kompatibel videresending av e-post starter her {#secure-compliant-email-forwarding-starts-here}

**Videresend e-post** er dedikert til å tilby en **sikker, privat og åpen kildekode-tjeneste for videresending av e-post**. Vår **samsvar med paragraf 889**, oppnådd gjennom vårt partnerskap med [Cloudflare](https://www.cloudflare.com/) og [Datapakke](https://datapacket.com/) (som gjenspeiler vårt **samsvar med videresending av e-post for US Naval Academy**), er et bevis på denne forpliktelsen. Enten du er en offentlig enhet, en entreprenør eller bare verdsetter **sikkerhet for offentlig e-post**, er **Videresend e-post** bygget for deg.

Klar for **sikker, kompatibel videresending av e-post**? [Registrer deg gratis i dag!](https://forwardemail.net)

## Referanser {#references}

* **Avsnitt 889 (NDAA):** <https://www.acquisition.gov/Section-889-Policies>
* **Cloudflare:** <https://www.cloudflare.com/>
* **Cloudflares tredjeparts etiske retningslinjer:** <https://cf-assets.www.cloudflare.com/slt3lc6tev37/284hiWkCYNc49GQpAeBvGN/e137cdac96d1c4cd403c6b525831d284/Third_Party_Code_of_Conduct.pdf>
* **Datapakke:** <https://datapacket.com/>
* **System for tildelingshåndtering (SAM):** <https://sam.gov/>
* **Forbundsforskrift om anskaffelse (FAR):** <https://www.acquisition.gov/browse/index/far>
* **FAR 52.212-4:** <https://www.acquisition.gov/far/52.212-4>
* **Tillegg til forsvarsforskrift om føderal anskaffelse (DFARS):** <https://www.acquisition.gov/dfars>
* **DFARS 252.239-7010:** <https://www.acquisition.gov/dfars/252.239-7010-cloud-computing-services.>
* **Sertifisering av modenhetsmodell for nettsikkerhet (CMMC):** <https://dodcio.defense.gov/cmmc/About/>
* **NIST SP 800-171:** <https://www.cloudflare.com/>0
* **Federalt program for risiko- og autorisasjonshåndtering (FedRAMP):** <https://www.cloudflare.com/>1
* **Federal lov om modernisering av informasjonssikkerhet (FISMA):** <https://www.cloudflare.com/>2
* **Lov om helseforsikringsportabilitet og ansvarlighet (HIPAA):** <https://www.cloudflare.com/>3
* **Lov om familierettigheter og personvern i utdanning (FERPA):** <https://www.cloudflare.com/>4
* **Lov om beskyttelse av barns personvern på nett (COPPA):** <https://www.cloudflare.com/>5