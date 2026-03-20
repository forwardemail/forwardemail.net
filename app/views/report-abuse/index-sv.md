# Rapportera missbruk {#report-abuse}

<img loading="lazy" src="/img/articles/report-abuse.webp" alt="Rapportera missbruk och skräppost till Forward Email" class="rounded-lg" />


## Innehållsförteckning {#table-of-contents}

* [Ansvarsfriskrivning](#disclaimer)
* [Hur man skickar in en missbruksrapport](#how-to-submit-an-abuse-report)
* [För allmänheten](#for-the-general-public)
* [För brottsbekämpande myndigheter](#for-law-enforcement)
  * [Vilken information som är tillgänglig](#what-information-is-available)
  * [Vilken information som inte är tillgänglig](#what-information-is-not-available)
  * [Brottsbekämpande myndigheter baserade i USA](#law-enforcement-based-in-the-united-states)
  * [Brottsbekämpande myndigheter baserade utanför USA](#law-enforcement-based-outside-of-the-united-states)
  * [Akuta förfrågningar från brottsbekämpande myndigheter](#law-enforcement-emergency-requests)
  * [Förfrågningar från brottsbekämpande myndigheter kan utlösa kontomeddelanden](#law-enforcement-requests-may-trigger-account-notices)
  * [Förfrågningar från brottsbekämpande myndigheter att bevara information](#law-enforcement-requests-to-preserve-information)
  * [Utdelning av process från brottsbekämpande myndigheter](#law-enforcement-serving-process)


## Ansvarsfriskrivning {#disclaimer}

Vänligen hänvisa till våra [Villkor](/terms) eftersom de gäller för hela webbplatsen.


## Hur man skickar in en missbruksrapport {#how-to-submit-an-abuse-report}

Vi granskar missbruksrapporter och hanterar informationsförfrågningar för [allmänheten](#for-the-general-public) och [brottsbekämpande myndigheter](#for-law-enforcement) från fall till fall via e-post.

Missbruksrapporter och informationsförfrågningar avseende användare, e-post, IP-adresser och/eller domäner kallas nedan gemensamt för ett "Konto".

Våra e-postadresser för att kontakta oss med din förfrågan eller rapport angående missbruk är: `support@forwardemail.net`, `abuse@forwardemail.net` och `security@forwardemail.net`.

Vänligen skicka en kopia till alla dessa e-postadresser om möjligt, och skicka även påminnelsemail om vi inte återkommer inom 24-48+ timmar.

Läs avsnitten nedan för mer information som kan vara relevant för dig.


## För allmänheten {#for-the-general-public}

<u>**Om du eller någon annan är i omedelbar fara, kontakta polisen och räddningstjänsten omedelbart.**</u>

<u>**Du bör söka professionell juridisk rådgivning för att återfå förlorad åtkomst till ditt Konto eller för att hjälpa till att stoppa en illvillig aktör.**</u>

Om du är offer för missbruk från ett Konto som använder vår tjänst, vänligen skicka din rapport via e-post till adressen ovan. Om ditt Konto har tagits över av en illvillig aktör (t.ex. om din domän nyligen gick ut och registrerades om av en tredje part och sedan användes för missbruk), vänligen skicka en rapport till adressen ovan med din exakta Kontoinformation (t.ex. ditt domännamn). Vi kan hjälpa till att [shadow banna](https://en.wikipedia.org/wiki/Shadow_banning) Kontot efter validering av ditt tidigare ägarskap. Observera att vi inte har befogenhet att hjälpa dig att återfå åtkomst till ditt Konto.

Din juridiska representant kan råda dig att kontakta brottsbekämpande myndigheter, din Kontoägare (t.ex. domännamnets registrar; webbplatsen där du registrerade domännamnet) och/eller hänvisa dig till [ICANN:s sida om förlorade domäner](https://www.icann.org/resources/pages/lost-domain-names).


## För brottsbekämpande myndigheter {#for-law-enforcement}

För majoriteten av förfrågningar styrs vår möjlighet att lämna ut information av [Electronic Communications Privacy Act](https://bja.ojp.gov/program/it/privacy-civil-liberties/authorities/statutes/1285) ([Wikipedia](https://en.wikipedia.org/wiki/Electronic_Communications_Privacy_Act)), [18 U.S.C. 2701](https://www.govinfo.gov/link/uscode/18/2701), m.fl. ("ECPA"). ECPA kräver att vi endast lämnar ut viss användarinformation till brottsbekämpande myndigheter som svar på specifika typer av juridiska förfrågningar, inklusive stämningar, domstolsbeslut och husrannsakningsorder.

Om du är medlem av brottsbekämpande myndigheter och söker information om ett Konto, bör Kontoinformation samt datum- och tidsintervall inkluderas i din förfrågan. Vi kan inte behandla alltför breda och/eller vaga förfrågningar – detta för att skydda våra användares data och förtroende, och viktigast av allt för att hålla deras data säker.
Om din begäran signalerar för oss ett brott mot våra [Villkor](/terms), kommer vi att hantera den enligt våra interna bästa praxis för hantering av missbruk – observera att detta i vissa fall kan resultera i att Kontot stängs av och/eller förbjuds.

**Eftersom vi inte är en domännamnsregistrator**, om du vill söka historisk DNS-postinformation om ett domännamn, bör du kontakta den specifika domännamnsregistratorn som motsvarar domänen. Tjänster som [Security Trails]() kan erbjuda historisk postuppslagning, men mer specifik och korrekt information kan tillhandahållas av registratorn. För att avgöra vem som är domännamnsregistrator och/eller ägare av DNS-namnsservrar för en domän kan verktygen `dig` och `whois` vara användbara (t.ex. `whois example.com` eller `dig example.com ns`). Du kan avgöra om ett Konto har en betald plan eller gratisplan på vår tjänst genom att göra en DNS-postuppslagning (t.ex. `dig example.com mx` och `dig example.com txt`). Om MX-posterna inte returnerar värden som `mx1.forwardemail.net` och `mx2.forwardemail.net`, använder inte domänen vår tjänst. Om TXT-posterna returnerar en klartext-e-postadress (t.ex. `forward-email=user@example.com`), indikerar det e-postvidarebefordringsadressen för en domän. Om den istället returnerar ett värde som `forward-email-site-verification=XXXXXXXXXX`, indikerar det att den har en betald plan och vidarebefordringskonfigurationen lagras i vår databas under ID:t `XXXXXXXXXX`. För mer information om hur vår tjänst fungerar på DNS-nivå, vänligen se vår [FAQ](/faq).

### Vilken information är tillgänglig {#what-information-is-available}

Vänligen se vår Sekretesspolicy för avsnittet [Insamlad information](/privacy#information-collected). Konton har rätt att ta bort sin information från vårt system i enlighet med lagar om datalagring och integritet; se vår Sekretesspolicy för avsnittet [Informationsborttagning](/privacy#information-removal). Detta innebär att information som begärs kanske inte är tillgänglig vid tidpunkten för begäran på grund av kontots radering.

### Vilken information är inte tillgänglig {#what-information-is-not-available}

Vänligen se vår Sekretesspolicy för avsnittet [Information som inte samlas in](/privacy#information-not-collected).

### Myndigheter baserade i USA {#law-enforcement-based-in-the-united-states}

Med [undantag för nödsituationer](#law-enforcement-emergency-requests) delar vi kontoinformation endast vid mottagande av giltigt stämningsbeslut, ECPA-domstolsbeslut och/eller husrannsakningsorder.

Vi kan dessutom [informera ett Konto](#law-enforcement-requests-may-trigger-account-notices) om en myndighetsbegäran, om vi inte är förbjudna att göra det enligt lag eller domstolsbeslut.

Om vi mottar giltigt stämningsbeslut, ECPA-domstolsbeslut och/eller husrannsakningsorder, kommer vi att tillhandahålla relevant och tillgänglig information efter bästa förmåga.

### Myndigheter baserade utanför USA {#law-enforcement-based-outside-of-the-united-states}

Vi kräver att begäran från myndigheter baserade utanför USA lämnas in via någon av följande:

* En amerikansk domstol.
* En brottsbekämpande myndighet enligt procedurerna i ett [ömsesidigt rättsligt biståndsavtal med USA](https://www.justice.gov/criminal-oia/file/1498806/download) ([Wikipedia](https://en.wikipedia.org/wiki/Mutual_legal_assistance_treaty)) ("MLAT").
* Ett beslut från en utländsk regering som omfattas av ett verkställande avtal som USA:s justitieminister har fastställt och certifierat för kongressen uppfyller kraven i [18 U.S.C. 2523](https://www.govinfo.gov/link/uscode/18/2523).

### Myndighetsbegäran i nödsituationer {#law-enforcement-emergency-requests}

I den utsträckning lagen tillåter i USA (t.ex. i enlighet med [18 U.S.C. §2702 (b)(8)](https://www.law.cornell.edu/uscode/text/18/2702#:\~:text=\(8\)to%20a%20governmental%20entity%2C%20if%20the%20provider%2C%20in%20good%20faith%2C%20believes%20that%20an%20emergency%20involving%20danger%20of%20death%20or%20serious%20physical%20injury%20to%20any%20person%20requires%20disclosure%20without%20delay%20of%20communications%20relating%20to%20the%20emergency%3B%20or) och [§2702 (c)](https://www.law.cornell.edu/uscode/text/18/2702#:\~:text=\(c\)Exceptions%20for%20Disclosure%20of%20Customer%20Records.%E2%80%94A%20provider%20described%20in%20subsection%20\(a\)%20may%20divulge%20a%20record%20or%20other%20information%20pertaining%20to%20a%20subscriber%20to%20or%20customer%20of%20such%20service%20\(not%20including%20the%20contents%20of%20communications%20covered%20by%20subsection%20\(a\)\(1\)%20or%20\(a\)\(2\)\)%E2%80%94)), när vi i god tro och med oberoende verifiering av den som begär – kan vi lämna ut och dela kontoinformation till myndigheter utan stämningsbeslut, ECPA-domstolsbeslut och/eller husrannsakningsorder när vi anser att detta utan dröjsmål krävs för att förhindra dödsfall eller allvarlig fysisk skada.
Vi kräver att nödförfrågningar om data ("EDR") skickas via e-post och inkluderar all relevant information för att möjliggöra en snabb och effektiv process.

Observera att vi är medvetna om sofistikerade spoofing-, phishing- och impersoneringsattacker via e-post (t.ex. se [denna artikel från The Guardian](https://www.theguardian.com/technology/2022/apr/04/us-law-enforcement-agencies-access-your-data-apple-meta#:\~:text=A%20hack%20using%20a%20forged%20legal%20request%20that%20exposed%20consumer%20data%20collected%20by%20Apple%20and%20Meta%20shed%20light%20on%20the%20reach%20of%20the%20law)).

Vår policy för hantering av EDR är följande:

1. Självständigt undersöka e-posthuvudets metadata (t.ex. DKIM/SPF/DMARC) (eller avsaknad därav) för verifiering.

2. Göra vårt bästa godtroende försök (med upprepade försök vid behov) att självständigt kontakta den som begär via telefon – för att bekräfta äktheten i förfrågan. Till exempel kan vi undersöka `.gov`-webbplatsen relaterad till den jurisdiktion förfrågan kommer ifrån, och sedan ringa kontoret från deras offentligt listade officiella telefonnummer för att verifiera förfrågan.

### Begäran från rättsvårdande myndigheter kan utlösa kontomeddelanden {#law-enforcement-requests-may-trigger-account-notices}

Vi kan meddela ett konto och förse dem med en kopia av en begäran från rättsvårdande myndigheter som rör dem, om vi inte är förbjudna enligt lag eller domstolsbeslut att göra det (t.ex. [18 U.S.C. 2705(b)](https://www.govinfo.gov/link/uscode/18/2705)). I sådana fall, om tillämpligt, kan vi meddela ett konto när tystnadsordern har upphört att gälla.

Om en begäran om information från rättsvårdande myndigheter är giltig, kommer vi att [bevara nödvändig och begärd kontoinformation](#law-enforcement-requests-to-preserve-information) och göra en rimlig ansträngning att kontakta kontoägaren via deras registrerade och verifierade e-postadress (t.ex. inom 7 kalenderdagar). Om vi mottar ett tidsenligt invändning (t.ex. inom 7 kalenderdagar), kommer vi att undanhålla delning av kontoinformation och fortsätta den juridiska processen vid behov.

### Begäran från rättsvårdande myndigheter att bevara information {#law-enforcement-requests-to-preserve-information}

Vi kommer att respektera giltiga begäran från rättsvårdande myndigheter att bevara information om ett konto enligt [18 U.S.C. 2703(f)](https://www.govinfo.gov/link/uscode/18/2703). Observera att bevarandet av data är begränsat till vad som specifikt begärs och för närvarande är tillgängligt.

### Rättsvårdande myndigheters delgivning av process {#law-enforcement-serving-process}

Vi kräver att alla giltiga begäran från rättsvårdande myndigheter förser oss med en giltig och fungerande e-postadress som vi kan korrespondera med och tillhandahålla begärd information elektroniskt till.

Alla förfrågningar ska skickas till den e-postadress som anges under [Hur man skickar en missbruksrapport](#how-to-submit-an-abuse-report) ovan.

Alla begäran från rättsvårdande myndigheter måste skickas på myndighetens eller avdelningens brevpapper (t.ex. som en PDF-skannad bilaga), från en officiell och relevant e-postadress, och vara undertecknade.

Om det gäller en [nödförfrågan](#law-enforcement-emergency-requests), vänligen skriv "Emergency law enforcement request" i ämnesraden på e-posten.

Observera att det kan ta oss minst två veckor att kunna granska och svara på din förfrågan.
