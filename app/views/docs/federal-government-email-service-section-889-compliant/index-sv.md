# Forward Email: Din Section 889-kompatibla lösning för e-postvidarebefordran {#forward-email-your-section-889-compliant-email-forwarding-solution}

<img loading="lazy" src="/img/articles/federal.webp" alt="Federal government email service Section 889 compliant" class="rounded-lg" />


## Innehållsförteckning {#table-of-contents}

* [Förord](#foreword)
* [Förstå Section 889-efterlevnad](#understanding-section-889-compliance)
* [Hur Forward Email uppnår Section 889-efterlevnad](#how-forward-email-achieves-section-889-compliance)
  * [Cloudflares engagemang](#cloudflares-commitment)
  * [DataPackets infrastruktur](#datapackets-infrastructure)
* [Utöver Section 889: Bredare myndighetsefterlevnad](#beyond-section-889-broader-government-compliance)
* [Vår väg framåt: Utvidgade efterlevnadshorisonter](#our-path-forward-expanding-compliance-horizons)
* [Varför detta är viktigt för dig](#why-this-matters-for-you)
* [Säker, kompatibel e-postvidarebefordran börjar här](#secure-compliant-email-forwarding-starts-here)
* [Referenser](#references)


## Förord {#foreword}

På Forward Email tror vi på enkel, säker och privat e-postvidarebefordran för alla. Vi vet att för många organisationer, särskilt de som arbetar med den amerikanska regeringen, är efterlevnad inte bara ett modeord – det är en nödvändighet. Att säkerställa efterlevnad av **federala regler för e-post** är avgörande. Därför är vi stolta över att kunna bekräfta att vår **säkra e-postvidarebefordran** är byggd för att uppfylla strikta federala krav, inklusive [Section 889](https://www.acquisition.gov/Section-889-Policies) i [National Defense Authorization Act (NDAA)](https://en.wikipedia.org/wiki/National_Defense_Authorization_Act).

Vårt engagemang för **myndighetskompatibel e-post** sattes nyligen på prov när **US Naval Academy** kontaktade **Forward Email**. De behövde **säker e-postvidarebefordran** och dokumentation som bekräftade vår efterlevnad av federala regler, inklusive **Section 889-efterlevnad**. Denna erfarenhet fungerar som en värdefull fallstudie som visar vår beredskap och förmåga att stödja myndighetsfinansierade organisationer och uppfylla deras strikta krav. Detta engagemang gäller alla våra användare som söker en pålitlig, **integritetsfokuserad e-post**-lösning.


## Förstå Section 889-efterlevnad {#understanding-section-889-compliance}

Vad är Section 889? Enkelt uttryckt är det en amerikansk federal lag som förbjuder myndigheter att använda eller kontraktera med enheter som använder viss telekommunikations- och videosäkerhetsutrustning eller tjänster från specifika företag (som Huawei, ZTE, Hikvision, Dahua och Hytera). Denna regel, ofta kopplad till **Huawei-förbudet** och **ZTE-förbudet**, hjälper till att skydda nationell säkerhet.

> \[!NOTE]
> Section 889 riktar sig specifikt mot utrustning och tjänster från Huawei, ZTE, Hytera, Hikvision och Dahua, inklusive deras dotterbolag och närstående företag.

För en **e-postvidarebefordranstjänst för myndighetskontrakt** som **Forward Email** innebär detta att säkerställa att ingen av våra underliggande infrastrukturleverantörer använder denna förbjudna utrustning, vilket gör oss **Section 889-kompatibla**.


## Hur Forward Email uppnår Section 889-efterlevnad {#how-forward-email-achieves-section-889-compliance}

Så, **hur är Forward Email Section 889-kompatibelt?** Vi uppnår detta genom noggrann urval av våra infrastruktursamarbetspartners. **Forward Email** förlitar sig uteslutande på två nyckelleverantörer för sin **Section 889-kompatibla infrastruktur**:

1. **[Cloudflare](https://www.cloudflare.com/):** Vår primära partner för nätverkstjänster och **Cloudflare e-postsäkerhet**.
2. **[DataPacket](https://datapacket.com/):** Vår huvudsakliga leverantör för serverinfrastruktur (vi använder [Digital Ocean](https://www.digitalocean.com/) och/eller [Vultr](https://www.vultr.com/) för failover och kommer snart att övergå till att enbart använda DataPacket – självklart har vi skriftligt bekräftat Section 889-efterlevnad från båda dessa failover-leverantörer).

> \[!IMPORTANT]
> Vårt exklusiva beroende av Cloudflare och DataPacket, som inte använder Section 889-förbjuden utrustning, är hörnstenen i vår efterlevnad.
Både [Cloudflare](https://www.cloudflare.com/) och [DataPacket](https://datapacket.com/) är engagerade i höga säkerhetsstandarder och använder inte utrustning som är förbjuden enligt Section 889. **Att använda Cloudflare och DataPacket för Section 889-efterlevnad** är grundläggande för vår tjänst.

### Cloudflares åtagande {#cloudflares-commitment}

[Cloudflare](https://www.cloudflare.com/) tar uttryckligen upp **Section 889-efterlevnad** i deras **[Third Party Code of Conduct](https://cf-assets.www.cloudflare.com/slt3lc6tev37/284hiWkCYNc49GQpAeBvGN/e137cdac96d1c4cd403c6b525831d284/Third_Party_Code_of_Conduct.pdf)**. De skriver:

> "Under Section 889 i National Defense Authorization Act (NDAA) använder Cloudflare inte, eller tillåter inte i sin leverantörskedja, telekommunikationsutrustning, videobevakningsprodukter eller tjänster som produceras eller tillhandahålls av Huawei Technologies Company, ZTE Corporation, Hytera Communications Corporation, Hangzhou Hikvision Digital Technology Company eller Dahua Technology Company (eller någon dotterbolag eller närstående till sådana enheter)."

*(Källa: Cloudflare Third Party Code of Conduct, hämtad 29 april 2025)*

Detta tydliga uttalande bekräftar att [Cloudflares](https://www.cloudflare.com/) infrastruktur, som **Forward Email** använder, uppfyller kraven i Section 889.

### DataPackets infrastruktur {#datapackets-infrastructure}

[DataPacket](https://datapacket.com/), vår serverleverantör, använder nätverksutrustning uteslutande från **Arista Networks** och **Cisco**. Varken Arista eller Cisco finns bland de företag som är förbjudna enligt Section 889. Båda är etablerade leverantörer som används i stor utsträckning i säkra företags- och myndighetsmiljöer, kända för att följa strikta säkerhets- och efterlevnadsstandarder.

Genom att endast använda [Cloudflare](https://www.cloudflare.com/) och [DataPacket](https://datapacket.com/) säkerställer **Forward Email** att hela dess tjänsteleveranskedja är fri från utrustning som är förbjuden enligt Section 889, vilket ger **säker e-postvidarebefordran för federala myndigheter** och andra säkerhetsmedvetna användare.


## Utöver Section 889: Bredare myndighetsefterlevnad {#beyond-section-889-broader-government-compliance}

Vårt åtagande för **myndighets-e-postsäkerhet** och efterlevnad sträcker sig bortom Section 889. Även om **Forward Email** själv inte direkt bearbetar eller lagrar känslig myndighetsdata som [Controlled Unclassified Information (CUI)](https://en.wikipedia.org/wiki/Controlled_Unclassified_Information) på samma sätt som en stor SaaS-plattform kan göra, stämmer vår **öppen källkod e-postvidarebefordringsarkitektur** och beroende av säkra, efterlevnadskompatibla leverantörer överens med principerna i andra viktiga regelverk:

* **[FAR (Federal Acquisition Regulation)](https://en.wikipedia.org/wiki/Federal_Acquisition_Regulation):** Genom att använda efterlevnadskompatibel infrastruktur och erbjuda en enkel kommersiell tjänst tillhandahåller vi **FAR-kompatibla e-post**-vidarebefordringsprinciper som är lämpliga för myndighetsentreprenörer.
* **Privacy Act & [FISMA](https://en.wikipedia.org/wiki/Federal_Information_Security_Management_Act_of\_2002):** Vi är **integritetsfokuserade** från början och erbjuder **Privacy Act e-post**-principer. Vi lagrar inte dina e-postmeddelanden. E-post vidarebefordras direkt, vilket minimerar datahantering. Våra infrastrukturleverantörer ([Cloudflare](https://www.cloudflare.com/), [DataPacket](https://datapacket.com/)) hanterar sina system enligt höga säkerhetsstandarder som är förenliga med **FISMA-kompatibla e-post**-principer.
* **[HIPAA](https://en.wikipedia.org/wiki/Health_Insurance_Portability_and_Accountability_Act):** För organisationer som behöver **HIPAA-kompatibel e-postvidarebefordran** kan **Forward Email** vara en del av en kompatibel lösning. Eftersom vi inte lagrar e-postmeddelanden ligger det primära efterlevnadsansvaret hos slutpunktens e-postsystem. Dock stödjer vårt säkra transportlager HIPAA-krav när det används korrekt.

> \[!WARNING]
> Ett [Business Associate Agreement (BAA)](https://en.wikipedia.org/wiki/Business_associate_agreement) kan behövas med din slutgiltiga e-postleverantör, inte med **Forward Email** själv, eftersom vi inte lagrar ditt e-postinnehåll (om du inte använder [vårt krypterade IMAP/POP3-lager](/blog/docs/best-quantum-safe-encrypted-email-service)).
## Vår Väg Framåt: Utvidgning av Efterlevnadshorisonter {#our-path-forward-expanding-compliance-horizons}

Medan vår efterlevnad av Section 889 utgör en avgörande grund, särskilt för federala entreprenörer, förstår vi att olika organisationer och myndigheter har olika och föränderliga regulatoriska behov. På **Forward Email** är transparens nyckeln, och vi vill dela vår syn på det bredare efterlevnadslandskapet och vår framtida riktning.

Vi erkänner vikten av ramverk och regler som:

* **[System for Award Management (SAM)](https://sam.gov/):** Avgörande för direkt federal upphandling.
* **[FAR (Federal Acquisition Regulation)](https://www.acquisition.gov/browse/index/far):** Inklusive standardklausuler som [FAR 52.212-4](https://www.acquisition.gov/far/52.212-4) för kommersiella tjänster.
* **[DFARS (Defense Federal Acquisition Regulation Supplement)](https://en.wikipedia.org/wiki/Defense_Federal_Acquisition_Regulation_Supplement):** Särskilt [DFARS 252.239-7010](https://www.acquisition.gov/dfars/252.239-7010-cloud-computing-services.) för DoD molntjänster.
* **[CMMC (Cybersecurity Maturity Model Certification)](https://en.wikipedia.org/wiki/Cybersecurity_Maturity_Model_Certification):** Krävs för DoD-entreprenörer som hanterar [Federal Contract Information (FCI)](https://en.wikipedia.org/wiki/Federal_Contract_Information) eller CUI.
* **[NIST SP 800-171](https://csrc.nist.gov/pubs/sp/800/171/r3/final):** Grunden för CMMC nivå 2, med fokus på att skydda CUI. ([NIST](https://en.wikipedia.org/wiki/National_Institute_of_Standards_and_Technology) - National Institute of Standards and Technology)
* **[FedRAMP (Federal Risk and Authorization Management Program)](https://en.wikipedia.org/wiki/FedRAMP):** Standarden för molntjänster som används av federala myndigheter.
* **[FISMA (Federal Information Security Modernization Act)](https://www.cisa.gov/topics/cybersecurity-best-practices/fisma):** Det övergripande ramverket för federal informationssäkerhet.
* **[HIPAA (Health Insurance Portability and Accountability Act)](https://www.hhs.gov/hipaa/index.html):** För hantering av skyddad hälsodata (PHI).
* **[FERPA (Family Educational Rights and Privacy Act)](https://en.wikipedia.org/wiki/Family_Educational_Rights_and_Privacy_Act):** För att skydda studenters utbildningsregister.
* **[COPPA (Children's Online Privacy Protection Act)](https://en.wikipedia.org/wiki/Children%27s_Online_Privacy_Protection_Act):** För tjänster som hanterar barn under 13 år.

**Vår Nuvarande Position och Framtida Mål:**

**Forward Email's** kärndesign – att vara **integritetsfokuserad**, **öppen källkod** och minimera datahantering (särskilt i vår grundläggande **e-postvidarebefordranstjänst**) – stämmer väl överens med *principerna* bakom många av dessa regleringar. Våra befintliga säkerhetspraxis (kryptering, stöd för moderna e-poststandarder) och efterlevnad av Section 889 ger en stark utgångspunkt.

Att uppnå formell certifiering eller auktorisation för ramverk som **FedRAMP** eller **CMMC** är dock en betydande uppgift. Det innebär rigorös dokumentation, implementering av specifika tekniska och procedurmässiga kontroller (ofta hundratals), oberoende bedömningar (som [3PAO](https://www.fedramp.gov/glossary/#3pao) för FedRAMP - Third-Party Assessment Organization) och kontinuerlig övervakning.

> \[!IMPORTANT]
> Efterlevnad handlar inte bara om teknik; det handlar om dokumenterade processer, policyer och ständig vaksamhet. Att uppnå certifieringar som FedRAMP eller CMMC kräver betydande investeringar och tid.

**Vårt Åtagande:**

När **Forward Email** växer och våra kunders behov utvecklas, är vi engagerade i att utforska och eftersträva relevanta efterlevnadscertifieringar. Detta inkluderar planer för:

1. **SAM-registrering:** För att underlätta direkt samarbete med amerikanska federala myndigheter.
2. **Formalisering av processer:** Förbättra vår interna dokumentation och våra rutiner för att anpassa oss till standarder som NIST SP 800-171, som utgör grunden för CMMC.
3. **Utvärdering av FedRAMP-vägar:** Bedöma kraven och möjligheten att söka FedRAMP-auktorisation, sannolikt med start på en låg eller måttlig baslinje, eventuellt med användning av [LI-SaaS](https://www.fedramp.gov/blog/fedramp-releases-low-impact-saas-baseline/) modellen där det är tillämpligt.
4. **Stöd för specifika behov:** Hantera krav som HIPAA (möjligen genom BAAs och specifika konfigurationer för lagrad data) och FERPA (genom lämpliga avtalsvillkor och kontroller) när vi engagerar oss mer med vård- och utbildningsinstitutioner.
Denna resa kräver noggrann planering och investering. Även om vi inte har omedelbara tidslinjer för alla certifieringar, är det en nyckeldel av vår färdplan att stärka vår efterlevnadsställning för att möta behoven hos myndigheter och reglerade branscher.

> \[!NOTE]
> Vi tror att vår **öppen källkod**-natur ger unik transparens genom hela denna process, vilket gör det möjligt för vår community och kunder att se vårt engagemang på nära håll.

Vi kommer att fortsätta uppdatera vår community när vi når viktiga milstolpar på vår efterlevnadsresa.


## Varför detta är viktigt för dig {#why-this-matters-for-you}

Att välja en **Section 889-kompatibel e-post vidarebefordrings** tjänst som **Forward Email** innebär:

* **Sinnesro:** Speciellt för myndigheter, entreprenörer och säkerhetsmedvetna organisationer.
* **Minskad risk:** Undviker potentiella konflikter med **federala regler för e-post**.
* **Förtroende:** Visar ett engagemang för säkerhet och integritet i leverantörskedjan.

**Forward Email** erbjuder ett enkelt, pålitligt och *kompatibelt* sätt att hantera dina behov av **e-post vidarebefordran** för anpassade domäner.


## Säker, kompatibel e-post vidarebefordran börjar här {#secure-compliant-email-forwarding-starts-here}

**Forward Email** är dedikerat till att erbjuda en **säker, privat och öppen källkod e-post vidarebefordrings** tjänst. Vår **efterlevnad av Section 889**, uppnådd genom vårt partnerskap med [Cloudflare](https://www.cloudflare.com/) och [DataPacket](https://datapacket.com/) (som speglar vårt **Forward Email efterlevnadsarbete för US Naval Academy**), är ett bevis på detta engagemang. Oavsett om du är en myndighet, en entreprenör eller helt enkelt värdesätter **myndighets e-postsäkerhet**, är **Forward Email** byggt för dig.

Redo för **säker, kompatibel e-post vidarebefordran**? [Registrera dig gratis idag!](https://forwardemail.net)


## Referenser {#references}

* **Section 889 (NDAA):** <https://www.acquisition.gov/Section-889-Policies>
* **Cloudflare:** <https://www.cloudflare.com/>
* **Cloudflare Third Party Code of Conduct:** <https://cf-assets.www.cloudflare.com/slt3lc6tev37/284hiWkCYNc49GQpAeBvGN/e137cdac96d1c4cd403c6b525831d284/Third_Party_Code_of_Conduct.pdf>
* **DataPacket:** <https://datapacket.com/>
* **System for Award Management (SAM):** <https://sam.gov/>
* **Federal Acquisition Regulation (FAR):** <https://www.acquisition.gov/browse/index/far>
* **FAR 52.212-4:** <https://www.acquisition.gov/far/52.212-4>
* **Defense Federal Acquisition Regulation Supplement (DFARS):** <https://www.acquisition.gov/dfars>
* **DFARS 252.239-7010:** <https://www.acquisition.gov/dfars/252.239-7010-cloud-computing-services.>
* **Cybersecurity Maturity Model Certification (CMMC):** <https://dodcio.defense.gov/cmmc/About/>
* **NIST SP 800-171:** <https://csrc.nist.gov/pubs/sp/800/171/r3/final>
* **Federal Risk and Authorization Management Program (FedRAMP):** <https://www.fedramp.gov/>
* **Federal Information Security Modernization Act (FISMA):** <https://www.cisa.gov/topics/cybersecurity-best-practices/fisma>
* **Health Insurance Portability and Accountability Act (HIPAA):** <https://www.hhs.gov/hipaa/index.html>
* **Family Educational Rights and Privacy Act (FERPA):** <https://studentprivacy.ed.gov/ferpa>
* **Children's Online Privacy Protection Act (COPPA):** <https://www.ftc.gov/legal-library/browse/rules/childrens-online-privacy-protection-rule-coppa>
