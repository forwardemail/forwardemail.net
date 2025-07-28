# Domande frequenti {#frequently-asked-questions}

<img caricamento="pigro" src="/img/articles/faq.webp" alt="" classe="arrotondato-lg" />

## Indice {#table-of-contents}

* [Avvio rapido](#quick-start)
* [Introduzione](#introduction)
  * [Che cosa è l'inoltro e-mail](#what-is-forward-email)
  * [Chi utilizza Inoltra e-mail](#who-uses-forward-email)
  * [Qual è la cronologia di Forward Email](#what-is-forward-emails-history)
  * [Quanto è veloce questo servizio?](#how-fast-is-this-service)
* [Client di posta elettronica](#email-clients)
  * [Thunderbird](#thunderbird)
  * [Microsoft Outlook](#microsoft-outlook)
  * [Apple Mail](#apple-mail)
  * [Dispositivi mobili](#mobile-devices)
  * [Come inviare email usando Gmail](#how-to-send-mail-as-using-gmail)
  * [Qual è la guida gratuita legacy per Invia posta come tramite Gmail?](#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail)
  * [Configurazione avanzata del routing di Gmail](#advanced-gmail-routing-configuration)
  * [Configurazione avanzata del routing di Outlook](#advanced-outlook-routing-configuration)
* [Risoluzione dei problemi](#troubleshooting)
  * [Perché non ricevo le mie email di prova?](#why-am-i-not-receiving-my-test-emails)
  * [Come faccio a configurare il mio client di posta elettronica per funzionare con Inoltra email?](#how-do-i-configure-my-email-client-to-work-with-forward-email)
  * [Perché le mie email finiscono nella cartella Spam e Posta Indesiderata e come posso controllare la reputazione del mio dominio?](#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation)
  * [Cosa devo fare se ricevo email di spam?](#what-should-i-do-if-i-receive-spam-emails)
  * [Perché le email di prova che mi sono state inviate in Gmail vengono visualizzate come "sospette"?](#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious)
  * [Posso rimuovere via forwardemail dot net in Gmail?](#can-i-remove-the-via-forwardemail-dot-net-in-gmail)
* [Gestione dei dati](#data-management)
  * [Dove si trovano i tuoi server?](#where-are-your-servers-located)
  * [Come faccio a esportare ed effettuare il backup della mia casella di posta?](#how-do-i-export-and-backup-my-mailbox)
  * [Come posso importare e migrare la mia casella di posta esistente?](#how-do-i-import-and-migrate-my-existing-mailbox)
  * [Supporti l'auto-hosting?](#do-you-support-self-hosting)
* [Configurazione e-mail](#email-configuration)
  * [Come posso iniziare e configurare l'inoltro delle email?](#how-do-i-get-started-and-set-up-email-forwarding)
  * [Posso utilizzare più scambi e server MX per l'inoltro avanzato](#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding)
  * [Come posso impostare un risponditore automatico per assenza?](#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder)
  * [Come posso impostare SPF per l'inoltro delle email?](#how-do-i-set-up-spf-for-forward-email)
  * [Come posso impostare DKIM per l'inoltro delle email?](#how-do-i-set-up-dkim-for-forward-email)
  * [Come faccio a impostare DMARC per l'inoltro delle email?](#how-do-i-set-up-dmarc-for-forward-email)
  * [Come posso connettere e configurare i miei contatti?](#how-do-i-connect-and-configure-my-contacts)
  * [Come posso connettere e configurare i miei calendari?](#how-do-i-connect-and-configure-my-calendars)
  * [Come posso aggiungere altri calendari e gestire quelli esistenti?](#how-do-i-add-more-calendars-and-manage-existing-calendars)
  * [Come posso impostare SRS per l'inoltro delle email?](#how-do-i-set-up-srs-for-forward-email)
  * [Come posso configurare MTA-STS per l'inoltro delle email?](#how-do-i-set-up-mta-sts-for-forward-email)
  * [Come faccio ad aggiungere un'immagine del profilo al mio indirizzo email?](#how-do-i-add-a-profile-picture-to-my-email-address)
* [Funzionalità avanzate](#advanced-features)
  * [Supportate newsletter o mailing list per e-mail relative al marketing?](#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email)
  * [Supportate l'invio di e-mail con API?](#do-you-support-sending-email-with-api)
  * [Supportate la ricezione di e-mail con IMAP?](#do-you-support-receiving-email-with-imap)
  * [Supporti POP3?](#do-you-support-pop3)
  * [Supportate i calendari (CalDAV)](#do-you-support-calendars-caldav)
  * [Supportate i contatti (CardDAV)](#do-you-support-contacts-carddav)
  * [Supportate l'invio di e-mail con SMTP?](#do-you-support-sending-email-with-smtp)
  * [Supporti OpenPGP/MIME, la crittografia end-to-end ("E2EE") e Web Key Directory ("WKD")](#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd)
  * [Supporti MTA-STS?](#do-you-support-mta-sts)
  * [Supportate le passkey e WebAuthn?](#do-you-support-passkeys-and-webauthn)
  * [Supporti le migliori pratiche di posta elettronica?](#do-you-support-email-best-practices)
  * [Supportate i webhook di rimbalzo?](#do-you-support-bounce-webhooks)
  * [Supportate i webhook?](#do-you-support-webhooks)
  * [Supporti espressioni regolari o regex?](#do-you-support-regular-expressions-or-regex)
  * [Quali sono i limiti SMTP in uscita?](#what-are-your-outbound-smtp-limits)
  * [Ho bisogno dell'approvazione per abilitare SMTP?](#do-i-need-approval-to-enable-smtp)
  * [Quali sono le impostazioni di configurazione del server SMTP?](#what-are-your-smtp-server-configuration-settings)
  * [Quali sono le impostazioni di configurazione del server IMAP?](#what-are-your-imap-server-configuration-settings)
  * [Quali sono le impostazioni di configurazione del server POP3?](#what-are-your-pop3-server-configuration-settings)
  * [Configurazione del relay SMTP Postfix](#postfix-smtp-relay-configuration)
* [Sicurezza](#security)
  * [Tecniche avanzate di rafforzamento del server](#advanced-server-hardening-techniques)
  * [Hai certificazioni SOC 2 o ISO 27001?](#do-you-have-soc-2-or-iso-27001-certifications)
  * [Utilizzi la crittografia TLS per l'inoltro delle e-mail?](#do-you-use-tls-encryption-for-email-forwarding)
  * [Si conservano le intestazioni di autenticazione e-mail?](#do-you-preserve-email-authentication-headers)
  * [Conservi le intestazioni originali delle email e impedisci lo spoofing?](#do-you-preserve-original-email-headers-and-prevent-spoofing)
  * [Come proteggersi dallo spam e dagli abusi](#how-do-you-protect-against-spam-and-abuse)
  * [Memorizzi il contenuto della posta elettronica su disco?](#do-you-store-email-content-on-disk)
  * [Il contenuto della posta elettronica può essere esposto durante gli arresti anomali del sistema?](#can-email-content-be-exposed-during-system-crashes)
  * [Chi ha accesso alla tua infrastruttura di posta elettronica](#who-has-access-to-your-email-infrastructure)
  * [Quali fornitori di infrastrutture utilizzi?](#what-infrastructure-providers-do-you-use)
  * [Offrite un accordo sul trattamento dei dati (DPA)?](#do-you-offer-a-data-processing-agreement-dpa)
  * [Come gestisci le notifiche di violazione dei dati?](#how-do-you-handle-data-breach-notifications)
  * [Offrite un ambiente di test?](#do-you-offer-a-test-environment)
  * [Fornite strumenti di monitoraggio e di avviso?](#do-you-provide-monitoring-and-alerting-tools)
  * [Come garantire un'elevata disponibilità](#how-do-you-ensure-high-availability)
  * [Sei conforme alla Sezione 889 del National Defense Authorization Act (NDAA)?](#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa)
* [Dettagli tecnici e di sistema](#system-and-technical-details)
  * [Memorizzi le email e il loro contenuto?](#do-you-store-emails-and-their-contents)
  * [Come funziona il tuo sistema di inoltro e-mail](#how-does-your-email-forwarding-system-work)
  * [Come si elabora un'e-mail per l'inoltro?](#how-do-you-process-an-email-for-forwarding)
  * [Come gestisci i problemi di recapito delle email?](#how-do-you-handle-email-delivery-issues)
  * [Come gestisci il blocco dei tuoi indirizzi IP?](#how-do-you-handle-your-ip-addresses-becoming-blocked)
  * [Cosa sono gli indirizzi dei direttori delle poste?](#what-are-postmaster-addresses)
  * [Cosa sono gli indirizzi di non risposta](#what-are-no-reply-addresses)
  * [Quali sono gli indirizzi IP del tuo server?](#what-are-your-servers-ip-addresses)
  * [Hai una lista consentita?](#do-you-have-an-allowlist)
  * [Quali estensioni di nomi di dominio sono consentite per impostazione predefinita](#what-domain-name-extensions-are-allowlisted-by-default)
  * [Quali sono i criteri della tua lista consentita?](#what-is-your-allowlist-criteria)
  * [Quali estensioni di dominio possono essere utilizzate gratuitamente](#what-domain-name-extensions-can-be-used-for-free)
  * [Hai una lista grigia?](#do-you-have-a-greylist)
  * [Hai una lista di rifiuto?](#do-you-have-a-denylist)
  * [Hai un limite di velocità?](#do-you-have-rate-limiting)
  * [Come proteggersi dalla retrodiffusione](#how-do-you-protect-against-backscatter)
  * [Impedisci i rimbalzi degli spammer MAIL FROM noti](#prevent-bounces-from-known-mail-from-spammers)
  * [Previeni rimbalzi non necessari per proteggerti dalla retrodispersione](#prevent-unnecessary-bounces-to-protect-against-backscatter)
  * [Come si determina l'impronta digitale di un'email?](#how-do-you-determine-an-email-fingerprint)
  * [Posso inoltrare le email a porte diverse dalla 25 (ad esempio se il mio ISP ha bloccato la porta 25)](#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25)
  * [Supporta il simbolo più + per gli alias di Gmail?](#does-it-support-the-plus--symbol-for-gmail-aliases)
  * [Supporta i sottodomini](#does-it-support-sub-domains)
  * [Questo inoltra le intestazioni della mia email](#does-this-forward-my-emails-headers)
  * [È ben testato?](#is-this-well-tested)
  * [Trasmetti messaggi e codici di risposta SMTP](#do-you-pass-along-smtp-response-messages-and-codes)
  * [Come prevenire gli spammer e garantire una buona reputazione nell'inoltro delle e-mail](#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation)
  * [Come si eseguono le ricerche DNS sui nomi di dominio](#how-do-you-perform-dns-lookups-on-domain-names)
* [Account e fatturazione](#account-and-billing)
  * [Offrite una garanzia di rimborso sui piani a pagamento?](#do-you-offer-a-money-back-guarantee-on-paid-plans)
  * [Se cambio piano, mi fate pagare in modo proporzionale e mi rimborsate la differenza?](#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference)
  * [Posso utilizzare questo servizio di inoltro e-mail solo come server MX di "fallback" o "fallover"?](#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server)
  * [Posso disabilitare alias specifici](#can-i-disable-specific-aliases)
  * [Posso inoltrare le email a più destinatari?](#can-i-forward-emails-to-multiple-recipients)
  * [Posso avere più destinatari globali catch-all?](#can-i-have-multiple-global-catch-all-recipients)
  * [Esiste un limite massimo al numero di indirizzi email a cui posso inoltrare per alias?](#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias)
  * [Posso inoltrare ricorsivamente le email?](#can-i-recursively-forward-emails)
  * [Le persone possono annullare la registrazione o registrare il mio inoltro e-mail senza il mio permesso?](#can-people-unregister-or-register-my-email-forwarding-without-my-permission)
  * [Come è gratuito?](#how-is-it-free)
  * [Qual è il limite massimo di dimensione dell'email?](#what-is-the-max-email-size-limit)
  * [Memorizzi i registri delle e-mail?](#do-you-store-logs-of-emails)
  * [Memorizzi i registri degli errori?](#do-you-store-error-logs)
  * [Leggi le mie email?](#do-you-read-my-emails)
  * [Posso "inviare posta come" in Gmail con questo](#can-i-send-mail-as-in-gmail-with-this)
  * [Posso "inviare posta come" in Outlook con questo](#can-i-send-mail-as-in-outlook-with-this)
  * [Posso "inviare posta come" in Apple Mail e iCloud Mail con questo](#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this)
  * [Posso inoltrare email illimitate con questo](#can-i-forward-unlimited-emails-with-this)
  * [Offrite domini illimitati a un prezzo unico?](#do-you-offer-unlimited-domains-for-one-price)
  * [Quali metodi di pagamento accettate?](#which-payment-methods-do-you-accept)
* [Risorse aggiuntive](#additional-resources)

## Avvio rapido {#quick-start}

Per iniziare a utilizzare Inoltra email:

1. **Crea un account** su [forwardemail.net/register](https://forwardemail.net/register)

2. **Aggiungi e verifica il tuo dominio** in [Il mio account → Domini](/my-account/domains)

3. **Aggiungi e configura alias/caselle di posta elettronica** in [Il mio account → Domini](/my-account/domains) → Alias

4. **Testa la tua configurazione** inviando un'e-mail a uno dei tuoi nuovi alias

> \[!TIP]
> Le modifiche DNS possono richiedere fino a 24-48 ore per propagarsi a livello globale, anche se spesso entrano in vigore molto prima.

> \[!IMPORTANT]
> Per una migliore recapitabilità, consigliamo di impostare i record [SPF](#how-do-i-set-up-spf-for-forward-email), [DKIM](#how-do-i-set-up-dkim-for-forward-email) e [DMARC](#how-do-i-set-up-dmarc-for-forward-email).

## Introduzione {#introduction}

### Che cos'è l'inoltro email {#what-is-forward-email}

> \[!NOTE]
> Forward Email è perfetto per privati, piccole imprese e sviluppatori che desiderano indirizzi email professionali senza i costi e la manutenzione di una soluzione di hosting email completa.

Forward Email è un **fornitore di servizi di posta elettronica completo** e un **fornitore di hosting di posta elettronica per nomi di dominio personalizzati**.

È l'unico servizio gratuito e open source che ti consente di utilizzare indirizzi email di dominio personalizzati senza la complessità di dover configurare e gestire un tuo server di posta elettronica.

Il nostro servizio inoltra le email inviate al tuo dominio personalizzato al tuo account email esistente. Puoi anche utilizzarci come provider di hosting email dedicato.

Caratteristiche principali di Forward Email:

* **Email di dominio personalizzata**: utilizza indirizzi email professionali con il tuo nome di dominio
* **Livello gratuito**: inoltro email di base gratuito
* **Privacy avanzata**: non leggiamo le tue email né vendiamo i tuoi dati
* **Open Source**: il nostro intero codice sorgente è disponibile su GitHub
* **Supporto SMTP, IMAP e POP3**: funzionalità complete di invio e ricezione email
* **Crittografia end-to-end**: supporto per OpenPGP/MIME
* **Alias catch-all personalizzati**: crea alias email illimitati

Puoi confrontarci con oltre 56 altri fornitori di servizi di posta elettronica su [la nostra pagina di confronto e-mail](/blog/best-email-service).

> \[!TIP]
> Scopri di più su Inoltra email leggendo il nostro [Whitepaper tecnico](/technical-whitepaper.pdf) gratuito

### Chi utilizza Inoltra email {#who-uses-forward-email}

Forniamo servizi di hosting e inoltro e-mail a oltre 500.000 domini e ai seguenti utenti illustri:

| Cliente | Caso di studio |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Accademia navale degli Stati Uniti | [:page_facing_up: Case Study](/blog/docs/federal-government-email-service-section-889-compliant) |
| Canonico | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| Giochi Netflix |  |
| La Fondazione Linux | [:page_facing_up: Case Study](/blog/docs/linux-foundation-email-enterprise-case-study) |
| La Fondazione PHP |  |
| Fox News Radio |  |
| Vendite pubblicitarie Disney |  |
| jQuery | [:page_facing_up: Case Study](/blog/docs/linux-foundation-email-enterprise-case-study) |
| LineageOS |  |
| Ubuntu | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| Gratuito | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| Lubuntu | [:page_facing_up: Case Study](/blog/docs/canonical-ubuntu-email-enterprise-case-study) |
| L'Università di Cambridge | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| L'Università del Maryland | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| L'Università di Washington | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| Università di Tufts | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| Swarthmore College | [:page_facing_up: Case Study](/blog/docs/alumni-email-forwarding-university-case-study) |
| Governo dell'Australia Meridionale |  |
| Governo della Repubblica Dominicana |  |
| Vola<span>.</span>io |  |
| RCD Hotels |  |
| Isaac Z. Schlueter (npm) | [:page_facing_up: Case Study](/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem) |
| David Heinemeier Hansson (Ruby on Rails) |  |

### Qual è la cronologia di Forward Email {#what-is-forward-emails-history}

Per ulteriori informazioni su Inoltra email, visita [la nostra pagina Chi siamo](/about).

### Quanto è veloce questo servizio {#how-fast-is-this-service}

> \[!NOTE]
> Il nostro sistema è progettato per garantire velocità e affidabilità, con più server ridondanti per garantire la consegna tempestiva delle tue email.

Forward Email recapita i messaggi con un ritardo minimo, in genere entro pochi secondi dalla ricezione.

Misure di prestazione:

* **Tempo medio di consegna**: Meno di 5-10 secondi dalla ricezione all'inoltro ([consulta la nostra pagina di monitoraggio "TTI" del tempo di ricezione della posta in arrivo](/tti))
* **Uptime**: Disponibilità del servizio superiore al 99,9%
* **Infrastruttura globale**: Server posizionati strategicamente per un routing ottimale
* **Ridimensionamento automatico**: Il nostro sistema si adatta ai periodi di picco delle e-mail

Operiamo in tempo reale, a differenza di altri fornitori che si affidano a code di attesa.

Non scriviamo su disco né memorizziamo registri: con [eccezione di errori](#do-you-store-error-logs) e [SMTP in uscita](#do-you-support-sending-email-with-smtp) (vedere [politica sulla riservatezza](/privacy)).

Tutto viene eseguito in memoria e [il nostro codice sorgente è su GitHub](https://github.com/forwardemail).

## Client di posta elettronica {#email-clients}

### Thunderbird {#thunderbird}

1. Crea un nuovo alias e genera una password nella dashboard di Inoltro email.
2. Apri Thunderbird e vai su **Modifica → Impostazioni account → Azioni account → Aggiungi account email**.
3. Inserisci il tuo nome, l'indirizzo email di inoltro e la password.
4. Fai clic su **Configura manualmente** e inserisci:
* In arrivo: IMAP, `imap.forwardemail.net`, porta 993, SSL/TLS
* In uscita: SMTP, `smtp.forwardemail.net`, porta 587, STARTTLS
5. Fai clic su **Fine**

### Microsoft Outlook {#microsoft-outlook}

1. Crea un nuovo alias e genera una password nella dashboard di Inoltro email
2. Vai su **File → Aggiungi account**
3. Inserisci il tuo indirizzo email di inoltro e fai clic su **Connetti**
4. Scegli **Opzioni avanzate** e seleziona **Consenti configurazione manuale dell'account**
5. Seleziona **IMAP** e inserisci:
* In arrivo: `imap.forwardemail.net`, porta 993, SSL
* In uscita: `smtp.forwardemail.net`, porta 587, TLS
* Nome utente: il tuo indirizzo email completo
* Password: la password generata
6. Fai clic su **Connetti**

### Posta di Apple {#apple-mail}

1. Crea un nuovo alias e genera una password nella dashboard di Inoltro email
2. Vai a **Mail → Preferenze → Account → +**
3. Seleziona **Altro account di posta**
4. Inserisci il tuo nome, l'indirizzo email di inoltro e la password
5. Per le impostazioni del server, inserisci:
* In arrivo: `imap.forwardemail.net`
* In uscita: `smtp.forwardemail.net`
* Nome utente: il tuo indirizzo email completo
* Password: la password generata
6. Fai clic su **Accedi**

### Dispositivi mobili {#mobile-devices}

Per iOS:

1. Vai su **Impostazioni → Posta → Account → Aggiungi account → Altro**
2. Tocca **Aggiungi account di posta** e inserisci i tuoi dati
3. Per le impostazioni del server, utilizza le stesse impostazioni IMAP e SMTP di cui sopra

Per Android:

1. Vai a **Impostazioni → Account → Aggiungi account → Personale (IMAP)**
2. Inserisci il tuo indirizzo email di inoltro e la password
3. Per le impostazioni del server, utilizza le stesse impostazioni IMAP e SMTP di cui sopra

### Come inviare email utilizzando Gmail {#how-to-send-mail-as-using-gmail}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Tempo di configurazione stimato:</strong>
<span>Meno di 10 minuti</span>
</div>

<div class="alert mb-3 alert-success">
<i class="fa fa-bullhorn font-weight-bold"></i>
<strong class="font-weight-bold">
Per iniziare:
</strong>
<span>
Se hai seguito le istruzioni riportate sopra nella sezione <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">Come iniziare e configurare l'inoltro email</a>, puoi continuare a leggere qui sotto.
</span>
</div>

<div id="invia-e-mail-come-contenuto">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Importante:
</strong>
<span>
Assicurati di aver letto i nostri <a href="/terms" class="alert-link" target="_blank">Termini</a>, l'<a href="/privacy" class="alert-link" target="_blank">Informativa sulla privacy</a> e i <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Limiti SMTP in uscita</a>: il tuo utilizzo è considerato un'accettazione e un consenso.
</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Importante:
</strong>
<span>
Se sei uno sviluppatore, consulta la nostra <a class="alert-link" href="/email-api#outbound-emails" target="_blank">documentazione API email</a>.
</span>
</div>

1. Vai a <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Il mio account <i class="fa fa-angle-right"></i> Domini</a> <i class="fa fa-angle-right"></i> Impostazioni <i class="fa fa-angle-right"></i> Configurazione SMTP in uscita e segui le istruzioni di configurazione

2. Crea un nuovo alias per il tuo dominio in <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Il mio account <i class="fa fa-angle-right"></i> Domini</a> <i class="fa fa-angle-right"></i> Alias (ad esempio <code><hello@example.com></code>)

3. Fai clic su <strong class="text-success"><i class="fa fa-key"></i>Genera password</strong> accanto all'alias appena creato. Copia negli appunti e conserva in modo sicuro la password generata visualizzata sullo schermo.

4. Vai a [Gmail](https://gmail.com) e sotto [Impostazioni <i class="fa fa-angle-right"></i> Account e importazione <i class="fa fa-angle-right"></i> Invia e-mail come](https://mail.google.com/mail/u/0/#settings/accounts), clicca su "Aggiungi un altro indirizzo email"

5. Quando viene richiesto "Nome", inserisci il nome con cui vuoi che venga visualizzata la tua email come "Da" (ad esempio "Linus Torvalds").

6. Quando ti viene richiesto di inserire un "Indirizzo email", inserisci l'indirizzo email completo di un alias creato in <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Il mio account <i class="fa fa-angle-right"></i> Domini</a> <i class="fa fa-angle-right"></i> Alias (ad esempio <code><hello@example.com></code>)

7. Deseleziona "Considera come un alias"

8. Fare clic su "Passaggio successivo" per procedere

9. Quando viene richiesto "Server SMTP", immettere <code>smtp.forwardemail.net</code> e lasciare la porta come <code>587</code>

10. Quando ti viene richiesto di inserire "Nome utente", inserisci l'indirizzo email completo di un alias creato in <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Il mio account <i class="fa fa-angle-right"></i> Domini</a> <i class="fa fa-angle-right"></i> Alias (ad esempio <code><hello@example.com></code>)

11. Quando viene richiesta la "Password", incolla la password da <strong class="text-success"><i class="fa fa-key"></i> Genera password</strong> nel passaggio 3 sopra

12. Lasciare selezionato il pulsante di opzione "Connessione protetta tramite TLS"

13. Fare clic su "Aggiungi account" per procedere

14. Apri una nuova scheda su [Gmail](https://gmail.com) e attendi l'arrivo dell'email di verifica (riceverai un codice di verifica che conferma che sei il proprietario dell'indirizzo email che stai tentando di "Inviare email come")

15. Una volta arrivato, copia e incolla il codice di verifica nel prompt ricevuto nel passaggio precedente

16. Una volta fatto questo, torna all'email e clicca sul link per "confermare la richiesta". Molto probabilmente dovrai ripetere questo passaggio e quello precedente affinché l'email sia configurata correttamente.

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Congratulazioni!
</strong>
<span>
Hai completato con successo tutti i passaggi.
</span>
</div>
</div>

</div>

### Qual è la guida gratuita legacy per Invia posta come tramite Gmail {#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail}

<div class="alert my-3 alert-danger"><i class="fa fa-stop-circle font-weight-bold"></i> <strong class="font-weight-bold">Importante:</strong> questa guida gratuita è obsoleta da maggio 2023, poiché <a class="alert-link" href="/faq#do-you-support-sending-email-with-smtp">we ora supporta SMTP in uscita</a>. Se utilizzi la guida qui sotto, <a class="alert-link" href="/faq#can-i-remove-the-via-forwardemail-dot-net-in-gmail">this farà sì che la tua email in uscita</a> riporti "<span class="notranslate text-danger font-weight-bold">via forwardemail dot net</span>" in Gmail.</a></div>

<div class="alert mb-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Tempo di configurazione stimato:</strong>
<span>Meno di 10 minuti</span>
</div>

<div class="alert mb-3 alert-success">
<i class="fa fa-bullhorn font-weight-bold"></i>
<strong class="font-weight-bold">
Per iniziare:
</strong>
<span>
Se hai seguito le istruzioni riportate sopra nella sezione <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">Come iniziare e configurare l'inoltro email</a>, puoi continuare a leggere qui sotto.
</span>
</div>

<div class="mx-auto lazyframe lazyframe-bordered border border-themed mb-3" data-vendor="youtube_nocookie" title="Come inviare email usando Gmail" data-src="https://www.youtube-nocookie.com/embed/MEheS8gM4Xs?autoplay=0"></div>

<div id="legacy-free-guide">

1. Per funzionare, è necessario che [l'autenticazione a due fattori di Gmail][gmail-2fa] sia abilitata. Visita <https://www.google.com/landing/2step/> se non l'hai abilitata.

2. Una volta abilitata l'autenticazione a due fattori (o se l'avevi già abilitata), visita <https://myaccount.google.com/apppasswords>.

3. Quando viene richiesto "Seleziona l'app e il dispositivo per cui desideri generare la password dell'app":
* Seleziona "Mail" dal menu a discesa "Seleziona app"
* Seleziona "Altro" dal menu a discesa "Seleziona dispositivo"
* Quando viene richiesto di inserire del testo, inserisci l'indirizzo email del tuo dominio personalizzato da cui stai effettuando l'inoltro (ad esempio <code><hello@example.com></code> - questo ti aiuterà a tenere traccia nel caso in cui utilizzi questo servizio per più account)

4. Copia negli appunti la password generata automaticamente
<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Importante:
</strong>
<span>
Se utilizzi G Suite, visita il pannello di amministrazione <a class="alert-link" href="https://admin.google.com/AdminHome#ServiceSettings/service=email&subtab=filters" rel="noopener noreferrer" target="_blank">App <i class="fa fa-angle-right"></i> Impostazioni di G Suite <i class="fa fa-angle-right"></i> Impostazioni di Gmail <i class="fa fa-angle-right"></i> Impostazioni</a> e assicurati di selezionare "Consenti agli utenti di inviare email tramite un server SMTP esterno...". L'attivazione di questa modifica potrebbe richiedere qualche minuto, quindi attendi qualche minuto.
</span>
</div>

5. Vai a [Gmail](https://gmail.com) e sotto [Impostazioni <i class="fa fa-angle-right"></i> Account e importazione <i class="fa fa-angle-right"></i> Invia e-mail come](https://mail.google.com/mail/u/0/#settings/accounts), clicca su "Aggiungi un altro indirizzo email"

6. Quando ti viene richiesto "Nome", inserisci il nome con cui vuoi che venga visualizzata la tua email come "Da" (ad esempio "Linus Torvalds")

7. Quando ti viene richiesto "Indirizzo email", inserisci l'indirizzo email con il dominio personalizzato che hai utilizzato sopra (ad esempio <code><hello@example.com></code>)

8. Deseleziona "Considera come un alias"

9. Fare clic su "Passaggio successivo" per procedere

10. Quando viene richiesto "Server SMTP", immettere <code>smtp.gmail.com</code> e lasciare la porta come <code>587</code>

11. Quando ti viene richiesto di inserire "Nome utente", inserisci la parte del tuo indirizzo Gmail senza la parte <span>gmail.com</span> (ad esempio, solo "utente" se il mio indirizzo email è <span><utente@gmail.com></span>)
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Importante:
</strong>
<span>
Se la parte "Nome utente" viene compilata automaticamente, <u><strong>dovrai modificarla</strong></u> con la parte relativa al nome utente del tuo indirizzo Gmail.
</span>
</div>

12. Quando ti viene richiesta la "Password", incolla dagli appunti la password generata nel passaggio 2 sopra.

13. Lasciare selezionato il pulsante di opzione "Connessione protetta tramite TLS"

14. Fare clic su "Aggiungi account" per procedere

15. Apri una nuova scheda su [Gmail](https://gmail.com) e attendi l'arrivo dell'email di verifica (riceverai un codice di verifica che conferma che sei il proprietario dell'indirizzo email che stai tentando di "Inviare email come")

16. Una volta arrivato, copia e incolla il codice di verifica nel prompt ricevuto nel passaggio precedente

17. Una volta fatto questo, torna all'email e clicca sul link per "confermare la richiesta". Molto probabilmente dovrai ripetere questo passaggio e quello precedente affinché l'email sia configurata correttamente.

</div>

### Configurazione avanzata del routing di Gmail {#advanced-gmail-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Tempo di configurazione stimato:</strong>
<span>15-30 minuti</span>
</div>

Se vuoi impostare il routing avanzato in Gmail in modo che gli alias che non corrispondono a una casella di posta vengano inoltrati agli scambi di posta di Forward Email, segui questi passaggi:

1. Accedi alla Console di amministrazione Google all'indirizzo [admin.google.com](https://admin.google.com)
2. Vai su **App → Google Workspace → Gmail → Routing**
3. Fai clic su **Aggiungi percorso** e configura le seguenti impostazioni:

**Impostazioni destinatario singolo:**

* Seleziona "Cambia destinatario busta" e inserisci il tuo indirizzo Gmail principale.
* Seleziona "Aggiungi intestazione X-Gm-Original-To con destinatario originale".

**Modelli di destinatari delle buste:**

* Aggiungi un modello che corrisponda a tutte le cassette postali inesistenti (ad esempio, `.*@yourdomain.com`)

**Impostazioni del server di posta elettronica:**

* Seleziona "Instrada verso l'host" e inserisci `mx1.forwardemail.net` come server primario
* Aggiungi `mx2.forwardemail.net` come server di backup
* Imposta la porta su 25
* Seleziona "Richiedi TLS" per sicurezza

4. Fare clic su **Salva** per creare il percorso

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Importante:
</strong>
<span>
Questa configurazione funziona solo per gli account Google Workspace con domini personalizzati, non per gli account Gmail standard.
</span>
</div>

### Configurazione avanzata del routing di Outlook {#advanced-outlook-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Tempo di configurazione stimato:</strong>
<span>15-30 minuti</span>
</div>

Per gli utenti di Microsoft 365 (in precedenza Office 365) che desiderano configurare il routing avanzato in modo che gli alias che non corrispondono a una casella di posta vengano inoltrati agli scambi di posta di Forward Email:

1. Accedi all'interfaccia di amministrazione di Microsoft 365 all'indirizzo [admin.microsoft.com](https://admin.microsoft.com)
2. Vai a **Exchange → Flusso di posta → Regole**
3. Fai clic su **Aggiungi una regola** e seleziona **Crea una nuova regola**
4. Assegna un nome alla regola (ad esempio, "Inoltra caselle di posta inesistenti a Inoltra email")
5. In **Applica questa regola se**, seleziona:
* "L'indirizzo del destinatario corrisponde a..."
* Inserisci un modello che corrisponda a tutti gli indirizzi del tuo dominio (ad esempio, `*@yourdomain.com`)
6. In **Esegui la seguente operazione**, seleziona:
* "Reindirizza il messaggio a..."
* Scegli "Il seguente server di posta"
* Inserisci `mx1.forwardemail.net` e la porta 25
* Aggiungi `mx2.forwardemail.net` come server di backup
7. In **Tranne se**, seleziona:
* "Il destinatario è..."
* Aggiungi tutte le caselle di posta esistenti che non devono essere inoltrate
8. Imposta la priorità della regola per assicurarti che venga eseguita dopo Altre regole del flusso di posta
9. Fare clic su **Salva** per attivare la regola

## Risoluzione dei problemi {#troubleshooting}

### Perché non ricevo le mie email di prova {#why-am-i-not-receiving-my-test-emails}

Se stai inviando un'e-mail di prova a te stesso, questa potrebbe non comparire nella posta in arrivo perché ha la stessa intestazione "Message-ID".

Si tratta di un problema ampiamente noto e riguarda anche servizi come Gmail. <a href="https://support.google.com/a/answer/1703601">Here è la risposta ufficiale di Gmail in merito a questo problema</a>.

Se i problemi persistono, è molto probabile che si tratti di un problema di propagazione DNS. Dovrai attendere ancora un po' e riprovare (oppure provare a impostare un valore TTL inferiore per i record <strong class="notranslate">TXT</strong>).

**Hai ancora problemi?** Ti preghiamo di <a href="/help">contattarci</a> così possiamo aiutarti a indagare sul problema e trovare una rapida soluzione.

### Come faccio a configurare il mio client di posta elettronica per funzionare con Inoltra email {#how-do-i-configure-my-email-client-to-work-with-forward-email}

<div class="mb-3">
Il nostro servizio funziona con i client di posta elettronica più diffusi, come:
<ul class="ml-1 h4 d-inline list-inline mb-0 pl-0">
<li class="list-inline-item"><a href="/blog/open-source/apple-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Apple&reg;</a></li>
<li class="list-inline-item"><a href="/blog/open-source/windows-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Windows&reg;</a></li>
<li class="list-inline-item"><a href="/blog/open-source/android-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-android"></i> Android&trade;</a></li>
<li class="list-inline-item"><a href="/blog/open-source/linux-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-linux"></i> Linux&reg;</a></li>
<li class="list-inline-item"><a href="/blog/open-source/desktop-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fas fa-desktop"></i> Desktop</a></li>
<li class="list-inline-item"><a href="/blog/open-source/mozilla-firefox-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-firefox-browser"></i> Mozilla Firefox&reg;</a></li>
<li class="list-inline-item"><a href="/blog/open-source/safari-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Safari&reg;</a></li>
<li class="list-inline-item"><a href="/blog/open-source/google-chrome-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-chrome"></i> Google Chrome&reg;</a></li>
<li class="list-inline-item"><a href="/blog/open-source/terminal-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fas fa-terminal"></i>Terminale</a></li>
  </ul>
</div>

<div class="alert alert-primary">
Il tuo nome utente è l'indirizzo email del tuo alias e la password è quella di <strong class="text-success"><i class="fa fa-key"></i> Genera password</strong> ("Password normale").
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Suggerimento:
</strong>
<span>Se utilizzi Thunderbird, assicurati che "Sicurezza connessione" sia impostata su "SSL/TLS" e che il metodo di autenticazione sia impostato su "Password normale".</span>
</div>

| Tipo | Nome host | Protocollo | porti |
| :--: | :---------------------: | :-------------------------------------: | :----------------------------------------------------------------------------------: |
| IMAP | `imap.forwardemail.net` | SSL/TLS **Preferito** | `993` e `2993` |
| SMTP | `smtp.forwardemail.net` | SSL/TLS **Preferito** o TLS (STARTTLS) | `465` e `2465` per SSL/TLS (o) `587`, `2587`, `2525` e `25` per TLS (STARTTLS) |

### Perché le mie email finiscono nella cartella Spam e Posta indesiderata e come posso controllare la reputazione del mio dominio? {#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation}

Questa sezione ti guiderà nel caso in cui la tua posta in uscita utilizzi i nostri server SMTP (ad esempio `smtp.forwardemail.net`) (o venga inoltrata tramite `mx1.forwardemail.net` o `mx2.forwardemail.net`) e venga recapitata nella cartella Spam o Posta indesiderata dei destinatari.

Monitoriamo regolarmente il nostro [indirizzi IP](#what-are-your-servers-ip-addresses) rispetto a [tutte le denylist DNS affidabili](#how-do-you-handle-your-ip-addresses-becoming-blocked), **quindi è molto probabile che si tratti di un problema specifico della reputazione del dominio**.

Le email possono finire nelle cartelle spam per diversi motivi:

1. **Autenticazione mancante**: impostare i record [SPF](#how-do-i-set-up-spf-for-forward-email), [DKIM](#how-do-i-set-up-dkim-for-forward-email) e [DMARC](#how-do-i-set-up-dmarc-for-forward-email).

2. **Reputazione del dominio**: i nuovi domini hanno spesso una reputazione neutrale finché non viene stabilita una cronologia di invio.

3. **Trigger di contenuto**: determinate parole o frasi possono attivare i filtri antispam.

4. **Modelli di invio**: aumenti improvvisi del volume di posta elettronica possono sembrare sospetti.

Puoi provare a utilizzare uno o più di questi strumenti per verificare la reputazione e la categorizzazione del tuo dominio:

| Nome dello strumento | URL | Tipo |
| ------------------------------------------- | ---------------------------------------------------------------- | ---------------------- |
| Feedback sulla categorizzazione del dominio Cloudflare | <https://radar.cloudflare.com/domains/feedback> | Categorizzazione |
| Controllo della reputazione IP e del dominio di Spamhaus | <https://check.spamhaus.org/> | DNSBL |
| Cisco Talos IP e Domain Reputation Center | <https://talosintelligence.com/reputation_center> | Reputazione |
| Ricerca di reputazione IP e dominio Barracuda | <https://www.barracudacentral.org/lookups/lookup-reputation> | DNSBL |
| Controllo della lista nera di MX Toolbox | <https://mxtoolbox.com/blacklists.aspx> | Lista nera |
| Strumenti Google Postmaster | <https://www.gmail.com/postmaster/> | Reputazione |
| Yahoo Sender Hub | <https://senders.yahooinc.com/> | Reputazione |
| Controllo della lista nera di MultiRBL.valli.org | <https://multirbl.valli.org/lookup/> | DNSBL |
| Punteggio del mittente | <https://senderscore.org/act/blocklist-remover/> | Reputazione |
| Svalutazione | <https://www.invaluement.com/lookup/> | DNSBL |
| SURBL | <https://www.surbl.org/> | DNSBL |
| Rimozione IP Apple/Proofpoint | <https://ipcheck.proofpoint.com/> | Rimozione |
| Rimozione IP Cloudmark | <https://csi.cloudmark.com/it/reset/> | Rimozione |
| SpamCop | <https://www.spamcop.net/bl.shtml> | DNSBL |
| Rimozione dell'IP di Microsoft Outlook e Office 365 | <https://sendersupport.olc.protection.outlook.com/pm/Postmaster> | Rimozione |
| Livelli 1, 2 e 3 di UCEPROTECT | <https://www.uceprotect.net/it/rblcheck.php> | DNSBL |
| Backscatterer.org di UCEPROTECT | <https://www.backscatterer.org/> | Protezione contro la retrodiffusione |
| Whitelisted.org di UCEPROTECT | <https://www.whitelisted.org/> (a pagamento) | DNSWL |
| AT&T | `abuse_rbl@abuse-att.net` | Rimozione |
| AOL/Verizon (ad esempio `[IPTS04]`) | <https://senders.yahooinc.com/> | Rimozione |
| Cox Communications | `unblock.request@cox.net` | Rimozione |
| t-online.de (tedesco/T-Mobile) | `tobr@rx.t-online.de` | Rimozione |

> \[!TIP]
> Inizia con un volume ridotto di email di alta qualità per costruire una reputazione positiva prima di inviare volumi più grandi.

> \[!IMPORTANT]
> Se il tuo dominio è in una blacklist, ogni blacklist ha una propria procedura di rimozione. Consulta i rispettivi siti web per le istruzioni.

> \[!TIP]
> Se hai bisogno di ulteriore assistenza o se riscontri che siamo stati segnalati come falsi positivi come spam da un determinato provider di posta elettronica, ti preghiamo di <a href="/help">contattarci</a>.

### Cosa devo fare se ricevo email di spam {#what-should-i-do-if-i-receive-spam-emails}

Dovresti annullare l'iscrizione alla mailing list (se possibile) e bloccare il mittente.

Ti preghiamo di non segnalare il messaggio come spam, ma di inoltrarlo al nostro sistema di prevenzione degli abusi, gestito manualmente e incentrato sulla privacy.

**L'indirizzo email a cui inoltrare lo spam è:** <abuse@forwardemail.net>

### Perché le email di prova che mi sono state inviate in Gmail vengono visualizzate come "sospette"? {#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious}

Se visualizzi questo messaggio di errore in Gmail quando invii un test a te stesso o quando una persona a cui stai inviando un'email con il tuo alias vede per la prima volta un'email da te inviata, **non preoccuparti**, poiché si tratta di una funzionalità di sicurezza integrata di Gmail.

Puoi semplicemente cliccare su "Sembra sicuro". Ad esempio, se invii un messaggio di prova utilizzando la funzione "Invia messaggio come" (a qualcun altro), questa persona non vedrà questo messaggio.

Tuttavia, se vedono questo messaggio, è perché erano abituati a vedere le tue email provenire da <john@gmail.com> invece che da <john@customdomain.com> (solo un esempio). Gmail avviserà gli utenti solo per assicurarsi che tutto sia al sicuro, per ogni evenienza; non esiste una soluzione alternativa.

### Posso rimuovere l'indirizzo via forwardemail dot net in Gmail {#can-i-remove-the-via-forwardemail-dot-net-in-gmail}

Questo argomento è correlato a [problema ampiamente noto in Gmail in cui vengono visualizzate informazioni aggiuntive accanto al nome del mittente](https://support.google.com/mail/answer/1311182).

Da maggio 2023 supportiamo l'invio di email tramite SMTP come componente aggiuntivo per tutti gli utenti paganti, il che significa che puoi rimuovere <span class="notranslate">via forwardemail dot net</span> in Gmail.

Si noti che questo argomento delle FAQ è specifico per coloro che utilizzano la funzionalità [Come inviare email usando Gmail](#how-to-send-mail-as-using-gmail).

Per le istruzioni di configurazione, consultare la sezione relativa a [Supportate l'invio di e-mail con SMTP?](#do-you-support-sending-email-with-smtp).

## Gestione dati {#data-management}

### Dove si trovano i tuoi server? {#where-are-your-servers-located}

> \[!TIP]
> Potremmo presto annunciare la posizione del nostro data center UE, ospitato su [forwardemail.eu](https://forwardemail.eu). Iscriviti alla discussione su <https://github.com/orgs/forwardemail/discussions/336> per aggiornamenti.

I nostri server si trovano principalmente a Denver, Colorado: per l'elenco completo degli indirizzi IP, vedere <https://forwardemail.net/ips>.

Puoi scoprire di più sui nostri sub-responsabili del trattamento nelle nostre pagine [GDPR](/gdpr), [DPA](/dpa) e [Riservatezza](/privacy).

### Come posso esportare ed effettuare il backup della mia casella di posta {#how-do-i-export-and-backup-my-mailbox}

In qualsiasi momento puoi esportare le tue caselle di posta nei formati [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions), [Mbox](https://en.wikipedia.org/wiki/Mbox) o [SQLite](https://en.wikipedia.org/wiki/SQLite) crittografato.

Vai a <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Il mio account <i class="fa fa-angle-right"></i> Domini</a> <i class="fa fa-angle-right"></i> Alias <i class="fa fa-angle-right"></i> Scarica il backup e seleziona il tipo di formato di esportazione che preferisci.

Una volta completata l'esportazione, ti verrà inviata un'e-mail con il link per scaricarla.

Si noti che per motivi di sicurezza questo collegamento per il download dell'esportazione scade dopo 4 ore.

Se hai bisogno di ispezionare i formati EML o Mbox esportati, potrebbero esserti utili questi strumenti open source:

| Nome | Formato | Piattaforma | URL di GitHub |
| --------------- | :----: | ------------- | --------------------------------------------------- |
| Visualizzatore MBox | Mbox | Finestre | <https://github.com/eneam/mboxviewer> |
| visualizzatore web mbox | Mbox | Tutte le piattaforme | <https://github.com/PHMRanger/mbox-web-viewer> |
| EmlReader | EML | Finestre | <https://github.com/ayamadori/EmlReader> |
| Visualizzatore di posta elettronica | EML | VSCode | <https://github.com/joelharkes/vscode_email_viewer> |
| lettore eml | EML | Tutte le piattaforme | <https://github.com/s0ph1e/eml-reader> |

Inoltre, se hai bisogno di convertire un file Mbox in un file EML, puoi utilizzare <https://github.com/noelmartinon/mboxzilla>.

### Come posso importare e migrare la mia casella di posta esistente {#how-do-i-import-and-migrate-my-existing-mailbox}

Puoi importare facilmente la tua email in Forward Email (ad esempio utilizzando [Thunderbird](https://www.thunderbird.net)) seguendo le istruzioni riportate di seguito:

<div class="alert alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Importante:
</strong>
<span>
È necessario seguire tutti i passaggi seguenti per importare l'email esistente.
</span>
</div>

1. Esporta la tua email dal tuo attuale provider di posta elettronica:

| Fornitore di posta elettronica | Formato di esportazione | Istruzioni per l'esportazione |
| -------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Gmail | MBOX | <https://takeout.google.com/settings/takeout/custom/gmail> |
| Veduta | PST | <div class="alert my-3 alert-danger"><i class="fa fa-info-circle font-weight-bold"></i> <strong class="font-weight-bold">Suggerimento:</strong> <span>Se utilizzi Outlook (<a href="https://support.microsoft.com/en-us/office/back-up-your-email-e5845b0b-1aeb-424f-924c-aa1c33b18833#:~:text=Select%20File%20%3E%20Open%20%26%20Export%20%3E,back%20up%20and%20select%20Next." class="alert-link">formato di esportazione PST</a>), puoi semplicemente seguire le istruzioni riportate nella sezione "Altro" qui sotto. Tuttavia, abbiamo fornito i link qui sotto per convertire il formato PST in MBOX/EML in base al tuo sistema operativo:<ul class="mb-0 mt-3"><li><a class="alert-link" href="https://github.com/BaselineIT/Zinkuba/releases/download/release-1.2/Zinkuba.App.exe">Zinkuba per Windows</a> (<a class="alert-link" href="https://github.com/BaselineIT/Zinkuba?tab=readme-ov-file#zinkuba">GitHub</a>)</li><li><a class="alert-link" href="https://cygwin.com/packages/summary/readpst.html">readpst per Windows cygwin</a> – (ad esempio <code>readpst -u -o $OUT_DIR $IN_DIR</code> sostituendo <code>$OUT_DIR</code> e <code>$IN_DIR</code> con i percorsi della directory di output e della directory di input rispettivamente).</li><li><a class="alert-link" href="https://manpages.ubuntu.com/manpages/trusty/man1/readpst.1.html">readpst per Ubuntu/Linux</a> – (ad esempio <code>sudo apt-get install readpst</code> e poi <code>readpst -u -o $OUT_DIR $IN_DIR</code>, sostituendo <code>$OUT_DIR</code> e <code>$IN_DIR</code> con i percorsi della directory di output e della directory di input rispettivamente).</li><li><a class="alert-link" href="https://formulae.brew.sh/formula/libpst">readpst per macOS (tramite brew)</a> – (ad esempio <code>brew install libpst</code> e poi <code>readpst -u -o $OUT_DIR $IN_DIR</code>, sostituendo <code>$OUT_DIR</code> e <code>$IN_DIR</code> rispettivamente con i percorsi della directory di output e della directory di input).</li><li><a class="alert-link" href="https://github.com/juanirm/pst-converter/tree/master?tab=readme-ov-file#pst-converter">Convertitore PST per Windows (GitHub)</a></li></ul><br /></span></div> |
| Apple Mail | MBOX | <https://support.apple.com/guide/mail/import-or-export-mailboxes-mlhlp1030/mac#apd37a3190755974> |
| Fastmail | EML | <https://www.fastmail.help/hc/it-it/articles/360060590573-Scarica-tutti-i-tuoi-dati#downloadmail> |
| Proton Mail | MBOX/EML | <https://proton.me/support/esporta-email-importa-esporta-app> |
| Tutanota | EML | <https://github.com/crepererum-oss/tatutanatata> |
| Pensare | EML | <https://docs.gandi.net/it/gandimail/operazioni_comuni/backup_email.html#contents> |
| Zoho | EML | <https://www.zoho.com/mail/help/import-export-emails.html#alink2> |
| Altro | [Use Thunderbird](https://www.thunderbird.net) | Configura il tuo account email esistente in Thunderbird e poi usa il plugin [ImportExportTools NG](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/) per esportare e importare le tue email. **Potresti anche semplicemente copiare/incollare o trascinare/rilasciare le email da un account all'altro.** |

2. Scarica, installa e apri [Thunderbird](https://www.thunderbird.net).

3. Crea un nuovo account utilizzando l'indirizzo email completo del tuo alias (ad esempio <code><tu@tuodominio.com></code>) e la password generata. <strong>Se non hai ancora una password generata, <a href="/faq#do-you-support-receiving-email-with-imap" target="_blank">consulta le nostre istruzioni di configurazione</a></strong>.

4. Scarica e installa il plugin [Strumenti di importazione ed esportazione OF](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/) di Thunderbird.

5. Crea una nuova cartella locale in Thunderbird, quindi fai clic destro su di essa → seleziona l'opzione `ImportExportTools NG` → scegli `Import mbox file` (per il formato di esportazione MBOX) – oppure – `Import messages` / `Import all messages from a directory` (per il formato di esportazione EML).

6. Trascina/rilascia dalla cartella locale a una nuova (o esistente) cartella IMAP in Thunderbird in cui desideri caricare i messaggi, utilizzando l'archiviazione IMAP del nostro servizio. Questo garantirà il backup online dei messaggi con il nostro archivio crittografato SQLite.

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Suggerimento:
</strong>
<span>
Se hai dubbi su come importare in Thunderbird, puoi consultare le istruzioni ufficiali su <a class="alert-link" href="https://kb.mozillazine.org/Importing_folders">https://kb.mozillazine.org/Importing_folders</a> e <a class="alert-link" href="https://github.com/thunderbird/import-export-tools-ng/wiki">https://github.com/thunderbird/import-export-tools-ng/wiki</a>.
</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Importante:
</strong>
<span>
Una volta completata la procedura di esportazione e importazione, potresti anche abilitare l'inoltro sul tuo account email esistente e configurare un risponditore automatico per notificare ai mittenti che hai un nuovo indirizzo email (ad esempio, se in precedenza utilizzavi Gmail e ora utilizzi un indirizzo email con il tuo nome di dominio personalizzato).
</span>
</div>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Congratulazioni!
</strong>
<span>
Hai completato con successo tutti i passaggi.
</span>
</div>
</div>

### Supporti l'auto-hosting di {#do-you-support-self-hosting}

Sì, da marzo 2025 supportiamo un'opzione self-hosted. Leggi il blog [Qui](https://forwardemail.net/blog/docs/self-hosted-solution). Dai un'occhiata a [guida auto-ospitata](https://forwardemail.net/self-hosted) per iniziare. E per chi è interessato a una versione più dettagliata e dettagliata, consulta le nostre guide basate su [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) o [Debian](https://forwardemail.net/guides/selfhosted-on-debian).

## Configurazione e-mail {#email-configuration}

### Come posso iniziare e configurare l'inoltro delle email {#how-do-i-get-started-and-set-up-email-forwarding}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Tempo di configurazione stimato:</strong>
<span>Meno di 10 minuti</span>
</div>

<div class="alert my-3 alert-success">
<i class="fa fa-bullhorn font-weight-bold"></i>
<strong class="font-weight-bold">
Per iniziare:
</strong>
<span>
Leggi attentamente e segui i passaggi da uno a otto elencati di seguito. Assicurati di sostituire l'indirizzo email di <code>user@gmail.com</code> con l'indirizzo email a cui desideri inoltrare le email (se non è già corretto). Allo stesso modo, assicurati di sostituire <code>example.com</code> con il tuo nome di dominio personalizzato (se non è già corretto).
</span>
</div>

<ol>
<li class="mb-2 mb-md-3 mb-lg-5">Se hai già registrato il tuo nome di dominio da qualche parte, devi saltare completamente questo passaggio e passare direttamente al secondo! Altrimenti puoi <a href="/domain-registration" rel="noopener noreferrer">cliccare qui per registrare il tuo nome di dominio</a>.</li>
<li class="mb-2 mb-md-3 mb-lg-5">
Ricordi dove hai registrato il tuo dominio? Una volta fatto, segui le istruzioni qui sotto:

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Importante:
</strong>
<span>
Devi aprire una nuova scheda e accedere al tuo registrar di domini. Puoi facilmente cliccare sul tuo "Registrar" qui sotto per farlo automaticamente. In questa nuova scheda, devi accedere alla pagina di gestione DNS del tuo registrar – e abbiamo fornito la procedura di navigazione dettagliata nella colonna "Passaggi di configurazione" qui sotto. Una volta raggiunta questa pagina nella nuova scheda, puoi tornare a questa scheda e procedere al passaggio tre qui sotto.
<strong class="font-weight-bold">Non chiudere ancora la scheda aperta; ti servirà per i passaggi futuri!</strong>
</span>
</div>

<table id="table-dns-management-by-registrar" class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Registrar</th>
<th>Passaggi per la configurazione</th>
</tr>
</thead>
<tbody>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://login.ionos.com/">1&amp;1</a></td>
<td>Accedi <i class="fa fa-angle-right"></i> Centro Domini <i class="fa fa-angle-right"></i> (Seleziona il tuo dominio) <i class="fa fa-angle-right"></i> Modifica Impostazioni DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon Percorso 53</a></td>
<td>Accedi <i class="fa fa-angle-right"></i> Zone ospitate <i class="fa fa-angle-right"></i> (Seleziona il tuo dominio)</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>
<td>Accedi <i class="fa fa-angle-right"></i> I miei server <i class="fa fa-angle-right"></i> Gestione domini <i class="fa fa-angle-right"></i> Gestore DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.bluehost.com/help/article/dns-management-add-edit-or-delete-dns-entries">Bluehost</a></td>
<td>PER ROCK: Accedi <i class="fa fa-angle-right"></i> Domini <i class="fa fa-angle-right"></i> (Clicca sull'icona ▼ accanto a Gestisci) <i class="fa fa-angle-right"></i> DNS
<br />
PER I DOMINI PRECEDENTI: Accedi <i class="fa fa-angle-right"></i> Domini <i class="fa fa-angle-right"></i> Editor di zona <i class="fa fa-angle-right"></i> (Seleziona il tuo dominio)</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://dash.cloudflare.com/login">Cloudflare</a></td>
<td>Accedi <i class="fa fa-angle-right"></i> DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://cp.dnsmadeeasy.com/">DNS Semplificato</a></td>
<td>Log in <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> (Seleziona il tuo dominio)</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://dnsimple.com/dashboard">DNSimple</a></td>
<td>Accedi <i class="fa fa-angle-right"></i> (Seleziona il tuo dominio) <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> Gestisci</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://cloud.digitalocean.com/login">Digital Ocean</a></td>
<td>Accedi <i class="fa fa-angle-right"></i> Networking <i class="fa fa-angle-right"></i> Domini <i class="fa fa-angle-right"></i> (Seleziona il tuo dominio) <i class="fa fa-angle-right"></i> Altro <i class="fa fa-angle-right"></i> Gestisci dominio</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.domain.com/help/article/dns-management-how-to-update-dns-records">Domain.com</a></td>
<td>Accedi <i class="fa fa-angle-right"></i> Nella visualizzazione a schede, fai clic su Gestisci sul tuo dominio <i class="fa fa-angle-right"></i> Nella visualizzazione a elenco, fai clic sull'icona a forma di ingranaggio <i class="fa fa-angle-right"></i> DNS e nameserver <i class="fa fa-angle-right"></i> Record DNS</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://www.domains.com/">Domains.com</a>
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon0 class="fa fa-play-circle"></i> Guarda</a>
</td>
<td>Accedi <i class="fa fa-angle-right"></i> (Seleziona il tuo dominio) <i class="fa fa-angle-right"></i> Gestisci <i class="fa fa-angle-right"></i> (clicca sull'icona a forma di ingranaggio) <i class="fa fa-angle-right"></i> Fai clic su DNS e nameserver nel menu a sinistra</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon1
<td>Accedi <i class="fa fa-angle-right"></i> Pannello <i class="fa fa-angle-right"></i> Domini <i class="fa fa-angle-right"></i> Gestisci domini <i class="fa fa-angle-right"></i> DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon2
<td>Accedi <i class="fa fa-angle-right"></i> Panoramica <i class="fa fa-angle-right"></i> Gestisci <i class="fa fa-angle-right"></i> Editor semplice <i class="fa fa-angle-right"></i> Record</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon3
<td>Accedi <i class="fa fa-angle-right"></i> (Seleziona il tuo dominio) <i class="fa fa-angle-right"></i> Gestione <i class="fa fa-angle-right"></i> Modifica la zona</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon4
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon5 class="fa fa-play-circle"></i> Guarda</a>
</td>
<td>Accedi <i class="fa fa-angle-right"></i> Gestisci i miei domini <i class="fa fa-angle-right"></i> (Seleziona il tuo dominio) <i class="fa fa-angle-right"></i> Gestisci DNS
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon6 Domini</a>
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon7 class="fa fa-play-circle"></i> Guarda</a>
</td>
<td>Accedi <i class="fa fa-angle-right"></i> (Seleziona il tuo dominio) <i class="fa fa-angle-right"></i> Configura DNS</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon8
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon9 class="fa fa-play-circle"></i> Guarda</a>
</td>
<td>Accedi <i class="fa fa-angle-right"></i> Elenco domini <i class="fa fa-angle-right"></i> (Seleziona il tuo dominio) <i class="fa fa-angle-right"></i> Gestisci <i class="fa fa-angle-right"></i> DNS avanzato</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>0
<td>Accedi <i class="fa fa-angle-right"></i> (Seleziona il tuo dominio) <i class="fa fa-angle-right"></i> Configura DNS Netlify</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>1 Soluzioni</a></td>
<td>Accedi <i class="fa fa-angle-right"></i> Gestione account <i class="fa fa-angle-right"></i> I miei nomi di dominio <i class="fa fa-angle-right"></i> (Seleziona il tuo dominio) <i class="fa fa-angle-right"></i> Gestisci <i class="fa fa-angle-right"></i> Cambia la posizione del dominio <i class="fa fa-angle-right"></i> DNS avanzato</td>
</tr>
<tr>
<td>
<a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>2
<br />
<a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>3 class="fa fa-play-circle"></i> Guarda</a>
</td>
<td>Accedi <i class="fa fa-angle-right"></i> Domini gestiti <i class="fa fa-angle-right"></i> (Seleziona il tuo dominio) <i class="fa fa-angle-right"></i> Impostazioni DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>4
<td>Accedi <i class="fa fa-angle-right"></i> Menu Home <i class="fa fa-angle-right"></i> Impostazioni <i class="fa fa-angle-right"></i> Domini <i class="fa fa-angle-right"></i> (Seleziona il tuo dominio) <i class="fa fa-angle-right"></i>
Impostazioni avanzate <i class="fa fa-angle-right"></i> Record personalizzati</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>5 Ora</a></td>
<td>Utilizzando la CLI "now" <i class="fa fa-angle-right"></i> <code>now dns add [dominio] '@' MX [valore-record] [priorità]</code></td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>6
<td>Accedi <i class="fa fa-angle-right"></i> Pagina Domini <i class="fa fa-angle-right"></i> (Seleziona il tuo dominio) <i class="fa fa-angle-right"></i> DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>7
<td>Accedi alla pagina <i class="fa fa-angle-right"></i> Domini <i class="fa fa-angle-right"></i> (Clicca sull'icona <i class="fa fa-ellipsis-h"></i>) <i class="fa fa-angle-right"></i> Seleziona Gestisci record DNS</td>
</tr>
<tr>
<td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>8
<td>Accedi alla pagina <i class="fa fa-angle-right"></i> Domini <i class="fa fa-angle-right"></i> I miei domini</td>
</tr>
<tr>
<td>Altro</td>
<td>
<div class="alert mb-0 alert-warning"><i class="fa fa-exclamation-circle font-weight-bold"></i> <strong class="font-weight-bold">Importante:</strong> il nome del tuo registrar non è elencato qui? Cerca semplicemente su Internet "come modificare i record DNS su $REGISTRAR" (sostituendo $REGISTRAR con il nome del tuo registrar, ad esempio "come modificare i record DNS su GoDaddy" se utilizzi GoDaddy).</div>
</td>
</tr>
</tbody>
</table>
</li>
<li class="mb-2 mb-md-3 mb-lg-5">Utilizzando la pagina di gestione DNS del tuo registrar (l'altra scheda che hai aperto), imposta i seguenti record "MX":

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Importante:
</strong>
<span>
Si noti che NON devono essere impostati altri record MX. Entrambi i record mostrati di seguito DEVONO esistere. Assicurarsi che non vi siano errori di battitura e che sia mx1 che mx2 siano scritti correttamente. Se esistevano già record MX, eliminarli completamente.
Il valore "TTL" non deve essere necessariamente 3600, può essere un valore inferiore o superiore, se necessario.
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Nome/Host/Alias</th>
<th class="text-center">TTL</th>
<th>Tipo</th>
<th>Priorità</th>
<th>Risposta/Valore</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", o vuoto</em></td>
<td class="text-center">3600</td>
<td>MX</td>
<td>0</td>
<td><code>mx1.forwardemail.net</code></td>
</tr>
<tr>
<td><em>"@", ".", o vuoto</em></td>
<td class="text-center">3600</td>
<td>MX</td>
<td>0</td>
<td><code>mx2.forwardemail.net</code></td>
</tr>
</tbody>
</table>

</li><li class="mb-2 mb-md-3 mb-lg-5" id="dns-configuration-options">Utilizzando la pagina di gestione DNS del tuo registrar (l'altra scheda che hai aperto), imposta i seguenti record <strong class="notranslate">TXT</strong>:

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Importante:
</strong>
<span>
Se hai un piano a pagamento, devi saltare completamente questo passaggio e andare direttamente al passaggio 5! Se non hai un piano a pagamento, i tuoi indirizzi di inoltro saranno ricercabili pubblicamente: vai su <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Il mio account <i class="fa fa-angle-right"></i> Domini</a> e, se lo desideri, aggiorna il tuo dominio a un piano a pagamento. Per saperne di più sui piani a pagamento, consulta la nostra pagina <a rel="noopener noreferrer" href="/private-business-email" class="alert-link">Prezzi</a>. Altrimenti puoi continuare a scegliere una o più combinazioni dall'opzione A all'opzione F elencate di seguito.
</span>
</div>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Opzione A:
</strong>
<span>
Se stai inoltrando tutte le email dal tuo dominio (ad esempio "all@example.com", "hello@example.com", ecc.) a un indirizzo specifico "user@gmail.com":
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Nome/Host/Alias</th>
<th class="text-center">TTL</th>
<th>Tipo</th>
<th>Risposta/Valore</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", "." o vuoto</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=user@gmail.com</code>
</td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Suggerimento:
</strong>
<span>
Assicurati di sostituire i valori sopra riportati nella colonna "Valore" con il tuo indirizzo email. Il valore "TTL" non deve essere necessariamente 3600, può essere un valore inferiore o superiore, se necessario. Un valore di time to live ("TTL") inferiore garantirà che eventuali modifiche future apportate ai record DNS vengano propagate più rapidamente su Internet: considera questo come il tempo di memorizzazione nella cache (in secondi). Puoi trovare maggiori informazioni sul <a href="https://en.wikipedia.org/wiki/Time_to_live#DNS_records" rel="noopener noreferrer" target="_blank" class="alert-link">TTL su Wikipedia</a>.
</span>
</div>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Opzione B:
</strong>
<span>
Se devi inoltrare solo un singolo indirizzo email (ad esempio <code>hello@example.com</code> a <code>user@gmail.com</code>; questo inoltrerà automaticamente anche "hello+test@example.com" a "user+test@gmail.com"):
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Nome/Host/Alias</th>
<th class="text-center">TTL</th>
<th>Tipo</th>
<th>Risposta/Valore</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", o vuoto</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=hello:user@gmail.com</code>
</td>
</tr>
</tbody>
</table>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Opzione C:
</strong>
<span>
Se stai inoltrando più email, ti consigliamo di separarle con una virgola:
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Nome/Host/Alias</th>
<th class="text-center">TTL</th>
<th>Tipo</th>
<th>Risposta/Valore</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", o vuoto</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=hello:user@gmail.com,support:user@gmail.com</code>
</td>
</tr>
</tbody>
</table>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Opzione D:
</strong>
<span>
È possibile impostare un numero infinito di email di inoltro: assicurarsi di non superare i 255 caratteri in una singola riga e di iniziare ogni riga con "forward-email=". Di seguito è riportato un esempio:
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Nome/Host/Alias</th>
<th class="text-center">TTL</th>
<th>Tipo</th>
<th>Risposta/Valore</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", o vuoto</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=hello:user@gmail.com,support:user@gmail.com</code>
</td>
</tr>
<tr>
<td><em>"@", ".", o vuoto</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=help:user@gmail.com,foo:user@gmail.com</code>
</td>
</tr>
<tr>
<td><em>"@", ".", o vuoto</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=orders:user@gmail.com,baz:user@gmail.com</code>
</td>
</tr>
<tr>
<td><em>"@", ".", o vuoto</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=info:user@gmail.com,beep:user@gmail.com</code>
</td>
</tr>
<tr>
<td><em>"@", "." o vuoto</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=errors:user@gmail.com,boop:user@gmail.com</code>
</td>
</tr>
</tbody>
</table>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Opzione E:
</strong>
<span>
Puoi anche specificare un nome di dominio nel tuo record <strong class="notranslate">TXT</strong> per l'inoltro dell'alias globale (ad esempio, "user@example.com" verrà inoltrato a "user@example.net"):
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Nome/Host/Alias</th>
<th class="text-center">TTL</th>
<th>Tipo</th>
<th>Risposta/Valore</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", "." o vuoto</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=example.net</code>
</td>
</tr>
</tbody>
</table>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Opzione F:
</strong>
<span>
Puoi anche utilizzare i webhook come alias globale o individuale a cui inoltrare le email. Consulta l'esempio e la sezione completa sui webhook intitolata <a href="#do-you-support-webhooks" class="alert-link">Supportate i webhook?</a> qui sotto.
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Nome/Host/Alias</th>
<th class="text-center">TTL</th>
<th>Tipo</th>
<th>Risposta/Valore</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", "." o vuoto</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=alias:https://requestbin.com/r/en8pfhdgcculn</code>
</td>
</tr>
</tbody>
</table>

---

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Opzione G:
</strong>
<span>
È anche possibile utilizzare espressioni regolari ("regex") per la corrispondenza degli alias e per gestire le sostituzioni a cui inoltrare le email. Consultare gli esempi e la sezione completa sulle espressioni regolari intitolata <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">Supportate espressioni regolari o regex</a> qui sotto.
</span>
</div>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Hai bisogno di espressioni regolari avanzate con sostituzione?</strong> Consulta gli esempi e la sezione completa sulle espressioni regolari intitolata <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">Supporti espressioni regolari o espressioni regolari</a> qui sotto.
</div>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Esempio semplice:</strong> Se voglio che tutte le email che vanno a `linus@example.com` o `torvalds@example.com` vengano inoltrate a `user@gmail.com`:
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Nome/Host/Alias</th>
<th class="text-center">TTL</th>
<th>Tipo</th>
<th>Risposta/Valore</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", o vuoto</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td>
<code>forward-email=/^(linus|torvalds)$/:user@gmail.com</code>
</td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Importante:
</strong>
<span>
Le regole di inoltro catch-all potrebbero anche essere descritte come "fall-through".
Ciò significa che le email in arrivo che corrispondono ad almeno una specifica regola di inoltro verranno utilizzate al posto della regola catch-all.
Le regole specifiche includono indirizzi email ed espressioni regolari.
<br /><br />
Ad esempio:
<br />
<code>forward-email=hello:first@gmail.com,second@gmail.com</code>
<br />
Le email inviate a <code>hello@example.com</code> **non** verranno inoltrate a <code>second@gmail.com</code> (catch-all) con questa configurazione, ma verranno invece recapitate solo a <code>first@gmail.com</code>.
</span>
</div>

---

</li><li class="mb-2 mb-md-3 mb-lg-5">Utilizzando la pagina di gestione DNS del tuo registrar (l'altra scheda che hai aperto), imposta anche il seguente record <strong class="notranslate">TXT</strong>:

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Nome/Host/Alias</th>
<th class="text-center">TTL</th>
<th>Tipo</th>
<th>Risposta/Valore</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", "." o vuoto</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>v=spf1 a include:spf.forwardemail.net -all</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Importante:
</strong>
<span>
Se utilizzi Gmail (ad esempio, Invia messaggio come) o G Suite, dovrai aggiungere <code>include:_spf.google.com</code> al valore sopra, ad esempio:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
</span>
</div>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Suggerimento:
</strong>
<span>
Se hai già una riga simile con "v=spf1", dovrai aggiungere <code>include:spf.forwardemail.net</code> subito prima di eventuali record "include:host.com" esistenti e prima di "-all" nella stessa riga, ad esempio:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
<br /><br />
Nota che c'è una differenza tra "-all" e "~all". Il simbolo "-" indica che il controllo SPF dovrebbe fallire se non corrisponde, mentre il simbolo "~" indica che il controllo SPF dovrebbe fallire in modo non corretto. Consigliamo di utilizzare l'approccio "-all" per prevenire la contraffazione del dominio.
<br /><br />
Potrebbe essere necessario includere anche il record SPF per l'host da cui si invia la posta (ad esempio, Outlook).
</span>
</div>

</li><li class="mb-2 mb-md-3 mb-lg-5">Verifica i tuoi record DNS utilizzando il nostro strumento "Verifica record" disponibile in <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Il mio account <i class="fa fa-angle-right"></i> Domini</a> <i class="fa fa-angle-right"></i> Configurazione.

</li><li class="mb-2 mb-md-3 mb-lg-5">Invia un'email di prova per verificare che funzioni. Tieni presente che la propagazione dei record DNS potrebbe richiedere del tempo.

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Suggerimento:
</strong>
<span>
</span>
Se non ricevi email di prova o ricevi un'email di prova con il messaggio "Fai attenzione a questo messaggio", consulta le risposte alle domande <a href="#why-am-i-not-receiving-my-test-emails" class="alert-link">Perché non ricevo le mie email di prova</a> e <a href="#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious" class="alert-link">Perché le mie email di prova inviate a me stesso in Gmail vengono visualizzate come "sospette"</a>.
</div>

</li><li class="mb-2 mb-md-3 mb-lg-5">Se desideri "Invia posta come" da Gmail, dovrai <strong><a href="https://www.youtube.com/watch?v=MEheS8gM4Xs" target="_blank" rel="noopener noreferrer">guardare questo video</a></strong> oppure seguire i passaggi descritti nella sezione <a href="#how-to-send-mail-as-using-gmail">How per inviare posta come tramite Gmail</a> più avanti.

</li></ol>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Congratulazioni!
</strong>
<span>
Hai completato con successo tutti i passaggi.
</span>
</div>
</div>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Suggerimento:
</strong>
<span>
Di seguito sono elencati i componenti aggiuntivi opzionali. Si noti che questi componenti aggiuntivi sono completamente opzionali e potrebbero non essere necessari. Volevamo almeno fornirvi informazioni aggiuntive, se necessario.
</span>
</div>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Componente aggiuntivo facoltativo:
</strong>
<span>
Se utilizzi la funzione <a class="alert-link" href="#how-to-send-mail-as-using-gmail">How per inviare email come se usassi Gmail</a>, potresti volerti aggiungere a una lista consentita. Consulta <a class="alert-link" href="https://support.google.com/a/answer/60752?hl=en" target="_blank" rel="noopener noreferrer">queste istruzioni di Gmail</a> su questo argomento.
</span>
</div>

### Posso utilizzare più server e scambi MX per l'inoltro avanzato {#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding}

Sì, ma **dovresti avere un solo scambio MX elencato nei tuoi record DNS**.

Non tentare di utilizzare "Priorità" per configurare più scambi MX.

In alternativa, è necessario configurare lo scambio MX esistente per inoltrare la posta per tutti gli alias non corrispondenti agli scambi del nostro servizio (`mx1.forwardemail.net` e/o `mx2.forwardemail.net`).

Se utilizzi Google Workspace e desideri inoltrare tutti gli alias non corrispondenti al nostro servizio, consulta <https://support.google.com/a/answer/6297084>.

Se utilizzi Microsoft 365 (Outlook) e desideri inoltrare tutti gli alias non corrispondenti al nostro servizio, consulta <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/use-connectors-to-configure-mail-flow/set-up-connectors-to-route-mail> e <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/manage-mail-flow-for-multiple-locations>.

### Come posso impostare un risponditore automatico per assenza? {#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder}

Vai a <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Il mio account <i class="fa fa-angle-right"></i> Domini</a> <i class="fa fa-angle-right"></i> Alias e crea o modifica l'alias per il quale desideri configurare un risponditore automatico automatico.

Puoi configurare una data di inizio, una data di fine, un oggetto e un messaggio, e abilitarli o disabilitarli in qualsiasi momento:

* Oggetto e messaggio in testo normale sono attualmente supportati (internamente utilizziamo il pacchetto `striptags` per rimuovere qualsiasi HTML).
* L'oggetto è limitato a 100 caratteri.
* Il messaggio è limitato a 1000 caratteri.
* L'installazione richiede la configurazione SMTP in uscita (ad esempio, sarà necessario configurare i record DNS DKIM, DMARC e Return-Path).
* Vai a <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Account personale <i class="fa fa-angle-right"></i> Domini</a> <i class="fa fa-angle-right"></i> Impostazioni <i class="fa fa-angle-right"></i> Configurazione SMTP in uscita e segui le istruzioni di configurazione.
* Il risponditore automatico non può essere abilitato sui nomi di dominio vanity globali (ad esempio, [indirizzi usa e getta](/disposable-addresses) non sono supportati). * Il risponditore automatico non può essere abilitato per gli alias con caratteri jolly/catch-all (`*`) né per le espressioni regolari.

A differenza dei sistemi di posta come `postfix` (che ad esempio utilizzano l'estensione del filtro vacanze `sieve`), Forward Email aggiunge automaticamente la tua firma DKIM, verifica in modo inequivocabile i problemi di connessione durante l'invio di risposte di assenza (ad esempio dovuti a comuni problemi di connessione SSL/TLS e server legacy gestiti) e supporta persino la crittografia Open WKD e PGP per le risposte di assenza.

<!--
* Per prevenire abusi, verrà detratto 1 credito SMTP in uscita per ogni messaggio inviato dal risponditore automatico.
* Tutti gli account a pagamento includono 300 crediti al giorno per impostazione predefinita. Se hai bisogno di un importo maggiore, contattaci.
-->

1. Effettuiamo un solo invio per mittente [inserito nella lista consentita](#do-you-have-an-allowlist) ogni 4 giorni (simile al comportamento di Gmail).

* La nostra cache Redis utilizza un'impronta digitale di `alias_id` e `sender`, mentre `alias_id` è l'alias MongoDB ID e `sender` è l'indirizzo del mittente (se presente nella allowlist) o il dominio radice nell'indirizzo del mittente (se non presente nella allowlist). Per semplicità, la scadenza di questa impronta digitale nella cache è impostata a 4 giorni.

* Il nostro approccio, che prevede l'utilizzo del dominio radice analizzato nell'indirizzo Da per i mittenti non inclusi nella lista consentita, impedisce che mittenti relativamente sconosciuti (ad esempio malintenzionati) possano inondare i messaggi del risponditore automatico.

2. Inviamo solo quando il campo MAIL FROM e/o From non è vuoto e non contiene (senza distinzione tra maiuscole e minuscole) un [nome utente del direttore delle poste](#what-are-postmaster-addresses) (la parte prima della @ in un'e-mail).

3. Non effettuiamo invii se il messaggio originale contiene una delle seguenti intestazioni (senza distinzione tra maiuscole e minuscole):

* Intestazione di `auto-submitted` con valore diverso da `no`.
* Intestazione di `x-auto-response-suppress` con valore `dr`, `autoreply`, `auto-reply`, `auto_reply` o `all`
* Intestazione di `list-id`, `list-subscribe`, `no`0, `no`1, `no`2, `no`3, `no`4, `no`5, `no`6 o `no`7 (indipendentemente dal valore). * Intestazione di `no`8 con valore `no`9, `x-auto-response-suppress`0, `x-auto-response-suppress`1, `x-auto-response-suppress`2 o `x-auto-response-suppress`3.

4. Non effettuiamo invii se l'indirizzo email MAIL FROM o From termina con `+donotreply`, `-donotreply`, `+noreply` o `-noreply`.

5. Non effettuiamo l'invio se la parte del nome utente dell'indirizzo e-mail Da era `mdaemon` e aveva un'intestazione senza distinzione tra maiuscole e minuscole di `X-MDDSN-Message`.

6. Non effettuiamo l'invio se è presente un'intestazione `content-type` di `multipart/report` che non distingue tra maiuscole e minuscole.

### Come posso impostare SPF per l'inoltro email {#how-do-i-set-up-spf-for-forward-email}

Utilizzando la pagina di gestione DNS del tuo registrar, imposta il seguente record <strong class="notranslate">TXT</strong>:

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Nome/Host/Alias</th>
<th class="text-center">TTL</th>
<th>Tipo</th>
<th>Risposta/Valore</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", "." o vuoto</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>v=spf1 a include:spf.forwardemail.net -all</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Importante:
</strong>
<span>
Se utilizzi Gmail (ad esempio, Invia messaggio come) o G Suite, dovrai aggiungere <code>include:_spf.google.com</code> al valore sopra, ad esempio:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Importante:
</strong>
<span>
Se utilizzi Microsoft Outlook o Live.com, dovrai aggiungere <code>include:spf.protection.outlook.com</code> al record SPF <strong class="notranslate">TXT</strong>, ad esempio:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:spf.protection.outlook.com -all</code>
</span>
</div>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Suggerimento:
</strong>
<span>
Se hai già una riga simile con "v=spf1", dovrai aggiungere <code>include:spf.forwardemail.net</code> subito prima di eventuali record "include:host.com" esistenti e prima di "-all" nella stessa riga, ad esempio:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
<br /><br />
Nota che c'è una differenza tra "-all" e "~all". Il simbolo "-" indica che il controllo SPF dovrebbe fallire se non corrisponde, mentre il simbolo "~" indica che il controllo SPF dovrebbe fallire in modo non corretto. Consigliamo di utilizzare l'approccio "-all" per prevenire la contraffazione del dominio.
<br /><br />
Potrebbe essere necessario includere anche il record SPF per l'host da cui si invia la posta (ad esempio, Outlook).
</span>
</div>

### Come posso impostare DKIM per l'inoltro email {#how-do-i-set-up-dkim-for-forward-email}

Vai a <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Il mio account <i class="fa fa-angle-right"></i> Domini</a> <i class="fa fa-angle-right"></i> Impostazioni <i class="fa fa-angle-right"></i> Configurazione SMTP in uscita e segui le istruzioni di configurazione.

### Come posso impostare DMARC per l'inoltro delle email {#how-do-i-set-up-dmarc-for-forward-email}

Vai a <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Il mio account <i class="fa fa-angle-right"></i> Domini</a> <i class="fa fa-angle-right"></i> Impostazioni <i class="fa fa-angle-right"></i> Configurazione SMTP in uscita e segui le istruzioni di configurazione.

### Come posso connettere e configurare i miei contatti {#how-do-i-connect-and-configure-my-contacts}

**Per configurare i tuoi contatti, usa l'URL CardDAV di:** `https://carddav.forwardemail.net` (o semplicemente `carddav.forwardemail.net` se il tuo client lo consente)

### Come posso connettermi e configurare i miei calendari {#how-do-i-connect-and-configure-my-calendars}

**Per configurare il tuo calendario, usa l'URL CalDAV di:** `https://caldav.forwardemail.net` (o semplicemente `caldav.forwardemail.net` se il tuo client lo consente)

<img width="612" height="520" src="/img/faq/calendar-setup.png" alt="Esempio di configurazione di Inoltra calendario email CalDAV Thunderbird" />

### Come posso aggiungere altri calendari e gestire quelli esistenti? {#how-do-i-add-more-calendars-and-manage-existing-calendars}

Se desideri aggiungere altri calendari, aggiungi semplicemente un nuovo URL calendario: `https://caldav.forwardemail.net/dav/principals/calendar-name` (**assicurati di sostituire `calendar-name` con il nome del calendario desiderato**)

Puoi cambiare il nome e il colore di un calendario dopo averlo creato: basta usare la tua applicazione di calendario preferita (ad esempio Apple Mail o [Thunderbird](https://thunderbird.net)).

### Come posso impostare SRS per l'inoltro di email {#how-do-i-set-up-srs-for-forward-email}

Configuriamo automaticamente [Schema di riscrittura del mittente](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme) ("SRS"): non è necessario che tu lo faccia.

### Come posso configurare MTA-STS per l'inoltro di email {#how-do-i-set-up-mta-sts-for-forward-email}

Per ulteriori informazioni fare riferimento a [la nostra sezione su MTA-STS](#do-you-support-mta-sts).

### Come faccio ad aggiungere un'immagine del profilo al mio indirizzo email {#how-do-i-add-a-profile-picture-to-my-email-address}

Se utilizzi Gmail, procedi nel seguente modo:

1. Vai su <https://google.com> ed esci da tutti gli account email
2. Fai clic su "Accedi" e, nel menu a discesa, su "Altro account"
3. Seleziona "Utilizza un altro account"
4. Seleziona "Crea account"
5. Seleziona "Utilizza il mio indirizzo email attuale"
6. Inserisci l'indirizzo email del tuo nome di dominio personalizzato
7. Recupera l'email di verifica inviata al tuo indirizzo email
8. Inserisci il codice di verifica da questa email
9. Completa le informazioni del profilo per il tuo nuovo account Google
10. Accetta tutte le Norme sulla privacy e i Termini di utilizzo
11. Vai su <https://google.com> e, nell'angolo in alto a destra, fai clic sull'icona del tuo profilo e poi sul pulsante "Modifica"
12. Carica una nuova foto o un nuovo avatar per il tuo account
13. Le modifiche richiederanno circa 1-2 ore per essere applicate, ma a volte potrebbero essere molto rapide.
14. Invia un'email di prova e la foto del profilo dovrebbe apparire.

## Funzionalità avanzate {#advanced-features}

### Supporti newsletter o mailing list per e-mail di marketing {#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email}

Sì, puoi leggere di più su <https://forwardemail.net/guides/newsletter-with-listmonk>.

Si prega di notare che, per preservare la reputazione dell'IP e garantire la recapitabilità, Forward Email prevede un processo di revisione manuale per dominio per l'**approvazione delle newsletter**. Inviate un'email a <support@forwardemail.net> o aprite un [richiesta di aiuto](https://forwardemail.net/help) per l'approvazione. In genere, questa operazione richiede meno di 24 ore e la maggior parte delle richieste viene evasa entro 1-2 ore. Nel prossimo futuro, puntiamo a rendere questo processo istantaneo con controlli antispam e avvisi aggiuntivi. Questo processo garantisce che le vostre email raggiungano la posta in arrivo e che i vostri messaggi non vengano contrassegnati come spam.

### Supporti l'invio di email con API {#do-you-support-sending-email-with-api}

Sì, da maggio 2023 supportiamo l'invio di email tramite API come componente aggiuntivo per tutti gli utenti paganti.

<div class="alert my-3 alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Importante:
</strong>
<span>
Assicurati di aver letto i nostri <a href="/terms" class="alert-link" target="_blank">Termini</a>, l'<a href="/privacy" class="alert-link" target="_blank">Informativa sulla privacy</a> e i <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Limiti SMTP in uscita</a>: il tuo utilizzo è considerato un'accettazione e un consenso.
</span>
</div>

Per opzioni, esempi e ulteriori approfondimenti, consulta la sezione su [E-mail](/email-api#outbound-emails) nella documentazione API.

Per inviare e-mail in uscita con la nostra API, devi utilizzare il token API disponibile in [La mia sicurezza](/my-account/security).

### Supporti la ricezione di email con IMAP {#do-you-support-receiving-email-with-imap}

Sì, dal 16 ottobre 2023 supportiamo la ricezione di email tramite IMAP come componente aggiuntivo per tutti gli utenti a pagamento. **Leggi il nostro articolo di approfondimento** su [come funziona la nostra funzionalità di archiviazione delle caselle di posta SQLite crittografate](/blog/docs/best-quantum-safe-encrypted-email-service).

<div id="imap-istruzioni">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Importante:
</strong>
<span>
Assicurati di aver letto i nostri <a href="/terms" class="alert-link" target="_blank">Termini</a> e la nostra <a href="/privacy" class="alert-link" target="_blank">Informativa sulla privacy</a>: il tuo utilizzo è considerato un'accettazione e un consenso.
</span>
</div>

1. Crea un nuovo alias per il tuo dominio in <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Il mio account <i class="fa fa-angle-right"></i> Domini</a> <i class="fa fa-angle-right"></i> Alias (ad esempio <code><hello@example.com></code>)

2. Fai clic su <strong class="text-success"><i class="fa fa-key"></i>Genera password</strong> accanto all'alias appena creato. Copia negli appunti e conserva in modo sicuro la password generata visualizzata sullo schermo.

3. Utilizzando la tua applicazione di posta elettronica preferita, aggiungi o configura un account con il tuo alias appena creato (ad esempio <code><hello@example.com></code>)
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Suggerimento:
</strong>
<span>Consigliamo di utilizzare <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a>, o <a href="/blog/open-source" class="alert-link" target="_blank">un'alternativa open source e incentrata sulla privacy</a>.</span>
</div>

4. Quando viene richiesto il nome del server IMAP, immettere `imap.forwardemail.net`

5. Quando viene richiesta la porta del server IMAP, inserisci `993` (SSL/TLS) – vedi [porte IMAP alternative](/faq#what-are-your-imap-server-configuration-settings) se necessario
<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Suggerimento:
</strong>
<span>Se utilizzi Thunderbird, assicurati che "Sicurezza connessione" sia impostata su "SSL/TLS" e che il metodo di autenticazione sia impostato su "Password normale".</span>
</div>

6. Quando viene richiesta la password del server IMAP, incollare la password da <strong class="text-success"><i class="fa fa-key"></i> Genera password</strong> nel passaggio 2 sopra

7. **Salva le tue impostazioni** – se riscontri problemi, contattaci <a href="/help">

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Congratulazioni!
</strong>
<span>
Hai completato con successo tutti i passaggi.
</span>
</div>
</div>

</div>

### Supporti POP3 {#do-you-support-pop3}

Sì, dal 4 dicembre 2023 supportiamo [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol) come componente aggiuntivo per tutti gli utenti a pagamento. **Leggi il nostro articolo di approfondimento** su [come funziona la nostra funzionalità di archiviazione delle caselle di posta SQLite crittografate](/blog/docs/best-quantum-safe-encrypted-email-service).

<div id="istruzioni-pop3">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Importante:
</strong>
<span>
Assicurati di aver letto i nostri <a href="/terms" class="alert-link" target="_blank">Termini</a> e la nostra <a href="/privacy" class="alert-link" target="_blank">Informativa sulla privacy</a>: il tuo utilizzo è considerato un'accettazione e un consenso.
</span>
</div>

1. Crea un nuovo alias per il tuo dominio in <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Il mio account <i class="fa fa-angle-right"></i> Domini</a> <i class="fa fa-angle-right"></i> Alias (ad esempio <code><hello@example.com></code>)

2. Fai clic su <strong class="text-success"><i class="fa fa-key"></i>Genera password</strong> accanto all'alias appena creato. Copia negli appunti e conserva in modo sicuro la password generata visualizzata sullo schermo.

3. Utilizzando la tua applicazione di posta elettronica preferita, aggiungi o configura un account con il tuo alias appena creato (ad esempio <code><hello@example.com></code>)
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Suggerimento:
</strong>
<span>Consigliamo di utilizzare <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a>, o <a href="/blog/open-source" class="alert-link" target="_blank">un'alternativa open source e incentrata sulla privacy</a>.</span>
</div>

4. Quando viene richiesto il nome del server POP3, immettere `pop3.forwardemail.net`

5. Quando viene richiesta la porta del server POP3, inserisci `995` (SSL/TLS) – vedi [porte POP3 alternative](/faq#what-are-your-pop3-server-configuration-settings) se necessario
<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Suggerimento:
</strong>
<span>Se utilizzi Thunderbird, assicurati che "Sicurezza connessione" sia impostata su "SSL/TLS" e che il metodo di autenticazione sia impostato su "Password normale".</span>
</div>

6. Quando viene richiesta la password del server POP3, incollare la password da <strong class="text-success"><i class="fa fa-key"></i> Genera password</strong> nel passaggio 2 sopra

7. **Salva le tue impostazioni** – se riscontri problemi, contattaci <a href="/help">

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Congratulazioni!
</strong>
<span>
Hai completato con successo tutti i passaggi.
</span>
</div>
</div>

</div>

### Supporti i calendari (CalDAV) {#do-you-support-calendars-caldav}

Sì, abbiamo aggiunto questa funzionalità dal 5 febbraio 2024. Il nostro server è `caldav.forwardemail.net` ed è monitorato anche sulla nostra <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">pagina di stato</a>.

Supporta sia IPv4 che IPv6 ed è disponibile sulla porta `443` (HTTPS).

| Login | Esempio | Descrizione |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nome utente | `user@example.com` | Indirizzo email di un alias esistente per il dominio in <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Il mio account <i class="fa fa-angle-right"></i> Domini</a>. |
| Password | `************************` | Password generata specifica dell'alias. |

Per poter utilizzare il supporto del calendario, l'**utente** deve essere l'indirizzo email di un alias esistente per il dominio in <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Il mio account <i class="fa fa-angle-right"></i> Domini</a> e la **password** deve essere una password generata specifica dell'alias.

### Supporti i contatti (CardDAV) {#do-you-support-contacts-carddav}

Sì, abbiamo aggiunto questa funzionalità dal 12 giugno 2025. Il nostro server è `carddav.forwardemail.net` ed è monitorato anche sulla nostra <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">pagina di stato</a>.

Supporta sia IPv4 che IPv6 ed è disponibile sulla porta `443` (HTTPS).

| Login | Esempio | Descrizione |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nome utente | `user@example.com` | Indirizzo email di un alias esistente per il dominio in <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Il mio account <i class="fa fa-angle-right"></i> Domini</a>. |
| Password | `************************` | Password generata specifica dell'alias. |

Per poter utilizzare il supporto dei contatti, l'**utente** deve essere l'indirizzo email di un alias esistente per il dominio in <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Il mio account <i class="fa fa-angle-right"></i> Domini</a> e la **password** deve essere una password generata specifica dell'alias.

### Supporti l'invio di email con SMTP {#do-you-support-sending-email-with-smtp}

Sì, da maggio 2023 supportiamo l'invio di e-mail tramite SMTP come componente aggiuntivo per tutti gli utenti paganti.

<div id="istruzioni-smtp">

<div class="alert alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Importante:
</strong>
<span>
Assicurati di aver letto i nostri <a href="/terms" class="alert-link" target="_blank">Termini</a>, l'<a href="/privacy" class="alert-link" target="_blank">Informativa sulla privacy</a> e i <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Limiti SMTP in uscita</a>: il tuo utilizzo è considerato un'accettazione e un consenso.
</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Importante:
</strong>
<span>
Se utilizzi Gmail, consulta la nostra <a class="alert-link" href="/guides/send-mail-as-gmail-custom-domain">guida "Invia email come con Gmail"</a>. Se sei uno sviluppatore, consulta la nostra <a class="alert-link" href="/email-api#outbound-emails" target="_blank">documentazione API email</a>.
</span>
</div>

1. Vai a <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Il mio account <i class="fa fa-angle-right"></i> Domini</a> <i class="fa fa-angle-right"></i> Impostazioni <i class="fa fa-angle-right"></i> Configurazione SMTP in uscita e segui le istruzioni di configurazione

2. Crea un nuovo alias per il tuo dominio in <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Il mio account <i class="fa fa-angle-right"></i> Domini</a> <i class="fa fa-angle-right"></i> Alias (ad esempio <code><hello@example.com></code>)

3. Fai clic su <strong class="text-success"><i class="fa fa-key"></i>Genera password</strong> accanto all'alias appena creato. Copia negli appunti e conserva in modo sicuro la password generata visualizzata sullo schermo.

4. Utilizzando la tua applicazione di posta elettronica preferita, aggiungi o configura un account con il tuo alias appena creato (ad esempio <code><hello@example.com></code>)
<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Suggerimento:
</strong>
<span>Consigliamo di utilizzare <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a>, o <a href="/blog/open-source" class="alert-link" target="_blank">un'alternativa open source e incentrata sulla privacy</a>.</span>
</div>

5. Quando viene richiesto il nome del server SMTP, immettere `smtp.forwardemail.net`

6. Quando viene richiesta la porta del server SMTP, inserisci `465` (SSL/TLS) – vedi [porte SMTP alternative](/faq#what-are-your-smtp-server-configuration-settings) se necessario
<div class="alert my-3 alert-warning">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Suggerimento:
</strong>
<span>Se utilizzi Thunderbird, assicurati che "Sicurezza connessione" sia impostata su "SSL/TLS" e che il metodo di autenticazione sia impostato su "Password normale".</span>
</div>

7. Quando viene richiesta la password del server SMTP, incollare la password da <strong class="text-success"><i class="fa fa-key"></i> Genera password</strong> nel passaggio 3 sopra

8. **Salva le tue impostazioni e invia la tua prima e-mail di prova** – se riscontri problemi, contattaci</a>

<div class="alert my-3 alert-primary">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Importante:
</strong>
<span>
Tieni presente che, per preservare la reputazione dell'IP e garantire la consegna, adottiamo un processo di revisione manuale per dominio per l'approvazione SMTP in uscita. In genere, questo processo richiede meno di 24 ore e la maggior parte delle richieste viene evasa entro 1-2 ore. Nel prossimo futuro, puntiamo a rendere questo processo istantaneo con controlli antispam e avvisi aggiuntivi. Questo processo garantisce che le tue email raggiungano la posta in arrivo e che i tuoi messaggi non vengano contrassegnati come spam.
</span>
</div>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Congratulazioni!
</strong>
<span>
Hai completato con successo tutti i passaggi.
</span>
</div>
</div>

</div>

### Supporti OpenPGP/MIME, crittografia end-to-end ("E2EE") e Web Key Directory ("WKD") {#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd}

Sì, supportiamo [OpenPGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy#OpenPGP), [crittografia end-to-end ("E2EE")](https://en.wikipedia.org/wiki/End-to-end_encryption) e la scoperta di chiavi pubbliche tramite [Elenco delle chiavi Web ("WKD")](https://wiki.gnupg.org/WKD). È possibile configurare OpenPGP utilizzando [keys.openpgp.org](https://keys.openpgp.org/about/usage#wkd-as-a-service) o [ospita autonomamente le tue chiavi](https://wiki.gnupg.org/WKDHosting) (fare riferimento a [questo gist per la configurazione del server WKD](https://gist.github.com/kafene/0a6e259996862d35845784e6e5dbfc79)).

* Le ricerche WKD vengono memorizzate nella cache per 1 ora per garantire la consegna tempestiva delle email → pertanto, se aggiungi, modifichi o rimuovi la tua chiave WKD, inviaci un'email a `support@forwardemail.net` con il tuo indirizzo email in modo che possiamo svuotare manualmente la cache.
* Supportiamo la crittografia PGP per i messaggi inoltrati tramite ricerca WKD o utilizzando una chiave PGP caricata sulla nostra interfaccia.
* Le chiavi caricate hanno la precedenza finché la casella di controllo PGP è abilitata/selezionata.
* I messaggi inviati ai webhook non sono attualmente crittografati con PGP.
* Se hai più alias che corrispondono a un determinato indirizzo di inoltro (ad esempio, regex/carattere jolly/combinazione esatta) e se più di uno di questi contiene una chiave PGP caricata e ha PGP selezionato → ti invieremo un'email di avviso di errore e non crittograferemo il messaggio con la tua chiave PGP caricata. Questo è molto raro e di solito si applica solo agli utenti avanzati con regole di alias complesse. * **La crittografia PGP non verrà applicata all'inoltro delle email tramite i nostri server MX se il mittente ha impostato una politica DMARC di rifiuto. Se desideri la crittografia PGP su *tutte* le email, ti consigliamo di utilizzare il nostro servizio IMAP e di configurare la tua chiave PGP come alias per la posta in arrivo.**

**È possibile convalidare la configurazione della Web Key Directory su <https://wkd.chimbosonic.com/> (open-source) o <https://www.webkeydirectory.com/> (proprietaria).**

<div class="alert my-3 alert-success">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Crittografia automatica:
</strong>
<span>Se utilizzi il nostro <a href="#do-you-support-sending-email-with-smtp" class="alert-link">servizio SMTP in uscita</a> e invii messaggi non crittografati, tenteremo automaticamente di crittografare i messaggi per destinatario utilizzando la <a class="alert-link" href="https://wiki.gnupg.org/WKD">Web Key Directory ("WKD")</a>.</span>
</div>

<div class="alert alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Importante:
</strong>
<span>
È necessario seguire tutti i passaggi seguenti per abilitare OpenPGP per il tuo nome di dominio personalizzato.
</span>
</div>

1. Scarica e installa il plugin consigliato per il tuo client di posta elettronica qui sotto:

| Client di posta elettronica | Piattaforma | Plugin consigliato | Note |
| --------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Thunderbird | Scrivania | [Configure OpenPGP in Thunderbird](https://support.mozilla.org/en-US/kb/openpgp-thunderbird-howto-and-faq#w_i-have-never-used-openpgp-with-thunderbird-before-how-do-i-setup-openpgp) | Thunderbird ha un supporto integrato per OpenPGP. |
| Gmail | Browser | [Mailvelope](https://mailvelope.com/) o [FlowCrypt](https://flowcrypt.com/download) (licenza proprietaria) | Gmail non supporta OpenPGP, tuttavia puoi scaricare il plugin open source [Mailvelope](https://mailvelope.com/) o [FlowCrypt](https://flowcrypt.com/download). |
| Apple Mail | macOS | [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation) | Apple Mail non supporta OpenPGP, tuttavia puoi scaricare il plugin open source [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation). |
| Apple Mail | iOS | [PGPro](https://github.com/opensourceios/PGPro/) o [FlowCrypt](https://apps.apple.com/us/app/flowcrypt-encrypted-email/id1591754995) (licenza proprietaria) | Apple Mail non supporta OpenPGP, tuttavia puoi scaricare il plugin open source [PGPro](https://github.com/opensourceios/PGPro/) o [FlowCrypt](https://flowcrypt.com/download). |
| Veduta | Finestre | [gpg4win](https://www.gpg4win.de/index.html) | Il client di posta desktop di Outlook non supporta OpenPGP, tuttavia è possibile scaricare il plugin open source [gpg4win](https://www.gpg4win.de/index.html). |
| Veduta | Browser | [Mailvelope](https://mailvelope.com/) o [FlowCrypt](https://flowcrypt.com/download) (licenza proprietaria) | Il client di posta basato sul Web di Outlook non supporta OpenPGP, tuttavia è possibile scaricare il plugin open source [Mailvelope](https://mailvelope.com/) o [FlowCrypt](https://flowcrypt.com/download). |
| Android | Mobile | [OpenKeychain](https://www.openkeychain.org/) o [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email) | [Android mail clients](/blog/open-source/android-email-clients) come [Thunderbird Mobile](https://www.thunderbird.net/en-US/mobile/) e [FairEmail](https://github.com/M66B/FairEmail) supportano entrambi il plugin open source [OpenKeychain](https://www.openkeychain.org/). In alternativa, è possibile utilizzare il plugin open source (con licenza proprietaria) [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email). |
| Google Chrome | Browser | [Mailvelope](https://mailvelope.com/) o [FlowCrypt](https://flowcrypt.com/download) (licenza proprietaria) | Puoi scaricare l'estensione open source del browser [Mailvelope](https://mailvelope.com/) o [FlowCrypt](https://flowcrypt.com/download). |
| Mozilla Firefox | Browser | [Mailvelope](https://mailvelope.com/) o [FlowCrypt](https://flowcrypt.com/download) (licenza proprietaria) | Puoi scaricare l'estensione open source del browser [Mailvelope](https://mailvelope.com/) o [FlowCrypt](https://flowcrypt.com/download). |
| Microsoft Edge | Browser | [Mailvelope](https://mailvelope.com/) | Puoi scaricare l'estensione open source del browser [Mailvelope](https://mailvelope.com/). |
| Coraggioso | Browser | [Mailvelope](https://mailvelope.com/) o [FlowCrypt](https://flowcrypt.com/download) (licenza proprietaria) | Puoi scaricare l'estensione open source del browser [Mailvelope](https://mailvelope.com/) o [FlowCrypt](https://flowcrypt.com/download). |
| Balsa | Scrivania | [Configure OpenPGP in Balsa](https://www.mynetcologne.de/~nc-dreszal/balsa/balsa23-secure-mail.html#USING) | Balsa ha un supporto integrato per OpenPGP. |
| KMail | Scrivania | [Configure OpenPGP in KMail](https://userbase.kde.org/KMail/PGP_MIME) | KMail ha un supporto integrato per OpenPGP. |
| Evoluzione di GNOME | Scrivania | [Configure OpenPGP in Evolution](https://help.gnome.org/users/evolution/stable/mail-encryption.html.en) | GNOME Evolution ha un supporto integrato per OpenPGP. |
| terminale | Scrivania | [Configure gpg in Terminal](https://docs.github.com/en/authentication/managing-commit-signature-verification/generating-a-new-gpg-key#generating-a-gpg-key) | È possibile utilizzare il comando open source [gpg command line tool](https://www.gnupg.org/download/) per generare una nuova chiave dalla riga di comando. |

2. Apri il plugin, crea la tua chiave pubblica e configura il tuo client di posta elettronica per utilizzarla.

3. Carica la tua chiave pubblica su <https://keys.openpgp.org/upload>.

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Suggerimento:
</strong>
<span>Puoi visitare <a class="alert-link" href="https://keys.openpgp.org/manage">https://keys.openpgp.org/manage</a> per gestire la tua chiave in futuro.</span>
</div>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Componente aggiuntivo opzionale:
</strong>
<span>
Se utilizzi il nostro servizio di <a class="alert-link" href="/blog/docs/best-quantum-safe-encrypted-email-service">archiviazione crittografata (IMAP/POP3)</a> e desideri che <i>tutte</i> le email archiviate nel tuo database SQLite (già crittografate) vengano crittografate con la tua chiave pubblica, vai su <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Il mio account <i class="fa fa-angle-right"></i> Domini</a> <i class="fa fa-angle-right"></i> Alias (ad esempio <code>hello@example.com</code>) <i class="fa fa-angle-right"></i> Modifica <i class="fa fa-angle-right"></i> OpenPGP e carica la tua chiave pubblica.
</span>
</div>

4. Aggiungi un nuovo record `CNAME` al tuo nome di dominio (ad esempio `example.com`):

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Nome/Host/Alias</th>
<th class="text-center">TTL</th>
<th>Tipo</th>
<th>Risposta/Valore</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>openpgpkey</code></td>
<td class="text-center">3600</td>
<td class="notranslate">CNAME</td>
<td><code>wkd.keys.openpgp.org</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Suggerimento:
</strong>
<span>Se il tuo alias utilizza i nostri <a class="alert-link" href="/disposable-addresses" target="_blank">domini vanity/usa e getta</a> (ad esempio <code>hideaddress.net</code>), puoi saltare questo passaggio.</span>
</div>

<div class="text-center my-3 my-md-5">
<div class="alert my-3 alert-success d-inline-block">
<i class="fa fa-check-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Congratulazioni!
</strong>
<span>
Hai completato con successo tutti i passaggi.
</span>
</div>
</div>

### Supporti MTA-STS {#do-you-support-mta-sts}

Sì, dal 2 marzo 2023 supportiamo [MTA-STS](https://www.hardenize.com/blog/mta-sts). Puoi utilizzare [questo modello](https://github.com/jpawlowski/mta-sts.template) se desideri abilitarlo sul tuo dominio.

La nostra configurazione può essere trovata pubblicamente su GitHub all'indirizzo <https://github.com/forwardemail/mta-sts.forwardemail.net>.

### Supporti passkey e WebAuthn {#do-you-support-passkeys-and-webauthn}

Sì! Dal 13 dicembre 2023 abbiamo aggiunto il supporto per le passkey [a causa dell'elevata domanda](https://github.com/orgs/forwardemail/discussions/182).

Le passkey consentono di accedere in modo sicuro senza richiedere una password e l'autenticazione a due fattori.

Puoi convalidare la tua identità tramite tocco, riconoscimento facciale, password basata sul dispositivo o PIN.

Ti consentiamo di gestire fino a 30 passkey contemporaneamente, così potrai accedere facilmente da tutti i tuoi dispositivi.

Per saperne di più sulle passkey, clicca sui seguenti link:

* [Accedi alle tue applicazioni e ai tuoi siti web con le passkey](https://support.google.com/android/answer/14124480?hl=en) (Google)
* [Utilizzare le passkey per accedere ad app e siti Web su iPhone](https://support.apple.com/guide/iphone/use-passkeys-to-sign-in-to-apps-and-websites-iphf538ea8d0/ios) (Apple)
* [Articolo di Wikipedia sulle passkey](https://en.wikipedia.org/wiki/Passkey_\(credential\))

### Supporti le migliori pratiche di posta elettronica {#do-you-support-email-best-practices}

Sì. Abbiamo integrato il supporto per SPF, DKIM, DMARC, ARC e SRS in tutti i piani. Abbiamo inoltre collaborato a lungo con gli autori originali di queste specifiche e con altri esperti di email marketing per garantire la perfezione e un'elevata deliverability.

### Supporti i webhook di rimbalzo {#do-you-support-bounce-webhooks}

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Suggerimento:
</strong>
Cerchi documentazione sui webhook email? Consulta <a href="/faq#do-you-support-webhooks" class="alert-link">Supportate i webhook?</a> per maggiori informazioni.
<span>
</span>
</div>

Sì, dal 14 agosto 2024 abbiamo aggiunto questa funzionalità. Ora puoi andare su Account → Domini → Impostazioni → URL webhook di rimbalzo e configurare un URL `http://` o `https://` a cui invieremo una richiesta `POST` ogni volta che le email SMTP in uscita vengono rimbalzate.

Questa funzionalità è utile per gestire e monitorare il tuo SMTP in uscita e può essere utilizzata per gestire gli abbonati, escluderli e rilevare eventuali rimbalzi.

I payload del webhook di rimbalzo vengono inviati come JSON con le seguenti proprietà:

* `email_id` (Stringa) - ID email corrispondente a un'email in Il mio account → Email (SMTP in uscita)
* `list_id` (Stringa) - Valore dell'intestazione `List-ID` (senza distinzione tra maiuscole e minuscole), se presente, dell'email in uscita originale
* `list_unsubscribe` (Stringa) - Valore dell'intestazione `List-Unsubscribe` (senza distinzione tra maiuscole e minuscole), se presente, dell'email in uscita originale
* `feedback_id` (Stringa) - Valore dell'intestazione `Feedback-ID` (senza distinzione tra maiuscole e minuscole), se presente, dell'email in uscita originale
* `recipient` (Stringa) - Indirizzo email del destinatario che ha restituito la posta o ha generato un errore
* `message` (Stringa) - Messaggio di errore dettagliato per la posta non inviata
* `response` (Stringa) - Messaggio di risposta SMTP
* `list_id`0 (Numero) - il codice di risposta SMTP analizzato
* `list_id`1 (Stringa) - se il codice di risposta proveniva da una fonte attendibile, questo valore verrà popolato con il nome del dominio radice (ad esempio `list_id`2 o `list_id`3)
* `list_id`4 (Oggetto) - un oggetto contenente le seguenti proprietà che specificano lo stato di bounce e di rifiuto
* `list_id`5 (Stringa) - azione di bounce (ad esempio `list_id`6)
* `list_id`7 (Stringa) - motivo del bounce (ad esempio `list_id`8)
* `list_id`9 (Stringa) - categoria di bounce (ad esempio `List-ID`0)
* `List-ID`1 (Numero) - codice di stato del bounce (ad esempio `List-ID`2)
* `List-ID`3 (Stringa) - codice di bounce dal messaggio di risposta (ad es. `List-ID`4)
* `List-ID`5 (Numero) - numero di riga analizzata, se presente, `List-ID`6 (ad es. `List-ID`7)
* `List-ID`8 (Oggetto) - coppia chiave-valore delle intestazioni per l'email in uscita
* `List-ID`9 (Stringa) - data formattata `list_unsubscribe`0 in cui si è verificato l'errore di bounce

Per esempio:

```json
{
  "email_id": "66bcce793ef7b2a0928e14ba",
  "recipient": "example@gmail.com",
  "message": "The email account that you tried to reach is over quota.",
  "response": "552 5.2.2 The email account that you tried to reach is over quota.",
  "response_code": 552,
  "truth_source": "google.com",
  "bounce": {
    "action": "reject",
    "message": "Gmail Mailbox is full",
    "category": "capacity",
    "code": 552,
    "status": "5.2.2",
    "line": 300
  },
  "headers": {},
  "bounced_at": "2024-08-24T01:50:02.828Z"
}
```

Ecco alcune note aggiuntive sui webhook di rimbalzo:

* Se il payload del webhook contiene un valore `list_id`, `list_unsubscribe` o `feedback_id`, dovresti intraprendere le azioni appropriate per rimuovere `recipient` dall'elenco, se necessario.
* Se il valore `bounce.category` era `"block"`, `"recipient"`, `"spam"` o `"virus"`, dovresti assolutamente rimuovere l'utente dall'elenco.
* Se devi verificare i payload del webhook (per assicurarti che provengano effettivamente dal nostro server), puoi usare [risolvere l'indirizzo IP del client remoto o il nome host del client utilizzando una ricerca inversa](https://nodejs.org/api/dns.html#dnspromisesreverseip) – dovrebbe essere `list_unsubscribe`0.
* Puoi anche confrontare l'IP con `list_unsubscribe`1.
* Vai su Il mio account → Domini → Impostazioni → Chiave di verifica del payload della firma del webhook per ottenere la tua chiave webhook. * Puoi ruotare questa chiave in qualsiasi momento per motivi di sicurezza.
* Calcola e confronta il valore `list_unsubscribe`2 della nostra richiesta webhook con il valore del corpo calcolato utilizzando questa chiave. Un esempio di come farlo è disponibile in `list_unsubscribe`3.
* Consulta la discussione in <`list_unsubscribe`4 per maggiori informazioni.
* Attenderemo fino a `list_unsubscribe`5 secondi affinché l'endpoint del tuo webhook risponda con un codice di stato `list_unsubscribe`6 e riproveremo fino a `list_unsubscribe`7 secondi.
* Se rileviamo un errore nell'URL del tuo webhook di bounce durante il tentativo di inviargli una richiesta, ti invieremo un'email di cortesia una volta a settimana.

### Supporti i webhook {#do-you-support-webhooks}

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Suggerimento:
</strong>
Cerchi documentazione sui webhook di bounce? Consulta <a href="/faq#do-you-support-bounce-webhooks" class="alert-link">Supportate i webhook di bounce?</a> per maggiori informazioni.
<span>
</span>
</div>

Sì, dal 15 maggio 2020 abbiamo aggiunto questa funzionalità. Puoi semplicemente aggiungere webhook esattamente come faresti con qualsiasi destinatario! Assicurati di avere il prefisso "http" o "https" nell'URL del webhook.

<div class="alert my-3 alert-danger">
<i class="fa fa-stop-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Protezione della privacy avanzata:
</strong>
<span>
Se hai un piano a pagamento (che offre una protezione della privacy avanzata), vai alla sezione <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Domini del mio account <i class="fa fa-angle-right"></i> e clicca su "Alias" accanto al tuo dominio per configurare i tuoi webhook. Per saperne di più sui piani a pagamento, consulta la nostra pagina <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Prezzi</a>. In caso contrario, puoi continuare a seguire le istruzioni riportate di seguito.
</span>
</div>

Se hai il piano gratuito, aggiungi semplicemente un nuovo record DNS <strong class="notranslate">TXT</strong> come mostrato di seguito:

Ad esempio, se voglio che tutte le email indirizzate a `alias@example.com` vengano inoltrate a un nuovo endpoint di test [richiesta cestino](https://requestbin.com/r/en8pfhdgcculn?inspect):

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Nome/Host/Alias</th>
<th class="text-center">TTL</th>
<th>Tipo</th>
<th>Risposta/Valore</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", "." o vuoto</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=alias:https://requestbin.com/r/en8pfhdgcculn</code></td>
</tr>
</tbody>
</table>

Oppure potresti voler inoltrare tutte le email indirizzate a `example.com` a questo endpoint:

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Nome/Host/Alias</th>
<th class="text-center">TTL</th>
<th>Tipo</th>
<th>Risposta/Valore</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", "." o vuoto</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=https://requestbin.com/r/en8pfhdgcculn</code></td>
</tr>
</tbody>
</table>

**Ecco alcune note aggiuntive sui webhook:**

* Se devi verificare i payload dei webhook (per assicurarti che provengano effettivamente dal nostro server), puoi usare [risolvere l'indirizzo IP del client remoto o il nome host del client utilizzando una ricerca inversa](https://nodejs.org/api/dns.html#dnspromisesreverseip) – dovrebbe essere `mx1.forwardemail.net` o `mx2.forwardemail.net`.
* Puoi anche confrontare l'IP con [i nostri indirizzi IP pubblicati](#what-are-your-servers-ip-addresses).
* Se hai un piano a pagamento, vai su Il mio account → Domini → Impostazioni → Chiave di verifica del payload della firma webhook per ottenere la tua chiave webhook.
* Puoi ruotare questa chiave in qualsiasi momento per motivi di sicurezza.
* Calcola e confronta il valore `X-Webhook-Signature` della nostra richiesta webhook con il valore del corpo calcolato utilizzando questa chiave. Un esempio di come farlo è disponibile in [questo post di Stack Overflow](https://stackoverflow.com/a/68885281).
* Consulta la discussione in <https://github.com/forwardemail/free-email-forwarding/issues/235> per ulteriori informazioni. * Se un webhook non risponde con un codice di stato `200`, memorizzeremo la sua risposta in [registro degli errori creato](#do-you-store-error-logs), utile per il debug.
* Le richieste HTTP del webhook effettueranno un nuovo tentativo fino a 3 volte per ogni tentativo di connessione SMTP, con un timeout massimo di 60 secondi per richiesta POST dell'endpoint. **Si noti che questo non significa che effettuerà solo 3 tentativi**, ma che effettuerà un nuovo tentativo continuo nel tempo inviando un codice SMTP 421 (che indica al mittente di riprovare in seguito) dopo il terzo tentativo di richiesta HTTP POST non riuscito. Ciò significa che l'email verrà ritentata continuamente per giorni fino a quando non verrà visualizzato un codice di stato 200.
* Effettueremo un nuovo tentativo automatico in base allo stato predefinito e ai codici di errore utilizzati in [metodo di ripetizione del superagente](https://ladjs.github.io/superagent/#retrying-requests) (di cui siamo responsabili della manutenzione).
* Raggruppiamo le richieste HTTP del webhook allo stesso endpoint in un'unica richiesta anziché in più richieste per risparmiare risorse e accelerare i tempi di risposta. Ad esempio, se si invia un'email a <webhook1@example.com>, <webhook2@example.com> e <webhook3@example.com>, e tutti questi sono configurati per raggiungere lo stesso URL di endpoint *esatto*, verrà effettuata una sola richiesta. Raggruppiamo in base alla corrispondenza esatta dell'endpoint con rigorosa uguaglianza.
* Si noti che utilizziamo il metodo "simpleParser" della libreria `mx1.forwardemail.net`0 per analizzare il messaggio in un oggetto compatibile con JSON.
* Il valore raw dell'email, espresso come stringa, viene specificato come proprietà "raw".
* I risultati dell'autenticazione vengono specificati come proprietà "dkim", "spf", "arc", "dmarc" e "bimi".
* Le intestazioni dell'email analizzate vengono specificate come proprietà "headers", ma è anche possibile utilizzare "headerLines" per semplificare l'iterazione e l'analisi.
* I destinatari raggruppati per questo webhook vengono raggruppati e specificati come proprietà "recipients". * Le informazioni sulla sessione SMTP sono fornite dalla proprietà "session". Questa contiene informazioni sul mittente del messaggio, l'ora di arrivo del messaggio, HELO e il nome host del client. Il valore del nome host del client, `mx1.forwardemail.net`1, è il nome di dominio completo (FQDN) (da una ricerca PTR inversa) oppure è `mx1.forwardemail.net`2 racchiuso tra parentesi quadre (ad esempio, `mx1.forwardemail.net`3).
* Se è necessario un modo rapido per ottenere il valore di `mx1.forwardemail.net`4, è possibile utilizzare il valore di `mx1.forwardemail.net`5 (vedere l'esempio seguente). L'intestazione `mx1.forwardemail.net`6 è un'intestazione che aggiungiamo ai messaggi per il debug con il destinatario originale (prima dell'inoltro mascherato) del messaggio. * Se devi rimuovere le proprietà `mx1.forwardemail.net`7 e/o `mx1.forwardemail.net`8 dal corpo del payload, aggiungi semplicemente `mx1.forwardemail.net`9, `mx2.forwardemail.net`0 o `mx2.forwardemail.net`1 all'endpoint del webhook come parametro querystring (ad esempio `mx2.forwardemail.net`2).
* Se sono presenti allegati, questi verranno aggiunti all'array `mx2.forwardemail.net`3 con i valori del buffer. Puoi analizzarli nuovamente nel contenuto utilizzando un approccio con JavaScript come:

  ```js
  const data = [
    104,
    101,
    108,
    108,
    111,
    32,
    119,
    111,
    114,
    108,
    100,
    33
  ];

  //
  // outputs "hello world!" to the console
  // (this is the content from the filename "text1.txt" in the example JSON request payload above)
  //
  console.log(Buffer.from(data).toString());
  ```

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Suggerimento:
</strong>
Sei curioso di sapere come appare la richiesta webhook dalle email inoltrate? Abbiamo incluso un esempio qui sotto!
<span>
</span>
</div>

```json
{
  "attachments": [
    {
      "type": "attachment",
      "content": {
        "type": "Buffer",
        "data": [
          104,
          101,
          108,
          108,
          111,
          32,
          119,
          111,
          114,
          108,
          100,
          33
        ]
      },
      "contentType": "text/plain",
      "partId": "2",
      "release": null,
      "contentDisposition": "attachment",
      "filename": "text1.txt",
      "headers": {},
      "checksum": "fc3ff98e8c6a0d3087d515c0473f8677",
      "size": 12
    }
  ],
  "headers": "ARC-Seal: i=1; a=rsa-sha256; t=1653506802; cv=none; d=forwardemail.net;\r\n s=default;\r\n b=R6QJ0tGwwjg2VPxiAlVIKxsg3jEPtRGKPTIOdZNWuhWrbssttFdOYzRRqvacDyN5SLoyDhVye\r\n DUA/64IxANXdHVFlpR258Yp7WxLDv2gtJD5vNSKYmUJZOWk1TynmlqTYrp0Vuqg2xIUjIlPBWAJ\r\n PPNx4JvOLjJuWYynU2qIWz0=\r\nARC-Message-Signature: i=1; a=rsa-sha256; c=relaxed/relaxed;\r\n d=forwardemail.net; h=MIME-Version: Date: Message-ID: From: Content-Type;\r\n q=dns/txt; s=default; t=1653506802;\r\n bh=cEYDoyTy+Ub29XZt/zXR+sprfUE6BW0y5cHfah01PT4=;\r\n b=F/t56AAXr2Kv3G6VsbdT5OKDVJf2ulhwLiTM18Ra4tDPUKPSGSLKrWvxiXEg5NMWwdWnsOYrL\r\n r3YSm4uMxVMhHZbHm/sUu4QZq5/18hQsAkCv6fI9ifTjDwBrN5zpLOhPoZFFo+TyvHxiII3Xv3L\r\n UEzmUIIaJRX6tboQ160tino=\r\nARC-Authentication-Results: i=1; mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)\r\nReceived-SPF: none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) client-ip=127.0.0.1;\r\nAuthentication-Results: mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)\r\n",
  "headerLines": [
    {
      "key": "arc-seal",
      "line": "ARC-Seal: i=1; a=rsa-sha256; t=1653506802; cv=none; d=forwardemail.net;\r\n s=default;\r\n b=R6QJ0tGwwjg2VPxiAlVIKxsg3jEPtRGKPTIOdZNWuhWrbssttFdOYzRRqvacDyN5SLoyDhVye\r\n DUA/64IxANXdHVFlpR258Yp7WxLDv2gtJD5vNSKYmUJZOWk1TynmlqTYrp0Vuqg2xIUjIlPBWAJ\r\n PPNx4JvOLjJuWYynU2qIWz0="
    },
    {
      "key": "arc-message-signature",
      "line": "ARC-Message-Signature: i=1; a=rsa-sha256; c=relaxed/relaxed;\r\n d=forwardemail.net; h=MIME-Version: Date: Message-ID: From: Content-Type;\r\n q=dns/txt; s=default; t=1653506802;\r\n bh=cEYDoyTy+Ub29XZt/zXR+sprfUE6BW0y5cHfah01PT4=;\r\n b=F/t56AAXr2Kv3G6VsbdT5OKDVJf2ulhwLiTM18Ra4tDPUKPSGSLKrWvxiXEg5NMWwdWnsOYrL\r\n r3YSm4uMxVMhHZbHm/sUu4QZq5/18hQsAkCv6fI9ifTjDwBrN5zpLOhPoZFFo+TyvHxiII3Xv3L\r\n UEzmUIIaJRX6tboQ160tino="
    },
    {
      "key": "arc-authentication-results",
      "line": "ARC-Authentication-Results: i=1; mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)"
    },
    {
      "key": "received-spf",
      "line": "Received-SPF: none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) client-ip=127.0.0.1;"
    },
    {
      "key": "authentication-results",
      "line": "Authentication-Results: mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)"
    },
    {
      "key": "x-forward-email-sender",
      "line": "X-Forward-Email-Sender: rfc822; test@example.net"
    },
    {
      "key": "x-forward-email-session-id",
      "line": "X-Forward-Email-Session-ID: w2czxgznghn5ryyw"
    },
    {
      "key": "x-forward-email-version",
      "line": "X-Forward-Email-Version: 9.0.0"
    },
    {
      "key": "content-type",
      "line": "Content-Type: multipart/mixed; boundary=\"--_NmP-179a735428ca7575-Part_1\""
    },
    {
      "key": "from",
      "line": "From: some <random@example.com>"
    },
    {
      "key": "message-id",
      "line": "Message-ID: <69ad5fc2-91cb-728f-ae5c-eeedc5f267b6@example.net>"
    },
    {
      "key": "date",
      "line": "Date: Wed, 25 May 2022 19:26:41 +0000"
    },
    {
      "key": "mime-version",
      "line": "MIME-Version: 1.0"
    }
  ],
  "html": "<strong>some random text</strong>",
  "text": "some random text",
  "textAsHtml": "<p>some random text</p>",
  "date": "2022-05-25T19:26:41.000Z",
  "from": {
    "value": [
      {
        "address": "random@example.com",
        "name": "some"
      }
    ],
    "html": "<span class=\"mp_address_group\"><span class=\"mp_address_name\">some</span> &lt;<a href=\"mailto:random@example.com\" class=\"mp_address_email\">random@example.com</a>&gt;</span>",
    "text": "some <random@example.com>"
  },
  "messageId": "<69ad5fc2-91cb-728f-ae5c-eeedc5f267b6@example.net>",
  "raw": "ARC-Seal: i=1; a=rsa-sha256; t=1653506802; cv=none; d=forwardemail.net;\r\n s=default;\r\n b=R6QJ0tGwwjg2VPxiAlVIKxsg3jEPtRGKPTIOdZNWuhWrbssttFdOYzRRqvacDyN5SLoyDhVye\r\n DUA/64IxANXdHVFlpR258Yp7WxLDv2gtJD5vNSKYmUJZOWk1TynmlqTYrp0Vuqg2xIUjIlPBWAJ\r\n PPNx4JvOLjJuWYynU2qIWz0=\r\nARC-Message-Signature: i=1; a=rsa-sha256; c=relaxed/relaxed;\r\n d=forwardemail.net; h=MIME-Version: Date: Message-ID: From: Content-Type;\r\n q=dns/txt; s=default; t=1653506802;\r\n bh=cEYDoyTy+Ub29XZt/zXR+sprfUE6BW0y5cHfah01PT4=;\r\n b=F/t56AAXr2Kv3G6VsbdT5OKDVJf2ulhwLiTM18Ra4tDPUKPSGSLKrWvxiXEg5NMWwdWnsOYrL\r\n r3YSm4uMxVMhHZbHm/sUu4QZq5/18hQsAkCv6fI9ifTjDwBrN5zpLOhPoZFFo+TyvHxiII3Xv3L\r\n UEzmUIIaJRX6tboQ160tino=\r\nARC-Authentication-Results: i=1; mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)\r\nReceived-SPF: none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) client-ip=127.0.0.1;\r\nAuthentication-Results: mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)\r\nX-Forward-Email-Sender: rfc822; test@example.net\r\nX-Forward-Email-Session-ID: w2czxgznghn5ryyw\r\nX-Forward-Email-Version: 9.0.0\r\nContent-Type: multipart/mixed; boundary=\"--_NmP-179a735428ca7575-Part_1\"\r\nFrom: some <random@example.com>\r\nMessage-ID: <69ad5fc2-91cb-728f-ae5c-eeedc5f267b6@example.net>\r\nDate: Wed, 25 May 2022 19:26:41 +0000\r\nMIME-Version: 1.0\r\n\r\n----_NmP-179a735428ca7575-Part_1\r\nContent-Type: multipart/alternative;\r\n boundary=\"--_NmP-179a735428ca7575-Part_2\"\r\n\r\n----_NmP-179a735428ca7575-Part_2\r\nContent-Type: text/plain; charset=utf-8\r\nContent-Transfer-Encoding: 7bit\r\n\r\nsome random text\r\n----_NmP-179a735428ca7575-Part_2\r\nContent-Type: text/html; charset=utf-8\r\nContent-Transfer-Encoding: 7bit\r\n\r\n<strong>some random text</strong>\r\n----_NmP-179a735428ca7575-Part_2--\r\n\r\n----_NmP-179a735428ca7575-Part_1\r\nContent-Type: text/plain; name=text1.txt\r\nContent-Transfer-Encoding: base64\r\nContent-Disposition: attachment; filename=text1.txt\r\n\r\naGVsbG8gd29ybGQh\r\n----_NmP-179a735428ca7575-Part_1--\r\n",
  "dkim": {
    "headerFrom": [
      "random@example.com"
    ],
    "envelopeFrom": "test@example.net",
    "results": [
      {
        "status": {
          "result": "none",
          "comment": "message not signed"
        },
        "info": "dkim=none (message not signed)"
      }
    ]
  },
  "spf": {
    "domain": "example.net",
    "client-ip": "127.0.0.1",
    "helo": "user.oem.local",
    "envelope-from": "test@example.net",
    "status": {
      "result": "none",
      "comment": "mx1.forwardemail.net: example.net does not designate permitted sender hosts",
      "smtp": {
        "mailfrom": "test@example.net",
        "helo": "user.oem.local"
      }
    },
    "header": "Received-SPF: none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) client-ip=127.0.0.1;",
    "info": "spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local",
    "lookups": {
      "limit": 50,
      "count": 1
    }
  },
  "arc": {
    "status": {
      "result": "none"
    },
    "i": 0,
    "authResults": "mx1.forwardemail.net;\r\n dkim=none (message not signed);\r\n spf=none (mx1.forwardemail.net: example.net does not designate permitted sender hosts) smtp.mailfrom=test@example.net smtp.helo=user.oem.local;\r\n dmarc=none header.from=example.com;\r\n bimi=skipped (DMARC not enabled)"
  },
  "dmarc": {
    "status": {
      "result": "none",
      "header": {
        "from": "example.com"
      }
    },
    "domain": "example.com",
    "info": "dmarc=none header.from=example.com"
  },
  "bimi": {
    "status": {
      "header": {},
      "result": "skipped",
      "comment": "DMARC not enabled"
    },
    "info": "bimi=skipped (DMARC not enabled)"
  },
  "recipients": [
    "webhook1@webhooks.net"
  ],
  "session": {
    "recipient": "webhook1@webhooks.net",
    "remoteAddress": "127.0.0.1",
    "remotePort": 65138,
    "clientHostname": "[127.0.0.1]",
    "hostNameAppearsAs": "user.oem.local",
    "sender": "test@example.net",
    "mta": "mx1.forwardemail.net",
    "arrivalDate": "2022-05-25T19:26:41.423Z",
    "arrivalTime": 1653506801423
  }
}
```

### Supporti espressioni regolari o regex {#do-you-support-regular-expressions-or-regex}

Sì, abbiamo aggiunto questa funzionalità dal 27 settembre 2021. È possibile scrivere semplicemente espressioni regolari ("regex") per trovare gli alias e per eseguire sostituzioni.

Gli alias supportati dalle espressioni regolari sono quelli che iniziano con `/` e terminano con `/` e i loro destinatari sono indirizzi email o webhook. I destinatari possono anche includere il supporto per la sostituzione con espressioni regolari (ad esempio, `$1`, `$2`).

Supportiamo due flag di espressioni regolari: `i` e `g`. Il flag `i`, che non distingue tra maiuscole e minuscole, è un'impostazione predefinita permanente e viene sempre applicato. Il flag globale `g` può essere aggiunto aggiungendo `/g` alla parte finale di `/`.

Si noti che supportiamo anche la nostra <a href="#can-i-disable-specific-aliases">disabled funzionalità alias</a> per la parte del destinatario con il nostro supporto regex.

Le espressioni regolari non sono supportate sui <a href="/disposable-addresses" target="_blank">domini vanity globali</a> (poiché ciò potrebbe rappresentare una vulnerabilità di sicurezza).

<div class="alert my-3 alert-danger">
<i class="fa fa-stop-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Protezione della privacy avanzata:
</strong>
<span>
Se hai un piano a pagamento (che offre una protezione della privacy avanzata), vai alla sezione <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Domini del mio account <i class="fa fa-angle-right"></i> e clicca su "Alias" accanto al tuo dominio per configurare le espressioni regolari. Per saperne di più sui piani a pagamento, consulta la nostra pagina <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Prezzi</a>. In caso contrario, puoi continuare a seguire le istruzioni riportate di seguito.
</span>
</div>

Se hai il piano gratuito, aggiungi semplicemente un nuovo record DNS <strong class="notranslate">TXT</strong> utilizzando uno o più degli esempi forniti di seguito:

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Esempio semplice:</strong> Se voglio che tutte le email che vanno a `linus@example.com` o `torvalds@example.com` vengano inoltrate a `user@gmail.com`:
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Nome/Host/Alias</th>
<th class="text-center">TTL</th>
<th>Tipo</th>
<th>Risposta/Valore</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", o vuoto</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^(linus|torvalds)$/:user@gmail.com</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Esempio di sostituzione di nome e cognome:</strong> immagina che tutti gli indirizzi email aziendali siano del modello `firstname.lastname@example.com`. Se voglio che tutte le email che vanno al modello `firstname.lastname@example.com` vengano inoltrate a `firstname.lastname@company.com` con supporto per la sostituzione (<a href="https://regexr.com/66hnu" class="alert-link">visualizza il test su RegExr</a>):
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Nome/Host/Alias</th>
<th class="text-center">TTL</th>
<th>Tipo</th>
<th>Risposta/Valore</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", "." o vuoto</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^([A-Za-z]+)+\.([A-Za-z]+)+$/:$1.$2@company.com</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Esempio di sostituzione del filtro con simbolo più:</strong> Se voglio che tutte le email che vanno a `info@example.com` o `support@example.com` vengano inoltrate rispettivamente a `user+info@gmail.com` o `user+support@gmail.com` (con supporto per la sostituzione) (<a href="https://regexr.com/66ho7" class="alert-link">visualizza il test su RegExr</a>):
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Nome/Host/Alias</th>
<th class="text-center">TTL</th>
<th>Tipo</th>
<th>Risposta/Valore</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", o vuoto</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^(support|info)$/:user+$1@gmail.com</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Esempio di sostituzione della querystring del webhook:</strong> Forse vuoi che tutte le email che vanno a `example.com` vadano a un <a href="#do-you-support-webhooks" class="alert-link">webhook</a> e abbiano una chiave querystring dinamica "to" con un valore pari alla parte nome utente dell'indirizzo email (<a href="https://regexr.com/66ho4" class="alert-link">visualizza il test su RegExr</a>):
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Nome/Host/Alias</th>
<th class="text-center">TTL</th>
<th>Tipo</th>
<th>Risposta/Valore</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", "." o vuoto</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^(.*?)$/:https://example.com/webhook?username=$1</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Esempio di rifiuto silenzioso:</strong> se desideri che tutte le email che corrispondono a un determinato schema vengano disabilitate e rifiutate silenziosamente (al mittente sembrano inviate correttamente, ma in realtà non vengono recapitate) con il codice di stato `250` (vedi <a href="#can-i-disable-specific-aliases" class="alert-link">Posso disabilitare alias specifici</a>), allora usa semplicemente lo stesso approccio con un singolo punto esclamativo "!". Questo indica al mittente che il messaggio è stato recapitato correttamente, ma in realtà non è stato recapitato (ad esempio, blackhole o `/dev/null`).
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Nome/Host/Alias</th>
<th class="text-center">TTL</th>
<th>Tipo</th>
<th>Risposta/Valore</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", o vuoto</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^(linus|torvalds)$/:!</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Esempio di soft reject:</strong> se desideri che tutte le email che corrispondono a un determinato pattern vengano disabilitate e che vengano rifiutate con il codice di stato `421` (vedi <a href="#can-i-disable-specific-aliases" class="alert-link">Posso disabilitare alias specifici</a>), allora usa semplicemente lo stesso approccio con un doppio punto esclamativo "!!". Questo indica al mittente di riprovare l'invio dell'email e le email a questo alias verranno ritentate per circa 5 giorni e poi rifiutate definitivamente.
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Nome/Host/Alias</th>
<th class="text-center">TTL</th>
<th>Tipo</th>
<th>Risposta/Valore</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", o vuoto</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^(linus|torvalds)$/:!!</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-secondary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong>Esempio di rifiuto definitivo:</strong> se desideri che tutte le email che corrispondono a un determinato schema vengano disabilitate e rifiutate definitivamente con il codice di stato `550` (vedi <a href="#can-i-disable-specific-aliases" class="alert-link">Posso disabilitare alias specifici</a>), allora usa semplicemente lo stesso approccio con un triplo punto esclamativo "!!!". Questo indica al mittente un errore permanente e le email non verranno ritentate, ma rifiutate per questo alias.
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Nome/Host/Alias</th>
<th class="text-center">TTL</th>
<th>Tipo</th>
<th>Risposta/Valore</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", o vuoto</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=/^(linus|torvalds)$/:!!!</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Suggerimento:
</strong>
Sei curioso di sapere come scrivere un'espressione regolare o hai bisogno di testare la tua sostituzione? Puoi visitare il sito web gratuito per il test delle espressioni regolari <a href="https://regexr.com" class="alert-link">RegExr</a> all'indirizzo <a href="https://regexr.com/" class="alert-link">https://regexr.com</a>.
<span>
</span>
</div>

### Quali sono i tuoi limiti SMTP in uscita {#what-are-your-outbound-smtp-limits}

Il limite massimo consentito per utenti e domini è di 300 messaggi SMTP in uscita al giorno. Questo equivale in media a oltre 9000 email in un mese solare. Se devi superare questo limite o hai email di dimensioni costantemente elevate, ti preghiamo di impostare [contattaci](https://forwardemail.net/help).

### Ho bisogno dell'approvazione per abilitare SMTP {#do-i-need-approval-to-enable-smtp}

Sì, tieni presente che, per mantenere la reputazione dell'IP e garantire la consegna, Forward Email prevede un processo di revisione manuale per dominio per l'approvazione SMTP in uscita. Invia un'email a <support@forwardemail.net> o apri un [richiesta di aiuto](https://forwardemail.net/help) per l'approvazione. In genere, questa operazione richiede meno di 24 ore e la maggior parte delle richieste viene evasa entro 1-2 ore. Nel prossimo futuro, puntiamo a rendere questo processo istantaneo con controlli antispam aggiuntivi e avvisi. Questo processo garantisce che le tue email raggiungano la posta in arrivo e che i tuoi messaggi non vengano contrassegnati come spam.

### Quali sono le impostazioni di configurazione del server SMTP {#what-are-your-smtp-server-configuration-settings}

Il nostro server è `smtp.forwardemail.net` ed è monitorato anche nella nostra <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">pagina di stato</a>.

Supporta sia IPv4 che IPv6 ed è disponibile sulle porte `465` e `2465` per SSL/TLS e `587`, `2587`, `2525` e `25` per TLS (STARTTLS).

| Protocollo | Nome host | porti | IPv4 | IPv6 |
| :--------------------------------------------------------------: | ----------------------- | :-------------------------: | :----------------: | :----------------: |
| `SSL/TLS` **Preferito** | `smtp.forwardemail.net` | `465`, `2465` | :segno di spunta bianco: | :segno di spunta bianco: |
| `TLS` ([STARTTLS](https://wikipedia.org/wiki/Opportunistic_TLS)) | `smtp.forwardemail.net` | `587`, `2587`, `2525`, `25` | :segno di spunta bianco: | :segno di spunta bianco: |

| Login | Esempio | Descrizione |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nome utente | `user@example.com` | Indirizzo email di un alias esistente per il dominio in <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Il mio account <i class="fa fa-angle-right"></i> Domini</a>. |
| Password | `************************` | Password generata specifica dell'alias. |

Per inviare e-mail in uscita tramite SMTP, l'**utente SMTP** deve essere l'indirizzo e-mail di un alias esistente per il dominio in <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Il mio account <i class="fa fa-angle-right"></i> Domini</a> e la **password SMTP** deve essere una password generata specifica dell'alias.

Per istruzioni dettagliate, fare riferimento a [Supportate l'invio di e-mail con SMTP?](#do-you-support-sending-email-with-smtp).

### Quali sono le impostazioni di configurazione del server IMAP {#what-are-your-imap-server-configuration-settings}

Il nostro server è `imap.forwardemail.net` ed è monitorato anche nella nostra <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">pagina di stato</a>.

Supporta sia IPv4 che IPv6 ed è disponibile sulle porte `993` e `2993` per SSL/TLS.

| Protocollo | Nome host | porti | IPv4 | IPv6 |
| :---------------------: | ----------------------- | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **Preferito** | `imap.forwardemail.net` | `993`, `2993` | :segno di spunta bianco: | :segno di spunta bianco: |

| Login | Esempio | Descrizione |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nome utente | `user@example.com` | Indirizzo email di un alias esistente per il dominio in <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Il mio account <i class="fa fa-angle-right"></i> Domini</a>. |
| Password | `************************` | Password generata specifica dell'alias. |

Per connettersi con IMAP, l'**utente IMAP** deve essere l'indirizzo email di un alias esistente per il dominio in <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Il mio account <i class="fa fa-angle-right"></i> Domini</a> e la **password IMAP** deve essere una password generata specifica dell'alias.

Per istruzioni dettagliate, fare riferimento a [Supportate la ricezione di e-mail con IMAP?](#do-you-support-receiving-email-with-imap).

### Quali sono le impostazioni di configurazione del server POP3 {#what-are-your-pop3-server-configuration-settings}

Il nostro server è `pop3.forwardemail.net` ed è monitorato anche nella nostra <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">pagina di stato</a>.

Supporta sia IPv4 che IPv6 ed è disponibile sulle porte `995` e `2995` per SSL/TLS.

| Protocollo | Nome host | porti | IPv4 | IPv6 |
| :---------------------: | ----------------------- | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **Preferito** | `pop3.forwardemail.net` | `995`, `2995` | :segno di spunta bianco: | :segno di spunta bianco: |

| Login | Esempio | Descrizione |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nome utente | `user@example.com` | Indirizzo email di un alias esistente per il dominio in <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Il mio account <i class="fa fa-angle-right"></i> Domini</a>. |
| Password | `************************` | Password generata specifica dell'alias. |

Per connettersi tramite POP3, l'**utente POP3** deve essere l'indirizzo email di un alias esistente per il dominio in <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Il mio account <i class="fa fa-angle-right"></i> Domini</a> e la **password IMAP** deve essere una password generata specifica per l'alias.

Per istruzioni dettagliate, fare riferimento a [Supporti POP3?](#do-you-support-pop3).

### Configurazione del relay SMTP Postfix {#postfix-smtp-relay-configuration}

È possibile configurare Postfix per inoltrare le email tramite i server SMTP di Forward Email. Questa funzionalità è utile per le applicazioni server che devono inviare email.

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
<i class="fa fa-stopwatch font-weight-bold"></i>
<strong class="font-weight-bold">Tempo di configurazione stimato:</strong>
<span>Meno di 15 minuti</span>
</div>

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Importante:
</strong>
<span>
Questo richiede un piano a pagamento con accesso SMTP abilitato.
</span>
</div>

#### Installazione {#installation}

1. Installa Postfix sul tuo server:

```bash
# Ubuntu/Debian
sudo apt update && sudo apt install postfix

# CentOS/RHEL
sudo yum install postfix

# macOS
brew install postfix
```

2. Durante l'installazione, selezionare "Sito Internet" quando viene richiesto il tipo di configurazione.

#### Configurazione {#configuration}

1. Modificare il file di configurazione principale di Postfix:

```bash
sudo nano /etc/postfix/main.cf
```

2. Aggiungi o modifica queste impostazioni:

```
# SMTP relay configuration
relayhost = [smtp.forwardemail.net]:587
smtp_use_tls = yes
smtp_sasl_auth_enable = yes
smtp_sasl_password_maps = hash:/etc/postfix/sasl_passwd
smtp_sasl_security_options = noanonymous
smtp_tls_CAfile = /etc/ssl/certs/ca-certificates.crt
```

3. Creare il file della password SASL:

```bash
sudo nano /etc/postfix/sasl_passwd
```

4. Aggiungi le tue credenziali di inoltro e-mail:

```
[smtp.forwardemail.net]:587 your-alias@yourdomain.com:your-generated-password
```

5. Proteggere e applicare l'hash al file delle password:

```bash
sudo chmod 600 /etc/postfix/sasl_passwd
sudo postmap /etc/postfix/sasl_passwd
```

6. Riavviare Postfix:

```bash
sudo systemctl restart postfix
```

#### Test di {#testing}

Prova la tua configurazione inviando un'e-mail di prova:

```bash
echo "Test email body" | mail -s "Test Subject" recipient@example.com
```

## Sicurezza {#security}

### Tecniche avanzate di rafforzamento del server {#advanced-server-hardening-techniques}

> \[!TIP]
> Scopri di più sulla nostra infrastruttura di sicurezza su [la nostra pagina sulla sicurezza](/security).

Forward Email implementa numerose tecniche di rafforzamento del server per garantire la sicurezza della nostra infrastruttura e dei tuoi dati:

1. **Sicurezza di rete**:
* Firewall delle tabelle IP con regole rigorose
* Fail2ban per la protezione dagli attacchi di forza bruta
* Audit di sicurezza e penetration test regolari
* Accesso amministrativo solo tramite VPN

2. **Rafforzamento del sistema**:
* Installazione minima del pacchetto
* Aggiornamenti di sicurezza regolari
* SELinux in modalità di enforcing
* Accesso SSH root disabilitato
* Solo autenticazione basata su chiave

3. **Sicurezza delle applicazioni**:
* Intestazioni della Content Security Policy (CSP)
* HTTPS Strict Transport Security (HSTS)
* Intestazioni di protezione XSS
* Intestazioni delle opzioni frame e della policy di referrer
* Audit periodici delle dipendenze

4. **Protezione dei dati**:
* Crittografia completa del disco con LUKS
* Gestione sicura delle chiavi
* Backup regolari con crittografia
* Pratiche di minimizzazione dei dati

5. **Monitoraggio e risposta**:
* Rilevamento delle intrusioni in tempo reale
* Scansione di sicurezza automatizzata
* Registrazione e analisi centralizzate
* Procedure di risposta agli incidenti

> \[!IMPORTANT]
> Le nostre pratiche di sicurezza vengono costantemente aggiornate per affrontare minacce e vulnerabilità emergenti.

> \[!TIP]
> Per la massima sicurezza, consigliamo di utilizzare il nostro servizio con crittografia end-to-end tramite OpenPGP.

### Hai certificazioni SOC 2 o ISO 27001 {#do-you-have-soc-2-or-iso-27001-certifications}

> \[!NOTE]
> Forward Email opera su infrastrutture fornite da subappaltatori certificati per garantire la conformità agli standard di settore.

Forward Email non detiene direttamente le certificazioni SOC 2 Tipo II o ISO 27001. Tuttavia, il servizio opera su infrastrutture fornite da subappaltatori certificati:

* **DigitalOcean**: Certificazione SOC 2 Tipo II e SOC 3 Tipo II (verificata da Schellman & Company LLC), certificazione ISO 27001 presso diversi data center. Dettagli: <https://www.digitalocean.com/trust/certification-reports>

* **Vultr**: Certificato SOC 2+ (HIPAA), certificazioni ISO/IEC: 20000-1:2018, 27001:2022, 27017:2015, 27018:2019. Dettagli: <https://www.vultr.com/legal/compliance/>

* **DataPacket**: fornitore di infrastrutture di livello enterprise (sede di Denver), conforme allo standard SOC 2 (contattare direttamente DataPacket per ottenere la certificazione). Dettagli: <https://www.datapacket.com/datacenters/denver>

Forward Email segue le migliori pratiche del settore per gli audit di sicurezza e collabora regolarmente con ricercatori di sicurezza indipendenti. Fonte: <https://forwardemail.net/technical-whitepaper.pdf#page=36>

### Utilizzi la crittografia TLS per l'inoltro delle email {#do-you-use-tls-encryption-for-email-forwarding}

Sì. Forward Email applica rigorosamente TLS 1.2+ per tutte le connessioni (HTTPS, SMTP, IMAP, POP3) e implementa MTA-STS per un supporto TLS migliorato. L'implementazione include:

* Applicazione TLS 1.2+ per tutte le connessioni email
* Scambio di chiavi ECDHE (Elliptic Curve Diffie-Hellman Ephemeral) per una perfetta segretezza in avanti
* Moderne suite di cifratura con aggiornamenti di sicurezza regolari
* Supporto HTTP/2 per prestazioni e sicurezza migliorate
* HSTS (HTTP Strict Transport Security) con precaricamento nei principali browser
* **MTA-STS (Mail Transfer Agent Strict Transport Security)** per un'applicazione TLS rigorosa

Fonte: <https://forwardemail.net/technical-whitepaper.pdf#page=25>

**Implementazione MTA-STS**: Forward Email implementa un'applicazione rigorosa di MTA-STS nel codice sorgente. Quando si verificano errori TLS e MTA-STS viene applicato, il sistema restituisce codici di stato SMTP 421 per garantire che le email vengano ritentate in un secondo momento anziché essere recapitate in modo non sicuro. Dettagli di implementazione:

* Rilevamento errore TLS: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-tls-error.js>
* Applicazione MTA-STS nell'helper di invio email: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/send-email.js>

Convalida di terze parti: <https://www.hardenize.com/report/forwardemail.net/1750312779> mostra valutazioni "Buono" per tutte le misure di sicurezza TLS e di trasporto.

### Conservi le intestazioni di autenticazione e-mail {#do-you-preserve-email-authentication-headers}

Sì. Forward Email implementa e conserva in modo completo le intestazioni di autenticazione delle email:

* **SPF (Sender Policy Framework)**: Implementato e mantenuto correttamente
* **DKIM (DomainKeys Identified Mail)**: Supporto completo con una corretta gestione delle chiavi
* **DMARC**: Applicazione delle policy per le email che non superano la convalida SPF o DKIM
* **ARC**: Sebbene non siano esplicitamente dettagliati, i punteggi di conformità perfetti del servizio suggeriscono una gestione completa delle intestazioni di autenticazione

Fonte: <https://forwardemail.net/technical-whitepaper.pdf#page=31>

Validazione: il test di posta di Internet.nl ha ottenuto un punteggio di 100/100 specificamente per l'implementazione di "SPF, DKIM e DMARC". La valutazione Hardenize conferma le valutazioni "Buono" per SPF e DMARC: <https://www.hardenize.com/report/forwardemail.net/1750312779>

### Conservi le intestazioni originali delle email e impedisci lo spoofing {#do-you-preserve-original-email-headers-and-prevent-spoofing}

> \[!TIP]
> Forward Email implementa una sofisticata protezione anti-spoofing per prevenire l'abuso delle email.

Forward Email conserva le intestazioni originali delle email implementando al contempo una protezione anti-spoofing completa tramite il codice MX:

* **Conservazione dell'intestazione**: le intestazioni di autenticazione originali vengono mantenute durante l'inoltro
* **Anti-spoofing**: l'applicazione della policy DMARC impedisce lo spoofing dell'intestazione rifiutando le email che non superano la convalida SPF o DKIM
* **Prevenzione dell'iniezione dell'intestazione**: convalida e sanificazione dell'input tramite la libreria striptags
* **Protezione avanzata**: rilevamento sofisticato del phishing con rilevamento dello spoofing, prevenzione dell'impersonificazione e sistemi di notifica all'utente

**Dettagli sull'implementazione MX**: La logica di elaborazione delle e-mail di base è gestita dal codice di base del server MX, in particolare:

* Gestore dati MX principale: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>
* Filtraggio email arbitrario (anti-spoofing): <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-arbitrary.js>

L'helper `isArbitrary` implementa sofisticate regole anti-spoofing, tra cui il rilevamento dell'impersonificazione di domini, frasi bloccate e vari modelli di phishing.

Fonte: <https://forwardemail.net/technical-whitepaper.pdf#page=32>

### Come ti proteggi da spam e abusi {#how-do-you-protect-against-spam-and-abuse}

Forward Email implementa una protezione multistrato completa:

* **Rate Limiting**: Applicato a tentativi di autenticazione, endpoint API e connessioni SMTP
* **Resource Isolation**: Tra utenti per prevenire l'impatto di utenti con volumi elevati
* **DDoS Protection**: Protezione multilivello tramite il sistema Shield di DataPacket e Cloudflare
* **Auto Scaling**: Adeguamento dinamico delle risorse in base alla domanda
* **Abuse Prevention**: Controlli di prevenzione degli abusi specifici per utente e blocco basato su hash per contenuti dannosi
* **Email Authentication**: Protocolli SPF, DKIM, DMARC con rilevamento avanzato del phishing

Fonti:

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver> (Dettagli sulla protezione DDoS)
* <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/abuse-prevention-by-user-id.js>

### Memorizzi il contenuto della posta elettronica sul disco {#do-you-store-email-content-on-disk}

> \[!IMPORTANT]
> Forward Email utilizza un'architettura a conoscenza zero che impedisce la scrittura del contenuto dell'email su disco.

* **Architettura a conoscenza zero**: le caselle di posta SQLite crittografate individualmente impediscono a Forward Email di accedere al contenuto delle email
* **Elaborazione in memoria**: l'elaborazione delle email avviene interamente in memoria, evitando l'archiviazione su disco
* **Nessuna registrazione dei contenuti**: "Non registriamo né memorizziamo il contenuto delle email o i metadati su disco"
* **Crittografia sandbox**: le chiavi di crittografia non vengono mai memorizzate su disco in chiaro

**Evidenza del codice MX**: Il server MX elabora le email interamente in memoria, senza scriverne il contenuto su disco. Il gestore principale dell'elaborazione email dimostra questo approccio in memoria: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

Fonti:

* <https://forwardemail.net/technical-whitepaper.pdf#page=10> (Abstract)
* <https://forwardemail.net/technical-whitepaper.pdf#page=59> (Dettagli a conoscenza zero)
* <https://forwardemail.net/technical-whitepaper.pdf#page=21> (Crittografia sandbox)

### Il contenuto dell'email può essere esposto durante arresti anomali del sistema {#can-email-content-be-exposed-during-system-crashes}

No. Forward Email implementa misure di sicurezza complete contro l'esposizione dei dati in caso di crash:

* **Core Dumps Disabilitati**: Previene l'esposizione della memoria durante gli arresti anomali
* **Memoria di Swap Disabilitata**: Completamente disabilitata per impedire l'estrazione di dati sensibili dai file di swap
* **Architettura In-Memory**: Il contenuto delle email esiste solo nella memoria volatile durante l'elaborazione
* **Protezione con Chiave di Crittografia**: Le chiavi non vengono mai memorizzate su disco in chiaro
* **Sicurezza Fisica**: I dischi crittografati LUKS v2 impediscono l'accesso fisico ai dati
* **Archiviazione USB Disabilitata**: Previene l'estrazione non autorizzata di dati

**Gestione degli errori per problemi di sistema**: Forward Email utilizza le funzioni di supporto `isCodeBug` e `isTimeoutError` per garantire che, in caso di problemi di connettività al database, problemi di rete DNS/lista bloccata o problemi di connettività upstream, il sistema restituisca i codici di stato SMTP 421 per garantire che le e-mail vengano ritentate in un secondo momento anziché essere perse o esposte.

Dettagli di implementazione:

* Classificazione dell'errore: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js>
* Gestione degli errori di timeout nell'elaborazione MX: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

Fonte: <https://forwardemail.net/technical-whitepaper.pdf#page=15>

### Chi ha accesso alla tua infrastruttura di posta elettronica {#who-has-access-to-your-email-infrastructure}

Forward Email implementa controlli di accesso completi per il suo team di ingegneri composto da un minimo di 2-3 persone con rigorosi requisiti 2FA:

* **Controllo degli accessi basato sui ruoli**: per account team con autorizzazioni basate sulle risorse
* **Principio del privilegio minimo**: applicato a tutti i sistemi
* **Segregazione dei compiti**: tra ruoli operativi
* **Gestione utenti**: utenti di deploy e DevOps separati con autorizzazioni distinte
* **Accesso root disabilitato**: forza l'accesso tramite account correttamente autenticati
* **2FA rigoroso**: nessuna 2FA basata su SMS a causa del rischio di attacchi MiTM - solo token basati su app o hardware
* **Registrazione di audit completa**: con oscuramento dei dati sensibili
* **Rilevamento automatico delle anomalie**: per modelli di accesso insoliti
* **Revisioni di sicurezza regolari**: dei log di accesso
* **Prevenzione degli attacchi Evil Maid**: archiviazione USB disabilitata e altre misure di sicurezza fisica

Fonti:

* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (Controlli di autorizzazione)
* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (Sicurezza di rete)
* <https://forwardemail.net/technical-whitepaper.pdf#page=15> (Prevenzione degli attacchi della cameriera malvagia)

### Quali fornitori di infrastrutture utilizzi {#what-infrastructure-providers-do-you-use}

> \[!IMPORTANT]
> Forward Email si avvale di più sub-responsabili infrastrutturali con certificazioni di conformità complete.

I dettagli completi sono disponibili sulla nostra pagina sulla conformità al GDPR: <https://forwardemail.net/gdpr>

**Sub-responsabili dell'infrastruttura primaria:**

| Fornitore | Certificato dal Data Privacy Framework | Pagina di conformità al GDPR |
| ---------------- | -------------------------------- | ----------------------------------------------- |
| **Cloudflare** | ✅ Sì | <https://www.cloudflare.com/trust-hub/gdpr/> |
| **Pacchetto dati** | ❌ No | <https://www.datapacket.com/privacy-policy> |
| **DigitalOcean** | ❌ No | <https://www.digitalocean.com/legal/gdpr> |
| **Vultr** | ❌ No | <https://www.vultr.com/legal/eea-gdpr-privacy/> |

**Certificazioni dettagliate:**

**DigitalOcean**

* SOC 2 Tipo II e SOC 3 Tipo II (verificati da Schellman & Company LLC)
* Certificazione ISO 27001 presso diversi data center
* Conformità PCI-DSS
* Certificazione CSA STAR Livello 1
* Certificazione APEC CBPR PRP
* Dettagli: <https://www.digitalocean.com/trust/certification-reports>

**Vultr**

* Certificazione SOC 2+ (HIPAA)
* Conforme allo standard PCI Merchant
* Certificazione CSA STAR Livello 1
* ISO/IEC 20000-1:2018, 27001:2022, 27017:2015, 27018:2019
* Dettagli: <https://www.vultr.com/legal/compliance/>

**Pacchetto dati**

* Conforme a SOC 2 (contattare direttamente DataPacket per ottenere la certificazione)
* Infrastruttura di livello enterprise (sede di Denver)
* Protezione DDoS tramite lo stack di sicurezza informatica Shield
* Assistenza tecnica 24 ore su 24, 7 giorni su 7
* Rete globale su 58 data center
* Dettagli: <https://www.datapacket.com/datacenters/denver>

**Elaboratori di pagamento:**

* **Stripe**: Certificato DPF - <https://stripe.com/legal/privacy-center>
* **PayPal**: Non certificato DPF - <https://www.paypal.com/uk/legalhub/privacy-full>

### Offrite un Contratto di elaborazione dei dati (DPA) {#do-you-offer-a-data-processing-agreement-dpa}

Sì, Forward Email offre un Accordo sul Trattamento dei Dati (DPA) completo che può essere sottoscritto con il nostro contratto aziendale. Una copia del nostro DPA è disponibile all'indirizzo: <https://forwardemail.net/dpa>

**Dettagli DPA:**

* Copre la conformità al GDPR e ai framework Privacy Shield UE-USA/Svizzera-USA
* Accettato automaticamente accettando i nostri Termini di servizio
* Non è richiesta alcuna firma separata per il DPA standard
* Accordi DPA personalizzati disponibili tramite licenza Enterprise

**Quadro di conformità al GDPR:**
Il nostro DPA illustra nel dettaglio la conformità al GDPR e i requisiti per il trasferimento internazionale dei dati. Informazioni complete sono disponibili all'indirizzo: <https://forwardemail.net/gdpr>

Per i clienti aziendali che necessitano di termini DPA personalizzati o accordi contrattuali specifici, è possibile farlo tramite il nostro programma **Licenza Enterprise ($ 250/mese)**.

### Come gestisci le notifiche di violazione dei dati {#how-do-you-handle-data-breach-notifications}

> \[!NOTE]
> L'architettura a conoscenza zero di Forward Email limita significativamente l'impatto delle violazioni.

* **Esposizione limitata dei dati**: Impossibile accedere al contenuto delle email crittografate a causa dell'architettura a conoscenza zero
* **Raccolta dati minima**: Solo informazioni di base sull'abbonato e registri IP limitati per la sicurezza
* **Quadro dei sub-responsabili**: DigitalOcean e Vultr mantengono procedure di risposta agli incidenti conformi al GDPR

**Informazioni sul rappresentante GDPR:**
Forward Email ha nominato rappresentanti GDPR in conformità all'articolo 27:

**Rappresentante UE:**
Osano International Compliance Services Limited
ATTENZIONE: LFHC
3 Dublin Landings, North Wall Quay
Dublino 1, D01C4E0

**Rappresentante per il Regno Unito:**
Osano UK Compliance LTD
ATTENZIONE: LFHC
42-46 Fountain Street, Belfast
Antrim, BT1 - 5EF

Per i clienti aziendali che necessitano di specifici SLA per la notifica delle violazioni, questi devono essere discussi come parte di un contratto di **licenza aziendale**.

Fonti:

* <https://forwardemail.net/technical-whitepaper.pdf#page=59>
* <https://forwardemail.net/gdpr>

### Offrite un ambiente di test {#do-you-offer-a-test-environment}

La documentazione tecnica di Forward Email non descrive esplicitamente una modalità sandbox dedicata. Tuttavia, i possibili approcci di test includono:

* **Opzione di self-hosting**: Funzionalità complete di self-hosting per la creazione di ambienti di test
* **Interfaccia API**: Possibilità di test programmatici delle configurazioni
* **Open Source**: Il codice open source al 100% consente ai clienti di esaminare la logica di inoltro
* **Più domini**: Il supporto per più domini potrebbe consentire la creazione di domini di test

Per i clienti aziendali che necessitano di funzionalità sandbox formali, questo aspetto dovrebbe essere discusso come parte di un accordo di **licenza aziendale**.

Origine: <https://github.com/forwardemail/forwardemail.net> (Dettagli sull'ambiente di sviluppo)

### Fornite strumenti di monitoraggio e avviso {#do-you-provide-monitoring-and-alerting-tools}

Forward Email fornisce il monitoraggio in tempo reale con alcune limitazioni:

**Disponibile:**

* **Monitoraggio delle consegne in tempo reale**: metriche di performance visibili al pubblico per i principali provider di posta elettronica
* **Avvisi automatici**: il team di ingegneri viene avvisato quando i tempi di consegna superano i 10 secondi
* **Monitoraggio trasparente**: sistemi di monitoraggio open source al 100%
* **Monitoraggio dell'infrastruttura**: rilevamento automatico delle anomalie e registrazione completa degli audit

**Limitazioni:**

* I webhook rivolti al cliente o le notifiche sullo stato di consegna basate su API non sono documentati in modo esplicito

Per i clienti aziendali che necessitano di webhook dettagliati sullo stato di consegna o integrazioni di monitoraggio personalizzate, queste funzionalità potrebbero essere disponibili tramite accordi di **licenza aziendale**.

Fonti:

* <https://forwardemail.net> (Visualizzazione del monitoraggio in tempo reale)
* <https://github.com/forwardemail/forwardemail.net> (Implementazione del monitoraggio)

### Come si garantisce un'elevata disponibilità {#how-do-you-ensure-high-availability}

> \[!IMPORTANT]
> Forward Email implementa una ridondanza completa tra più provider di infrastrutture.

* **Infrastruttura distribuita**: più provider (DigitalOcean, Vultr, DataPacket) in diverse aree geografiche
* **Bilanciamento del carico geografico**: bilanciamento del carico geolocalizzato basato su Cloudflare con failover automatico
* **Scalabilità automatica**: adeguamento dinamico delle risorse in base alla domanda
* **Protezione DDoS multilivello**: tramite il sistema Shield di DataPacket e Cloudflare
* **Ridondanza del server**: più server per area con failover automatico
* **Replica del database**: sincronizzazione dei dati in tempo reale su più sedi
* **Monitoraggio e avvisi**: monitoraggio 24 ore su 24, 7 giorni su 7 con risposta automatica agli incidenti

**Impegno di uptime**: disponibilità del servizio superiore al 99,9% con monitoraggio trasparente disponibile su <https://forwardemail.net>

Fonti:

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver>

### Sei conforme alla Sezione 889 del National Defense Authorization Act (NDAA) {#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa}

> \[!IMPORTANT]
> Forward Email è pienamente conforme alla Sezione 889 grazie all'attenta selezione dei partner infrastrutturali.

Sì, Forward Email è **conforme alla Sezione 889**. La Sezione 889 del National Defense Authorization Act (NDAA) vieta alle agenzie governative di utilizzare o stipulare contratti con entità che utilizzano apparecchiature di telecomunicazione e videosorveglianza di aziende specifiche (Huawei, ZTE, Hikvision, Dahua e Hytera).

**Come Forward Email raggiunge la conformità alla Sezione 889:**

Forward Email si affida esclusivamente a due fornitori di infrastrutture chiave, nessuno dei quali utilizza apparecchiature vietate dalla Sezione 889:

1. **Cloudflare**: Il nostro partner principale per i servizi di rete e la sicurezza della posta elettronica
2. **DataPacket**: Il nostro fornitore principale per l'infrastruttura server (che utilizza esclusivamente apparecchiature Arista Networks e Cisco)
3. **Fornitori di backup**: I nostri fornitori di backup, Digital Ocean e Vultr, sono inoltre certificati per iscritto come conformi alla Sezione 889.

**Impegno di Cloudflare**: Cloudflare dichiara esplicitamente nel suo Codice di condotta di terze parti che non utilizza apparecchiature di telecomunicazione, prodotti di videosorveglianza o servizi di entità proibite dalla Sezione 889.

**Caso d'uso governativo**: La nostra conformità alla Sezione 889 è stata convalidata quando l'**Accademia navale statunitense** ha selezionato Forward Email per le proprie esigenze di inoltro sicuro delle e-mail, richiedendo la documentazione dei nostri standard di conformità federali.

Per informazioni complete sul nostro quadro di conformità governativa, comprese le normative federali più ampie, leggi il nostro studio di caso completo: [Servizio di posta elettronica del governo federale conforme alla sezione 889](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)

## Dettagli tecnici e di sistema {#system-and-technical-details}

### Memorizzi le email e il loro contenuto {#do-you-store-emails-and-their-contents}

No, non scriviamo su disco né memorizziamo registri: con [eccezione di errori](#do-you-store-error-logs) e [SMTP in uscita](#do-you-support-sending-email-with-smtp) (vedi [politica sulla riservatezza](/privacy)).

Tutto viene eseguito in memoria e [il nostro codice sorgente è su GitHub](https://github.com/forwardemail).

### Come funziona il tuo sistema di inoltro e-mail {#how-does-your-email-forwarding-system-work}

La posta elettronica si basa sul protocollo [Protocollo SMTP](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol). Questo protocollo consiste nell'inviare comandi a un server (che solitamente opera sulla porta 25). Inizialmente viene stabilita una connessione, poi il mittente indica il mittente ("MAIL FROM"), seguito dalla destinazione ("RCPT TO") e infine le intestazioni e il corpo dell'email stessa ("DATA"). Il flusso del nostro sistema di inoltro email è descritto di seguito, in relazione a ciascun comando del protocollo SMTP:

* Connessione iniziale (nessun nome di comando, ad esempio `telnet example.com 25`) - Questa è la connessione iniziale. Verifichiamo i mittenti che non sono presenti in [lista consentita](#do-you-have-an-allowlist) confrontandoli con [lista di rifiuto](#do-you-have-a-denylist). Infine, se un mittente non è presente nella nostra lista consentita, controlliamo se è stato inserito in [inserito nella lista grigia](#do-you-have-a-greylist).

* `HELO` - Indica un saluto per identificare il nome di dominio completo (FQDN), l'indirizzo IP o il nome del gestore di posta del mittente. Questo valore può essere falsificato, quindi non ci basiamo su questi dati e utilizziamo invece la ricerca inversa del nome host dell'indirizzo IP della connessione.

* `MAIL FROM` - Indica l'indirizzo del mittente dell'email. Se si inserisce un valore, deve essere un indirizzo email RFC 5322 valido. Sono consentiti valori vuoti. In questo caso, utilizziamo [controllare la retrodiffusione](#how-do-you-protect-against-backscatter) e controlliamo anche il campo MAIL FROM rispetto al nostro [lista di rifiuto](#do-you-have-a-denylist). Infine, controlliamo i mittenti non presenti nella lista consentita per la limitazione della velocità (vedere la sezione su [Limitazione della velocità](#do-you-have-rate-limiting) e [lista consentita](#do-you-have-an-allowlist) per ulteriori informazioni).

* `RCPT TO` - Indica il/i destinatario/i dell'email. Devono essere indirizzi email validi conformi alla norma RFC 5322. Sono consentiti fino a 50 destinatari per messaggio (questo è diverso dall'intestazione "A" di un'email). Verifichiamo anche la presenza di un indirizzo [Schema di riscrittura del mittente](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme) ("SRS") valido per proteggere il nostro nome di dominio SRS da tentativi di spoofing.

* `DATA` - Questa è la parte principale del nostro servizio che elabora un'email. Per ulteriori informazioni, consultare la sezione [Come si elabora un'e-mail per l'inoltro?](#how-do-you-process-an-email-for-forwarding) qui sotto.

### Come si elabora un'e-mail per l'inoltro {#how-do-you-process-an-email-for-forwarding}

Questa sezione descrive il nostro processo relativo al comando del protocollo SMTP `DATA` nella sezione [Come funziona il tuo sistema di inoltro e-mail](#how-does-your-email-forwarding-system-work) sopra: spiega come elaboriamo le intestazioni, il corpo e la sicurezza di un'e-mail, come determiniamo dove deve essere recapitata e come gestiamo le connessioni.

1. Se il messaggio supera la dimensione massima di 50 MB, viene rifiutato con il codice di errore 552.

2. Se il messaggio non contiene un'intestazione "Da" o se uno qualsiasi dei valori nell'intestazione "Da" non è un indirizzo email RFC 5322 valido, il messaggio viene rifiutato con un codice di errore 550.

3. Se il messaggio contiene più di 25 intestazioni "Received", allora è stato ritenuto bloccato in un ciclo di reindirizzamento e viene rifiutato con un codice di errore 550.

4. Utilizzando l'impronta digitale dell'e-mail (vedere la sezione su [impronte digitali](#how-do-you-determine-an-email-fingerprint)), verificheremo se si è tentato di inviare nuovamente il messaggio per più di 5 giorni (il che corrisponde a [comportamento postfisso predefinito](http://www.postfix.org/postconf.5.html#maximal_queue_lifetime)) e, in tal caso, verrà rifiutato con un codice di errore 550.

5. Memorizziamo nella memoria i risultati della scansione dell'e-mail utilizzando [Scanner antispam](https://spamscanner.net).

6. Se Spam Scanner ha fornito risultati arbitrari, questi vengono rifiutati con il codice di errore 554. I risultati arbitrari includono solo il test GTUBE al momento della stesura di questo documento. Per ulteriori informazioni, consultare <https://spamassassin.apache.org/gtube/>.

7. Aggiungeremo le seguenti intestazioni al messaggio per scopi di debug e prevenzione degli abusi:

* `Received` - aggiungiamo questa intestazione standard "Received" con IP e host di origine, tipo di trasmissione, informazioni sulla connessione TLS, data/ora e destinatario.
* `X-Original-To` - il destinatario originale del messaggio:
* Questo è utile per determinare dove è stata originariamente recapitata un'email (oltre all'intestazione "Received").
* Questo viene aggiunto per destinatario al momento dell'inoltro IMAP e/o mascherato (al fine di proteggere la privacy).
* `X-Forward-Email-Website` - contiene un link al nostro sito web di <https://forwardemail.net>
* `X-Forward-Email-Version` - la versione corrente di [SemVer](https://semver.org/) da `package.json` del nostro codice sorgente.
* `X-Forward-Email-Session-ID` - un valore ID sessione utilizzato per scopi di debug (applicabile solo in ambienti non di produzione). * `X-Forward-Email-Sender` - un elenco separato da virgole contenente l'indirizzo MAIL FROM originale della busta (se non era vuoto), l'FQDN del client PTR inverso (se esiste) e l'indirizzo IP del mittente.
* `X-Forward-Email-ID` - applicabile solo per SMTP in uscita e correlato all'ID email memorizzato in Il mio account → Email.
* `X-Original-To`0 - con valore `X-Original-To`1.
* `X-Original-To`2 - con valore `X-Original-To`3.
* `X-Original-To`4 - con valore `X-Original-To`5.

8. Quindi controlliamo il messaggio per [DKIM](https://en.wikipedia.org/wiki/DomainKeys_Identified_Mail), [SPF](https://en.wikipedia.org/wiki/Sender_Policy_Framework), [ARC](https://en.wikipedia.org/wiki/Authenticated_Received_Chain) e [DMARC](https://en.wikipedia.org/wiki/DMARC).

* Se il messaggio non ha superato il test DMARC e il dominio aveva una policy di rifiuto (ad esempio, `p=reject` [era nella politica DMARC](https://wikipedia.org/wiki/DMARC)), viene rifiutato con un codice di errore 550. In genere, una policy DMARC per un dominio si trova nel record <strong class="notranslate">TXT</strong> del sottodominio `_dmarc` (ad esempio, `dig _dmarc.example.com txt`).
* Se il messaggio non ha superato il test SPF e il dominio aveva una policy di hard fail (ad esempio, `-all` era nella policy SPF anziché `~all` o nessuna policy), viene rifiutato con un codice di errore 550. In genere, una policy SPF per un dominio si trova nel record <strong class="notranslate">TXT</strong> del dominio radice (ad esempio, `dig example.com txt`). Consulta questa sezione per ulteriori informazioni su [invio di posta come con Gmail](#can-i-send-mail-as-in-gmail-with-this) in merito a SPF.

9. Ora elaboriamo i destinatari del messaggio come raccolti dal comando `RCPT TO` nella sezione [Come funziona il tuo sistema di inoltro e-mail](#how-does-your-email-forwarding-system-work) sopra. Per ciascun destinatario, eseguiamo le seguenti operazioni:

* Cerchiamo i record <strong class="notranslate">TXT</strong> del nome di dominio (la parte dopo il simbolo `@`, ad esempio `example.com` se l'indirizzo email era `test@example.com`). Ad esempio, se il dominio è `example.com`, eseguiamo una ricerca DNS come `dig example.com txt`.
* Analizziamo tutti i record <strong class="notranslate">TXT</strong> che iniziano con `forward-email=` (piani gratuiti) o `forward-email-site-verification=` (piani a pagamento). Si noti che analizziamo entrambi per elaborare le email mentre un utente effettua un upgrade o un downgrade del piano.
* Da questi record <strong class="notranslate">TXT</strong> analizzati, li iteriamo per estrarre la configurazione di inoltro (come descritto nella sezione [Come posso iniziare e configurare l'inoltro delle email?](#how-do-i-get-started-and-set-up-email-forwarding) sopra). Si noti che supportiamo un solo valore `forward-email-site-verification=` e, se ne viene fornito più di uno, si verificherà un errore 550 e il mittente riceverà un bounce per questo destinatario.
* Ripetiamo ricorsivamente la configurazione di inoltro estratta per determinare l'inoltro globale, l'inoltro basato su espressioni regolari e tutte le altre configurazioni di inoltro supportate, che ora sono note come "Indirizzi di inoltro".
* Per ogni Indirizzo di inoltro, supportiamo una ricerca ricorsiva (che avvierà questa serie di operazioni sull'indirizzo specificato). Se viene trovata una corrispondenza ricorsiva, il risultato padre verrà rimosso dagli Indirizzi di inoltro e i figli verranno aggiunti.
* Gli Indirizzi di inoltro vengono analizzati per verificarne l'univocità (poiché non vogliamo inviare duplicati a un indirizzo o generare connessioni client SMTP non necessarie). * Per ogni indirizzo di inoltro, cerchiamo il suo nome di dominio sul nostro endpoint API `/v1/max-forwarded-addresses` (per determinare a quanti indirizzi il dominio può inoltrare email per alias, ad esempio 10 per impostazione predefinita – vedere la sezione su `example.com`0). Se questo limite viene superato, si verificherà un errore 550 e il mittente riceverà un bounce per questo destinatario.
* Cerchiamo le impostazioni del destinatario originale sul nostro endpoint API `example.com`1, che supporta una ricerca per gli utenti a pagamento (con un fallback per gli utenti gratuiti). Questo restituisce un oggetto di configurazione per le impostazioni avanzate per `example.com`2 (Numero, ad esempio `example.com`3), `example.com`4 (Booleano), `example.com`5 (Booleano), `example.com`6 (Booleano) e `example.com`7 (Booleano). * In base a queste impostazioni, controlliamo i risultati dello Spam Scanner e, in caso di errori, il messaggio viene rifiutato con il codice di errore 554 (ad esempio, se `example.com`8 è abilitato, controlleremo i risultati dello Spam Scanner per individuare eventuali virus). Si noti che tutti gli utenti del piano gratuito saranno inclusi nei controlli per contenuti per adulti, phishing, file eseguibili e virus. Per impostazione predefinita, anche tutti gli utenti del piano a pagamento sono inclusi, ma questa configurazione può essere modificata nella pagina Impostazioni di un dominio nella dashboard di Inoltra email.

10. Per ogni indirizzo di inoltro del destinatario elaborato, eseguiamo quindi le seguenti operazioni:

* L'indirizzo viene confrontato con il nostro [lista di rifiuto](#do-you-have-a-denylist) e, se presente nell'elenco, verrà visualizzato un codice di errore 421 (che indica al mittente di riprovare più tardi).
* Se l'indirizzo è un webhook, impostiamo un valore booleano per le operazioni future (vedi sotto: raggruppiamo webhook simili per creare una richiesta POST anziché più richieste per la consegna).
* Se l'indirizzo è un indirizzo email, analizziamo l'host per le operazioni future (vedi sotto: raggruppiamo host simili per creare una connessione anziché più connessioni individuali per la consegna).

11. Se non ci sono destinatari e non ci sono messaggi di posta respinti, rispondiamo con un errore 550 "Destinatari non validi".

12. Se ci sono destinatari, li iteriamo (raggruppandoli in base allo stesso host) e inviamo le email. Per ulteriori informazioni, consultare la sezione [Come gestisci i problemi di recapito delle email?](#how-do-you-handle-email-delivery-issues) di seguito.

* Se si verificano errori durante l'invio delle email, li memorizzeremo in memoria per un'elaborazione successiva.
* Prenderemo il codice di errore più basso (se presente) dall'invio delle email e lo utilizzeremo come codice di risposta al comando `DATA`. Ciò significa che le email non recapitate verranno in genere ritentate dal mittente originale, mentre le email già recapitate non verranno reinviate al successivo invio (poiché utilizziamo [impronte digitali](#how-do-you-determine-an-email-fingerprint)).
* Se non si sono verificati errori, invieremo un codice di stato SMTP di risposta 250.
* Un bounce è considerato qualsiasi tentativo di recapito che risulti in un codice di stato >= 500 (errori permanenti).

13. Se non si sono verificati rimbalzi (errori permanenti), restituiremo un codice di stato di risposta SMTP con il codice di errore più basso tra i guasti non permanenti (o un codice di stato di successo 250 se non ce ne sono stati).

14. Se si sono verificati dei bounce, invieremo email di bounce in background dopo aver restituito al mittente il codice di errore più basso tra tutti. Tuttavia, se il codice di errore più basso è >= 500, non invieremo alcuna email di bounce. Questo perché, se lo facessimo, i mittenti riceverebbero una doppia email di bounce (ad esempio, una dal loro MTA in uscita, come Gmail, e una da noi). Consulta la sezione relativa a [Come proteggersi dalla retrodiffusione](#how-do-you-protect-against-backscatter) qui sotto per ulteriori informazioni.

### Come gestisci i problemi di recapito delle email {#how-do-you-handle-email-delivery-issues}

Si noti che apporteremo una riscrittura "Friendly-From" alle email solo se la policy DMARC del mittente non è stata superata E nessuna firma DKIM è stata allineata con l'intestazione "From". Ciò significa che modificheremo l'intestazione "From" del messaggio, imposteremo "X-Original-From" e imposteremo anche un "Reply-To" se non fosse già impostato. Inoltre, applicheremo nuovamente il sigillo ARC al messaggio dopo aver modificato queste intestazioni.

Utilizziamo inoltre l'analisi intelligente dei messaggi di errore a ogni livello del nostro stack: nel nostro codice, nelle richieste DNS, negli interni di Node.js, nelle richieste HTTP (ad esempio 408, 413 e 429 vengono mappati sul codice di risposta SMTP 421 se il destinatario è un webhook) e nelle risposte del server di posta (ad esempio, le risposte con "defer" o "slowdown" verrebbero ritentate come errori 421).

La nostra logica è a prova di errore e riproverà anche in caso di errori SSL/TLS, problemi di connessione e altro ancora. L'obiettivo della logica a prova di errore è massimizzare la recapitabilità a tutti i destinatari per una configurazione di inoltro.

Se il destinatario è un webhook, consentiremo un timeout di 60 secondi per il completamento della richiesta, con un massimo di 3 tentativi (quindi 4 richieste in totale prima di un errore). Si noti che analizziamo correttamente i codici di errore 408, 413 e 429 e li associamo al codice di risposta SMTP 421.

In caso contrario, se il destinatario è un indirizzo email, proveremo a inviare l'email con TLS opportunistico (proviamo a utilizzare STARTTLS se disponibile sul server di posta del destinatario). Se si verifica un errore SSL/TLS durante l'invio dell'email, proveremo a inviarla senza TLS (senza utilizzare STARTTLS).

Se si verificano errori DNS o di connessione, restituiremo al comando `DATA` un codice di risposta SMTP pari a 421, altrimenti se ci sono errori di livello >= 500, verranno inviati dei bounce.

Se rileviamo che un server di posta elettronica a cui stiamo tentando di inviare un messaggio ha uno o più indirizzi IP di scambio di posta bloccati (ad esempio, da qualsiasi tecnologia utilizzata per contrastare gli spammer), invieremo un codice di risposta SMTP 421 affinché il mittente riprovi a inviare il messaggio in un secondo momento (e noi veniamo avvisati del problema, sperando di poterlo risolvere prima del tentativo successivo).

### Come gestisci il blocco dei tuoi indirizzi IP? {#how-do-you-handle-your-ip-addresses-becoming-blocked}

Monitoriamo regolarmente tutte le principali denylist DNS e, se uno qualsiasi dei nostri indirizzi IP di scambio di posta ("MX") è elencato in una denylist importante, se possibile lo estrarremo dal round robin del record DNS A pertinente finché il problema non sarà risolto.

Al momento della stesura di questo articolo, siamo presenti anche in diverse liste consentite DNS e prendiamo sul serio il monitoraggio delle liste negate. Se riscontri problemi prima che abbiamo la possibilità di risolverli, ti preghiamo di segnalarcelo per iscritto all'indirizzo <support@forwardemail.net>.

I nostri indirizzi IP sono disponibili al pubblico, [vedere la sezione sottostante per maggiori approfondimenti](#what-are-your-servers-ip-addresses).

### Cosa sono gli indirizzi dei direttori postali {#what-are-postmaster-addresses}

Per impedire che i messaggi di posta elettronica vengano respinti erroneamente e che vengano inviati messaggi di risposta automatica a caselle di posta non monitorate o inesistenti, gestiamo un elenco di nomi utente simili a mailer-daemon:

* `automailer`
* `autoresponder`
* `bounce`
* `bounce-notification`
* `bounce-notifications`
* `bounces`
* `hostmaster`
* `listserv`
* `localhost`
* `mail-daemon`
* `mail.daemon`
* `maildaemon`
* `mailer-daemon`
* `mailer.daemon`
* `mailerdaemon`
* `majordomo`
* `postmaster`
* [e qualsiasi indirizzo senza risposta](#what-are-no-reply-addresses)

Per maggiori informazioni su come elenchi come questi vengono utilizzati per creare sistemi di posta elettronica efficienti, vedere [RFC 5320 Sezione 4.6](https://datatracker.ietf.org/doc/html/rfc5230#section-4.6).

### Cosa sono gli indirizzi "no-reply" {#what-are-no-reply-addresses}

I nomi utente e-mail che corrispondono a uno qualsiasi dei seguenti (senza distinzione tra maiuscole e minuscole) sono considerati indirizzi "no-answer":

* `do-not-reply`
* `do-not-respond`
* `do.not.reply`
* `donotreply`
* `donotrespond`
* `dont-reply`
* `naoresponda`
* `no-replies`
* `no-reply`
* `no-replys`
* `no.replies`
* `no.reply`
* `no.replys`
* `no_reply`
* `nobody`
* `noreplies`
* `noreply`
* `noreplys`

Questo elenco è gestito [come progetto open source su GitHub](https://github.com/forwardemail/reserved-email-addresses-list).

### Quali sono gli indirizzi IP del tuo server? {#what-are-your-servers-ip-addresses}

Pubblichiamo i nostri indirizzi IP su <https://forwardemail.net/ips>.

### Hai una lista consentita {#do-you-have-an-allowlist}

Sì, abbiamo un [elenco delle estensioni di nomi di dominio](#what-domain-name-extensions-are-allowlisted-by-default) che è inserito nella lista consentita per impostazione predefinita e un elenco consentito dinamico, memorizzato nella cache e mobile basato su [criteri rigorosi](#what-is-your-allowlist-criteria).

Tutti gli indirizzi email, i domini e i destinatari dei clienti con piani a pagamento vengono automaticamente aggiunti alla nostra lista consentita.

### Quali estensioni di nomi di dominio sono consentite per impostazione predefinita {#what-domain-name-extensions-are-allowlisted-by-default}

Le seguenti estensioni di nomi di dominio sono considerate consentite per impostazione predefinita (indipendentemente dal fatto che siano presenti o meno nella Umbrella Popularity List):

<ul class="list-inline">
<li class="list-inline-item"><code class="notranslate">edu</code></li>
<li class="list-inline-item"><code class="notranslate">gov</code></li>
<li class="list-inline-item"><code class="notranslate">mil</code></li>
<li class="list-inline-item"><code class="notranslate">int</code></li>
<li class="list-inline-item"><code class="notranslate">arpa</code></li>
<li class="list-inline-item"><code class="notranslate">dni.us</code></li>
<li class="list-inline-item"><code class="notranslate">fed.us</code></li>
<li class="list-inline-item"><code class="notranslate">isa.us</code></li>
<li class="list-inline-item"><code class="notranslate">kids.us</code></li>
<li class="list-inline-item"><code class="notranslate">nsn.us</code></li>
<li class="list-inline-item"><code class="notranslate">ak.us</code></li>
<li class="list-inline-item"><code class="notranslate">al.us</code></li>
<li class="list-inline-item"><code class="notranslate">ar.us</code></li>
<li class="list-inline-item"><code class="notranslate">as.us</code></li>
<li class="list-inline-item"><code class="notranslate">az.us</code></li>
<li class="list-inline-item"><code class="notranslate">ca.us</code></li>
<li class="list-inline-item"><code class="notranslate">co.us</code></li>
<li class="list-inline-item"><code class="notranslate">ct.us</code></li>
<li class="list-inline-item"><code class="notranslate">dc.us</code></li>
<li class="list-inline-item"><code class="notranslate">de.us</code></li>
<li class="list-inline-item"><code class="notranslate">fl.us</code></li>
<li class="list-inline-item"><code class="notranslate">ga.us</code></li>
<li class="list-inline-item"><code class="notranslate">gu.us</code></li>
<li class="list-inline-item"><code class="notranslate">hi.us</code></li>
<li class="list-inline-item"><code class="notranslate">ia.us</code></li>
<li class="list-inline-item"><code class="notranslate">id.us</code></li>
<li class="list-inline-item"><code class="notranslate">il.us</code></li>
<li class="list-inline-item"><code class="notranslate">in.us</code></li>
<li class="list-inline-item"><code class="notranslate">ks.us</code></li>
<li class="list-inline-item"><code class="notranslate">ky.us</code></li>
<li class="list-inline-item"><code class="notranslate">la.us</code></li>
<li class="list-inline-item"><code class="notranslate">ma.us</code></li>
<li class="list-inline-item"><code class="notranslate">md.us</code></li>
<li class="list-inline-item"><code class="notranslate">me.us</code></li>
<li class="list-inline-item"><code class="notranslate">mi.us</code></li>
<li class="list-inline-item"><code class="notranslate">mn.us</code></li>
<li class="list-inline-item"><code class="notranslate">mo.us</code></li>
<li class="list-inline-item"><code class="notranslate">ms.us</code></li>
<li class="list-inline-item"><code class="notranslate">mt.us</code></li>
<li class="list-inline-item"><code class="notranslate">nc.us</code></li>
<li class="list-inline-item"><code class="notranslate">nd.us</code></li>
<li class="list-inline-item"><code class="notranslate">ne.us</code></li>
<li class="list-inline-item"><code class="notranslate">nh.us</code></li>
<li class="list-inline-item"><code class="notranslate">nj.us</code></li>
<li class="list-inline-item"><code class="notranslate">nm.us</code></li>
<li class="list-inline-item"><code class="notranslate">nv.us</code></li>
<li class="list-inline-item"><code class="notranslate">ny.us</code></li>
<li class="list-inline-item"><code class="notranslate">oh.us</code></li>
<li class="list-inline-item"><code class="notranslate">ok.us</code></li>
<li class="list-inline-item"><code class="notranslate">or.us</code></li>
<li class="list-inline-item"><code class="notranslate">pa.us</code></li>
<li class="list-inline-item"><code class="notranslate">pr.us</code></li>
<li class="list-inline-item"><code class="notranslate">ri.us</code></li>
<li class="list-inline-item"><code class="notranslate">sc.us</code></li>
<li class="list-inline-item"><code class="notranslate">sd.us</code></li>
<li class="list-inline-item"><code class="notranslate">tn.us</code></li>
<li class="list-inline-item"><code class="notranslate">tx.us</code></li>
<li class="list-inline-item"><code class="notranslate">ut.us</code></li>
<li class="list-inline-item"><code class="notranslate">va.us</code></li>
<li class="list-inline-item"><code class="notranslate">vi.us</code></li>
<li class="list-inline-item"><code class="notranslate">vt.us</code></li>
<li class="list-inline-item"><code class="notranslate">wa.us</code></li>
<li class="list-inline-item"><code class="notranslate">wi.us</code></li>
<li class="list-inline-item"><code class="notranslate">wv.us</code></li>
<li class="list-inline-item"><code class="notranslate">wy.us</code></li>
<li class="list-inline-item"><code class="notranslate">mil.tt</code></li>
<li class="list-inline-item"><code class="notranslate">edu.tt</code></li>
<li class="list-inline-item"><code class="notranslate">edu.tr</code></li>
<li class="list-inline-item"><code class="notranslate">edu.ua</code></li>
<li class="list-inline-item"><code class="notranslate">edu.au</code></li>
<li class="list-inline-item"><code class="notranslate">ac.at</code></li>
<li class="list-inline-item"><code class="notranslate">edu.br</code></li>
<li class="list-inline-item"><code class="notranslate">ac.nz</code></li>
<li class="list-inline-item"><code class="notranslate">school.nz</code></li>
<li class="list-inline-item"><code class="notranslate">cri.nz</code></li>
<li class="list-inline-item"><code class="notranslate">health.nz</code></li>
<li class="list-inline-item"><code class="notranslate">mil.nz</code></li>
<li class="list-inline-item"><code class="notranslate">parliament.nz</code></li>
<li class="list-inline-item"><code class="notranslate">ac.in</code></li>
<li class="list-inline-item"><code class="notranslate">edu.in</code></li>
<li class="list-inline-item"><code class="notranslate">mil.in</code></li>
<li class="list-inline-item"><code class="notranslate">ac.jp</code></li>
<li class="list-inline-item"><code class="notranslate">ed.jp</code></li>
<li class="list-inline-item"><code class="notranslate">lg.jp</code></li>
<li class="list-inline-item"><code class="notranslate">ac.za</code></li>
<li class="list-inline-item"><code class="notranslate">edu.za</code></li>
<li class="list-inline-item"><code class="notranslate">mil.za</code></li>
<li class="list-inline-item"><code class="notranslate">school.za</code></li>
<li class="list-inline-item"><code class="notranslate">mil.kr</code></li>
<li class="list-inline-item"><code class="notranslate">ac.kr</code></li>
<li class="list-inline-item"><code class="notranslate">hs.kr</code></li>
<li class="list-inline-item"><code class="notranslate">ms.kr</code></li>
<li class="list-inline-item"><code class="notranslate">es.kr</code></li>
<li class="list-inline-item"><code class="notranslate">sc.kr</code></li>
<li class="list-inline-item"><code class="notranslate">kg.kr</code></li>
<li class="list-inline-item"><code class="notranslate">edu.es</code></li>
<li class="list-inline-item"><code class="notranslate">ac.lk</code></li>
<li class="list-inline-item"><code class="notranslate">sch.lk</code></li>
<li class="list-inline-item"><code class="notranslate">edu.lk</code></li>
<li class="list-inline-item"><code class="notranslate">ac.th</code></li>
<li class="list-inline-item"><code class="notranslate">mi.th</code></li>
<li class="list-inline-item"><code class="notranslate">admin.ch</code></li>
<li class="list-inline-item"><code class="notranslate">canada.ca</code></li>
<li class="list-inline-item"><code class="notranslate">gc.ca</code></li>
<li class="list-inline-item"><code class="notranslate">go.id</code></li>
<li class="list-inline-item"><code class="notranslate">go.jp</code></li>
<li class="list-inline-item"><code class="notranslate">go.ke</code></li>
<li class="list-inline-item"><code class="notranslate">go.kr</code></li>
<li class="list-inline-item"><code class="notranslate">go.th</code></li>
<li class="list-inline-item"><code class="notranslate">gob.ar</code></li>
<li class="list-inline-item"><code class="notranslate">gob.cl</code></li>
<li class="list-inline-item"><code class="notranslate">gob.es</code></li>
<li class="list-inline-item"><code class="notranslate">gob.mx</code></li>
<!--<li class="list-inline-item"><code class="notranslate">gob.pe</code></li>-->
<li class="list-inline-item"><code class="notranslate">gob.ve</code></li>
<li class="list-inline-item"><code class="notranslate">gob.sv</code></li>
<li class="list-inline-item"><code class="notranslate">gouv.fr</code></li>
<li class="list-inline-item"><code class="notranslate">gouv.nc</code></li>
<li class="list-inline-item"><code class="notranslate">gouv.qc.ca</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ad</code></li>
<li class="list-inline-item"><code class="notranslate">gov.af</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ai</code></li>
<li class="list-inline-item"><code class="notranslate">gov.al</code></li>
<li class="list-inline-item"><code class="notranslate">gov.am</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ao</code></li>
<li class="list-inline-item"><code class="notranslate">gov.au</code></li>
<li class="list-inline-item"><code class="notranslate">gov.aw</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ax</code></li>
<li class="list-inline-item"><code class="notranslate">gov.az</code></li>
<li class="list-inline-item"><code class="notranslate">gov.bd</code></li>
<li class="list-inline-item"><code class="notranslate">gov.be</code></li>
<li class="list-inline-item"><code class="notranslate">gov.bg</code></li>
<li class="list-inline-item"><code class="notranslate">gov.bm</code></li>
<!--<li class="list-inline-item"><code class="notranslate">gov.br</code></li>-->
<li class="list-inline-item"><code class="notranslate">gov.by</code></li>
<li class="list-inline-item"><code class="notranslate">gov.cl</code></li>
<li class="list-inline-item"><code class="notranslate">gov.cn</code></li>
<li class="list-inline-item"><code class="notranslate">gov.co</code></li>
<li class="list-inline-item"><code class="notranslate">gov.cy</code></li>
<li class="list-inline-item"><code class="notranslate">gov.cz</code></li>
<li class="list-inline-item"><code class="notranslate">gov.dz</code></li>
<li class="list-inline-item"><code class="notranslate">gov.eg</code></li>
<li class="list-inline-item"><code class="notranslate">gov.fi</code></li>
<li class="list-inline-item"><code class="notranslate">gov.fk</code></li>
<li class="list-inline-item"><code class="notranslate">gov.gg</code></li>
<li class="list-inline-item"><code class="notranslate">gov.gr</code></li>
<li class="list-inline-item"><code class="notranslate">gov.hk</code></li>
<li class="list-inline-item"><code class="notranslate">gov.hr</code></li>
<li class="list-inline-item"><code class="notranslate">gov.hu</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ie</code></li>
<li class="list-inline-item"><code class="notranslate">gov.il</code></li>
<li class="list-inline-item"><code class="notranslate">gov.im</code></li>
<li class="list-inline-item"><code class="notranslate">gov.in</code></li>
<li class="list-inline-item"><code class="notranslate">gov.iq</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ir</code></li>
<li class="list-inline-item"><code class="notranslate">gov.it</code></li>
<li class="list-inline-item"><code class="notranslate">gov.je</code></li>
<li class="list-inline-item"><code class="notranslate">gov.kp</code></li>
<li class="list-inline-item"><code class="notranslate">gov.krd</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ky</code></li>
<li class="list-inline-item"><code class="notranslate">gov.kz</code></li>
<li class="list-inline-item"><code class="notranslate">gov.lb</code></li>
<li class="list-inline-item"><code class="notranslate">gov.lk</code></li>
<li class="list-inline-item"><code class="notranslate">gov.lt</code></li>
<li class="list-inline-item"><code class="notranslate">gov.lv</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ma</code></li>
<li class="list-inline-item"><code class="notranslate">gov.mm</code></li>
<li class="list-inline-item"><code class="notranslate">gov.mo</code></li>
<li class="list-inline-item"><code class="notranslate">gov.mt</code></li>
<li class="list-inline-item"><code class="notranslate">gov.my</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ng</code></li>
<li class="list-inline-item"><code class="notranslate">gov.np</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ph</code></li>
<li class="list-inline-item"><code class="notranslate">gov.pk</code></li>
<li class="list-inline-item"><code class="notranslate">gov.pl</code></li>
<li class="list-inline-item"><code class="notranslate">gov.pt</code></li>
<li class="list-inline-item"><code class="notranslate">gov.py</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ro</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ru</code></li>
<li class="list-inline-item"><code class="notranslate">gov.scot</code></li>
<li class="list-inline-item"><code class="notranslate">gov.se</code></li>
<li class="list-inline-item"><code class="notranslate">gov.sg</code></li>
<li class="list-inline-item"><code class="notranslate">gov.si</code></li>
<li class="list-inline-item"><code class="notranslate">gov.sk</code></li>
<li class="list-inline-item"><code class="notranslate">gov.tr</code></li>
<li class="list-inline-item"><code class="notranslate">gov.tt</code></li>
<li class="list-inline-item"><code class="notranslate">gov.tw</code></li>
<li class="list-inline-item"><code class="notranslate">gov.ua</code></li>
<li class="list-inline-item"><code class="notranslate">gov.uk</code></li>
<li class="list-inline-item"><code class="notranslate">gov.vn</code></li>
<li class="list-inline-item"><code class="notranslate">gov.wales</code></li>
<li class="list-inline-item"><code class="notranslate">gov.za</code></li>
<li class="list-inline-item"><code class="notranslate">government.pn</code></li>
<li class="list-inline-item"><code class="notranslate">govt.nz</code></li>
<!--<li class="list-inline-item"><code class="notranslate">gub.uy</code></li>-->
<li class="list-inline-item"><code class="notranslate">gv.at</code></li>
<li class="list-inline-item"><code class="notranslate">ac.uk</code></li>
<li class="list-inline-item"><code class="notranslate">bl.uk</code></li>
<li class="list-inline-item"><code class="notranslate">judiciary.uk</code></li>
<li class="list-inline-item"><code class="notranslate">mod.uk</code></li>
<li class="list-inline-item"><code class="notranslate">nhs.uk</code></li>
<li class="list-inline-item"><code class="notranslate">parliament.uk</code></li>
<li class="list-inline-item"><code class="notranslate">police.uk</code></li>
<li class="list-inline-item"><code class="notranslate">rct.uk</code></li>
<li class="list-inline-item"><code class="notranslate">royal.uk</code></li>
<li class="list-inline-item"><code class="notranslate">sch.uk</code></li>
<li class="list-inline-item"><code class="notranslate">ukaea.uk</code></li>
</ul>

Inoltre, per impostazione predefinita, i seguenti [domini di primo livello di marchi e aziende](https://en.wikipedia.org/wiki/List_of_Internet_top-level_domains#Brand_and_corporate_top-level_domains) sono consentiti (ad esempio `apple` per `applecard.apple` per gli estratti conto bancari della Apple Card):

<ul class="list-inline">
<li class="list-inline-item"><code class="notranslate">aaa</code></li>
<li class="list-inline-item"><code class="notranslate">aarp</code></li>
<li class="list-inline-item"><code class="notranslate">abarth</code></li>
<li class="list-inline-item"><code class="notranslate">abb</code></li>
<li class="list-inline-item"><code class="notranslate">abbott</code></li>
<li class="list-inline-item"><code class="notranslate">abbvie</code></li>
<li class="list-inline-item"><code class="notranslate">abc</code></li>
<li class="list-inline-item"><code class="notranslate">accenture</code></li>
<li class="list-inline-item"><code class="notranslate">aco</code></li>
<li class="list-inline-item"><code class="notranslate">aeg</code></li>
<li class="list-inline-item"><code class="notranslate">aetna</code></li>
<li class="list-inline-item"><code class="notranslate">afl</code></li>
<li class="list-inline-item"><code class="notranslate">agakhan</code></li>
<li class="list-inline-item"><code class="notranslate">aig</code></li>
<li class="list-inline-item"><code class="notranslate">aigo</code></li>
<li class="list-inline-item"><code class="notranslate">Airbus</code></li>
<li class="list-inline-item"><code class="notranslate">Airtel</code></li>
<li class="list-inline-item"><code class="notranslate">AKDN</code></li>
<li class="list-inline-item"><code class="notranslate">AlfaRomeo</code></li>
<li class="list-inline-item"><code class="notranslate">Alibaba</code></li>
<li class="list-inline-item"><code class="notranslate">Alipay</code></li>
<li class="list-inline-item"><code class="notranslate">AllFinanz</code></li>
<li class="list-inline-item"><code class="notranslate">AllState</code></li>
<li class="list-inline-item"><code class="notranslate">ally</code></li>
<li class="list-inline-item"><code class="notranslate">alstom</code></li>
<li class="list-inline-item"><code class="notranslate">amazon</code></li>
<li class="list-inline-item"><code class="notranslate">americanexpress</code></li>
<li class="list-inline-item"><code class="notranslate">amex</code></li>
<li class="list-inline-item"><code class="notranslate">amica</code></li>
<li class="list-inline-item"><code class="notranslate">android</code></li>
<li class="list-inline-item"><code class="notranslate">anz</code></li>
<li class="list-inline-item"><code class="notranslate">aol</code></li>
<li class="list-inline-item"><code class="notranslate">apple</code></li>
<li class="list-inline-item"><code class="notranslate">acquarello</code></li>
<li class="list-inline-item"><code class="notranslate">aramco</code></li>
<li class="list-inline-item"><code class="notranslate">audi</code></li>
<li class="list-inline-item"><code class="notranslate">auspost</code></li>
<li class="list-inline-item"><code class="notranslate">aws</code></li>
<li class="list-inline-item"><code class="notranslate">axa</code></li>
<li class="list-inline-item"><code class="notranslate">azzurro</code></li>
<li class="list-inline-item"><code class="notranslate">baidu</code></li>
<li class="list-inline-item"><code class="notranslate">bananarepublic</code></li>
<li class="list-inline-item"><code class="notranslate">barclaycard</code></li>
<li class="list-inline-item"><code class="notranslate">barclays</code></li>
<li class="list-inline-item"><code class="notranslate">basket</code></li>
<li class="list-inline-item"><code class="notranslate">bauhaus</code></li>
<li class="list-inline-item"><code class="notranslate">bbc</code></li>
<li class="list-inline-item"><code class="notranslate">bbt</code></li>
<li class="list-inline-item"><code class="notranslate">bbva</code></li>
<li class="list-inline-item"><code class="notranslate">bcg</code></li>
<li class="list-inline-item"><code class="notranslate">bentley</code></li>
<li class="list-inline-item"><code class="notranslate">bharti</code></li>
<li class="list-inline-item"><code class="notranslate">bing</code></li>
<li class="list-inline-item"><code class="notranslate">blanco</code></li>
<li class="list-inline-item"><code class="notranslate">bloomberg</code></li>
<li class="list-inline-item"><code class="notranslate">bms</code></li>
<li class="list-inline-item"><code class="notranslate">bmw</code></li>
<li class="list-inline-item"><code class="notranslate">bnl</code></li>
<li class="list-inline-item"><code class="notranslate">bnpparibas</code></li>
<li class="list-inline-item"><code class="notranslate">boehringer</code></li>
<li class="list-inline-item"><code class="notranslate">bond</code></li>
<li class="list-inline-item"><code class="notranslate">booking</code></li>
<li class="list-inline-item"><code class="notranslate">bosch</code></li>
<li class="list-inline-item"><code class="notranslate">bostik</code></li>
<li class="list-inline-item"><code class="notranslate">bradesco</code></li>
<li class="list-inline-item"><code class="notranslate">bridgestone</code></li>
<li class="list-inline-item"><code class="notranslate">brother</code></li>
<li class="list-inline-item"><code class="notranslate">bugatti</code></li>
<li class="list-inline-item"><code class="notranslate">cal</code></li>
<li class="list-inline-item"><code class="notranslate">calvinklein</code></li>
<li class="list-inline-item"><code class="notranslate">canon</code></li>
<li class="list-inline-item"><code class="notranslate">capitalone</code></li>
<li class="list-inline-item"><code class="notranslate">caravan</code></li>
<li class="list-inline-item"><code class="notranslate">cartier</code></li>
<li class="list-inline-item"><code class="notranslate">cba</code></li>
<li class="list-inline-item"><code class="notranslate">cbn</code></li>
<li class="list-inline-item"><code class="notranslate">cbre</code></li>
<li class="list-inline-item"><code class="notranslate">cbs</code></li>
<li class="list-inline-item"><code class="notranslate">cern</code></li>
<li class="list-inline-item"><code class="notranslate">cfa</code></li>
<li class="list-inline-item"><code class="notranslate">chanel</code></li>
<li class="list-inline-item"><code class="notranslate">chase</code></li>
<li class="list-inline-item"><code class="notranslate">chintai</code></li>
<li class="list-inline-item"><code class="notranslate">chrome</code></li>
<li class="list-inline-item"><code class="notranslate">chrysler</code></li>
<li class="list-inline-item"><code class="notranslate">cipriani</code></li>
<li class="list-inline-item"><code class="notranslate">cisco</code></li>
<li class="list-inline-item"><code class="notranslate">Citadel</code></li>
<li class="list-inline-item"><code class="notranslate">Citi</code></li>
<li class="list-inline-item"><code class="notranslate">Citic</code></li>
<li class="list-inline-item"><code class="notranslate">ClubMed</code></li>
<li class="list-inline-item"><code class="notranslate">Comcast</code></li>
<li class="list-inline-item"><code class="notranslate">Commbank</code></li>
<li class="list-inline-item"><code class="notranslate">Credit Union</code></li>
<li class="list-inline-item"><code class="notranslate">Crown</code></li>
<li class="list-inline-item"><code class="notranslate">crs</code></li>
<li class="list-inline-item"><code class="notranslate">csc</code></li>
<li class="list-inline-item"><code class="notranslate">cuisinella</code></li>
<li class="list-inline-item"><code class="notranslate">dabur</code></li>
<li class="list-inline-item"><code class="notranslate">datsun</code></li>
<li class="list-inline-item"><code class="notranslate">dealer</code></li>
<li class="list-inline-item"><code class="notranslate">dell</code></li>
<li class="list-inline-item"><code class="notranslate">deloitte</code></li>
<li class="list-inline-item"><code class="notranslate">delta</code></li>
<li class="list-inline-item"><code class="notranslate">dhl</code></li>
<li class="list-inline-item"><code class="notranslate">discover</code></li>
<li class="list-inline-item"><code class="notranslate">dish</code></li>
<li class="list-inline-item"><code class="notranslate">dnp</code></li>
<li class="list-inline-item"><code class="notranslate">dodge</code></li>
<li class="list-inline-item"><code class="notranslate">dunlop</code></li>
<li class="list-inline-item"><code class="notranslate">dupont</code></li>
<li class="list-inline-item"><code class="notranslate">dvag</code></li>
<li class="list-inline-item"><code class="notranslate">edeka</code></li>
<li class="list-inline-item"><code class="notranslate">emerck</code></li>
<li class="list-inline-item"><code class="notranslate">epson</code></li>
<li class="list-inline-item"><code class="notranslate">ericsson</code></li>
<li class="list-inline-item"><code class="notranslate">erni</code></li>
<li class="list-inline-item"><code class="notranslate">esurance</code></li>
<li class="list-inline-item"><code class="notranslate">etisalat</code></li>
<li class="list-inline-item"><code class="notranslate">Eurovision</code></li>
<li class="list-inline-item"><code class="notranslate">Everbank</code></li>
<li class="list-inline-item"><code class="notranslate">Extraspace</code></li>
<li class="list-inline-item"><code class="notranslate">Fage</code></li>
<li class="list-inline-item"><code class="notranslate">Fairwinds</code></li>
<li class="list-inline-item"><code class="notranslate">Farmers</code></li>
<li class="list-inline-item"><code class="notranslate">Fedex</code></li>
<li class="list-inline-item"><code class="notranslate">Ferrari</code></li>
<li class="list-inline-item"><code class="notranslate">Ferrero</code></li>
<li class="list-inline-item"><code class="notranslate">Fiat</code></li>
<li class="list-inline-item"><code class="notranslate">Fidelity</code></li>
<li class="list-inline-item"><code class="notranslate">Firstone</code></li>
<li class="list-inline-item"><code class="notranslate">Firdale</code></li>
<li class="list-inline-item"><code class="notranslate">Flickr</code></li>
<li class="list-inline-item"><code class="notranslate">Flir</code></li>
<li class="list-inline-item"><code class="notranslate">Flsmidth</code></li>
<li class="list-inline-item"><code class="notranslate">ford</code></li>
<li class="list-inline-item"><code class="notranslate">fox</code></li>
<li class="list-inline-item"><code class="notranslate">fresenius</code></li>
<li class="list-inline-item"><code class="notranslate">forex</code></li>
<li class="list-inline-item"><code class="notranslate">frogans</code></li>
<li class="list-inline-item"><code class="notranslate">frontier</code></li>
<li class="list-inline-item"><code class="notranslate">fujitsu</code></li>
<li class="list-inline-item"><code class="notranslate">fujixerox</code></li>
<li class="list-inline-item"><code class="notranslate">gallo</code></li>
<li class="list-inline-item"><code class="notranslate">gallup</code></li>
<li class="list-inline-item"><code class="notranslate">gap</code></li>
<li class="list-inline-item"><code class="notranslate">gbiz</code></li>
<li class="list-inline-item"><code class="notranslate">gea</code></li>
<li class="list-inline-item"><code class="notranslate">genting</code></li>
<li class="list-inline-item"><code class="notranslate">giving</code></li>
<li class="list-inline-item"><code class="notranslate">gle</code></li>
<li class="list-inline-item"><code class="notranslate">globo</code></li>
<li class="list-inline-item"><code class="notranslate">gmail</code></li>
<li class="list-inline-item"><code class="notranslate">gmo</code></li>
<li class="list-inline-item"><code class="notranslate">gmx</code></li>
<li class="list-inline-item"><code class="notranslate">godaddy</code></li>
<li class="list-inline-item"><code class="notranslate">goldpoint</code></li>
<li class="list-inline-item"><code class="notranslate">goodyear</code></li>
<li class="list-inline-item"><code class="notranslate">goog</code></li>
<li class="list-inline-item"><code class="notranslate">Google</code></li>
<li class="list-inline-item"><code class="notranslate">Grainger</code></li>
<li class="list-inline-item"><code class="notranslate">Guardian</code></li>
<li class="list-inline-item"><code class="notranslate">Gucci</code></li>
<li class="list-inline-item"><code class="notranslate">HBO</code></li>
<li class="list-inline-item"><code class="notranslate">HDFC</code></li>
<li class="list-inline-item"><code class="notranslate">HDFCbank</code></li>
<li class="list-inline-item"><code class="notranslate">Hermes</code></li>
<li class="list-inline-item"><code class="notranslate">Hitachi</code></li>
<li class="list-inline-item"><code class="notranslate">Hkt</code></li>
<li class="list-inline-item"><code class="notranslate">Honda</code></li>
<li class="list-inline-item"><code class="notranslate">Honeywell</code></li>
<li class="list-inline-item"><code class="notranslate">Hotmail</code></li>
<li class="list-inline-item"><code class="notranslate">Hsbc</code></li>
<li class="list-inline-item"><code class="notranslate">Hughes</code></li>
<li class="list-inline-item"><code class="notranslate">Hyatt</code></li>
<li class="list-inline-item"><code class="notranslate">Hyundai</code></li>
<li class="list-inline-item"><code class="notranslate">IBM</code></li>
<li class="list-inline-item"><code class="notranslate">IEEE</code></li>
<li class="list-inline-item"><code class="notranslate">IFM</code></li>
<li class="list-inline-item"><code class="notranslate">Ikano</code></li>
<li class="list-inline-item"><code class="notranslate">IMDB</code></li>
<li class="list-inline-item"><code class="notranslate">Infiniti</code></li>
<li class="list-inline-item"><code class="notranslate">Intel</code></li>
<li class="list-inline-item"><code class="notranslate">Intuit</code></li>
<li class="list-inline-item"><code class="notranslate">Ipiranga</code></li>
<li class="list-inline-item"><code class="notranslate">Iselect</code></li>
<li class="list-inline-item"><code class="notranslate">Itau</code></li>
<li class="list-inline-item"><code class="notranslate">ITV</code></li>
<li class="list-inline-item"><code class="notranslate">Iveco</code></li>
<li class="list-inline-item"><code class="notranslate">Jaguar</code></li>
<li class="list-inline-item"><code class="notranslate">java</code></li>
<li class="list-inline-item"><code class="notranslate">jcb</code></li>
<li class="list-inline-item"><code class="notranslate">jcp</code></li>
<li class="list-inline-item"><code class="notranslate">jeep</code></li>
<li class="list-inline-item"><code class="notranslate">jpmorgan</code></li>
<li class="list-inline-item"><code class="notranslate">juniper</code></li>
<li class="list-inline-item"><code class="notranslate">kddi</code></li>
<li class="list-inline-item"><code class="notranslate">kerryhotels</code></li>
<li class="list-inline-item"><code class="notranslate">kerrylogistics</code></li>
<li class="list-inline-item"><code class="notranslate">kerryproperties</code></li>
<li class="list-inline-item"><code class="notranslate">kfh</code></li>
<li class="list-inline-item"><code class="notranslate">kia</code></li>
<li class="list-inline-item"><code class="notranslate">kinder</code></li>
<li class="list-inline-item"><code class="notranslate">kindle</code></li>
<li class="list-inline-item"><code class="notranslate">komatsu</code></li>
<li class="list-inline-item"><code class="notranslate">kpmg</code></li>
<li class="list-inline-item"><code class="notranslate">kred</code></li>
<li class="list-inline-item"><code class="notranslate">kuokgroup</code></li>
<li class="list-inline-item"><code class="notranslate">lacaixa</code></li>
<li class="list-inline-item"><code class="notranslate">ladbrokes</code></li>
<li class="list-inline-item"><code class="notranslate">lamborghini</code></li>
<li class="list-inline-item"><code class="notranslate">lancaster</code></li>
<li class="list-inline-item"><code class="notranslate">lancia</code></li>
<li class="list-inline-item"><code class="notranslate">Lancome</code></li>
<li class="list-inline-item"><code class="notranslate">Landrover</code></li>
<li class="list-inline-item"><code class="notranslate">Lanxess</code></li>
<li class="list-inline-item"><code class="notranslate">Lasalle</code></li>
<li class="list-inline-item"><code class="notranslate">Latrobe</code></li>
<li class="list-inline-item"><code class="notranslate">LDS</code></li>
<li class="list-inline-item"><code class="notranslate">Leclerc</code></li>
<li class="list-inline-item"><code class="notranslate">Lego</code></li>
<li class="list-inline-item"><code class="notranslate">liaison</code></li>
<li class="list-inline-item"><code class="notranslate">lexus</code></li>
<li class="list-inline-item"><code class="notranslate">lidl</code></li>
<li class="list-inline-item"><code class="notranslate">lifestyle</code></li>
<li class="list-inline-item"><code class="notranslate">lilly</code></li>
<li class="list-inline-item"><code class="notranslate">lincoln</code></li>
<li class="list-inline-item"><code class="notranslate">linde</code></li>
<li class="list-inline-item"><code class="notranslate">lipsy</code></li>
<li class="list-inline-item"><code class="notranslate">lixil</code></li>
<li class="list-inline-item"><code class="notranslate">locus</code></li>
<li class="list-inline-item"><code class="notranslate">lotte</code></li>
<li class="list-inline-item"><code class="notranslate">lpl</code></li>
<li class="list-inline-item"><code class="notranslate">lplfinancial</code></li>
<li class="list-inline-item"><code class="notranslate">lundbeck</code></li>
<li class="list-inline-item"><code class="notranslate">lupin</code></li>
<li class="list-inline-item"><code class="notranslate">macys</code></li>
<li class="list-inline-item"><code class="notranslate">maif</code></li>
<li class="list-inline-item"><code class="notranslate">man</code></li>
<li class="list-inline-item"><code class="notranslate">mango</code></li>
<li class="list-inline-item"><code class="notranslate">marriott</code></li>
<li class="list-inline-item"><code class="notranslate">maserati</code></li>
<li class="list-inline-item"><code class="notranslate">mattel</code></li>
<li class="list-inline-item"><code class="notranslate">mckinsey</code></li>
<li class="list-inline-item"><code class="notranslate">metlife</code></li>
<li class="list-inline-item"><code class="notranslate">microsoft</code></li>
<li class="list-inline-item"><code class="notranslate">mini</code></li>
<li class="list-inline-item"><code class="notranslate">mit</code></li>
<li class="list-inline-item"><code class="notranslate">mitsubishi</code></li>
<li class="list-inline-item"><code class="notranslate">mlb</code></li>
<li class="list-inline-item"><code class="notranslate">mma</code></li>
<li class="list-inline-item"><code class="notranslate">monash</code></li>
<li class="list-inline-item"><code class="notranslate">mormone</code></li>
<li class="list-inline-item"><code class="notranslate">moto</code></li>
<li class="list-inline-item"><code class="notranslate">movistar</code></li>
<li class="list-inline-item"><code class="notranslate">msd</code></li>
<li class="list-inline-item"><code class="notranslate">mtn</code></li>
<li class="list-inline-item"><code class="notranslate">mtr</code></li>
<li class="list-inline-item"><code class="notranslate">mutual</code></li>
<li class="list-inline-item"><code class="notranslate">nadex</code></li>
<li class="list-inline-item"><code class="notranslate">nationalwide</code></li>
<li class="list-inline-item"><code class="notranslate">natura</code></li>
<li class="list-inline-item"><code class="notranslate">nba</code></li>
<li class="list-inline-item"><code class="notranslate">nec</code></li>
<li class="list-inline-item"><code class="notranslate">netflix</code></li>
<li class="list-inline-item"><code class="notranslate">neustar</code></li>
<li class="list-inline-item"><code class="notranslate">newholland</code></li>
<li class="list-inline-item"><code class="notranslate">nfl</code></li>
<li class="list-inline-item"><code class="notranslate">nhk</code></li>
<li class="list-inline-item"><code class="notranslate">Nike</code></li>
<li class="list-inline-item"><code class="notranslate">Nike</code></li>
<li class="list-inline-item"><code class="notranslate">Nikon</code></li>
<li class="list-inline-item"><code class="notranslate">Nissan</code></li>
<li class="list-inline-item"><code class="notranslate">Nissay</code></li>
<li class="list-inline-item"><code class="notranslate">Nokia</code></li>
<li class="list-inline-item"><code class="notranslate">Norton</code></li>
<li class="list-inline-item"><code class="notranslate">nra</code></li>
<li class="list-inline-item"><code class="notranslate">ntt</code></li>
<li class="list-inline-item"><code class="notranslate">obi</code></li>
<li class="list-inline-item"><code class="notranslate">office</code></li>
<li class="list-inline-item"><code class="notranslate">omega</code></li>
<li class="list-inline-item"><code class="notranslate">oracle</code></li>
<li class="list-inline-item"><code class="notranslate">orange</code></li>
<li class="list-inline-item"><code class="notranslate">otsuka</code></li>
<!--<li class="list-inline-item"><code class="notranslate">ovh</code></li>-->
<li class="list-inline-item"><code class="notranslate">panasonic</code></li>
<li class="list-inline-item"><code class="notranslate">pccw</code></li>
<li class="list-inline-item"><code class="notranslate">pfizer</code></li>
<li class="list-inline-item"><code class="notranslate">philips</code></li>
<li class="list-inline-item"><code class="notranslate">piaget</code></li>
<li class="list-inline-item"><code class="notranslate">pictet</code></li>
<li class="list-inline-item"><code class="notranslate">ping</code></li>
<li class="list-inline-item"><code class="notranslate">pioniere</code></li>
<li class="list-inline-item"><code class="notranslate">gioca</code></li>
<li class="list-inline-item"><code class="notranslate">playstation</code></li>
<li class="list-inline-item"><code class="notranslate">pohl</code></li>
<li class="list-inline-item"><code class="notranslate">politie</code></li>
<li class="list-inline-item"><code class="notranslate">praxi</code></li>
<li class="list-inline-item"><code class="notranslate">prod</code></li>
<li class="list-inline-item"><code class="notranslate">progressivo</code></li>
<li class="list-inline-item"><code class="notranslate">pru</code></li>
<li class="list-inline-item"><code class="notranslate">prudential</code></li>
<li class="list-inline-item"><code class="notranslate">pwc</code></li>
<!--<li class="list-inline-item"><code class="notranslate">quest</code></li>-->
<li class="list-inline-item"><code class="notranslate">qvc</code></li>
<li class="list-inline-item"><code class="notranslate">redstone</code></li>
<li class="list-inline-item"><code class="notranslate">reliance</code></li>
<li class="list-inline-item"><code class="notranslate">rexroth</code></li>
<li class="list-inline-item"><code class="notranslate">ricoh</code></li>
<li class="list-inline-item"><code class="notranslate">rmit</code></li>
<li class="list-inline-item"><code class="notranslate">rocher</code></li>
<li class="list-inline-item"><code class="notranslate">rogers</code></li>
<li class="list-inline-item"><code class="notranslate">rwe</code></li>
<li class="list-inline-item"><code class="notranslate">sicurezza</code></li>
<li class="list-inline-item"><code class="notranslate">sakura</code></li>
<li class="list-inline-item"><code class="notranslate">samsung</code></li>
<li class="list-inline-item"><code class="notranslate">sandvik</code></li>
<li class="list-inline-item"><code class="notranslate">sandvikcoromant</code></li>
<li class="list-inline-item"><code class="notranslate">sanofi</code></li>
<li class="list-inline-item"><code class="notranslate">sap</code></li>
<li class="list-inline-item"><code class="notranslate">saxo</code></li>
<li class="list-inline-item"><code class="notranslate">sbi</code></li>
<!--<li class="list-inline-item"><code class="notranslate">sbs</code></li>-->
<li class="list-inline-item"><code class="notranslate">sca</code></li>
<li class="list-inline-item"><code class="notranslate">scb</code></li>
<li class="list-inline-item"><code class="notranslate">schaeffler</code></li>
<li class="list-inline-item"><code class="notranslate">schmidt</code></li>
<li class="list-inline-item"><code class="notranslate">schwarz</code></li>
<li class="list-inline-item"><code class="notranslate">scjohnson</code></li>
<li class="list-inline-item"><code class="notranslate">scor</code></li>
<li class="list-inline-item"><code class="notranslate">seat</code></li>
<li class="list-inline-item"><code class="notranslate">sener</code></li>
<li class="list-inline-item"><code class="notranslate">ses</code></li>
<li class="list-inline-item"><code class="notranslate">sew</code></li>
<li class="list-inline-item"><code class="notranslate">seven</code></li>
<li class="list-inline-item"><code class="notranslate">sfr</code></li>
<li class="list-inline-item"><code class="notranslate">seek</code></li>
<li class="list-inline-item"><code class="notranslate">shangrila</code></li>
<li class="list-inline-item"><code class="notranslate">sharp</code></li>
<li class="list-inline-item"><code class="notranslate">shaw</code></li>
<li class="list-inline-item"><code class="notranslate">shell</code></li>
<li class="list-inline-item"><code class="notranslate">shriram</code></li>
<li class="list-inline-item"><code class="notranslate">sina</code></li>
<li class="list-inline-item"><code class="notranslate">sky</code></li>
<li class="list-inline-item"><code class="notranslate">skype</code></li>
<li class="list-inline-item"><code class="notranslate">smart</code></li>
<li class="list-inline-item"><code class="notranslate">sncf</code></li>
<li class="list-inline-item"><code class="notranslate">softbank</code></li>
<li class="list-inline-item"><code class="notranslate">sohu</code></li>
<li class="list-inline-item"><code class="notranslate">sony</code></li>
<li class="list-inline-item"><code class="notranslate">spiegel</code></li>
<li class="list-inline-item"><code class="notranslate">stada</code></li>
<li class="list-inline-item"><code class="notranslate">staples</code></li>
<li class="list-inline-item"><code class="notranslate">star</code></li>
<li class="list-inline-item"><code class="notranslate">starhub</code></li>
<li class="list-inline-item"><code class="notranslate">statebank</code></li>
<li class="list-inline-item"><code class="notranslate">statefarm</code></li>
<li class="list-inline-item"><code class="notranslate">statoil</code></li>
<li class="list-inline-item"><code class="notranslate">stc</code></li>
<li class="list-inline-item"><code class="notranslate">stcgroup</code></li>
<li class="list-inline-item"><code class="notranslate">suzuki</code></li>
<li class="list-inline-item"><code class="notranslate">swatch</code></li>
<li class="list-inline-item"><code class="notranslate">swiftcover</code></li>
<li class="list-inline-item"><code class="notranslate">symantec</code></li>
<li class="list-inline-item"><code class="notranslate">taobao</code></li>
<li class="list-inline-item"><code class="notranslate">target</code></li>
<li class="list-inline-item"><code class="notranslate">tatamotors</code></li>
<li class="list-inline-item"><code class="notranslate">tdk</code></li>
<li class="list-inline-item"><code class="notranslate">telecity</code></li>
<li class="list-inline-item"><code class="notranslate">telefonica</code></li>
<li class="list-inline-item"><code class="notranslate">temasek</code></li>
<li class="list-inline-item"><code class="notranslate">teva</code></li>
<li class="list-inline-item"><code class="notranslate">tiffany</code></li>
<li class="list-inline-item"><code class="notranslate">tjx</code></li>
<li class="list-inline-item"><code class="notranslate">toray</code></li>
<li class="list-inline-item"><code class="notranslate">toshiba</code></li>
<li class="list-inline-item"><code class="notranslate">totale</code></li>
<li class="list-inline-item"><code class="notranslate">toyota</code></li>
<li class="list-inline-item"><code class="notranslate">travelchannel</code></li>
<li class="list-inline-item"><code class="notranslate">viaggiatori</code></li>
<li class="list-inline-item"><code class="notranslate">tui</code></li>
<li class="list-inline-item"><code class="notranslate">tv</code></li>
<li class="list-inline-item"><code class="notranslate">ubs</code></li>
<li class="list-inline-item"><code class="notranslate">unicom</code></li>
<li class="list-inline-item"><code class="notranslate">uol</code></li>
<li class="list-inline-item"><code class="notranslate">ups</code></li>
<li class="list-inline-item"><code class="notranslate">avanguardia</code></li>
<li class="list-inline-item"><code class="notranslate">verisign</code></li>
<li class="list-inline-item"><code class="notranslate">vig</code></li>
<li class="list-inline-item"><code class="notranslate">viking</code></li>
<li class="list-inline-item"><code class="notranslate">virgin</code></li>
<li class="list-inline-item"><code class="notranslate">visa</code></li>
<li class="list-inline-item"><code class="notranslate">vista</code></li>
<li class="list-inline-item"><code class="notranslate">vistaprint</code></li>
<li class="list-inline-item"><code class="notranslate">vivo</code></li>
<li class="list-inline-item"><code class="notranslate">volkswagen</code></li>
<li class="list-inline-item"><code class="notranslate">volvo</code></li>
<li class="list-inline-item"><code class="notranslate">walmart</code></li>
<li class="list-inline-item"><code class="notranslate">walter</code></li>
<li class="list-inline-item"><code class="notranslate">weatherchannel</code></li>
<li class="list-inline-item"><code class="notranslate">weber</code></li>
<li class="list-inline-item"><code class="notranslate">weir</code></li>
<li class="list-inline-item"><code class="notranslate">williamhill</code></li>
<li class="list-inline-item"><code class="notranslate">windows</code></li>
<li class="list-inline-item"><code class="notranslate">wme</code></li>
<li class="list-inline-item"><code class="notranslate">wolterskluwer</code></li>
<li class="list-inline-item"><code class="notranslate">woodside</code></li>
<li class="list-inline-item"><code class="notranslate">wtc</code></li>
<li class="list-inline-item"><code class="notranslate">xbox</code></li>
<li class="list-inline-item"><code class="notranslate">xerox</code></li>
<li class="list-inline-item"><code class="notranslate">xfinity</code></li>
<li class="list-inline-item"><code class="notranslate">yahoo</code></li>
<li class="list-inline-item"><code class="notranslate">yamaxun</code></li>
<li class="list-inline-item"><code class="notranslate">yandex</code></li>
<li class="list-inline-item"><code class="notranslate">yodobashi</code></li>
<li class="list-inline-item"><code class="notranslate">youtube</code></li>
<li class="list-inline-item"><code class="notranslate">zappos</code></li>
<li class="list-inline-item"><code class="notranslate">zara</code></li>
<li class="list-inline-item"><code class="notranslate">zippo</code></li>
</ul>

Dal 18 marzo 2025 abbiamo aggiunto anche i seguenti territori francesi d'oltremare a questo elenco ([per questa richiesta GitHub](https://github.com/forwardemail/forwardemail.net/issues/327)):

<ul class="list-inline">
<li class="list-inline-item"><code class="notranslate">bzh</code></li>
<li class="list-inline-item"><code class="notranslate">gf</code></li>
<li class="list-inline-item"><code class="notranslate">gp</code></li>
<li class="list-inline-item"><code class="notranslate">mq</code></li>
<li class="list-inline-item"><code class="notranslate">nc</code></li>
<li class="list-inline-item"><code class="notranslate">pf</code></li>
<li class="list-inline-item"><code class="notranslate">pm</code></li>
<li class="list-inline-item"><code class="notranslate">re</code></li>
<li class="list-inline-item"><code class="notranslate">tf</code></li>
<li class="list-inline-item"><code class="notranslate">wf</code></li>
<li class="list-inline-item"><code class="notranslate">yt</code></li>
</ul>

Dall'8 luglio 2025 abbiamo aggiunto i seguenti Paesi specifici per l'Europa:

<ul class="list-inline">
<li class="list-inline-item"><code class="notranslate">ax</code></li>
<li class="list-inline-item"><code class="notranslate">bg</code></li>
<li class="list-inline-item"><code class="notranslate">fo</code></li>
<li class="list-inline-item"><code class="notranslate">gi</code></li>
<li class="list-inline-item"><code class="notranslate">gr</code></li>
<li class="list-inline-item"><code class="notranslate">hr</code></li>
<li class="list-inline-item"><code class="notranslate">hu</code></li>
<li class="list-inline-item"><code class="notranslate">lt</code></li>
<li class="list-inline-item"><code class="notranslate">lu</code></li>
<li class="list-inline-item"><code class="notranslate">mc</code></li>
<li class="list-inline-item"><code class="notranslate">mk</code></li>
<li class="list-inline-item"><code class="notranslate">mt</code></li>
<li class="list-inline-item"><code class="notranslate">ro</code></li>
<li class="list-inline-item"><code class="notranslate">sk</code></li>
<li class="list-inline-item"><code class="notranslate">va</code></li>
</ul>

Non abbiamo espressamente incluso `cz`, `ru` e `ua` a causa dell'elevata attività di spam.

### Quali sono i criteri della tua lista consentita? {#what-is-your-allowlist-criteria}

Disponiamo di un elenco statico di [estensioni di nomi di dominio consentite per impostazione predefinita](#what-domain-name-extensions-are-allowlisted-by-default) e gestiamo anche un elenco dinamico, memorizzato nella cache e variabile basato sui seguenti rigorosi criteri:

* Il dominio radice del mittente deve essere di tipo [estensione del nome di dominio che corrisponde all'elenco che offriamo nel nostro piano gratuito](#what-domain-name-extensions-can-be-used-for-free) (con l'aggiunta di `biz` e `info`). Includiamo anche corrispondenze parziali di `edu`, `gov` e `mil`, come `xyz.gov.au` e `xyz.edu.au`.
* Il dominio radice del mittente deve essere tra i primi 100.000 risultati univoci analizzati da [Elenco di popolarità degli ombrelli](http://s3-us-west-1.amazonaws.com/umbrella-static/index.html "Umbrella Popularity List") ("UPL").
* Il dominio radice del mittente deve essere tra i primi 50.000 risultati di domini radice univoci presenti in almeno 4 degli ultimi 7 giorni di UPL (\~50%+).
* Il dominio radice del mittente non deve essere di tipo [categorizzato](https://radar.cloudflare.com/categorization-feedback/) in quanto considerato contenuto per adulti o malware da Cloudflare.
* Il dominio radice del mittente deve avere record A o MX impostati. * Il dominio radice del mittente deve avere record A, record MX, record DMARC con `biz`0 o `biz`1, oppure un record SPF con qualificatore `biz`2 o `biz`3.

Se questo criterio viene soddisfatto, il dominio radice del mittente verrà memorizzato nella cache per 7 giorni. Si noti che il nostro processo automatizzato viene eseguito quotidianamente, quindi si tratta di una cache di tipo "rolling allowlist" che si aggiorna quotidianamente.

Il nostro processo automatizzato scaricherà gli UPL degli ultimi 7 giorni in memoria, li decomprimerà e li analizzerà in memoria secondo i rigorosi criteri sopra indicati.

Naturalmente sono inclusi i domini più popolari al momento in cui scrivo, come Google, Yahoo, Microsoft, Amazon, Meta, Twitter, Netflix, Spotify e altri ancora.

Se sei un mittente non presente nella nostra lista consentita, la prima volta che il tuo dominio radice FQDN o indirizzo IP invia un'email, sarai [tariffa limitata](#do-you-have-rate-limiting) e [inserito nella lista grigia](#do-you-have-a-greylist). Si noti che questa è una prassi standard adottata come standard per le email. La maggior parte dei client di posta elettronica tenterà di riprovare se riceve un errore di limite di velocità o di greylist (ad esempio, un codice di stato di errore di livello 421 o 4xx).

**Tieni presente che mittenti specifici come `a@gmail.com`, `b@xyz.edu` e `c@gov.au` possono comunque essere [inserito nella lista negata](#do-you-have-a-denylist)** (ad esempio se rileviamo automaticamente spam, phishing o malware da tali mittenti).

### Quali estensioni di dominio possono essere utilizzate gratuitamente {#what-domain-name-extensions-can-be-used-for-free}

A partire dal 31 marzo 2023 abbiamo applicato una nuova regola generale contro lo spam per proteggere i nostri utenti e il nostro servizio.

Questa nuova regola consente di utilizzare solo le seguenti estensioni di nomi di dominio nel nostro piano gratuito:

<ul class="list-inline">
<li class="list-inline-item"><code class="notranslate">ac</code></li>
<li class="list-inline-item"><code class="notranslate">ad</code></li>
<li class="list-inline-item"><code class="notranslate">ag</code></li>
<li class="list-inline-item"><code class="notranslate">ai</code></li>
<li class="list-inline-item"><code class="notranslate">al</code></li>
<li class="list-inline-item"><code class="notranslate">am</code></li>
<li class="list-inline-item"><code class="notranslate">app</code></li>
<li class="list-inline-item"><code class="notranslate">as</code></li>
<li class="list-inline-item"><code class="notranslate">at</code></li>
<li class="list-inline-item"><code class="notranslate">au</code></li>
<li class="list-inline-item"><code class="notranslate">ba</code></li>
<li class="list-inline-item"><code class="notranslate">be</code></li>
<li class="list-inline-item"><code class="notranslate">br</code></li>
<li class="list-inline-item"><code class="notranslate">by</code></li>
<li class="list-inline-item"><code class="notranslate">ca</code></li>
<li class="list-inline-item"><code class="notranslate">cc</code></li>
<li class="list-inline-item"><code class="notranslate">cd</code></li>
<li class="list-inline-item"><code class="notranslate">ch</code></li>
<li class="list-inline-item"><code class="notranslate">ck</code></li>
<li class="list-inline-item"><code class="notranslate">co</code></li>
<li class="list-inline-item"><code class="notranslate">com</code></li>
<li class="list-inline-item"><code class="notranslate">de</code></li>
<li class="list-inline-item"><code class="notranslate">dev</code></li>
<li class="list-inline-item"><code class="notranslate">dj</code></li>
<li class="list-inline-item"><code class="notranslate">dk</code></li>
<li class="list-inline-item"><code class="notranslate">ee</code></li>
<li class="list-inline-item"><code class="notranslate">es</code></li>
<li class="list-inline-item"><code class="notranslate">eu</code></li>
<li class="list-inline-item"><code class="notranslate">family</code></li>
<li class="list-inline-item"><code class="notranslate">fi</code></li>
<li class="list-inline-item"><code class="notranslate">fm</code></li>
<li class="list-inline-item"><code class="notranslate">fr</code></li>
<li class="list-inline-item"><code class="notranslate">gg</code></li>
<li class="list-inline-item"><code class="notranslate">gl</code></li>
<li class="list-inline-item"><code class="notranslate">id</code></li>
<li class="list-inline-item"><code class="notranslate">ie</code></li>
<li class="list-inline-item"><code class="notranslate">il</code></li>
<li class="list-inline-item"><code class="notranslate">im</code></li>
<li class="list-inline-item"><code class="notranslate">in</code></li>
<li class="list-inline-item"><code class="notranslate">io</code></li>
<li class="list-inline-item"><code class="notranslate">ir</code></li>
<li class="list-inline-item"><code class="notranslate">is</code></li>
<li class="list-inline-item"><code class="notranslate">it</code></li>
<li class="list-inline-item"><code class="notranslate">je</code></li>
<li class="list-inline-item"><code class="notranslate">jp</code></li>
<li class="list-inline-item"><code class="notranslate">ke</code></li>
<li class="list-inline-item"><code class="notranslate">kr</code></li>
<li class="list-inline-item"><code class="notranslate">la</code></li>
<li class="list-inline-item"><code class="notranslate">li</code></li>
<li class="list-inline-item"><code class="notranslate">lv</code></li>
<li class="list-inline-item"><code class="notranslate">ly</code></li>
<li class="list-inline-item"><code class="notranslate">md</code></li>
<li class="list-inline-item"><code class="notranslate">me</code></li>
<li class="list-inline-item"><code class="notranslate">mn</code></li>
<li class="list-inline-item"><code class="notranslate">ms</code></li>
<li class="list-inline-item"><code class="notranslate">mu</code></li>
<li class="list-inline-item"><code class="notranslate">mx</code></li>
<li class="list-inline-item"><code class="notranslate">net</code></li>
<li class="list-inline-item"><code class="notranslate">ni</code></li>
<li class="list-inline-item"><code class="notranslate">nl</code></li>
<li class="list-inline-item"><code class="notranslate">no</code></li>
<li class="list-inline-item"><code class="notranslate">nu</code></li>
<li class="list-inline-item"><code class="notranslate">nz</code></li>
<li class="list-inline-item"><code class="notranslate">org</code></li>
<li class="list-inline-item"><code class="notranslate">pl</code></li>
<li class="list-inline-item"><code class="notranslate">pr</code></li>
<li class="list-inline-item"><code class="notranslate">pt</code></li>
<li class="list-inline-item"><code class="notranslate">pw</code></li>
<li class="list-inline-item"><code class="notranslate">rs</code></li>
<li class="list-inline-item"><code class="notranslate">sc</code></li>
<li class="list-inline-item"><code class="notranslate">se</code></li>
<li class="list-inline-item"><code class="notranslate">sh</code></li>
<li class="list-inline-item"><code class="notranslate">si</code></li>
<li class="list-inline-item"><code class="notranslate">sm</code></li>
<li class="list-inline-item"><code class="notranslate">sr</code></li>
<li class="list-inline-item"><code class="notranslate">st</code></li>
<li class="list-inline-item"><code class="notranslate">tc</code></li>
<li class="list-inline-item"><code class="notranslate">tm</code></li>
<li class="list-inline-item"><code class="notranslate">to</code></li>
<li class="list-inline-item"><code class="notranslate">tv</code></li>
<li class="list-inline-item"><code class="notranslate">uk</code></li>
<li class="list-inline-item"><code class="notranslate">us</code></li>
<li class="list-inline-item"><code class="notranslate">uz</code></li>
<li class="list-inline-item"><code class="notranslate">vc</code></li>
<li class="list-inline-item"><code class="notranslate">vg</code></li>
<li class="list-inline-item"><code class="notranslate">vu</code></li>
<li class="list-inline-item"><code class="notranslate">ws</code></li>
<li class="list-inline-item"><code class="notranslate">xyz</code></li>
<li class="list-inline-item"><code class="notranslate">za</code></li>
</ul>

### Hai una greylist {#do-you-have-a-greylist}

Sì, utilizziamo una politica [e-mail greylisting](https://en.wikipedia.org/wiki/Greylisting_\(email\)) molto permissiva. La greylist si applica solo ai mittenti non presenti nella nostra lista consentita e rimane nella nostra cache per 30 giorni.

Per ogni nuovo mittente, memorizziamo una chiave nel nostro database Redis per 30 giorni, con un valore impostato sull'orario di arrivo iniziale della prima richiesta. Successivamente, respingiamo l'email con un codice di stato di retry pari a 450 e la lasciamo passare solo dopo 5 minuti.

Se hanno atteso con successo 5 minuti dall'orario di arrivo iniziale, le loro e-mail verranno accettate e non riceveranno il codice di stato 450.

La chiave è costituita dal dominio radice FQDN o dall'indirizzo IP del mittente. Ciò significa che qualsiasi sottodominio che superi la greylist supererà anche il dominio radice e viceversa (questo è ciò che intendiamo per politica "molto permissiva").

Ad esempio, se un'email proviene da `test.example.com` prima che vediamo un'email proveniente da `example.com`, qualsiasi email proveniente da `test.example.com` e/o `example.com` dovrà attendere 5 minuti dall'orario di arrivo iniziale della connessione. Non imponiamo che sia `test.example.com` che `example.com` attendano ciascuno il proprio intervallo di 5 minuti (la nostra politica di greylisting si applica a livello di dominio radice).

Si noti che la greylisting non si applica ad alcun mittente presente nel nostro [lista consentita](#do-you-have-an-allowlist) (ad esempio Meta, Amazon, Netflix, Google, Microsoft al momento della stesura di questo documento).

### Hai una denylist {#do-you-have-a-denylist}

Sì, gestiamo la nostra denylist e la aggiorniamo automaticamente in tempo reale e manualmente in base allo spam e alle attività dannose rilevate.

Inoltre, estraiamo tutti gli indirizzi IP dalla denylist di livello 1 di UCEPROTECT alle ore <http://wget-mirrors.uceprotect.net/rbldnsd-all/dnsbl-1.uceprotect.net.gz> ogni ora e li inseriamo nella nostra denylist con una scadenza di 7 giorni.

I mittenti presenti nella lista di rifiuto riceveranno un codice di errore 421 (che indica al mittente di riprovare più tardi) se [non sono ammessi](#do-you-have-an-allowlist).

Utilizzando un codice di stato 421 anziché 554, è possibile ridurre in tempo reale i potenziali falsi positivi e quindi il messaggio può essere recapitato correttamente al tentativo successivo.

**Questo è progettato a differenza di altri servizi di posta**, dove l'inserimento in una lista nera causa un errore irreversibile e permanente. Spesso è difficile chiedere ai mittenti di riprovare a inviare messaggi (soprattutto se si tratta di grandi organizzazioni), e pertanto questo approccio concede circa 5 giorni di tempo dal primo tentativo di posta elettronica affinché il mittente, il destinatario o noi possiamo intervenire e risolvere il problema (richiedendo la rimozione dalla lista nera).

Tutte le richieste di rimozione dalla lista di elementi negati vengono monitorate in tempo reale dagli amministratori (ad esempio, in modo che i falsi positivi ricorrenti possano essere definitivamente inseriti nella lista di elementi consentiti dagli amministratori).

Le richieste di rimozione dalla lista di rifiuto possono essere inoltrate a <https://forwardemail.net/denylist>.. Le richieste di rimozione dalla lista di rifiuto degli utenti paganti vengono elaborate immediatamente, mentre gli utenti non paganti devono attendere che gli amministratori elaborino la loro richiesta.

I mittenti rilevati come autori di spam o contenuti virali verranno aggiunti alla lista di posta indesiderata nel modo seguente:

1. [impronta digitale del messaggio iniziale](#how-do-you-determine-an-email-fingerprint) viene inserito nella greylist in caso di rilevamento di spam o blocco da parte di un mittente "attendibile" (ad esempio `gmail.com`, `microsoft.com`, `apple.com`).
* Se il mittente era incluso nella allowlist, il messaggio rimane nella greylist per 1 ora.
* Se il mittente non è incluso nella allowlist, il messaggio rimane nella greylist per 6 ore.
2. Analizziamo le chiavi di denylist dalle informazioni del mittente e del messaggio e per ciascuna di queste chiavi creiamo (se non ne esiste già uno) un contatore, lo incrementiamo di 1 e lo memorizziamo nella cache per 24 ore.
* Per i mittenti inclusi nella allowlist:
* Aggiungi una chiave per l'indirizzo email "MAIL FROM" della busta se ha un SPF valido o non ha SPF e non è [un nome utente del direttore delle poste](#what-are-postmaster-addresses) o [un nome utente che non accetta risposte](#what-are-no-reply-addresses). * Se l'intestazione "From" era inclusa nella lista consentita, aggiungere una chiave per l'indirizzo email dell'intestazione "From" se aveva un SPF positivo o un DKIM positivo e allineato.
* Se l'intestazione "From" non era inclusa nella lista consentita, aggiungere una chiave per l'indirizzo email dell'intestazione "From" e il relativo nome di dominio analizzato dalla radice.
* Per i mittenti non inclusi nella lista consentita:
* Aggiungere una chiave per l'indirizzo email della busta "MAIL FROM" se aveva un SPF positivo.
* Se l'intestazione "From" era inclusa nella lista consentita, aggiungere una chiave per l'indirizzo email dell'intestazione "From" se aveva un SPF positivo o un DKIM positivo e allineato.
* Se l'intestazione "From" non era inclusa nella lista consentita, aggiungere una chiave per l'indirizzo email dell'intestazione "From" e il relativo nome di dominio analizzato dalla radice.
* Aggiungere una chiave per l'indirizzo IP remoto del mittente.
* Aggiungere una chiave per il nome host risolto dal client tramite ricerca inversa dall'indirizzo IP del mittente (se presente). * Aggiungere una chiave per il dominio radice del nome host risolto dal client (se presente e se diverso dal nome host risolto dal client).
3. Se il contatore raggiunge 5 per un mittente e una chiave non inclusi nella lista consentita, la chiave verrà bloccata per 30 giorni e verrà inviata un'email al nostro team anti-abuso. Questi numeri potrebbero cambiare e gli aggiornamenti saranno riportati qui mentre monitoriamo gli abusi.
4. Se il contatore raggiunge 10 per un mittente e una chiave inclusi nella lista consentita, la chiave verrà bloccata per 7 giorni e verrà inviata un'email al nostro team anti-abuso. Questi numeri potrebbero cambiare e gli aggiornamenti saranno riportati qui mentre monitoriamo gli abusi.

> **NOTA:** A breve introdurremo il monitoraggio della reputazione. Il monitoraggio della reputazione calcolerà quando bloccare un mittente in base a una soglia percentuale (invece di un contatore rudimentale come indicato sopra).

### Hai un limite di velocità {#do-you-have-rate-limiting}

La limitazione della velocità del mittente viene effettuata tramite l'analisi del dominio radice tramite una ricerca PTR inversa sull'indirizzo IP del mittente oppure, se questa non produce risultati, utilizza semplicemente l'indirizzo IP del mittente. Si noti che di seguito lo chiameremo `Sender`.

I nostri server MX hanno limiti giornalieri per la posta in arrivo ricevuta per [archiviazione IMAP crittografata](/blog/docs/best-quantum-safe-encrypted-email-service):

* Invece di limitare la velocità della posta in arrivo ricevuta per ogni singolo alias (ad esempio `you@yourdomain.com`), applichiamo un limite di velocità in base al nome di dominio dell'alias stesso (ad esempio `yourdomain.com`). Questo impedisce a `Senders` di inondare contemporaneamente le caselle di posta di tutti gli alias del tuo dominio.
* Abbiamo limiti generali che si applicano a tutti i `Senders` del nostro servizio, indipendentemente dal destinatario:
* I `Senders` che consideriamo "affidabili" come fonte attendibile (ad esempio `gmail.com`, `microsoft.com`, `apple.com`) sono limitati all'invio di 100 GB al giorno.
* I `Senders` che sono [inserito nella lista consentita](#do-you-have-an-allowlist) sono limitati all'invio di 10 GB al giorno. * Tutti gli altri `yourdomain.com`0 sono limitati all'invio di 1 GB e/o 1000 messaggi al giorno.
* Abbiamo un limite specifico per `yourdomain.com`1 e `yourdomain.com`2 di 1 GB e/o 1000 messaggi al giorno.

I server MX limitano anche i messaggi inoltrati a uno o più destinatari tramite la limitazione della velocità, ma questo si applica solo a `Senders` e non a [lista consentita](#do-you-have-an-allowlist):

* Consentiamo solo fino a 100 connessioni all'ora, per dominio radice FQDN risolto `Sender` (o) indirizzo IP remoto `Sender` (se non è disponibile alcun reverse PTR) e per destinatario della busta. Memorizziamo la chiave per la limitazione della velocità come hash crittografico nel nostro database Redis.

* Se invii e-mail tramite il nostro sistema, assicurati di aver impostato un PTR inverso per tutti i tuoi indirizzi IP (altrimenti ogni dominio radice FQDN univoco o indirizzo IP da cui invii sarà soggetto a limitazioni di velocità).

* Tieni presente che se invii tramite un sistema diffuso come Amazon SES, non sarai soggetto a limitazioni di velocità poiché (al momento in cui scriviamo) Amazon SES è presente nella nostra lista consentita.

* Se invii da un dominio come `test.abc.123.example.com`, il limite di velocità verrà imposto a `example.com`. Molti spammer utilizzano centinaia di sottodomini per aggirare i comuni filtri antispam che limitano la velocità solo ai nomi host univoci, anziché ai domini radice con FQDN univoci.

* I `Senders` che superano il limite di frequenza verranno rifiutati con un errore 421.

I nostri server IMAP e SMTP limitano i tuoi alias ad avere più di `60` connessioni simultanee contemporaneamente.

I nostri server MX limitano i mittenti [non consentito](#do-you-have-an-allowlist) impedendo loro di stabilire più di 10 connessioni contemporanee (con una scadenza della cache di 3 minuti per il contatore, che rispecchia il timeout del nostro socket di 3 minuti).

### Come proteggersi dal backscatter {#how-do-you-protect-against-backscatter}

I bounce indirizzati erroneamente o bounce spam (noti come "[Retrodiffusione](https://en.wikipedia.org/wiki/Backscatter_\(email\))") possono causare una reputazione negativa agli indirizzi IP del mittente.

Per proteggerci dal backscatter adottiamo due misure, descritte in dettaglio nelle sezioni [Impedisci i rimbalzi degli spammer MAIL FROM noti](#prevent-bounces-from-known-mail-from-spammers) e [Previeni rimbalzi non necessari per proteggerti dalla retrodispersione](#prevent-unnecessary-bounces-to-protect-against-backscatter) di seguito.

### Impedisci i rimbalzi da parte di spammer MAIL FROM noti {#prevent-bounces-from-known-mail-from-spammers}

Estraiamo l'elenco da [Backscatter.org](https://www.backscatterer.org/) (con tecnologia [UCEPROTECT](https://www.uceprotect.net/)) alle <http://wget-mirrors.uceprotect.net/rbldnsd-all/ips.backscatterer.org.gz> ogni ora e lo inseriamo nel nostro database Redis (confrontiamo anche la differenza in anticipo, nel caso in cui siano stati rimossi degli IP che devono essere rispettati).

Se MAIL FROM è vuoto OPPURE è uguale (senza distinzione tra maiuscole e minuscole) a uno qualsiasi dei [indirizzi dei direttori delle poste](#what-are-postmaster-addresses) (la parte prima della @ in un'e-mail), allora controlliamo se l'IP del mittente corrisponde a uno di questo elenco.

Se l'IP del mittente è presente nell'elenco (e non nel nostro [lista consentita](#do-you-have-an-allowlist)), inviamo un errore 554 con il messaggio `The IP ${session.remoteAddress} is blocked by https://www.backscatterer.org/index.php?target=test&ip=${session.remoteAddress}`. Verremo avvisati se un mittente è presente sia nell'elenco Backscatterer che nella nostra allowlist, in modo da poter risolvere il problema se necessario.

Le tecniche descritte in questa sezione aderiscono alla raccomandazione "SAFE MODE" in <https://www.backscatterer.org/?target=usage>, in cui controlliamo l'IP del mittente solo se sono già state soddisfatte determinate condizioni.

### Impedisci rimbalzi non necessari per proteggerti dalla retrodispersione {#prevent-unnecessary-bounces-to-protect-against-backscatter}

I bounce sono email che indicano che l'inoltro dell'email al destinatario è fallito completamente e che l'email non verrà ritentata.

Un motivo comune per cui si viene inseriti nell'elenco Backscatterer sono i bounce indirizzati erroneamente o lo spam di bounce, quindi dobbiamo proteggerci da questo in alcuni modi:

1. Effettuiamo l'invio solo quando si verificano errori di codice di stato >= 500 (quando i tentativi di inoltro delle email non sono riusciti, ad esempio Gmail risponde con un errore di livello 500).

2. Inviamo una sola volta e una sola volta (utilizziamo una chiave di impronta digitale di bounce calcolata e la memorizziamo nella cache per evitare l'invio di duplicati). L'impronta digitale di bounce è una chiave che rappresenta l'impronta digitale del messaggio combinata con un hash dell'indirizzo di bounce e il suo codice di errore. Consulta la sezione su [impronte digitali](#how-do-you-determine-an-email-fingerprint) per maggiori informazioni su come viene calcolata l'impronta digitale del messaggio. Le impronte digitali di bounce inviate correttamente scadranno dopo 7 giorni nella nostra cache Redis.

3. Inviamo solo quando il campo MAIL FROM e/o From non è vuoto e non contiene (senza distinzione tra maiuscole e minuscole) un [nome utente del direttore delle poste](#what-are-postmaster-addresses) (la parte prima della @ in un'e-mail).

4. Non effettuiamo invii se il messaggio originale contiene una delle seguenti intestazioni (senza distinzione tra maiuscole e minuscole):

* Intestazione di `auto-submitted` con valore diverso da `no`.
* Intestazione di `x-auto-response-suppress` con valore `dr`, `autoreply`, `auto-reply`, `auto_reply` o `all`
* Intestazione di `list-id`, `list-subscribe`, `no`0, `no`1, `no`2, `no`3, `no`4, `no`5, `no`6 o `no`7 (indipendentemente dal valore). * Intestazione di `no`8 con valore `no`9, `x-auto-response-suppress`0, `x-auto-response-suppress`1, `x-auto-response-suppress`2 o `x-auto-response-suppress`3.

5. Non effettuiamo invii se l'indirizzo email MAIL FROM o From termina con `+donotreply`, `-donotreply`, `+noreply` o `-noreply`.

6. Non effettuiamo l'invio se la parte del nome utente dell'indirizzo e-mail Da era `mdaemon` e aveva un'intestazione senza distinzione tra maiuscole e minuscole di `X-MDDSN-Message`.

7. Non effettuiamo l'invio se è presente un'intestazione `content-type` di `multipart/report` che non distingue tra maiuscole e minuscole.

### Come si determina un'impronta digitale di un'email {#how-do-you-determine-an-email-fingerprint}

L'impronta digitale di un'e-mail viene utilizzata per determinare l'unicità di un'e-mail e per impedire che vengano recapitati messaggi duplicati e che venga inviato [rimbalzi duplicati](#prevent-unnecessary-bounces-to-protect-against-backscatter).

L'impronta digitale viene calcolata a partire dal seguente elenco:

* Nome host FQDN o indirizzo IP risolto dal client
* Valore dell'intestazione `Message-ID` (se presente)
* Valore dell'intestazione `Date` (se presente)
* Valore dell'intestazione `From` (se presente)
* Valore dell'intestazione `To` (se presente)
* Valore dell'intestazione `Cc` (se presente)
* Valore dell'intestazione `Subject` (se presente)
* Valore dell'intestazione `Body` (se presente)

### Posso inoltrare le email a porte diverse dalla 25 (ad esempio se il mio ISP ha bloccato la porta 25) {#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25}

Sì, abbiamo aggiunto questa funzionalità dal 5 maggio 2020. Al momento, la funzionalità è specifica per dominio, non per alias. Se hai bisogno che sia specifica per alias, contattaci per comunicarci le tue esigenze.

<div class="alert my-3 alert-danger">
<i class="fa fa-stop-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Protezione della privacy avanzata:
</strong>
<span>
Se hai un piano a pagamento (che offre una protezione della privacy avanzata), vai su <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Il mio account <i class="fa fa-angle-right"></i> Domini</a>, clicca su "Configura" accanto al tuo dominio e poi su "Impostazioni". Per saperne di più sui piani a pagamento, consulta la nostra pagina <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Prezzi</a>. In caso contrario, puoi continuare a seguire le istruzioni riportate di seguito. </span>
</div>

Se hai il piano gratuito, aggiungi semplicemente un nuovo record DNS <strong class="notranslate">TXT</strong> come mostrato di seguito, ma cambia la porta da 25 a quella che preferisci.

Ad esempio, se voglio che tutte le email indirizzate a `example.com` vengano inoltrate alla porta SMTP 1337 dei destinatari alias anziché alla porta 25:

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Nome/Host/Alias</th>
<th class="text-center">TTL</th>
<th>Tipo</th>
<th>Risposta/Valore</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", "." o vuoto</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email-port=1337</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Suggerimento:
</strong>
Lo scenario più comune per la configurazione personalizzata del port forwarding è quando si desidera inoltrare tutte le email dirette a example.com a una porta diversa da quella SMTP standard 25 su example.com. Per configurare questa impostazione, è sufficiente aggiungere il seguente record catch-all <strong class="notranslate">TXT</strong>.
<span>
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Nome/Host/Alias</th>
<th class="text-center">TTL</th>
<th>Tipo</th>
<th>Risposta/Valore</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", "." o vuoto</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=example.com</code></td>
</tr>
</tbody>
</table>

### Supporta il simbolo più + per gli alias di Gmail {#does-it-support-the-plus--symbol-for-gmail-aliases}

Sì, assolutamente.

### Supporta i sottodomini {#does-it-support-sub-domains}

Sì, assolutamente. Invece di usare "@", "." o spazi vuoti come nome/host/alias, puoi semplicemente usare il nome del sottodominio come valore.

Se vuoi che `foo.example.com` inoltri le email, inserisci `foo` come valore nome/host/alias nelle impostazioni DNS (sia per i record MX che <strong class="notranslate">TXT</strong>).

### Questo inoltra le intestazioni della mia email {#does-this-forward-my-emails-headers}

Sì, assolutamente.

### Questo è ben testato {#is-this-well-tested}

Sì, contiene test scritti con [ava](https://github.com/avajs/ava) e ha anche la copertura del codice.

### Trasmetti messaggi e codici di risposta SMTP {#do-you-pass-along-smtp-response-messages-and-codes}

Sì, assolutamente. Ad esempio, se si invia un'email a `hello@example.com` ed è registrata per l'inoltro a `user@gmail.com`, verranno restituiti il messaggio di risposta SMTP e il codice del server SMTP "gmail.com" invece del server proxy "mx1.forwardemail.net" o "mx2.forwardemail.net".

### Come prevenire gli spammer e garantire una buona reputazione nell'inoltro delle email {#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation}

Consultare le nostre sezioni su [Come funziona il tuo sistema di inoltro e-mail](#how-does-your-email-forwarding-system-work), [Come gestisci i problemi di recapito delle email?](#how-do-you-handle-email-delivery-issues) e [Come gestisci il blocco dei tuoi indirizzi IP?](#how-do-you-handle-your-ip-addresses-becoming-blocked) qui sopra.

### Come si eseguono le ricerche DNS sui nomi di dominio {#how-do-you-perform-dns-lookups-on-domain-names}

Abbiamo creato un progetto software open source chiamato [mandarino](https://github.com/forwardemail/tangerine) e lo utilizziamo per le ricerche DNS. I server DNS predefiniti utilizzati sono `1.1.1.1` e `1.0.0.1`, e le query DNS vengono eseguite tramite [DNS su HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") a livello applicativo.

:tangerine: [mandarino](https://github.com/tangerine) utilizza [per impostazione predefinita il servizio DNS consumer di CloudFlare che privilegia la privacy][cloudflare-dns].

## Account e fatturazione {#account-and-billing}

### Offrite una garanzia di rimborso sui piani a pagamento {#do-you-offer-a-money-back-guarantee-on-paid-plans}

Sì! I rimborsi automatici vengono effettuati quando esegui un upgrade, un downgrade o annulli il tuo account entro 30 giorni dall'attivazione del piano. Questo vale solo per i nuovi clienti.

### Se cambio piano, mi fate pagare in modo proporzionale e mi rimborsate la differenza {#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference}

Non effettuiamo rimborsi né ripartiamo la differenza quando cambi piano. Convertiamo invece la durata rimanente dalla data di scadenza del tuo piano attuale nella durata più prossima del tuo nuovo piano (arrotondata per difetto al mese).

Tieni presente che se effettui un upgrade o un downgrade tra piani a pagamento entro 30 giorni dall'avvio di un piano a pagamento, ti rimborseremo automaticamente l'intero importo dal tuo piano esistente.

### Posso utilizzare questo servizio di inoltro e-mail come server MX di "fallback" o "fallover" {#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server}

No, non è consigliato, poiché è possibile utilizzare un solo server di posta elettronica alla volta. I fallback di solito non vengono mai ritentati a causa di configurazioni errate delle priorità e del mancato rispetto del controllo delle priorità MX Exchange da parte dei server di posta.

### Posso disabilitare alias specifici {#can-i-disable-specific-aliases}

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Importante:
</strong>
<span>
Se hai un piano a pagamento, vai su <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Account personale <i class="fa fa-angle-right"></i> Domini</a> <i class="fa fa-angle-right"></i> Alias <i class="fa fa-angle-right"></i> Modifica alias <i class="fa fa-angle-right"></i> Deseleziona la casella di controllo "Attivo" <i class="fa fa-angle-right"></i> Continua.
</span>
</div>

Sì, basta modificare il record DNS <strong class="notranslate">TXT</strong> e aggiungere all'alias uno, due o tre punti esclamativi (vedi sotto).

Tieni presente che *dovresti* conservare la mappatura ":", poiché è necessaria se decidessi di disattivarla (e viene utilizzata anche per l'importazione se esegui l'upgrade a uno dei nostri piani a pagamento).

**Per un rifiuto silenzioso (al mittente sembra che il messaggio sia stato inviato correttamente, ma in realtà non va da nessuna parte) (codice di stato `250`):** Se si aggiunge "!" (un singolo punto esclamativo) a un alias, verrà restituito il codice di stato di successo `250` ai mittenti che tentano di inviare messaggi a questo indirizzo, ma i messaggi di posta elettronica non andranno da nessuna parte (ad esempio, un blackhole o `/dev/null`).

**Per il rifiuto soft (codice di stato `421`):** Se anteponi "!!" (doppio punto esclamativo) a un alias, verrà restituito un codice di stato di errore soft `421` ai mittenti che tentano di inviare email a questo indirizzo e le email verranno spesso ritentate fino a 5 giorni prima di essere rifiutate e respinte.

**Per il rifiuto definitivo (codice di stato `550`):** Se anteponi "!!!" (triplo punto esclamativo) a un alias, verrà restituito un codice di stato di errore permanente `550` ai mittenti che tentano di inviare email a questo indirizzo e le email verranno rifiutate e restituite al mittente.

Ad esempio, se voglio che tutte le email indirizzate a `alias@example.com` smettano di passare a `user@gmail.com` e vengano rifiutate e restituite (ad esempio, utilizzo tre punti esclamativi):

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Nome/Host/Alias</th>
<th class="text-center">TTL</th>
<th>Tipo</th>
<th>Risposta/Valore</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", "." o vuoto</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=!!!alias:user@gmail.com</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Suggerimento:
</strong>
<span>
Puoi anche riscrivere l'indirizzo del destinatario inoltrato semplicemente come "nobody@forwardemail.net", che non verrà inoltrato a nessuno, come nell'esempio seguente.
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Nome/Host/Alias</th>
<th class="text-center">TTL</th>
<th>Tipo</th>
<th>Risposta/Valore</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", "." o vuoto</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=!!!alias:nobody@forwardemail.net</code></td>
</tr>
</tbody>
</table>

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Suggerimento:
</strong>
<span>
Se desideri una maggiore sicurezza, puoi anche rimuovere la parte ":user@gmail.com" (o ":nobody@forwardemail.net"), lasciando solo "!!!alias" come nell'esempio seguente.
</span>
</div>

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Nome/Host/Alias</th>
<th class="text-center">TTL</th>
<th>Tipo</th>
<th>Risposta/Valore</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", "." o vuoto</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=!!!alias</code></td>
</tr>
</tbody>
</table>

### Posso inoltrare le email a più destinatari? {#can-i-forward-emails-to-multiple-recipients}

Sì, assolutamente. Basta specificare più destinatari nei record <strong class="notranslate">TXT</strong>.

Ad esempio, se voglio che un'e-mail indirizzata a `hello@example.com` venga inoltrata a `user+a@gmail.com` e `user+b@gmail.com`, il mio record <strong class="notranslate">TXT</strong> sarà simile a questo:

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Nome/Host/Alias</th>
<th class="text-center">TTL</th>
<th>Tipo</th>
<th>Risposta/Valore</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", o vuoto</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code class="cursor-initial" data-original-title="" title="">forward-email=hello:user+a@gmail.com,hello:user+b@gmail.com</code></td>
</tr>
</tbody>
</table>

Oppure puoi specificarli su due righe separate, in questo modo:

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Nome/Host/Alias</th>
<th class="text-center">TTL</th>
<th>Tipo</th>
<th>Risposta/Valore</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", o vuoto</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=hello:user+a@gmail.com</code></td>
</tr>
<tr>
<td><em>"@", ".", o vuoto</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=hello:user+b@gmail.com</code></td>
</tr>
</tbody>
</table>

Dipende da te!

### Posso avere più destinatari globali catch-all {#can-i-have-multiple-global-catch-all-recipients}

Certo, puoi farlo. Basta specificare più destinatari globali catch-all nei tuoi record <strong class="notranslate">TXT</strong>.

Ad esempio, se voglio che ogni email indirizzata a `*@example.com` (l'asterisco indica che è un carattere jolly, ovvero un carattere universale) venga inoltrata a `user+a@gmail.com` e `user+b@gmail.com`, il mio record <strong class="notranslate">TXT</strong> apparirà così:

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Nome/Host/Alias</th>
<th class="text-center">TTL</th>
<th>Tipo</th>
<th>Risposta/Valore</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", o vuoto</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=user+a@gmail.com,user+b@gmail.com</code></td>
</tr>
</tbody>
</table>

Oppure puoi specificarli su due righe separate, in questo modo:

<table class="table table-striped table-hover my-3">
<thead class="thead-dark">
<tr>
<th>Nome/Host/Alias</th>
<th class="text-center">TTL</th>
<th>Tipo</th>
<th>Risposta/Valore</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>"@", ".", o vuoto</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=user+a@gmail.com</code></td>
</tr>
<tr>
<td><em>@, ".", o vuoto</em></td>
<td class="text-center">3600</td>
<td class="notranslate">TXT</td>
<td><code>forward-email=user+b@gmail.com</code></td>
</tr>
</tbody>
</table>

Dipende da te!

### Esiste un limite massimo al numero di indirizzi email a cui posso inoltrare per alias {#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias}

Sì, il limite predefinito è 10. Questo NON significa che puoi avere solo 10 alias sul tuo nome di dominio. Puoi avere tutti gli alias che desideri (un numero illimitato). Significa che puoi inoltrare un solo alias a 10 indirizzi email univoci. Potresti avere `hello:user+1@gmail.com`, `hello:user+2@gmail.com`, `hello:user+3@gmail.com`, … (da 1 a 10) – e qualsiasi email a `hello@example.com` verrebbe inoltrata a `user+1@gmail.com`, `user+2@gmail.com`, `user+3@gmail.com`, … (da 1 a 10).

<div class="alert my-3 alert-primary">
<i class="fa fa-info-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Suggerimento:
</strong>
<span>
Hai bisogno di più di 10 destinatari per alias? Inviaci un'email e saremo lieti di aumentare il limite dei tuoi account.
</span>
</div>

### Posso inoltrare ricorsivamente le email {#can-i-recursively-forward-emails}

Sì, puoi farlo, ma devi comunque rispettare il limite massimo. Se hai `hello:linus@example.com` e `linus:user@gmail.com`, le email indirizzate a `hello@example.com` verranno inoltrate a `linus@example.com` e `user@gmail.com`. Tieni presente che verrà generato un errore se tenti di inoltrare ricorsivamente le email oltre il limite massimo.

### Le persone possono annullare la registrazione o registrare il mio inoltro e-mail senza la mia autorizzazione? {#can-people-unregister-or-register-my-email-forwarding-without-my-permission}

Utilizziamo la verifica dei record MX e <strong class="notranslate">TXT</strong>, quindi se aggiungi i rispettivi record MX e <strong class="notranslate">TXT</strong> di questo servizio, la tua registrazione è terminata. Se li rimuovi, la tua registrazione viene annullata. Hai la proprietà del tuo dominio e la gestione DNS, quindi se qualcuno vi accede, è un problema.

### Come è gratuito {#how-is-it-free}

Forward Email offre un livello gratuito attraverso una combinazione di sviluppo open source, infrastruttura efficiente e piani a pagamento opzionali che supportano il servizio.

Il nostro livello gratuito è supportato da:

1. **Sviluppo Open Source**: Il nostro codice sorgente è open source, consentendo contributi della comunità e un funzionamento trasparente.

2. **Infrastruttura efficiente**: abbiamo ottimizzato i nostri sistemi per gestire l'inoltro delle e-mail con risorse minime.

3. **Piani Premium a pagamento**: gli utenti che necessitano di funzionalità aggiuntive come l'invio SMTP, la ricezione IMAP o opzioni di privacy avanzate possono abbonarsi ai nostri piani a pagamento.

4. **Limiti di utilizzo ragionevoli**: il livello gratuito prevede politiche di utilizzo corretto per prevenire abusi.

> \[!NOTE]
> Ci impegniamo a mantenere gratuito l'inoltro email di base, offrendo al contempo funzionalità premium per gli utenti con esigenze più avanzate.

> \[!TIP]
> Se ritieni che il nostro servizio sia utile, valuta la possibilità di passare a un piano a pagamento per supportare lo sviluppo e la manutenzione continui.

### Qual è il limite massimo di dimensione dell'email {#what-is-the-max-email-size-limit}

Il limite predefinito è di 50 MB, che include contenuti, intestazioni e allegati. Tieni presente che servizi come Gmail e Outlook consentono solo un limite di 25 MB e, se superi il limite quando invii email a indirizzi di questi provider, riceverai un messaggio di errore.

Se viene superato il limite della dimensione del file, viene restituito un errore con il codice di risposta corretto.

### Memorizzi i registri delle email {#do-you-store-logs-of-emails}

No, non scriviamo su disco né memorizziamo registri: con [eccezione di errori](#do-you-store-error-logs) e [SMTP in uscita](#do-you-support-sending-email-with-smtp) (vedi [politica sulla riservatezza](/privacy)).

Tutto viene eseguito in memoria e [il nostro codice sorgente è su GitHub](https://github.com/forwardemail).

### Memorizzi i registri degli errori {#do-you-store-error-logs}

**Sì. Puoi accedere ai registri degli errori in [Il mio account → Registri](/my-account/logs) o [Il mio account → Domini](/my-account/domains).**

A partire da febbraio 2023, memorizziamo i registri degli errori per i codici di risposta SMTP `4xx` e `5xx` per un periodo di 7 giorni, che contengono l'errore SMTP, la busta e le intestazioni dell'email (**non** memorizziamo il corpo dell'email né gli allegati).

I log degli errori consentono di verificare la presenza di email importanti mancanti e di mitigare i falsi positivi di spam per [i tuoi domini](/my-account/domains). Sono anche un'ottima risorsa per il debug dei problemi con [webhook di posta elettronica](#do-you-support-webhooks) (poiché i log degli errori contengono la risposta dell'endpoint del webhook).

I registri degli errori per [limitazione della velocità](#do-you-have-rate-limiting) e [lista grigia](#do-you-have-a-greylist) non sono accessibili poiché la connessione termina prima (ad esempio, prima che possano essere trasmessi i comandi `RCPT TO` e `MAIL FROM`).

Per maggiori informazioni, consulta [politica sulla riservatezza](/privacy).

### Leggi le mie email? {#do-you-read-my-emails}

No, assolutamente no. Vedi il nostro [politica sulla riservatezza](/privacy).

Molti altri servizi di inoltro email archiviano e potrebbero potenzialmente leggere le tue email. Non c'è motivo per cui le email inoltrate debbano essere archiviate su disco, ed è per questo che abbiamo progettato la prima soluzione open source che fa tutto in memoria.

Crediamo che tu abbia diritto alla privacy e la rispettiamo rigorosamente. Il codice distribuito sul server è [software open source su GitHub](https://github.com/forwardemail) per garantire trasparenza e creare fiducia.

### Posso "inviare email come" in Gmail con questo {#can-i-send-mail-as-in-gmail-with-this}

Sì! Abbiamo aggiunto questa funzionalità dal 2 ottobre 2018. Vedi [Come inviare email usando Gmail](#how-to-send-mail-as-using-gmail) qui sopra!

Dovresti anche impostare il record SPF per Gmail nel record <strong class="notranslate">TXT</strong> della tua configurazione DNS.

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Importante:
</strong>
<span>
Se utilizzi Gmail (ad esempio, Invia messaggio come) o G Suite, dovrai aggiungere <code>include:_spf.google.com</code> al tuo record SPF <strong class="notranslate">TXT</strong>, ad esempio:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
</span>
</div>

### Posso "inviare posta come" in Outlook con questo {#can-i-send-mail-as-in-outlook-with-this}

Sì! Abbiamo aggiunto questa funzionalità il 2 ottobre 2018. Basta consultare i due link di Microsoft qui sotto:

* <https://support.office.com/en-us/article/add-or-remove-an-email-alias-in-outlook-com-459b1989-356d-40fa-a689-8f285b13f1f2>
* <https://support.office.com/en-us/article/send-email-from-a-different-address-in-outlook-com-ccba89cb-141c-4a36-8c56-6d16a8556d2e>

Dovresti anche impostare il record SPF per Outlook nel record <strong class="notranslate">TXT</strong> della configurazione DNS.

<div class="alert my-3 alert-warning">
<i class="fa fa-exclamation-circle font-weight-bold"></i>
<strong class="font-weight-bold">
Importante:
</strong>
<span>
Se utilizzi Microsoft Outlook o Live.com, dovrai aggiungere <code>include:spf.protection.outlook.com</code> al record SPF <strong class="notranslate">TXT</strong>, ad esempio:
<br /><br />
<code>v=spf1 a include:spf.forwardemail.net include:spf.protection.outlook.com -all</code>
</span>
</div>

### Posso "inviare posta come" in Apple Mail e iCloud Mail con questo {#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this}

Se sei abbonato a iCloud+, puoi utilizzare un dominio personalizzato. [Il nostro servizio è compatibile anche con Apple Mail](#apple-mail).

Per ulteriori informazioni, vedere <https://support.apple.com/en-us/102540>.

### Posso inoltrare un numero illimitato di email con questo {#can-i-forward-unlimited-emails-with-this}

Sì, tuttavia i mittenti "relativamente sconosciuti" hanno un limite di velocità di 100 connessioni all'ora per nome host o IP. Consultare la sezione [Limitazione della velocità](#do-you-have-rate-limiting) e [Greylisting](#do-you-have-a-greylist) qui sopra.

Con "relativamente sconosciuti" intendiamo i mittenti che non compaiono in [lista consentita](#do-you-have-an-allowlist).

Se questo limite viene superato, inviamo un codice di risposta 421 che indica al server di posta del mittente di riprovare più tardi.

### Offrite domini illimitati a un prezzo fisso {#do-you-offer-unlimited-domains-for-one-price}

Sì. Indipendentemente dal piano che scegli, pagherai una sola tariffa mensile, che copre tutti i tuoi domini.

### Quali metodi di pagamento accetti? {#which-payment-methods-do-you-accept}

Forward Email accetta i seguenti metodi di pagamento una tantum o mensili/trimestrali/annuali:

1. **Carte di credito/debito/Bonifici bancari**: Visa, Mastercard, American Express, Discover, JCB, Diners Club, ecc.
2. **PayPal**: Collega il tuo account PayPal per pagamenti facili
3. **Criptovalute**: Accettiamo pagamenti tramite le stablecoin di Stripe sulle reti Ethereum, Polygon e Solana

> \[!NOTE]
> Memorizziamo informazioni di pagamento limitate sui nostri server, che includono solo gli identificatori di pagamento e i riferimenti agli ID di transazione, cliente, abbonamento e pagamento [Banda](https://stripe.com/global) e [PayPal](https://www.paypal.com).

> \[!TIP]
> Per la massima privacy, valuta l'utilizzo di pagamenti in criptovaluta.

Tutti i pagamenti vengono elaborati in modo sicuro tramite Stripe o PayPal. I tuoi dati di pagamento non vengono mai memorizzati sui nostri server.

## Risorse aggiuntive {#additional-resources}

> \[!TIP]
> I nostri articoli qui sotto vengono aggiornati regolarmente con nuove guide, suggerimenti e informazioni tecniche. Tornate a trovarci spesso per i contenuti più recenti.

* [Casi di studio e documentazione per sviluppatori](/blog/docs)
* [Risorse](/resources)
* [Guide](/guides)

[gmail-2fa]: https://myaccount.google.com/signinoptions/two-step-verification

[cloudflare-dns]: https://blog.cloudflare.com/announcing-1111/