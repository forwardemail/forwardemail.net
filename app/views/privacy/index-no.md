# Personvernerklæring {#privacy-policy}

<img loading="lazy" src="/img/articles/privacy.webp" alt="Forward Email privacy policy" class="rounded-lg" />

## Innholdsfortegnelse {#table-of-contents}

* [Ansvarsfraskrivelse](#disclaimer)
* [Informasjon ikke samlet inn](#information-not-collected)
* [Informasjon innsamlet](#information-collected)
* [Informasjon delt](#information-shared)
* [Fjerning av informasjon](#information-removal)
* [Ytterligere opplysninger](#additional-disclosures)

## Ansvarsfraskrivelse {#disclaimer}

Vennligst overhold vår [Vilkår](/terms), da den gjelder for hele nettstedet.

## Informasjon ikke samlet inn {#information-not-collected}

**Med unntak av [feil](/faq#do-you-store-error-logs), [utgående SMTP-e-poster](/faq#do-you-support-sending-email-with-smtp), og/eller når spam eller ondsinnet aktivitet oppdages (f.eks. for hastighetsbegrensning):**

* Vi lagrer ikke videresendte e-poster på disk eller i databaser.
* Vi lagrer ikke metadata om e-poster på disk eller i databaser.
* Vi lagrer ikke logger eller IP-adresser på disk eller i databaser.

## Informasjon samlet {#information-collected}

For åpenhet kan du når som helst <a href="https://github.com/forwardemail" target="_blank" rel="noopener noreferrer">se kildekoden vår</a> for å se hvordan informasjonen nedenfor samles inn og brukes:

**Utenom funksjonalitet og for å forbedre tjenesten vår, samler og lagrer vi følgende informasjon sikkert:**

* Vi lagrer e-poster og kalenderinformasjon i [kryptert SQLite-database](/blog/docs/best-quantum-safe-encrypted-email-service) utelukkende for din IMAP/POP3/CalDAV/CardDAV-tilgang og postboksfunksjonalitet.
* Merk at hvis du kun bruker våre e-postvideresendingstjenester, lagres ingen e-poster på disk eller databaselager som beskrevet i [Informasjon ikke samlet inn](#information-not-collected).
* Våre e-postvideresendingstjenester opererer kun i minnet (ingen skriving til disklagring eller databaser).
* IMAP/POP3/CalDAV/CardDAV-lagring er kryptert i ro, kryptert under overføring og lagret på en LUKS-kryptert disk.
* Sikkerhetskopier for din IMAP/POP3/CalDAV/CardDAV-lagring er kryptert i ro, kryptert under overføring og lagret på [Cloudflare R2](https://www.cloudflare.com/developer-platform/r2/).
* Vi lagrer en informasjonskapsel i en økt for nettstedstrafikken din.
* Vi lagrer e-postadressen du oppgir til oss.
* Vi lagrer domenenavnene, aliasene og konfigurasjonene du oppgir til oss.
* Vi lagrer `4xx` og `5xx` SMTP-svarkode [feillogger](/faq#do-you-store-error-logs) i 7 dager.
* Vi lagrer [utgående SMTP-e-poster](/faq#do-you-support-sending-email-with-smtp) i ~30 dager.
* Denne lengden varierer basert på "Date"-overskriften, siden vi tillater at e-poster sendes i fremtiden hvis en fremtidig "Date"-overskrift finnes.
* **Merk at når en e-post er levert eller har permanente feil, vil vi redigere og slette meldingsteksten.**
* Hvis du vil konfigurere den utgående SMTP-e-postmeldingsteksten til å beholdes lenger enn standardverdien på 0 dager (etter vellykket levering eller permanent feil), går du til Avanserte innstillinger for domenet ditt og angir en verdi mellom `0` og `30`.
* Noen brukere liker å bruke forhåndsvisningsfunksjonen [Min konto > E-poster](/my-account/emails) for å se hvordan e-postene deres gjengis, derfor støtter vi en konfigurerbar oppbevaringsperiode.
* Merk at vi også støtter __PROTECTED_LINK_30__0.
* All tilleggsinformasjon du frivillig gir oss, for eksempel kommentarer eller spørsmål som sendes til oss via e-post eller på <a href="/help">hjelpesiden</a> vår.

## Informasjon delt {#information-shared}

Vi deler ikke informasjonen din med noen tredjeparter. Vi bruker heller ikke tredjeparts analyse- eller telemetriprogramvaretjenester.

Vi må kanskje, og vil, etterkomme rettslige forespørsler (men husk [Vi samler ikke inn informasjon som er nevnt ovenfor under «Informasjon som ikke samles inn»](#information-not-collected), så vi vil ikke kunne tilby den med det første).

## Fjerning av informasjon {#information-removal}

Hvis du når som helst ønsker å fjerne informasjon du har gitt oss, kan du gå til <a href="/my-account/security">Min konto > Sikkerhet</a> og klikke på «Slett konto».

På grunn av forebygging og begrensning av misbruk kan det hende at administratorene våre må gjennomgå kontoen din manuelt hvis du sletter den innen fem dager etter den første betalingen.

Denne prosessen tar vanligvis mindre enn 24 timer og ble implementert fordi brukere spammet tjenesten vår, og deretter raskt slettet kontoene sine – noe som forhindret oss i å blokkere fingeravtrykkene deres for betalingsmetodene i Stripe.

## Ytterligere opplysninger {#additional-disclosures}

Dette nettstedet er beskyttet av Cloudflare, og [Personvernerklæring](https://www.cloudflare.com/privacypolicy/) og [Vilkår for bruk](https://www.cloudflare.com/website-terms/) gjelder.