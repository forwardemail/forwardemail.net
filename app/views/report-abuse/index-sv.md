# Rapportera missbruk {#report-abuse}

<img loading="lazy" src="/img/articles/report-abuse.webp" alt="Report abuse and spam to Forward Email" class="rounded-lg" />

## Innehållsförteckning {#table-of-contents}

* [Ansvarsfriskrivning](#disclaimer)
* [Så här skickar du in en anmälan om missbruk](#how-to-submit-an-abuse-report)
* [För allmänheten](#for-the-general-public)
* [För brottsbekämpande myndigheter](#for-law-enforcement)
  * [Vilken information finns tillgänglig](#what-information-is-available)
  * [Vilken information finns inte tillgänglig](#what-information-is-not-available)
  * [Brottsbekämpning baserad i USA](#law-enforcement-based-in-the-united-states)
  * [Brottsbekämpning baserad utanför USA](#law-enforcement-based-outside-of-the-united-states)
  * [Begäran om nödsituationer från brottsbekämpande myndigheter](#law-enforcement-emergency-requests)
  * [Förfrågningar från polisen kan utlösa kontomeddelanden](#law-enforcement-requests-may-trigger-account-notices)
  * [Polisens begäran om att bevara information](#law-enforcement-requests-to-preserve-information)
  * [Processen för delgivning av brottsbekämpande myndigheter](#law-enforcement-serving-process)

## Ansvarsfriskrivning {#disclaimer}

Vänligen hänvisa till vår [Villkor](/terms) eftersom den gäller för hela webbplatsen.

## Så här skickar du in en anmälan om missbruk {#how-to-submit-an-abuse-report}

Vi granskar rapporter om missbruk och skickar informationsförfrågningar för [allmänheten](#for-the-general-public) och [brottsbekämpning](#for-law-enforcement) från fall till fall via e-post.

Rapporter om missbruk och informationsförfrågningar avseende användare, e-postadresser, IP-adresser och/eller domäner kallas gemensamt för ett "konto" nedan.

Vår e-postadress för att kontakta oss med din begäran eller anmälan gällande missbruk är: `abuse@forwardemail.net`

Läs avsnitten nedan för mer information som kan vara relevant för dig.

## För allmänheten {#for-the-general-public}

<u>**Om du eller någon annan är i omedelbar fara, vänligen kontakta polis och räddningstjänst omedelbart.**</u>

<u>**Du bör söka professionell juridisk rådgivning för att återfå förlorad åtkomst till ditt konto eller för att hjälpa till att stoppa en illvillig aktör.**</u>

Om du har blivit utsatt för övergrepp från ett konto som använder vår tjänst, vänligen skicka din rapport till oss via e-post till adressen ovan. Om ditt konto har tagits över av en illvillig aktör (t.ex. om din domän nyligen har löpt ut och omregistrerats av en tredje part och sedan använts för missbruk), vänligen skicka en rapport till oss via e-post till adressen ovan med din exakta kontoinformation (t.ex. ditt domännamn). Vi kan hjälpa till att [skuggförbud](https://en.wikipedia.org/wiki/Shadow_banning) kontot efter att ditt tidigare ägande har validerats. Observera att vi inte har befogenhet att hjälpa dig att återfå åtkomst till ditt konto.

Ditt juridiska ombud kan råda dig att kontakta polisen, din kontoinnehavare (t.ex. domännamnets registrar; webbplatsen där du registrerade domännamnet) och/eller hänvisa dig till [ICANNs sida om förlorade domäner](https://www.icann.org/resources/pages/lost-domain-names).

## För brottsbekämpande myndigheter {#for-law-enforcement}

För de flesta förfrågningar regleras vår möjlighet att lämna ut information av [Lagen om integritetsskydd för elektronisk kommunikation](https://bja.ojp.gov/program/it/privacy-civil-liberties/authorities/statutes/1285) ([Wikipedia](https://en.wikipedia.org/wiki/Electronic_Communications_Privacy_Act)), [18 U.S.C. 2701](https://www.govinfo.gov/link/uscode/18/2701), et seq. ("ECPA"). ECPA föreskriver att vi endast lämnar ut viss användarinformation till brottsbekämpande myndigheter som svar på specifika typer av rättsliga förfrågningar, inklusive stämningar, domstolsbeslut och husrannsakningsorder.

Om du är anställd inom polisen och söker information om ett konto, bör kontoinformation samt datum- och tidsintervall inkluderas i din begäran. Vi kan inte behandla alltför breda och/eller vaga förfrågningar – detta är för att skydda våra användares data och förtroende, och viktigast av allt för att hålla deras data säkra.

Om din begäran signalerar ett brott mot vår [Villkor](/terms)-policy kommer vi att behandla den enligt våra interna bästa praxis för hantering av missbruk – observera att detta i vissa fall kan leda till att kontot stängs av och/eller avstängs.

**Eftersom vi inte är en domännamnsregistrator** bör du, om du vill söka information om historisk DNS-post gällande ett domännamn, kontakta den specifika domännamnsregistrator som motsvarar domänen. Tjänster som [Security Trails]() kan ge sökning efter historiska poster, men mer specifik och korrekt information kan tillhandahållas av registratorn. För att avgöra vem domännamnsregistratorn och/eller DNS-namnservrarna är för en domän kan verktygen `dig` och `whois` vara användbara (t.ex. `whois example.com` eller `dig example.com ns`). Du kan avgöra om ett konto har ett betalt abonnemang eller ett gratis abonnemang på vår tjänst genom att göra en DNS-postsökning (t.ex. `dig example.com mx` och `dig example.com txt`). Om MX-posterna inte returnerar värden som `mx1.forwardemail.net` och `mx2.forwardemail.net`, använder domänen inte vår tjänst. Om TXT-posterna returnerar en e-postadress i klartext (t.ex. `forward-email=user@example.com`), indikerar det destinationen för vidarebefordring av e-post för en domän. Om den istället returnerar ett värde som `forward-email-site-verification=XXXXXXXXXX`, indikerar det att den har ett betalt abonnemang och att vidarebefordringskonfigurationen lagras i vår databas under ID:t `whois`0. För mer information om hur vår tjänst fungerar på DNS-nivå, hänvisa till vår `whois`1.

### Vilken information finns tillgänglig {#what-information-is-available}

Vänligen hänvisa till vår sekretesspolicy för [Insamlad information](/privacy#information-collected). Konton har rätt att ta bort sin information från vårt system i enlighet med datalagring och sekretesslagar; hänvisa till vår sekretesspolicy för [Borttagning av information](/privacy#information-removal). Det innebär att den begärda informationen kanske inte är tillgänglig vid tidpunkten för begäran på grund av att kontot har raderats.

### Vilken information är inte tillgänglig {#what-information-is-not-available}

Vänligen läs vår sekretesspolicy för [Information som inte samlats in](/privacy#information-not-collected).

### Polismyndighet baserad i USA {#law-enforcement-based-in-the-united-states}

Med [undantag för nödsituationer](#law-enforcement-emergency-requests) delar vi endast kontoinformation efter mottagande av en giltig stämning, ett amerikanskt domstolsbeslut enligt ECPA och/eller en husrannsakningsorder.

Vi kan dessutom komma att begära [meddela ett konto](#law-enforcement-requests-may-trigger-account-notices) från brottsbekämpande myndigheter, såvida vi inte är förbjudna att göra det enligt lag eller domstolsbeslut.

Om vi får en giltig stämning, ett domstolsbeslut enligt ECPA och/eller en husrannsakningsorder kommer vi att tillhandahålla relevant och tillgänglig information efter bästa förmåga.

### Polismyndigheter baserade utanför USA {#law-enforcement-based-outside-of-the-united-states}

Vi kräver att förfrågningar till brottsbekämpande myndigheter utanför USA skickas via något av följande:

* En domstol i USA.
* En verkställande myndighet enligt förfarandena i en [Förenta staternas avtal om ömsesidig rättshjälp](https://www.justice.gov/criminal-oia/file/1498806/download) ([Wikipedia](https://en.wikipedia.org/wiki/Mutual_legal_assistance_treaty)) ("MLAT").
* En order från en utländsk regering som omfattas av ett exekutivavtal som USA:s justitieminister har fastställt och intygat till kongressen uppfyller kraven i [18 U.S.C. 2523](https://www.govinfo.gov/link/uscode/18/2523).

### Förfrågningar från polismyndigheter om nödsituationer {#law-enforcement-emergency-requests}

Såsom lagen tillåter i USA (t.ex. i enlighet med [18 U.S.C. §2702 (b)(8)](https://www.law.cornell.edu/uscode/text/18/2702#:\~:text=\(8\)to%20a%20governmental%20entity%20if%20the%20provider%20in%20good%20faith%20believes%20that%20an%20emergency%20involverar fara för dödsfall eller allvarlig fysisk skada för någon person kräver upplysning utan dröjsmål om kommunikation som rör nödsituationen eller) och [§2702 (c)](https://www.law.cornell.edu/uscode/text/18/2702#:\~:text=\(c\)Undantag%20för%20Utlämnande%20av%20kund%20register.%E2%80%94En%20leverantör%20som%20beskrivs%20i%20underavsnitt%20\(a\)%20får%20utlämna%20en%20register%20eller%20annan%20information%20som%20avser%20en%20prenumerant%20till%20eller%20kund%20av%20sådan%20tjänst%20\(inte%20innehållet%20i%20kommunikationer%20som%20omfattas%20av%20underavsnitt%20\(a\)\(1\)%20eller%20\(a\)\(2\)\)%E2%80%94)), när det är i god tro och med oberoende verifiering av begäraren – vi får lämna ut och dela kontoinformation till brottsbekämpande myndigheter utan kallelse, domstolsbeslut enligt ECPA och/eller husrannsakningsorder när vi anser att det är nödvändigt att göra det utan dröjsmål för att förhindra dödsfall eller allvarliga fysiska skador.

Vi kräver att begäranden om nöduppgifter ("EDR") skickas via e-post och innehåller all relevant information för att säkerställa en snabb och snabb process.

Observera att vi är medvetna om sofistikerade förfalsknings-, nätfiske- och personifieringsattacker med e-post (se t.ex. [den här artikeln från The Guardian](https://www.theguardian.com/technology/2022/apr/04/us-law-enforcement-agencies-access-your-data-apple-meta#:\~:text=A%20hack%20using%20a%20forged%20legal%20request%20that%20exposed%20consumer%20data%20collected%20by%20Apple%20and%20Meta%20shed%20light%20on%20the%20reach%20of%20the%20law)).

Vår policy för behandling av EDR:er är följande:

1. Undersök självständigt metadata för e-posthuvudet (t.ex. DKIM/SPF/DMARC) (eller avsaknaden av dem) för verifiering.

2. Vi gör vårt bästa för att i god tro (med upprepade försök om nödvändigt) självständigt kontakta den som lämnat in begäran via telefon – för att bekräfta begäranens äkthet. Vi kan till exempel undersöka webbplatsen `.gov` som är relaterad till den jurisdiktion som begäran kommer ifrån, och sedan ringa kontoret från deras offentligt listade officiella telefonnummer för att verifiera begäran.

### Förfrågningar från brottsbekämpande myndigheter kan utlösa kontomeddelanden {#law-enforcement-requests-may-trigger-account-notices}

Vi kan meddela ett konto och förse dem med en kopia av en begäran från brottsbekämpande myndigheter som rör dem, såvida vi inte är förbjudna enligt lag eller domstolsbeslut att göra det (t.ex. [18 U.S.C. 2705(b)](https://www.govinfo.gov/link/uscode/18/2705)). I dessa fall, om tillämpligt, kan vi meddela ett konto när sekretessförbudet har löpt ut.

Om en begäran om information från polisen är giltig kommer vi att [bevara nödvändig och begärd kontoinformation](#law-enforcement-requests-to-preserve-information) och göra rimliga ansträngningar för att kontakta kontoinnehavaren via deras registrerade och verifierade e-postadress (t.ex. inom 7 kalenderdagar). Om vi får en invändning i rätt tid (t.ex. inom 7 kalenderdagar) kommer vi att avstå från att dela kontoinformation och fortsätta den rättsliga processen vid behov.

### Polisens begäran om att bevara information {#law-enforcement-requests-to-preserve-information}

Vi kommer att uppfylla giltiga begäranden från brottsbekämpande myndigheter om att bevara information om ett konto i enlighet med [18 U.S.C. 2703(f)](https://www.govinfo.gov/link/uscode/18/2703). Observera att bevarande av data endast är begränsat till vad som specifikt begärs och är tillgängligt för närvarande.

### Delgivningsprocess för brottsbekämpande myndigheter {#law-enforcement-serving-process}

Vi kräver att alla giltiga begäranden från brottsbekämpande myndigheter förser oss med en giltig och fungerande e-postadress som vi kan kontakta och tillhandahålla begärd information elektroniskt till.

Alla förfrågningar ska skickas till e-postadressen som anges under [Så här skickar du in en anmälan om missbruk](#how-to-submit-an-abuse-report) ovan.

Alla begäranden från brottsbekämpande myndigheter måste skickas på brevpapper från en myndighet eller avdelning (t.ex. som en skannad PDF-bilaga), från en officiell och relevant e-postadress och vara undertecknade.

Om det gäller en [nödförfrågan](#law-enforcement-emergency-requests), vänligen skriv "Begäran från polismyndighet" i ämnesrubriken i e-postmeddelandet.

Observera att det kan ta minst två veckor för oss att granska och svara på din begäran.